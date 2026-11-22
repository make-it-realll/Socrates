---
code: STANFORD-CS231N
evidence: syllabus
evidenceNote: "Stanford CS231n Deep Learning for Computer Vision，Spring 2026 一期（Fei-Fei Li、Ehsan Adeli、Justin Johnson 等）。讲法跟着课程自己的材料：cs231n.github.io 的 course notes（从 GitHub 仓库读的 markdown 原文：classification、convolutional-networks、neural-networks-2 与 -3、transfer-learning 的相关部分，linear-classify 的一部分）；2026 版 schedule；Lecture 2、5、6、8、9、12、13、14、16 的 slides（只读到抽取出来的文字，slides 上的图没有看到）；三个作业 2026 版的 handout，以及 starter code 里的 notebook 和 .py 文件。另外读了 Justin Johnson 在 Michigan EECS 498 的 detection slides（IoU、NMS、mAP），以及 ResNet、Identity Mappings、Group Norm、Faster R-CNN、Mask R-CNN、ViT、MoCo、DINO、MAE、effective receptive field 各篇论文里用到的段落（都是抽取的片段）。Lecture 3、4、7、10、11、15、17、18 的 slides 和全部录像没有读。"
exam: "Spring 2026 有一次 in-class midterm（5 月 12 日）、三个作业和 final project，各部分的占比没有查。自学时没有考试，以作业为主。以当期课程网站为准。"
subskills:
  - id: classify
    name: Data-driven classification：kNN、linear classifier 与 softmax loss
    l3: "有提示能做：对两张小 image 算 L1 distance，对一组 score 算 softmax probability 和 loss。"
    l4: "能独立做：写出 vectorized 的 kNN distance matrix 和 softmax loss 的 gradient，用 validation set 选 k，并说出初始 loss 应该是多少。"
    l5: "能讲给别人：pixel 空间的 distance 为什么和语义无关，linear classifier 的 template 解释，以及为什么 hyperparameter 不能在 test set 上选。"
  - id: conv
    name: Convolution layer：滑窗计算、output size 与 parameter sharing
    l3: "有提示能做：手算一个带 padding 和 stride 的 conv 的几个 output。"
    l4: "能独立做：对任意 W、F、S、P 算出 output size、parameter 个数和 multiply-add 次数，写出 naive 的 conv forward 和 backward。"
    l5: "能讲给别人：local connectivity 和 parameter sharing 各省掉了什么、依赖什么假设，以及 conv 的 backward 为什么还是一个 conv。"
  - id: arch
    name: Receptive field 与经典架构：VGG、ResNet
    l3: "有提示能做：用 recurrence 算出一串 conv 和 pool 之后的 receptive field。"
    l4: "能独立做：逐层算出 VGG16 的 activation 和 parameter，比较三层 3×3 与一层 7×7，算出 bottleneck block 省下的 parameter。"
    l5: "能讲给别人：56 层的 plain network 为什么比 20 层差，residual connection 在 forward 和 backward 上各改变了什么。"
  - id: train
    name: Training 的实践：initialization、normalization、augmentation 与调参
    l3: "有提示能做：算出某个 weight scale 下 activation 每层放大多少倍，写出 BN、LN、GN 各在哪些数上取 mean。"
    l4: "能独立做：实现 spatial BatchNorm、GroupNorm 和 inverted dropout，按 sanity check、overfit、learning rate、coarse-to-fine 的顺序调参。"
    l5: "能讲给别人：Kaiming initialization 的 factor 2 从哪里来，BN 在 test time 为什么必须换成 running average，什么样的 augmentation 会改掉 label。"
  - id: detect
    name: Detection 与 segmentation
    l3: "有提示能做：算两个 box 的 IoU，手走一遍 NMS，写出 transposed convolution 的 output。"
    l4: "能独立做：写出 RPN 每个位置的 output shape，给 anchor 标 positive 和 negative，从一组 detection 算出 AP。"
    l5: "能讲给别人：从 sliding window 到 R-CNN、Fast R-CNN、Faster R-CNN 每一步省掉了什么，以及 DETR 为什么不需要 NMS。"
  - id: vit
    name: Vision Transformer
    l3: "有提示能做：算出一个 image 切成多少个 patch token、patch embedding 有多少 parameter。"
    l4: "能独立做：实现 patch embedding、encoder layer 和整个 ViT classifier，算出 attention 在一层计算量里的份额。"
    l5: "能讲给别人：没有 position embedding 时 ViT 为什么分不出被打乱的 patch，以及 ViT 在小 dataset 上为什么不如 CNN。"
  - id: ssl
    name: Self-supervised learning：contrastive、CLIP、DINO 与 MAE
    l3: "有提示能做：对一个小 batch 的 embedding 算出 SimCLR 的 loss。"
    l4: "能独立做：实现 vectorized 的 SimCLR loss、CLIP 的 zero-shot classifier，并用 linear probe 评估 representation。"
    l5: "能讲给别人：temperature 和 batch size 在 contrastive loss 里起什么作用，DINO 怎样不靠 negative 避免 collapse，MAE 为什么要遮掉 75%。"
  - id: gen
    name: 视觉里的 generative model：从 rectified flow 到 DDPM
    l3: "有提示能做：写出 rectified flow 的 $x_t$ 和 target $v$，由 noise schedule 算出任意 $t$ 的 $\\bar\\alpha_t$。"
    l4: "能独立做：实现 DDPM 的 q_sample、noise prediction loss、一步 sampling 和 classifier-free guidance。"
    l5: "能讲给别人：posterior $q(x_{t-1}\\mid x_t,x_0)$ 的 mean 和 variance 怎么推出来，sampling 时为什么要把预测的 $x_0$ clamp 住。"
open:
  - label: "Stanford CS231n Spring 2026 schedule"
    url: "https://cs231n.stanford.edu/schedule.html"
    note: "各站对应哪一讲、作业的时间以这里为准。"
  - label: "CS231n course notes（cs231n.github.io 的 GitHub 仓库）：Image Classification、Linear Classification、Convolutional Networks、Neural Networks Part 2 与 Part 3、Transfer Learning"
    url: "https://github.com/cs231n/cs231n.github.io"
    note: "第 1 至 4 站的主要讲法来源。读的是仓库里的 markdown 原文；Convolutional Networks 读了全文，其余读了用到的小节。"
  - label: "CS231n 2026 Lecture 2：Image Classification with Linear Classifiers（slides）"
    url: "https://cs231n.stanford.edu/slides/2026/lecture_2.pdf"
    note: "第 1 站。只读到抽取的文字。"
  - label: "CS231n 2026 Lecture 5：Image Classification with CNNs（slides）"
    url: "https://cs231n.stanford.edu/slides/2026/lecture_5.pdf"
    note: "第 2、3 站。只读到抽取的文字。"
  - label: "CS231n 2026 Lecture 6：CNN Architectures（slides）"
    url: "https://cs231n.stanford.edu/slides/2026/lecture_6.pdf"
    note: "第 3、4 站。只读到抽取的文字。"
  - label: "CS231n 2026 Lecture 8：Attention and Transformers（slides）"
    url: "https://cs231n.stanford.edu/slides/2026/lecture_8.pdf"
    note: "第 6 站。只读到抽取的文字。"
  - label: "CS231n 2026 Lecture 9：Detection、Segmentation、Visualization（slides）"
    url: "https://cs231n.stanford.edu/slides/2026/lecture_9.pdf"
    note: "第 5 站。只读到抽取的文字；visualization 和 adversarial example 部分没有用。"
  - label: "CS231n 2026 Lecture 12：Self-supervised Learning（slides）"
    url: "https://cs231n.stanford.edu/slides/2026/lecture_12.pdf"
    note: "第 7 站。只读到抽取的文字；DINO 在 slides 上只有标题，细节来自 A3 的 notebook 和 DINO 原文。"
  - label: "CS231n 2026 Lecture 13、14：Generative Models 1、2（slides）"
    url: "https://cs231n.stanford.edu/slides/2026/lecture_14.pdf"
    note: "第 8 站：generative model 的分类、rectified flow、guidance、latent diffusion。Lecture 13 的地址是同目录的 lecture_13.pdf。只读到抽取的文字。"
  - label: "CS231n 2026 Lecture 16：Vision and Language（slides）"
    url: "https://cs231n.stanford.edu/slides/2026/lecture_16.pdf"
    note: "第 7 站的 CLIP 部分。只读到抽取的文字。"
  - label: "CS231n Assignment 1、2、3（2026 版 handout 与 starter code）"
    url: "https://cs231n.github.io/assignments2026/assignment1/"
    note: "最后一节和各站的作业细节。三份 handout 和 zip 里的 notebook、.py 都在上面那个 GitHub 仓库里，读的是那里的文件。"
  - label: "Justin Johnson，Michigan EECS 498-007 Lecture 15：Object Detection（slides）"
    url: "https://web.eecs.umich.edu/~justincj/slides/eecs498/498_FA2019_lecture15.pdf"
    note: "第 5 站的 IoU、NMS、mAP 和 sliding window 的计数。只读到抽取的文字。"
  - label: "He et al.，Deep Residual Learning for Image Recognition（ResNet）；Identity Mappings in Deep Residual Networks"
    url: "https://arxiv.org/pdf/1512.03385"
    note: "第 3 站的构造论证、bottleneck、global average pooling，以及 $x_L=x_l+\\sum F_i$ 的 gradient 分析（后一篇在 arXiv 1603.05027）。只读到抽取的段落。"
  - label: "Wu and He，Group Normalization"
    url: "https://arxiv.org/pdf/1803.08494"
    note: "第 4 站的分组定义和 batch size 的表。"
  - label: "Ren et al.，Faster R-CNN；He et al.，Mask R-CNN"
    url: "https://arXiv.org/pdf/1506.01497.pdf"
    note: "第 5 站的 anchor 规则、box parameterization、RoI Align（后一篇在 arXiv 1703.06870）。只读到抽取的段落。"
  - label: "Dosovitskiy et al.，An Image is Worth 16x16 Words（ViT）"
    url: "https://arxiv.org/pdf/2010.11929"
    note: "第 6 站的 inductive bias、model 规格、pretrain dataset 大小的对比、position embedding 的 ablation。"
  - label: "He et al.，Masked Autoencoders Are Scalable Vision Learners（MAE）"
    url: "https://arxiv.org/pdf/2111.06377v3"
    note: "第 7 站 MAE 一节的全部数字。"
  - label: "He et al.，MoCo；Caron et al.，DINO"
    url: "https://arxiv.org/pdf/2104.14294"
    note: "第 7 站的 momentum encoder 与 ablation（MoCo 在 arXiv 1911.05722）、DINO 的 centering 与 sharpening。只读到抽取的段落。"
---

先看三件事。

**第一件。** 把一张 8×8 的字母 T 右移一个 pixel，再拿去和 training set 比。按 pixel 一个个比较的 distance 说，它离原来那个 T 比离一张空白 image 还远。

::fig[stanford-cs231n-pixeldist] 左边是 test image，右边是 training set 的四张 image 和它们与 test image 的 L1 distance。最近的那张是空白。

**第二件。** AlexNet 的第一层输出 55×55×96 个数。如果每个输出各用自己的一组 weight 去看 input 上一块 11×11×3 的区域，这一层就有 1.06 亿个 parameter。让同一个 channel 的所有位置共用一组 weight 之后，只剩 34,944 个。

**第三件。** ViT-L/16 比 ViT-B/16 大三倍多。只用 ImageNet 的 130 万张 image pretrain，大的反而差（top-1 76.53% 对 77.91%）；换成 3 亿张的 JFT-300M，大的才领先（87.12% 对 84.15%）。

三件事问的是同一个问题：关于 image 的哪些知识应该直接写进 model 的结构，哪些留给 data 去教。第一件说明不写任何结构、只在 pixel 上比是行不通的；第二件说明“局部”和“平移”这两条知识一旦写进结构，parameter 能省掉三千倍；第三件说明结构写得少，就要用 data 来补。这门课从 kNN 讲到 CNN，再讲到 Transformer、self-supervised learning 和 diffusion，一路都在这条线上移动。三件事分别在第 1、2、6 站得到解释。

| 站 | 内容 | 对应 lecture | 对应作业 |
|---|---|---|---|
| 1 | kNN、linear classifier、softmax loss | 2、3 | A1 |
| 2、3 | Conv layer、receptive field、VGG 与 ResNet | 5、6 | A2 Q3、Q4 |
| 4 | Initialization、normalization、augmentation、调参 | 3、6 | A1 Q5，A2 Q1、Q2、Q4 |
| 5 | Detection 与 segmentation | 9 | A3 Q4 用到 IoU |
| 6 | Vision Transformer | 8 | A3 Q1 |
| 7 | Contrastive、CLIP、DINO、MAE | 12、16 | A3 Q2、Q4 |
| 8 | Rectified flow、DDPM、latent diffusion | 13、14 | A3 Q3 |

这一页假定读者已经会 backpropagation 和 MLP。Computational graph 和 local derivative 在 [Karpathy Zero to Hero 的第 1 站](../courses/KARPATHY-Z2H.html#micrograd)，matrix 形式的 backprop、softmax 的 gradient $p-y$、initialization 的 variance 推导在 [CS3244 的 neural network 一站](../courses/CS3244.html#nn)，BatchNorm 的来历和 backward 在 [Zero to Hero 的第 3、4 站](../courses/KARPATHY-Z2H.html#stats)，Adam 与 AdamW 在 [CS336 的 training 一站](../courses/STANFORD-CS336.html#train)，attention 的 formula 和 $\sqrt{d_k}$ 在 [CS4248 的 self-attention 一站](../courses/CS4248.html#attn)，filtering 和 correlation 在 [CS4243 的第 1 站](../courses/CS4243.html#filter)。这些地方这一页只给链接。

只有十几个小时时的路线：第 2、3、4、6、7、8 站必读；会 linear classifier 和 softmax 的可以跳过第 1 站；第 5 站只在要做 detection 时读，A3 只用到其中的 IoU。每站开头写了跳过的代价。

## [classify] Data-driven classification：kNN、linear classifier 与 softmax loss

:::skip
快速路线里可以跳过。能说出为什么 nearest neighbor 在 pixel 上不行、hyperparameter 为什么在 validation set 上选，能对一组 score 算出 softmax loss 并说出初始 loss 应该是 $\ln 10$，就可以去第 2 站。
:::

### 一张 image 是一个 array

CIFAR-10 的一张 image 是 32×32×3 个 0 到 255 之间的整数，一共 3072 个；dataset 有 50,000 张 training image 和 10,000 张 test image，分 10 个 class。Classification 要做的，是把 3072 个数变成一个 label。

同一只 cat 往左挪一点、换一种光照、换一个姿势，3072 个数几乎全部改变，而 label 不变。没有办法像写 sorting 那样一条条写出“cat 长什么样”的规则。CS231n 的办法是 data-driven：不写规则，只写两个 function，

```python
def train(images, labels):   # 从带 label 的 data 里学出一个 model
    ...
    return model

def predict(model, image):   # 用 model 给新 image 一个 label
    ...
    return label
```

整门课讲的就是 `train` 里面放什么。

### Nearest neighbor：最简单的 data-driven classifier

最省事的 `train` 是把 training set 原样存下来；`predict` 找出离 test image 最近的那张 training image，抄它的 label。“近”用 L1 distance 量：

$$d_1(I_1,I_2)=\sum_p\big|I_1^p-I_2^p\big|$$

$p$ 走遍所有 pixel。

拿开头那张图验算。T 一共有 11 个黑 pixel：顶上一横 6 个，下面一竖 5 个。右移一格后，顶上一横和原来重叠 5 个，两头各错开 1 个，差 2；一竖整列挪到隔壁，原来的 5 个和新的 5 个全都对不上，差 10。所以 $d_1=12$。空白 image 和右移后的 T 只差在 T 自己的 11 个黑 pixel 上，$d_1=11$。Nearest neighbor 于是把它判成“空白”。

这个例子很小，但真实 image 上也是一样。CS231n 的 notes 报告，nearest neighbor 用 L1 distance 在 CIFAR-10 上的 accuracy 是 38.6%，用 L2 distance 是 35.4%，随机猜是 10%。Notes 还用 t-SNE 把 CIFAR-10 按 L2 distance 排在平面上，排在一起的 image 背景颜色相近，class 并不相同。Pixel 空间里的 distance 量的是颜色分布和背景，和 image 里是什么东西关系不大。

它还有一个工程上的毛病。`train` 什么也不做，`predict` 却要和 50,000 张 image 各比 3072 个数，每张 test image 做 $1.536\times10^8$ 次减法。实际使用时 `predict` 要快，`train` 慢一点没关系，nearest neighbor 正好反了过来。

### k 和 validation set

只看最近的一张很容易被个别 image 带偏，所以改成看最近的 $k$ 张，让它们投票。$k$ 取多少，以及用 L1 还是 L2，叫 hyperparameter，不能从 training set 学出来：在 training set 上，$k=1$ 永远全对，因为每张 image 最近的就是它自己。

Lecture 2 把挑 hyperparameter 的办法排成四个想法。第一，挑在 training set 上最好的：不行，$k=1$ 总是赢。第二，挑在 test set 上最好的：不行，下面的 wrong 说明为什么。第三，从 training set 里切一块出来当 validation set，只用它来挑，test set 留到最后只用一次：这是正确的做法。第四，cross-validation：把 data 分成几份，轮流拿一份当 validation set，结果取平均；slides 在 CIFAR-10 上用 5-fold cross-validation 挑出的是 $k\approx7$。Cross-validation 更稳，但每个候选值要训练好几次，深度学习里很少用。A1 的 softmax notebook 把 CIFAR-10 的 training set 切成 49,000 张 training 和 1,000 张 validation，test 取 1,000 张；kNN 那个 notebook 为了算得快，只用 5,000 张 training、500 张 test，做 5-fold cross-validation 选 $k$，$k=1$ 时 accuracy 大约 27%。

:::wrong 在 test set 上试几个 $k$，哪个最好就用哪个，报告它的 test accuracy
被报告的那个数会偏高。设 10 个不同的 $k$ 真实 accuracy 都是 27%，在 500 张 test image 上量，每个量出来的 accuracy 带着 standard deviation $\sqrt{0.27\times0.73/500}=0.020$ 的随机误差。如果这 10 个误差互相独立，10 个里最大的那个平均比 mean 高 1.54 个 standard deviation，报出来的就是 $27\%+1.54\times2.0\%\approx30\%$，而换一批 test image 它又会回到 27%。在 test set 上挑过，test set 就成了 training 的一部分。实际上同一批 test image 上各个 $k$ 的误差是相关的，偏高的幅度会小一些，但方向不变。
:::

### Linear classifier：每个 class 一个 template

换一种 `train`：学一个 function，把 image 直接映射成 10 个 score，

$$f(x)=Wx+b,\qquad x\in\mathbb R^{3072},\ W\in\mathbb R^{10\times3072},\ b\in\mathbb R^{10}$$

一共 30,730 个 parameter。Training 结束后 training set 可以丢掉，`predict` 只是一次 matrix-vector product，30,720 次 multiply-add，比 nearest neighbor 少了五千倍。

Lecture 2 用一张只有 4 个 pixel 的 cat image 演示这个计算，3 个 class 是 cat、dog、ship：

$$\underbrace{\begin{pmatrix}0.2&-0.5&0.1&2.0\\1.5&1.3&2.1&0.0\\0&0.25&0.2&-0.3\end{pmatrix}}_{W}\begin{pmatrix}56\\231\\24\\2\end{pmatrix}+\underbrace{\begin{pmatrix}1.1\\3.2\\-1.2\end{pmatrix}}_{b}=\begin{pmatrix}-96.8\\437.9\\60.75\end{pmatrix}$$

逐行代进去：cat 是 $0.2\times56-0.5\times231+0.1\times24+2.0\times2+1.1=-96.8$；dog 是 $1.5\times56+1.3\times231+2.1\times24+0+3.2=437.9$；ship 是 $0+0.25\times231+0.2\times24-0.3\times2-1.2=60.75$。Slides 上 ship 印的是 61.95，按这组 $W$ 和 $b$ 算出来是 60.75。这张 cat image 得分最高的是 dog，这组 $W$ 显然还没训练好。

$W$ 的第 $k$ 个 row 和 $x$ 一样长，也可以排回 32×32×3 当一张 image 看。Score $s_k=w_k\cdot x+b_k$ 是 image 和这张“template”的 inner product：image 和 template 越像，score 越高。所以 linear classifier 是在做 template matching，只不过 template 是学出来的。Notes 里给出的 CIFAR-10 template 可以印证这一点：ship 的 template 大片是蓝色（ship 多在海上），horse 的 template 有两个头，因为 dataset 里朝左和朝右的 horse 都有，只好把两种姿势叠在一张 template 上。一个 class 只能有一张 template，这就是 linear classifier 表达能力的上限，第 2 站开始的 CNN 要突破的就是它。

### Softmax loss，以及第一步应该看到的数

10 个 score 要变成一个能优化的数。Softmax 把 score 变成 probability，loss 取正确 class 的 negative log probability：

$$p_k=\frac{e^{s_k}}{\sum_je^{s_j}},\qquad L=-\log p_y$$

Lecture 2 的例子：一张 cat image，正确的 class cat 得 3.2，另外两个 class 得 5.1 和 −1.7。

$$e^{3.2}=24.53,\quad e^{5.1}=164.02,\quad e^{-1.7}=0.18,\quad\text{sum}=188.74$$

$$p=(0.130,\ 0.869,\ 0.001),\qquad L=-\ln0.130=2.04$$

对 score 的 gradient 是 $p-y$（推导见 [CS3244](../courses/CS3244.html#nn)），这里是 $(0.130-1,\ 0.869,\ 0.001)=(-0.870,\ 0.869,\ 0.001)$：把 cat 的 score 往上推，把得 5.1 的那个往下推，第三个几乎不动。

$L$ 最小是 0（$p_y=1$），最大没有上限（$p_y\to0$）。

这个 formula 马上给出一个检查实现的办法。刚 initialize 时 $W$ 很小，所有 score 都接近 0，$C$ 个 class 的 probability 都是 $1/C$，loss 是 $-\log(1/C)=\log C$；CIFAR-10 是 $\ln10=2.303$。A1 和 A2 的 notebook 都要你先确认这个数；如果第一步的 loss 是 5 或者 0.5，后面不用跑了，先找 bug。

实现时 score 先减去最大值。Score 是 1000 时 $e^{1000}$ 在 float64 里是 `inf`，`inf/inf` 得 `nan`。分子分母同乘 $e^{-\max_js_j}$，probability 不变，上面的例子变成对 $(-1.9,\ 0,\ -6.8)$ 取 exp，最大的一项恰好是 1，不会溢出。

Loss 再加上 $\lambda\|W\|^2$ 做 regularization，用 SGD 沿 gradient 往下走，就是 A1 的 softmax classifier。

:::from
[Lecture 2 slides](https://cs231n.stanford.edu/slides/2026/lecture_2.pdf)（只读到抽取的文字）给了这一站的顺序：data-driven、nearest neighbor 的 train $O(1)$ 与 predict $O(N)$、挑 hyperparameter 的四个想法和 $k\approx7$、$f(x,W)=Wx+b$ 的三种看法、4 个 pixel 的例子、3.2/5.1/−1.7 的 softmax 例子、loss 的最小最大值和初始值 $\log C$。Data-driven 的 `train`/`predict` 写法、nearest neighbor 在 CIFAR-10 上的 38.6% 和 35.4%、t-SNE 的观察、“test 慢 train 快正好反了”、validation set 的用法，来自 [notes 的 Image Classification](https://github.com/cs231n/cs231n.github.io/blob/master/classification.md)；template 的解释、ship 和两个头的 horse，来自 [notes 的 Linear Classification](https://github.com/cs231n/cs231n.github.io/blob/master/linear-classify.md)；初始 loss 2.302 的 sanity check 来自 [Neural Networks Part 3](https://github.com/cs231n/cs231n.github.io/blob/master/neural-networks-3.md)。49,000/1,000/1,000 的切法、5,000/500 的子集和 27% 来自 A1 的 knn 与 softmax notebook。8×8 的 T、4 个 pixel 的例子里 ship 的重算、test set 上挑 $k$ 的那笔账，是为这一页算的。Lecture 3（regularization 和 optimization）没有读，optimizer 的部分只给了链接。
:::

## [conv] Convolution layer：滑窗计算、output size 与 parameter sharing

:::skip
快速路线必读（Lecture 5）。能手算一个带 padding、stride 的 conv 的 output，对任意 $W,F,S,P$ 写出 output size、parameter 个数和 multiply-add 次数，并能写出 conv backward 的两个 sum，就可以去第 3 站。
:::

### Fully connected 在 image 上撑不住

第 1 站的 linear classifier 每个 score 都连着全部 3072 个 input。把它换成 hidden layer，一个 neuron 也要 3072 个 weight；input 变成 AlexNet 的 227×227×3，一个 neuron 要 154,587 个 weight。AlexNet 第一层有 55×55×96 = 290,400 个输出，就算每个只看 input 上一块 11×11×3 的区域，各用各的 weight，也是

$$290{,}400\times(11\times11\times3+1)=105{,}705{,}600$$

个 parameter，这只是第一层。

省掉它们靠两条关于 image 的知识。

**Local connectivity。** 一个 edge、一块颜色只取决于附近的 pixel，所以每个 neuron 只连 input 上一小块，这块的大小 $F\times F$ 叫这个 neuron 的 receptive field。在深度（channel）方向则全连：filter 的大小是 $F\times F\times D_{\text{in}}$。

**Parameter sharing。** 一个 horizontal edge detector 在左上角有用，在右下角也有用，所以同一个 channel 的所有位置共用一组 weight 和一个 bias。AlexNet 第一层于是只有 96 组 weight：

$$96\times11\times11\times3+96=34{,}944$$

比上面少了 3025 倍，3025 正是 $55\times55$，一个 channel 的位置数。

这条假设直接给出一个性质。Stride 1 时，把 input 整体右移一个 pixel，每个 window 里的内容也跟着右移一格，而所有位置用的是同一组 weight，所以 output 也恰好右移一格：$\mathrm{Conv}(\mathrm{Translate}(X))=\mathrm{Translate}(\mathrm{Conv}(X))$。Lecture 5 把它叫作 translation equivariance：feature 不取决于它在 image 的什么位置。开头那个右移一格的 T，经过 conv 之后 output 也只是整体挪了一格，检测到的 feature 一个不少。

共用一组 weight 在所有位置上做 dot product，就是拿这组 weight 在 image 上滑一遍，所以这一层叫 convolution layer，这组 weight 叫 filter 或 kernel。严格地说它做的是 correlation，filter 不翻转，这一点和 [CS4243 第 1 站](../courses/CS4243.html#filter)讲的一样；filter 是学出来的，翻不翻没有区别。

### 一个 output 数是怎么算出来的

第 $k$ 个 filter 在位置 $(i,j)$ 的 output 是

$$\text{out}[i][j][k]=\sum_{u=0}^{F-1}\sum_{v=0}^{F-1}\sum_{c=0}^{D_{\text{in}}-1}W_k[u][v][c]\;X[Si+u][Sj+v][c]+b_k$$

$S$ 是 stride，filter 每次挪动的格数；$X$ 是四周补过 $P$ 圈 0 的 input。

::fig[stanford-cs231n-conv] 5×5 的 input 补一圈 0 变成 7×7，3×3 的 filter 以 stride 2 走过 9 个位置。每到一处，filter 和下面那块逐格相乘，9 个乘积加起来再加 bias，就是 output 里亮起来的那一格。

图里的 filter 每个 row 都是 $(1,0,-1)$，算的是“左边一列减右边一列”，即 vertical edge 的强度。看第一个位置：window 是 padded input 左上角的 3×3，

$$\begin{pmatrix}0&0&0\\0&2&0\\0&1&2\end{pmatrix}\odot\begin{pmatrix}1&0&-1\\1&0&-1\\1&0&-1\end{pmatrix}=\begin{pmatrix}0&0&0\\0&0&0\\0&0&-2\end{pmatrix}$$

乘积之和是 $-2$，加 bias 1 得 $-1$。正中间那个 output（window 的左上角在 padded input 的第 2 行第 2 列）：

$$\begin{pmatrix}2&2&0\\1&2&2\\0&1&2\end{pmatrix}\odot\begin{pmatrix}1&0&-1\\1&0&-1\\1&0&-1\end{pmatrix}=\begin{pmatrix}2&0&0\\1&0&-2\\0&0&-2\end{pmatrix}$$

之和 $-1$，加 1 得 0。真实的 conv layer 只是把 input 和 filter 都加上 depth：每个位置的 dot product 有 $F\times F\times D_{\text{in}}$ 项，$K$ 个 filter 各出一张 activation map，叠成 $K$ 个 channel 的 output。

### Output 有多大

Input 宽 $W$，补 $P$ 圈后宽 $W+2P$。Filter 的左边缘依次落在 $0,S,2S,\dots$，第 $n$ 个位置是 $nS$，它要放得下，需要 $nS+F\le W+2P$，也就是 $n\le(W-F+2P)/S$。$n$ 从 0 数起，所以一共有

$$W_{\text{out}}=\frac{W-F+2P}{S}+1$$

个位置。图里是 $(5-3+2)/2+1=3$。再看几个：

| $W$ | $F$ | $S$ | $P$ | $W_{\text{out}}$ |
|---|---|---|---|---|
| 7 | 3 | 1 | 0 | 5 |
| 7 | 3 | 2 | 0 | 3 |
| 7 | 3 | 3 | 0 | 2.33，放不整齐 |
| 227 | 11 | 4 | 0 | 55（AlexNet 第一层） |
| 32 | 5 | 1 | 2 | 32 |

最后一行是最常用的设定：$S=1$ 时取 $P=(F-1)/2$，output 和 input 一样大，spatial size 只交给 pooling 去缩。Notes 顺带指出，AlexNet 论文写的 input 是 224×224，但 $(224-11)/4+1=54.25$ 不是整数，实际用的应该是 227。

### Parameter 和计算量

每个 filter 有 $F\cdot F\cdot D_{\text{in}}$ 个 weight，一共

$$\text{parameter}=K\,(F\,F\,D_{\text{in}}+1)$$

和 input 的 spatial size 无关。计算量则和 output 的面积成正比：每个 output 数要 $F\,F\,D_{\text{in}}$ 次 multiply-add，

$$\text{multiply-add}=W_{\text{out}}\,H_{\text{out}}\,K\cdot F\,F\,D_{\text{in}}$$

Lecture 5 的例题：input 是 3×32×32，用 10 个 5×5 的 filter，stride 1，pad 2。Output 的 spatial size 是 $(32+2\times2-5)/1+1=32$，所以是 10×32×32。每个 filter 有 $3\times5\times5=75$ 个 weight 加 1 个 bias，parameter 一共 $10\times76=760$ 个。Output 有 $10\times32\times32=10{,}240$ 个数，每个是两个 3×5×5 的 tensor 的 inner product，multiply-add 一共 $75\times10{,}240=768{,}000$ 次。

同样算 AlexNet 第一层：$55\times55\times96\times363=105{,}415{,}200$ 次。Parameter 只有 3.5 万，计算却有一亿次：parameter sharing 省的是 parameter，计算一次也没省。

$F=1$ 的 conv 常被误会，下面的 wrong 专门说它。

:::wrong 1×1 conv 只是把每个 pixel 乘上一个数
Image 只有一个 channel 时是这样；conv layer 的 filter 总是贯穿全部 channel。56×56×64 的 input 经过 32 个 1×1 的 filter，每个 output 是同一个 pixel 位置上 64 个数和 64 个 weight 的 dot product，得到 56×56×32。Parameter 有 $32\times(64+1)=2080$ 个，等于在每个 pixel 上各做一次同样的 64 进 32 出的 fully connected layer。第 3 站的 bottleneck 就靠它在 3×3 conv 前后改 channel 数。
:::

### Pooling

2×2、stride 2 的 max pooling 在每个 channel 上各自取每个 2×2 小块的最大值，spatial size 减半，depth 不变，丢掉 75% 的数，没有 parameter。按上面的 formula（pooling 不补 0），$W_{\text{out}}=(W-2)/2+1=W/2$。Lecture 5 的例子：

$$\begin{pmatrix}1&1&2&4\\5&6&7&8\\3&2&1&0\\1&2&3&4\end{pmatrix}\ \xrightarrow{\ 2\times2\text{ max, stride }2\ }\ \begin{pmatrix}6&8\\3&4\end{pmatrix}$$

左上的小块是 $\{1,1,5,6\}$，取 6；右上 $\{2,4,7,8\}$ 取 8；下面两块取 3 和 4。把左上小块里的 5 换成任何不超过 6 的数，或者把 6 挪到这个小块的另一个格子，output 都不变：max pooling 对小块内部的小幅平移不敏感。

Backward 时，$\max$ 只对最大的那个 input 有 derivative 1，其余是 0，所以 gradient 原样送回 forward 时最大的那个位置。实现时 forward 记下每个 max 的位置，backward 直接查。

### 实现：im2col 与 backward

Forward 有一个常用的实现办法，叫 im2col：把每个 window 拉成一个 column。AlexNet 第一层的 window 是 11×11×3 = 363 个数，一共 3025 个 window，排成 363×3025 的 matrix $X_{\text{col}}$；96 个 filter 各拉成一个 row，得 96×363 的 $W_{\text{row}}$。整层 conv 就是一次 matrix multiply $W_{\text{row}}X_{\text{col}}$，得 96×3025，再 reshape 成 55×55×96。代价是 window 互相重叠，$X_{\text{col}}$ 有 1,098,075 个数，是 input（154,587 个）的 7.1 倍。

Backward 在 1D、stride 1 下最容易看清。Forward 是

$$y_i=\sum_{k=0}^{F-1}w_k\,x_{i+k}$$

每个 $w_k$ 出现在所有 $y_i$ 里，和 $x_{i+k}$ 相乘，所以

$$\frac{\partial L}{\partial w_k}=\sum_i\frac{\partial L}{\partial y_i}\,x_{i+k}$$

这是拿 upstream gradient 在 input 上再滑一遍：weight 的 gradient 是 input 和 $\partial L/\partial y$ 的 correlation，和 parameter sharing 一一对应，共用一组 weight 的所有位置把 gradient 加在一起。

每个 $x_j$ 出现在 $i=j-k$ 的那些 $y_i$ 里，系数是 $w_{j-i}$：

$$\frac{\partial L}{\partial x_j}=\sum_{i}\frac{\partial L}{\partial y_i}\,w_{j-i},\qquad 0\le j-i\le F-1$$

取 $F=3$、input 长 5、output 长 3，$\partial L/\partial x_2=\partial_{y_0}L\,w_2+\partial_{y_1}L\,w_1+\partial_{y_2}L\,w_0$：$w$ 的下标倒着走。所以 input 的 gradient 是把 $\partial L/\partial y$ 两边补 $F-1$ 个 0，再和翻转过的 filter 做 correlation。Conv 的 backward 还是 conv。A2 的 `conv_backward_naive` 不必这样写，循环每个 window，`dw += window * dout`、`dx[window] += w * dout` 两行就是上面两个 sum。

:::edge Stride 放不整齐
$W=10$、$F=3$、$S=2$、$P=0$ 时 $(10-3)/2+1=4.5$。Notes 说 library 可能报错，也可能补 0 或裁掉一部分。PyTorch 的 `Conv2d` 文档写明 output size 取 floor，这里得 4；4 个位置的左边缘在 0、2、4、6，最后一个盖住第 6 到 8 列，input 最右边的第 9 列从来没被 filter 看到。A2 的 naive 实现里最好 assert output size 是整数。
:::

:::back
Linear classifier 的 template matching（[第 1 站](#classify)）就是 $F$ 等于整张 image 的 conv。Correlation 和 edge filter 见 [CS4243](../courses/CS4243.html#filter)，“CNN 为什么用 convolution”的 parameter 计数在 [CS4243 的最后一站](../courses/CS4243.html#recog)也算过。
:::

:::from
Local connectivity 与 parameter sharing 的讲法、AlexNet 第一层的 105,705,600 和 34,944、output size 的 formula 和那几个例子、224 对不上的说明、1×1 conv、pooling 的 backward、im2col 的 363×3025 和 96×363、“backward 还是 conv”，都来自 [notes 的 Convolutional Networks](https://github.com/cs231n/cs231n.github.io/blob/master/convolutional-networks.md)，那里的 conv demo 是 5×5×3 的 input、两个 filter、stride 2、pad 1，这一页的动图把它缩成一个 channel。[Lecture 5 slides](https://cs231n.stanford.edu/slides/2026/lecture_5.pdf)（只读到抽取的文字）提供了 translation equivariance 的写法、3×32×32 的例题（760 个 parameter、768,000 次 multiply-add）和 max pooling 的 4×4 例子。Notes 只说 backward“在 1D 很容易推”而没有展开，上面的推导、AlexNet 的 multiply-add、$X_{\text{col}}$ 的 7.1 倍、动图里的数字是为这一页算的；取 floor 的说法核对过 [PyTorch 的 `Conv2d` 文档](https://docs.pytorch.org/docs/main/generated/torch.nn.Conv2d.html)。
:::

## [arch] Receptive field 与经典架构：VGG、ResNet

:::skip
快速路线必读（Lecture 5、6）。能用 recurrence 算 receptive field，说出三层 3×3 胜过一层 7×7 的两个理由，指出 VGG16 的 activation 和 parameter 各集中在哪，并能从 $x_L=x_l+\sum F_i$ 说明 residual connection 对 gradient 做了什么，就可以去第 4 站。
:::

### 一层 conv 只看得到 3×3

Classification 最后要对整张 image 下结论，可是一个 3×3 的 filter 只看到 3×3。要靠一层层叠起来：第二层的一个 unit 看第一层的 3×3，第一层的每个 unit 又各看 input 的 3×3，合起来是 input 上的 5×5。

一般地，记 $r_l$ 为第 $l$ 层一个 unit 在 input 上覆盖的宽度（receptive field），$j_l$ 为第 $l$ 层相邻两个 unit 在 input 上相隔几个 pixel。第 $l$ 层的一个 unit 看下一层 $F_l$ 个相邻的 unit，它们在 input 上依次错开 $j_{l-1}$，每个覆盖 $r_{l-1}$，所以

$$r_l=r_{l-1}+(F_l-1)\,j_{l-1},\qquad j_l=j_{l-1}\,S_l,\qquad r_0=j_0=1$$

::fig[stanford-cs231n-rf] 从最上层的一个 unit 往下追，每一行标出它依赖这一行的几格，最下面一行就是它的 receptive field。上：三层 3×3 conv，依次是 3、5、7 格。下：中间插一层 stride 2 的 pool，之后每层 conv 在 input 上多看 4 个 pixel，最后是 12。

代进去验算下面那张图：conv1 $r=1+2\times1=3$，$j=1$；pool（$F=2,S=2$）$r=3+1\times1=4$，$j=2$；conv2 $r=4+2\times2=8$；conv3 $r=8+2\times2=12$。

全部是 stride 1 时 $j$ 恒为 1，recurrence 化成 Lecture 5 的 formula：$L$ 层 $K\times K$ conv 的 receptive field 是 $1+L(K-1)$。只用 3×3 conv，每层只加 2，要看满 224 个 pixel 得叠 112 层。Lecture 5 的结论是在 network 内部 downsample。Downsampling 让 $j$ 翻倍，后面每层加得越来越多。VGG16 是五段 3×3 conv，每段后面一个 2×2 pool，按 recurrence 一层层算，最后一个 conv（conv5_3）的 receptive field 是 196，经过最后一个 pool 是 212，差不多盖住 224 的整张 image。

### VGG：只用 3×3

三层 3×3 conv 的 receptive field 是 7，和一层 7×7 一样。Notes 和 Lecture 6 给出两个理由说明前者更好。第一，三层之间有三个 ReLU，一层 7×7 只是一个 linear function 加一个 ReLU。第二，parameter 更少：设每层都是 $C$ 个 channel 进、$C$ 个出，

$$3\times(3\times3\times C\times C)=27C^2\qquad\text{对}\qquad7\times7\times C\times C=49C^2$$

VGG16 就是把这条规则贯彻到底：全部是 3×3、stride 1、pad 1 的 conv 和 2×2、stride 2 的 max pool，conv 只改 channel 数，pool 只改 spatial size。逐层算一遍 activation 和 parameter：

::fig[stanford-cs231n-vgg] VGG16 的五段 conv 和三个 FC layer。Activation 集中在前两段，parameter 集中在 FC1。

两样东西分布在网络的两头。前两段 conv 的 output 占了全部 conv activation 的 70% 以上，因为 spatial size 还没缩小；parameter 却几乎都在 FC1，它要把 $7\times7\times512=25{,}088$ 个数全连到 4096 个 neuron，

$$25{,}088\times4096+4096=102{,}764{,}544$$

占全网 1.384 亿个 parameter 的 74%。把 notes 那张逐层的表加起来，一张 image 的 forward 大约要存 1520 万个数（表末写的总数偏大），按 4 byte 一个是 58 MB，backward 还要再存一份同样大的 gradient；batch size 64 时光 activation 就超过 7 GB。所以 memory 卡住的是前面的 conv，parameter 的大头在后面的 FC。

### 更深为什么反而更差

VGG 说明 depth 有用，那就继续加深。Lecture 6 引用 ResNet 论文的实验：一个 56 层的 plain network，training error 和 test error 都比 20 层的高。

这不可能是 overfitting，因为 training error 也更高。56 层的 network 至少可以复制 20 层的那个：前 20 层照抄，剩下 36 层都做 identity。所以 56 层能表示的 function 包含 20 层的全部，它在 training set 上更差，只能说明 optimization 没有找到那个解。让 36 层 conv 加 ReLU 恰好学成 identity，并不容易。

ResNet 把这条路直接铺好。一个 residual block 学的是 $F(x)$，输出

$$H(x)=F(x)+x$$

$F$ 的 weight 全为 0 时，block 就是 identity，而 initialization 本来就在 0 附近。Network 不必费力学 identity，只需学在 identity 上改多少。

Backward 上的效果更清楚。ResNet 的后续论文 Identity Mappings in Deep Residual Networks 做了这个分析。设相加之后不再过 ReLU（那篇论文最后的设计正是把 BN 和 ReLU 都挪到 weight layer 前面，让相加之后什么也不做），第 $l$ 个 block 的 input 到第 $L$ 个 block 的 input 是

$$x_L=x_l+\sum_{i=l}^{L-1}F_i(x_i)$$

对 $x_l$ 求 derivative，

$$\frac{\partial\mathcal L}{\partial x_l}=\frac{\partial\mathcal L}{\partial x_L}\Big(1+\frac{\partial}{\partial x_l}\sum_{i=l}^{L-1}F_i(x_i)\Big)$$

括号里那个 1 让 $\partial\mathcal L/\partial x_L$ 原封不动地到达任意浅的一层，不经过任何 weight；论文指出，即使 weight 任意小，这一项也不会消失。Plain network 的 gradient 要连乘 $L-l$ 个 Jacobian；如果每层把 gradient 缩成 0.8 倍，经过 36 层就只剩 $0.8^{36}=3.2\times10^{-4}$。

那条 shortcut 必须是不加改动的 identity。论文试过把它乘一个系数，$x_{l+1}=\lambda_lx_l+F(x_l)$，那么 $x_L$ 里 $x_l$ 的系数变成 $\prod_i\lambda_i$：全都大于 1 时指数增长，全都小于 1 时指数消失。$\lambda=0.9$ 经过 50 个 block 是 $0.9^{50}=0.005$，shortcut 又回到了 plain network 的处境。

### ResNet 的其余设计

ResNet 开头是一个 7×7、stride 2 的 conv 加一个 pool，之后分成几段，每段开头用 stride 2 把 spatial size 减半、channel 数翻倍，每个 block 是两个 3×3 conv；channel 数变化的地方，shortcut 用 1×1 conv 做一次 projection 来对齐，$y=F(x)+W_sx$。ImageNet 上有 18、34、50、101、152 层几种。34 层的那个是 36 亿次 multiply-add，只有 VGG-19（196 亿次）的 18%；152 层是 113 亿次，仍比 VGG 少。ILSVRC 2015 的 3.57% top-5 error 是 6 个不同深度的 ResNet ensemble 的结果，Lecture 6 的时间线上前两年是 ZFNet 的 11.7% 和 VGG 的 7.3%（VGG 当年是亚军）。

50 层以上的 ResNet 把 block 换成三层的 bottleneck：1×1 conv 把 256 个 channel 降到 64，在 64 个 channel 上做 3×3，再用 1×1 升回 256（第 2 站的 wrong 说过 1×1 conv 在做什么）。Parameter（不算 bias）是

$$256\times64+3\times3\times64\times64+64\times256=69{,}632$$

在 256 个 channel 上直接做两个 3×3 是 $2\times3\times3\times256\times256=1{,}179{,}648$，多 17 倍。

论文还指出，bottleneck 的 shortcut 两头都是 256 维，如果这里也用 projection，时间和 model 大小都会翻倍，所以 identity shortcut 对 bottleneck 尤其重要。

最后 ResNet 不用 VGG 那样的大 FC：论文写明 network 以 global average pooling 和一个 1000-way 的 FC 结束。ResNet-50 最后的 7×7×2048 feature map 对每个 channel 取平均，得 2048 个数，再接 2048 进 1000 出的 FC，2,049,000 个 parameter，是 VGG 的 FC1 的五十分之一。

:::wrong 56 层比 20 层差，是层数多了 overfitting
Overfitting 的标志是 training error 低、test error 高。这里 56 层的 training error 也更高，而它能表示的 function 严格包含 20 层的全部。问题出在 optimization 找不到好的解，所以加 regularization 无济于事，ResNet 改的是让好的解（identity 附近）容易找到。
:::

:::edge Receptive field 盖住了，不等于每个 pixel 用得一样多
Receptive field 只说明哪些 pixel 能影响这个 unit。离中心近的 pixel 有很多条 path 通到 output，边缘的 pixel 只有很少几条，实际的影响集中在中间，分布接近 Gaussian。Luo et al. 证明，在 weight 都相同的简化情形下，理论 receptive field 随层数 $n$ 线性增长，有效的部分只按 $\sqrt n$ 增长，占比按 $1/\sqrt n$ 缩小。他们在 CamVid 上的 segmentation network 理论 receptive field 是 505×505，有效的部分在训练开始时直径约 100，训练后长到约 150。所以 conv5_3 的 196 不代表它对 196×196 均匀地看。
:::

:::back
每层的 output size 和 parameter 用的是[第 2 站](#conv)的两条 formula。
:::

:::from
$1+L(K-1)$ 和“在 network 内部 downsample”来自 [Lecture 5 slides](https://cs231n.stanford.edu/slides/2026/lecture_5.pdf)。三层 3×3 与一层 7×7 的比较（$27C^2$ 对 $49C^2$、更多 non-linearity）、VGG16 逐层的表、“memory 在前、parameter 在后”、FC1 的 1 亿个 weight、layer sizing 的规则，来自 [notes 的 Convolutional Networks](https://github.com/cs231n/cs231n.github.io/blob/master/convolutional-networks.md)。56 层与 20 层、“这是 optimization 问题”、$H(x)=F(x)+x$、各段的 stride 2 和 channel 翻倍、18 到 152 层、ILSVRC 的几个 error，来自 [Lecture 6 slides](https://cs231n.stanford.edu/slides/2026/lecture_6.pdf)。“深的 model 至少能复制浅的”的构造论证、projection shortcut、bottleneck 的 256 与 64、identity shortcut 对 bottleneck 的重要性、global average pooling、FLOPs 和 6 个 model 的 ensemble，核对过 [ResNet 原文](https://arxiv.org/pdf/1512.03385)；$x_L=x_l+\sum F_i$、gradient 里的 1、$\prod\lambda_i$ 的论证来自 [Identity Mappings in Deep Residual Networks](https://arxiv.org/pdf/1603.05027)；edge 里的数字来自 [Luo et al. 的 effective receptive field 论文](https://arxiv.org/pdf/1701.04128)。这几篇都只读到了抽取的片段。Receptive field 的 recurrence 和图、VGG16 的数字、$0.8^{36}$ 与 $0.9^{50}$ 是为这一页算的。
:::

## [train] Training 的实践：initialization、normalization、augmentation 与调参

:::skip
快速路线里 initialization 和 normalization 两节必读（A2 Q1 要实现）；dropout、augmentation、调参、transfer learning 四节值得读，做 A2 Q4 时要用。能算出一个 weight scale 下 activation 每层放大多少倍，说出 BN、LN、GN 的区别和 test time 的做法，就可以去第 5 站。
:::

### Initialization：每层把 activation 放大多少倍

Variance 为什么要按 fan-in 缩放，推导在 [CS3244](../courses/CS3244.html#nn) 和 [Zero to Hero 第 3 站](../courses/KARPATHY-Z2H.html#stats)。这里补上 ReLU 的情形，它给出 Kaiming initialization 里的那个 2。

一层的 pre-activation 是 $s=\sum_{i=1}^{D}w_ix_i$，$w_i$ 独立、mean 0、variance $\sigma^2$，和 $x_i$ 独立，所以

$$\mathrm{Var}(s)=D\,\sigma^2\,\mathbb E[x^2]$$

注意这里是 $\mathbb E[x^2]$ 而不是 $\mathrm{Var}(x)$：ReLU 的 output 全是非负的，mean 不是 0。$x$ 是上一层的 $\mathrm{ReLU}(s')$，$s'$ 关于 0 对称，一半的时候 $x=s'$，一半的时候 $x=0$，所以 $\mathbb E[x^2]=\tfrac12\mathrm{Var}(s')$。代回去：

$$\mathrm{Var}(s)=\frac{D\,\sigma^2}{2}\,\mathrm{Var}(s')$$

每过一层，pre-activation 的 standard deviation 乘上 $\sqrt{D\sigma^2/2}$。Lecture 6 用的例子是 6 层、每层 4096 个 neuron：

| weight 的 std $\sigma$ | 每层乘以 $\sqrt{4096\,\sigma^2/2}$ | 6 层之后 |
|---|---|---|
| 0.01 | 0.453 | 0.0086 |
| 0.05 | 2.263 | 134 |
| $\sqrt{2/4096}=0.0221$ | 1 | 1 |

0.01 和 0.05 只差 5 倍，6 层之后差了一万多倍：一个让 activation 消失，一个让它爆炸。让每层乘以 1，就是 $\sigma=\sqrt{2/D_{\text{in}}}$，即 Kaiming initialization。Conv layer 的 $D_{\text{in}}$ 是一个 filter 的大小 $F\,F\,C_{\text{in}}$；3×3、64 个 input channel 时 $D_{\text{in}}=576$，$\sigma=0.059$。

A1 的 FullyConnectedNets 要你手调 `weight_scale`，让 3 层和 5 层的 network 在 50 张 image 上 20 个 epoch 内 overfit 到 100%；5 层的那个对 `weight_scale` 敏感得多，原因就是上表的连乘。

### BatchNorm 用在 conv 上

BN 换了个思路：与其靠 initialization 把每层的 scale 算准，不如直接把每个 feature 在 batch 上 standardize，再乘一个 learnable 的 $\gamma$、加一个 $\beta$。它在 fully connected layer 上的做法、test time 改用 running average、backward 的推导，都在 [Zero to Hero 第 3、4 站](../courses/KARPATHY-Z2H.html#stats)。

Conv layer 的 output 是 $N\times C\times H\times W$。Spatial BN 对每个 channel 在 $N\cdot H\cdot W$ 个数上取一个 mean 和一个 variance，一共 $C$ 组；$\gamma,\beta$ 也是每个 channel 一对，$2C$ 个 parameter。为什么把所有位置合在一起？同一个 channel 在所有位置用的是同一个 filter（第 2 站的 parameter sharing），它在左上角和右下角检测的是同一种 feature，statistics 本来就该合起来算。例如 $N=32$、$C=64$、$16\times16$ 的 feature map，每个 mean 由 $32\times16\times16=8192$ 个数平均而来，一共 64 个 mean。A2 的 notebook 里，实现方法就是把 tensor 换个排列，变成 $(N\cdot H\cdot W)\times C$，再调用 fully connected 的 BN。

:::wrong Test time 也用当前 batch 的 mean 和 variance
那样一张 image 的 output 取决于和它同一个 batch 的是哪些 image。极端情形是 batch size 1：每个 feature 的 mean 就是它自己，比如 $x=5$ 时 $\mu=5$，$x-\mu=0$，output 恒等于 $\beta$，对任何 image 都一样。Test time 必须用 training 时累积的 running mean 和 running variance，这样 BN 变成一个固定的 affine function。
:::

### Batch 小的时候：LayerNorm 与 GroupNorm

BN 的 statistics 来自 batch。Detection 和 segmentation 的 image 大，一块 GPU 往往只放得下一两张，这时每个 mean 只来自一两张 image，又随 batchmate 变化，估得不准。Group Norm 论文量了 ResNet-50 在 ImageNet 上的 validation error（%）随每块 GPU 的 batch size 怎样变：

| batch size | 32 | 16 | 8 | 4 | 2 |
|---|---|---|---|---|---|
| BN | 23.6 | 23.7 | 24.8 | 27.3 | 34.7 |
| GN | 24.1 | 24.2 | 24.0 | 24.2 | 24.1 |

Batch 大时 BN 略好；batch size 2 时 BN 的 error 比 GN 高 10.6 个点。GN 换了一种分组，只在一个 sample 内部取 statistics，所以和 batch size 无关。

::fig[stanford-cs231n-norms] 四种 normalization 的分组。纵深是 $N$ 个 sample，横向是 $C$ 个 channel，竖向是一个 channel 里的 $H\times W$ 个位置；深色的一组数共用一个 mean 和一个 variance。

| 方法 | 一组是 | 每组几个数 | 一共几组 |
|---|---|---|---|
| Batch Norm | 一个 channel，跨所有 sample | $N\,H\,W$ | $C$ |
| Layer Norm | 一个 sample 的全部 channel | $C\,H\,W$ | $N$ |
| Instance Norm | 一个 sample 的一个 channel | $H\,W$ | $N\,C$ |
| Group Norm | 一个 sample 的 $C/G$ 个 channel | $(C/G)\,H\,W$ | $N\,G$ |

论文用一个式子统一这四种：$\hat x_i=(x_i-\mu_i)/\sigma_i$，$\mu_i,\sigma_i$ 在一个集合 $S_i$ 上算，四种方法的区别只在 $S_i$ 是哪些数。后三种都和 batch 里有没有别的 image 无关，test time 也不需要 running average。Group Norm 取 $G=1$ 就是 Layer Norm，取 $G=C$ 就是 Instance Norm，论文默认 $G=32$。图里 $C=6$、$G=2$，一组是 3 个 channel。A2 让你在同一组 batch size 实验里把 BN 换成 LN，notebook 预期 batch size 对 training 曲线的影响明显变小。

### Dropout

Training 时每次 forward 随机把一部分 neuron 的 output 置 0，test time 全部保留。Test time 不丢，output 的 expectation 就和 training 时不一样，所以要补一个 scale。现在通用的做法是 inverted dropout：training 时以 probability $p$ 保留，保留下来的除以 $p$，

$$\mathbb E\Big[\frac{m}{p}\,x\Big]=\frac{p}{p}\,x=x,\qquad m\sim\text{Bernoulli}(p)$$

Test time 什么也不用改。$p=0.5$ 时，一个值为 2.0 的 activation 在 training 时变成 0 或 4.0，expectation 仍是 2.0。注意 A2 的约定：`dropout_forward` 里的 `p` 是保留的 probability，PyTorch 的 `nn.Dropout(p)` 里的 `p` 是丢掉的 probability，两者正好相反。

### Data augmentation：把 invariance 写进 data

第 1 站说过，label 不随平移、光照、左右翻转改变，pixel 却全变了。CNN 的结构只保证了 translation 的 equivariance，其余的 invariance 只能让 network 从 data 里看到。Augmentation 就是在 training 时对每张 image 随机做一个不改 label 的变换。Lecture 6 列出 ResNet 的做法：

- 随机取 $L\in[256,480]$，把短边 resize 到 $L$，随机裁一块 224×224，再随机左右翻转；
- 随机调 contrast 和 brightness（color jitter）；
- Cutout：随机把一块区域置 0，test time 用完整的 image，在 CIFAR 这类小 dataset 上效果好。

数一下第一条能造出多少种 image。一张 4:3 的 image，$L=256$ 时 resize 成 256×341，224 的方块能放在 $(256-224+1)\times(341-224+1)=33\times118=3894$ 个位置，加上翻转是 7788 种；$L=480$ 时是 480×640，$257\times417\times2=214{,}338$ 种。同一张 image 在每个 epoch 里几乎不会以同样的面目出现两次。Test time 也用 crop：ResNet 在 5 个 scale 上各取 4 个角、中心和它们的翻转共 10 个 crop，把 score 平均。

[CS4243 的最后一站](../courses/CS4243.html#recog)讲过 color jitter 对 lighting 的作用。第 7 站的 SimCLR 会把 augmentation 本身变成 training signal。

:::wrong 只要 image 还认得出来，任何变换都可以拿来 augment
变换必须不改变 label。手写 digit 转 180°，6 变成 9，label 跟着错；路标、文字左右翻转后，左转变右转、字母成了镜像。Augmentation 等于告诉 network“这个变换前后是同一类”，选错变换就是在教它一个错的 invariance。上下翻转对卫星图像无害，对街景就不行。
:::

### 调参的顺序

Lecture 6 给出一个固定的流程：

1. 检查初始 loss：softmax 在 $C$ 个 class 上应该是 $\ln C$，CIFAR-10 是 2.303（第 1 站）。
2. 关掉 regularization，在一小份 data 上 overfit 到 training accuracy 100%。做不到就是有 bug。
3. 用全部 data、一点点 weight decay，找一个 learning rate，让 loss 在 100 个 iteration 左右明显下降；候选是 1e−1、1e−2、1e−3、1e−4、1e−5。
4. 在第 3 步附近粗搜，每组跑 1 到 5 个 epoch。
5. 缩小范围，跑得更久。
6. 看 loss 和 accuracy 曲线：training accuracy 还在涨就多训练；training 和 validation 差得远是 overfitting，加 regularization 或 data；两条贴在一起往往是 underfitting，训练更久或用更大的 model。
7. 回到第 5 步。

搜的时候有两条规则，都来自 notes。第一，learning rate 和 regularization strength 按 log scale 取，比如 `lr = 10 ** uniform(-6, 1)`：它们对 training 的作用是乘法性的，lr 从 0.001 加 0.01 是天壤之别，从 10 加 0.01 毫无影响。第二，用 random search，不用 grid search。

::fig[stanford-cs231n-search] 同样跑 9 次。设 validation accuracy 只随 learning rate 变化（上方是一条假想的曲线），momentum 对结果没有影响。

理由在图里。几个 hyperparameter 往往只有一两个真正重要。3×3 的 grid 在 learning rate 上只试到 3 个值，另外 6 次都花在不重要的 momentum 上；9 次 random search 在 learning rate 上试到 9 个不同的值，离峰值近得多。还有一条：最好的值落在搜索范围边上时，往外再扩一次范围。

训练中途可以看 update 和 weight 的大小之比（不是 gradient 本身，是 learning rate 乘 gradient），notes 给的经验值是 $10^{-3}$ 左右，小得多说明 learning rate 太小，大得多说明太大。

### Transfer learning

ImageNet 有 120 万张 image、1000 个 class。自己的 dataset 往往小得多，从 random initialization 训练会 overfit。做法是拿 ImageNet 上 pretrain 好的 CNN，换掉最后一层，再按 dataset 的大小和相似程度决定动多少：

| | 和 ImageNet 相似 | 和 ImageNet 很不同 |
|---|---|---|
| Data 很少 | 冻住 backbone，只在最后一层的 feature 上训练 linear classifier | 换一个更合适的 pretrained model，或者多收集 data |
| Data 很多 | Fine-tune 全部 layer | Fine-tune 全部 layer，或者从头训练 |

Fine-tune 时 pretrained 的 layer 用比新加的 classifier 小的 learning rate，免得新 classifier 还没训练好时，它的 random gradient 把已经学好的 feature 冲坏。Lecture 6 的经验法则是：dataset 少于一百万张左右时，先找一个在大的相似 dataset 上训练过的 model 来 transfer。PyTorch 和 Hugging Face 都有现成的 model zoo。第 7 站讲怎样在没有 label 的 data 上得到这样的 pretrained model。

:::from
Initialization 的 variance 推导、$1/\sqrt n$ 和 ReLU 的 $2/n$、BN“相当于每层都做 preprocessing”、sanity check、update 与 weight 之比、log scale、random search 胜过 grid search、搜索范围的边界、coarse-to-fine，来自 [notes 的 Neural Networks Part 2](https://github.com/cs231n/cs231n.github.io/blob/master/neural-networks-2.md) 与 [Part 3](https://github.com/cs231n/cs231n.github.io/blob/master/neural-networks-3.md)；transfer learning 的四种情形和较小的 learning rate 来自 [notes 的 Transfer Learning](https://github.com/cs231n/cs231n.github.io/blob/master/transfer-learning.md)。6 层、4096 个 neuron、std 0.01 与 0.05 的实验设定，ResNet 的 augmentation 和 10-crop，Cutout，dropout 在 test time 的 scale，调参的 7 步，transfer learning 的表和一百万张的法则，来自 [Lecture 6 slides](https://cs231n.stanford.edu/slides/2026/lecture_6.pdf)；slides 上那个实验用的是什么 activation、得到什么曲线没有读到，上表是按 ReLU 为这一页算的。Spatial BN 合并位置的理由、reshape 的做法、LN 对 batch size 不敏感、dropout 的 `p` 是保留的 probability，来自 A2 的 notebook 和 `layers.py`。四种 normalization 的分组、$S_i$ 的统一写法、$G=32$ 和 batch size 的表来自 [Group Norm 论文](https://arxiv.org/pdf/1803.08494)（只读到抽取的片段）；crop 的计数、augmentation 的 wrong 是为这一页写的。
:::

## [detect] Detection 与 segmentation

:::skip
快速路线里可以跳过。A3 Q4 用 mean IoU 评估 segmentation，至少读“Anchor 与 IoU”一节里 IoU 的定义。能算 IoU、手走 NMS、写出 transposed convolution 的 output，说出 R-CNN 到 Faster R-CNN 每一步省掉了什么，就可以去第 6 站。
:::

### Semantic segmentation：每个 pixel 一个 label

Classification 给整张 image 一个 label；semantic segmentation 给每个 pixel 一个 label，同一 class 的不同 instance 不区分。

最直接的办法是对每个 pixel 裁一块以它为中心的 patch，送进 CNN 分类它的中心。一张 224×224 的 image 要做 50,176 次 forward，相邻的 patch 几乎重叠，同样的 feature 被重复算了几万次。第二个办法是整个 network 都用 conv、不做 downsampling，最后直接输出 $C\times H\times W$ 的 score。但在全分辨率上做 conv 太贵：一层 3×3、64 进 64 出的 conv 在 224×224 上要

$$224\times224\times64\times3\times3\times64=1.85\times10^9$$

次 multiply-add；在缩小 8 倍的 28×28 上只要 $2.89\times10^7$，少 64 倍。

所以实际的设计是先 downsample 再 upsample：前半段像 classification network 一样用 pooling 或 strided conv 缩小，在小的 feature map 上做大部分计算，后半段再放大回 $H\times W$。

### Upsampling：transposed convolution

Upsampling 也可以是 learnable 的。Strided conv 是 input 走 2 格、output 走 1 格；transposed convolution 反过来，input 走 1 格、output 走 2 格。

::fig[stanford-cs231n-tconv] 两个 input 数各乘上整个 filter，以 stride 2 错开放到 output 上，重叠的地方相加。

为什么叫 transposed？把 1D、stride 2、filter $(x,y,z)$ 的普通 conv 写成 matrix。Input 长 5，output 长 $(5-3)/2+1=2$：

$$\begin{pmatrix}o_1\\o_2\end{pmatrix}=\underbrace{\begin{pmatrix}x&y&z&0&0\\0&0&x&y&z\end{pmatrix}}_{M}\begin{pmatrix}i_1\\i_2\\i_3\\i_4\\i_5\end{pmatrix}$$

把 $M$ 转置，乘一个长 2 的 vector $(a,b)$：

$$M^\top\begin{pmatrix}a\\b\end{pmatrix}=\begin{pmatrix}ax\\ay\\az+bx\\by\\bz\end{pmatrix}$$

正是图里的做法：每个 input 数乘上整个 filter，错开 stride 放好，重叠处相加。图里 $(a,b)=(2,3)$、filter $(1,2,1)$，得 $(2,4,5,6,3)$。Conv 的 backward 对 input 求 gradient 时乘的也是 $M^\top$（第 2 站），所以 transposed convolution 的 forward 就是普通 conv 的 backward。

长 $n$ 的 input，output 长 $(n-1)S+F-2P$。常用 $F=4,S=2,P=1$：$(n-1)\cdot2+4-2=2n$，恰好放大一倍。

U-Net 在这个结构上再加一条：upsampling 的每一段把 downsampling 路上同样分辨率的 feature map 拼接（concatenate）进来。缩小的路上 receptive field 变大，但丢了精确的位置；拼回高分辨率的 feature，边界才画得准。第 8 站 DDPM 的 denoiser 也是 U-Net。

### 一个 object：classification 加 box regression

Image 里只有一个 object 时，在 CNN 的 feature 后面接两个头：一个 4096 进 1000 出的 FC 给 class score，用 softmax loss；一个 4096 进 4 出的 FC 给 box 的 $(x,y,w,h)$，用 L2 loss，把定位当 regression。总 loss 是两者相加，叫 multitask loss。

### 很多 object：从 sliding window 到 region proposal

Object 的个数不固定，output 的长度没法事先定。一个 object 4 个数，三个 object 12 个数。

退回到 classification：把所有可能的 box 裁出来，一个个判断是某个 class 还是 background。可能的 box 有多少？一张 $W\times H$ 的 image 上，宽 $w$、高 $h$ 的 box 有 $(W-w+1)(H-h+1)$ 个位置；对所有 $w$、$h$ 加起来，

$$\sum_{w=1}^{W}(W-w+1)\sum_{h=1}^{H}(H-h+1)=\frac{W(W+1)}{2}\cdot\frac{H(H+1)}{2}$$

800×600 的 image 是 $320{,}400\times180{,}300=5.8\times10^{10}$ 个 box，每个都跑一次 CNN 是不可能的。

R-CNN 一家的改进，每一步省掉一种重复：

| 方法 | 做法 | 省掉了什么 |
|---|---|---|
| R-CNN | 用 Selective Search 在 CPU 上花几秒找约 2000 个可能有 object 的 region，每个 warp 成 224×224，各跑一次 CNN，再预测 4 个修正量 | 从几百亿个 box 降到 2000 个 |
| Fast R-CNN | 整张 image 只过一次 backbone，在 feature map 上按每个 region 裁出 feature 再 resize | 2000 次 backbone 降到 1 次 |
| Faster R-CNN | 用一个小 network（RPN）在 feature map 上直接提 region | 去掉 CPU 上的 Selective Search |

Faster R-CNN 论文报告，用 VGG-16 时 proposal 加 detection 一共 198 ms 一张，约 5 fps，RPN 在共享的 feature 上只多花约 10 ms。Backbone 换得好也直接见效：ResNet 论文把 Faster R-CNN 的 backbone 从 VGG-16 换成 ResNet-101，COCO 上的 mAP@[.5, .95]（下面会定义）从 21.2 升到 27.2。

### Anchor 与 IoU

先定义两个 box 有多像。Intersection over Union：

$$\text{IoU}(A,B)=\frac{|A\cap B|}{|A\cup B|}$$

两个 10×10 的 box 横向错开 2 个 pixel，交集 $8\times10=80$，并集 $100+100-80=120$，IoU 0.67；沿对角线各错开 2 个 pixel，交集 $8\times8=64$，并集 136，IoU 0.47。只是挪了一点，IoU 掉得很快。Johnson 的 slides 给了一个手感：IoU 超过 0.5 算 decent，超过 0.7 算 pretty good，超过 0.9 几乎完美。

RPN 的做法：Lecture 9 的例子里，640×480 的 image 经过 backbone 得 512×20×15 的 feature map，每格对应 input 上 32×32 个 pixel。在每一格的中心放 $K$ 个固定大小、固定形状的 box，叫 anchor。一个 conv 层对每个 anchor 预测两样东西：里面有没有 object（output $K\times20\times15$），以及从 anchor 到真实 box 的 4 个修正量（output $4K\times20\times15$）。最后按 objectness 排序，取前 300 个左右作为 proposal。Faster R-CNN 原文用 area $128^2$、$256^2$、$512^2$ 三种和长宽比 1:1、1:2、2:1 三种，$K=9$；这张 20×15 的 feature map 上就是 2700 个 anchor（原文的 backbone stride 是 16，feature map 通常约 2400 个位置，约两万个 anchor）。因为同一组 conv weight 在每个位置都用，output 层只有 $512\times(4+2)\times9\approx2.8\times10^4$ 个 parameter。

Training 时每个 anchor 要有一个 label。原文的规则：和某个 ground truth 的 IoU 高于 0.7 记 positive；如果某个 ground truth 没有任何 anchor 超过 0.7，和它 IoU 最高的那个 anchor 也记 positive；和所有 ground truth 的 IoU 都低于 0.3 记 negative；其余不参与 loss。每张 image 随机抽 256 个 anchor 算 loss，positive 和 negative 最多各一半。

::fig[stanford-cs231n-anchor] Anchor 的中心沿 feature map 的一行移动，每个位置三个形状（area 都是 128²）。右边是三个 anchor 与 ground truth 的 IoU 和标出的 label；下方的柱子是这一行每个位置的最大 IoU，横坐标和上面的 image 对齐。

Ground truth 是 100×190 的竖长 box，中心正好落在一格的中心上，竖长的 91×181 anchor 和它的 IoU 是 0.87，标 positive。中心往右挪一格（32 个 pixel，大约 box 宽度的三分之一），最大 IoU 掉到 0.48，不参与 loss；挪两格是 0.24，成了 negative。所以 anchor 的密度要和 object 的大小相称，一个 object 通常只有它中心附近几个 anchor 是 positive。

Positive anchor 还要回归 4 个修正量。设 anchor 的中心和大小是 $(x_a,y_a,w_a,h_a)$，ground truth 是 $(x,y,w,h)$，target 写成

$$t_x=\frac{x-x_a}{w_a},\quad t_y=\frac{y-y_a}{h_a},\quad t_w=\log\frac{w}{w_a},\quad t_h=\log\frac{h}{h_a}$$

除以 anchor 的大小，大 box 和小 box 的误差才能放在一起比较；宽高取 log，预测出任意实数都能变回正的宽高。例如 anchor $(320,240,128,128)$、ground truth $(340,230,160,100)$：

$$t=\Big(\tfrac{20}{128},\ \tfrac{-10}{128},\ \ln\tfrac{160}{128},\ \ln\tfrac{100}{128}\Big)=(0.156,\ -0.078,\ 0.223,\ -0.247)$$

这两个 box 的 IoU 是 0.62；如果这个 ground truth 有别的 anchor 的 IoU 更高，按上面的规则它不参与 training。Loss 里这一项只对 positive anchor 算，原文用 smooth L1。

### NMS 与 mAP

Detector 在同一个 object 周围往往给出好几个重叠的 box。Non-maximum suppression 把重复的去掉：

1. 取剩下的 box 里分数最高的，保留；
2. 删掉和它的 IoU 超过 threshold（例如 0.7）的 box；
3. 还有剩下的就回到第 1 步。

::fig[stanford-cs231n-nms] 两只 dog 各有两个重叠的 detection。按分数从高到低走一遍 NMS。

结果每只 dog 留一个 box。注意第 3 步保留 C 时，C 和 A 的 IoU 只有 0.04，所以它没有在第 2 步被 A 删掉。

评估 detector 用 mean average precision。对每个 class：在所有 test image 上跑 detector 和 NMS，把这一 class 的 detection 按分数从高到低排；依次看每个 detection，若它和某个还没被匹配的 ground truth 的 IoU 超过 0.5，记 true positive 并把那个 ground truth 划掉，否则记 false positive；每看一个，算一次 precision 和 recall，得到 precision–recall curve 上的一个点。AP 是这条 curve 下的面积，mAP 是各 class 的 AP 的平均。

Johnson 的例子：3 个 dog 的 ground truth，5 个 dog 的 detection 按分数排好后依次是 TP、TP、FP、FP、TP。

| 看到第几个 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| precision | 1/1 | 2/2 | 2/3 | 2/4 | 3/5 |
| recall | 1/3 | 2/3 | 2/3 | 2/3 | 3/3 |

Recall 每升 1/3 记一次那一段的 precision：从 0 到 2/3 是 1.0，从 2/3 到 1 是 0.6，$\text{AP}=\tfrac23\times1.0+\tfrac13\times0.6=0.87$（slides 写作 0.86）。COCO 的 mAP 更严：把 IoU threshold 从 0.5 到 0.95 每隔 0.05 取一个，10 个 threshold 各算一次 mAP 再平均，box 不但要找到，还要框得准。

:::wrong NMS 的 threshold 设得越低，结果越干净
Threshold 低，删得就狠。两个人并排站、身体重叠，他们的 box 的 IoU 可能有 0.6；threshold 设 0.5 时，分低的那个人会被当成重复删掉，recall 直接少一个。Johnson 的 slides 也指出，object 大量重叠时 NMS 会删掉好的 box，而且没有很好的解决办法。下面的 DETR 是绕开 NMS 的一条路。
:::

### 单阶段 detector 与 DETR

RPN 只判断“有没有 object”，class 留给第二阶段。YOLO、SSD 这类 single-stage detector 一步到位：把 image 分成 7×7 的 grid，每格放 $B$ 个 base box，每个 box 回归 5 个数（4 个修正量和一个 confidence），每格再给 $C$ 个 class 的 score（含 background），output 是 $7\times7\times(5B+C)$。$B=3$、$C=21$ 时是 $7\times7\times36=1764$ 个数。

DETR 用 Transformer 直接输出一组 box，不用 anchor，也不回归修正量。Training 时先把预测的 box 和 ground truth 做 bipartite matching：每个 ground truth 恰好配一个预测，多出来的预测配“no object”。配好后再算 classification loss 和 box loss。因为一个 object 只能被配一次，对同一个 object 的第二个预测在 training 时被当作“no object”来惩罚，model 学会不出重复的 box，test time 就不需要 NMS。

### Instance segmentation：Mask R-CNN

Instance segmentation 要分开同一 class 的不同 instance。Mask R-CNN 在 Faster R-CNN 上加一个小头：每个 region 经 RoI Align 得 256×14×14 的 feature，几层 conv 后对 $C$ 个 class 各预测一张 28×28 的 binary mask，同时照旧输出 class score 和 $4C$ 个 box 坐标。

Mask 的 loss 是对每个 pixel 做 sigmoid 再算 binary cross-entropy，而且只用 ground truth 那个 class 的那一张 mask；其余 $C-1$ 张不参与 loss。这样各 class 的 mask 不互相竞争，判断是什么 class 交给 classification 那个头，mask 头只管形状。总 loss 是 $L_{\text{cls}}+L_{\text{box}}+L_{\text{mask}}$。

RoI Align 改的是 Fast R-CNN 裁 feature 的那一步。旧的 RoI Pool 把 region 的坐标 $x$ 换成 feature 坐标时取 $[x/16]$（16 是 feature map 的 stride，$[\cdot]$ 是 round）。一个左边缘在 59.2 pixel 的 region 落在 feature 坐标 3.7 处，round 成 4，相当于把 region 挪了 $0.3\times16=4.8$ 个 pixel。对 box 影响不大，对一张 28×28 的 mask 就是明显的错位。RoI Align 直接用 $x/16$，不 round，在每个 bin 里规则地取 4 个点，用 bilinear interpolation 算出那里的 feature 值。Mask R-CNN 论文的 ablation：只把 RoI Pool 换成 RoI Align，mask AP 从 26.9 升到 30.3，要求 IoU 0.75 的 AP 从 26.4 升到 31.5，提升主要在要求框得准的地方。

:::from
Sliding window 与 fully convolutional 的问题、先缩后放、transposed convolution 的 1D 例子 $(ax,ay,az+bx,by,bz)$ 和“stride 是 output 与 input 移动的比”、U-Net 的拼接、classification 加 localization 的两个头、R-CNN、Fast R-CNN、Faster R-CNN 的流程、640×480 得 20×15、$K\times20\times15$ 与 $4K\times20\times15$、取前 300、7×7×(5B+C)、DETR 的 bipartite matching、Mask R-CNN 的 14×14 与 28×28，来自 [Lecture 9 slides](https://cs231n.stanford.edu/slides/2026/lecture_9.pdf)；那份 slides 没有讲 IoU、NMS 和 mAP。IoU 的 0.5/0.7/0.9、NMS 的三步和 0.7、mAP 的计算步骤和 dog 的例子、sliding window 的计数 formula、“重叠时 NMS 会删掉好的 box”，来自 [Johnson 的 EECS 498 Lecture 15](https://web.eecs.umich.edu/~justincj/slides/eecs498/498_FA2019_lecture15.pdf)。$K=9$ 与三种 area、0.7 与 0.3 的两条规则、256 个 anchor 的抽样、$t_x,t_w$ 的写法与 smooth L1、2.8×10^4 个 parameter、198 ms，核对过 [Faster R-CNN 原文](https://arXiv.org/pdf/1506.01497.pdf)；RoI Pool 的 $[x/16]$、RoI Align 的 4 个采样点、mask loss 只用一张 mask、ablation 的数字来自 [Mask R-CNN 原文](https://arxiv.org/pdf/1703.06870)；COCO 上 21.2 与 27.2 来自 ResNet 原文。三篇都只读到抽取的片段。Transposed convolution 是 $M^\top$ 的推导、output 长度的 formula、动图和 NMS 图里的 box 与 IoU、8×10^10 个 box 的数，是为这一页算的。
:::

## [vit] Vision Transformer

:::skip
快速路线必读（Lecture 8，A3 Q1）。能算出 patch token 的个数和 patch embedding 的 parameter，说明没有 position embedding 时 ViT 为什么分不出打乱的 patch，并能用 ViT 论文的数字说明它为什么要大 data，就可以去第 7 站。
:::

### 每个 patch 直接看所有 patch

第 3 站算过，stride 1 的 3×3 conv 每层只把 receptive field 扩大 2 个 pixel；image 两头的两个部分要发生关系，得经过很多层。Self-attention 一层就能做到：每个 output 是所有 input 的 weighted sum，weight 由内容决定。

Lecture 8 的写法：input 是 $N$ 个 vector 排成的 $X\in\mathbb R^{N\times D}$，

$$Q=XW_Q,\quad K=XW_K,\quad V=XW_V,\qquad A=\mathrm{softmax}\Big(\frac{QK^\top}{\sqrt D}\Big),\qquad Y=AV$$

softmax 对 $A$ 的每个 row 做，每个 row 是一个 query 对 $N$ 个 key 的 weight，加起来是 1。$\sqrt D$ 的来历、multi-head 的拆法见 [CS4248](../courses/CS4248.html#attn)。

Transformer block 是 self-attention 和一个对每个 vector 各自做的 MLP（$D\to4D\to D$），各带一个 residual connection 和一个 LayerNorm；现在通用 pre-norm，LayerNorm 放在 residual 支路里面。Self-attention 是 vector 之间唯一的交互。

### 把 image 变成 token

Attention 处理的是一组 vector，image 要先切开。一张 224×224×3 的 image 按 16×16 切，得 $14\times14=196$ 个 patch，每个是 $16\times16\times3=768$ 个数；每个 patch 拉直后乘同一个 $768\times D$ 的 matrix $E$，变成一个 $D$ 维的 token。“切成不重叠的 16×16 块、每块乘同一个 matrix”就是一个 kernel 16×16、stride 16、$D$ 个 output channel 的 conv，A3 的 `PatchEmbedding` 可以用 reshape 实现，也可以用一个 `Conv2d`。

A3 的 `VisionTransformer` 默认在 CIFAR-10 上用：32×32 的 image，patch 8×8，得 $4\times4=16$ 个 token，每个 patch $8\times8\times3=192$ 个数，embed 到 128 维，patch embedding 有 $192\times128+128=24{,}704$ 个 parameter；6 个 encoder layer，4 个 head，MLP 的 hidden size 256。最后把 16 个 output 取平均，接一个 FC 出 10 个 score。原始的 ViT 是在序列前面加一个 learnable 的 class token，用它的最终状态做分类，224 的 image 于是有 197 个 token；Lecture 8 和 A3 都用平均。

ViT-Base 有 12 层、$D=768$、MLP 3072、12 个 head，8600 万个 parameter；ViT-Large 24 层、$D=1024$，3.07 亿；ViT-Huge 32 层、$D=1280$，6.32 亿。

### Attention 里 patch 怎样互相影响

::fig[stanford-cs231n-vit] 依次选一个 patch 做 query，右边是它对 16 个 patch 的 attention weight。虚线是一层 3×3 conv 在同一个位置能看到的范围。

图里每个 patch 的 token 只编码它的内容：object、sky、grass 三类各是一个长度 2.5 的 one-hot vector，$W_Q=W_K=I$，$D=3$。同类的两个 patch，$q\cdot k/\sqrt3=2.5^2/1.732=3.61$；不同类是 0。Object 有 6 个 patch，query 取一个 object patch 时，

$$e^{3.61}=36.9,\qquad\text{同类每个}\ \frac{36.9}{6\times36.9+10\times1}=0.159,\qquad\text{其余每个}\ \frac{1}{231.4}=0.004$$

6 个 object patch 合计拿走 0.96 的 weight，其中右下角的两个离 query 很远，在 3×3 conv 的 window 之外，weight 和紧挨着的完全一样。这一层的 output 已经把整个 object 的信息合到了一起，CNN 要叠好几层才能做到。

反过来，这也说明 attention 本身对距离一无所知：只按内容打分时，远近没有区别。

### 不加 position embedding 会怎样

设 $\Pi$ 是一个 permutation matrix，把 patch 的顺序打乱成 $\Pi X$。代进 self-attention：

$$(\Pi X)W_Q\big((\Pi X)W_K\big)^\top=\Pi\,(QK^\top)\,\Pi^\top$$

对每个 row 做 softmax，再把 row 和 column 一起重排，结果和先重排再 softmax 一样，所以 attention matrix 变成 $\Pi A\Pi^\top$。再乘 $V$：

$$\Pi A\Pi^\top\cdot\Pi XW_V=\Pi A\,XW_V=\Pi Y$$

因为 $\Pi^\top\Pi=I$。Output 只是被同样地重排了，这叫 permutation equivariance；MLP、LayerNorm 对每个 token 各自做，同样 equivariant。最后取平均，$\frac1N\mathbf 1^\top\Pi Y=\frac1N\mathbf 1^\top Y$，和顺序完全无关。所以一个没有 position embedding 的 ViT，对一张 image 和把它的 patch 随机打乱后的 image，给出一模一样的 class score。

解决办法是在第一层之前给每个 token 加上一个表示位置的 vector：ViT 用 learnable 的 $E_{\text{pos}}$，A3 用 1D sinusoidal 的 positional encoding。ViT 论文的 ablation（ViT-B/16，ImageNet 5-shot linear）：不加是 61.4%，1D 是 64.2%，2D 是 64.0%，relative 是 64.0%。有没有差得多，用哪种几乎没有差别；论文的解释是 ViT 处理的只有 14×14 个 patch，分辨率很低，1D 的编号也足够学出 2D 的关系。

### ViT 需要多少 data

CNN 的每一层都写死了三条关于 image 的知识：locality（只看附近）、2D 的邻接结构、translation equivariance（第 2 站的 parameter sharing）。ViT 里只有逐 token 的 MLP 是 local、translation equivariant 的，self-attention 是 global 的；2D 结构只在切 patch 时用了一次，position embedding 一开始不含任何 2D 信息，空间关系全要从 data 里学。

结构里少写的，要用 data 补。ViT 论文在三个大小的 dataset 上 pretrain，再在 ImageNet 上 fine-tune（384 分辨率），top-1 是：

| Pretrain dataset | 大小 | ViT-B/16 | ViT-L/16 |
|---|---|---|---|
| ImageNet | 130 万 | 77.91 | 76.53 |
| ImageNet-21k | 1400 万 | 83.97 | 85.15 |
| JFT-300M | 3 亿 | 84.15 | 87.12 |

只用 ImageNet 时，同样设置的 BiT ResNet 比 ViT 好，大的 ViT-L 反而不如 ViT-B，论文说这时 ViT overfit 得比 ResNet 厉害；到 JFT-300M，ViT 超过 ResNet，大 model 的优势才显出来。这就是开头的第三件事。

:::wrong ViT 在 benchmark 上更强，所以小 dataset 也直接从头训练 ViT
上表第一行就是反例：130 万张 image 时，更大的 ViT 更差，而 ResNet 更好。CIFAR-10 只有 5 万张。A3 对 ViT 的要求是训练两个 epoch 后 test accuracy 超过 0.45；A2 的 PyTorch notebook 对一个三层 ConvNet 的预期是训练一个 epoch 就超过 45%。小 dataset 上用 ViT 的正路是拿大 dataset 上 pretrain 好的 weight 来 fine-tune（第 4 站的 transfer learning、第 7 站的 self-supervised pretraining），或者加强 augmentation 和 regularization。
:::

:::edge 低层的 attention 也有 local 的
ViT 论文测了每个 head 的 attention 平均跨多远：最低几层已经有 head 看遍几乎整张 image，也有 head 只看附近一小块，像 conv 一样；越往上，看得越远的 head 越多。Locality 没有写进结构，但 data 足够时它会被学出来一部分。
:::

### Attention 的计算量

一层里，$QK^\top$ 和 $AV$ 各是 $N^2D$ 次 multiply-add，Q、K、V 和 output 四个 projection 一共 $4ND^2$，MLP 是 $8ND^2$。Attention 的 $N^2$ 那部分只在 $N$ 比 $D$ 大很多时才占主导：

| 设定 | $N$ | $2N^2D$ | $12ND^2$ | Attention 的份额 |
|---|---|---|---|---|
| ViT-B/16，224×224 | 197 | $5.96\times10^7$ | $1.39\times10^9$ | 4.1% |
| ViT-B/16，1024×1024 | 4097 | $2.58\times10^{10}$ | $2.90\times10^{10}$ | 47% |

Patch 数随 image 边长的平方增长，$N^2$ 就是四次方。Memory 也一样：$H$ 个 head 的 attention matrix 有 $H\times N\times N$ 个数；Lecture 8 指出 FlashAttention 不存整个 matrix，把 memory 降到 $O(N)$，计算量不变。

:::from
Attention layer 的写法、permutation equivariance 的结论、pre-norm、MLP 的 $D\to4D\to D$、“self-attention 是唯一的交互”、ViT 切 patch 等价于 stride 16 的 conv、平均 pooling、四个 matmul 与 $O(N^2)$、FlashAttention，来自 [Lecture 8 slides](https://cs231n.stanford.edu/slides/2026/lecture_8.pdf)；slides 只给结论，permutation equivariance 和平均之后与顺序无关的推导是这一页写的。Inductive bias 的三条、Table 1 的规格、pretrain dataset 的对比与 overfit 的说法、position embedding 的 ablation、attention distance，来自 [ViT 论文](https://arxiv.org/pdf/2010.11929)。A3 的默认配置、平均 pooling、1D sinusoidal、0.45 的目标来自 A3 的 notebook 和 `transformer.py`。动图里的 token、计算量的表是为这一页算的。
:::

## [ssl] Self-supervised learning：contrastive、CLIP、DINO 与 MAE

:::skip
快速路线必读（Lecture 12，A3 Q2 与 Q4）。能对一个小 batch 手算 SimCLR 的 loss，说出 temperature 和 batch size 的作用、DINO 靠什么避免 collapse、MAE 为什么遮 75% 而且 encoder 只看 visible patch，就可以去第 8 站。
:::

### Label 从哪里来

第 4 站的 transfer learning 靠 ImageNet 的 120 万个人工 label。Self-supervised learning 想去掉这一步：从 data 本身造一个不需要人标的任务（pretext task），训练 encoder，然后把 encoder 拿去做真正关心的任务（downstream task）。一个典型的 pretext task 是把整张 image 随机转 0°、90°、180°、270°，让 network 做 4-way classification 猜转了多少；要猜对，得知道 image 里的东西哪边朝上，这需要认出东西。

怎么判断学到的 representation 好不好，Lecture 12 给了两种标准做法。Linear probe：冻住 encoder，只在它的 output 上训练一个 linear layer，看 accuracy，量的是 representation 本身有多好用。Fine-tune：把整个 encoder 接着训练，量的是它作为 initialization 能发挥到多好。两者衡量的东西不同，MAE 一节会看到它们给出很不一样的排名。

### Contrastive learning：InfoNCE

另一类 pretext task 不预测任何东西，只要求“同一张 image 的两个 view 在 embedding 里靠近，不同 image 的远离”。一个 reference $x$，一个 positive $x^+$，$N-1$ 个 negative，把它写成 $N$ 选 1 的 classification，用 cross-entropy，就是 InfoNCE loss。

SimCLR 的具体做法（A3 Q2）：一个 batch 有 $N$ 张 image，每张做两次随机 augmentation（random resized crop、color jitter、随机 grayscale 等），得 $2N$ 个 view；encoder $f$（ResNet）得 $h$，再经一个小的 projection head $g$ 得 $z$。同一张 image 的两个 view 是 positive pair，其余 $2N-2$ 个都是 negative。对 positive pair $(i,j)$，

$$\ell(i,j)=-\log\frac{\exp(\mathrm{sim}(z_i,z_j)/\tau)}{\sum_{k\ne i}\exp(\mathrm{sim}(z_i,z_k)/\tau)},\qquad\mathrm{sim}(u,v)=\frac{u\cdot v}{\|u\|\,\|v\|}$$

总 loss 是所有 $2N$ 个 view 各当一次 reference 的平均。

::fig[stanford-cs231n-simclr] $N=2$：cat 和 dog 各两个 view，embedding 画在单位圆上。右边是 $2N\times2N$ 的 similarity，对角线不用，深色是 positive pair。

算 $z_1$（cat view 1）的 loss，取 $\tau=0.5$。Positive 是 $z_3$，similarity $\cos20^\circ=0.94$；两个 negative 是 $z_2$（0）和 $z_4$（$\cos120^\circ=-0.5$）。

$$\ell(1,3)=-\log\frac{e^{0.94/0.5}}{e^{0/0.5}+e^{0.94/0.5}+e^{-0.5/0.5}}=-\log\frac{6.55}{1+6.55+0.37}=-\log0.827=0.19$$

四个 view 的 loss 依次是 0.19、0.42、0.34、0.17，平均 0.28。

$\tau$ 决定 loss 盯着哪个 negative。看 $z_2$（dog view 1）：它的两个 negative 是 $z_1$（similarity 0）和 $z_3$（0.34），$z_3$ 更难分。Gradient 推开每个 negative 的力度和它在 softmax 里的 weight 成正比。$\tau=1$ 时，$z_3$ 在两个 negative 里分到 $e^{0.34}/(e^{0.34}+e^0)=58\%$；$\tau=0.1$ 时分到 $e^{3.42}/(e^{3.42}+1)=97\%$。$\tau$ 越小，loss 越集中去推最难的 negative。整个 batch 的 loss 在 $\tau=0.1$ 时只剩 0.002，这个 batch 对它来说已经太容易。

$\tau$ 之外，negative 的个数也重要。Batch 大，negative 多，任务难，学到的 feature 好；Lecture 12 引用的 SimCLR 用到 8192 的 batch size。MoCo 把 negative 和 batch 拆开：维护一个 FIFO 的 queue，存前面若干个 batch 的 key 当 negative（默认 65,536 个），新 batch 的 key 入队，最旧的出队。MoCo 论文把 loss 写成 $-\log\frac{\exp(q\cdot k_+/\tau)}{\sum_{i=0}^{K}\exp(q\cdot k_i/\tau)}$，并直接称之为一个 $(K+1)$-way softmax classifier 的 log loss，$\tau=0.07$。

Queue 里的 key 是前几百个 iteration 算的，如果算 key 的 encoder 变得快，新旧 key 就不在同一个 embedding 空间里，互相比较没有意义。所以 key 由另一个 encoder 算，它不走 backprop，weight 是 query encoder 的 moving average：

$$\theta_k\leftarrow m\,\theta_k+(1-m)\,\theta_q$$

$m$ 越接近 1，key encoder 变得越慢。论文的 ablation（ResNet-50，linear classification accuracy）：

| $m$ | 0 | 0.9 | 0.99 | 0.999 | 0.9999 |
|---|---|---|---|---|---|
| accuracy | 不收敛 | 55.2 | 57.8 | 59.0 | 58.9 |

$m=0$ 就是直接复制 query encoder，loss 振荡、训练失败。$m=0.999$ 时，每一步只吸收 0.1% 的新 weight，key encoder 大约是最近一千步的平均。MoCo v2 再加上 SimCLR 的 projection head 和强 augmentation，batch size 256 就超过了 batch size 8192 的 SimCLR。

Lecture 12 和 A3 都强调，SimCLR 的效果主要来自两样：强的 augmentation 和 non-linear 的 projection head。Downstream 用的是 $h$，不是 $z$。

### CLIP：image 和 text 互为 positive

CLIP 把 positive pair 从“同一张 image 的两个 view”换成“一张 image 和它的 caption”。Lecture 16 说它的 data 是从网上抓的约 4 亿对 image 和 alt-text。Image encoder（ViT 或 ResNet）得 $I_n$，text encoder（Transformer）得 $T_n$，都做 L2 normalize；一个 batch 的 $N$ 对算出 $N\times N$ 的 similarity matrix，对角线是 positive，同一个 row 和 column 里的其余都是 negative。Loss 是双向的 InfoNCE：每张 image 在 $N$ 句 caption 里找自己的，每句 caption 在 $N$ 张 image 里找自己的。这和上图是同一个结构，只是 matrix 的两条边分别是 image 和 text。

训练好之后，CLIP 不用任何 label 就能分类（zero-shot classification）：用 text encoder 给每个 class 算一个 embedding，一张 image 归到和它 similarity 最大的那个 class。Lecture 16 指出，这相当于拿 text embedding 当 training data 做 1-nearest neighbor（第 1 站）。Class 名怎么写成文字也有讲究：写成 “A photo of a [category]” 比只写 class 名在 ImageNet 上高 1.3%，对每个 class 写多句话（“A drawing of a …” 等）再把 embedding 取平均，又高 5%。A3 Q4 让你实现这个 classifier 和以文搜图的 retriever；A3 的 notebook 提到，CLIP 是第一个不用任何 ImageNet image 和 label、在 ImageNet classification 上超过 standard supervised training 的 model。

Lecture 16 也指出 CLIP 依赖 batch size：要学会区分“草地上的杯子”和“杯子里的草”，这两个 caption 得碰巧出现在同一个 batch 里互为 negative，batch size 到 32K 也很难保证。

### DINO：不用 negative

SimCLR 和 CLIP 都要大 batch 提供 negative。为什么不能只要求 positive pair 靠近？因为有一个平凡解：encoder 把所有 image 都映射成同一个 vector，所有 positive pair 的 similarity 都是 1，loss 最小，什么也没学到。这叫 collapse。Negative 的作用就是禁止它。

DINO 用 student–teacher 的结构绕开 negative（A3 Q4 的说明）：两个 encoder 看同一张 image 的不同 view，student 通过 backprop 训练，让自己的 output distribution 去匹配 teacher 的；teacher 不走 backprop，weight 是 student 的 exponential moving average，变化慢，给 student 一个稳定的目标，和 MoCo 的 key encoder 是同一个想法。

DINO 论文的写法：两个 network 的 output 都是 $K=65{,}536$ 维，经 softmax 变成 distribution $P_t,P_s$，student 最小化 cross-entropy $H(P_t,P_s)=-\sum P_t\log P_s$。View 用 multi-crop：从一张 image 裁出两个 224² 的 global view 和几个 96² 的 local view，teacher 只看 global view，student 看全部 view，要让自己在每个 view 上的 output 去匹配 teacher 在另一个 global view 上的 output，也就是从局部预测整体。Teacher 的更新 $\theta_t\leftarrow\lambda\theta_t+(1-\lambda)\theta_s$，$\lambda$ 按 cosine 从 0.996 升到 1。

只靠这些仍会 collapse。论文把 loss 拆开看：$H(P_t,P_s)=h(P_t)+D_{\text{KL}}(P_t\,\|\,P_s)$。Collapse 有两种形态：所有 image 都押在同一个维度上，$P_t$ 是 one-hot，entropy $h=0$；或者 $P_t$ 对 $K$ 个维度都是 uniform，$h=\log K$。两种情形下 student 只要输出同样的东西，KL 就是 0，什么也没学到。DINO 对 teacher 的 output 做两件事来挡住它们。Centering：teacher 的 logit 减去一个 center $c$，$c\leftarrow mc+(1-m)\frac1B\sum_ig_{\theta_t}(x_i)$ 是它在 batch 上的 running mean，没有哪一维能一直占优；论文说它挡住了第一种，却会把 output 推向 uniform。Sharpening：teacher 的 softmax 用比 student 低的 temperature（student 0.1，teacher 从 0.04 升到 0.07），output 被压得尖，效果正好相反。两者只用一个，论文的 ablation 里 KL 都会降到 0：不做 centering 时 $h$ 趋于 0，不做 sharpening 时 $h$ 趋于 $\log K$。

论文报告 ViT-S/16 在 ImageNet 上 linear probe 77.0%，直接拿 feature 做 k-NN 也有 74.5%，不用训练任何 classifier。

DINO 的 ViT 在没有任何 segmentation label 的情况下，class token 对 patch 的 attention 就会落在 object 上。A3 Q4 拿它的 patch feature 做 segmentation：只用一个 video 的一帧的 mask 训练一个 linear layer 或两层 MLP，在其余帧上预测，要求 mean IoU（第 5 站的 IoU 对每个 class 求平均）在第一帧超过 0.45、最后一帧超过 0.50，整段 video 超过 0.55。

### MAE：遮掉 75%

另一条路是回到“预测缺掉的部分”。BERT 遮掉 15% 的 word 去预测，image 能不能也这样？MAE 论文指出 image 和 language 的差别：language 信息密集，猜出几个缺的 word 需要理解句子；image 的空间冗余很大，缺一个 patch 往往从邻居插值就能补上，不需要认出任何东西。所以 MAE 遮得很多，随机遮掉 75% 的 patch，剩下的太少，只能靠对整体的理解去补。

::fig[stanford-cs231n-mae] 224×224 的 image 按 16×16 切成 196 个 patch，随机遮掉 147 个。Encoder 只处理 49 个 visible patch；decoder 在被遮的位置补上同一个 learnable 的 mask token，重建全部 196 个，loss 只在被遮的 147 个上算。

几个设计都有理由。Encoder 不处理 mask token，sequence 只有原来的四分之一，加上 decoder 很轻（8 个 block、512 维，每个 token 的计算不到 encoder 的 10%），训练快得多：ViT-L 训练 800 个 epoch，encoder 带 mask token 要 42.4 小时，不带是 15.4 小时，快 2.8 倍。Encoder 带上 mask token 不仅慢，linear probe 也从 73.5% 掉到 59.6%，因为 downstream 时根本没有 mask token，训练和使用的 input 对不上。Loss 用 pixel 的 MSE，只算被遮的 patch；把每个 patch 的 pixel 先减去自己的 mean、除以 std 作为 target，fine-tune 从 84.9% 升到 85.4%。

Masking ratio 的 ablation（ViT-L/16，ImageNet；数字是从论文的图上读的，是近似值）：

| Masking ratio | 10% | 30% | 50% | 75% | 90% |
|---|---|---|---|---|---|
| Fine-tune | 83.2 | 83.4 | 84.9 | 84.9 | 83.0 |
| Linear probe | 54.6 | 61.7 | 69.9 | 73.5 | 66.1 |

Fine-tune 在 40% 到 80% 之间都差不多，linear probe 在 75% 达到最高。

:::wrong MAE 的 linear probe 只有 73.5%，比 contrastive 方法低，说明它学到的 feature 差
Linear probe 量的是 feature 能不能被一个 linear layer 直接分开。MAE 的 ViT-L fine-tune 到 84.9%，同一个 ViT-L 从头训练只有 82.5%，pretraining 实打实地多给了 2.4 个点；ViT-H 用 448 的分辨率 fine-tune 到 87.8%，只用 ImageNet-1K 的 data。它的 feature 需要再经过几层非线性才能用好，所以按 linear probe 排名吃亏，按 fine-tune 排名领先。选哪种 pretrained encoder，要看 downstream 是冻住用还是会 fine-tune。
:::

:::back
Augmentation 的意义见[第 4 站](#train)；ViT 的 patch 和 class token 见[第 6 站](#vit)；mean IoU 用的是[第 5 站](#detect)的 IoU。
:::

:::from
Pretext 与 downstream、linear probe 与 fine-tune、rotation 的 4-way classification、InfoNCE 是 $N$ 选 1 的 cross-entropy、SimCLR 的 augmentation 与 projection head 的结论、8192 的 batch size、MoCo 的 queue 与 momentum encoder、MoCo v2 用 256 超过 8192，来自 [Lecture 12 slides](https://cs231n.stanford.edu/slides/2026/lecture_12.pdf)；slides 上 DINO 只有标题。SimCLR loss 的写法、A3 的 augmentation、CLIP 的 similarity matrix 与 zero-shot、“第一个不用 ImageNet 超过 supervised”的说法、DINO 的 student–teacher 与 EMA、DINO segmentation 的 0.45/0.50/0.55，来自 A3 的 `Self_Supervised_Learning.ipynb` 和 `CLIP_DINO.ipynb`。MAE 一节的全部数字和“image 冗余大”的论证来自 [MAE 论文](https://arxiv.org/pdf/2111.06377v3)，masking ratio 的表是从论文的图读出的近似值。Queue、$(K+1)$-way 的说法、$\tau=0.07$、65,536、$m$ 的 ablation 和“key encoder 变得太快会失去一致性”，核对过 [MoCo 原文](https://arxiv.org/pdf/1911.05722)；$K=65{,}536$、multi-crop、$\lambda$ 的 schedule、两个 temperature、center 的更新、$h+D_{\text{KL}}$ 的拆分和 collapse 的 ablation、77.0 与 74.5，来自 [DINO 原文](https://arxiv.org/pdf/2104.14294)；CLIP 的 4 亿对、双向 InfoNCE、1-nearest neighbor 的说法、prompt 的 +1.3% 与 +5%、32K batch 的局限，来自 [Lecture 16 slides](https://cs231n.stanford.edu/slides/2026/lecture_16.pdf)。论文和 slides 都只读到抽取的片段。Temperature 的那笔账和图里的 embedding 是为这一页算的。
:::

## [gen] 视觉里的 generative model：从 rectified flow 到 DDPM

:::skip
快速路线必读（Lecture 14，A3 Q3）。能写出 rectified flow 的 training 与 sampling，说出 DDPM 在 $a(t),b(t)$ 的统一写法里是哪一种，由 schedule 算出 $\bar\alpha_t$，写出 noise prediction loss、一步 sampling 的 mean 和 variance，并说清 A3 的 classifier-free guidance 用的是哪种写法，就可以去做作业。
:::

### 这一站和别的页面怎么分工

Lecture 13 先区分 discriminative model $p(y\mid x)$、generative model $p(x)$ 和 conditional generative model $p(x\mid y)$，再按“能不能算出 $p(x)$”给 generative model 分类：autoregressive model 能精确算，VAE 能算一个 lower bound，GAN 和 diffusion 只能 sample。这一讲细讲了 autoregressive model 和 VAE，Lecture 14 讲 GAN 和 diffusion。Autoregressive 用在 pixel 上为什么不行，slides 给了一个数：1024×1024 的 image 有 $1024\times1024\times3=3{,}145{,}728$ 个 subpixel，逐个生成就要三百多万步。VAE 的 ELBO、GAN 的 objective 与最优 discriminator、在 discrete latent 上做 autoregression，在 [MIT 6.S978 的页面](../courses/MIT-6.S978.html#vae)里各有一站（[VAE](../courses/MIT-6.S978.html#vae)、[GAN](../courses/MIT-6.S978.html#gan)、[autoregressive](../courses/MIT-6.S978.html#ar)），推导和 Lecture 13 的顺序一致，这里不重复。Diffusion 背后的 SDE、score matching 和 flow matching 在 [MIT 6.S184 的页面](../courses/MIT-6.S184.html#fm)。

这一站先讲 Lecture 14 的写法，再讲 A3 Q3 要实现的 DDPM，每一块写到能直接对照 `gaussian_diffusion.py` 和 `unet.py`。两者是同一个框架下对 noise schedule 和 prediction target 的两种选择。

### Lecture 14 的写法：rectified flow

Lecture 14 用最简单的一种 diffusion 讲原理。取 data $x$、Gaussian noise $z$、$t\sim\text{Uniform}(0,1)$，在两者之间连一条直线：

$$x_t=(1-t)\,x+t\,z,\qquad v=z-x$$

$t=0$ 是干净的 data，$t=1$ 是纯 noise。Network $f_\theta(x_t,t)$ 预测沿这条线的速度 $v$，loss 是 $\|f_\theta(x_t,t)-v\|^2$。Sampling 从 $x\sim\mathcal N(0,I)$ 出发，取 $T$ 步（常用 50），在 $t=1,1-\tfrac1T,\dots$ 上每步做 $x\leftarrow x-f_\theta(x,t)/T$，逆着速度走回 $t=0$。为什么一条一条直线平均起来能把整个 noise distribution 搬到 data distribution，见 [MIT 6.S184 的 flow matching 一站](../courses/MIT-6.S184.html#fm)。

Lecture 14 接着指出，同一个 $x_t$ 可能来自很多对不同的 $(x,z)$，network 学到的是它们的平均。两头的平均很好算：$t=1$ 时 $x_t=z$，对 $x$ 一无所知，最好的预测是 $v=x_t-\mathbb E[x]$；$t=0$ 时 $x_t=x$，对 $z$ 一无所知，最好的预测是 $v=\mathbb E[z]-x_t=-x_t$。中间的 noise level 最含糊，最难学，所以实际训练时 $t$ 不均匀地取，常用 logit-normal，多在中间取。

Slides 最后把各种 diffusion 统一成一个形式：$x_t=a(t)\,x+b(t)\,z$，network 预测 $c(t)\,x+d(t)\,z$。Rectified flow 是 $a=1-t$、$b=t$、$c=-1$、$d=1$；预测 noise 的 $\varepsilon$-prediction 是 $c=0$、$d=1$。下面的 DDPM 取 $a=\sqrt{\bar\alpha_t}$、$b=\sqrt{1-\bar\alpha_t}$，$a^2+b^2=1$，$x$ 和 $z$ 的 variance 都是 1 时 $x_t$ 的 variance 保持为 1（Lecture 14 叫 variance-preserving），预测的是 $z$，也就是 $\varepsilon$-prediction。

A3 Q3 的任务：在一个 32×32 的 emoji dataset 上，训练一个以 text 为条件的 DDPM；text 先用 pretrained CLIP 的 text encoder 编成 512 维的 vector（第 7 站），dataset 里已经预先编好。

### DDPM 的 forward process：一步步加 noise，也能一步到位

DDPM 的 forward process 每一步把 image 缩一点、加一点 Gaussian noise：

$$x_t=\sqrt{\alpha_t}\,x_{t-1}+\sqrt{1-\alpha_t}\,\varepsilon_t,\qquad\alpha_t=1-\beta_t,\qquad\varepsilon_t\sim\mathcal N(0,I)$$

$\beta_t$ 是事先定好的 noise schedule。Training 时每次都从 $x_0$ 一步步算到 $x_t$ 太慢，好在可以一步到位。走两步看看：

$$x_2=\sqrt{\alpha_2}\big(\sqrt{\alpha_1}\,x_0+\sqrt{1-\alpha_1}\,\varepsilon_1\big)+\sqrt{1-\alpha_2}\,\varepsilon_2=\sqrt{\alpha_1\alpha_2}\,x_0+\Big[\sqrt{\alpha_2(1-\alpha_1)}\,\varepsilon_1+\sqrt{1-\alpha_2}\,\varepsilon_2\Big]$$

方括号里是两个独立 Gaussian 的和，仍是 Gaussian，mean 0，variance 是 $\alpha_2(1-\alpha_1)+(1-\alpha_2)=1-\alpha_1\alpha_2$。所以它等于 $\sqrt{1-\alpha_1\alpha_2}\,\varepsilon$。一直这样做下去，记 $\bar\alpha_t=\prod_{s=1}^t\alpha_s$：

$$x_t=\sqrt{\bar\alpha_t}\,x_0+\sqrt{1-\bar\alpha_t}\,\varepsilon,\qquad\varepsilon\sim\mathcal N(0,I)$$

这就是 A3 的 `q_sample`。取 DDPM 原文的 linear schedule，$T=1000$，$\beta$ 从 0.0001 线性增加到 0.02：

| $t$ | 100 | 250 | 500 | 1000 |
|---|---|---|---|---|
| $\bar\alpha_t$ | 0.897 | 0.524 | 0.0786 | $4.0\times10^{-5}$ |
| $\sqrt{\bar\alpha_t}$（signal 的 scale） | 0.947 | 0.724 | 0.280 | 0.0064 |
| $\sqrt{1-\bar\alpha_t}$（noise 的 scale） | 0.321 | 0.690 | 0.960 | 1.000 |

::fig[stanford-cs231n-ddpm] 一张 16×16、pixel 值为 ±1 的笑脸，用同一个 $\varepsilon$ 按上表加 noise。

$t=250$ 时 signal 和 noise 的 scale 差不多，轮廓还在；$t=500$ 时 signal 只剩 0.28，基本看不出；$t=1000$ 时 $x_T$ 和纯 noise 没有区别，sampling 就从纯 noise 出发。A3 默认用的是 sigmoid schedule（`beta_schedule="sigmoid"`），形状不同，道理一样。

### Training：预测 noise

Denoiser $\varepsilon_\theta(x_t,t)$ 看着 $x_t$ 和 $t$，预测当初加进去的 $\varepsilon$。Training 的一步：

1. 从 data 取 $x_0$，均匀地抽一个 $t\in\{1,\dots,T\}$，抽 $\varepsilon\sim\mathcal N(0,I)$；
2. 用 closed form 算出 $x_t$；
3. loss 是 $\big\|\varepsilon-\varepsilon_\theta(x_t,t)\big\|^2$。

这个 loss 怎样从 likelihood 来、丢掉了什么 weight，见 [MIT 6.S184 的 denoising score matching 一站](../courses/MIT-6.S184.html#dsm)。A3 的 `p_losses` 就是这三步，再乘一个按 $t$ 取的 `loss_weight`。

预测 noise 和预测 $x_0$ 是一回事：closed form 里 $x_t$ 已知，知道一个就能解出另一个，

$$\hat x_0=\frac{x_t-\sqrt{1-\bar\alpha_t}\,\hat\varepsilon}{\sqrt{\bar\alpha_t}}$$

这是 A3 的 `predict_start_from_noise`；`objective` 选 `pred_noise` 还是 `pred_x_start`，只是 network 的 output 换了个含义。

:::wrong T = 1000，所以每张 image 训练时要过 1000 次 network
Training 每张 image 只抽一个 $t$，一次 forward、一次 backward；closed form 正是为了不必从 $x_0$ 一步步走到 $x_t$。1000 这个数只在 sampling 时出现：生成一张 image 要从 $x_T$ 走 1000 步，过 1000 次 network。DDPM 是 training 便宜、sampling 贵。
:::

### Sampling：从 $x_t$ 走到 $x_{t-1}$

:::skip
下面的推导是为了看清 `q_posterior` 里三个 coefficient 的来历，只想实现的话可以直接用结论。
:::

Sampling 每一步要从 $p(x_{t-1}\mid x_t)$ 抽样。如果知道 $x_0$，$x_{t-1}$ 的 distribution 是可以精确算出的：由 Bayes rule，

$$q(x_{t-1}\mid x_t,x_0)\propto q(x_t\mid x_{t-1})\,q(x_{t-1}\mid x_0)$$

两项都是 Gaussian。在 1 维写出 exponent，把 $x_{t-1}$ 记作 $y$：

$$-\frac{(x_t-\sqrt{\alpha_t}\,y)^2}{2\beta_t}-\frac{(y-\sqrt{\bar\alpha_{t-1}}\,x_0)^2}{2(1-\bar\alpha_{t-1})}$$

$y^2$ 的系数是 $-\tfrac12\big(\tfrac{\alpha_t}{\beta_t}+\tfrac1{1-\bar\alpha_{t-1}}\big)$。通分，numerator 是 $\alpha_t(1-\bar\alpha_{t-1})+\beta_t=\alpha_t-\bar\alpha_t+1-\alpha_t=1-\bar\alpha_t$，所以 variance 是

$$\tilde\beta_t=\frac{\beta_t(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}$$

$y$ 的一次项系数是 $\tfrac{\sqrt{\alpha_t}\,x_t}{\beta_t}+\tfrac{\sqrt{\bar\alpha_{t-1}}\,x_0}{1-\bar\alpha_{t-1}}$，mean 等于它乘以 variance：

$$\tilde\mu_t=\frac{\sqrt{\bar\alpha_{t-1}}\,\beta_t}{1-\bar\alpha_t}\,x_0+\frac{\sqrt{\alpha_t}\,(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}\,x_t$$

这三个式子就是 `gaussian_diffusion.py` 里 `posterior_mean_coef1`、`posterior_mean_coef2` 和 `posterior_var`。Sampling 时 $x_0$ 不知道，就用 network 预测的 $\hat x_0$ 代进去。$t=500$ 时（linear schedule），$\beta_t=0.0100$，$x_0$ 的系数 0.0031，$x_t$ 的系数 0.9941，std 0.100：每一步只往 $\hat x_0$ 的方向挪一点点，再加一点新的 noise。

A3 的 `p_sample` 要求先把 $\hat x_0$ clamp 到 $[-1,1]$。看上面 $\hat x_0$ 的 formula：$t=1000$ 时要除以 $\sqrt{\bar\alpha_t}=0.0064$，$\hat\varepsilon$ 上 0.01 的误差会被放大 157 倍，变成 $\hat x_0$ 上 1.6 的误差，远超 pixel 的范围。Clamp 把这种明显不可能的预测拉回来，前几百步才不会越走越偏。

### U-Net 与 conditioning

Denoiser 的 input 和 output 都是 $C\times H\times W$、对齐的 image，所以用第 5 站的 U-Net：一路 downsample 扩大 receptive field，一路 upsample 回原分辨率，同分辨率之间有 skip connection。A3 的 U-Net 里每个 ResNet block 还接收一个 context vector，由 time step $t$ 的 embedding 和 text embedding（经过一个小 MLP）合成，告诉 network 现在的 noise 有多大、要生成什么。

### Classifier-free guidance

只靠 conditioning，生成的 image 往往和 text 对得不够紧。Classifier-free guidance 的做法：training 时以一定 probability（A3 的 `uncond_prob`）把 text embedding 丢掉，让同一个 network 同时学会 conditional 的 $\varepsilon(x_t,c)$ 和 unconditional 的 $\varepsilon(x_t,\varnothing)$；sampling 时把两者外推：

$$\tilde\varepsilon=(1+w)\,\varepsilon(x_t,c)-w\,\varepsilon(x_t,\varnothing)=\varepsilon(x_t,c)+w\big(\varepsilon(x_t,c)-\varepsilon(x_t,\varnothing)\big)$$

沿着“有 condition 比没有多出来的方向”多走 $w$ 倍。这是 A3 的 `cfg_forward` 采用的写法（注释里写明出自 Ho and Salimans 的 Eq. 6），Lecture 14 对 rectified flow 的速度用的也是同一个形式 $v_{\text{cfg}}=(1+w)v_y-wv_\varnothing$；$w=0$ 就是普通的 conditional sampling。每一步要算两次 network，sampling 的计算量差不多翻倍。不少代码库写成 $\varepsilon_\varnothing+s(\varepsilon_c-\varepsilon_\varnothing)$，那里 $s=1$ 才是普通 conditional，$s=1+w$。两种写法的 scale 差 1，照别的代码抄时要换算。按这种写法，$\varepsilon$ 对应的 score 是 $\nabla\log p(x)+(1+w)\nabla\log p(c\mid x)$，相当于把 $p(c\mid x)$ 放大成 $1+w$ 次方；$\varepsilon$ 和 score 只差一个 scale 见 [MIT 6.S184 的 denoising score matching 一站](../courses/MIT-6.S184.html#dsm)，guidance 的完整推导见 [guidance 一站](../courses/MIT-6.S184.html#cfg)。

### 从 pixel 到 latent

A3 直接在 32×32 的 pixel 上做 diffusion。Lecture 14 说明，今天大多数 image 和 video model 是 latent diffusion：先训练一个 encoder–decoder（VAE，KL 的 weight 很小，再加一个 GAN loss 防止 decoder 输出模糊），把 image 压成 latent，diffusion 在 latent 上做，生成完再用 decoder 还原。Slides 的例子是 downsampling factor 8、16 个 latent channel：256×256×3 的 image 变成 32×32×16 的 latent，数的个数从 196,608 降到 16,384，少 12 倍，空间上每个方向小 8 倍。Denoiser 现在多用 Transformer（DiT），time step 通过每层的 scale 和 shift 注入（adaptive LayerNorm），text 用 cross-attention 或 joint attention。Slides 举的 FLUX.1 是 1024×1024 的 image、128×128×16 的 latent、2×2 的 patch；按第 6 站的切法，这是 $64\times64=4096$ 个 token，和第 6 站计算量那张表第二行的 token 数相当，attention 的 $N^2$ 在这个规模上已经不能忽略。

A3 的 notebook 也提醒了这个 dataset 的局限：它很小，模型对见过的 prompt（例如 “face with cowboy hat”）生成得好，对没见过的组合（“crying face with cowboy hat”）就生成得差，guidance 也救不了没学到的东西。

:::back
U-Net 见[第 5 站](#detect)；CLIP 的 text encoder 见[第 7 站](#ssl)。
:::

:::from
[Lecture 13 slides](https://cs231n.stanford.edu/slides/2026/lecture_13.pdf) 给了 generative model 的分类和 3,145,728 个 subpixel；[Lecture 14 slides](https://cs231n.stanford.edu/slides/2026/lecture_14.pdf) 给了 rectified flow 的 training 与 sampling、“network 学到的是平均”、logit-normal、$a(t),b(t),c(t),d(t)$ 的统一写法、$v_{\text{cfg}}$ 的形式、latent diffusion 的 8 倍与 16 个 channel、DiT 的 adaLN、FLUX.1 的尺寸（两份 slides 都只读到抽取的文字；Lecture 14 里没有 DDPM 的 $\bar\alpha_t$ 和 posterior）。DDPM 部分跟着 A3 的 `DDPM.ipynb`、`gaussian_diffusion.py`、`unet.py`：`q_sample` 的 closed form、`pred_noise` 与 `pred_x_start`、`p_losses` 的三步与 `loss_weight`、`q_posterior` 的三个 coefficient、clamp 到 $[-1,1]$、sigmoid schedule、CLIP 的 512 维 text embedding、context vector、`uncond_prob`、`cfg_forward` 注释里的 $(1+w)\varepsilon_c-w\varepsilon_\varnothing$、seen 与 unseen prompt 的例子。VAE、GAN、autoregressive 只给了到别的页面的链接。DDPM 是 VP、$\varepsilon$-prediction 这一对应、FLUX.1 的 token 数，两步合成的推导、posterior 的配方推导、linear schedule 的表、$t=500$ 的 coefficient、157 倍的放大、那张笑脸图是为这一页算的；linear schedule 的端点 0.0001 和 0.02 出自 A3 代码里的 `linear_beta_schedule`。
:::

## 作业

三个作业的 handout 和 starter code（Colab notebook 加 `.py` 文件）都公开在 cs231n.github.io 的仓库里，notebook 自带 gradient check 和与参考答案的 relative error 检查；Gradescope 的 autograder 只对 Stanford 学生开放。每个 notebook 开头写明：generative AI 和与人合作适用同样的规则，用 AI 完成作业的主要部分违反 Honor Code。自学时同样建议自己写，价值在亲手写一遍。

### Assignment 1：kNN、softmax、两层与多层 network（值得做；重点是 Q2、Q3、Q5）

**要从零写什么。** Q1：kNN 的 distance matrix，两层循环、一层循环、不用循环三种写法（不许用 `np.linalg.norm`），再用 5-fold cross-validation 选 $k$（第 1 站）。Q2：vectorized 的 softmax loss 和 gradient，用 SGD 训练并在 validation set 上调 learning rate 和 regularization（第 1 站）。Q3：affine、ReLU、softmax 几个 layer 的 forward 和 backward，拼成两层 network，用 `Solver` 训练并调参。Q4：在 color histogram 和 HOG feature 上训练 classifier，对比 raw pixel。Q5：任意深度的 fully connected network，以及 SGD+momentum、RMSProp、Adam 三个 update rule。

**做完会什么。** Vectorized 的 NumPy；手写 backward 并用 numerical gradient 核对；第 4 站调参流程里的前两步。

**时间与算力。** Handout 没有给时间；只做 Q2、Q3、Q5 估计 8 到 10 小时（调研时的估计）。全部在 Colab 的 CPU 上就能跑。Q1 和 Q4 可以跳过，代价很小（调研条目的判断）。

**提示。**

- 每个新 notebook 运行任何 cell 之前，先在 Runtime → Change runtime type 里把 Runtime version 从 Latest 改成 2025.07；已经开了 runtime 的，先 Disconnect and delete runtime 再改。（handout）
- 经常 File → Save，Colab 的 VM 离开一会儿就会断开。提交前所有 notebook 都要跑过、output 可见，再运行 `collect_submission.ipynb`。（handout）
- 不用循环的 distance matrix：$\|a-b\|^2=\|a\|^2-2a\cdot b+\|b\|^2$，中间一项是一次 matrix multiply，另外两项靠 broadcasting。（经验）
- kNN 在 5,000 张 training、500 张 test 上 $k=1$ 约 27%，cross-validation 选好 $k$ 后应超过 28%。Inline question 里那道“哪些 preprocessing 不改变 L1 nearest neighbor 的结果”，用第 1 站的 L1 定义逐个代进去验算。（notebook；后半句是经验）
- Softmax 的初始 loss 应接近 $-\log0.1$，notebook 要你解释原因（第 1 站）；用给定的 learning rate 1e−7、regularization 2.5e4，validation accuracy 应在 0.34 左右（大于 0.33）。（notebook）
- Softmax 先减每个 row 的最大值再取 exp，否则大的 score 会溢出成 `nan`。（经验）
- 每写完一个 layer 的 backward 就跑一次 gradient check：affine、ReLU、softmax 各项检查的预期在 1e−8 到 1e−12 之间，整个 network 的 parameter 在 1e−7 左右或更小。攒到整个 network 再查，很难定位是哪一层错了。（notebook；后半句是经验）
- 两层 network 用默认参数约 36%，notebook 诊断为 learning rate 太低、model 太小；要求调到 validation 超过 48%，参考实现超过 52%。Q5 要求 validation 至少 50%。（notebook）
- Q5 要先让 3 层和 5 层的 network 在 50 张 image 上 20 个 epoch 内达到 100% training accuracy，只调 learning rate 和 `weight_scale`；5 层的对 `weight_scale` 敏感得多，原因见第 4 站 initialization 一节的表。（notebook；后半句是经验）

### Assignment 2：BatchNorm、Dropout、CNN、PyTorch（先做；重点是 Q1、Q3、Q4）

**要从零写什么。** Q1：BatchNorm 的 forward、按 computational graph 一步步写的 backward 和化简过的 backward，LayerNorm 的 forward 和 backward（第 4 站）。Q2：inverted dropout。Q3：naive 的 conv forward 和 backward、max pooling、spatial BatchNorm、spatial GroupNorm，拼成一个三层 ConvNet（第 2、4 站）。Q4：用 PyTorch 的三种 API 写 network，最后自己设计一个 network，在 CIFAR-10 上 10 个 epoch 内 validation accuracy 至少 70%。Q5：vanilla RNN 做 image captioning。

**做完会什么。** 第 2 站和第 4 站的每一个公式都在自己的代码里跑过一遍；能读懂 PyTorch 的 `nn.Module`、optimizer 和 training loop。

**时间与算力。** Handout 没有给时间；估计 12 到 15 小时（调研时的估计）。Q1 到 Q3 在 CPU 上可以完成；Q4 在 Colab 的 GPU runtime 上快得多，要在 import 之前切换，因为切换会重启 kernel（notebook）。Q5 的 RNN captioning 可以跳过，A3 会用 Transformer 重做一遍（调研条目的判断）。

**提示。**

- BatchNorm 的 backward 先照 computational graph 逐个节点推一遍，再推化简版，两版结果互相对照；notebook 给的 hint 是 [Justin Johnson 的一页推导](https://cs.stanford.edu/people/jcjohns/batchnorm.pdf)，并提醒 $\gamma$ 要一起算进最终的式子。逐步推导也可以对照 [Zero to Hero 第 4 站](../courses/KARPATHY-Z2H.html#ninja)。（notebook；第一句是经验）
- BatchNorm 的 gradient check 预期 relative error 在 1e−13 到 1e−8 之间，LayerNorm 在 1e−12 到 1e−8 之间。（notebook）
- LayerNorm 不需要 running average，test time 和 training 时一样算（第 4 站）。（`layers.py` 的注释）
- `dropout_forward` 的 `p` 是保留的 probability，和 PyTorch 的 `nn.Dropout(p)` 相反；training 时除以 `p`，test time 原样输出。（`layers.py` 的 docstring；后半句是第 4 站的 inverted dropout）
- Naive conv 的 forward 与参考答案的差应在 1e−8 量级，backward 的 relative error 在 1e−8 左右或更小。先写 forward 的四重循环（filter、output 的行、列、batch），backward 照第 2 站那两个 sum 在同样的循环里累加。（notebook；后半句是经验）
- Spatial BatchNorm 先把 $N\times C\times H\times W$ 换轴成 $(N\cdot H\cdot W)\times C$，调用 fully connected 的 BN，再换回来；GroupNorm 先 reshape 成 $(N,G,(C/G)\cdot H\cdot W)$ 在最后一维上取 statistics。换轴时用 `transpose` 再 `reshape`，直接 `reshape` 会把不同位置的数混在一起。（经验）
- 新的 network 先检查初始 loss 约为 $\ln C$，再 overfit 一小份 data；三层 ConvNet 训练 1 个 epoch，training accuracy 应超过 40%。（notebook）
- Q4 的建议：conv 后面加 spatial BatchNorm（PyTorch 里叫 `BatchNorm2d`），先在几百个 iteration 内看有没有起色，再在好的范围附近细搜、训练更久。（notebook）
- 提交前每个 notebook 用 Restart and Run All 从头跑一遍，执行顺序不是从上到下时 autograder 可能出错。（handout）

### Assignment 3：Transformer 与 ViT、SimCLR、DDPM、CLIP 与 DINO（先做 Q3、Q4；Q1、Q2 值得做）

**要从零写什么。** Q1：multi-head attention、sinusoidal positional encoding、Transformer decoder layer，拼成 captioning model；再写 `PatchEmbedding` 和 encoder layer，组成 ViT，在 CIFAR-10 上 2 个 epoch 后 test accuracy 超过 0.45（第 6 站）。Q2：SimCLR 的 augmentation 和 loss（先写循环版，再写 vectorized 版），然后比较“不 pretrain、直接训练”和“SimCLR pretrain 后只训练 linear layer”的 accuracy（第 7 站）。Q3：DDPM 的 `q_sample`、`predict_start_from_noise`、U-Net 的 forward、`p_losses`、`p_sample` 和 `cfg_forward`（第 8 站）。Q4：CLIP 的 similarity、zero-shot classifier 和 image retrieval，DINO 的 attention map、patch feature 的 PCA，以及在 DINO feature 上训练 segmentation（第 7 站）。

**做完会什么。** 读懂 robotics 和 VLA 论文里常见的几种视觉 backbone 和 pretrained encoder 是怎么训练的，以及 diffusion policy 背后那套 DDPM 的代码。

**时间与算力。** Handout 没有给时间；估计 15 到 20 小时（调研时的估计）。Handout 明确要求 Q2 用 GPU runtime；SimCLR 的 pretrained weight 已经给好（notebook 说在 CIFAR-10 上训练了约 18 小时），你只需再训练约 10 分钟。DDPM 也提供了 pretrained model，可以不自己训练。免费 Colab 的 GPU 够用（调研时的估计）。官方不支持本地环境，只附了 `requirements.txt`。时间少时先做 Q3 和 Q4，对 robotics 方向最有用（调研条目的判断）。

**提示。**

- 打开 `Self_Supervised_Learning.ipynb` 后先 Runtime → Change runtime type 选 GPU，这会重置 Colab，要重新运行最上面那个 mount Drive 的 cell。（handout、notebook）
- Q1 的 multi-head attention 与参考答案的 relative error 要小于 7e−3，positional encoding 在 e−3 量级；captioning model 在小 data 上 overfit 到 loss 小于 0.05；ViT 先在一个 batch 上 overfit 到 accuracy 1.00，确认实现无误再调 learning rate 和 weight decay。（notebook）
- Q1 的 ViT 默认 learning rate 1e−4、weight decay 0、batch size 64，epoch 数固定为 2，可以改 architecture。动手前先用第 6 站的公式估一下改 patch size 或层数之后 token 数和计算量怎么变。（notebook；后半句是经验）
- Q2 的 SimCLR loss 先写 naive 版，再用第 7 站那张 $2N\times2N$ 的 similarity matrix 写 vectorized 版：mask 掉对角线，positive 在 $(i,i+N)$ 和 $(i+N,i)$。Notebook 要求两版与参考答案的 relative error 都小于 1e−7；SimCLR pretrain 后只训练 linear layer，best top-1 accuracy 应不低于 70%。（notebook；mask 的写法是经验）
- Q3 的 `cfg_forward` 用的是 $(1+w)\,\varepsilon_c-w\,\varepsilon_\varnothing$，unconditional 那一次把 `text_emb` 设为 `None`，要调用两次 `forward`。照别的代码库抄时注意 scale 差 1（第 8 站）。（`unet.py` 的注释）
- Q3 的 `p_sample` 里先把预测的 $x_0$ clamp 到 $[-1,1]$，再用 `q_posterior` 取 mean 和 std；`extract` 把每个 sample 的 coefficient reshape 成 $(b,1,1,1)$ 以便 broadcasting。`q_sample` 的测试要求 relative error 为 0，`p_sample` 和 `cfg_forward` 小于 1e−6。（`gaussian_diffusion.py` 的注释、notebook）
- Q4 的 DINO segmentation 只用一帧训练，很容易 overfit：用 linear layer 或两层 MLP，加适当的 weight decay；目标是第一帧 mean IoU 超过 0.45、最后一帧超过 0.50、整段 video 超过 0.55。换 runtime 后要重跑整个 notebook。（notebook）
- 提交前 notebook 必须已经运行、output 可见，再运行 `collect_submission.ipynb` 生成 zip 和 PDF；自学时也照做，PDF 便于以后回看。（handout；后半句是调研条目的建议）
