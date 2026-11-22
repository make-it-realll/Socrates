---
code: CORNELL-CS5788
evidence: syllabus
evidenceNote: "Cornell Tech Spring 2026 一期（CS 5788，Andrew Owens 主讲，Kuleshov、Gao、Vondrick 各有客座讲次）。讲法跟着课程主页公开的 slides（用 WebFetch 读了 Lec 2、3、6、9、10、12、15、20、25，工具返回的是逐页转述，不是原文；Lec 5 VAE、Lec 7 GAN、Lec 8 三份 PDF 抓取失败，这三讲的内容改用 Stanford CS236 的公开 notes 和 Lec 20 midterm review 里的复习页补上）和 4 份 problem set handout（只读了 PDF，notebook 在 Google Drive 上，没有打开）。录像只在 Canvas，没有看。快速路线、可跳过的部分来自本站的调研条目，作业提示对着 handout 核对过。"
exam: "课程主页：homework 40%（4 份等权）、midterm 30%（3 小时，大部分是 multiple choice，可带一页手写 cheat sheet）、final project 30%。在这里自学没有考试，以作业为主。"
subskills:
  - id: mle
    name: Maximum likelihood、KL 与 Gaussian mixture
    l3: "能写出 Gaussian 的 MLE，并说出 MLE 等价于最小化哪个方向的 KL。"
    l4: "能用 logsumexp 写出 GMM 的 negative log-likelihood，并用 $\\Sigma=AA^\\top+\\varepsilon I$ 保证 covariance 正定。"
    l5: "能用一个 bimodal 的例子算出 forward KL 和 reverse KL 各自选出的 Gaussian，并解释 training likelihood 随 $K$ 单调上升而 test likelihood 不会。"
  - id: vae
    name: Latent variable model、ELBO 与 VAE
    l3: "能写出 ELBO 的两种形式：reconstruction 减 KL，以及 $\\log p(x)-D_{\\text{KL}}(q\\,\\|\\,p(z\\mid x))$。"
    l4: "能不用 Jensen 推出 $\\log p(x)=\\text{ELBO}+D_{\\text{KL}}(q\\,\\|\\,p(z\\mid x))$，并写出 reparameterization 后的 training step。"
    l5: "能在一个 linear Gaussian model 上算出 ELBO 的 gap，并比较 score-function estimator 与 reparameterization 的 variance。"
  - id: flow
    name: Normalizing flow 与 coupling layer
    l3: "能用 change of variables 算一个 1D 变换后的 density。"
    l4: "能写出 affine coupling layer 的 forward、inverse 和 $\\log|\\det|$，并算一个数值例子的 exact log-likelihood。"
    l5: "能解释 coupling layer 为什么 Jacobian 是 triangular、为什么要交替换边，以及 MAF 与 IAF 在 density 和 sampling 上的取舍。"
  - id: gan
    name: GAN：minimax、optimal discriminator 与训练动态
    l3: "能写出 GAN 的 minimax objective 和 non-saturating generator loss。"
    l4: "能推出 optimal discriminator，并代回得到 $-\\log4+2\\,\\mathrm{JSD}$。"
    l5: "能在 Dirac GAN 上说明 simultaneous gradient descent 为什么绕着 equilibrium 越转越远，并解释 mode collapse 从哪里来。"
  - id: ebm
    name: Energy-based model、Langevin dynamics 与 score matching
    l3: "能说出 EBM 里哪些量算得出（energy、ratio、score）、哪个算不出（$Z$）。"
    l4: "能推出 $\\nabla_\\theta\\log Z=\\mathbb E_{p_\\theta}[-\\nabla_\\theta E_\\theta]$，并写出 Langevin dynamics 和 denoising score matching 的 loss。"
    l5: "能用一个 weight 不等的 mixture 说明单一 noise level 的 Langevin 为什么得不到正确的 mode 比例。"
  - id: diff
    name: Diffusion：forward process、VLB 与 noise prediction
    l3: "能写出 $x_t=\\sqrt{\\bar\\alpha_t}x_0+\\sqrt{1-\\bar\\alpha_t}\\,\\varepsilon$ 和 $L_{\\text{simple}}$ 的 training step。"
    l4: "能推出 posterior $q(x_{t-1}\\mid x_t,x_0)$ 的 mean 和 variance，以及 VLB 的 $L_T+\\sum L_{t-1}+L_0$ 分解。"
    l5: "能推出 $\\varepsilon$ parameterization 下每一项的 weight，说清 $L_{\\text{simple}}$ 丢掉的是什么，以及 $\\varepsilon$ 与 $x_0$ 两种 target 的 loss 相差多少倍。"
  - id: ar
    name: Autoregressive model 与 teacher forcing
    l3: "能用 chain rule 写出一个 autoregressive model 的 likelihood，并按 raster 顺序算一个小例子。"
    l4: "能数出 table、independent、logistic 三种做法的 parameter 数，并说明 training 为什么能并行而 sampling 不能。"
    l5: "能证明 teacher forcing 就是 MLE，并说明用 model 自己的 sample 做 prefix 的 objective 为什么不是。"
  - id: eval
    name: Evaluation：likelihood、Inception Score 与 FID
    l3: "能把 NLL 换算成 bits/dim，并写出 IS 和 FID 的 formula。"
    l4: "能对一个小例子手算 IS，并在 1D 里算 FID。"
    l5: "能举出 likelihood 与 sample quality 背离、FID 看不出 mode 结构、FID 在 sample 少时有 bias 的例子，并说明 behavior cloning 为什么需要 generative model。"
open:
  - label: "Cornell CS 5788 Introduction to Generative Models（Spring 2026）课程主页"
    url: "https://www.cs.cornell.edu/courses/cs5788/2026sp"
    note: "讲次安排、readings、考核方式、先修要求。"
  - label: "CS 5788 Lec 2：Maximum likelihood、Gaussian distribution"
    url: "https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec2-mle.pdf"
    note: "第 1 站：MLE 即最小化 KL、KL 不对称、image patch 的例子、用 validation likelihood 选 hyperparameter。"
  - label: "CS 5788 Lec 3：Gaussian mixture models"
    url: "https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec3-gmm.pdf"
    note: "第 1 站：GMM 的 latent 解释、EM 与 SGD 两条路、SGD 的 parameterization（$AA^\\top+\\varepsilon I$、softmax logits）。"
  - label: "CS 5788 Lec 6：Normalizing flows"
    url: "https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec6-normalizing.pdf"
    note: "第 3 站：从“能不能去掉 encoder”引入、change of variables、building block 的 det 代价、coupling layer。"
  - label: "CS 5788 Lec 9：Energy-based models"
    url: "https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec9-ebms.pdf"
    note: "第 5 站全部：$Z$ 的问题、MLE gradient、contrastive divergence、Langevin、Fisher divergence、Hyvärinen 与 denoising score matching。"
  - label: "CS 5788 Lec 10：Diffusion models"
    url: "https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec10-diffusion.pdf"
    note: "第 5、6 站：从猫走到 noise 的直觉、noise prediction 的 training 与 sampling、Tweedie 与 score 的联系。"
  - label: "CS 5788 Lec 15：More diffusion"
    url: "https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec15-more-diffusion.pdf"
    note: "第 6 站：forward process、closed form、VAE 类比、VLB 分解、analytic posterior、$L_{\\text{simple}}$、DDIM、latent diffusion。"
  - label: "CS 5788 Lec 12：Autoregressive models（Kuleshov）"
    url: "https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec12-kuleshov-autoregressive.pdf"
    note: "第 7 站：binarized MNIST 的 parameter 计数、logistic conditional、raster 顺序的例子、WaveNet、PixelCNN。"
  - label: "CS 5788 Lec 20：Midterm review"
    url: "https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec20-midterm-review.pdf"
    note: "VAE 与 GAN 的复习页（代替没抓到的 Lec 5、7），change of variables 的练习题，teacher forcing。"
  - label: "CS 5788 Lec 25：Evaluating generative models；generative models for robotics"
    url: "https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec25-evaluation.pdf"
    note: "第 8 站：likelihood 的长处与短处、IS、FID 及其 pitfall、robotics 部分。"
  - label: "Stanford CS236 notes：Variational autoencoders"
    url: "https://deepgenerativemodels.github.io/notes/vae/"
    note: "第 2 站的论证顺序：intractable marginal、ELBO 与 gap、black-box VI、score function 与 reparameterization、amortization。工具返回的版本缺了 formula。"
  - label: "Stanford CS236 notes：Normalizing flow models"
    url: "https://deepgenerativemodels.github.io/notes/flow/"
    note: "第 3 站的 NICE、RealNVP、MAF 与 IAF 的取舍。formula 同样缺失。"
  - label: "Stanford CS236 notes：Generative adversarial networks"
    url: "https://deepgenerativemodels.github.io/notes/gan/"
    note: "第 4 站的 likelihood-free 动机、two-sample test、训练的三个难处、CycleGAN。formula 缺失。"
  - label: "CS 5788 Problem Sets 1 至 4（PDF handout）"
    url: "https://www.cs.cornell.edu/courses/cs5788/2026sp/psets/ps1.pdf"
    note: "作业一节。其余三份在同一目录下的 ps2.pdf、ps3.pdf、ps4.pdf。"
sources:
  - label: "Kingma & Welling, An Introduction to Variational Autoencoders（Lec 5 的 reading，本页没有读）"
    url: "https://arxiv.org/pdf/1906.02691"
  - label: "Ho et al., Denoising Diffusion Probabilistic Models（Lec 15 的 reading，本页没有读原文）"
    url: "https://arxiv.org/abs/2006.11239"
---

先看两次失败。两次都在做同一件事：手里有一堆 sample，想得到一个能产生新 sample 的 distribution。

**第一次。** Data 是一维的，一半在 $-2$ 附近，一半在 $2$ 附近：$p_{\text{data}}=\tfrac12N(-2,0.5^2)+\tfrac12N(2,0.5^2)$。用 maximum likelihood 去 fit 一个 Gaussian，得到 $N(0,4.25)$（第 1 站算）。它的 sample 有 37.2% 落在 $|x|<1$，data 在那里只有 2.3%。Gaussian 的形状只有一个 bump，参数再怎么选也长不出两个。

::fig[cs5788-fit] 第一次失败。底色是 $p_{\text{data}}$，彩色曲线是 MLE 选出的 Gaussian。灰色竖条是 $|x|<1$：model 往这里放了三分之一以上的 sample，data 几乎没有。下面两行各是 40 个 sample。

**第二次。** 那就让一个 neural network $f_\theta(x)\ge0$ 直接输出 density，形状随便它长。问题是 density 必须满足 $\int f_\theta(x)\,dx=1$。一维时可以在 grid 上数值积分再除掉；PS1 里一个 $16\times16$ 的 image patch 是 256 维，每维只取 100 个 grid point，也要算 $100^{256}=10^{512}$ 次 network。Network 本身不会保证积分为 1，而“除以积分”这一步做不了。

这门课的全部内容，就是绕开第二次失败的几种办法。每种办法都给出一个灵活的 $p_\theta$，代价是放弃一点别的东西：

| Family（站） | 怎样绕开 normalization | $p_\theta(x)$；sampling |
|---|---|---|
| GMM（1） | 每个 component 自己 normalized | exact；一步 |
| VAE（2） | latent $z$ 加简单的 $p(x\mid z)$ | ELBO；一步 |
| Flow（3） | invertible map 加 change of variables | exact；一步 |
| GAN（4） | 不写 density，只训练 sampler | 无；一步 |
| EBM（5） | 只写 unnormalized 的 $e^{-E_\theta}$ | 只有比值；MCMC |
| Diffusion（6） | 拆成很多个 Gaussian 小步 | VLB；$T$ 步 |
| AR（7） | chain rule，每个 conditional 一个变量 | exact；$d$ 步 |

页面按课程的讲次顺序走：MLE 和 KL 是所有 family 共用的标准（第 1 站，Lec 2、3）；然后是 latent variable 的 VAE（第 2 站，Lec 5）、flow（第 3 站，Lec 6）、GAN（第 4 站，Lec 7、8）、EBM 与 score matching（第 5 站，Lec 9）、diffusion（第 6 站，Lec 10、15）、autoregressive（第 7 站，Lec 12、14），最后是怎样比较它们（第 8 站，Lec 25）。Flow matching 的完整推导、DiT 和 latent diffusion 的架构已经在 [MIT 6.S184](../courses/MIT-6.S184.html) 讲过，这一页只讲把 diffusion 放回全景时需要的部分；Transformer 的实现在 [Zero to Hero 的 GPT 一站](../courses/KARPATHY-Z2H.html#gpt)；post-training（Lec 19、21，PS4 的 DPO）的推导在 [CS4248 的 post-training 一站](../courses/CS4248.html#post)。Lec 11、13、17、18、22 到 24（computer vision、discrete diffusion、downstream adaptation、image editing、scaling、provenance、audio）这一页没有写。

整页反复用两个一维的例子：上面那个两个 bump 的 $p_{\text{data}}$，以及第 5、6 站把 weight 改成 0.8 和 0.2 的版本。它们的 density、score、KL 都能精确算出来，可以拿每种 model 的行为和正确答案逐个对照。

## [mle] Maximum likelihood、KL 与 Gaussian mixture

:::skip
快速路线必读（Lec 2、3）。能说出 MLE 最小化的是 $D_{\text{KL}}(p_{\text{data}}\,\|\,p_\theta)$、它为什么会选出图里那个宽 Gaussian，以及 GMM 的 loss 为什么要用 logsumexp，就可以去第 2 站。
:::

### 选 $\theta$ 的标准

手里有 $N$ 个 i.i.d. 的 sample $x_1,\dots,x_N$。Model 给每个 $\theta$ 一个 density $p_\theta$。Maximum likelihood estimation（MLE）选让这批 data 出现的 probability 最大的 $\theta$：

$$\hat\theta=\arg\max_\theta\prod_{i=1}^Np_\theta(x_i)=\arg\max_\theta\sum_{i=1}^N\log p_\theta(x_i)$$

取 log 是因为 product 会 underflow，而 sum 的 gradient 好算；log 是 increasing function，argmax 不变。等价地，最小化 negative log-likelihood $\text{NLL}(\theta)=-\sum_i\log p_\theta(x_i)$。

对 1D Gaussian，$\log p_\theta(x)=-\tfrac12\log(2\pi\sigma^2)-\dfrac{(x-\mu)^2}{2\sigma^2}$。对 $\mu$ 求 derivative：$\sum_i(x_i-\mu)/\sigma^2=0$，所以 $\mu=\tfrac1N\sum_ix_i$。对 $\sigma^2$ 求 derivative：$-\dfrac{N}{2\sigma^2}+\dfrac{\sum_i(x_i-\mu)^2}{2\sigma^4}=0$，所以 $\sigma^2=\tfrac1N\sum_i(x_i-\mu)^2$。推导细节见 [ST2132 的 point estimation 一站](../courses/ST2132.html#est)。

用一个小 dataset 走一遍。从两个 bump 各取三个点：$\{-2.5,-2,-1.5,1.5,2,2.5\}$。Mean 是 0。Variance 是

$$\sigma^2=\frac{2\times(6.25+4+2.25)}{6}=\frac{25}{6}=4.1667$$

平均 log-likelihood 是 $-\tfrac12\log(2\pi\times4.1667)-\tfrac12=-2.1325$。这个 Gaussian 在 0 处的 density 是 0.195，比它在任何一个 data point 上的 density 都大，而 0 附近一个 data point 都没有。

多元 Gaussian 一样：$\mu$ 的 gradient 是 $\Sigma^{-1}\sum_i(x_i-\mu)$，令它为 0 得到 $\mu=\tfrac1N\sum_ix_i$（Lec 2 的推导，用到 $\partial(u^\top Au)/\partial u=(A+A^\top)u$），$\Sigma$ 是 sample covariance。PS1 的第一题就是在 16×16 patch 上算这两个量，Lec 2 给出的 sample 被标为 "not so great"：一个 Gaussian 只会产生模糊的、没有 edge 的 patch。

### MLE 在最小化哪个距离

Lec 2 的论证是：在 objective 里减去一个和 $\theta$ 无关的项，再乘 $1/N$，argmax 不变。

$$\arg\max_\theta\frac1N\sum_i\log p_\theta(x_i)=\arg\min_\theta\frac1N\sum_i\log\frac{p^*(x_i)}{p_\theta(x_i)}$$

$p^*$ 是真正的 data distribution。$N$ 很大时，sample average 趋于 expectation，右边变成

$$\mathbb E_{x\sim p^*}\Big[\log\frac{p^*(x)}{p_\theta(x)}\Big]=D_{\text{KL}}(p^*\,\|\,p_\theta)$$

所以 MLE 在最小化从 data 到 model 的 KL divergence。把它拆开看：$\mathbb E_{p^*}[-\log p_\theta]=H(p^*)+D_{\text{KL}}(p^*\,\|\,p_\theta)$，左边是 population 上的平均 NLL，$H(p^*)$ 是 data 的 entropy，与 $\theta$ 无关。对两个 bump 的 $p_{\text{data}}$ 数值积分：$H=1.4188$；用 $N(0,4.25)$ 时平均 NLL 是 2.1424，于是 KL 是 $2.1424-1.4188=0.7236$，和直接积分 KL 得到的 0.7236 一致。

这个方向决定了 MLE 的性格。$D_{\text{KL}}(p\,\|\,q)=\int p\log(p/q)$ 在 $p>0$ 而 $q\to0$ 的地方趋于无穷，所以 $q$ 必须在 $p$ 有 mass 的每一处都给出不小的 density。只能是一个 Gaussian 时，最好的办法就是同时盖住两个 bump，代价是中间那片空地也被盖上了。在 Gaussian family 里，最小化 $D_{\text{KL}}(p\,\|\,q)$ 的解正是 moment matching：$q$ 的 mean 和 variance 等于 $p$ 的，$\mu=0$，$\sigma^2=0.25+4=4.25$。

### 另一个方向的 KL

KL 不对称（Lec 2 特意强调）。反过来最小化 $D_{\text{KL}}(q\,\|\,p)=\int q\log(q/p)$：现在是 $q>0$ 而 $p\approx0$ 的地方受罚，$q$ 只要待在 $p$ 大的地方就行，不必盖住全部。

::fig[cs5788-kl] 同一个 $p_{\text{data}}$，在 Gaussian family 里按两个方向最小化 KL。数是数值积分算的：grid search 找到的 reverse KL 最优解恰好是 $N(2,0.25)$，即其中一个 bump。

数值上，reverse KL 的最优值是 0.693，几乎正好是 $\log2=0.6931$：$q=N(2,0.25)$ 时，$p$ 在 $q$ 的 support 上约等于 $\tfrac12q$，于是 $\log(q/p)\approx\log2$。同一个 $q$ 的 forward KL 是 15.3，因为左边那个 bump 完全没被盖住。

这两个方向后面都会再出现。第 2 站 VAE 的 encoder 最小化的是 $D_{\text{KL}}(q\,\|\,p(z\mid x))$，所以 $q$ 倾向于缩在 posterior 的一个 mode 里；第 4 站 GAN 的 objective 是两个方向的折中（Jensen–Shannon divergence）；第 8 站会看到，只看 sample 好不好的 metric 和 likelihood 对“漏掉一个 bump”的惩罚完全不同。

### Gaussian mixture

一个 Gaussian 不够，就用 $K$ 个加权：

$$p_\theta(x)=\sum_{k=1}^K\pi_k\,N(x;\mu_k,\Sigma_k),\qquad\pi_k\ge0,\ \sum_k\pi_k=1$$

Sampling 分两步（Lec 3）：先抽 $z\sim\text{Categorical}(\pi)$，再抽 $x\sim N(\mu_z,\Sigma_z)$。$z$ 从不被观测到，它是一个 latent variable。这是全课第一个 latent variable model：$p(x)=\sum_zp(z)p(x\mid z)$，每一项都简单，加起来就灵活。

在 6 个点上取 $K=2$：$\pi=(\tfrac12,\tfrac12)$，$\mu=\pm2$，每个 cluster 内的 variance 是 $(0.25+0+0.25)/3=\tfrac16$。平均 log-likelihood 是 $-1.2162$，比单个 Gaussian 的 $-2.1325$ 高 0.92。它在 0 处的 density 是 $6.0\times10^{-6}$，中间那片空地终于空了。

MLE 的难处在 $\log p_\theta(x_i)=\log\sum_k\pi_kN(x_i;\mu_k,\Sigma_k)$：log 在 sum 外面，没有 closed form。Lec 3 讲了两条路。一条是 EM：用 Jensen's inequality 得到一个 lower bound，交替地把 bound 贴紧（E-step）和对 bound 做 weighted Gaussian MLE（M-step），完整推导见 [CS3244 的 clustering 一站](../courses/CS3244.html#em)。Lec 3 把这个 bound 叫作 ELBO，第 2 站会把它推广到连续的 $z$。另一条是直接对 NLL 做 SGD，这是这门课其余部分的做法，PS1 也这样做。

### 用 SGD 训练时的三个细节

**Covariance 要一直正定。** 直接把 $\Sigma$ 当成 free parameter，更新几步就可能不再正定，$\log\det\Sigma$ 和 $\Sigma^{-1}$ 都没有定义。Lec 3 和 PS1 的做法是 $\Sigma=AA^\top+\varepsilon I$，$A$ 是任意 matrix，$\varepsilon=10^{-4}$。对任何 $v\ne0$，

$$v^\top(AA^\top+\varepsilon I)v=\|A^\top v\|^2+\varepsilon\|v\|^2\ \ge\ \varepsilon\|v\|^2>0$$

所以不管 $A$ 怎么更新，$\Sigma$ 都正定，而且最小的 eigenvalue 不小于 $\varepsilon$，$\det\Sigma$ 不会趋于 0。

**Weight 要一直在 simplex 上。** 用 logits $w$ 加 softmax：$\pi_k=e^{w_k}/\sum_je^{w_j}$，任何 $w$ 都给出合法的 $\pi$。

**Log 要在 sum 之前取。** 256 维的 Gaussian 在自己的 mean 处，log density 就有 $-\tfrac12\cdot256\log2\pi=-235.2$（unit variance 时），离 mean 远一点的 patch 很容易到 $-1000$。float32 的 `exp` 在参数小于约 $-87.3$ 时就是 0。设两个 component 的 $\log\pi_k+\log N_k$ 是 $-1000.69$ 和 $-1003.69$，先 exp 再加得到 $0$，取 log 得到 $-\infty$。Logsumexp 先把最大的那项提出来：

$$\log\sum_ke^{a_k}=a_{\max}+\log\sum_ke^{a_k-a_{\max}}=-1000.69+\log(1+e^{-3})=-1000.64$$

括号里的每一项都在 $(0,1]$ 之间，不会 underflow。PyTorch 的 `torch.logsumexp` 就是这样实现的。

:::wrong Component 越多，model 越好
Training log-likelihood 随 $K$ 只升不降：$K$ 个 component 的 model 可以把一个 weight 设成 0 退回 $K-1$ 个。但看 test。在 6 个点上取 $K=6$，每个 component 放在一个 data point 上，variance 取 $\varepsilon=10^{-4}$：training 的平均 log-likelihood 是 $1.894$，远高于 $K=2$ 的 $-1.216$。一个新的点 $x=1.8$（就在右边 bump 里）的 log-likelihood 却是 $-198.1$；$K=2$ 给它 $-0.836$，单个 Gaussian 给它 $-2.021$。$K=6$ 把 training data 背了下来。Lec 2 的处理是用 validation set 上的 log-likelihood 选 $K$，PS1 的 1.1(g) 让你画出 $K=1,4,16,32,64$ 时的 NLL 观察这件事。
:::

:::from
MLE 的定义、Gaussian MLE、“MLE 等于最小化 $D_{\text{KL}}(p^*\|p_\theta)$”的论证顺序、KL 不对称、用 validation likelihood 选 hyperparameter 来自 [Lec 2](https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec2-mle.pdf)。GMM 的两步 sampling、latent 的解释、log 在 sum 外面、EM 与 SGD 两条路、$AA^\top+\varepsilon I$ 和 softmax logits 来自 [Lec 3](https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec3-gmm.pdf)（Lec 3 没有提 logsumexp，那一段是我加的）。两个 bump 的例子、6 个点的 dataset、两个方向 KL 的数值、$K=6$ 的过拟合数字是为这一页算的。
:::

## [vae] Latent variable model、ELBO 与 VAE

:::skip
快速路线必读（Lec 5）。能写出 $\log p(x)=\text{ELBO}+D_{\text{KL}}(q(z\mid x)\,\|\,p(z\mid x))$ 并说出每一项的意思、写出 reparameterization 后的 training step，就可以去第 3 站。第 6 站的 VLB 是这里的 ELBO 用在一条 chain 上。
:::

### 连续的 latent：积分算不出

GMM 的 latent 是离散的，$K$ 个 component 意味着 $K$ 种“原型”。图像的变化是连续的：一根笔画的角度、粗细、位置。于是让 $z\in\mathbb R^k$ 连续，$p(z)=N(0,I)$，再用一个 neural network（decoder）把 $z$ 变成 $x$ 的 distribution：$p_\theta(x\mid z)=N(\mu_\theta(z),\sigma^2I)$。

$$p_\theta(x)=\int p(z)\,p_\theta(x\mid z)\,dz$$

这个积分对一般的 network 没有 closed form。CS236 notes 的说法是：用 Monte Carlo 估计可以，但 variance 太大。

用一个所有量都能精确算的 toy model 看 variance 有多大。$z\sim N(0,1)$，$x\mid z\sim N(2z,0.25)$，也就是 decoder 是 $\mu_\theta(z)=2z$。这时 $x=2z+0.5\varepsilon$，是两个 independent Gaussian 之和，$p(x)=N(0,4+0.25)=N(0,4.25)$，恰好是第 1 站 MLE 选出的那个 Gaussian。看 $x=2$：$p(2)=0.1209$，$\log p(2)=-2.113$。

最直接的估计是从 prior 抽 $z_1,\dots,z_M$，算 $\tfrac1M\sum_jp(x\mid z_j)$。它是 unbiased 的，但每个 sample 的 relative variance 是 $\mathbb E[p(x\mid z)^2]/p(x)^2-1=3.67$（数值积分）：$M=100$ 时 relative standard deviation 是 $\sqrt{3.67/100}=19\%$，要 367 个 sample 才压到 10%。原因是只有少数 $z$ 能把 $x=2$ 解释好。Posterior 是

$$p(z\mid x)=N\Big(\frac{2x}{4.25},\ \frac{0.25}{4.25}\Big)=N(0.941,\ 0.0588)$$

standard deviation 只有 0.243；prior 的 mass 落在 posterior 的 $\pm2$ 个 standard deviation 之内的只有 24.7%。一维已经这样，$k$ 维时这个比例按 $k$ 次方缩小。

### 换一个 distribution 来抽 $z$：ELBO

要是能从 posterior 附近抽 $z$ 就好了。引入一个可以 sample、可以算 density 的 $q(z)$，把积分写成对 $q$ 的 expectation：

$$p(x)=\int q(z)\,\frac{p(z)\,p(x\mid z)}{q(z)}\,dz=\mathbb E_{z\sim q}\Big[\frac{p(x,z)}{q(z)}\Big]$$

Log 是 concave 的，Jensen's inequality 给出 $\log\mathbb E[\cdot]\ge\mathbb E[\log\cdot]$：

$$\log p(x)\ \ge\ \mathbb E_{z\sim q}\Big[\log\frac{p(x,z)}{q(z)}\Big]\ =:\ \text{ELBO}(q)$$

这是 evidence lower bound。它是对 $q$ 的 expectation，可以用 $q$ 的 sample 估计。

这个 bound 差多少？不用 Jensen，直接做恒等变形（PS2 的 2.3(b) 要你这样推）。$\log p(x)$ 不依赖 $z$，所以等于它自己对 $q$ 的 expectation：

$$\log p(x)=\mathbb E_q[\log p(x)]$$

Bayes rule 给出 $p(x)=p(x,z)/p(z\mid x)$，对每个 $z$ 都成立：

$$\log p(x)=\mathbb E_q\Big[\log\frac{p(x,z)}{p(z\mid x)}\Big]$$

分子分母同乘 $q(z)$，拆成两个 log：

$$\log p(x)=\mathbb E_q\Big[\log\frac{p(x,z)}{q(z)}\Big]+\mathbb E_q\Big[\log\frac{q(z)}{p(z\mid x)}\Big]=\text{ELBO}(q)+D_{\text{KL}}\big(q(z)\,\|\,p(z\mid x)\big)$$

> $\log p(x)=\text{ELBO}+D_{\text{KL}}(q\,\|\,p(z\mid x))$。Gap 恰好是 $q$ 到真正 posterior 的 KL，$q$ 等于 posterior 时 bound 是紧的。

所以最大化 ELBO 同时做两件事：对 $\theta$ 提高 $\log p_\theta(x)$，对 $q$ 缩小 gap。注意 gap 是 $D_{\text{KL}}(q\,\|\,p(z\mid x))$，是第 1 站的 reverse 方向：posterior 有几个 mode 时，Gaussian 的 $q$ 会缩在其中一个里。

把 $p(x,z)=p(z)\,p(x\mid z)$ 代进 ELBO，得到实际 training 时用的形式：

$$\text{ELBO}(q)=\underbrace{\mathbb E_q[\log p(x\mid z)]}_{\text{reconstruction}}-\underbrace{D_{\text{KL}}\big(q(z)\,\|\,p(z)\big)}_{\text{离 prior 多远}}$$

### 在 toy model 上检验

取 $q=N(\mu,v)$。Toy model 里两项都有 closed form。Reconstruction：$\log p(x\mid z)=-\tfrac12\log(2\pi\cdot0.25)-(x-2z)^2/(2\cdot0.25)$，对 $z\sim q$ 取 expectation 时 $\mathbb E(x-2z)^2=(x-2\mu)^2+4v$。KL 用 Gaussian 的 closed form $\tfrac12(v+\mu^2-1-\log v)$（推导见 [6.S184 的 VAE 一节](../courses/MIT-6.S184.html#arch)）。先把 $v$ 固定在 posterior 的 variance 0.0588，只动 $\mu$：

| $\mu$ | reconstruction | KL | ELBO | gap $=\log p(x)-\text{ELBO}$ |
|---|---|---|---|---|
| 0 | $-8.696$ | 0.946 | $-9.642$ | 7.529 |
| 0.5 | $-2.696$ | 1.071 | $-3.767$ | 1.654 |
| 0.941 | $-0.724$ | 1.389 | $-2.113$ | 0 |
| 1.5 | $-2.696$ | 2.071 | $-4.767$ | 2.654 |

用 KL 的定义核对 gap：两个 variance 相同的 Gaussian 之间，$D_{\text{KL}}=(\mu-0.941)^2/(2\times0.0588)$，$\mu=0.5$ 时是 $0.441^2/0.1176=1.654$，和表里一样。$\mu=0.941$ 时 $q$ 就是 posterior，ELBO 等于 $\log p(x)=-2.113$。

::fig[cs5788-elbo] ELBO 作为 $q$ 的 mean 的 function，永远在 $\log p(x)$ 那条水平线下面，二者之差就是 $q$ 到 posterior 的 KL。

再把 $\mu$ 固定在 0.941，动 $v$：

| $v$ | reconstruction | KL | ELBO |
|---|---|---|---|
| 1 | $-8.253$ | 0.443 | $-8.696$ |
| 0.25 | $-2.253$ | 0.761 | $-3.015$ |
| 0.0588 | $-0.724$ | 1.389 | $-2.113$ |
| 0.01 | $-0.333$ | 2.250 | $-2.584$ |
| 0.0001 | $-0.254$ | 4.548 | $-4.802$ |

Reconstruction 随 $v$ 变小一直上升：$z$ 越确定，decode 出来越准。KL 里有 $-\tfrac12\log v$，$v\to0$ 时趋于无穷。两项拉扯，最优点在哪里？ELBO 里含 $v$ 的部分是 $-4v/(2\cdot0.25)-\tfrac12v+\tfrac12\log v=-8.5v+\tfrac12\log v$，对 $v$ 求 derivative 令其为 0：$-8.5+\dfrac1{2v}=0$，$v=1/17=0.0588$，正是 posterior 的 variance。

### Encoder：每个 $x$ 一个 $q$，由一个 network 给出

最优的 $q$ 依赖于 $x$。CS236 notes 先讲最朴素的做法（black-box variational inference）：对 mini-batch 里每个 $x$ 单独跑几步 gradient ascent 找它的 $q$，再更新 $\theta$。每个 data point 都要一次内层优化，太贵。改进是 amortization：train 一个 network（encoder）直接输出 $q_\phi(z\mid x)=N\big(\mu_\phi(x),\mathrm{diag}\,\sigma^2_\phi(x)\big)$，$\phi$ 和 $\theta$ 一起对 ELBO 做 gradient ascent。Encoder 加 decoder 就是 variational autoencoder。

Decoder 是 $N(\mu_\theta(z),\sigma^2I)$ 时，$-\log p_\theta(x\mid z)=\|x-\mu_\theta(z)\|^2/(2\sigma^2)+\text{const}$，reconstruction 就是 MSE。Lec 20 的复习页把 VAE 的 loss 写成两项：$\|x-\hat x\|^2$ 加上把 latent 拉向 $N(0,I)$ 的 KL。Sampling 时 encoder 不用了：$z\sim N(0,I)$，decode。

### Reparameterization：让 gradient 穿过 sampling

对 $\theta$ 求 ELBO 的 gradient 没有困难，$\theta$ 只出现在 expectation 里面。对 $\phi$ 就麻烦了：expectation 本身是对 $q_\phi$ 取的，$\phi$ 变了，抽出来的 $z$ 的 distribution 也变了。

一个办法是 score-function estimator（也叫 REINFORCE）：

$$\nabla_\phi\,\mathbb E_{z\sim q_\phi}[f(z)]=\int f(z)\,\nabla_\phi q_\phi(z)\,dz=\int f(z)\,q_\phi(z)\,\nabla_\phi\log q_\phi(z)\,dz=\mathbb E_{q_\phi}\big[f(z)\,\nabla_\phi\log q_\phi(z)\big]$$

第二个等号用了 $\nabla q=q\,\nabla\log q$。另一个办法是 reparameterization：把随机性移到一个和 $\phi$ 无关的 noise 上，$z=\mu_\phi+\sigma_\phi\varepsilon$，$\varepsilon\sim N(0,I)$。于是 $\mathbb E_{q_\phi}[f(z)]=\mathbb E_\varepsilon[f(\mu_\phi+\sigma_\phi\varepsilon)]$，gradient 可以直接移进 expectation：$\mathbb E_\varepsilon[\nabla_\phi f(\mu_\phi+\sigma_\phi\varepsilon)]$。

两者都是 unbiased 的，差在 variance。取 $f(z)=z^2$，$q=N(\mu,1)$，在 $\mu=1$ 求 $\nabla_\mu\mathbb E[z^2]$，真值是 $2\mu=2$。

- Reparameterization：$z=1+\varepsilon$，单个 sample 的估计是 $2z=2+2\varepsilon$，variance 是 4。
- Score function：$\nabla_\mu\log N(z;\mu,1)=z-\mu=\varepsilon$，单个 sample 的估计是 $(1+\varepsilon)^2\varepsilon$。它的二阶矩是 $\mathbb E[(1+\varepsilon)^4\varepsilon^2]=\mathbb E[\varepsilon^2+4\varepsilon^3+6\varepsilon^4+4\varepsilon^5+\varepsilon^6]=1+0+18+0+15=34$，variance 是 $34-4=30$。

同样的 sample 数，score function 的 variance 是 7.5 倍。Reparameterization 利用了 $f$ 的 derivative，score function 只用 $f$ 的值；代价是 $f$ 要对 $z$ 可导、$z$ 要连续。第 7 站的 token 是离散的，PS4 推 REINFORCE 用的就是 score function。

### Latent space 插值

PS2 的 VAE 部分要你在 MNIST 的 latent space 里操作图像。为什么 latent 里的直线有意义？看一个 decoder 已经学好的理想情形：data 是 $10\times10$ 的图像，每张是一根过中心的 bar，角度不同；latent 是二维的，角度 $\vartheta$ 的 bar 编码在 $(\cos2\vartheta,\sin2\vartheta)$。

::fig[cs5788-interp] 左边 latent 的点从 15° 的 bar 的 code 沿直线走到 75° 的 code，中间的图是 decoder 的输出；右边的图是在 pixel 上直接做同样比例的平均。

Pixel 空间里两张合格图像的中点，是两根半透明的 bar 叠成的 X，不在 data 里。Latent 空间里的中点是 $(0,0.342)$，decode 成一根 45° 的 bar。Latent 把“哪些图像是合格的”这件事拉直了。

这依赖 latent 的整体形状是规整的。一个普通 autoencoder 只要求 decode 回自己，不同 $x$ 的 code 之间可能有大片空地，空地里的 $z$ 从没被 decoder 见过。VAE 的 KL 项让每个 $q_\phi(z\mid x)$ 都有一定宽度、都靠近 $N(0,I)$，code 之间互相重叠、铺满 prior 的主要区域，所以 prior 抽出来的 $z$ 和插值路径上的 $z$ 都是 decoder 训练过的。上图的 decoder 是假设出来的，没有经过 training；它说明的是“规整的 latent 长什么样”，不是 VAE 一定能学到这样的 latent。

:::wrong VAE 的 sample 模糊，是 decoder 的 network 不够大
Decoder 是 $N(\mu_\theta(z),\sigma^2I)$ 时，对同一个 $z$，reconstruction 项最好的 $\mu_\theta(z)$ 是 $\mathbb E[x\mid z]$（squared error 下最好的 predictor 是 conditional mean，见 [ST2131](../courses/ST2131.html#hier)）。KL 项不让 encoder 把不同的 $x$ 分得太开，所以总有一些 $z$ 同时可能来自几张不同的图。比如某个 $z$ 一半时候来自 15° 的 bar、一半来自 75° 的 bar，最好的输出就是上图右边那个 X 的灰度版，每根 bar 只有一半亮度，比任何一张真图都模糊。Network 再大也一样，因为这是 loss 的最优解。改进要动 loss 本身（换成 perceptual 或 adversarial loss），或者让 decoder 不必输出 mean（第 6 站的 diffusion decoder 正是这样）。
:::

:::from
Lec 5 的 slides 没有抓到（两次 client error），这一站的顺序跟的是 [Stanford CS236 的 VAE notes](https://deepgenerativemodels.github.io/notes/vae/)：intractable marginal、Monte Carlo 的 high variance、引入 $q$、ELBO 与 gap 等于 $D_{\text{KL}}(q\|p(z\mid x))$、black-box VI、score function 与 reparameterization、amortization（工具返回的版本缺了 formula，formula 是我按标准形式写的）。两项形式的 loss、“sampling 时丢掉 encoder”来自 [Lec 20 复习页](https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec20-midterm-review.pdf)；Lec 6 开头也复述了 ELBO 的两项。“不用 Jensen 推 ELBO”是 PS2 2.3(b) 的题目设置。Linear Gaussian 的 toy model、Monte Carlo 的 variance、两张数表、$v=1/17$、$z^2$ 的 variance 对比、插值图的理想 decoder 是为这一页构造和计算的。
:::

## [flow] Normalizing flow 与 coupling layer

:::skip
快速路线可以只看前两个小节。能用 change of variables 算一个 1D 例子，能写出 affine coupling layer 的 inverse 和 $\log|\det|=\sum s_i$，就可以去下一站。PS3 的 RealNVP 依赖这一站全部内容。
:::

### 去掉 encoder

VAE 的三个毛病（Lec 6 开头列出）：$\log p(x)$ 只有 lower bound；所有变化都得挤过一个低维的 $z$；要单独训练一个 encoder。Lec 6 问：能不能不要 encoder？

如果 decoder 是 deterministic 而且 invertible 的，$x=g(z)$，那么给定 $x$，$z=f(x)=g^{-1}(x)$ 是唯一确定的，posterior 是一个点，不需要去近似它。剩下的问题是：$z\sim p_Z$ 已知时，$x=g(z)$ 的 density 是什么。

### Change of variables

先看 1D，Lec 6 的例子：$Z\sim U(0,1)$，$X=\sqrt Z$。直接算 CDF：对 $0<x<1$，$P(X\le x)=P(\sqrt Z\le x)=P(Z\le x^2)=x^2$，求 derivative 得 $p_X(x)=2x$。

一般地，设 $g$ increasing，$f=g^{-1}$：$P(X\le x)=P(Z\le f(x))=F_Z(f(x))$，求 derivative 得 $p_X(x)=p_Z(f(x))\,f'(x)$。$g$ decreasing 时多一个负号，合起来

$$p_X(x)=p_Z\big(f(x)\big)\,\big|f'(x)\big|$$

用在上面：$f(x)=x^2$，$f'(x)=2x$，$p_Z=1$，得 $2x$，和 CDF 的结果一样。$|f'|$ 是长度的比例：$x$ 附近长 $dx$ 的一段，对应 $z$ 附近长 $|f'(x)|\,dx$ 的一段，两段上的 probability 相同。

Lec 20 的练习题：$X=10Z+5$，$p_Z(z)=2z$ 在 $(0,1)$ 上。$f(x)=(x-5)/10$，$f'=1/10$，所以 $p_X(x)=2\cdot\dfrac{x-5}{10}\cdot\dfrac1{10}=\dfrac{x-5}{50}$，$x\in(5,15)$。核对：$\int_5^{15}\frac{x-5}{50}dx=\frac{10^2}{100}=1$。

高维时，$|f'|$ 换成 Jacobian 的 determinant 的绝对值，它是体积的比例：

$$p_X(x)=p_Z\big(f(x)\big)\,\big|\det Df(x)\big|$$

多个 invertible map 串起来，$g=g_N\circ\cdots\circ g_1$，inverse 是 $f=f_1\circ\cdots\circ f_N$，chain rule 让 Jacobian 相乘、$\log|\det|$ 相加：

$$\log p_X(x)=\log p_Z\big(f(x)\big)+\sum_{i=1}^N\log\big|\det Df_i\big|$$

这是 exact 的 log-likelihood，可以直接做 MLE。Change of variables 的严格陈述见 [ST2131 的 transformation 一站](../courses/ST2131.html#transform)。

### 代价：det 要便宜

一个 $d\times d$ 的一般 matrix 求 determinant 要 $O(d^3)$。$3\times64\times64$ 的图像，$d=12{,}288$，$d^3=1.86\times10^{12}$，每个 sample、每一层都要算一次。所以 flow 的每一层必须同时满足三件事（Lec 6 的“what's the catch”）：invertible；$\log|\det|$ 便宜；input 和 output 维数相同。

Lec 6 逐个检查了几种 building block。Elementwise 的 nonlinearity $y_i=h(x_i)$：Jacobian 是 diagonal，$\det=\prod h'(x_i)$，$O(d)$，但各个 coordinate 互不影响。一般的 linear layer $Ax+b$：能混合 coordinate，但 $\det A$ 要 $O(d^3)$。Triangular matrix：$\det$ 是对角线之积，$O(d)$，但表达能力有限。Permutation：$|\det|=1$。要既能混合 coordinate、又让 $\det$ 只看对角线，就需要下面的结构。

### Coupling layer

把 $x$ 分成两半 $x_A$、$x_B$。$x_A$ 原样通过；$x_B$ 做一个 elementwise 的 affine 变换，scale 和 shift 由一个以 $x_A$ 为 input 的任意 network 给出（RealNVP）：

$$y_A=x_A,\qquad y_B=x_B\odot e^{s(x_A)}+t(x_A)$$

::fig[cs5788-coupling] Affine coupling layer。Network $s,t$ 只看 $x_A$，所以 $y_B$ 对 $x_B$ 的 derivative 是 diagonal，$y_A$ 对 $x_B$ 的 derivative 是 0。

Jacobian 按 $(A,B)$ 分块：$\partial y_A/\partial x_A=I$，$\partial y_A/\partial x_B=0$，$\partial y_B/\partial x_B=\mathrm{diag}(e^{s(x_A)})$，$\partial y_B/\partial x_A$ 很复杂，但它在 block lower triangular matrix 的左下角，不进 determinant：

$$\det\frac{\partial y}{\partial x}=\prod_ie^{s_i(x_A)},\qquad\log\Big|\det\frac{\partial y}{\partial x}\Big|=\sum_is_i(x_A)$$

Inverse 也便宜：从 $y_A=x_A$ 拿回 $x_A$，算出 $s,t$，再解 $x_B=(y_B-t(x_A))\odot e^{-s(x_A)}$。$s,t$ 本身不需要 invertible，可以是任意 MLP 或 CNN。$s\equiv0$ 时就是 NICE 的 additive coupling，$\det=1$，体积不变。

走一个数值例子。把这一层当作 normalizing 方向的 $f$（$x\to z$），二维，$s(x_1)=0.5x_1$，$t(x_1)=x_1^2$，$x=(1,0.5)$：

$$z_1=1,\qquad z_2=0.5\cdot e^{0.5}+1^2=0.8244+1=1.8244,\qquad\log|\det|=0.5$$

反过来：$s=0.5$、$t=1$ 由 $z_1=1$ 算出，$x_2=(1.8244-1)e^{-0.5}=0.5$。Exact log-likelihood（$p_Z=N(0,I)$）：

$$\log p_X(x)=\underbrace{-\log2\pi-\tfrac12(1^2+1.8244^2)}_{\log p_Z(z)=-4.002}+0.5=-3.502$$

### 叠起来

一层 coupling 之后 $x_A$ 没动过，所以下一层要换边：让 $B$ 不动、变 $A$（或者中间插一个 permutation，它的 $|\det|=1$）。两层之后每个 coordinate 都被变过，而且依赖于另一半。

::fig[cs5788-flow] 两层 coupling 把二维 $N(0,I)$ 变成两个 blob（generative 方向 $g$）。第一层的 shift $2.2\tanh(4x_2)$ 把上半平面推到右边、下半平面推到左边；第二层的 shift $-0.6\tanh(2x_1)$ 把两块各自挪回中线。

图里两层的 scale 都是常数，$s=-0.9$ 和 $s=-0.3$，所以每个格子的面积都乘 $e^{-1.2}=0.301$。$\tanh$ 那一项让格子变形得很厉害，但它只是沿一个方向的剪切，Jacobian 的对角线不变，面积不变。按 change of variables，$x$ 处的 density 是 $p_Z(z)$ 除以面积比例：$p_X(x)=p_Z(z)\cdot e^{1.2}=3.32\,p_Z(z)$，格子缩小了，同样的 probability 挤在更小的面积里。

两个 blob 之间总连着一条细带。Flow 是连续的 invertible map，不能把平面撕开；带子来自 $|z_2|$ 很小的那一条 $z$，$|z_2|<0.1$ 的 probability 是 8%，第一层的 $\tanh$ 再陡也只是把这条带拉得更长更细。要表示真正分开的两个 mode，flow 只能把这条带变得极细，这需要极陡的变换，是 invertible 这个约束带来的代价（这一段是我加的，Lec 6 没有讲）。

Lec 6 讲的图像架构在此基础上加了两件事：用 checkerboard 或 channel 的 binary mask $b$ 来定义 $A$、$B$，写成 $y=b\odot x+(1-b)\odot\big(x\odot e^{s(b\odot x)}+t(b\odot x)\big)$，$s,t$ 用 CNN；multi-scale，每过一个 stage 把一半维数“factor out”直接当作 latent，后面的层只处理剩下的一半。

### Autoregressive flow：MAF 与 IAF

:::skip
这一小节把 flow 和第 7 站连起来；跳过的话，PS3 不受影响。
:::

Coupling layer 让一半 coordinate 依赖另一半。推到极端：每个 coordinate 依赖前面所有的。CS236 notes 把一个 Gaussian autoregressive model 读成 flow：

$$x_i=\mu_i(x_{<i})+e^{\alpha_i(x_{<i})}\,z_i,\qquad z_i\sim N(0,1)$$

Jacobian $\partial x/\partial z$ 是 lower triangular（$x_i$ 不依赖 $z_{>i}$），$\det=\prod_ie^{\alpha_i}$。这叫 masked autoregressive flow（MAF）。算 density 时 $x$ 全部已知，$z_i=(x_i-\mu_i(x_{<i}))e^{-\alpha_i(x_{<i})}$ 对所有 $i$ 可以一次并行算完；sampling 时要先有 $x_1$ 才能算 $\mu_2$，$d$ 个 coordinate 只能一个一个来。

把条件换到 $z$ 上就反过来：$x_i=\mu_i(z_{<i})+e^{\alpha_i(z_{<i})}z_i$，叫 inverse autoregressive flow（IAF）。Sampling 时 $z$ 全部已知，一次并行；算一个外来的 $x$ 的 density 时要逐个解出 $z_i$，变慢。CS236 notes 提到的 Parallel WaveNet 正是利用这个取舍：用 MAF 当 teacher 算 likelihood，IAF 当 student 快速生成。

:::wrong 只要 $f$ 可逆，$p_X(x)=p_Z(f(x))$ 就行，det 只是修正项
$Z\sim U(0,1)$，$X=2Z$。去掉 det 会得到 $p_X(x)=p_Z(x/2)=1$ 在 $(0,2)$ 上，积分是 2，不是 probability density。加上 $|f'(x)|=\tfrac12$ 才是 $\tfrac12$。Det 记录的是体积被拉伸或压缩了多少，同样的 probability 摊在两倍长的区间上，density 必须减半。在 training 里漏掉 $\log|\det|$ 更糟：MLE 会把所有 $x$ 都压到 $z=0$ 附近（那里 $p_Z$ 最大），一个把一切缩成一点的 map 得到最高的“likelihood”。
:::

:::edge Latent 维数必须和 data 相同
VAE 的 $z$ 可以比 $x$ 小得多，flow 不行：$g:\mathbb R^1\to\mathbb R^2$ 的像是一条曲线，面积为 0，在 $\mathbb R^2$ 上没有 density。这正是 Lec 6 最后和 VAE 的对比：flow 换来 exact likelihood，付出的是“architecture 受限、不能降维”。
:::

:::edge 离散的 pixel 与 dequantization
图像的 pixel 是 0 到 255 的整数。在离散的点上 fit 一个连续 density，可以把 density 在这些点上堆得任意高，likelihood 没有上界（和第 1 站 $K=6$ 的 variance 塌缩是同一回事）。RealNVP 一类工作的做法是给每个 pixel 加上 $[0,1)$ 里的 uniform noise 再 fit。这一段是我凭自己的知识写的，Lec 6 的 slides 里没有，PS3 的 notebook 是否这样处理没有核对。
:::

:::from
“去掉 encoder”的引入、VAE 的三个毛病、Generative 与 normalizing 两个方向、$X=\sqrt Z$ 的例子、composition 与 $\log\det$ 相加、三条约束、各个 building block 的 det 代价、coupling layer 的分块 Jacobian 与 inverse、NICE 与 RealNVP 的变换、mask 写法、multi-scale 来自 [Lec 6](https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec6-normalizing.pdf)。$10Z+5$ 的练习题来自 [Lec 20](https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec20-midterm-review.pdf)（答案是我算的）。MAF、IAF 与 Parallel WaveNet 来自 [CS236 flow notes](https://deepgenerativemodels.github.io/notes/flow/)（formula 缺失，按标准形式补写）。数值例子、两层 coupling 的动图和面积的计算、$d^3$ 的数是为这一页算的。
:::

## [gan] GAN：minimax、optimal discriminator 与训练动态

:::skip
快速路线可以跳过（调研条目的建议；PS2 的 CycleGAN 要 6 到 8 个 T4 小时）。不跳的话，能推出 optimal discriminator、说出 non-saturating loss 为什么必要，并看懂动图里参数为什么绕圈，就可以去第 5 站。
:::

### Likelihood 和 sample quality 可以分家

前三站都在最大化 likelihood 或它的 bound。CS236 notes 指出，likelihood 高和 sample 好不是一回事。

一个例子：拿一个好的 model $p$，造一个新的 model $q=0.01\,p+0.99\,\text{noise}$。$q$ 的 sample 有 99% 是 noise。它的 log-likelihood 至少是 $\log(0.01\,p(x))=\log p(x)-4.61$，每张图只差 4.61 nats。对 $32\times32\times3=3072$ 维的图像，这是 $4.61/(3072\ln2)=0.0022$ bits/dim，在 likelihood 上几乎看不出来。反过来，一个只会原样吐出 training image 的 model sample 质量完美，test likelihood 却极差（第 1 站 $K=6$ 那个例子）。

所以换一个思路：不写 density，只比较 sample。给两组 sample，判断它们是否来自同一个 distribution，这在统计里叫 two-sample test。高维时现成的 test statistic 不好用，那就 train 一个 classifier 来分辨：分得开，说明两个 distribution 不同；分不开，说明 generator 学好了。

### Minimax objective

Generator $G$ 把 noise $z\sim p(z)$ 变成 sample $G(z)$，它 induce 的 distribution 记为 $p_g$。Discriminator $D(x)\in(0,1)$ 输出“$x$ 是真的”的 probability。Objective 是 $D$ 的 binary cross-entropy 取负：

$$V(G,D)=\mathbb E_{x\sim p_{\text{data}}}[\log D(x)]+\mathbb E_{z}[\log(1-D(G(z)))]$$

$D$ 最大化 $V$（把真的判成 1、假的判成 0），$G$ 最小化 $V$（让 $D$ 判错）：$\min_G\max_DV(G,D)$。

### Optimal discriminator

固定 $G$。把第二个 expectation 写成对 $p_g$ 的积分，$V=\int\big[p_{\text{data}}(x)\log D(x)+p_g(x)\log(1-D(x))\big]dx$。$D$ 在每个 $x$ 上的值可以独立地选，所以对每个 $x$ 单独最大化被积函数。记 $a=p_{\text{data}}(x)$、$b=p_g(x)$、$y=D(x)$，最大化 $a\log y+b\log(1-y)$：derivative 是 $a/y-b/(1-y)$，令它为 0，$a(1-y)=by$，

$$D^*(x)=\frac{p_{\text{data}}(x)}{p_{\text{data}}(x)+p_g(x)}$$

（Lec 20 的复习页。）拿 $p_g=N(0,4.25)$ 检验：$D^*(0)=0.0014$，几乎确定 0 处的 sample 是假的；$D^*(2)=0.767$；$D^*(1)=0.239$。$D^*$ 正好指出了第 1 站那个 Gaussian 错在哪里。

### Generator 在最小化什么

把 $D^*$ 代回去：

$$V(G,D^*)=\mathbb E_{p_{\text{data}}}\Big[\log\frac{p_{\text{data}}}{p_{\text{data}}+p_g}\Big]+\mathbb E_{p_g}\Big[\log\frac{p_g}{p_{\text{data}}+p_g}\Big]$$

记 $m=\tfrac12(p_{\text{data}}+p_g)$。分母写成 $2m$，每个 log 拆出一个 $-\log2$：

$$V(G,D^*)=\mathbb E_{p_{\text{data}}}\Big[\log\frac{p_{\text{data}}}{m}\Big]+\mathbb E_{p_g}\Big[\log\frac{p_g}{m}\Big]-2\log2=D_{\text{KL}}(p_{\text{data}}\|m)+D_{\text{KL}}(p_g\|m)-\log4$$

前两项之和是 Jensen–Shannon divergence 的两倍：$V(G,D^*)=-\log4+2\,\mathrm{JSD}(p_{\text{data}}\|p_g)$。JSD $\ge0$，等号当且仅当 $p_g=p_{\text{data}}$，所以 generator 的 global optimum 是 $p_g=p_{\text{data}}$，此时 $D^*\equiv\tfrac12$，$V=-\log4=-1.386$。

数值积分：$p_g=N(0,4.25)$ 时 JSD 是 0.201，$V=-0.984$；$p_g=N(2,0.25)$（只生成一个 bump）时 JSD 是 0.216，$V=-0.955$。两种错法的 JSD 几乎一样大，而第 1 站的 forward KL 是 0.72 对 15.3。JSD 是两个方向 KL 的折中，对“漏掉一个 mode”的惩罚远比 MLE 轻，这是 GAN 容易只生成一部分 mode 的一个原因。

### Non-saturating loss

Training 初期 generator 很差，$D$ 一眼就能分辨，$D(G(z))\approx0$。设 $D=\sigma(a)$，$a$ 是 logit，generator 通过 $a$ 拿 gradient。Minimax 里 generator 的 loss 是 $\log(1-\sigma(a))$，对 $a$ 的 derivative 是 $-\sigma(a)$。$D(G(z))=0.01$ 时 $a=-4.60$，derivative 只有 $-0.01$：generator 越差，gradient 越小。

改成最小化 $-\log D(G(z))=-\log\sigma(a)$，derivative 是 $-(1-\sigma(a))=-0.99$。两个 loss 的 optimum 方向一样（都让 $D(G(z))$ 变大），但 non-saturating 版本在 generator 差的时候 gradient 大。实践中 generator 用的是这个。

### 训练动态：绕着 equilibrium 转

Optimal discriminator 的分析假设每一步 $D$ 都 train 到最优。实际上 $D$ 和 $G$ 各走一小步 gradient，交替或同时进行。看最小的例子（Dirac GAN）：data 是 $x=0$ 处的一个点，generator 是 $x=\theta$ 处的一个点，discriminator 是 $D(x)=\sigma(\psi x)$。真 data 那一项 $\log\sigma(0)$ 是常数，

$$V(\theta,\psi)=\log\sigma(-\psi\theta)+\text{const}$$

Equilibrium 是 $\theta=0$、$\psi=0$：generator 就在 data 上，discriminator 什么也分不出。求 gradient：$\partial V/\partial\psi=-\theta\,\sigma(\psi\theta)$，$\partial V/\partial\theta=-\psi\,\sigma(\psi\theta)$。$D$ 做 ascent，$G$ 做 descent，step size $h$：

$$\psi\leftarrow\psi-h\,\theta\,\sigma(\psi\theta),\qquad\theta\leftarrow\theta+h\,\psi\,\sigma(\psi\theta)$$

从 $\theta=1$、$\psi=0$ 出发：$D$ 发现 $\theta>0$ 处是假的，$\psi$ 变负；$\psi<0$ 推着 $\theta$ 往 0 走；$\theta$ 到 0 时 $\psi$ 仍是负的，于是 $\theta$ 冲过 0 继续往负方向走；这时 $D$ 才开始把 $\psi$ 往回拉。

::fig[cs5788-gan] Dirac GAN，$h=0.1$，同时更新。左边是 data、generator 和 discriminator 本身，右边是参数平面上同一条轨迹。

在 equilibrium 附近 $\sigma(\psi\theta)\approx\tfrac12$，更新变成 $\psi\leftarrow\psi-\tfrac h2\theta$，$\theta\leftarrow\theta+\tfrac h2\psi$，这是一个 rotation 再乘上 $\sqrt{1+h^2/4}$：

$$\begin{pmatrix}\theta\\\psi\end{pmatrix}\leftarrow\begin{pmatrix}1&h/2\\-h/2&1\end{pmatrix}\begin{pmatrix}\theta\\\psi\end{pmatrix},\qquad\theta^2+\psi^2\ \leftarrow\ (1+h^2/4)(\theta^2+\psi^2)$$

所以每一步离 equilibrium 的距离都乘 $\sqrt{1.0025}=1.00125$，永远不会收敛。连续时间的 gradient flow 是纯 rotation，一圈的时间是 $2\pi/(1/2)=4\pi$，$h=0.1$ 时约 126 步；simulation 里 $\theta$ 每 66 到 74 步过一次 0（越往外越慢），约是半圈。实际跑 1000 步，距离从 1 变成 2.41（离开 0 附近以后 $\sigma$ 不再是 $\tfrac12$，增长比线性近似给的 $1.0025^{500}=3.49$ 慢）。先更新 $\psi$ 再用新的 $\psi$ 更新 $\theta$（alternating）时，2000 步后距离是 1.016：不再发散，但一直绕圈，同样不收敛。CS236 notes 说的“generator 和 discriminator 的 loss 来回 oscillate，没有可靠的 stopping criterion”，在这个两参数的例子里就能看到。

### Mode collapse

Discriminator 固定时，generator 的 loss 是 $\mathbb E_z[-\log D(G(z))]$，每个 $z$ 各算各的。对每个 $z$ 最好的输出都是同一个点：$D$ 最大的地方。这个 loss 对 sample 的多样性没有任何奖励。

用两个 bump 的 data 走一遍。设某个时刻 $D(-2)=0.6$、$D(2)=0.7$。Generator 走几步之后，所有 $z$ 都往 $+2$ 挤。接着 $D$ 更新：$+2$ 处 $p_g$ 很大，$D^*(2)=p_{\text{data}}/(p_{\text{data}}+p_g)$ 变小；$-2$ 处 $p_g\approx0$，$D^*(-2)\approx1$。于是 generator 又整体搬到 $-2$。两个 mode 之间来回跳，任何时刻都只生成一个 mode。这和上面 Dirac GAN 的绕圈是同一个机制：每一方都只对另一方当前的位置做出反应。

### Conditional GAN 与 CycleGAN

:::skip
对应 Lec 8 和 PS2 的 2.2；不做 CycleGAN 可以跳过。
:::

Image-to-image translation 要的是 $p(y\mid x)$：给一张苹果的照片，生成“同一个”苹果变成橙子的样子。有成对的 $(x,y)$ 时（pix2pix），让 discriminator 看 $(x,G(x))$ 这一对，判断它是不是真的一对；Lec 20 的练习题问 discriminator 要不要看 input，答案就是要，否则 $G$ 可以输出任意一张好看的橙子。

PS2 的 apple2orange 没有成对的 data。只用 GAN loss 让 $G(x)$ 的 distribution 像橙子，并不能确定哪个苹果对应哪个橙子：任何把苹果的 distribution 送到橙子的 distribution 的 map 都让 loss 一样低，包括把每个苹果都变成同一种橙子。CycleGAN 加一个反方向的 generator $F$（橙子到苹果），要求转过去再转回来要回到原图：

$$\mathcal L=\mathcal L_{\text{GAN}}(G)+\mathcal L_{\text{GAN}}(F)+\lambda\big(\mathbb E\|F(G(x))-x\|_1+\mathbb E\|G(F(y))-y\|_1\big)$$

Cycle 项逼着 $G(x)$ 保留足够的 $x$ 的信息，才能被 $F$ 还原。CS236 notes 给出了两个 generator、两个 discriminator 加 cycle consistency 的结构；原论文取 $\lambda=10$ 是我记得的，PS2 notebook 里用多少没有核对。

:::wrong Discriminator 的 loss 降到接近 0，说明 training 进展顺利
Discriminator 完美分开真假时，$D(G(z))\approx0$。用 minimax 的 generator loss，gradient 正比于 $\sigma(a)\approx D(G(z))$，上面算过 $D=0.01$ 时只剩 0.01，generator 几乎学不到东西。即使用 non-saturating loss，$D$ 过强也意味着它在 $p_g$ 和 $p_{\text{data}}$ 之间画出了一条很陡的边界，gradient 只在边界附近有信息。GAN 里两个 loss 都不是“越低越好”的量：Dirac GAN 里 equilibrium 处 $D\equiv\tfrac12$，discriminator 的 cross-entropy 是 $\log4$，并不小。
:::

:::from
Lec 7、8 的 slides 没有抓到（client error）。Likelihood-free 的动机（likelihood 与 sample quality 分家、memorization 的极端情形）、two-sample test 的思路、minimax、JSD 的结论、交替更新的 algorithm、oscillation 与 mode collapse、CycleGAN 的结构来自 [CS236 GAN notes](https://deepgenerativemodels.github.io/notes/gan/)（formula 缺失，按标准形式补写）。Minimax objective、$a\log y+b\log(1-y)$ 的 optimal discriminator、pix2pix 的 discriminator 要看 input 来自 [Lec 20](https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec20-midterm-review.pdf)。$0.01p+0.99\,\text{noise}$ 的例子是 CS236 notes 那个论点的具体化，bits/dim 是我算的。Non-saturating loss、Dirac GAN（出自 Mescheder 等人 2018 年的论文，我没有读原文，凭自己的知识写的）、它的线性化、两种更新方式的 simulation、mode collapse 的两步例子、$\lambda=10$ 都没有来源核对；JSD 和 $D^*$ 的数值是为这一页算的。
:::

## [ebm] Energy-based model、Langevin dynamics 与 score matching

:::skip
快速路线可以只看前两个小节和“Score matching”。能说出 EBM 里 $Z$ 为什么算不出、score 为什么算得出，写出 Langevin 的一步和 denoising score matching 的 target，就可以去第 6 站。
:::

### 不要求 network 积分为 1

回到开头的第二次失败。Lec 9 的做法是干脆不要求：让 network 输出一个任意的实数 $E_\theta(x)$（energy），定义

$$p_\theta(x)=\frac{e^{-E_\theta(x)}}{Z(\theta)},\qquad Z(\theta)=\int e^{-E_\theta(x)}\,dx$$

Energy 低的地方 probability 高。$e^{-E}>0$ 自动成立，normalization 全部交给 $Z(\theta)$，它叫 partition function。

一维的例子：$E(x)=(x^2-4)^2/8$，两个 minimum 在 $\pm2$，$E(\pm2)=0$，$E(0)=2$。一维可以数值积分，$Z=2.822$。但 256 维时，每维 100 个点的 grid 就是 $10^{512}$ 次 network evaluation。

哪些量不需要 $Z$？Lec 9 列了三个：

- Energy 本身：一次 forward pass。
- 两点的 density 之比：$p(x_1)/p(x_2)=e^{E(x_2)-E(x_1)}$，$Z$ 约掉了。上例中 $p(2)/p(0)=e^{2-0}=7.39$。
- Score：$\nabla_x\log p_\theta(x)=-\nabla_xE_\theta(x)-\nabla_x\log Z(\theta)=-\nabla_xE_\theta(x)$，因为 $Z$ 不依赖 $x$。上例中 $E'(x)=x(x^2-4)/2$，在 $x=1$ 处 score 是 $-E'(1)=1.5$，指向右边的 minimum。

### MLE 的 gradient

$\log p_\theta(x)=-E_\theta(x)-\log Z(\theta)$。第一项的 gradient 是一次 backprop。第二项：

$$\nabla_\theta\log Z=\frac{1}{Z}\nabla_\theta\int e^{-E_\theta(x)}dx=\frac1Z\int e^{-E_\theta(x)}\big(-\nabla_\theta E_\theta(x)\big)dx=\int p_\theta(x)\big(-\nabla_\theta E_\theta(x)\big)dx$$

第一个等号是 $\log$ 的 chain rule，第二个把 gradient 移进积分，第三个认出 $e^{-E}/Z=p_\theta$。所以 $\nabla_\theta\log Z=\mathbb E_{x\sim p_\theta}[-\nabla_\theta E_\theta(x)]$，是一个对 model 自己的 expectation，可以用 model 的 sample 估计：

$$\nabla_\theta\log p_\theta(x)\approx-\nabla_\theta E_\theta(x)+\nabla_\theta E_\theta(\tilde x),\qquad\tilde x\sim p_\theta$$

意思很直接：降低 data 的 energy，抬高 model 自己的 sample 的 energy。两者一致时 gradient 为 0。难处挪到了“从 $p_\theta$ 抽 $\tilde x$”上，而这本身要跑 MCMC。Contrastive divergence（Hinton 2002）的偷懒办法是从一个 training example 出发只跑几步。

:::wrong 不管 $Z$，直接最小化 data 上的 $\sum_iE_\theta(x_i)$
这是 Lec 20 的一道练习题。取 $E_\theta(x)=\theta x^2/2$（$\theta>0$），对应的 $p_\theta=N(0,1/\theta)$，$Z=\sqrt{2\pi/\theta}$。在第 1 站的 6 个点上，$\sum_iE_\theta(x_i)=\theta\cdot25/2$，越小越好就让 $\theta\to0$：variance 趋于无穷，density 处处趋于 0，data 并没有变得更可能。正确的 MLE 带上 $\log Z$：$\log p_\theta(x)=-\theta x^2/2+\tfrac12\log\theta-\tfrac12\log2\pi$，对 $\theta$ 求 derivative 得 $-x^2/2+1/(2\theta)$，平均后令其为 0，$\theta=1/\overline{x^2}=6/25=0.24$，即 variance 4.1667，和第 1 站一致。$-\log Z$ 那一项正是“抬高别处 energy”的那一半。
:::

### Langevin dynamics

有了 score，就能 sample（Lec 9）：

$$x_{k+1}=x_k+\frac{\varepsilon^2}{2}\nabla_x\log p(x_k)+\varepsilon\,z_k,\qquad z_k\sim N(0,I)$$

没有 noise 项就是对 $\log p$ 做 gradient ascent，所有点都会停在 mode 上；加上 noise 才是一个 MCMC，$\varepsilon\to0$、步数 $\to\infty$ 时 stationary distribution 是 $p$（证明见 [6.S184 的 score 一站](../courses/MIT-6.S184.html#score)）。

“步数 $\to\infty$”在实际中是什么意思？把两个 bump 的 weight 改成 0.8 和 0.2：$p=0.8N(-2,0.25)+0.2N(2,0.25)$。在左边 bump 附近，右边那个 component 的贡献小到可以忽略，score 就是 $-(x+2)/0.25$，和 weight 无关。直接算：$x=-2.5$ 处 score 是 2.000，$x=2.5$ 处是 $-2.000$，weight 取 0.5/0.5 时也是这两个数。Score 只知道每个 bump 内部往哪里走，不知道哪个 bump 更大。Weight 的信息只藏在两个 bump 之间那片 density 极低的区域里。

::fig[cs5788-langevin] 用 exact score 跑 Langevin。每条 chain 落进离起点最近的 bump，之后几乎再也出不来，所以终点的比例由起点决定，不由 weight 决定。

4000 条 chain 从 $[-4,4]$ 均匀出发，$\varepsilon=0.1$，2000 步之后右边有 47.4%，应该是 20%。要靠 chain 跨过中间那片空地来纠正比例：0 处的 energy $-\log p$ 是 8.23，左边 mode 处是 0.45，跨过去的概率按 $e^{-7.8}$ 量级衰减。另外跑 20000 步，右边是 42%，还差得远。

### Score matching

:::skip
Hyvärinen 的推导是加深；跳过的话只需要记住最后的 denoising score matching loss。
:::

既然 sampling 只需要 score，干脆直接学一个 network $s_\theta(x)\approx\nabla_x\log p_{\text{data}}(x)$，连 $E_\theta$ 都不要（score-based model）。Loss 是 Fisher divergence：

$$\tfrac12\,\mathbb E_{p_{\text{data}}}\big\|s_\theta(x)-\nabla_x\log p_{\text{data}}(x)\big\|^2$$

问题是 $\nabla\log p_{\text{data}}$ 不知道。Hyvärinen（2005）的办法是 integration by parts。一维展开平方：$\tfrac12\mathbb E[s_\theta^2]-\mathbb E[s_\theta\,s_{\text{data}}]+\tfrac12\mathbb E[s_{\text{data}}^2]$。最后一项与 $\theta$ 无关。中间那项：

$$\mathbb E_p[s_\theta\,s_{\text{data}}]=\int p(x)\,s_\theta(x)\,\frac{p'(x)}{p(x)}\,dx=\int s_\theta(x)\,p'(x)\,dx=\Big[s_\theta p\Big]_{-\infty}^{\infty}-\int s_\theta'(x)\,p(x)\,dx=-\mathbb E_p[s_\theta']$$

（假设 $s_\theta p$ 在无穷远处趋于 0。）所以 loss 等于 $\mathbb E_p\big[\tfrac12s_\theta^2+s_\theta'\big]+\text{const}$，只用 data 的 sample 和 $s_\theta$ 的 derivative。高维时 $s'_\theta$ 换成 trace $\mathrm{tr}(\nabla_xs_\theta)$，要 $d$ 次 backprop，所以实践中用下面的版本。

Denoising score matching：给 data 加 noise，$\tilde x=x+\sigma\varepsilon$，改学 noisy distribution 的 score。给定干净的 $x$，conditional score 有 closed form：$\nabla_{\tilde x}\log q(\tilde x\mid x)=-(\tilde x-x)/\sigma^2$。Loss 是

$$\mathbb E_{x\sim p_{\text{data}},\,\tilde x\sim q(\cdot\mid x)}\Big[\tfrac12\Big\|s_\theta(\tilde x)-\frac{x-\tilde x}{\sigma^2}\Big\|^2\Big]$$

它和对 noisy marginal 的 Fisher divergence 只差一个与 $\theta$ 无关的常数（证明与 flow matching 的 conditional loss 一样，见 [6.S184 的 denoising score matching 一站](../courses/MIT-6.S184.html#dsm)）。Regression 学到的是 target 的 conditional mean，$s^*(\tilde x)=\mathbb E\big[(x-\tilde x)/\sigma^2\,\big|\,\tilde x\big]$。

在 0.8/0.2 的例子上核对，取 $\sigma=0.5$，noisy distribution 是 $0.8N(-2,0.5)+0.2N(2,0.5)$。看 $\tilde x=1$：属于右边 component 的 posterior probability 是 0.9987；在右边 component 内，$x$ 和 $\tilde x$ jointly Gaussian，$\mathbb E[x\mid\tilde x]=2+\tfrac{0.25}{0.5}(1-2)=1.5$；左边 component 给 $-2+\tfrac12(1+2)=-0.5$。加权得 $\mathbb E[x\mid\tilde x=1]=1.4973$，regression 的最优输出是 $(1.4973-1)/0.25=1.989$。直接对 noisy density 求 score：$1.989$。两者相同。这就是 Lec 10 引的 Tweedie's formula：denoiser 输出的 $\mathbb E[x\mid\tilde x]$ 等于 $\tilde x+\sigma^2\nabla\log q(\tilde x)$。

### 一个 noise level 不够

上面的 $\sigma=0.5$ 让两个 bump 各自变宽，但中间仍是空的。Langevin 那张图的问题还在：低 density 的区域里没有 data，score 学不准，chain 也过不去。可是 noise 大到两个 bump 连成一片时，score 就能“看见”两边的相对大小，只是那时的 distribution 离 data 太远。需要的是一串从大到小的 noise level，从大的开始走，逐步换到小的。这就是第 6 站。

:::from
EBM 的定义与 partition function、可算与不可算的量、rejection sampling 与 Langevin、MLE gradient 的推导与“降 data、抬 sample”的解释、contrastive divergence、product of experts、score-based model、Fisher divergence、Hyvärinen 的 integration by parts、denoising score matching 的 target 来自 [Lec 9](https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec9-ebms.pdf)；Tweedie's formula 来自 [Lec 10](https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec10-diffusion.pdf)；$\sum E$ 的练习题来自 [Lec 20](https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec20-midterm-review.pdf)（答案和 $E=\theta x^2/2$ 的反例是我写的）。Lec 9 没有讲 sliced score matching 和 annealed Langevin（NCSN）。Double well 的数、0.8/0.2 的 Langevin simulation、score 与 weight 无关的数值、DSM 的核对是为这一页算的；“一个 noise level 不够”的论证是 Song 与 Ermon 的观点，我凭自己的知识写，没有读原文。
:::

## [diff] Diffusion：forward process、VLB 与 noise prediction

:::skip
快速路线必读（Lec 10、15，PS3 的 written 题）。能推出 $x_t$ 的 closed form、写出 VLB 的三类项、从 KL 推到 $\|\varepsilon-\varepsilon_\theta\|^2$ 并说出 $L_{\text{simple}}$ 丢掉了哪个 weight，就可以去第 7 站。Flow matching 那条线（Lec 16）在 [6.S184](../courses/MIT-6.S184.html#fm)。
:::

### Encoder 固定的 VAE

第 5 站要一串 noise level；第 2 站的 VAE 有一个要和 decoder 一起学、又只能近似 posterior 的 encoder。Lec 15 把两件事合在一起：latent 不是一个 $z$，而是一串 $x_1,\dots,x_T$，每个都是 $x_0$（data）加上更多 noise 的版本；“encoder” $q(x_{1:T}\mid x_0)$ 是手工定义的加 noise 过程，没有 parameter；只学 decoder，而且 decoder 也拆成 $T$ 小步，每步只去掉一点 noise。

Lec 10 的直觉：从 noise 一步走到猫很难，从猫一步步加 noise 走到 noise 很容易。学会每一小步的反方向，就能从 noise 走回来。

### Forward process 与它的 closed form

每一步（Lec 15 的记号，$\alpha_t=1-\beta_t$，$\beta_t$ 是事先选好的 schedule）：

$$q(x_t\mid x_{t-1})=N\big(\sqrt{\alpha_t}\,x_{t-1},\ (1-\alpha_t)I\big),\qquad x_t=\sqrt{\alpha_t}\,x_{t-1}+\sqrt{1-\alpha_t}\,\varepsilon_t$$

为什么是 $\sqrt{\alpha_t}$ 而不是 1？若 $x_{t-1}$ 的 variance 是 1，$x_t$ 的 variance 是 $\alpha_t\cdot1+(1-\alpha_t)=1$（两个 independent 项的 variance 相加，常数乘进去要平方）。不缩放的话 variance 每步加 $\beta_t$，$T=1000$ 步后会越走越大。

连走两步：

$$x_2=\sqrt{\alpha_2}\big(\sqrt{\alpha_1}x_0+\sqrt{1-\alpha_1}\,\varepsilon_1\big)+\sqrt{1-\alpha_2}\,\varepsilon_2=\sqrt{\alpha_1\alpha_2}\,x_0+\sqrt{\alpha_2(1-\alpha_1)}\,\varepsilon_1+\sqrt{1-\alpha_2}\,\varepsilon_2$$

后两项是 independent 的 zero-mean Gaussian，和仍是 Gaussian，variance 相加：$\alpha_2-\alpha_1\alpha_2+1-\alpha_2=1-\alpha_1\alpha_2$。所以 $x_2=\sqrt{\alpha_1\alpha_2}\,x_0+\sqrt{1-\alpha_1\alpha_2}\,\varepsilon$。同样的一步可以一直往下做（归纳：设 $x_{t-1}=\sqrt{\bar\alpha_{t-1}}x_0+\sqrt{1-\bar\alpha_{t-1}}\varepsilon$，代入后 noise 的 variance 是 $\alpha_t(1-\bar\alpha_{t-1})+1-\alpha_t=1-\bar\alpha_t$）。记 $\bar\alpha_t=\prod_{s\le t}\alpha_s$：

$$q(x_t\mid x_0)=N\big(\sqrt{\bar\alpha_t}\,x_0,\ (1-\bar\alpha_t)I\big),\qquad x_t=\sqrt{\bar\alpha_t}\,x_0+\sqrt{1-\bar\alpha_t}\,\varepsilon$$

Training 时随机抽一个 $t$，一步就能得到 $x_t$，不用真的走 $t$ 步。

DDPM 用的 schedule 是 $\beta_t$ 从 $10^{-4}$ 线性增到 $0.02$，$T=1000$（Lec 10 提到 $T=1000$；schedule 的具体数是我按 DDPM 论文写的）。算出来：

| $t$ | 1 | 100 | 250 | 500 | 750 | 1000 |
|---|---|---|---|---|---|---|
| $\bar\alpha_t$ | 0.9999 | 0.897 | 0.524 | 0.0786 | 0.00335 | $4.04\times10^{-5}$ |
| $\sqrt{\bar\alpha_t}$ | 1.000 | 0.947 | 0.724 | 0.280 | 0.058 | 0.0064 |

::fig[cs5788-forward] 0.8/0.2 的 mixture 在 forward process 下的 marginal。每个 component 在 $q(x_t\mid x_0)$ 下仍是 Gaussian，center 缩成 $\pm2\sqrt{\bar\alpha_t}$，variance 变成 $0.25\bar\alpha_t+1-\bar\alpha_t$。

$t=250$ 时两个 bump 已经开始连在一起，$t=500$ 时只剩一个偏左的 bump：0.8 和 0.2 的差别变成了整体形状的不对称，score 在任何地方都感受得到。这就是第 5 站要的“大 noise level”。

### Reverse 方向：给定 $x_0$ 时是 Gaussian

要学的是 $p_\theta(x_{t-1}\mid x_t)$。真正的 $q(x_{t-1}\mid x_t)$ 依赖于整个 data distribution，算不出；但多给一个 $x_0$，$q(x_{t-1}\mid x_t,x_0)$ 就有 closed form，因为给定 $x_0$ 时 $x_{t-1}$ 和 $x_t$ jointly Gaussian：

$$x_{t-1}=\sqrt{\bar\alpha_{t-1}}x_0+\sqrt{1-\bar\alpha_{t-1}}\,\varepsilon,\qquad x_t=\sqrt{\alpha_t}\,x_{t-1}+\sqrt{\beta_t}\,\varepsilon'$$

$\mathrm{Var}(x_{t-1})=1-\bar\alpha_{t-1}$，$\mathrm{Var}(x_t)=1-\bar\alpha_t$，$\mathrm{Cov}(x_{t-1},x_t)=\sqrt{\alpha_t}(1-\bar\alpha_{t-1})$。Jointly Gaussian 的 conditional mean 是 $\mathbb E[x_{t-1}]+\dfrac{\mathrm{Cov}}{\mathrm{Var}(x_t)}(x_t-\mathbb E[x_t])$（见 [ST2131 的 joint distribution 一站](../courses/ST2131.html#joint)）：

$$\tilde\mu_t=\sqrt{\bar\alpha_{t-1}}x_0+\frac{\sqrt{\alpha_t}(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}\big(x_t-\sqrt{\bar\alpha_t}x_0\big)$$

整理 $x_0$ 的 coefficient：$\sqrt{\bar\alpha_{t-1}}\Big[1-\dfrac{\alpha_t(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}\Big]=\sqrt{\bar\alpha_{t-1}}\,\dfrac{1-\bar\alpha_t-\alpha_t+\bar\alpha_t}{1-\bar\alpha_t}=\dfrac{\sqrt{\bar\alpha_{t-1}}\,\beta_t}{1-\bar\alpha_t}$（用了 $\alpha_t\bar\alpha_{t-1}=\bar\alpha_t$）。Conditional variance 是 $\mathrm{Var}(x_{t-1})-\mathrm{Cov}^2/\mathrm{Var}(x_t)$，同样整理：

$$\tilde\mu_t=\frac{\sqrt{\bar\alpha_{t-1}}\,\beta_t}{1-\bar\alpha_t}x_0+\frac{\sqrt{\alpha_t}(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}x_t,\qquad\tilde\beta_t=\frac{1-\bar\alpha_{t-1}}{1-\bar\alpha_t}\beta_t$$

这正是 Lec 15 给的 posterior。数值核对：$t=500$，$x_0=2$，$x_t=0.3$，formula 给 $\tilde\mu=0.3044$、$\tilde\beta=0.01003$；Monte Carlo（400 万对 $(x_{t-1},x_t)$，取 $|x_t-0.3|<0.005$ 的约 16000 个）给 mean 0.3039、variance 0.01005。$t=500$ 时 $x_0$ 的 coefficient 只有 0.0031，$x_t$ 的是 0.994：一小步去 noise，主要还是留在原地。

### VLB 分解

::fig[cs5788-chain] 上排是 forward process，下排是要学的 reverse process，下面是 VLB 拆出来的三类项。

两条 chain 都是 Markov 的，joint density 分解成（PS3 3.3(b)(i)）：

$$q(x_{1:T}\mid x_0)=\prod_{t=1}^Tq(x_t\mid x_{t-1}),\qquad p_\theta(x_{0:T})=p(x_T)\prod_{t=1}^Tp_\theta(x_{t-1}\mid x_t)$$

$p(x_T)=N(0,I)$，没有 $\theta$。把 $z=x_{1:T}$、$q(z\mid x)=q(x_{1:T}\mid x_0)$ 代进第 2 站的 ELBO：

$$\log p_\theta(x_0)\ \ge\ \mathbb E_q\Big[\log\frac{p_\theta(x_{0:T})}{q(x_{1:T}\mid x_0)}\Big]=\mathbb E_q\Big[\log p(x_T)+\sum_{t=1}^T\log\frac{p_\theta(x_{t-1}\mid x_t)}{q(x_t\mid x_{t-1})}\Big]$$

直接用这个形式，每一项分母里的 $q(x_t\mid x_{t-1})$ 是“往前”的，分子是“往回”的，方向对不上。关键一步：由 Markov 性，$q(x_t\mid x_{t-1})=q(x_t\mid x_{t-1},x_0)$；再用 Bayes rule 把 $x_t$ 和 $x_{t-1}$ 的位置换过来：

$$q(x_t\mid x_{t-1},x_0)=\frac{q(x_{t-1}\mid x_t,x_0)\,q(x_t\mid x_0)}{q(x_{t-1}\mid x_0)}$$

对 $t\ge2$ 代进去（$t=1$ 单独留着）。$\sum_{t=2}^T\log\dfrac{q(x_t\mid x_0)}{q(x_{t-1}\mid x_0)}$ 是 telescoping 的，相邻项抵消，只剩 $\log q(x_T\mid x_0)-\log q(x_1\mid x_0)$。$-\log q(x_1\mid x_0)$ 和 $t=1$ 那一项的分母 $q(x_1\mid x_0)$ 抵消。剩下的按变量分组，取负号变成要最小化的 loss：

$$-\text{VLB}=\underbrace{D_{\text{KL}}\big(q(x_T\mid x_0)\,\|\,p(x_T)\big)}_{L_T}+\sum_{t=2}^T\underbrace{D_{\text{KL}}\big(q(x_{t-1}\mid x_t,x_0)\,\|\,p_\theta(x_{t-1}\mid x_t)\big)}_{L_{t-1}}\underbrace{-\log p_\theta(x_0\mid x_1)}_{L_0}$$

（每个 KL 是在对应的 $x_t$ 上再取 expectation。）$L_T$ 没有 $\theta$；$L_0$ 是最后一步的 reconstruction；每个 $L_{t-1}$ 要 model 的一步 reverse 去对齐“知道答案 $x_0$ 时的那一步”，这就是 denoising。

### 从 KL 到 noise prediction

Lec 15 把 model 的 variance 固定（$\sigma_t^2I$，例如 $\sigma_t^2=\beta_t$），只学 mean $\mu_\theta(x_t,t)$。两个 variance 相同的 Gaussian 之间，KL 只剩 mean 之差：

$$L_{t-1}=\mathbb E_q\Big[\frac{1}{2\sigma_t^2}\big\|\tilde\mu_t(x_t,x_0)-\mu_\theta(x_t,t)\big\|^2\Big]+C$$

Target $\tilde\mu_t$ 里有 $x_0$。用 closed form 把它换成 noise：$x_0=(x_t-\sqrt{1-\bar\alpha_t}\,\varepsilon)/\sqrt{\bar\alpha_t}$。代进 $\tilde\mu_t$，$x_0$ 那一项变成 $\dfrac{\sqrt{\bar\alpha_{t-1}}\beta_t}{(1-\bar\alpha_t)\sqrt{\bar\alpha_t}}\big(x_t-\sqrt{1-\bar\alpha_t}\,\varepsilon\big)=\dfrac{\beta_t}{(1-\bar\alpha_t)\sqrt{\alpha_t}}\big(x_t-\sqrt{1-\bar\alpha_t}\,\varepsilon\big)$。$x_t$ 的 coefficient 合起来：

$$\frac{\beta_t}{(1-\bar\alpha_t)\sqrt{\alpha_t}}+\frac{\sqrt{\alpha_t}(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}=\frac{\beta_t+\alpha_t-\bar\alpha_t}{(1-\bar\alpha_t)\sqrt{\alpha_t}}=\frac{1}{\sqrt{\alpha_t}}$$

（分子 $\beta_t+\alpha_t=1$。）所以

$$\tilde\mu_t=\frac1{\sqrt{\alpha_t}}\Big(x_t-\frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\,\varepsilon\Big)$$

$x_t$ 是 network 的 input，已知；未知的只有 $\varepsilon$。于是让 network 直接预测 noise，$\mu_\theta=\frac1{\sqrt{\alpha_t}}\big(x_t-\frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\varepsilon_\theta(x_t,t)\big)$，mean 之差就是 noise 之差乘一个常数：

$$L_{t-1}=\lambda_t\,\mathbb E_{x_0,\varepsilon}\big\|\varepsilon-\varepsilon_\theta\big(\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\,\varepsilon,\,t\big)\big\|^2,\qquad\lambda_t=\frac{\beta_t^2}{2\sigma_t^2\alpha_t(1-\bar\alpha_t)}$$

取 $\sigma_t^2=\beta_t$，$\lambda_t=\beta_t/(2\alpha_t(1-\bar\alpha_t))$：$\lambda_1=0.500$，$\lambda_{10}=0.074$，$\lambda_{100}=0.0101$，$\lambda_{1000}=0.0102$。按 VLB，最前面几步的 weight 是后面的约 50 倍。DDPM 把所有 $\lambda_t$ 换成 1，得到 $L_{\text{simple}}$（Lec 15：经验上图像更好）。它不再是 likelihood 的 bound，而是把 weight 从几乎看不出的小 noise 挪到了决定整体结构的大 noise 上。Training step（Lec 20）：抽 $x_0$、$t\sim\text{Uniform}\{1,\dots,T\}$、$\varepsilon$，算 $x_t$，对 $\|\varepsilon-\varepsilon_\theta(x_t,t)\|^2$ 做一步 gradient。

$\varepsilon_\theta$ 和第 5 站的 score 是同一个东西：$\nabla\log q(x_t\mid x_0)=-(x_t-\sqrt{\bar\alpha_t}x_0)/(1-\bar\alpha_t)=-\varepsilon/\sqrt{1-\bar\alpha_t}$，所以 $\varepsilon_\theta\approx-\sqrt{1-\bar\alpha_t}\,\nabla\log q_t$（Lec 10 的 “denoisers as score functions”）。Score、noise、$x_0$、velocity 四种 parameterization 的完整换算见 [6.S184 的 denoising score matching 一站](../courses/MIT-6.S184.html#dsm)。

### Sampling，以及 0.8/0.2 的答案

从 $x_T\sim N(0,I)$ 开始，对 $t=T,\dots,1$：

$$x_{t-1}=\frac1{\sqrt{\alpha_t}}\Big(x_t-\frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\,\varepsilon_\theta(x_t,t)\Big)+\sigma_t z,\qquad z\sim N(0,I)\ (t>1),\ z=0\ (t=1)$$

在 0.8/0.2 的例子上，每个 $t$ 的 noisy marginal 都是 Gaussian mixture，exact 的 $\varepsilon^*$ 可以直接算出来。用它代替 network，20000 个 sample 走完 1000 步，右边 19.9%，左右两个 bump 的 standard deviation 都回到 0.50。第 5 站同样用 exact score 的 Langevin 得到 47.4%。差别只在于：diffusion 从两个 bump 已经合在一起的大 noise 开始，在那时就按 0.8 比 0.2 分好了。

$T=1000$ 次 network evaluation 是 diffusion 的代价，GAN 和 VAE 只要一次。Lec 15 提到的 DDIM 换了一个 non-Markovian 的 forward process，它的 marginal $q(x_t\mid x_0)$ 和 DDPM 一样，所以同一个训练好的 $\varepsilon_\theta$ 可以直接用；它的 reverse step 是

$$x_{t-1}=\sqrt{\bar\alpha_{t-1}}\,\hat x_0+\sqrt{1-\bar\alpha_{t-1}-\tilde\sigma_t^2}\ \varepsilon_\theta(x_t,t)+\tilde\sigma_tz,\qquad\hat x_0=\frac{x_t-\sqrt{1-\bar\alpha_t}\,\varepsilon_\theta(x_t,t)}{\sqrt{\bar\alpha_t}}$$

先用当前的 noise 估计猜出 $x_0$，再按 $t-1$ 的 noise 比例重新混合。$\tilde\sigma_t=0$ 时整个过程是 deterministic 的，每一步的公式只用到 $\bar\alpha$，所以可以跳着走（例如只取 50 个 $t$）。Distillation 和 latent diffusion 是另外两条提速的路；latent diffusion 的架构见 [6.S184 的架构一站](../courses/MIT-6.S184.html#arch)。

Lec 16 的 flow matching 换一条更直的 path：$x_t=(1-t)x_0+tx_1$（这里 $x_0$ 是 noise、$x_1$ 是 data，Lec 20 的记号），target velocity 是 $x_1-x_0$，loss 是 $\|u_\theta(x_t,t)-(x_1-x_0)\|^2$。它为什么学到的是正确的 marginal vector field，见 [6.S184 的 probability path](../courses/MIT-6.S184.html#path) 和 [flow matching](../courses/MIT-6.S184.html#fm) 两站。

:::wrong 预测 $\varepsilon$ 还是预测 $x_0$，只是 parameterization 不同，loss 一样
由 $x_0=(x_t-\sqrt{1-\bar\alpha_t}\varepsilon)/\sqrt{\bar\alpha_t}$，同一个 network 输出换算过来，$\hat x_0-x_0=-\frac{\sqrt{1-\bar\alpha_t}}{\sqrt{\bar\alpha_t}}(\hat\varepsilon-\varepsilon)$，所以 $\|\varepsilon-\hat\varepsilon\|^2=\dfrac{\bar\alpha_t}{1-\bar\alpha_t}\|x_0-\hat x_0\|^2$。这个比例在 $t=10$ 是 527，$t=100$ 是 8.71，$t=500$ 是 0.0853，$t=900$ 是 0.000275。两个 loss 的 minimizer 在每个 $t$ 上相同，但对各个 $t$ 的 weight 差了六个数量级：$\varepsilon$ loss 等价于在小 $t$ 上把 $x_0$ 的误差放大几百倍、在大 $t$ 上几乎不管。Network 容量有限时，学到的东西不一样。Lec 15 提到 2026 年有工作主张直接预测干净图像，理由正是干净图像在一个有结构的 manifold 上，noise 没有。
:::

:::edge $L_T$ 为什么可以丢
$L_T$ 不含 $\theta$，对 training 没有 gradient。它的大小取决于 schedule：$x_0=2$ 时 $q(x_T\mid x_0)=N(0.0127,\,0.99996)$，和 $N(0,1)$ 的 KL 是 $8.1\times10^{-5}$。如果 schedule 太短、$\bar\alpha_T$ 不够小，$L_T$ 会变大，而 sampling 从 $N(0,I)$ 出发本身就错了，这时丢掉它就不对了。
:::

:::from
VAE 类比（latent 是 $x_{1:T}$、encoder 手工定义、decoder 分层）、forward step、closed form、Markov 分解、ELBO 用在 chain 上、$L_T+\sum L_{t-1}+L_0$ 与各项的含义、analytic posterior 的 formula、equal-variance KL、noise-prediction loss 与 $\lambda_t=1$、DDIM 的 reverse step、提速的三条路来自 [Lec 15](https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec15-more-diffusion.pdf)。“从猫走到 noise 容易”的直觉、$T=1000$、noise prediction 的 training 与 sampling、Tweedie 与 score 的联系来自 [Lec 10](https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec10-diffusion.pdf)；training step 和 flow matching 的 loss 来自 [Lec 20](https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec20-midterm-review.pdf)。两步展开、variance 保持、Bayes 换方向、telescoping 的顺序跟 PS3 3.3 的分问。Posterior 的 jointly Gaussian 推导、$\varepsilon$ parameterization 的代数、$\lambda_t$ 的数值、schedule 的数表（schedule 本身取自 DDPM 论文，凭自己的知识）、Monte Carlo 核对、exact-score DDPM 的 simulation、$\varepsilon$ 与 $x_0$ 的 weight 比是为这一页算的。Lec 16 没有读。
:::

## [ar] Autoregressive model 与 teacher forcing

:::skip
快速路线可以只看前三个小节。能用 chain rule 写出 likelihood、说出 training 为什么并行而 sampling 不能，并证明 teacher forcing 就是 MLE，就可以去第 8 站。已经学过 [Zero to Hero](../courses/KARPATHY-Z2H.html#lm) 的话，这一站大部分是换一个角度复习。
:::

### 把 joint distribution 拆开

Lec 12 的 running example 是 binarized MNIST：$28\times28=784$ 个 pixel，每个是 0 或 1。直接写 joint distribution 要一张有 $2^{784}$ 格的表，减去“加起来是 1”的约束是 $2^{784}-1$ 个 parameter，约 $10^{236}$。假设 pixel 互相 independent，只要 784 个 parameter，但每个 pixel 各抽各的，sample 是一片随机的点。

Chain rule 对任何 joint distribution 都成立，没有做任何假设：

$$p(x_1,\dots,x_n)=p(x_1)\,p(x_2\mid x_1)\,p(x_3\mid x_1,x_2)\cdots p(x_n\mid x_1,\dots,x_{n-1})=\prod_{i=1}^np(x_i\mid x_{<i})$$

每个 conditional 都是一个变量的 distribution，对 binary pixel 就是一个 Bernoulli，只要一个数 $\hat x_i=p(x_i=1\mid x_{<i})$。这正是开头那张表里 autoregressive 一行的意思：每个 factor 自己就是 normalized 的，乘起来自动 normalized，不需要 $Z$。

用 table 存每个 conditional 仍然是 $2^{i-1}$ 格。Lec 12 的做法是用一个 function 去算 $\hat x_i$，最简单的是 logistic regression：

$$\hat x_i=\sigma\Big(\theta^{(i)}_0+\sum_{j<i}\theta^{(i)}_jx_j\Big)$$

第 $i$ 个 conditional 有 $i$ 个 parameter，总共 $\sum_{i=1}^{784}i=784\times785/2=307{,}720$ 个。换成 MLP、CNN、Transformer，就是 deep autoregressive model。

### 一个从头算到尾的例子

::fig[cs5788-ar] $2\times2$ 的 binary image 按 raster 顺序（左上到右下）排成 4 个 pixel。每个 $\hat x_i$ 由前面的 pixel 经 logistic regression 算出；pixel 是 1 就乘 $\hat x_i$，是 0 就乘 $1-\hat x_i$。

$x=(0,1,1,0)$ 时，$p(x)=(1-\hat x_1)\,\hat x_2\,\hat x_3\,(1-\hat x_4)$，正是 Lec 12 那个例子的形状。用图里的 parameter 算出 $p(x)=0.1095$，$\log p(x)=-2.212$。把 16 种 $2\times2$ 图像的 $p$ 全部加起来，得到 1.0000（逐个算过）。

### Training 并行，sampling 串行

Training 时整张图已知，$\hat x_1,\dots,\hat x_n$ 每一个只依赖已知的 $x_{<i}$，可以同时算出来，然后 MLE：

$$\max_\theta\frac1{|D|}\sum_{x\in D}\sum_{i=1}^n\log p_\theta(x_i\mid x_{<i})$$

一个 network 要一次 forward pass 同时给出所有 $\hat x_i$，又不能让 $\hat x_i$ 偷看 $x_i$ 或之后的 pixel。办法是 masking：PixelCNN 用 masked convolution，把 kernel 里位于当前 pixel 及其之后（按 raster 顺序）的 weight 置 0；WaveNet 在一维音频上用 causal convolution，只看过去；Transformer 用 causal attention mask，做法见 [Zero to Hero 的 GPT 一站](../courses/KARPATHY-Z2H.html#gpt)。WaveNet 另用 dilated convolution 扩大 receptive field：kernel size 2、dilation 依次为 $1,2,4,\dots,512$ 的 10 层，receptive field 是 $1+(1+2+\cdots+512)=1024$ 个 sample。

Sampling 时没有现成的 $x$。先按 $\hat x_1$ 抽 $x_1$，才能算 $\hat x_2$，再抽 $x_2$……784 个 pixel 要 784 次 network evaluation，不能并行。

Lec 12 的总结：likelihood exact，training 可以并行；sampling 慢，而且没有一个天然的 latent representation。连续的 data 把每个 conditional 换成 Gaussian $N(\mu_\theta(x_{<i}),\sigma^2_\theta(x_{<i}))$ 就行，这时它就是第 3 站的 MAF。

### Teacher forcing 就是 MLE

Language model 是同一个结构，变量是 token：$p(x)=\prod_tp(x_t\mid x_{<t})$。Training 时把 ground-truth 的 prefix 喂给 model，让它预测下一个 token，loss 是每个位置的 cross-entropy 之和，这叫 teacher forcing。它和 MLE 是同一个 objective：

$$-\log p_\theta(x)=-\log\prod_tp_\theta(x_t\mid x_{<t})=-\sum_t\log p_\theta(x_t\mid x_{<t})$$

右边每一项正是“给真 prefix、预测真 token”的 cross-entropy。对 dataset 取平均，最小化 teacher forcing loss 等于最大化 sequence 的 log-likelihood（PS4 4.3(a)(i)）。

:::wrong Test 时 model 吃的是自己的输出，training 也应该用 model 自己 sample 的 prefix 才对
Data 的 likelihood 按 chain rule 拆开，每个 factor 的条件是 data 自己的 prefix $x_{<t}$，不是 model 生成的 $\hat x_{<t}$。把条件换成 $\hat x_{<t}\sim p_\theta$，loss 变成 $-\mathbb E_{\hat x\sim p_\theta}\sum_t\log p_\theta(x_t\mid\hat x_{<t})$：真 token $x_t$ 接在一个和它无关的假 prefix 后面，这个 objective 不对应任何 sequence 的 probability，最优解也不是 $p_\theta=p_{\text{data}}$。放到上面的 $2\times2$ 例子里看：model 抽出的 $\hat x_1$ 和 data 的 $x_2$ 是 independent 的，在这种 prefix 下预测 $x_2$，最好的 $\hat x_2$ 只能是 $x_2$ 的 marginal probability，pixel 之间的依赖全部被学掉了。Teacher forcing 在数学上就是 MLE；test 时 prefix 来自 model 是 sampling 的定义，不是 training 的错误。
:::

### 和 LLM、post-training 的关系

Lec 12 指出，现代 LLM 就是用 Transformer 代替 RNN 或 CNN 的 autoregressive model，parameter 和 token 都以 billion 计；它也指出 image 上的 autoregressive model 在 sample quality 上比不过 diffusion，因为 likelihood 不是 sample quality 的好代理（第 8 站）。从零写一个 decoder-only Transformer 是 PS4 的 4.1，逐个组件的讲解见 [Zero to Hero 的 GPT 一站](../courses/KARPATHY-Z2H.html#gpt)，现代组件（RMSNorm、SwiGLU、RoPE）见 [CS336 的 architecture 一站](../courses/STANFORD-CS336.html#arch)。Lec 19、21 的 post-training（SFT、RLHF、DPO）这一页没有写；PS4 的 4.3(b)(c) 从 REINFORCE 一路推到 DPO loss，推导顺序和 [CS4248 的 post-training 一站](../courses/CS4248.html#post) 相同。

:::from
Binarized MNIST 的三种 parameter 计数、chain rule、logistic conditional、raster 顺序、$(1-\hat x_1)\hat x_2\hat x_3(1-\hat x_4)$ 的例子形状、training 并行与 sampling 串行、Gaussian conditional、优缺点、WaveNet 的 causal 与 dilated convolution、PixelCNN 的 masked convolution、“AR 在图像上比不过 diffusion”来自 [Lec 12](https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec12-kuleshov-autoregressive.pdf)。Teacher forcing 的定义来自 [Lec 20](https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec20-midterm-review.pdf)，“teacher forcing 等于 MLE、self-conditioned objective 不是”是 PS4 4.3(a) 的题目。Lec 14（LLM）没有读。$2\times2$ 例子的 parameter 与数值、16 种图像的 normalization 核对、307,720、receptive field 1024 是为这一页算的。
:::

## [eval] Evaluation：likelihood、Inception Score 与 FID

:::skip
快速路线可以跳过；读论文、做 final project 时会用到。能把 NLL 换成 bits/dim、写出 FID 并说出它的三个 pitfall，就够了。最后一小节是 Lec 25 后半的 robotics 部分。
:::

### Likelihood

最直接的 metric 是 test set 上的 NLL，$-\sum_i\log p_\theta(x_i)$。Lec 25 列的优点：它就是 autoregressive model 和 flow 直接优化的量，难以作弊，有 compression 的含义（$-\log_2p(x)$ 是用 $p$ 编码 $x$ 需要的 bit 数）。

不同大小的图像要比较，就除以维数并换成以 2 为底：

$$\text{bits/dim}=\frac{-\log p_\theta(x)}{d\,\ln2}$$

第 1 站的 6 个点（$d=1$）：单个 Gaussian 平均 NLL 是 2.1325 nats，即 3.077 bits/dim；$K=2$ 的 GMM 是 1.2162 nats，即 1.755 bits/dim。连续 density 的 bits/dim 只有在 data 先离散化、再按第 3 站的 dequantization 处理之后才真正是“bit 数”，否则可以是负的。

哪些 model 能报这个数：autoregressive 和 flow 是 exact；VAE 和 diffusion 只能报 ELBO 或 VLB 给出的 upper bound（NLL 的上界）；GAN 和 EBM 报不出来。Lec 25 提到，diffusion 的 bound 在 variational diffusion models 里可以优于 autoregressive model 的 bits/dim，关键之一是学 noise schedule 来降低 bound 的 variance。

Likelihood 的短处在第 4 站已经算过：$0.01p+0.99\,\text{noise}$ 的 model 有 99% 的 sample 是 noise，bits/dim 只差 0.0022；只会背 training data 的 model sample 完美，test likelihood 极差。Lec 25 的说法是 likelihood 和 perceptual fidelity 只是松散地相关。

### Inception Score

只看 sample 的 metric。拿一个在这个 dataset 上训练好的 classifier $p_\psi(y\mid x)$，对一大批生成的 $x$ 检查两件事（Lec 25）：每张图都应该被清楚地分到某一类，$p_\psi(y\mid x)$ 的 entropy 低；整批图应该覆盖各个类，marginal $p(y)=\mathbb E_x\,p_\psi(y\mid x)$ 的 entropy 高。合成一个数：

$$\text{IS}=\exp\Big(\mathbb E_x\,D_{\text{KL}}\big(p_\psi(y\mid x)\,\|\,p(y)\big)\Big)$$

展开 KL：$\mathbb E_x\sum_yp(y\mid x)\log\frac{p(y\mid x)}{p(y)}=-\mathbb E_xH(y\mid x)+H(y)$（第二项用了 $\mathbb E_xp(y\mid x)=p(y)$）。所以 $\log\text{IS}=H(y)-\mathbb E_xH(y\mid x)$，正好是“marginal 的 entropy 高、单张的 entropy 低”。

三类、三张生成图，算几种情形：

| 生成的三张图的 $p_\psi(y\mid x)$ | $p(y)$ | IS |
|---|---|---|
| $(1,0,0)$、$(0,1,0)$、$(0,0,1)$ | $(\tfrac13,\tfrac13,\tfrac13)$ | 3.000 |
| $(0.9,0.05,0.05)$ 及其两个轮换 | $(\tfrac13,\tfrac13,\tfrac13)$ | 2.022 |
| 三张都是 $(0.9,0.05,0.05)$ | 同上 | 1.000 |
| 三张都是 $(\tfrac13,\tfrac13,\tfrac13)$ | 同上 | 1.000 |

最大值是类的个数。Mode collapse（第三行）和全是看不清的图（第四行）都得 1。IS 不看真 data，也只能用在有 class 的 dataset 上。

### FID

Fréchet Inception Distance 把 classifier 换成 feature（Inception network 倒数第二层），比较真 data 和生成 data 的 feature distribution。两边各自近似成 Gaussian，用 mean 和 covariance 算 Fréchet distance（Lec 25）：

$$d_F=\|\mu-\mu'\|^2+\mathrm{tr}\big(\Sigma+\Sigma'-2(\Sigma\Sigma')^{1/2}\big)$$

一维时 $(\Sigma\Sigma')^{1/2}=\sigma\sigma'$，$d_F=(\mu-\mu')^2+\sigma^2+\sigma'^2-2\sigma\sigma'=(\mu-\mu')^2+(\sigma-\sigma')^2$。

::fig[cs5788-fid] 把 feature 取成 $x$ 本身，用两个 bump 的 $p_{\text{data}}$ 比较三个 generator。FID 和 NLL 给出完全不同的排序。

- $N(0,4.25)$：mean 0、standard deviation 2.062，和 $p_{\text{data}}$ 的 moment 完全相同，FID 是 0。它的 sample 有 37% 落在 data 几乎没有的地方（开头的第一次失败）。
- 只生成右边的 bump，$N(2,0.25)$：$(0-2)^2+(2.062-0.5)^2=4+2.438=6.44$。
- 真正的 $p_{\text{data}}$：FID 是 0。

FID 只看 feature 的前两阶 moment，“两个 bump”和“一个宽 bump”在它眼里一样。真实使用中 feature 是 2048 维，network 的 feature 让这种巧合少得多，但原理不变：FID 量的是 Gaussian 近似下的距离。NLL 一列反过来：真 data 1.419，宽 Gaussian 2.142，单个 bump 16.73，漏掉一个 mode 被罚得最重。

:::wrong FID 是两个 distribution 之间的距离，拿 1000 个 sample 算就够了
FID 要估计两个 covariance，维数高时 sample 少，估计本身就有 bias。Simulation：两边都是 64 维的 $N(0,I)$（完全相同的 distribution，真 FID 是 0），每边 500 个 sample 算出 4.42，5000 个是 0.442，50000 个是 0.0435，大致按 $1/n$ 下降。实际的 feature 是 2048 维，所以 Lec 25 说通常要约 50k 个 sample；不同论文的 FID 只有在 sample 数相同时才能比。Lec 25 列的另外两个 pitfall：Gaussian 是一个建模假设，不是 data 的性质（上图）；FID 不评价 conditional generation 是否符合条件。
:::

Lec 25 还讲了 perceptual loss 和 LPIPS（用 network feature 比较两张图，LPIPS 再用人的判断校准），以及只有 sample 时用 histogram 或 kernel density estimation 估计 density（高维不准）。

### 生成模型用在 robot 上

Lec 25 的后半把前面的模型接到 robotics。最直接的一条是 imitation learning：把人 teleoperation 的 demo 当 data，学 $p(a\mid o)$，给定 observation 输出 action，和 LM 学“给定 prefix 输出下一个 token”是同一件事（Lec 25 举了 ALOHA 2、把 locomotion 当 next-token prediction 的工作）。

为什么这里需要 generative model，而不是一个对 action 做 MSE regression 的 network？

::fig[cs5788-bc] 同一个 observation 下有两种 demo：从左边绕过 obstacle，或者从右边。

两条 demo 在 start 处的 heading 是 $\pm50°$。MSE 下最好的单个输出是两者的 mean，0°，正对 obstacle。这和第 1 站单个 Gaussian 把 sample 放在两个 bump 中间、第 2 站 VAE decoder 输出两根 bar 的平均，是同一个错误：$p(a\mid o)$ 有两个 mode，要的是 sample 其中一个，而不是它们的 mean。Diffusion、autoregressive（把 action 离散成 token）、GMM 都能表示多个 mode。这一段的论证是我加的；slides 里没有展开，也没有讲 diffusion policy。

另一条是 world model：学一个 action-conditioned 的预测 $p_\theta(x_{t+1}\mid x_t,a_t)$，给定当前图像和 action 预测下一帧。有了它就可以做 visual MPC：对很多条候选 action sequence 在 model 里“想象”未来，执行最接近目标的那条（Lec 25 引了 Visual Foresight）。Slides 提到直接预测 video 很贵（一段 10 秒的 video 在一块 GPU 上要 30 分钟以上），所以 V-JEPA 2 改在 feature space 里预测并做 MPC；也提到 Cosmos Policy 直接 fine-tune video model 做 control。

:::from
Likelihood 的优缺点、VLB 与 variational diffusion models、IS 的两个条件与 formula、perceptual loss 与 LPIPS、FID 的定义、Gaussian 假设、约 50k sample 与另外两个 pitfall、KDE、robotics 部分（imitation learning、ALOHA、locomotion 作为 next-token prediction、world model、visual MPC、video 生成的代价、V-JEPA 2、Cosmos Policy）来自 [Lec 25](https://www.cs.cornell.edu/courses/cs5788/2026sp/slides/lec25-evaluation.pdf)（slides 没有 bits/dim 的 formula 和具体数值，也没有 precision/recall、diffusion policy）。$\log\text{IS}=H(y)-\mathbb E H(y\mid x)$ 的推导、IS 的数表、1D FID 的三个 generator、FID bias 的 simulation、behavior cloning 的图与“mean 撞墙”的论证是为这一页写和算的。
:::

## 作业

四份 problem set 都是 Colab notebook 加一份 written 题。Handout 是课程主页上公开的 PDF；notebook 通过 handout 里的 Google Drive 链接发放，这一页没有打开，所以下面关于 notebook 内部的说法都标了“未核实”。没有公开的 autograder 和答案。每份都把 notebook 用最后一个 cell 的脚本转成 PDF，和 written 的 PDF 一起交 Gradescope。下面的提示注明出处：“handout”指 PS 的 PDF，“slides”指对应讲次，“经验”是这一页自己的判断。

### PS1：Simple generative models（值得做）

**要实现什么。** 在 $16\times16$ 的 image patch（256 维）上：closed form 拟合一个 Gaussian，画出 covariance 最大的 10 个 eigenvector；用 SGD 拟合同一个 Gaussian，把 test NLL 和 closed form 比较；扩展成 $K=16$ 的 GMM，再扫 $K=1,4,16,32,64$；在 $K=64$ 的 component 里找出代表 edge、平坦区域的 component；最后用 GMM 当 prior 做 denoising（noise $\sigma=25/255$，$\lambda=1$，比较 $K=1$ 与 $K=64$）。Written 题：diagonal covariance 的 MLE、1D GMM 的 mean、用 change of variables 证明 $\Sigma^{-1/2}(x-\mu)\sim N(0,I)$、$D_{\text{KL}}(N(0,1)\|N(\mu,\sigma^2))$。

**做完会什么。** 第 1 站的全部内容，外加第 3 站的 change of variables 和第 2 站要用的 Gaussian KL。

**时间和算力。** Handout 没写；估计 6 到 8 小时（经验）。不训练大 network，free Colab 足够。

**提示。**

- $\Sigma=AA^\top+\varepsilon I$，$\varepsilon=10^{-4}$；SGD 用 Adam、learning rate $10^{-4}$、20 个 epoch、batch size 至少 512（handout）。直接把 $\Sigma$ 当 free parameter，$\log\det$ 很快变成 NaN（经验，理由见第 1 站）。
- Closed form 的 test NLL 是 SGD 版本的标准答案：SGD 收敛后应该接近它，差很多就是实现有错（handout 让你做这个比较，判断方法是经验）。
- Mixture weight 用 logits 加 softmax（handout、Lec 3）；整体 log-likelihood 用 `torch.logsumexp` 合并各个 component 的 $\log\pi_k+\log N_k$，在 256 维上直接对 probability 求和会 underflow 成 $-\infty$（经验，数值见第 1 站）。
- 多元 Gaussian 的 $\log N$ 不要自己写 $\Sigma^{-1}$ 和 `det`：用 PyTorch 的 `MultivariateNormal` 并传 `scale_tril`（Cholesky factor），数值更稳（经验）。
- 1.1(g) 的 $K$ 越大 training NLL 越低，test NLL 不一定；在 handout 要求的描述里把这两件事分开写（第 1 站的 :::wrong）。
- 可选的 1.1(c)(ii)：$\Sigma_{ij}$ 只依赖于 $i-j$ 时，把 $\Sigma v$ 的第 $i$ 个分量写成 $\sum_jf(i-j)e^{i\omega j}$，换元 $k=i-j$ 把 $e^{i\omega i}$ 提出来（经验）。这解释了为什么 patch 的 eigenvector 像 Lec 3 说的 DCT basis。
- KL 那题 handout 的提示是不用积分，只用 Gaussian 的 mean 和 variance：$\mathbb E[x^2]$、$\mathbb E[(x-\mu)^2]$ 代进去即可。

### PS2：VAE 与 CycleGAN（VAE 先做，CycleGAN 有余力再做）

**要实现什么。** MNIST 上的 VAE，并在 latent space 里操作图像（handout 没写具体操作，未核实 notebook）；apple2orange 上的 CycleGAN；written 题：ELBO 与 autoencoder 的类比、只保留 reconstruction 项时和普通 autoencoder 的区别、不用 Jensen 推出 $\log p(x)$ 的两项分解并说出何时取等、least-squares GAN 的 optimal discriminator。

**做完会什么。** 第 2 站全部；第 4 站的 optimal discriminator 和 CycleGAN 的结构。

**时间和算力。** Handout：CycleGAN 在 T4 上 6 到 8 小时，A100 上不到 1 小时。VAE 部分 free Colab 足够。CycleGAN 在 free Colab 上连续跑 6 到 8 小时很可能被断开，要定期把 checkpoint 存到 Google Drive（经验）。

**提示。**

- Handout 说 CycleGAN 为了提速缩小过，结果不会完美；以 handout 的 Figure 3、4 为对照，不要为了画质反复重训（handout）。
- 2.3(b) 的提示是不用 Jensen，只做代数变形（handout）：先把 $\log p(x)$ 写成对 $q$ 的 expectation，再用 $p(x)=p(x,z)/p(z\mid x)$，分子分母同乘 $q$，正是第 2 站那三行。
- 2.3(a)(ii)：只保留 reconstruction 项时，看第 2 站第二张表 $v\to0$ 那几行。
- LSGAN 的 $D^*$：和第 4 站一样，对每个 $x$ 单独优化，被积函数变成关于 $D(x)$ 的二次函数，对 $D(x)$ 求 derivative 令其为 0（方法来自第 4 站，题目的常数 $a,b,c$ 见 handout 的 Eq. 4、5）。
- VAE 的 KL 项用 closed form，不要用 sample 估计；encoder 输出 $\log\sigma^2$ 而不是 $\sigma$，保证 variance 为正（经验）。
- 插值时若 latent 的维数很低（例如 2），可以直接在 latent 平面上画一个 grid 逐点 decode，比两点插值更能看出 latent 的结构（经验，未核实 notebook 是否这样要求）。

### PS3：Normalizing flow 与 diffusion（先做）

**要实现什么。** RealNVP，生成人脸（handout 没写 dataset 名）；按指定结构训练一个生成手写数字的 diffusion model；written 题：两个 independent Gaussian 之和、$aX$ 的 distribution、一步 DDPM 保持 unit variance、两步展开并合并 noise、说明 $O(1)$ 跳到任意 $t$ 对 SGD 为什么重要；VLB 的 Markov 分解、用 Bayes 改写 $q(x_t\mid x_{t-1})$、代入并整理成 $L_T+\sum L_{t-1}+L_0$、说明 $L_{t-1}$ 为什么是 denoising loss。

**做完会什么。** 第 3、6 站全部。之后读任何 diffusion 论文的 loss 都不会卡住（调研条目的判断）。

**时间和算力。** Handout：作者的 RealNVP 在 T4 上训练 2 到 3 小时。Diffusion 部分 handout 没写，估计在 T4 上不到 1 小时（经验，未核实）。先做 diffusion，再留一整块时间跑 RealNVP（调研条目的建议）。

**提示。**

- (a)(vi)：有了 $\bar\alpha_t$，每个 training example 抽一个 $t$ 就能一步得到 $x_t$，代价与 $t$ 无关；逐步加 noise 时，抽到 $t$ 就要做 $t-1$ 次加 noise，$t$ 均匀分布时平均约 $T/2=500$ 步（题目设置来自 handout，数是我算的）。自己写 training loop 时也必须用 closed form（Lec 20 的“spot the bug”也考这个）。
- (b)(ii) 的关键一步：$q(x_t\mid x_{t-1})=q(x_t\mid x_{t-1},x_0)$ 用的是 Markov 性，然后才能用 Bayes 换方向；之后的 $\sum\log\frac{q(x_t\mid x_0)}{q(x_{t-1}\mid x_0)}$ 是 telescoping 的（第 6 站）。$t=1$ 那一项要单独处理，不要套进 Bayes。
- 写 diffusion 的 network 时 $t$ 必须作为 input（Lec 10 用 positional encoding）；忘了 $t$，network 不知道该去掉多少 noise（Lec 20 的练习题）。
- Sampling 最后一步 $t=1$ 不加 noise（第 6 站的 sampling formula）。
- RealNVP 的 $s$ 通常经过 `tanh` 或乘一个可学的小 scale 再取 exp，否则初期 $e^{s}$ 可能溢出（经验，未核实 notebook 的写法）。Loss 里的 $\log|\det|$ 是所有层的 $\sum s$ 之和，漏掉它 model 会把一切压到 0（第 3 站的 :::wrong）。
- Handout 说 RealNVP 被缩小过，sample 不会完美；checkpoint 存到 Drive，以免 Colab 断开后重来（前半句 handout，后半句经验）。

### PS4：Language models（值得做）

**要实现什么。** 按 “Attention Is All You Need” 的结构实现 decoder-only Transformer 并生成文本；在 notebook 里实现 SFT 和 DPO；written 题：teacher forcing 等价于 MLE 以及 self-conditioned objective 为什么不是；用 log-derivative trick 推 REINFORCE，证明 prompt-only baseline 不改变 expected gradient；Bradley–Terry 的 sigmoid 形式、reward model 的 NLL、加 $c(x)$ 不改变 preference；从 KL-regularized RL 推出 optimal policy、把 reward 写成 policy 的 log-ratio、代回 Bradley–Terry 让 $\beta\log Z(x)$ 抵消，得到 DPO loss。

**做完会什么。** 第 7 站；第 2 站的 score-function estimator 用在离散 token 上；DPO 的完整推导（参考 [CS4248 的 post-training 一站](../courses/CS4248.html#post)）。

**时间和算力。** Handout 没写 dataset、model 大小和算力；从题目规模看 free Colab 应该够（调研条目的估计，未核实 notebook）。

**提示。**

- (a)(i) 的 handout 提示：log of product 变成 sum of log，negative expected log-likelihood 就是 loss（第 7 站那一行）。
- (b)(ii) 的 handout 提示：$\mathbb E_{y\sim\pi}[\nabla\log\pi(y\mid x)]=0$，因为它等于 $\nabla\sum_y\pi(y\mid x)=\nabla1=0$；$b(x)$ 不依赖 $y$，可以提到 expectation 外面。
- (c)(ii)(d)：$\log Z(x)$ 只依赖 prompt，两个 response 的 reward 相减时抵消，这正是 DPO 不需要单独训练 reward model、也不需要算 $Z$ 的原因（调研条目；和 (c)(i)(d) 加 $c(x)$ 不变是同一件事）。
- 实现 DPO 时 reference model 冻结（`requires_grad_(False)`、`eval()`）；sequence 的 log-prob 只对 response token 求和，prompt token 要 mask 掉，否则 loss 会被 prompt 长度主导（经验）。
- Policy 和 reference 的 log-prob 要用同一套 tokenization 和同一个 mask 算，二者的差才有意义；训练刚开始时 policy 等于 reference，DPO loss 应该恰好是 $\log2=0.693$，用这个检查实现（经验，来自 $-\log\sigma(0)$）。
- Transformer 的 causal mask 和逐 token 的实现细节见 [Zero to Hero 的 GPT 一站](../courses/KARPATHY-Z2H.html#gpt)。
