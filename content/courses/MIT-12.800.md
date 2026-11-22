---
code: MIT-12.800
evidence: syllabus
evidenceNote: "外校公开课，不是 NUS 课：MIT 12.800 Fluid Dynamics of the Atmosphere and Ocean（James Hansen，Fall 2004，研究生一年级，OCW 版）。分站按 OCW 上 24 讲的课表：kinematics、conservation laws 与 Navier–Stokes、Boussinesq、vorticity 与 circulation，然后进入 rotating frame、Ekman layer、shallow water 与 potential vorticity、gravity 与 Kelvin wave、Rossby wave。读了 OCW 的课程主页、syllabus、lecture notes 列表，lecture2、3、4、5、6、8、9、10、11、12、13、15、16、18、19、20、21、22 这些 PDF 和 final review，Problem Sets 1 到 8（Set 9 的 PDF 没有可读文字）和 waves primer。读法是 WebFetch 逐节复述，不是逐字原文；PDF 里有些公式被抽取成乱码，复述里标了出来，凡是用到的都自己重推过。OCW 上 PDF 的编号和课表的讲次不完全对齐（例如 lecture6.pdf 讲的是课表第 5 讲的 Reynolds transport theorem），下文按 PDF 文件名称呼。Lecture1、7、14、17 和 Jim Price 的 Lagrangian/Eulerian essay 没有读到（7 的 PDF 地址取不到，essay 抓取失败）。Rotation、geostrophy、Ekman transport、Sverdrup 与 ENSO 的基础在 SIO-210 页已经讲过，这里只链接过去。Geostrophic adjustment、Poincaré wave、Ekman layer 的整体理论另读了 Vallis 在 Exeter 的 GFD 讲义第 1 到 5 章；bottom Ekman layer 与 Ekman pumping 读了 MIT 1.63 讲义第 7.5 节。"
exam: "OCW 的 syllabus：problem sets 约 60%，midterm 与 final 合计约 40%；每周课前有很短的 quiz（几道判断题加一两道小计算），通常不计分，只在分数卡在边界时参考。OCW 没有公开考题和答案。NUS 没有对应的考核。"
subskills:
  - id: kin
    name: Kinematics：Lagrangian、Eulerian 与 velocity gradient
    l3: "能写出 material derivative，能对一个给定的 velocity field 求 streamline，并算出某一点的 strain rate 和 vorticity。"
    l4: "能独立对 unsteady flow 分别求 streamline、pathline、streakline，把 velocity gradient tensor 分解成 strain 和 rotation，并用 SVD 找出增长最快的 perturbation。"
    l5: "能用 Couette flow 和 point vortex 说明“streamline 弯不弯”和“fluid 转不转”是两回事，并解释 eigenvector 为什么不是增长最快的方向。"
  - id: cons
    name: Conservation laws 与 Navier–Stokes
    l3: "能由 Reynolds transport theorem 写出 continuity equation，能套用 Bernoulli 算 Pitot tube 的流速。"
    l4: "能独立从 stress tensor 和 Newtonian constitutive relation 推出 Navier–Stokes 的每一项，解出 Couette flow，并把 continuity 与 Bernoulli 合起来算容器漏空的时间。"
    l5: "能说清 Bernoulli 在什么条件下沿 streamline 成立、在什么条件下处处成立，并用 solid-body rotation 的 pressure 说明它失效的方式。"
  - id: bous
    name: Boussinesq approximation 与 hydrostatic balance
    l3: "能写出 Boussinesq equations 和 buoyancy 的定义，算出 thermocline 的 N 和振荡周期。"
    l4: "能独立从 full equations 推出 Boussinesq 形式，说明每一步丢掉的项有多小，并用 (H/L)² 判断 hydrostatic 是否成立。"
    l5: "能解释为什么 density 只差千分之几却不能在 gravity 项里丢掉，以及 atmosphere 为什么要改用 potential temperature 判断 stability。"
  - id: vort
    name: Vorticity、circulation 与 Kelvin's theorem
    l3: "能算 solid-body rotation 和 point vortex 的 vorticity 与 circulation，并写出两个 point vortex 互相推动的速度。"
    l4: "能独立证明 Kelvin's circulation theorem，指出它的三个条件，用 baroclinic 项算出 sea breeze 的 circulation 增长率，并推出 vorticity equation 里的 stretching 与 tilting。"
    l5: "能用 image vortex 解出 vortex pair 撞墙的轨迹，并说明 irrotational 与“没有 viscous stress”为什么互不蕴含。"
  - id: rot
    name: Rotating frame 里的 balance：Taylor–Proudman、thermal wind、gradient wind
    l3: "能用 absolute circulation 守恒算出一圈 fluid 收缩后的 relative vorticity，能写出 Taylor–Proudman 和 thermal wind 的式子。"
    l4: "能独立由 vorticity equation 推出 Taylor–Proudman 与 thermal wind，由 temperature 的分布算出 geostrophic wind 随高度的变化，并解 gradient wind 与 cyclostrophic balance。"
    l5: "能解释 Taylor column 为什么出现，以及 high pressure 中心为什么只能有很弱的 pressure gradient。"
  - id: ekman
    name: Ekman layer 与 spin-down
    l3: "能写出 Ekman layer 的厚度 δ = √(2ν/f)，并说出它和不转时 boundary layer 的区别。"
    l4: "能独立解出 geostrophic interior 下面的 bottom Ekman layer，算出 Ekman pumping w = δζ/2，并由此推出 spin-down time。"
    l5: "能说明 1 mm 厚的 layer 为什么能在几分钟里刹住 20 cm 深的水，以及 spin-down time 与 diffusion time 之比为什么是 H/δ。"
  - id: sw
    name: Shallow water equations 与 potential vorticity
    l3: "能写出 shallow water equations，并用 (ζ + f)/h 算出一根 column 越过 seamount 时的 relative vorticity。"
    l4: "能独立从 hydrostatic balance 和 continuity 推出 shallow water equations，再用 cross-differentiation 推出 potential vorticity 守恒。"
    l5: "能说明 PV 守恒为什么把 flow 约束在 f/h 的等值线上，以及它和 Kelvin's circulation theorem 的关系。"
  - id: grav
    name: Gravity wave、geostrophic adjustment 与 Kelvin wave
    l3: "能写出 Poincaré wave 的 dispersion relation，算出 deformation radius，并说出 Kelvin wave 往哪个方向走。"
    l4: "能独立求出 rotating shallow water 的三支 dispersion relation，用 linearized PV 解出 step 的 adjustment 终态，并推出 Kelvin wave 的结构。"
    l5: "能用 energy 说明 adjustment 为什么只释放三分之一的 potential energy 给 jet，以及 deformation radius 为什么同时出现在 adjustment、Kelvin wave 和 Rossby wave 里。"
  - id: rossby
    name: Rossby wave
    l3: "能写出 barotropic Rossby wave 的 dispersion relation，说出 phase 为什么总往西。"
    l4: "能独立由 β-plane 上的 vorticity equation 和 shallow water PV 推出两种 dispersion relation，算出 stationary wavelength、phase speed 和 group velocity。"
    l5: "能用 material line 的位移解释 westward propagation，并说明 short wave 的 energy 为什么往东走。"
open:
  - label: "MIT 12.800 Fluid Dynamics of the Atmosphere and Ocean（James Hansen，Fall 2004）OCW 课程主页、syllabus 与 lecture notes 列表"
    url: "https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/pages/lecture-notes/"
    note: "全页的路线：24 讲的课表、评分方式、教材（Kundu & Cohen、Cushman-Roisin）。"
  - label: "MIT 12.800 lecture2–lecture6.pdf：maths review、scale analysis、Eulerian 与 Lagrangian、Cauchy–Stokes decomposition、velocity gradient tensor、linear propagator 与 SVD、Reynolds transport theorem、continuity"
    url: "https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/6142530d9f014a620eddacc06da975b6_lecture5.pdf"
    note: "第 1、2 站。lecture5.pdf 的 u = x²y、v = 2xy² 例题和 propagator M 的数值来自这里。"
  - label: "MIT 12.800 lecture8–lecture10.pdf：constitutive relation、Navier–Stokes、Boussinesq、energy 与 heat equation、potential temperature、Bernoulli 与 potential flow"
    url: "https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/d510167bc5ccee175ad6d6345039892a_lecture8.pdf"
    note: "第 2、3 站。"
  - label: "MIT 12.800 lecture11–lecture13.pdf：equations 汇总、vorticity 与 circulation、solid-body 与 point vortex、point vortex 的运动与 method of images、Kelvin 与 Helmholtz、vorticity equation"
    url: "https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/742b3656764a3d3a60d91f7d7ddd539c_lecture12.pdf"
    note: "第 4 站。"
  - label: "MIT 12.800 lecture15、16、18、19.pdf：rotating frame 的 curvature 项与 Kelvin's theorem、f-plane 与 β-plane、geostrophy、gradient wind、Taylor–Proudman、thermal wind、Ekman layer 与 pumping、Sverdrup"
    url: "https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/a23d92d6e97a2f2765c2064939a30b2c_lecture18.pdf"
    note: "第 5、6 站。"
  - label: "MIT 12.800 lecture20–lecture22.pdf 与 final review：Rossby wave、shallow water equations 与 PV、QG Rossby wave、gravity 与 Poincaré wave、Kelvin wave、delayed oscillator"
    url: "https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/123387888816ae1352049141db64a789_finalreview.pdf"
    note: "第 7 到 9 站，以及全课的公式清单。"
  - label: "MIT 12.800 Problem Sets 1–8 与 waves primer"
    url: "https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/pages/assignments/"
    note: "各站的 :::note 例题：Set 2（u = y、v = x 与 Couette flow）、Set 3（SVD）、Set 5（半球形容器漏水）、Set 6（point vortex 撞墙）、Set 7（70°N 绕地球的空气）、Set 8（thermal wind）。"
  - label: "Geoffrey K. Vallis, Geophysical Fluid Dynamics lecture notes（University of Exeter ECMM719）第 1–5 章"
    url: "https://empslocal.ex.ac.uk/people/staff/gv219/ecmm719/lecnotes18w.pdf"
    note: "第 3 站的 Boussinesq 数量级与 hydrostatic scaling，第 7 站的 shallow water 推导，第 8 站的 Poincaré、Kelvin wave 与 geostrophic adjustment 的解和 energy，第 9 站有限 deformation radius 的 Rossby wave，第 6 站的 eddy viscosity 数值。按 10 万字符一段读工具的详细复述。"
  - label: "MIT 1.63 Advanced Fluid Dynamics of the Environment（Chiang C. Mei）讲义第 7.5 节：Ekman layers"
    url: "https://ocw.mit.edu/courses/1-63-advanced-fluid-dynamics-of-the-environment-fall-2002/5eb39d252373555793e9410457c327ea_75cyclone.pdf"
    note: "第 6 站 bottom Ekman layer 的解和 w = δζ/2。"
sources:
  - label: "Socrates：SIO-210 物理海洋学导论（rotation、geostrophy、Ekman transport、Sverdrup、equatorial wave 与 ENSO）"
    url: "../courses/SIO-210.html"
---

先看三件事。每一件都和不转的 fluid dynamics 给出的预期差了一个量级以上。

**第一件。** 一个 20 cm 深的水槽放在转台上，转台以 $\Omega=0.5$ rad/s 转，水早已跟着一起转。把转台稍微加快一点，水要多久跟上？水跟上转台靠的是底部 friction，momentum 要靠 viscosity 从底部一层层往上传。水的 kinematic viscosity 是 $\nu=10^{-6}$ m²/s，传过 $H=0.2$ m 的时间尺度是 $H^2/\nu=4\times10^4$ s，约 11 h；即使只看衰减最快的那个 diffusive mode，$4H^2/(\pi^2\nu)$ 也要 4.5 h。实验里水几分钟就跟上了。

::fig[mit-12.800-spinup0] 左边是实验装置。右边两条线是水相对 tank 的转动随时间的衰减：虚线只靠 viscous diffusion，彩线是第 6 站的结果。

**第二件。** 海里一个 thermocline 的台阶：左边比右边深，交界处陡然一跳。不转时，这个台阶会以 gravity wave 向两边散开，最后整个 interface 变平，所有 potential energy 都被 wave 带走。在一个转动的星球上，台阶只在交界附近几十 km 的范围里变缓，两边远处一动不动，交界处留下一条稳定的 current。

::fig[mit-12.800-adjust0] 同一个初始台阶。左边不转，最后完全平了；右边转，最后停在一个只变缓了一小段的状态，第 8 站算出这条曲线。

**第三件。** 45°N 上空的 westerly 以约 15 m/s 往东吹，空气走一圈只要 22 天。但叠在这股 westerly 上、wavelength 约 6000 km 的弯曲，可以一连几天停在原地不动：空气从它中间穿过去，形状却不跟着走。

::fig[mit-12.800-west0] 风往东吹，波形不动。第 9 站会说明：这种波本身有往西走的速度，wavelength 恰好为 6049 km 时，往西的速度正好抵消 15 m/s 的风。

三件事的共同原因是：atmosphere 和 ocean 是转动星球上一层被 density 分了层的薄 fluid。这门课先把一般的 fluid dynamics 建起来（第 1 到 4 站：怎样描述运动、守恒律给出什么 equation、density 只差千分之几时怎样简化、vorticity 怎样产生和守恒），然后加上 rotation（第 5 到 9 站）。加上 rotation 以后，最重要的量不再是 velocity，而是 vorticity 和它的守恒形式 potential vorticity；全课的后半段几乎每一个结果都是某种 vorticity 守恒的推论。

| 站 | 讲什么 | 开头哪件事在这里解释 |
|---|---|---|
| 1 | 怎样描述一个 flow：Eulerian、Lagrangian、velocity gradient | |
| 2 | Mass、momentum 守恒，Navier–Stokes，Bernoulli | |
| 3 | Boussinesq approximation、buoyancy、hydrostatic | |
| 4 | Vorticity、circulation、Kelvin's theorem | |
| 5 | Rotating frame：Taylor–Proudman、thermal wind、gradient wind | |
| 6 | Ekman layer 与 spin-down | 第一件 |
| 7 | Shallow water equations 与 potential vorticity | |
| 8 | Gravity wave、geostrophic adjustment、Kelvin wave | 第二件 |
| 9 | Rossby wave | 第三件 |

Rotating frame 的推导、Coriolis parameter、inertial oscillation、geostrophic balance、ocean 里的 thermal wind、surface Ekman transport、Sverdrup balance 和 equatorial wave 在 [SIO-210 物理 ocean 学导论](../courses/SIO-210.html)里已经从头讲过，这一页用到时直接链接过去，只补 12.800 讲法不同或 SIO-210 没有讲的部分。

## [kin] Kinematics：Lagrangian、Eulerian 与 velocity gradient

:::skip
能写出 material derivative 并说出每一项的意思，能对 unsteady flow 分别求出 streamline、pathline、streakline，能把一个 velocity gradient 拆成 strain rate 和 rotation rate，就可以去第 2 站。
:::

### 两种描述，一个 operator

描述一个 flow 有两种办法。Lagrangian 的办法是给每个 fluid particle 起名字（通常用它在 $t=0$ 时的位置 $\mathbf x_0$），然后写出它的轨迹 $\mathbf x(\mathbf x_0,t)$。Eulerian 的办法是在固定的点上记录经过那里的 velocity $\mathbf u(\mathbf x,t)$。浮标、drifter 给的是前一种，系泊的 current meter、气象站和几乎所有数值模式给的是后一种。

物理定律是对 particle 说的：Newton's law 管的是同一块 fluid 的 acceleration，热力学管的是同一块 fluid 的 temperature 变化。可是手里的数据是 Eulerian 的。所以第一件事是：已知 Eulerian 的场 $T(\mathbf x,t)$，求一个 particle 感受到的变化率。

Particle 在 $t$ 时刻位于 $\mathbf x(t)$，它的 temperature 是 $T(\mathbf x(t),t)$。对 $t$ 求 derivative，用 chain rule：

$$\frac{d}{dt}T(x(t),y(t),z(t),t)=\frac{\partial T}{\partial t}+\frac{dx}{dt}\frac{\partial T}{\partial x}+\frac{dy}{dt}\frac{\partial T}{\partial y}+\frac{dz}{dt}\frac{\partial T}{\partial z}$$

$d\mathbf x/dt$ 就是 particle 所在处的 velocity $\mathbf u$，所以

$$\frac{DT}{Dt}\equiv\frac{\partial T}{\partial t}+\mathbf u\cdot\nabla T$$

$D/Dt$ 叫 material derivative。第一项是固定点上看到的变化（local change），第二项是 particle 走到了 $T$ 不同的地方带来的变化（advection）。

用一次。一股 current 以 $u=0.5$ m/s 往东流，SST 往东每 100 km 降 1 °C，即 $\partial T/\partial x=-10^{-5}$ °C/m。水本身不吸热也不放热，$DT/Dt=0$。固定在海上的浮标看到的是

$$\frac{\partial T}{\partial t}=-u\frac{\partial T}{\partial x}=-0.5\times(-10^{-5})=5\times10^{-6}\ \text{°C/s}=0.43\ \text{°C/day}$$

浮标每天升温 0.43 °C，没有一个 particle 变暖：西边更暖的水被一块块搬了过来。

### Streamline、pathline、streakline

画一个 flow 有三种线。

- Streamline：某一时刻处处与 velocity 相切的曲线，满足 $dx/u=dy/v$（时间冻结在那一刻）。
- Pathline：一个 particle 实际走过的路，解 $d\mathbf x/dt=\mathbf u(\mathbf x,t)$。
- Streakline：从一个固定点连续释放 dye，某一时刻这些 dye 连成的线。

Steady flow 里三者重合。Problem Set 2 第 1 题：$u=y$，$v=x$。Streamline 满足 $dy/dx=v/u=x/y$，即 $y\,dy=x\,dx$，integrate 得

$$x^2-y^2=\text{const}$$

一族 rectangular hyperbola。Flow 不随时间变，particle 永远沿着它出发时所在的那条 streamline 走，pathline 和 streakline 都是同一族曲线。

Unsteady 时三者分开。取一个最简单的 unsteady 场：$u=1$，$v=t$，velocity 处处相同，方向随时间往上转。

**Streamline**（时刻 $t$）：$dy/dx=v/u=t$，过原点的那条是直线 $y=tx$。

**Pathline**（$t=0$ 时从原点出发）：$dx/dt=1$ 给 $x=t$；$dy/dt=t$ 给 $y=t^2/2$。消去 $t$：$y=x^2/2$，一条 parabola。

**Streakline**（从原点连续释放）：在时刻 $s$ 释放的 particle，到时刻 $t$ 时位于

$$x=t-s,\qquad y=\int_s^t\tau\,d\tau=\frac{t^2-s^2}{2}$$

把 $s=t-x$ 代进第二式：

$$y=\frac{t^2-(t-x)^2}{2}=tx-\frac{x^2}{2},\qquad 0\le x\le t$$

取 $t=1.2$：streamline 是 $y=1.2x$，pathline 是 $y=x^2/2$，streakline 是 $y=1.2x-x^2/2$。三条线都过原点，pathline 和 streakline 在 $(1.2,\,0.72)$ 相遇，那里就是最早放出的那个 particle。

::fig[mit-12.800-lines] 三条线随时间生长。实验里拍到的 dye 是 streakline，它既不是此刻的 velocity 方向，也不是任何一个 particle 的轨迹。

:::wrong Streamline 就是 particle 走的路
在 $t=0$ 时 $v=0$，过原点的 streamline 是 $x$ 轴。如果 particle 沿着它走，到 $t=1.2$ 时应该在 $(1.2,0)$。它实际在 $(1.2,0.72)$。Streamline 只描述那一瞬间，velocity 一变，particle 就离开了它出发时的那条 streamline。只有 steady flow 里两者才是同一条线（lecture4.pdf 的 quiz 第 5 题考的正是这一点）。
:::

### 一小块 fluid 怎样变形

Viscosity 产生 stress 的原因是 fluid 被扭曲了，所以要先能定量地说一块 fluid“被扭曲了多少”。在点 $\mathbf x$ 附近取一个邻点 $\mathbf x+\delta\mathbf x$，把 velocity 做 Taylor expansion：

$$\delta\mathbf u=\mathbf u(\mathbf x+\delta\mathbf x)-\mathbf u(\mathbf x)\approx G\,\delta\mathbf x,\qquad G=\begin{pmatrix}\partial u/\partial x&\partial u/\partial y\\\partial v/\partial x&\partial v/\partial y\end{pmatrix}$$

$G$ 叫 velocity gradient tensor。它告诉我们邻点相对于中心点怎样移动。逐个 entry 看它的几何意义（lecture4.pdf 的做法）：

- 沿 $x$ 方向一根长 $\delta x$ 的 fluid line，它的右端相对左端在 $x$ 方向的速度是 $(\partial u/\partial x)\delta x$。单位长度的伸长率是 $\partial u/\partial x$，叫 linear strain rate。
- 同一根线的右端在 $y$ 方向的速度是 $(\partial v/\partial x)\delta x$，这根线以 $\partial v/\partial x$ 的 angular velocity 逆时针转。
- 沿 $y$ 方向一根长 $\delta y$ 的线，上端在 $x$ 方向的速度是 $(\partial u/\partial y)\delta y$，这根线以 $\partial u/\partial y$ 的 angular velocity 顺时针转，即逆时针 angular velocity 为 $-\partial u/\partial y$。

两根原本垂直的线，平均的逆时针 angular velocity 是

$$\frac12\left(\frac{\partial v}{\partial x}-\frac{\partial u}{\partial y}\right)$$

这是这一小块 fluid 整体的 rotation rate。两根线之间的夹角减小的速度是 $\partial v/\partial x+\partial u/\partial y$，它的一半叫 shear strain rate。这正好对应把 $G$ 拆成 symmetric 和 antisymmetric 两部分：

$$G=\underbrace{\frac12(G+G^\top)}_{e\text{：strain rate tensor}}+\underbrace{\frac12(G-G^\top)}_{\text{rotation}},\qquad \frac12(G-G^\top)=\begin{pmatrix}0&-\tfrac12\omega\\\tfrac12\omega&0\end{pmatrix}$$

其中 $\omega=\partial v/\partial x-\partial u/\partial y$ 是 vorticity，等于 rotation rate 的两倍。$e$ 的 diagonal 是 linear strain rate，off-diagonal 是 shear strain rate。$e$ 是 symmetric matrix，有两个互相垂直的 eigenvector，沿这两个方向的 fluid line 只伸缩、不相对转动，叫 principal axes。这个分解叫 Cauchy–Stokes decomposition：一小块 fluid 的运动 = 平移 + 沿 principal axes 的伸缩 + rigid rotation。

用 lecture5.pdf 的例子：$u=x^2y$，$v=2xy^2$，在 $(x,y)=(-2,-1)$ 处。

$$\frac{\partial u}{\partial x}=2xy=4,\quad\frac{\partial u}{\partial y}=x^2=4,\quad\frac{\partial v}{\partial x}=2y^2=2,\quad\frac{\partial v}{\partial y}=4xy=8$$

$$G=\begin{pmatrix}4&4\\2&8\end{pmatrix},\qquad e=\begin{pmatrix}4&3\\3&8\end{pmatrix},\qquad \frac12(G-G^\top)=\begin{pmatrix}0&1\\-1&0\end{pmatrix}$$

所以 $\tfrac12\omega=-1$ rad/s：这块 fluid 以每秒 1 rad 顺时针转。$e$ 的 eigenvalue 由 $\lambda^2-12\lambda+(32-9)=0$ 给出，$\lambda=6\pm\sqrt{13}$，即 9.61 和 2.39 s⁻¹，对应的 principal axis 一根与 $x$ 轴成 61.8°，另一根与它垂直。两个 eigenvalue 都是正的，两个方向都在伸长，面积以 $\mathrm{tr}\,G=\partial u/\partial x+\partial v/\partial y=12$ s⁻¹ 的速率增长。第 2 站会看到，这意味着这个 flow 只能在 compressible fluid 里出现。

### Strain 一样，rotation 不一样

把 Problem Set 2 的两个 flow 放在一起。第 1 题 $u=y$、$v=x$；第 5 题是两块平板之间的 Couette flow，$u=Uy/b$，这里取 $U/b=2$，即 $u=2y$、$v=0$。

$$G_1=\begin{pmatrix}0&1\\1&0\end{pmatrix},\qquad G_2=\begin{pmatrix}0&2\\0&0\end{pmatrix}$$

两者的 symmetric part 完全相同，都是 $e=\begin{pmatrix}0&1\\1&0\end{pmatrix}$：沿 45° 方向以 1 s⁻¹ 伸长，沿 −45° 方向以 1 s⁻¹ 缩短。差别全在 antisymmetric part：$G_1$ 的为零，$\omega=0$；$G_2$ 的 $\omega=0-2=-2$ s⁻¹，整体以每秒 1 rad 顺时针转。Simple shear 等于一个 pure strain 加上一个 rigid rotation。

::fig[mit-12.800-blob] 同一个圆和两根 arm。左边两根 arm 一个逆时针转、一个顺时针转，转得一样多，blob 沿 45° 拉长；右边水平 arm 不动，竖直 arm 倒下，平均下来整体在顺时针转。

:::wrong Streamline 是直的，fluid 就不转；streamline 绕圈，fluid 就在转
Couette flow 的 streamline 是一组平行直线，vorticity 却是 $-U/b$；取 $U=1$ m/s、$b=1$ cm，$\omega=-100$ s⁻¹，比地球的 $2\Omega=1.46\times10^{-4}$ s⁻¹ 大六个量级。反过来，第 4 站的 point vortex 里 streamline 是一圈圈的 circle，vorticity 处处为零。转不转要看 $\partial v/\partial x-\partial u/\partial y$，和 streamline 的形状无关。
:::

### Linear propagator：哪个 perturbation 长得最快

:::skip
这一小节是 12.800 自己的一段旁支，讲 forecast 里怎样找增长最快的 error。跳过它不影响后面各站。
:::

上面的 $G$ 也可以用来回答一个 forecast 的问题。两条邻近的 trajectory 相差 $\delta\mathbf x$，经过一段短时间 $\Delta t$，差别变成

$$\delta\mathbf x(\Delta t)\approx(I+G\Delta t)\,\delta\mathbf x(0)\equiv M\,\delta\mathbf x(0)$$

$M$ 叫 linear propagator（lecture5.pdf 直接把它记作 $M$）。Initial error 的大小一定、方向未知，问：哪个方向的 error 长得最多？要最大化的是

$$\sigma^2=\frac{\delta\mathbf x(0)^\top M^\top M\,\delta\mathbf x(0)}{\delta\mathbf x(0)^\top\delta\mathbf x(0)}$$

这是 symmetric positive definite matrix $M^\top M$ 的 Rayleigh quotient，最大值是它最大的 eigenvalue，取到最大值的方向是对应的 eigenvector。这就是 SVD：$M=U\Sigma V^\top$，$V$ 的 column 是 initial time 的方向，$U$ 的 column 是它们在 final time 指向的方向，$\Sigma$ 是增长的倍数。

Lecture5.pdf 的图用的是

$$M=\begin{pmatrix}-0.4945&-0.5752\\-2.2910&1.2716\end{pmatrix},\qquad M^\top M=\begin{pmatrix}5.4932&-2.6288\\-2.6288&1.9478\end{pmatrix}$$

$M^\top M$ 的 eigenvalue 是 6.891 和 0.550，开方得 singular value $\sigma_1=2.625$、$\sigma_2=0.742$。核对：$\sigma_1\sigma_2=1.947=|\det M|$，面积放大的倍数。$\sigma_1$ 对应的 initial 方向 $\mathbf v_1=(-0.883,\,0.470)$（整体差一个 sign 不影响），它被送到 $\mathbf u_1=M\mathbf v_1/\sigma_1=(0.063,\,0.998)$，几乎正北，长了 2.625 倍。

::fig[mit-12.800-svd] 一圈大小相同的 initial error 被 $M$ 送成一个 ellipse。长轴来自 $\mathbf v_1$ 方向的那一个 error。

$M$ 自己的 eigenvalue 是 1.837 和 −1.060。Eigenvector 方向的 error 只长 1.837 倍，比 $\sigma_1$ 小：$M$ 不是 symmetric 的，eigenvector 不互相垂直，增长最快的方向不是 eigenvector。这就是 forecast 里用 singular vector 而不用 eigenvector 找最危险 initial error 的原因。

:::note Problem Set 3 第 1 题
给一个 2×2 的 propagator（抽取出来的 entry 是 1、2、3、4，可能有一个 sign 被吞掉），要求手算 initial 与 final singular vector 和 singular value，画出 initial 和 final 的 axes 并按 singular value 缩放。做法与上面完全相同：先求 $M^\top M$ 的 eigenvalue 和 eigenvector 得 $\Sigma$ 与 $V$，再由 $\mathbf u_i=M\mathbf v_i/\sigma_i$ 得 $U$。
:::

:::from
Lagrangian 与 Eulerian 的优缺点、material derivative 的 chain rule 推导、三种线的定义与“time-dependent 时 streakline 不等于 streamline”，来自 [lecture3.pdf](https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/7bb9e945405534b36776cbe404a8f839_lecture3.pdf) 和 [lecture4.pdf](https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/0761927d52c9d196c9a8a11bbd62f45a_lecture4.pdf)；linear strain rate、shear strain rate 和 rotation rate 由 fluid line 的 angular velocity 逐个推出、vorticity 是 rotation rate 的两倍，来自 lecture4.pdf。$u=x^2y$、$v=2xy^2$ 的例题、$G$ 分成 $e$ 和 rotation、linear propagator、$M^\top M$ 与 SVD 的关系和那个 $M$，来自 [lecture5.pdf](https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/6142530d9f014a620eddacc06da975b6_lecture5.pdf)（讲义把 propagator 写成 $M=G\Delta t$，这里按 $\delta\mathbf x(\Delta t)=\delta\mathbf x(0)+G\Delta t\,\delta\mathbf x(0)$ 改写成 $I+G\Delta t$）。Problem Set 2 第 1、5 题和 Set 3 第 1 题读的是题目，OCW 没有答案。SST 与浮标的算例、$u=1$、$v=t$ 的三种线、两个 flow 的对比、principal axes 的 eigenvalue 与角度、$M$ 的 singular value 和 eigenvalue 是为这一页算的。
:::

## [cons] Conservation laws 与 Navier–Stokes

:::skip
能由 Reynolds transport theorem 推出 continuity equation，能从 stress tensor 推出 Navier–Stokes 并解 Couette flow，能说出 Bernoulli 成立的条件，就可以去第 3 站。
:::

### 守恒律管的是 material volume

Mass 守恒、Newton's second law、first law of thermodynamics，都是对一组固定的 material 说的：同一批分子，质量不变，动量的变化率等于受的 force。可是 equation 要写在固定的点上（上一站的 Eulerian 描述）。需要一个公式，把“一块随 flow 走的 material volume 里某个总量的变化率”换成固定区域上的 integral。

设 $c$ 是某个量的 per unit volume 的密度（mass 就是 $\rho$，x-momentum 就是 $\rho u$），$C=\int_V c\,dV$ 是 material volume 里的总量。在时刻 $t$，让 material volume 和一个固定的 control volume 重合。过了 $\Delta t$，$C$ 的变化来自两处：

1. Control volume 里每一点的 $c$ 本身变了，贡献 $\Delta t\int_V\partial c/\partial t\,dV$。
2. Material volume 的边界移动了。边界上一小块面积 $dA$ 以法向速度 $\mathbf u\cdot\mathbf n$ 往外推，扫出一条厚 $(\mathbf u\cdot\mathbf n)\Delta t$ 的带子，带走 $c\,(\mathbf u\cdot\mathbf n)\Delta t\,dA$。流入的地方 $\mathbf u\cdot\mathbf n<0$，这一项是负的。

::fig[mit-12.800-rtt] Material volume 往右移了一点。右边多出一条（要算进去），左边空出一条（要扣掉）。

两部分加起来除以 $\Delta t$：

$$\frac{dC}{dt}=\int_V\frac{\partial c}{\partial t}\,dV+\oint_A c\,\mathbf u\cdot d\mathbf A$$

这叫 Reynolds transport theorem。用 divergence theorem $\oint_A\mathbf Q\cdot d\mathbf A=\int_V\nabla\cdot\mathbf Q\,dV$ 把 surface integral 换成 volume integral，再展开 $\nabla\cdot(c\mathbf u)=\mathbf u\cdot\nabla c+c\nabla\cdot\mathbf u$：

$$\frac{dC}{dt}=\int_V\left[\frac{\partial c}{\partial t}+\nabla\cdot(c\mathbf u)\right]dV=\int_V\left[\frac{Dc}{Dt}+c\,\nabla\cdot\mathbf u\right]dV$$

最后一式的两项各有意义：$Dc/Dt$ 是跟着 particle 看 $c$ 的变化，$c\,\nabla\cdot\mathbf u$ 是 volume 本身胀大或缩小带来的变化。

### Continuity equation

取 $c=\rho$，$C$ 是 material volume 的 mass，守恒：$dC/dt=0$。于是 $\int_V[D\rho/Dt+\rho\nabla\cdot\mathbf u]\,dV=0$。这对任意的 $V$ 都成立，integrand 只能处处为零：

$$\frac{D\rho}{Dt}+\rho\,\nabla\cdot\mathbf u=0\qquad\Longleftrightarrow\qquad\frac{\partial\rho}{\partial t}+\nabla\cdot(\rho\mathbf u)=0$$

如果每个 particle 的 density 都不变（$D\rho/Dt=0$），就得到 incompressible 的条件 $\nabla\cdot\mathbf u=0$。用上一站的两个例子检验：$u=y$、$v=x$ 的 $\nabla\cdot\mathbf u=0+0=0$，可以是水；$u=x^2y$、$v=2xy^2$ 在 $(-2,-1)$ 处 $\nabla\cdot\mathbf u=12$ s⁻¹，那里的 particle 的 density 以每秒 $12\rho$ 的速率下降，只有 gas 才行。

### Momentum：从 force 到 stress tensor

取 $c=\rho u_i$。先化简左边：用 product rule 再用 continuity，

$$\frac{\partial(\rho\mathbf u)}{\partial t}+\nabla\cdot(\rho\mathbf u\mathbf u)=\mathbf u\underbrace{\left[\frac{\partial\rho}{\partial t}+\nabla\cdot(\rho\mathbf u)\right]}_{=0}+\rho\left[\frac{\partial\mathbf u}{\partial t}+\mathbf u\cdot\nabla\mathbf u\right]=\rho\frac{D\mathbf u}{Dt}$$

右边是 material volume 受的 force：body force $\int\rho\mathbf g\,dV$，加上边界上周围 fluid 施加的 surface force。单位面积上的 surface force 和这块面的朝向有关，写成 $\tau\cdot\mathbf n$，$\tau$ 是 stress tensor（$\tau_{ij}$ 是法向为 $j$ 的面上、$i$ 方向的 force）。再用一次 divergence theorem，integrand 为零：

$$\rho\frac{D\mathbf u}{Dt}=\rho\mathbf g+\nabla\cdot\tau$$

到这里还没有用到任何关于 fluid 的性质。要让 equation 能解，必须说 $\tau$ 由什么决定。

### Constitutive relation：Newtonian fluid

Fluid 的定义（lecture3.pdf）：静止时不能承受 shear stress。Solid 被剪切一个角度 $\gamma$ 会以 $G\gamma$ 的 stress 抵抗；fluid 的 shear stress 只和剪切的**速率**有关，$\tau_{xz}=\mu\,du/dz$。所以：

1. 静止时 $\tau=-pI$：只有各向同性的 pressure。
2. 运动时多出来的部分只取决于 fluid 被扭曲的速率，也就是上一站的 strain rate tensor $e$。Rotation 部分不产生 stress，因为 rigid rotation 时 fluid 根本没有变形。
3. 假设这个关系是 linear 的（Newtonian fluid），而且各方向性质相同。

满足这三条的最一般形式是 $\tau=-pI+2\mu e+\lambda(\nabla\cdot\mathbf u)I$。用 simple shear 定系数：$u=u(z)$ 时 $e_{xz}=\tfrac12du/dz$，要求 $\tau_{xz}=\mu\,du/dz$，所以系数是 $2\mu$。$\lambda$ 取 $-\tfrac23\mu$，使 $\tau$ 的 trace 恰好是 $-3p$，即 $p$ 仍是三个 normal stress 的平均（lecture8.pdf 的 8.1 式）：

$$\tau=-\left(p+\tfrac23\mu\,\nabla\cdot\mathbf u\right)I+2\mu e$$

### 推出 Navier–Stokes

逐项算 x-component $(\nabla\cdot\tau)_x=\partial\tau_{xx}/\partial x+\partial\tau_{xy}/\partial y+\partial\tau_{xz}/\partial z$：

$$\tau_{xx}=-p+2\mu\frac{\partial u}{\partial x}-\frac23\mu\nabla\cdot\mathbf u,\qquad\tau_{xy}=\mu\left(\frac{\partial u}{\partial y}+\frac{\partial v}{\partial x}\right),\qquad\tau_{xz}=\mu\left(\frac{\partial u}{\partial z}+\frac{\partial w}{\partial x}\right)$$

$\mu$ 取 constant，求 derivative 后加起来：

$$(\nabla\cdot\tau)_x=-\frac{\partial p}{\partial x}+\mu\left(2\frac{\partial^2u}{\partial x^2}+\frac{\partial^2u}{\partial y^2}+\frac{\partial^2v}{\partial x\partial y}+\frac{\partial^2u}{\partial z^2}+\frac{\partial^2w}{\partial x\partial z}\right)-\frac23\mu\frac{\partial}{\partial x}(\nabla\cdot\mathbf u)$$

括号里拆出 $\nabla^2u=\partial^2u/\partial x^2+\partial^2u/\partial y^2+\partial^2u/\partial z^2$，剩下的三项是 $\frac{\partial}{\partial x}\left(\frac{\partial u}{\partial x}+\frac{\partial v}{\partial y}+\frac{\partial w}{\partial z}\right)=\frac{\partial}{\partial x}(\nabla\cdot\mathbf u)$。所以

$$(\nabla\cdot\tau)_x=-\frac{\partial p}{\partial x}+\mu\nabla^2u+\left(1-\tfrac23\right)\mu\frac{\partial}{\partial x}(\nabla\cdot\mathbf u)$$

三个方向合起来：

$$\rho\frac{D\mathbf u}{Dt}=\rho\mathbf g-\nabla p+\mu\nabla^2\mathbf u+\frac{\mu}{3}\nabla(\nabla\cdot\mathbf u)$$

这是 Navier–Stokes equation。Incompressible 时最后一项为零；再令 $\mu=0$，得 Euler equation $\rho\,D\mathbf u/Dt=\rho\mathbf g-\nabla p$。速度为零时只剩 $0=\rho\mathbf g-\nabla p$，即 $\partial p/\partial z=-\rho g$，hydrostatic relation。

### 一个能解的例子：Couette flow

Problem Set 2 第 5 题：两块平板相距 $b$，下板不动，上板以 $U$ 平行移动，steady，$u=u(y)$，$v=w=0$。Navier–Stokes 的 x-component 里：steady 且 $u$ 不随 $x$ 变，$Du/Dt=\partial u/\partial t+u\,\partial u/\partial x=0$；没有外加的 pressure gradient；剩下

$$0=\mu\frac{d^2u}{dy^2}$$

$u$ 是 $y$ 的 linear function，用 no-slip（贴着板的 fluid 和板同速）$u(0)=0$、$u(b)=U$，得 $u=Uy/b$。上一站已经算过它的 strain rate $\tfrac12U/b$ 和 vorticity $-U/b$。现在可以算 stress：$\tau_{xy}=\mu U/b$，处处相同。水 $\mu=1.0\times10^{-3}$ Pa·s，$U=1$ m/s，$b=1$ cm：

$$\tau_{xy}=\frac{10^{-3}\times1}{0.01}=0.1\ \text{Pa}$$

拖动 1 m² 的上板要 0.1 N 的力。

::fig[mit-12.800-couette] 上板拖着水走。每一层 fluid 被上面一层往前拉、被下面一层往后拉，两个力大小相同，所以这块 fluid 不加速。

:::edge ocean 和 atmosphere 里用的不是 molecular viscosity
Lecture16.pdf：数值模式的格点远大于真正耗散能量的小尺度运动，没有分辨出的 turbulence 以一个大得多的 eddy viscosity 代替，而且水平和垂直分开取，$F_x=\nu_H(\partial_x^2+\partial_y^2)u+\nu_V\partial_z^2u$。讲义给的量级是 $\nu_H$ 与 $\nu_V$ 相差三到四个量级，$\nu_H$ 与 molecular $\nu$ 相差约七个量级。第 6 站 ocean 的 Ekman layer 用的 $0.1$ m²/s（Vallis 讲义的值）是 molecular 值 $10^{-6}$ m²/s 的十万倍。Equation 的形式不变，系数的意思变了：它是一个 parameterization，不是物性。
:::

### Bernoulli

Euler equation 在一类重要情形下可以 integrate 出来。先改写 advection 项。对任何 vector field 有 identity

$$\mathbf u\cdot\nabla\mathbf u=\nabla\left(\tfrac12|\mathbf u|^2\right)-\mathbf u\times\boldsymbol\omega,\qquad\boldsymbol\omega=\nabla\times\mathbf u$$

取 density 为 constant，gravity 写成 $\mathbf g=-\nabla(gz)$，Euler equation 变成

$$\frac{\partial\mathbf u}{\partial t}+\nabla B=\mathbf u\times\boldsymbol\omega,\qquad B=\tfrac12|\mathbf u|^2+gz+\frac p\rho$$

Steady 时 $\nabla B=\mathbf u\times\boldsymbol\omega$。右边与 $\mathbf u$ 垂直，所以沿 streamline 走，$B$ 的变化率 $\mathbf u\cdot\nabla B=0$：$B$ 沿每条 streamline 是 constant（也沿每条 vortex line）。如果再有 $\boldsymbol\omega=0$，$\nabla B=0$，$B$ 处处是同一个 constant。

Lecture10.pdf 的 Pitot tube：管口正对来流，管口处 fluid 停下（stagnation point，$u_2=0$）。沿同一条 streamline，高度不变：

$$\tfrac12\rho u_1^2+p_1=p_2\qquad\Rightarrow\qquad u_1=\sqrt{\frac{2(p_2-p_1)}{\rho}}$$

用一根竖管读 $p_2-p_1=\rho g\Delta z$，得 $u_1=\sqrt{2g\Delta z}$。液面差 5 cm 时 $u_1=\sqrt{2\times9.81\times0.05}=0.99$ m/s。

:::wrong 同一个 flow 里任意两点都可以用 Bernoulli 比较 pressure
只有 irrotational 时 $B$ 才处处相同。Solid-body rotation（第 4 站）$u_\theta=\Omega r$，vorticity $2\Omega$，不能跨 streamline 用 Bernoulli（lecture11.pdf 的 11.48 式）。直接算：radial 方向的 force balance 是 $dp/dr=\rho u_\theta^2/r=\rho\Omega^2r$，integrate 得 $p=p_0+\tfrac12\rho\Omega^2r^2$。开头那个水槽 $\Omega=0.5$ rad/s，$r=0.2$ m 处 $p-p_0=\tfrac12\times1000\times0.25\times0.04=5$ Pa，外圈 pressure 更高。如果硬套 Bernoulli，$\tfrac12\rho u^2+p$ 相等，外圈速度大，会得出 pressure 低 5 Pa。实际上 $\tfrac12\rho u^2+p=p_0+\rho\Omega^2r^2$ 随 $r$ 增大，每条 streamline 有自己的 constant。
:::

:::note Problem Set 5 第 3 题（Kundu & Cohen Example 4.10）：半球形容器漏空
半径 $R$ 的半球形容器盛满水，底部有一个面积为 $A$ 的小孔。求水位从 $h_1$ 降到 $h_2$ 的时间。

两条守恒律各管一半。**Bernoulli**：水位下降很慢，近似 steady，从水面（速度近似为零、$p=p_a$）沿 streamline 到孔口（$p=p_a$），高度差 $h$，所以孔口流速 $u=\sqrt{2gh}$。**Continuity**：水位 $h$ 处水面是半径 $r$ 的圆，$r^2=R^2-(R-h)^2=2Rh-h^2$，体积减少的速率等于孔口流出的流量：

$$\pi(2Rh-h^2)\frac{dh}{dt}=-A\sqrt{2gh}$$

分离 variables，$dt=-\dfrac{\pi}{A\sqrt{2g}}\left(2Rh^{1/2}-h^{3/2}\right)dh$，从 $h_1$ 积到 $h_2$：

$$t=\frac{\pi}{A\sqrt{2g}}\left[\frac43R\left(h_1^{3/2}-h_2^{3/2}\right)-\frac25\left(h_1^{5/2}-h_2^{5/2}\right)\right]$$

取 $R=0.5$ m，$A=1$ cm²，从满（$h_1=R$）到空：$\dfrac{\pi}{10^{-4}\sqrt{19.62}}=7093\ \text{s}/\text{m}^{5/2}$，方括号里是 $\tfrac43\times0.5\times0.3536-\tfrac25\times0.1768=0.1650\ \text{m}^{5/2}$，$t=1170$ s，约 19.5 min。前一半水深（0.5 m 到 0.25 m）就用了 11.1 min：上面截面大，这一半水深里装着全部水量的 69%。这里忽略了孔口 jet 的收缩，真实时间会更长一些。
:::

::fig[mit-12.800-hemi] 半球形容器的几何。水面半径随 $h$ 变，这是这道题和圆柱形容器不同的地方。

:::from
Reynolds transport theorem 的推导（material volume 与 control volume 在 $t$ 时重合、边界扫出的带子、divergence theorem 的两种展开与三项的意义）和 continuity，来自 [lecture6.pdf](https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/db2c647b80926c8b2c6edc3577b65f88_lecture6.pdf)；fluid 的定义与 solid 的对比来自 lecture3.pdf；constitutive relation $\tau=2\mu e-(p+\tfrac23\mu\nabla\cdot\mathbf u)I$、$\nabla\cdot\tau$ 的 x-component 和 Navier–Stokes 来自 [lecture8.pdf](https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/d510167bc5ccee175ad6d6345039892a_lecture8.pdf)；eddy viscosity 来自 [lecture16.pdf](https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/63da77dcb61a8b0ece8f3d028f81bc53_lecture16.pdf)；Bernoulli 的 vector-invariant 推导、steady 与 irrotational 两种情形、Pitot tube 来自 [lecture10.pdf](https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/dbdc2bbc8825b710d9199f1e7f435a1d_lecture10.pdf)；solid-body rotation 的 $\tfrac12\rho u^2+p=f(r)$ 来自 [lecture11.pdf](https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/6411e619b5fb45f132cc9ac1b83d4d14_12800Lecture11.pdf)。Problem Set 2 第 5 题、Set 5 第 3 题只读到题目（Set 5 的答案式子抽取出来是乱码），解法和数字是自己做的。$\lambda=-\tfrac23\mu$ 的理由、左边化成 $\rho\,D\mathbf u/Dt$ 的那一步、Couette 的 0.1 Pa、Pitot 的 5 cm、水槽的 5 Pa 是为这一页补的。
:::

## [bous] Boussinesq approximation 与 hydrostatic balance

:::skip
能从 full equations 推出 Boussinesq 形式并说清 $\rho'$ 为什么只留在 gravity 项里，能算 N，能用 $(H/L)^2$ 判断 hydrostatic，就可以去第 4 站。
:::

### Density 差千分之几，要不要管

Navier–Stokes 加上 continuity、energy equation 和 equation of state，atmosphere 是 6 个 equation 6 个 unknown，ocean 多一个 salinity，7 个（lecture11.pdf 的计数）。完整的 equation 里有 sound wave，有随 density 变化的 inertia，解起来很麻烦。海水的 density 实际变化多大？Vallis 讲义用 linear equation of state 估：

| 原因 | 典型变化 | $\Delta\rho/\rho_0$ |
|---|---|---|
| Temperature，$\beta_T\approx2\times10^{-4}$ K⁻¹ | 20 K | $4\times10^{-3}$ |
| Salinity，$\beta_S\approx10^{-3}$ psu⁻¹ | 5 psu | $5\times10^{-3}$ |

要让 temperature 造成 order one 的 density 变化，需要约 5000 K。Pressure 也会压缩海水，$\Delta\rho/\rho_0\approx gH/c_s^2$（$c_s\approx1500$ m/s 是 sound speed），4 km 深处约 $1.7\times10^{-2}$；但这部分让整个 water column 随深度一起变重，和下面的 base state $p_0(z)$ 一起被 hydrostatic 平衡掉，不在同一深度造成水平的 density 差。驱动运动的是同一深度上的 density 差，它们来自 $T$ 和 $S$，量级 $10^{-3}$。

直觉是：千分之几的 density 变化处处都可以忽略。这在 inertia 里对，在 gravity 里错。

### 推导

把 density 和 pressure 拆成 constant 参考值加小 perturbation：

$$\rho=\rho_0+\rho',\quad|\rho'|\ll\rho_0;\qquad p=p_0(z)+p',\quad\frac{dp_0}{dz}=-\rho_0g$$

$p_0(z)$ 是 density 处处为 $\rho_0$ 时的静水 pressure。代进 incompressible Navier–Stokes 的 vertical component：

$$(\rho_0+\rho')\frac{Dw}{Dt}=-(\rho_0+\rho')g-\frac{dp_0}{dz}-\frac{\partial p'}{\partial z}+\mu\nabla^2w$$

$-\rho_0g-dp_0/dz=0$，这两个最大的项正好抵消：

$$(\rho_0+\rho')\frac{Dw}{Dt}=-\rho'g-\frac{\partial p'}{\partial z}+\mu\nabla^2w$$

现在比较。左边的 $\rho'$ 和 $\rho_0$ 并列，相对大小 $10^{-3}$，丢掉。右边的 $\rho'g$ 没有可以和它并列的 $\rho_0g$ 了（已经抵消），它要和 $\partial p'/\partial z$、$\rho_0Dw/Dt$ 比，而 $g$ 很大，$\rho'g$ 并不小，必须留下。水平方向的 equation 里本来就没有 gravity，$\rho'$ 只出现在 inertia 前面，丢掉。定义 buoyancy

$$b=-g\frac{\rho'}{\rho_0}$$

（比周围轻的水 $b>0$），除以 $\rho_0$，记 $\nu=\mu/\rho_0$：

$$\frac{D\mathbf u}{Dt}=-\frac1{\rho_0}\nabla p'+b\,\mathbf k+\nu\nabla^2\mathbf u$$

Continuity 也要简化。由 $D\rho/Dt+\rho\nabla\cdot\mathbf u=0$，$\nabla\cdot\mathbf u=-\frac1\rho\frac{D\rho'}{Dt}$。右边的大小约 $\frac{\Delta\rho}{\rho_0}\frac UL$，而 $\nabla\cdot\mathbf u$ 里的每一项（如 $\partial u/\partial x$）是 $U/L$。所以 $\nabla\cdot\mathbf u$ 只是它每一项的千分之一，取

$$\nabla\cdot\mathbf u=0$$

这一步同时把 sound wave 从 equation 里去掉了。Temperature 和 salinity 在 Boussinesq 下各自满足 $DT/Dt=\kappa_T\nabla^2T$、$DS/Dt=\kappa_S\nabla^2S$（lecture9.pdf：ocean 里 $Dp/Dt$ 项小，可以丢；atmosphere 不行），通过 linear equation of state 合成 buoyancy 的 equation，没有 diffusion 时就是 $Db/Dt=0$。

> Boussinesq：density 的变化只在乘上 $g$ 时才算数。

### Stratification 与 N

把 buoyancy 再拆成随深度变的背景 $\tilde b(z)$ 加 perturbation $b'$。$Db/Dt=0$ 展开，$\tilde b$ 只随 $z$ 变，$D\tilde b/Dt=w\,d\tilde b/dz$：

$$\frac{Db'}{Dt}+N^2w=0,\qquad N^2=\frac{d\tilde b}{dz}=-\frac g{\rho_0}\frac{d\tilde\rho}{dz}$$

一个 parcel 被往上推了 $z'$，它带着原来的 buoyancy 到了一个背景更轻的地方，$b'=-N^2z'$。忽略 pressure perturbation，vertical momentum 只剩 $d^2z'/dt^2=b'=-N^2z'$：harmonic oscillation，frequency $N$。

Thermocline 里 500 m 内 density 增加 2 kg/m³：

$$N^2=\frac{9.81\times2}{1025\times500}=3.83\times10^{-5}\ \text{s}^{-2},\qquad N=6.19\times10^{-3}\ \text{s}^{-1},\qquad\frac{2\pi}N=1015\ \text{s}\approx17\ \text{min}$$

::fig[mit-12.800-buoy] 被推高的 parcel 比周围重，往回掉，冲过头，再被推回来。周期 17 min。

$N$ 在 [SIO-210 第 1 站](../courses/SIO-210.html#state)里从 seawater 的角度讲过。这里要多记一件事：$N$ 和第 5 站以后的 $f$ 是同一类量，一个是 stratification 的 frequency，一个是 rotation 的 frequency。Lecture2.pdf 用 dimensional analysis 把两者放在一起：Rossby number $U/(fL)$ 和 Froude number $U/(NH)$ 都取 1，消去 $U$，得到一个长度

$$L\sim\frac{NH}{f}$$

上面的 thermocline，$H=500$ m，$f=10^{-4}$ s⁻¹，$L=6.19\times10^{-3}\times500/10^{-4}=31$ km。这是 deformation radius 的一个版本，第 8 站的 adjustment 和第 9 站的 Rossby wave 都由它决定。

### 什么时候可以用 hydrostatic

Vertical momentum 里，$Dw/Dt$ 和 $\partial p'/\partial z$ 比有多大？Vallis 讲义的 scaling：水平 momentum 里 pressure perturbation 由 $U^2$ 平衡，$p'/\rho_0\sim U^2$；continuity $\partial w/\partial z=-(\partial u/\partial x+\partial v/\partial y)$ 给 $W\sim UH/L$。于是

$$\frac{Dw}{Dt}\sim\frac{UW}{L}=\frac{U^2H}{L^2},\qquad\frac1{\rho_0}\frac{\partial p'}{\partial z}\sim\frac{U^2}{H},\qquad\text{比值}\sim\left(\frac HL\right)^2$$

Ocean 的 mesoscale，$H=1$ km、$L=100$ km，比值 $10^{-4}$。Vallis 进一步指出有 rotation 时这个比值还要再乘一个 Rossby number，rotating flow 比不转的 flow 更 hydrostatic。Lecture15.pdf 另外核对了 vertical 方向的 Coriolis 项：$\Omega U$ 在 $U=10$ m/s 时是 $7\times10^{-4}$ m/s²，和 $g$ 比完全可以忽略。所以大尺度运动的 vertical momentum equation 只剩

$$\frac{\partial p}{\partial z}=-\rho g$$

它不再用来求 $w$。$w$ 改由 continuity 算出。

:::edge Hydrostatic 不成立的地方
$H$ 和 $L$ 差不多时：convection 的 plume、wavelength 和水深相当的 internal wave、上一节那个 17 min 振荡的 parcel 本身（它的 $Dw/Dt$ 就是主角）。
:::

### Atmosphere：要换成 potential temperature

Boussinesq 对 atmosphere 不好用：气压每升高约 5.5 km 就减半，density 的变化是 order one 的。Lecture9.pdf 改用 entropy。从 energy equation 出发，用 ideal gas $p=\rho RT$ 和 $c_v+R=c_p$，得 $c_pDT/Dt-\frac1\rho Dp/Dt=\dot Q$；两边除以 $T$，用 $\frac1{\rho T}=\frac Rp$：

$$c_p\frac{D\ln T}{Dt}-R\frac{D\ln p}{Dt}=\frac{\dot Q}{T}$$

左边正好是 $c_p\,D\ln\theta/Dt$，其中

$$\theta=T\left(\frac{p_s}{p}\right)^{R/c_p}$$

叫 potential temperature：把一团空气 adiabatic 地搬到地面 pressure $p_s$ 时它的 temperature。没有加热时 $\theta$ 守恒，一团空气沿 $\theta$ 不变的面运动。

:::wrong 上面的空气比下面冷，所以比下面重，会往下沉
500 hPa 处的空气 $T=-20$ °C $=253.15$ K，地面空气 15 °C $=288.15$ K。$R/c_p=287/1004=0.286$，把高处那团空气搬到地面：

$$\theta=253.15\times\left(\frac{1000}{500}\right)^{0.286}=253.15\times1.219=308.6\ \text{K}$$

它到了地面是 35.5 °C，比地面空气暖 20 K，更轻。所以它不会沉下来，这样的 atmosphere 是 stable 的。比较的应该是 $\theta$，不是 $T$；compressible fluid 里 stability 由 $\theta$（ocean 里对应的是 potential density）的vertical gradient 决定。
:::

:::from
Equations 与 unknown 的计数、Boussinesq 的 equation 组来自 lecture11.pdf；$\rho=\rho_0+\rho'$、$p=p_0(z)+p'$ 的拆法、$\rho_0g$ 与 $dp_0/dz$ 抵消、为什么留下 $\rho'g$ 的三条理由来自 lecture8.pdf；heat equation 在 ocean 与 atmosphere 的两种近似、potential temperature 的推导来自 [lecture9.pdf](https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/d9d0ff4b4084467d756b69f612327c3d_lecture9.pdf)；$U/(fL)$、$U/(NH)$ 与 $L\sim NH/f$ 来自 [lecture2.pdf](https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/f5d398ecf0c2ef2f33bbe61fa633f4d7_lecture2.pdf)；vertical Coriolis 的数值来自 [lecture15.pdf](https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/0013f63df0530942a410d7466f551ea7_lecture15.pdf)。Density 变化的数量级表、compressibility 的 $gH/c_s^2$、buoyancy $b$ 与 $N^2$ 的 equation、hydrostatic 的 $(H/L)^2$ scaling 与“rotation 让它更 hydrostatic”来自 [Vallis 讲义 1.6、1.7 节](https://empslocal.ex.ac.uk/people/staff/gv219/ecmm719/lecnotes18w.pdf)。Continuity 简化的 scaling（Problem Set 5 第 1 题要学生自己做的那一步）、thermocline 的 $N$ 与 31 km、“pressure 造成的压缩被 base state 吸收”这一句、500 hPa 的 $\theta$ 算例是为这一页写的。
:::

## [vort] Vorticity、circulation 与 Kelvin's theorem

:::skip
能算 solid-body rotation 与 point vortex 的 vorticity 和 circulation，能证明 Kelvin's circulation theorem 并说出它的三个条件，能由 baroclinic 项算 sea breeze，能写出 vorticity equation 并认出 stretching 与 tilting，就可以去第 5 站。
:::

### 两种绕圈的 flow

两个 flow，streamline 都是同心圆：

- Solid-body rotation：$u_\theta=\Omega_0r$，像整盘水跟着转台转。
- Point vortex（也叫 irrotational vortex）：$u_\theta=c/r$，越靠近中心越快。

哪个在“转”？用 polar coordinates 的 vorticity

$$\omega_z=\frac1r\frac{\partial(ru_\theta)}{\partial r}-\frac1r\frac{\partial u_r}{\partial\theta}$$

Solid-body：$\omega_z=\frac1r\frac{d}{dr}(\Omega_0r^2)=\frac1r\cdot2\Omega_0r=2\Omega_0$，处处相同。Point vortex：$\omega_z=\frac1r\frac{d}{dr}\left(r\cdot\frac cr\right)=\frac1r\frac{dc}{dr}=0$，除了 $r=0$ 处处为零。

::fig[mit-12.800-vortex] 三个小十字各绕中心转八分之一圈。左边十字跟着一起转了 45°；右边切向的 arm 跟着往前转，径向的 arm 因为外侧慢而往后倒。刚开始两根 arm 的 angular velocity 一个是 $+\Omega$、一个是 $-\Omega$（$\Omega=u_\theta/r$），平均为零，这就是 $\omega=0$ 的意思。

### Circulation 与 Stokes' theorem

Vorticity 是一点上的量。绕一条 closed curve $C$ 把切向 velocity 加起来，得到 circulation：

$$\Gamma=\oint_C\mathbf u\cdot d\mathbf s=\int_A\boldsymbol\omega\cdot d\mathbf A$$

第二个等号是 Stokes' theorem：把 $A$ 切成很多小块，相邻小块的公共边方向相反、互相抵消，只剩外边界；每一小块的 circulation 除以面积，limit 就是 $\boldsymbol\omega$ 在法向的 component。Divergence 是 per unit volume 的 flux，curl 是 per unit area 的 circulation。

检验。Solid-body 沿半径 $r$ 的圆：$\Gamma=\Omega_0r\cdot2\pi r=2\Omega_0\cdot\pi r^2$，等于 vorticity 乘面积。Point vortex：$\Gamma=\frac cr\cdot2\pi r=2\pi c$，和 $r$ 无关。所以通常写 $u_\theta=\Gamma/(2\pi r)$。Vorticity 处处为零、circulation 却不为零，只有一种可能：所有 vorticity 都集中在原点，那里是一个 delta function。不包含原点的 loop（两段 arc 加两段 radial 线）：radial 线上 $u_\theta$ 与路径垂直，贡献为零；两段 arc 是 $\frac c{r_2}r_2\Delta\theta-\frac c{r_1}r_1\Delta\theta=0$。

真实的 vortex 两者都有：中心一块 solid-body，外面是 point vortex，叫 Rankine vortex。取一个 hurricane 的粗略数字：$R=30$ km 处风速最大 $u_{max}=50$ m/s。

$$\omega_{core}=\frac{2u_{max}}R=3.3\times10^{-3}\ \text{s}^{-1},\qquad\Gamma=2\pi Ru_{max}=9.4\times10^6\ \text{m}^2/\text{s}$$

外面 $u_\theta=\Gamma/(2\pi r)$，100 km 处 $u_\theta=50\times30/100=15$ m/s。20°N 的 $f=4.99\times10^{-5}$ s⁻¹，核心的 vorticity 是 $f$ 的 67 倍，第 5 站会看到这意味着什么。

:::wrong Irrotational 的 flow 里没有 viscous stress；有 vorticity 才有 stress
Stress 来自 strain rate（第 2 站），和 vorticity 无关。Point vortex 的 shear strain rate 是 $e_{r\theta}=\frac r2\frac{d}{dr}\left(\frac{u_\theta}r\right)=\frac r2\cdot\left(-\frac{2c}{r^3}\right)=-\frac c{r^2}$。上面的 hurricane 外区 $c=\Gamma/2\pi=1.5\times10^6$ m²/s，100 km 处 $e_{r\theta}=-1.5\times10^{-4}$ s⁻¹，不为零，有 stress。Solid-body rotation 有 vorticity $2\Omega_0$，却没有任何 strain，没有 stress。两句话 lecture11.pdf 都写了：irrotational 不排除 viscous stress，没有 viscous stress 也不排除 vorticity。
:::

### Point vortex 怎样运动

Inviscid、2D 时，velocity 由 vorticity 决定，而且是 linear 的：每个 point vortex 在别处产生 $u_\theta=\Gamma/(2\pi r)$，叠加起来就是总的 velocity。换成 Cartesian，距离 $(\Delta x,\Delta y)$ 处

$$u=-\frac\Gamma{2\pi}\frac{\Delta y}{r^2},\qquad v=\frac\Gamma{2\pi}\frac{\Delta x}{r^2}$$

（$\Gamma>0$ 逆时针。）一个 vortex 自己不推自己，它被其他 vortex 产生的 velocity 带着走。

Problem Set 6 第 1 题。(a) 两个 vortex 在 $(-2.5,0)$、$(2.5,0)$，$\Gamma_1=-10$、$\Gamma_2=10$。Vortex 2 在 vortex 1 处：$\Delta x=-5$，$v=\frac{10}{2\pi}\cdot\frac{-5}{25}=-0.318$。Vortex 1 在 vortex 2 处：$\Delta x=5$，$v=\frac{-10}{2\pi}\cdot\frac5{25}=-0.318$。两个一起以 $\Gamma/(2\pi d)=10/(10\pi)=0.318$ 往 $-y$ 平移，间距不变。(b) 两个都是 $+10$：各自被对方推着、方向相反，绕中点转圈，angular velocity $0.318/2.5=0.127$，周期 49.3。

(c) 两个 vortex 从 $(\mp2.5,\,9)$ 出发往下走，$y=0$ 是一堵墙。墙的条件是 $v=0$。在墙另一侧对称地放一个 circulation 相反的 image vortex，每对 real 与 image 在 $y=0$ 上产生的 $v$ 正好抵消，条件就满足了。按对称性，两个 real vortex 始终在 $(\pm x,\,y)$。右边那个（$\Gamma=+10$）受三个 vortex 推动：

| 来源 | 位置 | $\Gamma$ | 给出的 $(u,v)$ |
|---|---|---|---|
| 左边的 real | $(-x,y)$ | $-10$ | $\left(0,\ -\dfrac{10}{4\pi x}\right)$ |
| 自己的 image | $(x,-y)$ | $-10$ | $\left(\dfrac{10}{4\pi y},\ 0\right)$ |
| 左边的 image | $(-x,-y)$ | $+10$ | $\left(-\dfrac{10\,y}{4\pi(x^2+y^2)},\ \dfrac{10\,x}{4\pi(x^2+y^2)}\right)$ |

相加：

$$\frac{dx}{dt}=\frac{10}{4\pi}\left[\frac1y-\frac y{x^2+y^2}\right]=\frac{10}{4\pi}\frac{x^2}{y(x^2+y^2)},\qquad\frac{dy}{dt}=\frac{10}{4\pi}\left[-\frac1x+\frac x{x^2+y^2}\right]=-\frac{10}{4\pi}\frac{y^2}{x(x^2+y^2)}$$

两式相除，$dy/dx=-y^3/x^3$，即 $dy/y^3=-dx/x^3$，integrate：

$$\frac1{x^2}+\frac1{y^2}=\text{const}=\frac1{2.5^2}+\frac1{9^2}=0.1723$$

$x\to\infty$ 时 $y\to1/\sqrt{0.1723}=2.41$：两个 vortex 不会撞上墙，它们在约 2.41 的高度分开，沿墙往两边走，速度趋于 $\frac{10}{4\pi}\cdot\frac1y=0.330$。

::fig[mit-12.800-pair] 用 4 阶 Runge–Kutta integrate 出的轨迹（虚线），和上面的 $1/x^2+1/y^2=$ const 重合。墙下面灰色的是 image vortex。

### Kelvin's circulation theorem

跟着一条 material curve 走，circulation 怎样变？对 $\Gamma=\oint\mathbf u\cdot d\mathbf x$ 求 derivative，curve 上的每一小段 $d\mathbf x$ 也随 flow 变形：

$$\frac{D\Gamma}{Dt}=\oint\frac{D\mathbf u}{Dt}\cdot d\mathbf x+\oint\mathbf u\cdot\frac{D(d\mathbf x)}{Dt}$$

$d\mathbf x$ 两端的 velocity 差就是 $d\mathbf u$，所以 $D(d\mathbf x)/Dt=d\mathbf u$，第二项是 $\oint\mathbf u\cdot d\mathbf u=\oint d\left(\tfrac12|\mathbf u|^2\right)=0$：一个 exact differential 绕一圈 integral 为零。剩下第一项，代入 Euler equation：

$$\frac{D\Gamma}{Dt}=\oint\left(-\frac1\rho\nabla p-\nabla(gz)\right)\cdot d\mathbf x$$

$\nabla(gz)\cdot d\mathbf x=d(gz)$，绕一圈为零。如果 density 只是 pressure 的 function（barotropic，$\rho=\rho(p)$），令 $P(p)=\int dp/\rho$，则 $\frac1\rho\nabla p=\nabla P$，也绕一圈为零。于是

$$\frac{D\Gamma}{Dt}=0$$

条件有三个：inviscid、barotropic、body force 是 conservative 的。任何一条不满足，circulation 就可以变。

### Baroclinic：circulation 从哪里来

Density 不只取决于 pressure 时（$\rho=\rho(p,T)$），等 $p$ 面和等 $\rho$ 面不平行。用 Stokes' theorem，

$$\frac{D\Gamma}{Dt}=-\oint\frac{dp}\rho=\int_A\frac{\nabla\rho\times\nabla p}{\rho^2}\cdot d\mathbf A$$

Pressure force 不再过一块 fluid 的 center of mass，形成 torque。

Sea breeze 是最直接的例子。白天 land 比 sea 暖 10 K。取一个 loop：近地面沿 1000 hPa 的 isobar，上面沿 900 hPa 的 isobar，两条竖线分别在 sea 和 land 上方，相距 20 km。用 ideal gas，$1/\rho=RT/p$：

$$\frac{D\Gamma}{Dt}=-\oint RT\,d\ln p$$

沿两条 isobar $dp=0$，没有贡献。在 land 上方往上走，$p$ 从 $p_0$ 降到 $p_1$，贡献 $-RT_2\ln(p_1/p_0)=RT_2\ln(p_0/p_1)$；在 sea 上方往下走，贡献 $-RT_1\ln(p_0/p_1)$。合起来

$$\frac{D\Gamma}{Dt}=R\ln\frac{p_0}{p_1}(T_2-T_1)=287\times\ln\frac{1000}{900}\times10=302\ \text{m}^2/\text{s}^2$$

正号说明 circulation 沿“land 上方往上、高处往 sea、sea 上方往下、近地面往 land”这个方向增长：近地面吹向 land，就是 sea breeze。Loop 的周长约 $2\times(20+1)$ km（900 hPa 约在 1 km 高），平均的切向 acceleration 是 $302/42000=7.2\times10^{-3}$ m/s²，一小时能加速到 26 m/s。实际的 sea breeze 只有几 m/s，friction 和 temperature 差被 circulation 本身抹平都会限制它；但它几小时内就建立起来，这个估计说明了原因。

::fig[mit-12.800-breeze] Loop 由两条 isobar 和两条竖线围成。暖的一侧同样的 pressure 差对应更厚的空气层，pressure force 绕 loop 一圈不再抵消。

### Vorticity equation：stretching 与 tilting

对 incompressible、$\rho$ 为 constant 的 Navier–Stokes 取 curl（lecture13.pdf）。用上面同一个 identity 改写 advection：

$$\frac{\partial\mathbf u}{\partial t}+\nabla\left(\tfrac12|\mathbf u|^2\right)+\boldsymbol\omega\times\mathbf u=-\nabla\left(\frac p\rho+gz\right)+\nu\nabla^2\mathbf u$$

取 curl，所有 gradient 项消失（$\nabla\times\nabla a=0$）：

$$\frac{\partial\boldsymbol\omega}{\partial t}+\nabla\times(\boldsymbol\omega\times\mathbf u)=\nu\nabla^2\boldsymbol\omega$$

再用 $\nabla\times(\mathbf A\times\mathbf B)=\mathbf A(\nabla\cdot\mathbf B)-\mathbf B(\nabla\cdot\mathbf A)+(\mathbf B\cdot\nabla)\mathbf A-(\mathbf A\cdot\nabla)\mathbf B$，$\nabla\cdot\mathbf u=0$，$\nabla\cdot\boldsymbol\omega=0$（curl 的 divergence 恒为零），得 $\nabla\times(\boldsymbol\omega\times\mathbf u)=\mathbf u\cdot\nabla\boldsymbol\omega-\boldsymbol\omega\cdot\nabla\mathbf u$。合并成 material derivative：

$$\frac{D\boldsymbol\omega}{Dt}=(\boldsymbol\omega\cdot\nabla)\mathbf u+\nu\nabla^2\boldsymbol\omega$$

Density 不是 constant 时 pressure 项的 curl 不为零，多出上面 sea breeze 里的那一项：

$$\frac{D\boldsymbol\omega}{Dt}=(\boldsymbol\omega\cdot\nabla)\mathbf u+\frac{\nabla\rho\times\nabla p}{\rho^2}+\nu\nabla^2\boldsymbol\omega$$

Pressure 和 gravity 都不见了，这是 vorticity 比 momentum 好用的地方。$(\boldsymbol\omega\cdot\nabla)\mathbf u$ 的 x-component 是 $\omega_x\partial u/\partial x+\omega_y\partial u/\partial y+\omega_z\partial u/\partial z$。第一项是 stretching：沿 vortex line 方向被拉长，那个方向的 vorticity 增大。后两项是 tilting：别的方向的 vorticity 被 shear 扳过来，变成 x 方向的。

2D flow 里 $\boldsymbol\omega=\omega_z\mathbf k$，$\mathbf u$ 不随 $z$ 变，$(\boldsymbol\omega\cdot\nabla)\mathbf u=\omega_z\partial\mathbf u/\partial z=0$，于是 inviscid 时 $D\omega_z/Dt=0$：每个 particle 带着自己的 vorticity 走。一个 flow 开始时 irrotational，就永远 irrotational。

### Helmholtz 的四条

在 Kelvin's theorem 的三个条件下（再加上 frame 不转），vortex line 有四个性质（lecture13.pdf）：

1. Vortex line 随 fluid 一起走。证明：取一块贴着 vortex tube 侧面的面，$\boldsymbol\omega$ 在它上面没有法向 component，绕它边界的 circulation 为零；Kelvin's theorem 说这个 circulation 永远为零，所以这块面始终贴着 vortex tube。
2. 一根 vortex tube 沿长度方向 circulation 处处相同。证明：沿 tube 侧面剪开取一个 loop $abcda$，侧面上没有法向 vorticity，loop 的 circulation 为零；两条沿剪口的边方向相反、抵消，剩下 tube 两端截面的 circulation 必须相等。
3. Vortex tube 不能在 fluid 内部终止，只能接到 boundary 上或者首尾相接成环。
4. Vortex tube 的 circulation 不随时间变（就是 Kelvin's theorem 本身）。

第 2 条加第 1 条马上给出 stretching 的定量结果：一根细 vortex tube 被拉长一倍，体积不变，cross-sectional area 减半，circulation 不变，vorticity 加倍。

:::note Problem Set 6 第 2、3 题
第 2 题要求从 $\Gamma=\iint_A\omega\,dA$ 出发，仿照 Reynolds transport theorem 的推导，用 Eulerian 的办法重新证明 Kelvin's theorem。第 3 题要求把 barotropic、inviscid 的 vorticity equation 写成 streamfunction 的形式 $D(\nabla^2\psi)/Dt=0$，并说出用到的假设：2D（stretching、tilting 项消失）、incompressible（streamfunction 才存在，$\zeta=\nabla^2\psi$）。第 9 站的 Rossby wave 就从这个 equation 出发。
:::

:::from
Vortex motion 的两种、polar coordinates 的 vorticity、两个 vortex 的 vorticity 与 circulation、Stokes' theorem 的切块论证、loop 不含原点时 circulation 为零、delta function、两句“irrotational 不排除 stress”、Rankine vortex 来自 lecture11.pdf；point vortex 的叠加、两个 vortex 的平移速度、method of images、Cartesian 的 velocity 公式与 RK4、Kelvin's theorem 的 Lagrangian 证明与三个条件、它失效的三种情形与 baroclinic torque 来自 [lecture12.pdf](https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/742b3656764a3d3a60d91f7d7ddd539c_lecture12.pdf)；Helmholtz 四条及其证明、vorticity equation 的推导、baroclinic 项、stretching 与 tilting、2D 时 $D\omega/Dt=0$ 来自 [lecture13.pdf](https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/39ab5419814f2e2e3effbf2a84967f95_lecture13.pdf)。Problem Set 6 读的是题目（circulation 的数值抽取时有乱码，按 $\mp10$ 读）。墙边 vortex pair 的 analytic solution $1/x^2+1/y^2=$ const、2.41 与 0.330、(b) 的周期、hurricane 的数字、point vortex 的 $e_{r\theta}$、sea breeze 的 loop 与 302 m²/s² 是为这一页算的；sea breeze 这个例子的设定（isobar 围成的 loop、$R\ln(p_0/p_1)\Delta T$）是我按 Holton 教材里常见的讲法凭记忆写的，Holton 是 12.800 列出的参考书之一，但我没有读到它。
:::

## [rot] Rotating frame 里的 balance：Taylor–Proudman、thermal wind、gradient wind

:::skip
能写出 rotating frame 里的 Kelvin's theorem 并算出一圈 fluid 收缩后的 relative vorticity，能由 vorticity equation 推出 Taylor–Proudman 与 thermal wind，能用 gradient wind 判断 geostrophic 估计偏大还是偏小，就可以去第 6 站。
:::

Rotating frame 里的 equation of motion、$f=2\Omega\sin\varphi$、inertial oscillation、Rossby number 和 geostrophic balance，见 [SIO-210 第 2 站](../courses/SIO-210.html#rot)和[第 3 站](../courses/SIO-210.html#geo)。下面从结果出发：地球上大尺度运动的简化 equation（lecture15.pdf 的 scaling：$W\ll U$ 丢掉含 $w$ 的 Coriolis 项，vertical 方向 hydrostatic，friction 只留 vertical 的那一项）是

$$\frac{Du}{Dt}-fv=-\frac1\rho\frac{\partial p}{\partial x}+\nu\frac{\partial^2u}{\partial z^2},\qquad\frac{Dv}{Dt}+fu=-\frac1\rho\frac{\partial p}{\partial y}+\nu\frac{\partial^2v}{\partial z^2},\qquad0=-\frac{\partial p}{\partial z}-\rho g$$

$f$ 取 constant $f_0$ 叫 f-plane；把 $f$ 在参考 latitude 附近展开到一阶，$f=f_0+\beta y$，$\beta=2\Omega\cos\varphi_0/R$，叫 β-plane。

这一站换一个角度：rotation 对 vorticity 做了什么。

### Kelvin's theorem 在 rotating frame 里

第 4 站的证明在 inertial frame 里做。在 rotating frame 里，momentum equation 多一个 Coriolis 项，$D\Gamma/Dt$ 多出 $\oint(-2\boldsymbol\Omega\times\mathbf u)\cdot d\mathbf x$。用 $(\mathbf A\times\mathbf B)\cdot\mathbf C=\mathbf A\cdot(\mathbf B\times\mathbf C)$ 改写成 $-2\boldsymbol\Omega\cdot\oint\mathbf u\times d\mathbf x$。$\mathbf u\,\Delta t\times d\mathbf x$ 是 curve 上一小段在 $\Delta t$ 里扫过的面积，所以 $\oint\mathbf u\times d\mathbf x$ 是 curve 所围面积（作为 vector）的变化率。$\boldsymbol\Omega$ 是 constant，可以拿到 derivative 外面：

$$\oint(-2\boldsymbol\Omega\times\mathbf u)\cdot d\mathbf x=-\frac D{Dt}\int_A2\boldsymbol\Omega\cdot d\mathbf A$$

移到左边：

$$\frac D{Dt}\int_A(\boldsymbol\omega+2\boldsymbol\Omega)\cdot d\mathbf A=0$$

守恒的是 absolute circulation $\Gamma_a$，里面的 $\boldsymbol\omega+2\boldsymbol\Omega$ 是相对 inertial frame 的 vorticity。对水平的一圈 fluid，$2\boldsymbol\Omega$ 的 vertical component 是 $2\Omega\sin\varphi=f$，所以 $(\zeta+f)A$ 守恒，$\zeta$ 是 relative vorticity 的 vertical component。$f$ 因此叫 planetary vorticity。

用一次。30°N 一圈半径 100 km 的空气，开始时相对地球静止（$\zeta=0$），因为 convergence 收缩到 50 km：

$$f\cdot\pi r_1^2=(\zeta+f)\pi r_2^2\quad\Rightarrow\quad\zeta=f\left(\frac{r_1^2}{r_2^2}-1\right)=3f=2.19\times10^{-4}\ \text{s}^{-1}$$

边上的 velocity 由 $\Gamma=\zeta\pi r_2^2=u_\theta\cdot2\pi r_2$ 得 $u_\theta=\zeta r_2/2=5.5$ m/s，逆时针，即 cyclonic。收缩的 low pressure 区自动转成 cyclone，不需要任何 force 去“拧”它。

::fig[mit-12.800-ring] 原本不转的一圈空气，收缩到一半半径，就以 5.5 m/s 逆时针转起来。

同样地，rotating frame 里的 vorticity equation 把 $\boldsymbol\omega$ 换成 $\boldsymbol\omega+2\boldsymbol\Omega$（lecture15.pdf）：

$$\frac{D\boldsymbol\omega}{Dt}=\big((\boldsymbol\omega+2\boldsymbol\Omega)\cdot\nabla\big)\mathbf u+\frac{\nabla\rho\times\nabla p}{\rho^2}+\nu\nabla^2\boldsymbol\omega$$

Planetary vorticity 永远在。所以第 2 站的 potential flow（处处 irrotational）在行星尺度上不存在：就算 $\boldsymbol\omega=0$，$2\boldsymbol\Omega\cdot\nabla\mathbf u$ 也会立刻产生 vorticity。

### Taylor–Proudman：rotation 让 fluid 变硬

在上式里 scaling（lecture18.pdf）：$\omega\sim U/L$，时间尺度 $L/U$，$D\boldsymbol\omega/Dt$ 和 $(\boldsymbol\omega\cdot\nabla)\mathbf u$ 都是 $U^2/L^2$，$(2\boldsymbol\Omega\cdot\nabla)\mathbf u\sim fU/L$。两者之比是 $U/(fL)=Ro$。$Ro\ll1$，再假设 inviscid、barotropic，只剩

$$(2\boldsymbol\Omega\cdot\nabla)\mathbf u=0$$

Velocity 沿转轴方向不变。在局部 coordinates 里只留 $\boldsymbol\Omega$ 的 vertical component $f/2$：

$$\frac{\partial u}{\partial z}=\frac{\partial v}{\partial z}=\frac{\partial w}{\partial z}=0$$

这是 Taylor–Proudman theorem。也可以从 geostrophy 直接看：$\rho$ 是 constant 时 $fu=-\frac1\rho\partial p/\partial y$，对 $z$ 求 derivative，$f\partial u/\partial z=-\frac1\rho\frac{\partial}{\partial y}\frac{\partial p}{\partial z}=-\frac1\rho\frac{\partial}{\partial y}(-\rho g)=0$。$w$ 也不随 $z$ 变：geostrophic flow 在 f-plane 上水平 non-divergent，$\partial w/\partial z=-(\partial u/\partial x+\partial v/\partial y)=0$。底部是平的，$w=0$，于是处处 $w=0$。

推论很强。Rotating tank 底部放一个矮 bump，慢慢拖着它走：贴着底的 fluid 只能绕开 bump（不能爬上去，因为 $w$ 处处为零），而 $\partial\mathbf u/\partial z=0$ 要求上面每一层都和底层一样绕开。整根水柱都像有一根看不见的 cylinder 立在 bump 上方。这叫 Taylor column。

::fig[mit-12.800-taylor] 右边的 streamline 是绕一根 cylinder 的 potential flow（$\psi=Uy(1-a^2/r^2)$）算出来的，Taylor column 外每一层的 flow 都接近它。

:::wrong Bump 只有水深的五分之一，上面五分之四的水可以从它顶上流过去
不转的 fluid 确实如此。$Ro\ll1$ 时 velocity 不能随高度变，底层被迫绕开，上层就得一起绕开。Lecture18.pdf 指出这需要 frictionless、barotropic、$Ro\ll1$ 同时成立；在真实 ocean 里 stratification 让 velocity 可以随深度变（下一节的 thermal wind），Taylor column 只在弱 stratification 时才明显。
:::

### Thermal wind：baroclinic 项和 tilting 平衡

不假设 barotropic，vorticity equation 在 $Ro\ll1$、inviscid 下剩两项（lecture18.pdf）：

$$0=f\frac{\partial\mathbf u}{\partial z}+\frac{\nabla\rho\times\nabla p}{\rho^2}$$

第一项是 planetary vorticity 被 vertical shear 扳倒（tilting），第二项是 baroclinic generation。大尺度运动 hydrostatic，$\nabla p$ 几乎竖直朝下，$\nabla p\approx-\rho g\,\mathbf k$：

$$f\frac{\partial\mathbf u}{\partial z}=-\frac{\nabla\rho\times(-\rho g\mathbf k)}{\rho^2}=\frac g\rho\nabla\rho\times\mathbf k=-\frac g\rho\,\mathbf k\times\nabla\rho$$

$\mathbf k\times\nabla\rho=(-\partial\rho/\partial y,\ \partial\rho/\partial x,\ 0)$，component 是

$$\frac{\partial u}{\partial z}=\frac g{f\rho}\frac{\partial\rho}{\partial y},\qquad\frac{\partial v}{\partial z}=-\frac g{f\rho}\frac{\partial\rho}{\partial x}$$

这就是 thermal wind，它在 [SIO-210 第 3 站](../courses/SIO-210.html#geo)里由 geostrophy 加 hydrostatic 推出，用来从 density section 算 Gulf Stream。这里多出的理解是：gravity 想把倾斜的 isopycnal 放平（baroclinic 项产生 horizontal vorticity），vertical shear 把 planetary vorticity 扳倒产生相反的 horizontal vorticity，两者正好抵消，isopycnal 才能一直斜着。

:::note Problem Set 8 第 2 题：thermal wind 是一层层的 geostrophy
设 temperature 从 equator 的 25 °C linearly 降到 North Pole 的 0 °C，每根 column 里 temperature 不随高度变，ideal gas。(a) 画出 latitude 0 到 90°N、高度 0 到 10 km 的 pressure 面，说明它们为什么越往上越陡。(b) 画出 45°N 附近 geostrophic wind 随高度的变化。

Hydrostatic 加 ideal gas：$dp/dz=-\rho g=-pg/(RT)$。$T$ 在一根 column 里是 constant，integrate 得 $p=p_s\exp(-gz/RT)$，pressure 为 $p$ 的面的高度是

$$z_p=\frac{RT}g\ln\frac{p_s}p$$

假设地面 pressure 处处相同。500 hPa 面在 equator 高 $\frac{287\times298.15}{9.81}\ln2=6046$ m，在 pole 高 5539 m，差 507 m。面的 slope 是 $\frac{\partial z_p}{\partial y}=\frac Rg\ln\frac{p_s}p\frac{\partial T}{\partial y}$：越往上 $\ln(p_s/p)$ 越大，slope 越陡，这回答了 (a)。

Pressure 面的 slope 就是 geostrophic wind（lecture16.pdf：$u=-\frac gf\frac{\partial z}{\partial y}\big|_p$）。代入，再用 $\ln(p_s/p)=gz/(RT)$ 换回高度：

$$u=-\frac Rf\ln\frac{p_s}p\frac{\partial T}{\partial y}=-\frac{gz}{fT}\frac{\partial T}{\partial y}$$

$\partial T/\partial y=-25\ \text{K}/(\pi R_E/2)=-25/10{,}007\ \text{km}=-2.50\times10^{-6}$ K/m，45°N 的 $f=1.031\times10^{-4}$ s⁻¹，$T=285.65$ K：

$$\frac{\partial u}{\partial z}=\frac{9.81\times2.50\times10^{-6}}{1.031\times10^{-4}\times285.65}=8.32\times10^{-4}\ \text{s}^{-1}$$

每升高 1 km westerly 增加 0.83 m/s，10 km 处 8.3 m/s。地面 pressure 均匀，地面 $u=0$；越往上越强的 westerly，正是 jet stream 的来源。
:::

::fig[mit-12.800-thermal] 按上面的公式算出的 pressure 面（左）和 45°N 的 $u(z)$（右）。

### Gradient wind：曲线流动时 geostrophy 差多少

Geostrophy 是 pressure gradient 和 Coriolis 两项平衡。流动沿着弯曲的 isobar 时，还需要 centripetal acceleration。Lecture16.pdf 用 cylindrical coordinates：steady、只有 $u_\theta$（逆时针为正），radial momentum 是

$$-\frac{u_\theta^2}r=-\frac1\rho\frac{\partial p}{\partial r}+fu_\theta$$

左边是 centripetal acceleration。Geostrophic 的估计是 $u_g=\frac1{f\rho}\frac{\partial p}{\partial r}$。解这个 quadratic：

$$u_\theta=-\frac{fr}2\pm\sqrt{\frac{f^2r^2}4+\frac r\rho\frac{\partial p}{\partial r}}$$

绕 low pressure（$\partial p/\partial r>0$）逆时针转的 cyclone：pressure force 向内，Coriolis 向外，还要有净的向内力提供 centripetal，所以 Coriolis 比 pressure force 小，$u_\theta<u_g$，叫 subgeostrophic。绕 high pressure（$\partial p/\partial r<0$）：根号里要非负，$|\partial p/\partial r|\le\rho f^2r/4$，high pressure 中心附近的 pressure gradient 有上限，所以那里风总是很弱。

:::note Problem Set 7 第 4 题：70°N 绕地球一圈的空气
一团空气在 70°N、3 km 高处以 20 m/s 匀速往东，绕地球一圈。(a) Coriolis force 指向哪里？(b) 忽略 friction，水平 pressure gradient force 指向哪里？(c) Pressure force 比 Coriolis 弱、相等还是强？

往东运动，北半球 Coriolis 在运动方向右边，指向南：$fu=2\Omega\sin70°\times20=1.3704\times10^{-4}\times20=2.74\times10^{-3}$ m/s²。这团空气沿 latitude circle 绕北极转，需要指向北极的 centripetal acceleration。Lecture15.pdf 的 spherical momentum equation 里，$v$ equation 有 curvature 项 $-u^2\tan\varphi/R$；steady、$v=0$ 时

$$0=-\frac1\rho\frac{\partial p}{\partial y}-\frac{u^2\tan\varphi}R-fu$$

所以 pressure force 指向北，大小是

$$-\frac1\rho\frac{\partial p}{\partial y}=fu+\frac{u^2\tan\varphi}R=2.74\times10^{-3}+\frac{400\times2.747}{6.371\times10^6}=2.74\times10^{-3}+1.72\times10^{-4}=2.91\times10^{-3}\ \text{m/s}^2$$

比 Coriolis 强 6.3%。$R/\tan\varphi=2319$ km 是这条 latitude circle 在当地水平面上看到的 radius of curvature，$u^2\tan\varphi/R$ 正是绕它转所需的 centripetal acceleration。绕北极往东转是逆时针，cyclonic，和上面 subgeostrophic 的结论一致。
:::

::fig[mit-12.800-grad70] 两个力方向相反，pressure force 稍大，差值让空气绕着北极转圈。

:::wrong 用 pressure 场算出的 geostrophic wind 就是实际的风
上面那团空气：如果按 geostrophy 从 pressure gradient 反推风速，$u_g=2.91\times10^{-3}/1.3704\times10^{-4}=21.3$ m/s，比实际的 20 m/s 大 6%。弯得越厉害（$r$ 越小）差得越多。Problem Set 8 第 1 题让学生从 500 mb 的 height 图上分别估 geostrophic 和 ageostrophic wind（题里的图读不到）。
:::

### Cyclostrophic：$Ro\gg1$ 时

Radius of curvature 小、速度大时 Coriolis 可以忽略，pressure gradient 直接和 centripetal 平衡：$u_\theta^2/r=\frac1\rho\partial p/\partial r$。第 4 站的 hurricane 核心：centripetal $u^2/r=50^2/30000=0.083$ m/s²，Coriolis $fu=4.99\times10^{-5}\times50=2.5\times10^{-3}$ m/s²，前者是后者的 33 倍，几乎是纯 cyclostrophic。用 Rankine vortex 估中心的 pressure 降：核心里 $dp/dr=\rho\Omega^2r$，integrate 到 $R$ 是 $\tfrac12\rho u_{max}^2$；外区 $dp/dr=\rho c^2/r^3$，从 $R$ 积到无穷远是 $\rho c^2/(2R^2)=\tfrac12\rho u_{max}^2$。合计 $\rho u_{max}^2=1.2\times2500=3000$ Pa，30 hPa。Cyclostrophic balance 里 pressure gradient 总是指向内，所以它只能绕 low，转向可以是任意的；龙卷风有顺时针的，也有逆时针的。

:::from
Curvature 项、rotating frame 的 vorticity equation 与 planetary vorticity、rotating frame 的 Kelvin's theorem（三重积与扫过面积的论证）、简化 momentum equations 的 scaling 来自 lecture15.pdf；f-plane、β-plane、inertial circle、geostrophy 的 scaling、pressure coordinates 里的 geostrophic wind、gradient wind 的 radial equation 与 subgeostrophic 的判断来自 lecture16.pdf；Taylor–Proudman 由 vorticity equation 的 scaling 推出、Taylor column、thermal wind 由 vorticity equation 推出并由 hydrostatic 化简、gravity 与 tilting 的平衡来自 [lecture18.pdf](https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/a23d92d6e97a2f2765c2064939a30b2c_lecture18.pdf)；high 只能有弱 gradient、cyclostrophic 的形式来自 [final review](https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/123387888816ae1352049141db64a789_finalreview.pdf)。Taylor–Proudman 由 geostrophy 直接推、$w$ 处处为零的论证参照 Vallis 讲义 1.8 节。Problem Set 7 第 4 题、Set 8 第 1、2 题读的是题目，OCW 没有答案，解答和数字是自己做的。空气圈收缩的例子、gradient wind 的解、hurricane 的 33 倍与 30 hPa 是为这一页算的；“龙卷风两种转向都有”是我自己的知识。
:::

## [ekman] Ekman layer 与 spin-down

:::skip
能说出转与不转时 boundary layer 厚度的差别，能解出 bottom Ekman layer 并推出 $w=\delta\zeta/2$，能算 spin-down time，就可以去第 7 站。
:::

### 转与不转：boundary layer 长不长

回到开头的第一件事。不转时，一层 fluid 在底部突然被 no-slip 拖住，momentum 的缺损靠 viscosity 往上传：

$$\frac{\partial u}{\partial t}=\nu\frac{\partial^2u}{\partial z^2}$$

Scaling：$U/T\sim\nu U/\delta^2$，$\delta\sim\sqrt{\nu T}$。Boundary layer 随时间无限地长厚（解是 $u=U\,\mathrm{erf}(z/2\sqrt{\nu t})$）。20 cm 要长 11 h。

转时，同样的 x-momentum 里多一个 Coriolis 项。$Ro\ll1$，pressure gradient 已经被 interior 的 geostrophic flow 用掉，对偏离 interior 的那部分 velocity 来说，平衡是（lecture18.pdf、lecture19.pdf）

$$-fv=\nu\frac{\partial^2u}{\partial z^2}$$

Scaling：$fU\sim\nu U/\delta^2$，

$$\delta\sim\sqrt{\frac\nu f}$$

和时间无关，和 $U$、$L$ 都无关。Layer 长到这个厚度就停了。Lecture19.pdf 的解释：shear 在不断产生 horizontal vorticity（它让 layer 想变厚），planetary vorticity 被 shear 扳倒（tilting）产生方向相反的 horizontal vorticity，两者平衡。

::fig[mit-12.800-bl] 两边是同一个问题的 numerical solution（interior 以 $U$ 流动，底部突然 no-slip），纵轴以 $\delta=\sqrt{2\nu/f}$ 为单位。不转的 layer 一直往上长；转的 layer 约一个 inertial period 后停住：彩色实线 u 落在黑色虚线的 steady Ekman 解上，彩色虚线是 v。

### Bottom Ekman layer 的解

Interior 是 geostrophic 的 $(u_I,v_I)$，不随 $z$ 变（Taylor–Proudman）。底部 $z=0$ 处 $u=v=0$。偏离 interior 的部分满足

$$-f(v-v_I)=\nu\frac{\partial^2(u-u_I)}{\partial z^2},\qquad f(u-u_I)=\nu\frac{\partial^2(v-v_I)}{\partial z^2}$$

合成一个 complex 量 $V=(u-u_I)+i(v-v_I)$：第二式乘 $i$ 加第一式，左边 $-f(v-v_I)+if(u-u_I)=if\,V$，右边 $\nu V''$：

$$V''=\frac{if}\nu V$$

$\frac{if}\nu=\frac{2i}{\delta^2}$，其中 $\delta=\sqrt{2\nu/f}$，而 $2i=(1+i)^2$，所以 $V=A\,e^{-(1+i)z/\delta}+B\,e^{(1+i)z/\delta}$。往上要回到 interior，$B=0$；底部 $V(0)=-(u_I+iv_I)$，$A=-(u_I+iv_I)$。展开 $e^{-(1+i)\zeta}=e^{-\zeta}(\cos\zeta-i\sin\zeta)$，$\zeta=z/\delta$：

$$u=u_I-e^{-\zeta}(u_I\cos\zeta+v_I\sin\zeta),\qquad v=v_I-e^{-\zeta}(v_I\cos\zeta-u_I\sin\zeta)$$

取 interior 往东，$u_I=U$、$v_I=0$：$u=U(1-e^{-\zeta}\cos\zeta)$，$v=Ue^{-\zeta}\sin\zeta$。Layer 里 $v>0$，flow 偏向 interior 方向的左边，也就是指向 low pressure 一侧（interior 往东时 low pressure 在北）。在 $\zeta=\pi$ 附近 $u$ 还略超过 $U$，上面动图右边虚线那根 u 的 overshoot 就是它。

### Ekman pumping：$w=\delta\zeta/2$

Layer 里的 flow 偏向 low pressure，在一个 cyclonic 的 interior 下面就是往中心汇聚，水只能往上走。定量地算：偏离部分的 transport

$$\int_0^\infty V\,dz=-(u_I+iv_I)\frac\delta{1+i}=-(u_I+iv_I)\frac{\delta(1-i)}2$$

实部和虚部是 $M_x=-\frac\delta2(u_I+v_I)$、$M_y=\frac\delta2(u_I-v_I)$。Continuity integrate 过整个 layer，底部 $w=0$，layer 顶上的 $w$ 等于这部分 transport 的 convergence：

$$w_E=-\left(\frac{\partial M_x}{\partial x}+\frac{\partial M_y}{\partial y}\right)=\frac\delta2\left(\frac{\partial u_I}{\partial x}+\frac{\partial v_I}{\partial x}-\frac{\partial u_I}{\partial y}+\frac{\partial v_I}{\partial y}\right)$$

f-plane 上 geostrophic 的 interior 水平 non-divergent，$\partial u_I/\partial x+\partial v_I/\partial y=0$，剩下

$$w_E=\frac\delta2\left(\frac{\partial v_I}{\partial x}-\frac{\partial u_I}{\partial y}\right)=\frac\delta2\,\zeta_I$$

Cyclonic 的 interior（$\zeta_I>0$）下面，水被从 layer 里抽上来（Ekman suction）；anticyclonic 的下面，水被压下去。

海面的 Ekman layer 由 wind stress 驱动，transport 是 $\boldsymbol\tau\times\mathbf k/(\rho f)$，pumping 是 $w_E=\mathbf k\cdot\nabla\times(\boldsymbol\tau/\rho f)$；这一套和 Ekman spiral 在 [SIO-210 第 4 站](../courses/SIO-210.html#ekman)里讲过，lecture19.pdf 给的典型量级是每年约 30 m。

### Spin-down

现在可以解释开头那个水槽。Interior 的 relative vorticity 由 rotating frame 的 vorticity equation 的 vertical component 决定。Linear、$\zeta\ll f$ 时，$(\boldsymbol\omega+2\boldsymbol\Omega)\cdot\nabla w\approx f\,\partial w/\partial z$：

$$\frac{\partial\zeta}{\partial t}=f\frac{\partial w}{\partial z}$$

这就是第 5 站空气圈的同一件事：column 被压扁（$\partial w/\partial z<0$）就失去 cyclonic vorticity。Interior 的 $w$ 随 $z$ linear 变化：底部 Ekman layer 顶上是 $\delta\zeta/2$，自由水面（没有 stress，没有 Ekman layer）是 0。

$$\frac{\partial w}{\partial z}=-\frac{\delta\zeta}{2H}\quad\Rightarrow\quad\frac{d\zeta}{dt}=-\frac{f\delta}{2H}\zeta\quad\Rightarrow\quad\zeta=\zeta_0e^{-t/\tau},\qquad\tau=\frac{2H}{f\delta}$$

水槽：$f=2\Omega=1$ s⁻¹，$\nu=10^{-6}$ m²/s，

$$\delta=\sqrt{\frac{2\times10^{-6}}1}=1.41\ \text{mm},\qquad\tau=\frac{2\times0.2}{1\times1.41\times10^{-3}}=283\ \text{s}=4.7\ \text{min}$$

和 diffusion 的 $H^2/\nu=4\times10^4$ s 比：

$$\frac{H^2/\nu}{2H/(f\delta)}=\frac{Hf\delta}{2\nu}=\frac H\delta=141$$

（用了 $f\delta^2=2\nu$。）1.4 mm 的 layer 管住 200 mm 的水，靠的是一个 secondary circulation，momentum 并没有被扩散上去：layer 把水抽上来，interior 的 column 被压扁、向外散开，按第 5 站的 absolute circulation 守恒失去 relative vorticity，水沿侧壁回到底部。Column 每被压扁一个比例 $\epsilon$，就失去 $\epsilon f$ 的 vorticity；要失去全部的 $\zeta$，只需要压扁 $\zeta/f$ 的比例，也就是从 interior 抽走 $H\zeta/f$ 厚的一层水。抽水的速度是 $\delta\zeta/2$，所需时间 $\dfrac{H\zeta/f}{\delta\zeta/2}=\dfrac{2H}{f\delta}$，正是 $\tau$。

::fig[mit-12.800-spindown] 比 tank 转得快的水（$\zeta>0$）。底层往轴心汇聚，中间被抽上来，上面往外，沿侧壁下沉；箭头的强弱和右边的 $\zeta$ 一起按 4.7 min 衰减。

:::wrong Ekman layer 只有 1.4 mm 厚，viscosity 又那么小，它对上面 20 cm 的水不可能有什么影响
直接靠 viscosity 传 momentum 确实要 11 h。但 Ekman layer 的作用是间接的：它产生的 $w_E=\delta\zeta/2$ 很小（$\zeta=0.1$ s⁻¹ 时只有 0.07 mm/s），可它作用在整个水柱上，每秒压扁 column 的比例是 $\delta\zeta/(2H)$，乘上 $f$ 就是 vorticity 的衰减率。结果是 $\tau=2H/(f\delta)$，比 diffusion 快 $H/\delta=141$ 倍。
:::

:::edge 有盖子时
顶上也是 no-slip 的盖子，就有上下两个 Ekman layer，$\partial w/\partial z=-\delta\zeta/H$，$\tau=H/(f\delta)$，快一倍。
:::

:::edge Ocean 的 spin-down
Ocean 里要用 eddy viscosity。Vallis 讲义给的 ocean 值约 $0.1$ m²/s（Ekman depth 常在 50 m 以内）。取 $f=10^{-4}$ s⁻¹：$\delta=\sqrt{2\times0.1/10^{-4}}=45$ m；全深 $H=4000$ m 的 barotropic 运动，只有底部 layer 时 $\tau=2\times4000/(10^{-4}\times45)=1.8\times10^6$ s，约 21 天。这个估计很粗，eddy viscosity 本身就是一个 parameterization（第 2 站）。
:::

:::from
不转与转的两种 boundary layer scaling（$\sqrt{\nu T}$、$\sqrt{\nu L/U}$ 与 $\sqrt{\nu/f}$）来自 lecture18.pdf；$\delta$ 与时间、速度、长度无关以及 shear 与 tilting 平衡的解释、ocean 表面的 Ekman transport、spiral 的 complex 解法、pumping 的 curl 公式与每年约 30 m、pumping 驱动 interior 往 equator 走与 Sverdrup 来自 [lecture19.pdf](https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/7a1125dbddc624466eec36973022e0c5_lecture19.pdf)。Bottom Ekman layer 的设定、解和 $w(\infty)=\delta\omega_I/2$ 来自 [MIT 1.63 讲义第 7.5 节](https://ocw.mit.edu/courses/1-63-advanced-fluid-dynamics-of-the-environment-fall-2002/5eb39d252373555793e9410457c327ea_75cyclone.pdf)（讲义说解留作练习，没有推导，这里的 complex 推导和 transport integral 是自己补的）。Ocean eddy viscosity 的值来自 Vallis 讲义 5.1 节。Spin-down 的 equation 与 $\tau=2H/(f\delta)$、$H/\delta$ 的比值、水槽的数字和 numerical solution 是我自己推导和计算的，没有在读过的讲义里找到对应的段落；“实验里水几分钟就跟上了”是 spin-up 实验的常识，我没有读到具体的实验报告。
:::

## [sw] Shallow water equations 与 potential vorticity

:::skip
能从 hydrostatic 和 continuity 推出 shallow water equations，能用 cross-differentiation 推出 $(\zeta+f)/h$ 守恒，能用它算 column 越过 seamount 时的 vorticity，就可以去第 8 站。
:::

### 为什么要一个更简单的模型

Taylor–Proudman 说 rotating fluid 里 velocity 不随高度变。可是海底有起伏，海面在动，column 的高度在变。第 5 站的空气圈说明 column 横截面一变，vorticity 就变；column 高度一变，横截面也得变。需要一个模型，velocity 不随 $z$ 变，但 column 的高度 $h(x,y,t)$ 可以变。这就是 shallow water。

### 推导

一层 density 为 constant 的 fluid，上面是自由表面 $\eta(x,y,t)$，下面是海底 $\eta_b(x,y)$，厚度 $h=\eta-\eta_b$。水平尺度远大于深度，用 hydrostatic。从表面（$p=0$）往下 integrate：

$$p(x,y,z,t)=\rho g\,(\eta-z)\qquad\Rightarrow\qquad\frac{\partial p}{\partial x}=\rho g\frac{\partial\eta}{\partial x},\quad\frac{\partial p}{\partial y}=\rho g\frac{\partial\eta}{\partial y}$$

Horizontal pressure gradient 和 $z$ 无关。所以如果 $u$、$v$ 开始时不随 $z$ 变，它们的 acceleration 也不随 $z$ 变，就一直不随 $z$ 变（这是一个假设，bottom friction 会在 boundary layer 里破坏它）。Momentum equation 是

$$\frac{Du}{Dt}-fv=-g\frac{\partial\eta}{\partial x},\qquad\frac{Dv}{Dt}+fu=-g\frac{\partial\eta}{\partial y}$$

这里的 $D/Dt=\partial/\partial t+u\,\partial/\partial x+v\,\partial/\partial y$，没有 $w\,\partial/\partial z$（$u$、$v$ 不随 $z$ 变）。

Continuity：$\partial w/\partial z=-(\partial u/\partial x+\partial v/\partial y)$，右边和 $z$ 无关，从海底积到海面：

$$w(\eta)-w(\eta_b)=-h\left(\frac{\partial u}{\partial x}+\frac{\partial v}{\partial y}\right)$$

海面和海底都是 material surface，上面的 fluid 不会离开它，所以 $w(\eta)=D\eta/Dt$、$w(\eta_b)=D\eta_b/Dt$，相减是 $Dh/Dt$：

$$\frac{Dh}{Dt}+h\left(\frac{\partial u}{\partial x}+\frac{\partial v}{\partial y}\right)=0$$

三个 equation，三个 unknown $(u,v,h)$，independent variable 只剩 $(x,y,t)$：vertical momentum 被 hydrostatic 吸收，$w$ 被 continuity 消去。

上面一层轻水浮在一层很深、几乎不动的重水上时，结构完全相同，只要把 $g$ 换成 reduced gravity $g'=g\,\Delta\rho/\rho$，$\eta$ 换成 interface 的位移（lecture20.pdf 的两层推导，rigid lid 的 limit）。[SIO-210 第 8 站](../courses/SIO-210.html#enso)的 thermocline 用的就是这个模型。

### Potential vorticity

对两个 momentum equation 做 cross-differentiation：第二式对 $x$ 求 derivative，减去第一式对 $y$ 求 derivative。Pressure 项 $\partial^2\eta/\partial x\partial y-\partial^2\eta/\partial y\partial x=0$，消掉了。时间项给 $\partial\zeta/\partial t$，$\zeta=\partial v/\partial x-\partial u/\partial y$。Advection 项：

$$\frac{\partial}{\partial x}\left(u\frac{\partial v}{\partial x}+v\frac{\partial v}{\partial y}\right)-\frac{\partial}{\partial y}\left(u\frac{\partial u}{\partial x}+v\frac{\partial u}{\partial y}\right)=u\frac{\partial\zeta}{\partial x}+v\frac{\partial\zeta}{\partial y}+\frac{\partial u}{\partial x}\frac{\partial v}{\partial x}+\frac{\partial v}{\partial x}\frac{\partial v}{\partial y}-\frac{\partial u}{\partial y}\frac{\partial u}{\partial x}-\frac{\partial v}{\partial y}\frac{\partial u}{\partial y}$$

后四项两两合并：$\frac{\partial v}{\partial x}\left(\frac{\partial u}{\partial x}+\frac{\partial v}{\partial y}\right)-\frac{\partial u}{\partial y}\left(\frac{\partial u}{\partial x}+\frac{\partial v}{\partial y}\right)=\zeta\,\nabla\cdot\mathbf u$。Coriolis 项：$\frac{\partial(fu)}{\partial x}+\frac{\partial(fv)}{\partial y}=f\nabla\cdot\mathbf u+\beta v$（$f$ 只随 $y$ 变）。全部合起来：

$$\frac{D\zeta}{Dt}+(\zeta+f)\,\nabla\cdot\mathbf u+\beta v=0$$

$\beta v=Df/Dt$（$f$ 不随时间变，$Df/Dt=v\,df/dy$），所以前后两项合成 $D(\zeta+f)/Dt$。Continuity 给 $\nabla\cdot\mathbf u=-\frac1h\frac{Dh}{Dt}$：

$$\frac{D(\zeta+f)}{Dt}-\frac{\zeta+f}h\frac{Dh}{Dt}=0$$

除以 $h$，左边正是 $\frac D{Dt}\left(\frac{\zeta+f}h\right)$ 的展开 $\frac1h\frac{D(\zeta+f)}{Dt}-\frac{\zeta+f}{h^2}\frac{Dh}{Dt}$。所以

$$\frac D{Dt}\left(\frac{\zeta+f}h\right)=0$$

$(\zeta+f)/h$ 叫 shallow water potential vorticity，跟着每一根 column 守恒。

Lecture21.pdf 指出另一条路更一般：一根 column 的 absolute circulation $(\zeta+f)A$ 守恒（第 5 站），体积 $hA$ 守恒，两式相除就是 $(\zeta+f)/h$ 守恒。Cross-differentiation 的结果依赖于从哪组 equation 出发，circulation 的论证只要求 $h$ 是两个 material surface 之间的距离。所以把 $h$ 换成两个 isopycnal 之间的距离（stratified ocean）、两个 $\theta$ 面之间的距离（atmosphere），同一个式子都成立。

### 用一次：越过 seamount

30°N 一根原本不转（$\zeta=0$）、高 4000 m 的 column，被 flow 带着越过一个水深只有 3000 m 的 seamount。PV 守恒：

$$\frac{0+f}{4000}=\frac{\zeta+f}{3000}\qquad\Rightarrow\qquad\zeta=f\left(\frac{3000}{4000}-1\right)=-0.25f=-1.82\times10^{-5}\ \text{s}^{-1}$$

Column 被压扁、变粗，同时以 $-0.25f$ 的 relative vorticity 顺时针转（anticyclonic）。离开 seamount、高度恢复后，$\zeta$ 回到零。

::fig[mit-12.800-column] Column 的宽度按体积守恒算（cross-sectional area 与 $h$ 成反比），上面那根短棒按 $\zeta/2$ integrate 出的角度转动。

Column 也可以不转：如果它在越过 seamount 时同时往南移，让 $f$ 按 $h$ 的比例减小，$\zeta$ 就可以保持为零。需要 $f_2=0.75f_1$，$\sin\varphi_2=0.75\times\sin30°=0.375$，$\varphi_2=22.0°$N。$\zeta$ 小（$Ro\ll1$）的 steady flow 只能这样走：沿着 $f/h$ 的 contour，这叫 topographic steering。在 f-plane 上 $f/h$ 的 contour 就是等深线，flow 绕着 seamount 走，这就是第 5 站的 Taylor column 在 shallow water 里的样子。

:::wrong Column 原本相对地球不转，越过 seamount 时也没有理由转起来
没有任何 torque 作用在它上面，这个直觉在不转的 frame 里是对的。但 column 相对 inertial frame 本来就带着 planetary vorticity $f$ 在转，守恒的是 $(\zeta+f)/h$。压扁到原来的 3/4，absolute vorticity 必须从 $f=7.29\times10^{-5}$ 降到 $0.75f=5.47\times10^{-5}$ s⁻¹，相对地球看就是 $\zeta=-1.82\times10^{-5}$ s⁻¹ 的顺时针转动。没有 torque，absolute angular momentum 守恒，横截面变大，转得就慢了，慢下来的那部分在地球上看就是反方向的转动。
:::

### 一个推论：westerly 为什么稳

Lecture21.pdf 的 stability 论证。深度不变时 PV 守恒退化成 absolute vorticity 守恒 $D(\zeta+f)/Dt=0$。一股原本 $\zeta=0$ 的 westerly，一个 parcel 被往北推，$f$ 变大，$\zeta$ 必须变负，顺时针转的 flow 把它往南推回去；被往南推，$\zeta$ 变正，又被推回来。$\beta$ 提供了 restoring force。被推回去会冲过头，于是出现振荡，这就是第 9 站的 Rossby wave。

:::from
Shallow water 的设定（barotropic、可变深度）、hydrostatic 给出与 $z$ 无关的 pressure gradient、continuity 的 vertical integral 与 $w(h)=Dh/Dt$、两层模型与 reduced gravity、cross-differentiation 得到 vorticity equation（20.117 式）与 PV 守恒，来自 [lecture20.pdf](https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/827e12037f63fbf714baebb84bf9b0f5_lecture20.pdf)；由 Kelvin's theorem 推 PV、两条路的比较、PV 的各种 $h$、westerly 的 stability 论证来自 [lecture21.pdf](https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/bd93c29039040c13dfc0b42ab1a84ccb_lecture21.pdf)。“bottom friction 会破坏 $z$ 无关”、$h=\eta-\eta_b$ 的记号和 material surface 的论证参照 Vallis 讲义 2.1、2.4 节。Advection 项四个乘积合并成 $\zeta\nabla\cdot\mathbf u$ 的逐项展开、seamount 的 $-0.25f$、22.0°N、topographic steering 与 Taylor column 的联系是为这一页写的。Lecture21.pdf 里 flow 越过 mountain 的逐点轨迹分析（深度序列 $h_2=h_4>h_1=h_5>h_3$）复述得不够清楚，没有写进来。
:::

## [grav] Gravity wave、geostrophic adjustment 与 Kelvin wave

:::skip
能写出 rotating shallow water 的 dispersion relation 并说出三支各是什么，能用 linearized PV 解出 step 的 adjustment 终态并算出 energy 的去向，能写出 Kelvin wave 的结构和传播方向，就可以去第 9 站。
:::

### Linearize

开头第二件事是一个 initial value problem：一块抬高的 interface 放开以后去哪里。先把上一站的 equation 在静止、平均深度 $H$、f-plane 的状态附近 linearize。$\eta$ 是表面（或 interface）的位移，$h=H+\eta$，perturbation 小，乘积项丢掉：

$$\frac{\partial u}{\partial t}-fv=-g\frac{\partial\eta}{\partial x},\qquad\frac{\partial v}{\partial t}+fu=-g\frac{\partial\eta}{\partial y},\qquad\frac{\partial\eta}{\partial t}+H\left(\frac{\partial u}{\partial x}+\frac{\partial v}{\partial y}\right)=0$$

### 不转：gravity wave

$f=0$。对 continuity 求 $\partial/\partial t$，把两个 momentum equation 代进去：

$$\frac{\partial^2\eta}{\partial t^2}=-H\left(\frac{\partial^2u}{\partial x\partial t}+\frac{\partial^2v}{\partial y\partial t}\right)=gH\nabla^2\eta$$

Wave equation，speed $c=\sqrt{gH}$。代 plane wave $e^{i(kx+ly-\omega t)}$：$\omega^2=gHK^2$，$K^2=k^2+l^2$。$\omega/K$ 与 $K$ 无关，non-dispersive，phase speed 和 group velocity 相同。全深 4000 m 的 ocean，$c=\sqrt{9.81\times4000}=198$ m/s（tsunami 的速度）；thermocline 上 $g'=0.02$ m/s²、$H=500$ m 的 interface，$c=\sqrt{0.02\times500}=3.16$ m/s。

### 转：Poincaré wave

同样代 plane wave $(u,v,\eta)=(U,V,E)\,e^{i(kx+ly-\omega t)}$：

$$-i\omega U-fV+igkE=0,\qquad fU-i\omega V+iglE=0,\qquad iHkU+iHlV-i\omega E=0$$

要有非零解，coefficient matrix 的 determinant 为零。按第一行展开：

$$\det\begin{pmatrix}-i\omega&-f&igk\\f&-i\omega&igl\\iHk&iHl&-i\omega\end{pmatrix}=i\omega\left(\omega^2-f^2-gHK^2\right)=0$$

（第一项 $-i\omega(-\omega^2+gHl^2)$，第二项 $f(-i\omega f+gHkl)$，第三项 $igk(ifHl-\omega Hk)=-gfHkl-i\omega gHk^2$；$gHkl$ 抵消，剩下的合成上式。）三个根：

- $\omega=0$：不随时间变的 geostrophic flow。
- $\omega^2=f^2+c^2K^2$：Poincaré wave（也叫 inertia-gravity wave）。

Poincaré wave 的 frequency 永远大于 $f$。两种 limit 由 $K$ 和 $f/c$ 的比较决定，这个比值的倒数

$$L_d=\frac cf=\frac{\sqrt{gH}}f$$

叫 Rossby radius of deformation。Wavelength 远小于 $L_d$（$KL_d\gg1$）：$\omega\approx cK$，回到不转的 gravity wave，rotation 来不及起作用。Wavelength 远大于 $L_d$：$\omega\approx f$，只剩 inertial oscillation，pressure gradient 太弱，fluid 只是在 Coriolis 下自由地画圈。

::fig[mit-12.800-poincare] 三支解。Poincaré wave 的 curve 从 $\omega=f$ 出发，在 $KL_d$ 大约超过 2 以后贴近不转的 $\omega=cK$。

| | $c$ | $f$ | $L_d$ |
|---|---|---|---|
| 全深 ocean（barotropic） | 198 m/s | $10^{-4}$ s⁻¹ | 1981 km |
| Thermocline（$g'=0.02$，$H=500$ m） | 3.16 m/s | $10^{-4}$ s⁻¹ | 31.6 km |

Thermocline 这一行和第 3 站由 $NH/f$ 估的 31 km 是同一个量。

### Geostrophic adjustment：为什么 step 不会变平

现在回答开头的问题。Interface 一开始是一个 step，$\eta=-\eta_0\,\mathrm{sgn}(x)$（左高右低），$u=v=0$。

**不转时**，wave equation 的解是 $\eta=\tfrac12[F(x-ct)+F(x+ct)]$，$F$ 是初始形状。Step 分成两半，各以 $c$ 往两边走；$|x|<ct$ 的范围里 $\eta=0$，只剩 $u=g\eta_0/c$ 的均匀流动。足够久以后，任何有限范围里 interface 都变平，全部 potential energy 都被 wave 带到了无穷远。

**转时**，不能这样逐个算 wave，因为有一个量不随时间变，它决定了终态。对 linear equation 做 cross-differentiation（上一站的 linear 版本）：

$$\frac{\partial\zeta}{\partial t}+f\nabla\cdot\mathbf u=0,\qquad\frac{\partial\eta}{\partial t}+H\nabla\cdot\mathbf u=0\qquad\Rightarrow\qquad\frac\partial{\partial t}\left(\zeta-\frac fH\eta\right)=0$$

$q=\zeta-f\eta/H$ 是 linearized PV，每一点的值永远等于初始值。初始 $\zeta=0$：

$$q(x)=\frac{f\eta_0}H\,\mathrm{sgn}(x)$$

Gravity wave 走掉以后剩下的是 $\omega=0$ 的那一支，geostrophic：$v=\frac gf\frac{\partial\eta}{\partial x}$，$u=0$（$\eta$ 不随 $y$ 变），$\zeta=\frac{\partial v}{\partial x}=\frac gf\frac{\partial^2\eta}{\partial x^2}$。代入 $q$：

$$\frac gf\frac{d^2\eta}{dx^2}-\frac fH\eta=\frac{f\eta_0}H\mathrm{sgn}(x)\qquad\Rightarrow\qquad\frac{d^2\eta}{dx^2}-\frac\eta{L_d^2}=\frac{\eta_0}{L_d^2}\mathrm{sgn}(x)$$

$x>0$ 时 particular solution 是 $-\eta_0$，homogeneous solution 是 $e^{\pm x/L_d}$，要求远处有界，只留 $e^{-x/L_d}$：$\eta=-\eta_0+Ae^{-x/L_d}$。$x<0$ 一侧是它的反对称。$\eta$ 在 $x=0$ 处连续，反对称要求 $\eta(0)=0$，所以 $A=\eta_0$：

$$\eta=-\eta_0\,\mathrm{sgn}(x)\left(1-e^{-|x|/L_d}\right),\qquad v=\frac gf\frac{d\eta}{dx}=-\frac{g\eta_0}{fL_d}e^{-|x|/L_d}$$

Step 只在 $x=0$ 附近约一个 $L_d$ 的范围里变缓，远处保持原样。交界处留下一条往南的 jet（高的一侧在西，北半球 geostrophic flow 让高 pressure 在右手边，往南走时右手边是西）。Thermocline 的例子：interface 跳 100 m（$\eta_0=50$ m），jet 的最大速度 $g'\eta_0/c=0.02\times50/3.16=0.32$ m/s，宽约 30 km。

::fig[mit-12.800-adjust] 对 linear equation 做 numerical integration 得到的过程（单位：$L_d$ 与 $1/f$）。上面不转，两个 front 走掉后中间完全平；下面转，front 照样走掉，中间却停在虚线那条由 PV 算出的曲线附近；残留的 inertial oscillation 衰减得很慢（约按 $t^{-1/2}$），$ft=24$ 时还看得见。初始的 step 为了数值稳定做了一点平滑，所以 jet 的峰值略小于 1。

### Energy 去了哪里

Energy 是 $E=\tfrac12\int(Hv^2+g\eta^2)\,dx$（per unit length in $y$，per unit density）。Potential energy 释放了多少（只看变化的部分）：

$$\Delta PE=\frac g2\int_{-\infty}^\infty(\eta_0^2-\eta^2)\,dx=g\eta_0^2\int_0^\infty\left[1-(1-e^{-x/L_d})^2\right]dx=g\eta_0^2L_d\int_0^\infty(2e^{-s}-e^{-2s})\,ds=\frac32g\eta_0^2L_d$$

Jet 的 kinetic energy：

$$KE=\frac H2\int v^2dx=\frac H2\frac{g^2\eta_0^2}{f^2L_d^2}\cdot2\int_0^\infty e^{-2x/L_d}dx=\frac H2\frac{g^2\eta_0^2}{f^2L_d^2}L_d=\frac12g\eta_0^2L_d$$

（最后一步用 $f^2L_d^2=gH$。）释放的 potential energy 只有三分之一留在 jet 里，三分之二被 inertia-gravity wave 带走。

:::wrong 终态是 energy 最低的状态，所以 potential energy 应该全部释放，像不转时一样
不转时确实如此。转的时候，每一点的 PV 都被锁死了，终态是“PV 等于初始值的所有状态里 energy 最低的那个”。Vallis 讲义用 variational 方法证明：在 PV 固定的约束下求 energy 的 minimum，得到的正好是 geostrophic balance。上面的数字：$\tfrac32g\eta_0^2L_d$ 被释放，$\tfrac12g\eta_0^2L_d$ 变成 jet；而初始的 potential energy 在无界区域里是无穷大，绝大部分一点也没有动。Rotation 把 potential energy 储存起来，这正是大洋 thermocline 能长期保持倾斜的原因。
:::

### Kelvin wave：贴着 coast 走的 wave

有 coast 时多出一种 wave。Coast 在 $y=0$，fluid 在 $y>0$，coast 处 $v=0$。Lecture22.pdf 的做法：试着让 $v$ 处处为零。Equation 变成

$$\frac{\partial u}{\partial t}=-g\frac{\partial\eta}{\partial x},\qquad fu=-g\frac{\partial\eta}{\partial y},\qquad\frac{\partial\eta}{\partial t}+H\frac{\partial u}{\partial x}=0$$

第一、三式和不转的 1D 问题完全一样，消去 $\eta$ 得 $\partial^2u/\partial t^2=c^2\partial^2u/\partial x^2$，解是 $u=F_1(x+ct,y)+F_2(x-ct,y)$，对应 $\eta=\sqrt{H/g}\,(-F_1+F_2)$。第二式是沿岸方向的 $u$ 和离岸方向的 pressure gradient 之间的 geostrophic balance，它决定 $y$ 方向的形状：

- 往 $+x$ 走的 $F_2$：$fF_2=-g\sqrt{H/g}\,\partial F_2/\partial y$，即 $\partial F_2/\partial y=-F_2/L_d$，$F_2\propto e^{-y/L_d}$，离岸衰减，可以。
- 往 $-x$ 走的 $F_1$：$\partial F_1/\partial y=+F_1/L_d$，$F_1\propto e^{y/L_d}$，离岸无限增长，不行。

所以

$$u=e^{-y/L_d}G(x-ct),\qquad v=0,\qquad\eta=\sqrt{\frac Hg}\,e^{-y/L_d}G(x-ct)$$

Kelvin wave 以不转的 gravity wave 的速度 $c$ 沿岸走，non-dispersive，只能朝一个方向：北半球 coast 在传播方向的右手边。离岸的宽度是 $L_d$。

::fig[mit-12.800-kelvin] 一个 surface 抬高的 bump 贴着 coast 往右走。水只沿岸流动（$v=0$），抬高处的离岸 pressure gradient 正好被沿岸 velocity 的 Coriolis 平衡。

50 m 深的 continental shelf：$c=\sqrt{9.81\times50}=22.1$ m/s，55°N 的 $f=1.195\times10^{-4}$ s⁻¹，$L_d=185$ km。一个半封闭的海盆里，Kelvin wave 只能让 coast 在右手边，于是绕海盆逆时针走一圈；North Sea 的 tide 就是这样绕着几个不动的点转（这一句是我自己的知识）。

:::edge Singapore 附近
1.3°N 的 $f=3.31\times10^{-6}$ s⁻¹，同样 50 m 深的 shelf，$L_d=22.1/3.31\times10^{-6}=6700$ km，比任何海盆都宽，coast 困不住它。Equator 附近起作用的是 $\beta$：$f\approx\beta y$ 在 equator 两侧反号，wave 被困在 equator 附近，成为 equatorial Kelvin wave（[SIO-210 第 8 站](../courses/SIO-210.html#enso)）。Lecture22.pdf 最后用它讲 ENSO 的 delayed action oscillator：westerly wind burst 同时发出往东的 downwelling Kelvin wave 和往西的 upwelling Rossby wave，后者在西边界反射成 Kelvin wave 带回相反的信号；横越 Pacific 的时间和 El Niño 的时间尺度在 SIO-210 那一站算过。
:::

:::from
Linearize 的步骤、不转与转两种 dispersion relation、三个根的意义、Poincaré wave 的两个 limit 与 $R_d=c/f$、Kelvin wave 取 $v=0$、wave equation、$U_1$ 与 $U_2$ 一个增长一个衰减、delayed action oscillator 的四步，来自 [lecture22.pdf](https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/7d3888b50457c8728fb4751569f20770_lecture22.pdf)（讲义的 $h$ 在 22.84 与 22.87 式符号不一致，这里按 Vallis 取正号）。Step 的不转解、linear PV $q=\zeta-f\eta/H$、终态 equation 与解、$\tfrac32$ 与 $\tfrac12$ 的 energy、variational 的说法、Kelvin wave 绕海盆逆时针，来自 [Vallis 讲义 2.5、2.6 节](https://empslocal.ex.ac.uk/people/staff/gv219/ecmm719/lecnotes18w.pdf)。12.800 自己的讲义里没有 geostrophic adjustment，这一部分完全跟 Vallis。Determinant 的逐项展开、energy integral 的中间步骤、两组 $L_d$、thermocline 的 jet、Kelvin wave 的 shelf 数字和 Singapore 的 6700 km、numerical solution 的动图是为这一页算的；North Sea 的 tide 是我自己的知识，没有对照来源。
:::

## [rossby] Rossby wave

:::skip
能由 β-plane 上的 vorticity equation 推出 $\omega=Uk-\beta k/K^2$，能算 stationary wavelength、phase speed 与 group velocity，能写出有限 $L_d$ 时的 dispersion relation，就读完了这一页。
:::

### Equation

深度不变时，上一站的 PV 守恒退化成 absolute vorticity 守恒（lecture20.pdf 由 Kelvin's theorem 直接推出）：

$$\frac{D(\zeta+f)}{Dt}=0\qquad\Leftrightarrow\qquad\frac{D\zeta}{Dt}+\beta v=0$$

Flow 水平 non-divergent，用 streamfunction（GFD 的符号惯例）$u=-\partial\psi/\partial y$、$v=\partial\psi/\partial x$，$\zeta=\nabla^2\psi$。在均匀的 westerly $U$ 附近 linearize：$u=U+u'$，perturbation 的乘积丢掉，

$$\frac{\partial}{\partial t}\nabla^2\psi+U\frac\partial{\partial x}\nabla^2\psi+\beta\frac{\partial\psi}{\partial x}=0$$

### 机制

先不解 equation，看 $D(\zeta+f)/Dt=0$ 怎样让一条 material line 动起来。一条原本沿 latitude 的线（$\zeta=0$）被推成 sinusoidal 的形状，$y$ 方向的位移是 $\eta(x)$。每个 parcel 的 $\zeta+f$ 不变，北移 $\eta$ 的 parcel 的 $f$ 多了 $\beta\eta$，所以

$$\zeta=-\beta\eta$$

往北突出的 crest 得到 $\zeta<0$（顺时针），往南凹进的 trough 得到 $\zeta>0$（逆时针）。顺时针的 crest 西边是往北的 flow，逆时针的 trough 东边也是往北的 flow：两者之间、crest 西边四分之一 wavelength 处，$v$ 往北，把那里的线往北推，crest 就往西长过去。同理 crest 东边 $v$ 往南。整条线往西移。

::fig[mit-12.800-rossby] Crest 和 trough 上的 vorticity 由 $\zeta=-\beta\eta$ 给出，它们诱导的 $v$ 比位移错开四分之一 wavelength，波形于是往西平移。

定量地：$\zeta=\partial v/\partial x$（这里只有 $v$），取 $\eta=a\sin kx$，$v=\int\zeta\,dx=\frac{\beta a}k\cos kx$。而 $v=\partial\eta/\partial t$，所以 $\eta=a\sin k(x-ct)$ 要求 $-kca\cos kx=\frac{\beta a}k\cos kx$，$c=-\beta/k^2$。往西，而且越长的 wave 越快。

### Dispersion relation

代 $\psi=\Psi e^{i(kx+ly-\omega t)}$，$\nabla^2\psi=-K^2\psi$：

$$-i\omega(-K^2)+U(ik)(-K^2)+\beta(ik)=0\qquad\Rightarrow\qquad\omega=Uk-\frac{\beta k}{K^2}$$

Phase speed 和 group velocity 的 x-component：

$$c_x=\frac\omega k=U-\frac\beta{K^2},\qquad c_{gx}=\frac{\partial\omega}{\partial k}=U+\frac{\beta(k^2-l^2)}{(k^2+l^2)^2}$$

（$\partial(k/K^2)/\partial k=(K^2-2k^2)/K^4=(l^2-k^2)/K^4$。）相对 flow 而言 phase 永远往西；flow 越强，往东带得越多。

### 开头第三件事

Phase speed 为零时 wave 停在原地：$U=\beta/K^2$，$K_s=\sqrt{\beta/U}$。45°N：

$$\beta=\frac{2\Omega\cos45°}R=\frac{2\times7.292\times10^{-5}\times0.7071}{6.371\times10^6}=1.62\times10^{-11}\ \text{m}^{-1}\text{s}^{-1}$$

$U=15$ m/s，$K_s=\sqrt{1.62\times10^{-11}/15}=1.04\times10^{-6}$ m⁻¹，wavelength $2\pi/K_s=6049$ km。45°N 一圈长 $2\pi R\cos45°=28{,}306$ km，放得下 4.7 个。比这长的 wave 往西退，比这短的被 flow 带着往东。

:::wrong Phase 往西，所以 Rossby wave 把 energy 也往西带
Energy 走 group velocity。$l=0$ 时 $c_{gx}=U+\beta/k^2$，比 $c_x=U-\beta/k^2$ 多了 $2\beta/k^2$。刚才那个 stationary wave：phase 不动，$c_{gx}=U+\beta/k^2=2U=30$ m/s，energy 以 30 m/s 往东跑。$U=0$ 时也一样：phase 以 $\beta/k^2$ 往西，energy 以同样的速度往东。只有 $k^2<l^2$ 的 wave，energy 才往西。所以上游一个地形或热源激发的 stationary wave，波形固定在下游，perturbation 的 energy 却源源不断地往下游送。
:::

### 有限的 deformation radius

深度可变时用 PV。Lecture21.pdf 在静止状态附近 linearize shallow water PV，并假设一阶的 flow 是 geostrophic（quasi-geostrophic）：linear PV equation 是 $\frac\partial{\partial t}\left(\zeta-\frac{f_0}H\eta\right)+\beta v=0$（上一站的 $q$ 加上 $\beta$），用 $v=\frac g{f_0}\frac{\partial\eta}{\partial x}$、$\zeta=\frac g{f_0}\nabla^2\eta$，乘 $f_0/g$：

$$\frac\partial{\partial t}\left(\nabla^2\eta-\frac{\eta}{L_d^2}\right)+\beta\frac{\partial\eta}{\partial x}=0,\qquad L_d^2=\frac{gH}{f_0^2}$$

代 plane wave：

$$\omega=-\frac{\beta k}{k^2+l^2+L_d^{-2}}$$

和 barotropic 的差别是分母多了 $L_d^{-2}$。物理上：column 南北移动时，除了改变 $\zeta$，还可以靠改变高度 $h$ 来保持 PV；改变 $h$ 要推动 surface，比只改变 $\zeta$ 更“硬”，wave 变慢。

两个 limit：

- $K\gg1/L_d$：回到 barotropic 的 $-\beta k/K^2$。
- $K\ll1/L_d$：$\omega\approx-\beta L_d^2k$，$c_x=-\beta L_d^2$，与 $K$ 无关，non-dispersive。代 reduced gravity 的 $L_d^2=g'H/f^2$，就是 [SIO-210 第 5 站](../courses/SIO-210.html#gyre)从 long wave 推出的 $c_R=\beta g'H/f^2$。

Nondimensionalize（$l=0$）：$\omega/(\beta L_d)=-kL_d/(k^2L_d^2+1)$。它在 $kL_d=1$ 处取到最小值 $-\tfrac12$：Rossby wave 的 frequency 有上限 $\beta L_d/2$。左边（long wave）slope 为负，energy 往西；右边（short wave）slope 为正，energy 往东。

::fig[mit-12.800-rdisp] 虚线的 slope 是 phase speed，实线（tangent）的 slope 是 group velocity。同一条曲线上，phase 处处往西，energy 在最低点两侧方向相反。

用 thermocline 的数字（$f=10^{-4}$ s⁻¹ 对应 43.3°N，$\beta=1.67\times10^{-11}$，$L_d=31.6$ km）：

$$c_{long}=-\beta L_d^2=-1.67\times10^{-11}\times(3.16\times10^4)^2=-1.7\ \text{cm/s},\qquad\omega_{max}=\frac{\beta L_d}2=2.63\times10^{-7}\ \text{s}^{-1}$$

最短的周期 $2\pi/\omega_{max}=2.4\times10^7$ s，约 276 天。这个 latitude 的 baroclinic Rossby wave 不可能比约 9 个月更快地振荡；比这更快的变化，ocean 只能用 gravity wave 回应。

:::edge $L_d\to\infty$ 与 rigid lid
$L_d\to\infty$（$H$ 很深或 $f$ 很小）时 $L_d^{-2}\to0$，回到 barotropic 的结果。Lecture21.pdf 指出 barotropic 时 $c_x=-\beta/K^2$ 在 $K\to0$ 时趋于无穷，而有限 $L_d$ 给 phase speed 设了上限 $\beta L_d^2$。
:::

:::from
Displaced fluid line 产生 relative vorticity 并被往西推的图像、由 Kelvin's theorem 推 $D\zeta/Dt+\beta v=0$、linearize、streamfunction、dispersion relation、phase speed、stationary 条件 $k^2+l^2=\beta/\bar u$、group velocity 与 dispersion diagram 的读法，来自 lecture20.pdf；shallow water 的 QG linear equation（21.50 式）、有限 $R_d$ 的 dispersion relation、phase speed 有上限、group velocity 可东可西，来自 lecture21.pdf；phase 与 group 的定义和读图来自 [waves primer](https://ocw.mit.edu/courses/12-800-fluid-dynamics-of-the-atmosphere-and-ocean-fall-2004/6aae0ce58d9d0548af482b517ffe591c_wavesprimer.pdf)；material line 的 PV 论证、$c_{gx}$ 往东往西的条件参照 Vallis 讲义第 4 章。Lecture20.pdf 写的 streamfunction 惯例是 $u=-\partial\psi/\partial y$，与第 4 站 lecture10.pdf 推荐的 Lamb 惯例一致。$\zeta=-\beta\eta$ 到 $c=-\beta/k^2$ 的定量推导、45°N 的 6049 km 与 4.7 个波、stationary wave 的 30 m/s、43.3°N 的 1.7 cm/s 与 276 天是为这一页算的。课表上 lecture21、22 还有 barotropic instability 与 shear instability，我读到的这两份 PDF 里没有这部分内容，这一页没有写。
:::

## 真题走读：待补

OCW 没有公开 12.800 的 midterm 和 final，也没有 problem set 的答案，所以这一页没有真题走读；各站 `:::note` 里走过的是 problem set 的题目，解法是自己做的。Lecture13.pdf 列了 midterm 的复习范围（第 1 到 4 站的内容：fluid 的定义、Eulerian 与 Lagrangian、Cauchy–Stokes decomposition、Reynolds transport theorem、Boussinesq 与 Navier–Stokes、Bernoulli、potential flow、circulation、Kelvin 与 Helmholtz、vorticity equation），final review 列了全课的公式清单，可以当作自测的目录。
