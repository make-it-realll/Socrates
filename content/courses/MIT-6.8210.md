---
code: MIT-6.8210
evidence: syllabus
evidenceNote: "前沿公开课，不是 NUS 课。期次：MIT 6.8210 Spring 2024（Russ Tedrake），这是课程站上最新的一期。讲法以 Tedrake 的在线教材 Underactuated Robotics 为准：把教材的 GitHub 仓库 git clone 下来，第 1 章的 Definitions 一节、第 2、3、8 章、第 4 章的 rimless wheel 部分、第 9 章前半（到 S-procedure 与 ROA）、第 10 章的 transcription、collocation、trajectory feedback、iLQR 与 exercises、第 11 章、第 20 章前半读的是 HTML 原文全文；其余章节没有读。作业部分读了 Spring 2024 的 Assignment 1、2、3、4、5、8、9、10 页面（WebFetch 摘要），set 6、7 的页面没有找到；另读了仓库里五个 exercise notebook 的说明文字。Spring 2024 的录像没有看。"
exam: "无期末考试。Spring 2024 按课程主页：assignments 35%、midterm 25%、final project 35%、出勤与参与 5%；或者 assignments 35%、midterm 30%、final project 35%，两种算法取高的那个。Gradescope 评分不对外，自学时以教材章末 exercises 为主。"
subskills:
  - id: pend
    name: Pendulum：phase portrait、stability 与 underactuation
    l3: "能对一维 system 画 ẋ 对 x 的图，找出 fixed point 并判断 stable 还是 unstable。"
    l4: "能用 energy 画出 undamped pendulum 的 phase portrait，说出 homoclinic orbit 的 energy，并用 rank 判断一个 manipulator equation 是不是 underactuated。"
    l5: "能用数字说明为什么 torque 上限 2 N·m 让一个本来 fully actuated 的 pendulum 变成 underactuated，以及 attractive 和 stable i.s.L. 的区别。"
  - id: swing
    name: Energy shaping 与 partial feedback linearization：swing-up
    l3: "能推出 pendulum 的 $\\dot E=u\\dot\\theta$，并写出 energy shaping controller。"
    l4: "能推出 cart-pole 的 collocated PFL，把 pole 化成一个 input 被 $\\cos\\theta$ 调制的 pendulum，再在上面做 energy shaping。"
    l5: "能解释 energy shaping 为什么只能让 upright attractive，必须在某个 region 里切换到 LQR，以及这个 controller 为什么对 mass 的误差完全不敏感。"
  - id: lqr
    name: Linearization、controllability 与 LQR balancing
    l3: "能按 manipulator equation 的公式写出 fixed point 处的 $A_{lin}$、$B_{lin}$。"
    l4: "能对一个具体的 cart-pole 算出 linearization、判断 controllability、从 HJB 推出 Riccati equation，并写出 discrete-time 的 Riccati recursion。"
    l5: "能用数字说明 underactuated 的 system 为什么仍然 controllable，以及 LQR 的 gain 为什么只在 upright 附近可信。"
  - id: trajopt
    name: Trajectory optimization：transcription、shooting、collocation 与 iLQR
    l3: "能写出 direct transcription 和 direct shooting 的 decision variable 与 constraint。"
    l4: "能推出 direct collocation 在 midpoint 上的 constraint，并实现 iLQR 的 backward pass 与 forward pass。"
    l5: "能用 condition number 解释 shooting 在 unstable system 上为什么丢精度，并说明为什么 optimize 出来的 trajectory 必须配一个 TVLQR 才能在真机上走。"
  - id: lyap
    name: Lyapunov function 与 region of attraction
    l3: "能用 energy 证明 damped pendulum 的最低点 asymptotically stable（用 LaSalle）。"
    l4: "能用 sublevel set 给出一个 region of attraction 的 inner estimate，并用 LQR 的 $S$ 当 Lyapunov candidate。"
    l5: "能写出 S-procedure 的 SOS 条件，说明为什么 $\\rho$ 只能 line search，以及 $\\dot V<0$ 的点为什么不一定回得来。"
  - id: walk
    name: Walking：hybrid dynamics、Poincaré map 与 rimless wheel
    l3: "能写出 rimless wheel 的 stance dynamics 和 impact 时的 velocity 变化。"
    l4: "能推出 rimless wheel 的 return map、fixed point 和 fixed point 处的 slope。"
    l5: "能说明 walking 的 stability 为什么要用 limit cycle 来谈，以及 collision 的 energy loss 为什么正是 stability 的来源。"
  - id: policy
    name: Policy search：把 controller 的参数直接拿来 optimize
    l3: "能写出 LQR 的 expected cost 作为 $K$ 的 function，并用 Lyapunov equation 算一次。"
    l4: "能用一个 3 维的例子说明 stabilizing $K$ 的 set 不 convex，并写出 weight perturbation 的 update 与它的 expectation。"
    l5: "能解释 LQR 的 objective nonconvex 却没有 bad local minimum 是怎么回事，并说明 REINFORCE 和 weight perturbation 的关系。"
open:
  - label: "MIT 6.8210 Spring 2024 课程主页"
    url: "https://underactuated.csail.mit.edu/Spring2024/index.html"
    note: "评分方式与先修。Schedule 页里没有讲次表。"
  - label: "Underactuated Robotics 教材 GitHub 仓库（RussTedrake/underactuated）"
    url: "https://github.com/RussTedrake/underactuated"
    note: "git clone 后读了 book/ 下各章 HTML 的原文；exercise notebook 也在这个仓库里。"
  - label: "Underactuated Robotics 第 1 章 Fully-actuated vs Underactuated Systems（Definitions、Feedback Equivalence、Input and State Constraints）"
    url: "https://underactuated.mit.edu/intro.html"
    note: "第 1 站 underactuation 的定义与 feedback equivalence。"
  - label: "Underactuated Robotics 第 2 章 The Simple Pendulum"
    url: "https://underactuated.csail.mit.edu/pend.html"
    note: "第 1、2 站：graphical analysis、stability 的定义、phase portrait、energy shaping。"
  - label: "Underactuated Robotics 第 3 章 Acrobots, Cart-Poles, and Quadrotors"
    url: "https://underactuated.csail.mit.edu/acrobot.html"
    note: "第 2、3 站：cart-pole 的 equations of motion、linearization、controllability、PFL、cart-pole 的 energy shaping。"
  - label: "Underactuated Robotics 第 8 章 Linear Quadratic Regulators"
    url: "https://underactuated.csail.mit.edu/lqr.html"
    note: "第 3 站：HJB 推导、finite-horizon 与 time-varying LQR、discrete-time Riccati equation。"
  - label: "Underactuated Robotics 第 9 章 Lyapunov Analysis（读到 region of attraction 的 SOS 形式）"
    url: "https://underactuated.csail.mit.edu/lyapunov.html"
    note: "第 5 站。"
  - label: "Underactuated Robotics 第 10 章 Trajectory Optimization"
    url: "https://underactuated.csail.mit.edu/trajopt.html"
    note: "第 4 站：transcription 与 shooting 的比较、direct collocation、trajectory feedback、iLQR；作业一节的第 10 章 exercises。"
  - label: "Underactuated Robotics 第 4 章 Simple Models of Walking and Running（读到 rimless wheel）"
    url: "https://underactuated.csail.mit.edu/simple_legs.html"
    note: "第 6 站。Compass gait 与 SLIP 只看了标题。"
  - label: "Underactuated Robotics 第 11 章 Policy Search 与第 20 章 Model-Free Policy Search（前半）"
    url: "https://underactuated.csail.mit.edu/policy_search.html"
    note: "第 7 站。第 20 章读到 REINFORCE 与 weight perturbation 的等价，signal-to-noise 一节没有读。"
  - label: "6.8210 Spring 2024 Assignment 1、2、3、4、5、8、9、10"
    url: "https://underactuated.csail.mit.edu/Spring2024/set_3.html"
    note: "作业一节：每份的题号、分值、notebook 文件名与提交说明（WebFetch 摘要）。其余几份是同目录下的 set_1.html 等。"
sources:
  - label: "Underactuated Robotics 附录 A：Drake（Colab 与本地安装）"
    url: "https://underactuated.csail.mit.edu/drake.html"
  - label: "Spring 2024 全部录像（YouTube playlist，未看）"
    url: "https://www.youtube.com/playlist?list=PLkx8KyIQkMfU5szP43GlE_S1QGSPQfL9s"
---

先看两次失败。两次用的都是课本上最常见的 controller。

**第一次。** 一根 pendulum，$m=1$ kg、$l=1$ m，要从正下方转到正上方。Motor 最多出 2 N·m。PD 往上拉：error 是 180°，torque 立刻顶满 2 N·m 不再下来，pendulum 抬到 11.8° 时 gravity 的 torque $mgl\sin\theta$ 已经和 motor 打平，惯性带它冲到 23.7°，又落回 0°，从此在 0° 到 23.7° 之间来回摆，永远到不了 180°。

::fig[m6821-limit] 一直用 2 N·m 往上拉，pendulum 最高只到 23.7°。浅色扇形是它能到达的范围；要到 upright，只能顺着摆动的方向一次次加 torque，把 energy 攒起来。

**第二次。** 一台 cart-pole，cart 0.5 kg，pole 0.2 kg、长 0.3 m，rail 两端在 ±0.5 m。在 upright 处 linearize，设计一个 LQR。Pole 从 20° 的倾斜放手，cart 最远跑到 0.37 m，pole 稳稳回到 upright。从 30° 放手，cart 要跑到 0.60 m，撞上 rail 的端点。把 rail 加长到无限，60° 还能救回来，cart 要跑将近 2 m；到 70°，pole 直接倒下。

::fig[m6821-cart] 左边是 cart-pole 本身，$f$ 是推 cart 的 force，$\bar\theta$ 是 pole 偏离 upright 的角度。右边是从 20°、30°、60°、70° 放手后 cart 的位置，两条虚线是 rail 的端点。

两件事的根源相同：机器人的 actuator 不能让它想怎么动就怎么动。第一次是 torque 不够，第二次是 pole 根本没有 motor，只能通过推 cart 间接影响它。这样的系统叫 underactuated，这门课研究的就是怎样在这种限制下仍然完成任务，办法是利用 dynamics 本身。

路线是这样的。先用 pendulum 学会读 phase portrait，看清 fixed point、stability 和 underactuation 是什么（第 1 站）。第一次失败的解法是 energy shaping，它也能推广到 cart-pole（第 2 站）。到了 upright 附近换成 LQR（第 3 站），第二次失败说明 LQR 只在局部可信。从一个初始状态出发找整条 trajectory，用 trajectory optimization（第 4 站）。LQR 到底在多大范围内可信、energy shaping 什么时候该切换到 LQR，由 Lyapunov function 回答（第 5 站）。Walking 是带 collision 的 hybrid system，它的 stability 要换一种问法（第 6 站）。最后把 controller 的参数直接拿来 optimize，接上 reinforcement learning（第 7 站）。

| 站 | 内容 | 教材章节 | Spring 2024 作业 |
|---|---|---|---|
| 1 | phase portrait、stability、underactuation 的定义 | 第 1、2 章 | Assignment 1 |
| 2 | energy shaping、PFL、swing-up | 第 2、3 章 | Assignment 5 的 Exercise 9.11 |
| 3 | linearization、controllability、LQR | 第 3、8 章 | Assignment 2、3 |
| 4 | transcription、shooting、collocation、iLQR | 第 10 章 | 第 10 章 exercises（set 6、7 页面没读到） |
| 5 | Lyapunov function、region of attraction | 第 9 章 | Assignment 4、5 |
| 6 | rimless wheel、Poincaré map | 第 4 章 | Assignment 8 |
| 7 | policy search、weight perturbation | 第 11、20 章 | 没有读到对应的作业 |

:::note 和站内其他页面的分工
LQR 的 continuous-time Riccati equation、double integrator 的手解 $K=(1,\sqrt3)$、Bryson's rule 在 [RB2203 第 4 站](../courses/RB2203.html#ss)；manipulator equation $M(q)\ddot q+C\dot q+g(q)=\tau$ 与 computed torque 在 [RB2203 第 6 站](../courses/RB2203.html#joint)；Lagrangian dynamics 的推导在 [RB2202](../courses/RB2202.html)；kinematic 的 trajectory optimization 与 IK as optimization 在 [MIT 6.4210 第 5 站](../courses/MIT-6.4210.html#plan)，CHOMP 在 [RB3302 第 4 站](../courses/RB3302.html#trajopt)；policy gradient 的 variance、actor-critic、PPO 在 [Berkeley CS285](../courses/BERKELEY-CS285.html)。这一页只在用到时指过去。
:::

## [pend] Pendulum：phase portrait、stability 与 underactuation

:::skip
快速路线必读（教材第 2 章，约 2 小时）。能对 $b\dot x=u_0-mgl\sin x$ 找出所有 fixed point 并判断 stability，能用 energy 画出 undamped pendulum 的 phase portrait，能用 rank 判断 underactuation，就可以去第 2 站。
:::

### 一个解不出来的 equation

Pendulum 的 equation of motion 是

$$ml^2\ddot\theta+b\dot\theta+mgl\sin\theta=u$$

$\theta$ 从正下方逆时针量，$b$ 是 damping，$u$ 是 motor 的 torque。给定 $\theta(0)$ 和 $\dot\theta(0)$，能不能写出 $\theta(t)$？连最简单的 $b=u=0$ 都要用 elliptic integral，写出来也看不出什么。对比 linear system $\dot q=aq$，solution $q(0)e^{at}$ 一眼就告诉你 $a<0$ 时衰减、$a>0$ 时发散。

我们真正关心的是 long-term behavior：最后停在哪，从哪些初始状态出发会停在那。这个问题不必解 equation，画图就能回答。

### 一维：看 $\dot x$ 的符号

先取 damping 非常大的情形（$b\sqrt{l/g}\gg ml^2$），$ml^2\ddot\theta$ 相对 $b\dot\theta$ 可以忽略，equation 变成 first-order。写成不带 wrap-around 的 $x$：

$$b\dot x=u_0-mgl\sin x$$

把右边对 $x$ 画出来。$\dot x>0$ 的地方 $x$ 往右走，$\dot x<0$ 的地方往左走，$\dot x=0$ 的点叫 fixed point，从那里出发就永远不动。

$u_0=0$ 时 fixed point 是 $x^*=k\pi$。看 $x^*=0$：右边一点 $\sin x>0$，$\dot x<0$，往回走；左边一点 $\dot x>0$，也往回走，所以它 stable。看 $x^*=\pi$：右边一点 $\sin x<0$，$\dot x>0$，继续往右；左边往左，所以它 unstable。判断只看 fixed point 处 curve 的 slope：slope 是 $-\frac{mgl}{b}\cos x^*$，$\cos x^*>0$ 时为负，stable。

::fig[m6821-flow] 上面是 $u_0=0$，下面是 $u_0=0.6\,mgl$。Curve 是 $\dot x$，箭头是 flow 的方向。

从 $(-\pi,\pi)$ 里任何一点出发，最后都到 0。这个 set 叫 $x^*=0$ 的 region of attraction（ROA）；两个 ROA 之间的边界叫 separatrix，这里就是那些 unstable 的点 $\pm\pi$。

加 constant torque $u_0=0.6\,mgl$。Fixed point 满足 $\sin x^*=0.6$，在 $(-\pi,\pi]$ 里是 $x^*=\arcsin0.6=36.9°$ 和 $180°-36.9°=143.1°$。前者 $\cos x^*=0.8>0$，stable；后者 $\cos x^*=-0.8$，unstable。$u_0$ 再加大，两点继续靠拢，$u_0=mgl$ 时在 90° 合并，$u_0>mgl$ 时 $\dot x$ 处处为正，fixed point 消失，pendulum 一直转下去。Fixed point 的个数随参数突然改变，叫 bifurcation，这一种叫 saddle-node bifurcation。

一维 system 只能单调地走向一个 fixed point 或者走向 $\pm\infty$，不可能 oscillate。

### Stability 的几种说法

上面说的“stable”要分几种，后面写 controller 时差别是实打实的。

- **Stable i.s.L.（in the sense of Lyapunov）**：对任意 $\epsilon>0$，存在 $\delta>0$，从离 $x^*$ 不到 $\delta$ 的地方出发，永远不离开 $x^*$ 的 $\epsilon$ 邻域。
- **Attractive**：从附近出发，$t\to\infty$ 时 $x(t)\to x^*$。
- **Asymptotically stable**：同时 stable i.s.L. 和 attractive。
- **Exponentially stable**：$\|x(t)-x^*\|<Ce^{-\alpha t}$。

$\dot x=0$ 的每一点都 stable i.s.L.，但不 attractive。Exponentially stable 在图上的判据：能找到一条过 fixed point、slope 为负的直线，把 curve 和横轴隔开。上图 $u_0=0$ 时在 $x^*=0$ 附近 $\dot x\approx-\frac{mgl}{b}x$，slope 为负，0 是 exponentially stable 的。

反过来，attractive 不保证 stable i.s.L.，一维里看不到这种例子，第 2 站会在 swing-up 里撞上它。

### 二维：phase portrait 与 energy

去掉 damping（$b=0$），system 真正是 second-order。令 $x_1=\theta$、$x_2=\dot\theta$，写成两个 first-order equation，在 $(\theta,\dot\theta)$ 平面上每一点画出 $(\dot x_1,\dot x_2)$，得到的 vector field 叫 phase portrait。

Trajectory 的形状不用 simulation 也能得到。Undamped pendulum 的 total energy

$$E=\tfrac12ml^2\dot\theta^2-mgl\cos\theta$$

是 conserved 的：对 $t$ 求导，$\dot E=ml^2\dot\theta\ddot\theta+mgl\sin\theta\,\dot\theta=\dot\theta\,(ml^2\ddot\theta+mgl\sin\theta)=0$。所以每条 trajectory 都落在一条 $E=E_0$ 的 level set 上：

$$\dot\theta=\pm\sqrt{\tfrac{2}{ml^2}\big(E_0+mgl\cos\theta\big)}$$

根号里要非负，所以 $E_0<mgl$ 时 $\theta$ 只能在 $\cos\theta\ge-E_0/(mgl)$ 的范围里来回摆，最远到 $\theta_{\max}=\arccos(-E_0/mgl)$；$E_0>mgl$ 时根号永远为正，pendulum 一直朝一个方向转。正好 $E_0=mgl$ 的那条把两类分开，它通向 upright 那个 unstable fixed point，叫 homoclinic orbit，也就是二维里的 separatrix。

拿 $m=l=1$、$g=9.81$ 试一个初始状态：正下方、$\dot\theta(0)=6.8$ rad/s。$E_0=\tfrac12\times6.8^2-9.81=23.12-9.81=13.31$，大于 $mgl=9.81$，没有 damping 时会一直转下去。加上 $b=0.25$，energy 不再守恒：

$$\dot E=\dot\theta\,(ml^2\ddot\theta+mgl\sin\theta)=\dot\theta\,(-b\dot\theta)=-b\dot\theta^2\le0$$

Energy 一路往下掉。第一圈它还够翻过顶，翻过之后 energy 已经低于 $mgl$，被困在 $2\pi$ 那个 stable fixed point 的 basin 里，绕着它越收越紧。

::fig[m6821-phase] 灰线是 undamped 时的 energy level set，黑线是 $E=mgl$ 的 separatrix。彩色点是 $b=0.25$ 时的真实 trajectory：越过一次 separatrix，最后收进 $\theta=2\pi$。实心点 stable，空心点 unstable。

加了 damping，最低点从 stable i.s.L. 变成 asymptotically stable：没有 damping 时它附近的 trajectory 是闭合的 orbit，不会收进去。

### Underactuated：动力学方程能不能被 $u$ 任意改写

机器人的 dynamics 大多是 control-affine 的：

$$\ddot q=f_1(q,\dot q,t)+f_2(q,\dot q,t)\,u$$

如果 $f_2$ full row rank，就有 right inverse，取

$$u=f_2^{-1}\big(u'-f_1\big)$$

代进去得到 $\ddot q=u'$：想要什么 acceleration 就给什么。这叫 feedback equivalence，system 叫 fully actuated。如果 $\operatorname{rank}f_2<\dim q$，就有某些方向的 acceleration 无论 $u$ 取什么都改不了，system 是 underactuated。

Manipulator equation $M(q)\ddot q+C(q,\dot q)\dot q=\tau_g(q)+Bu$ 里 $M$ 总是 positive definite、可逆，于是 $f_2=M^{-1}B$，fully actuated 当且仅当 $B$ full row rank。一根有 motor 的 pendulum $B=1$，fully actuated，$u=2mgl\sin\theta$ 就能把 gravity 整个反过来，upright 变成最低点。把 double pendulum 的 shoulder motor 拿掉，$B=\begin{pmatrix}0\\1\end{pmatrix}$，rank 1 小于 2，这是 Acrobot；cart-pole 只能推 cart，$B=\begin{pmatrix}1\\0\end{pmatrix}$，同样 underactuated。

Input constraint 也会造成 underactuation。$\ddot x=u$、$|u|\le1$ 时没有 $u$ 能给出 $\ddot x=2$。回到第一次失败：$|u|\le2$，而 $\theta=90°$ 时 gravity 的 torque 是 9.81 N·m，此时 $ml^2\ddot\theta=u-9.81\le-7.81$，不论 $u$ 取多少 pendulum 都在往下掉。$u=2mgl\sin\theta$ 需要 19.6 N·m，给不出来。这根 pendulum 在大部分 state 上 underactuated，只能顺着它自己的 dynamics 走。

:::wrong Underactuated 就是 motor 的数目少于 joint 的数目
Motor 少于 dof 只是 $\operatorname{rank}f_2<\dim q$ 最常见的原因。人有几百块肌肉，比 joint 多，可起跳之后不论肌肉怎么用力，center of mass 的 ballistic trajectory 都改不了，这时是 underactuated。反方向也成立：pendulum 有一个 motor、一个 joint，$B$ full rank，只因为 $|u|\le2$ 就在 $\theta=90°$ 附近怎么也举不住。同一台机器人还可能有两种说法：两个 motor 的 rigid two-link arm 是 fully actuated 的，把 link 的弹性也建进 model 多出几个 dof，它就成了 underactuated。Underactuated 是 model 和 constraint 合起来的性质，数 motor 判断不了。
:::

:::from
一维 flow 的画法、stability 的四种定义、“separating line 推出 exponential stability”、undamped orbit 的 closed form 与 homoclinic orbit、damping 让最低点变成 asymptotically stable，来自 [教材第 2 章](https://underactuated.csail.mit.edu/pend.html)。Underactuation 的定义、rank 条件、feedback equivalence、$|u|\le1$ 的例子、跳起来的人和带弹性 link 的例子，来自 [第 1 章的 Definitions 一节](https://underactuated.mit.edu/intro.html)。$u_0=0.6\,mgl$ 的数、$\dot\theta(0)=6.8$ 与 $b=0.25$ 的 trajectory、2 N·m 的 pendulum 停在 11.8° 和 23.7°，是为这一页算的。
:::

## [swing] Energy shaping 与 partial feedback linearization：swing-up

:::skip
快速路线必读（教材第 2 章末与第 3 章的 swing-up 一节，约 1.5 小时）。能推出 $\dot E=u\dot\theta$ 和 energy shaping 的 error dynamics，能推出 cart-pole 的 collocated PFL，能说清 energy shaping 为什么最后必须切换到 LQR，就可以去第 3 站。
:::

### Torque 怎样改变 energy

第一次失败里，2 N·m 举不起 pendulum，可每摆一下都能多给它一点 energy。精确地看 energy 怎样随 $u$ 变化（$b=0$）：

$$\dot E=ml^2\dot\theta\ddot\theta+mgl\sin\theta\,\dot\theta=\dot\theta\,(u-mgl\sin\theta)+\dot\theta\,mgl\sin\theta=u\dot\theta$$

只要 torque 和 $\dot\theta$ 同号，energy 就增加；反号就减少。Torque 再小也能加 energy，只是慢。

目标是 homoclinic orbit：它的 energy 是 $E^d=mgl$，沿着它 pendulum 会自己滑到 upright。定义 $\tilde E=E-E^d$，仍有 $\dot{\tilde E}=u\dot\theta$。取

$$u=-k\,\dot\theta\,\tilde E,\qquad k>0$$

代进去：

$$\dot{\tilde E}=-k\,\dot\theta^2\,\tilde E$$

把 $\dot\theta$ 暂时看成定值，这就是 $\dot{\tilde E}$ 对 $\tilde E$ 的一条过原点、slope 为负的直线，第 1 站的图解说明 $\tilde E\to0$。$E<E^d$ 时它是 negative damping，往里加 energy；$E>E^d$ 时它是 damping，往外拿。

Torque 有上限时把 $u$ 截在 $\pm u_{\max}$ 之间。截过之后 $u$ 的符号不变，$\dot{\tilde E}=u\dot\theta$ 的符号仍与 $-\tilde E$ 相同，$|\tilde E|$ 照样单调下降，只是下降得慢一些。

唯一的例外是 $\dot\theta=0$：停在最低点时 $u=0$，什么也不会发生。轻轻推一下就够了。

### 一次完整的 swing-up

第一次失败的那根 pendulum，$u_{\max}=2$ N·m，$k=1$，从 $\theta=0.1$ rad 静止出发。Energy shaping 让它来回摆，每一摆都把 torque 顶在 2 N·m 上加 energy。摆动方向换了 4 次之后，在 $t=5.81$ s 进入 upright 附近的一个 ellipse，在那里切换到 LQR，pendulum 停在 upright。

::fig[m6821-swing] 左边是 pendulum，右边是 phase plane。灰线是 homoclinic orbit，浅色的两个 ellipse 都是 upright 附近 LQR 管得住的 region（$\theta=\pi$ 和 $-\pi$ 是同一个点）。

切换的位置是 $\theta=-2.248$ rad、$\dot\theta=-2.706$ rad/s，也就是离 upright 还有 $0.894$ rad（51°），正以 2.7 rad/s 朝它冲过去。离得这么远还能切换，是因为速度的方向对。这个 ellipse 怎样算出来、为什么可以相信它，是第 5 站的内容。

### 为什么不能一直用 energy shaping

Energy shaping 把所有 trajectory 都推到 homoclinic orbit 上，而 homoclinic orbit 的终点是 upright，所以 upright 是 attractive 的。但它不是 stable i.s.L.：在 upright 附近稍微碰一下，$\tilde E$ 变得略小于 0，controller 加 energy，pendulum 先掉下去，绕一整圈再回来。起点离 upright 再近，trajectory 也要跑到离它 $2\pi$ 远的地方。

:::wrong Energy shaping 会把 pendulum 稳在 upright
它只保证 trajectory 最后回到 upright，不保证中途不跑远，正好是第 1 站说的“attractive 不推出 stable i.s.L.”。教材给了一个更干净的例子：polar 坐标下 $\dot r=r(1-r)$、$\dot\vartheta=\sin^2(\vartheta/2)$。$(r,\vartheta)=(1,0)$ 吸引所有其他 trajectory，可从 $\vartheta=0.01$ 出发，$\dot\vartheta>0$，它要沿着 circle 转一整圈才回到 $\vartheta=2\pi$。Energy shaping 在 upright 附近就是这样。真机上的结果是一碰就甩一整圈，所以要在附近切换成一个真正 stabilizing 的 controller。
:::

### 不需要知道 mass

Controller 里 model 只出现在 $\tilde E$ 的计算里，而 stability 只取决于 $\tilde E=0$ 那条 orbit 的位置：

$$\tilde E=\tfrac12ml^2\dot\theta^2-mgl(1+\cos\theta)=0\iff\tfrac12l\dot\theta^2=g(1+\cos\theta)$$

右边的条件里 $m$ 消掉了。用错了 mass，只等于换了一个 $k$。Length 和 $g$ 只以 $l/g$ 的形式进来。后面大部分 optimization 的方法都没有这么好的 robustness，Assignment 5 的 Exercise 9.11 专门用 Lyapunov 分析这件事。

### Cart-pole：先让 pole 变回一根 pendulum

Cart-pole 的 pole 没有 motor，只能通过推 cart 影响它，$\dot E=u\dot\theta$ 这种算法没法直接套。办法是先用 feedback 把 cart 的那部分 dynamics 变简单。教材把所有常数取 1（$m_c=m_p=l=g=1$），equations of motion 是

$$2\ddot x+\ddot\theta\cos\theta-\dot\theta^2\sin\theta=f,\qquad\ddot x\cos\theta+\ddot\theta+\sin\theta=0$$

记 $c=\cos\theta$、$s=\sin\theta$。由第二式，$\ddot\theta=-\ddot xc-s$。代进第一式：

$$2\ddot x+(-\ddot xc-s)c-\dot\theta^2s=f\quad\Longrightarrow\quad\ddot x(2-c^2)-sc-\dot\theta^2s=f$$

所以只要取

$$f=(2-c^2)\,\ddot x^d-sc-\dot\theta^2s$$

就有 $\ddot x=\ddot x^d$，而 pole 的 equation 变成

$$\ddot\theta=-\ddot x^d\cos\theta-\sin\theta$$

这正是一根 unit pendulum，只是它的 torque input 是 $-\ddot x^d\cos\theta$。这叫 collocated partial feedback linearization：被 linearize 的是有 actuator 的那个 dof（cart），并且对所有 state 成立。$\cos\theta$ 这个 factor 是物理事实：pole 水平时，推 cart 的 force 不产生任何绕 pivot 的 torque。

现在在这根 pendulum 上做 energy shaping。它的 energy $E=\tfrac12\dot\theta^2-\cos\theta$，$E^d=1$：

$$\dot{\tilde E}=\dot\theta\ddot\theta+\dot\theta\sin\theta=\dot\theta(-\ddot x^dc-s)+\dot\theta s=-\ddot x^d\dot\theta\cos\theta$$

取 $\ddot x^d=k\,\dot\theta\cos\theta\,\tilde E$，得 $\dot{\tilde E}=-k\dot\theta^2\cos^2\theta\,\tilde E$。再加一个 PD 把 cart 拉回原点：

$$\ddot x^d=k_E\,\dot\theta\cos\theta\,\tilde E-k_px-k_d\dot x$$

PD 项会和 energy 项抢 cart，所以它破坏了 $|\tilde E|$ 单调下降这条性质；文献里有带收敛证明的版本，教材只引用了，没有展开。

Acrobot 的做法相同：collocated PFL 让 elbow 的 $\ddot q_2$ 等于指定值，再取 $\ddot q_2^d=-k_1q_2-k_2\dot q_2+k_3\,\dot q_1\tilde E$，其中 $E=\tfrac12\dot q^\top M\dot q+U$，$E^d$ 是 upright 的 potential energy。教材对 acrobot 的版本只列了公式，没有证明。

:::edge 为什么不直接 linearize pole
也可以反过来让 $\ddot\theta=\ddot\theta^d$，这叫 non-collocated PFL。由第二式 $\ddot x=-(\ddot\theta+s)/c$，代进第一式得 $f=(c-\tfrac2c)\ddot\theta^d-2\tan\theta-\dot\theta^2s$。$\cos\theta=0$ 时它要无穷大的 force。实现时一定要先对 $f$ 做 saturation。$c-\tfrac2c$ 本身不会是 0：$|c|\le1$ 时 $|c-\tfrac2c|=\tfrac{2-c^2}{|c|}\ge1$。Swing-up 选 collocated 的版本，就是为了不去除这个会变成 0 的 $\cos\theta$。
:::

:::back
Phase portrait、homoclinic orbit 与“attractive 不推出 stable i.s.L.”来自[第 1 站](#pend)。切换用的 ellipse 来自[第 3 站](#lqr)的 LQR 和[第 5 站](#lyap)的 region of attraction。
:::

:::from
$\dot E=u\dot\theta$、$u=-k\dot\theta\tilde E$ 的 error dynamics、“切换到 balancing controller”、对 $m$ 不敏感的论证，来自 [教材第 2 章的 Energy-shaping control](https://underactuated.csail.mit.edu/pend.html)；polar 坐标的例子来自同章的 “Unstable equilibrium point that attracts all trajectories”。Collocated 与 non-collocated PFL 的推导、$|c-2/c|\ge1$、cart-pole 的 energy shaping 与 PD 项、acrobot 的公式，来自 [第 3 章](https://underactuated.csail.mit.edu/acrobot.html)。中间那一步代入是我补全的。2 N·m、$k=1$ 的 swing-up、4 次换向、5.81 s 与切换点的数，是为这一页 simulate 的（RK4，step 2 ms）。
:::

## [lqr] Linearization、controllability 与 LQR balancing

:::skip
快速路线必读（教材第 3 章的 Balancing 一节和第 8 章，约 2.5 小时）。LQR 的 Riccati equation 和 double integrator 的手解已经在 [RB2203 第 4 站](../courses/RB2203.html#ss)讲过。能对一个具体的 cart-pole 写出 $A_{lin}$、$B_{lin}$、判断 controllability、从 HJB 推出 Riccati equation，并写出 discrete-time 的 recursion，就可以去第 4 站。
:::

### Manipulator equation 在 fixed point 处的 linearization

把 manipulator equation 写成 $\dot x=f(x,u)$，$x=(q,\dot q)$：

$$\dot x=\begin{pmatrix}\dot q\\M^{-1}(q)\big[\tau_g(q)+Bu-C(q,\dot q)\dot q\big]\end{pmatrix}$$

在 fixed point $(x^*,u^*)$ 处做 first-order Taylor expansion，$f(x^*,u^*)=0$，记 $\bar x=x-x^*$、$\bar u=u-u^*$，得到 $\dot{\bar x}=A_{lin}\bar x+B_{lin}\bar u$。Fixed point 处大部分项都没有了：

- $\partial M^{-1}/\partial q$ 乘的是 $\tau_g+Bu-C\dot q$，它在 fixed point 等于 0；
- $C\dot q$ 的 derivative 都带着 $\dot q^*=0$；
- $B$ 是常数（acrobot、cart-pole 都是）。

剩下的是

$$A_{lin}=\begin{pmatrix}0&I\\M^{-1}\dfrac{\partial\tau_g}{\partial q}&0\end{pmatrix},\qquad B_{lin}=\begin{pmatrix}0\\M^{-1}B\end{pmatrix}$$

都在 $x^*$ 处取值。

拿第二次失败的 cart-pole 算一遍：$m_c=0.5$、$m_p=0.2$、$l=0.3$、$g=9.81$，$q=(x,\theta)$，upright 是 $\theta=\pi$。

$$M(q)=\begin{pmatrix}m_c+m_p&m_pl\cos\theta\\m_pl\cos\theta&m_pl^2\end{pmatrix}\ \xrightarrow{\ \theta=\pi\ }\ \begin{pmatrix}0.7&-0.06\\-0.06&0.018\end{pmatrix}$$

$\det M=0.7\times0.018-0.06^2=0.0126-0.0036=0.009$，

$$M^{-1}=\frac{1}{0.009}\begin{pmatrix}0.018&0.06\\0.06&0.7\end{pmatrix}=\begin{pmatrix}2&6.667\\6.667&77.78\end{pmatrix}$$

$\tau_g=\begin{pmatrix}0\\-m_pgl\sin\theta\end{pmatrix}$，对 $\theta$ 求导是 $-m_pgl\cos\theta$，在 $\theta=\pi$ 等于 $m_pgl=0.2\times9.81\times0.3=0.5886$。所以

$$M^{-1}\frac{\partial\tau_g}{\partial q}=\begin{pmatrix}2&6.667\\6.667&77.78\end{pmatrix}\begin{pmatrix}0&0\\0&0.5886\end{pmatrix}=\begin{pmatrix}0&3.924\\0&45.78\end{pmatrix},\qquad M^{-1}B=\begin{pmatrix}2\\6.667\end{pmatrix}$$

$$A_{lin}=\begin{pmatrix}0&0&1&0\\0&0&0&1\\0&3.924&0&0\\0&45.78&0&0\end{pmatrix},\qquad B_{lin}=\begin{pmatrix}0\\0\\2\\6.667\end{pmatrix}$$

$A_{lin}$ 的 eigenvalue 是 $0,0,\pm\sqrt{45.78}=\pm6.766$。正的那个说明不加控制时 $\bar\theta$ 按 $e^{6.77t}$ 长大，每 0.15 s 放大 $e$ 倍。

### Underactuated，却 controllable

这台 cart-pole 只有一个 input，能不能把四个 state 都带回 0？Linear system 的判据是 controllability matrix $\mathcal C=\begin{pmatrix}B&AB&A^2B&A^3B\end{pmatrix}$ 的 rank 等于 4。逐列算：

$$B=\begin{pmatrix}0\\0\\2\\6.667\end{pmatrix},\ AB=\begin{pmatrix}2\\6.667\\0\\0\end{pmatrix},\ A^2B=\begin{pmatrix}0\\0\\3.924\times6.667\\45.78\times6.667\end{pmatrix}=\begin{pmatrix}0\\0\\26.16\\305.2\end{pmatrix},\ A^3B=\begin{pmatrix}26.16\\305.2\\0\\0\end{pmatrix}$$

$AB$ 和 $A^3B$ 只占上两行，$B$ 和 $A^2B$ 只占下两行，所以 $\det\mathcal C$ 的绝对值是两个 $2\times2$ determinant 的乘积，而这两个 determinant 相同：

$$\begin{vmatrix}2&26.16\\6.667&305.2\end{vmatrix}=2\times305.2-6.667\times26.16=610.4-174.4=436$$

$|\det\mathcal C|=436^2\approx1.9\times10^5\neq0$，rank 4，controllable。

> Underactuated 的 system 不能沿任意 trajectory 走，但仍可能到达任意 state，只是走过去的路可能很绕。

如果 pole 换成和 cart 无关的东西，例如 $M^{-1}B$ 的第二个分量是 0，上面那个 determinant 就是 0，pole 那一半永远不受影响。

### 从 HJB 推出 Riccati equation

Controllable 只说明存在把 state 拉回来的 input，没说取哪一个。LQR 定义 cost

$$J=\int_0^\infty\big(x^\top Qx+u^\top Ru\big)\,dt,\qquad Q\succeq0,\ R\succ0$$

最优的 cost-to-go $J^*(x)$ 满足 HJB equation：

$$0=\min_u\Big[x^\top Qx+u^\top Ru+\frac{\partial J^*}{\partial x}(Ax+Bu)\Big]$$

猜 $J^*(x)=x^\top Sx$，$S=S^\top\succeq0$，则 $\partial J^*/\partial x=2x^\top S$。方括号里对 $u$ 是 convex quadratic（因为 $R\succ0$），令 gradient 为 0：

$$2u^\top R+2x^\top SB=0\quad\Longrightarrow\quad u^*=-R^{-1}B^\top Sx=-Kx$$

代回去。$u^{*\top}Ru^*=x^\top SBR^{-1}RR^{-1}B^\top Sx=x^\top SBR^{-1}B^\top Sx$，$2x^\top SBu^*=-2x^\top SBR^{-1}B^\top Sx$，于是

$$0=x^\top\big[Q-SBR^{-1}B^\top S+2SA\big]x$$

$x^\top SAx$ 是一个数，等于它的 transpose $x^\top A^\top Sx$，所以 $2SA$ 可以换成 $SA+A^\top S$。这对所有 $x$ 成立，只要

$$SA+A^\top S-SBR^{-1}B^\top S+Q=0$$

这就是 algebraic Riccati equation，system stabilizable 时它有唯一的 positive definite solution。$u^*=-R^{-1}B^\top Sx$ 也有一个几何意思：$-Sx$ 是 cost-to-go 下降最快的方向，乘 $B^\top$ 是把它投到 actuator 能推的方向上。

对上面的 cart-pole 取 $Q=\operatorname{diag}(10,10,1,1)$、$R=1$，数值解得

$$K=\begin{pmatrix}-3.162&23.36&-3.411&3.819\end{pmatrix}$$

Closed loop $A-BK$ 的 eigenvalue 是 $-10.77$、$-4.715$、$-1.576\pm1.261j$，全部在左半平面。

$K$ 的第一个分量是负的：$f=-K\bar x$ 里 $x$ 的系数是 $+3.162$，cart 在原点右边时还要往右推。这是因为 cart 要先跑到 pole 底下才能把 pole 扶起来。开头那张图里 $\bar\theta=30°$（pole 的顶端在左），cart 先往左跑到 $-0.60$ m，再慢慢回到原点。

### LQR 只认识 linearization

LQR 对 linearization 是 globally optimal 的，对真正的 nonlinear cart-pole 只在 upright 附近有效。开头的 simulation 正说明这一点：不限 rail 时 60° 能回来，65° 就倒了。$\bar\theta=65°$ 时 $\sin\bar\theta=0.906$，而 linearization 用的是 $\bar\theta=1.134$ rad，差了 25%；更要紧的是 $\cos\theta$ 变小，推 cart 对 pole 的作用跟着变小，linear model 高估了 control authority。

:::wrong Linearization controllable，LQR 就能从任何地方把它拉回来
Controllability 和 LQR 的 stability 都是对 linear model 的结论。上面那台 cart-pole 的 linearization controllable，LQR 的 closed loop 四个 eigenvalue 都在左半平面，可从 70° 放手 pole 照样倒下；rail 只有 ±0.5 m 时，30° 就已经不行。LQR 的 cost-to-go $\bar x^\top S\bar x$ 只是 nonlinear cost-to-go 在 upright 附近的 approximation，能信多远要另外证明，见[第 5 站](#lyap)。
:::

### Finite horizon、time-varying 与 discrete time

Trajectory optimization 和 iLQR 要用 finite horizon 的版本。Cost 加一个 terminal 项 $x(t_f)^\top Q_fx(t_f)$，cost-to-go 随时间变，猜 $J^*(x,t)=x^\top S(t)x$，HJB 多一项 $\partial J^*/\partial t=x^\top\dot S(t)x$，同样的推导给出 differential Riccati equation

$$-\dot S(t)=S(t)A+A^\top S(t)-S(t)BR^{-1}B^\top S(t)+Q,\qquad S(t_f)=Q_f$$

从 $t_f$ 往回积分。$A$、$B$ 随时间变时推导一字不改，这就是 time-varying LQR（TVLQR）：沿一条 nominal trajectory $x_0(t),u_0(t)$ linearize，得到 $A(t),B(t)$，controller 是 $u=u_0(t)-K(t)(x-x_0(t))$。第 4 站会用它把 optimize 出来的 trajectory 稳住。

Discrete time 的 $x[n+1]=Ax[n]+Bu[n]$，cost $\sum_n x^\top Qx+u^\top Ru$，猜 $J(x,n)=x^\top S[n]x$，Bellman equation 是

$$x^\top S[n-1]x=\min_u\Big[x^\top Qx+u^\top Ru+(Ax+Bu)^\top S[n](Ax+Bu)\Big]$$

对 $u$ 求导：$2Ru+2B^\top S[n](Ax+Bu)=0$，得

$$u^*=-\big(R+B^\top S[n]B\big)^{-1}B^\top S[n]A\,x$$

代回去整理，就是 Riccati difference equation：

$$S[n-1]=Q+A^\top S[n]A-\big(A^\top S[n]B\big)\big(R+B^\top S[n]B\big)^{-1}\big(B^\top S[n]A\big)$$

算一个例子，第 4 站会接着用。Inverted pendulum 在 upright 附近 linearize（$g/l=1$），$\ddot{\bar\theta}=\bar\theta+u$，用 explicit Euler、$h=0.1$ 离散：

$$A=I+h\begin{pmatrix}0&1\\1&0\end{pmatrix}=\begin{pmatrix}1&0.1\\0.1&1\end{pmatrix},\qquad B=\begin{pmatrix}0\\0.1\end{pmatrix}$$

取 $Q=Q_N=I$、$R=1$，从 $S[N]=I$ 往回走一步。$A^\top A=\begin{pmatrix}1.01&0.2\\0.2&1.01\end{pmatrix}$，$A^\top B=\begin{pmatrix}0.01\\0.1\end{pmatrix}$，$R+B^\top B=1.01$，

$$S[N-1]=I+\begin{pmatrix}1.01&0.2\\0.2&1.01\end{pmatrix}-\frac{1}{1.01}\begin{pmatrix}0.0001&0.001\\0.001&0.01\end{pmatrix}=\begin{pmatrix}2.0099&0.1990\\0.1990&2.0001\end{pmatrix}$$

继续往回走，10 步后 $S_{11}=15.72$，20 步后 31.34，40 步后 36.06，100 步后停在

$$S_\infty=\begin{pmatrix}36.16&25.88\\25.88&26.13\end{pmatrix},\qquad K_\infty=\begin{pmatrix}2.259&2.277\end{pmatrix}$$

这是 discrete-time algebraic Riccati equation 的解。Horizon 够长时，finite-horizon 的解收敛到 infinite-horizon 的解。

:::back
Riccati equation 的逐项手解、只罚 position 时 $\zeta=1/\sqrt2$ 见 [RB2203 第 4 站](../courses/RB2203.html#ss)。$M(q)$、$C$、$\tau_g$ 怎样由 Lagrange equations 得出见 [RB2202](../courses/RB2202.html)。
:::

:::from
Manipulator equation 的 linearization 公式与“哪些项为什么消失”、cart-pole 的 $M$ 与 $\partial\tau_g/\partial q$、“underactuated 不等于 uncontrollable”、LQR 的 Drake 用法，来自 [教材第 3 章 Balancing 一节](https://underactuated.csail.mit.edu/acrobot.html)。HJB 推导、$-Sx$ 投到 action space 的解释、finite-horizon 与 time-varying LQR、discrete-time Riccati equation，来自 [第 8 章](https://underactuated.csail.mit.edu/lqr.html)。0.5/0.2/0.3 的 cart-pole、controllability 的 block 结构、$K$ 的数、负号的解释、Euler 离散的 inverted pendulum 与 recursion 的数，是为这一页算的（Riccati 用 Kleinman 迭代）；inverted pendulum 的设定参照 [shooting vs transcription 的 notebook](https://github.com/RussTedrake/underactuated)，$h$、$Q$、$Q_N$ 换了。
:::

## [trajopt] Trajectory optimization：transcription、shooting、collocation 与 iLQR

:::skip
快速路线必读（教材第 10 章，约 3.5 小时），作业的三个编程 exercise 都在这里。能写出 transcription 与 shooting 的区别并解释 shooting 为什么丢精度，能推出 collocation 的 midpoint constraint，能写出 iLQR 的 backward pass，就可以去第 5 站。
:::

### 只要一条 trajectory

LQR 给的是整个 state space 上的 policy，但只在一点附近有效；对整个 state space 求 nonlinear 的 optimal policy 要在 state space 上铺 mesh，state 超过四五维就做不动。Trajectory optimization 退一步：只从一个初始状态 $x_0$ 出发，求一条 $x(t),u(t)$：

$$\min_{u(\cdot)}\ \ell_f(x(t_f))+\int_0^{t_f}\ell(x,u)\,dt\quad\text{s.t.}\quad\dot x=f(x,u),\ x(0)=x_0$$

再加上 input limit、collision 之类的 constraint。只需要在时间这一维上 discretize，参数的个数和 state 的维数成线性关系，不再是指数关系。

### Transcription 与 shooting：同一个问题的两种写法

先看 discrete-time linear system $x[n+1]=Ax[n]+Bu[n]$。

**Direct transcription**：$x[\cdot]$ 和 $u[\cdot]$ 都是 decision variable，dynamics 写成 equality constraint。Linear dynamics 是 linear constraint，cost 是 quadratic 时整个问题是 QP。

**Direct shooting**：只有 $u[\cdot]$ 是 decision variable，$x[n]$ 用 forward simulation 消掉：

$$x[n]=A^nx_0+\sum_{k=0}^{n-1}A^{n-1-k}Bu[k]$$

变量少了，constraint 没了，看起来严格更好。拿第 3 站那个 Euler 离散的 inverted pendulum 试（$Q=Q_N=I$，$R=1$）。Shooting 把 cost 写成 $u$ 的 quadratic，Hessian 是 $H=R\,I+\mathbb B^\top\mathbb Q\mathbb B$，$\mathbb B$ 的 block 是 $A^{n-1-k}B$。要求 optimal 的 $u$ 就要解 $Hu=-\cdots$，精度由 $H$ 的 condition number 决定：$\log_2\operatorname{cond}(H)$ 大约是解 linear system 时丢掉的 bit 数。

::fig[m6821-shoot] Horizon 加长时两种写法的 condition number。彩色是 shooting 的 Hessian，黑色是 transcription 的 KKT matrix。

Shooting 每多一步就多丢 0.275 bit，N = 150 时已经丢了 38.4 bit，照这个速度到 N ≈ 200 就超过 double 的 52 bit，算出来的 $u$ 一位也不可信。Transcription 的 KKT matrix 停在 9.5 bit。

0.275 是怎么来的：$A$ 的 eigenvalue 是 $1\pm0.1$，$u[0]$ 对 $x[N]$ 的影响按 $1.1^N$ 长，而 $u[N-1]$ 的影响只有一步。$H$ 里同时有 $1.1^{2N}$ 量级和 1 量级的方向，condition number 约按 $1.1^{2N}$ 增长，每步 $2\log_21.1=0.275$ bit。这不是 shooting 写错了，问题本身就是这样：早期的 $u$ 确实对 cost 影响大得多。Transcription 把这个影响摊到 $N$ 个只连接相邻两步的 constraint 上，每个 constraint 的系数都在 1 附近。

Transcription 还有两个好处。State constraint 直接写在 $x[n]$ 上；constraint 只连相邻两步，Jacobian 是 banded 的，正好是 Riccati recursion 利用的那种结构，可以并行求值。

### Nonlinear dynamics 与 direct collocation

Dynamics 是 nonlinear 时，两种写法照样能用，只是问题变成 nonconvex，要用 nonlinear programming。Continuous time 的 dynamics 还要决定怎样离散。用 RK4 当 constraint 可以，但 integrator 是为“往前算”设计的，而 transcription 里 $x[k]$ 和 $x[k+1]$ 都是变量，可以利用这一点。

Direct collocation 把 $u(t)$ 取成 piecewise linear，把 $x(t)$ 取成 piecewise cubic。Decision variable 只有 knot 处的 $x[k]$、$u[k]$：一段 cubic 有四个系数，正好由两端的 $x[k]$、$x[k+1]$ 和两端的 slope $\dot x[k]=f(x[k],u[k])$、$\dot x[k+1]=f(x[k+1],u[k+1])$ 定下来。

这样画出来的 cubic 不一定满足 dynamics。Collocation 在每段的 midpoint $t_c=t_k+h/2$ 上要求它满足。用 cubic Hermite 的 basis，$s=(t-t_k)/h$，

$$x(t)=(2s^3-3s^2+1)x_k+(s^3-2s^2+s)h\dot x_k+(-2s^3+3s^2)x_{k+1}+(s^3-s^2)h\dot x_{k+1}$$

在 $s=\tfrac12$ 处四个 basis 的值是 $\tfrac12,\ \tfrac18,\ \tfrac12,\ -\tfrac18$，对 $t$ 的 derivative（每项除以 $h$）是 $-\tfrac{3}{2h},\ -\tfrac14,\ \tfrac{3}{2h},\ -\tfrac14$，所以

$$x_c=\tfrac12(x_k+x_{k+1})+\tfrac h8(\dot x_k-\dot x_{k+1}),\qquad\dot x_c=-\tfrac{3}{2h}(x_k-x_{k+1})-\tfrac14(\dot x_k+\dot x_{k+1})$$

Collocation constraint 是

$$\dot x_c=f\big(x_c,\tfrac12(u_k+u_{k+1})\big)$$

Constraint 左右两边之差叫 defect。每段 evaluate dynamics 两次（knot 上的 $\dot x$ 被相邻两段共用），integration 的 accuracy 是 third order。

拿 pendulum（$b=0$、$u=0$）算一段，$h=0.2$ s，$x_k=(\theta,\dot\theta)=(0.5,0)$。$f(x_k)=(0,-9.81\sin0.5)=(0,-4.7032)$。

先让 $x_{k+1}$ 取真实的 state，用精确的 integration 得到 $(0.4086,-0.8868)$，$f(x_{k+1})=(-0.8868,-3.8980)$。Midpoint：

$$x_c=\big(0.4543+0.025\times0.8868,\ -0.4434+0.025\times(-4.7032+3.8980)\big)=(0.4765,-0.4635)$$

$$\dot x_c=\big(-7.5\times0.0914-\tfrac14\times(-0.8868),\ -7.5\times0.8868-\tfrac14\times(-8.6012)\big)=(-0.4636,-4.5008)$$

$f(x_c)=(-0.4635,-9.81\sin0.4765)=(-0.4635,-4.4995)$。Defect 是 $(-0.00003,-0.0013)$，几乎为 0，而真实的 midpoint state 是 $(0.4767,-0.4636)$，cubic 在中点只差 $2\times10^{-4}$。

再把 $x_{k+1}$ 随便猜成 $(0.4,-1.0)$。同样的公式给出 $x_c=(0.475,-0.5221)$、$\dot x_c=(-0.5,-5.3692)$，而 $f(x_c)=(-0.5221,-4.4865)$，defect 是 $(0.0221,-0.8827)$。Optimizer 要做的就是调整所有 knot，让每段的 defect 都降到 0，同时让 cost 最小。

::fig[m6821-colloc] 两张图都只画 $\dot\theta$。彩色 curve 是 cubic，虚线是真实 trajectory，midpoint 上两条短线分别是 cubic 的 slope 和 dynamics 要求的 slope。左边几乎重合，右边差了 0.88，这个差就是 defect 的第二个分量。

### iLQR：每一步解一次 TVLQR

Unconstrained 的 trajectory optimization 还有一种做法，利用第 3 站的 Riccati 结构。从一条猜的 $\bar u[\cdot]$ 出发，simulate 出 $\bar x[\cdot]$；沿着它把 dynamics linearize、把 cost 展开到二阶，得到一个 time-varying 的 LQ 问题，解它得到改进量，simulate 出新的 trajectory，重复。这就是 iterative LQR。

记 $\delta x=x-\bar x$、$\delta u=u-\bar u$，在第 $n$ 步把 Bellman equation 右边的 $Q(x,u)=\ell(x,u)+V_{n+1}(f(x,u))$ 展开到二阶（$V_{n+1}$ 的 gradient 记 $V_x$、Hessian 记 $V_{xx}$，$f_x$、$f_u$ 是 dynamics 的 Jacobian）：

$$Q_x=\ell_x+f_x^\top V_x,\quad Q_u=\ell_u+f_u^\top V_x,\quad Q_{xx}=\ell_{xx}+f_x^\top V_{xx}f_x,\quad Q_{uu}=\ell_{uu}+f_u^\top V_{xx}f_u,\quad Q_{ux}=\ell_{ux}+f_u^\top V_{xx}f_x$$

对 $\delta u$ 求最小：$\delta u^*=k+K\delta x$，$k=-Q_{uu}^{-1}Q_u$，$K=-Q_{uu}^{-1}Q_{ux}$。代回去得到第 $n$ 步的 value function：

$$V_x\leftarrow Q_x+K^\top Q_{uu}k+K^\top Q_u+Q_{ux}^\top k,\qquad V_{xx}\leftarrow Q_{xx}+K^\top Q_{uu}K+K^\top Q_{ux}+Q_{ux}^\top K$$

从 $V_x=\partial\ell_f/\partial x$、$V_{xx}=\partial^2\ell_f/\partial x^2$ 出发往回走一遍，这是 backward pass。Forward pass 用新的 control simulate：

$$u[n]=\bar u[n]+\alpha\,k[n]+K[n]\big(x[n]-\bar x[n]\big)$$

$\alpha$ 从 1 开始，cost 不降就减半。把 $f$ 的二阶 derivative 也算进 $Q_{xx}$ 等项就是 DDP；通常认为不值得多算，iLQR 一般收敛得一样快。

拿 pendulum swing-up 试：$m=l=1$、$g=9.81$，explicit Euler、$dt=0.05$ s、$N=80$（4 s），cost 是 $\sum_n dt\,u[n]^2+(x[N]-x_{goal})^\top\operatorname{diag}(200,20)(x[N]-x_{goal})$，从 $u\equiv0$ 出发。

| iteration | 0 | 1 | 2 | 3 | 4 | 6 | 10 | 60 |
|---|---|---|---|---|---|---|---|---|
| cost | 1973.92 | 423.53 | 172.85 | 80.86 | 30.15 | 15.59 | 14.50 | 13.96 |
| peak $\lvert u\rvert$（N·m） | 0 | 35.67 | 19.79 | 12.41 | 6.57 | 3.38 | 3.39 | 3.45 |

::fig[m6821-ilqr] 每一帧是一个 iteration。左边是 phase plane 上的 trajectory，右边是 $u(t)$。

第一个 iteration 是在最低点 linearize 出来的，它以为 pendulum 是 linear spring，于是用 35.67 N·m 硬推；之后每次在新的 trajectory 上重新 linearize，学会了先往反方向摆一下再上去，peak torque 降到 3.45 N·m。这个数仍大于第一次失败的 2 N·m：iLQR 的 Riccati backward pass 处理不了 $|u|\le2$ 这样的 constraint，实践中把 constraint 放进 cost 做 penalty 或 augmented Lagrangian；direct collocation 则可以直接加 bound。

### 算出来的 trajectory 要配一个 feedback

上面那条 trajectory 用 Euler、$dt=0.05$ 算出来，终点是 $(\theta,\dot\theta)=(3.124,0.049)$。把同一组 $u[n]$ 以 zero-order hold 放进精确的 RK4 simulation（每段 50 个小步），pendulum 最后停在 $(-1.080,-3.367)$，根本没上去：两种 integration 的差在 unstable 的 upright 附近被放大了。Solver 只把 dynamics constraint 满足到 $10^{-6}$ 左右、optimization 的 time step 比 simulation 粗，都会造成同样的事，真机上还要加上 model error。

办法是沿 trajectory 加 TVLQR：$u=\bar u[n]+K[n](x-\bar x[n])$。iLQR 的最后一次 backward pass 正好给出了 $K[n]$。在同一个 RK4 simulation 里加上这项 feedback，终点是 $(3.102,0.101)$，回到了 goal 附近。

:::wrong Forward pass 只要把 $\alpha k$ 加到 $\bar u$ 上
$k$ 是在 $\bar x$ 上算的。Forward pass 一开始改了 $u$，后面的 state 就离开了 $\bar x$，这时还沿用 $\bar u+\alpha k$ 等于在错的地方用 open-loop 的修正。上面 RK4 的那次重放就是同一件事：离开 nominal trajectory 一点点，在 upright 附近就被放大到完全错过。$K(x-\bar x)$ 这一项把 forward pass 本身变成 closed loop，也是 iLQR 给出 TVLQR gain 的原因。
:::

### 解不出来时怎么办

Nonconvex 的 trajectory optimization 会返回很糟的解，或者报 infeasible，而你分不清是真的 infeasible 还是卡在 local minimum。两种常见的补救：调 cost 的权重，或者给一个更好的 initial guess。教材作者倾向后者，并指出 transcription 和 collocation 能直接给 $x(\cdot)$ 的初值，shooting 只能给 $u(\cdot)$；acrobot 和 cart-pole 的 swing-up 只要把 $x(\cdot)$ 初始化成起点到终点的直线，collocation 就能找到好的解，而且这一步是必要的。

:::back
Riccati recursion、TVLQR 与 discrete-time LQR 来自[第 3 站](#lqr)。Condition number 的意思见 [DSA2102 第 3 站](../courses/DSA2102.html#cond)。Kinematic 的 trajectory optimization 与 Graphs of Convex Sets 见 [MIT 6.4210 第 5 站](../courses/MIT-6.4210.html#plan)。
:::

:::from
问题的 formulation、“只在时间上 discretize”、transcription 与 shooting 的定义和三条比较（conditioning、state constraint、parallelization）、banded sparsity、collocation 的 cubic/linear 选择与 midpoint 公式、third-order accuracy、initial guess 的经验、trajectory 需要 feedback 的理由、iLQR 与 DDP 的区别，来自 [教材第 10 章](https://underactuated.csail.mit.edu/trajopt.html)。Backward pass 的 $Q_x,Q_u,\dots$ 写法和 forward pass 里的 $K(x-\bar x)$ 来自仓库里 `ilqr_driving.ipynb` 的推导说明；“$\log_2\operatorname{cond}$ 是丢掉的 bit 数”来自 `shooting_vs_transcription.ipynb`。Hermite basis 在 midpoint 的值是我补的推导；condition number 的曲线、collocation 的两组数、iLQR 的表、RK4 重放与 TVLQR 的结果，是为这一页算的。
:::

## [lyap] Lyapunov function 与 region of attraction

:::skip
不在快速路线里（教材把第 9 章的 SOS 部分列为可跳）；但前三个小节回答了第 2 站“什么时候切换到 LQR”，建议读。能用 energy 和 LaSalle 证明 damped pendulum 的 stability，能用 sublevel set 给出 ROA 的 inner estimate，能说出 $\dot V<0$ 的点为什么不一定回得来，就可以去第 6 站。最后一个小节（SOS）只在要做 verification 时读。
:::

### 用 energy 证明 stability

第 1 站从图上看出 damped pendulum 的最低点 asymptotically stable。能不能证明，而且用一种对复杂 system 也行得通的办法？第 1 站已经算过 $\dot E=-b\dot\theta^2\le0$。Energy 有下界，在最低点取最小值 $-mgl$，而且只要 $\dot\theta\neq0$ 就严格下降。$\dot\theta=0$ 的非 fixed-point state 只停留一瞬间，下一刻又有了速度、又开始耗散。所以 state 最终只能停在 fixed point。

这个论证不需要知道 $\theta(t)$ 长什么样，只要一个随时间不增的 scalar function。把它推广：

**Lyapunov 的 direct method。** 在包含原点的 open set $\mathcal D$ 上，若有 continuously differentiable 的 $V(x)$，$V(0)=0$，$V(x)>0$（$x\neq0$），且

$$\dot V(x)=\frac{\partial V}{\partial x}f(x)\le0$$

则原点 stable i.s.L.；$\dot V<0$（$x\neq0$）则 asymptotically stable；$\dot V\le-\alpha V$ 则 exponentially stable，因为 $V(x(t))\le V(x(0))e^{-\alpha t}$。要 global 的结论还要求 $\|x\|\to\infty$ 时 $V\to\infty$（radially unbounded），否则 $V$ 下降时 trajectory 仍可能跑到无穷远。

Pendulum 的 energy 只给出 $\dot V\le0$，不是 $<0$。补上这一步的是 **LaSalle's theorem**：$V\succ0$、$\dot V\le0$、trajectory bounded 时，state 收敛到 $\{\dot V=0\}$ 里最大的 invariant set。Invariant set 指进去了就不再出来的 set。Pendulum 上 $\dot V=0$ 的地方是整条 $\dot\theta=0$ 的 line，但在这条 line 上能一直待着的只有 fixed point，所以最大的 invariant set 就是所有 fixed point。

第 2 站的 energy shaping 也可以这样看：取 $V=\tfrac12\tilde E^2$，cart-pole 上 $\dot V=\tilde E\dot{\tilde E}=-k\dot\theta^2\cos^2\theta\,\tilde E^2\le0$。LaSalle 只能说 state 收敛到 $\tilde E=0$ 的 invariant set，也就是整条 homoclinic orbit，这正是 upright 只 attractive、不 stable 的原因。

### Sublevel set 就是 region of attraction 的 inner estimate

$\dot V\le0$ 意味着 $V$ 沿 trajectory 不增，所以只要 $\{x:V(x)\le\rho\}$ 是 bounded 的，并且在这整个 set 上 $\dot V\le0$，trajectory 一旦进去就出不来：它是 invariant set。再由 LaSalle，若 $\dot V<0$（除原点外）成立在整个 set 上，这个 set 就在原点的 ROA 里面。

一维的例子：$\dot x=-x+x^3$，fixed point 在 $0$ 和 $\pm1$。在原点 linearize 得 $\dot x=-x$，取 $V=\tfrac12x^2$：

$$\dot V=x(-x+x^3)=-x^2+x^4=-x^2(1-x^2)$$

$|x|<1$ 时为负。所以 $V<\tfrac12$，即 $x\in(-1,1)$，在 ROA 里。这个估计是 tight 的：$\pm1$ 是 unstable fixed point。

### 拿 LQR 的 cost-to-go 当 $V$

第 2 站的 pendulum 要在 upright 切换到 LQR，切换的范围要多大？LQR 自带一个 candidate：$V(\bar x)=\bar x^\top S\bar x$。在 upright linearize，$\bar\theta=\theta-\pi$，$\ddot{\bar\theta}=g\sin\bar\theta+u\approx g\bar\theta+u$，$A=\begin{pmatrix}0&1\\9.81&0\end{pmatrix}$、$B=\begin{pmatrix}0\\1\end{pmatrix}$。取 $Q=\operatorname{diag}(10,1)$、$R=1$：

$$S=\begin{pmatrix}66.19&20.12\\20.12&6.421\end{pmatrix},\qquad K=R^{-1}B^\top S=\begin{pmatrix}20.12&6.421\end{pmatrix}$$

$B^\top S$ 就是 $S$ 的第二行，所以 $K$ 和 $S$ 的第二行一样。

对 linear model 来说 $V$ 处处下降。但真实的 closed loop 有两处 nonlinear：$\sin\bar\theta$，以及 $u$ 被截在 $\pm2$。在每个点上用真实的 dynamics 算

$$\dot V=2\,\bar x^\top S\,\dot{\bar x},\qquad\dot{\bar x}=\begin{pmatrix}\dot\theta\\ \operatorname{sat}_2(-K\bar x)+g\sin\bar\theta\end{pmatrix}$$

找出所有 $\dot V\ge0$ 的点里 $V$ 的最小值，那就是能取的最大 $\rho$。在 $|\bar\theta|\le1.5$、$|\dot\theta|\le6$ 的网格上做，得到 $\rho=2.607$。

::fig[m6821-roa] 深色网格是 simulation 里 12 s 内进入 ellipse、因而回到 upright 的初始状态（零星的空格是少数绕圈后没有进来的点），彩色 ellipse 是 $V=2.607$ 的 level set。两个黑点是 $\bar\theta=\pm0.205$。

Ellipse 和 $\bar\theta$ 轴交在

$$\bar\theta=\sqrt{\rho/S_{11}}=\sqrt{2.607/66.19}=0.1985$$

物理上的极限是 $g\sin\bar\theta=2$，即 $\bar\theta=\arcsin(2/9.81)=0.205$：静止在这个角度以外，2 N·m 已经抵不过 gravity。估计只比极限小 3%。沿着“$\bar\theta$ 和 $\dot\theta$ 反号”的方向（朝 upright 运动）ellipse 伸得很远，$|\bar\theta|$ 最大到 0.907。第 2 站的切换点 $\bar\theta=0.894$、$\dot\theta=-2.706$ 就在这个方向上，$V=2.57<2.607$。

:::wrong 只要在某一点 $\dot V<0$，从那里出发就会回到原点
取 $\bar\theta=0.08$、$\dot\theta=-0.9$：$V=2.728$，比 $\rho$ 大一点，而 $\dot V=-0.159<0$，$V$ 在这一刻是下降的。Simulate 一下，pendulum 越过 upright 冲到另一边，2 N·m 拉不住，倒下了。$\dot V<0$ 只说明这一刻往 $V$ 小的方向走，不说明以后一直如此。定理要求整个 sublevel set 里处处 $\dot V<0$，trajectory 才被关在里面；这一点所在的 sublevel set $\{V\le2.728\}$ 里有 $\dot V\ge0$ 的点，trajectory 可以从那里漏出去。
:::

:::edge 网格 sampling 不是 proof
上面的 $\rho$ 只在网格点上检查了 $\dot V$，两个网格点之间 $\dot V$ 可能是正的。要真正的 certificate，得把“$V\le\rho$ 上处处 $\dot V<0$”写成 optimization 的 constraint，下一节就是做这件事。
:::

### 用 SOS 把 Lyapunov 条件交给 solver

:::skip
跳过这一节，会少掉 verification 和 funnel 一类论文的背景；Assignment 5 的 Van der Pol 那题需要它。
:::

Linear system $\dot x=Ax$ 上，$V=x^\top Px$ 是 Lyapunov function 当且仅当 $P\succ0$ 且 $PA+A^\top P\prec0$，这是一个 semidefinite program（SDP），solver 能找到 global 的解。Nonlinear 的推广是 sums of squares（SOS）：一个 polynomial $p(x)$ 能写成 $m(x)^\top Pm(x)$、$P\succeq0$（$m(x)$ 是 monomial 组成的 vector），它就处处非负，而“能写成这样”是对 $P$ 的 linear constraint，又是 SDP。

ROA 要的是“在 $V\le\rho$ 上 $\dot V<0$”，只在一个 region 上成立。S-procedure：如果能找到 polynomial multiplier $\lambda(x)$，使

$$-\dot V(x)+\lambda(x)\big(V(x)-\rho\big)\ \text{是 SOS},\qquad\lambda(x)\ \text{是 SOS}$$

那么在 $V\le\rho$ 的地方第二项 $\le0$，第一项只会更难非负，所以 $-\dot V\ge0$ 在那里成立。

一维的例子：$\dot x=-x+x^3$，$V=x^2$，$\dot V=-2x^2+2x^4$，$\rho=1$。要 $2x^2-2x^4+\lambda(x)(x^2-1)$ 是 SOS。取 $\lambda(x)=2x^2$：

$$2x^2-2x^4+2x^2(x^2-1)=2x^2-2x^4+2x^4-2x^2=0$$

0 是 SOS，$2x^2$ 是 SOS，于是证明了 $x^2\le1$ 上 $\dot V\le0$。Solver 做的就是自动找这样的 $\lambda$。

$\rho$ 不能也当 decision variable：$\lambda(x)\rho$ 里出现 $\lambda$ 的系数乘 $\rho$，是 bilinear 的，问题不再 convex。$\rho$ 只有一个数，固定它解一次 SOS，对 $\rho$ 做 line search，找最大的 feasible 值。Pendulum 的 $\sin\theta$ 不是 polynomial，教材用 $s=\sin\theta$、$c=\cos\theta$ 作变量并加上 $s^2+c^2=1$ 这个 equality constraint 来处理，这部分我没有读。

:::back
Energy 的计算来自[第 1 站](#pend)，$V=\tfrac12\tilde E^2$ 的 controller 来自[第 2 站](#swing)，$S$ 和 $K$ 的来历见[第 3 站](#lqr)。
:::

:::from
Damped pendulum 的 energy 论证、direct method 的三档条件、radially unbounded、LaSalle 与 pendulum 的 invariant set、cart-pole energy shaping 的 $V=\tfrac12\tilde E^2$、sublevel set 与 ROA 的定理、$\dot x=-x+x^3$ 的例子、“LQR 的 $S$ 可以当 candidate”、SDP 与 SOS、S-procedure、cubic 例子的 multiplier 形式、$\rho$ 是 bilinear 所以 line search，来自 [教材第 9 章](https://underactuated.csail.mit.edu/lyapunov.html)；第 9 章 “Regions of attraction and LQR” 那个小节在原文里只有标题和一句话，pendulum 的 $\rho$、ellipse、网格 simulation、$\lambda=2x^2$ 这个具体的 multiplier 和反例的点，是为这一页算的。教材有一个 sampling 的 notebook（`sampling.ipynb`），我没有读它的内容，这里的网格做法是自己写的。
:::

## [walk] Walking：hybrid dynamics、Poincaré map 与 rimless wheel

:::skip
不在快速路线里。做 legged robot 的读；Assignment 8 的 compass gait 与 hopper 依赖这一站。能推出 rimless wheel 的 return map、算出 fixed point 和它的 slope，就可以去第 7 站。
:::

### 不用 motor 也能走

Passive dynamic walker 没有 motor 也没有 controller，放在一个很缓的坡上，只靠 gravity 就能稳定地一步步走下去。它的 gait 是一个 stable 的 limit cycle：被推一下，几步之后回到原来的步态。这里的 stability 不再是“停在一个 fixed point”，而是“回到一条 periodic orbit”。最简单的 model 是 rimless wheel：一个 hub 上均匀装着若干根 rigid leg，mass 全集中在 hub，leg 间的夹角是 $2\alpha$，坡度是 $\gamma$。

假设：leg 着地是 inelastic、瞬时的 collision，只有对着地点的 angular momentum 守恒；stance leg 像 pin joint，不滑；换 leg 是瞬时的，没有 double support。

### 两种 dynamics 交替出现

**Stance。** 一根 leg 着地时，系统就是一根倒置的 pendulum。$\theta$ 是 stance leg 偏离竖直的角度，往下坡方向为正：

$$\ddot\theta=\frac gl\sin\theta$$

刚换完 leg 时 $\theta=\gamma-\alpha$，下一根 leg 在 $\theta=\gamma+\alpha$ 着地。从 $\gamma-\alpha$ 到 $\gamma+\alpha$，hub 下降了 $l\cos(\gamma-\alpha)-l\cos(\gamma+\alpha)=2l\sin\alpha\sin\gamma$，energy 守恒给出着地前一刻的速度：

$$\tfrac12\dot\theta^{-2}=\tfrac12\dot\theta^{+2}+\frac gl\cdot2\sin\alpha\sin\gamma\quad\Longrightarrow\quad\dot\theta^-=\sqrt{\dot\theta^{+2}+4\frac gl\sin\alpha\sin\gamma}$$

$\gamma<\alpha$ 时 hub 一开始在 stance foot 的后上方，要先越过竖直位置，所以初速度要超过阈值

$$\omega_1=\sqrt{2\frac gl\big(1-\cos(\gamma-\alpha)\big)}$$

否则会滚回去。

**Collision。** 着地前一刻 hub 的速度垂直于旧 leg，大小 $l\dot\theta^-$；新 leg 和旧 leg 夹角 $2\alpha$，这个速度在垂直于新 leg 方向上的分量是 $l\dot\theta^-\cos2\alpha$，对新着地点的 angular momentum 是 $ml^2\dot\theta^-\cos2\alpha$。着地后 hub 绕新着地点转，angular momentum 是 $ml^2\dot\theta^+$。两者相等：

$$\dot\theta^+=\dot\theta^-\cos2\alpha$$

沿着新 leg 方向的那部分速度被地面瞬间吃掉，这是每步的 energy loss。

Stance 时是一种连续的 dynamics，collision 时 state 瞬间跳变，再换一种 dynamics。这样的 system 叫 hybrid system。Simulate 时要用 zero-crossing detection 准确找出 collision 的时刻，再施加 reset map。

### Return map 与它的 fixed point

每次 collision 后的速度只由上一次决定。把两段合起来（$\dot\theta^+_n>\omega_1$ 时）：

$$\dot\theta^+_{n+1}=P(\dot\theta^+_n)=\cos2\alpha\sqrt{\dot\theta_n^{+2}+c},\qquad c=4\frac gl\sin\alpha\sin\gamma$$

这样把连续的 trajectory 在每次穿过同一个 surface（这里是 collision）时取一个点、得到的 discrete map，叫 Poincaré map 或 return map。Gait 的 limit cycle 对应 return map 的 fixed point。

令 $P(\omega)=\omega$：$\omega^2=\cos^22\alpha(\omega^2+c)$，$\omega^2(1-\cos^22\alpha)=c\cos^22\alpha$，

$$\omega^*_{roll}=\cot2\alpha\,\sqrt c$$

Stability 看 fixed point 处的 slope：

$$P'(\omega)=\cos2\alpha\frac{\omega}{\sqrt{\omega^2+c}}$$

在 $\omega^*$ 处 $\sqrt{\omega^{*2}+c}=\omega^*/\cos2\alpha$，代进去得 $P'(\omega^*)=\cos^22\alpha<1$。离 fixed point 的偏差每一步乘以 $\cos^22\alpha$，fixed point stable。

用教材的参数算：$\alpha=\pi/8$（8 根 leg）、$\gamma=0.08$、$g=9.8$、$l=1$。$\cos2\alpha=\cos(\pi/4)=0.7071$，$c=4\times9.8\times\sin(\pi/8)\times\sin0.08=4\times9.8\times0.3827\times0.0799=1.1988$。$\cot(\pi/4)=1$，所以 $\omega^*=\sqrt{1.1988}=1.0949$ rad/s。阈值 $\omega_1=\sqrt{19.6\times(1-\cos(0.08-0.3927))}=0.9749$，$\omega^*>\omega_1$，rolling 的 gait 存在。Slope 是 $\cos^2(\pi/4)=0.5$。从 3.0 rad/s 出发：

$$3.0\to2.258\to1.775\to1.474\to1.299\to1.201\to1.149$$

和 1.0949 的差依次是 1.905、1.163、0.680、0.379、0.204、0.106、0.054：越靠近 fixed point，比值越接近 0.5。

::fig[m6821-wheel] 左边是 wheel 往坡下滚，每次 leg 着地速度乘以 0.707；右边是 return map，横轴 $\omega_n$ 是第 $n$ 次 collision 后的 $\dot\theta^+_n$，45° 线和 curve 的交点是 fixed point，折线是从 3.0 出发的 cobweb，彩色点标出当前这一步。

:::wrong Collision 损失 energy，是 walking 不稳定的原因，损失越少越好
在 rimless wheel 上正好相反。Fixed point 处的 slope 是 $\cos^22\alpha$，collision 的损失越少，$\cos2\alpha$ 越接近 1，slope 越接近 1。Leg 很多、$\alpha\to0$ 时 slope $\to1$，偏差每步几乎不缩小，被推一下就很久回不来。$\alpha=\pi/8$ 时每步把偏差减半，正是因为每步吃掉了 $1-\cos^22\alpha=50\%$ 的速度平方。Gravity 补充 energy、collision 耗散 energy，两者在 $\omega^*$ 处平衡；离开 $\omega^*$，耗散随速度增长，把 wheel 拉回来。
:::

:::edge 速度不够和站着不动
$\omega_2<\dot\theta^+<\omega_1$ 时 wheel 越不过竖直位置，往回摆，用后面那根 leg 着地，$\dot\theta^+_{n+1}=-\dot\theta^+_n\cos2\alpha$，速度每步缩小直到停下：$\omega=0$ 是另一个 fixed point（$\gamma<\alpha$ 时存在）。$\dot\theta^+=\omega_1$ 恰好时，wheel 停在 leg 竖直的 unstable equilibrium 上，return map 在这一点没有定义。$\gamma>\alpha$ 时 hub 总在 stance foot 的前方，站不住，只剩 rolling 这一个 fixed point。
:::

### 更复杂的 walker

Compass gait 有两根带 mass 的 leg，swing leg 自己摆动，return map 没有 closed form，fixed point 要靠 numerical 的方法找，stability 由 return map 在 fixed point 处的 Jacobian 的 eigenvalue 是否都在 unit circle 内判断。Assignment 8 的 Exercise 17.1 把找 limit cycle 写成一个 trajectory optimization：初末状态之间的关系由 collision 的 reset map 约束，中间用第 4 站的 direct collocation。

:::back
Stance 时的 dynamics 是[第 1 站](#pend)倒过来的 pendulum，phase portrait 以 upright 为中心。Limit cycle 的 trajectory optimization 用[第 4 站](#trajopt)。
:::

:::from
Passive walker 与 limit cycle 的引入、rimless wheel 的假设、stance dynamics、$\omega_1$、energy 守恒给出的 $\dot\theta^-$、angular momentum 给出的 $\cos2\alpha$、return map 的分段形式、$\omega^*_{roll}$、$\gamma$ 变化时 fixed point 的出现与消失、教材的参数 $\alpha=\pi/8$、$\gamma=0.08$，来自 [教材第 4 章](https://underactuated.csail.mit.edu/simple_legs.html)。Slope $\cos^22\alpha$ 的推导、cobweb 的数、“collision loss 是 stability 的来源”这条 :::wrong，是我自己推的、为这一页算的；hub 下降 $2l\sin\alpha\sin\gamma$ 和垂直分量的 $\cos2\alpha$ 是我补的几何步骤。Compass gait 只看了标题和 Exercise 17.1 notebook 的说明。
:::

## [policy] Policy search：把 controller 的参数直接拿来 optimize

:::skip
快速路线二选一（教材第 11、20 章，或第 17 章 contact，约 2 小时）；做 RL 的读这一站。Policy gradient 的 variance、actor-critic、PPO 在 [Berkeley CS285](../courses/BERKELEY-CS285.html#pg) 里，这里只讲 underactuated 这本书给的那一侧。能写出 $J(K)$、举出 stabilizing $K$ 不 convex 的例子、写出 weight perturbation 的 expected update，就可以去作业。
:::

### 不求 cost-to-go，直接搜 controller

前面每一个 controller 都是先求 cost-to-go 再推出 policy：LQR 先解 Riccati equation 得到 $S$，再算 $K=R^{-1}B^\top S$。另一条路是把 policy 写成带参数的 function $u=\pi_\alpha(x)$，直接对 $\alpha$ 做 optimization：

$$\min_\alpha\ \mathbb E_{x_0\sim\mathcal X_0}\big[J_\alpha(x_0)\big],\qquad J_\alpha(x_0)=\int_0^\infty\ell(x,u)\,dt,\quad u=\pi_\alpha(x)$$

要对初始状态取 expectation，因为一个 policy 在不同初始状态下的表现不同，必须给它们一个权重。这条路的动机是经验上的：很简单的 policy 常常在复杂的机器人上表现很好，即使 cost-to-go 本身很复杂。

### 在 LQR 上看这个 objective 长什么样

用一个完全清楚的问题来看。Linear system $\dot x=Ax+Bu$、policy $u=-Kx$、$x_0\sim\mathcal N(0,\Omega)$。Closed loop 的 solution 是 $x(t)=e^{(A-BK)t}x_0$，cost 是

$$\mathbb E\int_0^\infty x^\top(Q+K^\top RK)x\,dt=\operatorname{tr}\Big((Q+K^\top RK)\,\mathbb E\!\int_0^\infty xx^\top dt\Big)=\operatorname{tr}\big((Q+K^\top RK)X\big)$$

第一步用了 $x^\top Mx=\operatorname{tr}(Mxx^\top)$ 和 trace、integral、expectation 都是 linear 的。$X=\int_0^\infty e^{(A-BK)t}\,\Omega\,e^{(A-BK)^\top t}dt$，$K$ stabilizing 时它是 Lyapunov equation 的唯一解：

$$(A-BK)X+X(A-BK)^\top+\Omega=0$$

对 double integrator（$A=\begin{pmatrix}0&1\\0&0\end{pmatrix}$、$B=\begin{pmatrix}0\\1\end{pmatrix}$、$Q=I$、$R=1$、$\Omega=I$）可以手解。$A-BK=\begin{pmatrix}0&1\\-k_1&-k_2\end{pmatrix}$，设 $X=\begin{pmatrix}x_1&x_2\\x_2&x_3\end{pmatrix}$，$(A-BK)X=\begin{pmatrix}x_2&x_3\\-k_1x_1-k_2x_2&-k_1x_2-k_2x_3\end{pmatrix}$，加上它的 transpose 再加 $I$，逐项为 0：

- $(1,1)$：$2x_2+1=0$，$x_2=-\tfrac12$；
- $(2,2)$：$2(-k_1x_2-k_2x_3)+1=0$，即 $k_1-2k_2x_3+1=0$，$x_3=\dfrac{k_1+1}{2k_2}$；
- $(1,2)$：$x_3-k_1x_1-k_2x_2=0$，$x_1=\dfrac{x_3+k_2/2}{k_1}=\dfrac{k_1+1+k_2^2}{2k_1k_2}$。

$\operatorname{tr}((Q+K^\top K)X)=x_1+x_3+k_1^2x_1+2k_1k_2x_2+k_2^2x_3$，代入 $x_2=-\tfrac12$：

$$J(k_1,k_2)=(1+k_1^2)\frac{k_1+1+k_2^2}{2k_1k_2}+(1+k_2^2)\frac{k_1+1}{2k_2}-k_1k_2$$

检验：$K=(2,1)$ 时 $x_1=1$、$x_3=\tfrac32$，$J=5\times1+2\times\tfrac32-2=6$。$K=(1,\sqrt3)$（Riccati 的答案）时 $x_1=\frac{5}{2\sqrt3}$、$x_3=\frac{1}{\sqrt3}$，$J=\frac{5}{\sqrt3}+\frac{4}{\sqrt3}-\sqrt3=2\sqrt3=3.464$，等于 $\operatorname{tr}(S)$，和 Riccati 的结果一致。$k_1\le0$ 或 $k_2\le0$ 时 closed loop 不 stable，$J=\infty$。

### Nonconvex，却没有 bad local minimum

Stabilizing 的 $K$ 组成的 set 可以不 convex。教材给的例子是 discrete time、$A=B=I_{3\times3}$，

$$K_1=\begin{pmatrix}1&0&-10\\-1&1&0\\0&0&1\end{pmatrix},\qquad K_2=\begin{pmatrix}1&-10&0\\0&1&0\\-1&0&1\end{pmatrix}$$

$I-K_1=\begin{pmatrix}0&0&10\\1&0&0\\0&0&0\end{pmatrix}$，它的 characteristic polynomial 是 $\lambda^3$，三个 eigenvalue 都是 0，在 unit circle 内；$K_2$ 同理。取平均，$I-\tfrac12(K_1+K_2)=\begin{pmatrix}0&5&5\\0.5&0&0\\0.5&0&0\end{pmatrix}$，characteristic polynomial 是 $\lambda^3-5\lambda$，eigenvalue 是 $0,\pm\sqrt5=\pm2.236$，在 unit circle 外。两个 stabilizing 的 $K$ 连线的中点不 stabilizing，所以 set 不 convex，$J(K)$ 也不 convex。

但 convex 只是“没有 bad local minimum”的充分条件。Fazel 等人证明了这个 LQR objective 的所有 local minimum 都是 global 的；后来的工作用 Polyak–Łojasiewicz inequality 给出了更简单的证明和收敛速度：在 cost 的每个 sublevel set 上，$\tfrac12\|\nabla J\|^2\ge\mu\,(J-J^*)$。gradient 为 0 的点左边为 0，于是右边也为 0，$J=J^*$。

True gradient 也能算：

$$\frac{\partial J}{\partial K}=2\big(RK-B^\top P\big)X,\qquad(A-BK)^\top P+P(A-BK)+Q+K^\top RK=0$$

从 $K=(0.4,4)$ 出发、step 0.03 做 300 步 gradient descent，到达 $(1.012,1.759)$，$J=3.4644$，离 $J^*=3.4641$ 只差 $3\times10^{-4}$。教材的态度很明确：model 已知时直接解 Riccati equation 更快、更 robust，没有 step size 要调；gradient descent 值得研究，是因为它是“没有 model、gradient 只能从 sample 估计”时的模型。

::fig[m6821-policy] 灰线是 $J(k_1,k_2)$ 的 level set。彩色是 true gradient 的路径，灰色是 weight perturbation 的路径，两者从同一点出发。

### 没有 model：weight perturbation 与 REINFORCE

没有 model 时只能 evaluate $J$（跑一次 rollout），不能求 derivative。Finite difference 每一步要 $n+1$ 次 evaluation。Weight perturbation 每步只多一次：随机扰动 $\beta$，每个分量独立、mean 0、variance $\sigma^2$，

$$\Delta\alpha=-\frac{\eta}{\sigma^2}\big[J(\alpha+\beta)-J(\alpha)\big]\beta$$

Cost 变小就往 $\beta$ 的方向走，变大就往反方向走。取 expectation：$\beta$ 小时 $J(\alpha+\beta)-J(\alpha)\approx\nabla J^\top\beta$，

$$\mathbb E[\Delta\alpha]\approx-\frac{\eta}{\sigma^2}\mathbb E[\beta\beta^\top]\nabla J=-\frac{\eta}{\sigma^2}\sigma^2I\,\nabla J=-\eta\nabla J$$

平均来说就是 gradient descent。$J(\alpha)$ 换成任何与 $\beta$ 无关的 baseline $b$，expectation 不变，因为 $\mathbb E[(J(\alpha)-b)\beta]=(J(\alpha)-b)\,\mathbb E[\beta]=0$；baseline 改变的是 variance。

图里灰色那条用 $\sigma=0.05$、$\eta=0.03$（和 gradient descent 一样）跑了 300 步，到达 $(1.027,1.778)$，$J=3.4651$：路径更抖，但走到了同一个地方。每一步它只用了两次 $J$ 的 evaluation，没有用 model。

这和 RL 里的 REINFORCE 是同一件事。REINFORCE 用 $\nabla_\alpha\mathbb E[g(x)]=\mathbb E[g(x)\nabla_\alpha\log p_\alpha(x)]$。取 $x=\alpha+\beta$、$\beta\sim\mathcal N(0,\sigma^2I)$，$\log p_\alpha(x)=-\frac{\|x-\alpha\|^2}{2\sigma^2}+\text{const}$，$\nabla_\alpha\log p_\alpha(x)=\frac{x-\alpha}{\sigma^2}=\frac{\beta}{\sigma^2}$。只用一个 sample，update 是

$$\Delta\alpha=-\frac{\eta}{\sigma^2}\,g(\alpha+\beta)\,\beta$$

正是 $b=0$ 的 weight perturbation。它平均来说沿 gradient 走，但 variance 很大，所以实际要用很多 sample 和好的 baseline。

:::wrong Objective 不 convex，gradient descent 就会卡在 local minimum
LQR 是反例：stabilizing 的 set 都不 convex，却没有 bad local minimum。反过来也不能乐观：教材指出 static output feedback（policy 只能看到部分 state）就是已知的、在原参数里 nonconvex 且没有 smooth 的变量替换能变 convex 的情形，还有一个只有两个 state 的 MDP 反例。Deep network 的 policy 属于哪一类，教材列为开放问题。判断一个 policy search 问题好不好做，要看 landscape 有没有 PL 这样的性质，convex 与否说明不了。
:::

:::back
$S$、$K=(1,\sqrt3)$ 与 Lyapunov equation 来自[第 3 站](#lqr)和[第 5 站](#lyap)。Policy gradient 的 variance、baseline 的最优取法、PPO 见 [Berkeley CS285](../courses/BERKELEY-CS285.html#pg)；log-derivative trick 的推导见 [CS4246](../courses/CS4246.html#pg)。
:::

:::from
Problem formulation、对初始状态取 expectation 的理由、$J(K)=\operatorname{tr}((Q+K^\top RK)X)$ 与 Lyapunov equation、Fazel 的 3 维例子、“all local optima are global”与 PL inequality、true gradient 的公式、“model 已知时用 Riccati 更好”，来自 [教材第 11 章](https://underactuated.csail.mit.edu/policy_search.html)；static output feedback 与两状态 MDP 反例也在这一章。Finite difference 的代价、weight perturbation 的 update 与 expectation、baseline 不改变 expectation、REINFORCE 等于 $b=0$ 的 weight perturbation，来自 [第 20 章](https://underactuated.csail.mit.edu/rl_policy_search.html)。Double integrator 的 $J(k_1,k_2)$ closed form、两个检验、eigenvalue 的手算、两条路径的数，是我推的、为这一页算的。
:::

## 作业

Spring 2024 有 10 份 assignment，每份由教材的章末 exercise 组成，在 Gradescope 上交：written 部分交一个 PDF，coding 部分交 notebook（`.ipynb`，不要压缩），notebook 末尾有 autograding cell，Gradescope 大约一分钟出分，截止前可以无限次重交（来源：各 set 页面）。我读到了 set 1、2、3、4、5、8、9、10，set 6、7 的页面没有找到；按题号推断，第 10 章的几个编程 exercise 应该在这两份里，下面单列。题号按 Spring 2024 的编号；第 2、3、10 章的题目内容和教材现在的编号对得上，第 9 章是按现在教材里 exercise 的顺序推断的，没有逐题核对。

所有 notebook 都在 CPU 上跑，不需要 GPU。2024 年课程用 Deepnote；现在仓库里的 notebook 第一个 cell 会在 Colab 上 `pip install "underactuated[all]>=2026.9.8"`，免费 Colab 够用。时间都是我的估计，handout 没有给。

**环境。**
- Colab 上的 Meshcat：运行 `StartMeshcat()` 之后点 “Open Meshcat in a separate window”，notebook 要一直开着；想嵌在 cell 旁边用 `DisplayMeshcat(meshcat)`。（来源：教材附录 A。）
- 本地安装：`python -m pip install "underactuated[all]" jupyterlab`，只支持 Mac 和 Ubuntu 的最近两个版本、系统默认的 Python；Windows 要用 WSL。（来源：附录 A；WSL 一条见 [MIT 6.4210 页的环境说明](../courses/MIT-6.4210.html)。）
- Notebook 跑不起来先查教材仓库的 GitHub issues。（来源：附录 A。）
- Notebook 的文件名必须和 handout 一致，autograder 按名字找。（来源：set 1 页面。）

### Assignment 1：Drake 入门、stability 与 feedback cancellation（先做）

**要做什么。** Exercise 1.2、1.3（written，第 1 章）；1.5（`drake_systems.ipynb`，用 Drake 的 `System` 写一个 dynamical system）；2.4 Attractivity vs Stability（一个二维 system，找 equilibrium 并判断 attractive 和 stable i.s.L.，再说出它是本章哪个 system 的近亲）；2.5 Pendulum with Vibrating Base（先给一个唯一 equilibrium 在 $q=1$ 且 stable 的 $\dot q=f(q)$，再用 feedback cancellation 让 base 水平振动的 pendulum 以 $\dot\theta=1$ 匀速转，在 `vibrating_pendulum.ipynb` 里实现）。共 35 分。

**做完会什么。** 第 1 站全部，以及 Drake 的 `LeafSystem`、`DiagramBuilder`、`Simulator` 这一套写法，后面每份作业都建立在上面。

**时间与算力。** 估计 5 到 8 小时，一半花在 Drake 的写法上。CPU。

**提示。**
- 2.4 那个 system 的形式看起来复杂，先换成 polar 坐标再看，再用 notebook 从你找到的 equilibrium 出发 simulate 核对。（来源：前半是经验，后半是题面的要求。）
- 2.5 的 equation of motion 里 kinetic energy 显含时间，handout 提醒自己用 Lagrangian 推一遍时要小心；feedback cancellation 的写法照第 1 章 double pendulum 那个例子，把 base 振动的项和 gravity 一起消掉，再接上 (a) 里的 $f$。（来源：Exercise 2.5 题面与第 1 章。）
- 2.5 的 notebook 被 handout 称为“以后做 Drake project 的好起点”，值得读懂它的结构。（来源：Exercise 2.5 题面。）

### Assignment 2：Dynamic programming 与 LQR on a Drake Diagram（值得做）

**要做什么。** 第 7 章 dynamic programming 的 7.4、7.5、7.8（written）、7.5(c) `minimum_time.ipynb`、7.6 `lp_dp.ipynb`；第 8 章的 8.1 `drake_diagrams.ipynb`：搭一个 double integrator 加 low-pass filter actuator 的 Diagram，在 $q_0=1.2$ 这个 fixed point 处设计 LQR。共 43 分。第 7 章这一页没有讲，我也没有读那一章。

**做完会什么。** 8.1 让你在 Drake 里对任意 Diagram 调 `LinearQuadraticRegulator`，后面 cart-pole 和 trajectory stabilization 都这样做。

**时间与算力。** 8.1 估计 2 到 3 小时；第 7 章的题我没读，估不了。CPU。

**提示。**
- 整个 Diagram 要在一个 cell 里搭：System 加进 Diagram 之后归 Diagram 所有，不能再加进另一个 Diagram。用 `AddNamedSystem` 命名，`plot_system_graphviz` 画出来检查连线。（来源：`drake_diagrams.ipynb`。）
- Nominal state 必须是 fixed point，通过设置 Diagram 的 `Context` 传给 `LinearQuadraticRegulator`；actuator 的 state 也要设（$x_0=0$）。（来源：同上。）
- Autograder 检查 `double_integrator`、`actuator_model`、`diagram`、`diagram_context`、`controller` 这几个变量名，不要改名。（来源：同上。）

### Assignment 3：Cart-pole 的 linearization、URDF 与 controllability（先做）

**要做什么。** 7.1（written）；3.1 `cartpole_balancing.ipynb`：写出 cart-pole 的 state-space dynamics，在 upright linearize，比较六个 state 上的 linearization error，判断 LQR 能从哪几个 state 回来；3.2 `cartpoles_urdf.ipynb`：写 single cart-pole 的 URDF，再扩展成 double pendulum 的 cart-pole 并用 LQR 控制；3.3 Controllability：discrete double integrator 的 grid world，以及四对 $(A,B)$ 的 controllability 与 underactuation。共 49 分。

**做完会什么。** 第 3 站全部，外加自己写 URDF 让 Drake 读进来。

**时间与算力。** 估计 6 到 10 小时，3.2 的 URDF 最花时间。CPU。

**提示。**
- 3.1 的参数是 $m_c=m_p=l=1$、$g=9.81$，不要改也不要四舍五入，否则 autograder 报错；$\pi$ 一律写 `np.pi`，不要写 3.14。（来源：`cartpole_balancing.ipynb`。）
- 3.1 的 $A_{lin}$、$B_{lin}$ 按第 3 站的公式算；做完可以用 notebook 里藏着的 `cartpole_lin.A()`、`cartpole_lin.B()`（Drake 的 `Linearize` 给的）核对。（来源：同上。）
- Notebook 里有几个不计分的问题，例如“为什么 $0.9\pi$ 加 $u=-10$ 的 error 比 $0.85\pi$ 不加 $u$ 的还大”，答案就在 linearization 对 $u$ 的依赖里，值得想清楚再判断哪些 state 能回来。（来源：同上；“值得想”是经验。）
- 3.3 判断 controllability 只需要定义；第 3 章有一节可展开的通用工具，handout 说对第四对 $(A_4,B_4)$ 特别有用。判断 underactuated 时要把 system 理解成 $x=(q,\dot q)$ 的 second-order system。（来源：Exercise 3.3 题面。）

### Assignment 4、5：Lyapunov 分析与 SOS（有余力再做，做 verification 的先做）

**要做什么。** Assignment 4：7.7 `pendulum_cvi.ipynb`（第 7 章，没读），9.1、9.3、9.5、9.6（written）：global stability 的 Lyapunov function、Lyapunov function 是否唯一、instability 与 barrier function、converse theorem。共 23 分。Assignment 5：9.2 invariant set 与 ROA 的判断题、9.4 证明 global asymptotic stability、9.10 用 SOS 估计 time-reversed Van der Pol 的 ROA（`van_der_pol.ipynb`，三种 formulation：带 line search 的、一次 SOS 直接最大化面积的、减少 constraint 的改进版）、9.11 pendulum energy shaping 的 robustness。共 36 分。

**做完会什么。** 第 5 站全部，以及把 Lyapunov 条件写成 SOS program 交给 solver。

**时间与算力。** 两份合计估计 10 到 15 小时，written 题的证明占大头。CPU；SOS program 用 Drake 的 `MathematicalProgram` 写。

**提示。**
- 9.10 第一种 formulation 对 $\rho$ 做 line search，原因是 $\rho$ 和 multiplier 的系数相乘是 bilinear 的，固定 $\rho$ 才是 convex。（来源：第 9 章。）
- 9.11 是第 2 站“不需要知道 mass”那一节的严格版本。先把 controller 里的 $\tilde E$ 用估计的参数 $m_i,l_i,g_i$ 写出来，再算 $V=\tfrac12\tilde E^2$ 的 $\dot V$，看哪些 factor 消得掉；(d) 给的 small-oscillation period 正好固定了 $l/g$。（来源：经验，依据第 2 章的 robustness 讨论与题面。）
- 9.2 这类判断题，把题目给的条件和第 5 站 sublevel set 那个定理的条件逐条对照，看缺了哪一条。（来源：经验。）

### 第 10 章的编程 exercise：shooting vs transcription、orbital transfer、iLQR（先做）

**要做什么。** 10.1 `shooting_vs_transcription.ipynb`：分析 direct shooting 的 conditioning，补完 direct transcription，验证它的 cost-to-go 随 horizon 收敛到 LQR，再实现 Riccati recursion 来解 transcription 底下的 linear algebra。10.2 `orbital_transfer.ipynb`：用 nonlinear trajectory optimization 让火箭从地球到火星，加 thrust、velocity 上限和小行星的 collision constraint，以 fuel 为 objective。10.3 读 Nganga 2021 的前两节回答 iLQR 的概念题。10.4 `ilqr_driving.ipynb`：从零实现 iLQR，在一辆车绕圆的轨迹上测试。Spring 2024 的 set 10 还有 10.5（differential flatness，这一页没讲）。

**做完会什么。** 第 4 站全部。做 legged、manipulation 的 MPC 时，底下就是这几样东西。

**时间与算力。** 10.1 估计 3 到 4 小时，10.4 估计 4 到 6 小时，10.2 估计 3 小时。CPU。

**提示。**
- 10.1 的 benchmark 是 $h=0.5$ 的 Euler 离散 inverted pendulum，要你交 `N_max = 45` 个 $\log_2\operatorname{cond}$；第 4 站用的是 $h=0.1$，数字不同，但增长率的来源一样：每步约 $2\log_2$ 乘以 $A$ 的最大 eigenvalue 的绝对值。（来源：notebook；增长率的解释是经验。）
- 10.1 的 KKT matrix 是 banded 的，用 `scipy.sparse` 和 `spsolve` 解；Riccati recursion 那部分就是第 3 站的 discrete-time 公式。（来源：notebook。）
- 10.4 先在 linear dynamics 加 quadratic cost 上测：这时 backward pass 就是 LQR，$\alpha=1$ 的一次 iteration 应该直接到最优，否则就说明 backward pass 有 bug。（来源：经验。）
- 10.4 的 notebook 给了 expected cost reduction 的公式，用它和实际下降量比较，判断 quadratic approximation 准不准、要不要调 regularization；cost 不降时拒绝这一步并增大 $Q_{uu}$ 上的 regularization，降了就减小。（来源：notebook 的 Main Loop 一节。）
- 10.4 的收敛图应该是 superlinear 的；开着 regularization 时前几个 iteration 会慢一些，这是正常的。（来源：notebook 的 Convergence Analysis。）

### Assignment 8：Hopper、compass gait 的 limit cycle（做 legged 的先做）

**要做什么。** 4.1 `one_d_hopper.ipynb`：照 Raibert 的思路实现一维 hopper，写 total mechanical energy 和一个 `LeafSystem` controller，每次读 state、给出 spring 的 preload，让它跳到指定高度；17.1 `compass_gait_limit_cycle.ipynb`：把找 passive compass gait 的 limit cycle 写成 trajectory optimization；B.1（附录，written）。共 40 分。

**做完会什么。** 第 6 站，加上在 Drake 里写带 contact constraint 的 `MathematicalProgram`。

**时间与算力。** 估计 8 到 12 小时，17.1 的调试最费时。CPU。

**提示。**
- 17.1 修改了任何 constraint，都要从初始化 `MathematicalProgram` 的那个 cell 开始重跑，否则同一个 constraint 会被加两次。（来源：notebook 的 Troubleshooting。）
- Decision variable 是 `symbolic.Variable`，不能直接传给 `MultibodyPlant` 的 `CalcMassMatrix` 之类的函数；要写一个接受 float 或 `AutoDiffXd` 的 Python function，再把它作为 constraint 加进去。（来源：notebook。）
- Initial guess：time step 取上限 `h_max`，configuration 在 `q0_guess` 和 `-q0_guess` 之间线性插值；求完先看 `result.is_success()`。（来源：notebook。）
- 这个 notebook 不用 `MultibodyPlant` 做 simulation：swing foot 在地面高度滑动时，任何好的 simulator 都会检测到 collision 并加 friction（scuffing）。（来源：notebook。）

### Assignment 9、10：Footstep planning（有余力再做）

**要做什么。** Set 9 是 5.2（26 分，written PDF）；set 10 是 5.3 加 10.5，notebook 是 `footstep_planning_gcs.ipynb`。第 5 章（humanoids）这一页没讲，我也没有读，只知道 notebook 用 Graphs of Convex Sets 做 footstep planning。

**时间与算力。** 无法估计。CPU。

**提示。**
- 我没有读到这两份的具体提示。GCS 的思路见 [MIT 6.4210 第 5 站](../courses/MIT-6.4210.html#plan)。
