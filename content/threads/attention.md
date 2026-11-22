---
title: 按内容去取
lead: "从一串长度不定的 vector 里，按此刻的需要取出一个加权平均，而且这一步能求 derivative。Bahdanau 的 alignment、Transformer 的 self-attention、FlashAttention、KV cache、PagedAttention、ViT、CLIP 和 VLA 的 action expert，算的都是同一个 softmax 加权平均，各门课换的是 query 从哪来、key 和 value 存在哪、mask 掉哪些格子。"
line: ml
---

先看一个翻译的问题。[CS4248 第 5 站](../courses/CS4248.html#rnn)的 encoder 读完 the green witch，留下三个 state（取成 2 维）：

$$h_{\text{the}}=(1,\,0),\qquad h_{\text{green}}=(0.5,\,2),\qquad h_{\text{witch}}=(1.5,\,0.5)$$

Decoder 正要生成 verde，它需要的是 green 那个位置的信息。

**第一个办法：只留最后一个 state。** 原来的 encoder-decoder 就是这样：decoder 只拿到 $h_{\text{witch}}$。源句 3 个 word 留下 2 个数，50 个 word 还是 2 个数（真实的 model 是 $d$ 个）。Bahdanau、Cho、Bengio 2014 年的实验里，这样的 model（他们叫 RNNencdec）BLEU 随句子变长急剧下降。

**第二个办法：像 dictionary 那样查。** 三个 state 都留着，decoder 拿自己的 state $q=(0,1)$ 和每个 $h_j$ 做 dot product，取分数最大的那个。分数是 $0$、$2$、$0.5$，取出 $h_{\text{green}}$，答案对了，可是这一步没法训练。$q$ 是 network 算出来的，要靠 gradient 学会“生成 verde 时去找 green”。把 $q$ 转一点，argmax 还是 green，取出的东西一点不变，derivative 是 0；转过某个角度，取出的东西突然跳成另一个 $h_j$，那里 derivative 不存在。Gradient 说不出 $q$ 该往哪边转。

**第三个办法：三个都要，取平均。** $\tfrac13(h_{\text{the}}+h_{\text{green}}+h_{\text{witch}})=(1,\ 0.833)$。它处处可导，可是根本不依赖 $q$：生成 verde 和生成 bruja 时取出同一个 vector。

要的东西介于两者之间：结果主要来自分数高的那个，同时随 $q$ 连续地变。把分数过一个 softmax 当作 weight，再对 $h_j$ 加权平均：

$$\alpha=\mathrm{softmax}(0,\ 2,\ 0.5)=(0.100,\ 0.736,\ 0.164),\qquad c=\sum_j\alpha_jh_j=(0.714,\ 1.554)$$

这就是 attention。它在下面十二门课里出现，名字、记号、用途各不相同。先把它的骨架完整推一遍：它的 gradient、它的 temperature、它为什么可以一块一块地算、为什么可以 cache；然后用一张表对齐各课的名字和记号，再逐门课看它往骨架上加了什么。

::fig[thread-attention-lookup] 动图：query 的方向 $q=(\cos\theta,\sin\theta)$ 从 90° 转到 0°，再转到 150°。方块是 hard lookup 取出的 vector，$q$ 越过虚线（33.7°，那里 $q\cdot h_{\text{green}}=q\cdot h_{\text{witch}}$）时它从 green 跳到 witch；圆点是 softmax 加权平均，沿淡色的曲线连续地走。第一帧是 $q=(0,1)$。

## 骨架

### Soft lookup：query、key、value

一般的写法：有 $n$ 对 $(k_j,v_j)$ 和一个 query $q$，

$$s_j=\frac{q\cdot k_j}{\tau},\qquad\alpha_j=\frac{e^{s_j}}{\sum_ie^{s_i}},\qquad o=\sum_{j=1}^n\alpha_jv_j$$

Key 决定 weight，value 是被取走的内容。翻译的例子里 $k_j=v_j=h_j$，$\tau=1$。把 key 和 value 分开的理由在 [CS4248 第 6 站](../courses/CS4248.html#attn)：“看谁”和“取什么”是两件事。定义里马上能读出三件事：

- $\alpha_j>0$，$\sum_j\alpha_j=1$，所以 $o$ 落在 $v_1,\dots,v_n$ 的 convex hull 里。
- $\tau\to0$ 时 weight 全部集中到分数最大的 key 上，$o$ 变成 hard lookup；$\tau\to\infty$ 时所有 $s_j\to0$，$o$ 变成平均。开头的第二、第三个办法是 attention 的两个极限。
- 所有 $s_j$ 加上同一个 constant $c$，numerator 和 denominator 同乘 $e^c$，$\alpha$ 不变。

### Gradient：把 output 往哪个 value 推

[CS4248 第 6 站](../courses/CS4248.html#attn)推过 softmax 的 Jacobian：$\partial\alpha_i/\partial s_j=\alpha_i(\delta_{ij}-\alpha_j)$。代进 $o=\sum_i\alpha_iv_i$：

$$\frac{\partial o}{\partial s_j}=\sum_iv_i\,\alpha_i(\delta_{ij}-\alpha_j)=\alpha_jv_j-\alpha_j\sum_i\alpha_iv_i=\alpha_j\,(v_j-o)$$

提高 $s_j$，$o$ 就朝 $v_j$ 移动，力度是 $\alpha_j$。两种情形下这个 derivative 几乎是 0：$\alpha_j\approx0$，这个 key 被忽略，即使 $v_j$ 正是想要的，gradient 也找不到它；$\alpha_j\approx1$，$v_j\approx o$，已经取到了。Weight 接近 one-hot 时每个 key 都落在这两种情形之一，这就是 CS4248 讲 $1/\sqrt{d_k}$ 时说的 saturation。

设 loss 是 $L(o)$，$g=\partial L/\partial o$。由 chain rule，

$$\frac{\partial L}{\partial s_j}=\alpha_j\,g\cdot(v_j-o),\qquad\sum_j\frac{\partial L}{\partial s_j}=g\cdot\Big(\sum_j\alpha_jv_j-o\sum_j\alpha_j\Big)=g\cdot(o-o)=0$$

Score 的 gradient 加起来为 0，和“所有 $s_j$ 同加一个 constant 不改变结果”是同一件事。再由 $s_j=q\cdot k_j/\tau$，

$$\frac{\partial L}{\partial q}=\frac1\tau\sum_j\frac{\partial L}{\partial s_j}\,k_j$$

拿翻译的例子用一次。设 decoder 要生成的是 bruja，需要 $h_{\text{witch}}$，loss 取 $L=\tfrac12\|o-h_{\text{witch}}\|^2$，于是 $g=o-h_{\text{witch}}=(0.714-1.5,\ 1.554-0.5)=(-0.786,\ 1.054)$：

| | the | green | witch |
|---|---|---|---|
| $v_j-o$ | $(0.286,\ -1.554)$ | $(-0.214,\ 0.446)$ | $(0.786,\ -1.054)$ |
| $g\cdot(v_j-o)$ | $-1.863$ | $0.638$ | $-1.729$ |
| $\partial L/\partial s_j=\alpha_j\,g\cdot(v_j-o)$ | $-0.186$ | $0.470$ | $-0.284$ |

三个数加起来是 0。Gradient descent 压低 green 的分数，抬高 witch 的分数，也抬高 the 的分数：$h_{\text{the}}$ 同样在 $o$ 朝目标要走的那一侧，$g\cdot(v_{\text{the}}-o)<0$。传到 $q$：

$$\frac{\partial L}{\partial q}=-0.186\,(1,0)+0.470\,(0.5,2)-0.284\,(1.5,0.5)=(-0.377,\ 0.797)$$

取 step size 1，$q$ 从 $(0,1)$ 变成 $(0.377,\ 0.203)$，weight 变成 $(0.280,\ 0.347,\ 0.373)$，loss 从 0.865 降到 0.191。

::fig[thread-attention-grad] 动图：接着走 40 步。第 1 步 green 的 weight 就从 0.736 掉到 0.347；之后 the 和 witch 的 key 方向相近，两者只能靠 $q$ 变长慢慢分开。第 40 步 witch 的 weight 是 0.608，$\|q\|$ 从 1 变成 1.67。

最后这件事值得算清楚。$\alpha_{\text{witch}}/\alpha_{\text{the}}=e^{q\cdot(k_{\text{witch}}-k_{\text{the}})}=e^{q\cdot(0.5,\,0.5)}$。要 witch 的 weight 是 the 的 9 倍，需要 $q\cdot(0.5,0.5)\ge\ln9=2.197$，而 $\|(0.5,0.5)\|=0.707$，所以 $\|q\|\ge2.197/0.707=3.11$。只转方向不够，$q$ 必须变长。

### Temperature：查得多准

把 $q$ 乘以 $c$，等于把 $\tau$ 除以 $c$：$(cq)\cdot k_j/\tau=q\cdot k_j/(\tau/c)$。所以上一节里 $\|q\|$ 变长，就是 temperature 在降低。同一个 $q=(0,1)$ 换不同的 $\tau$：

| $\tau$ | $\alpha$ | $o$ |
|---|---|---|
| 4 | $(0.264,\ 0.436,\ 0.300)$ | $(0.932,\ 1.022)$ |
| 2 | $(0.200,\ 0.543,\ 0.257)$ | $(0.857,\ 1.215)$ |
| 1 | $(0.100,\ 0.736,\ 0.164)$ | $(0.714,\ 1.554)$ |
| 0.5 | $(0.017,\ 0.936,\ 0.047)$ | $(0.555,\ 1.896)$ |
| 0.25 | $(0.0003,\ 0.997,\ 0.0025)$ | $(0.503,\ 1.996)$ |

$\tau=4$ 时 $o$ 已经靠近平均 $(1,\ 0.833)$，$\tau=0.25$ 时几乎就是 $h_{\text{green}}$。

Dimension 大时，$\tau$ 不能随便取。$q$、$k$ 的 component 互相 independent、mean 0、variance 1 时，$q\cdot k$ 是 $d_k$ 项之和，variance 是 $d_k$（Vaswani 等人 2017 年论文的 footnote 写的就是这一句，推导在 CS4248 第 6 站）。取 $\tau=\sqrt{d_k}$，score 的 variance 回到 1。换一个角度看同一件事：这样的 $q$、$k$ 长度都约为 $\sqrt{d_k}$，所以

$$\frac{q\cdot k}{\sqrt{d_k}}=\frac{\|q\|\,\|k\|}{\sqrt{d_k}}\cos(q,k)\approx\sqrt{d_k}\,\cos(q,k)$$

$d_k=64$ 时约是 $8\cos(q,k)$（两万对 random vector 的 median 是 7.9）。这个“乘在 cosine 前面的数”在 CLIP 那一节会再出现。

:::wrong 除以 $\sqrt{d_k}$ 之后，attention 的 logits 就不会太大
$\sqrt{d_k}$ 只管 initialization 那一刻的 variance。$W^Q$、$W^K$ 是 train 出来的，$\|q\|$、$\|k\|$ 会变：上面 40 步里 $\|q\|$ 从 1 长到 1.67，而且要把 the 和 witch 分清，它还得长到 3.11 以上。Logits 随训练变大，softmax 就走向 saturation，gradient 又回到上一节那两种几乎为 0 的情形。[CS336 第 4 站](../courses/STANFORD-CS336.html#train)的 QK-norm 就是为此加的：$q$、$k$ 先各过一次 RMSNorm，长度由 gain 决定，logits 有了上界。
:::

### Matrix 写法、mask 与 cost

$n$ 个 query 叠成 $Q$（$n\times d_k$），key、value 叠成 $K$、$V$，一次算完所有 query：

$$O=\mathrm{softmax}\Big(\frac{QK^\top}{\sqrt{d_k}}+M\Big)V,\qquad M_{ij}\in\{0,\ -\infty\}$$

Softmax 按 row 做。$M_{ij}=-\infty$ 的格子 $e^{-\infty}=0$，key $j$ 对 query $i$ 就不存在。Mask 是这条线上改得最多的零件：GPT 的 causal（$j>i$ 处为 $-\infty$），ViT 和 BERT 的全 0，π0 的 block-causal。一整行都是 $-\infty$ 时 weight 是 $0/0$，CS336 第 4 站把它列为 NaN 的一个来源。

$QK^\top$ 有 $n^2$ 个 entry。一层里 score 和乘 $V$ 共 $4n^2d$ 个 FLOP，四个 projection 和 FFN 共 $24nd^2$，之比 $n/6d$（CS4248 第 6 站）。

### 一个比值：可以分块，可以换顺序

把 $o$ 的 numerator 和 denominator 分开写。对 key 的任意一个 set $S$，令

$$\Lambda(S)=\sum_{j\in S}e^{s_j},\qquad U(S)=\sum_{j\in S}e^{s_j}\,v_j,\qquad o=\frac{U(S)}{\Lambda(S)}$$

$S$ 分成不相交的 $S_1$、$S_2$ 时，

$$\Lambda(S_1\cup S_2)=\Lambda(S_1)+\Lambda(S_2),\qquad U(S_1\cup S_2)=U(S_1)+U(S_2)$$

两边都只是加法。所以 attention 可以按任意分组、任意顺序、在任意几台机器上分别算部分和，最后加起来，结果和一次算完完全相同。

实际不能直接存 $e^{s_j}$：$s_j$ 过 89 就在 fp32 里 overflow。办法是存一个参照点 $m$ 和按它缩小过的量，状态是三个数

$$(m,\ l,\ u),\qquad l=e^{-m}\Lambda,\qquad u=e^{-m}U$$

$m$ 取见过的最大 score，于是 $l$、$u$ 里每一项的 exponent 都不超过 0。两个状态合并：

$$m=\max(m_1,m_2),\qquad l=e^{m_1-m}\,l_1+e^{m_2-m}\,l_2,\qquad u=e^{m_1-m}\,u_1+e^{m_2-m}\,u_2$$

它对吗？两边乘 $e^m$：$e^ml=e^{m_1}l_1+e^{m_2}l_2=\Lambda_1+\Lambda_2$，$u$ 同理。合并就是 $\Lambda$ 和 $U$ 的加法，所以它满足 associative law 和 commutative law，分组和顺序都随意。空 set 的状态是 $(-\infty,\ 0,\ 0)$，和任何状态合并都不改变它。最后 $o=u/l$，$\log\Lambda=m+\ln l$ 就是这一行 score 的 log-sum-exp。

[CS336 第 5 站](../courses/STANFORD-CS336.html#gpu)的例子：一行 score $s=(1,2,3,0)$，value $v=(10,20,30,40)$。直接算：$\Lambda=e+e^2+e^3+1=31.193$，$U=10e+20e^2+30e^3+40=817.53$，$o=26.209$。分三种方式合并：

| 分组 | 部分结果 $(m,\ l,\ u)$ | 合并后 |
|---|---|---|
| 一个一个读 | $(1,\,1,\,10)\to(2,\,1.368,\,23.68)\to(3,\,1.503,\,38.71)$ | $(3,\ 1.553,\ 40.70)$ |
| 相邻两块 $\{1,2\}$、$\{3,0\}$ | $(2,\ 1.368,\ 23.68)$，$(3,\ 1.050,\ 31.99)$ | $(3,\ 1.553,\ 40.70)$ |
| 不相邻两块 $\{1,0\}$、$\{2,3\}$ | $(1,\ 1.368,\ 24.72)$，$(3,\ 1.368,\ 37.36)$ | $(3,\ 1.553,\ 40.70)$ |

三行都是 $u/l=40.70/1.553=26.21$，$m+\ln l=3+\ln1.553=3.440$。核对第二行的合并：$m=3$，$l=e^{2-3}\times1.368+1.050=0.503+1.050=1.553$，$u=e^{-1}\times23.68+31.99=8.71+31.99=40.70$。

::fig[thread-attention-merge] 动图：同一行 score 的三种算法。第一行每次合并一个 key，这是 online softmax；第二行先在两个相邻的 tile 里各自算完；第三行的两块不相邻，可以放在 memory 的任何地方、交给两个 SM 同时算。合并的结果都是 $(3,\ 1.553,\ 40.70)$。

后面各节反复用到这个合并：第一行是 FlashAttention 沿 key 的方向扫 tile；第三行是 PagedAttention 读不连续的 block、Flash-Decoding 把一条很长的 KV cache 切开并行算；commutative law 说明 $o$ 只依赖 $\{(k_j,v_j)\}$ 这个 set，和它们的顺序无关，所以 token 的位置必须另外加进去（CS4248 第 6 站交换 token 演示过，[CS231N 第 6 站](../courses/STANFORD-CS231N.html#vit)证明了 permutation equivariance）；存下的 $\log\Lambda$ 让 backward 不必存 $n\times n$ 的 $P$，用 $P_{ij}=e^{s_{ij}-\log\Lambda_i}$ 当场重算。

### Causal mask 让过去不变：KV cache

Language model 一个 token 一个 token 地生成，每生成一个，前缀就长一个。前面的 token 要不要重算？

**Claim。** 每一层都用 causal mask 时，第 $\ell$ 层位置 $i$ 的 hidden state $h_i^\ell$ 只依赖 $x_1,\dots,x_i$。

对 $\ell$ 做 induction。$\ell=0$：$h_i^0$ 是 token $x_i$ 的 embedding 加位置 $i$ 的 embedding（用 RoPE 时没有后一项），只依赖 $x_i$。设第 $\ell$ 层成立。第 $\ell+1$ 层

$$h_i^{\ell+1}=h_i^\ell+\mathrm{Attn}\big(q_i^\ell,\ \{(k_j^\ell,v_j^\ell):j\le i\}\big)+\mathrm{FFN}(\cdots)$$

$q_i^\ell$、$k_j^\ell$、$v_j^\ell$ 是 $h_i^\ell$、$h_j^\ell$ 的 function，mask 保证只用到 $j\le i$，由 induction hypothesis 它们只依赖 $x_1,\dots,x_i$；FFN 只作用在位置 $i$ 上。所以 $h_i^{\ell+1}$ 也只依赖 $x_1,\dots,x_i$。

后果：$x_{t+1}$ 加进来以后，位置 $1$ 到 $t$ 在每一层的 $k$、$v$ 一个数都不变。把它们存下来，新 token 只需算自己在每层的 $q$、$k$、$v$，拿 $q$ 去和 cache 里的全部 key、value 做 attention，再把自己的 $k$、$v$ 追加进 cache。这是 exact 的，结果和整段重算完全一样。

省多少？生成 $T$ 个 token，不 cache 时第 $t$ 步要让 $t$ 个 token 过一遍每个 linear layer，共 $\sum_tt=T(T+1)/2$ 次；cache 之后每步 1 次，共 $T$ 次。$T=256$ 时是 32,896 对 256，128.5 倍。Score 的个数，不 cache 是 $\sum_tt^2=5{,}625{,}216$，cache 之后是 $\sum_tt=32{,}896$；[MIT-6.S978 第 4 站](../courses/MIT-6.S978.html#tok)算 raster AR 生成 $16\times16$ 个 token 时得到的正是这两个数。

不加 mask 时 claim 不成立：BERT 和 ViT 里每个位置看所有位置，加一个 token，所有位置在第 1 层以上的 hidden state 都变，没有东西可以 cache。

::fig[thread-attention-cache] 动图：一个一个加入 token。左边 causal，第 $t$ 步只新算第 $t$ 行，前面各行和 cache 里的 $K$、$V$ 都不动；右边不加 mask，每加一个 token，整张 $t\times t$ 的 score 都要重算。第一帧是第 5 步。

:::wrong 既然 cache 了 $K$ 和 $V$，也该把 $Q$ cache 起来
过去位置的 query 只用来算过去位置的 output，而由上面的 claim，那些 output 不会再变，算完就再也用不到。新 token 的 output 只需要它自己的 $q$ 和全部的 $k$、$v$。所以 cache 的大小是“每个 token、每层、每个 KV head 存一个 key 和一个 value”，$Q$ 不占地方。
:::

## 各门课里的名字和记号

| 课和站 | 那里的名字 | query | key、value | 记号与 scale |
|---|---|---|---|---|
| [CS4248 第 5 站](../courses/CS4248.html#rnn) | attention、alignment | decoder state $s$ | encoder state，$k_j=v_j=h_j$ | $e_j=s\cdot h_j$，$\alpha_j$，$c_i$；不 scale |
| [CS4248 第 6 站](../courses/CS4248.html#attn) | self-attention、causal mask | $q_i=x_iW^Q$ | $x_jW^K$、$x_jW^V$，同一句 | $\alpha_{ij}$，$a_i$，head 数 $A$；$1/\sqrt{d_k}$ |
| [Z2H 第 6 站](../courses/KARPATHY-Z2H.html#gpt) | `Head` | `self.query(x)` | `self.key(x)`、`self.value(x)` | `wei`，`tril`；`head_size**-0.5` |
| [CS336 第 2 站](../courses/STANFORD-CS336.html#arch) | causal multi-head attention、RoPE | $Q$ | $K$、$V$ | shape `(B, 16, T, 32)`；$1/\sqrt{d_k}$ |
| [CS336 第 5 站](../courses/STANFORD-CS336.html#gpu) | FlashAttention-2 | $Q$ 的一块，$B_q$ 行 | $K$、$V$ 的一块，$B_k$ 行 | $S$，$P$，$O$，$m$，$l$，$L=m+\log l$ |
| [CS336 第 8 站](../courses/STANFORD-CS336.html#infer) | KV cache、GQA | 新 token | cache 里的全部 token | $L$，$K$（KV head 数），$H$（head dimension） |
| [MIT-6.5940 第 6 站](../courses/MIT-6.5940.html#gen) | KV cache、MQA、GQA | 新 token | cache 里的全部 token | $L$，$H$（head 数），$d_h$，$N$，$B$，$G$（组数） |
| [CMU-15442 第 7 站](../courses/CMU-15442.html#paged) | PagedAttention | 新 token | 按 block table 取来的 KV block | logical block、physical block |
| [CS231N 第 6 站](../courses/STANFORD-CS231N.html#vit) | ViT | patch token | 同一张 image 的 patch token | $X\in\mathbb R^{N\times D}$，$A$，$Y=AV$；$1/\sqrt D$ |
| [EE4706 第 2 站](../courses/EE4706.html#percep) | CLIP | image embedding $I_i$ | text embedding $T_j$；value 是 label | $S_{ij}$；logit scale $s$ |
| [CS231N 第 7 站](../courses/STANFORD-CS231N.html#ssl) | InfoNCE、SimCLR、MoCo | 一个 view | positive 与 negative 的 view | $\mathrm{sim}(z_i,z_k)$；$\tau$ |
| [RB4301 第 7 站](../courses/RB4301.html#chunk) | ACT 的 decoder | $k$ 个固定的 position embedding | 1202 个 observation token | $k\times512$ |
| [RB4301 第 8 站](../courses/RB4301.html#vla)、[LeRobot 第 5 站](../courses/HF-LEROBOT.html#vla) | action expert、cross-attention | action token | VLM 的 prefix 和 action token | prefix 在 KV cache 里 |

同一个字母在不同课里指不同的东西。CS336 的 KV cache 公式里 $K$ 是 KV head 的个数、$H$ 是 head dimension；MIT-6.5940 的 $H$ 是 head 的个数，head dimension 叫 $d_h$。CS4248 第 5 站的 $s$ 是 decoder state，CLIP 的 $s$ 是 logit scale，这一页的 $s_j$ 是 score。CS231N 的单 head 写法除以 $\sqrt D$，$D$ 是 token 的维数，多 head 时换成每个 head 的 $d_k$。π0 论文里的 $\tau$ 是 flow matching 的时间，和上面的 temperature 无关。

## CS4248：从 alignment 到 self-attention

[CS4248 第 5 站](../courses/CS4248.html#rnn)的 attention 用 dot product 打分，$e_j=s\cdot h_j$。Bahdanau 等人 2014 年的原文用的是一个一层的 MLP：

$$e_{ij}=a(s_{i-1},h_j)=v_a^\top\tanh\big(W_as_{i-1}+U_ah_j\big),\qquad\alpha_{ij}=\frac{e^{e_{ij}}}{\sum_ke^{e_{ik}}},\qquad c_i=\sum_j\alpha_{ij}h_j$$

论文把 $a$ 叫 alignment model，把 $\alpha_{ij}$ 解释为 target word $y_i$ 对准 source word $x_j$ 的 probability，$c_i$ 是 annotation 的 expectation。Hidden size $n$ 和 alignment model 的 $n'$ 都是 1000。

对到骨架上：$q_i=W_as_{i-1}$，$k_j=U_ah_j$，$v_j=h_j$，score 是 $v_a^\top\tanh(q_i+k_j)$，没有 temperature。论文附录特地说明 $U_ah_j$ 不依赖 $i$，可以预先算好：源句每个 word 的 key 只算一次，decoder 每一步拿新的 $q_i$ 去和这些 key 打分。这已经是 KV cache 的做法，只是 key 来自另一个 sequence，用不着 causal mask 的那个 induction。

Vaswani 等人 2017 年把 score 换成 $q\cdot k/\sqrt{d_k}$。论文的理由：两种 score 理论上复杂度相近，dot product 能用高度优化的 matrix multiplication，快得多、省 memory；$d_k$ 小时两者表现差不多，$d_k$ 大时 additive 胜过不 scale 的 dot product，他们怀疑是 dot product 变大、把 softmax 推进了 gradient 极小的区域，所以除以 $\sqrt{d_k}$。这正是骨架里说的 saturation。论文还列出 attention 的三种用法：encoder-decoder attention 的 query 来自 decoder 上一层、key 和 value 来自 encoder 的 output，就是 Bahdanau 的结构；encoder 的 self-attention，三者来自同一处；decoder 的 self-attention，把非法的连接设成 $-\infty$。

[CS4248 第 6 站](../courses/CS4248.html#attn)在骨架上加了四样东西：$W^Q$、$W^K$、$W^V$ 三个 projection，让同一个 token 的“看谁”“被谁看”“给出什么”各自学；causal mask；multi-head；position embedding 和 RoPE。它的 3 个 token 手算、$\sqrt{d_k}$ 的模拟表、permutation 的演示都在那一站。

## KARPATHY-Z2H：从平均出发

[KARPATHY-Z2H 第 6 站](../courses/KARPATHY-Z2H.html#gpt)是从骨架的另一头走进来的。它先写

```python
wei = torch.zeros((T, T))
wei = wei.masked_fill(tril == 0, float('-inf'))
wei = F.softmax(wei, dim=-1)
```

所有 score 相等（都是 0），softmax 给出前 $t$ 个位置各 $1/t$：这是 $\tau\to\infty$ 的极限，也就是开头的第三个办法。下一步只把初值换成 `q @ k.transpose(-2, -1) * k.shape[-1]**-0.5`，mask 和 softmax 一字不改。

那一站的 `:::wrong` 讲视频里的 code 除以 $\sqrt{384}$ 而不是 $\sqrt{64}$，相当于 temperature 多了 $\sqrt6=2.449$ 倍。程序照样能 train，原因就是骨架里那张图：$W^Q$、$W^K$ 可以学着把 $\|q\|$、$\|k\|$ 放大，自己把 temperature 调回来，只是起点不对。

它的 `generate` 每生成一个 token 都把整个 context 重新过一遍 model，只用最后一个位置的 logits，这一站末尾指向 CS336 的 KV cache。按上面的数法，context 256 时 cache 之后 linear layer 的工作量少 128.5 倍。

:::edge Context 超过 `block_size` 之后，cache 就失效了
`generate` 在 context 超过 `block_size` 时截掉开头：`idx[:, -block_size:]`。截掉一个 token，剩下每个 token 的位置都往前挪一格，$x_i$ 的 input 是 `tok_emb + pos_emb` 里的位置 embedding 跟着变，于是从第 1 层起每个 $k$、$v$ 都和 cache 里存的不同。KV cache 的 claim 要求前缀只增不减、位置编号不变，这时只能整段重算，每步 256 个 token。
:::

## STANFORD-CS336 与 STANFORD-CS149：FlashAttention 是 fusion 加上这个比值

[CS336 第 5 站](../courses/STANFORD-CS336.html#gpu)的 online softmax recurrence 就是骨架里的合并，每次把一个新的 tile 合并进来；它的 $m$、$l$、$O$ 是这里的 $m$、$l$、$u$，它存下的 $L=m+\log l$ 是 $\log\Lambda$。FlashAttention 论文（Dao 等人 2022）第 3.1 节写的也是两段拼接时 $m$、$\ell$ 的这条规则，并说只要记住这两个 statistic，softmax 就能一块一块地算。Algorithm 1 的初始化是 $O=0$、$\ell=0$、$m=-\infty$，正好是空 set 的状态 $(-\infty,0,0)$。

为什么要这样算，用 [CS149 第 4 站](../courses/STANFORD-CS149.html#locality)的 arithmetic intensity 一算就清楚。普通的 attention 拆成三个 kernel。第一个算 $S=QK^\top$：FLOP 是 $2N^2d$，HBM 上读 $Q$、$K$ 共 $4Nd$ 个 byte（bf16），写 $S$ 是 $2N^2$ 个 byte。$N\gg d$ 时

$$\text{intensity}=\frac{2N^2d}{4Nd+2N^2}\approx d$$

$N=4096$、$d=64$ 时是 62.1；第三个 kernel $PV$ 同样约为 $d$；中间的 softmax 读写 $4N^2$ 个 byte、每个数只做几次运算，约为 1。H100 的拐点在 295（CS336 第 5 站），三个 kernel 全在左边，是 memory-bound 的。关键在于这个 intensity 约等于 head dimension $d$，和 $N$ 无关：sequence 再长，也救不了它。

CS149 第 4 站的两个办法正好对上。**Fusion**：三个 kernel 合成一个，$S$ 和 $P$ 不进 HBM，那一站把三个 loop 合成一个、intensity 从 1/3 升上去的例子是同一个道理。**Blocking**：$Q$、$K$、$V$ 切成 tile 读进 shared memory（[CS149 第 5 站](../courses/STANFORD-CS149.html#gpu)的 `__syncthreads` 与 shared memory）。Blocking 在 matmul 上很平常，attention 的难处在 softmax 把一整行绑在一起，denominator 要等整行算完才知道；骨架里的合并规则拆开了这个绑定。这样 HBM 上的 $S$、$P$ 读写没有了：$N=4096$、$d=64$ 的一个 head，普通实现光是写 $S$、读 $S$、写 $P$、读 $P$ 就有 134 MB，而 $Q$、$K$、$V$、$O$ 各读写一遍只有 2.1 MB。论文 Theorem 2 给出 HBM access 的量级：standard attention 是 $\Theta(Nd+N^2)$，FlashAttention 是 $\Theta(N^2d^2M^{-1})$，$M$ 是 SRAM 的大小，$d$ 取 64 到 128、$M$ 约 100 KB 时 $d^2$ 比 $M$ 小很多；论文报告最多少 9 倍 HBM access，GPT-2 上 attention 本身最多快 7.6 倍。FLOP 一点没少，CS336 那一站的 `:::wrong` 用 4.3 μs 对 40 μs 说明了时间花在哪里。

两个版本的 loop 顺序相反，都合法。论文的 Algorithm 1 外层扫 $K$、$V$ 的 block，内层扫 $Q$ 的 block，每次把部分结果写回 HBM 再读出来合并；CS336 A2 的 FlashAttention-2 让每个 program instance 拿住一块 $Q$，内层扫全部 $K$、$V$。合并满足 associative law 和 commutative law，先合并哪两块都一样。

## Decode 的账：STANFORD-CS336、MIT-6.5940 与 CMU-15442

### KV cache 的两种写法

CS336 第 8 站写每个 token 的 KV cache 是 $2\times L\times K\times H\times(\text{byte})$，MIT-6.5940 第 6 站写整个 batch 是 $2\times L\times H\times d_h\times N\times B\times(\text{byte})$。前面的 2 是 key 和 value 各一份；$L$ 都是 layer 数；CS336 的 $K$ 对应 6.5940 的 $H$（KV head 数），CS336 的 $H$ 对应 6.5940 的 $d_h$（head dimension）；6.5940 多乘了 sequence length $N$ 和 batch size $B$。Llama-2-7B 用两种写法都是 $2\times32\times32\times128\times2=524{,}288$ byte，每个 token 512 KiB。

GQA 让若干个 query head 共用一组 key、value。记每组有 $g$ 个 query head，KV cache 缩小到原来的 $1/g$（6.5940 的 $G$ 是组数，$g=H/G$；Llama-2-70B 是 64 个 query head 分 8 组，$g=8$）。它还改了 decode 时 attention 那部分的 arithmetic intensity。一个 KV head、cache 里 $S$ 个 token、head dimension $H$：读 key 和 value 共 $2\times S\times H\times2$ 个 byte；$g$ 个 query head 各做一次 $q\cdot k$ 和一次加权求和，共 $g\times2\times2SH$ 个 FLOP。

$$\text{intensity}=\frac{4gSH}{4SH}=g$$

MHA 时 $g=1$，再算上读 $q$、写 output，略小于 1。这就是 CS336 说 decode 的 attention “intensity 小于 1、和 batch 无关”的原因：每个请求有自己的 cache，batch 再大也不会让同一份 key 被多用一次。Llama 2 13B 改成 8 组 KV head 时 $g=40/8=5$；π0 的 backbone 只有 1 个 KV head（MQA），所有 query head 共用它。

### Weight 与 KV cache，谁占大头

Decode 是 memory-bound 的（[MIT-6.5940 第 1 站](../courses/MIT-6.5940.html#eff)），每一步要从 HBM 读一遍全部 weight 和全部 KV cache。省 byte 有两条路：[MIT-6.5940 第 4 站](../courses/MIT-6.5940.html#llmq)的 W4A16 压 weight，GQA 压 KV cache。哪条有用，看 byte 落在哪一边。用 CS336 的 Llama 2 13B（$L=40$，40 个 head，$H=128$，bf16，sequence 长 1024，H100 的 3.35 TB/s）。W4A16 按 6.5940 的算法，linear layer 每个 weight 4.125 bit，embedding 和 LM head 留 bf16：

| | $B=1$ 读的 byte | $B=1$ 每步 | $B=64$ 读的 byte | $B=64$ 每步 |
|---|---|---|---|---|
| MHA，bf16 | 26.9 GB | 8.0 ms | 79.7 GB | 23.8 ms |
| MHA，W4A16 | 8.0 GB | 2.4 ms | 60.9 GB | 18.2 ms |
| GQA 8 组，bf16 | 22.8 GB | 6.8 ms | 33.4 GB | 10.0 ms |
| GQA 8 组，W4A16 | 6.5 GB | 1.9 ms | 17.1 GB | 5.1 ms |

MHA 与 GQA 的 bf16 两行就是 CS336 第 8 站的表。$B=1$ 时 KV cache 只有 0.84 GB，W4A16 快 3.3 倍，GQA 只快 1.18 倍；$B=64$ 时 KV cache 有 53.7 GB，W4A16 只快 1.31 倍，GQA 快 2.39 倍。分界线是 KV cache 等于 weight 的地方：$26.03\times10^9/819{,}200\approx31{,}800$，batch 里所有 sequence 的 token 加起来超过约 3.2 万个，13B 的 KV cache 就比 weight 还大；做了 W4A16 之后 weight 只剩 7.2 GB，分界线提前到约 8,800 个 token。

::fig[thread-attention-decode] 动图：batch 从 64 变到 1、4、16 再回到 64。灰色是 weight，彩色是 KV cache。Batch 小时灰色占大头，W4A16 那两行短得多；batch 大时彩色占大头，只有 GQA 那两行短下来。

:::wrong W4A16 把 weight 压到四分之一，decode 就快将近 4 倍
只在 KV cache 可以忽略时成立。上表 $B=1$ 时是 3.3 倍；$B=64$ 时每步读的 79.7 GB 里 53.7 GB 是 KV cache，W4A16 一个也没少读，只快 1.31 倍。MIT-6.5940 第 6 站的 Llama-2-7B 同样如此：$B=16$、$N=4096$ 时 KV cache 是 34.4 GB，weight 从 13.48 GB 压到 3.86 GB，每步从 47.8 GB 降到 38.2 GB，只快 1.25 倍。长 context、大 batch 时要先压 KV cache：GQA、MQA，或者把 KV cache 本身也 quantize。
:::

### PagedAttention 与 Flash-Decoding：又是那个合并

[CMU-15442 第 7 站](../courses/CMU-15442.html#paged)把 KV cache 切成固定大小的 block，用 block table 映射到不连续的 physical block。那一站的例子 Alan Turing is a computer scientist and mathematician renowned 共 9 个 token，block size 4，logical block 0、1、2 映射到 physical block 7、1、5。新 token 的 query 读 cache 时，kernel 按 block table 逐块取 key 和 value，每块得到一个 $(m,l,u)$，三块合并就是答案：这是合并表里“不相邻两块”那一行，只是块数是 3。CMU-15442 那一站说这能成立是因为 attention 对 key 的求和满足 associative law 和 commutative law，骨架里的 $\Lambda$、$U$ 两个 sum 就是这句话的具体内容。

Flash-Decoding（2023 年 Stanford CRFM 上的一篇 blog）是同一个合并用在另一个方向上。FlashAttention 沿 batch 和 query 的方向分配工作，decode 时 query 只有 1 个，batch 小时 A100 的 108 个 SM 只有少数有活干，batch 为 1 时用不到 GPU 的 1%。Flash-Decoding 把 key、value 沿 sequence 切成若干份，每份交给一个 SM 算出自己的部分结果和 log-sum-exp，再用一个 reduction 合并。Blog 报告在 CodeLlama-34B 上，很长的 sequence 时 decode 最多快 8 倍。按骨架的说法，它就是把一行 attention 的 $\Lambda$ 和 $U$ 拆成几段部分和并行求，再加起来。

## STANFORD-CS231N 与 EE4706：image 变成 token，CLIP 的一行是一个 attention row

[CS231N 第 6 站](../courses/STANFORD-CS231N.html#vit)把 224×224 的 image 切成 196 个 16×16 的 patch，每个 patch 乘同一个 matrix 变成一个 token，然后做不加 mask 的 self-attention。那一站证明的 permutation equivariance，就是骨架里“$o$ 只依赖 set”的 matrix 版本，所以 ViT 要加 position embedding。ViT 不需要 KV cache：一张 image 一次给全，没有 token 一个个追加。[EE4706 第 2 站](../courses/EE4706.html#percep)换成 14×14 的 patch，每张 image $16\times16=256$ 个 token，三个 camera 768 个，它们构成 VLA 的 prefix。[MIT-6.S184 第 7 站](../courses/MIT-6.S184.html#arch)的 DiT 对 latent 的 patch 做同样的 attention。

EE4706 第 2 站的 CLIP 本身就是一个 attention row。一张 image 的 embedding $I_i$ 当 query，$N$ 条 caption 的 embedding $T_j$ 当 key，score 是 $sI_i\cdot T_j$，也就是 $\tau=1/s$。Value 取 one-hot 的 label $e_j$，output $o=\sum_j\alpha_je_j=\alpha$ 就是 zero-shot classifier 给出的 probability。那一站 3×3 例子的第一行，$s=14.3$：

$$\alpha=\mathrm{softmax}\big(14.3\times(0.31,\ 0.24,\ 0.22)\big)=\mathrm{softmax}(4.433,\ 3.432,\ 3.146)=(0.608,\ 0.224,\ 0.168)$$

Loss $-\ln\alpha_1=0.497$，和 EE4706 算的一致。这一行的 gradient 可以直接用骨架的公式。$v_j=e_j$ 时 $o=\alpha$，$L=-\ln o_1$，$g=-e_1/\alpha_1$，于是 $g\cdot(v_j-o)=-(\delta_{j1}-\alpha_1)/\alpha_1$，

$$\frac{\partial L}{\partial s_j}=\alpha_j\cdot\frac{-(\delta_{j1}-\alpha_1)}{\alpha_1}=\alpha_j-\delta_{j1}=(-0.392,\ 0.224,\ 0.168)$$

正确 caption 的 score 被往上推 0.392，两个错的按各自的 weight 往下推。[CS231N 第 7 站](../courses/STANFORD-CS231N.html#ssl)的 SimCLR 和 MoCo 是同一个 row，只是 key 换成同一张 image 的另一个 view 和一堆 negative；MoCo 论文直接称它为 $(K+1)$-way softmax classifier 的 log loss。

Scale 的取法是两边真正不同的地方。CLIP 把 $I_i$、$T_j$ normalize 成 unit vector，score 是 $s\cos$，长度再也不能用来调 temperature，所以 $s$ 必须单独作为 parameter 去学：初值 14.3（temperature 0.07），上限 100。Transformer 的 head 不 normalize，上面算过 $q\cdot k/\sqrt{d_k}\approx\sqrt{d_k}\cos$，$d_k=64$ 时开头乘在 cosine 前面的数约是 8，之后靠 $\|q\|$、$\|k\|$ 自己变。CS336 第 4 站的 QK-norm 介于两者之间：normalize 掉长度，乘一个学出来的 gain，和 CLIP 的设计是同一个思路。

EE4706 那一站说 cosine 的绝对值本身没有意义、相对大小才有意义，从骨架看也是自然的：softmax 只看 score 之间的差。

## RB4301、EE4706 与 HF-LEROBOT：action 怎样去读 observation

一个 VLA 的 observation 是几百个 image token、几十个 language token 和一个 state token。Action 要从里面取出“现在该怎么动”所需的东西，这又是一次 attention。三种设计的差别全在 query 是什么、mask 怎样画。

::fig[thread-attention-masks] 三种 action 读 observation 的方式，画成 attention mask。左：RT-2 和 OpenVLA 把 action 当作 token 接在 causal sequence 后面。中：ACT 的 decoder 用 $k$ 个固定的 query 一次读完 observation。右：π0 的 block-causal mask，prefix 和 state 看不见 noisy action。

### 把 action 写成 token

[RB4301 第 8 站](../courses/RB4301.html#vla)的 OpenVLA 把每个 action 的 7 个 dimension 各切成 256 个 bin，当作 7 个 token 接在 prompt 后面，用 causal mask 照常做 next-token prediction（RT-2 多一个 terminate flag，是 8 个）。Inference 时 image token 和指令一次 prefill，K、V 进 cache；之后每个 action token 是一步 decode：query 是最新的那个 token，key、value 是 cache 里的全部。一个 action 要 7 步 decode。每一步 decode 都要把 7B 的 weight 读一遍，[EE4706 第 7 站](../courses/EE4706.html#sys)按 bandwidth 算出 RTX 4090 上 bf16 的上限是每秒 72 个 token、10.3 个 action，实测 6 Hz。这一路的速度受 decode 那一节的账限制。

### ACT：query 只说“第几步”

[RB4301 第 7 站](../courses/RB4301.html#chunk)的 ACT 是另一种结构。论文的描述：4 个 camera 的 image 各经 ResNet18 变成 $15\times20\times512$ 的 feature map，拉平成 300 个 token，加 2D sinusoidal position embedding，4 个 camera 共 1200 个，再加 joint position 和 style variable $z$，transformer encoder 的 input 是 $1202\times512$。Decoder 的 query 是一组固定的 position embedding，大小 $k\times512$，key 和 value 来自 encoder，cross-attention 之后经 MLP 降成 $k\times14$：接下来 $k$ 步两条 arm 的 joint target。

对照 Bahdanau 的 decoder：那里第 $i$ 个 query 是 $W_as_{i-1}$，$s_{i-1}$ 依赖前面已经生成的 word，所以只能一个一个来。ACT 第 $t$ 个 query 是一个 constant，只表示“第 $t$ 步”，不依赖任何已经输出的 action，于是 $k$ 个 query 可以一次 forward 同时算完。Query 说要第几步，key 说 observation 里什么东西在哪，value 给出内容。RB4301 那一站的 $k=100$；同样 100 个 action，OpenVLA 的写法要 700 步 decode，ACT 是一次 forward，论文说 80M parameter 的 model 在 RTX 2080 Ti 上 inference 约 0.01 s。

### π0 与 SmolVLA：prefix 只算一次

π0（RB4301 第 8 站）用 flow matching 一次生成 50 步的 action chunk，要做 10 步 Euler integration，每一步都要让 noisy action 去读 observation。如果每一步都把 3B 的 VLM 连同全部 prefix 重跑一遍，一个 chunk 就是 10 次完整的 forward。π0 的解法是一个 mask。论文附录：sequence 分三个 block，image 与 language prompt 一块，robot state $q_t$ 一块，noisy action 一块；block 内部是 bidirectional attention，每个 block 只能看前面的 block，看不到后面的。

用 KV cache 的 claim 换一个说法就能看出后果：prefix 看不到 noisy action，所以 prefix 在每一层的 hidden state、key、value 都和 noisy action 无关，10 个 flow step 里一个数都不变，算一次存起来即可。论文对 state 单独成块的解释正是这一点：state 在 flow step 之间不变，让它看不到最后一块，它的 key 和 value 就能在 sampling 时 cache。每个 flow step 只剩 action token 过 action expert（width 1024，mlp_dim 4096，约 300M parameter），它的 query 读 cache 里 prefix 的 key、value 和 action token 自己的。两组 weight 只在 attention 里交汇：VLM 的 weight 处理 image 和 language，action expert 的 weight 处理 state 和 action，拼成同一个 sequence 做 attention。

论文在 RTX 4090 上测的时间（3 个 camera）：image encoder 14 ms，observation 的 forward 32 ms，10 次 action 的 forward 共 27 ms，on-board 合计 73 ms。EE4706 第 7 站引用 RTC 论文说 “π0 仅 KV-cache 的 prefill 在 RTX 4090 上就要 46 ms”，恰好是这里的 14 加 32。Cache 一份 prefix 也很便宜：backbone 是 18 层、num_kv_heads 为 1、head_dim 256，每个 prefix token 的 KV cache 是 $2\times18\times1\times256\times2=18{,}432$ byte，1000 个 token 才 18.4 MB。

:::wrong π0 把 image token 和 action token 放进同一个 sequence，所以每个 flow step 都要把整个 VLM 重跑一遍
放进同一个 sequence 不等于互相都能看见。Block-causal mask 让 prefix 看不到 noisy action，prefix 的 key、value 在 10 步里不变，只算一次。如果 prefix 也能看见 action，每一步 noisy action 一变，prefix 在第 1 层以上的 hidden state 全都跟着变，32 ms 的 observation forward 就得做 10 遍：$14+10\times(32+2.7)\approx361$ ms，而现在是 73 ms。
:::

[HF-LEROBOT 第 5 站](../courses/HF-LEROBOT.html#vla)的 SmolVLA 把同一件事拆成两种 layer：cross-attention layer 里 action token 是 query，key 和 value 来自 VLM；self-attention layer 里 action token 互相看，用 causal mask。论文在 LIBERO 上的 ablation：只用 cross-attention 79.0%，只用 self-attention 74.5%，交替 85.5%；self-attention 用 causal 74.5%，bidirectional 67.5%。那一站的图画了它的 inference：3 个 camera 时 prefix 最多 $3\times64+48+1=241$ 个 token，过一遍 VLM 存成 KV cache，10 步 Euler integration 每步只过 action expert，读同一份 cache。

两个对照可以帮助记住这个设计。MIT-6.S184 第 7 站的 DiT 每个 denoising step 都要重算全部 token 的 attention，因为那里被 denoise 的就是所有 image token 本身，每一步都在变；π0 的 prefix 是 condition，不被 denoise，所以能 cache。[MIT-6.S978 第 4 站](../courses/MIT-6.S978.html#tok)的 VAR 用的是同一种 block-causal mask：同一个 scale 内部互相看见，只看见更粗的 scale，每生成一个 scale，前面的 scale 的 key、value 都可以留在 cache 里。

:::from
骨架的论证顺序是为这条线安排的。开头的例子取自 CS4248 第 5 站的 the green witch；合并的例子取自 CS336 第 5 站的 online softmax。读过的外部材料：Bahdanau、Cho、Bengio, Neural Machine Translation by Jointly Learning to Align and Translate（[arXiv 1409.0473](https://arxiv.org/pdf/1409.0473)），第 3.1 节、附录 A 的 alignment model 与“$U_ah_j$ 可以预先算好”、hidden size 1000、第 5 节 RNNencdec 随句长变差；Vaswani 等, Attention Is All You Need（[ar5iv 1706.03762](https://ar5iv.labs.arxiv.org/html/1706.03762)），第 3.2 节的 scaled dot-product、additive 与 dot-product 的比较、footnote 的 variance、三种用法；Dao 等, FlashAttention（[ar5iv 2205.14135](https://ar5iv.labs.arxiv.org/html/2205.14135)），第 3.1 节的 softmax 分解、Algorithm 1、Theorem 1 与 2、引言里的 9 倍和 7.6 倍；[Flash-Decoding 的 blog](https://crfm.stanford.edu/2023/10/12/flashdecoding.html)；π0（[arXiv 2410.24164](https://arxiv.org/html/2410.24164)）的附录 A-B（block-causal mask、两组 weight、backbone 与 action expert 的 config）和 A-D（KV cache 与 Table I 的时间）；ACT（[ar5iv 2304.13705](https://ar5iv.labs.arxiv.org/html/2304.13705)）的架构一节；SmolVLA（[arXiv 2506.01844](https://arxiv.org/html/2506.01844v1)）的 action expert 与 ablation。这些都是通过抓取工具读的，工具按我的问题逐段转述原文和公式，不是逐字读完全文。π0 附录印出的 num_heads 我读到的是 18，和我对 Gemma 2B 的印象不符，所以正文只用了 num_kv_heads 和 head_dim。各课的数字和说法取自各课程页的对应站。$\partial o/\partial s_j=\alpha_j(v_j-o)$ 的推导、gradient 的数值例子与 40 步的轨迹、temperature 表、$\sqrt{d_k}\cos$ 的模拟、$\Lambda$ 与 $U$ 的写法和三种分组的数、KV cache 的 induction 与计数、naive attention 的 intensity 约为 $d$、GQA 的 intensity 为 $g$、weight 与 KV cache 的 byte 表和分界线、CLIP 一行的 gradient、π0 不用 block-causal 时的 361 ms，都是我推导、用 python 算的。Karpathy 那一节“截掉开头后 cache 失效”是按那一站的 code 推的；“KV cache 本身也可以 quantize”和 DiT 的对照凭自己的知识写，没有找原文核对。
:::
