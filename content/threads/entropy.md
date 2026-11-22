---
title: 多付的 bit
lead: "按 q 设计的 code 去存来自 p 的 data，每个 token 平均多付 D(p‖q) 个 bit。Huffman code、decision tree 的 information gain、MLE 与 likelihood ratio test、logistic regression 和 LLM 的 cross-entropy loss、EM 与 VAE 的 ELBO、RLHF 的 KL penalty，算的都是这笔账的某一项。"
line: ml
---

一个 tokenizer 只会输出三个 token：a、b、c。要把它产生的一长串 token 存下来，越省 bit 越好。真实的 frequency 是 $p=(0.5,0.3,0.2)$，存的人不知道，手里有三个候选 model：uniform 的 $u=(\tfrac13,\tfrac13,\tfrac13)$，偏向 a 的 $q_2=(0.6,0.3,0.1)$，和恰好等于 $p$ 的那个。

先试最自然的评分：每一步让 model 猜下一个 token，数猜对的比例。三个 model 的 argmax 都是 a（uniform 的平局按 a 算），每一步都猜 a，accuracy 都是 0.5，分不出高下。存储的账单却分得出。

账单这样算（arithmetic coding）。把 $[0,1)$ 按 model 的 $q$ 切成三段：a 占 $[0,q(a))$，b 占接下来长 $q(b)$ 的一段，c 占最后一段。来一个 token，就走进它那一段，再把这一段按同样的比例切开，等下一个 token。$n$ 个 token 之后剩下一个长 $L=\prod_iq(x_i)$ 的 interval，不同的 token 串对应互不相交的 interval。要告诉对方是哪一个，只需发一个落在里面的 binary fraction：取 $k=\lceil\log_2(1/L)\rceil+1$，则 $2^{-k}\le L/2$，长 $L$ 的 interval 里一定整个装得下某一段 $[j2^{-k},(j+1)2^{-k})$：取 $j=\lceil2^k\cdot\text{左端点}\rceil$，这一段的左端离 interval 的左端点不到 $2^{-k}$，右端离它不到 $2\cdot2^{-k}\le L$。发出 $j$ 的 $k$ 位 binary，以这 $k$ 位开头的任何 binary fraction 都还在这个 interval 里，所以不同 token 串的 codeword 互不为 prefix，对方读完就能断开。长度不超过 $\log_2(1/L)+2$ bit。

::fig[thread-entropy-arith] 动图：每来一个 token，interval 走进对应的那一段（深色），下一行是这一段放大后再按 $q$ 切开。第一帧是 5 个 token 都编完的样子。

左边 $L=0.5\times0.3\times0.5\times0.2\times0.5=0.0075$，$\log_2(1/L)=7.06$；落在 $[0.31,0.3175)$ 里的最短 binary fraction 是 $0.01010000_2=0.3125$，它那一段 $[0.3125,0.3164)$ 整个在里面，codeword 是 8 bit。右边 $L=3^{-5}$，$\log_2(1/L)=7.92$，codeword 是 001000110，9 bit。串越长，那至多 2 bit 的零头摊到每个 token 上越可以忽略，账单就是

$$\sum_{i=1}^n\log_2\frac1{q(x_i)}$$

于是有四个问题：平均每个 token 付多少；有没有 model 能付得更少；用错 model 多付了多少；不知道 $p$、只有一批 data 时该选哪个 $q$。四个答案是这条线上每一门课共用的骨架的前一半。后一半被另一个问题逼出来：要 model 去做 data 之外的事（拿高 reward、解释一个 observation），又不许它离原来的 model 太远。下面先把两半推完，再用一张表对齐各课的名字和记号，逐门课看它往骨架上加了什么，最后是课程页里没有说破的六座桥。

## 骨架一：用 q 存 p 的 data

### 一个 code 就是一个 distribution

Arithmetic coding 里，token $x$ 让 interval 缩成 $q(x)$ 倍，$\log_2(1/L)$ 就加上 $\log_2(1/q(x))$：这是 $x$ 的 code length。逐个 token encode 的 code 也一样。[CS3236 第 4 站](../courses/CS3236.html#symbol)的 Kraft inequality 说，prefix-free code 的 codeword length 满足 $\sum_x2^{-\ell(x)}\le1$，所以 $q(x)=2^{-\ell(x)}$ 加起来不超过 1，$\ell(x)=\log_2(1/q(x))$；反过来，任给 $q$，$\ell(x)=\lceil\log_2(1/q(x))\rceil$ 满足 Kraft inequality，有一个 prefix-free code 用这组 length。设计 code 和选一个 distribution 是同一件事。差别只在 symbol code 的 length 必须是 integer，CS3236 第 4 站的 proof 说明这至多多付 1 bit；arithmetic coding 把这个零头摊给了整串。

### 平均每个 token 付 H(p, q)

Token 按 $p$ 出现，每个 token 的 code length 是 random variable $\log_2(1/q(X))$，它的 expectation 叫 cross-entropy：

$$H(p,q)=\mathbb E_{X\sim p}\Big[\log_2\frac1{q(X)}\Big]=\sum_xp(x)\log_2\frac1{q(x)}$$

Uniform 给每个 token $\log_23=1.585$ bit，$H(p,u)=1.585$。$q_2$ 给 a、b、c 的 code length 是 0.737、1.737、3.322 bit，$H(p,q_2)=0.5\times0.737+0.3\times1.737+0.2\times3.322=0.368+0.521+0.664=1.554$。$q=p$ 的 code length 是 1、1.737、2.322 bit，$H(p,p)=0.5+0.521+0.464=1.485$，这个数是 $p$ 的 entropy $H(p)$（[CS3236 第 1 站](../courses/CS3236.html#entropy)）。

把每个 code length 拆成两项，$\log\frac1{q(x)}=\log\frac1{p(x)}+\log\frac{p(x)}{q(x)}$，对 $p$ 取 expectation：

$$H(p,q)=H(p)+D(p\|q),\qquad D(p\|q)=\sum_xp(x)\log\frac{p(x)}{q(x)}$$

$D(p\|q)$ 是 KL divergence，读作“按 $q$ 设计、实际来的是 $p$，每个 token 多付的 bit”。核对：$D(p\|u)=1.585-1.485=0.099$，$D(p\|q_2)=1.554-1.485=0.068$。

::fig[thread-entropy-gibbs] 动图：$q$ 从 uniform 一步步移到 $p$，再越过 $p$ 移向 $(0.8,0.15,0.05)$。左边每个 token 下面是它此刻的 code length；右边灰色的 $H(p)$ 不动，彩色的 $D(p\|q)$ 在 $q=p$ 时缩到 0，越过之后又变长。

### Gibbs inequality：没有 q 付得比 H(p) 少

两个例子里 $D$ 都是正的。如果有一个 $q$ 让它为负，就有 model 能付得比 $H(p)$ 少，entropy 就不是 compression 的 limit 了。

**Gibbs inequality.** $D(p\|q)\ge0$，等号当且仅当 $q=p$。

Proof 只用 $\ln t\le t-1$（$t>0$，等号当且仅当 $t=1$）：$\phi(t)=t-1-\ln t$ 的 derivative $1-1/t$ 在 $t<1$ 时为负、$t>1$ 时为正，所以 $\phi(t)\ge\phi(1)=0$。记 $S=\{x:p(x)>0\}$，用 nat 算（换成 bit 只是除以 $\ln2$，sign 不变）：

$$-D(p\|q)=\sum_{x\in S}p(x)\ln\frac{q(x)}{p(x)}\le\sum_{x\in S}p(x)\Big(\frac{q(x)}{p(x)}-1\Big)=\sum_{x\in S}q(x)-1\le0$$

第一个 $\le$ 对每一项用 $\ln t\le t-1$，取等要每个 $x\in S$ 都有 $q(x)=p(x)$；第二个 $\le$ 是因为 $q$ 在 $S$ 上的和不超过 1，取等要 $q$ 在 $S$ 外为 0。两处的 slack 各有意义，第 6 座桥会用到。

两个 corollary。第一，$H(p)$ 是任何 $q$ 的平均账单的 lower bound，只有用对了 distribution 才达到。第二，$p(x)>0$ 而 $q(x)=0$ 时 $D(p\|q)=\infty$：$q$ 没给 $x$ 留 codeword，$x$ 一来就编不出来。所以 model 不必猜中哪个 token 最可能，却必须给每个会出现的 token 留一点 probability。

:::wrong 每一步都把最可能的 token 排第一，model 就和真 distribution 一样好
$q_4=(0.99,0.005,0.005)$ 的 argmax 也是 a，accuracy 同样是 0.5。可是 b、c 各要 $\log_2200=7.64$ bit：$H(p,q_4)=0.5\times0.0145+0.5\times7.644=3.83$ bit，是 uniform 的 2.4 倍。Accuracy 只看 argmax；cross-entropy 看 model 给实际发生的 token 留了多少 probability，过度自信在前者里看不出，在后者里罚得很重。
:::

### 手里只有 data：MLE 就是在 data 上省 bit

$p$ 不知道。昨天的 1000 个 token（按 $p$ 用 numpy `default_rng(0)` 抽）里 a、b、c 各有 473、315、212 个，empirical distribution $\hat p=(0.473,0.315,0.212)$。按 $q$ 存昨天这批 data，把相同的 token 归到一起：

$$\sum_{i=1}^n\log_2\frac1{q(x_i)}=\sum_xn\hat p(x)\log_2\frac1{q(x)}=n\,H(\hat p,q)=n\big[H(\hat p)+D(\hat p\|q)\big]$$

这是精确的 identity，没有用到 law of large numbers。$H(\hat p)$ 与 $q$ 无关，所以让 data 上的账单最小，就是让 $D(\hat p\|q)$ 最小，由 Gibbs inequality 答案是 $q=\hat p$，账单是 $nH(\hat p)=1510.3$ bit。

账单取负号、乘 $\ln2$，就是 log-likelihood $\sum_i\ln q(x_i)$。所以 maximum likelihood 和“在 data 上省 bit”是同一个 optimization，对任何一族 $q_\theta$ 都成立：

$$\hat\theta_{\text{MLE}}=\arg\max_\theta\sum_{i=1}^n\ln q_\theta(x_i)=\arg\min_\theta D(\hat p\|q_\theta)$$

$q_\theta$ 能取遍所有 distribution 时，MLE 就是 frequency $\hat p$。[ST2132 第 2 站](../courses/ST2132.html#est)的 Bernoulli $\hat p=\bar x$、[CS4248 第 2 站](../courses/CS4248.html#ngram)的 bigram count 之比，那两处分别用 derivative 和 Lagrange multiplier 求出，这里一个 derivative 也不用。Data 是 continuous 时 $\hat p$ 没有 density，$H(\hat p)$ 没有 definition，第二个等号不再成立；但 $n\to\infty$ 时 $\frac1n\sum_i\ln q_\theta(x_i)\to\mathbb E_p[\ln q_\theta(X)]=-H(p)-D(p\|q_\theta)$，MLE 照样在 minimize $D(p\|q_\theta)$，这是 [CORNELL-CS5788 第 1 站](../courses/CORNELL-CS5788.html#mle)的论证。

拿 $\hat p$ 去存今天的 1000 个 token 用了 1467.6 bit，用真的 $p$ 是 1460.4 bit。平均每个 token 多付的 $D(p\|\hat p)=0.0021$ bit，是只见过 1000 个 sample 的代价。Data 少时某个 token 可能一次也没出现，$\hat p(x)=0$，它在今天一出现账单就是 infinite：[CS4248 第 2 站](../courses/CS4248.html#ngram)里“I do not like ham”的 probability 为 0、perplexity 是 infinite，就是这件事；smoothing 是给每个 token 都留一个 codeword。

从这里起换成 nat：ML 的课一律用 $\ln$，$1\text{ nat}=1/\ln2=1.443$ bit。Cross-entropy loss 是 data 上平均每个 token 的 $-\ln q(x_i)$，即按 nat 计的 $H(\hat p,q)$；perplexity $e^{\text{loss}}$ 等于 $2^{\text{每个 token 的 bit 数}}$。

## 骨架二：离 reference 不远的最好的 q

### 两个看起来不同的问题

把 fit 好的 model 记作 $\pi_{\text{ref}}=(0.5,0.3,0.2)$（取 $\hat p\approx p$，这也正是 [CS4248 第 8 站](../courses/CS4248.html#post)例子里的 reference）。现在要它多输出 reward 高的 token，$r=(0,1,2)$。只最大化 $\mathbb E_\pi[r]$，答案是 $\pi=(0,0,1)$。用骨架一的话说，这个 $\pi$ 在 $\pi_{\text{ref}}$ 的 code 下照样编得出（$D(\pi\|\pi_{\text{ref}})=\ln5=1.609$ nat），可是反过来 $D(\pi_{\text{ref}}\|\pi)=\infty$：新 model 不再给 a、b 任何 codeword，从 data 里学到的东西只剩一个 token。需要折中，最常用的是

$$\max_q\ \mathbb E_q[r]-\beta\,D(q\|\pi_{\text{ref}})$$

另一个问题来自 latent variable model（[CORNELL-CS5788 第 2 站](../courses/CORNELL-CS5788.html#vae)）：$p(x)=\sum_zp(z)\,p(x\mid z)$，$z$ 的取值太多，sum 算不出。要一个能用 sample 估计的 $\ln p(x)$ 的 lower bound，和一个接近 posterior $p(z\mid x)$ 的 $q$。两个问题是同一个 identity。

### 一个 identity

任取一个 distribution $p_0$ 和一个 function $f$，令

$$Z=\sum_xp_0(x)\,e^{f(x)},\qquad q^*(x)=\frac{p_0(x)\,e^{f(x)}}{Z}$$

$q^*$ 是一个 distribution。对任何 $q$：

$$\mathbb E_q[f]-D(q\|p_0)=\sum_xq(x)\Big[f(x)-\ln\frac{q(x)}{p_0(x)}\Big]=\sum_xq(x)\ln\frac{p_0(x)\,e^{f(x)}}{q(x)}=\sum_xq(x)\ln\frac{Z\,q^*(x)}{q(x)}$$

第一个等号是 $D$ 的 definition，第二个把 $f(x)=\ln e^{f(x)}$ 并进 log，第三个用 $p_0e^f=Zq^*$。把 $\ln Z$ 拆出来（$\sum_xq(x)=1$）：

$$\mathbb E_q[f]-D(q\|p_0)=\ln Z-D(q\|q^*)$$

由 Gibbs inequality，左边对所有 $q$ 都不超过 $\ln Z$，只在 $q=q^*$ 时取到。

代进例子：$p_0=\pi_{\text{ref}}$，$f=r/\beta$，$\beta=1$。$Z=0.5+0.3e+0.2e^2=2.793$，$\ln Z=1.027$，$q^*=(0.179,0.292,0.529)$。$q=\pi_{\text{ref}}$ 时左边是 $0.7-0=0.700$，右边是 $1.027-D(\pi_{\text{ref}}\|q^*)=1.027-0.327=0.700$；$q=(0,0,1)$ 时左边是 $2-1.609=0.391$，右边是 $1.027-0.637=0.391$。

### 两种读法

**Reward。** $f=r/\beta$，两边乘 $\beta$：

$$\mathbb E_q[r]-\beta D(q\|\pi_{\text{ref}})=\beta\ln Z-\beta D(q\|\pi^*),\qquad\pi^*=\frac{\pi_{\text{ref}}\,e^{r/\beta}}{Z}$$

这是 RLHF 的 objective 和它的 optimal policy，[CS4248 第 8 站](../courses/CS4248.html#post)、[MODERN-RL 第 6 站](../courses/MODERN-RL.html#finetune)、[BERKELEY-CS285 第 10 站](../courses/BERKELEY-CS285.html#llm)各推了一遍。

**Likelihood。** 把 $x$ 换成 latent $z$，$p_0=p(z)$ 是 prior，$f(z)=\ln p(x\mid z)$。于是 $Z=\sum_zp(z)\,p(x\mid z)=p(x)$ 是 evidence，$q^*(z)=p(z)\,p(x\mid z)/p(x)=p(z\mid x)$ 是 posterior，identity 变成

$$\underbrace{\mathbb E_q[\ln p(x\mid z)]-D\big(q\|p(z)\big)}_{\text{ELBO}(q)}=\ln p(x)-D\big(q\|p(z\mid x)\big)$$

这是 CS5788 第 2 站和 [MIT-6.S978 第 2 站](../courses/MIT-6.S978.html#vae)不用 Jensen 推出的 ELBO 和它的 gap。

两种读法可以并成一种：把 reward 当作一个 observation $O=1$ 的 log-likelihood。令 $p(O=1\mid y)=e^{(r(y)-r_{\max})/\beta}$（减去 $r_{\max}=2$ 是为了让它不超过 1），则 evidence 是 $p(O=1)=Z\,e^{-r_{\max}/\beta}$，posterior 就是 $\pi^*$，optimum 处的 objective $\beta\ln Z=r_{\max}+\beta\ln p(O=1)$。$\beta=1$ 时 evidence 是 $2.793\,e^{-2}=0.378$，$2+\ln0.378=1.027$。Korbak、Perez 与 Buckley 2022 年的论文正是这样把 KL-regularized RL 读成 Bayesian inference：$\pi_{\text{ref}}$ 是 prior，$\pi^*$ 是 posterior，reward 提供 evidence；附录取 $\beta=1$，把 $p(O=1\mid x)=e^{r(x)}$ 写成 likelihood。

::fig[thread-entropy-tilt] 动图：左边 prior（$\pi_{\text{ref}}$），中间 likelihood $e^{(r-2)/\beta}$，乘起来再除以 $Z$ 得到右边的 posterior（$\pi^*$）。$\beta$ 从 8 降到 0.25，likelihood 越来越陡，$\pi^*$ 从 $\pi_{\text{ref}}$ 移向全押在 c 上。第一帧是 $\beta=1$。

### KL 的两个方向

骨架一 minimize 的是 $D(\hat p\|q_\theta)$：data 在前、model 在后，expectation 对 data 取。骨架二 minimize 的是 $D(q\|q^*)$：要找的 $q$ 在前，expectation 对 $q$ 自己取。前者叫 forward KL，后者叫 reverse KL。性格相反的原因在 Gibbs inequality 的第二个 corollary 里：$D(a\|b)$ 在 $a>0$、$b=0$ 的地方是 infinite。

- Forward：data 出现过的地方，model 必须给 probability，所以 model 宁可铺开去盖住所有 data。[CS5788 第 1 站](../courses/CORNELL-CS5788.html#mle)用一个 Gaussian fit 两个 bump，MLE 选出的宽 Gaussian 连中间的空地也盖上了。
- Reverse：$q$ 有 mass 的地方，target 必须有 mass；target 有而 $q$ 没有的地方，只罚有限的代价。$q$ 可以放弃 target 的一部分。CS5788 同一个例子里，reverse KL 选中的是其中一个 bump。

:::wrong KL penalty 让 policy 保留 reference model 会说的每一种话
Penalty 是 reverse 方向的 $D(\pi\|\pi_{\text{ref}})$，它不阻止 $\pi$ 把 reference 里常见的回答压到接近 0。$\beta=0.25$ 时 $\pi^*=(0.001,0.027,0.972)$：a 在 reference 里占一半，现在不到千分之一，penalty 只记 1.468 nat。换成 forward 方向，同一个 $\pi^*$ 的 $D(\pi_{\text{ref}}\|\pi^*)=3.618$；要它保留每一种回答，就得用 forward 方向当 penalty，代价是 forward 方向的 expectation 要对 $\pi_{\text{ref}}$ 的 sample 取，不能只用 policy 自己生成的 sample。[MODERN-RL 第 6 站](../courses/MODERN-RL.html#finetune)记录的 PPO-ptx 在 objective 里混入 pretraining data 的 log-likelihood，按骨架一，这一项就是到 pretraining distribution 的 forward KL（差一个 constant），那一站说它大幅减少了在公开 benchmark 上的退步。
:::

## 各门课里的名字

| 课与站 | 在那里叫 | 记号 | log 的底 | 骨架里的位置 |
|---|---|---|---|---|
| [CS3236 第 1、2、4 站](../courses/CS3236.html#kl) | entropy、relative entropy、cross-entropy、codeword length | $H(X)$，$D(p\Vert q)$，$H(p,q)$，$\ell(x)$ | 2 | 骨架一本身 |
| [CS3236 第 3 站](../courses/CS3236.html#mi) | mutual information | $I(X;Y)=D(P_{XY}\Vert P_XP_Y)$ | 2 | 桥 1、4 |
| [CS2109S 第 4 站](../courses/CS2109S.html#dt) | entropy、information gain | $H(p)$，Gain | 2 | 桥 1 |
| [CS2109S 第 6 站](../courses/CS2109S.html#logreg)、[CS3244 第 3、6 站](../courses/CS3244.html#nn) | cross-entropy loss | $J(w)$，$h_w(x)$；$-\sum_ky_k\ln p_k$ | $e$ | 骨架一，$q$ 是 conditional 的 |
| [ST2132 第 2、8 站](../courses/ST2132.html#lrt) | likelihood、generalized likelihood ratio | $\ell(\theta)$，$\Lambda$，$2\sum_jO_j\ln(O_j/E_j)$ | $e$ | 骨架一；桥 2 |
| [CS4248 第 2、7 站](../courses/CS4248.html#pretrain)、[KARPATHY-Z2H 第 2 站](../courses/KARPATHY-Z2H.html#lm)、[STANFORD-CS336 第 4 站](../courses/STANFORD-CS336.html#train) | perplexity、NLL、next-token cross-entropy | $\mathrm{PP}(W)$，$L$，$\ell_i$ | $e$ | 骨架一 |
| [CS3244 第 9 站](../courses/CS3244.html#em) | ELBO（用 Jensen 推出） | $\mathcal F(q,\theta)$，$r_{nj}$ | $e$ | 骨架二；桥 3 |
| [CORNELL-CS5788 第 1、2 站](../courses/CORNELL-CS5788.html#vae)、[MIT-6.S978 第 2 站](../courses/MIT-6.S978.html#vae) | forward 与 reverse KL、ELBO | $D_{\text{KL}}(p^*\Vert p_\theta)$，$q(z\mid x)$ | $e$ | 骨架一、二 |
| [MIT-6.S184 第 7 站](../courses/MIT-6.S184.html#arch) | VAE 的 KL term、rate–distortion | $\beta\,D_{\text{KL}}(q_\phi\Vert N(0,I))$ | $e$ | 桥 4 |
| [CS4248 第 8 站](../courses/CS4248.html#post)、[MODERN-RL 第 6 站](../courses/MODERN-RL.html#finetune)、[BERKELEY-CS285 第 10 站](../courses/BERKELEY-CS285.html#llm) | KL penalty、KL-regularized objective | $\beta\,\mathrm{KL}(\pi\Vert\pi_{\text{ref}})$，$\pi^*$，$Z$ | $e$ | 骨架二；桥 5 |
| [BERKELEY-CS285 第 6 站](../courses/BERKELEY-CS285.html#trpo) | KL constraint、Fisher information matrix | $\mathrm{KL}\le\epsilon$，$F$ | $e$ | 桥 2 |
| [BERKELEY-CS285 第 10 站](../courses/BERKELEY-CS285.html#llm)、[MODERN-RL 第 7 站](../courses/MODERN-RL.html#debug) | KL estimator、approx_kl | $k_1$，$k_3$；$\Delta$，$\rho$ | $e$ | 桥 6 |
| [NYU-REASONERS 第 6 站](../courses/NYU-REASONERS.html#distill) | distillation、SFT on teacher traces | $H(q)+\mathrm{KL}(q\Vert\pi_\theta)$ | $e$ | 骨架一，teacher 是 $p$ |

同一个字母在不同课里指不同的东西。$q$ 在 CS3236 和这一页是 model（code），在 CS5788、6.S978、6.S184 是 encoder 给出的 approximate posterior，在 NYU-REASONERS 是 teacher。$p$ 在 CS3244 第 6 站是 softmax 的 output，也就是这一页的 $q$。$H$ 在 CS2109S 是 binary entropy function $H(p)$，argument 是一堆邮件里 + 的比例；在 CS3236 写成 random variable 的 $H(X)$。

## 逐门课：每一门往骨架上加了什么

### CS3236：骨架本身，和骨架省掉的三件事

[第 2 站](../courses/CS3236.html#kl)的“按 $q$ 设计 code、实际来的是 $p$，多付 $D(p\|q)$”和 Gibbs inequality 的 proof，就是骨架一。这门课加了骨架省掉的三件事。一是 integer 的代价：[第 4 站](../courses/CS3236.html#symbol)的 proof 给出 symbol code 只能做到 $H\le L^*<H+1$，$(0.7,0.15,0.15)$ 的 Huffman code 比 entropy 多 0.12 bit，打包成 pair 才降到 0.017。二是 [第 5 站](../courses/CS3236.html#typical)的 AEP：$-\frac1n\log P(X^n)\to H(X)$。骨架一里“data 上的账单除以 $n$”就是 $-\frac1n\log P(X^n)$ 在 $q=p$ 时的值，AEP 说 i.i.d. 时它趋于 entropy，第 5 站由此证明 rate 大于 $H$ 的 compression 做得到。三是 [第 3 站](../courses/CS3236.html#mi)把两个 random variable 的关系写成 $I(X;Y)=D(P_{XY}\|P_XP_Y)$，第 1、4 座桥都靠它。

### CS2109S 与 CS3244：只传 label 的账单

[CS2109S 第 6 站](../courses/CS2109S.html#logreg)的 cross-entropy loss $J(w)$ 是骨架一的账单，只是 $q$ 换成了 conditional 的 $q(y\mid x)=h_w(x)^y\big(1-h_w(x)\big)^{1-y}$：发送和接收的两边都看得见 $x$，要传的只是 label。那一站四个点的 optimum 是 $J=0.5869$ nat，每个 label 0.847 bit；不看 $x$、按 $\hat p(y=1)=\tfrac12$ encode 要 1 bit，看了 $x$ 每个 label 省 0.153 bit。账单的 lower bound 是 data 上的 conditional entropy：那四个 $x$ 各只出现一次，它是 0。$y=0,1,0,1$ 时 linear 的 decision boundary 够不着这个 lower bound，账单停在 0.5869；那一站的 edge case 把 label 换成 $y=0,0,1,1$，sigmoid 这一族可以无限逼近 0，可它永远给错的 label 留一点 probability，任何有限的 $w$ 都还在付钱，于是 $J\to0$ 而 $w$ 越来越大。

[CS3244 第 3 站](../courses/CS3244.html#reg)把这件事说成“loss 的选择就是 noise model 的选择”：Gaussian noise 的 negative log-likelihood 是 squared error，Bernoulli 的是 cross-entropy。[第 8 站](../courses/CS3244.html#nn)推出 softmax 加 cross-entropy 对 logits 的 gradient 是 $p-y$。换成骨架的记号，$y$ 是 data 的 distribution（one-hot，平均起来是 $\hat p$），那一站的 $p$ 是 model 的 $q$，gradient 是 $q-\hat p$，等于 0 正是 Gibbs inequality 取等的 condition $q=\hat p$。[KARPATHY-Z2H 第 2 站](../courses/KARPATHY-Z2H.html#lm)发现 gradient descent 的终点恰好是 count model，是同一个等号。[CS3244 第 9 站](../courses/CS3244.html#em)用 Jensen's inequality 推出 EM 的 ELBO，没有写 gap 是多少，第 3 座桥补上。[CS2109S 第 4 站](../courses/CS2109S.html#dt)的 information gain 看起来是另一回事，第 1 座桥说明它也是这笔账。

### ST2132：MLE 好不好，以及拿 likelihood 做 test

[ST2132 第 2 站](../courses/ST2132.html#est)对 Bernoulli、Poisson、normal 求 MLE，按骨架一它们都在 minimize $D(\hat p\|q_\theta)$。ST2132 加的是骨架不管的两件事。一是 estimator 离真值多远：[第 4 站](../courses/ST2132.html#fisher)的 Fisher information $I(\theta)$ 是 log-likelihood 的 curvature，决定 MLE 的 variance。二是拿 likelihood 做 test：[第 8 站](../courses/ST2132.html#lrt)的 $-2\ln\Lambda$ 和 goodness of fit 的 $2\sum_jO_j\ln(O_j/E_j)$。这两件事用 KL 写出来是同一个 expansion，见第 2 座桥。ST2132 第 2 站的 Uniform$(0,\theta)$ 例子是骨架一第二个 corollary 的 continuous 版本：$\theta<9.6$ 时 9.6 这个 observation 的 density 是 0，按 $q_\theta$ 根本编不出它，账单 infinite，likelihood 为 0。

### CS4248、KARPATHY-Z2H 与 STANFORD-CS336：loss 就是 compression rate

[CS4248 第 2 站](../courses/CS4248.html#ngram)的“I am Sam”在 bigram model 下 probability 是 $\tfrac19$，按 arithmetic coding 要 $\log_29=3.17$ bit，4 个被预测的 token 每个 0.792 bit，$2^{0.792}=1.73$，正是那一站的 perplexity。Perplexity 是把“每个 token 的 bit 数”换回“相当于在几个选项里 uniform 地猜”。[第 7 站](../courses/CS4248.html#pretrain)写出 cross-entropy $=H(p)+\mathrm{KL}(p\|q)$，并指出 Chinchilla 的 scaling law 里那个 constant $E=1.69$ 就是 $H(p)$ 这一项：model 再大、data 再多，KL 降到 0，loss 也停在文本自身的 entropy 上。那一站 :::wrong 里的 bits per byte，是把 model 当 compressor 时每个 byte 的 code length，跨 tokenizer 比较时只有它不受 token 大小的影响。

[KARPATHY-Z2H 第 2 站](../courses/KARPATHY-Z2H.html#lm)的 bigram 在 training set 上 NLL 是 2.4546 nat，即每个 character 3.54 bit；27 个 character uniform 地猜是 $\ln27=3.296$ nat，4.75 bit。[STANFORD-CS336 第 4 站](../courses/STANFORD-CS336.html#train)加的是数值上的做法：$\ell_i=-o_i[y]+\log\sum_ae^{o_i[a]}$ 先减去 max；以及 initialization 时 loss 应在 $\ln V$ 附近，因为 uniform 的 $q$ 给每个 token $\ln V$ nat，不管 data 是什么，$H(\hat p,u)=\ln V$。

### CORNELL-CS5788、MIT-6.S978 与 MIT-6.S184：ELBO

[CS5788 第 1 站](../courses/CORNELL-CS5788.html#mle)把 MLE 写成 $D_{\text{KL}}(p^*\|p_\theta)$，用两个 bump 算出两个方向的 KL 各自选出的 Gaussian；reverse 方向的最优值 0.693 几乎正好是 $\ln2$，因为 $q$ 只盖住一半的 mass。[第 2 站](../courses/CORNELL-CS5788.html#vae)在 linear Gaussian 的 toy model 上把 ELBO、gap 和 $q$ 的 mean、variance 逐一算出，并加上骨架没有的两样：encoder 一次给出所有 $x$ 的 $q$（amortization），reparameterization 让 gradient 穿过 sampling。[MIT-6.S978 第 2 站](../courses/MIT-6.S978.html#vae)的表里最后一行 $q=$ prior，KL 项为 0，ELBO 最差：posterior collapse。[MIT-6.S184 第 7 站](../courses/MIT-6.S184.html#arch)给出 diagonal Gaussian 的 KL closed form，把 VAE 的 loss 写成 reconstruction 加 $\beta$ 倍 KL，称之为 rate–distortion trade-off；第 4 座桥说明这个 KL 为什么叫 rate。[EE4706 第 5 站](../courses/EE4706.html#wm)的 Dreamer 在 categorical latent 里混入 1% 的 uniform，理由就是 Gibbs inequality 的第二个 corollary：probability 一旦为 0，KL 就是 infinite。

### CS4248、MODERN-RL、BERKELEY-CS285 与 STANFORD-CS336：KL penalty

CS4248、MODERN-RL、CS285 都推出了 $\pi^*\propto\pi_{\text{ref}}e^{r/\beta}$。DPO 把它倒过来：$r=\beta\ln\frac{\pi^*}{\pi_{\text{ref}}}+\beta\ln Z$。用 Bayes 的读法，这一行是 Bayes' rule 倒过来写：likelihood 等于 evidence 乘 posterior 再除以 prior，$\ln Z$ 是 log evidence（差一个 constant $r_{\max}/\beta$）。Bradley–Terry 只看两个回答的 reward 之差，evidence 在差里消掉，所以 DPO 不需要算 $Z$。[MODERN-RL 第 6 站](../courses/MODERN-RL.html#finetune)引的 InstructGPT 把 KL penalty 拆到每个 token 上当 negative reward，依据是 $\ln\pi(y\mid x)=\sum_t\ln\pi(y_t\mid x,y_{<t})$：整条回答的 log-ratio 是每个 token 的 log-ratio 之和，对 $\pi$ 取 expectation 就是 KL 的 chain rule，和 [CS3236 第 3 站](../courses/CS3236.html#mi)的 entropy chain rule 一样逐项拆开。

[CS285 第 6 站](../courses/BERKELEY-CS285.html#trpo)用 KL 约束一次 update 的大小，并由 KL 的 second-order expansion 得到 Fisher matrix，第 2 座桥把它接到 ST2132。[CS285 第 12 站](../courses/BERKELEY-CS285.html#offline)的 AWR 是骨架二把 $r$ 换成 advantage $A$、把 $\pi_{\text{ref}}$ 换成 behavior policy $\pi_\beta$；它接着用 forward KL 把 $\pi^*$ project 到 parametric policy 上，这一步是骨架一：weighted MLE。[RB4301 第 2 站](../courses/RB4301.html#ac)的 SAC 把 policy 推向 $\exp(Q/\alpha)/Z$，是骨架二取 $p_0$ 为 uniform：最大化 $\mathbb E_\pi[Q]+\alpha\mathcal H(\pi)$，最大值是 soft value $\alpha\log\sum_a\exp(Q/\alpha)$，也就是 $\alpha\ln Z$ 加上 constant $\alpha\ln|\mathcal A|$。[STANFORD-CS336 第 10 站](../courses/STANFORD-CS336.html#align)的 A5 不加 KL，只在 lecture 16 的 PPO 里出现按 token 计的 penalty。[NYU-REASONERS 第 6 站](../courses/NYU-REASONERS.html#distill)指出 SFT on teacher traces 在 minimize forward 的 $\mathrm{KL}(q\|\pi_\theta)$：teacher 是骨架一里的 $p$，student 必须盖住 teacher 会写的每一种 trace；RL 的 KL penalty 是 reverse 方向，允许 policy 放弃一部分。

## 课程页里没有写的六座桥

### 桥 1：Information gain 是 mutual information，也是 tree 的 log-loss 少掉的部分

[CS2109S 第 4 站](../courses/CS2109S.html#dt)的 8 封邮件，按 Known 分的 information gain 是 $1-\tfrac68\times0.918=0.311$。

**按 CS3236 算。** Information gain 的 definition 是 $H(\text{Spam})-\sum_v\frac{|S_v|}{|S|}H(S_v)$，后一项正是 [CS3236 第 3 站](../courses/CS3236.html#mi)的 conditional entropy $H(\text{Spam}\mid\text{Known})$，所以 Gain $=I(\text{Spam};\text{Known})$。直接从 joint distribution 用 $D(P_{XY}\|P_XP_Y)$ 再算一遍：(Known, Spam) 取 (N, +)、(N, −)、(Y, −) 的 probability 是 $\tfrac48,\tfrac28,\tfrac28$，Known 的 marginal 是 N $\tfrac68$、Y $\tfrac28$，Spam 的 marginal 是 $\tfrac12,\tfrac12$：

$$I=\tfrac12\log_2\frac{1/2}{\frac34\cdot\frac12}+\tfrac14\log_2\frac{1/4}{\frac34\cdot\frac12}+\tfrac14\log_2\frac{1/4}{\frac14\cdot\frac12}=0.2075-0.1462+0.25=0.311$$

**按骨架一算。** 把 tree 当成一个 probability model：每个 leaf 用这一堆里 label 的 frequency 作 $q$（这是那一堆上的 MLE），然后存 8 个 label。分之前 $q(+)=\tfrac12$，每个 label 1 bit，共 8 bit。按 Known 分之后，Known = Y 的两封 $q(-)=1$，0 bit；Known = N 的六封 $q(+)=\tfrac46$，+ 用 $\log_2\tfrac32=0.585$ bit，− 用 $\log_23=1.585$ bit，共 $4\times0.585+2\times1.585=5.510$ bit。少了 2.490 bit，正是 $8\times0.311$。

::fig[thread-entropy-split] 每张卡片下面是它的 label 在当前那一堆里的 code length。分一次，总 code length 从 8 bit 降到 5.510 bit。

所以按 information gain greedy 地选 split，就是 greedy 地让 tree 在 training data 上的 cross-entropy 降得最多；leaf 里的 frequency 就是 MLE。这个读法解释了 CS2109S 那一站的三件事。Error rate 分不出 Link 和 Known（都错 2 个），是骨架一 :::wrong 里 accuracy 与 cross-entropy 的差别，Known 让一堆变 pure，code length 直接降到 0。Gain 永远 $\ge0$，是 $I\ge0$，即 Gibbs inequality：再分一次，training data 上的账单只会变小，所以不能拿它决定 tree 长多深。取值很多的“编号”（ID）feature gain 为 1 bit，是因为 $I(\text{Spam};\text{ID})=H(\text{Spam})$，8 个 leaf 各一封邮件，账单是 0，和 CS4248 里 MLE bigram 在 training sentence 上 perplexity 最低是同一种 overfitting。

### 桥 2：−2 ln Λ 是 2n 倍的 KL，Wilks 的 expansion 就是 TRPO 的 Fisher matrix

[ST2132 第 8 站](../courses/ST2132.html#lrt)的 goodness of fit statistic 是 $-2\ln\Lambda=2\sum_jO_j\ln(O_j/E_j)$。令 $\hat p_j=O_j/n$，$p_j(\hat\theta)=E_j/n$：

$$-2\ln\Lambda=2n\sum_j\hat p_j\ln\frac{\hat p_j}{p_j(\hat\theta)}=2n\,D\big(\hat p\,\|\,p(\hat\theta)\big)$$

Mendel 的 556 粒豌豆：$D=0.000556$ nat，乘 $2n=1112$ 得 0.618，就是那一站的数。Kiss data 只有两个 category，$\hat p=80/124=0.645$，$D(\hat p\|0.5)=0.0428$ nat，乘 $2n=248$ 得 10.60，也是那一站的数。读法：$D(\hat p\|p_0)$ 是 data 每个 sample 平均提供的 log-likelihood ratio，$n$ 个 sample 攒下 $nD$，攒到 $2nD>3.84$ 就在 5% 的 level 上 reject。

同一站推 Wilks' theorem 时，把 $\ell(\theta_0)$ 在 $\hat\theta$ 处做 Taylor expansion 到 second order，得到 $-2\ln\Lambda\approx nI(\theta_0)(\hat\theta-\theta_0)^2=10.45$。两式相比，这个 expansion 说的是

$$D\big(p_{\hat\theta}\,\|\,p_{\theta_0}\big)\approx\tfrac12\,I(\theta_0)\,(\hat\theta-\theta_0)^2$$

Bernoulli 在 0.5 处 $I=4$，$\tfrac12\times4\times0.1452^2=0.0421$，乘 248 得 10.45。[CS285 第 6 站](../courses/BERKELEY-CS285.html#trpo)推 natural gradient 时写的 $\mathrm{KL}(\pi_\theta\|\pi_{\theta+\Delta})\approx\tfrac12\Delta^\top F\Delta$ 是同一个 expansion，只是 parameter 是一个很长的 vector，$F$ 是 Fisher information matrix。Pearson 的 $X^2$ 是同一件事的另一种 second-order approximation：$D(\hat p\|p)\approx\tfrac12\sum_j(\hat p_j-p_j)^2/p_j=X^2/(2n)$，Mendel 的 $X^2=0.604$ 对 $-2\ln\Lambda=0.618$。

::fig[thread-entropy-kiss] $\hat p$ 离 0.5 越远，second-order expansion 低估得越多；在 kiss data 的 0.645 处只差 1.4%。

这给 RL 里的 KL 数字一个尺度。[MODERN-RL 第 1 站](../courses/MODERN-RL.html#ppo)里 RSL-RL 的目标 KL 是 0.01。按上面的读法，在一个 state 上从新 policy 抽 $m$ 个 action、test“它还是旧 policy”，$2m\times0.01$ 要到 3.84，$m$ 约 192。也就是说，每一步 update 让 policy 变化到“约两百个 sample 才分辨得出”的程度。换成一枚 coin：$\tfrac12\times4\times\delta^2=0.01$，$\delta=0.071$，相当于把 0.5 的 coin 改成 0.571。这个换算忽略了 degrees of freedom 和 $\chi^2$ approximation 的误差，是一个量级，不是 theorem。

### 桥 3：EM 每一轮的 gap 是 responsibility 之间的 KL

[CS3244 第 9 站](../courses/CS3244.html#em)对 6 个点 $\{1,2,3,5,8,9\}$ 跑了一轮 EM，并核对 $\ell(\theta_1)=-13.744$ 比 $\mathcal F(r^{(0)},\theta_1)=-13.759$ 高一点，“因为 $r^{(0)}$ 已经不是 $\theta_1$ 下的 posterior，bound 不再贴紧”。差多少，骨架二的 likelihood 读法给出精确的数。

CS3244 的 $\mathcal F(q,\theta)=\sum_{n,j}q_n(j)\ln\frac{\pi_j\mathcal N_j(x_n)}{q_n(j)}$，而 $\pi_j\mathcal N_j(x_n)=p_\theta(x_n,z_n=j)$，所以对每个点，$\mathcal F$ 的那一项就是 $\mathbb E_{q_n}[\ln p_\theta(x_n,z)]+H(q_n)=\mathbb E_{q_n}[\ln p_\theta(x_n\mid z)]-D(q_n\|p_\theta(z))$，即 ELBO。由 identity，

$$\ell(\theta)-\mathcal F(q,\theta)=\sum_nD\big(q_n\,\|\,p_\theta(z_n\mid x_n)\big)$$

取 $q=r^{(0)}$、$\theta=\theta_1$，posterior 是 $\theta_1$ 下的 responsibility $r^{(1)}$。逐点算 $D(r^{(0)}_n\|r^{(1)}_n)$：$x=5$ 处 $r^{(0)}=(0.5,0.5)$、$r^{(1)}=(0.575,0.425)$，$D=0.0114$；$x=3$ 处 $r^{(1)}$ 的第二个 component 从 $6\times10^{-6}$ 涨到 0.0033，$D=0.0033$；其余四点合计 0.0005。总和 0.01520，等于 $-13.7441-(-13.7593)=0.01520$。

::fig[thread-entropy-emgap] 每个点上方两条 bar 是 $r^{(0)}$ 与 $r^{(1)}$，下面的数是它们的 KL（乘了 $10^3$）。Gap 的四分之三来自两组之间的 $x=5$。

所以 E-step 是在 $\theta$ 固定时把这个 KL 降到 0：$q$ 取 posterior，bound 贴紧。CS5788 的 encoder 做的是同一件事，只是 $q$ 被限制在 Gaussian 里，这个 KL 一般降不到 0，ELBO 和 $\ln p(x)$ 之间永远留着一段 gap；EM 能让它为 0，是因为 GMM 的 posterior 只是 $K$ 个数，可以精确算出。

### 桥 4：VAE 的 KL 项是 latent 带走的 information

[MIT-6.S184 第 7 站](../courses/MIT-6.S184.html#arch)把 VAE 的 loss 写成 reconstruction 加 $\beta D_{\text{KL}}(q_\phi(z\mid x)\|N(0,I))$，说 $\beta$ 大时 latent 携带的 information 少。Information 可以按 [CS3236 第 3 站](../courses/CS3236.html#mi)精确地讲。对 data distribution $p(x)$ 取平均，记 aggregate posterior $q(z)=\sum_xp(x)\,q(z\mid x)$：

$$\mathbb E_x\,D\big(q(z\mid x)\|p(z)\big)=\mathbb E_x\sum_zq(z\mid x)\Big[\ln\frac{q(z\mid x)}{q(z)}+\ln\frac{q(z)}{p(z)}\Big]=I_q(X;Z)+D\big(q(z)\|p(z)\big)$$

第一项是 encoder 给出的 joint distribution $p(x)q(z\mid x)$ 下的 mutual information（按 $D(P_{XZ}\|P_XP_Z)$ 的 definition）；第二项里 $\ln\frac{q(z)}{p(z)}$ 不依赖 $x$，对 $x$ 平均时 $\sum_xp(x)q(z\mid x)=q(z)$。两项都 $\ge0$，所以平均的 KL 项是 $I(X;Z)$ 的 upper bound。Alemi 等人把它叫 rate $R$，reconstruction 项叫 distortion $D$，ELBO 的平均就是 $-(D+R)$。

拿 CS5788 第 2 站的 toy model 算两边：$z\sim N(0,1)$，$x\mid z\sim N(2z,0.25)$，$x\sim N(0,4.25)$。Encoder 取精确的 posterior $N(\tfrac{8x}{17},\tfrac1{17})$ 时，aggregate posterior 就是 prior，第二项为 0。左边：每个 $x$ 的 KL 项是 $\tfrac12(\tfrac1{17}+m^2-1+\ln17)$，$m=\tfrac{8x}{17}$，$\mathbb E[m^2]=\tfrac{64}{289}\times4.25=\tfrac{16}{17}$，代回去得 $\tfrac12\ln17=1.417$ nat。右边：$x=2z+0.5\varepsilon$ 是 Gaussian channel，$I(X;Z)=\tfrac12\ln\frac{\mathrm{Var}(x)}{\mathrm{Var}(x\mid z)}=\tfrac12\ln\frac{4.25}{0.25}=\tfrac12\ln17$，一样，合 2.04 bit。CS5788 那张表里 $x=2$ 的 KL 项 1.389，是这个平均里的一个 $x$。换一个不准的 encoder $N(0.5x,0.01)$：平均 KL 是 2.339，其中 $I=\tfrac12\ln(1.0725/0.01)=2.338$，aggregate posterior $N(0,1.0725)$ 离 prior 的 KL 是 0.0013。

::fig[thread-entropy-rate] 动图：看到不同的 $x$，posterior 落在 prior 的不同位置，宽度始终只有 prior 的 $1/\sqrt{17}$。右边是 KL 项随 $x$ 的变化，对 $x$ 平均正好是 $I(X;Z)$。

6.S978 那张表最后一行（$q=$ prior）就是 $R=0$：$I(X;Z)=0$，$z$ 不带任何关于 $x$ 的 bit。$\beta$ 大，rate 被压低，能经由 $z$ 传过去的 bit 少，reconstruction 只好模糊。EE4706 的 Dreamer 里 KL 是 posterior 到 learned prior（dynamics 的 prediction）的，free bits 不再把它压到 1 nat 以下；换成这个读法：每一步的 observation 在 prediction 之外，可以带进约 1.44 bit 而不受罚。

### 桥 5：KL-regularized RL 是一次 Bayes update，KL 是成功的 self-information

[CS285 第 10 站](../courses/BERKELEY-CS285.html#llm)的例子：三个 completion，$\pi_{\text{ref}}=(0.7,0.2,0.1)$，reward $(0,1,1)$。那一站观察到 $\beta\to0$ 时 KL 趋于 $-\ln0.3=1.204$，“把 $\pi_{\text{ref}}$ 在 reward 为 1 的那部分放大成全部”。

按骨架二的 likelihood 读法：$p(O=1\mid y)=e^{(r(y)-1)/\beta}$，$\beta\to0$ 时它变成“reward 为 1”这个 event 的 indicator，posterior 就是 $\pi_{\text{ref}}$ 在 event $A=\{r=1\}$ 上的 conditional distribution $(0,\tfrac23,\tfrac13)$。对一个 event 做 conditioning，KL 是

$$D\big(\pi_{\text{ref}}(\cdot\mid A)\,\|\,\pi_{\text{ref}}\big)=\sum_{y\in A}\frac{\pi_{\text{ref}}(y)}{P(A)}\ln\frac{\pi_{\text{ref}}(y)/P(A)}{\pi_{\text{ref}}(y)}=\ln\frac1{P(A)}$$

这是 event $A$ 的 self-information（[CS3236 第 1 站](../courses/CS3236.html#entropy)的 $h=\log\frac1p$）：$\ln\frac1{0.3}=1.204$ nat，即 1.737 bit。一个总是成功的 policy 要付的 KL，恰好是“成功”在 reference model 下有多意外。它还有一个操作上的意思：从 $\pi_{\text{ref}}$ 反复 sample、直到抽到 reward 为 1 的回答为止，得到的正是这个 posterior，平均要抽 $1/P(A)=3.33=e^{1.204}$ 次。

$\beta$ 有限时 evidence 是 $p(O=1)=\sum_y\pi_{\text{ref}}(y)e^{(r(y)-1)/\beta}$。$\beta=0.5$ 时 $0.7e^{-2}+0.3=0.3947$，objective 的最大值 $1+0.5\ln0.3947=0.535$；$\beta=2$ 时 evidence $0.7e^{-0.5}+0.3=0.7246$，$1+2\ln0.7246=0.356$。CS285 那张表最后一列的 0.535 和 0.356 是用 $\beta\ln Z$ 算的，两种读法给出同一个数。

$\beta$ 本身也有读法。沿着 $\pi^*_\beta$ 这一族，记 $\lambda=1/\beta$，$A(\lambda)=\ln\sum_y\pi_{\text{ref}}(y)e^{\lambda r(y)}$。对 $\lambda$ 求 derivative，$A'(\lambda)=\sum_y\pi^*(y)r(y)=\mathbb E_{\pi^*}[r]$，$A''(\lambda)=\mathrm{Var}_{\pi^*}(r)$。又因为 $\ln\frac{\pi^*}{\pi_{\text{ref}}}=\lambda r-A(\lambda)$，$\mathrm{KL}=\lambda A'(\lambda)-A(\lambda)$，它对 $\lambda$ 的 derivative 是 $A'+\lambda A''-A'=\lambda A''$。两者相除：

$$\frac{d\,\mathbb E_{\pi^*}[r]}{d\,\mathrm{KL}}=\frac{A''(\lambda)}{\lambda A''(\lambda)}=\beta$$

在 CS4248 的例子上数值求 derivative，$\beta=2,1,0.5$ 处的 slope 是 2.000、1.000、0.500。$\beta$ 是 reward 和 KL 之间的 exchange rate：再多换 1 nat 的 KL，只能多换 $\beta$ 的 reward。Alemi 等人对 VAE 指出了同样的事：$\beta$-VAE 的 $\beta$ 是 rate–distortion curve 的 slope。MIT-6.S184 的 $\beta$ 和 CS4248 的 $\beta$ 是同一个 Lagrange multiplier，一个用 rate 换 reconstruction，一个用 KL 换 reward。

### 桥 6：k3 estimator 是 Gibbs inequality proof 里的 slack

[CS285 第 10 站](../courses/BERKELEY-CS285.html#llm)和 [MODERN-RL 第 7 站](../courses/MODERN-RL.html#debug)用 sample 估 $\mathrm{KL}(\pi_\theta\|\pi_{\text{ref}})$：$a\sim\pi_\theta$，$\rho=\pi_{\text{ref}}(a)/\pi_\theta(a)$，$k_1=-\ln\rho$，$k_3=(\rho-1)-\ln\rho$。（MODERN-RL 估的是新旧 policy 之间的 KL，sample 来自旧 policy，$\rho$ 是新比旧，结构相同。）两站的理由是 $\mathbb E[\rho]=1$，所以 $k_3$ 和 $k_1$ 的 mean 相同，而 $\ln\rho\le\rho-1$ 让 $k_3\ge0$。

把骨架一的 Gibbs proof 用在 $p=\pi_\theta$、$q=\pi_{\text{ref}}$ 上。第一个 $\le$ 逐项用的正是 $\ln\rho\le\rho-1$，每一项的 slack $\pi_\theta(a)\big[(\rho-1)-\ln\rho\big]$ 就是 $k_3$ 乘上它被 sample 到的 probability；第二个 $\le$ 的 slack 是 $1-\sum_{a\in S}\pi_{\text{ref}}(a)$，$S$ 是 $\pi_\theta$ 的 support。$D$ 等于两个 slack 之和，所以

$$\mathbb E_{\pi_\theta}[k_3]=D(\pi_\theta\|\pi_{\text{ref}})-\Big(1-\sum_{a\in S}\pi_{\text{ref}}(a)\Big)$$

“$\mathbb E[\rho]=1$”就是第二个 slack 为 0。Softmax 给每个 token 正的 probability，所以它总是 0；可是 $\pi_\theta(a)\to0$ 时，token $a$ 那一项对 $\mathbb E[k_3]$ 的贡献趋于 $\pi_{\text{ref}}(a)$，正好是 $\pi_\theta(a)=0$ 时第二个 slack 的大小。这一块被装进一个极少被 sample 到的巨大的 $k_3$ 里。

::fig[thread-entropy-k3] $\pi_\theta=(0.6,0.3999,0.0001)$，$\pi_{\text{ref}}=(0.5,0.3,0.2)$。c 的 $\rho=2000$，$k_3=1991$，它对 expectation 的贡献 0.199 占了真实 KL 0.2236 的 89%。

:::wrong $k_3$ unbiased、非负、variance 又小，所以任何时候都比 $k_1$ 好
CS285 那张表里“$k_3$ 的 std 比 $k_1$ 小 18 倍”是扰动 $s=0.1$、两个 policy 很接近时的数。上图的 $\pi_\theta$ 把 c 压到了 0.0001，骨架二里 $\beta=0.25$ 的 $\pi^*$ 把 a 压到 0.001，是同一种样子。1000 个 sample 里一个 c 都没抽到的 probability 是 $0.9999^{1000}=0.905$；用 numpy `default_rng(0)` 连做三次，三次都没抽到 c，$k_3$ 的平均是 0.0249、0.0238、0.0242，$k_1$ 的平均是 0.226、0.221、0.223，真值 0.2236。$k_3$ 依然 unbiased：那 9.5% 抽到 c 的时候，一个 1991 会把平均拉上去。可是 90% 的时候它报告的 KL 只有真值的九分之一。不管是用它的值当 penalty，还是像 GRPO 那样对它求 gradient（CS285 第 6 站的 edge case 算过，这个 gradient 的 expectation 是 $\nabla\mathrm{KL}(\pi_{\text{ref}}\|\pi_\theta)$），把 c 拉回来的那一部分都只在抽到 c 的那 9.5% 里出现。
:::

:::from
骨架一（code length 与 Kraft inequality、cross-entropy 的分解、Gibbs inequality 用 $\ln t\le t-1$ 的 proof、support 不一致时 KL 为 infinite）沿用 CS3236 第 1、2、4 站已有的讲法，那几站的来源是 Scarlett 的 [CS3236 Lecture Notes #1、#2](https://www.comp.nus.edu.sg/~scarlett/CS3236_notes) 和 Rahul Jain 的讲义；arithmetic coding 的 interval 论证、“data 上的账单 $=nH(\hat p,q)$ 是精确的 identity”、用 Gibbs inequality 直接得出 categorical 的 MLE，是凭自己的知识写的，没有对着 arithmetic coding 的原始文献核对。骨架二的 identity 是常见的 variational 写法，推导按 CS4248、MODERN-RL、CS285、CS5788 各页已有的那一行写开；各门课的说法都对着那一站的正文核过。读过的外部原文：

- Korbak、Perez 与 Buckley，[RL with KL penalties is better viewed as Bayesian inference](https://arxiv.org/pdf/2205.11275)（Findings of EMNLP 2022；WebFetch 逐段提取，附录的推导在抓到的文本里有乱码）：$J_{\text{KL-RL}}=\mathbb E_{\pi_\theta}[r]-\beta D_{\text{KL}}(\pi_\theta,\pi_0)$，target $\pi^*=\pi_0e^{r/\beta}/Z$，$\pi_0$ 是 prior、reward 提供 evidence、$p(O=1\mid x)=e^{r(x)}$ 是 likelihood，objective 是 $\log p(O=1)$ 的 ELBO、与 $-D_{\text{KL}}(\pi_\theta,\pi^*)$ 只差 constant。论文没有讨论 reverse KL 的后果。
- Alemi 等人，[Fixing a Broken ELBO](https://ar5iv.arxiv.org/html/1711.00464)（ICML 2018；读了前 10 万字符，附录 D 的推导没有读到）：$H$、distortion $D$、rate $R=\mathbb E_{p^*}[\mathrm{KL}(e(z\mid x)\|m(z))]$ 的 definition，$H-D\le I_e(X;Z)\le R$，ELBO $=-(D+R)$，$\beta$-VAE 的 objective $D+\beta R$，$\beta$ 是 R–D curve 的 slope，$R=0$ 时 encoding 不依赖 $x$。
- Schulman 的博客 *Approximating KL Divergence* 原文没有抓到，只读了一篇第三方的转述（它说 $k_3$ 是 $-\log r$ 与其 tangent line 之间的距离，即 Bregman divergence）；第 6 座桥的推导只依赖 CS285 与 MODERN-RL 两页和 Gibbs inequality 的 proof。

凭自己的知识写、没有找原文核对的：information gain 等于 tree 的 leaf-probability model 在 training data 上 log-loss 的下降（第 1 座桥的结论本身是两行代数，数是算的）；$-2\ln\Lambda=2nD$ 与“KL 0.01 约等于两百个 sample 才分辨得出”的换算；$\mathbb E_x\mathrm{KL}=I+D(q(z)\|p(z))$ 的分解（Alemi 等人给了 bound，分解是自己写的）；conditioning 的 KL 等于 $\ln(1/P(A))$ 与 rejection sampling 的平均次数；$d\mathbb E[r]/d\mathrm{KL}=\beta$ 的推导；$k_3$ 的 expectation 与第二个 slack 的关系。

数字都是为这一页算的（Python 的 `fractions` 与 numpy）：arithmetic coding 的两个 codeword，三个 model 的 cross-entropy，1000 个 token 的两批 sample 与账单，$\pi^*$ 与 identity 两边的值，8 封邮件的 mutual information 与 code length，Mendel 和 kiss data 的 KL，EM 一轮的逐点 KL，toy model 的 rate 与 mutual information，三个 $\beta$ 处的 slope，$k_1$、$k_3$ 的三次 simulation。
:::
