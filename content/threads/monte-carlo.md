---
title: 随机模拟
lead: "用随机的 sample 回答一个确定的问题。同一个 sample average 和它的 error bar，从 law of large numbers 一路用到 particle filter、RRT、diffusion sampling 和 Gillespie algorithm。"
line: prob
---

一条 2R arm 装在 origin，两根 link 长 1 和 0.8（各有 0.04 的 half-width），旁边有两个 disk obstacle：A 的 center 在 $(0.9,0.6)$，radius 0.35；B 的 center 在 $(-0.7,-0.9)$，radius 0.4。两个 joint angle 都可以取 $[-180^\circ,180^\circ)$ 里的任何值。问：这个 square 形状的 configuration space 里，有多大比例的 configuration 不碰任何 obstacle？

这个数是确定的，它是 $C_{\text{free}}$ 的 area 除以 $360^\circ\times360^\circ$。它也有用：PRM 和 RRT 每一步都在 C-space 里随机抽一个 configuration（[NW-MODERNROBOTICS 第 7 站](../courses/NW-MODERNROBOTICS.html#plan)），free 的比例越小，浪费在 collision 上的 sample 越多。两个 joint 时可以老老实实地铺 grid：$4000\times4000$ 个 grid point 逐个做 collision check，free 的比例是 0.6597。7 个 joint 的 arm 就不行了：每个 joint 取 100 个值是 $10^{14}$ 个 cell，[CS4278 第 5 站](../courses/CS4278.html#motion)算过，每个 cell 只花 1 μs 也要查 3 年。

另一个办法是随机抽 $n$ 个 configuration，每个做一次 collision check，数 free 的比例。下面的动图抽了 120 个，72 个 free，比例 0.600。这个 0.600 离真值有多远？如果手里没有 grid 给的 0.6597，单凭这 120 个点能不能说出 error 有多大？要多少个点才能准到 0.01？这三个问题的答案，是这条线上每一门课共用的骨架。

::fig[thread-monte-carlo-arm] 动图：每个 sample 让 arm 摆到那一组角度，碰到 obstacle 时 link 描成彩色；右边 C-space 里的灰色区域是 C-obstacle（用 grid 画出来作对照，随机撒点时并不知道它）。第一帧是 120 个都撒完的样子。

## 骨架：一个 average 和它的 error bar

### 把问题写成 expectation

令 $X$ 是 C-space 上 uniform 的 random configuration，$f(q)=\mathbf 1\{q\text{ free}\}$。那么

$$\mathbb E[f(X)]=P(X\text{ free})=\frac{\text{area}(C_{\text{free}})}{\text{area}(C)}=\mu .$$

更一般地，任何能写成 $\int f(x)\,p(x)\,dx$ 的 integral（$p$ 是一个 density）都是 $\mathbb E_p[f(X)]$。下面各门课要算的量，一个 probability、一个 policy 的 value、一个 posterior 下的 mean、一个 process 在某时刻的 distribution，都是这个形式，只是 $p$ 和 $f$ 不同。估计它的办法只有一个：从 $p$ 抽 $n$ 个 independent 的 $X_1,\dots,X_n$，取

$$\hat\mu_n=\frac1n\sum_{i=1}^nf(X_i).$$

### Unbiased，variance 是 $\sigma^2/n$

Expectation 是 linear 的：

$$\mathbb E[\hat\mu_n]=\frac1n\sum_{i=1}^n\mathbb E[f(X_i)]=\frac1n\cdot n\mu=\mu .$$

$X_i$ 互相 independent，$f(X_i)$ 也就互相 independent，sum 的 variance 等于 variance 的 sum；constant $\frac1n$ 提出来要平方：

$$\mathrm{Var}(\hat\mu_n)=\frac1{n^2}\sum_{i=1}^n\mathrm{Var}\big(f(X_i)\big)=\frac1{n^2}\cdot n\sigma^2=\frac{\sigma^2}{n},\qquad\sigma^2=\mathrm{Var}\big(f(X)\big).$$

所以 $\hat\mu_n$ 的 standard deviation 是 $\sigma/\sqrt n$。Arm 的例子里 $f$ 只取 0 和 1，是 Bernoulli$(\mu)$，$\sigma^2=\mu(1-\mu)=0.6597\times0.3403=0.2245$，$\sigma=0.4738$。$n=1000$ 时 $\hat\mu_n$ 的 standard deviation 是 $0.4738/\sqrt{1000}=0.0150$。

### Error 有多大：三种说法

有了 variance，还要把它变成“$\hat\mu_n$ 离 $\mu$ 超过 $\varepsilon$ 的 probability”。

**Chebyshev。** 对 $\hat\mu_n$ 用 [ST2131 第 7 站](../courses/ST2131.html#limit)的 Chebyshev inequality：

$$P\big(|\hat\mu_n-\mu|\ge\varepsilon\big)\le\frac{\sigma^2}{n\varepsilon^2}.$$

右边随 $n\to\infty$ 趋于 0，这就是 weak law of large numbers：只要 $\sigma^2$ 有限，随机撒点一定 converge 到对的答案。$n=1000$、$\varepsilon=0.03$ 时右边是 $0.2245/(1000\times0.0009)=0.249$。

**CLT。** Chebyshev 要对所有 variance 相同的 distribution 都成立，所以松。$\hat\mu_n$ 是 $n$ 个 i.i.d. 的平均，CLT 说它近似 $N(\mu,\sigma^2/n)$，同一个 probability 约为 $2\big(1-\Phi(0.03/0.0150)\big)=0.045$，比 0.249 小五倍多。反过来写，

$$P\Big(|\hat\mu_n-\mu|\le1.96\,\frac{\sigma}{\sqrt n}\Big)\approx0.95 .$$

$\sigma$ 不知道，用 sample 的 standard deviation $s$ 代替（[ST2132 第 6 站](../courses/ST2132.html#ci)的 plug-in，$n$ 大时可以），得到能直接报告的 error bar：

$$\hat\mu_n\pm1.96\,\frac{s}{\sqrt n}.$$

用 numpy 的 `default_rng(0)` 抽 1000 个：639 个 free，$\hat\mu=0.639$，$s=0.4805$，error bar 是 $\pm0.0298$，interval $[0.609,0.669]$ 盖住了 0.6597。抽 $10^4$ 个：$0.6592\pm0.0093$。动图里那 120 个是 $0.600\pm0.088$。整个过程没有用到真值。

::fig[thread-monte-carlo-funnel] 同一个 arm，5 次 independent 地撒点到 $10^4$ 个。每条线都在 $\mu\pm1.96\sigma/\sqrt n$ 的漏斗里晃，晃的幅度按 $1/\sqrt n$ 缩小；$n=10^4$ 时五次的 $\hat\mu$ 是 0.667、0.661、0.656、0.665、0.660。

**Hoeffding。** CLT 是 $n\to\infty$ 时的近似。$f$ 取值在 $[0,1]$ 里时，[CS3264 第 5 站](../courses/CS3264.html#bv)的 Hoeffding inequality 对每个 $n$ 都成立：

$$P\big(|\hat\mu_n-\mu|\ge\varepsilon\big)\le2e^{-2n\varepsilon^2}.$$

令右边 $\le\delta$，解出 $n\ge\ln(2/\delta)/(2\varepsilon^2)$。要 $\varepsilon=0.01$、$\delta=0.05$：$n\ge\ln40/0.0002=18445$。CLT 的估计是 $(1.96/0.01)^2\times0.2245=8624$。Hoeffding 不知道 $\sigma^2$，等于按最坏的 $\tfrac14$ 算，tail 的 bound 又比 normal 的松，所以多要两倍多。

三种说法给出同一个形状：error 和 $\sigma/\sqrt n$ 成正比。精度提高 10 倍，sample 要 100 倍。Gillespie 在 1977 年的论文里对他自己的 simulation 说了同样的话：要把 uncertainty 缩小 $f$ 倍，run 的次数要乘 $f^2$。

### Dimension 不在公式里

$\sigma/\sqrt n$ 里没有 C-space 的 dimension $d$，grid 的 error 里有。拿一个 exact 答案已知的问题比：point robot 在 $[-1,1]^d$ 里，C-obstacle 是 unit ball，落进 obstacle 的比例是 unit ball 的 volume 除以 $2^d$。两种办法都用 $N=4096$ 个点：

| $d$ | grid 每个方向的值数 $m$ | grid 的 error | Monte Carlo 的 $\sigma/\sqrt N$ |
|---|---|---|---|
| 2 | 64 | 0.0027 | 0.0064 |
| 3 | 16 | 0.0077 | 0.0078 |
| 4 | 8 | 0.0119 | 0.0072 |
| 6 | 4 | 0.0286 | 0.0043 |

$d=6$ 时真值是 0.0807，grid 给出 0.1094，差了三分之一。Grid 只在 ball 的边界附近判错，被边界穿过的 cell 约有 $m^{d-1}$ 个，每个占 $1/m^d$ 的 volume，合起来是 $1/m=N^{-1/d}$ 的量级；random sample 的 error 是 $N^{-1/2}$。$d=2$ 时两者同阶，$d$ 一大 grid 就输了。下图是同一件事的另一面。

::fig[thread-monte-carlo-gridproj] 6 维里各 4096 个点，只看前两个 coordinate。Grid 在每个方向上只试了 4 个值，一个夹在两个值之间的窄缝永远看不见；random 的点在每个方向上都有 4096 个不同的值。

:::wrong Monte Carlo 的 error 与 dimension 无关，所以高维问题和低维一样好算
公式里没有 $d$，但 $\sigma$ 和 $\mu$ 本身可以随 $d$ 变。要估计的是一个小 probability 时，有意义的是 relative error：$\dfrac{\sigma/\sqrt n}{\mu}=\sqrt{\dfrac{1-\mu}{n\mu}}$。上表那个 ball 的比例在 $d=10$ 时是 0.00249，4096 个点的 relative error 是 31%；$d=20$ 时是 $2.46\times10^{-8}$，relative error 要做到 10% 需要 $4.1\times10^9$ 个点。[RB3302 第 2 站](../courses/RB3302.html#sample)的 narrow passage 是同一回事：passage 在 $d-1$ 个方向上宽 0.05，volume $0.05^{d-1}$ 随 $d$ 指数地变小。后面 importance sampling 和 particle filter 的麻烦都出在这里。
:::

### Sample 从哪里来：inverse transform

计算机给的是 $[0,1)$ 上 uniform 的 $U$。要从别的 distribution 抽，最基本的办法是：$F$ 是目标的 CDF，令 $X=F^{-1}(U)$。验证只要一行：

$$P(X\le x)=P\big(F^{-1}(U)\le x\big)=P\big(U\le F(x)\big)=F(x).$$

第二个等号是因为 $F$ increasing，inequality 两边同时作用 $F$ 不改变方向。这条线上反复用到两种情形。

**Exponential waiting time。** Rate 为 $R$ 时 $P(\tau>t)=e^{-Rt}$，$F(t)=1-e^{-Rt}$，$F^{-1}(u)=-\ln(1-u)/R$。$1-U$ 也是 uniform，所以直接写 $\tau=-\ln(U)/R$。[LSM2234 第 6 站](../courses/LSM2234.html#noise) Gillespie 的第 1 步：$R=2$，$u_1=0.2468$，$\tau=-\ln0.2468/2=0.700$。

**有限个选项。** Probability 是 $w_1,\dots,w_K$，cumulative 是 $c_j=w_1+\cdots+w_j$，$F^{-1}(u)$ 就是满足 $c_{j-1}<u\le c_j$ 的 $j$：把 $[0,1]$ 按 probability 切成 $K$ 段，$u$ 落在哪段就选哪个。[CS4278 第 3 站](../courses/CS4278.html#pf)的 resampling 和 Gillespie 选 reaction 都是它。Gillespie 1977 年的原文写的正是这个 inequality：选使 $\sum_{\nu<\mu}a_\nu<r_2a_0\le\sum_{\nu\le\mu}a_\nu$ 的 $\mu$，$a_0$ 是所有 rate 之和。

Systematic resampling 只改了一处：$N$ 个 $u$ 不再 independent 地抽，改为取 $u_j=(r+j)/N$，$r$ 是 $[0,1/N)$ 里的一个 random number。每个 $u_j$ 单独看仍是 uniform，所以第 $i$ 个 particle 被选中的 expected 次数还是 $Nw_i$；$u_j$ 等距，所以实际次数只能是 $\lfloor Nw_i\rfloor$ 或 $\lceil Nw_i\rceil$。

::fig[thread-monte-carlo-inverse] 同一个操作的三处用法。左边在 $S(t)=P(\tau>t)$ 上反查 $u_1$；右上是 CS4278 的 4 个 particle（weight 0.375、0.125、0.125、0.375）和 4 个等距 pointer；右下是 LSM2234 第 4 步，$n=3$ 时 production 占 $2/3.5$。

到了高维没有 $F^{-1}$ 可写。[MIT-6.S184 第 1 站](../courses/MIT-6.S184.html#ode)证明了一维的 flow model 学到的必然是 quantile map $F^{-1}(\Phi(x))$，也就是 inverse transform 前面接一个 $\Phi$；高维时它学的是一个 vector field，做的仍是把容易抽的 distribution 送到要抽的 distribution。

## 各门课里的名字

| 课与站 | 在那里叫 | 要算的量 | Sample 从哪来 | 记号 |
|---|---|---|---|---|
| [ST2131 第 7 站](../courses/ST2131.html#limit) | weak law、CLT | $\mu=\mathbb E[X]$ | i.i.d. 的 $X_i$ | $\bar X_n$，$S_n$，$\sigma^2/n$ |
| [ST2132 第 6 站](../courses/ST2132.html#ci) | coverage 的 simulation | interval 盖住 $\mu$ 的 probability | 重复整个 experiment | $\bar X$，$S$，$1-\alpha$ |
| [MA3270 第 4 站](../courses/MA3270.html#sample) | Monte Carlo、importance sampling、MCMC | $\mathbb E_p[f(X)]$ | $p$、proposal $q$ 或 chain | $\hat\mu_n$，$w=p/q$，$\tilde p$ |
| [CS3264 第 6 站](../courses/CS3264.html#pac) | training error | true error $L_{\mathcal D}(h)$ | training set $S\sim\mathcal D^m$ | $L_S(h)$，$m$，$\varepsilon$，$\delta$ |
| [CS4246 第 6 站](../courses/CS4246.html#td) | Monte Carlo prediction | $v_\pi(s)=\mathbb E[G_t\mid S_t=s]$ | episode | $G_t$，$V(S_t)$ |
| [BERKELEY-CS285 第 6 站](../courses/BERKELEY-CS285.html#trpo) | importance-sampled objective | 新 policy 的 $J(\theta')$ | 旧 policy 的 trajectory | $\prod_t\pi_{\theta'}/\pi_\theta$ |
| [CS4278 第 3 站](../courses/CS4278.html#pf)、[RB3302 第 5 站](../courses/RB3302.html#loc) | particle filter、MCL | $\mathrm{bel}(x_t)$ 下的 expectation | motion model | $x^{[i]}$，$w^{[i]}$，$N$（RB3302 用 $M$） |
| [NW-MODERNROBOTICS 第 7 站](../courses/NW-MODERNROBOTICS.html#plan)、[CS4278 第 5 站](../courses/CS4278.html#motion)、[RB3302 第 2 站](../courses/RB3302.html#sample) | PRM、RRT | 有没有 path | C-space 上 uniform | $x_{\text{samp}}$；$q$，$q_{\text{near}}$ |
| [CS4278 第 6 站](../courses/CS4278.html#pomdp) | scenario、DESPOT | policy 的 value | $K$ 个 scenario | $\phi$，$K$，$\hat V$ |
| [MIT-6.S184 第 4 站](../courses/MIT-6.S184.html#score) | Euler–Maruyama、Langevin dynamics | $p_{\text{data}}$ 的 sample 本身 | $X_0\sim N(0,I)$ | $h$，$\sigma_t$，$\nabla\log p_t$ |
| [CORNELL-CS5788 第 5 站](../courses/CORNELL-CS5788.html#ebm) | Langevin dynamics | $p_\theta=e^{-E_\theta}/Z$ 的 sample | chain | $\varepsilon$，$z_k$ |
| [LSM2234 第 6 站](../courses/LSM2234.html#noise) | Gillespie algorithm | $P_n(t)$ | 一条条 trajectory | $R$，$\tau$，$u_1$，$u_2$ |
| [MA3238 第 4 站](../courses/MA3238.html#ctmc) | holding time 与 jump chain | $p_{ij}(t)$ | 同上 | $q_i$，$\hat P$，$Q$ |
| [DSE4211 第 6 站](../courses/DSE4211.html#amm) | path simulation | LVR 的 expected 值 | price path | $\ell$，$V$ |

## 逐门课：每一门往骨架上加了什么

### ST2131 与 ST2132：骨架本身，以及拿它检查别的结论

[ST2131 第 7 站](../courses/ST2131.html#limit)给出骨架里的两个 theorem。它的 die 例子顺便说明了 error bar 为什么用 CLT 而不用 Chebyshev：掷 100 次，$P(|S-350|\ge50)$ 的 Chebyshev bound 是 0.117，exact 值是 0.0036。

[ST2132 第 1 站](../courses/ST2132.html#sampling)的 sampling distribution 正是 Monte Carlo 在模拟的东西：重复抽 sample、每次算一个 statistic，这些 statistic 的 histogram 逼近它的 sampling distribution。[第 6 站](../courses/ST2132.html#ci)用这个办法核对 coverage：100,000 个 $t$ interval 里 95.0% 盖住了 $\mu$。这个 95.0% 本身就是一个 Monte Carlo estimate，$f$ 是“这一次盖住了”的 indicator，它的 error bar 是 $\pm1.96\sqrt{0.95\times0.05/100000}=\pm0.0014$。同一批 sample 用 1.96 代替 2.262 得到 91.8%，差 0.032，远大于 0.0014，所以这个 simulation 分辨得出两者。

ST2132 还加了一条和撒点直接相关的提醒。那一站算过，$p$ 小、$n$ 小时 plug-in interval 的实际 coverage 远低于 95%，极端情形是 $x=0$：$\hat p=0$，$s=0$，interval 缩成一个点。[MA3270 第 4 站](../courses/MA3270.html#sample)估计 $P(Z>4)$ 时一万个 sample 一个都没落进去，正是这个情形。改用 ST2132 解 quadratic 的 interval：把 $\hat p=0$ 代进那一站的 quadratic inequality，得 $(1+z^2/n)\,p^2-(z^2/n)\,p\le0$，即 $p\big[(1+z^2/n)\,p-z^2/n\big]\le0$，所以 $0\le p\le z^2/(n+z^2)=3.8416/10003.84=3.8\times10^{-4}$：一万次都没发生，能说的是 $p\le3.8\times10^{-4}$，真值 $3.17\times10^{-5}$ 在里面。

### MA3270：骨架在三处断开，各补一块

[MA3270 第 4 站](../courses/MA3270.html#sample)是这条线上最完整的工具箱，三个小节各对应骨架的一个断点。NUS 专门讲这些方法的课是 ST3247 Simulation，本站还没有写它的页面。

- $\sigma$ 相对 $\mu$ 太大（rare event）：换一个 proposal $q$ 来抽，乘 weight $w=p/q$ 改回来，$\mathbb E_q[fw]=\mathbb E_p[f]$，error 由 $\mathbb E_q[f^2w^2]$ 决定。
- 抽不了 $p$，只知道 $\tilde p=Zp$：造一个 stationary distribution 是 $p$ 的 Markov chain。Metropolis 的 acceptance 用 $\tilde p(y)/\tilde p(x)$，$Z$ 约掉。Time average converge 到 $\mathbb E_p[f]$ 靠的是 [ST3236 第 6 站](../courses/ST3236.html#limit)的 ergodic theorem，它在 chain 上替代了 i.i.d. 时的 law of large numbers。
- $\sigma^2=\infty$：importance weight 的 tail 太重时，$\hat\mu_n$ 仍然 unbiased，CLT 却不再成立。

第三点可以用 ST2132 的 coverage 办法直接量出来。MA3270 的 heavy-tail 例子（target $N(0,2^2)$，proposal $N(0,1)$，估计 $\mathbb E_p[X^2]=4$），每次照骨架报告 $\hat\mu\pm1.96s/\sqrt n$，重复 1000 次（numpy `default_rng(1)`；$n=10^5$ 时重复 300 次）：

| $n$ | 名义 95% 的 interval 实际盖住 4 的比例 | $\hat\mu$ 的 median |
|---|---|---|
| $10^3$ | 50.1% | 2.81 |
| $10^4$ | 54.9% | 3.27 |
| $10^5$ | 57.3% | 3.54 |

把 proposal 和 target 对调（$q=N(0,2^2)$，估计 $N(0,1)$ 下的 $\mathbb E[X^2]$），$n=10^4$ 时是 95.1%。$\sigma^2=\infty$ 时 $s$ 自己不 converge，算出来的 error bar 是假的：多数时候 sample 里还没出现那个巨大的 weight，$\hat\mu$ 偏低，$s$ 也偏小。

### CS3264：有限 $m$ 的保证，和同时估计很多个

[CS3264 第 6 站](../courses/CS3264.html#pac)的 training error $L_S(h)$ 就是 $\hat\mu_m$：$f$ 是 0-1 loss，$p$ 是 data distribution $\mathcal D$，$m$ 个 example 是 $m$ 个 sample。它往骨架上加了两样东西：Hoeffding 给出对每个 $m$ 都成立的 $m\ge\ln(2/\delta)/(2\varepsilon^2)$；union bound 处理“同时估计 $|H|$ 个量、要它们全都准”。后一件事在 learning 之外同样要紧，见第 4、5 座桥。

### CS4246 与 CS285：value 是 return 的 expectation

[CS4246 第 6 站](../courses/CS4246.html#td)的 Monte Carlo prediction 就是骨架：$v_\pi(s)=\mathbb E[G_t\mid S_t=s]$，从 $s$ 出发跑很多个 episode，平均 return。那一站跑了 100,000 次，return 的 standard deviation 是 1.09，error bar 是 $\pm1.96\times1.09/\sqrt{100000}=\pm0.0068$，18.350 与 true value 18.349 吻合在意料之中。TD 用 bootstrapped target 代替 $G_t$，variance 变小、引入 bias，这是骨架之外的取舍。

[第 9 站](../courses/CS4246.html#mcts)的 flat Monte Carlo search 是一个反例：$K=1000$ 次 rollout 把 a 估成 0.58、b 估成 0.60，而 a 才是对的。Error bar 没有问题，问题在 $f$：random rollout 估计的是“第二步随机走”的 value 0.55，要的却是第二步选对之后的 0.9。$n$ 再大，$\hat\mu_n$ 也只会 converge 到写下的那个 expectation。

[BERKELEY-CS285 第 6 站](../courses/BERKELEY-CS285.html#trpo)用旧 policy 的 trajectory 估计新 policy 的 return，weight 是每一步 action ratio 的连乘，$\mathbb E[W^2]=1.04^T$。这是 importance sampling 在 sequence 上的样子，和 particle filter 的 weight 是同一个现象，见第 1 座桥。

### CS4278 与 RB3302：particle filter

[CS4278 第 3 站](../courses/CS4278.html#pf)用 importance sampling 推出 particle 的 weight：target 是 $\mathrm{bel}(x_t)$，proposal 是按 motion model 走一步得到的 $\overline{\mathrm{bel}}(x_t)$，两者之比只剩 likelihood $p(z_t\mid x_t)$。[RB3302 第 5 站](../courses/RB3302.html#loc)在另一条 corridor 上手算了一轮。两站往骨架上加的是 sequential：每一步的 sample 来自上一步的 sample，要 resampling 防止 weight 一路连乘，resampling 用的就是上面的 inverse transform。Sanz-Alonso 与 Al-Ghattas 的教材证明了，likelihood 有上下界时 bootstrap particle filter 的 error 是 $c/\sqrt N$，constant $c$ 随步数和 likelihood 的范围变大：$1/\sqrt n$ 还在，constant 要付代价。

### NW-MODERNROBOTICS、CS4278 与 RB3302：sampling-based planning

PRM 和 RRT 撒点的目的是在 $C_{\text{free}}$ 里找到一条连通的路，不估计任何 expectation。[NW-MODERNROBOTICS 第 7 站](../courses/NW-MODERNROBOTICS.html#plan)给出 PRM 和 RRT 的步骤与 collision check；[CS4278 第 5 站](../courses/CS4278.html#motion)量了 gap 变窄时 RRT 所需 sample 数的增长；[RB3302 第 2 站](../courses/RB3302.html#sample)讲 RRT* 为什么 asymptotically optimal，并估了 narrow passage 的 volume $w^{d-1}$。它们和骨架共用的是 sample 的 probability：probabilistic completeness 说的是，一个 probability mass 为 $p$ 的区域在 $n$ 次 uniform sample 之后仍然空着的 probability $(1-p)^n$ 趋于 0。Kavraki 与 Latombe 对 PRM 的分析给出的失败 probability 同样随 $n$ 指数下降。这个式子在 CS3264 里出现过，见第 4 座桥。

[CS4278 第 6 站](../courses/CS4278.html#pomdp)的 DESPOT 把 randomness 先固定成 $K$ 个 scenario，所有 policy 在同一批 scenario 上比较。两个方案用同一批 random number 评估，各自的 error 有很大一部分相同，在差值里抵消，比较更准；代价是挑出来的 policy 会过度贴合这几个 scenario，见第 5 座桥。

### MIT-6.S184 与 CORNELL-CS5788：sample 本身就是产品

这两门课要的是 $p_{\text{data}}$ 或 $p_\theta$ 的 sample 本身，不求任何 expectation。[MIT-6.S184 第 1 站](../courses/MIT-6.S184.html#ode)的 Euler–Maruyama 每步加 $\sigma\sqrt h\,\epsilon$；[第 4 站](../courses/MIT-6.S184.html#score)证明 Langevin dynamics 不改变 $p$。[CORNELL-CS5788 第 5 站](../courses/CORNELL-CS5788.html#ebm)从 energy-based model 出发：$Z(\theta)$ 算不出，score $-\nabla_xE_\theta$ 不需要 $Z$，于是 Langevin 成了它的 sampler；那一站还发现 Langevin 在 0.8 比 0.2 的两个 bump 上给出 47.4%，应该是 20%。两站加到骨架上的是：用 score 代替 density 的比值来造 chain，以及 step size 带来的 bias。三处记号不同，对齐如下（$p\propto e^{-V}$；教材原文的 step 记作 $\epsilon$，这里改记 $\eta$，以免和 CS5788 的 $\varepsilon$ 混淆）：

| 出处 | 一步 | 换算 |
|---|---|---|
| CS5788 | $x_{k+1}=x_k+\frac{\varepsilon^2}{2}\nabla\log p(x_k)+\varepsilon z_k$ | 每步 noise 的 variance 是 $\varepsilon^2$ |
| MIT-6.S184 | $X_{t+h}=X_t+h\frac{\sigma^2}{2}\nabla\log p(X_t)+\sigma\sqrt h\,\epsilon$ | $\varepsilon^2=\sigma^2h$ |
| Sanz-Alonso 与 Al-Ghattas | $X^{(n+1)}=X^{(n)}-\eta\nabla V(X^{(n)})+\sqrt{2\eta}\,\xi^{(n)}$ | $\varepsilon^2=2\eta$ |

### LSM2234 与 MA3238：模拟一个连续时间的 process

[LSM2234 第 6 站](../courses/LSM2234.html#noise)的 Gillespie algorithm 每步抽两个 uniform：$u_1$ 经 inverse transform 给出 waiting time，$u_2$ 选 reaction。[MA3238 第 4 站](../courses/MA3238.html#ctmc)从另一头描述同一个对象：continuous-time Markov chain 由 holding rate $q_i$ 和 jump chain $\hat P$ 决定。它们加到骨架上的是：一个 sample 是一整条 trajectory，没有 time step，也就没有 discretization error；要的 $P_n(t)$ 是很多条 trajectory 的平均。两边的对应在第 3 座桥里逐项写出。

### DSE4211：拿 simulation 核对 formula，以及 moment 不存在的时候

[DSE4211 第 6 站](../courses/DSE4211.html#amm)推出 LVR 的 expected rate $\ell=\sigma^2V/8$，每天 120 USDC，再用 400 条 price path 模拟得到 120.06。这个核对能分辨到多细，骨架算得出来。每条 path 的 LVR 是 1440 步之和；把那一站的推导写到一步，每步约是 $\frac{\sigma^2V}{8\times1440}Z^2$，$Z$ 是这一步 standard normal 的 shock。1440 个 independent 的 $cZ^2$ 之和，mean 是 $1440c$，standard deviation 是 $\sqrt{2\times1440}\,c$，两者之比是 $\sqrt{2/1440}=0.037$，所以每条 path 的 standard deviation 约是 $120\times0.037=4.5$。用 numpy 实际模拟三批、每批 400 条（`default_rng(0)`），每条 path 的 standard deviation 在 4.5 到 4.7 之间，400 条平均的 error bar 是 $\pm1.96\times4.6/\sqrt{400}=\pm0.45$。120.06 与 120 的差在里面；formula 若错 1%，400 条 path 分辨得出，错 0.1% 就分辨不出。

[第 1 站](../courses/DSE4211.html#facts)碰到的是骨架彻底失效的情形。Sample kurtosis 要用 $r^4$ 的平均；tail index 小于 4 时 $\mathbb E[r^4]=\infty$（那一站引的 BTC 估计是 3.49），连 law of large numbers 的前提 $\mathbb E|f|<\infty$ 都不成立，$\frac1n\sum r_t^4$ 不 converge 到任何有限的数。那一站用同一组 GARCH 参数、只换 seed 模拟，sample kurtosis 是 7.89、11.90、15.75、43.49。这比 MA3270 的 heavy-tail importance sampling 更糟：那里 $\mathbb E|f|$ 有限、只是 $\sigma^2=\infty$，estimate 还在慢慢 converge，只是 error bar 是假的。[第 9 站](../courses/DSE4211.html#behav)的 multiple testing 是第 5 座桥的一个实例。

## 课程页里没有写的五座桥

### 桥 1：particle 的 weight 就是 importance weight，sensor 越准，particle 越少

CS4278 推出 particle 的 weight 是 importance weight，但没有接着问 MA3270 的问题：这些 weight 的 variance 有多大。Sanz-Alonso 与 Al-Ghattas 的教材把 effective sample size 定义成

$$\mathrm{ESS}=\frac{\big(\sum_iw^{(i)}\big)^2}{\sum_i\big(w^{(i)}\big)^2},$$

weight 全相等时是 $N$，只有一个非零时是 1；并且 $N/\mathrm{ESS}$ 趋于

$$\zeta=\frac{\mathbb E_q[w^2]}{\big(\mathbb E_q[w]\big)^2}.$$

这正是 MA3270 用来衡量 proposal 好坏的 second moment，换了一个归一化。

用一个两边都能算的例子。Predict 之后 particle 来自 $q=N(0,1)$；sensor 读数 $z=0$，noise 的 standard deviation 是 $r$，weight $w(x)=e^{-x^2/(2r^2)}$（constant factor 在 $\zeta$ 里约掉）。

**MA3270 那一边：算 integral。** 对任意 $a>0$，

$$\int\varphi(x)e^{-ax^2}dx=\frac1{\sqrt{2\pi}}\int e^{-(1+2a)x^2/2}dx=\frac1{\sqrt{1+2a}}.$$

取 $a=\frac1{2r^2}$ 得 $\mathbb E_q[w]=\frac{r}{\sqrt{r^2+1}}$，取 $a=\frac1{r^2}$ 得 $\mathbb E_q[w^2]=\frac{r}{\sqrt{r^2+2}}$。所以

$$\frac{\mathrm{ESS}}{N}\approx\frac1\zeta=\frac{\big(\mathbb E_q[w]\big)^2}{\mathbb E_q[w^2]}=\frac{r^2}{r^2+1}\cdot\frac{\sqrt{r^2+2}}{r}=\frac{r\sqrt{r^2+2}}{r^2+1}.$$

**CS4278 那一边：真的撒 particle。** $N=1000$ 个 particle（numpy `default_rng(0)`），按 likelihood 给 weight，算 ESS：

| sensor noise $r$ | 1 | 0.3 | 0.1 | 0.03 |
|---|---|---|---|---|
| $1000\cdot r\sqrt{r^2+2}/(r^2+1)$ | 866 | 398 | 140 | 42 |
| 实际的 ESS | 876 | 409 | 138 | 41 |

::fig[thread-monte-carlo-ess] 30 个 particle 的版本。$r=0.1$ 时 likelihood 比 particle 的散布窄十倍，weight 集中在 0 附近的四五个 particle 上；resampling 之后，其余 particle 都会变成这几个的复制品。

$r\to0$ 时 $\mathrm{ESS}/N\approx\sqrt2\,r$：sensor 越准，起作用的 particle 越少。这和直觉相反，道理却和 MA3270 的 rare event 一样：proposal（predict 出来的 belief）比 target（乘上 likelihood 之后的 belief）宽得多，大部分 sample 落在 target 几乎为 0 的地方。

Dimension 让它更糟。$d$ 个 independent 的 coordinate，weight 是 $d$ 个 factor 的 product，$\mathbb E[w^2]$ 和 $\mathbb E[w]$ 都分解成 $d$ 个相同 factor 的 product，所以 $\zeta_d=\zeta_1^d$。$r=0.3$ 时 $\zeta_1=2.513$，$N=1000$：$d=5$ 时 $1000/2.513^5=10$，$d=10$ 时是 0.1，也就是 1000 个 particle 里实际只剩一个在起作用（实测 ESS 分别是 15.3 和 2.5）。CS4278 的 laser scan 有 180 条 beam，likelihood 是 180 个 factor 的 product；那一站用 Gaussian 加 uniform 的 mixture 让每条 beam 的 likelihood 变平，从这个角度看也是在压低每个 factor 的 $\zeta$。CS285 的 trajectory weight 用的是同一个公式：每步 $\mathbb E[w]=1$、$\mathbb E[w^2]=1.04$，$T$ 步之后 $N/\mathrm{ESS}\approx1.04^T$，$T=100$ 时是 50.5。

| | CS4278 的 particle filter | MA3270 的 importance sampling | CS285 的 trajectory weight |
|---|---|---|---|
| Target | $\mathrm{bel}(x_t)$ | $p$ | 新 policy |
| Proposal | $\overline{\mathrm{bel}}(x_t)$ | $q$ | 旧 policy |
| Weight | $p(z_t\mid x_t)$ | $p/q$ | $\prod_t\pi_{\theta'}/\pi_\theta$ |
| 在哪里坏掉 | sensor 太准、state 的 dimension 高 | $q$ 的 tail 太轻 | horizon $T$ 长 |
| $N/\mathrm{ESS}$ | $\zeta_1^d$ | $\mathbb E_q[w^2]/(\mathbb E_qw)^2$ | $1.04^T$ |

### 桥 2：Metropolis 的比值与 Langevin 的 score，以及 ULA 的 bias

Metropolis 和 Langevin 绕开 $Z$ 的办法是同一个。Metropolis 用 $\log\tilde p(y)-\log\tilde p(x)$，Langevin 用 $\nabla\log\tilde p(x)$：一个是 $\log\tilde p$ 的差，一个是它的 derivative。$\log\tilde p=\log p+\log Z$，$\log Z$ 是 constant，在差和 derivative 里都消失。$y$ 靠近 $x$ 时，两者只差 Taylor expansion 的 higher-order term：

$$\log\tilde p(y)-\log\tilde p(x)\approx(y-x)\cdot\nabla\log p(x).$$

用 CS5788 的 target $p=0.8N(-2,0.25)+0.2N(2,0.25)$ 算两处。在 $x=-2.5$，score 是 2.000（CS5788 算过）；走到 $y=-2.4$，线性近似给 $0.1\times2=0.2$，exact 的 log ratio 是 $\frac{0.5^2-0.4^2}{2\times0.25}=0.18$。小 step 的 Metropolis 和 Langevin 用的是同一份局部信息。跨过低谷时就不一样了：从 $x=-2$ 提议 $y=2$，$\tilde p(2)/\tilde p(-2)=0.2/0.8=0.25$，Metropolis 以 0.25 的 probability 接受，反方向以 1 接受，两个 mode 之间的 detailed balance 正好给出 0.8 比 0.2。两个 mode 中心处的 score 都是 0，它对两个 weight 一无所知。

所以同一个 target 上，MA3270 的 step size 实验和 CS5788 的 Langevin 实验是同一件事的两半。都从 $x=-2$ 出发跑 50,000 步（mulberry32，Metropolis 用 seed 11，Langevin 用 seed 12）：

| Chain | acceptance rate | 跨过 0 的次数 | $x>0$ 的比例（应为 0.2） |
|---|---|---|---|
| Metropolis，step 0.1 | 93.7% | 0 | 0.000 |
| Metropolis，step 1 | 50.7% | 144 | 0.197 |
| Metropolis，step 3 | 26.0% | 2650 | 0.208 |
| Langevin，$\varepsilon=0.1$ | 没有这一步 | 0 | 0.000 |

::fig[thread-monte-carlo-mcmc] 动图：前 300 步的 trajectory。Step 3 的 Metropolis 常被拒绝（平线），偶尔一步跳到另一个 mode；Langevin 每步都动，却始终在左边的 bump 里。右边是 5 万步的 histogram 和真 density（虚线）。

Step 1 和 step 3 两行都接近 0.2，但 error bar 差很多，因为 chain 的 sample 不 independent。教材给出 chain 的 CLT：$\sqrt n(\hat\mu_n-\mu)$ 趋于 $N(0,\sigma^2\tau)$，$\tau=1+2\sum_{k\ge1}\rho_k$，$\rho_k$ 是 lag $k$ 的 autocorrelation。骨架里的 $\sigma^2/n$ 换成 $\sigma^2\tau/n$，相当于只有 $n/\tau$ 个 independent sample。对 $f=\mathbf1\{x>0\}$，$\sigma^2=0.2\times0.8=0.16$；从 chain 估出 step 3 的 $\tau=13$，step 1 的 $\tau=249$：

$$\text{step 3：}\ 1.96\sqrt{\frac{0.16\times13}{50000}}=0.013,\qquad\text{step 1：}\ 1.96\sqrt{\frac{0.16\times249}{50000}}=0.055.$$

0.208 和 0.197 都在各自的 error bar 里，但 step 1 的 50,000 步只值约 200 个 independent sample。$\tau$ 只有在 chain 已经多次往返两个 mode 之后才估得出来；step 0.1 和 Langevin 一次都没过去，从 chain 自身看不出它们错了，这就是 MA3270 说的“不知道 mixing 了没有”。

Step size 还带来另一种 error。Langevin 的一步是 SDE 的 Euler–Maruyama discretization，它的 stationary distribution 和 $p$ 差一个与 step 同阶的量，这样做叫 unadjusted Langevin algorithm（ULA）。教材对 Gaussian target 算出 ULA 的 stationary covariance 是 $(H-\tfrac\eta2H^2)^{-1}$，$H$ 是 $-\log p$ 的 Hessian。一维 $p=N(0,D)$ 时 $H=1/D$：

$$\mathrm{Var}_\infty=\frac{1}{\frac1D-\frac{\eta}{2D^2}}=\frac{D}{1-\frac{\eta}{2D}}.$$

这就是 MIT-6.S184 第 1 站为 OU process 推出的 $V=\sigma^2/(2\theta-\theta^2h)$。代入那里的对应 $D=\sigma^2/(2\theta)$ 和上表的 $\eta=\tfrac12\sigma^2h$：$\frac{\eta}{2D}=\frac{\sigma^2h/2}{\sigma^2/\theta}=\frac{\theta h}{2}$，于是

$$\frac{D}{1-\theta h/2}=\frac{\sigma^2/(2\theta)}{1-\theta h/2}=\frac{\sigma^2}{2\theta-\theta^2h}.$$

6.S184 算出的 0.5006（而不是 0.5）就是 ULA 的 bias。按 CS5788 的写法，step 大时 bias 很明显：$p=N(0,0.25)$、$\varepsilon=0.5$（$\eta=0.125$），formula 给 $0.25/(1-0.25)=0.333$，跑 200,000 步得 0.333。把 Langevin 的一步当 proposal，再用 Metropolis 的比值决定接不接受，叫 MALA；这个 proposal 不 symmetric，比值里要再乘 $q(y\to x)/q(x\to y)$。同样 $\varepsilon=0.5$，MALA 得 0.2505，acceptance 92%。桥的两头在这里接上：score 负责提议往哪走，Metropolis 的比值负责改掉 discretization 的 bias。

### 桥 3：Gillespie 是 jump chain 的一次 sample，master equation 是 forward equation

LSM2234 写 master equation、跑 Gillespie；MA3238 写 Q-matrix、解 Kolmogorov equation。两页没有互相提到，讲的却是同一个 birth–death chain。取 LSM2234 的参数 $k=2$、$\gamma=0.5$，state 是 mRNA 的个数 $n$，Q-matrix 的非零 entry 是

$$q_{n,n+1}=k,\qquad q_{n,n-1}=\gamma n,\qquad q_{nn}=-(k+\gamma n).$$

**Master equation 就是 forward equation。** 把 $P(t)$ 写成 row vector，MA3238 的 forward equation $P'(t)=P(t)Q$ 的第 $n$ 个 component 是 $\sum_mP_m\,q_{mn}$，非零的只有 $m=n-1,\,n,\,n+1$ 三项：

$$\frac{dP_n}{dt}=P_{n-1}\,k+P_{n+1}\,\gamma(n+1)-P_n\,(k+\gamma n),$$

逐项就是 LSM2234 的 master equation。

**Gillespie 就是 holding time 加 jump chain。** 在 $n$ 停留 Exponential$(q_n)$ 那么久，$q_n=k+\gamma n$，正是 LSM2234 的 $R$；离开时跳到 $n+1$ 的 probability 是 jump chain 的 $\hat p_{n,n+1}=q_{n,n+1}/q_n=k/R$，正是“$u_2R<k$ 就 production”。MA3238 说的“每个方向一个 Exponential clock，谁先响就跳到谁”是同一个 process 的另一种抽法。

::fig[thread-monte-carlo-gillespie] 动图：MA3238 式的 state diagram 上，圈按 Gillespie 抽出的时刻跳，下面同步画出 $n(t)$。前四跳的时刻 0.700、1.583、2.172、2.471 就是 LSM2234 那张手算表。

**同一个数，两边各算一遍。** 从 $n=0$ 出发，$t=2$ min 时恰有 4 个 mRNA 的 probability：

- MA3238 的做法：$P(2)=P(0)\,e^{2Q}$。State 截到 60（$n$ 超过 20 的 probability 已经可以忽略），用 scipy 算 matrix exponential，$P_4(2)=0.1359$。它恰好是 mean 为 $\frac k\gamma(1-e^{-\gamma t})=4(1-e^{-1})=2.528$ 的 Poisson 在 4 处的值。
- LSM2234 的做法：跑 4000 条 Gillespie trajectory 到 $t=2$（numpy `default_rng(0)`），数 $n=4$ 的比例，得 0.1358，error bar $\pm1.96\times0.0054=\pm0.011$。只跑 400 条是 $0.138\pm0.034$。

还有第三种办法，用 ST3236 的 ergodic theorem：只跑一条很长的 trajectory，算它停在 $n=4$ 的时间比例。跑 2000 min，比例是 0.188；把时间切成 20 段，用各段比例的波动估 standard error（batch means），error bar 是 $\pm0.010$，盖住了 steady state 的 $e^{-4}4^4/4!=0.1954$。这个办法只能求 steady state，求不了 $t=2$ 时的 $P_4$，后者必须对很多条 trajectory 取 ensemble average。

### 桥 4：$(1-p)^n$，probabilistic completeness 与 PAC 的 realizable bound

CS3264 的 realizable 情形里，一个 true error 超过 $\varepsilon$ 的坏 hypothesis 要在 $m$ 个 example 上一个都不错，probability 是 $(1-\varepsilon)^m\le e^{-\varepsilon m}$。Sampling-based planning 里，一个 probability mass 为 $p$ 的 passage 在 $n$ 次 uniform sample 后仍然空着，probability 是 $(1-p)^n\le e^{-pn}$。两边都要它不超过 $\delta$，解出同一个式子：

$$n\ \ge\ \frac{\ln(1/\delta)}{p}.$$

对应关系：CS3264 的 $\varepsilon$（坏 hypothesis 犯错的那块区域的 probability）对应 passage 的 mass $p$；$m$ 对应 $n$；$|H|$ 个坏 hypothesis 的 union bound 对应“要穿过 $L$ 段 passage，每段都要有 sample”，式子变成 $n\ge(\ln L+\ln(1/\delta))/p$。

用同一组数算两边：$p=\varepsilon=0.05$、$\delta=0.05$，$n\ge\ln20/0.05=59.9$，取 60，此时 $0.95^{60}=0.046$。CS3264 的 threshold 例子要 $[0.45,0.5)$ 和 $[0.5,0.55)$ 两段都有 sample，这是 $L=2$：union bound 给 $2\times0.95^{60}=0.092$，inclusion–exclusion 给 exact 的 $2\times0.95^{60}-0.90^{60}=0.090$。

::fig[thread-monte-carlo-passage] 左右是同一件事：一块 mass 为 0.05 的区域，60 个 uniform sample 里有几个落进去。两边这次都是 4 个；一个都没有的 probability 都是 0.046。

Dimension 只通过 $p$ 进来。RB3302 的 passage 在 $d=6$ 时 $p=0.05^5=3.1\times10^{-7}$，那一站说平均 320 万个 sample 才落进去一个；要以 95% 的把握至少落进去一个，$n\ge\ln20/p=9.6\times10^6$。CS3264 那一边对应的是一个 true error 只有 $3.1\times10^{-7}$ 的坏 hypothesis：要以 95% 的把握让它在 training set 上至少错一次，同样要近一千万个 example。

### 桥 5：挑出最大的那个，estimate 就偏高

三门课各自碰到一个“estimate 偏高”的现象：

- [CS3264 第 6 站](../courses/CS3264.html#pac)：1000 个瞎猜的 classifier，true error 都是 0.5，$m=100$，training error 最小的那个平均是 0.339。
- [DSE4211 第 9 站](../courses/DSE4211.html#behav)：100 个没有预测力的 signal，各 backtest 两年，最好的 Sharpe 平均 1.78。
- [CS4278 第 6 站](../courses/CS4278.html#pomdp)：DESPOT 在 4 个 scenario 上挑出的 policy，empirical value 是 6.5，比 optimal value 1.933 还高。

它们是同一个 inequality。$K$ 个 estimate $\hat\mu_1,\dots,\hat\mu_K$ 各自 unbiased，但对每个 $j$ 都有 $\max_i\hat\mu_i\ge\hat\mu_j$，取 expectation 得 $\mathbb E[\max_i\hat\mu_i]\ge\mu_j$，再对 $j$ 取 max：

$$\mathbb E\big[\max_i\hat\mu_i\big]\ \ge\ \max_i\mu_i .$$

所有 $\mu_i$ 相等、error 是 independent 的 $N(0,s^2)$ 时，偏高的量是 $s\,e_K$，$e_K$ 是 $K$ 个 standard normal 的最大值的 expectation。用 numerical integration 算 $e_K=\int xK\varphi(x)\Phi(x)^{K-1}dx$：$e_{100}=2.508$，$e_{1000}=3.241$。两边各算一遍：

- CS3264：挑的是最小的 training error，等于对 $-\hat\mu_i$ 取 max。Training error 的 standard deviation 是 $\sqrt{0.25/100}=0.05$，最小值约 $0.5-0.05\times3.241=0.338$；那一站用 binomial 算的 exact 值是 0.339。
- DSE4211：Sharpe 的 estimate 是 $N(0,\tfrac12)$，最大值约 $2.508\times\sqrt{1/2}=1.77$。那一站写的是 $2.513\times\sqrt{1/2}=1.78$，2.513 比 exact 的 $e_{100}$ 略大。

::fig[thread-monte-carlo-select] 四次 independent 的实验，每次 100 个 estimate。没有一个 signal 真的好，被挑出来的那个每次都落在 1.3 到 2.6 之间。

DESPOT 里各 policy 的 error 不 independent，没有这么干净的数，机制是一样的：policy 越大，能挑的“$i$”越多。对策也一样：CS3264 用 union bound 把 $\ln|H|$ 加进 sample complexity；DSE4211 要求报告试过多少个 variant，并在没碰过的数据上再测一次；DESPOT 给 policy 的 size 加 penalty。三者都在承认，取过 max 之后的 $\hat\mu$ 已经不是一个新鲜的 Monte Carlo estimate。

:::wrong 每个 estimate 都 unbiased，挑出最好的那个也 unbiased
Unbiased 是对一个事先固定的 $i$ 说的。“最好的那个”是看过 data 之后才决定的 index $\hat\imath$，$\hat\mu_{\hat\imath}$ 的 expectation 是 $\mathbb E[\max_i\hat\mu_i]$。上面 100 个 signal 的例子里，每个 $\hat\mu_i$ 的 expectation 都是 0，被挑中的那个的 expectation 是 1.77。要得到 unbiased 的数，只能在挑完之后用一批新的 sample 重新估计被挑中的那一个。
:::

:::from
骨架的推导（unbiased、$\sigma^2/n$、Chebyshev、CLT、Hoeffding）沿用 ST2131、ST2132、CS3264 三页已有的讲法，这里只把它们接到撒点上。各门课的说法都对着那一站的正文核过。读过的外部原文：

- Sanz-Alonso 与 Al-Ghattas，[*A First Course in Monte Carlo Methods*](https://arxiv.org/pdf/2405.16359)（WebFetch 分四次提取，读到的是逐段转述和 formula，不是原文全文）：ESS 的定义与 $N/\mathrm{ESS}\approx\zeta=1+d_{\chi^2}$；Metropolis–Hastings 的 acceptance 不需要 normalizing constant；ULA 的写法、它对 Gaussian target 的 stationary covariance $(H-\tfrac\eta2H^2)^{-1}$、MALA 消除 bias；Langevin SDE 以 $p$ 为 invariant distribution；multimodal 时 Langevin 会卡在一个 mode；bootstrap particle filter 的步骤和 $c/\sqrt N$ 的 bound；Markov chain 的 CLT 与 $\tau=1+2\sum\rho_k$。
- D. T. Gillespie，[Exact Stochastic Simulation of Coupled Chemical Reactions](https://www.cl.cam.ac.uk/teaching/2324/Bioinfo/papers/DanielGillespie1.pdf)，J. Phys. Chem. 81(25)，1977：$P(\tau,\mu)=a_\mu e^{-a_0\tau}$、$\tau=\frac1{a_0}\ln\frac1{r_1}$、选 $\mu$ 的 inequality、algorithm 是 exact 的、“uncertainty 缩小 $f$ 倍要 $f^2$ 倍的 run”。
- Kavraki 与 Latombe，[Probabilistic Roadmaps for Robot Path Planning](https://www.kavrakilab.org/publications/kavraki-latombe1998probabilistic-roadmaps-for.pdf)（1998）：逐个 coordinate uniform 地抽 configuration，失败 probability 随 node 数指数下降，narrow passage 让所需 node 数变大。抓到的文本里 formula 是乱码，只读到文字叙述。

凭自己的知识写、没有找原文核对的：grid 的 error 是 $N^{-1/d}$ 量级的论证；“挑最大的 estimate 会偏高”在 decision analysis 里有专门的名字（optimizer's curse），这里没有读相关文献；birth–death chain 从 0 出发时 $P(t)$ 是 Poisson 的结论，只用 matrix exponential 做了数值核对；common random numbers 让比较更准的说法。

数字都是为这一页算的：arm 的 grid 与随机撒点（numpy 和 mulberry32），unit ball 的 grid 对比，heavy-tail 的 coverage，LVR 的 per-path standard deviation，particle 的 ESS，四条 chain 的统计与 $\tau$，ULA 与 MALA 的 variance，matrix exponential 与 Gillespie 的 $P_4(2)$，$e_{100}$ 与 $e_{1000}$。
:::
