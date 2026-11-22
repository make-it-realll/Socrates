---
title: 看到证据之后
lead: "Breathalyzer、pedigree 里的 carrier、一个 significant 的 p-value、histogram／Kalman／particle filter、occupancy grid、GARCH 和 POMDP 的 belief 做的都是同一步：prior 乘 likelihood 再除以总和，差别只在 hidden 的东西是什么、它会不会动、belief 怎么存。"
line: prob
---

一条 corridor 分成 10 格，首尾相接，第 0、1、8 格的墙上有 door，这是 [CS4278 第 1 站](../courses/CS4278.html#bayes)的设定。Robot 不知道自己在哪。它的 sensor 朝着墙，每次报 door 或 wall，报对的 probability 是 0.75。每一步它下令往前走一格，实际走 0、1、2 格的 probability 是 0.1、0.8、0.1。

**第一个问题。** 第一次读数是 door。Robot 在某个 door 前的 probability 是多少？顺口的回答是 0.75，正确答案是 0.5625。

**第二个问题。** 之后 8 步的读数依次是 door、wall、wall、wall、wall、wall、wall、door。现在它在第 8 格的 probability 是多少？答案是 0.5631。直接算要列出所有可能的 path $x_0,x_1,\dots,x_8$：$x_0$ 有 10 种，之后每一步 3 种，一共 $10\times3^8=65{,}610$ 条，每条的 probability 是 18 个 factor 的乘积，再把终点在第 8 格的加起来。走 100 步就是 $10\times3^{100}\approx5.2\times10^{48}$ 条。Robot 每一步都要回答这个问题，需要一个每步工作量固定的 recursion。

::fig[thread-bayes-update-trellis] 上面是 corridor 和 robot，下面每一行是时刻 $t$ 的 belief：柱子越高，robot 在那一格的 probability 越大，深色的是这一行最大的，右边是它的值和这一次的读数 $z_t$。相邻两行之间的细线是一步之内可能的 move（原地、走 1 格、走 2 格），一条 path 就是顺着细线从第一行走到最后一行。动起来时一行一行地算：每一行只用到上一行和这一次的读数。

第一个问题里的错在别的课里换了样子出现。[ST2131 第 2 站](../courses/ST2131.html#bayes)的 breathalyzer 对 drunk 的人 98% 报 positive，被拦下的 driver 里 2% drunk，positive 的人 drunk 的 probability 只有 28.6%。[PL1101E 第 1 站](../courses/PL1101E.html#method)用 $p<0.05$ 判 significant，后面会算出，每组 21 人时一个 significant 的结果为真的 probability 可以只有 55%。三处都把 $P(\text{evidence}\mid\text{hypothesis})$ 当成了 $P(\text{hypothesis}\mid\text{evidence})$。

下面先把共同的骨架推一遍：一次 update、odds 的写法、多份 evidence、hidden state 会动时的 recursion、belief 的三种存法。然后用一张表对齐各课的名字和记号，再逐门课看它往骨架上加了什么；课程页之间没有说破的对应，用同一个小例子在两边各算一遍。

## 骨架

### 一次 update：prior 乘 likelihood

Hypothesis $H_1,\dots,H_n$ 两两 disjoint，合起来是整个 sample space。看到 evidence $E$ 之后要求 $P(H_j\mid E)$。由 conditional probability 的定义，

$$P(H_j\mid E)=\frac{P(H_j\cap E)}{P(E)}$$

Numerator 用 multiplication rule 写成 $P(H_j)\,P(E\mid H_j)$。$E$ 发生时恰好和某一个 $H_i$ 同时发生，这 $n$ 种情形 disjoint，由 additivity，$P(E)=\sum_iP(H_i)\,P(E\mid H_i)$（total probability theorem）。合起来：

$$P(H_j\mid E)=\frac{P(H_j)\,P(E\mid H_j)}{\sum_iP(H_i)\,P(E\mid H_i)},\qquad\text{posterior}\ \propto\ \text{prior}\times\text{likelihood}$$

$\propto$ 的意思是：对每个 $j$ 算出 prior 乘 likelihood，再除以它们的总和。总和对所有 $j$ 都一样，它只负责让 posterior 加起来等于 1。

在 corridor 上用一次。Hypothesis 是“robot 在第 $i$ 格”，prior 每格 0.1；evidence 是“读到 door”，likelihood 在 door 格是 0.75，在 wall 格是 0.25。

| | prior | likelihood | product | posterior |
|---|---|---|---|---|
| 每个 door 格（3 格） | 0.1 | 0.75 | 0.075 | 0.1875 |
| 每个 wall 格（7 格） | 0.1 | 0.25 | 0.025 | 0.0625 |
| 合计 | 1 | | $3\times0.075+7\times0.025=0.4$ | 1 |

在某个 door 前的 probability 是 $3\times0.1875=0.5625$。0.75 在 likelihood 那一列，0.5625 在 posterior 那一列，中间隔着 prior：10 格里只有 3 格是 door。

::fig[thread-bayes-update-square] 整个方块是 robot 的全部可能。宽度按 prior 分成 door 格（0.3）和 wall 格（0.7），每一栏再按 likelihood 切出“会读到 door”的那部分。读到 door 之后只剩两块深色的，posterior 是它们各自占的比例。

### Odds：evidence 有多强，只看 likelihood ratio

只有 $H$ 和 $H^c$ 两个 hypothesis 时，把两个 posterior 相除，denominator 消掉：

$$\underbrace{\frac{P(H\mid E)}{P(H^c\mid E)}}_{\text{posterior odds}}=\underbrace{\frac{P(H)}{P(H^c)}}_{\text{prior odds}}\times\underbrace{\frac{P(E\mid H)}{P(E\mid H^c)}}_{\text{likelihood ratio}}$$

Prior 和 evidence 在这里分开了。Evidence 的全部作用是一个数，likelihood ratio（LR），它把 odds 乘上这个倍数。Odds $o$ 换回 probability 是 $o/(1+o)$。

| | prior | prior odds | LR | posterior odds | posterior |
|---|---|---|---|---|---|
| CS4278 的 door sensor | 0.3 | 0.4286 | $0.75/0.25=3$ | 1.2857 | 0.5625 |
| RB3302 的 door sensor | 0.3 | 0.4286 | $0.8/0.1=8$ | 3.4286 | 0.7742 |
| ST2131 的 breathalyzer | 0.02 | 0.0204 | $0.98/0.05=19.6$ | 0.4000 | 0.2857 |

[RB3302 第 5 站](../courses/RB3302.html#loc)第一次读到 door 之后每个 door 格是 0.258，三格加起来正是 0.774。

取 log，乘法变成加法。记 $\ell(p)=\ln\dfrac p{1-p}$（log-odds）：

$$\ell\big(P(H\mid E)\big)=\ell\big(P(H)\big)+\ln\text{LR}$$

$\ell$ 取遍整条 real line，$\ell=0$ 对应 $p=\tfrac12$，换回来是 $p=1/(1+e^{-\ell})$。每一份 evidence 是这条 line 上一段固定长度的 step，prior 是出发点：door sensor 的 step 是 $\ln3=1.099$，breathalyzer 的 positive 是 $\ln19.6=2.976$。

:::wrong LR 大的 test 更可靠，所以它给出的 posterior 一定更高
Breathalyzer 的 LR 是 19.6，door sensor 只有 3，可 positive 之后 breathalyzer 的 posterior 是 0.286，door sensor 是 0.5625。在 log-odds 上看，breathalyzer 从 $\ell(0.02)=-3.892$ 出发，走 2.976，停在 $-0.916$；door sensor 从 $\ell(0.3)=-0.847$ 出发，走 1.099，停在 0.251。Step 的长短由 evidence 决定，停在哪里还取决于从哪里出发。
:::

### 很多份 evidence：什么时候可以一份一份地乘

两份 evidence $E_1,E_2$。对 $E_1\cap E_2$ 用一次 Bayes rule，再用 multiplication rule 把 likelihood 拆开：

$$P(H\mid E_1,E_2)\ \propto\ P(H)\,P(E_1,E_2\mid H)=P(H)\,P(E_1\mid H)\,P(E_2\mid H,E_1)$$

如果 given $H$，$E_2$ 和 $E_1$ independent（conditionally independent），最后一个 factor 就是 $P(E_2\mid H)$：

$$P(H\mid E_1,E_2)\ \propto\ \underbrace{P(H)\,P(E_1\mid H)}_{\propto\,P(H\mid E_1)}\,P(E_2\mid H)$$

前两个 factor 正比于看完 $E_1$ 之后的 posterior。所以先用 $E_1$ update，拿 posterior 当新的 prior，再用 $E_2$ update，和一次用两份 evidence update 结果相同，次序也无所谓。在 log-odds 上，就是把每一份的 $\ln\text{LR}$ 加起来。

条件是 conditional independence。ST2131 第 2 站末尾的两枚 coin（head 的 probability 0.9 和 0.1，随机取一枚）：两次 toss 本身不 independent，$P(H_2\mid H_1)=0.82\ne0.5$；given 取到的是哪一枚，它们 independent。可以一份一份乘的是后一种。

:::wrong 多读几次 sensor，把 likelihood 连乘起来，belief 就越来越准
连乘的前提是 given hypothesis，各次读数 conditionally independent。[CS4278 第 1 站](../courses/CS4278.html#bayes)的 edge：一个人挡在 door 前，sensor 连续 5 次读到 wall。这 5 次是同一个原因造成的，filter 却把 door 格相对 wall 格乘了 $(1/3)^5=1/243$，在 log-odds 上走了 5 步 $-1.099$，evidence 实际只值一步。[STANFORD-CS237B 第 7 站](../courses/STANFORD-CS237B.html#shared)的 intent inference 是同一件事：人前 1 秒的抖动连续偏负，6 步的 likelihood 连乘给出 $P(\text{left})=0.0001$，其实只是同一个犹豫被数了 6 遍。同一份 evidence 被数 $n$ 遍，log-odds 的那一段就被放大 $n$ 倍。
:::

### Hidden state 会动：predict 与 update

Corridor 的 robot 每一步都在动，要的是 $\mathrm{bel}(x_t)=P(x_t\mid z_{0:t})$（command 已知，下面不写）。两条 Markov assumption：

- Motion：given $x_{t-1}$，$x_t$ 和更早的 state、此前所有读数 independent，distribution 是 $p(x_t\mid x_{t-1})$。
- Measurement：given $x_t$，$z_t$ 和其他一切 independent，distribution 是 $p(z_t\mid x_t)$。

**Update。** 把 $z_t$ 当作新的 evidence，把 $\overline{\mathrm{bel}}(x_t)=P(x_t\mid z_{0:t-1})$ 当作 prior。Given $x_t$，$z_t$ 和 $z_{0:t-1}$ conditionally independent（measurement assumption），由上一小节，

$$\mathrm{bel}(x_t)\ \propto\ p(z_t\mid x_t)\,\overline{\mathrm{bel}}(x_t)$$

**Predict。** 对上一刻的 state 用 total probability theorem，再用 motion assumption 去掉条件里的 $z_{0:t-1}$：

$$\overline{\mathrm{bel}}(x_t)=\sum_{x_{t-1}}P(x_t\mid x_{t-1},z_{0:t-1})\,P(x_{t-1}\mid z_{0:t-1})=\sum_{x_{t-1}}p(x_t\mid x_{t-1})\,\mathrm{bel}(x_{t-1})$$

两式交替，就是 Bayes filter。

它为什么不用列 path？把 $t=2$ 时 brute force 的式子写出来，对所有 path 求和：

$$P(x_2,z_{0:2})=\sum_{x_1}\sum_{x_0}P(x_0)\,p(z_0\mid x_0)\,p(x_1\mid x_0)\,p(z_1\mid x_1)\,p(x_2\mid x_1)\,p(z_2\mid x_2)$$

只有前三个 factor 含 $x_0$，先对 $x_0$ 求和：$\sum_{x_0}P(x_0)\,p(z_0\mid x_0)\,p(x_1\mid x_0)$ 是 $x_1$ 的 function，正比于 $\overline{\mathrm{bel}}(x_1)$，这是第一次 predict；乘上 $p(z_1\mid x_1)$ 是 update；再对 $x_1$ 求和是下一次 predict。Bayes filter 就是把这个 nested sum 从里往外做，每次只消掉一个 variable，也就是 [CS3263 第 5 站](../courses/CS3263.html#ve)的 variable elimination。Corridor 上每一步的 predict 对每格加 3 项，update 乘 10 次，与 $t$ 无关。8 步做完，第 8 格是 0.5631；把 65,610 条 path 逐条算出来再加，得到同一个数。

Predict 和 update 对 belief 的作用相反。Predict 里每个 $\overline{\mathrm{bel}}(x_t)$ 是若干个 $\mathrm{bel}(x_{t-1})$ 的 weighted average，不会超过其中最大的那个，所以 belief 只会变平：corridor 第一次读数后最高是 0.1875，predict 之后降到 0.175。一直 predict 而不 update，belief 走向 motion model 的 stationary distribution，原来知道的全部忘掉（[CS3263 第 6 站](../courses/CS3263.html#hmm)的天气，几天之后只剩“八成下雨”）。Update 乘 likelihood，让 belief 变尖。后面 DSE4211 和 EE4706 两节会看到，predict 的这种遗忘正是那两门课各自用别的办法补上的东西。

### Belief 存成什么

Recursion 有了，可 $\mathrm{bel}$ 是整个 distribution。怎么存它，决定了能不能算。后面每门课用的都是下面三种之一。

**存每一个 state 的 probability。** Corridor、Tiger、HMM 都这样做。结果是准确的，代价是 state 的个数：CS4278 估算 50 m × 50 m 的楼、10 cm 一格、heading 1° 一格，要 $9\times10^7$ 个 cell。

**限定在一个 family 里，只存 parameter。** 如果 prior 在某个 family 里，乘上 likelihood 之后 posterior 还在这个 family 里，update 就只是改几个 parameter。判断的办法是看 kernel，也就是把 posterior 当作 hypothesis 的 function、扔掉不含它的 constant 之后剩下的部分。

- Coin 的 head probability $\theta$，prior 是 Beta$(a,b)$，kernel $\theta^{a-1}(1-\theta)^{b-1}$。$n$ 次里 $k$ 次 head 的 likelihood kernel 是 $\theta^k(1-\theta)^{n-k}$。乘起来是 $\theta^{a+k-1}(1-\theta)^{b+n-k-1}$，即 Beta$(a+k,\,b+n-k)$（[ST2131 第 5 站](../courses/ST2131.html#hier)）。
- Position $x$，prior 是 $N(\bar\mu,\bar P)$，measurement $z=x+v$，$v\sim N(0,R)$。两个 kernel 相乘，exponent 是 $x$ 的 quadratic，仍是 Gaussian（[CS4278 第 2 站](../courses/CS4278.html#kf)）。Predict 加上一个 independent 的 Gaussian noise，结果也还是 Gaussian。所以 linear-Gaussian 的 Bayes filter 只需要跟踪 mean 和 variance，这就是 Kalman filter。

**用 sample 代表 belief。** 从 $\overline{\mathrm{bel}}$ 抽 sample 很容易：让上一步的每个 particle 按 motion model 随机走一步。要的却是 $\mathrm{bel}\propto p(z_t\mid x_t)\,\overline{\mathrm{bel}}$。Importance sampling 给每个 sample 一个 weight $w=\mathrm{bel}/\overline{\mathrm{bel}}$，$\overline{\mathrm{bel}}$ 消掉，只剩 likelihood $p(z_t\mid x_t)$（[CS4278 第 3 站](../courses/CS4278.html#pf)）。Update 仍是“乘 likelihood”，只是乘在 sample 上。

## 各门课里的名字和记号

| 课与站 | 这门课叫它什么 | hidden 的东西 | 记号 | 往骨架上加了什么 |
|---|---|---|---|---|
| [ST2131 第 2 站](../courses/ST2131.html#bayes)、[第 5 站](../courses/ST2131.html#hier) | Bayes' rule、hierarchical model | event $A_j$；parameter $X$ | $P(A_j\mid B)$；$f_{X\mid K}(x\mid k)$ | 三个以上 hypothesis 的表；continuous parameter；prediction |
| [MIH1101 第 3 站](../courses/MIH1101.html#confound) | crude rate、standardization | age group | $\sum_kw_kr_k$ | 只用到 denominator 那一步 |
| [LSM2105 第 3 站](../courses/LSM2105.html#mendel)、[LSM2107 第 2 站](../courses/LSM2107.html#hw) | pedigree、carrier probability | genotype | $P(\text{II-2 是 }Aa)=\tfrac23$ | likelihood 只取 0 和 1；prior 来自 Hardy–Weinberg |
| [ST2132 第 7 站](../courses/ST2132.html#test)、[PL1101E 第 1 站](../courses/PL1101E.html#method) | p-value、power、$P(H_0\mid\text{data})$ | effect 是否存在 | $\pi=P(H_0)$、$\alpha$、power | evidence 是一次 test 的结论 |
| [CS3264 第 7 站](../courses/CS3264.html#prob)、[CS3236 第 7 站](../courses/CS3236.html#codes) | MAP、Bayesian prediction、ML decoding | parameter $\theta$；codeword $x$ | $p(\theta\mid S)$；$P(x\mid y)\propto p(y\mid x)$ | 拿 posterior 做 decision |
| [CS3263 第 5 站](../courses/CS3263.html#ve)、[第 6 站](../courses/CS3263.html#hmm) | forward algorithm、time elapse、observation update、likelihood weighting | $W_t$ | $B(W_t)$、$B'(W_t)$ | Bayesian network 的结构；sampling |
| [CS4278 第 1–3 站](../courses/CS4278.html#bayes)、[RB3302 第 5 站](../courses/RB3302.html#loc) | Bayes filter、histogram / Kalman / particle filter、Markov localization | pose $x_t$ | $\mathrm{bel}$、$\overline{\mathrm{bel}}$、$\eta$、$K$、$\bar P$、$Q$、$R$ | 三种存法；EKF；resampling |
| [EE4706 第 3 站](../courses/EE4706.html#nav)、[CS4278 第 4 站](../courses/CS4278.html#slam) | occupancy grid、binary Bayes filter、inverse sensor model | cell 是否 occupied | $l_t$ 或 $\ell_t$、$l_0$ | log-odds；clamping |
| [CS4246 第 3 站](../courses/CS4246.html#pomdp)、[CS4278 第 6 站](../courses/CS4278.html#pomdp) | belief state、belief MDP、DESPOT | state $s$ | $b(s)$、$O(o\mid s',a)$ | action 决定能看到什么 |
| [STANFORD-CS237B 第 5 站](../courses/STANFORD-CS237B.html#pref)、[第 7 站](../courses/STANFORD-CS237B.html#shared) | Bayesian update、intent inference | reward weight $w$；goal $g$ | $p(w\mid\text{answers})$；$P(g\mid o,a)$ | evidence 来自人的回答和动作 |
| [DSE4211 第 2 站](../courses/DSE4211.html#garch) | EWMA、GARCH(1,1) | 今天的 variance | $\tilde\sigma_t^2$、$\sigma_t^2$、$\lambda$ | 课程页没有写成 filter，下面补上 |
| [MA3270 第 4 站](../courses/MA3270.html#sample) | MCMC、Metropolis | parameter | $\tilde p$、$Z$ | normalizer 算不出来 |

:::note 同一个字母，不同的东西
- $K$：CS4278、RB3302 的 Kalman gain；ST2131 第 5 站 Bayes' billiards 里红球左边的白球数；CS4278 第 6 站 DESPOT 的 scenario 个数。
- $R$：CS4278 的 measurement noise variance；Ioannidis 的 $R$ 是 true 与 null 的 hypothesis 之比，就是 prior odds；CS4246 的 $R(s,a)$ 是 reward。
- $b$、$B$：CS4246 的 belief 写 $b$，CS3263 写 $B$；ST2131 的 Beta parameter 是 $b$，ST2131 第 2 站的 evidence 是 event $B$。
- $\alpha$：ST2132 和 PL1101E 的 significance level；DSE4211 GARCH 的 coefficient；CS4246 的 $\alpha$-vector。
- $\pi$：ST2132 的 $P(H_0)$；CS4246 的 policy。本页 significance 一节把“effect 存在”的 prior 记作 $\rho$，等于 ST2132 的 $1-\pi$。
- $\eta$：CS4278、RB3302 的 normalizer，就是骨架里那个“除以总和”。
:::

## ST2131：骨架从这里来

[ST2131 第 2 站](../courses/ST2131.html#bayes)给出骨架的第一小节和“prior、likelihood、product”三列的表，[第 5 站](../courses/ST2131.html#hier)把 hypothesis 换成 continuous 的 parameter，并往前多走一步：拿 posterior 去 predict 下一批 data。Beta$(1,1)$ 的 coin 看到 4 次里 3 次 head，posterior 是 Beta$(4,2)$，下一次 toss 是 head 的 probability 是 posterior 的 mean $\tfrac46$。Prediction 的 variance 由 law of total variance 分成两块：given parameter 时 toss 本身的随机，加上 parameter 本身还不确定的部分。这两块在 CS4278 里也有：下一次 measurement $z=x+v$ 的 predictive variance 是 $R+\bar P$，$R$ 是 given $x$ 时的 noise，$\bar P$ 是 $x$ 本身的不确定；Kalman gain $K=\bar P/(\bar P+R)$ 正是第二块占的份额。

[MIH1101 第 3 站](../courses/MIH1101.html#confound)的 crude rate $\sum_kw_kr_k$ 只用到骨架里的 denominator：age group 是 hypothesis，$w_k$ 是 prior，age-specific rate $r_k$ 是 likelihood，crude rate 就是 $P(E)$。那一站说的“weight 变了，比较就变了”，正是 breathalyzer 里 positive 的比例随 prior 变的原因。

## LSM2105 与 LSM2107：每个孩子都是一次 measurement

### Likelihood 是 0 和 1 的 update

[LSM2105 第 3 站](../courses/LSM2105.html#mendel)的 pedigree：父母都正常，生了一个 affected 的女儿，问 unaffected 的儿子 II-2 是 carrier 的 probability。排成 ST2131 的表：

| II-2 的 genotype | prior | likelihood（unaffected） | product |
|---|---|---|---|
| $AA$ | $\tfrac14$ | 1 | $\tfrac14$ |
| $Aa$ | $\tfrac12$ | 1 | $\tfrac12$ |
| $aa$ | $\tfrac14$ | 0 | 0 |

$P(Aa\mid\text{unaffected})=\dfrac{1/2}{3/4}=\dfrac23$。Likelihood 只取 0 和 1 时，update 就是 ST2131 第 2 站最早的那个动作：把 sample space 缩小到还可能的部分，按原来的比例放大。那个 affected 的女儿也是一份 evidence：她是 $aa$，“父母不都是 $Aa$”的 likelihood 为 0，所以父母必然都是 carrier。

[LSM2107 第 2 站](../courses/LSM2107.html#hw)的 John 和 Jill 多了一层：Jill 的 prior 来自 Hardy–Weinberg。患者占 1%，$q=0.1$，genotype 的 prior 是 $AA$ 0.81、$Aa$ 0.18、$aa$ 0.01；Jill 健康，排除 $aa$，$P(\text{Jill 是 carrier})=0.18/0.99=\tfrac2{11}$。John 的哥哥是患者，John 健康，和 II-2 一样是 $\tfrac23$。两人都是 carrier 的 probability 是 $\tfrac23\times\tfrac2{11}=\tfrac4{33}=0.1212$，孩子得病的 probability 是它的 $\tfrac14$，即 $\tfrac1{33}=0.0303$。

### 已经有健康的孩子之后

课程页停在第一个孩子。假如他们已经有一个健康的孩子，第二个孩子的 risk 还是 0.0303 吗？

孩子的 phenotype 是关于父母 genotype 的 evidence。对孩子有影响的只有两个 hypothesis：“两人都是 carrier”（prior $\tfrac4{33}$）和“不都是”（$\tfrac{29}{33}$）。前者之下每个孩子健康的 likelihood 是 $\tfrac34$，后者之下是 1；given 父母的 genotype，各个孩子 conditionally independent。用 odds 写，prior odds 是 $\tfrac4{29}$，每个健康的孩子乘一次 LR $=\tfrac34$：

$$\text{odds}(\text{都是 carrier}\mid k\text{ 个健康的孩子})=\frac4{29}\Big(\frac34\Big)^k$$

$k=1$ 时 odds 是 $\tfrac3{29}$，probability $\tfrac3{32}=0.0938$。下一个孩子得病，要两人都是 carrier 而且孩子是 $aa$，按 total probability theorem 是 $P(\text{都是 carrier}\mid\text{data})\times\tfrac14+P(\text{不都是}\mid\text{data})\times0=\tfrac3{128}=0.0234$。

| 已有的健康孩子 $k$ | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| $P(\text{两人都是 carrier})$ | 0.1212 | 0.0938 | 0.0720 | 0.0550 | 0.0418 |
| 下一个孩子得病 | 0.0303 | 0.0234 | 0.0180 | 0.0137 | 0.0105 |

::fig[thread-bayes-update-pedigree] LSM2107 的 pedigree，John 和 Jill 下面一个一个添上健康的孩子。右边的表是此时两人都是 carrier 的 probability 和下一个孩子的 risk，有底色的是当前那一行。

这就是 [ST2131 第 5 站](../courses/ST2131.html#hier)的结构：父母的 genotype 是那枚不知道偏多少的 coin，孩子是 toss，下一个孩子的 risk 是 posterior predictive。Genetic counseling 里的 Bayesian 计算也是这样排的：prior 乘 conditional（这里是“孩子都健康”的 probability）得到 joint，再除以各个 joint 之和得到 posterior。

:::wrong 每个孩子 independent 地以 $\tfrac1{33}$ 的 probability 得病，前面的孩子怎样不影响下一个
Given 父母的 genotype，孩子之间 independent；不 given，它们通过父母的 genotype 连在一起，和 ST2131 的两枚 coin 一样。两个孩子都得病的 probability 是 $\tfrac4{33}\times\tfrac1{16}=0.00758$，而 $(\tfrac1{33})^2=0.00092$。已知第一个孩子得病，“都是 carrier”的 posterior 变成 1，第二个孩子的 risk 是 $\tfrac14$，是原来 0.0303 的 8.25 倍。健康的孩子是弱的 evidence（LR 只有 $\tfrac34$），一个 affected 的孩子是决定性的（“不都是”那一边的 likelihood 是 0）。
:::

## ST2132 与 PL1101E：一个 significant 的结果是一次 positive 的 test

[ST2132 第 7 站](../courses/ST2132.html#test)的 `:::wrong` 说 p-value 是 $P(\text{data}\mid H_0)$，$H_0$ 为真的 probability 是 $P(H_0\mid\text{data})$，后者要 Bayes' rule 和一个 prior。那一站用 kiss data 算：$P(X=80\mid H_0)=0.00037$，$P(X=80\mid H_1)=\tfrac1{125}=0.008$，LR 约 21.5；prior $P(H_0)=0.5$ 时 posterior 是 0.044。[PL1101E 第 1 站](../courses/PL1101E.html#method)讲的是另一面：每组 21 人、真实 effect $d=0.2$ 时，study 很少 significant，significant 的那些又高估了 effect。两站之间差一座桥：PL1101E 的 power 正好是 ST2131 breathalyzer 里的 $P(+\mid D)$。

把一个被检验的 hypothesis 看成一个被拦下的 driver。“Effect 真的存在”是 drunk，“结果在 hypothesis 所说的方向上 significant”是 positive。Two-sided、$\alpha=0.05$ 的 test 在 $H_0$ 之下落在那一侧的 probability 是 0.025，这是 false positive rate；effect 存在时落在那一侧的 probability 是 power。于是

$$\text{LR}=\frac{P(\text{significant}\mid\text{effect 存在})}{P(\text{significant}\mid\text{effect 不存在})}=\frac{\text{power}}{0.025}$$

PL1101E 的设定，按 noncentral $t$ distribution 算（df 为 40，threshold $t>2.021$，noncentrality $0.2\sqrt{21/2}=0.648$）：power 是 0.0922（PL1101E 的 simulation 得到 9.8% significant，其中约 5% 方向是反的，只算方向对的就是这个数），LR 是 3.69，和 corridor 的 door sensor（LR 3）差不多。每组 100 人时 power 0.290，LR 11.6。按 power 0.8 设计的 study，LR 是 32。

还缺 prior：一个领域里被拿去检验的 hypothesis，有多大比例是真的，记作 $\rho$。

| $\rho$ | 0.1 | 0.25 | 0.5 |
|---|---|---|---|
| 每组 21 人（LR 3.69） | 0.291 | 0.551 | 0.787 |
| 每组 100 人（LR 11.6） | 0.563 | 0.795 | 0.921 |
| power 0.8（LR 32） | 0.780 | 0.914 | 0.970 |

表里是 significant 之后 effect 真的存在的 probability。$\rho=0.25$、每组 21 人时是 0.551，接近一半。

::fig[thread-bayes-update-studies] 每个点是一个被检验的 hypothesis，400 个里 100 个是真的（实心）。圈起来的是在 hypothesis 所说的方向上 significant 的，个数取 expected count 四舍五入。左右两边 false positive 一样多，差别全在 power。

Ioannidis 2005 年那篇 “Why most published research findings are false” 的 formula $\text{PPV}=\dfrac{(1-\beta)R}{R-\beta R+\alpha}$ 就是这一步：$R$ 是 prior odds，$1-\beta$ 是 power。Denominator 是 $(1-\beta)R+\alpha$，所以 $1-\text{PPV}=\dfrac{\alpha}{(1-\beta)R+\alpha}$，两者相除，$\dfrac{\text{PPV}}{1-\text{PPV}}=R\times\dfrac{1-\beta}{\alpha}$，即 prior odds 乘 LR。他用的 $\alpha$ 是 0.05，没有区分方向，LR 比这里小一半。他的第一条 corollary 说 study 越小，结论越不可能为真，对应的就是 LR 随 power 下降。

:::wrong $p<0.05$，所以这个 effect 是假的 probability 不到 5%
5% 是 $P(\text{significant}\mid H_0)$ 的上限，问的是 $P(H_0\mid\text{significant})$。上表 $\rho=0.25$、每组 21 人那一格，effect 是假的 probability 是 $1-0.551=0.449$。这和“98% 准的 breathalyzer 测出 positive，所以 98% 是 drunk”是同一个错，而且 test 更弱：breathalyzer 的 LR 是 19.6，这里是 3.69。
:::

## CS3264 与 CS3236：拿 posterior 做 decision

Posterior 有了，还要从中拿出一个答案。

[CS3236 第 7 站](../courses/CS3236.html#codes)在 BSC 上 decode：要 error probability 最小，就选 posterior $P(x\mid y)$ 最大的 codeword（MAP）。Message uniform 时 prior 是 constant，MAP 就是 maximum likelihood，BSC 上又等于 minimum distance。Prior 不 uniform 时，log posterior 是 $\ln P(x)+\ln p(y\mid x)$，出发点不同，结论会变，和 breathalyzer 一样。

[CS3264 第 7 站](../courses/CS3264.html#prob)对比两种用法。MAP 取 posterior 的 mode，uniform prior 下就是 MLE，一直看到 0 时给出 $\hat\theta=0$。Bayesian prediction 对 posterior 平均，得到 $(k+1)/(m+2)$，即 Laplace smoothing，和 ST2131 里 Beta$(1,1)$ 看到 4 次里 3 次 head 之后的 $\tfrac46$ 是同一个式子。同一站的 LDA 是 odds 形式的另一个用法：两个 class 共用 covariance 时 $\ln\text{LR}=w^\top x+b$ 是 $x$ 的 linear function，posterior 的 log-odds 也就是 linear 的，换回 probability 正好是 logistic regression。

## CS4278 与 RB3302：Kalman gain 就是 Beta 的 weight

[CS4278 第 1–3 站](../courses/CS4278.html#bayes)和 [RB3302 第 5 站](../courses/RB3302.html#loc)把骨架的后两小节做成了 robot 上的东西：两条 Markov assumption 各用在哪一步；三种存法各自的代价（Gaussian 只有一个 peak，RB3302 的 `:::wrong` 算出三个 door 的 belief 被它抹成 mean 3.71、standard deviation 2.92 的一团）；EKF 在 tangent 平的地方失效；particle 的 resampling 和 laser model 里的 uniform 成分。两门课的记号不同：CS4278 写 $\bar P$、$Q$、$R$，RB3302 写 $\bar\sigma^2$ 和 $\sigma_z^2$。

### 同一个 update，两种写法

Kalman 的 update 是

$$\mu=\bar\mu+K(z-\bar\mu),\qquad K=\frac{\bar P}{\bar P+R}=\frac{1/R}{1/\bar P+1/R},\qquad\frac1P=\frac1{\bar P}+\frac1R$$

第二个等号是 numerator 和 denominator 同除以 $\bar PR$。$1/\bar P$ 和 $1/R$ 叫 precision：prior 和 measurement 各自带来多少 information，posterior 的 precision 是两者之和，gain 是 measurement 占的份额。

Beta 的 posterior mean 也能写成同样的形状。Prior Beta$(a,b)$ 的 mean 是 $\tfrac a{a+b}$，看到 $n$ 次里 $k$ 次 head 之后是 $\tfrac{a+k}{a+b+n}$。两者相减，化成同一个 denominator：

$$\frac{a+k}{a+b+n}-\frac a{a+b}=\frac{(a+k)(a+b)-a(a+b+n)}{(a+b)(a+b+n)}=\frac{k(a+b)-an}{(a+b)(a+b+n)}=\frac n{a+b+n}\Big(\frac kn-\frac a{a+b}\Big)$$

所以 posterior mean $=$ prior mean $+K\,(\text{data 的比例}-\text{prior mean})$，$K=\dfrac n{a+b+n}$。$a+b$ 是 prior 相当于看过多少次 toss（pseudo-count），$n$ 是这次的 toss 数，posterior 的 pseudo-count 是两者之和。

| | Beta–Binomial | Kalman |
|---|---|---|
| prior 的分量 | $a+b$ | $1/\bar P$ |
| 这次 data 的分量 | $n$ | $1/R$ |
| posterior 的分量 | $a+b+n$ | $1/P=1/\bar P+1/R$ |
| gain | $n/(a+b+n)$ | $(1/R)/(1/\bar P+1/R)$ |
| residual | $k/n-a/(a+b)$ | $z-\bar\mu$ |

两边各算一遍。**ST2131 的 coin。** Beta$(1,1)$，4 次里 3 次 head：$K=\tfrac46$，$\tfrac12+\tfrac23\times(\tfrac34-\tfrac12)=\tfrac23$，是 Beta$(4,2)$ 的 mean。再 toss 4 次只有 1 次 head：$K=\tfrac4{10}=0.4$，$\tfrac23+0.4\times(\tfrac14-\tfrac23)=\tfrac12$，是 Beta$(5,5)$ 的 mean。**CS4278 的 track。** Prior $N(10,0.04)$，读到 $z=11$，$R=0.01$：precision $25+100=125$，$K=\tfrac{100}{125}=0.8$，$\mu=10.8$，$P=\tfrac1{125}=0.008$。

::fig[thread-bayes-update-gain] 左边是 coin 的 posterior，右边是 track 上的 position。下面的长条是 posterior 的 information，按 prior 和这次 data 分成两段，彩色那一段的比例就是 gain，它决定 posterior mean 落在 prior mean 和 data 之间的哪个位置。

Matrix 的版本（多个 state、measurement 只看到其中一部分）是往 normal equations 里加 row，见概念线[最小二乘](least-squares.html)。

### Predict 让 information 漏掉

Beta 那一边，pseudo-count 只增不减，$K=n/(a+b+n)\to0$：parameter 是固定的，看得越多越不需要新 data。Kalman 那一边每一步先 predict，$\bar P=P+Q$，precision 从 $1/P$ 降到 $1/(P+Q)$。CS4278 取 $Q=R=0.01$，gain 停在 0.618，posterior variance 停在 0.00618，precision 是 161.8，只相当于 1.618 次 measurement：每一步新增一次 measurement 的 information，predict 又漏掉同样多。State 在动，旧的 data 说的是过去的 state，理应慢慢作废。

精算的 credibility theory（ST3246，本站还没写）用的也是这个 $K$：一个投保人的保费，按 credibility factor $Z=n/(n+k)$ 加权他自己 $n$ 年的记录和同类人的平均，$k$ 起的作用就是 $a+b$。

:::wrong 同一个 sensor、同样多的 data，gain 应该一样
Gain 是 data 占的份额，取决于 prior 已经有多少 information。ST2131 的两轮都是 4 次 toss，gain 从 $\tfrac23$ 降到 0.4，因为第二轮开始时 prior 已经相当于 6 次。CS4278 的表里同一个 sensor 的 gain 依次是 0.667、0.625、0.619、0.618，到 steady state 才不再变，那时 prior 的 precision 不再增长。
:::

## CS3263：particle filter 是带 resampling 的 likelihood weighting

[CS3263 第 6 站](../courses/CS3263.html#hmm)的 forward algorithm 就是 Bayes filter，换了名字：time elapse $B'(W_{t+1})=\sum_wP(W_{t+1}\mid w)\,B(w)$ 是 predict，observation update $B(W_{t+1})\propto P(f_{t+1}\mid W_{t+1})\,B'(W_{t+1})$ 是 update。CS4278 的 histogram filter 是 state 有 10 个的 HMM。CS3263 还把 HMM 画成一个按时间展开的 Bayesian network：$W_0\to W_1\to W_2\to\cdots$，每个 $W_t$ 下面挂一个 evidence $F_t$。

[CS3263 第 5 站](../courses/CS3263.html#ve)的 likelihood weighting 用在这个展开的 network 上：按 topological order 从 CPT 抽 non-evidence variable，即从 $P(W_t\mid W_{t-1})$ 抽 $W_t$，这正是 particle 的 predict；evidence 固定为观测到的值，weight 是每个 evidence 的 CPT 在 sample 上的值之积，$F_t$ 的 parent 只有 $W_t$，所以

$$w=\prod_{t}P(f_t\mid w_t)$$

这是 particle filter 每一步的 weight $p(z_t\mid x_t)$ 连乘起来。不 resample 的 particle filter，就是展开的 HMM 上的 likelihood weighting。CS188 的 textbook 在 particle filtering 一节只说 observation update 和 likelihood weighting 相似，这里两者逐项相等。

Resampling 加了什么？CS3263 那一站指出，evidence 在 network 下游时 likelihood weighting 浪费：sample 是从 prior 抽的，没理会 evidence，weight 集中在少数几个 sample 上。HMM 里每一个 $F_t$ 都在之前所有 $W$ 的下游，weight 每一步再乘一个 likelihood，差距按 $t$ exponential 地拉开。在 corridor 上用 100 个 particle 实际跑（robot 一直每步走一格，读数都对；每种设定重复 3000 次），effective sample size $(\sum w)^2/\sum w^2$ 和 $P(x_t=\text{真实位置})$ 的估计值的 standard deviation 是：

| $t$ | exact | likelihood weighting 的 ESS | likelihood weighting 的 std | 每步 resample 的 std |
|---|---|---|---|---|
| 8 | 0.5631 | 15.6 | 0.126 | 0.068 |
| 20 | 0.6892 | 3.9 | 0.277 | 0.053 |
| 40 | 0.6909 | 2.4 | 0.377 | 0.051 |

$t=40$ 时 100 个 sample 的 weight 只相当于 2.4 个。每一步 resample，把带 weight 的 sample 换成不带 weight 的，之后的 sample 从 posterior 出发，不再从 prior 出发；error 不随 $t$ 增长。

## EE4706、CS4246 与 CS237B：log-odds 上的加法

### Tiger 和 occupancy cell 是同一个 filter

[EE4706 第 3 站](../courses/EE4706.html#nav)和 [CS4278 第 4 站](../courses/CS4278.html#slam)给每个 cell 一个 binary 的 hidden variable（occupied 或 free），用骨架的 odds 形式推出

$$l_t=l_{t-1}+l\big(p(m\mid z_t)\big)-l_0$$

这里 likelihood ratio 是用 inverse sensor model 换出来的：$\dfrac{p(z_t\mid m)}{p(z_t\mid\neg m)}=\dfrac{p(m\mid z_t)}{p(\neg m\mid z_t)}\cdot\dfrac{p(\neg m)}{p(m)}$，取 log 就是后两项。Hit 一次 step 是 $\ln\tfrac{0.7}{0.3}=0.847$，miss 一次是 $\ln\tfrac{0.4}{0.6}=-0.405$。

[CS4246 第 3 站](../courses/CS4246.html#pomdp)的 Tiger 也是一个 binary 的 hidden variable（老虎在左或右），listen 一次听对的 probability 0.85。那一站发现 belief 只取决于“听到左”和“听到右”的次数之差，在 log-odds 上一目了然：每听一次走 $\pm\ln\tfrac{0.85}{0.15}=\pm1.735$。开右门的 threshold $b\ge0.9475$ 换成 log-odds 是 $\ln\tfrac{0.9475}{0.0525}=2.893$，在一步（1.735）和两步（3.469）之间，所以次数之差到 2 才开门，那时 $b=0.9698$。

::fig[thread-bayes-update-logodds] 同一条 log-odds 的 line，上面标着对应的 probability。三行分别是 breathalyzer、Tiger 的 listen 和 occupancy cell 的 hit 与 miss：每一份 evidence 是一段固定长度的 step，prior 是出发点。

### Clamping 是没有写出来的 predict

两边在 update 之后不一样。Tiger 开门之后老虎重新随机放，belief 回到 0.5，这在 filter 里是一次 predict：不管原来在哪，transition 都把 state 送到 uniform。Occupancy grid 假设环境 static，没有 predict。EE4706 算出了后果：person 站了 10 个 scan，$l=8.47$，走开之后要 21 个 miss 才回到 $l<0$；clamping 把 $l$ 截在 $[-2,\,3.5]$ 里，9 个 scan 就够。

把 static 换成一个 Markov chain：每个 scan，cell 以 probability $\varepsilon$ 换一次 state。Predict 是

$$\bar p=(1-\varepsilon)\,p+\varepsilon\,(1-p)=\varepsilon+(1-2\varepsilon)\,p$$

$\varepsilon<\tfrac12$ 时 $1-\bar p=\varepsilon+(1-2\varepsilon)(1-p)\ge\varepsilon$，同理 $\bar p\ge\varepsilon$，所以 predict 之后 $|l|\le\ln\tfrac{1-\varepsilon}{\varepsilon}$，update 之后再多一步。Clamp 自己出来了，而且是软的：$l$ 不大时 predict 几乎不动它（$\varepsilon=0.01$，$p=0.7$ 时 $l$ 从 0.847 变成 0.828）；$l$ 越大，往回拉得越多（$l=4.86$ 时拉回 0.83）。

取 $\varepsilon=0.01$，LiDAR 10 Hz 时意思是平均 10 s 变一次。从 $l=0$ 开始连续 hit，$l$ 依次是 0.85、1.68、2.47、3.21、3.83、4.30……停在 4.88（$p=0.992$）；连续 miss 停在 $-3.90$。Person 站 10 个 scan 后 $l=4.86$，走开之后是 3.62、2.89、2.32、1.82、1.35、0.91……第 9 个 miss 降到 0 以下，和 EE4706 的 clamp 一样快。区别在于这里只有一个有意义的 parameter：世界多久变一次。

::fig[thread-bayes-update-clamp] 同一个 cell 的 $l_t$：前 10 个 scan 有 person 站着，之后 beam 穿过它。三条线是 static（不 clamp）、EE4706 的 clamp $[-2,3.5]$ 和加了 $\varepsilon=0.01$ 的 predict。Predict 和 clamp 都在 scan 19 回到 0，static 要到 scan 31。左边的方块是 cell 本身，颜色深浅跟着 predict 那条线的 probability。

[STANFORD-CS237B 第 5 站](../courses/STANFORD-CS237B.html#pref)把同样的加法用在人身上：每回答一次“A 比 B 好”，reward weight $w$ 的 posterior density 乘上 $\sigma(I_t\,w^\top\psi_t)$，那一站第一个 query 之后 70° 附近和 200° 附近的 density 之比是 35。人的回答在 given $w$ 时可以当作 conditionally independent；同一门课第 7 站连续的 steering 动作不行，前面“连乘”的 `:::wrong` 说的就是它。

## DSE4211：EWMA 和 GARCH 是 steady-state 的 Kalman filter

[DSE4211 第 2 站](../courses/DSE4211.html#garch)要估“今天的 volatility”，它看不见，每天只看到一个 return。这是一个 filtering 问题，只是课程页没有这样写。

把今天的 variance $v_t$ 当作 hidden state，$r_t^2$ 当作 measurement：$E[r_t^2\mid v_t]=v_t$，所以 $r_t^2=v_t+\text{noise}$。

**EWMA。** 设 $v_t$ 是 random walk，$v_{t+1}=v_t+w$，$w$ 的 variance 是 $Q$，measurement noise 的 variance 是 $R$。这就是 CS4278 track 上那个 model，Kalman 的一步写成对明天的 prediction：

$$\hat v_{t+1}=\hat v_t+K\,(r_t^2-\hat v_t)$$

EWMA 是 $\tilde\sigma_{t+1}^2=\tilde\sigma_t^2+(1-\lambda)(r_t^2-\tilde\sigma_t^2)$，一字不差，$K=1-\lambda$。Steady-state 的 $K$ 只取决于 $q=Q/R$。CS4278 推出 $\bar P^2-Q\bar P-QR=0$；记 $p=\bar P/R$，两边除以 $R^2$ 得 $p^2-qp-q=0$；$K=\tfrac p{p+1}$ 即 $p=\tfrac K{1-K}$，代进去乘以 $(1-K)^2$，得 $K^2-qK(1-K)-q(1-K)^2=0$，后两项合并成 $q(1-K)$，所以

$$q=\frac{K^2}{1-K}$$

RiskMetrics 的 $\lambda=0.94$ 即 $K=0.06$，$q=0.0036/0.94=0.00383$：这个 $\lambda$ 等于假设 variance 每天 random walk 一步的 standard deviation 只有 measurement noise 的 6.2%。CS4278 的 $Q=R$ 是 $q=1$，$K=0.618$，相当于 $\lambda=0.382$。DSE4211 说 EWMA 对所有 $h$ 的 forecast 都一样，原因是 random walk 的 predict 不改变 mean。Shephard 的 working paper 把这件事写成 local level model 给 EWMA 提供了依据，并追溯到 Muth 1960 年。

**GARCH。** 让 $v_t$ 有一个回去的水平：$v_{t+1}=c+\phi\,v_t+w$。Update 是 $v_{t\mid t}=\hat v_t+K(r_t^2-\hat v_t)$，predict 是 $\hat v_{t+1}=c+\phi\,v_{t\mid t}$，合起来

$$\hat v_{t+1}=c+\phi\,\hat v_t+\phi K\,(r_t^2-\hat v_t)$$

GARCH(1,1) 是 $\sigma_{t+1}^2=\omega+\alpha r_t^2+\beta\sigma_t^2=\omega+(\alpha+\beta)\,\sigma_t^2+\alpha\,(r_t^2-\sigma_t^2)$。逐项对上：$c=\omega$，$\phi=\alpha+\beta$，$\phi K=\alpha$，即 $K=\alpha/(\alpha+\beta)$。

| | EWMA | GARCH(1,1) | Kalman |
|---|---|---|---|
| hidden variance 的 model | random walk | AR(1)，水平 $\omega/(1-\alpha-\beta)$ | $v_{t+1}=c+\phi v_t+w$ |
| 往回拉的倍数 | 1 | $\alpha+\beta$ | $\phi$ |
| gain | $1-\lambda$ | $\alpha/(\alpha+\beta)$ | $K$ |
| 第 2 站的 parameter | $\lambda=0.94$：$K=0.06$ | $\alpha=0.1,\beta=0.85$：$K=0.1053$，$\phi=0.95$ | |

拿 DSE4211 手算表里 $-15\%$ 那一天核对。$\hat v=1.1425\times10^{-3}$，$r^2=0.0225$。Update：$1.1425\times10^{-3}+0.1053\times(0.0225-0.0011425)=3.3907\times10^{-3}$。Predict：$6.125\times10^{-5}+0.95\times3.3907\times10^{-3}=3.2824\times10^{-3}$，正是表里的次日 $\sigma^2$。表里其余四天也逐行相同。DSE4211 的 long-run variance $\omega/(1-\alpha-\beta)$ 是 AR(1) 的 stationary mean，$h$ 步 forecast $\bar\sigma^2+(\alpha+\beta)^{h-1}(\sigma_{t+1}^2-\bar\sigma^2)$ 是没有 measurement 时连续做 $h-1$ 次 predict。反过来从 $K$ 求 $Q/R$：由 $K=\bar P/(\bar P+R)$ 得 $\bar P=KR/(1-K)$，$P=(1-K)\bar P=KR$，代入 predict 的 $\bar P=\phi^2P+Q$，得 $Q/R=K\big(\tfrac1{1-K}-\phi^2\big)=0.1053\times(1.1176-0.9025)=0.0226$。

这个对应有一个限度。GARCH 里 $\sigma_t^2$ 是过去 return 的 deterministic function，并没有另一个 hidden 的 noise；$r_t^2$ 的 noise $\sigma_t^2(z_t^2-1)$ 也不是 Gaussian，variance 还随 $\sigma_t^2$ 变。所以 GARCH 的 recursion 是在“variance 是一个 AR(1)、透过 $r_t^2$ 被看见”这个读法下最好的 linear filter，形状和 Kalman 一样，不是 exact 的 posterior。

## CS4246 与 CS4278：belief 成了 state

前面的课里 evidence 是被动来的。[CS4246 第 3 站](../courses/CS4246.html#pomdp)让 action 决定能看到什么：listen 花 1，换来一次 $\pm1.735$ 的 step；开门拿 reward，同时把 belief 送回 0.5。Belief update 是带 action 的 Bayes filter，

$$b'(s')\ \propto\ O(o\mid s',a)\sum_sP(s'\mid s,a)\,b(s)$$

$\sum_s$ 是 predict，乘 $O$ 是 update。把 belief 当作 state 就又是一个 MDP，它的 value function 是 convex 的：belief 越靠近 0 或 1，value 越高，information 本身有价值。那一站的 `:::wrong` 算出，把最可能的 state 当真、听到一次就开门，value 是 $-5.05$，继续 listen 是 3.91。

[CS4278 第 6 站](../courses/CS4278.html#pomdp)把这一点用在 path 上：两条去 door 的 route，短的一路只 predict，到 door 时 $\sigma=0.332$ m；长的沿 wall 走，每米 update 一次，到 door 时 $\sigma=0.149$ m，撞上的 probability 小 32 倍。一个 planner 只有把 belief 的宽度算进 cost，才会选长的那条。DESPOT 用 scenario 代表 belief，每个 node 上的 scenario 集合就是那里的 particle。

## MA3270：normalizer 算不出来的时候

骨架里的 denominator $\sum_iP(H_i)P(E\mid H_i)$，在 parameter 是 high-dimensional、continuous 的时候是一个算不出来的 integral $Z$。[MA3270 第 4 站](../courses/MA3270.html#sample)的 Metropolis 只用到 $\tilde p(y)/\tilde p(x)$，$\tilde p=$ prior $\times$ likelihood。这个 ratio 就是 $y$ 对 $x$ 的 posterior odds，$Z$ 消掉的理由和 odds 形式里 denominator 消掉的理由相同。拿 ST2131 的 Beta$(4,2)$ 试：$\theta=0.7$ 对 $\theta=0.5$ 的 ratio 是 $\dfrac{0.7^3\times0.3}{0.5^3\times0.5}=1.646$，不需要知道 constant 是 20。随机模拟（ST3247，本站还没写）整门课讲的就是这一类 sampler。

:::from
用 WebFetch 读的（都是逐段摘要，不是全文）：Ioannidis 2005 年的 [Why most published research findings are false](https://pmc.ncbi.nlm.nih.gov/articles/PMC1182327)，“Modeling the framework for false positive findings”一节（$R$、$\alpha$、$\beta$ 的定义、PPV 的 formula、Corollary 1；Table 1 是图片，没有读到）；Shephard 2013 年的 [Martingale unobserved component models](https://www.nuffield.ox.ac.uk/economics/Papers/2013/ll20130210.pdf) 第 3 节（local level model、signal/noise ratio $q$、Kalman recursion、steady-state gain、“local level model rationalises the EWMA”，公式排版有乱码，是按上下文重建的）；[CS188 textbook 8.4 Particle filtering](https://inst.eecs.berkeley.edu/~cs188/textbook/hmms/particle-filtering.html)（time elapse、按 sensor model 加 weight、与 likelihood weighting 相似的那句）；[Britannica 的 Estimating probability: Bayes's theorem](https://www.britannica.com/science/human-genetic-disease/Estimating-probability-Bayess-theorem)（genetic counseling 里 prior、conditional、joint、posterior 的列表做法；它的例子是 Duchenne muscular dystrophy，没有健康孩子作 evidence 的例子）。

各门课的设定和数字取自本站的课程页：CS4278 的 corridor、track 与 coastal navigation，RB3302 的 corridor，ST2131 的 breathalyzer、两枚 coin 与 Beta 的例子，LSM2105 与 LSM2107 的 pedigree，ST2132 的 kiss data，PL1101E 的 $n=21$、$d=0.2$，CS4246 的 Tiger，EE4706 的 inverse sensor model 与 clamp，CS237B 的两个例子，DSE4211 的参数与手算表，CS3263 的 HMM 与 likelihood weighting。

自己推导、计算的：corridor 上 65,610 条 path 的 brute force（与 filter 核对）；odds 表与 log-odds 的各个数；健康孩子作为 evidence 的 update 与那张表；significance 作为 test 的 LR（用 scipy 的 noncentral $t$ 算 power）与 PPV 表；Beta 与 Kalman 的 gain 对照；likelihood weighting 与 particle filter 的 simulation（numpy，seed 11，每种设定 3000 次）；$\varepsilon$ predict 的 occupancy 计算；EWMA、GARCH 与 Kalman 的逐项对应、$q=K^2/(1-K)$ 的推导、$Q/R=0.0226$。凭自己的知识写、没有找原文核对的：“clamping 是没有写出来的 predict”和“GARCH 是 AR(1) variance 的 linear filter”两个读法，Metropolis 的 ratio 是 posterior odds 这一句，credibility factor $Z=n/(n+k)$ 与 Beta 的 $K$ 的对应。
:::
