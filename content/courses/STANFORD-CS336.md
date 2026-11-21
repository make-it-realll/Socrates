---
code: STANFORD-CS336
evidence: syllabus
evidenceNote: "Stanford CS336 Language Modeling from Scratch，Spring 2026 一期（Tatsunori Hashimoto、Percy Liang）。讲法跟着课程自己的材料：GitHub 上 stanford-cs336/lectures 仓库里的可执行讲稿 lecture_01、02、06、07、10、14（读的是 Python 源文件），lecture 3、5、8、9、11、15、16 的 PDF（只抽出了文字，slides 上的图和图里的数字没看到），五个作业的 2026 版 handout（Version 26.x）、各仓库的 README 和 tests，以及 A3 仓库里的 isoflops_curves.json。没有看 YouTube 录像，Lecture 4、12、13、17 和两场 guest lecture 没有读。"
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
    name: Data：filtering 与 deduplication
    l3: "有提示能做：算两个文档的 n-gram set 的 Jaccard similarity，套用 Gopher 的几条规则。"
    l4: "能独立做：实现 exact line dedup 和 MinHash + LSH，并用 $1-(1-s^r)^b$ 选 band 的 $b$ 和 $r$。"
    l5: "能讲给别人：prove MinHash 的 collision probability 等于 Jaccard similarity，说清每一道 filter 在防什么、threshold 为什么和训练规模有关。"
  - id: align
    name: Post-training：SFT、RLHF 与 GRPO
    l3: "有提示能做：算出 GRPO 一个 group 里每个 response 的 advantage。"
    l4: "能独立做：从 log-derivative trick 推出 policy gradient，prove baseline 不改变 expectation，实现 GRPO 的 loss 和 PPO 式 clipping。"
    l5: "能讲给别人：std normalization 和 length normalization 各引入了什么 bias，Dr. GRPO、RFT、MaxRL 各改了哪一项，以及 GRPO 的 loss 值为什么不能拿来看训练好坏。"
open:
  - label: "Stanford CS336 Spring 2026 课程网站（lecture 列表、材料链接、YouTube playlist）"
    url: "https://cs336.stanford.edu"
    note: "各站对应哪一讲以这里的 schedule 为准。"
  - label: "stanford-cs336/lectures：可执行讲稿 lecture_01、02、06、07、10、14 与 lecture 3、5、8、9、11、15、16 的 PDF"
    url: "https://github.com/stanford-cs336/lectures"
    note: "每一站的主要讲法来源。Python 讲稿读的是源文件全文；PDF 只抽出了 slides 上的文字，图里的内容没有看到。"
  - label: "Assignment 1（basics）handout，Version 26.0.3，以及仓库里的 tests"
    url: "https://github.com/stanford-cs336/assignment1-basics"
    note: "第 1 至 4 站。"
  - label: "Assignment 2（systems）handout，Version 26.1.3"
    url: "https://github.com/stanford-cs336/assignment2-systems"
    note: "第 3、5、6 站。"
  - label: "Assignment 3（scaling）handout，Version 26.0.5，以及 data/isoflops_curves.json"
    url: "https://github.com/stanford-cs336/assignment3-scaling"
    note: "第 7 站的全部数据。"
  - label: "Assignment 4（data）handout，Version 26.0.1"
    url: "https://github.com/stanford-cs336/assignment4-data"
    note: "第 9 站。"
  - label: "Assignment 5（alignment）handout，Version 26.0.0，以及 safety / RLHF supplement"
    url: "https://github.com/stanford-cs336/assignment5-alignment"
    note: "第 10 站。"
---

先看三个数。

**第一个。** A1 在 TinyStories 上训练的 model 不算 input embedding 有 1758 万个 parameter，要处理 3.28 亿个 token，总计算量约 $3.7\times10^{16}$ 次 floating-point operation。一块 B200 的 bf16 峰值是每秒 $2.25\times10^{15}$ 次，16 秒就能算完。Handout 说实际要 20 到 30 分钟。

**第二个。** 一个 GPT-2 XL 大小的 model，context 从 1024 个 token 拉长到 16384 个，token 多了 16 倍，一次 forward 的计算量多了 38 倍；attention 在里面的份额从 9% 变成 62%。

**第三个。** 花同样多的 compute 训练两个 model：一个 parameter 多、看的 token 少，另一个反过来。A3 给的一组 synthetic 数据里，同一个 compute budget 下最好和最差的配置 loss 能差 1 以上（per-token cross-entropy 差 1，相当于 perplexity 差 $e$ 倍）。

这门课把 language model 的每一层都从零写一遍：tokenizer、model、optimizer、training loop、GPU kernel、多卡训练、scaling law、数据清洗、post-training。贯穿全课的是一个问题：给定 compute 和 memory，怎样得到最好的 model。所以每学一样东西都要问它要多少 FLOPs、占多少 byte、在硬件上是被计算卡住还是被搬数据卡住。上面三个数分别在第 3、5、7 站得到解释。

| 站 | 内容 | 对应 lecture | 对应作业 |
|---|---|---|---|
| 1 | Byte-level BPE | 1 | A1 |
| 2、3、4 | Model、resource accounting、training | 2、3 | A1 |
| 5、6 | GPU 与 kernel、多卡 parallelism | 5、6、7、8 | A2 |
| 7 | Scaling laws | 9、11 | A3 |
| 8 | Inference | 10 | （A5 的 rollout 用到） |
| 9 | Data | 13、14 | A4 |
| 10 | Post-training | 15、16 | A5 |

这一页假定读者已经懂 Transformer 的基本运算。Attention 的 formula、$\sqrt{d_k}$ 的来历、RoPE 为什么只依赖相对位置、$6ND$ 的推导、Chinchilla parametric fit 的最优解、DPO 的推导，都在 [CS4248 的页面](../courses/CS4248.html)里一步步写过，这里用到时只给链接，篇幅留给 CS336 自己的东西：实现细节、资源的账、以及作业里会卡住的地方。

只有十几个小时时的路线：第 1、2、3、5、7、10 站必读，加上第 4 站里 A1 要用的部分；第 6、8、9 站可以先跳，每站开头写了跳过的代价。

## [bpe] Byte-level BPE tokenizer

:::skip
已经会手算 BPE 的 merge（[CS4248 第 1 站](../courses/CS4248.html#token)），并且能说出 merge 之后为什么只需更新与被合并 pair 重叠的那几个 count、pre-tokenization 和 special token 各防什么，就可以去第 2 站。快速路线必读：A1 的第一部分直接依赖这一站。
:::

### 从 bytes 出发

Unicode 17.0 定义了 159,801 个 character。直接拿 code point 当 vocabulary，有十几万个 entry，绝大多数几乎不出现。UTF-8 把每个 character 编成 1 到 4 个 byte，于是任何 string 都是 0 到 255 之间的 integer sequence，vocabulary 只有 256 个，不可能遇到表示不了的输入。代价是 sequence 变长：handout 的例子 `"hello! こんにちは!"` 有 13 个 character，UTF-8 之后是 23 个 byte，每个日文假名占 3 个 byte。

Byte-level BPE 从这 256 个 byte 出发，反复把最常见的相邻 pair 合成一个新 token。A1 在 TinyStories 上要求 vocabulary 大小 10,000：256 个 byte、1 个 special token `<|endoftext|>`，剩下 $10000-256-1=9743$ 次 merge。Vocabulary 不超过 65,535，所以 encode 之后的 token ID 存成 `uint16`，每个 token 2 个 byte。

一个后果要记住：token 是 byte string，不一定是完整的 character。“こ”是 `e3 81 93` 三个 byte，如果某个 token 恰好只含 `e3 81`，单独 decode 它就不是合法的 UTF-8。所以 decode 时要用 `bytes.decode("utf-8", errors="replace")`，把坏掉的 byte 换成 U+FFFD。

### Pre-tokenization：先切块，再在块里 merge

如果直接在整个 corpus 的 byte sequence 上数 pair，每次 merge 都要扫一遍全部文本；而且 `dog!` 和 `dog.` 会被各自合成不同的 token，vocabulary 浪费在同一个词的不同标点上。所以先用一个 regular expression 把文本切成 pre-token，merge 只在 pre-token 内部发生。A1 用 GPT-2 的 pattern（handout 给出的版本）：

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
`encode_iterable` 接受一个逐行产出 string 的 iterable（例如打开的文件），边读边 yield token ID。tests 用 1 MB 的 memory 上限跑它，所以不能先把整个文件读进来。难点在块与块的接缝：handout 要求 token 不跨过 chunk 的 boundary，否则结果会和整段一起 encode 不同。逐行切看起来自然，但 GPT-2 regex 里的 `\s+(?!\S)` 会把换行和后面的空格连成一个 pre-token：`"a\n  b"` 整段切是 `'a'`、`'\n '`、`' b'`，按行分成 `"a\n"` 和 `"  b"` 再切，就成了 `'a'`、`'\n'`、`' '`、`' b'`。所以接缝处要留意，例如把每块末尾的空白挪到下一块开头再切（这个例子是我用一个近似的 pattern 在 Python 里跑出来的，标准库的 `re` 不支持 `\p{L}`）。
:::

:::from
Unicode 的数字、UTF-8 的例子、pre-tokenization 的两个理由、GPT-2 regex、Sennrich 的例子和它的 12 次 merge、lexicographic tie-breaking、增量更新的思路、special token 的处理、并行 pre-tokenization 和“2 分钟”的目标、encode 的例子，来自 [A1 handout](https://github.com/stanford-cs336/assignment1-basics) 第 2 节；“玩具实现逐条扫 merge，作业要只 loop 用得上的”来自 [lecture 1](http://cs336.stanford.edu/lectures/?trace=lecture_01) 的讲稿。tiktoken 比对、overlapping special token、1 MB memory 上限是我读 A1 仓库的 `tests/test_tokenizer.py` 看到的。Token 数的递减、每次 merge 只改 2 个 count 的核对是我用 Python 实际跑的；反向索引、先减后加的写法、heap 并列选反的陷阱是我自己的经验，不是 handout 写的。
:::

## [arch] Transformer LM 与它的现代组件

:::skip
能写出 A1 model 每一步的 tensor shape、数出 parameter，并说出 pre-norm、RMSNorm、SwiGLU、RoPE、去掉 bias 各自换来了什么，就可以去第 3 站。快速路线必读（Lecture 3）。Attention 本身（$QK^\top/\sqrt{d_k}$、causal mask、RoPE 只依赖相对位置的 proof、multi-head 的 dimension）在 [CS4248 第 6 站](../courses/CS4248.html#attn)。
:::

### 从 token ID 到 logits：每一步的 shape

A1 要写的 model 和 2017 年的原始 Transformer 有四处不同（lecture 3 开头的总结）：normalization 放在每个 sublayer 前面（pre-norm），用 RMSNorm 而不是 LayerNorm，FFN 用 SwiGLU 而不是 ReLU，position 用 RoPE，并且所有 linear layer 都没有 bias。下面先把 shape 走一遍，再逐个看这些选择。

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

第一项是 identity matrix，不管多少层，gradient 都有一条原样传回 embedding 的路。Post-norm 里每一层的输出都要过一次 Norm，传到 $x_0$ 的每条路都要连乘 $L$ 个 Norm 的 Jacobian。Lecture 3 引的两篇论文分别报告了 post-norm 的 gradient attenuation 和 gradient spike；原本宣称的好处是可以不用 learning-rate warmup，现在大家用它是为了大 model 训练稳定、能用更大的 learning rate。几乎所有现代 LM 都用 pre-norm（BERT 是 post-norm）。这些是实验结论，这一页没有推导它。

Pre-norm 也带来一件必须处理的事：主干上没有任何东西控制 scale。粗略估计一下，如果每个 sublayer 往 residual stream 加一个 rms 约为 1、与已有内容无关的 vector，加了 $2L$ 次之后 rms 约为 $\sqrt{1+2L}$：4 层是 3，48 层是 9.8。直接把它送进 LM head，logits 的 scale 就随深度变化。所以 pre-norm 在最后一个 block 之后要再加一个 Norm，A1 的 final RMSNorm 就是这个作用。

### RMSNorm

LayerNorm 对一个 token 的 $d$ 个数减去 mean、除以 standard deviation，再乘 gain、加 bias。RMSNorm 只做一半：

$$\mathrm{RMSNorm}(a)_i=\frac{a_i}{\mathrm{RMS}(a)}\,g_i,\qquad \mathrm{RMS}(a)=\sqrt{\frac1d\sum_{i=1}^da_i^2+\varepsilon}$$

取 $a=(1,2,3,4)$，$g=1$：$\mathrm{RMS}=\sqrt{30/4}=2.739$，输出 $(0.365,\,0.730,\,1.095,\,1.461)$。LayerNorm 会先减去 mean 2.5，输出 $(-1.342,\,-0.447,\,0.447,\,1.342)$。RMSNorm 不把 vector 移到 mean 为 0，只调 scale；parameter 也只有 $d$ 个 gain，没有 bias。

A1 要求在 square 之前把输入转成 float32，算完再转回原来的 dtype。理由是 fp16 能表示的最大数是 65,504：某个 activation 是 300 时，$300^2=90000$ 已经 overflow 成 `inf`，RMS 变成 `inf`，整行输出变成 0。

:::wrong RMSNorm 比 LayerNorm 快，是因为它省了 FLOPs
在 TinyStories config 里每个 token 一次 forward 的 matmul 约 3700 万次 FLOP（第 3 站算）；9 个 RMSNorm 每个约 $3d\approx1500$ 次，合计约 1.4 万次，占 0.04%。省掉 mean 的那部分更是微不足道。Lecture 3 的说法是：FLOPs 不等于运行时间。Normalization 每读写一个数只做几次运算，是 memory-bound 的（第 5 站），它的运行时间由搬多少 byte 决定，比 FLOPs 份额大得多；RMSNorm 少一次 reduction、少一组 parameter 要搬，省下的是这部分。去掉 linear layer 的 bias 也是同样的理由加上 optimization 稳定性。
:::

### SwiGLU，以及 $d_{ff}=\tfrac83d$ 的来历

原始 Transformer 的 FFN 是 $W_2\,\mathrm{ReLU}(W_1x)$，中间的 dimension 是 $4d$。SwiGLU 把它换成

$$\mathrm{FFN}(x)=W_2\big(\mathrm{SiLU}(W_1x)\odot W_3x\big),\qquad \mathrm{SiLU}(x)=x\,\sigma(x)=\frac{x}{1+e^{-x}}$$

SiLU 在正半轴接近 identity，负半轴不是直接截成 0：$\mathrm{SiLU}(-1)=-0.269$，$\mathrm{SiLU}(-5)=-0.034$，$\mathrm{SiLU}(1)=0.731$，$\mathrm{SiLU}(2)=1.762$。$\odot$ 是 element-wise 乘法：$W_3x$ 这一支提供 linear 的值，另一支决定每个 dimension 放行多少，这叫 gating。

多了一个 $W_3$，parameter 就多了。为了和原来的 FFN 一样大，让两者的 parameter 数相等：

$$3\,d\,d_{ff}=2\,d\,(4d)\quad\Longrightarrow\quad d_{ff}=\frac83d$$

$d=512$ 时 $\tfrac83d=1365.3$。再取最近的 64 的倍数（matrix 的 dimension 是 64 的倍数时 GPU 的 tensor core 用得满）：$1344=21\times64$ 差 21.3，$1408$ 差 42.7，取 1344，正是 handout 给的值。GPT-2 XL 的 $d=1600$：$\tfrac83d=4266.7$，最近的是 $4288=67\times64$。

为什么 gating 更好，lecture 3 给的是证据而不是理由：Shazeer 2020 和 Narang 等人 2020 的实验里 GLU 一类结构稳定地更好，2023 年以后的大多数 model 都用它。Shazeer 的原话是把成功归于“divine benevolence”。A1 的 ablation 让你自己比较 SwiGLU 和 parameter 数相当的 SiLU FFN（$d_{ff}=4d$）。

### RoPE 的实现

RoPE 把 $q$、$k$ 的 dimension 两两配对，每对看成 plane 上的一个点，在位置 $i$ 转一个角度。第 $k$ 对（$k=1,\dots,d_k/2$）在位置 $i$ 的角度是

$$\theta_{i,k}=i\cdot\Theta^{-(2k-2)/d_k}$$

$\Theta=10000$，$d_k=32$。第 1 对每过一个 token 转 1 radian，转一圈要 $2\pi\approx6.3$ 个 token；第 16 对每个 token 转 $10000^{-30/32}$ radian，转一圈要约 35,000 个 token。前面的 dimension 分辨相邻几个 token，后面的 dimension 分辨很远的距离。为什么转过之后 score 只依赖 $j-i$，见 CS4248 第 6 站。

::fig[cs336-rope] $\Theta=10000$、$d_k=32$ 时各对 dimension 的转速。

实现上不要真的造一个 $d_k\times d_k$ 的 block-diagonal matrix。对每一对 $(x_{2k-1},x_{2k})$ 直接算

$$x'_{2k-1}=x_{2k-1}\cos\theta_{i,k}-x_{2k}\sin\theta_{i,k},\qquad x'_{2k}=x_{2k-1}\sin\theta_{i,k}+x_{2k}\cos\theta_{i,k}$$

每对 4 次乘法、2 次加法。$\cos$ 和 $\sin$ 只依赖位置和 $k$，在 `__init__` 里预先算成 `(max_seq_len, d_k/2)` 的表，用 `register_buffer(persistent=False)` 存起来（它不是要学的 parameter，也不必写进 checkpoint），forward 时按 `token_positions` 取出对应的 row。所有层、所有 head 共用这一张表。RoPE 只作用在 $q$ 和 $k$ 上，不作用在 $v$ 上；head 这个 dimension 当作 batch dimension，每个 head 转同样的角度。

:::from
四处改动的清单、pre-norm 的数据和两种解释、“FLOPs 不等于 runtime”、去掉 bias 的理由、GLU 的证据、$d_{ff}$ 的经验比例，来自 [lecture 3](https://github.com/stanford-cs336/lectures/blob/main/lecture_03.pdf)（只读到 slides 上的文字）。Pre-norm 与 post-norm 的 formula、final norm 的作用、RMSNorm 的定义和 upcast 的要求、SwiGLU 的定义和取 64 的倍数、Shazeer 那句话、RoPE 的角度 formula和 buffer 的建议、initialization，来自 [A1 handout](https://github.com/stanford-cs336/assignment1-basics) 第 3 节。Parameter 表、residual stream rms 的粗略估计、RMSNorm 的 FLOPs 份额、各个数值例子是我算的；pre-norm 稳定性的结论没有在这里推导，依据是 lecture 引用的实验。
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

### Memory：每个 parameter 16 个 byte

训练时每个 parameter 要存四样东西。全用 fp32 的 AdamW：parameter 4 byte，gradient 4 byte，Adam 的两个 moment 各 4 byte，共 16 byte。GPT-2 XL 是 $1.64\times10^9\times16=26.2$ GB，还没算 activation。

Mixed precision 并不让这个数减半。Lecture 8 列的典型配置是：bf16 的 parameter 2 byte、bf16 的 gradient 2 byte、fp32 的 master weights 4 byte（optimizer 累加更新的那一份，必须是 fp32）、两个 fp32 的 moment 各 4 byte，合计还是 16 byte。省下来的是 activation 和速度。

:::wrong 用了 bf16 mixed precision，训练的 memory 就减半
Parameter、gradient、optimizer state 这部分仍然是每个 parameter 16 byte，原因是 optimizer 的累加必须在 fp32 里做：A2 让你跑的实验里，在 fp16 里把 0.01 累加 1000 次得到 9.95（我用 numpy 的 float16 照做的结果），在 fp32 里累加是 10.0001。真正减少的是 activation（存成 2 byte），以及 matmul 在 tensor core 上的速度（B200 的 bf16 峰值是 fp32 的 30 倍）。A2 的 memory profiling 一题专门问 mixed precision 对 peak memory 的影响有多大，答案取决于 activation 在 peak 里占多少。
:::

### Activation：随 batch 和 $T$ 增长的部分

Backward 要用 forward 的中间结果，这些被 autograd 存下来的 tensor 叫 residual（saved tensors）。A2 handout 实测了一个 xl 大小的 block（$d=2560$，$d_{ff}=10240$，那段代码里 16 个 head，batch 4，$T=2048$，fp32，已经用 `torch.compile` 融合过）：一个 block 存下 3651.31 MiB，32 层就是 114 GiB。

这个数可以拆开看。一个 `(4, 2048, 2560)` 的 fp32 tensor 是 $4\times2048\times2560\times4$ byte = 80 MiB；一个 `(4, 16, 2048, 2048)` 的 attention score tensor 是 1024 MiB。$3651.31-2\times1024=1603.31$，约等于 20 个 80 MiB（一个 $d_{ff}$ 宽的 tensor 算 4 个）。也就是说，scores 和 softmax 之后的 probabilities 两个 $T\times T$ 的 tensor 占了一半以上。这是我对 handout 数字的拆解，handout 自己只说“attention 的 residual 有不少浪费，第 4 节修”，修法就是第 5 站的 FlashAttention。

其余部分随 batch、$T$、$d$ 成正比增长，FlashAttention 也救不了。这时用 activation checkpointing：forward 只存每段的输入，backward 走到这一段时从输入重算一遍 forward。A2 的例子里 4 个 block 分两段做 checkpoint，存下的只剩两段的输入 $2\times80=160$ MiB，代价是多算一次 forward。Lecture 2 给的极端情形：每层都存，memory $O(L)$；一个都不存、每次从头重算，memory $O(1)$ 但计算 $O(L^2)$；每隔 $\sqrt L$ 层存一个，memory $O(\sqrt L)$，额外计算只是一次 forward。

:::back
$2mnp$ 的 matmul 计数和 backward 是 forward 两倍的理由，见 [CS4248 第 7 站](../courses/CS4248.html#pretrain)。为什么小 matrix 跑不满峰值，见[第 5 站](#gpu)的 arithmetic intensity。
:::

:::from
$2mnp$ 规则、forward 2 倍 backward 4 倍、MFU 的定义和“0.5 就很好”、各 GPU 的峰值、optimizer state 用 fp32 的理由、activation checkpointing 的三种极端，来自 [lecture 2](http://cs336.stanford.edu/lectures/?trace=lecture_02) 和 [lecture 6](http://cs336.stanford.edu/lectures/?trace=lecture_06) 的讲稿。GPT-2 XL 的 config、FLOPs accounting 的题目结构、TinyStories 的 config 和时间、low-resource 的时间，来自 [A1 handout](https://github.com/stanford-cs336/assignment1-basics)。16 byte 的 mixed precision 拆法来自 [lecture 8](https://github.com/stanford-cs336/lectures/blob/main/lecture_08.pdf)。3651.31 MiB、160 MiB 和 fp16 累加的实验来自 [A2 handout](https://github.com/stanford-cs336/assignment2-systems) 第 2、3 节。表里的全部 FLOPs、parameter 数、MFU 的换算、3651 MiB 的拆解是我用 Python 算的；A1 的 accounting 题要你自己再做一遍 GPT-2 small、medium、large，这里没有列出。
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

### 训练不稳定的时候

Lecture 3 把不稳定的源头归到 softmax：exponential 和除法在输入很大时表现很差。Model 里有两个 softmax。

**输出的 softmax。** Softmax 对 logits 整体加一个 constant 不变，所以 $\log Z=\log\sum_ae^{o[a]}$ 可以在训练中漂移而 loss 不受影响。漂大了就出事：在 bf16 里，1 附近相邻两个数相差 $2^{-7}=0.0078$，1000 附近相差 4。Logits 都在 1000 左右时，差距小于 4 的两个 logit 根本分不开。z-loss 在 loss 里加一项 $(\log Z)^2$ 的惩罚，把它拉回 0 附近（PaLM、OLMo 2 等用过）。

**Attention 的 softmax。** QK-norm 在 $q$、$k$ 做 dot product 之前各过一次 RMSNorm。Norm 之后 $\|q\|$、$\|k\|$ 由 gain 决定，$q\cdot k\le\|q\|\|k\|$，attention logits 就不会随训练无限变大。

A1 的调试建议：先在一个 minibatch 上 overfit，loss 应该很快接近 0，做不到就是实现有错；在各个 component 设 breakpoint 看中间 tensor 的 shape；持续记录 activation、weight、gradient 的 norm。A1 还让你做 learning rate sweep 并找到发散的 boundary，民间说法是最好的 learning rate 在“edge of stability”附近。

:::wrong Loss 变成 NaN，就是 learning rate 太大
Learning rate 太大确实会发散，但从 A1 的实现看，NaN 更常见的来源是数值：softmax 或 cross-entropy 没有先减去 max，logits 一过 89 就在 fp32 里 overflow；RMSNorm 没有 upcast，fp16 里一个 300 的 square 就成了 `inf`；mask 用 `-inf` 填满了一整行（例如 query 一个 key 都看不到），softmax 得到 $0/0$。这些在 learning rate 很小时也会出现。看到 NaN，先找第一个出现 `inf` 的 tensor，再考虑 learning rate。
:::

:::from
Cross-entropy 的两条要求、perplexity、AdamW 的 algorithm 和 hyperparameter、cosine schedule 的定义、gradient clipping 的定义和 $\varepsilon$、data loader 的 sampling 方式和 `np.memmap`、checkpoint 的内容、low-resource 的 $T_c$ 提示、调试建议和“edge of stability”，来自 [A1 handout](https://github.com/stanford-cs336/assignment1-basics) 第 4 至 7 节。Weight decay 的作用、不用 dropout、z-loss 和 QK-norm、“小心 softmax”来自 [lecture 3](https://github.com/stanford-cs336/lectures/blob/main/lecture_03.pdf)（只读到文字，z-loss 的系数没有看到，这里没写）。数值例子、bias correction 的表、L2 与 AdamW 的对比、warmup 的估算、bf16 的间距、NaN 的几个来源是我写的和算的。
:::

## [gpu] GPU、kernel 与 FlashAttention

:::skip
能用 arithmetic intensity 判断一个 operation 是 compute-bound 还是 memory-bound，说清 fusion 和 tiling 各省掉了哪些 HBM 读写，手算 online softmax 的 recurrence，并写出一个最简单的 Triton kernel，就可以去第 6 站。快速路线必读（Lecture 5、6），A2 的前半全靠它。
:::

### 算得快，搬得慢

GPU 由很多 streaming multiprocessor（SM）组成。离 SM 越近的 memory 越快也越小：每个 SM 里有 register 和 shared memory（与 L1 cache 共用），整块芯片共用一个 L2 cache，最外面是 HBM（global memory）。Lecture 6 给的数：

| | A100 | H100 | B200 |
|---|---|---|---|
| SM 个数 | 108 | 132 | 148 |
| 每个 SM 的 L1 + shared memory | 192 KB | 256 KB | 256 KB |
| HBM 容量 | 80 GB | 80 GB | 192 GB |
| HBM bandwidth | 2 TB/s | 3.35 TB/s | 8 TB/s |
| bf16 dense 峰值 | 312 TFLOP/s | 989.5 TFLOP/s | 2250 TFLOP/s |

任何计算都是三步：从 HBM 把输入搬进来，算，把结果搬回去。设计算和搬运可以完全重叠，用时是两者中较长的那个。比较两个比值：

- Accelerator intensity：硬件每秒能算的 FLOP 除以每秒能搬的 byte。H100 是 $989.5\times10^{12}/3.35\times10^{12}=295$，B200 是 $2250/8=281$。
- Arithmetic intensity：这个 operation 每搬一个 byte 要做多少 FLOP。

后者小于前者，搬运更慢，叫 memory-bound；反之 compute-bound。

**ReLU。** bf16 的 $n$ 个数：读 $2n$ byte、写 $2n$ byte，做 $n$ 次比较，intensity 是 0.25。比 295 小一千多倍，GPU 绝大部分时间在等数据。

**Matrix multiplication。** 两个 $n\times n$ 的 bf16 matrix：读写 $3\times2n^2$ byte，算 $2n^3$ 次，intensity 约 $n/3$。$n=1024$ 时是 341，超过 295，compute-bound。

**$X$（$B\times D$）乘 $W$（$D\times F$）。** FLOPs 是 $2BDF$，byte 是 $2BD+2DF+2BF$。$B$ 远小于 $D$、$F$ 时 intensity 约为 $B$。取 $D=F=4096$：

| $B$ | 1 | 16 | 64 | 256 | 1024 |
|---|---|---|---|---|---|
| intensity | 1.0 | 15.9 | 62.1 | 227.6 | 682.7 |

在 H100 上 $B$ 要到 300 左右才 compute-bound。$B$ 在 training 里是 batch 乘 sequence length（几万），在 inference 生成阶段是同时在服务的请求数（第 8 站）。第 3 站 TinyStories 的 $d=512$ 那些小 matrix 也落在不够满的范围。

::fig[cs336-roofline] H100 的 roofline。横轴是 arithmetic intensity，纵轴是能达到的 FLOP/s；拐点在 295。圆点是上面几个 operation。

### Fusion：一次搬运多做几件事

Softmax 按 PyTorch 的写法拆成五个 kernel：求 row max、减去 max、exp、求和、除法。Lecture 6 数了一个 $M\times N$ 的 matrix 上的 HBM 读写：读 $5MN+M$ 个数，写 $3MN+2M$ 个。整件事其实只需要读 $MN$、写 $MN$：每行读进 shared memory，在里面做完全部五步，写回去一次。读写总量从约 $8MN$ 降到 $2MN$，对 memory-bound 的 operation，这直接就是 4 倍的速度。

Fusion 还省 memory。A2 handout 演示了 RMSNorm：不融合时 autograd 存下三个和输入一样大的 tensor 外加几个小的；`torch.compile` 融合之后只存输入本身和两个小 tensor。

### Tiling：让读进 shared memory 的数被反复使用

Matmul 是 compute-bound 的前提是每个数读进来之后被用很多次。最朴素的 kernel 每个 output entry 自己去 HBM 读一整行和一整列，同一个数被不同的 output 读了 $N$ 次。Tiling 把 output 切成 $T\times T$ 的块，每个 thread block 负责一块：把对应的 $A$ 的一条 tile 和 $B$ 的一条 tile 读进 shared memory，在里面算完部分和，再读下一对 tile。每个 input 从 HBM 读的次数从 $N$ 降到 $N/T$。

Tile 大小也带来新问题。Lecture 5 的例子：A100 有 108 个 SM，用 $256\times128$ 的 tile，$1792\times1792$ 的 matmul 切成 $7\times14=98$ 块，一轮就做完；$1793\times1793$ 要切成 $8\times15=120$ 块，第一轮 108 块，剩下 12 块单独跑一轮，大部分 SM 空着。这叫 wave quantization，所以 matrix 的 dimension 取 64、128 的倍数不只是对齐 memory，也是为了块数整齐。

::fig[cs336-wave] A100 上同样的 tile，两个只差 1 的 matrix。

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

::fig[cs336-flash] FlashAttention-2 forward：每个 program instance 负责一块 query，把它留在 shared memory 里，依次读入每一块 key 和 value。$T\times T$ 的 $S$、$P$ 只以 $B_q\times B_k$ 的小块出现在 shared memory 里，从不写进 HBM。

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

A2 的 FlashAttention-2 forward 是同一种写法的放大：grid 是 `(T_q, batch_size)`，每个 instance 用 block pointer load 自己那块 $Q$，只有一个 loop，依次 load 每块 $K$、$V$，用 `tl.dot` 做 matmul，按上面的 recurrence更新 $m$、$l$、$O$，loop 末尾用 `.advance(...)` 推进 pointer，最后写出 $O$ 和 $L$。

**测时间的两个坑。** CUDA 的调用是 asynchronous 的：`torch.matmul` 返回时 GPU 可能还没算完，计时前后都要 `torch.cuda.synchronize()`。第一次调用还包含编译、cache 和 memory 分配，要先跑几次 warm-up 再计时；A2 让你比较 0、1、2 次 warm-up 的结果。

:::back
Arithmetic intensity 解释了[第 3 站](#account)里 TinyStories 只用到峰值 1% 的现象，也会在[第 8 站](#infer)解释为什么生成 token 是 memory-bound 的。
:::

:::from
GPU 的结构和 memory hierarchy、“compute 比 memory 涨得快”、六个让 GPU 变快的手段、wave quantization 的 1792 与 1793 的例子、FlashAttention 的三步（tiling、online softmax、fusion）来自 [lecture 5](https://github.com/stanford-cs336/lectures/blob/main/lecture_05.pdf)（只读到文字）。硬件表、arithmetic intensity 的定义和 ReLU 与 matmul 的例子、roofline、naive softmax 的读写计数、Triton 的 programming model和 softmax kernel 的结构，来自 [lecture 2](http://cs336.stanford.edu/lectures/?trace=lecture_02) 和 [lecture 6](http://cs336.stanford.edu/lectures/?trace=lecture_06) 的讲稿；$B>295$ 的结论来自 [lecture 10](http://cs336.stanford.edu/lectures/?trace=lecture_10)。FlashAttention-2 的 algorithm、backward 的 formula、kernel 的结构要求、Triton tips、benchmark 的 warm-up 与 synchronize 来自 [A2 handout](https://github.com/stanford-cs336/assignment2-systems) 第 2、4 节。$D=4096$ 的 intensity 表、online softmax 的数值例子、attention 的 4.3 μs 与 40 μs 是我算的。没有读 FlashAttention 原论文。
:::

## [parallel] Parallelism 与 communication cost

:::skip
能写出 ring all-reduce 的时间，算出 DDP 和 ZeRO 1/2/3 每个 GPU 每个 parameter 占几个 byte、通信量各多少，推出 data parallel 在什么 per-device batch 下开始被通信卡住，并说出 tensor parallel、pipeline parallel 各适合放在哪一级网络，就可以去第 7 站。快速路线里可以先跳（没有多卡时 Lecture 7、8 用不上），代价是 A2 的后半和大规模训练的系统部分读不懂。
:::

### 为什么要多卡，以及卡之间的路有多宽

两个理由：parameter、gradient、optimizer state、activation 放不进一块 GPU；或者想用更多 FLOPs 早点训完。第 3 站算过，1.64B 的 model 光是 parameter 相关的部分就要 26 GB；70B 的 model 是 1.1 TB，没有哪块卡放得下。

多卡之后，数据在卡之间的搬运成了新的瓶颈。Lecture 7 的层级：一个 node 里 8 块 GPU 通过 NVLink/NVSwitch 相连（B200 的 NVLink 5.0 约 1.8 TB/s，而它的 HBM 是 8 TB/s）；node 之间走 InfiniBand，约 0.05 TB/s。越往外越慢，和单卡上 shared memory、HBM 的层级是同一个故事：这周要做的是减少卡之间的通信，正如上周减少 HBM 的读写。

### Collective operations 与 ring 的代价

几个最常用的 collective：

- All-gather：每块卡有一段，结束时每块卡都有全部。
- Reduce-scatter：每块卡有一份完整的 tensor，结束时每块卡有总和的一段。
- All-reduce：每块卡有一份完整的 tensor，结束时每块卡都有总和。它等于 reduce-scatter 接着 all-gather。

A2 的分析 model：$N$ 块卡，每块卡每秒能向外发 $W$ byte，tensor 大小 $S$ byte。Ring all-gather 把卡排成一圈，每一步每块卡把手上的一段（$S/N$）传给右边，$N-1$ 步之后人人都有全部，用时 $\tfrac{N-1}{N}\cdot\tfrac{S}{W}$。Ring reduce-scatter 一样，只是传之前先把自己那份加进去。All-reduce 是两者相加：

$$t_{\text{all-reduce}}=2\,\frac{N-1}{N}\,\frac SW$$

$\tfrac{N-1}{N}$ 随 $N$ 增大趋于 1，所以时间几乎不随卡数增长。算一个：1.64B 的 model，bf16 的 gradient 是 $S=3.28$ GB。8 块卡、按 1.8 TB/s 算是 3.19 ms，64 块卡是 3.59 ms；同样 8 块卡如果走 0.05 TB/s 的 InfiniBand，是 115 ms。

::fig[cs336-ring] $N=4$ 时的 ring all-gather。Reduce-scatter 的走法相同，只是每块卡传出去之前先把自己的那份加进去。

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

$D$、$F$ 消掉了，结论和 model 大小无关：每块卡分到的 token 数至少要是“FLOP/s 除以 byte/s”。B200 的 $C=2.25\times10^{15}$，走 NVLink（1.8 TB/s）时 $b\ge1250$ 个 token；走 InfiniBand（0.05 TB/s）时 $b\ge45000$。总 batch 固定为 $B$ 时，$N=B/b$，所以能用的卡数最多是 $BW/C$。而 batch size 不能无限加大：超过 critical batch size 之后，同样多的 token 带来的 loss 下降越来越少（lecture 9）。这就是只靠 data parallel 扩不下去的原因。

### Tensor parallel 与 pipeline parallel

**Tensor parallel** 把一个 layer 的 matrix 切开。FFN 里 $W_1$、$W_3$ 按 output dimension 切（column parallel），每块卡算出中间层的一段；$W_2$ 按 input dimension 切（row parallel），每块卡用自己那段中间层算出一个部分和；最后一次 all-reduce 加起来。中间层不必拼回来，一个 FFN 的 forward 只要一次 all-reduce。代价是每一层都要同步交换 activation，lecture 8 给的通信量是每层 $8bsh\tfrac{n-1}{n}$（$b$ batch、$s$ sequence length、$h$ 是 $d$），而且是阻塞的。所以它只放在 NVLink 相连的一个 node 之内，通常不超过 8 路。

**Pipeline parallel** 按层切：卡 1 放前几层，卡 2 放接下来几层……卡之间只传 boundary 上的 activation，是点对点的，适合慢的网络。问题是依赖：卡 2 要等卡 1 算完。把 batch 切成 $m$ 个 microbatch 流水作业，$p$ 个 stage 时，空等的时间（bubble）和有效计算之比是 $\tfrac{p-1}{m}$，利用率是 $\tfrac{m}{m+p-1}$：

| $p$ | $m$ | 利用率 |
|---|---|---|
| 4 | 1 | 25% |
| 4 | 4 | 57% |
| 4 | 16 | 84% |

::fig[cs336-pipe] 4 个 stage、4 个 microbatch 的 pipeline。灰色是 bubble：一块卡一共 14 格时间里只有 8 格在算，$8/14=4/7$。

Lecture 8 的经验法则：先在一个 node 内用 tensor parallel（或 MoE 的 expert parallel）到 8 路；model 还放不下，就跨 node 加 pipeline parallel（或用 ZeRO-3，看网络）；放下之后，剩下的卡全用 data parallel。Llama 3 405B 的配置是 DP 128、TP 8、PP 16。

:::from
动机、通信的层级和 bandwidth、collective operations 的定义、“all-reduce = reduce-scatter + all-gather”、各种 parallelism 的实现骨架来自 [lecture 7](http://cs336.stanford.edu/lectures/?trace=lecture_07) 的讲稿。ZeRO 1/2/3 的步骤、12 byte 的例子和 6.67B、16B、24.6B、53.3B 这几个数、“ZeRO-1 免费”、ZeRO-3 不减 activation、pipeline 的 bubble 比例、tensor parallel 的通信量和放置原则、经验法则和 Llama 3 的配置来自 [lecture 8](https://github.com/stanford-cs336/lectures/blob/main/lecture_08.pdf)（只读到文字）。Ring algorithm和它的用时、column/row parallel 的写法、FSDP 的提前 all-gather 来自 [A2 handout](https://github.com/stanford-cs336/assignment2-systems) 第 7、8 节；data parallel 的那个不等式是 A2 第 8.2 节的计算题，这里推了一遍，FSDP 和 TP 的几问没有推。All-reduce 的毫秒数、$C/W$ 的数值、pipeline 的利用率表是我算的；1.8 TB/s 是 lecture 7 给的 NVLink 总 bandwidth，单向的 bandwidth 可能只有一半，所以这些毫秒数只看量级。
:::

## [scaling] Scaling laws 与 IsoFLOP

:::skip
能用 IsoFLOP 方法从一组 run 里读出每个 compute budget 的最优 $N$，用 least squares fit $N_{\text{opt}}\propto C^a$ 并 extrapolate，说明为什么 $D$ 的 exponent 一定是 $1-a$，以及这个 fit 对哪些选择敏感，就可以去第 8 站。快速路线必读（Lecture 9），A3 的第一题就是这一站。从 parametric fit $L=E+A/N^\alpha+B/D^\beta$ 推出最优分配的过程在 [CS4248 第 7 站](../courses/CS4248.html#pretrain)。
:::

### 问题：同样的 compute，model 该多大

A3 的设定：你有 48 个 B200 小时训练最终的 model，另有 12 个小时做小规模实验。Compute $C\approx6ND$ 定了之后，$N$ 和 $D$ 此消彼长。在大 model 上直接试错太贵，办法是在一系列小 budget 上找出各自的最优 $N$，看它随 $C$ 怎样变化，再 extrapolate。

为什么固定 $C$ 时 loss 对 $N$ 有一个最低点？Handout 的解释：$N$ 太小，model 装不下数据里的规律，花多少 compute 都没用；$N$ 太大，$D=C/6N$ 太少，走不了几步 gradient 就把 compute 用完了。极端情形 $N\to\infty$ 时连一步都走不完。两头都差，中间必有最低点。

### 读 A3 给的数据

`data/isoflops_curves.json` 里有 9 个 compute budget，每个 budget 有 8 个 run，$N$ 按相同的倍数 1.575 递增。每个 budget 取 loss 最低的那个 run（A3 建议这样做，而不是像 Chinchilla 原文那样fit parabola），$D=C/(6N)$：

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

A3 要的是 $10^{23}$ 和 $10^{24}$，代进同一个式子即可，这里不列。

这套数据的 $D/N$ 在 1.4 到 3.5 之间，和 Chinchilla Table 3 的约 20（CS4248 第 7 站）差很远。Handout 说这是 synthetic data。比例本身取决于 model、数据、tokenizer、训练细节，能从一个设定搬到另一个设定的只有方法。

:::wrong 每条 IsoFLOP curve 上 loss 最低的那个 run，就是这个 budget 的最优 $N$
它只是 8 个候选里最好的那个，真正的最优点可能落在两个相邻候选之间，而相邻候选差 1.575 倍。表里 $C=10^{21}$ 的最优 $N$（$6.86\times10^9$）甚至比 $6\times10^{20}$ 的（$6.97\times10^9$）还小，真实的最优 $N$ 不会随 compute 增加而变小，这就是 grid 造成的 error。9 个点相对 fit 出的 line 的偏差在 0.85 倍到 1.28 倍之间。换成 Chinchilla 原文的做法，对每条 curve 在 $\log N$ 上 fit 一条 parabola、取它的最低点，exponent 变成 0.515，extrapolate 到 $10^{22}$ 是 $2.79\times10^{10}$，比上面大 17%。Extrapolate 得越远，exponent 上 0.05 的差别放大得越多：每多 extrapolate 10 倍，两个预测之比再乘 $10^{0.05}=1.12$。A3 的 writeup 要你说明 fit 有多可靠，正是这个问题。
:::

### 让 scaling 实验便宜：WSD schedule

Chinchilla 式的分析要求每个 $(N,D)$ 都完整训练一遍。原因在 learning rate schedule：cosine schedule 的形状由总步数 $T_c$ 决定，训练 $D$ 个 token 的 run 中途停在 $D/2$ 处，并不等于一个按 $D/2$ 设计 schedule 的 run，不能拿来当数据点。所以 $n$ 个 model 大小、$n$ 个数据量要训练 $n^2$ 次。

Lecture 11 讲的 MiniCPM 和 DeepSeek 用 WSD（warmup、stable、decay）schedule 绕开它：warmup 之后 learning rate 长时间保持 constant，最后一小段（约 10%）快速衰减。Stable 阶段的 checkpoint 和 $D$ 无关，想要哪个数据量，就从对应的 stable checkpoint 拉出一段 decay。一个 model 大小只要训练一次，$n^2$ 变成约 $n$。

另一个问题是 learning rate、batch size 这些 hyperparameter 的最优值本身随规模变化。Lecture 11 介绍了两条路：DeepSeek 直接在小规模上 fit 最优 learning rate 和 batch 随 compute 的关系；muP 调整 initialization 和每层的 learning rate 随 width 的 scaling，使得小 model 上调好的 learning rate 可以直接用到大 model 上。

### Compute-optimal 不是该训练的 model

Chinchilla 的问题是“训练 compute 固定时 loss 最低”。Model 训完之后要被使用无数次，inference 的成本和 $N$ 成正比，所以实际的 model 都远超 compute-optimal 的数据量：lecture 9 列的 Llama 3 70B 每个 parameter 215 个 token，Mistral 7B 是 110 个。

:::from
A3 的设定、IsoFLOP 方法的步骤、“取最低的 run 而不是 fit parabola”的建议、“曲线为什么有最低点”的解释、数据文件，来自 [A3 handout](https://github.com/stanford-cs336/assignment3-scaling) 第 2 节。三种 Chinchilla 方法、Kaplan 与 Chinchilla 的分歧、tokens per parameter 的列表来自 [lecture 9](https://github.com/stanford-cs336/lectures/blob/main/lecture_09.pdf)；WSD、MiniCPM 和 DeepSeek 的做法、muP 来自 [lecture 11](https://github.com/stanford-cs336/lectures/blob/main/lecture_11.pdf)（都只读到文字）。表、两种 fit、$10^{22}$ 的 extrapolation、偏差范围和 parabola fit 的对比是我用 numpy 实际算的。
:::

## [infer] Inference：KV cache 与 speculative decoding

:::skip
能算出 KV cache 的大小，说明生成阶段为什么是 memory-bound、batch 怎样拿 latency 换 throughput、GQA 为什么两头都改善，并 prove speculative decoding 的输出 distribution 恰好是 target model 的，就可以去第 9 站。快速路线不含 Lecture 10，可以先跳；做 A5 时 rollout 由 vLLM 生成，这一站解释它在 optimize 什么。
:::

### Prefill 与 decode

Training 时一整条 sequence 一次 forward 就得到所有位置的预测，可以并行。生成时第 $t+1$ 个 token 依赖第 $t$ 个，只能一个一个来。每生成一个 token 都把整个前缀重新过一遍 model，大量计算是重复的：前缀里每个 token 在每一层的 key 和 value 都不会变。所以把它们存下来，叫 KV cache。

于是 inference 分两段。**Prefill**：把 prompt 一次过完，算出并存下所有 key 和 value，和 training 的 forward 一样可以并行，是 compute-bound 的。**Decode**：每步只算一个新 token，读出 cache 里的全部 key、value 做 attention，再把新的 key、value 追加进去。

Decode 的 arithmetic intensity（第 5 站）：MLP 那部分，同时服务 $B$ 个请求就是 $B$ 个 token 乘同一组 weight，intensity 约为 $B$；attention 那部分，每个请求有自己的 KV cache，读进来的 key、value 只被自己的一个 query 用一次，intensity 小于 1，而且和 $B$ 无关，batch 再大也救不了。Lecture 10 的总结：prefill compute-bound，decode memory-bound。

### KV cache 有多大

每个 token、每一层、每个 key/value head 存一个长 $H$ 的 key 和一个长 $H$ 的 value：

$$\text{每个 token 的 KV cache}=2\times L\times K\times H\times(\text{每个数的 byte})$$

Lecture 10 用 Llama 2 13B 的 config：$L=40$ 层，$K=40$ 个 head，$H=128$，bf16。每个 token $2\times40\times40\times128\times2=819{,}200$ byte，0.78 MiB；sequence 长 1024 时一条就是 800 MiB。Parameter 有 130 亿个，bf16 是 26 GB。

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

**GQA（grouped-query attention）** 让多个 query head 共用一组 key/value head。把 $K$ 从 40 减到 8，KV cache 缩小 5 倍（每 token 163,840 byte），$W_K$、$W_V$ 也变小，parameter 降到 113 亿：

| $B$ | memory | 每步 latency | throughput |
|---|---|---|---|
| 1 | 22.8 GB | 6.8 ms | 147 token/s |
| 64 | 33.4 GB | 10.0 ms | 6,417 token/s |
| 256 | 65.6 GB | 19.6 ms | 13,068 token/s |

::fig[cs336-kv] 同一个 13B model，MHA 与 GQA（8 组 KV head）的 throughput 随 batch 的变化，横轴是 log scale。空心点表示放不进 80 GB。

GQA 的代价是 accuracy，lecture 10 引的 GQA 论文报告下降很小。同一思路的变体：MLA 存一个压缩过的 vector 再在用时投影出 key、value；sliding window attention 只看最近的若干 token，KV cache 就不再随 sequence length 增长。

:::wrong 把 batch 开大，每个请求也会生成得更快
Throughput 是所有请求加起来的速度。上表里 $B$ 从 1 到 256，throughput 涨了 28 倍，而单个请求每生成一个 token 要等的时间从 8.0 ms 涨到 71.9 ms，慢了 9 倍。交互式应用在乎 latency，离线批处理和 RL 的 rollout 在乎 throughput，batch size 要按用途选。Lecture 10 还提到最容易的提速：同样的 model 起 $M$ 份 replica，latency 不变，throughput 乘 $M$。
:::

### Speculative decoding

Decode 一次只生成一个 token，而 prefill 可以并行处理很多 token。也就是说，检查一串 token 比生成它们便宜。Speculative decoding 让一个小的 draft model $p$ 先猜几个 token，再让 target model $q$ 一次 forward 把它们都检查一遍。

对每个猜出的 token $x$（它是从 $p$ sample 出来的）：以 probability $\min\big(1,\tfrac{q(x)}{p(x)}\big)$ 接受；拒绝时，从

$$r(x)=\frac{\max(q(x)-p(x),\,0)}{\sum_y\max(q(y)-p(y),\,0)}$$

里重新 sample 一个，并丢掉后面猜的 token。

这样得到的 token 恰好服从 $q$。Proof 只需两行。最终输出 $x$ 有两条路：$p$ 猜中 $x$ 且被接受，probability 是 $p(x)\min\big(1,\tfrac{q(x)}{p(x)}\big)=\min(p(x),q(x))$；或者猜了某个 token 被拒绝，再从 $r$ 抽到 $x$。被拒绝的总 probability 是 $1-\sum_y\min(p(y),q(y))$，而

$$\sum_y\max(q(y)-p(y),0)=\sum_yq(y)-\sum_y\min(p(y),q(y))=1-\sum_y\min(p(y),q(y))$$

两者相等，所以第二条路的 probability 正好是 $\max(q(x)-p(x),0)$。加起来，$\min(p,q)+\max(q-p,0)=q(x)$。

Lecture 10 用两个 token 的例子核对。取 $p=(0.7,\,0.3)$，$q=(0.4,\,0.6)$：draft 多猜了 A。猜 A 时以 $0.4/0.7=4/7$ 接受；猜 B 时 $q/p>1$，总是接受。$r=(0,\,0.3)/0.3=(0,1)$，拒绝之后一定换成 B。所以 $P(A)=0.7\times\tfrac47=0.4$，$P(B)=0.3+0.7\times\tfrac37=0.6$，正是 $q$。

能省多少，取决于 draft 和 target 有多像。设每个猜出的 token 被接受的 probability 都是 $\alpha$、一次猜 $\gamma$ 个，target 每 forward 一次平均产出 $\tfrac{1-\alpha^{\gamma+1}}{1-\alpha}$ 个 token（Leviathan 等人的分析，lecture 没有给这个式子）：$\alpha=0.8$、$\gamma=4$ 时是 3.36 个。实践中的组合如 70B 配 8B、8B 配 1B，draft 往往用 distillation 训得更像 target。

:::from
KV cache 的动机、prefill 与 decode 的 intensity 分析、Llama 2 13B 的 config 和 latency/throughput 的 model、GQA、MLA、sliding window、speculative sampling 的 algorithm 和两个 token 的 proof 框架，来自 [lecture 10](http://cs336.stanford.edu/lectures/?trace=lecture_10) 的讲稿；讲稿里的数值结果要运行才会显示，表里的每个数是我按它的 formula 重算的。一般情形的两行 proof 是我补的。expected 接受长度的 formula来自我对 Leviathan 等人 2023 年论文的记忆，没有在这次读到的材料里核对。
:::

## [data] Data：filtering 与 deduplication

:::skip
能说出一份 Common Crawl 文档要过哪几道 filter、每道防什么，能写 exact line dedup，能 prove MinHash 的 collision probability 等于 Jaccard similarity，并用 $1-(1-s^r)^b$ 选 band 的 $b$ 和 $r$，就可以去第 10 站。快速路线里可以和 A4 一起跳，代价是缺少数据清洗的实操。
:::

### 从网页到训练文本

Common Crawl 提供三种格式：WARC 是原始的 HTTP 响应（HTML 本身），WAT 是抽出的 metadata，WET 是 Common Crawl 自己从 HTML 抽出的纯文本。A4 第一步就让你自己从 WARC 抽文本，再和 WET 比较：HTML 转文本要去掉导航栏、广告，表格和图片怎么 linearize没有标准答案，这一步本身是有损的，lecture 14 引 DCLM 的结果说抽取的质量直接影响 model。

Lecture 14 把各种 filter 统一成一件事：给定一小份“好”的 target data $T$ 和海量的 raw data $R$，从 $R$ 里找出像 $T$ 的子集。要求是能从 $T$ 推广出去，并且极快（要跑在 $R$ 上）。A4 里依次实现的：

- **Language identification。** fastText 现成的 `lid.176.bin`，支持 176 种语言，输出每种语言的 probability。Dolma 保留英语 probability $\ge0.5$ 的页面；A4 提供的英语 WET 用的 threshold 是 0.7。
- **PII masking。** 把 email、电话号码、IP 地址替换成占位符。
- **Harmful content。** 用 classifier 去掉 NSFW 和 toxic 的内容。
- **Gopher 的规则。** A4 要求实现其中四条：文档少于 50 个或多于 100,000 个 word 就去掉；平均 word 长度不在 3 到 10 个 character 之间就去掉；超过 30% 的行以省略号结尾就去掉；含至少一个字母的 word 少于 80% 就去掉。这些规则简单、可解释，能清掉登录页、占位页、只剩图片说明的页面。
- **Quality classifier。** Positive example 取 Wikipedia 页面引用的外部链接指向的网页，negative example 取 random 的 Common Crawl 页面，训练一个 fastText classifier，输出的分数当质量分。LLaMA 和 RedPajama 是这么做的，GPT-3 用的是类似的思路（positive example 是 Wikipedia、WebText2、书）。

Threshold 没有唯一的最优值。Lecture 14 指出它和训练规模有关：训练得越久，越需要更多（质量稍低）的数据，threshold 应该放宽；训练得短，就只要最好的那部分。

### Exact line deduplication

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
Lecture 14 举的例子：C4 里有一段商品描述重复了 61,036 次。省 token 是一方面，更重要的是 model 会把重复很多次的文本逐字背下来，这既浪费 capacity，也带来版权和隐私问题；lecture 引的研究发现去重之后的数据训练出的 model 更好。另外 A4 允许用 Paloma 的 validation data 来设计 filter，但不允许把它放进训练数据，去重和评估集的隔离是同一类问题。
:::

:::from
WARC、WAT、WET 的说明、各个 filter 的要求、Gopher 的四条规则、quality classifier 的 positive 与 negative example、exact line dedup 的两遍做法和 hash 技巧、MinHash 与 LSH 的定义、$[1,2,3,2]$ 的例子、候选的验证与 cluster、normalization 的清单、Paloma 的规则，来自 [A4 handout](https://github.com/stanford-cs336/assignment4-data)。“target 与 raw”的统一框架、Dolma 的 0.5、GPT-3 与 LLaMA 的 classifier、threshold 随规模变化、5 个 element 的 MinHash 例子、$1-(1-s^r)^b$ 和 Lee 等人的设置、C4 的 61,036 次，来自 [lecture 14](http://cs336.stanford.edu/lectures/?trace=lecture_14) 的讲稿。LSH 的表、threshold、bigram 的例子是我算的。Lecture 13（数据来源）没有读。
:::

## [align] Post-training：SFT、RLHF 与 GRPO

:::skip
能从 log-derivative trick 推出 policy gradient，说明 baseline 为什么不改变 expectation，算出 GRPO 一个 group 的 advantage，说出 std normalization 和 length normalization 各引入了什么 bias，并读懂 PPO 式 clipping 的 mask，就读完这门课了。快速路线必读（Lecture 15、16），是 A5 的理论部分。SFT 只在 response 上算 loss、Bradley–Terry、RLHF 的最优 policy 和 DPO 的推导在 [CS4248 第 8 站](../courses/CS4248.html#post)。
:::

### 从 imitation 到 optimization

Pretrain 完的 model 什么都会一点，但不会按人要的方式做事。Lecture 15 把 post-training 分成两步：SFT 是 imitation，fit 一个参考 distribution $p^*(y\mid x)$，需要有人写好示范答案；RLHF 是 optimization，找一个 policy 让 reward 的 expectation 最大，只需要能给答案打分。为什么要第二步：人写出的答案不一定是人最偏好的答案（lecture 用新闻摘要的研究说明这个 generation 与 verification 的差距），判断比生成容易。

RLHF 的 reward 来自一个 fit 人类偏好的 reward model，optimize 得太狠会钻 reward model 的空子（overoptimization），lecture 15 展示了 reward 先升后降的曲线。Lecture 16 的出路是去 reward 能被可靠地验证的领域：数学题有标准答案，代码有 test。这叫 RLVR（RL from verifiable rewards），DeepSeek R1 用它把 reasoning 推到了 o1 的水平。

A5 就是这个设定：OLMo-2-0425-1B 做 GSM8K，prompt 是 R1-Zero 的格式（`<think>` 里写 reasoning，`<answer>` 里给答案），reward 是答案对为 1、错为 0。

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

### DPO 在哪里

DPO 不需要 rollout，也不需要 reward model，直接在 preference pair 上做一个 classification 式的 loss（推导见 CS4248 第 8 站）。Lecture 16 指出它不适合 RLVR 的原因：数学题的反馈天然不是成对比较，而且 DPO 是 offline 的。A5 的可选 supplement 做的是另一条线：Llama 3.1 8B 先在 UltraChat 上 SFT，再在 Anthropic HH 上做 DPO，$\beta=0.1$，learning rate $10^{-6}$，effective batch 64，两块 GPU 分别放 reference 和正在训练的 model，optimizer 用 RMSprop 而不是 AdamW。原因是 memory：8B 的 model 用 bf16 一份 16 GB，AdamW 按 16 byte 每 parameter 要 128 GB，RMSprop 只有一个 state。

:::from
SFT 与 RLHF 的对比、G-V gap、overoptimization、DPO 的推导步骤来自 [lecture 15](https://github.com/stanford-cs336/lectures/blob/main/lecture_15.pdf)；PPO 到 GRPO、去掉 value model、std 和长度 normalization 的问题、Dr. GRPO、R1 的案例来自 [lecture 16](https://github.com/stanford-cs336/lectures/blob/main/lecture_16.pdf)（两讲都只读到文字）。Policy gradient 和 baseline 的推导、group mean 的 $\tfrac{G-1}{G}$、`torch.std` 的要求、hyperparameter、gradient accumulation 的缩放、“loss 不是传统的 loss”、Dr. GRPO、RFT、MaxRL 的定义、importance ratio 与 clipping 的 formula 和 mask、GSPO、CISPO，来自 [A5 handout](https://github.com/stanford-cs336/assignment5-alignment) 第 3 至 6 节；DPO 的 hyperparameter和 RMSprop 来自 A5 的 supplement。三选一的 variance 例子、group 的 advantage、std 与长度 weight 的数值、$1.01^{500}$、clipping 的表是我算的。A5 里 baseline variance 和 difficulty reweighting 的计算题这里没有做。
:::

## 作业

五个作业的仓库都公开了 handout、starter code 和 pytest。Handout 规定 Stanford 学生不得用 AI 工具写实现（包括 coding agent 和 autocomplete）；自学时同样建议自己写，价值就在亲手写一遍。

### Assignment 1：Basics（先做）

**要从零写什么。** Byte-level BPE 的 training、encode、decode（第 1 站）；Linear、Embedding、RMSNorm、SwiGLU、RoPE、softmax、scaled dot-product attention、causal multi-head attention、pre-norm block 和整个 Transformer LM（第 2 站）；cross-entropy、AdamW、cosine schedule、gradient clipping、`np.memmap` 的 data loader、checkpoint、带 temperature 和 top-p 的 decoding（第 4 站）。不能用 `torch.nn`、`torch.nn.functional`、`torch.optim` 里的现成实现，只能用 `nn.Parameter`、container 类和 `Optimizer` 基类。然后在 TinyStories 上训练，做 learning rate、batch size 和四组 ablation（去掉 RMSNorm、post-norm、NoPE、SiLU 对 SwiGLU），再换到 OpenWebText。

**做完会什么。** 一个 LM 从文本到 sample 的每一行代码；第 3 站的 accounting 能对着自己的实现核对。

**时间与算力。** 工作量估计 30 到 50 小时（调研时的估计）。BPE 只用 CPU：TinyStories 的限额是 30 分钟、30 GB RAM，OpenWebText 是 12 小时、100 GB RAM。完整的 TinyStories 训练在一块 B200 上 20 到 30 分钟；low-resource 配置（4096 万个 token，validation loss 目标从 1.45 放宽到 2.00）在 M4 Max 上 MPS 36 分钟、CPU 1 小时 22 分钟，loss 到 1.80。免费 Colab 的 T4 跑 low-resource 配置够用。

**做不了的部分和替代。** 课程的 sweep、ablation 和 leaderboard 按 B200 小时计（leaderboard 限一块 B200 上 45 分钟），校外没有对应的硬件，只能在 TinyStories 的 low-resource 配置上做缩小版的 sweep 和 ablation，handout 对没有 GPU 的学生也是这样建议的。OpenWebText 的 BPE 要的 memory 超过免费 Colab（约 12 GB），可以先在一个 1 到 2 GB 的子集上训练（调研时的经验）。

**提示。**

- 先在 TinyStories 的 validation set（2.2 万篇，而不是训练集的 212 万篇）上调通 BPE，再上全量；用 cProfile 或 py-spy 找瓶颈。（handout）
- Pre-tokenization 用 multiprocessing 并行，切点落在 `<|endoftext|>`；每块先按 special token 切开再跑 regex，用 `re.finditer` 而不是 `re.findall`。做到这些，BPE training 可以在 2 分钟以内。（handout）
- 先把 corpus 变成“pre-token 的 bytes tuple → 次数”的表，只在这张表上 merge；再维护 pair 到包含它的 pre-token 的反向索引，每次 merge 只改这些。（经验）
- 并列时取 lexicographically greater 的 pair，tests 会逐条比对 merge 顺序。仓库里的 speed test 要求在一个小 corpus 上 vocabulary 500 的 training 1.5 秒内完成。（handout、tests）
- Tokenizer 的 tests 拿 GPT-2 的 vocabulary 和 merges 与 tiktoken 逐个比对；同时注册 `<|endoftext|>` 和 `<|endoftext|><|endoftext|>` 时要优先匹配长的；`encode_iterable` 在 1 MB 的 memory 上限下测试。（tests）
- Encode 的结果存成 `uint16`，训练时用 `np.memmap` 打开，先检查读出来的值没有超过 vocabulary 大小。（handout）
- Softmax 和 cross-entropy 先减 max，cross-entropy 让 log 和 exp 相消；RMSNorm 在 square 前 upcast 到 float32。（handout）
- 先在一个 minibatch 上 overfit 到 loss 接近 0；记录 activation、weight、gradient 的 norm。完整配置远超 20 到 30 分钟时，先查 data loading、checkpoint、validation 有没有拖慢训练。（handout）
- 缩短训练步数时，cosine schedule 要恰好在最后一步降到 $\alpha_{\min}$。在 Mac 的 MPS 上不要用 `set_float32_matmul_precision` 打开 TF32，handout 发现会碰到静默出错的 kernel；CPU 上可以 `torch.compile(model)`，MPS 上用 `backend="aot_eager"`。（handout）

### Assignment 2：Systems（值得做）

**要从零写什么。** Benchmark 和 nsys profiling 的脚本，mixed precision 与 memory profiling，activation checkpointing（第 3 站）；先写纯 PyTorch 的 tiled FlashAttention-2，再写 Triton 版的 forward（含 causal mask），backward 用 PyTorch 加 `torch.compile`（第 5 站）；naive DDP、flat gradient、与 backward 重叠的 DDP、optimizer state sharding、FSDP，以及 DP、FSDP、TP、2D parallelism 的手算题（第 6 站）。Leaderboard 比的是 8B model 在两块 B200 上一个 training step 的时间。

**做完会什么。** 读懂 profiler 的输出，知道时间和 memory 花在哪；写出一个真的比 PyTorch 快的 attention kernel；明白多卡训练的每一次通信。

**时间与算力。** Handout 没给总时间，估计 30 小时以上（调研时的估计）。前半（profiling、mixed precision、FlashAttention）需要一块 NVIDIA GPU，Triton 不支持 Mac；distributed 的部分需要 2 块 GPU，通信 benchmark 最多用到 6 块。

**做不了的部分和替代。** 多卡的 benchmark、profiling 和 leaderboard 在校外基本做不了。DDP、sharded optimizer、FSDP 的逻辑可以在 CPU 上用 gloo backend 多 process 开发和调试，handout 也是这样建议本地开发的。免费 Colab 的 T4 可以调 Triton kernel 的正确性，但 xl、2.7B、10B 的配置会 OOM，benchmark 的数字也无法和 handout 的 B200 比较（调研时的经验）。手算题（第 8 节）只需要纸笔，第 6 站推过 DP 那一问，FSDP、TP、2D 照同样的办法自己推。

**提示。**

- CUDA 调用是 asynchronous 的：计时前先 warm-up，每步之后 `torch.cuda.synchronize()`；handout 让你比较 0、1、2 次 warm-up，看清不 warm-up 的数字为什么不可信。用 NVTX range 把 warm-up 从 nsys 的结果里排除。（handout）
- Triton 调试：`tl.device_print` 打印；`TRITON_INTERPRET=1` 可以在 CPU 上解释执行，但 handout 说它有 bug；block pointer 的 offset 要乘上 tile size；matmul 用 `tl.dot`；推进 pointer 用 `.advance(...)`。（handout）
- 先写 tiled 的纯 PyTorch 版 FlashAttention-2，再写 Triton 版，逐步对比两者的中间结果。Grid 设成 `(T_q, batch_size)`，kernel 里只有一个遍历 key tile 的 loop，tile 至少 16 × 16。（handout）
- On-chip 的 $O$、$l$、$m$ 用 float32；累加用 `tl.dot(..., acc=acc)`；$\tilde P$ 乘 $V$ 之前转成 $V$ 的 dtype；causal mask 给被遮住的 score 加 $-10^6$。（handout）
- 每个 rank 要绑定不同的 GPU（`torch.cuda.set_device(rank)`）；GPU 上用 NCCL，gloo 只用于没有 GPU 的本地开发；distributed benchmark 前跑约 5 次 warm-up，各 rank 的计时用 `all_gather_object` 汇总。（handout）
- FSDP 只包 Embedding 和 Linear，norm 不切；在当前层 forward 时提前 all-gather 后面的层；在 mixed precision 下先转成 compute dtype 再通信，省一半 bandwidth，master weights 保持 fp32。（handout）

### Assignment 3：Scaling（有余力再做）

**要做什么。** 第一题用 `data/isoflops_curves.json` 复现 IsoFLOP 方法，fit 最优 $N$ 和 $D$ 随 compute 的 power law 并 extrapolate（第 7 站做的就是这件事）。第二题在 12 个 B200 小时的预算内通过 training API 提交小规模训练，fit 自己的 scaling law，预测 48 个 B200 小时下的最优配置和它的 validation loss，部分分数看提交的配置实际训练出来的表现。

**做完会什么。** 用有限的预算设计实验、fit、extrapolate，并对 extrapolation 的 error 心里有数。

**时间与算力。** 第一题估计 3 到 4 小时（调研时的估计），CPU 即可。

**做不了的部分和替代。** Training API 只能在 Stanford 网络内用学号访问，校外只能做第一题。README 给了非学生自己搭 API 的方法，需要 Modal、Postgres 和 GPU，成本不低。一个可行的替代是用自己 A1 的代码在 TinyStories 上做一个缩小版的 IsoFLOP 实验：取几个 $10^{14}$ 到 $10^{16}$ FLOP 的 budget，每个 budget 训练五六个不同大小的 model，按第 3 站的方法算出每个 run 的 FLOPs，按第 7 站的方法 fit。按第 3 站估的效率，一个 $10^{16}$ 的 run 在 T4 上大约要几十分钟到几小时（这是我的建议和粗估，没有实际跑过）。

**提示。**

- 每个 compute budget 直接取 loss 最低的那次 run，不必像原论文那样 fit 一个 quadratic function；但要意识到 grid 带来的 error（第 7 站讲过）。（handout）
- API 的预算一旦超过 12 B200 小时就会拒绝请求，排队和运行中的实验按 `max_runtime_seconds` 预扣，所以先规划好实验再提交。同样的思路可以用在自己实验室的 GPU 预算上。（handout、README）
- 估计 non-embedding parameter 时用 $12\,n_{\text{layer}}\,d_{\text{model}}^2$。（handout）

### Assignment 4：Data（有余力再做）

**要从零写什么。** 从 WARC 抽文本、language identification、PII masking、harmful content 过滤、Gopher 规则、quality classifier、exact line dedup、MinHash + LSH 的 fuzzy dedup（第 9 站）；最后把这些 filter 组合起来处理一批英语 WET，用过滤后的数据训练一个 GPT-2 small 形状的 model，目标是 Paloma 的 C4 100 domains 上 perplexity 最低。

**做完会什么。** 知道一份 web 数据要经过哪些处理、每一步丢掉了什么，以及“数据好不好”最后要靠训练出的 model 来回答。

**时间与算力。** Handout 没给。前面的过滤和去重用 CPU、跑单元测试即可完成；handout 给了下载样例 WARC 和 WET 的 `wget` 命令，fastText 的 `lid.176.bin` 是公开的。最后的训练用 8 块 B200 跑约 2 小时（16,384 步，约 86 亿个 token）。

**做不了的部分和替代。** `filter_data` 用的 2,500 个英语 WET 文件、quality classifier 用的 Wikipedia 外链列表、Paloma 的 tokenized 文件都放在 Stanford 集群的 `/shared-data` 上，最后的训练更不可能在校外复现。替代：下载几个 WET 文件跑完整的 pipeline，统计每道 filter 去掉的比例，random 抽样看保留和被删的文档（这正是 `inspect_filtered_data` 一题要求的），并按处理速度估算处理整个 Common Crawl dump 要多久（`filter_data` 第 2 问）。

**提示。**

- 用 FastWARC iterate WARC/WET 的记录，用 tldextract 处理 URL；文件多时用 `concurrent.futures` 或 `multiprocessing` 按文件并行。（handout）
- MinHash + LSH 里 $k$ 个 hash 分成 $b$ 个 band、每个 band $r$ 个；算 signature 之前先 normalize 文本。用第 9 站的 $1-(1-s^r)^b$ 先算好 threshold再选 $b$、$r$。（handout）
- 可以用 Paloma 的 validation data 来设计 filter 或训练 classifier，但不能把它放进训练数据。（handout）

### Assignment 5：Alignment 与 reasoning RL（先做）

**要从零写什么。** 测 OLMo-2-0425-1B 在 GSM8K 上 zero-shot 和 few-shot 的表现；从零实现 on-policy GRPO：reward 计算、group normalization、per-token 的 policy gradient loss、按长度或按 constant 的聚合、gradient accumulation、与 vLLM 的 weight 同步；再实现 Dr. GRPO、RFT、MaxRL 和 off-policy 的 importance reweighting 与 clipping（GRPO 式、GSPO），比较它们（第 10 站）。可选的 supplement 用 Llama 3.1 8B 做 SFT 和 DPO。

**做完会什么。** 一个能跑起来的 LLM RL 的 training loop；知道每个设计选择改变了什么，以及怎样在 variance 很大的 RL 实验里得出可信的结论（handout 要求每个设置跑 4 个 seed 并画出 variance）。

**时间与算力。** Handout 只给了实验预算：主 GRPO 实验 2 B200 小时，learning rate sweep 和 prompt ablation 各 4 小时，两组变体比较各 8 小时。总工作量估计 30 小时以上（调研时的估计）。需要 2 块 GPU：一块跑 Hugging Face 的 model 和 optimizer，一块跑 vLLM。

**做不了的部分和替代。** 免费 Colab 不行：1B 的 model 全 parameter 训练，按第 3 站的 16 byte 每 parameter，光 weight、gradient、Adam state 就约 16 GB，超过 T4 的 memory（调研时的估算），还要另一块卡跑 vLLM。可行的路：租两块 GPU 跑缩小版（少一些 step 和 seed）；或者照 handout 说的，拿自己在 A1 训练的 model 在一个更简单的任务上做 RL，training loop 的结构完全一样。几道推导题（baseline 的 variance、difficulty reweighting、surrogate objective）只需要纸笔，第 10 站给了需要的工具。

**提示。**

- 安装：README 要求先 `uv sync --no-install-package flash-attn`，再 `uv sync`。（README）
- GSM8K 的 ground truth 格式是“rationale `####` answer”，reward function 只接受答案部分，要按 `####` 切开并 strip。（handout）
- vLLM 的 stop string `</answer>` 只对 r1_zero 系列的 prompt 用；question_only 的 prompt 让答案写在 `\boxed{}` 里，用对应的 reward function。（handout）
- Baseline 一题要把生成分成三类（格式和答案都对、格式对答案错、格式错），并至少看 10 个格式对答案错的例子，判断是 model 错还是 parser 错。这一步能提前发现 reward 写错。（handout）
- GRPO 开始时 reward 接近 0 是正常的，取决于 seed 可能要几步才采到非零 reward；先跑约 50 步确认 validation reward 在上升，再跑完整的实验。（handout）
- Gradient accumulation 时每个 microbatch 的 loss 要乘上它在整个 batch 里的占比；换成 constant normalization 之后这里还要改。Optimizer step 之前 clip gradient norm。（handout）
- 比较变体时，advantage 为 0 的回答（全对或全错的 group；RFT 里所有答错的）不必送进 model，gradient accumulation 的步数可以按比例减少，但要确认裁掉之后算出的 gradient 和不裁时相同。（handout）
- 至少记录 loss、gradient norm、token entropy、train 和 validation 的 reward（total 与 format 分开）、validation 的平均回答长度，定期读 rollout 原文，handout 建议再加 pass@k。目标是 4 个 seed 平均 validation accuracy 至少 25%。（handout）
