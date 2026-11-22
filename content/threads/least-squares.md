---
title: 最小二乘
lead: "Equation 比 unknown 多、彼此还矛盾时该取哪个 x。从 fit 一条 line 到 ridge、kernel、Kalman filter、graph SLAM、bundle adjustment 和 ICP，解的都是同一组 normal equations。"
line: num
---

先看两个问题。

**第一个。** 三个 data point $(1,1)$、$(2,2)$、$(3,2)$，想用一条 line $y=C+Dt$ 穿过它们，这是 [DSA2102 第 4 站](../courses/DSA2102.html#ls)的例子。每个点给一个 equation：$C+D=1$，$C+2D=2$，$C+3D=2$。

**第二个。** 一个 robot 在 corridor 里从 $x_0=0$ 出发。Odometry 说第一段走了 1.1 m，第二段走了 1.0 m；到 $x_2$ 时它认出了在 $x_0$ 时见过的 landmark，由此测得 $x_2-x_0=2.0$，这是 [CS4278 第 4 站](../courses/CS4278.html#slam)的例子。Unknown 是 $x_1$、$x_2$，三个 measurement 给出 $x_1=1.1$，$x_2-x_1=1.0$，$x_2=2.0$。

::fig[thread-least-squares-two] 左边每条虚线穿过两个点，漏掉的那个点差 1、1 或 ½。右边两段 odometry 加起来是 2.1，landmark 说 2.0。

写成 matrix：

$$\underbrace{\begin{pmatrix}1&1\\1&2\\1&3\end{pmatrix}}_{A}\begin{pmatrix}C\\D\end{pmatrix}=\underbrace{\begin{pmatrix}1\\2\\2\end{pmatrix}}_{b}\qquad\qquad\underbrace{\begin{pmatrix}1&0\\-1&1\\0&1\end{pmatrix}}_{A}\begin{pmatrix}x_1\\x_2\end{pmatrix}=\underbrace{\begin{pmatrix}1.1\\1.0\\2.0\end{pmatrix}}_{b}$$

两个都是三个 equation、两个 unknown、没有 solution。两边又都必须给出一个答案：line 要拿去 predict，robot 要知道自己在哪、map 要画在哪里。只挑两个 equation 解出来不行。挑哪两个没有道理可讲，而且被丢掉的那个 equation 独自承担全部 error：丢掉第三个点，line $y=t$ 在 $t=3$ 处差 1；丢掉 landmark，$x_2=2.1$，和 landmark 差 0.1；丢掉第一段 odometry，$x_1=1.0$，这一段差 0.1。要的是一个让每个 equation 都只差一点的 $x$，外加一条决定谁差多少的规则。

这条规则在九门课里各有名字。下面先把它完整推一遍，再用一张表对齐各课的名字和记号，然后逐门课看它往骨架上加了什么；两门课说的是同一件事而课程页没有说破的地方，用同一个小例子在两边各算一遍。

## 骨架

### 每个 equation 都差一点：projection

把各个 equation 差多少并成一个 vector $e=b-Ax$。规则是让 $\|e\|^2=e_1^2+e_2^2+e_3^2$ 最小。用 square 的理由在 [DSA2102 第 4 站](../courses/DSA2102.html#ls)：这样“最近”等价于“perpendicular”，perpendicular 是一个 linear condition。这里把它当作 theorem 证一遍，因为后面每一门课用的都是这几行。

$x$ 取遍所有值时，$Ax$ 扫过 $A$ 的 column space。设 $\hat x$ 满足

$$A^\top(b-A\hat x)=0$$

即 $\hat e=b-A\hat x$ 与 $A$ 的每个 column perpendicular，从而与 column space 里任何一个 vector $Av$ perpendicular：$(Av)^\top\hat e=v^\top A^\top\hat e=0$。对任意 $x$，把 error 拆成两部分：

$$b-Ax=\underbrace{(b-A\hat x)}_{\perp\ \text{column space}}+\underbrace{A(\hat x-x)}_{\in\ \text{column space}}$$

两部分 perpendicular，由 Pythagorean theorem，

$$\|b-Ax\|^2=\|b-A\hat x\|^2+\|A(\hat x-x)\|^2\ \ge\ \|b-A\hat x\|^2$$

等号只在 $A(\hat x-x)=0$ 时成立；$A$ 的 column linearly independent 时，这就是 $x=\hat x$。所以 minimizer 就是这个 $\hat x$，它满足 **normal equations**

$$A^\top A\,\hat x=A^\top b$$

$A\hat x$ 是 $b$ 在 column space 上的 projection，乘在 $b$ 前面的 $P=A(A^\top A)^{-1}A^\top$ 叫 projection matrix，$\hat e=(I-P)b$。

Line：

$$A^\top A=\begin{pmatrix}3&6\\6&14\end{pmatrix},\quad A^\top b=\begin{pmatrix}5\\11\end{pmatrix}\quad\Rightarrow\quad(C,D)=\big(\tfrac23,\ \tfrac12\big),\qquad\hat e=\big(-\tfrac16,\ \tfrac13,\ -\tfrac16\big)$$

Robot：

$$A^\top A=\begin{pmatrix}2&-1\\-1&2\end{pmatrix},\qquad A^\top b=\begin{pmatrix}1.1-1.0\\1.0+2.0\end{pmatrix}=\begin{pmatrix}0.1\\3.0\end{pmatrix}$$

第一式给出 $x_2=2x_1-0.1$，代入第二式得 $-x_1+4x_1-0.2=3.0$，$x_1=1.0667$，$x_2=2.0333$。Error 是 $\hat e=(0.0333,\ 0.0333,\ -0.0333)$：0.1 的矛盾被三个 measurement 平分，每个让出 $\tfrac1{30}$。

$A^\top\hat e=0$ 在 robot 问题里可以逐个 component 读。$A$ 的第一个 column 是 $(1,-1,0)$，记录了 $x_1$ 出现在第 1、2 个 equation 里，$A^\top\hat e$ 的第一个 component 是 $e_1-e_2=0$：和 $x_1$ 相连的两个 measurement，error 互相抵消。第二个 component $e_2+e_3=0$ 说的是 $x_2$ 处的同一件事。每个 unknown 对应 $A^\top\hat e=0$ 的一个 component，里面只出现和它相连的 measurement；graph SLAM 的 $H$ 为什么 sparse，原因就在这里。

### Weight：谁让多少

平分不对。Odometry 的 $\sigma$ 是 0.1，landmark 的 $\sigma$ 是 0.05，更准的那个应该让得更少。办法是每个 error 用它自己的 $\sigma$ 来量，最小化 $\sum_i(e_i/\sigma_i)^2$。记 $L=\mathrm{diag}(1/\sigma_i)$，$W=L^\top L=\mathrm{diag}(1/\sigma_i^2)$：

$$\sum_i\frac{e_i^2}{\sigma_i^2}=\|L(b-Ax)\|^2=\|Lb-(LA)x\|^2$$

这是 $A'=LA$、$b'=Lb$ 的普通 least squares，上一节的结论照用：$(LA)^\top(LA)\hat x=(LA)^\top Lb$，即

$$A^\top WA\,\hat x=A^\top Wb$$

Measurement 之间 correlated 时，$W=\Sigma^{-1}$，$L$ 取任何满足 $L^\top L=\Sigma^{-1}$ 的 matrix，推导一字不改。把每个 row 乘上 $L$ 叫 whitening。Noise 是 Gaussian 时 $-\ln p(b\mid x)=\tfrac12(b-Ax)^\top\Sigma^{-1}(b-Ax)+\text{const}$，所以 weighted least squares 就是 MLE；$\Sigma=\sigma^2I$ 的情形 [ST3131 第 1 站](../courses/ST3131.html#slr)和 [CS3244 第 3 站](../courses/CS3244.html#reg)都推过。

Robot 的 $W=\mathrm{diag}(100,100,400)$：

$$A^\top WA=\begin{pmatrix}200&-100\\-100&500\end{pmatrix},\qquad A^\top Wb=\begin{pmatrix}110-100\\100+800\end{pmatrix}=\begin{pmatrix}10\\900\end{pmatrix}$$

解出 $x_1=1.0556$，$x_2=2.0111$，$\hat e=(0.0444,\ 0.0444,\ -0.0111)$，和 CS4278 那一站的答案相同（那里 error 定义成 predicted 减 measured，符号相反）。

分法可以直接推出来。不论 $x$ 取什么，$(Ax)_1+(Ax)_2-(Ax)_3=x_1+(x_2-x_1)-x_2=0$，所以 $e_1+e_2-e_3=b_1+b_2-b_3=0.1$：矛盾的总量和 $x$ 无关。$A^\top W\hat e=0$ 的两个 component 是 $100e_1-100e_2=0$ 和 $100e_2+400e_3=0$，即 $e_1=e_2=e$，$e_3=-e/4$。代进去，$2e+\tfrac e4=0.1$，$e=0.0444$。Landmark 让出的 0.0111 是 0.1 的 $\tfrac19$，正好等于 $\dfrac{0.05^2}{0.1^2+0.1^2+0.05^2}=\dfrac{0.0025}{0.0225}$：每一方让出的份额正比于它的 variance。[RB3302 第 6 站](../courses/RB3302.html#map)四个 pose 的例子（三段 odometry 串起来 variance 0.03，loop closure 0.0025，odometry 一侧让出 $0.2\times\tfrac{0.03}{0.0325}=0.185$）用的就是这条规则。

::fig[thread-least-squares-weight] 动图：landmark 的 information $\Omega=1/\sigma^2$ 从 400 增大到 10000，跳到 0，再一路回到 400。看下面两把放大的尺子：$\Omega=0$ 时 robot 完全按 odometry 站在 1.1 和 2.1；$\Omega$ 越大，$x_2$ 越贴近 landmark 说的 2.0，$x_1$ 也跟着往回挪，虽然 landmark 并没有测 $x_1$。

:::wrong 一个 equation 两边同乘一个数，solution 不变
解 linear system 时如此，在 least squares 里不成立。把 landmark 那个 equation 写成 $2x_2=4.0$，意思完全一样。不加 weight 直接解：$A^\top A=\begin{pmatrix}2&-1\\-1&5\end{pmatrix}$，$A^\top b=(0.1,\ 9.0)$，解出 $(1.0556,\ 2.0111)$，正是给这个 equation weight 4 的结果。一个 equation 乘 $k$，它的 weight 就乘 $k^2$。所以 unit 的选择就是 weight 的选择：position 记成 cm、angle 记成 rad 放进同一个 residual vector，等于让 position 的 weight 比记成 m 时大 $10^4$ 倍。SLAM 和 bundle adjustment 要用 $\Omega$ 或 $\Sigma^{-1}$ 显式地给 weight，原因在这里。
:::

### Prior：多加几个 row

只看到第一个点 $(1,1)$ 时只有一个 equation $C+D=1$，$A^\top A=\begin{pmatrix}1&1\\1&1\end{pmatrix}$ singular，过 $(1,1)$ 的每条 line 都一样好。缺的东西要从 data 以外来：事先知道 $x$ 大概在 $\mu_0$ 附近，不确定的程度是 $\tau$。把这件事写成 equation $x\approx\mu_0$，weight 是 $1/\tau^2$，和 data 的那些 row 叠在一起：

$$\min_x\ \frac{\|b-Ax\|^2}{\sigma^2}+\frac{\|x-\mu_0\|^2}{\tau^2}\qquad\Longleftrightarrow\qquad\min_x\ \left\|\begin{pmatrix}b\\\sqrt\lambda\,\mu_0\end{pmatrix}-\begin{pmatrix}A\\\sqrt\lambda\,I\end{pmatrix}x\right\|^2,\qquad\lambda=\frac{\sigma^2}{\tau^2}$$

（左式乘以 $\sigma^2$ 就是右式。）叠起来的 $\tilde A$、$\tilde b$ 满足 $\tilde A^\top\tilde A=A^\top A+\lambda I$，$\tilde A^\top\tilde b=A^\top b+\lambda\mu_0$，所以 normal equations 是

$$(A^\top A+\lambda I)\,\hat x=A^\top b+\lambda\mu_0$$

$\lambda>0$ 时左边的 matrix 一定 invertible：对 $v\ne0$，$v^\top(A^\top A+\lambda I)v=\|Av\|^2+\lambda\|v\|^2>0$。只有第一个点、$\mu_0=0$ 时：

$$\begin{pmatrix}1+\lambda&1\\1&1+\lambda\end{pmatrix}\begin{pmatrix}C\\D\end{pmatrix}=\begin{pmatrix}1\\1\end{pmatrix}\quad\Rightarrow\quad C=D=\frac1{2+\lambda}$$

$\lambda\to0$ 时得到 $(\tfrac12,\tfrac12)$，是 line $C+D=1$ 上离原点最近的点，也就是 [DSA2102 第 5 站](../courses/DSA2102.html#eig)的 pseudoinverse 给出的 minimum-norm solution。

一个 prior 就是几个额外的 row。后面几门课里的这些东西都是这样的 row：

| 额外的 row | 它的 weight | 课和站 | 那里的名字 |
|---|---|---|---|
| $w\approx0$ | $\lambda=\sigma^2/\tau^2$ | [CS3244 第 3 站](../courses/CS3244.html#reg) | ridge regression，即 Gaussian prior 下的 MAP |
| $x_t\approx\bar\mu_t$ | $\bar P^{-1}$ | [CS4278 第 2 站](../courses/CS4278.html#kf) | Kalman filter 的 predict 交给 update 的 prior |
| $x_0\approx0$ | 很大 | [CS4278 第 4 站](../courses/CS4278.html#slam) | 固定第一个 pose，给 $H$ 的第一个 diagonal block 加 $I$ |
| $\Delta\theta\approx0$ | $\lambda^2$ | [RB2202 第 5 站](../courses/RB2202.html#ik) | IK 的 damped least squares |
| $\delta\approx0$ | $\lambda\,\mathrm{diag}(J^\top J)$ | [CS4277 第 7 站](../courses/CS4277.html#ba) | Levenberg–Marquardt 的 damping |

### 先消掉一部分 unknown

Unknown 常常分成两个 block，其中一个好对付。Normal equations 按 block 写：

$$\begin{pmatrix}M_{11}&M_{12}\\M_{21}&M_{22}\end{pmatrix}\begin{pmatrix}x_1\\x_2\end{pmatrix}=\begin{pmatrix}g_1\\g_2\end{pmatrix}$$

第一个 row 给出 $x_1=M_{11}^{-1}(g_1-M_{12}x_2)$，代入第二个 row：

$$\big(M_{22}-M_{21}M_{11}^{-1}M_{12}\big)\,x_2=g_2-M_{21}M_{11}^{-1}g_1$$

左边的 matrix 叫 Schur complement。解出 $x_2$ 后代回第一个 row 求 $x_1$，这一步是 back substitution；只要 $x_2$ 时可以不做。

Line 的例子取 $x_1=C$、$x_2=D$：Schur complement 是 $14-6\cdot\tfrac13\cdot6=2$，右边是 $11-6\cdot\tfrac13\cdot5=1$，所以 $2D=1$，就是 DSA2102 里“第二式减去 2 倍的第一式”。这两个数有统计上的名字。一般地，$A$ 的两个 column 是 $\mathbf 1$ 和 $t$ 时，$M_{11}=n$，$M_{12}=\sum t_i$，$M_{22}=\sum t_i^2$，$g_1=\sum y_i$，$g_2=\sum t_iy_i$，于是

$$M_{22}-\frac{(\sum t_i)^2}{n}=\sum t_i^2-n\bar t^2=\sum(t_i-\bar t)^2=S_{tt},\qquad g_2-\frac{\sum t_i\sum y_i}{n}=\sum(t_i-\bar t)(y_i-\bar y)=S_{ty}$$

$D=S_{ty}/S_{tt}$ 正是 [ST3131 第 1 站](../courses/ST3131.html#slr)的 $b_1=S_{xy}/S_{xx}$（这里 $S_{tt}=2$，$S_{ty}=1$）。消掉 intercept，等于先把 data 减去 mean。

Robot 的例子消掉 $x_1$：Schur complement 是 $500-(-100)\cdot\tfrac1{200}\cdot(-100)=450$。$x_0$ 到 $x_2$ 有两条路：两段 odometry 串起来，variance $0.01+0.01=0.02$，information 50；landmark 一条，information 400。消掉 $x_1$ 之后，这两条路的 information 相加，$50+400=450$。下面 ST3131 一节会看到，$1/450$ 就是 $x_2$ 的 variance。

::fig[thread-least-squares-elim] 动图：同一个动作做在两个问题上。左边三个点连同 fitted line 一起挪动，让 mean 落到原点，intercept 消失，只剩 $D$ 的一个 equation。右边从 pose graph 里拿掉 $x_1$，它两侧的两条 edge 串成一条 information 为 50 的 edge，再和原来的 400 加在一起。

### Nonlinear：每一步解一次 linear least squares

Robot 用 range 测 landmark，camera 把 3D 点投到 image 上，residual 都不是 unknown 的 linear function。记 residual 为 $r(x)$，要最小化 $\|r(x)\|^2$。在当前的 $x$ 处做 Taylor expansion，$r(x+\delta)\approx r(x)+J\delta$，$J=\partial r/\partial x$。代进去，$\|r+J\delta\|^2$ 是 $\delta$ 的 linear least squares，$A$ 的位置是 $J$，$b$ 的位置是 $-r$：

$$J^\top J\,\delta=-J^\top r$$

解出 $\delta$，令 $x\leftarrow x+\delta$，在新的点重新 linearize，直到 $\delta$ 足够小。这叫 Gauss–Newton。它和 Newton's method 的差别，是 $\|r\|^2$ 的 Hessian 里丢掉了含 $r$ 的 second derivative 的那一项，[CS4277 第 7 站](../courses/CS4277.html#ba)有推导。Linear approximation 只在附近可信，$\delta$ 太长时会越走越差，这时给 $\delta$ 加一个“别走太远”的 prior row $\delta\approx0$：

$$(J^\top J+\lambda D)\,\delta=-J^\top r$$

$D=I$ 是 Levenberg 的写法，$D=\mathrm{diag}(J^\top J)$ 是 Marquardt 的。[ST3131 第 8 站](../courses/ST3131.html#glm)的 IRLS 是同一种循环：logistic regression 的 Newton step 写出来，每一步正好是一次 weighted least squares，weight 随当前的 $\beta$ 改变。

## 九门课里的名字和记号

| 课和站 | 这门课的名字 | unknown | 骨架里 $A$ 的位置 | $b$ 的位置 | weight $W$ | $A^\top WA$ 的位置 |
|---|---|---|---|---|---|---|
| [DSA2102 第 4 站](../courses/DSA2102.html#ls) | least squares、normal equations、QR | $x=(C,D)$ | $A$ | $b$ | $I$ | $A^\top A=R^\top R$ |
| [MA2101 第 8 站](../courses/MA2101.html#inner) | orthogonal projection、best approximation | $u\in U$ | $U$ 的 basis $f_j$ | $v$ | inner product 自带 | Gram matrix $\langle f_j,f_k\rangle$ |
| [ST3131 第 3 站](../courses/ST3131.html#mlr) | OLS、hat matrix | $\beta$ | design matrix $X$ | $y$ | $I$（noise 是 $\sigma^2I$） | $X^\top X$，$\sigma^2(X^\top X)^{-1}=\text{Cov}(\hat\beta)$ |
| [CS3244 第 3 站](../courses/CS3244.html#reg) | MLE、MAP、ridge、lasso | $w$ | $X$ 下面叠 $\sqrt\lambda I$ | $y$ 下面叠 0 | $I$ | $X^\top X+\lambda I$ |
| [CS3264 第 6 站](../courses/CS3264.html#kernel) | kernel ridge regression | $\alpha$，$w=\sum_i\alpha_i\phi(x_i)$ | Gram matrix $K$ | $y$ | $I$ | 解 $\alpha$ 用 $K+\lambda mI$ |
| [CS4278 第 2 站](../courses/CS4278.html#kf)、[RB3302 第 5 站](../courses/RB3302.html#loc) | Kalman filter、EKF | state $x$，记 mean $\mu$ | $C$；EKF 里是 Jacobian $H$ | $z$ | $R^{-1}$，prior 的 row 是 $\bar P^{-1}$ | $P^{-1}=\bar P^{-1}+C^\top R^{-1}C$ |
| [CS4278 第 4 站](../courses/CS4278.html#slam)、[RB3302 第 6 站](../courses/RB3302.html#map) | graph SLAM、pose graph | 所有 pose | $J_{ij}$ | $-e_{ij}$ | information $\Omega_{ij}$ | $H=\sum J_{ij}^\top\Omega_{ij}J_{ij}$ |
| [CS4277 第 7 站](../courses/CS4277.html#ba) | bundle adjustment | camera pose 与 3D 点 | $J=\partial r/\partial x$ | $-r$ | 通常是 $I$ | $J^\top J=\begin{pmatrix}U&W\\W^\top&V\end{pmatrix}$ |
| [MIT 6.4210 第 3 站](../courses/MIT-6.4210.html#pose) | point cloud registration、ICP | pose $(p,R)$ | 对 $p$ 是一摞 $I$ | $p^{s_i}-R\,{}^Op^{m_{c_i}}$ | $I$ | 对 $p$ 是 $NI$；$R$ 另带 constraint |

同一个字母在不同课里指不同的东西，对照时要小心。ST3131 的 $H$ 是 hat matrix，$n\times n$，作用在 data 上，对应骨架里的 $P$；CS4278 的 $H$ 在 EKF 里是 measurement 的 Jacobian，在 graph SLAM 里是 normal equations 的 matrix，作用在 unknown 上。CS4278 的 $A$ 是 motion model，骨架里的 $A$ 在那里叫 $C$。CS4277 的 $W$ 是 camera 与点之间的 off-diagonal block，不是 weight。

## DSA2102：怎么算才准

[DSA2102 第 4 站](../courses/DSA2102.html#ls)加上的是计算的一面。Normal equations 在数学上正确，在机器上会把 condition number square：那一站取 50 个点 fit degree-11 polynomial，$\kappa(A)=1.2\times10^8$，$\kappa(A^\top A)=1.4\times10^{16}$，解 normal equations 的 coefficient 偏了 0.23，用 QR 只偏 $1.6\times10^{-8}$。QR 把 $A$ 写成 $QR$，$Q$ 的 column orthonormal，于是 $\|Ax-b\|^2=\|Rx-Q^\top b\|^2+\|b-QQ^\top b\|^2$，解 triangular 的 $R\hat x=Q^\top b$，condition number 和 $A$ 一样。

这个 $R$ 在 SLAM 里有另一个名字。由 $Q^\top Q=I$，

$$A^\top A=(QR)^\top QR=R^\top Q^\top QR=R^\top R$$

所以 $R$ 就是 $A^\top A$ 的 Cholesky factor。对三个点，DSA2102 算出 $R=\begin{pmatrix}\sqrt3&2\sqrt3\\0&\sqrt2\end{pmatrix}$，$R^\top R=\begin{pmatrix}3&6\\6&12+2\end{pmatrix}=A^\top A$。Dellaert 和 Kaess 的 Square Root SAM 把 $A^\top A$ 叫 information matrix，把 $R$ 叫它的 square root，两条路都写了：对 $A$ 做 QR 得 $R\delta=d$，或者形成 $A^\top A$ 再做 Cholesky。那篇论文报告，在 sparse 的 SLAM 问题上 Cholesky 和 LDL 实际上远快于 QR，而影响速度最大的是 variable 的 elimination order。用 Cholesky 就要接受 DSA2102 说的代价，condition number 被 square；gauge 没有固定时 $A^\top A$ singular，condition number 是 infinity，下面 graph SLAM 一节会遇到。

Column 接近 dependent 时，[DSA2102 第 5 站](../courses/DSA2102.html#eig)用 SVD 看 prior 的作用：ridge 把 $1/\sigma_i$ 换成 $\sigma_i/(\sigma_i^2+\lambda)$，靠不住的方向被压掉。

## MA2101：把 data point 换成 function

[MA2101 第 8 站](../courses/MA2101.html#inner)把骨架从 $\mathbb R^n$ 搬到一般的 inner product space。Projection 的 formula $P_Uv=\sum_j\frac{\langle v,f_j\rangle}{\|f_j\|^2}f_j$（$f_j$ 是 $U$ 的 orthogonal basis），best approximation theorem 的 proof 也是骨架里那个 Pythagorean theorem。那一站的例子：在 $[-1,1]$ 上取 $\langle p,q\rangle=\int_{-1}^1pq\,dx$，$P_2(\mathbb R)$ 里离 $x^3$ 最近的是 $\tfrac35x$，距离的 square 是 $\tfrac8{175}$。

这和 DSA2102 的 fitting 是同一个问题，只是 data point 无限多。在 $[-1,1]$ 上取 $N$ 个 midpoint $x_i=-1+\tfrac{2i-1}N$，用 $a+bx+cx^2$ 去 fit $x_i^3$，$A$ 的三个 column 是 $1,x_i,x_i^2$。Normal equations 两边乘 $\tfrac2N$，matrix 的 entry 变成

$$\frac2N\sum_ix_i^{j+k}\ \xrightarrow{\ N\to\infty\ }\ \int_{-1}^1x^{j+k}\,dx=\langle x^j,x^k\rangle$$

这是 Riemann sum：$\tfrac2N$ 是每个小 interval 的宽度。右边 $\tfrac2N\sum_ix_i^3x_i^j$ 同样趋向 $\langle x^3,x^j\rangle$。Limit 是 MA2101 的 inner product 下的 normal equations，matrix 是 Gram matrix：

$$\begin{pmatrix}2&0&\tfrac23\\0&\tfrac23&0\\\tfrac23&0&\tfrac25\end{pmatrix}\begin{pmatrix}a\\b\\c\end{pmatrix}=\begin{pmatrix}0\\\tfrac25\\0\end{pmatrix}$$

中间的 row $\tfrac23b=\tfrac25$，$b=\tfrac35$。第一、三个 row $2a+\tfrac23c=0$、$\tfrac23a+\tfrac25c=0$，determinant 是 $\tfrac45-\tfrac49=\tfrac{16}{45}\ne0$，所以 $a=c=0$。答案 $\tfrac35x$ 和 MA2101 相同。MA2101 不用解这个 system，因为它先把 $1,x,x^2$ Gram–Schmidt 成 orthogonal 的 $1,x,x^2-\tfrac13$，Gram matrix 变成 diagonal；DSA2102 对 column 做 QR、得到 $\hat x=Q^\top b$ 不用解 system，是同一个理由。

有限的 $N$ 下也能算到底。Midpoint 关于 0 symmetric，$1$ 和 $x^2$ 的 column 与 $x$ 和 $x^3$ 的 column perpendicular（odd 乘 even 的和是 0），system 拆开，$b_N=\sum x_i^4/\sum x_i^2$：

| $N$ | 3 | 4 | 5 | 10 | 20 | 100 | $\infty$ |
|---|---|---|---|---|---|---|---|
| $b_N$ | 0.4444 | 0.5125 | 0.5440 | 0.5860 | 0.5965 | 0.59986 | 0.6 |

$N=3$ 时三个 unknown、三个点，fit 就是 interpolation，residual 为 0。$N=1000$ 时 $\tfrac2N\|\hat e\|^2=0.045714$，$\tfrac8{175}=0.045714$。

::fig[thread-least-squares-func] 动图：midpoint 从 3 个加到 20 个。彩色的 line 是对这些 sample 做 least squares 的结果，虚线是 MA2101 的 projection $\tfrac35x$。右边的 $b$ 是两个 sum 之比，$N\to\infty$ 时它变成两个 integral 之比。

Gram–Schmidt 本身也对得上。对 $N=200$ 的 $A$ 做 QR，把 $Q$ 的三个 column 乘以 $\sqrt{N/2}$，在每个 sample 点上和 MA2101 算出的 $e_1=\tfrac1{\sqrt2}$、$e_2=\sqrt{\tfrac32}\,x$、$e_3=\sqrt{\tfrac{45}8}\big(x^2-\tfrac13\big)$ 最多差 0.00012（$N=20$ 时差 0.0105）。QR 对 sampled polynomial 做出来的，就是 MA2101 那组 orthonormal polynomial 的 sample。

## ST3131：算出来的 $\hat x$ 有多可信

[ST3131 第 3 站](../courses/ST3131.html#mlr)让 $b$ 带上 random noise，$y=X\beta+\varepsilon$，$\text{Cov}(\varepsilon)=\sigma^2I$。骨架里的每个 matrix 都有了统计意义。

**Projection matrix 就是 hat matrix。** $\hat y=Hy$，$H=X(X^\top X)^{-1}X^\top$ 正是骨架里的 $P$。对三个点，

$$P=\frac16\begin{pmatrix}5&2&-1\\2&2&2\\-1&2&5\end{pmatrix}$$

diagonal 上的 $\tfrac56,\tfrac13,\tfrac56$ 是 leverage，加起来是 $\text{tr}\,P=2$，等于 unknown 的个数。

**Normal equations 的 matrix，inverse 是 covariance。** ST3131 证明了 $\text{Cov}(\hat\beta)=\sigma^2(X^\top X)^{-1}$。Weighted 的版本同样几行：$\hat x=(A^\top WA)^{-1}A^\top Wb$，$\text{Cov}(b)=\Sigma=W^{-1}$，

$$\text{Cov}(\hat x)=(A^\top WA)^{-1}A^\top W\,\Sigma\,WA(A^\top WA)^{-1}=(A^\top WA)^{-1}(A^\top WA)(A^\top WA)^{-1}=(A^\top WA)^{-1}$$

三个点：$(A^\top A)^{-1}=\tfrac16\begin{pmatrix}14&-6\\-6&3\end{pmatrix}$，$\text{Var}(\hat D)=\tfrac{\sigma^2}2=\sigma^2/S_{tt}$，和 [ST3131 第 2 站](../courses/ST3131.html#infer)的 $\text{Var}(b_1)=\sigma^2/S_{xx}$ 一致。

Robot 的 $A^\top WA$ 正是 graph SLAM 的 $H$，所以 $H^{-1}$ 就是 pose 的 covariance。CS4278 和 RB3302 那两站没有算这一步，这里算：

$$H^{-1}=\begin{pmatrix}200&-100\\-100&500\end{pmatrix}^{-1}=\frac1{90000}\begin{pmatrix}500&100\\100&200\end{pmatrix}=\begin{pmatrix}0.005556&0.001111\\0.001111&0.002222\end{pmatrix}$$

$\sigma(x_1)=0.0745$，$\sigma(x_2)=0.0471$。$(2,2)$ entry $0.002222=1/450$，正是上面 Schur complement 的倒数：block matrix 的 inverse 的右下 block 是 Schur complement 的 inverse，所以消掉一部分 unknown 后剩下的 Schur complement，就是剩下那部分 unknown 的 information。只有两段 odometry、没有 landmark 时，$H=\begin{pmatrix}200&-100\\-100&100\end{pmatrix}$，$H^{-1}=\begin{pmatrix}0.01&0.01\\0.01&0.02\end{pmatrix}$，$\sigma(x_2)=0.141$；landmark 把它降到三分之一。

:::wrong 一条 measurement 只会让它直接测到的 unknown 更准
Landmark 只测了 $x_2-x_0$，和 $x_1$ 无关。没有它时 $\sigma(x_1)=\sqrt{0.01}=0.1$，有它之后是 $0.0745$。原因在 $H^{-1}$ 的 off-diagonal $0.001111$：odometry 把 $x_1$ 和 $x_2$ 连在一起，$x_2$ 变准了，$x_1$ 也跟着变准。CS4278 那一站说 landmark 让 $x_1$ 的 estimate 也挪了，这里是同一件事在 uncertainty 上的样子。
:::

**Residual 的 degrees of freedom。** ST3131 用 $\text{tr}(I-H)=n-p-1$ 证明 $E[\text{SSE}]=(n-p-1)\sigma^2$，并在 normal noise 下得到 $\text{SSE}/\sigma^2\sim\chi^2_{n-p-1}$。Whitening 之后每个 row 的 noise variance 都是 1，同一个 proof 说的是：weighted 的 $F_{\min}=\hat e^\top W\hat e$ 服从 $\chi^2$，degrees of freedom 是 measurement 个数减 unknown 个数。这就是 CS4278 用来检查 loop closure 的 $\chi^2$ test 的来历。Robot：$F_{\min}=2\times100\times0.0444^2+400\times0.0111^2=0.444$，$3-2=1$ 个 degree of freedom，$P(\chi^2_1>0.444)=0.51$，没有理由怀疑；CS4278 里那条错的 loop closure 给出 16.0，远超 $\chi^2_1$ 的 0.95 quantile 3.84。

**Gauss–Markov 要的是 whitening 之后的 noise。** ST3131 的 Gauss–Markov theorem 假定 $\text{Cov}(\varepsilon)=\sigma^2I$。一般的 $\Sigma$ 下，乘上 $L$ 之后 $\text{Cov}(L\varepsilon)=L\Sigma L^\top=I$，theorem 对 whitened 的问题成立：best linear unbiased estimator 是 $W=\Sigma^{-1}$ 的 weighted least squares。

## CS3244 与 CS3264：prior 与 kernel

[CS3244 第 3 站](../courses/CS3244.html#reg)从 Gaussian prior $w_j\sim N(0,\tau^2)$ 推出 ridge regression，$\lambda=\sigma^2/\tau^2$，这正是骨架里“prior 是额外的 row”。那一站还用 Sherman–Morrison formula 推出 leave-one-out residual 是 $e_n/(1-H_{nn})$，不用重算 $N$ 次：从 normal equations 里减掉一个 row。下一节的 Kalman filter 往里加一个 row，用的是同一个 formula 的另一个方向。

:::wrong Ridge 把每个 coefficient 都往 0 缩
三个点，$\lambda=1$，$C$ 和 $D$ 都 penalize：$(A^\top A+I)\hat x=A^\top b$，$\begin{pmatrix}4&6\\6&15\end{pmatrix}$ 的 determinant 是 24，

$$\hat x=\frac1{24}\begin{pmatrix}15&-6\\-6&4\end{pmatrix}\begin{pmatrix}5\\11\end{pmatrix}=\begin{pmatrix}9/24\\14/24\end{pmatrix}=\begin{pmatrix}0.375\\0.583\end{pmatrix}$$

$C$ 从 0.667 缩到 0.375，$D$ 却从 0.5 涨到 0.583。缩小的是 norm 的 square：0.694 变成 0.481。$A$ 的两个 column $\mathbf 1$ 和 $t$ 不 perpendicular，$C$ 被压低之后，line 要靠更大的 slope 去够那几个点。只有 $A^\top A$ 是 diagonal 时，每个 coordinate 才按同一个比例缩小（CS3244 那一站 orthonormal 的情形 $z/(1+\lambda)$）。实际做 regression 时通常不 penalize intercept：先减去 mean 消掉 $C$，只对 $D$ 加 penalty，$D=S_{ty}/(S_{tt}+\lambda)=1/3$，这才是往 0 缩。
:::

[CS3264 第 6 站](../courses/CS3264.html#kernel)的 kernel ridge regression 解的是 $\alpha=(K+\lambda mI)^{-1}y$，$m$ 个 unknown，不管 feature space 有多少个 dimension。它和 ridge 的关系是一个 identity。对任意 $A$ 和 $\lambda>0$，

$$(A^\top A+\lambda I)A^\top=A^\top AA^\top+\lambda A^\top=A^\top(AA^\top+\lambda I)$$

左乘 $(A^\top A+\lambda I)^{-1}$、右乘 $(AA^\top+\lambda I)^{-1}$：

$$(A^\top A+\lambda I)^{-1}A^\top=A^\top(AA^\top+\lambda I)^{-1}$$

所以 ridge 的 solution 可以写成 $\hat x=A^\top\alpha$，$\alpha=(AA^\top+\lambda I)^{-1}b$。$AA^\top$ 的 $(i,j)$ entry 是第 $i$、$j$ 两个 row 的 inner product：三个点的每个 row 是 feature $\phi(t)=(1,t)$，所以 $AA^\top$ 就是 kernel $K(t,s)=1+ts$ 的 Gram matrix。在两边各算一遍，$\lambda=1$：

$$K=AA^\top=\begin{pmatrix}2&3&4\\3&5&7\\4&7&10\end{pmatrix},\qquad(K+I)\alpha=\begin{pmatrix}1\\2\\2\end{pmatrix}\ \Rightarrow\ \alpha=\frac1{24}\begin{pmatrix}1\\11\\-3\end{pmatrix}$$

（核对第一个 row：$3\cdot1+3\cdot11+4\cdot(-3)=24$。）$A^\top\alpha=\tfrac1{24}(1+11-3,\ 1+22-9)=\tfrac1{24}(9,\ 14)$，和上面 primal 的 ridge 相同。在 $t=4$ 处 predict，kernel 的写法是 $\sum_i\alpha_iK(t_i,4)=\tfrac1{24}(1\cdot5+11\cdot9-3\cdot13)=\tfrac{65}{24}=2.708$，primal 的写法是 $0.375+4\times0.5833=2.708$。CS3264 的 objective 带 $\tfrac1m$，所以它的 $\lambda m$ 对应这里的 $\lambda$：$m=3$ 时 CS3264 的 $\lambda=\tfrac13$。

两种写法要 invert 的 matrix 大小不同：primal 是 unknown 的个数（这里 $2\times2$），dual 是 data 的个数（$3\times3$）。Gaussian kernel 的 feature space 是 infinite-dimensional，只有 dual 能算。同一个 identity 在 [RB2202 第 5 站](../courses/RB2202.html#ik)给出 damped least squares 的两种写法 $(J^\top J+\lambda^2I)^{-1}J^\top=J^\top(JJ^\top+\lambda^2I)^{-1}$，在下一节给出 Kalman gain 的两种写法。

## CS4278 与 RB3302：measurement 一个一个地来

### Kalman update 是往 normal equations 里加一个 row

设已经处理过一些 row，information 是 $\Lambda=A^\top WA$，solution 是 $\hat x$，$P=\Lambda^{-1}$ 是它的 covariance（上面 ST3131 一节）。新来一个 row $cx\approx z$，variance 是 $R$（$c$ 是一个 row；vector measurement 时换成 matrix $C$）。新的 normal equations 是

$$(\Lambda+c^\top R^{-1}c)\,x=A^\top Wb+c^\top R^{-1}z=\Lambda\hat x+c^\top R^{-1}z$$

第二个等号用了旧的 normal equations $\Lambda\hat x=A^\top Wb$。于是新的 covariance 满足

$$P_{\text{new}}^{-1}=P^{-1}+c^\top R^{-1}c$$

Information 相加，这叫 information form。[RB3302 第 5 站](../courses/RB3302.html#loc)的一维例子用它验算最快：predict 之后 $\bar\sigma^2=0.05$，sensor 的 variance 0.02，information $20+50=70$，所以 $\sigma^2=\tfrac1{70}=0.0143$，mean $=\tfrac{20\times3.0+50\times3.2}{70}=3.143$，和那一站用 gain 算的一样。新的 solution 是 $x_{\text{new}}=P_{\text{new}}(P^{-1}\hat x+c^\top R^{-1}z)$。由上式 $P_{\text{new}}P^{-1}=P_{\text{new}}(P_{\text{new}}^{-1}-c^\top R^{-1}c)=I-P_{\text{new}}c^\top R^{-1}c$，代进去：

$$x_{\text{new}}=\hat x+K(z-c\hat x),\qquad K=P_{\text{new}}c^\top R^{-1}$$

$z-c\hat x$ 是 innovation。$K$ 换成 [CS4278 第 2 站](../courses/CS4278.html#kf)的写法要用上一节的 identity，只是中间多了 $P$：

$$(P^{-1}+c^\top R^{-1}c)\,Pc^\top=c^\top+c^\top R^{-1}cPc^\top=c^\top R^{-1}(R+cPc^\top)$$

两边左乘 $(P^{-1}+c^\top R^{-1}c)^{-1}$、右乘 $(cPc^\top+R)^{-1}$，得 $Pc^\top(cPc^\top+R)^{-1}=P_{\text{new}}c^\top R^{-1}$，即

$$K=Pc^\top(cPc^\top+R)^{-1}$$

最后，$P_{\text{new}}=P_{\text{new}}P^{-1}P=(I-Kc)P$。CS4278 的三个 formula（gain、mean 的 update、$P=(I-KC)\bar P$）就是多了一个 row 的 normal equations，一次只解多出来的那一部分。State 不随时间变的时候，Kalman filter 就是 recursive least squares。

在两边各算一遍。**先用 CS3264 的数。** [CS3264 第 7 站](../courses/CS3264.html#prob)对 $x=(1,2,3)$、$y=(1,2,2)$、prior $w\sim N(0,1)$、$\sigma^2=0.25$ 一次算出 posterior：precision 57，mean $\tfrac{44}{57}=0.7719$。现在把三个 row 一个一个喂给 Kalman filter：

| 第几个 row | $x_i$ | $S=x_i^2P+0.25$ | $K=x_iP/S$ | innovation $y_i-x_i\mu$ | $\mu$ | $P$ | $1/P$ |
|---|---|---|---|---|---|---|---|
| 开始 | | | | | 0 | 1 | 1 |
| 1 | 1 | 1.25 | 0.8 | 1 | 0.8 | 0.2 | 5 |
| 2 | 2 | 1.05 | 0.3810 | 0.4 | 0.9524 | 0.04762 | 21 |
| 3 | 3 | 0.6786 | 0.2105 | −0.8571 | 0.7719 | 0.01754 | 57 |

结果相同。最后一列每次加 $x_i^2/\sigma^2$：$1+4+16+36=57$，就是 information form。

**再用 DSA2102 的三个点。** 用一个很宽的 prior 开始（$\tau^2=10^6$），加完前两个点，mean 是 $(0,1)$，line 是 $y=t$，$P=\sigma^2(A_2^\top A_2)^{-1}=\sigma^2\begin{pmatrix}5&-3\\-3&2\end{pmatrix}$（$A_2$ 是 $A$ 的前两个 row，$A_2^\top A_2=\begin{pmatrix}2&3\\3&5\end{pmatrix}$）。第三个 row $c=(1,3)$，$z=2$，$R=\sigma^2$：

$$Pc^\top=\sigma^2\begin{pmatrix}5-9\\-3+6\end{pmatrix}=\sigma^2\begin{pmatrix}-4\\3\end{pmatrix},\qquad S=cPc^\top+R=\sigma^2(-4+9)+\sigma^2=6\sigma^2,\qquad K=\begin{pmatrix}-2/3\\1/2\end{pmatrix}$$

Innovation 是 $2-(0+3\times1)=-1$，

$$x_{\text{new}}=\begin{pmatrix}0\\1\end{pmatrix}-\begin{pmatrix}-2/3\\1/2\end{pmatrix}=\begin{pmatrix}2/3\\1/2\end{pmatrix},\qquad P_{\text{new}}=P-KSK^\top=\sigma^2\begin{pmatrix}5-\tfrac83&-3+2\\-3+2&2-\tfrac32\end{pmatrix}=\frac{\sigma^2}6\begin{pmatrix}14&-6\\-6&3\end{pmatrix}$$

（$P-KSK^\top$ 和 $(I-Kc)P$ 相同，因为 $cP=(Pc^\top)^\top=SK^\top$。）Mean 是 DSA2102 的 $(\tfrac23,\tfrac12)$，covariance 是 ST3131 的 $\sigma^2(X^\top X)^{-1}$。

::fig[thread-least-squares-rls] 动图：Kalman filter 一个一个吃进三个点。右边的 parameter plane 里，每个点 $C+t_iD=y_i$ 是一条宽 $\pm\sigma$ 的 band（图里取 $\sigma=0.3$）。第一个点之后，belief 沿 band 方向几乎没有 constraint；第二个点让两条 band 交出一个 ellipse；第三个点把 mean 拉到 $(\tfrac23,\tfrac12)$，ellipse 变小。左边是同一时刻的 line。

这个 $-1$ 在 CS3244 出现过：[CS3244 第 3 站](../courses/CS3244.html#reg)对同样三个点算 LOOCV，留出第三个点、用前两个点 fit，residual 正是 $-1$。Kalman filter 的 innovation 就是 leave-one-out residual，两边的 denominator 也对得上。加完这个 row 之后的 residual 是 $z-cx_{\text{new}}=(1-cK)(z-c\hat x)$，而 $1-cK=1-cPc^\top/S=R/S$。另一方面，这个 row 在 full fit 里的 leverage 是 $h=cP_{\text{new}}c^\top/R$；把 $P_{\text{new}}=P-KSK^\top$、$K=Pc^\top/S$ 代进去，

$$cP_{\text{new}}c^\top=cPc^\top-\frac{(cPc^\top)^2}{S}=\frac{cPc^\top\,(S-cPc^\top)}S=\frac{cPc^\top R}S,\qquad h=\frac{cPc^\top}S=1-\frac RS$$

所以 $R/S=1-h$，innovation 等于 $e/(1-h)$。数字上：$S=6\sigma^2$，$1-h_3=\tfrac16$（CS3244 算出 $h_3=\tfrac56$），residual $=-1\times\tfrac16=-\tfrac16$，正是 DSA2102 的 $\hat e_3$。CS3244 用 Sherman–Morrison 从 full fit 里拿掉一个 row，Kalman filter 往 fit 里加回一个 row，两个 operation 互为 inverse。

### Predict 是消掉上一个 state

Kalman filter 比 recursive least squares 多的，是 state 会动。Motion model $x_t=x_{t-1}+u_t+w$，$w\sim N(0,Q)$，在 least squares 里是一个 row $x_t-x_{t-1}\approx u_t$，weight $1/Q$。Filter 只保留最新的 state：加进这个 row，再用 Schur complement 消掉 $x_{t-1}$。

用 robot 的例子走一遍。$x_0=0$ 固定，第一段 odometry 之后 $x_1\sim N(1.1,\ 0.01)$，information 100。加入第二段 odometry 这个 row $x_2-x_1\approx1.0$，$\Omega=100$。$(x_1,x_2)$ 的 normal equations：

$$\begin{pmatrix}100+100&-100\\-100&100\end{pmatrix}\begin{pmatrix}x_1\\x_2\end{pmatrix}=\begin{pmatrix}100\times1.1-100\times1.0\\100\times1.0\end{pmatrix}=\begin{pmatrix}10\\100\end{pmatrix}$$

消掉 $x_1$：$x_2$ 的 information 是 $100-\tfrac{100\times100}{200}=50$，右边是 $100+\tfrac{100\times10}{200}=105$，所以 $\bar P=\tfrac1{50}=0.02$，$\bar\mu=\tfrac{105}{50}=2.1$。这正是 CS4278 的 predict：$\bar P=P+Q=0.01+0.01$，$\bar\mu=\mu+u=1.1+1.0$。

再用 landmark 那个 row update，$R=0.0025$：$K=\tfrac{0.02}{0.0225}=0.8889$，$\mu=2.1+0.8889\times(2.0-2.1)=2.0111$，$P=(1-0.8889)\times0.02=0.002222=\tfrac1{450}$。和骨架里一次解完三个 row 得到的 $x_2=2.0111$、ST3131 一节的 $\text{Var}(x_2)=\tfrac1{450}$ 完全相同。

不同的是 $x_1$。Filter 早已把 $x_1$ 消掉，它还停在 1.1；一次解完的答案是 1.0556。加了 landmark 之后，$(x_1,x_2)$ 的 system 是 $\begin{pmatrix}200&-100\\-100&500\end{pmatrix}x=\begin{pmatrix}10\\900\end{pmatrix}$，正是骨架里那一个；把 $x_2=2.0111$ 代回第一个 row，$x_1=\tfrac{10+100\times2.0111}{200}=1.0556$。从前往后一个个消掉 state，再从后往前 back substitution，就是对整条 trajectory 做 least squares。Kalman filter 只做前一半，给出的最新 state 是精确的，早先的 state 不再修改。[CS4278 第 4 站](../courses/CS4278.html#slam)开头说的 smoothing 与 filtering 的区别，在这里是一个 back substitution 的差别。Triggs 等人的 bundle adjustment 综述也指出，time recursion 产生 block tridiagonal 的 system，从一端起逐个做 $2\times2$ block 的 Schur complement 来解，并说这种 reduction 是所有 recursive filtering 方法的基础。

### EKF 的 update 是 Gauss–Newton 的第一步

CS4278 的 EKF 例子：robot 在 track 上，landmark 在 $(0,2)$，测 range $h(x)=\sqrt{x^2+4}$；prior $N(3,\ 0.5^2)$，读到 $z=3.95$，$R=0.05^2$。

::fig[thread-least-squares-ekf] 动图：从 prior mean 3 出发做 Gauss–Newton。第一步到 3.4081，正是 EKF 的答案；在那里重新 linearize，第二步到 3.4009，已经停在 MAP。下面的尺子把 track 上 3.396 到 3.412 这一小段放大。

Posterior 的 mode 让 prior 的 row 和 measurement 的 row 加权之后的 square 之和最小：

$$F(x)=\frac{(x-\bar\mu)^2}{\bar P}+\frac{(z-h(x))^2}{R},\qquad r(x)=\begin{pmatrix}(x-\bar\mu)/\sqrt{\bar P}\\(h(x)-z)/\sqrt R\end{pmatrix},\qquad J=\begin{pmatrix}1/\sqrt{\bar P}\\H/\sqrt R\end{pmatrix}$$

$H=h'(x)$。从 $x=\bar\mu$ 出发，$r$ 的第一个 component 是 0，Gauss–Newton 的一步是

$$\delta=-\frac{J^\top r}{J^\top J}=\frac{H\,(z-h(\bar\mu))/R}{1/\bar P+H^2/R}=\frac{\bar PH}{H^2\bar P+R}\,\big(z-h(\bar\mu)\big)$$

Coefficient 正是 EKF 的 $K$。而 EKF 的 posterior variance $(1-KH)\bar P$ 化简后是 $(1/\bar P+H^2/R)^{-1}=(J^\top J)^{-1}$，就是 ST3131 一节的“normal equations 的 matrix 的 inverse”。所以 EKF 是只走一步、不再 relinearize 的 Gauss–Newton。

数字：

| 第几步 | $x$ | $H=h'(x)$ | $F(x)$ | 下一步的 $\delta$ |
|---|---|---|---|---|
| 0 | 3 | 0.8321 | 47.46 | 0.4081 |
| 1 | 3.4081 | 0.8625 | 0.667 | −0.0072 |
| 2 | 3.40086 | 0.8620 | 0.6514 | −0.000005 |

第一步 3.4081 就是 CS4278 算的 EKF。第二步的 $\delta$ 要用一般的 $x$ 处的 $r$：两个 component 都不为 0，$\delta=-\big[(x-\bar\mu)/\bar P+H(h(x)-z)/R\big]\big/\big(1/\bar P+H^2/R\big)$。走完第二步就停在 MAP 3.40085，此处 $(J^\top J)^{-1}=0.003320$。CS4278 用 numerical integration 求出的 exact posterior：mean 3.4005，variance 0.00332。EKF 的 mean 差 0.0076、variance 0.00356；多走一步，mean 只差 0.0004，剩下的是 mode 和 mean 之差，任何 least squares 都消不掉。这样反复 relinearize 的 filter 叫 iterated EKF；Bell 与 Cathey 1993 年证明了它的 update 就是对 maximum likelihood estimate 做 Gauss–Newton。

:::edge 多走几步也救不了 bimodal 的 posterior
CS4278 那一站的反例：prior $N(0,1)$，读到 $z=2.5$。在 $x=0$ 处 $H=0$，$r$ 的第一个 component 也是 0，所以 $J^\top r=0$，Gauss–Newton 的 $\delta$ 是 0，一步也不走。$x=0$ 是 $F$ 的 stationary point，而且是 $F$ 的 local maximum（$F(0)=100$），posterior 的两个 peak 在 $\pm1.49$。从别处出发，iterate 也只能找准其中一个 peak，一个 Gaussian 表示不了两个。
:::

### Graph SLAM：$H$ 是 information matrix

[CS4278 第 4 站](../courses/CS4278.html#slam)和 [RB3302 第 6 站](../courses/RB3302.html#map)的 $F(x)=\sum e_{ij}^\top\Omega_{ij}e_{ij}$、$H=\sum J_{ij}^\top\Omega_{ij}J_{ij}$、$H\Delta x=-b$，是骨架的 weighted、nonlinear 版本。每条 edge 往 $H$ 的四个 block 里加东西，和 Kalman filter 的 $P^{-1}\mathrel{+}=C^\top R^{-1}C$ 是同一个加法：一条 measurement 就是 normal equations 里的一个 row，它对 matrix 的贡献是这个 row 的 $J^\top\Omega J$。区别在于 Kalman filter 每加完就消掉旧的 state，graph SLAM 全部留着，并在每轮 Gauss–Newton 里对所有 pose 重新 linearize。Dellaert 和 Kaess 的 Square Root SAM 指出这两件事的后果：把过去的 pose marginalize 掉之后，information matrix 会变成 dense 的；过去的 linearization error 也被一起固定在 matrix 里，再也改不了。

Dense 是怎么来的，robot 的例子能看到。把 $x_0$ 也当 unknown，$(x_0,x_1,x_2)$ 的 $H$ 是 CS4278 写的 $\begin{pmatrix}500&-100&-400\\-100&200&-100\\-400&-100&500\end{pmatrix}$。消掉 $x_1$，$(x_0,x_2)$ 那个 entry 从 $-400$ 变成 $-400-\tfrac{(-100)(-100)}{200}=-450$：多出来的 $-50$ 就是上面那张图里串出来的 edge。消掉一个 node，它的所有邻居之间都会多出 edge；filter 一路消下去，所有 landmark 最后两两相连。这叫 fill-in，所以 elimination order 是 sparse solver 最要紧的选择。

**Gauge 就是 ST3131 的 dummy variable trap。** 上面这个 $3\times3$ 的 $H$ 每个 row 加起来都是 0，singular。原因在 $A$：三个 row 分别是 $(-1,1,0)$、$(0,-1,1)$、$(-1,0,1)$，于是 $A\,(1,1,1)^\top=0$，所有 pose 一起挪动同一个距离，每个 residual 都不变。[ST3131 第 7 站](../courses/ST3131.html#factor)里，intercept 加上三组各自的 dummy，$d_0+d_1+d_2=\mathbf 1$，于是 $X\,(1,-1,-1,-1)^\top=0$，三个 dummy 的 coefficient 一起加上一个数、intercept 减去同一个数，fitted value 不变。两边都是某个 column 的 combination 为 0，data 只决定差：pose 之差、group mean 之差。治法也对得上：ST3131 删掉 ctrl 的 dummy、把 ctrl 当 reference，SLAM 固定 $x_0=0$，删掉的都是一个 column；之后 $\beta_1$ 是 trt1 减 ctrl，$x_1$ 是 $x_1$ 减 $x_0$。CS4278 给 $x_0$ 的 diagonal block 加 $I$ 是另一种治法，即骨架里的 prior row。Bundle adjustment 的 gauge 有 7 个方向，[CS4277 第 7 站](../courses/CS4277.html#ba)数过。

EE4308（自主机器人）的 EKF SLAM 和 EE4309（机器人感知）也走这条路，那两页还没写。

## CS4277：bundle adjustment

[CS4277 第 7 站](../courses/CS4277.html#ba)是骨架最完整的一次使用：residual nonlinear，unknown 上万，matrix sparse，而且有 gauge。这一站和别的课之间有三座桥。

**Levenberg–Marquardt 是对 step 做 ridge。** $(J^\top J+\lambda I)\delta=-J^\top r$ 就是把 $-r$ 对 $J$ 做 ridge regression，prior 是 $\delta\approx0$。[RB2202 第 5 站](../courses/RB2202.html#ik)的 damped least squares 是它在 IK 上的样子：residual 是 $e=x_d-f(\theta)$，$(J^\top J+\lambda^2I)\Delta\theta=J^\top e$。那一站在伸直的 arm $(0,0)$ 处取 $\lambda=0.1$，$J^\top J=\begin{pmatrix}4&2\\2&1\end{pmatrix}$ singular，加上 $0.01I$ 后 determinant 是 $4.01\times1.01-4=0.0501$，解出 $\Delta\theta=(0.545,\ 0.273)$，和那一站用 $J^\top(JJ^\top+\lambda^2I)^{-1}e$ 算的相同。Newton–Raphson IK 加上 damping，就是 Levenberg 的 step。

CS4277 用的是 Marquardt 的 $\lambda\,\mathrm{diag}(J^\top J)$。它等于先把 $J$ 的每个 column 缩放到 unit length 再做普通 ridge：记 $S=\mathrm{diag}(\|J_{:,k}\|)$，$J'=JS^{-1}$，$\delta=S^{-1}\delta'$。对 $J'$ 做 ridge，$(S^{-1}J^\top JS^{-1}+\lambda I)\,S\delta=-S^{-1}J^\top r$，两边左乘 $S$，得 $(J^\top J+\lambda S^2)\delta=-J^\top r$，而 $S^2=\mathrm{diag}(J^\top J)$。上面那个 `:::wrong` 说一个 equation 乘 $k$ 等于 weight 乘 $k^2$；column 也一样，parameter 换 unit 会改变 Levenberg 的 damping 落在哪个方向上。Camera 的 rotation 用 rad、translation 和点用 m，Marquardt 的写法让 damping 不依赖这些 unit，做 ridge 之前先 standardize feature 是同一个理由。

**Schur complement 是 FWL theorem。** Unknown 分成 camera 的 $\delta_c$ 和点的 $\delta_p$，$J=(J_c\ \ J_p)$，于是 $U=J_c^\top J_c$，$W=J_c^\top J_p$，$V=J_p^\top J_p$。消掉 $\delta_p$ 得到的 reduced camera system 是

$$\big(U-WV^{-1}W^\top\big)\delta_c=-J_c^\top r+WV^{-1}J_p^\top r$$

把 $U$、$W$、$V$ 代进去，记 $M_p=I-J_p(J_p^\top J_p)^{-1}J_p^\top$：

$$\big(J_c^\top M_pJ_c\big)\,\delta_c=-J_c^\top M_p\,r$$

$M_p$ 是把 vector 里能由 $J_p$ 的 column 解释的部分去掉的 projection，symmetric、idempotent，所以左边是 $(M_pJ_c)^\top(M_pJ_c)$，右边是 $(M_pJ_c)^\top(-M_pr)$：这是拿 $-M_pr$ 对 $M_pJ_c$ 做 least squares。[ST3131 第 3 站](../courses/ST3131.html#mlr)的 FWL theorem 说的正是这件事：先把 $x_2$ 能解释的部分从 $y$ 和 $x_1$ 里都去掉，再拿 residual 对 residual 做 regression，得到的就是 multiple regression 里 $x_1$ 的 coefficient。BA 里“$x_2$”是全部 3D 点，$V$ 是 block diagonal，$M_p$ 好算；camera 的 step 只用到 camera Jacobian 里点的移动无法解释的那部分。最小的例子在骨架里：把 $C$ 当成“点”、$D$ 当成“camera”，$M_p$ 就是减去 mean，Schur complement 是 $S_{tt}=2$。

**Fit 得比真值还好，是因为 degrees of freedom。** CS4277 那一站的 `:::wrong` 里，toy problem converge 之后 RMS reprojection error 是 0.101 pixel，把真实的 camera 和点代进去反而是 0.167。ST3131 的 $E[\text{SSE}]=(n-p-1)\sigma^2$ 给出了这个比例。真值处的 residual 就是 noise，48 个，$E[\text{SSE}]=48\sigma^2$；在 solution 附近把问题 linearize，residual 是 noise 去掉 $J$ 的 column space 里那部分，gauge 固定之后 unknown 有 32 个，$E[\text{SSE}]\approx(48-32)\sigma^2$。RMS 之比约为 $\sqrt{16/48}=0.577$，实际是 $0.101/0.167=0.605$。

## MIT 6.4210：ICP 里的 Procrustes

[MIT 6.4210 第 3 站](../courses/MIT-6.4210.html#pose)在 correspondence 已知时解

$$\min_{p,R}\ \sum_{i=1}^N\big\|p+R\,{}^Op^{m_{c_i}}-p^{s_i}\big\|^2,\qquad R^\top R=I,\ \det R=1$$

它往骨架上加的是一个 constraint：$R$ 必须是 rotation，可行的 $R$ 不构成 linear space，normal equations 不能直接用。

**Translation 先消掉。** 固定 $R$，$p$ 在每一个 residual 里都以 $I$ 出现，就像 ST3131 的 intercept 在每个 row 都是 1。对 $p$ 的 normal equation 是 $Np+R\sum_i{}^Op^{m_{c_i}}-\sum_ip^{s_i}=0$，即 $p^*=\bar s-R\bar m$，和 ST3131 第一个 normal equation 给出的 $b_0=\bar y-b_1\bar x$ 是同一个 equation。代回去，两组点各自减去 centroid，translation 消失，剩下的只有 $R$。这是骨架里“先消掉一部分 unknown”的又一次出现。

::fig[thread-least-squares-kabsch] 动图：MIT 6.4210 那一站的三个点。Model 先整体挪动，让 centroid 和 scene 的 centroid 重合；再绕 centroid 转 37.36°。两步分别对应 $p^*=\bar s-R\bar m$ 和 $\theta^*=\mathrm{atan2}(B,A)$。

那一站的数：model $(0,0)$、$(3,0)$、$(0,3)$，scene $(4,1)$、$(6.4,2.8)$、$(2.3,3.3)$，centroid $\bar m=(1,1)$、$\bar s=(4.233,2.367)$，$A=9.3$，$B=7.1$，$\theta^*=37.36°$。

:::wrong 先不管 constraint，用 least squares 求一个 $2\times2$ 的 matrix $M$，再取离它最近的 rotation
不加 constraint，$\min_M\sum_i\|M\tilde m_i-\tilde s_i\|^2$ 是普通的 least squares，normal equations 是 $M\sum_i\tilde m_i\tilde m_i^\top=\sum_i\tilde s_i\tilde m_i^\top$。代入那一站的点：

$$\sum_i\tilde s_i\tilde m_i^\top=\begin{pmatrix}6.5&-5.8\\1.3&2.8\end{pmatrix},\qquad\sum_i\tilde m_i\tilde m_i^\top=\begin{pmatrix}6&-3\\-3&6\end{pmatrix},\qquad M=\begin{pmatrix}0.8&-0.567\\0.6&0.767\end{pmatrix}$$

这个 $M$ 把 model 恰好映到 scene 上，residual 是 0（centered 之后只剩 4 个 degree of freedom，$M$ 有 4 个 entry）。离 $M$ 最近的 rotation 转 36.67°，cost 是 0.01415；直接带 constraint 解的 37.36°，cost 是 0.01248，前者大了 13%。

错在 objective 本身变了。展开 $\sum_i\|R\tilde m_i-\tilde s_i\|^2=\sum_i\|R\tilde m_i\|^2-2\sum_i\tilde s_i^\top R\tilde m_i+\sum_i\|\tilde s_i\|^2$。$R$ 是 rotation 时第一项等于 $\sum\|\tilde m_i\|^2$，是 constant，只剩中间那项，所以 MIT 那一站的 $R^*$ 只由 $\sum\tilde s_i\tilde m_i^\top$ 决定。换成一般的 $M$，第一项 $\sum\|M\tilde m_i\|^2$ 依赖 $M$，于是 solution 里多了 $(\sum\tilde m_i\tilde m_i^\top)^{-1}$ 这个 factor。两者只在 $\sum\tilde m_i\tilde m_i^\top$ 是 $I$ 的倍数、model 的点向各个方向散得一样开时才一致；这个三角形的 off-diagonal 是 $-3$。
:::

ICP 在不知道 correspondence 时轮流做两件事：按当前的 pose 给每个 scene 点找最近的 model 点，再用上面的 centroid 加 SVD 解 pose。第二步每次都是这一节的 constrained least squares，cost 单调不增，但整个问题 nonconvex，会停在 local minimum，那一站的 L 形物体从 200° 出发就停在了错的地方。Least squares 的另一个弱点在这里也看得到：一个离物体 1 m 的 outlier 让 12 个点的 centroid 挪 8.3 cm，这是 square 的代价，[DSA2102 第 4 站](../courses/DSA2102.html#ls)提过，[CS4243 第 5 站](../courses/CS4243.html#ransac)用 RANSAC 处理。

:::from
骨架的论证顺序是为这条线安排的；projection 的 proof 是 MA2101 第 8 站 best approximation 的 matrix 写法；两个例子取自 DSA2102 第 4 站和 CS4278 第 4 站。读过的外部材料：Shimkin（Technion）Kalman filter 讲义第 4 章（4.4 节把 filter 写成 prior、measurement、process noise 三项的 least squares，最后一个 component 等于 filter 的 estimate；4.5 节的 information form 与 $K=P^+H^\top R^{-1}$）；Bell 与 Cathey, The iterated Kalman filter update as a Gauss–Newton method, IEEE TAC 38(2), 1993，只读到摘要的转述；Dellaert 与 Kaess, Square Root SAM, IJRR 2006 第 3 至 7 节（whitening、$A^\top A=R^\top R$、Cholesky 与 QR、marginalize 后变 dense、linearization 被固定、elimination order）；Triggs 等, Bundle Adjustment: A Modern Synthesis 的前约 40%（weighted SSE、damped Newton、reduced camera system、time recursion 的 Schur complement）；Statlect 的 partitioned regression（代入法消掉一部分 coefficient、intercept 对应 demean）；Columbia COMS 4771 第 7 讲 kernels 的 slides（ridge 的 dual 与 $(K+n\lambda I)\alpha=y$）。Dellaert 与 Kaess 2017 年的 Factor Graphs for Robot Perception 没有抓到。各座桥的具体对应和所有数字是自己推导、用 python 实算的。Weighted 的 Gauss–Markov（Aitken 的结论）和“smoothing 等于前向 elimination 加 back substitution”凭自己的知识写，没有找原文核对。
:::
