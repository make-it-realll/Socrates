---
title: 换一个 frame 看
lead: "Robot arm 的 transform 与 twist、camera 的 extrinsics 与 ray、SLAM 的 edge，是同一套 SE(3) 运算在八门课里换了名字和方向。"
line: sig
---

先看两次在实验台上会遇到的事故。两次程序都没有报错，每个数单独看也没有算错。

除了桥二用到的两个 3D 例子，全页的例子都放在 arm 所在的竖直 plane 里：$x$ 向右，$y$ 向上，一个 pose 是三个数 $(x,y,\phi)$。Planar camera 的 optical axis 记作 $\hat x_c$，image 只有一个 coordinate $u=f\,y_c/x_c+c$，取 $f=500$、$c=320$。这是 [RB2202 第 2 站](../courses/RB2202.html#tf)和 [CS4277 第 7 站](../courses/CS4277.html#ba)用过的同一种简化，3D 时每一步都照搬，只是 matrix 大一些。

**第一次。** 桌边立着一个 camera，用 OpenCV 做 calibration，得到一组 $(R,t)$。Depth 读数换算出桌上的 cube 在 camera frame 里是 $p_c=(1.656,\,0.032)$。程序把 $(R,t)$ 当作 camera 在 base frame $\{s\}$ 里的 pose，算出 cube 在 $(1.443,\,0.436)$。Arm 伸过去，停在离桌面 44 cm 的空中；cube 实际在 $(1.2,\,0.05)$，差了 0.46 m。

::fig[thread-frames-extr] 彩色的是 camera 的真实 pose：在 $(2,1.5)$，optical axis 朝 $-120°$。虚线是把 $(R,t)$ 当成 pose 时程序以为的 camera：在桌面以下的 $(2.299,-0.982)$，朝 $120°$。同一个 $p_c$ 从两个 camera 出发，落到两个地方。

**第二次。** Gripper 要原地拧一个旋钮：绕 perpendicular 于 plane 的 axis 以 1 rad/s 转，origin 不动。它此刻在 $(1.2,\,0.8)$，朝向 30°。上层的 planner 用 Drake 写，发出 spatial velocity $(\omega,v_x,v_y)=(1,0,0)$；下层的 controller 照 Modern Robotics 的 capstone 写，把收到的三个数当作 spatial twist $\mathcal V_s$。Gripper 没有原地转，而是绕 arm 的 base 甩出一段 radius 1.44 m 的 arc，0.5 s 后离原处 0.71 m。

::fig[thread-frames-spin] 虚线是 1.6 s 前的起点。白色的 gripper 是想要的：原地转。彩色的是实际执行的：同样的 $(1,0,0)$ 被读成“绕 $\{s\}$ 的 origin 转”，gripper 跟着走了一大段 arc。两者的 orientation 每一刻都相同，所以只看 orientation 的检查发现不了。

两次的数都对，错在没有写清它们是**什么相对什么、写在哪组 axis 上**。Pose、velocity、increment，各门课都要回答这两件事，回答的方式是同一副骨架。

## 骨架一：pose 是一次换 frame

### 三根 axis 排成一个 matrix

一个 frame $\{b\}$ 由 origin $o_b$ 和三根互相 perpendicular 的 unit axis $\hat x_b,\hat y_b,\hat z_b$ 组成。一个点在 $\{b\}$ 里的 coordinate 是 $p_b=(p_1,p_2,p_3)$，意思是：从 $o_b$ 出发，沿三根 axis 各走 $p_1$、$p_2$、$p_3$ 到达它。要在另一个 frame $\{a\}$ 里写同一个点，把这句话里的 origin 和三根 axis 都换成它们在 $\{a\}$ 里的 coordinate：

$$p_a=o_b+p_1\hat x_b+p_2\hat y_b+p_3\hat z_b=R_{ab}\,p_b+p_{ab}$$

其中 $R_{ab}=\begin{pmatrix}\hat x_b&\hat y_b&\hat z_b\end{pmatrix}$ 的 column 是 $\{b\}$ 的三根 axis，$p_{ab}$ 是 $\{b\}$ 的 origin，都在 $\{a\}$ 里量。三根 axis orthonormal，所以 $R_{ab}^\top R_{ab}=I$；再要求 right-handed，$\det R_{ab}=1$。

Vector 末尾补一个 1，rotation 和 translation 装进同一个 matrix：

$$T_{ab}=\begin{pmatrix}R_{ab}&p_{ab}\\0&1\end{pmatrix},\qquad\begin{pmatrix}p_a\\1\end{pmatrix}=T_{ab}\begin{pmatrix}p_b\\1\end{pmatrix}$$

再接一个 frame $\{c\}$，$p_b=R_{bc}p_c+p_{bc}$，代进去：

$$p_a=R_{ab}(R_{bc}p_c+p_{bc})+p_{ab}=R_{ab}R_{bc}\,p_c+(R_{ab}p_{bc}+p_{ab})$$

这正是 $T_{ab}T_{bc}$ 按 block 乘出来的结果，所以 $T_{ac}=T_{ab}T_{bc}$：相邻的 subscript 相消。反过来由 $p_a=Rp_b+p$ 解 $p_b$，两边减 $p$ 再左乘 $R^\top$：

$$p_b=R^\top p_a-R^\top p\quad\Longrightarrow\quad T_{ba}=T_{ab}^{-1}=\begin{pmatrix}R^\top&-R^\top p\\0&1\end{pmatrix}$$

所有这样的 $T$ 组成 $SE(3)$；planar 时 $R$ 是 $2\times2$ 的，$T$ 是 $3\times3$ 的，叫 $SE(2)$。

### 第一次事故：$(R,t)$ 是哪个方向

Camera 的真实 pose 是 $\{c\}$ 在 $\{s\}$ 里：origin $(2,1.5)$，$\hat x_c$ 朝 $-120°$。$\cos(-120°)=-0.5$，$\sin(-120°)=-0.866$，第一个 column 是 $\hat x_c$，第二个是把它转 90° 的 $\hat y_c$：

$$T_{sc}=\begin{pmatrix}-0.5&0.866&2\\-0.866&-0.5&1.5\\0&0&1\end{pmatrix},\qquad T_{sc}\begin{pmatrix}1.656\\0.032\\1\end{pmatrix}=\begin{pmatrix}1.200\\0.050\\1\end{pmatrix}$$

第一个 row：$-0.5\times1.656+0.866\times0.032+2=-0.828+0.028+2$；第二个 row：$-0.866\times1.656-0.5\times0.032+1.5=-1.434-0.016+1.5$。这是 cube 的真实位置。

OpenCV 的文档写明，它给出的 rotation 和 translation 是把一个点从 world frame 搬进 camera frame 的 transform，记作 ${}^c\mathbf T_w$；COLMAP 的 `images.txt` 存的也是“从 world 到 camera coordinate system 的 projection”，并说明 camera center 要另算 $-R^\top t$。所以 calibration 给出的是 $T_{cs}$：

$$T_{cs}=T_{sc}^{-1}=\begin{pmatrix}-0.5&-0.866&2.299\\0.866&-0.5&-0.982\\0&0&1\end{pmatrix}$$

左上角是 $R_{sc}^\top$，translation 是 $-R_{sc}^\top p_{sc}=-\big(-0.5\times2-0.866\times1.5,\ 0.866\times2-0.5\times1.5\big)=(2.299,\,-0.982)$。

把它当成 pose，就是拿 $T_{cs}$ 去乘 $p_c$。Subscript 规则当场就能看出问题：$T_{cs}$ 右边的 subscript 是 $s$，它要接一个写在 $\{s\}$ 里的点，$p_c$ 的 subscript 对不上。乘出来是 $(-0.5\times1.656-0.866\times0.032+2.299,\ 0.866\times1.656-0.5\times0.032-0.982)=(1.443,\,0.436)$，就是开头那个错的位置。

:::wrong Calibration 文件里的 $t$ 就是 camera 的位置
$t=(2.299,-0.982)$ 是 $\{s\}$ 的 origin 在 camera frame 里的 coordinate（$T_{cs}$ 的 translation 是 $p_{cs}$）。Camera 的位置是 $T_{sc}$ 的 translation，要先转再取负：$-R^\top t$，这里 $R^\top=R_{sc}$，$-R_{sc}t=-\big(-0.5\times2.299+0.866\times(-0.982),\ -0.866\times2.299-0.5\times(-0.982)\big)=(2,\,1.5)$。还有一个让这个错很难被发现的地方：rotation 不改变长度，$\|t\|$ 总是等于 camera 到 origin 的 distance（这里都是 2.5），只检查 distance 的 sanity check 会通过。
:::

### 同一个 $T$ 的三种读法

1. **Pose。** $T_{ab}$ 的 column 是 $\{b\}$ 的 axis 和 origin，在 $\{a\}$ 里量。
2. **换 coordinate。** $p_a=T_{ab}p_b$。
3. **Motion。** 拿一个 transform $M$ 去乘 $T_{ab}$。右乘 $T_{ab}M$ 读成 $T_{ab}T_{bb'}$：$M$ 是在 $\{b\}$ 自己的 frame 里描述的 motion。左乘 $MT_{ab}$ 读成 $T_{aa'}T_{a'b'}$：$\{a\}$ 先被 $M$ 搬到 $\{a'\}$，$\{b\}$ 连同它相对 $\{a\}$ 的关系一起被带走，$M$ 是在 $\{a\}$ 里描述的。[RB2202 第 2 站](../courses/RB2202.html#tf)用 gripper 沿 $\hat x$ 走 0.1 m 比较过两者。

## 骨架二：velocity 是一个 twist，换 frame 用 Ad

### $\dot T$ 有 12 个数，rigid body 只有 6 个 degree of freedom

$R^\top R=I$ 对 time 求 derivative：$\dot R^\top R+R^\top\dot R=0$，即 $R^\top\dot R=-(R^\top\dot R)^\top$，是 skew-symmetric matrix；同理 $\dot RR^\top$ 也是。$3\times3$ 的 skew-symmetric matrix 只有 3 个独立的数，写成 $[\omega]$，满足 $[\omega]x=\omega\times x$。于是 $\dot T$ 从左边或右边乘上 $T^{-1}$，都只剩 6 个数：

$$T^{-1}\dot T=\begin{pmatrix}R^\top\dot R&R^\top\dot p\\0&0\end{pmatrix}=\begin{pmatrix}[\omega_b]&v_b\\0&0\end{pmatrix}$$

$$\dot TT^{-1}=\begin{pmatrix}\dot RR^\top&\dot p-\dot RR^\top p\\0&0\end{pmatrix}=\begin{pmatrix}[\omega_s]&v_s\\0&0\end{pmatrix}$$

$\mathcal V_b=(\omega_b,v_b)$ 叫 body twist，$\mathcal V_s=(\omega_s,v_s)$ 叫 spatial twist，angular 在前。两个 linear part 的读法不同：

- $v_b=R^\top\dot p$ 是 body origin 的 velocity，写在 body 自己的 axis 上。
- $v_s=\dot p-\omega_s\times p=\dot p+\omega_s\times(0-p)$。Rigid body 上任意一点 $x$ 的 velocity 是 $\dot p+\omega_s\times(x-p)$，取 $x=0$ 就是它：把 body 想成无限大，$v_s$ 是 body 上此刻经过 $\{s\}$ origin 的那一点的 velocity。

两者的关系由定义直接得到：$\dot TT^{-1}=T(T^{-1}\dot T)T^{-1}$。按 block 乘，

$$T\begin{pmatrix}[\omega_b]&v_b\\0&0\end{pmatrix}T^{-1}=\begin{pmatrix}R[\omega_b]R^\top&Rv_b-R[\omega_b]R^\top p\\0&0\end{pmatrix}$$

Rotation 保持 cross product：$R[\omega_b]R^\top x=R(\omega_b\times R^\top x)=(R\omega_b)\times x$，所以 $R[\omega_b]R^\top=[R\omega_b]$，

$$\omega_s=R\,\omega_b,\qquad v_s=R\,v_b+p\times(R\,\omega_b)$$

$$\mathcal V_s=[\mathrm{Ad}_T]\,\mathcal V_b,\qquad[\mathrm{Ad}_T]=\begin{pmatrix}R&0\\{[p]}R&R\end{pmatrix}$$

Planar 时 $\omega$ 只有一个数（绕 perpendicular 于 plane 的 axis），$p\times(0,0,\omega)=(\omega p_y,\,-\omega p_x,\,0)$，$[\mathrm{Ad}_T]$ 变成 $3\times3$：

$$\begin{pmatrix}\omega_s\\v_s\end{pmatrix}=\begin{pmatrix}1&0&0\\p_y&R_{11}&R_{12}\\-p_x&R_{21}&R_{22}\end{pmatrix}\begin{pmatrix}\omega_b\\v_b\end{pmatrix}$$

### 三个库，三组数

Drake 的 spatial velocity ${}^WV^B_W$（[MIT 6.4210 第 1 站](../courses/MIT-6.4210.html#pick)）是第三种写法：angular 在前，translational 部分是 body origin 的 velocity $\dot p$，写在 world 的 axis 上。Drake 的文档说 translational component 总是指 body 上某一个固定的点，默认是 origin。

拿一个一般的 motion 比较。Body $\{e\}$ 此刻在 $p=(1.2,0.8)$，朝向 30°，绕点 $q=(0.6,1.4)$ 以 $\omega=1$ rad/s 逆时针转。Planar 里 $\hat z\times(a,b)=(-b,a)$，origin 的 velocity 是

$$\dot p=\omega\,\hat z\times(p-q)=\hat z\times(0.6,\,-0.6)=(0.6,\,0.6)$$

| 写法 | $(\omega,v_x,v_y)$ | 怎么算的 |
|---|---|---|
| Drake ${}^WV^E_W$ | $(1,\ 0.6,\ 0.6)$ | $(\omega,\ \dot p)$ |
| Modern Robotics $\mathcal V_s$ | $(1,\ 1.4,\ -0.6)$ | $\dot p-\omega\hat z\times p=(0.6,0.6)-(-0.8,1.2)$ |
| Modern Robotics $\mathcal V_b$ | $(1,\ 0.820,\ 0.220)$ | $R(-30°)\,\dot p$ |

用 $[\mathrm{Ad}_T]$ 核对：$R(30°)(0.820,0.220)=(0.866\times0.820-0.5\times0.220,\ 0.5\times0.820+0.866\times0.220)=(0.6,0.6)$，加上 $\omega(p_y,-p_x)=(0.8,-1.2)$，得 $(1.4,-0.6)$。$v_s$ 也可以按读法直接算：body 上经过 origin 的那一点绕 $q$ 转，velocity 是 $\hat z\times(0-q)=(1.4,-0.6)$。MIT 6.4210 的教材也是这样对应的：screw theory 的 spatial twist 是 ${}^AV^{B_A}$，$B_A$ 是固定在 $B$ 上、此刻与 $A$ 重合的那个 frame。

::fig[thread-frames-twists] Body 绕 $q$ 匀速转。彩色箭头 $v_s$ 画在 $\{s\}$ 的 origin 上，一直不变；在虚线 body axis 上读出的 $v_b$ 也不变；只有 body origin 的 velocity $\dot p$（Drake 的 translational part）跟着转。

回到第二次事故。原地转时 $\dot p=0$：Drake 给 $(1,0,0)$，$\mathcal V_b$ 也是 $(1,0,0)$，$\mathcal V_s=(1,\ 0.8,\ -1.2)$。只做 translation、沿 world 的 $x$ 以 0.1 m/s 走时，Drake 和 $\mathcal V_s$ 都是 $(0,\,0.1,\,0)$，$\mathcal V_b=(0,\ 0.087,\ -0.05)$。所以 controller 把 Drake 的数当 $\mathcal V_b$ 用，原地转的测试会通过；当 $\mathcal V_s$ 用，translation 的测试会通过。只有一般的 motion 能把三种写法分开。事故里 $(1,0,0)$ 被当成 $\mathcal V_s$，意思是“经过 $\{s\}$ origin 的那一点不动”，也就是绕 base 转；gripper 离 base $\sqrt{1.2^2+0.8^2}=1.44$ m，沿 arc 以 1.44 m/s 走。

## 骨架三：exp 把 twist 积成 motion，log 把两个 pose 相减

### Twist 不变时，pose 是一个 matrix exponential

由定义，$\dot T=[\mathcal V_s]\,T$，也等于 $T\,[\mathcal V_b]$。Twist 不变时，这是 constant coefficient 的 linear ODE：

$$T(t)=e^{[\mathcal V_s]t}\,T(0)=T(0)\,e^{[\mathcal V_b]t}$$

Series 能化成 closed form，靠的是 $[\omega]$ 的 power 会循环。设 $\|\omega\|=1$。由 $a\times(b\times c)=b\,(a\cdot c)-c\,(a\cdot b)$，$[\omega]^2x=\omega(\omega\cdot x)-x$，即 $[\omega]^2=\omega\omega^\top-I$；再乘一次 $[\omega]$，因为 $[\omega]\omega=\omega\times\omega=0$，得 $[\omega]^3=-[\omega]$。于是 $[\omega]^4=-[\omega]^2$，$[\omega]^5=[\omega]$，依此类推。Series 按 $[\omega]$ 和 $[\omega]^2$ 分组：

$$\begin{aligned}e^{[\omega]\theta}&=I+[\omega]\big(\theta-\tfrac{\theta^3}{3!}+\cdots\big)\\&\quad+[\omega]^2\big(\tfrac{\theta^2}{2!}-\tfrac{\theta^4}{4!}+\cdots\big)\\&=I+\sin\theta\,[\omega]+(1-\cos\theta)\,[\omega]^2\end{aligned}$$

这是 Rodrigues formula（[RB2202 第 1 站](../courses/RB2202.html#rot)有完整的数值例子）。Twist 的 $4\times4$ matrix $[\mathcal S]=\begin{pmatrix}[\omega]&v\\0&0\end{pmatrix}$ 自乘，$[\mathcal S]^k=\begin{pmatrix}[\omega]^k&[\omega]^{k-1}v\\0&0\end{pmatrix}$（$k\ge1$），所以 $e^{[\mathcal S]\theta}$ 的 translation 部分是

$$\sum_{k\ge1}\frac{\theta^k}{k!}[\omega]^{k-1}v=\Big(I\theta+\tfrac{\theta^2}{2!}[\omega]+\tfrac{\theta^3}{3!}[\omega]^2+\tfrac{\theta^4}{4!}[\omega]^3+\cdots\Big)v$$

用同样的循环分组，$[\omega]$ 的 coefficient 是 $\frac{\theta^2}{2!}-\frac{\theta^4}{4!}+\cdots=1-\cos\theta$，$[\omega]^2$ 的 coefficient 是 $\frac{\theta^3}{3!}-\frac{\theta^5}{5!}+\cdots=\theta-\sin\theta$：

$$e^{[\mathcal S]\theta}=\begin{pmatrix}e^{[\omega]\theta}&G(\theta)\,v\\0&1\end{pmatrix}$$

$$G(\theta)=I\theta+(1-\cos\theta)[\omega]+(\theta-\sin\theta)[\omega]^2$$

用上面那个绕 $q$ 转的 body 检验，走 $t=0.5$ s。$\mathcal V_s=(1,1.4,-0.6)$，所以 $\omega=\hat z$、$\theta=0.5$、$v=(1.4,-0.6)$；planar 里 $[\hat z]v=(0.6,1.4)$，$[\hat z]^2v=-v$。$1-\cos0.5=0.1224$，$0.5-\sin0.5=0.0206$：

$$G\,v=0.5\begin{pmatrix}1.4\\-0.6\end{pmatrix}+0.1224\begin{pmatrix}0.6\\1.4\end{pmatrix}+0.0206\begin{pmatrix}-1.4\\0.6\end{pmatrix}=\begin{pmatrix}0.745\\-0.116\end{pmatrix}$$

$e^{[\mathcal V_s]\,0.5}\,T(0)$ 的 translation 是 $R(0.5)\,p+G\,v=(0.670,1.277)+(0.745,-0.116)=(1.414,\,1.161)$。直接按几何算：$p-q=(0.6,-0.6)$ 绕 $q$ 转 0.5 rad 得 $(0.814,-0.239)$，加回 $q$ 是 $(1.414,1.161)$，一样。

### Log：两个 pose 之差

反过来，给两个 pose $T_1$、$T_2$，问哪个不变的 twist 在单位时间里把 $T_1$ 带到 $T_2$。由上面两种写法：

$$[\mathcal V_b]=\log\big(T_1^{-1}T_2\big),\qquad[\mathcal V_s]=\log\big(T_2T_1^{-1}\big)$$

$\log$ 把 exp 倒过来算：$\operatorname{tr}R=1+2\cos\theta$ 给出 $\theta$，$R-R^\top=2\sin\theta\,[\omega]$ 给出 $\omega$，$v=G(\theta)^{-1}p$（[Modern Robotics 第 2 站](../courses/NW-MODERNROBOTICS.html#twist)有 $G^{-1}$ 的式子和例子）。两种 difference 之间差一个 $[\mathrm{Ad}]$。$(T[\mathcal X]T^{-1})^k=T[\mathcal X]^kT^{-1}$，逐项相加得 $e^{T[\mathcal X]T^{-1}}=T\,e^{[\mathcal X]}\,T^{-1}$，于是

$$T_2T_1^{-1}=T_1\big(T_1^{-1}T_2\big)T_1^{-1}$$

$$\Longrightarrow\quad\log\big(T_2T_1^{-1}\big)=[\mathrm{Ad}_{T_1}]\log\big(T_1^{-1}T_2\big)$$

（log 写成 6-vector。）把 $T(0)$、$T(0.5)$ 代进去实算：$\log(T(0)^{-1}T(0.5))=(0.5,\,0.410,\,0.110)=0.5\,\mathcal V_b$，$\log(T(0.5)\,T(0)^{-1})=(0.5,\,0.7,\,-0.3)=0.5\,\mathcal V_s$。

### 小 increment 乘在哪一边

IK、registration、bundle adjustment、SLAM 都要反复把一个 pose 改一点点。$R$ 有 9 个 entry、6 个 constraint，直接对 entry 做 gradient step，结果就不再是 rotation。办法是让 unknown 只有 6 个数 $\delta$，用 exp 把它变成一个合法的小 motion，再乘上去：

$$T\leftarrow T\,e^{[\delta_b]}\quad\text{或}\quad T\leftarrow e^{[\delta_s]}\,T$$

前一种的 $\delta_b$ 写在 $T$ 自己的 frame 里，后一种的 $\delta_s$ 写在 fixed frame 里。两者描述同一个 motion 时 $e^{[\delta_s]}T=Te^{[\delta_b]}$，即 $e^{[\delta_s]}=Te^{[\delta_b]}T^{-1}=e^{[\mathrm{Ad}_T\delta_b]}$，所以 $\delta_s=[\mathrm{Ad}_T]\,\delta_b$。

Solà 等人的 *A micro Lie theory for state estimation in robotics* 把前一种叫 right-plus，$\mathcal X\oplus\tau=\mathcal X\,\mathrm{Exp}(\tau)$，说这个 $\tau$ expressed in the local frame；后一种叫 left-plus，$\tau$ 在 global frame；全文默认用 right。它把 6 个数排成 translation 在前，所以它的 $\mathrm{Ad}$ 写成 $\begin{pmatrix}R&[t]_\times R\\0&R\end{pmatrix}$，和上面是同一个 matrix 换了行列的顺序。

## 八门课里的同一副骨架

下表把各课对同一样东西的叫法和记号对齐。按读者可能的学习顺序排：先 robot arm，再 camera，再多个 pose 一起估计，最后交给 network。

| 课 | 叫什么 | 记号 | 方向与约定 |
|---|---|---|---|
| [RB2202](../courses/RB2202.html) | homogeneous transform | $T_{sb}$，$T_{sc}=T_{se}T_{ec}$ | $\{b\}$ 在 $\{s\}$ 里；subscript 相消 |
| [Modern Robotics](../courses/NW-MODERNROBOTICS.html) | twist、screw axis、wrench | $\mathcal V_s$，$\mathcal V_b$，$\mathcal S$，$\mathcal F=(m,f)$ | angular 在前；$\mathcal V_s=[\mathrm{Ad}_{T_{sb}}]\mathcal V_b$ |
| [RB2203](../courses/RB2203.html) | task-space error | $x_d-x$；$(e_x,e_y,e_\theta)$ | arm 只控 position；车的 error 转进 robot frame |
| [MIT 6.4210](../courses/MIT-6.4210.html) | pose、spatial velocity | ${}^AX^B$（`X_AB`），${}^Ap^C_F$，${}^AV^B_C$ | 左上从哪里量，右上量到哪里，右下 expressed in |
| [CS4243](../courses/CS4243.html) | extrinsics | $X_c=RX_w+t$，$x\sim K[R\,|\,t]X$ | world 到 camera，即 $T_{cw}$；$t=-RC$ |
| [CS4277](../courses/CS4277.html) | camera matrix、camera center | $P=KR[I\,|\,-C]$，ray $(q,\,c\times q)$ | center 是 $P$ 的 null vector |
| [CS4278](../courses/CS4278.html) | pose graph 的 node、edge | $x_i=(t_i,\theta_i)$，$z_{ij}$，$e_{ij}$ | $z_{ij}$ 是在 $x_i$ 里看到的 $x_j$ |
| [CMU 16-825](../courses/CMU-16825.html) | ray、Plücker coordinates | $r(t)=o+td$，$(d,\,o\times d)$，$W$ | ray 用 pose 的方向，$W$ 用 extrinsics 的方向 |

### RB2202：rotation 的四种写法与 transform 的链

[第 1 站](../courses/RB2202.html#rot)讲 rotation matrix、ZYX Euler angles、exponential coordinates 和 quaternion，用 teleoperation 的事故说明 Euler angles 在 pitch 接近 90° 时为什么甩：任何三个数的表示都在某处 singular。[第 2 站](../courses/RB2202.html#tf)就是骨架一：base、gripper、camera、物体的链 $T_{sc}=T_{se}T_{ec}$，inverse 不是 transpose，左乘与右乘；它还算出 hand-eye calibration 差 1° 时 0.3 m 外的物体偏 5.2 mm。[第 3 站](../courses/RB2202.html#fk)的 product of exponentials 是骨架三的 exp 连乘，每个 joint 一个 $e^{[\mathcal S_i]\theta_i}$，都左乘，因为 screw axis 写在 fixed frame 里。[第 4 站](../courses/RB2202.html#jac)指出 Jacobian 的 column 就是当前的 screw axis，并分开了用 Euler angle rate 写的 analytic Jacobian 和用 angular velocity 写的 geometric Jacobian：前者多出来的 singularity 来自表示，不来自 mechanism。这门课给骨架加上的是 rotation 各种表示的失效点。

### Modern Robotics：velocity 和 force 也是带 frame 的 6-vector

[第 2 站](../courses/NW-MODERNROBOTICS.html#twist)推出 $\mathcal V_s$、$\mathcal V_b$、$[\mathrm{Ad}_T]$、exp 和 log；开头那辆“按错 frame 理解 twist”的车是第二次事故的原型。它还由 power $\mathcal V^\top\mathcal F$ 不随 frame 变推出 wrench 换 frame 用 $[\mathrm{Ad}]^\top$。[第 3 站](../courses/NW-MODERNROBOTICS.html#poe)给出 body form $T=Me^{[\mathcal B_1]\theta_1}\cdots e^{[\mathcal B_n]\theta_n}$，$\mathcal B_i=[\mathrm{Ad}_{M^{-1}}]\mathcal S_i$。[第 4 站](../courses/NW-MODERNROBOTICS.html#jac)由 $\dot TT^{-1}$ 读出 $J_s$ 的 column 是被前面 joint 带走之后的 $\mathcal S_i$，验证 $J_s=[\mathrm{Ad}_{T_{sb}}]J_b$，并用 $\log(T_{sb}^{-1}T_{sd})$ 作 numerical IK 的 error，正是骨架三的 local difference。[第 6 站](../courses/NW-MODERNROBOTICS.html#control)的 feedforward 要乘 $[\mathrm{Ad}_{X^{-1}X_d}]$，漏掉它方向就差两个 frame 之间的 9.8°。[第 8 站](../courses/NW-MODERNROBOTICS.html#mobile)的 odometry 把一个 timestep 里不变的 planar twist 用 exponential 来 integrate，比 $q\mathrel{+}=\mathcal V_b\Delta t$ 准。这门课给骨架加上的是：所有 6-vector 都带着一个 frame，换 frame 只有 $[\mathrm{Ad}]$ 和 $[\mathrm{Ad}]^\top$ 两条规则。

### RB2203：position 可以直接减，pose 不行

[第 7 站](../courses/RB2203.html#task)的 task space 只取 end-effector 的 position，$\dot x=J\dot q$ 是 $2\times2$ 的，resolved-rate 里的 error $x_d-x$ 是普通的 vector 相减，因为没有 orientation 要管。[第 8 站](../courses/RB2203.html#mobile)跟踪 differential-drive 车的 $(x_d,y_d,\theta_d)$，先把 world 里的 error 转到车自己的 frame：$(e_x,e_y)=R(\theta)^\top(x_d-x,\ y_d-y)$，$e_\theta=\theta_d-\theta$。这是骨架三“在当前 pose 的 frame 里写 difference”的 planar 版本，桥三会看到它和 CS4278 的 edge error 是同一个式子。这门课给骨架加上的是：error 写在 robot frame 里以后，tracking 的 dynamics 和 controllability 才好分析（车停下时 $e_y$ 方向掉 rank）。

### MIT 6.4210：把“谁相对谁”写进记号

[第 1 站](../courses/MIT-6.4210.html#pick)的 monogram notation：${}^Ap^C_F$ 是从 $A$ 量到 $C$、写在 $F$ 的 axis 上；${}^AX^B$ 就是 RB2202 的 $T_{AB}$，两边的 index 首尾相接才能乘；${}^AV^B_C=({}^A\omega^B_C,\,{}^A\mathrm v^B_C)$ 是 Drake 的 spatial velocity，它的 velocity 加法多出一项 $\omega\times p$，就是骨架二里 $v_s$ 和 $\dot p$ 之差的来源。[第 3 站](../courses/MIT-6.4210.html#pose)用 ${}^Wp^{s_i}={}^WX^C\,{}^Cp^{s_i}$ 把 depth image 变成 world 里的 point cloud，再用 SVD（Kabsch）和 ICP 反过来从点求物体的 pose。[第 7 站](../courses/MIT-6.4210.html#policy)讨论 relative action ${}^{G_t}X^{G_{t+j}}$（右乘的 increment，写在当前 gripper frame 里）和 rotation 交给 network 时用什么表示。这门课给骨架加上的是：记号本身就能查错，以及从数据反求 pose。

### CS4243：extrinsics 的方向和 pose 相反

[第 3 站](../courses/CS4243.html#camera)的 extrinsics 是 $X_c=RX_w+t$，方向是 world 到 camera，也就是 $T_{cw}$；camera center $C$ 满足 $t=-RC$。Rotation 用 OpenCV 的 `rvec`（axis-angle，即骨架三的 exponential coordinates）存，并提醒各 library 的 quaternion 顺序不同。[第 6 站](../courses/CS4243.html#epipolar)用同一个方向约定 $X_2=RX_1+t$ 推出 essential matrix $E=[t]_\times R$，$t$ 只能定到 scale。这门课给骨架加上的是 pose 后面的 $K$ 和 projection，以及 vision 一侧和 robot 一侧相反的方向约定，第一次事故就出在这个交界上。

### CS4277：从 $P$ 读出 pose，以及怎样改一个 rotation

[第 2 站](../courses/CS4277.html#single)把 camera matrix 写成 $P=KR[I\mid-C]$，center 是 $P$ 的 null vector，$M=KR$ 的第三个 row 是 principal axis 的方向。[第 3 站](../courses/CS4277.html#twoview)证明 $K$ 不知道时 reconstruction 只能定到一个 $4\times4$ 的 $H$：$(PH^{-1})(HX)=PX$；它的 generalized camera 用 Plücker coordinates $(q,\,c\times q)$ 表示不经过 origin 的 ray。[第 7 站](../courses/CS4277.html#ba)的 bundle adjustment 用 $R\leftarrow R\exp([\delta\phi]_\times)$ 更新 rotation，正是骨架三的右乘 increment，并说明整体 translate、rotate、scale 都不改变 image，让 $J^\top J$ 在三维有 7 个 zero eigenvalue。这门课给骨架加上的是：image 到底决定了 pose 的哪一部分。

### CS4278：pose graph 的 edge 是两个 pose 之差

[第 4 站](../courses/CS4278.html#slam)的 node 是 $x_i=(t_i,\theta_i)$，edge 的 measurement $z_{ij}=(t_{ij},\theta_{ij})$ 是在 $x_i$ 的 frame 里看到的 $x_j$，error 是

$$e_{ij}=\begin{pmatrix}R_{ij}^\top\big(R_i^\top(t_j-t_i)-t_{ij}\big)\\\theta_j-\theta_i-\theta_{ij}\end{pmatrix}$$

$R_i^\top(t_j-t_i)$ 是骨架一里 $T_i^{-1}T_j$ 的 translation，整个 $e_{ij}$ 是“由当前 pose 预测的 relative pose”和 $z_{ij}$ 在 $z_{ij}$ 的 frame 里的差。Angle 加减之后要 normalize 到 $[-\pi,\pi)$，$x_0$ 要固定。这门课给骨架加上的是：几十上百个 pose 一起解，矛盾按 information 分摊。

### CMU 16-825：frame 成了 network 的 input

[第 3 站](../courses/CMU-16825.html#volume)把每个 pixel 变成 world 里的 ray $r(t)=o+td$：$o$ 是 camera center，direction 由 unproject 得到，用的是 camera 到 world 的方向，即 pose。[第 6 站](../courses/CMU-16825.html#gs)的 3D Gaussian 存一个 quaternion 和一个 scale，$\Sigma=RSS^\top R^\top$；投到 image 时 $\Sigma'=JW\Sigma W^\top J^\top$，$W$ 是 world 到 camera 的 rotation，又回到 extrinsics 的方向。[第 7 站](../courses/CMU-16825.html#sparse)把 ray 写成 Plücker $(d,\,o\times d)$ 交给 transformer，并把所有 camera canonicalize 到 camera 0 的 frame、固定 scale。[第 8 站](../courses/CMU-16825.html#point)指出 PointNet 对点的顺序不变，对 rotation 却会变：feature 取决于 point cloud 写在哪个 frame 里。这门课给骨架加上的是：选哪个 frame 决定了 network 要学什么。

NUS 的 EE4308（自主机器人）、EE4309（机器人感知）、EE4212（计算机视觉）从课名看也会用到这副骨架，页面还没写，这里不展开。

### Rotation：存的时候、改的时候、交给 network 的时候

各课对 rotation 的处理，放在一起看是同一个取舍：

| 课 | 存成什么 | 改它或输出它时用什么 | 理由 |
|---|---|---|---|
| RB2202 第 1 站 | matrix 或 quaternion | 给人看、给人输入时用 Euler angles | 三个数在 $\beta=\pm90°$ 处 singular |
| CS4277 第 7 站 | matrix | 右乘 $\exp([\delta\phi]_\times)$ 的 3 个数 | 在当前 $R$ 附近 minimal 而且 smooth |
| CS4278 第 4 站 | 一个 angle $\theta$ | 直接加，再 normalize | planar 只有一个 angle，周期 $2\pi$ |
| MIT 6.4210 第 7 站 | matrix | network 输出 6 个数，Gram–Schmidt | 相邻的 rotation 对应相邻的数 |
| CMU 16-825 第 6 站 | 没有 normalize 的 quaternion $q$ | $R(q/\|q\|)$，对 4 个数做 gradient descent | 任何 $q$ 都给出合法的 $\Sigma$ |

存的时候要没有 singularity（9 个数或 4 个数）；optimization 改它的时候要 minimal，而且只在当前值附近用（3 个数，乘在一边）；network 输出它的时候要 continuous（6 个数）。CMU 16-825 走了第四条路：不加 constraint，让 normalize 吸收掉多出来的那个方向。Grisetti 等人的 graph SLAM tutorial 在 3D 里按 optimization 的要求做：存 unit quaternion，用它的 vector part（3 个数）作 increment。

## 桥一：wrist camera 的 extrinsics 是 forward kinematics 倒过来

RB2202 第 2 站的 3R arm（$L=(1,1,0.5)$）在 $\theta_0=(30°,90°,-60°)$，camera 装在 gripper 上，$T_{ec}$ 的 origin 在 $(-0.1,0.05)$、转 $-20°$；camera 在 optical axis 上 0.3 m 处看到物体，$p_c=(0.3,0)$。那一站从 camera 往 base 算，得到物体在 $p_s=(0.753,1.930)$。现在物体不动，arm 动，问物体在 image 里怎么走。

**Vision 一侧。** CS4243 的 $(R,t)$ 是 $T_{cs}$。Wrist camera 的 $T_{cs}$ 不是一个 calibrate 好的常数，它是 forward kinematics 倒过来：

$$T_{cs}(\theta)=\big(T_{se}(\theta)\,T_{ec}\big)^{-1}=T_{ce}\,T_{se}(\theta)^{-1}$$

在 $\theta_0$，$T_{sc}$ 的 rotation 是 $60°-20°=40°$，translation 是 $(0.523,1.737)$，所以

$$R=R(-40°)=\begin{pmatrix}0.766&0.643\\-0.643&0.766\end{pmatrix},\qquad t=-R\begin{pmatrix}0.523\\1.737\end{pmatrix}=\begin{pmatrix}-1.517\\-0.995\end{pmatrix}$$

$Rp_s+t=(0.766\times0.753+0.643\times1.930-1.517,\ -0.643\times0.753+0.766\times1.930-0.995)=(0.300,\,0.000)$，$u=320$，物体在 image 正中。CS4243 里每张 image 有一组固定的 $(R,t)$；装在 arm 上，它是 $\theta$ 的 function，每个 control cycle 都要重算。Joint 1 转到 32°、34°、36°，重算 $T_{cs}$，$u$ 依次是 224.0、143.0、72.1。

::fig[thread-frames-wristcam] Joint 1 在 30° 和 36° 之间来回转。左边彩色的是 camera，虚线是它到物体的 ray；右边是一维的 image，彩色点是物体落在哪个 $u$。

**Robot 一侧：image Jacobian。** Visual servoing 要的是 $\partial u/\partial\theta$。Finite difference 给出 $(-3029,\,-1387,\,-1098)$ pixel/rad，即 joint 1 每转 1° 物体挪 52.9 pixel。用骨架把它拆成四段：

**第 1 段，gripper 的 body twist。** $\mathcal V_e=J_b(\theta)\,\dot\theta$（[Modern Robotics 第 4 站](../courses/NW-MODERNROBOTICS.html#jac)）。在 $\theta_0$，三个 column 是只转一个 joint 时 tool 绕那个 joint 转的 body twist：$(1,-0.366,1.866)$、$(1,-0.866,1)$、$(1,0,0.5)$。

**第 2 段，换到 camera。** $T_{ec}$ 不变，$T_{sc}^{-1}\dot T_{sc}=T_{ce}\big(T_{se}^{-1}\dot T_{se}\big)T_{ce}^{-1}$，所以 $\mathcal V_c=[\mathrm{Ad}_{T_{ce}}]\mathcal V_e$。$T_{ce}=T_{ec}^{-1}$ 的 rotation 是 20°，translation 是 $-R(20°)(-0.1,0.05)=(0.111,-0.013)$，代进 planar 的 $[\mathrm{Ad}]$：

$$[\mathrm{Ad}_{T_{ce}}]=\begin{pmatrix}1&0&0\\-0.013&0.940&-0.342\\-0.111&0.342&0.940\end{pmatrix}$$

乘出 camera 的三个 column：$(1,-0.995,1.517)$、$(1,-1.169,0.532)$、$(1,-0.184,0.359)$。

**第 3 段，不动的点在动的 camera 里怎么走。** $p_c=T_{sc}^{-1}p_s$，而 $\frac{d}{dt}T^{-1}=-T^{-1}\dot TT^{-1}$（对 $TT^{-1}=I$ 求 derivative），所以 $\dot p_c=-[\mathcal V_c]\,p_c=-(\omega_c\times p_c+v_c)$。Planar 时 $\dot y_c=-\omega_c x_c-v_{c,y}$。

**第 4 段，projection 的 derivative。** $u=f\,y_c/x_c+c$，在 $y_c=0$ 处 $\dot u=f\,\dot y_c/x_c$。这是 [CMU 16-825 第 6 站](../courses/CMU-16825.html#gs)投 Gaussian 时那个 $J=\partial(u,v)/\partial(x,y,z)$ 的 planar 版本。

代 $x_c=0.3$、$f/x_c=1667$：joint 1 是 $1667\times(-0.3-1.517)=-3029$，joint 2 是 $1667\times(-0.3-0.532)=-1387$，joint 3 是 $1667\times(-0.3-0.359)=-1098$，和 finite difference 一致。三项里的 $-0.3$ 来自 camera 自己转，三个 joint 都一样；差别全在 $v_{c,y}$，也就是 camera 侧移得多快。Joint 1 离 camera 最远，转 1 rad/s 让 camera 侧移 1.517 m/s，所以影响最大。

这条路把四门课接在一起：RB2202 的链给出 $T_{sc}(\theta)$，Modern Robotics 给出 $J_b$ 和 $[\mathrm{Ad}]$，CS4243 给出 $(R,t)$ 的方向和 projection，CMU 16-825 给出 projection 的 Jacobian。

:::edge 3D 时
$u$ 换成 $(u,v)$，$\partial(u,v)/\partial p_c$ 就是 CMU 16-825 那个 $2\times3$ 的 $J$；第 2、3 段照搬，$\dot p_c=-(\omega_c\times p_c+v_c)$，$\mathcal V_c=[\mathrm{Ad}_{T_{ce}}]J_b\dot\theta$。第 3、4 段乘起来，就是 image-based visual servoing 里常说的 interaction matrix。（这个名字和它在 visual servoing 里的用法凭自己的知识写，八门课的页面里都没有讲。）
:::

## 桥二：Plücker ray 就是 zero-pitch screw

### 同一条 line，同样的 6 个数

三门课各自用 6 个数写空间里的一条 line：

- [Modern Robotics 第 2 站](../courses/NW-MODERNROBOTICS.html#twist)：revolute joint 的 screw axis $\mathcal S=(\hat\omega,\,-\hat\omega\times q)$，$q$ 是 axis 上一点；
- [CMU 16-825 第 7 站](../courses/CMU-16825.html#sparse)：pixel 的 Plücker ray $(d,\,o\times d)$，$o$ 是 ray 上一点；
- [CS4277 第 3 站](../courses/CS4277.html#twoview)：generalized camera 的 ray $(q,\,c\times q)$，$c$ 是 camera center。

$-\hat\omega\times q=q\times\hat\omega$，三者是同一个东西：前三个数是 direction，后三个是 moment。Moment 和在 line 上取哪个点无关：$(o+sd)\times d=o\times d+s\,d\times d=o\times d$。IISc 的 NPTEL 讲义 *Homogeneous coordinates, lines, screws and twists* 写明，pitch 为 0 时 screw coordinates 就是 line 的 coordinates。

### 换 frame：line 也乘 $[\mathrm{Ad}]$

一条 line 在 $\{b\}$ 里经过 $o$、方向 $d$，moment $m=o\times d$。在 $\{a\}$ 里它经过 $Ro+p$、方向 $Rd$：

$$m'=(Ro+p)\times Rd=R\,(o\times d)+p\times Rd=R\,m+[p]R\,d$$

所以 $(d',m')=[\mathrm{Ad}_{T_{ab}}](d,m)$，和 twist 换 frame 是同一个 matrix。Wikipedia 的 Screw theory 条目给出同样的结论：spatial displacement 用 $[A]$ 和 $[DA]$ 两个 block 变换 line 的 Plücker coordinates，$[D]y=d\times y$。CMU 16-825 的 canonicalization 把所有 camera 换进 camera 0 的 frame，每个 pixel 的 Plücker input 都要乘一次这个 matrix。

### 两条 line 什么时候相交

CS4277 第 3 站给出的条件：两条 line $L_1=(d_1,m_1)$、$L_2=(d_2,m_2)$ coplanar（相交或 parallel）当且仅当

$$\langle L_1,L_2\rangle=d_1\cdot m_2+d_2\cdot m_1=0$$

一般情况下，把 $m_i=o_i\times d_i$ 代进去，用 scalar triple product 可以轮换的性质 $a\cdot(b\times c)=b\cdot(c\times a)$，$d_1\cdot(o_2\times d_2)+d_2\cdot(o_1\times d_1)=o_2\cdot(d_2\times d_1)-o_1\cdot(d_2\times d_1)=(o_2-o_1)\cdot(d_2\times d_1)$。$d_i$ 是 unit vector 时，它的绝对值是两条 line 之间的 distance 乘它们 angle 的 sine。下面三处用到的都是它。

**用在 statics。** Modern Robotics 第 4 站的 3R arm 在 $\theta=(30°,45°,60°)$ 用 end-effector 向上推 10 N，$\tau=J_s^\top\mathcal F_s=(0,\,3.536,\,0)$ N·m。$J_s$ 的 column $i$ 就是 joint $i$ 此刻的 axis line $L_i$；wrench $\mathcal F_s=(p\times f,\ f)$ 是 force 的 line of action $L_f=(\hat f,\ p\times\hat f)$ 两半对调、再乘 $|f|$。所以

$$\tau_i=\omega_i\cdot(p\times f)+v_i\cdot f=|f|\,\langle L_i,L_f\rangle$$

Joint 1 的 axis 竖直，和竖直的 line of action parallel，0；joint 3 的 axis 穿过作用点 $p=(1.172,0.677,-0.354)$，相交，0；joint 2 的 axis 水平，方向 $(0.5,-0.866,0)$，和 line of action perpendicular（sine 为 1），两条 line 相距 0.354 m，$\tau_2=10\times0.354=3.54$ N·m。“这个 joint 不用出 torque”和“它的 axis 与 force 的 line of action coplanar”是同一句话。Wikipedia 那个条目把 twist 与 wrench 的这种关系叫 reciprocal：wrench 对 twist 做的 virtual work 为 0。

::fig[thread-frames-lines] 左：3R arm 的三条 joint axis（虚线）和穿过 end-effector 的 force line of action（彩色），双箭头是 axis 2 与它之间的 common perpendicular。右：俯视 CS4243 第 6 站的两个 camera，ray 1 和 ray 2 交于 $X$，三点所在的 epipolar plane 涂成彩色。

**用在 epipolar constraint。** [CS4243 第 6 站](../courses/CS4243.html#epipolar)的两个 camera：$X_2=RX_1+t$，$R$ 绕 $y$ 转 10°，$t=(-0.4924,\,0.2,\,0.0868)$。点 $X_1=(0.2,-0.1,2)$ 在 camera 1 里的 ray 经过 origin，Plücker 是 $L_1=(y_1,0)$，$y_1=(0.1,-0.05,1)$；在 camera 2 里是 $L_2=(y_2,0)$，$y_2=(0.0256,\,0.0495,\,1)$。两条 ray 交于这个点，所以把 $L_1$ 换进 camera 2 的 frame 之后，reciprocal product 是 0。$T_{21}=(R,t)$：

$$[\mathrm{Ad}_{T_{21}}]L_1=\big(Ry_1,\ t\times Ry_1\big)$$

$$\big\langle[\mathrm{Ad}_{T_{21}}]L_1,\,L_2\big\rangle=y_2\cdot(t\times Ry_1)=y_2^\top[t]_\times R\,y_1$$

（$L_2$ 的 moment 是 0，只剩一项。）这就是 $y_2^\top Ey_1=0$，而 essential matrix $E=[t]_\times R$ 正是 $[\mathrm{Ad}_{T_{21}}]$ 左下角那个 block $[p]R$。实算 $[\mathrm{Ad}_{T_{21}}]L_1=(0.272,\,-0.05,\,0.967,\ 0.198,\,0.5,\,-0.030)$，和 $L_2$ 的 reciprocal product 是 $0.0256\times0.198+0.0495\times0.5-1\times0.030$，不取整时是 $10^{-18}$ 量级。$y_2$ 在 $v$ 方向偏 1 pixel（normalized coordinate 偏 $1/500$），值变成 0.001。

**Generalized camera 不用另推。** CS4277 第 3 站的 rig 上 camera 不在 origin，ray 的 moment 不为 0，$L_1=(q_1,q_1')$、$L_2=(q_2,q_2')$。同样换 frame 再取 reciprocal product：

$$\big\langle(Rq_1,\ Rq_1'+[t]_\times Rq_1),\ (q_2,q_2')\big\rangle$$

$$=q_2^\top[t]_\times Rq_1+q_2^\top Rq_1'+q_2'^\top Rq_1$$

这正是那一站的 generalized epipolar constraint。用那一站的 rig（两个 camera 在 $(\pm0.35,0,0)$，rig 绕 $y$ 转 12°、移动 $(0.5,0,1.2)$，点在 $(1.0,-0.3,3.5)$，时刻 1 由 $(-0.35,0,0)$ 的 camera 看到，时刻 2 由另一个看到，direction 取 unit vector）实算，三项是 $-0.01440$、$0.00701$、$0.00740$，和那一站的数字一样。

:::note Drake 的 spatial vector 不是 Plücker vector
Drake 的文档特意说明，它的 spatial vector 在逻辑上是 $\mathbb R^3\times\mathbb R^3$ 里的一对 vector，不是 Plücker vector：translational 部分属于 body 上一个具体的点，换点时要按 MIT 6.4210 第 1 站的 velocity 加法补上 $\omega\times$ 两点之差。Modern Robotics 的 $\mathcal V_s$ 固定取经过 $\{s\}$ origin 的那一点，所以它和 line 一样，换 frame 只乘 $[\mathrm{Ad}]$。
:::

## 桥三：IK、registration、BA、pose graph 是同一个 Gauss–Newton

四件事都是在 pose 上最小化 $\sum\|r\|^2$。每一步在当前 pose $X$ 处把 increment 写成 $X\leftarrow Xe^{[\delta]}$，对 $\delta$ 求 Jacobian，解 normal equations：

$$J=\frac{\partial\,r(Xe^{[\delta]})}{\partial\delta}\Big|_{\delta=0},\qquad\delta=-(J^\top J)^{-1}J^\top r$$

| 问题 | 课 | unknown | residual | increment |
|---|---|---|---|---|
| numerical IK | [Modern Robotics 第 4 站](../courses/NW-MODERNROBOTICS.html#jac) | $\theta$ | $\log(T_{sb}(\theta)^{-1}T_{sd})$ | $T_{sb}(\theta+\Delta\theta)\approx T_{sb}e^{[J_b\Delta\theta]}$ |
| 已知 correspondence 的 registration | [MIT 6.4210 第 3 站](../courses/MIT-6.4210.html#pose) | $X=(R,p)$ | $Rm_i+p-s_i$ | $X\leftarrow Xe^{[\delta]}$ |
| bundle adjustment | [CS4277 第 7 站](../courses/CS4277.html#ba) | camera pose、点 | reprojection error | $R\leftarrow R\exp([\delta\phi]_\times)$ |
| pose graph | [CS4278 第 4 站](../courses/CS4278.html#slam) | $x_i$ | $e_{ij}$ | planar 直接加，再 normalize |

IK 的 unknown 是 joint angle，但 $J_b\Delta\theta$ 正是 tool 的右乘 increment，所以它也在这张表里。

### 用 Gauss–Newton 重做 MIT 的三点 registration

MIT 6.4210 第 3 站：model 上三个点 $(0,0)$、$(3,0)$、$(0,3)$，scene 里是 $(4,1)$、$(6.4,2.8)$、$(2.3,3.3)$，correspondence 已知。那一站减掉 centroid 后用 atan2 一步解出 $\theta^*=37.36°$、$p^*=(4.045,0.965)$。现在不用 closed form，按上面的通式走。

$\delta=(\delta\theta,\delta x,\delta y)$ 很小时 $e^{[\delta]}m\approx m+\delta\theta\,\hat z\times m+(\delta x,\delta y)$：绕 model 自己的 origin 转一点，再沿 model 自己的 axis 挪一点。所以 $Xe^{[\delta]}m_i\approx R\big(m_i+\delta\theta\,\hat z\times m_i+(\delta x,\delta y)\big)+p$，

$$\frac{\partial r_i}{\partial\delta}=R\begin{pmatrix}-m_{i,y}&1&0\\m_{i,x}&0&1\end{pmatrix}$$

三个点叠成 $6\times3$ 的 $J$，解 $3\times3$ 的 normal equations，再用 exp 把 $\delta$ 乘上去。从 $\theta=0$、$p=0$ 出发：

| 第几步 | $\theta$ | $p$ | RMS |
|---|---|---|---|
| 0 | 0° | $(0,\ 0)$ | 3.732 |
| 1 | 33.90° | $(3.383,\ 1.830)$ | 1.037 |
| 2 | 37.27° | $(4.068,\ 0.983)$ | 0.0713 |
| 3 | 37.36° | $(4.045,\ 0.965)$ | 0.0645 |

第 3 步之后不再变，和 atan2 的 closed-form solution 一样，RMS 0.0645 就是那一站三个 residual $0.057$、$0.033$、$0.090$ 的 RMS。从 $\theta=200°$ 出发，7 步也到同一个解：correspondence 已知时，消掉 $p$ 以后 cost 是 $\text{const}-2\sqrt{A^2+B^2}\cos(\theta-\phi)$，在 circle 上只有一个 minimum。ICP 会卡住，是因为它每一轮都要重新猜 correspondence。

::fig[thread-frames-gn] 两边是同一个问题、同一个 Jacobian。左边 increment 右乘，三步到解；右边算出同一个 $\delta$ 却左乘上去，rotation 很快对了，translation 绕着解打转。

:::wrong Jacobian 按右乘求，update 乘在左边也一样，反正都会 converge
左乘 $X\leftarrow e^{[\delta]}X$ 把 $\delta$ 的 translation 当成写在 world 里的，把 rotation 当成绕 world 的 origin 转。第一步从 $X=I$ 出发，左右没有区别，所以从 identity 开始的测试看不出这个 bug。之后 translation 每一步都被转错方向：RMS 依次是 1.037、0.681、0.434、0.283、0.188……第 12 步才到 0.065，正确的写法第 3 步就到了。要左乘，Jacobian 也要按左乘求，或者用 $\delta_s=[\mathrm{Ad}_X]\delta_b$ 换过去。
:::

### Pose graph 的 error 和 IK 的 error

CS4278 的 $e_{ij}$ 在 $z_{ij}$ 为 identity 时是 $\big(R_i^\top(t_j-t_i),\ \theta_j-\theta_i\big)$，和 RB2203 第 8 站的 $(e_x,e_y,e_\theta)$ 完全相同（$x_i$ 是车，$x_j$ 是 reference）。Modern Robotics 的 IK 和 control 在同样的位置用的是 $\log(T_i^{-1}T_j)$。两者不是同一个 function：一个 edge 预测的 relative pose 是 $(1.0,\,0.3,\,20°)$、measurement 是 $(1,\,0,\,0°)$ 时，CS4278 的 error 是 $(e_x,e_y,e_\theta)=(0,\ 0.3,\ 0.349)$，log 写成同样顺序是 $(0.052,\ 0.297,\ 0.349)$；偏差缩小到 $(1.0,\,0.03,\,2°)$ 时，两者是 $(0,\ 0.03,\ 0.0349)$ 和 $(0.0005,\ 0.030,\ 0.0349)$。两者在 error 为 0 处相同、first derivative 也相同，差别是 second-order 的，所以 Gauss–Newton converge 到的地方几乎一样。Grisetti 等人的 tutorial 在 planar 里把 increment 直接加在 $(x,y,\theta)$ 上、再 normalize angle，3D 里改用 quaternion 的 vector part 作 increment，再和当前 pose 复合。

## 桥四：canonical frame、固定 camera 1、固定 $x_0$ 是同一个 gauge

### 所有 pose 左乘同一个 $G$，data 不变

设所有 pose 都左乘同一个 rigid transform $G$，所有点也乘 $G$。Camera $i$ 看到点 $X$ 时，用的是 $X$ 在它自己 frame 里的 coordinate $T_i^{-1}X$；换过之后是

$$(GT_i)^{-1}(GX)=T_i^{-1}G^{-1}GX=T_i^{-1}X$$

两个 pose 之间的 relative pose 也不变：$(GT_i)^{-1}(GT_j)=T_i^{-1}T_j$。所以 pixel、odometry、loop closure 都定不下 $G$，它在 3D 有 6 个数、planar 有 3 个。只有 pixel 时还多一个：所有 position 乘同一个 $s$，$y_c/x_c$ 不变，scale 也定不下。

### 一个例子

三个 planar camera 在 $(0.4,0.3)$ 朝 55°、$(1.3,0)$ 朝 85°、$(2.6,0.6)$ 朝 130°，看六个点；camera 0 看到它们落在 $u=231.8$、420.6、206.3、404.0、288.0、311.0。取 $G=T_0^{-1}$，所有 pose 左乘它：camera 0 变成 identity，camera 1 变成 $(0.270,-0.909)$ 朝 30°，camera 2 变成 $(1.508,-1.630)$ 朝 75°，18 个 pixel 一个都没变（差在 $10^{-13}$）。再把所有 position 乘 0.513，让六个点的 centroid 离 origin 为 1，camera 1 到了 $(0.139,-0.466)$，pixel 还是不变。

::fig[thread-frames-gauge] 左边的整个场景先被 $G=T_0^{-1}$ 搬进 camera 0 的 frame，再缩小到 0.513 倍；右边三张 image 里的 pixel 从头到尾不动。

拿这组数据做 bundle adjustment：unknown 是 9 个 camera parameter 加 12 个 point coordinate，共 21 个；residual 18 个。$J^\top J$ 的 rank 只有 17，有 4 个 zero eigenvalue：$G$ 的 3 个加 scale 的 1 个。CS4277 第 7 站的 toy problem 也正好是 4 个。再加一个 metric 的 measurement（camera 0 和 1 相距 0.949 m，相当于 stereo baseline 或一段 odometry），zero eigenvalue 剩 3 个，只剩 $G$；CS4277 说三维有 stereo 或 IMU 时从 7 个降到 6 个，是同一件事。

### 三门课的三种处理

- [CS4277 第 7 站](../courses/CS4277.html#ba)：固定 camera 1 的 pose 和 camera 2 的 $p_x$，planar 里正好 $3+1$ 个。
- [CS4278 第 4 站](../courses/CS4278.html#slam)：relative pose 带着 metric scale，只剩 $G$；给 $x_0$ 那个 diagonal block 加 identity，把 $\Delta x_0$ 钉在 0。1D 例子里 $H$ 每个 row 加起来是 0，就是“所有 pose 一起 translate”这个方向。
- [CMU 16-825 第 7 站](../courses/CMU-16825.html#sparse)：canonicalization 取 $G=T_0^{-1}$，再 scale 到 centroid 的 distance 为 1，和上面的例子一模一样。

前两种是为了让 normal equations 有 unique solution，第三种是为了 network：不 canonicalize，同一个场景换一个 world frame，每个 pixel 的 Plücker input 就被乘上一个不同的 $[\mathrm{Ad}_G]$，network 要从 input 里学会一个本来定不下的 $G$。

$K$ 也不知道时，[CS4277 第 3 站](../courses/CS4277.html#twoview)的 $(PH^{-1})(HX)=PX$ 是同一个结构：data 不变的那一群 transformation 从 7 个数的 similarity 变成 15 个数的 projective $H$，要靠 image 以外的信息一级一级去掉。

:::from
骨架的推导顺序（$\dot TT^{-1}$ 与 $T^{-1}\dot T$、$[\mathrm{Ad}_T]$、$[\omega]^3=-[\omega]$ 推 Rodrigues 与 $G(\theta)$）跟着 Lynch 与 Park 的 [Modern Robotics](https://hades.mech.northwestern.edu/images/2/25/MR-v2.pdf) 第 3.3 节，用 WebFetch 读了这一节的分段摘要（$v_s$ 是“此刻在 fixed-frame origin 的那一点的 velocity”、Definition 3.20、Proposition 3.21）。Drake 与 Modern Robotics 的对应来自 Tedrake [Robotic Manipulation 第 3 章](https://manipulation.mit.edu/pick.html)（monogram notation 的规则、spatial velocity 的 angular 在前、screw theory 的 spatial twist 是 ${}^AV^{B_A}$）和 [Drake 的 spatial vector 文档](https://drake.mit.edu/doxygen_cxx/group__multibody__spatial__vectors.html)（translational 部分属于 body 上一个固定点、默认 origin、不是 Plücker vector）。Right-plus 与 left-plus、local 与 global frame、默认用 right、translation 在前时 $\mathrm{Ad}$ 的形式，来自 Solà、Deray、Atchuthan 的 [A micro Lie theory](https://arxiv.org/pdf/1812.01537v8)（Eq. 25 到 31、175，读的是工具逐条转述）。$(R,t)$ 的方向来自 [OpenCV 的 solvePnP 文档](https://docs.opencv.org/4.x/d5/d1f/calib3d_solvePnP.html)（${}^c\mathbf T_w$）和 [COLMAP 的 output format](https://colmap.github.io/format.html)（world 到 camera、camera center 为 $-R^\top T$）。“zero pitch 的 screw coordinates 就是 line coordinates”来自 IISc 的 [NPTEL 讲义](https://mecheng.iisc.ac.in/~asitava/NPTEL/lines-2.pdf)；Plücker coordinates 在 rigid displacement 下的变换、reciprocal 即 virtual work 为 0，来自 Wikipedia 的 [Screw theory](https://en.wikipedia.org/wiki/Screw_theory) 条目（页面上的公式没有抓到，只读到文字）。Pose graph 的 2D error、planar 的 ⊞ 是加法再 normalize、3D 用 quaternion vector part，来自 [Grisetti 等人的 tutorial](https://www.ipb.uni-bonn.de/wp-content/papercite-data/pdf/grisetti10titsmag.pdf)。各课的记号和例子取自对应课程页的正文。四座桥的对应关系（wrist camera 的 image Jacobian 的四段拆法、epipolar constraint 是 $[\mathrm{Ad}]$ 加 reciprocal product、statics 的 $\tau_i=|f|\langle L_i,L_f\rangle$、left/right increment 的 bug、canonicalization 即 gauge fixing）是为这一页推的；interaction matrix 这个名字凭自己的知识写，没有找来源核对。全部数字（两次事故、三种 twist、exp 与 log、image Jacobian、reciprocal product、CS4277 rig 的三项、Gauss–Newton 两种 update、pose graph error 与 log、gauge 例子的 pixel 和 eigenvalue）都用 numpy 实算过。
:::
