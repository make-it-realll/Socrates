---
code: NW-MODERNROBOTICS
evidence: syllabus
evidenceNote: "前沿公开课，不是 NUS 课。期次：Lynch 与 Park 的教材 Modern Robotics v2（2019 年 12 月版 preprint），配套的 Coursera 六门课 Specialization，以及 Northwestern ME 449 Fall 2026。教材这次读的是全文：Northwestern 的 PDF 地址被代理拒绝，改从 GitHub 上一个学习笔记仓库里的同版大字版 PDF（MR-largefont-v2.pdf，2020 年 1 月生成）抽出全文，第 2 到 13 章和附录 C 逐段对过；抽文字时 minus sign 会丢，所以涉及符号的例子（Example 3.23、3.26、3.28、4.1、4.5、6.1、12.7、13.2 节的 H(0)、13.4 节的 odometry、C.1）又把那几页渲染成图片逐个核对；第 7、8 章、9.3 与 9.4 节、11.5 到 11.7 节、12.1.6 与 12.2.2 节、13.3 节这次补成了第 5、6、9、10、13 站和第 11 站的两个小节，书上的 Example（8.5、13.5、Figure 13.17 等）用 MR code library 的 Python 版或自己写的 Python 重算过，Figure 7.5 与 11.51、11.52 式那两页也渲染成图片核对；第 7 章、9.4 节和 11.5 到 11.7 节书上没有数值例子，那几站的例子是自己构造的。Video lectures 没有看。作业部分读了 ME 449 Fall 2026 课程页和 Assignment 1 到 5 全部 handout、Fall 2025 存档页、capstone、A*、sampling-based planning、form closure、stability of an assembly 五份 wiki handout、CoppeliaSim Introduction 与安装页、MR code library 的 README 和 user manual。Coursera 只读到了 Course 2、3 的课程页（Course 2 第 4 个 module 就是第 7 章，这次又读了一遍它的结构）；Specialization 总页面的权限请求超时，Course 1、4、5、6 的课程页没有去抓。Course 2、3 的 project handout 不在 wiki 上：Course 2 的内容与 ME 449 Assignment 3 Part 1 相同（读了后者），Course 3 的题面只读到一份学生仓库里转抄的版本。"
exam: "Coursera：每章一个 graded quiz 加每段视频一个 Lecture Comprehension quiz（Course 2、3 课程页列出的结构），project 由同学互评。ME 449 Fall 2026：Coursera 成绩 25%，Coursera 之外的 5 个 assignment 25%，Quiz 1（第 2 到 5 章）25%，Quiz 2 25%（来源：ME 449 Fall 2026 课程页）。"
subskills:
  - id: cspace
    name: Configuration space：dof、topology 与 constraint
    l3: "能用 Grübler's formula 算出一个 planar 或 spatial mechanism 的 dof，并说出 2R arm 的 C-space 是 torus。"
    l4: "能独立判断一个 Pfaffian constraint 是 holonomic 还是 nonholonomic，并在 C-space 里正确处理 revolute joint 的 wrap-around（distance、connectivity）。"
    l5: "能用 coin 的例子解释 nonholonomic constraint 为什么减少了 velocity 的自由却不减少能到达的 configuration，并说明 Grübler's formula 在什么情况下给错答案。"
  - id: twist
    name: Twist、screw axis 与 wrench
    l3: "能写出一个 planar rigid-body motion 的 spatial twist 和 body twist，并用 $[\\mathrm{Ad}_T]$ 在两者之间换算。"
    l4: "能独立从两个 pose 求出 screw axis $\\mathcal S$ 和 $\\theta$（matrix logarithm），算出 $e^{[\\mathcal S]\\theta}$，并把一个 wrench 换到另一个 frame。"
    l5: "能说清 $v_s$ 为什么不是 body origin 的 velocity，以及 wrench 的换 frame 为什么用 $[\\mathrm{Ad}]^\\top$（power 不变）。"
  - id: poe
    name: Product of exponentials：forward kinematics
    l3: "能从一张 home configuration 的图读出每个 joint 的 screw axis 和 $M$，写出 space form 的 PoE。"
    l4: "能独立写出 body form（$\\mathcal B_i=[\\mathrm{Ad}_{M^{-1}}]\\mathcal S_i$），并对同一个 robot 用 D-H 算出相同的 $T(\\theta)$。"
    l5: "能用具体的例子说明 PoE 相对 D-H 省掉了什么（link frame、offset、tool frame 的限制），以及 D-H 唯一的优点是什么。"
  - id: jac
    name: Space Jacobian、body Jacobian 与 numerical IK
    l3: "能对一条 open chain 写出 space Jacobian 的每个 column，并用 $\\tau=J^\\top\\mathcal F$ 算 joint torque。"
    l4: "能独立算出 body Jacobian，验证 $J_s=[\\mathrm{Ad}_{T_{sb}}]J_b$，并用 body twist 作 error 做 Newton–Raphson IK。"
    l5: "能解释 IK 的 error 为什么必须是 $\\log(T_{sb}^{-1}T_{sd})$ 而不是两个 matrix 之差，以及 Jacobian 和 wrench 必须配同一个 frame 的理由。"
  - id: closed
    name: Closed chain：parallel mechanism 的 kinematics 与 singularity
    l3: "能写出 3×RPR 或 Stewart platform 的 IK，并说出为什么 parallel mechanism 的 FK 有多个解。"
    l4: "能独立用 statics 求出 Stewart 类 mechanism 的 $J_s^{-1}$，对一般 parallel mechanism 写出 $H_a\\dot q_a+H_p\\dot q_p=0$ 并求出 $J_a$。"
    l5: "能用 five-bar 的具体 configuration 讲清 actuator singularity、configuration space singularity 和 end-effector singularity 的区别，以及哪种能靠挪 actuator 消除。"
  - id: dyn
    name: Dynamics：Lagrangian、Newton–Euler 与 mass matrix
    l3: "能对 2R arm 用 Lagrangian 推出 $M(\\theta)$、$c(\\theta,\\dot\\theta)$、$g(\\theta)$，并算出给定 state 的 joint torque。"
    l4: "能独立手算 Newton–Euler inverse dynamics 的 forward 与 backward iteration，用 $n$ 次 inverse dynamics 拼出 $M$，写出 forward dynamics 的 Euler integration。"
    l5: "能解释 $\\ddot\\theta=0$ 为什么仍要 torque、end-effector mass matrix 为什么随方向变、explicit Euler 为什么让 energy 越积越多。"
  - id: plan
    name: Motion planning：C-obstacle 与 sampling-based planner
    l3: "能判断一个 configuration 在不在 C-obstacle 里，并按步骤手算 RRT 的一轮扩展。"
    l4: "能独立写出 PRM 和 RRT（含 segment 与 circle 的 collision check），说出 complete、resolution complete、probabilistically complete 的区别。"
    l5: "能说明 grid 方法为什么在高维 C-space 里做不动，以及 sampling-based planner 用什么换来了能做。"
  - id: control
    name: Trajectory generation 与 task-space control
    l3: "能写出 velocity-controlled joint 的 feedforward 加 PI 控制律，并由 $K_p$、$K_i$ 算出 $\\zeta$ 和 $\\omega_n$。"
    l4: "能独立写出 task-space 的控制律 $\\mathcal V=[\\mathrm{Ad}_{X^{-1}X_d}]\\mathcal V_d+K_pX_{\\mathrm{err}}+K_i\\int X_{\\mathrm{err}}$，并核对 capstone 的测试数值；能在 screw path 和 Cartesian path 之间做选择。"
    l5: "能解释为什么 PI 在 $\\zeta\\ge1$ 时 error 仍会越过零，以及 feedforward 缺了 $[\\mathrm{Ad}]$ 或缺了 feedback 各会怎样失败。"
  - id: timeopt
    name: Via point 与 time-optimal time scaling
    l3: "能由 via point 的位置和 velocity 求出每段 cubic 的 coefficient，并对给定的 $(s,\\dot s)$ 算出 $L$ 和 $U$。"
    l4: "能独立在 phase plane 上画出 motion cone 与 velocity limit curve，按 time-scaling algorithm 找出全部 switch。"
    l5: "能说明 time-optimal 解为什么永远在 $U$ 或 $L$ 上、为什么只能和 velocity limit curve 相切，以及实际中为什么很少原样使用它。"
  - id: force
    name: Force control、hybrid motion–force control 与 impedance control
    l3: "能写出 $\\tau=\\tilde g+J^\\top\\mathcal F_d$ 与带 F/T sensor 的 PI force control，并说出 natural constraint 与 artificial constraint。"
    l4: "能独立算出 hybrid control 的 projection $P$，写出 impedance control 与 admittance control 的 control law。"
    l5: "能用数字说明按坐标轴分 motion/force 为什么错，以及 impedance control 为什么难以 render 很硬的环境。"
  - id: grasp
    name: Grasping：form closure 与 force closure
    l3: "能写出 planar contact 的 wrench，并用 linear program 判断 form closure。"
    l4: "能独立画出 friction cone，判断两指 planar grasp 是否 force closure，并解释 rank 条件为什么不能省。"
    l5: "能说明 planar form closure 为什么至少要 4 个 contact，以及 friction 怎样把这个数降到 2。"
  - id: mobile
    name: Wheeled mobile robot 与 mobile manipulation
    l3: "能写出 youBot 的 $H(0)$，由 wheel speed 算出 chassis 的 body twist。"
    l4: "能独立写出 odometry 的 exact integration 和 $J_e=[J_{\\mathrm{base}}\\ J_{\\mathrm{arm}}]$，复现 capstone 的测试数值。"
    l5: "能解释 mecanum wheel 的 roller 为什么让 chassis omnidirectional，以及 pseudoinverse 的 minimum-norm 解为什么会把 arm 拉向 singularity。"
  - id: nonholo
    name: Nonholonomic mobile robot：controllability、shortest path 与 tracking
    l3: "能写出 unicycle、diff-drive、car 的 kinematic model 并换成 canonical model，算出两个 vector field 的 Lie bracket。"
    l4: "能独立判断 STLA 与 STLC，枚举 Dubins path 求最短路径，写出 (13.31) 的 tracking control law。"
    l5: "能解释 nonholonomic robot 为什么 controllable 却不能用 continuous time-invariant feedback 稳到一点，以及只跟踪一个 reference point 为什么可能倒着开。"
open:
  - label: "Lynch & Park, Modern Robotics: Mechanics, Planning, and Control（v2 preprint，2019 年 12 月）"
    url: "https://hades.mech.northwestern.edu/images/2/25/MR-v2.pdf"
    note: "全页的讲法来源。这个地址被代理拒绝；实际读的是 GitHub 仓库 huashanjian/modern-robotics-notes 里同一版的大字版 MR-largefont-v2.pdf，用 pdftotext 抽全文逐段读，符号有疑问的页渲染成图片核对。"
  - label: "Modern Robotics 课程主页（书、视频、code library、Coursera 与 CoppeliaSim 的入口）"
    url: "https://hades.mech.northwestern.edu/index.php/Modern_Robotics"
    note: "只用来找各种材料的链接；video lectures 没有看。"
  - label: "ME 449 Robotic Manipulation，Fall 2026 课程页"
    url: "http://hades.mech.northwestern.edu/index.php/ME_449_Robotic_Manipulation"
    note: "评分比例、进度表（跳过 4.2、8.4、8.7 到 8.9、13.3；第 7 章、11.5 到 11.7 节和第 12 章不在进度表里；9.3、9.4 节在 11 月 6 日到 11 日）和 Assignment 1 到 5 的链接。这次读的是 2026 年 11 月 11 日编辑的版本。"
  - label: "ME 449 Fall 2026 Assignment 2、3、4、5（PDF）"
    url: "https://hades.mech.northwestern.edu/images/b/bf/ME449-asst3-2026.pdf"
    note: "四份都读了（另三份是同目录下的 ME449-Asst2-2026.pdf、ME449-asst4-2026.pdf、ME449-asst5-2026.pdf）。Assignment 2、5 主要是书上习题的题号，习题原文在书里。"
  - label: "ME 449 Assignment 1"
    url: "http://hades.mech.northwestern.edu/index.php/ME_449_Assignment_1"
    note: "Fall 2026 的第一份作业，wiki 页面。"
  - label: "ME 449 Robotic Manipulation（Archive Fall 2025）"
    url: "https://hades.mech.northwestern.edu/index.php/ME_449_Robotic_Manipulation_(Archive_Fall_2025)"
    note: "用来对照上一期的作业安排（Fall 2025 的 Assignment 2 是书上习题 3.16、3.27、4.2、4.5、4.10、5.2）。"
  - label: "Capstone Project：Mobile Manipulation（handout）"
    url: "https://hades.mech.northwestern.edu/index.php/Mobile_Manipulation_Capstone"
    note: "第 8、12 站的测试数值和“作业”一节的大部分提示。全文分两段读完，这次又按问题逐条核对了一遍。"
  - label: "CoppeliaSim Introduction（Scene 1 到 8 的说明与 CSV 格式）"
    url: "http://hades.mech.northwestern.edu/index.php/CoppeliaSim_Introduction"
    note: "确认了 obstacles.csv 第三列是 diameter、Scene 6 每行 13 个数等格式。"
  - label: "Getting Started with the CoppeliaSim Simulator"
    url: "https://hades.mech.northwestern.edu/index.php/Getting_Started_with_the_CoppeliaSim_Simulator"
    note: "安装、scene 和已知问题。"
  - label: "Coursera Resources（各门 Coursera 课的 project 入口）"
    url: "https://hades.mech.northwestern.edu/index.php/Coursera_Resources"
    note: "列了 Course 1、4、5、6 的 project；Course 5 有两个 project。"
  - label: "A* Graph Search / Sampling-Based Planning / Evaluating Form Closure / Stability of an Assembly"
    url: "https://hades.mech.northwestern.edu/index.php/Stability_of_an_Assembly_Project"
    note: "四份 handout 都读了（另三份是同一 wiki 上的 A*_Graph_Search_Project、Sampling-Based_Planning、Evaluating_Form_Closure_Project）。"
  - label: "Coursera：Modern Robotics, Course 2: Robot Kinematics"
    url: "https://www.coursera.org/learn/modernrobotics-course2"
    note: "课程页：四个 module 的视频、graded quiz 和 project 的名字；第 4 个 module 是第 7 章（一段 9 分钟视频、一个 Lecture Comprehension、一个 chapter quiz，没有 project），是第 5 站的出处之一。project 的题面不在这一页上。"
  - label: "Coursera：Modern Robotics, Course 3: Robot Dynamics"
    url: "https://www.coursera.org/learn/modernrobotics-course3"
    note: "同上。"
  - label: "NxRLab/ModernRobotics（MR code library 的 GitHub 仓库）"
    url: "https://github.com/NxRLab/ModernRobotics"
    note: "README 和 user manual（doc/MRlib.pdf）都读了；第 3 到 8 站的数值用仓库里的 Python 版核对过。"
sources:
  - label: "Coursera：Modern Robotics Specialization（权限请求超时，没有读到）"
    url: "https://www.coursera.org/specializations/modernrobotics"
  - label: "andresalemn 的 Modern Robotics 仓库（学生仓库，转抄了 Course 3 project 的题面）"
    url: "https://github.com/andresalemn/ModernRobotics"
  - label: "foiegreis 的 Coursera 作业仓库（学生仓库，含 Course 2 project 的输出格式和 Course 4 的 obstacles.csv 原文件）"
    url: "https://github.com/foiegreis/Coursera_Modern_Robotics_Specialization"
---

先看三次失败。每一次 program 都算得很认真，错在用来描述 robot 的那套语言上。

**第一次。** 一条 2R arm（两根 link 都长 1 m），base 旁边 0.6 m 处有一根细柱子。要从 $\theta=(-60^\circ,60^\circ)$ 移到 $(60^\circ,45^\circ)$。把两个 joint angle 各取 $[-180^\circ,180^\circ)$，在这个 square 上铺 2° 的 grid 做 search，结论是“没有 path”。可 arm 明明能把 link 1 往背后转 240° 绕过柱子。

::fig[mr-pillar] 两边从同一个 start 出发，θ₁ 都以 60°/s 转。左边是 grid search 能想到的唯一方向：θ₁ 增到约 −14° 时 link 1 就碰上柱子，停在那里。右边往回转 240°，4 秒后到达同一个 goal。第 1 站会在 C-space 里看清为什么。

**第二次。** 一辆车正绕地面上的点 $(2,-1)$ 以 2 rad/s 逆时针转。它的 body twist 是 $(0,0,-2,\ 2.8,4,0)$。把这六个数原样发给一个按 space frame 理解 twist 的接口，车改成绕 $(2,-1.4)$ 顺时针转。

::fig[mr-twistframe] 同一个车、同一组六个数。灰色折线说明 $(2,-1.4)$ 从哪来：从 $\{b\}$ 的 origin 出发，沿 $\hat y_b$ 走 $-1.4$、再沿 $\hat x_b$ 走 2，正好到 $q$。第 2 站会把这件事算一遍。

**第三次。** Mobile manipulator 的 gripper 要沿一条 reference trajectory 把方块从 $(1,0)$ 搬到 $(0,-1)$。Controller 只用 feedforward：每一步照着 reference 的 velocity 走。Gripper 开始时偏了 40° 和 0.47 m，走完 15 秒，它停在地面以下 0.25 m。

::fig[mr-ffonly] 左边两个 gripper 按 2 倍速重放 15 秒的 kinematic simulation（自己写的，第 8 站会讲），虚线框是 reference 此刻要它在的位置。看左边那个：起点的偏差（低了一截，还歪了 40°）没有谁去拉回来，照着 reference 的 velocity 走只会把它一路带着，最后整个钻到地面以下。右边那个加了 feedback，不到 3 秒就钻进虚线框。右边 plot 上的点与左边同步。

三件事分别要用到这门课的三样东西：configuration space 的 topology（第 1 站），twist 和它所在的 frame（第 2 站），以及带 feedback 的 task-space control（第 8 站）。

Modern Robotics 和传统 robotics 教材最大的不同，是全书只用一种语言：rigid body 的 velocity 是一个 6-vector twist，force 是一个 6-vector wrench，joint 是一条 screw axis，forward kinematics 是一串 matrix exponential 的乘积。学会这一套，Jacobian、IK、trajectory、control、mobile manipulation 都是同一组运算的组合。全课的终点是 Coursera 的 capstone：自己写 odometry、trajectory generator 和 feedback controller，让 KUKA youBot 在 simulator 里完成一次 pick-and-place。下表是每一站在 capstone 里的位置。

| 站 | 内容 | 在 capstone 里用在哪 |
|---|---|---|
| 1 | C-space、holonomic 与 nonholonomic | youBot 的 configuration 是 13 个数里的哪几个 |
| 2 | twist、screw、wrench、$[\mathrm{Ad}]$ | 所有 error 和 velocity 的表示 |
| 3 | PoE forward kinematics | 由 $\theta$ 算 $T_{0e}$ |
| 4 | body Jacobian、numerical IK | $J_{\mathrm{arm}}$ |
| 5 | closed chain：parallel mechanism | capstone 不用；Course 2 第 4 个 module 的 quiz |
| 6 | dynamics：Lagrangian、Newton–Euler | capstone 不用（velocity 接口）；ME 449 Assignment 4、5，Course 3 的 project |
| 7 | motion planning | capstone 不用；Course 4 的两个 project |
| 8 | trajectory 与 task-space control | TrajectoryGenerator、FeedbackControl |
| 9 | via point、time-optimal time scaling | capstone 不用；ME 449 Assignment 5 |
| 10 | force、hybrid、impedance control | capstone 不用 |
| 11 | grasping | gripper 的 standoff 与 grasp pose；Course 5 的两个 project |
| 12 | mobile manipulation | NextState、$J_{\mathrm{base}}$、$J_e$ |
| 13 | nonholonomic mobile robot | capstone 不用（youBot 是 omnidirectional） |

:::note 和 RB2202 的分工
NUS 的 [RB2202](../courses/RB2202.html) 也以这本书为主要讲法，已经详细讲了 rotation 的各种表示（Rodrigues formula、quaternion）、homogeneous transform、2R arm 的 Jacobian 与 singularity、IK 的 analytic solution 和 damped least squares、Lagrangian dynamics、cubic/quintic time scaling，以及 D-H 在相邻 axis 接近 parallel 时的 ill-conditioning。这一页不重复 rotation、Jacobian 的 singularity、analytic IK 和 cubic/quintic，只在用到时指过去，把篇幅留给 Modern Robotics 自己的东西：C-space 的 topology、twist 与 wrench、PoE 与 space/body Jacobian、closed chain、motion planning、task-space control、grasping 和 mobile robot。Dynamics 例外：第 6 站从 Lagrangian 重新推一遍，因为 Newton–Euler、mass matrix、forward dynamics 和后面的 time-optimal、force control 都要用同一个 2R 例子接着算。
:::

## [cspace] Configuration space：dof、topology 与 constraint

:::skip
快速路线必读（书第 2 章，约 1 小时）。能用 Grübler's formula 数 dof，说出 2R arm 的 C-space 为什么是 torus、这对 planner 意味着什么，并分清 holonomic 与 nonholonomic constraint，就可以去第 2 站。
:::

### 要几个数才能说清 robot 在哪

Configuration 是 robot 上每一点的位置；能完整给出 configuration 的最少的 real number 个数叫 degrees of freedom（dof）。

先数一个 rigid body。在 plane 里取 body 上三个点 A、B、C。A 可以在任何地方，2 个数。B 到 A 的距离固定，B 只能在以 A 为 center 的 circle 上，再加 1 个数。C 到 A、B 的距离都固定，两个 circle 至多交于两点，而 rigid body 不能翻面，C 被完全确定，0 个数。合计 3。空间里同样数：A 有 3 个，B 在 sphere 上 2 个，C 在一个 circle 上 1 个，合计 6。

$$\text{dof}=\text{各点 coordinate 的总数}-\text{独立 constraint 的个数}$$

### Grübler's formula

Mechanism 由 $N$ 个 link（包括 ground）和 $J$ 个 joint 组成。让所有 link 都自由飞，共有 $m(N-1)$ 个 dof（ground 不动，planar 时 $m=3$，spatial 时 $m=6$）。第 $i$ 个 joint 允许 $f_i$ 个自由，也就是施加了 $m-f_i$ 个 constraint。全部减掉：

$$\text{dof}=m(N-1)-\sum_{i=1}^J(m-f_i)=m(N-1-J)+\sum_{i=1}^Jf_i$$

$f_i$ 从下表查（书上 Table 2.1）。每个 joint 只连两个 link；三个 link 交在一点，要算成两个重叠的 joint。

| Joint | $f$ | planar 时的 constraint $c$ | spatial 时的 constraint $c$ |
|---|---|---|---|
| Revolute（R） | 1 | 2 | 5 |
| Prismatic（P） | 1 | 2 | 5 |
| Helical（H） | 1 | 不适用 | 5 |
| Cylindrical（C） | 2 | 不适用 | 4 |
| Universal（U） | 2 | 不适用 | 4 |
| Spherical（S） | 3 | 不适用 | 3 |

用三次。**Four-bar linkage**：4 个 link（含 ground），4 个 revolute joint，planar：

$$3(4-1-4)+4\times1=-3+4=1$$

转一个 crank，其余全被带着走，这是对的。**Delta robot**（书上 Example 2.7）：17 个 link，9 个 revolute joint、12 个 spherical joint（$f=3$），spatial：

$$6(17-1-21)+9\times1+12\times3=-30+9+36=15$$

可 end-effector 只能 translate，看得见的 dof 是 3。多出来的 12 个是那些 parallelogram 里细杆绕自己 axis 的 spin，不影响 end-effector。Grübler's formula 数的是整个 mechanism 的 dof，不是你关心的那一部分的。

**Stewart–Gough platform**（书上 Example 2.8，飞行模拟器的座舱就是它）：上下两块 platform 由六条 UPS leg 相连，每条 leg 是 universal、prismatic、spherical 三个 joint、两根 link。$N=2+12=14$，$J=18$：

$$6(14-1-18)+6\times2+6\times1+6\times3=-30+12+6+18=6$$

上面的 platform 有完整的 6 个 dof。把六个 universal joint 换成 spherical，每个 joint 多 1 个自由，公式给出 12；多出来的 6 个又是每条 leg 绕自己 axis 的 spin，platform 看不到。

:::wrong Grübler's formula 给出 0，mechanism 就动不了
在一个 parallelogram four-bar 的两根竖杆中间再加一根同样长、同样竖直的杆，上下各一个 revolute joint。5 个 link，6 个 joint：$3(5-1-6)+6=0$。实际上它照样能像 parallelogram 一样平行地晃动，dof 是 1。公式假设每个 joint 的 constraint 互相独立；新加的那根杆施加的 constraint，原来的 parallelogram 本来就满足，是 redundant 的。只要三根竖杆的长度稍有不等，这个 mechanism 就真的卡死，所以这种“公式失灵”只发生在特殊的几何上，但 robot 设计里偏偏常用这种特殊几何。
:::

::fig[mr-parallel] 中间那根杆和两边一样长、一样竖直时，它要求的 motion 两边的杆本来就在做。

### 同样是两个数，形状不同

2R arm 的 configuration 由 $\theta_1$、$\theta_2$ 决定，dof 是 2。一个在 plane 上滑动的点也是 2 个 dof。两者的 C-space 都是二维的，但不一样：$\theta_1$ 加 $360^\circ$ 回到同一个 configuration，所以每个 joint angle 活在 circle $S^1$ 上，C-space 是 $S^1\times S^1=T^2$，一个 torus。Plane 是 $\mathbb R^2$。

同一个办法拼出其他 robot 的 C-space（书上 2.3.1 节）：plane 上的 rigid body 是 $\mathbb R^2\times S^1$（位置加朝向）；PR arm 是 $\mathbb R^1\times S^1$；装了 2R arm 的 mobile base 是 $\mathbb R^2\times S^1\times T^2=\mathbb R^2\times T^3$；空间里的 rigid body 按开头数点的办法是 $\mathbb R^3\times S^2\times S^1$。注意 $S^1\times S^1$ 是 torus $T^2$，不是 sphere $S^2$。有 joint limit 时，那个 joint 的 $S^1$ 要换成一段 closed interval。

把 torus 摊平就是那个 $[-180^\circ,180^\circ)^2$ 的 square，但左右两条边是同一条，上下两条边也是同一条。开头第一次失败就出在这里。

::fig[mr-cspace] 左边是 workspace 里的 arm 和两个圆形 obstacle，右边是同一个问题在 C-space 里的样子，深色区域是让 arm 碰到 obstacle 的 $(\theta_1,\theta_2)$（第 7 站会讲它怎么算）。Arm 沿找到的 path 走时，右边的点同步走：看它走到左边界 $-180^\circ$ 时，从右边界 $180^\circ$ 冒出来接着走，arm 本身的动作是连续的。

Obstacle A 的 center 在 $(0.6,0)$，radius 0.15。Link 1 是从 origin 出发、方向为 $\theta_1$ 的长 1 的 segment，它到 A 的 center 的距离是 $0.6\,|\sin\theta_1|$（center 在 link 1 方向上的 projection $0.6\cos\theta_1$ 落在 segment 内）。小于 0.15 就碰：

$$0.6\,|\sin\theta_1|<0.15\iff|\theta_1|<\sin^{-1}0.25=14.5^\circ$$

和 $\theta_2$ 无关，所以在 C-space 里是一条竖直的 band，宽 29°，把 square 从中间切开。Start 在 $\theta_1=-60^\circ$，goal 在 $+60^\circ$，在 square 里分属两块。在 torus 上，左块从 $\theta_1=-180^\circ$ 那条边出去，就是从 $+180^\circ$ 那条边进右块：link 1 往背后转过 180° 绕到另一边。

图里还有第二个 obstacle B（center $(-0.8,1.2)$，radius 0.3），它在 C-space 里是一块弯曲的区域，path 要绕开它。在 2° 的 grid 上做 breadth-first search，每一步只让一个 joint 动一格：允许跨边时找到的 path 有 178 步（光是 $\theta_1$ 从 $-60^\circ$ 往回转到 $-300^\circ$ 就要 $240/2=120$ 步，其余是 $\theta_2$ 为了绕开 B 来回调整），不允许跨边时找不到。

Planner 的 C-space 必须是 robot 真正的 C-space。对 revolute joint 来说，这意味着 grid 的两端要接上，两个 angle 的距离要按 circle 上较短的 arc 算（第 7 站会再遇到）。

### 一张 chart 盖不住 sphere

既然 C-space 可能弯曲，用什么数去描述它？两种办法。

**Explicit parametrization**：用恰好 dof 个数。地球表面用 latitude 和 longitude。问题是在北极，longitude 取任何值都是同一个点；人走过北极时 longitude 会突然跳 180°。北极在 sphere 上和别的点一样普通，坏掉的是 chart：sphere 和 plane 的 topology 不同，任何一张从 plane 来的 chart 都会在某处坏掉，要用几张互相重叠的 chart（atlas）拼起来。

**Implicit representation**：嵌到更高维的 Euclidean space 里，加 constraint。Sphere 写成 $x^2+y^2+z^2=1$，三个数一个 constraint，处处没有 singularity。Rotation 用 $3\times3$ 的 rotation matrix，9 个数 6 个 constraint，也是这个道理（细节见 [RB2202](../courses/RB2202.html)）。

Modern Robotics 全书用 implicit representation：orientation 用 $R\in SO(3)$，pose 用 $T\in SE(3)$。多用几个数，换来的是计算时不必担心走到 chart 的边上。

### Velocity 上的 constraint：holonomic 与 nonholonomic

Four-bar 的 constraint 是 loop closure，写成 configuration 的 equation $g(\theta)=0$。对 time 求 derivative：

$$\frac{\partial g}{\partial\theta}\,\dot\theta=0$$

这是一个形如 $A(\theta)\dot\theta=0$ 的 velocity constraint，叫 Pfaffian constraint。反过来，给一个 Pfaffian constraint，不一定能找到 $g$ 使 $A=\partial g/\partial\theta$。能找到的叫 holonomic（它其实是 configuration 的 constraint），找不到的叫 nonholonomic。

例子是在桌上竖直滚动的 coin。Configuration 是 $q=(x,y,\phi,\theta)$：接触点的位置、前进方向、coin 绕自己 axis 转过的 angle。C-space 是 $\mathbb R^2\times T^2$，4 维。不打滑要求接触点的 velocity 等于滚动带来的 velocity：

$$\dot x=r\dot\theta\cos\phi,\qquad\dot y=r\dot\theta\sin\phi\qquad\Longleftrightarrow\qquad\begin{pmatrix}1&0&0&-r\cos\phi\\0&1&0&-r\sin\phi\end{pmatrix}\dot q=0$$

两个 constraint。如果它们是 holonomic，coin 就被锁在 C-space 里一个二维的 surface 上。来做一个 maneuver：沿边长为 $a$ 的 square 滚一圈，每到一个角原地转 90°（绕竖直 axis 转不滚动，$x,y,\theta$ 都不变）。回到起点时 $x$、$y$ 不变，$\phi$ 多了 360°，在 $S^1$ 上也等于没变；$\theta$ 却多了 $4a/r$。取 $r=0.05$ m、$a=1$ m，$\theta$ 多了 80 rad。改变 $a$，$\theta$ 就可以落在 circle 上的任何位置，而其余三个 coordinate 原样不变。再加上“原地转向再滚过去”能到达任何 $(x,y)$、原地转能得到任何 $\phi$，四个 coordinate 都能任意指定：能到达的 configuration 是整个 4 维 C-space，不可能落在一个二维 surface 上。所以这两个 constraint 是 nonholonomic 的：它们限制了每一刻能取的 velocity（只有 2 个方向），但不限制最终能到达哪些 configuration（4 维全部能到）。

汽车和 differential-drive robot 是同一回事：不能横着走，但能平行停车。第 12 站的 youBot 用 mecanum wheel 绕开了这个限制。

:::edge Task space 与 workspace
Task space 是任务本身描述在其中的 space：用笔在纸上写字，task space 是 $\mathbb R^2$，与 robot 无关。Workspace 是 end-effector 能到达的 configuration 的集合，由 robot 的结构决定。两者都不是 C-space：一个 7-dof arm 的 C-space 是 7 维，它的 end-effector 的 pose 只有 6 维。
:::

:::from
Rigid body 的数点法、Grübler's formula 与 Table 2.1、four-bar（Example 2.3）、parallelogram 让公式失灵（Example 2.6）、Delta robot（Example 2.7）、Stewart–Gough platform（Example 2.8）、各种 C-space 的乘积写法与 $T^2\ne S^2$、latitude/longitude 的 singularity 与 atlas、explicit 与 implicit representation、Pfaffian constraint 与 rolling coin、task space 与 workspace，都来自 [Modern Robotics](https://hades.mech.northwestern.edu/images/2/25/MR-v2.pdf) 第 2 章（全文逐段读过）。书上证明 coin 的 constraint 不可积，用的是假设存在 $g_1$、由四个 partial derivative 推出矛盾；这里换成了“沿 square 滚一圈”的 maneuver，是自己构造的，结论和书上“nonholonomic constraint 不减少能到达的 C-space 的维数”一致。Obstacle 的位置、band 的宽度和 178 步的 search 结果（4-connected 的 grid，两个 obstacle 都算在内）是为这一页算的。
:::

## [twist] Twist、screw axis 与 wrench

:::skip
快速路线必读（书第 3.3、3.4 节，约 3 小时，全书最重要的一章）。能分清 spatial twist 和 body twist、用 $[\mathrm{Ad}]$ 互换，能由两个 pose 求出 screw axis，能把 wrench 换 frame，就可以去第 3 站。Rotation matrix 和 Rodrigues formula 默认已会，没学过先看 [RB2202](../courses/RB2202.html) 的第 1、2 站。
:::

### 一个 rigid body 的 velocity 是什么

Rigid body 的 pose 用 $T_{sb}=\begin{pmatrix}R&p\\0&1\end{pmatrix}\in SE(3)$ 表示，它随时间变化时，$\dot T$ 有 12 个数，可 rigid body 只有 6 个 dof。要找一个 6 个数的描述。

Rotation 部分已经有了：$\dot RR^{-1}=[\omega_s]$ 是 skew-symmetric matrix，$\omega_s$ 是在 $\{s\}$ 里写的 angular velocity。对整个 $T$ 做同样的事：

$$\dot T\,T^{-1}=\begin{pmatrix}\dot R&\dot p\\0&0\end{pmatrix}\begin{pmatrix}R^\top&-R^\top p\\0&1\end{pmatrix}=\begin{pmatrix}\dot RR^\top&\dot p-\dot RR^\top p\\0&0\end{pmatrix}=\begin{pmatrix}[\omega_s]&v_s\\0&0\end{pmatrix}$$

其中 $v_s=\dot p-\omega_s\times p$。$\mathcal V_s=(\omega_s,v_s)$ 叫 spatial twist，$[\mathcal V_s]$ 这个 $4\times4$ matrix 属于 $se(3)$。从另一侧乘得到 body twist：

$$T^{-1}\dot T=\begin{pmatrix}R^\top\dot R&R^\top\dot p\\0&0\end{pmatrix}=\begin{pmatrix}[\omega_b]&v_b\\0&0\end{pmatrix}$$

$v_b=R^\top\dot p$ 是 body origin 的 velocity 写在 $\{b\}$ 的 axis 上，这个容易理解。$v_s$ 不是 body origin 的 velocity。

拿书上 Example 3.23 的车来看。车绕地面上的点 $q=(2,-1,0)$（$\{s\}$ 里）逆时针转，$\omega_s=(0,0,2)$。$\{b\}$ 装在车上，此刻 origin 在 $p=(4,0.4,0)$，$R=\mathrm{diag}(-1,1,-1)$（$\{b\}$ 的 $\hat z$ 朝下，所以 $\omega_b=R^\top\omega_s=(0,0,-2)$）。

Body origin 绕 $q$ 转，velocity 是

$$\dot p=\omega_s\times(p-q)=(0,0,2)\times(2,1.4,0)=(-2.8,\ 4,\ 0)$$

于是

$$v_s=\dot p-\omega_s\times p=(-2.8,4,0)-(0,0,2)\times(4,0.4,0)=(-2.8,4,0)-(-0.8,8,0)=(-2,-4,0)$$

$$v_b=R^\top\dot p=(2.8,\ 4,\ 0)$$

所以 $\mathcal V_s=(0,0,2,\ -2,-4,0)$，$\mathcal V_b=(0,0,-2,\ 2.8,4,0)$。同一个 motion，两组完全不同的数。

:::wrong Spatial twist 的 linear part 就是 body origin 的 velocity
上面 body origin 的 velocity 是 $(-2.8,4,0)$，$v_s$ 却是 $(-2,-4,0)$，连方向都不同。$v_s=\dot p+\omega_s\times(0-p)$ 是“假想 body 无限大、此刻恰好经过 $\{s\}$ origin 的那一点”的 velocity：$\omega_s\times(0-q)=(0,0,2)\times(-2,1,0)=(-2,-4,0)$，对上了。好处是它和 $\{b\}$ 装在车上哪里无关，只取决于 motion 本身和 $\{s\}$。
:::

开头第二次失败，就是把 $\mathcal V_b$ 当成 $\mathcal V_s$ 用。$(0,0,-2,\ 2.8,4,0)$ 若读作 spatial twist，angular velocity 是 $-2$（顺时针），rotation center $q'$ 满足 $v=-\omega\times q'$：

$$(2.8,4,0)=-(0,0,-2)\times(q'_x,q'_y,0)=(-2q'_y,\ 2q'_x,\ 0)\quad\Rightarrow\quad q'=(2,\ -1.4)$$

换 frame 的公式由定义直接得到。$[\mathcal V_s]=\dot TT^{-1}=T(T^{-1}\dot T)T^{-1}=T[\mathcal V_b]T^{-1}$，乘开：

$$\omega_s=R\,\omega_b,\qquad v_s=R\,v_b+p\times(R\,\omega_b)\qquad\Longleftrightarrow\qquad\mathcal V_s=\underbrace{\begin{pmatrix}R&0\\{[p]}R&R\end{pmatrix}}_{[\mathrm{Ad}_{T_{sb}}]}\mathcal V_b$$

核对：$R\omega_b=(0,0,2)$；$Rv_b=(-2.8,4,0)$；$p\times(R\omega_b)=(4,0.4,0)\times(0,0,2)=(0.8,-8,0)$；相加得 $(-2,-4,0)$。

### Screw axis：每个 twist 都是绕一条线转、同时沿它滑

Chasles 的定理说，任何 rigid-body motion 都可以看成绕某条 axis 转、同时沿这条 axis translate。这条 axis 用一个 point $q$、一个 unit 方向 $\hat s$ 和 pitch $h$（每转 1 rad 沿 axis 走多远）描述。绕它以 $\dot\theta$ 转，twist 是

$$\mathcal V=\begin{pmatrix}\hat s\dot\theta\\-\hat s\dot\theta\times q+h\hat s\dot\theta\end{pmatrix}$$

把 $\dot\theta$ 提出来，剩下的 $\mathcal S=(\hat s,\ -\hat s\times q+h\hat s)$ 叫 screw axis，$\mathcal V=\mathcal S\dot\theta$。Pure translation 没有 axis 可言，这时规定 $\omega=0$、$\|v\|=1$。Revolute joint 是 $h=0$ 的 screw axis，prismatic joint 是 $\omega=0$ 的 screw axis：两种 joint 在这套语言里是同一种东西，这一点在第 3 站会省很多事。

### 从一个 pose 到另一个：exponential 和 logarithm

沿 screw axis $\mathcal S$ 走 $\theta$，得到的 displacement 是 matrix exponential。和 rotation 的 Rodrigues formula 同一个推法（$[\omega]^3=-[\omega]$），结果是

$$e^{[\mathcal S]\theta}=\begin{pmatrix}e^{[\omega]\theta}&G(\theta)\,v\\0&1\end{pmatrix},\qquad G(\theta)=I\theta+(1-\cos\theta)[\omega]+(\theta-\sin\theta)[\omega]^2$$

反过来，给两个 pose，求把一个带到另一个的 $\mathcal S$ 和 $\theta$，就是 matrix logarithm：先对 rotation 部分求 $\omega$、$\theta$（[RB2202](../courses/RB2202.html) 第 1 站讲了 SO(3) 的 log），再由 $v=G^{-1}(\theta)\,p$ 求 $v$，其中

$$G^{-1}(\theta)=\frac1\theta I-\frac12[\omega]+\Big(\frac1\theta-\frac12\cot\frac\theta2\Big)[\omega]^2$$

Rotation 为 identity 时是 pure translation：$\omega=0$，$v=p/\|p\|$，$\theta=\|p\|$。

用书上 Example 3.26 走一遍。Plane 里两个 frame：$\{b\}$ 转了 30°、origin 在 $(1,2)$；$\{c\}$ 转了 60°、origin 在 $(2,1)$。在 fixed frame 里看，从 $\{b\}$ 到 $\{c\}$ 的 displacement 是 $T_{sc}T_{sb}^{-1}$，转了 $60^\circ-30^\circ=30^\circ$。

Planar motion 的 $\omega=(0,0,1)$，$h=0$，只需要求 $q$。“绕 $q$ 转 30°把 $(1,2)$ 带到 $(2,1)$”写成 $R(p_b-q)+q=p_c$，即 $(I-R)\,q=p_c-Rp_b$：

$$Rp_b=\begin{pmatrix}0.866&-0.5\\0.5&0.866\end{pmatrix}\begin{pmatrix}1\\2\end{pmatrix}=\begin{pmatrix}-0.134\\2.232\end{pmatrix},\qquad p_c-Rp_b=\begin{pmatrix}2.134\\-1.232\end{pmatrix}$$

$$\begin{pmatrix}0.134&0.5\\-0.5&0.134\end{pmatrix}q=\begin{pmatrix}2.134\\-1.232\end{pmatrix}\quad\Rightarrow\quad q=\frac{1}{0.268}\begin{pmatrix}0.134&-0.5\\0.5&0.134\end{pmatrix}\begin{pmatrix}2.134\\-1.232\end{pmatrix}=\begin{pmatrix}3.366\\3.366\end{pmatrix}$$

（$0.268=0.134^2+0.5^2$ 是 determinant。）于是 $v=-\omega\times q=(q_y,-q_x,0)=(3.366,-3.366,0)$。合起来：

$$\mathcal S=(0,0,1,\ 3.37,-3.37,0),\qquad\theta=\frac\pi6$$

和书上的答案一致。按 logarithm 的步骤算，结果相同：displacement $T_{sc}T_{sb}^{-1}$ 的 rotation 由 $\operatorname{tr}R=1+2\cos\theta$ 给出 $\theta=30^\circ=0.5236$，translation 是上面的 $p=p_c-Rp_b=(2.134,-1.232)$。$[\omega]p=\hat z\times p=(1.232,2.134)$，$[\omega]^2p=(-2.134,1.232)$，$\frac1\theta=1.910$，$\frac1\theta-\frac12\cot15^\circ=1.910-1.866=0.044$：

$$v=G^{-1}(\theta)p=1.910\begin{pmatrix}2.134\\-1.232\end{pmatrix}-\frac12\begin{pmatrix}1.232\\2.134\end{pmatrix}+0.044\begin{pmatrix}-2.134\\1.232\end{pmatrix}=\begin{pmatrix}3.366\\-3.366\end{pmatrix}$$

::fig[mr-screw] 从 $\{b\}$ 到 $\{c\}$ 看起来是“translate 再转一下”，其实是绕 $q$ 的一次 pure rotation。

拿 exponential 的 formula 核对一遍，看它是否真把 $\{b\}$ 送到 $\{c\}$。$[\omega]v=\hat z\times v=(3.366,3.366,0)$，$[\omega]^2v=\hat z\times(3.366,3.366,0)=(-3.366,3.366,0)$，$\theta=0.5236$：

$$G(\theta)v=0.5236\begin{pmatrix}3.366\\-3.366\end{pmatrix}+0.134\begin{pmatrix}3.366\\3.366\end{pmatrix}+0.0236\begin{pmatrix}-3.366\\3.366\end{pmatrix}=\begin{pmatrix}2.134\\-1.232\end{pmatrix}$$

$e^{[\mathcal S]\theta}T_{sb}$ 的 translation 是 $Rp_b+G(\theta)v=(-0.134+2.134,\ 2.232-1.232)=(2,1)$，正是 $p_c$。

如果改在 body frame 里描述同一次 displacement，要算 $\log(T_{sb}^{-1}T_{sc})$，结果是 $(0,0,0.524,\ 0,-1.43,0)$：同一条 axis 在 $\{b\}$ 里的 coordinate。第 4 站的 IK 和第 8 站的 controller 用的都是这种“从当前 pose 指向目标 pose 的 body twist”。

### Wrench：force 也是 6 个数

作用在 rigid body 上的 force $f$，作用点在 $r$，对 frame origin 产生 moment $m=r\times f$。两者合成 wrench $\mathcal F=(m,f)$。

换 frame 的规则从 power 来：twist 和 wrench 的 inner product $\mathcal V^\top\mathcal F$ 是 power，与在哪个 frame 里写无关。所以

$$\mathcal V_b^\top\mathcal F_b=\mathcal V_a^\top\mathcal F_a=\big([\mathrm{Ad}_{T_{ab}}]\mathcal V_b\big)^\top\mathcal F_a\ \ \text{对所有 }\mathcal V_b\quad\Rightarrow\quad\mathcal F_b=[\mathrm{Ad}_{T_{ab}}]^\top\mathcal F_a$$

Twist 用 $[\mathrm{Ad}]$，wrench 用 $[\mathrm{Ad}]^\top$，方向还相反（换到 $\{b\}$ 用的是 $T_{ab}$）。

书上 Example 3.28：手腕上装 force-torque sensor $\{f\}$，手（0.5 kg）的 center of mass 在 sensor 前方 $L_1=0.1$ m，手里握的 apple（0.1 kg）再往前 $L_2=0.15$ m。取 $g=10$。在手的 frame $\{h\}$（$\hat y_h$ 朝上）里，gravity 是 $\mathcal F_h=(0,0,0,\ 0,-5,0)$；apple 的 frame $\{a\}$ 的 $\hat z_a$ 朝下，gravity 是 $\mathcal F_a=(0,0,0,\ 0,0,1)$。Sensor 读到多少？

::fig[mr-apple] 侧视图。$\{h\}$ 和 $\{f\}$ 方向相同，$\{a\}$ 的 $\hat z_a$ 朝下。

$\{h\}$ 和 $\{f\}$ 方向相同，$T_{hf}$ 只有 translation $(-0.1,0,0)$（$\{f\}$ 的 origin 在 $\{h\}$ 后方 0.1）。$[\mathrm{Ad}_{T_{hf}}]^\top$ 作用在 pure force 上：force 不变，moment 变成 $p_{fh}\times f$，也就是 sensor 看到的 moment arm：

$$\mathcal F_f^{(h)}=\big((0.1,0,0)\times(0,-5,0),\ (0,-5,0)\big)=(0,0,-0.5,\ 0,-5,0)$$

Apple 那一份同理：force 在 $\{f\}$ 里是 $(0,-1,0)$，作用点在 $(0.25,0,0)$，moment 是 $(0,0,-0.25)$。两份相加：

$$\mathcal F_f=(0,0,-0.75,\ 0,-6,0)$$

（$[\mathrm{Ad}_{T_{af}}]^\top\mathcal F_a$ 用 matrix 实算也是这个数。）Sensor 读到 6 N 的向下 force 和 0.75 N·m 的 moment：手腕要往上抬，才托得住。

:::from
$\dot TT^{-1}$ 与 $T^{-1}\dot T$ 的推导、$v_s$ 的物理意义、Example 3.23 的车、$[\mathrm{Ad}]$ 的定义、screw axis $\{q,\hat s,h\}$ 与 normalization、$e^{[\mathcal S]\theta}$ 与 $G^{-1}(\theta)$、Example 3.26 的两个 frame、wrench 与 power 不变、Example 3.28 的手与 apple，都来自 [Modern Robotics](https://hades.mech.northwestern.edu/images/2/25/MR-v2.pdf) 第 3.3、3.4 节（全文读过；三个 Example 的数值和符号对着渲染出的书页核对过。Example 3.23 书上直接写 $v_s=r_s\times\omega_s$、$v_b=r_b\times\omega_b$，并留了“用 $[\mathrm{Ad}_{T_{sb}}]$ 验证”给读者，这里做了这一步；Example 3.28 书上给出 $T_{hf}$ 的 translation $(-0.1,0,0)$ 和 $T_{af}$ 的 rotation，$\{a\}$ 的 $\hat z_a$ 确实朝下，结果 $(0,0,-0.75,0,-6,0)$ 一致）。$q$ 的手算、$G(\theta)v$ 的核对、把 $\mathcal V_b$ 当 $\mathcal V_s$ 时的 rotation center、$G^{-1}(\theta)p$ 的核对，是为这一页算的。
:::

## [poe] Product of exponentials：forward kinematics

:::skip
快速路线必读（书第 4 章，约 1.5 小时）。能从一张 home configuration 的图读出 $M$ 和每个 joint 的 $\mathcal S_i$，写出 space form 与 body form，并能用具体的例子说出 PoE 比 D-H 省了什么，就可以去第 4 站。
:::

### 只记录 joint axis 在哪里

Forward kinematics 要的是 $T_{sb}(\theta)$。PoE 的做法：把 robot 摆到一个选定的 home configuration（所有 $\theta_i=0$），记下 end-effector frame 此时的 pose $M$，再记下每个 joint 此时的 screw axis $\mathcal S_i$（在 $\{s\}$ 里写）。然后从最远的 joint 开始转。只转 joint $n$，end-effector 绕 axis $n$ 做 rigid motion，pose 变成 $e^{[\mathcal S_n]\theta_n}M$。再转 joint $n-1$，它把 joint $n$ 以外的部分整体绕 axis $n-1$ 带走；此刻更靠近 base 的 joint 都还没动，axis $n-1$ 仍在 home 时的位置，所以继续左乘：

$$T(\theta)=e^{[\mathcal S_1]\theta_1}\,e^{[\mathcal S_2]\theta_2}\cdots e^{[\mathcal S_n]\theta_n}\,M$$

这就是 space form 的 product of exponentials。（[RB2202](../courses/RB2202.html) 在 planar 3R 上一步一步画了这个推导，这里不重复。）

### 一条 spatial 3R chain

书上 Example 4.1 是一条 3R spatial open chain。取 $L_1=1$、$L_2=0.5$：

::fig[mr-poe] 三条 axis 各有自己的方向。Home configuration 时 end-effector frame $\{b\}$ 在 $(1,0,-0.5)$，$\hat x_b$ 朝下，$\hat z_b$ 沿 axis 3。

从图上读。Axis 1 方向 $\hat z$、过 origin；axis 2 方向 $-\hat y$、过 $(1,0,0)$；axis 3 方向 $\hat x$、过 $(0,0,-0.5)$。用 $v=-\omega\times q$：

$$\mathcal S_1=\begin{pmatrix}0\\0\\1\\0\\0\\0\end{pmatrix},\quad\mathcal S_2=\begin{pmatrix}0\\-1\\0\\-(0,-1,0)\times(1,0,0)\end{pmatrix}=\begin{pmatrix}0\\-1\\0\\0\\0\\-1\end{pmatrix},\quad\mathcal S_3=\begin{pmatrix}1\\0\\0\\-(1,0,0)\times(0,0,-0.5)\end{pmatrix}=\begin{pmatrix}1\\0\\0\\0\\-0.5\\0\end{pmatrix}$$

$M$ 的 column 是 $\{b\}$ 的 axis 在 $\{s\}$ 里的方向，最后一列是 origin：

$$M=\begin{pmatrix}0&0&1&1\\0&1&0&0\\-1&0&0&-0.5\\0&0&0&1\end{pmatrix}$$

取 $\theta=(30^\circ,45^\circ,60^\circ)$，跟着 $\{b\}$ 的 origin 走三步。

**Joint 3 转 60°。** $\{b\}$ 的 origin 恰好在 axis 3 上，绕它转只改变 orientation，origin 还在 $(1,0,-0.5)$。

**Joint 2 转 45°。** Origin 相对 axis 2 上的点 $(1,0,0)$ 的 offset 是 $(0,0,-0.5)$。绕 $-\hat y$ 转 45° 等于绕 $\hat y$ 转 $-45^\circ$，它把 $(x,z)$ 变成 $(x\cos45^\circ-z\sin45^\circ,\ x\sin45^\circ+z\cos45^\circ)$：

$$(0,\,-0.5)\ \mapsto\ (0.354,\ -0.354),\qquad\text{origin 到 }(1.354,\ 0,\ -0.354)$$

**Joint 1 转 30°。** 绕 $\hat z$ 转，$z$ 不变：

$$(1.354\cos30^\circ,\ 1.354\sin30^\circ,\ -0.354)=(1.172,\ 0.677,\ -0.354)$$

用 matrix exponential 实算整个 $T(\theta)$：

$$T(\theta)=\begin{pmatrix}-0.127&-0.780&0.612&1.172\\0.927&0.127&0.354&0.677\\-0.354&0.612&0.707&-0.354\\0&0&0&1\end{pmatrix}$$

translation 和上面一致。

### Body form

把 $M$ 移到最左边。由 $[\mathrm{Ad}]$ 的定义，$e^{M^{-1}[\mathcal S]M\theta}=M^{-1}e^{[\mathcal S]\theta}M$，所以 $e^{[\mathcal S]\theta}M=Me^{[\mathcal B]\theta}$，其中 $\mathcal B=[\mathrm{Ad}_{M^{-1}}]\mathcal S$ 是同一条 axis 在 $\{b\}$（home 时）里的 coordinate。一个一个往右挪：

$$T(\theta)=M\,e^{[\mathcal B_1]\theta_1}\cdots e^{[\mathcal B_n]\theta_n}$$

这个 3R 的 $\mathcal B_3$ 可以直接读：axis 3 沿 $\hat z_b$ 过 $\{b\}$ 的 origin，$\mathcal B_3=(0,0,1,\ 0,0,0)$。

:::wrong $\mathcal B_i$ 就是把 $\mathcal S_i$ 的两个 3-vector 分别用 $R_M^\top$ 转到 $\{b\}$ 里
那样做会得到 $R_M^\top(1,0,0)=(0,0,1)$ 和 $R_M^\top(0,-0.5,0)=(0,-0.5,0)$，即 $(0,0,1,\ 0,-0.5,0)$，描述的是一条离 $\{b\}$ origin 0.5 的 axis。正确的 $[\mathrm{Ad}_{M^{-1}}]$ 在 linear part 里还有一项 $[p]R$，它考虑了两个 frame 的 origin 不同：$v$ 是“经过 frame origin 的那一点”的 velocity，换了 origin，这一点也换了。实算 $[\mathrm{Ad}_{M^{-1}}]\mathcal S_3=(0,0,1,\ 0,0,0)$，和图上读出的一致。
:::

UR5 也可以拿来核对（书上 Example 4.5）。用书上给的六个 screw axis 和 $M$，取 $\theta_2=-\pi/2$、$\theta_5=\pi/2$、其余为 0，实算 $T(\theta)$ 的 translation 是 $(0.095,0.109,0.988)$，rotation 是绕 $\hat z$ 转 90°，与书上的答案一致。Capstone 的 youBot arm 给的是 body form 的 $\mathcal B_i$，第 12 站要用。

### 为什么不用 D-H

传统教材用 Denavit–Hartenberg parameters：在每个 joint 上按规则装一个 frame，相邻两个 frame 之间用 4 个数描述。这条 3R chain 的 D-H table 如下（和书上附录 C 的 Example C.1 那张表相同，格式是 $(\alpha_{i-1},a_{i-1},d_i,\phi_i)$）：

| $i$ | $\alpha_{i-1}$ | $a_{i-1}$ | $d_i$ | $\phi_i$ |
|---|---|---|---|---|
| 1 | 0 | 0 | 0 | $\theta_1$ |
| 2 | $90^\circ$ | $L_1$ | 0 | $\theta_2-90^\circ$ |
| 3 | $-90^\circ$ | $L_2$ | 0 | $\theta_3$ |

按 $T_{i-1,i}=\mathrm{Rot}(\hat x,\alpha_{i-1})\mathrm{Trans}(\hat x,a_{i-1})\mathrm{Trans}(\hat z,d_i)\mathrm{Rot}(\hat z,\phi_i)$ 乘出来，$\theta=(30^\circ,45^\circ,60^\circ)$ 时得到的 $T_{03}$ 与上面 PoE 的 $T(\theta)$ 每个 entry 都相同（实算）。两种方法给出同一个 forward kinematics，区别全在“写出这张表要做什么”。

| 要做的事 | PoE | D-H |
|---|---|---|
| 每个 joint 要确定什么 | axis 的方向和线上任意一点 | axis $i-1$ 和 axis $i$ 的 common perpendicular，以及沿它装的 frame |
| 中间的 link frame | 不需要 | 每个 joint 一个，必须按规则装 |
| Joint 的零位 | 你选的 home configuration | 由 frame 的规则决定，常与 encoder 的零位差一个 offset（上表的 $\theta_2-90^\circ$） |
| Revolute 与 prismatic | 都是 screw axis，同一个 formula | 变量一个是 $\phi_i$，一个是 $d_i$，要分开记 |
| Base frame 和 tool frame | 任意 | 要符合规则，否则另加一个固定的 transform |
| 每个 joint 几个数 | 6（有冗余） | 4（minimal） |

最后一行是 D-H 唯一的优点。拿两件具体的事比一比。

**换一个 tool。** 在 gripper 侧面装一个 camera，它的 frame 相对 $\{b\}$ 沿 $\hat y_b$ translate 0.2 m。PoE 只要把 $M$ 换成 $M'=M\,\mathrm{Trans}(\hat y,0.2)$，translation 变成 $(1,0.2,-0.5)$，三个 $\mathcal S_i$ 一个都不动。D-H 的最后一个 frame 必须 origin 在 axis 3 上、$\hat x_3$ 沿 common perpendicular，一行 D-H 只允许沿 $\hat x$ 的 $a$ 和沿 $\hat z$ 的 $d$，表达不了沿 $\hat y$ 的 offset。只能在 table 之外再乘一个固定的 $T_{3,\mathrm{cam}}$。

**写 Jacobian。** 下一站会推出 space Jacobian 的 column $i$ 是 $\mathcal S_i$ 被前面的 joint 带走之后的样子。在 home configuration，$J_s(0)=[\mathcal S_1\ \mathcal S_2\ \mathcal S_3]$，就是图上读出的三个 6-vector。用 D-H，要先把各个中间 frame 的 $\hat z_{i-1}$ 和 origin 算出来，再拼 column。

还有一件事 RB2202 用数字讲过：相邻两条 axis 设计上 parallel、实际偏了 0.1° 时，D-H 的 common perpendicular 会跳到几百米外，calibration 无从下手；PoE 里同样的 error 只是 $\omega$ 的一个 component 变了 0.0017。书上附录 C 的结论是：除非 parameter 个数 minimal 至关重要，没有理由选 D-H。

:::from
Space form 与 body form 的推导、Example 4.1 的 3R chain（$M$ 与三个 $\mathcal S_i$）、Example 4.5 的 UR5、$\mathcal B_i=[\mathrm{Ad}_{M^{-1}}]\mathcal S_i$，来自 [Modern Robotics](https://hades.mech.northwestern.edu/images/2/25/MR-v2.pdf) 第 4.1 节；D-H 的四个 parameter、$T_{i-1,i}$ 的四步、Example C.1 的 table、PoE 与 D-H 的利弊对照（frame 不能任意装、revolute 与 prismatic 分开记、axis 接近 parallel 时 ill-conditioned、PoE 的 parameter 就是 joint screw），来自附录 C（全文读过；Example 4.1 的 $M$ 与 $\mathcal S_i$、Example 4.5 的结果、Example C.1 的 table 对着书页核对过。书上 Example 4.1 用的是一般的 $L_1$、$L_2$）。第 4.2 节 URDF 没有写，ME 449 也跳过这一节。$L_1=1$、$L_2=0.5$、$\theta=(30^\circ,45^\circ,60^\circ)$ 的逐步计算、PoE 与 D-H 的数值对照、换 tool 的例子、$\mathcal B_3$ 的错误换法，是为这一页算的。
:::

## [jac] Space Jacobian、body Jacobian 与 numerical IK

:::skip
快速路线必读（书第 5.1、5.2 节与 6.2 节，约 2 小时）。能由 PoE 写出 $J_s$ 和 $J_b$ 的每个 column、验证 $J_s=[\mathrm{Ad}_{T_{sb}}]J_b$，用 $\tau=J^\top\mathcal F$ 算 torque 时 frame 配对正确，并说清 IK 为什么用 $\log(T_{sb}^{-1}T_{sd})$ 作 error，就可以去第 5 站。Singularity 与 manipulability ellipse 见 [RB2202](../courses/RB2202.html) 第 4 站。
:::

### 从 PoE 直接读出 Jacobian

Jacobian 要回答：joint velocity 给定时，end-effector 的 twist 是多少。对 PoE 求 $\dot TT^{-1}$。以 3 个 joint 为例，记 $E_i=e^{[\mathcal S_i]\theta_i}$，$\dot E_i=[\mathcal S_i]\dot\theta_i\,E_i$。Product rule 给出三项：

$$\dot T=[\mathcal S_1]\dot\theta_1E_1E_2E_3M+E_1[\mathcal S_2]\dot\theta_2E_2E_3M+E_1E_2[\mathcal S_3]\dot\theta_3E_3M$$

右乘 $T^{-1}=M^{-1}E_3^{-1}E_2^{-1}E_1^{-1}$，每一项后面的 factor 都消掉：

$$[\mathcal V_s]=\dot TT^{-1}=[\mathcal S_1]\dot\theta_1+E_1[\mathcal S_2]E_1^{-1}\dot\theta_2+E_1E_2[\mathcal S_3](E_1E_2)^{-1}\dot\theta_3$$

$T[\mathcal S]T^{-1}=[\mathrm{Ad}_T\mathcal S]$，所以

$$\mathcal V_s=J_s(\theta)\dot\theta,\qquad J_{s,i}=\big[\mathrm{Ad}_{E_1\cdots E_{i-1}}\big]\mathcal S_i$$

读法：column $i$ 是 joint $i$ 的 screw axis 被它前面的 joint 带到当前位置后的样子。不需要对 forward kinematics 求任何 derivative。

在上一站的 3R、$\theta=(30^\circ,45^\circ,60^\circ)$ 上用一次。Column 1 是 $\mathcal S_1$ 本身：$(0,0,1,\ 0,0,0)$。Column 2：axis 2 被 joint 1 绕 $\hat z$ 转了 30°，方向 $(0,-1,0)\mapsto(0.5,-0.866,0)$，axis 上的点 $(1,0,0)\mapsto(0.866,0.5,0)$，

$$v_2=-\omega_2\times q_2=-(0.5,-0.866,0)\times(0.866,0.5,0)=-(0,\ 0,\ 0.25+0.75)=(0,0,-1)$$

Column 3：axis 3 被 joint 2、joint 1 依次带走，方向 $(1,0,0)\mapsto(0.707,0,0.707)\mapsto(0.612,0.354,0.707)$。它过 end-effector 的 origin，那一点现在在 $p=(1.172,0.677,-0.354)$，所以 $v_3=-\omega_3\times p=(0.604,-1.045,0)$。

$$J_s=\begin{pmatrix}0&0.5&0.612\\0&-0.866&0.354\\1&0&0.707\\0&0&0.604\\0&0&-1.045\\0&-1&0\end{pmatrix}$$

拿 numerical derivative 核对：每次把一个 $\theta_i$ 前后各挪 $10^{-6}$，算 $\dot TT^{-1}$，三个 column 都与上面一致到第 4 位。

### Body Jacobian

对 body form 做同样的事（这回右边的 factor 留下）：

$$\mathcal V_b=J_b(\theta)\dot\theta,\qquad J_{b,i}=\big[\mathrm{Ad}_{e^{-[\mathcal B_n]\theta_n}\cdots e^{-[\mathcal B_{i+1}]\theta_{i+1}}}\big]\mathcal B_i$$

最后一个 column 就是 $\mathcal B_n$。两个 Jacobian 描述同一个 motion，只是 twist 写在不同 frame 里，所以

$$J_s(\theta)=[\mathrm{Ad}_{T_{sb}}]\,J_b(\theta)$$

上面那个 configuration 实算 $J_b$，乘上 $[\mathrm{Ad}_{T_{sb}}]$，与 $J_s$ 的差最大是 $2\times10^{-16}$。

两个用哪个，看 twist 要写在哪里。IK 和 capstone 的 controller 比的是“当前 pose 和目标 pose 差多少”，这个差写在 end-effector frame 里最自然，用 $J_b$。

### Statics：$\tau=J^\top\mathcal F$，frame 要配对

静止时 joint 输出的 power 等于 end-effector 输出的 power：$\tau^\top\dot\theta=\mathcal F^\top\mathcal V=\mathcal F^\top J\dot\theta$ 对所有 $\dot\theta$ 成立，所以 $\tau=J^\top\mathcal F$。这里 $\mathcal F$ 和 $J$ 必须在同一个 frame。

让上面那个 3R 的 end-effector 托住 1 kg，向上推 10 N。在 $\{s\}$ 里，force 是 $f=(0,0,10)$，作用点 $p=(1.172,0.677,-0.354)$，对 $\{s\}$ origin 的 moment 是 $p\times f=(6.768,-11.722,0)$：

$$\tau=J_s^\top\begin{pmatrix}6.768\\-11.722\\0\\0\\0\\10\end{pmatrix}=\begin{pmatrix}0\\3.536\\0\end{pmatrix}\ \text{N·m}$$

逐个核对。Joint 1 的 axis 竖直，竖直的 force 对它没有 moment，0。Joint 3 的 axis 穿过 force 的作用点，moment arm 是 0。Joint 2：axis 方向 $\omega_2=(0.5,-0.866,0)$、过 $q_2=(0.866,0.5,0)$，torque 是 $\omega_2\cdot\big((p-q_2)\times f\big)$，

$$(p-q_2)\times f=(0.306,0.177,-0.354)\times(0,0,10)=(1.768,-3.06,0),\qquad\omega_2\cdot(1.768,-3.06,0)=0.884+2.65=3.535$$

（与 3.536 的差是四舍五入。）改用 $J_b^\top\mathcal F_b$，其中 $\mathcal F_b=[\mathrm{Ad}_{T_{sb}}]^\top\mathcal F_s$，得到同样的 $(0,3.536,0)$。

:::wrong Wrench 写成 end-effector 处的“moment 和 force”，配哪个 Jacobian 都行
在 end-effector 的作用点上，moment 是 0，force 是 $(0,0,10)$。把 $(0,0,0,\ 0,0,10)$ 直接配 $J_s$，得到 $\tau=10\times(J_s\text{ 的第 6 个 row})=(0,-10,0)$，和正确的 $(0,3.536,0)$ 连 sign 都不同。$J_s$ 给出的 twist 以 $\{s\}$ 的 origin 为参考点，配的 wrench 的 moment 也必须对 $\{s\}$ 的 origin 取。要用“作用点处的 moment 和 force”，就把它当作一个 frame 在作用点、axis 与 $\{s\}$ 平行的 wrench，先用 $[\mathrm{Ad}]^\top$ 换过来。
:::

### Numerical IK：error 是一个 twist

给定目标 $T_{sd}$，求 $\theta$。没有 closed form 时用 Newton–Raphson：在当前猜测 $\theta^i$ 处，问 end-effector 要以什么 twist 走单位时间才能从 $T_{sb}(\theta^i)$ 到 $T_{sd}$。这就是上一站的 logarithm：

$$[\mathcal V_b]=\log\big(T_{sb}^{-1}(\theta^i)\,T_{sd}\big)$$

然后用 Jacobian 把它换成 joint 的增量，$\theta^{i+1}=\theta^i+J_b^\dagger(\theta^i)\,\mathcal V_b$，直到 $\|\omega_b\|<\epsilon_\omega$ 且 $\|v_b\|<\epsilon_v$。（$J^\dagger$ 是 pseudoinverse；Newton 法本身、它会落到哪一组解、接近 singularity 时怎么办，见 [RB2202](../courses/RB2202.html) 第 5 站。）

书上 Example 6.1：planar 2R，两根 link 都长 1 m，目标是 $\theta_d=(30^\circ,90^\circ)$ 对应的 pose（tip 在 $(0.366,1.366)$，朝向 120°），从 $\theta^0=(0^\circ,30^\circ)$ 出发。Body form 的数据是 $M$ 的 translation $(2,0,0)$、$\mathcal B_1=(0,0,1,\ 0,2,0)$、$\mathcal B_2=(0,0,1,\ 0,1,0)$；tolerance 取 $\epsilon_\omega=0.001$ rad（0.057°）、$\epsilon_v=10^{-4}$ m（0.1 mm）。Planar 只列 $(\omega_{zb},v_{xb},v_{yb})$。实算：

| $i$ | $(\theta_1,\theta_2)$ | tip $(x,y)$ | $\mathcal V_b=(\omega_{zb},v_{xb},v_{yb})$ | $\lVert\omega_b\rVert$ | $\lVert v_b\rVert$ |
|---|---|---|---|---|---|
| 0 | $(0.00^\circ,\ 30.00^\circ)$ | $(1.866,\ 0.500)$ | $(1.571,\ 0.498,\ 1.858)$ | 1.571 | 1.924 |
| 1 | $(34.23^\circ,\ 79.18^\circ)$ | $(0.429,\ 1.480)$ | $(0.115,\ -0.074,\ 0.108)$ | 0.115 | 0.131 |
| 2 | $(29.98^\circ,\ 90.22^\circ)$ | $(0.363,\ 1.364)$ | $(-0.0035,\ 0.0003,\ -0.0035)$ | 0.0035 | 0.0035 |
| 3 | $(30.00^\circ,\ 90.00^\circ)$ | $(0.366,\ 1.366)$ | $(0.000,\ 0.000,\ 0.000)$ | 0.000 | 0.000 |

三步就到了 tolerance 以内，和书上的表一致（书上第 2 行四舍五入到三位，写作 $(-0.004,0.000,-0.004)$）。ME 449 Assignment 3 和 Coursera Course 2 的 project 要你把这张表的每一行（再加上 $T_{sb}(\theta^i)$）打印出来，见“作业”一节。

第 0 行有一个看起来不对的地方。目标 tip 在当前 tip 的左上方，从 $\{b\}$ 看大致在 $-\hat x_b$ 那一侧，$v_{xb}$ 却是正的。原因是 $\mathcal V_b$ 描述的是绕一个 screw center 转 90°，它并不朝目标走 straight line。由 $v=-\omega\times q$，在 $\{b\}$ 里 $q_b=(-v_{yb}/\omega,\ v_{xb}/\omega)=(-1.183,\ 0.317)$；换到 $\{s\}$：$\{b\}$ 的 origin 在 $(1.866,0.5)$、朝向 30°，

$$q_s=\begin{pmatrix}1.866\\0.5\end{pmatrix}+\begin{pmatrix}0.866&-0.5\\0.5&0.866\end{pmatrix}\begin{pmatrix}-1.183\\0.317\end{pmatrix}=\begin{pmatrix}0.683\\0.183\end{pmatrix}$$

核对：tip 相对 $q_s$ 的 offset 是 $(1.183,0.317)$，转 90° 得 $(-0.317,1.183)$，加回 $q_s$ 是 $(0.366,1.366)$，正是目标。

::fig[mr-iktwist] 彩色 arc 是 $\mathcal V_b$ 让 tool frame 在单位时间里走的路：绕 screw center 转 90°。起步时它先往右上方走，所以 $v_{xb}>0$。

:::wrong Error 就是 $T_{sd}-T_{sb}$，或者 position 和 angle 各自相减
$T_{sd}-T_{sb}(\theta^0)$ 的 rotation 部分是 $\begin{pmatrix}-1.366&-0.366\\0.366&-1.366\end{pmatrix}$。它不是 skew-symmetric matrix，不对应任何 angular velocity；把它当 velocity 去乘 Jacobian 的 inverse，单位和意义都对不上。两个 pose 之差要在 $SE(3)$ 上取，结果是一个 twist，这就是 $\log(T_{sb}^{-1}T_{sd})$ 的作用。Position 和 orientation 分开算 error 在 plane 里勉强可用，到三维里 orientation 没有可以相减的三个数（[RB2202](../courses/RB2202.html) 第 1 站讲了 Euler angles 在哪里坏掉）。
:::

:::edge Singularity 在 screw 语言里是什么
$J$ 的 rank 下降就是 singularity。Column 是当前的 screw axis，所以 singularity 就是几条 joint axis 的 screw 变得 linearly dependent。例如两条 revolute axis collinear 时 column 相同；三条 revolute axis parallel 且在同一个 plane 里，它们的 screw 也 dependent。Capstone 的 youBot arm 正好有后一种：joint 2、3、4 的 axis 互相 parallel，joint 3 为 0 时三条 axis 共面。实算 $\theta=(0,0.3,0,-1,0)$ 处 arm 的 $6\times5$ body Jacobian，第 5 个 singular value 是 0；把 $\theta_3$ 改成 0.2，它变成 0.0116。Capstone handout 建议把 joint 3、4 限制在 $-0.2$ 以下，理由就在这里。
:::

:::from
$J_s$ 与 $J_b$ 的定义和 column 公式、$J_s=[\mathrm{Ad}_{T_{sb}}]J_b$、$\tau=J^\top\mathcal F$ 由 power 守恒得到、singularity 的几种 axis 配置，来自 [Modern Robotics](https://hades.mech.northwestern.edu/images/2/25/MR-v2.pdf) 第 5.1 到 5.3 节；body twist 作 error 的 Newton–Raphson IK、“不能用 $T_{sd}-T_{sb}$”、Example 6.1 的表格和“$v_{xb}$ 为正”的说明，来自第 6.2 节（全文读过；Example 6.1 的表格对着书页核对过）。第 5.4 节 manipulability 指向了 RB2202，第 6.1 节 analytic IK 和 6.3 节 inverse velocity kinematics 这里没有写。$\dot TT^{-1}$ 三项相消的写法、3R 上的 Jacobian 与 statics 数字、screw center 的计算、youBot arm 的 singular value 是为这一页算的。
:::

## [closed] Closed chain：parallel mechanism 的 kinematics 与 singularity

:::skip
快速路线可以跳过整站（书第 7 章，约 1.5 小时）。ME 449 Fall 2026 的进度表不含第 7 章；Coursera Course 2 的第 4 个 module 讲这一章（一段 9 分钟的视频、一个 Lecture Comprehension 和一个 chapter quiz，没有 project）。要用 Delta、Stewart platform 这类 parallel robot，或者想弄清“actuator 全锁住了，mechanism 却还能动”是怎么回事，就读这一站。
:::

### Open chain 反过来：IK 容易，FK 难

第 1 站用 Grübler's formula 数过 four-bar、Delta robot 和 Stewart–Gough platform。它们都含有 loop，叫 closed chain。最常见的一类是 parallel mechanism：一块固定的 platform 和一块移动的 platform 由几条 leg 连起来，每条 leg 通常只有一个 joint 装 motor（actuated），其余 joint 是 passive 的。和 open chain 比，有两件事不同：不是每个 joint 都能直接指定，joint variable 之间还要满足 loop-closure equation。

先看最简单的一个：planar 3×RPR。三条 leg，每条是 revolute、prismatic、revolute，prismatic joint 装 motor，六个 revolute joint 都是 passive。取一组具体的尺寸：三个 base joint 在 $\{s\}$ 里的位置 $a_1=(0,0)$、$a_2=(2,0)$、$a_3=(1,1.8)$；platform 上的三个 joint 在 platform 的 frame $\{b\}$ 里的位置 $b_1=(-0.3,-0.15)$、$b_2=(0.3,-0.15)$、$b_3=(0,0.25)$。Platform 的 pose 是 $\{b\}$ 的 origin $p$ 和转角 $\phi$。

Leg $i$ 从 $a_i$ 指向 platform 上的 joint，这个 vector 是

$$d_i=p+R(\phi)\,b_i-a_i,\qquad R(\phi)=\begin{pmatrix}\cos\phi&-\sin\phi\\\sin\phi&\cos\phi\end{pmatrix}$$

leg 的长度 $s_i=\|d_i\|$ 就是 actuator 的读数。

**IK：给 pose 求 leg 长度。** 代进去算就行。取 $p=(1,0.7)$、$\phi=10^\circ$，三个长度是 $(0.885,\ 0.909,\ 0.855)$。每条 leg 各算各的，解唯一。

**FK：给 leg 长度求 pose。** 三个 unknown $(p_x,p_y,\phi)$，三个 equation $s_i^2=\|d_i\|^2$，但它们对 $\phi$ 是 trigonometric 的、对 $p$ 是 quadratic 的。先消掉 quadratic 的部分。记 $w_i=R(\phi)b_i-a_i$，展开

$$s_i^2=\|p+w_i\|^2=\|p\|^2+2p^\top w_i+\|w_i\|^2$$

第 2、3 个减去第 1 个，$\|p\|^2$ 消掉：

$$s_i^2-s_1^2=2p^\top(w_i-w_1)+\|w_i\|^2-\|w_1\|^2,\qquad i=2,3$$

$\phi$ 固定时这是 $p$ 的两个 linear equation，解出 $p(\phi)$。再代回第 1 个：

$$r(\phi)=\|p(\phi)+w_1(\phi)\|^2-s_1^2=0$$

只剩一个 unknown。让 $\phi$ 从 $-180^\circ$ 扫到 $180^\circ$，找 $r(\phi)$ 变号的地方，再用 bisection 求 root。

$s=(1,1,1)$ 时找到两个解：$\phi=47.56^\circ$、$p=(1.039,0.642)$，和 $\phi=-47.56^\circ$、$p=(0.961,0.642)$，互为镜像。$s=(1.879,0.419,1.868)$ 时找到四个解，$\phi$ 分别是 $-106.36^\circ$、$-23.31^\circ$、$21.87^\circ$、$99.87^\circ$。书上的做法是用 $t=\tan(\phi/2)$ 代换 $\sin\phi=\frac{2t}{1+t^2}$、$\cos\phi=\frac{1-t^2}{1+t^2}$，把 equation 化成 $t$ 的一个六次 polynomial，所以 3×RPR 至多有 6 个 FK 解。

::fig[mr-rprfk] 同一组 leg 长度对应几个 platform pose。左：$s=(1,1,1)$，两个镜像的解。右：$s=(1.879,0.419,1.868)$，四个解挤在 $a_2$ 附近，每个都把三条 leg 的长度精确对上。

:::wrong 读到每个 actuator 的位置，parallel robot 的 pose 就确定了，和 open chain 的 forward kinematics 一样
上面 $s=(1,1,1)$ 的两个解，platform 一个转了 $+47.56^\circ$，一个转了 $-47.56^\circ$，actuator 的读数完全相同。Controller 要靠“上一时刻在哪个解附近”来跟踪，开机时 platform 停在哪一支，单靠 encoder 判断不了。Open chain 正好相反：FK 唯一，IK 才有多个解。
:::

Stewart–Gough platform 是同一回事搬到空间里：六条 SPS leg，spherical joint 都是 passive，prismatic joint 装 motor。$d_i=p+Rb_i-a_i$，$s_i^2=d_i^\top d_i$，$i=1,\dots,6$。IK 照样是代进去算。FK 有六个 equation，unknown 是 $p$ 的 3 个数和 $R$ 的 9 个数，再加上 $R^\top R=I$ 的 6 个 constraint，凑成 12 个 equation、12 个 unknown。书上说一般的 6-6 platform 至多 40 个 FK 解（Raghavan 与 Roth），Husty 给出了求出全部 40 个解的 algorithm。

一般的 parallel mechanism，leg 本身是 open chain。三条 leg 的 forward kinematics 分别是 $T_1(\theta)$、$T_2(\phi)$、$T_3(\psi)$，joint 个数 $m$、$n$、$p$。Loop closure 要求它们都等于 platform 的 pose：

$$T_1(\theta)=T_2(\phi),\qquad T_2(\phi)=T_3(\psi)$$

每个 matrix equation 有 12 个数，其中 rotation 的 9 个只有 3 个独立，所以每个给出 6 个独立的 equation，一共 12 个。Dof 是 $m+n+p-12$。三条 leg 各 5 个 joint 时是 3 个 dof。

### Velocity：先做 statics 更省事

Open chain 的 Jacobian 由 forward kinematics 求 derivative 得到。Stewart platform 的 forward kinematics 写不出 closed form，可 IK 有：$s=g(R,p)$。对它求 derivative 得到 $\dot s=J_s^{-1}\mathcal V_s$ 是可以的，但 algebra 很繁。书上换了一条路：先求 statics，再用 power 守恒反推 velocity。

每条 leg 两端都是不能传 moment 的 joint（spherical 或 revolute），所以 leg 对 platform 的 force 只能沿着 leg 本身。记 leg $i$ 的单位方向为 $\hat n_i$（从 base 指向 platform），actuator 的推力为 $\tau_i$，force 就是 $f_i=\hat n_i\tau_i$。它对 $\{s\}$ origin 的 moment 是 $r_i\times f_i$，$r_i$ 可以取 force 作用线上任何一点。取 base 上那个固定的 joint $q_i=a_i$ 最方便，因为它不随 pose 变。六条（planar 时三条）加起来：

$$\mathcal F_s=\sum_i\begin{pmatrix}q_i\times\hat n_i\\\hat n_i\end{pmatrix}\tau_i=\underbrace{\begin{pmatrix}q_1\times\hat n_1&\cdots\\\hat n_1&\cdots\end{pmatrix}}_{J_s^{-\top}}\tau$$

Actuator 输出的 power 等于 platform 得到的 power：$\tau^\top\dot s=\mathcal F_s^\top\mathcal V_s=\tau^\top J_s^{-1}\mathcal V_s$，对所有 $\tau$ 成立，所以

$$\dot s=J_s^{-1}\mathcal V_s,\qquad J_s^{-1}\text{ 的第 }i\text{ 个 row}=\big((q_i\times\hat n_i)^\top,\ \hat n_i^\top\big)$$

和第 4 站的 $\tau=J^\top\mathcal F$ 是同一个关系，只是这里先得到的是 $J^{-\top}$。

在上面 $s=(1,1,1)$、$\phi=47.56^\circ$ 的那个解上用一次。三个 platform joint 在 $\{s\}$ 里的位置 $B_i=p+Rb_i$ 和 leg 方向是

| leg | $a_i$ | $B_i$ | $\hat n_i$ | $(q_i\times\hat n_i)_z$ |
|---|---|---|---|---|
| 1 | $(0,0)$ | $(0.948,0.319)$ | $(0.948,0.319)$ | $0$ |
| 2 | $(2,0)$ | $(1.353,0.762)$ | $(-0.648,0.762)$ | $2\times0.762=1.524$ |
| 3 | $(1,1.8)$ | $(0.855,0.811)$ | $(-0.145,-0.989)$ | $1\times(-0.989)-1.8\times(-0.145)=-0.728$ |

（三条 leg 长度都是 1，所以 $\hat n_i=B_i-a_i$。）Planar twist 写成 $(\omega,v_x,v_y)$：

$$J_s^{-1}=\begin{pmatrix}0&0.948&0.319\\1.524&-0.648&0.762\\-0.728&-0.145&-0.989\end{pmatrix}$$

让 platform 以 $\omega=0.5$ rad/s 转、origin 以 $\dot p=(0.1,0)$ m/s 移动。第 2 站说过 spatial twist 的 linear part 不是 $\dot p$：$v_s=\dot p-\omega\hat z\times p=(0.1,0)-0.5\,(-0.642,1.039)=(0.421,-0.520)$。于是

$$\dot s=J_s^{-1}\begin{pmatrix}0.5\\0.421\\-0.520\end{pmatrix}=\begin{pmatrix}0.233\\0.094\\0.089\end{pmatrix}\text{ m/s}$$

拿 IK 做 numerical derivative 核对（pose 沿这个 motion 挪 $10^{-6}$ s），三个数一致。

反过来用 statics。外界在 platform 的 origin 上施加 $(0,-10)$ N，三条 leg 要合起来给出 $\mathcal F_s=(p\times(0,10),\ 0,\ 10)=(10.39,0,10)$。$\tau=J_s^\top\mathcal F_s$，先对上面的 matrix 求 inverse 得 $J_s$，算出

$$\tau=(1.29,\ 3.46,\ -7.02)\text{ N}$$

代回 $J_s^{-\top}\tau$ 得到 $(10.39,0,10)$。Leg 3 是负的：它的 base 在上方，要把 platform 往上拉，受的是 tension。

### 一般的 parallel mechanism：passive joint 的 velocity 也要算

Stewart platform 的每条 leg 是一根直线，force 方向一眼看得出。Leg 是一般的 open chain 时，statics 不再好用，要直接处理 loop closure。

用一个 planar five-bar 来走一遍。Base 上两个 joint $A_1=(0,0)$、$A_2=(1,0)$，四根 link 都长 1。左 leg 的两个 joint 角是 $\theta_1$（actuated）、$\theta_2$（passive），右 leg 是 $\varphi_1$（actuated）、$\varphi_2$（passive），两条 leg 的末端用一个 revolute joint 连在一起，这一点 $P$ 是 end-effector。Loop closure 是两条 leg 算出的 $P$ 相同：

$$p_L(\theta_1,\theta_2)=p_R(\varphi_1,\varphi_2)$$

只有 position 的 2 个 equation，因为 $P$ 处是 revolute joint，两边的 orientation 不必相等。对 time 求 derivative，左右各是一个 2R 的 Jacobian（第 4 站：column $i$ 是 joint $i$ 单独以 1 rad/s 转时 $P$ 的 velocity，即 $\hat z\times(P-\text{joint }i\text{ 的位置})$）：

$$J_1(\theta)\begin{pmatrix}\dot\theta_1\\\dot\theta_2\end{pmatrix}=J_2(\varphi)\begin{pmatrix}\dot\varphi_1\\\dot\varphi_2\end{pmatrix}$$

把四个 joint 重新分成 actuated 的 $q_a=(\theta_1,\varphi_1)$ 和 passive 的 $q_p=(\theta_2,\varphi_2)$，移项：

$$H_a\dot q_a+H_p\dot q_p=0,\qquad H_a=\big[J_{1,1}\ \ {-J_{2,1}}\big],\quad H_p=\big[J_{1,2}\ \ {-J_{2,2}}\big]$$

（$J_{1,1}$ 是 $J_1$ 的第 1 个 column，其余类推。）$H_p$ invertible 时，passive joint 的 velocity 由 actuated joint 决定：

$$\dot q_p=-H_p^{-1}H_a\,\dot q_a$$

End-effector 的 Jacobian 对 actuated joint 写：沿左 leg 算 $P$ 的 velocity，$\dot\theta_1$ 就是 $\dot q_a$ 的第 1 个分量，$\dot\theta_2$ 用上式的第 1 个 row $g_2^\top$ 表示：

$$\dot P=J_1\begin{pmatrix}\dot\theta_1\\\dot\theta_2\end{pmatrix}=J_1\begin{pmatrix}1&0\\&g_2^\top\end{pmatrix}\dot q_a=J_a\,\dot q_a$$

取 $\theta_1=100^\circ$、$\varphi_1=80^\circ$。两个 elbow 在 $E_1=(-0.174,0.985)$、$E_2=(1.174,0.985)$，相距 1.347；$P$ 到两个 elbow 的距离都是 1，所以在两者中垂线上：$P=(0.5,\ 0.985+\sqrt{1-0.674^2})=(0.5,1.724)$。$\theta_2=-52.35^\circ$，$\varphi_2=52.35^\circ$。

$$J_1=\begin{pmatrix}-1.724&-0.739\\0.5&0.674\end{pmatrix},\qquad J_2=\begin{pmatrix}-1.724&-0.739\\-0.5&-0.674\end{pmatrix}$$

例如 $J_1$ 的第 1 个 column：$\hat z\times(P-A_1)=\hat z\times(0.5,1.724)=(-1.724,0.5)$。于是

$$H_a=\begin{pmatrix}-1.724&1.724\\0.5&0.5\end{pmatrix},\quad H_p=\begin{pmatrix}-0.739&0.739\\0.674&0.674\end{pmatrix},\quad -H_p^{-1}H_a=\begin{pmatrix}-1.537&0.795\\0.795&-1.537\end{pmatrix}$$

第 1 个 row 就是 $g_2^\top=(-1.537,\ 0.795)$：

$$J_a=\begin{pmatrix}-1.724&-0.739\\0.5&0.674\end{pmatrix}\begin{pmatrix}1&0\\-1.537&0.795\end{pmatrix}=\begin{pmatrix}-0.588&-0.588\\-0.536&0.536\end{pmatrix}$$

用 FK（两个 circle 求交点）做 numerical derivative，两个 column 一致到第 4 位。两个 actuator 同向转（$\dot q_a=(1,1)$），$P$ 沿 $(-1.18,0)$ 往左平移；反向转（$(1,-1)$），$P$ 沿 $(0,-1.07)$ 往下走。

:::wrong 闭链的 Jacobian 就是拿一条 leg 的 open-chain Jacobian，只留 actuated joint 那一列
只留左 leg 的第 1 列，等于说 $\dot\theta_1=1$ 时 $P$ 的 velocity 是 $(-1.724,0.5)$。那是 $\theta_2$ 被锁住时的答案。实际上 $\theta_2$ 是 passive 的，它被右 leg 拖着以 $-1.537$ rad/s 转（$\varphi_1$ 不动时），$P$ 的 velocity 是 $J_a$ 的第 1 列 $(-0.588,-0.536)$，大小不到一半（0.80 对 1.79），方向也差了 $59^\circ$。Passive joint 不会自己待着不动，它们的 velocity 必须从 loop closure 解出来。
:::

### 三种 singularity

Open chain 只有一种 singularity：Jacobian 掉 rank。Closed chain 有三种，分别看 $H_p$、$H$ 和 $J_a$。

**Actuator singularity：$\operatorname{rank}H_p$ 不满。** 让 five-bar 的两个 actuator 对称地往外转：$\theta_1=90^\circ+\alpha$、$\varphi_1=90^\circ-\alpha$。$\dot q_a=(1,-1)$ rad/s 时，passive joint 的 speed 是

| $\alpha$ | $0^\circ$ | $10^\circ$ | $20^\circ$ | $25^\circ$ | $28^\circ$ | $29.5^\circ$ | $30^\circ$ |
|---|---|---|---|---|---|---|---|
| $P$ 的高度 | 1.866 | 1.724 | 1.479 | 1.292 | 1.128 | 0.993 | 0.866 |
| $\lvert\det H_p\rvert$ | 0.866 | 0.996 | 0.908 | 0.712 | 0.475 | 0.244 | 0 |
| $\lvert\dot\theta_2\rvert=\lvert\dot\varphi_2\rvert$（rad/s） | 2.15 | 2.33 | 2.74 | 3.35 | 4.60 | 8.08 | $\infty$ |

$\alpha=30^\circ$ 时两个 elbow 在 $(-0.5,0.866)$ 和 $(1.5,0.866)$，相距正好 2，两根 distal link 连成一条水平线，$P=(0.5,0.866)$。$H_p$ 的两个 column 是两根 distal link 的垂直方向，此时 parallel，$\det H_p=0$。这时再往外转，两根 link 会被拉断；往里转，$P$ 要么往上鼓、要么往下凹，由不得 actuator。这叫 nondegenerate actuator singularity。另一种是 degenerate 的：$\theta_1=60^\circ$、$\varphi_1=120^\circ$ 时两个 elbow 重合在 $(0.5,0.866)$，两个 actuator 都锁住，$P$ 仍能绕这个共同的 elbow 转一整圈，mechanism 不再是 rigid 的。两种情况都只和“哪两个 joint 装 motor”有关：把其中一个 motor 挪到 passive joint 上，singularity 就没了。

::fig[mr-fivebar] 两个 actuator 对称往外转（左右的彩色弧），$P$ 一路下降。灰色虚线是 $\alpha=30^\circ$ 的 actuator singularity：两根 distal link 拉成一条直线。下方的数字是 $\dot q_a=(1,-1)$ 时 passive joint 的 speed，越接近虚线越大。

**Configuration space singularity：$\operatorname{rank}H$ 不满。** $H=[H_a\ H_p]$ 不分 actuated 与 passive。它掉 rank 时，C-space 这个 surface 自己和自己相交，无论 motor 装在哪个 joint 上，那里都是 actuator singularity。上面这组 five-bar 的长度没有这种点：在整个 C-space 里撒点实算，$H$ 的第二个 singular value 最小是 0.68。它要特殊的 link 长度，书上的例子是 four-bar（Figure 7.5）：左 ground joint 在 $O=(0,0)$，crank 长 $L_1=4$、转角 $\theta$；右 ground joint 在 $(2,0)$，rocker 长 $L_3=2$、转角 $\phi$；coupler 长 $L_2=4$；ground 长 $L_4=2$。Loop closure 只有一个 equation：

$$g(\theta,\phi)=\big\|L_1(\cos\theta,\sin\theta)-(2,0)-L_3(\cos\phi,\sin\phi)\big\|^2-L_2^2=0$$

在 $(\theta,\phi)=(0^\circ,180^\circ)$ 和 $(180^\circ,180^\circ)$，$g=0$ 而且两个 partial derivative 都是 0。看 mechanism 的样子就明白：$\phi=180^\circ$ 时 rocker 的端点落在 $O$ 上，coupler 和 crank 一样长，可以对折贴在 crank 上，端点不动，整个 crank 带着 coupler 绕 $O$ 转。所以 $\phi\equiv180^\circ$ 本身就是 C-space 里的一条 branch，它和另一条 branch 在这两个点相交。Mechanism 走到交点时，可以选任意一条 branch 继续走。

::fig[mr-fourbar] 右：four-bar 的 C-space，两条 branch 在两个 bifurcation point 相交，其中一条就是水平线 $\phi=180^\circ$。左：动图里 mechanism 沿弯曲的 branch 走到 $(0^\circ,180^\circ)$，再沿水平 branch 走开（coupler 对折在 crank 上，rocker 不动）。

**End-effector singularity：$\operatorname{rank}J_a$ 不满。** 不是 actuator singularity（$H_p$ invertible），但 end-effector 在某个方向上动不了。Five-bar 的右 leg 完全伸直时就是：$\varphi_1=120^\circ$、$\varphi_2=0$，$P=A_2+2(\cos120^\circ,\sin120^\circ)=(0,1.732)$，左 leg 取 $\theta_1=120^\circ$。此时 $\det H_p=-0.866$，但

$$J_a=\begin{pmatrix}-0.866&0\\-0.5&0\end{pmatrix}$$

rank 1。$P$ 只能沿 $(0.866,0.5)$ 动，也就是垂直于右 leg 的方向；沿右 leg 的方向（离开或靠近 $A_2$）完全动不了，和 open chain 的 2R 伸直时一样。这种 singularity 只和 end-effector 选在哪里有关，与 motor 装在哪个 joint 无关。

:::edge Grübler's formula 给的 dof 和 actuator 个数相等，也不保证每个 actuator 都能独立动
Five-bar 的 dof 是 $3(5-1-5)+5=2$，两个 actuator 正好。可在 $\alpha=30^\circ$ 那个 configuration，两个 actuator 已经不能各自随意转（往外转不可能），在 elbow 重合的 configuration，两个都锁住也锁不住 mechanism。Grübler's formula 只数 generic 的情形，singularity 正是不 generic 的地方。
:::

:::back
Grübler's formula 与 four-bar 来自[第 1 站](#cspace)，Jacobian 的 column 读法和 $\tau=J^\top\mathcal F$ 来自[第 4 站](#jac)。
:::

:::from
Closed chain 与 parallel mechanism 的定义、“parallel mechanism 的 IK 容易、FK 难”、3×RPR 的 equation (7.1)、(7.2) 与 tangent half-angle 代换（至多 6 个解）、Stewart–Gough platform 的 12 个 equation 与至多 40 个解、一般 parallel mechanism 的 $m+n+p-12$、Stewart platform 用 statics 求 $J_s^{-1}$ 的推导（$q_i\times\hat n_i$ 的取法）、$H_a\dot q_a+H_p\dot q_p=0$ 与 $J_a$ 的写法（7.12 到 7.21 式）、三种 singularity 的定义、five-bar 的 nondegenerate 与 degenerate actuator singularity、four-bar 的 bifurcation（Figure 7.5 的 $L_1=L_2=4$、$L_3=L_4=2$）、end-effector singularity，都来自 [Modern Robotics](https://hades.mech.northwestern.edu/images/2/25/MR-v2.pdf) 第 7 章（全文读过，Figure 7.5 那一页渲染成图片核对了 four-bar 的定义）。Coursera Course 2 第 4 个 module 的结构来自 [Course 2 课程页](https://www.coursera.org/learn/modernrobotics-course2)；那段 9 分钟的视频没有看。书上第 7 章没有数值例子：3×RPR 的尺寸与解、“消去 $\|p\|^2$ 再扫 $\phi$”的 FK 解法、statics 的数字、five-bar 的尺寸与 $J_a$、$\det H_p$ 的表、five-bar 没有 configuration space singularity 的实算、four-bar 两个 bifurcation point 的位置与“rocker 端点落在 $O$ 上”的解释，都是为这一页自己构造并用 Python 算的。
:::

## [dyn] Dynamics：Lagrangian、Newton–Euler 与 mass matrix

:::skip
快速路线可以跳过整站（书第 8 章，约 4 小时）：capstone 用 velocity 接口，用不到 torque。ME 449 Fall 2026 读 8.1 到 8.3 和 8.5，跳过 8.4、8.7 到 8.9；做 ME 449 Assignment 4、5 或 Coursera Course 3 的 project（UR5 在 gravity 下落下），以及读第 10 站的 force control 之前，要读这一站。站里标了 skip 的两个小节是 ME 449 跳过的内容。
:::

### 要什么：$\tau=M(\theta)\ddot\theta+h(\theta,\dot\theta)$

第 8 站的 computed torque control 要用 $M(\theta)$ 和 $h(\theta,\dot\theta)$；ME 449 Assignment 4 要在没有真 robot 的情况下，算出 UR5 松开 motor 后怎么落下。两件事都要 robot 的 equations of motion：

$$\tau=M(\theta)\ddot\theta+h(\theta,\dot\theta)$$

$M(\theta)$ 是 $n\times n$ 的 symmetric positive-definite mass matrix，$h$ 把 Coriolis、centripetal、gravity 和 friction 的 torque 合在一起。给 $(\theta,\dot\theta,\ddot\theta)$ 求 $\tau$ 叫 inverse dynamics；给 $(\theta,\dot\theta,\tau)$ 求 $\ddot\theta=M^{-1}(\tau-h)$ 叫 forward dynamics。推导有两条路：从 energy 出发的 Lagrangian formulation，和对每根 link 用 Newton、Euler 定律的 Newton–Euler formulation。两条路给出同一组 equation。

### Lagrangian：一个 2R 从头算到尾

选一组能完整描述 configuration 的独立 coordinate $q$（generalized coordinates），它们决定了 generalized force $f$：$f^\top\dot q$ 是 power。Lagrangian 是 kinetic energy 减 potential energy，$\mathcal L(q,\dot q)=\mathcal K-\mathcal P$，equations of motion 是

$$f=\frac{d}{dt}\frac{\partial\mathcal L}{\partial\dot q}-\frac{\partial\mathcal L}{\partial q}$$

先拿一个沿竖直线运动的 particle 核对：高度 $x$，向上推力 $f$。$\mathcal L=\tfrac12m\dot x^2-mgx$，$\frac{d}{dt}\frac{\partial\mathcal L}{\partial\dot x}=m\ddot x$，$\frac{\partial\mathcal L}{\partial x}=-mg$，所以 $f=m\ddot x+mg$，就是 $f-mg=m\ddot x$。

现在是书上 Figure 8.1 的 planar 2R：在竖直 plane 里，gravity 沿 $-\hat y$，两根 link 的 mass 集中在末端的 point mass 上。全站取 $L_1=L_2=1$ m、$m_1=m_2=1$ kg、$g=9.81$。Generalized coordinate 取 joint angle，generalized force 就是 joint torque。记 $s_1=\sin\theta_1$、$c_{12}=\cos(\theta_1+\theta_2)$，以此类推。

$m_1$ 在 $(L_1c_1,L_1s_1)$，speed 是 $L_1\dot\theta_1$，$\mathcal K_1=\tfrac12m_1L_1^2\dot\theta_1^2$。$m_2$ 在 $(L_1c_1+L_2c_{12},\ L_1s_1+L_2s_{12})$，对 time 求 derivative：

$$\dot x_2=-L_1s_1\dot\theta_1-L_2s_{12}(\dot\theta_1+\dot\theta_2),\qquad\dot y_2=L_1c_1\dot\theta_1+L_2c_{12}(\dot\theta_1+\dot\theta_2)$$

平方相加，交叉项里 $s_1s_{12}+c_1c_{12}=\cos(\theta_{12}-\theta_1)=c_2$：

$$\dot x_2^2+\dot y_2^2=L_1^2\dot\theta_1^2+2L_1L_2c_2\,\dot\theta_1(\dot\theta_1+\dot\theta_2)+L_2^2(\dot\theta_1+\dot\theta_2)^2$$

$\mathcal K_2$ 是它乘 $\tfrac12m_2$。Potential energy 是 $\mathcal P=m_1gL_1s_1+m_2g(L_1s_1+L_2s_{12})$。

**$\tau_2$。** $\mathcal K_1$ 不含 $\dot\theta_2$，

$$\frac{\partial\mathcal L}{\partial\dot\theta_2}=m_2\big[L_1L_2c_2\dot\theta_1+L_2^2(\dot\theta_1+\dot\theta_2)\big]$$

对 time 求 derivative（$c_2$ 也随 time 变，$\dot c_2=-s_2\dot\theta_2$）：

$$\frac{d}{dt}\frac{\partial\mathcal L}{\partial\dot\theta_2}=m_2\big[L_1L_2c_2\ddot\theta_1-L_1L_2s_2\dot\theta_1\dot\theta_2+L_2^2(\ddot\theta_1+\ddot\theta_2)\big]$$

$\mathcal K_2$ 通过 $c_2$ 依赖 $\theta_2$，$\mathcal P$ 通过 $s_{12}$ 依赖 $\theta_2$：

$$\frac{\partial\mathcal L}{\partial\theta_2}=-m_2L_1L_2s_2\,\dot\theta_1(\dot\theta_1+\dot\theta_2)-m_2gL_2c_{12}$$

相减，$\dot\theta_1\dot\theta_2$ 的两项抵消：

$$\tau_2=m_2(L_1L_2c_2+L_2^2)\ddot\theta_1+m_2L_2^2\ddot\theta_2+m_2L_1L_2s_2\dot\theta_1^2+m_2gL_2c_{12}$$

**$\tau_1$。** $\dot\theta_1(\dot\theta_1+\dot\theta_2)$ 对 $\dot\theta_1$ 的 derivative 是 $2\dot\theta_1+\dot\theta_2$：

$$\frac{\partial\mathcal L}{\partial\dot\theta_1}=m_1L_1^2\dot\theta_1+m_2\big[L_1^2\dot\theta_1+L_1L_2c_2(2\dot\theta_1+\dot\theta_2)+L_2^2(\dot\theta_1+\dot\theta_2)\big]$$

$$\frac{d}{dt}\frac{\partial\mathcal L}{\partial\dot\theta_1}=m_1L_1^2\ddot\theta_1+m_2\big[L_1^2\ddot\theta_1+L_1L_2c_2(2\ddot\theta_1+\ddot\theta_2)-L_1L_2s_2\dot\theta_2(2\dot\theta_1+\dot\theta_2)+L_2^2(\ddot\theta_1+\ddot\theta_2)\big]$$

$\mathcal K$ 不含 $\theta_1$，$\frac{\partial\mathcal L}{\partial\theta_1}=-(m_1+m_2)gL_1c_1-m_2gL_2c_{12}$。相减并按 $\ddot\theta$、velocity、gravity 归类：

$$\tau_1=\big[m_1L_1^2+m_2(L_1^2+2L_1L_2c_2+L_2^2)\big]\ddot\theta_1+m_2(L_1L_2c_2+L_2^2)\ddot\theta_2-m_2L_1L_2s_2(2\dot\theta_1\dot\theta_2+\dot\theta_2^2)+(m_1+m_2)gL_1c_1+m_2gL_2c_{12}$$

两个 equation 合起来写成 $\tau=M(\theta)\ddot\theta+c(\theta,\dot\theta)+g(\theta)$：

$$M=\begin{pmatrix}m_1L_1^2+m_2(L_1^2+2L_1L_2c_2+L_2^2)&m_2(L_1L_2c_2+L_2^2)\\m_2(L_1L_2c_2+L_2^2)&m_2L_2^2\end{pmatrix},\quad c=\begin{pmatrix}-m_2L_1L_2s_2(2\dot\theta_1\dot\theta_2+\dot\theta_2^2)\\m_2L_1L_2s_2\dot\theta_1^2\end{pmatrix},\quad g=\begin{pmatrix}(m_1+m_2)gL_1c_1+m_2gL_2c_{12}\\m_2gL_2c_{12}\end{pmatrix}$$

对 $\ddot\theta$ 是 linear，对 $\dot\theta$ 是 quadratic，对 $\theta$ 是 trigonometric；书上说只含 revolute joint 的 serial chain 都是这样。

代一组数。$\theta=(0^\circ,90^\circ)$、$\dot\theta=(1,1)$ rad/s、$\ddot\theta=(1,0)$ rad/s²：$c_2=0$、$s_2=1$、$c_1=1$、$c_{12}=0$，

$$M=\begin{pmatrix}3&1\\1&1\end{pmatrix},\quad c=\begin{pmatrix}-1\times(2+1)\\1\times1\end{pmatrix}=\begin{pmatrix}-3\\1\end{pmatrix},\quad g=\begin{pmatrix}2\times9.81\\0\end{pmatrix}=\begin{pmatrix}19.62\\0\end{pmatrix}$$

$$\tau=\begin{pmatrix}3\\1\end{pmatrix}+\begin{pmatrix}-3\\1\end{pmatrix}+\begin{pmatrix}19.62\\0\end{pmatrix}=\begin{pmatrix}19.62\\2\end{pmatrix}\text{ N·m}$$

MR code library 的 `InverseDynamics`（把两个 link frame 放在 point mass 上，spatial inertia 取 $\mathrm{diag}(0,0,0,1,1,1)$）给出同样的 $(19.62,2)$；`MassMatrix`、`VelQuadraticForces`、`GravityForces` 分别给出上面的 $M$、$c$、$g$。下面几节一直用这个 2R 和这组数。

### 速度项：$\ddot\theta=0$ 也要 torque

$\theta=(0^\circ,90^\circ)$ 时 $m_1$ 在 $(1,0)$，$m_2$ 在 $(1,1)$。令 $\ddot\theta=0$，对 $m_2$ 的位置求两次 derivative，acceleration 分成三份（书上 Figure 8.2）：

$$\begin{pmatrix}\ddot x_2\\\ddot y_2\end{pmatrix}=\underbrace{\begin{pmatrix}-L_1\dot\theta_1^2\\-L_2\dot\theta_1^2\end{pmatrix}}_{a_{\mathrm{cent1}}}+\underbrace{\begin{pmatrix}0\\-L_2\dot\theta_2^2\end{pmatrix}}_{a_{\mathrm{cent2}}}+\underbrace{\begin{pmatrix}0\\-2L_2\dot\theta_1\dot\theta_2\end{pmatrix}}_{a_{\mathrm{cor}}}$$

含 $\dot\theta_i^2$ 的叫 centripetal term，含 $\dot\theta_i\dot\theta_j$（$i\ne j$）的叫 Coriolis term。$a_{\mathrm{cent1}}=(-1,-1)$ 指向 joint 1，$a_{\mathrm{cent2}}=(0,-1)$ 指向 joint 2：要让 $m_2$ 绕那个 joint 走 circle，就得有指向 center 的 force，它的作用线穿过那个 joint，对那个 joint 不产生 moment。$a_{\mathrm{cor}}=(0,-2)$ 穿过 joint 2，对 joint 1 却有 moment。

$\dot\theta=(1,1)$ 时 $m_2$ 的 acceleration 合计 $(-1,-4)$，需要的 force 是 $m_2$ 乘它。$m_1$ 的 acceleration 是 $(-L_1\dot\theta_1^2,0)=(-1,0)$，沿着 link 1 指向 joint 1。对 joint 1 取 moment（$r\times f$ 的 $z$ component，$r_{12}=(1,1)$）：

$$\tau_1=\underbrace{(1,0)\times(-1,0)}_{0}+(1,1)\times(-1,-4)=1\times(-4)-1\times(-1)=-3$$

对 joint 2（$r_{22}=(0,1)$）：$(0,1)\times(-1,-4)=0\times(-4)-1\times(-1)=1$。正是 $c=(-3,1)$。

$\tau_1$ 为什么是负的：joint 2 往正向转，把 $m_2$ 拉向 joint 1，它对 joint 1 的 moment of inertia 在变小。Joint 1 要保持 $\dot\theta_1=1$ 不加速，就得往回拉；不拉的话 $\dot\theta_1$ 会像花样滑冰收拢手臂时那样自己变快。

::fig[mr-coriolis] $\theta=(0^\circ,90^\circ)$、$\dot\theta=(1,1)$、$\ddot\theta=0$ 时 $m_2$ 的三份 acceleration。两条 centripetal 分别指向 joint 1、joint 2；Coriolis 那条竖直向下，穿过 joint 2，从 joint 1 看是顺时针的 moment。

:::wrong Joint 以 constant speed 转、$\ddot\theta=0$，不计 gravity 就不需要 torque
只让 joint 1 以 1 rad/s 匀速转（$\dot\theta=(1,0)$），$\theta_2=90^\circ$。$c=(0,\ m_2L_1L_2s_2\dot\theta_1^2)=(0,1)$：joint 2 要一直出 1 N·m。$m_2$ 绕 joint 1 走 circle，需要指向 joint 1 的 centripetal force $(-1,-1)$；这个 force 的作用线不穿过 joint 2，对 joint 2 的 moment 是 $(0,1)\times(-1,-1)=1$。Link 2 是靠 joint 2 的 torque 才保持住 $90^\circ$ 的。“joint space 里不加速”不等于“mass 不加速”，因为 joint angle 不是 inertial frame 里的 coordinate。
:::

### Christoffel symbol：速度项全由 $M(\theta)$ 决定

一般的 $n$-joint open chain，kinetic energy 总能写成 $\mathcal K=\tfrac12\dot\theta^\top M(\theta)\dot\theta$（下面 Newton–Euler 那节会给出 $M$ 的构造）。代进 Euler–Lagrange equation：

$$\tau_i=\sum_jm_{ij}(\theta)\ddot\theta_j+\sum_{j,k}\Gamma_{ijk}(\theta)\dot\theta_j\dot\theta_k+\frac{\partial\mathcal P}{\partial\theta_i},\qquad\Gamma_{ijk}=\frac12\Big(\frac{\partial m_{ij}}{\partial\theta_k}+\frac{\partial m_{ik}}{\partial\theta_j}-\frac{\partial m_{jk}}{\partial\theta_i}\Big)$$

$\Gamma_{ijk}$ 叫 Christoffel symbols of the first kind。2R 上验证（取全站的单位数值，$M=\begin{pmatrix}3+2c_2&1+c_2\\1+c_2&1\end{pmatrix}$）：只有对 $\theta_2$ 的 derivative 不为零，$\partial m_{11}/\partial\theta_2=-2s_2$，$\partial m_{12}/\partial\theta_2=-s_2$。

$$\Gamma_{112}=\Gamma_{121}=\tfrac12\frac{\partial m_{11}}{\partial\theta_2}=-s_2,\quad\Gamma_{122}=\frac{\partial m_{12}}{\partial\theta_2}-\tfrac12\frac{\partial m_{22}}{\partial\theta_1}=-s_2,\quad\Gamma_{211}=-\tfrac12\frac{\partial m_{11}}{\partial\theta_2}=s_2$$

其余（$\Gamma_{111}$、$\Gamma_{212}$、$\Gamma_{221}$、$\Gamma_{222}$）是 0，例如 $\Gamma_{212}=\tfrac12(-s_2+0+s_2)=0$。于是 $c_1=\Gamma_{112}\dot\theta_1\dot\theta_2+\Gamma_{121}\dot\theta_2\dot\theta_1+\Gamma_{122}\dot\theta_2^2=-s_2(2\dot\theta_1\dot\theta_2+\dot\theta_2^2)$，$c_2=\Gamma_{211}\dot\theta_1^2=s_2\dot\theta_1^2$，和直接推的一样。

也常写成 $\tau=M\ddot\theta+C(\theta,\dot\theta)\dot\theta+g$，Coriolis matrix 的 entry 是 $c_{ij}=\sum_k\Gamma_{ijk}\dot\theta_k$。书上 Proposition 8.1：$\dot M-2C$ 是 skew-symmetric（第 8 站之后的 stability 证明要用）。2R 上：$C=\begin{pmatrix}-s_2\dot\theta_2&-s_2(\dot\theta_1+\dot\theta_2)\\s_2\dot\theta_1&0\end{pmatrix}$，$\dot M=\begin{pmatrix}-2s_2\dot\theta_2&-s_2\dot\theta_2\\-s_2\dot\theta_2&0\end{pmatrix}$，

$$\dot M-2C=\begin{pmatrix}0&s_2(2\dot\theta_1+\dot\theta_2)\\-s_2(2\dot\theta_1+\dot\theta_2)&0\end{pmatrix}$$

### Mass matrix 长什么样

Point mass 的 $f=ma$ 里，force 和 acceleration 同方向。$M(\theta)$ 不同：同样大小的 $\ddot\theta$，方向不同，要的 torque 大小不同，$\ddot\theta$ 一般也不平行于 $\tau$。把 unit circle $\{\ddot\theta:\|\ddot\theta\|=1\}$ 经 $M$ 映过去得到一个 ellipse，principal axis 沿 $M$ 的 eigenvector，半轴长是 eigenvalue。$\theta_2=90^\circ$ 时 $M=\begin{pmatrix}3&1\\1&1\end{pmatrix}$，eigenvalue 3.41 和 0.59；$\theta_2=150^\circ$ 时 $M=\begin{pmatrix}1.27&0.13\\0.13&1\end{pmatrix}$。

拿手握住 end-effector 推，感觉到的是 end-effector 处的 mass。Kinetic energy 和用什么 coordinate 写无关：$\tfrac12\dot\theta^\top M\dot\theta=\tfrac12\mathcal V^\top\Lambda\mathcal V$。代 $\dot\theta=J^{-1}\mathcal V$：

$$\mathcal V^\top\Lambda\mathcal V=(J^{-1}\mathcal V)^\top M(J^{-1}\mathcal V)\quad\Rightarrow\quad\Lambda(\theta)=J^{-\top}M(\theta)J^{-1}$$

$\theta=(0^\circ,90^\circ)$，tip velocity 的 Jacobian 是 $J=\begin{pmatrix}-s_1-s_{12}&-s_{12}\\c_1+c_{12}&c_{12}\end{pmatrix}=\begin{pmatrix}-1&-1\\1&0\end{pmatrix}$，实算 $\Lambda=\begin{pmatrix}1&0\\0&2\end{pmatrix}$。可以直接看出来：tip 沿 $\hat y$ 以 $v$ 动，解 $J\dot\theta=(0,v)$ 得 $\dot\theta=(v,-v)$，$m_1$ 也以 $v$ 沿 $\hat y$ 动，两个 mass 都要推，2 kg；tip 沿 $\hat x$ 动，$\dot\theta=(0,-v)$，$m_1$ 不动，只推 $m_2$，1 kg。$\theta_2=150^\circ$ 时

$$\Lambda=\begin{pmatrix}4&-1.73\\-1.73&2\end{pmatrix},\qquad\Lambda^{-1}=\begin{pmatrix}0.4&0.35\\0.35&0.8\end{pmatrix}$$

在 tip 上沿 $\hat x$ 推 1 N，tip 的 acceleration 是 $\Lambda^{-1}(1,0)=(0.4,0.35)$ m/s²，偏离 force 方向 $41^\circ$。这些 ellipse 只在 $\dot\theta=0$ 时有这个意义，动起来还有速度项。

::fig[mr-massell] 同一个 2R 在 $\theta_2=90^\circ$ 和 $150^\circ$。Tip 上的 ellipse 是 $\Lambda$ 把 unit acceleration 映成的 force：长轴方向推起来最“重”。右边那个，沿 $\hat x$ 推 1 N（黑色箭头），tip 朝 $(0.4,0.35)$ 加速（彩色箭头）。

### 一个 rigid body：Newton 加 Euler

Newton–Euler formulation 从单个 rigid body 开始。Body 由 point mass $m_i$ 组成，frame $\{b\}$ 放在 center of mass，$m_i$ 在 $\{b\}$ 里的位置 $r_i$ 满足 $\sum_im_ir_i=0$。Body 以 body twist $\mathcal V_b=(\omega_b,v_b)$ 运动。把 $\{b\}$ 此刻的位置当作一个 inertial frame，$m_i$ 的位置 $p_i(t)$ 此刻等于 $r_i$，

$$\dot p_i=v_b+\omega_b\times p_i,\qquad\ddot p_i=\dot v_b+\dot\omega_b\times p_i+\omega_b\times(v_b+\omega_b\times p_i)$$

代 $p_i=r_i$，用 skew-symmetric 记号：$\ddot p_i=\dot v_b+[\dot\omega_b]r_i+[\omega_b]v_b+[\omega_b]^2r_i$。

**Force。** $f_b=\sum_im_i\ddot p_i$。含 $r_i$ 的两项求和后是 $[\dot\omega_b]\sum m_ir_i$ 和 $[\omega_b]^2\sum m_ir_i$，都是 0：

$$f_b=m(\dot v_b+[\omega_b]v_b)$$

$v_b$ 是写在 body frame 里的 velocity。Body 转着时，$v_b$ 不变意味着 inertial frame 里的 velocity 在转向。例：3 kg 的 body 以 $v_b=(1,0,0)$ m/s、$\omega_b=(0,0,2)$ rad/s 运动，$\dot v_b=0$，$f_b=3\,(0,0,2)\times(1,0,0)=(0,6,0)$ N。它在走半径 $v/\omega=0.5$ m 的 circle，centripetal force $mv^2/r=3\times1/0.5=6$。

**Moment。** $m_b=\sum_i[r_i]m_i\ddot p_i$。含 $\dot v_b$ 和 $[\omega_b]v_b$ 的项提出 $\sum m_i[r_i]=0$，消掉。剩下 $\sum m_i[r_i]([\dot\omega_b]r_i+[\omega_b]^2r_i)$。用 $[a]b=-[b]a$ 把 $[\dot\omega_b]r_i$ 改写成 $-[r_i]\dot\omega_b$；第二项用书上的 identity $[r_i][\omega_b]^2r_i=-[\omega_b][r_i]^2\omega_b$。记 rotational inertia matrix $\mathcal I_b=-\sum_im_i[r_i]^2$：

$$m_b=\mathcal I_b\dot\omega_b+[\omega_b]\mathcal I_b\omega_b$$

这是 Euler's equation。$\mathcal I_b$ 的 entry 是 $I_{xx}=\sum m_i(y_i^2+z_i^2)$、$I_{xy}=-\sum m_ix_iy_i$ 等，连续 body 换成 volume integral。Frame 的 axis 沿 principal axes of inertia（$\mathcal I_b$ 的 eigenvector）时 $\mathcal I_b$ 是 diagonal，Euler's equation 写开是

$$m_b=\begin{pmatrix}I_{xx}\dot\omega_x+(I_{zz}-I_{yy})\omega_y\omega_z\\I_{yy}\dot\omega_y+(I_{xx}-I_{zz})\omega_x\omega_z\\I_{zz}\dot\omega_z+(I_{yy}-I_{xx})\omega_x\omega_y\end{pmatrix}$$

例：一块均匀的长方体，3 kg，沿 $\hat x_b,\hat y_b,\hat z_b$ 的边长 0.4、0.2、0.1 m。书上 Figure 8.5 的公式给出 $I_{xx}=m(w^2+h^2)/12=3\times0.05/12=0.0125$，$I_{yy}=3\times0.17/12=0.0425$，$I_{zz}=3\times0.2/12=0.05$（kg·m²）。让它绕 $(1,0,1)$ 方向以 constant $\omega_b=(3,0,3)$ rad/s 转，$\dot\omega_b=0$：

$$m_b=\begin{pmatrix}0\\(0.0125-0.05)\times3\times3\\0\end{pmatrix}=\begin{pmatrix}0\\-0.3375\\0\end{pmatrix}\text{ N·m}$$

角速度不变，却要一直施加 0.34 N·m 的 moment，而且这个 moment 跟着 body 一起转。原因是 $\mathcal I_b\omega_b=(0.0375,0,0.15)$ 和 $\omega_b$ 不平行：angular momentum 不在转轴上，随 body 转着，moment 就是它的变化率。绕 principal axis 转（比如 $\omega_b=(0,0,3)$）时 $[\omega_b]\mathcal I_b\omega_b=0$，不需要 moment。

::fig[mr-box] 长方体绕对角方向的 $\omega_b$ 匀速转（动图）。黑色箭头是 angular momentum $\mathcal I_b\omega_b$，偏向 $\hat z_b$；彩色箭头是必须施加的 moment $m_b$，沿 $-\hat y_b$，跟着 body 转。

**合成 6 维。** 两式拼起来，利用 $[v]v=0$ 和 $[v]^\top=-[v]$ 改写：

$$\begin{pmatrix}m_b\\f_b\end{pmatrix}=\begin{pmatrix}\mathcal I_b&0\\0&mI\end{pmatrix}\begin{pmatrix}\dot\omega_b\\\dot v_b\end{pmatrix}-\begin{pmatrix}[\omega_b]&0\\{[v_b]}&[\omega_b]\end{pmatrix}^{\!\top}\begin{pmatrix}\mathcal I_b&0\\0&mI\end{pmatrix}\begin{pmatrix}\omega_b\\v_b\end{pmatrix}$$

（第二项的 linear part 是 $-[\omega_b]^\top mv_b=m[\omega_b]v_b$；angular part 是 $-[\omega_b]^\top\mathcal I_b\omega_b-[v_b]^\top mv_b=[\omega_b]\mathcal I_b\omega_b+m[v_b]v_b$，后一项为 0。）记 spatial inertia matrix $\mathcal G_b=\mathrm{diag}(\mathcal I_b,mI)$、spatial momentum $\mathcal P_b=\mathcal G_b\mathcal V_b$，以及

$$[\mathrm{ad}_{\mathcal V}]=\begin{pmatrix}[\omega]&0\\{[v]}&[\omega]\end{pmatrix}$$

就是

$$\mathcal F_b=\mathcal G_b\dot{\mathcal V}_b-[\mathrm{ad}_{\mathcal V_b}]^\top\mathcal G_b\mathcal V_b$$

$[\mathrm{ad}_{\mathcal V_1}]\mathcal V_2$ 叫两个 twist 的 Lie bracket，它是 $[\mathcal V_1][\mathcal V_2]-[\mathcal V_2][\mathcal V_1]$ 这个 $4\times4$ matrix 对应的 6-vector，是 cross product $[\omega_1][\omega_2]-[\omega_2][\omega_1]=[\omega_1\times\omega_2]$ 在 twist 上的推广。拿上面那个 3 kg 的 body 核对，$\mathcal V_b=(0,0,2,\ 1,0,0)$：实算 $-[\mathrm{ad}_{\mathcal V_b}]^\top\mathcal G_b\mathcal V_b=(0,0,0,\ 0,6,0)$，正是 centripetal force。Kinetic energy 是 $\tfrac12\mathcal V_b^\top\mathcal G_b\mathcal V_b$；换到另一个 frame $\{a\}$，由 energy 不变得 $\mathcal G_a=[\mathrm{Ad}_{T_{ba}}]^\top\mathcal G_b[\mathrm{Ad}_{T_{ba}}]$，这是 parallel-axis theorem（Steiner's theorem，$\mathcal I_q=\mathcal I_b+m(q^\top qI-qq^\top)$）的推广。

### Newton–Euler inverse dynamics：往外传 velocity，往里传 force

每根 link $i$ 的 center of mass 上放一个 frame $\{i\}$，base 是 $\{0\}$，end-effector 是 $\{n+1\}$。Home configuration 时 $\{i-1\}$ 在 $\{i\}$ 里的 pose 记 $M_{i,i-1}$；joint $i$ 的 screw axis 写在 $\{i\}$ 里记 $\mathcal A_i=[\mathrm{Ad}_{M_i^{-1}}]\mathcal S_i$。Joint $i$ 转了 $\theta_i$ 后，$T_{i,i-1}=e^{-[\mathcal A_i]\theta_i}M_{i,i-1}$。

**Twist。** Link $i$ 的 twist 是 link $i-1$ 的 twist（换到 $\{i\}$ 里写）加上 joint $i$ 自己带来的：

$$\mathcal V_i=[\mathrm{Ad}_{T_{i,i-1}}]\mathcal V_{i-1}+\mathcal A_i\dot\theta_i$$

**Acceleration。** 对上式求 derivative，多出一项 $\frac{d}{dt}[\mathrm{Ad}_{T_{i,i-1}}]\,\mathcal V_{i-1}$。算它：$[\mathrm{Ad}_T]\mathcal V$ 对应 $T[\mathcal V]T^{-1}$，$\mathcal V$ 固定时对 time 求 derivative，

$$\frac{d}{dt}\big(T[\mathcal V]T^{-1}\big)=\dot TT^{-1}\,T[\mathcal V]T^{-1}-T[\mathcal V]T^{-1}\,\dot TT^{-1}$$

右边正是 Lie bracket 的形式：$\frac{d}{dt}[\mathrm{Ad}_T]\mathcal V=[\mathrm{ad}_{\mathcal W}][\mathrm{Ad}_T]\mathcal V$，$[\mathcal W]=\dot TT^{-1}$。这里 $T=T_{i,i-1}=e^{-[\mathcal A_i]\theta_i}M_{i,i-1}$，$\dot TT^{-1}=-[\mathcal A_i]\dot\theta_i$。所以

$$\frac{d}{dt}[\mathrm{Ad}_{T_{i,i-1}}]\mathcal V_{i-1}=-[\mathrm{ad}_{\mathcal A_i\dot\theta_i}]\big(\mathcal V_i-\mathcal A_i\dot\theta_i\big)=-[\mathrm{ad}_{\mathcal A_i\dot\theta_i}]\mathcal V_i=[\mathrm{ad}_{\mathcal V_i}]\mathcal A_i\dot\theta_i$$

（第二步用 $[\mathrm{ad}_{\mathcal A}]\mathcal A=0$，第三步用 Lie bracket 的反对称 $[\mathrm{ad}_{\mathcal V_1}]\mathcal V_2=-[\mathrm{ad}_{\mathcal V_2}]\mathcal V_1$。书上走的是把 $[\mathrm{Ad}]$ 拆成 $R$、$p$ 再用 Jacobi identity 的路，结论相同。）于是

$$\dot{\mathcal V}_i=[\mathrm{Ad}_{T_{i,i-1}}]\dot{\mathcal V}_{i-1}+[\mathrm{ad}_{\mathcal V_i}]\mathcal A_i\dot\theta_i+\mathcal A_i\ddot\theta_i$$

三项依次是：前一根 link 的 acceleration 换到 $\{i\}$ 里写；joint 带着 link $i$ 相对一个本身在动的 link $i-1$ 转所产生的 velocity-product 项；joint 自己的 acceleration。

**Wrench。** 作用在 link $i$ 上的总 wrench 等于 rigid-body dynamics 要的那个。它来自两处：joint $i$ 传进来的 $\mathcal F_i$，和 link $i+1$ 通过 joint $i+1$ 施加的反作用 $-[\mathrm{Ad}_{T_{i+1,i}}]^\top\mathcal F_{i+1}$。从末端往回解：

$$\mathcal F_i=[\mathrm{Ad}_{T_{i+1,i}}]^\top\mathcal F_{i+1}+\mathcal G_i\dot{\mathcal V}_i-[\mathrm{ad}_{\mathcal V_i}]^\top\mathcal G_i\mathcal V_i,\qquad\tau_i=\mathcal F_i^\top\mathcal A_i$$

$\mathcal F_{n+1}=\mathcal F_{\mathrm{tip}}$ 是 end-effector 对环境施加的 wrench。Joint 只有一个自由度，$\mathcal F_i$ 的另外五个方向由 joint 的结构承担，motor 只出沿 screw axis 的那一份。Gravity 不必单独处理：令 base 以 $\dot{\mathcal V}_0=(0,-\mathfrak g)$ 加速（$\mathfrak g$ 是 gravity vector），等于让每根 link 都“感到” gravity。

手算 2R 那组数：$\theta=(0^\circ,90^\circ)$、$\dot\theta=(1,1)$、$\ddot\theta=(1,0)$。$\{1\}$ 在 $m_1$、$\{2\}$ 在 $m_2$，home 时 $M_1=\mathrm{Trans}(1,0,0)$、$M_2=\mathrm{Trans}(2,0,0)$。两个 joint 的 axis 都在各自 frame 后方 1 m 处，$\mathcal A_1=\mathcal A_2=(0,0,1,\ 0,1,0)$。$\dot{\mathcal V}_0=(0,0,0,\ 0,9.81,0)$。$\{2\}$ 此刻转了 $90^\circ$：$\hat x_2$ 指向世界的 $+\hat y$，$\hat y_2$ 指向 $-\hat x$。

| 量 | 值 | 读法 |
|---|---|---|
| $\mathcal V_1$ | $(0,0,1,\ 0,1,0)$ | $m_1$ 以 1 m/s 向上 |
| $\dot{\mathcal V}_1$ | $(0,0,0,\ 0,9.81,0)+0+(0,0,1,\ 0,1,0)=(0,0,1,\ 0,10.81,0)$ | gravity 加 $\ddot\theta_1$ 带来的 1 m/s² |
| $\mathcal V_2$ | $(0,0,1,\ 1,1,0)+(0,0,1,\ 0,1,0)=(0,0,2,\ 1,2,0)$ | 世界里 $m_2$ 的 velocity $(-2,1)$，写在 $\{2\}$ 里是 $(1,2)$ |
| $\dot{\mathcal V}_2$ | $(0,0,1,\ 10.81,1,0)+(0,0,0,\ 0,-1,0)+0=(0,0,1,\ 10.81,0,0)$ | 中间那项是 velocity-product 项 |
| $\mathcal F_2$ | $0+(0,0,0,\ 10.81,0,0)+(0,0,0,\ -4,2,0)=(0,0,0,\ 6.81,2,0)$ | 第三项是 $m[\omega]v$：$2\hat z\times(1,2)=(-4,2)$ |
| $\tau_2$ | $\mathcal F_2^\top\mathcal A_2=0+2=2$ | |
| $\mathcal F_1$ | $(0,0,2,\ -2,6.81,0)+(0,0,0,\ 0,10.81,0)+(0,0,0,\ -1,0,0)=(0,0,2,\ -3,17.62,0)$ | 第一项是 $\mathcal F_2$ 搬到 $\{1\}$ |
| $\tau_1$ | $\mathcal F_1^\top\mathcal A_1=2+17.62=19.62$ | |

和 Lagrangian 的 $(19.62,2)$ 一致。几处可以对着物理看：$\mathcal F_2$ 的 force $(6.81,2)$ 换回世界是 $(-2,6.81)$，减掉“假想的” gravity 9.81，$m_2$ 的真实 acceleration 是 $(-2,-3)$；而 Lagrangian 那边 $\ddot\theta=(1,0)$ 带来 $(-1,1)$，加上前面算的速度项 $(-1,-4)$，也是 $(-2,-3)$。$[\mathrm{Ad}_{T_{21}}]^\top\mathcal F_2$ 的 moment 2 就是这个 force 对 $m_1$ 所在点的 moment：$(0,1)\times(-2,6.81)=2$。

### Forward dynamics：$M$ 用 $n$ 次 inverse dynamics 拼出来

Kinetic energy 是每根 link 的和：$\mathcal K=\tfrac12\sum_i\mathcal V_i^\top\mathcal G_i\mathcal V_i$。$\mathcal V_i=J_{ib}(\theta)\dot\theta$，$J_{ib}$ 是 $\{i\}$ 的 body Jacobian（后面补 0 凑成 $n$ 列），所以

$$M(\theta)=\sum_iJ_{ib}^\top(\theta)\,\mathcal G_iJ_{ib}(\theta)$$

这就是前面说的“$\mathcal K$ 总能写成 $\tfrac12\dot\theta^\top M\dot\theta$”的构造。2R 在 $\theta_2=90^\circ$：$J_{1b}$ 的列是 $(0,0,1,\ 0,1,0)$ 和 0，$J_{2b}$ 的列是 $(0,0,1,\ 1,1,0)$ 和 $(0,0,1,\ 0,1,0)$，$\mathcal G_i$ 只取 linear part，$J_{1b}^\top\mathcal G_1J_{1b}=\begin{pmatrix}1&0\\0&0\end{pmatrix}$，$J_{2b}^\top\mathcal G_2J_{2b}=\begin{pmatrix}2&1\\1&1\end{pmatrix}$，和是 $\begin{pmatrix}3&1\\1&1\end{pmatrix}$。

实际程序里更省事的办法是调用 inverse dynamics：令 $\mathfrak g=0$、$\dot\theta=0$、$\mathcal F_{\mathrm{tip}}=0$、$\ddot\theta=e_i$（第 $i$ 个分量为 1），返回的 $\tau$ 就是 $M$ 的第 $i$ 列；$h(\theta,\dot\theta)$ 是 $\ddot\theta=0$ 时的 inverse dynamics。然后解

$$M(\theta)\ddot\theta=\tau-h(\theta,\dot\theta)-J^\top(\theta)\mathcal F_{\mathrm{tip}}$$

MR library 的 `ForwardDynamics` 就是这样写的。

把 2R 摆到水平（$\theta=(0,0)$），静止，松开 motor（$\tau=0$）：

$$M=\begin{pmatrix}5&2\\2&1\end{pmatrix},\quad M^{-1}=\begin{pmatrix}1&-2\\-2&5\end{pmatrix},\quad h=g(\theta)=\begin{pmatrix}29.43\\9.81\end{pmatrix},\quad\ddot\theta=-M^{-1}h=\begin{pmatrix}-9.81\\9.81\end{pmatrix}$$

$\ddot\theta_1+\ddot\theta_2=0$：link 2 一开始不转，只是被 link 1 带着往下掉。Tip 的 acceleration 是 $J\ddot\theta$（$\dot\theta=0$ 时没有 $\dot J\dot\theta$），$J=\begin{pmatrix}0&0\\2&1\end{pmatrix}$，得 $(0,-9.81)$：$m_2$ 正好在 free fall。原因是 joint 2 不出 torque，massless 的 link 2 只能沿自己的方向（此刻水平）推拉 $m_2$，竖直方向上 $m_2$ 只受 gravity。

往后要做 numerical integration。最简单的是 first-order Euler：

$$\theta[k+1]=\theta[k]+\dot\theta[k]\,\Delta t,\qquad\dot\theta[k+1]=\dot\theta[k]+\ddot\theta[k]\,\Delta t$$

（MR library 的 `EulerStep`。）2R 落 3 秒，检查 total energy $E=\tfrac12\dot\theta^\top M\dot\theta+\mathcal P$，开始时是 0，应当一直是 0：

| $t$（s） | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 |
|---|---|---|---|---|---|---|
| $E$，$\Delta t=0.01$（J） | 0.57 | 1.61 | 2.18 | 2.73 | 3.84 | 4.59 |
| $E$，$\Delta t=0.001$（J） | 0.06 | 0.15 | 0.21 | 0.27 | 0.38 | 0.44 |

Energy 一直往上涨，$\Delta t$ 小十倍，涨得大约小十倍。为什么总是涨，看一个最简单的振荡：$\ddot x=-\omega^2x$。Euler step 是

$$\begin{pmatrix}x\\\dot x\end{pmatrix}_{k+1}=\begin{pmatrix}1&\Delta t\\-\omega^2\Delta t&1\end{pmatrix}\begin{pmatrix}x\\\dot x\end{pmatrix}_k$$

这个 matrix 的两个 eigenvalue 是 $1\pm j\omega\Delta t$，绝对值 $\sqrt{1+\omega^2\Delta t^2}>1$：每一步振幅都放大一点。没有 damping 的系统用 explicit Euler，energy 必然漂上去。书上建议用 fourth-order Runge–Kutta 这类 higher-order 的方法，同样的计算量误差小得多。

::fig[mr-falling] 左：2R 从水平松开后 3 秒的 motion（高精度 integration 算出，按真实时间播放）。右：两种 $\Delta t$ 的 Euler integration 算出的 total energy，本该是一条在 0 的水平线。

### Task space 的 dynamics

有时候想直接在 end-effector 的 coordinate 里写 dynamics（第 10 站的 force control 和 impedance control 要用）。$\mathcal V=J\dot\theta$，$\dot{\mathcal V}=\dot J\dot\theta+J\ddot\theta$。$J$ invertible 时 $\dot\theta=J^{-1}\mathcal V$、$\ddot\theta=J^{-1}\dot{\mathcal V}-J^{-1}\dot JJ^{-1}\mathcal V$，代进 $\tau=M\ddot\theta+h$，两边左乘 $J^{-\top}$，记 $\mathcal F=J^{-\top}\tau$：

$$\mathcal F=\Lambda(\theta)\dot{\mathcal V}+\eta(\theta,\mathcal V),\qquad\Lambda=J^{-\top}MJ^{-1},\qquad\eta=J^{-\top}h(\theta,J^{-1}\mathcal V)-\Lambda\dot JJ^{-1}\mathcal V$$

$\Lambda$ 就是上面的 end-effector mass matrix。它依赖 $\theta$ 而不只依赖 end-effector 的 pose：同一个 tip 位置可能对应几组 joint angle（elbow up、elbow down），dynamics 不同。例：2R 在 $\theta=(0^\circ,-90^\circ)$，tip 在 $(1,-1)$，静止。$J=\begin{pmatrix}1&1\\1&0\end{pmatrix}$，$\Lambda=\begin{pmatrix}1&0\\0&2\end{pmatrix}$，$\eta=J^{-\top}g(\theta)=\begin{pmatrix}0&1\\1&-1\end{pmatrix}\begin{pmatrix}19.62\\0\end{pmatrix}=\begin{pmatrix}0\\19.62\end{pmatrix}$：在 tip 上看，要用 19.62 N 向上托住两个 mass 的 weight。第 10 站会接着用这个 configuration。

### Constrained dynamics

:::skip
ME 449 跳过这一节（书 8.7 节）。跳过它，第 10 站的 hybrid motion–force control 里 projection matrix $P$ 的来历就要直接接受。
:::

Robot 的 end-effector 被环境约束时，比如握着门把手、拿笔在纸上写字，joint velocity 满足 $k$ 个 Pfaffian constraint $A(\theta)\dot\theta=0$（第 1 站）。假设 constraint 不做功（笔和纸之间没有 friction），constraint 施加的 generalized force $\tau_{\mathrm{con}}$ 对所有允许的 $\dot\theta$ 都有 $\tau_{\mathrm{con}}^\top\dot\theta=0$，所以它是 $A^\top$ 的 column 的 linear combination，$\tau_{\mathrm{con}}=A^\top\lambda$。Equations of motion 加上它：

$$\tau=M\ddot\theta+h+A^\top\lambda,\qquad A\dot\theta=0$$

$\lambda$ 是 Lagrange multiplier，$A^\top\lambda$ 是 robot 顶着 constraint 用掉的 joint torque。Constraint 时时成立，对 time 求 derivative：$\dot A\dot\theta+A\ddot\theta=0$。由第一式 $\ddot\theta=M^{-1}(\tau-h-A^\top\lambda)$，代入：

$$\dot A\dot\theta+AM^{-1}(\tau-h-A^\top\lambda)=0\quad\Rightarrow\quad\lambda=(AM^{-1}A^\top)^{-1}\big(AM^{-1}(\tau-h)+\dot A\dot\theta\big)$$

书上 Example 8.5：同一个 2R，$\mathfrak g=0$，tip 被约束在 $x=1$ 的一条无摩擦 channel 里。$x=c_1+c_{12}=1$，求 derivative 得 $A=\big(-s_1-s_{12},\ -s_{12}\big)$，$\dot A=\big(-\dot\theta_1c_1-(\dot\theta_1+\dot\theta_2)c_{12},\ -(\dot\theta_1+\dot\theta_2)c_{12}\big)$。此刻 $\theta=(-60^\circ,120^\circ)$，tip 以 $(0,1)$ m/s 往上走，即 $\dot\theta=(1,0)$：

$$A=(0,\ -0.866),\quad\dot A=(-1,\ -0.5),\quad M=\begin{pmatrix}2&0.5\\0.5&1\end{pmatrix},\quad h=\begin{pmatrix}0\\0.866\end{pmatrix}$$

代进去：

$$\lambda=0.289\tau_1-1.155\tau_2-0.167,\qquad\ddot\theta_1=0.5\tau_1+0.289,\qquad\ddot\theta_2=-1.155$$

$\ddot\theta_2$ 不管 $\tau$ 怎样都是 $-1.155$：channel 只留一个自由度，$\ddot\theta_2$ 被 $\ddot\theta_1$ 和 constraint 一起定死了，而此刻 $A$ 的第 1 个 entry 为 0，$\ddot\theta_2$ 恰好与 $\ddot\theta_1$ 无关。$\tau_2$ 只影响 $\lambda$，不影响 motion；满足 $0.289\tau_1-1.155\tau_2=0$ 的 $\tau$ 不影响 $\lambda$。任何 $\tau$ 都能拆成“只管 motion”和“只管 constraint force”两份：

$$P=I-A^\top(AM^{-1}A^\top)^{-1}AM^{-1}=\begin{pmatrix}1&0\\0.25&0\end{pmatrix},\qquad I-P=\begin{pmatrix}0&0\\-0.25&1\end{pmatrix}$$

$P\tau$ 是沿 constraint 的那一份，$(I-P)\tau$ 是顶着 constraint 的那一份。Tip 对 channel 的 force 由 $J^\top\mathcal F_{\mathrm{tip}}=A^\top\lambda$ 得 $\mathcal F_{\mathrm{tip}}=J^{-\top}A^\top\lambda=(\lambda,0)$，只有 $x$ 方向，符合 channel 只能挡 $x$ 方向的直觉。$\tau=0$ 时 $\lambda=-0.167$：tip 往左压 channel，没有 channel 的话 tip 会往左加速。

反过来做 constrained inverse dynamics：想让 tip 沿 channel 以某个 $\ddot\theta_1=a$ 运动、同时以 $f$ 顶 channel，

$$\tau_1=2a-0.577,\qquad\tau_2=0.5a-0.866f-0.289$$

$a$ 由 motion controller 定，$f$ 由 force controller 定。这就是第 10 站 hybrid control 的雏形。

::fig[mr-channel] Example 8.5：tip 被关在 $x=1$ 的 channel 里，以 1 m/s 往上走。$\tau=0$ 时 tip 压向 channel 左壁的 force 是 0.167 N（彩色箭头）。

:::back
Twist、$[\mathrm{Ad}]$ 来自[第 2 站](#twist)，body Jacobian 来自[第 4 站](#jac)，Pfaffian constraint 来自[第 1 站](#cspace)。
:::

:::from
$\tau=M\ddot\theta+h$ 与 forward/inverse dynamics 的区分、Euler–Lagrange equation、竖直 particle 的例子、2R point-mass arm 的 Lagrangian 推导与 (8.9)、(8.10) 式、centripetal 与 Coriolis 的分解和 Figure 8.2 的解释（花样滑冰的比喻是书上的）、Christoffel symbols 与 Proposition 8.1、mass matrix ellipsoid 与 $\Lambda=J^{-\top}MJ^{-1}$（Figure 8.3、8.4 的四个 matrix 和 $(0.4,0.35)$）、单个 rigid body 的推导（8.22 到 8.25 式）、Figure 8.5 的长方体公式、spatial inertia、Lie bracket、$\mathcal G_a$ 与 Steiner's theorem、Newton–Euler 的 forward 与 backward iteration（8.50 到 8.54 式）、gravity 当作 base acceleration、$M=\sum J_{ib}^\top\mathcal G_iJ_{ib}$、用 $n$ 次 inverse dynamics 拼 $M$、Euler integration 与 Runge–Kutta 的建议、task-space dynamics（8.89 到 8.91 式）、constrained dynamics 与 Example 8.5 的全部数值，都来自 [Modern Robotics](https://hades.mech.northwestern.edu/images/2/25/MR-v2.pdf) 第 8.1 到 8.7 节（全文读过；Example 8.5 的 $\lambda$、$\ddot\theta$、$P$、$\tau$ 用 Python 重算过一遍）。2R 的 $\tau_1$、$\tau_2$ 书上说“omit the detailed calculations”，这里逐步补全；$\theta=(0^\circ,90^\circ)$ 的数值例子、$c$ 用 $r\times f$ 的核对、constant speed 也要 torque 的反例、Christoffel symbol 与 $\dot M-2C$ 在 2R 上的验证、长方体的数字与 3 kg body 的 centripetal 例子、$\frac{d}{dt}[\mathrm{Ad}_T]$ 用 Lie bracket 的推法（书上走 $R$、$p$ 拆开的路）、Newton–Euler 的手算表、$M$ 的 $\sum J^\top\mathcal G J$ 核对、水平松开时 $m_2$ free fall 的分析、energy drift 的表与 $\sqrt{1+\omega^2\Delta t^2}$ 的解释、$\theta=(0,-90^\circ)$ 的 $\Lambda$ 与 $\eta$，是为这一页算的或自己推的，数值都用 MR library（`InverseDynamics`、`MassMatrix`、`ForwardDynamics`、`EulerStep`）核对过。书上 8.4 节的 stacked closed form（$\mathcal W$、$\mathcal L$ matrix）、8.8 节 URDF 的 inertial element、8.9 节 motor、gearing、apparent inertia 与 friction 没有写，ME 449 也跳过这几节。
:::

## [plan] Motion planning：C-obstacle 与 sampling-based planner

:::skip
快速路线可以跳过整站（书第 10 章）；做 Coursera Course 4 的两个 project 时回来读。这一站讲 C-obstacle、completeness、grid 与 sampling-based planner、virtual potential field；书上 10.3 节的 complete planner、10.4.2 节带 motion constraint 的 grid、10.7 节的 nonlinear optimization 和 10.8 节的 smoothing 没有写。ME 449 Fall 2026 的进度表不含第 10 章。
:::

### Planning 发生在 C-space 里

Motion planning 问：从 $q_{\mathrm{start}}$ 到 $q_{\mathrm{goal}}$，有没有一条 path 全程不碰 obstacle、不超 joint limit？把 robot 碰到 obstacle 的 configuration 全部收起来，叫 C-obstacle $\mathcal C_{\mathrm{obs}}$；剩下的叫 $\mathcal C_{\mathrm{free}}$。Joint limit 也当作 C-obstacle。这样一来，不管 robot 长什么样，问题都变成同一个：在 $\mathcal C_{\mathrm{free}}$ 里把两个点连起来。

第 1 站的图右半边就是一个 C-obstacle。检查一个点的办法是把 configuration 代回 workspace 算几何。以 start $(-60^\circ,60^\circ)$ 为例：link 1 从 $(0,0)$ 到 $(0.5,-0.866)$，link 2 方向 $-60^\circ+60^\circ=0^\circ$，从 $(0.5,-0.866)$ 到 $(1.5,-0.866)$。Obstacle A 的圆心 $(0.6,0)$ 在 link 1 方向上的投影是 $0.6\times0.5=0.3$，最近点 $(0.15,-0.26)$，距离 $\sqrt{0.45^2+0.26^2}=0.52$；到 link 2（直线 $y=-0.866$）的距离是 0.866。都大于半径 0.15，这个 configuration 在 $\mathcal C_{\mathrm{free}}$ 里。

C-obstacle 有时能直接构造。在 plane 里 translate 的 circular robot（radius $r$），它的 configuration 是 center 的位置；center 离 obstacle 不到 $r$ 就碰。所以把每个 obstacle 向外长 $r$，robot 缩成一个点，问题不变。Coursera 的 sampling-based planning project 正是这样设定的：obstacle 是半径 $R$ 的 circle，robot 是点，相当于原来半径 $r$ 的 robot 配上半径 $R+r$ 的 obstacle。会转动的 robot，C-space 多一个 $S^1$，C-obstacle 是一摞随 orientation 变化的二维切片，就不再能一眼画出来了。

### Grid：resolution complete，但维数一高就做不动

对 planner 的保证分三档。**Complete**：有 path 时一定在有限时间里找到，没有时报告没有。**Resolution complete**：在给定的离散 resolution 下做到 complete。**Probabilistically complete**：有 path 时，找到它的 probability 随时间趋于 1。

Grid 加 A* search 是 resolution complete 的。代价是 cell 的个数。第 1 站的 2R 用 2° 的 grid，每个 joint 180 格，共 $180^2=32{,}400$ 个 cell，每个 cell 做一次 collision check，很快。6-dof arm 用同样的 resolution 是 $180^6=3.4\times10^{13}$ 个 cell，存不下也查不完。书上说 grid 方法“超过几个 dof 就不实际”，就是这个数。

### Sampling-based planner：不铺满，只撒点

不把 C-space 全部离散。随机撒 sample，只在撒到的点和它们之间的 segment 上做 collision check。需要两个 primitive：collision check（一个点、一段 segment 碰不碰），和 local planner（两个点之间怎么走，kinematic robot 就走直线）。

**PRM（probabilistic roadmap）。** 先建 roadmap：在 $\mathcal C_{\mathrm{free}}$ 里取 $N$ 个 sample；对每个 sample 找最近的 $k$ 个，用 local planner 连接，segment 不碰就加一条 edge。查询时把 start 和 goal 接到 roadmap 上最近的 node，在 graph 上跑 A*。Roadmap 建一次，可以回答很多次查询。

**RRT（rapidly-exploring random tree）。** 从 start 长一棵 tree。每一轮：取一个 sample $x_{\mathrm{samp}}$（偶尔直接取 goal）；在 tree 里找离它最近的 node $x_{\mathrm{nearest}}$；从 $x_{\mathrm{nearest}}$ 朝 $x_{\mathrm{samp}}$ 走一小步 $d$，得到 $x_{\mathrm{new}}$；segment 不碰就把 $x_{\mathrm{new}}$ 加进 tree，parent 是 $x_{\mathrm{nearest}}$。$x_{\mathrm{new}}$ 到达 goal 就沿 parent 回溯出 path。

手算一轮。Tree 里只有 start $(-0.5,-0.5)$，$d=0.1$，sample 是 $(0.3,-0.1)$。

$$x_{\mathrm{samp}}-x_{\mathrm{nearest}}=(0.8,\ 0.4),\qquad\|(0.8,0.4)\|=0.894,\qquad x_{\mathrm{new}}=(-0.5,-0.5)+\frac{0.1}{0.894}(0.8,0.4)=(-0.411,\ -0.455)$$

然后检查从 $(-0.5,-0.5)$ 到 $(-0.411,-0.455)$ 的 segment 碰不碰 obstacle。

::fig[mr-rrt] 在 $[-0.5,0.5]^2$ 里有七个圆形 obstacle 的 RRT，goal bias 10%，$d=0.1$。第一帧是最终结果；之后从空 tree 开始一轮一轮重放：小圆圈是这一轮的 sample，虚线连到 tree 里最近的 node，彩色短线是加进 tree 的一步，黑色短线是碰到 obstacle 被丢掉的一步。这次撒到第 67 个 node 时到达 goal。

RRT 偏爱往大片空白处长。书上 Figure 10.17 对比了两种长法：每次随机挑一个 node、朝随机方向走一步，2000 个 node 后 tree 还挤在 start 附近；RRT 的 sample 在整个 space 里均匀撒，每个 sample 都把离它最近的 node 往自己那边“拉”，tree 很快铺满 free space。换一种说法（这是自己的解释，书上没有这样讲）：一个 node 被选为 nearest 的 probability，正比于离它最近的那一块区域（Voronoi region）的面积，tree 边缘的 node 拥有的区域最大。

“最近”要有 distance。$\mathbb R^n$ 里用 Euclidean distance；C-space 混着 angle 和长度、或者 robot 不能横着走时，就没有自然的选择。书上的例子（Figure 10.18）：一辆车，三个候选 configuration 分别是原地转了 20°、正后方 2 m、正侧方 1 m，哪个“最近”？车不能原地转也不能横移，正后方 2 m 的那个反而最容易开到 sample。常用的折中是各 component 加权求和；node 多了以后用 kd-tree 之类的结构加速 nearest-neighbor 查询。它找到的 path 是第一条，不是最短的。书上介绍了两个改进：bidirectional RRT 从 start 和 goal 各长一棵 tree，两棵足够接近时连起来；RRT* 在加 node 时从附近的 node 里挑总 cost 最小的当 parent，并检查附近的 node 改走新 node 是否更短，sample 越多 path 越接近 optimal。

### Collision check：segment 与 circle

Point robot、circular obstacle 时，segment $A\to B$ 碰不碰 center 为 $C$、radius 为 $R$ 的 obstacle？把 segment 写成 $P(t)=A+t(B-A)$，$t\in[0,1]$，代进 $\|P(t)-C\|^2=R^2$：

$$at^2+bt+c=0,\qquad a=\|B-A\|^2,\quad b=2(A-C)\cdot(B-A),\quad c=\|A-C\|^2-R^2$$

没有 real root，整条 line 都不碰；有 root，还要看 root 落不落在 $[0,1]$ 里。

:::wrong 求出 line 和 circle 有交点，这段 segment 就碰了
Obstacle 的 center 在 origin、radius 0.13，segment 从 $A=(0.2,0.05)$ 到 $B=(0.4,0.05)$。$a=0.04$，$b=2(0.2\times0.2+0.05\times0)=0.08$，$c=0.0425-0.0169=0.0256$。Discriminant 是 $0.0064-4\times0.04\times0.0256=0.0023>0$，line 确实穿过 circle，交点在 $x=\pm0.12$。可两个 root 是 $t=\dfrac{-0.08\pm0.048}{0.08}=-0.4,\ -1.6$，都在 $[0,1]$ 外：交点在 $A$ 的后方，segment 本身离 circle 还远。只看 discriminant 的 planner 会把这条可行的 edge 扔掉；在 PRM 里扔掉的 edge 多了，start 和 goal 就连不到一起。Sampling-based planning project 的 handout 把“忘了检查交点是否在 segment 内”列为常见错误。另一种情况也要处理：segment 整个落在 circle 里面时两个 root 一个小于 0、一个大于 1，它碰了。
:::

::fig[mr-segcircle] 只看 discriminant 会认为它碰了；看 root 落在哪里才知道没有。

### Virtual potential field：不规划，直接跟着 gradient 走

Grid 和 sampling 都要先把整条 path 算出来再走。Obstacle 在动、或者传感器刚看到一个新的 obstacle 时，来不及重新规划。Potential field 换一个思路：给每个 configuration 一个 potential $\mathcal P(q)$，goal 处最低，obstacle 附近很高，robot 每一刻只沿 $-\partial\mathcal P/\partial q$ 走。Gradient 算起来快，可以每个 control cycle 算一次。

Goal 的 potential 是一个以 goal 为底的 quadratic bowl，$K$ 是 symmetric positive-definite 的 matrix：

$$\mathcal P_{\mathrm{goal}}(q)=\tfrac12(q-q_{\mathrm{goal}})^\top K(q-q_{\mathrm{goal}}),\qquad F_{\mathrm{goal}}(q)=-\frac{\partial\mathcal P_{\mathrm{goal}}}{\partial q}=K(q_{\mathrm{goal}}-q)$$

离 goal 越远，拉力越大。Obstacle $\mathcal B$ 的 potential 用 $q$ 到它的 distance $d(q,\mathcal B)$ 写，$k>0$：

$$\mathcal P_{\mathcal B}(q)=\frac{k}{2d^2(q,\mathcal B)},\qquad F_{\mathcal B}(q)=-\frac{\partial\mathcal P_{\mathcal B}}{\partial q}=\frac{k}{d^3}\frac{\partial d}{\partial q}$$

（对 $d$ 求 derivative：$\frac{\partial}{\partial q}\frac{k}{2}d^{-2}=-k\,d^{-3}\frac{\partial d}{\partial q}$，前面再乘 $-1$。）$\partial d/\partial q$ 是 $d$ 增长最快的方向，也就是背离 obstacle 的方向，所以 $F_{\mathcal B}$ 把 robot 推开。总的 force 是各项相加，$F=F_{\mathrm{goal}}+\sum_iF_{\mathcal B_i}$。书上给了两种用法：当作 force 加 damping，$u=F(q)-B\dot q$（像一个球在 potential 的曲面上带着摩擦滚）；或者直接当作 velocity，$\dot q=F(q)$，没有 oscillation。下面用后一种。

在 plane 里算一个例子。Point robot 从 $(0,0)$ 出发，goal 在 $(1,0)$，$K=I$。两个 circle obstacle 的 center 在 $(0.5,\pm0.15)$，radius 0.1，中间留着一条宽 0.1 的缝，point robot 完全过得去。Circle 的 distance 是 $d=\|q-c\|-R$，$\partial d/\partial q=(q-c)/\|q-c\|$。

取 $k=10^{-3}$，从 $(0,0)$ 沿 x 轴走（两个 obstacle 上下对称，y 方向的 force 互相抵消）。走到 $x=0.324$ 停住。核对这一点的 force：$\|q-c\|=\sqrt{0.176^2+0.15^2}=0.231$，$d=0.231-0.1=0.131$，

$$F_{\mathrm{goal},x}=1-0.324=0.676,\qquad F_{\mathcal B,x}=2\times\frac{10^{-3}}{0.131^3}\times\frac{0.324-0.5}{0.231}=2\times0.444\times(-0.761)=-0.676$$

两者抵消。往 y 方向挪一点，两个 obstacle 推它的力不再对称，离哪个近就被哪个推得更狠，合力把它推回 x 轴（数值算出 $\partial F/\partial q$ 的两个 eigenvalue 是 $-11.1$ 和 $-7.3$，都是负的）：这是一个 local minimum，robot 卡死在缝前面。从 $(0,0.3)$ 出发就不同：它从上面那个 obstacle 的外侧绕过去，到达 $(1.022,0)$。这个终点也不是 goal：obstacle 的 repulsive force 在 goal 处并不为零，总 potential 的 minimum 被推开了 0.022。把 $k$ 降到 $10^{-4}$，从 $(0,0)$ 也能穿过缝，停在 $(1.0025,0)$。

::fig[mr-potential] 同一个 potential field 里两个起点。从 $(0,0)$ 出发的点沿 x 轴走，在缝前的 local minimum 停住；从 $(0,0.3)$ 出发的点绕过上面的 obstacle 到达 goal 附近。灰色短箭头是各处 $F(q)$ 的方向。

书上处理 local minimum 的办法有三个。一是 navigation function：满足“只有一个 minimum，在 goal”等四个条件的 potential，Rimon 和 Koditschek 对 sphere world（所有 obstacle 都是球）给出了构造，并能变形到 star-shaped 的 obstacle。二是 wavefront planner：在 grid 上从 goal 做 breadth-first search，每个 cell 的“到 goal 的步数”就是一个没有 local minimum 的 potential。三是把 potential 当作 A* 的 cost-to-go 估计，由 search 负责跳出 local minimum。实际计算时，$d(q,\mathcal B)$ 往往难算，书上的做法是在 robot 上取几个 control point $f_i(q)$、把 obstacle 表面离散成点 $c_j$，在 workspace 里算点对点的 repulsive force，再用 control point 的 Jacobian 换成 joint 的 force：$F_{ij}=J_i^\top(q)F'_{ij}$。Wheeled robot 有 constraint $A(q)\dot q=0$ 时，$F$ 要先投影到允许的方向上：$F_{\mathrm{proj}}=\big(I-A^\top(AA^\top)^{-1}A\big)F$。

:::wrong Potential field 卡住是因为 $k$ 取大了，把 $k$ 调小就没事
上面的例子里 $k$ 从 $10^{-3}$ 降到 $10^{-4}$，robot 的确穿过了缝，因为缝中线上两个 obstacle 的 repulsive force 在 x 方向上不够大（在缝的正中，两个 force 各是 $10^{-4}/0.05^3=0.8$，方向一上一下，正好抵消）。换成一个开口朝着 robot 的 U 形 obstacle、goal 在 U 的背后：goal 的拉力把 robot 拉进 U 里，robot 一直走到 U 的底部，在 repulsive force 和拉力相等的地方停下。$k$ 越小，停的地方离底部的墙越近；$k$ 越大，停得越早；无论 $k$ 取多少，它都到不了 U 背后的 goal。Local minimum 来自 obstacle 的形状，调 $k$ 只能挪动它的位置。书上的说法是：基本的 potential field 即使在存在 feasible path 时也可能卡在 local minimum。
:::

:::edge Revolute joint 的 distance
在 2R arm 的 C-space 里做 RRT，nearest neighbor 用的 distance 必须按 circle 算：$\theta_1$ 从 $170^\circ$ 到 $-170^\circ$ 的距离是 20°，不是 340°。Local planner 也要沿较短的 arc 走，否则 tree 永远不会跨过 $\pm180^\circ$ 那条边，第 1 站那种“方形里不连通、torus 上连通”的问题就找不到 path。
:::

:::back
C-space 和它的 topology 来自[第 1 站](#cspace)。
:::

:::from
$\mathcal C_{\mathrm{free}}$ 与 $\mathcal C_{\mathrm{obs}}$ 的定义（joint limit 也算 C-obstacle）、circular robot 把 obstacle 长大 $r$、三种 completeness、grid 加 A* 的 resolution completeness 与“超过几个 dof 不实际”、PRM 的建图与查询、RRT 的算法步骤与 goal bias、Figure 10.17 的对比、Figure 10.18 的 distance 问题、bidirectional RRT 与 RRT*，来自 [Modern Robotics](https://hades.mech.northwestern.edu/images/2/25/MR-v2.pdf) 第 10.1 到 10.5 节；potential field 的两个 potential、$u=F-B\dot q$ 与 $\dot q=F$、local minimum、navigation function、wavefront、workspace potential 与 $J_i^\top$、wheeled robot 的投影，来自第 10.6 节（都是全文读过）。Point robot、$[-0.5,0.5]^2$、circle obstacle 的设定与 segment 碰撞的常见错误来自 [Sampling-Based Planning](https://hades.mech.northwestern.edu/index.php/Sampling-Based_Planning) handout。Voronoi region 的解释凭自己的知识写；手算的一轮、segment 的例子、图里的 obstacle 和 RRT、potential field 的两个 obstacle 与停住的位置、U 形 obstacle 的论证，是为这一页算的或自己构造的。
:::

## [control] Trajectory generation 与 task-space control

:::skip
快速路线必读（书第 9.1、9.2 节与第 11.1 到 11.3 节，约 3 小时）。能写出 feedforward 加 PI 的控制律并由 gain 算出 $\zeta$，知道 PI 的 error 为什么在 $\zeta\ge1$ 时也会越过零，能写出 task-space 控制律并复现 capstone 的测试数值，就可以去第 9 站。Cubic、quintic、trapezoidal time scaling 见 [RB2202](../courses/RB2202.html) 第 7 站。书上 9.3 节的 via point trajectory 和 9.4 节的 time-optimal time scaling 在[第 9 站](#timeopt)，第 11.5 到 11.7 节的 force control、hybrid motion–force control、impedance control 在[第 10 站](#force)。
:::

### Reference 从哪里来：path 加 time scaling

Controller 要跟的是一条 reference trajectory $X_d(t)\in SE(3)$。Trajectory 拆成两件事：path $X(s)$（$s$ 从 0 到 1 走过哪些 pose）和 time scaling $s(t)$（什么时候走到哪里）。Rest-to-rest 时常用 quintic time scaling，$\tau=t/T$：

$$s(t)=10\tau^3-15\tau^4+6\tau^5$$

两端的 velocity 和 acceleration 都是 0，peak $\dot s$ 是 $\tfrac{15}{8T}$。

Path 在 $SE(3)$ 上有两种自然的“straight line”。

**Screw path**：沿一条固定的 screw axis 从 $X_{\mathrm{start}}$ 走到 $X_{\mathrm{end}}$，

$$X(s)=X_{\mathrm{start}}\exp\!\big(\log(X_{\mathrm{start}}^{-1}X_{\mathrm{end}})\,s\big)$$

**Decoupled（Cartesian）path**：position 走 straight line，rotation 单独沿它自己的 axis 转，

$$p(s)=p_{\mathrm{start}}+s\,(p_{\mathrm{end}}-p_{\mathrm{start}}),\qquad R(s)=R_{\mathrm{start}}\exp\!\big(\log(R_{\mathrm{start}}^\top R_{\mathrm{end}})\,s\big)$$

MR code library 里分别是 `ScrewTrajectory` 和 `CartesianTrajectory`。

两者什么时候不同？取 plane 里最简单的情形：从 origin、朝向 0°，到 $(1,0)$、朝向 90°。Screw path 是绕某点 $q$ 转 90°，由 $(I-R)q=(1,0)$：

$$\begin{pmatrix}1&1\\-1&1\end{pmatrix}q=\begin{pmatrix}1\\0\end{pmatrix}\quad\Rightarrow\quad q=(0.5,\ 0.5)$$

$s=0.5$ 时转了 45°，origin 在 $q+R(45^\circ)(0-q)=(0.5,0.5)+(0,-0.707)=(0.5,\ -0.207)$。Cartesian path 在 $s=0.5$ 时是 $(0.5,0)$。

::fig[mr-paths] 两种 path 在每个 $s$ 处的 orientation 相同，origin 走的路不同。

Rotation 不变时两者都是同一条 straight line。Capstone 的八段里，下到方块、抬起、放下这几段 gripper 只做 translation，用哪个都一样；第 1 段和第 5 段 orientation 有变化，screw path 会让 gripper 走一段弧，离地面或障碍近时要留意。

### 一个 joint：feedforward、P、PI

先看一个 velocity-controlled joint（直接下发 joint velocity，motor 的 driver 负责做到；capstone 里的 youBot 就是这样）。$\theta_d(t)$ 是 reference，error $\theta_e=\theta_d-\theta$。

**只用 feedforward**：$\dot\theta=\dot\theta_d$。Error 的 derivative 是 $\dot\theta_e=\dot\theta_d-\dot\theta=0$，初始 error 原样保持，永远不消失。开头第三次失败就是这件事在六个维度上发生：gripper 一开始偏了多少，最后就偏多少。

**只用 P**：$\dot\theta=K_p\theta_e$。Reference 静止时 $\dot\theta_e=-K_p\theta_e$，error 按 $e^{-K_pt}$ 衰减，2% settling time 约 $4/K_p$。Reference 以 constant rate $c$ 移动时，$\dot\theta_e=c-K_p\theta_e$，steady state 是 $\theta_e=c/K_p$：$K_p=20$、$c=1$ rad/s 时一直落后 0.05 rad。

**Feedforward 加 P**：$\dot\theta=\dot\theta_d+K_p\theta_e$。代进去得 $\dot\theta_e=-K_p\theta_e$，不管 reference 怎么动，error 都按 $e^{-K_pt}$ 衰减。Feedforward 管 reference 怎么变，feedback 管现在差多少。

**加 I**：如果 joint 实际的 velocity 比命令慢一个固定的 bias，比如 $\dot\theta=\dot\theta_{\mathrm{cmd}}-0.1$，feedforward 加 P 的 steady state 是 $\dot\theta_e=0.1-K_p\theta_e=0$，即 $\theta_e=0.1/K_p=0.005$ rad（$K_p=20$）。加上 integral：

$$\dot\theta=\dot\theta_d+K_p\theta_e+K_i\int_0^t\theta_e\,dt$$

steady state 要求 $\dot\theta_e=0$ 且 $\int\theta_e$ 不再变，所以 $\theta_e=0$，bias 由 integral term 抵消。代价是 error 的 dynamics 升了一阶。对 $\dot\theta_e=-K_p\theta_e-K_i\int\theta_e$ 再求一次 derivative：

$$\ddot\theta_e+K_p\dot\theta_e+K_i\theta_e=0$$

和标准形式 $\ddot\theta_e+2\zeta\omega_n\dot\theta_e+\omega_n^2\theta_e=0$ 对照：$\omega_n=\sqrt{K_i}$，$\zeta=\dfrac{K_p}{2\sqrt{K_i}}$。Characteristic equation $s^2+K_ps+K_i=0$ 的 root 是 $s_{1,2}=-\tfrac{K_p}{2}\pm\sqrt{\tfrac{K_p^2}{4}-K_i}$。书上的例子固定 $K_p=20$，让 $K_i$ 从 0 往上加（root locus）：$K_i=0$ 时 root 是 0 和 $-20$，error 有一部分永远不衰减；$K_i=44.4$ 时 $\zeta=1.5$，两个 real root，慢的那个拖着；$K_i=100$ 时两个 root 在 $-10$ 会合，$\zeta=1$，2% settling time $4/(\zeta\omega_n)=0.4$ s；$K_i=400$ 时 $\zeta=0.5$，root 是 $-10\pm j\sqrt{300}$，开始 oscillate，但 settling time 不变（real part 还是 $-10$）。所以书上的建议是取 critical damping，$K_i=K_p^2/4$。

:::wrong $\zeta\ge1$ 就不会 overshoot
教科书上 overdamped、critically damped 不 overshoot 的结论，前提是 $\dot\theta_e(0)=0$。PI 控制下 $t=0$ 时 integral 还是 0，$\dot\theta_e(0)=-K_p\theta_e(0)$：P term 一上来就以最大的 rate 把 error 往下压。$K_p=20$、$K_i=100$（$\zeta=1$）时，两个 root 都是 $-10$，解是 $\theta_e=(A+Bt)e^{-10t}$。由 $\theta_e(0)=1$ 得 $A=1$；由 $\dot\theta_e(0)=B-10A=-20$ 得 $B=-10$：

$$\theta_e(t)=(1-10t)\,e^{-10t}$$

$t=0.1$ 时过零。求 derivative，$\dot\theta_e=(-20+100t)e^{-10t}$，$t=0.2$ 时最低，$\theta_e=-e^{-2}=-0.135$：越过零 13.5%。$\zeta=1.5$ 时也越过 7.5%；$\zeta=0.5$ 时是 29.8%，而按 $\dot\theta_e(0)=0$ 的标准 formula 只有 16.3%。

读书时要留意：书上 Figure 11.7 画这三种情形的 error response，用的 initial condition 是 $\theta_e=1$、$\dot\theta_e=0$，所以那张图里 $\zeta\ge1$ 的两条曲线不越过零。对这个 PI controller，$\dot\theta_e(0)=0$ 只有在 integral 的初值取 $-K_p\theta_e(0)/K_i$ 时才成立；integral 从 0 开始（capstone 和一般的实现都是这样）时，就是上面算的结果。

:::

::fig[mr-pi] 同一个 $K_p=20$，换不同的 $K_i$。只有 P 时单调衰减，error 不越过零；加了 I 都会越过，$K_i$ 越大越多。

### Task space：error 是 twist，feedforward 要换 frame

现在 reference 是 end-effector 的 pose $X_d(t)$，当前 pose 是 $X$。上一节的三个 term 逐个换成 $SE(3)$ 上的东西：

$$\mathcal V(t)=[\mathrm{Ad}_{X^{-1}X_d}]\,\mathcal V_d(t)+K_pX_{\mathrm{err}}(t)+K_i\int_0^tX_{\mathrm{err}}\,dt,\qquad[X_{\mathrm{err}}]=\log(X^{-1}X_d)$$

$\mathcal V$ 是要 end-effector 执行的 body twist，再用 $\dot\theta=J_b^\dagger(\theta)\mathcal V$ 换成 joint velocity。

- $X_{\mathrm{err}}$ 是第 4 站 IK 里的同一个东西：从 $X$ 指向 $X_d$ 的 body twist。
- $\mathcal V_d$ 是 reference 自己的 body twist，写在 $\{d\}$ 里。离散时间下用相邻两个 reference 求：$[\mathcal V_d]=\frac{1}{\Delta t}\log(X_d^{-1}X_{d,\mathrm{next}})$。
- $\mathcal V_d$ 写在 $\{d\}$ 里，而 $\mathcal V$ 和 $J_b$ 写在当前的 end-effector frame $\{e\}$ 里，所以要乘 $[\mathrm{Ad}_{T_{ed}}]=[\mathrm{Ad}_{X^{-1}X_d}]$ 换过来。

用 capstone handout 的测试数值走一遍（$\Delta t=0.01$）：

$$X_d=\begin{pmatrix}0&0&1&0.5\\0&1&0&0\\-1&0&0&0.5\\0&0&0&1\end{pmatrix},\quad X_{d,\mathrm{next}}=\begin{pmatrix}0&0&1&0.6\\0&1&0&0\\-1&0&0&0.3\\0&0&0&1\end{pmatrix},\quad X=\begin{pmatrix}0.170&0&0.985&0.387\\0&1&0&0\\-0.985&0&0.170&0.570\\0&0&0&1\end{pmatrix}$$

**$\mathcal V_d$。** $X_d$ 和 $X_{d,\mathrm{next}}$ rotation 相同，只差 translation $(0.1,0,-0.2)$（在 $\{s\}$ 里）。$X_d^{-1}X_{d,\mathrm{next}}$ 是 pure translation $R_d^\top(0.1,0,-0.2)$，$R_d^\top$ 的 row 是 $R_d$ 的 column：

$$R_d^\top\begin{pmatrix}0.1\\0\\-0.2\end{pmatrix}=\begin{pmatrix}0&0&-1\\0&1&0\\1&0&0\end{pmatrix}\begin{pmatrix}0.1\\0\\-0.2\end{pmatrix}=\begin{pmatrix}0.2\\0\\0.1\end{pmatrix},\qquad\mathcal V_d=\frac{1}{0.01}(0,0,0,\ 0.2,0,0.1)=(0,0,0,\ 20,0,10)$$

**$X_{\mathrm{err}}$。** $X$ 的 rotation 是绕 $\hat y$ 转 $\cos^{-1}0.170=80.2^\circ$，$X_d$ 是绕 $\hat y$ 转 90°，相差 $9.8^\circ=0.171$ rad。实算 $\log(X^{-1}X_d)$：

$$X_{\mathrm{err}}=(0,\ 0.171,\ 0,\ 0.080,\ 0,\ 0.107)$$

**Feedforward 换 frame。** $\mathcal V_d$ 的 angular part 是 0，$[\mathrm{Ad}]$ 只剩把 linear part 乘上 $X^{-1}X_d$ 的 rotation，也就是绕 $\hat y$ 转 0.171 rad：

$$\begin{pmatrix}20\cos0.171+10\sin0.171\\0\\-20\sin0.171+10\cos0.171\end{pmatrix}=\begin{pmatrix}19.71+1.70\\0\\-3.40+9.85\end{pmatrix}=\begin{pmatrix}21.41\\0\\6.45\end{pmatrix}$$

$K_p=K_i=0$ 时 $\mathcal V=(0,0,0,\ 21.409,0,6.455)$；$K_p=I$ 时再加上 $X_{\mathrm{err}}$，$\mathcal V=(0,0.171,0,\ 21.488,0,6.562)$。两个都和 handout 给的数一致。第 12 站把它换成 wheel 和 joint 的 speed。

:::wrong Feedforward 就是 $\mathcal V_d$，不用乘 $[\mathrm{Ad}]$
不乘就是把 $(0,0,0,20,0,10)$ 当成 $\{e\}$ 里的 velocity 执行。它和正确的 $(21.41,0,6.45)$ 方向差 $\tan^{-1}\frac{10}{20}-\tan^{-1}\frac{6.455}{21.409}=26.6^\circ-16.8^\circ=9.8^\circ$，正好是两个 frame 之间的 angle。Feedback 会把由此产生的 error 慢慢拉回来，所以程序“大致能用”，但 error plot 一直消不干净。Handout 要求先只用 feedforward 跑通再加 feedback，就是为了把这类错误暴露出来。
:::

用 capstone 的整套 youBot model 做一次 kinematic simulation（自己写的 NextState、TrajectoryGenerator、FeedbackControl，没有 physics），初始 pose 偏 40°、0.47 m。只用 feedforward，15 秒后 gripper 停在 $z=-0.253$ m，这就是开头第三次失败；$K_p=1.5I$、$K_i=0$ 时，2.8 秒内六个 component 都降到 0.01 以下，最后停在放下方块之后的 standoff（离地 0.125 m）。

### Torque control：computed torque

:::skip
跳过它会少掉 torque 层面的控制。Capstone 和多数 learning-based manipulation 用 velocity 或 position 接口，用不到；需要它的 dynamics 在[第 6 站](#dyn)，force control 与 impedance control 在[第 10 站](#force)。
:::

如果 joint 接受的是 torque，就要面对 dynamics。书上的单 joint 例子：$\tau=M\ddot\theta+mgr\cos\theta+b\dot\theta$，$M=0.5$ kg·m²，$m=1$ kg，$r=0.1$ m，$b=0.1$ N·m·s/rad。PD control $\tau=K_p\theta_e+K_d\dot\theta_e$，忽略 gravity，error dynamics 是

$$M\ddot\theta_e+(b+K_d)\dot\theta_e+K_p\theta_e=0,\qquad\zeta=\frac{b+K_d}{2\sqrt{K_pM}},\quad\omega_n=\sqrt{K_p/M}$$

取 $K_d=2$、$K_p=2.205$：$\zeta=\dfrac{2.1}{2\sqrt{1.1025}}=\dfrac{2.1}{2.1}=1$，critically damped。

加上 gravity，要 link 停在 $\theta_d=0$（水平）。PD 的 steady state 要求 $K_p\theta_e$ 等于 gravity torque $mgr\cos\theta$，此时 $\theta=-\theta_e$：解 $2.205\,\theta_e=0.981\cos\theta_e$，得 $\theta_e=0.408$ rad，link 垂下 23°。

加 $K_i$ 能消除它（PID），但 error dynamics 升到三阶：$M\dddot\theta_e+(b+K_d)\ddot\theta_e+K_p\dot\theta_e+K_i\theta_e=0$。书上给出三个 root 都在左半平面的条件是 $K_d>-b$、$K_p>0$，以及

$$0<K_i<\frac{(b+K_d)K_p}{M}=\frac{2.1\times2.205}{0.5}=9.26$$

$K_i$ 有上限，太大系统就 unstable。书上的 PID 例子取 $K_i=1$：steady-state error 消失了，但 transient 有明显的 overshoot。书上还说，因为 stability 最要紧，很多实际的 robot controller 干脆取 $K_i=0$，或者用 integrator anti-windup 限制 integral 的大小。更好的办法是用 model 抵消 dynamics：

$$\tau=\tilde M(\theta)\Big(\ddot\theta_d+K_p\theta_e+K_i\int\theta_e\,dt+K_d\dot\theta_e\Big)+\tilde h(\theta,\dot\theta)$$

Model 准确时，代进 $\tau=M\ddot\theta+h$，$M$ 和 $h$ 两边消掉，剩下 $\ddot\theta_e+K_d\dot\theta_e+K_p\theta_e+K_i\int\theta_e=0$：和 robot 的 dynamics 无关的 linear error dynamics。这叫 computed torque control。$M(\theta)$、$h(\theta,\dot\theta)$ 怎么算见[第 6 站](#dyn)。

:::back
$X_{\mathrm{err}}$ 和 $[\mathrm{Ad}]$ 来自[第 2 站](#twist)，$J_b$ 和 pseudoinverse 来自[第 4 站](#jac)。
:::

:::from
Path 与 time scaling 的拆分、quintic 的 peak velocity、screw path 与 decoupled path 的两个 formula 来自 [Modern Robotics](https://hades.mech.northwestern.edu/images/2/25/MR-v2.pdf) 第 9.1、9.2 节；feedforward、P、PI 的 error dynamics，$\omega_n=\sqrt{K_i}$、$\zeta=K_p/(2\sqrt{K_i})$，$K_p=20$ 配三个 $K_i$ 的例子，task-space 控制律，单 joint 的 PD 与 computed torque（$K_d=2$、$K_p=2.205$），来自第 11.1 到 11.4 节（全文读过；root locus 的叙述、Figure 11.7 的 initial condition、PID 的 stability 条件与 $K_i=1$ 的例子也来自这里）。测试数值来自 [capstone handout](https://hades.mech.northwestern.edu/index.php/Mobile_Manipulation_Capstone)。$\dot\theta_e(0)=-K_p\theta_e(0)$ 导致越过零的分析（与书上 Figure 11.7 的 initial condition 不同，正文已说明）、velocity bias 的例子、gravity 下 23° 的 steady-state error、screw path 的中点、$[\mathrm{Ad}]$ 的手算、kinematic simulation 的结果，是为这一页算的。
:::

## [timeopt] Via point 与 time-optimal time scaling

:::skip
快速路线可以跳过整站（书第 9.3、9.4 节，约 2 小时）。ME 449 Fall 2026 在 11 月 6 日到 11 日讲这两节，Coursera 上有“第 9 章至 9.3 节”和“9.4 节”两个 quiz，Assignment 5 有三道题（习题 9.2、9.3、9.22）加一道改编自 2025 年 Quiz 2 的 phase plane 题，都对着这一站。只做 capstone 的话，第 8 站的 quintic time scaling 已经够用。
:::

### Via point：经过几个点，路径形状不管

第 8 站的 trajectory 先定 path 再定 time scaling。有时任务只要求 robot 在指定时刻经过几个 via point（再加上 start 和 end），中间走什么形状无所谓。这时可以跳过 path，直接对每个 joint 做 polynomial interpolation。

对一个 joint（记它的值为 $\beta$），用户给出 $k$ 个 via point：时刻 $T_i$、位置 $\beta_i$、velocity $\dot\beta_i$，$T_1=0$，$T_k=T$。相邻两个 via point 之间是一段 cubic，段 $j$ 的时长 $\Delta T_j=T_{j+1}-T_j$，用段内经过的时间 $\Delta t$ 写：

$$\beta(T_j+\Delta t)=a_{j0}+a_{j1}\Delta t+a_{j2}\Delta t^2+a_{j3}\Delta t^3,\qquad0\le\Delta t\le\Delta T_j$$

两端的位置、velocity 共 4 个条件。$\Delta t=0$ 时直接给出 $a_{j0}=\beta_j$、$a_{j1}=\dot\beta_j$。$\Delta t=\Delta T_j$（下面简写 $\Delta T$）时：

$$a_{j2}\Delta T^2+a_{j3}\Delta T^3=\beta_{j+1}-\beta_j-\dot\beta_j\Delta T,\qquad2a_{j2}\Delta T+3a_{j3}\Delta T^2=\dot\beta_{j+1}-\dot\beta_j$$

第二式乘 $\Delta T/3$ 再从第一式减去，$a_{j3}$ 消掉，$\tfrac13a_{j2}\Delta T^2=\beta_{j+1}-\beta_j-\dot\beta_j\Delta T-\tfrac13(\dot\beta_{j+1}-\dot\beta_j)\Delta T$，整理：

$$a_{j2}=\frac{3\beta_{j+1}-3\beta_j-2\dot\beta_j\Delta T-\dot\beta_{j+1}\Delta T}{\Delta T^2},\qquad a_{j3}=\frac{2\beta_j+(\dot\beta_j+\dot\beta_{j+1})\Delta T-2\beta_{j+1}}{\Delta T^3}$$

（$a_{j3}$ 由第一式减去 $a_{j2}\Delta T^2$ 得到。）书上 Figure 9.7(a) 的例子：$(x,y)$ 两个 coordinate，via point 在 $T=0,1,2,3$ 时刻依次是 $(0,0)$、$(0,1)$、$(1,1)$、$(1,0)$，velocity 依次是 $(0,0)$、$(1,0)$、$(0,-1)$、$(0,0)$。每段 $\Delta T=1$，代公式：

| 段 | $x$：$(a_0,a_1,a_2,a_3)$ | $y$：$(a_0,a_1,a_2,a_3)$ |
|---|---|---|
| 1（$t\in[0,1]$） | $(0,0,-1,1)$ | $(0,0,3,-2)$ |
| 2（$t\in[1,2]$） | $(0,1,1,-1)$ | $(1,0,1,-1)$ |
| 3（$t\in[2,3]$） | $(1,0,0,0)$ | $(1,-1,-1,1)$ |

例如段 1 的 $x$：$a_2=(3\times0-0-0-1\times1)/1=-1$，$a_3=(0+(0+1)\times1-0)/1=1$。第 1 段 $x(t)=-t^2+t^3$ 在 $t=2/3$ 时最小，$x=-4/27=-0.148$：path 跑到了 $x<0$ 的地方，虽然所有 via point 的 $x$ 都 $\ge0$。这种 cubic interpolation 不保证 path 待在 via point 的 convex hull 里；B-spline interpolation 能保证（代价是 path 不一定精确经过 via point），joint limit 或 obstacle 在附近时要考虑这一点。

::fig[mr-via] 左：四个 via point 和插值出的 path，短箭头是指定的 via velocity，点按 $t$ 移动。右：$x(t)$、$y(t)$，竖虚线是 via point 的时刻。

:::wrong 每段都是光滑的 cubic，整条 trajectory 的 acceleration 就是连续的
在 via 2（$t=1$）比较两边。段 1 末端的 acceleration 是 $2a_2+6a_3\Delta T=(2\times(-1)+6,\ 2\times3-12)=(4,-6)$；段 2 开头是 $2a_2=(2,2)$。Acceleration 从 $(4,-6)$ 一下跳到 $(2,2)$，jerk 是 impulse。Cubic interpolation 只保证 position 和 velocity 连续。要 acceleration 也连续，就在每个 via point 再指定 acceleration，换成 quintic（每段 6 个 coefficient 对 6 个条件）。
:::

只有 start 和 end 两个点、两端 velocity 为 0 时，这个方法退化成第 8 站的 straight-line cubic time scaling。

### Time-optimal：path 已经定了，最快能多快

Path planner 给出了一条 path $\theta(s)$，$s\in[0,1]$，剩下的只有 time scaling $s(t)$。第 8 站的 quintic 是随手选的形状；要 robot 的生产率最高，就要在 actuator 的能力范围内走得最快。Trapezoidal profile 在“constant 的最大 acceleration、最大 velocity”假设下是 optimal 的，但真实 robot 的 dynamics 随 configuration 变，能用的 acceleration 沿 path 处处不同。Actuator 的限制写成

$$\tau_i^{\min}(\theta,\dot\theta)\le\tau_i\le\tau_i^{\max}(\theta,\dot\theta)$$

**把 dynamics 写成 $s$ 的函数。** 沿 path，$\dot\theta=\theta'\dot s$，$\ddot\theta=\theta'\ddot s+\theta''\dot s^2$（$'$ 表示对 $s$ 求 derivative）。代进 $M\ddot\theta+c(\theta,\dot\theta)+g=\tau$，速度项 $c=\dot\theta^\top\Gamma\dot\theta=\dot s^2\,\theta'^\top\Gamma\theta'$：

$$\underbrace{M\theta'}_{m(s)}\ddot s+\underbrace{\big(M\theta''+\theta'^\top\Gamma\theta'\big)}_{c(s)}\dot s^2+\underbrace{g(\theta(s))}_{g(s)}=\tau$$

$n$ 个 actuator 的限制变成 $n$ 个关于 $\ddot s$ 的 inequality：$\tau_i^{\min}\le m_i\ddot s+c_i\dot s^2+g_i\le\tau_i^{\max}$。解出 $\ddot s$ 的范围 $[L_i,U_i]$：

$$m_i>0:\ L_i=\frac{\tau_i^{\min}-c_i\dot s^2-g_i}{m_i},\ U_i=\frac{\tau_i^{\max}-c_i\dot s^2-g_i}{m_i};\qquad m_i<0:\ \text{两者对调}$$

（除以负数，inequality 反向。）$m_i=0$ 的点叫 zero-inertia point，这个 actuator 不影响 $\ddot s$，它的限制直接变成对 $\dot s$ 的限制。所有 actuator 都要满足，所以

$$L(s,\dot s)=\max_iL_i\ \le\ \ddot s\ \le\ U(s,\dot s)=\min_iU_i$$

**例子：gantry 绕过 obstacle。** 书上 Figure 9.9：两个 prismatic joint 的 robot（水平放置，没有 gravity），path planner 给出一条半径 $R$ 的半圆绕过 obstacle，$x(s)=R\cos s\pi$，$y(s)=-R\sin s\pi$。取 $R=0.5$ m。$x$ joint 搬动整个 gantry，$m_x=2$ kg；$y$ joint 只搬 tool，$m_y=1$ kg；force 限制 $|f_x|\le4$ N、$|f_y|\le2$ N。$M=\mathrm{diag}(m_x,m_y)$ 是 constant，$\Gamma=0$：

$$\theta'=\begin{pmatrix}-R\pi\sin s\pi\\-R\pi\cos s\pi\end{pmatrix},\quad\theta''=\begin{pmatrix}-R\pi^2\cos s\pi\\R\pi^2\sin s\pi\end{pmatrix},\quad m(s)=\begin{pmatrix}m_x\theta'_x\\m_y\theta'_y\end{pmatrix},\quad c(s)=\begin{pmatrix}m_x\theta''_x\\m_y\theta''_y\end{pmatrix}$$

在 $(s,\dot s)=(0.25,0.5)$：$m=(-2.221,-1.111)$，$c=(-6.979,3.489)$。$x$ joint：$-4\le-2.221\ddot s-6.979\times0.25\le4$，$m_x<0$，解出 $-2.586\le\ddot s\le1.015$。$y$ joint：$-2\le-1.111\ddot s+3.489\times0.25\le2$，解出 $-1.015\le\ddot s\le2.586$。合起来 $L=-1.015$、$U=1.015$。同一个 $s$，$\dot s$ 提到 0.8：$x$ joint 要求 $\ddot s\le-0.21$，$y$ joint 要求 $\ddot s\ge0.21$，$L=0.21>U=-0.21$，没有任何 $\ddot s$ 可行：速度太快，两个 actuator 合起来也提供不了沿着半圆拐弯所需的 force。

### $(s,\dot s)$ phase plane

$s(t)$ 单调增加，所以一个 time scaling 就是 $(s,\dot s)$ plane 里从 $(0,0)$ 到 $(1,0)$、$\dot s\ge0$ 的一条曲线。在每个 state，可行的 motion 方向是一个 cone：水平分量是 $\dot s$（$s$ 往右走的快慢），竖直分量在 $L$ 和 $U$ 之间。$L>U$ 的 state 是 inadmissible 的。对每个 $s$，通常有一个 $\dot s_{\lim}(s)$，比它快就 inadmissible，这条曲线叫 velocity limit curve，在它上面 $L=U$，cone 缩成一条线。曲线要可行，它在每一点的切线都要落在那一点的 cone 里。

Gantry 的 velocity limit curve 在 $s=0.5$（半圆最底部）最低。那里 $m_y=-m_yR\pi\cos(\pi/2)=0$，是 $y$ joint 的 zero-inertia point：$y$ 方向的 force 全部用来提供 centripetal force，$f_y=c_y\dot s^2=m_yR\pi^2\dot s^2\le2$，所以 $\dot s\le\sqrt{2/(0.5\pi^2)}=0.637$，此时 tool 的 speed 是 $R\pi\dot s=1.0$ m/s，centripetal acceleration $1.0^2/0.5=2$ m/s² 正好是 $f_y$ 的上限除以 $m_y$。$s=0$ 和 1 是 $x$ joint 的 zero-inertia point，限制也是 0.637；$s=0.25$ 时是 0.757。

**最快就是让 $\dot s$ 处处最大。** Total time

$$T=\int_0^T1\,dt=\int_0^1\frac{dt}{ds}\,ds=\int_0^1\frac{1}{\dot s(s)}\,ds$$

要 $T$ 最小，$\dot s(s)$ 在每个 $s$ 都要在满足 acceleration constraint 和两端条件的前提下尽量大。于是 time scaling 永远在 $U$ 或 $L$ 上，只能选在哪里切换。最简单的是 bang-bang：从 $(0,0)$ 用 $\ddot s=U$ 往前 integrate，从 $(1,0)$ 用 $\ddot s=L$ 往回 integrate，两条曲线的交点就是从加速切到减速的 switch。

Gantry 上这样做行不通：往前的曲线在 $s=0.353$、$\dot s=0.737$ 撞上 velocity limit curve，往回的曲线对称地在 $s=0.647$ 撞上，两条曲线在可行区域里没有交点。需要书上的 time-scaling algorithm 来找多个 switch。

### Time-scaling algorithm

1. Switch 的 list $S$ 为空，$i=0$，$(s_0,\dot s_0)=(0,0)$。
2. 从 $(1,0)$ 用 $\ddot s=L$ 往回 integrate，直到穿过 velocity limit curve 或 $s=0$。这条曲线叫 $F$。
3. 从 $(s_i,\dot s_i)$ 用 $\ddot s=U$ 往前 integrate，直到和 $F$ 相交，或者穿过 velocity limit curve。记这条为 $A_i$。和 $F$ 相交：交点是最后一个 switch（加速转减速），加进 $S$，结束。穿过 velocity limit curve：记穿过点为 $(s_{\lim},\dot s_{\lim})$，进入第 4 步。
4. 在 $[0,\dot s_{\lim}]$ 上对 $\dot s$ 做 binary search：从 $(s_{\lim},\dot s_{\mathrm{test}})$ 用 $\ddot s=L$ 往前 integrate，穿过 velocity limit curve 就把 $\dot s_{\mathrm{test}}$ 调低，撞到 $\dot s=0$ 就调高。收敛后这条曲线刚好擦着 velocity limit curve，切点记作 $(s_{\tan},\dot s_{\tan})$，那里的 cone 只剩一个方向，与 velocity limit curve 相切。
5. 从 $(s_{\tan},\dot s_{\tan})$ 用 $\ddot s=L$ 往回 integrate，直到和 $A_i$ 相交。交点是一个加速转减速的 switch，加进 $S$。
6. $(s_{\tan},\dot s_{\tan})$ 是一个减速转加速的 switch，加进 $S$，令它为新的 $(s_i,\dot s_i)$，回到第 3 步。

Gantry 上跑一遍（$s$ 方向步长 $2\times10^{-4}$ 的 Runge–Kutta）：

- 第 2、3 步：$F$ 和 $A_0$ 分别在 $s=0.647$、$0.353$ 撞上 velocity limit curve。
- 第 4 步：从 $s=0.353$ 出发的减速曲线，binary search 收敛到正好擦过 $(0.5,\ 0.637)$，也就是 zero-inertia point 处 velocity limit curve 的尖底。
- 第 5 步：从 $(0.5,0.637)$ 用 $L$ 往回，在 $s_1=0.269$（$\dot s=0.681$）碰上 $A_0$：第一个 switch，加速转减速。
- 第 6 步：$s_2=0.5$，减速转加速。
- 回到第 3 步：从 $(0.5,0.637)$ 用 $U$ 往前，在 $s_3=0.731$（$\dot s=0.681$）和 $F$ 相交，结束。

$S=\{0.269,\ 0.5,\ 0.731\}$，total time 2.04 s。同一条 path 若用 quintic time scaling，把 $T$ 缩到刚好不超 force 限制，最短是 2.95 s。沿 optimal 的 trajectory，$f_x$、$f_y$ 至少有一个顶在上限：这正是“永远在 $U$ 或 $L$ 上”的意思。

::fig[mr-topt] 左：gantry 的 tool（彩色点）沿半圆绕过 obstacle，按 time-optimal time scaling 实时播放，下面两根 bar 是 $f_x$、$f_y$，碰到边框就是顶到限制。右：phase plane。灰底是 inadmissible 区域，它的下边缘是 velocity limit curve；虚线是第 2、3 步的 $F$ 和 $A_0$，在可行区域里不相交；粗线是 optimal time scaling，三个圆点是 switch。几个小三角是 motion cone。

**书上的变体。** Velocity limit curve 上能属于 optimal 解的点，只有 cone 的那个唯一方向与曲线相切的点。所以第 4 步的 binary search 可以换成：先把 velocity limit curve 显式算出来，再沿它找满足相切条件的点。Gantry 的 velocity limit curve 在 $s=0.5$ 不光滑（zero-inertia point 处的尖底），切点就落在尖底上。

:::wrong Time-optimal time scaling 就是先用最大 acceleration、再用最大 deceleration，只切换一次
单次 switch 只在 $U$ 曲线和 $L$ 曲线在可行区域里相交时成立。Gantry 的两条曲线各自在 $\dot s=0.737$ 撞上 velocity limit curve，若无视它、硬让两条曲线在 $s=0.5$ 相交，那一刻 tool 要以超过 1.0 m/s 的 speed 过弯，$f_y$ 要超过 2 N，robot 会偏离 path。正确的解在 $s=0.5$ 前先减速，擦着 velocity limit curve 过弯，再加速，一共三次 switch。
:::

### 前提和代价

书上 9.4.4 节列了 algorithm 的三个假设。**Static posture maintenance**：任何 $(s,0)$ 处 robot 都能靠 actuator 静止撑住，于是至少存在“无限慢”的可行解；actuator 太弱、要靠 momentum 冲过某段 path 时要改 algorithm。**Inadmissible state**：每个 $s$ 有唯一的 $\dot s_{\lim}(s)$，下面全可行、上面全不可行；有些 actuator 或 friction model 会在中间出现孤立的不可行“岛”。**Zero-inertia point**：algorithm 假设没有 $m_i(s)=0$ 的点；有的话 velocity limit curve 由两部分的较小者决定：zero-inertia 的 actuator 给出的 velocity 限制，和其余 actuator 的 $L_i=U_i$。Velocity limit curve 上整段都是 zero-inertia point（singular arc）时，按 algorithm 会在 $U$ 和 $L$ 之间快速来回切换（chattering）；这时取一个落在 $L$、$U$ 之间、与 velocity limit curve 相切的 acceleration，仍然 optimal。Gantry 的 zero-inertia point 是孤立的点，没有这个问题。

就算前提都满足，也很少把 time-optimal 的结果原样送给 robot：acceleration 不连续会激起 vibration；inertia 和 friction 的 model 总有误差；最致命的是每一刻至少有一个 actuator 已经用满，robot 一旦偏离 trajectory，feedback controller 没有余量去纠正。书上的评价是：它给出了 robot 沿一条 path 真正的能力上限。

:::back
Path 与 time scaling 的拆分、quintic 来自[第 8 站](#control)；$M$、$c$、$\Gamma$ 来自[第 6 站](#dyn)。
:::

:::from
Via point 的 cubic interpolation（9.26 到 9.29 式）、Figure 9.7(a) 的四个 via point 与 velocity、“cubic 只保证 velocity 连续”、改用 quintic、B-spline 与 convex hull，来自 [Modern Robotics](https://hades.mech.northwestern.edu/images/2/25/MR-v2.pdf) 第 9.3 节；time-optimal 的问题提法、(9.32) 到 (9.37) 式、$L_i$ 与 $U_i$ 的三种情况、phase plane 与 motion cone、velocity limit curve、$T=\int\dot s^{-1}ds$、bang-bang、time-scaling algorithm 的六步、9.4.3 节的变体、9.4.4 节的三个假设与缺点、Figure 9.9 的半圆 path，来自第 9.4 节（都是全文读过）。ME 449 的进度与 Assignment 5 的题目来自 [ME 449 课程页](https://hades.mech.northwestern.edu/index.php/ME_449_Robotic_Manipulation) 和 [Assignment 5 handout](https://hades.mech.northwestern.edu/images/8/8a/ME449-asst5-2026.pdf)。$a_{j2}$、$a_{j3}$ 的消元步骤、via point 的 coefficient 表与 $x=-0.148$、acceleration 的跳变，是为这一页算的；gantry 的 mass、force 限制与半径，cone、velocity limit curve、algorithm 的每一步、switch 位置、2.04 s 与 quintic 的 2.95 s，是自己设定并用 Python 数值求出的（Runge–Kutta 加 binary search）。
:::

## [force] Force control、hybrid motion–force control 与 impedance control

:::skip
快速路线可以跳过整站（书第 11.5 到 11.7 节，约 2 小时）。ME 449 Fall 2026 的第 11 章只讲到 11.4 节，这一站不在它的进度表和作业里（Assignment 4 Part 3、4 的 spring 是最简单的 impedance，可以对照着看）。要让 robot 擦桌子、插 peg、开门，或者读 diffusion policy、ACT 这类 learning 论文里“impedance controller 跑在底层”的说法之前，读这一站。依赖[第 6 站](#dyn)的 task-space dynamics。
:::

### Force control：要的是 force，不是 position

第 8 站的 controller 都在控制 motion：外界推 robot 一下，controller 把它拉回 reference，好的 motion controller 对 force disturbance 不敏感。擦桌子、打磨这类任务要的是另一件事：以指定的 force 压住环境，环境在哪里由不得 robot。理想的 force control 对 motion disturbance 不敏感，和 motion control 正好对偶。纯粹的 force control 只在环境每个方向都有阻力时才有意义（end-effector 埋在 concrete 里，或者被 spring 从各个方向拉住）；实际上 robot 总有能自由动的方向，这就引出后面的 hybrid control。

Robot 对环境施加 wrench $\mathcal F_{\mathrm{tip}}$ 时，dynamics 是

$$M(\theta)\ddot\theta+c(\theta,\dot\theta)+g(\theta)+b(\dot\theta)+J^\top(\theta)\mathcal F_{\mathrm{tip}}=\tau$$

（$b$ 是 friction。）Force control 时 robot 几乎不动，去掉 acceleration 和 velocity 的项：$g(\theta)+J^\top\mathcal F_{\mathrm{tip}}=\tau$。所以只用 joint 的 encoder，就能下 control law

$$\tau=\tilde g(\theta)+J^\top(\theta)\mathcal F_d$$

$\tilde g$ 是 gravity 的 model，$\mathcal F_d$ 是想要施加的 wrench。

用第 6 站的 2R（point mass，竖直 plane）。$\theta=(0^\circ,-90^\circ)$，tip 在 $(1,-1)$，正好碰到 $y=-1$ 处一张水平的桌面，要向下压 5 N：$\mathcal F_d=(0,-5)$。第 6 站算过 $g(\theta)=(19.62,0)$，$J=\begin{pmatrix}1&1\\1&0\end{pmatrix}$：

$$\tau=\begin{pmatrix}19.62\\0\end{pmatrix}+\begin{pmatrix}1&1\\1&0\end{pmatrix}\begin{pmatrix}0\\-5\end{pmatrix}=\begin{pmatrix}14.62\\0\end{pmatrix}\text{ N·m}$$

$\tau_2=0$：link 2 竖直，桌面的反作用力沿着它，穿过 joint 2。Joint 1 少出 5 N·m：桌面以 5 N 往上托 tip，力臂 1 m。MR library 的 `InverseDynamics`（$\dot\theta=\ddot\theta=0$，`Ftip` 写在 end-effector frame 里是 $(0,0,0,\ 5,0,0)$）给出同样的 $(14.62,0)$。

**Model 不准时。** 设 controller 以为 $m_2=0.8$ kg（实际 1 kg）。$\tilde g$ 少算了 $\delta g=(1.962,0)$。静止时 $g+J^\top\mathcal F_{\mathrm{tip}}=\tilde g+J^\top\mathcal F_d$，所以

$$\mathcal F_{\mathrm{tip}}=\mathcal F_d-J^{-\top}\delta g=\begin{pmatrix}0\\-5\end{pmatrix}-\begin{pmatrix}0&1\\1&-1\end{pmatrix}\begin{pmatrix}1.962\\0\end{pmatrix}=\begin{pmatrix}0\\-6.96\end{pmatrix}$$

Robot 没算到的那 0.2 kg 的 weight 也压在了桌上。把桌面建模成 5000 N/m 的 stiff spring 加 damping、对整个 2R 做 dynamic simulation，压力稳定在 6.96 N，和这个静态的结论一致。

**加一个 force-torque sensor 做 PI。** 在 wrist 上装 six-axis force-torque sensor，直接读 $\mathcal F_{\mathrm{tip}}$，令 $\mathcal F_e=\mathcal F_d-\mathcal F_{\mathrm{tip}}$：

$$\tau=\tilde g(\theta)+J^\top(\theta)\Big(\mathcal F_d+K_{fp}\mathcal F_e+K_{fi}\int\mathcal F_e(t)\,dt\Big)$$

不用 D：force 的读数噪声大，求 derivative 没有意义；而且在这个 model 里 torque 直接变成 tip 的 force，中间没有一个需要 damping 的 integrator。代进静止的 dynamics，$g$ 与 $\tilde g$ 差 $\delta g$：

$$J^\top\mathcal F_{\mathrm{tip}}=J^\top\Big(\mathcal F_d+K_{fp}\mathcal F_e+K_{fi}\int\mathcal F_e\Big)-\delta g\quad\Rightarrow\quad(I+K_{fp})\mathcal F_e+K_{fi}\int\mathcal F_e=J^{-\top}\delta g$$

（左边的 $I$ 来自 $\mathcal F_{\mathrm{tip}}=\mathcal F_d-\mathcal F_e$；书上 11.52 式写的是 $K_{fp}\mathcal F_e+K_{fi}\int\mathcal F_e=0$，少了这个 $I$，对结论没有影响。）右边是 constant，对 time 求一次 derivative：$(I+K_{fp})\dot{\mathcal F}_e+K_{fi}\mathcal F_e=0$，$\mathcal F_e$ 以 time constant $(1+k_{fp})/k_{fi}$ 衰减到 0。取 $K_{fp}=0.5I$、$K_{fi}=20I$，time constant 0.075 s。Simulation 里 tip 从刚好碰到桌面开始压，压力在 0.1 s 时 3.46 N、0.2 s 时 4.54 N、0.3 s 时 4.86 N、0.4 s 时 4.96 N，最后是 5.00 N；integral 项替 model 补上了 1.96 N。

::fig[mr-table] 左：2R 的 tip 压在桌面上，箭头是桌面给 tip 的力。右：压力随 time 变化。只用 $\tilde g+J^\top\mathcal F_d$ 时停在 6.96 N（model 少算了 0.2 kg）；加 sensor 的 PI 后回到 5 N。

:::wrong Force control law 写好了，什么时候打开都一样
桌子被拿走（或者 tip 还没碰到桌面）时打开同一个 law：$\tau=g+J^\top\mathcal F_d$ 相当于在 tip 上施加一个向下 5 N 的外力，没有东西顶住，tip 就往下加速。第 6 站算过这个 configuration 下 $\Lambda=\mathrm{diag}(1,2)$，竖直方向的 effective mass 是 2 kg，acceleration 是 $5/2=2.5$ m/s²；simulation 里 0.3 s 后 tip 已经掉了 0.112 m。Force control 本身不限制 motion，PI 的 integral 还会越积越大。书上的办法是加 velocity damping：

$$\tau=\tilde g+J^\top\Big(\mathcal F_d+K_{fp}\mathcal F_e+K_{fi}\int\mathcal F_e-K_{\mathrm{damp}}\mathcal V\Big)$$

$K_{\mathrm{damp}}=30$ 时 tip 的 speed 上限是 $5/30=0.17$ m/s，0.3 s 后只掉了 0.039 m。
:::

### Hybrid motion–force control

擦桌子要同时做两件事：沿桌面以 0.1 m/s 移动，同时以 5 N 往下压。Task space 是 $n$ 维时，$n$ 个 motion 和 $n$ 个 force 里只能自己指定 $n$ 个，其余由环境决定；而且不能在“同一个方向”上既指定 force 又指定 motion。书上的例子：环境是一个 damper，$f=B_{\mathrm{env}}v$，

$$B_{\mathrm{env}}=\begin{pmatrix}2&1\\1&1\end{pmatrix},\qquad f_1=2v_1+v_2,\quad f_2=v_1+v_2$$

指定 $f_1$ 和 $v_1$ 是可以的（$B_{\mathrm{env}}$ 不是 diagonal，两者独立），$v_2=f_1-2v_1$、$f_2=f_1-v_1$ 随之确定；指定 $f_1$ 和 $2v_1+v_2$ 不行，按环境的规律它们是同一个量。

**Natural constraint 与 artificial constraint。** 环境在 $k$ 个方向上是 rigid 的、在其余 $n-k$ 个方向上不管时，选择由环境做出：rigid 的方向只能控制 force，自由的方向只能控制 motion。书上的例子是擦黑板。板擦 $\{b\}$ 的 $\hat z_b$ 垂直于黑板，贴着黑板要求 $\omega_x=\omega_y=0$、$v_z=0$（$k=3$）；无摩擦的黑板给不出 $m_z$、$f_x$、$f_y$。这 6 个由环境决定的叫 natural constraint；剩下 6 个由任务指定，叫 artificial constraint：

| natural constraint | artificial constraint |
|---|---|
| $\omega_x=0$ | $m_x=0$ |
| $\omega_y=0$ | $m_y=0$ |
| $m_z=0$ | $\omega_z=0$ |
| $f_x=0$ | $v_x=k_1$ |
| $f_y=0$ | $v_y=0$ |
| $v_z=0$ | $f_z=k_2<0$ |

板擦沿 $\hat x_b$ 以 $k_1$ 滑动，同时以 $|k_2|$ 压着黑板。2R 擦桌子是它的 planar 版本：natural constraint 是 $v_y=0$、$f_x=0$，artificial constraint 是 $v_x=0.1$、$f_y=-5$。

**Controller。** Rigid 环境的 $k$ 个 natural constraint 写成 task space 的 Pfaffian constraint $A(\theta)\mathcal V=0$。和第 6 站 constrained dynamics 一样推（只是换到 task space，$M$ 换成 $\Lambda$）：

$$\mathcal F=\Lambda\dot{\mathcal V}+\eta+A^\top\lambda,\qquad\lambda=(A\Lambda^{-1}A^\top)^{-1}\big(A\Lambda^{-1}(\mathcal F-\eta)-A\dot{\mathcal V}\big)$$

$A^\top\lambda$ 是 robot 顶着 constraint 的 wrench。Projection

$$P=I-A^\top(A\Lambda^{-1}A^\top)^{-1}A\Lambda^{-1}$$

把任意 wrench 分成两份：$P\mathcal F$ 只产生沿 constraint 的 motion，不改变 $\lambda$；$(I-P)\mathcal F$ 只改变 $\lambda$，不产生 motion。Hybrid controller 是第 8 站的 task-space computed torque 和上面的 force controller 各投影到自己那一份再相加：

$$\tau=J_b^\top\Big(P\big(\tilde\Lambda(\tfrac{d}{dt}([\mathrm{Ad}_{X^{-1}X_d}]\mathcal V_d)+K_pX_e+K_i\textstyle\int X_e+K_d\mathcal V_e)\big)+(I-P)\big(\mathcal F_d+K_{fp}\mathcal F_e+K_{fi}\textstyle\int\mathcal F_e\big)+\tilde\eta\Big)$$

两部分在各自的 subspace 里工作，各自的 error dynamics 和 stability 分析照搬。

在桌面上 $A=(0\ \ 1)$（$\mathcal V=(\dot x,\dot y)$，$\dot y=0$）。Tip 在 $(1,-1)$ 时 $\Lambda=\mathrm{diag}(1,2)$，$P=\mathrm{diag}(1,0)$，就是“$x$ 归 motion、$y$ 归 force”。Tip 滑到 $(1.5,-1)$（$\theta=(-8.03^\circ,-51.32^\circ)$，同一个 elbow 方向）时：

$$\Lambda=\begin{pmatrix}1.427&-0.720\\-0.720&2.215\end{pmatrix},\quad\Lambda^{-1}=\begin{pmatrix}0.839&0.273\\0.273&0.540\end{pmatrix},\quad P=I-\begin{pmatrix}0\\1\end{pmatrix}\frac{1}{0.540}\begin{pmatrix}0.273&0.540\end{pmatrix}=\begin{pmatrix}1&0\\-0.505&0\end{pmatrix}$$

$\lambda$ 对 $\mathcal F$ 的依赖是 $(A\Lambda^{-1}A^\top)^{-1}A\Lambda^{-1}=(0.505,\ 1)$：沿 $x$ 推 1 N，压桌子的力也变 0.505 N。

::fig[mr-hybrid] Tip 在 $(1.5,-1)$ 擦桌子。Motion controller 想要沿桌面的 4 N（黑色），$P$ 把它改成 $(4,-2.02)$（彩色）：多出来的 $-2.02$ N 正好抵消 $\Lambda$ 的耦合，压力保持 5 N。

:::wrong Hybrid control 就是用 $\mathrm{diag}(1,0)$ 把 wrench 的 $y$ component 砍掉交给 force controller，$x$ component 交给 motion controller
在 $(1.5,-1)$，motion controller 为了沿桌面加速要求 $(4,0)$ N。只按坐标轴分，$\lambda$ 改变 $0.505\times4=2.02$：force controller 要求的 $-5$ N 变成了 $-2.98$ N。Motion 本身没错，两种做法 tip 都以 $\Lambda^{-1}$ 给出的 $(2.80,0)$ m/s² 沿桌面加速（constraint 把 $y$ 方向吃掉了）；错的是 force。用 $P$：$P(4,0)=(4,-2.02)$，$\lambda$ 改变 $0.505\times4+1\times(-2.02)=0$。“哪个方向属于 motion”要按 $\Lambda$ 的 inner product 分，只有 $\Lambda$ 是 diagonal 时才和坐标轴对齐。
:::

实际用起来最难的是知道 $A(\theta)$：哪些方向此刻是 rigid 的，model 总有误差。书上提了三条路：用 force feedback 实时估计 constraint 的方向；把 gain 调低，让 motion controller 软一点、force controller 对误差宽容一点；或者在 robot 结构里做 passive compliance。Joint 和 link 本身的 flexibility 也让一些 compliance 无法避免。

### Impedance control 与 admittance control

Hybrid control 在 rigid 环境里要求两个极端：motion 方向 impedance 无限高（force 推不动它），force 方向 impedance 无限低（motion 不改变 force）。很多时候想要的是中间：让 end-effector 表现得像一个指定的 mass–spring–damper。Haptic 手术模拟器要模拟组织的软硬；robot 和人一起搬东西，要被人推得动。

一维时，robot 要 render 的 behavior 是

$$m\ddot x+b\dot x+kx=f$$

$f$ 是用户施加的 force。令 $x=Xe^{j\omega t}$（频率 $\omega$ 的正弦），$f=Fe^{j\omega t}$，代进去：$F=(k+jb\omega-m\omega^2)X$。$Z=F/X$ 叫 impedance：低频时由 spring 主导（$|Z|\approx k$），高频时由 mass 主导（$|Z|\approx m\omega^2$）。它的 inverse $Y=X/F$ 叫 admittance。好的 motion controller impedance 高（$\Delta X=Y\Delta F$，$Y$ 小，force disturbance 只引起很小的 motion），好的 force controller impedance 低（$\Delta F=Z\Delta X$，$Z$ 小）。多维时写成 $M\ddot x+B\dot x+Kx=f_{\mathrm{ext}}$，$M$、$B$、$K$ 是 positive-definite matrix。

实现有两种，区别在 sensor 量什么、controller 输出什么。

**Impedance control**：量 motion，输出 force。用 encoder（和 tachometer）估计 $x$、$\dot x$，算出要 render 的 force，再用第 6 站的 task-space dynamics 抵消 robot 自己的 dynamics：

$$\tau=J^\top(\theta)\Big(\underbrace{\tilde\Lambda(\theta)\ddot x+\tilde\eta(\theta,\dot x)}_{\text{抵消 arm 的 dynamics}}-\underbrace{(M\ddot x+B\dot x+Kx)}_{f_{\mathrm{ext}}}\Big)$$

$\ddot x$ 很难量准，常见的做法是去掉 $\tilde\Lambda\ddot x$ 并令 $M=0$，用户会感到 arm 自己的 mass，所以 impedance-controlled 的 robot 通常做得很轻；velocity 小时 $\tilde\eta$ 也只留 gravity。例：一个 1 dof 的 haptic device，滑块 mass $m_r=0.5$ kg，render $K=200$ N/m、$B=20$ N·s/m、$M=0$。Motor 出 $-(Kx+B\dot x)$，用户推 5 N 时滑块停在 $x=5/200=0.025$ m，用户感到的是 $0.5\ddot x+20\dot x+200x=f$。

**Admittance control**：量 force，输出 motion。Wrist 上的 load cell 量出 $f_{\mathrm{ext}}$，按要 render 的 behavior 算出 end-effector 该有的 acceleration：

$$\ddot x_d=M^{-1}(f_{\mathrm{ext}}-B\dot x-Kx),\qquad\ddot\theta_d=J^\dagger(\theta)\big(\ddot x_d-\dot J\dot\theta\big)$$

再用 inverse dynamics 算 $\tau$。例：$M=2$、$B=20$、$K=200$，此刻 $x=0.01$、$\dot x=0.1$，sensor 读到 5 N：$\ddot x_d=(5-2-2)/2=0.5$ m/s²。Force 读数有噪声，通常先过一个 low-pass filter。

**各自的短处。** Admittance control render 小 mass 很难：$M=0.05$ kg 时，force sensor 上 $\pm0.2$ N 的噪声就变成 $\pm4$ m/s² 的 acceleration 指令，等效 gain 大，容易 unstable；highly geared、本身很“硬”的 robot 用 admittance control 模拟 stiff 的环境很擅长。Impedance control 正好相反，render stiff 的环境（大 $K$）时出问题：encoder 上一点位置变化就要求很大的 force，等效的高 gain 遇上 delay 和 sampling 就会振荡。下面把这句话算出来。

接着那个 haptic device，滑块本身的 physical damping $b=1$ N·s/m，controller 1 kHz（$T=1$ ms），每个 cycle 读一次位置，算出 $-Kx$ 后保持到下一个 cycle（zero-order hold）。Force 是每个 cycle 开头的位置算出来的，相当于平均滞后半个 cycle：$-Kx(t-T/2)\approx-Kx(t)+K\tfrac T2\dot x(t)$。第二项像一个 negative damping，系统的总 damping 是 $b-KT/2$，要大于 0：

$$K<\frac{2b}{T}=2000\text{ N/m}$$

如果算 force 还要用掉一个 cycle（读到的位置下一个 cycle 才用上），平均滞后变成 $3T/2$，界限降到 $2b/(3T)=667$ N/m。把 sampled-data 系统精确离散化、算 closed-loop 的 eigenvalue，两个界限分别是 2000.7 和 667.0 N/m，和这个粗略的估计一致。所以想 render 一堵 10000 N/m 的硬墙，靠提高 $K$ 行不通，要么加大 physical damping，要么提高 control rate。

::fig[mr-impwall] 同一个 haptic device（$m_r=0.5$ kg、$b=1$、1 kHz、算 force 有一个 cycle 的 delay），从 $x=1$ cm 放开。$K=500$ N/m 时振荡慢慢衰减；$K=1000$ N/m 超过了 667 的界限，振幅越来越大。

:::back
Task-space dynamics $\Lambda$、$\eta$ 与 constrained dynamics 来自[第 6 站](#dyn)，task-space motion control 来自[第 8 站](#control)。
:::

:::from
Force control 与 motion control 的对偶、(11.48) 到 (11.54) 式、PI force control 不用 D 的两条理由、“没有东西可推时会加速”与 velocity damping、hybrid control 的“$n$ 个里选 $n$ 个”与 $B_{\mathrm{env}}$ 的例子、natural/artificial constraint 与擦黑板的表、(11.55) 到 (11.61) 式与 $P$ 的意义、实现上知道 $A(\theta)$ 的三条路、impedance 与 admittance 的定义、(11.62) 到 (11.66) 式、两种实现各自擅长与不擅长的环境，来自 [Modern Robotics](https://hades.mech.northwestern.edu/images/2/25/MR-v2.pdf) 第 11.5 到 11.7 节（全文读过；11.51、11.52 式那一页渲染成图片核对，书上 11.52 式确实没有 $I$）。“ME 449 第 11 章只讲到 11.4 节”来自 [ME 449 课程页](https://hades.mech.northwestern.edu/index.php/ME_449_Robotic_Manipulation)。用正弦解释 $Z$ 代替书上的 Laplace transform 是自己的写法。2R 压桌面的全部数字（$\tau$、model error 带来的 6.96 N、PI 的收敛过程、无桌面时的 2.5 m/s² 与 damping 的效果）、$(I+K_{fp})$ 的推导、$(1.5,-1)$ 处的 $\Lambda$、$P$ 与“沿 $x$ 推 1 N 压力变 0.505 N”、haptic device 的例子、“平均滞后 $T/2$ 相当于 negative damping”的估计与 2000/667 N/m 的界限，是为这一页自己设定并用 Python 算的（2R 的 simulation 用 forward dynamics 加 $10^{-4}$ s 的 time step，桌面是 5000 N/m 的 spring 加 50 N·s/m 的 damper；界限用 zero-order hold 的精确离散化求 eigenvalue）。Haptic rendering 的 stability 界限这类结果文献里有专门的分析（如 Colgate 的 passivity 条件），这里没有去读原文。
:::

## [grasp] Grasping：form closure 与 force closure

:::skip
快速路线可以跳过整站（书第 12 章）。做 Coursera Course 5 的 form closure project 时回来读。
:::

### 一个 contact 能挡住什么

两个 body 在一点 contact，contact normal $\hat n$ 指向 body A。First-order 的分析只看 normal：两者只能分开或保持 contact，不能互相穿透，

$$\hat n^\top(\dot p_A-\dot p_B)\ge0$$

这是 inequality，contact 只能推、不能拉。接触点 B 静止（比如 finger）时，contact 能对 A 施加的 force 只能沿 $+\hat n$，大小非负。Planar 时这个 force 的 wrench 是

$$\mathcal F=(m_z,\ f_x,\ f_y)=(p_xn_y-p_yn_x,\ n_x,\ n_y)$$

一组 contact 加起来能产生的 wrench，是各个 $\mathcal F_i$ 的 nonnegative combination $\sum k_i\mathcal F_i$，$k_i\ge0$。

### Form closure

几个静止的 contact 把 body 完全卡住、任何 motion 都做不了，叫 form closure。等价的说法：contact wrench 的 nonnegative combination 能产生任何 wrench，也就是 $\mathrm{pos}\{\mathcal F_1,\dots,\mathcal F_j\}=\mathbb R^3$（planar）或 $\mathbb R^6$（spatial）。外界无论怎样推 body，contact 都能顶回去。

要几个 contact？$n$ 维 space 里，$n$ 个 vector 的 nonnegative combination 最多是一个 cone，盖不住整个 space：它们的 negative combination 那一侧取不到。所以至少要 $n+1$ 个。Planar 至少 4 个，spatial 至少 7 个。

怎么检验？$\mathrm{pos}\{\mathcal F_i\}$ 是整个 space，当且仅当 (1) $F=[\mathcal F_1\cdots\mathcal F_j]$ 的 rank 是 $n$，并且 (2) 存在每个 component 都严格为正的 $k$ 使 $Fk=0$。第 (2) 条写成 linear program：

$$\text{find }k\quad\text{minimize }\mathbf 1^\top k\quad\text{subject to }Fk=0,\ k_i\ge1$$

（$k_i\ge1$ 而不是 $k_i>0$，因为 $Fk=0$ 对 $k$ 的 scale 不敏感，任何正解都能放大到 $\ge1$。）

在 unit square 上算两个例子。(a) 四个 contact：左边 $(0,0.25)$ 向右推、右边 $(1,0.75)$ 向左推、下边 $(0.25,0)$ 向上推、上边 $(0.75,1)$ 向下推。代 formula：

$$F=\begin{pmatrix}-0.25&0.75&0.25&-0.75\\1&-1&0&0\\0&0&1&-1\end{pmatrix}$$

例如第一个 column：$p=(0,0.25)$、$n=(1,0)$，$m_z=0\times0-0.25\times1=-0.25$。Rank 是 3。$Fk=0$ 的第 2、3 个 row 要求 $k_1=k_2$、$k_3=k_4$，第 1 个 row 变成 $0.5k_1-0.5k_3=0$，所以 $k=(1,1,1,1)$ 可行：form closure。

::fig[mr-closure] (a) 左右两个 contact 的 normal 错开，合起来挡住一个方向的转动；上下两个挡住另一个方向。(b) 四条 normal 都穿过 center，谁也挡不住绕 center 的 rotation。

把 (a) 的上边 contact 从 $(0.75,1)$ 挪到 $(0.25,1)$，它的 $m_z$ 从 $-0.75$ 变成 $-0.25$，第 1 个 row 变成 $-0.25k_1+0.75k_2+0.25k_3-0.25k_4=0$，代入 $k_1=k_2$、$k_3=k_4$ 得 $0.5k_1=0$，和 $k_1\ge1$ 矛盾，LP 无解：只挪了一个 contact，就不是 form closure 了。剩下的可行 motion 是什么，下面的图解法一眼就能看出来。

:::wrong LP 有解就是 form closure
看 (b)：contact 在四条边的 midpoint，normal 都过 center。

$$F=\begin{pmatrix}-0.5&0.5&0.5&-0.5\\1&-1&0&0\\0&0&1&-1\end{pmatrix}$$

$k=(1,1,1,1)$ 满足 $Fk=0$，LP 有解。可第 1 个 row 等于第 2 个 row 的 $-0.5$ 倍加第 3 个 row 的 $0.5$ 倍，rank 只有 2：四个 wrench 全落在一个 plane 里，只能在这个 plane 内互相抵消，平面外的 wrench（纯 moment）一个也产生不了。Body 绕中心转，四个 contact 都只是沿 tangent 方向滑过。Rank 条件和 LP 缺一不可。
:::

书上的 Example 12.7 是另一种布置：body 中间有一个洞，两根 finger 伸进洞里，各自顶住洞的两条边，共四个 contact：

$$F=\begin{pmatrix}0&0&-1&2\\-1&0&1&0\\0&-1&0&1\end{pmatrix}$$

Rank 3。LP 给出 $k=(2,1,2,1)$：代回去，第 1 个 row $-2+2\times1=0$，第 2 个 row $-2+2=0$，第 3 个 row $-1+1=0$。Form closure。书上用 MATLAB 的 `linprog(f, A, b, Aeq, beq)` 解，`f` 全是 1，`A` 是 $-I$、`b` 全是 $-1$（编码 $k_i\ge1$），`Aeq` 是 $F$、`beq` 是 0。把右边那根 finger 挪到洞的右下角，$F$ 变成

$$F=\begin{pmatrix}0&0&0&2\\-1&0&1&0\\0&-1&0&1\end{pmatrix}$$

仍然 rank 3，但第 1 个 row 要求 $2k_4=0$，和 $k_4\ge1$ 矛盾，LP 无解：body 可以向下滑走。

书上还提醒，这一套是 first-order analysis：它判为 form closure 的，考虑 curvature 等 higher-order 效应后仍是 form closure；它判为“只能 roll 或 slide”的，higher-order 分析下可能其实被卡住（Figure 12.14 里两根 finger 夹住一个曲面 body 的例子）。

### 图解法：把 twist 画成 rotation center

:::skip
跳过它会少掉 planar 问题的图解法（书 12.1.6 节）。Course 5 的 form closure project 要求对非 form closure 的那组 contact 画出可行的 rotation center 区域，做那个 project 时回来读。
:::

Planar 时 twist 只有三个数 $(\omega_z,v_x,v_y)$，可以画在 plane 里。$\omega_z\ne0$ 的 planar motion 是绕某一点的 rotation，这一点叫 center of rotation（CoR）。它的 velocity 为 0：$v+\omega_z\hat z\times c=0$，即 $(v_x-\omega_zc_y,\ v_y+\omega_zc_x)=0$，

$$c=\Big(-\frac{v_y}{\omega_z},\ \frac{v_x}{\omega_z}\Big)$$

Speed 不重要时，只在 CoR 旁边标 '+'（逆时针）或 '−'（顺时针）；$\omega_z=0$ 的 translation 是“无穷远处的 CoR”。

一个静止的 contact 允许哪些 CoR？Contact 在 $p$、inward normal $\hat n$（指向 body），body 上那一点的 velocity 是 $\omega_z\hat z\times(p-c)$，不能穿透要求它沿 $\hat n$ 的 component $\ge0$：

$$\omega_z\,\hat n\cdot\big(\hat z\times(p-c)\big)=\omega_z\big((p-c)\times\hat n\big)_z\ \ge\ 0$$

$\omega_z>0$ 时要 $(p-c)\times\hat n\ge0$，就是 $c$ 在 normal 那条线的左侧（顺着 $\hat n$ 看）；$\omega_z<0$ 时 $c$ 在右侧。所以规则是：normal 线左边的点标 '+'，右边标 '−'，线上标 '±'。几个 contact 同时存在时，只保留每个 contact 都给了同样符号的点：剩下的区域就是 body 还能做的全部 motion。它总是 convex 的（经过无穷远的那部分要当作接起来看）。

拿上面 unit square 的例子画。先只放左、右、下三个 contact。左边 $(0,0.25)$ 向右：'+' 要 $c_y\ge0.25$。右边 $(1,0.75)$ 向左：'+' 要 $c_y\le0.75$。下边 $(0.25,0)$ 向上：'+' 要 $c_x\le0.25$。三条都满足的 '+' 区域是 $c_x\le0.25$、$0.25\le c_y\le0.75$ 的一条半无限的 strip；'−' 要 $c_y\le0.25$ 且 $c_y\ge0.75$，空。再加上边那个 contact：

- 放在 $(0.25,1)$ 向下，'+' 要 $c_x\ge0.25$。和 strip 一交，只剩线段 $c_x=0.25$、$0.25\le c_y\le0.75$：body 还能绕这条线段上的点逆时针转。以 $(0.25,0.5)$ 为 CoR 核对：左、右两个 contact 的 velocity 沿 normal 的 component 是 $0.25\omega_z>0$，分开；上、下两个 contact 正好在 CoR 的正上方和正下方，velocity 沿 tangent，滑动。这就是前面 LP 无解的那个例子：它不是 form closure，可行的 motion 只有这一种。
- 放在 $(0.75,1)$ 向下，'+' 要 $c_x\ge0.75$，和 strip（$c_x\le0.25$）不相交：没有任何可行的 CoR，form closure。

::fig[mr-cor] 彩色区域是还允许的 '+' CoR。左：三个 contact，允许整条 strip。中：第四个 contact 在 $(0.25,1)$，只剩一条线段（粗线），绕它逆时针转时上下两个 contact 沿桌面滑。右：第四个 contact 挪到 $(0.75,1)$，区域消失，form closure。

每个可行的 CoR 还可以按每个 contact 的状态贴 label：分开（B）、滑动（S，再按滑向哪一侧分 $S_l$、$S_r$）、或者 rolling（R，CoR 恰好在 contact 点上）。书上 Example 12.5 的提醒值得记住：这是 first-order 的结果，它说可行的某些 roll–slide motion，考虑 contact 处的 curvature 后可能其实会穿透；反过来，first-order 判定为 breaking 或 penetrating 的，higher-order 分析不会推翻。

### Friction：两根 finger 就够

实际的 finger 有 friction。Coulomb friction 说 tangential force 不超过 $\mu$ 乘 normal force：$|f_t|\le\mu f_n$。能施加的 force 可以偏离 $\hat n$，范围是一个以 $\hat n$ 为 axis、half-angle 为 $\alpha=\tan^{-1}\mu$ 的 cone，叫 friction cone。$\mu$ 常见在 0.1 到 1 之间。

Planar 时一个 friction cone 由两条 edge 张成，每条 edge 是一个 wrench。一个 contact 贡献两个 column，form closure 的那套检验原样可用，只是现在叫 force closure：contact 能用 friction 平衡任何外来的 wrench。

两个 frictional contact 时有一个几何判据：两个 contact 点的连线（line of sight）同时落在两个 friction cone 里，就是 force closure。两根 finger 沿这条 line 对夹，产生的 internal force 互相抵消，可以任意大；在这个基础上，每个 cone 里还有余量去抵抗外来的 force 和 moment。

书上的例子：两根 finger 夹一个 equilateral triangle 的两条边。取 vertex $(0,0)$、$(1,0)$、$(0.5,0.866)$，两个 contact 在左右两条边上、高度都是 0.3，连线水平。左边的 inward normal 是 $(0.866,-0.5)$，与水平方向成 30°。所以 line of sight 在 cone 里，当且仅当 $\tan^{-1}\mu\ge30^\circ$，即

$$\mu\ge\tan30^\circ=0.577$$

用 LP 核对：每个 contact 的两条 cone edge 是 $\hat n\pm\mu\hat t$，四个 column；$\mu=0.57$ 时 LP 无解，$\mu=0.58$ 时有解。

::fig[mr-cone] $\mu=0.25$ 时 cone 只张开 14°，line of sight 在外面，finger 一夹，triangle 就被挤出去；$\mu=1$ 时 cone 张开 45°，夹得住。

:::edge 不能用 point contact 做 form closure 的形状
Circular disk 和 sphere 的每条 contact normal 都穿过 center，对 center 取的 moment 全是 0，绕 center 的 rotation 永远挡不住。书上把这类 body 叫作 exceptional（还包括 ellipsoid 等 surface of revolution），无论用多少个 point contact 都不能 form closure，只能靠 friction。
:::

### 图解法：moment labeling

:::skip
跳过它会少掉 wrench cone 的图解法（书 12.2.2 节），force closure 照样可以用上面的 LP 判断。
:::

Wrench 也能画。Planar wrench $\mathcal F=(m_z,f_x,f_y)$ 只要 force 不为 0，就是 plane 里的一支箭头：沿 force 方向，长度是 $\|f\|$，作用线到 origin 的 moment 等于 $m_z$。作用线上离 origin 最近的点是

$$(x,y)=\frac{1}{f_x^2+f_y^2}\big(m_zf_y,\ -m_zf_x\big)$$

（核对：$(x,y)\times f=\frac{m_z}{\|f\|^2}(f_y\cdot f_y-(-f_x)\cdot f_x)=m_z$。）书上的例子 $(2.5,-1,2)$：$\|f\|^2=5$，箭头从 $(1,0.5)$ 画到 $(0,2.5)$。箭头沿作用线滑动不改变 wrench；两个 wrench 相加，就把两支箭头沿各自的线滑到尾部重合，再按 parallelogram 相加。

Contact 的 normal force 可以任意大，要表示的是“$k\mathcal F$，$k\ge0$”这一整条 ray。办法是 moment labeling：作用线左边的点标 '+'（正的 $k\mathcal F$ 对这些点产生正 moment），右边标 '−'，线上标 '±'。几个 wrench 的 nonnegative combination（wrench cone）用“每个 wrench 都给同样符号”的点表示；符号不一致的点不标。和上面的 CoR 区域是同一套几何：上面的“$(p-c)\times\hat n\ge0$”正是“contact force 对 $c$ 的 moment $\ge0$”。

Force closure 的条件变成：**没有任何一点被一致地标上 '+' 或 '−'**。若某点 $c$ 被一致地标了 '+'，contact 能产生的每个 wrench 对 $c$ 的 moment 都 $\ge0$，那么对 $c$ 的 moment 为负的 wrench（比如一个顺时针的 pure moment，它对每一点的 moment 都是负的）就造不出来，contact 抵不住外界反方向的那一个。

拿 friction 那一节的 equilateral triangle 看。两个 contact 在左右两条边上、高度 0.3：$p_l=(0.173,0.3)$、$p_r=(0.827,0.3)$，inward normal $(0.866,-0.5)$ 和 $(-0.866,-0.5)$。每个 friction cone 有两条 edge $\hat n\pm\mu\hat t$，一共四条作用线。$\mu=0.25$ 时，四条线都给 '+' 的点组成右边一个 wedge，顶点附近是 $(0.68,0.16)$ 和 $p_r$；都给 '−' 的点组成左边对称的一个 wedge。两个 wedge 都非空，不是 force closure：例如对右边 wedge 里的点，contact 给不出负 moment，triangle 被一个逆时针的 twist 拧一下就会转出去。$\mu=1$ 时四条线把 plane 切得每一点都有正有负，没有一致的标记，force closure，和前面 LP 给出的边界 $\mu\ge0.577$ 一致。

::fig[mr-moment] 四条线是两个 friction cone 的 edge（作用线）。左：$\mu=0.25$，两侧各有一块一致标记的区域（'+' 浅色、'−' 深色）。右：$\mu=1$，没有一致标记的点。

### 一堆 body 叠在一起能不能站住

Course 5 的第二个 project 问的是另一件事：几个 body 互相靠着、放在地上，只有 gravity，它们能静止吗？这时每个 body 都可能动，书上 12.3 节的做法是代数的：假设所有 contact 都不滑（rolling contact mode），看能不能找到一组落在 friction cone 里的 contact force 让每个 body 都 force balance。

记法。每个 contact 用 friction cone 的两条 edge 表示，一条 edge 是一个 planar wrench，系数 $k\ge0$。一个 contact 连着 body $a$ 和 body $b$，normal 指向 $a$：它的两条 edge 加到 body $a$ 的 balance equation 里，取相反数加到 body $b$ 的 equation 里（作用力与反作用力）；如果 $b$ 是地面，地面不需要 balance，就只出现在 $a$ 的 equation 里。$m$ 个 body 给出 $3m$ 个 equation，$n$ 个 contact 给出 $2n$ 个未知的 $k$：

$$Fk+F_{\mathrm{ext}}=0,\qquad k\ge0$$

这里 $k$ 只要求 $\ge0$，不像 form closure 那样要求 $\ge1$：现在只需要找到一组能平衡 gravity 的 contact force，不需要证明 contact 能抵抗任意方向的 wrench（handout 特意强调了这一点）。

算一个 A 字形的例子（自己构造的）。两块一样的木板，各长 1 m、重 10 N（$g=10$），左板从地面 $(0,0)$ 斜靠到 $(0.6,0.8)$，右板从 $(1.2,0)$ 靠到同一点，两板在顶端互相顶住。三个 contact，按 handout 的格式（body、body、$x$、$y$、指向第一个 body 的 normal angle、$\mu$）写成：

| contact | 连接 | 位置 | normal angle | $\mu$ |
|---|---|---|---|---|
| 1 | 左板、地面 | $(0,0)$ | $90^\circ$ | $\mu_g$ |
| 2 | 右板、地面 | $(1.2,0)$ | $90^\circ$ | $\mu_g$ |
| 3 | 左板、右板 | $(0.6,0.8)$ | $180^\circ$ | $\mu_a$ |

先用手算看答案应该是什么。左板的 gravity 作用在中点 $(0.3,0.4)$。对称性告诉我们顶端的 contact force 是水平的，记左板受到的为 $(-N,0)$。对左板的 foot 取 moment（逆时针为正）：顶端的 force 作用在 $(0.6,0.8)$，moment 是 $0.6\times0-0.8\times(-N)=0.8N$；gravity 的 moment 是 $0.3\times(-10)=-3$。相加为零，$N=3.75$。左板水平方向要平衡，地面必须给它 $+3.75$ 的 friction，而 normal force 是 10，所以要 $\mu_g\ge3.75/10=0.375$。

::fig[mr-aframe] 两块木板的受力。地面给左板的 force $(3.75,10)$ 正好落在 $\mu=0.375$ 的 friction cone 的边上；$\mu_g$ 再小一点，这个 force 就出了 cone，没有别的 contact 能补上。

LP 的结果一致：$\mu_g=0.37$ 无解（倒下），$\mu_g=0.38$ 有解（站住），与 $\mu_a$ 取 0 还是 0.5 无关（对称的情形顶端不需要 friction）。$\mu_g=0.5$ 时解出的一组 $k$ 是：contact 1 的两条 edge $(1.25,8.75)$，合力 $\big(0.5\times(8.75-1.25),\ 1.25+8.75\big)=(3.75,10)$，正好是上面手算的地面 force。

这里的 6 个 equation 是：左板的 $(m_z,f_x,f_y)$ 三个，右板三个。Gravity wrench 在左板是 $(0.3\times(-10),0,-10)=(-3,0,-10)$，右板是 $(0.9\times(-10),0,-10)=(-9,0,-10)$。

:::wrong 内部 contact 的两条 edge，在两个 body 的 equation 里都照原样加进去
Contact 3 的 normal 指向左板，edge 加到左板的 equation 里，表示右板推左板。右板受到的是反作用力，edge 必须取相反数。如果在右板的 equation 里也照原样加，就等于说顶端对右板的推力也朝 $-x$。右板从 $(1.2,0)$ 斜靠向左上方，gravity 对它的 foot 的 moment 是 $(0.9-1.2)\times(-10)=+3$（逆时针，往左倒）；朝 $-x$ 的推力 $N$ 作用在相对 foot 为 $(-0.6,0.8)$ 的地方，moment 是 $-0.8\times(-N)=+0.8N$，也是逆时针。两个 moment 同向，地面的 force 过 foot、对 foot 没有 moment，抵消不了它们（顶端 friction 的竖直分量只能抵掉其中一小部分）：实算 $\mu_g=\mu_a=1$ 时 LP 仍无解，报告“倒下”，而正确的 equation 在 $\mu_g\ge0.375$ 时就能站。程序给出“全都会倒”时，先查内部 contact 的符号。
:::

:::from
First-order contact 的 inequality、contact wrench、form closure 的定义、planar 4 个 / spatial 7 个、rank 加 LP 的检验与 $k_i\ge1$ 的写法、不能 form closure 的形状、Coulomb friction 与 friction cone、force closure、两指 line of sight 判据与 equilateral triangle 的 $\mu\ge\tan30^\circ$，来自 [Modern Robotics](https://hades.mech.northwestern.edu/images/2/25/MR-v2.pdf) 第 12.1、12.2 节；Example 12.7 的两个 $F$、$k=(2,1,2,1)$ 与 MATLAB 的 `linprog` 写法、first-order 与 higher-order analysis 的关系、exceptional body，也来自 12.1.7 节；“$\mathbb R^n$ 至少要 $n+1$ 个 vector 才能 positively span”是书上本章开头列出的 fact 2；assembly 的 rolling contact mode 检验来自 12.3 节的 Example 12.11（都是全文读过，Example 12.7 的符号对着书上的 MATLAB code 核对）。Assembly 的输入格式、$k\ge0$ 而不是 $\ge1$ 的说明来自 [Stability of an Assembly](https://hades.mech.northwestern.edu/index.php/Stability_of_an_Assembly_Project) handout。Unit square 的三组 contact、LP 结果、$\mu=0.57/0.58$ 的边界核对、A 字形木板的例子与它的手算和 LP 结果、符号错误的后果，是为这一页算的。12.1.6 节的 CoR 图解法与 12.2.2 节的 moment labeling（wrench 箭头的画法、$(2.5,-1,2)$ 的例子、force closure 等价于没有一致标记的点）来自书上这两节（全文读过）；unit square 三步加 contact 的 CoR 区域、它对前面 LP 例子的解释、equilateral triangle 在 $\mu=0.25$ 与 1 时的标记区域，是为这一页用 half-plane 求交实算的。12.2.4 节以后的 manipulation 例子没有写。
:::

## [mobile] Wheeled mobile robot 与 mobile manipulation

:::skip
快速路线必读（书第 13.2、13.4、13.5 节，约 2 小时）。能写出 youBot 的 $H(0)$ 和 $F$，复现 NextState 的三个测试，写出 odometry 的 exact integration 和 $J_e$，就可以开始写 capstone。
:::

### Mecanum wheel：用 roller 换掉 nonholonomic

普通 wheel 不能侧滑，第 1 站说过这让 chassis 成为 nonholonomic system：differential drive 只能前进后退和转向。Mecanum wheel 的边缘装了一圈小 roller，roller 的 axis 与 wheel 的 driving direction 成 $\gamma$（youBot 是 $\pm45^\circ$）。接触点沿 roller axis 方向不能滑（roller 不会沿自己的 axis 滑），垂直于 roller axis 的方向可以自由滑（roller 自己滚）。

于是只剩一个 constraint：接触点 velocity 在 roller axis 方向的 component，等于 wheel 滚动带来的 velocity 在这个方向的 component。Wheel 在 $\{b\}$ 里的位置 $(x_i,y_i)$，driving direction 角度 $\beta_i$，chassis 的 body twist 是 $\mathcal V_b=(\omega_{bz},v_{bx},v_{by})$。Wheel center 的 velocity 是 $(v_{bx}-\omega_{bz}y_i,\ v_{by}+\omega_{bz}x_i)$，roller axis 方向是 $(\cos(\beta_i+\gamma_i),\sin(\beta_i+\gamma_i))$，wheel 以 $u_i$ 转时滚动 velocity 在这个方向的 component 是 $r\,u_i\cos\gamma_i$。令两者相等：

$$u_i=\frac{1}{r\cos\gamma_i}\Big(\omega_{bz}\big(x_i\sin(\beta_i+\gamma_i)-y_i\cos(\beta_i+\gamma_i)\big)+v_{bx}\cos(\beta_i+\gamma_i)+v_{by}\sin(\beta_i+\gamma_i)\Big)$$

youBot 的四个 wheel $\beta_i=0$，在 $(\pm l,\pm w)$，$l=0.235$、$w=0.15$、$r=0.0475$。Wheel 1（$x=l$、$y=w$，$\gamma=-45^\circ$）：$\cos(-45^\circ)=\tfrac{1}{\sqrt2}$，$\sin(-45^\circ)=-\tfrac{1}{\sqrt2}$，

$$u_1=\frac{\sqrt2}{r}\cdot\frac{1}{\sqrt2}\big(\omega_{bz}(-l-w)+v_{bx}-v_{by}\big)=\frac1r\big(-(l+w)\omega_{bz}+v_{bx}-v_{by}\big)$$

四个 wheel 叠起来：

$$u=H(0)\,\mathcal V_b,\qquad H(0)=\frac1r\begin{pmatrix}-l-w&1&-1\\l+w&1&1\\l+w&1&-1\\-l-w&1&1\end{pmatrix}$$

::fig[mr-mecanum] youBot chassis 俯视图。Wheel 1、2 在前，1、4 在左。每个 wheel 上的短线是贴地 roller 的 axis。

$H(0)$ 是 $4\times3$ 的，rank 3：任何 chassis twist 都能做到，这就是 omnidirectional。反过来四个 wheel speed 只有 3 个自由，不在 $H(0)$ 的 range 里的 $u$ 意味着 wheel 打滑。由 wheel speed 求 chassis twist 用 pseudoinverse，$F=H(0)^\dagger$，书上（13.33 式）给出的结果是

$$F=\frac r4\begin{pmatrix}-\frac{1}{l+w}&\frac{1}{l+w}&\frac{1}{l+w}&-\frac{1}{l+w}\\1&1&1&1\\-1&1&-1&1\end{pmatrix}$$

自己验证一下它为什么这么简单：$H(0)$ 的三个 column 两两 orthogonal，各自的 squared norm 是 $4(l+w)^2/r^2$、$4/r^2$、$4/r^2$，所以 $H^\top H$ 是 diagonal，pseudoinverse $(H^\top H)^{-1}H^\top$ 就是 transpose 逐 row 除以这三个数。

### Odometry：把 twist integrate 成 displacement

一个 timestep 里 wheel 转过的 angle 是 $\Delta\theta$。假设这段时间里 wheel speed 不变，chassis 的 body twist 也不变，$\mathcal V_b=F\Delta\theta$（取这段时间为单位时间）。Twist 不变的 motion 就是沿一条 screw axis 走，displacement 是 exponential。Planar 时展开成三种情况：

$$\omega_{bz}=0:\quad\Delta q_b=\begin{pmatrix}0\\v_{bx}\\v_{by}\end{pmatrix};\qquad\omega_{bz}\ne0:\quad\Delta q_b=\begin{pmatrix}\omega_{bz}\\\big(v_{bx}\sin\omega_{bz}+v_{by}(\cos\omega_{bz}-1)\big)/\omega_{bz}\\\big(v_{by}\sin\omega_{bz}+v_{bx}(1-\cos\omega_{bz})\big)/\omega_{bz}\end{pmatrix}$$

$\Delta q_b$ 写在 chassis 原来的 frame 里，再按当前的 $\phi_k$ 转到 $\{s\}$：

$$\Delta q=\begin{pmatrix}1&0&0\\0&\cos\phi_k&-\sin\phi_k\\0&\sin\phi_k&\cos\phi_k\end{pmatrix}\Delta q_b,\qquad q_{k+1}=q_k+\Delta q$$

Capstone 的 NextState 测试：$u=(10,10,10,10)$ rad/s 跑 1 秒。$v_{bx}=\frac r4\times40=0.0475\times10=0.475$，其余为 0，chassis 前进 0.475 m。$u=(-10,10,10,-10)$：$\omega_{bz}=\frac{r}{4(l+w)}\times40=\frac{0.475}{0.385}=1.234$ rad，原地逆时针转。实现之后用 $\Delta t=0.01$ 跑 100 步，三组测试（还有 $u=(-10,10,-10,10)$ 横移 0.475 m）都与 handout 一致；speed limit 设 5 时都只走一半。

:::wrong Odometry 直接 $q\mathrel{+}=\mathcal V_b\,\Delta t$ 就够了
取一次 $\Delta\theta=(0,20,20,0)$ rad（比如 encoder 每秒才读一次）。$\mathcal V_b=F\Delta\theta=(1.234,\ 0.475,\ 0)$：一边前进一边转。按上面的 formula：

$$\Delta x_b=\frac{0.475\sin1.234}{1.234}=0.363,\qquad\Delta y_b=\frac{0.475(1-\cos1.234)}{1.234}=0.258$$

直接加得到的是 $(0.475,0)$，差了 0.28 m：chassis 实际走的是一段 arc，chord 比 arc 短，而且偏向转动的一侧。把同样的 $\Delta\theta$ 拆成 100 小步、每步用 exact formula，结果仍是 $(0.363,0.258)$，说明 exact formula 和 timestep 无关。Capstone 的 $\Delta t=0.01$ 很小，直接加的误差小得多，但 handout 要求按书上 13.4 节做。
:::

::fig[mr-odom] 两种算法都走了 0.475 m，exact 的那条沿 arc 走，终点偏向转动的一侧。

### Mobile manipulation：把 chassis 当作几个 joint

End-effector 的 pose 是三段相乘：

$$X=T_{se}=T_{sb}(q)\,T_{b0}\,T_{0e}(\theta)$$

$T_{sb}(q)$ 由 chassis 的 $(\phi,x,y)$ 决定（高度固定 0.0963 m），$T_{b0}$ 是 arm 的 base 在 chassis 上的固定位置（沿 $\hat x_b$ 0.1662 m、沿 $\hat z_b$ 0.0026 m），$T_{0e}(\theta)$ 是 arm 的 PoE（body form，$M_{0e}$ 和五个 $\mathcal B_i$ 由 handout 给出）。

Controller 要的是 9 个 speed（4 个 wheel、5 个 joint）到 end-effector body twist 的 Jacobian：

$$\mathcal V_e=J_e(\theta)\begin{pmatrix}u\\\dot\theta\end{pmatrix}=\big[J_{\mathrm{base}}(\theta)\ \ J_{\mathrm{arm}}(\theta)\big]\begin{pmatrix}u\\\dot\theta\end{pmatrix}$$

$J_{\mathrm{arm}}$ 是第 4 站的 body Jacobian。$J_{\mathrm{base}}$：wheel speed 先变成 chassis 的 planar twist $F u$，补成 6 维的 $\mathcal V_{b6}=F_6u$（$F_6$ 是在 $F$ 上面补两个 row 的 0、下面补一个 row 的 0，对应 $\omega_x,\omega_y$ 和 $v_z$），再从 $\{b\}$ 换到 $\{e\}$：

$$J_{\mathrm{base}}(\theta)=\big[\mathrm{Ad}_{T_{0e}^{-1}(\theta)T_{b0}^{-1}}\big]F_6$$

$J_e$ 与 chassis 在哪里无关，只依赖 arm 的 $\theta$。

接着第 8 站的测试。Robot 的 configuration 是 $(\phi,x,y)=0$、$\theta=(0,0,0.2,-1.6,0)$，由它算出的 $X$ 正是测试里给的那个 matrix。实算 $J_e$ 的前两个 column（wheel 1、2）：

$$J_e=\begin{pmatrix}0.030&-0.030&\cdots\\0&0&\cdots\\-0.005&0.005&\cdots\\0.002&0.002&\cdots\\-0.024&0.024&\cdots\\0.012&0.012&\cdots\end{pmatrix}$$

（wheel 转 1 rad/s，chassis 只动约 1 cm，column 都很小。）$K_p=0$ 时 $\mathcal V=(0,0,0,21.409,0,6.455)$，pseudoinverse 给出

$$(u,\dot\theta)=J_e^\dagger\mathcal V=(157.2,\ 157.2,\ 157.2,\ 157.2,\ 0,\ -652.9,\ 1398.6,\ -745.7,\ 0)$$

与 handout 一致。四个 wheel 同速前进，joint 2、3、4 以几百到一千多 rad/s 转：这是因为测试里 $X_d$ 一步就要走 0.22 m（$\Delta t=0.01$ 时相当于 22 m/s），不是真实的 speed。$K_p=I$ 时是 $(157.5,\dots,-654.3,1400.9,-746.8,0)$，也一致。

### Pseudoinverse 会把 arm 拉直

$J_e$ 是 $6\times9$ 的，$J_e^\dagger\mathcal V$ 在所有能产生 $\mathcal V$ 的 speed 里选 norm 最小的那个。Norm 把 wheel 的 rad/s 和 joint 的 rad/s 一视同仁，而 wheel 转 1 rad/s 只让 end-effector 动约 1 cm，arm joint 转 1 rad/s 能让它动几十厘米。Minimum-norm 的解于是偏爱 arm，让 arm 伸出去够目标，直到 arm 接近伸直、某个方向上 arm 再也给不出 velocity。那时 $J_e$ 在这个方向上的 singular value 只剩 wheel 的贡献，$\dot\theta$ 可能突然变大。Handout 给的三条对策：pseudoinverse 设 tolerance（把太小的 singular value 当 0）；给 wheel 和 joint speed 设上限；用 joint limit 让 joint 3、4 保持在 $-0.2$ rad 以下，越限时把 $J_e$ 对应的 column 置 0 再算一次。Handout 在 enhancement 里还列了 weighted pseudoinverse（给 wheel 和 joint 不同的权重）和主动的 singularity avoidance，并留了一个问题：如果 wheel 的 radius 大得多，这种现象会怎样变？按上面的分析（这是自己的推理，handout 没有给答案），$r$ 变大时 $F$ 整体放大，wheel 转 1 rad/s 让 chassis 走得更远，wheel 在 minimum-norm 的意义下变“便宜”，解会更多地用 wheel，arm 被拉直的倾向减弱。

在上面那次 kinematic simulation（$K_p=1.5I$）里，$\theta_3$ 在 $-0.72$ 到 $0.48$ 之间变化，中途穿过 0，也就是第 4 站说的三条 parallel axis 共面的 singularity。不加 joint limit 时它确实会走到那里。

:::back
Nonholonomic 的概念来自[第 1 站](#cspace)，$[\mathrm{Ad}]$ 来自[第 2 站](#twist)，$J_b$ 和 youBot arm 的 singularity 来自[第 4 站](#jac)，控制律来自[第 8 站](#control)。
:::

:::from
Mecanum wheel 的 $h_i(\phi)$ formula、youBot 的 $H(0)$、“rank 3、多余的 wheel 会打滑”、odometry 的三种情形与转到 $\{s\}$ 的步骤、$T_{se}=T_{sb}T_{b0}T_{0e}$、$J_e=[J_{\mathrm{base}}\ J_{\mathrm{arm}}]$ 与 $J_{\mathrm{base}}$ 的 formula、task-space 控制律配 $J_e^\dagger$，来自 [Modern Robotics](https://hades.mech.northwestern.edu/images/2/25/MR-v2.pdf) 第 13.2、13.4、13.5 节（全文读过；$H(0)$（13.10 式）、$F$（13.33 式）、odometry（13.35、13.36 式）对着书页核对过）。youBot 的尺寸、$T_{b0}$、$M_{0e}$、$\mathcal B_i$、NextState 与 FeedbackControl 的测试数值、pseudoinverse tolerance、speed limit、joint limit、weighted pseudoinverse 与 wheel radius 的问题，来自 [capstone handout](https://hades.mech.northwestern.edu/index.php/Mobile_Manipulation_Capstone)。$u_1$ 的推导、$F$ 为什么这么简单的验证、odometry 的 0.28 m 例子、“minimum norm 偏爱 arm”的解释、wheel radius 问题的回答和 simulation 中 $\theta_3$ 的范围，是为这一页算的或凭自己的知识写的。书上 13.3 节的 nonholonomic robot 在[第 13 站](#nonholo)。
:::

## [nonholo] Nonholonomic mobile robot：controllability、shortest path 与 tracking

:::skip
快速路线可以跳过整站（书第 13.3 节，约 2.5 小时）。ME 449 Fall 2026 明确跳过 13.3 节，capstone 的 youBot 是 omnidirectional 的，也用不到。做 differential-drive 或 car-like robot（扫地机、AGV、自动驾驶）的 planning 和 control 时读这一站。
:::

### 四种 model，一个 canonical form

第 1 站的 rolling coin 就是 unicycle：竖直滚动的 wheel，半径 $r$，configuration $q=(\phi,x,y,\theta)$（朝向、contact 点、wheel 转过的角）。不打滑的条件不写成“哪些方向不能动”，而写成“能动的方向的 linear combination”，系数就是能用的 control：

$$\dot q=\begin{pmatrix}0&1\\r\cos\phi&0\\r\sin\phi&0\\1&0\end{pmatrix}\begin{pmatrix}u_1\\u_2\end{pmatrix}=G(q)u=g_1(q)u_1+g_2(q)u_2$$

$u_1$ 是 wheel 的转速，$u_2$ 是转向的角速度。$g_i(q)$ 叫 tangent vector field（control vector field）。这类 model 有三个特点：没有 drift（$u=0$ 时 $\dot q=0$），vector field 随 $q$ 变，$\dot q$ 对 $u$ 是 linear 的。通常不关心 wheel 转过的角，去掉最后一行，只留 chassis 的 $(\phi,x,y)$。

**Differential drive**：两个独立驱动、同轴的 wheel（半径 $r$，间距 $2d$），加 caster。$(x,y)$ 取两 wheel 中点，$u_L$、$u_R$ 是左右 wheel 的转速：

$$\begin{pmatrix}\dot\phi\\\dot x\\\dot y\end{pmatrix}=\begin{pmatrix}-r/2d&r/2d\\\frac r2\cos\phi&\frac r2\cos\phi\\\frac r2\sin\phi&\frac r2\sin\phi\end{pmatrix}\begin{pmatrix}u_L\\u_R\end{pmatrix}$$

**Car**：前轮用 Ackermann steering，所有 wheel 都绕同一个 CoR 滚，CoR 在后轴的延长线上。$(x,y)$ 取后轴中点，wheelbase $\ell$，steering angle $\psi$。Steering 可以近似瞬间改变时，以 forward speed $v$ 和转动角速度 $\omega=v\tan\psi/\ell$ 为 control。

三种车（unicycle、diff-drive、car）都可以通过 control 的换算写成同一个 canonical model：

$$\dot q=\begin{pmatrix}\dot\phi\\\dot x\\\dot y\end{pmatrix}=\begin{pmatrix}0&1\\\cos\phi&0\\\sin\phi&0\end{pmatrix}\begin{pmatrix}v\\\omega\end{pmatrix}$$

Unicycle 用 $u_1=v/r$、$u_2=\omega$；diff-drive 用 $u_L=(v-\omega d)/r$、$u_R=(v+\omega d)/r$（代进上面的 matrix：$\dot\phi=\frac{r}{2d}(u_R-u_L)=\frac{r}{2d}\cdot\frac{2\omega d}{r}=\omega$，$\dot x=\frac r2(u_L+u_R)\cos\phi=v\cos\phi$）。从 $\dot x=v\cos\phi$、$\dot y=v\sin\phi$ 消去 $v$，得到 Pfaffian constraint $\dot x\sin\phi-\dot y\cos\phi=0$：不能横着走。

几种车的区别只剩 $(v,\omega)$ 的可行集。Diff-drive 的 wheel 转速上限 $u_{\max}$ 给出 $|u_L|,|u_R|\le u_{\max}$，换到 $(v,\omega)$ 是一个 diamond；取 $r=0.05$ m、$d=0.2$ m、$u_{\max}=10$ rad/s，四个顶点在 $v=\pm0.5$ m/s（$\omega=0$）和 $\omega=\pm2.5$ rad/s（$v=0$）。Car 的 steering 有上限 $\psi_{\max}$，转弯半径不小于 $r_{\min}=\ell/\tan\psi_{\max}$，即 $|\omega|\le|v|/r_{\min}$，可行集是一个 bowtie，$v=0$ 时 $\omega$ 只能是 0：不能原地转。取 $\ell=2.5$ m、$\psi_{\max}=30^\circ$，$r_{\min}=4.33$ m。没有倒挡的 car 只有 bowtie 的右半边。

::fig[mr-ctrlsets] 四种车的 $(v,\omega)$ 可行集。Unicycle 是 rectangle，diff-drive 是 diamond，car 是 bowtie（斜边的斜率 $1/r_{\min}$），没有倒挡的 car 只剩右半边。

Chassis 上一点 $P$（在 $\{b\}$ 里位于 $(x_r,y_r)$）的 velocity 能用 $(v,\omega)$ 任意指定吗？$P$ 在世界里的位置对 time 求 derivative，代 $\dot\phi=\omega$、$(\dot x,\dot y)=v(\cos\phi,\sin\phi)$：

$$\begin{pmatrix}\dot x_P\\\dot y_P\end{pmatrix}=\underbrace{\begin{pmatrix}\cos\phi&-x_r\sin\phi-y_r\cos\phi\\\sin\phi&x_r\cos\phi-y_r\sin\phi\end{pmatrix}}_{J(q)}\begin{pmatrix}v\\\omega\end{pmatrix},\qquad\det J=x_r$$

$x_r\ne0$ 时可以反解出 $(v,\omega)$；$x_r=0$ 的点（diff-drive 两 wheel 的中点、car 后轴中点）只能沿 heading 方向动。

### Controllability：不能横着走，为什么还能到处走

Omnidirectional robot 想回到 origin，用 $\dot q=-Kq$ 就行。Canonical model 不行，而且不是 gain 没选好：书上 Theorem 13.1 说，$\dot q=G(q)u$ 若 $\operatorname{rank}G(0)<\dim q$，就没有任何 continuous、time-invariant 的 feedback law 能把它稳到 $q=0$。Canonical model 的 $G$ 处处 rank 2，chassis configuration 是 3 维。

可它明明能平行停车。书上用三个 controllability 的定义来说清楚：**controllable**（任何 $q_{\mathrm{goal}}$ 都能在有限时间到达）；**small-time locally accessible**（STLA：给任意短的时间、任意小的 neighborhood $W$，不离开 $W$ 能到达的 configuration 是一个满维的集合）；**small-time locally controllable**（STLC：上述集合还包含 $q$ 周围的一个 neighborhood）。没有倒挡的 car 是 STLA 但不是 STLC：困在很小的空间里，它到不了正后方的 configuration；有倒挡的 car 是 STLC。障碍物是包含边界的 closed set、free space 是 open set 时，STLC 的车能到达它所在的那个 connected component 里的任何 configuration：车比车位短，就能停进去，哪怕要很久。

**Lie bracket。** 能产生“横着走”，是因为沿两个 vector field 交替走、顺序不同结果不同。从 $q$ 出发沿 $g_i$ 走时间 $\epsilon$，Taylor 展开到 $\epsilon^2$（$\ddot q=\frac{\partial g_i}{\partial q}\dot q=\frac{\partial g_i}{\partial q}g_i$）：

$$q(\epsilon)=q+\epsilon g_i+\tfrac12\epsilon^2\frac{\partial g_i}{\partial q}g_i+O(\epsilon^3)$$

接着沿 $g_j$ 走 $\epsilon$，$g_j$ 在 $q(\epsilon)$ 处的值展开为 $g_j(q)+\epsilon\frac{\partial g_j}{\partial q}g_i$：

$$q(2\epsilon)=q+\epsilon g_i+\epsilon g_j+\tfrac12\epsilon^2\frac{\partial g_i}{\partial q}g_i+\epsilon^2\frac{\partial g_j}{\partial q}g_i+\tfrac12\epsilon^2\frac{\partial g_j}{\partial q}g_j+O(\epsilon^3)$$

只有 $\epsilon^2\frac{\partial g_j}{\partial q}g_i$ 依赖顺序。先 $g_j$ 后 $g_i$ 的结果把它换成 $\epsilon^2\frac{\partial g_i}{\partial q}g_j$，两者相减：

$$\Delta q=\epsilon^2\Big(\frac{\partial g_j}{\partial q}g_i-\frac{\partial g_i}{\partial q}g_j\Big)+O(\epsilon^3)=\epsilon^2[g_i,g_j]+O(\epsilon^3)$$

$[g_i,g_j]$ 叫两个 vector field 的 Lie bracket，它也是依次沿 $g_i$、$g_j$、$-g_i$、$-g_j$ 各走 $\epsilon$ 后的净位移（到 $\epsilon^2$）。和第 6 站两个 twist 的 Lie bracket 是同一个东西，那边是固定时刻的两个 twist，这里是两个随 $q$ 变的 vector field。

Canonical model：$g_1=(0,\cos\phi,\sin\phi)$（前进），$g_2=(1,0,0)$（原地转）。$g_2$ 是 constant，$\frac{\partial g_2}{\partial q}=0$；$g_1$ 只依赖 $\phi$：

$$[g_1,g_2]=0-\begin{pmatrix}0&0&0\\-\sin\phi&0&0\\\cos\phi&0&0\end{pmatrix}\begin{pmatrix}1\\0\\0\end{pmatrix}=\begin{pmatrix}0\\\sin\phi\\-\cos\phi\end{pmatrix}$$

垂直于 heading 的方向。用 $\phi=0$ 的车实际走一遍：前进 $\epsilon$，到 $(0,\epsilon,0)$；左转 $\epsilon$；后退 $\epsilon$，$x$ 减 $\epsilon\cos\epsilon$、$y$ 减 $\epsilon\sin\epsilon$；右转 $\epsilon$ 回到 $\phi=0$。净位移精确是 $(0,\ \epsilon(1-\cos\epsilon),\ -\epsilon\sin\epsilon)$。$\epsilon=0.1$ 时是 $(0,0.0005,-0.0100)$：侧向 $-\epsilon^2=-0.01$ 正是 $\epsilon^2[g_1,g_2]$，前后的 0.0005 是 $\epsilon^3/2$ 那一阶。每个动作走 0.1，侧移只有 0.01：平行停车慢，就慢在这个 $\epsilon^2$。

::fig[mr-liebracket] $\epsilon=0.5$（为了看得清）的四步 maneuver：前进、左转、后退、右转。车回到原来的朝向，向右平移了 $0.5\sin0.5=0.24$，同时向前多出 $0.5(1-\cos0.5)=0.06$。

**Controllability 的判据。** 所有 vector field 和它们任意层的 Lie bracket 张成的 linear span 叫 Lie algebra $\mathrm{Lie}(G)$。书上 Theorem 13.7：$\dim\mathrm{Lie}(G)(q)=\dim q$ 且 control set 的 linear span 是 $\mathbb R^m$ 时 STLA；control set 的 positive span 也是 $\mathbb R^m$ 时 STLC。Canonical model：

$$\det\big[g_1\ g_2\ [g_1,g_2]\big]=\det\begin{pmatrix}0&1&0\\\cos\phi&0&\sin\phi\\\sin\phi&0&-\cos\phi\end{pmatrix}=\cos^2\phi+\sin^2\phi=1$$

处处满秩。Unicycle、diff-drive、有倒挡的 car 的可行集 positive span 都是 $\mathbb R^2$，所以 STLC；没有倒挡的 car 只有 STLA。两者在没有障碍的 plane 里都 controllable。Velocity constraint 有没有被“积分”成 configuration constraint，也由这个判据回答：STLA 的系统，reachable set 满维，constraint 就是 nonholonomic 的。

把 wheel 的转角也算进 configuration 再看一次。Unicycle 的 $q=(\phi,x,y,\theta)$，$g_1=(0,r\cos\phi,r\sin\phi,1)$，$g_2=(1,0,0,0)$；$g_3=[g_1,g_2]=(0,r\sin\phi,-r\cos\phi,0)$（横移），$g_4=[g_2,g_3]=(0,r\cos\phi,r\sin\phi,0)$（前进但 wheel 不转）。$\det[g_1\ g_2\ g_3\ g_4]=-r^2\ne0$，4 维满秩：这就是第 1 站 rolling coin 的结论，用 Lie bracket 再证一次。Diff-drive 带上两个 wheel 角 $q=(\phi,x,y,\theta_L,\theta_R)$ 就不行了：怎么取 bracket 都只有 4 维。原因是由上面的 model，$\dot\phi=\frac{r}{2d}(\dot\theta_R-\dot\theta_L)$，积分出 $\phi=\frac{r}{2d}(\theta_R-\theta_L)+\text{const}$，一个 holonomic constraint。三个 velocity constraint 里两个 nonholonomic、一个 holonomic。

:::wrong Nonholonomic robot 也能横着走，那么像 omnidirectional robot 一样用 $\dot q=-Kq$ 那样的 feedback 就能把它稳到 origin
能到达任何 configuration（controllable）和能用 continuous time-invariant feedback 稳住（stabilizable）是两回事。Theorem 13.1 说 canonical model 后者做不到：横向的 error 只能靠 Lie bracket 方向的来回 maneuver 消除，这需要 time-varying 或 discontinuous 的 feedback。下面的 tracking 问题不受这个 theorem 限制，因为 reference 一直在动。
:::

### Motion planning：最短路径只由几种片段拼成

没有障碍时，任意两个 configuration 都连得起来，有意思的是最优的那条。

**Unicycle 和 diff-drive 的 shortest path**：原地转向目标、直走、再原地转到目标朝向，长度就是直线距离。

**Dubins car（没有倒挡）的 shortest path**：书上 Theorem 13.11，只由最小转弯半径的 arc（C）和直线（S）组成，而且是 CSC 或 $CC_\alpha C$（中间那段 arc 的角度 $\alpha>\pi$）两类之一。按左转（L）右转（R）细分，有 LSL、LSR、RSL、RSR、RLR、LRL 六种，逐一算出长度取最短的。

例：$r_{\min}=1$，从 $(x,y,\phi)=(0,0,0)$ 到 $(3,2,90^\circ)$。LSL：起点的左转 circle 圆心在 $(0,1)$，终点朝 $+y$，它的左转 circle 圆心在 $(3,2)+(-1,0)=(2,2)$。两个圆半径相同，外公切线平行于圆心连线，直线段长就是圆心距 $\sqrt{2^2+1^2}=2.236$，方向 $\tan^{-1}(1/2)=26.57^\circ$。第一段 arc 从 $0^\circ$ 左转到 $26.57^\circ$，0.464 rad；最后一段从 $26.57^\circ$ 左转到 $90^\circ$，1.107 rad。总长 $0.464+2.236+1.107=3.807$。其余几种实算是 LSR 9.82、RSL 10.06、LRL 11.76、RSR 16.00，LSL 最短。终点改成 $(1,1,180^\circ)$，离得太近，最短的是 RLR，5.78，中间那段 arc 转了 4.46 rad（$256^\circ$）。

::fig[mr-dubins] 左：到 $(3,2,90^\circ)$ 的最短路径 LSL，虚线是两个 turning circle。右：到 $(1,1,180^\circ)$ 的最短路径 RLR，中间那段左转超过半圈。

**Reeds–Shepp car（有倒挡）**：Theorem 13.12，shortest path 属于九类之一，如 $C|C|C$、$CC|C$、$CSC$、$C|C_{\pi/2}SC_{\pi/2}|C$（“|”是倒挡切换的 cusp），按左右转和前进后退细分共 48 种。

**Diff-drive 的 minimum-time motion**：Theorem 13.13，只用最大 speed 的直行（F、B）和最大角速度的原地转（L、R），共 40 种。“转、直走、转”总能到，但不一定最快。书上的例子：$v_{\max}=\omega_{\max}=1$，从 $q_0=0$ 到 $q_{\mathrm{goal}}=(\phi,x,y)=(-7\pi/8,\ 1.924,\ 0.383)$。LFR：先左转 $\tan^{-1}(0.383/1.924)=\pi/16$ 对准目标，直走 $\sqrt{1.924^2+0.383^2}=1.962$，再右转 $15\pi/16$ 到 $-7\pi/8$，共 $\pi/16+1.962+15\pi/16=5.103$。FRB：先直走 1 到 $(1,0)$，右转 $7\pi/8$，朝向变成 $-7\pi/8$，再后退 1，位移是 $-(\cos(-7\pi/8),\sin(-7\pi/8))=(0.924,0.383)$，正好到 $(1.924,0.383)$，共 $1+7\pi/8+1=4.749$，更快。

::fig[mr-diffopt] 同一个目标，两种走法。左：LFR，5.103。右：FRB，4.749，经过 $(1,0)$ 这个“via point”。

**有障碍时**：第 7 站的 grid 和 RRT 可以直接用，把 control set 离散成几个极端的 control（最大 speed 前进后退、方向盘打满），因为最短路径本来就只用这些；PRM 和 RRT 的 local planner 可以用上面的 shortest path。对有倒挡的 car 还有一个办法：先用不管 motion constraint 的 planner 找一条 path $q(s)$，试着用 Reeds–Shepp path 直接连 $q(0)$ 和 $q(1)$；碰到障碍就把 path 对半分，分别连 $q(0)\to q(1/2)$、$q(1/2)\to q(1)$，再碰就再分。车是 STLC、path 在 open 的 free space 里，这个过程一定会结束。

### Feedback control：跟踪一条 trajectory

三种问题：稳到一个 configuration（Theorem 13.1 说没有 continuous time-invariant 的解）；跟踪 trajectory $q_d(t)$；跟踪 path（不管时间）。后两个有 continuous time-invariant 的解。下面做 trajectory tracking，reference 的 nominal control $(v_d,\omega_d)$ 要在可行集的内部，留出纠错的余量，所以 reference 不能是 time-optimal 的。

**第一个想法：只控制一个点。** 选 chassis 上一点 $P$（$x_r\ne0$），对它做 P control $\dot x_P=k_p(x_{Pd}-x_P)$、$\dot y_P=k_p(y_{Pd}-y_P)$，再用上面 $J(q)^{-1}$ 换成 $(v,\omega)$。$P$ 一定会跟上 reference，希望 chassis 的朝向也随之对齐。问题在于 control law 里没有任何东西管朝向。

例：reference 沿 $x$ 轴以 $v_d=0.5$ m/s 直行，$\phi_d=0$。Robot 从 $(x,y)=(-0.3,0.4)$、$\phi=0$ 出发，$k_p=1$。$P$ 取在 wheel 轴后方 0.2 m（$x_r=-0.2$，比如装在车尾的 sensor）。Simulation：0.8 s 时 $\phi$ 已转到 $1.72$ rad，最后 $\phi=\pi$，$v=-0.5$：$P$ 精确地跟着 reference，可 robot 是倒着开的。道理是：向前开时 $P$ 在后面，像推着一辆手推车，朝向不稳定，转过来让 $P$ 在前面才稳。同样的设定取 $x_r=+0.2$，robot 正着开。

**把朝向 error 写进 control law。** 用 reference frame $\{d\}$ 表示 error：

$$q_e=\begin{pmatrix}\phi_e\\x_e\\y_e\end{pmatrix}=\begin{pmatrix}1&0&0\\0&\cos\phi_d&\sin\phi_d\\0&-\sin\phi_d&\cos\phi_d\end{pmatrix}\begin{pmatrix}\phi-\phi_d\\x-x_d\\y-y_d\end{pmatrix}$$

$(x_e,y_e)$ 是 $\{s\}$ 里的位置 error 写在 $\{d\}$ 里。书上的 feedforward 加 nonlinear feedback：

$$v=\frac{v_d-k_1|v_d|(x_e+y_e\tan\phi_e)}{\cos\phi_e},\qquad\omega=\omega_d-\big(k_2v_dy_e+k_3|v_d|\tan\phi_e\big)\cos^2\phi_e$$

Error 为 0 时就是 nominal control。$v$ 的第二项让 robot 追上或等 reference（减小 $x_e$），第三项用前进后退中影响 $y_e$ 的那一部分减小 $y_e$；$\omega$ 的第二项把车头转向 reference 以便将来减小 $y_e$，第三项减小朝向 error。$\phi_e\to\pm\pi/2$ 时 control 无界，所以假设跟踪中 $|\phi_e|<\pi/2$；它还要求 $v_d\ne0$，不适合 diff-drive 原地转的 reference。Stability 的证明超出了书的范围；gain 要大到能有效纠错，又不能大到让 control 在可行集边界上来回 chatter。

同一个例子，$k_1=1$、$k_2=4$、$k_3=2$：$\phi$ 最多偏到 $-0.38$ rad，2 s 时 $y$ 的 error 降到 0.02 m，12 s 时位置和朝向的 error 都小于 0.005，$v$ 回到 0.5，始终正着开。

::fig[mr-track] 同一个起点、同一条 reference（虚线，沿 $x$ 轴以 0.5 m/s 前进）。上：只控制车尾的点 $P$，robot 掉头，最后倒着开。下：(13.31) 的 control law，robot 正着贴上 reference。小三角是车头方向，彩色点是 $P$ 或 reference 的当前位置。

:::back
Pfaffian constraint 与 rolling coin 来自[第 1 站](#cspace)，twist 的 Lie bracket 来自[第 6 站](#dyn)，grid 与 sampling-based planner 来自[第 7 站](#plan)，feedforward 加 feedback 的思路来自[第 8 站](#control)。
:::

:::from
Unicycle、diff-drive、car 的 model（13.12 到 13.18 式）、canonical model 与 control 的换算、Pfaffian constraint、Figure 13.11 的四种 control set、点 $P$ 的 Jacobian（13.21 式）与 $x_r=0$ 的 singularity、Theorem 13.1、STLA 与 STLC 的定义及 car 的例子、parallel parking 的讨论、Lie bracket 的 Taylor 展开推导（13.26 到 13.28 式）、Example 13.5、Lie algebra、Theorem 13.7、Example 13.8 到 13.10（$\det=1$、$-r^2$、diff-drive 只有 4 维）、Dubins 与 Reeds–Shepp 的 shortest path 定理、diff-drive 的 40 种 minimum-time motion 与 Figure 13.17 的 LFR/FRB 例子、有障碍时的三种做法、三类 feedback 问题、点 $P$ 的 control law（13.29 式）及其“可能选反朝向”的缺陷、error coordinate（13.30 式）与 control law（13.31 式）及各项的解释，都来自 [Modern Robotics](https://hades.mech.northwestern.edu/images/2/25/MR-v2.pdf) 第 13.3 节（全文读过）。ME 449 跳过 13.3 节来自 [ME 449 课程页](https://hades.mech.northwestern.edu/index.php/ME_449_Robotic_Manipulation)。Diff-drive 与 car 的具体尺寸和 control set 数字、diff-drive 的换算验证、$\epsilon$ maneuver 的精确位移、Dubins 的两个例子（LSL 的手算与六种路径的长度，用自己写的 Dubins solver 算出）、FRB 例子的逐步核对、diff-drive 的 holonomic constraint 的积分式、两个 tracking simulation（$x_r=\mp0.2$ 时 robot 的朝向结果，以及“推手推车”的解释）、gain 的取值，是为这一页算的或自己的解释；书上 Figure 13.19 只说 point tracking 可能得到相反的朝向，没有说和 $P$ 在 wheel 轴前后有关，这一点是 simulation 看出来的。
:::

## 作业

两套作业。Coursera Specialization 的六门课，每章有一个 graded quiz、每段视频有一个 Lecture Comprehension quiz（需注册，题目没有读到），另有 peer-graded project：Course 2 一个（numerical IK；它的第 4 个 module 是第 7 章 closed chain，只有 quiz、没有 project）、Course 3 一个（UR5 在 gravity 下落下）、Course 4 两个（A*、sampling-based planning）、Course 5 两个（form closure、assembly 的 stability）、Course 6 就是 capstone。Course 4 到 6 的 handout 在课程 wiki 上公开；Course 2、3 的 handout 只在 Coursera 里，下面分别用内容相同的 ME 449 Assignment 3 和一份学生转抄的题面代替。Northwestern ME 449 Fall 2026 有自己的 Assignment 1 到 5（课程页的进度表把 Coursera 的 quiz 也排进去，每次上课前交），五份 handout 都读了。

所有作业共用两样工具。**MR code library**：Python、MATLAB、Mathematica 三个版本，在 GitHub 的 NxRLab/ModernRobotics，function 按书的章节分组，每个 function 的 comment 里带一个 example 和期望的 output；README 说它为了好读，既没有为效率也没有为 robustness 做优化。**CoppeliaSim edu**：免费，课程的 scene 是一包 `.ttt` 文件，也兼容 V-REP 3.4 以后的版本。全部作业用笔记本 CPU 就够，不需要 GPU。

### Capstone：Mobile Manipulation（先做）

**要从零写什么。** 三个 function 和一个把它们串起来的 program。`NextState`：给定当前 12 维 configuration（chassis 3 个、arm 5 个、wheel 4 个）、9 个 speed、$\Delta t$ 和 speed 上限，arm 和 wheel 用 first-order Euler step，chassis 用第 12 站的 odometry。`TrajectoryGenerator`：给定 gripper 初始 pose、方块的初始与目标 pose、grasp 与 standoff 时 gripper 相对方块的 pose，生成八段 reference（到方块上方、下降、合上 gripper、上升、移到目标上方、下降、张开 gripper、上升）。`FeedbackControl`：第 8 站的控制律加 $J_e^\dagger$。主程序每 0.01 s 循环一次，输出给 CoppeliaSim 的 CSV（每行 13 个数：chassis 3、arm 5、wheel 4、gripper 状态）和 $X_{\mathrm{err}}$ 的记录。

**做完会什么。** 第 2、3、4、8、12 站的内容在一个真实的 mobile manipulator 上用一遍；之后读到任何“end-effector delta pose action”“whole-body controller”都知道它底下在算什么。

**时间与算力。** Handout 估计约 20 小时（三个 milestone 加最终提交）。笔记本 CPU。

**交什么。** 一个 zip：README（说明做法、结果、偏离 handout 的地方、做了哪些 enhancement）、code、results 下三个 directory：`best`（调好的 feedforward 加 P 或 PI，平滑、无 overshoot，第 1 段走到一部分时 error 已经很小）、`overshoot`（调得差一些，有 overshoot 和振荡，但第 1 段结束前 error 消失）、`newTask`（自选方块的初始和目标 pose）。每个 directory 里要有 CSV、Scene 6 的视频、$X_{\mathrm{err}}$ 数据文件、六个 component 对时间的图、运行 log。15 秒的 motion 对应约 1500 行 CSV。

::fig[mr-capxerr] 用自己写的 kinematic simulation（没有 physics）跑出的两组 $X_{\mathrm{err}}$，初始偏 40°、0.47 m。上面可作 `best`，下面可作 `overshoot`：$\zeta=2/(2\sqrt6)=0.41$，单 joint 的 PI 理论预测越过零 35.7%，六个 component 实际在 36% 到 39% 之间。

**提示。**

- **每个 milestone 都先对 handout 的数值。** NextState：$u=(10,10,10,10)$ 跑 1 秒前进 0.475 m，$(-10,10,-10,10)$ 横移 0.475 m，$(-10,10,10,-10)$ 逆时针转 1.234 rad，speed 上限设 5 时都减半。FeedbackControl：$K_p=K_i=0$ 时 $\mathcal V_d=(0,0,0,20,0,10)$、$[\mathrm{Ad}]\mathcal V_d=(0,0,0,21.409,0,6.455)$、$X_{\mathrm{err}}=(0,0.171,0,0.080,0,0.107)$，speed 是 $(157.2,\dots,-745.7,0)$；$K_p=I$ 时 $\mathcal V=(0,0.171,0,21.488,0,6.562)$。Handout 原话的意思是：对不上就先修程序，别往下走。（来源：handout；第 8、12 站逐个复现过。）
- **调 gain 的顺序。** 先 $K_p=K_i=0$，只用 feedforward，并且让 robot 从 reference 的起点出发，确认 Scene 6 里能大致完成 pick-and-place；再加小的 diagonal $K_p$；$K_p$ 表现正常之后才加 $K_i$。Feedforward 不对时加 feedback 只会把问题盖住。$\mathcal V_d$ 别漏了 $1/\Delta t$，否则 feedforward 小 100 倍。（来源：handout。）
- **初始 error 有硬性要求。** Robot 的初始 end-effector pose 与 reference 的第一个 pose 至少差 30° 和 0.2 m。默认方块从 $(1,0,0)$ 搬到 $(0,-1,-\pi/2)$，reference 从 $\begin{pmatrix}0&0&1&0\\0&1&0&0\\-1&0&0&0.5\\0&0&0&1\end{pmatrix}$ 开始。（来源：handout。）
- **Overshoot 的那组比想象中好调。** PI 在 $t=0$ 时 $\dot X_{\mathrm{err}}=-K_pX_{\mathrm{err}}$，即使 $\zeta\ge1$ 也会越过零（第 8 站），所以 `overshoot` 不需要把 $\zeta$ 压得很低；上图 $K_p=2$、$K_i=6$ 就有约 36%。`best` 用纯 P 最省事。（来源：第 8 站的分析与上面的 simulation；kinematic simulation 没有 physics，在 Scene 6 里的数会有出入。）
- **Gripper 要停够 63 行。** Gripper 合上、张开最多要 0.625 s，CSV 里同一 gripper 状态至少连续 63 行，这期间 $\{e\}$ 保持不动。Standoff 放在方块上方几厘米。（来源：handout。）
- **Pseudoinverse 的 tolerance 有两种约定。** Handout 用 MATLAB 的 `pinv(M, tol)`：例子里写 `pinv(M, 1e-4)`（小于 0.0001 的 singular value 当 0），并建议再试 1e-3、1e-2；这是 singular value 的绝对门槛。NumPy 的 `np.linalg.pinv(a, rcond)` 是相对门槛：小于 `rcond` 乘最大 singular value 的才被当 0。上面测试里 $J_e$ 最大的 singular value 是 1.79，`rcond=1e-2` 相当于绝对门槛 0.018，会把第 6 个 singular value（0.0117）砍掉，测试数值就对不上了。照抄 handout 的数字之前先换算。（来源：handout 与 NumPy 的约定；数值是实算。）
- **Joint limit 这个 enhancement 值得做。** 写 `testJointLimits(θ)`，joint 3、4 限制在约 $-0.2$ rad 以下（可以在 Scene 3 里拖 slider 找不自撞的范围）；下一步会越限时，把 $J_e$ 对应的 column 置 0 再算 speed。初始 configuration 本身要满足 limit。（来源：handout；不加 limit 时 $\theta_3$ 会穿过 0，见第 12 站。）
- **Scene 6 保持默认的 ODE engine 和 10 ms 的 timestep。** Handout 说 ODE 在抓方块时结果最好、最好理解；timestep 改了，CSV 的一行就不再是 0.01 s。方块在 gripper 里打滑是 contact simulation 的近似，handout 没有给修法，只能把 grasp 对准。第一次跑一个 CSV 时，开头几分之一秒 gripper 的 finger 会怪异地自己复位，不想看到就把同一个 CSV 再跑一次。（来源：handout。）
- **Reference 的每一段怎么排时间。** 每段时长取 0.01 s 的整数倍；一个办法是取“距离除以最大 linear speed”和“转角除以最大 angular speed”中较大的那个。第 2、4、6、8 段是上下移动，用 cubic 或 quintic time scaling 约 1 秒即可；第 1、5 段用 `ScrewTrajectory` 或 `CartesianTrajectory` 加三次或五次的 time scaling。`TrajectoryGenerator` 的参数 $k$ 是每 0.01 s 生成几个 reference（$k=1$ 就够），输出到 Scene 8 检查时每行 13 个数：$T_{se}$ 前三行的 9 个 rotation entry、3 个 position、gripper 状态。（来源：handout 与 CoppeliaSim Introduction 页面。）
- **Speed limit 挡住了 reference 时**，要么去掉 limit，要么把 trajectory 拉长。Feedforward 跟不上 reference 时，查 Jacobian、pseudoinverse 和 milestone 2 的 reference。（来源：handout。）
- **CoppeliaSim 装不上或读错 CSV。** macOS 启动就崩：在 app 所在 directory 运行 `sudo xattr -r -d com.apple.quarantine *`。Linux 下系统地区用逗号作小数点时 CSV 会读错：用 `LC_NUMERIC=en_US.UTF-8 ./coppeliaSim.sh` 启动。录屏报 “The video compressor failed initializing”：把输出格式从默认的 H.263+ 改成 AVI/MPEG-4 part 2。加载 CSV 要输入完整路径。（来源：Getting Started with the CoppeliaSim Simulator 页面。）

### ME 449 Assignment 1：Grübler、CoppeliaSim 入门与 UR5 的 joint angle（值得做 Part 3）

**要做什么。** Fall 2026 在 10 月 7 日布置、10 月 14 日交。Part 1 用 Grübler's formula 算书上 Figure 2.18(c) 和 Figure 2.21(c) 两个 mechanism 的 dof，说出“板擦平贴着白板擦”的 task space 的 dof 和 topology，再按 wiki 上的 DOF of the Human Arm 页面数人类手臂的 joint 一共施加了多少 constraint（bonus：各 joint 的类型、自由度和解剖学名字）。Part 2 在 CoppeliaSim 里搭一个 Pioneer_p3dx mobile robot 和至少五面 80 cm 高的墙的 scene，robot 至少要和其中三面墙“打交道”（开过去再避开），录一段移动镜头的 video；再改 UR5 Scene 1 的 UI script（Lua 加 XML），交改动的截图和说明。Part 3 给出 UR5 一系列相邻 frame 之间的 rotation matrix（$R_{13}$、$R_{s2}$、$R_{25}$、$R_{12}$、$R_{34}$、$R_{s6}$、$R_{6b}$），已知各 joint axis，求六个 joint angle 和 $R_{sb}$，并在 scene 里核对。

**做完会什么。** Part 3 逼你把 matrix log 和 joint axis 对上：由 $R_{12}$ 求出的 $\hat\omega\theta$ 应当沿 joint 2 的 axis，$\theta$ 就是 joint angle。这是 capstone 之前最好的热身。

**时间与算力。** Handout 没有写；估计 4 到 6 小时，大半花在第一次装 CoppeliaSim 上（估计）。笔记本 CPU。

**提示。**

- 只想练 kinematics，做 Part 3 就够；Part 2 主要是熟悉 CoppeliaSim 的 interface。（来源：研究底稿的判断，读 handout 后同意。）
- Part 3 先求出 $R_{s1}$ 和每个 $R_{i,i+1}$，再对每个用 `MatrixLog3`。（来源：handout。）
- 打开 child script 或 UI script 之前要 stop simulation，pause 不行。（来源：handout。）
- Video 要小：handout 一处说几 MB，一处说不超过 20 MB，按小的来。Part 3 要写出方法和 code，不能只给数字。交一个 `FamilyName_GivenName_asst1.zip`，里面一个 PDF 加 video。（来源：handout。）

### ME 449 Assignment 2：第 3 到 5 章的手算题（值得做第 4 到 7 题）

**要做什么。** Fall 2026 在 10 月 16 日布置、10 月 23 日交，可以用 MR library。共 11 题：书上习题 3.5、3.6（由 rotation matrix 求 exponential coordinates）、3.16（两个 frame $\{a\}$、$\{b\}$ 的 $T_{sa}$、$T_{sb}$ 及其换算）；第 4 题画出 screw axis $\mathcal S=(1,0,0,0,0,-2)$ 并给出一组 $(q,\hat s,h)$；第 5 题一辆以固定半径转弯的车（rotation axis 离 $\{b\}$ 的 origin 2 个单位，$\{b\}$ 的 origin 在 $\{s\}$ 的 $(4,1,0)$），依次求 $T_{sb}$、$\mathcal S_b$、$\mathcal S_s$，再分别算 $e^{[\mathcal S_s]\pi/2}T_{sb}$、$T_{sb}e^{[\mathcal S_s]\pi/2}$、$e^{[\mathcal S_b]\pi/2}T_{sb}$ 并画出车被带到哪里；第 6 题一个 body 以 constant twist 用 5 秒从 $\{c\}$ 走到 $\{d\}$，问 2 秒时在哪（用 $T_{cd}$ 表示）；第 7 题已知 $\{c\}$ 在 $\{a\}$ 里的 exponential coordinates $\mathcal S\theta$，把 $\mathcal F_a$ 换到 $\{c\}$；最后是习题 4.2（RRRP SCARA 的 $M$、$\mathcal S_i$、$\mathcal B_i$，用 `FKinSpace`、`FKinBody` 互相核对）、4.5（UR5 的 $\mathcal B_i$）、4.10（URRPR chain，另求 home 时的 $J_s$、$J_b$）、5.2（planar 3R 在给定 wrench 下的 joint torque）。

**做完会什么。** 第 2、3 站的每一种换算都亲手做一遍；第 5 题的三个乘积正好是开头“第二次失败”的系统版本：同一个 screw 写在哪个 frame、乘在哪一边，车的去向完全不同。

**时间与算力。** Handout 没有写；估计 6 到 8 小时（估计）。笔记本 CPU。

**提示。**

- 第 5 题 (e) 的乘法顺序 handout 说是“故意的”：右乘的 exponential 把 twist 当成写在 $\{b\}$ 里，而 $\mathcal S_s$ 是写在 $\{s\}$ 里的，结果对应一条“错位”的 screw axis。先按第 2 站的规则判断每个乘积里的 twist 被当成写在哪个 frame，再去算。（来源：handout 的原题；解释是第 2 站的内容。）
- 第 6 题不需要知道 twist 的数值：constant twist 走 5 秒到 $T_{cd}$，走 2 秒就是同一个 exponential 乘 $2/5$，即 $\exp\big(\tfrac25\log T_{cd}\big)$，和第 8 站 screw path 的 $X(s)$ 是同一个 formula。（来源：第 2、8 站的推导。）
- 第 7 题用第 2 站的 $\mathcal F_c=[\mathrm{Ad}_{T_{ac}}]^\top\mathcal F_a$，这里 $T_{ac}=e^{[\mathcal S]\theta}$。（来源：书 3.4 节。）
- 第 10 题的 home configuration 下，$J_s$ 的 column 就是 $\mathcal S_i$，$J_b$ 的 column 就是 $\mathcal B_i$（第 4 站），不用再算 adjoint。（来源：书 5.1 节。）

### ME 449 Assignment 3 与 Coursera Course 2 project：把 Newton–Raphson IK 的每一步打印出来（先做）

**要做什么。** 两者的核心是同一件事，也就是书上的习题 6.9（Coursera Course 2 的 project 题面不在 wiki 上；一个学生仓库里的提交，函数名、打印的内容和 CSV 格式都与 ME 449 Assignment 3 Part 1 相同，只是目标 pose 不一样）。以 MR library 的 `IKinBody` 为基础写 `IKinBodyIterates`：每一步打印 iteration 编号、joint vector $\theta^i$、$T_{sb}(\theta^i)$、error twist $\mathcal V_b$、$\|\omega_b\|$ 和 $\|v_b\|$（格式仿照书上 6.2 节那张表），把每一步的 $\theta^i$ 存成 matrix 的一行，结束时写成 CSV。Tolerance $\epsilon_\omega=0.001$ rad、$\epsilon_v=10^{-4}$ m。Robot 是 UR5（书上 Example 4.5 的 $M$ 和 $\mathcal B_i$），目标

$$T_{sd}=\begin{pmatrix}0&0&-1&0\\0&-1&0&0.5\\-1&0&0&0.5\\0&0&0&1\end{pmatrix}$$

自己找两个初始猜测：一个 2 到 4 步就收敛（short），一个 10 步以上或根本不收敛（long）。交三张图（两个猜测画在同一张上）：end-effector 位置 $(x,y,z)$ 随 iteration 的 3D 轨迹、$\|v_b\|$ 对 iteration、$\|\omega_b\|$ 对 iteration；两个 CSV 在 CoppeliaSim Scene 2 里各录一段 video（取消 “Interpolate”，每行一帧，每个小于 10 MB），并解释 long 的那个为什么难收敛。ME 449 版本另有 Part 2 的问答：robot 从静止的 $\theta_0$ 到静止的 $\theta^*$，用时 $t_f$；(a) 若命令 constant joint speed，$\dot\theta$ 是多少；(b) 若要 end-effector 走一个 constant body twist，$t=0$ 和 $t=t_f/2$ 时分别命令什么 $\dot\theta$；(c) 比较两种做法。Fall 2026 在 11 月 6 日交。

**做完会什么。** 第 4 站的 IK 从一张表变成自己能观察的过程：收敛快慢取决于初始猜测离哪一组解近、中途有没有经过 singularity。

**时间与算力。** Handout 没有写；Coursera 课程页把这个 peer review 标为 60 分钟（那是评别人作业的时间）。估计 4 到 6 小时（估计）。笔记本 CPU。

**提示。**

- 每更新一次就把 joint angle 用 `atan2(sin θ, cos θ)` 拉回 $(-\pi,\pi]$，否则 long 的那组 angle 会累积到几十 rad，video 里看不出问题在哪。（来源：handout。）
- Newton step 用 body Jacobian 的 pseudoinverse，和 `IKinBody` 一样；$\mathcal V_b$ 用 `MatrixLog6` 和 `se3ToVec` 算（第 4 站的 $\log(T_{sb}^{-1}T_{sd})$）。（来源：handout。）
- 先用第 4 站 Example 6.1 的 2R 测试你的 `IKinBodyIterates`：应当打印出那张表的四行。（来源：书；表是为这一页实算的。）
- Long 的初始猜测可以在 Scene 1 里拖 slider 找：让 arm 处在和目标 pose“翻过来”的姿态，或者靠近 singularity（例如 joint 3 接近 0，arm 伸直）。（来源：handout 建议用 slider；“伸直”的建议来自第 4 站的 singularity 分析。）
- Part 2 (b)：constant body twist 是 $[\mathcal V_b]=\frac{1}{t_f}\log(T_0^{-1}T_{sd})$；$t=0$ 时 $\dot\theta=J_b^\dagger(\theta_0)\mathcal V_b$，$t_f/2$ 时 end-effector 在 $T_0e^{[\mathcal V_b]t_f/2}$，要先求出这个 pose 对应的 $\theta$（又是一次 IK），再在那里算 $J_b^\dagger$。(c) 要比较 end-effector 是否走直线、joint speed 是否有界、会不会经过 singularity、会不会越过 joint limit。（来源：handout 的 hints；具体式子是第 4、8 站的内容。）

### ME 449 Assignment 4 与 Coursera Course 3 project：UR5 在 gravity 下落下（有余力再做）

**要做什么。** Coursera Course 3 的 project：给定初始 configuration、初速为 0、joint torque 全为 0，用 MR library 的 forward dynamics 模拟 UR5 在 gravity（$g=9.81$，沿 $-z$）下落，每秒至少 100 个 integration step，把每一步的六个 joint angle 写成 CSV，在 Scene 2 里放 video。两段：从 home configuration 落 3 秒；joint 2 在 $-1$ rad、其余为 0，落 5 秒。（题面来源是一个学生仓库里转抄的版本，Coursera 课程页把它标为 150 分钟。）ME 449 Fall 2026 的 Assignment 4（“Puppet on a String”）把它扩成四部分：写 `Puppet(thetalist, dthetalist, g, Mlist, Slist, Glist, t, dt, damping, stiffness, restLength)`，每一步算 spring 对 end-effector 的 wrench、调用 `ForwardDynamics`、用 `EulerStep` 更新。Part 1 无 damping 无 spring 落 10 秒，交两个 $dt$：一个能让 total energy 基本守恒，一个太大、energy 明显漂移；Part 2 加 joint damping $\tau=-(\text{damping})\dot\theta$，一个正值让 robot 10 秒内几乎停下，一个负值让它越摆越猛；Part 3 去掉 gravity，加一根 rest length 为 0 的 spring 把 $\{b\}$ 的 origin 拉向 $(0.5,0,1)$，先无 damping（10 秒内振荡几次），再加 damping；Part 4 让 spring 的一端在 $(0.5,-1,1)$ 和 $(0.5,1,1)$ 之间正弦往返两次，就是一个最简单的 impedance control。原定 11 月 13 日、后改到 11 月 16 日交。

**做完会什么。** [第 6 站](#dyn)的 forward dynamics 在一个真实的 6R arm 上跑起来，亲眼看到 Euler integration 的 energy drift；Part 3、4 的 spring 是[第 10 站](#force) impedance control 最简单的形式（只 render 一个 $K$，$M=B=0$）。

**时间与算力。** Handout 没有写；估计 Course 3 的版本 3 到 4 小时，ME 449 的版本 8 到 10 小时（估计）。纯 Python 的 `ForwardDynamics` 每步要做一次 inverse dynamics 和 mass matrix，10 秒、$dt=0.001$ 是一万步，笔记本 CPU 上要跑几分钟。

**提示。**

- Energy 的检查：kinetic energy 是 $\tfrac12\dot\theta^\top M(\theta)\dot\theta$（`MassMatrix`），potential energy 是各 link center of mass 的 $-m_ig^\top p_i$ 之和（位置由 forward kinematics 求，质量从 `Glist` 读），有 spring 时再加 $\tfrac12k(d-\text{restLength})^2$。画 total energy 对 time 的曲线，守恒的那组应当几乎是平的。（来源：handout。）
- 调 $dt$ 时，“够小”的意思是再减半 energy 曲线也不再明显变化。Euler step 对这种无 damping 的振荡系统会持续注入 energy，所以 $dt$ 太大时 robot 会越摆越高，而不是停下。（来源：handout 要求展示 drift；“注入 energy”的原因见第 6 站 forward dynamics 一节：explicit Euler 每步把振幅放大 $\sqrt{1+\omega^2\Delta t^2}$ 倍。）
- 写好的 `Puppet` 先拿第 6 站的 2R 自测：两个 point mass 的 `Glist` 取 $\mathrm{diag}(0,0,0,1,1,1)$，从水平静止松开，第一步的 $\ddot\theta$ 应当是 $(-9.81,9.81)$；$\Delta t=0.01$ 跑 3 秒，energy 应当漂到约 4.6 J，$\Delta t=0.001$ 约 0.44 J。（来源：第 6 站，用 MR library 的 `ForwardDynamics` 和 `EulerStep` 实算。）
- `ForwardDynamics` 的参数 `Ftip` 是 end-effector **对外**施加的 wrench，写在 $\{n+1\}$（end-effector frame）里。Spring 拉 end-effector 的力 $f$ 是外界对 robot 的作用，传进去时要取 $-f$，并且先用 $R_{sb}^\top$ 转到 $\{b\}$；作用点在 $\{b\}$ 的 origin，moment 为 0。（来源：MR library user manual 对 `Ftip` 的定义；handout 提醒去查这个约定。）
- Video 用 Scene 2，调 Time Multiplier 让每段在约 10 秒的真实时间里放完。（来源：handout。）

### ME 449 Assignment 5：第 6、8、9、11 章的问答（考前练手）

**要做什么。** 11 月 25 日交。习题 6.7（手画一个有两个 root 的 $f(\theta)$，让 Newton–Raphson 越过近的 root 收敛到远的那个，最多画三步）、6.8（用 Newton–Raphson 对 $g(x,y)=(x^2-4,\ y^2-9)$ 从 $(1,1)$ 出发手算两步，并列出全部 root）、8.2（铸铁 dumbbell 的 rotational inertia 和 spatial inertia matrix）；一个两 joint robot 的 Lagrangian 中某一项对 $\tau_1$、$\tau_2$ 的贡献，归到 mass matrix、Coriolis/centripetal 或 gravity 的哪个 entry；用白话解释 Newton–Euler inverse dynamics 的三条 forward iteration 和两条 backward iteration 中每一项为什么出现；习题 9.2（给定 path 与 time scaling 求 $\dot X$、$\ddot X$）、9.3（constant screw path 上的 twist 与 acceleration）、9.22（time-optimal time scaling 算法的正确性）、11.6（mass–spring–damper 的 P、D、PD 控制）；最后是 2025 年 Quiz 2 的一道 time-optimal time scaling 题。

**做完会什么。** 第 4 站 Newton 法的几何、[第 6 站](#dyn)的 Lagrangian 与 Newton–Euler、[第 9 站](#timeopt)的 phase plane、第 8 站的 error dynamics 用题目过一遍。

**时间与算力。** Handout 没有写；估计 6 到 8 小时（估计）。纸笔为主。

**提示。**

- 习题 9.3：constant screw path 是 $X(s)=X_{\mathrm{start}}e^{[\mathcal S]s}$，其中 $[\mathcal S]=\log(X_{\mathrm{start}}^{-1}X_{\mathrm{end}})$。对 time 求 derivative，body twist 就是 $\mathcal S\dot s$，acceleration 是 $\mathcal S\ddot s$（screw axis 不变）。（来源：第 8 站 screw path 的 formula；推导凭自己的知识写。）
- 习题 11.6 的套路就是第 8 站：写出 error dynamics，和 $\ddot x_e+2\zeta\omega_n\dot x_e+\omega_n^2x_e=0$ 对照读出 $\zeta$、$\omega_n$。（来源：书 11.2 节。）
- Lagrangian 那一题：对给出的那一项分别算 $\frac{d}{dt}\frac{\partial}{\partial\dot\theta_i}-\frac{\partial}{\partial\theta_i}$，$i=1,2$。$\frac{d}{dt}$ 要连同 $\sin\theta_1$ 这类 configuration 的函数一起求（第 6 站推 $\tau_2$ 时 $\dot c_2=-s_2\dot\theta_2$ 那一步）。结果里含 $\ddot\theta_j$ 的归 $M_{ij}$；含 $\dot\theta_j^2$ 的是 centripetal、含 $\dot\theta_j\dot\theta_k$（$j\ne k$）的是 Coriolis，都归 $c_i$；不含 velocity 也不含 acceleration、来自 potential energy 的归 $g_i$。（来源：书 8.1 节；分类规则是第 6 站的内容。）
- Newton–Euler 用白话解释那一题：第 6 站 Newton–Euler 一节对 $\dot{\mathcal V}_i$ 的三项和 $\mathcal F_i$ 的三项各给了一句话，2R 的手算表每一行也写了物理读法，可以对照着检查自己的说法。（来源：书 8.3 节；读法是第 6 站自己写的。）
- 习题 9.2：chain rule，$\dot X=\frac{dX}{ds}\dot s$，$\ddot X=\frac{dX}{ds}\ddot s+\frac{d^2X}{ds^2}\dot s^2$，和第 9 站推 $m(s)$、$c(s)$ 时对 $\theta(s)$ 做的一样。（来源：书 9.4 节的推导。）
- 习题 9.22：(a) 想一想 $F$ 本身是哪个 ODE 的 integral curve，再想同一个 ODE 的两条 integral curve 能不能相交；(b)、(c) 看 velocity limit curve 上的 motion cone 只剩一个方向这件事。第 9 站 gantry 的切点落在 zero-inertia point 的尖底，是这个论证的一个特殊情形。（来源：书 9.4.2、9.4.3 节；提示的写法是自己的。）
- 2025 年 Quiz 2 那道 phase plane 题：判断一个 state 能不能停留在 path 上，就是比较 $L=\max_iL_i$ 和 $U=\min_iU_i$（第 9 站 $(0.25,0.8)$ 的例子）；motion cone 的两条边是 $(\dot s,L)$ 和 $(\dot s,U)$ 这两个方向，$\dot s=0$ 处 cone 是竖直的；time-optimal 解永远在 $U$ 或 $L$ 上，至少一个 actuator 饱和（第 9 站动图里的两根 force bar）。（来源：书 9.4 节与 [Assignment 5 handout](https://hades.mech.northwestern.edu/images/8/8a/ME449-asst5-2026.pdf)。）

### Course 4：A* graph search 与 sampling-based planning（值得做）

**要做什么。** 第一个 project 实现 A* search：读 `nodes.csv`、`edges.csv`，node 1 是 start、node $N$ 是 goal，输出 `path.csv`（一行 node ID，从 1 到 $N$；找不到时只写 `1`），交上去的 `edges.csv` 要删掉 node 4 与 node 7 之间的那一条 edge（只删这一条）。第二个 project 在 $[-0.5,0.5]^2$ 里为一个 point robot 实现 RRT 或 PRM（二选一），obstacle 是 `obstacles.csv` 里的 circle，start 在左下角、goal 在右上角，local planner 走 straight line，collision check 自己写，输出 nodes、edges、path 三个 CSV，在 CoppeliaSim 的 Scene 5（kilobot）里显示。

**做完会什么。** 第 7 站的 RRT 或 PRM 从零跑通一次；PRM 那条路线还会把 A* 再用一遍。

**时间与算力。** Handout 没有写；估计各 3 到 5 小时（估计）。笔记本 CPU。

**提示。**

- 先把示例 scene 跑起来，确认 graph、obstacle 和 kilobot 的 path 都能显示，再写 code。（来源：A* handout。）
- Collision check 先解 line 与 circle 的交点（0、1 或 2 个），再确认交点落在 segment 内；漏掉第二步是最常见的错（第 7 站的例子）。也可以沿 segment 密集取点检查，handout 认为次之。（来源：sampling-based planning handout。）
- RRT 取 goal 当 sample 的比例 handout 建议 10% 左右；PRM 记得把 start 和 goal 也当成 sample，node 数和 $k$ 要大到 start 与 goal 大概率落在同一个 connected component 里。（来源：handout。）
- 截图要和交上去的 CSV 对应。效率不评分，清晰才评分。（来源：handout。）
- `obstacles.csv` 每行 `x, y, diameter`：第三个数是 **diameter**，不是 radius。Sampling-based planning 的 handout 正文只说 obstacle 的 radius 是 $R$，没有说明这一列；Scene 5 的说明和 obstacles.csv 文件自己的注释行都写明是 diameter。写 collision check 时先除以 2，robot 有半径 $r$ 时再加上 $r$。`nodes.csv` 每行 `ID, x, y, heuristic-cost-to-go`，`edges.csv` 每行 `ID1, ID2, cost`。（来源：CoppeliaSim Introduction 页面的 Scene 5；一个学生仓库里原样保留的 obstacles.csv。）

### Course 5：Evaluating form closure（有余力再做）

**要做什么。** 写一个 planar form closure 的检验 program：每个 contact 给出 body 上的 $(x,y)$ 和 inward normal 的 angle，输出 “form closure” 或 “not form closure”，是的话再给出一个 $k$。交两组自己设计的 contact（最好只差一个 contact 的位置或 normal），各附一张图，非 form closure 的那组还要用书上 12.1 节的图解法画出可行的 rotation center 区域。

**做完会什么。** 第 11 站的 rank 加 LP 检验，以及 contact 怎样一个一个地挡住 motion。

**时间与算力。** Handout 没有写；估计 2 到 4 小时（估计）。笔记本 CPU。

**提示。**

- Python 用 `scipy.optimize.linprog`。$Fk=0$ 本身总有 $k=0$ 这个解，所以约束要写成 $k_i\ge1$（第 11 站）。（来源：handout 提醒先读书上 12.1.7 节的写法；书。）
- 别忘了 rank 条件：LP 有解但 rank 不足的情况见第 11 站的 (b)。（来源：书；例子是为这一页算的。）
- Handout 提到 equality constraint 的 matrix 不是 full rank 时 simplex method 可能报错，可以改用 `method='interior-point'`。新版 SciPy 的 `linprog` 默认用 HiGHS，在 SciPy 1.18 里调用 `interior-point` 会给出 deprecation warning；直接用默认的 method 即可，第 11 站的例子就是用 HiGHS 算的。（来源：handout；warning 是在 SciPy 1.18.1 上实际跑出来的。）
- 用自己的例子，不要交 handout 上那个六边形；那个例子只用来自测。（来源：handout。）
- 非 form closure 那组要画的可行 rotation center 区域，按第 11 站图解法一节的规则画：每个 contact 的 normal 线左侧标 '+'、右侧标 '−'，取所有 contact 一致的部分。用程序画时，每个 contact 是一个 half-plane，依次把一个大方框按 half-plane 裁剪（每次裁剪就是 polygon 和一条直线求交），第 11 站的图就是这样算出来的。（来源：书 12.1.6 节；做法是自己的。）

### Course 5：Stability of an assembly（有余力再做）

**要做什么。** 写一个 program 判断一组 planar rigid body 互相靠着、在 gravity（沿 $-y$）下能否静止。输入：每个 body 的 center of mass $(x,y)$ 和 mass；每个 contact 的两个 body 编号（0 是地面）、位置 $(x,y)$、指向第一个 body 的 normal angle、friction coefficient $\mu$，例如 $(1,2,60,60,3.1416,0.5)$。输出“能站住”或“会倒”，能站住时最好给出一组 $k$。方法是书上 12.3 节 Example 12.11 的 $Fk+F_{\mathrm{ext}}=0$、$k\ge0$（第 11 站最后一节）。Handout 给了一个两 body 的测试：$m_1=2$、$m_2=5$、body 1 与地面之间 $\mu=0.1$、其余 0.5 时会倒；$m_1=2$、$m_2=10$、四个 contact 都是 0.5 时能站。交 code、两个测试的 log，以及一个至少两个 body 的自己设计的 assembly（可以照书上 Figure 12.27 的三块石头的 arch），给出一组让它倒和一组让它站的 $\mu$，并解释；选做：三块石头一样时，能站住的最小 $\mu$。

**做完会什么。** 第 11 站的 LP 从“一个 body 被 finger 卡住”推广到“几个 body 互相支撑”，学会正确处理内部 contact 的作用力与反作用力。

**时间与算力。** Handout 没有写；估计 3 到 5 小时（估计）。笔记本 CPU。

**提示。**

- 每个 contact 两条 friction cone edge，$n$ 个 contact 就是 $2n$ 个未知数；$m$ 个 body 是 $3m$ 个 equation。$k$ 只要求 $\ge0$，不要照抄 form closure 的 $k_i\ge1$。（来源：handout。）
- 内部 contact 的 edge 在第二个 body 的 equation 里要取相反数；程序对明显能站的 assembly 也报“会倒”时，先查这里（第 11 站的 :::wrong）。（来源：书 Example 12.11 的说明；症状是为这一页实算的。）
- 先用第 11 站的 A 字形木板自测：$\mu_g=0.37$ 应当倒，$0.38$ 应当站。（来源：为这一页实算的例子。）
- 和 form closure 的 project 一样，旧版 SciPy 的 simplex 在 equality matrix 不 full rank 时会出错，handout 建议 `method='interior-point'`；新版直接用默认的 HiGHS。（来源：handout；SciPy 的现状见上一个 project 的提示。）
