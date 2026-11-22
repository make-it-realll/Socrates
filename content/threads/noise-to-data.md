---
title: 从 noise 到 data
lead: "手里只有 sample，要造出新的 sample。一个能用 regression 学到的 posterior mean，加一条 continuity equation，串起 Gaussian 与 random walk、score 与 Langevin、DDPM 与 flow matching，一直到 diffusion policy、π0 和 real-time chunking。"
line: ml
---

一个 gripper 要从 obstacle 旁边经过，到 obstacle 那一处的 lateral offset $y$ 就是 policy 要输出的 action。200 条 demonstration 里一半从上面绕（$y$ 在 2 附近），一半从下面绕（$y$ 在 $-2$ 附近），每条带 std 0.5 的抖动：$p_{\text{data}}=\tfrac12N(-2,0.5^2)+\tfrac12N(2,0.5^2)$。Obstacle 占 $|y|<1$，data 落在这里的只有 2.3%。

**第一次失败。** Train 一个 network 直接输出 $y$，loss 用 MSE。把 $y-c$ 写成 $(y-\mathbb Ey)+(\mathbb Ey-c)$ 展开，cross term 的 expectation 为 0，于是 $\mathbb E(y-c)^2=\mathrm{Var}(y)+(\mathbb Ey-c)^2$，最好的 output 是 mean，这里是 0，正撞在 obstacle 中间。Network 再大也一样；给它喂一个随机的 $z$ 当 input 也一样，$z$ 和 $y$ independent，minimizer 是 $\mathbb E[y\mid z]=\mathbb E[y]$（[CS285 第 1 站](../courses/BERKELEY-CS285.html#il)）。Policy 需要输出一个 distribution 的 sample，而不是一个点。

::fig[thread-noise-to-data-fail] 动图：灰线是 demonstration，彩色的 gripper 走 MSE 给出的 path，描边的 gripper 走其中一条 demonstration。右边是 200 条 demonstration 在 obstacle 处的 $y$，mean 落在 obstacle 的范围里。

**第二次失败。** 那就学一个 density。单个 Gaussian 只有一个 bump，MLE 给出 $N(0,4.25)$，它有 37.2% 的 sample 落在 $|y|<1$（[CS5788 第 1 站](../courses/CORNELL-CS5788.html#mle)）。让 network 输出任意的 energy $E_\theta(y)$、令 $p_\theta=e^{-E_\theta}/Z(\theta)$，形状不再受限，可是 $Z$ 是对整个 action space 的 integral。SmolVLA 在 SO-101 上的 action 是 50 步、每步 6 个 dimension 的 chunk（[HF-LEROBOT 第 4 站](../courses/HF-LEROBOT.html#vla)），300 维，每维只取 100 个 grid point，算一次 $Z$ 就要 $10^{600}$ 次 network evaluation。不需要 $Z$ 的量是 score：$\nabla_y\log p_\theta=-\nabla_yE_\theta-\nabla_y\log Z=-\nabla_yE_\theta$。有了 score 就能用 Langevin dynamics sample（[CS5788 第 5 站](../courses/CORNELL-CS5788.html#ebm)）：$y_{k+1}=y_k+\tfrac{\varepsilon^2}{2}\nabla\log p(y_k)+\varepsilon z_k$。它为什么不改变 $p$、step size 带来多大的 bias、怎样用 Metropolis 修正，在[随机模拟那条线的桥 2](../threads/monte-carlo.html)里讲过，这里不重复。

**第三次失败。** 把 weight 改成 0.8 和 0.2：80% 的人从下面绕。CS5788 第 5 站用 exact score 跑 Langevin，4000 条 chain 从 $[-4,4]$ 均匀出发，$\varepsilon=0.1$，2000 步之后右边有 47.4%，应该是 20%。0.5/0.5 时同样的设置给出 50.8%（numpy `default_rng(0)`），对了，只是因为起点本来就一半在右边。原因在 score 本身：在左边的 bump 附近，右边那个 component 的贡献小到可以忽略，$\nabla\log p\approx-(y+2)/0.25$，和 weight 无关。两组 weight 的 score 只在 $|y|<1$ 那片 density 极低的地方不同，chain 几乎不去那里。每条 chain 落进离起点最近的 bump，终点的比例约等于起点在 density 最低点 0.092 右边的比例，$(4-0.092)/8=48.8\%$。

::fig[thread-noise-to-data-langevin] 动图：40 条 chain，颜色按起点在 density 最低点的哪一边。走完 2000 步，彩色的 15 个点都在右边，灰色的都在左边，右边应该只有 8 个。右边是两组 weight 的 score，只在两个 bump 之间不同。

Score 什么时候看得见 weight？两个 bump 连成一片的时候。给 data 加上 std 为 2 的 noise，distribution 变成 $0.8N(-2,4.25)+0.2N(2,4.25)$，只有一个偏左的 bump，0.8 和 0.2 的差别变成了整体形状的不对称，哪里的 score 都感受得到。代价是这个 distribution 不是 data。CS5788 第 5 站的 annealed Langevin 从很大的 noise 开始，逐级减小，每级走 100 步，右边回到 21.5%。

要把这个想法写成一个干净的 algorithm，需要两样东西：每个 noise level 上 distribution 的 score（或者一个等价的量），以及一条规则，把 sample 从一个 noise level 送到下一个，送过去之后 distribution 恰好是下一个 noise level 的那个。下面把这两样推出来。推完会看到，第一次失败的那个 mean 就在骨架里面。

## 骨架：一个 posterior mean，一条 continuity equation

### 一族加了 noise 的 distribution

取 $x\sim p_{\text{data}}$、$\varepsilon\sim N(0,1)$，两者 independent，定义

$$x_t=\alpha_tx+\sigma_t\varepsilon,\qquad t\in[0,1]$$

$\alpha_t$ 从 0 增到 1，$\sigma_t$ 从 1 降到 0：$t=0$ 是纯 noise，$t=1$ 是 data。本页的例子取 $\alpha_t=t$、$\sigma_t=1-t$，6.S184 叫它 CondOT path，π0 也用它。$x_t$ 的 density 是

$$p_t(y)=\int N\big(y;\ \alpha_tx,\ \sigma_t^2\big)\,p_{\text{data}}(x)\,dx$$

也就是 $\alpha_tx$ 与 $\sigma_t\varepsilon$ 这两个 independent random variable 之和的 convolution（[ST2131 第 6 站](../courses/ST2131.html#transform)）。$p_{\text{data}}$ 是 Gaussian mixture 时它有 closed form：第 $k$ 个 component $N(\mu_k,s^2)$ 经过这一步变成 $N(\alpha_t\mu_k,\ v_t)$，$v_t=\alpha_t^2s^2+\sigma_t^2$，因为 independent normal 之和仍是 normal，variance 相加，constant 乘进去要平方。本页的 $s=0.5$，$t=0.5$ 时两个 component 是 $N(\pm1,\ 0.3125)$。

### 能学的只有一个量：posterior mean

$p_t$ 和 $p_{\text{data}}$ 一样写不出来，高维时同样卡在 normalization。可是 $(x,x_t)$ 这样的 pair 要多少有多少：从 dataset 取一个 $x$，抽一个 $\varepsilon$，算出 $x_t$。拿 $x_t$ 去 regress $x$，loss 用 MSE。在每个 $x_t=y$ 处，loss 是 $\mathbb E[(x-c)^2\mid x_t=y]$，和开头一样展开，最小值在

$$D_t(y)=\mathbb E[x\mid x_t=y]$$

所以一个 network $D^\theta_t(y)$ 用最普通的 regression 就能学到它，不需要任何 density（[ST2131 第 5 站](../courses/ST2131.html#hier)：squared error 下最好的 predictor 是 conditional expectation）。它叫 denoiser。改为 regress $\varepsilon$，minimizer 是 $\hat\varepsilon_t(y)=\mathbb E[\varepsilon\mid x_t=y]$。两者由一条 linear 关系绑住：对 $x_t=\alpha_tx+\sigma_t\varepsilon$ 两边取“给定 $x_t=y$”的 conditional expectation，左边就是 $y$ 本身，

$$y=\alpha_t\,D_t(y)+\sigma_t\,\hat\varepsilon_t(y)$$

在 0.8/0.2 的 mixture 上算 $t=0.5$、$y=0.6$。

1. 属于哪个 component。两个 component 的 log likelihood 之差加上 prior 的 log ratio：$\ln\dfrac{0.2}{0.8}+\dfrac{(0.6+1)^2-(0.6-1)^2}{2\times0.3125}=-1.3863+3.84=2.4537$，所以 $w_+=1/(1+e^{-2.4537})=0.9208$，$w_-=0.0792$。
2. Component 内的 posterior mean。在 component $k$ 内，$x$ 和 $x_t$ jointly Gaussian，$\mathrm{Cov}(x,x_t)=\alpha_ts^2$，$\mathrm{Var}(x_t)=v_t$，conditional mean 是 linear 的，slope 是两者之比：$\mathbb E[x\mid y,k]=\mu_k+\dfrac{\alpha_ts^2}{v_t}(y-\alpha_t\mu_k)$。Slope 是 $0.125/0.3125=0.4$，右边 $2+0.4\times(0.6-1)=1.84$，左边 $-2+0.4\times(0.6+1)=-1.36$。
3. 合起来：$D_{0.5}(0.6)=0.9208\times1.84+0.0792\times(-1.36)=1.5867$；由上面的 linear 关系，$\hat\varepsilon_{0.5}(0.6)=(0.6-0.5\times1.5867)/0.5=-0.3867$。

Weight 换回 0.5/0.5，同样三步给出 1.7727，就是 [6.S184 第 5 站](../courses/MIT-6.S184.html#dsm)算的 denoiser。

::fig[thread-noise-to-data-levels] 动图：$t$ 在 0 和 1 之间来回。上面是 $p_t$，下面是 $D_t(y)$。$t$ 接近 1 时 $D_t(y)\approx y$；$t$ 变小，$D_t$ 在两个 component 交界处陡升、两侧变平；$t=0$ 时它是一条水平线。第一帧是 $t=0.5$。

$t=0$ 时 $x_t=\varepsilon$，不含 $x$ 的任何信息，$D_0(y)=\mathbb E[x]=0.8\times(-2)+0.2\times2=-1.2$，与 $y$ 无关。第一次失败的 MSE regression，就是这一族 regression 里 noise 最大的那一个。

### Score 也由 posterior mean 决定

对 $p_t$ 的 integral 求 $y$ 的 derivative。Gaussian 的 derivative 是 $\partial_yN(y;\alpha_tx,\sigma_t^2)=\dfrac{\alpha_tx-y}{\sigma_t^2}N(y;\alpha_tx,\sigma_t^2)$，所以

$$\partial_yp_t(y)=\int\frac{\alpha_tx-y}{\sigma_t^2}\,N(y;\alpha_tx,\sigma_t^2)\,p_{\text{data}}(x)\,dx$$

两边除以 $p_t(y)$。右边的 $N(y;\alpha_tx,\sigma_t^2)\,p_{\text{data}}(x)/p_t(y)$ 由 Bayes rule 正是 posterior $p(x\mid x_t=y)$，于是 integral 变成 posterior 下的 expectation：

$$s_t(y)=\nabla\log p_t(y)=\frac{\alpha_t\,D_t(y)-y}{\sigma_t^2}=-\frac{\hat\varepsilon_t(y)}{\sigma_t}$$

最后一个等号用了 $y-\alpha_tD_t=\sigma_t\hat\varepsilon_t$。这叫 Tweedie's formula。核对：$(0.5\times1.5867-0.6)/0.25=0.7733$；直接对 mixture 求 score，$0.9208\times\dfrac{1-0.6}{0.3125}+0.0792\times\dfrac{-1-0.6}{0.3125}=0.9208\times1.28-0.0792\times5.12=0.7733$。Score 不必单独学，学会 $D_t$ 就有了。CS5788 第 5 站的 denoising score matching 是 $\alpha_t=1$ 的情形：target 是 $(x-\tilde x)/\sigma^2$，它的 conditional mean 正是 $(D-\tilde x)/\sigma^2$。

### 让 sample 跟着 $p_t$ 走：continuity equation

一群点以 velocity $u_t(y)$ 运动，density 是 $p_t$。Interval $[a,b]$ 里的 probability mass 只能从两端进出，单位时间从左往右穿过 $y$ 的 mass 是 $p_tu_t$：

$$\frac{d}{dt}\int_a^bp_t\,dy=p_t(a)u_t(a)-p_t(b)u_t(b)=-\int_a^b\partial_y(p_tu_t)\,dy$$

对任意 interval 成立，所以 $\partial_tp_t=-\partial_y(p_tu_t)$，这是 continuity equation。

现在找 $u_t$。每一对 $(x,\varepsilon)$ 让 $x_t$ 以 velocity $\dot\alpha_tx+\dot\sigma_t\varepsilon$ 运动，但同一个 $y$ 处有很多对在经过。取它们的平均：

$$u_t(y)=\mathbb E\big[\dot\alpha_tx+\dot\sigma_t\varepsilon\ \big|\ x_t=y\big]=\dot\alpha_t\,D_t(y)+\dot\sigma_t\,\hat\varepsilon_t(y)$$

证明它让 sample 一直服从 $p_t$。取任意 smooth、在无穷远处为 0 的 test function $f$。由 chain rule，$\dfrac{d}{dt}\mathbb Ef(x_t)=\mathbb E\big[f'(x_t)(\dot\alpha_tx+\dot\sigma_t\varepsilon)\big]$；先对 $x_t$ condition 再取 expectation（tower rule），$f'(x_t)$ 提到里层 expectation 外面，里面剩下的就是 $u_t(x_t)$：

$$\frac{d}{dt}\mathbb Ef(x_t)=\mathbb E\big[f'(x_t)\,u_t(x_t)\big]$$

写成 integral，右边 integrate by parts：$\int f\,\partial_tp_t\,dy=\int f'\,p_tu_t\,dy=-\int f\,\partial_y(p_tu_t)\,dy$。对所有 $f$ 成立，所以 $p_t$ 满足以 $u_t$ 为 velocity 的 continuity equation。按 ODE $\dot X=u_t(X)$ 移动的 sample，从同一个 $p_0=N(0,1)$ 出发，它的 density 满足同一个 equation，所以每个时刻都是 $p_t$，到 $t=1$ 就是 $p_{\text{data}}$（这里用到 solution 的唯一性，6.S184 第 2 站引的是 notes 的 Theorem 11；那一站另用 conditional path 的 continuity equation 证明同一件事）。

CondOT 下 $\dot\alpha_t=1$、$\dot\sigma_t=-1$，$u_t=D_t-\hat\varepsilon_t$，例子里是 $1.5867+0.3867=1.9733$。用 $y=tD_t+(1-t)\hat\varepsilon_t$ 消去 $\hat\varepsilon_t$，$u_t(y)=\dfrac{D_t(y)-y}{1-t}$。

也可以用 score 写。把 $D_t=(y+\sigma_t^2s_t)/\alpha_t$、$\hat\varepsilon_t=-\sigma_ts_t$ 代进 $u_t=\dot\alpha_tD_t+\dot\sigma_t\hat\varepsilon_t$：

$$u_t(y)=\frac{\dot\alpha_t}{\alpha_t}\,y+\underbrace{\Big(\frac{\dot\alpha_t}{\alpha_t}\sigma_t^2-\dot\sigma_t\sigma_t\Big)}_{a_t}\,s_t(y)$$

CondOT 下 $a_t=\dfrac{(1-t)^2}{t}+(1-t)=\dfrac{1-t}{t}$，例子里 $\dfrac{0.6}{0.5}+1\times0.7733=1.9733$。这个 $a_t$ 在桥 3 还要用。

### 加 noise 也行：diffusion equation 与一族 SDE

[LSM2234 第 6 站](../courses/LSM2234.html#diffusion)从 random walk 推出 $\partial_tP=D\,\partial_y^2P$。因为 $p\,\partial_y\log p=\partial_yp$，

$$D\,\partial_y^2p=\partial_y\big(D\,p\,\partial_y\log p\big)=-\partial_y\big(p\cdot(-D\,\partial_y\log p)\big)$$

和 continuity equation 对照：对 density 来说，coefficient 为 $D$ 的 diffusion 等于一个 velocity $-D\,\partial_y\log p$，把 mass 从 density 高处推向低处。所以在 ODE 上加 noise 而不改变 $p_t$，只要在 drift 里补上反方向的同样大小：

$$dX=\Big[u_t(X)+\frac{g_t^2}{2}\,s_t(X)\Big]dt+g_t\,dW$$

$g_t^2/2$ 就是那个 $D$。验证要用 drift 和 noise 同时存在时的 density equation。走一步 Euler–Maruyama，$X_{t+h}=X_t+hb+g\sqrt h\,\xi$，$\xi\sim N(0,1)$ 与 $X_t$ independent。对 $f$ 做到二阶的 Taylor expansion，$\xi$ 的一次项 mean 为 0，$(g\sqrt h\,\xi)^2$ 的 expectation 是 $g^2h$，其余是 $o(h)$：

$$\mathbb Ef(X_{t+h})-\mathbb Ef(X_t)=h\,\mathbb E[f'b]+\tfrac12g^2h\,\mathbb E[f'']+o(h)$$

除以 $h$、令 $h\to0$，再分别 integrate by parts 一次和两次，得 Fokker–Planck equation $\partial_tp=-\partial_y(pb)+\tfrac{g^2}{2}\partial_y^2p$。代入 $b=u+\tfrac{g^2}{2}s$：

$$\partial_tp=-\partial_y(pu)-\partial_y\Big(\frac{g^2}{2}\,p\,s\Big)+\frac{g^2}{2}\,\partial_y^2p=-\partial_y(pu)$$

后两项因为 $ps=\partial_yp$ 互相抵消，剩下的正是 continuity equation。$g_t$ 可以任意选，而且可以在 training 之后再选，这是 [6.S184 第 4 站](../courses/MIT-6.S184.html#score)的 SDE extension trick（那一站还算出 $g$ 大时 step 要按 $1/g^2$ 缩小）。$u_t=0$、$p_t=p$ 不随时间变时，这个 SDE 就是 Langevin dynamics $dX=\tfrac{g^2}{2}\nabla\log p\,dt+g\,dW$：第三次失败的 sampler 是骨架里没有 path 的那个特例。

### 从 $t=0$ 走到 $t=1$：一步 Euler 为什么等于 MSE

$n$ 步 Euler，$h=1/n$，CondOT 下每一步是

$$y_{t+h}=y+h\,u_t(y)=y+\frac{h}{1-t}\big(D_t(y)-y\big)$$

读法：朝当前的 posterior mean 走剩余路程的 $h/(1-t)$。只走 1 步时 $t=0$、$h=1$，$y_1=D_0(y)=-1.2$，所有 sample 落在同一点，就是第一次失败。最后一步的 $h$ 恰好等于 $1-t$，所以最后一步总是直接输出 $D_t(y)$。用 exact $D_t$，起点取 $N(0,1)$ 的 4000 个 quantile（没有随机性），终点和 $p_{\text{data}}$ 的 4000 个 quantile 逐个比，$W_1$ 是一维的 Wasserstein distance：

| Euler 步数 | 1 | 2 | 3 | 5 | 10 | 20 | 100 |
|---|---|---|---|---|---|---|---|
| 右边 mode 的比例（应为 0.2） | 0 | 0.055 | 0.117 | 0.155 | 0.179 | 0.190 | 0.198 |
| $W_1$ | 1.299 | 0.701 | 0.452 | 0.273 | 0.139 | 0.070 | 0.014 |

0.8 比 0.2 回来了，这是 Langevin 做不到的：sample 从一个 bump 出发，在 $t$ 小、两个 bump 还连在一起的时候就按 weight 分好了边。

> 整个骨架只有一个要学的 function：每个 noise level 上的 posterior mean $D_t$。Score、noise prediction、velocity 都是它和 $y$ 的 linear combination；sampler 只决定沿哪一串 noise level 走、每一步走多远、加多少 noise。

:::wrong Score 指向 density 高的地方，所以沿着 $\nabla\log p_{\text{data}}$ 一直走，就能把 noise 变成 sample
那是 gradient ascent，终点是 mode，不是 sample。在 0.8/0.2 的例子上，4000 个 $[-4,4]$ 里均匀的起点，以 step 0.005 沿 exact score 走 20000 步：48.4% 停在 $2.000$，51.6% 停在 $-2.000$，两个 mode 的 std 都是 0，data 的是 0.5，比例也错。骨架里的 velocity 用的是随时间变化的 $s_t$，还多一项 $\frac{\dot\alpha_t}{\alpha_t}y$；只用 $p_{\text{data}}$ 自己的 score 时，必须像 Langevin 那样加 noise，而那又回到了第三次失败。
:::

## 各门课里的名字

同一个骨架，各门课的时间方向、data 的记号和 network 学的量都不一样。最后一列把它们换成本页的记号：$x_t=\alpha_tx+\sigma_t\varepsilon$，$t=1$ 是 data。

| 课与站 | 在那里叫 | 记号 | data 在哪一端 | 换成本页 |
|---|---|---|---|---|
| [ST2131 第 3 站](../courses/ST2131.html#dist)、[第 6 站](../courses/ST2131.html#transform) | normal、convolution | $\varphi'=-z\varphi$；$f_{X+Y}=f_X*f_Y$ | 没有时间 | $-z$ 是 $N(0,1)$ 的 score；$p_t$ 是一个 convolution |
| [LSM2234 第 6 站](../courses/LSM2234.html#diffusion) | random walk、diffusion equation | $P(x,t)$，$D$，$\langle x^2\rangle=2Dt$ | physical time 从 data 走向 noise | $\alpha=1$，$\sigma^2=2Dt$ |
| [CS5788 第 5 站](../courses/CORNELL-CS5788.html#ebm) | EBM、Langevin、denoising score matching | $E_\theta$，$Z(\theta)$，$\tilde x=x+\sigma\varepsilon$，$\sigma_1>\dots>\sigma_L$ | $\sigma$ 越小越接近 data | $\alpha=1$；$s_\theta(\tilde x,\sigma)$ 是 $s_t$ |
| [CS5788 第 6 站](../courses/CORNELL-CS5788.html#diff) | DDPM | $x_0$，$x_T$，$\bar\alpha_t$，$\varepsilon_\theta(x_t,t)$，$T=1000$ | $t=0$ | $\alpha=\sqrt{\bar\alpha_t}$，$\sigma=\sqrt{1-\bar\alpha_t}$；$\varepsilon_\theta$ 是 $\hat\varepsilon$ |
| [6.S184 第 2](../courses/MIT-6.S184.html#path)、[3](../courses/MIT-6.S184.html#fm)、[4](../courses/MIT-6.S184.html#score)、[5 站](../courses/MIT-6.S184.html#dsm) | flow matching、score、SDE | $z$ 是 data，$x=\alpha_tz+\beta_t\varepsilon$，$u^\theta_t$，$D_t$ | $t=1$ | 相同，$\beta_t$ 就是 $\sigma_t$ |
| [6.S978 第 6](../courses/MIT-6.S978.html#diff)、[8 站](../courses/MIT-6.S978.html#fast)，[CS231N 第 8 站](../courses/STANFORD-CS231N.html#gen) | rectified flow、$v$-prediction、MeanFlow | $x_t=(1-t)x+t\varepsilon$，$v=\varepsilon-x$ | $t=0$ | 本页的 $t$ 是那里的 $1-t$，velocity 反号 |
| [RB4301 第 6 站](../courses/RB4301.html#gen) | diffusion policy；π0 的 flow matching | $A^k$，$k=1,\dots,K$；$A^\tau=\tau A+(1-\tau)\varepsilon$ | DDPM 部分 $k=0$；π0 部分 $\tau=1$ | data 换成 $p(A\mid O)$ |
| [CS285 第 1 站](../courses/BERKELEY-CS285.html#il) | flow matching policy | $A_{t,\tau}=\tau A_t+(1-\tau)A_{t,0}$，$v_\theta(o_t,A_{t,\tau},\tau)$ | $\tau=1$ | 相同；下标 $t$ 是 control step，$\tau$ 才是这里的 $t$ |
| [HF-LEROBOT 第 4 站](../courses/HF-LEROBOT.html#vla) | `NOISE_AT_ONE` | $x_t=t\varepsilon+(1-t)a$，$u=\varepsilon-a$，$dt=-0.1$ | $t=0$ | 同 6.S978 |
| [EE4706 第 7 站](../courses/EE4706.html#sys) | real-time chunking（RTC） | $A^\tau$，$\hat A^1$，$W$，$r_\tau$，$\beta$，$H$，$s$，$d$ | $\tau=1$ | $\hat A^1$ 是 $D_\tau$ |

## 逐门课：每一门往骨架上加了什么

### ST2131：骨架用到的三件 probability

[第 6 站](../courses/ST2131.html#transform)的 convolution 给出 $p_t$；independent normal 之和仍是 normal（CS5788 第 6 站照 PS3 用配方证过），所以 mixture data 的 $p_t$ 有 closed form，本页每个数都能精确算。[第 5 站](../courses/ST2131.html#hier)的 conditional expectation 用了两次：regression 学到的是 $D_t$；证明 continuity equation 时用 tower rule 把 $\dot\alpha_tx+\dot\sigma_t\varepsilon$ 换成它的 conditional mean。

[第 3 站](../courses/ST2131.html#dist)求 $E[Z^2]=1$ 时用的 $\varphi'(z)=-z\varphi(z)$，换个说法是 $N(0,1)$ 的 score 等于 $-z$。那一步 integrate by parts 和 CS5788 第 5 站 Hyvärinen 的 score matching 是同一步。Hyvärinen 的 identity 是 $\mathbb E_p[s_\theta\,\partial\log p]=-\mathbb E_p[s_\theta']$；取 $p=\varphi$、$\partial\log p=-z$、$s_\theta(z)=z$，左边是 $\mathbb E[z\cdot(-z)]=-E[Z^2]$，右边是 $-\mathbb E[1]=-1$，就是 ST2131 的那一行。

### LSM2234：forward process 是一次真的 diffusion

[第 6 站](../courses/LSM2234.html#diffusion)从 random walk 推出 $\langle x^2\rangle=2Dt$，从一点出发的 solution 是 variance $2Dt$ 的 Gaussian。放进骨架：一群 molecule 自由 diffuse $t$ 秒，就是 $\alpha=1$、$\sigma=\sqrt{2Dt}$ 的 corruption，concentration 是初始 concentration 和这个 Gaussian 的 convolution。LSM2234 的 $D=L^2/(2\Delta t)$ 也说明了 Euler–Maruyama 的 noise 为什么乘 $\sqrt h$：每步走 $L=\sqrt{2D\Delta t}$，正比于 $\sqrt{\Delta t}$，[6.S184 第 1 站](../courses/MIT-6.S184.html#ode)专门讲了乘 $h$ 为什么错。LSM2234 只往一个方向走，concentration 只会摊平。往回走要什么，见桥 1。

### CS5788：score、DDPM 与 likelihood

[第 5 站](../courses/CORNELL-CS5788.html#ebm)提供了第二、三次失败和它们的出路。Denoising score matching 是骨架在 $\alpha=1$ 时的样子，那一站在 0.8/0.2 的例子上核对过 regression 的最优 output 和 noisy density 的 score 都是 1.989。Annealed Langevin 在每个 noise level 上只用 Langevin，不用 continuity equation 把 sample 推到下一级；Song 等人（2021）把两者合在一起，叫 predictor–corrector：predictor 是 reverse SDE 的一步数值解，corrector 是 Langevin。

[第 6 站](../courses/CORNELL-CS5788.html#diff)的 DDPM 是离散时间的版本：$x_t=\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\,\varepsilon$，network 学 $\hat\varepsilon$。它往骨架上加的是 likelihood：把 reverse chain 当成 encoder 固定的 VAE，ELBO 拆出每个 $t$ 一项 KL，每项是 $\lambda_t\|\varepsilon-\varepsilon_\theta\|^2$，$\lambda_1=0.500$、$\lambda_{100}=0.0101$。$L_{\text{simple}}$ 把所有 $\lambda_t$ 换成 1，每个 $t$ 上的 minimizer 不变，仍是骨架的 $\hat\varepsilon_t$；变的是 network 有误差时误差分到哪些 $t$ 上（CIFAR-10 上 FID 从 13.51 到 3.17）。Song 等人（2021）指出 DDPM 的加 noise 过程是 VP SDE $dx=-\tfrac12\beta(t)x\,dt+\sqrt{\beta(t)}\,dW$ 的 discretization。那一站用 exact $\varepsilon^*$ 跑完 1000 步 DDPM，右边是 19.9%。

### 6.S184：continuous time 的完整证明，和 guidance

这一页的骨架在 [6.S184](../courses/MIT-6.S184.html#path) 里有完整的另一套证明：[第 2 站](../courses/MIT-6.S184.html#path)用每个 conditional path 的 continuity equation 证 marginalization trick；[第 3 站](../courses/MIT-6.S184.html#fm)证明对 conditional target 做 regression 和对 marginal field 做 regression 只差一个 constant，并说明只要 data 不止一个点，loss 就降不到 0（那一页例子的下限 2.7777 是 target 的 conditional variance 的平均）；[第 4 站](../courses/MIT-6.S184.html#score)推 Fokker–Planck、证 SDE extension trick，并算出 noise 大时 Euler 的 stability 条件 $h<0.8/\sigma^2$；[第 5 站](../courses/MIT-6.S184.html#dsm)把 velocity、score、$\hat\varepsilon$、$D$ 四种 parameterization 互相换算，并说明换 parameterization 等于换 loss 在各个 $t$ 上的 weight（flow matching loss 是 noise prediction loss 乘 $1/t^2$）。

它往骨架上加的新东西是 [第 6 站](../courses/MIT-6.S184.html#cfg)的 guidance：要从 $p(x\mid y)$ sample 时，由 Bayes rule，$\nabla\log p_t(x\mid y)=\nabla\log p_t(x)+\nabla\log p_t(y\mid x)$，代进 $u=\frac{\dot\alpha}{\alpha}x+a_ts$，

$$u_t(x\mid y)=u_t(x)+a_t\,\nabla_x\log p_t(y\mid x)$$

再把第二项放大 $w$ 倍就是 classifier guidance，消掉 classifier 就是 CFG。桥 3 会看到 RTC 用的正是这个式子，$w=1$。

### 6.S978 与 CS231N：设计空间，以及怎样少走几步

[6.S978 第 6 站](../courses/MIT-6.S978.html#diff)和 [CS231N 第 8 站](../courses/STANFORD-CS231N.html#gen)用 $x_t=(1-t)x+t\varepsilon$，时间方向和本页相反，velocity 是 $\varepsilon-x$。6.S978 加的是“在骨架里怎么选”：同一个 DiT 上 path 从 VP 换成 linear，FID 从 39.8 降到 34.8（SiT）；预测 $v$、$x$、$\varepsilon$ 的 minimizer 相同，loss 的 weight 差 $1/(1-t)^2$ 或 $1/t^2$；training 时 $t$ 用 logit-normal 多取中间；分辨率变高时 $t$ 要往 noise 一端推。

[第 8 站](../courses/MIT-6.S978.html#fast)从骨架的 Euler 表第一列出发：一步 Euler 的终点是纯 noise 处的 posterior mean，也就是 data 的 mean。要一步生成，就得换一个学习对象。Consistency model 学“映到 trajectory 终点”的 function；MeanFlow 学一段时间上的平均 velocity $u(z_t,r,t)$，一步就是 $z_0=z_1-u(z_1,0,1)$，靠 MeanFlow identity 把 target 里的 integral 换成一次 Jacobian–vector product。

### RB4301 与 CS285：action chunk 就是 data

[RB4301 第 6 站](../courses/RB4301.html#gen)把骨架原样搬到 action 上，只是 data distribution 换成 $p(A\mid O)$，network 多一个 observation input，$D$ 变成 $\mathbb E[A\mid A^k,O]$。那一站用 exact minimizer 跑 reverse chain 的表格，就是骨架里“朝当前 posterior mean 走一段”的 DDPM 版本：$k=50$ 时属于左 mode 的 posterior 是 0.439，$\mathbb E[x_0\mid x_k]=0.107$ 指向两个 mode 之间；到 $k=10$ posterior 已是 0.004，之后只在一个 mode 内细化。它还算了 flow matching 只走 1、2、10 步时落进 obstacle 的比例：100%、41.7%、0.97%。[第 7 站](../courses/RB4301.html#chunk)说明 data 为什么是一整段 chunk 而不是一个 action；[第 8 站](../courses/RB4301.html#vla)的 π0 用 3 亿 parameter 的 action expert 做这里的 $u_t$。

[CS285 第 1 站](../courses/BERKELEY-CS285.html#il)补了两条 training 时的必要条件：target $A_t-A_{t,0}$ 里含有 noise，每个 noise 才和一个具体的 action 配了对；network 必须以 $\tau$ 为 input，看不到 $\tau$ 时它只能学一个对 $\tau$ 平均的 field，10 步 Euler 后只有 71.5% 的 sample 落在 mode 的 0.1 以内。

### HF-LEROBOT：代码里的 convention

[第 4 站](../courses/HF-LEROBOT.html#vla)把骨架落到 SmolVLA 和 π0 的代码上。一次 inference 先把 image、文字、state 的 prefix 过一遍 VLM 存成 KV cache，然后 10 步 Euler 每一步只过 action expert：骨架里的 $n$ 次 $u_t$ evaluation 只碰那个小 network。它的 convention 是 openpi 的 `NOISE_AT_ONE`，$t=1$ 是 noise，sampling 时 $dt=-0.1$，写反了不会报任何错。Training 时 $t$ 取自 $\mathrm{Beta}(1.5,1)$，偏向 $t=1$ 那一端，也就是 noise 多的一端；π0 论文用自己的 $\tau$（$\tau=0$ 是 noise）说同一件事：beta distribution 强调“lower (noisier) timesteps”。两种写法方向相反，强调的是同一端。

### EE4706：sampling 要赶上 controller

[第 7 站](../courses/EE4706.html#sys)把骨架放进 control loop：$n$ 步 Euler 加上 prefill 要几十到几百 ms，50 Hz 的 controller 每 20 ms 就要一个 action，于是旧 chunk 还在执行时新 chunk 就得开始算。RTC 在 denoising 的每一步把新 chunk 的前几个 action 拉向旧 chunk 已经确定的部分，不需要重新 train。那一站给出了 guidance 的公式、soft mask 和 $d\le H/2$；这个公式从哪来，见桥 3。

## 课程页里没有写的三座桥

### 桥 1：Fick's law 的 flux 就是 probability flow ODE

LSM2234 的 diffusion equation 和 6.S184 的 continuity equation 是同一个 equation 的两种读法。Fick's first law 说 diffusion 的 flux 是 $J=-D\,\partial_xc$，从 concentration 高处流向低处。任何 flux 都可以写成“concentration 乘平均 velocity”，$J=c\,v$，所以

$$v(x,t)=\frac{J}{c}=-D\,\frac{\partial_xc}{c}=-D\,\partial_x\log c(x,t)$$

把 $c$ 归一化成 probability density，$\partial_x\log c$ 就是 score。Diffusion equation $\partial_tc=D\,\partial_x^2c=-\partial_x(c\,v)$ 正是以这个 $v$ 为 velocity 的 continuity equation。所以让每个 molecule 不再随机走，改为按 $\dot x=-D\,\partial_x\log c(x,t)$ 平滑地移动，concentration 随时间的变化和真正的 diffusion 完全一样。Song 等人（2021）的 probability flow ODE $dx=\big[f-\tfrac12g^2\nabla\log p_t\big]dt$ 取 $f=0$、$g^2=2D$ 就是这个式子。

| LSM2234 | 骨架、6.S184、score SDE 论文 |
|---|---|
| Concentration $c(x,t)$，physical time 向 noise 走 | $p_t$（本页时间方向下是 $p_{1-t}$） |
| $D$ | $g^2/2$ |
| $\langle x^2\rangle=2Dt$ | $\sigma^2$（$\alpha=1$） |
| Fick flux $J=-D\,\partial_xc$ | $p\cdot\big(-\tfrac{g^2}{2}s\big)$ |
| Random walk，每步 $\pm L$ | SDE，Euler–Maruyama 每步 $g\sqrt h\,\xi$ |
| 没有 noise 的 Fick velocity | probability flow ODE |

**同一个数，两边各算一遍。** 一根 axon 里，起初 80% 的 protein 聚在 $-2$ µm 附近、20% 聚在 $2$ µm 附近，各有 std 0.5 µm 的 spread，$D=0.5$ µm²/s。这就是本页的 0.8/0.2 mixture。4 s 之后两个 component 是 $N(\pm2,\ 0.25+2\times0.5\times4)=N(\pm2,\ 4.25)$，在 0 右边的比例是 $0.8\,\Phi(-2/\sqrt{4.25})+0.2\,\Phi(2/\sqrt{4.25})=0.2996$。这正是开头给 data 加 std 为 2 的 noise 之后的那个单峰 distribution（唯一的 maximum 在 $-1.83$）。

- LSM2234 的做法：4000 个 molecule，每 0.01 s 随机走 $\pm0.1$ µm（$L^2/(2\Delta t)=0.5$），400 步，0 右边的比例是 0.299（numpy `default_rng(0)`）。
- Fick velocity 的做法：同样 4000 个起点，按 $\dot x=-D\,\partial_x\log c$ 用 RK4 走到 4 s，比例是 0.313。它没有 noise，结果完全由起点决定：一维的 flow 保持大小顺序（[6.S184 第 1 站](../courses/MIT-6.S184.html#ode)），4 s 时在 0 右边的，恰好是起点在 $-1.424$ 右边的那些，exact 的比例正是 0.2996；这 4000 个起点里有 31.3% 在 $-1.424$ 右边，和 0.2996 的差在 4000 个 sample 的 error bar（$\pm0.014$）里。

单个 molecule 的走法和 random walk 完全不同：从 $-2.5$ 出发的平滑地移到 $-4.07$，从 $-1.5$ 出发的移到 $-0.22$，从 $1.6$ 出发的往左移到 $1.46$，都被推离自己所在 bump 的中心。只有一个 bump 时，离中心的距离按 $\sqrt{(0.25+t)/0.25}$ 放大，4 s 时是 4.12 倍，这是 MSD 的 $\sqrt t$ 规律的 deterministic 版本；$-2.5$ 那个几乎正是如此（$-2-0.5\times4.12=-4.06$）。两个 bump 互相挤压时就不再是简单的放大，从 1.6 出发的那个只移到 1.46。

::fig[thread-noise-to-data-fick] 动图：同一组 30 个 molecule。上排每 0.01 s 随机走一步，下排按 Fick velocity 平滑移动；0 到 4 s 两排上方的 concentration 曲线始终相同。4 s 之后上排接着 random walk，越摊越开；下排把 velocity 倒着走，回到两个 bump。彩色是起初在右边的 molecule，读数是此刻 0 右边的个数。

**倒过来走。** 生成要的是反方向：从摊平的 concentration 回到两个 bump。随机走不回去：把 random walk 再跑 4 s，0 右边的比例是 0.351（exact 0.346），只会更平。Fick velocity 可以倒着走：从 $c(\cdot,4)$ 新抽 4000 个 molecule，沿同一个 ODE 从 4 s integrate 回 0，右边是 0.196，两个 bump 的 std 是 0.513 和 0.508（应为 0.2 和 0.5）。也可以边走边加 noise：Anderson 的 reverse-time SDE（Song 等人 2021 引用）在时间倒流时 drift 是 $+g^2\nabla\log p$，这里每一步 $x\leftarrow x+h\cdot2D\,\partial_x\log c+\sqrt{2Dh}\,\xi$，结果是 0.202，std 0.519 和 0.506。它的 drift 是 Fick velocity 的两倍，多出的那一份正好抵消新加的 noise，就是骨架里 $g^2=2D$ 的那个 SDE。

两种倒走都要每个时刻 concentration 的 score。Molecule 的例子里 $c$ 有 formula；生成时没有，只能用骨架的办法：学 $D_t$，再用 Tweedie 换成 score。$\alpha=1$ 时 $s=(D_t-x)/(2Dt)$。按下一座桥的换算，diffuse 4 s 相当于 noise 与 signal 之比 $\sigma/\alpha=2$，即本页的 $t=1/3$、DDPM linear schedule 的第 397 步。

:::wrong Reverse SDE 的 drift 是 $2D\,\partial_x\log c$，去掉 noise 项就得到 deterministic 的版本
Deterministic 的版本是 drift 减半的 probability flow ODE，不是把 noise 删掉。保留 $2D\,\partial_x\log c$、删掉 $\sqrt{2Dh}\,\xi$，同样 4000 个 molecule 从 4 s 走回 0：两个 bump 的 std 只有 0.172 和 0.157，右边是 15.5%。那多出来的一份 drift 本来是用来抵消 noise 的摊平作用的，noise 没了，它就把每个 bump 压得过窄。
:::

### 桥 2：一把换算 noise level 的尺子；DDIM 就是直线 path 上的 Euler

各门课的 $t$ 不能直接比，能比的是 noise 与 signal 之比 $\sigma/\alpha$。一个 $x_t$ 乘上任何 constant 都不改变它含有的信息，$x_t/\alpha=x+(\sigma/\alpha)\varepsilon$，posterior 只依赖 $\sigma/\alpha$。所以两个 convention 下 $\sigma/\alpha$ 相同的点，posterior mean 相同，位置只差一个比例。

| DDPM 的 $t$（linear，$T=1000$） | 100 | 250 | 400 | 500 | 750 |
|---|---|---|---|---|---|
| $\bar\alpha_t$ | 0.897 | 0.524 | 0.195 | 0.0786 | 0.00335 |
| $\sigma/\alpha=\sqrt{(1-\bar\alpha_t)/\bar\alpha_t}$ | 0.339 | 0.953 | 2.031 | 3.424 | 17.25 |
| 本页、6.S184、π0：$t=\alpha/(\alpha+\sigma)$ | 0.747 | 0.512 | 0.330 | 0.226 | 0.055 |
| 6.S978、LeRobot：$t=\sigma/(\alpha+\sigma)$ | 0.253 | 0.488 | 0.670 | 0.774 | 0.945 |
| LSM2234，$D=0.5$：diffuse 的秒数 $(\sigma/\alpha)^2$ | 0.115 | 0.908 | 4.12 | 11.7 | 297 |

::fig[thread-noise-to-data-ruler] 四种时间记号对着同一个 $\sigma/\alpha$ 排成四把尺子。竖线是 DDPM 的 $t=500$。

核对一次。取 CS5788 第 6 站核对 reverse posterior 时用过的 DDPM $t=500$、$x_t=0.3$，data 换成 0.8/0.2 的 mixture，exact 的 $\hat x_0=-0.9046$。换到本页的 convention：$\alpha+\sigma=0.2803+0.9599=1.2403$，位置除以它得 $y=0.2419$，$t=0.2803/1.2403=0.2260$；在那里直接算 $D_{0.226}(0.2419)$，同样是 $-0.9046$。

**DDIM 是 Euler。** CS5788 第 6 站写了 DDIM 的 deterministic 一步：

$$x_{t'}=\sqrt{\bar\alpha_{t'}}\,\hat x_0+\sqrt{1-\bar\alpha_{t'}}\,\hat\varepsilon$$

$\hat x_0$、$\hat\varepsilon$ 是在 $x_t$ 处算出的。把位置除以 $c_t=\sqrt{\bar\alpha_t}+\sqrt{1-\bar\alpha_t}$，得 $y=x_t/c_t$，它落在本页的直线 path 上，时间是 $\tau=\sqrt{\bar\alpha_t}/c_t$：$y=\tau\,x+(1-\tau)\,\varepsilon$。在 $y$ 处的 posterior mean 还是同一对 $\hat x_0$、$\hat\varepsilon$。在直线 path 上走一步 Euler，velocity 是 $\hat x_0-\hat\varepsilon$：

$$y'=y+(\tau'-\tau)(\hat x_0-\hat\varepsilon)=\tau\hat x_0+(1-\tau)\hat\varepsilon+(\tau'-\tau)(\hat x_0-\hat\varepsilon)=\tau'\hat x_0+(1-\tau')\hat\varepsilon$$

第二个等号用了 $y=\tau\hat x_0+(1-\tau)\hat\varepsilon$（骨架里那条 linear 关系）。再乘回 $c_{t'}$，$c_{t'}\tau'=\sqrt{\bar\alpha_{t'}}$，$c_{t'}(1-\tau')=\sqrt{1-\bar\alpha_{t'}}$，正是 DDIM 的那一行。数值上：从 $t=500$、$x=0.3$ 走到 $t=400$，DDIM 给 0.117774；Euler 在直线 path 上从 $\tau=0.2260$ 走到 $0.3299$，再乘回 $c_{400}$，也是 0.117774。DDIM 论文第 4.3 节说它是另一组坐标（$x/\sqrt{\bar\alpha}$ 对 $\sqrt{(1-\bar\alpha)/\bar\alpha}$）里的 Euler，道理相同：两组坐标里 path 对时间都是 linear 的，Euler 在 linear path 上沿用当前的 $\hat x_0$、$\hat\varepsilon$ 不会走偏。在 $\alpha_t$ 对时间不是 linear 的坐标里（比如 DDPM 自己的 $t$），Euler 就不等于 DDIM 了。

**Diffusion Policy 与 π0 是同一个 sampler。** RB4301 第 6 站的两半因此接上了：Diffusion Policy 用 DDIM 走 10 步，π0 用 Euler 走 10 步，都是直线 path 上的 Euler，区别只在 time grid。Diffusion Policy 的 config 是 100 个 training step 的 cosine schedule（`squaredcos_cap_v2`）；diffusers 0.11.1 的 DDIM 把 10 步取在 $t=90,80,\dots,0$。换算到本页的 $t$，这一串是 0.124、0.234、0.327、0.410、0.489、0.568、0.649、0.739、0.844、0.976，最后到 1：step size 两头大、中间小。第一步的 $t$ 是 0.124 而不是 0：代码从 $N(0,1)$ 抽出的纯 noise 被当作 $t=90$ 的 $x_t$，而那里的 $\sqrt{\bar\alpha}=0.140$。Lin 等人（2023）把这种取法叫 leading spacing，并指出它不包含最后一个 timestep。同一个 exact velocity、同一组 4000 个 quantile 起点（这里不做代码里的 `clip_sample`，本页的 data 没有 normalize 到 $[-1,1]$）：

| Sampler | NFE | 右边 mode 的比例（应为 0.2） | $W_1$ |
|---|---|---|---|
| π0：均匀 grid，从 $t=0$ 出发 | 10 | 0.179 | 0.139 |
| Diffusion Policy：DDIM，从 $t=0.124$ 出发 | 10 | 0.228 | 0.193 |
| 同一个 cosine grid，前面补一步从 $t=0$ 出发 | 11 | 0.179 | 0.141 |
| Diffusion Policy 真机 eval 的 16 步 DDIM（仍从 $t=90$ 出发） | 16 | 0.236 | 0.205 |
| 均匀 grid | 16 | 0.187 | 0.088 |

在这个例子里 grid 的形状几乎不影响结果（第一、三行），起点错位才影响：从 $t=0.124$ 出发，右边 mode 偏多，步数加到 16 也不改善，因为错位的是起点的 distribution，不是 discretization。

::fig[thread-noise-to-data-grid] 同一个 exact velocity、同样 28 个 quantile 起点。左边 π0 的均匀 grid；右边 Diffusion Policy 的 10 步 DDIM 换算到本页的 $t$ 上，起点在 0.124。横轴下的短线是每一步的位置，彩色是终点在右边 mode 的 trajectory；底下的数用的是 4000 个起点。

:::wrong Diffusion policy 和 flow matching policy 是两种 model，一个 noise prediction 的 checkpoint 不能拿来当 velocity 用
在每个 noise level 上，两者学的都是同一个 posterior 的 linear function。$\hat\varepsilon$ 的 checkpoint 先换出 $\hat x_0=(x_t-\sqrt{1-\bar\alpha_t}\,\hat\varepsilon)/\sqrt{\bar\alpha_t}$，再按上表换时间、换尺度，就是直线 path 上的 velocity $\hat x_0-\hat\varepsilon$。RTC 的论文也说，diffusion policy 可以在 inference 时换成 flow policy 使用。不同的是 training 时 loss 在各个 $t$ 上的 weight（6.S184 第 5 站、6.S978 第 6 站），network 有误差时，误差落在哪些 $t$ 上不一样。
:::

### 桥 3：RTC 就是 classifier guidance，classifier 是一个以 denoiser 为中心的 Gaussian

EE4706 第 7 站的 RTC 公式（$\tau=0$ 是 noise，与本页相同）：

$$v_{\text{guided}}=v+\min\Big(\beta,\ \frac{1-\tau}{\tau\,r_\tau^2}\Big)\,(Y-\hat A^1)^\top\mathrm{diag}(W)\,\frac{\partial\hat A^1}{\partial A^\tau}$$

$$\hat A^1=A^\tau+(1-\tau)\,v,\qquad r_\tau^2=\frac{(1-\tau)^2}{\tau^2+(1-\tau)^2}$$

那一站没有说这些量从哪来。它们全是骨架和 6.S184 第 6 站里的量：

| RTC | 骨架与 6.S184 | 为什么 |
|---|---|---|
| $\hat A^1=A^\tau+(1-\tau)v$ | $D_\tau(y)$ | $u=(D-y)/(1-\tau)$ 反解：沿当前 velocity 一步走到 $\tau=1$ 就是 posterior mean |
| $\frac{1-\tau}{\tau}$ | $a_\tau$ | score 换成 velocity 的 coefficient，CondOT 下是 $(1-\tau)/\tau$ |
| 旧 chunk 剩下的 action $Y$ | prompt $y$ | 要 condition 的东西 |
| $\mathrm{diag}(W)$ | observation operator | 只看 chunk 的前一段，soft mask 给出每个位置看得多重 |
| $r_\tau^2$ | data 是 $N(0,1)$ 时 $\mathrm{Var}(A^1\mid A^\tau)$ | jointly Gaussian：$1-\frac{\tau^2}{\tau^2+(1-\tau)^2}=\frac{(1-\tau)^2}{\tau^2+(1-\tau)^2}$ |

6.S184 的 guided field 是 $u_\tau(x\mid Y)=u_\tau(x)+a_\tau\nabla_x\log p_\tau(Y\mid x)$。Classifier $p_\tau(Y\mid A^\tau)$ 不知道。ΠGDM 的近似是把 posterior $p(A^1\mid A^\tau)$ 当成以 $\hat A^1$ 为中心、variance 为 $r_\tau^2$ 的 Gaussian，于是 $\log p_\tau(Y\mid A^\tau)\approx-\frac{1}{2r_\tau^2}\sum_iW_i\big(Y_i-\hat A^1_i\big)^2$。对 $A^\tau$ 求 gradient，chain rule 经过 $\hat A^1$：

$$\nabla_{A^\tau}\log p_\tau(Y\mid A^\tau)\approx\frac{1}{r_\tau^2}\,(Y-\hat A^1)^\top\mathrm{diag}(W)\,\frac{\partial\hat A^1}{\partial A^\tau}$$

乘上 $a_\tau=(1-\tau)/\tau$，就是 RTC 公式里 $\min$ 截断之前的那一项。RTC 引用的 Pokle 等人（2023）正是这样推的：他们的 guidance coefficient 是 $\sigma_\tau^2\,\frac{d}{d\tau}\ln(\alpha_\tau/\sigma_\tau)$，CondOT 下化简成 $(1-\tau)/\tau$，和骨架的 $a_t=\frac{\dot\alpha}{\alpha}\sigma^2-\dot\sigma\sigma$ 是同一个量；$r_\tau^2=\sigma_\tau^2/(\sigma_\tau^2+\alpha_\tau^2)$ 明确假设了 data 是 $N(0,I)$。

**截断从哪一步开始起作用。** $\tau=0.2$ 时 $a=4$，$r^2=0.64/0.68=0.9412$，weight 是 $4/0.9412=4.25$；$\tau\to0$ 时 weight 趋于无穷。RTC 的 appendix 说，用 5 步 denoising 时只要 $\beta\ge4.25$，截断只影响第一步（$\tau=0$），和这个数对得上。论文用 $\beta=5$、5 步。

**同一个例子，两边各算一遍。** 一个 16 步的 chunk，每步一个 lateral offset。Demonstration 有两个 mode：80% 从 obstacle 下方绕（$-2$ 乘一个以第 12 步为中心、宽 3 步的 bump），20% 从上方绕（$+2$ 乘同一个 bump），每步 independent 地加 std 0.3 的抖动。旧 chunk 是上方 mode 的一个 sample，已执行 $s=8$ 步时拍下新 observation，inference 的 $d=3$ 步里继续执行旧 chunk；新 chunk 覆盖第 8 到 23 步。Mask 按 EE4706 的 soft mask，$H=16$、$s=8$、$d=3$：前 3 个是 1，然后是 0.631、0.368、0.189、0.077、0.018，其余 0。

- 6.S184 那一边：在 $\tau=0.4$ 的一个随机 $A^\tau$ 处，用 finite difference 对 $\log N\big(Y;\ \hat A^1(A^\tau),\ r_\tau^2/W\big)$ 求 gradient，乘 $a_\tau=1.5$。
- EE4706 那一边：同一点按 RTC 公式算 vector–Jacobian product，$\partial\hat A^1/\partial A^\tau$ 用 Gaussian mixture 的 closed form。

16 个 coordinate 逐个相同，最大差 $4\times10^{-8}$，是 finite difference 的 error（前四个是 11.235、16.834、22.003、25.657）。

然后看它管不管用。4000 个新 chunk（numpy `default_rng(0)`），exact velocity，5 步 Euler，统计新 chunk 有多少接着从上方走，以及新 chunk 第一个真正执行的 action（第 11 步）和旧 chunk 在这一步的差（中位数）：

| 新 chunk 怎样生成 | 接着从上方走 | 第 11 步与旧 chunk 之差 |
|---|---|---|
| 不加 guidance（EE4706 的 naive async） | 12.4% | 3.60 |
| RTC，hard mask，5 步 | 60.4% | 0.89 |
| RTC，soft mask，5 步 | 69.1% | 0.82 |
| RTC，soft mask，10 步 | 92.1% | 0.23 |
| RTC，soft mask，100 步 | 97.2% | 0.16 |
| 给定前 3 步的 exact conditional | 100% | |

不加 guidance 时比 0.2 还少，是 5 步 Euler 本身的 bias（100 步时是 19.6%）。Soft mask 比 hard mask 好，和 EE4706 引的论文结论方向一致。但 5 步的 RTC 仍有约三成新 chunk 换到了另一个 mode，exact 的 conditional 一个都不会换。差在 $r_\tau^2$：它按 $N(0,1)$ 的 data 算 posterior 的宽度，而这里一个 mode 内的 posterior variance 在 $\tau=0.2$ 时只有 $0.3^2\times0.64/(0.04\times0.09+0.64)=0.089$，Gaussian “classifier” 宽了十倍，guidance 在 mode 还没定下来的那几步拉得太轻。这和 6.S184 第 6 站说 CFG sample 到的既不是 $p(x\mid y)$ 也不是 sharpened distribution 是同一个教训：guidance 是一个近似的 conditional score，不是 exact 的 conditioning。

::fig[thread-noise-to-data-rtc] 动图：横轴是 control step，灰块是 obstacle。黑线是旧 chunk（从上方绕），浅色底是 mask。动起来时 8 个新 chunk 从 noise 经 5 步 Euler 变成 action。上面没有 guidance，8 个都换到了下方：执行时第 10 步还是旧 chunk 的上方，第 11 步就到了下方，这一步的连线穿过 obstacle。下面 RTC 拉住了前几步，这 8 个里 7 个接着从上方走（4000 个里是 69%）。第一帧是最后的结果。

:::wrong RTC 冻结了前 $d$ 个 action，所以新 chunk 一定和旧 chunk 在同一个 mode 里
RTC 并不改写这 $d$ 个 action，它只在 velocity 上加一个 guidance 项，让 denoising 往和它们一致的方向走。5 步、soft mask 时，新 chunk 前 3 步和旧 chunk 的平均偏差还有 0.43（10 步时 0.20），31% 的新 chunk 后半段走了另一个 mode。真正执行时前 $d$ 个 action 取自旧 chunk，跳变就挪到了第 $d$ 步。要不跳，靠的是 guidance 足够强、denoising 步数足够多。
:::

:::from
骨架的推导是为这一页重写的：posterior mean 作为唯一要学的量、Tweedie's formula、用 test function 与 tower rule 证明 marginal velocity 满足 continuity equation、从 LSM2234 的 diffusion equation 出发得到 SDE 一族，顺序和记号对齐了 6.S184 的 lecture notes（经 [6.S184 页面](../courses/MIT-6.S184.html#path)转引，这次没有重读 notes）。各门课的说法都对着那一站的正文核过，CS5788、RB4301、CS285、6.S184 里引用的数字（47.4%、21.5%、19.9%、37.2%、1.989、2.7777、0.439、100% 与 41.7%、71.5%、FID 13.51 与 3.17、39.8 与 34.8）取自那些站。

读过的外部原文（WebFetch 返回的是逐段转述和重建的 formula，不是逐字原文）：

- Black、Galliker 与 Levine，[Real-Time Execution of Action Chunking Flow Policies](https://arxiv.org/html/2506.07339v2)：flow 的 convention 与 Euler 的写法、$\hat A^1$、guidance 公式、$r_\tau^2$、soft mask、Appendix A.5 的 $\beta=5$ 与 5 步、“$\beta\ge4.25$ 时截断只影响第一步”、diffusion policy 可在 inference 时换成 flow policy、引用的 Pokle 等人与 ΠGDM。论文没有推导 $r_\tau^2$。
- Pokle、Muckley、Chen 与 Karrer，[Training-free Linear Image Inverses via Flows](https://arxiv.org/html/2310.04432v2)：velocity 与 denoiser 的换算、Tweedie 的写法、ΠGDM 的 Gaussian 近似、$r_t^2=\sigma_t^2/(\sigma_t^2+\alpha_t^2)$ 与 $N(0,I)$ 的假设、guidance coefficient 与它在 OT path 下的 $(1-t)/t$。
- Song、Sohl-Dickstein、Kingma 等，[Score-Based Generative Modeling through SDEs](https://ar5iv.arxiv.org/html/2011.13456)（只读了前 20 万字符）：reverse-time SDE、VE 与 VP SDE、SMLD 与 DDPM 是它们的 discretization、probability flow ODE、predictor–corrector。
- Song、Meng 与 Ermon，[DDIM](https://arxiv.org/pdf/2010.02502)：第 4.3 节的 Eq. 13 到 15、Proposition 1，以及论文的 $\alpha_t$ 就是 DDPM 的 $\bar\alpha_t$。
- Black 等，[π0](https://arxiv.org/html/2410.24164)（前一半）：$A^\tau=\tau A+(1-\tau)\epsilon$、target $A-\epsilon$、beta distribution 强调 noisier 的一端、从 $\tau=0$ integrate 到 1、10 步、$H=50$。
- Lin 等，[Common Diffusion Noise Schedules and Sample Steps are Flawed](https://ar5iv.labs.arxiv.org/html/2305.08891)（前三分之二）：leading、linspace、trailing 三种取法，leading 不包含最后一个 timestep。
- GitHub [real-stanford/diffusion_policy](https://github.com/real-stanford/diffusion_policy)（clone 下来读）：各 config 的 scheduler（100 个 training step、`squaredcos_cap_v2`、DDIM 的 `set_alpha_to_one`）、`eval_real_robot.py` 的 16 步、`conditional_sample` 的循环；依赖的 [huggingface/diffusers](https://github.com/huggingface/diffusers) v0.11.1 的 `scheduling_ddim.py`（`set_timesteps`、`step`、`betas_for_alpha_bar`）。

凭自己的知识写、没有找原文核对的：Fick's first law 的表述，以及“Fick velocity 就是 probability flow ODE”的推导（是这里自己推的，score SDE 论文的 Appendix D 没有读到）；Hyvärinen 的 identity 与 ST2131 那一步的对应；Tweedie's formula 这个名字（Pokle 等人称它 Tweedie's identity）；Diffusion Policy 论文里的 10 步 DDIM 与代码里 leading spacing 的组合是我按代码推出来的，没有在论文里核对它用的是哪个 diffusers 版本。

数字都是为这一页用 `python3 -I`（numpy、scipy）算的：posterior mean、score 与 velocity 的例子，Langevin 的 50.8%，gradient ascent 的 48.4%，Euler 步数表，molecule 的 random walk、RK4、reverse ODE 与 reverse SDE，DDPM 与 cosine schedule 的换算表，DDIM 与 Euler 的 0.117774，五种 sampler 的比较，RTC 的 identity 核对与 4000 个 chunk 的统计。图里的随机数来自 mulberry32，和正文的 numpy 结果不是同一批 sample。
:::
