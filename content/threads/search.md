---
title: 搜索
lead: "从 BFS、Dijkstra、A\\* 到 branch and bound、RRT\\*、MCTS 和 LLM 的 best-of-N：同一个 loop，同一个“什么时候可以停”的 proof，各门课换的是 node、bound 和 successor 的来路。"
line: ml
---

手里有一个 start state S、一个 goal test，和一个 function `successors(s)`：给它一个 state，它返回一步能到的 state 和这一步的 cost。要找从 S 到 goal 最便宜的 path。下面这张 graph 是 [CS2109S 第 1 站](../courses/CS2109S.html#search)用的那张。我们看得到全貌：从 S 到 G 一共六条 path，最便宜的是 S-A-C-B-G，cost 8。Algorithm 看不到。它 expand 了 S 之后，知道的只有三条长度为 1 的 path 和它们的 cost。

::fig[thread-search-view] Algorithm 眼里的 graph。下一步 expand 哪一个，以及找到一条到 G 的 path 之后能不能停，都只能根据这三个 node 来决定。

假设某一刻 algorithm 已经找到一条到 G 的 path，cost 是 $C'$。它能不能停？没见过的 path 可能非常多，每一条都是从 frontier 里某个 node 往下长出来的。要说“没有更便宜的了”，algorithm 必须对 frontier 里的每个 node 说出一个数：从它往下长出来的任何 solution，cost 至少是这么多。这些数全都不小于 $C'$，才能停。

BFS 和 DFS 手里没有这样的数。BFS 在这张 graph 上返回 cost 11 的 S-C-G，DFS 返回 cost 9 的 S-A-B-G，它们都没有办法知道自己不对。这条线的主角就是这个数，一个 **lower bound**。下面先把“有了 lower bound 怎样搜、凭什么能停”完整推一遍，它是 Dijkstra、UCS、A\*、branch and bound、CBS 共用的一个 proof。然后逐门课看它换成了什么名字；在 sampling-based planning、MCTS 和 LLM 的 best-of-N 里 lower bound 拿不到了，各门课用什么顶替。最后是 CS3231 给出的边界：space 无限大时，有 lower bound 也证明不了“没有 solution”。

## 骨架：一个 loop，两个条件

### 只看得见 successor

Algorithm 保存的是 path。一条从 start 出发的 path 记成一个 node：末端的 state、parent node、到这里的 cost $g$。已经生成、还没 expand 的 node 放在 frontier 里：

```python
def search(start, successors, is_goal, f):
    frontier = PriorityQueue()             # 每次 pop f 最小的
    frontier.push(Node(start, parent=None, g=0))
    while not frontier.empty():
        n = frontier.pop()                 # (1) priority f
        if is_goal(n.state):               # (2) pop 时做 goal test
            return n
        for s2, cost in successors(n.state):   # (3) successor
            frontier.push(Node(s2, parent=n, g=n.g + cost))
    return None
```

Priority $f$ 取 depth 是 BFS，取 $-$depth 是 DFS，取 $g$ 是 UCS，取 $g+h$ 是 A\*。后面每门课改动的都是这三行注释之一。

### 停下来要一张 certificate

记 $C(n)$ 为从 node $n$ 往下长出来的所有 solution 里最便宜的 cost（长不出 solution 时是 $\infty$），$C^*=C(\text{root})$。两个条件：

- **P1（lower bound）**：frontier 里的每个 node 都有 $f(n)\le C(n)$；goal node 的 $f$ 等于它自己的 $g$。
- **P2（cover）**：任何时刻，每一个 solution 都是从 frontier 里某个 node 往下长出来的。

**Theorem.** P1、P2 成立时，loop 第一次 pop 出的 goal node $n^\circ$ 满足 $g(n^\circ)=C^*$。

**Proof.** 先说明 P2 一直成立。开始时 frontier 里只有 root，每个 solution 都从 root 长出来。设某一刻成立，pop 出一个不是 goal 的 $n$：从 $n$ 长出来的 solution，第一步一定走到 $n$ 的某个 successor，而所有 successor 刚刚都被 push 进了 frontier；不经过 $n$ 的 solution 不受影响。所以 P2 继续成立。

现在设 pop 出了 goal node $n^\circ$。任取一个 solution $p$，按 P2 它从 frontier 里某个 node $m$ 长出来（$m$ 可以就是 $n^\circ$），于是

$$\text{cost}(p)\ \ge\ C(m)\ \ge\ f(m)\ \ge\ f(n^\circ)\ =\ g(n^\circ)$$

第一个 $\ge$ 是 $C(m)$ 的定义，第二个是 P1，第三个是因为 pop 出的是 $f$ 最小的，等号是 P1 的后半句。$p$ 是任取的，所以 $g(n^\circ)\le C^*$；$n^\circ$ 自己是一个 solution，所以 $g(n^\circ)\ge C^*$。

开头要找的那个“数”就是 $f$，certificate 就是那一刻的 frontier：它盖住了所有没见过的 solution，上面每个 $f$ 都不小于 $g(n^\circ)$。

拿 UCS（$f=g$）核对。Cost 非负，往下长只会加，所以 $g(n)\le C(n)$，P1 成立。在这张 graph 上 UCS pop 出 S-A-C-B-G（$g=8$）时，frontier 里还有 S-A-B-G 9、S-C-B-G 9、S-A-C-G 10、S-C-G 11、S-D-G 12，都不小于 8。A\*（$f=g+h$，$h$ 是开头图里没有标、CS2109S 标在 state 旁边的值：$h(S)=7$、$h(A)=6$、$h(C)=5$、$h(B)=3$、$h(D)=9$、$h(G)=0$）pop 出同一个 goal 时，frontier 是 S-C 9、S-A-B 9、S-A-C-G 10、S-D 11。两份 certificate 不一样，结论一样。

::fig[thread-search-loop] 动图，同一棵 search tree（14 个 node，淡色圈是还没生成的）。第一帧是 UCS 跑完的样子；之后先跑 A\*，再跑 UCS。Node 旁的 f 是它的 priority，#k 是第几次被 pop。看最下面的 frontier：两次都在 pop 出 cost 8 的 goal 时停，那一刻 frontier 里剩下的 f 全都 ≥ 8。

P1 坏掉的样子在 [CS2109S 第 2 站](../courses/CS2109S.html#astar)的一个反例里：$h(B)$ 改成 7，S-A-C-B 的 $f=5+7=12$，而 $C(\text{S-A-C-B})=8$，$f>C$。Proof 里第二个 $\ge$ 断了，A\* 返回 cost 10。P2 坏掉的样子是后面的 beam search 和 RRT。

### Bound 越紧，pop 得越少

P1 只要求 $f\le C$。$f$ 离 $C$ 越近，loop 停得越早。精确的说法要求 $f$ 沿着 path 不下降（下一小节讲什么时候成立）：凡是 $f(n)<C^*$ 的 node，都会在 goal 之前被 pop。Proof：设 goal 已经被 pop（它的 $f=C^*$），某个 $f(n)<C^*$ 的 $n$ 还没有。从 root 到 $n$ 的 path 上第一个没被 pop 的 node $m$ 在 frontier 里（它的 parent 被 pop 过），$f(m)\le f(n)<C^*$，它应该排在 goal 前面，矛盾。

所以 $\{n:f(n)<C^*\}$ 是躲不掉的工作量。这张 graph 的 search tree 有 14 个 node，三种 $h$ 下数一数：

| $h$ | $f<8$ 的 node | $f=8$ 的 node |
|---|---|---|
| 0（UCS） | 8 个：S、S-A、S-D、S-A-C、S-C、S-A-C-B、S-A-B、S-C-B | S-A-C-B-G |
| CS2109S 的 $h$ | 2 个：S、S-A | S-A-C、S-A-C-B、S-A-C-B-G |
| $h^*$（真实的 cost-to-go） | 0 个 | optimal path 上的 5 个 |

UCS pop 了 $8+1=9$ 次，A\* 5 次。$h=h^*$ 时每个 node 都有 $f(n)=C(n)$，optimal path 以外的 node 的 $f$ 都大于 8，一个也不会被 pop。

**Weighted A\*.** 按 $f_\varepsilon=g+\varepsilon h$（$\varepsilon\ge1$）当 priority。P1 不成立了，但成立一个放松的版本：$g\ge0$、$h$ admissible 时

$$f_\varepsilon(n)=g+\varepsilon h\ \le\ \varepsilon\,(g+h)\ \le\ \varepsilon\,C(n)$$

把 proof 里那一串换成 $\text{cost}(p)\ge C(m)\ge f_\varepsilon(m)/\varepsilon\ge f_\varepsilon(n^\circ)/\varepsilon=g(n^\circ)/\varepsilon$，得到 $g(n^\circ)\le\varepsilon\,C^*$。这就是 [RB3302 第 1 站](../courses/RB3302.html#search)的 bound；那里 $\varepsilon=5$ 时 path cost 是 24.49，bound 是 $5\times22.14=110.71$。RB3302 的 proof 用了“optimal path 上有一个 $g$ 已经正确的 node 在 OPEN 里”，那正是这里的 P2 加上 tree 的结构。

### 去重之后 P2 还成不成立

Graph search 在 pop 时丢掉 state 已经 expand 过的 node。被丢掉的 node $m'$ 下面的 solution 不再被任何 frontier node 盖住，P2 失效。能补救的情形是：state $s$ 第一次被 pop 时带着的 $g$ 已经是到 $s$ 的最小 cost。这时 $m'$ 下面的每个 solution，把到 $s$ 的前半段换成第一次的那条，cost 不会变大。P2 放宽成“每个 solution $p$ 都有一个不比它贵的 solution $p'$ 被 frontier 盖住”，proof 只在那一串最前面多一步 $\text{cost}(p)\ge\text{cost}(p')$。

“第一次 pop 时 $g$ 最小”在 UCS 里来自 cost 非负，pop 出的 $g$ 不下降。在 A\* 里要 $f$ 沿每条 edge 不下降：

$$f(n')-f(n)=c(n,n')-h(n)+h(n')\ \ge\ 0$$

即 $h(n)\le c(n,n')+h(n')$，叫 consistent。中间那个量 $c-h(n)+h(n')$ 在下面 CS2109S 一节会变成 CS2040 的 edge weight。

### h 的上限：cost-to-go

记 $h^*(n)$ 为从 $n$ 的 state 到 goal 的真实最小 cost。最便宜的走法第一步走到某个 successor，之后按最便宜的走：

$$h^*(n)=\min_{n\to n'}\big[c(n,n')+h^*(n')\big],\qquad h^*(\text{goal})=0$$

这是 [CS4246 第 2 站](../courses/CS4246.html#mdp)的 Bellman optimality equation 在 deterministic、$\gamma=1$、cost 取 min 时的样子。解法也是 [CS4246 第 3 站](../courses/CS4246.html#dp)的 value iteration：$V_0(\text{goal})=0$、其余是 $\infty$，反复做 $V_{k+1}=TV_k$，其中 $(TV)(n)=\min_{n'}[c(n,n')+V(n')]$。

::fig[thread-search-vi] 动图，从 G 往回做 value iteration。第一帧是 converge 之后的 $h^*$；之后从第 0 轮重放，粗线是这一轮每个 state 取到 min 的 edge。

| 轮 | S | A | C | B | D |
|---|---|---|---|---|---|
| 0 | ∞ | ∞ | ∞ | ∞ | ∞ |
| 1 | ∞ | ∞ | 7 | 3 | 10 |
| 2 | 11 | 8 | 5 | 3 | 10 |
| 3 | 9 | 7 | 5 | 3 | 10 |
| 4 | 8 | 7 | 5 | 3 | 10 |

第 5 轮不再变化。第 $k$ 轮的 $V_k(n)$ 是“最多走 $k$ 条 edge 到 G”的最小 cost：第 2 轮 S 只能用两条 edge，最好的是 S-C-G 的 11；第 3 轮多了 S-A-B-G 和 S-C-B-G，都是 9。这就是 [CS2040 第 8 站](../courses/CS2040.html#sssp) Bellman–Ford 的那句 induction，“第 $i$ 轮之后，shortest path 不超过 $i$ 条 edge 的 vertex 都对了”，只是从 goal 往回 relax。两门课的 converge 理由不一样：CS4246 靠 $\gamma<1$ 的 contraction；这里 $\gamma=1$，$T$ 不是 contraction，靠的是 CS2040 的理由，没有 negative cycle 时 shortest path 至多 $V-1$ 条 edge，所以至多 $V-1$ 轮。这张 graph 最长的 optimal path S-A-C-B-G 有 4 条 edge，4 轮就定了。

Consistent 用 $T$ 写就是 $h\le Th$：每个 $n$ 都有 $h(n)\le\min_{n'}[c+h(n')]$。$T$ 是 monotone 的（$V\le W$ 推出 $TV\le TW$），所以 $h\le Th\le T^2h\le\cdots$，一直推到 $h^*$：consistent 推出 admissible。CS2109S 的 $h$ 是 $(7,6,5,3,9)$（依次是 S、A、C、B、D），$Th=(7,7,5,3,10)$，处处不小于 $h$。CS2109S 证同一件事时沿着 optimal path 把 inequality 一条条接起来，接一次就是把 $T$ 作用一次。

:::edge h* 最好，但算 h* 就是把问题解完了
$h=h^*$ 时 A\* 一步冤枉路都不走。可是上面算 $h^*$ 用了 4 轮，每轮看全部 9 条 edge，还要预先知道整张 graph。正因为要找的东西所在的那片 space 里没有 $h^*$，才需要 search。各门课的 $h$ 于是有三种来路：去掉一些限制之后容易算的 $h^*$（relaxed problem，CS2109S、MA3252、RB3302 都是）；在当前 state 附近用 sample 估出来的（CS4246 的 MCTS）；用 data 学出来的（NYU 的 PRM）。只有第一种保证 P1。
:::

:::from
“一个 node 代表它的所有 extension、split 必须恰好盖住被选中的集合、prune 时要留下一个 minimum-cost 的元素、lower bound 在 goal 上等于真实值、按 bound 做 best-first，A\* 是它的特例（path 代表它所有到 terminal 的 extension，bound 是 cost 加 $h$）”的框架，来自 [Nau、Kumar、Kanal 1984, General branch and bound, and its relation to A\* and AO\*](https://www.cs.umd.edu/~nau/papers/nau1984general.pdf)（WebFetch 分节转述，没有拿到原文逐句）；P1、P2 的写法、proof、must-expand 的论证、weighted A\* 的那一行是我按这个框架写的。“backward DP 的 $V_t(i)$ 是最多 $T-t$ 步到 goal 的 cost-to-go”“label correcting 用 FIFO 就是 Bellman–Ford”来自 [UCSD ECE276B 的 Deterministic Shortest Path 一讲](https://natanaso.github.io/ece276b/ref/ECE276B_5_DSP.pdf)（WebFetch 逐张转述）；那份 slides 没有说 DP 就是 Bellman–Ford，$T$ 的 monotone 论证和 $\gamma=1$ 时靠什么 converge 是我写的。Graph、$h$ 和 UCS、A\* 的 trace 取自 CS2109S 页面，表里的数和 $Th$ 用程序重算过。
:::

## 各门课里的名字

| 站 | 叫法 | node | successor | priority | 什么时候停 |
|---|---|---|---|---|---|
| [CS2040 第 6 站](../courses/CS2040.html#graph) | BFS、DFS | vertex；$D[v]$、$p[v]$ | adjacency list | BFS：edge 数 $D[v]$；DFS：$-$depth，不是 bound | queue 或 stack 空 |
| [CS2040 第 8 站](../courses/CS2040.html#sssp) | Dijkstra | PQ 里的 $(D[v],v)$ | relax $w(u,v)$ | $D[v]$，始终 $\ge\delta(v)$ | PQ 空 |
| [CS2109S 第 1 站](../courses/CS2109S.html#search) | UCS | node（path）、$g$ | `successors(s)` | $g$ | pop 出 goal |
| [CS2109S 第 2 站](../courses/CS2109S.html#astar) | A\* | node；$g$、$h$、$h^*$ | 同上 | $f=g+h$ | pop 出 goal |
| [CS2109S 第 3 站](../courses/CS2109S.html#adv) | alpha-beta | game state | 轮流的 move | $\alpha$、$\beta$ | DFS 走完 |
| [MA3252 第 8 站](../courses/MA3252.html#ip) | branch and bound | subproblem | 在 fractional 的 $x_j$ 上分两支 | LP relaxation 的 value | 没有 bound 超过 incumbent |
| [CS3263 第 4 站](../courses/CS3263.html#csp) | backtracking | partial assignment | 给下一个 variable 一个 value | 没有，只判断还能不能完成 | 得到 complete assignment |
| [RB3302 第 1 站](../courses/RB3302.html#search) | A\*、weighted A\* | cell $s$；OPEN、CLOSED | 8 个 neighbor | $g(s)+\varepsilon\,h_{\text{oct}}(s)$ | pop 出 goal |
| [RB3302 第 8 站](../courses/RB3302.html#multi) | CBS 的 high level | CT node：一组 constraint | 一个 conflict 分两支 | sum of costs | pop 出没有 conflict 的 node |
| [NW-MODERNROBOTICS 第 7 站](../courses/NW-MODERNROBOTICS.html#plan)、[RB3302 第 2 站](../courses/RB3302.html#sample) | RRT、RRT\* | configuration；$c(x)$ | 朝 $x_{\text{samp}}$ 走一步 | 没有，由 sample 决定 extend 谁 | 到达 goal，或 sample 用完 |
| [CS4246 第 9 站](../courses/CS4246.html#mcts) | MCTS、UCT | tree node；$N$、$W$ | 每次 expand 一个 action | UCT index | budget 用完 |
| [NYU-REASONERS 第 3、4 站](../courses/NYU-REASONERS.html#verify) | best-of-N、beam search | 完整的解，或 prefix | LLM sample | verifier $v$、PRM | 写出答案；budget 用完 |
| [CS3231 第 6、7 站](../courses/CS3231.html#tm) | NTM 的 simulation、dovetailing | ID | $\delta$ 给的 move | depth | accept；可能永远不停 |

有 priority 而且是 lower bound 的那几行（BFS、Dijkstra、UCS、A\*、branch and bound、CBS）用的都是上面那一个 proof，weighted A\* 用的是它放松 $\varepsilon$ 倍的版本；alpha-beta 和 backtracking 只用了其中“bound 不够好就不再往下走”的那一半，DFS 连这一半也没有。RRT 那一行起，priority 要么不存在，要么只在 probability 的意义下是 bound，要么只是一个估计；最后一行的 space 是无限的。

## CS2040：Dijkstra 是不设 goal 的 UCS

[CS2040 第 6 站](../courses/CS2040.html#graph)的 BFS 是 cost 全为 1 的 UCS，$f=g=$ edge 数。那里“D 为什么正确”的 induction 用了两件事：queue 里的 $D$ 不减，就是 UCS 的“pop 出的 $g$ 不下降”；$D$ 沿 path 每走一步加 1，所以 $g(n)\le C(n)$，就是 P1。DFS 的 priority $-$depth 不是任何 cost 的 lower bound，所以没有 certificate；CS2040 指出 DFS tree 上 s 到 f 是 4 条 edge、实际 3 条就够，原因就在这里。

[CS2040 第 8 站](../courses/CS2040.html#sssp)的 Dijkstra 是那一页的 Java code：PQ 里放 $(D[v],v)$，relax 成功就再放一项，pop 出的一项如果 $d>D[u]$ 就跳过。把它原样跑在开头那张 graph 上（9 条 directed edge，起点 S），旁边对照 CS2109S 的 UCS graph search：

| Dijkstra pop 出的 $(d,u)$ | Dijkstra 做了什么 | UCS pop 出的 node | UCS 做了什么 |
|---|---|---|---|
| (0, S) | relax S→A 得 1，S→C 得 4，S→D 得 2 | S，$g=0$ | expand |
| (1, A) | relax A→B 得 6，A→C 得 $3<4$ | S-A，1 | expand |
| (2, D) | relax D→G 得 12 | S-D，2 | expand |
| (3, C) | relax C→B 得 $5<6$，C→G 得 $10<12$ | S-A-C，3 | expand |
| (4, C) | $4>D[C]=3$，过期，跳过 | S-C，4 | C 已 expand，丢掉 |
| (5, B) | relax B→G 得 $8<10$ | S-A-C-B，5 | expand |
| (6, B) | 过期，跳过 | S-A-B，6 | 丢掉 |
| (8, G) | G 没有 outgoing edge | S-A-C-B-G，8 | goal，返回 |
| (10, G)、(12, G) | 过期，跳过 | | |

左右两半逐行相同，只差最后一行：Dijkstra 没有 goal test，要把 PQ 清空，算出 S 到每个 vertex 的 $\delta$。对应关系：

| CS2040 | CS2109S |
|---|---|
| PQ 里的一项 $(D[v],v)$ | frontier 里一个末端为 $v$、cost 为 $g$ 的 node |
| relax 成功时放进一个新的 $(D[v],v)$ | expand 时 push 一个 child |
| `if (d > D[u]) continue;` | state 已在 `expanded` 里，丢掉 |
| $\delta(v)$ | state $v$ 第一次被 pop 时的 $g$ |
| $p[v]$ | parent node |
| 正确性 proof 里“唯一用到 weight 非负的地方”$\delta(y)\le\delta(u)$ | UCS 的 P1：$g(n)\le C(n)$，以及 pop 出的 $g$ 不下降 |

差别在 graph 的来路。Dijkstra 的 code 一开始就开了 $V$ 格的 array `D`，它假设 graph 整个摆在 memory 里；UCS 只在 node 被生成时才存它，pop 出 goal 就停。CS2109S 的 Pacman 吃 pellet 有 $1.3\times10^{11}$ 个 state，开不出这个 array，UCS 却可能只碰其中很少一部分。Felner 2011 年的 position paper 摘要里的结论更进一步：UCS 和 Dijkstra 在逻辑上等价，而 UCS 在易懂、易写、时间和 memory 上几乎全面占优，课程应当改教 UCS。

:::wrong Relax 到 goal 的那一刻，D[G] 就是答案
上表里 $D[G]$ 先后是 12、10、8。第一次得到的 12 来自 S-D-G，那时 C 和 B 都还没处理。$D[G]$ 只有在 $(8,G)$ 被 pop 出来时才确定，因为那时 PQ 里剩下的 $d$ 都不小于 8：这正是 CS2109S“goal test 要在 pop 时做”的同一件事，换成了 CS2040 的记号。
:::

:::from
Dijkstra 的 code、BFS 的 induction 和 DFS 的反例取自 CS2040 页面，UCS graph search 取自 CS2109S 页面；对照表是把 CS2040 的 code 改写成程序、跑在 CS2109S 的 graph 上得到的。[Felner 的 position paper](https://ojs.aaai.org/index.php/SOCS/article/view/18191) 只读到了摘要（全文页面被 bot 防护拦下），上面只用了摘要里的论点。
:::

## CS2109S：A\* 是换了 weight 的 Dijkstra

[CS2109S 第 2 站](../courses/CS2109S.html#astar)的 A\* 在 tree search 下只需要 admissible（P1），在 graph search 下还要 consistent。为什么多出来的恰好是 consistency，可以借 CS2040 一句话说清。

给每条 edge 换一个 weight，reduced weight：

$$w'(u\to v)=c(u\to v)-h(u)+h(v)$$

沿一条 path $n_0\to n_1\to\dots\to n_k$ 加起来，中间的 $h$ 一正一负全部消掉：

$$\sum_{i=1}^{k}w'(n_{i-1}\to n_i)=\sum_{i=1}^{k}c(n_{i-1}\to n_i)-h(n_0)+h(n_k)$$

从 S 出发，$n_0=S$，所以在 $w'$ 下到 $v$ 的 path 长度是 $g-h(S)+h(v)=f-h(S)$。每条 path 都减去同一个常数 $h(S)$，Dijkstra 在 $w'$ 上按 $D'$ 从小到大 pop，就是按 $f$ 从小到大 pop：**A\* 就是 Dijkstra 跑在 $w'$ 上**。$h(\text{goal})=0$，shortest path 也没有变。Consistent 的定义 $h(u)\le c(u\to v)+h(v)$ 移项就是 $w'\ge0$，正好是 Dijkstra 要求的“weight 非负”。

::fig[thread-search-reduced] 同一张 graph 在两组 $h$ 下的 $w'$。左边是 CS2109S 的 consistent 的 $h$；右边是那一站 graph search 出错时用的 $h(A)=7$、$h(C)=0$。

左边九条 $w'$ 都非负。Dijkstra 在它上面依次 pop S（0）、A（0）、C（1）、B（1）、G（1），和 A\* 的表一致：$D'$ 加上 $h(S)=7$ 就是 A\* 表里的 $f$（7、7、8、8、8），$D'(G)+7=8$。

右边的 $h$ 仍然 admissible，可是 S→C 和 A→C 的 $w'$ 是 $-3$ 和 $-5$，graph 里出现了 negative edge。这时把两种 Dijkstra 各跑一遍：

- **把 pop 过的 vertex 标成“完成”**（CS2040 那一站说的教科书写法）：pop S，pop C（$D'=-3$），pop A（1）；A→C 给出 $1-5=-4<-3$，但 C 已完成，不改；pop B（2），pop G（2）。$D'(G)+7=9$。
- **不设“完成”，变小就再放一项**（CS2040 的 code，VisuAlgo 叫 Modified Dijkstra）：A→C 把 $D'(C)$ 改成 $-4$，C 被再处理一次，B 变成 1，G 变成 1。$D'(G)+7=8$。

9 和 8 正是 CS2109S 在同一组 $h$ 下，graph search 和 tree search 各自给出的答案。两页里的四件事是同一件事的两种说法：

| CS2109S | CS2040 |
|---|---|
| $f=g+h$ | $D'+h(S)$，$D'$ 是 $w'$ 下的距离 |
| $h$ consistent | 所有 $w'\ge0$ |
| graph search，`expanded` 里的 state 不再 expand | 标成“完成”的 vertex 不再 relax |
| tree search 靠重复 expand 找回好 path | Modified Dijkstra 遇到 negative edge 时重复处理 vertex |

**Consistent 的 $h$ 就是 dual 的 potential。** [MA3252 第 6 站](../courses/MA3252.html#path)把 shortest path 写成 LP，它的 dual 是 $\max\ \pi_t-\pi_s$，constraint 是每条 arc 上 $\pi_j-\pi_i\le c_{ij}$。取 $\pi=-h$，constraint 变成 $h(i)-h(j)\le c_{ij}$，就是 consistency。于是：

- dual objective 是 $\pi_G-\pi_S=h(S)-h(G)=h(S)$，weak duality 给出 $h(S)\le C^*$。在 root 上，admissible 是 weak duality 的直接结论（$7\le8$）。
- $h=h^*$ 时 dual objective 是 8，等于 $C^*$，是 dual 的 optimal solution。这时 $w'$ 恰好在 S→A、A→C、C→B、B→G、D→G 上为 0，其余为正。Optimal path S-A-C-B-G 只走 $w'=0$ 的 arc，这是 MA3252 说的 complementary slackness，“flow 只走 tight 的 arc”。

Goldberg 和 Harrelson 讲 A\* 时用的正是这套语言：potential $\pi$ 叫 feasible，如果所有 reduced cost 非负；A\* 等价于在 reduced cost 上跑 Dijkstra；两个 feasible potential 逐点取 max 仍是 feasible（CS2109S 说几个 admissible heuristic 可以逐点取 max，对 consistent 的也成立）；一个 feasible potential 处处不小于另一个时，它 scan 的 vertex 是另一个的 subset。Admissible 而不 consistent 的 $h$ 不是 feasible potential，所以有 negative reduced cost。

**Relaxed problem 给出的 $h$ 自动 consistent。** CS2109S 说 relaxed problem 的 optimal cost 是 admissible 的；其实还更强。设 relaxed problem 的 state 不变、action 只多不少、cost 只低不高，它的 cost-to-go $h_r$ 满足 relaxed 版本的 Bellman equation，于是对原问题的每条 edge（它也是 relaxed problem 的 edge）

$$h_r(n)\le c_r(n,n')+h_r(n')\le c(n,n')+h_r(n')$$

Manhattan distance、8-puzzle 的 $h_1$ 和 $h_2$、RB3302 的 octile distance 都在这一类里。RB3302 证 octile consistent 的那一句话，就是这个论证在 grid 上的特例。

:::from
Reduced cost $\ell_\pi(v,w)=\ell(v,w)-\pi(v)+\pi(w)$、feasible 的定义、“A\* 等价于在 $\ell_{\pi}$ 上跑 Dijkstra”、取 max 仍 feasible 的 Lemma 2.1、dominance 推出 scan 的 vertex 是 subset 的 Theorem 4.1，来自 [Goldberg、Harrelson 2005, Computing the Shortest Path: A\* Search Meets Graph Theory](https://www.cs.princeton.edu/courses/archive/spring06/cos423/Handouts/GH05.pdf) 第 2、4 节（WebFetch 转述，那篇 paper 不用 admissible 这个词）。两种 Dijkstra 在 negative reduced weight 上给出 9 和 8、和 CS2109S 的 graph search、tree search 一一对应，$\pi=-h$ 与 MA3252 的 dual，relaxed problem 推出 consistent，是我写的；所有 $w'$ 和 trace 用程序算过。
:::

## MA3252 与 CS3263：branch and bound 是同一个 proof

Nau、Kumar 和 Kanal 1984 年把 branch and bound 写成一个一般的形式：手里有一组 subset（每个 subset 是一部分 candidate solution），每次选一个、split 成更小的 subset，并且 prune 掉那些 bound 显示不可能含有更好 solution 的；A\* 是它的特例，一条 path 代表它所有的 extension，bound 是 cost 加 $h$。反过来读，[MA3252 第 8 站](../courses/MA3252.html#ip)的 knapsack 就是一次 A\*。Knapsack 是 max 问题，下面所有的 inequality 方向反过来：

| A\*（min cost） | Branch and bound（max value） |
|---|---|
| node：一条 path，代表它所有的 extension | node：一个 subproblem（固定了几个 $x_j$），代表满足这些固定的所有 integer point |
| $g$：已经花掉的 cost | 固定为 1 的物品的 value |
| $h$：relaxed problem 的 optimal cost | 剩下的 capacity 上 LP relaxation 的 value |
| P1：$f=g+h\le C(n)$ | LP value $\ge$ 这个 subproblem 里最好的 integer value |
| goal node：$h=0$，bound 就是真实值 | LP 的解恰好是 integer：bound 就是真实值 |
| 不会被 pop：$f>C^*$ | prune：bound 不超过 incumbent |

核对一个 node。Node 1 固定 $x_3=1$：$g=7$，剩下 capacity $15-5=10$。剩下的三件按 value/weight 装，$x_1$（1.5）装满得 12，剩 2；$x_4$（1.5）装 $2/4$ 得 3；$h=15$。$f=7+15=22$，和 MA3252 表里 node 1 的 LP value 一样。

“$f<C^*$ 的 node 躲不掉”在这里是：bound 超过 $C^*=21$ 的 node 一定要 branch，否则无法排除它里面藏着一个 22。Value 都是 integer，bound 可以取 floor。把整棵 tree 按 MA3252 的 branching 规则全部展开，一共 17 个 node：

::fig[thread-search-bb] 完整的 tree。着色的四个是 bound 的 floor 为 22 的 node；实线是 MA3252 页面那个顺序实际解过 LP 的 9 个 node。

Floor 大于 21 的恰好四个：root、$x_3=1$、$x_3=1$ 且 $x_4=1$、$x_3=0$。任何顺序都至少要 branch 这四个。MA3252 先试 $=1$、深度优先的顺序 branch 的正好就是它们，再加上它们的 5 个 child 只解了 LP 就被处理掉（1 个 infeasible，1 个给出 incumbent 21，3 个被 bound 剪掉），一共 9 次 LP，没有一次浪费在必须工作之外的 branching 上。它能这样，是因为第 5 个 node 就找到了 21：深度优先的顺序早早给出 incumbent，之后的 bound 才有东西可比。按 bound 做 best-first（A\* 的顺序）的好处是第一个 pop 出的 integer node 就是 optimal；代价是 frontier 可能很大。两种顺序的取舍和 [CS2109S 第 1 站](../courses/CS2109S.html#search)里 UCS 与 DFS 的取舍是同一个：前者 memory 大，后者 memory 只有一条 path。

**Alpha-beta 也是这一种 prune。** [CS2109S 第 3 站](../courses/CS2109S.html#adv)的 $\alpha$ 是 MAX 已经保证拿得到的 value，相当于 incumbent；一个 MIN node 看到第一个 leaf 2 之后，它的 value 不会超过 2，这是这个 subtree 的 bound。$2\le\alpha=3$，subtree 里不可能有比 incumbent 更好的东西，剪掉 4 和 6。区别在于 game tree 里的 bound 来自已经算出的 leaf，而 knapsack 的 bound 来自一个 relaxation。

**Backtracking 是 bound 只有“能”和“不能”两个值的 branch and bound。** [CS3263 第 4 站](../courses/CS3263.html#csp)的 node 是 partial assignment，prune 的条件是它已经不可能完成。Plain backtracking 只有在一个 constraint 两端的 variable 都有了 value 时才发现 conflict，相当于一个很松的 bound；forward checking 和 AC-3 更早发现某个 domain 被删空，相当于更紧的 bound。WA = R、Q = G 那个注定失败的 partial assignment，plain backtracking 要试 111 次 value 才放弃，forward checking 24 次，forward checking 加上 MRV 1 次，AC-3 在第三个 variable 有 value 之前就发现了。这和 CS2109S 里 8-puzzle 的 $h=0$、$h_1$、$h_2$ 要 expand 47,875、3,666、282 个 state 是同一个规律：bound 越紧，剪得越早。

:::from
Branch and bound 的一般形式、A\* 作为它的特例（Corollary C.2.1）、同一个 tip node 的 path 之间的 dominance 就是 duplicate elimination，来自 [Nau、Kumar、Kanal 1984](https://www.cs.umd.edu/~nau/papers/nau1984general.pdf)（WebFetch 转述）。两列的对照表、knapsack 上 $g$ 与 $h$ 的拆法、17 个 node 的完整 tree 和“floor 大于 21 的恰好四个”是我做的，tree 用分数精确地算过；knapsack 的数据和 MA3252 的 9 个 node 取自 MA3252 页面，alpha-beta、backtracking、8-puzzle 的数字取自 CS2109S 和 CS3263 页面。
:::

## RB3302 与 NW-MODERNROBOTICS：从 grid 到 sample

[RB3302 第 1 站](../courses/RB3302.html#search)在 Map M 上：Dijkstra expand 321 个 cell，octile 的 A\* 117 个，Euclidean 的 A\* 133 个，cost 都是 22.14。Octile 是“没有 obstacle”的 relaxed problem 的 $h^*$，按上一节的论证自动 consistent；Euclidean 是更松的 relaxation（连 8 个方向的限制也去掉），被 octile dominate，所以 expand 得多。

**CBS 的两条 lemma 就是 P1、P2。** [RB3302 第 8 站](../courses/RB3302.html#multi)的 high level 换了一种 node：一个 CT node 是一组 constraint，代表满足它们的所有 joint solution；successor 是在一个 conflict 上分出两支。CBS 论文的 Lemma 1 说 CT node 的 cost 不超过它允许的任何 solution 的 cost，就是 P1；Lemma 2 说任何合法的 solution 任何时刻都被 OPEN 里某个 CT node 允许，就是 P2，它的 induction 也和上面 P2 的 proof 一样：root 没有 constraint，什么都允许；分裂时合法的 solution 至少满足两条新 constraint 中的一条。论文的 Theorem 1 的 proof 是一行 $c(g)\le c(N(p))\le c(p)$，就是骨架里的那一串。

::fig[thread-search-cbs] RB3302 十字路口的例子：root 的 cost 8 是 lower bound，两个 child 各 9，先 pop 的那个没有 conflict，返回 9。

CT node 的 cost 为什么是 lower bound：它是每个 agent 在自己的 constraint 下各走最短 path 的总和，它们忽略了彼此，相当于把“不许撞”这条限制去掉的 relaxed problem。

**Graph 大到列不出来时，successor 只能 sample。** RB3302 算过，7-dof arm 每个 joint 2° 一格是 $180^7=6.1\times10^{15}$ 个 cell。[NW-MODERNROBOTICS 第 7 站](../courses/NW-MODERNROBOTICS.html#plan)的 RRT 改的是 loop 的第 (3) 行和第 (1) 行：successor 是从一个 node 朝随机的 $x_{\text{samp}}$ 走一步 $d$；extend 哪个 node 不由 priority 决定，由“谁离 $x_{\text{samp}}$ 最近”决定，被选中的 probability 正比于它的 Voronoi region 的面积。没有 $f$，P1 无从谈起，所以没有 certificate；tree 只盖住 space 的一部分，P2 也只在 sample 数趋于无穷时以 probability 1 成立，这就是 probabilistically complete。

**RRT\* 的 choose parent 和 rewire 就是 relax。** [RB3302 第 2 站](../courses/RB3302.html#sample)说 RRT 的 path 跑到第 1000 个 sample 还是 13.48，因为一个 node 加进 tree 时定下 parent 以后就不再改。用 CS2040 的话说：RRT 的 parent 像 BFS 的 $p[v]$，第一次写下、以后不动。BFS 这样做是对的，因为 edge 没有 weight，第一次发现就是最少的 edge 数；有了 weight，就必须 relax。RRT\* 补上的就是 relax：

| RRT\*（RB3302） | Dijkstra（CS2040） |
|---|---|
| $c(x)$：从 start 沿 tree 到 $x$ 的长度 | $D[v]$ |
| $\lVert x-y\rVert$，segment 不碰 obstacle | $w(u,v)$，edge 存在 |
| choose parent：$\arg\min_y c(y)+\lVert y-x\rVert$ | 对所有进入 $x$ 的 edge 做 relax |
| rewire：$c(x)+\lVert x-y\rVert<c(y)$ 就改 parent | 对所有从 $x$ 出发的 edge 做 relax |
| radius $r_n$ 内的 node 才算 neighbor | 只有这些 edge 存在 |

::fig[thread-search-relax] RB3302 手算的那一次 RRT\* 插入，写成 relax。左边三次 relax 里经 A 最小；右边从 x 出发的两次 relax，C 改了 parent，B 没有。

RB3302 的数字正好是这五次 relax：进入 $x$ 的三次给出 3.709、4.721、7.456，取 3.709；从 $x$ 出发的两次，$3.709+1.456=5.165<6$ 改，$3.709+0.721=4.430>4$ 不改。CS2040 的 proof 里那条“$D[v]$ 永远是某条真实 path 的长度，所以不会低于 $\delta$”在这里也成立：$c(x)$ 始终是一条真实的、不碰 obstacle 的 path 的长度。Karaman 和 Frazzoli 的原文说 RRT\* 维护一棵 tree，把不在 root 出发的 shortest path 上的 edge 去掉；它所在的那张 graph（RRG，同样的 node，radius 内不碰的 pair 都连）随 $n$ 变密，graph 上的 shortest path 趋向连续空间里的 optimal path，这就是 asymptotically optimal。

两者有一处不同。Rewire 只把从 $x$ 出发的 edge relax 一次；C 的 cost 降到 5.165 之后，从 C 出发、可能也该改 parent 的其他 node 不再被检查，要等下一个新 node 恰好落在附近才有机会。CS2040 的 Dijkstra 和 Bellman–Ford 会把这个改进一路传下去。Arslan 和 Tsiotras 2013 年的 RRT# 补的就是这一步：同样用 RRG 那张 graph，把 exploitation 写成 Bellman equation 的 relaxation（和 Bellman–Ford 同一类），每加一个 node 就把 cost 的变化传到所有可能在 optimal path 上的 vertex，于是每一轮的 tree 都给出到这些 vertex 的最低 cost。RRT\* 没有这个保证，有限的 $n$ 上它的 path 不一定是它这张 graph 上的 shortest path，只在 $n\to\infty$ 时 converge。

:::from
CBS 的 CT node cost、Lemma 1、Lemma 2 的陈述和 induction、Theorem 1 的那一行、“high level 在 CT 上做 best-first”，来自 [Sharon 等人 2012 的 CBS 论文](https://webdocs.cs.ualberta.ca/~nathanst/papers/sharon12cbs.pdf)（WebFetch 转述，短引文核过）；“CT cost 是去掉不许撞的 relaxation”是我的解释。RRT\* 的 choose parent、rewire 的条件 $\text{Cost}(x_{\text{new}})+c(\text{Line}(x_{\text{new}},x_{\text{near}}))<\text{Cost}(x_{\text{near}})$、“去掉不在 shortest path 上的 edge”、RRT 的 graph 是 RRG 的 subgraph，来自 [Karaman、Frazzoli 2011](https://arxiv.org/pdf/1105.1186v1) 的 Algorithm 5、6 一节（WebFetch 只读了全文前 40%，radius 常数的 lower bound 没有读到）。“rewire 是局部的、不保证中途的 path 在当前 graph 上 optimal”、RRT# 用 Bellman equation 的 Gauss–Seidel relaxation 把变化传给 promising vertex，来自 [Arslan、Tsiotras 2013](https://dcsl.gatech.edu/papers/icra13.pdf)（WebFetch 转述；那篇 paper 没有把 RRT\* 的 rewire 叫作 relax，也没有提 Dijkstra）。和 Dijkstra 的逐行对照表是我写的。Map M、RRT 与 RRT\* 的数字取自 RB3302 页面。
:::

## CS4246：只在 probability 意义下成立的 bound

**Admissible 和 UCB 是同一种 optimism。** [CS4246 第 5 站](../courses/CS4246.html#bandit)的 UCB1 和 A\* 在做同一件事：手里有一组 candidate，每个配一个 optimistic estimate，总选看起来最好的那个。差别只在估计从哪里来。

| | A\*（CS2109S 第 2 站） | UCB1（CS4246 第 4 站） |
|---|---|---|
| candidate | frontier 里的 node | arm |
| optimistic estimate | $f(n)=g+h\le C(n)$（cost，确定成立） | $\text{UCB}_a=\hat\mu_a+\sqrt{2\ln t/N_a}\ge\mu_a$（reward，以 high probability 成立） |
| 选谁 | $f$ 最小的 | UCB 最大的 |
| 差的 candidate 什么时候还会被选 | 它的 optimistic estimate 比最好的那个的真实值还好：$f(n)<C^*$ | 同一句话：$\text{UCB}_a\ge\mu^*$ |
| proof 的关键一行 | $f(n)\le C^*<C'=f(G')$ | $\mu_a+2u_a\ge\text{UCB}_a\ge\text{UCB}_{a^*}\ge\mu^*$ |
| 估计会不会变准 | 不会：$h$ 固定，每个 node 至多 pop 一次 | 会：每拉一次 $N_a$ 加 1，bonus 变小 |
| 差的 candidate 被选几次 | $f<C^*$ 的各一次 | $N_a\le8\ln t/\Delta_a^2$ |

两边的数：A\* 在开头那张 graph 上，S-C（$f=9$）、S-A-B（9）、S-D（11）的 optimistic estimate 都比 $C^*=8$ 差，一次也没被 pop。CS4246 的 3-armed bandit 跑到 $T=20000$，bound 给出 arm 1（$\Delta=0.4$）至多 $8\ln20000/0.16=495$ 次、arm 2（$\Delta=0.2$）至多 1981 次，实测是 107 次和 368 次。Bandit 必须把差的 arm 拉很多次，是因为它的估计只能一次一次变准；A\* 的 $h$ 一开始就给定，不会因为看得多而变紧。

**MCTS 把两者合在一棵 tree 上。** [CS4246 第 9 站](../courses/CS4246.html#mcts)的 UCT 在每个 node 上放一个 bandit，选 child 用 UCB。代价是 P1 只以 probability 成立，而且一个 node 下面的 mean 本身还在变（它下面的 bandit 在学），所以没有“pop 出 goal 就停”的 certificate：只能按 budget 停，最后选被访问次数 $N$ 最大的 child。Coquelin 和 Munos 2007 年指出，UCT 在有些 tree 上“太 optimistic”，worst case 的 regret 是 $O(\exp(\exp(D)))$，$D$ 是 tree 的 depth；他们给的改进之一利用 reward 的 smoothness，以 high confidence 剪掉 suboptimal 的 branch，也就是用统计的 bound 做 branch and bound。

[CS4278 第 6 站](../courses/CS4278.html#pomdp)的 DESPOT 把 bound 明着写了出来：每个 belief node 维护 upper bound $\mu(b)$ 和 lower bound $\ell(b)$，往下走时选 upper bound 最大的 action，这是 optimism；root 的 gap $\mu(b_0)-\ell(b_0)$ 小于 $\varepsilon_0$ 就停，这是 branch and bound 里“最好的 bound 和 incumbent 之差”。MA3252 的 knapsack 在找到 21 之后，最好的 bound 是 22（floor），gap 是 1；把四个必须 branch 的 node 处理完，gap 变成 0，停。

:::from
UCB1 的 index、$N_a\le8\ln t/\Delta_a^2$、bandit 的数字和 UCT 的写法取自 CS4246 页面，DESPOT 的 bound 与停止条件取自 CS4278 页面。[Coquelin、Munos 2007, Bandit Algorithms for Tree Search](https://arxiv.org/abs/cs/0703062) 只读了摘要（regret $O(\exp(\exp(D)))$、smooth tree 上剪掉 suboptimal branch）。Munos 2014 年的 monograph [From Bandits to Monte-Carlo Tree Search: The Optimistic Principle](https://nowpublishers.com/article/Details/MAL-038) 也只读了摘要，它把 MCTS 归到 optimism in the face of uncertainty 之下。A\* 与 UCB 的逐行对照是我写的，没有找到把两者这样对照的文献。
:::

## NYU-REASONERS：没有 bound 的 search

**Best-of-N 是 depth 为 1 的 search。** [NYU-REASONERS 第 3 站](../courses/NYU-REASONERS.html#verify)：root 是题目，$N$ 个 child 是 sample 出的完整的解，按 verifier $v$ 挑最高的。$v$ 完美（unit test、Lean、把 Countdown 的 expression 算一遍）时它就是 goal test，accuracy 是 pass@N，不需要任何 bound。$v$ 是学出来的时，它既不是 bound，也不保证准，骨架里只剩“按一个分数排序”这一条。

**按带 noise 的分数取 argmax，选出来的分数偏高。** 10 个 arm 的真实 mean 都是 0.5，每个只试 4 次，sample mean 最高的那个平均是 0.863；每个试 100 次，是 0.577。它的真实 value 始终是 0.5，偏高的部分全部来自“它恰好被选中”。Noise 是 normal 时，$N$ 个里最大的那个平均高出 $1.03\sigma$（$N=4$）、$2.34\sigma$（$N=64$）。这件事在三门课里各出现一次：

- NYU 第 3 站的 toy model：骗过 verifier 的错只占 3.5%，$N=64$ 时被选中的却有 37.7% 是它们，best-of-N 的 accuracy 从 $N=12$ 时的 0.733 跌到 $N=1024$ 时的 0.358。
- CS4246 第 8 站：search 结束时选 $N$ 最大的 child，不选 mean 最大的，因为 mean 最大的可能只被试了一两次、运气好。
- CS4278 第 6 站的 DESPOT：4 个 scenario 上算出的 empirical value 6.5，比 optimal 的 1.933 还高，真实 value 是 $-5.875$；所以要在 value 上减 $\lambda|\pi|$。

**Beam search 是故意丢掉 P2 的 BFS。** [NYU-REASONERS 第 4 站](../courses/NYU-REASONERS.html#search)的 step-level beam search 一层一层往下，每层只留 PRM 分数最高的 $B$ 个 prefix。$B=\infty$ 就是 BFS；$B=1$ 是 greedy，每层只留眼前最好的一个，和 CS2109S 第 3 站的 hill climbing 一样，走错一步就回不来。被丢掉的 prefix 下面的 solution 不再被盖住，所以没有任何保证，好坏全看 PRM 的分数排得对不对。

**Math-Shepherd 的 soft label 就是 flat Monte Carlo。** NYU 第 3 站的 PRM label 是：从第 $t$ 步的 prefix 出发，用一个 completer policy 往下写 $N$ 个 completion，数最终答案对的比例。[CS4246 第 9 站](../courses/CS4246.html#mcts)的 flat Monte Carlo search 是：从 root 的每个 action 出发，用 rollout policy 往下走 $K$ 次，取平均 return。两者是同一个 estimator，估的都是“从这里起、按这个 policy 走下去”的 value；“从这里起、走得最好”的 value 是另一个量，两者只在 policy 已经 optimal 时相等。CS4246 的两层例子可以直接读成两步 reasoning：

::fig[thread-search-twolayer] CS4246 的两层例子，当作“第一步写 a 或 b，第二步再写一步，然后给出答案”。每个中间 node 旁有两个分数。

Completer 在第二步 random 地选时，a 的 soft label 是 $\tfrac12\times0.2+\tfrac12\times0.9=0.55$，b 是 0.6；CS4246 用 $K=1000$ 次 rollout 实测是 0.58 和 0.60。用这个 PRM 做 $B=1$ 的 beam search，第一步选 b，最后做对的 probability 是 0.6，而先 a 后 a2 是 0.9。Hard label 更分不出：$N=8$ 时 a 至少一次对的 probability 是 $1-0.45^8=0.998$，b 是 $1-0.4^8=0.999$。NYU 第 3 站指出 PRM 的 label 依赖 completion policy，换一个更会做题的 policy，label 会变高；CS4246 的 UCT 正是那个“更会做题”的 policy，它让 a 下面的 bandit 越来越常选 a2，a 的 mean 在 50、200、1000 次 iteration 后是 0.811、0.874、0.895，往 0.9 走。

NYU 的 Countdown 例子里看不出这个毛病。{96, 97, 68} 的九个第一步里，三个好的第一步下面各有 3 个 completion，其中恰好 1 个对，soft label 都是 $1/3$，其余都是 0，而“走得最好”的 value 是 1 和 0；两种分数排出的次序相同，所以 $B=2$ 的 beam search 找到了 125。Flat 的估计出错，要等到一个 prefix 下“对的 completion 所占的比例”和“有没有对的 completion”排出不同的次序，像 a（比例 0.55，最好 0.9）和 b（0.6，0.6）这样。

:::from
Best-of-N、beam search、Math-Shepherd 的 SE label 的定义和 toy model 的数字取自 NYU-REASONERS 页面，flat Monte Carlo、两层例子、UCT 的数字取自 CS4246 页面，DESPOT 的数字取自 CS4278 页面。“10 个 arm 各试 4 次”和 normal 的 expected maximum 是我用程序精确算的（binomial 逐项求和，normal 用数值积分）；soft label 等于 flat Monte Carlo、两层例子上 beam search 选 b、Countdown 上两种分数次序相同，是我的对照和计算。
:::

## CS3230 与 CS3231：search 的边界

**NP 是 goal test 便宜、tree 却 exponential 大的 search。** [CS3230 第 8 站](../courses/CS3230.html#np)和 [CS3231 第 8 站](../courses/CS3231.html#cx)里 NP 的定义是：YES instance 有一个 polynomial 长的 certificate，verifier 能在 polynomial time 内检查。换成这里的话：goal test 是 polynomial 的，而 certificate 一位一位地定下来，就是一棵 depth 为 $n$、$2^n$ 个 leaf 的 search tree（CS3263 的 backtracking tree 就是这样一棵）。CS3230 的 $\varphi$ 有 3 个 variable、5 个 satisfying assignment，随便猜一个 assignment 就对的 probability 是 $5/8$；50 个 variable、只有一个 satisfying assignment 时是 $2^{-50}=8.9\times10^{-16}$。NYU 的 best-of-N 配完美 verifier，是同一个“猜，然后检查”，只是猜的 distribution 是学出来的：Countdown 上 random policy 一次猜对是 $1/9$，pass@8 是 0.610。P 与 NP 的问题问的是：这一类 search 能不能都换成 polynomial 的做法。

**NTM 的 simulation 必须是 BFS，dovetailing 是两个方向的 iterative deepening。** [CS3231 第 6 站](../courses/CS3231.html#tm)用 deterministic TM simulate nondeterministic TM：所有可能的运行构成一棵 tree，必须 breadth-first 地展开，因为 depth-first 可能沉进一条永远不停的 branch。这是 CS2109S 表里“DFS 在 tree 无限深时不 complete”的一个实例；只要 accepting branch 长 $m$，BFS 至多展开 $1+b+\dots+b^m$ 个 ID 就会碰到它。

[CS3231 第 7 站](../courses/CS3231.html#undec)的 dovetailing 要判断 $L(M)\neq\varnothing$：第 $k$ 轮对前 $k$ 个 string 各 simulate $M$ $k$ 步。这里有两个方向都可能无限：string 有无穷多个，每个 string 上 $M$ 也可能永远不停。沿任何一个方向先走到底都会卡死，dovetailing 让两个方向的 limit 一起涨，和 CS2109S 的 iterative deepening 让 depth limit 一轮一轮涨是同一个办法。

::fig[thread-search-dovetail] 动图，cell $(w_j,s)$ 表示“在 $w_j$ 上 simulate $s$ 步”。第 $k$ 轮覆盖左上角 $k\times k$ 的方块；$M$ 在第 5 步 accept $w_3$，第 5 轮碰到它。

代价是 polynomial 的。“$M$ 在第 $s$ 步 accept $w_j$”在第 $\max(j,s)$ 轮被发现，前 $K$ 轮一共 simulate $\sum_{k=1}^Kk^2=K(K+1)(2K+1)/6$ 步，$K=5$ 时是 55 步，而直接知道答案的话只要 5 步。CS2109S 的 iterative deepening 重复得少得多，$b=10$、$d=5$ 时是 123,450 对 111,110，只多 11%，因为 tree 每层乘 $b$，最后一轮占了大头；dovetailing 的方块每轮只多出 $2k-1$ 个 cell，没有这种 exponential 的增长来摊薄重复。

**能证明“有”，不能证明“没有”。** Loop 返回 None 的唯一途径是 frontier 变空，而空的 frontier 就是“没有 solution”的 certificate：P2 说每个 solution 都从 frontier 里的 node 长出来，frontier 空了就没有 solution。Graph 有限时 frontier 迟早会空：CS2040 的 BFS 把到不了的 vertex 留在 $D=-1$，CS3231 第 7 站的 $E_{DFA}$ 就是这样 decide 的。TM 的 ID 构成的 tree 是无限的，frontier 可以永远不空。这时 search 只给出 recognizer：有 accept 的运行就一定找到，没有就一直跑。

能不能事先算出一个 depth，超过它就可以放弃？如果对每个 $\langle M,w\rangle$ 都能算出一个 $B(\langle M,w\rangle)$，使得“$M$ accept $w$”推出“$M$ 在 $B$ 步之内 accept $w$”，那么 simulate $B$ 步就 decide 了 $A_{TM}$，和 CS3231 第 7 站证明的 $A_{TM}$ undecidable 矛盾。所以这样的 $B$ 不是 computable 的。CS3231 也指出 DFA 和 CFG 的问题能 decide，是因为它们有事先算得出的 upper bound：$A_{DFA}$ 走 $|w|$ 步，CNF 的 derivation 走 $2n-1$ 步。

这和 P1 是两种不同的 bound。P1 是 cost 的 lower bound，它告诉 loop 找到一个 solution 之后什么时候可以停；depth 的 upper bound 告诉 loop 什么时候可以放弃。前者让 Dijkstra、A\*、branch and bound、CBS 能给出 optimality 的 certificate；后者在有限的 graph 上自动存在，在 TM 上一般不存在，halting problem 说的就是这件事。

:::from
NP 的 verifier 定义、$\varphi$ 和它的 5 个 assignment 取自 CS3230 页面；NTM 的 breadth-first simulation、dovetailing、$E_{DFA}$ 用 graph search decide、$A_{DFA}$ 与 $A_{CFG}$ 的 upper bound 取自 CS3231 页面（那一页注明这些部分凭作者自己的知识写，没有对照 Sipser 原文）。Countdown 的 $1/9$ 取自 NYU-REASONERS 页面，iterative deepening 的数字取自 CS2109S 页面。Dovetailing 与 iterative deepening 的对应、55 步的计算、“没有 computable 的 depth bound”的 reduction、两种 bound 的区分，是我写的。
:::
