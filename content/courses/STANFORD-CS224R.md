---
code: STANFORD-CS224R
evidence: syllabus
evidenceNote: "前沿公开课，没有 NUS 大纲。分站和讲次以 Stanford CS224R Spring 2026（Chelsea Finn）的课表为准，作业以 Spring 2026 的 HW1–HW3 handout 和 default project guidelines 为准。课程网站不能直接下载（代理拒绝），所有 slides 和 handout 都是通过抓取工具读的：工具不肯给逐字原文，返回的是逐页的结构化转述（含公式、数字、引用的论文）。第一版只读过一次转述；这一版对 Lecture 7、8、11、12、13、16、17 的 slides 和三份 handout 各重读了一遍，并逐条追问页面上用到的公式、记号、数字和例子是否真在 slides 上，查出的出入都已改正（见各站 `:::from`）。新读了 compute guide、default project guidelines，以及 DSRL、EXPO、MBPO、HER、RMA 五篇论文的相关章节。仍然读不到的：slides 里图的内容和讲者口头的解释；Spring 2026 录像只在 Canvas，Spring 2025 的 YouTube 录像没有看；starter code 的 zip 抓取工具读不了。各站的数值例子是自己构造并用代码算的。"
exam: "注册学生：三份作业共 40%（HW1 10%、HW2 15%、HW3 15%），project 35%，5 月 15 日的 in-class exam 25%，另有最多 2% 的 extra credit（课程主页）。自学没有考试，以作业为主；autograder 在 Gradescope，算力由课程发 Modal 额度，自学时都没有，用 handout 里的达标线自查。"
subskills:
  - id: offline
    name: Offline RL 与 imitation：filtered BC、AWAC 与 stitching
    l3: "能在一个小 grid 的 dataset 上说出 filtered BC、BC 和 offline RL 各自从起点走哪条路，并写出 AWR 的 weighted maximum likelihood。"
    l4: "能对一个 tabular 的 dataset 手算 AWR 和 AWAC 的前两次 iteration，说明 AWR 为什么只能评估 behavior policy，并算出 IQL 的 expectile 在 $\\zeta=0.2$ 和 $0.9$ 时的值。"
    l5: "能说清 stitching 需要 dataset 满足什么、filtered BC 为什么做不到，并解释 HW3 里 PointMass 的 −46 这条线意味着什么。"
  - id: reward
    name: Reward learning：goal classifier、VICE 与 preference
    l3: "能写出 goal classifier 当 reward 的做法和 Bradley–Terry 的 preference likelihood。"
    l4: "能用一个一维例子说明 classifier 为什么会被 policy 钻空子，并手算 VICE 加 negative 之后 argmax 怎样移回 goal；能对一对 trajectory 算一步 reward model 的 gradient。"
    l5: "能解释 balanced batch 下 goal 处的 $p$ 为什么趋向 0.5 而仍然是最大值，以及 preference 只能确定 reward 到一个 constant 为止。"
  - id: mbrl
    name: Model-based RL：Dyna、short rollout 与 ensemble
    l3: "能写出 Dyna 式 model-based policy optimization 的四步循环，和 planning 加 terminal value 的式子。"
    l4: "能由每步 error 和 Lipschitz constant 推出 $k$ 步 rollout 的 error bound，说明 MBPO 为什么从 data 的 state 出发做短 rollout。"
    l5: "能用 ensemble 的分歧判断 model 在哪里不可信，并说明分歧小为什么不等于 model 对，以及什么时候不值得学 model。"
  - id: mtrl
    name: Multi-task 与 goal-conditioned RL：weight sharing 与 hindsight relabeling
    l3: "能把 multi-task RL 写成 state 里加上 task identifier 的单个 MDP，并写出 goal-conditioned reward。"
    l4: "能对一条 trajectory 做 final 和 future 两种 relabeling 并算出新的 reward，说出 relabeling 成立的三个条件；能算出 stratified sampling 把 gradient variance 降多少。"
    l5: "能解释 relabeling 为什么只适用于 off-policy algorithm，以及 tabular 的 HER 为什么仍然解不了没到过的 goal。"
  - id: meta
    name: Meta-RL：in-context adaptation 与 exploration
    l3: "能写出 black-box meta-RL 的 meta-training 和 meta-test 步骤，说明为什么 reward 必须作为 input。"
    l4: "能在 hallway 的例子上算出 posterior sampling、先读 sign 和“读了 sign 却不会用”三种 strategy 的 expected 步数。"
    l5: "能用这三个数解释 exploration 和 exploitation 的 coupling 为什么会让 end-to-end 训练停在 local optimum，以及 DREAM 怎样拆开它。"
  - id: robot
    name: RL for robots：sim-to-real 与 VLA 的 RL fine-tuning
    l3: "能说出 VLA 做 RL fine-tuning 的两组障碍（model 太大；用 imitation pretrain），和 sim-to-real gap 的 parametric 与 non-parametric 两类。"
    l4: "能由每个子步骤的 success rate 算出整体 reliability，并在一维例子上比较 DSRL 的 latent steering 和 EXPO 的 action edit 能到达哪些 action。"
    l5: "能说清为什么 DSRL 永远不离开 base policy 的 support、EXPO 为什么要在 base 和 edit 的 candidate 里取 Q 最大的那个。"
open:
  - label: "Stanford CS224R Deep Reinforcement Learning（Spring 2026，Chelsea Finn）课程主页"
    url: "https://cs224r.stanford.edu"
    note: "讲次表（slides 文件编号 1–13、15–18，Hierarchical RL 是 15 号）、作业的发布与截止、评分比例、compute guide 和 project 的链接。"
  - label: "CS224R Lecture 7: Offline RL（slides）"
    url: "https://cs224r.stanford.edu/slides/07_cs224r_offline_rl_2026.pdf"
    note: "第 1 站的问题设定、s1 到 s9 的 stitching grid、filtered BC、AWR、AWAC（含 $a'\\sim\\mathcal D$ 的 alternative）、IQL 的 expectile 记号和三条 takeaway。读了两遍工具的逐页转述，第二遍逐条核对了 expectile 的定义方向和 $\\lambda<0.5$；slides 没有数值例子，grid 上也没有画出具体 trajectory。"
  - label: "CS224R Lecture 8: Reward Learning（slides）"
    url: "https://cs224r.stanford.edu/slides/08_cs224r_reward_learning_2026.pdf"
    note: "第 2 站的 goal classifier、被 exploit 的问题、VICE（Fu et al. 2018）的 50/50 batch、Sharma et al. 2023 的 50 条 demo 与 26%、62%、preference 的 likelihood 和 $\\binom k2$ 的循环、900 次 query。读了两遍转述；slides 没有 inverse RL 或 GAIL，没说 classifier reward 用 $p$ 还是 $\\log p$，也没说 Christiano 的 900 次是什么任务。"
  - label: "CS224R Lecture 11: Model-Based RL（slides）"
    url: "https://cs224r.stanford.edu/slides/11_cs224r_mbrl_2026.pdf"
    note: "第 3 站 Dyna 式循环、distribution mismatch、三种 augmentation 的选择、从 data 的所有 state 出发做 partial rollout、rollout length 1 到 25、ensemble、Planning V1/V2、Nagabandi 和 AlphaGo 两个例子、什么时候用 model。读了两遍转述；slides 没有 error bound 的推导。"
  - label: "CS224R Lecture 12: Multi-Task and Goal-Conditioned RL（slides）"
    url: "https://cs224r.stanford.edu/slides/12_cs224r_mtrl_gcrl_2026.pdf"
    note: "第 4 站 task 的定义、$s=(\\bar s,z_i)$、stratified sampling、relabeling 的三个条件和两个版本的 algorithm。读了两遍转述；slides 没有 gradient conflict，也没有 final/future 这两个名字（来自 HER 论文）。"
  - label: "CS224R Lecture 13: Meta-RL（slides）"
    url: "https://cs224r.stanford.edu/slides/13_cs224r_metarl_2026.pdf"
    note: "第 5 站的问题设定、black-box 方法的步骤和代表方法表、POMDP 的看法、hallway 的 running example、coupling 问题、PEARL、MetaCURE、DREAM。读了两遍转述；optimization-based 方法在 slides 上只有一个标签，没有内容；hallway 的几何 slides 没有给。"
  - label: "CS224R Lecture 16: Sim2Real Robot Learning（Guanya Shi，slides）"
    url: "https://cs224r.stanford.edu/slides/16_cs224r_sim2real_robot_learning_2026.pdf"
    note: "第 6 站 sim-to-real 的标准做法、gap 的两类、domain randomization、learning to adapt、asymmetric actor-critic（FALCON）、real2sim 和 human data。读了两遍转述，只有条目，没有推导。"
  - label: "CS224R Lecture 17: RL for VLAs（slides）"
    url: "https://cs224r.stanford.edu/slides/17_cs224r_rl_vlas_2026.pdf"
    note: "第 6 站 80% 与 99%、两组障碍、online 与 offline 的 iteration、PPO、π*0.6、DSRL、EXPO 和它们的数字。读了两遍转述。"
  - label: "Wagenmaker et al. 2025, Steering Your Diffusion Policy with Latent Space RL（DSRL，arXiv HTML）"
    url: "https://arxiv.org/html/2506.15799v2"
    note: "第 6 站 latent-action MDP 的定义、DSRL-NA 的两个 critic、noise 的 box 约束 $[-b_{\\mathcal W},b_{\\mathcal W}]$ 和取值、Limitations。读了正文和附录的相关部分（工具转述）。"
  - label: "Dong et al. 2026, EXPO: Stable RL with Expressive Policies（arXiv HTML）"
    url: "https://arxiv.org/html/2507.07986v2"
    note: "第 6 站 edit policy 的形式和 $\\beta$、on-the-fly policy 的 $2N$ 个 candidate、backup 用 OTF policy。读了方法一节（工具转述）。"
  - label: "Janner et al. 2019, When to Trust Your Model（MBPO，arXiv PDF）"
    url: "https://arxiv.org/pdf/1906.08253v3"
    note: "第 3 站：每一步从 7 个 model 的 ensemble 里均匀随机选一个、rollout length 的 schedule、Theorem 4.3 的 bound。工具转述，Table 1 部分乱码。"
  - label: "Andrychowicz et al. 2017, Hindsight Experience Replay（arXiv PDF）"
    url: "https://arxiv.org/pdf/1707.01495v3"
    note: "第 4 站 final、future、episode、random 四种 strategy 的定义和 $k=4$。只问了这几处。"
  - label: "Kumar et al. 2021, RMA: Rapid Motor Adaptation for Legged Robots（ar5iv）"
    url: "https://ar5iv.labs.arxiv.org/html/2107.04034"
    note: "第 6 站 RMA 的两阶段训练、$e_t$、$z_t$、50 步 history 和两个 module 的频率。"
  - label: "CS224R Spring 2026 Homework 1: Imitation Learning（handout）"
    url: "https://cs224r.stanford.edu/material/hw1/CS224R_2026_Homework_1.pdf"
    note: "作业一节。读了两遍转述。"
  - label: "CS224R Spring 2026 Homework 2: Online RL（handout）"
    url: "https://cs224r.stanford.edu/material/hw2/CS224R_2026_Homework_2.pdf"
    note: "作业一节。读了两遍转述；转述里没有 $\\alpha$、$\\gamma$、$\\varepsilon$、KL 系数和 PPO 的 epoch 数。"
  - label: "CS224R Spring 2026 Homework 3: Offline RL（handout）"
    url: "https://cs224r.stanford.edu/material/hw3/CS224R_2026_Homework_3.pdf"
    note: "第 1 站 IQL 的 $\\zeta$ 记号；作业一节。读了两遍转述。"
  - label: "CS224R Default Project Guidelines（RL fine-tuning of LMs）"
    url: "https://cs224r.stanford.edu/material/CS224R_Default_Project_Guidelines.pdf"
    note: "作业一节的 default project。"
  - label: "CS224R Compute Guide"
    url: "https://cs224r.stanford.edu/material/CS224R_compute_guide.pdf"
    note: "作业一节开头的 Modal 提示。"
sources:
  - label: "CS224R Spring 2025 录像 playlist（YouTube；本页没有看）"
    url: "https://www.youtube.com/playlist?list=PLoROMvodv4rPwxE0ONYRa_itZFdaKCylL"
---

先看三次训练。三次都没有报错，algorithm 也都照着 formula 写对了。

**第一次。** 一个 3×3 的 grid，dataset 里只有三条 trajectory，从起点 s1 出发的那两条，一条掉进 −1，一条什么也没拿到。对这些 data 做 behavior cloning，policy 从 s1 出发的 expected return 是 −0.02。可是 data 里明明藏着一条 return 0.729 的路：沿第一条走到中间，换到另一条上。BC 永远找不到它，只挑 return 高的 trajectory 来模仿也找不到，因为那条高的 trajectory 根本不经过 s1。

::fig[cs224r-stitch] 三条 trajectory 和藏在它们中间的那条路。每一步都在 data 里出现过，整条路没有。第 1 站细讲。

**第二次。** 任务的 reward 写不出来，于是收集一些成功的 state 当 positive、一些失败的 state 当 negative，train 一个 classifier，用它输出的 probability 当 reward。Classifier 在 goal 上打 0.925 分，很准。Policy 却跑到了 $x=3$，那里离 goal 很远，classifier 给它打了 1.000 分。

::fig[cs224r-classifier] Classifier 只学过左右两堆例子，对右边没人去过的地方给出了最高分。第 2 站细讲。

**第三次。** 一条 16 个 state 的 chain，从 0 出发，每个 episode 随机给一个 goal，到达时 reward 为 1，其余为 0。Tabular Q-learning 训练 600 个 episode，buffer 里只有 4.1% 的 transition 带着非零的 reward，其余的 transition 对它们当时的 goal 没有任何信息。可是一条没到达 goal 12 的 trajectory，确实到达了 5，也路过了 3。

::fig[cs224r-chain] 一条“失败”的 trajectory。对 goal 12 它没有信息，对 goal 5 它是一条完整的成功示范。第 4 站细讲。

三件事背后是同一个问题：RL 需要的东西（新的 data、reward、到达 goal 的经验）很贵，手里已有的东西（旧的 data、几个例子、失败的 trajectory）又没被用上。CS224R 后半学期的每一讲都可以读成在回答“已有的东西还能怎样多用一点”：offline RL 用别人的 data，reward learning 用例子和比较代替 reward function，model-based RL 用 data 学一个 simulator 再从里面要 data，multi-task RL 让一个 task 的 data 给别的 task 用，meta-RL 让以前的 task 教会 agent 怎样更快地学新 task，最后两讲把这些用到真的 robot 和 VLA 上。

| 站 | Spring 2026 讲次 | 多用了什么 | 麻烦在哪 | 办法 |
|---|---|---|---|---|
| 1 Offline RL | Lecture 7 | 固定的 dataset | data 外的 action 没法评估；最好的路不在任何一条 trajectory 里 | 只在 dataset action 上加权模仿；用 Q 把片段接起来 |
| 2 Reward learning | Lecture 8 | 成功的例子、人的比较 | learned reward 在没见过的 state 上乱给分 | 把 policy 到过的 state 当 negative；用 pairwise preference |
| 3 Model-based RL | Lecture 11 | 学到的 dynamics | model 的 error 随 rollout 变长而放大 | 从 data 的 state 出发做短 rollout；ensemble；terminal value |
| 4 Multi-task RL | Lecture 12 | 别的 task 的 data | reward 只对原来的 task 有意义 | 换掉 task identifier，重算 reward |
| 5 Meta-RL | Lecture 13 | 以前的 task distribution | 先 explore 后执行，两者互相依赖 | in-context 的 policy；把 exploration 拆出来单独训练 |
| 6 RL for robots | Lecture 16–17 | simulation、pretrained VLA | sim 和 real 不同；VLA 太大，没有 critic，没有现成的 log-probability | randomization 与 adaptation；在 noise 或 action 上加一个小 policy |

CS224R 的前半学期（Lecture 1–6 的 imitation learning、policy gradient、actor-critic、off-policy actor-critic、Q-learning，Lecture 9–10 的 RL for LLMs）和本站已有的几页重合，这一页不再讲，只在用到时链接过去：

| CS224R 讲次 | 去哪里看 |
|---|---|
| 1–2 MDP、Imitation Learning（BC、flow matching、DAgger） | [CS4246 的 mdp 站](../courses/CS4246.html#mdp)，[CS285 的 il 站](../courses/BERKELEY-CS285.html#il) |
| 3 Policy Gradients | [CS4246 的 pg 站](../courses/CS4246.html#pg)，[CS285 的 pg 站](../courses/BERKELEY-CS285.html#pg) |
| 4 Actor-Critic（GAE） | [CS285 的 ac 站](../courses/BERKELEY-CS285.html#ac)，[MODERN-RL 的 ppo 站](../courses/MODERN-RL.html#ppo) |
| 5 Off-Policy Actor Critic（SAC、多个 critic、UTD） | [CS285 的 q 站](../courses/BERKELEY-CS285.html#q)，[MODERN-RL 的 offpolicy 站](../courses/MODERN-RL.html#offpolicy) |
| 6 Q-learning | [CS4246 的 td、fa 两站](../courses/CS4246.html#td)，[CS285 的 q 站](../courses/BERKELEY-CS285.html#q) |
| 9–10 RL for LLMs（RLHF、DPO、reasoning） | [CS285 的 llm 站](../courses/BERKELEY-CS285.html#llm)，[MODERN-RL 的 finetune 站](../courses/MODERN-RL.html#finetune) |

Lecture 15（Hierarchical RL and IL；课表里没有 14 号 slides，那一周的星期五是 in-class exam）和 Lecture 18（Frontiers）这一页没有写。快速路线（只有十几个小时）按调研条目的建议：Lecture 2、3–5、7、16–17 加 HW2；本页里必读的是第 1 站和第 6 站，每站开头的 `:::skip` 写明了这一点。

## [offline] Offline RL 与 imitation：filtered BC、AWAC 与 stitching

:::skip
快速路线必读，HW3 全靠这一站。能在下面的 grid 上说出 BC、filtered BC、AWR、AWAC 各自从 s1 走哪条路，并说清 AWR 和 AWAC 的 advantage 是对哪个 policy 算的，就可以去下一站。Q-learning 在 data 外取 max 为什么会把 Q 推高、IQL 的 expectile 推导，在 [CS285 的 offline 站](../courses/BERKELEY-CS285.html#offline)，这里不重讲。
:::

### Imitation 的上限是 data 里最好的那条 trajectory

Offline RL 的设定是：只有一个固定的 dataset $\mathcal D=\{(s,a,r,s')\}$，由某个 behavior policy $\pi_\beta$ 收集，可能是几个人、几个 controller、几次旧实验混在一起；训练时不能再和 environment 交互。目标仍然是最大化新 policy 自己的 return。

BC 对 dataset 做 maximum likelihood，学到的是 $\pi_\beta$ 本身。它完全不看 reward，所以它的 return 就是 data 的平均水平。把上面那张 grid 写清楚：

- $\tau_A$：s1 → s2 → s5 → s6，进入 s6 时 $r=-1$，episode 结束。
- $\tau_B$：s5 → s8 → s9，进入 s9 时 $r=+1$，episode 结束。
- $\tau_C$：s1 → s4 → s7，没有 reward，episode 因为 time limit 在 s7 结束。为了让例子算得清，把 s7 当作 value 为 0 的 terminal。

其余 reward 都是 0，$\gamma=0.9$。

从 data 数出 $\pi_\beta$：在 s1，$\tau_A$ 往右、$\tau_C$ 往下，各 0.5；在 s5，$\tau_A$ 往右、$\tau_B$ 往下，各 0.5；s2、s4、s8 各只有一个 action。BC 从 s1 出发的 expected discounted return：

- 往下（0.5）：走到 s7，return 0。
- 往右（0.5）：到 s5 后，0.5 的 probability 往右，进入 s6 是第 3 步，return $\gamma^2\times(-1)=-0.81$；0.5 的 probability 往下再往右，进入 s9 是第 4 步，return $\gamma^3\times1=0.729$。

$$J_{\text{BC}}=0.5\times0+0.5\times\big(0.5\times(-0.81)+0.5\times0.729\big)=0.5\times(-0.0405)=-0.02025$$

### Filtered BC：只模仿好的 trajectory

Lecture 7 给的第一个办法是用 reward 挑 data：按 return $r(\tau)=\sum_tr(s_t,a_t)$ 排序，只留 $r(\tau)>\eta$ 的那部分，对它做 BC，

$$\max_\theta\sum_{(s,a)\in\tilde{\mathcal D}}\log\pi_\theta(a\mid s),\qquad\tilde{\mathcal D}=\{\tau\mid r(\tau)>\eta\}$$

在 grid 上取 $\eta=0$，留下的只有 $\tau_B$。它从 s5 出发，s1 上一个 sample 都没有，policy 在 s1 输出什么完全取决于 network 怎样 extrapolate。Filtered BC 只能挑出整条好的 trajectory，而从 s1 出发的好 trajectory 在 data 里不存在。

Lecture 7 把它定位为 baseline：它简单、稳定，常常比想象中强，但对 reward 的使用很粗。HW3 的 Problem 3 就是拿 IQL 和只留 top 10% 的 filtered BC 比。

### AWR：按 advantage 加权的 imitation

比“留或不留”细一点的做法是给每个 transition 一个 weight，好的 action 多模仿，坏的少模仿：

$$\theta\leftarrow\arg\max_\theta\ \mathbb E_{(s,a)\sim\mathcal D}\Big[\log\pi_\theta(a\mid s)\,\exp\!\big(\tfrac1\alpha A(s,a)\big)\Big]$$

Lecture 7 在这里的说法是：这个 weighted imitation 近似的是 KL-constrained policy improvement，即在 $D_{\text{KL}}(\pi\,\|\,\pi_\beta)<\epsilon$ 的限制下最大化 $\mathbb E_{a\sim\pi(\cdot\mid s)}[Q(s,a)]$（引 REPS 和 ψ-learning；这一页 slide 上的 weight 写的是 $\exp(A(s,a))$，没有 $\alpha$，$1/\alpha$ 到 AWR 那一页才出现）。Slides 没有写中间的推导：用 Lagrange multiplier $\alpha$ 处理 constraint，解是 $\pi(a\mid s)\propto\pi_\beta(a\mid s)\exp(A(s,a)/\alpha)$，再把它投影回 network（对它做 maximum likelihood）就是上面的式子，完整的推导在 [CS285 的 offline 站](../courses/BERKELEY-CS285.html#offline)。它只在 dataset 里出现过的 action 上计算 loss，从不查询 data 以外的 action，这正是它在 offline 设定下安全的原因。

剩下的问题是 $A$ 从哪里来。Advantage-Weighted Regression（AWR）用 Monte Carlo：

1. 用 return 拟合 $V$：$\min_\phi\sum\big\|\hat V(s_t)-\sum_{t'\ge t}r_{t'}\big\|^2$。
2. $\hat A(s_t,a_t)=\sum_{t'\ge t}r_{t'}-\hat V(s_t)$。
3. 用这个 $\hat A$ 做上面的加权 maximum likelihood。

在 grid 上算 s1。两条从 s1 出发的 trajectory 的 return：$\tau_A$ 是 $-0.81$，$\tau_C$ 是 $0$。$\hat V(s1)$ 拟合的是两者的平均，$-0.405$。于是

$$\hat A(s1,\rightarrow)=-0.81-(-0.405)=-0.405,\qquad\hat A(s1,\downarrow)=0-(-0.405)=+0.405$$

取 $\alpha=0.5$，weight 是 $e^{-0.81}=0.445$ 和 $e^{0.81}=2.248$，两个 action 在 data 里各占一半，

$$\pi(\rightarrow\mid s1)=\frac{0.5\times0.445}{0.5\times0.445+0.5\times2.248}=0.165$$

AWR 让 s1 往下走，去那条什么也拿不到的路。同样算 s5：$\hat V(s5)=(-1+0.9)/2=-0.05$，两个 advantage 是 $\mp0.95$，weight $e^{-1.9}=0.150$ 和 $e^{1.9}=6.686$，$\pi(\downarrow\mid s5)=0.978$。s5 学对了，s1 学错了。

错在哪里：$\hat A$ 是 behavior policy 的 advantage。从 s2 往后，$\tau_A$ 在 s5 往右掉进了 −1，这个 return 记在了 s1 往右的账上。可是新的 policy 在 s5 会往下走，s1 往右其实是一条好路。Monte Carlo return 只能告诉你“data 里的人接着怎么做、结果如何”，不能告诉你“我接着做得更好时结果如何”。哪怕 data 无穷多、Monte Carlo 没有 noise，它估的也是 $Q^{\pi_\beta}$：

$$Q^{\pi_\beta}(s1,\rightarrow)=\gamma\cdot\gamma\cdot V^{\pi_\beta}(s5)=0.81\times(-0.05)=-0.0405<0=Q^{\pi_\beta}(s1,\downarrow)$$

仍然是往下更好。

### AWAC：advantage 用当前 policy 的 Q

AWAC 把 Monte Carlo 换成 TD，学当前 policy $\pi_\theta$ 的 Q：

$$\min_\phi\ \mathbb E_{(s,a,r,s')\sim\mathcal D}\Big[\big(Q_\phi(s,a)-r-\gamma\,\mathbb E_{a'\sim\pi_\theta(\cdot\mid s')}Q_\phi(s',a')\big)^2\Big]$$

$$\hat A(s,a)=Q_\phi(s,a)-\mathbb E_{\bar a\sim\pi_\theta(\cdot\mid s)}Q_\phi(s,\bar a)$$

再拿这个 $\hat A$ 做 AWR 的那一步。Policy 仍然只在 dataset action 上训练，但 advantage 反映的是“我接下来会怎么做”。$a'$ 从 $\pi_\theta$ 取，而 $\pi_\theta$ 是在 data 的 action 上加权模仿出来的，所以 $a'$ 不会离 data 太远。

Lecture 7 的这一页还列了一个 alternative：target 里的 $a'$ 不从 $\pi_\theta$ 抽，直接用 data 里紧接着的那个 action，$a'\sim\mathcal D$。这样一个 OOD action 都不查询，代价是 TD 学到的变成了 $Q^{\pi_\beta}$，和 AWR 估的是同一个对象，只是从 Monte Carlo 换成了 TD。下面的 grid 上会看到这意味着什么：只能做第一次 iteration。

在 grid 上做 tabular 的版本：每次 iteration 先精确地算出当前 policy 的 $Q$，再令 $\pi_{\text{new}}(a\mid s)\propto\pi_\beta(a\mid s)\exp(\hat A(s,a)/\alpha)$（加权 maximum likelihood 在 tabular 时的解），$\alpha=0.5$。

**Iteration 0。** $\pi=\pi_\beta$，$Q$ 就是上面算的 $Q^{\pi_\beta}$：$Q(s5,\downarrow)=0.9$，$Q(s5,\rightarrow)=-1$，$V(s5)=-0.05$；$Q(s1,\rightarrow)=-0.0405$，$Q(s1,\downarrow)=0$，$V(s1)=-0.02025$。

**Iteration 1。** 用这些 advantage 加权，这一步和 exact 的 AWR 完全相同。s5：advantage $\mp0.95$，$\pi(\downarrow\mid s5)=0.978$。s1：advantage 是 $-0.0405-(-0.02025)=-0.02025$ 和 $+0.02025$，weight $e^{\mp0.0405}$，$\pi(\rightarrow\mid s1)=0.480$，略偏向往下。用 $a'\sim\mathcal D$ 的那个 alternative，$Q$ 永远是 $Q^{\pi_\beta}$，再迭代多少次 advantage 都不变，policy 就停在这里。

**Iteration 2。** 重新评估新 policy。$V(s5)=0.022\times(-1)+0.978\times0.9=0.858$，$Q(s2,\downarrow)=0.9\times0.858=0.773$，$Q(s1,\rightarrow)=0.9\times0.773=0.695$，$Q(s1,\downarrow)$ 仍是 0。$V(s1)=0.480\times0.695=0.334$，advantage 是 $0.695-0.334=0.362$ 和 $-0.334$，weight $e^{0.723}=2.06$ 和 $e^{-0.667}=0.513$，

$$\pi(\rightarrow\mid s1)=\frac{0.5\times2.06}{0.5\times2.06+0.5\times0.513}=0.801$$

之后不再变化（这个 grid 是一个没有环的图，两轮就把 value 从 s9 传回了 s1）。最终 policy 从 s1 出发的 expected return 是 $0.801\times0.695=0.557$，BC 是 $-0.020$。

::fig[cs224r-awac] 动图，三帧是三次 iteration。看左边那一组柱子：iteration 1（就是 AWR）里 s1 往右反而降到 0.480，iteration 2 才升到 0.801。顺序是先 s5 学会往下，s1 的 Q 跟着涨，s1 再改。

它没有到 1 是因为 $\alpha$：weight 是 $\exp(A/\alpha)$，$\alpha$ 越小越接近只取 Q 最大的 action，越大越接近 BC。$\alpha$ 就是 KL constraint 的松紧。

> Offline RL 能超过 imitation，靠的是 stitching：每一步只用 data 里出现过的 action，Q 把不同 trajectory 的片段接起来。

:::wrong AWR 和 AWAC 只差在 Monte Carlo 和 TD，前者 variance 大一点、后者 bias 大一点，结果应该差不多
上面的例子里没有任何 noise，$Q^{\pi_\beta}$ 是精确算出来的，AWR 在 s1 仍然选了往下（exact 时 0.480，用两条 trajectory 的 Monte Carlo 时 0.165），AWAC 选了往右（0.801）。差别不在 estimator 的 variance，而在被估计的对象：AWR 估的是 behavior policy 的 value，只能做一步 improvement；AWAC 估的是当前 policy 的 value，可以反复 improve，把 s9 的 +1 一级级传到 s1。Lecture 7 列 AWR 的缺点时两条都写了：Monte Carlo 有 noise，advantage 是 behavior policy 的。
:::

### IQL：不用 policy 也能估出“data 里最好的 action”

AWAC 的 target 里有 $a'\sim\pi_\theta$，critic 和 actor 必须交替训练。IQL 用 expectile 把这件事去掉：$V(s)$ 不拟合 $Q(s,a)$ 在 data 上的平均，而拟合它的一个上 expectile，近似 data 里出现过的 action 中最好的那个。HW3 的写法是

$$L^2_\zeta(\mu)=\big|\zeta-\mathbb 1\{\mu\le0\}\big|\,\mu^2,\qquad V\leftarrow\arg\min_V\ \mathbb E_{(s,a)\sim\mathcal D}\big[L^2_\zeta\big(\bar Q(s,a)-V(s)\big)\big]$$

$\zeta>0.5$ 时，$Q$ 高于 $V$ 的那一侧 error 的 weight 大，$V$ 被往上拉。然后 $Q(s,a)\leftarrow r+\gamma V(s')$，policy 仍然用 AWR 的式子 $\exp\big((Q-V)/\alpha\big)$ 抽出来。三步都只用 dataset 里的 $(s,a)$，从不查询 data 以外的 action。

在 s5 上算一次。Data 里 s5 的两个 Q 是 $-1$ 和 $0.9$，各占一半。一维 expectile $v$ 满足 first-order condition：上面的 error 乘 $\zeta$、下面的乘 $1-\zeta$，两边相等，

$$\zeta\,(0.9-v)=(1-\zeta)\,(v+1)\quad\Longrightarrow\quad v=1.9\zeta-1$$

| $\zeta$ | 0.2 | 0.5 | 0.7 | 0.9 | 0.99 |
|---|---|---|---|---|---|
| $V(s5)$ | −0.62 | −0.05 | 0.33 | 0.71 | 0.881 |

$\zeta=0.5$ 是平均，也就是 $V^{\pi_\beta}$；$\zeta\to1$ 趋向 data 里的 max 0.9，那正是 stitching 需要的值。$\zeta=0.2$ 比平均还低，相当于假设自己以后总选 data 里更差的 action。这张表就是 HW3 Problem 2 第一问（$\zeta=0.2$ 对 $0.9$）要解释的东西。

:::edge Slides 和 HW3 的 expectile 记号方向相反
Lecture 7 的 slides 把 expectile 的 parameter 记作 $\lambda$：$\ell^2_\lambda(x)$ 在 $x<0$ 时是 $(1-\lambda)x^2$，其余时候是 $\lambda x^2$，代进去的是 $x=V(s)-\hat Q(s,a)$，并且写明“using small $\lambda<0.5$”。$x<0$ 就是 $Q$ 高于 $V$，这一侧的 weight 是 $1-\lambda>0.5$，所以 $V$ 被往上拉。HW3 handout 记作 $\zeta$，residual 取 $\bar Q-V$，$\mu>0$（$Q$ 高于 $V$）时 weight 是 $\zeta$，要 $\zeta>0.5$。两者说的是同一件事，slide 的 $\lambda$ 对应 handout 的 $1-\zeta$：$\zeta=0.9$ 就是 $\lambda=0.1$。读代码时先看 residual 是哪个减哪个，再决定 parameter 该大于还是小于 0.5。
:::

:::edge Stitching 需要 trajectory 真的交叉
上面 $\tau_A$ 和 $\tau_B$ 在 s5 相遇，Q 才能从 $\tau_B$ 传到 $\tau_A$。在 continuous state 里两条 trajectory 几乎不会经过同一个点，stitching 靠的是 Q function 在相近 state 之间的 generalization。HW3 的 PointMass 数据集是专门为此设计的：数据集里最好的一条 return 是 −46，平均 −104。如果 IQL 的 return 高于 −46，它一定走了一条 data 里没有的路。
:::

:::back
Q-learning 在 data 外取 max 为什么会把 Q 一轮轮推高、IQL 的 expectile 在 $\zeta\to1$ 时为什么趋向 in-support 的 max、FQL，见 [CS285 的 offline 站](../courses/BERKELEY-CS285.html#offline)；CQL 和 offline 之后接 online 的数字见 [MODERN-RL 的 offline 站](../courses/MODERN-RL.html#offline)。
:::

:::from
问题设定、“imitation 不能超过生成 data 的 policy”、s1 到 s9 的 stitching grid（slides 只给了 s1→s3、s7→s9 是好行为和 $r(s6)=-1$、$r(s9)=+1$ 这几个条件，三条 trajectory 的具体走法是自己定的）、filtered BC、AWR 的三步、AWAC 的 Q update 和 advantage、IQL 的三步和三条 takeaway 来自 [CS224R Lecture 7](https://cs224r.stanford.edu/slides/07_cs224r_offline_rl_2026.pdf)（读的是抓取工具的逐页转述，读了两遍）。第二遍专门核对了：slide 18 的 weight 是 $\exp(A)$、没有 $\alpha$，引的是 REPS 和 ψ-learning，Lagrangian 的中间步骤 slides 上没有；AWAC 那一页的 target 主式是 $a'\sim\pi_\theta$，$a'\sim\mathcal D$ 标为 alternative；expectile 的分段定义、residual 取 $V-\hat Q$、“small $\lambda<0.5$”都在 slide 上（第一版的 edge 当时没核实过，这次核实是对的）；grid 那一页没有画出具体的 trajectory。$\zeta$ 的记号和 PointMass 的 −46、−104 来自 [HW3 handout](https://cs224r.stanford.edu/material/hw3/CS224R_2026_Homework_3.pdf)。$a'\sim\mathcal D$ 时停在第一次 iteration 的推论、BC 的 −0.02025、AWR 的 0.165 与 0.978、AWAC 三次 iteration 的数字、expectile 表是自己推、用代码算的。
:::

## [reward] Reward learning：goal classifier、VICE 与 preference

:::skip
快速路线可以跳。会写 classifier reward 和 Bradley–Terry likelihood，能说出 VICE 为什么要把 policy 自己到过的 state 当 negative，就可以去下一站。RLHF 里 reward model 的训练细节在 [MODERN-RL 的 finetune 站](../courses/MODERN-RL.html#finetune)。
:::

### Reward 从哪里来

前面每一站都假设 $r(s,a)$ 是给定的。在 robot 上它通常不是：“把毛巾叠好”要写成一个 function，得先有能从 image 判断毛巾形状的东西。直接做 imitation 可以绕开 reward，但它只复制 action，不理解 action 为什么好，也不能处理 expert 的身体和 robot 不一样的情况。Lecture 8 讲了两种不写 reward function 的办法：给一些“成功长什么样”的例子，或者让人比较两条 trajectory 哪个好。

### Goal classifier 会被 policy 钻空子

第一种办法：收集成功的 state 当 positive、失败的 state 当 negative，train 一个 binary classifier $p_\psi(\text{success}\mid s)$（label 是 $\mathbb 1(s_i\in G)$），然后把它的 output 当 reward 做 RL。Slides 没有说用 $p$ 本身还是 $\log p$，下面的例子用 $r(s)=p_\psi(\text{success}\mid s)$。

用开头那个一维例子算清楚。State $x\in[-3,3]$，goal 是 $[0.8,1.2]$。Positive 是 5 个成功的 state $\{0.8,0.9,1.0,1.1,1.2\}$，negative 是 5 个失败的 state $\{-2,-1.5,-1,-0.5,0\}$。Classifier 是 feature 为 $(1,x,x^2)$ 的 logistic regression，加一点 L2 regularization，positive 和 negative 各占 loss 的一半。Train 完得到

$$p(x)=\sigma(-1.107+2.840\,x+0.775\,x^2)$$

$p(1)=\sigma(2.508)=0.925$，在 goal 上确实高。但 $x^2$ 的系数是正的，曲线往右一直升，$p(3)=\sigma(14.39)\approx1.000$。最大化这个 reward 的 policy 会跑到 $x=3$。

Classifier 没有犯“错”：它被要求分开左边那堆和右边那堆，它做到了。$x>1.2$ 的地方一个例子都没有，那里的输出完全是 extrapolation。RL 的 optimizer 偏偏专门去找 reward 最高的地方，于是总会找到 classifier 没见过、恰好给了高分的 state。这和 [第 1 站](#offline) 里 Q 在 data 外被高估是同一种病：一个 learned function 被另一个 optimizer 当作 objective 去最大化。

### VICE：把 policy 到过的 state 加进 negative

Fu et al. 2018 的 VICE 给出的修补很直接：$\mathcal D^-\leftarrow\mathcal D^-\cup\{s_t\}$，policy 每到一个地方，就把那里的 state 当作 negative 加进去。Lecture 8 写的循环是：收集最初的 $\mathcal D^+$ 和 $\mathcal D^-$；用 positive、negative 各占一半的 batch 更新 classifier；用 $\pi$ 收集经验；用 classifier reward 更新 $\pi$；把到过的 state 加进 $\mathcal D^-$；重复。被钻的空子一被发现就被堵上。

在一维例子上跑六轮。每轮 policy 走到当前 $p$ 的 argmax $m$，把 $\{m-0.1,m,m+0.1\}$ 加进 negative：

| round | policy 去的 $x$ | 那里的 $p$ | $p(1)$ |
|---|---|---|---|
| 0 | 3.00 | 1.000 | 0.925 |
| 1 | 1.03 | 0.865 | 0.865 |
| 2 | 0.93 | 0.718 | 0.717 |
| 3 | 0.93 | 0.653 | 0.652 |
| 4 | 0.93 | 0.617 | 0.616 |
| 5 | 0.94 | 0.594 | 0.593 |

Round 0 的三个 negative 落在 $x=3$ 附近，round 1 的 classifier 就把右边压了下去（$p(3)$ 从 1.000 变成 0.050），argmax 回到 goal 里。

::fig[cs224r-vice] 动图，每帧是一轮。看黑点：第 0 帧它在 $x=3$，第 1 帧起就落在 goal 的涂色带里；涂色的空心点是 policy 自己贡献的 negative，越积越多，曲线的峰越来越矮。

从 round 1 起，policy 到的地方就在 goal 里，于是同样的 state 同时出现在 positive 和 negative 里。Batch 是 50/50 的，goal 附近 positive 和 negative 的 weight 越来越接近，$p$ 趋向 0.5。Lecture 8 特意指出这一点：成功的 state 仍然有 $p\ge0.5$。它还是整条曲线上最高的地方（round 5 时 $p(3)=0.078$），reward 仍然指向 goal，只是不再“自信”。这就是 GAN 里 discriminator 的处境，policy 是 generator，所以它也继承了 adversarial training 不稳定的毛病。

Lecture 8 引了 Sharma et al. 2023 在真机上的做法：收集 50 条 demonstration，用每条的最后一个 state 当 success 的例子，并用 demonstration 初始化 replay buffer。直接 imitation 这 50 条的 success rate 是 26%，用 learned classifier 做 RL 是 62%（转述说 slide 的版面有点乱，这是最自然的读法），slide 强调 classifier 的 regularization 很关键。

:::wrong 只要 positive 的例子足够多、classifier 在 test set 上 accuracy 足够高，就可以放心当 reward
上面 round 0 的 classifier 在全部 10 个 training 例子上都分对了（positive 的 $p$ 最低是 $p(0.8)$，negative 的 $p$ 最高是 $p(0)=\sigma(-1.107)=0.248$）。Test set 和 training set 来自同一个 distribution，accuracy 衡量的是在那个 distribution 上的表现；RL 的 policy 会主动离开它，去找 reward 最高的 state，那里正是 test set 没有覆盖的地方。需要的是在 policy 会去的 state 上也对，这只能靠把 policy 的 state 加进来。
:::

### Preference：人只回答“哪个更好”

第二种办法不要求“成功长什么样”的例子，只要求人比较两条 trajectory：$\tau_w$ 比 $\tau_l$ 好。比较比打分容易，也更一致。Model 是 Bradley–Terry：

$$P(\tau_a\succ\tau_b)=\sigma\big(r_\psi(\tau_a)-r_\psi(\tau_b)\big),\qquad r_\psi(\tau)=\sum_tr_\psi(s_t,a_t)$$

对人给的 label 做 maximum likelihood。Lecture 8 的循环是：收集 $k$ 条 trajectory，算它们的 reward，对全部 $\binom k2$ 对做一步 gradient，重复；这个循环可以放在 online RL 里面，边 train policy 边问人。$k=4$ 时一次问 6 对。

算一步。设 $r_\psi(s)=\psi^\top\phi(s)$，两条 trajectory 的 feature 之和是 $\Phi_a=(2,0)$、$\Phi_b=(1,1)$，人说 $\tau_a$ 更好。初始 $\psi=(0,0)$，

$$P(\tau_a\succ\tau_b)=\sigma\big(\psi^\top(\Phi_a-\Phi_b)\big)=\sigma(0)=0.5$$

Loss 是 $-\log\sigma(\psi^\top\Delta)$，$\Delta=\Phi_a-\Phi_b=(1,-1)$。对 $\psi$ 求 gradient：$\frac{d}{dz}\big(-\log\sigma(z)\big)=-(1-\sigma(z))$，所以

$$\nabla_\psi\mathcal L=-(1-\sigma(\psi^\top\Delta))\,\Delta=-(1-0.5)(1,-1)=(-0.5,\,0.5)$$

Learning rate 取 1，$\psi\leftarrow(0,0)-(-0.5,0.5)=(0.5,-0.5)$。新的 $P(\tau_a\succ\tau_b)=\sigma(0.5\times1+(-0.5)\times(-1))=\sigma(1)=0.731$。第一个 feature 被学成“好”，第二个被学成“坏”。

Lecture 8 的例子：Christiano et al.（NeurIPS 2017）在 online RL 的循环里边训练边问人，一共用了 900 次 preference query（slide 没有写是哪个任务）；Sadigh et al.（RSS 2017）用 active preference query 学驾驶 reward 里几个因素的 weight。LLM 上把 trajectory 换成同一个 prompt 的几个回答，就是 RLHF 的 reward model $r(x,y)$，接在 pretraining 和 SFT 之后，再用 PPO 之类最大化它；RLAIF（Bai et al. 2022，Constitutional AI）让另一个 language model 判断哪个回答更 harmless，依据是“评判比生成容易”。

:::edge Preference 只确定 reward 的差
Likelihood 里只出现 $r_\psi(\tau_a)-r_\psi(\tau_b)$。给每一步的 reward 都加同一个 constant $c$，两条长度为 $T$ 的 trajectory 各加 $cT$，差不变，likelihood 不变。所以 preference 学出的 reward 只确定到一个 constant 为止。长度相同时这无害；长度不同时，这个 constant 等于在奖励或惩罚“活得久”，例如 $c>0$ 会让 policy 拖延不结束 episode。用这种 reward 做 RL 前要先决定 constant 怎么定（例如固定某个 state 的 reward 为 0，或者 normalize）。
:::

:::back
Learned function 被 optimizer 钻空子，与[第 1 站](#offline) Q 在 data 外被高估同构。真机 RL 里用 classifier 当 reward 的做法（SERL）见 [MODERN-RL 的 offpolicy 站](../courses/MODERN-RL.html#offpolicy)。
:::

:::from
“reward 写不出来”的动机、goal classifier、被 exploit 的问题、VICE 的“policy 的 state 当 negative、50/50 batch、成功 state 的 $p\ge0.5$”、与 GAN 的类比、Sharma et al. 的 26% 与 62%、preference 的 likelihood 和 $\binom k2$ 的循环、Christiano 的 900 次 query、RLHF 与 RLAIF 来自 [CS224R Lecture 8](https://cs224r.stanford.edu/slides/08_cs224r_reward_learning_2026.pdf)（抓取工具的逐页转述，读了两遍）。第二遍核对后改了三处：第一版写 Christiano 的 900 次 query“教会了 simulation 里的任务”，slide 没写任务，已删；第一版写 reward 用 $p$“或它的 log”，slide 只说用 output 当 reward；补上了 VICE 的年份（2018）和完整循环、Sharma et al. 用 demo 最后一个 state 当 positive 的做法。Slides 里没有 inverse RL、GAIL，也没有讲 RLHF 的 overoptimization；最后一页提到的 goal-setter 与 goal-reacher 的 self-play（Sukhbaatar et al. 2018）只有一句，这里没有写。一维 classifier 的设定、六轮 VICE 的数字（构建时用 gradient descent 训练，图和表来自同一段代码）、preference 的一步 gradient、“只确定到 constant”的 edge 是自己加的。
:::

## [mbrl] Model-based RL：Dyna、short rollout 与 ensemble

:::skip
快速路线可以跳。能写出 Dyna 式的四步循环，并用 $k$ 步 error bound 说明 rollout 为什么要短、为什么从 data 的 state 出发，就可以去下一站。Random shooting、CEM、open-loop 与 closed-loop 的 value 差、backprop through model 的 Jacobian 连乘在 [CS285 的 mbrl 站](../courses/BERKELEY-CS285.html#mbrl)；TD-MPC2 在 [MODERN-RL 的 offpolicy 站](../courses/MODERN-RL.html#offpolicy)。
:::

### 学一个 simulator，再从里面要 data

Model-based RL 的想法：用收集到的 transition $\mathcal D=\{(s_t,a_t,s_{t+1})\}$ 学一个 dynamics model，

$$\min_\theta\sum_{(s_t,a_t,s_{t+1})\in\mathcal D}-\log p_\theta(s_{t+1}\mid s_t,a_t)$$

然后把它当 simulator 用：在里面生成额外的 data，或者在里面往前看几步再决定 action。Lecture 11 给的最朴素版本是三步：用某个 policy 收 data，学 simulator，在 simulator 里跑任何一种 RL。它马上加了几条警告：data 的 coverage 非常重要；model 好不好学取决于 domain，有的 domain 容易 simulate 得多；即使 simulator 很好，第三步本身也不容易；必须考虑 model 的不准。

Dyna 式的 model-based policy optimization 把这三步变成循环：

1. 用 $\pi_\phi$ 在真实 environment 里收 data，加进 $\mathcal D_{\text{env}}$。
2. 在 $\mathcal D_{\text{env}}$ 上更新 model $p_\theta$。
3. 用 $\pi_\phi$ 在 $p_\theta$ 里生成 synthetic rollout，加进 $\mathcal D_{\text{model}}$。
4. 在 $\mathcal D_{\text{model}}\cup\mathcal D_{\text{env}}$ 上更新 policy 和 critic（任何 off-policy actor-critic，例如 SAC）。

第 3 步是 sample efficiency 的来源：真实交互一次，model 里可以生成很多次。第 3 步也是麻烦的来源。Lecture 11 问“这样做会怎样失败”，答案是 distribution mismatch：model 是在旧 policy 的 state distribution $p_{\pi_\phi}(s)$ 上 train 的，却被用来评估更新后的 policy，$p_{\pi_{\phi'}}(s)\ne p_{\pi_\phi}(s)$，新 policy 在 model 里走到的 state 可以是 model 从没见过的。Slide 给的两个直接办法是之后的 iteration 再收新的真实 data，或者限制 policy 每次不要变太多。

### Error 随 rollout 长度放大

设 model 每一步的 error 不超过 $\varepsilon$：对任何 $s$，$\|\hat f(s)-f(s)\|\le\varepsilon$（这里把 policy 固定，$f$ 是 policy 下的一步 transition）。再设真实 dynamics 是 $L$-Lipschitz：$\|f(x)-f(y)\|\le L\|x-y\|$。从同一个 $s_0$ 出发，记第 $t$ 步的 error 为 $e_t=\|\hat s_t-s_t\|$，$e_0=0$。

$$e_{t+1}=\|\hat f(\hat s_t)-f(s_t)\|\le\|\hat f(\hat s_t)-f(\hat s_t)\|+\|f(\hat s_t)-f(s_t)\|\le\varepsilon+L\,e_t$$

第一项是 model 在 $\hat s_t$ 上的一步 error，第二项是上一步的偏差被真实 dynamics 放大。展开：

$$e_k\le\varepsilon\,(1+L+L^2+\cdots+L^{k-1})=\varepsilon\,\frac{L^k-1}{L-1}\qquad(L\ne1)$$

取 $\varepsilon=0.02$、$L=1.2$：

| $k$ | 1 | 5 | 10 | 25 |
|---|---|---|---|---|
| $\frac{L^k-1}{L-1}$ | 1 | 7.44 | 25.96 | 471.98 |
| $e_k$ 的 bound | 0.02 | 0.149 | 0.519 | 9.44 |

一步准到 0.02 的 model，25 步之后的 bound 是 9.44。实际情况往往比这个 bound 更糟：上面假设 $\varepsilon$ 处处成立，而 rollout 越长越可能走出 data 的 coverage，那里的一步 error 本身就大得多。

Lecture 11 列了生成 synthetic data 的三种选择：从初始 state 出发做完整的 trajectory，model 要在整个 horizon 上都准；从初始 state 出发只做一段，后面的 state 覆盖不到；从 $\mathcal D_{\text{env}}$ 里**所有** state 出发做短的 partial rollout（branch）。它选第三种：每个 branch 起点都是真实的 state，只需要 model 在几步之内准；整体的覆盖靠起点多来保证。Slide 上引了 Janner et al. 2019（MBPO）的图，rollout length 随训练从 1 增加到 25：model 越来越准，才允许走得越来越远。MBPO 论文里的做法是每个 epoch 从 $\mathcal D_{\text{env}}$ 均匀抽起点、在第 20 到第 100（或 300）个 epoch 之间把 $k$ 线性加大，不同 environment 的上限不同，Hopper 是 1 到 15。

:::skip
下面这一段是 MBPO 论文里的 bound，Lecture 11 没有讲。跳过它会少掉“$k$ 为什么不是越短越好”的定量解释。
:::

只看上面的 $e_k$，似乎 $k$ 越短越好，$k=0$ 最好，那就等于不用 model。MBPO 的 Theorem 4.3 在 return 的层面说明了为什么不是这样。设 $\epsilon_\pi$ 是新 policy 和收 data 的旧 policy 之间的差，$\epsilon_{m'}$ 是 model 在新 policy 的 distribution 上的一步 error（两者论文里都用 total variation distance 衡量），真实 return $\eta[\pi]$ 和 branched rollout 里估出的 return $\eta^{\text{branch}}[\pi]$ 满足

$$\eta[\pi]\ \ge\ \eta^{\text{branch}}[\pi]-2r_{\max}\Big[\frac{\gamma^{k+1}\epsilon_\pi}{(1-\gamma)^2}+\frac{\gamma^{k}\epsilon_\pi}{1-\gamma}+\frac{k\,\epsilon_{m'}}{1-\gamma}\Big]$$

方括号里前两项来自 policy 的变化：branch 的起点来自旧 policy 收的 data，它们的 distribution 和新 policy 会走到的不同；branch 越长，这部分在 return 里的影响越小，按 $\gamma^k$ 衰减。第三项是 model 的 error，随 $k$ 线性变大。取 $\gamma=0.9$、$\epsilon_\pi=0.05$、$\epsilon_{m'}=0.02$，前两项合起来是 $0.05\times\big(\tfrac{0.9}{0.01}+\tfrac{1}{0.1}\big)\times0.9^k=5\times0.9^k$，第三项是 $0.02k/0.1=0.2k$：

| $k$ | 0 | 1 | 5 | 9 | 15 | 25 |
|---|---|---|---|---|---|---|
| policy 项 $5\times0.9^k$ | 5.000 | 4.500 | 2.952 | 1.937 | 1.029 | 0.359 |
| model 项 $0.2k$ | 0 | 0.2 | 1.0 | 1.8 | 3.0 | 5.0 |
| 方括号 | 5.000 | 4.700 | 3.952 | 3.737 | 4.029 | 5.359 |

最好的是 $k=9$，$k=25$ 比完全不用 model 还差。$\epsilon_{m'}$ 越小，最好的 $k$ 越大，这正是“model 越准越可以走远”的定量版本。论文也指出，如果 $\epsilon_{m'}$ 用旧 policy 下的 error 加上 policy 变化的修正来保守地估，最好的 $k$ 是 0，所以要用经验上测出的 model error 才能说明 model 值得用。

### Ensemble：分歧当作“不知道”

光知道 error 会放大还不够，还要知道 model 在哪里不准。Lecture 11 的办法是 ensemble：train 好几个 model，每个用自己的 minibatch（或 bootstrap 的 data），它们在 data 多的地方会一致，在 data 外各自 extrapolate、互相不一致。Slide 的说法是 error 会因此“average out”，partial rollout 在第 $i$ 个 model $p^i_\theta$ 里跑；具体怎么挑 model，slide 没有写，MBPO 论文里是 7 个输出 Gaussian 的 network，rollout 的每一步从中均匀随机选一个，所以同一条 rollout 的不同步可能来自不同的 model。分歧大的地方就是不该信的地方。

做一个一维例子。真实 dynamics 是 $s'=s+0.15+0.03s$（固定 policy 下，state 每步往右走一点），data 是 24 个 $s\in[-1,1]$ 里的 transition，带 0.01 的 noise。5 个 model 各自在 bootstrap 的 data 上拟合一个 cubic polynomial。

::fig[cs224r-ensemble] 在 data 覆盖的 $[-1,1]$ 里 5 条灰线和粗线几乎重合；出了这个范围立刻散开。

| $s$ | 真实位移 | 5 个 model 的范围 |
|---|---|---|
| 0 | 0.150 | 0.137 到 0.146 |
| 1 | 0.180 | 0.172 到 0.183 |
| 1.5 | 0.195 | 0.144 到 0.225 |
| 2 | 0.210 | 0.067 到 0.285 |

现在从 $s_0=-1$ 出发做 25 步 rollout。真实的 $s$ 在第 14 步到达 1.05，离开 data 的范围。

| $t$ | 真实 $s_t$ | 5 个 model 的 $\hat s_t$ | 分歧 |
|---|---|---|---|
| 10 | 0.376 | 0.34 到 0.40 | 0.054 |
| 15 | 1.232 | 1.19 到 1.25 | 0.061 |
| 20 | 2.224 | 1.89 到 2.41 | 0.515 |
| 25 | 3.375 | 2.18 到 5.33 | 3.15 |

从 data 里的 state 出发的 3 步 branch 则一直可信：从 $-0.6$ 出发，真实的第 3 步是 $-0.192$，5 个 model 给出 $-0.215$ 到 $-0.197$；从 0.45 出发，真实是 0.955，model 给出 0.934 到 0.962。

::fig[cs224r-branch] 动图，灰线是 5 个 model 从 $s=-1$ 往前 rollout。看它们和粗线在哪里分开：前 15 步几乎重合，离开涂色带后迅速散开。彩色短线是从 data 的 state 出发的 3 步 branch，5 个 model 始终挤在一起。

:::wrong Ensemble 的 5 个 model 意见一致，就说明 model 是对的
一致只说明它们在同样的 data 上学到了同样的东西。在 data 里有系统性偏差的地方（例如上表 $s=0$ 处 5 个 model 都在 0.137 到 0.146 之间，真实值 0.150，都偏低），ensemble 一样会一致地错；第 15 步时 5 个 model 都在 1.19 到 1.25，真实值 1.232，分歧 0.061 没有警告任何事，可是 25 步时那个 5.33 已经离谱。分歧能发现的是 epistemic uncertainty（data 不够），发现不了 model class 本身装不下真实 dynamics 的情况，也发现不了所有 model 共享的 bias。
:::

### Planning：短 horizon 加 terminal value

Model 的另一种用法是在 test 时 planning。Lecture 11 的 Planning V1：sample $N$ 条长度为 $H$ 的 action sequence，在 model 里 rollout，执行 return 最高那条的第一个 action，下一步重新 plan（receding horizon）。$H$ 短了看不远，$H$ 长了 model error 太大、计算太贵。Planning V2 的办法是在 horizon 末端接一个 learned value：

$$i^*=\arg\max_i\ \Big[\sum_{t'=t}^{t+H}r(\hat s^i_{t'},a^i_{t'})+\hat V(\hat s^i_{t+H+1})\Big]$$

算一个例子。9 个 state 的 chain，从 3 出发，进入 2 得 $+1$、进入 8 得 $+10$，都结束 episode，其余 reward 0，$\gamma=0.9$。

::fig[cs224r-horizon] $H=3$ 的 planner 看不到 8。

只看 3 步：向左第一步就得 1；向右 3 步走到 6，reward 全是 0。Planner 选向左，return 1。加上 terminal value：$\hat V(6)$ 是从 6 出发的 value，6 → 7 → 8，第二步进入 8，$\hat V(6)=0.9\times10=9$。向右的 plan value 是 $0.9^3\times9=6.561$，大于 1，选向右。这和用 $H=5$ 直接看到 8 的结果一样（$0.9^4\times10=6.561$），但 model 只需要准 3 步。

这里要学的是 $V$ 而不是 $Q$，因为 action 由 planner 选，value 只需要评价 planner 走到的 state。Lecture 11 的两个例子都是这个结构：Nagabandi et al. 2019 用 3 个 network 的 ensemble、短 horizon、shaped reward、不用 value function，action sequence 用 cross-entropy method 迭代地优化，每轮用 planner 收 30 条 trajectory 再更新 model；AlphaGo 的 model 是已知的规则加上对手的落子（self-play 或和过去的自己下），planning 1 到 40 步，末端接用 Monte Carlo regression 学的 value network，policy network 用来缩小搜索的 action，policy 再去模仿 planner 的选择。

:::edge 什么时候不值得学 model
Lecture 11 最后的判断标准是：model 好学时才用。Model 优化的是预测 $s_{t+1}$ 的 likelihood，不是 task 的 return，预测得最准的 model 不一定是对 control 最有用的；image 输入时，预测下一帧的每个 pixel 可能比直接学 policy 难得多；它还多出一套要 train 的 network、一组 hyperparameter 和额外的计算。另一面，model 不需要 reward label，学到的 dynamics 换一个 task 还能用。
:::

:::back
Open-loop plan 为什么即使 model 完美也吃亏、CEM 的步骤、latent model 见 [CS285 的 mbrl 站](../courses/BERKELEY-CS285.html#mbrl)。Lecture 12 开头复习这一讲时把“short rollout、ensemble、从所有 state 出发、value function 接 long horizon”列为四条对付 model error 的办法，正是本站的四个小节。
:::

:::from
Model 的 objective、三步的朴素版本和两条警告、Dyna 式四步循环、从所有 data state 出发的 partial rollout、MBPO 的 rollout length 1 到 25、ensemble 的“errors will average out”、Planning V1/V2 的式子、学 $V$ 不学 $Q$、Nagabandi 和 AlphaGo 的细节、pros 和 cons 来自 [CS224R Lecture 11](https://cs224r.stanford.edu/slides/11_cs224r_mbrl_2026.pdf)（抓取工具的逐页转述，读了两遍）。第二遍补上了 distribution mismatch 那一页、三种 augmentation 的选择、Nagabandi 用 CEM、AlphaGo 的 value 用 Monte Carlo regression；第一版写“rollout 时每一步随机选一个 model”像是 slide 的话，其实 slide 没写，这条来自 [MBPO 论文](https://arxiv.org/pdf/1906.08253v3)（Algorithm 2、Table 1），rollout length 的 schedule 和 Theorem 4.3 的 bound 也来自那里（工具转述，Table 1 有乱码，各 environment 对应哪个 schedule 只确定了 Hopper）。Slides 没有 error bound，也没有 random shooting、backprop through model 的内容；最后一页的 inverse model、video prediction 等“其他 model”只列了名字，这里没写。$e_k$ 的推导是自己写的（标准的 triangle inequality 论证），bound 的数值表、一维 ensemble 和 chain 的例子是自己构造并用代码算的。
:::

## [mtrl] Multi-task 与 goal-conditioned RL：weight sharing 与 hindsight relabeling

:::skip
快速路线可以跳，但做真机 multi-task 或 goal-conditioned policy 的人值得读。能说出 relabeling 的三个条件，能对一条 trajectory 做 final 和 future relabeling，就可以去下一站。Goal-conditioned BC 的 relabeling（不需要 reward）在 [CS285 的 il 站](../courses/BERKELEY-CS285.html#il)，这里讲的是 RL 的版本。
:::

### Task 是一个 MDP

Lecture 12 先把“task”说清楚：一个 task 就是一个 MDP，

$$\mathcal T_i\triangleq\{\mathcal S_i,\mathcal A_i,p_i(s_1),p_i(s'\mid s,a),r_i(s,a)\}$$

这个定义比日常说的“task”宽。Lecture 12 用四个例子问“MDP 的哪一部分在变、哪一部分不变”：multi-robot RL 学几种不同的 maneuver；动画角色学穿几种不同的衣服、从不同的初始姿势开始；推荐系统给不同的用户推荐视频；几台不同的 robot 叠衬衫。Slide 上标出的答案有三种：只有 reward $r_i(s,a)$ 变；dynamics $p_i(s'\mid s,a)$ 变；初始 state $p_i(s_1)$ 和 dynamics 一起变。（转述说这些标注和例子的对应不完全清楚。按例子本身读，穿衣服那个是初始 state 和 dynamics 一起变，不同 robot 叠衬衫是 dynamics 变，action space 也可能不同。）用一个 task identifier $z_i$ 告诉 policy 现在是哪个 task：one-hot 的编号、一句 language description、一段演示视频，或者要到达的 goal state $z_i=s_g$。

关键的一步是把 $z_i$ 并进 state：$s=(\bar s,z_i)$。这样 multi-task RL 就是一个单独的 MDP 上的普通 RL，policy 是 $\pi_\theta(a\mid\bar s,z_i)$，Q 是 $Q_\phi(\bar s,a,z_i)$，所有 task 共享同一个 network（weight sharing）。BC-Z、OpenVLA、π0.5 都是这个结构，task identifier 在 VLA 里就是 prompt。共享的理由是 data efficiency：平衡在走、跑、跳里都要用，语法在订机票和买菜里都要用，一个 task 学到的东西可以 amortize 到别的 task 上。

Goal-conditioned RL 是 $z_i=s_g$ 的特例，reward 可以从 state 自动算出来：

$$r(s,a,s_g)=\delta(s=s_g)\ \ \text{（discrete）},\qquad r(s,a,s_g)=\delta(\|s-s_g\|\le\epsilon)\ \ \text{（continuous）}$$

或者用 dense 的 $-d(\bar s,s_g)$。它不需要人写 reward（self-supervised），很多 task 都可以写成“到达某个 state”；代价是很难 train，因为 sparse reward 下大部分 goal 很少被碰到。

### Stratified sampling：每个 batch 里每个 task 都要有

Multi-task 训练的一个小但实用的细节。设两个 task 的 per-sample gradient（取一维）分别是 mean $+1$ 和 $-1$、task 内 standard deviation 0.5 的 random variable，两个 task 各占一半。真正的 multi-task gradient 是两者平均，等于 0。Batch size $B=8$。

**从混合的 data 里均匀抽。** 每个 sample 来自 mixture，它的 variance 是 task 内的 variance 加上 task mean 之间的 variance：$0.5^2+1^2=1.25$。8 个平均，

$$\mathrm{Var}_{\text{uniform}}=\frac{1.25}{8}=0.15625$$

**每个 task 各抽 4 个。** estimate 是 $\tfrac12(\bar g_1+\bar g_2)$，$\bar g_i$ 是 task $i$ 的 4 个平均，variance 各是 $0.25/4$，

$$\mathrm{Var}_{\text{stratified}}=\tfrac14\Big(\frac{0.25}{4}+\frac{0.25}{4}\Big)=0.03125$$

小了 5 倍。差的那部分正是 task mean 之间的 variance：均匀抽时，一个 batch 里 task 1 碰巧多几个，gradient 就整体偏向 task 1。Task 越多、task 之间越不同，这部分越大。Lecture 12 的做法是每个 task 一个 replay buffer，从每个 buffer 各抽一份拼成 batch。

### Hindsight relabeling：别的 task 的 data 也能用

现在回到开头的 chain：16 个 state，从 0 出发，每个 episode 随机抽一个 goal $g\in\{1,\dots,15\}$，进入 $g$ 时 $r=1$ 并结束 episode，其余 $r=0$，最多 20 步。Tabular Q-learning 在 $(s,g)$ 上学 $Q(s,a\mid g)$，$\alpha=0.5$、$\gamma=0.9$，ε-greedy 的 $\varepsilon=0.1$，Q 一样大时随机选。

开始时所有 Q 都是 0，policy 就是 random walk。Goal 是 12 时，20 步的 random walk 很难从 0 走到 12，这条 trajectory 的每一个 transition 的 reward 都是 0，target $r+\gamma\max Q=0$，Q 一点不动。Lecture 12 问的问题是：一个 task 的 data，能不能拿来学另一个 task？

那条 trajectory 0 → 1 → 2 → 1 → 2 → 3 → 4 → 5 对 goal 12 没有用，对 goal 5 却是一条完整的成功示范。把 transition 里的 goal 换成 5、按 goal 5 重算 reward，就得到一份 goal 5 的 data。这叫 hindsight relabeling（Kaelbling 1993），用在 replay buffer 上叫 hindsight experience replay（HER，Andrychowicz et al. 2017）。Goal-conditioned 版本的 algorithm：

1. 用当前 policy 收一条 $\tau=\{(s_{1:T},a_{1:T},s_g,r_{1:T})\}$，加进 buffer。
2. 把 goal 换成终点：$\tau'=\{(s_{1:T},a_{1:T},s_T,r'_{1:T})\}$，$r'_t=r(s_t,s_T)$，也加进 buffer。Slide 上用的是 dense 的 $r'_t=-d(s_t,s_T)$；这里的 chain 用 sparse 的 $\delta$，步骤完全一样。
3. 从 buffer 抽 batch 更新 Q 和 policy。

Slide 还说可以换成这条 trajectory 里之后到过的任意一个 state。HER 论文给这些选法起了名字：换成终点叫 final，换成同一条 trajectory 里这个 transition 之后到过的 $k$ 个随机 state 叫 future，换成同一条 trajectory 里任意 $k$ 个 state 叫 episode，换成整个训练中见过的任意 state 叫 random。论文里 future 最好，$k=4$ 或 8 时效果最好，$k$ 再大反而变差，因为原来 goal 的 data 在 buffer 里占得太少；主要实验用的是 future、$k=4$。

::fig[cs224r-her] 动图，同一条 trajectory 配三个 goal。看右边的 reward 一列：goal 12 时全是 0；换成 5，最后一步变成 1；换成 3，第 5 步就是 1，之后的 transition 不属于这个 episode。

算一下 goal 5 的这份 data 带来什么。第 7 个 transition $(4,\rightarrow,5)$ 的 reward 是 1，一次 update 后 $Q(4,\rightarrow\mid5)=0+0.5\times(1-0)=0.5$。反复从 buffer 抽这几条 transition 更新，Q 会收敛到 data 上 Bellman equation 的解：

- $Q(4,\rightarrow\mid5)=1$
- $Q(3,\rightarrow\mid5)=0.9\times1=0.9$
- $Q(2,\rightarrow\mid5)=0.9\times0.9=0.81$
- $Q(1,\rightarrow\mid5)=0.9\times0.81=0.729$
- $Q(0,\rightarrow\mid5)=0.9\times0.729=0.656$

Data 里还有 $(2,\leftarrow,1)$ 这个 transition，它的 Q 是 $0.9\times\max Q(1,\cdot\mid5)=0.9\times0.729=0.656$，小于 $Q(2,\rightarrow\mid5)=0.81$。所以 greedy policy 在 2 往右，从 0 直走到 5。一条 random walk，学会了“去 5”，它原本要去的是 12。

跑完整的 600 个 episode（20 个 seed 平均），用 HER 论文主要实验的设定，future strategy、每个 transition 额外抽 4 个 goal：

::fig[cs224r-hercurve] 两条 learning curve。看前 50 个 episode：relabeling 让 greedy policy 能到达的 goal 从 0 涨到 44%，不做是 19%。

Buffer 里 reward 为 1 的 transition，没有 relabeling 时只占 4.1%，有 relabeling 时占 31.6%。Lecture 12 总结的效果是：exploration 的困难被缓解了。Slides 上 HER 的结果只有 Andrychowicz et al. 的 robot manipulation 视频，没有数字；HER 论文里的 bit-flipping 实验给了一个对照：$n$ 个 bit 的 goal-reaching，DQN 不加 HER 只能解 $n\le13$，加了 HER 到测试的最大值 $n=50$ 都能解。

### 三个条件

Lecture 12 列了 relabeling 成立的三个条件，每一个都对应 relabel 出来的 transition 必须是“对新 task 也合法”的 data：

1. **Reward function 的形式已知、可以 evaluate。** 换了 goal 要重算 $r'_t=r_j(s_t)$。$\delta(s=s_g)$ 和 $-d(s,s_g)$ 都可以，人工打的 label 不行。
2. **各 task 的 dynamics 相同。** $(s_t,a_t,s_{t+1})$ 是在 task $i$ 的 dynamics 下发生的，放到 task $j$ 里还要成立。
3. **用 off-policy algorithm。** 下面的 `:::wrong` 细说。

一般的 multi-task 版本只是把“换 goal”换成“换 task identifier 并重算 reward”：踢球时射门没进、意外传了一脚好球，这条 data 可以照常存，也可以标成“传球”这个 task 再存一份。换成哪个 task，Lecture 12 留作开放问题：随机选，或者选这条 trajectory 在上面 reward 高的 task。

:::wrong Relabeling 只是改了 data 里的 goal，PPO 一样可以用
Relabel 之后，transition $(2,\leftarrow,1)$ 被标成了 goal 5 的 data，可是“往左”这个 action 是从 $\pi(\cdot\mid2,g=12)$ 里抽出来的。Policy gradient 和 PPO 的 estimator 假设 action 是从当前 policy 在同一个 condition 下抽的：$\mathbb E_{a\sim\pi(\cdot\mid s,g=5)}[\nabla\log\pi(a\mid s,5)\,A]$。Relabel 后的 action 来自另一个 distribution，直接代进去得到的是 biased 的 gradient；要修正得乘 $\pi(a\mid s,5)/\pi(a\mid s,12)$，而 policy 学好之后，对 goal 5 往左走的 probability 很小，这个 ratio 会极端地小或大，variance 失控。Q-learning 的 target $r+\gamma\max_{a'}Q(s',a'\mid g)$ 不关心 action 是谁选的，只要 transition 本身在 dynamics 下成立，所以 relabeling 对它天然合法。
:::

:::edge Tabular 的 HER 仍然到不了没去过的 goal
上面那张 learning curve 600 个 episode 时 HER 停在 70%，不做 relabeling 的是 58%，都没有到 100%。原因是 tabular Q 对每个 $(s,g)$ 是独立的格子：从 0 出发很少走到 13、14、15，这些 goal 的格子从未被更新过，relabeling 也帮不上，因为没有一条 trajectory 到过那里。HER 论文里真正的威力来自 neural network 对 goal 的 generalization：学会了去 5、6、7，network 对没见过的 8 也会给出大致对的 Q。Relabeling 解决的是“到过却没用上”，解决不了“从没到过”。
:::

:::back
Q-learning 对 transition 的来源不敏感、off-policy 的含义见 [CS4246 的 td 站](../courses/CS4246.html#td)；goal-conditioned BC 用 relabeling 从 random walk 里学出朝向 goal 的 policy，见 [CS285 的 il 站](../courses/BERKELEY-CS285.html#il)。
:::

:::from
Task 的定义、task 的几类差异和例子、$s=(\bar s,z_i)$、policy 和 Q 的 conditioning、BC-Z、OpenVLA、π0.5 的例子、stratified sampling 降低 gradient variance、per-task replay buffer、踢球的例子（传球与射门）、Kaelbling 1993 与 HER 的出处、三个条件、两个版本的 relabeling algorithm（goal 版本的 $r'_t=-d(s_t,s_T)$）、“之后到过的任意 state”、goal-conditioned reward 的写法和 pros/cons 来自 [CS224R Lecture 12](https://cs224r.stanford.edu/slides/12_cs224r_mtrl_gcrl_2026.pdf)（抓取工具的逐页转述，读了两遍；slides 里 HER 的结果没有数字，也没有 gradient conflict、PCGrad 一类内容）。第二遍改了一处错：第一版把 dynamics 和初始 state 不同的例子写成“不同体型的动画角色”，slide 上是“穿不同衣服、从不同初始 state 开始”的动画角色。Final、future、episode、random 四个名字、$k=4$ 和 bit-flipping 的 13 与 50 来自 [HER 论文](https://arxiv.org/pdf/1707.01495v3)第 3.1、4.5 节（只问了这几处）。Stratified sampling 的 variance 计算、16 个 state 的 chain、learning curve（构建时跑 20 个 seed 的 tabular Q-learning）、PPO 为什么不能 relabel 的论证、tabular 的局限是自己加的。
:::

## [meta] Meta-RL：in-context adaptation 与 exploration

:::skip
快速路线可以跳（调研条目的建议，代价不大）。能写出 black-box meta-RL 的训练步骤，能在 hallway 上算出三种 strategy 的 expected 步数并用它们解释 coupling，就可以去下一站。
:::

### 从 multi-task 到 meta-learning

人用一台没见过的咖啡机，几分钟就会了；一个用 PPO 训练的 robot 可能要试几百万次。差别在于人带着用过别的咖啡机的经验。Lecture 13 把“带着经验去学新 task”分成三种：

1. **Forward transfer**：在 source task 上 train，再在 target task 上 fine-tune。
2. **Multi-task transfer**：在很多 task 上 train，拿到新 task 的 descriptor 后 zero-shot 执行（[第 4 站](#mtrl)）。
3. **Meta-learning**：在很多 task 上学“怎样学”，新 task 的 descriptor 是在里面试的几次经验，in-context 地给出。

Goal-conditioned policy 能对新 goal zero-shot，是因为 goal 写在 input 里。Meta-RL 面对的是 task 不能直接告诉 agent 的情况：哪个迷宫、哪种地面、用户喜欢什么，只能从经验里推断。设定是：meta-training 的 task 来自一个 distribution，test task 来自同一个 distribution；一个 exploration policy $\pi_{\text{exp}}$ 先收集 $k$ 个 rollout（episodic 版本）或 $k$ 步（online 版本）得到 $\mathcal D_{\text{train}}$，然后 task policy $\pi_{\text{task}}(a\mid s,\mathcal D_{\text{train}})$ 执行（转述在这一页有乱码，两种版本和“$k$ 个 rollout”“$k$ 步”的对应是按通常的定义写的）。两个 policy 可以共享 parameter；slide 还说，$\pi_{\text{exp}}$ 可以看成在推断 task identifier $z_i$。

### Black-box meta-RL：把经验当 input

最直接的做法是用一个有 memory 的 network（RNN 或 Transformer），每一步输入 $s_t$ 以及上一步的 action、reward，输出 action。Hidden state 在同一个 task 的多个 episode 之间不清零，$\mathcal D_{\text{train}}$ 就是这段不断变长的 context。

Meta-training：

1. 抽一个 task $i$。
2. 用 $\pi(a\mid s,\mathcal D^i_{\text{tr}})$ 在 task $i$ 里连续跑 $N$ 个 episode。
3. 把整段 sequence 存进 task $i$ 的 replay buffer。
4. 更新 policy，最大化所有 task 上的 discounted return。

Meta-test：抽一个新 task $j$，用同一个 network 跑最多 $N$ 个 episode，不做任何 gradient update，所有的“学习”都发生在 hidden state 里。

Reward 必须是 input。在同一个 hallway 里，goal 在左还是在右，state 看起来完全一样，唯一的区别是走到某一端时有没有 reward。不把 reward 喂进去，network 永远分不清它在哪个 task 里。这也说明了另一种看法：task identifier 不在 state 里时，meta-RL 就是一个 POMDP，unknown 的 task 是 hidden state 的一部分，policy 要先 explore 推断 task，再执行。

Lecture 13 列的代表方法：RL²（Duan et al. 2017，RNN，TRPO/A3C）、Wang et al. 2017（RNN）、SNAIL（Mishra et al. 2018，attention 加 1D conv，TRPO）、PEARL（Rakelly et al. 2019，feedforward 加 averaging，SAC 和 replay buffer）。SNAIL 在 1,000 个小迷宫上 meta-train，test 时面对没见过的小迷宫和大迷宫，输入是 image。Lecture 13 对 black-box 方法的评价：general、expressive、architecture 可以随便选；难在 optimize；meta-training 的 sample efficiency 由外层用的 RL optimizer 决定（所以 PEARL 用 SAC 和 replay buffer）。

### Exploration 和 exploitation 互相依赖

Lecture 13 的 running example 是 hallway：有好几条 hallway，每个 task 的 goal 在其中一条的尽头，agent 不知道是哪一条；讲 posterior sampling 时又加了一个条件，墙上有一个 sign 写着正确的 goal。Slides 没有给具体的几何，下面用一条最小的 hallway 把它算清楚：位置是 $-6,\dots,6$，从 0 出发，goal 在 $-6$ 或 $+6$，各 0.5；$-2$ 处墙上有一个 sign，写着 goal 在哪边；每走一步 reward $-1$，到达 goal 结束。

**Posterior sampling（PEARL 的做法）。** 按当前 belief 抽一个 goal，去那里；不对，再去另一头。猜对（0.5）：6 步。猜错（0.5）：先走 6 步到错的一端，再走 12 步到另一端，18 步。expectation 是 $0.5\times6+0.5\times18=12$ 步。

**先读 sign。** 走 2 步到 $-2$，读到 goal 在哪边。Goal 在 $-6$：再走 4 步，共 6 步。Goal 在 $+6$：再走 8 步，共 10 步。expectation 是 $0.5\times6+0.5\times10=8$ 步。

::fig[cs224r-hallway] 动图，goal 在 $+6$ 的那一次。看两个黑点：上面那个先跑到 $-6$ 扑空再折返，下面那个先拐到 sign 下面，然后一路走到底。

读 sign 每个 episode 省 4 步。Posterior sampling 学不到这一点：它只会在可能的 task 之间抽样执行，从不做“对哪个 task 都没用、只为了获得信息”的 action。Lecture 13 给它举的失败情形正是“goal 很远、墙上有 sign 告诉你正确的 goal”。

那 end-to-end 地用 task reward 训练 black-box policy，能不能自己学会去读 sign？原则上能，它的 optimum 就是 8 步的 strategy。问题在训练过程中。设 policy 已经会走到 hallway 的一端，但还不会根据 sign 的内容选方向（读 sign 的能力要靠见到 sign 之后的 reward 慢慢学）。这时候去 sign 只是多绕一段路：

- 从 $-2$ 往 $-6$ 猜：goal 在 $-6$ 时共 $2+4=6$ 步；goal 在 $+6$ 时共 $2+4+12=18$ 步。
- 从 $-2$ 往 $+6$ 猜：goal 在 $+6$ 时共 $2+8=10$ 步；goal 在 $-6$ 时共 $2+8+12=22$ 步。

两种猜法各一半，expectation 是 $(6+18+10+22)/4=14$ 步，比不去 sign 的 12 步多 2 步。

| strategy | expected 步数 | return |
|---|---|---|
| 先读 sign 并会用 | 8 | −8 |
| 不读 sign，posterior sampling | 12 | −12 |
| 先去 sign，但还不会用 | 14 | −14 |

Exploration（去 sign）的价值依赖 exploitation（会读 sign）；exploitation 要学会，又依赖 exploration 把 agent 带到 sign 前面。在两者都还不会的时候，去 sign 的 return 更低，gradient 把 policy 推离 sign，于是 exploitation 永远没有 data 学会读 sign。Lecture 13 引 Liu et al.（ICML 2021）把这叫作 coupling，用的例子是做饭：找不到食材（exploration 差）就学不会做菜（execution 差），于是每一种 exploration strategy 得到的 reward 都低。后果是 poor local optima 和 poor sample efficiency。Slide 对 end-to-end 训练的评价因此是：简单、原则上 optimal，exploration 难时 optimize 也难。

### 拆开训练

Lecture 13 讲的第二类办法是给 exploration 一个不依赖 exploitation 的 objective：

- **Posterior sampling（PEARL）**：学 $p(z)$、$q(z\mid\mathcal D_{\text{tr}})$ 和 $\pi(a\mid s,z)$，按 posterior 抽 $z\sim q(z\mid\mathcal D_{\text{tr}})$ 再用 $\pi(a\mid s,z)$ 执行。Sign 的例子里会失败（上面 12 对 8）。
- **Dynamics 和 reward prediction（MetaCURE，Zhang et al. 2020）**：学 $f(s',r\mid s,a,\mathcal D_{\text{train}})$，exploration 的目标是收集让这个 model 准的 data。Slide 给的失败情形是 distractor 多、dynamics 复杂或维数高：它会花力气去预测和 task 无关的东西。
- **Compressed task representation（DREAM，Liu et al. 2021）**：学 $f(z_{\text{comp}}\mid\mathcal D_{\text{train}})$，exploration 的目标是收集让“task 是哪个”预测准的 data。Slide 的评价：原则上 optimal，容易 optimize；缺点是 meta-training 时需要 task identifier。

Slide 上前两种方法旁边还有“+ easy to optimize”“+ principled strategies”“−− 在某些 environment 里会差任意大”几条，转述说版面上看不清每条属于哪一个。

用 hallway 看 DREAM 为什么有效：exploration policy 的 reward 是“它收集的经验能多准确地预测 task id”。去 $-2$ 读 sign 只要 2 步就能百分之百预测 goal 在哪边，跑到一端扑空要 6 步才能知道。这个 objective 从一开始就奖励去 sign，不需要等 exploitation 学会。Exploitation policy 则在“知道 task”的条件下单独训练。代价就是上面说的：meta-training 时每个 task 要有 identifier，才能拿来当预测的 target。

:::wrong Meta-RL 的难点在 adaptation 的速度，exploration 交给 ε-greedy 或 entropy bonus 就够了
上面 hallway 里 sign 的价值完全来自“知道 goal 在哪以后走得更短”。ε-greedy 在每一步随机偏一下，走到 $-2$ 的 probability 不低，但随机路过 sign 不会让 policy 学到“读了要用”；entropy bonus 让 action 更分散，同样不区分“有信息的”和“没信息的”随机。Meta-RL 需要的 exploration 是有目的地收集关于 task 的信息，评价标准是“看完之后后面的 episode 能好多少”，这正是 coupling 难的原因。Lecture 13 在讲 problem setting 时就说，exploration 和 exploitation 的 trade-off 是 meta-RL 独有的部分。
:::

:::edge Online 和 episodic 两种设定
Episodic 设定里，exploration 的 episode 本身的 return 不计入评价，exploration 可以不计成本；online 设定里每一步都算 return，读 sign 的那几步要自己挣回来。上面的 8 对 12 是 online 的算法（一个 episode 里先 explore 后执行）。Sign 在 hallway 上时，读它总是划算的：放在 $-6$ 那一端，读 sign 的期望是 $0.5\times6+0.5\times18=12$，和 posterior sampling 打平，放在中间任何地方都更好。如果 sign 在 0 处一条长 $b$ 的岔路尽头，读 sign 要先走 $2b$ 步来回，再走 6 步，共 $2b+6$；只有 $b<3$ 时才比 12 少。在 episodic 设定里 $b$ 多大都值得读。最优的 exploration 取决于设定和环境的几何。
:::

:::from
咖啡机的例子、三种 transfer、task 的定义、$\pi_{\text{exp}}$ 和 $\pi_{\text{task}}$、episodic 与 online 两种设定、black-box 方法的结构和 meta-training/meta-test 步骤、代表方法表、SNAIL 的 1,000 个迷宫、“reward 作为 input”、POMDP 的看法、hallway 的 running example、coupling（Liu et al. 2021）、PEARL、MetaCURE、DREAM 的优缺点来自 [CS224R Lecture 13](https://cs224r.stanford.edu/slides/13_cs224r_metarl_2026.pdf)（抓取工具的逐页转述，读了两遍）。第二遍改了三处：slides 的 hallway 是“好几条 hallway，goal 在其中一条尽头，墙上有 sign”，没有给几何，第一版写得像 slide 本身就是一条 hallway 的两端；PEARL“容易 optimize”在版面上不能确定是说它的，已删；slides 没有 key takeaway 一页，第一版那句改成了 problem setting 页上的说法。补上了 coupling 的做饭例子、MetaCURE 和 DREAM 的出处、black-box 方法的三条评价。Optimization-based（MAML 类）方法在 slides 上只有一个标签，这一站没有写；slides 后面的 test-time compute（Qu et al.）和 CS106A 批改作业两个应用例子也没有写。Hallway 的几何（$\pm6$、sign 在 $-2$）、三种 strategy 的步数、DREAM 在 hallway 上的分析是自己构造和算的。
:::

## [robot] RL for robots：sim-to-real 与 VLA 的 RL fine-tuning

:::skip
快速路线必读（Lecture 16–17），和 robot foundation model 的 post-training 最直接相关。能由子步骤的 success rate 算出整体 reliability，能说出 DSRL 和 EXPO 各在哪里接上一个小 policy、各自能到达哪些 action，就读完了。System identification 与 domain randomization 的基本做法在 [RB4301 的 s2r 站](../courses/RB4301.html#s2r)；massively parallel PPO、asymmetric actor-critic、teacher-student、domain randomization 的代价在 [MODERN-RL 的 simrl 站](../courses/MODERN-RL.html#simrl)；DPPO、πRL、SimpleVLA-RL、π*0.6 的 RECAP 在 [MODERN-RL 的 finetune 站](../courses/MODERN-RL.html#finetune)。这里只写那两页没有的部分。
:::

### Sim-to-real：gap 分两类，工具分三类

Lecture 16（Guanya Shi 客座）给的标准做法：在大规模并行的 simulation 里用 PPO 训练，地形 randomization 加上随机的外力和力矩，然后直接部署到真机。Simulation 的 data 便宜、快、安全、带 ground-truth label、不磨损 robot；问题是 sim 和 real 不一样。这一讲把 gap 分成两类，每一类对应的工具不同：

| gap | 例子 | 能不能靠调 parameter 补上 | 主要工具 |
|---|---|---|---|
| Parametric | mass、inertia、friction 不准 | 能，parameter 本身在 simulator 里 | domain randomization；system identification；learning to adapt |
| Non-parametric | aerodynamics、流体、轮胎、link 建模的误差 | 不能，simulator 里根本没有这项物理 | 用真实 data 学 residual（perception、dynamics、actuator） |

**Domain randomization** 随机化 simulator 的 parameter $\xi$，训练一个对所有 $\xi$ 都能用的 policy $\pi(s)$，slide 说它本质上是 robust control；它最早用在 perception 上，现在也用来随机化 dynamics、sensor 和 delay。不知道真实的 $\xi$ 也能用，代价是 policy 看不到 $\xi$，只能在所有 $\xi$ 上一起折中（这句是自己的解释）。**Learning to adapt** 训练 $\pi(s,\xi)$，让 policy 按 $\xi$ 调整自己，slide 说这是 adaptive control，两者可以合起来用（robust adaptive control）。麻烦是真机上 $\xi$ 通常不知道，所以常用 teacher-student：在 sim 里训练能看到 privileged information（contact、terrain、friction、外力）的 teacher $\pi(s,\xi)$；再在 sim 里训练只看真机能拿到的 input（proprioception 的 history）的 student $\pi'(s,\cdot)$ 去模仿 teacher，这一步是一个 imitation learning 问题；最后把 student 部署到真机。

RMA（Kumar et al. 2021）是 student 在 latent space 里学的版本，slides 只给了名字，下面的细节来自论文。Phase 1 用 PPO 同时训练 base policy $a_t=\pi(x_t,a_{t-1},z_t)$ 和 encoder $z_t=\mu(e_t)$：$x_t$ 是 30 维的 proprioception，$e_t$ 是 17 维的 environment factor（mass 和它的位置 3 维、12 个 motor 的 strength、friction 1 维、脚下的 terrain 高度 1 维），$z_t$ 是 8 维。Phase 2 训练 adaptation module $\hat z_t=\phi(x_{t-50:t-1},a_{t-50:t-1})$，用最近 50 步（约 0.5 秒）的 state 和 action 回归 $z_t$，loss 是 $\|\hat z_t-z_t\|^2$；data 是 on-policy 的，sim 里跑的 base policy 用的是 $\phi$ 自己预测的 $\hat z_t$，而不是真的 $z_t$，这样 $\phi$ 见过自己出错之后的 state。部署时 base policy 原样不动，100 Hz 运行，adaptation module 10 Hz 异步更新 $\hat z_t$。和直接模仿 teacher 的 action 相比，student 只需要从 history 里认出“现在是什么样的 environment”，怎样走路仍由 phase 1 的 base policy 负责。

**Asymmetric actor-critic** 把两阶段合成一阶段：actor 只用真机能拿到的 input，critic 用 privileged information，因为部署时只需要 actor。Slide 的例子是 FALCON（Zhang et al., L4DC'26）：actor 看当前一步的 proprioception 加 4 步 history，critic 另外还看 root velocity 和 end-effector 的力。**Real2sim** 反过来改 simulator：SPI-Active 做 sampling-based system ID，并用一个最大化 Fisher information 的 policy 去收集最能确定 parameter 的 data；或者用真实 data 学 perception、dynamics 的 residual 来增强 simulator，再在增强后的 simulator 里训练。Actuator net 学真实电机的 torque，需要 torque label；没有 label 时可以用 RL 去拟合一个 residual torque model，让 sim 的 trajectory 贴近真实的。

这一讲另一半讲 human data。动机是 reward 和 task definition 难写：locomotion 还算简单，loco-manipulation 和 dexterous manipulation 就很难。做法分两步：先把人的动作 retarget 到 robot 上（通常只在 kinematics 层面），再在 simulation 里用 RL 学 whole-body tracking（ASAP、BeyondMimic）。Kinematic retargeting 只管姿态像不像，人和 robot 的身体不同，retarget 出来的动作不一定在物理上做得到，slide 把这叫 physics gap，由第二步 simulation 里的 RL 来补。Slide 举的两个改进：OmniRetarget 用 interaction mesh 同时考虑 robot 和物体、场景的相对位置，让“手在箱子上”这类接触关系在 retarget 后保留下来；SPIDER 直接在 dynamics 层面 retarget，把它写成一个 optimal control 问题，用 sampling-based 方法解。Simulation 提供物理，human data 提供“要做什么”，后者正是 simulation 自己给不出来的东西。

### 80% 与 99%

Lecture 17 的出发点是一个数字：用 imitation learning 训练的 VLA 常常停在 80% 左右的 success rate（slide 配的是 π0.5 在没见过的房间里的表现），而一个能自主工作的 robot 要 99% 以上。差这 19 个百分点为什么这么难，算一下就清楚。一个 task 由 10 个依次执行的子步骤组成，每一步都要成功：

$$0.98^{10}=0.817,\qquad 0.999^{10}=0.990$$

每步 98% 就是整体 82%，要整体 99% 每步得到 99.9%。反过来，整体 80% 对应每步 $0.8^{1/10}=0.978$。剩下的 failure 分散在各种少见的 state 里，每一种都只占很小的比例，再多收 demonstration 也很难恰好覆盖它们；RL 让 robot 自己在出错的地方收 data、按结果改进，这正是它适合补的部分。Pretrained 的 VLA 是 RL 很好的初始化；slide 也提到 DAgger 能帮忙，实际中常和 RL 一起用。

难处分两组。第一组是 VLA 很大：每次 gradient update 都贵；training 常在 cloud 上跑，robot 的 rollout 在本地电脑上跑，一次 iteration 要来回；大量调 hyperparameter 很贵。第二组是 VLA 用 imitation 做 pretraining：没有 pretrained 的 value function 或 critic；action head 用 diffusion 或 flow matching 训练，标准的 RL algorithm 不能直接套（没有现成的 $\log\pi(a\mid s)$）；action chunking 在 RL 里也不常见。

第一组难处决定了 online 和 offline 的取舍。Slide 的对比：online RL（例如 SAC）每个 gradient step 配一个 timestep 的新 data；iterated offline RL 先收 1k 个 episode，再做 10k 个 gradient step。出了 bug 或者 learning rate、epoch 数、gradient clipping 调错了，online 要重跑整个实验、重新收 data，offline 只要在已有的 dataset 上重新 train，所以 slide 说 offline 对大 model “much simpler”。

Lecture 17 比较了四条路。**PPO**：πRL（Chen et al. 2026，fine-tune π0.5）和 SimpleVLA-RL（Li et al. 2025，fine-tune OpenVLA），要海量的 online rollout，很多论文不报告 sample 数，结果只在 simulation 里。**π*0.6 的 offline、supervised 式 RL**：用 pretrained VLM 在大量 demonstration 上 fit 一个 multi-task、language-conditioned 的 value function，用 Monte Carlo 的方式预测 time-to-go；由它估出 advantage，二值化成“这个 action 好还是坏”，policy 以这个二值化的 advantage 为 condition 做 supervised fine-tuning；循环是收一大批 rollout 和人的 intervention、更新 value、更新 VLA。报告比只做 imitation 的 post-training 高约 2 倍 throughput，和人一起做 latte 的任务连续跑了 13 小时。Slide 接着列了它可能改进的地方：TD 应该比 Monte Carlo 好，policy improvement 可以更强，online RL 能更快找到 failure mode，代价是 infrastructure 更复杂。**DSRL** 和 **EXPO** 是下面两种只训练一个小 Gaussian policy、不动 VLA weights 的 online 方法。

### DSRL：在 noise 上加一个小 policy

Flow matching 的 action head 是一个 deterministic 的 map：从 Gaussian noise $z$ 出发解 ODE，得到 action $a=f_s(z)$。平时 $z$ 从 $\mathcal N(0,I)$ 抽。DSRL（diffusion steering）的想法是：不改 $f$，改 $z$ 从哪里来。训练一个小的 Gaussian latent policy $\pi^z(z\mid s)$，执行时 $a=f_s(\pi^z(s))$。Lecture 17 写的步骤（记号换成本页的）：

1. 抽 $z_t\sim\pi^z(\cdot\mid s_t)$。
2. VLA 从 $z_t$ denoise 出整个 action chunk $a_{t:t+h}=f_{s_t}(z_t)$。
3. 在 environment 里执行这个 chunk，观察 $s_{t+h}$。
4. 把 $(s_t,z_t,r_t,s_{t+h})$ 存进 buffer，用 SAC 更新 $Q_\phi(s_t,z_t)$ 和 $\pi^z$。

对这个小 policy 来说，“action”就是 $z$，environment 包括了冻结的 VLA。DSRL 论文把这写成一个新的 MDP：action space 是 noise space $\mathcal W$，transition 和 reward 都是原来的 MDP 在 decode 出的 action 上的值，

$$P^{\mathcal W}(\cdot\mid s,z)=P\big(\cdot\mid s,f_s(z)\big),\qquad r^{\mathcal W}(s,z)=r\big(s,f_s(z)\big)$$

所以这个 MDP 上的 Q 满足 $Q^{\mathcal W}(s,z)=Q\big(s,f_s(z)\big)$，任何 RL algorithm 都能直接用，VLA 本身既不需要 gradient，也不需要 log-probability，只需要 forward pass。Action chunk 被当作一个整体的 action，chunk 内部的 observation 不用。论文还有一个 DSRL-NA 的变体，同时学 action space 的 $Q^{\mathcal A}(s,a)$，再用 $z\sim\mathcal N(0,I)$ 回归 $Q^{\mathcal W}(s,z)\approx Q^{\mathcal A}(s,f_s(z))$：很多不同的 $z$ decode 成几乎相同的 action，一个 action 的 value 可以同时告诉 critic 许多 $z$ 的 value，不必每个都去执行。Lecture 17 报告的规模：65 个 online episode（约 1 万步），大约比 PPO 高效 100 倍；slide 还提到 RL 之后可以把 policy 的 data distill 回 VLA。

它能到达哪些 action？用一维例子看。Base policy 是在 $\pm1$ 两个 mode（各自 standard deviation 0.1）上训练好的 flow matching policy，$f(z)$ 用它的 velocity field 做 200 步 Euler 算出来。Q 是一个峰在 $a=1.45$ 的函数，$Q(a)=\exp\big(-(a-1.45)^2/(2\times0.2^2)\big)$：最好的 action 比 demonstration 的 mode 稍微往外。

| $z$ | −1 | −0.1 | 0.01 | 0.1 | 0.5 | 1 | 2 | 3 |
|---|---|---|---|---|---|---|---|---|
| $a=f(z)$ | −1.046 | −0.860 | 0.757 | 0.860 | 0.970 | 1.046 | 1.165 | 1.272 |
| $Q(a)$ | 0.000 | 0.000 | 0.002 | 0.013 | 0.056 | 0.130 | 0.362 | 0.672 |

$f$ 几乎是一个台阶：$z<0$ 映到 $-1$ 附近，$z>0$ 映到 $+1$ 附近，$-0.757$ 到 $0.757$ 之间的 action 只对应 $|z|<0.01$ 这一小段。Base policy 按 $\mathcal N(0,1)$ 抽 $z$ 时，expected $Q$ 只有 0.058。Latent policy 学会只出 $z>0$ 的大值。$z$ 不能无限大：base policy 只在 $\mathcal N(0,I)$ 的 noise 上训练过，太远的 $z$ decode 出来的东西不可靠。DSRL 论文因此把 latent action 限制在一个 box $[-b_{\mathcal W},b_{\mathcal W}]^d$ 里，说 online RL 时 $b_{\mathcal W}\in[1,3]$ 一般都行。这个例子取上限 $b_{\mathcal W}=3$，最好是 $z=3$，$Q=0.672$。

::fig[cs224r-dsrl] 左边是 base policy 的 $a=f(z)$，右边是 $Q(s,a)$。看虚线：DSRL 最远只能把 action 推到 1.272，Q 的峰 1.45 在 $f$ 的值域外。

这是 DSRL 的性质，不是这个例子的偶然：$a$ 永远是 $f$ 的输出，只能落在 base policy 会产生的 action 里。好处是安全，VLA 学到的“合理动作”不会被 RL 破坏，DSRL 论文在 offline 设定下也把“冻结的 diffusion policy 只输出 in-distribution 的 action”当作优点；坏处是 base policy 从来不做的动作，它也做不出来。论文的 Limitations 一节说得更直接：DSRL 的 exploration 由底下的 diffusion policy 决定，不保证所有 diffusion policy 都 steerable，在很窄的 data 上训练、action distribution 很集中的 policy 可能提供不了足够的“选项”。

### EXPO：在 action 上加一个小的 edit

EXPO（Dong, Li, Sadigh, Finn，ICLR 2026）换一个位置接小 policy：base policy 照常 sample action，一个小的 Gaussian edit policy 在它上面加一个修改 $\hat a=a+\delta$，$\delta\sim\pi^{\text{edit}}(\cdot\mid s,a)$。论文里 $\delta$ 被缩放到 $[-\beta,\beta]$，$\beta$ 是 hyperparameter（例子里有 0.05 和 0.7 两种，按需要多少 exploration 选）。两个 policy 分工不同：

- Base policy 只用 imitation loss 训练，Lecture 17 写的是“在所有成功的 data 上做 imitation”，从不直接最大化 $Q$。
- Edit policy 用 SAC 式的 objective 最大化 $Q$：$\max\ \mathbb E\big[Q_\phi(s,a+\delta)-\alpha\log\pi^{\text{edit}}(\delta\mid s,a)\big]$，$a$ 来自 data。

执行时用一个 on-the-fly（OTF）policy：从 base 抽 $N$ 个 action $a_1,\dots,a_N$，各自 edit 一次得到 $\hat a_1,\dots,\hat a_N$，在这 $2N$ 个 candidate 里取 $Q_\phi(s,\cdot)$ 最大的那个执行。Bellman backup 里的 $a'$ 也从这个 OTF policy 取：$y=r+\gamma Q_{\bar\phi}(s',\hat a^*)$，$\hat a^*$ 是 $s'$ 处 $2N$ 个 candidate 里 $Q$ 最大的。

接着上面的例子：base policy 抽 4 个 $z=(-0.8,0.3,1.2,-1.5)$，得到 $a=(-1.018,0.928,1.072,-1.108)$，$Q=(0.000,0.033,0.167,0.000)$。设 edit policy 已经学会往上推 $\delta=+0.3$（在 $\beta=0.7$ 的范围内），edit 后是 $(-0.718,1.228,1.372,-0.808)$，$Q=(0.000,0.540,0.926,0.000)$。8 个 candidate 里 $Q$ 最大的是 $1.372$，$Q=0.926$，执行它。

为什么要把 base 的 sample 也放进 candidate、再取 max？Edit policy 是靠 gradient 慢慢训练的，它总是落后于 Q：Q 已经知道某个 base action 更好时，edit policy 可能还在把它推向旧的方向；单独靠它，slide 说可能不稳定，像一般的 RL 一样会 collapse。OTF policy 每一步都直接用最新的 Q 去挑，Q 一变，执行的 action 和 TD target 立刻跟着变。把没 edit 的 base sample 一起比，执行的 action 的 $Q$ 至少不低于 base 最好的那个 sample。Lecture 17 的说法是这减少了对 Q 的 lag，而且 edit policy collapse 时也不怕；它还展示了一个 ablation：backup 里不用 OTF policy 时，value 的最大化明显受阻，有的 environment 上效果很差。Lecture 17 报告的规模（EXPO-FT，Dong, Hung, Gao, Sadigh, Finn 2026，把 EXPO 用到 VLA 上）：平均约 19 分钟的真机经验（约 1.1 万步），slide 写了“10x speed”但没说相对谁；reliability 高于 SFT 和 DAgger，学得比 DSRL 和 HIL-SERL 更快更好。

| | 小 policy 输出 | 能到达的 action | 需要 VLA 的什么 |
|---|---|---|---|
| DSRL | noise $z$ | 只有 base policy 的值域 $f_s(\cdot)$ | 能 sample，不需要 gradient 和 log-probability |
| EXPO | 对 action 的 edit $\delta$ | base action 附近，可以超出 base 的 support | 能 sample，不需要 gradient 和 log-probability |
| PPO 类（DPPO、πRL） | 直接改 VLA 的 weights | 任意 | 每步 denoising 的 log-probability 和 gradient |

:::wrong 在 noise space 里做 RL 比直接 fine-tune 弱，只是因为 latent policy 太小
上面的例子里 latent policy 是最优的（已经取到 $z$ 的上限），$Q$ 仍然只有 0.672，因为 $f$ 的值域里没有 1.45。限制来自结构，不来自 capacity：把 latent policy 换成多大的 network，$a=f_s(z)$ 这一条都不变。反过来，这个限制在 base policy 已经覆盖了好 action、只是 sample 得不对时（例如两个 mode 里只有一个能成功）完全不吃亏，DSRL 的高效正来自 search space 被压小了。
:::

:::edge Lecture 17 自己的保留
Lecture 17 最后说：这些结果说明 RL 能明显改进最好的 VLA、接近部署所需的 reliability，但方法仍不令人满意。Residual policy 和 latent-space RL 都是绕开“直接对 VLA 的 weights 做 RL”的 workaround，后者仍是开放问题。
:::

:::back
Policy gradient 需要 $\log\pi(a\mid s)$ 而 flow policy 给不出、DPPO 怎样把 denoising 写成两层 MDP、π*0.6 的 advantage conditioning 的 Bayes rule 推导见 [MODERN-RL 的 finetune 站](../courses/MODERN-RL.html#finetune)。SAC 见 [CS285 的 q 站](../courses/BERKELEY-CS285.html#q)。DSRL 用的 Q 是在“$z$ 是 action”的 MDP 上学的，这和[第 4 站](#mtrl)把 task identifier 并进 state 是同一类操作：重新定义 MDP 的边界，让标准 algorithm 能直接用。
:::

:::from
Sim-to-real 的标准做法、simulator 与 framework 的区别、gap 的两类、domain randomization（robust control）与 learning to adapt（adaptive control）、teacher-student 的三步、RMA 学 latent、asymmetric actor-critic 和 FALCON 的 input、SPI-Active 的 Fisher information、real2sim 的 residual、actuator net 和 unsupervised residual torque、human data 的两步、physics gap、OmniRetarget 和 SPIDER 来自 [CS224R Lecture 16](https://cs224r.stanford.edu/slides/16_cs224r_sim2real_robot_learning_2026.pdf)（抓取工具的转述，读了两遍，只有条目，没有推导；domain randomization 的那个式子转述里是乱码）。RMA 的两阶段、$e_t$ 的组成、维数、50 步 history、on-policy 的 phase 2 和两个频率来自 [RMA 论文](https://ar5iv.labs.arxiv.org/html/2107.04034)第 3 节和附录（第一版写的“交给同一个 base policy”当时没有出处，这次在论文里核实了）。Slides 后半的 RL algorithm 列表（SAPG、FastTD3、FPO、BFM-Zero）和 Sim2Real 1.0 到 4.0 的历史只有名字，这里没写。80% 与 99%、两组障碍（第一版写成“三个障碍”，slide 上是“VLA 很大”“用 imitation pretrain”两个标题，下面各有几条）、online 与 offline 的 1k episode 和 10k gradient step、PPO 的两篇论文、π*0.6 的 time-to-go 和二值化 advantage、2 倍和 13 小时、DSRL 的步骤、65 个 episode 和 100 倍、EXPO 的结构（base 只做 imitation、edit 是 Gaussian、$2N$ 个 candidate 取 Q 最大、backup 用 OTF policy）、ablation、19 分钟、“10x speed”、和 SFT、DAgger、DSRL、HIL-SERL 的比较、最后的保留来自 [CS224R Lecture 17](https://cs224r.stanford.edu/slides/17_cs224r_rl_vlas_2026.pdf)（读了两遍）。Latent-action MDP 的定义、DSRL-NA、box 约束和 $b_{\mathcal W}\in[1,3]$、in-distribution 与 Limitations 来自 [DSRL 论文](https://arxiv.org/html/2506.15799v2)；edit 的 $[-\beta,\beta]$、edit policy 的 SAC objective、OTF policy 的公式来自 [EXPO 论文](https://arxiv.org/html/2507.07986v2)（两篇都是工具转述，$N$ 的取值没有读到）。$0.98^{10}$ 的算术、一维的 flow map 和 Q、DSRL 与 EXPO 能到达哪些 action 的比较、$\delta=+0.3$ 的假设是自己加的；这次用代码重算时改了两个数：$z=0.01$ 处的 $Q$ 是 0.002（原来写 0.003），base policy 的 expected $Q$ 是 0.058（原来写 0.057）。
:::

## 作业

三份作业的 handout、starter code 和 LaTeX 模板都在课程主页公开（Spring 2026 的期限：HW1 4 月 3 日到 10 日，HW2 4 月 10 日到 24 日，HW3 4 月 24 日到 5 月 8 日，各一到两周）。HW2、HW3 的 handout 只支持 Modal（注册学生有课程发的额度）；HW2 另有一个本地的 conda 环境，助教不支持。三份 handout 都禁止用 generative model 写代码。每条提示后面注明来源：handout 指对应作业的 PDF，“guide”指 compute guide，“guidelines”指 default project guidelines，“调研”指本站调研条目里的说法，“经验”是没有官方出处的工程经验，“自己算的”是本页的计算。

Compute guide 是一份 Modal 的通用说明，对三份作业都有用的几条：

- Worker 的本地磁盘是临时的，job 一结束就清空；checkpoint 和结果要写进 Modal Volume 并 `commit()`（guide）。HW3 的 D4RL dataset 每个 run 都重新下载就是这个原因。
- `@app.function` 的 `timeout` 以秒计，到时 Modal 直接杀掉 job；guide 的模板里是 3600，HW2 里 2 小时的 run 要确认 timeout 够长（timeout 的行为来自 guide；“确认够长”是经验）。
- 远程调试：代码里写 `breakpoint()`，用 `modal run -i` 运行，pdb 会连到本地 terminal；IDE 里点的断点只对本地有效。`modal container list` 加 `modal shell <container-id>` 可以进到正在跑的 container 里看（guide）。
- 扫 hyperparameter 用 `.map` 或 `.starmap`，用 `max_containers` 限制同时跑的数量，否则额度很快用完（guide）。
- WandB 的 key 放进 Modal secret，不要写进代码或提交到 git（guide）。

| 作业 | 算力 | 免费 Colab | 优先级 |
|---|---|---|---|
| HW1 Imitation（Flappy Bird） | 小 MLP，handout 没提 GPU；有 Colab 说明 | 够（handout 给了 Colab 说明；CPU 是否够是调研的估计） | 值得做 |
| HW2 Online RL（gridworld、PPO、off-policy AC） | Modal GPU；10 critic、UTD 5 的 run 50k 步约 2 小时 | handout 不支持，自己移植要自备 GPU | 先做 |
| HW3 Offline RL（AWAC、IQL、filtered BC） | Modal；每个 run 约 10 分钟到 1.5 小时，每个设定 3 个 seed | handout 不支持 | 有余力再做（和 CS285 HW5 重叠，二选一） |
| Default project（Qwen2.5-0.5B 上的 SFT、IPO、RLOO） | Modal；每人 500 美元额度，约 100 小时以上 GPU | guidelines 没提 | 有余力再做 |

### HW1：Imitation learning（Flappy Bird 上的 regression BC、flow matching、DAgger）

**要实现的**：一个带 PD controller 的 Flappy Bird。Observation 是 4 维（到下一根管子的距离、两个 gap 的 y、bird 的 y，都已 normalize），action 是目标 y 位置，在 $[0,1]$；policy 一次输出 20 步的 action chunk，执行前 10 步再重新 query。Hard mode 里单 gap 和双 gap 的管子交替出现。一个 episode 最多 1000 步，活满 1000 步算成功；每个方法报告 50 个 eval episode 的 episode length 的 mean 和 standard deviation。三个 Problem 各 2 分，书面题分别要求 2–3 句（Problem 1、2）和 3–4 句（Problem 3）。Problem 1 在 `networks.py` 写 `BCPolicy`（三层 MLP，最后一层 Sigmoid）、在 `losses.py` 写 MSE 的 `bc_loss`；Problem 2 写 `FlowMatchingSchedule` 的 `interpolate` 和 `sample`（Euler 积分，结果 clamp 到 $[0,1]$），以及 `flow_matching_loss`；Problem 3 在 `dagger.py` 写 `DeterministicExpert.act`、`rollout_episode`、`rollout_and_relabel`。**做完会的**：亲眼看到 multimodal 的 data 怎样让 MSE policy 撞墙，以及 flow matching 和 DAgger 从两个不同方向解决它。**时间和算力**：handout 没有给；调研估计 6 到 10 小时，CPU 应该够。**优先级**：值得做（已做过 CS285 HW1 的可以只做 Problem 3）。

- Hard mode 的双 gap 管子上，expert 有时走上面有时走下面，MSE 的 minimizer 是 conditional mean，正好对着两个 gap 中间的管壁（handout 的 Problem 1 第 4 问要你解释的就是这个；conditional mean 的推导见 [RB4301 的 gen 站](../courses/RB4301.html#gen)）。
- 写 `interpolate` 时注意 handout 的约定：$a_{t,\tau}=\tau\,a_t+(1-\tau)\,a_{t,0}$，$\tau=0$ 是 noise、$\tau=1$ 是 data，target velocity 是 $a_t-a_{t,0}$；Euler 从 $\tau=0$ 积到 1（handout）。和某些教材 $\tau=0$ 是 data 的约定相反，抄公式时容易把符号弄反（经验）。
- Velocity network 必须以 $\tau$ 为 input，漏掉时会发生什么，CS285 的 il 站在一维的例子上算过（经验）。
- `DeterministicExpert.act` 是这份作业的关键：它的逻辑和 `Expert.act` 一样，但在双 gap 时必须按一个确定的规则选 gap（例如总选离 bird 当前 y 近的那个），否则 DAgger relabel 出来的 data 仍然是多峰的，MSE policy 照样学平均（handout 要求“resolve the ambiguity”，具体规则自己定；“选近的”是经验）。
- Problem 3 用默认的 5 轮 DAgger，learning curve 横轴是轮次、纵轴是平均 episode length 并带 standard deviation 的 error bar，把 Problem 1 的 regression 结果画成水平线；最后用 `python main.py --plot` 出三种方法（regression、flow matching、DAgger 最后一轮）的对比（handout）。`rollout_episode` 要记得 reset environment，并且执行的是 policy 的 action chunk（handout）。
- 提交的 zip 里除了代码还要有 `bc_reg_easy.txt`、`bc_reg_hard.txt`、`bc_flow_hard.txt`、`dagger_hard.txt`，文件名要严格一致；handout 一处说 `expert.py` 只读，提交清单里却有它，以 starter code 为准（handout）。

### HW2：Online RL（gridworld Q-learning、PPO、off-policy actor-critic）

**要实现的**：Problem 1 在 5×4 的 gridworld 上写 tabular Q-learning 的 `choose_action`（ε-greedy，平局随机）和 `train_q_learning`。Problem 2 在 `on_policy.py` 写 PPO 的 `compute_gae` 和 `update` 里的两段（算 advantage 与 return；log 空间算 ratio、clipped surrogate）；actor 是 $[-1,1]$ 上的 TruncatedNormal，从 BC 之后的 policy 出发，另有一个冻结的 reference actor，用 reverse KL 把 policy 拉在它附近。Problem 3 在 `off_policy.py` 写 off-policy actor-critic 的 `bc`、`update_critic`、`update_actor`：`bc` 在 20 条成功的 demonstration 上最小化 $-\log\pi_\theta(a\mid s)$；$N$ 个 critic，target 取随机抽出的两个 target critic 的 min，actor 最大化 $N$ 个 critic 的平均。任务是 4-DoF Sawyer 拿锤子钉钉子，state 里放的是最近两个 environment step 的状态（gripper、锤子的 pose 等），只有完全完成才有 reward 1.0。分值是 Problem 1 3 分、Problem 3 4 分（Problem 2 的分值转述里没对上）。**做完会的**：同一个 sparse reward 的操作任务上，on-policy 和高 UTD 的 off-policy 在 sample efficiency 上差多少、为什么。**时间和算力**：部分 run 超过 1 小时，10 个 critic、UTD 5 的 run 50k 步约 2 小时（handout）；人工时间 handout 没给。**优先级**：先做，这是 CS224R 和 CS285 差别最大的一份作业。

- Problem 1 先手算再跑。从 (0,0) 到 goal 2 要 4 步，到 goal 1 要 7 步，进入 goal 那一步的 reward 是 $r_{\text{step}}+R$。Scenario 1（$r_{\text{step}}=-1$、$R_1=10$、$R_2=5$）不打折时 goal 1 是 $-7+10=3$、goal 2 是 $-4+5=1$，选 goal 1；但 $\gamma=0.9$ 时 goal 1 是 0.097、goal 2 是 0.206，反过来选 goal 2，$\gamma=0.99$ 时又是 goal 1（2.621 对 0.911）。Scenario 2（$r_{\text{step}}=-2$）两种 $\gamma$ 下都选 goal 2。Scenario 3（$r_{\text{step}}=+1$，$R_1=R_2=1$）里永远不到 goal 最好（$\gamma=0.9$ 时 $1/(1-\gamma)=10$，大于 goal 1 的 $\sum_{t=0}^{6}0.9^t+0.9^6=5.217+0.531=5.748$），agent 会学会躲开 goal，episode 只会被步数上限截断。结论随 $\gamma$ 和步数上限翻转，所以跑之前先看 `gridworld_q_learning.py` 里设的 $\gamma$ 和 episode 上限，再解释学到的 trajectory（数字是自己算的；handout 只定义了 $\varepsilon$、$\alpha$、$\gamma$ 这几个符号，没有给取值，也没有提步数上限，只要求运行脚本并报告结果，取值以 starter code 为准）。每个 scenario 要报告学到的 trajectory 和 total reward，说明到没到 goal、到了哪一个，并用一句话解释（handout）。
- Handout 写了“40 × 4 = 160”个 Q 值，和 5×4 = 20 个 state 对不上（应是 $20\times4=80$），以 starter code 里 Q table 的 shape 为准（handout 原文的不一致）。
- `compute_gae` 从后往前：$\delta_t=r_t+\gamma(1-d_t)V(s_{t+1})-V(s_t)$，$A_t=\delta_t+\gamma\lambda(1-d_t)A_{t+1}$，return 是 $A_t+V(s_t)$（handout）。GAE 为什么是这个 recursion 见 [CS285 的 ac 站](../courses/BERKELEY-CS285.html#ac)。
- PPO 的 ratio 在 log 空间算再取 exp：$\exp(\log\pi_{\text{new}}-\log\pi_{\text{old}})$，避免 underflow/overflow；只改 `on_policy.py`（handout）。Handout 特意说明这个 agent 不是严格的 on-policy：同一批 rollout 会做好几个 epoch。
- Reverse KL 到 BC 之后的 reference actor，作用和 LLM RL 里 KL 到 reference model 一样：sparse reward 下大部分 rollout 没有 signal，没有这个项 policy 会从 BC 学到的能力上漂走（作用来自 handout 的说明；和 LLM 的类比是经验，推导见 [CS285 的 llm 站](../courses/BERKELEY-CS285.html#llm)）。
- Critic loss 完全平坦，说明 critic 没在更新；critic loss 极大，多半是 shape 或 broadcasting 错了（例如 $(B,)$ 和 $(B,1)$ 相减得到 $(B,B)$）。所有 $N$ 个 critic 每一步都要更新，不只是抽来算 target 的那两个（handout；$(B,B)$ 的例子是经验）。抽两个用 `random.sample`，不放回（handout）。
- Target 里的 $y$ 要 stop gradient；soft update 用 `utils.py` 里的 `soft_update_params`（handout）。随机抽两个取 min 是 REDQ 的做法，为什么能在高 UTD 下控制 overestimation 见 [MODERN-RL 的 offpolicy 站](../courses/MODERN-RL.html#offpolicy)（经验）。
- 达标线：PPO 到 1M 步 eval success 至少 25%；off-policy（2 个 critic、UTD 1）100k 步内至少 90%；（10 个 critic、UTD 5）40k 步内至少 90%（handout）。
- 改 UTD 时是在 `modal_off_policy.py` 的 subprocess 参数列表里加两个字符串，handout 的 code block 给的是 `"agent.num_critics=10"` 和 `"utd=5"`：一个带 `agent.` 前缀、一个不带，照抄，不要自己“统一”成同一种写法；跑完先在 log 或 WandB 的 config 里确认两个值真的生效（字符串来自 handout，handout 没有解释前缀为什么不同；确认的做法是经验）。这个 run 还要用一句话解释为什么 UTD 高、critic 多学得更快（handout）。
- 超过 1 小时的 job 用 `modal run --detach`；跑飞的 job 到 workspace 的 live apps 里停掉；Modal 找不到 WandB key 时建一个 `wandb-secret`。结果从 WandB 的 “eval/episode success” 图导出 CSV，文件名是 `on_policy.csv`、`off_policy.num_critics=2,utd=1.csv`、`off_policy.num_critics=10,utd=5.csv`，和三个 `.py` 一起打进 `submit.zip`（handout）。
- 最后一问要用两条曲线（PPO 和 2 个 critic、UTD 1 的 off-policy）比，用 3–5 句话说出 sample efficiency 和最终表现上至少两个差别，每个对应一个 algorithmic 性质：off-policy 能反复用 replay buffer 里的每个 sample（UTD 越高用得越狠）、能把 20 条 demonstration 一直留在 buffer 里，PPO 每批 data 用几个 epoch 就扔（handout 要求；具体的对应是经验）。

### HW3：Offline RL（AWAC、IQL、filtered BC，AntMaze 与 PointMass stitching）

**要实现的**：Problem 1 写 AWAC（`MLP_policy.py`、`awac_critic.py`、`awac_agent.py`）：actor 是 $\exp(A/\lambda)$ 加权的 negative log-likelihood，advantage 用当前 policy、stop gradient；critic 是 clipped double Q，target 是 $r+\gamma\,\mathbb E[\min_i\bar Q_i(s',a')]$，$a'$ 从当前 policy 抽。Problem 2 写 IQL（`iql_critic.py`、`iql_agent.py`）：expectile 的 $V$、用 $r+\gamma V(s')$ 的 $Q$、AWR 式的 actor。Problem 3 在 PointMass 的 stitching dataset 上比 IQL 和 top 10% 的 filtered BC（`--filter-top-percent 10`）。AntMaze 的 action 是 continuous 的，umaze 从左下到左上，medium 从左下到右上、要更长的 horizon；PointMass 的 action 是 discrete 的。分值是 Problem 1 2 分、Problem 2 5 分、Problem 3 1 分。**做完会的**：[第 1 站](#offline)的全部内容在 D4RL 上的样子。**时间和算力**：AWAC、IQL 在 umaze 约 1 小时、medium-diverse 约 1.5 小时，PointMass 上 IQL 约 15 分钟、filtered BC 约 10 分钟，每个设定 3 个 seed（handout）。**优先级**：有余力再做；已做 CS285 HW5 的可以只做 Problem 3。

- 先用 `modal_train.py --seed 1` 调通一个 seed，再用 `modal_train_para.py` 并行跑三个（handout）。
- 表格里的 mean 和 standard deviation 是跨 seed 的：先取每个 seed 最终 checkpoint 的 `Eval_AverageReturn`，再对这三个数算，不是在一个 run 内部对 eval episode 算（handout）。
- HW3 的 WandB secret 叫 `wandb`（`modal secret create wandb WANDB_API_KEY=... --force`），和 HW2 的 `wandb-secret` 名字不同，从 HW2 照抄会找不到 key（名字来自两份 handout；“照抄会找不到”是经验）。
- AntMaze 的 reward 是到 goal 为 0、其余每步 −1，PointMass 相同；评价是平均 return，失败的 episode 接近 −episode_length，越负越差。看 `/data` 下的 rollout 视频判断 agent 的真实行为（handout）。
- Problem 2 第一问（$\zeta=0.2$ 对 $0.9$）：$\zeta>0.5$ 才把 $V$ 往 data 里高的 Q 拉。第 1 站 s5 上的例子里，$\zeta=0.9$ 时 $V=0.71$、接近 data 里的 max 0.9，$\zeta=0.2$ 时 $V=-0.62$、比 behavior policy 的平均 −0.05 还低，等于假设自己以后会选更差的 action，stitching 不可能发生（自己算的；HW3 的 $\zeta$ 方向见第 1 站的 edge）。
- Problem 2 第一问要用 2–3 句话说明哪个 $\zeta$ 好、为什么；CSV 只交表现更好的那个 $\zeta$（handout）。
- Problem 2 第二问要做 Table 5（AWAC 和选定 $\zeta$ 的 IQL 在 umaze 与 medium-diverse 上的最终平均 return），并用 3 句话、从“怎样对待 OOD action 和怎样估 value”两方面解释谁在更难的 task 上更好：AWAC 的 target 里 $a'$ 从 policy 抽，policy 偏离 data 时 Q 就在 data 外被查询；IQL 的三个 loss 都只用 dataset 的 $(s,a)$（handout 给了解释的方向；具体论证见第 1 站）。
- Problem 3 的判断标准：dataset 里最好的一条 return 是 −46，平均 −104。IQL 高于 −46 才说明它把片段接了起来；filtered BC 最多接近 −46，因为它只模仿完整的好 trajectory（数字来自 handout；“最多接近 −46”是第 1 站的推论）。Table 6 要报告两种方法 3 个 seed 的平均 return 和最大 return（各自的 mean 和 standard deviation），再各附一张 trajectory 的可视化（选一个 seed、最终 checkpoint），图在下载下来的结果目录里（handout）。
- 每个文件夹恰好 3 个 CSV，每个 seed 一个，从 WandB 的 **Eval_AverageReturn** 导出，不要合并 seed、不要用别的 metric；CSV 文件夹名写的是 “medium_maze”，任务名是 `antmaze-medium-diverse-v0`，对应好（handout）。
- Dataset 下载到 `~/.d4rl/datasets/`，container 退出就清空，所以每个 run 都会重新下载（handout）。D4RL 的 AntMaze 依赖旧的 mujoco-py，本地装很容易卡在编译上，跟着 handout 用 Modal 的 image（调研，经验）。

### Default project：Countdown 上的 SFT、IPO 和 RLOO（LLM 的 RL fine-tuning）

**要实现的**：base model 只能用 Qwen2.5-0.5B 的 Base 版（不能用 Instruct 版），任务是 Countdown：给几个数和一个目标值，用加减乘除凑出目标。三个阶段都要自己写，不能用 `SFTTrainer` 一类的高层 trainer，也不能参考现成的 codebase（guidelines）：

1. **SFT**（`sft.py`）：在 `Asap7772/cog_behav_all_strategies` 上最大化 $\sum_{t=1}^{|y|}\log\pi_\theta(y_t\mid x,y_{<t})$，loss 只算 completion 的 token，不算 prompt 的。
2. **IPO**（`ipo_trainer/ipo.py`）：在 preference dataset `asingh15/countdown_tasks_3to4-dpo`（prompt、chosen、rejected 三元组）上，记 $h=\log\frac{\pi_\theta(y_w\mid x)}{\pi_{\text{ref}}(y_w\mid x)}-\log\frac{\pi_\theta(y_l\mid x)}{\pi_{\text{ref}}(y_l\mid x)}$，loss 是 $\big(h-\frac{1}{2\beta}\big)^2$，$\pi_{\text{ref}}$ 是 SFT 之后的 model（自己训的，或官方的 `asingh15/qwen-sft-countdown-defaultproj`）。
3. **RLOO**（`rloo_trainer/` 下的 `rloo_update_worker.py`）：在 `asingh15/countdown_tasks_3to4` 的题目上 online sample，reward 由 `evaluation/countdown.py` 里的规则 verifier 给。每个 prompt sample $k$ 个回答，gradient estimator 是

$$\frac1k\sum_{i=1}^k\Big[R(y^{(i)},x)-\frac1{k-1}\sum_{j\ne i}R(y^{(j)},x)\Big]\nabla\log\pi_\theta(y^{(i)}\mid x)$$

三个阶段做完，再做一个研究型的 extension，评分看方法、尝试过程和记录，不看最终分数（guidelines 列了合成 data、off-policy sampling、test-time reasoning、exploration、self-play、tool use、curriculum 等方向，也可以自定）。**做完会的**：从 SFT 到 preference optimization 到 verifier reward 的 policy gradient，LLM post-training 的完整一条线。**时间和算力**：每个学生 500 美元的 Modal 额度，guidelines 说大约够 100 小时以上的 GPU 时间，视 GPU 型号而定；GPU 型号和每个阶段要多久 guidelines 没写。**优先级**：注册学生的 project 选项；自学时有余力再做；已做过 CS285 HW4 的可以只做 RLOO 这一段。从 KL-regularized objective 推出 DPO loss、GRPO 的 group advantage（和 RLOO 的 leave-one-out baseline 是同一类做法）见 [MODERN-RL 的 finetune 站](../courses/MODERN-RL.html#finetune)；IPO 把 DPO 的 $-\log\sigma(\beta h)$ 换成了把 $h$ 拉向固定值 $\frac1{2\beta}$ 的平方 loss，guidelines 只给了式子，这里没有展开。

- 达标线：SFT 在 test set 上的平均 accuracy 至少 0.3，IPO 至少 0.4，RLOO 至少 0.5；评分时各放宽 0.05（0.25、0.35、0.45），分数是 $\min(\text{accuracy}/\text{threshold},1)$（guidelines）。
- Verifier 的打分：输出格式错是 0.0，格式对但算错是 0.1，格式和计算都对是 1.0（参考 TinyZero）。所以 accuracy 里混着 0.1 的部分分，看到 SFT 后平均分 0.1 上下，多半是模型学会了格式、还没学会算（打分规则来自 guidelines；“学会格式没学会算”的读法是经验）。
- RLOO 的 baseline 是“其余 $k-1$ 个回答的平均 reward”，不需要 critic。取 $k=4$，四个回答的 reward 是 $(1,0.1,0,1)$：第一个的 baseline 是 $(0.1+0+1)/3=0.367$，advantage $0.633$；第二个 $0.1-(1+0+1)/3=-0.567$；第三个 $0-(1+0.1+1)/3=-0.7$；第四个和第一个一样 $0.633$。四个 advantage 加起来是 0；它们恰好是“减去四个的平均 0.525”再乘 $\frac{k}{k-1}=\frac43$（例如 $(1-0.525)\times\frac43=0.633$）。四个回答 reward 全一样时 advantage 全是 0，这个 prompt 不贡献 gradient（自己算的）。
- Sample 用 vLLM 生成，sampler 里的 weights 是 behavior policy $\mu$，和正在训练的 $\pi_\theta$ 不完全一样，所以要乘 importance weight $w=\exp\big(\log\pi_\theta(y\mid x)-\log\mu(y\mid x)\big)$，在 log 空间算，并 clip 一个上限（guidelines）。$\log\pi$ 是整个回答所有 token 的 log-probability 之和，几百个 token 上的小差别加起来，不 clip 时一个 sample 的 weight 就能主导整个 batch（经验）。
- 每个阶段要报告的东西不同：SFT 是 train/test 的 cross-entropy、token accuracy 随 iteration 的曲线和最终 checkpoint 的 pass@k；IPO 是 train/test 的 IPO loss、reward margin、pass@k；RLOO 是 RLOO loss、训练中 importance weight 的平均、KL loss、test accuracy 随 iteration 的曲线（每题 16 个 sample）和 pass@k；每个阶段都附一条 test set 上的回答（guidelines）。从一开始就把这些都 log 下来，比事后补跑省额度（经验）。
- Sampling 的设定要固定：训练时 temperature 1.0，top-k、top-p 关掉，min-p 0.0；评估时 temperature 0.6、top-k 20、top-p 0.95、min-p 0.0，三个阶段在同一个评估设定下比（guidelines）。
- Modal 每次都重新 build image，常见原因是本地的 venv 在项目目录里，被打包进了 build context；把 venv 移到项目目录外（guidelines）。
