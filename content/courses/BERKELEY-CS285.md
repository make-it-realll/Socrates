---
code: BERKELEY-CS285
evidence: syllabus
evidenceNote: "前沿公开课，没有 NUS 大纲。分站和讲次以 Berkeley CS 185/285 Spring 2026（Sergey Levine）的课表和 slides 为准，作业以 Spring 2026 的 HW1–HW5 handout 为准；Spring 2026 没有公开录像，观看顺序对照 Fall 2023 的 YouTube playlist。Slides 通过抓取工具只读到文字，公式是图片，没有读到，推导是按 slides 的论证顺序自己补全并逐行核对的；Lecture 18（Offline RL Part 2）抓取被拒，用 Fall 2023 Lecture 16 的文字和 HW5 handout 代替。"
exam: "自学没有考试，以作业为主。Spring 2026 课表里有两讲 Midterm Review，说明注册学生有 midterm；各部分的比例主页上没有写。Autograder（Gradescope）和 Modal 的算力额度只对注册学生开放，自学时用 handout 里给的目标数字自查。"
subskills:
  - id: il
    name: Imitation learning：expressive policy 与 goal-conditioned BC
    l3: "能说出 MSE policy 等于固定 variance 的 Gaussian maximum likelihood，并能在两个 mode 的 data 上算出 MSE、逐维 discretization 和 autoregressive discretization 各自给出什么。"
    l4: "能独立写出 flow matching policy 的 training loss 和 Euler sampling，并解释 velocity network 为什么必须以 flow timestep $\\tau$ 为 input。"
    l5: "能对 $\\pm1$ 两个 mode 推出 optimal velocity field 的 closed form，并用 hindsight relabeling 的 random walk 例子说明 goal-conditioned BC 为什么能从 random 的 data 里学出朝向 goal 的 policy。"
  - id: pg
    name: Policy gradient 的 variance：causality、baseline 与 discount
    l3: "能写出 reward-to-go 形式的 policy gradient 和对应的 pseudo-loss，并对一个 Gaussian policy 手算一次 gradient。"
    l4: "能证明 causality（$t'<t$ 的 reward 与 $\\nabla\\log\\pi(a_t\\mid s_t)$ 的乘积 expectation 为 0），并说出 HW2 里两种 discount 写法的差别。"
    l5: "能把 full-return estimator 的 variance 拆成 reward 水平、luck 和其他 action 三部分，并说明 reward-to-go 和 baseline 各去掉了哪一部分。"
  - id: ac
    name: Actor-critic：critic、GAE 与 reparameterization
    l3: "能写出 n-step advantage 和 GAE 的 recursion，并按 recursion 从后往前算出一条 trajectory 的 advantage。"
    l4: "能证明 GAE 等于 $\\sum_l(\\gamma\\lambda)^l\\delta_{t+l}$，说出 $\\lambda=0$ 与 $\\lambda=1$ 的 bias 和 variance，并解释为什么 state-dependent baseline 不引入 bias 而 bootstrapped target 会。"
    l5: "能说清 off-policy actor-critic 的 naive 版本错在哪两处、怎样改成学 $Q$ 并用 reparameterization，并对一个 quadratic $Q$ 算出 score-function 与 reparameterized gradient 的 variance。"
  - id: q
    name: Q-learning 的实际做法：target network、n-step 与 SAC
    l3: "能写出 DQN、Double DQN 的 target，以及 hard 与 Polyak 两种 target network update。"
    l4: "能用两个 next state 的例子说明 residual gradient 为什么学错，能算出 off-policy n-step target 的 fixed point，能推出 Polyak update 的平均 lag。"
    l5: "能推出 tanh-squashed Gaussian 的 log-probability 修正、说明 $[-1,1]$ 上 entropy 的 upper bound 是 $\\log2$，并用它解释 HW3 entropy sanity check 偏高或偏低各意味着什么 bug。"
  - id: trpo
    name: Advanced policy gradient：performance difference、natural gradient 与 PPO
    l3: "能写出 importance-sampled surrogate objective，并说出 trajectory 级 importance weight 的 variance 为什么随 horizon 指数增长。"
    l4: "能证明 performance difference lemma，能由 KL 的 second-order expansion 推出 Fisher information matrix 和 natural gradient 的 step。"
    l5: "能在 LQR 的 $(k,\\sigma)$ 例子上算出 vanilla 与 natural gradient 的方向，并解释同样长度的 step 为什么一个让 KL 变成 100、一个只有 0.02。"
  - id: llm
    name: LLM 上的 RL：KL regularization、GRPO 与 KL estimator
    l3: "能写出 HW4 的 group-relative advantage、GR-REINFORCE loss 和 GRPO loss，并知道 mask 要盖住哪些 token。"
    l4: "能推出 KL-regularized objective 的 optimal policy $\\pi_{\\text{ref}}e^{r/\\beta}/Z$，能证明 $e^\\Delta-\\Delta-1$ 是 KL 的 unbiased、nonnegative estimator。"
    l5: "能说出 group 里 reward 全相同时 gradient 为什么消失、std normalization 怎样改变各 prompt 的权重，并推出把 $k_3$ 当 loss 求 gradient 时实际在 optimize 哪个方向的 KL。"
  - id: mbrl
    name: Model-based RL：planning、model 上的 gradient 与 latent model
    l3: "能写出 random shooting 和 CEM 的步骤，并说明 open-loop plan 和 closed-loop policy 的区别。"
    l4: "能用一个例子算出 open-loop 与 closed-loop 的 value 差，用 Jacobian 连乘解释 backprop through model 为什么 explode 或 vanish。"
    l5: "能说明 model-based value expansion 怎样避开 off-policy n-step 的 bias，以及只用 latent dynamics loss train deterministic encoder 为什么会 collapse。"
  - id: offline
    name: Offline RL：OOD action、policy constraint、IQL 与 FQL
    l3: "能写出 SAC+BC、IQL、FQL 三个 actor loss，并由 reward 取 $\\{-1,0\\}$、$\\gamma=0.99$ 说出 Q 值应该落在什么范围。"
    l4: "能用 linear Q 的例子算出 Q-learning 在 data 外的 max 怎样把 Q 值推到 90，能由 KL constraint 推出 AWR 的 weighted maximum likelihood。"
    l5: "能由 expectile 的 first-order condition 算出 $\\tau\\to1$ 时它趋向 in-support 的 max，说明 IQL 为什么要分开 $V$ 和 $Q$，以及 FQL 为什么要把 flow policy distill 成 one-step policy。"
open:
  - label: "Berkeley CS 185/285 Deep Reinforcement Learning（Spring 2026，Sergey Levine）课程主页与 Lecture 2、3、5、6、7、8、9、10、14、15、16、17 的 slides"
    url: "https://rail.eecs.berkeley.edu/deeprlcourse/"
    note: "全页的分站和每站的论证顺序。抓取工具只给出 slides 的文字，公式是图片没有读到；Lecture 4、11–13、19–25 没有读；Lecture 18 抓取被拒。"
  - label: "CS 185/285 Spring 2026 HW1: Imitation Learning（handout）"
    url: "https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw1.pdf"
    note: "第 1 站 flow matching 的 loss 与 Euler sampling 的写法；作业一节。"
  - label: "CS 185/285 Spring 2026 HW2: Policy Gradients（handout）"
    url: "https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw2.pdf"
    note: "第 2、3 站的 discount 两种写法、n-step advantage、GAE 的 recursion；作业一节。"
  - label: "CS 185/285 Spring 2026 HW3: Q-Learning and Actor-Critic（handout）"
    url: "https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw3.pdf"
    note: "第 4 站 SAC 的各个部件、entropy 的 sanity check；作业一节。"
  - label: "CS 185/285 Spring 2026 HW4: LLM RL（handout）"
    url: "https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw4.pdf"
    note: "第 6 站 group advantage、两种 loss 和 KL estimator 的写法；作业一节。"
  - label: "CS 185/285 Spring 2026 HW5: Offline RL（handout）"
    url: "https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw5.pdf"
    note: "第 8 站 SAC+BC、IQL、FQL 的 loss 和 Q 值 sanity check；作业一节。"
  - label: "CS 285 Fall 2023 课程主页（讲次表）与 Lecture 16: Offline RL Part 2 的 slides"
    url: "https://rail.eecs.berkeley.edu/deeprlcourse-fa23/"
    note: "录像的观看顺序；第 8 站 explicit 与 implicit policy constraint、IQL、CQL 的讲法顺序和“用哪个 algorithm”的建议（只读到文字）。"
  - label: "Schulman et al. 2016, High-Dimensional Continuous Control Using Generalized Advantage Estimation"
    url: "https://ar5iv.labs.arxiv.org/html/1506.02438"
    note: "第 3 站 TD residual、$k$-step estimator、GAE 的 closed form 和 $\\lambda=0,1$ 两端的性质。抓取到全文前 20 万字符，实验部分的具体数字没有读到。"
  - label: "Kostrikov, Nair, Levine 2022, Offline Reinforcement Learning with Implicit Q-Learning"
    url: "https://ar5iv.arxiv.org/html/2110.06169"
    note: "第 8 站的 expectile loss、三个 loss 和 Lemma 1。只读了前 10 万字符，结果表没有读到。"
  - label: "Park, Li, Levine 2025, Flow Q-Learning"
    url: "https://arxiv.org/pdf/2502.02538"
    note: "第 8 站 FQL 的动机、loss、10 步 Euler 和与 IQL、ReBRAC 的对比数字。"
sources:
  - label: "CS 185/285 Spring 2026 的 starter code 仓库（GitHub；只看到目录，README 没有抓到）"
    url: "https://github.com/berkeleydeeprlcourse/homework_spring2026"
  - label: "CS 285 Fall 2023 录像 playlist（YouTube）"
    url: "https://www.youtube.com/playlist?list=PL_iWQOsE6TfVYGEGiAOMaOzzv41Jfm_Ps"
---

先看三次训练。三次都没有报错，代码也都照着 formula 写对了。

**第一次。** 一个 10 步的问题，policy gradient 的 estimate 是 unbiased 的。每次用 4 条 trajectory 估一个 gradient，三次里有一次估出来的方向是反的。

::fig[cs285-pgbatch] 动图，每一帧是一个新的 batch。看下面的点：每个 batch 估出的 $g$ 从 −12 散到 14，true gradient 只有 2.5，24 个点里有 8 个落在 0 的左边。上面是这个 batch 的 4 条 trajectory，$X$ 是 $\sum_t\nabla\log\pi$，$R$ 是 return。第 2 站细讲。

**第二次。** 一个只有 action 0 和 action 1 的 dataset，用 linear Q-function 做 fitted Q-iteration。Q 值从 9 一路涨到 90，最被看好的是 data 里从没出现过的 action 9。真正能拿到的 Q 只有 10。

::fig[cs285-ood] 动图，一轮一轮做 fitted Q-iteration。看彩色 line 右端的圆圈：max 每轮都落在 data 之外的 $a=9$，target 跟着它涨，整条 line 被一轮轮抬高；黑线是只在 data 的 action 里取 max，停在 10。第 8 站细讲。

**第三次。** 用 GRPO train 一个 math 题答对率 23% 的 LLM，每个 prompt 抽 8 个回答。有 12% 的 prompt 上 8 个回答全错，这些 prompt 贡献的 gradient 恰好是 0，不管 loss 写得对不对。

::fig[cs285-grpo] 动图，每一帧换一批 prompt。看涂色的列：8 个回答全错，reward 全是 0，group 里没有比较对象，advantage 全是 0。

RL 里几乎每个 algorithm 都在做同一件事：用 sample 去估一个 expectation，有时是 gradient，有时是 value。出问题的方式只有两种。一种是 sample 太吵，estimate 的 variance 大到方向都不可靠（第一次、第三次）；另一种是 sample 来自一个 distribution，问题却关于另一个 distribution（第二次）。这门课的每一讲都可以读成在对付其中一种。

| 站 | 在估什么 | 麻烦来自 | 办法 |
|---|---|---|---|
| 1 Imitation learning | expert 的 action distribution | multimodal 的 action；test 时的 state 和 goal 与 data 不同 | autoregressive discretization、flow matching、relabeling |
| 2 Policy gradient | $\nabla_\theta J$ | 一条 trajectory 的 return 太吵 | causality、baseline |
| 3 Actor-critic | advantage | Monte Carlo 太吵，critic 有 bias | GAE 在两者之间取舍，reparameterization |
| 4 Q-learning | $Q^*$ | target 跟着自己动；n-step 的 reward 来自旧 policy | target network、double Q、SAC 的 entropy |
| 5 Advanced PG | 新 policy 的 return | data 来自旧 policy | importance sampling、KL constraint、natural gradient |
| 6 LLM RL | outcome reward 的 gradient | group 里 reward 相同时没有信号；reward 不可信 | group baseline、KL 到 reference model |
| 7 Model-based RL | model 里的 return | planner 去 model 错的地方；Jacobian 连乘 | CEM、short rollout、latent model |
| 8 Offline RL | data 之外的 action 的 value | 无法试，Q 在 data 外乱涨 | policy constraint、expectile、FQL |

这一页默认读过 [CS4246](../courses/CS4246.html) 的 MDP、Bellman equation、TD、DQN 和 policy gradient 的基本推导，以及 [RB4301](../courses/RB4301.html) 的 compounding error、DAgger、diffusion policy、action chunking、TD3、SAC 的 objective、PPO 的 clip、learned dynamics 与 MPC。那些内容这里只给链接，篇幅留给 CS285 讲得更深的部分，每站开头的 `:::skip` 写明这一站在“只有十几个小时”的快速路线里是否必读。

Spring 2026 的 slides 是最新的，Fall 2023 有完整录像，两期的讲次编号不同：

| 站 | Spring 2026 slides | Fall 2023 录像 |
|---|---|---|
| 1 | Lecture 2–3 Behavioral Cloning | Lecture 2 |
| 2 | Lecture 5 Policy Gradients | Lecture 5 |
| 3 | Lecture 6 Actor-Critic | Lecture 6 |
| 4 | Lecture 7–8 Value-Based RL、Q-learning in Practice | Lecture 7–8 |
| 5 | Lecture 9–10 Advanced Policy Gradients | Lecture 9 |
| 6 | Lecture 14 LLM RL | 没有对应的一讲，只读 slides |
| 7 | Lecture 15–16 Model-Based RL | Lecture 10–12 |
| 8 | Lecture 17–18 Offline RL | Lecture 15–16 |

:::note 更轻的几条路
同样讲 deep RL 的公开课还有三门，下面的情况取自本站“前沿公开课”的调研条目，这一页没有重新核对。Stanford CS224R（Chelsea Finn，Spring 2026）比 CS285 短，更偏机器人：有 sim-to-real 和 RL for VLAs 两讲，HW2 在 Sawyer 锤钉子这种 sparse reward 的任务上对比 PPO 和 off-policy actor-critic，但作业只支持 Modal。Hugging Face Deep RL Course 是最快的上手路线，每个 unit 一个 Colab notebook，Unit 4 从零写 REINFORCE、Unit 8 照着 CleanRL 从零写 PPO；它已进入 low-maintenance 状态，Unit 7 不能用。OpenAI Spinning Up 的 Intro to RL Part 3 是篇幅最短的 policy gradient 推导，Exercise 2.2 “Silent Bug in DDPG”专门练习找出“能跑、不报错、就是不学”的 bug；它的安装依赖 2018 年的 gym 和 mujoco-py，只支持 Linux 和 macOS。时间只有一两个周末时，先做 Hugging Face 的 Unit 4 和 Unit 8 建立手感，再回到这一页。
:::

## [il] Imitation learning：expressive policy 与 goal-conditioned BC

:::skip
快速路线必读，HW1 直接依赖它。已经读过 [RB4301 的 bc、gen、chunk 三站](../courses/RB4301.html#bc)的，第一小节可以略过。能说出逐维 discretization 为什么错、autoregressive discretization 为什么对，能写出 flow matching 的 loss 并解释 $\tau$ 为什么必须进 network，就可以去第 2 站。
:::

### Behavioral cloning 就是 maximum likelihood

手里有 demonstration $\mathcal D=\{(o_i,a_i)\}$，behavioral cloning（BC）就是

$$\theta^*=\arg\max_\theta\sum_i\log\pi_\theta(a_i\mid o_i)$$

Action 是 discrete 的（Atari 的按键、LLM 的 token），network 输出 logits，$-\log\pi$ 就是 cross-entropy。Action 是 continuous 的，network 输出一个 distribution 的 parameter。最常见的选择是 variance 固定为 $\sigma^2I$ 的 Gaussian，这时

$$-\log\mathcal N\big(a;\mu_\theta(o),\sigma^2I\big)=\frac{\|a-\mu_\theta(o)\|^2}{2\sigma^2}+\frac d2\log(2\pi\sigma^2)$$

第二项和 $\theta$ 无关。所以 HW1 第一部分的 MSE policy（handout 的 Eq. 1）不是一个另起炉灶的 loss，它是“policy 是单个 Gaussian”这一假设下的 maximum likelihood。这个假设决定了它能表示什么：一个以 $\mu_\theta(o)$ 为中心的 bump。MSE 的 minimizer 是 conditional mean $\mathbb E[a\mid o]$，推导在 [RB4301](../courses/RB4301.html#gen)。

BC 和普通 supervised learning 的区别在于 i.i.d. 假设不成立：policy 自己的 action 决定它下一步看到什么 observation。Error 按 $T^2$ 累积、DAgger 怎样把它降到 linear，在 [RB4301 的 bc 站](../courses/RB4301.html#bc)有完整推导。Lecture 3 把“fit expert 也会失败”的原因归成两条：expert 的行为不是 Markovian 的（依赖历史），以及 expert 的行为是 multimodal 的。这一站讲后一条。

### 一维一维地 discretize：为什么可以

设想 demonstration 里的人绕过一个障碍物，从左下绕（action $(-1,-1)$）或从右上绕（action $(+1,+1)$），两种各一半。用 seed 0 抽 200 条，$(+1,+1)$ 占 55.5%。三种 policy class 各给出什么：

| Policy | 学到的东西 | 撞上障碍物的 action $(-1,+1)$、$(+1,-1)$ 或中间 |
|---|---|---|
| MSE（单个 Gaussian） | mean $(0.11,\ 0.11)$ | 100%：输出就在两条路中间 |
| 每一维一个独立的 softmax | $P(a_1{=}{+}1)=P(a_2{=}{+}1)=0.555$ | $0.555\times0.445\times2=49.4\%$ |
| Autoregressive：先 $a_1$，再 $a_2\mid a_1$ | $P(a_2{=}{+}1\mid a_1{=}{+}1)=1$，$P(a_2{=}{+}1\mid a_1{=}{-}1)=0$ | 0 |

::fig[cs285-ar] 同一份 data 下三种 policy 在四个格子上的 probability。逐维独立的 softmax 把 marginal 学对了，却把一半的 mass 放到了 data 里没有的两个角上。

Discretize 本身没有问题，1 维 action 切成 $N$ 个 bin，softmax 能表示这 $N$ 个 bin 上的任意 distribution。问题在 dimension：$d$ 维的 joint 有 $N^d$ 个格子。机器人 arm 的 action 是 7 维，每维 256 个 bin，joint 是 $256^7\approx7.2\times10^{16}$ 个 output，做不出来。逐维独立地 discretize 只要 $7\times256=1792$ 个 output，代价是它只能表示 $p(a_1)\,p(a_2)\cdots p(a_d)$ 这种各维互相独立的 distribution，上表第二行就是这个代价。

Lecture 3 的办法是 autoregressive discretization：一次只 discretize 一维，后面的维以前面已经取定的值为 condition。Slide 问“why does this work?”，答案是 probability 的 chain rule，它对任何 joint distribution 都恰好成立：

$$p(a_1,\dots,a_d\mid o)=p(a_1\mid o)\,p(a_2\mid o,a_1)\cdots p(a_d\mid o,a_1,\dots,a_{d-1})$$

右边每个 factor 都是一维的 distribution，用一个 $N$ 个 bin 的 softmax 就能表示到 bin 的精度。所以 autoregressive 的 policy 除了 binning 之外没有做任何 approximation，output 的个数仍然是 $d\times N$。Sampling 时依次抽 $a_1$、把它喂回去抽 $a_2$，和 LLM 逐个生成 token 是同一个结构，上表第三行的 $P(a_2\mid a_1)$ 正是这样学到的。

:::wrong 每一维的 distribution 都学对了，合起来的 action 就是对的
上表第二行每一维的 marginal 都和 data 一模一样（0.555 对 0.445），可是有 49.4% 的 sample 落在 data 里一次都没出现过的两个角上。Marginal 只描述各维自己，两条路线的区别全在维与维之间的 correlation 里：$a_1=+1$ 时 $a_2$ 一定是 $+1$。逐维独立的 policy 在结构上就丢掉了它。
:::

### Flow matching policy：noise 必须真的被用上

Continuous action 想要多个 mode，常见的思路是给 network 喂一个 noise $z$，希望不同的 $z$ 落到不同的 mode。Lecture 3 指出这里的关键困难：noise 必须真的被 model 用上。直接用 MSE 去 train $f_\theta(o,z)\approx a$ 是不行的。$z$ 和 data 里的 $a$ 互相独立，所以 MSE 的 minimizer 是 $\mathbb E[a\mid o,z]=\mathbb E[a\mid o]$，network 学会忽略 $z$，输出 mean。Training target 必须把每个 $z$ 和某个具体的 $a$ 绑在一起。

Flow matching 的绑法是一条从 noise 到 data 的直线。HW1 的写法（$A_t$ 是 $K$ 步的 action chunk，$A_{t,0}\sim\mathcal N(0,I)$，$\tau\sim U(0,1)$）：

$$A_{t,\tau}=\tau A_t+(1-\tau)A_{t,0},\qquad\mathcal L_{\text{FM}}(\theta)=\frac1B\sum_j\Big\|v_\theta\big(o_t,A_{t,\tau},\tau\big)-\big(A_t-A_{t,0}\big)\Big\|_2^2$$

$A_t-A_{t,0}$ 是沿这条直线走的 velocity。Inference 时从 $A_{t,0}\sim\mathcal N(0,I)$ 出发，用 $n$ 步 Euler 走到 $\tau=1$：

$$A_{t,\tau+1/n}=A_{t,\tau}+\frac1n\,v_\theta(o_t,A_{t,\tau},\tau)$$

Network 学到的是什么？这又是一个 MSE，minimizer 是 conditional expectation：

$$v^*(x,\tau)=\mathbb E\big[A_t-A_{t,0}\ \big|\ A_{t,\tau}=x\big]$$

在最小的例子上把它算出来。Action 是 1 维的，data 里 $a=+1$、$a=-1$ 各一半，记 $s=1-\tau$。给定 $a$，$x=\tau a+s z$ 服从 $\mathcal N(\tau a,s^2)$，两个 mode 的 likelihood 之比是

$$\frac{\mathcal N(x;\tau,s^2)}{\mathcal N(x;-\tau,s^2)}=\exp\Big(\frac{(x+\tau)^2-(x-\tau)^2}{2s^2}\Big)=\exp\Big(\frac{2\tau x}{s^2}\Big)$$

所以 $P(a=+1\mid x)=1/(1+e^{-2\tau x/s^2})$，$\mathbb E[a\mid x]=2P(a=+1\mid x)-1=\tanh(\tau x/s^2)$。又由 $x=\tau a+sz$ 得 $z=(x-\tau a)/s$，

$$a-z=a-\frac{x-\tau a}{s}=\frac{a-x}{s}\qquad\Longrightarrow\qquad v^*(x,\tau)=\frac{\tanh\big(\tau x/(1-\tau)^2\big)-x}{1-\tau}$$

拿它检验一下：$\tau=0$ 时 $v^*=-x$，Euler 一步从任何 $x$ 都走到 0，正是 mean，和 [RB4301](../courses/RB4301.html#gen) 里“一步 flow matching 就是 MSE regression”一致。$\tau$ 接近 1 时，$\tanh$ 里的 argument 被 $(1-\tau)^2$ 放大，$x$ 只要稍微偏正就被推向 $+1$，偏负就被推向 $-1$。这个 field 前期把 sample 往中间收，后期再果断地分开。

用 $n=10$ 步 Euler、2000 个 $z$（seed 0）实际走一遍：全部 sample 落在 $\pm1$ 的 0.1 以内。

HW1 的 tip 说 network 必须以 $\tau$ 为 input。漏掉它会怎样？Network 只看到 $x$，MSE 的 minimizer 变成对 $\tau$ 平均后的 $\bar v(x)=\mathbb E[A_t-A_{t,0}\mid A_{t,\tau}=x]$，其中 $\tau$ 也是 random 的。按 $p(x\mid\tau)$ 加权对 $\tau$ 做 numerical integration：$\bar v(0.25)=0.31$，$\bar v(0.5)=0.53$，$\bar v(1)=-0.08$，$\bar v(2)=-1.88$。它是一个和时间无关的 field，在 0 和 $\pm1$ 附近有 fixed point。同样 10 步 Euler、同样的 2000 个 $z$：

| | 落在 $\pm1$ 的 0.1 以内 | 停在 $\lvert x\rvert<0.5$ |
|---|---|---|
| $v^*(x,\tau)$，network 看得到 $\tau$ | 100% | 0 |
| $\bar v(x)$，network 看不到 $\tau$ | 71.5% | 12.0% |

::fig[cs285-flowtau] 左边 network 知道 $\tau$：前半段收拢，最后几步把每条 path 分到某一个 mode。右边 network 不知道 $\tau$：它只能用一个平均的 field，从 0 附近出发的 path 走完整段时间也没离开中间。

原因在 0 附近。真正的 field 在 $\tau=0.9$ 时于 $x=0$ 处的 slope 是 $\tau/(1-\tau)^3-1/(1-\tau)\approx890$，$x$ 离 0 一点点就被放大成一整个 mode；平均之后的 $\bar v$ 在 0 附近的 slope 只有 1.3，从 $z=0.05$ 出发，10 步 Euler 走完只到 0.17；同一个起点用 $v^*$ 走，最后落在 1.00。Flow timestep 告诉 network“现在是该收拢还是该分开”。

Action 换成 $K$ 步的 chunk 时，上面每个量都换成 $K\times2$ 维的 vector，推导不变。为什么要一次输出一个 chunk，见 [RB4301 的 chunk 站](../courses/RB4301.html#chunk)。

:::wrong 把 noise 喂进 network，policy 就是 stochastic 的，自然能表示多个 mode
只把 $z$ 当 input、用 MSE 去 fit dataset action，$z$ 和 $a$ 独立，minimizer 是 $\mathbb E[a\mid o]$：对上面 $\pm1$ 的 data，每个 $z$ 都输出 0，policy 是 deterministic 的，而且正好落在两个 mode 中间。Stochastic 的 input 不等于 stochastic 的 output。Flow matching 之所以能用上 noise，是因为 target $A_t-A_{t,0}$ 本身含有 $z$，每个 noise 在 training 时都和一个具体的 action 配了对。
:::

### Goal-conditioned BC 与 hindsight relabeling

Lecture 3 的第三部分问：学很多个 task 会不会反而更容易？把 policy 写成 $\pi(a\mid s,g)$，$g$ 是要到达的 goal。任何一条 trajectory，不管当初想去哪里，都是“到达它自己的终点”的 demonstration。把终点 $s_T$ 填进 $g$，这叫 hindsight relabeling，它让随便收集的 data 都变成 demonstration。

随便收集的 data 学得出好的 policy 吗？算一个例子。一维的 random walk，从 0 出发，每步以 probability $\tfrac12$ 走 $+1$ 或 $-1$，走 10 步。把每条 trajectory 按终点 relabel，policy 以 $(s,g,n)$ 为 condition，$n$ 是剩余步数，$d=g-s$ 是剩余位移。在终点为 $g$ 的 trajectory 里，下一步朝 goal 走的比例是多少？剩余 $n$ 步、位移 $d$，需要向上 $(n+d)/2$ 步，这样的 path 有 $\binom{n}{(n+d)/2}$ 条，其中第一步向上的有 $\binom{n-1}{(n+d)/2-1}$ 条，相除：

$$P(\text{下一步朝 goal}\mid d,n)=\frac{\binom{n-1}{(n+d)/2-1}}{\binom{n}{(n+d)/2}}=\frac{(n+d)/2}{n}=\frac{n+d}{2n}$$

$g=2$：$126/210=0.6$；$g=4$：$0.7$；$g=10$：只有一条 path，$1.0$。只要 $d>0$，这个比例就大于 $\tfrac12$。所以 BC 学到的 policy 的 mode 总是朝向 goal，取 argmax 执行就直奔目标，哪怕 data 全是 random walk 走出来的。直接从这个 policy 里 sample 则会复现“恰好在第 10 步到达 $g$”的那种 random path，一定到得了，但不走捷径。

Lecture 3 说 goal-conditioned BC 的 distribution shift 出现在两个地方，slide 把第二个留作问题。第一个和普通 BC 一样，在 state 上。第二个在 goal 上：test 时要求的 goal 未必是 data 里常见的终点。上面的 random walk 走 10 步，终点满足 $|g|\ge8$ 的 trajectory 只占 $22/1024=2.1\%$，$g=10$ 只占 $1/1024$。离出发点越远的 goal，data 越少，policy 越不可靠。

::fig[cs285-relabel] 左：终点 $g=2$ 的 path 在第一步的分叉。右：10 步 random walk 的终点，也就是 relabel 之后 data 里各个 goal 的比例。

Slide 28 给出的办法是把这个过程反复做：用当前的 goal-conditioned policy 去追 random 选的 goal，把实际到达的地方 relabel 成 goal 加进 data，再 train。Policy 每一轮都比 random walk 走得更远，下一轮的 data 就覆盖更远的 goal。Slide 30 提到同样的 relabeling 也用在 off-policy 的 value-based RL 里。

:::edge 只用少量高质量 data 为什么也会失败
Lecture 3 的例子：laundry folding 和 box building 各约 20 小时的 post-training data，strategy 一致、质量很高，单独拿来 train 却不行，robot 一出错就不知道怎么办；和约 10,000 小时 broad 但质量一般的 pre-training data 合起来才好用。这正是 compounding error 的情形：质量高的 data 恰恰很少包含“犯错之后怎么回来”的 state。Lecture 3 列的另一类 trick 是故意在 data 里加入犯错和纠正，错误本身有害，纠正的部分往往更有用。
:::

:::back
MSE 的 minimizer 是 conditional mean、diffusion policy、一步 flow matching 等于 MSE，见 [RB4301 的 gen 站](../courses/RB4301.html#gen)；BC 的 $T^2$ bound 和 DAgger 见 [RB4301 的 bc 站](../courses/RB4301.html#bc)。
:::

:::from
分站顺序、“fit expert 失败的两个原因”、autoregressive discretization 和“why does this work?”的问题、“noise 必须被用上”、goal-conditioned BC 的 pipeline 和 data scale 的数字，来自 [Spring 2026 Lecture 3](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-3.pdf)；BC 是 maximum likelihood 来自 [Lecture 2](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-2.pdf)。两讲只读到文字，flow matching 的 slide 只有标题和插图出处，loss 与 Euler 公式取自 [HW1 handout](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw1.pdf)。两个 mode 的例子、$v^*$ 的 closed form、看不到 $\tau$ 时的 $\bar v$ 和两张数表、random walk 的 relabeling 计算都是为这一页推导并用 `python3 -I` 实际算的（seed 0）。
:::

## [pg] Policy gradient 的 variance：causality、baseline 与 discount

:::skip
快速路线必读，HW2 依赖它。Log-derivative trick、baseline 不改变 expectation、optimal baseline 已在 [CS4246 的 pg 站](../courses/CS4246.html#pg)推过，这里不再重复。能证明 causality、能说出 full-return estimator 的 variance 由哪几部分组成、能说出 HW2 的两种 discount 写法差在哪，就可以去第 3 站。
:::

### 一个可以算清楚的 variance

从 [CS4246](../courses/CS4246.html#pg) 的结论出发：

$$\nabla_\theta J=\mathbb E_{\tau\sim\pi_\theta}\Big[\Big(\sum_t\nabla_\theta\log\pi_\theta(a_t\mid s_t)\Big)\Big(\sum_tr_t\Big)\Big]$$

Lecture 5 用下棋说明它的毛病：赢了，开局运气好也被加分，好棋被后来的失误连累扣分，坏棋因为对手失误被加分。这些平均下来会抵消，但需要很多 sample。这叫 high variance。

把它变成一个能算清楚的例子。$T=10$ 步，每步选 $a_t\in\{0,1\}$，$\pi_\theta(a_t=1)=\sigma(\theta)$，$\theta=0$，所以 $p=0.5$。Reward 是 $r_t=a_t+\ell_t$，$\ell_t\sim\mathcal N(0,1)$ 是和 action 无关的 luck。$\nabla_\theta\log\pi_\theta(a)=a-p$，记作 $x_t\in\{\pm\tfrac12\}$。True gradient：$J=T\sigma(\theta)$，$\nabla J=Tp(1-p)=2.5$。

Full-return estimator $g=X\cdot R$，其中 $X=\sum_tx_t$，$L=\sum_t\ell_t$，$R=\sum_tr_t=Tp+X+L$。它的 second moment：

$$\mathbb E[g^2]=\mathbb E\big[X^2(Tp+X+L)^2\big]=(Tp)^2\,\mathbb E[X^2]+\mathbb E[X^4]+\mathbb E[X^2]\,\mathbb E[L^2]$$

含 $X$ 的奇数次方的 term 因为 $X$ 关于 0 symmetric 而消失，含 $L$ 一次方的 term 因为 $L$ 独立且 mean 为 0 而消失。代数：$\mathbb E[X^2]=T\cdot\tfrac14=2.5$，$\mathbb E[L^2]=10$，$\mathbb E[X^4]=T\,\mathbb E[x^4]+3T(T-1)\,(\mathbb E[x^2])^2=10\cdot\tfrac1{16}+270\cdot\tfrac1{16}=17.5$。

$$\mathbb E[g^2]=\underbrace{25\times2.5}_{62.5}+\underbrace{17.5}_{\text{其他 action 的 reward}}+\underbrace{2.5\times10}_{25,\ \text{luck}}=105,\qquad\mathrm{Var}(g)=105-2.5^2=98.75$$

Gradient 只有 2.5，一条 trajectory 的 standard deviation 却接近 10。三块的来源各不相同：62.5 来自 reward 的整体水平 $Tp=5$，所有 reward 都是正的，于是每个 action 都被加分，只是加得多少不同；25 来自和 action 无关的 luck；17.5 来自别的时刻的 action 带来的 reward。用 $M=200{,}000$ 条 trajectory（seed 0）模拟，variance 是 97.7，和 98.75 一致。

### Causality：后面的 action 不为前面的 reward 负责

时刻 $t$ 的 action 不可能影响 $t$ 之前的 reward。这句话在 estimator 里对应一个 expectation 为 0 的 term：对 $t'<t$，

$$\mathbb E\big[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\,r_{t'}\big]=\mathbb E\Big[r_{t'}\ \mathbb E\big[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\ \big|\ s_{0:t},a_{0:t-1}\big]\Big]=0$$

第一个等号：$r_{t'}$ 由 $a_t$ 之前的 history 决定，可以从内层 expectation 里提出来。第二个等号：内层是对 $a_t\sim\pi_\theta(\cdot\mid s_t)$ 求 expectation，

$$\sum_a\pi_\theta(a\mid s_t)\,\nabla_\theta\log\pi_\theta(a\mid s_t)=\sum_a\nabla_\theta\pi_\theta(a\mid s_t)=\nabla_\theta\sum_a\pi_\theta(a\mid s_t)=\nabla_\theta1=0$$

这些 term 不改变 expectation，只贡献 noise，删掉：

$$\nabla_\theta J\approx\frac1N\sum_i\sum_t\nabla_\theta\log\pi_\theta(a_t^i\mid s_t^i)\,\hat Q_t^i,\qquad\hat Q_t^i=\sum_{t'\ge t}r_{t'}^i$$

$\hat Q_t$ 叫 reward-to-go（HW2 的 Eq. 9）。例子里它删掉了 $t$ 之前的 luck 和 $t$ 之前其他 action 的 reward，模拟的 variance 从 97.7 降到 40.3。

再减去 baseline。这里用 $b_t=\mathbb E[\hat Q_t]=(T-t)p$，它依赖时刻 $t$ 但不依赖 $a_t$，按 [CS4246](../courses/CS4246.html#pg) 的论证不改变 expectation。它去掉的是 reward 的整体水平，variance 降到 16.5。

| Estimator | 一条 trajectory 的 variance（模拟） | $N=4$ 条时方向估反的 probability | $N=16$ | $N=64$ |
|---|---|---|---|---|
| Full return | 97.7（exact 98.75） | 33.1% | 15.2% | 1.8% |
| Reward-to-go | 40.3 | 20.9% | 5.3% | 0.07% |
| Reward-to-go 减 baseline | 16.5 | 8.6% | 0.4% | 0 |

::fig[cs285-pgvar] 每个 batch 用 $N$ 条 trajectory 估 gradient，估出的 gradient 与 true gradient 反号的 probability。三条 curve 都随 $N$ 下降，但要达到同样的可靠程度，full return 需要的 trajectory 数是另外两种的好几倍。

:::wrong Policy gradient 的 estimate 是 unbiased 的，所以每一步都在往好的方向走
Unbiased 说的是许多个 batch 平均起来方向对。单看一个 batch，上表 full return 用 4 条 trajectory 时，三步里就有一步在往坏的方向走。Lecture 5 的结论是 policy gradient 需要大得多的 batch，learning rate 难调；“曲线在抖、偶尔掉下去”在 RL 里不一定是 bug，batch 太小时正确的实现也是这样。
:::

### Discount 的两种写法

无穷长或很长的任务需要 discount。HW2 写了两种：

$$\text{(Eq. 10)}\quad\sum_t\nabla_\theta\log\pi_\theta(a_t\mid s_t)\sum_{t'=0}^{T-1}\gamma^{t'}r_{t'},\qquad\text{(Eq. 11)}\quad\sum_t\nabla_\theta\log\pi_\theta(a_t\mid s_t)\sum_{t'=t}^{T-1}\gamma^{t'-t}r_{t'}$$

Eq. 10 是 discounted objective $\mathbb E[\sum_t\gamma^tr_t]$ 的 gradient。对它同样用 causality，再把 $\gamma^{t'}=\gamma^t\gamma^{t'-t}$ 拆开：

$$\sum_t\nabla_\theta\log\pi_\theta(a_t\mid s_t)\sum_{t'\ge t}\gamma^{t'}r_{t'}=\sum_t\gamma^t\,\nabla_\theta\log\pi_\theta(a_t\mid s_t)\sum_{t'\ge t}\gamma^{t'-t}r_{t'}$$

和 Eq. 11 只差最前面的 $\gamma^t$。这个 factor 说：越晚的 decision 越不重要。$\gamma=0.99$ 时，$\gamma^{100}=0.37$，$\gamma^{500}=0.0066$，第 500 步的 decision 几乎得不到 training。如果 $\gamma$ 的含义是“每一步有 $1-\gamma$ 的 probability 结束”，这是对的；可实际使用时 $\gamma$ 多半只是为了让 return 有界、variance 小一点，我们希望 robot 在第 500 步和第 1 步一样会走路。HW2 问“we almost always use the second formulation, do you see why?”，原因就在这里：Eq. 11 把每个时刻都当作新的起点。

### 写成代码：weighted maximum likelihood

Lecture 5 的 implementation 部分把 policy gradient 和 supervised learning 并排写。Supervised 的 maximum likelihood 是对 $\log\pi_\theta(a_i\mid s_i)$ 求平均再求 gradient；policy gradient 只多一步，把每一项乘上 advantage：

$$\tilde L(\theta)=-\frac1{NT}\sum_{i,t}\log\pi_\theta(a_t^i\mid s_t^i)\,\hat A_t^i,\qquad\nabla_\theta\tilde L=-\hat g$$

$\hat A$ 在这里是 constant，不能对它求 gradient（代码里要 detach）。$\tilde L$ 本身的数值没有意义，它只是一个 gradient 恰好等于 $-\hat g$ 的 pseudo-loss，所以看到它上升或下降都说明不了 policy 在变好还是变坏。

Gaussian policy $\pi_\theta(a\mid s)=\mathcal N(\mu_\theta(s),\sigma^2)$，

$$\nabla_\mu\log\pi=\frac{a-\mu}{\sigma^2}$$

算一次。$\mu=0$，$\sigma=1$，四个 sample 的 action 是 $(0.5,\ -1.0,\ 1.5,\ 0.2)$，advantage 是 $(1,\ -1,\ 2,\ -0.5)$：

$$\hat g_\mu=\tfrac14\big(1\times0.5+(-1)\times(-1.0)+2\times1.5+(-0.5)\times0.2\big)=\tfrac14(0.5+1.0+3.0-0.1)=1.1$$

$\mu$ 往 1.5 和 0.5 这两个好 action 的方向挪，离开坏 action $-1.0$。Advantage 为负的 sample 是在“推开”，所以 $-1.0$ 那一项的贡献也是正的。这就是 slide 上“好的变得更可能、坏的变得更不可能”。

:::edge Partial observability 下推导照样成立
把 $s_t$ 换成 observation $o_t$，trajectory 的 probability 里 policy 的 factor 是 $\pi_\theta(a_t\mid o_t)$，dynamics 的 factor 和 $\theta$ 无关，求 $\nabla_\theta\log$ 时照样消失。整个推导从没用过 Markov property，所以 policy gradient 可以直接用在 observation 上（Lecture 5 的 partial observability 一页）。用到 value function 的方法就没这么幸运，第 3 站的 critic 需要 state 才有意义。
:::

:::back
Log-derivative trick 的推导、baseline 不改变 expectation 的证明、optimal baseline 的 formula 在 [CS4246 的 pg 站](../courses/CS4246.html#pg)。
:::

:::from
下棋的例子、“baseline 用平均 reward 不是最好但够用”、causality、用 autodiff 写 pseudo-loss 的两段伪代码、“batch 要大、learning rate 难调、Adam 还行”来自 [Spring 2026 Lecture 5](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-5.pdf)（只读到文字，公式没有读到）。Discount 的两种写法和那个问题来自 [HW2 handout](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw2.pdf)。10 步的例子、variance 的 exact 分解、200,000 条 trajectory 的模拟和方向估反的 probability（seed 0、1）、Gaussian 的数值例子都是为这一页算的；causality 的证明是标准写法，按自己的知识补全。
:::

## [ac] Actor-critic：critic、GAE 与 reparameterization

:::skip
快速路线必读：HW2 的 baseline 与 GAE、HW3 的 SAC 都从这里来。能证明 GAE 的 closed form，能说出 $\lambda$ 在 bias 和 variance 之间怎样取舍，能说出 off-policy actor-critic 的 naive 版本错在哪两处，就可以去第 4 站。
:::

### 用一个 function 代替一条 trajectory

上一站的 reward-to-go $\hat Q_t$ 是 $Q^\pi(s_t,a_t)=\mathbb E[\sum_{t'\ge t}r_{t'}\mid s_t,a_t]$ 的单个 sample。如果手里有 $Q^\pi$ 本身，就不必用一个 sample 去估它；再减去 $V^\pi(s_t)=\mathbb E_{a\sim\pi}[Q^\pi(s_t,a)]$，得到 advantage $A^\pi=Q^\pi-V^\pi$，它衡量 $a_t$ 比这个 state 下的平均水平好多少。Lecture 6 的说法是：value 估得越好，variance 越低。

$V^\pi$ 要从 data 里 fit，这个 network 叫 critic。Training target 有两种：

$$y_t^{\text{MC}}=\sum_{t'\ge t}\gamma^{t'-t}r_{t'},\qquad y_t^{\text{boot}}=r_t+\gamma\hat V(s_{t+1})$$

Monte Carlo target 是 $V^\pi(s_t)$ 的 unbiased sample，但吵；bootstrapped target 只含一步的 randomness，但 $\hat V(s_{t+1})$ 的 error 原样进入 target。Infinite horizon 的问题里 bootstrapping 必须有 $\gamma<1$，否则 $\hat V$ 可以无限增长。

### Critic 当 baseline 不引入 bias，当 target 就会

Lecture 6 留了一个练习：证明用 critic 当 baseline 仍然 unbiased。$\hat V(s_t)$ 不依赖 $a_t$，和上一站 causality 的证明一样：

$$\mathbb E\big[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\,\hat V(s_t)\big]=\mathbb E\Big[\hat V(s_t)\sum_a\nabla_\theta\pi_\theta(a\mid s_t)\Big]=\mathbb E\big[\hat V(s_t)\cdot0\big]=0$$

所以 $\hat Q_t-\hat V(s_t)$ 对任何 $\hat V$ 都 unbiased，$\hat V$ 再差也只影响 variance。

换成 TD error $\delta_t=r_t+\gamma\hat V(s_{t+1})-\hat V(s_t)$ 就不同了。设 $\hat V=V^\pi+e$，

$$\mathbb E[\delta_t\mid s_t,a_t]=A^\pi(s_t,a_t)+\gamma\,\mathbb E\big[e(s_{t+1})\mid s_t,a_t\big]-e(s_t)$$

$-e(s_t)$ 不依赖 $a_t$，无害。$e(s_{t+1})$ 却依赖 $a_t$：不同的 action 去不同的 next state，那里 critic 的 error 不同。这一项进入 policy gradient，就是 bias。

### n-step return 与 GAE

在两者之间取舍：先用 $n$ 步真实的 reward，再接 critic。HW2 的 Eq. 17：

$$\hat A_t^{(n)}=\sum_{l=0}^{n-1}\gamma^lr_{t+l}+\gamma^n\hat V(s_{t+n})-\hat V(s_t)$$

它可以写成 $n$ 个 TD error 之和。把 $\delta_{t+l}=r_{t+l}+\gamma\hat V(s_{t+l+1})-\hat V(s_{t+l})$ 乘上 $\gamma^l$ 相加，中间的 $\hat V$ 两两抵消：

$$\sum_{l=0}^{n-1}\gamma^l\delta_{t+l}=\sum_{l=0}^{n-1}\gamma^lr_{t+l}+\sum_{l=0}^{n-1}\big(\gamma^{l+1}\hat V(s_{t+l+1})-\gamma^l\hat V(s_{t+l})\big)=\sum_{l=0}^{n-1}\gamma^lr_{t+l}+\gamma^n\hat V(s_{t+n})-\hat V(s_t)$$

$n=1$ 是 $\delta_t$；$n$ 取到 episode 结束是 Monte Carlo 减 baseline。$n$ 越大，critic 的 error 被 $\gamma^n$ 压得越小，reward 的 noise 却加进来越多。

Generalized advantage estimation（GAE）不选某一个 $n$，而是对所有 $n$ 按 $\lambda^{n-1}$ 加权平均（weight 之和 $(1-\lambda)\sum_{n\ge1}\lambda^{n-1}=1$）：

$$\hat A_t^{\text{GAE}}=(1-\lambda)\sum_{n=1}^{\infty}\lambda^{n-1}\hat A_t^{(n)}$$

代入 $\hat A_t^{(n)}=\sum_{l<n}\gamma^l\delta_{t+l}$，交换求和次序：$\delta_{t+l}$ 出现在所有 $n>l$ 的 term 里，

$$\hat A_t^{\text{GAE}}=\sum_{l=0}^{\infty}\gamma^l\delta_{t+l}\,(1-\lambda)\sum_{n=l+1}^{\infty}\lambda^{n-1}=\sum_{l=0}^{\infty}\gamma^l\delta_{t+l}\,(1-\lambda)\frac{\lambda^l}{1-\lambda}=\sum_{l=0}^{\infty}(\gamma\lambda)^l\delta_{t+l}$$

::fig[cs285-gaesum] 交换求和次序：先按行（每个 $n$）加，等于先按列（每个 $\delta_{t+l}$）加。

最后的形式可以从后往前一步算出来，这就是 HW2 要实现的 recursion（Eq. 22）：

$$\hat A_t^{\text{GAE}}=\delta_t+\gamma\lambda\,\hat A_{t+1}^{\text{GAE}}$$

把右边的 $\hat A_{t+1}^{\text{GAE}}=\sum_l(\gamma\lambda)^l\delta_{t+1+l}$ 代进去，正好是 $\delta_t$ 加上后面每一项多乘一个 $\gamma\lambda$。Episode 的最后一步没有 next state，$\delta_{H-1}=r_{H-1}-\hat V(s_{H-1})$，recursion 从这里开始。有限长的 episode 里 weight 之和不到 1，HW2 的 Eq. 18 多除了一个 $1-\lambda^{H-t-1}$ 做 normalization。

两端：$\lambda=0$ 是 $\delta_t$，variance 最小，critic 不准时 biased；$\lambda=1$ 是 $\sum_l\gamma^lr_{t+l}-\hat V(s_t)$，按上一小节的证明对任何 $\hat V$ 都 unbiased（相对于 discounted 的 gradient），variance 最大。

### 在一个 random walk 上量 bias 和 variance

State $0,1,\dots,10$，从 5 出发，每步向右的 probability 是 $\sigma(\theta)$，$\theta=0$；到 10 得 reward 1 并结束，到 0 得 0 并结束；每步另有 std 0.3 的 reward noise；$\gamma=1$。True value $V^\pi(s)=s/10$。由 gambler's ruin 的 formula 对 $\theta$ 求 derivative，true gradient 是 1.25。Critic 是 $\hat V(s)=V^\pi(s)+e(s)$，$e(s)$ 取 std 0.15 的固定 error（seed 3，两个 terminal state 上为 0）。

::fig[cs285-walk] 这个 random walk。

$\lambda=0$ 的 bias 可以 exact 算出。上一小节说 bias 来自 $\mathbb E[x_t\,e(s_{t+1})]$：在 state $s$，$x_t=+\tfrac12$ 时去 $s+1$，$x_t=-\tfrac12$ 时去 $s-1$，各占一半，所以每访问一次 $s$ 贡献 $\tfrac14\big(e(s+1)-e(s-1)\big)$。Symmetric random walk 从 5 出发、到 0 或 10 停止，访问 $s$ 的 expected 次数是 $2\min(s,5)\,(10-\max(s,5))/10$，即 $1,2,3,4,5,4,3,2,1$。加权求和，bias 是 0.252。

模拟 250,000 个 episode（seed 3），每个 episode 算一次 $\sum_tx_t\hat A_t^{\text{GAE}}$：

| $\lambda$ | 0 | 0.5 | 0.8 | 0.9 | 0.95 | 0.98 | 1 |
|---|---|---|---|---|---|---|---|
| bias | 0.256 | 0.175 | 0.104 | 0.064 | 0.036 | 0.015 | 0（exact） |
| 一个 episode 的 variance | 2.62 | 2.23 | 2.33 | 2.56 | 2.81 | 3.06 | 3.35 |
| 一个 batch 100 个 episode 的 $\text{bias}^2+\text{var}/100$ | 0.092 | 0.053 | 0.034 | 0.030 | 0.029 | 0.031 | 0.034 |

$\lambda=0$ 的 bias 0.256 与 exact 的 0.252 相差 1.3 个 standard error。Bias 随 $\lambda$ 单调下降；variance 先降后升，$\lambda=0$ 并不是 variance 最小的，因为 critic 的 error 本身也给 $\delta$ 加了 noise。一个 batch 的 mean squared error 在 $\lambda=0.9$ 到 0.95 之间最小。

::fig[cs285-gae] Batch 为 100 个 episode 时 gradient estimate 的 error 拆成两部分：$\text{bias}^2$ 随 $\lambda$ 下降，$\text{variance}/100$ 在 $\lambda$ 接近 1 时上升，总和在 0.9 到 0.95 附近最低。

:::wrong $\lambda=1$ 没有 bias，所以总该用 $\lambda=1$
Batch 有限时要比的是 $\text{bias}^2+\text{variance}/N$。上表 $N=100$ 时 $\lambda=1$ 是 0.034，$\lambda=0.95$ 是 0.029：用一点 bias 换来的 variance 下降更划算。GAE 的论文也报告 best 的 $\lambda$ 明显低于 best 的 $\gamma$，作者的解释是 critic 还算准时，$\lambda$ 带来的 bias 远小于 $\gamma$ 带来的。HW2 的 LunarLander 实验扫 $\lambda\in\{0,0.95,0.98,0.99,1\}$，就是要你自己看到这个取舍。
:::

:::edge Episode 被时间截断不等于结束
$\delta_{H-1}=r_{H-1}-\hat V(s_{H-1})$ 假设 $s_{H-1}$ 之后再也没有 reward。如果 episode 是因为达到最大步数被截断的（InvertedPendulum 撑满 1000 步），之后本来还有 reward，把它当 terminal 会让 critic 学到“快到时限的 state 价值低”，而 state 里并没有时间，critic 无从区分。Gymnasium 的 `step` 把 `terminated` 和 `truncated` 分开返回，截断时应当仍用 $\gamma\hat V(s_H)$ bootstrap。这一条是凭经验写的，HW2 的 starter code 怎样处理要看代码。
:::

### Off-policy actor-critic：naive 的版本错在两处

On-policy actor-critic 每批 data 用完就扔。想用 replay buffer 里旧 policy 收集的 transition $(s,a,r,s')$，Lecture 6 先给出一个 naive 的版本并说它是坏的：用 $r+\gamma\hat V(s')$ fit $\hat V$，再用 $\nabla\log\pi_\theta(a\mid s)\,\hat A$ 更新 actor。两处错误：

1. **Critic。** Buffer 里的 $a$ 来自旧 policy，$r+\gamma\hat V(s')$ 估的是旧 policy 在 $s$ 的 value，不是当前 policy 的。改成学 $Q(s,a)$：它以 action 为 condition，buffer 里的 $a$ 是谁选的都无所谓。Target 里的 next action 要从当前 policy 现抽：$y=r+\gamma Q_\phi(s',a')$，$a'\sim\pi_\theta(\cdot\mid s')$。
2. **Actor。** $\nabla\log\pi_\theta(a\mid s)$ 要求 $a\sim\pi_\theta$，buffer 里的 $a$ 不是。改成对 buffer 里的每个 $s$ 现抽 $a^\pi\sim\pi_\theta(\cdot\mid s)$，用 $Q_\phi(s,a^\pi)$。

剩下的 state distribution 仍然是旧的。通常的做法是接受它：buffer 里的 state 比当前 policy 会去的更广，在更广的 state 上把 policy 训好不是坏事（这个理由是凭自己的知识写的，slides 上这一页只读到标题）。

Actor 的 gradient 有了 $Q_\phi$ 之后还可以换一种方式来求。把 sample 写成 $a=\mu_\theta(s)+\sigma_\theta(s)\varepsilon$，$\varepsilon\sim\mathcal N(0,I)$，randomness 全在 $\varepsilon$ 里，$\theta$ 只出现在一个可导的 function 里：

$$\nabla_\theta\,\mathbb E_{a\sim\pi_\theta}\big[Q(s,a)\big]=\mathbb E_\varepsilon\Big[\nabla_aQ(s,a)\big|_{a=\mu_\theta+\sigma_\theta\varepsilon}\ \nabla_\theta\big(\mu_\theta(s)+\sigma_\theta(s)\varepsilon\big)\Big]$$

这叫 reparameterization，它用上了 $Q$ 对 action 的 derivative，而 likelihood-ratio（score-function）的写法只用 $Q$ 的值。差多少？取 $Q(a)=-(a-2)^2$，$\pi=\mathcal N(\mu,1)$，$\mu=0$，对 $\mu$ 求 gradient。$\mathbb E[Q]=-\big((\mu-2)^2+1\big)$，true gradient 是 $-2(\mu-2)=4$。

- Reparameterized：$g=Q'(\mu+\varepsilon)=-2(\varepsilon-2)=4-2\varepsilon$，$\mathrm{Var}=4$。
- Score-function：$g=Q(a)\,(a-\mu)=-(\varepsilon-2)^2\varepsilon$。展开 $(\varepsilon-2)^4\varepsilon^2=\varepsilon^6-8\varepsilon^5+24\varepsilon^4-32\varepsilon^3+16\varepsilon^2$，用 $\mathbb E[\varepsilon^2]=1$、$\mathbb E[\varepsilon^4]=3$、$\mathbb E[\varepsilon^6]=15$，得 $\mathbb E[g^2]=15+72+16=103$，$\mathrm{Var}=103-16=87$。
- Score-function 减 baseline $b=\mathbb E[Q]=-5$：$g=(Q+5)\varepsilon=-\varepsilon^3+4\varepsilon^2+\varepsilon$，$g^2$ 的 expectation 是 $15+14\times3+1=58$，$\mathrm{Var}=42$。

同一个 gradient，variance 是 87、42、4（用 200 万个 sample 核对，seed 0）。这就是 SAC 用 reparameterization 的原因，HW3 要求用 `.rsample()` 而不是 `.sample()`，前者保留了 $a$ 对 $\theta$ 的 gradient 路径。

:::back
Actor-critic 用 TD error 当 weight、$\mathbb E[\delta_t]=A^\pi$ 在 [CS4246 的 pg 站](../courses/CS4246.html#pg)；用 critic 对 action 的 gradient train deterministic actor（DDPG）在 [RB4301 的 ac 站](../courses/RB4301.html#ac)，它是 reparameterization 在 $\sigma=0$ 时的特例。
:::

:::from
“value 越准 variance 越低”、MC 与 bootstrapped target、critic 当 baseline 的练习、n-step 与 GAE 的动机、naive off-policy actor-critic 及两处修正、reparameterization 引出 SAC 的顺序来自 [Spring 2026 Lecture 6](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-6.pdf)（只读到文字）。n-step advantage、GAE 的 normalization 和 recursion 的写法来自 [HW2 handout](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw2.pdf)。GAE 的 closed form、$\lambda=0,1$ 的性质、best $\lambda$ 低于 best $\gamma$ 来自 [GAE 论文](https://ar5iv.labs.arxiv.org/html/1506.02438)。Random walk 的例子、$\lambda=0$ 的 exact bias、250,000 个 episode 的数表、三种 gradient estimator 的 variance 都是为这一页推导和实算的；截断与结束的区别凭经验写。
:::

## [q] Q-learning 的实际做法：target network、n-step 与 SAC

:::skip
快速路线必读，HW3 依赖它。Replay buffer、target network 治什么、deadly triad 在 [CS4246 的 fa 站](../courses/CS4246.html#fa)；overestimation 的数表、TD3、SAC 的 objective 在 [RB4301 的 ac 站](../courses/RB4301.html#ac)。能说出 residual gradient 为什么学错、off-policy n-step target converge 到哪里，能推出 tanh-squashed policy 的 log-probability 并解释 HW3 的 entropy sanity check，就可以去第 5 站。
:::

### 三个 process 以不同的速度跑

Lecture 7 从 actor-critic 去掉 actor 得到 fitted Q-iteration：(1) 收集 transition 放进 dataset；(2) 用 target parameter $\phi'$ 算 $y=r+\gamma\max_{a'}Q_{\phi'}(s',a')$；(3) 对 $Q_\phi(s,a)\approx y$ 做 regression。Lecture 8 把各种 Q-learning 都看成这三个 process，只是速度不同：

| Algorithm | (1) 收集 data | (2) 更新 target $\phi'$ | (3) regression |
|---|---|---|---|
| Online Q-learning | 每步一次 | 每步一次（$\phi'=\phi$） | 每步一次 |
| DQN | 每步一次 | 慢：经典设置每 10,000 步一次 | 每步一次 |
| Fitted Q-iteration | 最外层 | 中间层 | 最内层，跑到 converge |

每收集一条 transition 做几次 gradient step，叫 update-to-data（UTD）ratio。UTD 高，学得快、算得多；过高会 overfit 到 buffer 里那点 data，这和第 8 站 offline RL 的问题是同一个。

### Q-learning 不是 gradient descent

Q-learning 的 update 是 $\phi\leftarrow\phi-\alpha\,\nabla_\phi Q_\phi(s,a)\,\big(Q_\phi(s,a)-y\big)$，$y$ 里也有 $\phi$（或 $\phi'$），但不对它求 gradient。Lecture 8 说这正是 Q-learning 不是 gradient descent 的原因。那为什么不老老实实对 squared Bellman error 求完整的 gradient（这叫 residual gradient）？算一个例子。

$s_0$ 以各一半的 probability 转到 $s_1$ 或 $s_2$，reward 0；$s_1$ 结束时得 1，$s_2$ 结束时得 0；$\gamma=1$。True value：$V_1=1$，$V_2=0$，$V_0=0.5$。每个 episode 产生两条 transition，residual gradient 最小化的是 sampled transition 上的 squared error 的 expectation：

$$L=\tfrac12(V_0-V_1)^2+\tfrac12(V_0-V_2)^2+\tfrac12(V_1-1)^2+\tfrac12V_2^2$$

前两项来自 $s_0$（各一半），后两项来自 $s_1$、$s_2$（各在一半的 episode 里出现）。对三个 value 求 derivative 令其为 0：

$$\partial_{V_0}:\ 2V_0=V_1+V_2,\qquad\partial_{V_1}:\ 2V_1=V_0+1,\qquad\partial_{V_2}:\ 2V_2=V_0$$

后两式相加得 $2(V_1+V_2)=2V_0+1$，代入第一式得 $4V_0=2V_0+1$，所以 $V_0=0.5$，$V_1=0.75$，$V_2=0.25$。$V_1$、$V_2$ 都被拉向了中间。原因在 $s_0$ 那两项：记 $m=\tfrac12(V_1+V_2)$，$d=\tfrac12(V_1-V_2)$，则 $V_0-V_1=(V_0-m)-d$，$V_0-V_2=(V_0-m)+d$，

$$\tfrac12(V_0-V_1)^2+\tfrac12(V_0-V_2)^2=(V_0-m)^2+d^2$$

第一项是想要的 Bellman error；第二项是 next state value 的 variance，它惩罚 $V_1$ 和 $V_2$ 不相等。Transition 有 randomness 时，sampled 的 squared Bellman error 多了一个 variance term，要消掉它需要从同一个 $s$ 独立抽两次 $s'$，data 里没有这样的 sample。只更新 $Q(s,a)$、把 target 当 constant 的做法，在 table 上 converge 到 $V_1=1$、$V_2=0$。代价是它不再是任何 objective 的 gradient，function approximation 下没有 convergence 的保证（Lecture 8 的 theory 部分，例子见 [CS4246](../courses/CS4246.html#fa)）。

::fig[cs285-residual] 这个例子的结构和两种做法 converge 到的 value。

### Target network：hard update 与 Polyak

$y$ 随 $\phi$ 一起动，regression 的目标就一直在跑。Target network 把 $y$ 冻住一段时间，在这段时间里它是一个 well-defined 的 regression。两种做法，HW3 都要实现：hard update 每 $K$ 步令 $\phi'\leftarrow\phi$；Polyak（soft）update 每步令

$$\phi'\leftarrow\phi'+\tau(\phi-\phi')=(1-\tau)\phi'+\tau\phi$$

Hard update 的 lag 是锯齿形的，刚更新完为 0，更新前为 $K-1$，平均 $(K-1)/2$。Lecture 8 指出 Polyak update 的 lag 是恒定的。把 recursion 展开，$\phi'_t=\sum_{k\ge0}\tau(1-\tau)^k\phi_{t-k}$，$\phi'$ 是过去各个 $\phi$ 的 weighted average，weight 是 $k$ 步之前 $\tau(1-\tau)^k$。平均 lag 是

$$\sum_{k\ge0}k\,\tau(1-\tau)^k=\tau\cdot\frac{1-\tau}{\tau^2}=\frac{1-\tau}{\tau}$$

（用了 $\sum_kkx^k=x/(1-x)^2$。）常用的 $\tau=0.005$ 对应平均 lag 199 步，和每 399 步 hard update 一次的平均 lag 相同。

### Double Q 与 n-step return

Max 把 critic 的 noise 变成系统性的 overestimation，数表在 [RB4301](../courses/RB4301.html#ac)。Double DQN 把“选 action”和“评估 action”分给两个 network，HW3 的写法是

$$a'=\arg\max_{a'}Q_\phi(s',a'),\qquad y=r+\gamma(1-d)\,Q_{\phi'}(s',a')$$

$Q_\phi$ 碰巧估高的那个 action 被选中，但它的 value 由 $Q_{\phi'}$ 给出，后者的 error 和这次挑选的相关性小得多。Lecture 8 的 tips 说 double Q 帮助很大，而且没有坏处。

N-step return 让 reward 每次 backup 往前传 $n$ 步：

$$y_t=\sum_{l=0}^{n-1}\gamma^lr_{t+l}+\gamma^n\max_aQ(s_{t+n},a)$$

Lecture 8 说它帮助很大，但有 downside。Downside 在于 $r_{t+1},\dots,r_{t+n-1}$ 是 buffer 里那条 trajectory 上 behavior policy 的 action 拿到的，而 $Q^*$ 要求之后都按 optimal 行动。算一个例子：每个 state 都一样，optimal action 得 reward 1，另一个 action 得 0；behavior policy 以一半的 probability 选 optimal；$\gamma=0.9$。$Q^*(s,a^*)=1/(1-\gamma)=10$，behavior policy 自己的 $Q^\beta(s,a^*)=1+\gamma\cdot0.5/(1-\gamma)=5.5$。$n$-step target 的 expectation 是

$$\mathbb E[y]=1+0.5\sum_{l=1}^{n-1}\gamma^l+\gamma^nQ$$

Q-learning 反复做这个 backup，converge 到 $Q=\mathbb E[y]$ 的 fixed point：

$$Q_n=\frac{1+0.5\sum_{l=1}^{n-1}\gamma^l}{1-\gamma^n}$$

| $n$ | 1 | 2 | 3 | 5 | 10 |
|---|---|---|---|---|---|
| Fixed point $Q_n$ | 10.000 | 7.632 | 6.845 | 6.221 | 5.768 |

$n=1$ 是 $Q^*$；$n$ 越大越接近 $Q^\beta=5.5$。Buffer 里的 data 接近当前 greedy policy 时（buffer 新、$\varepsilon$ 小）这个 bias 小，所以 $n$ 取 3 到 5 在实践中常常有用。

:::wrong N-step return 只是在 bias 和 variance 之间折中，$n$ 取大一点只会让它更快地学到 $Q^*$
上表 $n=10$ 时 Q-learning converge 到 5.77，离 $Q^*=10$ 很远，而且再多的 data、再久的 training 都不会把它拉回来。这是 bias，不是 variance，它来自 target 里混进了 behavior policy 的 action，和 data 是 off-policy 这件事绑在一起。
:::

另外两条 tips（Lecture 8，部分出自 Schulman）：Bellman error 的 gradient 可能很大，用 Huber loss（error 超过某个阈值后 loss 变成 linear，gradient 的大小被截在阈值上）或 gradient clipping；不同 seed 的结果差别很大，至少跑几个 seed 再下结论。

### HW3 里 SAC 的每一个部件

HW3 的 SAC 由四块拼成，variable 的名字照 handout：temperature 记作 $\beta$，$\mathcal H(\pi)=\mathbb E_{a\sim\pi}[-\log\pi(a\mid s)]$。

**Critic。** $y=r_t+\gamma(1-d_t)\big[Q_{\phi'}(s_{t+1},a_{t+1})+\beta\,\mathcal H(\pi(\cdot\mid s_{t+1}))\big]$，$a_{t+1}\sim\pi(\cdot\mid s_{t+1})$。实现时 $\mathcal H$ 用一个 sample 估：$-\log\pi(a_{t+1}\mid s_{t+1})$。

**Actor。** 最大化 $Q\big(s,\tanh(\mu_\theta(s)+\sigma_\theta(s)\varepsilon)\big)+\beta\,\mathcal H$，用上一站的 reparameterization。

**Tanh。** Action 被限制在 $[-1,1]$，所以先抽 $u\sim\mathcal N(\mu,\sigma^2)$ 再令 $a=\tanh u$。$a$ 的 density 要做 change of variables：$a$ 落在 $[a,a+da]$ 等价于 $u$ 落在 $[u,u+du]$，$du=da/(1-\tanh^2u)$，所以

$$\log\pi(a\mid s)=\log\mathcal N(u;\mu,\sigma^2)-\log\big(1-\tanh^2u\big)$$

多维时对每一维减去这一项再相加。直接算 $\log(1-\tanh^2u)$ 在 $|u|$ 大时会得到 $\log0$，numerically stable 的写法是 $1-\tanh^2u=4/(e^u+e^{-u})^2$，取 log：

$$\log\big(1-\tanh^2u\big)=2\log2-2\log\big(e^u+e^{-u}\big)=2\big(\log2-u-\mathrm{softplus}(-2u)\big)$$

**Entropy 的上界。** HW3 的 sanity check：只让 entropy 驱动 actor，1 维 tanh-squashed 的 action 的 entropy 应该升到约 $\log2\approx0.69$。为什么是 $\log2$？$[-1,1]$ 上的 uniform density 是 $\tfrac12$，任何 density $p$ 与它的 KL divergence 非负：

$$0\le\int p\log\frac{p}{1/2}=-\mathcal H(p)+\log2\qquad\Longrightarrow\qquad\mathcal H(p)\le\log2$$

等号只在 $p$ 是 uniform 时成立。Tanh-squashed Gaussian 不可能恰好是 uniform，它能达到多少？由上面的 change of variables，$\mathcal H(a)=\mathcal H(u)+\mathbb E[\log(1-\tanh^2u)]$，$\mu=0$ 时对 $\sigma$ 做 numerical integration：

| $\sigma$ | 0.3 | 0.5 | 0.87 | 1.5 | 3 |
|---|---|---|---|---|---|
| $\mathcal H(\tanh u)$ | 0.129 | 0.500 | 0.684（最大） | 0.423 | $-1.096$ |
| 不做 tanh 修正时算出的“entropy” $\tfrac12\log(2\pi e\sigma^2)$ | 0.215 | 0.726 | 1.28 | 1.83 | 2.52 |

::fig[cs285-tanh] 左：$\sigma$ 不同时 $a=\tanh u$ 的 density。$\sigma$ 太大，mass 被推到 $\pm1$ 两端，entropy 反而下降。右：entropy 随 $\sigma$ 的变化，最大值 0.684 略低于 uniform 的 $\log2$。

所以 sanity check 的读法是：升到 0.68 左右停住，正确；一路涨过 1、2 还在涨，几乎可以肯定是漏了 tanh 的修正项，你在最大化 Gaussian 自己的 entropy，$\sigma$ 越大越“好”；停在很低的值，检查 entropy 的 sign 和 $\beta$ 是否传进了 loss。

**Temperature 自动调节。** HW3 把问题写成 constraint：最大化 return，同时要求 $\mathbb E[\mathcal H(\pi)]\ge\bar{\mathcal H}$，$\bar{\mathcal H}=-\dim(\mathcal A)$。$\beta$ 是这个 constraint 的 Lagrange multiplier，对它做 gradient descent 的 loss 是

$$J(\beta)=\mathbb E_{a\sim\pi}\big[-\beta\big(\log\pi(a\mid s)+\bar{\mathcal H}\big)\big],\qquad\frac{dJ}{d\beta}=\mathbb E[-\log\pi]-\bar{\mathcal H}=\mathcal H(\pi)-\bar{\mathcal H}$$

Entropy 高于目标时 derivative 为正，gradient descent 让 $\beta$ 变小，entropy 的 bonus 减弱；低于目标时 $\beta$ 变大。用 $\beta=\exp(\log\beta)$ 做 parameterization，保证它为正，对 $\log\beta$ 的 derivative 是 $\beta(\mathcal H-\bar{\mathcal H})$，同号。Fixed point 处 entropy 等于目标值。

:::wrong 用 `.sample()` 抽 action 也行，反正 critic 会告诉 actor 哪里好
`.sample()` 返回的 tensor 和 $\theta$ 之间没有 gradient 路径，actor loss 里的 $Q(s,a)$ 对 $\theta$ 的 gradient 是 0。$\log\pi_\theta(a\mid s)$ 那一项仍然有 gradient（$a$ 固定时 density 仍依赖 $\theta$），所以 loss 在变、training 在跑，actor 却只在调 entropy，完全不看 $Q$。上一站的 variance 比较说明了为什么要走 reparameterization 这条路，HW3 把这一条列为最容易犯的错。
:::

:::back
上一站的 reparameterization 和 off-policy actor-critic 的两处修正；clipped double-Q 和 entropy objective 的 optimal policy 见 [RB4301 的 ac 站](../courses/RB4301.html#ac)。
:::

:::from
Fitted Q-iteration 的引出、三个 process 的视角和 UTD、“Q-learning is not gradient descent”、Polyak update 的“constant lag”、double Q 的推广、两组 practical tips、continuous action 的两种办法、fitted value iteration 不 converge 的结论，来自 [Spring 2026 Lecture 7](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-7.pdf) 和 [Lecture 8](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-8.pdf)（只读到文字）。DQN、Double DQN、SAC 四个部件的写法和 entropy 的 sanity check 来自 [HW3 handout](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw3.pdf)。Residual gradient 的例子、Polyak lag 的推导、n-step 的 fixed point 表、tanh 的 change of variables 和 stable 写法、entropy 的 numerical integration 是按自己的知识写出并实际算的。
:::

## [trpo] Advanced policy gradient：performance difference、natural gradient 与 PPO

:::skip
不在快速路线里。做 HW4 之前读最后一小节“PPO 的两种写法”和 [RB4301](../courses/RB4301.html#ac) 里 clip 的四种情况即可。能证明 performance difference lemma、由 KL 推出 Fisher matrix 和 natural gradient，并说出 PPO 的 clip 是在 approximate 什么，就可以去第 6 站。
:::

### 每批 data 只能用一次

Lecture 9 说 policy gradient 的好处是稳：Monte Carlo 的 advantage 让 gradient unbiased，critic 再差也不会让它走歪，所以 sim-to-real 的 robotics 和 LLM training 都偏爱它。毛病是每走一步都要重新 sample：data 来自 $\pi_\theta$，走了一步之后就不是当前 policy 的 data 了。

想用旧 data 估新 policy $\pi_{\theta'}$ 的 return，importance sampling 是现成的工具：

$$J(\theta')=\mathbb E_{\tau\sim p_{\theta'}}[R(\tau)]=\mathbb E_{\tau\sim p_\theta}\Big[\frac{p_{\theta'}(\tau)}{p_\theta(\tau)}R(\tau)\Big],\qquad\frac{p_{\theta'}(\tau)}{p_\theta(\tau)}=\prod_t\frac{\pi_{\theta'}(a_t\mid s_t)}{\pi_\theta(a_t\mid s_t)}$$

Trajectory probability 里 initial state 和 dynamics 的 factor 两边相同，相除时消掉，只剩每一步的 action ratio。问题在连乘。设每步 action 是 binary，$\pi_\theta(1)=0.5$，$\pi_{\theta'}(1)=0.6$，ratio $w$ 以各一半的 probability 取 1.2 或 0.8。$\mathbb E[w]=1$，$\mathbb E[w^2]=\tfrac12(1.44+0.64)=1.04$。$T$ 步独立相乘，$W=\prod w_t$ 的 $\mathbb E[W]=1$，$\mathbb E[W^2]=1.04^T$：

| $T$ | 10 | 100 | 1000 |
|---|---|---|---|
| $\mathrm{Var}(W)=1.04^T-1$ | 0.48 | 49.5 | $1.1\times10^{17}$ |

每一步 policy 只变了 0.1，1000 步的 weight 就已经没法用了。Lecture 9 的说法是 weight 一离开 1，variance 就大到 estimator 失去用处。

:::wrong Importance weight 的 expectation 是 1，所以 importance sampling 总可以放心用
Unbiased 不等于能用。上表 $T=100$ 时 weight 的 variance 是 49.5，要把 estimate 的 standard error 压到和不加 weight 时相当，需要约 50 倍的 sample；$T=1000$ 时需要 $10^{17}$ 倍。实际上绝大多数 trajectory 的 $W$ 接近 0，极少数巨大，sample mean 几乎总是偏小，偶尔爆炸。
:::

### Performance difference lemma

只对当前一步的 action 做 importance sampling、不管 state distribution 的变化，为什么基本可以？先证一个 identity：

$$J(\theta')-J(\theta)=\mathbb E_{\tau\sim p_{\theta'}}\Big[\sum_t\gamma^tA^{\pi_\theta}(s_t,a_t)\Big]$$

新 policy 的 return 比旧的多出的部分，等于新 policy 走出的 trajectory 上旧 policy 的 advantage 之和。证明：$J(\theta)=\mathbb E_{s_0}[V^{\pi_\theta}(s_0)]$，而 $s_0$ 的 distribution 和 policy 无关，所以可以写成新 policy 下的 expectation。把 $V(s_0)$ 写成 telescoping sum（$\gamma^tV\to0$）：

$$V^{\pi_\theta}(s_0)=\sum_{t\ge0}\big(\gamma^tV^{\pi_\theta}(s_t)-\gamma^{t+1}V^{\pi_\theta}(s_{t+1})\big)$$

于是

$$\begin{aligned}J(\theta')-J(\theta)&=\mathbb E_{\tau\sim p_{\theta'}}\Big[\sum_t\gamma^tr_t\Big]-\mathbb E_{\tau\sim p_{\theta'}}\Big[\sum_t\big(\gamma^tV^{\pi_\theta}(s_t)-\gamma^{t+1}V^{\pi_\theta}(s_{t+1})\big)\Big]\\&=\mathbb E_{\tau\sim p_{\theta'}}\Big[\sum_t\gamma^t\big(r_t+\gamma V^{\pi_\theta}(s_{t+1})-V^{\pi_\theta}(s_t)\big)\Big]\end{aligned}$$

括号里对 $s_{t+1}$ 取 expectation 就是 $Q^{\pi_\theta}(s_t,a_t)-V^{\pi_\theta}(s_t)=A^{\pi_\theta}(s_t,a_t)$。证毕。

右边的 expectation 是在新 policy 的 trajectory 上取的。拆成 state 和 action 两层，对 action 用 importance sampling：

$$J(\theta')-J(\theta)=\sum_t\mathbb E_{s_t\sim p_{\theta'}}\Big[\mathbb E_{a_t\sim\pi_\theta}\Big[\frac{\pi_{\theta'}(a_t\mid s_t)}{\pi_\theta(a_t\mid s_t)}\gamma^tA^{\pi_\theta}(s_t,a_t)\Big]\Big]$$

只剩 state distribution $p_{\theta'}(s_t)$ 是新 policy 的。把它换成旧的 $p_\theta(s_t)$，得到 surrogate $\bar A(\theta')$，它可以完全用旧 data 计算，而且在 $\theta'=\theta$ 处对 $\theta'$ 的 gradient 正是 policy gradient（ratio 的 gradient 是 $\nabla\log\pi$）。所以 policy gradient 就是在 optimize 这个 surrogate 的 linearization，Lecture 10 称之为“policy gradient as policy iteration”：用旧 policy 的 advantage 去改进 policy。

换 state distribution 引入多少 error？设每个 state 上新旧 policy 的 total variation 不超过 $\varepsilon$，[RB4301](../courses/RB4301.html#ac) 推过 $\sum_s|p_{\theta'}(s_t)-p_\theta(s_t)|\le2\varepsilon t$。$\gamma^tA$ 的绝对值不超过某个 $C$（$r_{\max}/(1-\gamma)$ 的量级），所以

$$J(\theta')-J(\theta)\ \ge\ \bar A(\theta')-\sum_t2\varepsilon t\,C$$

Lecture 10 的评语是“not a great bound, but a bound”：policy 每一步变得不多，最大化 surrogate 就保证 return 变好。Total variation 不好直接约束，用 Pinsker inequality 换成 KL：$\tfrac12\sum_a|\pi'(a\mid s)-\pi(a\mid s)|\le\sqrt{\tfrac12\mathrm{KL}(\pi'\|\pi)}$。于是问题变成

$$\max_{\theta'}\ \bar A(\theta')\qquad\text{subject to}\qquad\mathbb E_{s\sim p_\theta}\big[\mathrm{KL}\big(\pi_{\theta'}(\cdot\mid s)\,\|\,\pi_\theta(\cdot\mid s)\big)\big]\le\epsilon$$

### KL 的 second-order 展开就是 Fisher matrix

Constraint 里的 KL 在 $\theta'=\theta$ 附近长什么样？记 $\theta'=\theta+\Delta$，对固定的 $s$，

$$\mathrm{KL}(\pi_\theta\|\pi_{\theta+\Delta})=\mathbb E_{a\sim\pi_\theta}\big[\log\pi_\theta(a)-\log\pi_{\theta+\Delta}(a)\big]$$

（$\mathrm{KL}(\pi_\theta\|\pi_{\theta'})$ 和 $\mathrm{KL}(\pi_{\theta'}\|\pi_\theta)$ 到 second order 相同，这里用前者，expectation 在 $\pi_\theta$ 下。）把 $\log\pi_{\theta+\Delta}(a)$ 在 $\theta$ 处 Taylor expand：

$$\log\pi_{\theta+\Delta}(a)=\log\pi_\theta(a)+\Delta^\top\nabla\log\pi_\theta(a)+\tfrac12\Delta^\top\nabla^2\log\pi_\theta(a)\,\Delta+\cdots$$

代回去，zeroth-order 的 term 抵消；first-order 的 term 是 $-\Delta^\top\mathbb E[\nabla\log\pi_\theta]=0$（上一站证过）；剩下

$$\mathrm{KL}\approx-\tfrac12\Delta^\top\mathbb E\big[\nabla^2\log\pi_\theta(a)\big]\Delta$$

再用一个 identity：$\nabla^2\log\pi=\nabla\big(\nabla\pi/\pi\big)=\nabla^2\pi/\pi-\nabla\log\pi\,\nabla\log\pi^\top$，而 $\mathbb E_{\pi}[\nabla^2\pi/\pi]=\sum_a\nabla^2\pi(a)=\nabla^2\sum_a\pi(a)=0$。所以 $-\mathbb E[\nabla^2\log\pi]=\mathbb E[\nabla\log\pi\,\nabla\log\pi^\top]$，

$$\mathrm{KL}(\pi_\theta\|\pi_{\theta+\Delta})\approx\tfrac12\Delta^\top F\Delta,\qquad F=\mathbb E_{a\sim\pi_\theta}\big[\nabla_\theta\log\pi_\theta(a)\,\nabla_\theta\log\pi_\theta(a)^\top\big]$$

$F$ 叫 Fisher information matrix，它只用 sample 和 $\nabla\log\pi$ 就能估。

用一次。Gaussian policy $a\sim\mathcal N(ks,\sigma^2)$，parameter 是 $(k,\sigma)$。记 $\xi=(a-ks)/\sigma\sim\mathcal N(0,1)$：

$$\partial_k\log\pi=\frac{(a-ks)s}{\sigma^2}=\frac{\xi s}{\sigma},\qquad\partial_\sigma\log\pi=-\frac1\sigma+\frac{(a-ks)^2}{\sigma^3}=\frac{\xi^2-1}{\sigma}$$

$\mathbb E[\xi^2]=1$，$\mathbb E[(\xi^2-1)^2]=3-2+1=2$，$\mathbb E[\xi(\xi^2-1)]=0$，所以 $F=\mathrm{diag}\big(s^2/\sigma^2,\ 2/\sigma^2\big)$。两个 diagonal entry 都含 $1/\sigma^2$：$\sigma$ 越小，同样大小的 parameter 变化让 distribution 变得越多。

### Natural gradient

Lecture 10 说，对 surrogate 做 first-order expansion，得到的就是普通的 policy gradient $g$；但“在 parameter space 里走一小步”和“在 KL 意义下走一小步”不是一回事。把 constraint 换成上面的 second-order 形式：

$$\max_\Delta\ g^\top\Delta\qquad\text{subject to}\qquad\tfrac12\Delta^\top F\Delta\le\epsilon$$

Lagrangian 对 $\Delta$ 求 derivative：$g-\lambda F\Delta=0$，所以 $\Delta=\tfrac1\lambda F^{-1}g$。代入 constraint 取等号：$\tfrac1{2\lambda^2}g^\top F^{-1}g=\epsilon$，$\tfrac1\lambda=\sqrt{2\epsilon/(g^\top F^{-1}g)}$。

$$\Delta=\sqrt{\frac{2\epsilon}{g^\top F^{-1}g}}\;F^{-1}g$$

$F^{-1}g$ 叫 natural gradient。普通 gradient ascent 相当于把 $F$ 换成 identity matrix，也就是假设每个 parameter 对 distribution 的影响一样大。

Lecture 10 引用 Peters 与 Schaal（2008）的图说明这在实际中是个问题。用同样的设置把数算出来：1 维 linear system $s_{t+1}=s_t+a_t$，reward $-s_t^2-a_t^2$，$s_0\sim\mathcal N(0,1)$，$\gamma=0.9$，policy $a_t\sim\mathcal N(ks_t,\sigma^2)$。代入得 $s_{t+1}=(1+k)s_t+\sigma\xi_t$，记 $m_t=\mathbb E[s_t^2]$，$\rho=(1+k)^2$，则 $m_{t+1}=\rho m_t+\sigma^2$，$\mathbb E[a_t^2]=k^2m_t+\sigma^2$。令 $M=\sum_t\gamma^tm_t$，由 recursion 两边乘 $\gamma^{t+1}$ 求和得 $M-m_0=\gamma\rho M+\gamma\sigma^2/(1-\gamma)$，所以

$$M=\frac{m_0+\gamma\sigma^2/(1-\gamma)}{1-\gamma\rho},\qquad J(k,\sigma)=-\Big[(1+k^2)M+\frac{\sigma^2}{1-\gamma}\Big]$$

Numerically optimize 得 optimum 在 $k^*=-0.588$、$\sigma^*=0$。在 $(k,\sigma)=(-1,0.1)$ 处，$\rho=0$，$M=1+0.9\times0.01/0.1=1.09$，$\partial M/\partial k\propto(1+k)=0$：

$$\partial_kJ=-2kM=2.18,\qquad\partial_\sigma J=-\Big[(1+k^2)\frac{2\gamma\sigma}{1-\gamma}+\frac{2\sigma}{1-\gamma}\Big]=-(3.6+2)=-5.6$$

Vanilla gradient $(2.18,-5.6)$ 主要指向“把 $\sigma$ 减小”，可是 $\sigma$ 只剩 0.1，而 $k$ 还差 0.41。Fisher matrix 用 discounted state distribution 加权，$F_{kk}=M/\sigma^2=109$，$F_{\sigma\sigma}=2\sum_t\gamma^t/\sigma^2=2000$，natural gradient 是 $(2.18/109,\ -5.6/2000)=(0.020,\ -0.0028)$，几乎全在 $k$ 方向。

两个方向各走 Euclidean length 0.1 的一步，只看 $\sigma$ 变化带来的 KL（$\mathrm{KL}=\log(\sigma_2/\sigma_1)+\sigma_1^2/(2\sigma_2^2)-\tfrac12$）：vanilla 方向把 $\sigma$ 从 0.1 压到 0.0068，KL 是 104，$k$ 只挪了 0.036；natural 方向把 $\sigma$ 变到 0.086，KL 是 0.025，$k$ 挪了 0.099。

::fig[cs285-natgrad] 同一个 LQR 问题在 $(k,\sigma)$ 平面上的 gradient 方向（箭头都缩放成同样长）。左边 vanilla gradient 在大多数点上主要指向“$\sigma$ 变小”，先把 policy 变成 deterministic，再慢慢挪 $k$；右边 natural gradient 指向 optimum 所在的 $k^*=-0.588$。

$F$ 是 $n\times n$ 的，$n$ 是 network 的 parameter 数，存不下也求不了 inverse。TRPO 用 conjugate gradient 解 $Fx=g$：conjugate gradient 只需要能算 $Fv$，而 $Fv$ 等于 KL 的 Hessian 乘 $v$，可以对 $\nabla\mathrm{KL}^\top v$ 再求一次 gradient 得到，不必写出 $F$。每次 $Fv$ 的代价和一次 backward pass 相当。

### PPO 的两种写法

TRPO 精确地解 constraint 问题，实现复杂。Lecture 10 讲了两条更简单的路。一是把 constraint 变成 penalty：

$$\max_{\theta'}\ \bar A(\theta')-\beta\,\mathbb E_s\big[\mathrm{KL}(\pi_{\theta'}\|\pi_\theta)\big]$$

对同一批 data 做几个 epoch 的 SGD。PPO 论文里 $\beta$ 是 adaptive 的：一轮结束后，实测的 KL 超过目标的 1.5 倍就把 $\beta$ 加倍，低于目标的 $1/1.5$ 就减半（这个规则是凭自己的知识写的，没有在读到的 slides 里核对）。二是 clip：把 ratio 限制在 $[1-\epsilon,1+\epsilon]$ 之外不再给奖励，四种情况的逐一计算见 [RB4301](../courses/RB4301.html#ac)。Lecture 10 的总结是：clip 版本是 KL penalty 版本的一个 heuristic approximation，两者都在实现“policy 一次不要变太多”。实际的 PPO 是第 3 站的 GAE 加上 clip，再加一点 entropy regularization，同一批 data 做多个 epoch 的 minibatch 更新。第 6 站的 GRPO 就是把其中的 GAE 换成了 group baseline。

:::back
$2\varepsilon t$ 的 state distribution bound 和 PPO clip 的四种情况在 [RB4301 的 ac 站](../courses/RB4301.html#ac)；$\mathbb E[\nabla\log\pi]=0$ 在[第 2 站](#pg)。
:::

:::from
“为什么喜欢 policy gradient”、每一步都要新 sample 的问题、importance sampling、weight 离开 1 之后 variance 爆炸、clipped importance weight 和 KL penalty 的 PPO 来自 [Spring 2026 Lecture 9](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-9.pdf)；“policy gradient as policy iteration”、bounding the distribution change（引 TRPO 论文）、“not a great bound, but a bound”、first-order 与 second-order expansion、Peters 与 Schaal 的图、conjugate gradient 来自 [Lecture 10](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-10.pdf)。两讲都只读到文字，没有看到图，performance difference lemma、Fisher matrix、natural gradient 的推导是按 slides 的顺序凭自己的知识补全的。IS 的数表、LQR 的 closed form、gradient 场和两种 step 的 KL 都是为这一页算的。
:::

## [llm] LLM 上的 RL：KL regularization、GRPO 与 KL estimator

:::skip
做 HW4 就必读，否则可以放到最后。Fall 2023 没有对应的录像，读 Spring 2026 Lecture 14 的 slides 加这一站。能推出 KL-regularized objective 的 optimal policy、写出 GRPO 的 loss 并说出 group 里 reward 全相同时会怎样、证明 $e^\Delta-\Delta-1$ 是 KL 的 unbiased estimator，就可以去第 7 站。
:::

### 一次生成是一步，也是很多步

Lecture 14 的 basic formulation：给一个 prompt $x$，policy 生成 completion $y=(y_1,\dots,y_T)$，最后得到一个 reward $r(x,y)$。从 sequence 的角度这是一步的 RL（一个 bandit），$\pi_\theta(y\mid x)=\prod_t\pi_\theta(y_t\mid x,y_{<t})$，policy gradient 是

$$\nabla_\theta\,\mathbb E_{y\sim\pi_\theta}[r(x,y)]=\mathbb E\Big[r(x,y)\sum_t\nabla_\theta\log\pi_\theta(y_t\mid x,y_{<t})\Big]$$

从 token 的角度，每生成一个 token 是一步，state 是 $(x,y_{<t})$，只有最后一步有 reward。两种看法给出同一个 gradient；token 级的看法在有中间 reward、或要用 value function 做 baseline 时更自然。Lecture 14 提到 value baseline 的两种做法：在 LLM 上加一个 value head，或者整个复制一份 network；value function 只在 completion 部分 train，不在 prompt 上。

Reward 从哪来，Lecture 14 列了两类：人类的 preference（RLHF，用 Bradley–Terry model 把“A 比 B 好”变成 reward model，fit 的方式很像 logistic regression），以及 verifier（答案对不对）。HW4 用的是后一类，format copy 和 MATH 的 reward 都由 parser 自动给出。

### 为什么要拉住 reference model

只最大化 reward，policy 会去找 reward 的漏洞：reward model 是 learned 的，在它没见过的输出上可能给出离谱的高分；即使是 verifier，也可能给不再像正常语言的输出高分。Lecture 14 的 reference-model regularization 有两个理由：输出必须仍是 valid English，以及不要 exploit 不完美的 reward model。Objective 是

$$\max_\pi\ \mathbb E_{y\sim\pi}\big[r(x,y)\big]-\beta\,\mathrm{KL}\big(\pi(\cdot\mid x)\,\|\,\pi_{\text{ref}}(\cdot\mid x)\big)$$

它的 optimal policy 有 closed form。令 $\pi^*(y)=\pi_{\text{ref}}(y)e^{r(y)/\beta}/Z$，$Z=\sum_y\pi_{\text{ref}}(y)e^{r(y)/\beta}$。把 objective 整理：

$$\mathbb E_\pi[r]-\beta\sum_y\pi(y)\log\frac{\pi(y)}{\pi_{\text{ref}}(y)}=-\beta\sum_y\pi(y)\log\frac{\pi(y)}{\pi_{\text{ref}}(y)e^{r(y)/\beta}}=-\beta\,\mathrm{KL}(\pi\,\|\,\pi^*)+\beta\log Z$$

（第一个等号把 $r(y)=\beta\log e^{r(y)/\beta}$ 并进 log；第二个等号用 $\pi_{\text{ref}}e^{r/\beta}=Z\pi^*$。）$\beta\log Z$ 和 $\pi$ 无关，KL 非负且只在 $\pi=\pi^*$ 时为 0，所以 $\pi^*$ 是 optimum，最大值是 $\beta\log Z$。

三个 completion，$\pi_{\text{ref}}=(0.7,\ 0.2,\ 0.1)$，reward $(0,\ 1,\ 1)$：

| $\beta$ | $\pi^*$ | $\mathbb E[r]$ | KL | objective $=\beta\log Z$ |
|---|---|---|---|---|
| 2 | $(0.586,\ 0.276,\ 0.138)$ | 0.414 | 0.029 | 0.356 |
| 0.5 | $(0.240,\ 0.507,\ 0.253)$ | 0.760 | 0.450 | 0.535 |
| 0.1 | $(0.0001,\ 0.667,\ 0.333)$ | 1.000 | 1.203 | 0.880 |

两个 reward 相同的 completion，比例始终是 $2:1$，和 $\pi_{\text{ref}}$ 一样：reward 区分不了的地方，policy 保留 reference model 的偏好。$\beta\to0$ 时 KL 趋向 $-\log0.3=1.204$，即把 $\pi_{\text{ref}}$ 在 reward 为 1 的那部分（共 0.3）放大成全部。

### Group baseline

Lecture 14 的“baselining without value functions”就是 GRPO 的做法：对同一个 prompt 抽 $G$ 个 completion，用它们 reward 的平均当 baseline。HW4 的写法还除以 group 内的 population std：

$$A_{i,j}=\frac{r_{i,j}-\mu_i}{\sigma_i+\epsilon},\qquad\mu_i=\frac1G\sum_jr_{i,j},\qquad\sigma_i=\sqrt{\frac1G\sum_j(r_{i,j}-\mu_i)^2}$$

**Mean 里含自己，gradient 会缩小。** 第 $j$ 个 completion 的 baseline $\mu_i$ 里有 $r_{i,j}/G$ 这一项，它依赖 $y_{i,j}$。拆开：

$$\mathbb E\Big[\nabla\log\pi(y_j)\Big(r_j-\frac1G\sum_kr_k\Big)\Big]=\Big(1-\frac1G\Big)\mathbb E\big[\nabla\log\pi(y_j)\,r_j\big]-\frac1G\sum_{k\ne j}\mathbb E\big[\nabla\log\pi(y_j)\big]\,\mathbb E[r_k]$$

$k\ne j$ 的 completion 和 $y_j$ 独立，expectation 分开，$\mathbb E[\nabla\log\pi(y_j)]=0$。结果是 true gradient 乘 $(1-1/G)$，方向不变。用 leave-one-out mean（不含自己）则完全 unbiased。

**除以 std 改变了各 prompt 的权重。** Reward 是 0 或 1 时，一个 8 选 1 对的 group，$\mu=0.125$，$\sigma=\sqrt{0.125\times0.875}=0.331$，答对的那个 advantage 是 $0.875/0.331=2.65$，答错的各是 $-0.378$；一个 8 选 4 对的 group，$\sigma=0.5$，advantage 是 $\pm1$。难题上偶然答对的那一次被放大到 2.65 倍。

**Reward 全相同的 group 没有信号。** 8 个回答全对或全错时 $r_{i,j}-\mu_i=0$，这个 prompt 的 gradient 恰好是 0。每个回答答对的 probability 为 $p$ 时，这件事的 probability 是 $p^8+(1-p)^8$：

| $p$ | 0.05 | 0.23 | 0.5 | 0.9 |
|---|---|---|---|---|
| 一个 group 全相同 | 66.3% | 12.4% | 0.8% | 43.0% |

HW4 说 MATH 子集上 RL 之前的 eval 约 0.23，于是一开始约 12% 的 prompt 不贡献 gradient；太难（$p=0.05$）或太容易（$p=0.9$）的题，大部分 batch 白算。HW4 的 reward 里有 format 分（出现 `\boxed{` 加 0.1 等），handout 说这些辅助项帮助 exploration，从这里也能看出原因：它们让同一个 group 里的 reward 不容易完全相同。

### GR-REINFORCE 与 GRPO 的 loss

HW4 的 GR-REINFORCE 先在每个 completion 内对 token 的 log-probability 取平均，$\bar\ell_i=\frac1{T_i}\sum_t\log\pi_\theta(y_{i,t}\mid x_i,y_{i,<t})$，再乘 advantage：

$$L=-\frac1N\sum_iA_i\,\bar\ell_i+\beta\,\mathrm{KL}(\pi_\theta\|\pi_{\text{ref}})$$

每个 rollout 只做一次 update，strictly on-policy。GRPO 改用第 5 站的 PPO clip，ratio 是 token 级的 $\rho_{i,t}=\pi_\theta(y_{i,t}\mid\cdot)/\pi_{\text{old}}(y_{i,t}\mid\cdot)$，$\pi_{\text{old}}$ 的 log-probability 在 rollout 时存下来：

$$L=-\frac1N\sum_i\frac1{T_i}\sum_t\min\big(\rho_{i,t}A_i,\ \mathrm{clip}(\rho_{i,t},1-\epsilon,1+\epsilon)A_i\big)+\beta\,\mathrm{KL}$$

HW4 用 $\epsilon=0.2$、$\beta=0.05$，同一个 rollout 做两个 PPO epoch。两个 math run 的 batch、minibatch、learning rate 都一样，唯一的 algorithm 差别就是这两个 epoch，所以 HW4 让你比较前 200 个 iteration 的曲线。

$1/T_i$ 的作用：handout 说是防止长的 completion 主导 loss。它也有副作用：每个 token 的 weight 是 $A_i/T_i$。两个答错的 completion，$A=-1$，长度 10 和 100，每个 token 分别被推开 $-0.1$ 和 $-0.01$，长的错误答案每个 token 受的惩罚只有十分之一。这是 2025 年 Dr. GRPO 一文对这种平均方式的批评（凭自己的知识写的，没有在读到的材料里核对）。

:::wrong Prompt token 也算进 loss 没关系，反正它们的 advantage 都一样
Prompt 不是 policy 的 action，它们的 log-probability 乘上 advantage，会让 model 在答对时提高“生成这段 prompt”的 probability、答错时降低它，学的是和 task 无关的东西。长度上它还会淹没真正的信号：200 个 token 的 prompt 加 20 个 token 的回答，没有 mask 时 loss 里 91% 的 term 落在 prompt 上。HW4 的 checklist 要求只给 completion token 打分、prompt 和 padding 都 mask 掉，debugging tips 说 format copy 上 reward 到第 10 步还没涨，先查 mask 和 logprob 的对齐（position $t-1$ 的 logits 预测 token $t$）。
:::

### KL 用 sample 估

完整的 $\mathrm{KL}(\pi_\theta\|\pi_{\text{ref}})$ 要对整个 vocabulary 求和，每个位置都要两个 model 的完整 distribution，又贵又占 memory。HW4 只在 sample 出来的 token 上估。记 $\Delta(a)=\log\pi_{\text{ref}}(a)-\log\pi_\theta(a)$，$a\sim\pi_\theta$，三个常见的 estimator：

$$k_1=-\Delta,\qquad k_2=\tfrac12\Delta^2,\qquad k_3=e^\Delta-\Delta-1$$

**$k_1$ unbiased**：$\mathbb E_{\pi_\theta}[-\Delta]=\sum_a\pi_\theta(a)\log\frac{\pi_\theta(a)}{\pi_{\text{ref}}(a)}=\mathrm{KL}$。但它可以是负的，而 KL 不可能为负。

**$k_3$ 也 unbiased**：$\mathbb E_{\pi_\theta}[e^\Delta]=\sum_a\pi_\theta(a)\frac{\pi_{\text{ref}}(a)}{\pi_\theta(a)}=1$，所以 $\mathbb E[k_3]=1+\mathrm{KL}-1=\mathrm{KL}$。$e^\Delta-1$ 这一项 expectation 为 0，加上它不改变 mean，却和 $-\Delta$ 负相关，抵消掉一部分 noise。

**$k_3$ 非负**：$e^x\ge1+x$ 对所有 $x$ 成立，所以 $e^\Delta-\Delta-1\ge0$。

$k_2$ 不是 unbiased 的，KL 小时 approximately 正确。在一个 50 个 token 的 vocabulary 上实算（$\pi_\theta$ 的 logits 取 $\mathcal N(0,1)$，$\pi_{\text{ref}}$ 的 logits 再加 std 为 $s$ 的扰动，seed 0）：

| 扰动 $s$ | exact KL | $k_1$ 的 std | $k_1<0$ 的比例 | $\mathbb E[k_2]$ | $k_3$ 的 std |
|---|---|---|---|---|---|
| 0.1 | 0.0059 | 0.108 | 49% | 0.0059 | 0.0061 |
| 0.5 | 0.104 | 0.484 | 51% | 0.123 | 0.129 |
| 2.0 | 1.233 | 1.604 | 25% | 2.046 | 1.455 |

两个 policy 接近时（这正是 KL penalty 想维持的情形），$k_3$ 的 std 比 $k_1$ 小 18 倍；$k_1$ 有一半的 sample 是负的。

::fig[cs285-kl] 以 ratio $\pi_{\text{ref}}/\pi_\theta=e^\Delta$ 为横轴，$k_1=-\log(\text{ratio})$ 和 $k_3=\text{ratio}-1-\log(\text{ratio})$。$k_3$ 在 ratio 为 1 处与横轴相切，处处非负。

:::edge 把 $k_3$ 当 loss 求 gradient，得到的是另一个方向的 KL
上面证的是 $k_3$ 的 value unbiased。HW4 把它直接加进 loss 求 gradient，sample $a$ 固定，对 $\theta$ 求导：

$$\nabla_\theta k_3=\nabla_\theta\Big(\frac{\pi_{\text{ref}}(a)}{\pi_\theta(a)}+\log\pi_\theta(a)\Big)=\Big(1-\frac{\pi_{\text{ref}}(a)}{\pi_\theta(a)}\Big)\nabla_\theta\log\pi_\theta(a)$$

对 $a\sim\pi_\theta$ 取 expectation，第一项 $\mathbb E[\nabla\log\pi_\theta]=0$，第二项 $-\sum_a\pi_{\text{ref}}(a)\nabla\log\pi_\theta(a)$，正是 $\nabla_\theta\mathrm{KL}(\pi_{\text{ref}}\|\pi_\theta)$。而 $\nabla_\theta\mathrm{KL}(\pi_\theta\|\pi_{\text{ref}})=\mathbb E_{\pi_\theta}\big[\nabla\log\pi_\theta\cdot\log(\pi_\theta/\pi_{\text{ref}})\big]$，两者一般不相等，只在 $\pi_\theta$ 接近 $\pi_{\text{ref}}$ 时到 first order 一致。两个 policy 不远时这无关紧要；但“penalty 的 value 是 reverse KL”不等于“penalty 的 gradient 在减小 reverse KL”。这一段是自己推的，HW4 没有讨论它。
:::

:::back
PPO clip 见[第 5 站](#trpo)和 [RB4301](../courses/RB4301.html#ac)；$\pi\propto\pi_{\text{ref}}e^{r/\beta}$ 和 SAC 的 $\pi\propto e^{Q/\alpha}$ 是同一个 Lagrangian 的结果，后者在 [RB4301](../courses/RB4301.html#ac)，第 8 站的 AWR 还会再用一次。
:::

:::from
One-step 与 token 级两种看法、value baseline 的两种做法、GRPO 这个名字、reference-model regularization 的两个理由、Bradley–Terry 和 verifier reward 来自 [Spring 2026 Lecture 14](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-14.pdf)（只读到文字，slides 只给了 GRPO 的名字，没有 formula）。Group advantage、两种 loss、KL estimator、reward 的构成、预期的数字和 debugging tips 来自 [HW4 handout](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw4.pdf)。Optimal policy 的推导、mean 含自己时的 $(1-1/G)$、全相同 group 的 probability、三个 estimator 的数表和 $k_3$ 的 gradient 都是为这一页推导和实算的；Dr. GRPO 的批评凭自己的知识写。
:::

## [mbrl] Model-based RL：planning、model 上的 gradient 与 latent model

:::skip
不在快速路线里；研究方向是 world model 的不要跳。Ensemble、aleatoric 与 epistemic uncertainty、MPC、MBPO 的 short rollout 在 [RB4301 的 mpc 站](../courses/RB4301.html#mpc)已经讲透，这一站只讲 CS285 另外强调的部分。能用例子说明 open-loop plan 为什么吃亏、CEM 为什么受 dimension 限制、对 model 求 gradient 为什么会 explode，以及 latent model 为什么需要 reconstruction，就可以去第 8 站。
:::

### Open-loop plan 即使 model 完美也会吃亏

Lecture 16 先区分两种 plan。Open-loop：在 $t=1$ 就决定整条 action sequence，之后只执行；closed-loop：每一步看到 state 再决定。Deterministic 的 dynamics 下两者一样好；dynamics 有 randomness 时，open-loop 是 suboptimal 的。

最小的例子：第一步不管做什么，nature 以各一半的 probability 把 state 变成 $L$ 或 $R$；第二步选 left 或 right，和 state 一致得 reward 1，否则 0。Open-loop 的 plan 必须在看到 state 之前定下第二步，不管定哪个，expected reward 都是 0.5。Closed-loop 的 policy 看到 state 再选，expected reward 是 1。这里 model 是完美的，差距全部来自“plan 不能对还没发生的 randomness 做反应”。

::fig[cs285-openloop] 同一个 model 上的两种 plan。彩色是实际执行的选择。

:::wrong 只要 model 是对的，optimize 出来的 action sequence 就是 optimal 的
上面的例子 model 完全正确，open-loop 的最好 plan 也只有 0.5，closed-loop 是 1。Optimize 一条 action sequence 和 optimize 一个 policy 是两个问题：前者的 optimum 是对所有可能的未来取平均后最好的那一条，后者可以对每个未来各自选。MPC 每一步重新 plan，用 replanning 把一部分 closed-loop 的好处找回来（见 [RB4301](../courses/RB4301.html#mpc)）。
:::

### Random shooting 与 CEM：维数是上限

Lecture 16 把 planning 当作对 action sequence $A=(a_1,\dots,a_H)$ 的 black-box optimization。Random shooting 随机抽 $N$ 条，挑最好的；cross-entropy method（CEM）用一个 Gaussian 抽，留下 cost 最低的 elite，用 elite 的 mean 和 std 重新 fit Gaussian，重复几轮。

例子：$s_0=0$，$s_t=s_{t-1}+a_t$，cost 是 $\sum_t(s_t-3)^2$。Optimum 是 $a_1=3$，其余为 0，cost 为 0。初始 Gaussian 的 std 都是 2。$H=2$ 时 CEM 每轮 100 个 sample、留 10 个 elite（seed 0），mean 的轨迹：

$$(0,0)\to(2.48,\ 0.64)\to(2.92,\ 0.14)\to(2.97,\ 0.02)\to(2.997,\ 0.003)$$

std 从 2 降到 0.03 左右。

::fig[cs285-cem] $H=2$ 时 cost 的 contour 和 CEM 前四轮的 Gaussian（mean 和 2 倍 std 的范围）。每一轮的 Gaussian 都缩到上一轮最好的那一小块里。

同样 500 次 cost evaluation，比较 random shooting（一次抽 500 条）和 CEM（5 轮、每轮 100 条），各跑 20 个 seed 取 median：

| Horizon $H$ | 2 | 10 | 30 |
|---|---|---|---|
| Random shooting 的最好 cost | 0.048 | 10.3 | 95.5 |
| CEM 的最好 cost | 0.000 | 2.2 | 52.8 |

$H$ 大了两者都远离 0。Lecture 16 把这列为 CEM 的主要缺点（“harsh dimensionality limit”），另一个缺点是它只能做 open-loop plan；优点是简单、可以大规模并行。Lecture 8 提到更复杂的 CMA-ES 大约能用到 40 维。

### 对 model 求 gradient：Jacobian 连乘

Model 是 network，可导，为什么不直接把 return 对 action 或 policy parameter 求 gradient？Lecture 16 比较了 policy gradient 和 pathwise（backprop through the model）gradient。Pathwise gradient 要穿过整条 rollout：

$$\frac{\partial s_T}{\partial a_1}=\frac{\partial f}{\partial s}\Big|_{T-1}\cdots\frac{\partial f}{\partial s}\Big|_{2}\ \frac{\partial f}{\partial a}\Big|_{1}$$

1 维 linear model $s_{t+1}=cs_t+a_t$ 上它是 $c^{T-1}$：

| $c$ | $T=10$ | $T=50$ | $T=100$ |
|---|---|---|---|
| 1.1 | 2.36 | 106.7 | 12,528 |
| 0.9 | 0.39 | 0.0057 | $3.0\times10^{-5}$ |

和 RNN 的 backpropagation through time 是同一个现象，区别在于 RNN 的 dynamics 可以设计成好求 derivative 的（LSTM），环境的 dynamics 是给定的。Policy gradient 不对 dynamics 求 derivative，没有这个连乘，代价是 variance；Lecture 16 引 Parmas 等（2018）说，sample 够多时它反而可能更稳。

另一条出路是 rollout 短。Short rollout 从真实 data 的 state 出发、只在 model 里走几步，error 累积的推导和 MBPO 在 [RB4301](../courses/RB4301.html#mpc)。Lecture 16 列了几种用 model 加速 off-policy RL 的做法，MBPO 在 RB4301 讲过；Model-Based Value Expansion（MVE）值得和[第 4 站](#q)的 n-step 对照：它在 model 里按当前 policy 走 $k$ 步，再接 $\gamma^kQ(s_{t+k},a_{t+k})$。第 4 站的 n-step target 偏向 behavior policy，是因为中间的 reward 来自 buffer 里旧 policy 的 action；在 model 里展开时中间的 action 由当前 policy 选，这个 bias 没有了，换成了 model 的 error。

### Latent space model

Observation 是 image 时，直接在 pixel 上预测下一帧又贵又难，Lecture 15 说直接在 pixel 上 plan 非常困难。办法是学一个 latent state $z$：encoder $q(z_t\mid o_t)$、latent dynamics $p(z_{t+1}\mid z_t,a_t)$、decoder $p(o_t\mid z_t)$、reward model $p(r_t\mid z_t)$，一起 train：

$$\max\ \sum_t\mathbb E\Big[\log p(z_{t+1}\mid z_t,a_t)+\log p(o_t\mid z_t)+\log p(r_t\mid z_t)\Big]$$

Slide 问：deterministic encoder 为什么可能是个坏主意？看去掉 decoder 那一项会怎样。只 train latent dynamics 和 reward，loss 是 $\|e(o_{t+1})-f(e(o_t),a_t)\|^2$ 加上 reward 的 error。令 encoder $e(o)\equiv0$、dynamics $f\equiv0$，dynamics loss 恰好为 0，不管 data 是什么。Encoder 把一切都映到同一个点，dynamics 就“完美”了，代价只是 reward 预测得差一些。Reconstruction 项 $\log p(o_t\mid z_t)$ 要求 $z$ 能还原 observation，排除了这种 collapse。Lecture 16 说很多实用的方法用 stochastic encoder 或完整的 smoothing posterior，尤其在 partially observed 的问题里；这需要 variational inference（Lecture 11–12），这一站不展开。学好的 latent 可以直接给 actor-critic 用，在 replay buffer 上 train。

:::back
CEM、ensemble、MPC、MBPO 和 model error 的累积在 [RB4301 的 mpc 站](../courses/RB4301.html#mpc)；n-step 的 bias 在[第 4 站](#q)。
:::

:::from
Open-loop 与 closed-loop、random shooting、CEM 的优缺点、其他 planning 方法、policy gradient 与 pathwise gradient 的比较、short rollout、Dyna、MBA/MVE/MBPO、latent space model 的组成和“deterministic encoder 为什么是坏主意”，来自 [Spring 2026 Lecture 16](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-16.pdf)；distributional shift、uncertainty、ensemble 的部分来自 [Lecture 15](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-15.pdf)，已在 RB4301 讲过。两讲只读到文字。抛硬币的例子、CEM 的 mean 变化和对比表（20 个 seed 的 median）、Jacobian 的数表、MVE 与 n-step 的对照、collapse 的论证是为这一页写的。
:::

## [offline] Offline RL：OOD action、policy constraint、IQL 与 FQL

:::skip
快速路线必读，HW5 依赖它，也是“用固定的 demonstration 和 rollout data 做 post-training”的理论基础。能用 linear Q 的例子说明 Q-learning 在 data 外的 max 会怎样、由 KL constraint 推出 AWR、算出 expectile 怎样趋向 in-support 的 max，并说出 FQL 为什么要 distill，就读完了这一页的讲义部分。
:::

### 只有 data，不能试

Offline RL 只有一个固定的 dataset $\mathcal D$，由某个 behavior policy $\pi_\beta$（人、旧的 controller、以前的 RL run）收集，training 期间不能再和环境交互。Lecture 17 说它可能超过 data 里最好的 trajectory，靠三件事：从质量参差的 data 里挑出好的部分；generalization；以及 stitching，把不同 trajectory 里好的片段接起来。例如 data 里有一条 A 到 B、一条 B 到 C，没有 A 到 C；BC 只能模仿其中某一条，value-based 的方法通过 B 处的 value 把两段接上。

难处是 counterfactual query。Policy improvement 要问“如果在这里做一个 data 里没有的 action，会怎样”，online RL 可以去试，offline 只能靠 Q-function 外推。

### Q-learning 在 data 外取 max

把这件事算出来。一个 state，自己转回自己，$\gamma=0.9$；action $a\in\{0,1,\dots,9\}$；dataset 里只有 $a=0$（reward 0）和 $a=1$（reward 1）。Q-function 是 linear 的，$Q(a)=w_0+w_1a$。Fitted Q-iteration 每轮的 target 是 $y(a)=r(a)+\gamma\max_{a'\in\{0..9\}}Q(a')$，在两个 data point 上 fit。两个 target 共用同一个 max，所以 fit 的结果是 $w_1=y(1)-y(0)=1$，$w_0=y(0)=\gamma\max Q=\gamma(w_0+9w_1)$：

| 第几轮 | 1 | 2 | 3 | 5 | 10 | 20 | 60 |
|---|---|---|---|---|---|---|---|
| $Q(9)$ | 9.0 | 17.1 | 24.4 | 36.9 | 58.6 | 79.1 | 89.8 |
| $Q(1)$ | 1.0 | 9.1 | 16.4 | 28.9 | 50.6 | 71.1 | 81.8 |

Fixed point 是 $w_0=9\gamma/(1-\gamma)=81$，$Q(9)=90$。Greedy policy 选 action 9，它从未出现在 data 里。如果 action 9 的真实 reward 是 0，按它行动得到的 return 是 0；而只在 data 的 action 里取 max（把 $\max$ 限制在 $\{0,1\}$），fixed point 是 $w_0=\gamma(w_0+1)$，即 $w_0=9$、$Q(1)=10$，正好是一直选 action 1 的真实 return。

Online 时这不是问题：policy 去试 action 9，拿到 0，Q 被纠正。Offline 时没有这一步，max 不断地挑 extrapolation 最乐观的地方，bootstrapping 再把它传回所有 state。Lecture 17 引了一张 SAC 在 offline data 上的图：critic 估的 Q 值（log scale）远高于 policy 实际的 performance。

::fig[cs285-ood] 动图，和开头那张相同。Linear Q-function 在两个 data point 上 fit，max 取在 data 之外的 $a=9$。看右边的读数和表对上：前几轮每轮涨 7 到 8，越往后涨得越慢，60 轮后整条 line 抬到 81 到 90；只在 data 的 action 上取 max（黑线），$Q(1)$ 停在真实值 10。

:::wrong Data 够多，overestimation 自然会消失
上面的例子里两个 data point 的 target 是 exact 的，没有任何 sampling noise，Q 照样涨到 90。再多 $a=0,1$ 的 data 也只是让这两个点 fit 得更准，丝毫不约束 $a=9$ 处的 extrapolation。Lecture 17 说 sampling error 和 function approximation error 在普通 RL 里就有，offline 时变得严重得多，因为没有新 data 来纠正。
:::

Lecture 17 列了对付它的三条原则：policy constraint（让 policy 留在 data 附近）；pessimism，即让 Q 不 overestimate，CQL 的做法是在 Q 的 loss 里加一项，压低当前 policy 所选 action 上的 Q、抬高 dataset action 上的 Q，于是 data 外的 action 不会显得比 data 里的好；以及更新时根本不 query OOD action（如 IQL）。HW5 的三个 algorithm 分别属于第一条、第三条，以及第一条的一个更好的实现。

### Policy constraint：BC 项

HW5 的 SAC+BC 在 actor loss 里加一个 behavioral cloning 项：

$$L(\pi)=\mathbb E\Big[-\tfrac12\sum_iQ_i(s,a^\pi)+\alpha\,\tfrac1{|\mathcal A|}\|a-a^\pi\|^2+\beta\log\pi(a^\pi\mid s)\Big]$$

$a$ 是 dataset 里的 action，$a^\pi$ 是 reparameterized sample。$\alpha$ 大，policy 贴着 data；$\alpha$ 小，policy 去追 Q。HW5 说 $\alpha$ 是最敏感的 hyperparameter，要逐个 task 调。BC 项对 action 维取 mean，如果写成 sum，等效的 $\alpha$ 就乘了 $|\mathcal A|$，handout 给的 grid 就对不上了。

“贴着 data”用什么量？Lecture 17 比较了两个方向的 KL。Behavior 是两个 mode 的 mixture $\tfrac12\mathcal N(-1,0.1^2)+\tfrac12\mathcal N(1,0.1^2)$，用一个 Gaussian 去 fit：最小化 $\mathrm{KL}(\pi_\beta\|\pi)$（mode covering）得到 moment matching 的 $\mathcal N(0,1.005^2)$，mean 落在两个 mode 中间 behavior density 几乎为 0 的地方；最小化 $\mathrm{KL}(\pi\|\pi_\beta)$（mode seeking）只盖住一个 mode。Lecture 17 说真正想要的是 support constraint：只禁止 behavior policy 不可能做的 action，在 data 支持的范围内随便选。它很难直接实现。MSE 形式的 BC 项和 forward KL 一样会把 unimodal 的 policy 拉向两个 mode 的中间，这是 FQL 要解决的问题。

### AWR：只在 dataset action 上做 weighted maximum likelihood

另一种实现 constraint 的办法不显式惩罚，而是把 constraint 问题解出来。对每个 $s$：

$$\max_\pi\ \mathbb E_{a\sim\pi}\big[A(s,a)\big]\qquad\text{subject to}\qquad\mathrm{KL}\big(\pi(\cdot\mid s)\,\|\,\pi_\beta(\cdot\mid s)\big)\le\epsilon$$

这和第 6 站的 KL-regularized objective 是同一个形式（$A$ 代替 $r$，$\pi_\beta$ 代替 $\pi_{\text{ref}}$，Lagrange multiplier $\lambda$ 代替 $\beta$），optimum 是

$$\pi^*(a\mid s)=\frac1{Z(s)}\pi_\beta(a\mid s)\exp\big(A(s,a)/\lambda\big)$$

$\pi_\beta$ 不知道，但不需要知道。把 $\pi^*$ project 到 parametric 的 $\pi_\phi$ 上，最小化 $\mathrm{KL}(\pi^*\|\pi_\phi)$，去掉和 $\phi$ 无关的 $\mathbb E_{\pi^*}[\log\pi^*]$：

$$\begin{aligned}\arg\min_\phi\mathrm{KL}(\pi^*\|\pi_\phi)&=\arg\max_\phi\mathbb E_{a\sim\pi^*}\big[\log\pi_\phi(a\mid s)\big]\\&=\arg\max_\phi\mathbb E_{a\sim\pi_\beta}\Big[\frac{\exp(A(s,a)/\lambda)}{Z(s)}\log\pi_\phi(a\mid s)\Big]\end{aligned}$$

最后一步是 importance sampling：$\pi^*/\pi_\beta=\exp(A/\lambda)/Z$，$\pi_\beta$ 消失了。$a\sim\pi_\beta$ 就是 dataset 里的 action。这是 advantage-weighted regression（AWR）：对 dataset 的 action 做 maximum likelihood，advantage 大的 weight 大。Actor 从不在 data 外的 action 上取值。HW5 的 IQL actor loss 就是它，$\alpha=1/\lambda$ 叫 inverse temperature，weight clip 在 $M=100$：

$$L(\pi)=\mathbb E_{(s,a)\sim\mathcal D}\Big[-\min\big(\exp(\alpha A(s,a)),\,M\big)\log\pi(a\mid s)\Big]$$

$\alpha=0$ 是纯 BC，$\alpha$ 很大时只模仿 advantage 最大的那些 action。

### IQL：用 expectile 代替 max

AWR 需要 $A=Q-V$，而 Q 本身的 target 里有 $\max_{a'}Q(s',a')$，又回到了 OOD action。Implicit Q-learning（IQL）把 max 换掉：$V(s)$ 不对所有 action 取 max，而是对 dataset 里出现过的 action 的 $Q(s,a)$ 取一个 upper expectile。

Random variable $X$ 的 $\tau$-expectile $m_\tau$ 是 asymmetric squared loss 的 minimizer：

$$m_\tau=\arg\min_m\mathbb E\big[\ell_\tau^2(X-m)\big],\qquad\ell_\tau^2(u)=\big|\tau-\mathbf 1(u<0)\big|\,u^2$$

$\tau=0.5$ 是普通的 MSE，$m$ 是 mean；$\tau>0.5$ 时，$X$ 高于 $m$ 的部分被加重。对 $m$ 求 derivative 令其为 0：

$$\tau\,\mathbb E\big[(X-m)_+\big]=(1-\tau)\,\mathbb E\big[(m-X)_+\big]$$

算一次。某个 state 上 dataset 里的 action 对应的 Q 值是 $0,1,2,5$，频率 $0.4,0.3,0.2,0.1$。$\tau=0.9$ 时试 $m=2.889$：左边 $0.9\times0.1\times(5-2.889)=0.190$，右边 $0.1\times(0.4\times2.889+0.3\times1.889+0.2\times0.889)=0.1\times1.900=0.190$，相等。

| $\tau$ | 0.5 | 0.7 | 0.9 | 0.99 | 0.999 |
|---|---|---|---|---|---|
| $m_\tau$ | 1.200 | 1.714 | 2.889 | 4.648 | 4.962 |

$\tau\to1$ 时趋向 5，即 data 里的 max。IQL 论文的 Lemma 1：bounded 的 random variable，$\tau\to1$ 时 expectile 趋向它的 supremum。用在 Q 上，$V(s)$ 趋向“data 支持的 action 里最好的那个”的 value，整个过程只在 dataset 的 $(s,a)$ 上算 loss。上面 linear Q 的例子里，$V$ 取 $\{Q(0),Q(1)\}$ 的高 expectile，fixed point 就是 $Q(1)=10$ 那一个。

::fig[cs285-expectile] 这个四点 distribution 的 $m_\tau$ 随 $\tau$ 的变化：从 mean 1.2 出发，单调上升，趋向 data 里的最大值 5，从不超过它。

HW5 的三个 loss（$\tau=0.9$，两个 target Q 取 min）：

$$L(V)=\mathbb E\big[\ell_\tau^2\big(\min_i\bar Q_i(s,a)-V(s)\big)\big],\qquad L(Q)=\sum_i\mathbb E\big[\big(Q_i(s,a)-r-\gamma V(s')\big)^2\big]$$

加上上面的 AWR actor loss。为什么要分开 $V$ 和 $Q$，不直接对 $r+\gamma V(s')$ 取 expectile？因为 $s'$ 也是 random 的：对 $r+\gamma V(s')$ 取高 expectile，会同时对“哪个 action”和“运气好转到哪个 next state”取乐观，后者不是 agent 能选的。$Q$ 用普通 MSE 对 $s'$ 求平均，$V$ 的 expectile 只作用在 action 的选择上。

### FQL：flow policy 负责 BC，one-step policy 负责 Q

回到 BC 项的问题：behavior 是 multimodal 的，Gaussian policy 的 MSE 项把它拉向两个 mode 的中间。第 1 站已经有了能表示 multimodal behavior 的 flow policy $\pi_v$。直接在 SAC+BC 里用它（HW5 称之为 FBRAC）要让 $Q$ 的 gradient 穿过 10 步 Euler 的 ODE solver，相当于 backpropagation through time，FQL 论文说这既不稳定又贵。

FQL 的办法是两个 policy 分工。$\pi_v$ 只做 flow matching 的 BC（第 1 站的 loss，对 action 维取 mean）。另一个 one-step policy $\pi_\omega(s,z)$ 把 noise $z$ 一步映成 action，它的 loss 是

$$L(\pi_\omega)=\mathbb E\Big[-\tfrac12\sum_iQ_i\big(s,\pi_\omega(s,z)\big)+\frac{\alpha}{|\mathcal A|}\big\|\pi_\omega(s,z)-\pi_v(s,z)\big\|^2\Big]$$

$\pi_v(s,z)$ 是同一个 $z$ 经过 10 步 Euler 得到的 action，distillation 项不对它求 gradient，$Q$ 项只对 $\pi_\omega$ 做一次普通的 backward pass。关键在 distillation 是按 $z$ 对齐的：在第 1 站 $\pm1$ 的例子里，$\pi_v(s,z)$ 对 $z>0$ 给出 $+1$ 附近、对 $z<0$ 给出 $-1$ 附近，所以 $\pi_\omega$ 学的是“正的 $z$ 去右边的 mode、负的 $z$ 去左边的 mode”，每个 target 都在 data 的 support 里，不会被拉到中间；$Q$ 项再在各个 mode 内往高处推。Critic 的 target 和 evaluation 都用 $\pi_\omega$。FQL 论文在 OGBench 的 antsoccer 任务上平均 60，IQL 8，ReBRAC 0。

### Q 值的 sanity check

HW5 的 reward 每步是 $-1$ 或 $0$，$\gamma=0.99$。所以 Q 一定在 $[-1/(1-\gamma),\,0]=[-100,0]$ 里。离 goal 还有 $n$ 步、每步 $-1$ 时，

$$Q=-\sum_{l=0}^{n-1}\gamma^l=-\frac{1-\gamma^n}{1-\gamma}$$

| 还要走的步数 $n$ | 10 | 50 | 100 | 200 |
|---|---|---|---|---|
| $Q$ | $-9.6$ | $-39.5$ | $-63.4$ | $-86.6$ |

HW5 说 antmaze 和 antsoccer 上 batch 里的 q_max 应趋向 0、q_min 趋向 $-100$，cube-single 上 q_min 可能停在 $-50$ 到 $-70$，按上表大约对应 70 到 120 步之外的 state。Q 跑出 $[-100,0]$，或者长期贴在 $-100$，先查 Bellman backup 里有没有乘 $(1-d)$、reward 的 sign 对不对。

:::back
Flow matching policy 在[第 1 站](#il)；AWR 的 Lagrangian 和[第 6 站](#llm)的 KL-regularized optimum 是同一个推导；$\max$ 带来的 overestimation 的 online 版本在 [RB4301](../courses/RB4301.html#ac)。
:::

:::from
Offline RL 的设定、三种超过 data 的机制、counterfactual query、SAC 的 overestimation 图、三条原则、forward 与 reverse KL、support constraint 来自 [Spring 2026 Lecture 17](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-17.pdf)（只读到文字）。Lecture 18 抓取被拒，没有读到；explicit 与 implicit constraint、AWR 由 duality 得到、IQL 的问法用的是 [Fall 2023 Lecture 16](https://rail.eecs.berkeley.edu/deeprlcourse-fa23/deeprlcourse-fa23/static/slides/lec-16.pdf) 的文字，AWR 的 Lagrangian 推导 slides 上是图，按自己的知识补全。Expectile loss、三个 loss 和 Lemma 1 来自 [IQL 论文](https://ar5iv.arxiv.org/html/2110.06169)；FQL 的动机、loss 和 antsoccer 的数字来自 [FQL 论文](https://arxiv.org/pdf/2502.02538)；SAC+BC、IQL、FQL 在作业里的具体写法和 Q 值范围来自 [HW5 handout](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw5.pdf)。Linear Q 的例子、expectile 的数表、两种 KL fit、Q 与步数的对照是为这一页算的；“分开 $V$ 和 $Q$ 是为了不对 transition 的运气乐观”是凭自己对 IQL 论文的理解写的，读到的部分没有这句话。
:::

## 作业

五份作业都在 GitHub 的 `berkeleydeeprlcourse/homework_spring2026` 里，handout 公开。所有命令都用 `uv run` 执行（每个作业带 `pyproject.toml` 和 `uv.lock`）；autograder 在 Gradescope、Modal 的算力额度只给注册学生，自学时没有人给分，用 handout 里的目标数字当 test。下面每条提示后面注明来源：handout 指对应作业的 PDF，“调研”指本站调研条目里核对过的说法，“经验”是没有官方出处的工程经验。

| 作业 | 本地 CPU | 需要 GPU 的部分 | 免费 Colab | 优先级 |
|---|---|---|---|---|
| HW1 Imitation | 够，几分钟一个 run | 无 | 够 | 先做 |
| HW2 Policy gradient | 够，每个 run 几秒到约 10 分钟 | 无 | 够 | 值得做 |
| HW3 DQN 与 SAC | CartPole、LunarLander、InvertedPendulum、Hopper 够 | MsPacman、HalfCheetah 在 GPU 上约 3 小时一个 run | 勉强，长 run 会断 | 先做 |
| HW4 LLM RL | 不够 | 全部，约 8 个 H100 小时 | 不够 | 值得做 |
| HW5 Offline RL | 不够 | 全部，单个 run 最长约 6 小时 | T4 算力够，会话会断 | 先做 |

### 环境：uv、MuJoCo 与没有显示器的服务器

- 每个作业目录里 `uv sync` 装好依赖，之后一律 `uv run ...`；HW1、HW4 要 WandB 账号，HW3、HW4 的 Modal 先 `uv run modal token new` 登录（handout）。
- HW2、HW3 的 HalfCheetah-v4、InvertedPendulum-v4、Hopper-v4 是 Gymnasium 的 MuJoCo 环境，用 pip 的 `mujoco` 包，不需要 license，也不需要旧的 `mujoco-py`（调研）。
- LunarLander 依赖 Box2D，`box2d-py` 从源码编译时需要系统里有 `swig`，装不上时先装 swig（经验）。
- 在没有显示器的服务器上录 MuJoCo 视频，设 `MUJOCO_GL=egl`（有 NVIDIA driver）或 `MUJOCO_GL=osmesa`，否则会报 OpenGL 相关的错（调研，经验）。
- 仓库根目录的 README 这一页没有抓到，具体的 Python 版本以 README 为准。

### HW1：Imitation learning（Push-T 上的 MSE chunking policy 与 flow matching policy）

**要实现的**：Push-T 的 observation 是 5 维（T 和 agent 的位置），action 是 2 维（agent 的目标位置）。在 `model.py` 里写 `MSEPolicy`（一次输出 $K$ 步的 action chunk，loss 是 handout 的 Eq. 1）和 `FlowMatchingPolicy`（loss 是 Eq. 2，inference 用 Eq. 3 的 Euler），在 `train.py` 里写 training loop。**做完会的**：[第 1 站](#il)的全部内容，亲眼看到 MSE policy 在 T 两侧都能推时的表现和 flow policy 的区别。**时间和算力**：handout 说小 MLP 在笔记本 CPU 上几分钟训完。**优先级**：先做。

- Flow matching 的 network 必须以 $\tau$ 为 input（handout）。漏掉时会发生什么，第 1 站在一维的例子上算过：12% 的 sample 停在两个 mode 中间。
- 训练中要周期性调用 `evaluate_policy`，不要改它；结束时调用 `logger.dump_for_grading()`（handout）。
- 目标：MSE policy 的 reward 至少 0.5，flow policy 至少 0.7（handout）。
- Optimizer 用 PyTorch 自带的 Adam，train step 加 `torch.compile`，handout 说提速明显。
- 报告要求根据视频比较两种 policy。MSE policy 学的是 conditional mean，T 两侧都可以推的 state 上它会输出两种推法的平均；从这里入手看视频（调研里的理解，handout 没有给结论）。

### HW2：Policy gradients（reward-to-go、baseline、GAE）

**要实现的**：`pg_agent.py` 里 full return 与 reward-to-go 两种 $Q$ 值、neural network baseline、advantage normalization、GAE 的 recursion；四个实验分别在 CartPole-v0、HalfCheetah-v4、LunarLander-v2（noisy action）、InvertedPendulum-v4 上。**做完会的**：[第 2 站](#pg)、[第 3 站](#ac)的每一个 formula 都写成代码，并用曲线看到 causality、baseline 和 $\lambda$ 的作用。**时间和算力**：每个 run 在笔记本 CPU 上几秒到约 10 分钟，handout 明确建议用 CPU 而不是云 GPU，把额度留给后面的作业。**优先级**：值得做（第 4 站以后都建立在它上面，但概念比代码重要）。

- 画图的横轴用 `Train_EnvstepsSoFar`，不是 iteration；InvertedPendulum 要求在 100K 个 environment step 内到 1000（handout）。
- Seed 之间 variance 很大，正确的实现也可能出一次坏 run；handout 说 2 到 3 次之内应该能拿到达标的 run，否则回头查实现。
- LunarLander 扫 $\lambda\in\{0,0.95,0.98,0.99,1\}$ 时不要动其他 hyperparameter（handout）。
- 目标值：CartPole 最好的配置到 200；HalfCheetah 带 baseline 最终超过 300；LunarLander 最好的 $\lambda$ 至少一次超过 150（handout）。
- Advantage 在乘进 pseudo-loss 之前要 detach，否则 gradient 会流进 baseline network；pseudo-loss 的数值不说明任何问题，看 return（经验，第 2 站）。
- `-na`（advantage normalization）在简单环境里常常能代替 baseline，handout 在 HalfCheetah 实验里故意不加它，就是为了让你看到 baseline 的作用。

### HW3：Q-learning 与 actor-critic（DQN、Double DQN、SAC）

**要实现的**：DQN 的 critic update、$\varepsilon$-greedy、target network、Double DQN；SAC 的 bootstrapped critic（hard 与 soft target update）、entropy bonus、reparameterized actor、自动 temperature、clipped double-Q。**做完会的**：[第 4 站](#q)的全部，以及一套以后可以直接拿去做机器人 RL 的 off-policy 代码。**时间和算力**：CartPole、LunarLander、InvertedPendulum、Hopper 本地即可；MsPacman 和 HalfCheetah 即使在 GPU 上也约 3 小时一个 run，handout 建议用 Modal 并尽早开始。没有课程额度时用实验室 GPU；Colab 免费版的会话时长有限，3 小时的 run 要能断点续训（经验）。**优先级**：先做。

- Critic 的 sanity check（InvertedPendulum，没有 actor）：Q 值应稳定在一个合理的值；发散到无穷大或一直是 0 就是 bug（handout）。
- Entropy 的 sanity check：只让 entropy 驱动 actor 时，1 维 tanh-squashed action 的 entropy 应升到约 $\log2\approx0.69$（handout）。一路涨过 1，多半漏了 tanh 的修正项；停在很低，查 sign（经验，第 4 站的表）。
- Actor loss 里用 `.rsample()`，不要用 `.sample()`（handout）。
- 别忘了在 `update()` 里调用 `update_actor()` 和 `update_alpha()`（handout）。
- MsPacman 用默认 config（double Q 开着）应能到约 1500，到不了多半是实现的问题（handout）。
- 长 run 用 Modal 时加 `--detach`，结果用 `uv run modal volume get hw3-ql-volume exp/` 下载（handout）。
- Hopper 上比较 single Q 与 clipped double Q 时把 Q 值曲线也画出来，overestimation 在 Q 值上比在 return 上明显（handout 要求画，读法是经验）。

### HW4：LLM RL（GR-REINFORCE 与 GRPO）

**要实现的**：token log-probability 与 completion mask、approximate KL、minibatch iteration、group advantage、`Reinforce.update` 和 `GRPO.update`；在 format copy（把一个整数抄进 XML）和 MATH level-5 子集上做 outcome reward 的 post-training，加至少 5 个 GRPO 的 hyperparameter 变体。**做完会的**：[第 6 站](#llm)的全部，以及 LLM RL 代码里最容易错的 mask 和对齐。**时间和算力**：format copy 约 5 分钟，math 的 GR-REINFORCE 约 2 小时，GRPO 约 5 小时；handout 说整份作业约 8 个 H100 小时，建议不超过 Modal 额度的三分之一。免费 Colab 不够；自学者要自付 GPU 费用或用实验室的卡。**优先级**：值得做；如果目标是 VLA 和 LLM 的 post-training，提前到先做。

- 先跑 format copy 调通再跑 math。format copy 结束时 reward 接近 1.3、eval exact match 接近 1.0，eval 明显低于 0.8 就要 debug（handout）。
- Reward 到第 10 步左右还没涨，先查 mask 和 logprob 的对齐：position $t-1$ 的 logits 预测 token $t$（handout）。
- RL 之前 math 的 eval 应约 0.23；远低于它，先查 generation 和 parsing，不是 RL 的问题（handout）。
- 目标：math GRPO 最终 eval 超过 0.37（低于约 0.35 要查），GR-REINFORCE 约 0.31（低于约 0.27 要查）。Rollout reward 本来就很吵，比较 algorithm 看 eval 曲线（handout）。
- Group normalization 之前把 reward reshape 成 `[num_groups, group_size]`；GRPO 的 ratio 用 rollout 时缓存的 logprob（handout）。
- 四条必跑命令不能改任何 flag，autograder 依赖它们（handout）。
- 读 WandB 里的 sampled generation：一组 8 个回答 reward 全相同时 advantage 全是 0，这类 group 多，学得就慢（经验，第 6 站的表）。

### HW5：Offline RL（SAC+BC、IQL、FQL，OGBench）

**要实现的**：`sacbc_agent.py`、`iql_agent.py`、`fql_agent.py`，在 OGBench 的 cube-single 和 antsoccer-arena 上调 $\alpha$；antmaze-medium 只用来 debug。**做完会的**：[第 8 站](#offline)的全部，三种“用固定 data 做 RL”的主流做法各写一遍，其中 FQL 把第 1 站的 flow policy 接上了 Q-learning。**时间和算力**：单个 run 最长约 6 小时；handout 建议一张 GPU 并行跑 4 个 agent，4 个 agent 到 1M 步在 T4 上 3 到 7 小时、A10 上 2 到 6 小时，视 algorithm 而定。T4 级别的卡就够，但免费 Colab 的会话会断，要每隔固定步数把 agent、optimizer 和 replay buffer 的内容存到 Google Drive，重连后从最近的 checkpoint 继续（调研，经验）。**优先级**：先做。

- 每个 Bellman backup 都要带 done（handout）。
- BC 项对 action 维取 mean，handout 给的 $\alpha$ grid 是按 mean 定的（handout）。
- Q 值的 sanity check：都应在 $[-100,0]$ 里；antmaze 和 antsoccer 上 q_max 趋向 0、q_min 趋向 $-100$；cube-single 的 q_min 可能停在 $-50$ 到 $-70$（handout）。
- 跟踪 dataset action 与 policy action 的 MSE：它随 $\alpha$ 增大而下降，最好的 $\alpha$ 通常在 MSE 略高于纯 BC 下限的地方（handout）。
- FQL：送进 Q 之前把 flow policy 的 action clip 到 $[-1,1]$；distillation 项里不要 clip one-step policy 的 action，否则它没法纠正越界的输出；evaluation 和 backup 都用 one-step policy（handout）。
- antsoccer-arena 上 FQL 和 SAC+BC 的 target 用两个 Q 的平均而不是 min；成功率低是正常的，但不应该是 0（handout）。
- Debug 时可以关掉 `@torch.compile`；antmaze-medium 是最快的 sanity check（handout）。

### RL 不报错但不学：先查这几样

1. 横轴是 environment step 吗？多跑了几个 seed 吗？单个 seed 的好坏说明不了问题（HW2、HW3 handout）。
2. Q 值有没有发散、是不是一直是 0、有没有跑出 reward 决定的范围（HW3、HW5 handout）。
3. Bellman target 里有没有 $(1-d)$；episode 是终止还是被时限截断（HW3、HW5 handout；截断凭经验，第 3 站）。
4. Advantage 有没有 detach、sign 对不对；pseudo-loss 的数值别当成 performance（经验）。
5. Reparameterized sample 用的是 `.rsample()` 吗；tanh 的 log-probability 修正加了吗（HW3 handout；第 4 站）。
6. LLM 的 loss 有没有只算 completion token，logits 和 token 有没有错一位（HW4 handout）。
7. 拿 handout 的目标数字比；比不上而且换了 2 到 3 个 seed 仍然比不上，回头查实现，而不是调 hyperparameter（HW2、HW3 handout）。

:::note 专门练习找这类 bug
OpenAI Spinning Up 的 Exercise 2.2 “Silent Bug in DDPG” 给一份能跑、不报错、performance 却明显变差的 DDPG，让你找出 bug。CPU 就够，需要 MuJoCo 环境（它用的是旧版的 HalfCheetah-v2 等，安装比 CS285 麻烦）。做完 HW3 之后做它，正好检验上面这张清单。
:::
