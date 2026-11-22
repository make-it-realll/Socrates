---
code: STANFORD-CS237B
evidence: syllabus
evidenceNote: "前沿公开课，没有 NUS 大纲。分站以 Stanford CS237B / AA274B Winter 2025（Bohg、Pavone、Sadigh）课程主页的课表为准（16 讲，第 10 周另有两次 guest lecture），这是 2026 年 11 月时主页上最新的一期。读了：课程主页、syllabus、paper review report 指南、作业页；讲义 Chapter 5（主页上 Lecture 7 的 notes，含 5.5 planar pushing）和 Chapter 10；Lecture 5、7–16 的 slides；HW1、HW2、HW3 的 handout 和作业页上的 HW4（Winter 2022 的版本）；三份作业的 GitHub starter code（clone 下来读了代码、demonstration data 和 label 文件）；Codevilla et al. 2018、Bıyık et al. 2019、Kloss et al.、Losey et al. 2020、Dragan & Srinivasa 2012 几篇论文。抓取工具给出的是按节或按页转述的内容，不是逐字原文：公式和文字读到了，slides 和讲义里的图、视频没有读到。没有读：Lecture 1–4、6 的 slides 和对应 notes；主页标为 Lecture 8–9 notes 的 cs237b_lecture_8.pdf 抓取失败（Lecture 7 的 notes 已经是 Chapter 5 全文）；录像只在 Canvas，不公开。"
exam: "自学没有考试，以作业为主。Winter 2025 注册学生的 syllabus：三份作业占 60%；三次 in-person exam（2 月 7 日、2 月 21 日、3 月 14 日，每次 1 小时）占 40%，去掉最低的一次；在 Ed 上提问、回答最多另加 5%。选 4 学分的学生另交一页 paper review report（3 月 14 日截止，从九篇指定论文里选一篇）。"
subskills:
  - id: closure
    name: Contact model、grasp map 与 form/force closure
    l3: "能写出 planar contact 的 wrench $(f_x,f_y,\\tau)$，并判断四个 frictionless finger 的一组 contact 能不能挡住 rotation。"
    l4: "能用“至少 $n+1$ 个、其中 $n$ 个 linearly independent、存在全为正的组合等于 0”检查 closure，并把它写成 HW2 的 LP；能对两个 frictional finger 算出 grasp quality $\\varepsilon$。"
    l5: "能证明那三个条件为什么足以盖住整个 wrench space，并解释“$F$ 满秩”为什么不够、friction pyramid 为什么只是 inner approximation。"
  - id: gfo
    name: Grasp force optimization：SOCP 与 precompute
    l3: "能对 parallel gripper 夹 box 的例子写出 equilibrium，并说出 normal force 为什么不唯一。"
    l4: "能把“最小化最大 contact force”写成 SOCP，并对 wrist roll 和 COM offset 两种情况手算出最优解。"
    l5: "能说明 12 个 unit wrench 的 precompute 为什么总是 feasible 却不一定 optimal，并用一个例子算出它多用了多少 force。"
  - id: lman
    name: Learning-based manipulation：physics 结构与 interactive perception
    l3: "能说出 model-based grasp 依赖的几条假设，并在 ramp 上推出 $a=g(\\sin\\theta-\\mu\\cos\\theta)$。"
    l4: "能解释 HW2 的 network 为什么把 $\\mu$ 作为中间量，并说出 $\\mu$ 学成负数的原因和约束办法；能用 ellipsoid limit surface 算出偏心推一下 box 绕哪一点转。"
    l5: "能用“rigid body 上两点 distance 不变”说明推一下为什么能把 image 里分不开的 object 分开，并说出 multimodal representation 实验里各 modality 的作用。"
  - id: coil
    name: Conditional imitation learning 与 mixture density network
    l3: "能说出把三个 goal 的 demo 放在一起用 MSE 学，policy 为什么不听指挥。"
    l4: "能写出 branched network 的 loss、Gaussian policy 的 negative log-likelihood，以及用 $AA^\\top$ 或 Cholesky 保证 covariance PSD 的写法。"
    l5: "能用数字说明 diagonal covariance 丢掉了什么、NLL 为什么没有 lower bound，以及 intent inference 为什么需要一个能直接算 density 的 policy。"
  - id: pref
    name: 从 comparison 学 reward：Bradley–Terry 与 active query
    l3: "能把一次 “A 比 B 好” 写成 weight space 里的一个 halfspace，并做一次 Bayesian update。"
    l4: "能写出 volume removal 和 information gain 两种 query 选法，并对 uniform prior 算出两者对 $\\psi=0$ 的评价。"
    l5: "能说明为什么 volume removal 会选出没有信息的 query，并把同一个 Bradley–Terry likelihood 和 RLHF 的 reward model loss 对上。"
  - id: game
    name: Interaction-aware planning：Stackelberg、implicit gradient 与 active information gathering
    l3: "能写出 robot 把 human 的 best response 代进自己 reward 的 nested optimization。"
    l4: "能用 implicit function theorem 推出 $\\partial u_H^*/\\partial u_R$，并在一个 quadratic 的 merge 例子上算出考虑 influence 前后的 optimum。"
    l5: "能对两类 driver 算出一次 nudge 的 expected information gain，并说明 model 错时 influence-aware 的 plan 会怎样吃亏。"
  - id: shared
    name: Intent inference 与 shared autonomy
    l3: "能用 Bayes rule 从每个 goal 的 MDN 算出 $P(g\\mid o,a)$。"
    l4: "能推出 HW3 的 assistance 公式是哪个 expected squared error 的 minimizer，并算出 belief 不确定时 robot 往哪边推。"
    l5: "能说明逐步连乘 likelihood 为什么过度自信、threshold 和 confidence gate 各挡住了什么，以及 latent action 与 LILI 各自把什么压成了低维。"
open:
  - label: "Stanford CS237B / AA274B Principles of Robot Autonomy II（Winter 2025）课程主页、syllabus 与 paper review report 指南"
    url: "https://web.stanford.edu/class/cs237b/"
    note: "全页的分站和顺序；考核方式。"
  - label: "Principles of Robot Autonomy 讲义 Chapter 5：Fundamentals of Grasping（CS237B Lecture 7–9 notes）"
    url: "https://web.stanford.edu/class/cs237b/pdfs/lecture/cs237b_lecture_7.pdf"
    note: "第 1、2、3 站的 contact model、grasp wrench space、closure 的判定定理、grasp quality、grasp force optimization、learning-based grasping 和 5.5 的 planar pushing。图没有读到。"
  - label: "CS237B Lecture 7、8 Fundamentals of grasping and manipulation、Lecture 9 Learning-based grasping（slides）"
    url: "https://web.stanford.edu/class/cs237b/pdfs/slide/lecture_8.pdf"
    note: "第 1 站 $\\varepsilon$ 的物理意义，第 2 站 grasp force optimization 的推导顺序和动机例子，第 3 站的 limit surface、Dex-Net 2.0、Contact-GraspNet 与 AnyGrasp。只读到文字，图没有。"
  - label: "CS237B HW2: Grasping and Manipulation（handout）"
    url: "https://web.stanford.edu/class/cs237b/pdfs/homework/cs237b_w25_hw2.pdf"
    note: "第 1 站的 LP 写法、第 2 站的 SOCP 与 precompute、第 3 站的 ramp model；作业一节。"
  - label: "CS237B Lecture 10 Learning-based manipulation、Lecture 11 Interactive perception（slides）"
    url: "https://web.stanford.edu/class/cs237b/pdfs/slide/lecture_11.pdf"
    note: "第 3 站：limit surface 与 maximum dissipation、motion-based segmentation、multimodal representation 的实验数字；第 4 站 diffusion policy 的缺点。只读到文字，图没有。"
  - label: "Principles of Robot Autonomy 讲义 Chapter 10：Imitation Learning（CS237B Lecture 12+ notes）"
    url: "https://web.stanford.edu/class/cs237b/pdfs/lecture/lecture_10111213.pdf"
    note: "第 4、5、6 站的 behavior cloning、IRL、learning from comparisons 和 physical feedback、interaction-aware control 与 intent inference。"
  - label: "CS237B Lecture 12 Imitation learning I、Lecture 13 Imitation learning II（slides）"
    url: "https://web.stanford.edu/class/cs237b/pdfs/slide/lecture_13.pdf"
    note: "第 5 站 MaxEnt IRL 的 $P(\\xi)\\propto\\exp R(\\xi)$ 与 Bradley–Terry 的关系。Lecture 13 只在最后一页标题里提到 conditional imitation learning，没有内容。"
  - label: "CS237B Lecture 14 Learning from diverse sources of data（slides）"
    url: "https://web.stanford.edu/class/cs237b/pdfs/slide/lecture_14.pdf"
    note: "第 5 站的 logistic response、volume removal 与 information gain、few-shot preference learning、LLM 作 proxy reward 的数字。"
  - label: "CS237B Lecture 15 Interaction-aware learning, planning, and control、Lecture 16 Shared autonomy（slides）"
    url: "https://web.stanford.edu/class/cs237b/pdfs/slide/lecture_15.pdf"
    note: "第 6、7 站：Stackelberg 的 nested optimization 与 implicit gradient、Boltzmann-rational driver、active information gathering、hindsight optimization、latent actions、LILI。"
  - label: "CS237B HW3: Imitation Learning and Human-Robot Interaction（handout）"
    url: "https://web.stanford.edu/class/cs237b/pdfs/homework/cs237b_w25_hw3.pdf"
    note: "第 4、7 站的 BC、MDN、CoIL、intent inference 与 shared autonomy 的公式和推导；作业一节。"
  - label: "CS237B Winter 2025 HW1–HW3 starter code（GitHub，clone 下来读了代码和 data）"
    url: "https://github.com/PrinciplesofRobotAutonomy/CS237B_Win25_HW3"
    note: "第 3 站 label 的单位、trainable 的 g 和 ramp data 的统计；第 4 站 HW3 demonstration data 里 steering 与 throttle 的关系；第 7 站 lanechange scenario 的几何和 robot action 的上限；作业一节。"
  - label: "CS237B Lecture 5 Model-based and model-free RL for robot control（slides）"
    url: "https://web.stanford.edu/class/cs237b/pdfs/slide/lecture_5.pdf"
    note: "开头对前几讲的定位：这一讲只是 policy gradient 和 tabular model-based RL 的入门。"
  - label: "CS237B HW1 handout 与作业页上的 HW4 handout"
    url: "https://web.stanford.edu/class/cs237b/assignments.html"
    note: "作业一节。作业页链接的 HW4 是 Winter 2022 的版本，不在 Winter 2025 的 syllabus 里。"
  - label: "Codevilla et al. 2018：End-to-end Driving via Conditional Imitation Learning"
    url: "https://arxiv.org/pdf/1710.02410"
    note: "第 4 站：latent state 与 command 的 formulation，branched 与 command input 两种结构的比较数字。"
  - label: "Bıyık et al. 2019：Asking Easy Questions: A User-Friendly Approach to Active Reward Learning"
    url: "https://ar5iv.labs.arxiv.org/html/1910.04365"
    note: "第 5 站：volume removal 的 global optimum 是一组相同的 trajectory（Theorem 1），information gain 的分解。读了前半篇，user study 的数字没有读到。"
  - label: "Kloss, Schaal, Bohg：Combining Learned and Analytical Models for Predicting Action Effects（arXiv 1710.04102）"
    url: "https://ar5iv.labs.arxiv.org/html/1710.04102"
    note: "第 3 站：Lynch 的 pushing model、hybrid model 里 network 估什么。这是 ICRA 2018 的版本，讲义引的是 IJRR 2020 的扩展版；读了前半篇，误差数字没有读到。"
  - label: "Losey et al. 2020：Controlling Assistive Robots with Learned Latent Actions"
    url: "https://arxiv.org/pdf/1909.09674v3"
    note: "第 7 站：latent action 的 cVAE、对比的 end-effector control、user study。"
  - label: "Dragan & Srinivasa 2012：Formalizing Assistive Teleoperation（RSS）"
    url: "https://users.cs.utah.edu/~dsbrown/readings/assist_teleop.pdf"
    note: "第 7 站：policy blending 的 arbitration、confidence、timid 与 aggressive 的 study。"
sources:
  - label: "Stanford AA274A / CS237A Autumn 2024 课程主页（只读了课程描述）"
    url: "https://stanfordasl.github.io/PoRA-I/aa274a_aut2425"
---

先看两次失败。

**第一次。** 一个边长 2 的 square，四个 frictionless 的 finger 顶在四条边的中点，每个 finger 都压得很紧。Square 不能平移，但它能绕 center 转。

::fig[cs237b-spin] 左边四个 finger 都顶在边的中点，square 照样来回转，转的时候每个 finger 都和边分开，没有一个被压进去。右边只是把 finger 沿边错开半个 side，就哪个方向都转不动了。

**第二次。** 在一个 2D 的驾驶 simulator 里，从路口前的同一个位置录了三种 demonstration：左转、直行、右转。把三种 demo 放在一起，用 MSE 训练一个 policy。训练 loss 很低，可是放上路，不管人想让它去哪，它都大致往前直走。

::fig[cs237b-avg] 虚线是三种 demo，彩色是一个 policy 学完全部 demo 之后的 rollout。

第一次的 square 缺的是几何：每个 finger 的 normal 都穿过 center，所以它们合起来给不出任何 torque。第二次的 policy 缺的是一个 input：同一个 observation 下 demo 给出了三种 action，policy 不知道人想去哪，只好输出平均。这门课的后半部分有很大一块就在处理这件事：robot 身边有人，人的目标、偏好和反应都是 robot 看不见却必须估计的量。

CS237B 是 Stanford 机器人自主性课程的第二部分（第一部分 CS237A 讲 trajectory optimization、motion planning、perception、localization 与 SLAM）。Winter 2025 一共 16 讲，第 10 周另有两次 guest lecture（其中一次是 Erdem Bıyık），没有公开材料。Syllabus 把课分成三个 module：learning-based control and perception（第 1–6 讲），interaction with the physical environment（第 7–11 讲），interaction with humans（第 12–16 讲）。前六讲是 neural network 与 PyTorch、MDP、RL 和 learning-based perception 的入门，内容在 [RB4301](../courses/RB4301.html#mdp)、[BERKELEY-CS285](../courses/BERKELEY-CS285.html) 和 [MODERN-RL](../courses/MODERN-RL.html) 里讲得更深，本页不重复。之后的讲次和本页的对应是：

| 讲次 | 内容 | 本页 |
|---|---|---|
| 7–9 | Grasping 的基础：contact、closure、grasp force optimization、planar pushing、learning-based grasping | 第 1、2、3 站 |
| 10–11 | Learning-based manipulation 与 interactive perception | 第 3 站 |
| 12–14 | Imitation learning、IRL、learning from comparisons | 第 4、5 站 |
| 15–16 | Interaction-aware planning、intent inference、shared autonomy | 第 6、7 站 |

贯穿全课的是同一种做法：把一个看不见的量写成 model 里的一个变量，然后从能观测到的东西反推它。第 1、2 站的看不见的量是 contact force，第 3 站是 friction coefficient 和 object 的边界，第 4 站是 goal，第 5 站是人的 reward，第 6 站是人会怎样反应，第 7 站是人此刻想去哪。

只有十几个小时时的快速路线是：第 1、2 站（对应 HW2 的 Problem 1–2，约 3 小时），第 4、7 站（对应 HW3，读约 3 小时），然后动手做 HW3（约 8 小时）。每站开头写明它在不在这条路线里。

## [closure] Contact model、grasp map 与 form/force closure

:::skip
快速路线必读。能对一组 contact 写出 wrench matrix $F$，用“rank 为 $n$，且 $Fk=0$ 有全为正的解”判断 closure，并对两个 frictional finger 算出 $\varepsilon$，就可以去第 2 站。
:::

### 一个 contact 能传什么

Finger 碰到 object 的那一点叫 contact。在 contact 处取一个 local frame：$z$ 轴沿 surface normal 指向 object 内部，$x$、$y$ 轴在 tangent plane 里。Finger 对 object 的 force 写成 $f=(f_x,f_y,f_z)$，其中 $f_z\ge0$：finger 只能推，不能拉。

能传什么样的 $f$，取决于 contact model。讲义给了三种：

| Contact model | 允许的 force | 维数 |
|---|---|---|
| Frictionless point contact | $f_x=f_y=0$，$f_z\ge0$ | 1 |
| Point contact with friction（hard finger） | $\sqrt{f_x^2+f_y^2}\le\mu f_z$ | 3 |
| Soft finger | 上一行，再加绕 normal 的 torque $\lvert\tau_n\rvert\le\gamma f_z$ | 4 |

第二行的集合叫 friction cone：tangential force 最多是 normal force 的 $\mu$ 倍，超过就开始滑。在 planar 的情形里，tangent plane 只剩一个方向 $t$，cone 退化成两条 edge 夹出的 wedge，edge 是 $n+\mu t$ 和 $n-\mu t$。

Force 作用在 object 上，效果要用 object 的 center of mass 处的 wrench 来描述，也就是 force 加上它产生的 torque。Planar 的 wrench 是三维的：

$$w=\begin{pmatrix}f_x\\f_y\\\tau\end{pmatrix}$$

其中 $\tau=p_xf_y-p_yf_x$，$p$ 是 contact 相对 center of mass 的位置，$\tau$ 是 $p\times f$ 的 $z$ 分量。

拿开头的 square 检验。Center 在 origin，左边那个 finger 在 $p=(-1,0)$，推的方向是 $(1,0)$，力的大小记作 $k\ge0$：

$$\tau=p_xf_y-p_yf_x=(-1)(0)-(0)(k)=0$$

另外三个 finger 同理，$p$ 和 $f$ 平行（都沿着从 center 出发的那条线），$\tau$ 全是 0。四个 finger 不论怎样用力，合起来的 torque 永远是 0，square 受到任何一点 torque 都没有东西能平衡它。这就是开头动图里 square 能转的原因。

把四个 finger 沿边错开半个 side：左 $(-1,-0.5)$，右 $(1,0.5)$，下 $(-0.5,-1)$，上 $(0.5,1)$。左边那个的 torque 是 $(-1)(0)-(-0.5)(k)=0.5k$。四个 contact 的 wrench（$k=1$）排成 matrix 的四个 column：

$$F=\begin{pmatrix}1&-1&0&0\\0&0&1&-1\\0.5&0.5&-0.5&-0.5\end{pmatrix}$$

左右两个产生正的 torque（逆时针），上下两个产生负的 torque。这一组能不能挡住一切？要回答它，先得说清“挡住一切”是什么意思。

### Grasp map 与 grasp wrench space

每个 contact 的 force 在自己的 local frame 里写，要先转到 object frame，再算 torque。这一步是一个 linear map，记作 $G_i$。所有 contact 合起来：

$$w=\sum_{i=1}^{k}G_if_i=G\begin{pmatrix}f_1\\\vdots\\f_k\end{pmatrix}$$

其中 $G=\begin{pmatrix}G_1&\cdots&G_k\end{pmatrix}$。

$G$ 叫 grasp map。HW2 里 planar 的写法是：$T^{(i)}$ 是把 local force 转到 object frame 的 rotation，torque 那一行是 $P^{(i)}_{[\times]}=\begin{pmatrix}-p_y&p_x\end{pmatrix}$ 乘上转过去的 force，于是

$$G_i=\begin{pmatrix}T^{(i)}\\P^{(i)}_{[\times]}T^{(i)}\end{pmatrix}$$

用左边那个 finger 核对：它的 local frame 里 normal 是 object frame 的 $(1,0)$，tangent 取 $(0,1)$，所以 $T^{(i)}=\begin{pmatrix}0&1\\1&0\end{pmatrix}$（第一列是 tangent，第二列是 normal），$P^{(i)}_{[\times]}=\begin{pmatrix}0.5&-1\end{pmatrix}$。Frictionless 时 local force 是 $(0,k)$。按 matrix 乘出来：force 部分 $T^{(i)}(0,k)^\top=(k,0)$，torque 部分 $\begin{pmatrix}0.5&-1\end{pmatrix}(k,0)^\top=0.5k$。和上面 $F$ 的第一列一致。

所有允许的 contact force 能产生的 wrench 的集合叫 grasp wrench space：

$$\mathcal W=\Big\{\sum_iG_if_i\;:\;f_i\in\mathcal F_i\Big\}$$

外界给 object 一个 wrench $w_{\text{ext}}$（gravity、碰撞、加速时的 inertia），grasp 要能产生 $-w_{\text{ext}}$ 才能抵消它。“挡住一切”于是有了准确的说法：

> Force closure：对任意 $w_{\text{ext}}$，都有允许的 contact force 使 $\sum_iG_if_i=-w_{\text{ext}}$，也就是 $\mathcal W$ 是整个 $\mathbb R^n$。

这里假设 contact force 可以任意大；planar 时 $n=3$，spatial 时 $n=6$。Finger 全是 frictionless 时的 force closure 又叫 form closure：只靠几何就把 object 卡死。

### 什么时候能盖住整个 wrench space

Frictionless 的 contact，每个只能往一个固定方向 $w_j$ 出力，大小 $\beta_j\ge0$，所以 $\mathcal W=\{\sum_j\beta_jw_j:\beta_j\ge0\}$，是一组 vector 的非负组合。问题变成：一组 vector 的非负组合什么时候能盖住整个空间？

::fig[cs237b-span] $n=2$ 时一眼就能看出来。两个 vector 只盖住它们夹出的 wedge；第三个 vector 如果和前两个在同一侧，wedge 变大，但另一侧还是空的；只有三个 vector 能以正系数组合出 0 时，才盖住整个平面。

讲义把它写成一个定理：$\mathcal W=\mathbb R^n$ 当且仅当

1. 至少有 $n+1$ 个 vector；
2. 其中有 $n$ 个 linearly independent；
3. 存在全都 $>0$ 的系数 $\beta_j$，使 $\sum_j\beta_jw_j=0$。

充分性可以直接证。由第 2 条，任何 $w$ 都能写成 $w=\sum_jc_jw_j$，只是有的 $c_j$ 可能是负的。由第 3 条，$\sum_j\beta_jw_j=0$，把它的任意倍加进来不改变结果：

$$w=\sum_jc_jw_j+t\sum_j\beta_jw_j=\sum_j(c_j+t\beta_j)\,w_j$$

因为每个 $\beta_j>0$，取 $t\ge\max_j(-c_j/\beta_j)$，所有系数 $c_j+t\beta_j$ 就都 $\ge0$ 了。所以任意 $w$ 都是非负组合。第 3 条的作用是提供一个“零的正组合”，用来把负的系数抬上去。

第 1 条是第 2、3 条的推论：只有 $n$ 个 linearly independent 的 vector 时，$\sum_j\beta_jw_j=0$ 只有全零解，第 3 条不可能成立，所以至少还要一个。这就是 planar 的 frictionless grasp 至少要 4 个 contact、spatial 的至少要 7 个的原因。有 friction 时一个 contact 贡献一个 cone，相当于好几个 edge vector，planar 只要 2 个、spatial 只要 3 个 frictional contact。

回到错开的 square。$F$ 的 rank 是 3（若 row 3 $=a\cdot$row 1 $+\,b\cdot$row 2，比较第 1、2 个 entry 得 $a=0.5$ 且 $-a=0.5$，矛盾；前两个 row 显然 linearly independent）。取 $\beta=(1,1,1,1)$：

$$F\begin{pmatrix}1\\1\\1\\1\end{pmatrix}=\begin{pmatrix}1-1\\1-1\\0.5+0.5-0.5-0.5\end{pmatrix}=0$$

三个条件都满足，是 form closure。顶在中点的那组 $F$ 第三行全是 0，rank 只有 2，第 2 条就不满足。

从运动的角度核对一次。Square 绕 center 以 angular velocity $\omega$ 逆时针转时，点 $p$ 的 velocity 是 $\omega(-p_y,p_x)$。左边 contact $(-1,-0.5)$ 的 velocity 是 $\omega(0.5,-1)$，$x$ 分量为正，表面离开左边的 finger；下面 contact $(-0.5,-1)$ 的 velocity 是 $\omega(1,-0.5)$，$y$ 分量为负，表面压向下面的 finger。所以逆时针被上下两个挡住，顺时针被左右两个挡住，和 torque 的符号一致。

### 写成 LP：HW2 的判定

第 3 条“存在全为正的 $\beta$”不好直接检查。HW2 把它改写成一个 LP：

$$\min_k\ \mathbf 1^\top k\qquad\text{s.t.}\quad Fk=0,\quad k_j\ge1\ \text{for all }j$$

如果有某个全为正的 $\beta$ 满足 $F\beta=0$，把它除以最小的那个分量，得到的 $k$ 每个分量都 $\ge1$，仍然满足 $Fk=0$，所以 LP feasible；反过来 LP 的 feasible 解本身就是全为正的。于是 form closure 的判定是：$F$ 满秩，并且这个 LP feasible。对错开的 square，solver 给出 $k=(1,1,1,1)$，objective 是 4。

有 friction 时，把每个 contact 换成它的 cone edge：planar 的 friction cone 恰好是两条 edge 的非负组合，$F$ 是 $3\times2j$；spatial 的 cone 是圆的，HW2 用四条 edge 的 friction pyramid 去近似，$F$ 是 $6\times4j$，frictionless 的 contact 只贡献一列。Pyramid 内接在 cone 里，所以 LP 说 “是” 时一定是 force closure；LP 说 “不是” 时，真实的 cone 仍有可能做得到。

:::wrong $F$ 满秩，就说明这组 contact 能挡住任何 wrench
满秩只是第 2 条。只留错开的 square 的左、右、下三个 finger：

$$F_3=\begin{pmatrix}1&-1&0\\0&0&1\\0.5&0.5&-0.5\end{pmatrix}$$

三个 column linearly independent，rank 是 3。但 $F_3\beta=0$ 的第二行是 $\beta_3=0$，第三个 finger 必须完全不出力，第 3 条不成立，LP infeasible。直接看也明白：三个 finger 都在左、右、下，没有一个能往下推，有人把 square 往上提，它就离开了。满秩说明 wrench space 的每个方向都“有分量”，没说明每个方向都能用非负的 force 去推。
:::

### Grasp quality：离失效有多远

Closure 只回答能不能。两个都是 force closure 的 grasp，一个稍微有点干扰就到了极限，另一个很稳，需要一个数来区分。

讲义的做法是限制总的 normal force（各 edge 的系数加起来为 1），看能产生的 wrench 的集合：

$$\tilde{\mathcal W}=\Big\{\sum_{i,j}\alpha_{ij}w_{ij}\;:\;\alpha_{ij}\ge0,\ \sum_{i,j}\alpha_{ij}=1\Big\}$$

这是所有 edge wrench $w_{ij}$ 的 convex hull。Origin 在它内部就是 force closure；以 origin 为 center、能放进 $\tilde{\mathcal W}$ 的最大 ball 的 radius 记作 $\varepsilon$。$\varepsilon$ 是在单位力气下、最坏方向上能抵抗的 wrench 的大小，ball 碰到 hull 的那个方向就是这个 grasp 最弱的方向。

算一个。还是边长 2 的 square，两个 $\mu=0.5$ 的 finger 在 $(-1,0)$ 和 $(1,0)$。左边 finger 的两条 edge 是 $(1,\pm0.5)$，torque $(-1)(\pm0.5)-0=\mp0.5$；右边是 $(-1,\pm0.5)$，torque $1\cdot(\pm0.5)=\pm0.5$。四个 edge wrench：

$$w_1=\begin{pmatrix}1\\0.5\\-0.5\end{pmatrix},\quad w_2=\begin{pmatrix}1\\-0.5\\0.5\end{pmatrix}$$

$$w_3=\begin{pmatrix}-1\\0.5\\0.5\end{pmatrix},\quad w_4=\begin{pmatrix}-1\\-0.5\\-0.5\end{pmatrix}$$

四个点的 convex hull 是一个 tetrahedron，四个点加起来是 0，origin 是它的 centroid，在内部。离 origin 最近的 face 决定 $\varepsilon$。取 $w_1,w_2,w_3$ 这个 face，normal 是

$$(w_2-w_1)\times(w_3-w_1)=\begin{pmatrix}0\\-1\\1\end{pmatrix}\times\begin{pmatrix}-2\\0\\1\end{pmatrix}=\begin{pmatrix}(-1)(1)-(1)(0)\\(1)(-2)-(0)(1)\\(0)(0)-(-1)(-2)\end{pmatrix}=\begin{pmatrix}-1\\-2\\-2\end{pmatrix}$$

face 所在 plane 是 $n\cdot x=n\cdot w_1=-1-1+1=-1$，origin 到它的 distance 是 $1/\lVert n\rVert=1/3$。四个 face 由对称性一样远，$\varepsilon=1/3$。

Lecture 7 的 slides 给了这个数的物理意义：最坏方向上，contact 的总力气要是 disturbance 的 $1/\varepsilon$ 倍。这里每条 edge 的 normal 分量都是 1，edge 系数之和就是两个 finger 的 normal force 之和。所以沿最弱的方向（上面那个 face 的 normal $(-1,-2,-2)/3$）来一个大小为 1 的 wrench，两个 finger 的 normal force 加起来要 $1/\varepsilon=3$ 才挡得住。

把两个 finger 上下错开（左边往上 $d$，右边往下 $d$），算出来的 $\varepsilon$ 是：

| 错开 $d$ | 两个 contact 连线的 slope | $\varepsilon$ |
|---|---|---|
| 0 | 0 | 0.333 |
| 0.2 | 0.2 | 0.200 |
| 0.4 | 0.4 | 0.067 |
| 0.5 | 0.5 | 0 |
| 0.6 | 0.6 | origin 在 hull 外，不是 force closure |

::fig[cs237b-eps] 三种错开的程度。连线落在两个 friction cone 里，两个 finger 才能沿连线互相挤住 object；slope 超过 $\mu$ 的那一刻 $\varepsilon$ 降到 0。

$\varepsilon$ 在 slope 等于 $\mu=0.5$ 时恰好变成 0，这是 antipodal grasp 的条件：连线要在两个 cone 里。[MIT-6.4210 的第 4 站](../courses/MIT-6.4210.html#grasp)从 point cloud 采样 antipodal grasp，用的就是这个条件；这里的 $\varepsilon$ 把“在不在 cone 里”变成了“离边界还有多远”。

Torque 和 force 的单位不同，$\varepsilon$ 的值依赖于 torque 前面乘的 scaling（讲义里的 $\lambda$）。上面取 square 的半边长 1 作为长度单位，所以 $\lambda=1$；换一个 object 尺寸比较 $\varepsilon$ 时要统一这个尺度。讲义还给了另一个 metric：$\tilde{\mathcal W}$ 的 volume，用来区分 $\varepsilon$ 相同的 grasp。

:::edge First-order 的判定会冤枉一些 grasp
HW2 handout 写明 `is_in_form_closure()` 判的是 first-order form closure：只看 contact 的位置和 normal。Object 和 finger 的表面有 curvature 时，first-order 分析认为能动的方向，实际可能因为曲面互相卡住而动不了（second-order）。讲义和 slides 都没有展开 second-order，这一句是我补的背景。
:::

:::from
Contact 的三种 model、grasp map、grasp wrench space、force closure 的定义、三个条件的定理、planar/spatial 的 contact 数、grasp wrench hull 与 $\varepsilon$、volume metric 来自 [CS237B 讲义 Chapter 5.1–5.2](https://web.stanford.edu/class/cs237b/pdfs/lecture/cs237b_lecture_7.pdf)（通过抓取工具读到按节转述的文字和公式，图没有读到）；$1/\varepsilon$ 的物理意义来自 [Lecture 7 slides](https://web.stanford.edu/class/cs237b/pdfs/slide/lecture_7.pdf)（Lecture 8 的前半是同一组 slides 的重复）。LP 的写法、$P^{(i)}_{[\times]}$、friction pyramid 的四条 edge、first-order 的说法来自 [HW2 handout](https://web.stanford.edu/class/cs237b/pdfs/homework/cs237b_w25_hw2.pdf) 的 Problem 1–2。定理充分性的证明、square 的两组 contact、:::wrong 里的三个 finger、$\varepsilon$ 的手算和表格是我自己构造的，表里的数用 scipy 的 `linprog` 和 `ConvexHull` 核对过。Second-order closure 的说法凭自己的知识，没有核对。
:::

## [gfo] Grasp force optimization：SOCP 与 precompute

:::skip
快速路线必读。能写出“最小化最大 contact force”的 SOCP，对 wrist roll 和 COM offset 手算出最优解，并说出 precompute 为什么 feasible 但不 optimal，就可以去第 3 站。
:::

### Closure 之后还剩一个问题

Closure 说明有 force 能平衡外界 wrench，但没说用哪一组。Parallel gripper 夹一个 0.5 kg、宽 10 cm 的 box，两个 finger 在 box 两侧的中线上（$x=\mp0.05$ m），$\mu=0.5$，gravity 沿 $-y$。左 finger 的 force 记作 normal $n_1$（沿 $+x$）和 tangential $t_1$（沿 $+y$），右 finger 是 $n_2$（沿 $-x$）和 $t_2$。Gravity 是 $mg=0.5\times9.81=4.905$ N。三条 equilibrium：

$$\begin{aligned}x:&\quad n_1-n_2=0\\y:&\quad t_1+t_2-4.905=0\\\tau:&\quad(-0.05)\,t_1+(0.05)\,t_2=0\end{aligned}$$

第三条给 $t_1=t_2$，代进第二条得 $t_1=t_2=2.4525$ N。第一条只说 $n_1=n_2$，没说是多少。Friction cone 要求 $2.4525\le0.5\,n$，即 $n\ge4.905$ N；在这之上，捏得多紧都满足 equilibrium。

多出来的这一维是 internal force：两个 finger 对着挤，合起来的 wrench 是 0。它在 $G$ 的 null space 里，所以 equilibrium 管不到它。$n$ 太小，任何一点额外干扰就滑；$n$ 太大，motor 吃力、object 可能被捏坏。HW2 选的 objective 是让最大的那个 contact force 尽量小：

$$\min_{f_1,\dots,f_M}\ \max_i\lVert f_i\rVert\qquad\text{s.t.}\quad f_i\in\text{friction cone},\quad\Phi f+w_{\text{ext}}=0$$

这个例子里 $\lVert f_i\rVert=\sqrt{n^2+t^2}$ 随 $n$ 增大，最优解取 $n=4.905$，$\lVert f_1\rVert=\lVert f_2\rVert=\sqrt{4.905^2+2.4525^2}=5.484$ N。

### Wrist 转动时

Robot 拿着 box 转 wrist（绕垂直于画面的 axis 转 $\varphi$）。在 gripper frame 里看，gravity 的方向转了：外界 force 是 $(F_x,F_y)=(mg\sin\varphi,\,-mg\cos\varphi)$。Equilibrium 变成

$$n_1-n_2+mg\sin\varphi=0,\qquad t_1+t_2-mg\cos\varphi=0,\qquad t_1=t_2$$

所以 $t_1=t_2=\tfrac12mg\cos\varphi$，$n_2=n_1+mg\sin\varphi$。设 $\varphi>0$，右 finger 被 box 压着，$n_2>n_1$，最大的 force 是 $\lVert f_2\rVert$，它随 $n_1$ 增大，所以 $n_1$ 取 friction cone 允许的最小值 $t/\mu$：

$$n_1=\frac{mg\cos\varphi}{2\mu},\qquad n_2=n_1+mg\sin\varphi$$

$\varphi=45°$ 时，$t=\tfrac12\times4.905\times0.7071=1.734$，$n_1=1.734/0.5=3.468$，$n_2=3.468+3.468=6.937$，$\lVert f_2\rVert=\sqrt{6.937^2+1.734^2}=7.150$ N。$\varphi=90°$ 时 $t=0$，$n_1=0$，$n_2=4.905$：box 整个躺在右 finger 上，左 finger 的最优 force 是 0。

::fig[cs237b-gfo] Gravity 一直朝下，gripper 和 box 一起转。两个 finger 的 force（彩色箭头）始终在各自的 friction cone 里；转到 ±45° 附近被压着的那个 finger 用力最大。

:::edge 最优解让一个 finger 不出力
$\varphi=90°$ 的最优解 $n_1=0$ 在数学上没错，但这时左 finger 只是碰着，任何往左的干扰都会让 box 离开它。讲义的 formulation 留了一个 $f_i\in C$ 的额外 constraint，实际做法常是加 $f_{z,i}\ge f_{\min}$，强制每个 finger 保留一点 normal force。代价是最优的 $\max\lVert f_i\rVert$ 会变大。
:::

### 写成 SOCP

上面能手算，是因为两个 contact 都在 $y=0$、torque 只来自 tangential force。一般情况没有 closed form，要交给 solver。$\max_i\lVert f_i\rVert$ 不是 linear 的，引入一个 scalar $s$：

$$\min_{f,\,s}\ s\qquad\text{s.t.}\quad\lVert f_i\rVert\le s,\quad\sqrt{f_{x,i}^2+f_{y,i}^2}\le\mu_if_{z,i},\quad\Phi f+w_{\text{ext}}=0$$

Objective 是 linear 的；$\lVert f_i\rVert\le s$ 和 friction cone 都是 “一个 vector 的 2-norm 不超过一个 linear function” 的形式，叫 second-order cone constraint；equilibrium 是 linear equality。这样的问题叫 second-order cone program（SOCP），是 convex 的，有现成的快速 solver（HW2 用 cvxpy）。HW2 的 Problem 2 (iii) 要你把它写成标准形式 $\min h^\top x$，$\lVert A_ix+b_i\rVert\le c_i^\top x+d_i$，$Fx=g$，并写出每个 matrix。

一个手算还能核对的例子：box 的 center of mass 不在两个 finger 的中线上，而是往右偏 2 cm，$\varphi=0$。Gravity 对 grasp center 的 torque 是 $p_xF_y=0.02\times(-4.905)=-0.0981$ N·m，tangential force 要补上：

$$-0.05\,t_1+0.05\,t_2=0.0981\ \Rightarrow\ t_2-t_1=1.962,\qquad t_1+t_2=4.905$$

解得 $t_1=1.4715$，$t_2=3.4335$。右 finger 要的 tangential force 大，它的 normal force 至少 $3.4335/0.5=6.867$；$x$ 方向要求 $n_1=n_2$，所以两边都是 6.867。$\lVert f_1\rVert=7.023$，$\lVert f_2\rVert=7.678$ N。COM 偏 2 cm，最大 force 从 5.484 涨到 7.678，涨了 40%。

### Precompute：用 unit wrench 拼

每个 control step 都解一次 SOCP，对高频的力控可能来不及。HW2 的 Problem 2 (v) 给了一个便宜的办法：离线对 12 个 signed unit wrench $\omega_1^\pm,\dots,\omega_6^\pm$（例如 $\omega_1^+=(1,0,0,0,0,0)$）各解一次，存下最优 force $f_i^\pm$。在线遇到 $w_{\text{ext}}$ 时，按各分量的正负部分组合：

$$f=\sum_{i=1}^{6}\Big[(w_{\text{ext},i})^+f_i^++(w_{\text{ext},i})^-f_i^-\Big],\qquad(x)^+=\max\{0,x\},\ (x)^-=\max\{0,-x\}$$

组合出来的 $f$ 一定 feasible：equilibrium 是 linear 的，各部分分别平衡各自的 unit wrench，加起来平衡 $w_{\text{ext}}$；每个 $f_i^\pm$ 都在 friction cone 里，cone 对非负组合封闭，加起来还在 cone 里。

Planar 时只有 6 个 unit wrench。对上面的 gripper，solver 给出的 $f^\pm$ 是（每组按 $(n_1,t_1,n_2,t_2)$）：

| Unit wrench | 最优 $(n_1,t_1,n_2,t_2)$ |
|---|---|
| $F_x=+1$ | $(0,0,1,0)$ |
| $F_x=-1$ | $(1,0,0,0)$ |
| $F_y=-1$ | $(1,0.5,1,0.5)$ |
| $\tau=-1$ | $(20,-10,20,10)$ |

最后一行：要靠两个相距 0.1 m 的 tangential force 产生 1 N·m 的 torque，$t_2-t_1=20$，各 10 N，normal force 要 20 N。

COM 偏右 2 cm、$\varphi=45°$ 时，$w_{\text{ext}}=(3.468,-3.468,-0.0694)$。组合：

$$\begin{aligned}n_1&=3.468\times0+3.468\times1+0.0694\times20=4.856\\t_1&=3.468\times0.5+0.0694\times(-10)=1.040\\n_2&=3.468\times1+3.468\times1+0.0694\times20=8.324\\t_2&=3.468\times0.5+0.0694\times10=2.428\end{aligned}$$

$\lVert f_2\rVert=8.671$ N。Solver 直接解同一个问题，给出 $n_1=2.081$，$n_2=5.549$，$t$ 相同，$\lVert f_2\rVert=6.057$ N。Precompute 多用了 43%。

多出来的在 normal force 上。$F_y$ 那部分为了托住 $t=1.734$ 准备了 $n=3.468$，torque 那部分为了 $\mp0.694$ 的 tangential force 又准备了 1.388。合起来左 finger 的 tangential force 是 $1.734-0.694=1.040$，两部分互相抵掉了一些，只需要 $1.040/0.5=2.081$ 的 normal force；可是 normal force 不会抵消，两部分各自准备的直接加在了一起。

:::wrong Equilibrium 是 linear 的，所以 unit wrench 的最优解组合起来也是最优的
Equilibrium 是 linear 的，objective 和 friction cone 不是。上面 $\varphi=45°$ 的例子里组合结果比最优多 43%。在 $\varphi=0$ 的 COM offset 例子里，组合结果恰好等于最优（都是 7.678），因为那时 $F_y$ 和 $\tau$ 两部分让同一个 finger 的 tangential force 同向相加，没有可以省的。Precompute 保证 feasible，不保证 optimal，好坏取决于各分量的方向是否互相抵消。
:::

Parallel-jaw gripper 实际只能控制一个 grip force，上面的 optimization 退化成“挑一个够大的 $n$”。这一站的问题在 multi-finger hand 和双臂搬运时才真正出现：contact 多、每个 finger 的 force 可以单独控制，internal force 的选择空间很大。Lecture 8 的 slides 引入这一节时用的例子正是 Lippiello 等人的多臂多指 grasp，并把 Boyd 和 Wegbreit 的 Fast Computation of Optimal Contact Forces（TRO 2007）列为阅读材料。

:::from
问题的 formulation、“$J$ 必须 convex、$J=0$ 退化为 feasibility problem”、已知 contact 位置和 $\mu$ 的假设来自 [CS237B 讲义 Chapter 5.3](https://web.stanford.edu/class/cs237b/pdfs/lecture/cs237b_lecture_7.pdf)；推导顺序（friction cone 是 second-order cone，force 与 torque 平衡写成 $G f+w_{\text{ext}}=0$，再加 hardware 的 constraint，最小化 $F_{\max}$）和动机例子来自 [Lecture 8 slides](https://web.stanford.edu/class/cs237b/pdfs/slide/lecture_8.pdf)。最小化最大 force 的 objective、引入 $s$ 的改写、SOCP 的标准形式、12 个 unit wrench 的 precompute 公式来自 [HW2 handout](https://web.stanford.edu/class/cs237b/pdfs/homework/cs237b_w25_hw2.pdf) Problem 2。Gripper、box、wrist roll 和 COM offset 的例子是我构造的，最优解手算后用 scipy 的 SLSQP 核对，precompute 的比较是我算的。“Parallel gripper 只能控制一个 grip force”凭自己的经验。
:::

## [lman] Learning-based manipulation：physics 结构与 interactive perception

:::skip
快速路线里可以跳。能说出 model-based grasp 依赖哪几条假设、HW2 Problem 3 的 network 为什么把 $\mu$ 当中间量，能用 ellipsoid limit surface 算出偏心推一下 box 绕哪一点转，以及推一下为什么能分开两个紧挨着的 object，就可以去第 4 站。
:::

### 前两站的数从哪里来

第 2 站的每一步都用了确切的数：$\mu=0.5$、box 的尺寸、COM 的位置、finger 精确执行算出来的 force。讲义列出 model-based grasping 的假设正是这几条：friction coefficient 已知，geometry 和 mass distribution 已知，object 是 rigid 的，force 能被准确执行。

其中一条错了会怎样，第 2 站已经有现成的数。按 COM 在中线上规划，$\varphi=0$ 时给每个 finger $n=4.905$ N；真实的 COM 偏右 2 cm，右 finger 需要 $t_2=3.4335$ N 的 tangential force，friction cone 最多允许 $\mu n=0.5\times4.905=2.4525$ N。差了约 1 N，box 会在右 finger 那一侧往下滑，同时转起来。

Learning-based grasping 的出发点就是不再要求这些量已知。它学的通常是一个 grasp success 的 predictor：给一张 depth image 或 point cloud 和一个候选 grasp，输出这个 grasp 成功的 probability，再从大量候选里挑最高的。区别在 label 从哪来：

| 工作 | label 的来源 | 规模（讲义和 slides 给的数） |
|---|---|---|
| Saxena et al. 2008 | 合成图像上标注的 grasp point | 能泛化到新 object |
| Dex-Net 1.0（Mahler et al. 2016） | simulation 里对 pose 和 friction 加扰动后算的成功率 | 1 万多个 object model、约 250 万个 simulated grasp |
| Levine et al. 2018 | 真机上自己试，成没成功就是 label | 多台 robot 跑了约 6 个月 |

Dex-Net 的 label 和第 1 站直接相关。讲义 5.4.2 写的是：在 simulation 里给 object 和 gripper 的 pose 以及表面的 friction 加上不确定性，对一个 grasp 反复 sample，统计其中多少次达到 force closure，这个比例就是 label。所以它学的是“在不确定的 $\mu$ 和 pose 下的 closure probability”，第 1 站的几何判定变成了 network 的训练信号。Dex-Net 1.0 用这个 predictor 给候选 grasp 打分，再用 multi-armed bandit 决定试哪一个，执行的结果用来更新 model。Lecture 9 的 slides 接着讲 Dex-Net 2.0（RSS 2017）：输入换成 point cloud $y$，network 输出 grasp quality $Q(y,u)$，test 时在候选集合 $\mathcal C$ 里取 $\arg\max_{u\in\mathcal C}Q(y,u)$；然后是 Contact-GraspNet 和 AnyGrasp，并指出这类工作的 data 以 simulation 为主，dexterous hand 的 grasping 研究要少得多。

### 把 physics 写进 network：HW2 的 ramp

第 3 题换一个角度：不放弃 model，而是让 network 去估 model 里那个看不见的参数。Physics 101 dataset 有 17,000 多段 video，HW2 只用 object 放在 ramp 上滑的那一部分，incline 是 10° 或 20°。要从每段 video 的第一帧 image 预测 object 的 acceleration。

先推 model。Object 沿斜面受两个 force：gravity 沿斜面的分量 $mg\sin\theta$ 往下，kinetic friction $\mu N=\mu mg\cos\theta$ 往上（$N$ 是 normal force，等于 gravity 垂直斜面的分量）。Newton second law 沿斜面：

$$ma=mg\sin\theta-\mu mg\cos\theta\ \Rightarrow\ a=g(\sin\theta-\mu\cos\theta)$$

$m$ 消掉了，acceleration 只由 $\theta$ 和 $\mu$ 决定。

::fig[cs237b-ramp] 同一个 $\mu=0.1$ 的 object，放在两种 incline 上，acceleration 差了 3.3 倍。

数字：$\theta=10°$，$\sin\theta=0.17365$，$\cos\theta=0.98481$，$a=9.81\times(0.17365-0.1\times0.98481)=9.81\times0.07517=0.737$ m/s²；$\theta=20°$，$a=9.81\times(0.34202-0.1\times0.93969)=2.433$ m/s²。两者之比里没有 $g$：

$$\frac{a_{20°}}{a_{10°}}=\frac{\sin20°-\mu\cos20°}{\sin10°-\mu\cos10°}=\frac{0.24805}{0.07517}=3.30$$

HW2 的 network 只负责估 $\mu$：最后几层输出一个 material 类别的 distribution $p_i$（softmax）和每类一个 $\mu_i$（一个不带 bias 的 linear layer），$\mu_{\text{pred}}=\sum_ip_i\mu_i$；然后 `AccelerationLaw` layer 按上面的公式算出 $a$，和 label 比。这一层有一个参数 $g$：starter code 里的 label 是从 video 里量出来的，单位是 pixel/frame²，和 m/s² 的换算系数未知，所以 $g$ 是一个 trainable parameter，初值 16。对比的 baseline 在 $p_i$ 那一层之前完全一样，最后用一个 fully connected layer 直接输出 acceleration，而且它的 forward 只接收 image，不接收 $\theta$。

两者的差别在于 network 要学的东西。Physics 版本里，同一个 object 不论放在哪个 incline 上，network 只要输出同一个 $\mu$；incline 对 acceleration 的作用（上面差的那 3.3 倍，和 $g$ 学成多少无关）由公式负责。Baseline 必须自己从 image 里认出 incline，再学会这 3.3 倍以及它随 $\mu$ 变化的方式。Data 一样多时，前者要拟合的东西少得多。另一个好处是 $\mu$ 本身有意义，可以拿出来用：第 2 站的 SOCP 恰好需要它。

### $\mu$ 为什么会学成负数

HW2 的 part (v) 问为什么有的 $\mu_i$ 是负数，能不能设计办法强制它为正。先看 label。Data loader 默认读 ramp surface 1 的 895 个 clip：10° 的 405 个，20° 的 490 个。从公式反解一个 clip 需要的 $\mu$：

$$\mu=\tan\theta-\frac{a}{g\cos\theta}$$

它小于 0 当且仅当 $a>g\sin\theta$。20° 里最快的一个 clip（cardboard_08）$a=5.166$。$g$ 停在初值 16 时，$g\sin20°=5.472$，需要的 $\mu=0.36397-5.166/(16\times0.93969)=0.36397-0.34360=0.020$；$g$ 训练到 12 时，$\mu=0.36397-5.166/(12\times0.93969)=0.36397-0.45813=-0.094$。$g$ 和 $\mu$ 一起训练，$g$ 变小、$\mu$ 变小可以给出同样的 $a$，没有任何东西把 $\mu$ 挡在 0 以上。

第二个原因在 mixture。Material 类别没有 label，loss 只看加权和 $\sum_ip_i\mu_i$。两个类别、$p=(0.5,0.5)$ 时，$\mu=(0.1,0.1)$ 和 $\mu=(0.3,-0.1)$ 给出同一个 $\mu_{\text{pred}}=0.1$。只要 $p$ 不集中到一个类别上，单个 $\mu_i$ 就只通过和别的类别的组合被约束，可以是负的。Part (v) 也让你看 network 对 $p_{\text{class}}$ 有多确定，可以拿来检查这一点。

Linear layer 没有任何 constraint，loss 往哪边下降它就往哪边走。要强制 $\mu_i>0$，可以让 linear layer 输出 $z_i$，再取 $\mu_i=\log(1+e^{z_i})$（softplus）或 $e^{z_i}$。

:::edge 大部分 10° 的 clip 里 object 根本没动
同一份 label 里，10° 的 405 个 clip 有 355 个是 0，20° 的 490 个有 67 个是 0（foam 和 rubber 在两个角度都不动）。公式 $a=g(\sin\theta-\mu\cos\theta)$ 只在 $\mu=\tan\theta$ 时恰好给出 0，$\mu$ 再大就给出负的 $a$，也就是 object 往坡上走。缺的是 static friction：object 静止时 friction 可以小于 $\mu N$，公式里没有这种情况。例如 w_block_03 在 10° 的 4 个 clip 都是 0，20° 的 10 个 clip 平均 1.808。把 $g$ 固定在 16，用一个 $\mu$ 最小化这 14 个 clip 的 squared error，得到 $\mu=0.223$，预测的 acceleration 在 10° 是 $-0.738$、20° 是 2.117，两边都错。把 `AccelerationLaw` 的输出改成 $\max\{0,\,g(\sin\theta-\mu\cos\theta)\}$，$\mu=(0.34202-1.808/16)/0.93969=0.244$ 就同时给出两边：20° 时恰好 1.808；10° 时 $0.244>\tan10°=0.176$，公式值为负，被截成 0。这个改法是我加的，handout 没有要求。
:::

### 推而不抓：limit surface 与 hybrid model

Object 太大、太重抓不起来，或者只需要把它挪到某处时，robot 会去推。讲义 5.5.1 讲的就是这种 planar pushing。推的时候，第 1、2 站之外多了一个 contact：object 的底面和 table。要预测推一下 object 怎么动，先要知道 table 能给出什么样的 friction wrench。

用第 2 站那个 0.5 kg 的 box，底面是边长 10 cm 的 square，压力均匀分布，和 table 之间 $\mu=0.5$。两个极端情况可以直接算：

- 纯平移：底面每一小块的 friction 都和 velocity 反向，合起来是 $f_{\max}=\mu mg=0.5\times0.5\times9.81=2.4525$ N（Lecture 8 的 slides 给的就是这个式子）。
- 绕 center 纯转动：每一小块 $dA$ 的 friction 大小是 $\mu p\,dA$（$p=mg/A$ 是压力），方向垂直于它到 center 的 $r$，对 center 的 moment 是 $\lvert r\rvert\mu p\,dA$。积分得 $m_{\max}=\mu mg\cdot\overline{\lvert r\rvert}$，$\overline{\lvert r\rvert}$ 是底面上一点到 center 的平均距离。半边长 $a$ 的 square 上 $\overline{\lvert r\rvert}=\tfrac a3\big(\sqrt2+\ln(1+\sqrt2)\big)=0.7652a$，$a=0.05$ m 时是 0.03826 m，所以 $m_{\max}=2.4525\times0.03826=0.0938$ N·m。

一般的 motion 介于两者之间。所有 table 能提供的 friction wrench $(f_x,f_y,\tau)$ 围成一个区域，它的边界叫 limit surface。讲义和 slides 给的结论是三条：推的 wrench 在 limit surface 里面时 object 不动；quasi-static 地滑动时，推的 wrench 落在 limit surface 上；这时 object 的 twist $(v_x,v_y,\omega)$ 和 limit surface 在那一点的 normal 平行（Lecture 10 的 slides 说这来自 Coulomb friction 的 maximum dissipation）。实际常把 limit surface 近似成 ellipsoid：

$$H(w)=\frac{f_x^2+f_y^2}{f_{\max}^2}+\frac{\tau^2}{m_{\max}^2}=1$$

它的 normal 是 gradient：

$$\nabla H=\Big(\frac{2f_x}{f_{\max}^2},\ \frac{2f_y}{f_{\max}^2},\ \frac{2\tau}{m_{\max}^2}\Big)$$

现在推。一个 frictionless 的 finger 顶在 box 左边那条边上、center 上方 $c$ 处，沿 $+x$ 推，大小 $F$。Contact 在 $p=(-0.05,c)$，force $(F,0)$，torque $\tau=p_xf_y-p_yf_x=-cF$，所以 wrench 是 $(F,0,-cF)$。Twist 和 $\nabla H$ 平行：

$$(v_x,\ v_y,\ \omega)\ \propto\ \Big(\frac{F}{f_{\max}^2},\ 0,\ -\frac{cF}{m_{\max}^2}\Big)\quad\Rightarrow\quad\frac{\omega}{v_x}=-c\,\frac{f_{\max}^2}{m_{\max}^2}=-\frac{c}{l^2},\qquad l=\frac{m_{\max}}{f_{\max}}=0.03826\text{ m}$$

$c=0$ 时 $\omega=0$，box 只平移，而且 wrench 要落在 limit surface 上，$F^2/f_{\max}^2=1$，推力要到 $F=f_{\max}=2.45$ N 才开始滑。$c=0.02$ m 时 $\omega/v_x=-0.02/0.001464=-13.7$ rad/m：center 每往前走 1 cm，box 顺时针转 0.137 rad，即 7.8°。Velocity 为 0 的那一点（center of rotation，COR）满足 $v_x-\omega r_y=0$、$\omega r_x=0$，在 $r=(0,\,v_x/\omega)=(0,-l^2/c)=(0,-0.0732)$，center 正下方 7.3 cm，比 box 的下边还低 2.3 cm。推力从 $H=1$ 解出：

$$F=\Big(\frac{1}{f_{\max}^2}+\frac{c^2}{m_{\max}^2}\Big)^{-1/2}=(0.16626+0.04543)^{-1/2}=2.17\text{ N}$$

比推在中线上少：friction 的一部分容量被拿去抵抗 rotation 了。

::fig[cs237b-limit] 同一个 box，finger 推在中线上和中线上方 2 cm。左边所有点的 velocity 一样；右边 box 绕 center 下方 7.3 cm 的 COR 顺时针转，离 COR 越远的点走得越快。

这个 model 用了一串假设：ellipsoid 的形状、压力均匀、Coulomb friction、$\mu$ 和 $l$ 已知、推得够慢（Kloss 等人的论文说约 50 mm/s 以下才算 quasi-static）；finger 和 box 之间有 friction 时，还要判断 contact 是 sticking 还是 sliding。讲义引 Yu 等人（IROS 2016，More than a Million Ways to Be Pushed）的大规模 pushing dataset，说这类 model 的准确度有限。

Kloss、Schaal 和 Bohg 比较了三种做法。Analytical model 就是上面这一套（Lynch 等人 1992 的版本）。Hybrid model 让 CNN 从 depth image 估出 model 需要而 image 里有的量：contact point、surface normal、是否在 contact、object 的位置；$\mu$ 和 $l$ 作为 input 给定（论文说它们无法从单张 image 得到）；analytical model 再从这些量算出 object 的 motion。纯 learned model 用同样的 perception 部分，最后用三层 fully connected layer 直接输出 motion。讲义的结论是：hybrid 利用了 physics 的结构，generalize 得更好；纯 learned 的 model 对 training data overfit。论文的引言说得更细：在 training distribution 里、data 充足时纯 learned 的最好，换成新的 action 时 hybrid 准得多，而且达到高精度需要的 data 少得多。讲义把它作为 bias–variance trade-off 的例子。这和 HW2 的 ramp 是同一个结构：network 只负责 image 里看得到的那部分，physics 负责其余。

### Interactive perception：推一下才分得开

两个颜色、材质一样的 box 紧挨着放，从 camera 看就是一整块。Segmentation network 再好也分不开，因为单张 image 里没有区分“一个大 box”和“两个小 box”的信息。

Bohg 的 Lecture 11 把这类问题叫 interactive perception：用 action 去制造 perception 需要的信息。最直接的一种是推一下。Rigid body 上任意两点的 distance 在 motion 中保持不变；两个点如果属于不同的 object，一个被推动、另一个不动，它们的 distance 就会变。

::fig[cs237b-push] Finger 推右边的 box，它平移并转了 20°。跨两个 box 的那对点 distance 从 0.71 变成 1.25，同一个 box 里的那对保持 0.88。按“distance 是否不变”给点分组，就分出两个 object。

Slides 里的 Shao et al. 用的是同一个原理的完整版本：对每个 3D 点估计它在一段时间里的 scene flow（在 SE(3) 里的 rigid motion），把 motion 一致的点 cluster 在一起，object 的个数不需要事先知道。

### 用 interaction 自己给自己打 label

Interaction 还能产生 label。Lecture 11 讲了 Lee et al.（ICRA 2019）的 peg insertion：input 是 RGB image、force/torque sensor 和 robot 的 state，先训练一个把三种 modality 融合起来的 encoder，再在它上面训练 policy。Encoder 的训练目标都来自 robot 自己的 data，不需要人工标注，例如“下一步会不会发生 contact”“action-conditional 的 optical flow”“几种 modality 在时间上是否对齐”。

Slides 给的数字：

| 项目 | 数 |
|---|---|
| Self-supervised data | 约 90 分钟收集 10 万个 data point |
| Encoder | 约 50 万个参数，训练好之后冻结 |
| Policy | 约 1.5 万个参数，deep RL 约 5 小时 |
| Simulation 里只用 force | 成功率 1% |
| 只用 image | 49% |
| Force 加 image | 77% |
| 换新的 peg geometry，沿用 representation | 92% |
| 换新的 peg geometry，沿用别的 representation 上训练的 policy | 62% |

只用 force 时 1%，因为 force 在接触之前全是 0，robot 不知道 hole 在哪；只用 image 时 49%，因为接触以后的细微对位在 image 里看不清；两者合起来才 77%。后两行说明可以迁移的是 representation，policy 本身迁移得差。冻结一个 50 万参数的 encoder、只训练 1.5 万参数的 policy，这个规模在 edge 设备上也跑得动。

:::wrong 单张 image 分不开的 object，换一个更强的 segmentation network 就能分开
两个同样外观、紧挨着的 box，在 image 里和一个同样外观的大 box 产生的 pixel 可以完全一样。Network 只能从 image 里的信息推断，信息不在 image 里，network 再强也只能猜（猜的依据是训练 data 里哪种情况更常见）。推一下之后，“distance 从 0.71 变成 1.25”这个信息才出现。
:::

:::from
Model-based grasping 的四条假设、Saxena、Dex-Net 1.0 的 label 与 multi-armed bandit、Levine 的规模来自 [CS237B 讲义 Chapter 5.4](https://web.stanford.edu/class/cs237b/pdfs/lecture/cs237b_lecture_7.pdf)；Dex-Net 2.0、Contact-GraspNet、AnyGrasp 和“simulation data 为主”来自 [Lecture 9 slides](https://web.stanford.edu/class/cs237b/pdfs/slide/lecture_9.pdf)（[Lecture 10 slides](https://web.stanford.edu/class/cs237b/pdfs/slide/lecture_10.pdf) 开头重复了这一段）。Ramp 的公式、network 结构、baseline 和 part (v) 的问题来自 [HW2 handout](https://web.stanford.edu/class/cs237b/pdfs/homework/cs237b_w25_hw2.pdf) Problem 3；label 的单位、trainable 的 $g$ 和初值、baseline 不接收 $\theta$、clip 的个数和 0 的个数来自 [starter code](https://github.com/PrinciplesofRobotAutonomy/CS237B_Win25_HW2) 的 `model.py`、`utils.py` 和 `accelerations.log`（我 clone 下来统计的）。Limit surface 的三条结论、ellipsoid 近似、Yu 等人和 Kloss 等人的比较来自讲义 5.5.1，纯平移的 $\mu mg$ 来自 [Lecture 8 slides](https://web.stanford.edu/class/cs237b/pdfs/slide/lecture_8.pdf)，maximum dissipation 来自 Lecture 10 slides；hybrid model 里 network 估什么、quasi-static 的速度范围来自 [Kloss 等人的 arXiv 版论文](https://ar5iv.labs.arxiv.org/html/1710.04102)（读了前半篇，误差数字没有读到）。Ellipsoid 的具体写法 $H(w)$ 和 twist 平行于 $\nabla H$ 的算法与论文里 Lynch model 的公式一致，$m_{\max}$ 的积分、推 box 的例子和所有数值是我算的。Interactive perception 的定义、Shao et al. 的 motion-based segmentation、Lee et al. 的实验数字来自 [Lecture 11 slides](https://web.stanford.edu/class/cs237b/pdfs/slide/lecture_11.pdf)（只读到文字）。COM 偏移导致打滑的数、负 $\mu$ 的两个原因的数值、softplus 和 $\max\{0,\cdot\}$ 的改法、推 box 分开两个 object 的例子是我自己构造和计算的。
:::

## [coil] Conditional imitation learning 与 mixture density network

:::skip
快速路线必读，是 HW3 Problem 2–3 的全部背景。能说出开头那个 policy 为什么不听指挥、写出 branched network 和 Gaussian policy 的 loss、说出 covariance 为什么要写成 $AA^\top$、NLL 为什么能一直降，就可以去第 5 站。
:::

Behavior cloning 的基本问题（covariate shift、错误按 $T^2$ 累积、DAgger）在 [RB4301 第 5 站](../courses/RB4301.html#bc)，MSE 学到 conditional mean、用 diffusion 或 flow 表示 multimodal action 在 [RB4301 第 6 站](../courses/RB4301.html#gen)；在真机上录 demonstration、训练 ACT 再 deploy 的完整流程在 [HF-LEROBOT](../courses/HF-LEROBOT.html#record)。这一站讲 CS237B 和 HW3 自己的两件事：goal 作为 input，以及输出一个能直接算 density 的 distribution。

### 同一个 observation，三种 action

回到开头的路口。为了能手算，取一组简单的数（不是 HW3 里 CARLO 的参数）：靠右行驶，车以 5 m/s 开，wheelbase 2.5 m，三种 demo 都在路口前 7.75 m 处开始转：左转沿 radius 9.5 m 的 quarter circle 进入对向的 westbound lane，右转沿 radius 6 m。Kinematic bicycle model 里沿 radius $R$ 的圆走需要的 steering angle 是 $\delta=\arctan(L/R)$：

$$\delta_{\text{left}}=\arctan\frac{2.5}{9.5}=0.257\ \text{rad},\qquad\delta_{\text{right}}=-\arctan\frac{2.5}{6}=-0.395\ \text{rad},\qquad\delta_{\text{straight}}=0$$

开始转的那一刻，三种 demo 的 observation 一模一样（同一个位置、同一个 speed），action 却是三个不同的数。MSE 下最好的单一输出是 conditional mean：

$$h^*(o)=\mathbb E[a\mid o]=\tfrac13(0.257+0-0.395)=-0.046\ \text{rad}$$

这个 steering 对应 radius $2.5/\tan0.046=54.5$ m 的轻微右转。右转 demo 走完 quarter circle 要 $\tfrac{\pi}{2}\times6/5=1.88$ s，之后 steering 回到 0，平均变成 $0.257/3=0.086$，又轻微左转；左转 demo 在 $\tfrac{\pi}{2}\times9.5/5=2.98$ s 后也结束。把这两段平均 steering 积分出来，就是开头那张图的彩色线：最终 heading 91.0°，开到图的上边缘（路口后 30 m）时比直行的 lane 偏右 0.85 m，三个 goal 一个也没去成。这里假设 network 在每个 state 都输出三者的平均，是一个简化；真实的 network 在不同 state 上的平均方式不一样，但“听不出人想去哪”这一点不变。HW3 Problem 3 (i) 让你用 `--goal all` 亲眼看这个结果。

写成公式，goal $g$ 没有进 input 时：

$$\mathbb E[a\mid o]=\sum_gP(g\mid o)\,\mathbb E[a\mid o,g]$$

policy 在不同 goal 的 action 之间按 goal 的 probability 加权平均。缺的变量补进 input，这个平均就消失了。

CoIL 的论文（Codevilla et al. 2018）就是这样提出问题的。普通 BC 的 objective $\min_\theta\sum_i\ell\big(F(o_i;\theta),a_i\big)$ 默认 expert 的 action 是 observation 的 function，$a=E(o)$；到了路口这不成立，action 还取决于 driver 的内部状态 $h$（比如目的地），$a=E(o,h)$，而 policy 看不到 $h$。论文的办法是让 expert 在录 data 时同时给一个 command $c=c(h)$（例如打转向灯），它不必包含整个 $h$，只要包含和这一步决策有关的那部分。Objective 变成 $\min_\theta\sum_i\ell\big(F(o_i,c_i;\theta),a_i\big)$。Test 时同一个 command 就是人指挥 policy 的通道。

### 把 goal 交给 network：分开训练与 branched network

HW3 Problem 2 的做法最简单：每个 goal 单独训练一个 network $h_\theta(o,g)$，只用那个 goal 的 data $\mathcal D_g$：

$$\theta_g^*=\arg\min_\theta\frac{1}{|\mathcal D_g|}\sum_{(o,a)\in\mathcal D_g}L\big(h_\theta(o),a\big)$$

代价是三个 goal 三份参数，彼此不共享“怎么看路、怎么不撞墙”这些通用的东西。

Problem 3 用 Codevilla et al. 2018 的 conditional imitation learning（CoIL）：前面的 layer 所有 goal 共享，最后分成每个 command 一个 head，command 决定用哪个 head 的 output。

::fig[cs237b-coil] 同一个起点、同一个 network，command 切换成 left、straight、right，只有对应的 head 产生 output，车走三条不同的路线。

训练时每个 sample $(o_i,a_i,g_i)$ 只经过它自己的 head：

$$\mathcal L=\frac1N\sum_{i=1}^{N}\big\lVert h^{(g_i)}\big(\phi(o_i)\big)-a_i\big\rVert^2$$

$\phi$ 是共享部分。Head $g$ 的参数只从 goal 为 $g$ 的 sample 拿到 gradient；$\phi$ 从所有 sample 拿到 gradient。所以共享部分看到的 data 是三份加起来，而每个 head 不会被别的 goal 的 action 拉向平均。

为什么不把 command 当作一个额外的 input 拼到 observation 上？HW3 handout 说 CoIL 的论文比较过这两种结构（command input 和 branched），branched 更好，所以作业要你实现 branched 的。论文给的理由只有一句：command input 的结构里，network 不被强制去用 command。Branched 结构里 command 是一个开关，决定读哪个 head，network 没有办法不用它。论文在 CARLA simulator 里的数字（成功完成的 episode 比例）：

| 结构 | Town 1（训练用的城镇） | Town 2（没见过） |
|---|---|---|
| 不给 command | 20% | 26% |
| Command input | 78% | 52% |
| Branched | 88% | 64% |

1/5 比例的真车上，branched 一次路口都没走错，command input 错过了 11.1% 的路口。

现在的 robot policy 普遍用同一个思路，只是 command 换成了 language instruction 或 goal image，作为 token 进入 transformer（[RB4301 第 8 站](../courses/RB4301.html#vla)；用 LeRobot fine-tune SmolVLA 时 instruction 怎样进 model，见 [HF-LEROBOT 第 4 站](../courses/HF-LEROBOT.html#vla)）。

### 输出一个 distribution：Gaussian policy

HW3 接着让 network 对每个 goal 输出 action 的 distribution，而不是一个 action：

$$\pi_\theta(a\mid o,g)=\mathcal N\big(a;\,\mu_\theta(o),\,\Sigma_\theta(o)\big)$$

理由要到第 7 站才完全清楚：intent inference 要算“如果人想去 $g$，他做出这个 action 的 probability 有多大”，需要一个能对任意 $a$ 算出 density 的 policy。只输出一个 action 的 network 给不出这个数。

Training 用 negative log-likelihood。2 维 action（steering、throttle）的 Gaussian density 取 $-\log$：

$$-\log\mathcal N(a;\mu,\Sigma)=\tfrac12(a-\mu)^\top\Sigma^{-1}(a-\mu)+\tfrac12\log\det\Sigma+\log(2\pi)$$

第一项惩罚 $a$ 离 $\mu$ 太远（按 $\Sigma$ 定义的尺度量），第二项惩罚 $\Sigma$ 太大。

$\Sigma$ 必须 positive semidefinite，network 直接输出的四个数不保证这一点。Starter code 的 `loss_fn` 约定 network 输出 6 个数：前两个是 mean，后四个是 covariance 的参数。HW3 的提示是：把这四个数排成一个任意的 $2\times2$ matrix $A$，取 $\Sigma=AA^\top$。对任意 $x$：

$$x^\top AA^\top x=(A^\top x)^\top(A^\top x)=\lVert A^\top x\rVert^2\ge0$$

所以 $\Sigma$ 一定 PSD。$A$ 不满秩时 $\Sigma$ 是 singular 的，$\log\det\Sigma=-\infty$，实际常加一个小的 $\epsilon I$；或者让 $A$ 是 lower triangular、diagonal 经过 $\exp$ 或 softplus 保证为正，这就是 Cholesky factor，$\Sigma$ 一定 positive definite，2 维时只要 3 个数。Starter code 的提示里列了 `D.MultivariateNormal`、`torch.diag_embed`、`torch.bmm` 和 `F.softplus`，两种写法都用得上。

### Diagonal covariance 丢掉了什么

HW3 Problem 2 (vi) 先说：如果假设 steering 和 throttle conditionally independent（diagonal $\Sigma$），network 只要学四个 scalar，但这太受限，所以要学完整的 covariance。受限在哪里？人开车转弯时会减速，两个量是相关的。HW3 自己的 `intersection_left` data（46968 个 step）里，$\lvert\text{steering}\rvert>0.2$ 的 step 平均 throttle 是 0.42，$\lvert\text{steering}\rvert<0.05$ 的是 0.85，steering 和 throttle 的 correlation 是 $-0.26$。真实 data 的噪声很大，差别不容易看清，下面构造 40 个更干净的 demo 点，当作 left goal 下的 data（和这一站开头的路口一样，steering 为正是往左打）：throttle $\approx0.6-1.2\times$ steering 再加一点抖动，算出的 correlation 是 $-0.986$。

::fig[cs237b-cov] 同一组 data 分别 fit full 和 diagonal covariance 的 Gaussian。Diagonal 的 ellipse 只能是正的，覆盖了 data 根本没出现的“左转并加速”区域。

两个 model 在这组 data 上的平均 NLL：full $-2.264$，diagonal $-0.470$。差别集中在 data 外。点 P（steering 0.2、throttle 0.36，左转并减速，符合 data 的趋势）和点 Q（steering 0.2、throttle 0.84，左转并加速）：

| | full $\Sigma$ | diagonal $\Sigma$ |
|---|---|---|
| P 的 $-\log$ density | $-2.61$ | $-0.17$ |
| Q 的 $-\log$ density | $90.5$ | $-0.17$ |

Diagonal model 认为 P 和 Q 一样可能。到了第 7 站，这意味着它无法从“这个人一边左转一边加速”里看出任何异常。

### NLL 没有 lower bound

MSE loss 最小是 0。NLL 可以一直往下走。1 维时，如果 network 把 $\mu$ 恰好放在某个 sample 上：

$$-\log\mathcal N(a;\mu=a,\sigma)=\log\sigma+\tfrac12\log2\pi$$

| $\sigma$ | 1 | 0.1 | 0.01 | 0.001 |
|---|---|---|---|---|
| NLL | 0.919 | $-1.384$ | $-3.686$ | $-5.989$ |

$\sigma\to0$ 时它趋向 $-\infty$。所以一个 overfit 的 MDN 会把 training data 记住并把 variance 缩到极小，loss 曲线看起来一直在进步。实际训练时常给 $\log\sigma$ 设一个下限，并且只看 validation 上的 NLL。

:::wrong MDN 的 loss 变成负数，说明哪里写错了
Loss 是 $-\log$ density，density 不是 probability，可以大于 1。上表里 $\sigma=0.1$ 时，sample 处的 density 是 $1/(0.1\sqrt{2\pi})=3.99$，$-\log3.99=-1.384$。上面那组 steering/throttle data 的平均 NLL 是 $-2.264$，完全正常。负数本身不说明任何问题，validation NLL 开始回升才说明 overfit。
:::

### 一个 goal 内部也有多个 mode

HW3 每个 goal 只用一个 Gaussian。如果同一个 goal 下也有两种走法（从左边绕障碍或从右边绕），一个 Gaussian 会把 mean 放在中间。Mixture density network 输出 $K$ 组参数：

$$\pi_\theta(a\mid o)=\sum_{k=1}^{K}\alpha_k(o)\,\mathcal N\big(a;\mu_k(o),\Sigma_k(o)\big),\qquad\sum_k\alpha_k=1$$

$\alpha_k$ 经过 softmax。它和 diffusion policy 解决的是同一个问题（[RB4301 第 6 站](../courses/RB4301.html#gen)），但有一个工程上的差别：MDN 一次 forward pass 就能对任意 $a$ 给出 density，diffusion policy 要算一个 action 的 likelihood 需要沿整条 denoising 过程积分，代价高得多。Lecture 10 的 slides 指出 diffusion policy 的缺点是 iterative denoising 带来的慢 inference。需要在 edge 设备上每一步都算 $P(a\mid o,g)$ 时（第 7 站），这个差别决定能不能用。

:::from
BC 的 formulation 来自 [CS237B 讲义 Chapter 10.1–10.2](https://web.stanford.edu/class/cs237b/pdfs/lecture/lecture_10111213.pdf) 和 [Lecture 12 slides](https://web.stanford.edu/class/cs237b/pdfs/slide/lecture_12.pdf)；per-goal 的 BC、`--goal all` 的实验、CoIL 的两种结构和“论文表明 branched 更好”、Gaussian 输出、$AA^\top$ 的提示、diagonal 太受限的说法、“perfect overfitting 时 loss 的最小值”的问题、“use really small networks”来自 [HW3 handout](https://web.stanford.edu/class/cs237b/pdfs/homework/cs237b_w25_hw3.pdf) Problem 2–3；network 输出 6 个数的约定和 `softplus` 等提示来自 [starter code](https://github.com/PrinciplesofRobotAutonomy/CS237B_Win25_HW3) 的 `train_ildist.py`，`intersection_left` 的统计是我从仓库的 data 算的。Latent state $h$ 与 command 的 formulation、“network 不被强制使用 command”和 CARLA、真车的数字来自 [Codevilla et al. 2018](https://arxiv.org/pdf/1710.02410)。Diffusion policy inference 慢来自 [Lecture 10 slides](https://web.stanford.edu/class/cs237b/pdfs/slide/lecture_10.pdf)。Lecture 13 的 slides 只在最后一页标题里提到 conditional imitation learning，没有内容。路口的 steering 数值和 rollout、构造的 steering/throttle data、NLL 的表格是我自己构造和计算的。Cholesky 的写法、给 $\log\sigma$ 设下限的做法凭自己的知识，没有核对。
:::

## [pref] 从 comparison 学 reward：Bradley–Terry 与 active query

:::skip
快速路线里可以跳。能把一次 comparison 写成 weight space 里的 halfspace 并做 Bayesian update，能说明 volume removal 为什么会给 $\psi=0$ 打高分，就可以去第 6 站。
:::

### Demonstration 给不出来的时候

上一站假设人能给出好的 demonstration。很多时候给不出来：用 joystick 操纵 7-DoF arm 做出流畅的动作很难；人的 demo 也常常不 optimal；有些偏好（“我喜欢开得稳一点”）在 demo 里很难看出来。IRL（[RB4301 第 5 站](../courses/RB4301.html#bc) 的 MaxEnt IRL）从 demo 反推 reward，同样受 demo 质量限制。

Lecture 13–14 换一种 feedback：给人看两条 trajectory，问哪条更好。人不需要会做，只需要会比较。

Reward 写成 feature 的 linear combination，$R(\xi)=w^\top\phi(\xi)$。人说 A 比 B 好，意味着

$$w^\top\phi(\xi_A)>w^\top\phi(\xi_B)\ \Longleftrightarrow\ w^\top\psi>0,\qquad\psi=\phi(\xi_A)-\phi(\xi_B)$$

这是 $w$ 所在空间里一个过 origin 的 halfspace。每回答一次，$w$ 的可能范围就被一个 hyperplane 切掉一半。$w$ 乘一个正数不改变任何 comparison 的答案，所以只能确定方向，通常归一化 $\lVert w\rVert=1$。只有两个 feature 时，$w$ 就在 unit circle 上，用一个 angle 表示。

### 人会答错：Bradley–Terry likelihood

人的回答有噪声，两条 trajectory 差不多时尤其如此。Lecture 14 用 logistic 的 response model：

$$P(\text{A}\mid w)=\sigma(w^\top\psi)=\frac{1}{1+e^{-w^\top\psi}}$$

这就是 Bradley–Terry model。$\lVert\psi\rVert$ 越大（两条 trajectory 差别越大），回答越确定。

它和 Lecture 13 的 MaxEnt IRL 是同一个 model。MaxEnt 在“feature expectation 和 demo 一致”的约束下取 entropy 最大的 trajectory distribution，解出来是 $P(\xi)=\exp R(\xi)/\int\exp R(\xi')\,d\xi'$，slides 指出它和 noisy-rational 的 $P(\xi)\propto\exp R(\xi)$ 一致。Demonstration 是人从所有可能的 trajectory 里挑了一条；comparison 是人只从两条里挑。把分母的积分换成这两条的和：

$$P(\text{A})=\frac{e^{R(\xi_A)}}{e^{R(\xi_A)}+e^{R(\xi_B)}}=\frac{1}{1+e^{-(R(\xi_A)-R(\xi_B))}}=\sigma(w^\top\psi)$$

第二步是分子分母同除以 $e^{R(\xi_A)}$，第三步代入 $R(\xi)=w^\top\phi(\xi)$。Bıyık 等人的论文用的就是这个 softmax，query 有 $K$ 条 trajectory 时分母对 $K$ 条求和。

于是每次回答之后做 Bayesian update：

$$p(w\mid\text{answers})\ \propto\ p(w)\prod_t\sigma\big(I_t\,w^\top\psi_t\big)$$

$I_t=+1$ 表示选了 A，$-1$ 表示选了 B，用 $\sigma(-z)=1-\sigma(z)$ 把两种回答写在一起。

算一次。真实的 $w^*$ 在 70°，prior 在 circle 上 uniform。第一个 query 的 $\psi$ 方向 0°、长度 4，人选了 A。对 70° 的 $w$，$w^\top\psi=4\cos70°=1.368$，likelihood $\sigma(1.368)=0.797$；对 200° 的 $w$，$w^\top\psi=4\cos200°=-3.759$，likelihood $\sigma(-3.759)=0.0228$。一次回答之后，70° 附近的 posterior density 是 200° 附近的 $0.797/0.0228=35$ 倍。

讲义还讲了另一种 feedback：人直接推一下 robot，把它的 trajectory $\tau_R$ 修正成 $\tau_H$，说明 $w^{*\top}\phi(\tau_H)\ge w^{*\top}\phi(\tau_R)$。更新是

$$\hat w\leftarrow\hat w+\beta\big(\phi(\tau_H)-\phi(\tau_R)\big)$$

例如 $\hat w=(0.5,0.5)$，$\phi(\tau_R)=(1.0,0.2)$，$\phi(\tau_H)=(0.8,0.6)$，$\beta=0.5$：$\hat w\leftarrow(0.5,0.5)+0.5\times(-0.2,0.4)=(0.4,0.7)$。人的修正增加了第二个 feature、减少了第一个，$\hat w$ 往同样的方向挪。

### 挑哪个 query 问

人的时间最贵，每个 query 都要尽量有用。Lecture 15 recap 的 volume removal 选择让 posterior 里“被排除的 probability mass”在最坏的回答下也尽量大：

$$\max_\psi\ \min\Big\{\mathbb E_w\big[1-f_\psi(w)\big],\ \mathbb E_w\big[1-f_{-\psi}(w)\big]\Big\}$$

$f_\psi(w)$ 是选 A 时 $w$ 被保留的比例。Lecture 14 还给了另一种：information gain，选让回答和 $w$ 之间 mutual information 最大的 $\psi$：

$$\max_\psi\ I(\text{answer};w)=H(\text{answer})-\mathbb E_w\big[H(\text{answer}\mid w)\big]$$

第一项是 robot 对回答有多不确定，第二项是人自己回答时有多不确定。好的 query 让 robot 猜不到答案，但人答起来很确定。

::fig[cs237b-pref] 用 information gain 每次从 36 个方向里选 query，人按真实的 $w^*$ 回答（这里没有加噪声）。8 次之后 posterior 集中在 70° 附近。

8 次 query 之后的比较（circle 分成 180 格，prior 的 entropy 是 $\log_2180=7.49$ bit）：

| 选法 | entropy | posterior mean | circular std |
|---|---|---|---|
| information gain | 4.77 bit | 68.2° | 13.2° |
| 随机方向 | 5.24 bit | 49.4° | 18.3° |

随机的 query 里有好几个方向和已经排除的区域重叠，回答几乎不带新信息。

:::wrong Volume removal 的 objective 越大，query 越有信息
取 $\psi=0$，也就是给人看两条一模一样的 trajectory。$f_\psi(w)=\sigma(0)=0.5$ 对所有 $w$ 成立，两个回答各“排除”一半 mass：$\min\{0.5,0.5\}=0.5$。Objective 不可能比这更大：两个回答排除的 mass 加起来是 $\mathbb E_w\big[2-\sigma(w^\top\psi)-\sigma(-w^\top\psi)\big]=1$，较小的那个至多 0.5。所以不论 prior 是什么，$\psi=0$ 都是 global optimum。可是人的回答完全是随机的，posterior 一点不变。

Bıyık 等人（CoRL 2019）对 expectation 版本的 volume removal 证明了同样的结论（他们的 Theorem 1：$K$ 条完全相同的 trajectory 是 global solution）。那个版本的 objective 是 $1-\sum_q\big(\mathbb E_w[P(q\mid w)]\big)^2$；$K$ 个回答的平均 probability 加起来是 1，平方和至少 $1/K$，objective 至多 $1-1/K$；相同的 trajectory 让每个回答都是 $1/K$，恰好取到。论文说 volume removal 在实践中还能用，只是因为 objective non-convex，optimizer 常停在别的 local optimum。

Uniform prior 下更糟：$w$ 和 $-w$ 一样可能，任何 $\psi$ 的两个回答都各排除一半 mass，objective 全是 0.5，volume removal 分不出好坏。Information gain 对 $\psi=0$ 的评价是 $H(\text{answer})-\mathbb E[H(\text{answer}\mid w)]=1-1=0$ bit，对长度 4 的 $\psi$ 是 0.571 bit。Volume removal 只看 robot 的不确定，没有扣掉人的不确定，所以分不出人答不出来的 query。Lecture 14 的 slides 说要偏好“人容易回答的 query”，指的就是这一点。
:::

### 从 linear reward 到 RLHF

Linear reward 很省 query，但表达力有限。Lecture 14 指出用 neural network 表示 reward $r_\psi(s,a)$ 时往往需要上千个 query。Hejna & Sadigh（CoRL 2022）的 few-shot preference learning 先在一批旧任务（开门、开窗、按按钮）上 pretrain reward model，在新任务（开抽屉）上只用少量 query 去 adapt。另一条路是让 LLM 当 proxy reward：把任务描述、用户说的 objective 和这一局的结果写进 prompt，LLM 的回答解析成数值 reward；slides 报告的结果比 supervised learning 平均好 46%，比用真实 reward 平均差 4%。

LLM 的 RLHF 用的 reward model loss 就是上面那个 likelihood 取 $-\log$：$\mathcal L=-\log\sigma\big(r(\xi_A)-r(\xi_B)\big)$，只是 $r$ 换成了一个大 network。[MODERN-RL 第 6 站](../courses/MODERN-RL.html#finetune)从这里接着讲 RLHF、DPO 和 GRPO。

:::from
Comparison 的 halfspace 解释、physical feedback 的更新来自 [CS237B 讲义 Chapter 10.5](https://web.stanford.edu/class/cs237b/pdfs/lecture/lecture_10111213.pdf)；MaxEnt 的解和 noisy-rational model 一致来自 [Lecture 13 slides](https://web.stanford.edu/class/cs237b/pdfs/slide/lecture_13.pdf)，把它限制到两条 trajectory 得到 Bradley–Terry 的那三步是我写的；logistic response、volume removal 与 information gain、easier queries、linear 与 neural reward 的 trade-off、Hejna & Sadigh、LLM proxy reward 的数字来自 [Lecture 14 slides](https://web.stanford.edu/class/cs237b/pdfs/slide/lecture_14.pdf)；volume removal 的 max-min 写法来自 [Lecture 15 slides](https://web.stanford.edu/class/cs237b/pdfs/slide/lecture_15.pdf) 的 recap。Theorem 1、expectation 版本的 objective、non-convex 的说法、softmax 的 $K$ 选一来自 [Bıyık et al. 2019](https://ar5iv.labs.arxiv.org/html/1910.04365)（读了前半篇，user study 的数字没有读到）。Slides 上这一讲的标题是“Learning from diverse sources of data”，主页课表写的是“Learning from human feedback”。所有数值例子、表格和动图里的 posterior 是我自己模拟计算的；max-min 版本的上界 0.5 是我推的。
:::

## [game] Interaction-aware planning：Stackelberg、implicit gradient 与 active information gathering

:::skip
快速路线里可以跳。能写出 robot 把 human 的 best response 代进自己 reward 的 nested optimization，用 implicit function theorem 算出 $\partial u_H^*/\partial u_R$，并对两类 driver 算一次 nudge 的 information gain，就可以去第 7 站。
:::

### 把人当成会动的障碍物

自动驾驶的车要从左 lane 并进右 lane，右 lane 后面有一辆人开的车。最简单的 planner 先预测人的 trajectory（例如保持当前 speed），再把它当作会动的 obstacle 来规划。问题在于这个预测不依赖 robot 自己做什么：robot 切进去一点，人其实会减速让它，但 planner 不知道这一点，于是它永远在等一个不会自己出现的空档。

Sadigh 等人（RSS 2016）把 interaction 写成一个 dynamical system：robot 直接控制自己的 $u_R$，并通过人的反应间接控制 $u_H$。Robot 选 action 时把人的反应代进去：

$$u_R^*=\arg\max_{u_R}R_R\big(x,u_R,u_H^*(x,u_R)\big),\qquad u_H^*(x,u_R)=\arg\max_{u_H}R_H(x,u_R,u_H)$$

人被 model 成在给定 robot action 时最大化自己的 reward。这是一个 Stackelberg game：robot 先动（leader），人看到之后回应（follower）。

### Human 的 model 从哪来

$R_H$ 用 IRL 从人类驾驶的 data 里学：$R_H=w^\top\phi(x,u_R,u_H)$，slides 给的 feature 是离路边界的距离、是否在 lane 里、离其他车的距离。对应的 stochastic model 是 Boltzmann rational：

$$P(u_H\mid x,u_R)=\frac{\exp R_H(x,u_R,u_H)}{\int\exp R_H(x,u_R,\tilde u_H)\,d\tilde u_H}$$

reward 高的 action 更可能，但不是一定。Planning 时为了好算，slides 用了三个近似：receding horizon（只规划很短的 horizon，每一步重新规划），把人当 deterministic 的（取 argmax），以及人在这个短 horizon 里能看到 robot 的整段 $u_R$。

### Implicit gradient：人的 best response 对 robot action 的导数

要对 $u_R$ 做 gradient ascent，需要 $dR_R/du_R$。链式法则：

$$\frac{dR_R}{du_R}=\frac{\partial R_R}{\partial u_R}+\frac{\partial R_R}{\partial u_H}\frac{\partial u_H^*}{\partial u_R}$$

难的是 $\partial u_H^*/\partial u_R$：$u_H^*$ 是一个 optimization 的解，没有 explicit formula。但它满足 first-order condition。记 $g(u_R,u_H)=\partial R_H/\partial u_H$，则对所有 $u_R$：

$$g\big(u_R,u_H^*(u_R)\big)=0$$

两边对 $u_R$ 求导（左边是复合函数）：

$$\frac{\partial g}{\partial u_R}+\frac{\partial g}{\partial u_H}\frac{\partial u_H^*}{\partial u_R}=0\ \Rightarrow\ \frac{\partial u_H^*}{\partial u_R}=-\Big(\frac{\partial g}{\partial u_H}\Big)^{-1}\frac{\partial g}{\partial u_R}=-\Big(\frac{\partial^2R_H}{\partial u_H^2}\Big)^{-1}\frac{\partial^2R_H}{\partial u_H\,\partial u_R}$$

这是 implicit function theorem。$u$ 是 vector 时，$\partial^2R_H/\partial u_H^2$ 是 Hessian，求逆变成解一个 linear system。讲义里链式法则那一步写的是加号、代入之后写成减号，减号来自这里的 $-(\cdot)^{-1}$，两者是一致的。

### 一个能手算的 merge

把 merge 压成每人一个 scalar。$u_R\in[0,1]$ 是 robot 往右 lane 切进去多少，$u_H$ 是人的 acceleration（负数是减速）。

人的 reward：$R_H=-u_H^2-2u_Ru_H$。第一项是不想改变 speed；第二项说 robot 切进来时，人加速要付出代价（越切越近、越加速越危险）。Robot 的 reward：$R_R=2u_R-2u_R^2-1.2\,u_R(1+u_H)$。前两项是并道的进展和动作的代价，最后一项是 collision risk，正比于切进去的程度乘以人此后的 speed（1 是名义 speed）。

::fig[cs237b-stack] 左边是设定，右边是 robot 的 reward 关于 $u_R$ 的两条 curve：虚线假设人不变速，彩色线代入人的 best response。

人的 best response：$\partial R_H/\partial u_H=-2u_H-2u_R=0$，$u_H^*=-u_R$。用 implicit 的公式核对：$\partial^2R_H/\partial u_H^2=-2$，$\partial^2R_H/\partial u_H\partial u_R=-2$，所以 $\partial u_H^*/\partial u_R=-(-2)^{-1}(-2)=-1$，和 $u_H^*=-u_R$ 一致。

**以为人不动。** 代 $u_H=0$：$R_R=2u_R-2u_R^2-1.2u_R$，令 derivative $2-4u_R-1.2=0$，$u_R=0.2$。

**在 $u_R=0.2$ 处用完整的 gradient。** $u_H^*=-0.2$：

$$\frac{\partial R_R}{\partial u_R}=2-4(0.2)-1.2(1-0.2)=0.24,\qquad\frac{\partial R_R}{\partial u_H}\frac{\partial u_H^*}{\partial u_R}=(-1.2\times0.2)(-1)=0.24$$

总和 0.48 > 0，应该切得更多。第二项就是“切进去会让人减速、从而降低 risk”带来的收益，naive planner 看不到它。

**代入 best response。** $R_R(u_R,-u_R)=2u_R-2u_R^2-1.2u_R(1-u_R)=0.8u_R-0.8u_R^2$，最大值在 $u_R=0.5$。

两个 plan 实际得到的 reward（人都按 $u_H^*=-u_R$ 回应）：

$$R_R(0.2,-0.2)=0.4-0.08-1.2\times0.2\times0.8=0.128,\qquad R_R(0.5,-0.5)=1-0.5-1.2\times0.5\times0.5=0.200$$

考虑 influence 的 plan 好 56%。

:::edge Human model 错了，influence-aware 的 plan 更糟
假如这个人其实没在看路，$u_H=0$。$u_R=0.5$ 实际得到 $1-0.5-1.2\times0.5=-0.1$；naive 的 $u_R=0.2$ 得到 $0.4-0.08-0.24=0.08$。Robot 越依赖“人会让我”，人不让时吃亏越大。下一小节就是为这个问题准备的：先弄清是哪种人，再决定要多大胆。
:::

### 先弄清是哪种人：active information gathering

人不只一种。设有两类：attentive 的人看到 robot 往自己 lane 挪 $n$ 米，就以 $u_H\approx-0.8n$ 减速；distracted 的人没反应，$u_H\approx0$。两者都带 std 0.15 的 Gaussian 噪声。Robot 对类型 $\theta$ 有 belief $b(\theta)$，观察到人的 $u_H$ 后按 Bayes 更新：

$$b_{t+1}(\theta)\ \propto\ b_t(\theta)\,p(u_H\mid x_t,u_R,\theta)$$

关键在于 likelihood 依赖 $u_R$。Robot 不动（$n=0$）时两类人的 $u_H$ 的 distribution 一模一样，观察多久都分不出来。Robot nudge 一下，两类人的反应才分开。从 prior 0.5 出发、观察到 attentive 的典型反应 $u_H=-0.8n$ 时：

| nudge $n$（m） | 0 | 0.1 | 0.2 | 0.3 | 0.5 |
|---|---|---|---|---|---|
| $b(\text{attentive})$ | 0.500 | 0.535 | 0.639 | 0.782 | 0.972 |
| expected information gain（bit） | 0 | 0.050 | 0.180 | 0.353 | 0.682 |

后一行对两类人的反应分布取 expectation：$\mathbb E[H(b_t)-H(b_{t+1})]$。Nudge 越大信息越多，但 nudge 本身有代价（离人更近、偏离自己的 lane）。Slides 把两者写进 robot 的 reward：

$$R_R=H(b_t)-H(b_{t+1})+\lambda R_{\text{goal}}$$

如果代价是 $4n^2$，一步的 objective $\mathbb E[\text{IG}]-4n^2$ 在 $n\approx0.2$ 处最大（0.180 − 0.16 = 0.020）；$n=0.3$ 时已经是 $0.353-0.36<0$。

::fig[cs237b-nudge] 每步 nudge 0.2 m，连续 6 步。Attentive 的人每次都减速，belief 升到 0.968；distracted 的人没反应，belief 降到 0.032。之后 robot 分别并到前面和后面。

每一步的 log-odds 增量是 $(0.8\times0.2)^2/(2\times0.15^2)=0.569$，6 步加起来 3.41，$b=1/(1+e^{-3.41})=0.968$。这正是 slides 里 nudge 的例子：robot 往 lane line 靠一点，看人是 attentive 还是 distracted。

:::wrong 先被动观察几秒，看清了人是哪种再行动，最安全
被动观察时 $n=0$，上表第一列：两类人的 $u_H$ 的 distribution 相同，likelihood ratio 恒为 1，belief 永远停在 0.5。观察多久都不会更清楚，robot 只能按最坏情况保守地等，又回到了开头那个等不到空档的 planner。要获得信息，robot 必须做一个会让两类人反应不同的 action。
:::

现在工业界的做法把这里的两个部件换成了 learning：human model 用在大量驾驶 data 上训练的 multi-agent motion prediction network，并且让 prediction 以 ego vehicle 的候选 plan 为条件（conditional prediction），这就是 $u_H^*(x,u_R)$ 的 data-driven 版本；planner 在多个候选 plan 上评估这些条件 prediction。这一段凭我自己的知识，没有在本课材料里核对。

:::from
Robot 影响人这一视角、nested optimization、receding horizon 和 deterministic human 的近似、quasi-Newton 方法求 optimum、implicit differentiation、Boltzmann-rational driver 与 IRL 学的 feature、driver type 的 belief update、information gain 加 $\lambda R_{\text{goal}}$ 的 reward、nudge 判断 attentive/distracted 的例子来自 [Lecture 15 slides](https://web.stanford.edu/class/cs237b/pdfs/slide/lecture_15.pdf) 和 [CS237B 讲义 Chapter 10.6](https://web.stanford.edu/class/cs237b/pdfs/lecture/lecture_10111213.pdf)（slides 里 nudge 例子的曲线是图，没有读到；[Lecture 16 slides](https://web.stanford.edu/class/cs237b/pdfs/slide/lecture_16.pdf) 开头重复了 nested optimization、belief update 和这个 reward）。Merge 的 quadratic reward、所有数值、两类 driver 的 Gaussian model 和 information gain 的表是我自己构造、用 scipy 数值积分算的。最后一段工业界做法凭自己的知识。
:::

## [shared] Intent inference 与 shared autonomy

:::skip
快速路线必读，是 HW3 Problem 4 的全部背景。能从 MDN 算出 $P(g\mid o,a)$，推出 HW3 的 assistance 公式，并用数字说明 belief 不确定时 robot 会往哪边推、threshold 和 confidence gate 各起什么作用，就读完了。
:::

[EE4706 第 6 站](../courses/EE4706.html#hri) 讲了 Javdani 等人把 shared autonomy 写成 POMDP、用 hindsight optimization（QMDP）近似求解，以及它和 predict-then-blend 的对比，本站不重复。这一站跟着 HW3 走另一条路：goal 的 posterior 从第 4 站训练好的 MDN 里来，assistance 是一个 closed-form 的公式。

### 从 MDN 读出 intent

第 4 站对每个 goal 训练了 $P(a\mid o,g)$。人做出 action $a$ 之后，用 Bayes rule：

$$P(g\mid o,a)=\frac{P(a\mid o,g)\,P(g)}{\sum_{g'}P(a\mid o,g')\,P(g')}=\frac{P(a\mid o,g)}{\sum_{g'}P(a\mid o,g')}$$

最后一步用了 uniform prior。这就是 HW3 Problem 4 (i) 的公式，也是第 4 站要求 policy 能算 density 的原因。

HW3 的 lanechange scenario 是一条两车道的路：每条 lane 宽 4.4 m，中间的 lane marker 宽 0.5 m，所以两条 lane 的中心相距 4.9 m。车从随机的横向位置出发，speed 在 0 到 10 m/s 之间随机，observation 是 $(x,\text{speed},\text{heading})$ 三个数；goal 是开到路尽头 left lane 或 right lane 的中心。Throttle 由程序给，人只用方向键控制 steering（限制在 $\pm0.15$）。Starter code 里的 optimal action $m(g,o)$ 是朝前方 3 秒处、目标 lane 中心上的一点打 $\pm0.15$ 的 steering。

为了能手算，把 action 简化成 lateral velocity（m/s）：车以 10 m/s 前进，压着中间的 lane marker（$y=0$）出发，left lane 的中心在 $y=2.45$，right lane 在 $y=-2.45$，去 goal 的 optimal action 是 $m(g,y)=\mathrm{clip}(y_g-y,\pm1.5)$。假设人想去 left，但只给出 optimal action 的 0.4 倍（人遥控时常常打得不够），而且前 1 秒还在犹豫，只有一点抖动。MDN 学到的是 $P(a\mid o,g)=\mathcal N(0.4\,m(g,y),\,0.3^2)$。

在 $y=0$，两个 goal 的 mean 是 $\pm0.6$，likelihood ratio 是

$$\frac{P(a\mid\text{left})}{P(a\mid\text{right})}=\exp\Big(\frac{(a+0.6)^2-(a-0.6)^2}{2\times0.3^2}\Big)=\exp\Big(\frac{2.4a}{0.18}\Big)=e^{13.33a}$$

第一个 step 人的抖动是 $a=-0.042$：ratio $e^{-0.56}=0.571$，$P(\text{left})=0.571/1.571=0.363$。人还没决定，robot 已经有六成多的把握认为他要去右边。

### 一步一步地合起来

单步的 posterior 太不稳。把每一步的 likelihood 连乘（等价于把 log-odds 加起来）看起来是正确的 Bayes，但前 1 秒抖动连续偏负，6 步之后连乘给出 $P(\text{left})=0.0001$。HW3 建议对 $P_g$ 做平滑，例如对最近 5 步取 moving average，同样 6 步之后是 0.19。

| 时间（s） | 0 | 0.1 | 0.2 | 0.3 | 0.5 | 1.0 | 1.1 |
|---|---|---|---|---|---|---|---|
| 人的 $a$ | $-0.042$ | $-0.071$ | $-0.094$ | $-0.110$ | $-0.119$ | 0.590 | 0.622 |
| 单步 $P(\text{left})$ | 0.363 | 0.281 | 0.222 | 0.187 | 0.170 | 1.000 | 1.000 |
| 连乘 | 0.363 | 0.182 | 0.060 | 0.014 | 0.0006 | 0.023 | 0.990 |
| 5 步 moving average | 0.363 | 0.322 | 0.289 | 0.263 | 0.206 | 0.411 | 0.574 |

:::wrong 每一步的 likelihood 连乘起来，就是最准确的 intent 估计
连乘成立的前提是：给定 goal，各步的 action 互相独立。人的抖动是连续的，前一步偏负，下一步多半也偏负，6 步的“证据”其实只是同一个犹豫被数了 6 遍。上表里连乘在 0.5 s 已经给出 99.94% 的把握认为人要去右边，这是假的确定。Moving average 不是严格的 Bayes，但它承认相邻的 action 高度相关，所以不会被同一件事反复说服。
:::

### HW3 的 assistance 公式从哪来

HW3 让人和 robot 同时出 action，相加之后作用到车上：$s'\sim f(\cdot\mid s,a_H+a_R)$。Robot 在出 action 时不知道这一步的 $a_H$，只知道到上一步为止的 observation 和 action。Handout 的推理是：robot 的 action 加上人预计会给的 action，应该等于 optimal action 的期望。

$$a_R+\mathbb E_g\big[a_H\mid g,o_t\big]=\mathbb E_g\big[m(g,o_t)\mid o_t\big]=\sum_gP_g\,m(g,o_t)$$

其中 $P_g=P\big(g\mid o^{t-1},\dots,o^0,a^{t-1},\dots,a^0\big)$ 只用到上一步为止的 data。

左边的期望同样按 $P_g$ 展开，$\mathbb E_g[a_H\mid g,o_t]=\sum_gP_g\sum_{a_H}P(a_H\mid o_t,g)\,a_H$，其中 $P(a_H\mid o_t,g)$ 也由同一个 MDN 给出。移项，两个对 $g$ 的和合并成一个：

$$a_R=\sum_gP_g\Big[m(g,o_t)-\sum_{a_H}P(a_H\mid o_t,g)\,a_H\Big]$$

$P_g$ 怎么从过去每一步的 $P(g\mid o^k,a^k)$ 算，handout 留给你选，举的例子就是上一小节的 moving average。

“期望相等”还可以换一个角度看：它是一个 expected squared error 的 minimizer（这个角度是我加的）。如果 goal 已知是 $g$、$a_H$ 也已知，robot 应该补上差额，让 $a_H+a_R=m(g,o)$。两者都不知道时，最小化 expected squared error：

$$\min_{a_R}\ \sum_gP_g\,\mathbb E_{a_H\sim P(\cdot\mid o,g)}\big[(a_H+a_R-m(g,o))^2\big]$$

对 $a_R$ 求导令其为 0：

$$\sum_gP_g\big(\mathbb E[a_H\mid o,g]+a_R-m(g,o)\big)=0\ \Rightarrow\ a_R=\sum_gP_g\big(m(g,o)-\mathbb E[a_H\mid o,g]\big)$$

正是 HW3 的公式：对每个 goal，robot 补上“optimal action 减去人在这个 goal 下预计会给的 action”，再按 goal 的 probability 加权。

$t=0$ 时 robot 手上只有 uniform prior，$P_{\text{left}}=0.5$，两边的修正正好抵消，$a_R=0$。到 $t=0.1$，它用的是上表 $t=0$ 那一列的 $P_{\text{left}}=0.363$；$m(\text{left})=1.5$，$\mathbb E[a_H\mid\text{left}]=0.6$，right 那边是 $-1.5$ 和 $-0.6$：

$$a_R=0.363\times(1.5-0.6)+0.637\times(-1.5+0.6)=0.327-0.573=-0.246$$

Robot 把车往右推。人还没开始操作，robot 先按自己对抖动的解读替人做了决定。

::fig[cs237b-shared] HW3 的公式加上 $\lvert a_R\rvert\le0.5$ 的 clip，$P(\text{left})$ 是 robot 出 action 时用的那个值。犹豫的那一秒里 robot 把车推过了 lane marker，到 $y=-0.47$；人开始往左之后 $P(\text{left})$ 很快到 1，robot 补上人没打够的那部分，6 秒后到 2.29 m（left lane 中心是 2.45 m），只有人时是 2.04 m。

这个公式还有一个不那么明显的性质：goal 离得远近不同时，即使 $P_{\text{left}}>0.5$，robot 也可能往 right 推。车到了 $y=1.45$（离 left lane 中心还有 1 m）时，$m(\text{left})=1.0$，$m(\text{right})=\mathrm{clip}(-3.9,\pm1.5)=-1.5$，人在两个 goal 下预计给的是 0.4 和 $-0.6$：

$$P_{\text{left}}=0.6:\ a_R=0.6\times0.6+0.4\times(-0.9)=0;\qquad P_{\text{left}}=0.5:\ a_R=0.5\times0.6+0.5\times(-0.9)=-0.15$$

远的那个 goal 需要的修正更大，在加权平均里占了便宜。

### Threshold 与 confidence gate

HW3 Problem 4 (v) 说不希望 $a_R$ 给出的 steering 和 throttle 太大，问从 human-robot interaction 的角度为什么要加这个 constraint。Starter code 里把它写死了：$a_R$ 的 steering 限制在 $\pm0.05$，throttle 限制为 0，提示用 `np.clip`。人用方向键的 steering 上限是 $\pm0.15$，所以 robot 最多只有人的三分之一。上图的 $\lvert a_R\rvert\le0.5$（人是 1.5）照的就是这个比例。

从上面的数字看，robot 出错有两种：读错了 intent（犹豫时往右推），以及 intent 不确定时加权平均出一个谁也不想要的 action。Magnitude 的 clip 让 robot 怎么错，每秒最多把车多推 0.5 m：它限制了错的程度，但没有阻止错，上图里车还是被推进了 right lane。另一种做法是 confidence gate：$\max_gP_g$ 低于某个值时 $a_R=0$，让人完全掌控；超过之后才按公式帮忙。同一个模拟里取 gate 0.9：犹豫的那一秒 robot 不出手，车的最小 $y$ 是 $-0.087$（和只有人时一样，来自人自己的抖动）；人开始往左后 robot 接手，到 $y=2$ m（离 left lane 中心 0.45 m）用了 3.6 s，不加 gate 是 3.8 s，只有人时是 5.9 s。

两种做法都是 Dragan 和 Srinivasa（RSS 2012）所说的 arbitration 的特例。他们把 assistance 写成 policy blending：$(1-\alpha)U+\alpha P$，$U$ 是人的 input，$P$ 是 robot 按自己对 intent 的 prediction 给出的 action，$\alpha\in[0,1]$ 应当由 prediction 的 confidence 调节，从 timid（$\alpha$ 小）到 aggressive。他们 8 个人的 study 里，prediction 对时 aggressive 在难的任务上更快，prediction 错时 timid 明显更好；按他们的数字，只有 prediction 错的 probability 低于约 16% 时，aggressive 总体上才更省时间。HW3 是把 $a_R$ 加到 $a_H$ 上，不是 blending，但 clip 相当于给 robot 的份额设一个上限，gate 相当于 confidence 不够时让 $\alpha=0$。

User study 里人对 assistance 的感受和效率不总是一致：[EE4706 第 6 站](../courses/EE4706.html#hri)引的 Javdani 等人的 study 里，hindsight optimization 让任务更快，但问人更喜欢哪个，回答偏向帮得少、更好懂的方法。HW3 Problem 4 (vii) 让你自己开一次，回答 robot 的帮助是真的有用还是让你开得更差，以及为什么。

:::edge Assistance 会改变人的 action，MDN 却是在没有 assistance 时训练的
MDN 学的是人独自开车时的 $P(a_H\mid o,g)$。有了 robot 的帮助，人看到车自己往左走，会少打一点方向，$a_H$ 的 distribution 变了，intent inference 就是在用一个过时的 model。HW3 的设定没有处理这一点；它也是下面 LILI 要处理的问题的一个特例。
:::

### Latent actions：把高维 action 压到 joystick 的两维

Lecture 16 的另一半问的是 input 本身。Losey 等人（ICRA 2020）的出发点：assistive arm 的自由度比手上的 joystick 多，用户要同时协调好几个互相牵连的自由度，比如倒水时既要让杯子保持水平又要控制倾倒。Assistive arm 现在常用的 end-effector control（他们 user study 里的 baseline）用两个 2-DoF joystick 分别控制 end-effector 的位置和姿态，再用一个按钮在 linear velocity 和 angular velocity 两种 mode 之间切换。

Latent actions 用 conditional VAE 从 demonstration 学一个 decoder $\hat a=\phi(z,s)$：$z$ 是低维的 latent action（user study 里是 2 维，正好是一个 2-DoF joystick），$s$ 是 robot 当前的 state，$\hat a$ 是 robot 的高维 action。Training 时 encoder $\psi(s,a)$ 把 demo 里的 $(s,a)$ 压成 $z$，loss 是重建误差 $\lVert a-\hat a\rVert^2$ 加一项 $\mathrm{KL}\big(\mathcal N(\mu,\sigma)\,\Vert\,\mathcal N(0,1)\big)$。Decoder condition on $s$，是因为同一个 joystick 输入在不同 state 下意思不同：论文的例子是手里拿着杯子时往下推表示倒水，gripper 空着时就不该有倒水这个动作。用的时候把 latent 的两维和 joystick 的两个方向对齐，用户每一步给出 $z_t$，robot 执行 $\phi(z_t,s_t)$。

烹饪任务的 training data 是不到 7 分钟的 kinesthetic demonstration（slides 列的是在架子之间移动、倒、搅拌、伸手）。11 个人的 within-subjects study 里，只用一个 2-DoF joystick 的 latent actions 比用两个 joystick 的 end-effector control 完成得更快（$t(10)=-6.9$，$p<.001$）、joystick 动得更少，主观上更省力、更容易、更自然；但问更喜欢哪一种时，两者没有显著差别。

### LILI：人自己也在变

前面都假设人的 goal 在一次任务里是固定的。真实的 partner 会根据 robot 的行为调整自己的策略。Xie、Losey 等人的 LILI（CoRL 2020）把 partner 在第 $k$ 次 interaction 里的策略压成一个低维的 latent $z_k$：encoder 从上一次 interaction 的 trajectory $\tau_{k-1}$ 推出 $z_k$，decoder 用 $z_k$ 预测这一次的 transition 和 reward；robot 的 policy 以 $z_k$ 为条件，并在多次 interaction 的总 return 上训练，于是它会学着把 partner 引向对自己有利的策略。Slides 报告的 air hockey 实验里，和人类高手对打时 SAC 成功 45%，LILI 成功 73%。

:::from
Bayes rule 的写法、$a_H+a_R$ 的设定、“期望相等”的推理和 assistance 公式、对 $P_g$ 做 moving average 的建议、(v) 和 (vii) 的问题来自 [HW3 handout](https://web.stanford.edu/class/cs237b/pdfs/homework/cs237b_w25_hw3.pdf) Problem 4；lanechange scenario 的几何、observation、steering 的上限、optimal action 的写法、robot 的 $\pm0.05$ 和 throttle 为 0 来自 [starter code](https://github.com/PrinciplesofRobotAutonomy/CS237B_Win25_HW3) 的 `lanechange_scenario.py`、`utils.py` 和 `shared_autonomy.py`。POMDP 与 hindsight optimization 的框架、latent actions 的 cVAE、7 分钟 demo 和四种任务、LILI 的 objective 和 45%/73% 来自 [Lecture 16 slides](https://web.stanford.edu/class/cs237b/pdfs/slide/lecture_16.pdf)（user study 的图没有读到）；end-effector control 的 mode switching、decoder 的 input 和 output、loss、倒水的例子、user study 的设计和统计量来自 [Losey et al. 2020](https://arxiv.org/pdf/1909.09674v3)；policy blending、confidence 与 timid/aggressive 的 study 来自 [Dragan & Srinivasa 2012](https://users.cs.utah.edu/~dsbrown/readings/assist_teleop.pdf)。Lateral velocity 的简化模型、所有数值和表格、assistance 公式作为 expected squared error minimizer 的角度、远近 goal 的不对称、confidence gate 和它的比较是我自己构造和模拟的。
:::

## 作业

Winter 2025 的 syllabus 只有三份作业（HW1–HW3，合计 60%）。三份的 handout 和 GitHub starter code（organization 是 `PrinciplesofRobotAutonomy`，仓库名 `CS237B_Win25_HW1` 到 `HW3`）都公开。作业页上还挂着一份 HW4，那是 Winter 2022 的 PDF（截止日期写的是 2022 年 3 月 11 日），不在这一期的 syllabus 里，放在最后供参考。注册学生把排版好的 PDF（LaTeX 或 Word）和代码的 zip 交到 Gradescope；迟交每天扣 20%，全学期共 5 个 late day。自学没有 autograder，handout 里给的 success benchmark 就是 test。三份作业共用一个 conda 环境 `cs237b`（HW1 handout 要求 Python 3.9），每份作业目录里 `pip install -r requirements.txt`。下面每条提示后面注明来源：handout 指对应作业的 PDF，仓库指 starter code 本身，“经验”是没有官方出处的工程经验。

| 作业 | 内容 | 本地 CPU | 免费 Colab | 优先级 |
|---|---|---|---|---|
| HW1 | Value iteration、Q-network、Inception-v3 transfer、sliding-window detection | 够 | 够，handout 说要 GPU 可以用 Colab | 有余力再做 |
| HW2 | Form/force closure 的 LP、grasp force SOCP、ramp 上的 intuitive physics | 够 | 够 | 值得做 |
| HW3 | BC、MDN、CoIL、intent inference、shared autonomy | 够，每个 network 几分钟到十几分钟 | 不适合：要用方向键实时操作 | 先做 |
| HW4（Winter 2022） | System architecture 的论文阅读、LTL 与 model checking | 不需要 | 不需要 | 有余力再做 |

### HW3：Imitation learning 与 human-robot interaction

**要实现的**：在 CARLO（handout 说是 CARLA - Low Budget 的缩写，一个很简单的 2D 驾驶 simulator，车用 kinematic bicycle model）里，`train_il.py` 对每个 goal 训练 deterministic BC；`train_ildist.py` 训练输出 Gaussian 的 network；`train_coil.py` 实现 branched 的 CoIL；`intent_inference.py` 用 MDN 做 goal 的 posterior，自己开 15 个 episode（三个方向各 5 次），数 intent 猜对了几次；`shared_autonomy.py` 实现上面的 assistance 公式。Problem 1 是 initialization 和 Adam 的书面题。Demonstration 已经在仓库的 `data/` 里（intersection 每个 goal 约 5 万个 step，lanechange 每个 goal 15 万个），每行最后两列是 expert 的 steering 和 throttle。**做完会的**：[第 4 站](#coil)和[第 7 站](#shared)的全部内容，并亲手开车感受 intent inference 什么时候错、assistance 什么时候碍事。**时间和算力**：handout 说 BC 训练约 5 分钟，每个 MDN 约 15 分钟，调参会更久；CPU 即可。要用方向键操作，必须在有显示器的本机上跑。**优先级**：先做。

- 用课程仓库里改过的 CARLO，不要另装公开版本（handout）。
- 所有训练的 weight 用 Xavier initialization（Kaiming 也可以）（handout）。
- MDN 用很窄、很浅的 network，handout 的原话是 use really small networks。先用较高的 learning rate 训少量 epoch，再用 `--restore` 接着训，同时逐步降 learning rate（handout）。
- MDN 的 loss 一开始如果不是单调下降，停掉重跑，因为 initialization 很关键；反复出现就降 learning rate（handout）。Loss 变成负数是正常的，原因见第 4 站的 :::wrong。
- MDN 的 network 输出 6 个数，前两个是 mean，后四个是 covariance 的参数（仓库的 `loss_fn` 注释）。Covariance 写成 $AA^\top$ 保证 PSD（handout 的提示）；再加一个很小的 $\epsilon I$ 可以避免 $\log\det$ 变成 $-\infty$（经验）。
- BC 转向效果差时，在 loss 里加大 steering error 的 weight（handout；`train_coil.py` 的注释也提示 steering 和 throttle 可以不等权）。成功标准是 10 个 episode 里至少有几次成功左转（handout）。
- 同一个 scenario 的三个 goal 要用同样的 network 结构（handout），否则 intent inference 里比较三个 likelihood 时尺度不一致（经验）。
- CoIL 的 forward 拿到的是一个 batch 的 command，逐个 sample 循环很慢；注释建议三个 head 各写一个 `nn.Sequential`，用 mask 选出每个 sample 该用的 head（仓库）。
- Intent inference 的单步 posterior 很抖，HW3 建议对 $P_g$ 做 moving average（handout）。`shared_autonomy.py` 里有一个保存最近 100 步 posterior 的 `scores` array，初始化成 uniform（仓库）；window 取多长要自己试，第 7 站的表说明了为什么不要直接连乘。
- Shared autonomy 里 throttle 由程序给，你只控 steering；robot 的 steering 限制在 $\pm0.05$、throttle 为 0（仓库）。(v) 问为什么要这个限制，(vii) 问 robot 的帮助是否反而让你开得更差、为什么（handout）。可以在 clip 之外再试一个 confidence gate，开几次比较手感（经验）。
- Problem 1 (iv) 比较固定 learning rate 一次训 500 个 epoch 和 250 + 250 分两次训（batch 顺序相同），再问换成 Adam 结论变不变：先列出训练过程里除了 weight 之外还有哪些 state（data 的顺序、optimizer 内部的量），再看重启时哪些会丢（经验）。
- 交作业时仓库的 `make_submission.sh` 把五个 `.py` 和 `policies/` 打成 `hw3.zip`（仓库）。

### HW2：Grasping and manipulation

**要实现的**：Problem 1 先是书面题：为什么 form closure 一定是 force closure、为什么 planar 至少 4 个 contact 而 spatial 至少 7 个，以及用 graphical method 判断一个被五个 finger 卡住的直角三角形去掉哪一个 finger 后仍是 form closure；然后在 `form_force_closure.py` 里写 `wrench()`、form closure 的 LP、`cone_edges()`（spatial 用 4 条 edge 的 pyramid）和 force closure 的判定，(vi) 再对一个三点 contact 的 square 推出 force closure 需要的最小 $\mu$（表示成 $h$、$c$ 的 function，再代入 $c=1/4$、$h=1/2$）。Problem 2 在 `grasp_optimization.py` 里用 cvxpy 写 SOCP 和 precompute。Problem 3 在 Physics 101 的 ramp clip 上训练以 $\mu$ 为中间量的 CNN 和对比的 baseline。**做完会的**：[第 1 站](#closure)、[第 2 站](#gfo)和[第 3 站](#lman)的 ramp 部分。**时间和算力**：handout 没有给时间，底稿估计 10–12 小时，没有官方出处；CPU 即可；Problem 3 要下载 Physics 101 dataset 和 handout 里给的预处理过的第一帧 JPG。**优先级**：值得做。

- M1 Mac 上 cvxpy 可能要先 `brew install cmake`，再装 `ecos==2.0.14`（handout）。
- Frictionless contact 在 $F$ 里只贡献一列，frictional 的贡献两列（planar）或四列（spatial pyramid），matrix 的维数随 contact 类型变（handout）。
- Form closure 要同时检查 $F$ 满秩和 LP feasible，只检查一个会出错，第 1 站的 :::wrong 就是只看 rank 的反例（handout，例子是本页的）。
- `test.py` 不完整，autograder 也不跑它，自己补测试，handout 建议至少为 (iii) 的三角形加一个；第 1 站错开的 square（form closure）和三个 finger 的反例（rank 3 但不是）也可以直接当 test case（handout，例子是本页的）。
- Problem 1 (vi) 推出最小 $\mu$ 之后用 `is_in_force_closure()` 核对（handout）；在略大和略小的 $\mu$ 上各跑一次（经验）。
- Precompute 的 12 个 unit wrench 要各解一次 SOCP，可以先在 planar 情形（6 个）上和直接解 SOCP 对比，第 2 站的例子给出了一组可以对照的数（经验）。
- `AccelerationLaw` 里的 $g$ 要写成 `nn.Parameter`，初值 16，因为 label 的单位是 pixel/frame²（仓库的注释）。Loader 默认只读 ramp surface 1，五分之一的 batch 当 validation（仓库）。
- Problem 3 的参考值：简单 CNN 在 batch 32 上 validation loss 应低于 5（handout）。Loss 是整个 batch 的 error 的 L2 norm $\sqrt{\sum_i\lVert y^{(i)}-\hat y^{(i)}\rVert^2}$，不是 mean，换成每个 sample 的 RMS 约是 $5/\sqrt{32}=0.88$（经验）。
- 10° 的 clip 大多数 label 是 0，看 validation 的预测时会在这一组看到负的 acceleration，原因见第 3 站的 :::edge（经验）。
- 不要调 baseline，题目要的是在同样设置下看 physics 结构带来的差别（handout）。

### HW1：MDP、Q-learning 与 learning-based perception

**要实现的**：Problem 1 在 $20\times20$ 的 grid 上为一架受 storm 干扰的 drone 做 value iteration（storm 中心 $(15,7)$、$\sigma=1$、$\gamma=0.95$、goal $(19,9)$；在 $x$ 处以 probability $\exp(-\lVert x-x_{\text{eye}}\rVert^2/2\sigma^2)$ 往随机方向走），再从 $10^5$ 个 sampled transition 训练一个 3 层、宽 64 的 Q-network，比较两者的 policy；Problem 2 把在 ImageNet 上 pretrain 的 Inception-v3（约 2500 万参数）截在 bottleneck 层作为冻结的 feature extractor，在 PASCAL VOC 2007 的 cat/dog/neg 上训练 linear classifier，再做 sliding-window、convolutional 两种 detection 和 saliency map。**做完会的**：RL 和 CNN 的基本功，内容与 [RB4301](../courses/RB4301.html#mdp) 和 [BERKELEY-CS285](../courses/BERKELEY-CS285.html) 重叠。**时间和算力**：handout 说普通电脑就能训 linear classifier；没有给总时间。**优先级**：有余力再做（经验：内容和其他课重复）。

- 画 value function 的 heatmap 时 $(0,0)$ 在左下角，$x_1$ 沿下边、$x_2$ 沿左边（handout）。
- Q-learning 的 loss 是 Bellman residual 的平方，expectation 用 sample 平均代替（handout）。State 用 2 维 vector、action 用 1 个元素的 vector；handout 提醒换一种表示可能要对 Q-network 大量调参（handout）。
- Adam 的 learning rate 在 $10^{-3},10^{-2},10^{-1}$ 里挑（handout）。
- Convolutional detection 时把最后一个 conv 的 output 从 $[1,C,K,K]$ reshape 成 $[K\cdot K,C]$，Inception-v3 的有效 pooling grid 是 $(8,8)$（handout）。
- Saliency 用 `torch.autograd.grad` 求 raw gradient（handout）。

### HW4（Winter 2022）：System architecture 与 verification

作业页链接的 `hw4.pdf` 是 Winter 2022 的 Problem Set 4，Winter 2025 的 syllabus 里没有它。**内容**：Problem 1 读 Eppner et al. 关于 Amazon Picking Challenge 2015 的系统论文，总结它的 system architecture 的优缺点；Problem 2 是 LTL：判断几组 formula 是否等价、哪些 formula 正确地形式化了“只有持票或是 Stanford 学生才能在下一步进入体育场”和“CS237B 最多上一次”，以及对一个 mod 10 的 state machine 判断 $\mathbf{FG}(s=0)$ 和 $\mathbf{GF}(s=1)$。**时间和算力**：纸笔即可，没有代码。**优先级**：有余力再做（经验）。

- 先把 implication 改写成 $\neg\alpha\vee\beta$，并记住 $\mathbf F\phi\equiv\mathsf{true}\ \mathbf U\ \phi$、$\mathbf G\phi\equiv\neg\mathbf F\neg\phi$（经验）。
- 对每个候选 formula 构造一条应该被允许和一条应该被禁止的 trace 去试，比直接推等价快（经验）。
- State machine 那题手推前十几步，看它是否进入一个 cycle，$\mathbf{FG}$ 和 $\mathbf{GF}$ 的答案取决于 cycle 里有哪些 state（经验）。
