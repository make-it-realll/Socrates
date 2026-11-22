---
title: 从终点往回算
lead: "Shortest path、dynamic programming、value iteration、LQR 的 Riccati recursion、distance-vector routing 解的是同一个 equation：一个 state 的 value，等于走一步的 cost 加上下一个 state 的 value，在所有走法里取最好的。"
line: ml
---

给一个 directed network 和一个 destination $t$，每条 arc $x\to x'$ 有 cost $c(x,x')\ge0$。要对**每一个** node $x$ 回答两件事：从 $x$ 到 $t$ 最少花多少；第一步走哪条 arc。Router 的 forwarding table 要的就是这两样（[CS2105 第 6 站](../courses/CS2105.html#route)叫第二样 next hop）；robot 在 map 的每一格都要知道往哪走；RL 的 policy 是同一个问题，只是 transition 带 randomness。

下面一直用 [MA3252 第 6 站](../courses/MA3252.html#path)的 network。那一站求的是从 $s$ 出发到各点的 distance，这里反过来，求各点到 $t$ 的 cost。

::fig[thread-bellman-net] MA3252 的 network，arc 上的数是 cost。每个 node 旁的 $V$ 和粗线是这一节要算的东西：到 $t$ 的最小 cost，以及第一步走哪条 arc。动起来时看次序：从 $t$ 往回，每个 node 只用到已经算好的 successor。

最直接的办法是把 path 全部列出来。从 $s$ 到 $t$ 有 7 条 path，最便宜的是 $s\to b\to d\to t$，cost 7；从 $b$ 出发有 5 条。这个 network 小，列得完，但 path 的条数随 network 变大 exponential 增长：$20\times20$ 的 grid 上只许往右、往下走，从左上角到右下角有 $\binom{38}{19}=35{,}345{,}263{,}800$ 条 path，而 node 只有 400 个，arc 只有 760 条。列 path 时有大量重复：从 $s$ 出发的 7 条里有 3 条以 $c\to d\to t$ 结尾，这一段的 cost 被一遍遍重新加。要找的是一种工作量只和 node、arc 的个数有关的 algorithm。

## 剩下的路只和现在在哪有关

### Bellman equation

记 $V^*(x)$ 为从 $x$ 到 $t$ 的所有 path 里最小的 cost，$V^*(t)=0$。任何一条从 $x$ 出发的 path 都是“先走一条 arc $x\to x'$，再接一条从 $x'$ 到 $t$ 的 path”。第一条 arc 固定成 $x\to x'$ 时，后半段可以是从 $x'$ 出发的任何一条 path，它的 cost 和之前怎么走到 $x'$ 无关，所以后半段应该取最便宜的，总 cost 是 $c(x,x')+V^*(x')$。再在第一条 arc 上取最好的：

$$V^*(x)=\min_{x'}\big[c(x,x')+V^*(x')\big],\qquad V^*(t)=0$$

Min 取遍 $x$ 的所有 successor。这叫 Bellman equation。Bellman 1954 年把背后的道理叫 principle of optimality：一个 optimal policy，不管起点和第一步是什么，剩下的 decision 对第一步之后到达的 state 来说也必须是 optimal 的。

上面是想法，proof 要两个方向。

**$V^*(x)\le$ 右边。** 对 $x$ 的每个 successor $x'$，取一条从 $x'$ 到 $t$、cost 为 $V^*(x')$ 的 path，在前面接上 $x\to x'$，得到一条从 $x$ 出发、cost 为 $c(x,x')+V^*(x')$ 的 path。$V^*(x)$ 是所有 path 里最小的 cost，不超过它。这对每个 $x'$ 都成立，所以不超过其中最小的那个。

**$V^*(x)\ge$ 右边。** 取一条从 $x$ 到 $t$、cost 为 $V^*(x)$ 的 path，设它的第一条 arc 是 $x\to x_1$。去掉这条 arc，剩下的是一条从 $x_1$ 到 $t$ 的 path，cost 不小于 $V^*(x_1)$。所以 $V^*(x)\ge c(x,x_1)+V^*(x_1)\ge\min_{x'}[c(x,x')+V^*(x')]$。

Proof 用到三件事：path 的 cost 是各条 arc 的 cost 之和；从 $x'$ 出发能走哪些 path，和怎么到达 $x'$ 无关（第一个方向里接上去的后半段不受前半段限制）；$V^*$ 有限并且取得到（network 有限、没有 negative cycle 时成立）。

在例子上用一次。$d$ 只有一个 successor：$V^*(d)=2+V^*(t)=2$。$c$ 有两个：$V^*(c)=\min(1+2,\ 5+0)=3$。$a$：$V^*(a)=3+3=6$。$b$：$\min(2+6,\ 7+3,\ 4+2)=6$。$s$：$\min(4+6,\ 1+6)=7$，和列出 7 条 path 得到的一样。每条 arc 只参与一次加法，一共 9 次。

### 第一步走哪条 arc

取到 min 的那个 successor 就是第一步：$\mu(x)=\arg\min_{x'}[c(x,x')+V^*(x')]$。例子里 $\mu(s)=b$，$\mu(b)=d$，$\mu(d)=t$，$\mu(c)=d$，$\mu(a)=c$，就是图里的粗线。

为什么每一步按 $\mu$ 走，整条 path 就是 optimal 的？从 $x_0=x$ 出发按 $\mu$ 走过 $x_1,x_2,\dots$。每一步都取到了 min，所以 $c(x_i,x_{i+1})=V^*(x_i)-V^*(x_{i+1})$。Cost 都是正的时 $V^*$ 沿途严格下降，不会绕圈，在某个 $k$ 走到 $x_k=t$。把这些等式加起来，中间各项两两抵消：

$$\sum_{i=0}^{k-1}c(x_i,x_{i+1})=V^*(x_0)-V^*(x_k)=V^*(x)$$

每一步只看一步，整条 path 却是 optimal 的，前提是用来比较的是 $V^*$。后面会用到这里的两个量：$\arg\min$ 是 policy；$c(x,x')+V^*(x')-V^*(x)$ 由 Bellman equation 保证 $\ge0$，等于 0 的 arc 正好是 $\mu$ 选的那些，它在 LP 里叫 reduced cost。

:::wrong 只要 cost 是一段一段加起来的，Bellman equation 就成立
证明的第一个方向用到了“后半段不受前半段限制”。要求 path 不许重复经过 node（simple path），这一条就断了。取 [CS2040 第 8 站](../courses/CS2040.html#sssp)讲 negative cycle 时的 graph：s→a（2），s→b（5），b→a（−4），a→c（1），c→b（1），求从 $s$ 出发的最便宜的 simple path。到 $c$ 最便宜的是 $s\to b\to a\to c$，cost 2；它的前一段 $s\to b$ cost 5，可到 $b$ 最便宜的 simple path 是 $s\to a\to c\to b$，cost 4。后者接上 $b\to a\to c$ 会重复经过 $a$ 和 $c$，不是 simple path。从 $b$ 往后能走哪些 node，取决于之前用掉了哪些，“optimal solution 的前一段也是 optimal 的”不再成立。要恢复 Bellman equation，只能把“用过哪些 node”也放进 state，state 的个数随之变成 exponential，TSP 的 Held–Karp DP 就是这样做的。[CS4246 第 2 站](../courses/CS4246.html#mdp)要求 state 是 Markov 的，说的是同一件事。
:::

### 下一步是 random 的时候

让每一步的结果带 randomness：在 $x$ 选 action $u$，付 cost $c(x,u)$，下一个 state 以 probability $P(x'\mid x,u)$ 是 $x'$。目标是让总 cost 的 expectation 最小。Proof 照搬，只在“后半段”多一步 conditioning：已知在 $x$ 选了 $u$、下一个 state 是 $x'$，若 transition 只取决于当前的 state 和 action（Markov property），从 $x'$ 往后的过程和“从 $x'$ 重新出发”有同样的 distribution，之后最好的 expected cost 就是 $V^*(x')$。第一个方向里，对每一个可能的 $x'$ 各接一个从 $x'$ 出发的 optimal policy；policy 本来就按当前 state 选 action，这样拼起来仍是一个 policy。对 $x'$ 取 expectation，再对 $u$ 取 min：

$$V^*(x)=\min_u\Big[c(x,u)+\sum_{x'}P(x'\mid x,u)\,V^*(x')\Big]$$

如果 $k$ 步之后的 cost 要乘 $\gamma^k$（$0\le\gamma\le1$），后半段整体晚了一步，多乘一个 $\gamma$：

$$V^*(x)=\min_u\Big[c(x,u)+\gamma\sum_{x'}P(x'\mid x,u)\,V^*(x')\Big]$$

无穷多步时 optimal policy 的存在和“展开 $k$ 次”的严格 proof 在 [CS4246 第 2 站](../courses/CS4246.html#mdp)。后面每门课的 equation 都是这个式子的特例：

- 每个 $u$ 只通向一个 $x'$、$\gamma=1$：shortest path，就是上一小节。
- 每个 state 只有一个 action，没有 min：first-step analysis，或者固定 policy 时的 policy evaluation。
- 求 reward 的 max：令 $r=-c$，min 换成 max。
- $x$ 是连续的 vector，$x'=Ax+Bu$，cost 是 quadratic：LQR。
- $\sum_{x'}P(x'\mid x,u)V(x')$ 换成一个 sample 的 $V(x')$：TD 与 Q-learning。

## 三种解法

$V^*$ 出现在 equation 两边。按 graph 的结构有三种解法，后面的课用的都是其中之一。

**没有 cycle：按次序一遍算完。** Graph 是 DAG 时，按 topological order 的逆序处理，轮到 $x$ 时它的 successor 都已经算好，每个 node 算一次，$O(V+E)$。第一张图就是这样做的。Finite horizon 的问题总是这种情形：把“还剩几步”放进 state，$(x,k)$ 只通向 $(x',k-1)$，不可能有 cycle。CS3230 的 DP table 和 LQR 从 $S[N]$ 往回的 Riccati recursion 都属于这一种。

**有 cycle、cost 非负：按 $V^*$ 从小到大。** 在反向的 graph 上从 $t$ 跑 Dijkstra，每次把还没定下来的 node 里估计最小的那个定下来。例子里定下来的次序是 $t(0)$、$d(2)$、$c(3)$、$a(6)$、$b(6)$、$s(7)$，正是 $V^*$ 从小到大。这个次序为什么对，[CS2040 第 8 站](../courses/CS2040.html#sssp)证明过；proof 里用到的“weight 非负”，保证了 optimal path 上越靠近 $t$ 的 node，$V^*$ 不会更大。

**一般情形：把 equation 当成 iteration。** 把右边看成一个 operator $T$，它把一个 vector $V$ 变成另一个：

$$(TV)(x)=\min_{x'}\big[c(x,x')+V(x')\big],\qquad(TV)(t)=0$$

$V^*$ 满足 $TV^*=V^*$，是 $T$ 的 fixed point。从一个猜测 $V_0$ 出发反复做 $V_{k+1}=TV_k$。

取 $V_0(t)=0$、其余为 $\infty$ 时，$V_k(x)$ 有确切的意思：从 $x$ 到 $t$、不超过 $k$ 条 arc 的 path 里最小的 cost。对 $k$ 做 induction。$k=0$ 时只有 $t$ 有不超过 0 条 arc 的 path。一条从 $x\ne t$ 出发、不超过 $k+1$ 条 arc 的 path，是一条 arc $x\to x'$ 接上一条从 $x'$ 出发、不超过 $k$ 条 arc 的 path，后者最小是 $V_k(x')$，所以前者最小是 $\min_{x'}[c(x,x')+V_k(x')]=V_{k+1}(x)$。没有 negative cycle 时 optimal path 不超过 $n-1$ 条 arc（$n$ 是 node 数），所以 $n-1$ 轮之后 $V_k=V^*$。这就是 Bellman–Ford。

$T$ 有一条性质：若 $U(x)\le V(x)$ 对所有 $x$ 成立，则 $TU\le TV$。理由是方括号里的每一项 $c+U(x')\le c+V(x')$，一组较小的数，min 也较小。这叫 monotone。它直接给出两件事：

- $V_0\ge V^*$ 时，$V_k=T^kV_0\ge T^kV^*=V^*$，iteration 一直在 $V^*$ 上面，从上往下逼近。CS2040 说“relax 只会把估计改小，而且永远不会改过头”，就是这一条。
- $V_0\le V^*$ 时，一直在下面，从下往上逼近。

::fig[thread-bellman-sweeps] 同一个 network 上同时做两次 value iteration。每个 node 下面左边的数从 $V_0=\infty$ 出发，右边的从 $V_0=0$ 出发。静态时显示的是 $k=2$：左边每个数都 $\ge V^*$，右边都 $\le V^*$。

| $k$ | 从 $\infty$ 出发：$V_k$ 在 $s,a,b,c,d$ | 从 0 出发：$V_k$ 在 $s,a,b,c,d$ |
|---|---|---|
| 0 | ∞, ∞, ∞, ∞, ∞ | 0, 0, 0, 0, 0 |
| 1 | ∞, ∞, ∞, 5, 2 | 1, 3, 2, 1, 2 |
| 2 | ∞, 8, 6, 3, 2 | 3, 4, 5, 3, 2 |
| 3 | 7, 6, 6, 3, 2 | 6, 6, 6, 3, 2 |
| 4 | 7, 6, 6, 3, 2 | 7, 6, 6, 3, 2 |

从 0 出发的 $V_k(x)$ 是只算前 $k$ 步、之后当作免费时的最小 cost。左边一列在 $k=3$ 停下，因为 optimal path 最多 3 条 arc；右边一列要等所有“走了 $k$ 步还没到 $t$”的 walk 都比 optimal 贵才停，等多久取决于 cost 的大小。到 CS2105 那一节，这个差别会变成 47 轮对 2 轮。

加上 randomness 和 $\gamma$ 之后，$T$ 照样是 monotone 的（$P\ge0$）。$\gamma<1$ 时 [CS4246 第 3 站](../courses/CS4246.html#dp)还证明了 $T$ 是 $\infty$-norm 下的 $\gamma$-contraction：fixed point 唯一，从哪里出发都 converge，error 至少按 $\gamma^k$ 缩小。$\gamma=1$ 时没有 contraction，converge 靠 graph 的结构（没有 cycle、cost 为正、迟早会被 absorb），而且从哪里出发会影响结果，后面 CS2105 和 MA3238 两节各给一个例子。

## 各门课里的名字和记号

| 课与站 | 这门课叫它什么 | value 的记号 | equation 在这门课里的样子 | 往骨架上加了什么 |
|---|---|---|---|---|
| [CS2040 第 8 站](../courses/CS2040.html#sssp) | relax、Bellman–Ford、Dijkstra | $D[v]$（估计）、$\delta(v)$（真值） | $\delta(v)=\min_u[\delta(u)+w(u,v)]$ | 从 source 往前算；negative cycle 的检测 |
| [CS3230 第 5 站](../courses/CS3230.html#dp) | dynamic programming、optimal substructure、cut-and-paste | $E(i,j)$、$K(w,j)$ | $E(i,j)=\min\{E(i-1,j)+1,\ E(i,j-1)+1,\ E(i-1,j-1)+\mathrm{diff}(i,j)\}$ | state 要自己设计；pseudo-polynomial |
| [CS2105 第 6 站](../courses/CS2105.html#route) | distance vector、Bellman–Ford equation | $D_x(y)$ | $D_x(y)=\min_v[c(x,v)+D_v(y)]$ | 每个 node 是一台机器，asynchronous；link cost 会变 |
| [ST3236 第 2 站](../courses/ST3236.html#fsa) | first-step analysis | $h(x)$、$g(x)$、$N=(I-Q)^{-1}$ | $g(x)=1+p\,g(x+1)+q\,g(x-1)$ | 没有 min；absorbing state；matrix 写法 |
| [MA3238 第 1 站](../courses/MA3238.html#hit) | minimal nonnegative solution | $h^A_i$、$k^A_i$ | $k^A_i=1+\sum_{j\notin A}p_{ij}k^A_j$ | infinite state 时 solution 不唯一 |
| [MA3252 第 6 站](../courses/MA3252.html#path) | shortest path LP 的 dual、node potential | $d(i)$、$\pi_i$ | $\pi_j-\pi_i\le c_{ij}$ | equation 放宽成 inequality；complementary slackness |
| [RB3302 第 1 站](../courses/RB3302.html#search)、[第 7 站](../courses/RB3302.html#nav) | consistent heuristic、cost-to-goal、D* Lite | $g(s)$、$h(s)$、rhs | $h(s)\le c(s,s')+h(s')$ | 只关心一个 start；heuristic 是 $V^*$ 的 lower bound；map 会变 |
| [CS4246 第 2 站](../courses/CS4246.html#mdp)、[第 3 站](../courses/CS4246.html#dp) | Bellman expectation / optimality equation、value iteration、policy iteration | $v_\pi$、$v^*$、$q^*$、$T^*$ | $v^*(s)=\max_a[r(s,a)+\gamma\sum_{s'}P(s'\mid s,a)v^*(s')]$ | randomness、discount、contraction |
| [CS4246 第 6 站](../courses/CS4246.html#td)、[CS285 第 5 站](../courses/BERKELEY-CS285.html#q)、[MODERN-RL 第 4 站](../courses/MODERN-RL.html#offpolicy) | TD target、Q-learning、fitted Q-iteration | $Q(s,a)$、$Q_\phi$、$y$ | $y=r+\gamma\max_{a'}Q_{\phi'}(s',a')$ | expectation 换成 sample；function approximation |
| [MIT 6.8210 第 3 站](../courses/MIT-6.8210.html#lqr)、[第 4 站](../courses/MIT-6.8210.html#trajopt)、[RB2203 第 4 站](../courses/RB2203.html#ss) | LQR、Riccati equation、HJB、iLQR | $J^*(x)=x^\top Sx$、$S[n]$；iLQR 的 $V_x$、$Q_{uu}$ | $S[n-1]=Q+A^\top S[n]A-\cdots$ | state 连续；$V$ 恰好是 quadratic |

CS2040、CS3230 和 MA3252 的 $d$ 是从 source 往前算的 cost-to-arrive，对 predecessor 取 min；其余是往 destination 算的 cost-to-go，对 successor 取 min。把所有 arc 反向，两者互换。D* Lite 的论文就是这样从 LPA* 得到 D* Lite 的：交换 start 和 goal，把 pseudo code 里所有 edge 反向。

同一个字母在不同课里是不同的东西：

- $Q$：LQR 的 state cost matrix；RL 和 iLQR 的 action-value function；ST3236 里 transient state 之间的 transition block。
- $R$：LQR 的 control cost matrix；RL 的 reward；ST3236 里 transient 到 absorbing 的 block。
- $h$：RB3302 的 heuristic；ST3236 和 MA3238 的 hitting probability（它本身就是一个 value）。
- $g$：A* 的 $g$ 是从 start 来的 cost，D* Lite 的 $g$ 是到 goal 的 cost 的估计；ST3236 的 $g(x)$ 是 expected 局数。
- $K$：CS3230 的 knapsack table；LQR 的 gain，写成 $u=-Kx$；iLQR 的 gain，写成 $\delta u=k+K\delta x$，正负号和 LQR 相反。
- $N$：ST3236 的 fundamental matrix；LQR 的 horizon。

## CS2040：Bellman–Ford 就是 deterministic 的 value iteration

[CS2040 第 8 站](../courses/CS2040.html#sssp)证明 Bellman–Ford 的那句 induction，“第 $i$ 轮之后，shortest path 不超过 $i$ 条 edge 的 vertex 都对了”，和上一节的“$V_k$ 是不超过 $k$ 条 arc 的最小 cost”是同一个 statement，也和 [CS4246 第 3 站](../courses/CS4246.html#dp)的“$V_k(s)$ 正好是只剩 $k$ 步可走时的 optimal value”是同一个。三门课各自证了一遍。

两边有一处不同。CS2040 的 code 一算出 `D[e.v]` 就覆盖原值，同一轮里后面的 edge 用的已经是新值（一个 array）；CS4246 的表用整个 $V_k$ 算 $V_{k+1}$（两个 array）。前者叫 in-place，Edinburgh 的 RL 课说它 converge 得更快，快多少取决于次序。在本页的 network 上，in-place 按 $t,d,c,a,b,s$ 的次序 sweep，1 个 sweep 就到 $V^*$，因为这就是 DAG 的逆 topological order；按 $s,b,a,c,d,t$ 的次序要 3 个 sweep，和两个 array 一样，因为每个 node 用到的 successor 都还没更新。CS2040 的例子三轮一轮都省不掉，也是因为 edge list 的次序和 path 的方向相反。次序可以任意，只要每个 state 都会被反复更新，这叫 asynchronous DP；后面的 distance vector 和 D* Lite 都是它。

Negative cycle 在 CS4246 里也出现过，只是换了符号。把 [CS4246 第 2 站](../courses/CS4246.html#mdp)两个 state 的 MDP 的 reward 改写成 cost $c=-r$：A 的 self-loop（stay）cost 是 $-1$，B 留在 B 的 cost 是 $-2$，都是 negative cycle。CS4246 说两个 policy 的 reward sum“都是 infinity”，就是 Bellman–Ford 会报告的“shortest path 没有定义”。两门课的处理不同：CS2040 多做一轮把它检测出来；CS4246 改问题，给第 $k$ 步乘上 $\gamma^k$，一直在 A 绕圈的 cost 变成 $-(1+0.9+0.81+\cdots)=-10$，有限了，而且 $T$ 成了 contraction。

## CS3230：每张 DP table 底下都有一个 DAG

[CS3230 第 5 站](../courses/CS3230.html#dp)的 edit distance 看起来是填表，其实是 shortest path。Berkeley 的 Vazirani 在讲义里直接这样说：两个 string 的 edit distance，是从它们构造出的一个 DAG 上的 shortest path。Node 是格子 $(i,j)$；从 $(i-1,j)$ 到 $(i,j)$ 的 arc 是 delete，cost 1；从 $(i,j-1)$ 来的是 insert，cost 1；从 $(i-1,j-1)$ 来的是对齐两个字母，cost $\mathrm{diff}(i,j)$。CS3230 的 recurrence

$$E(i,j)=\min\begin{cases}E(i-1,j)+1\\E(i,j-1)+1\\E(i-1,j-1)+\mathrm{diff}(i,j)\end{cases}$$

逐项就是 $\delta(v)=\min_u[\delta(u)+w(u,v)]$：$E(i,j)$ 是从左上角 $(0,0)$ 到 $(i,j)$ 的 shortest distance。一行一行、每行从左到右填表，是这个 DAG 的一个 topological order。CS3230 的 cut-and-paste 论证用的正是 Bellman equation 证明第一个方向里的“接上去”：把剩下的部分换成更便宜的，拼回去仍是一个合法的 alignment。前面 simple path 的 counterexample，正是拼回去不再合法的情形。

::fig[thread-bellman-edit] CS3230 那张 SNOWY 对 SUNNY 的表的左上角：SN 对 SUN。每个 alignment 是一条从左上到右下的 path，cost 是 path 上 arc 的 cost 之和。

一个 alignment 就是这个 DAG 上的一条 path，所以 alignment 的个数就是 path 的个数（Delannoy number）：SN 对 SUN 有 25 条，只有 12 个 node；SNOWY 对 SUNNY 有 1683 条，36 个 node；两个 20 个字母的 string 有 $260{,}543{,}813{,}797{,}441\approx2.6\times10^{14}$ 条，441 个 node。和开头的 grid 一样，DP 的工作量跟着 node 走，不跟着 path 走。

Knapsack 也一样。Node 是 $(w,j)$，从 $(w,j-1)$ 来的 arc 是不拿第 $j$ 件，value 0；从 $(w-w_j,j-1)$ 来的是拿，value $v_j$。$K(w,j)$ 是到 $(w,j)$ 的 longest path（起点可以是 $j=0$ 那一行的任意一格），min 换成 max。Longest path 在一般 graph 上是 NP-hard 的，在这里没问题，因为 DAG 里没有 cycle 可以绕。

CS3230 往骨架上加的，是 state 要自己设计。Graph 不是题目给的：选 subproblem 就是选 state，选得对，“剩下怎么走只取决于 state”才成立。Edit distance 的 state 是“两个 prefix 已经对齐完”，之前怎么对齐不影响后面。

这也解释了 CS3230 的 pseudo-polynomial。DP 的工作量和 node 数成正比，node 数却可以是 input 长度的 exponential：knapsack 的 $W=10^{18}$ 在 input 里只占 60 个 bit，DAG 却有 $10^{18}$ 列。[RB3302 第 1 站](../courses/RB3302.html#search)的 7-dof arm 每个 joint 取 2° 一格，有 $6.1\times10^{15}$ 个 cell；[MIT 6.8210 第 4 站](../courses/MIT-6.8210.html#trajopt)说 state 超过四五个 dimension 就铺不了 mesh。三处是同一个现象：每个 state 上的 backup 很便宜，难在 state 太多。后面的 heuristic、function approximation 和 quadratic 的 $V$ 是绕开它的三种办法。

## CS2105：每个 router 只做自己那一格的 backup

[CS2105 第 6 站](../courses/CS2105.html#route)的 distance vector update

$$D_x(y)=\min_{v\in\text{neighbors}(x)}\{c(x,v)+D_v(y)\}$$

是 destination 为 $y$ 时，state $x$ 上的一次 Bellman backup。整张 $V$ 被拆开存：router $x$ 只存自己那一格，neighbor 把各自的格子发过来。谁收到新消息谁就更新，没有统一的 sweep，也没有固定次序，所以它是 asynchronous 的 value iteration。

Boyan 和 Littman 1993 年的 Q-routing 直接用了这个对应。Router $x$ 为每个 destination $d$、每个 neighbor $y$ 存一个估计 $Q_x(d,y)$：经 $y$ 把 packet 送到 $d$ 要多久。把 packet 交给 $y$ 之后，$y$ 回报 $t=\min_zQ_y(d,z)$，$x$ 按

$$Q_x(d,y)\leftarrow Q_x(d,y)+\eta\,\big(q+s+t-Q_x(d,y)\big)$$

更新（$q$ 是在 $x$ 排队的时间，$s$ 是传输时间）。论文自己说，这是一个 asynchronous、online 的 Bellman–Ford，取名 $Q$ 是因为它对应 Q-learning 的 Q function。按 neighbor 分列的那张 distance table 就是一张 Q-table：converge 后 router $z$ 去 $x$ 的两列是“经 $x$：50”和“经 $y$：$1+D_y(x)=5$”，取 min 就是 $D_z(x)=5$，取 argmin 就是 next hop。

### Count-to-infinity：从下面往上爬

CS2105 的例子：$c(x,y)=4$、$c(y,z)=1$、$c(x,z)=50$，converge 后 $D_y(x)=4$、$D_z(x)=5$。然后 $c(x,y)$ 涨到 60，新的答案是 $D_y(x)=51$（经 $z$）、$D_z(x)=50$（直连）。

用 monotone 一看就明白。旧值 $(4,5)$ 在新的 $V^*=(51,50)$ **下面**，iteration 从下面出发，只能一直待在下面往上爬。按 synchronous 的 sweep 算（每个 sweep 两个 router 同时用对方上一轮的值）：

$$(4,5)\to(6,5)\to(6,7)\to(8,7)\to\cdots\to(50,49)\to(50,50)\to(51,50)$$

$y$ 和 $z$ 都以对方为 next hop，每个 sweep 里较小的那个变成另一个加 1，所以两者中较小的那个每个 sweep 只涨 1，也就是 $y$–$z$ 那条 link 的 cost。一共 47 个 sweep。换成从 $\infty$ 出发：$(\infty,\infty)\to(60,50)\to(51,50)$，2 个 sweep。

::fig[thread-bellman-dv] $c(x,y)$ 从 4 变成 60 之后，$D_y(x)$ 的两条 iteration。彩色从旧值出发，在 $V^*$ 下面一格一格往上爬；黑色从 $\infty$ 出发，在 $V^*$ 上面，两步就落到 51。

反过来，$c(x,y)$ 从 4 降到 1 时，旧值 $(4,5)$ 在新的 $V^*=(1,2)$ **上面**，$(4,5)\to(1,5)\to(1,2)$，2 个 sweep。CS2105 说的“好消息传得快、坏消息传得慢”，关键在旧值落在 fixed point 的哪一边。2025 年一篇分析 distributed Bellman–Ford 的论文把这件事写成了两个 bound：overestimate 在和 effective diameter（shortest path 上最多的 node 数）成正比的轮数内消失，只取决于 graph；underestimate 里最小的那个每轮至少涨 $e_{\min}$（最小的 edge weight），所以要多少轮还取决于 initial estimate，论文把这个现象和 routing 的 count-to-infinity 联系在一起。上面的例子里最小的 underestimate 每个 sweep 恰好涨 1，从 4 涨到 51，正好 47 个 sweep。

如果 $x$ 的两条 link 都断了，$V^*=\infty$，从下面永远爬不到。RIP 把 16 当作 $\infty$，等于给 iteration 设一个顶。Poisoned reverse 让 $z$ 对 $y$ 谎报 $\infty$，等于把“$y$ 经 $z$ 再回到 $y$”这一步从 $y$ 的选项里去掉；它只去得掉两个 router 之间的 loop，三个 router 的 loop 照样一圈一圈地爬（CS2105 那一站有 poisoned reverse 救不了的例子）。根子在 $\gamma=1$：没有 contraction，绕一圈 loop 只让 estimate 涨这圈的 cost，loop 越便宜爬得越慢。

:::wrong 在旧的估计上接着 iterate，总比从头算快
Link cost 下降时确实快：旧值在新的 fixed point 上面，2 个 sweep。上升时旧值在下面，接着 iterate 要 47 个 sweep，从 $\infty$ 重新开始只要 2 个。Warm start 快不快，要看旧值在 fixed point 的哪一边，以及从下面爬时 loop 有多便宜。
:::

## ST3236 与 MA3238：没有 min 的 Bellman equation

### First-step analysis 就是 policy evaluation

[ST3236 第 2 站](../courses/ST3236.html#fsa)的 gambler's ruin：

$$g(x)=1+p\,g(x+1)+q\,g(x-1),\qquad g(0)=g(N)=0$$

是只有一个 action、$\gamma=1$、每步 cost 1、两端是 destination 的 Bellman equation。$h(x)=p\,h(x+1)+q\,h(x-1)$、$h(N)=1$ 也是，只是每步 cost 0，到达 $N$ 时拿 reward 1。ST3236 推导时说的那一句，“已知 $X_1=x+1$，由 Markov property，从时刻 1 开始的 path 和从 $x+1$ 出发的一条新 chain 有同样的 distribution”，正是“下一步是 random 的时候”那一小节里的 conditioning。

Matrix 写法也一一对应。ST3236 在 transient state 上写 $g=\mathbf 1+Qg$，得 $g=(I-Q)^{-1}\mathbf 1=N\mathbf 1$。CS4246 写 $v_\pi=r_\pi+\gamma P_\pi v_\pi$，得 $v_\pi=(I-\gamma P_\pi)^{-1}r_\pi$。所以 transient block $Q$ 对应 $\gamma P_\pi$，fundamental matrix $N$ 对应 $(I-\gamma P_\pi)^{-1}$，每步的 cost $\mathbf 1$ 对应 $r_\pi$。

### Discount 是一个吸收的“结束”state

$\gamma$ 能放进 $Q$，是因为 discount 可以换成 absorption。CS4246 第 1 站提过：每走一步，过程以 $1-\gamma$ 的 probability 结束。把“结束”画成一个 absorbing state，就是一条 ST3236 的 absorbing chain。拿 CS4246 两个 state 的 MDP、$\pi_{\text{go}}$、$\gamma=0.9$ 算一遍。

::fig[thread-bellman-death] $\pi_{\text{go}}$ 下 A、B 之间的 transition 都乘了 0.9，剩下的 0.1 进入“结束”。右边是用 ST3236 的 fundamental matrix 读出来的数。

Transient 的是 A、B：

$$Q=0.9\begin{pmatrix}0&1\\0.1&0.9\end{pmatrix}=\begin{pmatrix}0&0.9\\0.09&0.81\end{pmatrix},\qquad I-Q=\begin{pmatrix}1&-0.9\\-0.09&0.19\end{pmatrix}$$

$\det(I-Q)=0.19-0.081=0.109$，

$$N=(I-Q)^{-1}=\frac1{0.109}\begin{pmatrix}0.19&0.9\\0.09&1\end{pmatrix}=\begin{pmatrix}1.743&8.257\\0.826&9.174\end{pmatrix}$$

ST3236 说 $N$ 的 $(i,j)$ entry 是从 $i$ 出发、被 absorb 之前在 $j$ 停留的 expected 次数。每个 row 加起来都是 10：被 absorb 之前 expected 走的步数，也就是 geometric distribution 的 mean $1/(1-\gamma)$。乘上每步的 reward $r_\pi=(0,2)$：

$$v_\pi=Nr_\pi=\begin{pmatrix}1.743\times0+8.257\times2\\0.826\times0+9.174\times2\end{pmatrix}=\begin{pmatrix}16.514\\18.349\end{pmatrix}$$

正是 CS4246 解 linear system 得到的 $v_{\pi_{\text{go}}}$。CS4246 用“$\|P_\pi x\|_\infty\le\|x\|_\infty$”证明 $I-\gamma P_\pi$ invertible，ST3236 用“迟早会被 absorb，$Q^k\to0$”证明 $I-Q$ invertible，说的是同一件事：每一步都有 0.1 的 probability 漏出去。

### Minimal solution 就是从 0 出发的 value iteration

$\gamma=1$ 且 state 无穷多时，first-step equations 的 solution 可以不唯一。[MA3238 第 1 站](../courses/MA3238.html#hit)的例子：往右 0.6、往左 0.4 的 random walk，问从 $i$ 出发会不会碰到 0。$h_i=0.4h_{i-1}+0.6h_{i+1}$、$h_0=1$ 的 nonnegative solution 是一整族 $h_i=a+(1-a)(2/3)^i$，$a\ge0$；真实的 probability 是最小的那个，$a=0$。

那个 theorem 的 proof 是“反复代入，丢掉非负的余项”。换成本页的话：令 $h^{(0)}=\mathbf 1\{i\in A\}$，每次用 equation 右边更新一次，$h^{(n)}_i$ 正好是 $P_i(H^A\le n)$，也就是“只剩 $n$ 步”时的 value，和三种解法那一节“从 0 出发”的那一列同一个意思。这是从下面出发的 value iteration：$h^{(n)}_1$ 依次是 0.4（$n=1$）、0.496（$n=3$）、0.588（$n=10$）、0.659（$n=50$）、0.6666（$n=200$），爬向 $2/3$。Expected hitting time $k^A_i=1+\sum_{j\notin A}p_{ij}k^A_j$ 是每步 cost 1 的 stochastic shortest path，minimal solution 的证明一样，从 0 出发往上爬。

:::wrong Value iteration 从哪里出发，都会 converge 到同一个 fixed point
$\gamma<1$ 时对，CS4246 用 contraction 证明了 fixed point 唯一。$\gamma=1$ 时 fixed point 可以有很多个。MA3238 的例子里 $h\equiv1$ 也满足 equation：$0.4\times1+0.6\times1=1$。从 $h\equiv1$ 出发，iteration 一步也不动，停在错的 solution 上；从 0 出发才爬到真正的 $(2/3)^i$。真实的 value 是最小的 nonnegative solution，多出来的 solution 都在它上面，所以必须从下面逼近。Shortest path 正好可以从上面逼近：cost 为正时，按 CS2040 的 proof，从 $\infty$ 出发 $n-1$ 轮就对了；从下面也能到，只是轮数取决于 cost，CS2105 的例子要 47 轮。
:::

## MA3252 与 RB3302：把 equation 放宽成 inequality

### Shortest path 的 dual 是 Bellman inequality

[MA3252 第 6 站](../courses/MA3252.html#path)写出了 shortest path LP 的 dual：$\max\ \pi_t-\pi_s$，s.t. 每条 arc 上 $\pi_j-\pi_i\le c_{ij}$。令 $\pi_i=-V(i)$，它变成

$$\begin{aligned}\max\ &V(s)\\\text{s.t.}\ &V(i)\le c_{ij}+V(j)\ \text{对每条 arc }(i,j),\quad V(t)=0\end{aligned}$$

每个 constraint 是 Bellman equation 里 min 的一项。Bellman equation 说 $V(i)$ 不超过每一项、并且等于其中一项；dual 只保留了“不超过每一项”，即 $V\le TV$。

为什么 dual 的 optimal value 就是 $V^*(s)$？取任意一个 feasible 的 $V$ 和任意一条 path $i=x_0\to x_1\to\cdots\to x_k=t$，沿 path 把 constraint 一条条接起来：

$$\begin{aligned}V(x_0)&\le c(x_0,x_1)+V(x_1)\\&\le c(x_0,x_1)+c(x_1,x_2)+V(x_2)\\&\le\cdots\le\sum_{m=0}^{k-1}c(x_m,x_{m+1})+V(t)\end{aligned}$$

最后一项就是这条 path 的 cost。对所有 path 成立，所以 $V(i)\le V^*(i)$。而 $V^*$ 满足 Bellman equation，自然满足每个 inequality，是 feasible 的。所以 $V^*$ 是在每个 node 上同时最大的 feasible $V$，maximize $V(s)$ 得到的正是 $V^*(s)$。Complementary slackness 说有 flow 的 arc 必须 tight：$V^*(i)=c_{ij}+V^*(j)$，也就是取到 argmin 的 arc。

把每条 arc 的 slack $c_{ij}+V^*(j)-V^*(i)$ 算出来，就是第一节说的 reduced cost：

| arc | $s\to a$ | $s\to b$ | $b\to a$ | $a\to c$ | $b\to c$ | $b\to d$ | $c\to d$ | $c\to t$ | $d\to t$ |
|---|---|---|---|---|---|---|---|---|---|
| $c_{ij}$ | 4 | 1 | 2 | 3 | 7 | 4 | 1 | 5 | 2 |
| $c_{ij}+V^*(j)-V^*(i)$ | 3 | 0 | 2 | 0 | 4 | 0 | 0 | 2 | 0 |

::fig[thread-bellman-reduced] 左边是原来的 cost 和 $V^*$，右边是 reduced cost。Tight 的五条 arc 组成一棵指向 $t$ 的 tree，就是 policy $\mu$。

MA3252 那一站用的 potential 是从 $s$ 出发的 distance $d=(0,3,1,6,5,7)$（依次是 $s,a,b,c,d,t$），tight 的 arc 是从 $s$ 长出去的 tree；这里的 $\pi=7-V^*=(0,1,1,4,5,7)$ 也是 optimal 的 dual，tight 的 arc 是指向 $t$ 的 tree。Dual 的 optimal solution 不唯一，两棵 tree 共有的正是 $s\to b\to d\to t$。

### Consistent heuristic 就是 dual feasible

[RB3302 第 1 站](../courses/RB3302.html#search)要求 A* 的 heuristic consistent：$h(\text{goal})=0$，每条 arc 上 $h(s)\le c(s,s')+h(s')$。这和 dual 的 constraint 一字不差。所以 consistent 的 $h$ 就是 dual 的一个 feasible solution，上面那串 inequality 直接给出 $h\le V^*$，也就是 admissible，“consistent 推出 admissible”的标准证明就是它。$V^*$ 本身是最大的 consistent heuristic。一个放宽了的问题的精确 cost-to-go 总是 consistent 的：RB3302 的 octile distance 是空 grid 上的 $V^*$，那一站证明它 admissible 用的正是“有 obstacle 只会删掉 edge，最短 path 只会更长”；本页的 network 上，把每条 arc 的 cost 都换成 1（这里最小的 cost），得到 hop 数 $h=(3,2,2,1,1,0)$，每条真实的 cost 都 $\ge1$，inequality 自然成立。

Reduced cost 给出 A* 的另一种读法。定义 $c_h(s,s')=c(s,s')+h(s')-h(s)$，consistent 等价于 $c_h\ge0$。一条从 $s_0$ 到 goal 的 path，reduced cost 之和中间各项抵消，等于原来的 cost 减去 $h(s_0)$（$h(\text{goal})=0$）。从同一个 start 出发的所有 path 都差同一个 constant，谁短谁长不变，于是可以在 $c_h$ 上跑 Dijkstra。Dijkstra 的 tentative distance 是 $g+h-h(s_0)=f-h(s_0)$，和 A* 按 $f=g+h$ 排序的次序完全一样。Eppstein 的讲义把 A* 定义成“Dijkstra 加 reweighting”，说两种写法是同一个 algorithm，按同样的次序选同样的 vertex。

在 network 上核对。$h$ 取 hop 数时，在 reduced cost 上跑 Dijkstra，定下来的次序是 $s,b,a,d,c,t$，distance 0、0、2、3、4、4；A* 用同一个 $h$，pop 的次序相同，$f$ 是 3、3、5、6、7、7，每个都大 $h(s)=3$。这个 network 太小，hop 数和 $h=0$ 一样要 expand 全部 6 个 node；$h$ 取 $V^*$ 时，A* 只 expand $s,b,d,t$，$f$ 都是 7。

CS2040 那一站有一个看起来对的错误做法，用同一个想法可以修好。那里给每条 edge 加同一个 constant 4，s→a 变成 6，s→b→a 变成 9，谁短谁长被改掉了：有 $k$ 条 edge 的 path 被加了 $4k$。改成加 potential 的差就不会：用 Bellman–Ford 先算出 $\delta=(\delta(s),\delta(a),\delta(b))=(0,1,5)$，令 $c'(u,v)=c(u,v)+\delta(u)-\delta(v)$，三条 edge 变成 s→a 1、s→b 0、b→a 0，全都非负，而每条从 $s$ 到 $a$ 的 path 都恰好少了 $\delta(a)-\delta(s)=1$，s→b→a 仍比 s→a 短。先跑一次 Bellman–Ford、再从每个 source 跑 Dijkstra，这就是 Johnson's algorithm。

### D* Lite 的 rhs 是一次 backup

[RB3302 第 7 站](../courses/RB3302.html#nav)讲了 replanning 为什么从 goal 往回搜：存的是 cost-to-goal，robot 走动不改变它，map 改了也只影响一部分 cell。那一站没有讲 D* Lite 本身。D* Lite 给每个 vertex 存 goal distance 的估计 $g(s)$，再存

$$\text{rhs}(s)=\min_{s'\in\text{Succ}(s)}\big[c(s,s')+g(s')\big]$$

论文叫它 one-step lookahead value，就是 $(Tg)(s)$。论文说 $g(s)=\text{rhs}(s)$ 时 vertex 是 locally consistent 的，也就是 Bellman equation 在 $s$ 上成立；priority queue 里装的恰好是全部 locally inconsistent 的 vertex。所以 D* Lite 是只 backup “equation 还不成立的 state”、按 A* 式的 key 排先后的 asynchronous value iteration。Map 一变，$T$ 跟着变，一开始只有 cost 变了的 arc 的起点不 consistent，从它们修起，变化一层层传出去，传不到的 vertex 不碰。Robot 每一步走向让 $c(s,s')+g(s')$ 最小的 neighbor，就是第一节的 $\mu$。

## CS4246：contraction、policy iteration 与 LP

[CS4246 第 2 站](../courses/CS4246.html#mdp)和[第 3 站](../courses/CS4246.html#dp)在骨架上加了三样：$\gamma$ 和 contraction（fixed point 唯一、从哪里出发都 converge、能算出何时停）；$q^*(s,a)$，即 max 里面的那一项，也就是 distance vector 按 neighbor 分列的那张表；policy iteration，交替解一个没有 max 的 linear system（ST3236 那种）和做一次 improvement。

骨架的 LP 读法在这里也成立，而且把 MA3252 和 ST3236 连起来。Reward 求 max 时 inequality 反过来：若 $v\ge T^*v$，由 monotone，$v\ge T^*v\ge(T^*)^2v\ge\cdots$，而 contraction 保证 $(T^*)^kv\to v^*$，所以 $v\ge v^*$。$v^*$ 是满足 $v\ge T^*v$ 的最小的 $v$，于是

$$\begin{aligned}\min\ &\sum_s\alpha(s)\,v(s)\\\text{s.t.}\ &v(s)\ge r(s,a)+\gamma\sum_{s'}P(s'\mid s,a)\,v(s')\ \text{对每个 }(s,a)\end{aligned}$$

$\alpha(s)$ 是起点的 distribution。两个 state 的 MDP 有三个 constraint：

$$\begin{aligned}v(A)&\ge1+0.9\,v(A)&&(\text{stay})\\v(A)&\ge0.9\,v(B)&&(\text{go})\\v(B)&\ge2+0.9\big(0.1\,v(A)+0.9\,v(B)\big)\end{aligned}$$

取 $\alpha=(1,0)$（从 A 出发；B 从 A 走得到，$v(B)$ 也会被压到最小），用 LP solver 解得 $v=(16.514,\ 18.349)=v^*$。go 和 B 的 constraint tight；stay 有 slack $16.514-(1+0.9\times16.514)=16.514-15.862=0.651$，等于 $v^*(A)-q^*(A,\text{stay})$。Slack 为 0 的 action 是 optimal 的，和 shortest path 里 reduced cost 为 0 的 arc 是 policy 一样。

Dual 给每个 constraint 一个 variable $\mu(s,a)\ge0$：

$$\begin{aligned}\max\ &\sum_{s,a}\mu(s,a)\,r(s,a)\\\text{s.t.}\ &\sum_a\mu(s',a)-\gamma\sum_{s,a}P(s'\mid s,a)\,\mu(s,a)=\alpha(s')\ \text{对每个 }s'\end{aligned}$$

Solver 给出 $\mu(A,\text{stay})=0$、$\mu(A,\text{go})=1.743$、$\mu(B)=8.257$，正好是上一节 $N$ 的第一个 row：从 A 出发、结束之前在各个 state 的 expected 次数。核对 constraint：在 A，$1.743-0.9\times0.1\times8.257=1.743-0.743=1=\alpha(A)$；在 B，$8.257-0.9\times(1\times1.743+0.9\times8.257)=8.257-0.9\times9.174=0$。Objective 是 $8.257\times2=16.514=v^*(A)$。Mahajan 的讲义把这些 $\mu$ 叫 occupancy measure，并说 $\mu(s,a)/\sum_{a'}\mu(s,a')$ 就是 optimal policy。$\gamma=1$、transition deterministic 时，dual 的 constraint 变成“从 $s'$ 流出的减去流进的等于 $\alpha(s')$”，就是 MA3252 的 flow conservation $Mf=b$。两边的角色正好对调：MA3252 把 flow 写成 primal、potential 是 dual；MDP 习惯把 value 写成 primal、flow 是 dual。

:::wrong MDP 要的是最大的 return，所以 LP 应该 maximize $\sum_s v(s)$
Constraint $v\ge T^*v$ 只给 $v$ lower bound。$v=(100,100)$：$100\ge1+90$，$100\ge0+90$，$100\ge2+0.9\times(10+90)=92$，全部满足，再大也满足，maximize 是 unbounded。$v^*$ 是满足 constraint 的最小的 $v$，所以要 minimize。Shortest path 那边方向相反：constraint $V(i)\le c_{ij}+V(j)$ 只给 upper bound，所以 maximize。两边都取 constraint 允许的最极端的那个 $V$，极端在哪一头，由 inequality 的方向决定。
:::

Policy iteration 也有 LP 的读法。Ye 证明了 policy iteration（包括 simplex method）在固定的 discount 下是 strongly polynomial 的，摘要里把 simplex method 和 simple policy iteration 当作同一个方法：每次只换一个 state 的 action，就是一次 pivot；Howard 的 policy iteration 每轮把所有能改进的 state 一起换，相当于一次 pivot 进好几个 variable（这一句是我的理解）。两个 state 的 MDP 上，从 $\pi_{\text{stay}}$ 出发，$q(A,\text{go})=13.737>v(A)=10$，换成 go，即 $\mu(A,\text{go})$ 进 basis、$\mu(A,\text{stay})$ 出去，一次 pivot 就到了 optimal。

## CS285 与 MODERN-RL：expectation 换成 sample

[CS4246 第 6 站](../courses/CS4246.html#td)已经把 Q-learning 写成了带 noise 的 value iteration：target $R+\gamma\max_{a'}Q(S',a')$ 的 conditional expectation 是 $(T^*Q)(s,a)$，每次只更新一个 entry、只走一小步。

[CS285 第 5 站](../courses/BERKELEY-CS285.html#q)的 fitted Q-iteration 是同一件事的 batch 版本：(2) 对 dataset 里每条 transition 用 target parameter $\phi'$ 算 $y=r+\gamma\max_{a'}Q_{\phi'}(s',a')$；(3) 对 $Q_\phi\approx y$ 做 regression。如果 $Q$ 是一张 table、regression 做到底，每个 $(s,a)$ 的 $Q_\phi$ 就等于它那些 sample 的 $y$ 的平均，一个外层 iteration 正好是一次 value iteration 的 sweep，只是 $\sum_{s'}P(s'\mid s,a)$ 换成了 sample 平均。$\phi'$ 是旧的 array，$\phi$ 是新的：两个 array 的 synchronous 版本。DQN 每 10,000 步才更新一次 target，每一段近似做一次 $T$；online Q-learning 令 $\phi'=\phi$，是 in-place 的版本。

:::wrong Target network 是为了让 value 传得更快
Table 上恰好相反。Edinburgh 的 RL 课说 in-place 比两个 array converge 得快；本页的 network 上，in-place 按好的次序 1 个 sweep 到 $V^*$，两个 array 要 3 个。Target network 要解决的是 function approximation 带来的问题：更新 $\phi$ 会同时改变所有 $(s,a)$ 的 $Q$，包括 target 里的 $s'$，CS285 说 regression 的目标“一直在跑”；冻住 $\phi'$，每一段就是一个 well-defined 的 regression，近似地做一次 $T$。近似的 $T$ 不一定是 contraction，这是 [CS4246 第 7 站](../courses/CS4246.html#fa) deadly triad 的内容。
:::

这两门课还换了 $T$ 本身，换了 operator，fixed point 就跟着换：

- CS285 的 $n$-step target 先按 behavior policy 走 $n-1$ 步再取 max，它的 fixed point 不是 $q^*$。那一站的表里，$Q^*=10$，$n=10$ 时 Q-learning converge 到 5.77，再多的 data 也拉不回来。
- [MODERN-RL 第 4 站](../courses/MODERN-RL.html#offpolicy)的 SAC 把 max 换成 soft max：$V(s)=\alpha\log\sum_a\exp(Q(s,a)/\alpha)$。那一站的例子 $Q=(1,0)$、$\alpha=0.5$ 给出 1.0635，比 max 的 1 大；$\alpha\to0$ 时回到 max。

## MIT 6.8210：state 连续时，value 是一个 quadratic

$x$ 连续时，$V$ 没法存成一张 table。有两条路：把 state 切成 grid，在 grid 上做 value iteration；或者找一族 function，$T$ 把它映到它自己，只需要 iterate 几个参数。Linear dynamics 加 quadratic cost 时，quadratic function 就是这样一族。

### Riccati recursion 是 value iteration

取一个 scalar 的例子：$x_{n+1}=1.2x_n+0.5u_n$，每步 cost $x^2+u^2$。写成一般的 $x'=ax+bu$、cost $qx^2+ru^2$。$V_k$ 是还剩 $k$ 步时的 optimal cost，$V_0=0$，

$$V_k(x)=\min_u\big[qx^2+ru^2+V_{k-1}(ax+bu)\big]$$

设 $V_{k-1}(x)=s\,x^2$（$k=1$ 时 $s=0$ 成立）。方括号对 $u$ 是开口向上的 parabola，derivative 为 0：

$$2ru+2sb(ax+bu)=0\quad\Longrightarrow\quad u=-\frac{abs}{r+b^2s}\,x$$

代回去。先算下一个 state：$ax+bu=ax\Big(1-\dfrac{b^2s}{r+b^2s}\Big)=\dfrac{ar}{r+b^2s}\,x$。于是 $ru^2=\dfrac{r\,a^2b^2s^2}{(r+b^2s)^2}x^2$，$s(ax+bu)^2=\dfrac{s\,a^2r^2}{(r+b^2s)^2}x^2$，两项相加提出 $a^2rs$：

$$\begin{aligned}qx^2+ru^2+s(ax+bu)^2&=qx^2+\frac{a^2rs\,(b^2s+r)}{(r+b^2s)^2}\,x^2\\&=\Big(q+\frac{a^2rs}{r+b^2s}\Big)x^2\end{aligned}$$

$V_k$ 仍是 quadratic，coefficient 是

$$s_k=q+\frac{a^2r\,s_{k-1}}{r+b^2s_{k-1}}$$

由 induction 每个 $V_k$ 都是 quadratic，value iteration 只需要更新一个数。这就是 [MIT 6.8210 第 3 站](../courses/MIT-6.8210.html#lqr)的 Riccati difference equation 的 scalar 版本：那里的 $Q+A^\top SA-(A^\top SB)(R+B^\top SB)^{-1}(B^\top SA)$ 在 scalar 时是 $q+a^2s-\dfrac{a^2b^2s^2}{r+b^2s}=q+\dfrac{a^2rs}{r+b^2s}$。

拿 $a=1.2$、$b=0.5$、$q=r=1$ 两边各算一遍。Riccati 这边从 $s_0=0$ 出发：$s_1=1$，$s_2=1+\dfrac{1.44\times1}{1+0.25}=2.152$，接着是 3.015、3.476、3.678，第 12 步 3.810，停在 $s_\infty=3.810$，gain $K=\dfrac{abs_\infty}{r+b^2s_\infty}=1.171$，closed loop 每步乘 $1.2-0.5\times1.171=0.615$。Grid 这边把 $[-3,3]$ 切成 301 个点，$u$ 每 0.002 取一个，$V_{k-1}$ 在 grid point 之间做 linear interpolation，逐点取 min：

| $k$ | 1 | 2 | 3 | 5 | 12 |
|---|---|---|---|---|---|
| Riccati 的 $s_k$ | 1.000 | 2.152 | 3.015 | 3.678 | 3.810 |
| grid 上的 $V_k(1)$ | 1.000 | 2.152 | 3.015 | 3.678 | 3.812 |
| Riccati 的 $u$ 在 $x=1$：$-ab\,s_{k-1}/(r+b^2s_{k-1})$ | 0 | −0.480 | −0.840 | −1.116 | −1.171 |
| grid 上 $x=1$ 取到 min 的 $u$ | 0 | −0.48 | −0.84 | −1.12 | −1.16 |

::fig[thread-bellman-lqr] 左边的点是 grid 上 value iteration 得到的 $V_k$（只画了每隔 0.2 的点），实线是 $s_kx^2$，虚线是 $s_\infty x^2$；右边是 $s_k$ 随 $k$ 的变化，黑点是 grid 上的 $V_k(1)$。静态时是 $k=12$。

两边对得上。Grid 上的 $u$ 差一点，是因为 piecewise linear 的 $V$ 在 grid point 处有 kink，min 常落在 $ax+bu$ 正好是 grid point 的地方。代价却差很多：grid 每个 sweep 要算 $301\times6001$ 次，12 个 sweep 约 $2.2\times10^7$ 次，而且只有 1 个 dimension；Riccati 是 12 次 scalar 运算，并且是精确的。$n$ 个 dimension 时 grid 要 $301^n$ 个点，Riccati 只是 $n\times n$ 的 matrix。

Linear interpolation 还有一个意思。$ax+bu$ 落在 grid point $x_i$ 和 $x_{i+1}$ 之间时，$V(ax+bu)\approx\beta V(x_i)+(1-\beta)V(x_{i+1})$，$\beta=(x_{i+1}-ax-bu)/\Delta$，两个 weight 都 nonnegative、加起来是 1，形式上和 $\sum_{x'}P(x'\mid x,u)V(x')$ 一模一样。Underactuated 的 dynamic programming 一章正是这样在 mesh 上做 value iteration 的（barycentric interpolation）：一个 deterministic 的连续 system，在 grid 上变成了一个 MDP。

:::edge $\gamma=1$ 也 converge，前提是有一个 policy 的 cost 有限
LQR 没有 discount，$s_k$ 还是 converge 了。$V_1=qx^2\ge0=V_0$；若 $V_k\ge V_{k-1}$，由 monotone，$V_{k+1}=TV_k\ge TV_{k-1}=V_k$。由 induction，$s_k$ 是 monotone increasing 的，又是从下面爬。Upper bound 来自任意一个能把 $x$ 拉回来的 policy：取 $u=-x$，$x$ 每步乘 $1.2-0.5=0.7$，总 cost 是 $(1+1)(1+0.49+0.49^2+\cdots)x^2=\dfrac{2}{0.51}x^2=3.92\,x^2$，optimal 的不会更贵，所以 $s_k\le3.92$。Monotone 而且 bounded，必然 converge。若 $b=0$，$u$ 管不了 $x$，$s_k=1+1.44\,s_{k-1}$ 一路涨到 $\infty$。MIT 6.8210 第 3 站给 Riccati equation 加的 stabilizable 条件，说的就是这样一个 policy 存在。
:::

### HJB 是 time step 趋于 0 的 Bellman equation

MIT 6.8210 第 3 站直接写出了 HJB equation，Underactuated 的 dynamic programming 一章也只说 Bertsekas 给过一个由 discrete time 取 limit 的推导。把 $\dot x=f(x,u)$ 按 time step $\Delta t$ discretize，infinite horizon、time-invariant 的 Bellman equation 是

$$V(x)=\min_u\Big[\ell(x,u)\,\Delta t+V\big(x+f(x,u)\,\Delta t\big)\Big]$$

$V$ differentiable 时，$V(x+f\Delta t)=V(x)+\dfrac{\partial V}{\partial x}f\,\Delta t+o(\Delta t)$。代进去，$V(x)$ 与 $u$ 无关，可以从 min 里拿出来和左边抵消：

$$0=\min_u\Big[\ell(x,u)\,\Delta t+\frac{\partial V}{\partial x}f(x,u)\,\Delta t+o(\Delta t)\Big]$$

两边除以 $\Delta t$，令 $\Delta t\to0$：

$$0=\min_u\Big[\ell(x,u)+\frac{\partial V}{\partial x}f(x,u)\Big]$$

这就是 MIT 6.8210 从中猜 $J^*=x^\top Sx$、推出 algebraic Riccati equation 的那个 HJB；[RB2203 第 4 站](../courses/RB2203.html#ss)为 double integrator 手解的 algebraic Riccati equation 也从它来。$V$ 不 differentiable 时这一步不成立，要另外处理。

### iLQR 的 $Q$ 是 action-value function

[MIT 6.8210 第 4 站](../courses/MIT-6.8210.html#trajopt)的 iLQR 在每一步展开 $Q(x,u)=\ell(x,u)+V_{n+1}(f(x,u))$。这个 $Q$ 就是 CS4246 的 $q(s,a)$，cost 版本：这一步做 $u$，之后按 optimal 走。Backward pass 是从后往前的 DP，每一步把 $Q$ 展开到 second order，对 $\delta u$ 取 min。Dynamics 本身 linear、cost 本身 quadratic 时，展开没有 error，iLQR 的一步就是 LQR。拿上面的 scalar 例子核对：$V=s_\infty x^2$，$V_{xx}=2s_\infty=7.619$，

$$\begin{aligned}Q_{uu}&=\ell_{uu}+f_u^\top V_{xx}f_u=2+0.25\times7.619=3.905\\Q_{ux}&=\ell_{ux}+f_u^\top V_{xx}f_x=0+0.5\times7.619\times1.2=4.572\end{aligned}$$

$K=-Q_{uu}^{-1}Q_{ux}=-4.572/3.905=-1.171$，正是 LQR 的 gain，只是 iLQR 写成 $\delta u=K\delta x$，所以多一个负号。

:::wrong iLQR 的 $Q_{xx}$ 就是 LQR cost 里的那个 $Q$ matrix
两个 $Q$ 只是同名。LQR 的 $Q$ 是这一步的 state cost，例子里 $q=1$，对应 $\ell_{xx}=2q=2$。iLQR 的 $Q_{xx}=\ell_{xx}+f_x^\top V_{xx}f_x=2+1.44\times7.619=12.97$，多出来的 10.97 是这一步之后的全部未来，经 dynamics 传回来的部分。把它当成 cost matrix，等于把 Bellman equation 右边的 $V(x')$ 那一项丢掉了。
:::

:::from
用 WebFetch 读的（都是逐段摘录，不是全文）：Bellman 1954 年的 [The theory of dynamic programming](https://www.ams.org/bull/1954-60-06/S0002-9904-1954-09848-8/S0002-9904-1954-09848-8.pdf) 第 2 至 4 节（principle of optimality 与 functional equation；OCR 有乱码，正文只转述了 principle）；[Vazirani 的 Berkeley 讲义 dp.pdf](https://people.eecs.berkeley.edu/~vazirani/sp04/notes/dp.pdf) 第 1 节（edit distance 是 DAG 上的 shortest path）；[Koenig 与 Likhachev 的 D* Lite 论文](https://cse-robotics.engr.tamu.edu/dshell/cs625/aaai02b.pdf)（$g$、rhs、local consistency、由 LPA* 反向得到；公式是抓取工具重建的）；[Boyan 与 Littman 的 Q-routing 论文](https://papers.neurips.cc/paper_files/paper/1993/file/4ea06fbc83cdd0a06020c35d50e1e89a-Paper.pdf)（定义、update、与 Bellman–Ford 和 Q-learning 的关系）；[Eppstein 的 ICS 163 讲义](https://www.ics.uci.edu/~eppstein/163/lecture3c.pdf)（A* 等于 Dijkstra 加 reweighting，Johnson's algorithm）；[Mahajan 的讲义](https://adityam.github.io/stochastic-control/mdps/linear-programming.html)（MDP 的 LP、dual 与 occupancy measure；那里用 cost，这里换成 reward）；[arXiv 2507.07263](https://arxiv.org/html/2507.07263v1) 的引言与第 III-C 节（overestimate 与 underestimate 的 bound、rising value problem）；[Edinburgh RL 第 7 讲](https://www.inf.ed.ac.uk/teaching/courses/rl/slides/rllect7.pdf)（in-place 与两个 array、asynchronous DP）；[Underactuated 的 dynamic programming 一章](https://underactuated.csail.mit.edu/dp.html)（graph 与 mesh 上的 value iteration、interpolation、HJB）；[Ye 的 Simons 演讲摘要](https://simons.berkeley.edu/talks/simplex-policy-iteration-methods-are-strongly-polynomial-markov-decision-problem-fixed)（只有摘要）。

凭自己的知识写、没有核对来源的：simple path 的 counterexample 与 Held–Karp，monotone 与“从上面、从下面逼近”的组织方式，HJB 和 scalar Riccati 的推导，“target network 对应两个 array”“D* Lite 是按优先级的 asynchronous value iteration”“policy iteration 一次 pivot 多个 variable”三个读法。本页的数字都是用 Python 和 Node 算的；引自课程页的数（MA3238 的 $h^{(n)}_1$、CS285 的 5.77、MODERN-RL 的 1.0635）重新核对过或直接引用。
:::
