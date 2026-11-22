---
title: 排成一列
lead: "Thread 抢一个 counter、两个 core 的 cache、两份 ledger、GPU 里的 producer 和 consumer、八块卡上的 model：问的都是这些 operation 能不能排成一列；OS、hardware、network、blockchain 各课换的是谁来排、靠什么排、怎样让每份副本排出同一列。"
line: sys
---

Alice 的 account 里有 5 块钱，她同时发出两个 `withdraw(5)`。每个 `withdraw` 只碰 `bal` 两次：

```c
void withdraw(int amt) {
    int b = bal;            /* R：读 balance */
    if (b >= amt) {
        bal = b - amt;      /* W：写回 */
        dispense(amt);
    }
}
```

单独看这段 code 是对的：执行前 $\text{bal}\ge0$ 且 $\text{bal}+\text{paid}=5$，执行后仍然成立。两个 `withdraw` 一个接一个执行，第一个付出 5、`bal` 变成 0，第二个读到 0，什么也不做。

**第一处。** 两个 thread 各执行一个 `withdraw`，`bal` 是共享的 global variable。顺序是 T1 读、T2 读、T1 写、T2 写时，两个都读到 5，都通过检查，都付出 5，`bal` 是 0。一共付出 10。

**第二处。** 没有 bank，ledger 有两份：一份在 Bob 收款用的 node 上，一份在 Carol 的 node 上。Alice 签了两笔 transaction，用同一个 coin c 分别付给 Bob 和 Carol。每个 node 先检查“c 在我这份 ledger 上还没花”（R），通过后把它标成 spent（W），再把这件事告诉对方。两边的 R 都发生在对方的消息到达之前，两笔都被收下。这是 [IS4302 第 1 站](../courses/IS4302.html#hash)的 double spending。

::fig[thread-concurrency-double] 左边两个 thread 共用一个 `bal`，右边两个 node 各有一份 ledger。两边都是两个 R 在两个 W 之前，于是两次检查都看到“还有 5”。

两处的错是同一个：每个 operation 自己是对的，step 一交错，就出现了任何“一个接一个”的执行都不会出现的结果。各门课里的 race condition、lost update、coherence、memory consistency、double spend、consensus，问的都是：怎样保证执行的结果和把 operation 排成一列、一个一个做的结果相同；有多份副本时，怎样让每一份排出同一列。下面先把这件事推一遍，再逐门课看谁在排、靠什么排。

## 骨架：能不能排成一列

### 一次执行是 progress graph 上的一条路

把每个 operation 拆成 step。一个 step 是 machine 保证不可分割的最小动作：一次 load、一次 store、一条 atomic instruction、一个 node 处理一条消息。T1 的 step 是 $R_1,W_1$，T2 的是 $R_2,W_2$。一次 concurrent execution 就是把两串 step 合成一串，各自内部的先后不变，叫一个 interleaving。

画成图：横轴是 T1 走过的 step，纵轴是 T2 的。点 $(i,j)$ 表示 T1 做完了 $i$ 步、T2 做完了 $j$ 步，每一步向右（T1 走）或向上（T2 走）。一个 interleaving 就是从 $(0,0)$ 到 $(2,2)$ 的一条只向右、向上的路。CMU 15-213 把这种图叫 progress graph，路叫 trajectory。4 步里选 2 步给 T1，一共 $\binom42=6$ 条路，逐条执行：

| interleaving | 付出 | 经过 $(1,1)$ |
|---|---|---|
| R1 W1 R2 W2 | 5 | 否 |
| R1 R2 W1 W2 | 10 | 是 |
| R1 R2 W2 W1 | 10 | 是 |
| R2 R1 W1 W2 | 10 | 是 |
| R2 R1 W2 W1 | 10 | 是 |
| R2 W2 R1 W1 | 5 | 否 |

$(1,1)$ 是“两人都读过、都还没写”。经过它的 4 条全错，不经过的 2 条正是两个 serial order。[CS2106 第 3 站](../courses/CS2106.html#race)的 `counter = counter + 1` 是三步（load、add、store），两个 thread 有 $\binom63=20$ 条路；中间 4 个点都表示“两人都 load 过、都还没 store”，绕开它们只有沿边走的 2 条，其余 18 条都把 50 变成 51（程序枚举过）。CMU 15-213 把这些点叫 unsafe region，并且说：一条 trajectory 正确，当且仅当它不进 unsafe region。

::fig[thread-concurrency-progress] 左边是两个 withdraw，右边是两个 counter++。粗线是两条 serial 的路；着色的是 unsafe 的点。右图的虚线是 CS2106 那张 interleaving 图里的执行顺序，它穿过 unsafe region。

### 正确的标准：和一个 serial order 等价

为什么偏偏要求“和某个 serial order 的结果相同”？因为写 code 的人只能对单个 operation 做证明。`withdraw` 的证明是：执行前 invariant $\text{bal}\ge0,\ \text{bal}+\text{paid}=5$ 成立，执行完一个 `withdraw` 后仍成立。如果一次执行和 serial order $o_1,o_2,\dots,o_m$ 的结果相同，对 $k$ 做 induction：开始时 invariant 成立；$o_k$ 看到的正是 $o_{k-1}$ 留下的 state，invariant 成立，$o_k$ 保持它；所以最后仍成立。不等价的执行里，$o_k$ 看到的 state 可能是任何 serial 执行里都不出现的半成品：R1 R2 之后 T2 看到的“还有 5”，是 T1 已经决定付钱以后的 state。对单个 operation 的证明在这里用不上。

“结果相同”要说得能检查。两个 step **conflict**，指它们属于不同的 operation、访问同一个 item，而且至少一个是 write。Bernstein、Hadzilacos、Goodman 的 database 教材定义：两个 interleaving **equivalent**，如果它们把每一对 conflicting step 排成同样的先后。这个定义够用，理由有两条（设每个 operation 是 deterministic 的）：

- 一个 read 返回它之前最后一次 write 这个 item 的值。别的 operation 对同一个 item 的 write 都和这个 read conflict，它们在 read 之前还是之后，两个 equivalent 的 interleaving 一样；同一个 operation 自己的 write 和 read 由 program order 固定，也一样。所以每个 read 读到同一个值，每个 operation 走同样的 branch、写同样的值。
- 每个 item 最后的值来自最后一次 write 它的 step。同一个 item 上不同 operation 的 write 两两 conflict，先后一样，最后一个是同一个。

和某个 serial order equivalent 的 interleaving 叫 **serializable**。

### Serialization graph：没有 cycle 就能排成一列

检查 serializable，不必把 $m!$ 个 serial order 一个个试。给 interleaving $H$ 画一张 graph $SG(H)$：每个 operation 一个 node；$T_i$ 的某个 step 在 $H$ 里排在 $T_j$ 的某个 conflicting step 之前，就画 edge $T_i\to T_j$。

**Lemma.** 有限的 directed graph 没有 cycle，当且仅当能给 node 编号，使每条 edge 都从小号指向大号。

**Proof.** 有这样的编号时，cycle $T_1\to T_2\to\cdots\to T_1$ 会给出 $n(T_1)<n(T_2)<\cdots<n(T_1)$，不可能。反过来，没有 cycle 时一定有一个 node 没有 incoming edge：否则从任一 node 出发沿 incoming edge 往回走，走 $m$ 步经过 $m+1$ 个 node，必有一个重复，就是一个 cycle。给这个 node 编 1，删掉它，剩下的 graph 仍然没有 cycle，重复下去。这就是 topological sort。

**Theorem（Serializability Theorem）.** $H$ serializable 当且仅当 $SG(H)$ 没有 cycle。

**Proof.** “当”：按 lemma 的编号把 operation 排成 serial order $S$。任一对 conflicting step，$H$ 里 $T_i$ 的在前，就有 edge $T_i\to T_j$，$T_i$ 的编号小，$S$ 里 $T_i$ 整个在前。$S$ 和 $H$ 把每一对 conflicting step 排得一样，equivalent。

“仅当”：设 $H$ equivalent 于 serial order $S$。每条 edge $T_i\to T_j$ 来自一对 conflicting step，$H$ 里 $T_i$ 的在前，$S$ 里也在前；serial order 里 $T_i$ 的一个 step 在 $T_j$ 的一个 step 之前，就是整个 $T_i$ 在 $T_j$ 之前。于是 $S$ 里的位置就是一个让每条 edge 朝前的编号，按 lemma 没有 cycle。

拿 `withdraw` 核对。R1 R2 W1 W2：$R_2$ 在 $W_1$ 之前，edge $T_2\to T_1$；$R_1$ 在 $W_2$ 之前，edge $T_1\to T_2$。Cycle，不 serializable，和表里的“付出 10”一致。R1 W1 R2 W2：$W_1$ 在 $R_2$、$W_2$ 之前，$R_1$ 在 $W_2$ 之前，只有 $T_1\to T_2$，排成 $T_1,T_2$。

::fig[thread-concurrency-sg] 动图。第一帧是坏的那条路走完的样子：两条 edge 方向相反。之后先重放这条路，再走一条 serial 的路，看每一步多出了哪条 edge、为什么。

后面每门课里出事的执行，都能指出这样一个 cycle；每一个修法，都是在保证某种编号存在。

### 三种办法

**把一段变成一步。** Mutual exclusion 让 critical section（从 R 到 W 的那一段）在别人看来不可分割。Progress graph 上，“两人都在 critical section 里”的点围成一个矩形，unsafe 的点在它里面；lock 让任何 trajectory 都进不去这个矩形，CMU 15-213 叫它 forbidden region。进不去，就只能从矩形的左上方或右下方绕过，一人的 critical section 整个在另一人的之前，里面的 conflicting step 全部朝同一个方向，SG 里没有 cycle。TestAndSet、CAS、`fetch_add` 是 hardware 直接给的一步：读和写在一条 instruction 里，中间插不进别人的 step。

**给 operation 编号。** Lemma 说没有 cycle 等于存在一个让每条 edge 朝前的编号，所以很多 protocol 的正确性 proof 就是指出编号是什么。BHG 第 3 章的 two-phase locking：每个 transaction 先只拿 lock、后只放 lock，放了一个之后不再拿。记 $\text{lp}(T)$ 为 $T$ 拿完最后一个 lock 的时刻（lock point）。若 $T_i\to T_j$，两者有一对 conflicting step 落在同一个 item 上，$T_i$ 先拿这个 item 的 lock，在时刻 $a$ 放掉，$T_j$ 在时刻 $b>a$ 拿到；$T_i$ 放 lock 时已经拿完了所有 lock，$\text{lp}(T_i)<a$；$T_j$ 的 lock point 不早于它拿这个 lock 的时刻，$b\le\text{lp}(T_j)$。所以

$$\text{lp}(T_i)\ <\ a\ <\ b\ \le\ \text{lp}(T_j)$$

编号就是 lock point，cycle 会给出 $\text{lp}(T_1)<\cdots<\text{lp}(T_1)$。编号也可以事先发好写在 operation 上：后面的 nonce、sequence number、Raft 的 term 都是这样。

**让顺序无所谓。** 每个 operation 只有一步（atomic），而且任意两个 operation 谁先结果都一样（commute），那么每个 interleaving 都是 serial 的，所有 serial order 又给出同一个结果，连“是哪一列”都不必约定。两个 `fetch_add(&counter, 1)` 无论先后都得 52。

:::wrong 每次访问 bal 都加了 lock，withdraw 就安全了
```c
int  read_bal(void)   { lock(&L); int b = bal; unlock(&L); return b; }
void write_bal(int b) { lock(&L); bal = b;     unlock(&L); }
```
R1 R2 W1 W2 照样会发生：每个 R、每个 W 各自不可分割，可 T1 在 R 和 W 之间放掉了 L，T2 的 R 插了进来，SG 还是那个 cycle。Lock 要罩住一个 operation 里所有 conflicting 的 step；按 two-phase locking 的说法，T1 放掉 L 之后又去拿 L，违反了“放了之后不再拿”。
:::

### 有副本时：每份都按同一列执行

一块 memory 上，step 的先后由 memory 自己决定，只有一列。有副本时，每份副本各自执行，各有一列。Schneider 的 state machine approach 把要求写成：每个 replica 是一个 deterministic 的 state machine，output 只由它处理过的 request 序列决定；Replica Coordination 要求每个 non-faulty replica 收到每个 request（Agreement），并且按同样的相对顺序处理（Order）。两条都满足时，所有 replica 从同一个 initial state 出发，对同一串 command 一步步做下去，按 induction 每一步之后都相同。

开头第二处坏在 Order：Bob 的 node 先处理付给 Bob 的那笔，Carol 的 node 先处理付给 Carol 的那笔，两份 ledger 各自是一个合法的 serial order，但不是同一个。

这一列从哪里来，各课只有两种答案。

- **一个 serialization point。** 所有 request 都经过同一个地方，它看到的先后就是 order：IS4302 的 Scrooge、CS149 的 bus 和 directory、Raft 的 leader、ring all-reduce 里负责一段的那条路。代价是这个地方要被信任，而且要一直在。
- **Quorum。** 没有可以信任的单点，就要求每个决定拿到 $Q$ 个 node 的同意，并让任意两个 quorum 的重叠里至少有一个不会同意两次的 node。

$Q$ 要多大，用数票推。$n$ 个 node，honest 的 node 在同一个位置（同一个 height、同一个 term）上最多同意一次，至多 $f$ 个作恶的 node 可以同意任意多次。设这个位置上有 $m$ 个互相冲突的决定都拿到了 $Q$ 票。把所有票加起来，左边按决定数，右边按 node 数：

$$mQ\ \le\ (n-f)\cdot1+f\cdot m\qquad\Longrightarrow\qquad m\ \le\ \frac{n-f}{Q-f}$$

要 $m\le1$，需要 $\frac{n-f}{Q-f}<2$，即 $2Q>n+f$。另一方面作恶的 $f$ 个可以不投票，剩下的必须凑得够，$Q\le n-f$。两条合起来 $2(n-f)>n+f$，$n\ge3f+1$，这是 [IS4302 第 3 站](../courses/IS4302.html#pos)的结论。只会 crash、不会作恶时，没有 node 同意两次，第一条取 $f=0$ 得 $2Q>n$，就是 majority；crash 的 $f$ 个不投票，仍要 $Q\le n-f$，得 $n\ge2f+1$。Raft 是这一种：每个 server 每个 term 最多投一票，拿到 majority 才当 leader，所以每个 term 最多一个 leader。

$n=1$、$f=0$、$Q=1$ 是一把 lock：唯一的 node 就是 lock，“同意”就是被拿走，$m\le1$ 就是 mutual exclusion。[CS2106 第 4 站](../courses/CS2106.html#sema)证 binary semaphore 是 mutex 的那一行 $S_{\text{current}}=1-N_{\text{CS}}\ge0$，和这里的数票是同一个论证：资源一共 1 份，进去的人各拿走 1 份，出来之前不还。

::fig[thread-concurrency-quorum] 每一行上面一条是决定 X 拿到的 quorum，下面一条是冲突的决定 Y 拿到的。重叠里的 node 要同时同意 X 和 Y；只要重叠里有一个 honest 的，X 和 Y 就不可能都成立。

代入 IS4302 的 $n=9$、$Q=6$：$f=2$ 时 $m\le7/4$，只能是 1；$f=3$ 时 $m\le6/3=2$，两个冲突的 block 都可能 finalize，正是 IS4302 说的“作恶的少于 $n/3$ 才 safe”。

:::edge Serializable 不管真实时间
Serializable 只要求存在某个 serial order：T1 在 T2 开始之前就已经结束，排成 T2、T1 也算。对一个共享的 object（一个 register、一个 queue），通常还要求这一列不违背真实时间：已经结束的 operation 排在之后才开始的 operation 前面，这叫 linearizability。CS149 的 coherence 定义只要求保持每个 processor 的 program order，没有提真实时间。
:::

:::from
Conflict、equivalent、serializable、serialization graph 的定义和 Serializability Theorem 两个方向的 proof 来自 [Bernstein、Hadzilacos、Goodman, Concurrency Control and Recovery in Database Systems 第 2 章](https://microsoft.com/en-us/research/wp-content/uploads/2016/05/chapter2.pdf)（WebFetch 分节转述；书里的例子 history 和图在抽出的文字里是乱的，没有用）。Two-phase locking 的三条规则和“2PL 的 history 都 serializable”（Theorem 3.6，经由 Lemma 3.4、3.5）来自同一本书的[第 3 章](https://courses.cs.vt.edu/~cs5204/fall07-kafura/Papers/Transactions/Chapter3.pdf)（转述，那份文件没有书名页）；lock point 的那一行不等式是我写的。Progress graph、trajectory、unsafe region、“trajectory 正确当且仅当 safe”、semaphore 造出 forbidden region 来自 CMU 15-213 的 Synchronization: Basics 一讲，读的是 [ANU COMP2310 采用的同一份 slides](https://comp.anu.edu.au/courses/comp2310/assets/lectures/Week9-sync-basic.pdf)（CMU 原址拒绝抓取）。Replica Coordination 的 Agreement 与 Order、deterministic 的 state machine 来自 [Schneider 1990](https://pdos.csail.mit.edu/archive/6.824-2007/papers/schneider-rsm.pdf)（转述）；Raft 每个 term 一票、majority 当选、每个 term 至多一个 leader 来自 [Raft 论文 extended version](https://www.cs.bu.edu/~jappavoo/jappavoo.github.com/451/papers/raft-extended.pdf) 第 5.2 节（转述）。Withdraw 的例子、6 条和 20 条路的枚举（程序算过）、“equivalent 推出每个 read 读到同一个值”的论证、lemma 的证明、数票推出 $m\le(n-f)/(Q-f)$ 和 $2Q>n+f$、把 lock 看成 $n=1$ 的 quorum，是我写的。Linearizability 的那段凭我自己的知识写，没有读 Herlihy 和 Wing 的原文。
:::

## 各门课里的名字

| 站 | 叫法 | 谁在并发 | conflict 落在哪个 item 上 | 怎样得到一列 |
|---|---|---|---|---|
| [CS2106 第 3 站](../courses/CS2106.html#race) | race condition、critical section、mutual exclusion | thread | global variable `counter` | Peterson、TestAndSet spin lock |
| [CS2106 第 4 站](../courses/CS2106.html#sema) | semaphore、deadlock、circular wait | thread、process | buffer 的 slot、lock | semaphore invariant；lock ordering |
| [CS2030 第 8 站](../courses/CS2030.html#async) | race condition、parallel stream、`reduce` | `ForkJoinPool` 的 worker | `balance`、`ArrayList` | 不共享 mutable state；associative 的 accumulator |
| [CS149 第 5 站](../courses/STANFORD-CS149.html#gpu) | `atomicAdd`、`__syncthreads` | CUDA thread、block | `counts[A[i]]`、shared memory | commute 的 atomic；block 内的 barrier |
| [CS149 第 6 站](../courses/STANFORD-CS149.html#coherence) | coherence、SWMR、consistency、fence、data race | core 和它的 cache | 一条 cache line；不同 address 之间的 program order | bus 或 directory；`mfence` |
| [CS149 第 7 站](../courses/STANFORD-CS149.html#sync) | test-and-set、ticket lock、CAS、ABA | thread | lock word、stack 的 `top` | atomic instruction、CAS retry loop |
| [CMU-15442 第 5 站](../courses/CMU-15442.html#async) | mbarrier、phase、warp specialization | TMA、tensor core、warp | SMEM stage、TMEM | 四个 barrier |
| [CS2105 第 3、4 站](../courses/CS2105.html#rdt) | sequence number、ACK、window、ISN | sender 与 receiver | 编号相同的 packet | 编号与 cumulative ACK |
| [IS4302 第 1、4 站](../courses/IS4302.html#utxo) | double spending、UTXO、nonce | node、wallet | 同一个 output；同一个 account | Scrooge；UTXO set；nonce |
| [IS4302 第 2、3 站](../courses/IS4302.html#pow) | longest chain、finality、slashing | miner、validator | 同一个 height 上的 block | longest chain rule；2/3 quorum |
| [IS4302 第 5 站](../courses/IS4302.html#evm) | reentrancy、checks-effects-interactions | contract 和它调用的 contract | `balances[msg.sender]` | 先写再调用；lock |
| [CMU-10714 第 7 站](../courses/CMU-10714.html#memory)、[CS336 第 6 站](../courses/STANFORD-CS336.html#parallel) | data parallel、allreduce、parameter server、ZeRO | worker、rank | 每一份 parameter | 同一个 allreduce 的结果；每段一个 owner |

前六行只有一块 memory，order 由 memory 或 bus 给出，问题是不让 step 交错出 cycle；CMU-15442 那一行是同一块 shared memory 上的 producer 和 consumer；CS2105 之后，参与者之间只有会丢、会乱序的消息，编号和副本成了主角。NUS 的 CS3211（Concurrent Programming，还没有页面）按课程描述讲 lock-based synchronization、lock-free programming、message passing 和 memory model，正好横跨前六行。

## CS2106 与 CS2030：一块 memory 上的一列

[CS2106 第 3 站](../courses/CS2106.html#race)的结论，逐条换成骨架里的话：

- `counter = counter + 1` 丢掉一次加法：20 条路里 18 条进了 unsafe region，SG 是 $T_1\rightleftarrows T_2$。
- Flag lock 失败：`lock()` 本身就是一个 check-then-act，“读 flag”和“写 flag”两步，两个 `lock()` 自己就能走出 R1 R2 W1 W2 那种路。CS2106 表里的 6 步正是一条经过 $(1,1)$ 的路：Thread 1 读到 0，Thread 2 读到 0，Thread 2 写 1，Thread 1 写 1。
- Peterson 的 proof 里“`turn` 只有一个值，看谁最后写的”：两人对 `turn` 的写在 memory 上有一个先后，它是一个 serialization point，proof 用它决定谁让谁。下面 CS149 一节会看到，这个 proof 还暗中用了另一个 order。
- TestAndSet 把读和写合成一条 instruction，是“把一段变成一步”的 hardware 版本。

**Deadlock 是另一张 graph 上的 cycle。** [CS2106 第 4 站](../courses/CS2106.html#sema)两个 lock 反着拿的例子，画在 progress graph 上：

::fig[thread-concurrency-locks] 左边：T1 先 L1 后 L2，T2 先 L2 后 L1。右边：两人都先 L1 后 L2。粗线是一条 trajectory。

T1 拿着 L1 等 L2、T2 拿着 L2 等 L1 的那个 state，是左图灰色方块里的点：向右一步是 T1 拿 L2，撞进“两人都拿着 L2”的 forbidden region；向上一步是 T2 拿 L1，撞进另一块。两个方向都走不动，trajectory 停在那里。把“谁在等谁手里的东西”画成 waits-for graph，deadlock 就是它有 cycle；BHG 第 3 章的 database scheduler 正是定期在 waits-for graph 里找 cycle，找到就 abort 其中一个 transaction，和 CS2106 说的“很多 database 是这样做的”对得上。

CS2106 证明 lock ordering 不会有 circular wait 的那一行

$$a_1<a_2<\cdots<a_m<a_1$$

和 SG theorem 的“仅当”、和 two-phase locking 的 lock point，是同一个 lemma 用了三次：给 node 一个编号，每条 edge 都朝大号走，graph 就没有 cycle。三处的编号分别是 lock 的编号、serial order 里的位置、lock point 的时刻。右图就是 lock ordering：T2 也先拿 L1，L2 的 forbidden region 被包在 L1 的里面，不再夹出 deadlock region。[CS149 第 7 站](../courses/STANFORD-CS149.html#sync)的 hand-over-hand locking 不会 deadlock，用的是同一个编号：node 在 list 里的位置。

**CS2030：不共享就没有 edge。** [CS2030 第 8 站](../courses/CS2030.html#async)说 race condition 要两个条件：多个 thread 共享一个 state，而且这个 state 会被改。这正是 conflict 定义的后两条：同一个 item，至少一个是 write。CS2030 的办法是不共享 mutable state，lambda 写成[第 5 站](../courses/CS2030.html#fp)意义上的 pure function：没有 conflicting step，SG 里一条 edge 都没有，任何 interleaving 都 serializable。`forEach(x -> result.add(x))` 出错（6 次里 2 次少了元素，40861 和 26205），是因为 `ArrayList.add` 要读出 size、写进 element、写回 size + 1，又是一次 check-then-act。

`reduce` 走的是“让顺序无所谓”那条路，只是要无所谓的对象换成了括号。Parallel 时各段从 identity 开始，再两两合并，括号怎么加由 thread 的快慢决定。Associativity 保证每一种括号结果相同；identity 保证每段多出来的那个 identity 不改变结果。减法不 associative，sequential 得 $-10$，parallel 得 0。后面 data parallel 一节会看到，float 的加法也不 associative。

`CompletableFuture` 的 dependency 是一张事先画好的 graph：A 指向 B、C、D，B 和 C 指向 E。Pool 里的 thread 任意抢 task，但每个 task 要等所有指向它的 task 完成才开始，所以实际的执行顺序总是这张 graph 的一个 topological order。这张 graph 也必须没有 cycle：两个 future 互相等对方的结果，就是 deadlock。CS2030 那次运行里 B、C、D 都在 300 ms 开始，谁先谁后无所谓，因为它们之间没有 edge。

:::from
CS2106、CS2030 的例子、数字和 proof 取自这两页。Waits-for graph 和用 cycle 检测 deadlock 来自 [BHG 第 3 章](https://courses.cs.vt.edu/~cs5204/fall07-kafura/Papers/Transactions/Chapter3.pdf)（转述）。Flag lock、Peterson、TestAndSet 在骨架里的位置，三处编号是同一个 lemma，CompletableFuture 的执行顺序是 topological order，两种拿 lock 顺序的 progress graph，是我写的、画的。`ArrayList.add` 读写 size 凭我对它的实现的了解，没有对照 JDK 的源码。
:::

## STANFORD-CS149：hardware 给出的一列

### Coherence 是每个 address 各排一列

[CS149 第 6 站](../courses/STANFORD-CS149.html#coherence)的 coherence 定义是：对每一个 address，存在所有 processor 对它的 operation 的一个 serial order，每个 processor 自己的 operation 在其中保持 program order，每次 read 返回这个 order 里它之前最后一次 write 的值。这就是骨架里的 serializable，缩小了两处：item 只有一个 address，operation 只是一次 load 或 store。

SWMR（任何时刻一个 address 要么只有一个 processor 能读写，要么有多个 processor 只读）是给每条 cache line 配一把 readers-writer lock：

| MSI | 换成 lock 的说法 |
|---|---|
| M | 拿着 write lock，memory 里的值是旧的 |
| S | 拿着 read lock，可以有好几个人同时拿 |
| I | 什么都没拿 |
| BusRdX | 申请 write lock，其他人的 read lock 全部收回（invalidate） |
| 别人的 BusRd 让 M 降到 S | write lock 换成 read lock，先把改过的值交出来 |

Bus 或 directory 是这把 lock 的 serialization point：两个 BusRdX 同时发出，bus 一次只放一个上去，先上去的先拿到 M。

这张表直接解释 [CS149 第 7 站](../courses/STANFORD-CS149.html#sync)的 lock 为什么慢。Test-and-set 是一次 write，执行一次就要拿一次这条 line 的 write lock；$P-1$ 个等着的 thread 不停执行它，就是不停收回彼此的 write lock，line 在 cache 之间来回搬。Test-and-test-and-set 等待时只读，大家都拿着 read lock，没有 traffic。在一把 lock 上 spin，在 hardware 里是在另一把 lock 上排队。

### Consistency：跨 address 的 cycle

Coherence 让每个 address 各自排得出一列，CS149 的 litmus test 说明这还不够：

```
P0:  A = 1;  r1 = B;
P1:  B = 1;  r2 = A;
```

$(r_1,r_2)=(0,0)$ 时，A 和 B 各自都排得出一列，矛盾只在把两列合起来时出现。用 SG 看，这一次 node 是单个 memory operation，edge 有两种：program order（同一个 processor 前一个 operation 指向后一个），以及 conflicting operation 之间的先后。$r_1=0$ 说明 P0 读 B 在 P1 写 B 之前，$r_2=0$ 说明 P1 读 A 在 P0 写 A 之前：

$$\texttt{A=1}\ \xrightarrow{\ \text{program order}\ }\ \texttt{r1=B}\ \xrightarrow{\ \text{读到旧值}\ }\ \texttt{B=1}\ \xrightarrow{\ \text{program order}\ }\ \texttt{r2=A}\ \xrightarrow{\ \text{读到旧值}\ }\ \texttt{A=1}$$

一个 cycle。Lamport 1979 年给 sequential consistency 的定义是：任何执行的结果，都和所有 processor 的 operation 按某个 sequential order 执行的结果相同，并且每个 processor 的 operation 在这个 order 里按 program 规定的顺序出现。有 cycle 就排不出这样的 order，所以 SC 不允许 $(0,0)$；CS149 枚举 6 种交错得出的结论就是这个 cycle。TSO 放松 W→R 的 program order，等于删掉图里两条 program order 的 edge，cycle 断开，$(0,0)$ 被允许；`mfence` 把这两条 edge 补回来。

### Peterson 在 TSO 上

这个 litmus test 就是 Lamport 那篇 paper 里的例子：两个 process 各自先把自己的 flag 设成 1，再看对方的 flag，是 0 才进 critical section。Adve 和 Gharachorloo 的 tutorial 用同一段 code（他们叫 Dekker's algorithm）说明 write buffer 会让两个 read 都读到 0、两人都进去。[CS2106 第 3 站](../courses/CS2106.html#race)的 Peterson 多一个 `turn`，结果一样：

::fig[thread-concurrency-peterson] 动图。第一帧是结局：两人都在 critical section 里，四个 store 还停在各自的 store buffer 里。之后一步步重演。

CS2106 的 proof 断在哪一句，可以逐句对照。Proof 设 thread 0 最后写 `turn`；thread 1 写 `flag[1] = 1` 在它写 `turn` 之前，“那发生在 thread 0 写 `turn` 之前，也就在 thread 0 判断之前”。最后半句用的是 thread 0 自己“先写 `turn`、再读 `flag[1]`”的 program order，正是 TSO 放松的 W→R。图里 thread 0 的 `turn = 1` 还在 buffer 里，它对 `flag[1]` 的读已经从 memory 拿到了 0。

把两个 thread 执行 `lock()` 时的四个 memory operation（写 `flag[self]`、写 `turn`、读 `flag[other]`、读 `turn`）的所有执行枚举一遍，每个 thread 只试一次、两个 read 都做：

| model | 执行的个数 | 两人都进 critical section |
|---|---|---|
| SC：store 立刻进 memory | 70 | 0 |
| TSO：store 先进 FIFO 的 store buffer，load 先查自己的 buffer，drain 到 memory 也算一个 step | 74,844 | 12,434 |
| TSO，在 `turn = other` 之后加 `mfence` | 3,696 | 0 |

SC 的 70 是 $\binom84$。OSTEP 说 Peterson 在现代 hardware 上不加 memory barrier 会失效，这张表是它在 TSO 下的具体样子；`mfence` 放在写完 `turn`、开始读之前，补回的正是 proof 用到的那条 W→R。

:::wrong Peterson's algorithm 的 mutual exclusion 已经证明过了，在哪台 machine 上都对
CS2106 的 proof 是在 SC 下做的，它假设每个 thread 的 operation 按 program order 被别人看到。x86 实现的大致是 TSO，上表 TSO 那一行里，74,844 种执行有 12,434 种两人同时在 critical section 里。Proof 没有错，错在拿它去推一台前提不成立的 machine。
:::

**DRF 为什么让一般的 program 不必管这些。** CS149 说 data-race-free 的 program 在 relaxed 的 hardware 上表现得和 SC 一样。用 SG 的话说：data race 是一对没有被 synchronization 排好先后的 conflicting access；DRF 的 program 里，每一对 conflicting access 之间都隔着同一把 lock 的 unlock 和 lock，而 library 的 lock 里放好了 fence。于是每条 conflict edge 都和“这把 lock 被谁先拿到”同向，lock 被拿到的先后是一列，edge 合起来不会有 cycle。Peterson 自己就是在实现 lock，处在这个保证的下面一层，所以 fence 要自己放。

### GPU：block 不能等 block

`atomicAdd(&counts[A[i]], 1)` 走的是“让顺序无所谓”：加法 commute，所以 CS149 说 atomic 只保证 mutual exclusion，不要求哪个 block 先跑。`__syncthreads()` 是 block 内的 barrier，它把一个 block 的 thread 分成“搬进 shared memory”和“从 shared memory 读”两段，所有 conflict edge 都从前一段指向后一段。

[CS149 第 5 站](../courses/STANFORD-CS149.html#gpu)举的反例里，block 1 spin 等 block 0 写 flag，会 deadlock。同样一段 spin 放在 CS2106 的单 CPU 上，只是浪费：

::fig[thread-concurrency-spin] 上面是 CS2106 的例子：4 个 thread 抢一把 lock，持有者 H 在 critical section 里被换下。下面是 CS149 的例子：SM 只放得下一个 block。

两边差在 Coffman 四个 condition 的第三个，no preemption。CPU 上 timer interrupt 会把 spin 的 thread 换下，H 迟早回到 CPU 上 unlock，CS2106 算出浪费 $3\times10=30$ ms。GPU 的 block 一旦开始就占着 SM 的资源，所有 thread 结束才释放，没有人会把 block 1 换下来：block 1 拿着 SM 等 flag，block 0 等 SM，四个 condition 全部成立。

:::from
Coherence 的定义、SWMR、MSI、test-and-set 与 TTAS 的 traffic、litmus test 和它的 6 种交错、TSO、fence、DRF、`atomicAdd` 的 histogram、block 之间 spin 的 deadlock 取自 CS149 页面，30 ms 取自 CS2106 页面。SC 的定义（前半句是原文）和两个 process 互看 flag 的例子来自 [Lamport 1979](https://www.engineering.upenn.edu/~leebcc/teachdir/ece252_fall11/Lamport.pdf)（WebFetch 转述）；write buffer 让 Dekker's algorithm 两边都读到 0、SC 的 program order 与 write atomicity 两条要求来自 [Adve、Gharachorloo 的 tutorial](https://www.csl.cornell.edu/courses/ece5750/adve.tr95.pdf) 第 5.1.1 与 5.4 节（转述，读了前 94%）。MSI 与 readers-writer lock 的对照、litmus test 写成 SG 的 cycle、Peterson 的 proof 断在哪一句、DRF 的 SG 解释、spin 在 CPU 和 GPU 上差在 no preemption，是我写的；Peterson 的三行表是用程序枚举的。
:::

## CMU-15442：mbarrier 就是 semaphore

[CMU-15442 第 5 站](../courses/CMU-15442.html#async)的 warp specialization 和 [CS2106 第 4 站](../courses/CS2106.html#sema)的 bounded buffer 是同一个 program。CS2106 用三个 semaphore：notFull（空 slot 的个数，初值 $K$）、notEmpty（满 slot 的个数，初值 0）、mutex。CMU-15442 给每个 SMEM stage 配一对 mbarrier：

| CS2106 的 bounded buffer | CMU-15442 Lab 3 |
|---|---|
| $K$ 个 slot 的 `buf` | PIPE_DEPTH 个 SMEM stage |
| producer：`produce()`，放进 `buf[in]` | TMA warp：把一块 A、B 搬进 stage $k\bmod K$ |
| consumer：从 `buf[out]` 取出，`consume()` | MMA warp：从 stage 读 A、B，发 MMA |
| `wait(notFull)` | 等 mma2tma：这个 stage 可以重写 |
| `signal(notEmpty)` | TMA 搬够 byte 数，tma2mma 完成一轮 |
| `wait(notEmpty)` | 等 tma2mma：数据已在 SMEM |
| `signal(notFull)` | `tcgen05.commit`：MMA 算完，mma2tma 完成一轮 |
| notFull 初值 $K$：producer 前 $K$ 次不等 | producer 的 phase 初值 1：每个 stage 第一次等待直接通过 |
| notEmpty 初值 0：consumer 第一次就等 | consumer 的 phase 初值 0：等 producer 把这一轮凑满 |

CS2106 的 mutex 在 Lab 3 里没有对应：那里只有一个 producer warp 和一个 consumer warp，`in` 只有 producer 改，`out` 只有 consumer 改，不会有两个人改同一个 index。CMU-15442 说两边 phase 的初值写反会 deadlock；在 CS2106 这边，相当于把 notFull 的初值写成 0：producer 第一次就去等一个从没装过东西的 stage 被腾空，consumer 在等 producer。

同一组数在两边各走一遍。CMU-15442 双缓冲的例子：4 块 tile，load 每块 3，MMA 每块 2，两个 stage。按 CS2106 的规则：producer 放第 $i$ 块之前 `wait(notFull)`，也就是 stage $i\bmod2$ 上一次装的第 $i-2$ 块已经被 consume 完；consumer 取第 $i$ 块之前 `wait(notEmpty)`。

::fig[thread-concurrency-ring] 动图：竖线沿 timeline 走，上面是这一刻两个 stage 的状态和两个 semaphore 的值。

L0 在 $[0,3]$，L1 在 $[3,6]$，M0 在 $[3,5]$。L2 要写 stage 0，得等 M0 在 5 结束时的 `signal(notFull)`，producer 自己到 6 才空出来，于是 L2 在 $[6,9]$。依此类推，M3 在 $[12,14]$，总共 14，和 CMU-15442 页面的时间线一样。$K=1$ 时 L1 要等 M0，变成搬一块算一块，$4\times(3+2)=20$。

Stage 为什么要 4 个。Lab 3 的第 7 步（PIPE_DEPTH 2）比第 6 步还慢，第 8 步加到 4 才到 1057 TFLOP/s；README 的解释是 2 个 stage 时 producer 最多领先 1 块，有一次 load 比 MMA 慢，MMA 就要停。用 bounded buffer 的话说，notFull 的初值就是 producer 能领先的上限。取 8 块 tile，load 依次用 1、1、1、7、1、1、1、7（平均 2.5），MMA 每块 3，按同样的规则模拟：

::fig[thread-concurrency-depth] 同一串 load 和 MMA，上面 2 个 stage，下面 4 个。

| $K$ | 最后一个 MMA 结束 | MMA 空等的总时间 |
|---|---|---|
| 1 | 44 | 19 |
| 2 | 33 | 8 |
| 3 | 27 | 2 |
| 4 | 25 | 0 |

25 是下限：第一块 load 用 1，之后 MMA 连做 8 块，$1+8\times3=25$。平均起来 producer 比 consumer 快，可是 buffer 太浅时，producer 在快的几块里攒不下余量，慢的一块一来 consumer 就断粮。$K=4$ 时 producer 在第 3 块开始搬之前已经搬好了 3 块，正好盖住用 7 的那一次。

:::from
四个 barrier 的方向和初始化计数、phase 的初值和写反会 deadlock、第 6 到 8 步的 TFLOP/s 与 README 对 PIPE_DEPTH 的解释、load 3 与 MMA 2 的双缓冲例子取自 CMU-15442 页面；三个 semaphore 的 bounded buffer 和它们的初值取自 CS2106 页面。逐行的对应表、single producer single consumer 时不需要 mutex、notFull 的初值是 producer 能领先的上限、1、1、1、7 那组 load 和 $K$ 从 1 到 4 的模拟（程序算过），是我做的。
:::

## CS2105 与 CS149：会绕回来的编号

[CS149 第 7 站](../courses/STANFORD-CS149.html#sync)的 ABA problem：CAS 只比较 pointer 的值，看不出 A 离开过又回来。修法之一是在 top 旁边放一个每次 pop 都加 1 的 counter，用 double-wide CAS 一起比较。Counter 只有 $k$ bit 时，它自己也会绕回来：

::fig[thread-concurrency-wrap] 左右两个圈都只有 4 个值。左边绕回来的是 tag，右边是 sequence number。

取 $k=2$，每次成功的 CAS 都把 tag 加 1。T1 读到 (A, 0) 后被换下；T2 做了四次：pop A（tag 1）、pop B（2）、push D（3）、push A（0）。Stack 现在是 A → D → C，top 又是 (A, 0)，T1 的 CAS 成功，把 top 设成它早先读到的 B，而 B 已经 free 了，D 也从 stack 上丢了。只做三次（CS149 的例子：pop A、pop B、push A），tag 是 3，CAS 失败，修法有效。

[CS2105 第 3 站](../courses/CS2105.html#rdt)的 Selective Repeat 困境是同一件事：编号只有 $k$ bit，receiver 收到编号 0，分不清它是新的 pkt0 还是 sender 重发的旧 pkt0。CS2105 推出 SR 要 $N\le2^{k-1}$、GBN 要 $N\le2^k-1$。CAS 这边照样能推：从 T1 读完到 T1 做 CAS，别人可能已经成功 CAS 了 $0,1,\dots,M$ 次，这 $M+1$ 种情况里只有 0 次时 T1 应该成功，所以这 $M+1$ 种情况下的 tag 必须两两不同，$M+1\le2^k$，即 $M\le2^k-1$。这和 GBN 的推法相同：GBN 的 receiver 只等一个编号，sender 可能在重发它前面 $N$ 个里的任何一个，也是 $N+1$ 种情况分 $2^k$ 个编号。

| | 编号记的是 | 可能同时在路上的 | 要求 |
|---|---|---|---|
| CS2105 stop-and-wait | 第几个 packet | 1 个 | 0、1 两个编号 |
| CS2105 GBN | 第几个 packet | sender window 里的 $N$ 个，加上新的 1 个 | $N\le2^k-1$ |
| CS2105 SR | 第几个 packet | 两个 window，$2N$ 个 | $N\le2^{k-1}$ |
| CS149 带 tag 的 CAS | top 被成功改了几次 | T1 读完之后的 $M$ 次 | $M\le2^k-1$ |
| CMU-15442 mbarrier 的 phase | 这个 barrier 完成了几轮（奇偶） | 1 轮 | 1 bit |

最后一行接上一节。Mbarrier 的 phase 只有 1 bit，第 $k$ 次等待传 $k\bmod2$。它够用，靠的是 bounded buffer 的结构：producer 要等 consumer 腾出 stage $s$ 才能再写它，所以 stage $s$ 的 tma2mma 不可能比 consumer 多完成两轮。Stop-and-wait 只用 0 和 1 的理由一样：没收到 ACK 就不发下一个，在路上的永远只有一个。

不想算 bound，就让编号不绕回来。[IS4302 第 4 站](../courses/IS4302.html#utxo)的 account model：每个 account 的 nonce 每笔 transaction 加 1，被人原样再广播一次的 transaction 带着旧 nonce，被拒绝。这是 CS2105 的 receiver 丢掉重复 packet 的做法，只是编号不循环。Raft 的 term 只增不减，收到带着旧 term 的 request 一律拒绝，一个以为自己还是 leader 的旧 leader 因此什么也做不成。TCP 随机选 ISN（[CS2105 第 4 站](../courses/CS2105.html#tcp)）是第三种办法：编号仍会绕回，但让旧 connection 遗留的编号几乎不可能恰好落进新 connection 的 window。

:::from
ABA 的三步例子和 double-wide CAS 取自 CS149 页面；SR 的困境、$N\le2^{k-1}$、GBN 的 $N\le2^k-1$、stop-and-wait 的 0 与 1、随机 ISN 取自 CS2105 页面；mbarrier 的 phase 取自 CMU-15442 页面；nonce 防 replay 取自 IS4302 页面。Raft 的 term 是 logical clock、只增不减、带旧 term 的 request 被拒绝来自 [Raft 论文](https://www.cs.bu.edu/~jappavoo/jappavoo.github.com/451/papers/raft-extended.pdf)第 5.1 节（转述）。四次 CAS 让 2-bit tag 绕回 0 的例子、$M\le2^k-1$ 的推导和它与 GBN 的对应、phase 与 stop-and-wait 的对应、对比表，是我写的。
:::

## IS4302：没有共享的 memory 时，谁来排

**Double spend 是 SG 里的 cycle。** 开头第二处，tx1 和 tx2 都花 coin c，各自读“c 还没花”、写“c 已 spent”。Bob 的 node 上 tx1 先，Carol 的 node 上 tx2 先，合起来两个 R 都在两个 W 之前，$\text{tx}_1\rightleftarrows\text{tx}_2$。[IS4302 第 1 站](../courses/IS4302.html#hash)从 GoofyCoin 走到 ScroogeCoin，就是加了一个 serialization point：所有 transaction 都由 Scrooge 一个人检查、记账，“检查尚未花掉，再记下”在他那里是一步。Nakamoto 论文那句“确认一笔 transaction 没有发生过的唯一办法是知道所有 transaction”，换成这里的话：一个 node 只看自己那份副本的一列，看不出另一份副本里有没有冲突的 W。

**UTXO 的 conflict 是精确的。** [IS4302 第 4 站](../courses/IS4302.html#utxo)的 UTXO model 里，一笔 transaction 读写的 item 就是它的 input 指向的那几个 output。两笔 transaction conflict，当且仅当它们花同一个 output；不 conflict 的 transaction 之间 SG 没有 edge，按什么顺序验证都行，这就是 IS4302 对比表里的“不碰同一个 output 的 transaction 互不影响”。Account model 里，同一个 account 的每笔 transaction 都读写同一个 balance 和 nonce，两两 conflict，必须排成一列，nonce 就是事先发好的号：lemma 里的编号直接写在 transaction 上。

**Longest chain 给出一列会变的 order。** [IS4302 第 2 站](../courses/IS4302.html#pow)的 chain 就是全网约定的那一列 transaction。Fork 时两条 branch 各是一列，longest chain rule 选其中一列。Private attack 成功，意味着约定的那一列改了：tx1 从 chain 上消失，冲突的 tx2 占了它的位置。IS4302 算出 $q=0.3$、等 6 个 confirmation 时这件事的 probability 是 13.2%。Nakamoto consensus 给的是一列以越来越高的 probability 不再变的 order，没有哪个时刻之后它保证不变，这就是 IS4302 说的没有 finality。

**Proof of stake 的 finality 就是骨架里的数票。** [IS4302 第 3 站](../courses/IS4302.html#pos)的 validator 在每个 epoch 只签一个 block，签两个会被 slashing，这就是“honest 的 node 在同一个位置最多同意一次”。Quorum 图第三行就是 IS4302 的 $n=9$、$Q=6$。Slashing 多给了一样东西：一旦 $m=2$，数票时多出来的那些票一定来自签了两次的 validator，两个 signature 本身就是证据。

**Reentrancy 是没有 thread 的 race。** [IS4302 第 5 站](../courses/IS4302.html#evm)的 `withdrawAll` 先读 `amount`、转钱，最后才写 `balances[msg.sender] = 0`。转钱把控制权交给 attacker 的 `receive()`，它再调一次 `withdrawAll`。外层是 $T_1$，里层是 $T_2$：$R_1$（读到 75）、$R_2$（也读到 75）、$W_2$、$W_1$，正是骨架那张 progress graph 上经过 $(1,1)$ 的 R1 R2 W2 W1，SG 是同一个 cycle。IS4302 的例子嵌套了 5 层，每一层都夹在外面各层的 R 和 W 之间，Bank 付出 375。

EVM 只有一个 thread，interleaving 只可能发生在 external call 处。这有两个推论。第一，checks-effects-interactions 把 W 挪到 external call 之前，R 和 W 之间不再有交错的机会，这段 check-then-act 自动不可分割。第二，IS4302 提到的另一个修法“加一个锁”，就是 CS2106 那个会失败的 flag lock：

```solidity
bool locked;
modifier noReentry() {
    require(!locked);   // 读 flag
    locked = true;      // 写 flag
    _;
    locked = false;
}
```

`require(!locked)` 和 `locked = true` 之间没有 external call，没有人插得进来，这个 flag lock 在 EVM 里是对的。CS2106 里它错，是因为 timer interrupt 能落在任意两条 instruction 之间。同一段 code 对不对，取决于交错可能发生在哪里。

:::wrong 只有多个 thread 才会有 race condition
Reentrancy 只有一个 thread，照样走出 R1 R2 W2 W1。Race 要的是两个 operation 的 step 交错，交错可以来自 thread 调度，也可以来自一次把控制权交出去的 call。判断一段 check-then-act 安不安全，先找出它中间所有可能交出控制权的地方：CS2106 是每两条 instruction 之间，EVM 是每个 external call。
:::

:::from
Double spending、GoofyCoin 与 ScroogeCoin、Nakamoto 论文第 2 节那句话、UTXO 与 account 的对比表和 nonce、longest chain 与 private attack 的 13.2%、validator 一个 epoch 只签一次与 slashing、$n=9$ 与 $Q=6$、`withdrawAll` 的 5 层与 375、checks-effects-interactions 和“加一个锁”取自 IS4302 页面。Double spend 与 reentrancy 写成 SG 的 cycle、UTXO 的 conflict 与 nonce 的编号、longest chain 是一列会变的 order、reentrancy guard 是 CS2106 的 flag lock 以及它为什么在 EVM 里成立，是我写的；那段 Solidity modifier 是我按 IS4302 的描述写的通行写法。
:::

## CMU-10714 与 STANFORD-CS336：data parallel 是 state machine replication

[CMU-10714 第 7 站](../courses/CMU-10714.html#memory)的 data parallel：每个 worker 一份完整的 model，各对 $B/P$ 个 sample 算 gradient，allreduce 求和，再各自做同样的 optimizer step。按 Schneider 的两条看：state 是 parameter 和 optimizer state，command 是“用这个 gradient 做一步”，Agreement 是每个 worker 都拿到这一步的 gradient，Order 是大家一步一步按同样的顺序做，optimizer step 是 deterministic 的。所以 $P$ 份 replica 始终相同，任何一份都可以拿去存 checkpoint。

这要求 allreduce 给每个 worker 的结果 bitwise 相同。CS2030 的 `reduce` 已经提醒过：结果和括号有关时，不同的人按不同的括号算，会得到不同的答案。Float 的加法就是这样：

::fig[thread-concurrency-allreduce] 左边每个 rank 自己加，右边 ring 里每一段只加一次。

四个 rank 的 gradient 是 float32 的 0.1、0.2、0.3、0.4。如果每个 rank 从自己那份开始沿 ring 加一圈，rank 2 算的是 $((0.3+0.4)+0.1)+0.2=1.0000001$，另外三个是 1.0，差 1 个 ulp，$2^{-23}\approx1.19\times10^{-7}$。取 $w=0.2$、learning rate 0.1，一步之后 rank 2 的 $w$ 是 0.09999999，另外三个是 0.1：四份 replica 从这一步起不再相同，之后每一步都在不同的 $w$ 上算 forward。[CS336 第 6 站](../courses/STANFORD-CS336.html#parallel)的 ring all-reduce 是 reduce-scatter 接 all-gather：每一段在 ring 上只沿一条路加一次，加完的结果再原样拷给每个 rank。这一段的“加”只发生在一处，它就是这一段的 serialization point；all-gather 只拷 byte，不再计算。所以 ring all-reduce 给每个 rank 的是同一串 bit。

:::wrong Data parallel 算出的 gradient 和一张卡上算的完全一样
CMU-10714 的论证在实数上成立：gradient 的和可以拆成每个 worker 那一份的和，再相加。Float 的和与括号有关：一张卡上 $B$ 个 sample 按一种顺序加，$P$ 个 worker 先各加 $B/P$ 个、再 allreduce 是另一种顺序，上面的 0.1 到 0.4 换一个顺序就差了一个 ulp。Data parallel 保证的是 $P$ 份 replica 彼此相同，不保证和单卡 bitwise 相同；换一个 worker 数，最后几位也会变。
:::

**Parameter server：一个 Scrooge，以及放弃 Order。** CMU-10714 的另一种写法是 parameter server：worker `push` gradient，server 加起来、更新 weight，worker 再 `pull`。Server 是 serialization point。如果 server 不等齐所有 worker，谁的 gradient 先到就先用，worker 手里的 weight 就是若干步之前的：它算 gradient 时读的是旧的 $w$，写回的 update 却作用在新的 $w$ 上，和 `withdraw` 里读到旧的 `bal` 是同一个形状。Hogwild（Niu 等人 2011）连 server 也不要：多个 processor 不加 lock，直接在 shared memory 里更新同一个 parameter vector。单个 component 的加法是 atomic 的（paper 说可以用 compare-and-exchange 实现），这是“让顺序无所谓”的那一步；可一次 SGD 要改的几个 component 之间不保证不可分割，读到的 $x$ 也可能是很多个 cycle 之前的。Paper 承认 processor 可能 overwrite 彼此的 progress，论证是在 sparse 的问题里每一步只碰很少几个 component，这种 overwrite 很少，带来的误差很小。这是有意放弃 serializability：允许 SG 里有 cycle，换来不用 lock 的速度，再用 sparsity 说明 cycle 少到不影响 convergence。

**ZeRO：每一段只有一个 writer。** [CS336 第 6 站](../courses/STANFORD-CS336.html#parallel)和 [CMU-15442 第 2 站](../courses/CMU-15442.html#dist)的 ZeRO 让每个 rank 只负责更新 $1/N$ 的 parameter：reduce-scatter 之后，这一段 gradient 的和只在它的 owner 那里，owner 用自己那份 optimizer state 更新，再 all-gather 给大家，别的 rank 拿到的只是用完就丢的只读副本。每一段 parameter 恰好一个 writer，这是 CS149 的 SWMR 换了单位：cache line 换成 shard，M 换成 owner。

:::from
Data parallel 的流程、allreduce、parameter server 的 push 与 pull 取自 CMU-10714 页面；ring all-reduce 等于 reduce-scatter 加 all-gather、ZeRO 每块卡负责 $1/N$ 的 parameter 取自 CS336 和 CMU-15442 页面。Hogwild 不加 lock、processor 可能 overwrite 彼此的 progress、sparse 时 overwrite 少而误差小、单个 component 的加法用 compare-and-exchange 做成 atomic、读到的值可能是旧的，来自 [Niu 等人 2011 的 paper](https://ar5iv.arxiv.org/html/1106.5730)（WebFetch 读了 abstract 和第 1 到 3 节的转述，第 4 节的收敛证明没有读）。DDP 按 Schneider 的 Agreement 与 Order 来读、float32 的四种加法顺序和一步 SGD 之后的 $w$（程序算过）、ring 里每一段只加一次所以 bitwise 相同、asynchronous SGD 与 `withdraw` 的同形、ZeRO 是 SWMR，是我写的。“asynchronous SGD 里 server 谁先到先用”凭我自己的知识写，CMU-10714 页面只讲了同步的 push 与 pull。
:::
