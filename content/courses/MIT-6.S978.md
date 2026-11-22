---
code: MIT-6.S978
evidence: syllabus
evidenceNote: "MIT Fall 2024 一期（6.S978 Deep Generative Models，Kaiming He 主讲，TA 是 Minghao Guo），没有找到更新的一期。5 讲 slides 和 Yang Song 的 consistency models guest lecture：课程网站的 PDF 用 WebFetch 只能拿到丢了 formula 的转述，这次从课程网站的 GitHub 仓库取得原 PDF，用 pdftotext 读了全部文字；slides 里的 formula 是图片，含 formula 的关键页渲染成图片逐页看过（页码列在每站的 :::from 里），其余页只读了文字。6 份 problem set 的 handout PDF 和 notebook 从 Google Drive 逐份读过。课程主页和 schedule 重新读过。Reading session 的论文：MAR 的 Table 1 到 3 对着 arXiv HTML 核过，VAR 的 scale 列表、codebook 大小和 mask 对着官方代码核过；VQ-VAE、FSQ、Progressive Distillation、DDPM、Bengio 与 Bengio 1999 读了相关章节；Consistency Models 读了正文前半、Algorithm 1 和 Eq. 10，Appendix C 没有读到，c_skip 和 c_out 改为对着 openai/consistency_models 的代码核对；MAGVIT-v2（Figure 1 的具体数值没有读到）、SiT、SD3、Fluid（scaling 的 exponent 没有读到）、MeanFlow 以及 VAR 的正文仍是上一次读的工具转述，没有重新核对。快速路线和可跳过的部分来自本站的调研条目。"
exam: "无考试。课程主页写的考核：30% 双周 problem set 与 participation（含出勤；按 Good / Fair / Poor / None 评，去掉最低两次），30% seminar（报名与按时上传 5%、presentation 20%、讨论 5%），40% final project（proposal 5%、final presentation 15%、blog post 20%，最多两人一组）。迟交政策两处说法不一：主页写除严重的医疗或个人情况外不收，每份 handout 写 7 天内可交、得分乘一个按天从 1 线性降到 0.5 的系数；以当学期 Canvas 为准。"
subskills:
  - id: factor
    name: Generative model 是对 joint distribution 的分解
    l3: "能把一个任务写成 $p(x\\mid y)$，说出 $x$ 和 $y$ 各是什么，并用 chain rule 写出一个小 distribution 的 conditional。"
    l4: "能对一个 4 pixel 的例子按两种 order 写出全部 conditional，并说明 chain rule 精确、approximation 来自 conditional 的 model class。"
    l5: "能用 parity 的例子解释为什么 shared 的 logistic conditional 学不会某些 distribution，以及 order 和 partition 的选择怎样改变每个 conditional 的难度。"
  - id: vae
    name: Latent variable、ELBO 与 VQ-VAE
    l3: "能写出 ELBO 的两项，并说出 VQ 的 forward 和 backward 各做什么。"
    l4: "能不用 Jensen inequality 推出 $\\log p(x)=\\text{ELBO}+D_{\\text{KL}}(q\\,\\|\\,p(z\\mid x))$，并对一个 Gaussian 例子算出 gap。"
    l5: "能把 K-means 讲成 EM 的特例和一个 autoencoder，并解释 VQ-VAE 为什么只能当 tokenizer、不能直接当 generative model。"
  - id: ar
    name: Autoregressive model 与 teacher forcing
    l3: "能写出 teacher forcing 的 loss，并画出 causal attention mask。"
    l4: "能解释一个 network 怎样在一次 forward 里同时算出所有 conditional，以及 target 为什么要错开一位。"
    l5: "能说清 teacher forcing 带来的 training 与 inference 不一致，并用例子指出 model 会在哪种 prefix 上失控。"
  - id: tok
    name: Tokenizer 与 next-scale prediction
    l3: "能算出一个 stride 16 的 tokenizer 把 256×256 的图像变成多少个 token，并写出 LFQ 的 token index。"
    l4: "能解释 VQ 的 codebook 变大时 reconstruction 变好而 generation 变差，以及 LFQ、FSQ 怎样绕开。"
    l5: "能分别按“有 KV cache”和“没有 KV cache”比较 raster AR 与 VAR 的计算量，并说明 VAR 真正省下的是什么。"
  - id: gan
    name: GAN 与 adversarial loss
    l3: "能写出 minimax objective 和 non-saturating 的 generator loss。"
    l4: "能推出 optimal discriminator 和 $-\\log4+2D_{\\text{JS}}$。"
    l5: "能用两个 delta distribution 说明 JS divergence 为什么给不出 gradient，而 Wasserstein distance 可以。"
  - id: diff
    name: Diffusion 与 flow matching 的设计空间
    l3: "能在 linear path 下把 $x$、$\\varepsilon$、$v$ 三种 prediction 互相换算。"
    l4: "能从 Gaussian 之间的 KL 推出 DDPM 的 noise prediction loss 和被丢掉的 weight，并算出 logit-normal sampling 的 density。"
    l5: "能推出 SD3 的 resolution-dependent timestep shift，并解释 interpolant、prediction、loss weight、sampler 这四个选择各改变了什么。"
  - id: mar
    name: 不用 vector quantization 的 autoregression
    l3: "能说出 Diffusion Loss 的 input、output 和 loss。"
    l4: "能解释 L2 regression 和 VQ 加 cross-entropy 在一个 bimodal token 上各错在哪，以及 random order 加 bidirectional attention 为什么大幅降低 FID。"
    l5: "能按 MAR 的代码算出 cosine schedule 每步生成多少 token，并用 Fluid 的 2×2 实验说明 continuous token 与 random order 对 scaling 的作用。"
  - id: fast
    name: One-step 与 few-step generation
    l3: "能说出 consistency model 和 MeanFlow 各自学的是什么 function。"
    l4: "能在一个 toy 例子上算出 Euler 走 1 步、2 步的结果，并解释为什么 1 步一定落在 posterior mean。"
    l5: "能推出 MeanFlow identity，并在 toy 例子上验证它；能说明 distillation、consistency、MeanFlow 三条路的上限各由什么决定。"
open:
  - label: "MIT 6.S978 课程 schedule（Fall 2024）"
    url: "https://mit-6s978.github.io/schedule.html"
    note: "讲次、reading session 的论文清单、作业发布与截止日期。"
  - label: "MIT 6.S978 课程主页"
    url: "https://mit-6s978.github.io/"
    note: "考核、迟交政策、seminar 与 final project 的要求、blog post 范例。"
  - label: "6.S978 Lecture 1: Introduction"
    url: "https://mit-6s978.github.io/assets/pdfs/lec1_intro.pdf"
    note: "第 1 站。原 PDF 的文字全部读过，看了第 15、30、36、49 页的图。"
  - label: "6.S978 Lecture 2: Variational Autoencoder"
    url: "https://mit-6s978.github.io/assets/pdfs/lec2_vae.pdf"
    note: "第 2 站。文字全读；看了第 8、18、20、22、27、28、30、77 页（ELBO 推导、两项 loss、reparameterization、VQ-VAE 的 loss）。"
  - label: "6.S978 Lecture 3: Autoregressive Models"
    url: "https://mit-6s978.github.io/assets/pdfs/lec3_ar.pdf"
    note: "第 1、3 站。文字全读；看了第 35、38、74、98 页。"
  - label: "6.S978 Lecture 4: Generative Adversarial Network"
    url: "https://mit-6s978.github.io/assets/pdfs/lec4_gan.pdf"
    note: "第 4、5 站。文字全读；看了第 22、32、48、50、62、64、72、73 页（flip trick、JS 的结论、delta 的例子、1-d 的 W1、WGAN 的 objective）。"
  - label: "6.S978 Lecture 5: EBM, Score Matching, Diffusion Models"
    url: "https://mit-6s978.github.io/assets/pdfs/lec5_diffusion.pdf"
    note: "第 6 站。文字全读；看了第 9、16、21、22、37、45、53、56、60、62、77、78 页。"
  - label: "6.S978 Guest lecture: Yang Song, Consistency Models"
    url: "https://mit-6s978.github.io/assets/pdfs/CM_lecture.pdf"
    note: "第 8 站。文字全读；看了第 16、18、21、27、28、31、36、37 页。"
  - label: "课程网站的 GitHub 仓库 mit-6s978/mit-6s978.github.io"
    url: "https://github.com/mit-6s978/mit-6s978.github.io"
    note: "原 slides PDF 从这里 sparse checkout 取得（课程网站本身对命令行下载不开放）。"
  - label: "6.S978 Problem Set 1（Google Drive：pset1.pdf、pset1.ipynb）"
    url: "https://drive.google.com/drive/folders/18ApUM-i2h5AVDQu7zYmMvKlZH5I3vy1I"
    note: "handout 和 notebook 全读。作业一节。"
  - label: "6.S978 Problem Set 2（Google Drive：pset2.pdf、pset2.ipynb）"
    url: "https://drive.google.com/drive/folders/1a7nFsrYK-VlA3NwecXjN2Fp2OU-E4nJw"
    note: "handout 和 notebook 全读。"
  - label: "6.S978 Problem Set 3（Google Drive：pset3.pdf、pset3.ipynb）"
    url: "https://drive.google.com/drive/folders/18dWKJYv2vXQ5VKV8kMqTwDJBWIe6O7PU"
    note: "handout 和 notebook 全读。"
  - label: "6.S978 Problem Set 4（Google Drive：pset4.pdf、pset4.ipynb）"
    url: "https://drive.google.com/drive/folders/1eY4KrD4Q5f4CIAUWWDbo_Zp1Qrv3Dfea"
    note: "handout 和 notebook 全读。"
  - label: "6.S978 Problem Set 5（Google Drive：pset5.pdf、pset5.ipynb）"
    url: "https://drive.google.com/drive/folders/1naBf_tYfl4X_9kNL2qK9srT8tVlEq19R"
    note: "handout 和 notebook 全读。"
  - label: "6.S978 Problem Set 6（Google Drive：pset6.pdf、pset6.ipynb）"
    url: "https://drive.google.com/drive/folders/1diX47OdTMAFfP1BuEJSjQDRwDeWsRzKn"
    note: "handout 和 notebook 全读。"
  - label: "GitHub LTH14/mar（MAR 官方代码）"
    url: "https://github.com/LTH14/mar"
    note: "读了 models/mar.py、models/diffloss.py、main_mar.py 的默认参数和 README 的训练、评测命令。"
  - label: "GitHub FoundationVision/VAR（VAR 官方代码）"
    url: "https://github.com/FoundationVision/VAR"
    note: "核对了 patch_nums、vocab_size 和 block-causal mask。"
  - label: "GitHub openai/consistency_models（Consistency Models 官方代码）"
    url: "https://github.com/openai/consistency_models"
    note: "核对了 cm/karras_diffusion.py 里 boundary condition 的 c_skip、c_out 和 sigma_data。"
sources:
  - label: "Li, Tian, Li, Deng, He. Autoregressive Image Generation without Vector Quantization（arXiv 2406.11838）"
    url: "https://arxiv.org/abs/2406.11838"
  - label: "Ma et al. SiT: Exploring Flow and Diffusion-based Generative Models with Scalable Interpolant Transformers（arXiv 2401.08740）"
    url: "https://arxiv.org/abs/2401.08740"
  - label: "Esser et al. Scaling Rectified Flow Transformers for High-Resolution Image Synthesis（arXiv 2403.03206）"
    url: "https://arxiv.org/abs/2403.03206"
  - label: "Tian et al. Visual Autoregressive Modeling（arXiv 2404.02905）"
    url: "https://arxiv.org/abs/2404.02905"
  - label: "Yu et al. Language Model Beats Diffusion: Tokenizer is Key to Visual Generation（arXiv 2310.05737）"
    url: "https://arxiv.org/abs/2310.05737"
  - label: "Mentzer et al. Finite Scalar Quantization: VQ-VAE Made Simple（arXiv 2309.15505）"
    url: "https://ar5iv.labs.arxiv.org/html/2309.15505"
  - label: "van den Oord, Vinyals, Kavukcuoglu. Neural Discrete Representation Learning（VQ-VAE，arXiv 1711.00937）"
    url: "https://ar5iv.labs.arxiv.org/html/1711.00937"
  - label: "Bengio & Bengio. Modeling High-Dimensional Discrete Data with Multi-Layer Neural Networks（NeurIPS 1999）"
    url: "https://proceedings.neurips.cc/paper/1999/file/e6384711491713d29bc63fc5eeb5ba4f-Paper.pdf"
  - label: "Ho, Jain, Abbeel. Denoising Diffusion Probabilistic Models（arXiv 2006.11239）"
    url: "https://ar5iv.arxiv.org/html/2006.11239"
  - label: "Salimans & Ho. Progressive Distillation for Fast Sampling of Diffusion Models（arXiv 2202.00512）"
    url: "https://ar5iv.labs.arxiv.org/html/2202.00512"
  - label: "Song, Dhariwal, Chen, Sutskever. Consistency Models（arXiv 2303.01469，Appendix C 没有读到）"
    url: "https://ar5iv.labs.arxiv.org/html/2303.01469"
  - label: "Fan et al. Fluid: Scaling Autoregressive Text-to-image Generative Models with Continuous Tokens（arXiv 2410.13863）"
    url: "https://arxiv.org/html/2410.13863v1"
  - label: "Geng et al. Mean Flows for One-step Generative Modeling（arXiv 2505.13447）"
    url: "https://arxiv.org/html/2505.13447v1"
---

先看三次失败。

**第一次。** 一个只有 4 个 pixel 的世界：$2\times2$ 的黑白图像，data 里只有四种 bar（上横、下横、左竖、右竖），各占 1/4。每个 pixel 是黑的 probability 都是 1/2。最省事的 model 是把四个 pixel 当成 independent，各自按 1/2 抛硬币。四个 marginal 都对，可是 sample 出来的 16 种图像各 1/16，其中只有 4 种是 bar：75% 的 sample 是 data 里从来没有的东西。Pixel 之间的 dependence 才是这个 distribution 的全部内容。

::fig[mit6s978-bars] 第一次失败。左边是 data，右边是 independent model 能产生的全部 16 种图像，框出来的 4 种才是 bar。

**第二次。** 那就把 dependence 完整写下来。Chain rule 说 $p(x_1,\dots,x_n)=\prod_i p(x_i\mid x_{<i})$，这个等式是精确的。对 $28\times28$ 的黑白 MNIST，最后一个 conditional $p(x_{784}\mid x_1,\dots,x_{783})$ 要为前面 783 个 pixel 的每一种取值存一个数，一共 $2^{783}$ 行。精确的分解不等于算得动的分解。

**第三次。** 算得动的分解有了（第 6 站的 diffusion），质量也够好，但慢。DiT-XL/2 在 ImageNet $256\times256$ 上要走 250 步，每步因为 classifier-free guidance 还要算两次 network，一张图 500 次 forward pass。VAR 只要 10 步，MeanFlow 只要 1 步（第 4、8 站）。

这门课的线索是 Kaiming He 在 Lecture 1 和 Lecture 3 里说的：所有 deep generative model 都是把一个复杂的 joint distribution 拆成若干个能处理的小 distribution，再用 neural network 去表示每一块。拆的方式由人设计（AR 的 order、diffusion 的 noising 过程），表示每一块的 mapping 由 network 学。VAE 用 independent 的 latent 加一个 decoder（第 2 站），AR 按某个 order 拆成 conditional（第 3 站），tokenizer 决定拆的单位（第 4 站），GAN 换掉了衡量两个 distribution 差距的方法（第 5 站），diffusion 和 flow matching 沿着 noise level 拆（第 6 站）。后两站是 reading session 里最新的两条线：MAR 把 AR 和 diffusion 拼在一起，去掉了 vector quantization（第 7 站）；consistency model 和 MeanFlow 把 diffusion 压到一两步（第 8 站）。

和 [MIT 6.S184](../courses/MIT-6.S184.html) 重叠的部分（ODE/SDE、flow matching loss 的推导、score function、classifier-free guidance、DiT 和 latent space）这一页不重讲，在用到的地方链接过去。这一页从第 6 站起统一用 $t=1$ 表示纯 noise、$t=0$ 表示 data（SD3、MeanFlow、DDPM 的习惯），和 6.S184 的方向相反。

## [factor] Generative model 是对 joint distribution 的分解

:::skip
快速路线必读，但很快（对应 Lecture 1 和 Lecture 3 前半）。能把一个任务写成 $p(x\mid y)$，并说清“chain rule 是精确的，approximation 来自 conditional 的 model”，就可以去第 2 站。
:::

### 什么样的问题需要 generative model

Lecture 1 先列出 generative model 的共同点：一个 input 对应很多个合格的 output；这些 output 有的更合理、有的不那么合理；training data 里未必有某个 input 的标准答案；output 往往比 input 维数高、信息多。所以要预测的不是一个答案，是一个 distribution。

课程把几乎所有任务都写成 $p(x\mid y)$：$y$ 是 condition（更抽象、信息少），$x$ 是 data（更具体、信息多）。

| 任务 | $y$ | $x$ |
|---|---|---|
| Chatbot | prompt | response |
| Text-to-image | text prompt | image |
| Class-conditional generation | class label，例如 red fox | image |
| “Unconditional” CIFAR-10 生成 | 隐含的 condition：“像 CIFAR-10 的图像” | image |
| Robot policy（Diffusion Policy） | 视觉和其他 sensor 的 observation | action 的 distribution |

最后一行和第一行是同一种问题：同一个 observation 下合理的 action 不止一个（绕障碍物从左走和从右走都行），所以 policy 要输出 distribution。Lecture 1 把 classification 也写进这张表：$y$ 是图像，$x$ 是各个 class 的 probability。Open-vocabulary recognition 和 image captioning 同样以图像为 $y$，只是合理的 $x$ 不止一个：同一张图标成 flamingo、bird、red color 都对。

Generative model 也能反过来做 discriminative 的事：Bayes rule 给出 $p(y\mid x)\propto p(x\mid y)\,p(y)$，对给定的 $x$，$p(x)$ 是 constant。反过来不行：只有 $p(y\mid x)$，得不到 $p(x)$。

### Chain rule：任何 joint 都是 conditional 的乘积

$$p(x_1,x_2,x_3,x_4)=p(x_1)\,p(x_2\mid x_1)\,p(x_3\mid x_1,x_2)\,p(x_4\mid x_1,x_2,x_3)$$

每一步只是 conditional probability 的定义 $p(a,b)=p(a)\,p(b\mid a)$ 用了三次，没有任何 approximation。拿开头的 bar 世界检验。Pixel 按 raster order 编号：$x_1$ 左上、$x_2$ 右上、$x_3$ 左下、$x_4$ 右下，黑为 1。四种 bar 是 上横 $(1,1,0,0)$、下横 $(0,0,1,1)$、左竖 $(1,0,1,0)$、右竖 $(0,1,0,1)$。

- $p(x_1=1)$：上横和左竖，$1/2$。
- $p(x_2=1\mid x_1=1)$：$x_1=1$ 的是上横（$x_2=1$）和左竖（$x_2=0$），各半，$1/2$。$x_1=0$ 时是下横和右竖，同样 $1/2$。
- $p(x_3\mid x_1,x_2)$：$(x_1,x_2)$ 的四种取值各自只对应一种 bar，所以 $x_3$ 完全确定：$(1,1)\to0$、$(1,0)\to1$、$(0,1)\to0$、$(0,0)\to1$。
- $p(x_4\mid x_1,x_2,x_3)$：同样完全确定。

::fig[mit6s978-tree] 按 raster order sample 一张图像，就是从左往右走这棵 tree。动起来时看那个点：前两层各抛一次硬币，后两层只有一条路。

乘起来检验：$p(\text{上横})=\tfrac12\cdot\tfrac12\cdot1\cdot1=\tfrac14$，和 data 一致；独立 model 给出的 $(1,1,1,1)$ 在这里是 $\tfrac12\cdot\tfrac12\cdot0=0$。

### 换一个 order、换一个 partition

Chain rule 对任何 order 都成立。换成 $(x_1,x_4,x_2,x_3)$：$p(x_1=1)=\tfrac12$；$x_1=1$ 时是上横或左竖，$x_4$ 都是 0，$x_1=0$ 时是下横或右竖，$x_4$ 都是 1，所以 $p(x_4\mid x_1)$ 是确定的；$p(x_2\mid x_1,x_4)$ 是一次 $1/2$ 的硬币；$x_3$ 再次确定。

两种 order 的总 uncertainty 一样，都是 2 bit（四种等可能的结果，$\log_24=2$），只是落在不同的步上：

| Order | 第 1 个 | 第 2 个 | 第 3 个 | 第 4 个 |
|---|---|---|---|---|
| $x_1,x_2,x_3,x_4$ | 1 bit | 1 bit | 0 | 0 |
| $x_1,x_4,x_2,x_3$ | 1 bit | 0 | 1 bit | 0 |

每一格是那一步 conditional 的 entropy。总和永远等于 joint 的 entropy，这就是 chain rule 本身。

也可以按 partition 拆：$p(x_1,x_2,x_3,x_4)=p(x_1,x_2)\,p(x_3,x_4\mid x_1,x_2)$。第一块是 $(x_1,x_2)$ 上的 uniform（四种各 1/4），第二块是确定的。Lecture 3 特意指出“任意 order”和“任意 partition”这两条，是因为第 7 站的 MAR 正是用 random order、每步预测一组 token。

### 精确不等于便宜，approximation 来自哪里

用 lookup table 表示 conditional，parameter 个数是 $1+2+4+8=15$，正好等于直接存 joint 需要的 $2^4-1=15$。Chain rule 本身一个 parameter 也没省。

省 parameter 要靠给 conditional 一个受限的形式。最简单的做法是每个 conditional 用一个 logistic regression，Frey 把它叫作 logistic autoregressive Bayesian network（LARC）：

$$p(x_i=1\mid x_{<i})=\sigma\Big(b_i+\sum_{j<i}w_{ij}x_j\Big)$$

4 个 pixel 时 parameter 是 $4+(0+1+2+3)=10$ 个；784 个 pixel 时是 $784+\tfrac{784\cdot783}{2}=307{,}720$ 个，不再是 $2^{783}$。

代价是表示能力。换一个世界：$2\times2$ 图像中所有黑 pixel 个数为偶数的 8 种（全白、全黑、四种 bar、两种 diagonal），各 1/8。这时 $x_1,x_2,x_3$ 是三个独立的硬币，$x_4=x_1\oplus x_2\oplus x_3$（parity）。Parity 不是 linearly separable 的，没有任何 $w,b$ 能让 logistic regression 表示它。直接对 8 张图做 maximum likelihood（从随机起点做 gradient descent），$w_{4j}$ 和 $b_4$ 全部收敛到 0，$p(x_4=1\mid\cdot)=1/2$。于是这个 AR model sample 出来只有 50% 是合格的图像，和完全 independent 的 model 一样差。换成一个有 hidden layer 的 MLP，就能表示 parity。这正是 reading session 第一篇 Bengio 与 Bengio（1999）做的事：每个 conditional 由一个 multi-layer network 给出，hidden unit 在不同的 conditional 之间共享，parameter 个数是 $O(n^2H)$（$H$ 是 hidden unit 数）；论文明确说 $H=0$ 时就退化成 Frey 的 LARC。

> Chain rule 不引入任何 approximation；approximation 全部来自 inductive bias：conditional 用什么 architecture、几个 conditional 是否共用 weight、选了哪个 order。

这是 Lecture 3 的原话的意思。Shared weight 是最强的一条：Transformer 用同一组 weight 表示所有 $p(x_i\mid x_{<i})$，尽管每个 conditional 在概念上是不同的 mapping。

:::wrong AR model 的 factorization 本身是一种近似，所以 order 选错会降低 likelihood
Factorization 在任何 order 下都是精确的，上面两种 order 的 entropy 总和都是 2 bit。Order 影响的是每个 conditional 有多难表示：如果某个 order 让某一步变成 parity 那样的 function，而 conditional 的 model 恰好表示不了它，likelihood 才会下降。下降来自 model class，不来自 factorization。
:::

:::from
“generative model 的共同特征”（第 11 页）、“$p(x\mid y)$ 的表格”（第 38 到 49 页）、“Bayes rule 的两个方向”（第 15 页）、“deep generative model 的组成部分”（第 36 页）来自 [Lecture 1](https://mit-6s978.github.io/assets/pdfs/lec1_intro.pdf)；chain rule、任意 order 与 partition（第 15、16 页注明是 MAR 的基础）、“decomposition 没有任何 approximation”（第 35 页）、inductive bias 的来源（第 38 到 42 页）来自 [Lecture 3](https://mit-6s978.github.io/assets/pdfs/lec3_ar.pdf) 第一部分。两讲都读的原 PDF。LARC 与 multi-layer 版本的关系来自 [Bengio 与 Bengio 1999](https://proceedings.neurips.cc/paper/1999/file/e6384711491713d29bc63fc5eeb5ba4f-Paper.pdf) 的正文。Bar 世界、conditional entropy 的表、parameter 计数、parity 的反例和它的 gradient descent 是为这一页构造和计算的。
:::

## [vae] Latent variable、ELBO 与 VQ-VAE

:::skip
快速路线里可以只读后半（K-means 与 VQ-VAE），因为 tokenizer 从这里来。VAE 的 KL closed form、reparameterization 在 [6.S184 的第 7 站](../courses/MIT-6.S184.html#arch)已经讲过。能推出 $\log p(x)=\text{ELBO}+D_{\text{KL}}$、能说出 VQ 的 straight-through 做了什么，就可以去第 3 站。
:::

### 用 latent 表示 dependence

开头的 bar 世界里，pixel 之间有 dependence，可是生成过程本身很简单：先选“哪一种 bar”（一个 latent $z$），再画出来。Lecture 1 和 2 用同样的说法描述真实图像：pose、lighting、scale 这些 latent factor 服从简单的 distribution，一个 “world model”（renderer）把它们变成 observation $x$；$z$ 简单，mapping 复杂，所以 $x$ 的 distribution 复杂。

Latent variable model：prior $p(z)$（例如 $N(0,I)$），decoder $p_\theta(x\mid z)$，marginal

$$p_\theta(x)=\int p(z)\,p_\theta(x\mid z)\,dz$$

Training 要 maximize $\log p_\theta(x)$（等价于 minimize $D_{\text{KL}}(p_{\text{data}}\,\|\,p_\theta)$）。问题是这个 integral 算不出来：$z$ 是几百维的，decoder 是 neural network。

### ELBO：不用 Jensen 的推导

Lecture 2 用的正是下面这条路（第 12 到 20 页，旁注是“for any distribution $q(z)$”“Bayes' rule”“just algebra”），全程是等式，不需要 Jensen inequality。任取一个 distribution $q(z)$。因为 $\int q(z)\,dz=1$，

$$\log p_\theta(x)=\mathbb E_{q(z)}\big[\log p_\theta(x)\big]$$

Bayes rule 给出 $p_\theta(x)=\dfrac{p_\theta(x,z)}{p_\theta(z\mid x)}$，对每个 $z$ 都成立。代进去，再分子分母同乘 $q(z)$：

$$\log p_\theta(x)=\mathbb E_{q}\Big[\log\frac{p_\theta(x,z)}{q(z)}\Big]+\mathbb E_{q}\Big[\log\frac{q(z)}{p_\theta(z\mid x)}\Big]$$

第二项是 $D_{\text{KL}}\big(q(z)\,\|\,p_\theta(z\mid x)\big)\ge0$。第一项叫 evidence lower bound（ELBO），把 $p_\theta(x,z)=p(z)\,p_\theta(x\mid z)$ 拆开，

$$\text{ELBO}=\mathbb E_q\big[\log p_\theta(x\mid z)\big]-D_{\text{KL}}\big(q(z)\,\|\,p(z)\big)$$

两项都只涉及能算的东西。结论：$\log p_\theta(x)=\text{ELBO}+D_{\text{KL}}(q\,\|\,\text{posterior})$，等式对任何 $q$ 成立，gap 恰好是 $q$ 离真正 posterior 有多远。

用一个能全部算出来的例子检验。$p(z)=N(0,1)$，$p(x\mid z)=N(z,0.25)$，观察到 $x=1$。Marginal 是 $N(0,1.25)$，

$$\log p(1)=-\tfrac12\log(2\pi\cdot1.25)-\frac{1}{2\cdot1.25}=-1.4305$$

Posterior 是 $N(0.8,\,0.2)$（Gaussian 的 conjugate 公式：mean $1/1.25$，variance $0.25/1.25$）。对 $q=N(m,s^2)$，$\mathbb E_q\log p(x\mid z)=-\tfrac12\log(2\pi\cdot0.25)-\dfrac{(1-m)^2+s^2}{2\cdot0.25}$，KL 用 [6.S184 推过的 closed form](../courses/MIT-6.S184.html#arch) $\tfrac12(s^2+m^2-1-\log s^2)$。

| $q$ | reconstruction 项 | KL 项 | ELBO | gap $=\log p-\text{ELBO}$ | $D_{\text{KL}}(q\,\|\,\text{posterior})$ |
|---|---|---|---|---|---|
| $N(0.8,0.2)$（posterior） | $-0.7058$ | $0.7247$ | $-1.4305$ | $0$ | $0$ |
| $N(1,0.2)$ | $-0.6258$ | $0.9047$ | $-1.5305$ | $0.1$ | $0.1$ |
| $N(0.8,1)$ | $-2.3058$ | $0.32$ | $-2.6258$ | $1.1953$ | $1.1953$ |
| $N(0,1)$（prior） | $-4.2258$ | $0$ | $-4.2258$ | $2.7953$ | $2.7953$ |

最后两列逐行相等。第二行的 $q$ 把 mean 往 $x$ 推，reconstruction 更好，但 KL 涨得更多。最后一行是 posterior collapse 的样子：$q$ 等于 prior，KL 项是 0，可是 $z$ 不携带任何关于 $x$ 的信息。

### VAE：一个 encoder 给每个 $x$ 一个 $q$

为每个 $x$ 单独优化一个 $q$ 太贵，VAE 让一个 encoder network 直接输出它：$q_\phi(z\mid x)=N(\mu_\phi(x),\mathrm{diag}\,\sigma_\phi^2(x))$。Lecture 2 的两个具体选择：decoder 输出 mean、固定 std 的 Gaussian 时，reconstruction 项变成 L2 loss；prior 和 encoder 都是 Gaussian 时，KL 项有 closed form。Reparameterization $z=\mu_\phi+\sigma_\phi\odot\varepsilon$ 让 gradient 穿过 sampling。这三步的推导见 [6.S184 第 7 站](../courses/MIT-6.S184.html#arch)。Generation 时从 prior 抽 $z$，decoder 是一个从 distribution 到 distribution 的 deterministic mapping。

Lecture 3 指出 VAE 的局限：它用 independent 的 latent 去产生 dependent 的 data，对高维 data 太严格；VAE 是好的 building block，单独用常常不够。

### K-means 是 EM，也是一个 autoencoder

Lecture 2 把 VAE 和 EM 放在一起：两者都在 maximize 同一类 objective，VAE 的 $q$ 是 network、用 SGD 优化；EM 的 $q$ 常常有解析形式、用 coordinate descent 交替优化（E-step 优化 $q$，M-step 优化 $\theta$，是 max-max；第 5 站的 GAN 是 max-min）。

K-means 是最简单的特例。1D data $\{0,1,4,5\}$，$K=2$，center 初始化成 0 和 1。E-step 把每个点分给最近的 center：0 给 0，1、4、5 给 1。M-step 把 center 移到各组的平均：0 和 $10/3$。再一轮 E-step：0、1 给 0，4、5 给 $10/3$；M-step：$0.5$ 和 $4.5$。再走一轮分组不变，停止。最终 reconstruction loss 是 $0.5^2\times4=1.0$。

把它读成 autoencoder：encoder 把 $x$ 映到一个 one-hot code（离哪个 center 最近），decoder 把 code 映回那个 center，loss 是 reconstruction error。Latent 是一个 $K$ 类的 categorical variable，centers 就是 codebook。当 generative model 用：抽一个 code、decode，只会得到 0.5 或 4.5 两个值。Lecture 2 的评价是“合法但很差的 generative model”，可它是理解 VQ 的模板。

### VQ-VAE：把 latent 量化成 codebook 里的 token

Continuous latent 不适合 categorical、symbolic 的 data（language、speech、planning），也难表示 multimodal 的 distribution。VQ-VAE 照 K-means 的样子做：encoder 输出 continuous 的 $z_e$，quantizer 把它换成 codebook $\{e_0,\dots,e_{K-1}\}$ 里最近的那个，

$$z_q=e_k,\qquad k=\arg\min_j\|z_e-e_j\|^2$$

decoder 从 $z_q$ 重建 $x$。

::fig[mit6s978-vq] 二维 latent 的 quantization。$z_e=(0.9,0.2)$ 到四个 codeword 的 squared distance 是 0.85、0.05、1.45、0.65，所以 $z_q=e_1=(1,0)$。

两个难处。第一，argmin 没有 gradient，reconstruction loss 传不回 encoder。解法是 straight-through：forward 用 $z_q$，backward 假装 quantizer 是 identity，把对 $z_q$ 的 gradient 原样给 $z_e$。代码写成 $z_q=z_e+\mathrm{sg}(e_k-z_e)$：forward 时数值等于 $e_k$，backward 时 $\mathrm{sg}$（stop gradient）那一项没有 gradient，只剩 $z_e$。Lecture 2 给的是 one-hot 版本的同一个技巧：$\mathrm{sg}(\mathrm{hardmax}(y)-\mathrm{softmax}(y))+\mathrm{softmax}(y)$。例如 logit $y=(2,1,0)$，forward 的值是 $(1,0,0)$，backward 用的是 $\mathrm{softmax}(y)=(0.665,0.245,0.090)$ 的 Jacobian。

第二，codebook 本身也要学。Lecture 2 第 77 页先把这一块的 regularization loss 写成 K-means 的 reconstruction loss $\|z_e-z_q\|^2$，再在脚注里给出论文实际用的写法：把这一项拆成两项，各自只让 gradient 流向一边。VQ-VAE 论文的 Eq. 3 写成要 minimize 的形式是

$$\mathcal L=-\log p(x\mid z_q)+\|\mathrm{sg}(z_e)-e_k\|^2+\beta\,\|z_e-\mathrm{sg}(e_k)\|^2$$

Decoder 取 fixed std 的 Gaussian 时，第一项就是 L2 reconstruction loss（Lecture 2 第 27 页的那一步）。第二项只更新 codebook，把 $e_k$ 拉向 $z_e$，就是 K-means 的 M-step；第三项（commitment loss）只更新 encoder，论文的说法是让 encoder“commit”到一个 codeword、output 不至于无限变大。论文所有实验用 $\beta=0.25$，并说 $\beta$ 在 0.1 到 2.0 之间结果几乎不变。拿上图的数检验：$\|z_e-e_1\|^2=0.05$，codebook 项和 commitment 项的数值都是 0.05，总共贡献 $0.05+0.25\times0.05=0.0625$；两项数值相同，区别只在 gradient 流向哪一边：codebook 项对 $e_k$ 的 gradient 是 $2(e_k-z_e)=(0.2,-0.4)$，commitment 项对 $z_e$ 的 gradient 是 $2\beta(z_e-e_k)=(-0.05,0.1)$，大小差 $1/\beta=4$ 倍。这就是脚注说的“weights the gradients differently”。

实际使用时一个 one-hot 太少，VQ-VAE 在 spatial grid 上每个位置输出一个 token：一张图变成一个 token grid。这正是 tokenizer。

:::wrong VQ-VAE 训好以后，从 codebook 里随机抽 token 再 decode，就能生成图像
VQ-VAE 的 prior 对每个位置独立：每个 token 各自 uniform。这正是开头第一次失败的情形，只是 pixel 换成了 token：每个位置的 token 单独看都合理，组合起来不像任何图像。Lecture 2 最后一页的结论是：VAE 和 VQ-VAE 都只建模了每个 token 自己的 distribution，没有建模 token 之间的 joint distribution，所以需要在 token 上再放一个 AR、masked 或 diffusion model（第 3、4、7 站）。
:::

:::edge Codebook collapse
一个 codeword 如果从来不是任何 $z_e$ 的最近点，codebook loss 对它没有 gradient，它就永远不会被用到（K-means 里空的 cluster 也是这样）。VQ 的实现因此要加 reseeding、entropy penalty 等补丁；第 4 站的 LFQ 和 FSQ 直接去掉了可学的 codebook。
:::

:::from
Latent variable model、world model 的说法（第 4 到 7 页）、不用 Jensen 的 ELBO 推导（第 12 到 22 页）、VAE 的两项与它们的 Gaussian 例子（第 23 到 28 页，KL 的 closed form 和“fixed covariance 时是 $\mu$ 上的 L2”两处标着 see pset 1）、reparameterization（第 30 页）、“autoencoding distributions”的视角、VAE 与 EM 的对比（第 50 到 55 页）、K-means 作为 autoencoder 和 generative model、VQ-VAE 的结构、regularization loss 与脚注里论文的两项（第 77 页）、straight-through 的 one-hot 写法（第 78 页）、“VQ-VAE 常用作 tokenizer”“prior 只建模单个 token”（第 79、81 页）来自 [Lecture 2](https://mit-6s978.github.io/assets/pdfs/lec2_vae.pdf) 的原 PDF；“VAE 对高维 data 太严格”来自 [Lecture 3](https://mit-6s978.github.io/assets/pdfs/lec3_ar.pdf) 第 7、8 页。VQ-VAE 的 Eq. 3、$\beta=0.25$ 与 0.1 到 2.0 的范围、commitment loss 的理由来自 [VQ-VAE 论文](https://ar5iv.labs.arxiv.org/html/1711.00937) 第 3.2 节。Gaussian 例子的表、K-means 的数值迭代、VQ 的数值例子和两项 gradient 的数是为这一页算的。
:::

## [ar] Autoregressive model 与 teacher forcing

:::skip
快速路线必读（对应 Lecture 3 后两部分）。能写出 teacher forcing 的 loss、画出 causal mask 并解释 target 为什么错开一位，就可以去第 4 站。
:::

### Inference：一次 sample 一个

“Auto” 是把自己的 output 当作后面的 input，“regression” 是估计变量之间的关系。Sampling 就是第 1 站那棵 tree：先从 $p(x_1)$ 抽 $x_1$，再从 $p(x_2\mid x_1)$ 抽 $x_2$，一直到 $x_n$。每一步的 input 比上一步多一个。

Lecture 3 强调：autoregressive 说的是 inference 的方式，不规定 architecture；$x$ 也不必是天然的 sequence，可以是 vector 的各维、2D 或 3D 的 array。Output 可以是 discrete（像 classification，用 softmax）也可以是 continuous。

### Training：teacher forcing

最直接的想法是像 inference 那样一步步 sample 出整张图，再和 data 比。Lecture 3 指出这走不通：$x_6$ 的 gradient 要穿过前面所有的 output、所有的 sampling 操作（sampling 不可导）和所有的 network。

Teacher forcing：每个 conditional 的 input 用 ground truth，而不是自己 sample 出来的值。Loss 是 negative log-likelihood，

$$\mathcal L(\theta)=-\sum_{i=1}^n\log p_\theta\big(x_i\mid x_1,\dots,x_{i-1}\big),\qquad x\sim p_{\text{data}}$$

每一项只依赖 data，gradient 路径只有一层 network。用 bar 世界检验：完美的 model 对任何一张 bar 的 loss 是 $-\log_2(\tfrac12)-\log_2(\tfrac12)-\log_21-\log_21=2$ bit，正好是 data 的 entropy，没有 model 能低于它。

代价是 training 和 inference 不一致：training 时 model 永远只看见正确的 prefix，从来没见过自己犯的错。

:::edge Model 从没见过的 prefix
假设学到的 $p(x_3=1\mid x_1=1,x_2=1)$ 是 0.1 而不是 0。Sampling 时 10% 的上横会在 $x_3$ 处出错，得到 prefix $(1,1,1)$。Training data 里没有任何一张图以 $(1,1,1)$ 开头，$p(x_4\mid1,1,1)$ 在 training 时从来没被监督过，它输出什么都有可能，而这个错误不会被后面的步骤纠正。序列越长，这样的机会越多。这就是 teacher forcing 带来的 distribution shift。
:::

### 一个 network 同时算出所有 conditional

$n$ 个 conditional 如果用 $n$ 个 network，parameter 和计算都太多。Lecture 3 的要求是：用同一个 network、同一组 weight、同一次 forward 算出全部 conditional。条件只有一个：output 的第 $i$ 个位置不能依赖 input 的第 $i$ 个及以后的位置。然后把 target 错开一位：位置 $i$ 的 output 被训练去预测 $x_{i+1}$。

三种 architecture 都能满足这个条件：

- RNN：天然只看过去，按时间展开，每一步预测下一个。例子是 char-RNN。
- CNN：用 causal convolution，kernel 只覆盖当前和过去的位置（等价于在左边 padding）。例子是 WaveNet，用 dilated causal convolution 生成 raw audio。在 2D 图像上，同样的想法就是 PixelCNN 的 masked convolution（pset 2 要从零实现，type A 与 type B 两种 mask 见本页最后的作业一节，masked kernel 的画法见 [CS5788 的 autoregressive 一站](../courses/CORNELL-CS5788.html#ar)）。
- Transformer：用 causal attention。Attention score $s_{ij}=q_i^\top k_j/\sqrt{d}$ 在 softmax 之前，把所有 $j>i$ 的 entry 设成 $-\infty$，softmax 后这些 weight 恰好是 0。例子是 image GPT，把 pixel 当 sequence。

::fig[mit6s978-mask] 深色格表示 query（行）能看见 key（列）。Full attention 每个位置都看见全部；causal 是下三角；第三张是第 4 站 VAR 用的 block-causal，先预告。

用 causal mask 的一行检验。3 个 token、score 都是 0 时，没有 mask 的第 1 行 softmax 是 $(\tfrac13,\tfrac13,\tfrac13)$；mask 之后第 1 行是 $(0,-\infty,-\infty)$，softmax 是 $(1,0,0)$：位置 1 只看见自己，它的 output 只能依赖 $x_1$，拿去预测 $x_2$ 合法。

:::wrong Training 时用 full attention 也可以，反正 inference 时再加 mask
Full attention 下位置 $i$ 的 output 能看见 $x_{i+1}$，而 target 正是 $x_{i+1}$。最省事的解是把它直接抄过去，training loss 降到 0，network 什么 distribution 也没学。Inference 时 $x_{i+1}$ 还不存在，这个 network 无从下手。Mask 必须在 training 和 inference 一致，这正是“output $i$ 不依赖 input $\ge i$”这条要求的意思。（第 7 站的 MAR 用 bidirectional attention 是另一回事：它不靠错开一位，而是把要预测的 token 从 input 里 mask 掉。）
:::

### 直接在 pixel 上做 AR 有多慢

一张 $256\times256$ 的 RGB 图像有 $256\times256\times3=196{,}608$ 个 value。按 pixel 做 AR，sampling 要走 196,608 个 sequential step，而且 Transformer 的 attention 长度也是这么多。这就是为什么后来的 AR 都先用 tokenizer 把图像压成几百个 token（第 4 站），以及为什么有人想办法一步生成不止一个 token（第 4 站的 VAR、第 7 站的 MAR）。

:::from
“auto + regression”的解释、inference 与 training 的区分、为什么不能 backprop through inference、teacher forcing 的利弊、“与 architecture 无关”、shared computation 的条件与 target 错开一位、RNN / causal CNN / causal attention 三种实现和 char-RNN、WaveNet、iGPT 三个例子都来自 [Lecture 3](https://mit-6s978.github.io/assets/pdfs/lec3_ar.pdf) 的原 PDF（第 31 到 107 页；shared computation 的条件在第 73、74 页，causal attention 在第 97、98 页画的是连线图，没有画成 mask 矩阵）。Lecture 3 的 running example 是按 raster order 在 MNIST 上做 AR（第 58 到 63 页），pset 2 的 PixelCNN 就在这个设定上。Bar 世界上的 loss、没见过的 prefix 的例子、mask 的矩阵画法和数值检验、pixel 数的计算是为这一页写的。
:::

## [tok] Tokenizer 与 next-scale prediction

:::skip
快速路线必读，这是 reading session “AR and Tokenizers”的内容。能算 token 数、写出 LFQ 的 index、说出“reconstruction 好不等于 generation 好”的两个数据点，并解释 VAR 省下的是 sequential step，就可以去第 5 站。VAR 的 scaling law 那一小节可以跳。
:::

### Tokenizer 决定 AR 在什么上面做

Stride 16 的 tokenizer 把 $256\times256$ 的图像变成 $16\times16=256$ 个 token，每个 token 概括原图一块 $16\times16\times3=768$ 个 value。AR 的步数从 196,608 降到 256。

Tokenizer 的 encoder、decoder 是 VQ-VAE 的结构，但只用 L2 reconstruction 的 VQ-VAE 重建得模糊。Lecture 4 的最后一部分讲了实际用的版本：VQ-GAN = VQ-VAE + adversarial loss + perceptual loss（adversarial loss 见第 5 站）。去掉 VQ，同样的配方就是 Stable Diffusion 用的 KL-regularized autoencoder。Lecture 4 的说法是：有 VQ 的版本喂给 AR model，没有 VQ 的版本喂给 diffusion model，两者都是事实上的标准 image tokenizer。

### Codebook 大小的两难

Token 是 discrete 的，AR model 在每个位置做一次 $K$ 类 classification。Codebook 大一些，每个 token 能携带的信息多，reconstruction 应该更好。MAGVIT-v2 的 Figure 1 在 ImageNet $128\times128$ 上测了这一点：用普通 VQ 时，reconstruction FID 随 vocabulary 增大一直变好，generation FID 却只在小 vocabulary 时变好，之后反而变差。论文指出大多数 visual language model 只用 1k 到 8k 个 token，远小于 natural language 的 200k 以上。

MAGVIT-v2 的解法叫 lookup-free quantization（LFQ）：把 codebook 的 embedding 维数降到 0，latent 的每一维直接取 sign，

$$q(z_i)=\mathrm{sign}(z_i)\in\{-1,+1\},\qquad \text{Index}(z)=\sum_{i=1}^{\log_2K}2^{i-1}\,\mathbb 1[z_i>0]$$

例如 4 维的 $z=(0.3,-1.2,0.7,-0.1)$，量化成 $(+1,-1,+1,-1)$，index 是 $1\cdot1+0\cdot2+1\cdot4+0\cdot8=5$。没有可学的 codebook，也就没有 codebook collapse。为了让 token 被均匀使用，加一个 entropy penalty

$$\mathcal L_{\text{entropy}}=\mathbb E\big[H(q(z))\big]-H\big[\mathbb E\,q(z)\big]$$

第一项要每个 sample 的分配都很确定，第二项要整个 codebook 的平均使用尽量均匀。论文默认 $K=2^{18}=262{,}144$，这时 reconstruction 和 generation 都随 vocabulary 增大而变好。在 $2^{18}$ 类上做 softmax 太大，AR model 把它拆成两个 $2^9=512$ 类的 head 分别预测。

FSQ（finite scalar quantization，reading session 的选读）把同一思路推广到每维多于 2 个值。Latent 先投影到很少的几维（论文说通常 $d<10$，VQ 常用 $d\ge512$），每一维先过一个 bounded function 再 round 到 integer。第 $i$ 维有 $L_i$ 个 level 时，论文给的例子是 $f(z)=\lfloor L/2\rfloor\tanh(z)$（$L$ 为奇数时 round 后正好落在 $L$ 个 integer 上），codebook 是各维取值集合的 Cartesian product，大小 $\prod_iL_i$，没有任何要学的 codeword。LFQ 相当于每维只有 2 个 level。

拿上面同一个 $z=(0.3,-1.2,0.7,-0.1)$ 检验，每维取 $L=5$：$2\tanh(z)=(0.583,-1.667,1.209,-0.199)$，round 成 $(1,-2,1,0)$，codebook 大小 $5^4=625$。论文的 Table 1 给出凑某个 codebook 大小时推荐的 level：$2^8$ 用 $[8,6,5]$，$2^{10}$ 用 $[8,5,5,5]$（实际大小 $8\cdot5\cdot5\cdot5=1000$），$2^{12}$ 用 $[7,5,5,5,5]$，$2^{14}$ 用 $[8,8,8,6,5]$，$2^{16}$ 用 $[8,8,8,5,5,5]$；论文的 MaskGIT 实验用的就是 $[8,5,5,5]$。论文强调 FSQ 不会 codebook collapse，不需要 VQ 的那一套补丁（commitment loss、codebook reseeding、code splitting、entropy penalty），所有 codeword 都会被用到。

### Reconstruction 好不等于 generation 好

两组数据。MAR 论文的 Table 2，同一个 generator（MAR-L 加 Diffusion Loss），只换 tokenizer：

| Tokenizer | reconstruction FID | generation FID（无 CFG / 有 CFG） |
|---|---|---|
| VQ-16 | 5.87 | 7.82 / 3.64 |
| KL-16（LDM 的） | 1.43 | 3.50 / 1.98 |
| KL-8 | 1.20 | 4.33 / 2.05 |
| Consistency Decoder | 1.30 | 5.76 / 3.23 |
| KL-16（在 ImageNet 上重训） | 1.22 | 2.85 / 1.97 |

Consistency Decoder 的 reconstruction 比 LDM 的 KL-16 好，generation 却差很多。SD3 论文的 Table 3 是另一个方向：autoencoder 的 latent channel 从 4 增加到 16，reconstruction FID 从 2.41 降到 1.06；但 16 channel 的 latent 更难预测，小 model 上 16 channel 反而吃亏，depth 到 22 左右差距才消失。SD3 最终选 16 channel，是为了给大 model 留出质量的上限。

:::wrong Tokenizer 的 reconstruction 越好，生成就越好
上表里 Consistency Decoder 的 reconstruction FID（1.30）好于 KL-16（1.43），generation FID 却是 5.76 对 3.50。Generator 学的是 latent 的 distribution：latent 越难学（channel 多、distribution 不规整、信息排列不利于 generator），同样大小的 generator 学得越差。Reconstruction 只决定上限，能不能接近上限取决于 latent 好不好学。
:::

### Next-scale prediction（VAR）

把 $16\times16$ 的 token grid 按 raster order 拉成一行，VAR 论文列出了几个问题：VQ-VAE 的 feature 本来就是双向相关的，拉平后强加了“只依赖前面”的假设；上下相邻的 token 在 sequence 里隔了 16 个位置，spatial locality 被破坏；以及要走 $n^2$ 步。

VAR 换了 AR 的单位：从 next token 换成 next scale。

$$p(r_1,\dots,r_K)=\prod_{k=1}^Kp(r_k\mid r_1,\dots,r_{k-1})$$

$r_k$ 是第 $k$ 个 scale 的整张 token map，从 $1\times1$ 逐步到 $16\times16$；同一个 scale 里的 token 在一步里并行生成。Tokenizer 也要相应改成 multi-scale：对同一张 $16\times16$ 的 feature map，先缩到 $1\times1$ 量化，放大回 $16\times16$ 并减掉，残差缩到 $2\times2$ 再量化，依此类推；所有 scale 共用一个 $V=4096$ 的 codebook。Decode 时把各 scale 放大后的 embedding 加起来。Training 用 block-causal mask（上一张图的第三个 panel）：同一个 scale 内互相看见，只看见更粗的 scale。

::fig[mit6s978-var] VAR 在 $256\times256$ 上的 10 个 scale。列表取自官方代码的默认值 `patch_nums=(1, 2, 3, 4, 5, 6, 8, 10, 13, 16)`（论文正文只说“逐步增大到 $h\times w$”）。

10 步共 $1+4+9+16+25+36+64+100+169+256=680$ 个 token。VAR 省下了什么？按两种方式数 attention 的计算量（数的是 query–key pair 的个数）：

| | raster AR（256 个 token） | VAR（680 个 token） |
|---|---|---|
| Sequential step | 256 | 10 |
| 没有 KV cache：每步重算全部 attention | $\sum_{i=1}^{256}i^2=5{,}625{,}216$ | $\sum_k(\text{前 }k\text{ 个 scale 的 token 数})^2=743{,}654$ |
| 有 KV cache：每步只算新 token 的 query | $\sum_{i=1}^{256}i=32{,}896$ | $\sum_k(\text{第 }k\text{ 个 scale 的 token 数})\times(\text{累计 token 数})=286{,}434$ |

论文里的 $O(n^6)$ 对 $O(n^4)$ 是第二行的数法（$\sum_{i=1}^{n^2}i^2=\tfrac16n^2(n^2+1)(2n^2+1)$，$n=16$ 时正是 5,625,216）。实际 inference 都用 KV cache（VAR 论文也说 inference 用 KV cache），这时 VAR 的总计算反而多，因为它要生成 680 个 token。VAR 快的原因是第一行：sequential step 从 256 降到 10，每一步里大量 token 并行，GPU 吃得满。

结果（ImageNet $256\times256$，论文 Table 1）：

| Model | parameter | FID | step | 相对时间 |
|---|---|---|---|---|
| VAR-d16 | 310M | 3.30 | 10 | 0.4 |
| VAR-d20 | 600M | 2.57 | 10 | 0.5 |
| VAR-d24 | 1.0B | 2.09 | 10 | 0.6 |
| VAR-d30 | 2.0B | 1.92 | 10 | 1 |
| DiT-XL/2 | 675M | 2.27 | 250 | 45 |

同一张表里普通的 VQGAN raster AR 是 FID 18.65。

### Scaling law

:::skip
这一小节是 VAR 的 scaling 结果，跳过的话只少了“image AR 的 test loss 也随 parameter 呈 power law”这一个事实。
:::

VAR 训了 depth 6 到 30（18.5M 到 2.0B parameter）一系列 model。最后一个 scale 的 test loss 对 parameter 数 $N$ 拟合成 power law，exponent 是 $-0.23$，correlation 0.9993。读成数字：$N$ 翻倍，loss 乘 $2^{-0.23}=0.853$，降 14.7%；从 18.5M 到 2.0B（约 108 倍），loss 乘 $108^{-0.23}=0.34$。论文对 compute 也拟合了 exponent 约 $-0.13$ 到 $-0.16$ 的 power law（正文公式和图里的常数有不一致的地方，这里只引 exponent）。第 7 站的 Fluid 会给出相反的一面：不是所有 AR 变体都能一直 scale 下去。

:::from
Tokenizer 喂给 AR 和 diffusion 的分工、VQ-GAN = VQ-VAE + adversarial + perceptual 来自 [Lecture 4](https://mit-6s978.github.io/assets/pdfs/lec4_gan.pdf) 第 90 到 92 页（原 PDF）。Codebook 大小的两难、LFQ 的 formula、entropy penalty、$2^{18}$ 与两个 $2^9$ 的 head 来自 [MAGVIT-v2](https://arxiv.org/abs/2310.05737) 正文（上一次读的工具转述，Figure 1 的具体数值至今没有读到）。FSQ 的 formula、$d<10$、推荐 level 的表和“不需要的补丁”来自 [FSQ 论文](https://ar5iv.labs.arxiv.org/html/2309.15505) 第 1 到 3 节和 Table 1。Tokenizer 对比表来自 [MAR](https://arxiv.org/html/2406.11838v2) Table 2（这次对着 arXiv HTML 逐格核过），channel 的结果来自 [SD3](https://arxiv.org/abs/2403.03206) Table 3（工具转述）。VAR 的 formulation、multi-scale quantization、复杂度证明、Table 1、scaling exponent 来自 [VAR](https://arxiv.org/abs/2404.02905) 正文（工具转述）；scale 列表、$V=4096$ 和 block-causal mask 的条件（key 的 scale 不超过 query 的 scale）对着 [官方代码](https://github.com/FoundationVision/VAR) 的 `models/var.py`、`models/__init__.py` 核过。这几篇都在 reading session “AR and Tokenizers”的清单里（MAGVIT-v2、VAR 是必读，FSQ 是选读）。LFQ 与 FSQ 的数值例子、680 个 token 和两种 attention 计数是为这一页算的，“有 KV cache 时 VAR 总计算更多”是我自己的结论，论文没有这样比。
:::

## [gan] GAN 与 adversarial loss

:::skip
快速路线可以整站跳过（调研条目的建议），代价是少了 GAN 的思路和第 4 站 VQ-GAN 里 adversarial loss 的来历，对动手做 diffusion 或 AR 影响小。只读最后一小节“adversary 当 loss 用”也可以。
:::

### 换一个衡量 distribution 差距的方法

Lecture 4 从 VAE 的毛病说起：reconstruction loss（L2 或 Bernoulli）假设 pixel 之间 independent、每个 pixel 是简单的 distribution，对高维 data 太严格，所以 VAE 的 sample 模糊。能不能不写出 likelihood，换一种方法量两个 distribution 差多远？

GAN 的回答：train 一个 network 来量。Generator $G$ 把 noise $z\sim p_z$ 变成 sample $G(z)$，discriminator $D$ 判断一个 sample 是真的还是生成的：

$$\min_G\max_D\;V(D,G)=\mathbb E_{x\sim p_{\text{data}}}\big[\log D(x)\big]+\mathbb E_{z\sim p_z}\big[\log\big(1-D(G(z))\big)\big]$$

D-step 固定 $G$，$D$ 就是一个 binary logistic regression（sigmoid 加 cross-entropy），把真 data 推向 1、生成的推向 0。G-step 固定 $D$，让 $G$ 的 sample 被判成真的。两步交替做 SGD。

### Optimal discriminator 与 JS divergence

固定 $G$，记 $p_g$ 为 $G(z)$ 的 distribution。$V$ 写成对 $x$ 的 integral：

$$V=\int\Big[p_{\text{data}}(x)\log D(x)+p_g(x)\log\big(1-D(x)\big)\Big]dx$$

对每个 $x$ 单独 maximize。记 $a=p_{\text{data}}(x)$、$b=p_g(x)$，对 $D$ 求导：$\dfrac aD-\dfrac{b}{1-D}=0$，得

$$D^*(x)=\frac{p_{\text{data}}(x)}{p_{\text{data}}(x)+p_g(x)}$$

例如某个 $x$ 处 $p_{\text{data}}=0.3$、$p_g=0.1$，$D^*=0.75$。代回 $V$，并在两个 log 里各乘、除一个 2：

$$V(D^*,G)=\int p_{\text{data}}\log\frac{p_{\text{data}}}{(p_{\text{data}}+p_g)/2}+\int p_g\log\frac{p_g}{(p_{\text{data}}+p_g)/2}-2\log2$$

记 $m=(p_{\text{data}}+p_g)/2$，前两项是 $D_{\text{KL}}(p_{\text{data}}\,\|\,m)+D_{\text{KL}}(p_g\,\|\,m)=2D_{\text{JS}}(p_{\text{data}}\,\|\,p_g)$，所以

$$V(D^*,G)=-\log4+2\,D_{\text{JS}}(p_{\text{data}}\,\|\,p_g)$$

$D_{\text{JS}}\ge0$，等号当且仅当 $p_g=p_{\text{data}}$：global optimum 就是生成的 distribution 等于 data。Lecture 4 列出 JS 相对 KL 的性质：对称，取值在 $[0,\log2]$ 内（KL 可以到无穷）。

### Non-saturating loss

Training 初期 $G$ 很差，$D$ 一眼看穿，$D(G(z))$ 接近 0。写 $D=\sigma(a)$，$a$ 是 $D$ 的 logit。原始的 G loss $\log(1-\sigma(a))$ 对 $a$ 的 derivative 是 $-\sigma(a)$；$a=-4.6$ 时 $D=0.00995$，gradient 只有 $0.00995$。换成 maximize $\log D(G(z))=\log\sigma(a)$，derivative 是 $1-\sigma(a)=0.990$，大了约 100 倍。两种 loss 的最优点相同，只是在 $G$ 最差的时候 gradient 的大小差两个数量级。

### JS 给不出 gradient 的时候

Lecture 4 列的 GAN training 问题：equilibrium 很难达到，loss 震荡；gradient 消失；mode collapse（$G$ 只产生少数几种 output）。其中 gradient 消失可以算出来。

Lecture 4 用一个例子把它算出来（第 47 到 51 页）：两个很窄的 Gaussian 拉开 $\Delta\mu=4,3,2$，三种情况下 $D_{\text{JS}}$ 都是 0.693；最极端的情形是把它们收窄成 delta function。Data 是 $p=\delta_0$，generator 是 $q_\theta=\delta_\theta$。$\theta\ne0$ 时两个 support 不重叠，在 $x=0$ 处 $m=\tfrac12\delta_0$，$\log\frac{p}{m}=\log2$；在 $x=\theta$ 处同理。所以 $D_{\text{JS}}=\tfrac12\log2+\tfrac12\log2=\log2$，对任何 $\theta\ne0$ 都一样，对 $\theta$ 的 gradient 是 0。只有 $\theta=0$ 时才跳到 0。高维 data 集中在低维的 manifold 上，training 初期 $p_g$ 和 $p_{\text{data}}$ 几乎不重叠，情形和这个例子很像。

Wasserstein distance（earth mover's distance）量的是把一堆质量搬成另一堆要做多少功：质量乘以搬运距离。把 $\delta_\theta$ 搬到 $\delta_0$，质量 1，距离 $|\theta|$，所以 $W_1=|\theta|$，对 $\theta$ 的 derivative 是 $\mathrm{sign}(\theta)$，一直指向正确的方向。

一维时 Lecture 4 给了一个能直接算的 formula（第 62 页）：

$$W_1(p,q)=\int\big|\mathrm{cdf}_p(x)-\mathrm{cdf}_q(x)\big|\,dx$$

离散时 integral 换成 sum。拿 delta 的例子检验（设 $\theta>0$）：$\delta_0$ 的 cdf 在 $x=0$ 处从 0 跳到 1，$\delta_\theta$ 的 cdf 在 $x=\theta$ 处跳；两者只在 $[0,\theta)$ 上不同，差是 1，integral 是 $1\times\theta=\theta$，和“搬运距离”的算法一致。第 64 页把两条曲线画在一起：$\Delta\mu\ne0$ 时 $D_{\text{JS}}$ 是一条 0.693 的水平线，$W_1=|\Delta\mu|$ 是一个 V 字。

::fig[mit6s978-jsw] 同一个例子画出来。动起来时看两个点：generator 的 delta 一路靠近 0，JS（彩色点）始终停在 $\log2\approx0.69$，直到重合才跳下来；$W_1$（黑点）沿着直线一路下降。

高维时 $W_1=\inf_{\gamma}\mathbb E_{(x,y)\sim\gamma}\|x-y\|$，inf 取遍 marginal 是 $p$ 和 $q$ 的 joint distribution $\gamma$，直接算不出来。Kantorovich–Rubinstein duality 把它换成

$$W_1(p,q)=\sup_{\|f\|_L\le1}\;\mathbb E_{x\sim p}f(x)-\mathbb E_{x\sim q}f(x)$$

sup 取遍所有 1-Lipschitz function。WGAN 用一个 network $f_w$ 近似这个 $f$（叫 critic），objective 是 $\max_{w}\ \mathbb E_{x\sim p_{\text{data}}}f_w(x)-\mathbb E_{x\sim p_g}f_w(x)$，把 weight clip 到 $[-0.01,0.01]$ 来粗略保证 Lipschitz。和原来的 D-step $\max_D\ \mathbb E\log D(x)+\mathbb E\log(1-D(x))$ 并排放（第 73 页），差别正是两处：log 去掉了，weight 被 clip。Lecture 4 的总结：对工程师来说，WGAN 就是去掉 log、clip weight；原来的 $D$ 是只说真假的鉴定专家，critic 输出一个分数，给出改进的方向。Duality 在离散情形下是一个 linear program 的 primal 与 dual，pset 3 的 Problem 5 要你用 Lagrange multiplier 推出来。

:::wrong Discriminator 的 loss 降到 0，说明 training 进展顺利
$D$ 完美地分开真假，意味着 $D(G(z))\approx0$，对应上面 $p_g$ 和 $p_{\text{data}}$ 不重叠的情形：原始 G loss 的 gradient 是 $-\sigma(a)\approx0$，$G$ 学不到东西。$D$ 太强和太弱都不行，GAN training 的困难正在于让两者保持平衡。
:::

### Adversary 当 loss 用

GAN 的 adversarial loss 可以接在任何 generator 后面，input 不必是 random noise。Lecture 4 的模式是：input 来自别处，经过 encoder–decoder，loss 是 L2/L1 reconstruction 加 adversarial loss，两者交替 train；有 reconstruction loss 托底，training 稳定很多。例子：SRGAN（super-resolution，加了 adversarial loss 后 PSNR 变差、视觉质量变好）、pix2pix、CycleGAN，以及第 4 站的 VQ-GAN。Reading session 里的 “Distilling Diffusion Models into Conditional GANs” 把 diffusion model 的多步 sampling 蒸馏成一个一步的 GAN generator，第 8 站会回到一步生成这个问题。

:::from
从 VAE 的局限引出 GAN（第 7 页）、minimax、D-step 是 logistic regression（第 16 页）、non-saturating 的 flip trick 与“早期 $D(G)$ 接近 0”的图（第 22 页）、optimal $D$ 与 $2D_{\text{JS}}-2\log2$（第 30、32 页，证明指向 Goodfellow et al. 2014）、JS 的性质、training 的三类问题（第 42 页）、WGAN 的“三种说法”、delta 的例子与 JS、$W_1$ 的对比（第 47 到 64 页）、一维 $W_1$ 的 cdf formula（第 62 页）、KR duality、WGAN 的 objective 与 weight clipping 的 $[-0.01,0.01]$（第 67 到 73 页）、adversary as loss 的模式和例子来自 [Lecture 4](https://mit-6s978.github.io/assets/pdfs/lec4_gan.pdf) 的原 PDF。Minimax 的写法和 pset 3 handout 的 Eq. 1 一致。$D^*$ 的推导步骤、$D^*$ 的数值例子、non-saturating 的 gradient 数值、delta 例子的逐步计算和 cdf 的检验是为这一页写和算的。
:::

## [diff] Diffusion 与 flow matching 的设计空间

:::skip
快速路线必读（Lecture 5 加 reading session 的 Diffusion、Flow Matching 1/2）。Flow matching 和 score matching 的基本推导在 [6.S184](../courses/MIT-6.S184.html#fm)，这里不重复。能写出 DDPM 被丢掉的 weight、在 $x$/$\varepsilon$/$v$ 之间换算、算出 resolution shift，就可以去第 7 站。EBM 那一小节可以跳。
:::

### DDPM 是 encoder 固定的 hierarchical VAE

Lecture 5 的讲法是从 VAE 出发。Forward process 是一串固定的 Gaussian：

$$x_t=\sqrt{1-\beta_t}\,x_{t-1}+\sqrt{\beta_t}\,\varepsilon_t,\qquad t=1,\dots,T$$

系数这样取是为了 variance preserving：若 $\mathrm{Var}(x_{t-1})=1$，则 $\mathrm{Var}(x_t)=(1-\beta_t)+\beta_t=1$。加 Gaussian noise 在 density 上就是和 Gaussian 做 convolution。记 $\alpha_t=1-\beta_t$、$\bar\alpha_t=\prod_{s\le t}\alpha_s$，可以一步跳到任意 $t$：$x_t=\sqrt{\bar\alpha_t}\,x_0+\sqrt{1-\bar\alpha_t}\,\varepsilon$。DDPM 的 linear schedule（$\beta$ 从 $10^{-4}$ 线性增加到 $0.02$，$T=1000$）下，$\bar\alpha_{100}=0.897$，$\bar\alpha_{500}=0.0786$，$\bar\alpha_{1000}=4.0\times10^{-5}$：到最后几乎只剩 noise。

Reverse 的 conditional $q(x_{t-1}\mid x_t)$ 依赖 data 的 distribution，不知道（Lecture 5 第 28、29 页的图：同一个 $x_t$ 可能来自好几个不同的 $x_{t-1}$，各占多少取决于 data）。多加一个 condition $x_0$ 之后，它是一个已知的 Gaussian（第 37 页，DDPM 论文 Eq. 6、7）：

$$q(x_{t-1}\mid x_t,x_0)=N\big(\tilde\mu_t(x_t,x_0),\,\tilde\beta_tI\big),\qquad\tilde\beta_t=\frac{1-\bar\alpha_{t-1}}{1-\bar\alpha_t}\,\beta_t$$

$$\tilde\mu_t(x_t,x_0)=\frac{\sqrt{\bar\alpha_{t-1}}\,\beta_t}{1-\bar\alpha_t}\,x_0+\frac{\sqrt{\alpha_t}\,(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}\,x_t$$

Lecture 只说它是“dependency graph 加若干 linear combination 的结果”，配方的推导见 [CS5788 的 diffusion 一站](../courses/CORNELL-CS5788.html#diff)。用 network 表示 $p_\theta(x_{t-1}\mid x_t)=N(\mu_\theta(x_t,t),\sigma_t^2I)$。ELBO（第 53 页叫 variational lower bound）拆成

$$\mathcal L_{\text{VLB}}=L_T+L_{T-1}+\dots+L_0$$

$$L_T=D_{\text{KL}}\big(q(x_T\mid x_0)\,\|\,p(x_T)\big),\qquad L_0=-\log p_\theta(x_0\mid x_1)$$

$$L_{t-1}=D_{\text{KL}}\big(q(x_{t-1}\mid x_t,x_0)\,\|\,p_\theta(x_{t-1}\mid x_t)\big)$$

$L_T$ 里没有 parameter；$L_0$ 像 VAE 的 reconstruction loss；中间每个 $t$ 一项 KL。这就是一个有 $T$ 层 latent 的 VAE，区别只在 encoder（forward process）是固定的，不用学（第 51 页：没有 VAE 的 $q_\phi$ 那样的 parameter）。

两个 variance 相同的 Gaussian 的 KL：

$$D_{\text{KL}}\big(N(\mu_1,\sigma^2)\,\|\,N(\mu_2,\sigma^2)\big)=\mathbb E_{x\sim N(\mu_1,\sigma^2)}\Big[\frac{(x-\mu_2)^2-(x-\mu_1)^2}{2\sigma^2}\Big]$$

展开分子：$(x-\mu_2)^2-(x-\mu_1)^2=2x(\mu_1-\mu_2)+\mu_2^2-\mu_1^2$，取 expectation（$\mathbb Ex=\mu_1$）得 $2\mu_1^2-2\mu_1\mu_2+\mu_2^2-\mu_1^2=(\mu_1-\mu_2)^2$。所以 KL 就是 $\dfrac{\|\mu_1-\mu_2\|^2}{2\sigma^2}$，一个 L2 loss。Lecture 5 第 45 页把一般的 formula 放在旁边，标注“pset 1”（pset 1 Problem 3 推的是它在 $N_2=N(0,I)$ 时的特例）：

$$D_{\text{KL}}(N_1\,\|\,N_2)=\log\frac{\sigma_2}{\sigma_1}+\frac{\sigma_1^2+\|\mu_1-\mu_2\|^2}{2\sigma_2^2}-\frac12$$

令 $\sigma_1=\sigma_2=\sigma$：$\log1=0$，$\dfrac{\sigma^2}{2\sigma^2}-\dfrac12=0$，只剩 $\dfrac{\|\mu_1-\mu_2\|^2}{2\sigma^2}$，和上面的展开一致。

把 mean 写成 noise 的形式。由 $x_t=\sqrt{\bar\alpha_t}\,x_0+\sqrt{1-\bar\alpha_t}\,\varepsilon$ 得 $x_0=\big(x_t-\sqrt{1-\bar\alpha_t}\,\varepsilon\big)/\sqrt{\bar\alpha_t}$，代进 $\tilde\mu_t$ 的第一项，并用 $\sqrt{\bar\alpha_{t-1}}/\sqrt{\bar\alpha_t}=1/\sqrt{\alpha_t}$：

$$\frac{\sqrt{\bar\alpha_{t-1}}\,\beta_t}{1-\bar\alpha_t}\,x_0=\frac{\beta_t}{(1-\bar\alpha_t)\sqrt{\alpha_t}}\,x_t-\frac{\beta_t}{\sqrt{\alpha_t}\,\sqrt{1-\bar\alpha_t}}\,\varepsilon$$

$x_t$ 的总系数是 $\dfrac{\beta_t+\alpha_t(1-\bar\alpha_{t-1})}{(1-\bar\alpha_t)\sqrt{\alpha_t}}$，分子 $=1-\alpha_t+\alpha_t-\alpha_t\bar\alpha_{t-1}=1-\bar\alpha_t$，所以系数是 $1/\sqrt{\alpha_t}$：

$$\tilde\mu_t=\frac{1}{\sqrt{\alpha_t}}\Big(x_t-\frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\,\varepsilon\Big)$$

Lecture 5 第 37 页这一行把括号前的系数印成了 $1/\sqrt{\bar\alpha_t}$；按上面三行算是 $1/\sqrt{\alpha_t}$，和 DDPM 论文 Eq. 11、Algorithm 2（第 62 页）、pset 4 handout 一致。Network 照样子写 $\mu_\theta=\dfrac{1}{\sqrt{\alpha_t}}\Big(x_t-\dfrac{\beta_t}{\sqrt{1-\bar\alpha_t}}\varepsilon_\theta(x_t,t)\Big)$。两者相减只剩 noise 那一项：

$$D_{\text{KL}}=\underbrace{\frac{\beta_t^2}{2\sigma_t^2\,\alpha_t\,(1-\bar\alpha_t)}}_{\lambda_t}\,\big\|\varepsilon-\varepsilon_\theta(x_t,t)\big\|^2$$

DDPM 把 $\lambda_t$ 设成 1，Lecture 5 说这一步“critical”。为什么重要？取 $\sigma_t^2=\beta_t$，$\lambda_t=\dfrac{\beta_t}{2\alpha_t(1-\bar\alpha_t)}$，在 linear schedule 下：

| $t$ | 1 | 10 | 100 | 500 | 1000 |
|---|---|---|---|---|---|
| $\lambda_t$ | 0.500 | 0.0737 | 0.0101 | 0.0055 | 0.0102 |

ELBO 本来让 $t=1$（几乎没有 noise）那一项的 weight 比 $t=500$ 大 91 倍。这些小 noise 的项只管最细微的细节，DDPM 论文的说法是它们训练 network 去掉极少量的 noise，down-weight 它们有好处。设成 1 等于把 training 的力气大幅挪到中、大 noise level 上。代价是 loss 不再是 likelihood 的 bound。Lecture 5 第 56 页引了 DDPM 论文 Table 2（CIFAR-10）的结果：按真正的 bound 训练（fixed isotropic $\Sigma$）FID 是 13.51，weight 设成 1 的 $L_{\text{simple}}$ 是 3.17。

Network 只有一个：input 是 $x_t$ 和 $t$，output 和 $x_t$ 同样形状。$T$ 个 conditional 共用一个 noise-conditional network，这就是第 1 站的 shared weight。Lecture 5 的总结是：forward 固定、reverse 学 Gaussian、loss 是 noise 上的 L2，就这么简单。

### EBM、score 与 Langevin

:::skip
这一小节说明 diffusion 和 score matching 是同一件事，推导在 [6.S184 第 4、5 站](../courses/MIT-6.S184.html#score)。跳过的话，记住“noise prediction 就是在学 score”即可。
:::

Energy-based model 定义 $p(x)=e^{-E(x)}/Z$。$Z=\int e^{-E(x)}dx$ 在高维算不出来，但 score 不需要它：

$$\nabla_x\log p(x)=-\nabla_xE(x)-\nabla_x\log Z=-\nabla_xE(x)$$

例如 $E(x)=(x^2-1)^2$（$\pm1$ 处两个 well），score 是 $-4x(x^2-1)$，在 $x=0.5$ 处是 $1.5$，指向 $+1$ 那个 well。所以与其 parameterize $p$，不如 parameterize score $s_\theta(x)$，用 score matching 去拟合。Vincent 2011 的 denoising score matching（Lecture 5 第 76、77 页）：data 加 noise 成 $\tilde x=x+\varepsilon$，$\varepsilon\sim N(0,\sigma^2I)$，拟合 noisy data 的 score，等价于拟合 conditional 的 score

$$\nabla_{\tilde x}\log q(\tilde x\mid x)=\frac{x-\tilde x}{\sigma^2}=-\frac{\varepsilon}{\sigma^2}$$

也就是预测负的、除以 $\sigma^2$ 的 noise，这就是上面的 $\varepsilon_\theta$。有了 score，Langevin dynamics（第 78 页）

$$x_t\leftarrow x_{t-1}+\frac{\sigma^2}{2}\nabla_x\log p(x_{t-1})+\sigma z_t,\qquad z_t\sim N(0,I)$$

就能 sample，不需要知道 $p$。Score 换成 $-\nabla_xE$ 时，这一步就是在 energy landscape 上做 gradient descent，再加一点 perturbation。在上面的 double well 里，从 $x=0.5$ 出发、取 $\sigma=0.1$，不算 noise 的那部分走到 $0.5+0.005\times1.5=0.5075$，往 $+1$ 那个 well 挪了一点。

### 设计空间之一：interpolant 与 prediction target

Reading session 的 Flow Matching 两讲把 diffusion 换成更一般的写法：$x_t=\alpha_tx+\sigma_t\varepsilon$，$t\in[0,1]$。SiT 在同一个 DiT architecture 上逐项比较了 design choice（SiT-B，400K iteration，ImageNet $256\times256$，无 CFG 的 FID）：

| 设定 | FID |
|---|---|
| DDPM：discrete time、noise prediction | 44.2 |
| Continuous time、score prediction（VP path） | 43.6 |
| VP path、score prediction、加 weight $\lambda_t$ | 39.1 |
| VP path、velocity prediction | 39.8 |
| Linear path（$\alpha_t=1-t$，$\sigma_t=t$）、velocity、ODE | 34.8 |
| GVP path（$\alpha_t=\cos\frac{\pi t}{2}$，$\sigma_t=\sin\frac{\pi t}{2}$）、velocity、ODE | 34.6 |
| GVP path、velocity、SDE sampler | 32.9 |

最大的一步来自换 path：从 VP 换到 linear 或 GVP，FID 降了 5。论文的解释是 path 更短、ODE trajectory 的 curvature 更小。

Linear path 下（SD3 叫 rectified flow，MeanFlow 也用它）$x_t=(1-t)x+t\varepsilon$，velocity 是 $v=\dfrac{dx_t}{dt}=\varepsilon-x$。$x_t$ 和 $v$ 是两个 equation，$x$ 和 $\varepsilon$ 是两个 unknown，可以解出：

$$x=x_t-t\,v,\qquad \varepsilon=x_t+(1-t)\,v$$

检验第一个：$x_t-t(\varepsilon-x)=(1-t)x+t\varepsilon-t\varepsilon+tx=x$。所以预测 $v$、$x$、$\varepsilon$ 中的任何一个，另外两个都确定了。区别在 loss：$\hat\varepsilon-\varepsilon=(1-t)(\hat v-v)$，$\hat x-x=-t(\hat v-v)$，于是

$$\|\hat v-v\|^2=\frac{\|\hat\varepsilon-\varepsilon\|^2}{(1-t)^2}=\frac{\|\hat x-x\|^2}{t^2}$$

| $t$ | 0.1 | 0.5 | 0.9 |
|---|---|---|---|
| $v$-loss 相对 $\varepsilon$-loss 的 weight $1/(1-t)^2$ | 1.23 | 4 | 100 |
| $v$-loss 相对 $x$-loss 的 weight $1/t^2$ | 100 | 4 | 1.23 |

:::wrong $v$-prediction 和 $\varepsilon$-prediction 学的是两个不同的 model
在每个 $(x_t,t)$ 上，三种 loss 的 minimizer 是同一个东西的三种写法：$\hat\varepsilon=\mathbb E[\varepsilon\mid x_t]$、$\hat x=\mathbb E[x\mid x_t]$、$\hat v=\mathbb E[v\mid x_t]$，彼此满足上面的 linear 关系。不同的只是 loss 在各个 $t$ 上的 weight：同一个 $\varepsilon$ 误差，在 $t=0.9$ 处按 $v$-loss 算要放大 100 倍。Network 的容量有限、总有误差时，weight 决定了误差分配到哪些 $t$，于是结果不同。SD3 正是把所有这些写成同一个 weighted noise-prediction loss 来比较的。（[6.S184 第 5 站](../courses/MIT-6.S184.html#dsm)对 Gaussian path 推过同样的结论。）
:::

### 设计空间之二：training 时 $t$ 怎样取

Uniform 地取 $t$，中间的 $t$ 和两端的 $t$ 一样多。可是 $t$ 接近 0 时 $x_t\approx x$，预测 $x$ 很容易；$t$ 接近 1 时 $x_t\approx\varepsilon$，最优的 $\hat x$ 就是 data 的平均，也没什么可学。难的是中间。SD3 改用 logit-normal：抽 $u\sim N(m,s^2)$，令 $t=1/(1+e^{-u})$，density 是

$$\pi_{\text{ln}}(t;m,s)=\frac{1}{s\sqrt{2\pi}}\cdot\frac{1}{t(1-t)}\exp\Big(-\frac{(\mathrm{logit}\,t-m)^2}{2s^2}\Big)$$

取 $m=0$、$s=1$：$\pi(0.5)=\dfrac{1}{\sqrt{2\pi}\cdot0.25}=1.596$；$t=0.1$ 时 $\mathrm{logit}\,0.1=-2.197$，$\pi(0.1)=\dfrac{e^{-2.414}}{\sqrt{2\pi}\cdot0.09}=0.397$。中间被取到的机会是两端的 4 倍。换 $\pi(t)$ 等价于在 uniform 的 loss 上再乘一个 weight $\pi(t)$。SD3 在 $m\in[-1,1]$、$s\in[0.2,2.2]$ 上搜索，rf/lognorm(0.00, 1.00) 的平均 rank 最好（1.54），uniform 的 rectified flow 只有 5.67，原来的 eps/linear 是 2.88。MeanFlow 也用 logit-normal，取的是 $(-0.4,1.0)$。

::fig[mit6s978-tsample] 左边：三种取 $t$ 的 density。右边：下一小节的 resolution shift 把 $t$ 往 noise 那一端推。

### 设计空间之三：分辨率变了，noise 要跟着变

同样 $t=0.5$，$1024\times1024$ 的图像比 $256\times256$ 的看起来“干净”得多。SD3 用一个极端的例子把它算出来：一张所有 pixel 都等于 $c$ 的图像，$n$ 个 pixel，$x_t=(1-t)c\,\mathbb 1+t\varepsilon$。对所有 pixel 取平均，$\varepsilon$ 的平均的 std 是 $1/\sqrt n$，所以从 $x_t$ 估计 $c$ 的 std 是

$$\sigma(t,n)=\frac{t}{1-t}\cdot\frac{1}{\sqrt n}$$

Pixel 越多，noise 越容易被平均掉。要让分辨率 $m$ 下的 $t_m$ 和分辨率 $n$ 下的 $t_n$ 同样难，令 $\sigma(t_m,m)=\sigma(t_n,n)$：

$$\frac{t_m}{1-t_m}=\alpha\,\frac{t_n}{1-t_n},\qquad\alpha=\sqrt{m/n}$$

解出 $t_m$：$t_m(1-t_n)=\alpha t_n(1-t_m)$，即 $t_m(1-t_n+\alpha t_n)=\alpha t_n$，

$$t_m=\frac{\alpha\,t_n}{1+(\alpha-1)\,t_n}$$

从 $256^2$ 到 $1024^2$，$m/n=16$，$\alpha=4$，$t_n=0.5$ 对应 $t_m=\dfrac{2}{2.5}=0.8$。检验：$\sigma(0.5,256^2)=1\cdot\tfrac1{256}=0.0039$，$\sigma(0.8,1024^2)=4\cdot\tfrac1{1024}=0.0039$，相等。常数图像的假设不现实，SD3 在 1024 上实际用的是 $\alpha=3$（human preference study 显示 shift 大于 1.5 明显更好，再大差别不大），此时 $0.5\mapsto0.75$。Training 和 sampling 都用同一个 shift。

### 设计空间之四：ODE 还是 SDE sampler

同一个学好的 velocity，可以用 ODE（SiT 用 Heun）或 SDE（Euler–Maruyama，diffusion coefficient $w_t$ 可以单独选，见 [6.S184 第 4 站](../courses/MIT-6.S184.html#score)的 SDE extension trick）sample。SiT 的结果：250 NFE 时 SDE 略好（GVP 32.9 对 34.6）；最优的 $w_t$ 取决于 interpolant 和 prediction target 的组合。最终 SiT-XL（7M iteration，CFG 1.5）ODE 的 FID 是 2.15，SDE 是 2.06，DiT-XL 同设置是 2.27。

SD3 从另一个角度看步数：rectified flow 在步数减少时退化最少；model 越大，需要的步数越少（5 步相对 50 步的 CLIP score 下降，depth 15 是 4.30%，depth 38 是 2.71%）。SD3 也做了 scaling：depth 到 38（约 8B parameter），validation loss 随 model size 和 training step 平滑下降，并和 GenEval、human preference 相关。

:::from
Forward process 与 variance preserving（第 16 页）、noise 即 convolution（第 9 页）、closed form 的 $q(x_t\mid x_0)$（第 21 页）、reverse conditional 依赖 data（第 28、29 页）、$\tilde\mu_t$ 与 $\tilde\beta_t$（第 37 页）、两个 Gaussian 的 KL 与“weight 设成 1 是 critical”（第 45 页）、$\mathcal L_{\text{VLB}}$ 的分解（第 53 页）、Table 2 的引用（第 56 页）、noise-conditional network（第 59、60 页）、DDPM 的两个 algorithm（第 62 页）、EBM、score 与 $Z$ 无关、denoising score matching 与 Langevin 的 formula（第 69 到 78 页）来自 [Lecture 5](https://mit-6s978.github.io/assets/pdfs/lec5_diffusion.pdf) 的原 PDF。Linear schedule 的数值（$T=1000$，$\beta$ 从 $10^{-4}$ 到 0.02）、Eq. 6、7、11、12 的写法、$\sigma_t^2$ 的两种取法、down-weight 小 $t$ 的理由来自 [DDPM 论文](https://ar5iv.arxiv.org/html/2006.11239) 第 2 到 4 节。设计空间的表、path 的 formula、ODE/SDE 的比较来自 [SiT](https://arxiv.org/abs/2401.08740) 正文；rectified flow、logit-normal、rank、resolution shift 的推导和 $\alpha=3$、scaling 和步数的数字来自 [SD3](https://arxiv.org/abs/2403.03206) 正文（两篇都是上一次读的工具转述，这次没有重新核对）。两篇都在 reading session “Flow Matching 2”。$\tilde\mu_t$ 换成 noise 形式的三行、slides 第 37 页系数的核对、$\lambda_t$ 的数表、$x/\varepsilon/v$ 的换算与 weight 表、logit-normal 的数值、shift 的数值检验、score 与 Langevin 一步的例子是为这一页算的。
:::

## [mar] 不用 vector quantization 的 autoregression

:::skip
快速路线必读，这是 reading session “AR and Diffusion”的第一篇，也是 Kaiming He 组的工作。能说出 Diffusion Loss 的结构、解释它为什么比 L2 和 VQ 都对，并说出 random order 加 bidirectional attention 带来的 FID 变化，就可以去第 8 站。Scaling 那一小节可以跳。
:::

### VQ 为什么一直存在

第 4 站的 AR 都在 discrete token 上做，因为 AR 的每一步要输出一个 distribution，而 discrete 的 distribution 最好表示：一个 softmax 就行，loss 是 cross-entropy。代价是 VQ：MAR 论文 Table 2 里 VQ-16 的 reconstruction FID 是 5.87，同样 stride 的 continuous KL-16 是 1.43。

能不能让 AR 直接输出 continuous token？最朴素的办法是 L2 regression：network 输出一个 vector，loss 是和真 token 的 squared error。看一个 token 的 conditional distribution 有两个 mode 的情形：给定前面的 token，这一个 token 一半可能在 $-0.9$ 附近、一半可能在 $0.9$ 附近（第 1 站表格里 robot 绕障碍物从左走、从右走都行，就是这种情形）。L2 的 minimizer 是 conditional mean，恰好是 0，一个几乎不可能出现的值。VQ 加 cross-entropy 能表示两个 mode，但只能输出 codebook 里的值。

::fig[mit6s978-bimodal] 同一个 token 的 conditional distribution（灰色）是 $\tfrac12N(-0.9,0.15^2)+\tfrac12N(0.9,0.15^2)$。中间那张假设一个间隔 0.4 的 8-level codebook，最近的 level 是 $\pm0.6$ 和 $\pm1.0$；右边的 sample 是用 exact velocity 走 100 步 Euler 得到的。

MAR 的看法是：AR 需要的是“每个 token 有一个能 sample 的 distribution”，discrete 只是表示它的一种方法。

### Diffusion Loss

每个 token $x\in\mathbb R^d$（MAR 用 KL-16 tokenizer，$d=16$），AR 的 Transformer 不直接输出 token，而输出一个 condition vector $z$。一个很小的 diffusion model 在 $z$ 的 condition 下建模 $p(x\mid z)$：

$$\mathcal L(z,x)=\mathbb E_{\varepsilon,t}\Big[\big\|\varepsilon-\varepsilon_\theta(x_t\mid t,z)\big\|^2\Big],\qquad x_t=\sqrt{\bar\alpha_t}\,x+\sqrt{1-\bar\alpha_t}\,\varepsilon$$

这就是第 6 站的 DDPM loss，只是 data 是一个 16 维的 token。Gradient 同时传给小 denoiser 和产生 $z$ 的 Transformer，Transformer 由此学会给出好的 condition。

具体设置（论文和代码）：

- Denoiser 是一个 MLP：若干 residual block，每个是 LayerNorm、Linear、SiLU、Linear 加 residual；$z$ 加到 time embedding 上，通过 AdaLN 进入每个 LayerNorm。论文 ablation 的默认是 3 个 block、width 1024，约 21M parameter，论文说只给 MAR-L 增加约 5% 的 parameter。下面结果表里的最终 model 用更大的 MLP：MAR-B、L、H 分别是 6、8、12 个 block，width 1024、1280、1536（论文 Appendix B 和官方 README 的评测命令）。
- Training 用 1000 步的 cosine schedule；sampling 时重新取 100 步，论文 Figure 4 显示 100 步够用。
- Denoiser 很小，所以对同一个 $z$ 抽 4 个 $t$（代码里的 `diffusion_batch_mul=4`），不用重算 Transformer 就把 loss 用了 4 次。
- Temperature $\tau$：sampling 时把每步加的 noise $\sigma_t\delta$ 乘上 $\tau$，用来调 diversity，相当于 discrete 时 softmax 的 temperature。
- CFG：training 时 10% 的 class label 换成一个 dummy token；sampling 时 $\varepsilon=\varepsilon_\theta(x_t\mid t,z_u)+\omega\big(\varepsilon_\theta(x_t\mid t,z_c)-\varepsilon_\theta(x_t\mid t,z_u)\big)$。代码里 $\omega$ 随已生成的 token 比例线性增大：`cfg_iter = 1 + (cfg - 1) * (256 - mask_len) / 256`。

在上图的 toy 里，diffusion 的 sample 1200 个中 50% 左右落在每个 mode（图上标出了右边的比例），没有一个落在 0 附近。

:::wrong Diffusion Loss 就是在每个 token 上把整张图的 diffusion 再做一遍
Diffusion Loss 的 denoiser 只看一个 16 维的 token 和它的 condition $z$，它只负责“这一个 token 的 distribution 长什么样”；token 之间的 dependence 全部由 Transformer 通过 $z$ 表达。这也是 denoiser 只要 21M parameter（约为 MAR-L 的 5%）就够的原因。和整图的 latent diffusion 相比，分工是 AR 管 joint、diffusion 管 marginal 的形状。
:::

### 从 raster 到 random order、从 causal 到 bidirectional

MAR 的第二个改动是 AR 的 order。论文 Table 1（MAR-L，400 epoch，无 CFG 的 FID）把这一步拆开：

| AR 的形式 | cross-entropy（VQ-16） | Diffusion Loss（KL-16） |
|---|---|---|
| Raster order、causal attention | 19.58 | 19.23 |
| Random order、causal attention | 16.22 | 13.07 |
| Random order、bidirectional，每步 1 个 token | 8.75 | 3.43 |
| 默认 MAR（每步多个 token） | 8.79 | 3.50 |
| 默认 MAR，加 CFG | 3.69 | 1.98 |

两个改动都在 Diffusion Loss 下收益最大：random order 加 bidirectional 把 FID 从 19.23 降到 3.43；同样的 architecture，换回 VQ 加 cross-entropy 是 8.75。

Bidirectional 的 AR 怎样做？像 MAE 那样：已知的 token 进 encoder，未知的位置用 mask token 填上进 decoder，所有 token 之间都能互相看见，loss 只算在未知的 token 上。Training 时每张图抽一个 random order 和一个 masking ratio。代码里 masking ratio 来自一个在 1.0 处截断的 normal：mean 1.0、std 0.25、截在 $[0.7,1.0]$（`stats.truncnorm`）。Inference 时 masking ratio 按 cosine schedule 从 1 降到 0：第 $k$ 步（从 0 数）之后还 mask 着的 token 数是

$$\Big\lfloor256\cdot\cos\Big(\frac{\pi}{2}\cdot\frac{k+1}{64}\Big)\Big\rfloor$$

再限制成每步至少生成 1 个（代码里的 `maximum(1, minimum(...))`）。按这个规则算：前 13 步各生成 1 个 token，然后逐渐增加，最后几步每步 6 到 7 个；第 8、16、32、48 步结束时累计 8、20、75、159 个，第 64 步正好 256 个。先生成的少数 token 决定整体结构，所以每步很谨慎；后面 condition 多了，一次生成很多也不容易出错。

::fig[mit6s978-mar] 同样走 64 步。第一帧是终态：MAR 已填满，raster AR 只有 64 个。动起来时看右边先零星出现几个点，再越填越快。

这里的“每步预测多个 token”正是第 1 站的 partition：$p(\text{一组 token}\mid\text{已知的 token})$。同一组里的 token 各自独立地从自己的 Diffusion Loss 里 sample，组内的 dependence 被忽略，所以每步的组不能太大；Table 1 里每步 1 个（3.43）和默认 64 步（3.50）差别很小。

### 结果与速度

ImageNet $256\times256$，800 epoch：

| Model | parameter | FID（无 CFG） | FID（有 CFG） |
|---|---|---|---|
| MAR-B | 208M | 3.48 | 2.31 |
| MAR-L | 479M | 2.60 | 1.78 |
| MAR-H | 943M | 2.35 | 1.55 |

这张表（论文的 system-level 对比）的数字是用 256 个 AR step 评测的：官方 README 的评测命令写的是 `--num_iter 256`，每步一个 token；代码的默认值和论文 ablation 用的是 64 步，README 说减少 AR step 能显著提速。速度方面论文给的是：每张图不到 0.3 秒时 FID 可以低于 2.0（Figure 4 里 MAR-L 级别的 model 是每张 0.286 到 0.291 秒）。Bidirectional attention 不能用 KV cache，每一步都要对全部 256 个位置重算一遍 Transformer，所以 AR step 的个数直接决定速度。

### Scaling：continuous token 与 random order

:::skip
这一小节是后续工作 Fluid（Kaiming He 也是作者）的 scaling 结果。跳过的话，只少了“哪种 AR 能 scale 上去”的实验证据。
:::

Fluid 在 text-to-image 上做了一个 $2\times2$ 实验：discrete token（VQGAN，$16\times16$，vocabulary 8192）对 continuous token（SD 的 tokenizer，$32\times32\times4$，每 $2\times2$ 合成一个 16 channel 的 token，共 256 个），raster order + causal attention 对 random order + bidirectional attention，parameter 从 150M 到 3B。

- 四种变体的 validation loss 都随 model size 呈 power law 下降。
- 但 FID 和 GenEval 不一样：raster、discrete 的变体在 1B 左右就停住了；random order、continuous 的变体一直到 3B 都在变好，作者因此只把它 scale 到 10.5B（MS-COCO zero-shot FID 6.16，GenEval 0.69）。
- Validation loss 和 FID（Pearson 0.917）、GenEval（$-0.931$）强相关，但 metric 有界，这种相关不可能无限延续。
- Discrete tokenizer 的information loss 是瓶颈：同一张图重建的 PSNR，discrete 26.6，continuous 31.5。Random order 的好处在 global structure：作者的说法是每一步都能重新调整整体结构，所以计数和位置关系（GenEval 的项目）更好。

这和第 4 站的 VAR scaling law 并不矛盾：loss 一直按 power law 下降，生成质量却可能先饱和。哪一个 metric 在 scale，要分开看。

:::from
Diffusion Loss 的 formula、denoiser 结构、1000/100 步、4 个 $t$、temperature、CFG、MAE 式的 bidirectional AR 来自 [MAR](https://arxiv.org/abs/2406.11838) 正文（上一次读的工具转述）；Table 1、Table 2、system-level 对比表的数字、21M 与“约 5%”、Appendix B 的 MLP 大小、“不到 0.3 秒”这次对着 [arXiv HTML](https://arxiv.org/html/2406.11838v2) 核过。Masking ratio 的 truncated normal、cosine schedule 与取整、每步至少一个、CFG 的 linear schedule、`diffusion_batch_mul`、`num_iter` 的默认值 64 对着 [LTH14/mar](https://github.com/LTH14/mar) 的 `models/mar.py`、`models/diffloss.py`、`main_mar.py` 核过，评测时的 256 步和各 model 的 MLP 大小来自它的 README；每步 token 数是按代码的规则算的。Fluid 的设置和结论来自 [Fluid](https://arxiv.org/html/2410.13863v1) 正文（转述，没有读到 exponent）。Bimodal 的 toy 和它的 sampling、“AR 管 joint、diffusion 管 marginal 形状”的说法是为这一页写的。
:::

## [fast] One-step 与 few-step generation

:::skip
快速路线必读（Yang Song 的 guest lecture 加 MeanFlow）。能在 toy 上说出 Euler 1 步和 2 步的结果、写出 consistency function 和 average velocity 的定义并推出 MeanFlow identity，就读完这一页了。Consistency model 的 iCT、sCM 细节那一小节可以跳。
:::

### 一步走过去会发生什么

全站用一个能全部算出来的 toy：data 是 $\pm1$ 两个点，各 1/2；path 是 $x_t=(1-t)x+t\varepsilon$，$t=1$ 是纯 noise。

先求 exact velocity。给定 $x$，$\varepsilon=\dfrac{x_t-(1-t)x}{t}$，所以 conditional velocity $\varepsilon-x=\dfrac{x_t-(1-t)x}{t}-x=\dfrac{x_t-x}{t}$。Marginal velocity 是它在 $x_t=z$ 下的 conditional expectation：

$$v(z,t)=\frac{z-\mathbb E[x\mid x_t=z]}{t}$$

Posterior：$x=\pm1$ 时 $x_t\sim N(\pm(1-t),t^2)$，两者的 likelihood ratio 是 $\exp\big(2(1-t)z/t^2\big)$，于是 $\mathbb E[x\mid x_t=z]=\tanh\big((1-t)z/t^2\big)$。

Sampling 是从 $t=1$ 往 $t=0$ 解 ODE。Euler 只走 1 步（step size 1）：

$$z_0=z_1-1\cdot v(z_1,1)=z_1-\big(z_1-\tanh(0)\big)=0$$

不管 noise $z_1$ 是多少，都落在 0。原因写在 formula 里：一步 Euler 的终点是 $\mathbb E[x\mid x_1=z_1]$，而 $t=1$ 时 $x_1$ 是纯 noise，不含 $x$ 的任何信息，posterior mean 就是 data 的 mean。这和 [6.S184 开头的第一次失败](../courses/MIT-6.S184.html)是同一件事。

走 2 步：先 $t=1\to0.5$，$z_{0.5}=z_1-0.5\,z_1=0.5\,z_1$；再 $t=0.5\to0$，

$$z_0=z_{0.5}-0.5\cdot\frac{z_{0.5}-\tanh(0.5\,z_{0.5}/0.25)}{0.5}=\tanh(2z_{0.5})=\tanh(z_1)$$

终点散布在 $(-1,1)$ 之间，例如 $z_1=1$ 给出 0.762。用 200,000 个 noise 数值地走 $n$ 步，量终点到正确答案 $\mathrm{sign}(z_1)$ 的平均距离：

| Euler 步数 | 1 | 2 | 4 | 8 | 16 |
|---|---|---|---|---|---|
| $\mathbb E\,|z_0-\mathrm{sign}(z_1)|$ | 1.000 | 0.4435 | 0.0503 | 0.0008 | 0.0000 |
| 终点 $|z_0|>0.9$ 的比例 | 0 | 14.1% | 89.3% | 99.8% | 100% |

::fig[mit6s978-onestep] 灰线是 exact ODE trajectory，它们先向中间弯、再分到 $\pm1$（例如从 $z_1=0.3$ 出发，$t=0.75$ 时在 0.238，$t=0.25$ 时在 0.570）。动起来时依次看 Euler 1 步、2 步、4 步，最后是 MeanFlow 的一步。

Trajectory 是弯的，Euler 每一步沿切线走，步子大了就偏。真实图像上，Yang Song 的 lecture 说 diffusion 至少要 10 步才能出合理的图，最好的质量往往要上千步；第 6 站的 SiT 用 250 步。

:::wrong 只要 velocity 学得足够准，把 Euler 的步长放大到 1 就能一步生成
上面的 toy 用的是 exact velocity，没有任何学习误差，1 步 Euler 照样全部落在 0。Velocity 描述的是每个时刻的切线方向，一步走完需要的是整段 trajectory 的位移，两者在 trajectory 弯曲时不同。一步生成要学的是另一个 function：要么是 trajectory 的终点（consistency model），要么是整段的平均速度（MeanFlow）。
:::

### Distillation：一步学会 teacher 的多步

:::skip
这一小节是 reading session “Diffusion Models”第二篇 Progressive Distillation 的做法。跳过的话，只少了“distillation 的上限是 teacher”和“步数很少时不能再预测 noise”这两点。
:::

Progressive distillation（Salimans 与 Ho）的做法：student 先复制 teacher 的 architecture 和 parameter；对一个 noisy 的 $z_t$，让 teacher 用 deterministic 的 DDIM sampler 走 2 步，再反推出一个 target $\tilde x$，使 student 只走 1 步 DDIM 就落到同一个终点；student 训好后当新的 teacher，步数 $N\to N/2$，重复。论文从多达 8192 步的 sampler 出发一路减半；CIFAR-10 上 1、2、4、8 步的 FID 是 9.12、4.51、3.00、2.57，摘要强调的是 4 步时 FID 3.0。

它的上限由 teacher 决定。在 toy 上，用 2 步 Euler 当 teacher，student 能学到的最好结果就是 $\tanh(z_1)$，和 teacher 一样有 0.4435 的平均误差；要更好，teacher 本身必须走得更细。

论文还指出，步数压到很少时不能再让 network 预测 $\varepsilon$。记 $z_t=\alpha_tx+\sigma_t\varepsilon$，从 $\hat\varepsilon$ 换回 data 要算 $\hat x=(z_t-\sigma_t\hat\varepsilon)/\alpha_t$。Signal-to-noise ratio $\alpha_t^2/\sigma_t^2$ 趋于 0 时 $\alpha_t\to0$，$\hat\varepsilon$ 的一点误差被除以一个接近 0 的数，无限放大；压到 1 步时，network 的 input 是纯 noise，$z_t=\varepsilon$，预测 $\varepsilon$ 不再包含任何关于 $x$ 的信息。本站的 toy 也是这样：path $x_t=(1-t)x+t\varepsilon$ 在 $t=1$ 处 data 的系数 $1-t$ 是 0。论文改为预测 $x$、同时预测 $x$ 和 $\varepsilon$，或者预测

$$v\equiv\alpha_t\varepsilon-\sigma_tx$$

取 $\alpha_t=\cos\phi$、$\sigma_t=\sin\phi$（第 6 站 SiT 的 GVP path 就是这一族），$\dfrac{d}{d\phi}(\cos\phi\,x+\sin\phi\,\varepsilon)=\cos\phi\,\varepsilon-\sin\phi\,x=v$：它是这条 path 的 velocity，和 linear path 的 $\varepsilon-x$ 是同一个想法。Loss 的 weight 也相应改成 truncated SNR，$\max(\alpha_t^2/\sigma_t^2,1)\,\|x-\hat x\|^2$，或 SNR+1，$(1+\alpha_t^2/\sigma_t^2)\,\|x-\hat x\|^2$（后者就是 $\|v-\hat v\|^2$）；两者在 $\alpha_t\to0$ 时 weight 都不再趋于 0。

### Consistency model

PF-ODE（probability flow ODE）的每条 trajectory 从一个 noise 出发、终止于一个 data point。Consistency model 学一个 function $f(x_t,t)$，把 trajectory 上的任何一点直接映到这条 trajectory 的终点。Yang Song 的 slides 把 data 端写成 $t=0$；论文和 pset 6 停在一个很小的 $\epsilon=0.002$，noise 端是 $T=80$，pixel 缩放到 $[-1,1]$，noisy 的点是 $x+t\,z$（$t$ 直接就是 noise 的 std）。两条要求：

- Self-consistency：同一条 trajectory 上的点映到同一个输出，$f(x_t,t)=f(x_{t'},t')$。Lecture 说它靠 learning 保证。
- Boundary condition：$f(x,\epsilon)=x$。Lecture 强调它靠 network 的 parameterization 保证，不靠 loss（第 16、18 页）：$f_\theta(x,t)=c_{\text{skip}}(t)\,x+c_{\text{out}}(t)\,F_\theta(x,t)$，只要 $c_{\text{skip}}(\epsilon)=1$、$c_{\text{out}}(\epsilon)=0$，不管 network $F_\theta$ 输出什么，$t=\epsilon$ 时都原样输出 $x$。具体的系数 slides 没有给；官方代码（`cm/karras_diffusion.py`）用的是

$$c_{\text{skip}}(t)=\frac{\sigma_{\text{data}}^2}{(t-\epsilon)^2+\sigma_{\text{data}}^2},\qquad c_{\text{out}}(t)=\frac{\sigma_{\text{data}}\,(t-\epsilon)}{\sqrt{\sigma_{\text{data}}^2+t^2}},\qquad\sigma_{\text{data}}=0.5$$

代几个数：$t=\epsilon$ 时 $(c_{\text{skip}},c_{\text{out}})=(1,0)$；$t=0.5$ 时 $(0.502,0.352)$；$t=2$ 时 $(0.059,0.485)$；$t=80$ 时 $(0.000,0.500)$。Noise 小时 output 主要是 input 本身；noise 大时几乎全靠 network，network 的 output 乘上约 $\sigma_{\text{data}}=0.5$。

在 toy 上，trajectory 关于 0 对称、不会穿过 0，所以 consistency function 是 $f(z,t)=\mathrm{sign}(z)$（$t>0$）：一个在 0 处跳变的 step function。这说明了一步生成的难处在哪里：要学的 function 可以非常陡，network 在跳变附近总会有误差。

Training 有两种：

- Consistency distillation（CD）：用一个训好的 diffusion model 在相邻的两个 noise level 之间走一步 ODE，得到同一条 trajectory 上的两个点，要求 student 在两点上的输出一致。Target 那一侧用 EMA 的 weight，距离用 L2 或 LPIPS。
- Consistency training（CT）：不要 teacher，直接用同一个 data point 加同一个 noise $z$ 得到相邻 noise level 上的两个点（论文 Eq. 10，也是 pset 6 handout 写的 loss）：

$$\mathcal L_{\text{CT}}=\mathbb E\Big[\lambda(t_n)\,d\big(f_\theta(x+t_{n+1}z,\;t_{n+1}),\;f_{\theta^-}(x+t_nz,\;t_n)\big)\Big],\qquad\theta^-=\text{EMA}(\theta)$$

Noise 更大的那个点交给正在学的 $\theta$，更小的那个交给 EMA 的 $\theta^-$ 当 target：越靠近 data 端，$f$ 越接近已知的 boundary condition，target 越可靠。相邻的 noise level 取 Karras 的 schedule $t_i=\big(\epsilon^{1/\rho}+\tfrac{i-1}{N-1}(T^{1/\rho}-\epsilon^{1/\rho})\big)^\rho$，$\rho=7$。Lecture 第 31 页说 $|t_{n+1}-t_n|\to0$ 时 CT 的 objective 收敛到用 ground-truth diffusion model 做的 CD。

Consistency model 也能多步 sample（论文 Algorithm 1）：先 $x\leftarrow f_\theta(\hat x_T,T)$；对选定的 $\tau_1>\tau_2>\cdots$ 依次加 noise $\hat x\leftarrow x+\sqrt{\tau_n^2-\epsilon^2}\,z$，再映回 $x\leftarrow f_\theta(\hat x,\tau_n)$。步数换质量。Lecture 第 27、36 页的第一版结果（slides 上没写 dataset；论文引言写明 CD 一步 6.20、两步 4.70 是 ImageNet $64\times64$，CT 那一页用的是同一组 EDM 参照）：teacher EDM 79 NFE 的 FID 是 2.44，CD 1 步 6.20、2 步 4.70，CT 1 步 12.96、2 步 11.12。

:::skip
iCT 和 sCM 是后续改进的工程细节。跳过的话，只需记住：consistency training 在 CIFAR-10 上一步做到了 FID 2.51，continuous-time 版本以约 1/50 的 sampling 成本接近最好的 diffusion。
:::

Improved CT（iCT）的改动：小 noise level 上的 weight 加大；降低 noise embedding 的敏感度、用比 diffusion 更大的 dropout；EMA decay 设成 0（理由是 loss 和 gradient 都要对上，只有 EMA 为 0 时成立）；距离从 L2 换成 pseudo-Huber（L2 效果差，LPIPS 会和用 Inception feature 的 FID 互相“作弊”）；noise level 按 discretized lognormal 抽，总数随 training 逐步加倍。CIFAR-10 上 1 步 FID 2.51、2 步 2.24。Continuous-time CM（sCM）用 PF-ODE 的切线方向作 supervision，难点是 training 不稳定，靠 TrigFlow（用三角函数统一 EDM 和 flow matching 的 path）、time 上 well-conditioned 的 architecture、adaptive weighting 解决；结论是质量在最好的 diffusion 的 10% 以内，sampling 快约 50 倍。

### MeanFlow：学整段的平均速度

MeanFlow（Kaiming He 组 2025 年的工作，课程之后）换了一个学习对象。定义从 $r$ 到 $t$ 的 average velocity：

$$u(z_t,r,t)=\frac{1}{t-r}\int_r^tv(z_\tau,\tau)\,d\tau$$

即这一段的位移除以时长。$r\to t$ 时 $u\to v$。只要 $u$ 学会了，一步 sampling 就是 $z_r=z_t-(t-r)\,u(z_t,r,t)$，取 $r=0$、$t=1$：

$$z_0=z_1-u(z_1,0,1)$$

问题是 training target 里有一个 integral。MeanFlow identity 把它消掉。把定义写成 $(t-r)\,u(z_t,r,t)=\int_r^tv(z_\tau,\tau)\,d\tau$，两边对 $t$ 求 total derivative（$r$ 与 $t$ 无关）。左边用 product rule，右边用 fundamental theorem of calculus：

$$u(z_t,r,t)+(t-r)\frac{d}{dt}u(z_t,r,t)=v(z_t,t)$$

移项得到 identity：

$$u(z_t,r,t)=v(z_t,t)-(t-r)\frac{d}{dt}u(z_t,r,t)$$

$z_t$ 沿 trajectory 移动，$\dfrac{dz_t}{dt}=v$，所以 total derivative 展开成 $\dfrac{d}{dt}u=v\,\partial_zu+\partial_tu$，正是 $u$ 的 Jacobian 和 tangent $(v,0,1)$ 的乘积，一次 Jacobian–vector product（`torch.func.jvp`）就能算。

在 toy 上验证。从 $t$ 到 0 的位移是 $z-\mathrm{sign}(z)$，所以 $u(z,0,t)=\dfrac{z-\mathrm{sign}(z)}{t}$。对 $z\ne0$，$\partial_zu=\dfrac1t$，$\partial_tu=-\dfrac{z-\mathrm{sign}(z)}{t^2}$。代入右边：

$$v-t\Big(\frac vt-\frac{z-\mathrm{sign}(z)}{t^2}\Big)=v-v+\frac{z-\mathrm{sign}(z)}{t}=u(z,0,t)$$

Identity 成立，而且 $v$ 被完全消掉了：不管 trajectory 怎样弯，average velocity 都只由起点和终点决定。一步 sampling 给出 $z_1-u(z_1,0,1)=\mathrm{sign}(z_1)$，正是正确答案。

Training：$v$ 换成 conditional velocity $v_t=\varepsilon-x$（和 flow matching 一样，[6.S184 第 3 站](../courses/MIT-6.S184.html#fm)证明了这样做的 regression 学到的是 marginal 的东西），target 里的 $u$ 用 network 自己，并 stop gradient：

$$u_{\text{tgt}}=v_t-(t-r)\big(v_t\,\partial_zu_\theta+\partial_tu_\theta\big),\qquad\mathcal L=\mathbb E\,\big\|u_\theta(z_t,r,t)-\mathrm{sg}(u_{\text{tgt}})\big\|^2$$

Stop gradient 免去了对 JVP 再求一次 gradient。几个关键设置和 ablation（ImageNet $256\times256$，B/4 model，1-NFE FID）：

| 设置 | FID |
|---|---|
| $r\ne t$ 的比例 0%（退化成纯 flow matching） | 328.91 |
| 25%（默认） | 61.06 |
| 50% | 63.14 |
| 100% | 67.32 |
| $(r,t)$ 用 uniform 抽 | 65.90 |
| logit-normal$(-0.4,1.0)$（默认） | 61.06 |

$r=t$ 时 target 就是 $v_t$，这部分 sample 在做普通的 flow matching；完全没有 $r\ne t$ 的 sample 时，model 只学到切线，一步 sampling 就是上面的“Euler 1 步”，FID 是 328.91。Loss 还用了 adaptive weight $w=1/(\|\Delta\|^2+c)^p$，$p=1$ 最好。

CFG 也被做进了 target（guided 的 ground-truth velocity $\omega v(z_t,t\mid c)+(1-\omega)v(z_t,t)$），所以有 CFG 时 sampling 仍然只要 1 次 network evaluation。

结果（ImageNet $256\times256$，从零 train，不用 pre-training 或 distillation）：

| 方法 | parameter | NFE | FID |
|---|---|---|---|
| iCT-XL/2 | 675M | 1 | 34.24 |
| Shortcut-XL/2 | 675M | 1 | 10.60 |
| MeanFlow-B/2 | 131M | 1 | 6.17 |
| MeanFlow-XL/2 | 676M | 1 | 3.43 |
| MeanFlow-XL/2（1000 epoch） | 676M | 2 | 2.20 |
| DiT-XL/2（参照） | 675M | 250×2 | 2.27 |

Training 的额外成本来自 JVP：同样的 model，flow matching 每个 iteration 0.045 秒，MeanFlow 0.052 秒，多约 16%。

:::edge 三条路的上限
Distillation 的上限是 teacher 的多步结果；consistency model 要学一个可能极陡的“映到终点”function，误差集中在 trajectory 分岔的地方（toy 里的 $z=0$）；MeanFlow 学的 $u(z,r,t)$ 是一族 function，$r=t$ 时退化成 velocity，所以 flow matching 的那部分 training 信号一直在。三者用的都是同一个 PF-ODE，区别在于把 trajectory 的哪一部分交给 network 记住。
:::

:::from
“diffusion 至少 10 步、最好要上千步”（第 3 页）、PF-ODE、consistency function 的定义、self-consistency 靠 learning 与 boundary condition 靠 parameterization（第 16、18 页）、CD 与 CT、CT 与 CD 的极限关系（第 21、31 页）、多步 sampling、第一版的 FID 数字（第 27、36 页）、iCT 的改动和 CIFAR-10 结果（第 45 到 51 页）、sCM 的思路和结论（第 54 到 80 页）来自 [Yang Song 的 guest lecture](https://mit-6s978.github.io/assets/pdfs/CM_lecture.pdf) 的原 PDF。$\epsilon=0.002$、$T=80$、Karras schedule 与 $\rho=7$、Algorithm 1、$\mathcal L_{\text{CT}}$（Eq. 10）、“6.20 与 4.70 是 ImageNet $64\times64$”来自 [Consistency Models 论文](https://ar5iv.labs.arxiv.org/html/2303.01469) 的正文前半；它的 Appendix C 没有读到，$c_{\text{skip}}$、$c_{\text{out}}$ 和 $\sigma_{\text{data}}=0.5$ 是对着 [官方代码](https://github.com/openai/consistency_models) 核的。Progressive distillation 的做法、8192 步与 4 步、CIFAR-10 的 FID、$\varepsilon$ 在低 SNR 下的问题、$v$ 的定义与两种 weight 来自 [Progressive Distillation 论文](https://ar5iv.labs.arxiv.org/html/2202.00512) 第 3、4 节和 CIFAR-10 的表。Average velocity、MeanFlow identity 的推导、JVP、target 与 stop gradient、ablation、CFG、结果表和 training 成本来自 [MeanFlow](https://arxiv.org/html/2505.13447v1) 正文（上一次读的工具转述）。Toy 的 exact velocity、Euler 1 步与 2 步的 closed form、步数表、consistency function 与 average velocity 的 closed form 以及 identity 的验证、$c_{\text{skip}}$ 与 $c_{\text{out}}$ 的数值、$v$ 是 GVP path 的 velocity 的那一行、“noise 大的点给 $\theta$、小的给 $\theta^-$”的解释是为这一页写和算的。
:::

## 作业

6 份 problem set 的 handout（PDF）和 notebook（`.ipynb`）放在课程 schedule 链接的 Google Drive 文件夹里，这次逐份读过（frontmatter 的 open 列表有每份的链接）。格式都一样：notebook 里留好了要填的函数（标着 `### Problem N`），data loader、training loop、画图的代码已经给出；交一份报告（`kerberos.pdf`，回答所有问题，附结果图和自己写的代码的截图）和一份所有 cell 都跑过的 notebook，后者单独算 Problem 0（1 分）。Pset 1 交 Gradescope，之后交 Canvas。每份 handout 都建议用 Colab 的免费 GPU，并说 GPU 额度用完时用 CPU 也能在合理时间内做完。评分按课程主页是 Good / Fair / Poor / None，去掉最低两次；迟交政策主页和 handout 说法不一（见页首的考核说明）。没有公开的答案。

下面的提示只指方向，不给答案，每条注明出处：“handout”指 PDF，“notebook”指给定的代码，“slides”指对应讲次，“经验”是这一页自己的判断，标了“跑过”的是我用 numpy 复现后确认的。时间都是估计，没有实测。

另外两项占分更多：seminar（30%）和 final project（40%），最后两小节写它们。

### Problem Set 1：Autoencoder 与 VAE（先做）

9 月 10 日发布，9 月 24 日截止（schedule；handout 上印的发布日期是 9 月 5 日）。

**要实现什么。** 前三题在 MNIST 上，都是 MLP。

- Problem 1（20 分）：补全 `AE` 的 encoder 和 decoder（latent 固定 2 维，notebook 给的 hidden_dims 是 `[128, 32, 16, 2]`），训练后画 reconstruction，并把 $[-2,2]^2$ 上 $8\times8$ 个 latent 点 decode 拼成一张图。
- Problem 2（30 分）：(a) 从 $\log p(x)$ 出发写出 ELBO 的完整证明；(b) 补全 `VAE` 的 encoder（输出 mean 和 log variance 各 2 维）和 decoder；(c) 实现 `reparameterize()`；(d) 实现 `log_normal_pdf()`，完成 SGVB 估计（每个 $x$ 只抽一个 $z$ 的 Monte Carlo）。
- Problem 3（30 分）：(a) 证明 $q(z\mid x)$ 和 prior 都是 Gaussian 时，ELBO 等于 analytic 的 $\tfrac12\sum_d\big(1+\log\sigma_d^2-\mu_d^2-\sigma_d^2\big)$ 加 reconstruction 项；(b) 跑给定的验证代码：每个 $x$ 抽的 $z$ 从 1 个加到 3901 个，看 SGVB 对 KL 项的估计是否收敛到 analytic 的值；(c) 用两种 loss 各训练一个 VAE，比较 reconstruction 和 latent grid。
- Problem 4（20 分）：在一个 torus 的 3D point cloud（$R=1$、$r=0.5$，3000 个点，input 先过 10 个 frequency 的 positional encoding）上训练 VAE：(a) 画 reconstruction；(b) 在 latent 里对两个点做 linear interpolation 再 decode，得到的 trajectory 像 Euclidean 空间里的直线，而不贴着 torus 的 surface；(c) 可选：改 architecture 和 latent 的表示，让 interpolation 沿着 torus 的 surface 走。

**做完会什么。** 第 2 站前半：ELBO 的推导、Gaussian 的 KL、reparameterization，以及 Monte Carlo 估计和 closed form 的关系。Problem 4 是“latent 的形状要和 data 的几何相符”的一个具体例子。

**时间和算力。** 都是小 MLP：MNIST 默认 20 个 epoch，torus 默认 1000 个 epoch，但每个 epoch 只有一个 3000 点的 batch。Free Colab 足够，CPU 也能做（handout）。推导、实验和报告加起来估计 6 到 8 小时（经验）。

**提示。**

- 2(a)：照第 2 站那三行写，全程是等式，最后一项是 KL，非负，不等式由此而来；每一步用了什么（$q$ 的 integral 为 1、Bayes rule、拆 log）都要标出来，Lecture 2 第 12 到 20 页就是这样逐步标注的（slides）。
- 3(a)：先在一维推 $D_{\text{KL}}\big(N(\mu,\sigma^2)\,\|\,N(0,1)\big)$，diagonal 的情形是各维相加。推完拿第 2 站的表核对：$q=N(1,0.2)$ 时是 0.9047（经验）。
- Encoder 输出的是 log variance，不是 $\sigma$；`reparameterize()` 和 `log_normal_pdf(sample, mean, logvar, raxis=1)` 都按这个约定写。后者在算 prior 时，传进来的 mean 和 logvar 是标量 0，要能 broadcast（notebook）。
- 两个 regularizer 的符号要一致：给定的 `loss_KL_wo_E` 返回的是 $-D_{\text{KL}}$，`loss_SGVB` 返回 $\log p(z)-\log q(z\mid x)$；`loss_func` 把它们乘上 `coeff` 加到 $\log p(x\mid z)$ 上再取负。3(b) 的图上两条曲线应随 sample 数增多而重合，对不上先查 `log_normal_pdf` 的符号和 constant 项（notebook）。
- Handout 说 MNIST 当 binary image，notebook 的 `loss_func` 用的却是 MSE，也就是 Lecture 2 第 27 页 fixed std 的 Gaussian decoder；KL 前的 `coeff` 默认是 $10^{-3}$，不是 ELBO 本来的 1。报告里写清实际优化的是哪个 objective（notebook、slides）。
- 3(c) 允许手调 `coeff`。看 latent grid 判断：KL 太弱，grid 上有大片不像数字的空洞；KL 太强，所有 latent 挤向 prior，decode 出来千篇一律，这是 posterior collapse（经验；第 2 站表格的最后一行）。
- `VAE.__init__` 有 `decode_dim` 和 `use_sigmoid` 两个参数，Problem 4 会用 `decode_dim=3, use_sigmoid=False` 调用同一个 class，写 decoder 时就要支持（notebook）。
- Problem 4 给定的训练把 KL 的 `coeff` 设成了 0。Interpolation 的两个端点 $(0,1,0)$ 和 $(0,-1,0)$ 不在 torus 的 surface 上：代入 $(\sqrt{x^2+y^2}-R)^2+z^2$ 得 0，surface 上应是 $r^2=0.25$，它们在 tube 的 center circle 上（notebook，数是我算的）。可选的 4(c)：先看 `generate_torus_point_cloud` 用哪两个量参数化 torus，再想什么样的 latent 能让直线 interpolation 对应这两个量的变化，以及怎样表示它们的 periodicity（经验）。

### Problem Set 2：PixelCNN（先做）

9 月 24 日发布，10 月 8 日截止。

**要实现什么。**

- Problem 1（20 分）：证明对 binary sequence 的 AR model，negative log-likelihood 等于 binary cross-entropy loss（label $y_i=x_i$）。
- Problem 2（30 分）：(a) 实现 `MaskedConv2d`，支持两种 mask：type A 把 kernel 中心的 weight 也置 0，当前 pixel 看不见自己；type B 的中心保留；(b) 用它搭 PixelCNN（若干 masked convolution、nonlinearity、需要的 normalization）；(c) 在 binarized MNIST（threshold 取 0.5）上用 cross-entropy 训练（notebook 默认 100 个 epoch、Adam、learning rate $10^{-3}$），再用给定代码逐个 pixel 生成。
- Problem 3（30 分）：conditional PixelCNN。每层 output 加一个由 label 决定的 bias，$W_\ell*x+b_\ell+V_\ell y$，$y$ 是 one-hot 的 label，$V_\ell y$ 按 channel 加、在空间上 broadcast；训练后每个数字生成 6 张，和 Problem 2 比较。
- Problem 4（20 分）：证明带 $\ell_2$ regularization（即 weight decay，$\lambda\|\theta\|_2^2$）的 maximum likelihood 等价于 Gaussian prior 下的 MAP，并给出这个 prior 的 mean 和 variance。

**做完会什么。** 第 1、3 站：chain rule 落到 pixel 上、teacher forcing、“output $i$ 不依赖 input $\ge i$”在 convolution 上怎样实现，以及 likelihood、cross-entropy、MAP 三者的关系。

**时间和算力。** 训练默认 100 个 epoch（handout 允许调）；生成时每个 pixel 要做一次完整的 forward pass。Free Colab 的 GPU 够用（handout）。估计 6 到 8 小时（经验）。

**提示。**

- Problem 1：把 $x_i=1$ 和 $x_i=0$ 两种情况分开写，看 cross-entropy 的两项各剩下哪一项（经验）。可以拿第 1 站的 bar 世界检验：完美的 model 在任何一张 bar 上的 loss 都是 2 bit。
- 想清楚哪一层必须用 type A：如果第一层也用 type B，位置 $i$ 的 output 能看见 $x_i$ 本身，这正是第 3 站 :::wrong 里“把 target 直接抄过去”的情形（经验；type A、B 的定义来自 handout 的 Figure 1）。Masked kernel 的画法见 [CS5788 的 autoregressive 一站](../courses/CORNELL-CS5788.html#ar)。
- 检查 causality：随机改动某个 pixel 的 input，确认按 raster order 排在它之前的位置 output 一点不变；training loss 低得可疑，多半是 mask 漏了（经验）。
- Training 用的 `F.binary_cross_entropy` 要求 model 的 output 是 probability，形状和 image 一样是 $(B,1,28,28)$（notebook）。
- 给定的 generation cell 只对 $i>0$ 且 $j>0$ 的 pixel 做 forward 和 sample，第一行、第一列留 0（MNIST 的边框本来是黑的），一共 $27\times27=729$ 次 forward。“Reconstruction”那一格只做一次 forward，每个 pixel 的 condition 是真图像的 prefix，所以它看起来好不代表 generation 好（notebook；对照第 3 站“没见过的 prefix”）。
- Problem 3：先想清楚 $V_\ell$ 的形状，$y$ 是 10 维，output 有 $C$ 个 channel（handout 说 $V_\ell$ 是一个 2D 的 weight matrix）。
- Problem 4：handout 的提示是把 $p_\theta(x;\theta)$ 看成 $p(x\mid\theta)$。用 Bayes rule 拆开 $\log p(\theta\mid x)$ 之后，看哪一项与 $\theta$ 无关，Gaussian 的 log density 里哪一项对应 $\lambda\|\theta\|^2$（经验）。

### Problem Set 3：GAN 与 optimal transport（值得做）

10 月 8 日发布，10 月 22 日截止。

**要实现什么。**

- Problem 1（20 分）：MNIST 上的 unconditional GAN。Generator 和 discriminator 都是 MLP，用 LeakyReLU，不用 batch normalization；G 的 hidden 是 128、256、512，D 是 512、256、128，D 用 dropout，G 不用。画 loss curve 和生成的图。
- Problem 2（15 分）：三组 ablation：G 的 channel 翻倍；D 加层；每更新 G 一次就更新 D 十次。
- Problem 3（15 分）：conditional GAN。G 和 D 都用 embedding layer 表示 label，G 把 embedding 拼在 noise 上，D 拼在 image 上。
- Problem 4（20 分）：(a) 推出固定 $G$ 时的 optimal discriminator；(b) 证明 $C(G)=\max_DV(D,G)$ 的 global minimum 当且仅当 $p_g=p_{\text{data}}$ 时取到，值是 $-\log4$。
- Problem 5（20 分）：离散的 optimal transport。两个 distribution $v\in\mathbb R^{k_1}$、$w\in\mathbb R^{k_2}$，cost matrix $C=[c_{ij}]$；primal 是在 $T\ge0$、行和为 $v$、列和为 $w$ 的约束下求 $\min\sum_{ij}T_{ij}c_{ij}$。用 Lagrange multiplier 推出 dual：$\max_{\phi,\psi}\sum_iv_i\phi_i+\sum_jw_j\psi_j$，约束是对所有 $i,j$，$\phi_i+\psi_j\le c_{ij}$。

**做完会什么。** 第 5 站全部，外加 Kantorovich–Rubinstein duality 在离散情形下的来历。

**时间和算力。** Notebook 默认每次训练 500 个 epoch，每个 epoch 结束都画图；Problem 1 到 3 一共要训练 5 次。都是 MLP，free Colab 的 GPU 够（handout），但 5 次各 500 个 epoch 加起来要很多小时（估计）。两道理论题估计 3 到 4 小时（经验）。

**提示。**

- Data loader 做了 `Normalize(0.5, 0.5)`，pixel 在 $[-1,1]$；loss 是 `nn.BCELoss`。所以 D 的最后一层要输出 probability，G 的最后一层要输出和 data 同一个范围的值（notebook）。
- 给定的 `train_generator` 优化的是 `criterion(D(G(z)), 1)`，即 $-\log D(G(z))$，第 5 站的 non-saturating 版本；另外记录的 `g_loss_fake` 是 $-\log(1-D(G(z)))$，只画不优化。读 loss 图时先分清四条曲线各是什么（notebook；Lecture 4 第 38、39 页注明“所有 objective 都取了原式的负号”）。
- “D 更新 10 次、G 更新 1 次”不用改 training loop：`train_main_loop` 有一个 `d_freq` 参数（notebook）。
- Conditional D 的 `forward` 先把 image view 成 784 维，再拼 label 的 embedding，第一层 Linear 的 input 维数要跟着改（notebook）。
- 先用少量 epoch 跑通，看 notebook 每 100 个 step 打印的 $D(x)$ 和 $D(G(z))$ 的平均值：两者迅速分到 1 和 0，说明 D 太强、G 拿不到 gradient；sample 只剩一两种数字是 mode collapse（经验，对应 Lecture 4 第 42 页的三类问题）。Lecture 4 第 41 页给了这份代码的来源（改编自 prcastro/pytorch-gan）在 epoch 1、20、50、300、500 的 sample，可以当参照。另一个能手算的 training dynamics 的 toy（Dirac GAN）见 [CS5788 的 GAN 一站](../courses/CORNELL-CS5788.html#gan)。
- 4(a)(b)：第 5 站的推导就是 Goodfellow et al. 2014 的思路。写作业时要补全两处理由：为什么可以对每个 $x$ 单独 maximize integrand，以及 $D_{\text{JS}}=0$ 为什么只在两个 distribution 相等时成立（经验）。
- Problem 5：两组 equality constraint 各配一组 multiplier（它们就是 $\phi$ 和 $\psi$），$T\ge0$ 配第三组；对 $T$ 取 inf 时，想清楚什么条件下 Lagrangian 不会趋于 $-\infty$（handout 指向 KKT 条件，其余是经验）。推完可以用 `scipy.optimize.linprog` 在一个 $2\times2$ 的小例子上数值核对 primal 和 dual 的最优值相等，并用第 5 站的一维 cdf formula 再算一遍（经验）。

### Problem Set 4：DDPM 与 SDE（先做）

10 月 22 日发布，11 月 5 日截止。

**要实现什么。**

- Problem 1（40 分）：在 MNIST 上实现 class-conditional 的 DDPM。(a) `ddpm_schedules()`：$\beta_t$ 从 $\beta_{\min}$ 线性增加到 $\beta_{\max}$，再算出 $\alpha_t$、$\bar\alpha_t$ 和 notebook 要的其余几个量（$1/\sqrt{\alpha_t}$、$\sqrt{\beta_t}$、$\sqrt{\bar\alpha_t}$、$\sqrt{1-\bar\alpha_t}$、$(1-\alpha_t)/\sqrt{1-\bar\alpha_t}$）；(b) forward process；(c) `sample()`：从 $x_T\sim N(0,I)$ 出发，按 handout 给的 reverse step 一步步走回去，这一步就是第 6 站算出的 $\tilde\mu_t$（$\varepsilon$ 换成 $\varepsilon_\theta$）再加 $\sigma_tz$；(d) 用给定代码训练。Network 是给定的 `ContextUnet`（label 和 $t$ 都是 input），sampling 带 classifier-free guidance，guidance weight 取 0、0.5、2.0。
- Problem 2（30 分）：ablation：把 $T$ 改成 2000 和 500；inference 时用 50 步和 100 步的 resampling schedule，代替 training 时的全部步数。
- Problem 3（40 分）：continuous-time 的 toy，记号跟 Song et al. 的 SDE 论文 Appendix C 里 DDPM 对应的 SDE。Data 是两个 Gaussian 的 mixture（notebook 里 mean $\pm0.5$、std 0.02、各一半，$\beta_{\min}=0.1$、$\beta_{\max}=50$，离散成 1000 步）：(a) 写出 $p(x(t))$；(b) 写出 $\nabla_x\log p_t(x)$ 的 analytic 形式（实际中这一项由 network 学）；(c) 实现两者，画出 forward 和 reverse SDE 的 trajectory。

**做完会什么。** 第 6 站的前三小节：forward process 的 closed form、reverse step 的 formula 从哪里来、noise prediction 与 score 的关系；外加 classifier-free guidance 的实现和 sampling 步数的取舍。

**时间和算力。** `ContextUnet` 取 `n_feat=128`，notebook 默认 $T=400$、20 个 epoch，每个 epoch 末尾对三个 guidance weight 各做一次完整的 $T$ 步 sampling；Problem 2 还要再训练两次。Free Colab 的 T4 可以做，全部跑完要几个小时（估计）。Problem 3 是 numpy，CPU 上几秒。

**提示。**

- Handout 写的是 $t=0,\dots,T-1$ 共 $T$ 个 $\beta$，notebook 的 `sample()` 循环却是 `for i in range(self.n_T, 0, -1)`，会用到 index $T$；schedule array 的长度和 index 约定要和这个循环对上（notebook）。
- Handout 说 `forward()` 返回 $x_t$，notebook 的 training loop 却写 `loss = ddpm(x, c)`；以 notebook 为准，`forward` 里抽 $t$ 和 noise、算 $x_t$，再返回 loss（notebook）。
- `ContextUnet.forward(x, c, t, context_mask)` 里 `context_mask` 为 1 的样本，label 会被清零，表示不给 condition；`sample()` 把后一半 batch 的 mask 设成 1，注释是 context-free。Training 时要按 `drop_prob=0.1` 随机设这个 mask，sampling 时的 guidance 才有东西可用（notebook）。
- Time embedding 是 `EmbedFC(1, …)`，直接吃一个 real number。传 integer 的步数还是除以 $T$ 之后的值都可以，但 training 和 sampling 必须一致（notebook；“必须一致”是经验）。
- 给定的 training loop 每个 epoch 对三个 guidance weight 都 sample 一次，却只画最后一个（$w=2.0$）；调试时可以先只留一个（notebook）。
- Problem 2 改 $T$ 时 $\beta$ 的范围不变，$x_T$ 离纯 noise 有多远会跟着变：$T=400$ 时 $\bar\alpha_T=0.0175$（$x_T$ 里 data 的系数 $\sqrt{\bar\alpha_T}$ 还有 0.13），$T=500$ 时 0.0064，$T=1000$ 时 $4.0\times10^{-5}$。Handout 说 training 用 1000 步，notebook 默认是 400，报告里写清 baseline 用的是哪个（数是我算的）。
- 跳步的 resampling schedule：保留下来的那些 $t$ 上 $\bar\alpha_t$ 不变，相邻两个保留步之间的 $\beta$、$\alpha$ 要由它们重新推出来，不能沿用原来那一步的 $\beta_t$（经验）。只用 $\bar\alpha$ 跳步的另一种做法（DDIM）见 [CS5788 的 diffusion 一站](../courses/CORNELL-CS5788.html#diff)。
- Lecture 5 第 37 页 $\tilde\mu_t$ 的系数印成了 $1/\sqrt{\bar\alpha_t}$，handout 和 DDPM 的 Algorithm 2 是 $1/\sqrt{\alpha_t}$，第 6 站有三行核对。
- Problem 3：先写出单个 Gaussian 经过这个 SDE 之后在时刻 $t$ 的 distribution（Appendix C 给了 perturbation kernel，要用到 $\int_0^t\beta(s)\,ds$），再利用 mixture 的 linearity。Notebook 的 $t$ 是 0 到 999 的 integer index，`get_beta_t` 里除以了 `timesteps`，integral 也要用同一个换算（handout、notebook）。
- Notebook 给的 `backward_sde` 里，更新那一行是 `x[t] + (f - g**2 * score) * dt + ...`。我用正确的 score 照这一行跑，sample 发散到 $10^8$ 的量级；想清楚 reverse SDE 里时间倒着走时 $dt$ 的符号，再核对这一行（经验，跑过）。
- Std 只有 0.02，在 `x_grid` 两端直接算 pdf 再相除会出现 $0/0$；在 log 域里算更稳（经验）。

### Problem Set 5：Conditional flow matching（先做）

11 月 5 日发布；schedule 写 11 月 19 日截止，handout 上印的是 11 月 12 日，以 Canvas 为准。

**要实现什么。** 记号跟 Lipman et al. 的 Flow Matching 论文：$x_0$ 是 noise，$x_1$ 是 data，$t=1$ 是 data 端，和本页第 6、8 站相反。

- Problem 1（40 分）：在 MNIST 上实现 conditional flow matching，用 optimal transport 的 conditional vector field：$\mu_t(x)=tx_1$，$\sigma_t(x)=1-(1-\sigma_{\min})t$，$\psi_t(x)=\big(1-(1-\sigma_{\min})t\big)x+tx_1$，loss 是 $\mathbb E\,\big\|v_t(\psi_t(x_0))-\big(x_1-(1-\sigma_{\min})x_0\big)\big\|^2$，$\sigma_{\min}=0$。要写 `compute_mu_t()`、`compute_sigma_t()`、`compute_conditional_flow()`、`sample_xt()`，再用给定代码训练（UNet，`n_feat=128`，10 个 epoch）；sampling 用 `torchdiffeq.odeint`（默认 `dopri5`）从 $t=0$ 积到 1。
- Problem 2（30 分）：ablation：ODE solver 换成 `dopri8`、`bosh3`、`fehlberg2`、`adaptive_heun` 中的两个；把 conditional vector field 换成 diffusion 的那一种。
- Problem 3（30 分）：二维 toy。Source 是 $N((-10,0),I)$，target 是 $N((10,0),I)$，conditional path $x_t=(1-t)x_0+tx_1$，$x_0$、$x_1$ 独立配对。(a) 推出 marginal flow $u(x_t)$ 的 closed form；(b) 实现 `conditional_paths()` 和 `marginal_flow()`；画出 conditional path 和 marginal path，对照 handout 指定的 Cambridge MLG flow matching blog 的 Figure 11、12。

**做完会什么。** 第 6 站 interpolant 与 prediction target 的部分在另一套记号下再走一遍，以及“conditional path 会交叉、marginal flow 不会”。为什么 regress conditional velocity 能学到 marginal，见 [6.S184 第 3 站](../courses/MIT-6.S184.html#fm)。

**时间和算力。** 10 个 epoch 的 UNet 在 free Colab 的 GPU 上可以做（handout）；adaptive solver 的步数随 tolerance 变，sampling 时间不固定。Problem 3 是 numpy。估计 6 到 8 小时（经验）。

**提示。**

- 先确定 $t$ 的方向：这份作业 $t=1$ 是 data，SD3、SiT 的 linear path 和 MeanFlow 是 $t=1$ 为 noise；照抄 formula 时一个符号就会反（经验）。
- 对照 `train_main_loop` 看 `x0`、`x1` 各是什么（`x0 = torch.randn_like(x1)`），再想 $\sigma_{\min}=0$ 时 `sample_xt` 的 `epsilon` 参数和 $\sigma_t$ 起什么作用；handout 的写法和 notebook 的函数签名要先对上（notebook）。
- `t` 的形状是 $(B,)$，和 $(B,1,28,28)$ 的 image 相乘前要 reshape，notebook 给了 `pad_t_like_x` 这个 helper（notebook）。
- 比较 solver 时同时记下 network evaluation 的次数（NFE），给 model 包一层计数器即可；只看图像质量看不出 adaptive solver 花了多少步（经验）。
- Diffusion 的 conditional vector field 在 Lipman et al. 论文第 4.1 节的 Example I（VE 和 VP 两种）；VP 那个的 denominator $1-\alpha_{1-t}^2$ 在 $t\to1$（data 端）时趋于 0，论文 training 时把 $t$ 限制在 $[0,1-10^{-5}]$（论文）。
- Problem 3：$x_t$ 和 $x_1-x_0$ 是 jointly Gaussian，所以 $\mathbb E[x_1-x_0\mid x_t=x]$ 是 $x$ 的 linear function（经验）。也可以照 handout 的 formula 对 $x_1$ 求 integral；那样 $u_t(x\mid x_1)$ 里会出现 $1/(1-t)$，而 `generate_marginal_paths` 最后一次正好在 $t=1$ 处调用 `marginal_flow`，端点要处理（notebook）。
- 画出来的 conditional path 会交叉，marginal path 不会，因为同一个 ODE 的解不相交；marginal path 交叉了，就是 formula 或实现有错（经验）。

### Problem Set 6：Consistency model（值得做）

11 月 19 日发布，12 月 3 日截止。

**要实现什么。** 记号跟 Consistency Models 论文：noise 端 $T=80$，data 端 $\epsilon=0.002$；MNIST pad 到 $32\times32$、缩放到 $[-1,1]$。

- Problem 1（60 分）：(a) `forward()`：按论文 Appendix C 的 $c_{\text{skip}}$、$c_{\text{out}}$ 实现 $f_\theta(x,t)=c_{\text{skip}}(t)\,x+c_{\text{out}}(t)\,F_\theta(x,t)$（UNet 部分已给）；(b) `sample()`：论文 Algorithm 1 的 multistep sampling；(c) `loss()`：consistency training 的 loss，target 一侧用 EMA model；(d) 用给定代码训练（默认 `n_feat=256`、100 个 epoch）。
- Problem 2（40 分）：ablation：`n_feat` 取 256、128、64；sampling 从默认的 5 步（$t=80,40,20,10,5$）改成 2 步，讨论质量和计算量的取舍。

**做完会什么。** 第 8 站 consistency model 一小节的全部：boundary condition 怎样靠 parameterization 保证、self-consistency 怎样变成一个 loss、多步 sampling 怎样用步数换质量。

**时间和算力。** 默认 `n_feat=256` 训练 100 个 epoch，Problem 2 还要再训练两个更小的 model；free Colab 一次 session 未必够，先用少量 epoch 确认 loss 和 sample 正常（估计）。

**提示。**

- Training loop 里的时间是 `boundaries[t]`，`t` 是 $(B,1)$ 的 integer index，所以时间的形状是 $(B,1)$；`forward` 最后一行写的是 `c_skip_t[:, :, None, None] * x_ori`，$c_{\text{skip}}$、$c_{\text{out}}$ 也要算成 $(B,1)$（notebook）。
- 写完 (a) 先查 boundary condition：$t=\epsilon$ 时不论 network 输出什么，$f_\theta(x,\epsilon)$ 都应等于 $x$；第 8 站给了 $c_{\text{skip}}$、$c_{\text{out}}$ 在几个 $t$ 上的值可以对照（经验）。
- `model.loss(x, z, t_0, t_1, ema_model)` 收到的两个时间里，`t_0` 是较小的 $t_n$，`t_1` 是较大的 $t_{n+1}$；对照 handout 的 $\mathcal L_{\text{NCT}}$，决定哪个时间给正在训练的 model、哪个给 EMA model，以及哪一侧不要 gradient（notebook、handout）。
- Handout 没规定距离 $d(\cdot,\cdot)$ 和 weight $\lambda(t_n)$。Yang Song 的 lecture 第 45、47 页：iCT 给小 noise level 更大的 weight，squared L2 效果差，改用 pseudo-Huber（slides）。
- `sample(x, ts)` 收到的 `ts` 第一个就是 $T=80$，传进来的 `x` 已经乘了 80；Algorithm 1 的第一步和循环里的步不一样，循环里加 noise 用的是 $\sqrt{\tau_n^2-\epsilon^2}$（notebook、论文 Algorithm 1）。
- 给定的 training loop 已经写好了离散步数 $N$ 和 EMA rate 的 schedule：$N$ 随 epoch 从 16 增加到 150（第 1 个 epoch 算出来是 16），EMA 的 $\mu=\exp(2\log0.95/N)$，$N=16$ 时 0.9936，$N=150$ 时 0.9993；不用自己写（notebook，数是我算的）。
- 第 8 站的 $\pm1$ toy 换成这份作业的 $x+tz$ 写法，consistency function 仍是 $\mathrm{sign}(z)$：data 关于 0 对称，$z=0$ 处 velocity 为 0，别的 trajectory 穿不过 0。可以先用它代替 network 测 `sample()` 的逻辑（经验）。

### Seminar presentation

每次 reading session 讲三篇论文，每个学生负责其中一篇：约 20 分钟报告，之后约 10 分钟讨论和问答；报告前一周报名选时段，报告前一天（周一或周三）下午 1 点前上传 slides。分项是按时报名与上传 5%、presentation 20%（清楚、深度、互动）、讨论 5%（课程主页）。提示（都是经验）：

- 用第 1 站的问法开场：这篇论文的 $x$ 和 $y$ 是什么，它把 joint distribution 怎样拆，哪一块是设计的、哪一块是学的。Kaiming He 的 lecture 一直这样讲。
- 三篇论文放在一起讲它们的差别。例如 “AR and Diffusion” 的 MAR、Transfusion、Show-o 都在一个 model 里同时用 AR 和 diffusion，分工却不同。
- 每篇挑一个 ablation 表讲透（像第 7 站 MAR 的 Table 1），比列满所有结果有用。

### Final project

最多两人一组，交 proposal、做 final presentation、写一篇 blog post。课程主页要求 blog post 面向一般读者，有入门和教学性质，并给了六个范例：Yang Song 讲 score 的 blog、Sander Dieleman 的 perspectives on diffusion、Lilian Weng 的 video diffusion、一篇关于 AI 前景的科普长文（The AI Revolution: The Road to Superintelligence）、Chris Olah 讲 LSTM、Andrej Karpathy 讲 RNN。提示（经验）：

- 范例都是“一个问题讲透”，配大量自己画的图。选题时先想清楚一个 toy 能不能把核心现象演示出来，就像第 8 站的 $\pm1$ toy 演示了一步生成为什么失败。
- 算力有限时，二维 toy、MNIST、CIFAR-10 上的对比实验足够支撑一篇好的 blog；第 6 站的 SiT 式 ablation（换一个 design choice、其余不动）是最容易做出可信结论的实验设计。6 份 pset 的 notebook 都是在 MNIST 上从零训练，可以直接当起点。
