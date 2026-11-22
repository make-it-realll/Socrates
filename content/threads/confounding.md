---
title: 相关不等于因果
lead: "两组的差别里混进了别的东西。Epidemiology 的 standardization、psychology 的 random assignment、regression 的 omitted variable bias、offline RL 的 behavior policy 与 distribution shift，算的是同一个 adjustment formula。"
line: prob
---

先看两张表。

**第一张。** 1972 到 1985 年，London 的几家医院用两种办法治 kidney stone：open surgery 和 percutaneous nephrolithotomy（PCNL）。Charig 等人 1986 年在 *BMJ* 上比较了两组各 350 个病人：

| | small stone | large stone | 合计 |
|---|---|---|---|
| Open surgery | 93.1%（81/87） | 73.0%（192/263） | 78.0%（273/350） |
| PCNL | 86.7%（234/270） | 68.8%（55/80） | 82.6%（289/350） |

每一种 stone 上都是 open surgery 的 success rate 高，合起来却是 PCNL 高。医院要定一个默认的做法，该定哪一种？

::fig[thread-confounding-stones] 每个方块的宽度是病人数，涂色的高度是 success rate，涂色的面积就是成功的人数。Open surgery 那一行的大部分宽度是 large stone，PCNL 那一行的大部分是 small stone。

**第二张。** 一个 lab 用 teleoperation 控制一只 dexterous hand，攒下了 600 次 grasp 的 log。Grasp 有两种 primitive：pinch（指尖夹住）和 power（整只手包住）；object 分 light 和 heavy。Operator 凭经验，heavy 的 object 多半用 power：

| | light | heavy | 合计 |
|---|---|---|---|
| Pinch | 90%（324/360） | 40%（16/40） | 85%（340/400） |
| Power | 95%（38/40） | 70%（112/160） | 75%（150/200） |

从 log 学一个 policy，最直接的做法是对每个 primitive 算 success rate、挑高的那个，于是一律 pinch。在同样 2:1 的 light、heavy 混合上部署，success rate 是 73.3%，比 operator 自己的 81.7% 还低。

::fig[thread-confounding-grasp] 同一种画法，只是每一行的总宽度代表这种 primitive 的全部 grasp。Pinch 的 400 次里只有 40 次是 heavy，power 的 200 次里 160 次是 heavy。

两张表的数都没有算错。Open surgery 的 350 人里 263 人是 large stone，PCNL 只有 80 人；power 的 200 次里 160 次是 heavy。Large stone 和 heavy object 本来就难，它们集中在哪一组，哪一组的合计就被拉低。要回答的问题是另一个：同一批病人全做 open surgery 会怎样、全做 PCNL 会怎样；同一批 object 全用 pinch、全用 power 会怎样。这几个“会怎样”在 data 里都没有直接出现，必须从 data 里算出来，而且要说清楚靠什么前提才算得出来。

这件事在九门课里各有名字。下面先把骨架推一遍，再用表对齐各课的名字和记号，然后逐门课看它往骨架上加了什么。

## 骨架

### 每个 unit 有两个 potential outcome，只看得到一个

给每个病人 $i$ 两个数：$Y_i(\text{open})$ 是他做 open surgery 的结果，$Y_i(\text{PCNL})$ 是他做 PCNL 的结果，成功记 1，失败记 0。他实际接受的 treatment 是 $A_i$，看得到的只有 $Y_i=Y_i(A_i)$，另一个永远看不到。这两个数叫 potential outcome。这个病人身上 open surgery 的 causal effect 是 $Y_i(\text{open})-Y_i(\text{PCNL})$。Holland 1986 年把“一个 unit 的两个 potential outcome 只能看到一个”叫作 fundamental problem of causal inference。

一个人的 effect 看不到，就退一步问整个 population：

$$\text{ATE}=E[Y(\text{open})]-E[Y(\text{PCNL})]$$

即 700 人全做 open surgery 时的 success rate，减去全做 PCNL 时的。这叫 average treatment effect。Grasp log 里一个 unit 是一次 grasp，$E[Y(\text{pinch})]$ 就是“一律 pinch”这个 policy 的 success rate。

### Crude difference 里多出一项

下面把两种 treatment 记作 $a=1$ 和 $a=0$。表里直接能算的是 crude difference。在 $A=1$ 的人里 $Y=Y(1)$，在 $A=0$ 的人里 $Y=Y(0)$，所以

$$E[Y\mid A=1]-E[Y\mid A=0]=E[Y(1)\mid A=1]-E[Y(0)\mid A=0]$$

右边是两群不同的人的两个不同的 potential outcome。加上再减去 $E[Y(0)\mid A=1]$：

$$=\underbrace{E[Y(1)-Y(0)\mid A=1]}_{\text{effect on the treated}}+\underbrace{E[Y(0)\mid A=1]-E[Y(0)\mid A=0]}_{\text{selection bias}}$$

第一项是 treatment 对实际接受它的那群人的 effect，记作 ATT。第二项和 treatment 无关：两群人如果都不接受 treatment，结果本来就差多少。Kidney stone 的表里，下面会算出第一项是 $+4.8$ 个百分点，第二项是 $-9.4$，加起来正是 crude 的 $78.0-82.6=-4.6$。

### Randomization 让第二项为 0

如果谁做 open surgery 由抛硬币决定，$A$ 和 $(Y(0),Y(1))$ independent，记作 $A\perp(Y(0),Y(1))$。于是

$$E[Y(0)\mid A=1]=E[Y(0)]=E[Y(0)\mid A=0]$$

Selection bias 为 0；同样 $E[Y(1)\mid A=1]=E[Y(1)]$，第一项也就等于 ATE。Crude difference 直接就是 causal effect。硬币不知道谁的 stone 大，也不知道任何别的事，所以这个论证不需要知道 confounder 是什么、有没有被测量。

### 没有 randomization：在每一层里比

医院没有抛硬币。退一步的假设是：**在同一种 stone 里**，谁做 open surgery 和他的 potential outcome 无关，

$$A\perp Y(a)\mid S\qquad\text{对每个 }a$$

$S$ 是 stone 的大小。这叫 conditional exchangeability，也叫 no unmeasured confounding。有了它，分三步：

$$E[Y(a)]=\sum_sP(S=s)\,E[Y(a)\mid S=s]$$

这是 law of total expectation，把 population 按 $S$ 分层。

$$=\sum_sP(S=s)\,E[Y(a)\mid S=s,A=a]$$

这一步用 conditional exchangeability：在第 $s$ 层里，接受了 $a$ 的那些人的 $Y(a)$ 和全层的 $Y(a)$ 同分布。

$$=\sum_sP(S=s)\,E[Y\mid S=s,A=a]$$

这一步是因为接受了 $a$ 的人，看得到的 $Y$ 就是 $Y(a)$。最后一行全是 data 里数得出来的量。记 stratum-specific rate $r_a(s)=E[Y\mid S=s,A=a]$，

$$E[Y(a)]=\sum_sP(s)\,r_a(s)$$

这叫 adjustment formula，也叫 standardization。对照 crude rate：同样由 law of total expectation，$E[Y\mid A=a]=\sum_sP(s\mid A=a)\,r_a(s)$。两者用同一组 $r_a(s)$，差别只在 weight：crude 用这一组自己的构成 $P(s\mid A=a)$，adjustment 用全体的构成 $P(s)$。

Kidney stone：$P(\text{small})=357/700=0.51$，

$$E[Y(\text{open})]=0.51\times93.1\%+0.49\times73.0\%=83.3\%,\qquad E[Y(\text{PCNL})]=0.51\times86.7\%+0.49\times68.75\%=77.9\%$$

Open surgery 高 5.4 个百分点，和 crude 的方向相反。上一节那两项用同样的三步算，只是第一步改成按 $A=1$ 这群人分层：$E[Y(0)\mid A=1]=\sum_sP(s\mid A=1)\,r_0(s)$。Open surgery 组里 small stone 占 $87/350=0.249$，

$$E[Y(\text{PCNL})\mid\text{open}]=0.249\times86.7\%+0.751\times68.75\%=73.2\%$$

Open surgery 的病人即使做 PCNL，success rate 也只有 73.2%，比 PCNL 组实际的 82.6% 低 9.4 个百分点，这就是 selection bias；ATT 是 $78.0-73.2=4.8$。

Grasp log：$P(\text{light})=\tfrac23$，

$$E[Y(\text{pinch})]=\tfrac23\times90\%+\tfrac13\times40\%=73.3\%,\qquad E[Y(\text{power})]=\tfrac23\times95\%+\tfrac13\times70\%=86.7\%$$

开头那个 policy 部署后的 73.3% 就是第一个数。

### 同一个数的第二种算法：reweight

Crude 的毛病是每组的构成不同。另一种修法是给每个人一个 weight，让每组的构成都变成全体的构成。记 propensity $e_a(s)=P(A=a\mid S=s)$，即第 $s$ 层里接受 $a$ 的比例，给接受了 $a$ 的人 weight $1/e_a(S)$：

$$E\Big[\frac{\mathbb 1\{A=a\}\,Y}{e_a(S)}\Big]=E\Big[\frac{E[\mathbb 1\{A=a\}\,Y(a)\mid S]}{e_a(S)}\Big]=E\Big[\frac{P(A=a\mid S)\,E[Y(a)\mid S]}{e_a(S)}\Big]=E\big[E[Y(a)\mid S]\big]=E[Y(a)]$$

第一个等号：$\mathbb 1\{A=a\}=1$ 时 $Y=Y(a)$，再先对 $S$ 取 conditional expectation（$e_a(S)$ 只依赖 $S$，可以拿到里面那层 expectation 外面）。第二个：给定 $S$，$\mathbb 1\{A=a\}$ 和 $Y(a)$ independent，product 的 expectation 拆成两个 expectation 之积。第三个：$P(A=a\mid S)=e_a(S)$，约掉。最后一个是 law of total expectation。这叫 inverse probability weighting（IPW）。

Kidney stone 里 open surgery 的 propensity 在 small 层是 $87/357=0.244$，在 large 层是 $263/343=0.767$，weight 是 4.10 和 1.30：87 个 small stone 的病人被放大成 357 个，263 个 large stone 的被缩成 343 个，open surgery 组变成和全体一样的构成。

$$\frac{81\times4.10+192\times1.30}{700}=\frac{332.4+250.4}{700}=83.3\%$$

和 standardization 相同。$S$ 是 discrete 时，两者是同一个式子的两种写法：$81\times\frac{357}{87}\big/700=\frac{357}{700}\times\frac{81}{87}$。Hernán 与 Robins 的 *Causal Inference: What If* 第 2 章把加权后的人群叫 pseudo-population：每个病人在里面出现两次，一次做 open surgery，一次做 PCNL（PCNL 组的 weight 是 1.32 和 4.29），在这个人群里 $A$ 和 $S$ independent，像做过一次 randomization。

::fig[thread-confounding-reweight] 动图：每个病人乘上 $1/e_a(s)$。两行的方块都变成 357 比 343 的宽度，方块里的 success rate 不变，右边的合计从 crude 的 78.0% 和 82.6% 变成 83.3% 和 77.9%。

$S$ 是 continuous 或者维数很高时，两种算法分开了：standardization 要一个 $r_a(s)$ 的 model，IPW 要一个 $e_a(s)$ 的 model。后面 offline RL 一节会看到，它们就是 off-policy evaluation 的 direct method 和 importance sampling。

### 两个前提

**Conditional exchangeability 无法用 data 检验。** 它说的是 $Y(a)$ 和 $A$ 的关系，而每个人的 $Y(a)$ 只看得到一个。如果 large stone 里医生专挑更大的那些做 open surgery，“large”这一层分得太粗，open surgery 仍然被低估，这是 [MIH1101 第 3 站](../courses/MIH1101.html#confound)说的 residual confounding。$S$ 里该放的是在 treatment 之前就已经定了、同时影响 $A$ 和 $Y$ 的 variable。Treatment 造成的 variable 不能放：它如果在 $A$ 到 $Y$ 的路上，是 mediator，放进去会把 effect 的一部分一起拿掉，[MIH1101 第 7 站](../courses/MIH1101.html#social)的例子里 RR 从 3.33 变成 2.5。

**Positivity：每一层都要有人接受每一种 treatment。** $P(s)>0$ 时必须 $e_a(s)>0$，否则 $r_a(s)$ 是对一个空集求平均，$1/e_a(s)$ 是除以 0。Operator 如果从没用 pinch 抓过 heavy object，“一律 pinch”的 success rate 在这份 log 里没有答案，data 再多也一样。

:::wrong 两组各 350 人，人数一样多，比较是公平的
Kidney stone 的两组正好都是 350 人。Adjustment formula 里，crude 和 causal 之差来自 weight $P(s\mid A=a)$ 和 $P(s)$ 之差，和组的大小无关：small stone 在 open surgery 组占 24.9%，在 PCNL 组占 77.1%，在全体占 51%。人数相同只让两个 rate 的 standard error 差不多，systematic 的差别一点没少。
:::

## 各门课里的名字和记号

| 课和站 | 这门课的名字 | treatment $A$ | 分层用的 $S$ | adjustment 在那里的样子 |
|---|---|---|---|---|
| [MIH1101 第 3 站](../courses/MIH1101.html#confound) | confounder、direct standardization、Simpson's paradox | 在 A 还是在 B | age group $k$ | $\sum_kw_k^{\text{std}}r_k$ |
| [MIH1101 第 7 站](../courses/MIH1101.html#social) | confounder 与 mediator、adjusted RR | employment grade | age；smoking 不能放 | 按 age 分层的 RR |
| [PL1101E 第 1、7 站](../courses/PL1101E.html#method) | IV、DV、confounding variable、regression to the mean | IV | 第三个 variable $Z$ | random assignment、wait-list control |
| [SC1101E 第 2、7 站](../courses/SC1101E.html#method) | selection、confounding、audit study | $X$ | $Z$ | 在一个 group 里比；配对后抽签 |
| [HY2259 第 4 站](../courses/HY2259.html#cause) | counterfactual、INUS condition | condition $C$ | 只有一个 unit | 只改一件事的 counterfactual |
| [ST2132 第 7 站](../courses/ST2132.html#test) | $H_0$、p-value | 两组 | 只管 chance | randomization distribution |
| [ST3131 第 3 站](../courses/ST3131.html#mlr) | omitted variable bias、FWL | $x_1$ | $x_2$ | multiple regression 的 $b_1$ |
| [CS3244 第 1 站](../courses/CS3244.html#gen) | $E_{\text{in}}$、$E_{\text{out}}$ | input 的一部分 | data distribution | importance weight |
| [MODERN-RL 第 5 站](../courses/MODERN-RL.html#offline)、[CS224R 第 1 站](../courses/STANFORD-CS224R.html#offline) | behavior policy、OOD action、stitching | action $a$ | state $s$ | $V^\pi$，即对 $d(s)\pi(a\mid s)$ 平均 $Q$ |

文献里的记号也不统一：

| 这里 | Holland 1986 | Hernán 与 Robins | Ding | offline RL |
|---|---|---|---|---|
| $A$ | $S(u)\in\{t,c\}$ | $A$ | $Z$ | action $a$ |
| $Y(a)$ | $Y_t(u)$、$Y_c(u)$ | $Y^a$ | $Y(1)$、$Y(0)$ | 做 $a$ 得到的 reward |
| $S$ | | $L$ | $X$ | state $s$ |
| $e_a(s)$ | | $\Pr[A=a\mid L=l]$ | | $\pi_\beta(a\mid s)$ |
| $r_a(s)$ | | $\Pr[Y=1\mid A=a,L=l]$ | | 一步时的 $Q(s,a)$ |

Holland 的 $S$ 是 treatment，这里的 $S$ 是分层用的 variable，对照时别弄混。

## MIH1101：standard population 与两种拆法

[MIH1101 第 3 站](../courses/MIH1101.html#confound)的 direct standardization 就是 adjustment formula：$S$ 是 age group，$r_a(s)$ 是 age-specific death rate。那一站取 A、B 年龄结构的平均 $(0.25,0.64,0.11)$ 当 standard；两个 population 一样大时，这正是合起来的 $P(s)$。

它往骨架上加的是：standard 可以任选，而选哪一个在骨架里各有含义。那一站把 crude 之差 $7.725-5.69=2.035$ 拆成“年龄结构项” 3.58 和“rate 项” $-1.545$。骨架的分解给出另一种拆法。把 A 当作 treated、B 当作 control：

$$\sum_kw_k^Ar_k^A-\sum_kw_k^Br_k^B=\underbrace{\sum_kw_k^A(r_k^A-r_k^B)}_{\text{ATT}}+\underbrace{\sum_k(w_k^A-w_k^B)\,r_k^B}_{\text{selection bias}}=-1.925+3.96$$

（第一项减去、第二项加上同一个 $\sum_kw_k^Ar_k^B$。）$\sum_kw_k^Ar_k^B=0.2\times1+0.65\times3+0.15\times50=9.65$ 是“A 的人按 B 的 age-specific rate 死”，即 $E[Y(\text{B})\mid\text{A}]$，MIH1101 那张表里“B 套用 A 的年龄结构”的 9.65 就是它。把 B 当作 treated，减去、加上的换成 $\sum_kw_k^Br_k^A$：

$$=\sum_kw_k^B(r_k^A-r_k^B)+\sum_k(w_k^A-w_k^B)\,r_k^A=-1.165+3.20$$

两种拆法取平均，$\tfrac12(-1.925-1.165)=-1.545$，$\tfrac12(3.96+3.20)=3.58$，正是 MIH1101 的两项。那一站的“年龄结构项”就是 selection bias，“rate 项”就是 effect，reference 取了两边的平均。拆出来的数随 reference 变，和那一站 `:::wrong` 里 standardized rate 随 standard 变是同一件事：用 A 的结构、用全体、用 B 的结构，分别对应 ATT、ATE、ATC，问的是三个不同的 population。

## PL1101E：random assignment、placebo 组与 regression to the mean

[PL1101E 第 1 站](../courses/PL1101E.html#method)给一个 correlation 列了三种 causal structure：X 影响 Y，Y 影响 X，第三个 variable Z 同时影响两者。在骨架里，后两种都落在 selection bias 那一项：身体已经在变差的人更容易停药，是 $Y(0)$ 低的人更常 $A=0$；在意健康的人按时吃药，是 $Z$ 同时决定了 $A$ 和 $Y(0)$。那一站“硬币不认识 Z”的论证，就是骨架里 $A\perp(Y(0),Y(1))$ 让这一项为 0。

**Placebo 组把 selection bias 单独量了出来。** 那一站 Coronary Drug Project 的表里，placebo 组按时吃和不按时吃的五年 mortality 是 15.1% 和 28.2%。糖片没有成分，两群人接受的是同一个 treatment，所以 $-13.1$ 个百分点完全是 $E[Y(0)\mid\text{adherent}]-E[Y(0)\mid\text{non-adherent}]$。Clofibrate 组按 adherence 比得到 $-9.6$，是“按时吃药的 effect”加上同一种 selection bias。Randomization 让两个 arm 的病人可比，这一项在 clofibrate 组里也该在 $-13$ 上下，绝对值比 9.6 还大，所以按 adherence 的比较里看不出药的作用。检验药效只能按抽签的 arm 比。

**Regression to the mean 是 before–after design 的 selection bias。** [PL1101E 第 7 站](../courses/PL1101E.html#clinical)的例子：一个人每天的心情分数 mean 50、standard deviation 10，相邻两天的 correlation $\rho=0.5$，他在分数低于 30 时求助，那些日子的平均是 26.3。拿治疗后减治疗前当 effect：

$$\bar Y_{\text{after}}-\bar Y_{\text{before}}=\underbrace{E[Y_{\text{after}}(1)-Y_{\text{after}}(0)\mid\text{求助}]}_{\text{treatment 的 effect}}+\underbrace{E[Y_{\text{after}}(0)\mid\text{求助}]-E[Y_{\text{before}}\mid\text{求助}]}_{\text{不治疗也会有的变化}}$$

第二项的 $Y_{\text{before}}$ 扮演了 control 组的角色，可它是按“低于 30”挑出来的，和 $Y_{\text{after}}(0)$ 不可比。

第二项可以算出来，用的是 [ST3131 第 1 站](../courses/ST3131.html#slr)的 regression line。两次分数近似 bivariate normal 时，$E[Y_{\text{after}}\mid Y_{\text{before}}=x]$ 是 $x$ 的 linear function，slope 是 $b_1=r\,s_y/s_x$，这里两个 standard deviation 相等，slope 就是 $\rho$：

$$E[Y_{\text{after}}(0)\mid Y_{\text{before}}=x]=50+0.5\,(x-50)$$

对“求助”的那些日子再取平均，由 law of total expectation，linear function 可以直接作用在平均值上：$50+0.5\times(26.3-50)=38.1$。第二项是 $38.1-26.3=11.9$ 分，什么也不做就有。Wait-list control 是从同样在低谷求助的人里随机留下一部分不治疗，它量的正是 $E[Y_{\text{after}}(0)\mid\text{求助}]$。

“Regression”这个词就是从这里来的。Galton 1886 年量了 205 对父母的 928 个成年子女，发现子女身高离 mean（他叫 mediocrity，68¼ inch）的偏差，平均只有 mid-parent（父亲和乘上 1.08 的母亲身高的平均）偏差的三分之二，他把这叫 regression towards mediocrity。ST3131 的 regression line 继承了这个名字。

::fig[thread-confounding-rtm] 动图：椭圆是两次分数的 distribution（$\rho=0.5$），点是 300 天的模拟。先按前一次低于 30 挑出那几天，它们后一次的平均是 38.1；再按后一次低于 30 挑，它们前一次的平均也是 38.1。

:::wrong Regression to the mean 是一种把极端值往中间拉的力量
把时间倒过来做同样的事：挑出后一次低于 30 的日子，前一次的平均同样是 $50+0.5\times(26.3-50)=38.1$。最糟那天的前一天也“好得多”，这里没有任何东西在拉。ST3131 第 1 站的 `:::wrong` 是同一个现象：height 高出 1 个 standard deviation 的人，weight 只被 predict 高出 $r=0.947$ 个；反过来用 weight 去 predict height，也只高出 0.947 个。只要两次测量的 correlation 小于 1，按其中一次挑出的极端值，在另一次上就平均靠近 mean。
:::

## SC1101E：在 group 里比，和配对之后抽签

[SC1101E 第 2 站](../courses/SC1101E.html#method)里 Durkheim 要分开 religion 和 education 两个 cause：Protestant 比 Catholic 受教育多，suicide rate 也高，只看这两个 group，两个 cause 永远一起出现。Prussia 的 Jew 的 illiteracy 和 Protestant 差不多，religion 却不同；他的 Table XVIII 里 Jew 在每一组都低于 Protestant。在骨架里这是取 $S$=education，在 education 相近的那一层里比 $A$=religion。Szelényi 说这就是今天 multivariate analysis 的逻辑，下面 ST3131 一节会看到 multiple regression 怎样把它做成公式。它只用了一层，而且 religion 本身不是可以分配的 treatment，所以它支持的是“education 解释不了这个差别”，不是 religion 的 effect 有多大。

[SC1101E 第 7 站](../courses/SC1101E.html#deviance)的 Pager audit study 把两个前提用 design 做了出来。四个 tester 按外貌、谈吐配成同 race 的两对，每一对里第一周由抽签定谁扮演“有 criminal record”的人，之后每周轮换，两个人扮演的次数一样多；每一对每周去哪 15 家雇主也是随机分的。取 $S$ 为“哪一对”，每一层里两个人各有一半的时间带着 record：positivity 由 design 保证，tester 自己的差别在两种身份之间抵消，雇主的差别由随机分配抵消。Callback 从 34% 降到 17%（white）、从 14% 降到 5%（Black）就是 record 这个 label 的 effect。Race 的比较没有这个保证：white 和 Black 的结果来自两对不同的人，Pager 自己列的限度“两对之间没量到的差别”正是没有被硬币消掉的 selection bias。

## HY2259：只有一个 unit 的时候

[HY2259 第 4 站](../courses/HY2259.html#cause)的第二个测试“没有它，war 就不会来吗”问的是一个 $Y(0)$：1914 年的 Europe 这一个 unit，在没有 Sarajevo 的那个世界里的 outcome。Fundamental problem 在这里没有退路。Statistics 的办法是换成 average，在很多 unit 上用 randomization 让 selection bias 为 0；history 只有一个 unit。

Holland 列了另一种办法，他叫 scientific solution：用别的 unit 或别的时间代替看不到的那个 potential outcome，前提是它们足够 homogeneous，这个前提无法检验。HY2259 的第一个测试正是这样做的：1905 年和 1911 年的两次 Moroccan crisis 里 alliance 和 war plan 都在，war 没有来，所以它们不是 sufficient 的。拿 1911 年代替 1914 年，靠的是两次之间别的 condition 没有本质的不同，historian 的争论往往就落在这一点上。

Holland 还要求 cause 是“本可以不同”的东西：每个 unit 的 treatment 必须可以取另一个值。他的例子是 schooling 可以是 cause，race 和 gender 这样的 attribute 不行。HY2259 的 counterfactual 第一条规则“只改一件当时确实可能不同的事”是同一个要求。Holland 又说 effect 总是相对另一个 cause 而言的，$Y_t(u)-Y_c(u)$ 必须先说清 $c$ 是什么；HY2259 说 causal claim 回答的总是“为什么是 $E$ 而不是 $E'$”，那是在 effect 一侧说同一件事。

**INUS condition 就是 epidemiology 的 component cause。** Rothman 与 Greenland 2005 年的文章把 cause 定义为疾病发生所必需的某个 antecedent，把 sufficient cause 定义为一组必然导致疾病的最小 condition，cause 只是其中一个 component。他们的 Table 1 给了每 100,000 person-year 的 rate：不吸烟不喝酒 1，只喝酒 3，只吸烟 4，两样都有 12。又吸烟又喝酒的人如果不吸烟，rate 是 3，所以他们的 12 个 case 里 9 个、75% 归 smoking；如果不喝酒是 4，8 个、67% 归 alcohol。加起来 142%，文章说这样的和“没有上限”。

把 12 个 case 按 mechanism 拆开就看得到原因（假定没有哪个 factor 起预防作用）：1 个是两样都不需要的 background，$3-1=2$ 个只需要 alcohol，$4-1=3$ 个只需要 smoking，剩下 $12-1-2-3=6$ 个两样都需要。Smoking 是 $3+6=9$ 个 case 的 necessary condition，alcohol 是 $2+6=8$ 个的；那 6 个被算了两次，两样都去掉能避免 $9+8-6=11$ 个，即 92%。在这 6 个 case 里 smoking 正是 Mackie 的 INUS condition：单独不 sufficient（还要 alcohol），是 {smoking, alcohol, …} 这一组里 necessary 的一员，这一组 sufficient 但不 necessary（还有别的 mechanism）。HY2259 里 assassination 的位置一模一样。[MIH1101 第 7 站](../courses/MIH1101.html#social)两个 factor 的 PAF 各 50%、joint 75%，多出来的 25% 是那 4 个需要两个 factor 同时在场的 case，也是同一种结构。

::fig[thread-confounding-pies] 动图：又吸烟又喝酒的人里每 100,000 person-year 的 12 个 case，颜色是它需要的 component。依次去掉 smoking、去掉 alcohol、两样都去掉，消失的 case 是 9、8、11 个。

所以 history 里“找不到 the cause”和 epidemiology 里“attributable fraction 加不到 100%”是同一个事实：一个 case 往往需要几个 component 同时在场，每一个都是 but-for 的 cause，case 没法在它们之间分配。Rothman 与 Greenland 那篇文章没有提 Mackie，这个对应是这里加的。

## ST2132：p-value 只管第三种对手解释

[SC1101E 第 2 站](../courses/SC1101E.html#method)给 correlation 列了三种对手解释：reverse causation、confounding、chance。[ST2132 第 7 站](../courses/ST2132.html#test)的 test 只处理最后一种。拿 grasp log 的 crude 比较做一次 two-sample $z$ test（pooled 的 success rate 是 $490/600=0.8167$）：

$$z=\frac{0.85-0.75}{\sqrt{0.8167\times0.1833\times\big(\tfrac1{400}+\tfrac1{200}\big)}}=\frac{0.10}{0.0335}=2.98,\qquad\text{two-sided p-value}=0.0028$$

“Pinch 显著比 power 好”，而这个结论是反的。$H_0$ 说的是两组的 $P(Y\mid A)$ 相同，它被正确地 reject 了；两组确实不同，只是不同在 selection bias 上。Selection bias 是 systematic 的，log 再收十倍，p-value 只会更小，结论更“显著”地错。

**Randomization 给 p-value 一个来源。** ST2132 的 p-value 来自一个 model：$X\sim\text{Binomial}$，或者 i.i.d. 的 normal。在 randomized experiment 里，probability 可以直接来自硬币。Lab 想确认 heavy object 上哪种 primitive 好，取 8 个 heavy object，抽签让 4 个用 power、4 个用 pinch，每个试 10 次，成功次数是

| | 4 个 object 各试 10 次的成功次数 |
|---|---|
| power | 9、7、8、6 |
| pinch | 5、3、6、4 |

两组平均差 $7.5-4.5=3.0$。Sharp null $H_0$：对每一个 object，$Y_i(\text{power})=Y_i(\text{pinch})$，用哪种 grasp 都是这个成绩。在 $H_0$ 下，不管硬币怎么落，这 8 个数都不变，唯一 random 的是哪 4 个被标成 power。$\binom84=70$ 种标法等可能，每一种给出一个平均差，这 70 个数就是 test statistic 在 $H_0$ 下的 exact distribution。其中不小于 3.0 的有 2 种（两个 6 分的 object 换一下，差不变），所以

$$\text{p-value}=\frac{2}{70}=0.029$$

这里没有用到 normal，也没有假定 object 是从某个 population 里 i.i.d. 抽来的。这叫 Fisher randomization test，Ding 的 *A First Course in Causal Inference* 第 3 章写成 $p_{\text{FRT}}=M^{-1}\sum_{m=1}^MI\{T(z^m,Y)\ge T(Z,Y)\}$，$M=\binom{n}{n_1}$。同样的 8 个数做 [ST2132 第 8 站](../courses/ST2132.html#lrt)的 two-sample $t$ test，$t=3.29$，6 个 degrees of freedom，one-sided p-value 是 0.0083，比 70 种标法里最极端的那一种的 probability $1/70=0.014$ 还小：这个数来自 normal model，design 本身只支持到 $1/70$。

::fig[thread-confounding-frt] 动图：同一组 8 个成绩，一次换一种 power 与 pinch 的标法，下面的点就是那种标法给出的平均差。70 个点堆起来是 $H_0$ 下的 distribution，实际的标法在最右端。

## ST3131：omitted variable bias 是 selection bias，regression 自己挑了 standard

[ST3131 第 3 站](../courses/ST3131.html#mlr)有一个 identity：只对 $x_1$ 做 simple regression 的 slope，等于 multiple regression 里的 $b_1$ 加上 $b_2d$，$d$ 是 $x_2$ 对 $x_1$ 的 slope。把 grasp log 的 600 行拿来做 regression：$Y\in\{0,1\}$，$A=1$ 表示 power，$S=1$ 表示 heavy。$Y$ 对 binary 的 $A$ 做 simple regression，slope 就是 crude difference $0.75-0.85=-0.10$；$S$ 对 $A$ 的 slope 是 $d=P(\text{heavy}\mid\text{power})-P(\text{heavy}\mid\text{pinch})=0.8-0.1=0.7$。Least squares 给出 $\hat y=0.888+0.168A-0.382S$，

$$-0.10=0.168+(-0.382)\times0.7$$

结构和骨架的分解一样：crude 等于一个 adjust 过的数，加上“$S$ 在两组之间差多少”乘“$S$ 本身有多大作用”。

可是 0.168 既不是 ATE（13.3 个百分点），也不是 ATT（power 组的构成，25.0 个百分点）或 ATC（pinch 组的构成，7.5 个百分点）。它用的是哪个 standard？用 FWL theorem：$b_A$ 等于 $Y$ 对“$A$ 去掉 $(1,S)$ 能解释的部分”的 slope（proof 在 ST3131 那一站；它就是 normal equations 的 Schur complement，见 [least squares 线](../threads/least-squares.html)的 CS4277 一节）。$S$ 是 binary，$A$ 对 $(1,S)$ 的 fitted value 就是每层的比例 $e_s$（light 0.1，heavy 0.8），residual 是 $A_i-e_{s_i}$，所以

$$b_A=\frac{\sum_i(A_i-e_{s_i})\,Y_i}{\sum_i(A_i-e_{s_i})^2}$$

在有 $n_s$ 个 unit 的第 $s$ 层里，$A=1$ 的 $n_se_s$ 个 unit 贡献 $(1-e_s)Y_i$，$A=0$ 的 $n_s(1-e_s)$ 个贡献 $-e_sY_i$：

$$\sum_{i\in s}(A_i-e_s)\,Y_i=(1-e_s)\,n_se_s\,\bar y_{1s}-e_s\,n_s(1-e_s)\,\bar y_{0s}=n_se_s(1-e_s)\,(\bar y_{1s}-\bar y_{0s})$$

$$\sum_{i\in s}(A_i-e_s)^2=n_se_s(1-e_s)^2+n_s(1-e_s)\,e_s^2=n_se_s(1-e_s)$$

所以 $b_A$ 是各层 effect $\tau_s=\bar y_{1s}-\bar y_{0s}$ 的加权平均，weight 是 $n_se_s(1-e_s)$。Light：$400\times0.1\times0.9=36$，heavy：$200\times0.8\times0.2=32$，

$$b_A=\frac{36\times0.05+32\times0.30}{68}=0.168$$

Regression 隐含的 standard 是 $n_se_s(1-e_s)$：treatment 越接近一半对一半的层，weight 越大。这个结论来自 Angrist 1998。各层 effect 相同时 weight 无关紧要；kidney stone 的两层 effect 是 6.4 和 4.3 个百分点，regression 给 5.38，ATE 是 5.37，差不多；grasp log 的两层是 5 和 30，差别就出来了。

:::wrong 把 confounder 放进 regression，treatment 的 coefficient 就是 average treatment effect
上面算出来是 16.8 个百分点，ATE 是 13.3。要得到 ATE，让每层有自己的 effect：加上 interaction，$\hat y=0.9+0.05A-0.5S+0.25AS$（[ST3131 第 7 站](../courses/ST3131.html#factor)的 model），light 层的 effect 是 0.05，heavy 层是 $0.05+0.25=0.30$，再按 $P(s)$ 平均：$0.05+0.25\times\tfrac13=0.133$。这一步就是 standardization 用 regression 写出来。
:::

## CS3244：$E_{\text{out}}$ 是在哪个 distribution 下算的

[CS3244 第 1 站](../courses/CS3244.html#gen)把 $E_{\text{out}}$ 定义为对“产生 data 的那个 distribution”取 expectation。Grasp log 的 distribution 是 $P(s)\,\pi_\beta(a\mid s)\,P(y\mid s,a)$。只用 primitive 去 predict success，最小化 squared error 得到的 $f(a)$ 收敛到 $E[Y\mid A=a]$，即 85% 和 75%。在 log 的 distribution 下，它是只看 $a$ 的 predictor 里 $E_{\text{out}}$ 最小的那个，没有任何 overfitting。

部署“一律 pinch”之后，distribution 变成 $P(s)\,\mathbb 1\{a=\text{pinch}\}\,P(y\mid s,a)$，pinch 的 success rate 是 73.3%，$f$ 说 85%。从 $f$ 的角度看，$P(Y\mid A)$ 变了，是 [HARVARD-CS249R 第 7 站](../courses/HARVARD-CS249R.html#ops)那张表里的 concept drift。换成同时看 $s$ 的 $f(s,a)=r_a(s)$：换 policy 只改变哪些 $(s,a)$ 出现、出现多少，一次 grasp 做下去之后会怎样，$P(y\mid s,a)$ 不变，变的只有 $P(s,a)$，是 covariate shift。把 confounder 放进 input，决策带来的 concept drift 就变成了 covariate shift。Bottou 讲这个 kidney stone 例子时说的也是这一点：按 stone 大小分开的表更接近真相，前提是 outcome 只取决于病人的情况和所做的 procedure，并且这个关系在选 treatment 的方式改变时保持不变。

在 log 上估计部署之后的 $E_{\text{out}}$，要给每一行乘上 importance weight $\frac{P(s)\pi(a\mid s)}{P(s)\pi_\beta(a\mid s)}=\frac{\pi(a\mid s)}{\pi_\beta(a\mid s)}$。$\pi$ 是“一律 pinch”时，它是 $\mathbb 1\{a=\text{pinch}\}/e_{\text{pinch}}(s)$，正是骨架里 IPW 的 weight。这个 weight 的 variance 怎样随 $\pi$ 和 $\pi_\beta$ 的差别变大，见 [Monte Carlo 线](../threads/monte-carlo.html)。

## Offline RL：behavior policy 就是 treatment 的分配方式

### 一步：direct method 与 importance sampling

Grasp log 是一步的 RL，也叫 contextual bandit：state $s$ 是 object 的类别，action $a$ 是 primitive，reward 是 success。Operator 是 behavior policy，$\pi_\beta(\text{power}\mid\text{light})=0.1$，$\pi_\beta(\text{power}\mid\text{heavy})=0.8$，就是骨架里的 propensity。在 log 上 regress 出来的 $Q(s,a)$ 是 $r_a(s)$，一个新 policy 的 value

$$V^\pi=\sum_sP(s)\sum_a\pi(a\mid s)\,Q(s,a)$$

是 adjustment formula，只是 treatment 换成了 policy。Dudík、Langford 与 Li 2011 年讲 off-policy evaluation 时列了三个 estimator。Direct method $\hat V_{\text{DM}}=\frac1n\sum_i\hat Q(s_i,\pi(s_i))$ 是 standardization。Inverse propensity score $\hat V_{\text{IPS}}=\frac1n\sum_ir_i\,\mathbb 1\{\pi(s_i)=a_i\}/\hat\pi_\beta(a_i\mid s_i)$ 是 IPW，他们追溯到 survey sampling 的 Horvitz 与 Thompson 1952。Doubly robust 把两者合起来，$\hat Q$ 和 $\hat\pi_\beta$ 有一个准就 unbiased，他们引的出处是 statistics 里处理 incomplete data 的工作（Cassel 等 1976、Robins 等 1994）。“一律 power”：

$$\hat V_{\text{DM}}=\tfrac23\times0.95+\tfrac13\times0.70=0.867,\qquad\hat V_{\text{IPS}}=\frac{38/0.1+112/0.8}{600}=\frac{380+140}{600}=0.867$$

Tabular、$\hat\pi_\beta$ 取 log 里的比例时两者恒等，和 kidney stone 一样。$\hat Q$ 是一个 smooth 的 model、或者 $\pi_\beta$ 是已知的真值时才分开。那篇文章的说法是 DM 的 bias 来自 reward model，IPS 的 variance 来自 $\pi_\beta$ 小的地方：light 上 power 的 38 次成功，每一次的 weight 是 10。Optimal policy 在每个 state 取 $\arg\max_aQ(s,a)$，两类 object 都是 power，value 86.7%；照 crude 挑的是 73.3%。

### Markov state 就是 conditional exchangeability

State fully observed 时，behavior policy 只根据 $s$（加上它自己的 randomness）选 $a$，所以给定 $s$，$a$ 和之后会发生什么 independent：$E[r\mid s,a]=E[r(a)\mid s]$。$Q(s,a)$ 是 conditional on $s$ 的，自动就做了 adjustment，这是 Q-learning 从 offline data 学的时候不用另外处理 confounding 的原因。

坏在 operator 看到的比 log 记下的多。假如 log 只存了 camera image，满的和空的 bottle 看上去一样，operator 拿起来之前就知道哪个是满的。Log 里的 $s$ 不含 weight，$Q(\text{image},a)$ 学到的就是 crude 的 85% 和 75%，policy 学会一律 pinch，data 越多只是越准确地学错。这时 log 里的 $s$ 只是 [CS4246 第 3 站](../courses/CS4246.html#pomdp)的 observation，不是 Markov state。补救要么是把 operator 用到的信息记下来（加一个 weight sensor），要么是让一部分 grasp 随机选 primitive，用 design 换来 exchangeability 和 positivity。

### 放进 input 的东西多了，也会坏

De Haan、Jayaraman 与 Levine 2019 年的 causal confusion 讲的是反方向。Behavior cloning 学开车，一个 model 看得到整个画面，包括 dashboard；另一个把 dashboard 遮住。两个的 training loss 都很低，只有遮住的那个开得好。Dashboard 上的 brake light 在踩刹车时亮，看得到它的 model 学会了“灯亮就刹车”：灯是上一步 action 的结果，action 前后相关，它就成了预测这一步 action 的好 feature。

::fig[thread-confounding-brake] 左边是 policy 看到的画面，右边是背后的 causal graph。Brake light 是 $A^{t-1}$ 的结果；expert 刹车是因为 pedestrian。Model 用 brake light 也能把 training loss 压低，部署之后它自己的 action 决定灯亮不亮，这条路就断了。

在骨架里，这是把一个由 treatment 造成的 variable 放进了 $S$。论文的观察是“信息多反而更差”：Pong 里 confounded 的 policy validation loss 更低、reward 也更低；他们引的 GTA-V driving 工作里，带 history 的 policy validation perplexity 更好（0.834 对 0.989），需要人 intervene 的次数却更多（2.94 对 1.30）。Validation loss 是 expert 的 distribution 下的 $E_{\text{out}}$，部署时 distribution 由 policy 自己的 action 决定，上一节的问题又出现了。论文的办法是 targeted intervention：在候选 policy 自己走出来的 state 上问 expert，或者直接执行候选 policy、按 return 打分。两种都要在 policy 自己产生的 data 上拿 feedback，这时 brake light 反映的是 policy 自己上一步的 action，依赖它的那个 model 就露了出来。

### Positivity 就是 data 的 support

[MODERN-RL 第 5 站](../courses/MODERN-RL.html#offline)的例子：一个 state，data 里的 action 都在 $[-0.3,0.3]$，cubic 的 Q 外推到 $a=1$ 是 3.96，真实值是 0。在骨架里这是 positivity 不成立：$\pi_\beta(a=1)=0$，$r_a(s)$ 在这里没有定义，什么值都和 data 一样吻合。那一站和 [CS224R 第 1 站](../courses/STANFORD-CS224R.html#offline)的几种办法里，CQL 把 data 以外的 Q 往下压，IQL 和 AWR 只在 data 里出现过的 action 上算 loss，都是让 policy 留在 $\pi_\beta>0$ 的地方，也就是 adjustment formula 有定义的范围里。MODERN-RL 那一站引 CS285 第 17 讲，把 offline RL 的难处叫 counterfactual query，问的就是 data 里没出现过的 potential outcome。

::fig[thread-confounding-support] 动图：operator 越来越少用 pinch 抓 heavy object。那一格从 40 次缩到 10 次、2 次、0 次，那几次 grasp 的 IPS weight 从 5 变成 20、100、无穷，“一律 pinch”的 95% interval 从 ±0.055 变宽到 ±0.103、±0.227，最后没有 estimate。

Interval 是 $\hat V=\tfrac23\hat r_{\text{pinch}}(\text{light})+\tfrac13\hat r_{\text{pinch}}(\text{heavy})$ 的 $\pm1.96$ 个 standard error，$P(s)$ 当作已知，heavy 那一格的 variance 是 $0.4\times0.6/n$：$n=40$ 时 standard error 是 $\sqrt{\tfrac49\cdot\tfrac{0.09}{360}+\tfrac19\cdot\tfrac{0.24}{40}}=0.0279$。

### 多步：Bellman equation 就是 g-formula

多步时 treatment 是一整个 policy，而第二步的 state 是第一步 action 的结果。Hernán 与 Robins 第 21 章处理 time-varying treatment 用的是 g-formula，两个时间点时

$$E[Y^{a_0,a_1}]=\sum_lE[Y\mid A_0=a_0,L_1=l,A_1=a_1]\,f(l\mid a_0)$$

先按 $a_0$ 之下中间 variable $L_1$ 的 distribution 加权，再在每个 $l$ 上取第二步的 treatment。成立要 sequential exchangeability 和 sequential positivity：每一步给定过去，treatment 和之后的 potential outcome 无关，且 policy 要走的 action 在每一步都有人走过。把 $L_1$ 换成下一个 state $s'$，把 $E[Y\mid\cdots]$ 换成 reward 加之后的 value，就是 policy evaluation 的 Bellman equation（[Bellman 线](../threads/bellman.html)）：

$$V^\pi(s)=\sum_a\pi(a\mid s)\Big[r(s,a)+\gamma\sum_{s'}P(s'\mid s,a)\,V^\pi(s')\Big]$$

Markov 的结构让 g-formula 每一步只需要看当前的 state。

CS224R 第 1 站的 grid 正好是 sequential positivity 的例子。要评估的 $\pi$ 在 s1 往右、在 s5 往下。G-formula 把四段 transition 串起来：s1 往右到 s2、s2 到 s5 取自 $\tau_A$，s5 往下到 s8、s8 到 s9 取自 $\tau_B$，return 是 $\gamma^3=0.729$。Data 里没有一条 trajectory 是照 $\pi$ 走的，每一段都在某条 trajectory 里出现过，$\pi$ 在 s1 和 s5 的 action 也都有 $\pi_\beta=0.5$。这就是 stitching。AWR 用的 Monte Carlo return 是 $\tau_A$ 在 (s1, 往右) 之后实际发生的事，s5 那一步跟的是 $\pi_\beta$，所以它估的是“往右、之后照 $\pi_\beta$”的 potential outcome，$Q^{\pi_\beta}(\text{s1},\rightarrow)=-0.0405$，不是“往右、之后照 $\pi$”的 0.729。

一步时 $P(s)$ 和 policy 无关；多步时 state 的 distribution 本身也是 policy 的 outcome。[RB4301 第 5 站](../courses/RB4301.html#bc)里 behavior cloning 的 cost 按 $T^2$ 增长，就是 learner 的 $d^{\pi}(s)$ 离开 expert 的 $d^{\pi_\beta}(s)$ 的代价；DAgger 让 expert 在 learner 自己走到的 state 上补 label，补的正是 positivity 缺掉的那部分 support。

:::from
骨架的顺序（potential outcome、crude difference 的分解、randomization、adjustment formula、IPW、两个前提）是为这条线安排的。读过的外部材料：Hernán 与 Robins, *Causal Inference: What If*，读了第 2 章（exchangeability、conditional exchangeability、Table 2.2、standardization 与 IP weighting 的公式和等价、Technical Point 2.3 的 positivity）和第 19 至 21 章开头的转述（g-formula、sequential exchangeability 与 sequential positivity），读的是抓取工具的逐段转述，不是原文逐字；Holland, Statistics and Causal Inference, *JASA* 1986 的第 3 节（Fundamental Problem、statistical 与 scientific solution、randomization 的作用、cause 与 attribute、“relative to another cause”）；Ding, *A First Course in Causal Inference* 第 1.3 节（kidney stone 与 Simpson's paradox）和第 3 章（Fisher randomization test 与 $p_{\text{FRT}}$）；Bottou 的 Confounding and Simpson's paradox 页面（kidney stone 的数字、出处 Charig 等 1986、“outcome 与 procedure 的关系在选择方式改变时不变”的前提），Charig 等的原文没有读；Dudík、Langford 与 Li, Doubly Robust Policy Evaluation and Learning（2011）第 1 至 3 节（DM、IPS、DR 的公式和 bias 分析）；de Haan、Jayaraman 与 Levine, Causal Confusion in Imitation Learning（2019）的前 4 节（brake light、Pong 与 GTA-V 的数字、两种 intervention）；arXiv 2403.03299（Demystifying and avoiding the OLS “weighting problem”）对 Angrist 1998 的 conditional variance weight 的陈述，Angrist 的原文没有读；Rothman 与 Greenland, Causation and Causal Inference in Epidemiology（*AJPH* 2005）（cause、sufficient cause、component cause 的定义，Table 1，“没有上限”）；Galton 1886 的 York 大学排版本（三分之二、68¼ inch、205 对父母与 928 个子女）。Kitagawa 分解与 ATT、ATC 的对应、$b_A$ 的 weight 由 FWL 的推导、INUS 与 component cause 的对应、Bellman equation 与 g-formula 的对应、stitching 与 sequential positivity 的对应、concept drift 与 covariate shift 的说法，是自己推的。Grasp log、8 个 object 的 randomized experiment 是为这一页构造的；所有数字（standardization、IPW、regression、$z$ 与 $t$、70 种标法、interval）用 python 实算。Doubly robust 的出处（Cassel 等 1976、Robins 等 1994）和 IPS 追溯到 Horvitz 与 Thompson 1952，都只来自 Dudík 等人的引用，原文没有读。
:::
