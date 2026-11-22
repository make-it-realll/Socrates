---
title: 没人想单独改
lead: "Supply–demand 的交点、Nash equilibrium、Coase 的 bargaining、VCG、mining 的规则和 robot 并道时的 Stackelberg plan，问的是同一件事：每个人只 optimize 自己的 payoff 时会停在哪里，每个人的算式漏掉了哪一项，规则要怎样改才能把那一项算回去。"
line: econ
---

[EC1101E 第 5 站](../courses/EC1101E.html#extern)的布 market：demand $P=70-Q$，supply $P=10+2Q$（$Q$ 以千卷计，$P$ 以元计，supply curve 的高度是 marginal cost），每卷布给下游渔民造成 12 元损失。那一站算出：1000 个作坊各自把 price 当作给定，market 停在 $Q=20$；把渔民的损失算进去，efficient 的 quantity 是 16；每卷征 12 元 Pigouvian tax，market 正好停到 16。

只改一件事：作坊归谁。[第 4 站](../courses/EC1101E.html#firm)算过另外两种 ownership：1000 个作坊归两家 firm，每家对另一家的 output 做 best response，合计 $120/7\approx17.14$；归一家 monopoly，15。Total surplus 把渔民的损失也算进去，是第 5 站的 $W(Q)=48Q-1.5Q^2$。三种 ownership，征不征那 12 元：

| ownership | 不征 tax：$Q$ | $W$ | 每卷征 12 元：$Q$ | $W$ |
|---|---|---|---|---|
| 1000 个作坊 | 20 | 360 | 16 | 384 |
| 两家 firm | 17.14 | 382.04 | 13.71 | 376.16 |
| 一家 monopoly | 15 | 382.5 | 12 | 360 |

::fig[thread-equilibrium-cloth] 左边是作坊、河和下游的渔民，虚线框是 ownership；右边是同一个 market，空心点是不征 tax 时停下的 $Q$，实心点是每卷征 12 元之后的 $Q$。动起来时 ownership 从 1000 个作坊变成两家 firm，再变成一家 monopoly。

同一笔 tax，让 1000 个作坊的 $W$ 从 360 升到 384，让两家 firm 的从 382.04 降到 376.16，让 monopoly 的从 382.5 降到 360，和完全不管时的 competitive market 一样差。Pollution 一样，每卷的损失一样，变的只是谁做决定、每个决定者手里有多大一块 output。要解释这张表，得先回答两个问题：一群各自 optimize 的 agent 会停在哪里；每个 agent 的算式里漏掉了哪一项，因此该补多少。下面把这两件事推一遍，推完会得到三个数：1000 个作坊每卷该征 11.984，两家 firm 该征 4，monopoly 该给 subsidy 4。

同样的两个问题在别的课里换了样子出现：十户人家出不出力修 dike，rancher 养几头牛，两国争一块东西时打不打，miner 挖到 block 之后公布不公布，AMM 的 price 怎样跟上外面，robot 并道时切进去多少。

## 骨架

### 每个人只对自己的 choice 求最优：best response 的 fixed point

$n$ 个 agent，agent $i$ 选 $s_i$，payoff 是 $u_i(s_i,s_{-i})$，$s_{-i}$ 是其余所有人的选择。单人的 optimization 是“给定环境，选最好的 $s_i$”；这里的环境就是 $s_{-i}$，而 $s_{-i}$ 又是别人 optimize 出来的。能拿来预测的只能是这样一组选择 $s^*$：每个人的选择，对其余人的选择都是最好的，

$$s_i^*\in B_i(s_{-i}^*)=\arg\max_{s_i}u_i(s_i,s_{-i}^*)\qquad\text{对每个 }i$$

这就是 [MA4264 第 2 站](../courses/MA4264.html#ne)的 Nash equilibrium。把所有人的 best response 拼成一个 map $B$，equilibrium 是它的 fixed point，$s^*\in B(s^*)$。要求它的理由只有一条：一个 profile 如果不满足这个条件，至少有一个人知道换个选择更好，这个 profile 留不住。[EC1101E 第 2 站](../courses/EC1101E.html#market)说 price 停在 50，用的是同一条：高于 50 seller 卖不掉，低于 50 buyer 买不到，只有 50 时没有人有理由出另一个 price。

在布 market 上用一次。1000 个作坊平均分给 $N$ 家 firm。所有 firm 都生产 $q$ 时 total output $Q=Nq$，industry 的 MC 是 $10+2Q=10+2Nq$；每家是 industry 的 $1/N$，所以它自己的 MC 是 $10+2Nq_i$，variable cost 是 $10q_i+Nq_i^2$。$N=2$ 时这正是 EC1101E 第 4 站的 $10q_i+2q_i^2$。Firm $i$ 的 profit（略去 fixed cost）是

$$\pi_i=(70-Q)\,q_i-10q_i-Nq_i^2,\qquad Q=q_i+Q_{-i}$$

$Q_{-i}$ 是别家的合计。对 $q_i$ 求 derivative，$Q$ 里也有 $q_i$：

$$\frac{\partial\pi_i}{\partial q_i}=(70-Q)-q_i-10-2Nq_i=0\quad\Longrightarrow\quad B_i(Q_{-i})=\frac{60-Q_{-i}}{2N+2}$$

$N=2$ 时是 $(60-q_j)/6$，第 4 站的那条 best response。Equilibrium 里各家对称，$q_i=q$，$Q=Nq$，代进 derivative 为 0 的式子：$70-Nq-q-10-2Nq=0$，

$$q=\frac{60}{3N+1},\qquad Q=\frac{60N}{3N+1}$$

$N=1$ 得 15，$N=2$ 得 $120/7$，$N=1000$ 得 19.993，$N\to\infty$ 时趋于 20。

Derivative 里的 $-q_i$ 是这样来的：firm $i$ 多卖一单位，price 降 1，它原来在卖的 $q_i$ 单位每单位少收 1。Price taker 的条件 $P=MC$ 恰好少了这一项。$N=1000$ 时每家的 $q_i=0.02$，比 price 50 小 2500 倍，丢掉它就是 competitive market。所以 competitive equilibrium 是这个 Nash equilibrium 在 $N$ 很大时的近似：price taker 指每个 agent 对 price 的影响小到可以不算；market clearing 指大家当作给定的那个 price，正好是大家选择之后形成的 price，这又是一个 fixed point 的条件。

### 每个人的 derivative 漏掉的那一项

Social 的目标是所有人 payoff 的和 $W=\sum_ju_j$。所有人包括 buyer、每家 firm、渔民和收 tax 的 government；钱从一个人手里转到另一个人手里，$W$ 不变（[EC1101E 第 3 站](../courses/EC1101E.html#welfare)的 transfer）。对 $s_i$ 求 derivative，拆成 $i$ 自己的部分和其余人的部分：

$$\frac{\partial W}{\partial s_i}=\underbrace{\frac{\partial u_i}{\partial s_i}}_{i\text{ 自己算进去的}}+\underbrace{\sum_{j\ne i}\frac{\partial u_j}{\partial s_i}}_{e_i}$$

Equilibrium 里第一项是 0（interior、smooth 时 best response 的 first-order condition）。所以 equilibrium 满足 social 的 first-order condition，当且仅当在 equilibrium 上每个 $e_i=0$。$e_i$ 是 $i$ 多做一单位给其余所有人带来的变化，叫 externality。

补救：对 $i$ 的每单位 $s_i$ 收 $t_i$，$i$ 的 payoff 变成 $u_i-t_is_i$，first-order condition 变成 $\partial u_i/\partial s_i=t_i$。设 $s^o$ 是让 $W$ 最大的那组选择，它满足 $\partial W/\partial s_i=0$，即 $\partial u_i/\partial s_i=-e_i(s^o)$。所以取

$$t_i=-e_i(s^o)$$

$s^o$ 就满足每个人加了 tax 之后的 first-order condition。$u_i-t_is_i$ 对 $s_i$ concave 时（布 market 里是开口向下的 parabola），first-order condition 就是 best response，$s^o$ 是加了 tax 之后的 Nash equilibrium。$e_i<0$ 时 $t_i>0$，是 tax；$e_i>0$ 时 $t_i<0$，是 subsidy。

布 market 里 firm $i$ 多生产一单位，$Q$ 加 1，$P$ 降 1，其余三方的变化是：

- Buyer：demand 的 slope 是 −1，consumer surplus 是 $\tfrac12Q^2$，derivative 是 $Q$：每一卷都便宜了 1，一共 $Q$ 卷。
- 别家 firm：它们的 $Q-q_i$ 单位每单位少收 1，profit 少 $Q-q_i$。
- 渔民：少 12。

加起来

$$e_i=Q-(Q-q_i)-12=q_i-12$$

Buyer 得到的 $Q$ 和别家失去的 $Q-q_i$ 大部分互相抵消，剩下 $+q_i$，和 firm $i$ 自己 derivative 里的 $-q_i$ 大小相同、符号相反。Efficient 的 $Q^o=16$ 由 $N$ 家平分，$q_i=16/N$：

$$t_N=12-\frac{16}{N}$$

| $Q=16$ 时 | 1000 个作坊 | 两家 firm | monopoly |
|---|---|---|---|
| 每家的 $q_i$ | 0.016 | 8 | 16 |
| buyer 得 $Q$ | 16 | 16 | 16 |
| 别家失 $Q-q_i$ | 15.984 | 8 | 0 |
| 渔民失 | 12 | 12 | 12 |
| $e_i$ | −11.984 | −4 | +4 |
| 该收的 $t_i$ | 11.984 | 4 | −4，即 subsidy 4 |

核对两家 firm：每卷收 4，derivative 是 $70-Q-q_i-10-4q_i-4=0$，对称时 $56-7q=0$，$q=8$，$Q=16$。核对 monopoly：每卷给 4，$70-2Q-10-2Q+4=0$，$Q=16$。开头那张表的原因就在这里：12 元只对“每家的 $q_i$ 小到可以不算”的 market 是对的。Monopoly 算了自己对 price 的影响，没算 buyer 因此少得的 surplus，本来就少生产了一截；再收 12 元，少得更多。

:::wrong Pigouvian tax 等于 marginal external damage，和 market structure 无关
Marginal external damage 是渔民的 12，它只是 $e_i$ 的一部分。$e_i$ 还包括 firm $i$ 经过 price 给 buyer 和别家 firm 带来的变化，合起来是 $+q_i$。1000 个作坊时这部分是 0.016，tax 就是 12；monopoly 时它是 16，比 12 还大，正确的做法反而是给 subsidy 4。对 monopoly 照收 12，$Q$ 从 15 掉到 12，$W$ 从 382.5 掉到 360。Buchanan 1969 年在 American Economic Review 上的 External Diseconomies, Corrective Taxes, and Market Structure，题目说的就是 corrective tax 和 market structure 的关系（题目和卷期核对过，原文没有读）。
:::

### 一步一步地走到 equilibrium

Fixed point 只说停在哪里，不说怎样走到那里。最直接的过程是轮流做 best response：$s_i^{k+1}=B_i(s_{-i}^k)$。两家 firm 从说好的各卖 7.5 出发：对方守约卖 7.5，自己的 best response 是 $(60-7.5)/6=8.75$；对方对 8.75 回应 8.5417；再往下是 8.5764、8.5706、8.5716，收向 $60/7=8.5714$。

::fig[thread-equilibrium-brdyn] 两家 firm 轮流对对方当前的 output 做 best response。左边是两家的 output，右边是同一个过程在 $(q_1,q_2)$ plane 上：横着走一步是 firm 1 调整，落到它的 best response line 上；竖着走一步是 firm 2 调整。

离 equilibrium 的距离每步乘 $-1/6$：$B(60/7+d)=\big(60-60/7-d\big)/6=60/7-d/6$。Best response 是一条 slope 为 $-1/6$ 的 line，slope 的 absolute value 小于 1，这个 map 是 contraction，从哪里出发都收敛。同一个 map 在别的课里 slope 不同。[MA4264 第 2 站](../courses/MA4264.html#ne)的 Cournot 是 $-1/2$。[PS1101E 第 8 站](../courses/PS1101E.html#ir)的 Richardson arms race $x_{t+1}=g+kx_t$ 是 $k$：$k=0.5$ 时 $10,15,17.5,18.75,\dots$ 收向 20，$k=1.2$ 时一路升高，equilibrium 照样“存在”（$x^*=g/(1-k)$ 是负数，没有意义），过程却离它越来越远。Strategy 有限时还会转圈：matching pennies 和 Rock-Paper-Scissors 没有 pure equilibrium，best response 在几个格子之间轮换，[BERKELEY-AGENTIC 第 6 站](../courses/BERKELEY-AGENTIC.html#multi)画了这个圈，改成对对手到目前为止的 average strategy 做 best response（fictitious play），收敛的才是 average。

### 把 payoff 改成 $W$ 减去一个和自己无关的数

$t_i=-e_i(s^o)$ 只保证在 $s^o$ 附近对齐。更强的要求是：不管别人怎样选，$i$ 的 best response 都是让 $W$ 最大的那个。只要把 $i$ 的 payoff 改成

$$\tilde u_i(s)=W(s)-h_i(s_{-i})$$

就做到了。$h_i$ 不依赖 $s_i$，不影响 $i$ 在自己的几个选择之间怎样取舍，所以对任何 $s_{-i}$ 都有 $\arg\max_{s_i}\tilde u_i=\arg\max_{s_i}W$。“让 $W$ 最大”成了每个人的 dominant strategy。

Externality 是 linear 的时候，Pigouvian tax 正好给出这个形式。[GE1101E 第 6 站](../courses/GE1101E.html#commons)的牧场：10 个牧民，第 $i$ 个放 $c_i$ 头牛，每头牛给主人 10，并让所有牛的产出合计少 20、每人摊 2。记 $C=\sum_jc_j$，牧民 $i$ 的 payoff 是 $10c_i-2C$，$W=10C-20C=-10C$。每头牛给另外 9 个人造成 18 的损失，收 $t=18$：

$$\tilde u_i=10c_i-2C-18c_i,\qquad\tilde u_i-W=10c_i-2C-18c_i+10C=8C-8c_i=8C_{-i}$$

差只取决于别人的牛 $C_{-i}$，正是 $W-h_i$ 的形式。布 market 的 $e_i=q_i-12$ 随 $q_i$ 变，per-unit tax 只能在 $s^o$ 上对齐；要在每一个 $s$ 上都对齐，就得按 $i$ 给别人造成的总变化收钱，后面的 VCG 就是这样做的。

各门课用的办法，按“谁来改 payoff”分成四类：

1. 第三方收 tax 或罚 fine：Pigouvian tax、Hobbes 的 sovereign、proof of stake 的 slashing。
2. 把权利界定清楚，让当事人自己用钱交换：Coase。两个人谈的是他们合起来的 payoff，externality 就在这个和里面，所以会谈到合起来最大为止；权利归谁只决定谈不拢时停在哪里。
3. 同一个 game 反复玩：今天偏离的好处要和以后被 punish 的损失比，未来的损失起了 fine 的作用。
4. Externality 的大小只有当事人自己知道时，让他报出来，再按报出来的数收他给别人造成的 externality：VCG。

## 各门课里的名字和记号

| 课与站 | 这门课叫它什么 | 记号 | equilibrium 在这门课里的样子 | 往骨架上加了什么 |
|---|---|---|---|---|
| [EC1101E 第 2、4 站](../courses/EC1101E.html#market) | market equilibrium、best response、prisoner's dilemma | $P$、$Q_D$、$Q_S$；$q_i$ | $Q_D(P)=Q_S(P)$；$q_i=(60-q_j)/6$ | price taker 是 $N\to\infty$ 的极限 |
| [EC1101E 第 5 站](../courses/EC1101E.html#extern) | externality、Pigouvian tax、Coase theorem、free rider | private MC、social MC；$MB_A$、$MB_B$、$MB_C$ | social MC 等于 willingness to pay | $e_i$ 里 physical 的那一部分 |
| [EC2101 第 5、6、7 站](../courses/EC2101.html#ge) | price taker、Lerner index、competitive equilibrium、Walras' law | $p$、MRS、$Z_x(p)$ | $p=SRMC$；$\text{MRS}_A=p=\text{MRS}_B$ | 多个 market 同时 clear；两条 welfare theorem |
| [MA4264 第 2 站](../courses/MA4264.html#ne) | best response、Nash equilibrium、best-response dynamics | $B_i(s_{-i})$、$u_i$ | $s^*\in B(s^*)$ | fixed point、contraction |
| [MA4264 第 5、6 站](../courses/MA4264.html#spe) | Stackelberg、alternating-offer bargaining、grim trigger、folk theorem | $\delta$、$\underline v_i$ | backward induction；$x=1/(1+\delta)$；$\delta\ge\frac{\bar v_i-v_i}{\bar v_i-\underline v_i}$ | 先后与 commitment；未来当 fine |
| [MA4264 第 1、7 站](../courses/MA4264.html#dom) | second-price auction、Bayesian Nash equilibrium | $b(v)$、type $\theta_i$ | bid $v$ weakly dominant；$b(v)=v/2$ | private information |
| [PS1101E 第 2、4 站](../courses/PS1101E.html#collective) | collective action problem、selective incentive、sovereign | $b$、$c$、$N$；$f$；$\delta$ | $b<c<Nb$；$f>1$；$\delta\ge\frac12$ | institution 怎样改 payoff |
| [PS1101E 第 8 站](../courses/PS1101E.html#ir) | security dilemma、stag hunt、bargaining range | $r$、$k$；$p$、$c_A$、$c_B$ | $r>\frac12$；$p-c_A\le x\le p+c_B$ | 多个 equilibrium；war 是谈不拢 |
| [LC1002A 第 6 站](../courses/LC1002A.html#econ) | Coase theorem、transaction cost、Hand formula | 牛的头数、$p$；$B$、$P$、$L$ | $p\in[1.5,3]$；$B<PL$ | legal rule 决定谈不拢时停在哪 |
| [GE1101E 第 6 站](../courses/GE1101E.html#commons) | tragedy of the commons、Pigouvian tax、cap-and-trade | $t$；$MC_A$、$MC_B$ | $t=18$；$MC_A=MC_B=150$ | price 和 quantity 两种工具 |
| [CS3263 第 11 站](../courses/CS3263.html#game) | Nash equilibrium、minimax | $\pi_A$、$\pi_B$、$V_A$ | $V_A(\pi_A^*,\pi_B^*)\ge V_A(\pi_A,\pi_B^*)$ | zero-sum 时 value 唯一 |
| [IS4302 第 2、3、6 站](../courses/IS4302.html#pow) | Nakamoto consensus、slashing、arbitrage | $\beta$、$q$、$z$；stake；$x$、$y$、$k$ | 按 protocol 走是 best response；$y/x=P_{\text{ext}}$ | protocol 自己就是 payoff |
| [DSE4211 第 6、7 站](../courses/DSE4211.html#amm) | LVR、liquidation bonus、adverse selection | $\sigma$、$V$；$L$、$D$ | $\ell=\sigma^2V/8$；$P\ge0.8715L$ | surplus 被谁拿走 |
| [STANFORD-CS237B 第 6 站](../courses/STANFORD-CS237B.html#game) | interaction-aware planning、Stackelberg、implicit gradient | $u_R$、$u_H$；$R_R$、$R_H$ | $u_R^*=\arg\max R_R\big(u_R,u_H^*(u_R)\big)$ | 对 follower 的 best response 求 derivative |
| [BERKELEY-AGENTIC 第 6 站](../courses/BERKELEY-AGENTIC.html#multi) | self-play、minimax equilibrium、exploitability、fictitious play | $q=(q_R,q_P,q_S)$ | exploitability 为 0 | equilibrium 不唯一时要靠 human data 选 |

同一个字母在不同课里是不同的东西：

- $u$：MA4264 的 $u_i$ 是 payoff；CS237B 的 $u_R$、$u_H$ 是 control，那里的 payoff 是 $R_R$、$R_H$。
- $p$：EC1101E、EC2101 的 price；PS1101E 里 A 打赢的 probability；IS4302 里 honest miner 的 hash power 比例；LC1002A 里 farmer 付给 rancher 的钱。
- $q$：EC 和 MA4264 的 quantity；IS4302 的 attacker hash power（下面跟 Eyal 和 Sirer 记作 $\alpha$）；BERKELEY-AGENTIC 的 mixed strategy。
- $R$：CS237B 的 reward；Eyal 和 Sirer 的 relative revenue $R_{\text{pool}}$；DSE4211 的 borrow rate $R(U)$ 和 recovery rate。
- $\lambda$：EC2101、GE1101E 的 Lagrange multiplier；IS4302 的 Poisson mean。
- $k$：PS1101E 的 reaction coefficient；IS4302 和 DSE4211 的 $xy=k$。

## EC1101E 与 EC2101：price taker 为什么不用补那一项

### 两个 $q_i$ 互相抵消

骨架里 firm $i$ 的 derivative 有一项 $-q_i$，$e_i$ 里经过 price 的部分是 $+q_i$。Price taker 两项都不算：自己那一项是丢掉的，别人那一项本来就不在它的算式里。两项大小相等，一起丢掉，first-order condition 不变。所以没有 physical externality（渔民那 12）时，price taker 的 $P=MC$ 就是 social 的 first-order condition。这是 [EC1101E 第 3 站](../courses/EC1101E.html#welfare)“competitive quantity 让 total surplus 最大”和 [EC2101 第 7 站](../courses/EC2101.html#ge) First Welfare Theorem 在骨架里的样子。EC2101 列出的几条 assumption 各管一项：没有 market power，自己的 $-q_i$ 才可以丢；没有 externality，$e_i$ 里才没有 physical 的部分；没有 transaction cost、full information，大家面对的才是同一个 $p$。

Exchange economy 里也是这样。EC2101 的 A、B 只通过 $p$ 互相影响，每人选 $\text{MRS}=p$；social 的条件（contract curve）是 $\text{MRS}_A=\text{MRS}_B$。同一个 $p$ 同时出现在两人的 first-order condition 里，两个条件就合成了 social 的那一个。

找这个 $p$ 也是一个 fixed point 的过程。EC2101 那一站的 Walrasian auctioneer 按 excess demand 调 price。A 的 endowment 是 $(8,2)$，utility $xy$；B 的是 $(4,7)$，utility $xy^2$。Price 为 $p$ 时 $x$ 的 excess demand 是

$$Z_x(p)=\frac{8p+2}{2p}+\frac{4p+7}{3p}-12=\Big(4+\frac1p\Big)+\Big(\frac43+\frac7{3p}\Big)-12=\frac{10}{3p}-\frac{20}{3}$$

$Z_x(p)=0$ 给出 $p=\tfrac12$。按 $p_{t+1}=p_t+0.05\,Z_x(p_t)$ 从 $p_0=1$ 出发：$Z_x(1)=-3.33$，$p_1=0.833$；接着 0.700、0.605、0.547、0.518、0.507、0.502，收向 0.5。Price 是大家共用的 input，调它直到每个人在这个 price 下的 best response 加起来正好 clear。

:::wrong Firm $i$ 多卖让 price 下跌，别家 firm 少赚了钱，这也是该纠正的 externality
它是 externality，但不是单独存在的。别家失去的 $Q-q_i$ 是 buyer 得到的 $Q$ 的一部分：price 降 1，seller 少收的每一块钱都进了 buyer 的口袋。$N=1000$、$Q=20$ 时，firm $i$ 多卖一单位，别家少 19.98，buyer 多 20，净额 0.02。只看 seller 一边、去补偿 incumbent 或限制 entry，等于把 $e_i$ 算成 −19.98，会把 $Q$ 压到 efficient 以下。经过 price 的 externality 只在 $q_i$ 不可忽略时才有净额，那就是 market power。
:::

### Markup 就是没补上的那一项

Monopoly 时 $q_i=Q$。它的 first-order condition $MR=MC$ 写开是 $P+QP'(Q)=MC$，即

$$P-MC=Q\,|P'(Q)|$$

右边就是 $e_i$ 里 buyer 那一项（monopoly 没有别家）。布 market 里 $Q=15$：$P-MC=55-40=15=Q\times1$。[EC2101 第 6 站](../courses/EC2101.html#mono)的 market 1，$p=60-q/10$，$q=240$：$36-12=24=240\times\tfrac1{10}$。Lerner index $(P-MC)/P=-1/\varepsilon$ 是同一个式子除以 $P$。按骨架，efficient 的 $q$ 是 $P=MC$ 的地方，$60-q/10=12$，$q=480$；在那里 $e=q|P'|=48$，给 subsidy 48，$MR+48=60-q/5+48=12$，$q=480$。

EC1101E 和 EC2101 都讲了 first-degree price discrimination 消除 deadweight loss。在骨架里看，monopoly 向每个 buyer 收他愿意付的最高 price，buyer 的 surplus 全归了它，多卖一单位不再影响任何 buyer，$e_i$ 里 buyer 那一项变成 0。Externality 被“把受影响的 payoff 收归自己所有”消掉了，这和后面 Coase 的做法是同一个思路，只是 surplus 的分配完全偏向 seller。

## MA4264、PS1101E 与 CS3263：fine、未来和选哪一个 equilibrium

### Hobbes 的 fine 和 Pigouvian tax

[PS1101E 第 2 站](../courses/PS1101E.html#collective)的 prisoner's dilemma，payoff 是 4、3、2、1：

| | C | D |
|---|---|---|
| **C** | (3, 3) | (1, 4) |
| **D** | (4, 1) | (2, 2) |

我从 C 改成 D，对方 C 时他从 3 变 1，对方 D 时他从 4 变 2，两列都是 −2。所以 D 的 externality 是 $e=-2$。[PS1101E 第 4 站](../courses/PS1101E.html#contract)的 sovereign 对 D 罚 $f$，算出 $f>1$ 就够让 C 成为 dominant strategy，例子用的是 $f=1.5$。按骨架收 Pigouvian 的 $f=2$，看看 $\tilde u_1-W$：

| (我，对方) | (C, C) | (D, C) | (C, D) | (D, D) |
|---|---|---|---|---|
| 我的 $\tilde u_1$（$f=2$） | 3 | 2 | 1 | 0 |
| $W$ | 6 | 5 | 5 | 4 |
| $\tilde u_1-W$ | −3 | −3 | −4 | −4 |

差只取决于对方的选择（对方 C 时 −3，D 时 −4），正是 $W-h_1$ 的形式。$f=1.5$ 时 (D, C) 那一格的差是 $2.5-5=-2.5$，和 (C, C) 的 −3 不同，不是这个形式，但两个 action 时只要 C 胜过 D，选择就一样。Sovereign 不必知道 externality 恰好是 2，只要 fine 越过 1。Choice 连续时（布 market）就不行，fine 的大小决定停在哪个 $Q$。

[第 2 站](../courses/PS1101E.html#collective)的 dike 也一样。十户，每份力花 10，给每户 3。自己出力净得 $3-10=-7$，给另外九户 27，social 净得 20。条件 $b<c<Nb$（$3<10<30$）说的就是“自己算的 $b-c$ 是负的，加上 externality $(N-1)b$ 之后是正的”。Selective incentive $s>7$ 够让每户出力；Pigouvian 的 subsidy 是 27，加上之后每户算出的正好是 social 的 20。

### 未来是一笔 fine

[MA4264 第 6 站](../courses/MA4264.html#repeat)的 grim trigger：今天 D，今天多得 $4-3=1$；从明天起双方永远 D，每期少 $3-2=1$，按 $\delta$ discount 之后合计 $\delta+\delta^2+\cdots=\delta/(1-\delta)$。这相当于对 D 罚了 $f=\delta/(1-\delta)$，只是分期在以后交。Hobbes 的条件 $f\ge1$ 变成 $\delta/(1-\delta)\ge1$，即 $\delta\ge\tfrac12$，正是 MA4264 和 PS1101E 算出的阈值。$\delta=0.6$ 时 $f=1.5$，恰好是 PS1101E 第 4 站例子里的 fine。

两者的区别在谁来罚。Sovereign 是第三方；repeated game 里罚的是对方，罚的办法是回到 (D, D)，而 (D, D) 本身是 stage game 的 Nash equilibrium，所以真到了要罚的时候，罚是对方的 best response，MA4264 用 one-shot deviation principle 验证的就是这一点。Folk theorem 还要求能看见对方偏离了：看不见就罚不了。这一条在 IS4302 那一节会再出现。

### 两个 equilibrium：选哪一个

[PS1101E 第 8 站](../courses/PS1101E.html#ir)的 stag hunt、[MA4264 第 2 站](../courses/MA4264.html#ne)的 partnership game、[CS3263 第 11 站](../courses/CS3263.html#game)的 collaborative Morra 是另一种情形：好的结果本身就是 equilibrium，在那里 $e_i$ 不造成偏离，不需要 tax。问题是坏的结果也是 equilibrium。Stag hunt 里我 Restrain 当且仅当我认为对方 Restrain 的 probability $r>\tfrac12$；collaborative Morra 两人利益完全一致，仍有 value 为 4、2、$-\tfrac1{12}$ 的三个 equilibrium。改 payoff 的四类办法在这里用不上，要改的是 expectation。[BERKELEY-AGENTIC 第 6 站](../courses/BERKELEY-AGENTIC.html#multi) Brown 的论点落在同一处：general-sum game 里 self-play 会收敛到某一套约定，人用的可能是另一套，要知道人用哪一套只能看 human data。

## LC1002A、GE1101E 与 PS1101E：Coase 是一次 bargaining

### 权利决定谈不拢时停在哪里

[LC1002A 第 6 站](../courses/LC1002A.html#econ)的 rancher 和 farmer。Rule B（rancher 不用赔）下，谈不拢时 rancher 养 4 头，farmer 自己花 9 修围栏：rancher 得 14，farmer 得 −9，合计 5。养 3 头、不修围栏合计 6.5，最大。从 4 头减到 3 头，rancher 少赚 1.5，farmer 少损失 3，farmer 付 $p$ 给 rancher：

$$\text{rancher}：12.5+p\ge14\iff p\ge1.5,\qquad\text{farmer}：-6-p\ge-9\iff p\le3$$

任何 $p\in[1.5,3]$ 都让两人比谈不拢时好。用骨架的话：两人合起来的 payoff 就是这个两人世界里的 $W$，第 4 头牛给 farmer 造成的损失就在这个和里，所以只要能用钱交换，两人会谈到 $W$ 最大的 3 头。Rule A（rancher 要赔全部损失）下，compensation 就是付给受害者的 Pigouvian tax：第 3 头牛多赔 3，第 4 头多赔 4，正好是 marginal damage，rancher 自己的算式就等于 $W$，不用谈就停在 3 头。Rule 改变的只是谈不拢时的起点：Rule B 是 (14, −9)，Rule A 是 (6.5, 0)。

LC1002A 那一站的 Hand formula 是同一件事：$B<PL$ 时不预防就要负责，injurer 于是要承担 expected harm $PL$，和 Rule A 一样把 externality 搬进了自己的算式。

### Bargaining theory 定下 $p$

Coase 的原文说 farmer 实际付多少“would depend on the shrewdness”，看两人谈判的本事。[MA4264 第 5 站](../courses/MA4264.html#spe)的 alternating-offer bargaining 可以把它定下来。把每年 1.5 的 surplus 当作要分的 pie：farmer 先提一个 $p$，rancher 接受就从此按 3 头养；拒绝就这一年照 4 头加围栏，下一年由 rancher 提。设 stationary 的 SPE 里 proposer 每年拿走 surplus 中的 $x$。Rancher 接受每年多得 $g$ 的 offer，当且仅当 $g/(1-\delta)\ge\delta x/(1-\delta)$，即 $g\ge\delta x$（拒绝时今年多得 0，明年起他当 proposer，每年拿 $x$）。所以 farmer 给 $\delta x$、留下 $1.5-\delta x$，而这又应该等于 $x$：

$$x=1.5-\delta x\quad\Longrightarrow\quad x=\frac{1.5}{1+\delta}$$

这就是 MA4264 的 $x=1/(1+\delta)$ 乘上 pie 的大小 1.5。$\delta=0.9$、farmer 先提：farmer 每年得 $1.5/1.9=0.789$，rancher 得 0.711，$p=1.5+0.711=2.211$。Rancher 先提：$p=1.5+0.789=2.289$。$\delta\to1$ 时两者都趋于 2.25，range 的中点。有最后期限时，按 MA4264 那张表逐轮倒推：只有 1 轮，farmer 拿走全部，$p=1.5$；2 轮，farmer 只拿 $1-\delta=0.1$，$p=2.85$；3 轮 1.635；4 轮 2.7285；之后在 2.211 两边来回，越来越近。

::fig[thread-equilibrium-bargain] 上面一条是 rancher 和 farmer 的 $p$：谈不拢时停在 (14, −9)，range 是 $[1.5,3]$；动起来时点是“最多谈 $n$ 轮”时 SPE 的 $p$，$n=1,2,3,\dots$，在 2.211 两边来回收拢。下面一条是 PS1101E 的 war，同样的结构，range 宽 0.2。

### War 是一次谈不拢

[PS1101E 第 8 站](../courses/PS1101E.html#ir)的 Fearon model 结构相同。两国争价值为 1 的东西，谈不拢就开战：A 得 $p-c_A=0.5$，B 得 $1-p-c_B=0.3$，合计 0.8。谈成任何分法合计都是 1。Range $[0.5,0.7]$ 的宽度 0.2 是 $c_A+c_B$，也就是谈成比谈不拢多出的 $W$。Coase 的 range 宽 1.5，是 $6.5-5$。两个 model 都预测会谈成，失败的原因也同类。LC1002A 把受害者换成 20 户农户：组织谈判每户花 0.25，合计 5，比减到 3 头能多出的 2.5 还大，谁也不动，合计停在 4。Fearon 的三条是 private information（双方都有夸大自己决心的 incentive）、indivisibility 和 commitment problem。前者是谈本身有 cost，后者是谈出来的东西不可信或分不开。

:::wrong Coase theorem 说只要能谈，government 就不用管 externality
它的前提是谈判没有 cost、双方的 cost 和 benefit 都公开。20 户农户的例子里，可以分的 surplus 是 2.5，组织成本是 5，结果停在 4 而不是 6.5。PS1101E 的 war 更进一步：双方都 rational、range 不空，仍然可能打起来，因为各自的 cost 是 private information，谁都有理由虚报。LC1002A 那一站指出，Coase 写那篇文章的主要目的正是提醒 transaction cost 不为零。
:::

### Cap-and-trade 的 price 就是 Pigouvian tax

[GE1101E 第 6 站](../courses/GE1101E.html#commons)的两家 firm，减排的 marginal cost 是 $MC_A=2q$、$MC_B=6q$，合计减 $R=100$ t。最便宜的分法是

$$\min\ q_A^2+3q_B^2\quad\text{s.t.}\quad q_A+q_B=R$$

Lagrangian 的 first-order condition 是 $2q_A=\lambda$、$6q_B=\lambda$，所以 $q_A=\lambda/2$，$q_B=\lambda/6$，相加 $2\lambda/3=R$，$\lambda=1.5R=150$，$q_A=75$，$q_B=25$。最小 cost $C(R)=\tfrac{9R^2}{16}+\tfrac{3R^2}{16}=0.75R^2$，$C(100)=7500$，$dC/dR=1.5R=150=\lambda$：多减 1 t 要多花 150。[EC2101 第 4 站](../courses/EC2101.html#cost)证明 cost minimization 的 multiplier 就是 marginal cost，这里是同一个结论。

Permit market 是一个 competitive market：每家 firm 是 price taker，按 $MC=$ permit price 决定自己减多少、要多少 permit，supply 是 cap 定死的总量，clear 的 price 就是 $\lambda=150$。对每吨排放征 150 的 tax，两家减的量一模一样。所以 cap 和 tax 在 $\lambda$ 处相遇：定 quantity，market 找出 price；定 price，market 找出 quantity。按骨架，要 efficient，还得让 150 等于每吨排放的 marginal damage，那是 GE1101E 第 6 站“最好的 pollution 量是零”那一条说的事。

## 让说真话成为 best response：VCG

### 路灯：free rider 不肯说真话

[EC1101E 第 5 站](../courses/EC1101E.html#extern)的路灯。三户对第 $q$ 盏灯的 marginal benefit 是 $MB_A=20-q$、$MB_B=16-q$、$MB_C=12-q$，每盏 30。Efficient 的是 $q=6$（$14+10+6=30$），$W=54$；任何一户自己装，第一盏只值 20，不装，$q=0$。Government 想按 $q=6$ 装，可它不知道各户的 MB。问各户，按报出的 MB 分摊 cost，每户都有理由少报，这正是 free rider problem。要找一个付钱的规则，让每户不管别人怎么报，自己都宁愿说真话。

记各户的 value $v_i(q)=a_iq-\tfrac12q^2$（$a_i$ 是 20、16、12，$v_i$ 是 MB 下面的 area）。VCG（这里是 Clarke 的 pivot rule）这样做：每户报一个 $\hat v_i$；government 选 $\hat q$ 让报出来的 $\sum_j\hat v_j(q)-30q$ 最大，cost 由 government 付；第 $i$ 户付

$$t_i=\underbrace{\max_q\Big[\sum_{j\ne i}\hat v_j(q)-30q\Big]}_{h_i\text{：没有 }i\text{ 时其余的人（连同付 cost 的 government）最多能得多少}}-\underbrace{\Big[\sum_{j\ne i}\hat v_j(\hat q)-30\hat q\Big]}_{\text{有 }i\text{ 时他们实际得多少}}$$

第一项只依赖别人报的数。两项之差是 $i$ 的存在让其余所有人少得的，也就是 $i$ 给别人造成的 externality，按总量收，而不是按单位。

为什么说真话是 dominant strategy。$i$ 真实的 utility 是

$$v_i(\hat q)-t_i=\underbrace{v_i(\hat q)+\sum_{j\ne i}\hat v_j(\hat q)-30\hat q}_{\text{按 }i\text{ 的真实 value 算的 }W}-h_i$$

这正是骨架里 $W-h_i$ 的形式，$h_i$ 和 $i$ 报什么无关。Government 选 $\hat q$ 去最大化 $\hat v_i(q)+\sum_{j\ne i}\hat v_j(q)-30q$。$i$ 如实报 $\hat v_i=v_i$，government 最大化的就正好是 $i$ 自己 utility 里依赖 $\hat q$ 的那部分；报别的，government 最大化的是另一个式子，选出的 $\hat q$ 对 $i$ 只会一样或更差。这对任何 $\hat v_{-i}$ 都成立。

### 三户各付多少

三户都说真话，$\hat q=6$。

::fig[thread-equilibrium-vcg] 一条街上三户人家。第一帧是三户都在时装 6 盏灯。动起来时轮流拿掉一户，看剩下两户（连同付 cost 的 government）会装几盏、得多少；它和“有这一户时他们得多少”之差就是这一户付的钱。

- **A。** 没有 A：B、C 的 MB 合计 $28-2q$，第一盏就不到 30，装 0 盏，其余的人得 0。有 A、装 6 盏：$v_B(6)+v_C(6)-180=78+54-180=-48$。$t_A=0-(-48)=48$。
- **B。** 没有 B：A、C 合计 $32-2q=30$，装 1 盏，得 $\int_0^1(2-2q)\,dq=1$。有 B：$v_A(6)+v_C(6)-180=102+54-180=-24$。$t_B=1-(-24)=25$。
- **C。** 没有 C：$36-2q=30$，装 3 盏，得 $\int_0^3(6-2q)\,dq=9$。有 C：$102+78-180=0$。$t_C=9-0=9$。

各户的 utility：A 是 $102-48=54$，B 是 $78-25=53$，C 是 $54-9=45$。每户的 utility 恰好是 $W$ 减去没有它时的 $W$：$54-0$、$54-1$、$54-9$，也就是它对 $W$ 的 marginal contribution。

拿 A 核对 truthful 是 best response。A 少报成 $15-q$：government 解 $43-3q=30$，$\hat q=13/3$；A 付的是 $0-\big[v_B(13/3)+v_C(13/3)-130\big]=27.44$，少付了，但灯也少了，A 真实的 value 是 $v_A(13/3)=77.28$，utility $77.28-27.44=49.83<54$。A 多报成 $26-q$：$\hat q=8$，付 80，value $v_A(8)=128$，utility 48，也少于 54。

[MA4264 第 1 站](../courses/MA4264.html#dom)的 second-price auction 是只有一件东西时的 VCG。Value 10、8、5 的三个 bidder 说真话，10 的那位得到。没有他时东西归 8 的那位，其余的人得 8；有他时其余的人得 0。他付 $8-0=8$，第二高的 bid。MA4264 分三种情形证明 bid value 是 weakly dominant，就是上面那段论证在一件东西上的版本。[第 7 站](../courses/MA4264.html#bayes)的 first-price auction 不 truthful，equilibrium bid 是 $v/2$，expected revenue 却和 second-price 一样是 $\tfrac13$。

:::wrong VCG 收上来的钱正好够付 cost
三户合计付 $48+25+9=82$，6 盏灯花 180，government 要自己补 98。每户拿到的是自己的 marginal contribution，三个 marginal contribution 的和 $54+53+45=152$ 远大于 $W=54$。Narahari 的讲义里有 Green–Laffont 的结论：每个人可能的 value function 足够多时，没有一个 mechanism 能同时做到 efficient、dominant strategy truthful 和 budget balanced。Pigouvian tax 和 VCG 收钱的原则相同，都是 $i$ 给别人造成的 externality；Pigouvian tax 要 regulator 自己知道 damage，VCG 让当事人报出来，代价是预算可能对不上。
:::

## IS4302 与 DSE4211：protocol 的规则就是 payoff

### 按 protocol 挖矿是不是 best response

[IS4302 第 2 站](../courses/IS4302.html#pow)：hash power 比例为 $\beta$ 的 miner 以 probability $\beta$ 挖到下一个 block，拿 block reward。Nakamoto 论文第 6 节的论证是一句 equilibrium 的断言：一个掌握了多数 CPU 的 greedy attacker，要在“骗回自己的付款”和“挖新 coin”之间选，“He ought to find it more profitable to play by the rules”。用骨架的话：别人都按 protocol 走时，按 protocol 走是不是自己的 best response。要检验它，就得把每一种偏离都和 protocol 比一比。

Eyal 和 Sirer 2013 年给出了一种偏离，叫 selfish mining。Pool（hash power 比例 $\alpha$）挖到 block 先不公布，私下接着挖，按领先多少决定什么时候放出来：

- 不领先时挖到一个：私藏，领先 1。
- 领先 1 时别人挖到一个：马上公布私藏的那个，两条等长的 branch 竞争。Honest miner 里有比例 $\gamma$ 接在 pool 的那条上。
- 领先 2 时别人挖到一个：把私藏的全部公布，pool 的 chain 更长，别人刚挖的那个作废。
- 领先超过 2 时别人挖到一个：公布一个，仍然领先。

::fig[thread-equilibrium-selfish] 上面是 selfish mining 的 state：数字是 pool 私下领先几个 block，0′ 是两条等长 branch 竞争。下面是 pool 的 block 在最终 chain 里所占的比例，按论文的 formula 画；虚线是按 protocol 挖时的 $\alpha$，曲线越过它的地方偏离就划算。

论文解出这个 Markov chain 的 stationary distribution，pool 的 block 在最终 chain 里所占比例是

$$R_{\text{pool}}=\frac{\alpha(1-\alpha)^2\big(4\alpha+\gamma(1-2\alpha)\big)-\alpha^3}{1-\alpha\big(1+(2-\alpha)\alpha\big)}$$

按 protocol 走，这个比例是 $\alpha$。$R_{\text{pool}}>\alpha$ 的条件是 $\alpha>\dfrac{1-\gamma}{3-2\gamma}$。代几个数：

| $\alpha$ | 0.25 | 0.30 | 1/3 | 0.35 | 0.40 |
|---|---|---|---|---|---|
| $R_{\text{pool}}$，$\gamma=0$ | 0.1951 | 0.2731 | 0.3333 | 0.3665 | 0.4837 |
| $R_{\text{pool}}$，$\gamma=\tfrac12$ | 0.2500 | 0.3269 | 0.3846 | 0.4160 | 0.5256 |

$\gamma=0$ 时阈值是 $\tfrac13$，$\gamma=\tfrac12$ 时是 $\tfrac14$，$\gamma=1$ 时是 0。按论文的规则模拟 2,000,000 个 block 核对：$\alpha=0.25$ 得 0.1957，$\alpha=0.4$ 得 0.4834，和 formula 的 0.1951、0.4837 一致。$\alpha=0.4$、$\gamma=0$ 时 pool 拿到 48.4% 的 block，比按 protocol 的 40% 多两成。所以 $\alpha>\tfrac13$ 时，“大家都按 protocol 走”不是 Nash equilibrium，论文的说法是 Bitcoin 的 protocol 不是 incentive-compatible。Pool 多拿的那部分来自 externality：honest miner 挖出的 block 被作废，他们的 work 白费了。论文建议 tie 时每个 miner 随机选一条，把 $\gamma$ 定在 $\tfrac12$，阈值从可能的 0 提高到 $\tfrac14$。

Selfish mining 只是一种偏离。Sapirshtein、Sompolinsky 和 Zohar 把 pool 的选择（adopt、override、match、wait）写成一个 MDP，求 optimal 的偏离，得到的阈值严格低于 selfish mining 的；relative revenue 不是 linear 的 objective，他们对猜测的值 $\rho$ 定义 linear 的 reward $(1-\rho)x-\rho y$，再找让 optimal average reward 为 0 的 $\rho$。检验“protocol 是 equilibrium”，就是求一个 MDP 的 best response，用的是[从终点往回算](bellman.html)那条线里的 Bellman equation。为什么比的是比例而不是 block 的个数：我的理解是 difficulty 每 2016 个 block 按出块速度调一次（IS4302 第 2 站），长期里每 10 分钟仍是一个 block，miner 的收入取决于份额。

### Slashing 是看得见、罚得到的 fine

骨架的第一类办法要求 fine 能落到偏离者头上，MA4264 的 folk theorem 也要求能看见对方偏离。Proof of work 两条都做不到，IS4302 第 2 站说作恶的 miner 最多白花电费。[IS4302 第 3 站](../courses/IS4302.html#pos)的 proof of stake 补上了两条：偏离是给同一个 epoch 的两个冲突 block 都签名，两个 signature 本身就是证据；quorum intersection 保证一旦 safety 被破坏，9 个 validator 里至少 3 个能被点名，而且不会冤枉 honest 的人；fine 是烧掉锁定的 stake。对应到 PS1101E 第 4 站：偏离者签下的 signature 是“看得见”，事先锁定的 stake 是 sovereign 手里的 sword。

### AMM：arbitrage 停下来的地方

[IS4302 第 6 站](../courses/IS4302.html#defi)和 [DSE4211 第 6 站](../courses/DSE4211.html#amm)的 pool：100 ETH、300,000 USDC，$xy=k=3\times10^7$，marginal price $y/x=3000$。外面的 price 涨到 3300。Arbitrageur 从 pool 买 ETH 拿到外面卖，再买一个的 cost 是 pool 当时的 marginal price，卖得 3300，所以他买到 pool 的 marginal price 等于 3300 为止。Pool 停在 $x=\sqrt{k/3300}=95.3463$：没有人再想交易，这和 EC1101E 第 2 站的 equilibrium 是同一个条件。

把 pool 当成一个 seller 看。外面 price 从 3000 涨到 $p$ 的过程中，pool 卖出的 ETH 是

$$S(p)=x(3000)-x(p)=100-\sqrt{k/p}$$

这是一条 supply curve：price 越高卖得越多。$S(3300)=4.6537$。Arbitrageur 每个 ETH 按 pool 当时的 marginal price $p$ 买进、按 3300 卖出，利润是

$$\int(3300-p)\,dS(p)=\Big[(3300-p)S(p)\Big]_{3000}^{3300}+\int_{3000}^{3300}S(p)\,dp=\int_{3000}^{3300}S(p)\,dp$$

（第一项两端都是 0：$p=3300$ 时 $3300-p=0$，$p=3000$ 时 $S=0$。）这正是 [EC1101E 第 3 站](../courses/EC1101E.html#welfare)的 producer surplus 的 area：price line 以下、supply curve 以上。算出来：

$$\int_{3000}^{3300}\Big(100-\sqrt k\,p^{-1/2}\Big)dp=30000-2\sqrt k\big(\sqrt{3300}-\sqrt{3000}\big)=714.69$$

和 DSE4211 算的 arbitrageur 利润一样。如果 pool 是一个 price taker，按 3300 卖出这 4.6537 ETH，收 15,357.35；它实际收的是 14,642.65，每个 ETH 都按自己当时的 marginal price 卖掉。差 714.69（按未四舍五入的数算）就是 pool 本来该有的 producer surplus，全被 arbitrageur 拿走了。[EC1101E 第 4 站](../courses/EC1101E.html#firm)的 perfect price discrimination 是 seller 向每个 buyer 收他愿付的最高 price、拿走全部 consumer surplus；这里倒过来，buyer 向 seller 按它肯卖的最低 price 一单位一单位地买，拿走全部 producer surplus。DSE4211 把它叫 LVR。

::fig[thread-equilibrium-amm] 左边是 pool 里的 ETH 和 USDC；右边是 pool 的 supply curve，横轴是 pool 卖出的 ETH，纵轴是 price。第一帧是外面 price 已经到 3300：浅色 area 是 arbitrageur 的利润 714.69。动起来时外面的 price 从 3000 一步步涨到 3300，area 跟着长大。

小的变动 $\Delta P$ 时 supply curve 近似一条直线，slope 是 $|x'(P)|$，这块 area 是底 $\Delta P$、高 $|x'(P)|\Delta P$ 的三角形，$\tfrac12|x'(P)|(\Delta P)^2$。这里 $|x'(3000)|=\tfrac12\sqrt k\,3000^{-3/2}=1/60$，三角形是 $\tfrac12\times\tfrac1{60}\times300^2=750$，比精确的 714.69 大一点，因为 curve 往上弯。DSE4211 第 6 站对这个三角形取 expectation，得到 $\sigma^2V/8$。

### Liquidation bonus 是给第三方的 incentive

[DSE4211 第 7 站](../courses/DSE4211.html#lend)的 liquidation：price 跌破 liquidation price $L$ 时，任何人都可以替 borrower 还 debt $D$、拿走价值 $1.05D$ 的 ETH。5% 的 bonus 是 protocol 付给第三方的钱，让“去 liquidate”成为看着 chain 的人的 best response。按 mechanism design 的说法，它要满足 participation constraint：liquidator 拿到的 collateral 至少值 $1.05D$，$40P\ge1.05\times0.83\times40L$，即 $P\ge0.8715L$。Price 一次跳过 $L$ 以下 12.85%，这个 constraint 不成立，没有人出手；跳过 17%，collateral 不够还 debt。

## STANFORD-CS237B 与 BERKELEY-AGENTIC：把别人的 best response 算进自己的 plan

### Stackelberg：对 follower 的 best response 求 derivative

[STANFORD-CS237B 第 6 站](../courses/STANFORD-CS237B.html#game)的 merge。Robot 在一条 lane 上要切进另一条，切进去 $u_R\in[0,1]$；后面人开的车选 acceleration $u_H$。人的 reward $R_H=-u_H^2-2u_Ru_H$，robot 的 $R_R=2u_R-2u_R^2-1.2\,u_R(1+u_H)$。Sadigh 等人 2016 年的 RSS 论文说，解完整的 game 要每一方都预测对方怎样预测自己，是一个 infinite regress；他们让 robot 先动，人对 robot 的 plan 做 best response：

$$u_R^*=\arg\max_{u_R}R_R\big(u_R,u_H^*(u_R)\big),\qquad u_H^*(u_R)=\arg\max_{u_H}R_H(u_R,u_H)$$

这是 [MA4264 第 5 站](../courses/MA4264.html#spe)的 Stackelberg model。逐项对应：$u_R$ 是 leader 的 $q_1$，$u_H$ 是 follower 的 $q_2$，$R_R$、$R_H$ 是 $u_1$、$u_2$。MA4264 把 $q_2=(1-q_1)/2$ 直接代进 $u_1$；CS237B 的 $u_H^*$ 没有 explicit formula，要对它求 derivative，用 implicit function theorem：

$$\frac{\partial u_H^*}{\partial u_R}=-\Big(\frac{\partial^2R_H}{\partial u_H^2}\Big)^{-1}\frac{\partial^2R_H}{\partial u_H\,\partial u_R}$$

这个数就是 follower 的 best response line 的 slope。拿 Cournot（$P=2-q_1-q_2$，cost 1）算：$\partial^2u_2/\partial q_2^2=-2$，$\partial^2u_2/\partial q_2\partial q_1=-1$，代进去 $-(-2)^{-1}(-1)=-\tfrac12$，正是 $B_2(q_1)=(1-q_1)/2$ 的 slope。Merge 里 $\partial^2R_H/\partial u_H^2=-2$、$\partial^2R_H/\partial u_H\partial u_R=-2$，slope 是 $-1$，$u_H^*=-u_R$。

Leader 的 total derivative 比 Nash 的 first-order condition 多一项：

$$\frac{dR_R}{du_R}=\frac{\partial R_R}{\partial u_R}+\underbrace{\frac{\partial R_R}{\partial u_H}\,\frac{\partial u_H^*}{\partial u_R}}_{\text{Nash 不算的}}$$

在 Nash equilibrium 上第一项是 0，第二项决定 leader 往哪边走。Cournot 的 $(\tfrac13,\tfrac13)$：$\partial u_1/\partial q_2=-q_1=-\tfrac13$，乘 $-\tfrac12$ 得 $+\tfrac16$，leader 要多产，停在 $\tfrac12$。Merge 的 Nash 是 $u_R=2/7$（下面算）：$\partial R_R/\partial u_H=-1.2u_R=-0.343$，乘 $-1$ 得 $+0.343$，robot 要切得更多，停在 0.5。骨架里的 $e_i$ 是“我的选择对别人的影响”，这一项是“我的选择经过别人的反应对我自己的影响”，两个都是单方面求 derivative 时漏掉的，前者 Pigouvian tax 来补，后者 leader 自己补，只要他能 commit。

### 每一步都重新 plan，走到的是 Nash

假设 robot 每一轮都把人上一轮的反应当作固定的，对它做 best response，人再对 robot 的新 action 做 best response。Robot 对固定的 $u_H$ 求 derivative：$2-4u_R-1.2(1+u_H)=0$，$u_R=0.2-0.3u_H$；人回 $u_H=-u_R$。合起来 $u_R^{k+1}=0.2+0.3\,u_R^k$，是 slope 0.3 的 contraction。从“以为人不动”的 0.2 出发：0.26、0.278、0.2834、0.2850，收向 fixed point $u_R=0.2/0.7=2/7=0.2857$。这就是骨架里的 best-response dynamics，停在 Nash equilibrium，不在 Stackelberg 的 0.5。

| | merge：$u_R$ | $R_R$ | Cournot：$q_1$ | $u_1$ |
|---|---|---|---|---|
| 以为对方不动，只算一次 | 0.2 | 0.128 | | |
| 轮流 best response，到 Nash | 0.2857 | 0.1633 | 1/3 | 0.1111 |
| Stackelberg | 0.5 | 0.200 | 1/2 | 0.125 |

::fig[thread-equilibrium-merge] 左边是 road：robot（R）切进下面的 lane，后面的 human（H）减速。右边是 $(u_R,u_H)$ plane 上两条 best response line，折线是每一轮重新 plan 的轨迹，收到两条 line 的交点 Nash；空心圈是 Stackelberg 的 $(0.5,-0.5)$，在 human 的 line 上。

MA4264 指出 Stackelberg 的好处来自 leader 改不了：$q_1=\tfrac12$ 不是对 $q_2=\tfrac14$ 的 best response，事后能改的话 leader 会改小。Robot 的 MPC 每一步只执行第一个 control 再重新 plan，它能做到 0.5，靠的是 model 里的那条 assumption：人对 robot 整段 plan 的前几步做 best response（Sadigh 等人的论文明说人能看到 robot 这一小段 horizon 的 plan，轮流动是为了方便）。Model 错了也会吃亏，CS237B 第 6 站算过：人其实不看路时，切 0.5 的 robot 实际得 −0.1。论文自己列的 limitation 也在这里：不同的 driver 反应不同，而且只处理了一个 human。

### Self-play 和 human data

[BERKELEY-AGENTIC 第 6 站](../courses/BERKELEY-AGENTIC.html#multi)的 naive self-play 是 best-response dynamics：每一轮对对手上一轮的 strategy 做 best response，在 Rock-Paper-Scissors 里 R、P、S 转圈，因为这个 map 不是 contraction。Fictitious play 对对手的 average 做 best response，average 收敛，$t=4$ 时 exploitability 是 0.25，$t=200$ 时 0.035。Two-player zero-sum 里每个 equilibrium 的 value 相同，收敛到哪一个都可以；general-sum 时 equilibrium 有很多个，就像上面的 stag hunt。CS237B 用 IRL 从人的驾驶 data 学 $R_H$，CICERO 用 human data 训练 imitation model，回答的是同一个问题：对方会用哪一个 best response。

:::from
用 WebFetch 读的：Eyal 与 Sirer，[Majority is not Enough: Bitcoin Mining is Vulnerable](https://ar5iv.labs.arxiv.org/html/1311.0243)（ar5iv；读到的是 state machine 的规则、stationary probability、$R_{\text{pool}}$ 的 formula、阈值 $\frac{1-\gamma}{3-2\gamma}$ 和 random tie-breaking 的建议，是工具给出的公式摘录和转述，不是逐字全文）；Sapirshtein、Sompolinsky 与 Zohar，[Optimal Selfish Mining Strategies in Bitcoin](https://ar5iv.labs.arxiv.org/html/1507.06183)（只读到前约六分之一：abstract、MDP 的 state 与 action、$w_\rho$ 的处理；具体阈值的数字没有读到，所以正文没有写）；Y. Narahari 的 [VCG mechanisms 讲义](https://gtl.csa.iisc.ac.in/gametheory/ln/web-md7-vcg.pdf)（Groves payment、Clarke 的 pivot rule 与“payment 是对别人的 externality”、truthful 的证明思路、Green–Laffont 的结论）；Sadigh 等人 RSS 2016 的 [Planning for Autonomous Cars that Leverage Effects on Human Actions](https://roboticsproceedings.org/rss12/p29.pdf) 第 III、IV 节和 discussion（infinite regress、robot 先动、nested optimization、implicit gradient、L-BFGS 与 MPC、limitation）；Bitcoin whitepaper 第 6 节，读的是 [HackerNoon 的转载](https://hackernoon.com/bitcoin-white-paper-6-incentive-cg3ja2blw)（Princeton 的 PDF 没有抓到）；[Coase 原文](https://www.shastriinstitute.org/sites/default/files/Coase.pdf)只核对了“would depend on the shrewdness”那一处；Buchanan（1969）只在 [IDEAS](https://ideas.repec.org/r/aea/aecrev/v59y1969i1p174-77.html) 核对了题目和期刊卷期（那一页没有显示作者，作者凭记忆），没有读原文。

凭自己的知识写、没有对照来源的：$e_i$ 的拆分和 $t_N=12-16/N$、经过 price 的两个 $q_i$ 互相抵消、markup 等于 buyer 那一项、给 monopoly 的 subsidy；PD 的 Pigouvian fine 给出 $W-h_i$ 的形式、$f=\delta/(1-\delta)$ 的读法；Rubinstein 在“谈不拢时维持 status quo”下的 $x=1.5/(1+\delta)$；路灯的 VCG 计算；LVR 是 producer surplus 的读法；“每一步重新 plan 收到 Nash”的设想；difficulty 调整与 relative revenue 的关系。各课程页上的数字（cloth market、Coase 的表、Fearon 的 range、cap-and-trade、AMM pool、merge 的 reward）按原页重新算过。本页所有数字都用 Python 算过，分数用 exact arithmetic；selfish mining 另外按论文的规则模拟了 2,000,000 个 block。
:::
