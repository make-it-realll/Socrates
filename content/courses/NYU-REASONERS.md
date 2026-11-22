---
code: NYU-REASONERS
evidence: syllabus
evidenceNote: "NYU CSCI-GA.3033-131 / DS-GA.3001-009 Building LLM Reasoners，Spring 2026 一期（Greg Durrett）。课程网站的 GitHub 仓库（gregdurrett/gregdurrett.github.io）里有全部 slides 和 handout 的 PDF，我 clone 下来逐页读了 Lecture 6、7、9、11 的文字，并把其中只有图和公式的 slides 渲染成图片看过；A1、A2、A3、final project 的 handout 和 midterm 考点读的是全文；A3 的 starter repo 读了 README、tests、prompts 和 drgrpo_grader.py。课程本身对 test-time compute、search 和 verifier 讲得少，这几站另外读了 Denny Zhou 在 UC Berkeley 讲 LLM reasoning 的 slides 全文、CMU 11-711 Fall 2025 的 inference 一讲（WebFetch，只拿到转述）和这门课的 evaluation 与 experimental design 两个 notebook、JHU CS 601.471 的 inference scaling slides、Charlie Snell 在 Georgia Tech 的 guest lecture slides，以及各站引到的论文正文（WebFetch 读，引文是逐段要的，但工具只给短引文和转述）。第二轮核对补读了 Lecture 10（Xi Ye）的文字和讲 long CoT 的第 29 到 36 页的图，以及 Cobbe 等人、Wu 等人、L1 的正文和 self-consistency、Li 等人、Stream of Search 的摘要，原来凭 CMU、JHU 转述写的几处改成了对着原文写；DAPO 的 soft overlong punishment 区间对照了 volcengine/verl 里的实现。CMU、JHU 两份 slides 仍然只有 WebFetch 的转述（PDF 不在公开的 GitHub 仓库里，curl 被代理拦下）。Lecture 1 到 5、8、12 只看了标题；没有看录像（只对选课学生开放）。"
exam: "无期末考试。按课程主页：3 个作业 25%，3 到 4 次 in-class quiz 25%，in-class midterm 25%（2 小时，按 90 分钟设计；可带一张 letter 纸双面的 notes，禁用电子设备；题型是选择、简答和长答），final project 25%（可以 2 到 3 人一组，自选题目）。Midterm 考点列表公开（Transformer、tokenization、resource accounting、GPU 与 FlashAttention、scaling laws、SFT、DPO、RL basics、GRPO），题目本身没有公开。"
subskills:
  - id: cot
    name: Chain-of-thought 与 test-time compute
    l3: "有提示能做：算出一个 model 每个 token 的 forward FLOPs，并数出 Countdown 在 n 个数时的候选 expression 个数。"
    l4: "能独立做：把 CoT 写成 latent variable，构造一个“最可能的 reasoning chain”和“最可能的答案”不一致的例子，并比较 parallel 与 sequential 两种做法的 FLOPs 和 latency。"
    l5: "能讲给别人：写出来的中间 token 为什么给了 model 额外的串行计算、更大的 model 为什么替代不了它，以及 CoT 的哪一步最容易出错、怎样交给工具。"
  - id: passk
    name: Sampling、pass@k 与 majority vote
    l3: "有提示能做：由每题做对的 probability 算出 pass@k，并用 Codex 的 estimator 从 n 个 sample 估计它。"
    l4: "能独立做：证明这个 estimator unbiased、说出 plug-in estimate 偏低的原因，并精确算出 majority vote 在给定 answer distribution 下随 k 的变化。"
    l5: "能讲给别人：pass@k 和 maj@k 各回答什么问题、各自的极限是什么，两者之间的差距为什么只有 verifier 能填。"
  - id: verify
    name: Verifier、best-of-N 与 process reward model
    l3: "有提示能做：写出 best-of-N 和 weighted voting 的 aggregation，并对 Countdown 的一个部分解算出 Math-Shepherd 的 soft label 和 hard label。"
    l4: "能独立做：用一个 score distribution 的 toy model 算出 best-of-N 的 accuracy 随 N 先升后降，说明 ORM 和 PRM 的 label 各从哪里来，并比较 min、product、last 三种把步骤分数合成一个分数的办法。"
    l5: "能讲给别人：rollout 训出的 PRM 量的是 value function 而不是步骤的对错，以及 over-optimization 为什么发生在被选中的 sample 上。"
  - id: search
    name: Tree search 与 compute-optimal 的 test-time scaling
    l3: "有提示能做：在 Countdown 的 tree 上手做一遍 PRM 引导的 beam search。"
    l4: "能独立做：按生成的 step 数把 beam search、best-of-N、穷举放在同一个 budget 下比较并算进 PRM 的成本，推出 Snell 等人的 FLOPs 互换倍数。"
    l5: "能讲给别人：Snell 等人的结果里 beam search、best-of-N、revision 各在什么难度和 budget 下更好，以及 reasoning model 为什么把 search 写进了一条长 trace。"
  - id: rlvr
    name: RLVR：从 expert iteration 到 GRPO 的配方
    l3: "有提示能做：对一个 group 算出 A3 三种 loss_type 的 advantage，并复现 handout 里 masked_mean 与 masked_normalize 的 gradient。"
    l4: "能独立做：推出 expert iteration 就是不减 baseline 的 policy gradient，用数字说明 DAPO 为什么放宽 clip 的上界，并算出 soft overlong punishment 的值。"
    l5: "能讲给别人：length normalization、被截断的回复、难度过滤各自怎样改变 gradient，以及 base model 的哪些行为决定了 RL 能不能起作用。"
  - id: distill
    name: Distillation 与 long CoT 的 SFT
    l3: "有提示能做：手写一个例子的 input_ids、labels 和 response_mask。"
    l4: "能独立做：推出 SFT on teacher traces 等价于 minimize 哪个 KL，用 logsumexp 写出数值稳定的 entropy，并说出 budget forcing 怎样延长或截断 reasoning。"
    l5: "能讲给别人：RL 和 distillation 的训练信号各从哪里来，小 model 上 distillation 为什么更划算，以及 SFT 传下去的到底是什么。"
  - id: eval
    name: Evaluation 的陷阱：noise、contamination 与 parsing
    l3: "有提示能做：算出一个 benchmark 分数的 standard error 和 95% 区间。"
    l4: "能独立做：做 paired bootstrap 和 power analysis，把 variance 分解成“抽到哪些题”和“每题的 sampling”两部分，并把 A3 的失败分成 model 错和 parser 错。"
    l5: "能讲给别人：区间重叠为什么不等于不显著，multiple testing 与 contamination 怎样抬高分数，以及 Oren 等人的检测方法能证明什么、不能证明什么。"
open:
  - label: "NYU Building LLM Reasoners, Spring 2026 课程主页，以及网站仓库 gregdurrett/gregdurrett.github.io 里的全部 slides 与 handout PDF"
    url: "https://gregdurrett.github.io/courses/sp2026/index.html"
    note: "各站对应哪一讲以这里为准。"
  - label: "Lecture 6: SFT, RLHF（Durrett）slides"
    url: "https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec6.pdf"
    note: "第 5 站（RLHF 的 reward 与长度）、第 6 站（OpenThoughts 的 distillation）。逐页读了文字，关键几页看了图。"
  - label: "Lecture 7: RLVR（Durrett）slides"
    url: "https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec7.pdf"
    note: "第 5 站的主要来源，第 3、4、7 站的一部分。逐页读了文字，公式和图的几页渲染成图片看过。"
  - label: "Lecture 9: Agents（Durrett）slides"
    url: "https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec9.pdf"
    note: "第 1 站的 CoT 三步与 PAL、SatLM 的例子。"
  - label: "Lecture 10: Reasoning Over Long Context（Xi Ye，guest lecture）slides"
    url: "https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec10-xi.pdf"
    note: "第 4 站：long CoT 与 long context 是同一个计算难题，以及在 Countdown 上按给定 procedure 写长 search trace 的实验。读了全部文字，第 29 到 36 页看了图。"
  - label: "Lecture 11: LLM Evaluation（Durrett）slides"
    url: "https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec11.pdf"
    note: "第 7 站的主要来源。逐页读了文字，contamination 和 multiple testing 几页看了图。"
  - label: "Assignment 3: Reasoning RL handout，以及 gregdurrett/nyu-llm-reasoners-a3 仓库"
    url: "https://gregdurrett.github.io/courses/sp2026/a3.pdf"
    note: "第 5、6、7 站和作业一节。Handout 读了全文。"
  - label: "Assignment 1、Assignment 2、Final Project handout 与 midterm 考点"
    url: "https://gregdurrett.github.io/courses/sp2026/a2.pdf"
    note: "作业一节。全文读过。"
  - label: "Denny Zhou: LLM Reasoning: Key Ideas and Limitations（UC Berkeley 讲稿，dennyzhou.github.io 仓库里的 PDF）"
    url: "https://dennyzhou.github.io/LLMs-Reason-Lecture.pdf"
    note: "第 1、2 站：中间 token 的 theory、decoding 求的和我们要的不是一回事、self-consistency 的例子、universal self-consistency。读的是 Berkeley 版全文；链接是同一仓库里较早的版本。"
  - label: "CMU 11-711 Advanced NLP, Fall 2025, Lecture 22: Advanced Inference Strategies（Sean Welleck），以及同课的 errorbars.ipynb、power.ipynb"
    url: "https://cmu-l3.github.io/anlp-fall2025/static_files/anlp-f2025-22-inference.pdf"
    note: "第 1、2、3 站（parallel 与 sequential、best-of-N、voting 与它的极限、weighted voting、over-optimization、L1）和第 7 站（standard error、paired、power analysis）。Slides 只拿到 WebFetch 的转述；两个 notebook 是 git clone 下来读的全文。"
  - label: "JHU CS 601.471/671 Spring 2025, Lectures 15–16: Inference Scaling（Khashabi）"
    url: "https://self-supervised.cs.jhu.edu/sp2025/files/slides/15-16.inference-scaling.pdf"
    note: "第 3、4、5 站：ORM 与 PRM、rollout 得到的 PRM label、beam search、expert iteration 写成 EM、Stream of Search。WebFetch 的转述。"
  - label: "Charlie Snell: Scaling LLM Test-Time Compute（Georgia Tech CS 7643 guest lecture）与论文 arXiv 2408.03314"
    url: "https://faculty.cc.gatech.edu/~zk15/teaching/AY2025_cs7643_spring/assets/L25_Charlie_Snell_Scaling_TestTime_Compute.pdf"
    note: "第 3、4 站。Slides 和论文正文都读了。"
  - label: "论文正文：Codex（2107.03374）、STaR（2203.14465）、Let's Verify Step by Step（2305.20050）、Math-Shepherd（ACL 2024）、DeepSeek-R1（2501.12948v2）、s1（2501.19393）、DAPO（2503.14476）、Cognitive Behaviors（2503.01307）、OpenThoughts（2506.04178）、GSM1k（2405.00332）、Adding Error Bars to Evals（2411.00640）、Training Verifiers（Cobbe 等人，2110.14168）、Inference Scaling Laws（Wu 等人，2408.00724）、L1（2503.04697）；摘要：Self-Consistency（2203.11171）、Chain of Thought Empowers Transformers（2402.12875）、Stream of Search（2404.03683）"
    url: "https://arxiv.org/abs/2107.03374"
    note: "各站引用的数字和定义都对着正文核过；读法是 WebFetch，只拿到短引文和转述，表格数字是工具转写的。最后三篇只读了摘要。DAPO 的 overlong 区间另外对照了 volcengine/verl 仓库里的实现（git clone）。"
---

先看三个数。

**第一个。** A3 的 handout 介绍 Countdown 时用的例子是：用 96、97、68 这三个数，每个最多用一次，配上加减乘除，凑出 125。答案是 $96+97-68$。一个 language model 如果要在写下答案的第一个 token 之前就把它想好，只有一次 forward pass 可用。只用加、减、乘的话，三个数一共能组出 27 个完整的 expression；六个数时是 656,100 个。

**第二个。** 让一个毫无本事的 policy（每一步在合法的 move 里均匀地随机选）去做这道题，一次做对的 probability 是 $1/9$。采 8 次，至少一次做对的 probability 是 61%；采 64 次是 99.95%。但这 64 个答案里哪个是对的，得有东西来判断。在第 3 站的一个 toy model 里，一个会被少数错答案骗过的 verifier 从 12 个 sample 里挑，accuracy 是 73%；从 1024 个里挑，只有 36%。

**第三个。** AIME 一年 30 道题，答案都是 000 到 999 之间的整数。一个真实水平 50% 的 model，单跑一遍的分数，95% 区间是 ±17.9 分。一个完全不读题、随机报数的程序采 1024 次，“至少碰上一次”的 probability 是 64%。

这门课要回答的是：怎样让 model 在需要多步 reasoning 的问题上做对。有三条路，课程依次讲到：在 test time 多花 compute（写出中间步骤、多采几次、用 verifier 挑、在步骤上 search）；把这种能力训练进 model（RL with verifiable rewards，或者从更强的 model distill）；以及诚实地量出到底做对了多少。三个数分别在第 1、3、7 站得到解释，第二个也牵出了第 2、4 站。

| 站 | 内容 | 对应的课程材料 | 对应作业 |
|---|---|---|---|
| 1 | Chain-of-thought 与 test-time compute | Lecture 7、9；Berkeley、CMU 的讲义 | A3 §2、§5 |
| 2 | pass@k 与 majority vote | CMU、Berkeley 的讲义；Codex | A3 的 evaluation |
| 3、4 | Verifier、PRM、tree search | Lecture 7 的 PRM 一页、Lecture 10；CMU、JHU、Snell | （无） |
| 5 | RLVR | Lecture 6、7 | A3 §6–8 |
| 6 | Distillation 与 SFT | Lecture 6、7 | A3 §4 |
| 7 | Evaluation | Lecture 11；CMU 的 notebook | A3 §3 |

这一页假定读者已经懂 Transformer、policy gradient 和 GRPO 的基本形式。课程的 Lecture 1 到 5（Transformer、tokenizer 与 optimizer、GPU 与 FlashAttention、scaling law）和 Stanford CS336 的前半段同题，A1、A2 的 handout 写明改编自 CS336 的 A1、A2，这些在 [CS336 的页面](../courses/STANFORD-CS336.html)里写过；policy gradient、baseline、GRPO 的 advantage、PPO 式 clipping 的推导在 [CS336 第 10 站](../courses/STANFORD-CS336.html#align)，GRPO 的几处 bias 和“RL 到底教会了 model 什么”的争议在 [Modern RL 第 6 站](../courses/MODERN-RL.html#finetune)，这里用到时只给链接。Lecture 8（safety）和 Lecture 12（multimodal）这一页不讲；Lecture 10（Xi Ye 的 guest lecture，主页上的题目是 LongCoT reasoning）大部分讲 long context 的训练与 scaffolding，只有讲 long CoT 的一节用在第 4 站。

只有十几个小时时的路线：第 2、5、7 站必读，加上第 1 站的前两节；第 3、4、6 站可以先跳，每站开头写了跳过的代价。作业先做 A3 的 §7（GRPO 的实现，先过单元测试）。

## [cot] Chain-of-thought 与 test-time compute

:::skip
能说清一个 token 的 forward pass 能做多少串行的计算、写出来的中间 token 怎样把这个上限抬高，能把 CoT 写成 latent variable 并说出“最可能的 reasoning chain”和“最可能的答案”为什么不是一回事，能算出 parallel 与 sequential 两种做法各花多少 FLOPs，就可以去第 2 站。快速路线里前两节必读，后两节可以先跳。
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

Denny Zhou 在 Berkeley 那一讲里给了这个直觉的 theory 版本（Li、Liu、Zhou、Ma，ICLR 2024）。论文摘要的说法更精确：constant depth、constant-bit precision 的 Transformer 不写中间 token 时，只能解 $\mathsf{AC}^0$（$\mathsf{TC}^0$ 的一个真子集）里的问题；同样 constant depth、constant-bit precision、embedding 维度只有 $O(\log n)$ 的 Transformer，写 $T$ 步 chain-of-thought，就能解任何大小为 $T$ 的 boolean circuit 能解的问题。直接生成最终答案，要么需要极大的 depth，要么根本解不了。他从中得出的实际含义是：生成更多中间 token 是一个可以 scale 的方向。

> 写出来的中间 token 给了 model 额外的串行计算：每写一个 token，就多一次能读到上一步结果的完整 forward pass。

### 把 CoT 写成 latent variable

A3 的 Countdown prompt 让 model 先一步步解释 reasoning，最后在 `<answer>` 和 `</answer>` 之间给答案（答案可以是几行“Step X:”，也可以是一个等式）。把 reasoning 的部分记作 $z$、答案记作 $a$，model 给出的是 joint distribution $p(z,a\mid x)=p(z\mid x)\,p(a\mid x,z)$。Berkeley 那一讲把问题摆得很直白：decoding 时 model 在做的是

$$\arg\max_{z,a}\;p(z,a\mid x)$$

而我们要的是答案的 marginal 最大：

$$\arg\max_a\;p(a\mid x)=\arg\max_a\sum_z p(z,a\mid x)$$

两者不一致。Greedy decoding（temperature 0）每一步取最可能的 token，得到一条（近似）最可能的 $z$ 和它后面的 $a$，这个 $a$ 不一定是 marginal 最大的。设一道题 model 有四条 reasoning chain：

| reasoning chain | $p(z\mid x)$ | 给出的答案 |
|---|---|---|
| $z_1$ | 0.4 | 126 |
| $z_2$ | 0.2 | 125 |
| $z_3$ | 0.2 | 125 |
| $z_4$ | 0.2 | 125 |

最可能的单条链是 $z_1$，答案 126。但 $p(125\mid x)=0.2+0.2+0.2=0.6$，$p(126\mid x)=0.4$：三条不同的路走到了同一个答案，单看每一条都不如 $z_1$ 可能。Sum 算不出来，就用 sampling 去估计：采几条，看哪个答案出现得最多。Berkeley 讲稿里的例子是 GSM8K 的鸭蛋题（每天 16 个蛋，早餐吃 3 个，烤 muffin 用 4 个，剩下的每个卖 2 美元），三次 sampling 分别写出 $(16-3-4)\times2=18$、一个错把 $16-4-3$ 算成得 26 的回答、以及先算 $16-3=13$ 再算 $13-4=9$、$9\times2=18$ 的回答，出现最多的答案是 18；讲稿特别注明，这是出现最多的答案，不是出现最多的 reasoning path。第 2 站接着算要采多少次。

### 写出来的步骤也会算错

:::skip
快速路线可以先跳。跳过会少掉“CoT 的哪一步交给工具”的判断，第 3 站讲 verifier 时会再用到。
:::

中间 token 给了串行计算，但每一步仍然是 model 采样出来的，照样会错。Lecture 9 用一道题把 CoT 拆成三件事：理解题意（interpret）、列出计划（plan）、执行计算（execute）。题目是：9 升浓度 50% 的酸液，加多少水能稀释到 30%。

正确的做法：酸有 $9\times0.5=4.5$ 升，加水 $x$ 升后浓度是 $\dfrac{4.5}{9+x}=0.3$，所以 $9+x=15$，$x=6$。

Slides 上 GPT 的 CoT 写出了 $0.3(9+x)=0.5\times9$，这一步是对的：理解了水的浓度是 0，计划也对。接下来要算 $0.3x=0.5\times9-0.3\times9=4.5-2.7=1.8$，它却写成 $0.15$，得出 $x=0.5$。Lecture 9 的评语是：这是让 LLM 去做它不擅长的事。

两种把执行交出去的办法：

- **PAL**（program-aided）让 model 写一段 Python，由 interpreter 执行。Slides 上那段程序是 `water_added = 9 * (50 - 30) / 50`，结果 3.6，错在计划：它把理解题意和列计划混在一段命令式代码里。
- **SatLM**（Ye、Chen、Dillig、Durrett，NeurIPS 2023）只让 model 把题目翻译成形式化的 constraint（`liters_after = liters_initial + water_added`、`percent_after = percent_initial * liters_initial / liters_after`、`percent_after = percent_desired`），由 SMT solver Z3 去解，得到 6。Z3 还能报告 constraint 有错、无解或有歧义；slides 说 SatLM 给出答案时的 accuracy 比 program-aided 高得多。

这件事和第 3 站是同一个思路：model 生成，外部的东西检查或执行。能把检查交出去的地方（代码、形式化的 constraint、Countdown 的 expression），不必相信 model 自己的执行。

### 两种花 test-time compute 的方式

:::skip
快速路线可以先跳。跳过会少掉 test-time compute 的成本账，第 4 站末尾和第 6 站的 budget forcing 会用到。
:::

CMU 11-711 的那一讲把多花 test-time compute 的办法分成两类：

- **Parallel**：独立地采 $N$ 条 $(z,a)$，再用一个 aggregation 合成一个答案。取出现最多的答案是 majority vote（第 2 站），用 verifier 打分挑最高的是 best-of-$N$（第 3 站）。
- **Sequential**：让一条 $z$ 变长，在里面检查、回头、换一种做法。o1、R1 这一类 reasoning model 走的是这条路；长度可以靠 RL 训练出来（第 5 站），也可以在 decoding 时强行控制（第 6 站的 budget forcing）。

两者都按生成的 token 付钱。按每 token $2N$ FLOPs：1.5B 的 model 写 10,000 个 token 是 $2\times1.5\times10^9\times10^4=3\times10^{13}$；32B 的 model 写 1,000 个 token 是 $2\times3.2\times10^{10}\times10^3=6.4\times10^{13}$。小 model 多想 10 倍，花的 compute 还不到大 model 想一遍的一半。Wu 等人（ICLR 2025）的 inference scaling law 正是这样记账的：inference compute 是 parameter 数、生成的 token 数和 inference 策略的函数，FLOPs 按 Kaplan 等人的公式算，再问固定 compute 下怎样分配。他们在 MATH 上的结果是，Llemma-7B 配上他们的 tree search（REBASE），在所有试过的 inference 策略下都胜过 Llemma-34B，用约一半的 FLOPs 达到和 34B 相当的 accuracy；摘要的结论是，小 model 配上更好的 inference algorithm，在成本和效果上是 Pareto-optimal 的。第 4 站会把这笔账和 pretraining 的成本放在一起算。

FLOPs 只是下界。Decode 是 memory-bound 的，每生成一个 token 要把 parameter 和整个 KV cache 读一遍（[CS336 第 8 站](../courses/STANFORD-CS336.html#infer)），一条 10,000 token 的 trace 越往后越慢；而且 sequential 的 token 只能一个接一个地生成，latency 随长度线性增长，JHU 的 slides 专门列出了这项代价。Parallel 的 $N$ 条可以放进同一个 batch 一起生成，latency 几乎不随 $N$ 增长。

:::wrong 一次 forward 做不到的事，换一个更大的 model 就能一步做到
更大的 model 主要是更宽、层数多一些，串行的层数仍是一个固定的 $L$。Countdown 的候选从 3 个数的 27 个涨到 6 个数的 656,100 个，是 exponential 的增长；要在固定的 $L$ 层里把它们并行地过一遍，宽度也得跟着 exponential 地涨。写中间步骤的做法每一步只面对一个小问题（6 个数时第一步最多 $\binom62\cdot3=45$ 个选择），配上第 4 站的 search，总代价随步数增长。Snell 在他的 guest lecture 里举的正是这个例子：Countdown 这样简单的题也可能需要 search，不是什么都能一次答出来。
:::

:::from
中间 token 的 theory 结论、“decoding 求的和我们要的不一致”的两个式子、鸭蛋题的三次 sampling，来自 [Denny Zhou 的 Berkeley 讲稿](https://dennyzhou.github.io/LLMs-Reason-Lecture.pdf)（读的是全文，含渲染出来的公式页）；CoT 的三步、酸液题、PAL 和 SatLM 来自 [Lecture 9](https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec9.pdf) 第 16 到 25 页；parallel 与 sequential 的两分法来自 [CMU 11-711 Lecture 22](https://cmu-l3.github.io/anlp-fall2025/static_files/anlp-f2025-22-inference.pdf)（WebFetch 的转述）；Wu 等人的 compute 记账和 Llemma-7B 对 34B 的结果来自 [他们的论文](https://arxiv.org/abs/2408.00724)；Li 等人的结论按 [论文摘要](https://arxiv.org/abs/2402.12875) 核对过；latency 的代价来自 [JHU 的 slides](https://self-supervised.cs.jhu.edu/sp2025/files/slides/15-16.inference-scaling.pdf)；“Countdown 也需要 search”来自 [Snell 的 guest lecture](https://faculty.cc.gatech.edu/~zk15/teaching/AY2025_cs7643_spring/assets/L25_Charlie_Snell_Scaling_TestTime_Compute.pdf)；Countdown 的例子和 prompt 来自 [A3 handout](https://gregdurrett.github.io/courses/sp2026/a3.pdf) §5。候选 expression 的个数、tree 的全部 node、酸液题的正确解、FLOPs 的对比和四条 reasoning chain 的表是我算或设的。
:::

## [passk] Sampling、pass@k 与 majority vote

:::skip
能从“一次做对的 probability $p$”推出 pass@k，证明 Codex 的 estimator unbiased 并说出 plug-in estimate 偏向哪边，能精确算出 majority vote 在给定 answer distribution 下随 $k$ 的变化，就可以去第 3 站。快速路线必读：读 RLVR 的论文、看 A3 的 log 都要用到这些量。
:::

### pass@k：至少一次做对

对一道题，model 每次 sample 做对的 probability 记作 $p$（由 model、prompt 和 temperature 决定）。独立采 $k$ 次，全错的 probability 是 $(1-p)^k$，所以至少一次对的 probability 是

$$\text{pass@}k=1-(1-p)^k$$

开头那个随机 policy 在 Countdown 题上 $p=1/9$：pass@1 $=0.111$，pass@8 $=1-(8/9)^8=0.610$，pass@64 $=1-(8/9)^{64}=0.9995$。

pass@k 回答的问题是：如果有一个完美的 verifier 能从 $k$ 个答案里认出对的那个，能做对多少。它来自代码生成（Codex 论文，Chen 等人 2021）：代码有 unit test，跑一遍就知道对不对，这时 pass@k 就是真的拿得到的 accuracy。Codex-12B 在 HumanEval 上一次 sample 做对 28.8% 的题，每题采 100 次时 70.2% 的题至少有一个 sample 通过。数学题在 test time 没有标准答案，pass@k 只是一个上限。

一个 benchmark 的 pass@k 是各题 pass@k 的平均。各题的 $p$ 差别很大，平均值随 $k$ 怎样变，主要由难题决定。

::fig[nyu-reasoners-passk] 10 道题，每道一个 $p$（第 6 道是 Countdown 上的随机 policy，$p=1/9$）。$k$ 每翻一倍，各题的 pass@k 往右涨；右边是 10 道题的平均。$p$ 大的题很快到顶，曲线后段的上升全靠 $p$ 小的题；$p=0$ 的那一道永远是 0。

这 10 道题平均的 pass@1 是 0.319，pass@8 是 0.602，pass@256 是 0.872。从 pass@1 到 pass@8 涨了 0.28，从 pass@8 到 pass@256 只涨了 0.27，后面这一段 $k$ 翻了五倍。

### 从 $n$ 个 sample 估计 pass@k

实际不知道 $p$，只能每题采 $n$ 个 sample，数出其中 $c$ 个对。最直接的做法是把 $\hat p=c/n$ 代进去，得 $1-(1-c/n)^k$。Codex 论文指出这个 estimate 有 bias，附录里说它“consistent underestimate”。

原因是 $g(\hat p)=(1-\hat p)^k$ 是 $\hat p$ 的 convex function，Jensen inequality 给出 $\mathbb E[g(\hat p)]\ge g(\mathbb E\hat p)=(1-p)^k$，所以

$$\mathbb E\big[1-(1-\hat p)^k\big]\le1-(1-p)^k$$

算一个：$p=0.1$、$n=10$、$k=5$。真值是 $1-0.9^5=0.4095$；$c$ 服从 $\mathrm{Binomial}(10,0.1)$，plug-in estimate 的 expectation 是 0.3485，低了 6 个百分点。

Codex 论文的 estimator（论文里每题 $n=200$，$k\le100$）是

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

中间一步是把 $\frac{(n-k)!}{(n-c-k)!}$ 和 $\frac{n!}{(n-c)!}$ 各写成 $c$ 个连续整数的乘积。Codex 论文给的 numpy 写法就是这个乘积：

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

没有 verifier 时，第 1 站的 marginal $p(a\mid x)$ 给了另一条路：采 $k$ 次，取出现次数最多的答案。这就是 self-consistency（Wang 等人，ICLR 2023），摘要的说法是：不只取 greedy 的那一条，而是采一组不同的 reasoning path，把它们 marginalize 掉，选最一致的答案；摘要报告它让 CoT 在 GSM8K 上提高 17.9 个点。DeepSeek 的报告里叫 cons@k，CMU 讲义里也叫 voting@k：

$$\hat a=\arg\max_a\sum_{i=1}^k\mathbb 1\big[a^{(i)}=a\big]$$

$k\to\infty$ 时各答案的频率收敛到 $p(a\mid x)$，majority vote 选出的是 marginal 最大的答案。所以它的极限只取决于一件事：对的答案是不是 $p(a\mid x)$ 的 mode。Wu 等人的 Theorem 1 正是这样说的：sample 数 $n\to\infty$ 时，majority vote 的 accuracy almost surely 收敛到“marginal 的 argmax 等于正确答案”的题所占的比例，期望 accuracy 和这个极限的差距按 $O(c^{-n})$（某个 $c>1$）缩小；Theorem 2 对 weighted voting 给出同样形式的结论，只是 marginal 里每条 reasoning path 的 probability 先乘上 reward model 的分数。再多采也不会更高，要更高只能换更好的 model，或者给 vote 加上更好的 weight。

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

Majority vote 需要判断两个答案“相同”：数学题比较最终数值（$1/2$ 和 $0.5$ 算同一个，正是 A3 的 grader 做的事），代码比较执行结果。Berkeley 讲稿举的反例是自由文本（“哪些国家的人喝咖啡比墨西哥少”），没有现成的 equivalence；universal self-consistency（Chen 等人）的办法是把几个回答一起交给 LLM，让它挑出和其他回答最一致的那个。

:::edge Temperature
pass@k 和 maj@k 都依赖 sampling 的 temperature。Temperature 为 0 时 $k$ 个 sample 完全一样，pass@k 等于 pass@1，maj@k 也等于 pass@1。Codex 论文在一个 679M 的 model 上发现，pass@1 的最佳 temperature 是 0.2，pass@100 的是 0.8：$k$ 大时，sample 之间的差异比单个 sample 的质量更值钱。所以报告 pass@k 时要连同 temperature、top-p 和 $n$ 一起报。
:::

:::from
pass@k 的定义、plug-in estimate 的偏低、unbiased estimator、$n=200$、乘积形式的 numpy 代码、HumanEval 的 28.8% 与 70.2%、temperature 的两个最佳值，来自 [Codex 论文](https://arxiv.org/abs/2107.03374) §2.1、§3 与附录 A（WebFetch 读正文，只拿到短引文）。Majority vote 的 aggregation、voting@k 的叫法来自 [CMU 11-711 Lecture 22](https://cmu-l3.github.io/anlp-fall2025/static_files/anlp-f2025-22-inference.pdf)（转述）；$n\to\infty$ 的极限和 $O(c^{-n})$ 来自 [Wu 等人的论文](https://arxiv.org/abs/2408.00724) 的 Theorem 1、2；self-consistency 的做法和 GSM8K 的 17.9 个点来自 [Wang 等人的摘要](https://arxiv.org/abs/2203.11171)；咖啡的例子和 universal self-consistency 来自 [Denny Zhou 的 Berkeley 讲稿](https://dennyzhou.github.io/LLMs-Reason-Lecture.pdf)。Unbiased 的证明（“随机取出的 $k$ 个就是 $k$ 个 iid sample”）、Jensen 的论证、乘积形式的推导、两张表和图里的全部数值是我做和算的。AIME 随机报数的例子是我构造的。
:::

## [verify] Verifier、best-of-N 与 process reward model

:::skip
能写出 best-of-$N$ 和 weighted voting 的 aggregation，用一个 toy model 算出 verifier 不完美时 best-of-$N$ 的 accuracy 为什么先升后降，能说出 ORM 和 PRM 的区别，并给 Countdown 的一个部分解算出 Monte Carlo 的 soft label 和 hard label，就可以去第 4 站。快速路线可以跳过；跳过的代价是第 4 站的 beam search 读不懂，第 5 站讲 RLHF 被钻空子时少了一个具体的模型。
:::

### Best-of-N：用一个打分函数代替 oracle

Best-of-$N$：采 $N$ 个，用打分函数 $v$ 挑最高的，

$$\hat y=\arg\max_{i}\,v\big(y^{(i)}\big)$$

CMU 讲义说 $v$ 可以叫 reward model、evaluator、value model 或 verifier。有的任务有完美的 verifier：代码跑 unit test，定理交给 Lean 检查，Countdown 把 expression 算一遍。这时 best-of-$N$ 的 accuracy 就是 pass@N。数学题的标准答案在 test time 不知道，只能用一个学出来的 $v$ 去近似“这个解对”的 probability。Cobbe 等人（2021）为此造了 GSM8K（约 8.5K 道小学数学应用题），并训练了这样一个 verifier：先把 generator 在 train set 上 fine-tune 2 个 epoch，对每道训练题采 100 个解，只按最终答案对不对打 label（推理错、答案碰对的也算对），再训练 verifier 预测“这个解对”的 probability（在每个 token 后都预测一次，比只在结尾预测效果好）；test time 每题采 100 个，取 verifier 分数最高的那个。在完整的数据上，6B 的 generator 加 6B 的 verifier 略胜过 fine-tune 过的 175B model，论文说这相当于 model 放大约 30 倍。

Verifier 的好坏直接决定 best-of-$N$ 能拿到 pass@N 的多少。Codex 论文里有一组现成的数：每题采 100 个 sample，随机挑一个只能做对 28.8%；如果有 unit test 当 oracle，是 70.2%；不用 test，只按“每个 token 的平均 log-probability”挑最高的那个，是 44.5%。Model 自己的 likelihood 是一个免费但很弱的 verifier；论文还说按 log-probability 的总和挑，比随机挑还略差（我的解释：每个 token 的 log-probability 都是负的，总和天然偏向短的回答）。

Weighted voting 把 voting 和打分结合起来，每个答案的票数按 $v$ 加权：

$$\hat a=\arg\max_a\sum_{i=1}^N v\big(y^{(i)}\big)\,\mathbb 1\big[a^{(i)}=a\big]$$

CMU 讲义引的结果是，它可以同时胜过 unweighted voting 和 best-of-$N$，verifier 越好越明显。Cobbe 等人用的是另一种结合：先按 verifier 排序，只让排在最前面的几个按最终答案投票；每题 100 个 sample 时，只让前 3 到 5 个投票最好，3,200 个 sample 时约取前 30 个。

### Verifier 会被钻空子

学出来的 $v$ 在大多数 sample 上打分合理，但总有一小部分错的 sample 恰好拿到高分。$N$ 越大，被挑出来的那个越可能落在这一小部分里：best-of-$N$ 是在对 $v$ 做 optimization，用力越大，越会找到 $v$ 的错。CMU 讲义把它叫 over-optimization 或 reward hacking，引的是 Cobbe 等人的图。原文的说法是：每题的 completion 数增加到 400 之前，accuracy 一直上升，之后开始下降；search 的好处最终被“找到能骗过 verifier 的 adversarial solution”的风险抵消。

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

::fig[nyu-reasoners-bon] 一次具体的 sampling：sample 一个一个加进来，$N$ 从 1 到 64。实心圆是对的，空心圆是普通的错，空心方块是骗过 verifier 的错；画圈的是分数最高、被选中的那个。下面是上表前两行的 expectation 曲线，点跟着 $N$ 走。

:::wrong 骗过 verifier 的错答案只占很少一部分，所以 best-of-N 基本可靠
在这个 toy model 里，骗过 verifier 的错只占全部 sample 的 3.5%。但 best-of-$N$ 选出来的不是一个随机的 sample，是分数最高的那个，恰好落在 verifier 最容易错的地方：$N=64$ 时被选中的有 37.7% 是它们，$N=1024$ 时是 64.2%。Verifier 好不好，要在被选中的 sample 上量，而且要在实际用的 $N$ 下量；在一个随机抽的 validation set 上量出来的 accuracy 说明不了这件事。Lightman 等人收集 PRM800K 时正是这样做的：优先请人标注当前 PRM 打分很高、但最终答案错的解（论文叫 convincing wrong-answer solutions），他们估计这比均匀地挑解来标省约 2.6 倍的数据。
:::

### ORM 和 PRM：在哪一步打分

上面的 $v$ 只看完整的解，叫 outcome reward model（ORM）。它的 label 便宜（最终答案对不对），但信号粗：一个 10 步的解在第 2 步就错了，ORM 也要等看完才给一个分，而且不说错在哪。Process reward model（PRM）给每一步打分。

Lightman 等人（2023，OpenAI，Let's Verify Step by Step）请人逐步标注 MATH 的解：每一步标 positive（对且合理）、negative（错或不合理）或 neutral（有歧义），PRM800K 一共 80 万个 step label，来自 1.2 万道题的 7.5 万个解。在 500 道留出的 MATH test 题上，每题从 1860 个 sample 里挑：ORM 做对 72.4%，PRM 78.2%，majority vote 69.6%。

人工标注贵，JHU 的 slides 指出 step 的空间太大，标不过来。Math-Shepherd（Wang 等人，ACL 2024）把 label 换成可以自动算的东西。它把一步的质量定义为“这一步推出正确答案的潜力”：从第 $t$ 步的 prefix 出发，用一个 completer model 往下采 $N$ 个 completion（论文用 LLemma-7B，$N=8$），看最终答案对了几个，

$$y^{\text{SE}}_{t}=\frac1N\sum_{j=1}^N\mathbb 1\big[a_j=a^*\big],\qquad y^{\text{HE}}_{t}=\mathbb 1\big[\exists j:\ a_j=a^*\big]$$

SE 是 soft estimation，HE 是 hard estimation。Snell 等人的 PRM 也是这样训的：每一步 16 个 Monte Carlo rollout，用 soft value 当 target、binary cross-entropy 当 loss；他们试过 PRM800K，发现对自己的 PaLM 2 model 基本没用，猜测原因是 PRM800K 的解由 GPT-4 生成，distribution 不同。

这个 label 到底是什么，用 Countdown 算一遍就清楚了。Completion policy 取开头那个随机 policy：在剩下两个数的 3 种合并里均匀地选。

- Prefix “97+96=193”：剩下 193 和 68，三个 completion 是 261、125、13124，一个对。Soft label 是 $1/3$，hard label 是 1。
- Prefix “96−68=28”：剩下 97 和 28，completion 是 125、69、2716，同样是 $1/3$ 和 1。
- Prefix “97−96=1”：剩下 68 和 1，completion 是 69、67、68，都不对。Soft 和 hard 都是 0。

::fig[nyu-reasoners-shepherd] 三个 prefix 和它们的全部 completion。打勾的 leaf 等于 125，soft label 是打勾的比例。

这里 completion 恰好能穷举，soft label 是精确值。一般只能采 $N$ 个，soft label 是一个 binomial 比例的估计：真值为 $1/3$、$N=8$ 时，它的 standard error 是 $\sqrt{(1/3)(2/3)/8}=0.167$。Hard label 在 $N=8$ 时有 $1-(2/3)^8=96\%$ 的 probability 是 1，几乎分不出 $1/3$ 和 1 的 prefix。Math-Shepherd 自己也注意到了：$N$ 越大，hard label 越容易出 false positive。他们用 160 个人工标注的 GSM8K 步骤核对，$N=4$ 时 hard label 的 accuracy 是 86%。

Soft label 估计的量有一个名字。Reward 只在结尾给、对为 1 错为 0 时，“从这个 prefix 出发、按这个 policy 走下去最终成功的 probability”就是 RL 里的 value function $V^\pi(s)$（定义见 [CS4246 第 2 站](../courses/CS4246.html#mdp)）。Snell 的 slides 也是这样说的：Math-Shepherd 式的 PRM 学的是一个 value function。

### 把每一步的分数合成一个分数

拿 PRM 去挑完整的解，还要把每一步的分数合成一个。三篇论文用了三种：

| 合成方式 | 谁用 | 意思 |
|---|---|---|
| 各步分数的 product | Lightman 等人 | “每一步都对”的 probability |
| 各步分数的 min | Math-Shepherd | 最弱的一步决定整个解 |
| 最后一步的分数 | Snell 等人 | 最后一步的 value 已经包含了前面 |

Countdown 的解“97+96=193，193−68=125”：两步的 soft label 是 $1/3$ 和 1，product 是 $1/3$，min 是 $1/3$，last 是 1。用 value function 的读法，最后一步的 value 本来就是“走到这里、最后成功”的 probability，前面的分数是对同一件事更早、更粗的估计。Snell 等人在附录里比较了三种，取最后一步的效果最好。Lightman 的 product 则对应他们的 label 定义（每一步对不对），两种读法在各自的 label 下都说得通。

:::wrong PRM 的分数就是在判断这一步算得对不对
“97−96=1”这一步的 arithmetic 完全正确，Math-Shepherd 式的 label 却是 0，因为它把问题带进了一个凑不出 125 的 state。反过来，这个 label 也依赖 completion policy：换一个更会做题的 policy，同一个 prefix 的 label 会变高。所以 rollout 训出来的 PRM 量的是“从这里走下去还有多大希望”；PRM800K 的 label 问的是“这一步对且合理吗”，在 Lightman 的标准下“97−96=1”算对，只是没用。两种 PRM 拿去做 search，偏好的东西不一样。
:::

:::from
Best-of-$N$ 与 weighted voting 的 formula、$v$ 的几种叫法、完美 verifier 的例子、over-optimization 的叫法，来自 [CMU 11-711 Lecture 22](https://cmu-l3.github.io/anlp-fall2025/static_files/anlp-f2025-22-inference.pdf)（转述）；GSM8K 与 verifier 的训练流程、6B 对 175B、400 个 completion 之后下降及其解释、只让排名靠前的几个投票，来自 [Cobbe 等人的论文](https://arxiv.org/abs/2110.14168)（WebFetch 读正文）；mean log-probability 挑出 44.5% 来自 [Codex 论文](https://arxiv.org/abs/2107.03374) §3.3；PRM800K 的 label 定义、规模、product 打分、best-of-1860 的三个数和 convincing wrong-answer 的主动标注来自 [Let's Verify Step by Step](https://arxiv.org/abs/2305.20050)；SE 与 HE 的 formula、$N=8$、min 合成、86% 和 false positive 的说法来自 [Math-Shepherd](https://aclanthology.org/2024.acl-long.510.pdf)；16 个 rollout、soft value、last-step 合成、PRM800K 无效来自 [Snell 等人的论文](https://arxiv.org/abs/2408.03314) 与 [guest lecture](https://faculty.cc.gatech.edu/~zk15/teaching/AY2025_cs7643_spring/assets/L25_Charlie_Snell_Scaling_TestTime_Compute.pdf)；人工标注太贵来自 [JHU 的 slides](https://self-supervised.cs.jhu.edu/sp2025/files/slides/15-16.inference-scaling.pdf)。课程 [Lecture 7](https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec7.pdf) 第 32 页列了 PRM800K 和 MCTS，转引的是 R1 报告里“没有成功的尝试”一节（第 4 站）。三类 sample 的 toy model、它的全部数字、Countdown 的 label、standard error 和三种合成方式的算例是我设和算的。
:::

## [search] Tree search 与 compute-optimal 的 test-time scaling

:::skip
能在 Countdown 的 tree 上手做一遍 PRM 引导的 beam search，把它和 best-of-$N$、穷举按“生成了多少步”放在一起比，推出 Snell 等人的 FLOPs 互换倍数，并说出 beam search、best-of-$N$、revision 各在什么难度和 budget 下更好，就可以去第 5 站。快速路线可以跳过；A3 用不到这一站，跳过会少掉“search 什么时候值得”的判断。
:::

### 为什么要在步骤上 search

Best-of-$N$ 每一条都走到底才打分。长的解大多在前几步就走错了，后面的 token 白写了。有了 PRM，可以每走一步就评估一次，把没希望的 prefix 砍掉，把 compute 留给有希望的。

Step-level beam search（JHU、CMU 的讲义）：保留 $B$ 个 prefix（beam）；每一步把每个 prefix 扩展出 $M$ 个下一步，用 PRM 给这 $B\cdot M$ 个候选打分，留下最高的 $B$ 个；如此往下，直到写出答案。Snell 等人的写法是给定总数 $N$ 和 beam width $M$：每一轮留下分数最高的 $N/M$ 个 step，每个再采 $M$ 个下一步，最多 40 轮。

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

Beam search 看起来便宜，但表里少算了一项：PRM 的分数从哪里来。如果在 test time 用 rollout 去算，9 个第一步各要把 3 个 completion 算一遍，又是 27 步，合计 42 步，比穷举还贵。Snell 等人比较的 lookahead search 就是这样：每一步先用 temperature 0 往下 roll out $k$ 步，拿 rollout 末端的 PRM 分数来评估这一步，成本是 $N(k+1)$ 个 sample；$k=0$ 时退化成 beam search。他们的结论是 lookahead 一般不如 beam search，原因正是 rollout 太贵。PRM 值钱的地方在于它是一个训练好的 model：rollout 的成本在训练 PRM 时付掉了，test time 一次 forward 就给出分数，把 rollout 的结果 amortize 到了很多道题上。

### Snell 等人：哪种 search 在什么时候好

Snell 等人（2024）用 PaLM 2-S* 在 MATH 上比较了这些方法（train 12k 题、test 500 题，就是 Lightman 等人的划分）。他们先给题目分难度：每题采 2048 个 sample 估计 pass@1，按它把 test 题分成 5 个 quantile（oracle difficulty）；部署时没有标准答案，就改用 verifier 对同样 2048 个 sample 的平均打分来分（predicted difficulty），并在每个难度上做 two-fold cross validation，避免用 test 题调参。Guest lecture 和论文的结论：

- 所有用 verifier 的 search 都胜过 majority vote。
- 简单的题、大的 budget：best-of-$N$ 更好，beam search 出现 over-optimization 的迹象。
- 中等和较难的题、小的 budget：beam search 更好。
- 最难的那一档：所有方法都做不动。
- 每个难度选最好的方法（compute-optimal），最多能少用 4 倍的 test-time compute 达到 best-of-$N$ 的效果（摘要说“more than 4×”，正文第 8 节的说法是 2 到 4 倍）。

第 3 站的 toy model 说明了简单题上 beam search 为什么会 over-optimize。Beam search 每一步都对 PRM 做一次 argmax，相当于把 best-of-$N$ 的选择压力加到每一步上。题目简单时对的路本来就多，多挑几次主要的效果是挑中 PRM 的错（toy model 里 $N$ 从 12 涨到 1024，accuracy 从 0.733 掉到 0.358）；题目难时不挑就几乎找不到对的路，选择压力利大于弊。

Sequential 的版本是 revision：fine-tune 一个 model，让它看着前面几次错的尝试再写一次。训练数据是事后拼出来的：对每道题用较高的 temperature 并行采 64 个回答，每个对的回答前面接上 0 到 4 个错的（个数均匀地抽，按字符的 edit distance 挑和对的回答最接近的错解），只在最后那个对的回答上做 SFT；inference 时 context 里只留最近 4 次 revision。Snell 等人发现大约 38% 的对的答案会在后续 revision 中被改错，所以要用 verifier 在整串 revision 里挑。Sequential 和 parallel 之间存在最佳的比例：简单题偏向多做 revision，难题要两者混合；按难度选比例，同样最多省 4 倍 compute。

### Test-time compute 和 pretraining compute 怎样换

:::skip
这一节是加深。跳过会少掉“什么时候该训大 model、什么时候该让小 model 多想”的定量判断。
:::

Snell 等人最后问：同样的 FLOPs，是训一个大 $M$ 倍的 model，还是让小 model 在 test time 多花 compute？用 pretraining 的 $X=6ND_{\text{pretrain}}$ 和 inference 的 $Y=2ND_{\text{inference}}$（$D$ 是 token 数）。大 model 的总 FLOPs 是 $6MND_{\text{pretrain}}+2MND_{\text{inference}}$；小 model 的 pretraining 是 $6ND_{\text{pretrain}}$，inference 放大 $c$ 倍是 $2NcD_{\text{inference}}$。令两者相等：

$$2NcD_{\text{inference}}=6MND_{\text{pretrain}}+2MND_{\text{inference}}-6ND_{\text{pretrain}}$$

两边除以 $2ND_{\text{inference}}$：

$$c=M+3\,\frac{D_{\text{pretrain}}}{D_{\text{inference}}}\,(M-1)=M+\frac{3(M-1)}{R},\qquad R=\frac{D_{\text{inference}}}{D_{\text{pretrain}}}$$

论文取 $M\approx14$，看三种 $R$：

| $R$ | 场景 | 小 model 的 inference 可以放大 $c$ 倍 |
|---|---|---|
| 0.16 | inference 的量远小于训练 | $14+39/0.16=257.8$ |
| 0.79 | 两者相当 | $14+39/0.79=63.4$ |
| 22 | inference 的量远大于训练（产品上线） | $14+39/22=15.8$ |

$R$ 小时，省下来的 pretraining compute 可以换很多倍的 test-time compute；$R$ 大时几乎换不到什么。论文的结论是两者不能一比一互换：简单和中等的题、或者 inference 量小时，test-time compute 能轻松补上 pretraining 的差距，在小 model 本来就有一定成功率的题上甚至能胜过大 14 倍的 model；难题、或者 inference 量大时，pretraining 更有效。

:::wrong o1、R1 这类 reasoning model 在回答时内部跑着 tree search
JHU 的 slides 说 OpenAI 的方法细节不公开，但从现象推断：RL 训练、test time 写很长的 CoT、inference 时没有显式的 search。DeepSeek-R1 的报告有一节“没有成功的尝试”，Lecture 7 第 32 页专门转引了它。关于 PRM，报告列了三条：很难定义细粒度的“一步”；判断中间一步对不对本身就难，自动标注效果不好、人工标注无法 scale；一旦引入 model-based 的 PRM，就不可避免地被 reward hacking，重新训练 PRM 又让 pipeline 更复杂。关于 MCTS：和象棋不同，token 的生成是一个 exponentially 更大的 search space；value model 难以细粒度地训练；靠 self-search 一轮轮提升 model 仍然很难。这些 model 做的是 sequential 那条路：一次生成一条很长的 trace，trace 里自己尝试、发现走不通、回头换一条。JHU 提到的 Stream of Search（Gandhi 等人，2024）把这件事做得很直接，用的也是 Countdown：把一次带 backtracking 的 search 过程写成一串扁平的 token，拿来训练 model，让它学会在一条序列里 search。摘要报告，在这种 search stream 上训练，比只在最优路径上训练的 search accuracy 高 25%；再用 STaR、APA 这类 policy improvement 方法 fine-tune，能解出 36% 原来解不出的题。Search 没有消失，它被写进了 trace 里。怎样训练出这种 trace，是第 5、6 站的事。
:::

把 search 写进一条 trace 也有代价。Lecture 10 里 Xi Ye 指出，long CoT 和 long context 是同一个计算上的难题：写下一步时，要在一段很长的前文里准确地找回那几个关键的位置（之前的中间结果、走过的分支），而前文里有大量看起来很像的片段。他们的评测用的正是 Countdown：prompt 里写明 search procedure（每次从数集里选两个数，试加减乘除，把结果放回数集，直到凑出 target），附一个照这个 procedure 写出的完整例子，让 model 照样写出整条 search trace。要求写出的 trace 分三档长度，accuracy（%，slide 上的读数）是：

| model | 0.5K token | 2K token | 8K token |
|---|---|---|---|
| Qwen2.5-7B-Instruct | 32 | 36 | 2 |
| Qwen2.5-32B-Instruct | 96 | 87 | 55 |
| R1-Distill-Qwen2.5-32B | 91 | 88 | 51 |
| GPT-4o | 99 | 95 | 67 |

每一步的运算都很简单，难在 8K token 的 trace 里不丢失状态。Slides 的结论是：评测时最好的那些 model，在输出只有 0.5K 到 8K token、整个任务并不算长的情况下，long CoT 的生成也会失败。第 1 站说的 sequential 的成本，除了 FLOPs 和 latency，还有这一项。

:::from
Step-level beam search 的定义、OpenAI 不做显式 search 的推断、Stream of Search 的提法来自 [JHU 的 slides](https://self-supervised.cs.jhu.edu/sp2025/files/slides/15-16.inference-scaling.pdf)（转述），Stream of Search 的 25% 和 36% 来自 [它的摘要](https://arxiv.org/abs/2404.03683)；beam search 的 $N/M$ 写法、lookahead 的定义与成本、PaLM 2-S* 与 MATH 的划分、两种难度、各难度上的比较、4 倍、revision、FLOPs 互换的式子和三个 $R$、两条结论，来自 [Snell 等人的论文](https://arxiv.org/abs/2408.03314)（WebFetch 读正文）和 [guest lecture](https://faculty.cc.gatech.edu/~zk15/teaching/AY2025_cs7643_spring/assets/L25_Charlie_Snell_Scaling_TestTime_Compute.pdf)；R1 的“没有成功的尝试”来自 [Lecture 7](https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec7.pdf) 第 32 页的截图和 [R1 报告](https://arxiv.org/abs/2501.12948) v2 附录 G.2；revision 的训练数据构造和 38% 来自 Snell 等人论文的正文；long CoT 与 long context 的关系、Countdown 的 search procedure 和四个 model 的 accuracy 来自 [Lecture 10](https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec10-xi.pdf) 第 30 到 35 页（表里的数是从 slide 的热力图上读的）。Countdown 上的 beam search、步数表、26 条的计算、互换式的推导步骤和三个 $c$ 是我做的。MCTS 本身（UCT 的 selection、expansion、rollout、backup）在 [CS4246 第 9 站](../courses/CS4246.html#mcts)。
:::

## [rlvr] RLVR：从 expert iteration 到 GRPO 的配方

:::skip
能推出 expert iteration 就是不减 baseline 的 policy gradient，对一个 group 算出 A3 三种 loss_type 的 advantage，能复现 A3 handout 里 masked_mean 与 masked_normalize 的 gradient，能用数字说明 DAPO 为什么放宽 clip 的上界、怎样处理被截断的回复，并说出 base model 的哪些行为决定了 RL 能不能起作用，就可以去第 6 站。快速路线必读，对应 Lecture 6、7 和 A3 §6–8。Policy gradient、baseline、GRPO 的 formula 推导在 [CS336 第 10 站](../courses/STANFORD-CS336.html#align)，这里不重复。
:::

### 为什么从 RLHF 走到 RLVR

Lecture 6、7 先讲 RLHF 的问题。Reward model 是从人的偏好 fit 出来的，Durrett 组自己的研究（Singhal、Goyal、Xu、Durrett，COLM 2024）发现，在公开数据上训练的 reward model 和回复长度强相关；在 WebGPT 的偏好数据上，PPO 带来的 reward 提升有 85% 可以归因于回复变长（Lecture 6 第 55 页；slides 也说现代的数据集更大，这个效应小一些）。PPO 跑久了会 over-optimize，不能一直训下去。这和第 3 站 verifier 被钻空子是同一件事，只是发生在训练里。RLVR 换了一类问题：答案能被检查，reward 就是 1 或 0。Lecture 7 的对照：

| | RLHF | RLVR |
|---|---|---|
| 问题 | chat prompt（“说三种健康生活的方式”） | 数学、代码、agent 任务（“让这个 repo 编译通过并通过 tests”） |
| Reward | model 打分（LLM-as-a-judge） | 1 或 0 |
| 训练数据 | $(x,y^+,y^-)$ | $(x,a)$：题目和标准答案 |
| Algorithm | PPO、DPO | PPO、GRPO |

“1 或 0 不会被钻空子”的前提是 grader 真的可靠，A3 里会直接碰到这一点（第 7 站最后一节）。

### Expert iteration：最简单的 RLVR

Lecture 7 的第一个 algorithm 是 expert iteration，引的是 STaR（Zelikman 等人）：对每道题让 model 生成一个回答，答案对就把 $(x,y)$ 加进 SFT 数据，在这些数据上做 SFT，然后重复。JHU 的 slides 把它写成 EM：E-step 采样并按答案过滤，M-step 在留下的 $Z_{\text{good}}$ 上 maximize likelihood；ReST、ReST-EM、rejection sampling fine-tuning 都是这个做法的变体。

STaR 的论文自己写出了它和 policy gradient 的关系。目标是答对的 expectation：

$$J=\sum_i\mathbb E_{\hat r_i,\hat y_i\sim p_M(\cdot\mid x_i)}\,\mathbb 1\big[\hat y_i=y_i\big]$$

$$\nabla J=\sum_i\mathbb E_{\hat r_i,\hat y_i\sim p_M(\cdot\mid x_i)}\Big[\mathbb 1\big[\hat y_i=y_i\big]\,\nabla\log p_M(\hat y_i,\hat r_i\mid x_i)\Big]$$

$\hat r$ 是 rationale，$\hat y$ 是答案。论文的原话是：indicator function 丢掉了所有没有导向正确答案的 rationale 的 gradient，这正是“过滤”那一步。落到一道题的 $n$ 个 sample 上，只在答对的 $c$ 个上做 SFT，gradient 是

$$\frac1c\sum_{i:\,r_i=1}\nabla_\theta\log\pi_\theta(y_i\mid x)=\frac nc\cdot\frac1n\sum_{i=1}^n r_i\,\nabla_\theta\log\pi_\theta(y_i\mid x)$$

等号成立是因为 $r_i$ 非 0 即 1，右边的 sum 自动只剩答对的项。右边的 $\frac1n\sum r_i\nabla\log\pi$ 正是 reward 取 0 和 1、不减 baseline 的 policy gradient estimate，两者只差 $n/c$ 这个 scale。A3 的 `loss_type="no_baseline"` 做的就是右边。

STaR 还有几处和纯粹的 policy gradient 不同。论文自己指出它对上面的 objective 做了两个近似：采样用 greedy decoding 而不是从 $p_M$ 里采（variance 小，但对 rationale 的 exploration 少）；在同一批数据上走很多步 gradient，而不是每一步都重新采样。此外每一轮都从原始的 pretrained model 重新 fine-tune，而不是在上一轮的 model 上接着训，论文说是为了避免 overfitting。还有 rationalization：只在答对的 sample 上训练，一旦 model 在训练集里再也做不对新题，进步就停了，因为失败的题给不出任何信号；所以对做错的题，把正确答案作为提示让 model 补写 rationale，训练时再把提示去掉。在 CommonsenseQA 上，GPT-J 加 STaR 做到 72.5%（不加 rationalization 是 68.8%），直接 fine-tune GPT-J 是 60.0%，直接 fine-tune 大 30 倍的 GPT-3 是 73.0%。

不减 baseline 的后果是答错的回答 weight 为 0：model 只被往“对的”方向拉，从不被推离“错的”。减去 group 的平均 reward 之后，错的回答拿到负的 weight。拿 $G=8$、只有 1 个答对的 group 算：

| A3 的设置 | 对的那个 | 7 个错的 |
|---|---|---|
| `no_baseline`（advantage 就是 $r$） | 1 | 0 |
| `reinforce_with_baseline`，`use_std_normalization=False` | $1-0.125=0.875$ | $0-0.125=-0.125$ |
| `reinforce_with_baseline`，`use_std_normalization=True` | $0.875/0.3536=2.475$ | $-0.125/0.3536=-0.354$ |

Std 用除以 $G-1$ 的版本：$\sqrt{(0.875^2+7\times0.125^2)/7}=\sqrt{0.875/7}=\sqrt{0.125}=0.3536$。A3 的 `grpo_baselines` 一题比较第一行和第三行，`grpo_group_standard_deviation` 一题比较第二行和第三行。Handout 引 Dr. GRPO 的理由是：除以 std 会让 std 小的题（几乎全对或几乎全错）拿到更大的 weight。

### 全对或全错的 group：DAPO 和 OLMo 3 的两种过滤

所有这些做法共同的一个问题：一道题的 $G$ 个 sample 全错或全对，advantage 全是 0，什么信号都没有。$p=0.02$ 的题，$G=8$ 时只有 $1-0.98^8=14.9\%$ 的 probability 采到至少一个对的，和第 2 站的 pass@k 是同一个式子；$p=0.9$ 的题，8 个全对的 probability 是 $0.9^8=43\%$。

DAPO（Lecture 7 第 41 页）的 dynamic sampling 在训练时过滤：只保留答对个数满足 $0<\big|\{o_i:\text{答对}\}\big|<G$ 的 group，不断补采直到 batch 填满。论文观察到随着训练推进，全对的 group 越来越多，有效的 prompt 越来越少，这是要补采的原因。

OLMo 3 在训练前过滤（Lecture 7 第 46 页）：对每道题用要训练的初始 checkpoint 采 8 个回答（temperature 1.0、top-p 1.0，和 RL 训练时的采样一致），去掉 pass rate 超过 62.5% 的题，也就是 8 个里对了 6 个及以上的。Lecture 7 问：这让你想起哪个技巧？答案就是上一段的 dynamic sampling，只是挪到了训练前、只滤掉太容易的那一头。这个过滤本身也有 noise：真实 $p=0.7$ 的题，8 次里对 6 次及以上的 probability 是 0.552，只有一半多一点会被滤掉；$p=0.5$ 的题也有 0.145 的 probability 被误滤。他们的 32B model 没有重新做离线过滤，沿用 7B 过滤过的数据，再加上 active sampling：只用 group gradient 非零的 sample 填 batch。

Lecture 7 第 47 页给出了 OLMo 3 Think 各阶段的效果（AIME 2025）：只做 SFT 是 57.6，SFT 加 DPO 是 62.7，SFT 加 RLVR 是 62.4，三者都做是 64.2。

### 每个 token 分多少：masked_mean 与 masked_normalize

A3 的 `grpo_microbatch_train_step` 要把 per-token 的 loss 聚合成一个数。Handout 指出，按序列长度平均在大多数代码里是惯例，但 policy gradient 的 estimate 本身（handout 的式 21）里并没有 $1/T$ 这一项。它有一道不做实验、只做分析的题（think about length normalization），用的是 Lambert 的 RLHF 书里的例子：一个 batch 两个回复，分别长 4 和 7 个 token，每个 token 的 probability ratio 都是 1、advantage 都是 2，比较

- `masked_mean`：每个回复在自己的 token 上平均。
- `masked_normalize`：每个回复在自己的 token 上求和，再除以同一个常数（这里取最大生成长度 7）。

Handout 打印出的结果是 masked_mean 给 $[2,\,2]$，masked_normalize 给 $[1.1429,\,2.0000]$：前者是 $8/4$ 和 $14/7$，后者是 $8/7$ 和 $14/7$。对两个回复再取平均、`backward()` 之后，ratio 的 gradient 是

| | 回复 1 的每个 token | 回复 2 的每个 token |
|---|---|---|
| masked_mean | $2\times\frac14\times\frac12=0.25$ | $2\times\frac17\times\frac12=0.1429$ |
| masked_normalize | $2\times\frac17\times\frac12=0.1429$ | $2\times\frac17\times\frac12=0.1429$ |

每一格是 advantage 2，乘以这个 token 的 weight（$\frac14$ 或 $\frac17$），再乘以 batch 平均的 $\frac12$；和 handout 打印的 `ratio.grad` 逐个对得上。

::fig[nyu-reasoners-lennorm] 同样两个回复（4 个和 7 个 token）在两种聚合下每个 token 的 weight。masked_mean 让短回复的每个 token 分到 1/4、长回复分到 1/7；masked_normalize 一律是 1/7。

masked_mean 下每个回复的 weight 总和都是 1，与长度无关，代价是长回复的每个 token 被稀释。乘上 advantage 看：错的回复 advantage 是负的，写得越长，每个 token 受的惩罚越轻，model 被推向把错的回答写长；对的回复反过来偏向短。Lecture 7 的 DrGRPO 一页用图标出了这件事（“shorter correct responses are boosted more, longer incorrect responses are penalized less”），并给出 Dr. GRPO 论文的训练曲线：reward 和 GRPO 几乎一样，错误回答的平均长度却从 GRPO 的约 1.8k token 降到约 1k。masked_normalize 下每个 token 的 weight 一样，没有这个偏向；代价是 gradient 的大小随回复长度变化，长回复多的 batch gradient norm 更大。Handout 让你在 `grpo_length_normalization` 里看 gradient norm 这类稳定性指标，原因在此。

DAPO 的 token-level loss（论文式 12，Lecture 7 第 41 页）把一道题的 $G$ 个回复的全部 token 的 loss 加起来，除以这 $G$ 个回复的 token 总数 $\sum_{i=1}^G|o_i|$，而不是先在每个回复里平均。DAPO 论文给的理由正是上面那件事：按回复平均时，长回复里的 token 对总 loss 的贡献被不成比例地压低，导致 entropy 和回复长度不健康地增长。它和 masked_normalize 一样让同一个 group 里每个 token 的 weight 相同，区别只在除数是这个 group 实际的 token 总数，而不是一个固定的常数。

### 放宽 clip 的上界：DAPO 的 clip-higher

:::wrong PPO 式的 clip 对所有 token 一视同仁，不影响 exploration
Clip 限制的是 ratio $\pi_\theta/\pi_{\text{old}}$（formula 见 [CS336 第 10 站](../courses/STANFORD-CS336.html#align)）。取 $\varepsilon=0.2$ 时，advantage 为正的 token 一次 update 里 ratio 最多涨到 1.2。换成 probability 看，两个 token 的处境完全不同。DAPO 论文的例子：$\pi_{\text{old}}=0.9$ 的 token 上限是 $0.9\times1.2=1.08$，等于没有限制；$\pi_{\text{old}}=0.01$ 的 token 最多涨到 $0.01\times1.2=0.012$。一个低 probability 的 token（比如一个少见、但能引出另一种思路的词），advantage 再大，每轮也只能涨这么一点；高 probability 的 token 却可以一直涨。论文观察到的结果是 policy 的 entropy 随训练迅速下降（entropy collapse）。DAPO 把上下界拆开，$\varepsilon_{\text{low}}=0.2$、$\varepsilon_{\text{high}}=0.28$，于是 0.01 的 token 能涨到 0.0128。A3 要求 log token entropy，它掉得太快就是 exploration 没了的信号。
:::

### 被截断的回复

A3 的 `sampling_max_tokens` 是 1024。写到上限还没写出 `</answer>` 的回复，reward 是 0，和答错一样被推低。如果被截断的大多是“快做对了、只是写得长”，RL 就在惩罚长的 reasoning。DAPO 用了两步：先做 overlong filtering，被截断的 sample 不计 loss；再加 soft overlong punishment，在接近上限的一段里按超出的长度线性扣分：

$$R_{\text{length}}(y)=\begin{cases}0, & |y|\le L_{\max}-L_{\text{cache}}\\[4pt]\dfrac{(L_{\max}-L_{\text{cache}})-|y|}{L_{\text{cache}}}, & L_{\max}-L_{\text{cache}}<|y|\le L_{\max}\\[8pt]-1, & L_{\max}<|y|\end{cases}$$

式子里没有直接写出 $L_{\max}$ 的数，要从训练设置读出来。论文 §4.1 写的是：expected maximum length 设为 16,384 token，另外再分配 4,096 token 作为 soft punish cache，所以生成上限是 20,480。也就是说 $L_{\text{cache}}=4096$，$L_{\max}$ 是生成上限 20,480，不扣分的界 $L_{\max}-L_{\text{cache}}$ 才是 16,384。DAPO 在 verl 里的实现也是这样算的：`expected_len = max_resp_len - overlong_buffer_len`，示例配置写的是 `max_response_length: 20480 # 16384 + 4096`。一个 18,000 token 的回复落在中间一段：$(16384-18000)/4096=-1616/4096=-0.395$；写到 20,480 被截断时正好是 $-1$。因为生成在 20,480 处就停了，第三段 $|y|>L_{\max}$ 实际上碰不到。

::fig[nyu-reasoners-overlong] DAPO 的 soft overlong punishment。16,384 token（expected maximum length）以内不扣分，之后线性扣到生成上限 20,480 处的 $-1$。点是正文里 18,000 token 的例子。

verl 的 DAPO 文档还有一条：论文里包括最好的那个 run 在内的大多数实验，其实没有开 overlong filtering，因为它和 soft overlong punishment 在“怎样从最长的输出里学”上有重叠，所以 verl 没有实现 filtering。

DAPO 论文的 Table 1（Lecture 7 第 42 页）给出了每一项的贡献，Qwen2.5-32B、AIME 2024 avg@32：naive GRPO 是 30，加 overlong filtering 到 36，加 clip-higher 到 38，加 soft overlong punishment 到 41，加 token-level loss 到 42，加 dynamic sampling 到 50；DeepSeek-R1-Zero-Qwen-32B 是 47。训练设置是每题 16 个回答、512 道题一个 batch、learning rate $10^{-6}$。做 A3 时至少要 log 被截断的比例。

### Base model 决定了 RL 能走多远

Lecture 7 引 Gandhi 等人（2025）的结论：RL 只在 base model 已经具备某种能力时才起作用。他们的实验正好是 A3 的任务：同样用 PPO 在 Countdown 上训练 250 步（答对 reward 1、错 0，格式对再加 0.1），Qwen-2.5-3B 到了约 60%，Llama-3.2-3B 只有约 30%。他们让 GPT-4o-mini 数每条 trace 里四种行为出现的次数：verification（系统地检查中间结果）、backtracking（发现错了就明确地换一种做法）、subgoal setting（把问题拆成可以处理的中间目标）、backward chaining（从目标往回推）。Lecture 7 第 37、38 页并排放了两个 model 的回答：Qwen 写“先试最大的两个数之和减最小的……不是 39，再试另一种组合……”，Llama 只写一行答案；Qwen 每条 trace 里 verification 和 backtracking 的平均次数在训练早期分别冲到约 12 次和约 8 次的峰值，Llama 始终几乎为 0。先用含这些行为的例子对 Llama 做一点 SFT（priming）再 RL，Llama 能追上 Qwen；用“行为模式对、但答案错”的例子 priming，效果和用正确答案的相同；只给空 CoT 的 priming，Llama 停在约 30% 到 35%，和不 priming 一样。

这和第 2 站的 pass@k 是同一件事的两面。RL 能提高的是 base model 已经偶尔做对的题（$p>0$）。一个从不 backtrack 的 model 在 Countdown 上很少采到对的 sample，group 全是 0，没有 gradient。用 Countdown 的 tree 来看：第一步走进那 6 个 PRM 分数为 0 的 state 之后，不回头就不可能再凑出 125。RL 之后 pass@k 的变化、random reward 也能涨分的争议，见 [Modern RL 第 6 站](../courses/MODERN-RL.html#finetune)。

:::from
RLHF 与长度（85%）来自 [Lecture 6](https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec6.pdf) 第 55 页；RLHF 的问题、RLHF 与 RLVR 的对照、expert iteration、DrGRPO 的图、DAPO 的 objective 与 Table 1、OLMo 3 的难度过滤与评测表、Gandhi 等人的两个 model 的例子和曲线，来自 [Lecture 7](https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec7.pdf) 第 17 到 47 页（文字和渲染出的图片）；STaR 的 objective、gradient、greedy decoding 与多步 gradient 两个近似、重新 fine-tune、rationalization 的理由和 CommonsenseQA 的数字来自 [STaR 论文](https://arxiv.org/abs/2203.14465)；EM 的写法来自 [JHU 的 slides](https://self-supervised.cs.jhu.edu/sp2025/files/slides/15-16.inference-scaling.pdf)；三种 `loss_type`、std normalization 的理由、式 21 没有 $1/T$、Lambert 的例子和打印出的 gradient 来自 [A3 handout](https://gregdurrett.github.io/courses/sp2026/a3.pdf) §6–8；clip-higher 的例子与 $\varepsilon$ 的取值、dynamic sampling 的条件、token-level loss 的理由、overlong 的 formula、16,384 加 4,096 的 cache 与 20,480 的生成上限、训练设置来自 [DAPO 论文](https://arxiv.org/abs/2503.14476)；$L_{\max}$ 取生成上限的读法按 verl 仓库（[volcengine/verl](https://github.com/volcengine/verl)）的 `verl/workers/reward_manager/dapo.py` 和 `docs/algo/dapo.md` 核对，“最好的 run 没开 overlong filtering”也来自这份文档（git clone 读的原文）；PPO 250 步、reward、约 60% 与 30%、行为的定义与计数方法、空 CoT 的 30% 到 35% 来自 [Gandhi 等人的论文](https://arxiv.org/abs/2503.01307)。Expert iteration 落到 $n$ 个 sample 上的式子、group 的 advantage 表、gradient 表的拆解、OLMo 过滤的误滤 probability、18,000 token 的例子是我算的。
:::

## [distill] Distillation 与 long CoT 的 SFT

:::skip
能推出 SFT on teacher traces 在 minimize 哪个 KL，说出 RL 和 distillation 各自从哪里得到训练信号，能手写 A3 的 `tokenize_prompt_and_output` 的三个输出、用 logsumexp 写出 entropy，并说出 budget forcing 怎样延长或截断 reasoning，就可以去第 7 站。快速路线可以跳过；做 A3 的 SFT 部分（§4）时回来读第三节。
:::

### RL 在小 model 上为什么慢

第 5 站的结论是：RL 只能放大 base model 已经偶尔做对的东西，而且每道题的信号要靠采样碰出来。小 model 做难题时 $p$ 接近 0，大多数 group 没有 gradient。手边如果有一个更强的 model（teacher），可以直接拿它写出的 reasoning 做 SFT：每个 token 都有 target，不需要等 student 自己碰对。这就是 distillation。

DeepSeek-R1 的报告（arXiv v2）做了这个对比，AIME 2024 pass@1：在 Qwen2.5-32B 上直接做大规模 RL（报告里叫 Qwen2.5-32B-Zero）是 47.0，和 QwQ-32B-Preview 的 50.0 相当；用 R1 生成的约 80 万条 sample（约 60 万条 reasoning、20 万条非 reasoning）对同一个 base model 做 SFT，得到 72.6。同一批数据 distill 到不同大小的 model：Qwen 1.5B 28.9、7B 55.5、14B 69.7、32B 72.6，student 越大越好。报告的结论是把大 model distill 到小 model 效果很好。

### SFT on teacher traces 在 optimize 什么

把 teacher 的 distribution 记作 $q(y\mid x)$。在 teacher 的 sample 上做 SFT，loss 的 expectation 是（下面省去 $\mid x$）

$$\mathbb E_{y\sim q}\big[-\log\pi_\theta(y)\big]=-\sum_yq(y)\log\pi_\theta(y)=-\sum_yq(y)\log q(y)+\sum_yq(y)\log\frac{q(y)}{\pi_\theta(y)}=H(q)+\mathrm{KL}\big(q\,\|\,\pi_\theta\big)$$

第二个等号是在 $\log\pi_\theta$ 上加一个 $\log q$ 再减一个 $\log q$。$H(q)$ 和 $\theta$ 无关，所以 SFT 在 minimize forward KL：teacher 会写的每一种 trace，student 都必须给它 probability，否则 $q(y)\log\frac{q(y)}{\pi_\theta(y)}$ 会很大。

RL 的 objective 是在 student 自己的 sample 上算的，distillation 的 sample 来自 teacher。Student 在 teacher 走过的 prefix 上学，到自己生成时，一旦写出 teacher 不会写的 prefix，就进了训练里没见过的 state，这时没有任何 target 告诉它怎么接下去。这是 distillation 的结构性弱点，也是有了 distill 出来的 model 之后还要再做 RL 的一个理由。A3 handout 在 SFT 一节也说，实际训练 reasoning model 时 SFT 常常是 RL 之前的 warm start：SFT 需要带 reasoning trace 的数据，RL 只需要答案；而且即使数据充足，RL 仍能找到比 SFT 数据更好的 policy。A3 本身没有把两步接起来。

### 数据怎么造：OpenThoughts 的几个发现

Lecture 6 的最后一部分讲的是 OpenThoughts（Durrett 是作者之一）：用 QwQ-32B 当 teacher，为一个 7B 的 student 造 reasoning 的 SFT 数据。Pipeline 是收集题目、混合、过滤题目、为每道题生成多个回答（16 个）、过滤回答、选 teacher。几条结论都和直觉相反，slides 和论文的数字是：

- **过滤题目很重要。** 用 LLM 按难度过滤（代码）、按回答长度过滤（数学和科学），比随机挑平均高约 4 到 6 个点；代码题只取最好的两个来源，比混 16 个来源好（平均 41.3 对 36.4）。
- **过滤回答没用。** 把答错的回答去掉、或者用 GPT 验证后再留，都没有胜过“全部保留”（数学平均：不过滤 41.9，GPT 验证 40.0），所以最终的数据没有做回答过滤。
- **最强的 model 不一定是最好的 teacher。** QwQ-32B 在 benchmark 上不如 DeepSeek-R1，当 teacher 却更好（数学平均 44.2 对 41.6）。
- **数据量一直有用。** 最终的 OpenThoughts3 有 120 万条（85 万数学、25 万代码、10 万科学），OpenThinker3-7B 在 AIME 2025 上 53.3，base model Qwen2.5-7B-Instruct 是 8.0；Lecture 6 第 68 页的曲线显示，到 100 万条量级还在涨。

和它相反的一端是 s1（Muennighoff 等人，2025）：只用 1,000 道题。题目从 59,029 道里一步步筛出来：先去掉格式有问题的（剩 51,581），再去掉 Qwen2.5-7B-Instruct 或 Qwen2.5-32B-Instruct 能做对的（剩 24,496），最后按数学分类均匀地取、偏向 reasoning trace 长的，取够 1,000 道、覆盖 50 个领域。在 Qwen2.5-32B-Instruct 上 SFT，16 块 H100 跑 26 分钟。论文的 ablation（AIME24）：随机 1,000 道是 36.7，只看多样性 26.7，只挑最长的 33.3，s1K 是 50.0，用全部 59K 是 53.3 但训练要 394 个 H100 小时，s1K 只要 7 个。两个结果放在一起看：数据量少时，挑哪些题决定了大部分效果；数据量足够大时，量本身还在带来提升。A3 的 `sft_experiment` 问的也是这件事：用 128、256、512、1024 条和全部的 Prime Intellect reasoning trace 分别 SFT，比较 validation accuracy。

### A3 的 SFT：只在 response 上算 loss

SFT 的 loss 只算 response 的部分（为什么不算 prompt，见 [CS4248 第 8 站](../courses/CS4248.html#post)）。A3 的 `tokenize_prompt_and_output` 把这件事落到 tensor 上：prompt 和 output 分别 tokenize 再拼接，然后错开一位得到 input 和 label，再在 label 上标出哪些位置属于 response。设 prompt 是 3 个 token $p_1p_2p_3$，output 是 4 个 token $o_1o_2o_3o_4$，拼起来长 7：

| 位置 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| `input_ids` | $p_1$ | $p_2$ | $p_3$ | $o_1$ | $o_2$ | $o_3$ |
| `labels` | $p_2$ | $p_3$ | $o_1$ | $o_2$ | $o_3$ | $o_4$ |
| `response_mask` | 0 | 0 | 1 | 1 | 1 | 1 |

`input_ids` 是拼接结果去掉最后一个，`labels` 是去掉第一个，所以两者长 6；handout 规定 shape 是 `(batch_size, max(prompt_and_output_lens) - 1)`，batch 里短的要 pad，pad 的位置 mask 为 0。第 3 个位置的 input 是 prompt 的最后一个 token，它要预测的 label 是 response 的第一个 token，所以 mask 从第 3 位开始。

::fig[nyu-reasoners-sftmask] 同一个例子：上一行 input、下一行 label，错开一位；浅色格是 response_mask 为 1 的位置，loss 只在这里算。

`get_response_log_probs` 在每个位置取 label 那个 token 的 log-probability，handout 写作 $\log p_\theta(y\mid x)=\log\big[\mathrm{softmax}(f_\theta(x))\big]_y$：先对 logits 做 `log_softmax`，再按 label 取出对应的一项，不要先 softmax 再取 log。`compute_entropy` 要的是每个位置在整个 vocabulary 上的 entropy，handout 要求用 logsumexp 这类数值稳定的写法。设 logits 为 $z_1,\dots,z_V$，$\log p_i=z_i-\operatorname{logsumexp}(z)$，于是

$$H=-\sum_ip_i\log p_i=-\sum_ip_i\big(z_i-\operatorname{logsumexp}(z)\big)=\operatorname{logsumexp}(z)-\sum_ip_i\,z_i$$

最后一步用了 $\sum_ip_i=1$。$\operatorname{logsumexp}$ 先减 max 再算，不会 overflow。`sft_microbatch_train_step` 把 response 上的 negative log-likelihood 用 `masked_normalize` 加起来除以常数（handout 说保持 1.0 也可以），再除以 gradient accumulation 的步数，然后 `backward()`。

### Long CoT 的长度：budget forcing

s1 的另一半是在 decoding 时控制 reasoning 的长度，叫 budget forcing。要压短时，到预算就强行插入结束 reasoning 的 delimiter，可以再接上“Final Answer:”，让 model 交出当前最好的答案。要拉长时，在 model 想结束 reasoning 的地方把 delimiter 压掉，接上“Wait”，它常常会回头检查、改掉错误。s1-32B 不加干预时 AIME24 是 50.0，接两次“Wait”是 53.3，一路拉到约 7,320 个 thinking token 时是 57%；接到六次左右曲线就平了，论文还提醒，压 delimiter 压得太频繁，model 会陷入重复的 loop。论文也比较了 parallel：Qwen2.5-32B-Instruct 用 majority vote 采到 64 个，也追不上 s1-32B 用 budget forcing 的 sequential scaling。

这就是第 1 站 sequential 的那条路，而且是一个可以连续调节的旋钮。它的局限在于只是从外面打断或延长，model 自己不知道预算。L1（Aggarwal 与 Welleck，2025）把预算写进 prompt，在题目后面接一句“Think for $n_{\text{gold}}$ tokens.”（训练时 $n_{\text{gold}}$ 在 100 到 4000 之间均匀地抽），再用 RL 训练。L1-Exact 要求长度正好命中预算，reward 是
$$r=\mathbb 1\big[y=y_{\text{gold}}\big]-\alpha\,\big|n_{\text{gold}}-n_y\big|,\qquad \alpha=0.0003$$
$n_y$ 是实际生成的长度。答对但长度差 1,000 个 token，reward 是 $1-0.3=0.7$；差超过 $1/\alpha\approx3{,}333$ 个 token，答对的 reward 就降到 0 以下，不如一个长度刚好的错答案（reward 0）。L1-Max 只要求不超过预算，reward 是 $\mathbb 1[y=y_{\text{gold}}]\cdot\mathrm{clip}\big(\alpha(n_{\text{gold}}-n_y)+0.5,\,0,\,1\big)$：答错一律是 0，答对时超出不多仍有正的 reward。他们从 DeepScaleR-1.5B-Preview 出发，在 512 和 1,024 token 的预算下比 s1 的 budget forcing 高 20 到 25 个百分点。

:::wrong Distill 出来的 student 学会了 teacher 的 reasoning，所以和 teacher 一样可靠
两组证据都指向另一边。OpenThoughts 发现把 teacher 答错的回答留在 SFT 数据里，结果并不比去掉差；Gandhi 等人发现用“行为模式对、答案错”的 trace 做 priming，之后 RL 的效果和用正确 trace 相同。SFT 主要传下去的是写法和行为模式：什么时候检查、什么时候回头，而不是每一步算对。这些行为用在哪里、用多少、检查有没有真的发现错误，SFT 不保证；加上前面说的，student 到了 teacher 没走过的 prefix 就没有 target。所以 distill 出来的 model 要和任何 model 一样重新评测，而且除了 accuracy，还要看 reasoning 长度的 distribution（s1 已经看到了重复 loop）。
:::

:::from
Distillation 一节的数字（47.0、50.0、72.6、80 万条及其构成、四个 student 的分数）来自 [DeepSeek-R1 报告](https://arxiv.org/abs/2501.12948) v2 的附录 Table 15、16；OpenThoughts 的 pipeline、“过滤回答没用”“QwQ 是更好的 teacher”“数据量一直有用”来自 [Lecture 6](https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec6.pdf) 第 65 到 68 页，具体数字来自 [OpenThoughts 论文](https://arxiv.org/abs/2506.04178)；s1 的筛选过程、ablation、成本、budget forcing 的两个方向、50.0 到 57%、重复 loop、和 majority vote 的比较来自 [s1 论文](https://arxiv.org/abs/2501.19393)；SFT 是 RL 的 warm start、`tokenize_prompt_and_output` 的 shape、log-probability 的 formula、`compute_entropy` 用 logsumexp、`sft_microbatch_train_step` 和 `sft_experiment` 来自 [A3 handout](https://gregdurrett.github.io/courses/sp2026/a3.pdf) §4；L1 最早从 [CMU 11-711 Lecture 22](https://cmu-l3.github.io/anlp-fall2025/static_files/anlp-f2025-22-inference.pdf) 读到，prompt 的写法、两个 reward 式子、$\alpha=0.0003$、$\delta=0.5$、DeepScaleR 和与 s1 的比较来自 [L1 论文](https://arxiv.org/abs/2503.04697)（WebFetch 读正文），1,000 token 和 3,333 token 的算例是我算的；Gandhi 等人见第 5 站。Forward KL 和 entropy 的推导、tokenize 的表是我写的。
:::

## [eval] Evaluation 的陷阱：noise、contamination 与 parsing

:::skip
能算出一个 benchmark 分数的 standard error，做 paired 的比较和 power analysis，把 variance 分解成“抽到哪些题”和“每题的 sampling”，说出 multiple testing 和 contamination 怎样让分数虚高，并能把 A3 的 math_baseline 里 model 的错和 parser 的错分开，就读完了这门课。快速路线必读，对应 Lecture 11 和 A3 §3。
:::

### 一个分数有多少 noise

Lecture 11 的问法：25% 对 23%，在 10,000 道题上和在 100 道题上意思完全不同。把 test set 看成从题目的 distribution 里抽出的 $n$ 道题，每题对或错，accuracy $\bar s$ 的 standard error 是

$$\mathrm{SE}=\sqrt{\frac{\bar s(1-\bar s)}n},\qquad \text{95\% 区间}=\bar s\pm1.96\,\mathrm{SE}$$

Lecture 11 的例子：$n=100$、$\bar s=0.6$，$\mathrm{SE}=\sqrt{0.24/100}=0.049$，95% 区间约为 $\pm1.96\times0.049=\pm9.6$ 个百分点。Lecture 11 用 bootstrap 来算这个区间，不依赖 normal approximation：对 test set 有放回地重抽 $n$ 道题，算一次 accuracy，重复 10,000 次，取 2.5% 和 97.5% 的 quantile。

CMU 11-711 的 evaluation notebook 用一个模拟把这件事摆到眼前：两个 model 在 HumanEval 的 164 道题上真实 accuracy 都是 0.86，一次模拟出来的分数却是 0.841 和 0.890，差了 4.9 个点。区间分别是 (0.786, 0.897) 和 (0.842, 0.938)。不配对地检验：差的 SE 是 $\sqrt{0.0285^2+0.0244^2}=0.0375$，$z=0.0488/0.0375=1.30$，two-sided p 值 0.194。两个一样好的 model，在 164 道题上差出 5 个点并不稀奇。

::fig[nyu-reasoners-ci] 真实 accuracy 为 50% 时，95% 区间的半宽随题数 $n$ 的变化。AIME 一年 30 道题是 ±17.9 个点，MATH-500 是 ±4.4，GSM8K 的 1,319 道 test 题是 ±2.7。

### 两个系统比较要 paired

两个系统做的是同一组题，它们在哪些题上对、哪些题上错高度相关。Paired 的比较对每道题取差 $d_i=s_{B,i}-s_{A,i}$，再看 $d$ 的平均。Miller 的 Adding Error Bars to Evals（CMU 的 notebook 就是照它写的）把两种 variance 并排写出来：

$$\mathrm{Var}_{\text{unpaired}}=\frac{\mathrm{Var}(s_A)+\mathrm{Var}(s_B)}n,\qquad\mathrm{Var}_{\text{paired}}=\frac{\mathrm{Var}(s_A)+\mathrm{Var}(s_B)-2\,\mathrm{Cov}(s_A,s_B)}n$$

两个系统越相关，paired 的 variance 越小。Lecture 11 的 paired bootstrap：每次重抽同一组题，同时算两个系统在这组题上的 accuracy，记录差 $\delta'$。

Lecture 11 用 10 道题说明它：一个系统的对错是 0 0 1 0 0 1 1 1 1 1（6 道），另一个是 0 0 0 0 1 0 0 1 1 1（4 道）。逐题比较，前者独对 3 道、后者独对 1 道、其余 6 道两者一样。Slides 的文字说 System 2 在多数重抽中都赢，但按列出的数据，做对更多的是第一行（6 对 4），下面按数据算：更好的那个在多数重抽中都赢，p 值却只有约 0.21。精确算：一次重抽 10 道，每次抽中“前者独对”“后者独对”“一样”的 probability 是 0.3、0.1、0.6，$\delta'$ 由三类各抽中几次决定，枚举全部组合，前者不比后者好（$\delta'\le0$）的 probability 是 0.212，和 slides 的 0.21 对得上。Slides 上写的检验规则是另一个版本：先把 $\delta'$ 减去观察到的差 $\Delta=0.2$，相当于把 null hypothesis 搬到 0，再数 $\delta'-\Delta>\Delta$ 的比例，同样的数据得 0.091。两种算法都大于 0.05。

::fig[nyu-reasoners-paired] Lecture 11 的 10 道题。上面是两个系统逐题的对错，浅色列是只有一方做对的题。下面是 paired bootstrap 下 $\delta'$ 的精确 distribution：深色部分是 $\delta'\le0$（0.212），描边部分是 $\delta'>2\Delta=0.4$（0.091）。

:::wrong 两个系统的 95% 区间重叠，说明差别不显著
Lecture 11 的例子：系统 1 是 60%，区间 (50%, 70%)；系统 2 是 65%，区间 (55%, 75%)。区间重叠，但不能就此下结论。构造一个具体的情形：100 道题，系统 2 在系统 1 做对的 60 道上全对，另外多做对 5 道，没有一道是反过来的。分别 bootstrap，区间是 (0.50, 0.70) 和 (0.56, 0.74)，重叠。Paired bootstrap 每次重抽 100 道，每次有 5% 的 probability 抽中那 5 道之一：系统 2 不比系统 1 好，只有一次都没抽中时才发生，probability 是 $(95/100)^{100}=0.0059$；按 slides 的规则数 $\delta'>2\Delta=0.10$，也就是抽中超过 10 次，probability 是 0.0115。两种算法的 p 值都远小于 0.05，差别是可信的。
:::

```python
import numpy as np

def paired_bootstrap(a, b, B=10_000, seed=0):
    """a、b：两个系统在同一组题上的对错（1/0），顺序一致，b 是分数高的那个。
    返回两个 p 值：Lecture 11 的规则（差超过观察到的差的两倍），
    以及重抽后 b 不比 a 好的比例。"""
    rng = np.random.default_rng(seed)
    a, b = np.asarray(a), np.asarray(b)
    delta = int(b.sum() - a.sum())                     # 用“多做对几道”计，全是整数
    idx = rng.integers(0, len(a), size=(B, len(a)))   # 每行是一次重抽
    d = b[idx].sum(axis=1) - a[idx].sum(axis=1)
    return (d - delta > delta).mean(), (d <= 0).mean()
```

差值用题数而不用 accuracy 来比，是为了躲开 floating point：用 `mean()` 时，10 道题里“多对 4 道”算出来的 $\delta'$ 有时是 0.39999…，有时是 0.4000…1，而 $2\Delta$ 算出来也不正好是 0.4，严格的 `>` 就会把一部分 $\delta'=2\Delta$ 的重抽算进去。照 accuracy 写的版本在 Lecture 11 的 10 道题上会返回约 0.213，而不是 0.091；上面的版本（seed 0）返回 0.091 和 0.217，100 道题的构造返回 0.011 和 0.006，和精确值一致。

CMU 的 notebook 里 paired 的那一格算出了 $p=1.84$：差是 $0.841-0.890$，$z$ 是负的，代码直接写了 `2*(1-norm.cdf(z))`。Two-sided 的 p 值要用 $|z|$：$z=-0.0488/0.0344=-1.42$，$p=2\big(1-\Phi(1.42)\big)=0.156$，比不配对的 0.194 小，但仍不显著。

### 要多少道题：power analysis

Lecture 11 问：两个系统差 5%，需要多大的 test set？只要求区间不重叠，答案会偏小，因为真有差别时，一次实验也有一半的机会没测出来。Power analysis 同时控制两种错：显著性水平 $\alpha$（没有差别却说有）和 power $1-\beta$（有差别时能测出来的 probability，通常取 0.8）。Miller 的式子（CMU 的 power notebook 照抄）是

$$n=\frac{(z_{\alpha/2}+z_\beta)^2\,\omega^2}{\delta^2}$$

$\delta$ 是想测出的最小差别，$\omega^2$ 是逐题差 $d_i$ 的 variance。不配对、accuracy 在 50% 附近时 $\omega^2\approx2\times0.25=0.5$；$\alpha=0.05$、power 0.8 时 $z_{\alpha/2}=1.96$、$z_\beta=0.84$，

$$n=\frac{(1.96+0.84)^2\times0.5}{0.05^2}=\frac{7.85\times0.5}{0.0025}=1570$$

配对时两个系统高度相关，$\omega^2$ 小得多。Miller 的例子取 $\omega^2=1/9$、$\delta=0.03$，得 $n\approx969$，他据此建议新的 eval 至少要有约 1,000 道题；CMU 的 notebook 用相关系数 0.8 模拟出 $\omega^2\approx0.116$，要测出 2 个点的差需要 2,279 道，1 个点需要 9,115 道。AIME 的 30 道题离这些数差得很远。

### Reasoning model 的分数还多一层 noise

Reasoning model 用 temperature 采样，同一道题跑两次结果可能不同。DeepSeek-R1 报告里的 pass@1 就是这样算的：每题用 temperature 0.6、top-p 0.95 采 $k$ 个回答（AIME 取 $k=64$），pass@1 $=\frac1k\sum_{i=1}^kp_i$，即每题的平均 accuracy。分数的 variance 来自两处：抽到了哪些题，以及每道题的 sampling。设第 $j$ 题的真实 accuracy 是 $p_j$，每题采 $m$ 次取平均（常写作 avg@m），这道题的得分记作 $\bar r_j$。给定题目，$\mathbb E[\bar r_j\mid j]=p_j$，$\mathrm{Var}(\bar r_j\mid j)=p_j(1-p_j)/m$。题目本身也是随机抽的，由 law of total variance，

$$\mathrm{Var}(\bar r_j)=\mathrm{Var}_j\big(\mathbb E[\bar r_j\mid j]\big)+\mathbb E_j\big[\mathrm{Var}(\bar r_j\mid j)\big]=\mathrm{Var}_j(p_j)+\frac1m\,\mathbb E_j\big[p_j(1-p_j)\big]$$

$n$ 道题独立，平均分的 variance 再除以 $n$。这正是 Miller 文中的分解。

算一个 AIME 的例子：30 道题里 15 道 $p_j=0.9$、15 道 $p_j=0.1$，平均 0.5。$\mathrm{Var}_j(p_j)=(0.9-0.5)^2=0.16$，$\mathbb E_j[p_j(1-p_j)]=0.9\times0.1=0.09$。

| $m$ | 题目固定时的 SE（只剩 sampling） | 题目也随机时的 SE |
|---|---|---|
| 1 | $\sqrt{0.09/30}=5.5$ 个点 | $\sqrt{(0.16+0.09)/30}=9.1$ 个点 |
| 16 | $\sqrt{0.09/16/30}=1.4$ 个点 | $\sqrt{(0.16+0.09/16)/30}=7.4$ 个点 |
| 64 | 0.7 个点 | 7.3 个点 |

多采几次只能消掉第二项。“在这 30 道题上谁更好”可以靠 avg@64 说得很准；“在 AIME 这一类题上谁更好”，30 道题的限制谁也绕不过去。读论文时要分清它报的 ± 是哪一种。Miller 还特别提醒：不要靠调低 temperature 来减小 variance，那改变的是被评测的 model 本身。

### Multiple testing

Lecture 11 的问法：试 20 组 hyperparameter，其中一组的提升“显著”。每组都用 0.05 的标准，即使没有一组真的更好，至少一组显著的 probability 是 $1-0.95^{20}=0.64$。Slides 用 xkcd 的 jelly bean 漫画说明：测了 20 种颜色，绿色那一种 $p<0.05$，于是上了新闻。Bonferroni correction 把标准除以检验的次数，20 次就是 $0.05/20=0.0025$。Lecture 11 还讲了 file drawer effect：如果 20 个研究者各做一次，19 个没结果、不发表，发表出来的那一个用不着做任何 correction，看起来干干净净，其实就是那个 false positive。RL 的实验 variance 大，A3 的 learning rate sweep、各种 ablation 都在做多次比较，同一个结论最好在不同 seed 上重复。

### Contamination

Lecture 11 把 contamination 分成三种：benchmark 的题出现在 pretraining 数据里；连同答案出现在 post-training 数据里；出现在 RL 的题库里。分数本身看不出虚高了多少。

**重新出题。** GSM1k（Zhang 等人，2024）请人按 GSM8K 的风格和难度重新出了 1,205 道题，没有用任何 language model 帮忙，人的解题率、解题步数、答案大小等指标都与 GSM8K 对齐；为了不被污染，数据集暂不公开。比较 model 在两套题上的分数（5-shot，取回答里最后一个数）：差得最多的是 Yi-6B-Chat，8.0 个点，其后有用 Math-Shepherd 的 PRM 做过 RL 的 Mistral-7B（7.2）和 phi-2（6.3）；GPT-4o、GPT-4-Turbo、Gemini 1.5 Pro 的差都在 1 个点以内，Claude 3 Opus 在 GSM1k 上反而高 2.2。一个 model 生成 GSM8K 原题的 per-character log-likelihood 越高，它的分差越大（Spearman 相关系数 0.36，$p=0.03$），但作者认为 contamination 可能不是全部原因。

**看顺序。** Oren 等人（2024）只用 model 的 log-likelihood 检测（Lecture 11 第 57 到 59 页）。如果一个 benchmark 被原样放进过训练数据，model 会记住题目的排列顺序。题目本来是 exchangeable 的，任何顺序的 likelihood 应该差不多；按原始顺序排的 likelihood 显著高于打乱后的顺序，就说明见过。他们的 sharded rank comparison test：把题目分成 $r$ 个 shard，每个 shard 算原始顺序的 log-likelihood，减去 $m$ 个随机 permutation 下的平均，得 $s_i$，再对 $s_i$ 的平均做 one-sided t-test。他们自己从头训了一个 1.4B 的 model，在 Wikitext 里故意插入 benchmark：只插入 1 次的（BoolQ、HellaSwag、OpenbookQA），p 值是 0.099 到 0.544，测不出来；插入 10 次及以上的，p 值都小到 $10^{-11}$ 以下。

Lecture 11 留了一个问题：它测不到什么？上面的表已经给了一部分答案：只见过一次的测不出来。再按原理推（这是我的推断）：题目被打乱顺序后才进入训练数据、被改写过、或零散地混在别的文本里，顺序的信号就没有了。所以它能给出“见过”的证据，不能给出“没见过”的证据。

**训练数据要去重。** 造训练数据的人也要反过来防 contamination。OpenThoughts 对每个 benchmark 做 decontamination：按归一化 LCS 的相似度超过 75%，或者 13-gram 重叠，就删掉；在一个人工构造的测试集上，3,092 个污染样本漏掉了 12 个。MATH-500 本身也有一段来历：Lightman 等人为了扩大 PRM 的训练集，把 MATH 的 5,000 道 test 题里的 4,500 道并进了训练数据，只均匀随机地留下 500 道做评测。用 PRM800K 一类数据训练过的 model，在完整的 MATH test 上就是被污染的。

### 答案解析：model 错还是 parser 错

A3 的第一题（`math_baseline`）就是这件事。Grader `question_only_reward_fn` 只认回复里的最后一个 `\boxed{...}`：找不到 `\boxed`，format reward 和 answer reward 都是 0；找到了，再用 mathd 的 normalization 和 sympy 判断它与标准答案是否相等（handout 的例子是 $1/2$ 和 $0.5$ 要算相等），不相等就是 format 1、answer 0。Handout 要你把 500 道 MATH test 题的结果分成三类（format 1 且 answer 1，format 1 且 answer 0，format 0），后两类各至少看 10 个，判断是 model 的问题还是 parser 的问题。

从 grader 的代码可以读出几种会误判的情形：

- 答案写在 `\boxed` 外面（“the answer is 5”），format 是 0，但 model 其实做对了。这是 parser 的错，换 prompt 或换 grader，分数都会变。
- 回复里有不止一个 `\boxed{}`（先给一个、后来又改），grader 只取最后一个。
- 同一个文件里的 `r1_zero_reward_fn` 是给 R1 格式用的，它要求回复里恰好出现 `</think> <answer>`（中间一个空格），格式稍有不同，整条回复的 format 就是 0。

Lecture 7 的最后一节讲的也是这件事：prompt 的格式是 reasoning model 的关键组成，答案的格式各家不同（OpenThoughts 在“**Final Answer**”一行里用 `\boxed{}`，R1 用 `<answer>` tag），A3 会让你看到 parsing error 造成了多少问题。GSM1k 的做法是取回答里最后一个数，和示例格式不符的一律判错；作者用人工标注做了一次 ablation，结论没有大变。

:::edge Format 也是 reward
RL 拿同一个 grader 当 reward 时，parser 的偏好会被训练进 model。`question_only_reward_fn` 对“格式对、答案错”给 format 1、reward 0，代码注释写明这样做是为了防止 hacking：如果格式对就给一部分 reward，model 会先学会只写格式。Gandhi 等人在 Countdown 上就给了 0.1 的 format reward（第 5 站）。所以 A3 要求分别 log format reward 和 answer reward：训练前期 total reward 在涨，先要确认涨的是哪一个。
:::

:::from
Accuracy 与 baseline、$n=100$、$\bar s=0.6$ 的例子和“检测 5% 的差需要多大的 test set”的问题、bootstrap、paired bootstrap 的算法和两个例子（(50%, 70%) 对 (55%, 75%)、10 道题 p 约 0.21）、multiple testing、jelly bean、Bonferroni、file drawer effect、contamination 的三种、Oren 等人的方法与 Table 1、“它测不到什么”的问题，来自 [Lecture 11](https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec11.pdf)（逐页读了文字，第 27、57 到 59 页看了图）；HumanEval 的模拟和 power analysis 来自 CMU 11-711 的 `13_evaluation/errorbars.ipynb` 与 `14_experimental/power.ipynb`（[cmu-l3/anlp-fall2025-code](https://github.com/cmu-l3/anlp-fall2025-code)）；paired 的 variance、$K$ 次采样的分解、969 题、“不要调低 temperature”来自 [Miller, Adding Error Bars to Evals](https://arxiv.org/abs/2411.00640)；R1 的 pass@1 定义来自 [R1 报告](https://arxiv.org/abs/2501.12948) 附录 D.1；GSM1k 来自 [论文正文](https://arxiv.org/abs/2405.00332)；OpenThoughts 的 decontamination 来自 [论文](https://arxiv.org/abs/2506.04178)；MATH-500 的来历来自 [Let's Verify Step by Step](https://arxiv.org/abs/2305.20050) 附录 C；`math_baseline` 的三类来自 [A3 handout](https://gregdurrett.github.io/courses/sp2026/a3.pdf) §3，grader 的行为是我读仓库里的 `drgrpo_grader.py` 得到的。10 道题的精确 p 值（0.212、0.091）、100 道题的构造与两个 p 值、notebook 里 p 值的更正、1570 题、AIME 的 variance 分解和两张图是我算的；Oren 等人方法“测不到什么”的后半段是我的推断。
:::

## 作业

三个作业都公开了 handout，各有 starter repo（`gregdurrett/nyu-llm-reasoners-a1`、`-a2`、`-a3`），带 pytest，`tests/adapters.py` 是把你的实现接到测试上的地方。三个作业都在授权下改编自 Stanford CS336：A1、A2 和 CS336 的 A1、A2 基本相同，A3 对应 CS336 的 A5，多了 SFT、少了 preference alignment。Handout 要求有问题只找 NYU 的课程人员，不要去联系 Stanford 的作者；A1 handout 允许拿 LLM 问底层的编程问题或概念问题，但不许用它直接解题，并建议关掉 IDE 里的 AI autocomplete。

### Assignment 3：Reasoning RL（先做）

**要从零写什么。** 用 vLLM 在 500 道 MATH test 题上测 Qwen2.5-Math-1.5B 的 zero-shot（temperature 0，最多 2048 个 token），把失败分类（第 7 站）；SFT 需要的 `tokenize_prompt_and_output`、`compute_entropy`、`get_response_log_probs`、`masked_normalize`、`sft_microbatch_train_step`（第 6 站），然后在 Prime Intellect 的 reasoning trace 上对 Qwen2.5-Math-1.5B base 做 SFT，数据量取 128、256、512、1024 和全部；GRPO 需要的 `compute_group_normalized_rewards`、`compute_naive_policy_gradient_loss`、`compute_grpo_clip_loss`、`compute_policy_gradient_loss`、`masked_mean`、`grpo_microbatch_train_step` 和完整的 train loop（第 5 站），从 Qwen2.5-Math-1.5B Instruct 出发在 Countdown（10k train、1024 dev、1024 test）上训练，做 learning rate、baseline、length normalization、std normalization 的比较；可选的 off-policy GRPO（一批 rollout 训多个 epoch，用 `grpo_clip`）。只能用 Hugging Face Transformers 载入 model 和做 forward，`Trainer` 这类训练工具不能用。

**做完会什么。** 一个能跑起来的 RLVR training loop，以及第 5 站每个设计选择在真实训练里的样子；SFT 的 data scaling；以及看懂一条 reward 曲线背后是 model 在变好，还是 parser、format 在变。

**时间与算力。** Handout 没有给总时间。分数是 math baseline 8 分、SFT 24 分、GRPO 实现 41 分、GRPO 实验 27 分。实验部分每个 run 要 2 块 GPU（一块跑 policy，一块跑 vLLM）；NYU 的 HPC 在 GPU 利用率低时会杀 job，课程申请到 90 分钟的宽限。vLLM 不支持 Apple Silicon，仓库提供不含 vLLM 的 `pyproject-mac.toml`，handout 说 SFT（§4）和 GRPO（§7）的大部分可以不做 inference，在 Mac 上写和跑单元测试。

**做不了的部分和替代。** 数据是 handout 里一个 Google Drive 链接上的 `nyu-llmreasoners-a3-data-distrib.tgz`（约 40.8 MB），我用 Drive 读到了它的文件信息，说明链接可以访问，内容没有解开看。MATH 在 Hugging Face 上（`hiyouga/math12k`，`evaluate.py` 里直接载入）。免费 Colab 做不了实验：1.5B 的 model 全 parameter 训练，bf16 的 weight 和 gradient 加上 fp32 的 AdamW 两个 state，每个 parameter 12 byte，约 18 GB，超过 T4 的 16 GB，还要另一块卡跑 vLLM（这是我的估算）。可行的路：租两块 GPU 跑缩小版（少一些 step）；或者在一块大卡上把 vLLM 的 `gpu_memory_utilization` 调低，和 policy 放在同一块卡上（我的建议，没有试过）。实现部分和单元测试不需要 GPU，先把 §7 的测试全部跑过，收获已经是这个作业的大半。

**提示。**

- `student/evaluate.py` 里写的是 `from cs336_alignment.drgrpo_grader import ...`，但这个仓库的 package 叫 `student`，直接跑会 import error，要改成 `student.drgrpo_grader`。（仓库）
- Handout 的 starter hyperparameter 彼此对不上：`rollout_batch_size=16`，`train_batch_size=64` 并标注 on-policy，`gradient_accumulation_steps=128`。Handout 紧接着说 on-policy 意味着 `train_batch_size` 等于 `rollout_batch_size`，又要求 assert `train_batch_size` 能被 `gradient_accumulation_steps` 整除，这几个数同时违反了两条。开跑前先改成自洽的：on-policy 时让两个 batch size 相等，再选一个能整除它的 accumulation 步数，并保证 `train_batch_size` 不小于 `group_size`。（handout）
- Handout 的 length normalization 例子调用的是 `masked_normalize(..., constant_normalizer=max_gen_len)`，而 handout 自己的接口和 `tests/adapters.py` 用的参数名是 `normalize_constant`。照抄例子会报错，按 tests 的名字写。（handout、仓库）
- Countdown 的 prompt 要求答案写在 `<answer></answer>` 里，handout 说要让 vLLM 在 `</answer>` 处停止生成。vLLM 的文档写明，`stop` 里的字符串默认不出现在返回的文本中（`include_stop_str_in_output` 默认 False），所以解析时要么自己补上 `</answer>`，要么把这个参数设为 True。`sampling_min_tokens=4` 对应 vLLM 的 `min_tokens`：在生成至少 4 个 token 之前不允许出现 EOS 或 stop token，防止空回复。（handout、vLLM 文档）
- 仓库和 handout 都没有给 Countdown 的 reward function，要自己写：从最后一个 `<answer>` 里取出 expression；prompt 允许“Step X:”的多行写法和单个等式两种格式，两种都要能解析；检查用到的数是给定数字的子集、每个最多一次；expression 用 `ast` 解析、只允许数字和加减乘除，不要对 model 的输出直接 `eval`；除法的结果用一个小的 tolerance 和 target 比较；返回 `reward`、`format_reward`、`answer_reward` 三个键，和 `compute_group_normalized_rewards` 的接口一致。（经验；接口来自 handout）
- `compute_entropy` 用 logsumexp（第 6 站的推导），`get_response_log_probs` 用 `log_softmax` 再按 label 取值；gradient accumulation 时每个 microbatch 的 loss 先除以 `gradient_accumulation_steps` 再 backward；gradient clipping 取 1.0。（handout）
- `pg_loss` 不是真正的 loss，不要拿它当指标；每次 update 要 log 的是 loss、gradient norm、token entropy、off-policy 时的 clip fraction，以及 train 的 total、format、answer 三种 reward。（handout）
- `grpo_clip` 需要 old log-prob，只在 off-policy 时用：生成完、进入 inner loop 之前，在 `torch.inference_mode()` 下算好 `old_log_probs`。（handout）
- 每 5 到 10 步做一次 validation，用足够多的例子。按第 7 站的 SE 算，accuracy 37% 左右时，1,024 道 dev 题的 95% 区间是 ±3.0 个点，只用 128 道是 ±8.4 个点，后者不足以比较 learning rate。（handout；数字是我算的）
- 参考实现用 starter 配置在 Countdown 上约 37% validation accuracy；learning rate sweep 至少要有一个 model 到 30%。明显发散或落后的 run 可以提前停掉。（handout）
- SFT 时调 learning rate 和 batch size，直到 training loss 下降约 40%；每次 rollout 前用 `load_policy_into_vllm_instance` 把最新的 policy weight 载入 vLLM；checkpoint 很大，存到 `/scratch`。（handout）
- 读 rollout 的原文。Handout 要求交 rollout 随训练变化的例子；第 5 站的 Gandhi 等人看的正是 rollout 里有没有 verification 和 backtracking，可以照他们的四种行为数一数。（handout；后半句是我的建议）

### Assignment 1、2：Transformer LM 与 Systems（做过 CS336 的 A1、A2 可以跳过）

**要从零写什么。** A1 是 BPE tokenizer（§2）、Transformer LM（§3，RMSNorm、SwiGLU、RoPE、causal multi-head attention 等）、cross-entropy 与 AdamW（§4）、training loop 与 checkpoint（§5），然后在 TinyStories 上训练、生成、算 perplexity，做 learning rate、batch size 和四组 ablation（去掉 RMSNorm、post-norm、NoPE、SiLU 对 SwiGLU），OpenWebText 是可选的。不能用 `torch.nn`、`torch.nn.functional`、`torch.optim` 里的现成定义，只能用 `nn.Parameter`、container 类和 `Optimizer` 基类。A2 只有单卡的部分：benchmark 与 nsys profiling（`benchmarking_script`、`nsys_profile` 各 10 分）、mixed precision（两题各 5 分）、memory profiling（8 分）、PyTorch attention 的 benchmark 和 `torch.compile` 的对比（各 5 分）、PyTorch 版和 Triton 版的 FlashAttention-2 forward（`flash_forward` 25 分）、用 PyTorch 加 `torch.compile` 写的 backward（`flash_backward` 10 分）和 benchmark（`flash_benchmarking` 15 分）。Handout 的标题是 Systems and Parallelism，但里面没有多卡和 distributed 的题。A2 里 A1 的代码可以用课程给的 `a1-basics/`，也可以通过 `pyproject.toml` 换成自己的。

**做完会什么。** 见 [CS336 的作业一节](../courses/STANFORD-CS336.html)：A1 是一个 LM 从文本到 sample 的每一行代码，A2 是读懂 profiler、写出一个真的更快的 attention kernel。

**时间与算力。** A1：BPE 在 TinyStories 上训练限 30 分钟、30 GB RAM、不用 GPU；基础配置（4 层、16 head、约 1700 万个 non-embedding parameter、处理 3.28 亿个 token）在一块 H100 上约 30 到 40 分钟，各实验按 H100 小时计（learning rate sweep 4 小时、batch size 2 小时、每组 ablation 1 小时），validation loss 的目标是 1.45 以下。没有 GPU 时 handout 建议把 token 数降到 4000 万、目标放宽到 2.00：在 M3 Max（36 GB）上 CPU 1 小时 22 分、MPS 36 分钟，5000 步时 loss 1.80。A2 除了 PyTorch 版的 FlashAttention，都要一块 NVIDIA GPU；Triton 不支持 Mac，要 Linux。Benchmark 的 model 从 small（$d_{\text{model}}=768$、12 层）到 2.7B（2560、32 层），vocabulary 10,000、batch size 4；有的大 model 在长 context 下会 OOM，handout 说如实报告即可。

**做不了的部分和替代。** A1 的 low-resource 配置在免费 Colab 的 T4 上也能跑。A2 没有多卡的要求，单卡就能做完，这是它和 CS336 A2 的主要区别，也是没有多卡时更适合自学的原因。免费 Colab 的 T4 可以调 Triton kernel 的正确性，但 2.7B 的配置会 OOM，benchmark 的数字也不能和别人的 GPU 比（调研时的经验）。

**提示。**

- A1：先在一个 minibatch 上 overfit 到 loss 接近 0；监控 activation、weight、gradient 的 norm；基础配置远超 30 到 40 分钟时，先查 data loading、checkpoint、validation 有没有拖慢训练。BPE 用 multiprocessing 做 pre-tokenization 可以压到 2 分钟以内。（A1 handout）
- A2：CUDA 调用是 asynchronous 的，计时前后要 `torch.cuda.synchronize()`；end-to-end benchmark 先跑 5 步 warm-up，再计 10 步，报 mean 和 standard deviation；用 NVTX range 把 warm-up 从 nsys 的结果里排除。（A2 handout）
- A2：autograder 用 `TRITON_INTERPRET=1` 在 CPU 上模拟 Triton，handout 说这个 interpreter 有 bug；调试用 `tl.device_print`。On-chip 的 $O$、$l$、$m$ 用 fp32 累加，$\tilde P$ 乘 $V$ 之前转成 $V$ 的 dtype；block 的 offset 要乘上 tile size；测试用的维度都是至少 16 的 2 的 power。（A2 handout）
- `flash_backward` 不要求写 Triton：forward 存下 logsumexp $L$，backward 用 recomputation，按 handout 的式 13 到 19（先算 $D$）写成普通的 PyTorch 函数再 `torch.compile`。`flash_benchmarking` 一律用 batch size 1、causal mask，sequence length 从 128 到 65536、head 维度从 16 到 128、bf16 和 fp32 都要扫，要报告用的是哪种 GPU。可选的加速部分如果把 backward 也写成 Triton，handout 建议分两遍算（一遍算 $dQ$，一遍算 $dK$、$dV$），避免 block 之间的 atomic 或同步。更多的提示见 [CS336 A1、A2 的提示](../courses/STANFORD-CS336.html)。（A2 handout）

### Final project（有余力再做）

**要做什么。** 自选一个和 LLM reasoning 有关的题目，可以 2 到 3 人一组。两条路：原创研究（工程型：选任务和数据，改进一个方法；或分析型：把一个问题刻画清楚），或者复现一篇论文（照 ML Reproducibility Challenge 的标准）。交付物是一页 proposal（5 分）、2 到 3 页带初步结果的 check-in（5 分）、6 到 8 页会议论文格式的报告（80 分，从 70 分的基准分往上下调）和 3 分钟的课堂展示（10 分）。Handout 给的方向有四类：capability（评测和改进前沿 reasoner 与 agent）、science（在作业那样的小规模设置里研究 RL、训练、inference）、interpretability、safety。

**做完会什么。** 从提出问题、设计 baseline 到写成一篇论文的完整流程，以及第 7 站的那些统计工具在自己的实验里怎么用。

**时间与算力。** Handout 没有给时间。它明确建议避开高算力的题目：要训练就用很小的 model，要做 prompting 或 reasoning harness 就用最强的 frontier model 或最大的开源 model；课程不提供闭源 model 的费用，但说很多项目花不到 20 美元。

**提示。**

- 让成功不是全有或全无：先定一个很可能达到的目标，再加 stretch goal；即使最终方法没成，也要有能报告的结果和分析，而不只是“代码报错了”。（handout）
- 复现不是把代码重跑一遍：要批判地检查代码是否真的做了论文说的事，可以给它写 unit test；也不要挑一篇 20 行 PyTorch 就能复现的论文。（handout）
- 避开主要靠领域工程的题目（handout 的反例是给博彩市场做 agent），以及在大 model 上做 fine-tuning 或 GRPO 的题目，除非自带算力。（handout）
- 报告结果时用第 7 站的方法：给出 standard error、做 paired 的比较、说明比较了多少组设置。（经验）
