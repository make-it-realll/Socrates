---
code: NYU-REASONERS
evidence: syllabus
evidenceNote: "NYU CSCI-GA.3033-131 / DS-GA.3001-009 Building LLM Reasoners，Spring 2026 一期（Greg Durrett）。讲法跟着课程自己的材料：课程主页的 schedule 与评分，Lecture 7（RLVR）、9（Agents）、10（Xi Ye 的 guest lecture）、11（Evaluation）的 slides（WebFetch 只抽出了文字，slides 上的图和图里的公式没有看到），A2、A3 的 handout PDF，以及 A3 的 starter repo（README、tests、drgrpo_grader.py、prompts）。课程本身对 test-time compute、search 和 verifier 讲得很少（Lecture 7 只有一张 PRM 与 MCTS 的图），这几站的讲法跟的是 CMU 11-711 Fall 2025 的 inference 一讲（Welleck）、JHU CS 601.471 Spring 2025 的 inference scaling 两讲和 Charlie Snell 在 Georgia Tech CS 7643 的 guest lecture。Lecture 1 到 6、8、12、A1 handout、final project handout 和 midterm 考点没有读；没有看录像。"
exam: "无期末考试。按课程主页：3 个作业 25%，3 到 4 次 in-class quiz 25%，in-class midterm 25%（可带一页 letter 纸的 notes，禁用电子设备），final project 25%（1 到 3 人，自选题目）。Quiz 和 midterm 的题目没有公开。"
subskills:
  - id: cot
    name: Chain-of-thought 与 test-time compute
    l3: "有提示能做：算出一个 model 每个 token 的 forward FLOPs，并数出 Countdown 在 n 个数时的候选 expression个数。"
    l4: "能独立做：把 CoT 写成 latent variable，构造一个“最可能的 reasoning chain”和“最可能的答案”不一致的例子，并比较 parallel 与 sequential 两种做法的 FLOPs 和 latency。"
    l5: "能讲给别人：为什么写出来的中间 token 给了 model 额外的串行计算，更大的 model 为什么替代不了它。"
  - id: passk
    name: Sampling、pass@k 与 majority vote
    l3: "有提示能做：由每题做对的 probability 算出 pass@k，并用 Codex 的 estimator 从 n 个 sample 估计它。"
    l4: "能独立做：证明这个 estimator unbiased、说出 plug-in estimate 偏低的原因，并精确算出 majority vote 在给定 answer distribution 下随 k 的变化。"
    l5: "能讲给别人：pass@k 和 maj@k 各回答什么问题、各自的极限是什么，两者之间的差距为什么只有 verifier 能填。"
  - id: verify
    name: Verifier、best-of-N 与 process reward model
    l3: "有提示能做：写出 best-of-N 和 weighted voting 的 aggregation，并对 Countdown 的一个部分解算出 Monte Carlo 的 soft label 和 hard label。"
    l4: "能独立做：用一个 score distribution 的 toy model 算出 best-of-N 的 accuracy 随 N 先升后降，并说明 ORM 和 PRM 的 label 各从哪里来。"
    l5: "能讲给别人：rollout 训出的 PRM 量的是 value function 而不是步骤的对错，以及 over-optimization 为什么发生在被选中的 sample 上。"
  - id: search
    name: Tree search 与 compute-optimal 的 test-time scaling
    l3: "有提示能做：在 Countdown 的 tree 上手做一遍 PRM 引导的 beam search。"
    l4: "能独立做：按生成的 step 数把 beam search、best-of-N、穷举放在同一个 budget 下比较，并把 PRM 的成本算进去。"
    l5: "能讲给别人：Snell 等人的结果里 beam search、best-of-N、revision 各在什么难度和 budget 下更好，以及 reasoning model 为什么把 search 写进了一条长 trace。"
  - id: rlvr
    name: RLVR：从 expert iteration 到 GRPO 的配方
    l3: "有提示能做：对一个 group 算出 A3 三种 loss_type 的 advantage，并复现 handout 里 masked_mean 与 masked_normalize 的例子。"
    l4: "能独立做：推出 expert iteration 就是不减 baseline 的 policy gradient，并用数字说明 DAPO 为什么要放宽 clip 的上界。"
    l5: "能讲给别人：length normalization 对长短回复的 weight 有什么影响，被截断的回复怎样扭曲 reward，以及 base model 的哪些行为决定了 RL 能不能起作用。"
  - id: distill
    name: Distillation 与 long CoT 的 SFT
    l3: "有提示能做：手写一个例子的 input_ids、labels 和 response_mask。"
    l4: "能独立做：推出 SFT on teacher traces 等价于 minimize 哪个 KL，用 logsumexp 写出数值稳定的 entropy，并说出 budget forcing 怎样延长或截断 reasoning。"
    l5: "能讲给别人：RL 和 distillation 的训练信号各从哪里来，小 model 上 distillation 为什么更划算，以及 SFT 传下去的到底是什么。"
  - id: eval
    name: Evaluation 的陷阱：noise、contamination 与 parsing
    l3: "有提示能做：算出一个 benchmark 分数的 standard error 和 95% 区间。"
    l4: "能独立做：写 paired bootstrap 判断两个系统的差别，把 variance 分解成“抽到哪些题”和“每题的 sampling”两部分，并把 A3 的失败分成 model 错和 parser 错。"
    l5: "能讲给别人：区间重叠为什么不等于不显著，multiple testing 与 contamination 怎样抬高分数，以及 Oren 等人的检测方法能证明什么、不能证明什么。"
open:
  - label: "NYU Building LLM Reasoners, Spring 2026 课程主页（schedule、slides 链接、作业、评分）"
    url: "https://gregdurrett.github.io/courses/sp2026/index.html"
    note: "各站对应哪一讲以这里为准。"
  - label: "Lecture 7: RLVR（Durrett）slides"
    url: "https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec7.pdf"
    note: "第 5 站的主要来源，第 3、6 站的一部分。只读到 slides 上的文字，公式和图没有看到。"
  - label: "Lecture 11: LLM Evaluation（Durrett）slides"
    url: "https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec11.pdf"
    note: "第 7 站的主要来源。只读到文字。"
  - label: "Lecture 9: Agents；Lecture 10: Reasoning Over Long Context（Xi Ye）slides"
    url: "https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec9.pdf"
    note: "Lecture 9 用于第 1 站（CoT 的局限、PAL）。Lecture 10 讲的是 long context 的训练与 scaffolding，不是 long CoT，这一页没有用。"
  - label: "Assignment 3: Alignment and Reasoning RL handout，以及 gregdurrett/nyu-llm-reasoners-a3 仓库"
    url: "https://gregdurrett.github.io/courses/sp2026/a3.pdf"
    note: "第 5、6、7 站和作业一节。仓库读了 README、tests、prompts 和 drgrpo_grader.py。"
  - label: "Assignment 2: Systems and Parallelism handout"
    url: "https://gregdurrett.github.io/courses/sp2026/a2.pdf"
    note: "作业一节。"
  - label: "CMU 11-711 Advanced NLP, Fall 2025, Lecture 22: Advanced Inference Strategies（Sean Welleck）"
    url: "https://cmu-l3.github.io/anlp-fall2025/static_files/anlp-f2025-22-inference.pdf"
    note: "第 1、2、3 站的讲法来源：parallel 与 sequential、best-of-N、voting 与它的极限、weighted voting、over-optimization、budget forcing、L1。只读到文字。"
  - label: "JHU CS 601.471/671 Spring 2025, Lectures 15–16: Inference Scaling（Khashabi）"
    url: "https://self-supervised.cs.jhu.edu/sp2025/files/slides/15-16.inference-scaling.pdf"
    note: "第 3、4、5 站：ORM 与 PRM、rollout 得到的 PRM label、beam search、expert iteration 写成 EM、Stream of Search。"
  - label: "Charlie Snell: Scaling LLM Test-Time Compute（Georgia Tech CS 7643 guest lecture slides）"
    url: "https://faculty.cc.gatech.edu/~zk15/teaching/AY2025_cs7643_spring/assets/L25_Charlie_Snell_Scaling_TestTime_Compute.pdf"
    note: "第 3、4 站：PRM 的 Monte Carlo label、难度分箱、beam search 与 best-of-N 的比较、revision。"
  - label: "Denny Zhou: Teach Language Models to Reason（slides）"
    url: "https://dennyzhou.github.io/LLMs-Reason-Lecture.pdf"
    note: "第 1、2 站：self-consistency 是 marginalization 的经验实现，universal self-consistency。"
  - label: "摘要：s1（arXiv 2501.19393）、GSM1k（2405.00332）、Gandhi 等人 Cognitive Behaviors（2503.01307）、DAPO（2503.14476）"
    url: "https://arxiv.org/abs/2501.19393"
    note: "四篇都只读了 arXiv 摘要页，用于第 5、6、7 站。"
---

先看三个数。

**第一个。** A3 的 handout 用来说明 Countdown 的例子是：用 96、97、68 这三个数，每个最多用一次，配上加减乘除，凑出 125。答案是 $96+97-68$。一个 language model 如果要在写下答案的第一个 token 之前就把它想好，只有一次 forward pass 可用。只用加、减、乘的话，三个数一共能组出 27 个完整的 expression；六个数时是 656,100 个。

**第二个。** 让一个毫无本事的 policy（每一步在合法的 move 里均匀地随机选）去做这道题，一次做对的 probability 是 $1/9$。采 8 次，至少一次做对的 probability 是 61%；采 64 次是 99.95%。但这 64 个答案里哪个是对的，得有东西来判断。在第 3 站的一个 toy model 里，一个会被少数错答案骗过的 verifier 从 12 个 sample 里挑，accuracy 是 73%；从 1024 个里挑，只有 36%。

**第三个。** AIME 一年 30 道题，答案都是 000 到 999 之间的整数。一个真实水平 50% 的 model，单跑一遍的分数，95% 区间是 ±17.9 分。一个完全不读题、随机报数的程序采 1024 次，“至少碰上一次”的 probability 是 64%。

这门课要回答的是：怎样让 model 在需要多步 reasoning 的问题上做对。有三条路，课程依次讲到：在 test time 多花 compute（写出中间步骤、多采几次、用 verifier 挑、在步骤上 search）；把这种能力训练进 model（RL with verifiable rewards，或者从更强的 model distill）；以及诚实地量出到底做对了多少。三个数分别在第 1、3、7 站得到解释，第二个也牵出了第 2、4 站。

| 站 | 内容 | 对应的课程材料 | 对应作业 |
|---|---|---|---|
| 1 | Chain-of-thought 与 test-time compute | Lecture 7、9；CMU 11-711 | A3 §2、§5 |
| 2 | pass@k 与 majority vote | CMU 11-711 | A3 的 evaluation |
| 3、4 | Verifier、PRM、tree search | Lecture 7 的 PRM 一页；CMU、JHU、Snell | （无） |
| 5 | RLVR | Lecture 6、7 | A3 §6–8 |
| 6 | Distillation 与 SFT | Lecture 7；A3 §4 | A3 §4 |
| 7 | Evaluation | Lecture 11 | A3 §3 |

这一页假定读者已经懂 Transformer、policy gradient 和 GRPO 的基本形式。课程的 Lecture 1 到 5（Transformer、tokenizer、加速、scaling law）和 A1、A2 改编自 Stanford CS336，在 [CS336 的页面](../courses/STANFORD-CS336.html)里写过；policy gradient、baseline、GRPO 的 advantage、PPO 式 clipping 的推导在 [CS336 第 10 站](../courses/STANFORD-CS336.html#align)，GRPO 的几处 bias 和“RL 到底教会了 model 什么”的争议在 [Modern RL 第 6 站](../courses/MODERN-RL.html#finetune)，这里用到时只给链接。Lecture 8（safety）、Lecture 10（long context 的训练与 scaffolding）和 Lecture 12（multimodal）这一页不讲。

只有十几个小时时的路线：第 2、5、7 站必读，加上第 1 站的前两节；第 3、4、6 站可以先跳，每站开头写了跳过的代价。作业先做 A3 的 §7（GRPO 的实现，先过单元测试）。

## [cot] Chain-of-thought 与 test-time compute

:::skip
能说清一个 token 的 forward pass 能做多少串行的计算、写出来的中间 token 怎样把这个上限抬高，能把 CoT 写成 latent variable 并说出“最可能的 reasoning chain”和“最可能的答案”为什么不是一回事，能算出 parallel 与 sequential 两种做法各花多少 FLOPs，就可以去第 2 站。快速路线里前两节必读，第三节可以先跳。
:::

### 一个 token 只有固定的计算量

先看 model 写下一个 token 时做了什么。$N$ 个 parameter 的 Transformer，每个 token 的 forward 大约是 $2N$ 次 floating-point operation（推导在 [CS336 第 3 站](../courses/STANFORD-CS336.html#account)）。A3 用的 Qwen2.5-Math-1.5B 每个 token 约 $2\times1.5\times10^9=3\times10^9$ 次。这个数和题目难不难无关：回答“1+1”和回答 Countdown，写第一个 token 花的计算一样多。

更要紧的是串行的步数。一个 token 的计算从 embedding 出发，依次经过 $L$ 个 layer；每个 layer 可以读前面所有位置在下一层的结果，但在一次 forward 里信息只能往上走 $L$ 层。一个计算如果必须先得到 $u$ 才能算 $v$、得到 $v$ 才能算 $w$，链条长过 $L$，一次 forward 就装不下。

Countdown 直接写答案时，第一个答案 token 就得“知道”是 96+97−68。要知道它，model 得在内部把候选 expression 过一遍，或者凭某种捷径猜中。候选的数目随数字个数增长得很快。只用 $+$、$-$、$\times$（减法大数在前），每一步从剩下的数里挑两个、选一个 operation、换成结果，所以

$$C(n)=\binom n2\cdot3\cdot C(n-1),\qquad C(1)=1$$

$C(3)=3\cdot3\cdot\big(1\cdot3\cdot1\big)=27$，$C(4)=6\cdot3\cdot27=486$，$C(5)=10\cdot3\cdot486=14580$，$C(6)=15\cdot3\cdot14580=656100$。

::fig[nyu-reasoners-tree] 三个数时的全部 27 个 expression。上一层是 9 种第一步（合并哪两个数、用哪个 operation），每个下面是剩下两个数的 3 种合并结果。只有三个 leaf 等于 125。

写出中间步骤以后情况就变了。Model 写下“96+97=193”，这几个 token 进了 context；下一步它面对的是一个小得多的问题：用 193 和 68 凑 125，三选一。每一行只需要一次小的计算，下一行可以直接读上一行写下的结果。

::fig[nyu-reasoners-depth] 左边直接作答：答案 token 能用到的串行计算只有一列 $L$ 层。右边先写中间 token：每写出一个 token，它就作为下一个位置的 input 回到第一层，最长的串行路径变成 $L$ 乘以写出的 token 数。

这个直觉有一个 theory 的版本：Li、Liu、Zhou、Ma（ICLR 2024）证明，constant depth、constant precision 的 Transformer 不写中间 token 时只能解 $\mathsf{AC}^0$ 这一类很浅的 circuit 能算的问题；写 $T$ 步 chain-of-thought 以后，能解任何大小为 $T$ 的 boolean circuit 能算的问题（这个结论是凭记忆写的，没有读原文核对）。

> 写出来的中间 token 给了 model 额外的串行计算：每写一个 token，就多一次能读到上一步结果的完整 forward pass。

### 把 CoT 写成 latent variable

A3 的 Countdown prompt 让 model 先写“Step 1: …”，最后在 `<answer>` 和 `</answer>` 之间给答案。把 reasoning 的部分记作 $z$、答案记作 $a$，model 给出的是 joint distribution $p(z,a\mid x)=p(z\mid x)\,p(a\mid x,z)$。我们只关心答案对不对，也就是 marginal

$$p(a\mid x)=\sum_z p(z\mid x)\,p(a\mid x,z)$$

Greedy decoding（temperature 0）每一步取最可能的 token，得到一条（近似）最可能的 $z$ 和它后面的 $a$。最可能的 reasoning chain 给出的答案，不一定是 marginal 最大的那个。设一道题 model 有四条 reasoning chain：

| reasoning chain | $p(z\mid x)$ | 给出的答案 |
|---|---|---|
| $z_1$ | 0.4 | 126 |
| $z_2$ | 0.2 | 125 |
| $z_3$ | 0.2 | 125 |
| $z_4$ | 0.2 | 125 |

最可能的单条链是 $z_1$，答案 126。但 $p(125\mid x)=0.2+0.2+0.2=0.6$，$p(126\mid x)=0.4$：三条不同的路走到了同一个答案，单看每一条都不如 $z_1$ 可能。Denny Zhou 的说法是：self-consistency 是 marginalization 的经验实现。第 2 站接着算，要把 125 找出来需要采多少次。

### 两种花 test-time compute 的方式

:::skip
快速路线可以先跳。跳过会少掉 test-time compute 的成本账，第 4 站末尾和第 6 站的 budget forcing 会用到。
:::

CMU 11-711 的那一讲把多花 test-time compute 的办法分成两类：

- **Parallel**：独立地采 $N$ 条 $(z,a)$，再用一个 aggregation 合成一个答案。取出现最多的答案是 majority vote（第 2 站），用 verifier 打分挑最高的是 best-of-$N$（第 3 站）。
- **Sequential**：让一条 $z$ 变长，在里面检查、回头、换一种做法。o1、R1 这一类 reasoning model 走的是这条路；长度可以靠 RL 训练出来（第 5 站），也可以在 decoding 时强行控制（第 6 站的 budget forcing）。

两者都按生成的 token 付钱。按每 token $2N$ FLOPs：1.5B 的 model 写 10,000 个 token 是 $2\times1.5\times10^9\times10^4=3\times10^{13}$；32B 的 model 写 1,000 个 token 是 $2\times3.2\times10^{10}\times10^3=6.4\times10^{13}$。小 model 多想 10 倍，花的 compute 还不到大 model 想一遍的一半。CMU 讲义转述的 Wu 等人的 inference scaling law 正是把 compute 写成“model 大小乘以生成的 token 数”，再问固定 compute 下怎样分配；讲义的结论是，小 model 多生成可能比大 model 少生成更划算。

FLOPs 只是下界。Decode 是 memory-bound 的，每生成一个 token 要把 parameter 和整个 KV cache 读一遍（[CS336 第 8 站](../courses/STANFORD-CS336.html#infer)），一条 10,000 token 的 trace 越往后越慢；而且 sequential 的 token 只能一个接一个地生成，latency 随长度线性增长，JHU 的 slides 专门列出了这项代价。Parallel 的 $N$ 条可以放进同一个 batch 一起生成，latency 几乎不随 $N$ 增长。

:::wrong 一次 forward 做不到的事，换一个更大的 model 就能一步做到
更大的 model 主要是更宽、层数多一些，串行的层数仍是一个固定的 $L$。Countdown 的候选从 3 个数的 27 个涨到 6 个数的 656,100 个，是 exponential 的增长；要在固定的 $L$ 层里把它们并行地过一遍，宽度也得跟着 exponential 地涨。写中间步骤的做法每一步只面对一个小问题（6 个数时第一步最多 $\binom62\cdot3=45$ 个选择），配上第 4 站的 search，总代价随步数增长。Snell 在他的 guest lecture 里举的正是这个例子：Countdown 这样简单的题也可能需要 search，不是什么都能一次答出来。
:::

:::from
“每个 token 计算量固定”和 parallel / sequential 的两分法跟的是 [CMU 11-711 Lecture 22](https://cmu-l3.github.io/anlp-fall2025/static_files/anlp-f2025-22-inference.pdf)（Welleck，只读到文字），Wu 等人的 inference scaling law 也是从这一讲转述的，原论文没有读；latency 的代价来自 [JHU 的 inference scaling slides](https://self-supervised.cs.jhu.edu/sp2025/files/slides/15-16.inference-scaling.pdf)；“self-consistency 是 marginalization 的经验实现”来自 [Denny Zhou 的 slides](https://dennyzhou.github.io/LLMs-Reason-Lecture.pdf)；“Countdown 也需要 search”来自 [Snell 的 guest lecture](https://faculty.cc.gatech.edu/~zk15/teaching/AY2025_cs7643_spring/assets/L25_Charlie_Snell_Scaling_TestTime_Compute.pdf)；Countdown 的例子和 prompt 来自 [A3 handout](https://gregdurrett.github.io/courses/sp2026/a3.pdf) §5 与仓库里的 `countdown.prompt`。课程自己的 [Lecture 7](https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec7.pdf) 只有一张 long CoT 的结果图（没看到），[Lecture 9](https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec9.pdf) 讲了 CoT 的局限和 PAL。Li 等人的 theory 结论凭记忆。候选 expression 的个数、tree 的全部 node、FLOPs 的对比和四条 reasoning chain 的表是我算或设的。
:::

## [passk] Sampling、pass@k 与 majority vote

:::skip
能从“一次做对的 probability $p$”推出 pass@k，证明 Codex 的 estimator unbiased 并说出 plug-in estimate 偏向哪边，能精确算出 majority vote 在给定 answer distribution 下随 $k$ 的变化，就可以去第 3 站。快速路线必读：读 RLVR 的论文、看 A3 的 log 都要用到这些量。
:::

### pass@k：至少一次做对

对一道题，model 每次 sample 做对的 probability 记作 $p$（由 model、prompt 和 temperature 决定）。独立采 $k$ 次，全错的 probability 是 $(1-p)^k$，所以至少一次对的 probability 是

$$\text{pass@}k=1-(1-p)^k$$

开头那个随机 policy 在 Countdown 题上 $p=1/9$：pass@1 $=0.111$，pass@8 $=1-(8/9)^8=0.610$，pass@64 $=1-(8/9)^{64}=0.9995$。

pass@k 回答的问题是：如果有一个完美的 verifier 能从 $k$ 个答案里认出对的那个，能做对多少。代码有 unit test，Countdown 可以把 expression 直接算一遍，这时 pass@k 就是真的拿得到的 accuracy。数学题在 test time 没有标准答案，pass@k 只是一个上限。

一个 benchmark 的 pass@k 是各题 pass@k 的平均。各题的 $p$ 差别很大，平均值随 $k$ 怎样变，主要由难题决定。

::fig[nyu-reasoners-passk] 10 道题，每道一个 $p$（第 6 道是 Countdown 上的随机 policy，$p=1/9$）。$k$ 每翻一倍，各题的 pass@k 往右涨；右边是 10 道题的平均。$p$ 大的题很快到顶，曲线后段的上升全靠 $p$ 小的题；$p=0$ 的那一道永远是 0。

这 10 道题平均的 pass@1 是 0.319，pass@8 是 0.602，pass@256 是 0.872。从 pass@1 到 pass@8 涨了 0.28，从 pass@8 到 pass@256 只涨了 0.27，后面这一段 $k$ 翻了五倍。

### 从 $n$ 个 sample 估计 pass@k

实际不知道 $p$，只能每题采 $n$ 个 sample，数出其中 $c$ 个对。最直接的做法是把 $\hat p=c/n$ 代进去，得 $1-(1-c/n)^k$。这个 estimate 系统性地偏低。

原因是 $g(\hat p)=(1-\hat p)^k$ 是 $\hat p$ 的 convex function，Jensen inequality 给出 $\mathbb E[g(\hat p)]\ge g(\mathbb E\hat p)=(1-p)^k$，所以

$$\mathbb E\big[1-(1-\hat p)^k\big]\le1-(1-p)^k$$

算一个：$p=0.1$、$n=10$、$k=5$。真值是 $1-0.9^5=0.4095$；$c$ 服从 $\mathrm{Binomial}(10,0.1)$，plug-in estimate 的 expectation 是 0.3485，低了 6 个百分点。

Codex 论文（Chen 等人，2021）的 estimator 是

$$\widehat{\text{pass@}k}=1-\frac{\binom{n-c}{k}}{\binom nk}$$

分式的意思是：从这 $n$ 个 sample 里不放回地随机取 $k$ 个，全部落在 $n-c$ 个错的里面的 probability。它为什么 unbiased：$n$ 个 sample 是 iid 的，从中随机取出的 $k$ 个本身就是 $k$ 个 iid 的 sample，它们全错的 probability 是 $(1-p)^k$。把“先采 $n$ 个、再从中随机取 $k$ 个”这件事的 probability 分两步写：

$$\mathbb E_{n\text{ 个 sample}}\!\left[\frac{\binom{n-c}k}{\binom nk}\right]=\Pr\big(\text{随机取出的 }k\text{ 个全错}\big)=(1-p)^k$$

左边是先对固定的 $n$ 个 sample 算“取出的 $k$ 个全错”的 conditional probability，再对 $n$ 个 sample 取 expectation，合起来就是这件事的总 probability。拿上面的例子逐个 $c$ 核对：

| $c$ | $\Pr(c)$ | Codex estimator | plug-in |
|---|---|---|---|
| 0 | 0.3487 | 0 | 0 |
| 1 | 0.3874 | $1-\binom95\big/\binom{10}5=1-\tfrac{126}{252}=0.5$ | $1-0.9^5=0.4095$ |
| 2 | 0.1937 | $1-\tfrac{56}{252}=0.7778$ | $1-0.8^5=0.6723$ |
| 3 | 0.0574 | $1-\tfrac{21}{252}=0.9167$ | $1-0.7^5=0.8319$ |

$c\ge4$ 的 probability 加起来只有 0.013。按 $\Pr(c)$ 加权，Codex 那一列的 expectation 恰好是 0.4095。

$n=200$ 时 $\binom nk$ 会 overflow。把分式展开：

$$\frac{\binom{n-c}k}{\binom nk}=\frac{(n-c)!\,(n-k)!}{n!\,(n-c-k)!}=\prod_{i=n-c+1}^{n}\frac{i-k}{i}=\prod_{i=n-c+1}^{n}\Big(1-\frac ki\Big)$$

中间一步是把 $\frac{(n-k)!}{(n-c-k)!}$ 和 $\frac{n!}{(n-c)!}$ 各写成 $c$ 个连续整数的乘积。代码只用乘法：

```python
import numpy as np

def pass_at_k(n, c, k):
    """n 个 sample 里 c 个对，返回 pass@k 的 unbiased estimate。"""
    if n - c < k:            # 任取 k 个必然含对的
        return 1.0
    return 1.0 - np.prod(1.0 - k / np.arange(n - c + 1, n + 1))
```

$n=10$、$c=1$、$k=5$ 时乘积只有一项 $1-5/10$，返回 0.5，和表里一致。

:::wrong pass@k 高，说明 model 会做这些题
AIME 的答案是 000 到 999 的整数。一个完全不读题、均匀地随机报数的“model”，每次 $p=1/1000$，pass@1024 $=1-0.999^{1024}=0.641$。$k$ 大到和答案空间可比时，pass@k 量的是“能不能碰上”，不是“会不会”。所以 pass@k 要和 pass@1 一起看，而且只在 test time 真有 verifier 可用时才把它当作能拿到的分数。[Modern RL 第 6 站](../courses/MODERN-RL.html#finetune)讲的 RL 前后 pass@k 曲线交叉，读的时候也要先过这一关。
:::

### Majority vote：把 reasoning chain marginalize 掉

没有 verifier 时，第 1 站的 marginal $p(a\mid x)$ 给了另一条路：采 $k$ 次，取出现次数最多的答案。这就是 self-consistency（Wang 等人，2022）；DeepSeek 的报告里叫 cons@k，CMU 讲义里也叫 voting@k：

$$\hat a=\arg\max_a\sum_{i=1}^k\mathbb 1\big[a^{(i)}=a\big]$$

$k\to\infty$ 时各答案的频率收敛到 $p(a\mid x)$，majority vote 选出的是 marginal 最大的答案。所以它的极限只取决于一件事：对的答案是不是 $p(a\mid x)$ 的 mode。CMU 讲义引的 Wu 等人的 theorem 正是这样说的：$N\to\infty$ 时 accuracy 收敛到“mode 恰好是正确答案的题”所占的比例；再多采也不会更高，要更高只能换更好的 model，或者给 vote 加上更好的 weight。

拿两道题对比：

- 第 1 站那道题：125（对）的 probability 是 0.6，126 是 0.4。
- 另一道题：对的答案 0.3，一个常见的错答案 0.5，其他答案合计 0.2。

$k$ 取奇数；第二道题有三种答案，可能平票，平票时在并列的答案里随机选。对每个 $k$ 枚举所有的 count 组合，按 multinomial probability 加权，精确算出：

| $k$ | 1 | 5 | 17 | 65 |
|---|---|---|---|---|
| 第一道 maj@k | 0.600 | 0.683 | 0.801 | 0.949 |
| 第一道 pass@k | 0.600 | 0.990 | 1.000 | 1.000 |
| 第二道 maj@k | 0.300 | 0.258 | 0.164 | 0.034 |
| 第二道 pass@k | 0.300 | 0.832 | 0.998 | 1.000 |

第一道题只有两种答案，maj@k 就是“$k$ 次里对的超过一半”：$k=5$ 时是 $\sum_{j=3}^5\binom5j0.6^j0.4^{5-j}=0.3456+0.2592+0.0778=0.683$。

::fig[nyu-reasoners-maj] 上面是两道题的 answer distribution，下面是 pass@k（虚线）和 maj@k（实线）。第一道题对的答案是 mode，maj@k 涨向 1；第二道题错答案是 mode，maj@k 跌向 0，pass@k 照样涨到 1。

第二道题上，pass@k 和 maj@k 之间的那一大块，只有能认出对的答案才拿得到。第 3 站讲怎样去拿。

Majority vote 需要判断两个答案“相同”：数学题比较最终数值（$1/2$ 和 $0.5$ 算同一个，正是 A3 的 grader 做的事），代码比较执行结果。摘要、证明这类自由文本没有现成的 equivalence。Denny Zhou 的 slides 和 CMU 讲义都提到 universal self-consistency：把几个回答一起交给 LLM，让它挑出和其他回答最一致的那个。

:::edge Temperature
pass@k 和 maj@k 都依赖 sampling 的 temperature。Temperature 为 0 时 $k$ 个 sample 完全一样，pass@k 等于 pass@1，maj@k 也等于 pass@1。Codex 论文报告 pass@1 的最佳 temperature 低（0.2），pass@100 的最佳 temperature 高（0.8）：$k$ 大时，sample 之间的差异比单个 sample 的质量更值钱（这两个数凭记忆，没有核对原文）。所以报告 pass@k 时要连同 temperature、top-p 和 $n$ 一起报。
:::

:::from
Majority vote 的 aggregation、“voting 把 reasoning chain marginalize 掉”和 $N\to\infty$ 的极限（Wu 等人的 theorem）、cons@16 的叫法、weighted voting 和 universal self-consistency 来自 [CMU 11-711 Lecture 22](https://cmu-l3.github.io/anlp-fall2025/static_files/anlp-f2025-22-inference.pdf)；“self-consistency 不该只当作 majority vote 来理解”的说法来自 [Denny Zhou 的 slides](https://dennyzhou.github.io/LLMs-Reason-Lecture.pdf)。pass@k 的 definition 和 Codex 的 estimator 凭记忆（Codex 论文没有读）；unbiased 的证明（“随机取出的 $k$ 个就是 $k$ 个 iid sample”）、Jensen 的论证、乘积形式的推导、两张表和图里的全部数值是我做和算的。AIME 随机报数的例子是我构造的。
:::

## [verify] Verifier、best-of-N 与 process reward model

:::skip
能写出 best-of-$N$ 和 weighted voting 的 aggregation，用一个 toy model 算出 verifier 不完美时 best-of-$N$ 的 accuracy 为什么先升后降，能说出 ORM 和 PRM 的区别，并给 Countdown 的一个部分解算出 Monte Carlo 的 soft label 和 hard label，就可以去第 4 站。快速路线可以跳过；跳过的代价是第 4 站的 beam search 读不懂，第 5 站讲 RLHF 被钻空子时少了一个具体的模型。
:::

### Best-of-N：用一个打分函数代替 oracle

Best-of-$N$：采 $N$ 个，用打分函数 $v$ 挑最高的，

$$\hat y=\arg\max_{i}\,v\big(y^{(i)}\big)$$

CMU 讲义说 $v$ 可以叫 reward model、evaluator、value model 或 verifier。有的任务有完美的 verifier：代码跑 unit test，定理交给 Lean 检查，Countdown 把 expression 算一遍。这时 best-of-$N$ 的 accuracy 就是 pass@N。数学题的标准答案在 test time 不知道，只能用一个学出来的 $v$ 去近似“这个解对”的 probability。Cobbe 等人（2021）在 GSM8K 上训练了这样一个 verifier：拿 model 自己生成的解，按最终答案对不对打 label，训练一个 classifier。

Weighted voting 把 voting 和打分结合起来，每个答案的票数按 $v$ 加权：

$$\hat a=\arg\max_a\sum_{i=1}^N v\big(y^{(i)}\big)\,\mathbb 1\big[a^{(i)}=a\big]$$

CMU 讲义引的结果是，它可以同时胜过 unweighted voting 和 best-of-$N$，verifier 越好越明显。

### Verifier 会被钻空子

学出来的 $v$ 在大多数 sample 上打分合理，但总有一小部分错的 sample 恰好拿到高分。$N$ 越大，被挑出来的那个越可能落在这一小部分里：best-of-$N$ 是在对 $v$ 做 optimization，用力越大，越会找到 $v$ 的错。CMU 讲义把它叫 over-optimization 或 reward hacking，引的是 Cobbe 等人的图：$N$ 过了某一点，accuracy 开始下降。

下面用一个 toy model 把这件事算出来（设定是我选的）。每个 sample 对的 probability 是 0.3，verifier 的分数按 sample 的类型服从不同的 normal distribution：

| sample 的类型 | 占比 | 分数的 distribution |
|---|---|---|
| 对的 | 0.3 | $\mathcal N(2,1)$ |
| 普通的错 | $0.7\times0.95=0.665$ | $\mathcal N(0,1)$ |
| 骗过 verifier 的错 | $0.7\times0.05=0.035$ | $\mathcal N(3,1)$ |

一个 sample 的分数的 CDF 是三者的 mixture，$F(s)=0.3\,\Phi(s-2)+0.665\,\Phi(s)+0.035\,\Phi(s-3)$。挑出来的那个是对的，意思是某一个对的 sample 拿到分数 $s$，其余 $N-1$ 个都低于 $s$；$N$ 个 sample 里哪一个当这个 maximum 有 $N$ 种选法，所以

$$\Pr(\text{best-of-}N\text{ 选中对的})=N\int_{-\infty}^{\infty}0.3\,\varphi(s-2)\,F(s)^{N-1}\,ds$$

$\varphi$ 是 standard normal 的 density。用 numerical integration 算：

| $N$ | 1 | 4 | 12 | 64 | 256 | 1024 |
|---|---|---|---|---|---|---|
| best-of-$N$ 选中对的 | 0.300 | 0.622 | 0.733 | 0.618 | 0.480 | 0.358 |
| 选中骗过 verifier 的错 | 0.035 | 0.106 | 0.201 | 0.377 | 0.519 | 0.642 |
| pass@N | 0.300 | 0.760 | 0.986 | 1.000 | 1.000 | 1.000 |

$N$ 小时，挑最高分主要是把普通的错筛掉，accuracy 上升；$N=12$ 左右到顶；再往后，分数最高的那一小撮里骗过 verifier 的越来越多（它们的 mean 比对的高 1），accuracy 回落，$N\to\infty$ 时趋于 0。pass@N 那一行是 oracle 能拿到的，两行之间的差就是 verifier 的错造成的损失。

::fig[nyu-reasoners-bon] 一次具体的 sampling：sample 一个一个加进来，$N$ 从 1 到 64。实心圆是对的，空心圆是普通的错，空心方块是骗过 verifier 的错；画圈的是分数最高、被选中的那个。下面是上表第一行的 expectation 曲线，点跟着 $N$ 走。

:::wrong 骗过 verifier 的错答案只占很少一部分，所以 best-of-N 基本可靠
在这个 toy model 里，骗过 verifier 的错只占全部 sample 的 3.5%。但 best-of-$N$ 选出来的不是一个随机的 sample，是分数最高的那个，恰好落在 verifier 最容易错的地方：$N=64$ 时被选中的有 37.7% 是它们，$N=1024$ 时是 64.2%。Verifier 好不好，要在被选中的 sample 上量，而且要在实际用的 $N$ 下量；在一个随机抽的 validation set 上量出来的 accuracy 说明不了这件事。
:::

### ORM 和 PRM：在哪一步打分

上面的 $v$ 只看完整的解，叫 outcome reward model（ORM）。它的 label 便宜（最终答案对不对），但信号粗：一个 10 步的解在第 2 步就错了，ORM 也要等看完才给一个分，而且不说错在哪。Process reward model（PRM）给每一步打分。Lightman 等人（2023，OpenAI）请人逐步标注 MATH 的解，数据集 PRM800K 有约 80 万个 step label（规模凭记忆）。JHU 的 slides 指出人工标注的问题：step 的空间太大，标不过来。

Math-Shepherd（Wang 等人，2024）把 label 换成可以自动算的东西：从第 $t$ 步的 prefix 出发，用 model 往下采 $K$ 个 completion，看最终答案对了几个。对的比例叫 soft label，“至少一个对”记 1 叫 hard label（这两个名字凭记忆）。Snell 的 PRM 用的是 soft label。

这个 label 到底是什么，用 Countdown 算一遍就清楚了。Completion policy 取开头那个随机 policy：在剩下两个数的 3 种合并里均匀地选。

- Prefix “97+96=193”：剩下 193 和 68，三个 completion 是 261、125、13124，一个对。Soft label 是 $1/3$，hard label 是 1。
- Prefix “96−68=28”：剩下 97 和 28，completion 是 125、69、2716，同样是 $1/3$ 和 1。
- Prefix “97−96=1”：剩下 68 和 1，completion 是 69、67、68，都不对。Soft 和 hard 都是 0。

::fig[nyu-reasoners-shepherd] 三个 prefix 和它们的全部 completion。打勾的 leaf 等于 125，soft label 是打勾的比例。

这里 completion 恰好能穷举，soft label 是精确值。一般只能采 $K$ 个，soft label 是一个 binomial 比例的估计：真值为 $1/3$、$K=8$ 时，它的 standard error 是 $\sqrt{(1/3)(2/3)/8}=0.167$。Hard label 在 $K=8$ 时有 $1-(2/3)^8=96\%$ 的 probability 是 1，几乎分不出 $1/3$ 和 1 的 prefix。

Soft label 估计的量有一个名字。Reward 只在结尾给、对为 1 错为 0 时，“从这个 prefix 出发、按这个 policy 走下去最终成功的 probability”就是 RL 里的 value function $V^\pi(s)$（定义见 [CS4246 第 1 站](../courses/CS4246.html#mdp)）。Snell 的 slides 也是这样说的：Math-Shepherd 式的 PRM 学的是一个 value function。

:::wrong PRM 的分数就是在判断这一步算得对不对
“97−96=1”这一步的 arithmetic 完全正确，Monte Carlo label 却是 0，因为它把问题带进了一个凑不出 125 的 state。反过来，这个 label 也依赖 completion policy：换一个更会做题的 policy，同一个 prefix 的 label 会变高。所以 rollout 训出来的 PRM 量的是“从这里走下去还有多大希望”；PRM800K 那样请人判断每一步的 label，量的才更接近“这一步本身有没有错”。两种 PRM 拿去做 search，偏好的东西不一样。
:::

:::from
Best-of-$N$ 与 weighted voting 的 formula、“$v$ 的几种叫法”、完美 verifier 的例子、Cobbe 等人的 verifier 与 over-optimization、Lightman 等人用人工的 process label，来自 [CMU 11-711 Lecture 22](https://cmu-l3.github.io/anlp-fall2025/static_files/anlp-f2025-22-inference.pdf)；ORM 与 PRM 的对照、人工标注太贵、用 rollout 从 ORM 推出 PRM label、Math-Shepherd，来自 [JHU 的 slides](https://self-supervised.cs.jhu.edu/sp2025/files/slides/15-16.inference-scaling.pdf)；Snell 用 rollout 的正确比例作 target、“学的是 value function”来自他的 [guest lecture](https://faculty.cc.gatech.edu/~zk15/teaching/AY2025_cs7643_spring/assets/L25_Charlie_Snell_Scaling_TestTime_Compute.pdf)。课程 [Lecture 7](https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec7.pdf) 有一页“PRMs, MCTS”，只有图，没有读到内容。三类 sample 的 toy model、它的全部数字、Countdown 的 label 和 standard error 是我设和算的；PRM800K 的规模、soft / hard label 的名字凭记忆，Cobbe、Lightman、Math-Shepherd 的原文都没有读。
:::

## [search] Tree search 与 compute-optimal 的 test-time scaling

:::skip
能在 Countdown 的 tree 上手做一遍 PRM 引导的 beam search，把它和 best-of-$N$、穷举按“生成了多少步”放在一起比，并说出 Snell 等人的结论里 beam search、best-of-$N$、revision 各在什么难度和 budget 下更好，就可以去第 5 站。快速路线可以跳过；A3 用不到这一站，跳过会少掉“search 什么时候值得”的判断。
:::

### 为什么要在步骤上 search

Best-of-$N$ 每一条都走到底才打分。长的解大多在前几步就走错了，后面的 token 白写了。有了 PRM，可以每走一步就评估一次，把没希望的 prefix 砍掉，把 compute 留给有希望的。

Step-level beam search（JHU、CMU 的讲义）：保留 $B$ 个 prefix（beam）；每一步把每个 prefix 扩展出 $M$ 个下一步，用 PRM 给这 $B\cdot M$ 个候选打分，留下最高的 $B$ 个；如此往下，直到写出答案。

在 Countdown 上做一遍，$B=2$，每个 prefix 把所有合法的下一步都扩展出来，PRM 用上一站算出的 soft label：

1. Root 是 {96, 97, 68}，扩展出 9 个第一步。PRM 分数有三个是 $1/3$（结果是 193、28、29 的那三步），其余六个是 0。
2. 留下分数最高的 2 个。这里三个并列，按顺序取 97+96=193 和 96−68=28。
3. 两个 prefix 各扩展出 3 个第二步，共 6 个 leaf。用 outcome verifier（把 expression 算一遍）检查，193−68 和 97+28 都等于 125。

::fig[nyu-reasoners-beam] 上面这次 beam search 一步一步展开，$B=2$。每个 node 下的数是 PRM 分数（soft label）；被留下的 node 加粗，被砍掉的变灰，打勾的 leaf 等于 125。

### 按生成的步数算账

比较 search 的方法，要在相同的 compute 下比。这里把“生成了多少个 step”当作 compute：

| 方法 | 生成的 step 数 | 找到解的 probability |
|---|---|---|
| 穷举整个 tree | $9+27=36$ | 1 |
| 随机 policy 采 $k$ 条，outcome verifier 检查 | $2k$ | $1-(8/9)^k$ |
| Beam search，$B=2$ | $9+6=15$ | 1 |

随机采样要让成功的 probability 超过 0.95，需要 $(8/9)^k\le0.05$，即 $k\ge\ln0.05/\ln(8/9)=25.4$，也就是 26 条、52 步。

Beam search 看起来便宜，但表里少算了一项：PRM 的分数从哪里来。如果在 test time 用 rollout 去算（Snell 比较的 lookahead search 就是这样做的），9 个第一步各要把 3 个 completion 算一遍，又是 27 步，合计 42 步，比穷举还贵。PRM 值钱的地方在于它是一个训练好的 model：rollout 的成本在训练 PRM 时付掉了，test time 一次 forward 就给出分数，把 rollout 的结果 amortize 到了很多道题上。Snell 的结论里 lookahead search 一般不如 beam search，slides 给的原因正是 lookahead 的 rollout 太贵。

### Snell 等人：哪种 search 在什么时候好

Snell 等人（2024）在 MATH 上比较了这些方法（base model 是 PaLM 2-S*，凭记忆）。他们先给题目分难度：每题采 2048 个 sample，按做对的比例把题目分成 5 个 quantile（oracle difficulty）；部署时没有标准答案，就改用 verifier 的预测分数来分（predicted difficulty）。Guest lecture 的结论：

- 所有用 verifier 的 search 都胜过 majority vote。
- 简单的题、大的 budget：best-of-$N$ 更好，beam search 出现 over-optimization 的迹象。
- 中等和较难的题、小的 budget：beam search 更好。
- 最难的那一档：所有方法都做不动。
- 每个难度选最好的方法（compute-optimal），最多能少用 4 倍的 test-time compute 达到 best-of-$N$ 的效果。

第 3 站的 toy model 说明了简单题上 beam search 为什么会 over-optimize。Beam search 每一步都对 PRM 做一次 argmax，相当于把 best-of-$N$ 的选择压力加到每一步上。题目简单时对的路本来就多，多挑几次主要的效果是挑中 PRM 的错（toy model 里 $N$ 从 12 涨到 1024，accuracy 从 0.733 掉到 0.358）；题目难时不挑就几乎找不到对的路，选择压力利大于弊。

Sequential 的版本是 revision：fine-tune 一个 model，让它看着前面几次错的尝试再写一次（训练数据是把同一题的几个错解接成一串，最后接上一个对的）。Snell 发现 revision 有时会把对的改错，所以要用 verifier 在整串 revision 里挑。Sequential 和 parallel 之间存在最佳的比例：简单题偏向多做 revision，难题要两者混合；按难度选比例，同样最多省 4 倍 compute。

他们还和 pretraining 比了一次：FLOPs 相等时，小 model 加 test-time compute 能胜过一个大 14 倍的 model，但只在小 model 本来就有一定成功率的题上（14 倍这个数凭记忆，slides 上没有）。划不划算还取决于 inference 的量：用户多时，每次多花的 test-time compute 要乘上调用的次数，slides 的结论是 test-time compute 适合简单到中等的题和 inference 量不大的场景。

:::wrong o1、R1 这类 reasoning model 在回答时内部跑着 tree search
JHU 的 slides 说 OpenAI 的方法细节不公开，但从现象推断：RL 训练、test time 写很长的 CoT、inference 时没有显式的 search。DeepSeek-R1 的报告把 PRM 和 MCTS 列在“没有成功的尝试”里（凭记忆）。这些 model 做的是 sequential 那条路：一次生成一条很长的 trace，trace 里自己尝试、发现走不通、回头换一条。JHU 提到的 Stream of Search 把这件事做得很直接：把一次带 backtracking 的 search 过程线性化成一串 token，拿来训练 model，让它学会在一条序列里 search。Search 没有消失，它被写进了 trace 里，所以 inference 时既不需要 PRM，也不需要维护一个 tree。怎样训练出这种 trace，是第 5、6 站的事。
:::

:::from
Step-level beam search 的定义、OpenAI 不做显式 search 的推断、Stream of Search 来自 [JHU 的 slides](https://self-supervised.cs.jhu.edu/sp2025/files/slides/15-16.inference-scaling.pdf)；难度的两种分法（2048 个 sample、5 个 quantile）、beam search 与 best-of-$N$ 在各难度上的比较、lookahead 太贵、“最多少用 4 倍 compute”、revision 模型的训练方法与 sequential / parallel 的比例、inference 量对划算与否的影响，来自 [Snell 的 guest lecture](https://faculty.cc.gatech.edu/~zk15/teaching/AY2025_cs7643_spring/assets/L25_Charlie_Snell_Scaling_TestTime_Compute.pdf)（只读到文字，图没有看到）。PaLM 2-S*、MATH、“14 倍”和 R1 报告里关于 PRM 与 MCTS 的说法凭记忆，Snell 和 R1 的论文都没有读。Countdown 上的 beam search、步数表和 26 条的计算是我做的。MCTS 本身（UCT 的 selection、expansion、rollout、backup）在 [CS4246 第 8 站](../courses/CS4246.html#mcts)。
:::

## [rlvr] RLVR：从 expert iteration 到 GRPO 的配方

:::skip
能推出 expert iteration 就是不减 baseline 的 policy gradient，对一个 group 算出 A3 三种 loss_type 的 advantage，能用 A3 handout 的例子说清 masked_mean 与 masked_normalize 给不同长度的回复多少 weight，能用数字说明 DAPO 为什么放宽 clip 的上界，并说出 base model 的哪些行为决定了 RL 能不能起作用，就可以去第 6 站。快速路线必读，对应 Lecture 6、7 和 A3 §6–8。Policy gradient、baseline、GRPO 的 formula 推导在 [CS336 第 10 站](../courses/STANFORD-CS336.html#align)，这里不重复。
:::

### 为什么从 RLHF 走到 RLVR

Lecture 7 先讲 RLHF 的问题。Reward model 是从人的偏好 fit 出来的，Durrett 组自己的研究（Singhal、Goyal、Xu、Durrett，COLM 2024）发现，在公开数据上训练的 reward model 和回复长度强相关；PPO 跑久了会 over-optimize，不能一直训下去。这和第 3 站 verifier 被钻空子是同一件事，只是发生在训练里。RLVR 换了一类问题：答案能被检查，reward 就是 1 或 0。Lecture 7 的对照：

| | RLHF | RLVR |
|---|---|---|
| 问题 | chat prompt | 数学、代码、agent 任务（“让这个 repo 编译通过并通过 tests”） |
| Reward | model 打分（LLM-as-a-judge） | 1 或 0 |
| 训练数据 | $(x,y^+,y^-)$ | $(x,a)$：题目和标准答案 |
| Algorithm | PPO、DPO | PPO、GRPO |

“1 或 0 不会被钻空子”的前提是 grader 真的可靠，A3 里会直接碰到这一点（第 7 站最后一节）。

### Expert iteration：最简单的 RLVR

Lecture 7 的第一个 algorithm 是 expert iteration（STaR，Zelikman 等人）：对每道题采一个回答，答案对就把 $(x,y)$ 加进 SFT 数据，在这些数据上做 SFT，然后重复。JHU 的 slides 把它写成 EM：E-step 采样并按答案过滤，M-step 在留下的 $Z_{\text{good}}$ 上 maximize likelihood；ReST、ReST-EM、rejection sampling fine-tuning 都是这个做法的变体。STaR 另有两处细节（凭记忆）：对一直做错的题，把正确答案作为提示让 model 补写 reasoning（rationalization）；每一轮都从原始 model 重新 fine-tune。

它和 policy gradient 的关系是一行式子。对一道题的 $n$ 个 sample，只在答对的 $c$ 个上做 SFT，gradient 是

$$\frac1c\sum_{i:\,r_i=1}\nabla_\theta\log\pi_\theta(y_i\mid x)=\frac nc\cdot\frac1n\sum_{i=1}^n r_i\,\nabla_\theta\log\pi_\theta(y_i\mid x)$$

等号成立是因为 $r_i$ 非 0 即 1，右边的 sum 自动只剩答对的项。右边的 $\frac1n\sum r_i\nabla\log\pi$ 正是 reward 取 0 和 1、不减 baseline 的 policy gradient estimate。两者方向相同，只差 $n/c$ 这个 scale；每轮都用当前的 model 重新采样时，expert iteration 就是 on-policy 的 policy gradient。A3 的 `loss_type="no_baseline"` 做的就是右边。

不减 baseline 的后果是答错的回答 weight 为 0：model 只被往“对的”方向拉，从不被推离“错的”。减去 group 的平均 reward 之后，错的回答拿到负的 weight。拿 $G=8$、只有 1 个答对的 group 算：

| A3 的设置 | 对的那个 | 7 个错的 |
|---|---|---|
| `no_baseline`（advantage 就是 $r$） | 1 | 0 |
| `reinforce_with_baseline`，`use_std_normalization=False` | $1-0.125=0.875$ | $0-0.125=-0.125$ |
| `reinforce_with_baseline`，`use_std_normalization=True` | $0.875/0.3536=2.475$ | $-0.125/0.3536=-0.354$ |

Std 用除以 $G-1$ 的版本：$\sqrt{(0.875^2+7\times0.125^2)/7}=\sqrt{0.875/7}=\sqrt{0.125}=0.3536$。A3 的 `grpo_baselines` 一题比较第一行和第三行，`grpo_group_standard_deviation` 一题比较第二行和第三行。

所有这些做法共同的一个问题：一道题的 $G$ 个 sample 全错，什么信号都没有。$p=0.02$ 的题，$G=8$ 时只有 $1-0.98^8=14.9\%$ 的 probability 采到至少一个对的，和第 2 站的 pass@k 是同一个式子。Lecture 7 讲的 DAPO 的 dynamic sampling 把全对、全错的 group 滤掉再补采。全对、全错的 group 占多少，图见 [Modern RL 第 6 站](../courses/MODERN-RL.html#finetune)。

### 每个 token 分多少：masked_mean 与 masked_normalize

A3 的 `grpo_microbatch_train_step` 要把 per-token 的 loss 聚合成一个数。Handout 有一道不做实验、只做分析的题（think about length normalization），比较两种做法，例子是一个 batch 里两个回复，分别长 4 和 7 个 token，常数取 7：

- `masked_mean`：每个回复在自己的 token 上平均。
- `masked_normalize`：每个回复在自己的 token 上求和，再除以同一个常数。

Handout 打印出的结果是 masked_mean 给 $[2,\,2]$，masked_normalize 给 $[1.1429,\,2.0000]$。这和每个 token 的值都是 2 的情形对得上：前者是 $8/4=2$ 和 $14/7=2$，后者是 $8/7=1.1429$ 和 $14/7=2$。

对 gradient 来说，要看的是每个 token 的 weight。

::fig[nyu-reasoners-lennorm] 同样两个回复（4 个和 7 个 token）在两种聚合下每个 token 的 weight。masked_mean 让短回复的每个 token 分到 1/4、长回复分到 1/7；masked_normalize 一律是 1/7。

masked_mean 下每个回复的 weight 总和都是 1，与长度无关，代价是长回复的每个 token 被稀释。乘上 advantage 看：错的回复 advantage 是负的，写得越长，每个 token 受的惩罚越轻，model 被推向把错的回答写长；对的回复反过来偏向短。这是 Dr. GRPO 去掉 length normalization 的理由（Lecture 7 的 DrGRPO 一页；数值例子在 [CS336 第 10 站](../courses/STANFORD-CS336.html#align)）。masked_normalize 下每个 token 的 weight 一样，长回复整体的 weight 更大，没有这个偏向；代价是 gradient 的大小随回复长度变化，长回复多的 batch gradient norm 更大。Handout 让你在 `grpo_length_normalization` 里看 gradient norm 这类稳定性指标，原因在此。

DAPO 的 token-level loss（凭记忆）是把整个 batch 所有 token 的 loss 加起来，除以 batch 里的 token 总数。它和 masked_normalize 一样让 batch 里每个 token 的 weight 相同，区别只在除数随 batch 变。

### 放宽 clip 的上界：DAPO 的 clip-higher

:::wrong PPO 式的 clip 对所有 token 一视同仁，不影响 exploration
Clip 限制的是 ratio $\pi_\theta/\pi_{\text{old}}$（formula 见 [CS336 第 10 站](../courses/STANFORD-CS336.html#align)）。取 $\varepsilon=0.2$ 时，advantage 为正的 token 一次 update 里 ratio 最多涨到 1.2。换成 probability 看，两个 token 的处境完全不同：$\pi_{\text{old}}=0.9$ 的 token 上限是 $0.9\times1.2=1.08$，等于没有限制；$\pi_{\text{old}}=0.01$ 的 token 最多涨到 $0.01\times1.2=0.012$。一个低 probability 的 token（比如一个少见、但能引出另一种思路的词），advantage 再大，每轮也只能涨这么一点；高 probability 的 token 却可以一直涨。结果是 policy 越来越集中，entropy 一路下降（entropy collapse）。DAPO 把上下界拆开（摘要里的 decoupled clip），下界留在 $1-0.2$，上界放到 $1+0.28$，于是 0.01 的 token 能涨到 0.0128（0.28 和这个例子凭记忆，DAPO 只读了摘要）。A3 要求 log token entropy，它掉得太快就是 exploration 没了的信号。
:::

### Base model 决定了 RL 能走多远

Lecture 7 引 Gandhi 等人（2025）的结论：RL 只在 base model 已经具备某种能力时才起作用。他们的实验正好是 A3 的任务：同样的 RL 在 Countdown 上训练，Qwen-2.5-3B 远好于 Llama-3.2-3B。他们看的是四种行为：verification（检查中间结果）、backtracking（发现走不通就回头）、subgoal setting（先定一个中间目标）、backward chaining（从目标往回推）。Qwen 一开始就有这些行为，Llama 没有。先用含这些行为的例子对 Llama 做一点 SFT（priming）再 RL，Llama 能追上甚至超过 Qwen；用“reasoning 的模式对、但答案错”的例子 priming，效果和用正确答案的差不多。这篇只读了摘要，具体数字没有核对。

这和第 2 站的 pass@k 是同一件事的两面。RL 能提高的是 base model 已经偶尔做对的题（$p>0$）。一个从不 backtrack 的 model 在 Countdown 上很少采到对的 sample，group 全是 0，没有 gradient。用 Countdown 的 tree 来看：第一步走进那 6 个 PRM 分数为 0 的 state 之后，不回头就不可能再凑出 125。RL 之后 pass@k 的变化、random reward 也能涨分的争议，见 [Modern RL 第 6 站](../courses/MODERN-RL.html#finetune)。

:::edge 被截断的回复
A3 的 `sampling_max_tokens` 是 1024。写到上限还没写出 `</answer>` 的回复，reward 是 0，和答错一样被推低。如果被截断的大多是“快做对了、只是写得长”，RL 就在惩罚长的 reasoning。Lecture 7 说 DAPO 专门处理了被截断的长回复（凭记忆，做法是两种：被截断的回复不计 loss；或者只在接近上限的一段里，按超出的长度线性扣分）。做 A3 时至少要 log 被截断的比例。
:::

:::from
RLHF 的问题（reward 与长度相关、over-optimization）、RLHF 与 RLVR 的对照、expert iteration、DrGRPO、DAPO 的 dynamic sampling 和“处理被截断的长回复”、Gandhi 等人的结论，来自 [Lecture 7](https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec7.pdf)（只读到文字，公式和图没看到）；expert iteration 写成 EM 及其变体的名字来自 [JHU 的 slides](https://self-supervised.cs.jhu.edu/sp2025/files/slides/15-16.inference-scaling.pdf)；三种 `loss_type`、两种 normalization 的开关、masked_mean 与 masked_normalize 的例子和打印结果、log entropy 与 gradient norm 的要求、`sampling_max_tokens` 来自 [A3 handout](https://gregdurrett.github.io/courses/sp2026/a3.pdf) §7、§8；Gandhi 等人的细节来自 [摘要](https://arxiv.org/abs/2503.01307)。Expert iteration 等于不减 baseline 的 policy gradient 的推导、group 的 advantage 表、token weight 的图是我做的。STaR 的 rationalization 与重新 fine-tune、DAPO 的 0.28、token-level loss、对截断回复的两种处理凭记忆；STaR、DAPO 的原文没有读。
:::

## [distill] Distillation 与 long CoT 的 SFT

:::skip
能推出 SFT on teacher traces 在 minimize 哪个 KL，说出 RL 和 distillation 各自从哪里得到训练信号，能手写 A3 的 `tokenize_prompt_and_output` 的三个输出、用 logsumexp 写出 entropy，并说出 budget forcing 怎样延长或截断 reasoning，就可以去第 7 站。快速路线可以跳过；做 A3 的 SFT 部分（§4）时回来读第三节。
:::

### RL 在小 model 上为什么慢

第 5 站的结论是：RL 只能放大 base model 已经偶尔做对的东西，而且每道题的信号要靠采样碰出来。小 model 做难题时 $p$ 接近 0，大多数 group 没有 gradient。手边如果有一个更强的 model（teacher），可以直接拿它写出的 reasoning 做 SFT：每个 token 都有 target，不需要等 student 自己碰对。这就是 distillation。

DeepSeek-R1 的报告做了这个对比（数字凭记忆）：在 Qwen2.5-32B 上直接做大规模 RL，AIME 2024 的 pass@1 是 47.0；用 R1 生成的约 80 万条 sample 对同一个 base model 做 SFT，得到 72.6。报告的结论是把大 model distill 到小 model 效果很好，小 model 靠大规模 RL 自己练，代价大，还不一定达得到。

### SFT on teacher traces 在 optimize 什么

把 teacher 的 distribution 记作 $q(y\mid x)$。在 teacher 的 sample 上做 SFT，loss 的 expectation 是（下面省去 $\mid x$）

$$\mathbb E_{y\sim q}\big[-\log\pi_\theta(y)\big]=-\sum_yq(y)\log\pi_\theta(y)=-\sum_yq(y)\log q(y)+\sum_yq(y)\log\frac{q(y)}{\pi_\theta(y)}=H(q)+\mathrm{KL}\big(q\,\|\,\pi_\theta\big)$$

第二个等号是在 $\log\pi_\theta$ 上加一个 $\log q$ 再减一个 $\log q$。$H(q)$ 和 $\theta$ 无关，所以 SFT 在 minimize forward KL：teacher 会写的每一种 trace，student 都必须给它 probability，否则 $q(y)\log\frac{q(y)}{\pi_\theta(y)}$ 会很大。

RL 的 objective 是在 student 自己的 sample 上算的，distillation 的 sample 来自 teacher。Student 在 teacher 走过的 prefix 上学，到自己生成时，一旦写出 teacher 不会写的 prefix，就进了训练里没见过的 state，这时没有任何 target 告诉它怎么接下去。这是 distillation 的结构性弱点，也是有了 distill 出来的 model 之后还要再做 RL 的一个理由。

### A3 的 SFT：只在 response 上算 loss

SFT 的 loss 只算 response 的部分（为什么不算 prompt，见 [CS4248 第 8 站](../courses/CS4248.html#post)）。A3 的 `tokenize_prompt_and_output` 把这件事落到 tensor 上：prompt 和 output 分别 tokenize 再拼接，然后错开一位得到 input 和 label，再在 label 上标出哪些位置属于 response。设 prompt 是 3 个 token $p_1p_2p_3$，output 是 4 个 token $o_1o_2o_3o_4$，拼起来长 7：

| 位置 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| `input_ids` | $p_1$ | $p_2$ | $p_3$ | $o_1$ | $o_2$ | $o_3$ |
| `labels` | $p_2$ | $p_3$ | $o_1$ | $o_2$ | $o_3$ | $o_4$ |
| `response_mask` | 0 | 0 | 1 | 1 | 1 | 1 |

`input_ids` 是拼接结果去掉最后一个，`labels` 是去掉第一个，所以两者长 6；handout 规定 shape 是 `(batch, max_len - 1)`，batch 里短的要 pad，pad 的位置 mask 为 0。第 3 个位置的 input 是 prompt 的最后一个 token，它要预测的 label 是 response 的第一个 token，所以 mask 从第 3 位开始。

::fig[nyu-reasoners-sftmask] 同一个例子：上一行 input、下一行 label，错开一位；浅色格是 response_mask 为 1 的位置，loss 只在这里算。

`get_response_log_probs` 在每个位置取 label 那个 token 的 log-probability：先对 logits 做 `log_softmax`，再按 label 取出对应的一项，不要先 softmax 再取 log。`compute_entropy` 要的是每个位置在整个 vocabulary 上的 entropy。设 logits 为 $z_1,\dots,z_V$，$\log p_i=z_i-\operatorname{logsumexp}(z)$，于是

$$H=-\sum_ip_i\log p_i=-\sum_ip_i\big(z_i-\operatorname{logsumexp}(z)\big)=\operatorname{logsumexp}(z)-\sum_ip_i\,z_i$$

最后一步用了 $\sum_ip_i=1$。$\operatorname{logsumexp}$ 先减 max 再算，数值稳定；handout 要求的就是这种写法。`sft_microbatch_train_step` 把 response 上的 negative log-likelihood 用 `masked_normalize` 加起来除以常数，再除以 gradient accumulation 的步数，然后 `backward()`。

### Long CoT 的长度：budget forcing

s1（Muennighoff 等人，2025）把这一站的两件事放在了一起。数据只有 1,000 道题（s1K，按难度、多样性、质量三条标准挑选，三条都做了 ablation），每道带一条 reasoning trace，在 Qwen2.5-32B-Instruct 上 SFT。然后在 decoding 时控制 reasoning 的长度，叫 budget forcing：model 想结束 reasoning 时，不让它结束，在后面接上“Wait”，它常常会回头检查、改掉错误；要压短时，在预算用完的地方强行结束 reasoning，让它直接给答案。摘要报告，用 budget forcing 把 AIME24 从 50% 推到了 57%。

这就是第 1 站 sequential 的那条路，而且是一个可以连续调节的旋钮。它的局限在于只是从外面打断或延长，model 自己不知道预算。L1（Aggarwal 与 Welleck，2025）把预算写进 prompt（例如“最多用 2000 个 token”），用 RL 训练，reward 是答案的正确性减去违反长度约束的 penalty（CMU 讲义）。

A3 的 `sft_experiment` 也在问数据量的问题：用 128、256、512、1024 条和全部的 Prime Intellect reasoning trace 分别 SFT，比较 validation accuracy。

:::wrong Distill 出来的 student 学会了 teacher 的 reasoning，所以和 teacher 一样可靠
Gandhi 等人的 priming 实验（第 5 站）是反面的证据：用“reasoning 的模式对、答案错”的 trace 做 SFT，之后 RL 的效果和用正确 trace 差不多。SFT 主要传下去的是写法和行为模式：什么时候检查、什么时候回头。这些行为用在哪里、用多少、检查有没有真的发现错误，SFT 不保证；加上上一节说的，student 到了 teacher 没走过的 prefix 就没有 target。所以 distill 出来的 model 要和任何 model 一样重新评测，而且除了 accuracy，还要看 reasoning 长度的 distribution。
:::

:::from
Gandhi 等人的结论来自 [Lecture 7](https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec7.pdf) 与 [摘要](https://arxiv.org/abs/2503.01307)；`tokenize_prompt_and_output` 的 shape、`compute_entropy` 用 logsumexp、`get_response_log_probs`、`masked_normalize`、`sft_microbatch_train_step` 和 `sft_experiment` 的设置来自 [A3 handout](https://gregdurrett.github.io/courses/sp2026/a3.pdf) §4 和仓库里的 tests；s1 来自 [摘要](https://arxiv.org/abs/2501.19393)；budget forcing 的两种方向和 L1 来自 [CMU 11-711 Lecture 22](https://cmu-l3.github.io/anlp-fall2025/static_files/anlp-f2025-22-inference.pdf)。DeepSeek-R1 的 47.0、72.6 和 80 万条凭记忆，报告没有读。Forward KL 和 entropy 的推导、tokenize 的表是我写的。
:::

## [eval] Evaluation 的陷阱：noise、contamination 与 parsing

:::skip
能算出一个 benchmark 分数的 standard error，用 paired bootstrap 判断两个系统的差别是否可信，把 variance 分解成“抽到哪些题”和“每题的 sampling”，说出 multiple testing 和 contamination 怎样让分数虚高，并能把 A3 的 math_baseline 里 model 的错和 parser 的错分开，就读完了这门课。快速路线必读，对应 Lecture 11 和 A3 §3。
:::

### 一个分数有多少 noise

Lecture 11 的问法：25% 对 23%，在 10,000 道题上和在 100 道题上意思完全不同。把 test set 看成从题目的 distribution 里抽出的 $n$ 道题，每题对或错，accuracy $\hat\mu$ 的 standard error 是

$$\mathrm{SE}=\sqrt{\frac{\mu(1-\mu)}n}$$

Lecture 11 的例子：$n=100$、$\mu=0.6$，$\mathrm{SE}=\sqrt{0.24/100}=0.049$，95% 区间约为 $\pm1.96\times0.049=\pm9.6$ 个百分点。Lecture 11 接着问：要分出 5 个点的差，需要多少题？两个独立的分数之差的 SE 是 $\sqrt{2\mu(1-\mu)/n}$，令 $1.96\sqrt{2\times0.25/n}\le0.05$，得 $n\ge768$。

Lecture 11 用 bootstrap 来算区间，不依赖 normal approximation：对 test set 有放回地重抽 $n$ 道题，算一次 accuracy，重复 10,000 次，取 2.5% 和 97.5% 的 quantile。

::fig[nyu-reasoners-ci] 真实 accuracy 为 50% 时，95% 区间的半宽随题数 $n$ 的变化。AIME 一年 30 道题是 ±17.9 个点，MATH-500 是 ±4.4，GSM8K 的 1,319 道 test 题是 ±2.7。

### Reasoning model 的分数还多一层 noise

Reasoning model 用 temperature 采样，同一道题跑两次结果可能不同。分数的 variance 来自两处：抽到了哪些题，以及每道题的 sampling。设第 $j$ 题的真实 accuracy 是 $p_j$，每题采 $m$ 次取平均（常写作 avg@m），这道题的得分记作 $\bar r_j$。给定题目，$\mathbb E[\bar r_j\mid j]=p_j$，$\mathrm{Var}(\bar r_j\mid j)=p_j(1-p_j)/m$。题目本身也是随机抽的，由 law of total variance，

$$\mathrm{Var}(\bar r_j)=\mathrm{Var}_j\big(\mathbb E[\bar r_j\mid j]\big)+\mathbb E_j\big[\mathrm{Var}(\bar r_j\mid j)\big]=\mathrm{Var}_j(p_j)+\frac1m\,\mathbb E_j\big[p_j(1-p_j)\big]$$

$n$ 道题独立，平均分 $\hat\mu$ 的 variance 再除以 $n$。

算一个 AIME 的例子：30 道题里 15 道 $p_j=0.9$、15 道 $p_j=0.1$，平均 0.5。$\mathrm{Var}_j(p_j)=(0.9-0.5)^2=0.16$，$\mathbb E_j[p_j(1-p_j)]=0.9\times0.1=0.09$。

| $m$ | 题目固定时的 SE（只剩 sampling） | 题目也随机时的 SE |
|---|---|---|
| 1 | $\sqrt{0.09/30}=5.5$ 个点 | $\sqrt{(0.16+0.09)/30}=9.1$ 个点 |
| 16 | $\sqrt{0.09/16/30}=1.4$ 个点 | $\sqrt{(0.16+0.09/16)/30}=7.4$ 个点 |
| 64 | 0.7 个点 | 7.3 个点 |

多采几次只能消掉第二项。“在这 30 道题上谁更好”可以靠 avg@16 说得很准；“在 AIME 这一类题上谁更好”，30 道题的限制谁也绕不过去。读论文时要分清它报的 ± 是哪一种。

### 两个系统比较要 paired

:::wrong 两个系统的 95% 区间重叠，说明差别不显著
Lecture 11 的例子：系统 1 是 60%，区间 (50%, 70%)；系统 2 是 65%，区间 (55%, 75%)。区间重叠，但不能就此下结论，因为两个系统做的是同一组题，对错高度相关。构造一个具体的情形：100 道题，系统 2 在系统 1 做对的 60 道上全对，另外多做对 5 道，没有一道是反过来的。分别 bootstrap，区间是 (0.50, 0.70) 和 (0.56, 0.74)，重叠。Paired bootstrap 每次对同一组重抽的题比较两个系统：只有 100 次抽取一次都没抽中那 5 道题时，系统 2 才不比系统 1 好，probability 是 $(95/100)^{100}=0.0059$。p 值是 0.006，差别是可信的。反过来，Lecture 11 的 10 道题的例子里系统 2 在多数重抽中都赢，p 值却是 0.21，题太少。
:::

```python
import numpy as np

def paired_bootstrap(a, b, B=10_000, seed=0):
    """a、b：两个系统在同一组题上的对错（1/0），顺序一致。
    返回 p 值：重抽后 b 不比 a 好的比例。"""
    rng = np.random.default_rng(seed)
    a, b = np.asarray(a), np.asarray(b)
    idx = rng.integers(0, len(a), size=(B, len(a)))   # 每行是一次重抽
    delta = b[idx].mean(axis=1) - a[idx].mean(axis=1)
    return (delta <= 0).mean()
```

Lecture 11 还提醒了 multiple testing：试 20 组 hyperparameter，即使没有一组真的更好，每组都用 0.05 的标准，至少一组“显著”的 probability 是 $1-0.95^{20}=0.64$。Bonferroni correction 把标准除以检验的次数，20 次就是 $0.05/20=0.0025$。Lecture 11 用 jelly bean 的例子讲 file drawer effect：20 个研究里 19 个没结果、没发表，发表出来的那一个就是 false positive。RL 的实验 variance 大，A3 的 learning rate sweep、各种 ablation 都在做多次比较，同一个结论最好在不同 seed 上重复。

### Contamination

Lecture 11 把 contamination 分成三种：benchmark 的题出现在 pretraining 数据里；连同答案出现在 post-training 数据里；出现在 RL 的题库里。分数本身看不出虚高了多少。

GSM1k（Zhang 等人，2024）的做法是重新出题：照 GSM8K 的风格和难度出约 1,000 道新题，人的解题率、解题步数、答案大小等指标都与 GSM8K 对齐，再比较 model 在两套题上的分数。摘要报告：有的 model 在 GSM1k 上低了多达 8 个点；一个 model 生成 GSM8K 原题的 probability 越高，它在两套题上的分差越大（Spearman $r^2=0.36$）；多数 frontier model 没有明显的 overfitting 迹象（只读了摘要）。

Oren 等人（2024）在只能拿到 model log-likelihood 的条件下检测（Lecture 11）。如果一个 benchmark 被原样放进过训练数据，model 会记住题目的排列顺序。题目本来是 exchangeable 的，任何顺序的 likelihood 应该差不多；按原始顺序排的 likelihood 显著高于打乱后的顺序，就说明见过。按这个原理写成 permutation test（具体做法是我按原理写的，原文没有读）：算原始顺序下整个数据集的 log-likelihood，再算很多个随机 permutation 下的，原始顺序排进最高的那一小撮就有证据。Lecture 11 留了一个问题：它测不到什么？按原理推（这是我的推断）：题目被打乱顺序后才进入训练数据、被改写过、或零散地混在别的文本里，顺序的信号就没有了；所以它能给出“见过”的证据，不能给出“没见过”的证据。

### 答案解析：model 错还是 parser 错

A3 的第一题（`math_baseline`）就是这件事。Grader `question_only_reward_fn` 只认回复里的最后一个 `\boxed{...}`：找不到 `\boxed`，format reward 和 answer reward 都是 0；找到了，再用 mathd 的 normalization 和 sympy 判断它与标准答案是否相等（$1/2$ 和 $0.5$ 算相等），不相等就是 format 1、answer 0。Handout 要你把 500 道 MATH test 题的结果分成三类（format 1 且 answer 1，format 1 且 answer 0，format 0），后两类各至少看 10 个，判断是 model 的问题还是 parser 的问题。

从 grader 的代码可以读出几种会误判的情形：

- 答案写在 `\boxed` 外面（“the answer is 5”），format 是 0，但 model 其实做对了。这是 parser 的错，换 prompt 或换 grader，分数都会变。
- 回复里有不止一个 `\boxed{}`（先给一个、后来又改），grader 只取最后一个。
- 同一个文件里的 `r1_zero_reward_fn` 是给 R1 格式用的，它要求回复里恰好出现 `</think> <answer>`（中间一个空格），格式稍有不同，整条回复的 format 就是 0。

Lecture 7 的最后一节讲的也是这件事：prompt 的格式是 reasoning model 的关键组成，答案的格式各家不同（OpenThoughts 在“**Final Answer**”一行里用 `\boxed{}`，R1 用 `<answer>` tag），A3 会让你看到 parsing error 怎样造成看起来的失败。

:::edge Format 也是 reward
RL 拿同一个 grader 当 reward 时，parser 的偏好会被训练进 model。`question_only_reward_fn` 对“格式对、答案错”给 format 1、reward 0，代码注释写明这样做是为了防止 hacking：如果格式对就给一部分 reward，model 会先学会只写格式。所以 A3 要求分别 log format reward 和 answer reward：训练前期 total reward 在涨，先要确认涨的是哪一个。
:::

:::from
Accuracy 与 baseline、$n=100$、$\mu=0.6$ 的例子和“检测 5 个点需要多少题”的问题、bootstrap、paired bootstrap 和它的两个例子（(50%, 70%) 对 (55%, 75%)、10 道题 p 值 0.21）、multiple testing 与 Bonferroni、file drawer effect、contamination 的三种、Oren 等人的思路和“它测不到什么”的问题，来自 [Lecture 11](https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec11.pdf)（只读到文字）；GSM1k 来自 [摘要](https://arxiv.org/abs/2405.00332v1)；`math_baseline` 的三类和 grader 的用法来自 [A3 handout](https://gregdurrett.github.io/courses/sp2026/a3.pdf) §3，grader 的行为是我读仓库里的 `drgrpo_grader.py` 得到的；Lecture 7 最后一节讲 prompt 与答案解析。768 题的计算、variance 分解、AIME 的例子、100 道题的 paired 构造（bootstrap 区间用 seed 0 模拟，p 值是精确算的）、区间半宽的图、paired bootstrap 的代码是我做的；Oren 等人的 permutation test 的写法和“测不到什么”的回答是我按原理推的。
:::

## 作业

三个作业都公开了 handout，A3 的 starter repo（`gregdurrett/nyu-llm-reasoners-a3`）带 pytest，`tests/adapters.py` 是把你的实现接到测试上的地方。三个作业都在授权下改编自 Stanford CS336，A1、A2 和 CS336 的 A1、A2 基本相同，A3 对应 CS336 的 A5 但多了 SFT、少了 preference alignment 的部分。A2 的 handout 要求有问题只找 NYU 的课程人员，不要去联系 Stanford 的作者。Final project 自选题目、1 到 3 人（课程主页），它的 handout 这次没有读。

### Assignment 3：Alignment and Reasoning RL（先做）

**要从零写什么。** 用 vLLM 在 500 道 MATH test 题上测 Qwen2.5-Math-1.5B 的 zero-shot（temperature 0，最多 2048 个 token），把失败分类（第 7 站）；SFT 需要的 `tokenize_prompt_and_output`、`compute_entropy`、`get_response_log_probs`、`masked_normalize`、`sft_microbatch_train_step`（第 6 站），然后在 Prime Intellect 的 reasoning trace 上 SFT，数据量取 128、256、512、1024 和全部；GRPO 需要的 `compute_group_normalized_rewards`、`compute_naive_policy_gradient_loss`、`compute_grpo_clip_loss`、`compute_policy_gradient_loss`、`masked_mean`、`grpo_microbatch_train_step` 和完整的 train loop（第 5 站），在 Countdown（10k train、1024 dev、1024 test）上训练，做 learning rate、baseline、length normalization、std normalization 的比较；可选的 off-policy GRPO（一批 rollout 训多步，用 `grpo_clip`）。只能用 Hugging Face Transformers 载入 model 和做 forward，`Trainer` 这类训练工具不能用。

**做完会什么。** 一个能跑起来的 RLVR training loop，以及第 5 站每个设计选择在真实训练里的样子；SFT 的 data scaling；以及看懂一个 reward 曲线背后是 model 在变好还是 parser、format 在变。

**时间与算力。** Handout 没有给总时间，GRPO 的 handout 部分占 41 分实现、27 分实验（满分 100）。实验部分每个 run 要 2 块 GPU（一块跑 policy，一块跑 vLLM）；NYU 的 HPC 在 GPU 利用率低时会杀 job，课程申请到 90 分钟的宽限。vLLM 不支持 Mac，仓库提供不含 vLLM 的 `pyproject-mac.toml`，SFT 和 GRPO 的单元测试可以在 Mac 上写和跑。

**做不了的部分和替代。** 数据（Prime Intellect 的 SFT trace、Countdown 的三个 split）通过 handout 里的一个 Google Drive 链接发放（校外能不能打开没有核实）；MATH 在 Hugging Face 上（`hiyouga/math12k`，`evaluate.py` 里直接载入）。免费 Colab 做不了实验：1.5B 的 model 全 parameter 训练，bf16 的 weight 和 gradient 加上 fp32 的 AdamW 两个 state，每个 parameter 12 byte，约 18 GB，超过 T4 的 16 GB，还要另一块卡跑 vLLM（这是我的估算）。可行的路：租两块 GPU 跑缩小版（少一些 step）；或者在一块大卡上把 vLLM 的 `gpu_memory_utilization` 调低，和 policy 放在同一块卡上（我的建议，没有试过）。实现部分和单元测试不需要 GPU，先把 §7 的测试全部跑过，收获已经是这个作业的大半。

**提示。**

- `student/evaluate.py` 里写的是 `from cs336_alignment.drgrpo_grader import ...`，但这个仓库的 package 叫 `student`，直接跑会 import error，要改成 `student.drgrpo_grader`。（仓库）
- 我读到的 handout 文本里，starter 的 hyperparameter 彼此对不上：`rollout_batch_size` 是 16，`train_batch_size` 是 64 并标注 on-policy，`gradient_accumulation_steps` 是 128，而 handout 自己要求的 assert 包括 `train_batch_size` 能被 `gradient_accumulation_steps` 整除、on-policy 时两个 batch size 相等。开跑前先把这几个数改成自洽的（例如 on-policy 时让两个 batch size 相等，再选一个能整除的 accumulation 步数）。（handout，判断是我的）
- Countdown 的 prompt 要求答案写在 `<answer></answer>` 里，handout 说要让 vLLM 在 `</answer>` 处停止生成；vLLM 默认不把 stop string 留在输出里，解析时要考虑到，或者用 `SamplingParams` 的 `include_stop_str_in_output=True` 把它留下（这两点凭记忆）。Baseline 的 evaluation 用 temperature 0，GRPO 的 sampling 用 0.7、`sampling_min_tokens=4`。（handout）
- 仓库里没有 Countdown 的 reward function，要自己写：从最后一个 `<answer>` 里取出 expression；prompt 允许“Step X:”的多行写法和单个等式两种格式，两种都要能解析；检查用到的数是给定数字的子集、每个最多一次；expression 用 `ast` 解析、只允许数字和加减乘除，不要对 model 的输出直接 `eval`；除法的结果用一个小的 tolerance 和 target 比较。（经验）
- `compute_entropy` 用 logsumexp（第 6 站的推导），`get_response_log_probs` 用 `log_softmax` 再按 label 取值；gradient accumulation 时每个 microbatch 的 loss 先除以 `gradient_accumulation_steps` 再 backward；gradient clipping 取 1.0。（handout）
- `pg_loss` 不是真正的 loss，不要拿它当指标；要 log 的是 loss、gradient norm、token entropy、off-policy 时的 clip fraction，以及 train 的 total、format、answer 三种 reward。（handout）
- `grpo_clip` 需要 old log-prob，只在 off-policy 时用：生成完、进入 inner loop 之前，在 `torch.inference_mode()` 下算好 `old_log_probs`。（handout）
- 每 5 到 10 步做一次 validation，用足够多的例子。按第 7 站的 SE 算，accuracy 37% 左右时，1,024 道 dev 题的 95% 区间是 ±3.0 个点，只用 128 道是 ±8.4 个点，后者不足以比较 learning rate。（handout；数字是我算的）
- 参考实现用 starter 配置在 Countdown 上约 37% validation accuracy；learning rate sweep 至少要有一个 model 到 30%。明显发散或落后的 run 可以提前停掉。（handout）
- SFT 时调 learning rate 和 batch size，直到 training loss 下降约 40%；每次 rollout 前用 `load_policy_into_vllm_instance` 把最新的 policy weight 载入 vLLM；checkpoint 很大，存到 `/scratch`。（handout）
- 读 rollout 的原文。Handout 要求交 rollout 随训练变化的例子；第 5 站的 Gandhi 等人看的正是 rollout 里有没有 verification 和 backtracking。（handout；后半句是我的建议）

### Assignment 1、2：Transformer LM 与 Systems（做过 CS336 的 A1、A2 可以跳过）

**要从零写什么。** A1 是 BPE、Transformer LM、AdamW、training loop 和 decoding，和 CS336 的 A1 相同（来自调研条目，NYU 的 A1 handout 这次没有读）。A2 只有单卡的部分：benchmark 与 nsys profiling（`benchmarking_script`、`nsys_profile`）、mixed precision、memory profiling、PyTorch 版和 Triton 版的 FlashAttention-2（`flash_forward` 25 分、`flash_backward` 10 分、`flash_benchmarking` 15 分）。Handout 的标题是 Systems and Parallelism，但里面没有多卡和 distributed 的题。A1 的代码可以用课程给的 `a1-basics/`，也可以通过 `pyproject.toml` 换成自己的。

**做完会什么。** 见 [CS336 的作业一节](../courses/STANFORD-CS336.html)：A1 是一个 LM 从文本到 sample 的每一行代码，A2 是读懂 profiler、写出一个真的更快的 attention kernel。

**时间与算力。** A2 除了 PyTorch 版的 FlashAttention，都要一块 NVIDIA GPU；Triton 不支持 Mac，要 Linux。Benchmark 的 model 从 small（$d_{\text{model}}=768$、12 层）到 2.7B（2560、32 层），vocabulary 10,000、batch size 4；有的大 model 在长 context 下会 OOM，handout 说如实报告即可。

**做不了的部分和替代。** 没有多卡的要求，单卡就能做完，这是它和 CS336 A2 的主要区别，也是没有多卡时更适合自学的原因。免费 Colab 的 T4 可以调 Triton kernel 的正确性，但 2.7B 的配置会 OOM，benchmark 的数字也不能和别人的 GPU 比（调研时的经验）。

**提示。**

- CUDA 调用是 asynchronous 的，计时前后要 `torch.cuda.synchronize()`；end-to-end benchmark 先跑 5 步 warm-up，再计 10 步，报 mean 和 standard deviation；用 NVTX range 把 warm-up 从 nsys 的结果里排除。（handout）
- Autograder 用 `TRITON_INTERPRET=1` 在 CPU 上模拟 Triton，handout 说这个 interpreter 有 bug；调试用 `tl.device_print`。（handout）
- On-chip 的 $O$、$l$、$m$ 用 fp32 累加，$\tilde P$ 乘 $V$ 之前转成 $V$ 的 dtype；block 的 offset 要乘上 tile size；测试用的维度都是至少 16 的 2 的 power。（handout）
- `flash_benchmarking` 要报告用的是哪种 GPU；可选的 Triton backward 需要对 $dQ$ 做 atomic add。更多的提示见 [CS336 A2 的提示](../courses/STANFORD-CS336.html)。（handout）
