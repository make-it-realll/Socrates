---
code: MIT-6.S184
evidence: syllabus
evidenceNote: "MIT IAP 2026 一期（6.S184/6.S975，Peter Holderrieth 主讲，lab 由 Ron Shprints、Ezra Erives 负责）。讲法跟着课程的 lecture notes（2026 版，arXiv 2506.02070）第 1 到 6 章和三个 lab notebook（GitHub eje24/iap-diffusion-labs 的 2026 branch）。Lecture video 没有看；Lecture 5（discrete diffusion）这一页没有写。快速路线、可跳过的部分和作业时间的估计来自本站的调研条目，作业提示逐条对着 notebook 核对过。"
exam: "无考试；以三个 lab 为主。Lab 是 Jupyter notebook，保留输出导出成 PDF，经 Canvas 交到 Gradescope（课程主页的说明）。"
subskills:
  - id: ode
    name: Generation as sampling、ODE 与 SDE
    l3: "能写出 Euler 和 Euler–Maruyama 的一步，并说出 noise 项为什么乘 $\\sqrt h$。"
    l4: "能独立推出 OU process 的 stationary variance $\\sigma^2/(2\\theta)$，并用 simulation 核对。"
    l5: "能解释为什么 1D 里任何把 $N(0,1)$ 送到 $p_{\\text{data}}$ 的 flow 都是 quantile map，以及高维时为什么只能靠一个学出来的 vector field。"
  - id: path
    name: Probability path 与 marginal vector field
    l3: "能写出 Gaussian conditional path 的 conditional vector field，并在 CondOT 下化简成 $(z-x)/(1-t)$。"
    l4: "能对一个小 dataset 算出 marginal vector field 在某一点的值，并说清它是 posterior weighted average。"
    l5: "能由 continuity equation 证明 marginalization trick，并解释 conditional path 相交而 marginal trajectory 不相交。"
  - id: fm
    name: Flow matching loss
    l3: "能写出 CondOT 下的 training step：采 $z,t,\\varepsilon$，regress 到 $z-\\varepsilon$。"
    l4: "能完整推出 $\\mathcal L_{\\text{FM}}=\\mathcal L_{\\text{CFM}}+C$，并用数值核对 $C$ 与 $\\theta$ 无关。"
    l5: "能算出 loss 的下限 $\\mathbb E\\,\\mathrm{Var}(u_t(x\\mid z)\\mid x)$，并解释有限 dataset 上 exact minimizer 为什么只会复现 training data。"
  - id: score
    name: Score function、Fokker–Planck 与 SDE sampling
    l3: "能写出 Gaussian 的 score，并用 $u=a_t s+b_t x$ 在 score 与 vector field 之间换算。"
    l4: "能证明 SDE extension trick，并用 Euler 的 stability 条件说出 $\\sigma$ 取大时 step size 要多小。"
    l5: "能从 test function 推出 Fokker–Planck equation，并解释 conditional SDE 在 $t\\to1$ 为什么会爆。"
  - id: dsm
    name: Denoising score matching 与 noise prediction
    l3: "能写出 DDPM 的 noise prediction loss，并说出它丢掉了哪个 weight。"
    l4: "能在 $u$、score、$\\hat\\varepsilon$、denoiser 四种 parameterization 之间互相换算。"
    l5: "能推出换 parameterization 等于换 loss 在各个 $t$ 上的 weight，并解释 denoiser 输出的为什么是模糊的平均。"
  - id: cfg
    name: Guidance 与 classifier-free guidance
    l3: "能写出 CFG 的 training（以 probability $\\eta$ 换成 null label）和 sampling 公式。"
    l4: "能从 Bayes rule 推出 classifier guidance，再推出 CFG 的 $(1-w)u(x\\mid\\varnothing)+w\\,u(x\\mid y)$。"
    l5: "能用一个例子说明 $w>1$ 时 CFG sample 到的既不是 $p(x\\mid y)$，也不是 $p(x\\mid y)p(y\\mid x)^{w-1}$。"
  - id: arch
    name: Architecture、latent space 与大规模系统
    l3: "能说出 DiT 的 data flow：patchify、DiT block、depatchify，以及 $t$、$y$ 从哪里进入。"
    l4: "能解释 adaLN-Zero 为什么让 block 初始时是 identity，并算出 latent space 能省多少 attention 的计算。"
    l5: "能推出 VAE 的 KL term 的 closed form，并说明 latent 的 rate–distortion trade-off 怎样影响生成质量。"
open:
  - label: "MIT 6.S184 lecture notes（Holderrieth, Erives，2026 版）"
    url: "https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf"
    note: "全页的主线。用 WebFetch 分节读了第 1 到 6 章和附录 A、B、E；工具返回的是逐节的详细转述（含全部 formula），不是逐字原文。第 7 章只读了概要。"
  - label: "MIT 6.S184 课程主页（IAP 2026）"
    url: "https://diffusion.csail.mit.edu/2026/"
    note: "讲次安排、lab 链接、先修要求、提交方式。"
  - label: "MIT 6.S184 Lecture 1 slides"
    url: "https://diffusion.csail.mit.edu/2026/docs/20260120_Lecture_01.pdf"
    note: "只读了 slide 标题和例子清单，用来核对第 1 站的顺序。"
  - label: "GitHub eje24/iap-diffusion-labs（2026 branch）"
    url: "https://github.com/eje24/iap-diffusion-labs/tree/2026"
    note: "三个 lab 的 notebook 和 solutions 全部读过（clone 下来逐个 cell 读），作业一节的提示大多出自这里和 README 的 changelog。"
sources:
  - label: "Holderrieth & Erives, An Introduction to Flow Matching and Diffusion Models（arXiv 2506.02070）"
    url: "https://arxiv.org/abs/2506.02070v1"
---

先看三次失败。三次都在做同一件事：手里有一堆 data，想造出新的、看起来像同一批 data 的东西。

**第一次。** 一维的 data，一半在 $-2$ 附近，一半在 $2$ 附近（后面整页都用它：$p_{\text{data}}=\tfrac12N(-2,0.5^2)+\tfrac12N(2,0.5^2)$）。train 一个 network，输入一个 Gaussian noise，一步输出一个 sample，loss 用 output 和随机抽的一个 data point 的 squared error。Noise 和抽到的 data point 互相独立，network 从 noise 里得不到任何关于“该输出哪个 data point”的信息，而 squared error 下最好的输出是 mean（第 3 站证明）。所以不管 network 多大，最优解都是把每个 noise 送到 data 的 mean，也就是 0，正好落在两个 bump 中间那个几乎没有 data 的地方。

**第二次。** 换个办法：先把 noise 和 data 一对一配好，再做 regression。一维时可以按大小配（第 $k$ 小的 noise 配第 $k$ 小的 data），这正是 quantile map $F^{-1}(\Phi(x))$。但一张 $1024\times1024$ 的彩色图片是 $3{,}145{,}728$ 维的 vector，没有“大小顺序”，也没有 $F^{-1}$ 可写。

**第三次。** 那就不配对，只要求 output 的 distribution 和 data 的 distribution 一样。可是“两个 distribution 一样”没法写成一个对每个 sample 单独算的 loss：手里没有 $p_{\text{data}}$ 的 formula，只有它的 sample。

这门课的答案是：不要一步走到。让每个 noise 沿着一个 ODE（或 SDE）走一段连续的路，在 $t=0$ 时是 noise，在 $t=1$ 时是 data。只要学会每个时刻、每个位置该往哪个方向走（一个 vector field），就能把整条路拼出来。难点在于这个 vector field 本身也算不出来；flow matching 的关键一步是证明：可以对着一个对单个 data point 写得出来的 target 做最普通的 regression，学到的恰好是那个算不出来的 vector field。

全页的顺序跟着课程的讲次：先把“生成”说成“从 distribution 里 sample”，并准备好 ODE 和 SDE（第 1 站）；构造一条从 noise 到 data 的 probability path 和它的 vector field（第 2 站）；用 flow matching loss 把它学出来（第 3 站）；换成 score 的说法，得到 diffusion model 和 SDE sampling（第 4、5 站）；加上 prompt，得到 classifier-free guidance（第 6 站）；最后看真正的图像和视频 model 用什么 network、为什么要到 latent space 里做（第 7 站）。课程的 Lecture 5 讲 discrete diffusion（用在文字上），这一页没有写。课程本身没有讲 robot policy，这一页也不补。

整页的数大多是对上面那个两个 bump 的例子精确算出来的（第 2 站另用一个只有两个点的 dataset）：它的每一个 vector field、score 都有 closed form，所以可以拿“学到的东西”和“真正的答案”逐个对照。Lab 2 用的二维 5-mode Gaussian mixture 出现在第 3 站。

## [ode] Generation as sampling、ODE 与 SDE

:::skip
快速路线必读（对应 Lecture 1 和 notes 第 1、2 章）。能写出 Euler–Maruyama 的一步、说出 noise 项为什么是 $\sqrt h$ 而不是 $h$，并且知道 OU process 最后停在 $N(0,\sigma^2/2\theta)$，就可以去第 2 站。
:::

### 生成就是 sampling

一张图片、一段视频、一个分子的结构，都可以写成一个 vector $z\in\mathbb R^d$：$H\times W$ 的 RGB 图片是 $z\in\mathbb R^{H\times W\times3}$，$N$ 个 atom 的分子是每个 atom 的三维坐标排在一起。“生成一张狗的图片”没有唯一的正确答案，所有合格的狗的图片构成一个 probability distribution $p_{\text{data}}$，越像的图片 density 越大。所以“生成”在数学上就是从 $p_{\text{data}}$ 里 sample。

难处在于 $p_{\text{data}}$ 没有 formula，手里只有一个 dataset：有限个 sample $z_1,\dots,z_N\sim p_{\text{data}}$。Generative model 要做的是：给它足够多的这种 sample，它学会产生新的 sample。

能直接 sample 的 distribution 只有简单的几个，最常用的是 $p_{\text{init}}=N(0,I_d)$。于是问题变成：怎样把 $N(0,I_d)$ 的 sample 变成 $p_{\text{data}}$ 的 sample？开头的三次失败说明，一步到位的 map 要么学成 mean，要么需要配对，要么写不出 loss。课程的办法是让 sample 沿着一个 differential equation 连续地走过去。

### Vector field、ODE 与 flow

一个 time-dependent vector field $u:\mathbb R^d\times[0,1]\to\mathbb R^d$ 在每个时刻 $t$、每个位置 $x$ 给出一个方向 $u_t(x)$。ODE 说的是：从 $X_0=x_0$ 出发，每一刻的 velocity 等于脚下的 vector field，

$$\frac{d}{dt}X_t=u_t(X_t),\qquad X_0=x_0$$

把所有起点一起看，记 $\psi_t(x_0)$ 为从 $x_0$ 出发、到时刻 $t$ 的位置，$\psi_t$ 叫 flow。Vector field、ODE、flow 是同一个东西的三种说法。

Existence and uniqueness theorem：$u$ continuously differentiable 且 derivative 有界时，ODE 的 solution 存在且唯一。Neural network 一般满足这个条件。唯一性有一个马上要用的 corollary：**两条 trajectory 不会相交**。如果两条在某个时刻 $s$ 到达同一点，那么从这一点出发的 solution 只有一个，它们之后就是同一条，往回看也是同一条，所以本来就是同一个起点。

最简单的例子是 $u_t(x)=-\theta x$。猜 $X_t=x_0e^{-\theta t}$，求 derivative 得 $-\theta x_0e^{-\theta t}=-\theta X_t$，满足 ODE，所以 flow 是 $\psi_t(x_0)=e^{-\theta t}x_0$：所有点按同一个比例向 0 收缩。

### Euler method

一般的 $u$ 解不出 closed form，只能数值地走。把 $[0,1]$ 分成 $n$ 步，step size $h=1/n$，每一步假装 velocity 在这一小段时间里不变：

$$X_{t+h}=X_t+h\,u_t(X_t)$$

用上面的例子检验，取 $\theta=1$、$x_0=1$，走到 $t=1$。每一步乘上 $(1-h)$，$n$ 步之后是 $(1-1/n)^n$，exact answer 是 $e^{-1}=0.367879$。

| $n$ | Euler 的结果 $(1-1/n)^n$ | error |
|---|---|---|
| 1 | 0 | 0.368 |
| 2 | 0.25 | 0.118 |
| 4 | 0.3164 | 0.0515 |
| 10 | 0.3487 | 0.0192 |
| 100 | 0.3660 | 0.00185 |

$n$ 从 10 到 100，error 从 0.0192 降到 0.00185，正好缩小十倍：error 和 $h$ 成正比，Euler 是 first-order 的。Notes 说这门课里 Euler 就够用；它也介绍了 Heun 的 predictor–corrector（先用 Euler 走一步试探，再用起点和试探点的 velocity 的平均真正走），但 lab 里不用。

### Flow model

把起点换成随机的：$X_0\sim p_{\text{init}}$，vector field 换成一个 neural network $u^\theta_t$。希望 $X_1\sim p_{\text{data}}$。Sampling 就是 notes 的 Algorithm 1：采一个 $X_0\sim N(0,I_d)$，用 Euler 走 $n$ 步，输出 $X_1$。

这样的 vector field 真的存在吗？一维时可以直接验证。第 2 站会给出把 $N(0,1)$ 送到 $p_{\text{data}}=\tfrac12N(-2,0.5^2)+\tfrac12N(2,0.5^2)$ 的 vector field 的 closed form；用 RK4（比 Euler 精确得多的 ODE solver）走 4000 步，起点 $0.5$ 到达 $1.851096$。而 quantile map 给出 $F^{-1}(\Phi(0.5))=F^{-1}(0.691462)=1.851096$，八位相同，起点 $-1$、$0.1$、$1$、$2$ 也都相同。

这不是巧合。一维的 trajectory 不能相交，所以起点的大小顺序到了 $t=1$ 还保持：flow 是 increasing function。把 $N(0,1)$ 送到 $p_{\text{data}}$ 的 increasing function 只有一个，就是 quantile map。所以一维时 flow model 学到的必然就是第二次失败里那个配对；它的好处是到了高维也有定义，而 quantile map 没有。

### SDE：每一步加一点 noise

ODE 的 trajectory 由起点完全决定。在 ODE 上加 noise，得到 SDE：

$$dX_t=u_t(X_t)\,dt+\sigma_t\,dW_t$$

$u_t$ 叫 drift coefficient，$\sigma_t$ 叫 diffusion coefficient，$W_t$ 是 Brownian motion：$W_0=0$，path continuous，increment 互相 independent，而且 $W_{t+h}-W_t\sim N(0,h\,I_d)$，variance 等于经过的时间。

数值上，Euler 的推广叫 Euler–Maruyama：

$$X_{t+h}=X_t+h\,u_t(X_t)+\sqrt h\,\sigma_t\,\varepsilon,\qquad\varepsilon\sim N(0,I_d)$$

$\sqrt h$ 来自 Brownian increment 的 variance 是 $h$：$\sqrt h\,\varepsilon$ 的 variance 正好是 $h$。

:::wrong Noise 项和 drift 项一样，乘 $h$ 就行
取 $u=0$、$\sigma=1$，从 0 出发走到 $t=1$。乘 $\sqrt h$ 时，$n$ 步的 noise 加起来 variance 是 $n\times h=1$，和 $n$ 无关，这才是 Brownian motion 在 $t=1$ 的 variance。乘 $h$ 时，variance 是 $n\times h^2=1/n$：步数从 100 加到 10000，终点的 spread 从 0.1 缩到 0.01，noise 随着“算得更细”而消失了。Drift 每步贡献 $h$，$n$ 步加起来是 $O(1)$；noise 每步的方向随机，互相抵消，只有每步取 $\sqrt h$ 才能在 $n$ 步后剩下 $O(1)$。Lab 1 的 notebook 里写的正是 $\sqrt h\,\sigma_t z_t$。
:::

### Ornstein–Uhlenbeck process

Drift 取上面那个收缩的 vector field，再加上 constant 的 noise：

$$dX_t=-\theta X_t\,dt+\sigma\,dW_t$$

Drift 把点往 0 拉，noise 把点往外推。最后会停在哪里？用 Euler–Maruyama 的一步来算 variance。$X_{t+h}=(1-\theta h)X_t+\sigma\sqrt h\,\varepsilon$，其中 $\varepsilon$ 与 $X_t$ independent，所以

$$\mathrm{Var}(X_{t+h})=(1-\theta h)^2\,\mathrm{Var}(X_t)+\sigma^2h$$

如果 variance 不再变化，记为 $V$，就有 $V=(1-\theta h)^2V+\sigma^2h$。把 $(1-\theta h)^2=1-2\theta h+\theta^2h^2$ 代进去，移项：

$$V\,(2\theta h-\theta^2h^2)=\sigma^2h\qquad\Longrightarrow\qquad V=\frac{\sigma^2}{2\theta-\theta^2h}\ \xrightarrow{\ h\to0\ }\ \frac{\sigma^2}{2\theta}$$

Mean 每步乘 $(1-\theta h)$，趋于 0。所以 OU process converge 到 $N\big(0,\tfrac{\sigma^2}{2\theta}\big)$，converge 到一个 distribution，而不是一个点。Lab 1 把 $D=\sigma^2/(2\theta)$ 作为提示，就是这个数。

用 Lab 1 的设置核对：$\theta=0.25$，$\sigma=0.5$，于是 $D=0.5$；$h=0.01$ 时上面的 $V=0.25/(0.5-0.000625)=0.5006$。500 条 trajectory 从 $-10$ 到 $10$ 均匀取起点，走到 $T=40$（4000 步，numpy `default_rng(0)`），终点的 sample variance 是 0.481，和 0.5 的差在 500 个 sample 的 sampling error（约 0.03）之内。只走到 $T=10$ 时 variance 是 0.744：mean 还剩 $e^{-0.25\times10}=0.082$ 倍的起点，起点本身的 spread 还没收干净。

::fig[mit6s184-ou] 11 条 OU trajectory。$\sigma=0$ 时（虚线）每条都收缩到 0；$\sigma=0.5$ 时它们在约 $\pm2\sqrt D=\pm1.41$ 的带子里停下来，各自不停地抖动，但整体的 distribution 不再变化。

这正是生成需要的现象：一个 SDE 可以把任意起点的 distribution 变成一个指定的 distribution。

### OU 是 Langevin dynamics 的特例

:::skip
这一小节只是预告第 4 站的 Langevin dynamics；跳过的话，到第 4 站会再见到它。
:::

对一个 density $p$，Langevin dynamics 是

$$dX_t=\tfrac12\sigma^2\,\nabla\log p(X_t)\,dt+\sigma\,dW_t$$

$\nabla\log p$ 叫 $p$ 的 score，指向 density 上升最快的方向。取 $p=N(0,D)$，$\log p(x)=-\dfrac{x^2}{2D}+\text{const}$，score 是 $-x/D$。代入 $D=\sigma^2/(2\theta)$：

$$\tfrac12\sigma^2\cdot\Big(-\frac{x}{D}\Big)=\tfrac12\sigma^2\cdot\Big(-\frac{2\theta x}{\sigma^2}\Big)=-\theta x$$

正好是 OU 的 drift。所以 OU process 就是 $N(0,D)$ 的 Langevin dynamics，它停在 $N(0,D)$ 不是巧合：Langevin dynamics 不改变 $p$（第 4 站证明）。这是 Lab 1 第 3.2 题。

:::edge $\sigma_t=0$ 时 SDE 就是 ODE
Euler–Maruyama 在 $\sigma_t=0$ 时和 Euler 一字不差。Lab 1 的 notebook 特意指出了这一点，可以用来检查自己写的 simulator。
:::

:::from
顺序和例子（vector 表示 data、生成即 sampling、linear ODE、Euler、Brownian motion、OU、Euler–Maruyama）跟着 [6.S184 lecture notes](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) 第 1、2 章和 [Lecture 1 slides](https://diffusion.csail.mit.edu/2026/docs/20260120_Lecture_01.pdf)。OU 的参数和“converge 到 distribution 而不是点”的问题来自 Lab 1 notebook；Langevin 与 OU 的等价是 Lab 1 第 3.2 题。开头三次失败、“一维 flow 就是 quantile map”的论证、stationary variance 的离散推导、Euler 的数表和 OU 的 simulation 是为这一页算的。
:::

## [path] Probability path 与 marginal vector field

:::skip
快速路线必读（Lecture 2 前半，notes 第 3.1、3.2 节）。能对一个两点 dataset 算出 marginal vector field 在一点的值，说出它是 posterior weighted average，并知道 Euler 只走 1 步时为什么所有 sample 都落在 data 的 mean，就可以去第 3 站。
:::

### 要学的是哪一个 vector field

把 $N(0,I_d)$ 送到 $p_{\text{data}}$ 的 vector field 有无穷多个（例如 $p_t$ 是以原点为中心的 rotationally symmetric 的 distribution 时，在任何一个这样的 field 上再叠加一个绕原点旋转的分量，每个时刻的 distribution 都不变）。要 train network，必须先指定其中一个，而且这个 target 最好能对每个 training sample 单独写出来。

课程的办法分三步：只有一个 data point 时，路径和 vector field 都能手算；有很多 data point 时，把它们平均；最后证明平均出来的东西确实把 noise 送到 data。

### Conditional probability path：只有一个 data point

固定一个 data point $z$。Conditional probability path 是一族 distribution $p_t(\cdot\mid z)$，满足

$$p_0(\cdot\mid z)=p_{\text{init}},\qquad p_1(\cdot\mid z)=\delta_z$$

$\delta_z$ 是 Dirac delta，一个永远给出 $z$ 的 distribution。也就是说，从 noise 出发，到 $t=1$ 时缩成 $z$ 这一个点。

最常用的是 Gaussian conditional path：

$$p_t(\cdot\mid z)=N(\alpha_tz,\ \beta_t^2I_d),\qquad\alpha_0=\beta_1=0,\quad\alpha_1=\beta_0=1$$

$\alpha_t$、$\beta_t$ 叫 noise scheduler，要求 continuously differentiable、monotonic。$t=0$ 时是 $N(0,I_d)$，$t=1$ 时 variance 为 0、mean 是 $z$。Sample 它只需要一行：$x=\alpha_tz+\beta_t\varepsilon$，$\varepsilon\sim N(0,I_d)$。

两个常见的选择：$\alpha_t=t$、$\beta_t=1-t$，叫 CondOT path（也叫 linear path，Lab 3、Stable Diffusion 3、Movie Gen 都用它）；Lab 2 前半用的是 $\alpha_t=t$、$\beta_t=\sqrt{1-t}$。本页的例子默认用 CondOT。

### Conditional vector field：可以手算

哪个 vector field 能让 trajectory 恰好走出 $p_t(\cdot\mid z)$？直接写出 flow：

$$\psi_t(x_0\mid z)=\alpha_tz+\beta_tx_0$$

如果 $X_0\sim N(0,I_d)$，那么 $\psi_t(X_0\mid z)=\alpha_tz+\beta_tX_0\sim N(\alpha_tz,\beta_t^2I_d)$，distribution 对了。Vector field 是 flow 对 $t$ 的 derivative，但要写成“当前位置 $x$”的 function，不能写成起点 $x_0$ 的。先求 derivative：

$$\frac{d}{dt}\psi_t(x_0\mid z)=\dot\alpha_tz+\dot\beta_tx_0$$

当前位置是 $x=\alpha_tz+\beta_tx_0$，反解出 $x_0=(x-\alpha_tz)/\beta_t$，代回去：

$$u_t(x\mid z)=\dot\alpha_tz+\dot\beta_t\,\frac{x-\alpha_tz}{\beta_t}=\Big(\dot\alpha_t-\frac{\dot\beta_t}{\beta_t}\alpha_t\Big)z+\frac{\dot\beta_t}{\beta_t}\,x$$

CondOT 时 $\dot\alpha_t=1$，$\dot\beta_t=-1$：

$$u_t(x\mid z)=\Big(1+\frac{t}{1-t}\Big)z-\frac{x}{1-t}=\frac{z-x}{1-t}$$

读法很直接：剩下的路程是 $z-x$，剩下的时间是 $1-t$，匀速走过去。所以 CondOT 的 conditional trajectory 都是直线。

这个 vector field 单独没有用：它把所有 noise 都送到同一个 $z$。

### Marginal path 与 marginalization trick

现在有很多 data point。先随机选一个 $z\sim p_{\text{data}}$，再从 $p_t(\cdot\mid z)$ 里 sample，得到的 $x$ 服从 marginal probability path：

$$p_t(x)=\int p_t(x\mid z)\,p_{\text{data}}(z)\,dz$$

$t=0$ 时每个 $p_0(\cdot\mid z)$ 都是 $p_{\text{init}}$，所以 $p_0=p_{\text{init}}$；$t=1$ 时 $p_1(\cdot\mid z)=\delta_z$，所以 $p_1=p_{\text{data}}$。这条 path 正好从 noise 走到 data。Sample 它很容易（先采 $z$ 再加 noise），但 density 要对整个 dataset 求 integral，算不出来。

::fig[mit6s184-paths] 本页例子的 marginal path。每一行是 $x_t=t\,z+(1-t)\,\varepsilon$ 在某个时刻的 density：$t=0$ 是一个 Gaussian，到 $t=0.6$ 已经分成两个 bump，$t=1$ 是 $p_{\text{data}}$。

要让 trajectory 走出这条 marginal path，vector field 该是什么？Notes 的 Theorem 9（marginalization trick）给出答案：

$$u_t(x)=\int u_t(x\mid z)\,\frac{p_t(x\mid z)\,p_{\text{data}}(z)}{p_t(x)}\,dz$$

后面那个分式是 Bayes rule 给出的 posterior $p(z\mid x_t=x)$：看到时刻 $t$ 的一个 noisy point $x$，它来自 data point $z$ 的 probability。所以

$$u_t(x)=\mathbb E\big[\,u_t(x\mid z)\ \big|\ x_t=x\,\big]$$

Marginal vector field 是各个 conditional vector field 的 posterior weighted average。

拿一个最小的 dataset 立刻用一次：只有两个 data point，$z\in\{-2,+2\}$，各占一半，CondOT path。$p_t(x\mid z)=N(tz,(1-t)^2)$。在 $t=0.5$、$x=0.6$ 处，两个 likelihood 之比的 log 是

$$\log\frac{p_t(x\mid +2)}{p_t(x\mid -2)}=\frac{-(x-2t)^2+(x+2t)^2}{2(1-t)^2}=\frac{8tx}{2(1-t)^2}=\frac{4tx}{(1-t)^2}=\frac{4\times0.5\times0.6}{0.25}=4.8$$

Prior 相等，所以 posterior $p(+2\mid x)=\dfrac{1}{1+e^{-4.8}}=0.99184$，$p(-2\mid x)=0.00816$。两个 conditional vector field 在这一点是

$$u(x\mid +2)=\frac{2-0.6}{0.5}=2.8,\qquad u(x\mid -2)=\frac{-2-0.6}{0.5}=-5.2$$

weighted average：

$$u_{0.5}(0.6)=0.99184\times2.8+0.00816\times(-5.2)=2.7347$$

这个例子有 closed form。两个 posterior 是 $\tfrac12\big(1\pm\tanh\tfrac{2tx}{(1-t)^2}\big)$，所以 $\mathbb E[z\mid x]=2\tanh\dfrac{2tx}{(1-t)^2}$，而 $u_t(x\mid z)=(z-x)/(1-t)$ 对 $z$ 是 linear 的，平均可以直接移到 $z$ 上：

$$u_t(x)=\frac{\mathbb E[z\mid x]-x}{1-t}=\frac{2\tanh\big(2tx/(1-t)^2\big)-x}{1-t}$$

代 $t=0.5$、$x=0.6$：$2\tanh(2.4)=1.96735$，$u=(1.96735-0.6)/0.5=2.7347$，和上面一致。

::fig[mit6s184-avg] $t=0.5$ 时的三条 curve。在 $x=0.6$，posterior 几乎全部押在 $+2$ 上，marginal field 几乎就是指向 $+2$ 的那条 conditional field；在 $x=0$ 附近两边各半，marginal field 是两条的平均，接近 0。

同一个 $x=0.6$，不同时刻的 posterior 很不一样：

| $t$ | 0.1 | 0.3 | 0.5 | 0.7 | 0.9 |
|---|---|---|---|---|---|
| $p(+2\mid x=0.6)$ | 0.574 | 0.813 | 0.992 | 0.99999999 | 1.0 |
| $u_t(0.6)$ | $-0.340$ | 0.931 | 2.735 | 4.667 | 14.0 |

$t$ 小时 noise 大，看不出来自哪一边，field 很弱，甚至略微往回指（$-0.340$：两条 conditional field 的平均把点往 0 拉）；$t$ 大时已经确定是 $+2$，field 就是 $(2-0.6)/(1-t)$，越来越大。

:::back
Posterior 和 Bayes rule 见 [ST2131 的 Bayes' rule](../courses/ST2131.html#bayes)；“用 posterior weighted average”就是 [ST2131 的 conditional expectation](../courses/ST2131.html#hier)。$p(z\mid x)$ 在 Gaussian mixture 里就是 [CS3244 的 EM](../courses/CS3244.html#em) 里的 responsibility。
:::

### 为什么平均出来的 field 恰好对：continuity equation

:::skip
这一小节证明 marginalization trick。只想会用的可以跳过，代价是不知道这个 trick 为什么成立，第 4 站推 Fokker–Planck 时会再用到同样的论证。
:::

先在一维里看 density 怎样随 vector field 变化。一群点以 velocity $u_t(x)$ 运动，density 是 $p_t(x)$。单位时间里从左往右穿过位置 $x$ 的 probability mass 是 $p_t(x)u_t(x)$（这么密，跑这么快）。interval $[a,b]$ 里的 mass 只能从两端进出：

$$\frac{d}{dt}\int_a^bp_t(x)\,dx=p_t(a)u_t(a)-p_t(b)u_t(b)=-\int_a^b\frac{\partial}{\partial x}\big(p_tu_t\big)\,dx$$

对任意 interval 都成立，所以被积的 function 相等：

$$\partial_tp_t(x)=-\partial_x\big(p_tu_t\big)(x)$$

高维时把 $\partial_x$ 换成 divergence $\mathrm{div}(v)=\sum_i\partial_{x_i}v^i$，就是 continuity equation（notes 的 Theorem 11）：$X_0\sim p_0$ 且沿 $u_t$ 走时 $X_t\sim p_t$ 对所有 $t$ 成立，当且仅当

$$\partial_tp_t(x)=-\mathrm{div}\big(p_tu_t\big)(x)$$

现在证明 marginalization trick。每个 conditional path 都由它的 conditional field 生成，所以各自满足 continuity equation。对 marginal path 求 $\partial_t$，把 derivative 移进 integral，代入每个 conditional 的 continuity equation，再把 integral 和 divergence 交换（divergence 只对 $x$ 求导）：

$$\begin{aligned}\partial_tp_t(x)&=\int\partial_tp_t(x\mid z)\,p_{\text{data}}(z)\,dz\\&=-\int\mathrm{div}\big(p_t(\cdot\mid z)\,u_t(\cdot\mid z)\big)(x)\,p_{\text{data}}(z)\,dz\\&=-\mathrm{div}\Big(\int p_t(\cdot\mid z)\,u_t(\cdot\mid z)\,p_{\text{data}}(z)\,dz\Big)(x)\end{aligned}$$

括号里乘一个 $p_t(x)$ 再除一个 $p_t(x)$：

$$\int p_t(x\mid z)\,u_t(x\mid z)\,p_{\text{data}}(z)\,dz=p_t(x)\int u_t(x\mid z)\,\frac{p_t(x\mid z)\,p_{\text{data}}(z)}{p_t(x)}\,dz=p_t(x)\,u_t(x)$$

所以 $\partial_tp_t=-\mathrm{div}(p_tu_t)$，marginal path 和 marginal field 满足 continuity equation，再由 Theorem 11 得 $X_0\sim p_{\text{init}}$ 时 $X_t\sim p_t$，特别地 $X_1\sim p_{\text{data}}$。

:::wrong Conditional path 是直线，所以 marginal ODE 的 trajectory 也是直线
每条 conditional path 是从某个 noise 走向某个 data point 的直线，但这些直线会交叉：从 $0.8$ 走向 $-2$ 的那条和从 $-0.8$ 走向 $+2$ 的那条，在 $t=2/7$ 处相遇（$0.8-2.8t=-0.8+2.8t$）。Marginal ODE 的 trajectory 不可能相交（第 1 站的唯一性），所以它们必须弯：在交叉点附近，一个点“不知道”自己该去哪边，field 取两边的平均。
:::

::fig[mit6s184-traj] 两点 dataset 的 marginal ODE，从 $N(0,1)$ 的 14 个 quantile 出发，用 RK4 走到 $t=0.995$。正的起点全部到 $+2$，负的全部到 $-2$，没有一条交叉。虚线是两条互相交叉的 conditional path。

### Gaussian mixture 的 exact field

本页的 $p_{\text{data}}$ 由两个 Gaussian component $N(\mu_k,s^2)$ 组成，$\mu_k=\pm2$，$s=0.5$，有 density，不是有限个点。Marginalization trick 可以分两层用：先在一个 component 内对 $z$ 平均，再对两个 component 平均。

在 component $k$ 内，$z\sim N(\mu_k,s^2)$，$x=tz+(1-t)\varepsilon$。$z$、$\varepsilon$、$x$ 都是 independent Gaussian 的 linear combination，jointly Gaussian；$x$ 的 mean 是 $t\mu_k$，variance 是 $v_t=t^2s^2+(1-t)^2$，$\mathrm{Cov}(z,x)=ts^2$，$\mathrm{Cov}(\varepsilon,x)=1-t$。Jointly Gaussian 时 conditional mean 是 linear 的，slope 是 covariance 除以 variance：

$$\mathbb E[z\mid x,k]=\mu_k+\frac{ts^2}{v_t}(x-t\mu_k),\qquad\mathbb E[\varepsilon\mid x,k]=\frac{1-t}{v_t}(x-t\mu_k)$$

CondOT 的 conditional field 是 $(z-x)/(1-t)$，而 $z-x=z-tz-(1-t)\varepsilon=(1-t)(z-\varepsilon)$，所以它就是 $z-\varepsilon$（第 3 站还会用到）。在 component 内平均：

$$u_t^{(k)}(x)=\mathbb E[z-\varepsilon\mid x,k]=\mu_k+\frac{ts^2-(1-t)}{v_t}(x-t\mu_k)$$

再用 component 的 posterior $w_k(x)\propto\tfrac12N(x;\,t\mu_k,v_t)$ 加权：$u_t(x)=\sum_kw_k(x)\,u_t^{(k)}(x)$。

在 $t=0.5$、$x=0.6$ 算一次。$v=0.5^2\times0.5^2+0.5^2=0.3125$。两个 component 的 log-likelihood 之差是 $\dfrac{(0.6+1)^2-(0.6-1)^2}{2\times0.3125}=3.84$，所以 $w_+=\dfrac{1}{1+e^{-3.84}}=0.97896$，$w_-=0.02104$。Slope 是 $\dfrac{0.5\times0.25-0.5}{0.3125}=-1.2$，于是 $u^{(+)}=2+(-1.2)(0.6-1)=2.48$，$u^{(-)}=-2+(-1.2)(0.6+1)=-3.92$，

$$u_{0.5}(0.6)=0.97896\times2.48+0.02104\times(-3.92)=2.3453$$

比两点 dataset 的 2.7347 小：data 有了宽度，落在 $0.6$ 的点所对应的干净 data 不一定恰好是 2，posterior mean 往 $x$ 这边靠。

:::back
Jointly Gaussian 的 conditional mean 见 [ST2131 的 joint distribution 一站](../courses/ST2131.html#joint)。
:::

### 用 exact field 走 Euler：要走几步

Marginal field 已经精确知道了，sampling 只剩数值问题。两点 dataset 的 Euler 有一个很清楚的结构。最后一步从 $t=1-h$ 出发，step size 恰好是 $1-t$：

$$X_1=X_{1-h}+h\cdot\frac{\mathbb E[z\mid X_{1-h}]-X_{1-h}}{h}=\mathbb E[z\mid X_{1-h}]$$

Euler 的最后一步输出的是 posterior mean。只走 1 步时，这一步就从 $t=0$ 出发，此时 $x_0$ 和 $z$ 独立，posterior 就是 prior，$\mathbb E[z\mid x_0]=\mathbb E[z]=0$：每个 sample 都被送到 0。这正是开头第一次失败的那个 mean。走 2 步时，起点 $0.5$ 到 $1.523$、起点 $0.1$ 到 $0.395$；走 4 步时所有起点都已经到 $\pm2$（精确到 8 位以上）。

换成本页的 Gaussian mixture，用上一小节的 exact field，可以量化 Euler 的 error。起点取 $N(0,1)$ 的 4000 个 quantile（没有随机性），终点和 $p_{\text{data}}$ 的 4000 个 quantile 逐个比较，取 absolute difference 的平均（一维的 Wasserstein-1 distance）：

| 步数 $n$ | 1 | 2 | 3 | 5 | 10 | 20 | 50 | 100 | 1000 |
|---|---|---|---|---|---|---|---|---|---|
| $W_1$ | 2.000 | 0.739 | 0.458 | 0.275 | 0.138 | 0.0696 | 0.0280 | 0.0140 | 0.0014 |

$n\ge5$ 之后 $W_1\approx1.4/n$，和第 1 站的 first-order 结论一致。

::fig[mit6s184-euler] 同一组起点、同一个 exact field，只改 Euler 的步数。1 步全部在 0；2 步两个 bump 被拉向中间；5 步已经很接近；100 步与 $p_{\text{data}}$ 重合。

:::edge $t=1$ 处 conditional field 没有定义
$u_t(x\mid z)=(z-x)/(1-t)$ 在 $t=1$ 时分母为 0。Euler 只在 $t=0,h,\dots,1-h$ 上 evaluate field，碰不到 $t=1$；但自己写 time grid、training 时采 $t$、画图时取 $t=1$，都要避开端点。Lab 2 的 notebook 在 conditional field 的 docstring 里写明“只在 $[0,1)$ 上有定义”；Lab 3 的 solution 采 $t$ 时乘上 $(1-0.001)$。
:::

:::from
Conditional path、Gaussian path、conditional field 的推导（先写 flow 再求 derivative、换回 $x$）、marginalization trick 和用 continuity equation 的证明顺序来自 [notes](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) 第 3.1、3.2 节（Example 8、10，Theorem 9、11）。Notes 用的是二维 chessboard distribution 的图；这里换成两点 dataset 和一维 Gaussian mixture，是为了每个数都能手算核对。一维的 continuity equation 推导（interval 两端的 flux）、交叉直线的例子、“Euler 最后一步输出 posterior mean”和 $W_1$ 的数表是为这一页算的。
:::

## [fm] Flow matching loss

:::skip
快速路线必读（Lecture 2 后半，notes 第 3.3 节，Lab 2 Part 3、4）。能写出 CondOT 的 training step，能推出 $\mathcal L_{\text{FM}}=\mathcal L_{\text{CFM}}+C$，并解释 loss 为什么降不到 0，就可以去第 4 站。
:::

### Target 算不出来

想让 network $u^\theta_t$ 逼近 marginal field，最自然的 loss 是

$$\mathcal L_{\text{FM}}(\theta)=\mathbb E_{t\sim U[0,1],\ x\sim p_t}\big\|u^\theta_t(x)-u_t(x)\big\|^2$$

问题是 $u_t(x)$ 是对整个 dataset 的 posterior weighted average，每个 training step 都要对全部 $N$ 张图片算一遍 likelihood。Dataset 一大，这就不可行。

但第 2 站的 $u_t(x\mid z)$ 每个 data point 都有现成的 formula。能不能直接 regress 到它？

$$\mathcal L_{\text{CFM}}(\theta)=\mathbb E_{t\sim U[0,1],\ z\sim p_{\text{data}},\ x\sim p_t(\cdot\mid z)}\big\|u^\theta_t(x)-u_t(x\mid z)\big\|^2$$

同一个 $x$ 可能来自不同的 $z$，对应的 target 不同，network 被要求在同一个 input 上输出不同的东西。它会学成什么？

### Regression 学到的是 conditional expectation

先看最简单的情形：$Y$ 是一个 random variable，找一个 constant $c$ 让 $\mathbb E(Y-c)^2$ 最小。把 $Y-c$ 写成 $(Y-\mathbb EY)+(\mathbb EY-c)$，展开，cross term 的 expectation 是 $2(\mathbb EY-c)\,\mathbb E(Y-\mathbb EY)=0$，于是

$$\mathbb E(Y-c)^2=\mathrm{Var}(Y)+(\mathbb EY-c)^2$$

$c=\mathbb EY$ 时最小，最小值是 $\mathrm{Var}(Y)$，不是 0。

有 input 时，对每个 input 值分别做同样的事：在 $x$ 处，target 的 conditional distribution 是“给定 $x_t=x$ 时 $u_t(x\mid z)$ 的 distribution”，最好的 output 是它的 conditional expectation，而那正是 marginal field $u_t(x)$。所以 regress 到 conditional target，学到的是 marginal field。下面把这个直觉写成 notes 的 Theorem 12。

:::back
“squared error 下最好的 predictor 是 conditional expectation”见 [ST2131 的 conditional expectation 一站](../courses/ST2131.html#hier)。
:::

### 证明：两个 loss 只差一个 constant

**定理。** $\mathcal L_{\text{FM}}(\theta)=\mathcal L_{\text{CFM}}(\theta)+C$，$C$ 与 $\theta$ 无关。所以两者的 gradient 相同。

**证明。** 记 $u^\theta=u^\theta_t(x)$。把 $\mathcal L_{\text{FM}}$ 的 square 展开：

$$\mathcal L_{\text{FM}}=\mathbb E_{t,x\sim p_t}\|u^\theta\|^2-2\,\mathbb E_{t,x\sim p_t}\big[u^{\theta\top}u_t(x)\big]+\underbrace{\mathbb E_{t,x\sim p_t}\|u_t(x)\|^2}_{C_1}$$

$C_1$ 不含 $\theta$。第一项里的 expectation 只看 $x$ 的 distribution，而“先采 $z$ 再采 $x\sim p_t(\cdot\mid z)$”得到的 $x$ 正好服从 $p_t$，所以它也等于 $\mathbb E_{t,z,x\sim p_t(\cdot\mid z)}\|u^\theta\|^2$。

关键是中间的 cross term。代入 marginalization trick，$p_t(x)$ 消掉，再交换 integral 的顺序：

$$\begin{aligned}\int p_t(x)\,u^{\theta\top}\!\!\int u_t(x\mid z)\frac{p_t(x\mid z)\,p_{\text{data}}(z)}{p_t(x)}\,dz\,dx&=\iint u^{\theta\top}u_t(x\mid z)\,p_t(x\mid z)\,p_{\text{data}}(z)\,dz\,dx\\&=\mathbb E_{t,z,x\sim p_t(\cdot\mid z)}\big[u^{\theta\top}u_t(x\mid z)\big]\end{aligned}$$

于是

$$\mathcal L_{\text{FM}}=\mathbb E_{t,z,x}\Big[\|u^\theta\|^2-2u^{\theta\top}u_t(x\mid z)\Big]+C_1$$

方括号里加上再减去 $\|u_t(x\mid z)\|^2$，前三项凑成一个 square：

$$\mathcal L_{\text{FM}}=\underbrace{\mathbb E_{t,z,x}\big\|u^\theta-u_t(x\mid z)\big\|^2}_{\mathcal L_{\text{CFM}}}\ \underbrace{-\ \mathbb E_{t,z,x}\|u_t(x\mid z)\|^2}_{C_2}+C_1$$

$C=C_1+C_2$ 与 $\theta$ 无关。证毕。

用本页的例子实际核对一次。两个 loss 都用同一批 200000 个 $(t,z,\varepsilon)$ 做 Monte Carlo（numpy `default_rng(0)`），$\mathcal L_{\text{FM}}$ 里的 target 用第 2 站推出的 exact $u_t(x)$：

| model | $\mathcal L_{\text{CFM}}$ | $\mathcal L_{\text{FM}}$ | 差 |
|---|---|---|---|
| exact field $u^\theta=u_t$ | 2.7777 | 0 | 2.7777 |
| exact field 整体加 0.5 | 3.0259 | 0.25 | 2.7759 |
| 什么都不学，$u^\theta=0$ | 5.2542 | 2.4778 | 2.7764 |

三种 model 的差都是 2.776 左右（差异是 Monte Carlo 的 sampling error）。$\mathcal L_{\text{CFM}}$ 能拿来 train，因为它和 $\mathcal L_{\text{FM}}$ 只差一个与 model 无关的 constant。

### Loss 降不到 0

上面第一行说明：即使 network 完美地学到了 marginal field，$\mathcal L_{\text{CFM}}$ 也还有 2.78。这个 constant 是多少？在第一行，$\mathcal L_{\text{FM}}=0$，所以 $C=\mathcal L_{\text{CFM}}(u_t)$，按 regression 那一小节的结论，它就是 target 在每个 $x$ 处的 conditional variance 的平均：

$$C=\int_0^1\mathbb E_{x\sim p_t}\Big[\mathrm{Var}\big(u_t(x\mid z)\ \big|\ x_t=x\big)\Big]\,dt$$

对 CondOT，target 是 $u_t(x\mid z)=\dfrac{z-x}{1-t}$，而 $x=tz+(1-t)\varepsilon$，所以 $z-x=(1-t)(z-\varepsilon)$，target 就是 $z-\varepsilon$。两个端点可以直接读出来：$t=0$ 时 $x=\varepsilon$，知道 $x$ 就知道 $\varepsilon$，剩下的不确定性全在 $z$，conditional variance 是 $\mathrm{Var}(z)=4+0.25=4.25$；$t=1$ 时 $x=z$，剩下的是 $\varepsilon$，variance 是 1。

::fig[mit6s184-plateau] 每个 $t$ 上 exact field 的 conditional loss。曲线下面积约 2.77，与上表 Monte Carlo 的 2.7777 一致。

曲线在 $t=0.2$ 附近反而升到 5.2，比 $t=0$ 还高。原因是 $x=0.2z+0.8\varepsilon$ 时，知道 $x$ 就把 $\varepsilon$ 和 $z$ 绑在一起：$z-\varepsilon=z-(x-0.2z)/0.8=1.25z-1.25x$，它的 conditional variance 是 $1.25^2\,\mathrm{Var}(z\mid x)$，而这时 $x$ 还几乎没告诉我们 $z$ 是哪边，$\mathrm{Var}(z\mid x)$ 还接近 4.25。

:::wrong Loss 降到一个平台不再下降，说明实现错了
Lab 2 的 notebook 专门提醒：loss 会 converge，但不会到 0。只要 data 不止一个点，同一个 $x$ 就对应不止一个 target，loss 的下限是上面的 $C$，本页的例子是 2.77。判断 train 好不好要看 sampling 结果（比如和 ground-truth 的 marginal 比 histogram），不能看 loss 的绝对值。反过来，loss 降到接近 0 倒是值得怀疑：可能 target 和 input 泄露了同一个信息（例如误把 $z$ 也喂给了 network）。
:::

### Gaussian path 下的 training step

Gaussian path 时，$x=\alpha_tz+\beta_t\varepsilon$，把第 2 站的 conditional field 代进去：

$$u_t(x\mid z)=\Big(\dot\alpha_t-\frac{\dot\beta_t}{\beta_t}\alpha_t\Big)z+\frac{\dot\beta_t}{\beta_t}\big(\alpha_tz+\beta_t\varepsilon\big)=\dot\alpha_tz+\dot\beta_t\varepsilon$$

所以

$$\mathcal L_{\text{CFM}}(\theta)=\mathbb E\,\big\|u^\theta_t(\alpha_tz+\beta_t\varepsilon)-(\dot\alpha_tz+\dot\beta_t\varepsilon)\big\|^2$$

CondOT 时 target 是 $z-\varepsilon$。一个 training step（notes 的 Algorithm 3）：

1. 从 dataset 取一个 batch 的 $z$；
2. 采 $t\sim U[0,1]$，采 $\varepsilon\sim N(0,I_d)$；
3. $x=tz+(1-t)\varepsilon$；
4. loss 是 $\|u^\theta_t(x)-(z-\varepsilon)\|^2$，对 $\theta$ 走一步 gradient descent。

整个 training 不需要 simulate 任何 ODE（simulation-free），就是一个 supervised regression。train 完再用第 1 站的 Euler sampling。

Lab 2 正是这样做的：network 是输入 $(x,t)$ 拼在一起、四层 64 宽、SiLU 的 MLP，Adam，learning rate $10^{-3}$，batch 1000，5000 步，notebook 说大约一分钟。Data 是二维的 5-mode Gaussian mixture。

::fig[mit6s184-gmm2d] Lab 2 那个 data 的 exact marginal field（Lab 2 前半的 path：$\alpha_t=t$，$\beta_t=\sqrt{1-t}$，$t=0.5$）。每个 mode 有自己的“领地”，领地交界处 posterior 摇摆，箭头方向突变。领地内的箭头并不指向 mode，而是互相平行，都等于 $\mu_k$。

箭头不指向 mode，算一下就明白。在 component $k$ 内，这条 path 的 conditional field 是 $\big(1+\tfrac{t}{2(1-t)}\big)z-\tfrac{x}{2(1-t)}$，$t=0.5$ 时是 $1.5z-x$。Component 内 $\mathbb E[z\mid x,k]=\mu_k+\tfrac{\alpha_ts^2}{v_t}(x-\alpha_t\mu_k)$，这里 $s=1$、$v_t=\alpha_t^2+\beta_t^2=0.25+0.5=0.75$，所以是 $\mu_k+\tfrac23(x-0.5\mu_k)$。代进去：$1.5\mu_k+(x-0.5\mu_k)-x=\mu_k$，与 $x$ 无关。Component 的中心 $t\mu_k$ 要在 $t=1$ 到达 $\mu_k$，velocity 就是 $\mu_k$；它的 spread 是 $\sqrt{t^2+(1-t)}$，在 $t=0.5$ 时 derivative 为 0，不胀不缩，于是整团点做 pure translation。

:::edge 在有限 dataset 上学得“太好”会怎样
Training 时 $z$ 只能从 training set 里取，所以 $\mathcal L_{\text{CFM}}$ 的 exact minimizer 是 training set（一个由 $N$ 个点组成的 distribution）的 marginal field。第 2 站的两点 dataset 就是这种情形：exact field 把每个 noise 都精确地送到 $-2$ 或 $+2$，不会产生任何新 sample。所以一个“新”的生成，靠的是 network 没有把这个 field 学到 exact，在 data point 之间做了 smooth 的 interpolation。Notes 只说 minimizer 在 network 足够 expressive 时等于 marginal field，没有讨论 memorization；这一段是这一页另加的 corollary。
:::

:::from
$\mathcal L_{\text{FM}}$、$\mathcal L_{\text{CFM}}$、Theorem 12 的证明（展开 square、cross term 代入 marginalization trick、加减 $\|u_t(x\mid z)\|^2$）、Gaussian path 下 target 化简成 $\dot\alpha_tz+\dot\beta_t\varepsilon$、Algorithm 3 来自 [notes](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) 第 3.3 节。“loss converge 但不到 0”是 Lab 2 notebook 的提醒，MLP 的设置也出自 Lab 2。先讲 $\mathbb E(Y-c)^2$ 的引入、Monte Carlo 核对表、$C(t)$ 的曲线和 memorization 的 corollary 是为这一页写的。
:::

## [score] Score function、Fokker–Planck 与 SDE sampling

:::skip
快速路线必读（Lecture 3-A，notes 第 4.1、4.2 节）。能写出 Gaussian path 上 score 与 vector field 的换算、SDE extension trick 的 SDE，并说出 $\sigma$ 大时为什么 step size 必须小，就可以去第 5 站。
:::

### 想在 sampling 时加 noise

第 3 站的 model 是一个 ODE。如果想在 sampling 时加 noise（理由马上会看到：noise 能把一部分数值 error 冲掉），直接在 Euler 上加 $\sigma\sqrt h\,\varepsilon$ 是不行的。$u=0$ 时这就是 Brownian motion，variance 每单位时间增加 $\sigma^2$，distribution 会一直变宽。要加 noise 又不改变 marginal $p_t$，drift 必须补上一个把点往 density 高处推的修正。这个修正需要一个新的量。

### Score function

一个 density $q$ 的 score 是 $\nabla\log q(x)$。它指向 $\log q$ 上升最快的方向。Gaussian $N(\mu,\sigma^2I)$ 的 $\log q=-\|x-\mu\|^2/(2\sigma^2)+\text{const}$，所以 score 是

$$\nabla\log q(x)=-\frac{x-\mu}{\sigma^2}$$

指向 mean，离得越远越大，$\sigma$ 越小越陡。

Gaussian conditional path 的 conditional score 是 $\nabla\log p_t(x\mid z)=-\dfrac{x-\alpha_tz}{\beta_t^2}$。Marginal score 和 vector field 一样，是 conditional score 的 posterior weighted average：

$$\nabla\log p_t(x)=\frac{\nabla p_t(x)}{p_t(x)}=\frac{\int\nabla p_t(x\mid z)\,p_{\text{data}}(z)\,dz}{p_t(x)}=\int\nabla\log p_t(x\mid z)\,\frac{p_t(x\mid z)\,p_{\text{data}}(z)}{p_t(x)}\,dz$$

第一个等号是 $\nabla\log y=\nabla y/y$；第二个把 $\nabla$ 移进 integral；第三个对每个 $z$ 再用一次 $\nabla p_t(x\mid z)=p_t(x\mid z)\nabla\log p_t(x\mid z)$。

拿本页的 Gaussian mixture 算一次。Data 的每个 component 是 $N(\mu_k,s^2)$，$\mu_k=\pm2$，$s=0.5$。在 component $k$ 内，$x_t=tz+(1-t)\varepsilon\sim N(t\mu_k,\ v_t)$，$v_t=t^2s^2+(1-t)^2$。所以 component 的 score 是 $-(x-t\mu_k)/v_t$，marginal score 是用 component posterior $w_k(x)$ 加权。在 $t=0.5$、$x=0.6$，第 2 站已经算出 $v=0.3125$、$w_+=0.97896$、$w_-=0.02104$。

$$\nabla\log p_{0.5}(0.6)=0.97896\times\Big(-\frac{0.6-1}{0.3125}\Big)+0.02104\times\Big(-\frac{0.6+1}{0.3125}\Big)=0.97896\times1.28+0.02104\times(-5.12)=1.1453$$

### Gaussian path 上 score 和 vector field 互相决定

把第 2 站的 conditional field 用 score 改写。由 conditional score 的式子，$\alpha_tz=x+\beta_t^2\,\nabla\log p_t(x\mid z)$，即 $z=\big(x+\beta_t^2\nabla\log p_t(x\mid z)\big)/\alpha_t$。代入 $u_t(x\mid z)=\big(\dot\alpha_t-\tfrac{\dot\beta_t}{\beta_t}\alpha_t\big)z+\tfrac{\dot\beta_t}{\beta_t}x$：

$$\begin{aligned}u_t(x\mid z)&=\Big(\frac{\dot\alpha_t}{\alpha_t}-\frac{\dot\beta_t}{\beta_t}\Big)\big(x+\beta_t^2\nabla\log p_t(x\mid z)\big)+\frac{\dot\beta_t}{\beta_t}x\\&=\frac{\dot\alpha_t}{\alpha_t}x-\frac{\dot\beta_t}{\beta_t}x+\Big(\frac{\dot\alpha_t}{\alpha_t}-\frac{\dot\beta_t}{\beta_t}\Big)\beta_t^2\nabla\log p_t(x\mid z)+\frac{\dot\beta_t}{\beta_t}x\\&=\underbrace{\Big(\beta_t^2\frac{\dot\alpha_t}{\alpha_t}-\dot\beta_t\beta_t\Big)}_{a_t}\nabla\log p_t(x\mid z)+\underbrace{\frac{\dot\alpha_t}{\alpha_t}}_{b_t}x\end{aligned}$$

两边对 posterior 取平均，$x$ 不动，conditional 的都变成 marginal 的（notes 的 Proposition 1）：

$$u_t(x)=a_t\,\nabla\log p_t(x)+b_t\,x$$

学会了 vector field 就学会了 score，反过来也一样。CondOT 时 $a_t=\dfrac{(1-t)^2}{t}+(1-t)=\dfrac{1-t}{t}$，$b_t=\dfrac1t$，于是

$$\nabla\log p_t(x)=\frac{t\,u_t(x)-x}{1-t}$$

核对：$x=0.6$、$t=0.5$ 处 exact 的 $u_{0.5}(0.6)=2.3453$（第 2 站算过的 mixture，不是两点 dataset），$\dfrac{0.5\times2.3453-0.6}{0.5}=1.1453$，与上面直接算的 score 相同。

### Fokker–Planck equation

:::skip
这一小节推导 SDE 怎样改变 density。只想会用的可以跳过，直接看下一小节的结论；代价是 SDE extension trick 变成一个要背的 formula。
:::

ODE 改变 density 的规律是 continuity equation。SDE 多了一个 noise 项，规律多一项。一维里推一次。取任意 smooth 的 test function $f$，看 $\mathbb E f(X_t)$ 怎样变化。走一步 Euler–Maruyama，$X_{t+h}=X_t+\Delta$，$\Delta=h\,u_t(X_t)+\sigma\sqrt h\,\varepsilon$，对 $f$ 做 Taylor expansion 到 second order：

$$f(X_{t+h})=f(X_t)+f'(X_t)\,\Delta+\tfrac12f''(X_t)\,\Delta^2+\cdots$$

取 expectation。$\varepsilon$ 与 $X_t$ 独立、mean 为 0，所以 $\mathbb E[f'\Delta]=h\,\mathbb E[f'u_t]$；$\Delta^2=\sigma^2h\,\varepsilon^2+O(h^{3/2})$，所以 $\mathbb E[\tfrac12f''\Delta^2]=\tfrac12\sigma^2h\,\mathbb E[f'']+O(h^{3/2})$。注意 noise 在 first order 消失了，却在 second order 留下一个和 $h$ 同阶的项，原因正是第 1 站的 $\sqrt h$。除以 $h$、令 $h\to0$：

$$\frac{d}{dt}\mathbb Ef(X_t)=\mathbb E\big[f'(X_t)\,u_t(X_t)\big]+\tfrac12\sigma^2\,\mathbb E\big[f''(X_t)\big]$$

把 expectation 写成对 $p_t$ 的 integral，右边分别 integrate by parts 一次和两次（$f$ 在无穷远处为 0）：

$$\int f\,\partial_tp_t\,dx=-\int f\,\partial_x(p_tu_t)\,dx+\tfrac12\sigma^2\int f\,\partial_x^2p_t\,dx$$

对任意 $f$ 成立，所以

$$\partial_tp_t=-\partial_x(p_tu_t)+\tfrac12\sigma^2\,\partial_x^2p_t$$

高维时 $\partial_x^2$ 换成 Laplacian $\Delta=\sum_i\partial_{x_i}^2$，这就是 Fokker–Planck equation（notes 的 Theorem 19）。$\sigma=0$ 时它退回 continuity equation；多出来的那一项和 heat equation 里的一样，就是 noise 把 density 摊平的效应。

### SDE extension trick

现在可以回答开头的问题。在 marginal field 上加一个 drift 修正 $\tfrac12\sigma_t^2\nabla\log p_t$：

$$dX_t=\Big[u_t(X_t)+\frac{\sigma_t^2}{2}\nabla\log p_t(X_t)\Big]dt+\sigma_t\,dW_t$$

**定理（notes 的 Theorem 17）。** $X_0\sim p_{\text{init}}$ 时，对所有 $t$ 有 $X_t\sim p_t$。

**证明。** 只要验证 $p_t$ 满足这个 SDE 的 Fokker–Planck equation。修正项用 $\nabla p_t=p_t\nabla\log p_t$ 改写：

$$-\mathrm{div}\Big(p_t\cdot\frac{\sigma_t^2}{2}\nabla\log p_t\Big)=-\frac{\sigma_t^2}{2}\,\mathrm{div}\big(\nabla p_t\big)=-\frac{\sigma_t^2}{2}\Delta p_t$$

所以这个 SDE 的 Fokker–Planck 右边是

$$-\mathrm{div}(p_tu_t)-\frac{\sigma_t^2}{2}\Delta p_t+\frac{\sigma_t^2}{2}\Delta p_t=-\mathrm{div}(p_tu_t)=\partial_tp_t$$

最后一个等号是第 2 站的 continuity equation。修正项造成的“收拢”恰好抵消 noise 造成的“摊平”。证毕。

这对任意 $\sigma_t\ge0$ 都成立，而且 $\sigma_t$ 可以在 training 之后再选。在 Gaussian path 上，score 由 vector field 换算，所以只需要 train 一个 $u^\theta$。

取 $u_t=0$、$p_t=p$ 不随时间变，就得到第 1 站的 Langevin dynamics：$dX_t=\tfrac12\sigma^2\nabla\log p(X_t)\,dt+\sigma\,dW_t$ 保持 $p$ 不变。这就是 OU process 停在 $N(0,D)$ 的理由。

::fig[mit6s184-sde] 本页例子上同样 10 个起点。左边 ODE，右边 $\sigma=1$ 的 SDE（exact 的 $u$ 和 score，Euler–Maruyama 400 步）。单条路径完全不同，每个时刻的 distribution 相同。

### $\sigma$ 取多大

理论上任何 $\sigma$ 都行，实际上要数值地走。用 exact 的 $u$ 和 score，从 100000 个 $N(0,1)$ sample 出发（numpy `default_rng(0)`），统计终点在正半轴的那一半：mean（应为 2）、std（应为 0.5），以及落在 $|x|<1$ 这个空隙里的比例（应为 $\Phi(-2)-\Phi(-6)=0.0228$）：

| $\sigma$ | $n=10$ | $n=20$ | $n=50$ | $n=1000$ |
|---|---|---|---|---|
| 0（ODE） | 1.865 / 0.495 / 0.051 | 1.934 / 0.495 / 0.036 | 1.975 / 0.496 / 0.028 | 2.002 / 0.496 / 0.023 |
| 1 | 1.951 / 0.513 / 0.034 | 1.975 / 0.508 / 0.027 | 1.989 / 0.501 / 0.025 | 1.999 / 0.501 / 0.023 |
| 2 | 1.995 / 0.638 / 0.060 | 1.997 / 0.552 / 0.035 | 1.998 / 0.519 / 0.028 | 2.001 / 0.504 / 0.023 |
| 4 | diverge（mean 12.1，std 18.7） | 1.982 / 1.074 / 0.207 | 1.997 / 0.604 / 0.051 | 2.002 / 0.505 / 0.024 |

（每格是 mean / std / 空隙比例。）三件事：步数足够多时（$n=1000$）所有 $\sigma$ 都对；步数少时 $\sigma=1$ 的 mean 比 ODE 准（10 步时 1.951 对 1.865），noise 加上 score 的拉力把 Euler 欠走的部分补回来一些；$\sigma$ 大了反而坏，$\sigma=4$、10 步时直接 diverge。

diverge 的原因可以算出来。在一个 mode 附近，drift 对 $x$ 是 linear 的。CondOT 的 component field 是 $\mu+\dfrac{ts^2-(1-t)}{v_t}(x-t\mu)$，score 修正是 $-\dfrac{\sigma^2}{2v_t}(x-t\mu)$，所以 $x$ 前面的 coefficient 是

$$c(t)=\frac{ts^2-(1-t)}{v_t}-\frac{\sigma^2}{2v_t}$$

Euler 每步把偏离乘上 $1+h\,c(t)$，$|1+hc|>1$ 就越走越大，所以要 $h<2/|c|$。$v_t=0.25t^2+(1-t)^2$ 在 $t=0.8$ 处最小，等于 0.2，而这一点上第一项的 numerator $0.8\times0.25-0.2=0$，所以 $c(0.8)=-\sigma^2/0.4$，要求

$$h<\frac{0.8}{\sigma^2}$$

$\sigma=4$ 时 $h<0.05$，即 $n>20$：$n=10$ diverge，$n=20$ 恰在边界上（std 1.07），$n=50$ 才正常。$\sigma=2$ 时要 $h<0.2$，$n=10$ 已经满足，但 std 0.638 说明离边界不远时虽不 diverge、error 也大。

:::wrong Marginal 和 $\sigma$ 无关，所以 $\sigma$ 随便取
连续时间的定理只保证 exact 的 field 和 score、无限小的 step size 下 marginal 不变。实际上 $\sigma$ 越大，drift 里的 $\tfrac12\sigma^2\nabla\log p_t$ 越陡，需要的 step size 按 $1/\sigma^2$ 缩小；而且 network 学到的 score 有 error，这个 error 被 $\tfrac12\sigma^2$ 放大。Notes 的说法是：对一个 train 好的 model，存在一个经验上最好的 $\sigma_t$，太大的 $\sigma_t$ 需要“prohibitively small”的 step size。上表 $\sigma=4$ 那一行就是数值上的例子。
:::

:::edge Conditional SDE 在 $t\to1$ 时会爆
Lab 2 让你对单个 $z$ simulate $dX_t=\big[u_t(X_t\mid z)+\tfrac12\sigma^2\nabla\log p_t(X_t\mid z)\big]dt+\sigma\,dW_t$。CondOT 下 conditional score 是 $(tz-x)/(1-t)^2$，$x$ 的 coefficient 约为 $-\sigma^2/(2(1-t)^2)$。Euler 要 $h\cdot\sigma^2/(2(1-t)^2)<2$，即 $1-t>\tfrac12\sigma\sqrt h$；最后约 $\sigma/(2\sqrt h)$ 步都不满足，而且步数越多，不满足的步也越多。实算（$z=2$，起点 $N(0,1)$，2000 个 sample）：$\sigma=0$ 时终点与 $z$ 的平均距离是 $10^{-17}$；$\sigma=0.5$ 时 100 步是 1.68，1000 步是 $1.5\times10^5$。Lab 2 的 notebook 给出的办法是让 $\sigma_t=\beta_t$，noise 和 diverge 的项一起衰减。Lab 2 自己的 path 是 $\beta_t=\sqrt{1-t}$，coefficient 只有 $-(1+\sigma^2)/(2(1-t))$，最后一步才不稳定，所以那里只是“结果变宽”，没有爆。Marginal SDE 没有这个问题，是因为本页的 $p_{\text{data}}$ 有 std 0.5，score 在 $t=1$ 有界；真实图像的 data 接近一个个点，marginal score 在 $t\to1$ 也会变得很陡，这时同样要让 $\sigma_t\to0$。
:::

:::from
Score 的定义、marginal score 的推导、Proposition 1 的换算、Fokker–Planck equation（Theorem 19）、SDE extension trick 及其证明（Theorem 17，用 $\nabla p=p\nabla\log p$）、Langevin 作为特例、“存在经验上最好的 $\sigma_t$”来自 [notes](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) 第 4.1、4.2 节；notes 附录 B 用 test function 和 Taylor expansion 证 Fokker–Planck，这里按同样的思路写了一维版本。Conditional SDE 的爆炸和 $\sigma_t=\beta_t$ 的办法来自 Lab 2 notebook 的说明。$\sigma$ 与步数的数表、stability 条件 $h<0.8/\sigma^2$ 的推导、conditional SDE 的实算是为这一页算的。
:::

## [dsm] Denoising score matching 与 noise prediction

:::skip
快速路线必读（Lecture 3-A 后半，notes 第 4.3 节）。能写出 noise prediction 的 loss，能在 $u$、score、$\hat\varepsilon$、denoiser 之间换算，并说出 denoiser 的 output 为什么模糊，就可以去第 6 站。
:::

### Marginal score 也算不出来

想直接学 score，loss 是 $\mathcal L_{\text{SM}}=\mathbb E\|s^\theta_t(x)-\nabla\log p_t(x)\|^2$，和第 3 站一样，target 是对整个 dataset 的平均，算不出来。办法也一样：regress 到 conditional score，

$$\mathcal L_{\text{CSM}}(\theta)=\mathbb E_{t,z,x\sim p_t(\cdot\mid z)}\big\|s^\theta_t(x)-\nabla\log p_t(x\mid z)\big\|^2$$

第 3 站的证明只用到了一件事：marginal 是 conditional 的 posterior weighted average。上一站刚证明 marginal score 也是这样，所以证明一字不改地成立（notes 的 Theorem 22）：$\mathcal L_{\text{SM}}=\mathcal L_{\text{CSM}}+C$。这叫 denoising score matching。

### Gaussian path：score matching 就是猜 noise

Gaussian path 上 $x=\alpha_tz+\beta_t\varepsilon$，conditional score 是

$$\nabla\log p_t(x\mid z)=-\frac{x-\alpha_tz}{\beta_t^2}=-\frac{\beta_t\varepsilon}{\beta_t^2}=-\frac{\varepsilon}{\beta_t}$$

代入 loss，提出 $1/\beta_t^2$：

$$\mathcal L_{\text{CSM}}=\mathbb E\,\Big\|s^\theta_t(x)+\frac{\varepsilon}{\beta_t}\Big\|^2=\mathbb E\,\frac{1}{\beta_t^2}\big\|\beta_ts^\theta_t(x)+\varepsilon\big\|^2$$

令 $\varepsilon^\theta_t(x)=-\beta_ts^\theta_t(x)$，括号里就是 $\varepsilon-\varepsilon^\theta_t(x)$：network 在猜加进去的 noise。$t\to1$ 时 $\beta_t\to0$，前面的 $1/\beta_t^2$ 爆掉，loss 的 variance 极大。DDPM 的做法是干脆把这个 weight 丢掉：

$$\mathcal L_{\text{DDPM}}(\theta)=\mathbb E\,\big\|\varepsilon^\theta_t(\alpha_tz+\beta_t\varepsilon)-\varepsilon\big\|^2$$

丢掉 weight 后，它和 $\mathcal L_{\text{CSM}}$ 不再只差一个 constant，但每个 $t$ 上的 minimizer 不变（每个 $t$ 上仍然是在 regress 同一个 target，只是不同 $t$ 的重要性变了），所以学到的还是同一个东西。

### 四个量其实是一个：$\mathbb E[z\mid x]$

Vector field、score、noise prediction 之外，还可以让 network 直接猜干净的 data，叫 denoiser $D_t(x)=\mathbb E[z\mid x_t=x]$。它们之间是什么关系？对 $x=\alpha_tz+\beta_t\varepsilon$ 两边取“给定 $x_t=x$”的 conditional expectation，左边就是 $x$ 本身：

$$x=\alpha_t\,D_t(x)+\beta_t\,\hat\varepsilon_t(x),\qquad\hat\varepsilon_t(x)=\mathbb E[\varepsilon\mid x_t=x]$$

另外三个关系：conditional score 是 $-\varepsilon/\beta_t$，取 posterior 平均得 $\nabla\log p_t(x)=-\hat\varepsilon_t(x)/\beta_t$；conditional field 是 $\dot\alpha_tz+\dot\beta_t\varepsilon$，取平均得 $u_t(x)=\dot\alpha_tD_t(x)+\dot\beta_t\hat\varepsilon_t(x)$；把第一式解出 $\hat\varepsilon_t$ 代进 score，得

$$\nabla\log p_t(x)=\frac{\alpha_tD_t(x)-x}{\beta_t^2}$$

（这个式子常叫 Tweedie's formula。）所以四个量都由 $D_t(x)$ 和 $x$ linear 地决定，知道一个就知道全部。Notes 的 Remark 16 正是这样说的：它们都只依赖 posterior mean $\mathbb E[z\mid x]$。

在本页的例子上逐个核对，$t=0.5$、$x=0.6$。Component 内 $z$ 和 $x$ 是 jointly Gaussian，$\mathbb E[z\mid x,k]=\mu_k+\dfrac{\mathrm{Cov}(z,x)}{\mathrm{Var}(x)}(x-t\mu_k)=\mu_k+\dfrac{ts^2}{v_t}(x-t\mu_k)$，即 $+$ 那边是 $2+0.4\times(-0.4)=1.84$，$-$ 那边是 $-2+0.4\times1.6=-1.36$。用上一站的 $w_\pm$ 加权：

$$D=0.97896\times1.84+0.02104\times(-1.36)=1.7727$$

然后由第一式，$\hat\varepsilon=(x-tD)/(1-t)=(0.6-0.88634)/0.5=-0.5727$；score $=-\hat\varepsilon/\beta_t=0.5727/0.5=1.1453$，与上一站相同；$u=D-\hat\varepsilon=1.7727+0.5727=2.3453$，也与上一站相同。

### 换 parameterization 等于换 loss 的 weight

既然四个量可以互换，让 network 输出哪一个有区别吗？有：它决定了 loss 在各个 $t$ 上的 weight。以 CondOT 为例，假设 network 输出 $\hat\varepsilon^\theta$，再按上面的关系换算成 vector field。由 $x=tD+(1-t)\hat\varepsilon$ 得 $D=(x-(1-t)\hat\varepsilon)/t$，于是

$$u^\theta=D^\theta-\hat\varepsilon^\theta=\frac{x-(1-t)\hat\varepsilon^\theta}{t}-\hat\varepsilon^\theta=\frac{x-\hat\varepsilon^\theta}{t}$$

代入 flow matching 的误差，用 $x=tz+(1-t)\varepsilon$：

$$u^\theta-(z-\varepsilon)=\frac{tz+(1-t)\varepsilon-\hat\varepsilon^\theta}{t}-z+\varepsilon=\frac{\varepsilon-\hat\varepsilon^\theta}{t}$$

所以

$$\big\|u^\theta-(z-\varepsilon)\big\|^2=\frac{1}{t^2}\big\|\hat\varepsilon^\theta-\varepsilon\big\|^2$$

Flow matching loss 就是 noise prediction loss 乘上 $1/t^2$。$t$ 小（noise 多）的时候，flow matching 把猜 noise 的 error 放大得很厉害。反过来说，用 $\mathcal L_{\text{DDPM}}$ training 时，$t$ 小处的 error 在 loss 里分量很轻，但 sampling 时它会被 $1/t$ 放大进 vector field。这是“DDPM 那种 noise prediction 在 noise 很大时表现差”的一个具体原因；选 parameterization 和选 time weight 是同一个决定。

:::wrong Denoiser 输出的是一张干净的图
$D_t(x)$ 是 posterior mean，是所有可能的干净 data 按 posterior 的平均。两点 dataset 在 $t=0.1$、$x=0.6$ 处，$D=2\tanh\big(2\times0.1\times0.6/0.81\big)=0.294$：它不是 $-2$ 也不是 $+2$，是两者之间一个从来不是 data 的点。图像上的表现就是 $t$ 小时 denoiser 的 output 是一团模糊的平均。只有 posterior 集中在一个 data point 上时（$t$ 接近 1，或者 data 本身只有一种可能），$D$ 才接近一个干净的 sample。Notes 在 Remark 16 的脚注里把“denoiser 是否总是输出干净的 data point”留作思考题，这里的例子就是答案的一部分。
:::

:::from
Denoising score matching、Theorem 22、Gaussian path 下的 noise prediction、DDPM 丢掉 $1/\beta_t^2$ 的理由、Algorithm 4、Remark 16（各量都只依赖 $\mathbb E[z\mid x]$，以及 denoiser 的思考题）来自 [notes](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) 第 4.3 节。“取 conditional expectation 得到 $x=\alpha_tD+\beta_t\hat\varepsilon$”的推法、$1/t^2$ 的 weight 换算、denoiser 的数值例子是为这一页写的；Tweedie's formula 这个名字 notes 没有用。
:::

## [cfg] Guidance 与 classifier-free guidance

:::skip
快速路线必读（Lecture 3-B，notes 第 5 章，Lab 3 Part 2）。能写出 CFG 的 training 和 sampling，能从 Bayes rule 推出 $(1-w)u(x\mid\varnothing)+w\,u(x\mid y)$，并知道 $w>1$ 时 sample 到的不是 $p(x\mid y)$，就可以去第 7 站。
:::

### 带 prompt 的生成

现在每个 data point 带一个 label 或 prompt $y$（“一只在雪地里跑的狗”，或者 MNIST 的数字 0 到 9），要从 $p_{\text{data}}(\cdot\mid y)$ 里 sample。Notes 把这叫 guided generation，用“guided”而不用“conditional”，因为“conditional”已经被“以 data point $z$ 为条件”占用了。

固定 $y$，这就是一个新的 unconditional 问题，前三站原样适用。让 $y$ 也变化，只需要把 $y$ 喂给 network，data 成对地取：

$$\mathcal L^{\text{guided}}_{\text{CFM}}(\theta)=\mathbb E_{(z,y)\sim p_{\text{data}},\ t,\ x\sim p_t(\cdot\mid z)}\big\|u^\theta_t(x\mid y)-u_t(x\mid z)\big\|^2$$

Target 里没有 $y$：conditional path 只看 $z$，$y$ 只在 network 的 input 里出现。理论上这就够了。

### 理论上够了，实际不够

Notes 的 Figure 11 是 ImageNet 上“corgi dog”的 sample：只用上面的 loss train 出来的 model，生成的图常常不像 corgi。原因有两个：model 欠拟合，train data 里的 label 和图片本身也对不准（网上抓来的图文对很多是错的）。需要一个旋钮，人为加强 $y$ 的作用。

### Classifier guidance

在 Gaussian path 上，guided 的 vector field 同样可以用 score 表示：$u_t(x\mid y)=a_t\nabla\log p_t(x\mid y)+b_tx$。对 $p_t(x\mid y)$ 用 Bayes rule：

$$p_t(x\mid y)=\frac{p_t(x)\,p_t(y\mid x)}{p_t(y)}\qquad\Longrightarrow\qquad\nabla\log p_t(x\mid y)=\nabla\log p_t(x)+\nabla\log p_t(y\mid x)$$

$p_t(y)$ 和 $x$ 无关，求 gradient 时消失。代回去：

$$u_t(x\mid y)=\underbrace{a_t\nabla\log p_t(x)+b_tx}_{u_t(x)}+a_t\nabla\log p_t(y\mid x)$$

Guided field 是 unguided field 加上一个“往 $y$ 更可能的方向推”的项，$p_t(y\mid x)$ 是一个对 noisy input 做分类的 classifier。把这一项放大 $w>1$ 倍：

$$\tilde u_t(x\mid y)=u_t(x)+w\,a_t\nabla\log p_t(y\mid x)$$

这叫 classifier guidance，$w$ 叫 guidance scale。$w\ne1$ 时它已经不是任何 distribution 的 exact field，只是一个经验上有效的修改。缺点是要另外 train 一个能处理 noisy input 的 classifier，而 $y$ 是一段文字时这个 classifier 很难 train。

### Classifier-free guidance

把 classifier 消掉。由上面的式子，$a_t\nabla\log p_t(y\mid x)=u_t(x\mid y)-u_t(x)$，代入 $\tilde u$：

$$\tilde u_t(x\mid y)=u_t(x)+w\big(u_t(x\mid y)-u_t(x)\big)=(1-w)\,u_t(x)+w\,u_t(x\mid y)$$

只需要 unguided 和 guided 两个 field。再把 unguided 也并进同一个 network：加一个 null label $\varnothing$ 表示“没有 prompt”，令 $u_t(x)=u_t(x\mid\varnothing)$。training 时以 probability $\eta$ 把 $y$ 换成 $\varnothing$（notes 的 Algorithm 5）：

1. 取一对 $(z,y)$，采 $t\sim U[0,1]$、$\varepsilon\sim N(0,I_d)$，$x=\alpha_tz+\beta_t\varepsilon$；
2. 以 probability $\eta$ 令 $y\leftarrow\varnothing$；
3. loss 是 $\|u^\theta_t(x\mid y)-(\dot\alpha_tz+\dot\beta_t\varepsilon)\|^2$。

sampling 时每一步算两次 network：

$$\tilde u^\theta_t(x\mid y)=(1-w)\,u^\theta_t(x\mid\varnothing)+w\,u^\theta_t(x\mid y)$$

$w=1$ 时是普通的 guided model，$w=0$ 时是 unguided model。Notes 说几乎所有 AI 生成的图像和视频都用 CFG，$w\ge4$ 很常见。代价是每步两次 forward pass：Stable Diffusion 3 用 50 步 Euler，就是 100 次 network evaluation。

把本页的例子改成两类：$y=-$ 的 data 是 $N(-2,0.5^2)$，$y=+$ 的是 $N(2,0.5^2)$，各占一半，所以 $u(x\mid\varnothing)$ 就是前几站的 mixture field。$y=+$ 的 guided field 是单个 Gaussian 的 field，$2+\dfrac{ts^2-(1-t)}{v_t}(x-2t)$。在 $t=0.5$：

| $x$ | $u(x\mid\varnothing)$ | $u(x\mid +)$ | $w=4$ 的 $\tilde u$ |
|---|---|---|---|
| 0 | 0 | 3.2 | $-3\times0+4\times3.2=12.8$ |
| 1 | 1.9894 | 2.0 | $-3\times1.9894+4\times2.0=2.0318$ |

在 $x=1$，unguided model 已经确信这个点属于 $+$，两个 field 几乎相同，guidance 几乎不起作用；在 $x=0$，unguided model 不知道去哪边（field 为 0），guidance 把差值放大 4 倍。CFG 只在“类别还模糊”的地方使劲。

用 exact field 跑 CFG 的 ODE（起点是 $N(0,1)$ 的 4000 个 quantile，Euler 400 步），终点的统计：

| $w$ | 1 | 1.5 | 2 | 4 | 8 |
|---|---|---|---|---|---|
| mean | 2.000 | 2.192 | 2.325 | 2.683 | 3.136 |
| std | 0.498 | 0.401 | 0.358 | 0.290 | 0.249 |

$w=1$ 正好是 $N(2,0.5^2)$。$w$ 越大，distribution 越窄（sample 更“典型”、多样性更低），整体被推离另一类，越过了 $+$ 类自己的 mean。

::fig[mit6s184-cfg] 三种 guidance scale 下 $y=+$ 的 sample 的 histogram，黑粗线是真正的 $p(x\mid +)$。$w$ 增大，distribution 变窄并向右移。

:::wrong CFG sample 出来的是 sharpened 的 distribution $p(x\mid y)\,p(y\mid x)^{w-1}$
把 $\nabla\log p(x\mid y)+(w-1)\nabla\log p(y\mid x)$ 看成某个 density 的 score，容易以为 CFG 在 $t=1$ sample 到的是 $p(x\mid y)\,p(y\mid x)^{w-1}$。在这个例子里实际算一下：$t=1$ 时两类几乎不重叠，$+$ 类所在之处 $p(+\mid x)\approx1$，这个 sharpened distribution 和 $p(x\mid +)$ 几乎一样，$w=4$ 时 mean 2.0002、std 0.4997。可 CFG 的 ODE 给出的是 mean 2.68、std 0.29。差别来自中间时刻：guidance 是加在每个 $p_t$ 上的，在 $t$ 不大、两类还重叠的时候被放大的那一推，到了 $t=1$ 已经无法撤回。Notes 只说 $w>1$ 时 $X_1$ 不一定服从 $p_{\text{data}}(\cdot\mid y)$，经验上更贴合 prompt；这里的数字说明它也不服从那个 sharpened distribution。
:::

:::edge Lab 3 的 null label
MNIST 的 label 是 0 到 9，Lab 3 把 $\varnothing$ 定为 10，所以 label embedding 要开 11 类；Sanity Check 2.4 的三类 Gaussian mixture 用 3 作为 null label。training 时 Lab 3 用 $\eta=0.35$（MNIST）和 $\eta=0.25$（sanity check），sampling 时比较 $w=1,3,5$。
:::

:::from
Guided CFM loss、“guided”这个词的用法、vanilla guidance 不够的两个原因和 corgi 的例子、classifier guidance 与 CFG 的推导（Bayes rule、$a_t\nabla\log p_t(y\mid x)=u_t(x\mid y)-u_t(x)$）、null label、Algorithm 5、“$w\ge4$ 很常见”来自 [notes](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) 第 5 章；SD3 的 50 步和 CFG scale 出自 notes 第 6.3 节。Lab 3 notebook 用同样的推导引出 CFG，$\eta$ 与 null label 的设置出自那里。两类一维例子、数表和“不是 sharpened distribution”的对照是为这一页算的。
:::

## [arch] Architecture、latent space 与大规模系统

:::skip
快速路线里 DiT 部分必读（Lecture 4 前半，Lab 3 Part 3），VAE 和 latent diffusion 部分（Lab 3 Part 4、5）时间不够可以只读结论。能画出 DiT 的 data flow、说出 adaLN-Zero 为什么让 training 稳定、算出 latent space 省下多少 attention 计算，就读完这一页了。
:::

### Network 吃什么、吐什么

不管 parameterization 是哪种，network 都是 $u^\theta_t(x\mid y)$：input 是 $x\in\mathbb R^d$、时间 $t$、prompt $y$，output 和 $x$ 同样形状。二维的 toy data 用 MLP 就够，Lab 2 直接把 $t$ 拼在 $x$ 后面当第三个 input。图像需要专门的 architecture，notes 讲了两种：U-Net（全 convolution 的 encoder–decoder，中间有 skip connection，input 和 output 都是图像形状）和 diffusion transformer（DiT）。Lab 3 只做 DiT，这一页也只讲 DiT。

### Time embedding

为什么不能像 Lab 2 那样直接把 $t$ 当一个数喂进去？看第 2 站两点 dataset 在 $x=0.6$ 处的 field 随 $t$ 的变化：

| $t$ | 0.5 | 0.7 | 0.8 | 0.9 | 0.95 |
|---|---|---|---|---|---|
| $u_t(0.6)$ | 2.73 | 4.67 | 7.0 | 14.0 | 28.0 |

$t\ge0.7$ 之后它就是 $1.4/(1-t)$，$t$ 从 0.9 到 0.95 只动了 0.05，output 翻倍。Network 要从一个 scalar input 里造出这种急剧的依赖很费力。Notes 的说法是用 Fourier feature 能更忠实地表示“high-frequency 的 time dependence”：

$$\mathrm{TimeEmb}(t)=\sqrt{\tfrac{2}{d}}\,\big[\cos(2\pi w_1t),\dots,\cos(2\pi w_{d/2}t),\ \sin(2\pi w_1t),\dots,\sin(2\pi w_{d/2}t)\big]^\top$$

一组从低到高的 frequency，network 可以从中挑合适的组合。它的 length 恒为 1：每对 $\cos^2+\sin^2=1$，共 $d/2$ 对，sum of squares 是 $d/2$，乘上 $\sqrt{2/d}$ 的 square $2/d$，得 1。Notes 的 frequency 是从 $w_{\min}$ 到 $w_{\max}$ 等比排列的；Lab 3 的 `FourierEncoder` 换成了从 $N(0,1)$ 抽出、可学习的 $w_i$。

### DiT：把图像当成一串 token

Transformer 处理的是一串 vector（token）。**Patchify** 把 $C\times H\times W$ 的图像切成 $P\times P$ 的小块，每块拉平成 $CP^2$ 维，再乘一个 matrix 映射到 hidden dimension $d$，得到 $N=(H/P)(W/P)$ 个 token。Lab 3 的 MNIST 是 $1\times32\times32$，patch size 4，所以 $N=8\times8=64$ 个 token，每块 16 个 pixel 映射到 256 维（lab 里用一个 stride 为 $P$ 的 convolution 一次做完）。每个 token 再加一个可学习的 positional encoding。

然后是 $L$ 个 DiT block，每个 block 里 token 之间做 self-attention，

$$\mathrm{Attn}(Q,K,V)=\mathrm{softmax}\Big(\frac{QK^\top}{\sqrt{d_h}}\Big)V$$

$QK^\top$ 是 $N\times N$ 的，所以 attention 的计算和 memory 按 $N^2$ 增长。最后 **depatchify** 把每个 token 映射回 $CP^2$ 个数，拼回图像形状，作为 $u^\theta$。

$t$ 和 $y$ 怎样进入？Lab 3 把两者的 embedding 相加，得到一个 conditioning vector $c$；在 notes 的大 model 里，text prompt 另外通过 cross-attention 进入。$c$ 通过 adaptive normalization（adaLN）作用于每个 sub-layer：

$$(\gamma,\beta,\alpha)=g(c),\qquad h\leftarrow h+\alpha\odot\mathrm{SubLayer}\big((1+\gamma)\odot\mathrm{Norm}(h)+\beta\big)$$

先 normalize，再按 $t$、$y$ 做 scale（$\gamma$）和 shift（$\beta$），sub-layer（attention 或 MLP）的 output 再乘一个 gate $\alpha$ 加回 residual stream。

**adaLN-Zero** 指把 $g$ 的最后一层初始化为 0。这时 $\gamma=\beta=\alpha=0$，每个 sub-layer 的贡献是 $0\odot\mathrm{SubLayer}(\cdot)=0$，于是 $h\leftarrow h$：每个 block 一开始都是 identity，整个 network 一开始只是 patchify 接 depatchify。training 从一个简单、稳定的 function 出发，每个 block 的作用从 0 慢慢长出来。Lab 3 的 solution 正是把 `ada_ln` 的最后一个 Linear 的 weight 和 bias 都 `zeros_` 初始化，注释写的是“stabilizes residual connection”。

::fig[mit6s184-dit] Lab 3 的 DiT：patch size 4、8 个 block、hidden dimension 256、8 个 attention head；notebook 的 training 设置是 20000 步、batch 256、learning rate $4\times10^{-4}$，注释说约 15 个 A100 分钟能得到合理的结果。

:::back
MLP、residual connection 和 backpropagation 见 [CS3244 的 neural network 一站](../courses/CS3244.html#nn)。
:::

### 为什么要到 latent space

一张 $1024\times1024$ 的 RGB 图片是 $d=1024\times1024\times3=3{,}145{,}728$ 维，network 的 output 也必须是这么多维。用 patch size 2 直接在 pixel 上做 DiT，有 $512^2=262{,}144$ 个 token，一个 attention matrix 有 $262144^2\approx6.9\times10^{10}$ 个 entry，每个 head、每层一个。

先 train 一个 autoencoder 把图像压缩到 latent，再在 latent 里做 flow matching。按每边压缩 16 倍、保留 3 个 channel，latent 是 $3\times64\times64=12{,}288$ 维，是原来的 $1/256$。同样 patch size 2，token 数是 $32^2=1024$，attention matrix 的 entry 数是原来的 $(262144/1024)^2=65{,}536$ 分之一。

只用 reconstruction loss training 的 autoencoder 不够：它只保证能还原，不保证 latent 的 distribution 好学，latent 可能被拉伸到任意的 scale、在空间里散得不规则。所以要用 variational autoencoder（VAE）。

### VAE

:::skip
这一小节是 VAE 的细节（对应 Lab 3 Part 4）。跳过的话，只需记住：VAE 的 loss 是 reconstruction 加上 $\beta$ 倍的 KL，后者把 latent 拉向 $N(0,I)$。
:::

Encoder 不输出一个点，而输出一个 Gaussian：$q_\phi(z\mid x)=N\big(\mu_\phi(x),\mathrm{diag}(\sigma^2_\phi(x))\big)$；decoder 是 $p_\theta(x\mid z)=N\big(\mu_\theta(z),\sigma^2I\big)$。Loss 有两项：

$$\mathcal L_{\text{VAE}}=\underbrace{\mathbb E_{z\sim q_\phi(\cdot\mid x)}\big[-\log p_\theta(x\mid z)\big]}_{\text{reconstruction}}+\beta\,\underbrace{D_{\text{KL}}\big(q_\phi(\cdot\mid x)\,\|\,N(0,I_k)\big)}_{\text{prior}}$$

Decoder variance 固定时，$-\log p_\theta(x\mid z)=\|x-\mu_\theta(z)\|^2/(2\sigma^2)+\text{const}$，第一项就是 MSE。第二项把每个 $x$ 的 latent 拉向 $N(0,I)$，让 latent 的整体 distribution 规整、scale 固定。

KL 有 closed form。一维时，$q=N(\mu,\sigma^2)$，$p=N(0,1)$：

$$D_{\text{KL}}(q\,\|\,p)=\mathbb E_q\big[\log q(z)-\log p(z)\big]=\mathbb E_q\Big[-\tfrac12\log\sigma^2-\frac{(z-\mu)^2}{2\sigma^2}+\frac{z^2}{2}\Big]$$

（两边的 $-\tfrac12\log2\pi$ 抵消。）$\mathbb E_q(z-\mu)^2=\sigma^2$，$\mathbb E_qz^2=\sigma^2+\mu^2$，所以

$$D_{\text{KL}}=-\tfrac12\log\sigma^2-\tfrac12+\tfrac12(\sigma^2+\mu^2)=\tfrac12\big(\sigma^2+\mu^2-1-\log\sigma^2\big)$$

Diagonal Gaussian 的各个 coordinate 独立，KL 是各 coordinate 的和。例如 $\mu=(1,0)$、$\sigma^2=(0.25,1)$：第一维 $\tfrac12(0.25+1-1-\log0.25)=\tfrac12(0.25+1.386)=0.818$，第二维 $\tfrac12(1+0-1-0)=0$，合计 0.818。第二维和 prior 完全一样，没有携带任何关于 $x$ 的信息，KL 就是 0。

training 时要对 $z\sim q_\phi$ 求 gradient。办法是 reparameterization：$z=\mu_\phi(x)+\sigma_\phi(x)\odot\varepsilon$，$\varepsilon\sim N(0,I)$，随机性全部移到与 $\phi$ 无关的 $\varepsilon$ 上，gradient 可以穿过 $\mu_\phi$ 和 $\sigma_\phi$。

两项互相拉扯，叫 rate–distortion trade-off：$\beta$ 大，latent 规整好学，但携带的信息少，重建模糊，极端时所有 latent 都等于 prior（posterior collapse）；$\beta$ 小，重建清楚，latent 却难学。生成质量的上限由 decoder 的重建质量决定。Notes 提到实践中常见的处理：KL 的 weight 从小慢慢加大（warm-up）、现代的 autoencoder 用很小的 $\beta$、pixel MSE 容易模糊所以另加 perceptual 或 adversarial loss。

Lab 3 的 VAE 是 4 个 encoder block、channel 依次为 16、32、64、128，前三个 block 各 downsample 一次，所以 $32\times32$ 变成 $4\times4$，latent 是 $128\times4\times4=2048$ 个数，比原图的 1024 个 pixel 还多。这里省下的是 token 数：latent DiT 用 patch size 1，只有 16 个 token，pixel DiT 是 64 个。Notebook train VAE 的那个 cell 设的是 $\beta=10$（class 的 default 是 0.1）。

### Latent flow matching 与两个案例

VAE train 好之后冻结。Latent 上的 training 和 pixel 上一模一样，只是 data 换成 $z=\mu_\phi(x)$；sampling 时在 latent 里解 ODE，最后用 decoder decode。Lab 3 的提示是 encode 时要包在 `torch.no_grad()` 里。

::fig[mit6s184-latent] Latent diffusion 的两个阶段。Lab 3 的数：图像 $1\times32\times32$，latent $128\times4\times4$，latent DiT 只有 16 个 token。

Notes 第 6.3 节的两个案例都是这一页讲过的东西拼起来的：

| | Stable Diffusion 3 | Meta Movie Gen Video |
|---|---|---|
| Training objective | conditional flow matching | conditional flow matching，$\alpha_t=t$、$\beta_t=1-t$ |
| Latent | pretrained autoencoder | temporal autoencoder，时间、高、宽各压缩 8 倍，合计 $8^3=512$ 倍；长视频按时间分块 encode（temporal tiling） |
| Network | MM-DiT，image patch 与 text 一起做 attention，最大 8B parameter | 类似 DiT，self-attention 加对 text 的 cross-attention，最大 30B parameter |
| Prompt | CLIP embedding 与 T5-XXL 的 sequence embedding | UL2、ByT5、MetaCLIP 三个 text encoder |
| Sampling | 50 步 Euler，CFG scale 2.0 到 5.0 | （读到的摘要里没有） |

:::wrong Latent 一定比原图小，所以 latent diffusion 的好处是“维数低”
Lab 3 的 latent 有 2048 个数，比 1024 个 pixel 多。真正决定计算量的是 token 数（attention 按 $N^2$ 增长）和 latent 是否好学：VAE 把空间分辨率压低、把信息搬进 channel，让每个 token 承载更多内容，同时 KL 让 latent 的 distribution 规整。大 model 里 latent 的总维数也确实小得多（上面的 256 倍），但两件事不能混为一谈。
:::

:::from
Network 的 input/output、Fourier time embedding 及其“high-frequency time dependence”的理由、patchify、DiT block 的结构（adaLN 的 $(1+\gamma)\odot\mathrm{Norm}(x)+\beta$、gate、class-conditioned DiT 不用 cross-attention）、为什么要到 latent space、VAE 的 loss、KL、reparameterization、rate–distortion、$\beta$ 的实践说明、SD3 与 Movie Gen 的数字来自 [notes](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) 第 6 章（6.2 节以后只读到工具返回的摘要）。Lab 3 的 DiT、VAE 设置、adaLN-Zero 的实现与注释、`torch.no_grad()` 的提示来自 Lab 3 notebook 和 solutions。$u_t(0.6)$ 的数表、token 数与 attention 的比较、KL 的例子、“latent 比原图大”的观察是为这一页算的。
:::

## 作业

三个 lab 都是 Jupyter notebook，课程主页给的是 Google Drive / Colab 链接，GitHub 仓库 [eje24/iap-diffusion-labs](https://github.com/eje24/iap-diffusion-labs/tree/2026) 的 2026 branch 里有 `labs/`（要填的版本）和 `solutions/`（完整答案，公开）。没有 autograder：每个 notebook 都画出 ground truth 和你的结果并排的图，对得上就算对。下面的提示注明了出处：“notebook”指 2026 branch 的 `labs/*.ipynb`，“solution”指 `solutions/`，“changelog”指仓库 README，“经验”是这一页自己的判断。所需时间除 notebook 自己写的以外都是估计。

### Lab 1：Simulating ODEs and SDEs（值得做）

**要实现什么。** `EulerSimulator` 和 `EulerMaruyamaSimulator` 的 `step`；Brownian motion、OU process、Langevin dynamics 三个 SDE 的 drift 和 diffusion coefficient；最后在纸上证明 $N(0,\sigma^2/2\theta)$ 的 Langevin dynamics 就是 OU process（第 1 站最后一小节）。

**做完会什么。** 第 1 站的全部内容变成代码，后两个 lab 都直接复用这里的 simulator 接口（`drift_coefficient`、`diffusion_coefficient`、`step`）。

**时间和算力。** Notebook 没有写；估计 2 到 3 小时。CPU 即可，free Colab 足够。

**提示。**

- Euler–Maruyama 的 noise 项是 $\sqrt h\,\sigma_t\,z_t$（notebook 正文的 formula）。Notebook 也指出 diffusion coefficient 为 0 时它应当和 Euler 完全一样，用这一点检查自己的 `step`。
- OU 那几题，notebook 提示盯住 $D=\sigma^2/(2\theta)$，并有一组图把 $D$ 相同、$\sigma$ 不同的参数放在一起比较（notebook）。按第 1 站的推导，$D$ 相同时终点的 distribution 宽度相同，$\sigma$ 只影响 converge 得多快。
- Langevin 的 drift 用 `self.density.score(xt)`，`Density` 基类已经用 `vmap(jacrev(...))` 实现了 score，不用自己求导（notebook 的代码）。
- Lab 的 Langevin 例子是从 $N(0,20I)$ 出发、目标是相距很远的 5 个 mode。Langevin 很难跨越 mode 之间的低 density 区域，各 mode 最终的比例主要由起点落在哪个“领地”决定，未必等于 target 的 weight（经验）。
- 可选的动画 cell 需要 `ffmpeg`，notebook 说用 `conda install -c conda-forge ffmpeg`，`pip install ffmpeg` 一般不行。
- Changelog 记录过 Langevin dynamics 的 timestep bug（2025 年 3 月修复）和用 Colab + Chrome 导出 PDF 会被截断的问题；交作业前打开 PDF 检查是否完整。

### Lab 2：Flow Matching and Score Matching（先做）

**要实现什么。** Gaussian conditional path（$\alpha_t=t$、$\beta_t=\sqrt{1-t}$）的 sample、conditional vector field 和 conditional score；flow matching 与 score matching 的 trainer（`get_train_loss`）；从学到的 vector field 换算 score（`ScoreFromVectorField`）；最后实现 linear path，在 Gaussian 与 checkerboard、moons 等任意两个 distribution 之间做 flow。

**做完会什么。** 第 2 到 5 站的公式全部变成代码：conditional path、marginalization trick（通过 training 隐式实现）、$\mathcal L_{\text{CFM}}$、$\mathcal L_{\text{CSM}}$、SDE extension trick、score 与 field 的换算。

**时间和算力。** Notebook 说每次 training“大约一分钟”；整份估计 3 到 4 小时。二维 toy data，CPU 或 free Colab 都够。

**提示。**

- Loss 会 converge 但不会到 0（notebook 两次加粗强调）。本页第 3 站算过，下限是 target 的平均 conditional variance；Lab 2 的 data 尺度更大（mode 在半径 10 的 circle 上），平台值也会更高。判断对不对看 notebook 画出的“学到的 marginal”与“ground-truth marginal”是否吻合。
- Conditional SDE 那题，notebook 的说明是：$\sigma$ 不太大时就可能出怪事，因为 $t\to1$ 时 $\beta_t\to0$，score 项 $(\alpha_tz-x)/\beta_t^2$ diverge，并随 $\sigma^2$ 放大；实践中取 $\sigma_t=\beta_t$。具体到这个 lab 的 path，按第 4 站的算法，最后一步的 Euler coefficient 是 $(1+\sigma^2)/2$，$\sigma^2>3$ 时那一步会把偏差放大；cell 里默认 $\sigma=2.5$，一维实算终点与 $z$ 的平均距离是 0.22，$\sigma=0$ 时是 0.014。所以看到的是“变宽”而不是爆炸（这两句是自己算的）。
- 仓库 changelog 写着 2026 年 1 月修复了 `ConditionalVectorFieldSDE` 和 `LangevinFlowSDE` 的 diffusion coefficient 被乘了两次 noise 的 bug（“doubly stochastic”）。但 2026 branch 当前的 `labs/lab_two.ipynb` 里，这两个 class 的 `diffusion_coefficient` 仍然返回 `self.sigma * torch.randn_like(x)`，而 `solutions/` 里已改为 `return self.sigma`；`EulerMaruyamaSimulator.step` 自己会再乘一次 `torch.randn_like`。用的如果是这个版本，把那两行改成返回 `self.sigma`（核对 notebook 与 solution 的结果；课程主页的 Google Drive 版本没能打开核对）。
- 第 3.3 题的记号和 notes 是反的：notebook 写 $u=a_tx+b_t\nabla\log p_t$，$a_t=\dot\alpha_t/\alpha_t$；notes 写 $u=a_t\nabla\log p_t+b_tx$，$b_t=\dot\alpha_t/\alpha_t$（对照 notebook 与 notes）。公式本身一致，照抄 coefficient 时别混。
- 同一题 notebook 说分母 $\beta_t^2\dot\alpha_t-\alpha_t\dot\beta_t\beta_t$ 在 $t=1$ 为 0。数学上它等于 $1-t/2$，在 $t=1$ 是 $1/2$；之所以在代码里变成 0，是因为 `SquareRootBeta.dt` 在分母里加了 $10^{-4}$，$t=1$ 时 $\dot\beta_t$ 是有限的 $-5000$，乘上 $\beta_1=0$ 得 0。照 notebook 的做法用 $t=1-\epsilon$ 即可（推导是自己做的）。
- Linear path 的 conditional field $(z-x)/(1-t)$ 只在 $[0,1)$ 上有定义，notebook 的 docstring 写明了；`torch.rand` 采的 $t$ 不会等于 1，但自己写的 time grid 和画图要避开端点。

### Lab 3：Diffusion Transformer and VAEs（先做）

**要实现什么。** MNIST 上的 class-conditional 生成：CFG 的 trainer 和 guided ODE；从零写 DiT 的每个部件（Fourier time encoder、patchifier、multi-head attention、带 adaLN-Zero 的 DiT layer、depatchifier）并 training；再写一个 VAE（residual block、attention block、encoder、decoder、loss），在它的 latent space 里 train latent DiT。

**做完会什么。** 第 6、7 站的内容，以及一个可以搬到别的 data 上的、完整的 latent flow matching training 流程。

**时间和算力。** Notebook 的注释说 pixel DiT 和 latent DiT 各约 15 个 A100 分钟能得到合理结果；整份估计 6 到 8 小时。需要 GPU：train VAE 的 cell 里写死了 `torch.device('cuda')`。Free Colab 的 T4 能跑，但比 A100 慢不少，三次 training 合计可能要一到两个小时（估计）。Part 4、5（VAE 和 latent DiT）时间不够可以只读 solution。

**提示。**

- Null label 是 10，所以 `nn.Embedding` 开 11 类；training 时用 `mask = torch.rand(batch_size) < self.eta` 把一部分 label 换成 10。采 $t$ 用 `torch.rand`（uniform），采 noise 用 `torch.randn`，notebook 特意提醒别混（notebook 的 hints）。
- Solution 采 $t$ 时乘了 $(1-\epsilon)$，$\epsilon=10^{-3}$：这个 lab 的 path 是 $\beta_t=1-t$，conditional field 里除以 $\beta_t$，$t$ 不能取到 1（solution；理由见第 2 站最后的 edge）。
- 先跑 Sanity Check 2.4（三类二维 Gaussian mixture + MLP）确认 CFG trainer 和 guided ODE 没问题，再上 MNIST。Notebook 建议 2.2 和 2.3 两题一起做、用 2.4 检查；图像上的 bug 很难从 sample 里看出来（后半句是经验）。
- adaLN-Zero：notebook 说把 conditioning MLP 的最后一层 zero-init 即可，这对稳定 training 有帮助；modulation 写成 $x\mapsto x(1+\gamma)+\beta$，$\gamma,\beta,\alpha$ 的形状是 `b d`，要 broadcast 到 `b n d`。Positional encoding 推荐 `nn.Parameter(torch.randn(n_tokens, dim))`；feed-forward 的 hidden dimension 常用 `[dim, 4*dim, dim]`（都是 notebook 的 hints）。Solution 里 $t$ 和 $y$ 的 embedding 是直接相加后送进每层的 adaLN。
- Latent trainer 里 `vae.encode` 要包在 `torch.no_grad()` 下（notebook 的 hint）；否则 VAE 的计算图会被一起保留，GPU memory 明显上涨（经验）。
- `MNISTSampler.sample` 每次在 Python 里逐张取图、做 resize 和 normalize，batch 256、两万步时 CPU 端可能成为瓶颈（看代码得出的判断，没有实测）。
- Changelog 记录过 guidance embedding 的维度 bug 和 solution 里 sample conditioning variable 的 bug，都已修复；卡住时对照 2026 branch 的 solution。
