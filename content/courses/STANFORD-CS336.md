---
code: STANFORD-CS336
evidence: syllabus
evidenceNote: "Stanford CS336 Language Modeling from Scratch，Spring 2026 一期（Tatsunori Hashimoto、Percy Liang）。课程网站的 schedule 读的是它在 GitHub 上的源文件（stanford-cs336/stanford-cs336.github.io 的 index.html）；17 讲里有材料的全部读了：可执行讲稿 lecture_01、02、06、07、10、12、13、14、17 读的是 Python 源文件全文，lecture 3、4、5、8、9、11、15、16 的 PDF 抽出了全部文字，并把关键的几十页渲染成图片逐页看过（公式、表格、图里的数字以这些页为准）。五个作业的 2026 版 handout（Version 26.x）读了全文，另读了各仓库的 README、tests 和 A3 的 isoflops_curves.json，以及 speculative decoding 的原论文（Leviathan 等人 2023）里 expected 接受长度的那一节。读不到的：YouTube 录像没有看；两场 guest lecture（Daniel Selsam、Dan Fu）在网站上没有材料；可执行讲稿里要在 GPU 上运行才显示的实测数字（例如 lecture 6 的 GeLU 计时、lecture 7 的 NCCL bandwidth）没有运行，页面上没有用这些数字。"
exam: "无考试。成绩来自五个作业：代码（要过仓库里的 pytest）、writeup，A3 还有一部分分数看最终提交的 model 的实际表现。以当期课程网站为准。"
subskills:
  - id: bpe
    name: Byte-level BPE tokenizer
    l3: "有提示能做：在一个小的 pre-token 计数表上手算 BPE 的 merge，并按 lexicographic 规则处理并列。"
    l4: "能独立做：写出 pair count 的增量更新、按 special token 切分 corpus、按 merge rank encode 新文本，并说出每一步防的是什么。"
    l5: "能讲给别人：从 code point、UTF-8 bytes 到 subword，讲清每一层解决了上一层的哪个问题，以及 BPE training 里真正的时间花在哪里。"
  - id: arch
    name: Transformer LM 与它的现代组件
    l3: "有提示能做：写出 A1 model 每一步的 tensor shape，并数出它的 parameter。"
    l4: "能独立做：实现 RMSNorm、SwiGLU、RoPE、causal multi-head attention 和 pre-norm block，并说出 $d_{ff}=\\tfrac83 d$ 和 weight init 的来历。"
    l5: "能讲给别人：pre-norm、RMSNorm、gating、去掉 bias 各自换来了什么，哪些有理论依据，哪些只是实验结果。"
  - id: account
    name: Resource accounting：FLOPs 与 memory
    l3: "有提示能做：按 $2mnp$ 列出一次 forward 的所有 matmul 并加总。"
    l4: "能独立做：对任意 config 算出 FLOPs 在各部分的份额、训练时每个 parameter 的 byte 数，并用 MFU 估计训练时间。"
    l5: "能讲给别人：为什么 context 变长时 attention 的份额会反超 FFN，以及小 model 为什么离峰值 FLOP/s 很远。"
  - id: train
    name: Training：loss、AdamW、schedule 与稳定性
    l3: "有提示能做：写出数值稳定的 cross-entropy，按 formula 算出 cosine schedule 任意一步的 learning rate。"
    l4: "能独立做：从零实现 AdamW、gradient clipping、data loader 和 checkpoint，并用 overfit 一个 batch 来查 bug。"
    l5: "能讲给别人：decoupled weight decay 和 bias correction 分别修正了 Adam 的什么，warmup 防的是什么，loss 出现 NaN 时依次查哪里。"
  - id: gpu
    name: GPU、kernel 与 FlashAttention
    l3: "有提示能做：算出一个 operation 的 arithmetic intensity，判断它在 H100 上是 compute-bound 还是 memory-bound。"
    l4: "能独立做：手算 online softmax 的两步 recurrence，写出 FlashAttention-2 forward 的 tiled 版本和一个简单的 Triton kernel。"
    l5: "能讲给别人：fusion、tiling、recomputation 各省掉了哪些 HBM 读写，以及 FlashAttention 的 FLOPs 并没有变少却更快的原因。"
  - id: parallel
    name: Parallelism 与 communication cost
    l3: "有提示能做：写出 ring all-reduce 的时间，算出 DDP 和 ZeRO 每个 GPU 每个 parameter 占的 byte 数。"
    l4: "能独立做：推出 data parallel 开始被通信卡住的 per-device batch size，算出 pipeline 的 bubble 比例。"
    l5: "能讲给别人：为什么 ZeRO-1 的通信是“免费”的、tensor parallel 只放在一个 node 里、pipeline parallel 放在 node 之间。"
  - id: scaling
    name: Scaling laws 与 IsoFLOP
    l3: "有提示能做：从一组 IsoFLOP run 里读出每个 compute budget 的最优 model size。"
    l4: "能独立做：fit $N_{\\text{opt}}\\propto C^a$、$D_{\\text{opt}}\\propto C^b$ 并 extrapolate，检查 $a+b=1$。"
    l5: "能讲给别人：这个 fit 对哪些选择敏感、extrapolation 的 error 有多大，以及 compute-optimal 和实际该训练的 model 为什么不同。"
  - id: infer
    name: Inference：KV cache 与 speculative decoding
    l3: "有提示能做：算出一个 model 每个 token 的 KV cache 大小。"
    l4: "能独立做：用“每步读一遍 parameter 和 KV cache”的 model 估计 latency 和 throughput，算出 GQA 的收益。"
    l5: "能讲给别人：decode 为什么是 memory-bound、batch 怎样拿 latency 换 throughput，并 prove speculative decoding 的输出 distribution 恰好是 target model。"
  - id: data
    name: Data：来源、filtering、dedup 与 mixing
    l3: "有提示能做：算两个文档的 n-gram set 的 Jaccard similarity，套用 Gopher 的几条规则。"
    l4: "能独立做：实现 exact line dedup 和 MinHash + LSH，并用 $1-(1-s^r)^b$ 选 band 的 $b$ 和 $r$。"
    l5: "能讲给别人：prove MinHash 的 collision probability 等于 Jaccard similarity，说清每一道 filter 在防什么、threshold 为什么和训练规模有关。"
  - id: align
    name: Post-training：SFT、RLHF 与 GRPO
    l3: "有提示能做：算出 GRPO 一个 group 里每个 response 的 advantage。"
    l4: "能独立做：从 log-derivative trick 推出 policy gradient，prove baseline 不改变 expectation，实现 GRPO 的 loss 和 PPO 式 clipping。"
    l5: "能讲给别人：std normalization 和 length normalization 各引入了什么 bias，Dr. GRPO、RFT、MaxRL 各改了哪一项，以及 GRPO 的 loss 值为什么不能拿来看训练好坏。"
  - id: moe
    name: Attention 的替代与 mixture of experts
    l3: "有提示能做：写出 linear attention 的 recurrent form，算出 top-k routing 一个 token 的 gate，套用 Switch 的 balancing loss。"
    l4: "能独立做：比较 quadratic attention 与 linear attention 的 FLOPs 和 state 大小，算出一个 MoE 的总 parameter 与 active parameter，说出 aux-loss-free balancing 怎样更新 bias。"
    l5: "能讲给别人：gating 和 delta rule 各给 linear attention 加了什么，MoE 为什么同样的 FLOPs 能放更多 parameter，以及它在训练稳定性、fine-tuning 和系统上各付出什么代价。"
  - id: eval
    name: Evaluation
    l3: "有提示能做：从 token probability 算 perplexity，用 Elo formula 算两个 model 的胜率。"
    l4: "能独立做：说出 MMLU、GPQA、Chatbot Arena、AlpacaEval、SWE-bench、ARC-AGI 各测什么、怎么打分、各有什么 bias。"
    l5: "能讲给别人：从 abstract construct 到 concrete metric 会丢掉什么，train-test overlap 有哪几条应对路线，以及评估 method 和评估 model 的区别。"
  - id: mm
    name: Multimodal models
    l3: "有提示能做：写出 CLIP 的 symmetric cross-entropy，在一个小的 similarity matrix 上算出 loss。"
    l4: "能独立做：说出 vision encoder、projector、LM 的标准结构，算出一张图在 CLIP、Qwen2-VL、Chameleon 里各变成多少个 token。"
    l5: "能讲给别人：contrastive 与 sigmoid loss 在 batch size 上的差别，理解与生成为什么对 encoder 的要求不同，以及多模态训练的稳定性问题从哪里来。"
open:
  - label: "Stanford CS336 Spring 2026 课程网站（lecture 列表、材料链接、作业、AI policy）"
    url: "https://cs336.stanford.edu"
    note: "各站对应哪一讲以这里的 schedule 为准。网站本身没有抓到，读的是它的源文件 github.com/stanford-cs336/stanford-cs336.github.io。"
  - label: "stanford-cs336/lectures：可执行讲稿 lecture_01、02、06、07、10、12、13、14、17 与 lecture 3、4、5、8、9、11、15、16 的 PDF"
    url: "https://github.com/stanford-cs336/lectures"
    note: "每一站的主要讲法来源。Python 讲稿读的是源文件全文；PDF 抽出了全部文字，公式和表格所在的页渲染成图片看过。"
  - label: "Leviathan, Kalman, Matias 2023：Fast Inference from Transformers via Speculative Decoding（ar5iv 版）"
    url: "https://ar5iv.labs.arxiv.org/html/2211.17192"
    note: "第 8 站 expected 接受长度和 walltime 加速的 formula，读的是第 3 节。"
  - label: "Assignment 1（basics）handout，Version 26.0.3，以及仓库里的 tests"
    url: "https://github.com/stanford-cs336/assignment1-basics"
    note: "第 1 至 4 站。全文读过。"
  - label: "Assignment 2（systems）handout，Version 26.1.3"
    url: "https://github.com/stanford-cs336/assignment2-systems"
    note: "第 3、5、6 站。全文读过，第 8 节的 parallelism 计算题只读了题目，页面上没有给答案。"
  - label: "Assignment 3（scaling）handout，Version 26.0.5，以及 data/isoflops_curves.json"
    url: "https://github.com/stanford-cs336/assignment3-scaling"
    note: "第 7 站的全部数据。全文读过，包括 training API 的说明。"
  - label: "Assignment 4（data）handout，Version 26.0.1"
    url: "https://github.com/stanford-cs336/assignment4-data"
    note: "第 9 站。全文读过。"
  - label: "Assignment 5（alignment）handout，Version 26.0.0，以及 safety / RLHF supplement"
    url: "https://github.com/stanford-cs336/assignment5-alignment"
    note: "第 10 站。主 handout 与 supplement 都读了全文。"
---

先看三个数。

**第一个。** A1 在 TinyStories 上训练的 model 不算 input embedding 有 1758 万个 parameter，要处理 3.28 亿个 token，总计算量约 $3.7\times10^{16}$ 次 floating-point operation。一块 B200 的 bf16 峰值是每秒 $2.25\times10^{15}$ 次，16 秒就能算完。Handout 说实际要 20 到 30 分钟。

**第二个。** 一个 GPT-2 XL 大小的 model，context 从 1024 个 token 拉长到 16384 个，token 多了 16 倍，一次 forward 的计算量多了 38 倍；attention 在里面的份额从 9% 变成 62%。

**第三个。** 花同样多的 compute 训练两个 model：一个 parameter 多、看的 token 少，另一个反过来。A3 给的一组 synthetic 数据里，同一个 compute budget 下最好和最差的配置 loss 能差 1 以上（per-token cross-entropy 差 1，相当于 perplexity 差 $e$ 倍）。

这门课把 language model 的每一层都从零写一遍：tokenizer、model、optimizer、training loop、GPU kernel、多卡训练、scaling law、数据清洗、post-training。贯穿全课的是一个问题：给定 compute 和 memory，怎样得到最好的 model。所以每学一样东西都要问它要多少 FLOPs、占多少 byte、在硬件上是被计算卡住还是被搬数据卡住。第一个数在第 3、5 站得到解释，第二个在第 3 站，第三个在第 7 站。

| 站 | 内容 | 对应 lecture | 对应作业 |
|---|---|---|---|
| 1 | Byte-level BPE | 1 | A1 |
| 2、3、4 | Model、resource accounting、training | 2、3 | A1 |
| 5、6 | GPU 与 kernel、多卡 parallelism | 5、6、7、8 | A2 |
| 7 | Scaling laws | 9、11 | A3 |
| 8 | Inference | 10 | （A5 的 rollout 用到） |
| 9 | Data：来源、filtering、dedup、mixing | 13、14 | A4 |
| 10 | Post-training | 15、16 | A5 |
| 11 | Attention 的替代与 MoE | 4 | （无） |
| 12 | Evaluation | 12 | （A5 的 GSM8K、supplement 的 AlpacaEval 等用到） |
| 13 | Multimodal models | 17 | （无） |

第 11 至 13 站按 schedule 本该分别插在 lecture 3、11、16 之后。放到最后，是因为 lecture 4 里的 linear attention 和 MoE 要用到第 6 站的 expert parallel、第 8 站的 KV cache，evaluation 和 multimodal 则不影响任何一个作业。两场 guest lecture（lecture 18、19）在课程网站上没有材料，这一页没有对应的内容。

这一页假定读者已经懂 Transformer 的基本运算。Attention 的 formula、$\sqrt{d_k}$ 的来历、RoPE 为什么只依赖相对位置、$6ND$ 的推导、Chinchilla parametric fit 的最优解、DPO 的推导，都在 [CS4248 的页面](../courses/CS4248.html)里一步步写过，这里用到时只给链接，篇幅留给 CS336 自己的东西：实现细节、资源的账、以及作业里会卡住的地方。

只有十几个小时时的路线：第 1、2、3、5、7、10 站必读，加上第 4 站里 A1 要用的部分；第 6、8、9、11、12、13 站可以先跳，每站开头写了跳过的代价。

## [bpe] Byte-level BPE tokenizer

:::skip
已经会手算 BPE 的 merge（[CS4248 第 1 站](../courses/CS4248.html#token)），并且能说出 merge 之后为什么只需更新与被合并 pair 重叠的那几个 count、pre-tokenization 和 special token 各防什么，就可以去第 2 站。快速路线必读：A1 的第一部分直接依赖这一站。
:::

### Character、byte、word：三种切法各坏在哪

Model 只吃 integer sequence，tokenizer 要在 string 和 integer 之间来回转换（encode、decode），而且 decode(encode(s)) 必须等于 s。Lecture 1 用同一个 string `"Hello, 🌍! 你好!"` 比较三种最直接的做法，衡量的量是 compression ratio：每个 token 平均对应多少个 UTF-8 byte。它越大，同一段文本的 sequence 越短，而 attention 的代价随 sequence length 平方增长（第 3 站）。

这个 string 有 13 个 character，UTF-8 encode 之后是 20 个 byte：`Hello, ` 和两个 `!`、两个空格各 1 个 byte，🌍 占 4 个，“你”“好”各占 3 个，$7+1+1+4+1+1+3+3=20$。

- **Character tokenizer**：每个 character 取它的 code point（`ord("a")` 是 97，`ord("🌍")` 是 127757）。13 个 token，compression ratio 是 $20/13=1.54$。Vocabulary 至少要覆盖所有 code point，Unicode 17.0 定义了 159,801 个 character（A1 handout 的数），其中大多数几乎不出现，分给它们的 embedding row 学不到东西。Lecture 的评价是 vocabulary 又大、压缩又差，两头都坏。
- **Byte tokenizer**：直接用 UTF-8 的 20 个 byte。Vocabulary 只有 256 个，任何输入都能表示；compression ratio 恰好是 1，sequence 最长。
- **Word tokenizer**：用 regex `\w+|.` 切。`"I'll say supercalifragilisticexpialidocious!"` 是 44 个 byte，切成 `I`、`'`、`ll`、` `、`say`、` `、`supercalifragilisticexpialidocious`、`!` 共 8 个 token，compression ratio 是 5.5。代价是 vocabulary 等于训练数据里不同 word 的个数，没有上限；罕见的 word 学不好；训练时没见过的 word 只能映射成 `UNK`，而 `UNK` 的 probability 让 perplexity 的计算失去意义。

BPE 取中间：从 byte 出发保证什么都能表示，再把常见的 byte 串合并成一个 token，让常见的文本压缩得好、罕见的文本退回到 byte。Lecture 1 的说法是“data-driven 的 heuristic”：vocabulary 是在数据上 train 出来的。

### 从 bytes 出发

UTF-8 把每个 character 编成 1 到 4 个 byte，于是任何 string 都是 0 到 255 之间的 integer sequence。代价是非 ASCII 的文本 sequence 变长：handout 的例子 `"hello! こんにちは!"` 有 13 个 character，UTF-8 之后是 23 个 byte，每个日文假名占 3 个 byte。

Byte-level BPE 从这 256 个 byte 出发，反复把最常见的相邻 pair 合成一个新 token。A1 在 TinyStories 上要求 vocabulary 大小 10,000：256 个 byte、1 个 special token `<|endoftext|>`，剩下 $10000-256-1=9743$ 次 merge。Vocabulary 不超过 65,535，所以 encode 之后的 token ID 存成 `uint16`，每个 token 2 个 byte。

一个后果要记住：token 是 byte string，不一定是完整的 character。“こ”是 `e3 81 93` 三个 byte，如果某个 token 恰好只含 `e3 81`，单独 decode 它就不是合法的 UTF-8。所以 decode 时要用 `bytes.decode("utf-8", errors="replace")`，把坏掉的 byte 换成 U+FFFD。

### Pre-tokenization：先切块，再在块里 merge

Lecture 1 的玩具实现直接在整段 byte sequence 上 train。对 `"the cat in the hat"` 做 3 次 merge：第一次 `t h`、`h e`、`e ␣`、`a t` 都出现 2 次，并列，讲稿用 `max(counts, key=counts.get)`，取最先数到的 `t h`；之后依次合并 `th e` 和 `the ␣`。第三个 merge 得到的 token `"the "` 把一个词和它后面的空格粘在了一起，18 个 byte 变成 12 个 token：`the␣`、`c`、`a`、`t`、`␣`、`i`、`n`、`␣`、`the␣`、`h`、`a`、`t`。

这暴露了两个问题。第一，merge 会跨过词的边界，学出“词尾加空格”“词加标点”这种组合：`dog!` 和 `dog.` 会被各自合成不同的 token，vocabulary 浪费在同一个词的不同标点上。第二，在整个 corpus 的 byte sequence 上数 pair，每次 merge 都要扫一遍全部文本。（讲稿的并列规则也和 A1 不同：A1 要求取 lexicographically greater 的 pair，见下文。）所以先用一个 regular expression 把文本切成 pre-token，merge 只在 pre-token 内部发生。A1 用 GPT-2 的 pattern（handout 给出的版本）：

```python
PAT = r"""'(?:[sdmt]|ll|ve|re)| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+"""
```

它把 `"some text that i'll pre-tokenize"` 切成 `['some', ' text', ' that', ' i', "'ll", ' pre', '-', 'tokenize']`。注意空格跟着后面的词走，所以 `' text'` 和 `'text'` 是两个不同的 pre-token。

切完之后，相同的 pre-token 只需要记一次，再记它出现了几次。整个 corpus 变成一张表：key 是 pre-token 的 byte tuple，value 是次数。之后所有的 merge 都在这张表上做，表的大小是“不同 pre-token 的个数”，远小于 corpus 长度。

### 数 pair，以及并列时选谁

用 handout 里 Sennrich 等人的例子（为了看清 merge，这里 pre-tokenization 就按空格切）：`low` 5 次、`lower` 2 次、`widest` 3 次、`newest` 6 次。一共 $5\times3+2\times5+3\times6+6\times6=79$ 个 byte token。每个 pair 的 count 等于它在各个 pre-token 里出现的次数乘上该 pre-token 的次数，再加起来。`e s` 出现在 `widest`（3 次）和 `newest`（6 次）里，count 是 9：

| pair | `e s` | `s t` | `w e` | `l o` | `o w` | `n e` | `e w` | `w i` | `i d` | `d e` | `e r` |
|---|---|---|---|---|---|---|---|---|---|---|---|
| count | 9 | 9 | 8 | 7 | 7 | 6 | 6 | 3 | 3 | 3 | 2 |

`e s` 和 `s t` 并列第一。A1 规定并列时取 lexicographically greater 的 pair，也就是 Python 的 `max` 对 tuple 的比较：先比第一个 element，`s` 大于 `e`，所以选 `(s, t)`。这条规则不是装饰，tests 会逐条比对你的 merge 顺序，并列时选错一次，后面全都对不上。

继续做下去，前 12 次 merge 是 `s t`、`e st`、`o w`、`l ow`、`w est`、`n e`、`ne west`、`w i`、`wi d`、`wid est`、`low e`、`lowe r`，和 handout 一致。每次 merge 之后 token 总数减少的量恰好是被合并 pair 的 count：$79\to70\to61\to54\to47\to41\to35$，依次减去 9、9、7、7、6、6。

::fig[cs336-bpemerges] 四个 pre-token 在 0、2、4、6、9、12 次 merge 之后的切分。右边是按次数加权的 token 总数。

### Merge 之后，只有少数 count 会变

朴素的实现每次 merge 后重新数一遍所有 pair。设不同 pre-token 的总长度是 $S$，要做 $M$ 次 merge，代价是 $M\times S$。TinyStories 上 $M=9743$，OpenWebText 上要 32,000 次，这样做远超 handout 给的时间。

看一次 merge 实际改变了什么。设某个 pre-token 里有一段 $\dots x\,A\,B\,y\dots$，把 $(A,B)$ 合成 $AB$ 之后变成 $\dots x\,AB\,y\dots$。消失的 pair 是 $(x,A)$、$(A,B)$、$(B,y)$，新出现的是 $(x,AB)$、$(AB,y)$。别处的 pair 一个都没动。所以只要知道“哪些 pre-token 含有 $(A,B)$”，就只需改这些 pre-token，并且只改这几个 count。

在例子里合并 `s t`：含有它的只有 `widest` 和 `newest`。`(e,s)` 减 $3+6=9$，`(s,t)` 减 9，新出现 `(e,st)` 加 9；`(d,e)`、`(w,e)` 这些 pair 虽然也在这两个词里，但不和 `s t` 相邻重叠，不变。11 个 count 里只动了 2 个，另加 1 个新的。

::fig[cs336-bpeindex] 合并 `s t` 时，四个 pre-token 里只有两个被改写；pair count 表里只有与 `s t` 相邻重叠的项变化。

实现上要维护两样东西：pair 到 count 的表，以及 pair 到“含有它的 pre-token 的 set”的反向索引。每次 merge 从反向索引取出要改的 pre-token，对每个 pre-token 先把它旧的 pair 全部减掉，改写之后再把新的 pair 全部加上，最后更新反向索引。这样写不容易漏掉重叠的情形（例如 `a a a` 合并 `a a`）。

:::wrong 找最大的 pair 用一个 heap 就行，pop 出来就是答案
Heap 按 count 排序没问题，难在并列时要取 lexicographically greater 的 pair，而 Python 的 `heapq` 是 min-heap：count 可以取负号，bytes tuple 却没法简单取反，直接把 `(-count, pair)` 放进去，并列时 pop 出来的是 lexicographically smaller 的那个，正好选反。另外 count 一直在变，heap 里会留下过期的条目，pop 出来时要和当前的 count 核对。对 TinyStories 这个规模，不同 pair 只有几万个，每次 merge 直接对 count 表做一次 `max(counts, key=lambda p: (counts[p], p))` 往往已经够快；先用 cProfile 看清瓶颈再决定要不要上 heap。
:::

### Special token 与并行的 pre-tokenization

`<|endoftext|>` 标出文档的 boundary。Training 时它是硬 boundary：先按 special token 把文本切开（`re.split`，pattern 是用 `|` 连起来的 `re.escape` 过的 special token），每一段分别做 pre-tokenization，special token 本身不参与任何 pair 的计数。否则 merge 会跨过文档 boundary，学出“上一篇的结尾加下一篇的开头”这种 token。Special token 直接加进 vocabulary，有固定的 ID。

TinyStories 有 212 万篇文档。Pre-tokenization 是 regex 匹配，可以并行：把文件切成几块，每块分给一个 process。切点必须落在 `<|endoftext|>` 的开头，这样每块都是完整的文档，结果和不切完全一样。Handout 提供了找切点的 starter code，并给了一个目标：用 multiprocessing 做 pre-tokenization，整个 BPE training 可以在 2 分钟以内。Merge 那一步在 Python 里没法并行。

### Encode：按 merge 的创建顺序

Encode 新文本时重复 training 的前半段：先按 special token 切，再 pre-tokenize，每个 pre-token 拆成 byte，然后按 merge 的**创建顺序**把能用的 merge 用上去。Handout 的例子：vocabulary 是 `{0:' ', 1:'a', 2:'c', 3:'e', 4:'h', 5:'t', 6:'th', 7:' c', 8:' a', 9:'the', 10:' at'}`，merge 依次是 `(t,h)`、`( ,c)`、`( ,a)`、`(th,e)`、`( a,t)`。`'the cat ate'` 切成 `'the'`、`' cat'`、`' ate'`：

- `t h e`：第一条 `(t,h)` 适用，得 `th e`；再找，`(th,e)` 适用，得 `the`。ID 是 `[9]`。
- ` c a t`：`( ,c)` 适用，得 ` c a t`，之后没有 merge 适用。ID 是 `[7, 1, 5]`。
- ` a t e`：`( ,a)` 得 ` a t e`，`( a,t)` 得 ` at e`。ID 是 `[10, 3]`。

结果 `[9, 7, 1, 5, 10, 3]`。

逐条扫全部 merge 太慢（lecture 1 的玩具实现就是这样，并注明作业要“只 loop 用得上的 merge”）。通常的做法是给每条 merge 一个 rank（创建的序号），在当前 pre-token 的所有相邻 pair 里找 rank 最小的那个合并，重复到没有可合并的 pair 为止。同一个 pre-token 在文本里会反复出现，encode 结果可以 cache。

A1 的 tests 拿你的 tokenizer 加载 GPT-2 的 vocabulary 和 merges，逐个比对 tiktoken 的输出，所以 encode 的每个细节都要和 GPT-2 一致。还有一个 test 同时注册 `<|endoftext|>` 和 `<|endoftext|><|endoftext|>`，要求后者被识别成一个 token：按 special token 切分时，要先尝试更长的那个。

:::edge 放不进 memory 的文件
`encode_iterable` 接受一个逐行产出 string 的 iterable（例如打开的文件），边读边 yield token ID。tests 用 1 MB 的 memory 上限跑它，所以不能先把整个文件读进来。难点在块与块的接缝：handout 要求 token 不跨过 chunk 的 boundary，否则结果会和整段一起 encode 不同。逐行切看起来自然，但 GPT-2 regex 里的 `\s+(?!\S)` 会把换行和后面的空格连成一个 pre-token：`"a\n  b"` 整段切是 `'a'`、`'\n '`、`' b'`，按行分成 `"a\n"` 和 `"  b"` 再切，就成了 `'a'`、`'\n'`、`' '`、`' b'`。所以接缝处要留意，例如把每块末尾的空白挪到下一块开头再切。（这个例子是我用 handout 的原 pattern 在 JavaScript 的 Unicode regex 里跑出来的；Python 标准库的 `re` 不支持 `\p{L}`，handout 建议用 `regex` 这个 package，并提醒 GPT-2 的 pattern 在多数 regex engine 里都很慢。）
:::

:::from
Character、byte、word 三种 tokenizer 的比较、compression ratio 的定义、`"Hello, 🌍! 你好!"` 和 `supercalifragilisticexpialidocious` 两个例子、`"the cat in the hat"` 的玩具 BPE、“玩具实现逐条扫 merge，作业要只 loop 用得上的”，来自 [lecture 1](http://cs336.stanford.edu/lectures/?trace=lecture_01) 的讲稿（compression ratio 和 merge 的结果讲稿要运行才显示，这里的数是我按讲稿的代码在 Python 里重算的）。Unicode 的数字、UTF-8 的例子、pre-tokenization 的两个理由、GPT-2 regex、Sennrich 的例子和它的 12 次 merge、lexicographic tie-breaking、增量更新的思路、special token 的处理、并行 pre-tokenization 和“2 分钟”的目标、encode 的例子，来自 [A1 handout](https://github.com/stanford-cs336/assignment1-basics) 第 2 节。tiktoken 比对、overlapping special token、1 MB memory 上限是我读 A1 仓库的 `tests/test_tokenizer.py` 看到的。Token 数的递减、每次 merge 只改 2 个 count 的核对是我用 Python 实际跑的；反向索引、先减后加的写法、heap 并列选反的陷阱是我自己的经验，不是 handout 写的。
:::

## [arch] Transformer LM 与它的现代组件

:::skip
能写出 A1 model 每一步的 tensor shape、数出 parameter，并说出 pre-norm、RMSNorm、SwiGLU、RoPE、去掉 bias 各自换来了什么，就可以去第 3 站。快速路线必读（Lecture 3）。Attention 本身（$QK^\top/\sqrt{d_k}$、causal mask、RoPE 只依赖相对位置的 proof、multi-head 的 dimension）在 [CS4248 第 6 站](../courses/CS4248.html#attn)。
:::

### 从 token ID 到 logits：每一步的 shape

Lecture 3 开头列出 A1 要写的 model 和 2017 年的原始 Transformer 的四处不同：normalization 放在每个 sublayer 前面（pre-norm），position 用 RoPE，FFN 用 SwiGLU 而不是 ReLU，linear layer 和 normalization 都没有 bias。Normalization 具体用的是 RMSNorm，它既去掉 bias，也不减 mean，代替了 LayerNorm。下面先把 shape 走一遍，再逐个看这些选择。

用 handout 给 TinyStories 的 config：vocabulary $V=10000$，context $T=256$，$d=512$，$d_{ff}=1344$，4 层，16 个 head，所以每个 head 的 $d_k=512/16=32$。

1. 输入是 integer tensor，shape `(B, T)`。Embedding 就是按 ID 取 matrix 的 row，得到 `(B, T, 512)`。
2. 每个 block：先 RMSNorm；乘 $W_Q,W_K,W_V$（各 $512\times512$）得到三个 `(B, T, 512)`，拆成 16 个 head 变成 `(B, 16, T, 32)`；对 $q,k$ 做 RoPE；算 scores `(B, 16, T, T)`，causal mask，softmax，乘 $V$ 得 `(B, 16, T, 32)`，拼回 `(B, T, 512)`，乘 $W_O$；加回 residual。然后再 RMSNorm，进 SwiGLU：$W_1,W_3$ 把 512 升到 1344，element-wise 运算之后 $W_2$ 降回 512；再加回 residual。
3. 4 个 block 之后，最后一个 RMSNorm，乘 LM head（$10000\times512$）得 logits `(B, T, 10000)`。

::fig[cs336-lm] A1 的 model 在 TinyStories config 下的数据流和 parameter 数。Block 内部的 shape 不变，始终是 `(B, T, 512)`；只有 attention 中间出现 `(B, 16, T, T)`。

数 parameter：

| 部分 | shape | parameter 数 |
|---|---|---|
| Token embedding | $10000\times512$ | 5,120,000 |
| 每层 $W_Q,W_K,W_V,W_O$ | $4\times(512\times512)$ | 1,048,576 |
| 每层 $W_1,W_3$ | $2\times(1344\times512)$ | 1,376,256 |
| 每层 $W_2$ | $512\times1344$ | 688,128 |
| 每层两个 RMSNorm 的 gain | $2\times512$ | 1,024 |
| 4 层合计 | | 12,455,936 |
| Final RMSNorm | 512 | 512 |
| LM head | $10000\times512$ | 5,120,000 |
| 总计 | | 22,696,448 |

不算 input embedding 是 17,576,448，这就是 handout 说的“约 17M non-embedding parameters”。这么小的 model 里，embedding 和 LM head 合起来占了 45%；model 变大时 $d^2$ 的项增长得快，这个比例会迅速下降（第 3 站 GPT-2 XL 里只占 10%）。

Linear layer 的存法：A1 要求存 $W\in\mathbb R^{d_{\text{out}}\times d_{\text{in}}}$，数学上写 column vector 的 $y=Wx$；PyTorch 是 row-major，batch dimension 在前，所以实现是 $Y=XW^\top$。用 einsum 写成 `einsum(x, W, "... d_in, d_out d_in -> ... d_out")`，前面的 `...` 吃掉任意多个 batch dimension（tests 对 attention 既测 3 维也测 4 维的 input）。

Initialization 按 handout：linear 的 weight 取 $\mathcal N\big(0,\tfrac{2}{d_{\text{in}}+d_{\text{out}}}\big)$ 并截断在 $\pm3\sigma$，$512\to512$ 时 $\sigma=\sqrt{2/1024}=0.0442$；embedding 取 $\mathcal N(0,1)$ 截断在 $\pm3$；RMSNorm 的 gain 全取 1。

### Pre-norm：residual stream 上不放 normalization

两种 block 的写法（A1 第 7.3 节）：

$$\text{post-norm:}\quad z=\mathrm{Norm}\big(x+\mathrm{Attn}(x)\big),\qquad y=\mathrm{Norm}\big(z+\mathrm{FFN}(z)\big)$$

$$\text{pre-norm:}\quad z=x+\mathrm{Attn}\big(\mathrm{Norm}(x)\big),\qquad y=z+\mathrm{FFN}\big(\mathrm{Norm}(z)\big)$$

Pre-norm 里，从 embedding 到最后一层，主干上只有加法。把 $L$ 层展开：

$$x_L=x_0+\sum_{l=0}^{L-1}F_l\big(\mathrm{Norm}(x_l)\big),\qquad \frac{\partial x_L}{\partial x_0}=I+\sum_{l}\frac{\partial F_l(\mathrm{Norm}(x_l))}{\partial x_0}$$

第一项是 identity matrix，不管多少层，gradient 都有一条原样传回 embedding 的路。Post-norm 里每一层的输出都要过一次 Norm，传到 $x_0$ 的每条路都要连乘 $L$ 个 Norm 的 Jacobian。Lecture 3 引的两篇论文分别报告了 post-norm 的 gradient attenuation（Xiong 2020）和 gradient spike（Salazar 与 Nguyen 2019）；slides 上 Xiong 的图里，IWSLT 翻译和 BERT 两个任务上 Pre-LN 的 validation loss 都比 Post-LN 降得快，且不用 warmup 也能训。原本宣称的好处是可以不用 learning-rate warmup，现在大家用它是为了大 model 训练稳定、能用更大的 learning rate。几乎所有现代 LM 都用 pre-norm（BERT 是 post-norm；lecture 提到 OPT-350M 是个说不清原因的 post-norm 例外）。这些是实验结论，这一页没有推导它。

Lecture 3 还讲了一个较新的变体：既然把 Norm 放在 residual stream 上不好，那就在 sublayer 的输出上、加回 residual 之前再做一次 Norm，主干仍然只有加法：

$$z=x+\mathrm{Norm}\big(\mathrm{Attn}(\mathrm{Norm}(x))\big)$$

前后各一个叫“double norm”（Grok、Gemma 2），OLMo 2 只保留后面那个，叫 non-residual post-norm。两者都满足“residual stream 上不放 normalization”这条共识。

Pre-norm 也带来一件必须处理的事：主干上没有任何东西控制 scale。粗略估计一下，如果每个 sublayer 往 residual stream 加一个 rms 约为 1、与已有内容无关的 vector，加了 $2L$ 次之后 rms 约为 $\sqrt{1+2L}$：4 层是 3，48 层是 9.8。直接把它送进 LM head，logits 的 scale 就随深度变化。所以 pre-norm 在最后一个 block 之后要再加一个 Norm，A1 的 final RMSNorm 就是这个作用。

### RMSNorm

LayerNorm 对一个 token 的 $d$ 个数减去 mean、除以 standard deviation，再乘 gain、加 bias。RMSNorm 只做一半：

$$\mathrm{RMSNorm}(a)_i=\frac{a_i}{\mathrm{RMS}(a)}\,g_i,\qquad \mathrm{RMS}(a)=\sqrt{\frac1d\sum_{i=1}^da_i^2+\varepsilon}$$

取 $a=(1,2,3,4)$，$g=1$：$\mathrm{RMS}=\sqrt{30/4}=2.739$，输出 $(0.365,\,0.730,\,1.095,\,1.461)$。LayerNorm 会先减去 mean 2.5，输出 $(-1.342,\,-0.447,\,0.447,\,1.342)$。RMSNorm 不把 vector 移到 mean 为 0，只调 scale；parameter 也只有 $d$ 个 gain，没有 bias。

A1 要求在 square 之前把输入转成 float32，算完再转回原来的 dtype。理由是 fp16 能表示的最大数是 65,504：某个 activation 是 300 时，$300^2=90000$ 已经 overflow 成 `inf`，RMS 变成 `inf`，整行输出变成 0。

:::wrong RMSNorm 比 LayerNorm 快，是因为它省了 FLOPs
在 TinyStories config 里每个 token 一次 forward 的 matmul 约 3700 万次 FLOP（第 3 站算）；9 个 RMSNorm 每个约 $3d\approx1500$ 次，合计约 1.4 万次，占 0.04%。省掉 mean 的那部分更是微不足道。Lecture 3 引 Ivanov 等人 2023 对一个 BERT 式 Transformer 的实测：tensor contraction（matmul）占 99.80% 的 FLOPs、61.0% 的运行时间；statistical normalization 只占 0.17% 的 FLOPs，却占 25.5% 的运行时间；element-wise operation 占 0.03% 的 FLOPs、13.5% 的运行时间。也就是说 FLOPs 不等于运行时间。Normalization 每读写一个数只做几次运算，是 memory-bound 的（第 5 站），它的运行时间由搬多少 byte 决定；RMSNorm 少一次 reduction、少一组 parameter 要搬，省下的是这部分。去掉 linear layer 的 bias 也是同样的理由（memory）加上 optimization 稳定性。
:::

### SwiGLU，以及 $d_{ff}=\tfrac83d$ 的来历

原始 Transformer 的 FFN 是 $W_2\,\mathrm{ReLU}(W_1x)$，中间的 dimension 是 $4d$。SwiGLU 把它换成

$$\mathrm{FFN}(x)=W_2\big(\mathrm{SiLU}(W_1x)\odot W_3x\big),\qquad \mathrm{SiLU}(x)=x\,\sigma(x)=\frac{x}{1+e^{-x}}$$

SiLU 在正半轴接近 identity，负半轴不是直接截成 0：$\mathrm{SiLU}(-1)=-0.269$，$\mathrm{SiLU}(-5)=-0.034$，$\mathrm{SiLU}(1)=0.731$，$\mathrm{SiLU}(2)=1.762$。$\odot$ 是 element-wise 乘法：$W_3x$ 这一支提供 linear 的值，另一支决定每个 dimension 放行多少，这叫 gating。

多了一个 $W_3$，parameter 就多了。为了和原来的 FFN 一样大，让两者的 parameter 数相等：

$$3\,d\,d_{ff}=2\,d\,(4d)\quad\Longrightarrow\quad d_{ff}=\frac83d$$

$d=512$ 时 $\tfrac83d=1365.3$。再取最近的 64 的倍数（matrix 的 dimension 是 64 的倍数时 GPU 的 tensor core 用得满）：$1344=21\times64$ 差 21.3，$1408$ 差 42.7，取 1344，正是 handout 给的值。GPT-2 XL 的 $d=1600$：$\tfrac83d=4266.7$，最近的是 $4288=67\times64$。

为什么 gating 更好，lecture 3 给的是证据而不是理由：Shazeer 2020 和 Narang 等人 2020 的实验里 GLU 一类结构稳定地更好，2023 年以后的大多数 model 都用它。A1 handout 引了 Shazeer 的原话，把成功归于“divine benevolence”。A1 的 ablation 让你自己比较 SwiGLU 和 parameter 数相当的 SiLU FFN（$d_{ff}=4d$）。

### Serial 还是 parallel 的 block

上面的 block 是 serial 的：先 attention，再把结果加回去，FFN 看到的是更新过的 $z$。GPT-J、PaLM、GPT-NeoX 用 parallel layer，让两个 sublayer 看同一个输入：

$$y=x+\mathrm{Attn}\big(\mathrm{Norm}(x)\big)+\mathrm{FFN}\big(\mathrm{Norm}(x)\big)$$

两个分支共用一个 Norm，而且 $W_Q,W_K,W_V$ 和 FFN 的 $W_1,W_3$ 都乘同一个 $\mathrm{Norm}(x)$，可以拼成一个大 matrix 一次乘完（lecture 3 的说法是“LayerNorm can be shared, and matrix multiplies can be fused”）。Lecture 列的近期例子有 Cohere Command A、Falcon 2 11B；多数 model 仍用 serial。

### RoPE 的实现

RoPE 把 $q$、$k$ 的 dimension 两两配对，每对看成 plane 上的一个点，在位置 $i$ 转一个角度。第 $k$ 对（$k=1,\dots,d_k/2$）在位置 $i$ 的角度是

$$\theta_{i,k}=i\cdot\Theta^{-(2k-2)/d_k}$$

$\Theta=10000$，$d_k=32$。第 1 对每过一个 token 转 1 radian，转一圈要 $2\pi\approx6.3$ 个 token；第 16 对每个 token 转 $10000^{-30/32}$ radian，转一圈要约 35,000 个 token。前面的 dimension 分辨相邻几个 token，后面的 dimension 分辨很远的距离。为什么转过之后 score 只依赖 $j-i$，见 CS4248 第 6 站。

::fig[cs336-rope] $\Theta=10000$、$d_k=32$ 时各对 dimension 的转速。

实现上不要真的造一个 $d_k\times d_k$ 的 block-diagonal matrix。对每一对 $(x_{2k-1},x_{2k})$ 直接算

$$x'_{2k-1}=x_{2k-1}\cos\theta_{i,k}-x_{2k}\sin\theta_{i,k},\qquad x'_{2k}=x_{2k-1}\sin\theta_{i,k}+x_{2k}\cos\theta_{i,k}$$

每对 4 次乘法、2 次加法。$\cos$ 和 $\sin$ 只依赖位置和 $k$，在 `__init__` 里预先算成 `(max_seq_len, d_k/2)` 的表，用 `register_buffer(persistent=False)` 存起来（它不是要学的 parameter，也不必写进 checkpoint），forward 时按 `token_positions` 取出对应的 row。所有层、所有 head 共用这一张表。RoPE 只作用在 $q$ 和 $k$ 上，不作用在 $v$ 上；head 这个 dimension 当作 batch dimension，每个 head 转同样的角度。

### Hyperparameter：几个出人意料的共识

:::skip
不影响 A1 的实现（A1 的 config 是给定的）。跳过它会少掉“一个新 model 的形状该怎么定”的经验数据，第 7 站讲 muP 和 aspect ratio 的 scaling 时会再用到。
:::

A1 的 config 是 handout 直接给的。自己设计一个 model 时要回答：$d_{ff}$ 比 $d$ 大多少，head 怎么分，深一点还是宽一点，vocabulary 多大，要不要 regularization。Lecture 3 的做法是把几十个公开 model 的选择列出来，发现大多数选择惊人地一致。

**$d_{ff}/d$。** 不带 gating 的 FFN 几乎都取 $d_{ff}=4d$。GLU 一类为了 parameter 相等缩到 $\tfrac23$，即 $\tfrac83d\approx2.67d$（上面推过）。Lecture 列的 GLU model：PaLM 4、Mistral 7B 3.5、LLaMA-2 70B 3.5、LLaMA 70B 2.68、Qwen 14B 2.67、DeepSeek 67B 2.68、Yi 34B 2.85、T5 v1.1 2.5。A1 的 TinyStories config 是 $1344/512=2.625$，GPT-2 XL 大小的 config 是 $4288/1600=2.68$。例外是 T5 11B：$d=1024$，$d_{ff}=65{,}536$，64 倍；它的后续版本 T5 v1.1 改回 2.5 倍的 GeGLU，lecture 据此认为 64 倍大概不是好选择。Kaplan 2020 的实验里这个比例在 1 到 10 之间都接近最优，是一个很宽的 basin，所以 4 和 2.67 这两个默认值不必再调。

**Head 的切法。** 几乎所有 model 都让 $(\text{head 数})\times(\text{head dim})=d$，即比例为 1：

| model | head 数 | head dim | $d$ | 比例 |
|---|---|---|---|---|
| GPT-3 | 96 | 128 | 12288 | 1 |
| T5 | 128 | 128 | 1024 | 16 |
| T5 v1.1 | 64 | 64 | 4096 | 1 |
| LaMDA | 128 | 128 | 8192 | 2 |
| PaLM | 48 | 258 | 18432 | 1.48 |
| LLaMA2 | 64 | 128 | 8192 | 1 |
| Qwen 3.5（27B） | 24 | 256 | 5120 | 1.2 |

A1 是 $16\times32=512$，比例 1。数学上 head dim 可以大于 $d/h$，lecture 的总结是这条惯例“很标准，但几乎没有验证过”，例外主要来自 Google 的 model。

**Aspect ratio $d/n_{\text{layer}}$。** 深还是宽：

| model | $d/n_{\text{layer}}$ |
|---|---|
| BLOOM | 205 |
| T5 v1.1 | 171 |
| PaLM（540B） | 156 |
| GPT-3、OPT、Mistral、Qwen、OLMo 3 | 128 |
| LLaMA、LLaMA2 | 102 |
| Gemma 3 | 87 |
| Gemma 4 | 61 |
| T5（11B） | 33 |

用一次：A1 的 TinyStories config 是 $512/4=128$，正落在 GPT-3 那一档；GPT-2 XL 大小的 config 是 $1600/48=33.3$，和 T5 11B 一样深而窄；第 8 站要用的 Llama 2 13B 是 $5120/40=128$。Lecture 引 Kaplan 2020 和 Tay 等人 2021 的实验：100 到 200 之间都不错，具体取哪个往往由系统决定。层数多的 model 难以并行（pipeline parallel 按层切，第 6 站），生成时每个 token 要依次走过所有层，latency 更高；层数少、每层宽，matmul 更大，更容易跑满 GPU。

**Vocabulary。** 单语 model 多在 3 到 5 万：原始 Transformer 37000，GPT 40257，GPT-2/3 50257，T5 32128，LLaMA 32000。多语言和产品级 model 在 10 万到 25 万：mT5 250000，PaLM 256000，GPT-4 100276，Gemma 4 262144，DeepSeek 100000，Qwen 152064，Yi 64000。单语不需要大 vocabulary，多语言需要，因为每种语言的常见词都要有自己的 token，否则那种语言的 compression ratio 很差（第 1 站）。

**Regularization。** 反对的理由：数据（万亿级 token）比 parameter 多得多，而且通常只过一遍，很难 memorize。实践中：

| model | dropout | weight decay |
|---|---|---|
| 原始 Transformer | 0.1 | 0 |
| GPT-2 | 0.1 | 0.1 |
| T5 | 0.1 | 0 |
| GPT-3 | 0.1 | 0.1 |
| T5 v1.1 | 0 | 0 |
| PaLM | 0 | variable |
| OPT | 0.1 | 0.1 |
| LLaMA | 0 | 0.1 |
| Qwen 14B | 0.1 | 0.1 |

较早的 model 预训练时用 dropout；较新的（Qwen 除外）只用 weight decay。Lecture 提醒，这一列多数论文根本没写 dropout，开源 model 里没写基本等于没用。为什么还要 weight decay，见[第 4 站](#train)：它的作用主要在 optimization 的动态上，不在防 overfitting。

:::from
四处改动的清单、pre-norm 的数据和两种解释、double norm 与 non-residual post-norm、“FLOPs 不等于 runtime”和 Ivanov 等人的三行数据、去掉 bias 的理由、GLU 的证据、parallel layer、全部 hyperparameter 的表和结论，来自 [lecture 3](https://github.com/stanford-cs336/lectures/blob/main/lecture_03.pdf)（文字全部抽出，第 11、13、16、38、43、44、47、49 页这些带表和图的页渲染成图片看过）。Pre-norm 与 post-norm 的 formula、final norm 的作用、RMSNorm 的定义和 upcast 的要求、SwiGLU 的定义和取 64 的倍数、Shazeer 那句话、RoPE 的角度 formula和 buffer 的建议、initialization，来自 [A1 handout](https://github.com/stanford-cs336/assignment1-basics) 第 3 节。Parameter 表、residual stream rms 的粗略估计、RMSNorm 在 TinyStories config 里的 FLOPs 份额、各 config 的比例和各个数值例子是我算的；pre-norm 稳定性的结论没有在这里推导，依据是 lecture 引用的实验。
:::

## [account] Resource accounting：FLOPs 与 memory

:::skip
能对任意一个 Transformer config 列出一次 forward 的所有 matmul 并算出各自的份额，算出训练时每个 parameter 占几个 byte、activation 大约多大，并用 MFU 估计训练时间，就可以去第 4 站。快速路线必读（Lecture 2）。“forward $2N$、backward $4N$、合计 $6ND$”的推导在 [CS4248 第 7 站](../courses/CS4248.html#pretrain)，这里直接用。
:::

### 只数 matmul

Lecture 2 和 A1 都用同一条规则：$m\times n$ 乘 $n\times p$ 要 $2mnp$ 次 FLOP（每个 output entry 是 $n$ 次乘法加 $n$ 次加法）。Transformer 里除了 matmul 的运算（softmax、RMSNorm、SiLU）FLOPs 份额很小，所以账只算 matmul。

一层 block，sequence length $T$：

| matmul | shape | FLOPs |
|---|---|---|
| $Q,K,V$ projection | $(T\times d)(d\times 3d)$ | $6Td^2$ |
| Output projection | $(T\times d)(d\times d)$ | $2Td^2$ |
| $QK^\top$，所有 head 合计 | $h\times(T\times d_k)(d_k\times T)$ | $2T^2d$ |
| 乘 $V$，所有 head 合计 | $h\times(T\times T)(T\times d_k)$ | $2T^2d$ |
| SwiGLU 的 $W_1,W_3,W_2$ | 三次 $(T\times d)(d\times d_{ff})$ 量级 | $6Td\,d_{ff}$ |

最后再加 LM head 的 $2TdV$。Attention 那两行合计 $4T^2d$，是唯一和 $T^2$ 成正比的项。

先算 TinyStories config，按每个 token 平均（$T=256$）：每层 $6d^2=1{,}572{,}864$，$2d^2=524{,}288$，$4Td=524{,}288$，$6d\,d_{ff}=4{,}128{,}768$，合计 6,750,208；4 层是 27,000,832；LM head $2dV=10{,}240{,}000$。每个 token 一次 forward 是 37,240,832 次 FLOP，其中 LM head 占 27.5%，attention 的 $T^2$ 项只占 5.6%。

再算 GPT-2 XL 大小的 config（A1 用的：$V=50257$，48 层，$d=1600$，25 个 head，$d_{ff}=4288$），一次 forward 一整条 sequence：

| 部分 | $T=1024$ | 份额 | $T=16384$ | 份额 |
|---|---|---|---|---|
| $Q,K,V$ projection | $7.55\times10^{11}$ | 21.5% | $1.21\times10^{13}$ | 9.0% |
| Output projection | $2.52\times10^{11}$ | 7.2% | $4.03\times10^{12}$ | 3.0% |
| $QK^\top$ 与乘 $V$ | $3.22\times10^{11}$ | 9.2% | $8.25\times10^{13}$ | 61.7% |
| SwiGLU FFN | $2.02\times10^{12}$ | 57.5% | $3.24\times10^{13}$ | 24.2% |
| LM head | $1.65\times10^{11}$ | 4.7% | $2.64\times10^{12}$ | 2.0% |
| 合计 | $3.52\times10^{12}$ | | $1.34\times10^{14}$ | |

::fig[cs336-flops] 同一个 GPT-2 XL 大小的 model，context 拉长 16 倍后 FLOPs 的构成。除了 attention 那一块，其余各项都只是放大 16 倍。

开头的第二个数就是这张表：token 多了 16 倍，与 $T$ 成正比的项放大 16 倍，$T^2$ 项放大 256 倍，合计放大 38 倍。

这个 model 的 parameter：每层 $4d^2+3d\,d_{ff}+2d=30{,}825{,}600$，48 层再加 embedding、LM head 和 final norm，共 1,640,452,800 个，约 1.64B。按 fp32 存要 6.56 GB。

### Training 一步要多少 FLOPs，要多久

Backward 对每个 matmul 要算两个 gradient（对 input 和对 weight），各和 forward 一样大，所以 training 一步约为 forward 的 3 倍。TinyStories 的整个训练：

$$3\times37{,}240{,}832\times327{,}680{,}000=3.66\times10^{16}\ \text{FLOP}$$

硬件的峰值（lecture 2、6 的讲稿里的数，dense，不计 sparsity）：

| | fp32 | bf16 |
|---|---|---|
| H100 | $6.75\times10^{13}$ | $9.895\times10^{14}$ |
| B200 | $7.5\times10^{13}$ | $2.25\times10^{15}$ |

用 B200 的 bf16 峰值，$3.66\times10^{16}/2.25\times10^{15}=16$ 秒；用 fp32 峰值是 488 秒，约 8 分钟。Handout 说正确而高效的实现要 20 到 30 分钟，平均每秒 $2.0\times10^{13}$ 到 $3.1\times10^{13}$ 次 FLOP，只有 bf16 峰值的 1% 左右。

衡量这个差距的量叫 MFU（model FLOPs utilization）：实际达到的 FLOP/s 除以硬件承诺的峰值。Lecture 2 说 MFU 能到 0.5 就算很好。TinyStories 这么低，原因是 $d=512$ 的 matrix 太小，每从 HBM 搬一个 byte 能做的计算不够多（第 5 站讲这件事），再加上 Python 和 kernel launch 的开销、data loading、evaluation。这是开头第一个数的答案：小 model 的 wall-clock time 不由 FLOPs 决定。

Low-resource 配置的数据也可以这样读：32 × 5000 × 256 = 40,960,000 个 token，计算量 $4.58\times10^{15}$。Handout 报告在 M4 Max 上用 MPS 要 36 分钟、用 CPU 要 1 小时 22 分钟，折合每秒 $2.1\times10^{12}$ 和 $9.3\times10^{11}$ 次 FLOP。

Lecture 2 开头的两道估算题用的就是这几个数。用 1024 块 H100 训练一个 70B 的 model、15T 个 token，按 MFU 0.5：总计算量 $6\times7\times10^{10}\times1.5\times10^{13}=6.3\times10^{24}$，每天能做 $9.895\times10^{14}\times0.5\times1024\times86400=4.38\times10^{22}$ 次，要 144 天。另一题见下一小节。

### Floating point format：一个数占几个 byte

Memory 的账是“多少个数 × 每个数几个 byte”。Lecture 2 逐个看了几种 format（括号里是 sign、exponent、mantissa 的 bit 数）：

| format | bit | byte | 特点 |
|---|---|---|---|
| fp32 | 1、8、23 | 4 | 默认；parameter 的 master copy 和 optimizer state 用它 |
| fp16 | 1、5、10 | 2 | 范围窄：最大 65,504，最小的正数（subnormal）$2^{-24}\approx5.96\times10^{-8}$ |
| bf16 | 1、8、7 | 2 | exponent 和 fp32 一样，范围相同；mantissa 少，精度差 |
| fp8 | E4M3 或 E5M2 | 1 | 2022 年标准化，H100 支持；E4M3 范围 $[-448,448]$，E5M2 范围 $[-57344,57344]$（lecture 10 写的 E4M3 范围是 $[-240,240]$，两讲不一致，这里取 lecture 2） |
| fp4（NVFP4） | | 0.5 | 只能表示 $0,\pm0.5,\pm1,\pm1.5,\pm2,\pm3,\pm4,\pm6$，每一小块另配一个 scale factor |

用一次：在 fp16 里写 `torch.tensor([1e-8])`，$10^{-8}$ 小于 fp16 能表示的最小正数 $5.96\times10^{-8}$，直接变成 0（underflow）；gradient 里常有这种量级的数，训练会因此出问题。bf16 的 exponent 有 8 bit，最小的 normal 数约 $1.2\times10^{-38}$，$10^{-8}$ 不会变成 0。代价是间距：bf16 在 1 附近相邻两个数差 $2^{-7}=0.0078$（第 4 站会用到）。Lecture 的结论是 mixed precision：parameter、activation、gradient 用 bf16，optimizer state 用 fp32；PyTorch 的 autocast 只在安全的地方（matmul，不包括 exp）自动转成 bf16。FP4 这一档 lecture 举的例子是 Nemotron 3 Super 用 NVFP4 训练。

### Memory：每个 parameter 16 个 byte

Lecture 2 开头的第二道题：8 块 H100（每块 80 GB）用 AdamW，最大能训多大的 model？讲稿按 parameter 2 byte、gradient 2 byte、两个 fp32 的 Adam state 各 4 byte，共 12 byte，得到 $8\times80\times10^9/12=5.33\times10^{10}$，约 53B，并注明没算 activation，所以只是上限。这个 12 byte 没有算 fp32 的 master weights，下面按 lecture 8 的拆法算是 16 byte。

训练时每个 parameter 要存四样东西。全用 fp32 的 AdamW：parameter 4 byte，gradient 4 byte，Adam 的两个 moment 各 4 byte，共 16 byte。GPT-2 XL 是 $1.64\times10^9\times16=26.2$ GB，还没算 activation。

Mixed precision 并不让这个数减半。Lecture 8 列的典型配置是：bf16 的 parameter 2 byte、bf16 的 gradient 2 byte、fp32 的 master weights 4 byte（optimizer 累加更新的那一份，必须是 fp32）、两个 fp32 的 moment 各 4 byte，合计还是 16 byte。省下来的是 activation 和速度。

:::wrong 用了 bf16 mixed precision，训练的 memory 就减半
Parameter、gradient、optimizer state 这部分仍然是每个 parameter 16 byte，原因是 optimizer 的累加必须在 fp32 里做：A2 让你跑的实验里，在 fp16 里把 0.01 累加 1000 次得到 9.95（我用 numpy 的 float16 照做的结果），在 fp32 里累加是 10.0001。真正减少的是 activation（存成 2 byte），以及 matmul 在 tensor core 上的速度（B200 的 bf16 峰值是 fp32 的 30 倍）。A2 的 memory profiling 一题专门问 mixed precision 对 peak memory 的影响有多大，答案取决于 activation 在 peak 里占多少。
:::

### Activation：随 batch 和 $T$ 增长的部分

Backward 要用 forward 的中间结果，这些被 autograd 存下来的 tensor 叫 residual（saved tensors）。A2 handout 实测了一个 xl 大小的 block（$d=2560$，$d_{ff}=10240$，那段代码里 16 个 head，batch 4，$T=2048$，fp32，已经用 `torch.compile` 融合过）：一个 block 存下 3651.31 MiB，32 层就是 114 GiB。

这个数可以拆开看。一个 `(4, 2048, 2560)` 的 fp32 tensor 是 $4\times2048\times2560\times4$ byte = 80 MiB；一个 `(4, 16, 2048, 2048)` 的 attention score tensor 是 1024 MiB。$3651.31-2\times1024=1603.31$，约等于 20 个 80 MiB（一个 $d_{ff}$ 宽的 tensor 算 4 个）。也就是说，scores 和 softmax 之后的 probabilities 两个 $T\times T$ 的 tensor 占了一半以上。这是我对 handout 数字的拆解，handout 自己只说“attention 的 residual 有不少浪费，第 4 节修”，修法就是第 5 站的 FlashAttention。

其余部分随 batch、$T$、$d$ 成正比增长，FlashAttention 也救不了。

第一个办法是 gradient accumulation（lecture 2）：想要的 batch 是 $B$，但一次只放得下 $B/k$ 个 sample，就把 batch 切成 $k$ 个 microbatch，依次 forward、backward，gradient 累加起来不清零，$k$ 次之后做一次 optimizer step 再清零。Lecture 的玩具例子：$L=16$ 层、宽 $D=1024$ 的 MLP，bf16 下每层存一个 `(B, D)` 的 activation，$B=64$ 时共 $2\times64\times1024\times16=2{,}097{,}152$ byte；切成 4 个大小 16 的 microbatch，峰值降到四分之一，update 和 batch 64 一样（loss 要按 microbatch 在整个 batch 里的占比缩放，A5 会再遇到）。代价是 $k$ 次 forward、backward 依次做，matmul 变小，更难跑满 GPU。

第二个办法是 activation checkpointing：forward 只存每段的输入，backward 走到这一段时从输入重算一遍 forward。A2 的例子里 4 个 block 分两段做 checkpoint，存下的只剩两段的输入 $2\times80=160$ MiB，代价是多算一次 forward。Lecture 2 给的极端情形：每层都存，memory $O(L)$；一个都不存、每次从头重算，memory $O(1)$ 但计算 $O(L^2)$；每隔 $\sqrt L$ 层存一个，memory $O(\sqrt L)$，额外计算只是一次 forward。

:::back
$2mnp$ 的 matmul 计数和 backward 是 forward 两倍的理由，见 [CS4248 第 7 站](../courses/CS4248.html#pretrain)。为什么小 matrix 跑不满峰值，见[第 5 站](#gpu)的 arithmetic intensity。
:::

:::from
$2mnp$ 规则、forward 2 倍 backward 4 倍、MFU 的定义和“0.5 就很好”、各 GPU 的峰值（讲稿里 `get_promised_flop_per_sec` 的数，H100、B200 都是 sparse 峰值除以 2）、两道开头的估算题、各种 floating point format 和 underflow 的例子、mixed precision 的分工、gradient accumulation、activation checkpointing 的三种极端，来自 [lecture 2](http://cs336.stanford.edu/lectures/?trace=lecture_02) 的讲稿（估算题的结果讲稿要运行才显示，这里是我按它的式子算的；表里各 format 的 bit 数和 fp16 的最大值、最小正数是我按 IEEE 的定义补的，讲稿只放了示意图）。GPT-2 XL 的 config、FLOPs accounting 的题目结构、TinyStories 的 config 和时间、low-resource 的时间，来自 [A1 handout](https://github.com/stanford-cs336/assignment1-basics)。16 byte 的 mixed precision 拆法来自 [lecture 8](https://github.com/stanford-cs336/lectures/blob/main/lecture_08.pdf)。3651.31 MiB、160 MiB 和 fp16 累加的实验来自 [A2 handout](https://github.com/stanford-cs336/assignment2-systems) 第 2、3 节。表里的全部 FLOPs、parameter 数、MFU 的换算、3651 MiB 的拆解是我用 Python 算的；A1 的 accounting 题要你自己再做一遍 GPT-2 small、medium、large，这里没有列出。
:::

## [train] Training：loss、AdamW、schedule 与稳定性

:::skip
能写出不经过 softmax 的 cross-entropy，说清 Adam 的 bias correction 和 AdamW 的 decoupled weight decay 各修正了什么，算出 cosine schedule 任意一步的 learning rate，并知道 loss 变成 NaN 时依次查哪里，就可以去第 5 站。A1 的第 4、5 节全靠这一站，做 A1 就必读。
:::

### Cross-entropy：不要先算 softmax 再取 log

Model 在位置 $i$ 输出 logits $o_i\in\mathbb R^V$，loss 是真实下一个 token 的 negative log-probability：

$$\ell_i=-\log\frac{e^{o_i[y]}}{\sum_ae^{o_i[a]}}=-o_i[y]+\log\sum_ae^{o_i[a]}$$

第二个等号把 log 和 exp 消掉了，这正是 A1 要求的“cancel out log and exp”。剩下的 $\log\sum e^{o[a]}$ 叫 log-sum-exp，直接算会 overflow：fp32 能表示的最大数约 $3.4\times10^{38}$，$e^{89}$ 就超了。办法和 softmax 一样，先减去 max $m$：

$$\log\sum_ae^{o[a]}=m+\log\sum_ae^{o[a]-m}$$

取 $o=(1000,\,1001,\,1002)$。直接算 $e^{1000}$ 是 `inf`，`inf/inf` 得 NaN。减去 $m=1002$ 之后是 $\log(e^{-2}+e^{-1}+1)=\log1.5032=0.4076$，log-sum-exp 是 1002.4076。如果真实 token 是第 0 个，loss 是 $1002.4076-1000=2.4076$；是第 2 个，loss 是 0.4076。

一个用来查 bug 的数：initialization 时 model 对 vocabulary 大致 uniform，loss 应该在 $\ln V$ 附近。TinyStories 的 $V=10000$，$\ln V=9.21$；OpenWebText 的 32,000，$\ln V=10.37$。第一步的 loss 离这个数很远，先查 model 和 loss。Evaluation 时报告 perplexity $=\exp(\text{平均 loss})$。

### AdamW：update 的大小由 learning rate 决定

A1 的 Algorithm 1（Loshchilov 与 Hutter 的 AdamW）：每个 parameter 维护两个 state，

$$m\leftarrow\beta_1m+(1-\beta_1)g,\qquad v\leftarrow\beta_2v+(1-\beta_2)g^2$$

$$\alpha_t=\alpha\,\frac{\sqrt{1-\beta_2^t}}{1-\beta_1^t},\qquad\theta\leftarrow\theta-\alpha\lambda\theta,\qquad\theta\leftarrow\theta-\alpha_t\frac{m}{\sqrt v+\varepsilon}$$

$t$ 从 1 开始。LLM 常用 $(\beta_1,\beta_2)=(0.9,0.95)$，$\varepsilon=10^{-8}$。

$m$ 是 gradient 的移动平均，$\sqrt v$ 是 gradient 大小的移动平均，两者相除约等于 $\pm1$ 乘上一个“方向有多一致”的比例。所以 Adam 的每一步，每个 parameter 移动的距离约为 learning rate，与 gradient 的绝对大小无关。这是它和 SGD 的根本区别，后面两个修正都围绕这一点。

**Bias correction。** $m$、$v$ 从 0 开始，前几步被 0 拖小了。看第一步：$m=(1-\beta_1)g=0.1g$，$v=(1-\beta_2)g^2=0.05g^2$，所以

$$\frac{m}{\sqrt v}=\frac{0.1g}{\sqrt{0.05}\,|g|}=0.447\,\mathrm{sign}(g)$$

只有应有大小的 45%。修正因子在 $t=1$ 时是 $\sqrt{0.05}/0.1=2.236$，乘起来正好是 $1.000\,\mathrm{sign}(g)$。$t=2$ 时因子是 1.643，$t=10$ 时 0.973，$t=100$ 时 0.997，很快趋于 1。

**Decoupled weight decay。** 普通的 L2 regularization 把 $\lambda\theta$ 加进 gradient：$g'=g+\lambda\theta$。放进 Adam 之后，这一项也要除以 $\sqrt v$。取 $\lambda=0.1$，两个 parameter 都是 $\theta=1$：

- Parameter A 的 gradient 在 $\pm10$ 量级。$g'$ 里 decay 的那 0.1 和 10 相比只占 1%，除以 $\sqrt v\approx10$ 之后几乎不起作用。
- Parameter B 的 gradient 几乎是 0。$g'\approx0.1$，$\sqrt v\approx0.1$，$m/\sqrt v\approx1$：decay 推着它每一步走满一个 learning rate。

同一个 $\lambda$，decay 的强度随 gradient 的大小差了约 100 倍。AdamW 把 decay 从 gradient 里拿出来单独做：$\theta\leftarrow\theta-\alpha\lambda\theta$，每个 parameter 都按自身大小的同一比例收缩，与 $v$ 无关。

Lecture 3 指出现代 LM 普遍不用 dropout 而保留 weight decay，作用主要不在防 overfitting（数据只过一遍），而在和 learning rate schedule 相互作用、影响 optimization 的动态。

### Learning rate：warmup 加 cosine

A1 的 schedule：$t<T_w$ 时 $\alpha_t=\tfrac{t}{T_w}\alpha_{\max}$；$T_w\le t\le T_c$ 时

$$\alpha_t=\alpha_{\min}+\tfrac12\Big(1+\cos\Big(\frac{t-T_w}{T_c-T_w}\pi\Big)\Big)(\alpha_{\max}-\alpha_{\min})$$

$t>T_c$ 时停在 $\alpha_{\min}$。TinyStories 要处理 327,680,000 个 token，batch 128、context 256 时恰好是 $327680000/(128\times256)=10000$ 步。取 $\alpha_{\max}=10^{-3}$、$\alpha_{\min}=10^{-4}$、$T_w=500$、$T_c=10000$：

| $t$ | 0 | 250 | 500 | 2875 | 5250 | 7625 | 10000 |
|---|---|---|---|---|---|---|---|
| $\alpha_t$ | 0 | $5.0\times10^{-4}$ | $1.0\times10^{-3}$ | $8.68\times10^{-4}$ | $5.5\times10^{-4}$ | $2.32\times10^{-4}$ | $1.0\times10^{-4}$ |

$t=5250$ 在 cosine 段正中，$\cos(\pi/2)=0$，得 $\alpha_{\min}+\tfrac12(\alpha_{\max}-\alpha_{\min})=5.5\times10^{-4}$。

::fig[cs336-lr] 上表的 schedule。Low-resource 配置只跑 5000 步时，$T_c$ 也要改成 5000，否则训练结束时 learning rate 还停在高处。

为什么要 warmup？看没有 warmup 的第一步有多大。上面算过，第一步每个 weight 都移动 $\alpha$，方向是 $-\mathrm{sign}(g)$。考虑一个 $512\to512$ 的 linear layer 只用一个 sample 的 gradient $\delta x^\top$，第 $i$ 行的变化 $\Delta W_{ij}=-\alpha\,\mathrm{sign}(\delta_i)\,\mathrm{sign}(x_j)$，于是这一行的输出变化

$$\Delta y_i=\sum_j\Delta W_{ij}x_j=-\alpha\,\mathrm{sign}(\delta_i)\sum_j|x_j|$$

$x$ 的 entry 是 standard normal 时 $\sum_j|x_j|\approx512\times0.798=409$，取 $\alpha=10^{-3}$，$|\Delta y_i|\approx0.41$。而 initialization 时 $y_i=W_ix$ 的 standard deviation 是 $0.0442\times\sqrt{512}\approx1.0$。一步就把输出推动了它自身大小的 40%。有 warmup 时第一步的 learning rate 是 $10^{-3}/500=2\times10^{-6}$，同样的计算只有 0.08%。真实 batch 的 gradient 是很多 outer product 的和，sign 没有这么整齐，所以这是偏大的 estimate；但它说明了 sign 式的 update 在一开始为什么危险。这个估算是我自己做的，handout 和 lecture 没有给 warmup 的理由。

### Gradient clipping、data loader 与 checkpoint

**Gradient clipping。** 把所有 parameter 的 gradient 拼成一个 vector 算 $\ell_2$ norm，超过上限 $M$ 时整体乘 $\tfrac{M}{\|g\|_2+\varepsilon}$（$\varepsilon=10^{-6}$）。$g=(3,4)$、$M=1$：$\|g\|=5$，变成 $(0.6,\,0.8)$，norm 是 0.9999998，略小于 $M$。是全局的 norm，不是每个 tensor 各自 clip；顺序是 backward、clip、optimizer step。

**Data loader。** 所有文档连成一条 token sequence（中间夹着 `<|endoftext|>`），每个 sample 是从一个 random 起点 $s$ 开始的 $T$ 个 token，target 是从 $s+1$ 开始的 $T$ 个。任何 $s\le n-T-1$ 都合法，不需要 padding。数据用 `np.memmap` 打开，访问到哪里才读到哪里，几 GB 的 token 文件不必全部读进 memory；dtype 要和存的时候一致（`uint16`）。

**Checkpoint。** 至少存 model 的 `state_dict`、optimizer 的 `state_dict`（AdamW 的 $m$、$v$）和当前的 iteration。少了 optimizer state，resume 之后 $m$、$v$ 从 0 开始，又要经历一次 bias correction 的过渡；少了 iteration，schedule 会从头再 warmup 一次。

### Decoding：temperature 与 top-p

训练完要从 model 生成文本：给一个 prompt，取最后一个位置的 logits $v$，softmax 之后 sample 下一个 token，接到输入后面，重复到生成 `<|endoftext|>` 或达到长度上限（A1 第 6 节）。小 model 直接这样 sample 常常胡言乱语，handout 给了两个办法。

**Temperature。** 用 $\mathrm{softmax}(v/\tau)$ 代替 $\mathrm{softmax}(v)$。取 4 个 token 的 logits $v=(2,\,1,\,0.5,\,-1)$：

| $\tau$ | probability |
|---|---|
| 1 | $(0.609,\,0.224,\,0.136,\,0.030)$ |
| 0.5 | $(0.842,\,0.114,\,0.042,\,0.002)$ |
| 2 | $(0.434,\,0.263,\,0.205,\,0.097)$ |

除以 $\tau<1$ 把 logits 之间的差距放大，distribution 变尖；$\tau\to0$ 时变成 one-hot，等于每次取最大的（greedy）。$\tau>1$ 把差距缩小，更 random。

**Top-p（nucleus）sampling。** 把 probability 从大到小排，取最少的几个，使它们的和至少是 $p$，记作 $V(p)$；只在 $V(p)$ 里按 renormalize 之后的 probability sample，其余置 0。上面 $\tau=1$ 的 distribution 取 $p=0.8$：最大的一个是 0.609，不够；加上第二个是 0.834，够了，$V(0.8)$ 是前两个，renormalize 成 $(0.731,\,0.269)$。取 $p=0.9$ 要加上第三个（和是 0.970），变成 $(0.629,\,0.231,\,0.140)$。最后那个 0.030 的 token 在两种设置下都永远不会被 sample 到：top-p 砍掉的是 distribution 的长尾，小 model 的胡话多半从那里来。

### 训练不稳定的时候

Lecture 3 把不稳定的源头归到 softmax：exponential 和除法在输入很大时表现很差。Model 里有两个 softmax。

**输出的 softmax。** Softmax 对 logits 整体加一个 constant 不变，所以 $\log Z=\log\sum_ae^{o[a]}$ 可以在训练中漂移而 loss 不受影响。漂大了就出事：在 bf16 里，1 附近相邻两个数相差 $2^{-7}=0.0078$，1000 附近相差 4。Logits 都在 1000 左右时，差距小于 4 的两个 logit 根本分不开。z-loss 在 loss 里加一项惩罚，把 $\log Z$ 拉回 0 附近。Lecture 3 引 Devlin 2014 的写法：$\log P(x)=U_r(x)-\log Z(x)$，于是在每个 token 的 loss 上加 $\alpha\log^2Z$。PaLM 用的系数是 $\alpha=10^{-4}$：$\log Z=10$ 时这一项是 $10^{-4}\times100=0.01$，和每个 token 两三的 cross-entropy 相比很小，平时几乎不影响训练，只在 $\log Z$ 漂到几十、上百时才起作用（$\log Z=100$ 时是 1）。Lecture 列的其他用户：Baichuan 2、DCLM、OLMo 2、OLMo 3。

**Attention 的 softmax。** QK-norm 在 $q$、$k$ 做 dot product 之前各过一次 RMSNorm。Norm 之后 $\|q\|$、$\|k\|$ 由 gain 决定，$q\cdot k\le\|q\|\|k\|$，attention logits 就不会随训练无限变大。它原本来自 vision 和 multimodal model（Dehghani 2023、Idefics、Chameleon，第 13 站），现在 DCLM、OLMo 2、Gemma 2、Qwen3、OLMo 3、Gemma 4 都用。

**Logit soft-capping。** 另一种做法是直接给 logits 设一个软上限：$\text{logits}\leftarrow c\cdot\tanh(\text{logits}/c)$。Gemma 2 在 attention 里取 $c=50$，在最后一层取 $c=30$。以 $c=30$ 为例：logit 为 1 时输出 0.9996，为 10 时输出 9.65，为 100 时输出 29.92，小的 logit 几乎不变，大的被压在 30 以内。Lecture 3 放的一张对比表（perplexity，bf16）显示它可能有代价：baseline 11.19，soft-capping 11.24，QK-norm 10.84，QKV-norm 10.85。

A1 的调试建议：先在一个 minibatch 上 overfit，loss 应该很快接近 0，做不到就是实现有错；在各个 component 设 breakpoint 看中间 tensor 的 shape；持续记录 activation、weight、gradient 的 norm。A1 还让你做 learning rate sweep 并找到 diverge 的 boundary，民间说法是最好的 learning rate 在“edge of stability”附近。

:::wrong Loss 变成 NaN，就是 learning rate 太大
Learning rate 太大确实会 diverge，但从 A1 的实现看，NaN 更常见的来源是数值：softmax 或 cross-entropy 没有先减去 max，logits 一过 89 就在 fp32 里 overflow；RMSNorm 没有 upcast，fp16 里一个 300 的 square 就成了 `inf`；mask 用 `-inf` 填满了一整行（例如 query 一个 key 都看不到），softmax 得到 $0/0$。这些在 learning rate 很小时也会出现。看到 NaN，先找第一个出现 `inf` 的 tensor，再考虑 learning rate。
:::

:::from
Cross-entropy 的两条要求、perplexity、AdamW 的 algorithm 和 hyperparameter、cosine schedule 的定义、gradient clipping 的定义和 $\varepsilon$、data loader 的 sampling 方式和 `np.memmap`、checkpoint 的内容、low-resource 的 $T_c$ 提示、调试建议和“edge of stability”，来自 [A1 handout](https://github.com/stanford-cs336/assignment1-basics) 第 4 至 7 节。Temperature 和 top-p 的定义来自 A1 第 6 节。Weight decay 的作用、不用 dropout、“小心 softmax”、z-loss 的 formula 和 PaLM 的系数 $10^{-4}$、QK-norm、logit soft-capping 和那张 perplexity 表，来自 [lecture 3](https://github.com/stanford-cs336/lectures/blob/main/lecture_03.pdf)（第 54 至 56 页渲染成图片看过）。数值例子、bias correction 的表、L2 与 AdamW 的对比、warmup 的估算、bf16 的间距、NaN 的几个来源、decoding 的数值例子是我写的和算的。
:::

## [gpu] GPU、kernel 与 FlashAttention

:::skip
能用 arithmetic intensity 判断一个 operation 是 compute-bound 还是 memory-bound，说清 fusion 和 tiling 各省掉了哪些 HBM 读写，手算 online softmax 的 recurrence，并写出一个最简单的 Triton kernel，就可以去第 6 站。快速路线必读（Lecture 5、6），A2 的前半全靠它。
:::

### 算得快，搬得慢

GPU 由很多 streaming multiprocessor（SM）组成。离 SM 越近的 memory 越快也越小：每个 SM 里有 register 和 shared memory（与 L1 cache 共用），整块芯片共用一个 L2 cache，最外面是 HBM（global memory）。下表前八行是 lecture 6 的表，最后一行是 lecture 2 讲稿里的峰值：

| | A100 | H100 | B200 |
|---|---|---|---|
| SM 个数 | 108 | 132 | 148 |
| 每个 SM 的 register | 256 KB | 256 KB | 256 KB |
| 每个 SM 的 L1 + shared memory | 192 KB | 256 KB | 256 KB |
| L2 cache | 40 MB | 50 MB | 96 至 126 MB |
| HBM 容量 | 80 GB | 80 GB | 192 GB |
| L1 + shared memory bandwidth（粗估） | 约 19 TB/s | 约 33 TB/s | 约 40 TB/s |
| L2 bandwidth（粗估） | 约 5 至 8 TB/s | 约 12 TB/s | 约 17 TB/s |
| HBM bandwidth | 2 TB/s | 3.35 TB/s | 8 TB/s |
| bf16 dense 峰值 | 312 TFLOP/s | 989.5 TFLOP/s | 2250 TFLOP/s |

从 HBM 到 shared memory，bandwidth 差了 5 到 10 倍（lecture 注明 L1、L2 的数是粗估，各处来源不一）。Lecture 5 的另一条线索是趋势：过去十几年 GPU 的 FLOP/s 涨得比 memory bandwidth 快得多，“算”越来越便宜，“搬”越来越成为瓶颈。

任何计算都是三步：从 HBM 把输入搬进来，算，把结果搬回去。设计算和搬运可以完全重叠，用时是两者中较长的那个。比较两个比值：

- Accelerator intensity：硬件每秒能算的 FLOP 除以每秒能搬的 byte。H100 是 $989.5\times10^{12}/3.35\times10^{12}=295$，B200 是 $2250/8=281$。
- Arithmetic intensity：这个 operation 每搬一个 byte 要做多少 FLOP。

后者小于前者，搬运更慢，叫 memory-bound；反之 compute-bound。

**ReLU。** bf16 的 $n$ 个数：读 $2n$ byte、写 $2n$ byte，做 $n$ 次比较，intensity 是 0.25。比 295 小一千多倍，GPU 绝大部分时间在等数据。

**GeLU。** 读写一样多，但 tanh 的近似要做约 20 次运算（lecture 2 的估计），intensity 是 $20n/4n=5$，仍然远小于 295。所以单独跑一个 element-wise operation 时，GeLU 并不比 ReLU 慢：两者的时间都由搬 $4n$ byte 决定。同理，两个长 $n$ 的 vector 做 dot product，intensity 约 $	frac12$；$n	imes n$ 的 matrix 乘一个 vector，intensity 约 1。

**Matrix multiplication。** 两个 $n\times n$ 的 bf16 matrix：读写 $3\times2n^2$ byte，算 $2n^3$ 次，intensity 约 $n/3$。$n=1024$ 时是 341，超过 295，compute-bound。

**$X$（$B\times D$）乘 $W$（$D\times F$）。** FLOPs 是 $2BDF$，byte 是 $2BD+2DF+2BF$。$B$ 远小于 $D$、$F$ 时 intensity 约为 $B$。取 $D=F=4096$：

| $B$ | 1 | 16 | 64 | 256 | 1024 |
|---|---|---|---|---|---|
| intensity | 1.0 | 15.9 | 62.1 | 227.6 | 682.7 |

在 H100 上 $B$ 要到 300 左右才 compute-bound。$B$ 在 training 里是 batch 乘 sequence length（几万），在 inference 生成阶段是同时在服务的请求数（第 8 站）。第 3 站 TinyStories 的 $d=512$ 那些小 matrix 也落在不够满的范围。

::fig[cs336-roofline] H100 的 roofline。横轴是 arithmetic intensity，纵轴是能达到的 FLOP/s；拐点在 295。圆点是上面几个 operation。

Lecture 5 列了让 GPU 变快的六个手段：避免 control divergence、low precision、operator fusion、recomputation、memory coalescing、tiling。除了第一个，都是在减少 HBM 的读写。下面逐个看。

### Control divergence

一个 thread block 里的 thread 按 32 个一组编成 warp，同一个 warp 的 32 个 thread 必须在同一时刻执行同一条指令（SIMT）。代码里有 `if A else B`，而同一个 warp 里一部分 thread 走 A、一部分走 B 时，硬件只能先让走 A 的那些执行、其余等着，再反过来，两段时间相加。这是唯一和 memory 无关的一条，解决办法是让同一个 warp 里的 thread 走同一个分支（例如按数据把分支对齐到 32 的倍数）。

### Low precision：每个数少几个 byte

Lecture 5 用 element-wise ReLU 算账，按每个元素读一次、写一次：fp32 每个数 4 byte，每次运算要搬 8 byte；fp16 每个数 2 byte，只搬 4 byte。Memory-bound 的 operation，搬的 byte 减半，时间就减半。Matmul 那一边，tensor core 对 low precision 的 matmul 有专门的电路：第 3 站的峰值表里 B200 的 bf16 是 fp32 的 30 倍。

更低的是 FP8 和 FP4。Blackwell 的 MXFP8 用 E4M3（mantissa 多一点），每 32 个数共用一个 E8M0 格式的 scale factor；因为 scale 是沿着一个方向分组的，一个 matrix 和它的 transpose 要分别 quantize（lecture 引的 MXFP8 训练实践里就是这样做的）。MXFP4 那一页写的是每 16 个数一个 scale，scale 用 E4M3。Scale 越细，每一小块的数越能用满这几个 bit 的范围。

### Recomputation：少存，多算

Lecture 5 的例子：三个 sigmoid 串起来，$s_1=\sigma(x)$，$s_2=\sigma(s_1)$，$\text{out}=\sigma(s_2)$。普通的做法 forward 读 1 次 $x$、写 3 次（$s_1$、$s_2$、out，前两个留给 backward）；backward 读 3 次（$s_1$、$s_2$ 和传回来的 $d\,\text{out}$）、写 1 次（$dx$），一共 8 次 HBM 读写，几乎没有计算。改成 forward 只读 $x$、写 out，backward 读 $x$ 和 $d\,\text{out}$，在 kernel 里把三个 sigmoid 重算一遍再求 gradient，写 $dx$：forward 2 次、backward 3 次，共 5 次，是原来的 $5/8$。多算了三个 sigmoid，但它们本来就便宜，省下的读写才是时间所在。第 3 站的 activation checkpointing 和下面 FlashAttention 的 backward 是同一个想法。

### Memory coalescing

HBM 按 burst 读：一次读出一段连续的 byte。一个 warp 的 32 个 thread 同时发出 load 时，如果它们要的地址落在同一段 burst 里，硬件合成一次请求，这叫 coalesced；lecture 6 的数字是合成 128 byte 的 transaction，恰好是 32 个 thread 各读一个 4 byte 的数。Row-major 的 matrix 里，同一行的元素在内存里相邻。Lecture 5 对比了两种分工。每个 thread 负责一行、沿着自己那一行往右读：同一时刻 thread 1 和 thread 2 读的是两行里的同一列，地址相差一整行，不 coalesced，32 个 thread 的读各占一个 burst。每个 thread 负责一列、沿着列往下读：同一时刻相邻的 thread 读的是同一行里相邻的元素，落在同一个 burst 里，coalesced。Slide 上的结论是“row-major 的 matrix，沿着 row 走的 thread 不 coalesced”。

### Fusion：一次搬运多做几件事

Softmax 按 PyTorch 的写法拆成五个 kernel：求 row max、减去 max、exp、求和、除法。Lecture 6 数了一个 $M\times N$ 的 matrix 上的 HBM 读写：读 $5MN+M$ 个数，写 $3MN+2M$ 个。整件事其实只需要读 $MN$、写 $MN$：每行读进 shared memory，在里面做完全部五步，写回去一次。读写总量从约 $8MN$ 降到 $2MN$，对 memory-bound 的 operation，这直接就是 4 倍的速度。

Fusion 还省 memory。A2 handout 演示了 RMSNorm：不融合时 autograd 存下三个和输入一样大的 tensor 外加几个小的；`torch.compile` 融合之后只存输入本身和两个小 tensor。

### Tiling：让读进 shared memory 的数被反复使用

Matmul 是 compute-bound 的前提是每个数读进来之后被用很多次。最朴素的 kernel 每个 output entry 自己去 HBM 读一整行和一整列，同一个数被不同的 output 读了 $N$ 次。Tiling 把 output 切成 $T\times T$ 的块，每个 thread block 负责一块：把对应的 $A$ 的一条 tile 和 $B$ 的一条 tile 读进 shared memory，在里面算完部分和，再读下一对 tile。每个 input 从 HBM 读的次数从 $N$ 降到 $N/T$。

Lecture 6 把这件事按读写次数数了一遍。$C=AB$，$A$ 是 $M\times K$，$B$ 是 $K\times N$。朴素的做法每个 $C_{mn}$ 自己循环 $k$，每次从 HBM 读 $A_{mk}$ 和 $B_{kn}$：共 $MKN$ 次读、$MN$ 次写，arithmetic intensity 是常数，和 matrix 多大无关。可是同一行的两个 output，例如 $C_{m1}$ 和 $C_{m2}$，用的是同一行 $A$，没必要各读一遍。理想情形把 $A$、$B$ 全部放进 shared memory，读 $MK+KN$ 次就够，intensity 随 matrix 变大而变大；可惜 shared memory 只有 200 多 KB，放不下。Tiling 是两者之间的折中：一个 thread block 负责 $C$ 的一块，沿 $K$ 方向依次读入 $A$ 的一块和 $B$ 的一块，在 shared memory 里算完部分和再读下一对，intensity 是 tile 大小的量级。Lecture 6 的 Triton matmul 用的是 $64\times64$ 的 output tile、$K$ 方向每次 32，grid 是 `(cdiv(M, 64), cdiv(N, 64))`。

Tile 大小也带来新问题。Lecture 5 的例子：A100 有 108 个 SM，用 $256\times128$ 的 tile，$1792\times1792$ 的 matmul 切成 $7\times14=98$ 块，一轮就做完；$1793\times1793$ 要切成 $8\times15=120$ 块，第一轮 108 块，剩下 12 块单独跑一轮，大部分 SM 空着。这叫 wave quantization。Lecture 6 在 B200 上举了同样的例子：148 个 SM，launch 160 个 thread block，第二轮只有 12 个。办法是让 thread block 的个数整除 SM 的个数。

::fig[cs336-wave] A100 上同样的 tile，两个只差 1 的 matrix。

另一个问题是对齐。Lecture 5 引的实测（square matmul 能达到的 FLOP/s 随 $N$ 变化）里，$N$ 能被 32 整除的点明显高于只能被 2 整除的点。原因是 HBM 按 burst 读：tile 的边界和 burst 对齐时一次读完一行 tile，不对齐时同一行 tile 要跨两个 burst，读的量翻倍；dimension 不是好的倍数时，有时连 coalesced 都做不到，只能 padding。所以 matrix 的 dimension 取 64、128 的倍数，一是为了对齐 burst，二是为了块数整齐。

### Occupancy 与 bank conflict

Lecture 6 还补了两条写 kernel 时会碰到的硬件细节。

**Occupancy。** SM 靠在多个 warp 之间零成本切换来掩盖 HBM 的 latency：一个 warp 在等数据时，另一个 warp 接着算。能同时驻留多少 warp，受 register 限制：每个 thread 最多用 255 个 register，每个 SM 有 65536 个，同时最多 64 个 warp。Lecture 的例子：thread block 有 128 个 thread，每个用 160 个 register，一个 block 要 $128\times160=20480$ 个，SM 上最多放 $\lfloor65536/20480\rfloor=3$ 个 block，即 $3\times128/32=12$ 个 warp，occupancy 是 $12/64=0.1875$。Occupancy 低不一定坏：如果每个 thread 做更多的工作（thread coarsening），少几个 warp 也能把 memory 延迟藏住。

**Bank conflict。** Shared memory 分成 32 个 bank，每个 4 byte 宽，每个 cycle 每个 bank 只能服务一个 thread（读同一个地址除外）。一个 matrix 每行恰好跨满 32 个 bank 时，32 个 thread 读第一列，地址都落在同一个 bank 上，变成 32 路 conflict，serialize 成 32 次。做 matmul 时既要按行读 $A$ 又要按列读 $B$，这种访问躲不开，解决办法是 swizzling：存进 shared memory 时把位置重排（例如用 row xor col 决定放在哪个 bank），让同一列的元素分散到不同的 bank。

### Attention 为什么需要 FlashAttention

普通的 attention 是三个 kernel：$S=QK^\top/\sqrt d$ 写进 HBM，softmax 读 $S$ 写 $P$，再读 $P$ 乘 $V$。$S$ 和 $P$ 都是 $T\times T$ 的。$T=16384$ 时一个 head 一条 sequence 的 $S$ 用 fp32 存就是 1 GiB；第 3 站看到它们占了一个 block activation 的一半以上。

能不能像 matmul 那样 tile？问题在 softmax：每一行的分母要等整行的 score 都算完才知道，而 tile 只能看到一行里的一段。

**Online softmax。** 一边读一段一边维护三个量：到目前为止的 max $m$、以 $m$ 为基准的分母 $l=\sum e^{s-m}$、以及以 $m$ 为基准的未 normalize 的输出 $O=\sum e^{s-m}v$。读到新的一段，max 变成 $m'$ 时，旧的 $l$ 和 $O$ 都是以 $m$ 为基准算的，乘上 $e^{m-m'}$ 就换成了以 $m'$ 为基准：

$$m'=\max(m,\ \max s_{\text{new}}),\qquad l'=e^{m-m'}\,l+\sum e^{s_{\text{new}}-m'},\qquad O'=e^{m-m'}\,O+\sum e^{s_{\text{new}}-m'}\,v_{\text{new}}$$

全部读完，输出是 $O/l$。

取一行 score $s=(1,\,2,\,3,\,0)$，value $v=(10,\,20,\,30,\,40)$，分两段读。

- 第一段 $(1,2)$：$m=2$，$e^{s-m}=(e^{-1},\,1)=(0.368,\,1)$，$l=1.368$，$O=0.368\times10+1\times20=23.68$。
- 第二段 $(3,0)$：$m'=3$，旧的量乘 $e^{2-3}=0.368$；新的 $e^{s-m'}=(1,\,e^{-3})=(1,\,0.0498)$。$l'=0.368\times1.368+1.0498=1.553$，$O'=0.368\times23.68+30+0.0498\times40=40.70$。

$O'/l'=26.21$。直接算：softmax 是 $(0.087,\,0.237,\,0.644,\,0.032)$，weighted average $0.087\times10+0.237\times20+0.644\times30+0.032\times40=26.21$，相同。再存一个数 $L=m'+\log l'=3+\log1.553=3.440$，它恰好是这一行的 log-sum-exp，backward 会用它。

::fig[cs336-online] 上面这一行分两段读的过程。

::fig[cs336-flash] FlashAttention-2 forward：每个 program instance 负责一块 query，把它留在 shared memory 里，依次读入每一块 key 和 value。动起来时看 Q₂ 这一行：每读一块，只在 SRAM 里算出 $S$ 的一小块（深色），下面的 $m$、$l$、$O$ 跟着更新，四块读完正好是上面算的 26.21。$T\times T$ 的 $S$、$P$ 只以 $B_q\times B_k$ 的小块出现，从不写进 HBM。

**Backward 用 recomputation。** Backward 需要 $P$，但没存。只存了每行的 $L$（$T$ 个数），所以 $P_{ij}=\exp(S_{ij}-L_i)$ 可以从 $Q$、$K$、$L$ 当场重算。A2 handout 给了不经过 softmax 的 backward：先算 $D=\mathrm{rowsum}(O\circ dO)$，然后

$$dV=P^\top dO,\qquad dP=dO\,V^\top,\qquad dS_{ij}=P_{ij}(dP_{ij}-D_i),\qquad dQ=dS\,K/\sqrt d,\qquad dK=dS^\top Q/\sqrt d$$

其中 $D_i=\sum_jP_{ij}dP_{ij}$，用 $PV=O$ 换成了只需 $O$ 和 $dO$ 的形式。

:::wrong FlashAttention 快，是因为它少算了 FLOPs
FLOPs 一点没少，backward 还多算了一遍 $S$ 和 $P$。快在 HBM 的读写。算一个 head：$T=4096$，$d=64$，bf16，在 H100 上。$QK^\top$ 和乘 $V$ 共 $4T^2d=4.29\times10^9$ 次 FLOP，按峰值要 4.3 μs。普通实现至少要写 $S$、读 $S$、写 $P$、读 $P$，共 $4T^2\times2$ byte = 134 MB，按 3.35 TB/s 要 40 μs。普通 attention 的时间几乎全花在搬 $T\times T$ 的 matrix 上，是 memory-bound 的；FlashAttention 让它回到由 FLOPs 决定。
:::

### Triton：按 thread block 写 kernel

CUDA 让你规定每个 thread 做什么；Triton 让你规定每个 thread block（Triton 叫 program instance）做什么：从 HBM load 一块数据，在里面运算，store 回去。Lecture 6 的 fused softmax 就是一个 program instance 负责一行：

```python
import triton
import triton.language as tl

@triton.jit
def softmax_kernel(x_ptr, y_ptr, stride, n_cols, BLOCK: tl.constexpr):
    row = tl.program_id(0)
    cols = tl.arange(0, BLOCK)
    mask = cols < n_cols
    x = tl.load(x_ptr + row * stride + cols, mask=mask, other=float("-inf"))
    x = x - tl.max(x, axis=0)
    num = tl.exp(x)
    y = num / tl.sum(num, axis=0)
    tl.store(y_ptr + row * stride + cols, y, mask=mask)

# softmax_kernel[(M,)](x, y, x.stride(0), N, BLOCK=triton.next_power_of_2(N))
```

`BLOCK` 是 2 的 power，比一行长时多出来的位置用 `mask` 挡住，load 时填 `-inf`，exp 之后是 0，不影响求和。启动时 grid 是 `(M,)`：$M$ 行，$M$ 个 program instance。

这个 kernel 假定一整行放得进一个 block。放不下时（lecture 6 的例子：一行 4096 个数，block 只有 1024），以 row sum 为例：每个 program instance 仍负责一行，但开一个长 `BLOCK` 的 float32 accumulator，用一个 loop 把这一行按 `BLOCK` 一段段 load 进来，逐元素加到 accumulator 上（最后一段用 mask 补 0），loop 结束后再用 `tl.sum` 把 accumulator 归约成一个数写回。4096 列、block 1024 时 loop 走 4 次。Softmax 放不下时要的是 max 和 exp 之和两个量，正是上面 online softmax 解决的问题。

Lecture 6 最后一个例子是 matmul 加 ReLU：按上面的 tiling 写 matmul，accumulator 算完之后、写回 HBM 之前先做 `tl.maximum(acc, 0.0)`。ReLU 没有单独的一次读写，这就是 fusion 用在 matmul 上。Lecture 6 也用 GeLU 比较了三种实现：手写的 PyTorch 版本（每一步一个 kernel，多次读写 HBM）、PyTorch 自带的 fused 版本、对手写版本 `torch.compile`（生成一个 Triton kernel）；后两者都只有一个 kernel、一次读一次写，profiler 里能直接看到 kernel 的个数（讲稿里的计时要在 GPU 上运行才有，这里没有数字）。

A2 的 FlashAttention-2 forward 是同一种写法的放大：grid 是 `(T_q, batch_size)`，每个 instance 用 block pointer load 自己那块 $Q$，只有一个 loop，依次 load 每块 $K$、$V$，用 `tl.dot` 做 matmul，按上面的 recurrence更新 $m$、$l$、$O$，loop 末尾用 `.advance(...)` 推进 pointer，最后写出 $O$ 和 $L$。

**测时间的两个坑。** CUDA 的调用是 asynchronous 的：`torch.matmul` 返回时 GPU 可能还没算完，计时前后都要 `torch.cuda.synchronize()`。第一次调用还包含编译、cache 和 memory 分配，要先跑几次 warm-up 再计时；A2 让你比较 0、1、2 次 warm-up 的结果。Lecture 6 的 `benchmark` function 还用 CUDA event 记录起止时间（不把 CPU 的开销算进去），并重复几次取平均。Benchmark 只给端到端的时间；要知道时间花在哪个 kernel，用 profiler（lecture 用 PyTorch profiler，A2 用 nsys）。Profiler 里的 kernel 名字本身就有信息，例如一个名字以 `cutlass3x_sm100_simt_sgemm_f32` 开头、中间带着 `64x64x16` 的 kernel：cutlass 是 NVIDIA 的线性代数库，sm100 是 Blackwell（B200），f32 是数据类型，64x64x16 是 tile 的形状。

:::back
Arithmetic intensity 解释了[第 3 站](#account)里 TinyStories 只用到峰值 1% 的现象，也会在[第 8 站](#infer)解释为什么生成 token 是 memory-bound 的。
:::

:::from
GPU 的结构和 memory hierarchy、“compute 比 memory 涨得快”、六个让 GPU 变快的手段、control divergence、low precision 的 ReLU 账和 MXFP8、MXFP4、三个 sigmoid 的 recomputation 例子、coalescing 的两种分工、对齐的实测、wave quantization 的 1792 与 1793 的例子、FlashAttention 的三步（tiling、online softmax、fusion）来自 [lecture 5](https://github.com/stanford-cs336/lectures/blob/main/lecture_05.pdf)（文字全部抽出，第 35 至 39、47、48 页渲染成图片看过）。硬件表、occupancy 与 bank conflict、B200 的 wave quantization、arithmetic intensity 的定义和 ReLU、GeLU、dot product、matmul 的例子、roofline、naive softmax 的读写计数、matmul 三种做法的读写次数、Triton 的 programming model、softmax、row sum 和 matmul 加 ReLU 三个 kernel、benchmark 与 profiling 的做法，来自 [lecture 2](http://cs336.stanford.edu/lectures/?trace=lecture_02) 和 [lecture 6](http://cs336.stanford.edu/lectures/?trace=lecture_06) 的讲稿；$B>295$ 的结论来自 [lecture 10](http://cs336.stanford.edu/lectures/?trace=lecture_10)。FlashAttention-2 的 algorithm、backward 的 formula、kernel 的结构要求、Triton tips、benchmark 的 warm-up 与 synchronize 来自 [A2 handout](https://github.com/stanford-cs336/assignment2-systems) 第 2、4 节。$D=4096$ 的 intensity 表、online softmax 的数值例子、attention 的 4.3 μs 与 40 μs 是我算的。没有读 FlashAttention 原论文。
:::

## [parallel] Parallelism 与 communication cost

:::skip
能写出 ring all-reduce 的时间，算出 DDP 和 ZeRO 1/2/3 每个 GPU 每个 parameter 占几个 byte、通信量各多少，推出 data parallel 在什么 per-device batch 下开始被通信卡住，并说出 tensor parallel、pipeline parallel 各适合放在哪一级网络，就可以去第 7 站。快速路线里可以先跳（没有多卡时 Lecture 7、8 用不上），代价是 A2 的后半和大规模训练的系统部分读不懂。
:::

### 为什么要多卡，以及卡之间的路有多宽

两个理由：parameter、gradient、optimizer state、activation 放不进一块 GPU；或者想用更多 FLOPs 早点训完。第 3 站算过，1.64B 的 model 光是 parameter 相关的部分就要 26 GB；70B 的 model 是 1.1 TB，没有哪块卡放得下。

多卡之后，数据在卡之间的搬运成了新的瓶颈。Lecture 7 的层级：一个 node 里 8 块 GPU 通过 NVLink/NVSwitch 相连（B200 的 NVLink 5.0 约 1.8 TB/s，而它的 HBM 是 8 TB/s）；node 之间走 InfiniBand，约 0.05 TB/s。越往外越慢，和单卡上 shared memory、HBM 的层级是同一个故事：这周要做的是减少卡之间的通信，正如上周减少 HBM 的读写。作为对照，lecture 7 也给了家用机器的数：同一台机器上的 GPU 走 PCIe（v7.0、16 lane 约 242 GB/s），不同机器之间走 Ethernet（约 200 MB/s）。Ethernet 要经过 CPU（拷贝到 kernel 的 socket buffer、打 TCP 包、再拷到网卡），InfiniBand 支持 RDMA，一块 GPU 可以直接读写另一台机器上 GPU 的 memory，不经过 CPU。新的硬件在把 NVLink 这一级做大：GB200/GB300 NVL72 把 72 块 GPU（每个 tray 8 块，每个 rack 9 个 tray）放进同一个 NVLink domain。

### Collective operations 与 ring 的代价

几个最常用的 collective：

- All-gather：每块卡有一段，结束时每块卡都有全部。
- Reduce-scatter：每块卡有一份完整的 tensor，结束时每块卡有总和的一段。
- All-reduce：每块卡有一份完整的 tensor，结束时每块卡都有总和。它等于 reduce-scatter 接着 all-gather。

A2 的分析 model：$N$ 块卡，每块卡每秒能向外发 $W$ byte，tensor 大小 $S$ byte。Ring all-gather 把卡排成一圈，每一步每块卡把手上的一段（$S/N$）传给右边，$N-1$ 步之后人人都有全部，用时 $\tfrac{N-1}{N}\cdot\tfrac{S}{W}$。Ring reduce-scatter 一样，只是传之前先把自己那份加进去。All-reduce 是两者相加：

$$t_{\text{all-reduce}}=2\,\frac{N-1}{N}\,\frac SW$$

$\tfrac{N-1}{N}$ 随 $N$ 增大趋于 1，所以时间几乎不随卡数增长。算一个：1.64B 的 model，bf16 的 gradient 是 $S=3.28$ GB。8 块卡、按 1.8 TB/s 算是 3.19 ms，64 块卡是 3.59 ms；同样 8 块卡如果走 0.05 TB/s 的 InfiniBand，是 115 ms。

::fig[cs336-ring] $N=4$ 时的 ring all-gather。动起来时看四条 link：每一步四个 packet 同时沿 ring 走一格，深色是这一步刚收到的；3 步之后每块卡都齐了。Reduce-scatter 的走法相同，只是每块卡传出去之前先把自己的那份加进去。

### Data parallel 与 ZeRO

**DDP（distributed data parallel）。** 每块卡一份完整的 model，batch 分到各卡，各自 forward、backward，然后 all-reduce gradient，各自做一样的 optimizer step。通信是一次 all-reduce，约 2 倍的 parameter 大小。问题在 memory：每块卡都存一份完整的 parameter、gradient、optimizer state，卡再多，能训的 model 也不变大。

**ZeRO** 把这些冗余的部分切开分给各卡。Lecture 8 的例子：bf16 的 parameter 2 byte、bf16 的 gradient 2 byte、fp32 master weights 4 byte、bf16 的两个 Adam moment 各 2 byte，每个 parameter 12 byte，8 块 80 GB 的卡：

| | 每个 parameter 在每块卡上占的 byte | 80 GB 能放下的 parameter |
|---|---|---|
| DDP | $2+2+4+2+2=12$ | 6.7B |
| ZeRO-1：切 optimizer state | $2+2+\tfrac{4+2+2}{8}=5$ | 16B |
| ZeRO-2：再切 gradient | $2+\tfrac{2+4+2+2}{8}=3.25$ | 24.6B |
| ZeRO-3（FSDP）：连 parameter 也切 | $\tfrac{12}{8}=1.5$ | 53.3B |

（只算这几样，不含 activation。）

::fig[cs336-zero] 同一个 12 byte 的拆法在 8 块卡上，每块卡每个 parameter 实际存几个 byte。

通信的账：

- **ZeRO-1** 每块卡只负责更新 $1/N$ 的 parameter。Backward 之后先 reduce-scatter gradient，每块卡拿到自己那 $1/N$ 的 gradient 总和，用自己那份 optimizer state 更新这 $1/N$ 的 parameter，再 all-gather 把更新后的 parameter 发给所有人。All-reduce 本来就是 reduce-scatter 加 all-gather，ZeRO-1 只是把 optimizer step 插在两半中间，通信量仍是 2 倍 parameter。Lecture 8 的说法是在 bandwidth 是瓶颈的情况下它完全免费，没理由不用。
- **ZeRO-2** 在 backward 里每算完一层的 gradient 就立刻 reduce-scatter 出去、释放掉，通信量还是约 2 倍。
- **ZeRO-3 / FSDP** 平时每块卡只存 $1/N$ 的 parameter。Forward 用到某一层前先 all-gather 拼出完整的 weight，用完就扔；backward 再 all-gather 一次；gradient 用 reduce-scatter。通信是 3 倍 parameter，DDP 的 1.5 倍。A2 要求在当前层算 forward 时提前 all-gather 后面的层，让通信藏在计算后面。

:::wrong ZeRO-3 把一切都切成 $N$ 份，activation 也就只剩 $1/N$
ZeRO 切的是 parameter、gradient、optimizer state，每块卡上的 activation 由它自己那份 batch 决定，和切不切 parameter 无关。第 3 站那个 xl 大小的 block 在 batch 4、$T=2048$ 时存下 3.6 GiB 的 activation，用 ZeRO-3 之后每块卡还是 3.6 GiB 一层。Lecture 8 明确说 ZeRO-3 不减少 activation memory。要切 activation，得用 tensor parallel、sequence parallel，或者第 3 站的 activation checkpointing。
:::

### Data parallel 什么时候被通信卡住

只看一个 linear layer $W\in\mathbb R^{D\times F}$，每块卡分到 $b$ 个 token。Backward 要算两个 matmul（对 input 和对 weight 的 gradient），每个 $2bDF$ 次 FLOP，用时 $\tfrac{4bDF}{C}$，$C$ 是每块卡的 FLOP/s。同时要 all-reduce 这个 layer 的 gradient：$DF$ 个数、bf16 每个 2 byte，用时 $2\tfrac{N-1}{N}\cdot\tfrac{2DF}{W}\approx\tfrac{4DF}{W}$。

通信能藏在计算后面的条件是计算时间不短于通信时间：

$$\frac{4bDF}{C}\ \ge\ \frac{4DF}{W}\quad\Longleftrightarrow\quad b\ \ge\ \frac CW$$

$D$、$F$ 消掉了，结论和 model 大小无关：每块卡分到的 token 数至少要是“FLOP/s 除以 byte/s”。B200 的 $C=2.25\times10^{15}$，走 NVLink（1.8 TB/s）时 $b\ge1250$ 个 token；走 InfiniBand（0.05 TB/s）时 $b\ge45000$。总 batch 固定为 $B$ 时，$N=B/b$，所以能用的卡数最多是 $BW/C$。而 batch size 不能无限加大：超过 critical batch size 之后，同样多的 token 带来的 loss 下降越来越少（第 7 站）。这就是只靠 data parallel 扩不下去的原因，lecture 8 的说法是“#machines < batch size，而且接近这个上限时通信开销很高”。

同样的账可以对每种切法做一遍。Lecture 8 引了 TPU Scaling Book 的一张表：一个 FFN 层（两个 matrix，$D\times F$ 和 $F\times D$），batch $B$，bf16，$X$ 路 data/FSDP、$Y$ 路 tensor（model）parallel，每层 forward 与 backward 的计算量和通信 byte：

| 切法 | 计算（forward + backward） | 通信 byte（forward + backward） |
|---|---|---|
| DP | $4BDF/X+8BDF/X$ | $0+8DF$ |
| FSDP | $4BDF/X+8BDF/X$ | $4DF+8DF$ |
| MP（tensor parallel） | $4BDF/Y+8BDF/Y$ | $4BD+4BD$ |
| FSDP + MP | $4BDF/(XY)+8BDF/(XY)$ | $(4BD/X+4DF/Y)+(8BD/X+8DF/Y)$ |

读法：DP 的通信只和 parameter 数 $DF$ 有关，计算随每块卡的 batch $B/X$ 增长，所以要求 $B/X$ 够大，就是上面推的不等式（$8BDF/(XC)\ge8DF/W$）。FSDP 在 forward 多一次 all-gather（$2DF$ 个数，$4DF$ byte），条件一样，只是更紧。Tensor parallel 反过来，通信是 activation（$\propto BD$），和每块卡的 batch 无关，要求的是 $F/Y$ 够大，也就是每块卡上分到的那段 matrix 够宽。两者合用时各自的条件放宽了。那张表旁边的图是 TPU 的 $4\times4\times4$ mesh 上的结果：每块卡分到的 batch 小于约 400 时，没有一种切法是 compute-bound；400 到 850 之间只有 FSDP 加 MP 的组合可以；超过 850 时纯 FSDP 也可以。这组门槛是 TPU 的硬件数，换到 GPU 上要用自己的 $C$ 和 $W$ 重算。

### Tensor parallel 与 pipeline parallel

**Tensor parallel** 把一个 layer 的 matrix 切开。FFN 里 $W_1$、$W_3$ 按 output dimension 切（column parallel），每块卡算出中间层的一段；$W_2$ 按 input dimension 切（row parallel），每块卡用自己那段中间层算出一个部分和；最后一次 all-reduce 加起来。中间层不必拼回来，一个 FFN 的 forward 只要一次 all-reduce。Attention 同理：$Q,K,V$ 按 head 切成 column parallel，output projection 是 row parallel。代价是每一层都要同步交换 activation，lecture 8 给的通信量是每层 $8bsh\tfrac{n-1}{n}$（$b$ batch、$s$ sequence length、$h$ 是 $d$），而且是阻塞的。好处是没有 bubble、不需要大 batch、包装现有 model 很简单。所以它只放在 NVLink 相连的一个 node 之内，通常不超过 8 路；lecture 引 Narayanan 2021 的实验，64 台机器时 $8\times8$（TP 8）的配置最好。

**Pipeline parallel** 按层切：卡 1 放前几层，卡 2 放接下来几层……卡之间只传 boundary 上的 activation（每个 microbatch $bsh$ 个数），是点对点的，适合慢的网络。问题是依赖：卡 2 要等卡 1 算完。不切 microbatch 时，$n$ 块卡每块只有 $1/n$ 的时间在算（lecture 8 的说法是“terrible”）。把 batch 切成 $m$ 个 microbatch 流水作业，$p$ 个 stage 时，空等的时间（bubble）和有效计算之比是 $\tfrac{p-1}{m}$，利用率是 $\tfrac{m}{m+p-1}$：

| $p$ | $m$ | 利用率 |
|---|---|---|
| 4 | 1 | 25% |
| 4 | 4 | 57% |
| 4 | 16 | 84% |

::fig[cs336-pipe] 4 个 stage、4 个 microbatch 的 pipeline。动起来时跟着竖线一格一格往右看：F1 要先流过前面的卡，后面的卡才有活干；backward 又要等最后一块卡先开始。灰色是 bubble：一块卡一共 14 格时间里只有 8 格在算，$8/14=4/7$。

所以 pipeline 的表现强烈依赖 batch：lecture 8 引的数据里，batch 128 时 pipeline 从 1 路加到 8 路，每块卡的 TFLOP/s 只从约 175 降到约 160；batch 8 时从约 165 掉到约 85。还有更省 bubble 的排法。“Zero bubble” pipelining 把 backward 拆成两部分：沿着网络往回传 activation 的 gradient（下一个 stage 在等它），和算 weight 的 gradient（没人等它），后者可以挪到任何空闲的格子里去填 bubble。

### Activation memory 与 sequence parallel

前面的切法都在切 parameter。Activation 也要切，否则长 sequence 时它才是大头。Lecture 8 用的是 Megatron 的估算：每层存下的 activation 是

$$sbh\Big(34+5\frac{as}{h}\Big)\ \text{byte}$$

（16-bit 的 activation，含 dropout mask；$a$ 是 head 数）。$5as/h$ 那一项来自 $s\times s$ 的 attention score 和它的 dropout，可以像 FlashAttention 那样靠 recomputation 去掉。Tensor parallel 把 attention 和 MLP 里的 matmul 切成 $t$ 份，但 LayerNorm 的输入（$4sbh$）、dropout（$2sbh$）、attention 和 MLP 的输入（$4sbh$）这 $10sbh$ 每块卡都还存一整份。这 $10sbh$ 都是沿 sequence 逐个位置做的 operation，所以 sequence parallel 把它们按 sequence 切开：进入 tensor parallel 区域前做一次 all-gather，出来后做一次 reduce-scatter（backward 反过来）。

用第 3 站 A2 那个 xl 大小的 block 的形状代进去（$s=2048$，$b=4$，$h=2560$，$a=16$，$sbh=20{,}971{,}520$，$5as/h=64$），$t=8$：

| 配置 | 每层 activation | 本例 |
|---|---|---|
| 不并行 | $sbh(34+5\tfrac{as}{h})$ | 1960 MiB |
| tensor parallel | $sbh(10+\tfrac{24}{t}+5\tfrac{as}{ht})$ | 420 MiB |
| tensor + sequence parallel | $sbh(\tfrac{34}{t}+5\tfrac{as}{ht})$ | 245 MiB |
| tensor parallel + selective recomputation | $sbh(10+\tfrac{24}{t})$ | 260 MiB |
| 三者都用 | $sbh\tfrac{34}{t}$ | 85 MiB |

这个式子按 16-bit 计，和 A2 那个 fp32、`torch.compile` 过的 3651 MiB 不是同一种设定，不能直接比；要看的是每加一种手段，哪一项被除以 $t$。最后一行所有项都除以 $t$，activation memory 才真正随卡数线性下降。

### Expert parallel、context parallel，以及真实的配置

**Expert parallel。** MoE（第 11 站）的 FFN 由很多个 expert 组成，每个 token 只用其中几个。可以把不同的 expert 放在不同的卡上，token 按 routing 的结果发到对应的卡（all-to-all），算完再发回来。它对 MLP 的作用和 tensor parallel 类似（通信量大、减少 activation），但不切 matmul，而是搬 activation，每块卡上的 matmul 保持完整的大小。

**Context parallel / ring attention。** Sequence 很长时，把一条 sequence 的 activation 按位置切到多块卡上，attention 需要的 key 和 value 沿 ring 在卡之间传递。

Lecture 8 的总表：

| 方法 | 每块卡的 parameter memory | 每块卡的 activation | 主要通信 | 能扩大 global batch 吗 |
|---|---|---|---|---|
| DDP / ZeRO-1 | 不变（ZeRO-1 只切 optimizer state） | 不变 | gradient，$O(\text{params})$ | 能，随 DP 线性 |
| FSDP / ZeRO-3 | 约 $1/\text{DP}$ | 不变 | parameter，$O(\text{params})$，比 DDP 多，可重叠 | 能，随 DP 线性 |
| Pipeline | 约 $1/\text{PP}$ | 看 pipeline buffer | stage 之间的 activation | 不能，但要足够多的 microbatch |
| Tensor | TP 切开的 weight 约 $1/\text{TP}$ | 相关的 matmul activation 约 $1/\text{TP}$ | 每个 block 都有 activation 大小的 collective | 不能 |
| Sequence / context | 不变 | sequence 那一维约 $1/\text{SP}$ | activation、KV | 不能 |
| Expert | expert weight 约 $1/\text{EP}$ | 不变 | token routing 的 all-to-all | 不能，且每个 expert 要分到足够多的 token |

Lecture 8 的经验法则：先在一个 node 内用 tensor parallel（或 MoE 的 expert parallel）到 8 路；model 还放不下，就跨 node 加 pipeline parallel（或用 ZeRO-3，看网络）；放下之后，剩下的卡全用 data parallel。Batch 太小时，用 gradient accumulation 换更大的有效 batch，通信更划算。几个公开的配置：

| model | 配置 |
|---|---|
| Llama 3 405B，第一阶段 | 8192 块 GPU，TP 8、PP 16、DP 64，BF16 MFU 43% |
| Llama 3 405B，主要 pre-training | 16384 块，TP 8、PP 16、DP 128，MFU 41% |
| Llama 3 405B，长 context | 16384 块，TP 8、CP 16、PP 16、DP 8，sequence 131072，MFU 38% |
| DeepSeek V3 | PP 16、EP 64（跨 8 个 node）、ZeRO-1 |
| Gemma 2 | ZeRO-3，加 TP 与 SP，再加 DP |

Llama 3 的论文写明了各维度的顺序是按网络排的：最里层的 TP 要最高的 bandwidth、最低的 latency，放在一台机器之内；最外层的 DP（FSDP）能容忍最高的 latency，因为它可以异步地预取 weight。

:::from
动机、通信的层级和 bandwidth、collective operations 的定义、“all-reduce = reduce-scatter + all-gather”、各种 parallelism 的实现骨架来自 [lecture 7](http://cs336.stanford.edu/lectures/?trace=lecture_07) 的讲稿。PCIe、Ethernet、RDMA、NVL72 的数也来自 lecture 7。ZeRO 1/2/3 的步骤、12 byte 的例子和 6.67B、16B、24.6B、53.3B 这几个数、“ZeRO-1 免费”、ZeRO-3 不减 activation、TPU Scaling Book 的那张表和 400、850 两个门槛、pipeline 的 bubble 比例和 batch 的影响、zero bubble、tensor parallel 的通信量和放置原则、activation memory 的式子和五种配置、expert parallel 与 context parallel、总表、经验法则和 Llama 3、DeepSeek V3、Gemma 2 的配置来自 [lecture 8](https://github.com/stanford-cs336/lectures/blob/main/lecture_08.pdf)（文字全部抽出，第 6、17、27、28、36、46、47、49、55、56、57、66 页渲染成图片看过；pipeline 那张图的 TFLOP/s 是从图上读的近似值）。Ring algorithm和它的用时、column/row parallel 的写法、FSDP 的提前 all-gather 来自 [A2 handout](https://github.com/stanford-cs336/assignment2-systems) 第 7、8 节。A2 第 8 节的 DP、FSDP、TP、2D 计算题用的是三个 matrix 的 SwiGLU FFN，这里只按 lecture 的两 matrix 版本推了 DP 的条件，其余几问没有写答案。All-reduce 的毫秒数、$C/W$ 的数值、pipeline 的利用率表、activation 表里的 MiB 是我算的；1.8 TB/s 是 lecture 7 给的 NVLink bandwidth，没有说明是单向还是双向，所以这些毫秒数只看量级。
:::

## [scaling] Scaling laws 与 IsoFLOP

:::skip
能用 IsoFLOP 方法从一组 run 里读出每个 compute budget 的最优 $N$，用 least squares fit $N_{\text{opt}}\propto C^a$ 并 extrapolate，说明为什么 $D$ 的 exponent 一定是 $1-a$，以及这个 fit 对哪些选择敏感，就可以去第 8 站。快速路线必读（Lecture 9），A3 的第一题就是这一站。从 parametric fit $L=E+A/N^\alpha+B/D^\beta$ 推出最优分配的过程在 [CS4248 第 7 站](../courses/CS4248.html#pretrain)。
:::

### 为什么会是 power law

Lecture 9 从 data scaling 讲起：error 随数据量 $n$ 下降，画在 log-log 的 axis 上是一条 line，也就是 $\text{error}\propto n^{-\alpha}$。为什么是 power law，lecture 用两个例子说明“估计的 error 天然按多项式速度下降”。

**估计一个 mean。** $x_1,\dots,x_n\sim\mathcal N(\mu,\sigma^2)$，用 $\hat\mu=\tfrac1n\sum_ix_i$ 估计 $\mu$。$\hat\mu$ 的 variance 是 $\tfrac1{n^2}\cdot n\sigma^2$，所以

$$\mathbb E\big[(\hat\mu-\mu)^2\big]=\frac{\sigma^2}{n},\qquad\log(\text{error})=-\log n+2\log\sigma$$

Log-log 下 slope 是 $-1$。Regression 这类经典 model 都是这个速度。

**Nonparametric 地估计一个 function。** $x_i$ 在 2 维 unit square 里 uniform，$y_i=f(x_i)+\mathcal N(0,1)$，要估计 $f$。把正方形切成边长 $n^{-1/4}$ 的小格子，每格里取 $y$ 的平均。格子数是 $(n^{1/4})^2=\sqrt n$，每格平均分到 $\sqrt n$ 个点，平均之后的 error 约 $1/\sqrt n$（另有 $f$ 在格子里变化带来的项）。推广到 $d$ 维，error 约 $n^{-1/d}$，slope 是 $-1/d$。

神经网络在 machine translation、speech、language modeling 上测到的 slope 都远比 $-1$ 平缓，lecture 介绍的一种解释（Bahri 2021）是 slope 和数据的 intrinsic dimension 有关；lecture 也说明 intrinsic dimension 的估计方法本身不可靠，这个解释并不严密。

**数据重复。** 数据是有限的，一个 epoch 不够时只能重复。Lecture 引 Muennighoff 等人的 data-constrained scaling law：$U$ 个 unique token 重复 $R$ 次（第一遍之后再过 $R$ 遍），等效的数据量是

$$D'=U+UR^*\big(1-e^{-R/R^*}\big)$$

$R^*$ 是 fit 出来的 constant。$R$ 远小于 $R^*$ 时 $1-e^{-R/R^*}\approx R/R^*$，$D'\approx U(1+R)$，重复的数据和新数据几乎一样值钱；$R\to\infty$ 时 $D'\to U(1+R^*)$，再重复也不增加。Slide 上的实测：重复到约 4 个 epoch 几乎和新数据一样好，之后回报迅速下降，到约 40 个 epoch 就没有价值了。第 9 站的 data mixing 会用到这条。

### 问题：同样的 compute，model 该多大

A3 的设定：你有 48 个 B200 小时训练最终的 model，另有 12 个小时做小规模实验。Compute $C\approx6ND$ 定了之后，$N$ 和 $D$ 此消彼长。在大 model 上直接试错太贵，办法是在一系列小 budget 上找出各自的最优 $N$，看它随 $C$ 怎样变化，再 extrapolate。

为什么固定 $C$ 时 loss 对 $N$ 有一个最低点？Handout 的解释：$N$ 太小，model 装不下数据里的规律，花多少 compute 都没用；$N$ 太大，$D=C/6N$ 太少，走不了几步 gradient 就把 compute 用完了。极端情形 $N\to\infty$ 时连一步都走不完。两头都差，中间必有最低点。

### 读 A3 给的数据

`data/isoflops_curves.json` 里有 9 个 compute budget，每个 budget 有 8 个 run，$N$ 在每个 budget 内按等比递增：前五个 budget（$6\times10^{18}$ 到 $10^{20}$）相邻两个 run 差 1.575 倍，最大和最小差 24 倍；后四个（$3\times10^{20}$ 到 $3\times10^{21}$）相邻差 1.694 倍，跨度 40 倍。每个 budget 取 loss 最低的那个 run（A3 建议这样做，而不是像 Chinchilla 原文那样fit parabola），$D=C/(6N)$：

| $C$（FLOP） | 最优 $N$ | loss | $D=C/6N$ | $D/N$ |
|---|---|---|---|---|
| $6\times10^{18}$ | $7.62\times10^8$ | 5.900 | $1.31\times10^9$ | 1.7 |
| $1\times10^{19}$ | $8.07\times10^8$ | 5.618 | $2.07\times10^9$ | 2.6 |
| $3\times10^{19}$ | $1.54\times10^9$ | 5.107 | $3.25\times10^9$ | 2.1 |
| $6\times10^{19}$ | $1.95\times10^9$ | 4.831 | $5.12\times10^9$ | 2.6 |
| $1\times10^{20}$ | $3.25\times10^9$ | 4.653 | $5.12\times10^9$ | 1.6 |
| $3\times10^{20}$ | $5.90\times10^9$ | 4.311 | $8.47\times10^9$ | 1.4 |
| $6\times10^{20}$ | $6.97\times10^9$ | 4.121 | $1.43\times10^{10}$ | 2.1 |
| $1\times10^{21}$ | $6.86\times10^9$ | 4.003 | $2.43\times10^{10}$ | 3.5 |
| $3\times10^{21}$ | $1.21\times10^{10}$ | 3.773 | $4.12\times10^{10}$ | 3.4 |

::fig[cs336-isoflop] 左：九条 IsoFLOP curve，每条的最低点是那个 budget 的最优 $N$。右：最优 $N$ 对 $C$ 画在 log-log 的 axis 上，排成一条 line，延长出去就是 extrapolation。

### Fit 与 extrapolation

Power law $N_{\text{opt}}=kC^a$ 取 log 之后是 line：$\log_{10}N=a\log_{10}C+\log_{10}k$。对 9 个点做 least squares（就是 DSA2102 里 fit 一条 line 的那件事，只是 coordinate 取了 log）：

$$a=0.4687,\qquad\log_{10}k=0.0657,\qquad N_{\text{opt}}=1.163\,C^{0.4687}$$

$D$ 不必另外 fit。把 $N_{\text{opt}}$ 代进 $D=C/(6N)$：

$$D_{\text{opt}}=\frac{C}{6\times1.163\,C^{0.4687}}=0.1433\,C^{1-0.4687}=0.1433\,C^{0.5313}$$

$N$ 和 $D$ 的 exponent 加起来一定是 1，这是 $C=6ND$ 这个约束决定的，不是数据的性质。直接对 $\log D$ 做 least squares 也得到 0.5313 和 0.1433，可以拿来检查代码。

读法：compute 每多 10 倍，最优 model 大 $10^{0.4687}=2.94$ 倍，数据多 $10^{0.5313}=3.40$ 倍，两者大致各分一半。Extrapolate 到 $C=10^{22}$：

$$N_{\text{opt}}=1.163\times(10^{22})^{0.4687}=2.38\times10^{10},\qquad D_{\text{opt}}=\frac{10^{22}}{6\times2.38\times10^{10}}=7.00\times10^{10}$$

A3 第一题要的是 $10^{23}$ 和 $10^{24}$，代进同一个式子即可；那是作业的答案，这里不列。

这套数据的 $D/N$ 在 1.4 到 3.5 之间，和 Chinchilla Table 3 的约 20（CS4248 第 7 站）差很远。Handout 说这是 synthetic data。比例本身取决于 model、数据、tokenizer、训练细节，能从一个设定搬到另一个设定的只有方法。

:::wrong 每条 IsoFLOP curve 上 loss 最低的那个 run，就是这个 budget 的最优 $N$
它只是 8 个候选里最好的那个，真正的最优点可能落在两个相邻候选之间，而相邻候选差 1.575 或 1.694 倍。表里 $C=10^{21}$ 的最优 $N$（$6.86\times10^9$）甚至比 $6\times10^{20}$ 的（$6.97\times10^9$）还小，真实的最优 $N$ 不会随 compute 增加而变小，这就是 grid 造成的 error。9 个点相对 fit 出的 line 的偏差在 0.85 倍到 1.28 倍之间。换成 Chinchilla 原文的做法，对每条 curve 在 $\log N$ 上 fit 一条 parabola、取它的最低点，exponent 变成 0.515，extrapolate 到 $10^{22}$ 是 $2.79\times10^{10}$，比上面大 17%。Extrapolate 得越远，exponent 上 0.05 的差别放大得越多：每多 extrapolate 10 倍，两个预测之比再乘 $10^{0.05}=1.12$。A3 的 writeup 要你说明 fit 有多可靠，正是这个问题。
:::

### Kaplan 与 Chinchilla 为什么不一样

IsoFLOP 是 Chinchilla（Hoffmann 等人 2022）给的三种方法之一，lecture 9 逐个讲了：

1. **Minimum over runs**：把各种大小的 model 的整条 training curve 画在 compute 为横轴的图上，所有 curve 的下包络线是一条 power law，读出每个 compute 下包络线来自哪个 model。
2. **IsoFLOP**：上面做的。
3. **Joint fit**：在 $(N,D)$ 的网格上训练一批 model，用 least squares fit 一个 $L(N,D)$ 的整体式子（CS4248 第 7 站的 $E+A/N^\alpha+B/D^\beta$），再解出最优分配。

前两种给出相近的结果，第三种在原文里偏离较多。Lecture 提到 Besiroglu 等人 2024 从论文的图里把原始数据恢复出来重新 fit，第三种方法的结果和前两种一致了，原文的 fit 很可能有误。

更早的 Kaplan 2020 给的是 $N_{\text{opt}}\propto C^{0.73}$、$D_{\text{opt}}\propto C^{0.27}$：compute 越多，越该把它花在 model 上，tokens per parameter 随 $C$ 下降。Chinchilla 的结论是两者大致各一半（每个 parameter 约 20 个 token）。两组人都用 joint fit，为什么差这么多？Lecture 给了两篇后续工作的解释：

- “Resolving Discrepancies in Compute-Optimal Scaling” 那篇（Wortsman、Jitsev、Schmidt、Carmon 等人）：Kaplan 的 parameter 计数去掉了最后一层；在很小的 compute 下 warmup 太长；把这两点修正、再调好 optimizer，Kaplan 的设定也得到接近 Chinchilla 的 exponent。Cosine decay 本身不是关键，前提是 batch 和 learning rate 调好了。
- Pearce 与 Song：用 Chinchilla 的 fit 生成 Kaplan 那个规模（1k 到 1.5B parameter）的 training curve，按 total parameter 算 compute-optimal frontier，得到 exponent 0.51，接近 Chinchilla 的 0.50；按 non-embedding parameter 算，在小规模上局部 fit 出 0.78，接近 Kaplan 的 0.73。分歧主要来自数不数 embedding，加上小规模下的一点 nonlinearity。

这和上面 A3 的教训是一回事：exponent 对“怎么数 $N$”“在哪个范围 fit”“训练细节调没调好”都敏感。

### Batch size：critical batch

Batch 越大，每一步的 gradient 越准，但超过某个点之后回报急剧减少。Lecture 9 给的定义：固定一个目标 loss，在不同 batch 下训练，记下到达目标要的步数 $S$ 和 sample 总数 $E=BS$。实验上两者满足

$$\Big(\frac{S}{S_{\min}}-1\Big)\Big(\frac{E}{E_{\min}}-1\Big)=1$$

$S_{\min}$ 是 batch 无限大时的步数，$E_{\min}$ 是 batch 无限小时的 sample 数。Critical batch 定义为 $B_{\text{crit}}=E_{\min}/S_{\min}$。Slide 上注明，它据说接近 gradient covariance 的 trace 与 gradient norm 平方之比，也就是 gradient 的噪声相对于信号有多大。

用一次，看 $B=B_{\text{crit}}$ 时发生什么。记 $u=S/S_{\min}$。$E/E_{\min}=BS/E_{\min}=(B/B_{\text{crit}})\cdot u$，$B=B_{\text{crit}}$ 时就是 $u$，代进去 $(u-1)^2=1$，$u=2$：步数是最少可能值的 2 倍，sample 数也是最少可能值的 2 倍，两头各让一半，这就是 slide 上说的“roughly 2x the steps / passes optimal”。$B=4B_{\text{crit}}$ 时 $(u-1)(4u-1)=1$，即 $4u^2-5u=0$，$u=1.25$，$E/E_{\min}=5$：batch 再大 4 倍，步数只从 $2S_{\min}$ 降到 $1.25S_{\min}$，数据却从 $2E_{\min}$ 涨到 $5E_{\min}$。反过来 $B=B_{\text{crit}}/4$ 时 $u=5$，$E/E_{\min}=1.25$：省数据，但步数是 5 倍。Lecture 的另一个观察是目标 loss 越低，critical batch 越大，所以训练后期可以用更大的 batch；这也是第 6 站 data parallel 扩展的上限。

### 让 scaling 实验便宜：WSD schedule

Chinchilla 式的分析要求每个 $(N,D)$ 都完整训练一遍。原因在 learning rate schedule：cosine schedule 的形状由总步数 $T_c$ 决定，训练 $D$ 个 token 的 run 中途停在 $D/2$ 处，并不等于一个按 $D/2$ 设计 schedule 的 run，不能拿来当数据点。所以 $n$ 个 model 大小、$n$ 个数据量要训练 $n^2$ 次。

Lecture 11 讲的 MiniCPM 和 DeepSeek 用 WSD（warmup、stable、decay）schedule 绕开它：warmup 之后 learning rate 长时间保持 constant，最后一小段快速衰减（MiniCPM 的 decay 约占 10%）。Stable 阶段的 checkpoint 和 $D$ 无关，想要哪个数据量，就从对应的 stable checkpoint 拉出一段 decay。一个 model 大小只要训练一次，$n^2$ 变成约 $n$。Stable 阶段 loss 降得慢，decay 阶段迅速下降，最终和 cosine 差不多。DeepSeek 用的是分两级的阶梯：2000 步 warmup 到最大值，处理完 80% 的 token 时降到最大值的 31.6%，90% 时降到 10%。

有了便宜的 scaling 实验，MiniCPM 选的是 Chinchilla 的方法 1 和方法 3，得到很高的 data/model 比例；DeepSeek 用方法 2（IsoFLOP），fit 出来的 scaling law 准确预测了最终 7B、67B model 的 loss。Lecture 列的后来者：Llama 3 的 IsoFLOP 给出约 39 个 token 每个 parameter；Hunyuan 对 MoE 的 active parameter 做 IsoFLOP，得到 96 比 1。

### Hyperparameter 随规模变化：两条路

另一个问题是 learning rate、batch size 这些 hyperparameter 的最优值本身随规模变化。Lecture 11 介绍了两条路。

**直接 fit（DeepSeek、Qwen、StepFun）。** 假定其余 hyperparameter 不随规模变，在小规模上 grid search learning rate 和 batch，取 loss 在最小值 0.25% 以内的“近似最优”点，fit 它们随 compute 的 power law。StepFun 的大规模 grid search 观察到：pre-training 的 loss 对 learning rate 和 batch 是 convex 的，最小值清楚；最优 batch 主要由数据量决定。Lecture 也提醒这类 fit 对 schedule 敏感（换成 WSD 结论可能变）。

**muP（MiniCPM、CerebrasGPT）。** 改 parametrization，让最优 learning rate 不随 width 变。它从两条要求推出（lecture 跟的是 Yang、Simon、Bernstein 的 spectral condition 那篇）：

- A1：initialization 时每个 activation 的 entry 是 $\Theta(1)$，即长 $n_l$ 的 $h_l$ 的 norm 是 $\Theta(\sqrt{n_l})$。
- A2：走一步 gradient 之后，activation 的变化也是 $\Theta(1)$ 每个 entry。

推 A1。看 deep linear network $h_l=W_lh_{l-1}$，$W_l$ 是 $n_l\times n_{l-1}$，entry 取 $\mathcal N(0,\sigma^2)$。Random matrix 的 spectral norm 约为 $\|W_l\|_*\approx\sigma(\sqrt{n_{l-1}}+\sqrt{n_l})$，而 $\|h_l\|\le\|W_l\|_*\|h_{l-1}\|$（lecture 把这个上界当作量级）。归纳假设 $\|h_{l-1}\|=\Theta(\sqrt{n_{l-1}})$，要 $\|h_l\|=\Theta(\sqrt{n_l})$，就需要 $\|W_l\|_*=\sqrt{n_l}/\sqrt{n_{l-1}}$，于是

$$\sigma=\frac{\sqrt{n_l}}{\sqrt{n_{l-1}}}\cdot\frac1{\sqrt{n_{l-1}}+\sqrt{n_l}}=\Theta\Big(\frac1{\sqrt{n_{l-1}}}\min\Big(1,\sqrt{\tfrac{n_l}{n_{l-1}}}\Big)\Big)$$

（$n_l\ge n_{l-1}$ 时分母约 $\sqrt{n_l}$，$\sigma\approx1/\sqrt{n_{l-1}}$；$n_l<n_{l-1}$ 时分母约 $\sqrt{n_{l-1}}$，$\sigma\approx\sqrt{n_l}/n_{l-1}$。）

推 A2。一个 linear layer 的 SGD update 是 rank 1 的 outer product：$\Delta W_l=-\eta_l\nabla_{h_l}\ell\,h_{l-1}^\top$，所以 $\|\Delta W_lh_{l-1}\|=\|\Delta W_l\|_*\|h_{l-1}\|$。Activation 的变化是

$$\Delta h_l=W_l\Delta h_{l-1}+\Delta W_l(h_{l-1}+\Delta h_{l-1})$$

第一项由归纳和 A1 是 $\Theta(\sqrt{n_l})$；第二项的主要部分是 $\|\Delta W_l\|_*\sqrt{n_{l-1}}$，要它也是 $\Theta(\sqrt{n_l})$，就要 $\|\Delta W_l\|_*=\Theta(\sqrt{n_l}/\sqrt{n_{l-1}})$。再假设 loss 每步的变化是 $\Theta(1)$：$\Delta\ell\approx\langle\Delta W_l,\nabla_{W_l}\ell\rangle$，两个都是 rank 1，等于 $\Theta(\|\Delta W_l\|_*\|\nabla_{W_l}\ell\|_*)$，于是 $\|\nabla_{W_l}\ell\|_*=\Theta(\sqrt{n_{l-1}}/\sqrt{n_l})$。SGD 的 $\Delta W_l=-\eta_l\nabla_{W_l}\ell$ 给出

$$\eta_l=\frac{\|\Delta W_l\|_*}{\|\nabla_{W_l}\ell\|_*}=\Theta\Big(\frac{n_l}{n_{l-1}}\Big)$$

Adam 的 update 大小不随 gradient 变（第 4 站），同样的要求给出 $\eta_l=\Theta(1/n_{l-1})$。对照 standard parametrization：initialization $1/\sqrt{n_{l-1}}$，learning rate $\Theta(1)$。差别在两处：用 Adam 时 learning rate 要随 fan-in 缩小；fan-out 小于 fan-in 的层 initialization 不同。

用一次：一个隐藏层 $n_l=n_{l-1}=n$ 的 model，用 Adam，在 $n=256$ 上调好 learning rate $10^{-2}$。muP 的 parametrization 已经把每层的 learning rate 按 $1/n$ 缩放，换到 $n=4096$ 时这一层实际用的是 $10^{-2}\times256/4096=6.25\times10^{-4}$，而对外暴露的“base learning rate”不用改。Lecture 11 引的复现实验正是看这一点（validation loss，width 每次放大 4 倍）：

| | width | $2^{-10}$ | $2^{-8}$ | $2^{-6}$ | $2^{-4}$ | $2^{-2}$ |
|---|---|---|---|---|---|---|
| muP | 128 | 3.846 | 3.743 | **3.695** | 3.884 | 4.143 |
| muP | 512 | 3.114 | 2.993 | **2.953** | 3.221 | 3.506 |
| muP | 2048 | 2.711 | 2.553 | **2.511** | 2.563 | 3.244 |
| SP | 128 | 3.841 | 3.757 | **3.706** | 3.879 | 4.030 |
| SP | 512 | 3.013 | **2.967** | 2.987 | 3.383 | 7.403 |
| SP | 2048 | **2.738** | 2.902 | 7.247 | 7.477 | 7.314 |

muP 下三个 width 的最优 base learning rate 都是 $2^{-6}$，在 128 上调好就能直接用到 2048；standard parametrization（SP）下最优值从 $2^{-6}$ 移到 $2^{-8}$ 再到 $2^{-10}$，而且在 128 上调好的 $2^{-6}$ 用到 2048 时 loss 是 7.247，直接 diverge。同一组实验放大到 width 8192（10B parameter），最优仍是 $2^{-6}$。MiniCPM 的设置是 scale_emb = 12、scale_depth = 1.4、init_std = 0.1、lr = 0.01，固定 aspect ratio 只放大 width，最优 batch、learning rate、token 与 parameter 之比再用 scaling 分析直接 fit。

muP 在现代 LM 上管用吗？CerebrasGPT（0.1B 到 13B，按 Chinchilla 的做法训练）发现用 muP 的 scaling 更稳定。上面那组复现实验逐项检查了现代 LM 里偏离 muP 理论的部件：SwiGLU 和 squared ReLU、大和小的 batch、各种 initialization 变体、RMSNorm 的 gain、Lion 这类只看 gradient sign 的 optimizer、regularizer。Slides 上列出破坏 learning rate 迁移的是三项：RMSNorm 的可学习 gain（去掉之后性能几乎不受影响）、Lion、强的 decoupled weight decay（0.1，width 128 的最优值变成 $2^{-8}$，而 2048 仍是 $2^{-6}$），最后这个被认为大概是唯一真正重要的失败。Lecture 的结论是 muP 至少比 SP 更容易调。

Optimizer 本身也和规模纠缠。Lecture 11 的提醒：新 optimizer 的比较常常 hyperparameter 没调好，而且结论随 compute 和 token/parameter 之比改变。Muon 是近来被大规模用过的一个：对 matrix 形状的 parameter，momentum $B_t=\mu B_{t-1}+G_t$ 之后，用 Newton–Schulz iteration 把 $B_t=USV^\top$ 近似 orthogonalize 成 $UV^\top$ 再更新。Lecture 引 NanoGPT speedrun 和 Kimi K2 说明它在大规模上确实管用，但收益难以干净地测量。

### Compute-optimal 不是该训练的 model

Chinchilla 的问题是“训练 compute 固定时 loss 最低”。Model 训完之后要被使用无数次，inference 的成本和 $N$ 成正比，所以实际的 model 都远超 compute-optimal 的数据量。Lecture 9 列的 tokens per parameter：GPT-3 2，Chinchilla 20，LLaMA 65B 22，Llama 2 70B 29，Mistral 7B 110，Llama 3 70B 215。预期的使用量越大，前期多花 compute 把小 model 训久一点就越划算。

:::from
A3 的设定、IsoFLOP 方法的步骤、“取最低的 run 而不是 fit parabola”的建议、“曲线为什么有最低点”的解释、数据文件，来自 [A3 handout](https://github.com/stanford-cs336/assignment3-scaling) 第 2 节。Mean estimation 与 nonparametric 两个例子、intrinsic dimension 的解释、data repetition 的式子和 4、40 个 epoch、三种 Chinchilla 方法和 Besiroglu 的复查、Kaplan 的 0.73 与 0.27 和两篇解释（0.51、0.78）、critical batch 的式子、tokens per parameter 的列表来自 [lecture 9](https://github.com/stanford-cs336/lectures/blob/main/lecture_09.pdf)；WSD、MiniCPM 与 DeepSeek 的做法和数字、Llama 3 与 Hunyuan 的比例、StepFun 的观察、muP 的两条要求和推导、muP 的复现结论、Muon 来自 [lecture 11](https://github.com/stanford-cs336/lectures/blob/main/lecture_11.pdf)（两讲文字全部抽出，lecture 9 第 19、24、38、51、52 页和 lecture 11 第 22、27、42、46 至 50、52、53、56、57 页渲染成图片看过）。表、两种 fit、$10^{22}$ 的 extrapolation、偏差范围、parabola fit 的对比、grid 的倍数是我用 numpy 对着数据文件算的；critical batch 在 $B_{\text{crit}}$ 和 $4B_{\text{crit}}$ 的推算、muP 的 $6.25\times10^{-4}$ 是我算的，muP 与 SP 的表是 slides 上的原始数字。
:::

## [infer] Inference：KV cache 与 speculative decoding

:::skip
能算出 KV cache 的大小，说明生成阶段为什么是 memory-bound、batch 怎样拿 latency 换 throughput、GQA、MLA 和 quantization 各从哪里省 byte，prove speculative decoding 的输出 distribution 恰好是 target model 的，并说出 continuous batching 和 PagedAttention 各解决什么浪费，就可以去第 9 站。快速路线不含 Lecture 10，可以先跳；做 A5 时 rollout 由 vLLM 生成，这一站解释它在 optimize 什么。
:::

### 为什么 inference 值得单独一讲

Inference 出现在三个地方：实际使用（chatbot、code completion、agent、batch 处理数据）、evaluation（第 12 站）、RL 里大量 sample 再打分（第 10 站）。Training 是一次性的成本，inference 是反复发生的：lecture 10 引的数字是 OpenAI 每天处理约 8.6T 个 token，而 DeepSeek V4 整个训练用了 32T 个 token。生成多少 token 就花多少 compute，agent 的内部 trace 更可以无限变长。

衡量“快”有三个量：time-to-first-token（TTFT，用户等到第一个 token 出现要多久，交互式应用在乎）、latency（单个请求每个 token 要多少秒，交互式应用在乎）、throughput（所有请求加起来每秒多少个 token，批处理在乎）。开源的 inference 引擎有 vLLM（PagedAttention，下面会讲）、SGLang（RadixAttention，适合 agent 式的负载）、TensorRT-LLM（NVIDIA）、llama.cpp（纯 C++，能在 CPU 上本地跑）。

### Prefill 与 decode

Training 时一整条 sequence 一次 forward 就得到所有位置的预测，可以并行。生成时第 $t+1$ 个 token 依赖第 $t$ 个，只能一个一个来。每生成一个 token 都把整个前缀重新过一遍 model，大量计算是重复的：前缀里每个 token 在每一层的 key 和 value 都不会变。所以把它们存下来，叫 KV cache。

于是 inference 分两段。**Prefill**：把 prompt 一次过完，算出并存下所有 key 和 value，和 training 的 forward 一样可以并行，是 compute-bound 的。**Decode**：每步只算一个新 token，读出 cache 里的全部 key、value 做 attention，再把新的 key、value 追加进去。

Lecture 10 把两段的 arithmetic intensity（第 5 站）逐项数了一遍。记 $B$ 个请求，每个请求已有 $S$ 个 token（作为条件），这一步要算 $T$ 个新位置；prefill 时 $T=S$，decode 时 $T=1$。都用 bf16，每个数 2 byte。

**MLP**（SwiGLU，$W_{\text{up}},W_{\text{gate}}$ 是 $D\times F$，$W_{\text{down}}$ 是 $F\times D$）：读 $X$（$2BTD$ byte）、读三个 weight（$6DF$）、写 $U$ 和 $G$（各 $2BTF$）、写输出（$2BTD$），共 $4BTD+4BTF+6DF$ byte；三次 matmul 共 $6BTDF$ 次 FLOP。$BT$ 远小于 $D$、$F$ 时分母主要是 $6DF$，intensity 约为 $BT$。

**Attention**（只数两个 matmul，假定用 FlashAttention，不写出 $S\times T$ 的 score）：读 $Q$（$2BTD$）、读 $K$ 和 $V$（各 $2BSD$）、写输出（$2BTD$），共 $4BSD+4BTD$ byte；$QK^\top$ 和乘 $V$ 共 $4BSTD$ 次 FLOP。

$$\text{intensity}=\frac{4BSTD}{4BSD+4BTD}=\frac{ST}{S+T}$$

两段代进去：

| | MLP | attention |
|---|---|---|
| prefill（$T=S$） | $BS$ | $S/2$ |
| decode（$T=1$） | $B$ | $\tfrac{S}{S+1}<1$ |

Prefill 时 $BS$ 和 $S/2$ 都很容易超过 295，compute-bound。Decode 时 MLP 的 intensity 是同时在服务的请求数 $B$，要几百个并发请求才够；attention 的 intensity 小于 1，而且和 $B$ 无关，batch 再大也救不了。差别在于：所有请求乘的是同一组 MLP weight，读一次 weight 可以给 $B$ 个请求用；attention 里每个请求有自己的 KV cache，读进来的 key、value 只被自己的一个 query 用一次。Lecture 3 从另一个角度算过同一件事：增量生成时，attention 的 intensity 是 $O\big((\tfrac nd+\tfrac1b)^{-1}\big)$（$n$ 是 sequence length，$d$ 是 hidden dim，$b$ 是 batch），要大 batch、短 sequence 或大 $d$，而 $n/d$ 那一项很难降。Lecture 10 的总结：prefill compute-bound，decode memory-bound。

### KV cache 有多大

每个 token、每一层、每个 key/value head 存一个长 $H$ 的 key 和一个长 $H$ 的 value：

$$\text{每个 token 的 KV cache}=2\times L\times K\times H\times(\text{每个数的 byte})$$

Lecture 10 用 Llama 2 13B 的 config：$L=40$ 层，$K=40$ 个 head，$H=128$，bf16。每个 token $2\times40\times40\times128\times2=819{,}200$ byte，0.78 MiB；sequence 长 1024 时一条就是 800 MiB。Parameter 按讲稿的式子 $2VD+3DFL+(2DNH+2DKH)L$（$V=32000$、$D=5120$、$F=13824$、$N=K=40$）是 13,015,449,600 个，bf16 是 26.0 GB。

### Latency 与 throughput

Decode 是 memory-bound 的，所以估时间只看搬了多少 byte：每一步要把全部 parameter 和全部 $B$ 条 sequence 的 KV cache 从 HBM 读一遍。

$$\text{latency}=\frac{2P+B\times\text{KV}_{\text{seq}}}{\text{HBM bandwidth}},\qquad\text{throughput}=\frac{B}{\text{latency}}$$

H100 的 3.35 TB/s，sequence 长 1024：

| $B$ | memory | 每步 latency | throughput |
|---|---|---|---|
| 1 | 26.9 GB | 8.0 ms | 125 token/s |
| 16 | 39.5 GB | 11.8 ms | 1,359 token/s |
| 64 | 79.7 GB | 23.8 ms | 2,689 token/s |
| 256 | 240.8 GB | 71.9 ms | 3,562 token/s |

$B=1$ 时几乎全是在读 parameter；$B$ 增大，读一次 parameter 被 $B$ 个请求分摊，throughput 上去了，但 KV cache 跟着 $B$ 成正比增长，每一步都更慢。$B=64$ 已经贴着 80 GB，$B=256$ 根本放不下。

### 让 KV cache 变小

Decode 是 memory-bound 的，读的 byte 少了就快。Parameter 那一半要靠后面的 quantization；KV cache 那一半可以改 attention 的结构，前提是 accuracy 掉得不多。

**GQA（grouped-query attention）** 让多个 query head 共用一组 key/value head：$N$ 个 query head、$K$ 个 key/value head，每个 key/value head 服务 $N/K$ 个 query head。$K=N$ 是普通的 multi-head attention（MHA），$K=1$ 是 multi-query attention（MQA），GQA 介于两者之间，KV cache 缩小 $N/K$ 倍。把 $K$ 从 40 减到 8，KV cache 缩小 5 倍（每 token 163,840 byte），$W_K$、$W_V$ 也变小，parameter 降到 113 亿：

| $B$ | memory | 每步 latency | throughput |
|---|---|---|---|
| 1 | 22.8 GB | 6.8 ms | 147 token/s |
| 64 | 33.4 GB | 10.0 ms | 6,417 token/s |
| 256 | 65.6 GB | 19.6 ms | 13,068 token/s |

::fig[cs336-kv] 同一个 13B model，MHA 与 GQA（8 组 KV head）的 throughput 随 batch 的变化，横轴是 log scale。空心点表示放不进 80 GB。

GQA 的代价是 accuracy。Lecture 3 引的结果：MQA 的 perplexity 略有上升（Shazeer 2019），GQA 几乎没有（Ainslie 2023）；lecture 10 引的 DeepSeek-V2 论文的表则显示 MHA 仍比 GQA 好一点。

**MLA（multi-head latent attention，DeepSeek）。** 不存 $K=W_Kh$、$V=W_Vh$（$N\times H$ 维），只存一个压缩过的 vector $c=W_ch$（$C$ 维），用到时再投影出 $K=W_K'c$、$V=W_V'c$。DeepSeek-V2 把 $NH=16384$ 压到 $C=512$。麻烦在 RoPE：不加 RoPE 时，$\langle hW_Q,\,W_{UK}c\rangle=\langle hW_QW_{UK},\,c\rangle$，$W_{UK}$ 可以并进 query 的 projection，attention 直接对 $c$ 算；加了 RoPE，中间夹着依赖位置的旋转 $R_qR_k$，$W_{UK}$ 就并不进去了（lecture 4 的推导）。办法是另加 64 维不压缩、单独做 RoPE 的 key，所以每个 token 每层存 $512+64=576$ 维，而 MHA 存 key 和 value 共 $2\times16384=32768$ 维，小了 57 倍。DeepSeek-V2 论文的表里 MLA 甚至比 MHA 略好。

**CLA（cross-layer attention）。** GQA 在 head 之间共用 KV，CLA 在相邻的层之间共用 KV，实验上改善了 accuracy 和 KV cache 大小之间的折中。

**Local（sliding window）attention。** 每个位置只看最近的 $w$ 个 token，KV cache 只要存 $w$ 个，和 sequence length 无关；堆 $L$ 层之后，有效的 context 是 $Lw$ 量级。代价是 accuracy，常见的解决办法是和 full attention 交错：lecture 3 举的 Cohere Command A 每 4 层有 1 层 full attention，full attention 层不用 positional encoding（NoPE）负责远距离的信息，其余层用 RoPE 加 sliding window 负责近处；Llama 4、Gemma 3、Gemma 4、OLMo 3 也是 sliding window 与 full 交错。DeepSeek V4 为了 1M 的 context 用了几种组合：每 $m$ 个 token 压成 1 个的 Compressed Sparse Attention、只挑 top-$k$ 个位置的 DeepSeek Sparse Attention、压得更狠的 Heavily Compressed Attention。第 11 站的 linear attention 和 state space model 是更彻底的一条路。

:::wrong 把 batch 开大，每个请求也会生成得更快
Throughput 是所有请求加起来的速度。上表里 $B$ 从 1 到 256，throughput 涨了 28 倍，而单个请求每生成一个 token 要等的时间从 8.0 ms 涨到 71.9 ms，慢了 9 倍。交互式应用在乎 latency，离线批处理和 RL 的 rollout 在乎 throughput，batch size 要按用途选。Lecture 10 还提到最容易的提速：同样的 model 起 $M$ 份 replica，latency 不变，throughput 乘 $M$；更难的是把 model 和 KV cache 切到多块卡上。TTFT 基本由 prefill 的时间决定，所以 prefill 用小 batch 让第一个 token 早点出来，decode 用大 batch 提高 throughput。
:::

### Quantization：每个数少几个 bit

另一半是 parameter。Quantization 把数存成更低的 precision，读的 byte 少，decode 就快。Lecture 10 的最简单的形式是 scale 加 zero point：$q=\mathrm{round}(x/s)+z$，用时 $\hat x=(q-z)s$。取 $x=5.2342$，$s=0.1$，$z=4$：$x/s=52.342$，round 成 52，加 4 得 $q=56$；还原是 $(56-4)\times0.1=5.2$，误差 0.0342，最多是 $s/2=0.05$。$s$ 和 $z$ 决定了能表示的范围和间距，一般每层或每个 tensor 一组。

各种精度：fp32（4 byte）训练时 parameter 和 optimizer state 要用；bf16（2 byte）是 inference 的默认；fp8（1 byte）敢的话可以拿来训练；int8（1 byte，$[-128,127]$）比 fp8 便宜但更不准，只用于 inference；int4（0.5 byte，$[-8,7]$）更便宜也更不准。

两种做法。Quantization-aware training（QAT）在训练的 forward 里先 quantize 再 dequantize，模拟 quantization error，让 weight 适应它，代价是要大规模训练。Post-training quantization（PTQ）训完再做，便宜得多：在一些样本数据上跑一遍，定出每层或每个 tensor 的 scale 和 zero point。GPTQ 在 PTQ 里加了一步：用 Hessian 的信息调整还没 quantize 的 weight，补偿已经 quantize 的那部分的 error。AWQ（activation-aware quantization）的观察是少数 activation channel 特别大，乘到这些 channel 上的 weight 更重要；按 activation 挑出 0.1% 到 1% 的 weight 保留高 precision，其余 quantize。Lecture 引的结果是 fp16 到 int3，memory 降到四分之一，速度快 3.2 倍。

### Pruning 与 distillation

更直接的办法是把 model 的一部分拆掉，再补救。Lecture 10 讲的 NVIDIA 的做法：在一个小的 calibration set（1024 个 sample）上估计每一层、每个 head、每个 hidden dimension 的重要性；拆掉不重要的，得到更小的 model；再用原 model distill 这个剪过的 model。和从头训练一个小 model 相比，它的 weight 从大 model 初始化。Lecture 的总结是两条配方：从头定义更快的架构并训练；或者定义更快的架构、用原 model 的 weight 初始化，再用 distillation 修补。

### Speculative decoding

Decode 一次只生成一个 token，而 prefill 可以并行处理很多 token。也就是说，检查一串 token 比生成它们便宜。Speculative decoding 让一个小的 draft model $p$ 先猜几个 token，再让 target model $q$ 一次 forward 把它们都检查一遍。

对每个猜出的 token $x$（它是从 $p$ sample 出来的）：以 probability $\min\big(1,\tfrac{q(x)}{p(x)}\big)$ 接受；拒绝时，从

$$r(x)=\frac{\max(q(x)-p(x),\,0)}{\sum_y\max(q(y)-p(y),\,0)}$$

里重新 sample 一个，并丢掉后面猜的 token。如果 $\gamma$ 个全被接受，target 那一次 forward 已经顺带算出了第 $\gamma+1$ 个位置的 distribution，再从它 sample 一个 token，所以一轮最少产出 1 个、最多 $\gamma+1$ 个 token（lecture 10 放的是 Chen 等人 2023 的 Algorithm 2，就是这样写的）。

这样得到的 token 恰好服从 $q$。Proof 只需两行。最终输出 $x$ 有两条路：$p$ 猜中 $x$ 且被接受，probability 是 $p(x)\min\big(1,\tfrac{q(x)}{p(x)}\big)=\min(p(x),q(x))$；或者猜了某个 token 被拒绝，再从 $r$ 抽到 $x$。被拒绝的总 probability 是 $1-\sum_y\min(p(y),q(y))$，而

$$\sum_y\max(q(y)-p(y),0)=\sum_yq(y)-\sum_y\min(p(y),q(y))=1-\sum_y\min(p(y),q(y))$$

两者相等，所以第二条路的 probability 正好是 $\max(q(x)-p(x),0)$。加起来，$\min(p,q)+\max(q-p,0)=q(x)$。

Lecture 10 用两个 token 的例子核对。取 $p=(0.7,\,0.3)$，$q=(0.4,\,0.6)$：draft 多猜了 A。猜 A 时以 $0.4/0.7=4/7$ 接受；猜 B 时 $q/p>1$，总是接受。$r=(0,\,0.3)/0.3=(0,1)$，拒绝之后一定换成 B。所以 $P(A)=0.7\times\tfrac47=0.4$，$P(B)=0.3+0.7\times\tfrac37=0.6$，正是 $q$。

能省多少，取决于 draft 和 target 有多像。上面的 proof 里已经出现了关键的量：一个猜出的 token 被接受的 probability 是 $\sum_y\min(p(y),q(y))$。Leviathan 等人 2023 把它在各个位置上的平均记作 $\alpha$（他们的记号里 target 和 draft 的字母与这里相反）。假设每个位置被接受与否独立、probability 都是 $\alpha$，一轮里被接受的个数是一个“到第一次失败为止”的 geometric variable，上限是 $\gamma$，再加上最后那 1 个（拒绝后重新 sample 的，或全部接受后多 sample 的）。产出 $k+1$ 个 token 的 probability 是前 $k$ 个接受、第 $k+1$ 个拒绝，$\alpha^k(1-\alpha)$（$k<\gamma$），全部接受是 $\alpha^\gamma$，所以

$$\mathbb E[\#\text{tokens}]=\sum_{k=0}^{\gamma-1}(k+1)\alpha^k(1-\alpha)+(\gamma+1)\alpha^\gamma=\frac{1-\alpha^{\gamma+1}}{1-\alpha}$$

（第二个等号：把 $\mathbb E=\sum_{j\ge1}P(\#\ge j)$ 写开，$P(\#\ge j)=\alpha^{j-1}$，$j=1,\dots,\gamma+1$，几何级数求和。）用上面两个 token 的例子：$\alpha=\min(0.7,0.4)+\min(0.3,0.6)=0.7$，$\gamma=4$ 时每轮平均 $\tfrac{1-0.7^5}{0.3}=2.77$ 个；$\alpha=0.8$ 时是 3.36 个。论文还给了 wall-clock 的加速：draft 跑一次的成本是 target 的 $c$ 倍，一轮要跑 $\gamma$ 次 draft 加 1 次 target，加速是 $\tfrac{1-\alpha^{\gamma+1}}{(1-\alpha)(\gamma c+1)}$；$\alpha=0.8$、$\gamma=4$、$c=0.05$ 时是 2.80 倍，$c=0.1$ 时是 2.40 倍。

实践中的组合如 70B 配 8B、8B 配 1B，draft 往往用 distillation 训得更像 target。改进 draft 的两个方向：Medusa 让 draft 一次并行地猜出多个 token；EAGLE 让 draft 用 target model 的高层 feature 来猜。

### 动态的负载：continuous batching 与 PagedAttention

前面都假定 $B$ 个请求整整齐齐。实际服务时，请求在不同时刻到达，长度各不相同，还常常共享前缀（同一个 system prompt，或者同一个 prompt sample 多个回答）。

**Continuous batching（Orca）。** 静态的 batching 要等一个 batch 里最长的那个生成完，才能换下一批，先完成的请求占着位置空等，新来的请求也要等。Orca 的做法是按 iteration 调度：decode 是一步一步做的，每一步结束都可以把完成的请求移出、把新到的请求加进来。随之而来的问题是各请求长度不同，不能拼成一个 $B\times S\times H$ 的 tensor。Orca 的 selective batching：attention 每个请求单独算（它依赖各自的 KV cache 和长度），其余的 operation（MLP、各种 projection）与位置无关，把所有请求的 token 拼成一个 $[3+9+5,\,H]$ 这样的大 matrix 一起算。

::fig[cs336-contbatch] 5 个请求在 3 个 slot 上生成，竖线标出 R4、R5 到达的时刻。上：静态 batching，一批要等最长的 R1 结束，R4、R5 到了也要等下一批。下：continuous batching，R2 一结束 R4 就接上，R3 一结束 R5 就接上。

**PagedAttention（vLLM）。** 以前的做法是请求一来就为它在 KV cache 里预留一段连续空间，长度按“prompt 加最长可能的回答”算。实际生成的往往短得多，预留了没用上的部分浪费掉（internal fragmentation）；各段之间还会留下放不下新请求的空隙（external fragmentation）。PagedAttention 照搬操作系统的 paging：把每个请求的 KV cache 切成固定大小的 block，block 在物理上不必连续，用一张 block table 记录“第几个逻辑 block 存在哪个物理 block”，生成满一个 block 才再分配下一个。共享前缀的请求可以指向同一组物理 block，只有在某个请求要往共享的 block 里写新内容时，才把那个 block 复制一份（copy-on-write）。vLLM 另外还用 kernel 把读 block 和算 attention 融合、用 FlashAttention 和 FlashDecoding 这些新 kernel、用 CUDA graph 减少 kernel launch 的开销。

::fig[cs336-paged] 两个请求共享同一个 system prompt。逻辑上每个请求的 KV cache 是连续的几个 block，物理上分散在各处；前两个 block 两个请求共用，只存一份。

:::from
Inference 的用途和三个指标、KV cache 的动机、MLP 与 attention 的 intensity 推导、Llama 2 13B 的 config 和 latency/throughput 的 model、TTFT 与 batch 的取舍、GQA、MLA 的 512 加 64、CLA、sliding window 与 DeepSeek V4、quantization 的 scale/zero point 例子和各种 precision、QAT 与 PTQ、GPTQ、AWQ、pruning 加 distillation、speculative sampling 的 algorithm（lecture 里的图是 Chen 等人的 Algorithm 2，看过）和两个 token 的 proof 框架、Medusa 与 EAGLE、continuous batching、selective batching、PagedAttention，来自 [lecture 10](http://cs336.stanford.edu/lectures/?trace=lecture_10) 的讲稿；讲稿里的数值结果要运行才会显示，表里的每个数和 quantization 例子的数是我按它的 formula 重算的。MLA 与 RoPE 冲突的推导来自 [lecture 4](https://github.com/stanford-cs336/lectures/blob/main/lecture_04.pdf) 第 58 页，GQA 与 MQA 的 accuracy、增量生成的 intensity、Command A 的交错来自 [lecture 3](https://github.com/stanford-cs336/lectures/blob/main/lecture_03.pdf)。一般情形的两行 proof 是我补的。Expected 接受长度的 formula、$\alpha=\mathbb E[\sum\min(p,q)]$ 和 wall-clock 加速的式子读的是 [Leviathan 等人 2023](https://ar5iv.labs.arxiv.org/html/2211.17192) 第 3 节；那个级数求和的推导是我补的。
:::

## [data] Data：来源、filtering、dedup 与 mixing

:::skip
能说出训练数据从哪些来源来、各有什么法律和技术上的限制，一份 Common Crawl 文档要过哪几道 filter、每道防什么，能写 exact line dedup，能 prove MinHash 的 collision probability 等于 Jaccard similarity，用 $1-(1-s^r)^b$ 选 band 的 $b$ 和 $r$，并说出 data mixing 为什么要考虑 epoch，就可以去第 10 站。快速路线里可以和 A4 一起跳，代价是缺少数据清洗的实操。
:::

### 为什么数据最难说清楚

Lecture 13 开头的观察：open-weight 的 model（例如 Llama 3）会把架构、甚至训练过程写得很清楚，数据却几乎一个字不提。原因有两个：竞争，以及版权上的风险。数据又是一个 long-tail 的问题，随投入的人力增长，不像架构和系统那样有一劳永逸的解。

训练通常分三段：pre-training 用大量原始文本（网页为主）；mid-training 用质量更高的数据继续训，加强特定能力；post-training 用对话记录或 RL。三段之间界限模糊，总的趋势是从大量的低质量数据走向少量的高质量数据。Pre-training 加 mid-training 之后得到 base model，post-training 之后得到 instruct（chat）model；lecture 提到越来越多的 model 不再发布 base model（例如 Qwen3.5-397B-A17B 只发布了 instruct 版本）。OLMo 2 是三段都公开了数据的例子。

### 数据从哪里来

“LM 用整个 internet 训练”并不准确。Web 是一组活着的 server，不能直接拿来训练；要先用 crawler 从一组 seed URL 出发，下载页面、把页面里的链接加入队列，再下载。很多内容根本爬不到：动态内容（Discord、wandb 这类网站 URL 不变，要点按钮、填表才出现内容）；要登录（往往还要付费）的内容（Facebook、X、LinkedIn、NYTimes）；`robots.txt` 声明不许爬的内容（这是自愿遵守的）；Cloudflare 这类检测 bot 的服务、按 IP 或国家封锁、rate limit；以及 terms of service 禁止用 bot 下载、或者你没有复制的 license。Lecture 引的“decline of consent”研究检查了 C4、RefinedWeb、Dolma 里的 URL，发现 `robots.txt` 和 ToS 里的限制逐年增加。另一端是 shadow library（LibGen、Z-Library、Anna's Archive、Sci-Hub）：技术上也在 web 上，但从法律上看是盗版。

**Common Crawl** 是 2007 年成立的非营利组织，大约每个月爬一次，每次新增 30 到 50 亿个页面，累计约 3000 亿页；2026 年 4 月那一次有 21.9 亿页、372.2 TB。它用 Apache Nutch，从至少几亿个 seed URL 出发，要决定爬哪些页（selection policy）、怎样不压垮别人的 server（politeness policy，遵守 `robots.txt`）、多久回来看一次（re-visit policy）。它提供 WARC（原始的 HTTP 响应，即 HTML）、WAT（抽出的 metadata，例如页面里的链接和标题）、WET（Common Crawl 自己从 HTML 抽出的纯文本）。更专门的来源：Wikipedia 每隔几周发布 dump，不用爬（lecture 提醒有人利用 dump 的时间点做 data poisoning：在 dump 之前插入恶意编辑，赶在被回滚之前进入 dump）；GitHub 的代码用 git protocol 下载，issue、PR、comment 这些 metadata 来自 GitHub Archive；arXiv 有 S3 上的 bulk download，作者可以选 all rights reserved 或 Creative Commons。

**版权。** Lecture 13 的总结是“网上几乎一切都受版权保护”：美国 1976 年的 Copyright Act 保护固定在任何有形媒介上的原创作品，门槛极低，不需要登记就受保护（起诉侵权前才需要登记）；保护的是 expression，不是 idea（一个 quicksort 的实现受保护，quicksort 这个想法不受）。合法地使用一份受保护的作品，要么有 license（lecture 的说法是“a license is a promise not to sue”，Creative Commons 是其中一种；Google 与 Reddit、OpenAI 与 Shutterstock 和 StackExchange 都签了训练数据的授权），要么诉诸 fair use。Fair use 看四个因素：使用的目的和性质（教育优于商业，transformative 优于复制）、作品的性质（事实性优于虚构，非创作性优于创作性）、使用的量（片段优于全文）、对原作品市场的影响。放到 LM 上：训练的第一步“复制数据”本身就可能构成侵权；训练应当是 transformative 的；model 应当学到一般的想法（巫师），而不是具体的表达（《Harry Potter》）；但 LM 无论版权如何都会影响作者和画家的市场。即使有 license 或 fair use，terms of service 还可以另加限制（YouTube 的 ToS 禁止下载视频，即使视频是 Creative Commons 的）。几个诉讼：NYT 诉 OpenAI（2023）；Bartz 等作者诉 Anthropic，2025 年的 summary judgement 认为用他们的书训练是 fair use，盗版下载这些书不是，最后 Anthropic 付了 15 亿美元和解；Kadrey 等诉 Meta，2025 年的 summary judgement 认为这一情形下用书训练是 fair use，torrent 下载的指控仍未判。Lecture 的结论：目前训练在具体案例里被认定为 fair use，一般情形不清楚；盗版明确违法；这一领域仍在快速变化。

### 一份 dataset 的演变

Lecture 13 按时间走过了一串 dataset。每一个都在回答同一个问题：从原始的 web 和各种专门来源出发，用什么规则或 model 决定留下什么。

| dataset（用它训练的 model） | 来源与处理 | 规模 |
|---|---|---|
| BERT（2019） | Wikipedia 加 BooksCorpus（Smashwords 上标价 0 美元的自出版书，7K 本，后因违反 ToS 下架）；sequence 是整篇文档而不是句子 | |
| WebText（GPT-2） | Reddit 上 karma $\ge3$ 的帖子链接到的页面；OpenWebText 是它的公开复现 | 800 万页，40 GB |
| CCNet | Common Crawl 去重、fastText 语言识别，用 KenLM 5-gram 留下“像 Wikipedia”的文档 | |
| C4（T5） | 一个 Common Crawl snapshot（1.4T token）加手写规则：只留以标点结尾、至少 5 个 word 的行，去掉少于 3 句的页、含“bad words”的页、含 `{`、lorem ipsum 的页，langdetect 英语 probability 0.99 | 806 GB，156B token |
| GPT-3 | 处理过的 Common Crawl（classifier 区分 WebText、Wikipedia、书和其余，fuzzy dedup）、WebText2、Books1、Books2、Wikipedia | 570 GB，400B token |
| The Pile（GPT-J、GPT-NeoX） | 志愿者整理的 22 个高质量 domain：Pile-CC（用 jusText 从 WARC 抽文本）、PubMed Central、arXiv、Enron email、Project Gutenberg、Books3（后因版权下架）、StackExchange 等 | 825 GB，约 275B token |
| MassiveText（Gopher） | MassiveWeb（手写规则，不用 classifier；用 Google SafeSearch 过滤 toxicity）加 C4、书、新闻、GitHub、Wikipedia | 10.5 TB（Gopher 只用了 12%） |
| LLaMA | CCNet 处理的 Common Crawl（classifier 判断是否像被 Wikipedia 引用的页面）、C4、GitHub、Wikipedia、Gutenberg 与 Books3、arXiv、StackExchange；RedPajama v1 复现了它，SlimPajama 用 MinHash LSH 去重得到 627B 的子集 | 1.2T token |
| RefinedWeb（Falcon） | 只用 web：trafilatura 从 WARC 抽文本，Gopher 规则，刻意不用 model 过滤，5-gram MinHash 去重 | 公开 600B（共 5T） |
| FineWeb | 复现并改进 RefinedWeb：95 个 dump，URL 过滤，语言 probability $>0.65$，Gopher、C4 加更多规则，MinHash，匿名化 email 和 IP | 15T token |
| Dolma | Reddit、40M 篇 Semantic Scholar 论文、C4、Gutenberg、Wikipedia；Common Crawl 部分用规则过滤、Jigsaw classifier 去 toxicity、Bloom filter 去重 | 3T token |
| DCLM | 一个统一的 240T token 的 DCLM-pool，用 fastText quality classifier 过滤（positive 是 OpenHermes-2.5 和 ELI5，各 20 万，negative 是 RefinedWeb） | baseline 3.8T token |
| Nemotron-CC | DCLM 和 FineWeb-Edu 删掉了 90% 的数据，太激进；用 jusText（抽出的 token 更多）、classifier ensemble、对低质量数据用 LM 改写、对高质量数据用 LM 生成 QA | 6.3T token（高质量子集 1.1T） |
| The Stack | GitHub Archive 里的 repository 名字，git clone 了 1.37 亿个 repository、510 亿个文件（unique 的 50 亿），只留 MIT、Apache 这类宽松 license，MinHash 去重 | 3.1 TB 代码 |
| Common Pile | 只用宽松 license 的数据 | 8 TB |

两个对比用于理解规模：Llama 3 训练了 15T token，Qwen3 是 36T。Common Pile 回答的问题是“只用有明确 license 的数据能训出好 model 吗”：能训得不错，但 token 不够多时难以竞争；还有 license laundering（把受版权保护的作品以宽松 license 重新发布）、collection license（Dolma 是 ODC-By）不覆盖单篇文档、用未授权数据训练的 model 生成的 synthetic data 算什么，这些都没有定论。Lecture 13 的结论是“data does not fall from the sky”：live service、原始数据、处理过的数据，每一步都要花功夫。

### 从网页到训练文本

原始数据不是文本：是 HTML、PDF（arXiv）、目录树（代码 repository）。A4 第一步就让你自己用 Resiliparse 从 WARC 抽文本，再和 WET 比较：HTML 转文本要去掉导航栏、广告，表格和图片怎么 linearize 没有标准答案，这一步本身是有损的，lecture 14 引 DCLM 的结果说抽取的质量直接影响 model 在下游任务上的 accuracy。常用的工具有 trafilatura、resiliparse、jusText。PDF 更难：FinePDFs 从 Common Crawl 里找 PDF，被截断的重新下载，用 VLM 做 OCR，大量的清洗之后仍丢了很多版面信息。

Lecture 14 把各种 filter 统一成一件事：给定一小份“好”的 target data $T$ 和海量的 raw data $R$，从 $R$ 里找出像 $T$ 的子集。要求是能从 $T$ 推广出去，并且极快（要跑在 $R$ 上）。一般的做法：用 $T$ 和 $R$ 估计一个 model，得到一个 scoring function，按分数留下 $R$ 里的 example。打分函数有两类：$T$ 的 generative model（例如 KenLM 的 n-gram model，分数是 $p_T(x)$），或者一个简单的 classifier（例如 fastText，分数是 $p(T\mid x)$）。有的 dataset 刻意不用 model 过滤（C4、Gopher、RefinedWeb、FineWeb、Dolma），有的用（GPT-3、LLaMA、DCLM），后者正在成为主流。A4 里依次实现的：

- **Language identification。** fastText 现成的 `lid.176.bin`，支持 176 种语言，输出每种语言的 probability。Dolma 保留英语 probability $\ge0.5$ 的页面；A4 提供的英语 WET 用的 threshold 是 0.7。
- **PII masking。** 把 email、电话号码、IP 地址替换成占位符。
- **Harmful content。** 用 classifier 去掉 NSFW 和 toxic 的内容。
- **Gopher 的规则。** A4 要求实现其中四条：文档少于 50 个或多于 100,000 个 word 就去掉；平均 word 长度不在 3 到 10 个 character 之间就去掉；超过 30% 的行以省略号结尾就去掉；含至少一个字母的 word 少于 80% 就去掉。这些规则简单、可解释，能清掉登录页、占位页、只剩图片说明的页面。
- **Quality classifier。** Positive example 取 Wikipedia 页面引用的外部链接指向的网页，negative example 取 random 的 Common Crawl 页面，训练一个 fastText classifier，输出的分数当质量分。LLaMA 和 RedPajama 是这么做的，GPT-3 用的是类似的思路（positive example 是 Wikipedia、WebText2、书）。

按分数留下时可以是确定的 threshold，也可以是随机的。GPT-3 的规则是 `np.random.pareto(9) > 1 - score` 时保留。NumPy 的 `pareto` 取的是 Lomax distribution，$P(X>x)=(1+x)^{-9}$，所以保留的 probability 是 $(2-\text{score})^{-9}$：score 为 1 时 1，0.9 时 0.424，0.75 时 0.134，0.5 时 0.026，0 时 0.002。高分的几乎全留，低分的也留下一小部分，保持一点多样性。

Lecture 14 的其他例子：

- **OpenMathText**：先用规则（例如含 LaTeX 命令）筛，再用在 ProofPile 上训练的 KenLM 留下 perplexity $<15000$ 的，再训一个判断“是否数学写作”的 fastText classifier；得到 14.7B token，在上面训练的 1.4B model 比用 20 倍数据训练的 model 更好。
- **phi-1**：理念是用“教科书质量”的数据训练小 model。用 GPT-4 按“对学基础编程的学生有多大教育价值”给 The Stack 的 Python 子集里 10 万个样本打分，作为 positive，在 pre-train 过的 codegen model 的 embedding 上训练 random forest classifier，再用它筛选整个子集。在 HumanEval 上，1.3B 的 model 用原始 Python 子集训练 96K 步是 12.19%，用筛过的数据 36K 步就到 17.68%。
- **Dolma 的 toxicity filter**：用 Jigsaw Toxic Comments（2018，Wikipedia talk page 的评论，label 了 toxic、severe_toxic、obscene、threat、insult、identity_hate）训练 classifier。A4 用的 NSFW 和 hate speech classifier 就是 Dolma 发布的这两个。

Threshold 没有唯一的最优值。Lecture 14 指出它和训练规模有关：训练得越久，越需要更多（质量稍低）的数据，threshold 应该放宽；训练得短，就只要最好的那部分。

### Exact line deduplication

重复有两种：完全相同的（镜像网站、GitHub 的 fork）和近似相同的（只差几个 token）。Lecture 14 把 dedup 的设计拆成三个选择：item 是什么（句子、段落、文档）；怎样算匹配（完全相同、有共同的子单元、共同子单元的比例）；匹配了怎么办（全删、留一个）。难点在于 dedup 本质上是拿每个 item 和其他所有 item 比，必须找到 linear time 的做法，hash 就是为此。Hash function 把 item 映射成短得多的值，两个不同的 item 映射到同一个值叫 collision。SHA-256 这类 cryptographic hash 几乎不会 collision，但慢；MurmurHash、CityHash 不保证抗 collision，但快，适合 hash table，lecture 用的是 MurmurHash。最简单的 exact dedup：item 是整个 string，按 hash 分组，每组留一个；这是 MapReduce 式的写法，容易并行。C4 的做法是以连续 3 句为 item，完全相同就只留一份；lecture 提醒，从文档中间删掉 3 句之后，剩下的文档可能不再连贯。

很多网页共享同样的页眉、菜单、页脚。A4 的做法：第一遍数每一行在整个 corpus 里出现几次，第二遍改写每个文档，只保留出现恰好一次的行。出现多次的行，所有副本都删掉，剩下的往往就是每页独有的正文。存计数时用行的 hash 当 key，而不是行本身，memory 只和不同行的个数有关，和行的长度无关。

### MinHash：collision probability 等于 Jaccard similarity

近似重复（只改了年份和作者名的 license、模板生成的页面）需要 fuzzy dedup。把文档表示成 word n-gram 的 set，两个 set 的 similarity用 Jaccard similarity $J(A,B)=\tfrac{|A\cap B|}{|A\cup B|}$。“the cat sat on the mat”和“the cat sat on a mat”的 word bigram：前者 {the cat, cat sat, sat on, on the, the mat}，后者 {the cat, cat sat, sat on, on a, a mat}，共有 3 个，union 7 个，$J=3/7=0.43$。

两两比较是 $O(n^2)$，对整个 Common Crawl 不可行；存下每个文档的 n-gram set 也比文档本身还大。MinHash 给每个文档一个短的 signature：取 $k$ 个 random hash function，第 $i$ 个 entry 是 set 里所有 n-gram 的 hash 值的 min。

关键性质：对一个 random 的 hash function $h$，$P\big(\min h(A)=\min h(B)\big)=J(A,B)$。Proof：hash 在 $A\cup B$ 上诱导出一个 random 的顺序，排在最前面的那个 element 是 $A\cup B$ 中每个 element 的 probability 相等。如果它在 $A\cap B$ 里，它同时是 $A$ 的最小和 $B$ 的最小，两者相等；如果它只在 $A$ 或只在 $B$ 里，那一边的最小是它，另一边不是，两者不等。所以相等的 probability 是 $\tfrac{|A\cap B|}{|A\cup B|}$。Lecture 14 的例子：5 个 element，$A$ 有 1 到 4，$B$ 有 1、2、3、5，前三个共有，$J=3/5$。

于是两个 signature 中相等的 entry 的比例，就是 $J$ 的 estimate。A4 handout 的例子：$[1,2,3,2]$ 和 $[5,2,3,4]$ 有两列相同，估计为 $2/4$。

### LSH：把 threshold 变陡

有了 signature 还是要两两比较。Locality-sensitive hashing 把长 $k$ 的 signature 切成 $b$ 个 band，每个 band $r$ 个 entry（$k=br$）。两个文档只要有某一个 band 的 $r$ 个 entry 完全相同，就进同一个 bucket，成为候选。每个 band 单独 hash 一次就能分进 bucket，不需要两两比较。

设两个文档的 Jaccard similarity 是 $s$。一个 band 全部相同的 probability 是 $s^r$（每个 entry 独立地以 probability $s$ 相同），$b$ 个 band 都不同的 probability 是 $(1-s^r)^b$，所以

$$P(\text{成为候选})=1-(1-s^r)^b$$

| $(b,r)$ | $s=0.7$ | 0.8 | 0.85 | 0.9 | 0.95 | threshold $(1/b)^{1/r}$ |
|---|---|---|---|---|---|---|
| $(10,10)$ | 0.249 | 0.679 | 0.888 | 0.986 | 1.000 | 0.794 |
| $(20,20)$ | 0.016 | 0.207 | 0.546 | 0.925 | 1.000 | 0.861 |
| $(10,20)$ | 0.008 | 0.110 | 0.327 | 0.726 | 0.988 | 0.891 |

::fig[cs336-lsh] 三组 $(b,r)$ 成为候选的 probability。单个 MinHash 的 collision probability 就是 $s$ 本身（虚线），band 的“与”和“或”把它变成一条陡峭的 S 形。

$r$ 是“与”：一个 band 内要全部相同，$r$ 越大越难，curve 右移并变陡。$b$ 是“或”：有一个 band 相同就行，$b$ 越大越容易，curve 左移。陡的位置大约在 $s^r=1/b$，即 $s=(1/b)^{1/r}$；在这一点，$P=1-(1-1/b)^b$，$b=20$ 时是 0.642，$b$ 大时趋于 $1-1/e$。Lee 等人 2021 年的 dedup 用 $k=9000$、$b=20$、$r=450$，threshold 是 $(1/20)^{1/450}=0.993$。

候选还不是重复。A4 的流程：对候选对计算真实的 Jaccard similarity，超过 threshold 才算重复；重复关系连成 cluster（A 与 B 重复、B 与 C 重复，则 A、B、C 是一个 cluster），每个 cluster 只保留 random 选出的一个。算 signature 之前先做 normalization（小写、去标点、统一空白、去重音、NFD），否则只差大小写的两份文档会被当成不同。

:::wrong Dedup 只是为了省掉重复的 token
Lecture 14 举的例子：C4 里有一段商品描述重复了 61,036 次。省 token 是一方面，更重要的是 model 会把重复很多次的文本逐字背下来，这既浪费 capacity，也带来版权和隐私问题；lecture 引的研究（Lee 等人 2021）发现去重之后的数据训练出的 model 更好。另外 A4 允许用 Paloma 的 validation data 来设计 filter，但不允许把它放进训练数据，去重和评估集的隔离是同一类问题。
:::

### Data mixing：每个来源取多少

训练数据来自多个来源（Wikipedia、Common Crawl、GitHub、论文……），要决定一个 distribution $p(s)$：每个 batch 里各来源占多少。Lecture 14 列的 baseline：凭感觉手设（很常见）、各来源均匀、按各来源的 token 数成比例。直觉是给高质量的来源更高的 weight，但有两个限制：要保证多样性（文学、代码、论文这些来源彼此不可比）；每个来源是有限的，weight 太高就要重复很多遍。

第二点的账：低质量来源有 10T token，高质量来源只有 10B。训练 1T token，按 $p=(0.5,\,0.5)$ 混合，低质量那边用了 $0.5\times10^{12}/10^{13}=0.05$ 个 epoch，高质量那边是 $0.5\times10^{12}/10^{10}=50$ 个 epoch。第 7 站的 data repetition 说过，大约 40 个 epoch 之后重复就没有价值了，50 个 epoch 会 overfit。

几种做法：

- **UniMax**（多语言 model 里平衡各种语言）：以前的做法在均匀和成比例之间取折中，$p(s)\propto\text{num\_tokens}(s)^\alpha$，$\alpha\in[0,1]$。UniMax 改成各来源均匀 sample，但给每个来源的 epoch 数设一个硬上限 $C$：$p(s)\cdot\text{训练 token 总数}\le C\cdot\text{num\_tokens}(s)$。
- **Regression-based mixing**（RegMix 等）：从一个 distribution（例如 Dirichlet）里 random 取很多种 mixture，各训练一个小 model，测下游的 eval，fit 一个从 mixture 到 eval 分数的 regression（linear、gradient boosted tree），再在 regression 上找最优 mixture。它押了两个“但愿”：regression 在最优点附近是准的；小规模上的最优 mixture 能搬到大规模。
- **Simulated epoching**：第二个“但愿”至少有一个规模效应会破坏它。小 model 只训练很少的 token，在 $p=(0.1,\,0.9)$ 下高质量来源也重复不了几遍，看起来很好；大 model 训练 1T token 用同样的 mixture，高质量来源要重复 $0.9\times10^{12}/10^{10}=90$ 遍。办法是让小规模长得像大规模（lecture 说这是整门课的主题）：小规模训练 10B token、大规模 1T，比例是 0.01，就把每个来源都按 0.01 downsample，低质量来源变成 100B、高质量来源变成 1 亿 token。在这个 downsample 过的设定里，过度重复的 mixture 一样会 overfit，fit 出来的最优 mixture 就会更均衡（lecture 的例子是 $(0.7,\,0.3)$）。

### Post-training 的数据

Lecture 14 最后讲 mid-training 和 SFT 用的数据，主要是 synthetic 的。配方是：定义一组环境；定义一组任务或 prompt；用一个强 model（teacher）生成回答。

- **OpenThoughts**：用 QwQ-32B 当 teacher，从 27 个人写的和 synthetic 的来源（StackExchange、NuminaMath、化学题等）取题，生成 120 万个 example。发现：每个 prompt sample 多个回答（16 个）有帮助；更强的 model 不一定是更好的 teacher（QwQ-32B 比 DeepSeek-R1 好）；按答案对错过滤没有帮助；小而质量高的来源（例如 OpenMath-2-Math）比大而杂的来源好。
- **SWE-smith**：给一个 repository，用 LM 故意引入 bug 来造任务，128 个 GitHub repository 造出 5 万个任务。
- **SWE-Zero**：软件工程任务依赖繁重（不像数学题和编程竞赛），为几千个 repository 搭 Docker 环境是基础设施的噩梦。观察是强 model 不需要执行反馈也能解出很多任务，它们内部有代码语义的“world model”。于是从 15 万个 GitHub PR 生成 30 万条不需要执行的 agent trajectory（用 OpenHands scaffold，删掉未来的 git commit，防止 agent 直接从 git 历史里抄答案），teacher 是 Qwen3-Coder-480B；另有 1.3 万条需要执行反馈的 trajectory（SWE-Hero）。后来扩到 1200 万条，用的是一个很小的 model（mini-coder-1.7b）。
- **SWE-rebench**：从 3400 个 repository 的 45 万个 PR 里，用 Qwen 2.5-72B-Instruct 安装依赖、评估 PR 质量，得到 2.1 万个可交互的 Python 任务。

Lecture 14 的总结：prompt 可以是全 synthetic、半 synthetic（真实环境加 synthetic 任务）或真实的（GitHub PR）；回答来自能力强、也适合当 teacher 的 model；代码环境最麻烦；细节和过滤非常多。

:::from
为什么数据难以公开、训练的三段、crawler 的限制和 decline of consent、shadow library、Common Crawl 的数字和三种格式、Wikipedia 的 data poisoning、GitHub 与 arXiv、版权和 fair use 的四个因素、三个诉讼、dataset 演变表里的每一行、Common Pile 的问题，来自 [lecture 13](http://cs336.stanford.edu/lectures/?trace=lecture_13) 的讲稿。WARC、WAT、WET 的说明、Resiliparse、各个 filter 的要求、Gopher 的四条规则、quality classifier 的 positive 与 negative example、exact line dedup 的两遍做法和 hash 技巧、MinHash 与 LSH 的定义、$[1,2,3,2]$ 的例子、候选的验证与 cluster、normalization 的清单、Paloma 的规则，来自 [A4 handout](https://github.com/stanford-cs336/assignment4-data)。HTML 与 PDF 的转换、“target 与 raw”的统一框架和两类 scoring function、哪些 dataset 用 model 过滤、Dolma 的 0.5、GPT-3 的 Pareto 规则、OpenMathText、phi-1、Jigsaw、threshold 随规模变化、dedup 的三个设计选择和 hash function、C4 的 3 句 span、5 个 element 的 MinHash 例子、$1-(1-s^r)^b$ 和 Lee 等人的设置、C4 的 61,036 次、data mixing 的 baseline、epoch 的例子、UniMax、regression mixing、simulated epoching、post-training 数据的四个例子，来自 [lecture 14](http://cs336.stanford.edu/lectures/?trace=lecture_14) 的讲稿。LSH 的表、threshold、bigram 的例子、Pareto 规则的保留 probability（按 NumPy `pareto` 是 Lomax distribution 这一点算的）、epoch 的数是我算的。
:::

## [align] Post-training：SFT、RLHF 与 GRPO

:::skip
能从 log-derivative trick 推出 policy gradient，说明 baseline 为什么不改变 expectation，算出 GRPO 一个 group 的 advantage，说出 std normalization 和 length normalization 各引入了什么 bias，并读懂 PPO 式 clipping 的 mask，就可以去第 11 站。快速路线必读（Lecture 15、16），是 A5 的理论部分。SFT 只在 response 上算 loss、Bradley–Terry、RLHF 的最优 policy 和 DPO 的推导在 [CS4248 第 8 站](../courses/CS4248.html#post)。
:::

### 从 imitation 到 optimization

Pretrain 完的 model 什么都会一点，但不会按人要的方式做事。Lecture 15 把 post-training 分成两步：SFT 是 imitation，fit 一个参考 distribution $p^*(y\mid x)$，需要有人写好示范答案；RLHF 是 optimization，找一个 policy 让 reward 的 expectation 最大，只需要能给答案打分。为什么要第二步：人写出的答案不一定是人最偏好的答案（lecture 用新闻摘要的研究说明这个 generation 与 verification 的差距），判断比生成容易。

RLHF 的 reward 来自一个 fit 人类偏好的 reward model，optimize 得太狠会钻 reward model 的空子（overoptimization），lecture 15 展示了 reward 先升后降的曲线。Lecture 16 的出路是去 reward 能被可靠地验证的领域：数学题有标准答案，代码有 test。这叫 RLVR（RL from verifiable rewards），DeepSeek R1 用它把 reasoning 推到了 o1 的水平。

A5 就是这个设定：OLMo-2-0425-1B 做 GSM8K，prompt 是 R1-Zero 的格式（`<think>` 里写 reasoning，`<answer>` 里给答案），reward 是答案对为 1、错为 0。

### SFT：数据里有什么，比怎么训更要紧

Lecture 15 先看 SFT 的数据。开源的 instruction 数据一路是 FLAN、Self-instruct、Alpaca、ShareGPT/Vicuna、OpenAssistant、WizardLM、Tulu 3、Nemotron，最近转向 tool use 和 agent。它们的差别：FLAN 大多是改写过的 NLP benchmark，答案短而正确，但没人想和一个 benchmark 聊天；后来的数据回答越来越长、越来越像聊天，OpenAssistant 的回答里有大量细致的事实和引用；此外还有规模和 safety。

这些差别各有后果：

- **风格。** 不同的 SFT 数据训出的 model 回答长度差别很大；在按偏好评估时（人或 GPT-4 当 judge），长度的影响非常强。但在其他 benchmark 上，风格基本不影响分数。
- **知识。** 业内的说法（Schulman 2023、Gekhman 2023）是：用 model 本来不知道的事实去 fine-tune，会教它编造。SFT 教的是“遇到这种问题就给出这种形式的具体答案”；如果答案里的事实 model 本来不知道，它学到的就是“不知道也要说得具体”。所以即使用户就是要查冷门知识，也未必该在 SFT 里塞冷门知识；RL 式的“对错”反馈原则上能帮上忙。
- **Safety。** 细节很少公开，Llama 2 的 safety SFT 只有几千条。Lecture 引的实验：在 Alpaca 式的数据里加 500 条 safety 示范，model 在几个有害指令测试集上的得分就大幅改善。

Lecture 15 的小结：SFT 最适合把 pre-training 里已有的行为“提取”出来，而不是加入新行为；加入（即使正确的）新事实有时反而有害；少量对的行为数据（safety、instruction following、风格）作用很大，但长尾上更多数据仍有帮助。

数据多、compute 多时，SFT 和 pre-training 的界限也模糊了。“Midtraining”（两阶段训练）的配方：先在 web 数据上 pre-train，然后把 instruction 数据混进 pre-training 的数据里继续训，最后再做一轮短的真正的 instruction tuning。这样能把 instruction 数据的规模放大，又不至于 catastrophic forgetting。各公司普遍在用但很少写出来，MiniCPM、JetMoE 公开了。

### RLHF 的数据

RLHF 的标准数据是 pairwise 的：同一个 prompt 两个回答，annotator 选更好的那个（InstructGPT 公开了 annotation guideline）。Lecture 15 列的难处：很难招到可靠、能核实正确性的 annotator，他们也不一定真去核对正确性，还要提防他们自己用 AI 作答；annotator 的人群 distribution 会显著改变 model 的行为（Santurkar 2023）；即使 annotator 很多，风格上的偏好也因人而异。另一条路是用 LM 当 judge：GPT-4 给出的 pairwise 判断在 system 层面和人的排名几乎完全相关，和人的一致率接近人与人之间的一致率；UltraFeedback、Zephyr、Tulu 3 用的都是 AI feedback，Constitutional AI 让 model 按一组原则自己评判自己。不论哪种 feedback，RLHF 都会显著拉长回答（Chen 2024、Singhal 2024），这和第 12 站 AlpacaEval 的长度 bias 是同一件事的两面。

### Policy gradient

目标是 expected reward：

$$J(\theta)=\mathbb E_{x\sim\rho}\,\mathbb E_{y\sim\pi_\theta(\cdot\mid x)}\big[r(y\mid x)\big]$$

难处在于 expectation 是对 model 自己的输出取的，不能像 cross-entropy 那样直接对数据求 gradient。用 $\nabla\pi=\pi\,\nabla\log\pi$（log 的 derivative 是 $f'/f$）：

$$\nabla_\theta\sum_y\pi_\theta(y)\,r(y)=\sum_y\pi_\theta(y)\,\nabla_\theta\log\pi_\theta(y)\,r(y)=\mathbb E_{y\sim\pi_\theta}\big[r(y)\,\nabla_\theta\log\pi_\theta(y)\big]$$

右边可以用 sampling 来 estimate：让 model 生成，打分，把 reward 乘到 log-probability 的 gradient 上。Language model 的 $\log\pi_\theta(y\mid x)=\sum_t\log\pi_\theta(y_t\mid x,y_{<t})$，所以这就是每个 token 的 log-probability 乘上整条回答的 reward。

**Baseline 不改变 expectation。** 减去一个不依赖 $y$ 的 $b$：

$$\mathbb E_{y\sim\pi}\big[b\,\nabla\log\pi(y)\big]=b\sum_y\pi(y)\frac{\nabla\pi(y)}{\pi(y)}=b\,\nabla\sum_y\pi(y)=b\,\nabla1=0$$

所以 $(r-b)\nabla\log\pi$ 和 $r\nabla\log\pi$ 的 expectation 相同，只有 variance 不同。

算一个三选一的例子看 variance。Policy 是 logits $\theta$ 上的 softmax，$\pi=(0.5,\,0.3,\,0.2)$，只有第 1 个 action 的 reward 是 1。Softmax 下 $\nabla_\theta\log\pi(a)=e_a-\pi$。单个 sample 的 estimate 是 $(r_a-b)(e_a-\pi)$：

- $b=0$：只有采到 action 1 时非零，值为 $(0.5,-0.3,-0.2)$；expectation 是 $0.5\times(0.5,-0.3,-0.2)=(0.25,-0.15,-0.10)$。Variance（三个 component 的 variance 之和）是 0.095。
- $b=0.5$（等于 reward 的 expectation）：采到 action 1 时值为 $0.5(e_1-\pi)=(0.25,-0.15,-0.10)$，恰好等于 expectation；采到 action 2、3 时分别是 $(0.25,-0.35,0.10)$ 和 $(0.25,0.15,-0.40)$。Expectation 不变，variance 降到 0.060。
- $b=1$：expectation 仍然不变，variance 升到 0.335。

Baseline 选得好降 variance，选得差反而升高。用 reward 的平均当 baseline 是自然的选择。

### GRPO：在一个 group 里比较

每个 prompt 采 $G$ 个回答，用这个 group 的平均 reward 当 baseline，再除以 group 的 standard deviation：

$$A^{(i,j)}=\frac{r^{(i,j)}-\mu_i}{\mathrm{std}_i+\epsilon},\qquad\hat g=\frac1{BG}\sum_{i=1}^B\sum_{j=1}^G\frac1{|y^{(i,j)}|}\sum_tA^{(i,j)}\,\nabla_\theta\log\pi_\theta\big(y^{(i,j)}_t\mid x^{(i)},y^{(i,j)}_{<t}\big)$$

不需要 PPO 那样单独训练一个 value model 来估计 baseline，这是 GRPO 简单、省 memory 的原因（lecture 16）。

算一个 group：$G=8$，两个答对，$r=(1,0,0,1,0,0,0,0)$。$\mu=0.25$。A5 要求用 `torch.std` 的默认值，它除以 $G-1$：$\sqrt{(2\times0.75^2+6\times0.25^2)/7}=\sqrt{1.5/7}=0.463$。答对的 advantage 是 $0.75/0.463=1.620$，答错的是 $-0.25/0.463=-0.540$。（除以 $G$ 的 std 是 0.433，得 1.732 和 $-0.577$。）8 个 advantage 加起来是 0。

两个直接的后果：

- 一个 group 全对或全错，$r-\mu$ 全是 0，这个 prompt 对 gradient 毫无贡献（$\epsilon$ 防止 0 除以 0）。训练刚开始时 base model 在 r1_zero 格式下几乎全错，大多数 group 都是全 0，所以 A5 说 reward 在开头几步接近 0 是正常的，取决于 seed，可能要几步才采到第一个非零 reward。
- Group mean 依赖于同组的回答，严格说不是“不依赖 $y$”的 baseline。A5 handout 推导出它让 expectation 乘上 $\tfrac{G-1}{G}$，方向不变。

A5 建议的配置：每步 256 个回答（32 个 prompt × 8），learning rate $10^{-5}$，gradient accumulation 32 步，生成上限 512 token，AdamW $(0.9,0.95)$、weight decay 0，gradient norm clip 到 1.0，共 200 步。Gradient accumulation 时每个 microbatch 的 loss 要乘上它在整个 batch 里的占比，gradient 才和一次算完整个 batch 相同。

:::wrong GRPO 的 loss 在下降，说明 model 在变好
A5 特别说明，这个“loss”不是传统意义上的 loss，只是一个对它求 gradient 恰好得到 policy gradient 的表达式。它的值是 advantage 乘 log-probability 的平均：advantage 在每个 group 里加起来是 0，log-probability 的大小随回答的长度和 entropy 变化，这个数升降和 model 好坏没有固定关系。要看的是 train 和 validation 的 reward（总的和 format 的分开）、token entropy、回答的平均长度、gradient norm，以及定期读 rollout 的原文。
:::

### 两个 normalization 的代价

GRPO 的 estimator 在上面的 policy gradient 之外多了两步，都改变了 expectation（lecture 16、A5 第 5 节）。

**除以 std。** Reward 是 0 或 1、答对的 probability 为 $p$ 时，std 约为 $\sqrt{p(1-p)}$：$p=0.5$ 时 0.5，weight 放大 2 倍；$p=0.1$ 时 0.3，放大 3.3 倍；$p=0.02$ 时 0.14，放大 7.1 倍。太难和太容易的题被加了大的 weight，这不再是对“平均正确率”的 gradient。

**除以回答长度。** 每个回答的 token 先平均再相加。一个答错的回答 advantage 是 $-0.540$：长 100 个 token 时每个 token 分到 $-0.0054$，长 400 个 token 时只分到 $-0.00135$。错得越长，每个 token 受的惩罚越轻，model 被推着在答错时写得更长。Lecture 16 引用 Dr. GRPO 的分析，提出 R1 训练中回答越来越长可能有一部分来自这个 bias，而不全是 model 学会了“多想”。

A5 让你比较几种改法，都只改这两处：

| 方法 | baseline | advantage 除以 | loss 的 normalization |
|---|---|---|---|
| GRPO | group mean | std | 每个回答除以自己的长度 |
| Dr. GRPO | group mean | 不除 | 全部除以 constant $Z=BGL$（$L$ 是生成上限） |
| RFT | 无（只训练答对的） | 不除 | constant |
| MaxRL | group mean | group mean | constant |

RFT 就是“sample、留下答对的、做 SFT”，相当于只用正确的 sample、不减 baseline 的 policy gradient。

### 一批 sample 走多步：importance ratio 与 clipping

Rollout 很贵。一批回答生成出来，只走一步 gradient 太可惜；但第二步开始，model 已经不是生成这批回答的那个 $\pi_0$ 了，sample 是 stale 的。修正的办法是乘 importance ratio $\pi_\theta(y)/\pi_0(y)$。对整条回答，这个 ratio 是每个 token 的 ratio 的乘积：每个 token 只偏 1%，500 个 token 之后是 $1.01^{500}=145$ 或 $0.99^{500}=0.0066$，variance 无法控制。

PPO 和 GRPO 的做法是每个 token 单独乘自己的 ratio $w_t=\pi_\theta(y_t\mid\cdot)/\pi_0(y_t\mid\cdot)$，并 clip：

$$\min\big(w_tA,\ \mathrm{clip}(w_t,1-\varepsilon,1+\varepsilon)A\big)$$

对 $\theta$ 求 gradient 时，被 clip 住的项 gradient 为 0。$A\ge0$ 时，$w_t\ge1+\varepsilon$ 就停止继续推高这个 token；$A<0$ 时，$w_t\le1-\varepsilon$ 就停止继续压低。取 $\varepsilon=0.2$：

| $w_t$ | $A$ | objective 的值 | 有 gradient 吗 |
|---|---|---|---|
| 1.3 | $+1$ | 1.2 | 无：已经比旧 policy 高出 20% 以上 |
| 1.1 | $+1$ | 1.1 | 有 |
| 0.7 | $-1$ | $-0.8$ | 无：已经压低 20% 以上 |
| 1.3 | $-1$ | $-1.3$ | 有：坏 token 的 probability 反而升高了，必须纠正 |

::fig[cs336-clip] PPO 式 clipping 的 objective 随 $w_t$ 的变化，$\varepsilon=0.2$。实线段有 gradient，水平的虚线段 gradient 为 0。

最后一行说明 $\min$ 的作用：clip 只截断“往好的方向走过头”的部分，往坏的方向偏离时照常惩罚。A5 还介绍了 GSPO（对整条回答用 ratio 的几何平均）和 CISPO（只给 ratio 设上限、不把 gradient 截成 0），让你比较。A5 的 GRPO 不加 KL penalty；lecture 16 讲的 PPO 实现里有一项按 token 计的 KL penalty，用来防止 policy 离 reference 太远。

### PPO 在实践中

GRPO 是从 PPO 改来的。Lecture 15、16 对 PPO 的概念梳理分三步：policy gradient（上面推的）variance 太大；TRPO 在当前 policy 附近把问题线性化，最大化 $\hat{\mathbb E}_t\big[\tfrac{\pi_\theta(a_t\mid s_t)}{\pi_{\text{old}}(a_t\mid s_t)}\hat A_t\big]$，约束新旧 policy 的 KL 不超过 $\delta$；PPO 把约束换成上面的 clip。

Lecture 16 读了 AlpacaFarm 的 PPO 实现，几处细节：外层 loop 做 rollout，内层 loop 在这批 rollout 上优化若干步；clip range 取 0.2。Reward shaping：每个 token 有一项 KL penalty（当前 policy 与 reference 的 log-probability 之差），整条回答的 reward 只加在最后一个 token 上；实现里还把 KL 截在 0 以下不计（新 policy 的 log-probability 低于 reference 时不罚），防止 model 崩坏时 KL diverge。Advantage 用 generalized advantage estimation（GAE）：

$$\hat A_t=\sum_{l\ge0}(\gamma\lambda)^l\delta_{t+l},\qquad\delta_t=r_t+\gamma V(s_{t+1})-V(s_t)$$

$V$ 是另外训练的 value model。Lecture 指出一个有趣的细节：这其实是一个 bandit 问题，取 $\gamma=\lambda=1$ 就行，$\hat A_t$ 就是“从 $t$ 往后的 reward 之和减去 $V(s_t)$”。训练时应该看到总 reward（含 reward model 的分数）上升，KL 那一项的 reward 越来越负。

为什么还要 GRPO：PPO 实现复杂，value model 和 policy 一样大，占 memory，还要另外调。GRPO 去掉 value model，用 group 里的 z-score 当 advantage。原始的 GRPO（DeepSeekMath）还带一项 KL penalty，用的 estimator 是

$$\mathbb D_{\text{KL}}\big(\pi_\theta\,\|\,\pi_{\text{ref}}\big)\approx\frac{\pi_{\text{ref}}(o\mid q)}{\pi_\theta(o\mid q)}-\log\frac{\pi_{\text{ref}}(o\mid q)}{\pi_\theta(o\mid q)}-1$$

记 $u=\pi_{\text{ref}}/\pi_\theta$，这一项是 $u-\log u-1$，$u=1$ 时为 0，其余时候为正（$\log u\le u-1$）。Lecture 指出，在 rollout 之后立即更新的 online 情形下，GRPO 就是用 group normalize 过的 reward 做 policy gradient。原论文里它胜过 RFT。

### DPO 在哪里

DPO 不需要 rollout，也不需要 reward model，直接在 preference pair 上做一个 classification 式的 loss（推导见 CS4248 第 8 站）。Lecture 15 讲它的来路：大家早就想绕开 on-policy RL，试过给好坏回答加控制 token 做 SFT、只在偏好的回答上 SFT、用 reward model 在 1024 个 sample 里挑最好的再 SFT；DPO 是其中有理论推导的一个，效果上相当于“在好回答上走正的 gradient、在坏回答上走负的 gradient”，按隐含 reward model 预测错多少加权。Tulu 3 论文里的两个变体：SimPO 不要 reference model，把 log-probability 除以回答长度并减去一个 margin $\gamma$；length-normalized DPO 保留 reference，只把两项各除以长度。Lecture 也提醒 PPO 有时不比 DPO 差，RL 相关的实验结论高度依赖具体设置。

Lecture 16 指出它不适合 RLVR 的原因：数学题的反馈天然不是成对比较（不是 Bradley–Terry 的形式），而且 DPO 是 offline 的（可以迭代成 online，但不自然）。A5 的可选 supplement 做的是另一条线：Llama 3.1 8B 先在 UltraChat 上 SFT，再在 Anthropic HH 上做 DPO，$\beta=0.1$，learning rate $10^{-6}$，effective batch 64，两块 GPU 分别放 reference 和正在训练的 model，optimizer 用 RMSprop 而不是 AdamW（supplement 说除非再用 quantization 等技巧，否则不用 AdamW，原始的 DPO 工作也用 RMSprop）。按第 3 站的账：8B 的 model 用 bf16 一份 16 GB，AdamW 的两个 fp32 state 就要 64 GB，RMSprop 只有一个 state，少一半。

### RLHF 的两个副作用

**Overoptimization。** 对一个学出来的 reward 优化得太狠，真实的偏好先升后降。Lecture 15 的图显示，各种 RLHF 式的 optimizer 都是如此：用人的偏好、用有噪声的 LM 偏好时都会 overfit，只有无噪声的 LM 偏好不会。这是 lecture 16 转向 verifiable reward 的理由。

**Mode collapse。** RLHF 之后的 model 不再是一个“probabilistic model”，默认不再 calibrated。Lecture 15 放的几张 calibration curve（横轴是 model 给答案的 probability，纵轴是实际正确的比例）里，pre-train 的 model 贴着对角线，RLHF 或 PPO 之后的 model 偏离对角线；同一页上 RLHF 之后的 model 生成的 entropy 也集中到很低的值。需要 probability 有意义的用途（例如用它判断 model 有多大把握）要另外校准。

### 三个案例：R1、Kimi K1.5、Qwen 3

:::skip
不影响 A5。跳过会少掉“这些算法在真实的大 model 训练里怎样组合”的具体例子。
:::

**DeepSeek R1。** 先做了一个受控的版本 R1-Zero：直接在 DeepSeek-V3 base model 上用 GRPO，reward 只有两种，答案对不对（accuracy reward）和是否用了 thinking 的标签（format reward），数据未公开；结果比 o1 稍差。训练中观察到 CoT 越来越长，以及所谓的“aha moment”（model 自己回头检查）。Dr. GRPO 的后续分析认为这有些夸大：长度增长可能部分来自上面说的长度 bias，base model 本来就会出现“aha”。正式的 R1 是四段：DeepSeek-V3，reasoning SFT（先用长 CoT 做 SFT 初始化，数据来源不太清楚，宣称的好处是可读性），RL（GRPO，另加一个 CoT 的 language consistency reward，因为 RL 会让 CoT 混用多种语言），然后是常规的 SFT 加 RLHF（SFT 两个 epoch：60 万条 reasoning 数据，其中不可验证的任务例如“证明 X”用 V3 当 judge；20 万条 V3 的非 reasoning SFT 数据。RLHF 对 reasoning 沿用 R1-Zero 式的 reward，对不可验证的任务用 V3 的 RLHF 流程，仍然用 GRPO）。另外两个结论：让 R1 生成 80 万条 CoT 去 distill Qwen 2.5 和 Llama，小 model 也学会了 reasoning（例如 R1-Distill-Qwen-32B 在 AIME 2024 上 pass@1 72.6）；论文有一节“失败的尝试”，process reward model（PRM）和 MCTS 都没有成功。Lecture 也提到，只用约 1000 道数学和科学题配上 Gemini 或 R1 的长 CoT 做 SFT，就足以把 reasoning 引出来。

**Kimi K1.5。** 和 R1 同时发布，也用 RL 胜过 o1。数据：按主题平衡，排除选择题和判断题（容易蒙对，产生 false positive），只留 model 在 best-of-8 里也做错的题。RL 的 reward 来自一个参照标准答案的 reward model；algorithm 从 DPO 式的推导出发（nonparametric 假设，解出 reward），用 squared loss 当 surrogate，结果是一个带 regularization、减了 baseline 的 policy gradient，没有 GRPO 那种长度 bias。为了进一步压缩 CoT，每个 batch 里加一个 length reward：

$$\text{len\_reward}(i)=\begin{cases}\lambda & r(x,y_i,y^*)=1\\ \min(0,\lambda) & r(x,y_i,y^*)=0\end{cases},\qquad\lambda=0.5-\frac{\text{len}(i)-\text{min\_len}}{\text{max\_len}-\text{min\_len}}$$

用一次：同一题 sample 出长 200、500、800 个 token 的三个回答，$\text{min\_len}=200$、$\text{max\_len}=800$，$\lambda$ 依次是 $0.5$、$0$、$-0.5$。答对的三个分别得 $0.5$、$0$、$-0.5$，越短越好；答错的分别得 $\min(0,0.5)=0$、$0$、$-0.5$，比这一组中间长度还长的错误回答受罚。因为它影响性能，Kimi 只在训练后期打开。其他细节：curriculum（按难度从易到难，并按 $1-\text{success rate}$ 的比例 sample，少重复已经会的题）；代码题从有标准解的题出发生成新的 test case；数学题用 80 万个 sample 训练一个 CoT reward model 判断答案是否等价（人工抽查的准确率 98.5%，普通 reward model 是 84.4%）。Lecture 还专门讲了 RL 的系统难处：on-policy 意味着要不断做 rollout（即 inference，第 8 站），训练和 rollout 常用不同的框架，来回切换昂贵；长 CoT 让 batch 里的长度极不均匀。

**Qwen 3。** 套路相同：按 best-of-$n$ 过滤难度，去掉不用 CoT 也能答对的题，去掉和 validation data 太像的题，人工检查 CoT 的质量（是猜对的还是推对的）；reasoning RL 只用了 3995 个 example。新东西是 thinking mode fusion：把带思考和不带思考的数据用 `/think`、`/no_think` 标签混在一起训练，不思考的样本 `<think></think>` 之间为空；inference 时思考超过用户给的预算，就插入一句“时间有限，直接根据已有的思考作答”的指令加上 `</think>`，model 自然地给出答案，这个能力没有专门训练过。阶段的组合上，RLHF 放在 reasoning RL 之后，distillation 再在其后；通用的 RLHF 会让数学和 STEM 能力略有下降。Lecture 最后用 Qwen 3 Coder Next 说明 agentic RL：mid-training 加入 6000 亿 token 的 repository 级代码数据和带检索上下文的 PR，分别训练 web 开发、UX、单轮 QA、SWE 几个 expert model 再 distill，自动构造了 80 万个 SWE-bench 式的环境。

:::from
SFT 与 RLHF 的对比、G-V gap、SFT 数据的演变和三个后果、500 条 safety 数据、midtraining、RLHF 数据的难处和 AI feedback、长度效应、TRPO 到 PPO、绕开 RL 的几种尝试、SimPO 与 length-normalized DPO、overoptimization、mode collapse 与 calibration 来自 [lecture 15](https://github.com/stanford-cs336/lectures/blob/main/lecture_15.pdf)；PPO 的实现细节（AlpacaFarm、clip 0.2、per-token KL、GAE 取 $\gamma=\lambda=1$）、为什么不用 PPO 和 DPO、GRPO 原文的 objective 和 KL estimator、std 和长度 normalization 的问题、Dr. GRPO、R1、Kimi K1.5（含 length reward 的式子和 98.5、84.4）、Qwen 3 三个案例来自 [lecture 16](https://github.com/stanford-cs336/lectures/blob/main/lecture_16.pdf)（两讲文字全部抽出，lecture 15 第 26、53、60、64 页和 lecture 16 第 14、15、18、23、24、31、35、37、43、44、48、52 页渲染成图片看过）。Policy gradient 和 baseline 的推导、group mean 的 $\tfrac{G-1}{G}$、`torch.std` 的要求、hyperparameter、gradient accumulation 的缩放、“loss 不是传统的 loss”、Dr. GRPO、RFT、MaxRL 的定义、importance ratio 与 clipping 的 formula 和 mask、GSPO、CISPO，来自 [A5 handout](https://github.com/stanford-cs336/assignment5-alignment) 第 3 至 6 节；DPO 的 hyperparameter和 RMSprop 来自 A5 的 supplement。三选一的 variance 例子、group 的 advantage、std 与长度 weight 的数值、$1.01^{500}$、clipping 的表、Kimi length reward 的数值例子、DPO 那段 memory 的账是我算的；“用不知道的事实 fine-tune 会教 model 编造”的解释是我按 lecture 的结论补的。A5 里 baseline variance 和 difficulty reweighting 的计算题是作业的答案，这里没有做。
:::

## [moe] Attention 的替代与 mixture of experts

:::skip
能写出 linear attention 的 recurrent form 并说出它的 state 为什么不随 sequence 变长，能算 top-k routing 的 gate 和 Switch 的 balancing loss，并说出 MoE 的 active parameter 与总 parameter 的区别，就可以去第 12 站。快速路线里可以跳（没有作业用到 lecture 4），代价是读不懂现在大多数前沿 open model（MoE、hybrid attention）的架构表。依赖第 2 站的 block 结构、第 6 站的 expert parallel、第 8 站的 KV cache。
:::

### Attention 越长越贵

第 3 站算过，context 从 1024 拉到 16384，attention 的 $T^2$ 项从 9% 涨到 62%；第 8 站算过，生成时 KV cache 随 sequence length 线性增长，而 decode 的时间由读多少 byte 决定。Lecture 4 先列了“基本工具箱”：local 与 global attention 交错（第 8 站的 sliding window），以及系统工程（FlashAttention，第 5 站）。想要更根本的收益，就要改 attention 本身。

### Linear attention：换一个乘法顺序

记 $Q\in\mathbb R^{n\times d_k}$，$K\in\mathbb R^{n\times d_k}$，$V\in\mathbb R^{n\times d_v}$，attention 是 $\rho(QK^\top)V$，$\rho$ 是 softmax 之类的 normalization。贵在 $QK^\top$ 是 $n\times n$ 的。如果 $\rho$ 是 identity，乘法可以换个顺序：

$$(QK^\top)V=Q(K^\top V)$$

左边先算 $n\times n$ 的 $QK^\top$（$n^2d_k$ 次乘法）再乘 $V$（$n^2d_v$ 次）；右边先算 $d_k\times d_v$ 的 $K^\top V$（$nd_kd_v$ 次）再用 $Q$ 去乘（$nd_kd_v$ 次）。从 $n^2d_k+n^2d_v$ 变成 $2nd_kd_v$，对 $n$ 是 linear 的。$n=4096$、$d_k=d_v=128$：左边 $4.29\times10^9$，右边 $1.34\times10^8$，差 $n/d=32$ 倍。Lecture 的评价是“很傻，但出人意料地重要”（Shen 2018；Katharopoulos 2020 是带 kernel feature map 的版本）。

加上 causal mask，位置 $t$ 只能看 $1,\dots,t$，于是

$$S_t=S_{t-1}+k_tv_t^\top,\qquad y_t=q_t^\top S_t$$

$S_t$ 是 $d_k\times d_v$ 的 matrix，记下“到目前为止所有 key 和 value 的 outer product 之和”。这是一个 RNN：生成时每步只更新一个固定大小的 state。用一次：$d=2$，三个位置 $k_1=(1,0)$、$v_1=(1,2)$，$k_2=(0,1)$、$v_2=(3,0)$，$k_3=(1,1)$、$v_3=(0,1)$，$q_3=(1,2)$。

$$S_3=\begin{pmatrix}1&2\\0&0\end{pmatrix}+\begin{pmatrix}0&0\\3&0\end{pmatrix}+\begin{pmatrix}0&1\\0&1\end{pmatrix}=\begin{pmatrix}1&3\\3&1\end{pmatrix},\qquad y_3=q_3^\top S_3=(7,\,5)$$

直接按 attention 算：score $q_3\cdot k_i=(1,\,2,\,3)$，不做 softmax，$1\cdot(1,2)+2\cdot(3,0)+3\cdot(0,1)=(7,\,5)$，相同。差别在存什么：attention 要存全部 $t$ 个 key 和 value（KV cache，$2td$ 个数），linear attention 只存 $S_t$（$d^2$ 个数）。$d=128$ 时 state 是 16,384 个数，而 4096 个 token 的 KV cache 是 1,048,576 个，差 64 倍，并且 state 不再随 $t$ 增长。

Lecture 把这叫“duality”：训练时用并行的 quadratic 形式（一次算整条 sequence，适合 GPU），inference 时用 sequential 的 recurrent 形式（每步常数的成本）。给 $S_{t-1}$ 乘一个衰减系数 $\gamma$ 就是 RetNet。

### Gating 与 delta rule

纯粹的累加有个问题：$S_t$ 只增不减，旧的内容永远在。两步推广：

$$\text{Mamba-2:}\quad S_t=\gamma_tS_{t-1}+k_tv_t^\top,\qquad y_t=q_t^\top S_t+v_t^\top D,\qquad\gamma_t=f(x_t)$$

$\gamma_t$ 由当前输入决定，相当于一个 forget gate；lecture 的说法是用 gating 让 linear attention 更有表达力（“gating is good”，和第 2 站 SwiGLU 是同一个教训），$\gamma$ 可以并行算出来，duality 仍然成立。

$$\text{Gated DeltaNet:}\quad S_t=\gamma_t\big(I-\beta_tk_tk_t^\top\big)S_{t-1}+\beta_tk_tv_t^\top,\qquad y_t=q_t^\top S_t$$

$\beta_t=f(x_t)$ 是 input gate，$\beta=0$ 时这一步什么都不写；$(I-\beta_tk_tk_t^\top)$ 先把 state 里沿当前 key 方向的内容擦掉。用一次，接着上面的 $S=\begin{pmatrix}1&3\\3&1\end{pmatrix}$，取 $\gamma=\beta=1$，新来 $k=(1,0)$、$v=(5,5)$：

$$(I-kk^\top)S=\begin{pmatrix}0&0\\0&1\end{pmatrix}\begin{pmatrix}1&3\\3&1\end{pmatrix}=\begin{pmatrix}0&0\\3&1\end{pmatrix},\qquad S'=\begin{pmatrix}0&0\\3&1\end{pmatrix}+\begin{pmatrix}5&5\\0&0\end{pmatrix}=\begin{pmatrix}5&5\\3&1\end{pmatrix}$$

用 $k$ 去读：$k^\top S'=(5,\,5)=v$，正好读出刚写进去的 value。纯 linear attention 只会累加，$k^\top(S+kv^\top)=(1,3)+(5,5)=(6,\,8)$，旧的关联和新的混在一起。Lecture 指出这和 fast weight programmer、test-time training 的想法关系很近：$S$ 像一组在 inference 时被在线更新的 weight。

实际的 model 多是 hybrid：MiniMax M1（以及 MiniMax-Text-01）每 7 层 linear attention 配 1 层 full attention，并显示了随 context length 线性增长的成本；Nemotron 3 是 Mamba 与 attention 约 3 比 1；最新的 Qwen 3.5 / Qwen Next 是 Gated DeltaNet 与 attention 3 比 1。Lecture 的评价：严格控制变量的 ablation 不多，但有证据显示少量 full attention 层就能拿到低 loss，inference 的特性好。

另一条路是 sparse attention。DeepSeek Sparse Attention（V3.2，GLM5 也用）先用一个很轻的 “lightning indexer” 给每个过去的 token 打分，$I_{t,s}=\sum_jw_{t,j}\,\mathrm{ReLU}(q_{t,j}\cdot k_s)$（head 很少，可以用 FP8），只对分数最高的 top-$k$ 个 token 做真正的 attention。它可以在 dense、短 context 的 pre-training 之后再加上去。

### Mixture of experts：同样的 FLOPs，更多的 parameter

MoE 把 block 里的 FFN 换成很多个 FFN（expert）加一个 selector（router）：每个 token 只送进其中 $K$ 个 expert。增加 expert 的个数不增加每个 token 的 FLOPs，只增加 parameter。

为什么值得：Switch Transformer（Fedus 2022）的图里，同样的 FLOPs 下 expert 从 1 个加到 256 个，test loss 单调下降；OLMoE 显示 MoE 训练得更快；现在多数性能最好的 open model 都是 MoE，而且 inference 很快；expert 天然可以分到不同的卡上（第 6 站的 expert parallel）。为什么以前不流行：基础设施复杂，优势主要在多 node 时才显现；训练的 objective 有点 heuristic，有时不稳定。通常的做法是把每层（或隔几层）的 MLP 换成 MoE；把 attention head 做成 MoE 的较少见（ModuleFormer、JetMoE）。

用一次 parameter 的账：DeepSeek V3 总共 671B parameter，每个 token 只用到其中 37B（active parameter），$37/671=5.5\%$。每个 token 的计算量按 active parameter 算（第 3 站的 $6ND$ 里 $N$ 取 37B），memory 却要放下全部 671B。

### Routing：top-k

Routing 的选择有三类：token 选 expert（token choice）、expert 选 token（expert choice）、全局求解一个匹配问题（例如 linear assignment）；另有 hashing 作为 baseline，以及用 RL（REINFORCE）学 routing（Bengio 2013、Clark 2020，能用但没有明显更好，gradient variance 和复杂度让它很少被用）。几乎所有 MoE 都用 token-choice 的 top-$k$：Switch 取 $k=1$，GShard、Grok、Mixtral 取 2，Qwen、DBRX 取 4，DeepSeek 取 7（lecture 的表）。DeepSeek V1–V2 的写法：

$$h_t=\sum_{i=1}^Ng_{i,t}\,\mathrm{FFN}_i(u_t)+u_t,\qquad g_{i,t}=\begin{cases}s_{i,t}&s_{i,t}\in\mathrm{TopK}(\{s_{j,t}\},K)\\0&\text{otherwise}\end{cases},\qquad s_{i,t}=\mathrm{softmax}_i(u_t^\top e_i)$$

$e_i$ 是第 $i$ 个 expert 的 router vector，router 本质上是一个 logistic regression。Grok、Qwen 也是先 softmax 再取 top-$k$；Mixtral、DBRX、DeepSeek V3 是取了 top-$k$ 之后再 softmax（或 normalize），让被选中的 gate 加起来为 1。

用一次：4 个 expert，某个 token 的 $u^\top e_i=(1.2,\,0.3,\,2.0,\,-0.5)$。Softmax 得 $s=(0.262,\,0.107,\,0.583,\,0.048)$，$K=2$ 选 expert 3 和 expert 1。先 softmax 再选：gate 是 0.583 和 0.262，加起来 0.845，剩下的 0.155 直接丢掉，输出是 $0.583\,\mathrm{FFN}_3+0.262\,\mathrm{FFN}_1+u$。选了再 normalize：gate 是 $0.583/0.845=0.690$ 和 $0.310$。

::fig[cs336-moe] 上面这个 token 的 routing：router 给 4 个 expert 打分，只有 top-2 的两个 expert 被计算，输出按 gate 加权再加回 residual。

DeepSeek 和 Qwen 的变化（最早来自 DeepSpeed-MoE）：fine-grained expert，把每个 expert 切成更小的几个、同时 activate 更多个，总计算量不变；shared expert，另有一两个 expert 对所有 token 都开着。DeepSeek 的 ablation 里两者都有帮助；OLMoE 的 ablation 里 fine-grained 有帮助，shared 没有。Lecture 的表（routed 是可选的 expert 数，active 是每个 token 选几个，fine-grained ratio 是每个 expert 相对于一个标准 FFN 的大小）：

| model | routed | active | shared | fine-grained ratio |
|---|---|---|---|---|
| GShard | 2048 | 2 | 0 | |
| Switch Transformer | 64 | 1 | 0 | |
| ST-MoE | 64 | 2 | 0 | |
| Mixtral | 8 | 2 | 0 | |
| DBRX | 16 | 4 | 0 | |
| Grok | 8 | 2 | 0 | |
| DeepSeek V1 | 64 | 6 | 2 | 1/4 |
| Qwen 1.5 | 60 | 4 | 4 | 1/8 |
| DeepSeek V3 | 256 | 8 | 1 | 1/14 |
| OLMoE | 64 | 8 | 0 | 1/8 |
| MiniMax | 32 | 2 | 0 | 约 1/4 |
| Llama 4（Maverick） | 128 | 1 | 1 | 1/2 |

### 怎样训练：离散的选择没有 gradient

Top-$k$ 是离散的选择，对“选谁”没有 gradient；而训练时的效率又要求 sparse。Lecture 4 列了三种办法：用 RL 学 gating policy；随机扰动（Shazeer 2017 给 router 的输出加 Gaussian noise，expert 因此更 robust，softmax 让 model 学会给 $K$ 个 expert 排序；Switch 用均匀的乘性 jitter，后来 Zoph 2022 去掉了）；heuristic 的 balancing loss。实践中用的是最后一种。

为什么需要 balance：系统效率要求 expert 被均匀地使用，否则少数 expert 处理大部分 token、其余的卡空闲，而且 model 也可能塌缩到只用几个 expert。Switch Transformer 的 auxiliary loss：$N$ 个 expert，一个 batch $T$ 个 token，

$$\text{loss}=\alpha N\sum_{i=1}^Nf_iP_i,\qquad f_i=\frac1T\sum_x\mathbb 1\{\arg\max p(x)=i\},\qquad P_i=\frac1T\sum_xp_i(x)$$

$f_i$ 是实际被派给 expert $i$ 的 token 比例（不可导），$P_i$ 是 router 分给 expert $i$ 的 probability 的平均（可导）。对 $p_i(x)$ 求导：$f_i$ 当作常数，$\partial P_i/\partial p_i(x)=1/T$，所以

$$\frac{\partial\,\text{loss}}{\partial p_i(x)}=\alpha N f_i\cdot\frac1T=\frac{\alpha N}{T^2}\sum_{x'}\mathbb 1\{\arg\max p(x')=i\}$$

一个 expert 被用得越多，压低它的 probability 的力就越大。用一次：$N=4$，均匀时 $f_i=P_i=\tfrac14$，loss 是 $\alpha\cdot4\cdot4\cdot\tfrac1{16}=\alpha$；如果 70% 的 token 去了 expert 1，$f=(0.7,0.1,0.1,0.1)$、$P=(0.55,0.15,0.15,0.15)$，loss 是 $\alpha\cdot4\cdot(0.385+3\times0.015)=1.72\alpha$，而 expert 1 那一项的 gradient 是其余三个的 7 倍。

DeepSeek V1–V2 用两层：per-expert balancing（就是 Switch 的形式，$f_i$ 按选 $K'$ 个 expert 做了 normalization）和 per-device balancing（同样的形式，按 device 把 expert 聚合起来算）；V2 另加了 communication balancing loss，让每个 device 发出和收到的通信都均衡，并限制每个 token 最多去 $M$ 个 device（top-M device routing）。DeepSeek V3 改成每个 expert 一个 bias $b_i$，只在选 top-$k$ 时加上：$s_{i,t}+b_i$ 进了 top-$k$ 才选 expert $i$，但 gate 的值仍用 $s_{i,t}$；$b_i$ 用 online learning 调整，让负载不足的 expert 更容易被选中。DeepSeek 叫它 auxiliary-loss-free balancing，但 lecture 指出它并非完全没有 aux loss：V3 另外还有一个 sequence-wise 的 balance loss，防止单条 sequence 内极端不均。（$b_i$ 具体的更新规则 slide 上没写；按我对 DeepSeek-V3 论文的了解，是每一步对过载的 expert 把 bias 减一个小常数、对负载不足的加一个小常数，这一点没有在这次读到的材料里核对。）

OLMoE 的实验展示了去掉 load balancing loss 的后果：第一层 MoE 里有一个 expert 一度接收了几乎所有 token，其余 expert 的份额剧烈波动；training loss 和 validation loss 都变差。

### 系统与稳定性

**系统。** 每个 expert 是一个 FFN，单独放得进一块卡，expert parallel 很自然，但 routing 带来新的麻烦：每个 expert 收到的 token 数不同，没法写成一个规整的 batched matmul。传统做法给每个 expert 一个 capacity，超出的 token 被丢掉（不经过任何 expert，只走 residual）；MegaBlocks（很多 open MoE 在用）把计算写成 block-sparse 的 matmul，允许每个 expert 的 token 数不同。Nemotron 3 在发送前先把 activation 投影到更低的 dimension，减少通信。

Token dropping 带来一个有趣的副作用：MoE 的输出有额外的随机性。Capacity 是按整个 batch 算的，你的 token 会不会被丢，取决于同一个 batch 里别人的请求把哪些 expert 占满了。

**稳定性。** Router 的 softmax 对数值误差很敏感。Zoph 2022 的例子：10 个 logit 都是 128，另一个是 128.5。在 bf16 里 128 附近的间距是 1（$2^{7-7}$，第 3 站），128.5 会被舍入成 128，softmax 的输出从 $\tfrac{e^0}{e^0+10e^{-0.5}}=0.142$ 变成 $\tfrac1{11}=0.091$，差了 36%，而且所有 logit 变得一样。解决办法：router 单独用 fp32，有时再加一项 router z-loss，$L_z=\tfrac1B\sum_i\big(\log\sum_je^{x_j^{(i)}}\big)^2$，和第 4 站输出 softmax 的 z-loss 同一个想法。OLMoE 的实验里 z-loss 的 weight 是 0.001，去掉之后 training loss 出现大的 spike。

**Fine-tuning。** Sparse 的 MoE 在小的 fine-tuning 数据上容易 overfit。Zoph 等人的办法是只 fine-tune 非 MoE 的 MLP；DeepSeek 的办法是用大量数据（140 万条 SFT）。

**Upcycling。** 用一个训练好的 dense model 初始化 MoE：把它的 FFN 复制成多个 expert，再继续训练。MiniCPM 的 MoE（top-2，8 个 expert，约 4B active）在约 520B token 上训练后超过了原来的 dense model；Qwen MoE 从 Qwen 1.8B 初始化（top-4，60 个 expert，4 个 shared），是最早被确认的 upcycling 成功案例之一。

:::wrong MoE 只算 $K$ 个 expert，所以它的成本只相当于一个小 model
FLOPs 确实按 active parameter 算，但 memory 要放下全部 expert：DeepSeek V3 每个 token 只用 37B，bf16 的 weight 却有 $671\times10^9\times2=1.34$ TB，远超一个 8 卡 H100 node 的 640 GB。Decode 是 memory-bound 的（第 8 站），batch 小的时候每一步要读的是被选中的那些 expert；batch 大了，不同 token 选的 expert 不同，被读到的 expert 越来越接近全部。再加上 expert parallel 的 all-to-all 通信、token dropping、router 的数值问题，MoE 省的是计算，换来的是系统复杂度。
:::

### DeepSeek MoE 的三代

| | 总 parameter / active | expert | 新东西 |
|---|---|---|---|
| V1 | 16B / 2.8B | 2 个 shared，64 个 fine-grained（1/4 大小） | 标准 top-$k$，expert 与 device 两层 aux loss |
| V2 | 236B / 21B | 2 个 shared，160 个 fine-grained，active 6 个 | top-M device routing，communication balancing loss |
| V3 | 671B / 37B | 1 个 shared，256 个 routed，active 8 个 | $s$ 用 sigmoid 而不是 softmax，选出 top-$k$ 后再 normalize；aux-loss-free 加 sequence-wise aux |

做出 V3 还需要两样 MoE 之外的东西。一是 MLA（第 8 站），让 KV cache 小 57 倍；它和 RoPE 的冲突以及“另加几个不压缩、单独旋转的 key dimension”的解法，lecture 4 推过一遍。二是 MTP（multi-token prediction）：加几个很轻的模块，在预测下一个 token 之外再预测更后面的 token，V3 只多预测 1 个；这和第 8 站 speculative decoding 里 EAGLE 的 draft 思路相近。

Lecture 4 的总结：MoE 利用的是 sparsity，不是每个输入都需要整个 model；离散的 routing 很难优化，但 top-$k$ 的 heuristic 管用；现在有大量证据表明 MoE 有效、划算。

:::back
KV cache 和 decode 的 memory-bound 见[第 8 站](#infer)，expert parallel 和 all-to-all 见[第 6 站](#parallel)，z-loss 见[第 4 站](#train)。
:::

:::from
全部内容来自 [lecture 4](https://github.com/stanford-cs336/lectures/blob/main/lecture_04.pdf)：文字全部抽出，第 3、9、12、15、16、31、32、40 至 43、45、48、49、56、58 页渲染成图片看过（Switch 的 loss、DeepSeek 的 routing 式子、V3 的 bias、router z-loss、Zoph 的 bf16 例子、MLA 与 RoPE 的推导都以图片为准）。Linear attention 的 FLOPs 数值、三个位置的例子、delta rule 的例子、routing 的 4 个 expert 的例子、balancing loss 的两个数值、37/671、1.34 TB 是我构造和计算的；DeepSeek V3 的 bias 更新规则是凭我对原论文的了解补的，如上所注。
:::

## [eval] Evaluation

:::skip
能从 token probability 算 perplexity，用 Elo formula 算胜率，说出 exam、chat、agent、reasoning、safety 几类 benchmark 各测什么、各有什么 bias，并说出 train-test overlap 的几条应对路线，就可以去第 13 站。快速路线里可以跳；做 A5 时要用 GSM8K 的 accuracy，supplement 要用 MMLU、AlpacaEval、SimpleSafetyTests，那时再回来看相应的段落。
:::

### 难在从 construct 到 metric

Evaluation 看起来是机械的三步：定义一组 prompt，发给 model 拿回答，算 accuracy。Lecture 12 的核心论点是它其实决定了 AI 往哪个方向发展，难点在于把一个抽象的 construct（“这个 model 好不好”）变成一个具体的 metric。“好”有很多种定义：在 benchmark 上分数高（Artificial Analysis 的排行）；分数高而且便宜；人更喜欢它的回答（Arena）；人愿意用、愿意付钱（OpenRouter 的用量排行）。每一种都会丢掉别的东西。

### Perplexity

LM 是 token sequence 上的 probability distribution $p$。在一个 dataset $D$ 上的 perplexity 是

$$\text{perplexity}=\Big(\frac1{p(D)}\Big)^{1/|D|}=\exp\Big(-\frac1{|D|}\sum_{i}\log p(x_i\mid x_{<i})\Big)$$

也就是 $\exp$（平均每个 token 的 cross-entropy），第 4 站的 loss。用一次：4 个 token 的 probability 是 $0.5,\,0.25,\,0.125,\,0.5$，平均 negative log-probability 是 $\tfrac14(\ln2+\ln4+\ln8+\ln2)=\tfrac{7\ln2}{4}=1.213$，perplexity 是 $e^{1.213}=3.36$，相当于 model 平均在 3.36 个选项里均匀地猜。

传统的语言建模研究在同一个 dataset 的 train split 上训练、test split 上测（Penn Treebank、WikiText-103、One Billion Word Benchmark）；例如纯 CNN 加 LSTM 在 One Billion Word 上把 perplexity 从 51.3 降到 30.0。GPT-2 在 WebText 上训练，zero-shot 地在这些标准 dataset 上测，是 out-of-distribution 的 evaluation：在小的 dataset（PTB）上迁移有帮助，在大的（1BW）上不如专门训练的。

“Perplexity is all you need”的论证：真实的 distribution 是 $t$，perplexity 最低能到 $t$ 的 entropy，当且仅当 $p=t$；若 $p=t$，任何任务都能用 $p(\text{答案}\mid\text{问题})$ 解决；所以一直压低 perplexity，终会解决一切。Lecture 的评价是“more faith than science”。反方向的问题是 perplexity 管得太多：句子“Stanford was founded in 1885”里，“founded”这样的 token 也被计入，而它和要测的知识无关；办法是只算 conditional perplexity $p(\text{response}\mid\text{prompt})^{1/|\text{response}|}$。有些 benchmark 本质上就是 perplexity：LAMBADA（完形填空）、HellaSwag（多选的句子续写，比较各选项的 probability）。一个警告：如果你办 perplexity leaderboard，别人提交的是 model，你算 log-probability，就得相信它给的 probability 加起来真的是 1；做下游任务时只看生成的回答，没有这个问题。Perplexity 仍是 LM 开发中最常用的量（它随规模的变化很平滑，第 7 站的 scaling law 就是 fit 它），但还需要贴近真实用途的 benchmark。

### Exam：答案明确的考试

像考人一样考 model：题目和难度可控，答案明确、容易批改。

- **MMLU**：57 个科目（数学、美国历史、法律、道德……）的多选题，由研究生和本科生从网上公开资源收集，最初用 few-shot prompting 测 GPT-3。名字叫 language understanding，测的其实主要是知识。
- **MMLU-Pro**：去掉 MMLU 里有噪声和太简单的题，选项从 4 个扩到 10 个，用 chain of thought 作答；model 的 accuracy 比 MMLU 低 16% 到 33%，没那么饱和。选项数的变化也改变了随机猜的基线：4 选 1 是 25%，10 选 1 是 10%。
- **GPQA**：61 个从 Upwork 招来的 PhD 出题；PhD 专家的 accuracy 是 65%，非专家可以用 Google 查 30 分钟，只有 34%，GPT-4 是 39%。“Google-proof”指的就是查也查不到。
- **Humanity's Last Exam（HLE）**：2500 道多模态、多学科的多选和简答题，奖金池 50 万美元加论文署名，经过前沿 LLM 过滤（它们答对的题被去掉）和多轮审核。

趋势是题越来越难，因为旧的 benchmark 一个个饱和了。多选题的形式可以要多难有多难，但它不像真实的使用：真实的问题是开放的，未必有正确答案。

:::wrong 一个 model 在 MMLU 上分数高，说明它的 language understanding 强
Lecture 12 特意指出 MMLU 名不副实：57 个科目的题主要考的是知识（某个历史事件、某条法律），一个读得懂题但没背过答案的 model 照样答不对。分数还要和基线比：4 选 1 随机猜就有 25%。要测 reasoning 而不是知识，见下面的 ARC-AGI；要测开放的回答质量，见 chat benchmark。
:::

### Chat：开放的回答怎么评

大多数人不会问 AI 助手多选题。Lecture 的例子是“我想做甜菜配山羊奶酪的沙拉，哪些香草合适、哪些不合适”，没有标准答案。

**Chatbot Arena（现在叫 Arena AI）。** 网上随便一个人输入 prompt，拿到两个匿名 model 的回答，选哪个更好；再用 pairwise 比较 fit Elo 分数：

$$P(A\text{ 胜 }B)=\frac1{1+10^{(\text{Elo}_B-\text{Elo}_A)/400}}$$

选 Elo 使观察到的胜负的 probability 最大。用一次：Elo 差 0 时胜率 0.5，差 100 时 $1/(1+10^{-0.25})=0.64$，差 200 时 0.76，差 400 时 0.91。优点：prompt 来自真实使用（免费，用户有动力真用）；不需要每个 model 都答同一组 prompt（人在打分，这一点很重要）；新 prompt 和新 model 可以随时加入。问题：这些用户是谁，有没有偏向、有没有刷分的；二选一的判断把风格和正确性混在一起；人怎么判断正确性，会不会偏爱奉承（sycophancy）。

**AlpacaEval（2023）。** 805 条 instruction，metric 是相对于一个 baseline model（GPT-4 preview）的胜率，judge 也是 GPT-4 preview（自己评自己，可能有 bias）。问题是 LLM judge 偏爱更长的回答，leaderboard 因此被刷；AlpacaEval 2.0 用 regression 去掉长度的影响（length-controlled win rate）。怎么评估这个 metric 本身：看它和 Chatbot Arena（人）的相关性，相关性很高。

**WildBench。** 从 100 万条真实的人机对话里选 1024 条，用 GPT-4 Turbo 当 judge 并配一张 checklist（相当于给评判加 chain of thought）；和 Chatbot Arena 相关性好，几乎成了标准的 sanity check。

Lecture 的小结：两个相近回答之间的 pairwise 比较信号更强；人和 LLM judge 都有 bias；checklist 或 rubric 无论对人还是对 LLM 都能提高可靠性。

### Agent：评估它做了什么

前面评估的是 model 说了什么，agent benchmark 评估它做了什么。Agent 等于 LM 加 agent scaffold（决定怎样使用 LM 的逻辑），任务需要用工具（例如执行代码）并在一段时间里反复迭代。

- **SWE-bench**：12 个 Python repository 的 2294 个任务，给代码库和 issue 描述，提交一个 PR，用 unit test 判对错。
- **Terminal-Bench**：terminal 环境简单而通用；从 93 位贡献者那里收集了 229 个任务，其中 89 个组成 Terminal-Bench 2.0。
- **CyBench**：40 个 Capture the Flag（CTF）任务，用人类队伍第一次解出所用的时间衡量难度。
- **MLE-bench**：75 个 Kaggle 比赛，要训练 model、处理数据。

Scaffold 的常见设计：显式的计划（维护一个 todo list 逐项打勾）、分层委派（agent 调用 sub-agent，各自有干净的 context）、持久的 memory（读写文件）、极端的 context engineering（写明更多关于流程的指示）。所以评估 agent 等于同时评估 scaffold 和 LM。

### Pure reasoning：把推理和知识分开

前面的任务都需要语言和世界知识。能不能把 reasoning 单独拿出来？**ARC-AGI** 的题人类 100% 能解，对 AI 很难，而且每道题都不一样，背答案没用。ARC-AGI-1（2019）是在小网格上找变换规律；ARC-AGI-2（2025 年 3 月）要求更多步的 reasoning；ARC-AGI-3（2026 年 3 月）是交互式的环境。Lecture 的观察：pretrain 的 LM 在 ARC-AGI 上几乎没有进展，o1、o3 这类 reasoning model 出现后才开始起飞。局限是它只能测人类水平的 reasoning，测不了超过人的 reasoning；而且把推理和知识完全分开本身就很难。

### Safety

“Safe”对 AI 意味着什么？

- **HarmBench**：510 种违反法律或规范的有害行为。
- **AIR-Bench**：从监管框架和公司政策出发，分成 314 个风险类别，5694 条 prompt。
- **Jailbreak**：model 被训练成拒绝有害指令；GCG（Greedy Coordinate Gradient）自动优化 prompt 绕过 safety，在 open-weight 的 Llama 上优化出来的 prompt 能迁移到闭源的 GPT-4。

Lecture 的提醒：safety 的很多方面强烈依赖语境（政治、法律、社会规范，各国不同）；风险的种类很杂（hallucination、sycophancy、协助犯罪、不平等、人的批判性思维退化）；还有 dual use：能力强的网络安全 agent 既能做渗透测试，也能用来入侵。

### Realism 与 validity

**Ecological validity**：一个 evaluation 多大程度上反映真实的使用？考试类 benchmark（如 GPQA）离真实使用很远；Chatbot Arena 的 prompt 来自真人，但 distribution 不受控。往真实靠的几个例子：

- **GDPval**（OpenAI）：按美国 GDP 取前 9 个行业的 44 种职业，任务由平均约 14 年经验的从业者出。
- **MedHELM**：以前的医学 benchmark 多是标准化考试；MedHELM 有 121 个临床任务，来自 29 位临床医生，混合了私有和公开的数据。
- **Clio**（Anthropic）：用 LM 分析真实的用户数据，只公开“人们在问什么”的总体模式。

真实性和隐私有时是冲突的。

**Train-test overlap。** 机器学习的第一课是不要在 test set 上训练。ImageNet、SQuAD 那个时代有明确的 train/test 划分；现在是在 internet 上训练，并且不告诉别人用了什么数据。Lecture 列的四条路线：从 model 本身推断有没有见过 test data（例如利用 data point 的 exchangeability：dataset 里题目的顺序是任意的，如果 model 对原始顺序给出明显更高的 probability，说明它见过）；鼓励报告的规范（model 提供方应报告 train-test overlap，就像报告 confidence interval）；用新鲜的 evaluation（LiveCodeBench、UncheatableEval 抓取新网页；但时间戳不总是可靠，内容会被复制）；用私有的 evaluation（公司内部不在网上的代码库、你自己的文字；对 perplexity 最容易做到）。

**Dataset 质量。** Benchmark 自己也有错：SWE-bench 被修订成 SWE-bench Verified；有人为多个 benchmark 做了“Platinum”版本，去掉有错或有歧义的题；agent benchmark 有测试用例不足、平凡的 agent 也能通过的问题；Docent 用 LLM 检查 agent 的 trace，找出这类问题。

### Evaluation 是为了回答什么

没有唯一正确的 evaluation，取决于要回答的问题：用户或公司要为自己的用途选 model A 还是 B（例如客服机器人）；研究者想测 model 的原始能力（例如“智能”）；为商业和政策了解 model 的益处和危害；开发者要拿到改进 model 的反馈。

还要说清楚在评估什么。Foundation model 之前评估的是 method（标准化的 train/test 划分，大家在同样的数据上比算法）；现在评估的多是 model 或 system，怎么训练都行。也有例外：nanoGPT speedrun 固定数据，比谁最快训练到某个 validation loss。评估 method 鼓励算法上的创新，评估 model 对下游用户有用；两种都要先定好游戏规则。

Lecture 12 的三条结论：没有唯一正确的 evaluation，按要测的东西选；明确规则（评估的是 method、model 还是 agent）；考虑难度、真实性和 validity。

:::from
全部内容来自 [lecture 12](http://cs336.stanford.edu/lectures/?trace=lecture_12) 的讲稿（Python 源文件全文；讲稿里的图是外部图片，没有逐张看）。Perplexity 和 Elo 的数值例子、随机猜的基线、exchangeability 检测的一句解释是我补的（讲稿只给了论文链接和一张图）。
:::

## [mm] Multimodal models

:::skip
能写出 CLIP 的 symmetric loss 并在一个小 matrix 上算出来，说出 vision encoder、projector、LM 的标准结构，算出一张图在几个 model 里各变成多少个 token，并说出 Chameleon 为什么要离散的 token，就读完这门课了。快速路线里可以跳，没有作业用到 lecture 17。依赖第 2 站的 RoPE、第 4 站的 z-loss 与 QK-norm。
:::

### 一切都要先变成 token

世界是多模态的。Lecture 17 的终极目标是 omni model：输入任意模态的组合（理解），输出任意模态的组合（生成）。现状是 Transformer 很好用，所以要用它；Transformer 吃的是 token（离散的或连续的），一个 token 代表大约一个“语义单位”；所以一切都要先变成 token。文本也是这样做的（第 1 站），其他模态更难。于是有两个问题：怎样输入非文本的数据（例如理解图片），怎样输出非文本的数据（例如生成音频）。

### CLIP：用 caption 学 image 的表示

以前的 computer vision model 在人工 label 过的图片上训练。网上有多得多的（图片，caption）对，能不能用它们？CLIP 的做法：取一个 batch 的 $n$ 个（图片，文本）对（CLIP 用 32768），分别 encode，L2 normalize 之后两两算 cosine similarity，乘一个可学的 temperature，得到 $n\times n$ 的 logits matrix，第 $i$ 行第 $j$ 列是图片 $i$ 和文本 $j$。对每张图片，在 $n$ 个文本里选出配对的那个（按行做 softmax cross-entropy）；对每个文本，在 $n$ 张图片里选出配对的那个（按列做），两个 loss 取平均。

用一次，$n=3$，logits 是

$$L=\begin{pmatrix}4&1&0\\1&3&1\\0&2&3\end{pmatrix}$$

第 1 行的 cross-entropy 是 $\log(e^4+e^1+e^0)-4=0.066$，第 2 行 $\log(e^1+e^3+e^1)-3=0.240$，第 3 行 $\log(e^0+e^2+e^3)-3=0.349$，平均 0.218。按列：第 1 列 $\log(e^4+e^1+e^0)-4=0.066$，第 2 列 $\log(e^1+e^3+e^2)-3=0.408$，第 3 列 $\log(e^0+e^1+e^3)-3=0.170$，平均 0.214。总 loss 是 0.216。第 3 张图片和第 2 个文本的 logit 是 2，离对角线上的 3 不远，所以第 2 列和第 3 行的 loss 最大，gradient 会把这一对推开。

::fig[cs336-clipmat] 上面的 $3\times3$ logits。按行看是“这张图片配哪段文本”，按列看是“这段文本配哪张图片”，对角线是正确的配对。

:::wrong CLIP 只要让配对的图片和文本 similarity 尽量高就行
如果 loss 只奖励对角线，最省事的解是把所有图片和文本都 encode 成同一个 vector，每一对的 similarity 都是最大值。Softmax 的分母里有同一行、同一列的其他 $n-1$ 个 logit，它们是 negative：要让 loss 小，配对的 logit 必须比不配对的高。所有 embedding 相同时，每行的 logit 全部相等，每行的 loss 是 $\log n$，$n=3$ 时是 1.099，比上面例子的 0.216 大得多。这也是 CLIP 需要大 batch 的原因：batch 越大，每个样本面对的 negative 越多。
:::

数据：用 50 万个 query 去搜，每个 query 约 2 万对，共 4 亿对（图片，文本），数据没有公开；OpenCLIP 用 LAION-5B 复现，而 LAION-5B 本身是用 CLIP 过滤的。预处理：图片大小各异，先用 bicubic interpolation 把短边缩到 336 pixel，再从中间裁出 $336\times336$。Vision encoder 试了 ResNet-50 和 Vision Transformer（ViT），最好的是 ViT-L/14@336px：把图片切成 $14\times14$ pixel 的 patch，$336/14=24$，共 $24\times24=576$ 个 patch，每个 patch 是一个 token。Text encoder 是 GPT-2 式的 Transformer（63M parameter，12 层），取最高层 `[EOS]` 位置的 activation。主要结果：在 ImageNet 上 zero-shot 的 CLIP 超过了用 120 万张 ImageNet 图片训练的 ResNet-50。Ablation：改成从图片直接预测文本，compute 的效率差得多。Lecture 的小结：图片的表示学到的是（有噪声的）文本给出的语义；设计选择以图片分类为标准，不太细致；技术上要求大 batch，以及对整个 batch 做 softmax。

### SigLIP：每一对单独判断

SigLIP 把 CLIP 的“多分类”换成“二分类”：对每一对（图片 $i$，文本 $j$）单独判断是否配对，$z_{ij}=+1$（$i=j$）或 $-1$，

$$\ell=-\frac1n\sum_{i,j}\log\sigma\big(z_{ij}(t\,\mathbf x_i\cdot\mathbf y_j+b)\big)$$

$t$ 是可学的 temperature，$b$ 是可学的 bias。每一项只依赖一对，不需要对整行做 softmax，所以 loss 和 batch size 脱钩，也容易切到很多卡上算。用上面的 logits（当作 $t\,\mathbf x\cdot\mathbf y$，$b=0$）算一项：对角线上的 4 是正例，$-\log\sigma(4)=0.018$；第 2 行第 1 列的 1 是负例，$-\log\sigma(-1)=1.313$。九项加起来除以 3 是 2.52。负例有 $n^2-n$ 个、正例只有 $n$ 个，所以 bias $b$ 有用：它整体平移所有 logit，让大量负例的 loss 不至于压过正例。

数据是 WebLI：O(10 亿) 对从网上抓的（图片，文本），用 OCR 从图片里抽文字，只留质量最高的 10%，支持 100 种语言。效率：CLIP 用 256 块 TPUv3 训练 10 天，SigLIP 用 32 块 TPUv4 训练 5 天。Batch size 在 1.6 万以下时 SigLIP 比 CLIP 好；可以放大到 100 万，但 3.2 万就够了。

### 把 image encoding 接进 LM

**LLaVA。** Vision encoder 是 CLIP（ViT-L/14），LM 是 Vicuna（在 ShareGPT 对话上 fine-tune 的 LLaMA）。中间只有一个 linear projection $W$，把 image 的 feature 映射到 LM 的 embedding 空间（Flamingo、Q-Former 的接法更复杂）。数据：MS COCO 的图片有 bounding box 和众包的 caption，把 caption 或检测到的物体喂给 GPT-4，让它生成关于这张图的问题或对话，再配回原图，共 15.8 万条。训练两阶段：先冻住 vision encoder 和 LM，只训练 $W$（alignment）；再冻住 vision encoder，训练 $W$ 和 LM（fine-tuning）。

**LLaVA-OneVision。** 处理多张图和视频。Vision encoder 是 SigLIP（取最后一层 Transformer 之前和之后的 grid feature），LM 是 Qwen-2 72B，projector 是 2 层 MLP。分辨率很重要（例如 OCR），而 CLIP 把图片缩放、裁成 $336\times336$ 会丢信息；办法是 AnyRes（来自 LLaVA 1.5）：把图片切成 $a\times b$ 块，每块正好是 encoder 的分辨率，各自 encode 后拼起来；原图分辨率太高、token 太多时用 bilinear interpolation 缩减。三种输入的目标是产生差不多长的 token sequence：单张图用高分辨率，多张图每张用基础分辨率，视频每一帧用低分辨率。数据的理念是质量优先，训练的理念是由易到难；还观察到模态之间的迁移，例如单张图上学的图表理解能用到多张图上，单张图的 OCR 加上多张图的关系 reasoning 能迁移到 GUI agent，单张图上的 visual prompting（画个圈）能用到视频上。Lecture 的小结：标准的 VLM 模板是 vision encoder 加 projector 加 LM，大部分功夫在数据（大量 synthetic、针对任务的数据）。

**Qwen-VL。** Vision encoder 是 OpenCLIP 的 ViT-bigC（$14\times14$ 的 patch），adaptor 是一层 cross-attention，带 2D 的 positional encoding，把任意多的 patch feature 压成固定的 256 个 token；另加 `<img>`、`<box>`、`<ref>` 这些 special token 处理图片和定位。三阶段训练：大量低质量数据，冻住 LM，训练 vision encoder 和 adaptor；高质量的任务数据并提高分辨率，训练全部 parameter；instruction 数据，冻住 vision encoder，训练 adaptor 和 LM。

**Qwen2-VL。** 更大的 ViT（675M），关键是 dynamic resolution：按图片的原始分辨率决定 token 数。一块 $224\times224$ 的区域经 ViT/14 是 $16\times16=256$ 个 patch，每 $2\times2$ 个合成一个，得 64 个（lecture 写的是 66 个 token，多出的 2 个讲稿没有解释）。视频每秒取 2 帧，最多 16384 个 token。positional encoding 用 Multimodal RoPE（MRoPE）：把 RoPE 的 dimension 分给时间、高、宽三个方向。LM 从 Qwen2 初始化，vision encoder 从 DFN 初始化，三阶段和 Qwen-VL 类似。

**Qwen3-VL。** LM 是 Qwen3（dense 和 MoE，最大 235B-A22B），context 256K；vision encoder 是 SigLIP-2。几处改动：interleaved MRoPE，dimension 的分配从 $[t\,t\,t\,t\,w\,w\,w\,w\,h\,h\,h\,h]$ 改成 $[t\,w\,h\,t\,w\,h\,t\,w\,h\,t\,w\,h]$；视频的时间戳作为单独的 token 显式给出，而不是放在 positional encoding 里；per-token loss 按 square root normalize，平衡文本和多模态数据（视频的样本很长，不能让它主导）；adaptor 用 DeepStack，把视觉信息注入 LM 的多个层。Pre-training 四阶段（只训练 adapter，然后全部 parameter 分别在 8K、32K、256K 的长度上训练），post-training 是长 CoT 的 SFT、knowledge distillation 和 RL。

为什么要 interleave：第 2 站算过，RoPE 的第 $k$ 对 dimension 每个位置转 $\Theta^{-(2k-2)/d_k}$，靠前的对转得快（分辨相邻的位置），靠后的对转得慢（分辨很远的距离）。按 $[t\,t\,t\,t\,w\,w\,w\,w\,h\,h\,h\,h]$ 分，时间只拿到最快的那几对，高度只拿到最慢的那几对；交错着分，三个方向都同时拿到快和慢的 dimension（lecture 的说法是“把所有 axis 分配到低频和高频的频带上”）。

### Chameleon：理解与生成用同一种 token

前面的 VLM 把图片编码成连续的 vector 再注入 LM，缺点是不能生成图片（要另接 diffusion model）。Chameleon 把一切都映射成离散的 token，理解和生成图片就和处理文本一样，都是 autoregressive 地预测下一个 token。

关键在 encoder 必须输出离散的 token，才能被生成。它用 VQ-VAE：把图片 encode 到一个离散的 codebook 上，再解码回图片，最小化重建误差。$512\times512$ 的图片 encode 成 1024 个 token，codebook 大小 8192；$512\times512/1024=256$，每个 token 对应 $16\times16$ 个 pixel。另外重新训练了一个 BPE tokenizer。训练两阶段：第一阶段占 80%，大规模无监督（2.9T 文本 token、1.5T 图文 token、400B 图文交错的 token）；第二阶段占 20%，一半是第一阶段的数据，一半是高质量数据。

稳定性是难点：文本 token 的 entropy 低，图片 token 的 entropy 高，混在一起训练导致 norm 不断增长、logit 漂移。修法是 QK-norm 和 z-loss（第 4 站）。Lecture 的小结：方法优雅（只是离散 token 上的 autoregressive modeling），但性能不如连续的 encoder，因为离散化丢信息（想想 OCR 要的细节），多模态混合训练也很棘手。

Lecture 17 的总结：前沿 model 被期待是原生多模态的；根本的问题是怎样 encode 非文本的模态；理解和生成可能要求不同的东西（语义与细节）；图片和视频的信息密度低于文本，训练时要平衡二者以求稳定；连续的 encoder 加 Transformer 加 diffusion model 用于生成。

:::back
RoPE 的转速见[第 2 站](#arch)，z-loss 与 QK-norm 见[第 4 站](#train)，token 和 BPE 见[第 1 站](#bpe)。
:::

:::from
全部内容来自 [lecture 17](http://cs336.stanford.edu/lectures/?trace=lecture_17) 的讲稿（Python 源文件全文；CLIP 和 SigLIP 的伪代码图看过，其余图片没有逐张看）。CLIP 和 SigLIP 的数值例子、576 与 256 这几个 token 数的换算、interleaved MRoPE 的理由与第 2 站的联系、SigLIP 里 bias 作用的解释是我补的。
:::

## 作业

五个作业的仓库都公开了 handout、starter code 和 pytest。每份 handout 开头都有同一段 AI policy：AI 工具可以用来回答高层的概念问题、查 function signature 和 library API，但不能用来实现作业的任何部分，包括 coding agent（Cursor Agents、Codex、Claude Code）和 AI autocomplete（Cursor Tab、GitHub Copilot）；每个仓库还附了一份给 AI agent 的 `AGENTS.md`，要求 agent 只当助教、不写代码。自学时同样建议自己写，价值就在亲手写一遍。课程网站也给了自学者的 GPU 选项：2026 年 3 月单块 B200 的公开价格在每小时 5 到 7.5 美元之间（Modal 每月另有 30 美元免费额度），建议先在 CPU 上调通正确性，再上 GPU 跑训练或 benchmark。这一节在每个作业里列出 handout 的全部题目，但不给题目的答案。

### Assignment 1：Basics（先做）

**要从零写什么。** Byte-level BPE 的 training、encode、decode（第 1 站）；Linear、Embedding、RMSNorm、SwiGLU、RoPE、softmax、scaled dot-product attention、causal multi-head attention、pre-norm block 和整个 Transformer LM（第 2 站）；cross-entropy、AdamW、cosine schedule、gradient clipping、`np.memmap` 的 data loader、checkpoint、带 temperature 和 top-p 的 decoding（第 4 站）。不能用 `torch.nn`、`torch.nn.functional`、`torch.optim` 里的定义，例外是 `torch.nn.Parameter`、`torch.nn` 里的 container 类（`Module`、`ModuleList`、`Sequential` 等）和 `torch.optim.Optimizer` 基类。然后在 TinyStories 上训练，做 learning rate、batch size 和四组 ablation（去掉 RMSNorm、post-norm、NoPE、SiLU 对 SwiGLU），再换到 OpenWebText。

**题目清单。** Handout 的题目依次是：unicode1（`chr(0)` 是什么字符，它的 `repr` 和打印出来的样子有何不同）；unicode2（为什么在 UTF-8 而不是 UTF-16、UTF-32 的 byte 上训练 tokenizer，一个逐 byte decode 的错误写法错在哪，一个不能 decode 的两 byte 序列）；train_bpe（15 分）、train_bpe_tinystories、train_bpe_expts_owt（各自报告时间、memory 和 vocabulary 里最长的 token）；tokenizer（15 分）；tokenizer_experiments（10 篇文档上两个 tokenizer 的 compression ratio，用 TinyStories 的 tokenizer encode OpenWebText 会怎样，tokenizer 的 throughput 和 encode 整个 825 GB 的 Pile 要多久，为什么用 `uint16`）；linear、embedding、rmsnorm、positionwise_feedforward、rope、softmax、scaled_dot_product_attention、multihead_self_attention、transformer_block、transformer_lm；transformer_accounting（GPT-2 XL 的 parameter 数和 FLOPs，以及 GPT-2 small、medium、large 和 16384 的 context 下各部分的份额，第 3 站做了 XL 这一问的推导）；cross_entropy；learning_rate_tuning（用 handout 给的 toy SGD 例子试 learning rate 10、100、1000，看 loss 是降得更快还是 diverge）；adamw；adamw_accounting（AdamW 的 peak memory 分解成 parameter、activation、gradient、optimizer state 的式子，GPT-2 XL 在 80 GB 里最大的 batch，一步 AdamW 的 FLOPs，以及按 H100 的 495 TFLOP/s（TF32）、50% MFU、40 万步、batch 1024 训练 GPT-2 XL 要多少小时）；learning_rate_schedule、gradient_clipping、data_loading、checkpointing、training_together、decoding；experiment_log；learning_rate（2 B200 小时，TinyStories 的 validation loss 至多 1.45）、batch_size_experiment（1 B200 小时，batch 从 1 到 memory 上限）、generate；四个 ablation（各 0.5 B200 小时）；main_experiment（OpenWebText，2 B200 小时）；leaderboard（10 B200 小时；规则是一块 B200 上最多跑 45 分钟、只能用给的 OpenWebText training set，要求至少打败 5.0 的 naive baseline；handout 建议参考 NanoGPT speedrun，例如 input 与 output embedding 的 weight tying）。

**做完会什么。** 一个 LM 从文本到 sample 的每一行代码；第 3 站的 accounting 能对着自己的实现核对。

**时间与算力。** 工作量估计 30 到 50 小时（调研时的估计，handout 没有给）。BPE 只用 CPU：TinyStories 的限额是 30 分钟、30 GB RAM，OpenWebText 是 12 小时、100 GB RAM。完整的 TinyStories 训练在一块 B200 上 20 到 30 分钟；low-resource 配置（4096 万个 token，validation loss 目标从 1.45 放宽到 2.00）在 M4 Max 上 MPS 36 分钟、CPU 1 小时 22 分钟，loss 到 1.80。免费 Colab 的 T4 跑 low-resource 配置够用。

**做不了的部分和替代。** 课程的 sweep、ablation 和 leaderboard 按 B200 小时计（leaderboard 限一块 B200 上 45 分钟），校外没有对应的硬件，只能在 TinyStories 的 low-resource 配置上做缩小版的 sweep 和 ablation，handout 对没有 GPU 的学生也是这样建议的。OpenWebText 的 BPE 要的 memory 超过免费 Colab（约 12 GB），可以先在一个 1 到 2 GB 的子集上训练（调研时的经验）。

**提示。**

- 先在 TinyStories 的 validation set（2.2 万篇，而不是 training set 的 212 万篇）上调通 BPE，再上全量；用 cProfile 或 py-spy 找瓶颈。（handout）
- Pre-tokenization 用 multiprocessing 并行，切点落在 `<|endoftext|>`；每块先按 special token 切开再跑 regex，用 `re.finditer` 而不是 `re.findall`。做到这些，BPE training 可以在 2 分钟以内。（handout）
- 先把 corpus 变成“pre-token 的 bytes tuple → 次数”的表，只在这张表上 merge；再维护 pair 到包含它的 pre-token 的反向索引，每次 merge 只改这些。（经验）
- 并列时取 lexicographically greater 的 pair，tests 会逐条比对 merge 顺序。仓库里的 speed test 要求在一个小 corpus 上 vocabulary 500 的 training 1.5 秒内完成。（handout、tests）
- Tokenizer 的 tests 拿 GPT-2 的 vocabulary 和 merges 与 tiktoken 逐个比对；同时注册 `<|endoftext|>` 和 `<|endoftext|><|endoftext|>` 时要优先匹配长的；`encode_iterable` 在 1 MB 的 memory 上限下测试。（tests）
- Encode 的结果存成 `uint16`，训练时用 `np.memmap` 打开，先检查读出来的值没有超过 vocabulary 大小。（handout）
- Softmax 和 cross-entropy 先减 max，cross-entropy 让 log 和 exp 相消；RMSNorm 在 square 前 upcast 到 float32。（handout）
- 先在一个 minibatch 上 overfit 到 loss 接近 0；记录 activation、weight、gradient 的 norm。完整配置远超 20 到 30 分钟时，先查 data loading、checkpoint、validation 有没有拖慢训练。（handout）
- 缩短训练步数时，cosine schedule 要恰好在最后一步降到 $\alpha_{\min}$。在 Mac 的 MPS 上不要用 `set_float32_matmul_precision` 打开 TF32，handout 发现会碰到静默出错的 kernel；CPU 上可以 `torch.compile(model)`，MPS 上用 `backend="aot_eager"`。（handout）

### Assignment 2：Systems（值得做）

**要从零写什么。** Benchmark 和 nsys profiling 的脚本，mixed precision 与 memory profiling，activation checkpointing（第 3 站）；先写纯 PyTorch 的 tiled FlashAttention-2，再写 Triton 版的 forward（含 causal mask），backward 用 PyTorch 加 `torch.compile`（第 5 站）；naive DDP、flat gradient、与 backward 重叠的 DDP、optimizer state sharding、FSDP，以及 DP、FSDP、TP、2D parallelism 的手算题（第 6 站）。Leaderboard 比的是一个约 8B 的 model（$d=4096$、$d_{ff}=11008$、34 层、32 个 head、vocabulary 151936，bf16、causal）在两块 B200 上、batch 2、sequence 长 32768 时，一个完整 training step（forward、loss、backward、AdamW update）的 wall-clock 时间；naive baseline 是 10 秒，从空的 cache 开始整个 benchmark 必须在 10 分钟内跑完。Handout 有意让它很难放进 memory，给的思路有：用 Triton autotune 调 tile 大小；fused AdamW；把 LM head 和 cross-entropy 融合成一个 kernel，不实体化 `[batch, seq_len, vocab_size]` 的 logits；FlashAttention 的 backward 也用 Triton 写，dQ 与 dK、dV 分两遍算以避免 atomic；causal mask 下提前结束全为 0 的 tile，对角线上的 tile 单独处理；在 Hopper 之后的架构上用 TMA；只在必要时用 activation checkpointing。

**题目清单。** benchmarking_script、nsys_profile、mixed_precision_accumulation、benchmarking_mixed_precision、memory_profiling、gradient_checkpointing（memory 最优的 checkpoint 怎么分段）、pytorch_attention（各种 sequence length 和 head dimension 下普通 attention 的时间和 memory，找出 OOM 的点）、torch_compile、flash_forward（15 分）、flash_backward、flash_benchmarking（sequence length 从 128 到 65536 的 2 的 power）；distributed_communication_single_node（all-reduce 的 benchmark，最多 6 块 GPU）、naive_ddp 与它的 benchmark、minimal_ddp_flat_benchmarking、ddp_overlap_individual_parameters 与它的 benchmark、optimizer_state_sharding（15 分）与 accounting、fsdp（15 分）与 accounting；第 8 节的 alternate_ring_all_reduce、data_parallel_calcs、fsdp_calcs、tp_calcs、fsdp_tp_calcs；leaderboard。A2 的 model 配置表（vocabulary 10000、batch 4，默认 context 512）是 small（768、3072、12 层、12 head）、medium（1024、4096、24、16）、large（1280、5120、36、20）、xl（2560、10240、32、32）、10B（4608、12288、50、36）。

**做完会什么。** 读懂 profiler 的输出，知道时间和 memory 花在哪；写出一个真的比 PyTorch 快的 attention kernel；明白多卡训练的每一次通信。

**时间与算力。** Handout 没给总时间，估计 30 小时以上（调研时的估计）。前半（profiling、mixed precision、FlashAttention）需要一块 NVIDIA GPU，Triton kernel 要在 GPU 上跑（`TRITON_INTERPRET=1` 能在 CPU 上解释执行，但 handout 说它有 bug）；distributed 的部分需要 2 块 GPU，通信 benchmark 最多用到 6 块。

**做不了的部分和替代。** 多卡的 benchmark、profiling 和 leaderboard 在校外基本做不了。DDP、sharded optimizer、FSDP 的逻辑可以在 CPU 上用 gloo backend 多 process 开发和调试，handout 也是这样建议本地开发的。免费 Colab 的 T4 可以调 Triton kernel 的正确性，但 xl、10B 的配置会 OOM，benchmark 的数字也无法和 handout 的 B200 比较（调研时的经验）。手算题（第 8 节）只需要纸笔；第 6 站按 lecture 8 的两 matrix FFN 推过 DP 的条件，也列了 TPU Scaling Book 那张 FSDP、TP 的计算与通信表，作业用的是三个 matrix 的 SwiGLU，照同样的办法自己推。

**提示。**

- CUDA 调用是 asynchronous 的：计时前先 warm-up，每步之后 `torch.cuda.synchronize()`；handout 让你比较 0、1、2 次 warm-up，看清不 warm-up 的数字为什么不可信。用 NVTX range 把 warm-up 从 nsys 的结果里排除。（handout）
- Triton 调试：`tl.device_print` 打印；`TRITON_INTERPRET=1` 可以在 CPU 上解释执行，但 handout 说它有 bug；block pointer 的 offset 要乘上 tile size；matmul 用 `tl.dot`；推进 pointer 用 `.advance(...)`。（handout）
- 先写 tiled 的纯 PyTorch 版 FlashAttention-2，再写 Triton 版，逐步对比两者的中间结果。Grid 设成 `(T_q, batch_size)`，kernel 里只有一个遍历 key tile 的 loop，tile 至少 16 × 16。（handout）
- On-chip 的 $O$、$l$、$m$ 用 float32；累加用 `tl.dot(..., acc=acc)`；$\tilde P$ 乘 $V$ 之前转成 $V$ 的 dtype；causal mask 给被遮住的 score 加 $-10^6$。（handout）
- 每个 rank 要绑定不同的 GPU（`torch.cuda.set_device(rank)`）；GPU 上用 NCCL，gloo 只用于没有 GPU 的本地开发；distributed benchmark 前跑约 5 次 warm-up，各 rank 的计时用 `all_gather_object` 汇总。（handout）
- FSDP 只包 Embedding 和 Linear，norm 不切；在当前层 forward 时提前 all-gather 后面的层；在 mixed precision 下先转成 compute dtype 再通信，省一半 bandwidth，master weights 保持 fp32。（handout）

### Assignment 3：Scaling（有余力再做）

**要做什么。** 第一题用 `data/isoflops_curves.json` 复现 IsoFLOP 方法，fit 最优 $N$ 和 $D$ 随 compute 的 power law 并 extrapolate（第 7 站做的就是这件事）。第二题（scaling_laws，50 分）在 12 个 B200 小时的预算内通过 training API 提交小规模训练，fit 自己的 scaling law，预测 48 个 B200 小时下的最优配置和它的 validation loss，部分分数看提交的配置实际训练出来的表现。12 小时是大 run 的 25%。Writeup 要回答：怎样决定提交哪些 run，用什么方法 fit（handout 提示去读 Kaplan 和 Chinchilla 的做法），fit 得多好，预测的最优 model 多大、loss 多少，以及这个大小的 model 用什么 hyperparameter。

API 背后的设定：model 架构基本和 A1 一样；数据是 tokenize 过的 DCLM（最多 500B token，固定顺序，不重复），vocabulary 32K，context 512；optimizer 可选 AdamW 或 SGD，都是 warmup 加 cosine（handout 的例子是 AdamW、weight decay 0.01、gradient clipping 1.0、warmup 占 5%、最终 learning rate 是峰值的 10%）；没有 dropout；validation 用 $2^{18}\approx26$ 万个 token（最终 leaderboard 用更多）。每个 run 按 `total_train_tokens / n_evals` 分段训练，每段之后报告一次 validation loss。提交时要满足 `hidden_size == num_attention_heads * head_dim`、`num_attention_heads` 能被 `num_key_value_heads` 整除、`total_train_tokens` 能被 `512 * train_batch_size` 整除；同样的配置重复提交会被拒绝（409），不另扣预算。

**做完会什么。** 用有限的预算设计实验、fit、extrapolate，并对 extrapolation 的 error 心里有数。

**时间与算力。** 第一题估计 3 到 4 小时（调研时的估计），CPU 即可。

**做不了的部分和替代。** Training API 只能在 Stanford 网络内用学号访问，校外只能做第一题。README 给了非学生自己搭 API 的方法，需要 Modal、Postgres 和 GPU，成本不低。一个可行的替代是用自己 A1 的代码在 TinyStories 上做一个缩小版的 IsoFLOP 实验：取几个 $10^{14}$ 到 $10^{16}$ FLOP 的 budget，每个 budget 训练五六个不同大小的 model，按第 3 站的方法算出每个 run 的 FLOPs，按第 7 站的方法 fit。按第 3 站估的效率，一个 $10^{16}$ 的 run 在 T4 上大约要几十分钟到几小时（这是我的建议和粗估，没有实际跑过）。

**提示。**

- 每个 compute budget 直接取 loss 最低的那次 run，不必像原论文那样 fit 一个 quadratic function；但要意识到 grid 带来的 error（第 7 站讲过）。（handout）
- API 的预算一旦超过 12 B200 小时就会拒绝请求，排队和运行中的实验按 `max_runtime_seconds` 预扣；跑完后按实际时间结算（预留 30 分钟、12 分钟跑完，退回 18 分钟），超时的按 `max_runtime_seconds` 全扣。所以先规划好实验再提交，`max_runtime_seconds` 也别留得太宽。同样的思路可以用在自己实验室的 GPU 预算上。（handout、README）
- 第 7 站的 WSD schedule 在这里用不上：API 只支持 warmup 加 cosine，每个数据量都要单独跑一次；不过 API 每段报告一次 validation loss，可以看 loss curve 的形状。（handout，后半句是经验）
- 第 7 站的 critical batch 和 muP 都和这题有关：batch 和 learning rate 要在小规模上扫，并想清楚它们怎样随规模变（DeepSeek 式直接 fit，或 muP 式让 learning rate 可迁移）。Handout 也提示可以参考 muP 的原论文（Yang 等人的 Tensor Programs V）。（handout、lecture 11）
- 估计 non-embedding parameter 时用 $12\,n_{\text{layer}}\,d_{\text{model}}^2$。（handout）

### Assignment 4：Data（有余力再做）

**要从零写什么。** 从 WARC 抽文本、language identification、PII masking、harmful content 过滤、Gopher 规则、quality classifier、exact line dedup、MinHash + LSH 的 fuzzy dedup（第 9 站）；最后把这些 filter 组合起来处理一批英语 WET，用过滤后的数据训练一个 GPT-2 small 形状的 model（handout 写的是约 430M parameter），目标是 Paloma 的 C4 100 domains 上 perplexity 最低。Model 和训练脚本都不许改，只能改数据。

**题目清单。** look_at_cc（看一个 2026 年的 WARC 和对应的 WET，annotate 25 条 WET 记录的语言、domain、页面类型，数数要看多少条才遇到一个高质量页面）、extract_text（用 Resiliparse，UTF-8 失败时要检测 encoding）、language_identification（返回语言和 0 到 1 的分数，并人工核对 20 个、提出 threshold）、mask_pii（email、美国常见格式的电话、IPv4，分别替换成 handout 规定的占位符（email 是 `|||EMAIL_ADDRESS|||`，另两种同样格式），并找 false positive 和 false negative）、harmful_content（Dolma 的 NSFW 与 toxic speech 两个 fastText classifier）、gopher_quality_filters、quality_classifier（15 分）、exact_deduplication、minhash_deduplication；然后 filter_data、inspect_filtered_data、tokenize_data（GPT-2 tokenizer，每篇文档后加 `<|endoftext|>`，存成 `uint16`）、train_model。很多题除了代码还要求人工看 20 个 random 的例子并写几句判断。

**做完会什么。** 知道一份 web 数据要经过哪些处理、每一步丢掉了什么，以及“数据好不好”最后要靠训练出的 model 来回答。

**时间与算力。** Handout 没给。前面的过滤和去重用 CPU、跑单元测试即可完成；handout 给了下载样例 WARC 和 WET 的 `wget` 命令，fastText 的 `lid.176.bin` 是公开的。最后的训练用 8 块 B200、每块 batch 128、context 512 跑 16,384 步，$8\times128\times512\times16384\approx8.6\times10^9$ 个 token，handout 报告约 2 小时。

**做不了的部分和替代。** `filter_data` 用的 2,500 个英语 WET 文件、quality classifier 用的 Wikipedia 外链列表、Paloma 的 tokenized 文件都放在 Stanford 集群的 `/shared-data` 上，最后的训练更不可能在校外复现。替代：下载几个 WET 文件跑完整的 pipeline，统计每道 filter 去掉的比例，random 抽样看保留和被删的文档（这正是 `inspect_filtered_data` 一题要求的），并按处理速度估算处理整个 Common Crawl dump 要多久（`filter_data` 第 2 问）。

**提示。**

- 用 FastWARC iterate WARC/WET 的记录，用 tldextract 处理 URL；文件多时用 `concurrent.futures` 或 `multiprocessing` 按文件并行。（handout）
- MinHash + LSH 里 $k$ 个 hash 分成 $b$ 个 band、每个 band $r$ 个；算 signature 之前先 normalize 文本。用第 9 站的 $1-(1-s^r)^b$ 先算好 threshold再选 $b$、$r$。（handout）
- 可以用 Paloma 的 validation data 来设计 filter 或训练 classifier，但不能把它放进训练数据。（handout）

### Assignment 5：Alignment 与 reasoning RL（先做）

**要从零写什么。** 测 OLMo-2-0425-1B 在 GSM8K 上 zero-shot 和 few-shot 的表现；从零实现 on-policy GRPO：reward 计算、group normalization、per-token 的 policy gradient loss、按长度或按 constant 的聚合、gradient accumulation、与 vLLM 的 weight 同步；再实现 Dr. GRPO、RFT、MaxRL 和 off-policy 的 importance reweighting 与 clipping（GRPO 式、GSPO），比较它们（第 10 站）。可选的 supplement 用 Llama 3.1 8B 做 SFT 和 DPO。

**题目清单。** 主 handout：prompting_baselines；baseline_calcs（policy gradient estimator 的 variance）；tokenize_prompt_and_output、get_response_log_probs（含 entropy）、compute_rollout_rewards、compute_group_normalized_rewards_grpo、compute_policy_gradient_loss_on_policy、aggregate_loss_across_microbatch_sequence、grpo_train_step_standard_on_policy；grpo_experiments_standard_on_policy（2 B200 小时）、grpo_learning_rate、grpo_prompt_ablation（各 4 小时）；think_about_length_normalization、Dr. GRPO 的两个实现、think_about_rft、derive_difficulty_reweightings（6 分，三种 normalization 各对应哪种按难度的 reweighting）、think_about_advantage_normalization、MaxRL 的实现、grpo_train_step_variants_on_policy、grpo_experiments_variants_on_policy（8 小时）；off-policy 部分的 derive_surrogate_objectives、token 级 importance ratio 的 loss、think_about_importance_reweighting、GSPO 的 loss、off-policy 的 train step 和比较实验（8 小时）。Supplement：Llama 3.1 8B 在 MMLU、GSM8K、AlpacaEval、SimpleSafetyTests 上的 zero-shot baseline；看 SFT 数据、写 data loading 和 SFT 脚本、SFT（3 B200 小时；handout 用的是 learning rate $2\times10^{-5}$、cosine、3% warmup、weight decay 0.1、clip 1.0，一个 epoch，context 512，每步 32 条）；四个 benchmark 上评估 SFT；red teaming；看 HH 数据、dpo_loss、dpo_training（1 B200 小时，最后还要看 GSM8K 和 MMLU 上的“alignment tax”）。

**做完会什么。** 一个能跑起来的 LLM RL 的 training loop；知道每个设计选择改变了什么，以及怎样在 variance 很大的 RL 实验里得出可信的结论（handout 要求每个设置跑 4 个 seed 并画出 variance）。

**时间与算力。** Handout 只给了实验预算：主 GRPO 实验 2 B200 小时，learning rate sweep 和 prompt ablation 各 4 小时，两组变体比较各 8 小时。总工作量估计 30 小时以上（调研时的估计）。需要 2 块 GPU：一块跑 Hugging Face 的 model 和 optimizer，一块跑 vLLM。

**做不了的部分和替代。** 免费 Colab 不行：1B 的 model 全 parameter 训练，按第 3 站的 16 byte 每 parameter，光 weight、gradient、Adam state 就约 16 GB，已经占满 T4 的 16 GB，还没算 activation，也还要另一块卡跑 vLLM（调研时的估算）。可行的路：租两块 GPU 跑缩小版（少一些 step 和 seed）；或者拿自己在 A1 训练的 model 在一个更简单、能自动判对错的任务上做 RL，training loop 的结构完全一样（这是我的建议，handout 里没有这条）。几道推导题（baseline 的 variance、difficulty reweighting、surrogate objective）只需要纸笔，第 10 站给了需要的工具。

**提示。**

- 安装：README 要求先 `uv sync --no-install-package flash-attn`，再 `uv sync`。（README）
- GSM8K 的 ground truth 格式是“rationale `####` answer”，reward function 只接受答案部分，要按 `####` 切开并 strip。（handout）
- vLLM 的 stop string `</answer>` 只对 r1_zero 系列的 prompt 用；question_only 的 prompt 让答案写在 `\boxed{}` 里，用对应的 reward function。（handout）
- Baseline 一题要把生成分成三类（格式和答案都对、格式对答案错、格式错），并至少看 10 个格式对答案错的例子，判断是 model 错还是 parser 错。这一步能提前发现 reward 写错。（handout）
- GRPO 开始时 reward 接近 0 是正常的，取决于 seed 可能要几步才采到非零 reward；先跑约 50 步确认 validation reward 在上升，再跑完整的实验。（handout）
- Gradient accumulation 时每个 microbatch 的 loss 要乘上它在整个 batch 里的占比；换成 constant normalization 之后这里还要改。Optimizer step 之前 clip gradient norm。（handout）
- 比较变体时，advantage 为 0 的回答（全对或全错的 group；RFT 里所有答错的）不必送进 model，gradient accumulation 的步数可以按比例减少，但要确认裁掉之后算出的 gradient 和不裁时相同。（handout）
- 至少记录 loss、gradient norm、token entropy、train 和 validation 的 reward（total 与 format 分开）、validation 的平均回答长度，定期读 rollout 原文，handout 建议再加 pass@k。目标是 4 个 seed 平均 validation accuracy 至少 25%。（handout）
