---
code: MIT-6.4210
evidence: syllabus
evidenceNote: "前沿公开课，不是 NUS 课。期次：MIT 6.4210/6.4212 Fall 2026（Tomás Lozano-Pérez、Leslie Kaelbling、Russ Tedrake）。讲法以 Tedrake 的在线教材 Robotic Manipulation 为准。这一版修订把教材的源码仓库 RussTedrake/manipulation（2026-11-21 的版本）clone 下来，逐字读了第 3、4、5、6、8 章的 HTML 原文和第 3 章 notebook 里的 keyframe 代码；第 2、7、9 到 12 章没有读（ps7 指定的第 11 章 model-based 部分也没有读），imitation learning 一章（visuomotor policies）在仓库里只是一个空的 draft。作业部分 clone 了 handout 仓库 tlpmit/6.4210-2-fall26-handouts，ps1 到 ps7 的题目 PDF（不含解答）逐字读了全文，README 也读了。课程网站上带解答的 PDF 这次请求访问没有得到批准，所以页面上凡是只有解答里才有的数（某些 test 的输出、Gradescope 答案）沿用上一版从解答摘要里抄的数，没有能再核对，正文里逐处注明。Schedule 页只有 midterm 复习用的 PDF 链接，没有讲次表；project 页没有读到。Fall 2026 的录像只对注册学生开放，Fall 2023 的 YouTube 录像没有看。"
exam: "无考试意义上的期末；Fall 2026 的 6.4210 按课程主页：assignments 5%，两次 midterm（10 月 14 日、11 月 16 日）共 35%，journal club 与 peer review 5%，CI-M 写作相关 5%，project proposal 10%、report 30%、video 10%。6.4212 是 assignments 5%、midterms 45%、project 合计 50%。Gradescope 评分不对外，自学时以 problem set 为主。"
subskills:
  - id: pick
    name: Monogram notation、spatial velocity 与 pick-and-place 的 keyframe
    l3: "能读懂 ${}^Bp^C_W$、${}^AX^B$、${}^AV^B_C$ 这类写法，并按规则把一串 transform 接起来。"
    l4: "能独立算出一个 vector 在不同 frame 下的分量，写出 grasp、pregrasp 的 pose 和一条带时间的 keyframe 序列。"
    l5: "能从 ${}^Ap^C={}^Ap^B+{}^AR^B\\,{}^Bp^C$ 推出 translational velocity 的加法为什么多一项 $\\omega\\times p$，并说清 $\\dot q$ 与 $v$ 何时不同。"
  - id: diffik
    name: Differential IK：从 pseudoinverse 到 QP
    l3: "能用 pseudoinverse 把 spatial velocity 换成 joint velocity，并说出它在 singularity 附近会给出多大的数。"
    l4: "能独立把带 velocity、position、acceleration limit 的 differential IK 写成 QP，并对 2 个 joint 的例子手算 clip、QP 与 max α 三种解。"
    l5: "能解释 least-squares QP 为什么仍会让 gripper 偏离方向，以及只看一步的 position limit 为什么在有 acceleration limit 时会冲过 limit。"
  - id: pose
    name: Point cloud registration 与 ICP
    l3: "能说出 depth camera 的几种失败方式，并按步骤写出 ICP 的一轮。"
    l4: "能独立对已知 correspondence 的 2D 点集手算最优的 θ 和 translation，写出 3D 的 SVD 解和 determinant 修正。"
    l5: "能证明 ICP 的 cost 单调不增，并用例子说明为什么它仍会停在错的 pose 上，以及 outlier 怎样拉偏 translation。"
  - id: grasp
    name: Contact、normal estimation 与 antipodal grasp
    l3: "能写出 Coulomb friction cone，并判断两点 grasp 的两端是否落在 cone 里。"
    l4: "能独立用 PCA 从一个 window 的点估出 normal（含方向的选择），并实现 antipodal grasp 的采样与过滤。"
    l5: "能解释两个 point contact 为什么挡不住绕 grasp axis 的 torque，以及 depth 边缘为什么会给出歪掉的 normal。"
  - id: plan
    name: Motion planning：IK as optimization、collision check 与 trajectory optimization
    l3: "能把一个 grasp 要求写成 IK 的 constraint，并说出 IK 为什么是 nonconvex 的。"
    l4: "能独立用 clearance 和 motion bound 判断一段 joint-space segment 是否被证明为 collision-free，并用 Bézier 的 control point 写出 velocity limit。"
    l5: "能证明那个 segment 条件，说清 control point 上的 bound 有多保守，以及 GCS 用什么换掉了“只在 sample 上检查 collision”。"
  - id: force
    name: Force control 与 hybrid position/force control
    l3: "能说出 point finger 在 position control 与 force control 下碰到桌面时各会发生什么。"
    l4: "能独立为一个擦桌面的任务选择每个方向用 position 还是 force，算出接触 force，并推出拖书、翻 box 时各个 contact 不打滑的 friction 条件。"
    l5: "能解释 stiffness control 为什么也是一种 force control，以及 iiwa 上为什么用 joint impedance 加 $\\tau_{ff}$ 来做 Cartesian force。"
  - id: policy
    name: Imitation learning 的工程选择：action 的表示与评估
    l3: "能说出 velocity command 与 position target、relative 与 absolute action 的差别。"
    l4: "能独立把 6 个数通过 Gram–Schmidt 变成 rotation matrix，并对两个 policy 的 success rate 做 z-test。"
    l5: "能用数字说明 absolute action 为什么要求更高的精度、80% 对 60% 为什么 10 次 trial 说明不了问题，以及要多少次才够。"
open:
  - label: "MIT 6.4210 Fall 2026 课程主页与 schedule"
    url: "https://manipulation.csail.mit.edu/Fall2026/index.html"
    note: "评分方式、日期。Schedule 页这次读到了：上课时间地点和 midterm 复习用的 PDF 链接，页面上没有讲次表。"
  - label: "Robotic Manipulation 第 3 章：Basic Pick and Place"
    url: "https://manipulation.mit.edu/pick.html"
    note: "第 1、2 站的讲法来源。逐字读了源码仓库里的 HTML 和 pick.ipynb 的 keyframe 代码。"
  - label: "Robotic Manipulation 第 4 章：Geometric Pose Estimation"
    url: "https://manipulation.mit.edu/pose.html"
    note: "第 3 站的讲法来源，逐字读了全文和 exercises。"
  - label: "Robotic Manipulation 第 5 章：Bin Picking"
    url: "https://manipulation.mit.edu/clutter.html"
    note: "第 4 站的讲法来源，逐字读了 contact、normal、grasp 三部分。"
  - label: "Robotic Manipulation 第 6 章：Motion Planning"
    url: "https://manipulation.mit.edu/trajectories.html"
    note: "第 5 站的讲法来源，逐字读了 IK、trajectory optimization、GCS、IRIS、time-optimal path parameterization 各节。"
  - label: "Robotic Manipulation 第 8 章：Manipulator Control"
    url: "https://manipulation.mit.edu/force.html"
    note: "第 6 站的讲法来源，逐字读了全文和 exercises。"
  - label: "教材源码仓库 RussTedrake/manipulation"
    url: "https://github.com/RussTedrake/manipulation"
    note: "上面五章的 HTML 原文和 notebook 都从这里读。"
  - label: "Handout 仓库 tlpmit/6.4210-2-fall26-handouts（README 与 ps1 到 ps7 的题目 PDF）"
    url: "https://github.com/tlpmit/6.4210-2-fall26-handouts"
    note: "环境配置；七份 problem set 的题目全文（不含解答）；ps7 的 hybrid force control 代码。第 1、2、4 到 7 站的许多例子来自这里。"
  - label: "6.4210 Fall 2026 Problem Set 2 到 6 的带解答 PDF"
    url: "https://manipulation.csail.mit.edu/Fall2026/ps3.pdf"
    note: "上一版读的是 WebFetch 给的解答摘要；这次请求访问没有得到批准，解答里的数没能再核对。"
sources:
  - label: "6.4210 Fall 2026 schedule（problem set 与 midterm practice 的 PDF 链接）"
    url: "https://manipulation.csail.mit.edu/Fall2026/schedule.html"
  - label: "Robotic Manipulation 在线教材目录"
    url: "https://manipulation.mit.edu/"
  - label: "Zhou et al., On the Continuity of Rotation Representations in Neural Networks（CVPR 2019；ps5 列为背景阅读，只核对了题目和出处）"
    url: "https://arxiv.org/abs/1812.07035v2"
---

先看两次失败。两次都发生在“算法本身没有错”的地方。

**第一次。** 一条 planar 2R arm（两根 link 各 1 m）停在 $q=(0.2,1.2)$ rad，要让 tip 以 0.1 m/s 正好往右走。Pseudoinverse 算出 joint 2 要转 $-0.123$ rad/s，可 joint velocity 上限是 0.06 rad/s。最省事的做法是把超限的那个 joint 截到上限，其余不动。结果 tip 不再往右，而是往右上 16° 的方向走；换成“在 limit 内让 error 最小”的 QP，tip 往右下 18.9° 走。两种做法都满足了 limit，gripper 都离开了要走的直线。

::fig[m4210-drift] 灰色箭头是要的 velocity，两根黑色箭头是 clip 和 QP 的结果，彩色的是第 2 站要讲的第三种写法：方向不变，只是慢下来。右边列出每种做法的 joint velocity 和 tip 实际的 velocity。

**第二次。** 同一条 arm 伸直，绕 base 从 40° 转到 50°。离 base 1.5 m、方向 45° 的地方立着一根半径 8 cm 的 post。Motion planner 的 collision checker 每 10° 检查一次：40° 不碰，50° 不碰，于是报告这一段可以走。真机走过去就撞上了。

::fig[m4210-edgemiss] Arm 从 40° 扫到 50°，两条虚线是 checker 检查过的两个 sample。中间约 6° 的范围里 arm 穿过 post，变深色。

两件事的共同点是：manipulation 系统里每一步都有一个“看起来显然”的做法，而它在边界上会出错。这门课用 Drake 把一个 manipulation 系统从头搭到尾，每一层都要回答“在 limit、noise、collision 面前它还对不对”：先把 frame 和 pose 写清楚（第 1 站），用 differential IK 让 gripper 跟着 trajectory 走（第 2 站，第一次失败在这里解决），用 depth camera 估出物体的 pose（第 3 站），在 point cloud 上找 grasp（第 4 站），规划没有 collision 的 motion（第 5 站，第二次失败在这里解决），在接触时控制 force（第 6 站），最后从 demonstration 学 policy（第 7 站）。

| 站 | 内容 | 教材章节 | Fall 2026 problem set |
|---|---|---|---|
| 1 | monogram notation、spatial velocity、keyframe | 第 3 章前半 | ps2 |
| 2 | differential IK 与 QP | 第 3 章后半 | ps2、ps3 |
| 3 | point cloud registration、ICP | 第 4 章 | 没有对应的题 |
| 4 | contact、normal、antipodal grasp | 第 5 章 | ps4 |
| 5 | IK as optimization、collision check、trajectory optimization | 第 6 章 | ps3、ps4 |
| 6 | force control | 第 8 章 | ps7 Problem 2 到 5 |
| 7 | action 的表示、评估 | imitation learning 讲次（教材这一章还是空的 draft） | ps5 |

:::note 和站内其他页面的分工
Rotation 的各种表示（Euler angles 的 gimbal lock、quaternion 与 slerp）、homogeneous transform、2R arm 的 Jacobian 与 singularity、damped least squares 在 [RB2202](../courses/RB2202.html) 里；twist、wrench、PoE、RRT 与 PRM、form closure 与 force closure 在 [Modern Robotics](../courses/NW-MODERNROBOTICS.html) 里；gravity 造成的 $mg/k_p$ steady-state error、joint impedance、Cartesian stiffness 在 [RB2203](../courses/RB2203.html) 里；behavior cloning、DAgger、diffusion policy、action chunking 在 [RB4301](../courses/RB4301.html) 里；ps6 的 REINFORCE 与 PPO 在 [Berkeley CS285](../courses/BERKELEY-CS285.html) 和 [现代强化学习实践](../courses/MODERN-RL.html) 里。这一页只在用到时指过去，篇幅留给 6.4210 自己的东西。
:::

## [pick] Monogram notation、spatial velocity 与 pick-and-place 的 keyframe

:::skip
快速路线必读（教材第 3 章前半，约 2 小时，ps2 全靠它）。能说出 ${}^Cp^B_C$ 为什么不等于 $-{}^Bp^C_B$，能写出 translational velocity 的加法规则，能给一次 pick-and-place 列出 keyframe 和时间，就可以去第 2 站。
:::

### 一个 vector 要写清三件事

Camera 看到一个点，arm 要去那里。这句话里至少有四个 frame：world、camera、物体、gripper。代码里一个 `p` 是谁相对谁、用谁的 axis 写，只要错一个，arm 就会去错地方，而且不会报错。教材因此给每个量都配了上下标，叫 monogram notation：

$${}^Ap^C_F$$

读作“point $C$ 相对 point $A$ 的位置，expressed in frame $F$”。左上角是从哪里量，右上角是量到哪里，右下角是用哪一组 axis 写成三个数。省略时的约定是 ${}^Fp^A={}^Fp^A_F$，$p^A={}^Wp^A_W$。Rotation 写成 ${}^BR^A$（frame $A$ 的 orientation，从 $B$ 看），pose 写成 ${}^BX^A$（代码里是 `X_BA`），它总是 expressed in $B$，所以不带右下角。

规则只有几条，每一条都可以由“下标首尾相接”检查：

$${}^Ap^B_F+{}^Bp^C_F={}^Ap^C_F,\qquad {}^Ap^B_F=-{}^Bp^A_F,\qquad {}^Ap^B_G={}^GR^F\,{}^Ap^B_F$$

$${}^AR^B\,{}^BR^C={}^AR^C,\qquad {}^AX^B\,{}^BX^C={}^AX^C,\qquad {}^Gp^A={}^GX^F\,{}^Fp^A={}^Gp^F+{}^GR^F\,{}^Fp^A$$

第一条要求两个 vector expressed in 同一个 $F$ 才能相加；第三条说换 expressed-in frame 只用 rotation，和 frame 的 origin 在哪里无关，因为 relative position 是一个“差”，origin 一减就消掉了。

### 一个例子：同一根箭头的三种写法

用 ps2 Problem 4 的设定。Planar 的 pose 写成 $(x,y,\theta)$：${}^WX^B=(2,3,-\pi/4)$，${}^WX^C=(6,4,-2\pi/3)$。

::fig[m4210-frames] 彩色箭头从 $B$ 指向 $C$。虚线是它在 $W$ 的 axis 上的 component，灰线是它在 $B$ 的 axis 上的 component。

**在 $W$ 里写。** 两个 origin 都在 $W$ 里已知，按第一条规则 ${}^Bp^C_W={}^Bp^W_W+{}^Wp^C_W=p^C-p^B=(6-2,\,4-3)=(4,1)$。

**在 $B$ 里写。** 按第三条，${}^Bp^C_B={}^BR^W\,{}^Bp^C_W$。${}^WR^B$ 是转 $-45°$，它的 inverse ${}^BR^W$ 是转 $+45°$：

$${}^Bp^C_B=\begin{pmatrix}\cos45°&-\sin45°\\ \sin45°&\cos45°\end{pmatrix}\begin{pmatrix}4\\1\end{pmatrix}=\begin{pmatrix}0.7071\cdot4-0.7071\cdot1\\0.7071\cdot4+0.7071\cdot1\end{pmatrix}=\begin{pmatrix}2.121\\3.536\end{pmatrix}$$

意思是：站在 $B$ 上，沿 $x_B$ 走 2.121，再沿 $y_B$ 走 3.536，到达 $C$。图里的灰色折线就是这两步。

**反过来，在 $C$ 里写。** ${}^Cp^B_W=-{}^Bp^C_W=(-4,-1)$，再用 ${}^CR^W$（转 $+120°$，$\cos120°=-0.5$，$\sin120°=0.866$）：

$${}^Cp^B_C=\begin{pmatrix}-0.5&-0.866\\0.866&-0.5\end{pmatrix}\begin{pmatrix}-4\\-1\end{pmatrix}=\begin{pmatrix}2+0.866\\-3.464+0.5\end{pmatrix}=\begin{pmatrix}2.866\\-2.964\end{pmatrix}$$

:::wrong 反方向的 vector 就是加个负号，所以 ${}^Cp^B_C=-{}^Bp^C_B$
负号规则 ${}^Ap^B_F=-{}^Bp^A_F$ 要求两边 expressed in 同一个 $F$。上面 $-{}^Bp^C_B=(-2.121,-3.536)$，而 ${}^Cp^B_C=(2.866,-2.964)$。两者长度都是 $\sqrt{17}=4.123$，方向完全不同，因为一个用 $B$ 的 axis 写，一个用 $C$ 的。只有当 $B$ 和 $C$ 的 orientation 相同时两者才是相反数（ps2 4.8）。同样的道理，2D pose 的 inverse 不是 $(-x,-y,-\theta)$，而是 $(-x\cos\theta-y\sin\theta,\;x\sin\theta-y\cos\theta,\;-\theta)$（ps2 4.9），只有 $\theta=0$ 时两者才一样。
:::

### Spatial velocity：translation 的加法多一项

Spatial velocity 是 6 个数，angular 在前：

$${}^AV^B_C=\begin{pmatrix}{}^A\omega^B_C\\ {}^A\mathrm v^B_C\end{pmatrix}$$

意思是 frame $B$ 相对 $A$ 的 velocity，expressed in $C$。换 expressed-in frame 仍然只要把两半各乘一个 rotation。Angular velocity 照样首尾相接：${}^A\omega^B_F+{}^B\omega^C_F={}^A\omega^C_F$。Translational velocity 不行。对

$${}^Ap^C={}^Ap^B+{}^AR^B\,{}^Bp^C$$

求 time derivative（都 expressed in $A$），右边第二项用 product rule：

$${}^A\mathrm v^C={}^A\mathrm v^B+{}^A\dot R^B\,{}^Bp^C+{}^AR^B\,{}^B\mathrm v^C$$

$R^\top R=I$ 两边求导得 $\dot RR^\top+R\dot R^\top=0$，所以 $\dot RR^\top$ 是 skew-symmetric matrix，可以写成 $[\omega]_\times$，乘一个 vector 就是和 $\omega$ 做 cross product。于是 $\dot R\,{}^Bp^C=\dot RR^\top R\,{}^Bp^C=\omega\times(R\,{}^Bp^C)$。把 $R\,{}^Bp^C$ 认作 ${}^Bp^C_A$，最后一项认作 ${}^B\mathrm v^C_A$：

$${}^A\mathrm v^C_F={}^A\mathrm v^B_F+{}^B\mathrm v^C_F+{}^A\omega^B_F\times{}^Bp^C_F$$

多出来的就是 $\omega\times p$。拿一个转盘检验：frame $B$ 固定在转盘上，转盘绕 $z$ 以 1 rad/s 转，${}^A\mathrm v^B=0$。转盘上一个物体 $C$ 在 ${}^Bp^C_A=(0.5,0,0)$ m，相对转盘不动，${}^B\mathrm v^C=0$。前两项都是 0，第三项 $(0,0,1)\times(0.5,0,0)=(0,0.5,0)$ m/s：物体以 0.5 m/s 沿切线方向走，正是 $r\omega$。Gripper 抓着物体、wrist camera 装在 link 上，算它们的 velocity 时都要带这一项。

同一个公式还说明 translational velocity 的“反过来”不是加个负号。取 $C=A$，左边 ${}^A\mathrm v^A=0$，于是

$$-{}^A\mathrm v^B_F={}^B\mathrm v^A_F+{}^A\omega^B_F\times{}^Bp^A_F$$

还是那个转盘：转盘中心固定，${}^A\mathrm v^B=0$；把 world frame $A$ 的 origin 放在离转盘中心 $(0.5,0,0)$ m 的地方，${}^Bp^A=(0.5,0,0)$。代进去，${}^B\mathrm v^A=0-(0,0,1)\times(0.5,0,0)=(0,-0.5,0)$ m/s：站在转盘上看，world 的 origin 以 0.5 m/s 往后退，尽管 ${}^A\mathrm v^B=0$。

### $\dot q$ 和 $v$ 不是一回事

Drake 把 configuration 记作 $q$，velocity 记作 $v$，并且一般 $\dot q\ne v$。原因在 floating body：一个自由的物体用 unit quaternion（4 个数）加 position（3 个数）记 orientation 和位置，$q$ 有 7 个数；它的 velocity 是 angular velocity 加 translational velocity，$v$ 只有 6 个数。Quaternion 的 4 个 derivative 和 3 个 angular velocity 之间差一个依赖于 $q$ 的 linear map，Drake 用 `MapQDotToVelocity`、`MapVelocityToQDot` 换算。教材的例子是一个 state 有 13 个数：7 个 position、6 个 velocity。

所以教材用的 Jacobian 是对 $v$ 的 geometric Jacobian：

$$V^G=J^G(q)\,v,\qquad J^G\in\mathbb R^{6\times n_v}$$

它不依赖 orientation 用什么参数表示（ps2 8.2）。KUKA iiwa 有 7 个 joint，$J^G$ 是 $6\times7$ 的，不可能有普通的 inverse。Arm 本身只有 revolute joint，这部分 $\dot q=v$；场景里有自由的物体时，`plant` 的 $q$、$v$ 维数就不一样，取 Jacobian 时要只留下 arm 对应的 column（ps2 的 `arm_columns`）。

### 把 pick-and-place 写成一串 frame

教材第 3 章的任务是：一块 $7.5\times5\times5$ cm 的 brick 放在桌上，pose ${}^WX^O$ 已知（第 3 站讲怎么估），用 Schunk WSG gripper 把它搬到另一个位置。Gripper 张开时两根 finger 之间 10.7 cm，palm 离 gripper body origin 3.625 cm，finger 长 8.2 cm。

Grasp 写成物体相对 gripper 的 pose：

$${}^{G_{grasp}}p^O=\begin{pmatrix}0\\0.11\\0\end{pmatrix},\qquad {}^{G_{pregrasp}}p^O=\begin{pmatrix}0\\0.2\\0\end{pmatrix},\qquad {}^{G_{grasp}}R^O=R_x(\tfrac\pi2)R_z(\tfrac\pi2)$$

物体在 gripper 的 $y$ 方向 11 cm 处，正好在两根 finger 之间（$3.625+8.2=11.8$ cm 是 fingertip 的位置）。Pregrasp 是同一个 orientation，沿 $y_G$ 再退 9 cm。Gripper 要去的 pose 由 ${}^WX^{G_{grasp}}={}^WX^O\,{}^OX^{G_{grasp}}={}^WX^O\,[{}^{G_{grasp}}X^O]^{-1}$ 得到，下标首尾相接，inverse 把上下标对调。Pregrasp 的用处是：从 pregrasp 到 grasp 是一条短直线，hand 只在物体附近沿这条线进出，这一段不需要做 collision 推理。

Keyframe 依次是 initial、prepick、pick、postpick、clearance、preplace、place、postplace。Clearance 是教材 notebook 里另加的一帧：不加它时 gripper 从 postpick 直线走到 preplace，会擦着 bin 的壁过去（notebook 里附了一段失败的录像）。它的位置这样定：先取 prepick 到 preplace 的 relative pose ${}^{G_{prepick}}X^{G_{preplace}}$，translation 取一半、rotation 的 axis-angle 取一半角，再沿 $-y_G$ 退 0.3 m（gripper 朝下时就是往上抬 0.3 m）。

时间按教材的规则：从 initial 到 prepick 用 $t=k\,\|{}^{G_0}p^{G_{prepick}}\|$，$k=10$ s/m（即 10 cm/s）；pregrasp 与 grasp 之间各 2 s；finger 开合时原地停 2 s。Clearance 前后两段在正文里没有写，按 notebook 的代码，两段各用 $10\ \text{s/m}\times\|{}^{G_{prepick}}p^{G_{clearance}}\|$，即 prepick 到 clearance 这一段的长度。（Notebook 的代码里 grasp 的 offset 是 0.12 m、pregrasp 再退 0.08 m，pregrasp 处的物体同样在 0.2 m；正文写的是 0.11 m 与 0.2 m。）

在侧视的 plane 里取一组数：gripper 从 $(0,0.40)$ m 出发，brick 中心在 $(0.15,0.025)$，要放到 $(0.65,0.025)$。Gripper 朝下，pick 时 origin 在 brick 中心上方 0.11 m，即 $z=0.135$；prepick 在 $z=0.225$，preplace 同理在 $(0.65,0.225)$。Prepick 与 preplace 的中点是 $(0.40,0.225)$，再抬 0.3 m，clearance 在 $(0.40,0.525)$。Prepick 到 clearance 的距离是 $\sqrt{0.25^2+0.3^2}=\sqrt{0.1525}=0.3905$ m。

| keyframe | 位置（m） | 时间（s） | 怎么算的 |
|---|---|---|---|
| initial | (0, 0.40) | 0 | |
| prepick | (0.15, 0.225) | 2.305 | $10\times\sqrt{0.15^2+0.175^2}=10\times0.2305$ |
| pick | (0.15, 0.135) | 4.305 | 加 2 |
| finger 合上 | 同上 | 6.305 | 加 2 |
| postpick | (0.15, 0.225) | 8.305 | 加 2 |
| clearance | (0.40, 0.525) | 12.210 | 加 $10\times0.3905$ |
| preplace | (0.65, 0.225) | 16.115 | 再加 $10\times0.3905$ |
| place | (0.65, 0.135) | 18.115 | 加 2 |
| finger 张开 | 同上 | 20.115 | 加 2 |
| postplace | (0.65, 0.225) | 22.115 | 加 2 |

::fig[m4210-pick] 上表的 keyframe 按 2 倍速播放。Gripper 画成 body 加两根 finger；brick 在 finger 合上之后跟着 gripper 走，张开之后留在原地。下方的点沿时间轴走。

Keyframe 之间，position 用 linear interpolation（Drake 的 `PiecewisePolynomial`，first-order hold），orientation 用 quaternion 的 slerp（`PiecewiseQuaternionSlerp`），两者合成 `PiecewisePose`；finger 的开合命令同样是一条 first-order hold（张开 0.107 m，合上 0）。为什么 rotation 不能逐个分量做 linear interpolation，以及 quaternion 的符号要先对齐，见 [RB2202 第 1 站](../courses/RB2202.html#rot)；ps2 Problem 3 用五组例子把各种“平均 rotation”的办法逐一试错，值得做一遍。对 `PiecewisePose` 求 derivative 就得到每个时刻要的 spatial velocity $V^{G_d}$（`PiecewiseQuaternionSlerp` 的 derivative 直接给出 3 个数的 angular velocity，不是 quaternion 的 4 个 derivative），交给第 2 站的 differential IK。Controller 输出的是 joint velocity，iiwa 的接口要的是 joint position，所以中间还要串一个 `Integrator`。

ps2 Problem 16 的 handout 让每两个 waypoint 之间走 4 s，并问压到 0.5 s 会怎样（16.2 的选项之一是“motion 太激进，叠方块不再可靠”）。原因是 controller 只把 $V^{G_d}$ 换成 joint velocity 再 integrate，没有任何 feedback 去拉回已经偏掉的 pose，desired velocity 变化太快时 arm 跟不上，error 一路累积。教材在 demo 之后也提了同一个问题：把同一条 trajectory 来回反复执行，error 会不会累积。ps2 Problem 18（6.4212）让 gripper 快速走一个正方形，问经过 waypoint 时 speed 的形状，以及 speed 与精度之间有没有 trade-off：linear interpolation 让 desired velocity 在每个角上突变，arm 跟不上这个突变，要求的 speed 越快，角被削得越圆。（上一版从解答摘要里记下的“10 cm 的正方形、speed 在角上先掉再冲过头”，这次没能对着解答核对。）

:::back
Rotation matrix、quaternion 与 slerp 来自 [RB2202 第 1、2 站](../courses/RB2202.html#rot)；twist 的另一套写法（space twist、body twist）见 [Modern Robotics 第 2 站](../courses/NW-MODERNROBOTICS.html#twist)，教材第 3 章 spatial velocity 一节的展开说明给了两者的对应：space twist 用的是一个此刻与 $A$ 重合、随 $B$ 运动的 frame，结果是 $({}^A\omega^B,\;{}^A\mathrm v^B-{}^A\omega^B\times{}^Ap^B)$。
:::

:::from
Monogram notation 的全部规则、velocity 加法的推导（$\dot RR^\top$ skew-symmetric）与 translational velocity 的 additive inverse、space twist 的对应、$\dot q\ne v$ 与 13 个 state 的例子、geometric Jacobian 的约定、brick 与 WSG 的尺寸、grasp 与 pregrasp 的 offset 和 $R_x(\pi/2)R_z(\pi/2)$、keyframe 的名字与“10 s/m、2 s”的时间规则、`PiecewisePose`、slerp 与 `Integrator`，来自 [教材第 3 章](https://manipulation.mit.edu/pick.html)，这次逐字读了源码仓库里的原文。Clearance 的构造（半个 relative pose 加 0.3 m）与它前后两段的时间、notebook 里 0.12 m 与 0.08 m 的 offset，来自同一章 notebook `pick.ipynb` 的 `MakeGripperFrames`。上一版把 clearance 两段的时间写成 $10\times\|{}^{G_{prepick}}p^{G_{preplace}}\|$（凭记忆），对照代码是错的，这一版改成了 prepick 到 clearance 的距离，表和图跟着重算。三个 frame 的例子、“负号要求同一个 frame”（4.8）、2D pose inverse 的问题（4.9）、`X2D` 先写 translation 后作用 rotation 的提醒、0.5 s 与正方形的问题，来自 [ps2](https://github.com/tlpmit/6.4210-2-fall26-handouts) 的题目原文（Problem 4、16、18）；2D pose inverse 的公式、各题的数值答案是我自己算的，解答没能再核对。侧视 keyframe 的具体 coordinate 是为这一页取的数并实际算过。转盘的两个例子是自己加的。
:::

## [diffik] Differential IK：从 pseudoinverse 到 QP

:::skip
快速路线必读（教材第 3 章最后两节，加 ps3 Problem 1 到 4、13，约 3 小时）。能对开头那条 2R arm 手算 clip、QP 和 max α 三种解，能写出带 position 和 acceleration limit 的 QP，并说清只看一步的 position limit 为什么不安全，就可以去第 3 站。
:::

### Pseudoinverse 做了什么，在哪里坏

第 1 站给出了每一刻要的 $V^{G_d}$，现在要找 joint velocity $v$ 使 $J^G(q)v=V^{G_d}$。Jacobian 不是方阵（iiwa 是 $6\times7$），最直接的选择是 Moore–Penrose pseudoinverse：

$$v=[J^G(q)]^+V^{G_d}$$

它有三条性质：$J$ 是方阵且 full rank 时就是 inverse；solution 有无穷多个时给 norm 最小的那个；没有 exact solution 时给 least squares 的最优解。所以它就是 $\min_v\|J^Gv-V^{G_d}\|_2^2$ 的 closed-form solution。

坏的地方在 singularity 附近。ps3 1.2 用一个 diagonal 的例子把它放大：$J=\mathrm{diag}(1,0.001)$，要 $V=(0,1)$ m/s。$J^{-1}V=(0,1000)$ rad/s，第二个 singular value 是 0.001，pseudoinverse 就要乘 1000。

[RB2202](../courses/RB2202.html#ik) 讲过的 damped least squares 把 $1/\sigma$ 换成 $\sigma/(\sigma^2+\lambda)$。取 $\lambda=0.01$，第二个方向的 gain 是 $0.001/(10^{-6}+0.01)=0.09999$，joint velocity 只有 0.1 rad/s，代价是 tip 实际只走 $0.001\times0.09999=10^{-4}$ m/s。这个 gain 对 $\sigma$ 求导：

$$\frac{d}{d\sigma}\frac{\sigma}{\sigma^2+\lambda}=\frac{(\sigma^2+\lambda)-2\sigma^2}{(\sigma^2+\lambda)^2}=\frac{\lambda-\sigma^2}{(\sigma^2+\lambda)^2}$$

在 $\sigma=\sqrt\lambda$ 处为 0，最大 gain 是 $\sqrt\lambda/(2\lambda)=1/(2\sqrt\lambda)$，$\lambda=0.01$ 时是 5。$\lambda$ 于是同时决定了 joint velocity 的上限和“哪些方向还能被准确跟踪”的界线。Damping 只能间接地限制 joint velocity，真机上的 limit 是硬的：iiwa 在 joint impedance mode 下会把每个 joint 各自截到上限，它并不知道 end-effector 要往哪里走，结果“不会像一条放慢了的 end-effector trajectory 那么方便”，gripper 可能跑偏得很厉害（教材第 3 章）。

Singularity 是不是只是数学上的假象？教材用 unit link 的 2R arm 回答：$p^G=(c_0+c_{0+1},\;s_0+s_{0+1})$，取 $q_0(t)=1-t$、$q_1(t)=-2+2t$，joint velocity 恒为 $(-1,2)$。代进去，$x=\cos(1-t)+\cos(t-1)=2\cos(1-t)$，$y=\sin(1-t)+\sin(t-1)=0$：tip 沿 $x$ 轴走，$t=1$ 时 $q=(0,0)$，arm 伸直，正好在 singularity 上。这一刻 tip 的 velocity 是 $\dot x=-2\sin(1-t)=0$，任何 joint velocity 都推不动它往 $+x$ 走，这是真的；但它也不能瞬间往 $-x$ 走，可 $\ddot x=-2\cos(1-t)=-2$ m/s²，它在往 $-x$ 加速，下一刻就离开了 singularity。所以 Jacobian 对 velocity 的描述是精确的，“这一刻没有这个方向的 velocity”不等于“到不了那里”。另一个容易忽略的性质：用 pseudoinverse 让 gripper 沿一条闭合的 path 走一圈回到原来的 pose，$q$ 一般回不到原来的值，pseudoinverse 给出的不是一个可积的 map（教材引 Mussa-Ivaldi 1991）。

### 有 limit 时：clip 与 QP

先在一个能画出来的 toy 上看。ps3 2.2：一个 1 维的 task 由 2 个 joint 驱动，$J=(1,2)$，要 $V=1$ m/s，$|\dot q_i|\le0.3$ rad/s。

Pseudoinverse：$J^+=J^\top(JJ^\top)^{-1}=(1,2)^\top/5$，所以 $\dot q=(0.2,0.4)$。第二个超限。

Clip：截成 $(0.2,0.3)$，task velocity 是 $0.2+2\times0.3=0.8$，error 的平方 $0.04$。

QP：

$$\min_{\dot q}\;(\dot q_1+2\dot q_2-1)^2\quad\text{s.t.}\quad -0.3\le\dot q_i\le0.3$$

在 box 里 $\dot q_1+2\dot q_2$ 最大是 $0.3+0.6=0.9<1$，所以最优解是让它尽量大的那个角 $(0.3,0.3)$，task velocity 0.9，error 的平方 $0.01$。

::fig[m4210-qp] 浅色 box 是允许的 joint velocity。目标直线在 box 外；clip 只沿 $\dot q_2$ 方向把点压回 box，QP 在 box 里找离目标直线最近的点。

Clip 的问题在于它一次只处理一个 joint：$\dot q_2$ 被压下去之后，本来可以多转一点来补偿的 $\dot q_1$ 没有被告知。QP 把 limit 放进 optimization 里，同时调所有 joint。这个 QP 是 convex 的，教材说它一般不能再用 pseudoinverse 直接写出来，要交给 QP solver，好在规模很小，kHz 的 rate 也解得动（ps3）。

回到开头的 2R arm。$q=(0.2,1.2)$ 时

$$J=\begin{pmatrix}-\sin q_1-\sin(q_1+q_2)&-\sin(q_1+q_2)\\ \cos q_1+\cos(q_1+q_2)&\cos(q_1+q_2)\end{pmatrix}=\begin{pmatrix}-1.1841&-0.9854\\1.1500&0.1700\end{pmatrix}$$

$J$ 是方阵且 invertible，$J^{-1}(0.1,0)^\top=(0.0182,-0.1234)$ rad/s。Joint 2 超了一倍。

| 做法 | joint velocity（rad/s） | tip velocity（m/s） | 方向 | error 的 norm |
|---|---|---|---|---|
| clip | (0.0182, −0.0600) | (0.0375, 0.0108) | +16.0° | 0.0634 |
| QP | (−0.0135, −0.0600) | (0.0751, −0.0257) | −18.9° | 0.0358 |
| max α | (0.0089, −0.0600) | (0.0486, 0) | 0° | 0.0514 |

QP 那一行这样得到：$\dot q_2$ 一定压在 $-0.06$（不压满的话 error 还能更小），剩下的 $\dot q_1$ 是一个 1 维 least squares。记 $J$ 的两个 column 为 $c_1$、$c_2$，要让 $c_1\dot q_1$ 尽量接近 $r=V-c_2(-0.06)$：

$$r=\begin{pmatrix}0.1\\0\end{pmatrix}+0.06\begin{pmatrix}-0.9854\\0.1700\end{pmatrix}=\begin{pmatrix}0.04087\\0.01020\end{pmatrix}$$

$$\dot q_1=\frac{c_1^\top r}{c_1^\top c_1}=\frac{-1.1841\times0.04087+1.1500\times0.01020}{1.1841^2+1.1500^2}=\frac{-0.03666}{2.7247}=-0.0135$$

再代回 $J\dot q$ 得到表里的 tip velocity。

### 只缩放，不改方向

QP 的 error 比 clip 小了将近一半，方向却偏得更多。它最小化的是 $\|J\dot q-V\|$，这个 norm 不在乎 error 是“慢了”还是“歪了”。对 gripper 来说歪比慢糟糕得多：沿着一条贴着桌面的直线走，慢一点没有关系，往下偏 19° 就会撞桌子。教材的做法是把 objective 换掉：

$$\max_{v,\alpha}\;\alpha\quad\text{s.t.}\quad J^G(q)v=\alpha V^{G_d},\quad0\le\alpha\le1,\quad\text{其他 limit}$$

Equality constraint 要求实际的 spatial velocity 和要的那个平行，只允许按 $\alpha$ 缩短。2R arm 上 $J$ invertible，$v=\alpha J^{-1}V=\alpha(0.0182,-0.1234)$，limit 要求 $0.1234\,\alpha\le0.06$，所以 $\alpha=0.486$，tip 以 0.0486 m/s 正好往右。这就是表里的最后一行和开头那张图里的彩色箭头。教材说 Drake 里常用的 `DifferentialInverseKinematics` 就是这种写法，理由是：花了很大功夫规划出一条 collision-free 的 path，不该让 controller 只把它当作“建议”。ps3 2.2 的 going further 问的正是这一点：6 维的 $V^{G_d}$ 配上 $\|J\dot q-V^{G_d}\|^2$ 这个 cost，QP 可能给出什么你不想要的答案，又该怎么改。教材还提醒一个后果：robot 放慢之后，播放 plan 的那一层要知道它慢了，只发 open-loop 的 velocity 命令是不够的，否则 plan 的时间和 robot 实际走到哪里就对不上。

$v=0,\alpha=0$ 永远满足所有 constraint，所以这个 QP 永远 feasible；方向实在做不到时 robot 就停下。做 teleoperation 时“停下”不总是想要的：手柄让 gripper 斜着往桌面里压，人其实希望它贴着桌面滑。教材给的变体是每个 coordinate 一个 $\alpha_i$：

$$J^G(q)v=E(q)\,\mathrm{diag}(\alpha)\,E^{-1}(q)V^{G_d},\qquad0\le\alpha_i\le1,\qquad\max\sum_i\alpha_i$$

$E(q)$ 把 roll-pitch-yaw 与 $xyz$ 的 derivative 换成 spatial velocity。垂直于桌面的那个 $\alpha_z$ 被压成 0，$x,y$ 两个照样是 1。

:::wrong QP 在 limit 内让 error 最小，所以它的解总是最好的
它在自己的 objective 下最好。上表里 QP 的 error norm 0.0358 是三者里最小的，tip 却往下偏了 18.9°，比 clip 的 16.0° 还多。Least squares 把 error 的每个分量一视同仁，于是用“歪”换“快”：tip 的 speed 从 clip 的 0.039 提到 0.079，代价是一个大的垂直分量。要保方向，就要把方向写成 constraint，而不是把它藏在 objective 里。
:::

### 多余的 joint：joint centering

iiwa 有 7 个 joint，要的 spatial velocity 只有 6 个数，满足 $Jv=V$ 的 $v$ 有一整条 line。Pseudoinverse 挑 norm 最小的，但这不一定是你想要的：arm 可能慢慢漂向 joint limit。办法是在 null space 里加一个次要目标，把 arm 拉回 nominal configuration $q_0$：

$$\min_{v}\;\|J^Gv-V^{G_d}\|^2+\epsilon\,\|P(q)\,(v-K(q_0-q))\|^2,\qquad P=I-J^+J$$

$P$ 把任何 vector 投到 $J$ 的 null space 里，所以第二项只影响“不改变 gripper motion”的那部分。教材建议 $\epsilon\approx0.01$：小到不影响主目标，又不至于小到数值上出问题。没有其他 constraint 时，对应的 closed form 是经典的 $\dot q=J^+V+PK(q_0-q)$。

ps3 3.2 用一个 1 维 task 手算：$J=(1,1)$，$V=0.2$，$q=(0.6,0)$，$q_0=0$，$K=1$。

$$J^+=\begin{pmatrix}0.5\\0.5\end{pmatrix},\quad J^+V=\begin{pmatrix}0.1\\0.1\end{pmatrix},\quad P=I-\begin{pmatrix}0.5&0.5\\0.5&0.5\end{pmatrix}=\begin{pmatrix}0.5&-0.5\\-0.5&0.5\end{pmatrix}$$

$$PK(q_0-q)=P\begin{pmatrix}-0.6\\0\end{pmatrix}=\begin{pmatrix}-0.3\\0.3\end{pmatrix},\qquad\dot q=\begin{pmatrix}-0.2\\0.4\end{pmatrix}$$

检验：$J\dot q=-0.2+0.4=0.2$，主目标没变。Joint 2 本来在 nominal 上，现在反而被推开（ps3 3.2 的 going further 专门问：它还算在做 joint centering 吗）。看 $\|q-q_0\|^2$ 的变化率，把两项分开算：

$$\frac{d}{dt}\|q-q_0\|^2=2(q-q_0)^\top\dot q=\underbrace{2(q-q_0)^\top J^+V}_{2\times0.6\times0.1\;=\;0.12}+\underbrace{2(q-q_0)^\top PK(q_0-q)}_{2\times0.6\times(-0.3)\;=\;-0.36}=-0.24$$

第二项永远不是正的：$P=I-J^+J$ 是 symmetric 而且 $P^2=P$，所以 $(q-q_0)^\top P(q-q_0)=\|P(q-q_0)\|^2\ge0$，第二项等于 $-2K\|P(q-q_0)\|^2$。这里 $P(q-q_0)=(0.3,-0.3)$，$\|\cdot\|^2=0.18$，正好是 $-0.36$。也就是说 secondary term 单独看总是在缩短到 nominal 的距离，只是它只能在 null space 里动；主目标那一项（这里是 $+0.12$）它管不着。Joint 2 被推开，是因为 null space 的方向 $(1,-1)/\sqrt2$ 让 joint 1 往回、joint 2 往外，按 $\|q-q_0\|$ 算整体仍在靠近。iiwa 远离 singularity 时 $P$ 的 rank 是 1（ps3 3.2 v），null space 只有一个方向；到了 singularity，$J$ 掉一个 rank，null space 就多出一维。

### Position limit 与 acceleration limit：只看一步不够

Joint velocity 不是唯一的 limit。把 decision variable 记作下一步的 $v_n$，当前 velocity 是 $v$，控制周期 $h$，用 Euler 近似把 position 和 acceleration 也写成 $v_n$ 的 linear constraint：

$$v_{min}\le v_n\le v_{max},\qquad q_{min}\le q+hv_n\le q_{max},\qquad \dot v_{min}\le\frac{v_n-v}{h}\le\dot v_{max}$$

ps3 Problem 4 取一个 joint：$q_{max}=1.57$ rad，$|v|\le2$ rad/s，$h=0.01$ s。Position 那一条就是 $v_n\le(1.57-q)/0.01$。$q=1.50$ 时它给出 7.0，比 velocity limit 2 宽，起作用的是 velocity limit；$q=1.56$ 时它给出 1.0，position limit 开始起作用。再加 $|\dot v|\le10$ rad/s²，也就是每 tick 最多变 0.1 rad/s。

问题出在两条 limit 叠在一起时。以 2 rad/s 冲向 limit 的 joint，要停下需要 $v^2/(2\dot v_{max})=4/20=0.2$ rad 的距离；可 position constraint 直到离 limit 只剩 $2\times0.01=0.02$ rad 时才开始要求减速。下面从 $q=1.0$、$v=2$ 出发，每个 tick 取 constraint 允许的最大 $v_n$ 模拟一遍。

::fig[m4210-limit] 两个 joint 同时出发。左边只用一步的 position constraint，右边用 braking envelope。右边的 plot 是 $q(t)$，点与左边同步，慢放 10 倍。

左边：$t=0.28$ s 时 $q=1.56$，position constraint 要求 $v_n\le1.0$，acceleration constraint 要求 $v_n\ge2-0.1=1.9$，两条矛盾，QP infeasible。实际系统只能尽力减速（这里取 $v_n=1.9$，每 tick 减 0.1），joint 一直冲到 $q=1.75$ rad，越过 limit 0.18 rad（约 10°）。

右边把 position constraint 换成“这一步之后仍能刹住”：$q+hv_n+D(v_n)\le q_{max}$，$D(v)$ 是每 tick 减速 0.1 时从 $v$ 刹到 0 所走的距离。连续时间的版本就是 $v\le\sqrt{2\dot v_{max}(q_{max}-q)}$（ps3 的 going further）。它在 $q\approx1.40$ rad 时开始减速，正好在 1.57 停住，全程 feasible。

:::edge QP infeasible 时怎么办
Robot 每个控制周期都要一个输出，solver 报 infeasible 不是一个可以接受的答案。常见的处理是给 position constraint 加一个 slack variable，把违反的量放进 objective 里重罚，这样 $q$ 已经越过 limit 时（例如被外力推过去）QP 仍然有解，并且会把 joint 拉回来（ps3 4.2 的 going further）。Max α 的写法在“方向做不到”时会给出 $\alpha=0$，那是停下，不是 infeasible。
:::

### Cartesian 的 virtual wall

同样的线性化可以用在 gripper 的位置上。ps3 13.5 要求 gripper 的 origin 留在一个 box 里（$x\in[-0.3,0.3]$，$y\in[-1,1]$，$z\in[0,1]$ m）。取 $J^G$ 的后三行 $J_{\mathrm v}$（translational 部分），预测一个短时间 $h$ 之后的位置：

$$p_{lower}\le p^G+h\,J_{\mathrm v}(q)\,v\le p_{upper}$$

这里的 $h=0.004$ s 是 prediction horizon，和 controller 的 sampling period 是两回事（ps3 特意提醒不要混用）。$h$ 越小，constraint 越晚起作用。ps3 的 test6 里 gripper 的 $x$ 已经是 0.30035 m 左右，越出了 wall，于是 constraint 要求 $0.30035+0.004\,\mathrm v_x\le0.3$，解出来 $\mathrm v_x=-0.0885$ m/s，正好让预测的下一个 $x$ 回到 0.3000。这一招只管 origin 一个点，不管 gripper 的形状；真正的 collision avoidance 要等第 5 站。

:::back
Pseudoinverse 与 damped least squares 的推导见 [RB2202 第 5 站](../courses/RB2202.html#ik)；null space 的概念见同一站的“多一个 joint”。
:::

:::from
三种 pseudoinverse 性质、iiwa 在 joint-impedance mode 下逐 joint 截断的说法、“singularity 是不是真的”那个 $q_0=1-t$ 的例子与 pseudoinverse 不可积、velocity/position/acceleration limit 的 QP、joint centering 的 objective 与 $\epsilon\approx0.01$、max α 的写法、“$v_n=0,\alpha=0$ 总是 feasible”、plan playback 要知道放慢了、teleop 的逐 coordinate $\alpha_i$，来自 [教材第 3 章](https://manipulation.mit.edu/pick.html)，这次逐字读了原文。$\mathrm{diag}(1,0.001)$、$\lambda=0.01$、“damped gain 何时最大”的问题、$J=(1,2)$ 与 $|\dot q_i|\le0.3$、joint centering 的数据与 going further 的问题、$q_{max}=1.57$、$|\dot q|\le2$、$h=0.01$、$|\ddot q|\le10$ 和“一步的 position constraint 能不能刹住”的问题、virtual wall 的 box 与 $h=0.004$，来自 [ps3](https://github.com/tlpmit/6.4210-2-fall26-handouts) Problem 1 到 4、13 的题目原文。各题的数值（$J^+V$、clip 与 QP 的解、峰值 gain 5、停车距离 0.2 rad 与 braking envelope、$-0.24$ 与 $-0.36$ 的分解）是我按题目算的；上一版提到 ps3 解答给出 $-0.36$，现在看是 secondary term 单独的那一项，解答原文没能再核对。test6 的 $x\approx0.30035$ 与 $\mathrm v_x=-0.0885$ 沿用上一版从解答摘要里记下的数，没有再核对。2R arm 的三行表、QP 的 1 维 least squares、joint limit 的逐 tick 模拟（包括 1.75 rad 和 1.40 rad）是为这一页算的。
:::

## [pose] Point cloud registration 与 ICP

:::skip
快速路线里可以先跳（研究底稿的建议，代价是做真机时 perception pipeline 要另补）；Fall 2026 的 ps1 到 ps7 里都没有对应的题（逐份查过题目原文）。用户做真机实验时，物体 pose 的估计迟早会用到，建议至少读前三个小节。能对已知 correspondence 的 2D 点手算 $\theta^*$，能说出 ICP 为什么会停在错的 pose 上，就可以去第 4 站。
:::

### Depth camera 给的是什么

Depth camera 每个 pixel 存一个数：沿这个 pixel 的 ray 到最近 surface 的距离。配上 camera intrinsics（Drake 里是 `CameraInfo`），每个 pixel 变成 camera frame 里的一个点 ${}^Cp^{s_i}$；再乘 camera 的 pose，${}^Wp^{s_i}={}^WX^C\,{}^Cp^{s_i}$，就是 world 里的 point cloud。Drake 的 `DepthImageToPointCloud` 默认输出 camera frame，可以接一个 ${}^PX^C$ 换到别的 frame。

教材列出的失败方式都会直接影响后面的 algorithm。Noise 不是简单的 Gaussian，它随光照、surface 的朝向和材料变化。物体边缘和反光的物体上经常没有 return，sensor 报“最大 depth”。Camera 只能看到 line of sight 上的东西，物体互相挡、被 robot 自己的 hand 挡，往往正发生在最需要看的时候。RealSense D415 的有效 depth 大约是 0.3 到 1.5 m，wrist camera 离物体近于 0.3 m 时，物体在 point cloud 里直接消失。Camera pose ${}^WX^C$ 的 calibration error 会被放大到 point cloud 的每一个点上。

Point cloud 还丢掉了一样东西：depth image 加 camera pose 不只说明“这里有 surface”，还说明“camera 到这个点之间是空的”。教材建议保留 depth image，后面的 free-space constraint 要用它。

### 已知 correspondence：translation 先分出去

先解一个简化的问题。Model 上有点 ${}^Op^{m_j}$（物体 frame 里，来自 CAD 或 mesh），scene 里有点 $p^{s_i}$（world 里），并且已知第 $i$ 个 scene 点对应 model 的第 $c_i$ 个点。要找物体的 pose $X=(p,R)$：

$$\min_{p,R}\;\sum_{i=1}^{N}\big\|p+R\,{}^Op^{m_{c_i}}-p^{s_i}\big\|^2\quad\text{s.t.}\quad R^\top R=I,\;\det R=+1$$

Objective 在 $(p,R)$ 的 entry 上是 convex quadratic；麻烦在 constraint：$R^\top R=I$ 是 9 个 quadratic equality，不是 convex set。$R^\top R=I$ 只能推出 $\det R=\pm1$，$-1$ 是 rotation 加 reflection，所以 determinant 那一条必须单独处理。

先固定 $R$，对 $p$ 求 gradient 并令其为 0：

$$\sum_i2\big(p+R\,{}^Op^{m_{c_i}}-p^{s_i}\big)=0\quad\Rightarrow\quad p^*=\bar s-R\,\bar m,\qquad\bar m=\frac1N\sum_i{}^Op^{m_{c_i}},\;\bar s=\frac1N\sum_ip^{s_i}$$

代回去，每一项变成 $R\tilde m_i-\tilde s_i$，其中 $\tilde m_i={}^Op^{m_{c_i}}-\bar m$、$\tilde s_i=p^{s_i}-\bar s$ 是减掉 centroid 之后的点。Translation 消失了，只剩 rotation。

### 2D：一个 atan2

展开剩下的 objective：

$$\sum_i\|R\tilde m_i-\tilde s_i\|^2=\sum_i\|\tilde m_i\|^2+\sum_i\|\tilde s_i\|^2-2\sum_i\tilde s_i^\top R\tilde m_i$$

前两项和 $R$ 无关（rotation 不改变长度），所以要让 $\sum_i\tilde s_i^\top R\tilde m_i$ 最大。在 2D 里 $R=\begin{pmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{pmatrix}$，

$$\tilde s^\top R\tilde m=s_x(m_x\cos\theta-m_y\sin\theta)+s_y(m_x\sin\theta+m_y\cos\theta)=\cos\theta\,(\tilde m\cdot\tilde s)+\sin\theta\,(m_xs_y-m_ys_x)$$

记 $A=\sum_i\tilde m_i\cdot\tilde s_i$，$B=\sum_i\tilde m_i\times\tilde s_i$（2D 的 cross product $m_xs_y-m_ys_x$），要最大化 $A\cos\theta+B\sin\theta$。它等于 $\sqrt{A^2+B^2}\cos(\theta-\phi)$，$\phi=\mathrm{atan2}(B,A)$，所以

$$\theta^*=\mathrm{atan2}(B,A)$$

用一个例子走一遍。Model 三个点 $(0,0)$、$(3,0)$、$(0,3)$。Scene 由它们转 $\theta$（$\cos\theta=0.8$，$\sin\theta=0.6$，即 36.87°）再平移 $(4,1)$ 得到 $(4,1)$、$(6.4,2.8)$、$(2.2,3.4)$，然后把第三个点挪了 $(0.1,-0.1)$，变成 $(2.3,3.3)$，模拟 noise。

::fig[m4210-kabsch] 空心是 model，实心是 scene，虚线三角形是解出的 pose 下的 model。两个“+”是 centroid。

**Centroid。** $\bar m=(1,1)$，$\bar s=\big(\frac{4+6.4+2.3}{3},\frac{1+2.8+3.3}{3}\big)=(4.2333,2.3667)$。

**减掉 centroid。** $\tilde m_1=(-1,-1)$，$\tilde m_2=(2,-1)$，$\tilde m_3=(-1,2)$；$\tilde s_1=(-0.2333,-1.3667)$，$\tilde s_2=(2.1667,0.4333)$，$\tilde s_3=(-1.9333,0.9333)$。

**$A$ 与 $B$。**

$$A=(0.2333+1.3667)+(4.3333-0.4333)+(1.9333+1.8667)=1.6+3.9+3.8=9.3$$

$$\begin{aligned}B&=(1.3667-0.2333)+(0.8667+2.1667)+(-0.9333+3.8667)\\&=1.1333+3.0333+2.9333=7.1\end{aligned}$$

**结果。** $\theta^*=\mathrm{atan2}(7.1,9.3)=37.36°$。如果没有挪第三个点，$A=0.8\times(2+5+5)=9.6$，$B=0.6\times12=7.2$，$\mathrm{atan2}(7.2,9.6)=36.87°$，正好是真值。Translation 由 $p^*=\bar s-R\bar m$ 得 $(4.045,0.965)$。三个点的 residual 是 0.057、0.033、0.090：noise 只加在一个点上，least squares 把它摊给了三个点。

### 3D：SVD 与 determinant

3D 里没有一个角可以 atan2，但同一个思路照样走得通。$\sum_i\tilde s_i^\top R\tilde m_i=\mathrm{tr}\big(R\sum_i\tilde m_i\tilde s_i^\top\big)=\mathrm{tr}(RW^\top)$，其中

$$W=\sum_i\tilde s_i\tilde m_i^\top=U\Sigma V^\top$$

是 $3\times3$ 的 data matrix 和它的 SVD。代入，$\mathrm{tr}(RV\Sigma U^\top)=\mathrm{tr}(U^\top RV\,\Sigma)=\sum_k\sigma_kZ_{kk}$，$Z=U^\top RV$ 是 orthogonal matrix，每个 diagonal entry 不超过 1，所以最大值是 $\sum_k\sigma_k$，在 $Z=I$、即 $R=UV^\top$ 时取到。直观的说法是：把 $W$ 的 singular value 全换成 1，得到离它最近的 orthogonal matrix。

但 $UV^\top$ 的 determinant 可能是 $-1$。这时 $\det Z=\det U\det V=-1$，在 determinant 为 $-1$ 的 orthogonal matrix 里，$\sum\sigma_kZ_{kk}$ 的最大值是 $\sigma_1+\sigma_2-\sigma_3$（只牺牲最小的 singular value），对应

$$R^*=U\,\mathrm{diag}\big(1,1,\det(UV^\top)\big)\,V^\top,\qquad p^*=\bar s-R^*\bar m$$

教材特别指出，很多推导把 determinant 那一条丢掉了，没有处理这种情形。

:::edge 什么时候会出现 reflection
2D 里取 $\tilde m=(1,0),(0,2)$，scene 是它关于 $x$ 轴的镜像 $\tilde s=(1,0),(0,-2)$。$W=\mathrm{diag}(1,0)+\mathrm{diag}(0,-4)=\mathrm{diag}(1,-4)$，$UV^\top=\mathrm{diag}(1,-1)$，正是那个镜像，determinant $-1$。修正之后 $R^*=-I$（转 180°）：$\sum\tilde s^\top R\tilde m$ 在 $R=-I$ 时是 $-1+4=3$，在 $R=I$ 时是 $1-4=-3$。用上面的 atan2 公式，$A=1-4=-3$，$B=0$，$\theta^*=180°$，结果一样：2D 的参数化本身只表示 rotation，不会给出 reflection。3D 里 noise 大、点几乎共面时，这种情形就会真的发生。
:::

### ICP：correspondence 和 pose 轮流猜

真实的 scene 不会告诉你 correspondence。Iterative Closest Point（ICP）把问题拆成两个各自容易的子问题，轮流解：

1. 用当前估计 $\hat X$ 把 model 放进 world，对每个 scene 点找 model 上最近的点，当作 correspondence：$\hat c_i=\arg\min_j\|\hat X\,{}^Op^{m_j}-p^{s_i}\|^2$。（Open3D 用 FLANN 做 nearest-neighbor search。）
2. 固定这组 correspondence，用上面的 centroid 加 SVD 解出新的 $\hat X$。
3. 重复，直到不再变化。

两步都在最小化同一个 cost $\sum_i\|X\,{}^Op^{m_{c_i}}-p^{s_i}\|^2$：第 1 步在固定 $X$ 时对 $c$ 取最小，第 2 步在固定 $c$ 时对 $X$ 取最小。每一步 cost 都不会变大，cost 又有下界 0，所以一定 converge。Converge 到哪里就是另一回事了：这只是 block coordinate descent，整个问题是 nonconvex 的，它停在一个 local minimum。

下面用一个 L 形物体（长 4、高 2 的两条 segment）试两次。Scene 是 L 上均匀取的 12 个点，真值是转 35°、平移 $(1.2,0.6)$。Correspondence 取 model surface（两条 segment）上的最近点。

::fig[m4210-icp] 左边初值 $\theta=0$，第一轮之后 RMS 从 1.315 降到 0.038，十几轮后停在 35.00°。右边初值 200°（差 165°），短线把 L 的长边配到了短边附近，pose 在 $-161°$ 附近停下，RMS 停在约 0.45。

右边那一次每一轮 cost 都在降，最后也“converge”了。问题在第 1 步：初值转反了，每个 scene 点找到的最近点几乎都在错的那条边上，第 2 步按这组错的 correspondence 把 pose 拉到一个和它们自洽的位置，下一轮的最近点还是错的。教材说 ICP 通常 translation 估得好、rotation 估得差，2D 随机物体的动画里“多半会卡住”。补救办法是从许多随机 rotation 出发各跑一次（可以并行，3D 用 `UniformlyRandomRotationMatrix` 做 sampling），留 cost 最小的那个。

Local minimum 是从哪里来的？教材用一个思想实验把它归到 correspondence 上。固定 correspondence，只估 rotation，用一个角 $\theta$ 做 parameter，objective 对 $\theta$ 是 nonlinear 的。没有 noise 时，第 $i$ 个点离 centroid $r_i$，rotation 差 $\theta_{err}$ 时它的平方误差由 law of cosines 是 $r_i^2+r_i^2-2r_i^2\cos\theta_{err}$，加起来

$$\sum_i 2r_i^2\,(1-\cos\theta_{err})$$

这个 function 不 convex，但每个 minimum 都在 $\theta_{err}=0$（差 $2\pi$ 的整数倍），没有坏的 local minimum。拿上面 L 形物体检验：如果右边那一次从 200° 出发时给的是真的 correspondence，第 2 步一次就会解出 35°。卡住它的是第 1 步的 nearest neighbor：初值转反之后，每个 scene 点的最近点都在错的那条边上。教材的结论是：真正带来 local minima 的是 correspondence 和以后加上去的 constraint。

:::wrong ICP converge 了（cost 不再下降），pose 就对了
右边那次 ICP 在第 15 轮时 RMS 每轮只变 0.002，完全符合“converge”的判据，pose 却差了 196°。RMS 0.45 不为 0 是一个提示，可真实数据有 noise 和 partial view，正确的 pose 也不会给出 0，单凭 RMS 的大小分不出“对齐了但有 noise”和“卡在错的 local minimum”。能做的是多个初值比较 cost，或者用不依赖初值的方法（下一节的 RANSAC、max clique）给 ICP 一个好的起点。
:::

### Outlier 与 partial view

Scene 里总有不属于这个物体的点：桌面、bin 的壁、别的物体、bad return。Nearest-neighbor 仍然会给每个点硬配一个 model 点，least squares 就被拉偏。拉偏多少可以直接从 $p^*=\bar s-R\bar m$ 看出来：12 个 scene 点里混进 1 个 outlier，它离物体 1 m，centroid $\bar s$ 就挪 $1/12=8.3$ cm，translation 至少错这么多，rotation 的 data matrix 也跟着变。Partial view 是反过来的问题：被挡住的那部分 model 没有 scene 点去配，若 algorithm 写成“每个 model 点找最近的 scene 点”，那些点就会被拉到错的地方，所以 ICP 总是从 scene 点出发去找 model 点。

教材讨论的办法，按什么时候用：

- **Maximum correspondence distance。** 已经有一个大致对的 pose 时，离最近 model 点太远的 scene 点直接当 outlier 丢掉（Open3D 的 ICP 有这个参数）。这是“鸡生蛋”：判断 outlier 要先有好的 pose。
- **RANSAC。** 反复随机取很少几个点，用它们估一个 pose，数有多少个点落在 max distance 以内（inlier），取 inlier 最多的那个 pose 作为 ICP 的初值。
- **Max clique（TEASER 一类）。** 两个点之间的距离在 rigid motion 下不变。把每个候选 correspondence 当作 graph 的一个 node，两个候选的 pairwise distance 一致就连边，最大的 clique 就是一组彼此自洽的 correspondence。
- **Robust loss。** 把平方距离换成一个远处变平的 function，离得太远的点贡献一个常数、没有 gradient，于是可以让所有点对都参与。Coherent Point Drift 用 soft 的权重 $C_{ij}\in[0,1]$ 代替 hard correspondence，并显式地留出 outlier 的概率。
- **先 segmentation。** 先把桌面和 bin 裁掉（已知的区域直接 crop），多物体的场景先用 neural network 做 segmentation（教材第 9 章），再对每个物体做 registration。

还可以加物理上的 constraint：物体不能穿进桌面（non-penetration），camera ray 穿过的地方不能有物体（free-space，来自 DART）。教材的 2D 例子把 non-penetration 写成 ${}^Wp^{m_i}\ge0$，此时 SVD 的捷径不再成立，要用 nonlinear optimization；把 $a^2+b^2=1$ 放宽成 $a^2+b^2\le1$ 可以得到一个 SOCP，但 box 的例子里这个 relaxation 不 tight，box 会稍微缩小来解释数据。

:::back
SVD 和“离一个 matrix 最近的 orthogonal matrix”见 [MA2101](../courses/MA2101.html) 与 [DSA2102 第 5 站](../courses/DSA2102.html#eig)。
:::

:::from
Depth camera 的失败方式与 D415 的 0.3 到 1.5 m、`DepthImageToPointCloud` 的默认 frame、free space 的说法、known correspondence 的 problem formulation 与“constraint 是 quadratic 和 cubic”、centroid 的推导、$W$ 与 $R^*=UDV^\top$（教材引 Myronenko 2009 与 Haralick 1989）、“很多推导丢掉 determinant”、ICP 的两步与 FLANN、“translation 估得好、rotation 估得差，从随机 rotation 重启”（第 4 章 exercise “ICP with random initializations”）、circle 的思想实验与“local minima 来自 correspondence”、maximum correspondence distance、RANSAC、max clique、robust loss、CPD 与 outlier 概率、segmentation、non-penetration 的 SOCP relaxation 与“box 会缩小”、free space 来自 Schmidt 2015 的 DART，来自 [教材第 4 章](https://manipulation.mit.edu/pose.html)，这次逐字读了原文和 exercises。2D 的 atan2 推导、三点的例子、$\mathrm{tr}(RW^\top)$ 的推导、reflection 的 2D 例子、L 形物体的两次 ICP（用 surface 上的最近点作 correspondence，这一点和教材用离散 model 点的做法不同）、“cost 单调不增”的论证、outlier 让 centroid 挪 8.3 cm 的估算，是为这一页推和算的；“det 为 $-1$ 时最大值是 $\sigma_1+\sigma_2-\sigma_3$”是 Kabsch–Umeyama 的标准结论，这里没有证明，教材也没有给证明。ps1 到 ps7 里都没有 ICP 的题。
:::

## [grasp] Contact、normal estimation 与 antipodal grasp

:::skip
快速路线里，研究底稿认为 wrench 与 force closure 的部分可以只读不做；但 normal estimation 和 antipodal sampling 是 ps4 的两道计算题，做灵巧手和真机 grasp 的话建议读完。能用 PCA 从一个 window 估 normal 并定好方向，能判断一对点是否 antipodal，能说出两点 grasp 挡不住什么，就可以去第 5 站。
:::

### 一个 contact 能传什么

物体静止在 contact 上，要求所有 force 和 torque 平衡。教材从 manipulator equation 出发：$v=\dot v=0$ 时只剩

$$\tau_g(q)=-\sum_iJ_i^\top(q)F^{c_i}$$

每个 contact force 要满足三条：不接触就没有 force（$\phi(q)>0\Rightarrow f^{c_i}=0$）；normal force 只能推不能拉（$f_{C_z}\ge0$）；tangential force 在 Coulomb friction cone 里：

$$\sqrt{f_{C_x}^2+f_{C_y}^2}\le\mu f_{C_z}$$

Cone 是“允许的 force”的集合。如果 cone 里没有一个 force 能挡住运动，物体就滑动，此时 friction 取 cone 边界上和 sliding velocity 相反的那个（maximal dissipation）。Friction cone 怎样组成 force closure、几根 finger 够用，[Modern Robotics 第 11 站](../courses/NW-MODERNROBOTICS.html#grasp)已经讲过；这里看 6.4210 强调的另外两件事。

ps4 Problem 1 把常用的 contact model 按“能传什么 wrench”排了一下：

| contact model | 能传的 | 用在哪 |
|---|---|---|
| frictionless point | 只有 normal force | form closure 的分析 |
| point with friction | normal force 加 friction cone 里的 tangential force | 多数 grasp 分析的默认 |
| soft finger | 再加一个有界的、绕 normal 的 torsion | 有一定面积的 finger pad |
| hydroelastic | 在一块 contact patch 上把 pressure 积分出来的整个 wrench | Drake 里可选的 contact model |

### 两点 grasp 挡不住绕 axis 的 torque

Parallel-jaw gripper 最自然的 grasp 是 antipodal 的：两个 contact 的 normal 正好相反，并且都在两点的连线上。它让两个 friction cone 的“重叠”最大，是 wrench cone 大的一个便宜的 heuristic。

但两个 point contact 的所有 force 都作用在这两点上。任何 force 对连线上任一点的 torque 是 $r\times f$，$r$ 沿着连线，所以 torque 永远垂直于连线：绕连线本身的 torque 一点都传不出来。

:::wrong 两点都在 friction cone 里的 antipodal grasp 能挡住任何 disturbance
挡不住绕两点连线的 torque。用两根 finger 横着夹住一支笔的中点，握得再紧，笔仍然可以绕两点连线转：point contact 的 force 对这条线的 moment 都是 0（ps4 6.1）。3D 里 hard point contact 至少要 3 个才可能 force closure（ps4 6.2）。实际的 gripper 能夹住，是因为 finger pad 有面积：soft finger 或 hydroelastic 的 contact patch 能给出 torsional friction，并且它随 squeeze force 增大。所以在 simulator 里用 point contact 做 grasp，物体绕 grasp axis 打转并不是 bug，是 model 本来就这样。
:::

### Simulator 里的 contact

教材第 5 章用 Drake 的 `MultibodyPlant` 做 bin picking 的 simulation，有几件事直接影响 grasp 实验的结果。Point contact 在每个 contact 处用一个 Cartesian force 概括，contact 的 normal 取 signed distance 的 (sub)gradient，在 corner 处 normal 不唯一，物体动一点 force 就可能跳变，rigid-body simulation 因此会“爆”。相邻 time step 之间 contact 点选得不一致，也会造成近看才发现的异常。Rigid contact 求的是“刚好不穿透”的最小 normal force；soft contact 让 force 是 penetration depth 和 velocity 的 function。数值积分里 penetration“很少能完全避免”，教材让随机掉落的物体在高度上错开 0.1 m，避免一开始就互相穿透。Hydroelastic contact 在 patch 上积分 pressure，能给出 torsional friction，代价是更慢、需要给 geometry 配 hydroelastic 的属性。

### 从 depth image 估 normal：PCA

Antipodal 的判断要知道每个点的 surface normal，point cloud 里只有点。办法是在每个点附近取一小片邻域，拟合一个 plane：

$$\min_{p,n}\;\sum_{i=1}^N\big((p^i-p)^\top n\big)^2\quad\text{s.t.}\quad\|n\|=1$$

对 $p$ 求 gradient：$-2\sum_i\big((p^i-p)^\top n\big)n=0$，即 $n^\top\sum_i(p^i-p)=0$，取 $p^*=\frac1N\sum_ip^i$（centroid）就满足。代回去，objective 是

$$\sum_in^\top(p^i-p^*)(p^i-p^*)^\top n=n^\top Wn,\qquad W=\sum_i(p^i-p^*)(p^i-p^*)^\top$$

在 $\|n\|=1$ 下最小化 $n^\top Wn$，答案是 $W$ 最小的 eigenvalue 对应的 eigenvector（Rayleigh quotient）。最大的 eigenvalue 对应 curvature 最小的方向。Eigenvector 的符号是任意的，要把 normal 翻到朝向 camera 的一侧：在 camera frame 里要求 $n\cdot\bar p\le0$（$\bar p$ 是 camera 到 centroid 的 vector）。

ps4 Problem 10 直接在 depth image 上做：每隔 `UV_STEP = 10` 个 pixel 取一个中心，取 $7\times7$ 的 pixel window（`WINDOW_HALF_WIDTH = 3`）作邻域，只留 mask 内、coordinate 有限、depth 为正的点；点少于 3 个，或者第二小的 eigenvalue 不超过 $10^{-12}$ m² 的 patch 直接跳过。后一条是在排除“所有点几乎在一条 line 上”的情形：那时有两个方向的 spread 都接近 0，plane 不确定。

用 pixel window 当邻域便宜，但在 depth 的边缘会出事。看一个侧视的例子：camera 在上方，一个 box 立在 table 上，box 顶面高 10 cm。

::fig[m4210-normals] Box 顶面上的 window 给出竖直的 normal。跨过 box 边缘的 window（彩色的点）有 4 个点在顶面、3 个在 table 上，拟合出来的“plane”是一条斜线。

用 cm 为单位，边缘那个 window 的 7 个点是 $x=-6,-4,-2,0$ 处 $z=10$，$x=2,4,6$ 处 $z=0$。Centroid 是 $(0,\,40/7)=(0,5.714)$。

$$W_{xx}=36+16+4+0+4+16+36=112$$

$$W_{xz}=\sum x_i(z_i-5.714)=10\times(-6-4-2+0)=-120$$

（$\sum x_i=0$，所以 $z$ 减不减 centroid 不影响 $W_{xz}$。）

$$W_{zz}=4\times(10-5.714)^2+3\times(0-5.714)^2=4\times18.37+3\times32.65=171.43$$

Eigenvalue：

$$\lambda=\frac{112+171.43}{2}\pm\sqrt{\Big(\frac{112-171.43}{2}\Big)^2+120^2}=141.71\pm\sqrt{882.9+14400}=141.71\pm123.62$$

最小的是 18.09。它的 eigenvector 满足 $(112-18.09)n_x-120\,n_z=0$，$n_z=0.7826\,n_x$，normalize 后 $n=(0.788,0.616)$，已经朝上（朝 camera）。它和竖直方向的 angle 是 $\arctan(0.788/0.616)=52°$。这个点在真实世界里要么在 box 的顶角上，要么在 table 上，哪一个的 normal 都不是这个。用它判断 antipodal，会在 box 的边缘生出并不存在的 grasp。ps4 的 self-check 专门问了“PCA 遇到 depth discontinuity 会怎样”；常见的办法是邻域里只留 depth 和中心相近的点。

### 采样 antipodal grasp

教材第 5 章先说明为什么要 sample：cost function（下一节）对绝大多数随机的 $X^G$ 都是 0，因为两根 finger 之间根本没有点，gradient 无从谈起，所以文献里几乎都用随机 sampling 加 heuristic。教材提到两种 heuristic：一种按局部 curvature 摆 hand（让 normal 指向 palm、finger 沿最大 curvature 的方向，tenPas 2017），教材认为它对 YCB 里大量的 box 不太合适，box 的 curvature 没什么信息；另一种是 ray casting 找 antipodal 点对。ps4 Problem 11 用的是后一种：

1. 在物体 surface 上取一个点 $p_1$，normal $n_1$（朝外）。
2. 从 $p_1$ 沿 $-n_1$ 往物体里面射一条 ray，取最近的那个 intersection $p_2$ 和它的 normal $n_2$。Ray 的起点要往里挪一点，否则会打中 $p_1$ 所在的那个面；intersection 没有顺序，要自己挑最近的。
3. 检查 friction cone：chord $p_2\to p_1$ 与 $n_1$ 的 angle、与 $-n_2$ 的 angle 都不超过 $\alpha=\arctan\mu$。
4. 检查宽度不超过 gripper 的最大开口，然后把 gripper 的 $x$ 轴放在 chord 上、中点放在两点中间，做 collision check。

教材自己 notebook 里的代码更简单：随机取一个点，把 gripper 的 $x$ 轴对准它的 normal，从竖直开始依次 sample orientation，好坏全交给 cost 里的 antipodal 项去判断；找到落在两个 fingertip 之间的点之后，再把 hand 沿 $x_G$ 挪到让这些点居中，免得合拢 finger 时把物体碰倒。

在一个 10 cm × 6 cm 的 ellipse 截面上试五个 $p_1$，$\mu=0.5$，$\alpha=26.6°$。

::fig[m4210-antipodal] 依次显示五个候选。彩色 V 形是两个 contact 的 friction cone，虚线是 chord，深色块是两根 finger。

Ellipse 上沿 normal 的 ray 一定从 $p_1$ 出发时就和 $n_1$ 重合，所以第一个 angle 总是 0；要看的是另一端。$t=0°$（长轴端点）宽 10.0 cm，另一端 angle 0°，保留，但离 WSG 的 10.7 cm 只差 7 mm。$t=20°$ 宽 7.44 cm，另一端 angle 46.9°，丢掉。$t=45°$ 宽 5.96 cm、34.2°，丢掉。$t=70°$ 宽 5.94 cm、15.4°，保留。$t=90°$（短轴端点）宽 6.00 cm、0°，保留。$\mu$ 越大 cone 越宽，留下的越多：ps4 的 letter 物体用 $\mu=1.17$，$\alpha=\arctan1.17=49.5°$，上面五个就全部通过了。

### Cost：在剩下的里面挑

通过 cone 测试的候选通常很多，教材用一个 cost 排序：

$$\text{cost}=-\sum_i\big(n^i_{G_x}\big)^2\;-\;\alpha\,[0\ 0\ {-1}]\,R^G\,[0\ 1\ 0]^\top\;+\;\infty\cdot\mathbb 1[\text{collision}]$$

第一项对两根 finger 之间的所有点求和，$n^i_{G_x}$ 是点 $i$ 的 normal 在 gripper $x$ 轴（finger 合拢的方向）上的分量，平方让 normal 的符号无关。Finger 之间的 surface 越正对 finger，这一项越负。第二项里 $R^G[0\ 1\ 0]^\top$ 是 gripper 的 $y$ 轴（finger 伸出的方向）在 world 里的方向，再和 $(0,0,-1)$ 做 dot product，整项等于 $\alpha R^G_{3,2}$（$R^G$ 第 3 行第 2 列）：$y_G$ 正朝下时 dot product 等于 1，cost 减 $\alpha$，所以这一项偏爱从上往下抓。教材给的理由是 kinematically 受限的 arm 伸进 bin 时，竖直的 hand 对 arm 更顺手。第三项让碰到 bin 或 point cloud 的候选直接出局。教材没有给 $\alpha$ 的数值，也没有把 gravity 或 wrench 写进 cost；gravity 只是 antipodal heuristic 的动机。

教材自己列出了这套办法的 corner case：pregrasp 的 configuration 没有做 collision check（加一项 cost 就能补上）；物体卡在 bin 的角落时找不到 grasp，系统改用一个 pushing 动作把点往 bin 中间推；系统没有“物体”的概念，两个挨着的物体会被一起抓起来；重的物体应当在 center of mass 附近抓，它却可能抓 hammer 柄的最远端。教材的结论是这些要靠从经验里学 grasp metric（第 10 章）。

:::back
Friction cone、force closure 与 form closure 见 [Modern Robotics 第 11 站](../courses/NW-MODERNROBOTICS.html#grasp)；eigenvalue 与 Rayleigh quotient 见 [DSA2102 第 5 站](../courses/DSA2102.html#eig)。
:::

:::from
Static equilibrium 的方程、三条 contact 规则、friction cone 与 maximal dissipation、point contact 的不连续与 hydroelastic（torsional friction 随 squeeze 增大）、0.1 m 的错开、antipodal heuristic 与“两个 point contact 挡不住绕 axis 的 torque”、PCA normal 的推导、“朝向 camera 翻转”、largest eigenvalue 对应最小 curvature、在 depth image 上直接用相邻 pixel 代替 nearest neighbor、为什么要 sample、curvature 与 ray casting 两种 heuristic、教材 notebook 的简化 sampling、cost function 的三项与 $\alpha R^G_{3,2}$、corner case，来自 [教材第 5 章](https://manipulation.mit.edu/clutter.html)，这次逐字读了原文。Contact model 的四种描述、“torque about $\ell$ 永远挡不住”与 3D 需要几个 hard contact 的问题、soft finger 的 force closure、`UV_STEP = 10`、`WINDOW_HALF_WIDTH = 3`、$10^{-12}$ m² 的门槛、$n\cdot\bar p\le0$、ray 起点内移、$\mu=1.17$、`check_collision_free` 只查 gripper body box 的八个角、depth discontinuity 的 self-check，来自 [ps4](https://github.com/tlpmit/6.4210-2-fall26-handouts) Problem 1、6、10、11 的题目原文。Box 边缘的 PCA 例子、ellipse 上五个候选的数值、对 cost 第二项符号的解读，是为这一页算和推的；“邻域里只留 depth 相近的点”是常见做法，凭自己的知识写，教材和 ps4 都没有给这个办法。
:::

## [plan] Motion planning：IK as optimization、collision check 与 trajectory optimization

:::skip
快速路线必读（教材第 6 章 IK 与 trajectory optimization 两节，加 ps3 Problem 14 到 16，约 2.5 小时）。能把一个 grasp 要求写成 IK 的 constraint，能用 clearance 和 motion bound 证明一段 segment 安全，能说出 control point 上的 velocity bound 有多保守，就可以去第 6 站。GCS 一节纯属加深。
:::

### IK 写成 optimization

第 2 站的 differential IK 只管每一步走一小步。要让 gripper 到达一个 pose，直接求 $X^G=f_{kin}(q)$ 的 inverse 有麻烦：solution 可能有多个、无穷多个或没有。教材把它写成 optimization：

$$\min_q\;\|q-q_0\|^2\quad\text{s.t.}\quad X^G=f_{kin}(q),\;\;q_{min}\le q\le q_{max},\;\;d_{min}(q)\ge d$$

$q_0$ 是一个舒服的 nominal configuration，cost 在多个 solution 里挑离它最近的。真正的好处在 constraint 可以写得比“一个 pose”宽松得多。教材的例子是抓一个 cylinder，grasp 可以在 cylinder 的任何高度、绕 axis 的任何角度：

```python
ik.AddPositionConstraint(frameB=gripper_frame, p_BQ=[0, 0.1, -0.02],
    frameA=cylinder_frame, p_AQ_lower=[0, 0, -0.5], p_AQ_upper=[0, 0, 0.5])
ik.AddPositionConstraint(frameB=gripper_frame, p_BQ=[0, 0.1, 0.02],
    frameA=cylinder_frame, p_AQ_lower=[0, 0, -0.5], p_AQ_upper=[0, 0, 0.5])
```

Gripper 上两点 $(0,0.1,\pm0.02)$ 都要落在 cylinder 的 axis（cylinder frame 的 $z$ 轴，$\pm0.5$ m 的一段）上。两点决定一条 line，line 在 3D 里有 4 个 degree of freedom，所以这两条 constraint 固定了 gripper 的 4 个 DOF，留下沿 axis 的 translation 和绕 axis 的 rotation，正好是“任何高度、任何角度”。教材的建议是 cost 尽量简单（只做 joint centering），该是 constraint 的不要写成 penalty，constraint 写得越少越宽，feasible set 越大。

这个问题是 nonconvex 的：$f_{kin}$ 是 joint angle 的 sine、cosine 的 polynomial，collision constraint 也是 nonconvex 的。Feasible set 甚至可以不连通：arm 绕一根 post 从左边够和从右边够是两支 solution，local solver 跳不过去。教材对两者的分工是：full IK 解的是更 global 的问题，但不保证成功，cost 或 constraint 稍微一变，它给出的 $q$ 也可能跳很远，送给 robot 的 $\Delta q$ 会很大；differential IK 只做增量的一小步，适合跟踪一条在 end-effector space 里设计好的平滑命令，但它沿着当前这一支走，不会自己换到另一支 solution 上。

ps3 的开门题把 IK 用在一串 keyframe 上：每个 keyframe 一次 IK，position error 1 mm、orientation error $0.01\pi$ rad。Grasp frame 相对 handle 只 constrain $x$、$y$ 和 pitch，$z$、roll、yaw 放开，因为 idealized 的 point contact 下，沿 handle 滑、绕 handle 转、绕 finger 合拢的方向转都不受限。第一个 keyframe 从 `Q_NOMINAL` 出发，之后每个都用上一个的 solution 作初值，否则相邻两个 keyframe 可能落在不同的 branch 上，interpolation 时 arm 会整个翻过去（[RB2202](../courses/RB2202.html#ik) 里那个跳变就是这样来的）。PR2 那题说明 IK 失败可能只是“够不着”：目标 $(-0.83,1.30,1.40)$ 离 shoulder-pan axis 的水平距离约 1.228 m，超过约 0.821 m 的 reach，固定 base 时无解，让 base 也作为变量就有解；目标在 2.30 m 高时超过约 1.92 m 的高度上限，base 放哪里都没用。

### 一个能证明 segment 安全的条件

回到开头的第二次失败。Sampling-based planner（RRT、PRM，见 [Modern Robotics 第 7 站](../courses/NW-MODERNROBOTICS.html#plan)）把两个 configuration 连成直线之前，要确认这段 segment 不碰。开头的例子里 post 中心离 base $r=1.5$ m、在 45° 方向，半径 0.08 m。Arm 伸直、方向是 $\theta$ 时，post 中心到 arm 的距离是 $1.5\sin|\theta-45°|$（垂足离 base $1.5\cos|\theta-45°|<2$，在 arm 上），小于 0.08 就碰。所以 collision 的区间是 $|\theta-45°|<\arcsin(0.08/1.5)=3.06°$，即 41.94° 到 48.06°。每 10° 一个 sample 正好跨过去。

ps3 Problem 17（6.4212）给出一个可以证明的条件。记 $\eta(q)$ 为 configuration $q$ 的 clearance（arm 到 obstacle 的 signed distance），$\rho$ 为 motion bound：joint 走 $\|\Delta q\|$ 时，arm 上任何一点在 workspace 里走过的路程不超过 $\rho\|\Delta q\|$。

> 如果 $\eta(q)>0$、$\eta(q')>0$，并且 $\rho\|q-q'\|<\eta(q)+\eta(q')$，那么从 $q$ 到 $q'$ 的整段 segment 都不碰。

**证明。** 设 segment 中间某个 $q_s$ 碰了，即 arm 上某一点到达了 obstacle。在 $q$ 时这一点离 obstacle 至少 $\eta(q)$，所以从 $q$ 到 $q_s$ 它至少走了 $\eta(q)$ 的路程；同理从 $q_s$ 到 $q'$ 至少走了 $\eta(q')$。整段走过的路程至少 $\eta(q)+\eta(q')$，而 motion bound 说它不超过 $\rho\|q-q'\|$，矛盾。

**算 $\rho$。** Unit link 的 planar 2R arm，joint 1 转 $\Delta\theta_1$ 时离 base 最远 2 m 的 tip 走 $2|\Delta\theta_1|$，joint 2 转 $\Delta\theta_2$ 时离 elbow 1 m 的 tip 走 $|\Delta\theta_2|$，路程不超过 $2|\Delta\theta_1|+|\Delta\theta_2|\le\sqrt5\,\|\Delta q\|$（Cauchy–Schwarz：$(2,1)\cdot(|\Delta\theta_1|,|\Delta\theta_2|)\le\sqrt{5}\,\|\Delta q\|$），所以 $\rho=\sqrt5$。

**用在开头的例子上。** $\eta(40°)=\eta(50°)=1.5\sin5°-0.08=0.1307-0.08=0.0507$，和是 0.1015。$\|\Delta q\|=10°=0.1745$ rad，$\rho\|\Delta q\|=\sqrt5\times0.1745=0.390>0.1015$，证明不了。于是 bisection：检查中点 45°，$\eta=-0.08<0$，找到 collision。如果 post 在 60° 方向，$\eta(40°)=1.5\sin20°-0.08=0.433$，$\eta(50°)=1.5\sin10°-0.08=0.180$，和 0.613 大于 0.390，一次检查就证明整段安全。

Bisection 在 grazing contact（clearance 趋于 0）时可能永远分下去。ps3 的修补是要求每个 sample 有一个 margin $\delta>0$，这就给了最小的分段长度；固定步长 $\varepsilon$ 的 checker 只要每个 sample 的 clearance 都大于 $\rho\varepsilon/2$ 也是 sound 的。这套证明只管 robot 和 obstacle 之间；ps3 Problem 18 指出 self-collision 仍然只在 sample 上检查。

ps3 17.3 到 17.5 用的是同一种设定，数字更整：伸直的 2R arm 从 $\theta_1=0°$ 扫到 $90°$，半径 0.1 的 post 立在 $A=(1.2,1.2)$ 或 $B=(1.6,1.6)$，handout 给了 0°、22.5°、45°、67.5°、90° 的 clearance。Post 在 $A$ 时，它离 base $1.2\sqrt2=1.697$，arm 方向 $\theta$ 时的 clearance 是 $1.697\sin|\theta-45°|-0.1$（$\theta=22.5°$ 时 $0.649-0.1=0.549$，和 handout 的表一致），碰撞区间是 $|\theta-45°|<\arcsin(0.1/1.697)=3.38°$。每 10° 一个 sample 的 checker 查到 40° 和 50°，离 45° 都是 5°，都报 free，于是整段报 free，错了。Bisecting checker 第一次就查中点 45°，$\eta=-0.1$，报 collision。

Post 在 $B$ 时按定理走一遍，$\rho=\sqrt5=2.236$：

| 段 | 两端 $\eta$ 之和 | $\rho\,\|\Delta q\|$ | 结论 |
|---|---|---|---|
| 0° 到 90° | $1.5+1.5=3.0$ | $2.236\times1.571=3.512$ | 证明不了，查中点 45°：$\eta=0.163>0$ |
| 0° 到 45° | $1.5+0.163=1.663$ | $2.236\times0.785=1.756$ | 证明不了，查中点 22.5°：$\eta=0.771$ |
| 0° 到 22.5° | $1.5+0.771=2.271$ | $2.236\times0.393=0.878$ | free |
| 22.5° 到 45° | $0.771+0.163=0.934$ | $0.878$ | free |

右半边对称，再查 67.5° 一次。一共在 0°、90°、45°、22.5°、67.5° 五处算了 $\eta$，证明整段 free。（这几步是我按 handout 的表算的，解答没有核对。）

:::wrong 把 collision check 的 step 取到 1°，就足够安全
够不够取决于 obstacle 有多细。上面的 post 半径 8 cm，collision 区间宽 6.1°，1° 的 step 当然能抓到。换成一根半径 5 mm 的杆，同样放在 1.5 m 处，collision 区间的半宽是 $\arcsin(0.005/1.5)=0.19°$，总宽 0.38°，1° 一个 sample 完全可能跨过去。ps3 的 RRT 用 `EDGE_STEP = 1°` 规划，再用十分之一的 `CHECK_STEP` 复查，复查也只是降低漏检的 probability，证明不了什么；执行时的 tracking error 还会再加一层。另外各 joint 的 sensitivity 差很多：iiwa 上 fingertip 动 1 mm，joint 2 只需转 0.00092 rad，joint 7 要转 0.0167 rad（ps3 16.7），同一个角度 step 对不同 joint 的意义不一样。
:::

### RRT-Connect

ps3 Problem 16 先实现 RRT，再实现 RRT-Connect：从 start 和 goal 各长一棵 tree；一棵 tree 向 random sample 扩展一步之后，另一棵 tree 朝这个新 node 反复扩展，直到 Reached（两棵接上）或 Trapped（撞到 obstacle）。两棵 tree 互相“拉”，比一棵 tree 等着随机 sample 碰巧落到 goal 附近快得多。比较两者时 ps3 提醒按时间比，因为 RRT-Connect 的一轮可能包含好几次 extend。Goal bias `prob_sample_q_goal` 取 0 时 RRT 完全不朝 goal 偏，取 1 时退化成一直朝 goal 冲、绕不开 obstacle。没有 `max_iterations` 时，RRT 遇到无解的问题永远不会报告；在通常的假设下，有解时失败的 probability随 iteration 增加趋于 0。

RRT 给出的 path 是一串折线，教材和 ps4 Problem 9 都讲 shortcutting：随机挑 path 上两个不相邻的 node，如果直线连接它们不碰且更短，就替换中间那段，重复到预算用完。平滑之后要重新做 collision check，否则可能把 path 拉进 obstacle。

### Trajectory optimization：把 constraint 放在 control point 上

RRT 只给 path，不管 velocity、acceleration 的 limit。Kinematic trajectory optimization 把整条 trajectory 参数化成 $q_\alpha(t)$，对参数 $\alpha$ 和时长 $T$ 一起优化：

$$\min_{\alpha,T}\;T\quad\text{s.t.}\quad X^{G_{start}}=f_{kin}(q_\alpha(0)),\;\;X^{G_{goal}}=f_{kin}(q_\alpha(T)),\;\;|\dot q_\alpha(t)|\le v_{max}\;\;\forall t$$

“$\forall t$”是无穷多条 constraint。教材用 B-spline 参数化来处理它，关键是 convex hull property：curve 始终落在当前那几个 control point 的 convex hull 里。所以只要 control point 满足 position limit，curve 在所有 $t$ 上都满足；derivative 也是同样形式的 spline，它的 control point 是原 control point 的 linear combination，velocity limit 就变成 control point 上的 linear constraint。

用一个 cubic Bézier（B-spline 的一段）把这件事算清楚。一个 joint 从 0 转到 1 rad，路径写成 $q(t)=r(t/T)$，$s=t/T\in[0,1]$，control point 取 $c=(0,0,1,1)$：

$$r(s)=\sum_{i=0}^3c_i\binom3i(1-s)^{3-i}s^i=3(1-s)s^2+s^3=3s^2-2s^3$$

Degree $n$ 的 Bézier 的 derivative 是 degree $n-1$ 的 Bézier，control point 是 $n(c_{i+1}-c_i)$。这里是 $3\times(0,1,0)=(0,3,0)$：

$$r'(s)=\sum_{i=0}^2 3(c_{i+1}-c_i)\binom2i(1-s)^{2-i}s^i=3\times2(1-s)s=6s-6s^2$$

::fig[m4210-bezier] 左：一条 2 个 joint 的 cubic Bézier 与它的 hull。右：上面那个 joint 的 $dq/ds$，虚线是它的 control point $(0,3,0)$。

Hull 给出 $r'(s)\le3$，于是 $|\dot q|=|r'(s)|/T\le3/T$。要 $v_{max}=1$ rad/s，constraint 写成 $3/T\le1$，即 $T\ge3$ s。真正的最大值在 $s=0.5$，$r'(0.5)=6\times0.5-6\times0.25=1.5$，只需要 $T\ge1.5$ s。这个 bound 保守了一倍，换来的是“对所有 $t$ 成立”且是 linear constraint。分更多段、提高 degree 时 control point 会越来越贴近 curve，bound 也越来越紧。

Collision avoidance 就没有这么好的性质。Drake 用 `MinimumDistanceLowerBoundConstraint`，它是 nonconvex 的，而且只在一些离散的 $s_i$ 上检查；教材明说这样“不保证 trajectory collision-free”，办法是 optimization 时取密的 sample，执行前再密地检查一遍。Nonconvex 还意味着 initial guess 很重要：教材的 planar iiwa 例子先不加 collision 解一次，拿结果当初值再加 collision 解；clutter clearing 的例子用一条简单的 trajectory 当初值，避免 solver 找到绕 base 转 270° 的那条路。一个 point robot 绕过 $\|q\|_1\ge1$ 的方块时，一旦 solver 从一侧绕，就不会换到另一侧，因为中途必须先违反 constraint。

### Path 定了之后，最快能走多快

上面的 Bézier 例子里，velocity limit 1 rad/s 逼出 $T\ge1.5$ s，用的是均匀的 time scaling $s=t/T$。Path 本身不变，只改“沿 path 走的快慢” $s(t)$，能不能更快？这叫 time-optimal path parameterization（TOPP），教材第 6 章最后一节把它写成一个 convex 的问题。

记 path 为 $q(t)=r(s(t))$，要求 $\dot s>0$。用 chain rule：

$$\dot q=r'(s)\,\dot s,\qquad\ddot q=r''(s)\,\dot s^2+r'(s)\,\ddot s$$

这里 $\dot s^2$ 和 $\ddot s$ 让 constraint 看起来是 nonlinear 的。教材的 change of variables 是 $b(s)=\dot s^2$。对 $t$ 求导，一边是 $\dot b=b'(s)\,\dot s$，另一边是 $\dot b=2\dot s\ddot s$，所以 $b'(s)=2\ddot s$。代回去：

$$\dot q=r'(s)\sqrt{b(s)},\qquad\ddot q=r''(s)\,b(s)+\tfrac12\,r'(s)\,b'(s)$$

于是每一条 limit 都变成 $b$ 的 convex constraint：velocity limit 是 $r'_j(s)^2\,b(s)\le\dot q_{max,j}^2$，对 $b$ linear；acceleration limit 对 $(b,b')$ linear；把 $\ddot q$ 代进 manipulator equation，torque 是 $\tfrac12m(s)b'(s)+c(s)b(s)+\tau_g(s)$，torque limit 也是 linear 的。总时间

$$T=\int_0^T dt=\int_0^1\frac{ds}{\dot s}=\int_0^1\frac{ds}{\sqrt{b(s)}}$$

$1/\sqrt b$ 在 $b>0$ 上是 convex function，所以 objective 也是 convex 的。$\dot s>0$ 写成 $b(s_i)\ge\epsilon$。和 trajectory optimization 一样，这些 constraint 只在一组 sample 的 $s_i$ 上加，教材明说这里放弃了对所有 $t$ 的严格保证。

拿上面那个 joint 算一次：$r(s)=3s^2-2s^3$，$r'=6s-6s^2$，$r''=6-12s$，limit 取 $|\dot q|\le1$ rad/s、$|\ddot q|\le4$ rad/s²，起点和终点静止（$b(0)=b(1)=0$）。只有一个 joint 时，path 就是从 0 到 1 的那条线段，任何 $s(t)$ 都只是在这条线段上换个走法，最快的走法是先以 4 rad/s² 加速到 1 rad/s（用 $1/4=0.25$ s，走 $\tfrac12\times4\times0.25^2=0.125$ rad），以 1 rad/s 走完中间的 $1-2\times0.125=0.75$ rad（0.75 s），再用 0.25 s 减速停下，共 $0.25+0.75+0.25=1.25$ s。把 $s$ 切成 2000 段，在每段上按上面的 linear constraint 先正向、再反向取最大的 $b$，再数值积分 $\int ds/\sqrt b$，得到 1.245 s，和 1.25 s 只差离散化的误差。均匀 scaling 在同样两条 limit 下要 $\max(1.5/T,\;6/T^2)$ 都不超限：$T\ge1.5$ 且 $T\ge\sqrt{1.5}=1.22$，所以是 1.5 s；TOPP 省下的 0.25 s 来自中段一直贴着 velocity limit 走，均匀 scaling 只在 $s=0.5$ 那一点贴到。

教材说这类问题 1980 年代就有专门的 algorithm（Bobrow 1985 一类，去找 bang-bang 的切换时刻），和 convex optimization 的联系是后来（Verscheure 2009 等）才讲清楚的；常用的实现是 TOPPRA，Drake 里有 `PathParameterizedTrajectory`。Jerk limit 能不能也写成 convex 的，教材留作还没写完的问题：$\dddot q=r'''\dot s^3+3r''\dot s\ddot s+r'\dddot s$ 不再是 $b$ 的 linear function。

### Graphs of Convex Sets

:::skip
加深。跳过它会少掉“collision constraint 对所有 $t$ 成立”的那种 planner，ps3 和 ps4 都不用。
:::

GCS 把 collision-free 的 configuration space 事先切成若干个 convex region。同一个 convex region 里的两个点用直线连接，一定不碰；用 Bézier 连接，curve 在 control point 的 hull 里，control point 都在 region 里，curve 也就整条在 region 里，对所有 $t$ 成立。

于是 planning 变成 graph 上的 shortest path：每个 region 是一个 vertex，相交的两个 region 之间连 edge。走过一个 vertex 时，在这个 region 里放一段 curve（$n$ 维 configuration space 里，一个 vertex 的变量至少有 $2n$ 个：这段的起点和终点都要在 region 里），edge 上加 equality constraint 让前一段的终点等于后一段的起点，edge cost 是 length 或 time 这类 convex function。选哪些 edge 是离散的，curve 的位置是连续的，合起来是一个 mixed-integer convex program。教材说它的 convex relaxation（把 0/1 变量放宽到 $[0,1]$）非常 tight，实践中只解 relaxation 再做一点 rounding 几乎总能得到最优解。

Convex region 从哪里来是另一个问题：IRIS 交替找 separating hyperplane 和最大体积的 ellipsoid 来“长”一个 region，适合 mobile robot 这类 configuration space 本来就近似 Euclidean 的情形；arm 的 configuration space obstacle 不是 convex 的，要用 IRIS-NP（nonlinear solver 加随机 sample，probabilistically sound，不保证 region 完全 collision-free；新的 IRIS-NP2 快几个数量级、region 更大、面更少）或 IRIS-ZO（只用 sample 的 zeroth-order 版本，region 稍小但容易并行），或者用 sums-of-squares 给出严格证明（更慢，而且 region 是在 stereographic projection 的 coordinate 里求的）。iiwa 的例子先用 IK 在感兴趣的区域做 sampling，用包住这些 sample 的最小 ellipsoid 当 `starting_ellipse`，跑一次 IRIS。

:::back
Configuration space、RRT 与 PRM 的基本做法见 [Modern Robotics 第 7 站](../courses/NW-MODERNROBOTICS.html#plan)；IK 的 branch 跳变见 [RB2202 第 5 站](../courses/RB2202.html#ik)；time scaling 见 [RB2202 第 7 站](../courses/RB2202.html#traj)。
:::

:::from
IK 的 optimization 形式、cylinder 的两条 position constraint、“cost 简单、constraint 宽松”的建议、nonconvex 与 post 的两支 solution、IK 与 differential IK 的分工、trajectory optimization 的形式、B-spline 的 convex hull property、collision 只在 sample 上检查与 initial guess 的例子（270°）、$\ell_1$ 方块的 toy、GCS 的 formulation（$2n$ 个变量、edge 上的 equality）与 relaxation、IRIS 系列、time-optimal path parameterization 的 change of variables、各条 constraint 与 $\int ds/\sqrt b$、TOPPRA 与 jerk 的问题，来自 [教材第 6 章](https://manipulation.mit.edu/trajectories.html)，这次逐字读了原文；教材里 RRT、PRM、post-processing 几节目前只有标题。开门题的 constraint 选择与 tolerance、`Q_NOMINAL` 与 keyframe 初值、PR2 题的 1 mm、1°、1 cm 与 `IK_SEED`、clearance 定理、$\rho=\sqrt5$、post 在 $A$、$B$ 的 clearance 表、margin $\delta$ 与 $\rho\varepsilon/2$、self-collision 的提醒、`EDGE_STEP`、`CHECK_STEP` 与 16.7 的 joint sensitivity 表、RRT-Connect 的写法与“按时间比较”，来自 [ps3](https://github.com/tlpmit/6.4210-2-fall26-handouts) Problem 14 到 18 的题目原文；shortcutting 也见 ps4 Problem 9。PR2 的 1.228/0.821/1.92 m 沿用上一版从解答摘要里记下的数，没有再核对。“两点决定 4 个 DOF”的解读、开头 post 例子的几何与全部数值、ps3 17.3 到 17.5 的走法、证明的写法、5 mm 杆的例子、cubic Bézier 的推导与“保守一倍”、TOPP 的 1.25 s 与 1.245 s，是为这一页推和算的。
:::

## [force] Force control 与 hybrid position/force control

:::skip
快速路线里可以跳（研究底稿没有把第 8 章列入快速路线）；ps7 的 Problem 2 到 5 是这一站的题。做灵巧手、真机接触任务的话值得读：能说出擦桌面时 $z$ 方向为什么用 force，能写出 hybrid control 的 control law，能推出拖书时两个 contact 各自要满足的 friction 条件，就可以去第 7 站。
:::

### 碰到东西时，position control 在做什么

[RB2203](../courses/RB2203.html#task) 已经算过：position controller 有 gravity 时会留下 $mg/k_p$ 的 steady-state error，被挡住时 integral 会 wind up，所以 manipulation 里通常 $K_i=0$；Cartesian stiffness 把 end-effector 挂在一根 spring 上，压桌面的 force 由 $K$ 和“目标压进去多深”决定。这里接着问：如果任务本身就是关于 force 的（擦桌子、拧螺丝、插 peg），能不能直接控制 force？

教材用一个 point finger 讲：mass $m$，input $u$，环境给它的 contact force 是 $f^{F_c}$，

$$m\ddot x=\tau_g+u+f^{F_c},\qquad\tau_g=(0,-mg)^\top$$

记号上 $f^{F_c}$ 是作用在 finger $F$ 上、作用点在 $c$ 的 force，同一个 force 作用在 box $B$ 上记作 $f^{B_c}$，两者相反：$f^{F_c}=-f^{B_c}$。教材特别提醒，不分清这两个，后面的符号一定会乱。

想让 finger 对环境施加 $f_d$，环境对 finger 的 force 就是 $-f_d$。Finger 静止时 $\ddot x=0$，所以 $0=\tau_g+u-f_d$，

$$u=f_d-\tau_g$$

这就是 direct force control（教材写成 $u=-mg-f^{F_c}_{desired}$，$f^{F_c}_{desired}$ 是作用在 finger 上的那个 force）。它只需要知道 finger 自己的 mass，不需要知道物体的 mass，也不需要知道物体在哪里。“静止”这个假设在 manipulation 里通常不算太差，动作一般都慢；要不然就得测 acceleration（很吵），或者测 contact force 做 feedback。教材的模拟里 finger 从 box 旁边出发，在 $x=0.089$ 处撞上 box：force 小时 box 几乎不动；中等时 box 被推动一段，friction 让它停下；force 大时 finger 一直把 box 推到对面的墙。

:::wrong Direct force control 让 robot 安全地停在接触上
没接触时它不会停。Free space 里 $f^{F_c}=0$，代回去 $m\ddot x=\tau_g+f_d-\tau_g=f_d$：finger 以 $f_d/m$ 的 acceleration 一直加速，直到撞上东西。教材把这一点当作 force control 吸引人的地方：不需要知道 box 的几何，只要有一条直线能碰到它，finger 自己就会去接触；legged robot 落脚时也这样用（swing 时近似 position control，落地时切到 force control，对地形的感知要求低得多）。代价是撞上时的速度：取 $m=1$ kg、$f_d=2$ N，离桌面 0.1 m，撞上时 speed 是 $\sqrt{2\times2\times0.1}=0.63$ m/s。ps7 4.3 把“direct force control 总能保证 robot 安全地停下来”列为要判断的说法，它是错的。
:::

### Feedback 与 feedforward：两个最小的例子

ps7 Problem 4 用两个一维的 plant 把“哪一项负责什么”拆开。

**Velocity-controlled joint**，$\dot q=u$，跟踪 $q_d(t)=q_0+vt$。P control $u=K_p(q_d-q)$，记 $e=q_d-q$，$\dot e=\dot q_d-\dot q=v-K_pe$。Steady state 是 $\dot e=0$，即 $e=v/K_p$：取 $K_p=10$ s$^{-1}$、$v=0.5$ rad/s，joint 永远落后 0.05 rad。加上 feedforward $u=\dot q_d+K_p(q_d-q)$，$\dot e=v-(v+K_pe)=-K_pe$，error 指数地趋于 0。加 integral 也能消掉这个 lag，代价是多一个要调的 gain。

**Torque-controlled joint 举着一个重物**，$I\ddot q=u-\tau_g$。PD 在 setpoint 上静止时 $\dot q=\ddot q=0$，$0=K_p(q_d-q)-\tau_g$，$e=\tau_g/K_p$，就是 $mg/k_p$ 那个 error。PID 的 integral 在 steady state 补上 $\tau_g$，error 可以是 0，但不是任何一组正的 gain 都 stable。教材的 `JointStiffnessController` 走另一条路：feedforward $-\tau_g$ 直接抵消模型里的 gravity，不靠 error 去撑，所以 gain 可以调得很低。

### Position 与 force 同时给

教材的一般形式是在 stiffness 之上再加一个 feedforward force。ps7 Problem 2 用 point mass 在一条直线上把它算清楚：

$$m\ddot x=u+f_c,\qquad u=k_p(x_d-x)-k_d\dot x-f_d$$

$f_c$ 和 $f_d$ 都是作用在 robot 上的 force，正方向为 $+x$。$f_d>0$ 时 $-f_d$ 让 robot 往 $-x$ 推，那一侧的 surface 推回来，$f_c>0$。零 error 的意思是 $x=x_d$ 且 $f_c=f_d$。

**Free space。** $f_c=0$，steady state $\dot x=\ddot x=0$ 时 $0=k_p(x_d-x)-f_d$，$x=x_d-f_d/k_p$。取 $k_p=1000$ N/m、$f_d=2$ N、$x_d=0$：robot 停在 $x=-2$ mm，position error 2 mm，force error $f_c-f_d=-2$ N。两个 error 不可能同时为 0：没有 surface，就没有东西提供 reaction force。

**贴着一面墙。** 墙限制 $x\ge0$，robot 在 $x=x_d=0$ 处接触。Steady state 时 $0=k_p\cdot0-f_d+f_c$，$f_c=f_d=2$ N，两个 error 都是 0：墙提供的 reaction force 正好平衡了 $u=-f_d$。

这和下面的 hybrid control 是同一个接口：把某个方向的 $k_p$、$k_d$ 设成 0，那个方向就只剩 force。

### Hybrid：每个方向选一样

擦桌面的任务里，$x$ 方向要沿着一条线走，$z$ 方向要压在桌面上。教材的 hybrid control 让每个方向各用一种：

$$u=-\tau_g+\begin{pmatrix}k_p(x_d-x)+k_d(\dot x_d-\dot x)\\ f_{d,z}\end{pmatrix}$$

（这里 $f_{d,z}$ 取向下的 force 为负，写成 finger 对桌面施加 $|f_{d,z}|$。）为什么 $z$ 不用 position？因为桌面的高度只是估计。

::fig[m4210-hybrid] 三种情形下 finger 都在 $x$ 方向做 position control，只看 $z$ 方向。虚线是估计的桌面，$k_p=1000$ N/m，gravity 已补偿。

$z$ 用 position control，目标设在估计的桌面上：估计高了 1 cm，finger 悬在空中，什么也没擦到；估计低了 1 cm，spring 被压缩 1 cm，force 是 $1000\times0.01=10$ N，是想要的 5 倍。$z$ 用 force control，桌面在哪里都压 2 N，position 自己去适应真实的 surface。教材的说法是：commanded normal force 让 finger 跟着墙走，即使 normal 的估计错了也一样；position control 的 robot 估错了墙的 normal，会在一边离开墙、在另一边压得极重。

Surface 不水平时，在 contact frame 里写：$x$、$z$ 换成 contact 的 tangential 和 normal 方向，force 用 ${}^WR^C$ 转回 world。合起来的一般形式是 $u=-\tau_g+K_p(p^{F_d}-p^F)+K_d(v^{F_d}-v^F)-f_{ff}$：在要控 force 的方向把 $K_p$、$K_d$ 设成 0，就得到上面的 hybrid。教材指出，这和 iiwa 等 torque-controlled robot 提供的接口很接近。

### 拖一本书

教材配了一段视频：gripper 压住一本书，把它在桌面上拖走。要求是 finger 与书之间不打滑，书与桌面之间要滑。ps7 Problem 5 把条件推出来。书的 mass 是 $m$，gripper 向下压 $F>0$，gripper–书之间的 static friction 系数 $\mu_C$，书–桌面之间 $\mu_A$。没有竖直方向的 acceleration，所以桌面对书的 normal force 是 $F+mg$。

- 书要滑，gripper 给书的水平 force $H$ 要超过桌面能给的最大 friction：$H>\mu_A(F+mg)$。
- Gripper 与书不打滑，$H$ 不能超过这个 contact 的 friction cone：$H\le\mu_CF$。

两条能同时满足，当且仅当 $\mu_CF>\mu_A(F+mg)$，两边除以 $\mu_AF$：

$$\frac{\mu_C}{\mu_A}>1+\frac{mg}{F}$$

由此能直接读出两件事。$\mu_C$ 小了不行：它限制的是 gripper 能传多大的 tangential force。$\mu_C>\mu_A$ 时，压得越重越容易：$F\to\infty$ 时右边趋于 1，两边的 friction 都随 $F$ 增大，但 gripper 那边增长得更快（斜率 $\mu_C$ 对 $\mu_A$）。取一组数检验（这组数是为这一页取的，ps7 没有给书的 mass）：$\mu_A=0.3$、$\mu_C=1.0$、$mg=3$ N，左边 $3.33$，要求 $1+3/F<3.33$，即 $F>1.29$ N。用 ps7 simulation 里的 $F=10$ N，桌面最多给 $0.3\times13=3.9$ N，gripper 最多传 $1.0\times10=10$ N，任何 $3.9<H\le10$ N 的水平 force 都能拖动书而不打滑。

这正是 hybrid 的分工：$z$ 方向的 force 决定两个 friction 上限，必须直接给；$x$ 方向往哪里拖用 position。ps7 的实现题在 planar iiwa 上写 `compute_ctrl`：输入 gripper 的 $(\theta_y,x,z)$ 和 $(\omega_y,\mathrm v_x,\mathrm v_z)$，输出 end-effector wrench $w=(\tau_y,f_x,f_z)$，wrapper 用 $J^\top w$ 换成 joint torque，gravity compensation 由 station 负责。Pitch 和 $x$ 用 PD（$k_{p\theta}=10$、$k_{d\theta}=3$、$k_{px}=50$、$k_{dx}=15$，desired 的 pitch rate 和水平 velocity 取 0），$z$ 没有 position feedback，只给 $f_z=-F_d$（world $z$ 朝上，向下压是负的）：

$$\tau_y=10(0-\theta_y)+3(0-\omega_y),\qquad f_x=50(x_d-x)+15(0-\mathrm v_x),\qquad f_z=-F_d$$

代 handout 给的 verification input $(\theta_y,x,z)=(0.1,0.8,0.05)$、$(\omega_y,\mathrm v_x,\mathrm v_z)=(0.2,-0.1,0)$、$x_d=0.65$、$F_d=2$：$\tau_y=-1-0.6=-1.6$ N·m，$f_x=50\times(-0.15)+15\times0.1=-7.5+1.5=-6.0$ N，$f_z=-2.0$ N。（这是我按题目的定义算的，解答没有核对。）Simulation 里 $x_d(t)=0.65-0.125\max(t-2,0)$ m、$F_d=10$ N，跑 6.5 s，handout 要求书的中心最后落在 0.35 到 0.55 m 之间，fingertip 始终不低于 $z=0.035$ m。

### Stiffness control 也是一种 force control

Hybrid 需要事先决定“哪个方向在接触”。Stiffness control 不做这个决定：把 finger 挂在一个 virtual spring-damper 上，

$$u=-\tau_g-b\dot x-k(x-x_d)$$

没接触时它就是 position control；接触时 spring 被压缩，force 是 $k(x_d-x)$，force 由“$x_d$ 设在 surface 里面多深”决定。所以它被叫做 indirect force control（Salisbury 的 stiffness control、Hogan 的 impedance control）。只改 stiffness 和 damping 叫 stiffness control；连 effective mass 也改才是完整的 impedance control，教材说控制领域的共识是改 mass 多数时候不值得，sensing 和 bandwidth 的要求太高。教材强调它的一个好处：robot 和环境都是 dissipative 的时候，耦合起来的系统一定 stable（passivity），不需要知道环境的 model。Stiffness 矩阵也可以写在另一个 frame $A$ 里：$K_p$ 换成 ${}^WR^AK_p\,{}^AR^W$。

### 翻起一个 box

教材的 box flip-up 用了两种写法。Force 版本：finger 在 box 右上角 $C$ 施力，让 box 绕左下角 $A$ 转起来，同时要求 $A$ 不滑。教材在 friction cone 的 constraint（两个 contact 各一个）和 box 的 force balance 下解一个 least squares，让 finger 对 $A$ 的 torque 等于一个 PID（作用在 box 的角度 $\hat\theta$ 上）的输出；它只需要 $\hat\theta$、两个 $\hat\mu$、finger 相对 corner 的大致位置和 box 的大致 mass，教材说对这些估计相当 robust。

刚开始翻、box 还近似竖直时，什么样的 force 可行？ps7 Problem 3（来自教材的 exercise “Box Flip-up”）用 axis-aligned 的近似算出上下界。Box 是边长 $s$、mass $m$ 的正方形；finger 在 $C$ 处给一个向左的 normal force $N>0$ 和一个向上的 tangential force $T\ge0$，要求 $T\le\mu_CN$；gravity $mg$ 作用在中心；地面只在 $A$ 处给 reaction $R_x$、$R_z$。

::fig[m4210-tip] 左：box 与各个 force。右：$\mu_A=0.25$ 时，$N/mg$ 必须落在下界与上界之间；$\mu_C=1$ 时区间是空的，$\mu_C=3$ 时不空。

**Tipping。** 对 $A$ 取 moment：$N$ 的 moment arm 是 $s$（作用在高 $s$ 处），$T$ 的 moment arm 也是 $s$（作用在水平距离 $s$ 处），gravity 的是 $s/2$，开始转的条件是 $s(N+T)-smg/2>0$，即 $N+T>mg/2$。

**Finger 不滑。** $T\le\mu_CN$，所以 $N+T\le(1+\mu_C)N$。要 $N+T>mg/2$ 可行，必须

$$N>\frac{mg}{2(\mu_C+1)}$$

**Pivot 不滑。** 水平方向 $R_x=N$，竖直方向 $R_z=mg-T$（$T$ 向上，地面少承担一部分），要求 $N\le\mu_AR_z=\mu_A(mg-T)$。$T$ 越大地面越“轻”，pivot 越容易滑，所以 $T$ 只取 tipping 所需的最小值附近：由 $N+T>mg/2$，$T>mg/2-N$，于是 $mg-T<mg/2+N$，

$$N\le\mu_A(mg-T)<\mu_A\Big(\frac{mg}{2}+N\Big)\quad\Rightarrow\quad N(1-\mu_A)<\frac{\mu_Amg}{2}\quad\Rightarrow\quad N<\frac{\mu_Amg}{2(1-\mu_A)}\quad(0<\mu_A<1)$$

**两个界放在一起。** 区间不空，当且仅当 $\frac{1}{2(\mu_C+1)}<\frac{\mu_A}{2(1-\mu_A)}$，即 $1-\mu_A<\mu_A(1+\mu_C)$，

$$\mu_C>\frac{1-2\mu_A}{\mu_A}$$

取 $\mu_A=0.25$（教材说相当于 wood 对 metal）：上界是 $N<0.25mg/1.5=mg/6=0.1667\,mg$，要 $\frac{1}{2(\mu_C+1)}<\frac16$，即 $\mu_C>2$。$\mu_C=1$ 时下界是 $mg/4=0.25\,mg$，比上界大，翻不起来；$\mu_C=3$ 时下界是 $mg/8=0.125\,mg$，$N$ 取 $0.125\,mg$ 到 $0.1667\,mg$ 之间就行。$\mu_A=1$（concrete 对 rubber）时 $N(1-\mu_A)<\mu_Amg/2$ 恒成立，pivot 那一边没有上界，任何 $\mu_C\ge0$ 都有有限的 force 能翻起 box。$\mu_A\ge0.5$ 时右边 $\frac{1-2\mu_A}{\mu_A}\le0$，同样对 $\mu_C$ 没有要求。

Stiffness 版本更简单：先把 box 推进角落，在 finger 和墙上 box 左上角稍高处的一点之间挂一根“rubber band”，即把 virtual finger 移到墙前面压出一个支撑的 contact force，再把 virtual finger 沿墙往上移，box 绕上角像 pendulum 一样转起来；上角迟早会打滑，但同一根 spring 会让 finger 从上面把 box 压下去完成动作。教材的评价是：要是写一个 estimator 去检测打滑的那一刻再重新规划，“那不是通往幸福的路”。

### 真机上：iiwa 的 joint impedance 与 $\tau_{ff}$

一般的 manipulator 上，joint stiffness control 是

$$u=-\tau_g(q)+K_p(q_d-q)+K_d(\dot q_d-\dot q)+\tau_{ff}$$

它和普通 PD 只差 $-\tau_g$ 一项，但不再靠 error 去撑住 gravity，所以能用低得多的 gain，接触时很顺从，没有外力时照样跟得准。它只抵消 gravity（和 friction），不改变 inertia；iiwa 的 joint-impedance mode 也会 shape 一点 rotor inertia，但用户设不了，从用户角度看就是 stiffness control。对比 `InverseDynamicsController`：闭环后是 $\ddot q+K_p(q-q_d)+K_d(\dot q-\dot q_d)=M^{-1}\tau_{ext}$，feedback 写在 acceleration 的单位里，前提是 $M$、$C$ 估得准。Cartesian 版本经 $u=J^\top f_u$ 把一个 end-effector force 换成 joint torque（virtual work；ps7 4.4 问的就是这个 map 是 $J^\top$），闭环后 end-effector 像一个 spring-damper；有多余的 joint 时还要在 dynamically-consistent 的 null space 里加 joint centering，这就是 Khatib 的 operational space control。

iiwa 自带 Cartesian impedance mode，但教材指出：在 joint 和 Cartesian mode 之间切换要先停下 robot，运动中也不能改 stiffness 和 frame。实际的做法是一直留在 joint impedance mode，把想要的 Cartesian force 换成 $\tau_{ff}=J^\top f$ 送进去。iiwa 的接口只收 desired joint position，不收 desired velocity，教材认为它内部对 position 命令做数值差分，会带来几个控制周期的延迟。教材给的真机 gain 是 $[800,600,600,600,400,200,200]$ N·m/rad。Gripper 的 inertia 在 pendant 里设一次，之后抓起物体、finger 开合造成的变化不会被补偿。Simulation 里则偏好 `InverseDynamicsController`，因为要在 physics 里得到差不多的 stiffness，它的 differential equation 的等效 stiffness 更小，可以用更大的 integration time step；用上面那组 gain 直接 simulate 需要很小的 step。

### Peg in hole

把圆 peg 插进圆孔，间隙很小。Peg 的位置稍有偏差，孔口的 chamfer 加上一点水平方向的 compliance 就能把它导进去。Orientation 偏了更麻烦：peg 会在孔里卡住（jamming），在 Coulomb model 下 friction force 可以变得很大、而且不唯一。需要的 rotation 应该绕 contact 点发生，而不是绕 gripper；stiffness control 可以把 compliance 的中心放在 peg 的 tip 附近，但间隙很小时要求很高的 sensing 和 bandwidth。Remote center compliance（RCC）是一个被动的机械装置，把 compliance 的中心放在 gripper 外面、peg tip 附近，不需要 sensing，bandwidth 等于无穷。这一节教材只给了定性的讨论，配套的 exercise 让你先给一个 floating peg 写 stiffness control，再给 planar iiwa 写 operational space 的 stiffness controller。

:::back
$mg/k_p$、integral windup、joint impedance、Cartesian stiffness 与 operational space control 见 [RB2203 第 5、6 站](../courses/RB2203.html#task)；friction cone 见[第 4 站](#grasp)。
:::

:::from
Point finger 的 model 与 $f^{F_c}=-f^{B_c}$ 的记号、direct force control 只需 finger 的 mass 与“accelerations 近似为 0”的假设、$x=0.089$ 与 box 的三种结果、free space 里朝 force 方向加速与 legged robot 的说法、`JointStiffnessController` 与 `InverseDynamicsController` 的闭环形式、hybrid 的 control law 与 contact frame 版本、“跟着墙走”、position 加 feedforward force 的一般形式、拖书的视频、stiffness 与 impedance 的区别、passivity、box flip-up 的两种写法、joint stiffness 与 Cartesian stiffness、operational space control、iiwa 不能切 mode、只收 position 命令、$\tau_{ff}$、gain 数组、simulation 用 `InverseDynamicsController`、peg-in-hole 的 chamfer、jamming 与 RCC，来自 [教材第 8 章](https://manipulation.mit.edu/force.html)，这次逐字读了原文和 exercises。Feedback 与 feedforward 的两个 plant、position 加 force 的 point mass 与零 error 的定义、box 翻起的设定与 tipping-moment test（含 $\mu_A=0.25$、$\mu_A=1$ 两种情形）、拖书的 friction 条件与 $\mu_C/\mu_A>1+mg/F$ 的形式、`compute_ctrl` 的接口与 gain、verification input、$x_d(t)$、10 N、6.5 s 与验收范围，来自 [ps7](https://github.com/tlpmit/6.4210-2-fall26-handouts) Problem 2 到 5 的题目原文和 handout 代码 `hybrid_force_control.py`。上一版写“我读到的 problem set 里没有对应的题”，是因为 ps7 当时没有抓到。所有推导和数值（$0.05$ rad、$-2$ mm、上下界的推导、$\mu_C>2$、拖书的 $1.29$ N 与 $3.9$ N、wrench 的 $(-1.6,-6.0,-2.0)$）是我按题目算的，ps7 的解答没有读到。$u=f_d-\tau_g$ 的符号约定、0.63 m/s 的例子、擦桌面的三格对比与 10 N、2 N、拖书那组 $\mu$ 与 $mg$，是为这一页写和取的。
:::

## [policy] Imitation learning 的工程选择：action 的表示与评估

:::skip
快速路线必读（ps5 的 bookwork，约 3 小时；研究底稿说这 13 道题本身就是一份紧凑的讲义）。Behavior cloning、DAgger、diffusion policy、action chunking 的原理先看 [RB4301 第 5 到 7 站](../courses/RB4301.html#bc)。能说出 velocity command 与 position target、relative 与 absolute action 各错在哪里，能把 6 个数变成 rotation matrix，能判断 8/10 对 6/10 说明了什么，就读完了这一页的正文。
:::

### Velocity command 还是 position target

Demonstration 记录下来的是 robot 的 position。如果 policy 要输出 velocity，label 就要从 position 差分出来。ps5 5.1：两次测量相隔 0.02 s，读数是 $-1$ mm 和 $+1$ mm（真实的 robot 静止，只是 sensor noise），差分出来的 velocity 是 $2/0.02=100$ mm/s；sampling 快一倍、相隔 0.01 s，就变成 200 mm/s。sampling 越快，velocity label 越吵。

执行时两者的差别更大。ps5 5.2 设 policy 预测错了，而且 1 s 之内不会给新的预测，robot 每 0.1 s update 一次，一直执行这个错的命令。应该是 0 的 velocity 被预测成 5 mm/s 时 $x_n=0.5n$ mm，没有上限。应该是 0 的 position target 被预测成 1 mm、robot 每次从当前位置走到 target 的一半时（两种错误第一步走得一样远），$x_n=1-2^{-n}$ mm：

| update | velocity command | position target |
|---|---|---|
| 1 | 0.500 | 0.500 |
| 2 | 1.000 | 0.750 |
| 3 | 1.500 | 0.875 |
| 10 | 5.000 | 0.999 |

前者在 policy 稍微多输出几次时就一路走过头，后者 converge 到 target。ps5 5.3 再看 disturbance：两只手都要停在 0，被撞到 4 mm，policy 没有新的判断，继续输出原来的东西。

::fig[m4210-posvel] 上面那只手的 policy 一直输出 velocity 0，下面那只一直输出 target 0。被撞之后，上面停在 4 mm，下面回到 2、1、0.5 mm。

Velocity command 里没有“应该在哪里”的信息，被推开就留在那里；position target 每一步都把“应该在哪里”重说一遍，底层的 controller 负责把 error 拉回来。这也是为什么多数 manipulation policy 输出 position target，交给 joint 或 Cartesian impedance controller 去跟踪（[现代强化学习实践](../courses/MODERN-RL.html#reward)从 RL 的角度讲了同一件事）。

### 哪个 frame：relative 还是 absolute

ps5 Problem 6：两个场景只差 robot 的起点，A 在 world 里 0.20 m，B 在 2.20 m，camera 看到的 image 完全一样（物体相对 gripper 的位置相同）。正确的 action chunk 是“从当前位置先走 0.10 m，再走 0.20 m”。

- Absolute target：A 是 $(0.30,0.40)$，B 是 $(2.30,2.40)$。
- Relative target：两个场景都是 $(0.10,0.20)$。

只看 image 的 deterministic policy 对两张一样的 image 只能给一样的输出，所以学得会 relative，学不会 absolute。把当前 pose 也作为 input 时两种都能学，world 里的 target 由 ${}^WX^{G_{t+j}}={}^WX^{G_t}\,{}^{G_t}X^{G_{t+j}}$ 得到。

还有精度的问题。ps5 6.4 设起点 $h\in[-10,10]$ m，向前的位移 $d\in[0.05,0.20]$ m，于是 absolute target $h+d$ 的范围是 $[-9.95,10.20]$ m，relative 是 $[0.05,0.20]$ m。训练时每个 output 线性地缩放到 $[0,1]$，scaled output 上同样 0.01 的 error（满量程的 1%），absolute 是 $0.01\times20.15=0.2015$ m，relative 是 $0.01\times0.15=0.0015$ m。要 1 mm 的精度，absolute 表示对 network 的要求是 relative 的 134 倍。

### Rotation 怎么交给 network

Network 输出的是一串实数，rotation 要变成实数。ps5 Problem 11 把常见的表示按三种毛病分类：J（相邻的 rotation 对应很远的数）、U（同一个 rotation 有多种写法）、C（数要满足 constraint）。

| 表示 | 毛病 |
|---|---|
| roll-pitch-yaw | J、U |
| unit quaternion，两个符号都允许 | J、U、C |
| unit quaternion，第一个非零分量取正 | J、C |
| $R$ 的全部 9 个 entry | C |
| $R$ 的第 2、3 个 column（6 个数） | C |

J 对 regression 伤害最大：两个几乎一样的 rotation，label 却差很远，MSE 会把 policy 拉向两者的平均，那是一个完全不同的 rotation。固定 quaternion 的符号消掉了 U，却在“第一个分量接近 0”处造出了 J。9 个 entry 和 6 个数都只有 C，而 C 可以在 output 之后修掉。6D 表示用 Gram–Schmidt 把任意两个 vector 变成 rotation matrix（ps5 11.2 的写法）：

$$r_2=\frac{u}{\|u\|},\qquad w=v-(r_2^\top v)\,r_2,\qquad r_3=\frac{w}{\|w\|},\qquad r_1=r_2\times r_3$$

ps5 11.3 的例子：$u=(2,0,0)$，$v=(1,0,3)$。$r_2=(1,0,0)$；$r_2^\top v=1$，$w=(1,0,3)-(1,0,0)=(0,0,3)$，$r_3=(0,0,1)$；$r_1=(1,0,0)\times(0,0,1)=(0\cdot1-0\cdot0,\;0\cdot0-1\cdot1,\;1\cdot0-0\cdot0)=(0,-1,0)$。

$$R=\begin{pmatrix}0&1&0\\-1&0&0\\0&0&1\end{pmatrix},\qquad\det R=0\cdot(0\cdot1-0)-1\cdot(-1\cdot1-0)+0=1$$

Cross product 的顺序反过来（$r_1=r_3\times r_2$）得到 determinant $-1$，是 reflection。这个 map 在 $u$、$v$ 不平行的地方都 continuous，相邻的 rotation 总能由相邻的 6 个数得到，所以没有 J。为什么 3 个或 4 个数做不到这一点：ps2 2.9 问的就是“为什么任何三个数的表示都免不了在某处出 singularity”；quaternion 的 4 个数则有 $q$ 与 $-q$ 的 double cover，固定符号又造出 J。ps5 把 Zhou 等人的 On the Continuity of Rotation Representations in Neural Networks（CVPR 2019）列为这道题的背景阅读，6D 表示就出自这篇；论文正文我没有读。

### 再看一次 multimodal

ps5 Problem 3 用两个 waypoint 的 toy 把 [RB4301](../courses/RB4301.html#gen) 讲过的 averaging 问题再推一步：$(y_1,y_2)$ 两个分量要同号、绝对值至少 1/2，demonstration 一半是 $(-1,-1)$、一半是 $(1,1)$。Regression 输出平均值 $(0,0)$，两条路都不成功。整条随机取一条 demonstration，成功率 100%。每个 waypoint 各自独立地随机取正负，成功率只有 1/2：$(1,-1)$ 和 $(-1,1)$ 都不同号。这对 action chunk 是一个直接的提醒：一个 chunk 里的各步要一起 sample，分开 sample 各步的 marginal 会把两种“各自都好”的 mode 拼成一个坏的。另一点是：总选 $(-1,-1)$ 也是 100% 成功，policy 并不需要复现 demonstration 里 50/50 的比例，只是 maximum likelihood 恰好会学出这个比例（ps5 3.5）。

### 评估：几次 trial 才算数

真机实验最常见的结论是“我们的 policy 成功 8/10，baseline 6/10”。ps5 Problem 10 问这能说明什么。设两个 policy 各跑 $N$ 次，A 成功 80%，B 成功 60%，$N$ 取 5、10、100。

Normal approximation 的 two-proportion z-test：$H_0$ 是两者 success rate 相同，pooled rate $\hat p=(0.8N+0.6N)/(2N)=0.7$，两组差的 standard error 是

$$\mathrm{SE}=\sqrt{\hat p(1-\hat p)\Big(\frac1N+\frac1N\Big)}=\sqrt{0.21\times\frac2N},\qquad z=\frac{0.8-0.6}{\mathrm{SE}}$$

$N=5$：$\mathrm{SE}=\sqrt{0.084}=0.290$，$z=0.690$。$N=10$：$\mathrm{SE}=\sqrt{0.042}=0.205$，$z=0.976$。$N=100$：$\mathrm{SE}=\sqrt{0.0042}=0.0648$，$z=3.09$。Two-sided 的 p-value 分别是 0.490、0.329、0.00203。sample 小时 normal approximation 不可靠（ps5 要求每组的 expected success 和 failure 都至少 5，只有 $N=100$ 满足），用 Fisher exact test 得 1.00、0.628、0.00319。只有 $N=100$ 在 $\alpha=0.05$ 下显著。

::fig[m4210-evalci] 三组实验的 success rate 和 95% Wilson interval。$N=10$ 时 A 的 interval 是 49% 到 94%，B 是 31% 到 83%。

三组实验观察到的差距都是 20 个百分点，结论却完全不同。ps5 10.3 强调的另一半是：$N=10$ 时 p = 0.628 也不说明两者一样好，只是这点数据分不出来。

要多少次才够？按同一个 z-test、$\alpha=0.05$ two-sided，真值确实是 80% 对 60% 时，每组 $N=50$ 只有约 59% 的 probability 得到显著结果（statistical power），$N=80$ 约 79%，$N=100$ 约 88%。也就是说，要比较两个差 20 个百分点的 policy，每个大约要跑 80 次以上。这是为这一页算的；ps5 没有算 power。

:::wrong 我们的 policy 成功 8/10，baseline 6/10，所以我们的更好
按上面的计算，Fisher exact test 的 p = 0.628：如果两个 policy 其实一样好，得到至少这么大差距的 probability超过一半。两个 interval（49% 到 94%、31% 到 83%）大部分重叠。要说“更好”，要么每个跑到 80 次以上，要么报告 interval 并说明差距不显著。ps6 的 appendix 对 RL 训练给了同一个原则的另一个版本：bootstrap 的单位是整个 training run（seed），不是单个 episode，learning curve 的 band 是 pointwise 的。
:::

:::back
Behavior cloning、DAgger、multimodal demonstration、diffusion policy 与 flow matching、action chunking 与 pause 见 [RB4301 第 5 到 7 站](../courses/RB4301.html#bc)；flow matching 的数学见 [MIT 6.S184](../courses/MIT-6.S184.html)；rotation 的各种表示见 [RB2202 第 1 站](../courses/RB2202.html#rot)。
:::

:::from
Velocity label 的 100 与 200 mm/s、velocity 与 position 的表、bump 之后的 4 mm 与 2、1、0.5 mm、relative 与 absolute 的场景与 201.5 mm 对 1.5 mm、J/U/C 的分类、Gram–Schmidt 的写法与例子、两个 waypoint 的 averaging 与“独立 sample 成功率 1/2”、80% 对 60% 的 z 值和两种 p-value、expected count 的检查、“不显著不等于相同”，来自 [ps5](https://github.com/tlpmit/6.4210-2-fall26-handouts) Problem 3、5、6、10、11；bootstrap 的单位来自 [ps6](https://manipulation.csail.mit.edu/Fall2026/ps6.pdf) 的 appendix。z-test 的推导、134 倍、Wilson interval、power 的计算是为这一页算的（scipy 核对过 ps5 的 p-value）；6D 表示的出处按 ps5 的 background reading 写，Zhou et al. 2019 的论文只核对了题目与出处，正文没有读。这次对照 ps5 的题目原文核对了每道题的设定（11.1 里 6D 表示是 $R$ 的第 2、3 个 column、11.2 用 $u$ 定 $r_2$）；各题的数值答案是按题目算的，解答没能再核对。教材里 imitation learning 的章节（visuomotor policies）目前是空的 draft，所以这一站没有教材原文可对照。
:::

## 作业

Fall 2026 有 ps1 到 ps7 七份 problem set。Handout 仓库里的 PDF 只有题目；课程网站 schedule 页把带解答的版本列在两次 midterm 的复习材料下面（ps1 到 ps4 在 Midterm I 下，ps5 到 ps7 在 Midterm II 下），旁边还有 midterm practice 和解答。自学时先用仓库里的题目版自己做，再对照。每份分 bookwork（Gradescope 上填的选择题和数，加一个不用交的 “Going further”）、computational（Python 和 Drake，交几个 checkpoint 数和一段视频）、6.4212 加做的题，最后是一节 “What you should understand about the code you just produced”。ps1 开头说得很清楚：作业的首要目的是教，不是考，真正的考核是 quiz 和 final project；用什么工具写代码都可以，但要始终参与其中、对结果保持批判，最后那一节列的就是“不管代码怎么写出来的，你都应该懂的东西”。Gradescope 的评分不对外。所有 problem set 都能在笔记本 CPU 或免费 Colab 上做，不需要 GPU；handout 都没有给出所需的人工时间，下面的时间是估计。下面提示里凡是写“解答摘要”的，是上一版从带解答的 PDF 的 WebFetch 摘要里记下的数，这次没能再核对。

**环境（handout 仓库 README）。** 两条路选一条。本地（推荐）：装 git、uv 和 Graphviz（系统程序，不是 Python 包：macOS 用 `brew install graphviz`，Ubuntu/WSL 用 `sudo apt install graphviz`）；clone 仓库后 `uv python install 3.13`、`uv venv --python 3.13`、`uv pip install drake`。Drake 没有原生 Windows 版，要先装 WSL。Colab：从 GitHub 打开 `ps1/ps1_colab.ipynb`，前两个 cell 把代码拉到 `MyDrive/6.4210/repo`，之后只在 Drive 里的副本上工作，每次会话先跑 setup cell。

- **不要 fork 公开的 handout 仓库**：fork 不能设为 private，会把 solution 公开；要备份就新建一个空的 private 仓库，把 handout 仓库设成 `upstream`。（来源：README。）
- **路径里有空格或特殊字符（包括 apostrophe、括号、`&`）时 Drake 下载 model 会失败，报 `returncode == 512`**：Drake 新版本运行 venv 里的 helper script 时不给路径加引号。把 venv 建在 home 下：`uv venv --python 3.13 ~/venv64210`，README 给了往这个 venv 里一次装齐后面各份 problem set 依赖的命令。（来源：README。）
- **Colab 上改了 `.py` 文件要先运行 `colab_bootstrap.refresh()` 再重跑 cell**，否则 import 的还是旧代码；Colab 的 terminal 收费，git 用 `!` cell，`%cd` 能在会话内保持，`!cd` 不能。（来源：README。）
- **查 API 先看 Drake 的 C++ 文档**：Python 文档大多从 C++ 自动生成，C++ 的写得更仔细。用 `plot_system_graphviz` 画 block diagram，每个 subsystem 一个框、列出 input 和 output port，排查连线。（来源：ps1 Problem 7。）
- 新 problem set 发布时，先 commit 自己的修改再 `git pull upstream main`。ps4 和 ps6 各要求先更新环境（ps4 要 `"manipulation[letter]" scipy rtree`，ps6 要 `torch gymnasium pandas ipykernel`）。（来源：README、ps4、ps6。）

### ps1：State、discrete-time system 与 Drake 入门（第一次用 Drake 就做）

**要做什么。** 教材第 1、2 章是指定阅读。Bookwork：数 state 的维数（plane 上的 pendulum、3D 的 free body、会耗电也能充电的 mobile robot），数 configuration 与 actuation 的维数（differential-drive、iiwa、四个固定 propeller 的 drone；going further 是蛇和铰接公交车），manipulation 与 driving 的根本区别（“通过有选择的 contact 改变环境”），四类系统设计思路，joint 的类型（iiwa、抽屉、parallel-jaw gripper、桌上的方块），Drake 的组成。Computational 分三块。Problem 7：用一个只有 next-state function $s_{t+1}=f(s_t,i_t)$ 和 output function $o_t=g(s_t,i_t)$ 的 `DTVectorSystem` 接口，写 1D free body（forward Euler $s_{t+1}=s_t+\Delta t\,\dot s_t$，input 是 force、output 是 position）、series composition、P controller 和 feedback composition。Problem 8：一个两个 prismatic joint 的 2D Cartesian “finger”，先给 constant input 看 velocity 为什么 plateau，再写 `Observer`（从 $[x,y,\dot x,\dot y]$ 里挑出 position）接上 controller，最后写一个带 state 的 waypoint follower 走正方形。Problem 9：iiwa 在 zero torque、constant torque（20 N·m）、P（gain 100）、PD（100 与 30）下的行为，最后用 PD（10000 与 3000）加 waypoint follower 让 end-effector 在竖直 plane 里画一个 0.4 m 的正方形并交视频。6.4212 另做 plant time step 与 controller period 的影响、PD damping 与 overshoot、settling time 的关系，每题交一页带 plot 的 PDF。

**做完会什么。** Drake 的 `Diagram`、`System`、port 与 `Context`，后面每一份 problem set 都建立在这上面；在 iiwa 上亲眼看到 zero torque、P、PD 各是什么样子，第 6 站的 gravity compensation 和 stiffness control 就有了参照。

**时间与算力。** 估计 6 到 10 小时，大半花在环境和 Drake 的写法上（估计）。笔记本 CPU。

**提示。**
- `simulate` 的参数是秒，不是步数：$\Delta t=0.1$ s 时 5 步是 $T=0.5$。（来源：ps1 7.2。）
- 8.3 要把 `JOINT_DAMPING` 从 10 改成 20，它是在载入时写进 SDF 文本的，所以要改 `cartesian_2d_robot.py` 再重跑，光改变量不生效。（来源：ps1 8.3。）
- iiwa 的 Drake state 是 14 维（7 个 position 加 7 个 velocity），P controller 只要 7 维 position，用 8.2 写的 `Observer` 去挑。（来源：ps1 9.3。）
- 给的 PD controller 用相邻两次 position 测量的差分估计 velocity，所以它的 `dt` 参数是 controller 自己的运行周期，要传一个和 simulation 相符的值，不要用默认值。（来源：ps1 9.4。）
- 最后一节要求能解释：为什么 $\Delta t$ 进入 physics simulation 和 PD controller 的数学，却不进入 P controller（它没有 state）；waypoint follower 的 $\Delta t$ 只决定多久检查一次是否到达；SDF 里声明 inertia 和 joint damping 各起什么作用；epsilon 怎样和 controller gain 一起改变走出来的 path。（来源：ps1 第 3 节。）
- 视频是 mp4，远小于 500 MB。（来源：ps1 9.5。）

### ps2：Rotation、transform、FK/IK、Jacobian 与 pick and place（先做）

**要从零写什么。** Bookwork 是 roll-pitch-yaw 与 quaternion 的组合与 inverse、gimbal lock、五种“取两个 rotation 的中点”的办法在 Y1 到 Y4、P1 到 P5 这些例子上的对错、第 1 站那三个 frame 的换算（另有一个 frame $A=(1,2,\pi/6)$）、gripper 与物体的相对位置、按 URDF 的写法描述 planar arm 的 transform chain、Jacobian 的形状与 rank、singularity、null space。Computational：planar 2R（两根 link 各 1 m）的 FK、解析 IK、translational Jacobian；overhead grasp 的 transform 与 `target_conf_to_pick`；`JointVelocity` system 用 pseudoinverse 做 differential IK，`PiecewisePose.MakeLinear` 生成 gripper trajectory、`MakeDerivative` 得 velocity、finger 用 `PiecewisePolynomial.ZeroOrderHold`，接上 `Integrator` 和 iiwa；最后规划叠三个方块（第二块对齐放在第一块上，第三块竖起来立在中间）并交一段视频。6.4212 另做“全程按指定 speed 走、把 rotation 也算进去”的时间分配、走正方形时 speed 的形状，以及 robot painter。

**做完会什么。** 第 1 站全部、第 2 站的 pseudoinverse 部分，以及在 Drake 里把 trajectory、controller、integrator、iiwa 连成一个 diagram。

**时间与算力。** 估计 8 到 12 小时（估计）。笔记本 CPU。

**提示。**
- 先用手算对一遍 planar arm：$q=(0.3,0.2)$ 时 tip 在 $(\cos0.3+\cos0.5,\;\sin0.3+\sin0.5)=(1.8329,0.7749)$；$(-1,-0.5)$ 的两组 IK 解是 $(-3.66,1.96)$ 与 $(-1.70,-1.96)$（代回 FK 都得 $(-0.99,-0.49)$，四舍五入的误差）；$\det J=(-s_0-s_{0+1})c_{0+1}+s_{0+1}(c_0+c_{0+1})=\sin q_1$，所以 singularity 正是 $q_1=0$ 或 $\pi$。（来源：ps2 Problem 11 到 13 的题目，数是我按题目算的。）
- `JointVelocity` 用 local plant 的 geometric Jacobian，只保留 arm 对应的 column（`arm_columns`）；它没有 state，但要把 $q$ 作为 input，因为 Jacobian 依赖 $q$。（来源：ps2 Problem 15 与最后一节。）
- Drake 的 `Integrator` 不能直接给初值，handout 的代码里有 workaround，照着用；最后一节专门问了“漏掉 integrator 或不给它起点会怎样”。（来源：ps2。）
- `test3("blue")` 应在 8.0 s 结束，最终 iiwa configuration 是 $(-0.14,1.14,0.29,-1.00,-0.31,1.04,-1.43)$ rad，先对上这个数再做叠方块。（来源：解答摘要。）
- Handout 的代码默认每两个 waypoint 之间 4 s，它要求放足够多的 waypoint，让任何顺序的方块都叠得可靠，并建议抓和放的前后都经过 pregrasp；`plan("red","blue","yellow")` 返回 16 个 waypoint（每个 pick 和 place 各 4 个）是解答摘要里的数。用 0.5 s 一个 waypoint 再试一次，会看到计划不再可靠，原因见第 1 站。视频里至少一个方块要换一个 orientation。（来源：ps2 Problem 16。）
- 课程用 extrinsic XYZ 的 roll-pitch-yaw（URDF 也用这个）；2D 的 $(x,y,\theta)$ 先写 translation，但当作 operation 读时先作用的是 rotation。附录 A 把 monogram notation 的规则整理成了一页。（来源：ps2 Problem 1、4 与附录 A。）
- Gradescope 上 9.2 原本把 A、C 都算对，C 其实是错的，只有 A 对。（来源：解答摘要里的勘误。）

### ps3：QP、differential IK as optimization、IK 与 RRT（先做）

**要从零写什么。** Bookwork 是第 2 站和第 5 站的大部分例子：damped pseudoinverse、clip 与 QP、joint centering、joint limit 的 lookahead、C-space 与 completeness、grid 的规模（$100^7=10^{14}$ 个 cell，每个 1 bit 也要 12.5 TB）。Computational：用 `MathematicalProgram` 解一个小 QP（每个 $|x_i|\le0.35$；解答摘要里的答案是 $(0.1534,-0.1005,0.3492)$，cost 0.5450）；`DiffIKQP` 加 velocity limit（解答摘要：test5 的 fixed data 应得 $(3.0000,1.3128)$ 等，最大 3.0000 rad/s，不加 limit 时 5.7852）和 `DiffIKQP_Wall`；开门的 keyframe IK；PR2 的 IK 与 random restart；RRT 与 RRT-Connect，交一段 playback 视频。6.4212 另做 exact edge checking（第 5 站的定理与 bisection）。

**做完会什么。** 第 2 站与第 5 站的前半；之后看到任何“QP-based controller”“IK with constraints”都知道底下是什么。

**时间与算力。** 估计 10 到 15 小时（估计）。笔记本 CPU；Meshcat 在浏览器里看。（Bookwork 的 Problem 10 让你判断“最好的实现里 7-DOF 的 probabilistically complete planning 通常不到 1 ms”与“通常要几十秒”哪个对。）

**提示。**
- 绝对值 constraint 拆成两条 linear constraint，或者直接用 `AddBoundingBoxConstraint`。（来源：ps3 Problem 12。）
- Virtual wall 的 prediction horizon $h=0.004$ s 和 controller 的 sampling period 是两回事；constraint 只管 gripper origin。test6 要填 hand 的 $x$ velocity 和 first-order 预测的下一个 $x$，精度 0.0001；解答摘要里 hand 已经在 wall 外，应解出 $\mathrm v_x=-0.0885$ m/s。Constraint 只管 gripper origin，所以 gripper 的一部分伸出 box 是允许的，handout 让你想想为什么。（来源：ps3 Problem 13。）
- 开门题的 tolerance：位置每轴 1 mm，orientation $0.01\pi$ rad，只在 keyframe 上要求；第一个 keyframe 用 `Q_NOMINAL` 作初值，之后用上一个的 solution。`add_pose_constraint` 要写成通用的，PR2 那题会 import 它。（来源：ps3 Problem 14。）
- PR2 题的 tolerance 是 1 mm 与 1°，加 1 cm 的 minimum distance constraint；不要改 `IK_SEED`，random restart 有一部分失败是正常的，不一定是 bug。（来源：ps3 Problem 15。）
- RRT 的 path 播放出来会绕来绕去（handout 叫它 “RRT Dance”），而且偶尔失败，不用慌；调 `max_iterations` 和 `prob_sample_q_goal` 试试。Playback 里出现大的 contact force 或碰倒东西，不算成功执行，要检查 path 并重新规划；`CHECK_STEP` 的复查通过也不证明连续的 path 没有 collision。比较 RRT 与 RRT-Connect 用时间而不是 iteration 数。动手前先读 handout 标出的给学生读的那部分代码（`RRT_tools`、`PlanningProblem`）。视频上限 500 MB。（来源：ps3 Problem 16。）

### ps4：Contact、force closure、normal estimation 与 antipodal grasping（值得做）

**要从零写什么。** Bookwork 是 contact model、planar wrench、斜面上的 box（$\mu\ge\tan\gamma$）、两根 point finger 夹住一个边长 0.2 m、重 1 N 的方块（$\mu=1/2$，cone 的半角 $\arctan0.5=26.57°$，整个 cone 张开 53.13°）、force closure 不只是“托住 gravity”、3D antipodal 与 soft finger、non-convex 物体上的 antipodal 点、grasp quality score 该量什么、RRT shortcutting。Computational：从 mustard bottle 的 depth image 用 PCA 估 normal（`normal_patches`）；在自己姓名首字母的 letter mesh 上做 antipodal sampling、过滤、规划 pick-turn-place 并交视频。6.4212 另在一个 gear 的边界上用 `MathematicalProgram` 找 antipodal 点对并用 Hessian 分类。

**做完会什么。** 第 4 站全部：normal 的估计与方向、ray casting、friction cone 的过滤、grasp frame 的构造。

**时间与算力。** 估计 8 到 12 小时（估计）。笔记本 CPU。本地要另装 `uv pip install "manipulation[letter]" scipy rtree`，Colab 的 `setup()` 会装。

**提示。**
- Normal 用 `np.linalg.eigh`（symmetric matrix，eigenvalue 升序）；在 camera frame 里把它翻到 $n\cdot\bar p\le0$；eigenvector 拼成的 matrix 不一定是 proper rotation，要自己构造 right-handed frame，normal 作 $+z$、原点在 centroid。合成数据的 `test2()` 应得 translation $(0.1,-0.2,1.3)$ m、$+z=(0,0,-1)$。（来源：ps4 Problem 10。）
- 点少于 3 个或第二小的 eigenvalue $\le10^{-12}$ m² 的 patch 跳过；默认 `UV_STEP = 10`、`WINDOW_HALF_WIDTH = 3`。（来源：ps4 Problem 10。）
- Ray 的起点往物体里挪一点，避免打中起点所在的面；intersection 没有顺序，取最近的正向交点。默认 $\mu=1.17$。（来源：ps4 Problem 11。）
- `check_collision_free` 只检查 gripper body box 的几个角，不查 finger、arm、mesh 间隙和 approach path，所以视频里看到的穿模不一定是你的 bug，也不能指望它挡住所有坏 grasp。（来源：ps4 Problem 11。）
- 转 30° 是绕 $G_y$、绕 pinch 点转，pinch 点不能平移；`test4()` 应得 pinch 位移 0、world yaw 变化 $-30°$。`test3()` 应得 grasp 宽 0.0200 m、moment arm 0.0500 m。（来源：ps4 Problem 11。）

### ps5：Behavior cloning 与 Diffusion Policy on Push-T（先做）

**要做什么。** 11 道 bookwork（6.4212 有 12 道），覆盖第 7 站的全部内容和 [RB4301](../courses/RB4301.html#bc) 的大部分：discrete 与 continuous action（linear policy $k=10/29$，diffusion sampler 从 0.2 走到 0.66、1.00）、pause 与 chunking（$(3/4)^{10}\approx0.056$，history 至少 $P+1$ 步）、averaging、DAgger 的一个四状态例子、velocity 与 position、frame、跨 embodiment 的 importance weight、何时请求更多 demonstration（ensemble 的 disagreement 加 distance 两个触发条件）、两个点之间的 flow matching（$t=1/2$ 时 $v(x)=8-2x-4f(x)$）、评估所需的 sample size、rotation 表示（括号里的数来自解答摘要）。6.4212 加做的 Problem 12 是 diffusion 的加噪与学习去噪。计算题在一个预训练的 Diffusion Policy 上看 Push-T 的 action distribution。背景阅读是 DAgger 的原论文（Ross、Gordon、Bagnell）和 Zhou 等人关于 rotation 表示 continuity 的论文；Problem 9 改编自 6.7900 Fall 2024 的一道期末题。

**做完会什么。** 读 VLA 和 diffusion policy 论文时的一整套工程词汇，以及每个选择背后的一个可以手算的反例。

**时间与算力。** 估计 6 到 8 小时，以读题和推导为主（估计）。Notebook 会下载预训练的 policy，handout 说本地不需要 GPU。

**提示。**
- 计算题用 `diffusion_policy_pusht_state.ipynb`，它自带 Push-T 环境和 diffusion policy，会下载预训练的 policy，setup cell 按顺序跑；helper 的实现藏在一个折叠起来的 setup cell 里。先把 notebook 一步步走一遍再动手。（来源：ps5 Problem 13。）
- 要比较的几组初始条件（pusher 相对 T 的位置，单位 pixel）：$(0,-100)$ 对 $(100,-100)$、$(100,50)$ 对 $(50,50)$、$(0,-100)$ 对 $(0,-300)$，以及 $(0,-100)$ 时把初始 velocity 设成 $(100,0)$ 和 $(-100,0)$；然后把 T 沿 $+x$ 挪 100 pixel 再做一遍。每组都要判断 action distribution 是 uni-modal 还是 bi-modal、动作合不合理。解答摘要里的现象：pusher 在 T 的正下方 $(0,-100)$ 时是 bi-modal 的（T 横梁两端对称），初始 velocity 会选中 pusher 已经在走的那个 mode；`show_action_samples` 默认 32 个 sample、seed 0。（来源：ps5 Problem 13 的题目；现象与默认值来自解答摘要。先自己做再看。）
- Problem 10 要求所有数保留三位有效数字；ps5 开头说 log 一律是自然对数。（来源：ps5。）
- 题目和解答分开：仓库里的 PDF 只有题目，带解答的版本在 schedule 页。（来源：经验。）

### ps6：Representation、REINFORCE 与 residual PPO（值得做）

**要做什么。** Bookwork：一个 non-Markov observation 让 tabular Q-learning 学出错的 policy；reward 全为正时 REINFORCE 的 update 为什么仍有正有负（加 100 不改变期望、只增大 variance）；Gaussian policy 的 score function；PPO clipping 为什么挡不住第一大步；policy 什么时候必须是随机的。Computational：在 Drake 的 cart-pole 上补全 `reward_to_go` 和 `policy_loss`，用 bootstrap 和 paired t-test 分析 30 对训练结果；在推方块任务上补全 BC loss、GAE、PPO 的 actor 与 critic loss，在一个保守的 BC policy 上学一个 scalar residual（push 的距离），分析提供好的长 run 数据。

**做完会什么。** Policy gradient 与 PPO 的每一个 loss 亲手写一遍；“residual RL on top of BC”这个真机上常用的套路走一遍；用 seed 而不是 episode 做 bootstrap。原理见 [Berkeley CS285](../courses/BERKELEY-CS285.html#pg) 与 [现代强化学习实践](../courses/MODERN-RL.html#ppo)。

**时间与算力。** Handout 说 cart-pole 的部分在笔记本 CPU 或 Colab 上不到 1 小时；8192 次 push 的 PPO run 每个约 3 小时，结果已经提供，不用重跑。人工时间估计 8 到 10 小时（估计）。老的 venv 要补 `uv pip install torch gymnasium pandas ipykernel`。

**提示。**
- Loss 里一律用 torch 的操作（`torch.exp`、`torch.minimum`、`torch.clamp`），换成 NumPy 或 Python float 会让 gradient 断掉；`reward_to_go` 和 `gae_advantages` 用普通的 NumPy。（来源：ps6。）
- `policy_loss` 对所有 $N$ 个 transition 求和，但除以 episode 数 $B$，不是 $N$；手算的检查值是 $-0.2$（$B=2$）。Return 和 baseline 在求导时当常数。（来源：ps6 Problem 6。）
- 32 个 command 的 cutoff 是 truncation，不是 terminal：保留 $V(s_T)$ 做 bootstrap，只有成功或真正的失败才把下一个 value 设成 0。手算例子（rewards $(0,1)$、old values $(0.2,0.4)$）：terminal 时 $\delta_1=1+0-0.4=0.6$、$\mathrm{adv}_0=0.2+0.95\times0.6=0.77$；改成 cutoff、最后的 old value 0.5 时 $\delta_1=1+0.5-0.4=1.1$、$\mathrm{adv}_0=0.2+0.95\times1.1=1.245$，$\hat G_0=0+1+0.5=1.5$。（来源：ps6 Problem 7.4 的题目，数是我算的。）
- `critic_loss` 里不要乘那个 1/4，update 的代码会加；GAE 的 advantage 不要自己再 rescale，batch 的代码会减均值除标准差，critic 的 target $\hat G_t$ 则不 rescale。（来源：ps6 Problem 7.4、7.5。）
- BC 的 train/validation 按整条 demonstration 分，相邻 transition 几乎重复，按 transition 分会泄漏。（来源：ps6 Problem 7.3。）
- 不要 Run All：训练、fit 和 Meshcat 回放的 cell 一运行就开跑。改代码不生效时重启 kernel 再跑 setup cell；cache 只有在代码、设置、数据都一致时才复用，要重跑用 `retrain=True`。（来源：ps6。）
- 先补完 Python 文件再跑 notebook 的 check cell，check cell 用的数和手算题不同。（来源：ps6。）

### ps7：Manipulator control 与 learned model（值得做）

**要做什么。** 指定阅读是教材第 8 章和第 11 章 RL 的 model-based 部分。Bookwork：MPPI 式的 cost-weighted 更新（三个候选 $U=(0,0),(1,1),(2,0)$，$\lambda\to0^+$ 与 $\lambda\to\infty$ 的极限，执行第一步后按观测重新规划）；point mass 上的 position 加 feedforward force（free space 与贴墙）；翻起 box 时 finger 与 pivot 都不滑的条件；feedback 与 feedforward 的选择（velocity-controlled 与 torque-controlled joint、direct force control 与 stiffness control、$\tau=J^\top f$ 与 operational space control）。这几道是第 6 站的例子。Computational：Problem 5 先推拖书的 friction 条件，再在 planar iiwa 上写 hybrid force-position 的 `compute_ctrl`；Problem 6 在 ps6 的推方块任务上，从同样 886 条 demonstration transition 拟合一个“push 了多远”的 linear correction 和一个 neural transition model，用 MPPI（看两步、枚举 $4^2=16$ 种 face 序列、优化连续的 push 距离）规划，和 ps6 的 BC、residual PPO 比 reward 与执行时间。6.4212 另做 Part 6.6：十个不同 seed 拟合的 model 各驱动 MPPI 跑同样 64 个 goal，看结论有多依赖一次训练。

**做完会什么。** 第 6 站的 hybrid control 写成能在 iiwa 上跑的代码；“学一个 model 再在线规划”和“直接学 policy”的代价对比：handout 给的数是 neural model 拟合 1.16 s、MPPI 每个 command 约 2.37 ms 的规划，PPO 每个 run 收集 8192 到 8202 个新 command、用 2.65 到 2.94 小时（十个 run 共 28.19 小时）。

**时间与算力。** Handout 说 Problem 6 拟合两个 model 再在 4 个 goal 上跑两种 controller 共约 3 到 5 分钟，64 个 goal 的比较和十个 replication 都已提供、不用重跑；笔记本 CPU。人工时间估计 6 到 8 小时（估计）。

**提示。**
- Problem 2 的符号：$f_c$ 与 $f_d$ 都是作用在 robot 上的 force，正方向 $+x$；$-f_d$ 那一项让 robot 往 $-x$ 推，那一侧的 surface 推回来时 $f_c>0$。第 6 站把 free space 与贴墙两种情形都算了一遍。（来源：ps7 Problem 2。）
- `compute_ctrl` 只返回额外的 wrench，gravity compensation 由 station 加；$z$ 没有 position feedback，world $z$ 朝上，所以向下压的 force 是 $-F_d$。可以只用 Python：`python ps7/hybrid_force_demo.py --verify --simulate`。验收：书的中心最后在 0.35 到 0.55 m 之间，fingertip 不低于 0.035 m。（来源：ps7 Problem 5 与 `hybrid_force_control.py`。）
- Problem 6 所有数保留三位小数，p-value 三位有效数字；自己机器上的 timing 和四个 goal 的表不对固定答案检查。有几问规定用提供的 `data/cautious_model_based/dynamics.pt` 而不是你自己拟合的 model，这样大家报的数一样。（来源：ps7 Problem 6。）
- `dynamics_loss` 是网络输出和 $(y_i-\mu)/s$ 的 MSE，网络输出已经在 normalized coordinate 里，不要再 normalize 一次。题目给的手算检查：$f_\theta$ 全是 0、两个样本 $y=(2,8)$ 与 $(6,12)$、$\mu=(2,4)$、$s=(2,4)$，normalized target 是 $(0,1)$ 与 $(2,2)$，四个数的平方平均 $(0+1+4+4)/4=2.25$。（来源：ps7 6.2；数是我按题目算的。）
- MPPI 的权重先减掉 $S_{min}$ 再取 exp：normalized 的权重不变，最大的那个 exp 等于 1，分母不会 underflow 成 0。题目的检查：$S=(0,\ln3)$、$\lambda=1$ 时权重是 $e^0:e^{-\ln3}=1:\tfrac13$，即 $(0.75,0.25)$，nominal 更新为 $0.75(0.2,-0.4)+0.25(-0.6,0.8)=(0,-0.1)$。Face 是离散的，单独枚举，不要对 face 的编号取平均。（来源：ps7 6.4；数是我按题目算的。）
- 比较 MPPI 与 PPO 时要记住两者用的数据不一样多（PPO 多收集了在线经验），64 个 goal 的评估用的是同一个拟合的 model，不是 64 个独立训练的 model；Part 6.6 的 bootstrap 单位是整个 fit，不是 640 个 episode。（来源：ps7 6.5、6.6。）

### Project

6.4210 的成绩里 project 占一半（proposal、report、video）。Fall 2026 的 project 页面（schedule 页的导航里有 project.html）这次请求访问没有得到批准，没有读到。教材附录 E 有一节 “Some great final projects”，可以从那里找方向。
