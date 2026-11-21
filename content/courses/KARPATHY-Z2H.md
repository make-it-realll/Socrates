---
code: KARPATHY-Z2H
evidence: syllabus
evidenceNote: "Andrej Karpathy 的 Neural Networks: Zero to Hero（课程页标注 ongoing，目前 8 讲，约 14.5 小时）。讲法跟着课程自己的材料：nn-zero-to-hero 仓库里全部 7 个 notebook（读的是 code 和保存下来的 output），ng-video-lecture 的 gpt.py、bigram.py 和它的 git log，minbpe 的 README、exercise.md、lecture.md 和源码，nanoGPT 的 README 和 config。YouTube 视频本身没有看，也没有读到逐字稿；只在视频里出现的说法按记忆写，并在每站的 :::from 里注明。页面上 MLP、activation 统计、BatchNorm 的数字是为这一页用 numpy 重跑的。这不是 NUS 课，没有 NUSMods 页面和学生评价。"
exam: "无考试；以作业为主。课程没有 autograder：作业是跟着每一讲的 notebook 从零重写一遍，外加第 5 讲的 Colab exercise 和 minbpe 的 exercise.md。nn-zero-to-hero 的 README 说每讲还有写在视频描述里的 exercise，这次没有逐一核对。"
subskills:
  - id: micrograd
    name: Autograd：从 derivative 到 micrograd
    l3: "有提示能做：在一个四五个 node 的计算图上手算每个 node 的 grad，并说出 +、*、tanh 各自把 out.grad 怎样传给 input。"
    l4: "能独立做：写出一个支持 +、*、**、tanh、exp 的 Value class 和用 topological sort 的 backward，用它训练一个 MLP，并用 centered difference 检查 gradient。"
    l5: "能讲给别人：为什么 backward 必须按 reverse topological order、为什么 grad 要用 += 累加，以及“一个 operation 只要知道自己的 local derivative”为什么足以算出任意 expression 的 gradient。"
  - id: lm
    name: Bigram 与 MLP language model
    l3: "有提示能做：从 count matrix 算出一个 name 的 average negative log likelihood，并解释 +1 smoothing 改变了什么。"
    l4: "能独立做：把 bigram 写成 one-hot 乘 W 的 network，推出它的最优解就是 count model；写出 MLP language model 的 forward，数出 parameter，并用 train、dev、test split 判断 underfitting 还是 overfitting。"
    l5: "能讲给别人：count model 为什么无法把 context 加长，embedding 让相似的 context 共享 parameter 的道理，以及 broadcasting 写错时 loss 为什么可能完全看不出来。"
  - id: stats
    name: Activation、gradient 的统计与 BatchNorm
    l3: "有提示能做：算出 27 个 class 时 initialization 的 loss 应该是多少，看 activation histogram 判断 tanh 是否 saturated。"
    l4: "能独立做：按 fan-in 和 gain 设定 initialization，实现带 running statistics 的 BatchNorm，并用 update:data ratio 判断 learning rate 是否合适。"
    l5: "能讲给别人：gain 5/3 的来历、BatchNorm 为什么让 output 和 weight 的 scale 无关，以及这个 scale invariance 为什么反过来让 effective learning rate 依赖 weight 的大小。"
  - id: ninja
    name: Tensor 层面的手写 backprop
    l3: "有提示能做：对 matmul、broadcast 加法、sum、indexing 写出 backward，并用 shape 检查结果。"
    l4: "能独立做：不用 loss.backward() 写完一个带 BatchNorm 的 2 层 MLP 的全部 backward，包括 cross-entropy 和 BatchNorm 的一次性 formula，并逐个和 autograd 比对。"
    l5: "能讲给别人：BatchNorm backward formula 的每一项从哪里来，为什么它的 gradient 与 1 和 x̂ 都 orthogonal，以及 embedding 的 backward 为什么不能写成一句 fancy-index 赋值。"
  - id: wavenet
    name: WaveNet：把 context 分层合并
    l3: "有提示能做：写出 FlattenConsecutive 每一层的 tensor shape，数出 hierarchical model 的 parameter。"
    l4: "能独立做：把 makemore 的 MLP 改成三层 hierarchical 结构，改好 BatchNorm 在 3 维 input 上的统计维度，并比较 flat 与 hierarchical 的 dev loss。"
    l5: "能讲给别人：这个 tree 和 dilated causal convolution 的关系、convolution 在这里省掉了哪些重复计算。"
  - id: gpt
    name: 从零写 GPT
    l3: "有提示能做：用 lower-triangular matrix 做 causal 的平均，写出一个 self-attention head 的每一步 shape。"
    l4: "能独立做：从 bigram baseline 出发依次加上 self-attention、multi-head、feed-forward、residual、LayerNorm、dropout，训练 character-level GPT，并数出 10,788,929 个 parameter。"
    l5: "能讲给别人：每个组件解决了上一版的哪个问题，residual 为什么让 gradient 直通，LayerNorm 和 BatchNorm 在统计维度上的差别，以及 scaling 写错成 n_embd 时 softmax 会变成什么样。"
  - id: tok
    name: GPT tokenizer
    l3: "有提示能做：在一个短 string 上手算 byte-level BPE 的 merge，并按 merge rank encode 新文本。"
    l4: "能独立做：按 minbpe 的 exercise 写出 BasicTokenizer 和 RegexTokenizer，用 GPT-4 的 split pattern 切分文本，处理 special token。"
    l5: "能讲给别人：不做 pre-tokenization 会学出什么样的 token，GPT-2 与 GPT-4 的 pattern 差在哪里，以及数字、非英语文本、结尾空格这些现象怎样追到 tokenizer。"
open:
  - label: "Andrej Karpathy：Neural Networks: Zero to Hero 课程页"
    url: "https://karpathy.ai/zero-to-hero.html"
    note: "8 讲的标题、时长、描述和前置要求。"
  - label: "karpathy/nn-zero-to-hero：micrograd 两个 notebook 与 makemore part 1 至 5 的 notebook"
    url: "https://github.com/karpathy/nn-zero-to-hero"
    note: "第 1 至 5 站的主要讲法来源。读的是 notebook 的 code 和保存的 output，没有看视频。"
  - label: "karpathy/ng-video-lecture：gpt.py、bigram.py 与 git log"
    url: "https://github.com/karpathy/ng-video-lecture"
    note: "第 6 站。每个组件带来的 val loss 取自 commit message。"
  - label: "karpathy/minbpe：README、exercise.md、lecture.md 与 base.py、basic.py"
    url: "https://github.com/karpathy/minbpe"
    note: "第 7 站。BasicTokenizer 是在本地实际跑过的。"
  - label: "karpathy/nanoGPT：README 与 config/train_shakespeare_char.py"
    url: "https://github.com/karpathy/nanoGPT"
    note: "第 6 站和作业里的算力数字。"
  - label: "Stanford CS231n 讲义：Backpropagation, Intuitions（GitHub 上课程讲义仓库的镜像）"
    url: "https://github.com/j-min/cs231n/blob/master/optimization-2.md"
    note: "第 1、4 站：gate 的 local gradient、fork 处 gradient 相加、用 shape 推 matmul 的 backward。读的是镜像里的 markdown 原文，不是课程网站。"
  - label: "Stanford CS231n 讲义：Neural Networks Part 2（镜像）"
    url: "https://github.com/Alireza-Akhavan/cs231n.github.io/blob/master/neural-networks-2.md"
    note: "第 3 站：1/√n 的推导和 BatchNorm 与 initialization 的关系。"
  - label: "Stanford CS231n 讲义：Neural Networks Part 3（镜像）"
    url: "https://github.com/j-min/cs231n/blob/master/neural-networks-3.md"
    note: "第 1 站的 gradient check 标准，第 3 站的 initial loss 检查和 update:weight ratio 约 1e-3。"
  - label: "Cornell CS4787 Lecture 4：Backpropagation（Chris De Sa）"
    url: "https://www.cs.cornell.edu/courses/cs4787/2023fa/lectures/lecture4.html"
    note: "第 1 站：reverse mode 的代价、一个变量被多次使用时 gradient 的累加。"
  - label: "Bengio et al. 2003，A Neural Probabilistic Language Model（JMLR）"
    url: "https://www.cs.columbia.edu/%7Eblei/seminar/2016_discrete_data/readings/BengioDucharmeVincentJanvin2003.pdf"
    note: "第 2 站的 MLP language model 和 curse of dimensionality 的数字。"
  - label: "Ioffe 与 Szegedy 2015，Batch Normalization（ar5iv）"
    url: "https://ar5iv.labs.arxiv.org/html/1502.03167"
    note: "第 3、4 站：Algorithm 1 与 backward 的 chain rule。只读到 Section 3 前半，inference 的 Algorithm 2 没有读到。"
  - label: "van den Oord et al. 2016，WaveNet（ar5iv）"
    url: "https://ar5iv.labs.arxiv.org/html/1609.03499"
    note: "第 5 站：dilated causal convolution 与 receptive field。只读了 Section 2。"
sources:
  - label: "nn-zero-to-hero README（每讲的简介与 exercise 的说明）"
    url: "https://github.com/karpathy/nn-zero-to-hero"
---

先看三件事。三次程序都没有报错。

**第一件。** 一个 MLP 要从 27 个 character 里预测下一个。什么都没学的时候，最合理的猜法是 27 个 character 各给 $1/27$，loss 是 $-\ln(1/27)=3.2958$。按 makemore 第 2 讲的写法初始化，第一个 batch 的 loss 是 22.9。

**第二件。** 一个 bigram model 把 count matrix 每行除以行和得到 probability。把 `sum(1, keepdim=True)` 少写了 `keepdim`，matrix 变成每一列除以某个数，每一行加起来是 6.92，已经不是 probability distribution。可是它在 training set 上的 average negative log likelihood 和正确版本一模一样，都是 2.454577。

**第三件。** 在 Taylor Swift 的 Wikipedia 页面上训练一个 512 个 token 的 BPE tokenizer，它学到的第 337 号 token 是 `". Archived from the original on "`，一整句引用格式被当成了一个“词”。

三件事都没有让程序出错，只是结果不对。这门课从零开始，亲手写出 neural network 训练的每一层：自动求 gradient 的 engine、language model、诊断训练是否健康的统计量、tensor 层面的 backward、更深的结构、GPT，最后是 tokenizer。每一层都写到能自己检查对错的程度，上面这类错误才看得出来。

| 站 | 内容 | 对应 lecture | 对应 notebook / 仓库 |
|---|---|---|---|
| 1 | Autograd 与 micrograd | 1 | micrograd |
| 2 | Bigram 与 MLP language model | 2、3 | makemore part 1、2 |
| 3 | Activation、gradient 的统计与 BatchNorm | 4 | makemore part 3 |
| 4 | Tensor 层面的手写 backprop | 5 | makemore part 4 |
| 5 | WaveNet | 6 | makemore part 5 |
| 6 | 从零写 GPT | 7 | ng-video-lecture、nanoGPT |
| 7 | GPT tokenizer | 8 | minbpe |

已有页面讲过的部分这里只给链接：chain rule 在一个 2-2-1 network 上的逐个 weight 推导在 [CS2109S 第 8 站](../courses/CS2109S.html#nn)；matrix 形式的 backward、softmax 加 cross-entropy 的 gradient 是 $p-y$、ReLU 的 $2/n$ initialization 在 [CS3244 第 6 站](../courses/CS3244.html#nn)；perplexity 和 n-gram 的 smoothing 在 [CS4248 第 2 站](../courses/CS4248.html#ngram)；attention 的 formula、$\sqrt{d_k}$ 的来历、Transformer block 的 parameter 数在 [CS4248 第 6 站](../courses/CS4248.html#attn)；BPE training 的增量实现和 tie-breaking 在 [CS336 第 1 站](../courses/STANFORD-CS336.html#bpe)。这一页的篇幅留给这门课自己的东西：从零写出来的每一行 code 在做什么，以及怎样知道它写对了。

只有十几个小时时的路线：第 6、7 站必读，第 3 站必读；backprop 还不熟练时加上第 1 站。第 2 站的 bigram 部分和第 5 站可以先跳，每站开头写了跳过的代价。

## [micrograd] Autograd：从 derivative 到 micrograd

:::skip
快速路线里只在 backprop 不熟练时读。能在一个计算图上手算每个 node 的 grad，说出 backward 为什么要按 reverse topological order、为什么用 `+=`，就可以去第 2 站。
:::

### Derivative 先当作一次实验

$f(x)=3x^2-4x+5$。在 $x=3$ 处把 input 挪一点点 $h=0.001$，看 output 变了多少倍：

$$\frac{f(3.001)-f(3)}{0.001}=\frac{20.014003-20}{0.001}=14.003$$

$f'(x)=6x-4$ 在 $x=3$ 是 14，实验和 formula 对得上。Notebook 接着在 $x=2/3$ 做同样的事，得到 $3.0\times10^{-6}$，那里 $f'=0$。

再看三个 input 的 expression $d=ab+c$，取 $a=2$、$b=-3$、$c=10$，$d=4$。一次只挪一个 input：

| 挪动的 input | 新的 $d$ | 斜率 | 解释 |
|---|---|---|---|
| $c\to c+h$ | $4+h$ | 1 | 加法对每个 input 的 local derivative 是 1 |
| $a\to a+h$ | $4-3h$ | $-3=b$ | 乘法对 $a$ 的 local derivative 是另一个因子 $b$ |
| $b\to b+h$ | $4+2h$ | $2=a$ | 对 $b$ 的是 $a$ |

这两条就是后面全部 backward 的原料。用这种实验去求 gradient 有一个代价：有 $P$ 个 parameter，就要多做 $P$ 次 forward。GPT-2 有上亿个 parameter，每走一步都要做上亿次 forward，这条路走不通。[CS2109S 第 8 站](../courses/CS2109S.html#nn)具体数过两种做法的运算次数；Cornell CS4787 的讲义把 reverse mode 的结论说成：对一个 scalar loss，所有 parameter 的 gradient 只比一次 forward 多一个常数倍的代价。

### 把每一步运算记下来

要从 output 往回算，先得知道 output 是怎么来的。micrograd 的 `Value` 在每次运算时存下四样东西：结果 `data`、留给 backward 的 `grad`（初始为 0）、是哪几个 `Value` 算出来的（`_prev`）、用的是什么运算（`_op`）。

```python
a = Value(2.0); b = Value(-3.0); c = Value(10.0); f = Value(-2.0)
e = a*b        # -6.0
d = e + c      #  4.0
L = d * f      # -8.0
```

现在手算 $L$ 对每个量的 derivative，从后往前，每一步只用上一小节的两条规则。

- $L=d\cdot f$：$\dfrac{\partial L}{\partial d}=f=-2$，$\dfrac{\partial L}{\partial f}=d=4$。
- $d=e+c$：加法把 $\partial L/\partial d$ 原样交给两个 input，$\dfrac{\partial L}{\partial e}=\dfrac{\partial L}{\partial c}=-2$。
- $e=a\cdot b$：$\dfrac{\partial L}{\partial a}=\dfrac{\partial L}{\partial e}\cdot b=(-2)(-3)=6$，$\dfrac{\partial L}{\partial b}=\dfrac{\partial L}{\partial e}\cdot a=(-2)(2)=-4$。

第三步用的是 chain rule：$a$ 只通过 $e$ 影响 $L$，所以 $\partial L/\partial a$ 等于“$L$ 对 $e$ 的敏感度”乘“$e$ 对 $a$ 的敏感度”。Notebook 用实验核对 $\partial L/\partial b$：把 $b$ 挪 0.001，斜率是 $-3.9999999999995595$。

有了 gradient，就知道每个 input 往哪边挪会让 $L$ 变大。每个 input 沿 gradient 走 0.01：$a=2.06$，$b=-3.04$，$c=9.98$，$f=-1.96$。重算一遍：$e=-6.2624$，$d=3.7176$，$L=3.7176\times(-1.96)=-7.286496$，比 $-8$ 大了。这就是 gradient ascent 的一步；训练时要让 loss 变小，就往反方向走。

### 每个运算只负责自己的 local derivative

上面三步有一个共同的形状：一个运算 `out = op(x, y)` 在 backward 时拿到 `out.grad`（$L$ 对 out 的 derivative，后面已经算好），乘上自己的 local derivative，交给每个 input。它不需要知道整个 expression 长什么样。micrograd 于是让每个运算在 forward 时顺手留下一个 closure：

```python
def __mul__(self, other):
    out = Value(self.data * other.data, (self, other), '*')
    def _backward():
        self.grad  += other.data * out.grad
        other.grad += self.data  * out.grad
    out._backward = _backward
    return out
```

加法的 `_backward` 把 `out.grad` 原样加给两个 input；`tanh` 的 local derivative 是 $1-\tanh^2(x)=1-t^2$，所以 `self.grad += (1 - t**2) * out.grad`。

Notebook 用一个 neuron 演示：$o=\tanh(x_1w_1+x_2w_2+b)$，$x_1=2$、$x_2=0$、$w_1=-3$、$w_2=1$。Bias 取了一个奇怪的数 $b=6.8813735870195432$，原因是 $x_1w_1+x_2w_2=-6$，于是 $n=0.8813735870\ldots=\operatorname{artanh}(1/\sqrt2)$，$o=1/\sqrt2=0.7071$，$1-o^2=0.5$，后面的数都很整齐。

::fig[z2h-graph] 一个 neuron 的计算图。先停在完整结果上，然后清空所有 grad，从 o 开始每一步用一条 local rule 往回填。

一步步看图里发生了什么：

1. $o$ 对自己的 derivative 是 1。
2. tanh：$\partial L/\partial n=(1-o^2)\cdot1=0.5$。
3. $n=s+b$ 是加法，$s$ 和 $b$ 都拿到 0.5。
4. $s=x_1w_1+x_2w_2$ 也是加法，两个乘积都拿到 0.5。
5. $x_1w_1$ 是乘法：$x_1$ 拿到 $w_1\times0.5=-1.5$，$w_1$ 拿到 $x_1\times0.5=1$。
6. $x_2w_2$：$x_2$ 拿到 $w_2\times0.5=0.5$，$w_2$ 拿到 $x_2\times0.5=0$。

$w_2$ 的 gradient 是 0，因为它乘的 input $x_2$ 是 0：不管 $w_2$ 怎么变，这个 neuron 的 output 都不变。Notebook 把同一个 neuron 用 PyTorch 写一遍，`backward()` 给出 $x_1$：$-1.5000004$，$w_1$：$1.0000003$，$x_2$：$0.5000001$，$w_2$：0。尾数上的差别来自 PyTorch 那边把 $b$ 先存成 float32 的 `torch.Tensor([...])` 再转成 double。

一个运算可以拆得多细，是可以选的。Notebook 的后半把 tanh 换成 $\dfrac{e^{2n}-1}{e^{2n}+1}$，为此给 `Value` 加上 `exp`、`**`、除法和减法，每个都只写自己的 local derivative；拆开之后 backward 出来的 gradient 与整块的 tanh 完全相同。只要能写出 local derivative，任何 function 都可以当成一个运算，粒度只影响效率。

### 顺序：topological sort

`_backward` 之间有先后。一个 node 调用自己的 `_backward` 时，要用到 `out.grad`，这个值必须已经收齐了所有下游的贡献。所以要在每个 node 之前，先处理完所有用到它的 node。

micrograd 用 depth-first search 排出这个顺序：

```python
topo, visited = [], set()
def build_topo(v):
    if v not in visited:
        visited.add(v)
        for child in v._prev:
            build_topo(child)
        topo.append(v)        # 所有 input 都进了 list 之后，才放自己
build_topo(self)
self.grad = 1.0
for node in reversed(topo):
    node._backward()
```

`topo.append(v)` 放在递归之后，保证 list 里每个 node 都排在它的 input 后面，这叫 topological order。反过来走，每个 node 都排在所有用到它的 node 后面，正好是 backward 需要的顺序。对上面的 neuron，notebook 打出的 `topo` 是 $b,\ x_1,\ w_1,\ x_1w_1,\ x_2,\ w_2,\ x_2w_2,\ s,\ n,\ o$；倒过来从 $o$ 开始，和图里的六步一致（同一层里谁先谁后不影响结果）。

### 同一个 Value 用了两次

`b = a + a`，$a=3$。$b=2a$，正确的 $db/da=2$。

::fig[z2h-fork] 左边的 backward 用赋值，右边用累加。加法的 `_backward` 里 `self` 和 `other` 是同一个对象，第二句赋值把第一句的结果盖掉了。

一般地，一个量被 $k$ 个地方用到，它影响 $L$ 的路就有 $k$ 条，multivariable chain rule 说 derivative 是各条路的贡献之和。Notebook 的第二个例子：$a=-2$、$b=3$，$d=ab=-6$，$e=a+b=1$，$f=de=-6$。

$$\frac{\partial f}{\partial a}=\underbrace{e\cdot b}_{\text{经过 }d}+\underbrace{d\cdot1}_{\text{经过 }e}=1\times3+(-6)\times1=-3,\qquad\frac{\partial f}{\partial b}=e\cdot a+d\cdot1=-2-6=-8$$

直接展开核对：$f=(ab)(a+b)=a^2b+ab^2$，$\partial f/\partial a=2ab+b^2=-12+9=-3$，$\partial f/\partial b=a^2+2ab=4-12=-8$。CS231n 的讲义把这条叫作“gradients add up at forks”，CS4787 的例子是 $y=x(x+1)$，$x=17$：直接那条路贡献 18，经过 $x+1$ 那条路贡献 17，合计 35。

:::wrong 每个 Value 只被一个运算用到，backward 里用 = 赋值就够了
只要 expression 里有一个量出现两次，赋值就错。`a + a` 给出 1 而不是 2；上面的 $f=(ab)(a+b)$ 用赋值，$\partial f/\partial a$ 只剩一条路的贡献，得到 3 或 $-6$，看 $d$ 和 $e$ 的 `_backward` 谁后执行。这个错并不罕见：micrograd lecture 第二个 notebook 的 `exp` 里留着一行注释，说视频里写成了 `=`，后来改成了 `+=`。用 `+=` 也带来一个义务：每次 backward 之前要把 grad 清零，见下一小节。
:::

### 在 Value 上搭 MLP，训练一次

`Neuron(nin)` 有 `nin` 个 weight 和一个 bias，output 是 $\tanh(\sum_iw_ix_i+b)$；`Layer` 是几个并排的 neuron；`MLP(3, [4, 4, 1])` 是三层。Parameter 个数是 $4\times(3+1)+4\times(4+1)+1\times(4+1)=16+20+5=41$。

Notebook 的数据只有 4 个 example，target 是 $1,-1,-1,1$，loss 是四个 squared error 之和。Training loop 有三步，顺序不能乱：

```python
for k in range(20):
    ypred = [n(x) for x in xs]
    loss = sum((yout - ygt)**2 for ygt, yout in zip(ys, ypred))
    for p in n.parameters():
        p.grad = 0.0              # 清零：上一步的 grad 还留着
    loss.backward()
    for p in n.parameters():
        p.data += -0.1 * p.grad   # 往 gradient 的反方向走
```

:::wrong Loss 降得很好，training loop 就没有 bug
把清零那两行删掉，再跑一遍。为这一页实际跑的结果（同一个 random seed，learning rate 0.05）：

| step | 0 | 2 | 5 | 10 | 20 |
|---|---|---|---|---|---|
| 有清零 | 6.2443 | 3.3275 | 0.8482 | 0.1612 | 0.0562 |
| 没有清零 | 6.2443 | 3.1352 | 0.3035 | 0.0072 | 0.0012 |

没有清零的版本降得更快。可它已经不是 gradient descent 了：第 $k$ 步用的 grad 是前 $k$ 步所有 gradient 的和，相当于一个永远不衰减的 momentum。这个 4 个 example 的问题太简单，怎么走都能走到底，所以看不出问题；loss 曲线本身不能证明 backward 写对了。
:::

### 怎么知道 backward 写对了

办法是拿第一小节的实验去对照，但要做得仔细。CS231n 的讲义给了三条：用 centered difference $\dfrac{f(x+h)-f(x-h)}{2h}$，它的 error 是 $O(h^2)$，单边的是 $O(h)$；比较 relative error $\dfrac{|f'_a-f'_n|}{\max(|f'_a|,|f'_n|)}$，对 tanh、softmax 这种光滑的 function，$10^{-7}$ 以下才算好，$10^{-2}$ 以上几乎一定是 bug；用 double precision。

拿上面的 neuron 对 $w_1$ 检查，$\partial o/\partial w_1=1$。$h=10^{-5}$ 时：

$$\text{centered: }1.0000000000787,\quad\text{relative error }7.9\times10^{-11};\qquad\text{单边: }0.9999858579,\quad\text{relative error }1.4\times10^{-5}$$

单边的那个落在“需要怀疑”的区间里，centered 的几乎完全一致。$h$ 也不是越小越好：$h=10^{-11}$ 时 centered difference 给出 $0.9999945$，numerator 是两个几乎相等的数相减，[DSA2102 第 1 站](../courses/DSA2102.html#fp)讲过这种 cancellation 怎样把 rounding error 放大。

:::from
Derivative 的两个实验、$L=d\cdot f$ 的例子和它的数字、neuron 的数字与 $b$ 的取法、PyTorch 的对照、`a + a` 和 $f=(ab)(a+b)$ 的例子、`exp` 里关于 `=` 的注释、41 个 parameter 的 MLP 和 4 个 example，全部来自 nn-zero-to-hero 的两个 micrograd notebook（读的是 code 和 output）。“gate 只需要 local gradient”“gradients add up at forks”和 gradient check 的三条标准来自 CS231n 讲义 Backpropagation, Intuitions 与 Neural Networks Part 3（GitHub 镜像）；reverse mode 的代价和 $x=17$ 的例子来自 Cornell CS4787 Lecture 4。去掉清零的对比实验和 gradient check 的数字是为这一页实际跑的。PyTorch 那边尾数差别的原因是按 notebook 的 code 推断的。
:::

## [lm] Bigram 与 MLP language model

:::skip
快速路线里可以跳过 bigram 部分（前三个小节），代价是第 6 站的 bigram baseline 要自己补；但“MLP：让相似的 context 共享 parameter”和后面的 split 一节建议读，第 3、4 站一直用这个 MLP。能说出 count model 的最优解为什么就是 neural network 版 bigram 的最优解，能写出 MLP 每一步的 shape，就可以去第 3 站。
:::

### 问题：给一个 name 的开头，下一个 character 是什么

makemore 的数据是 `names.txt`：32,033 个英文名字，最短 2 个字母，最长 15 个。在每个名字前后各加一个特殊 character `.`，表示开始和结束，`emma` 就给出 5 对相邻 character：`.e`、`em`、`mm`、`ma`、`a.`。全部名字一共 228,146 对，叫 bigram。

最简单的 model：只看当前一个 character，猜下一个。把 27 个 character（26 个字母加 `.`）的每一对出现了几次数出来，放进一个 $27\times27$ 的 count matrix $N$。

::fig[z2h-counts] Count matrix 的 5 行 6 列。`.` 那一行的 row sum 是 32,033，恰好是名字的个数，因为每个名字恰好有一个开头。

把每一行除以它的 row sum，就得到 $P(\text{下一个}\mid\text{当前})$。例如名字以 `a` 开头的 probability 是 $4410/32033=0.1377$。Sampling 时从 `.` 开始，按这一行的 distribution 抽一个 character，再按那个 character 的行抽下一个，直到抽到 `.`。Notebook 抽出的前几个是 `mor.`、`axx.`、`minaymoryles.`，看得出 bigram 只知道哪两个字母常挨着。

### 一个数衡量 model 有多好

Model 给 training set 的 probability 越大越好。一个名字的 probability 是它每个 bigram 的 probability 相乘，整个 training set 的 probability 是所有 228,146 个 bigram 的 probability 相乘。这个乘积小到存不下，取 log 变成相加；习惯上要“越小越好”，再取负号；最后除以 bigram 的个数，得到 average negative log likelihood：

$$\text{NLL}=-\frac1n\sum_{i=1}^n\ln P(c_{i+1}\mid c_i)$$

用 `emma` 算一遍（$P$ 用下一段的 +1 smoothing 版本）：

| bigram | `.e` | `em` | `mm` | `ma` | `a.` |
|---|---|---|---|---|---|
| $P$ | 0.0478 | 0.0377 | 0.0253 | 0.3885 | 0.1958 |
| $-\ln P$ | 3.041 | 3.279 | 3.675 | 0.945 | 1.631 |

平均是 $12.572/5=2.514$。整个 training set 的 NLL 是 2.4546。作为对照，27 个 character 各给 $1/27$ 的 model 是 $\ln27=3.2958$。[CS4248 第 2 站](../courses/CS4248.html#ngram)把 NLL 取 exp 解释成 perplexity：$e^{2.4546}=11.6$，bigram 平均每一步相当于在 11.6 个 character 里等可能地猜。

Count matrix 里有 102 个 0。Notebook 拿 `andrejq` 试：`jq` 一次也没出现过，$P=0$，$-\ln0=\infty$，一个名字就让整个 loss 变成无穷大。Notebook 的处理是所有 count 先加 1 再 normalize，`jq` 的 probability 变成 $1/(2900+27)=1/2927$（`j` 这一行原来的 row sum 是 2900，每格加 1 共加 27），$-\ln P=7.98$。这叫 Laplace smoothing，它的代价在 [CS4248](../courses/CS4248.html#ngram) 里算过；这里 training set 上的 NLL 只从 2.4540 变成 2.4546。

:::wrong Loss 和预期一样，probability matrix 就算对了
把 `P = N / N.sum(1, keepdim=True)` 写成 `P = N / N.sum(1)`。`N.sum(1)` 的 shape 是 `(27,)`，broadcasting 规则从右边对齐，把它当成 `(1, 27)`，于是第 $j$ 列被除以第 $j$ 行的 row sum。程序照样运行，每行加起来却是 6.92（`.` 那一行）之类的数。

在 training set 上，它的 NLL 和正确版本完全相同，都是 2.454577。这不是巧合。正确版本里每个 bigram $(c_i,c_{i+1})$ 被除以 $S(c_i)$，错误版本被除以 $S(c_{i+1})$，$S$ 是 row sum。对一个名字 $c_1\cdots c_m$，所有 bigram 的第一个 character 是 $\{.,c_1,\dots,c_m\}$，第二个 character 是 $\{c_1,\dots,c_m,.\}$，两个 multiset 完全一样，所以 $\sum\ln S(\text{第一个})=\sum\ln S(\text{第二个})$。training set 上的 loss 天生看不出这个 bug。Sampling 时 `torch.multinomial` 会自动把一行重新 normalize，同样不报错，只是抽出来的 distribution 错了。要查出它，只能直接检查 `P.sum(1)` 是不是全为 1，或者检查 shape。
:::

### 同一个 model 写成 neural network

Count 的办法没法推广到更长的 context，下一小节会算出原因。先把同一个 bigram model 改写成一个可以用 gradient descent 训练的 network，作为后面所有 model 的模板。

Input 是当前 character 的 index，先变成 one-hot vector：长度 27，只有对应位置是 1。乘一个 $27\times27$ 的 weight matrix $W$，得到 27 个数，叫 logits。One-hot 乘 matrix 只是把 $W$ 的一行取出来：

::fig[z2h-onehot] `e` 的 index 是 5，one-hot 乘 $W$ 的结果就是 $W$ 的 row 5。

Logits 可以是任何实数，要变成 probability，先取 exp（全变成正数，扮演 count 的角色），再除以总和。这两步合起来叫 softmax。所以 $W$ 的一行就是“log count”，$W_{ij}=\ln N_{ij}$ 时 network 和 count model 一模一样。

Loss 还是 NLL。[CS3244 第 6 站](../courses/CS3244.html#nn)推过 softmax 加 cross-entropy 对 logits 的 gradient 是 $p-y$（$y$ 是正确答案的 one-hot）。这里每个 example 的 loss 带着 $1/n$，所有 input 是 character $i$ 的 example 都落在 $W$ 的第 $i$ 行，把它们的 gradient 加起来：

$$\frac{\partial\,\text{NLL}}{\partial W_{ij}}=\frac1n\sum_{x=i}\big(p_{ij}-[y=j]\big)=\frac{n_i\,p_{ij}-N_{ij}}{n}$$

$n_i$ 是第 $i$ 行的 row sum。令它为 0，得到 $p_{ij}=N_{ij}/n_i$：gradient descent 的终点恰好就是 count model。在 $W=0$ 处检验一次：所有 $p=1/27$，`(., a)` 这一格的 gradient 是 $(32033/27-4410)/228146=-0.0141$，negative，所以 gradient descent 会把 $W_{\cdot,a}$ 调大，因为 `a` 开头比平均更常见。

为这一页从 random 的 $W$ 出发、用 learning rate 50 做 full-batch gradient descent：loss 在第 0、10、100、500 步是 3.708、2.668、2.473、2.457，逼近 count model 的 2.4540，不会更低。Notebook 在 loss 里加了 $0.01\cdot\text{mean}(W^2)$，它把 $W$ 往 0 拉，$W=0$ 正是 uniform distribution，作用和 +1 smoothing 一样：系数越大，越接近 uniform。

### Count 为什么走不远

Context 加到 3 个 character，count matrix 就有 $27^3=19683$ 行。这份数据里实际出现过的 3 character context 只有 5,686 种，其中 1,132 种只出现过一次：一行只有一个 count，凭它去估计 27 个 probability 毫无意义。Context 每加一个 character，行数乘 27，数据却不会变多。

Bengio 等人 2003 年的论文把这叫作 curse of dimensionality，他们的数字是：vocabulary 100,000 个 word，10 个连续 word 的 joint distribution 有 $100000^{10}-1=10^{50}-1$ 个 free parameter。他们的办法是让每个 word 对应一个学出来的 feature vector，probability 是这些 vector 的光滑 function。论文的例子是：见过 “The cat is walking in the bedroom”，因为 cat 和 dog 的 vector 相近，“A dog was running in a room” 的 probability 也会跟着变大。Count model 里 cat 和 dog 是两个毫无关系的 index。

### MLP：让相似的 context 共享 parameter

makemore 第 2 讲照着这篇论文实现了一个 character 版本，context 是 3 个 character。

::fig[z2h-mlp] Context `emm` 预测下一个 character。三个位置共用同一张 embedding table $C$，所以 parameter 不随 context 长度乘 27 倍地增长。

逐层写出 shape，batch 里有 32 个 example：

- `C`：$27\times10$，每个 character 一个 10 维的 vector。`emb = C[X]`，`X` 是 $(32,3)$ 的 index，结果是 $(32,3,10)$。
- `emb.view(32, 30)`：把三个 vector 首尾相接。`view` 不复制数据，只改变读 memory 的方式，所以比 `torch.cat` 便宜。
- `h = torch.tanh(emb.view(32, 30) @ W1 + b1)`：$W_1$ 是 $30\times200$，`h` 是 $(32,200)$。
- `logits = h @ W2 + b2`：$W_2$ 是 $200\times27$，logits 是 $(32,27)$。
- `loss = F.cross_entropy(logits, Y)`：等于 softmax 之后取正确答案的 $-\ln p$ 再平均，但不生成中间的 probability tensor，并且先减去每行最大值，避免 `exp` overflow（[CS336 第 4 站](../courses/STANFORD-CS336.html#train)讲过为什么）。

Parameter 个数：$27\times10+30\times200+200+200\times27+27=270+6000+200+5400+27=11{,}897$，和 notebook 打印的一致。论文的 model 是 $y=b+Wx+U\tanh(d+Hx)$，多了一项从 embedding 直接连到 output 的 $Wx$；makemore 没有用这一项。

Context 里 `m` 出现了两次，它们取的是 $C$ 的同一行。Backward 时这一行会从两个位置各收到一份 gradient，按第 1 站的规则相加。

### Learning rate、minibatch 与三个 split

每一步用全部 182,625 个训练 example 算 gradient 太慢。每次随机取 32 个，算出的 gradient 是全量 gradient 的一个有噪声的估计，方向大致对，代价小几千倍。走更多、更粗糙的步，通常比走更少、更精确的步划算。

Learning rate 的选法：notebook 里留着 `lre = torch.linspace(-3, 0, 1000)`、`lrs = 10**lre` 两行，做法是让第 $i$ 步用 `lrs[i]`，从 0.001 一路升到 1，记下每一步的 loss，画 loss 对 exponent 的图，选 loss 下降最快、还没开始乱跳的那一段。最后的 schedule 是前 100,000 步用 0.1、后 100,000 步用 0.01。

Data 按 80%、10%、10% 分成 train、dev、test：182,625、22,655、22,866 个 example。Train 用来更新 parameter；dev 用来选 hyperparameter（embedding 维数、hidden 大小、learning rate）；test 只在最后看一次，否则它也变成了被调过的东西。200,000 步之后 notebook 的结果是 train 2.1260、dev 2.1701，比 bigram 的 2.45 好得多。Sample 出来的是 `carmahela`、`jhovi`、`kimrin`、`quinton`，已经像名字了。

:::wrong Dev loss 比 train loss 高，说明 overfitting，该加 regularization
2.1260 和 2.1701 只差 0.044。Overfitting 指 model 记住了 training set 里的偶然细节，那时 train loss 会继续下降而 dev loss 停住甚至上升，两者的差距越拉越大。差距这么小，说明 model 连 training set 都还没拟合好，问题在 capacity 不够：hidden layer 加宽、embedding 加到更多维、context 加长，train 和 dev 都会一起降。第 5 站把 context 加到 8、parameter 加到 76,579 之后，差距才扩大到 0.22，那时才轮到考虑 regularization。
:::

:::from
`names.txt`、count matrix、sampling、NLL 的推导顺序、`andrejq` 的例子、+1 smoothing、one-hot 乘 $W$、`0.01*(W**2).mean()`、MLP 的结构与 shape、`view` 和 `cat` 的对比、learning rate 的扫法、split 的比例、train 2.1260 与 dev 2.1701 都来自 makemore part 1、part 2 的 notebook。Notebook 里保存的整个 training set NLL 输出是 2.4765，按 notebook 的 code 重算是 2.4546，这里用重算的数；保存的 output 可能来自 kernel 里某个中间状态的 $P$。Broadcasting bug 是视频里讲过的例子（凭记忆），“两种写法 loss 相同”的证明、`emma` 那一行、gradient 的推导、gradient descent 的数、3 character context 的统计是为这一页写的或算的。Curse of dimensionality 的数字和 cat、dog 的例子来自 Bengio 等人 2003 年的论文。
:::

## [stats] Activation、gradient 的统计与 BatchNorm

:::skip
快速路线必读。能算出 initialization 时 loss 应该是多少，看 activation 的 histogram 判断 tanh 是否 saturated，说出 gain 5/3 和 BatchNorm 各解决了什么，就可以去第 4 站。
:::

### 第一个数就不对：initialization 时的 loss

开头那个 22.9 就出在第 2 站的 MLP 上。还没有学到任何东西时，model 对 27 个 character 应该没有偏好，loss 应该是 $\ln27=3.2958$。CS231n 讲义把这当作训练前的第一项检查：10 个 class 的 softmax，initialization 时的 loss 应该是 $\ln10=2.302$，不是就先查 initialization。

22.9 从哪里来？`W2` 是 standard normal，`h` 的 200 个 entry 大多贴近 $\pm1$。每个 logit 是 200 项 $h_kW_{2,kj}$ 之和加一个 bias，variance 是 $200\,\mathbb E[h^2]+1$。这次 initialization 时测得 $\mathbb E[h^2]=0.80$，所以 logit 的 standard deviation 约是 $\sqrt{200\times0.80+1}=12.7$。27 个 logit 拉得这么开，softmax 几乎把全部 probability 给了最大的那个，而它多半不是正确答案。按 12.7 的 std 随机生成 logit 再算 loss，expectation 是 25.5，和实测的 22.9 是同一回事。Model 一开始就“很有把握地错着”，前几千步都花在把 logit 压回来上。

修法是让 logit 一开始就接近 0：`W2 *= 0.01`，`b2 *= 0`。为这一页用 numpy 重跑的结果，initialization 时的 loss 变成 3.283；训练完 train 2.069、dev 2.131，原来是 2.132、2.171。Notebook 的 loss log 记的是 2.07、2.13 和 2.1245、2.1682，趋势相同。

`W2` 不能直接取 0：取 0 时 `h` 的 gradient $dh=dlogits\,W_2^\top$ 全是 0，第一层一步也学不到（第 1 站的 neuron 里 $w_2$ 的 gradient 是 0，是同一个道理的另一面）。取很小的随机数，logit 接近 0，gradient 又能流下去。

### tanh 饱和：gradient 在哪里消失

Loss 修好了，hidden layer 还有问题。`h = tanh(hpreact)`，`hpreact = emb @ W1 + b1`，30 个 input 各乘一个 standard normal 的 weight 再加一个 standard normal 的 bias，variance 约是 $30+1$，std 约 $\sqrt{31}=5.6$（实测 4.67，因为 embedding 的 30 个 entry 并不独立）。这么宽的 input 进了 tanh，大部分落在两端的平台上。

tanh 的 local derivative 是 $1-t^2$。$|t|>0.97$ 时它小于 $1-0.97^2=0.059$，从后面传来的 gradient 经过这里被乘上一个不到 0.06 的数。$|t|$ 接近 1 时这个 factor 接近 0，这个 unit 前面的 weight 几乎学不到东西。如果一个 unit 对所有 example 都 saturated，它就永远学不到了，叫 dead neuron。

::fig[z2h-sat] 同一个 MLP，左右只差 $W_1$ 和 $b_1$ 的 scale。每一帧是训练到某一步时，dev set 前 1000 个 example 上 200 个 hidden unit 的 output 的 histogram。

左边一开始 64% 的 entry 在 $\pm0.97$ 以外，训练过程中这个比例不降反升，到最后是 87%。这次重跑里没有出现对 1000 个 example 全部 saturated 的 unit，但每个 unit 在大多数 example 上都只能传回很小的 gradient。右边把 `hpreact` 的 std 压到约 1.4，saturated 比例从 12% 开始，训练中逐渐升到 31%，分布一直铺在整个 $(-1,1)$ 上。结果：train 2.038、dev 2.102，又好了一截（notebook 是 2.0356、2.1027）。

### 为什么是 $(5/3)/\sqrt{\text{fan-in}}$

上面右边用的 scale 不是随手试出来的。先只看 linear 的部分：$s=\sum_{i=1}^nw_ix_i$，$w_i$ 和 $x_i$ 互相独立、mean 都是 0。CS231n 讲义的推导：

$$\mathrm{Var}(s)=\sum_{i=1}^n\mathrm{Var}(w_ix_i)=\sum_{i=1}^n\mathrm{Var}(w_i)\,\mathrm{Var}(x_i)=n\,\mathrm{Var}(w)\,\mathrm{Var}(x)$$

第二个等号用了 mean 为 0：一般地 $\mathrm{Var}(wx)=\mathbb E[w]^2\mathrm{Var}(x)+\mathbb E[x]^2\mathrm{Var}(w)+\mathrm{Var}(w)\mathrm{Var}(x)$，前两项是 0。要让 $\mathrm{Var}(s)=\mathrm{Var}(x)$，就要 $\mathrm{Var}(w)=1/n$，也就是 standard normal 乘 $1/\sqrt n$。为这一页叠 5 个这样的 linear layer（没有 nonlinearity），output 的 std 依次是 1.005、1.02、1.002、1.046、1.088，一直守在 1 附近；不除以 $\sqrt n$ 的话，一个 $1000\times1000$ 的 matrix 乘一个 standard normal vector，std 就变成 31。

tanh 会把分布往里收：input 的 std 是 1 时，output 的 std 明显小于 1。一层层叠下去，每层都缩一点。补偿的办法是给 weight 再乘一个 gain，PyTorch 给 tanh 定的 gain 是 $5/3$。ReLU 把一半的 input 变成 0，补偿的 gain 是 $\sqrt2$，[CS3244 第 6 站](../courses/CS3244.html#nn)推过这个 $2/n$。

::fig[z2h-deep] 5 层、每层 100 个 unit 的 tanh MLP，只做一次 forward。三列只差 gain。

图里的规律再加上 backward 一起看。下表是每层 tanh output 收到的 gradient 的 std，第 1 层除以第 5 层：

| gain | 第 1 层 activation std | 第 5 层 activation std | gradient std：第 1 层 / 第 5 层 |
|---|---|---|---|
| 1 | 0.59 | 0.31 | 0.54 |
| 5/3 | 0.73 | 0.65 | 1.30 |
| 3 | 0.84 | 0.83 | 3.51 |

Gain 1 时 activation 一层比一层窄，gradient 往回走也在变小；gain 3 时 activation 有 40% 贴在 $\pm1$，gradient 往回走反而变大；5/3 时两头都大致平衡。层数一多，这些倍数会连乘起来。

:::skip
下面两小节是 BatchNorm。只想知道“怎么初始化”时可以跳到“训练时看哪几张图”，代价是第 4 站的 BatchNorm backward 看不懂。
:::

### BatchNorm：直接把 pre-activation standardize

要的只是“每层的 pre-activation 大致是 unit Gaussian”。与其靠 initialization 把它凑出来，不如直接在每层把它变成那样。Ioffe 和 Szegedy 2015 年的 Algorithm 1，对一个 batch 里同一个 unit 的 $m$ 个值：

$$\mu_B=\frac1m\sum_{i=1}^mx_i,\qquad\sigma_B^2=\frac1m\sum_{i=1}^m(x_i-\mu_B)^2,\qquad\hat x_i=\frac{x_i-\mu_B}{\sqrt{\sigma_B^2+\varepsilon}},\qquad y_i=\gamma\hat x_i+\beta$$

这几步都可以 differentiate，所以 gradient 能穿过它。$\gamma$ 和 $\beta$ 是学出来的 parameter，initialization 时取 1 和 0。论文给的理由是：只做 standardize 会改变这一层能表示的东西，比如把 sigmoid 的 input 永远限制在中间近似 linear 的那一段；有了 $\gamma,\beta$，取 $\gamma=\sqrt{\mathrm{Var}[x]}$、$\beta=\mathbb E[x]$ 就能还原原来的 activation，network 至少不会因为加了这一层而变差。

两个直接的后果：

**前一层的 bias 没用了。** $x_i+b$ 的 mean 是 $\mu_B+b$，减去之后 $b$ 消失，它的 gradient 恒为 0。所以 notebook 里 BatchNorm 前面的 Linear 都写成 `bias=False`，$\beta$ 接替了 bias 的角色。

**Output 和 weight 的 scale 无关。** Weight 乘以 $\lambda>0$，$x_i$ 全部乘 $\lambda$，$\mu_B$ 乘 $\lambda$，$\sigma_B$ 也乘 $\lambda$，$\hat x_i$ 不变（忽略 $\varepsilon$）。为这一页把上一张图的 5 层 network 每层加上 BatchNorm，gain 取 0.5、1、5/3、3，四种情况每层的 std 和 saturated 比例完全相同：第 1 层 0.623 和 4.0%，第 5 层 0.636 和 3.1%。

### 一个 batch 的副作用，以及 inference 时怎么办

用了 batch 的 mean 和 variance，一个 example 的 output 就取决于它碰巧和哪 31 个 example 分在一个 batch。这个抖动起了一点 regularization 的作用（视频里的说法），也带来一个实际问题：训练完以后要对单个 example 做预测，没有 batch 可算。

两种办法。一是训练结束后把整个 training set 过一遍，算出每个 unit 的 mean 和 std 存下来，notebook 叫作 calibrate。二是训练时顺手维护一个 running average：

```python
bnmean_running = 0.999 * bnmean_running + 0.001 * bnmeani
bnstd_running  = 0.999 * bnstd_running  + 0.001 * bnstdi
```

Inference 时用这两个 running 的值代替 batch 的统计量。Notebook 的结果：用 running 的值是 train 2.0674、val 2.1057，和 calibrate 的结果几乎一样，省掉了训练后那一遍。后面 PyTorch 风格的 `BatchNorm1d` 默认 `momentum=0.1`，就是这里的 0.001 换成 0.1；batch 只有 32 时，统计量本身噪声很大，momentum 取小一些更稳。代码里要有一个 `training` 开关，评估前把每一层设成 `training = False`，忘了这一步，评估就仍在用 batch 的统计量。

:::wrong 有了 BatchNorm，weight 的 scale 就无所谓了
Forward 确实无所谓，上面四种 gain 给出完全相同的 activation。Backward 不是。设这一层的 loss 满足 $L(\lambda W)=L(W)$，两边对 $W$ 求 gradient：

$$\lambda\,\nabla L(\lambda W)=\nabla L(W)\quad\Longrightarrow\quad\nabla L(\lambda W)=\frac{\nabla L(W)}{\lambda}$$

Weight 大 $\lambda$ 倍，gradient 反而小 $\lambda$ 倍。同一个 learning rate 下，update 相对于 weight 本身的大小是

$$\frac{\text{lr}\,\|\nabla L(\lambda W)\|}{\|\lambda W\|}=\frac1{\lambda^2}\cdot\frac{\text{lr}\,\|\nabla L(W)\|}{\|W\|}$$

Weight 初始化大 10 倍，每一步相对的改动就小 100 倍，等于把 learning rate 调小了 100 倍，训练慢得像停住了。所以加了 BatchNorm 之后 initialization 仍然要合理，下一小节的 update:data ratio 能直接看出这个问题。
:::

### 训练时看哪几张图

makemore 第 3 讲最后把上面的东西整理成每次训练都该看的几样统计量，notebook 里有完整的 code：

- **每层 activation 的 histogram**，打印 mean、std 和 saturated 比例。Notebook 里 5 层 tanh 加 BatchNorm 的 network 训练 1000 步之后，五层的 std 都是 0.63 到 0.65，saturated 1.7% 到 2.8%。
- **每层 activation 收到的 gradient 的 histogram**。各层的 std 应该相近；notebook 里是 $2.6\times10^{-3}$ 到 $2.0\times10^{-3}$。
- **每个 weight 的 grad:data ratio**，即 `p.grad.std() / p.data.std()`。Notebook 里 embedding 是 $8.0\times10^{-3}$，几个 Linear 是 $4.9\times10^{-2}$ 到 $7.0\times10^{-2}$。
- **Update:data ratio**，每一步记下 `((lr * p.grad).std() / p.data.std()).log10()`，画随 step 变化的 curve。Notebook 在 $-3$ 画了一条横线：这个 ratio 应该在 $10^{-3}$ 左右。CS231n 讲义给的是同一个数，并说低于它多半是 learning rate 太小，高于它多半是太大。

最后一条是这几张图里最直接的一张：它把“learning rate 合不合适”和“weight 的 scale 合不合适”放进同一个数里，上面那个 $1/\lambda^2$ 的问题在这里会表现成一条远低于 $-3$ 的 curve。

:::edge Batch size 为 1
$\sigma_B^2=0$，$\hat x$ 全是 0，BatchNorm 的 output 只剩 $\beta$，所有 input 都给出同样的结果。所以 BatchNorm 训练时 batch 不能太小，单个 example 只能在 inference 时用 running 的统计量处理。第 6 站的 Transformer 改用 LayerNorm，在一个 example 自己的 feature 上做统计，就没有这个问题。
:::

:::from
Initialization loss 的检查、`W2 *= 0.01`、tanh 饱和与 dead neuron、$(5/3)/\sqrt{\text{fan-in}}$、`bias=False`、running mean 的 0.999 与 0.001、calibrate、`training` 开关、四种统计图和 $-3$ 的参考线、所有标明 “notebook” 的数字来自 makemore part 3 的 notebook（读的是 code 和 output）。$\mathrm{Var}(s)=n\,\mathrm{Var}(w)\,\mathrm{Var}(x)$ 的推导来自 CS231n Neural Networks Part 2，initial loss 2.302 和 update ratio 约 $10^{-3}$ 来自 Part 3（均为 GitHub 镜像）。BatchNorm 的 formula、$\gamma,\beta$ 的理由、bias 被减掉的论证来自 Ioffe 与 Szegedy 2015 的 Section 2、3。“batch 的抖动有 regularization 作用”是视频里的说法，凭记忆。动图和 5 层 network 的数字、logit std 12.7 与 25.5、四种 gain 加 BatchNorm 的结果、$1/\lambda^2$ 的推导是为这一页用 numpy 算或写的；numpy 的 random number 和 PyTorch 不同，所以 loss 与 notebook 有 0.01 量级的差别。
:::

## [ninja] Tensor 层面的手写 backprop

:::skip
快速路线里可以跳过，代价是第 6 站的 backward 只能当黑箱用，以后自己写 kernel 或新 layer 时要回来补。能对 matmul、broadcast、sum、indexing 写出 backward，并能推出 BatchNorm 的一次性 backward formula，就可以去第 5 站。
:::

### 为什么还要在 tensor 层面写一遍

micrograd 每个 scalar 是一个 node。第 4 讲用的 MLP（embedding 10 维、hidden 64、带 BatchNorm）只有 4,137 个 parameter，可一个 32 个 example 的 batch 做一次 forward 就有几十万次 scalar 运算，每次都建一个 Python 对象是不现实的。实际的 code 在 tensor 上运算，backward 也要在 tensor 上写：一次 `sum(1)`、一次 broadcasting、一次 fancy indexing 的 gradient 是什么，scalar 的经验不会直接告诉你。

Exercise 1 把 forward 切成大约 20 个中间 tensor（`logprobs`、`probs`、`counts_sum_inv`、`counts`、`norm_logits`、`logits`、`h`、`hpreact`、`bnraw`、`bnvar_inv`、`bnvar`、`bndiff2`、`bndiff`、`bnmeani`、`hprebn`、`embcat`、`emb` 等），要求从 loss 开始逐个手写它们的 gradient，每写一个就用 `cmp` 和 PyTorch 的 `.grad` 比较，打印 exact（逐 bit 相等）、approximate（`allclose`）和最大差值。Notebook 还特意把 bias、BatchNorm 的 $\gamma,\beta$ 都初始化成非零的随机数，注释说全 0 的 initialization 可能掩盖写错的 backward。

### 两条 shape 规则

**规则一：一个 tensor 的 gradient 和它自己的 shape 相同。** 这是最便宜的检查，几乎每个错误都会先在 shape 上露馅。

**规则二：forward 里的 broadcast，backward 里是 sum；forward 里的 sum，backward 里是 broadcast。** 看 cross-entropy 里的一步：

```python
counts_sum     = counts.sum(1, keepdims=True)   # (32, 27) -> (32, 1)
counts_sum_inv = counts_sum**-1                 # (32, 1)
probs          = counts * counts_sum_inv        # (32, 27) * (32, 1) -> (32, 27)
```

最后一行里 `counts_sum_inv` 的每个数被 broadcast 到一整行，用了 27 次。按第 1 站的规则，用了 27 次就要把 27 份 gradient 加起来：

```python
dcounts_sum_inv = (counts * dprobs).sum(1, keepdim=True)   # (32, 1)，和自己一样
dcounts         = counts_sum_inv * dprobs                  # (32, 27)，第一份
```

`counts` 还被第一行用了一次，那一行是 sum：每个 entry 对 `counts_sum` 的 local derivative 是 1，所以把 `dcounts_sum` 沿着这一行 broadcast 回去，加到 `dcounts` 上：

```python
dcounts_sum = (-counts_sum**-2) * dcounts_sum_inv
dcounts    += torch.ones_like(counts) * dcounts_sum        # 第二份，+=
```

Loss 的那一步是 indexing：`loss = -logprobs[range(n), Yb].mean()` 只用到每行一个 entry，每个用到的 entry 的 local derivative 是 $-1/n$，其余是 0。所以 `dlogprobs` 是一个全 0 的 $(32,27)$ tensor，每行在正确答案的位置填 $-1/32$。

### Matmul：用 shape 推出来，再用一个 entry 核对

`logits = h @ W2 + b2`，`h` 是 $(32,64)$，`W2` 是 $(64,27)$，`b2` 是 $(27,)$，已知 `dlogits` 是 $(32,27)$。

`dh` 必须是 $(32,64)$。手里只有 `dlogits` $(32,27)$ 和 `W2` $(64,27)$，能乘出 $(32,64)$ 的只有 `dlogits @ W2.T`。同理 `dW2` 必须是 $(64,27)$，只能是 `h.T @ dlogits`。`b2` 被 broadcast 到 32 行，按规则二沿 batch 求 sum：`db2 = dlogits.sum(0)`。CS231n 讲义推荐的正是这种 dimension analysis，并建议在纸上写一个小的 explicit 例子核对。

核对一个 entry：$\text{logits}_{ij}=\sum_kh_{ik}W_{kj}+b_j$，$h_{ik}$ 出现在第 $i$ 行的全部 27 个 logit 里，所以

$$\frac{\partial L}{\partial h_{ik}}=\sum_{j=1}^{27}\frac{\partial L}{\partial\,\text{logits}_{ij}}\,W_{kj}=\big(\text{dlogits}\;W^\top\big)_{ik}$$

和 shape 推出来的一致。

### Cross-entropy 一次推完

把 `logit_maxes` 到 `loss` 的七行合起来，[CS3244 第 6 站](../courses/CS3244.html#nn)推过对一个 example，loss 对 logits 的 gradient 是 $p-y$。Loss 是 batch 的平均，每个 example 带一个 $1/n$：

```python
dlogits = F.softmax(logits, 1)
dlogits[range(n), Yb] -= 1
dlogits /= n
```

每一行的和是 $\sum_jp_j-1=0$，notebook 打印出来是 $1.4\times10^{-9}$。这一行可以这样读：每个错误答案的 logit 被往下推，力度是 model 给它的 probability；正确答案被往上拉，力度是 $1-p_y$；两边恰好抵消。Notebook 的第 0 行，正确答案的 $p$ 是 0.0165，乘以 $n$ 之后那一格是 $-0.9835$，其余 26 格就是各自的 $p$。

Chunked 版本里有一个 `dlogit_maxes`，它应该恰好是 0：所有 logit 同时减去同一个数，softmax 不变，loss 不变。手写出来的值在 $10^{-9}$ 量级，是 rounding 留下的。一次性的 formula 和 PyTorch 比较，notebook 只能做到 approximate，最大差 $5\times10^{-9}$；chunked 版本能做到逐 bit 相等，前提是按 PyTorch 的方式写每一步，notebook 的注释说 `counts_sum**-1` 换成 `1.0 / counts_sum` 就做不到了。

### BatchNorm backward 一次推完

Chunked 的 BatchNorm 是七行。画成图，能看到两处 fork 和两处 broadcast：

::fig[z2h-bngraph] BatchNorm 的 forward 拆成小步。逐个往回推时，每个 fork 要用 `+=`，每个 broadcast 要在 backward 里沿 batch 求 sum。

Exercise 3 要求把这七行合成一个 formula。对一个 unit，batch 里有 $n$ 个值 $x_1,\dots,x_n$。Notebook 的 variance 用 $n-1$（Bessel's correction），$\varepsilon$ 并进 $\sigma$：

$$\mu=\frac1n\sum_jx_j,\qquad\sigma^2=\frac1{n-1}\sum_j(x_j-\mu)^2+\varepsilon,\qquad\hat x_i=\frac{x_i-\mu}{\sigma},\qquad y_i=\gamma\hat x_i+\beta$$

已知 $dy_i=\partial L/\partial y_i$，求 $dx_k=\partial L/\partial x_k$。$x_k$ 通过所有 $\hat x_i$ 影响 $L$（因为每个 $\hat x_i$ 里都有 $\mu$ 和 $\sigma$），所以

$$dx_k=\sum_{i=1}^n\frac{\partial L}{\partial\hat x_i}\,\frac{\partial\hat x_i}{\partial x_k}=\gamma\sum_{i=1}^ndy_i\,\frac{\partial\hat x_i}{\partial x_k}$$

先求 $\partial\hat x_i/\partial x_k$ 要用的两块。

$\mu$：$\dfrac{\partial\mu}{\partial x_k}=\dfrac1n$。

$\sigma$：对 $\sigma^2$ 求导，

$$\frac{\partial\sigma^2}{\partial x_k}=\frac1{n-1}\sum_j2(x_j-\mu)\Big([j=k]-\frac1n\Big)=\frac2{n-1}\Big((x_k-\mu)-\frac1n\sum_j(x_j-\mu)\Big)=\frac{2(x_k-\mu)}{n-1}$$

最后一步用了 $\sum_j(x_j-\mu)=0$。再由 $\dfrac{\partial\sigma}{\partial x_k}=\dfrac1{2\sigma}\dfrac{\partial\sigma^2}{\partial x_k}$，得 $\dfrac{\partial\sigma}{\partial x_k}=\dfrac{x_k-\mu}{(n-1)\sigma}=\dfrac{\hat x_k}{n-1}$。

$\hat x_i=(x_i-\mu)/\sigma$ 用 quotient rule：

$$\frac{\partial\hat x_i}{\partial x_k}=\frac1\sigma\Big([i=k]-\frac1n\Big)-\frac{x_i-\mu}{\sigma^2}\cdot\frac{\hat x_k}{n-1}=\frac1\sigma\Big([i=k]-\frac1n-\frac{\hat x_i\hat x_k}{n-1}\Big)$$

代回去，三项分别求和：

$$dx_k=\frac\gamma\sigma\Big(dy_k-\frac1n\sum_idy_i-\frac{\hat x_k}{n-1}\sum_idy_i\hat x_i\Big)=\frac{\gamma}{n\sigma}\Big(n\,dy_k-\sum_idy_i-\frac n{n-1}\,\hat x_k\sum_idy_i\hat x_i\Big)$$

这正是 notebook 里那一行：

```python
dhprebn = bngain*bnvar_inv/n * (n*dhpreact - dhpreact.sum(0) - n/(n-1)*bnraw*(dhpreact*bnraw).sum(0))
```

`bnvar_inv` 是 $1/\sigma$，`bnraw` 是 $\hat x$，`.sum(0)` 是沿 batch 求和，每个 unit 各算各的。Notebook 和 PyTorch 比较，最大差 $9\times10^{-10}$。

**算一个。** $n=4$，$x=(1,2,4,9)$，$\gamma=1$，$\varepsilon=0$，$dy=(0.5,\,-1,\,0.25,\,0)$。

$\mu=16/4=4$；$\sigma^2=\dfrac{9+4+0+25}{3}=12.667$，$\sigma=3.5590$；$\hat x=(-0.8429,\,-0.5620,\,0,\,1.4049)$。

$\sum dy_i=-0.25$；$\sum dy_i\hat x_i=0.5\times(-0.8429)+(-1)\times(-0.5620)+0+0=0.1405$。

$$dx_k=\frac1{4\times3.5590}\Big(4\,dy_k+0.25-\frac43\times0.1405\,\hat x_k\Big)$$

得 $dx=(0.1691,\,-0.2560,\,0.0878,\,-0.0009)$。用 centered difference 逐个核对，前 4 位全部相同。

两个检查：$\sum_kdx_k=0$，$\sum_kdx_k\hat x_k=0$（实算分别是 $-5\times10^{-17}$ 和 $3\times10^{-17}$）。这不是巧合：所有 $x$ 同时加一个常数，$\mu$ 跟着加，$\hat x$ 不变；所有 $x$ 绕 $\mu$ 同时放大，$\sigma$ 跟着放大，$\hat x$ 也不变。Loss 在这两个方向上不变，gradient 在这两个方向上的 component 就是 0。

:::wrong $\mu$ 和 $\sigma$ 是 batch 的统计量，backward 时当常数就行
当常数，$dx_k=\gamma\,dy_k/\sigma$。上面的例子给出 $(0.1405,\,-0.2810,\,0.0702,\,0)$，和正确的 $(0.1691,\,-0.2560,\,0.0878,\,-0.0009)$ 每一项都不同。第 4 个 example 的 $dy$ 是 0，当常数时它的 gradient 也是 0；可它是 9，离 mean 最远，挪动它会改变 $\mu$ 和 $\sigma$，从而改变另外三个 $\hat x$，所以真实的 gradient 不是 0。错误版本的和是 $-0.0702$，不满足 $\sum dx=0$，用上一段的两个检查一下子就能发现。
:::

:::edge Bessel's correction 用不用
Ioffe 和 Szegedy 的 Algorithm 1 用 $1/m$，notebook 用 $1/(n-1)$，并在注释里专门标出。两种写法 backward formula 里 $\frac n{n-1}$ 那个 factor 不同，必须和 forward 一致，否则 `cmp` 对不上。PyTorch 的 `BatchNorm1d` 在训练时用 $1/n$ 做 normalization、用 $1/(n-1)$ 更新 running variance（这一点是自己的知识，不是 notebook 里写的），所以 batch 小时训练和 inference 用的 variance 会差 $n/(n-1)$ 倍，batch 32 时是 1.03。
:::

### Embedding：按 index 加回去

`emb = C[Xb]`，`C` 是 $(27,10)$，`Xb` 是 $(32,3)$，`emb` 是 $(32,3,10)$。`emb[k, j]` 就是 `C[Xb[k, j]]` 这一行的一份拷贝。同一个 character 在 batch 里出现多少次，`C` 的那一行就被用了多少次，gradient 按第 1 站的规则全部加起来：

```python
dC = torch.zeros_like(C)
for k in range(Xb.shape[0]):
    for j in range(Xb.shape[1]):
        dC[Xb[k, j]] += demb[k, j]
```

`demb` 本身来自 `dembcat.view(emb.shape)`：forward 的 `view` 只是换了读 memory 的方式，backward 换回去即可。

:::wrong 两层 loop 太慢，写成一句 dC[Xb] += demb
这句话不报错，结果却是错的。Fancy indexing 的 `+=` 先把 `dC[Xb]` 读出来、加上 `demb`、再写回去，同一个 index 出现两次时，后一次的写入盖掉前一次，只算了一份。用 numpy 看最小的情形：`a = np.zeros(3); a[[0, 0]] += 1` 之后 `a[0]` 是 1，不是 2。Context `emm` 里 `m` 出现两次，就会丢掉一份 gradient。要用专门做累加的操作：numpy 的 `np.add.at(dC, Xb, demb)`，PyTorch 的 `dC.index_add_(0, Xb.view(-1), demb.view(-1, 10))`。
:::

### 拼起来训练

Exercise 4 把上面的一次性 formula 放进 training loop，删掉 `loss.backward()`，外面套一个 `torch.no_grad()`，整个 backward 只剩十几行：cross-entropy 一行、第二层三行、tanh 一行、BatchNorm 三行、第一层三行、embedding 的 loop。Notebook 训练 200,000 步，结果是 train 2.0705、val 2.1099，注释里 Karpathy 自己的是 2.0719、2.1162，和第 3 站用 autograd 训练的结果相当。调试时 notebook 留了一行注释掉的 code：对每个 parameter 用 `cmp` 比较手写的 grad 和 `p.grad`，先只跑几步，全部对上再去掉 `loss.backward()`。

:::from
Exercise 1 至 4 的切分方式、`cmp` 的三种比较、非零 initialization 的理由、每一行 backward 的 code、`dlogits` 每行和为 $1.4\times10^{-9}$ 和第 0 行的数、两次比较的最大差、`counts_sum**-1` 的注释、BatchNorm 一次性 formula、Bessel's correction 的注释、embedding 的 loop、train 2.0705 与 val 2.1099 都来自 makemore part 4 的 notebook。用 shape 推 matmul 的 backward 来自 CS231n Backpropagation, Intuitions（GitHub 镜像）；Ioffe 与 Szegedy 论文 Section 3 给的是不合并的 chain rule，这里的合并推导、$n=4$ 的例子、两个 orthogonality 检查、`a[[0, 0]] += 1` 的演示是为这一页写的，PyTorch 的 `index_add_` 写法和 running variance 的细节是自己的知识。
:::

## [wavenet] WaveNet：把 context 分层合并

:::skip
快速路线里可以跳过。代价是少了一次“自己把 layer 写成 module、追踪 3 维 tensor 的 shape”的练习，以及 BatchNorm 遇到 3 维 input 的那个 bug。能写出 FlattenConsecutive 每一层的 shape，说出那个 bug 为什么不报错，就可以去第 6 站。
:::

### Context 从 3 加到 8

第 2 站的 MLP 只看 3 个 character。Notebook 的 performance log 第一行是这个 model：12K 个 parameter，train 2.058，val 2.105。把 `block_size` 改成 8，其余不变，parameter 变成 22,097（$27\times10$ 的 embedding、$80\times200$ 的 Linear、BatchNorm 的 400 个、$200\times27+27$ 的 output），val 降到 2.027。

但这个结构有一个问题：8 个 character 的 embedding 拼成 80 维，第一个 Linear 一步就把它们全部揉在一起。Context 越长，这一层越宽，而且“哪两个 character 挨着”这种局部信息，只能靠这一层的 weight 自己去发现。

::fig[z2h-wavenet] Context `..diondr` 预测 `e`。左边第一层就看全部 8 个 character；右边每层只合并相邻的两组，三层之后才汇总。

### 每层只合并相邻两个

右边的结构来自 WaveNet。实现上只需要一个新的 layer：

```python
class FlattenConsecutive:
    def __init__(self, n):
        self.n = n
    def __call__(self, x):
        B, T, C = x.shape
        x = x.view(B, T//self.n, C*self.n)   # 相邻 n 个 vector 拼在一起
        if x.shape[1] == 1:
            x = x.squeeze(1)
        self.out = x
        return self.out
```

`view(B, T//2, C*2)` 把第 $2t$ 和第 $2t+1$ 个 vector 首尾相接，因为它们在 memory 里本来就相邻。PyTorch 的 matmul 只对最后一维做乘法，前面的维度都当作 batch，所以 `(B, 4, 20) @ (20, h)` 得到 `(B, 4, h)`，同一个 Linear 被同时用在 4 组上。Embedding 10 维、hidden $h$ 时，shape 依次是：

| 经过 | shape |
|---|---|
| Embedding | $(B,8,10)$ |
| FlattenConsecutive(2)，Linear，BatchNorm，tanh | $(B,4,20)\to(B,4,h)$ |
| FlattenConsecutive(2)，Linear，BatchNorm，tanh | $(B,2,2h)\to(B,2,h)$ |
| FlattenConsecutive(2)，Linear，BatchNorm，tanh | $(B,2h)\to(B,h)$ |
| Linear | $(B,27)$ |

为了和 flat 版本公平比较，hidden 要取得让 parameter 也在 22K 左右。$h=68$ 时：embedding 270，三个 Linear $20\times68+136\times68+136\times68=1360+9248+9248$，三个 BatchNorm 各 $2\times68$，output $68\times27+27$，合计 22,397。Performance log 记的是 train 1.941、val 2.029，和 flat 的 2.027 几乎一样，结构上的好处还没有显出来。

### BatchNorm 遇到 3 维 input

Log 的下一行是“fix bug in batchnorm”：val 降到 2.022。Bug 在第 3 站写的 `BatchNorm1d` 里：

```python
xmean = x.mean(0, keepdim=True)   # 对 2 维 input 是对的
xvar  = x.var(0, keepdim=True)
```

Input 是 $(32,4,68)$ 时，沿第 0 维求 mean 得到 $(1,4,68)$：4 个位置各自算一套 mean 和 variance，每套只用 32 个数。我们想要的是每个 unit 一套，用 $32\times4=128$ 个数。改成

```python
if x.ndim == 2: dim = 0
elif x.ndim == 3: dim = (0, 1)
xmean = x.mean(dim, keepdim=True)  # (1, 1, 68)
```

:::wrong 程序没有报错，shape 也都对，BatchNorm 就没问题
错误的版本里 `xmean` 是 $(1,4,68)$，`x - xmean` 照样 broadcast 成 $(32,4,68)$；running mean 也悄悄变成了 $(1,4,68)$，同样能 broadcast。每一步的 shape 都合法，最终 output 的 shape 也对。差别只在统计量：每个 unit 被分成 4 份分别 standardize，每份的 sample 少了 4 倍，噪声更大，还把“4 个位置本该共享同一个 Linear”的结构拆开了。唯一的线索是 `running_mean.shape`：它应该是 $(1,1,68)$，却是 $(1,4,68)$。视频里正是打印各层 output 和 buffer 的 shape 时才发现的（凭记忆），notebook 里只留下了修好的版本。这和第 2 站漏写 `keepdim` 是同一类 bug：broadcasting 让错误的 shape 也能算下去。
:::

### 和 WaveNet、convolution 的关系

WaveNet 论文的结构是 dilated causal convolution。Causal 指第 $t+1$ 个 sample 的预测只依赖 $x_1,\dots,x_t$；dilated 指每层的 filter 跳着取 input，dilation 每层翻倍。论文的设定是 dilation $1,2,4,\dots,512$，一组 10 层的 receptive field 是 1024，这样一组重复三次。上面的 tree 就是 kernel 大小为 2、dilation 为 1、2、4 的三层，receptive field 是 $2^3=8$。

Tree 只对一个位置做预测。训练时一个名字 `diondre.` 有 8 个位置要预测，notebook 最后演示的做法是把 `Xtr[7:15]` 这 8 行逐个送进 model，用一个 for loop。这样每个位置都要算完整的 tree：第一层 4 个 node、第二层 2 个、第三层 1 个，共 7 个。可相邻位置的 tree 有大量重复：位置 $t$ 和 $t+2$ 的第一层 node 有三个是同一组 character 对。Convolution 把“对每个位置都做一遍”变成一次运算，每层在每个位置只算一个 node，中间结果被所有用得到它的位置共享，每个位置只要 3 个 node。Notebook 在这里停下，注释写着 convolution 就是一个 for loop，它让 Linear 能高效地在空间上滑过去；真正的 dilated convolution 实现视频里没有讲。

### 把它做大

Notebook 最后把 embedding 加到 24 维、hidden 加到 128：parameter 是 $27\times24+48\times128+256+256\times128+256+256\times128+256+128\times27+27=76{,}579$，train 1.769，val 1.993。比第 2 站的 MLP（val 2.105）好了 0.11。Sample 出来的有 `chetta`、`hendrix`、`jamylie`、`aubreana`。

Train 和 val 的差距从 0.05 拉到了 0.22，这时 model 开始记住 training set 的细节了。Notebook 的 performance log 到此为止；继续往下要做的是在 dev set 上系统地调 hyperparameter，视频里说这一步需要一套 experiment 的基础设施，这门课没有做。

:::from
Context 8、FlattenConsecutive、Sequential 的写法、matmul 对前导维度的处理、performance log 的五行数字、BatchNorm 的 bug 与修法、76,579 个 parameter、sample、“convolution is a for loop”的演示，都来自 makemore part 5 的 notebook。Notebook 里只留下了最终 $h=128$ 的 code，$h=68$ 是凭视频的记忆，22,397 和 22,097 是按 code 数出来的。Dilated causal convolution 的定义、dilation 到 512、receptive field 1024 来自 WaveNet 论文 Section 2.1；tree 与 dilation 的对应、7 个与 3 个 node 的对比是为这一页写的。“需要 experiment 基础设施”是视频里的说法，凭记忆。
:::

## [gpt] 从零写 GPT

:::skip
快速路线必读。能用 lower-triangular matrix 写出 causal 的平均，说出 multi-head、feed-forward、residual、LayerNorm 各自补上了什么，数得出 gpt.py 的 parameter，就可以去第 7 站。Attention 的手算和 $\sqrt{d_k}$ 的推导在 [CS4248 第 6 站](../courses/CS4248.html#attn)，这里不重复。
:::

### Data 与 baseline

数据换成 tiny Shakespeare：一个 1,115,394 个 character 的文本文件，出现了 65 种 character（换行、空格、10 个 punctuation、数字 `3`、52 个大小写字母）。Tokenizer 就是给每种 character 一个 index，`"hii there"` 编成 `[46, 47, 47, 1, 58, 46, 43, 56, 43]`。前 90% 训练，后 10% 做 validation，训练部分有 1,003,854 个 token。

训练时每次随机切一段长 `block_size` 的 chunk，target 是往右错一位的同一段：

```python
x = data[i : i+block_size]
y = data[i+1 : i+block_size+1]
```

文本开头 `"First Cit"` 是 `[18, 47, 56, 57, 58, 1, 15, 47, 58]`。取 `block_size = 8`，这一个 chunk 里藏着 8 个 example：context `[18]` 预测 47，`[18, 47]` 预测 56，……，`[18, 47, 56, 57, 58, 1, 15, 47]` 预测 58。Context 的长度从 1 到 8 都有，所以 model 在生成时从 1 个 character 开始也能工作。一个 batch 是 `batch_size` 个这样的 chunk，shape 记作 $(B,T)$。

Baseline 是 bigram：`nn.Embedding(65, 65)`，每个 token 直接查出下一个 token 的 65 个 logit，也就是第 2 站的 $W$。作为参照，为这一页在训练部分数 count、+1 smoothing 之后在 validation 上的 NLL 是 2.4819；65 个 character 等可能时是 $\ln65=4.1744$。Bigram 的问题很清楚：每个位置只看自己，前面的 7 个 token 完全没用上。

### 让 token 之间交流：先从平均开始

第 $t$ 个位置要用上第 1 到 $t$ 个 token 的信息，而且不能看到 $t$ 之后的（那正是要预测的东西）。最简单的办法是把前 $t$ 个 vector 平均。写成 loop 是两层，慢；写成 matrix 乘法只要一次：

::fig[z2h-avg] $T=4$、$C=2$ 时的平均。`wei` 的第 $t$ 行在前 $t$ 个位置上各是 $1/t$。

Notebook 给了三个等价的写法，最后一个是：

```python
tril = torch.tril(torch.ones(T, T))
wei  = torch.zeros((T, T))
wei  = wei.masked_fill(tril == 0, float('-inf'))
wei  = F.softmax(wei, dim=-1)
out  = wei @ x            # (T, T) @ (B, T, C) -> (B, T, C)
```

第 3 行把对角线右上方换成 $-\infty$，softmax 之后那些位置的 weight 是 $e^{-\infty}=0$；其余位置都是 0，$e^0=1$，normalize 后第 $t$ 行就是 $t$ 个 $1/t$，和图里一样。`wei` 是 $(T,T)$，`x` 是 $(B,T,C)$，matmul 把 `wei` broadcast 到 batch 的每个 element 上，batch 之间互不相干。

绕一圈用 softmax，是因为那个全 0 的 `wei` 只是占位：平均对每个过去的 token 一视同仁，可一个元音后面最需要的，也许是特定位置上的某个辅音。下一步让 `wei` 的每一格由 data 决定。

### Self-attention：weight 由 $q\cdot k$ 决定

每个 token 从自己的 vector 算出三个东西：query（我在找什么）、key（我有什么）、value（如果你选中我，我给你什么）。

```python
k = self.key(x)     # (B, T, head_size)
q = self.query(x)   # (B, T, head_size)
wei = q @ k.transpose(-2, -1) * k.shape[-1]**-0.5    # (B, T, T)
wei = wei.masked_fill(self.tril[:T, :T] == 0, float('-inf'))
wei = F.softmax(wei, dim=-1)
v = self.value(x)
out = wei @ v       # (B, T, head_size)
```

和上一小节相比只改了一处：`wei` 的初始值从全 0 换成 $qk^\top$，于是第 $i$ 行第 $j$ 列的 weight 由“$i$ 的 query 和 $j$ 的 key 有多像”决定。Mask 和 softmax 原封不动。乘 $1/\sqrt{\text{head\_size}}$ 是为了让 initialization 时 $q\cdot k$ 的 variance 保持在 1 附近，不让 softmax 一开始就退化成接近 one-hot，推导见 [CS4248](../courses/CS4248.html#attn)。

Attention 本身不知道 token 的顺序：把前面的 token 换个次序，weighted average 不变。所以 model 在 input 处给每个位置加一个学出来的 vector：`x = tok_emb + pos_emb`，position embedding table 是 `(block_size, n_embd)`。

:::wrong Scaling 用 n_embd 还是 head_size 无所谓，反正都是常数
视频里的 code 写的是 `* C**-0.5`，`C` 是 `n_embd`。仓库后来有一个 commit 叫 “scale by head size”，把它改成 `k.shape[-1]**-0.5`。最终的配置里 `n_embd = 384`、6 个 head，`head_size = 64`，除以 $\sqrt{384}$ 而不是 $\sqrt{64}$，score 被多缩小了 $\sqrt6=2.449$ 倍。这相当于给 softmax 加了一个 2.449 的 temperature。拿一行 score $(2,\,0,\,-1,\,1)$ 看：正确 scaling 下 weight 是 $(0.644,\,0.087,\,0.032,\,0.237)$，多缩小 2.449 倍之后是 $(0.417,\,0.184,\,0.122,\,0.277)$，attention 变得更平均，更接近上一小节的“一视同仁”。Training 可以学着把 $W^Q$、$W^K$ 调大来补偿，所以程序照样能训练，只是起点和 variance 的论证都不对了。
:::

### 每加一个组件，val loss 降多少

ng-video-lecture 仓库的 git log 记下了视频里一步步加组件的过程，几个 commit message 里写着当时的 val loss（这一阶段的 v2.py 是 `n_embd = 32`、`block_size = 8`、`batch_size = 32`、learning rate $10^{-3}$、5000 步）：

| commit | 加了什么 | commit message 里的 val loss |
|---|---|---|
| bigram model | baseline | 没有写；按 count 算的最优值是 2.48 |
| add a single self-attention head | 一个 head | 2.5 |
| multi-headed attention | 4 个 head，每个 8 维 | 2.28 |
| add a computation block | 每个 token 后接一个 MLP | 2.24 |
| introduce the residual block | residual 与 projection | 没有写 |
| add layernorms | LayerNorm | 2.06 |

每一步都是为了补上一版缺的东西。

**Multi-head。** 一个 head 给每个 token 一组 weight、一次 weighted average。一个 token 可能同时需要好几种信息（前一个 character 是什么、这个词从哪里开始），一组 weight 没法同时照顾。4 个各 8 维的 head 并排算，output 拼回 32 维，计算量和一个 32 维的 head 相同。

**Feed-forward。** Attention 的 output 只是 value 的 weighted average，对 value 来说是 linear 的。Token 们交流完之后，每个 token 要各自处理收到的东西：一个 `Linear(n_embd, 4*n_embd)`、ReLU、`Linear(4*n_embd, n_embd)`，对每个位置独立地做。视频里的说法是 attention 负责 communication，feed-forward 负责 computation。

**Residual。** Block 一叠多，训练就变难，这和第 3 站深层 network 的问题是同一个。写成 `x = x + self.sa(x)`、`x = x + self.ffwd(x)`：第 1 站说过，加法把 gradient 原样交给两个 input，所以从 loss 到 embedding 有一条不经过任何 block 的路，gradient 沿着它不衰减地传回去。每个 block 只往这条“residual stream”上加一点修正；为了让加上去的东西和 stream 的维度一致，attention 拼接之后要再过一个 `proj` Linear。

**LayerNorm。** 和第 3 站的 BatchNorm 一样做 standardize，区别在统计的方向：BatchNorm 对一个 unit 沿 batch 求 mean，LayerNorm 对一个 token 沿它自己的 `n_embd` 个 feature 求 mean。于是 batch 里的 example 互不影响，不需要 running statistics，训练和 inference 完全一样，第 3 站的 batch size 为 1 的问题也不存在。gpt.py 把 LayerNorm 放在 attention 和 feed-forward 之前（`x + self.sa(self.ln1(x))`），和原始 Transformer 论文放在之后不同，叫 pre-norm；为什么现在都这样放，见 [CS336 第 2 站](../courses/STANFORD-CS336.html#arch)。最后一个 block 之后、`lm_head` 之前再加一个 `ln_f`。

**Dropout 与放大。** 最后把 model 放大到 `n_embd = 384`、6 个 head、6 层、`block_size = 256`，parameter 一多，train 和 val 的差距会拉开，于是在 attention weight、projection 和 feed-forward 的 output 上加 `dropout = 0.2`：训练时每次随机把 20% 的 activation 置 0，迫使 network 不依赖个别 unit。视频里这个配置的 val loss 约是 1.48（凭记忆）；nanoGPT 的 README 用同样的结构、`learning_rate = 1e-3` 加 warmup 和 decay，一张 A100 上约 3 分钟到 1.4697。

### 数 parameter

gpt.py 的配置：`vocab_size = 65`，`n_embd = 384`，`block_size = 256`，`n_head = 6`，`n_layer = 6`。

| 部分 | 个数 |
|---|---|
| token embedding $65\times384$ | 24,960 |
| position embedding $256\times384$ | 98,304 |
| 每个 block：key、query、value，各 $384\times384$，无 bias | 442,368 |
| 　　　　　 proj $384\times384+384$ | 147,840 |
| 　　　　　 feed-forward $384\times1536+1536$ 与 $1536\times384+384$ | 1,181,568 |
| 　　　　　 两个 LayerNorm，各 $2\times384$ | 1,536 |
| 每个 block 合计 | 1,773,312 |
| 6 个 block | 10,639,872 |
| `ln_f` | 768 |
| `lm_head` $384\times65+65$ | 25,025 |
| 总计 | 10,788,929 |

和 gpt.py 打印的 10.788929 M 一致。一个 block 里 feed-forward 占了三分之二，这是 $4\times$ 宽度的直接后果；[CS4248](../courses/CS4248.html#attn) 把它写成每个 block 约 $12d^2$：$3d^2+d^2+8d^2$，这里 $12\times384^2=1{,}769{,}472$，差的 3,840 是 bias 和 LayerNorm。

Initialization 视频里没有讲。ng-video-lecture 的 README 后来补了一条说明：不调 initialization 也能训练，但收敛更慢，并在 code 里加了 `_init_weights`，所有 Linear 和 Embedding 的 weight 取 std 0.02 的 normal，bias 取 0。

### 生成

```python
for _ in range(max_new_tokens):
    idx_cond = idx[:, -block_size:]      # position embedding 只有 block_size 行
    logits, loss = self(idx_cond)
    logits = logits[:, -1, :]            # 只要最后一个位置的预测
    probs = F.softmax(logits, dim=-1)
    idx_next = torch.multinomial(probs, num_samples=1)
    idx = torch.cat((idx, idx_next), dim=1)
```

两处要注意。第一，context 超过 `block_size` 时必须截掉前面的部分，否则 `pos_emb` 的 index 越界。第二，每生成一个 token 都把整个 context 重新算一遍，却只用最后一个位置的 logits；训练时这 $T$ 个位置的预测都有用，生成时前 $T-1$ 个都浪费了。把前面算过的 key 和 value 存下来就能省掉这部分，这就是 KV cache，见 [CS336 第 8 站](../courses/STANFORD-CS336.html#infer)。

:::edge Decoder 与 encoder
Mask 是因为这里在做 language modeling。做 sentiment classification 之类、所有 token 都已知的任务，可以去掉 mask，让每个 token 看见全部，这叫 encoder block；带 mask 的叫 decoder block。Key 和 value 来自另一段文本（比如翻译里的原文）时叫 cross-attention。GPT 只有 decoder block。
:::

:::from
Data 的处理、`"hii there"` 的 encoding、chunk 里藏着 8 个 example、三种写法的平均、query/key/value 的说法、position embedding、组件的顺序、commit message 里的 val loss、“scale by head size” 的 commit、gpt.py 的全部配置、`generate` 的 code、initialization 的补充说明来自 ng-video-lecture 仓库的 code、README 和 git log，以及 minbpe 的 lecture.md。“communication 与 computation”、“residual stream”、encoder 与 decoder 的区分、1.48 是视频里的说法，凭记忆。1.4697 和 3 分钟来自 nanoGPT 的 README。Count bigram 的 2.4819、scaling 错误的数字例子、parameter 表是为这一页算的。
:::

## [tok] GPT tokenizer

:::skip
快速路线必读。BPE training 的算法本身（数 pair、并列时选谁、增量更新）在 [CS4248 第 1 站](../courses/CS4248.html#token)和 [CS336 第 1 站](../courses/STANFORD-CS336.html#bpe)讲过，这里讲 minbpe 的实现、encode 的规则、为什么要先用 regex 切块，以及 GPT-4 tokenizer 的细节。能手算一次 encode、说出不切块会学出什么样的 token，就读完了这门课。
:::

### 为什么不直接用 character

第 6 站的 tokenizer 有 65 个 token，对 tiny Shakespeare 够用。真实的文本里有各种语言和 emoji，Unicode 的 code point 有十几万个，大多数几乎不出现。UTF-8 把每个 code point 编成 1 到 4 个 byte：

| 文本 | code point | UTF-8 bytes |
|---|---|---|
| `hello` | 5 个 | `104 101 108 108 111`，5 个 |
| `안녕` | 2 个（U+C548、U+B155） | `236 149 136 235 133 149`，6 个 |
| `😉` | 1 个（U+1F609） | `240 159 152 137`，4 个 |

只用 256 个 byte 当 vocabulary，什么文本都能表示，但 sequence 太长：Taylor Swift 的 Wikipedia 页面（minbpe 的测试文件）有 185,561 个 character、185,768 个 byte。Transformer 的 context 长度是有限的（minbpe 的 lecture.md 提到 GPT-2 从 GPT-1 的 512 加到 1024 个 token，vocabulary 是 50,257），attention 的代价随长度平方增长，每个 token 能装的信息越少，model 一次能看到的文本就越短。BPE 在这两者之间折中：从 256 个 byte 出发，反复把最常见的相邻 pair 合成一个新 token。

### minbpe 的 train：数 pair、合并、记下来

minbpe 的 `BasicTokenizer.train` 只有三个部件。`get_stats(ids)` 数每对相邻 id 出现了几次；`merge(ids, pair, idx)` 从左往右扫，把每个 `pair` 换成新的 `idx`；两个 dict 记下结果：`merges[(p0, p1)] = idx` 记录规则，`vocab[idx] = vocab[p0] + vocab[p1]` 记录每个 token 代表哪串 bytes。新 token 的 id 从 256 开始依次编号，所以 id 的大小就是 merge 的先后。

README 用 Wikipedia 上 BPE 词条的例子 `aaabdaaabac`，做 3 次 merge：

::fig[z2h-bpe] 每一帧是一次 merge 之后的 token sequence。新 token 是实心的方块。

结果 `[258, 100, 258, 97, 99]`，258 代表 `aaab`。图里有个细节：第一次 merge 时 `(97, 97)` 的 count 是 4，因为 `aaa` 里的 `aa` 被数了两次（位置 0–1 和 1–2）；可替换从左往右做，换掉位置 0–1 之后，位置 1 已经被用掉了，所以只发生 2 次替换，token 从 11 个变成 9 个。Count 只是用来挑 pair 的估计，不等于实际减少的 token 数。

### Encode：每次合并 rank 最小的 pair

Encode 一段新文本，要重现 training 时的合并顺序：

```python
ids = list(text.encode("utf-8"))
while len(ids) >= 2:
    stats = get_stats(ids)
    pair = min(stats, key=lambda p: self.merges.get(p, float("inf")))
    if pair not in self.merges:
        break                  # 没有能用的 merge 了
    ids = merge(ids, pair, self.merges[pair])
```

每一轮在当前所有相邻 pair 里找 merge id 最小的那个，也就是 training 时最早学到的那条规则。用上面学到的 3 条 merge（$(97,97)\to256$、$(256,97)\to257$、$(257,98)\to258$）手算三个例子：

- `aaab`：`[97, 97, 97, 98]`，pair 有 `(97,97)` 和 `(97,98)`，只有前者在 merges 里，换掉最左边的一处得 `[256, 97, 98]`；再找，`(256,97)` 是 257，得 `[257, 98]`；`(257,98)` 是 258，得 `[258]`。
- `aab`：`[97, 97, 98]` → `[256, 98]`，`(256, 98)` 不在 merges 里，停。结果 `[256, 98]`。
- `aaaab`：`[97, 97, 97, 97, 98]`，`merge` 从左往右换掉两处 `(97,97)`，得 `[256, 256, 98]`；`(256,256)` 和 `(256,98)` 都不在 merges 里，停。

在本地用 minbpe 实际 encode，三个结果和手算一致。Decode 反过来，把每个 id 的 bytes 接起来再 按 UTF-8 decode。minbpe 写的是 `decode("utf-8", errors="replace")`：单独 decode 一个 128，得到的是 replacement character `�`，因为 `0x80` 在 UTF-8 里只能出现在 多 byte 的 character 的中间，单独一个 不是合法的 UTF-8 encoding。Model 是可以输出这样的 id 的，所以 decode 不能因此报错。

:::wrong Encode 就是在 vocabulary 里从左往右找最长的匹配
对 `aaaab`，从左往右找最长匹配：vocabulary 里最长能匹配开头的是 `aaa`（257），剩下的 `ab` 不在 vocabulary 里，只能是 `a`、`b`，结果 `[257, 97, 98]`。BPE 的 encode 给出的是 `[256, 256, 98]`。两个都能 decode 回 `aaaab`，但 model 训练时看到的永远是 BPE 的切法，从没见过 `[257, 97, 98]` 这种组合。Encode 必须一条条按 merge 的顺序重放，才能和 training 时的切法一致。
:::

### 不先切块会学出什么

在 Taylor Swift 的页面上训练 BasicTokenizer，vocabulary 512，也就是 256 次 merge（为这一页本地跑的，11 秒）。最早的几次 merge 是 `e␣`、`,␣`、`d␣`、`.␣`、`r␣`、`20`、`s␣`、`in`、`on`（␣ 是空格）：空格总是黏在前一个词的尾巴上。再往后：

| token id | 代表的 bytes |
|---|---|
| 309 | `Taylor␣` |
| 337 | `.␣Archived␣from␣the␣original␣on␣` |
| 365 | `Taylor␣Swift` |
| 412 | `).␣"Taylor␣Swift␣` |

整个文本从 185,768 个 byte 压到 78,746 个 token，每个 token 平均 2.36 个 byte。问题在这些 token 跨过了词和 punctuation 的边界：vocabulary 的名额被这篇文章特有的引用格式占掉，而同一个词跟着不同的 punctuation 会变成完全不同的 token（`dog.`、`dog!`、`dog?` 各一个，见 [CS336 第 1 站](../courses/STANFORD-CS336.html#bpe)的讨论）。

同一个 tokenizer 去 encode 别的文本：`Taylor␣Swift` 是 1 个 token；`hello␣there` 是 7 个；`안녕하세요` 是 15 个 byte、15 个 token，训练文本里没有韩文，一个 merge 也用不上。这就是 lecture.md 列的“为什么 LLM 处理非英语更差”的一个直接原因：同样的内容要多花几倍的 token，context 更快被填满，每个 token 能分到的训练也更少。数字也一样：`12345 + 677 = 13022` 被切成 `1`、`23`、`4`、`5`、…、`6`、`7`、`7`、…、`13`、`0`、`22`，切在哪里完全取决于训练文本里哪些数字串常见。lecture.md 用 GPT-2 的 tokenizer 举的例子是 127 是一个 token，677 却是 `␣6` 和 `77` 两个。

### GPT-2 与 GPT-4 的 split pattern

GPT-2 的办法是先用一个 regular expression 把文本切成块，BPE 只在块内合并，块与块之间永远不合并。minbpe 的 `RegexTokenizer` 就是这样：train 时每一块分别数 pair，再把所有块的 count 加起来选 pair；encode 时每一块分别 encode，最后把结果接起来。exercise.md 的第 2 步说，换成 regex 之后再训练，就不会再有跨类别（数字、字母、punctuation、多个空白）的 token。

GPT-4（`cl100k_base`）的 pattern 在 GPT-2 的基础上改了几处：

::fig[z2h-split] 用两个 pattern 切同一段 Python code。

- 数字最多 3 位一块：`\p{N}{1,3}`。GPT-2 的 `␣?\p{N}+` 把 `␣12345` 整个当一块，交给 BPE 去任意地切；GPT-4 固定切成 `123`、`45`。
- 缩写不分大小写：`'(?i:[sdmt]|ll|ve|re)`。GPT-2 的 pattern 只认小写，`HOW'S` 被切成 `HOW`、`'`、`S`；GPT-4 是 `HOW`、`'S`。
- 换行的处理：punctuation 可以带上紧跟的换行（图里的 `:↵`），换行不再和下一行的缩进混成一块。GPT-2 把 `↵` 和 7 个空格切成一块 `↵·······`；GPT-4 是 `:↵` 和单独的 7 个空格。两者都把一串空格的最后一个留给下一个词，所以都有 `␣return`。

图里的切分是用 JavaScript 的 regex 算的，JavaScript 不支持 GPT-4 pattern 里的 possessive quantifier（`?+`、`++`），这里去掉了它们；对这两处来说，后面紧跟的 character class 和前面的不相交，去掉不改变结果。

### Special token，以及逐 token 复现 GPT-4

Special token 不经过 BPE，直接映射到一个固定的 id。GPT-4 的 `<|endoftext|>` 是 100257，用来分隔训练数据里的文档。minbpe 的 README 和 tiktoken 一样，要求 `encode` 时显式传 `allowed_special`，否则遇到这个 string 就报错。README 的理由是安全：如果把用户输入（attacker-controlled data）里的 `<|endoftext|>` 也当成 special token，用户就能伪造文档边界。

exercise.md 的第 3 步要求加载 GPT-4 的 merge，逐 token 复现 tiktoken 的结果，会遇到两个坑。第一，tiktoken 只存了每个 token 的 bytes 和 rank（`_mergeable_ranks`），没有存“由哪两个 token 合成”，要从 rank 反推出 merges，minbpe 的 `gpt4.py` 里有一个 `recover_merges`。第二，GPT-4 的前 256 个 token 不是按 byte 的值排列的，存在一个 permutation，encode 前和 decode 后都要按 `byte_shuffle` 换回来。

:::edge 结尾多一个空格
GPT 的 tokenizer 把空格放在词的前面：` is` 是一个 token（GPT-2 里是 318），空格本身不单独成 token。Prompt 如果以空格结尾，这个空格就只能单独成一个 token，而训练数据里几乎所有空格都和后面的词粘在一起，model 很少见过这种情形，接下来的预测会变差。lecture.md 把 “trailing whitespace 的 warning” 列为 tokenization 引起的现象之一；这里的解释是视频里的讲法，凭记忆。
:::

:::from
BasicTokenizer 和 RegexTokenizer 的结构、`get_stats` 与 `merge`、encode 的 code 和 “subtle” 的注释、`errors="replace"`、`aaabdaaabac` 的例子、Taylor Swift 的测试文件、special token 和 `allowed_special` 的理由、GPT-4 的 pattern、`recover_merges` 和 byte shuffle 都来自 minbpe 的 README、exercise.md 和源码；512 与 1024、50,257、` is` 的 id 318、127 与 677 的例子和怪现象的清单来自 lecture.md（它只写到视频的前半段）。Taylor Swift 上的 merge、压缩比、几个 encode 结果、`aaab` 等三个例子、最长匹配的反例是用 minbpe 的 BasicTokenizer 在本地实际跑的。GPT-2 与 GPT-4 两个 pattern 的切分是用 JavaScript 和 Python 的 regex 在本地跑的近似（Python 的 `re` 不支持 `\p{L}`，用 `[^\W\d_]` 代替，只对 ASCII 文本等价）；本地装不了 tiktoken，没有和它对照。
:::

## 作业

课程没有 autograder，也没有 handout。nn-zero-to-hero 的 README 说每一讲都有写在 YouTube 视频描述里的 exercise，这次没有逐一核对视频描述，下面只写能在仓库里读到的部分。所有作业的做法都一样：开着 notebook，关掉视频，自己从空文件写一遍，卡住了再去看。

### micrograd（backprop 不熟练时先做）

**要从零写什么。** 一个 scalar 的 `Value` class：`+`、`*`、`**`（常数 exponent）、`tanh`、`exp`，以及 `__radd__`、`__rmul__`、`__neg__`、`__sub__`、`__truediv__` 这些让 `2 * a`、`a - b` 能写的反向运算；一个用 topological sort 的 `backward()`；`Neuron`、`Layer`、`MLP` 三个 class；在 4 个 example 上训练。

**做完会什么。** 第 1 站的全部内容；之后看任何 autograd 框架都知道它在每个 op 里存了什么。

**时间与算力。** 视频 2 小时 25 分；自己写估计 3 到 4 小时（调研时的估计）。CPU 即可。

**提示。**

- 每个 `_backward` 里只用 `+=`，并且每个 training step 在 `backward()` 之前把所有 parameter 的 grad 清零。（第 1 站；notebook 里 `exp` 的注释）
- 用 `a + a`、`a * a`、$f=(ab)(a+b)$ 这几个一个变量用两次的 expression 测试，和手算对照。（经验）
- 每写一个 op，就和 PyTorch 用 `.double()` 写的同一个 expression 比较 grad；notebook 后半就是这样核对的。（notebook）
- 写完以后用 centered difference 做 gradient check，relative error 应在 $10^{-7}$ 以下。（CS231n 讲义）
- 想要更多练习，micrograd 仓库自带 `test/test_engine.py`，把同一组 expression 和 PyTorch 逐个比较。（micrograd 仓库）

### makemore part 1 至 3（值得做）

**要从零写什么。** Count 的 bigram、one-hot 加 $W$ 的 bigram、第 2 站的 MLP，以及第 3 站的诊断：initialization loss、activation 与 gradient 的 histogram、update:data ratio，最后加上 BatchNorm。

**做完会什么。** 一个 language model 从 data 到 sample 的完整流程，以及训练出问题时先看哪几个数。

**时间与算力。** 三讲视频合计约 5 小时；CPU 或免费 Colab 都够，MLP 训练 200,000 步在 CPU 上估计几分钟（为这一页用 numpy 重跑，一次约 40 秒）。

**提示。**

- 在训练之前先看第一个 batch 的 loss，和 $\ln27=3.2958$ 比；差得远就先修 initialization，不要急着训练。（第 3 站；CS231n 讲义）
- 每次 broadcasting 之后检查 shape，normalize 之后检查 `P.sum(1)` 是不是全为 1；第 2 站的 bug 在 loss 上看不出来。（第 2 站）
- 第 3 讲的 notebook 在 1000 步时就 `break`，先只看统计图；确认健康后再去掉 `break` 跑完整的 200,000 步。（notebook）
- 评估前把 BatchNorm 设成 `training = False`，用 running 的统计量。（notebook）
- 把每一次改动后的 train / dev loss 记成一张表，就像 notebook 里的 “loss log”，这是比较不同想法的唯一可靠办法。（notebook）

### Becoming a Backprop Ninja（值得做）

**要从零写什么。** README 链接的 Colab 里的 4 个 exercise：逐个中间 tensor 的 backward；cross-entropy 的一次性 backward；BatchNorm 的一次性 backward；用手写的 backward 训练整个 network。

**做完会什么。** 第 4 站的全部内容；以后写自定义 layer、读 kernel 的 backward 时不再怕 shape。

**时间与算力。** 视频 1 小时 55 分；README 建议边做边看、卡住才看答案，估计 4 到 6 小时（调研时的估计）。CPU 或免费 Colab。

**提示。**

- 从 `loss` 往回，严格按 forward 的反序一个个写，每写一个就 `cmp` 一次。错误会被定位到具体的那一行。（notebook）
- 每个 gradient 的 shape 必须和它对应的 tensor 一样；forward 里有 broadcast 的地方，backward 里就要沿那一维 sum（`keepdim=True`）。（第 4 站）
- 一个 tensor 在 forward 里被用了两次（`counts`、`bndiff`、`hprebn`），第二份 gradient 要用 `+=` 加上去。（第 4 站）
- Exercise 3 先在纸上对一个 unit 推，再写成 tensor；推完用 $\sum dx=0$、$\sum dx\,\hat x=0$ 两个检查。（第 4 站）
- Embedding 的 backward 不要写成 `dC[Xb] += demb`，重复的 index 只会加一次。（第 4 站）
- Exercise 1、2 做不到 bit-exact 不一定是错，`allclose` 为 True、最大差在 $10^{-9}$ 量级就可以。（notebook 的注释）

### Let's build GPT（先做）

**要从零写什么。** 从 bigram 出发，依次写出 self-attention head、multi-head、feed-forward、residual 加 projection、LayerNorm、dropout，在 tiny Shakespeare 上训练 character-level GPT 并 sample。之后可以用 nanoGPT 的 `config/train_shakespeare_char.py` 复现。

**做完会什么。** 一个 decoder-only Transformer 的每一行 code；之后读 CS336 Assignment 1 的要求时，只需要关心它和这里的差别（RMSNorm、SwiGLU、RoPE 等，见 [CS336 第 2 站](../courses/STANFORD-CS336.html#arch)）。

**时间与算力。** 视频 1 小时 56 分；跟着写估计 4 小时（调研时的估计）。nanoGPT 的 README：一张 A100 上约 3 分钟到 val loss 1.4697；只有 CPU 时用 `--device=cpu --compile=False` 加上更小的配置（`block_size=64`、`batch_size=12`、4 层、4 个 head、`n_embd=128`、2000 步、`dropout=0.0`），约 3 分钟到 1.88；Apple Silicon 加 `--device=mps`，快 2 到 3 倍。免费 Colab 的 T4 足够跑完整配置。

**提示。**

- 按 git log 的顺序一个组件一个组件地加，每加一个就看 val loss 有没有按上面的表下降；没有降就先别往下加。（ng-video-lecture 的 git log）
- Attention 的 scaling 用 `head_size**-0.5`，不是 `n_embd**-0.5`。（仓库的 “scale by head size” commit）
- `generate` 里要截取最后 `block_size` 个 token，否则 position embedding 会越界。（gpt.py）
- 加上 nanoGPT 里的 `_init_weights`（std 0.02），收敛会快一些；ng-video-lecture 的 README 专门补充了这一点。（README）
- `torch.compile` 在 Windows 等平台不可用，加 `--compile=False` 照样能跑，只是慢一些。（nanoGPT README）
- nanoGPT 的 README 在 2025 年 11 月注明这个仓库已经过时，完整的 pretraining 到 chat 流程请看 nanochat；读 Transformer 本身，这里的 code 仍然最短。（nanoGPT README）

### minbpe exercise（先做）

**要从零写什么。** 按 exercise.md 的 5 步：`BasicTokenizer`（train、encode、decode）；加 GPT-4 split pattern 的 `RegexTokenizer`；加载 GPT-4 的 merges，逐 token 复现 tiktoken；（可选）special token；（可选）改写成在 code point 上做 BPE，复现 Llama 2 的 sentencepiece tokenizer。

**做完会什么。** 第 7 站的全部内容；CS336 Assignment 1 的 BPE 部分只剩性能问题。

**时间与算力。** 视频 2 小时 13 分；exercise 估计 4 到 6 小时（调研时的估计）。CPU 即可；README 说 `train.py` 在 M1 MacBook 上约 25 秒，本地跑 BasicTokenizer（vocabulary 512）是 11 秒。

**提示。**

- 先用 README 里 `aaabdaaabac` 的例子核对：3 次 merge 后 encode 结果是 `[258, 100, 258, 97, 99]`。（README）
- `merge` 从左往右扫，换掉一处就跳过两个位置；不要用 count 去推算替换后的长度。（第 7 站）
- 训练文本先用 `tests/taylorswift.txt`，看学出来的 token 是否跨过了 punctuation；换成 RegexTokenizer 后这种 token 应该消失。（exercise.md）
- GPT-4 pattern 要用 `regex` 库，Python 自带的 `re` 不支持 `\p{L}`。（minbpe 的 `regex.py` 用的就是 `import regex as re`）
- 第 3 步卡在 merges 和 byte shuffle 上时，可以直接参考 `minbpe/gpt4.py` 的 `recover_merges`，exercise.md 允许照抄。（exercise.md）
- 用仓库的 pytest 测试和 tiktoken 的结果对照，要逐 token 一致才算对。（README、tests）
- minbpe 每次 merge 都重算全部 pair count，没有为大文件优化（README 的 todo）。之后做 CS336 Assignment 1 时要改成增量维护 count，并且把 pre-tokenization 并行化，见 [CS336 第 1 站](../courses/STANFORD-CS336.html#bpe)。（README、CS336 handout）

### nanochat（有余力再做）

**要从零写什么。** 这不是本课的作业，是同一作者后来的仓库：一个单机的完整 LLM 流程，包括 tokenizer 训练、pretraining、SFT、RL、evaluation 和 chat 推理。

**做完会什么。** 把这门课的每一块放回一个真实系统里，看它们怎样接在一起。

**时间与算力。** 以下转引自调研条目里对 nanochat README 的摘录，这次没有重读 README：`runs/speedrun.sh` 在 8 张 H100 上约 1.5 小时训练出一个约 100 美元的 d20 model；单卡去掉 `torchrun` 也能得到几乎相同的结果，但要 8 倍时间；`runs/runcpu.sh` 能在 CPU 或 Apple Silicon 上跑一个大幅缩小的版本，README 明说效果不好。免费 Colab 只适合读 code 和跑缩小版。

**提示。**

- 显存小于 80 GB 时，把 `--device-batch-size` 从 32 依次降到 16、8、4、2、1；README 说再往下要改更多东西。（nanochat README，转引自调研条目）
- 把它当作 CS336 五个作业串起来的参考实现来读，比自己从头训练划算。（建议）

