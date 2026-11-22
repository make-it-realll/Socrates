---
title: 不被转走的方向
lead: "一个 matrix 被反复作用时，长期行为只由几个不被它转走的方向和各自的倍数决定，从一根倒立的 pendulum 推出的这一套推导，串起 power iteration、stationary distribution、PageRank、pole 与 stability、PCA。"
line: num
---

Pendulum 竖直向上，在 upright 附近 linearize 成 $\ddot\theta=\theta$（取 $g/l=1$，和 [MIT-6.8210 第 3 站](../courses/MIT-6.8210.html#lqr)末尾的设定相同）。State 取 $x=(\theta,\omega)$，$\omega=\dot\theta$，用 step $h=0.1$ 的 explicit Euler 离散：$\theta_{k+1}=\theta_k+0.1\,\omega_k$，$\omega_{k+1}=\omega_k+0.1\,\theta_k$，即

$$x_{k+1}=Ax_k,\qquad A=\begin{pmatrix}1&0.1\\0.1&1\end{pmatrix}$$

Pendulum 偏了 $\theta_0=0.1$ rad，有人往回推了一把，给它 $\omega_0=-0.08$。逐步乘 $A$：

| $k$ | 0 | 5 | 11 | 20 | 30 | 40 |
|---|---|---|---|---|---|---|
| $\theta_k$ | 0.1 | 0.0692 | 0.0568 | 0.0782 | 0.1783 | 0.4539 |
| $\omega_k$ | $-0.08$ | $-0.0370$ | 0.0003 | 0.0563 | 0.1707 | 0.4513 |

前 11 步 $\theta$ 在变小，看起来在回到顶上；之后掉头，越倒越快，到第 40 步 $\theta$ 和 $\omega$ 几乎相等。这张表回答不了三个问题：为什么先回来再倒下；$\omega_0$ 取多少才真能回到顶上；倒下时为什么 $\theta$ 和 $\omega$ 变得一样、每步放大多少倍。直接算出 $A^{40}$ 也只得到四个数，看不出原因。

::fig[thread-eigen-pendulum] 左边是 pendulum，右边是同一时刻的 state $(\theta,\omega)$。把 state 拆成沿 $\omega=\theta$ 的部分（粗线）和沿 $\omega=-\theta$ 的部分（虚线）：看虚线每步缩成 0.9 倍、粗线每步放大 1.1 倍，state 先向原点靠近，再沿 $\omega=\theta$ 被甩出去。

## 骨架：把 $A^k$ 拆成几个数的 power

### 找被送回自己的 line

$A$ 作用在一个 vector 上，一般会把它转到别的方向。如果有 nonzero 的 $v$ 使

$$Av=\lambda v$$

$v$ 所在的 line 就被送回它自己，在这条 line 上 $A$ 只是乘一个数。乘 $k$ 次就是乘 $\lambda^k$：$A^kv=\lambda^kv$。这样的 $v$ 叫 eigenvector，$\lambda$ 叫 eigenvalue。

$Av=\lambda v$ 即 $(A-\lambda I)v=0$。要它有 nonzero 的 solution，$A-\lambda I$ 必须 singular，即 $\det(A-\lambda I)=0$。对开头的 $A$：

$$\det\begin{pmatrix}1-\lambda&0.1\\0.1&1-\lambda\end{pmatrix}=(1-\lambda)^2-0.01=0\quad\Longrightarrow\quad\lambda=1\pm0.1$$

$\lambda_1=1.1$：$A-1.1I=\begin{pmatrix}-0.1&0.1\\0.1&-0.1\end{pmatrix}$，kernel 是 $\theta=\omega$，取 $v_1=(1,1)$。$\lambda_2=0.9$：$A-0.9I=\begin{pmatrix}0.1&0.1\\0.1&0.1\end{pmatrix}$，kernel 是 $\theta=-\omega$，取 $v_2=(1,-1)$。

两条 line 都有物理意思。State 在 $\omega=\theta$ 上，是 pendulum 正往倒的方向转、angular velocity 等于偏角；下一步仍在这条 line 上，整体放大 1.1 倍。State 在 $\omega=-\theta$ 上，是正往回转、angular velocity 恰好等于偏角；下一步仍在这条 line 上，缩小到 0.9 倍。

### 按 eigenvector 拆开 $x_0$

$v_1,v_2$ 不 collinear，是 $\mathbb R^2$ 的 basis，所以 $x_0=c_1v_1+c_2v_2$ 一定解得出来：$c_1+c_2=0.1$，$c_1-c_2=-0.08$，得 $c_1=0.01$，$c_2=0.09$。$A$ 是 linear 的，两部分各走各的：

$$x_k=A^kx_0=c_1\lambda_1^kv_1+c_2\lambda_2^kv_2=0.01\cdot1.1^k\begin{pmatrix}1\\1\end{pmatrix}+0.09\cdot0.9^k\begin{pmatrix}1\\-1\end{pmatrix}$$

拿表的最后一列核对：$1.1^{40}=45.26$，$0.9^{40}=0.01478$，$\theta_{40}=0.4526+0.0013=0.4539$，$\omega_{40}=0.4526-0.0013=0.4513$。

三个问题都有了答案。

1. $\theta_k=0.01\cdot1.1^k+0.09\cdot0.9^k$。开始时衰减的那一项大（0.09 对 0.01），所以 $\theta$ 先变小；两项之比 $(1.1/0.9)^k$ 一直在长，增长的那一项迟早占上风。把 $k$ 当成连续的量，对 $k$ 求 derivative 并令它为 0：$0.01\cdot1.1^k\ln1.1-0.09\cdot0.9^k\ln\tfrac1{0.9}=0$，即 $(11/9)^k=\dfrac{9\ln(1/0.9)}{\ln1.1}=9.95$，$k=\dfrac{\ln9.95}{\ln(11/9)}=11.4$，和表里第 11、12 步最小一致。
2. 回得来，当且仅当增长的那一项不存在：$c_1=\tfrac12(\theta_0+\omega_0)=0$，即 $\omega_0=-\theta_0$ 恰好成立。
3. 衰减部分相对增长部分每步乘 $0.9/1.1=0.818$，所以 $x_k$ 的方向转向 $v_1$，$\theta\approx\omega$；之后整体每步放大 $\lambda_1=1.1$。

写成 matrix：把 eigenvector 排成 $V=(v_1\ v_2)$，eigenvalue 排成 diagonal 的 $\Lambda$，$AV=V\Lambda$，$A=V\Lambda V^{-1}$，$c=V^{-1}x_0$，

$$A^k=V\Lambda V^{-1}\,V\Lambda V^{-1}\cdots V\Lambda V^{-1}=V\Lambda^kV^{-1}$$

中间的 $V^{-1}V$ 全部消掉。一般地，只要 $n\times n$ 的 $A$ 有 $n$ 个 linearly independent 的 eigenvector，$A^kx_0=\sum_ic_i\lambda_i^kv_i$：matrix 的 power 变成 $n$ 个数各自的 power。

:::wrong 往回推得越用力，越容易回到顶上
$c_1=\tfrac12(\theta_0+\omega_0)$。$\omega_0=-0.12$ 时 $c_1=-0.01$，增长的那一项换了 sign，pendulum 冲过顶点倒向另一边：第 40 步 $\theta=-0.451$。只有 $\omega_0=-0.1$ 恰好让 $c_1=0$。差一点也不是“慢一点回来”：$\omega_0=-0.1+2\times10^{-6}$ 给出 $c_1=10^{-6}$，乘上 $1.1^k$，121 步后 $\theta$ 又回到 0.1 rad。
:::

### 长期只看最大的 $|\lambda|$

把 eigenvalue 按 absolute value 排好，$|\lambda_1|>|\lambda_2|\ge\cdots$，从 $A^kx_0$ 里提出 $\lambda_1^k$：

$$A^kx_0=\lambda_1^k\Big[c_1v_1+c_2\Big(\frac{\lambda_2}{\lambda_1}\Big)^kv_2+\cdots+c_n\Big(\frac{\lambda_n}{\lambda_1}\Big)^kv_n\Big]$$

只要 $c_1\ne0$，方括号趋向 $c_1v_1$，偏差按 $|\lambda_2/\lambda_1|^k$ 缩小。由此有两个结论。

**方向**趋向 $v_1$，速度是 $|\lambda_2/\lambda_1|$。这就是 power iteration：随便取一个 vector 反复乘 $A$，得到 dominant eigenvector。

**大小**每步乘 $|\lambda_1|$，分三种情形：

| | 长期 | 叫法 |
|---|---|---|
| 所有 $|\lambda_i|<1$ | $A^kx_0\to0$，不论 $x_0$ | stable |
| $\lambda_1=1$，其余 $|\lambda_i|<1$ | $A^kx_0\to c_1v_1$，只通过 $c_1$ 依赖 $x_0$ | steady state |
| $|\lambda_1|>1$ | 沿 $v_1$ 长到 infinity，除非 $c_1=0$ | unstable |

这一张表和上面那个方向的结论，就是这条线全部的骨架。后面每门课做的，是读其中一行：要 dominant eigenvector 的是 power iteration 和 PCA，要 steady state 的是 Markov chain 和 PageRank，要分清 stable 和 unstable 的是 control 和 dynamics。

### 连续时间：$\lambda^k$ 换成 $e^{\lambda t}$

不离散，$\ddot\theta=\theta$ 就是 $\dot x=Bx$，$B=\begin{pmatrix}0&1\\1&0\end{pmatrix}$。$B$ 的 eigenvector 仍是 $v_1=(1,1)$、$v_2=(1,-1)$，eigenvalue 是 $1$ 和 $-1$。在一个 eigenvector 上试 $x(t)=e^{\lambda t}v$：左边 $\dot x=\lambda e^{\lambda t}v$，右边 $Bx=e^{\lambda t}Bv=\lambda e^{\lambda t}v$，相等。所以

$$x(t)=c_1e^{t}v_1+c_2e^{-t}v_2$$

$t=0$ 时就是 $x_0$，$c_1=0.01$、$c_2=0.09$ 不变。$\theta(t)=0.01e^t+0.09e^{-t}$ 的 derivative $0.01e^t-0.09e^{-t}$ 在 $e^{2t}=9$，即 $t=\ln3=1.099$ 时为 0，最小值 $0.01\times3+0.09/3=0.06$；Euler 给的是 $t=1.1$ 时 0.0568，差在离散的 error 上。

连续时间里 $e^{\lambda t}$ 的大小由 real part 决定：$\lambda=\sigma+j\nu$ 时 $|e^{\lambda t}|=e^{\sigma t}|e^{j\nu t}|=e^{\sigma t}$，imaginary part 只让它转圈。上面那张表换成：所有 $\operatorname{Re}\lambda<0$ 时 stable；$\lambda=0$ 给 steady state；有一个 $\operatorname{Re}\lambda>0$ 就 unstable。

离散与连续之间的换算也在这里。Euler 的 matrix 是 $A=I+hB$，$(I+hB)v=v+h\lambda v$，所以 eigenvector 不变、eigenvalue 变成 $1+h\lambda$：$1\pm0.1$。不用 Euler，按 exact solution 每隔 $h$ 取一次值，$x(t+h)=e^{hB}x(t)$，eigenvalue 是 $e^{h\lambda}=e^{\pm0.1}=1.1052,\ 0.9048$。$1+h\lambda$ 是 $e^{h\lambda}$ 的前两项。$|e^{h\lambda}|<1$ 与 $\operatorname{Re}\lambda<0$ 是同一个条件，所以 unit circle 的内部对应 left half-plane；$|1+h\lambda|<1$ 却不总是成立，这是后面[第二座桥](#bridge2)的内容。

### Symmetric matrix：互相 perpendicular 的 eigenvector 与 Rayleigh quotient

开头的 $A$ 和 $B$ 都是 symmetric 的，$v_1\perp v_2$。这时求 $c_i$ 不用解 system，做 projection 就够了：$c_1=\dfrac{v_1^\top x_0}{v_1^\top v_1}=\dfrac{0.1-0.08}{2}=0.01$。Real symmetric matrix 总有一组 orthonormal 的 eigenvector（spectral theorem），$A=Q\Lambda Q^\top$，$Q^{-1}=Q^\top$。

不 symmetric 时不能这样做。MA2101 第 5 站的 $\begin{pmatrix}4&-2\\1&1\end{pmatrix}$，eigenvector 是 $(1,1)$（eigenvalue 2）和 $(2,1)$（eigenvalue 3），dot product 是 3。$(1,0)$ 要解 $c_1+2c_2=1$、$c_1+c_2=0$，得 $c_1=-1$、$c_2=1$，于是 $A^k(1,0)^\top=-2^k(1,1)^\top+3^k(2,1)^\top$；$k=2$ 给出 $(14,5)$，和直接算的 $A(4,1)^\top=(14,5)^\top$ 相同。用 projection 会得到 $c_1=\tfrac12$，是错的。

Symmetric 还给出另一种用法。Unit vector $x=\sum_ic_iq_i$（$q_i$ orthonormal，$\sum c_i^2=1$）代进 quadratic form：

$$x^\top Ax=\Big(\sum_ic_iq_i\Big)^\top\Big(\sum_jc_j\lambda_jq_j\Big)=\sum_i\lambda_ic_i^2$$

这是以 $c_i^2$ 为 weight 的 eigenvalue 的 weighted average，所以落在 $\lambda_{\min}$ 和 $\lambda_{\max}$ 之间；$q_1$ 取最大的 eigenvalue 的 eigenvector 时，$x=q_1$ 取到最大。$R(x)=\dfrac{x^\top Ax}{x^\top x}$ 叫 Rayleigh quotient，它有两种用法：已经有一个近似的 eigenvector 时，用它读出 eigenvalue；问“哪个方向让一个 quadratic 的量最大或最小”时，答案就是最大或最小的 eigenvalue 的 eigenvector。开头的 $A$：$R\big((1,0)\big)=1$，$R(v_1)=1.1$，$R(v_2)=0.9$。

### 拆不开的两种情形

:::edge Complex eigenvalue：一边转一边缩放
Real matrix 的 eigenvalue 可以是 complex 的，例如 90° 的 rotation 没有 real eigenvector。写 $\lambda=re^{j\varphi}$，在对应的那一对 real vector 的 span（一个 plane）里，每乘一次就转 $\varphi$、缩放 $r$ 倍。长期大小仍由 $|\lambda|$ 决定，只是 error 不再单调缩小。后面 PageRank 的例子里 $\lambda_2=0.601e^{\pm j135^\circ}$，error 的 1-norm 每步缩小的倍数会 4 步一循环。
:::

:::edge Eigenvector 不够：多出一个 $k$
Shear $S=\begin{pmatrix}1&1\\0&1\end{pmatrix}$ 只有一个 eigenvalue 1、一个方向的 eigenvector，$S^k=\begin{pmatrix}1&k\\0&1\end{pmatrix}$ 随 $k$ linearly 增长，eigenvalue 1 却说“不增长”。换成 $J=\begin{pmatrix}0.9&1\\0&0.9\end{pmatrix}$：$J=0.9I+N$，$N^2=0$，$0.9I$ 和 $N$ commute，binomial expansion 只剩两项，

$$J^k=0.9^kI+k\,0.9^{k-1}N=\begin{pmatrix}0.9^k&k\,0.9^{k-1}\\0&0.9^k\end{pmatrix}$$

Eigenvalue 说每步乘 0.9，右上角却先涨到 $k=9,10$ 时的 3.874，再衰减，$k=40$ 时还有 0.657。EE2023 里重复的 pole 给出 $t\,e^{pt}$，是同一件事的连续版本。
:::

## 同一个 2×2 出现在八个地方

形如 $\begin{pmatrix}a&b\\b&a\end{pmatrix}$ 的 matrix，$(1,1)$ 和 $(1,-1)$ 一定是 eigenvector：

$$\begin{pmatrix}a&b\\b&a\end{pmatrix}\begin{pmatrix}1\\1\end{pmatrix}=(a+b)\begin{pmatrix}1\\1\end{pmatrix},\qquad\begin{pmatrix}a&b\\b&a\end{pmatrix}\begin{pmatrix}1\\-1\end{pmatrix}=(a-b)\begin{pmatrix}1\\-1\end{pmatrix}$$

这个形状在课程页里反复出现，因为两个对称的分量（两个 pixel、两个 gene、两个 parameter）最容易手算。同一对 eigenvector，eigenvalue 在每门课里读法不同：

| 出处 | matrix | 在 $(1,1)$ 上 | 在 $(1,-1)$ 上 | $\lambda$ 是什么 |
|---|---|---|---|---|
| [DSA2102](../courses/DSA2102.html#eig) power iteration | $\begin{pmatrix}2&1\\1&2\end{pmatrix}$ | 3 | 1 | 每步的倍数 |
| [MIT-6.8210](../courses/MIT-6.8210.html#lqr) Euler 离散的 pendulum | $\begin{pmatrix}1&0.1\\0.1&1\end{pmatrix}$ | 1.1 | 0.9 | 每步的倍数 |
| 不离散的同一个 pendulum | $\begin{pmatrix}0&1\\1&0\end{pmatrix}$ | 1 | $-1$ | exponential rate |
| [LSM2234](../courses/LSM2234.html#switch) toggle switch 的 saddle | $\begin{pmatrix}-1&-1.191\\-1.191&-1\end{pmatrix}$ | $-2.191$ | 0.191 | exponential rate |
| [DSA3102](../courses/DSA3102.html#gd) least squares 的 $X^\top X$ | $\begin{pmatrix}6&5\\5&6\end{pmatrix}$ | 11 | 1 | curvature |
| [CS4243](../courses/CS4243.html#feature) corner 的 second moment matrix | $\begin{pmatrix}100&25\\25&100\end{pmatrix}$ | 125 | 75 | 挪动 window 时 SSD 的变化 |
| [CS4243](../courses/CS4243.html#recog) 2-pixel image 的 covariance | $\begin{pmatrix}476.25&363.75\\363.75&476.25\end{pmatrix}$ | 840 | 112.5 | variance |
| [CS3244](../courses/CS3244.html#pca) 6 个点的 covariance | $\tfrac1{12}\begin{pmatrix}35&29\\29&35\end{pmatrix}$ | 5.333 | 0.5 | variance |

前四行和后四行是 matrix 的两种角色。前面的 matrix 被拿来**作用**：$x_{k+1}=Ax_k$ 或 $\dot x=Ax$，$\lambda$ 是倍数或 rate，分界是 $|\lambda|=1$ 或 $\operatorname{Re}\lambda=0$。后面的 matrix 被拿来**量**：$x^\top Sx$ 是沿 $x$ 方向的 variance、curvature 或 SSD，$\lambda$ 是这个量在 eigenvector 方向上的值，没有分界，只有排序。$X^\top X$ 两种角色都有：它是 objective 的 curvature，gradient descent 又让 error 每步乘 $I-tX^\top X$。

::fig[thread-eigen-family] 六个地方，同一对方向（虚线是 $(1,1)$ 和 $(1,-1)$）。上排的 matrix 在作用：iterate 转向 $(1,1)$、pendulum 沿 $(1,1)$ 倒下、saddle 沿 $(1,1)$ 吸进来再沿 $(1,-1)$ 推出去。下排的 matrix 在量：gradient descent 在 curvature 大的 $(1,1)$ 方向来回跳、12 张 image 沿 $(1,1)$ 散开、corner 的 SSD level set 是以两条对角线为 axis 的 ellipse。

Pendulum 的 upright 和 toggle switch 中间那个 fixed point 几何上完全一样：一个 eigenvalue 正、一个负，都是 saddle。开头“恰好 $\omega_0=-\theta_0$ 才回得来”的那条 line，就是 LSM2234 里的 separatrix：stable eigenvector 的 span 上的点走进 saddle，line 两侧的点各自倒向一边。差别只在这条 line 两侧的去处：pendulum 倒向左或右，toggle switch 落进 U 高或 V 高的那个 stable state，于是它能记住一次 pulse。

## 逐门课：名字、记号、加了什么

| 课 | 这里叫什么 | 记号 | 看哪个 eigenvalue |
|---|---|---|---|
| MA2101 | eigenvalue、eigenspace、diagonalizable、Jordan form | $Tv=\lambda v$，$E_\lambda$，$c_T(x)=\det(xI-A)$ | 全部，以及 eigenvector 够不够 $n$ 个 |
| DSA2102 | dominant eigenvalue、Rayleigh quotient、spectral radius | $Av=\lambda v$，$\frac{x^\top Ax}{x^\top x}$，$\rho(G)$ | 最大的 $|\lambda|$，及 $|\lambda_2/\lambda_1|$ |
| ST3236 | stationary distribution | row vector $\pi$，$\pi P=\pi$ | 1（left eigenvector），$|\lambda_2|$ 定速度 |
| MA3238 | invariant measure、generator | $\mu P=\mu$，$\pi Q=0$，$P(t)=e^{tQ}$ | $Q$ 的 0 |
| MA3270 | PageRank | $\pi=\pi G$ | 1，$(1-\alpha)|\lambda_2(P)|$ 定速度 |
| EE2023 | eigenfunction、pole、mode | $e^{st}\mapsto H(s)e^{st}$，$p_k$，$e^{p_kt}$ | 所有 pole 的 real part |
| EE3331C | closed-loop pole | $1+L(s)=0$ 的 root | 最右边的 root |
| RB2203 | $A$ 的 eigenvalue、closed-loop pole | $\delta\dot x=A\,\delta x$，$A-BK$ | 全部的 real part |
| MIT-6.8210 | linearization 的 eigenvalue、return map 的 slope | $A_{lin}$，$A-BK$，$P'(\omega^*)$ | real part 或 absolute value |
| LSM2234 | fixed point 的 stability、Jacobian | $f'(N^*)$，$J$ | real part |
| CS3244、CS4243 | principal component、eigenface | $Su=\lambda u$，$Ce=\lambda e$ | 最大的几个 |
| CS4243、MIT-6.4210 | second moment matrix、surface normal | $M$，$W$ | 最小的 |
| DSA3102、CS2109S | $L$、$m$、condition number | $L=\lambda_{\max}(X^\top X)$ | 最大和最小 |

记号上有两处要对齐。MA2101 写 $\det(xI-A)$，DSA2102 和 MA3238 写 $\det(A-\lambda I)$，两者差一个 $(-1)^n$，root 相同。Markov chain 的 distribution 是 row vector、乘在 $P$ 的左边，要的是 left eigenvector；MIT 18.06 第 24 讲用 column 加起来为 1 的 matrix、$u_{k+1}=Au_k$，那个 $A$ 是 ST3236 的 $P^\top$。

### MA2101：骨架成立的条件

骨架假设了“有 $n$ 个 independent 的 eigenvector”。[MA2101 第 5 站](../courses/MA2101.html#eig)证明什么时候成立：不同 eigenvalue 的 eigenvector 一定 independent，所以 $n$ 个不同的 eigenvalue 就够；一般地，diagonalizable 当且仅当各个 eigenspace 的 dimension 加起来是 $n$。失败有两种：field 里没有 root（rotation over $\mathbb R$），以及 eigenvector 不够（shear）。后一种在[第 7 站](../courses/MA2101.html#jordan)用 Jordan form 处理，上面 $J^k$ 的那个 $k\,0.9^{k-1}$ 就是 Jordan block 的 power。[第 8 站](../courses/MA2101.html#inner)的 spectral theorem 说明 real symmetric matrix 一定有 orthonormal 的 eigenvector basis，骨架里“做 projection 就能求 $c_i$”和 Rayleigh quotient 都靠它。

### DSA2102：把“方向趋向 $v_1$”做成 algorithm

[DSA2102 第 5 站](../courses/DSA2102.html#eig)把骨架的第一个结论倒过来用：不知道 $v_1$，就随便取一个 vector 反复乘 $A$。$\lambda_1$ 事先不知道，所以每步要 normalize，再用 Rayleigh quotient 读出 eigenvalue。它加了三样东西：想要别的 eigenvalue 就换一个 matrix（$(A-\mu I)^{-1}$ 的 eigenvector 不变，eigenvalue 变成 $1/(\lambda_i-\mu)$，这是 inverse iteration）；QR algorithm 让所有 column 同时做 power iteration；matrix 不 symmetric 或不是 square matrix 时改用 SVD，它是 $A^\top A$ 的 eigen decomposition。[第 3 站](../courses/DSA2102.html#cond)的 Jacobi iteration 是骨架的“stable”那一行：error 每轮乘 $G$，converge 当且仅当 spectral radius $\rho(G)<1$。

### ST3236 与 MA3238：$\lambda=1$ 由 row sum 保证

[ST3236 第 5 站](../courses/ST3236.html#stat)的 $\pi P=\pi$ 是 eigenvalue 1 的 left eigenvector，加上 $\pi_i\ge0$、$\sum\pi_i=1$。和 power iteration 相比，这里 $\lambda_1=1$ 是先知道的：每行加起来为 1，所以 $P\mathbf 1=\mathbf 1$，$\det(P-I)=0$。$\lambda_1=1$ 还意味着不用 normalize，distribution 乘 $P$ 之后总和仍是 1。[第 6 站](../courses/ST3236.html#limit)加了两件事。Converge 的速度是 $|\lambda_2|$：social mobility 的 $P$ 是 0.4414。Period 为 2 的 Ehrenfest chain 有 eigenvalue $-1$，它的 absolute value 是 1、不衰减，所以 $P^n$ 来回跳；lazy chain $\tfrac12(I+P)$ 把每个 $\lambda$ 换成 $\tfrac{1+\lambda}{2}$，$-1$ 变成 0。这和 inverse iteration 是同一个手法：换一个 eigenvector 相同的 matrix，把碍事的 eigenvalue 挪开。

[MA3238 第 2 站](../courses/MA3238.html#inv)处理 infinite state space：transient 的 walk 上 $\mu P=\mu$ 有两个不成比例的 solution（$\mu_j=1$ 和 $\mu_j=1.5^j$），eigenvalue 1 的 eigenspace 不止一维，finite-dimensional 的论证不再够用，要靠 recurrence。[第 4 站](../courses/MA3238.html#ctmc)换到连续时间：generator $Q$ 每行和为 0，$Q\mathbf 1=0$，所以 eigenvalue 是 0 而不是 1；$P(t)=e^{tQ}$，例子的 eigenvalue $0,-2,-4$ 直接给出 $p_{11}(t)=\tfrac38+\tfrac14e^{-2t}+\tfrac38e^{-4t}$。$\pi Q=0$ 与 $\pi P(t)=\pi$ 等价，就是骨架里 $\lambda=0$ 与 $e^{t\lambda}=1$ 的对应。

### MA3270：PageRank

[MA3270 第 2 站](../courses/MA3270.html#walk)把“重要的 page 是被重要的 page link 的 page”写成 $\pi=\pi P$，这正是 stationary distribution 的 equation。它往骨架上加的是一个 rank 为 1 的修正：$G=(1-\alpha)P+\frac\alpha n\mathbf 1\mathbf 1^\top$ 的每个 entry 为正，保证 eigenvalue 1 的 eigenvector 唯一（差一个倍数）且每个 entry 为正。Web 太大，解不了 linear system，只能做 power iteration，速度由 $(1-\alpha)|\lambda_2(P)|$ 决定。[第一座桥](#bridge1)证明 $G$ 的 eigenvalue 恰好是 1 和 $(1-\alpha)\lambda_i(P)$。

### EE2023、EE3331C 与 RB2203：pole 就是 eigenvalue

[EE2023 第 1 站](../courses/EE2023.html#lti)把 $Av=\lambda v$ 推到无穷维：LTI system 是“matrix”，signal $e^{st}$ 是 eigenvector（叫 eigenfunction），$H(s)$ 是 eigenvalue。[第 5 站](../courses/EE2023.html#pz)的 pole $p_k$ 给出 system 自己的 mode $e^{p_kt}$，所有 pole 在 left half-plane 就 stable，这是骨架里连续时间那张表。[EE3331C 第 3 站](../courses/EE3331C.html#routh)要的是 closed-loop characteristic polynomial 的 root 在哪一侧，而且不想解出 root，于是有 Routh array（和 trace、determinant 的关系见[第三座桥](#bridge3)）。[RB2203 第 4 站](../courses/RB2203.html#ss)把 joint 写成 state space，三个 equilibrium 的 $A$ 的 eigenvalue 是 $0,-2$；$-1\pm6.18j$；$5.34,-7.34$，正好是水平、下垂、竖直向上三种行为。它加的是 feedback：$u=-Kx$ 让 matrix 变成 $A-BK$，选 $K$ 就是选 eigenvalue，controllability matrix 满 rank 时可以任意放。

### MIT-6.8210：linearize 之后才有 eigenvalue

[MIT-6.8210 第 1 站](../courses/MIT-6.8210.html#pend)在一维里判断 fixed point：slope $-\frac{mgl}{b}\cos x^*$ 是 $1\times1$ 的 Jacobian。[第 3 站](../courses/MIT-6.8210.html#lqr)对 cart-pole 写出 $A_{lin}$，eigenvalue $\pm6.766$ 里正的那个说明不加控制时 $\bar\theta$ 每 0.15 s 放大 $e$ 倍；LQR 给出的 $A-BK$ 的 eigenvalue 全在 left half-plane。它加的提醒是 eigenvalue 只管 linearization：closed loop 的 eigenvalue 都在左边，从 70° 放手照样倒。[第 6 站](../courses/MIT-6.8210.html#walk)把骨架用在一个 map 上：rimless wheel 每次着地后的速度满足 $\omega_{n+1}=P(\omega_n)$，fixed point 处 slope $P'(\omega^*)=\cos^22\alpha=0.5$ 是离散的 eigenvalue，偏差每步减半。

### LSM2234：Jacobian 的 eigenvalue

[LSM2234 第 1 站](../courses/LSM2234.html#growth)的 $f'(N^*)$ 是一维的 eigenvalue：logistic 在 $K$ 处是 $-r$，扰动以 rate $r$ 消失；同一站的 Euler 分析得到 step 每步把 error 乘 $1-h$，这是骨架里的 $1+h\lambda$。[第 4 站](../courses/LSM2234.html#switch)在二维里用 Jacobian：$\alpha=3$ 时对角线上的 fixed point 的 eigenvalue 是 $0.191$ 和 $-2.191$，saddle；stable 的那个 eigenvector 是 $(1,1)$，它的 span（对角线）就是 separatrix。

### CS3244、CS4243、MIT-6.4210：matrix 拿来量

[CS3244 第 8 站](../courses/CS3244.html#pca)用 Lagrange multiplier 从“让 $u^\top Su$ 最大”推出 $Su=\lambda u$，这是骨架里 Rayleigh quotient 的结论，并用 Pythagorean theorem 说明同一个方向让 reconstruction error 最小。[CS4243 第 8 站](../courses/CS4243.html#recog)加了两样：4096 维的 covariance 算不动时，改求 $S^\top S$（100×100）的 eigenvector $v$，$Sv$ 就是 $SS^\top$ 的 eigenvector；variance 最大的方向可能只是光照，对识别毫无用处。也有要最小的：[CS4243 第 2 站](../courses/CS4243.html#feature)的 Harris detector 看 $M$ 的 $\lambda_{\min}$，[MIT-6.4210 第 4 站](../courses/MIT-6.4210.html#grasp)取邻域 covariance $W$ 最小的 eigenvalue 的 eigenvector 作 surface normal。

### DSA3102 与 CS2109S：gradient descent

[DSA3102 第 3 站](../courses/DSA3102.html#gd)对 least squares 精确写出 $e_{k+1}=(I-tX^\top X)e_k$，error 沿 $(1,1)$ 每步乘 $1-11t$、沿 $(1,-1)$ 乘 $1-t$，所以 $t<2/L$，最好的 $t=\frac2{L+m}$ 给出 factor $\frac{\kappa-1}{\kappa+1}$。[CS2109S](../courses/CS2109S.html#linreg) 的 learning rate 分析是同一个式子。这里 matrix 两种角色同时出现：$X^\top X$ 量 curvature，$I-tX^\top X$ 作用在 error 上。

## 课程页之间的桥

### <span id="bridge1"></span>桥一：Norm 给的 bound 与 spectral radius

三门课各自证过一次 converge，用的都是“每一步某个 norm 至少缩小多少”，得到的数都比真实的速度大：

| | [DSA2102](../courses/DSA2102.html#cond) Jacobi | [ST3236](../courses/ST3236.html#limit) social mobility | [MA3270](../courses/MA3270.html#walk) PageRank |
|---|---|---|---|
| Error 怎样变 | $e_{k+1}=Ge_k$ | $P^n$ 的 column 的 spread | $e_{k+1}=e_kG$，$e_k\mathbf 1=0$ |
| 页面上的 bound | $\|G\|_\infty=\frac13$ | $1-2\alpha=0.8$ | $1-\alpha=0.85$ |
| 真实的 rate | $\rho(G)=0.2887$ | $|\lambda_2(P)|=0.4414$ | $|\lambda_2(G)|=0.601$ |

**Bound 为什么一定不小于真实的 rate。** 对任何由 vector norm 导出的 matrix norm，设 $Mv=\lambda v$，$v\ne0$：

$$|\lambda|\,\|v\|=\|\lambda v\|=\|Mv\|\le\|M\|\,\|v\|$$

所以 $|\lambda|\le\|M\|$，$\rho(M)\le\|M\|$。

**一次看 $k$ 步，bound 就趋向真实的 rate。** 对 $M^k$ 用同一个不等式：$\rho(M)^k=\rho(M^k)\le\|M^k\|$，即 $\|M^k\|^{1/k}\ge\rho(M)$。另一边，$M=V\Lambda V^{-1}$ 时 $\|M^k\|=\|V\Lambda^kV^{-1}\|\le\|V\|\,\|V^{-1}\|\,\rho(M)^k$（diagonal matrix $\Lambda^k$ 的 norm 是最大的 $|\lambda_i|^k$，这里用 2-norm），开 $k$ 次方：

$$\rho(M)\le\|M^k\|^{1/k}\le\big(\|V\|\,\|V^{-1}\|\big)^{1/k}\rho(M)\ \longrightarrow\ \rho(M)$$

所以 $\rho(M)=\lim_k\|M^k\|^{1/k}$。一步的 bound 保守，是因为 $\|V\|\,\|V^{-1}\|$ 这个常数被算在了每一步里。

换成别的 norm，两个 norm 之间只差一个固定的常数倍，开 $k$ 次方后这个常数同样趋向 1，所以极限对任何 norm 都是 $\rho(M)$。

**三门课的 bound 是同一个量。** Markov chain 的 error $e$ 是两个 distribution 之差，满足 $\sum_ie_i=0$，即 $e\mathbf 1=0$。在这些 error 上起作用的不是 eigenvalue 1：设 $wP=\lambda w$，两边右乘 $\mathbf 1$，$P\mathbf 1=\mathbf 1$ 给出 $w\mathbf 1=\lambda w\mathbf 1$，$\lambda\ne1$ 时 $w\mathbf 1=0$。把 $e$ 按 left eigenvector 拆开，$e=d_1\pi+\sum_{i\ge2}d_iw_i$，右乘 $\mathbf 1$ 得 $0=d_1\cdot1+0$，所以 $e$ 沿 $\pi$ 的 component 是 0，真实的 rate 是 $|\lambda_2|$。

一步的 bound 从哪来：把 $e$ 拆成正、负两部分 $e=e^+-e^-$，因为 $\sum_ie_i=0$，两部分各自的和相等，都是 $s=\tfrac12\|e\|_1$。$M$ 是 $P$ 或 $G$，记 $M_i$ 为它的第 $i$ 行，

$$\sum_{i,k}e^+_ie^-_k\,(M_i-M_k)=\Big(\sum_ke^-_k\Big)e^+M-\Big(\sum_ie^+_i\Big)e^-M=s\,eM$$

两边取 1-norm，右边每一项用 $\|M_i-M_k\|_1\le\max_{i,k}\|M_i-M_k\|_1$ 放大，而 $\sum_{i,k}e^+_ie^-_k=s^2$：

$$\|eM\|_1\le\frac{s^2}{s}\max_{i,k}\|M_i-M_k\|_1=q(M)\,\|e\|_1,\qquad q(M)=\tfrac12\max_{i,k}\|M_i-M_k\|_1$$

$q(M)$ 是“两行之间最大的 1-norm 距离的一半”，叫 Dobrushin coefficient。拿它对三处核对：

- Social mobility 的三行两两比较，$\tfrac12\|M_1-M_3\|_1=\tfrac12(0.5+0.2+0.3)=0.5$ 最大，$q(P)=0.5$。ST3236 的 $1-2\alpha$ 是它的一个 upper bound：两个 probability vector $a,b$ 有 $\tfrac12\sum_j|a_j-b_j|=1-\sum_j\min(a_j,b_j)$（因为 $|a_j-b_j|=a_j+b_j-2\min(a_j,b_j)$），每个 entry 至少是 $\alpha$ 时 $\sum_j\min\ge3\alpha$，所以 $q(P)\le1-3\alpha\le1-2\alpha$。ST3236 量的是 column 的 spread，它也按 $q(P)$ 缩小：$(Pf)_i-(Pf)_k=\sum_j(p_{ij}-p_{kj})f_j=\sum_j(p_{ij}-p_{kj})(f_j-c)$ 对任何常数 $c$ 成立（因为 $\sum_j(p_{ij}-p_{kj})=0$），取 $c$ 为 column $f$ 的最大与最小 entry 的中点，每个 $|f_j-c|$ 不超过 spread 的一半，于是新的 spread 不超过 $q(P)$ 乘旧的 spread。ST3236 表里 spread 的比值 0.46、0.448 都没有超过 0.5。
- PageRank：$G_i-G_k=(1-\alpha)(P_i-P_k)$，teleport 那一项每行一样，相减就没了。5 个 node 的 $P$ 里 node 3 只连 node 1、node 5 只连 node 4，两行不重叠，$\|P_3-P_5\|_1=2$，$q(P)=1$，所以 $q(G)=0.85$，正是 MA3270 的 bound。
- Jacobi 不是 Markov chain，用的是 $\infty$-norm，但道理一样：$\|G^2\|_\infty=\|\tfrac1{12}I\|_\infty=\tfrac1{12}$，两步一看，$\tfrac1{\sqrt{12}}=0.2887$ 就是 $\rho(G)$。

一次看 $k$ 步，用代码算 $\|M^k\|^{1/k}$（Markov chain 的两行用 $q$）：

| $k$ | 1 | 2 | 5 | 10 | 20 | 真实的 rate |
|---|---|---|---|---|---|---|
| Jacobi $\|G^k\|_\infty^{1/k}$ | 0.3333 | 0.2887 | 0.2971 | 0.2887 | 0.2887 | 0.2887 |
| Social mobility $q(P^k)^{1/k}$ | 0.5 | 0.4796 | 0.4583 | 0.4498 | 0.4456 | 0.4414 |
| PageRank $q(G^k)^{1/k}$ | 0.85 | 0.85 | 0.6442 | 0.6442 | 0.6222 | 0.601 |

::fig[thread-eigen-bound] 三处的 error 都从 1 开始画（log scale）。虚线是一步的 bound 乘 $k$ 次，细实线是 $\rho^k$，点是实际的 error：点贴着细实线走，和虚线越拉越远。PageRank 的点走成台阶，因为 $\lambda_2$ 是 complex 的。

**PageRank 的 eigenvalue 恰好是 $(1-\alpha)\lambda_i(P)$。** 设 $wP=\lambda w$、$\lambda\ne1$，上面已经得到 $w\mathbf 1=0$。于是

$$wG=(1-\alpha)wP+\frac\alpha n(w\mathbf 1)\mathbf 1^\top=(1-\alpha)\lambda w$$

Teleport 不动 eigenvector，只把 1 以外的 eigenvalue 都乘上 $1-\alpha$。5 个 node 的例子：$P$ 的 eigenvalue 是 $1,0,0,-\tfrac12\pm\tfrac12j$，$G$ 的是 $1,0,0,-0.425\pm0.425j$（numpy 核对过），后者的 absolute value 是 0.601、angle 是 $135^\circ$。Error 每步转 $135^\circ$，转 4 步是 $540^\circ$，相当于乘 $-1$，所以 error 的 1-norm 每步缩小的倍数 4 步一循环：0.439、0.85、0.824、0.425，乘起来是 $0.1305=0.601^4$。其中一步恰好是 0.85，所以 MA3270 的 bound 作为一步的 bound 不能再改进，只是平均下来每步是 0.601。

### <span id="bridge2"></span>桥二：Euler 的一步把 $\lambda$ 变成 $1+h\lambda$

骨架里已经有：连续时间的 eigenvalue $\lambda$，按 exact solution 每隔 $h$ 取值后变成 $e^{h\lambda}$，Euler 离散后变成 $1+h\lambda$，eigenvector 都不变。$|e^{h\lambda}|<1$ 和 $\operatorname{Re}\lambda<0$ 永远一致，$|1+h\lambda|<1$ 却要求 $h\lambda$ 落在以 $-1$ 为中心、半径为 1 的 disk 里。$\lambda=-r$ 是负的 real number 时，$|1-hr|<1$ 即

$$h<\frac2r$$

LSM2234 和 DSA3102 各自撞上过这一条，没有说它们是同一条；MA3238 和 RB2203 的 ODE 换成 Euler 来算，也会撞上它：

| 课 | 被离散的 ODE | $\lambda$ | 页面上的 step | 界限 |
|---|---|---|---|---|
| [LSM2234](../courses/LSM2234.html#growth) | logistic，在 $K$ 附近 | $-r=-0.0347$ /min | $\Delta t$ | $\Delta t<57.7$ min |
| [DSA3102](../courses/DSA3102.html#gd) | gradient flow $\dot\beta=-X^\top X(\beta-\beta^\star)$ | $-11,\ -1$ | step size $t$ | $t<0.1818$ |
| [MA3238](../courses/MA3238.html#ctmc) | $P'(t)=P(t)Q$ | $0,-2,-4$ | $h$，$P(h)\approx I+hQ$ | $h<0.5$ |
| [RB2203](../courses/RB2203.html#ss) | 下垂的 joint | $-1\pm6.18j$ | simulation 的 step | $h<0.051$ s |

**Gradient descent 就是 Euler。** $\dot\beta=-\nabla f(\beta)$ 叫 gradient flow，它的 Euler 离散 $\beta_{k+1}=\beta_k-t\nabla f(\beta_k)$ 正是 gradient descent，step size $t$ 就是 $\Delta t$。Least squares 的 gradient flow，eigenvalue 是 $-11$ 和 $-1$，对任何初值都 converge，从不 diverge；DSA3102 表里 $t=0.19$ 时的 diverge 完全来自离散：$1-11\times0.19=-1.09$。LSM2234 的 logistic 也是这样，$h=r\Delta t>2$ 时 $K$ 对 Euler 不再 stable（$h=2.5$ 时在四个值之间循环），ODE 自己单调地走到 $K$。对应关系是：LSM2234 的 $r$ 对应 DSA3102 的 $L$，$\Delta t$ 对应 $t$，“error 每步乘 $1-h$” 对应“沿 $(1,1)$ 每步乘 $1-11t$”。

**同一个 generator，Euler 有两条界限。** MA3238 的 $P(h)=I+hQ+o(h)$ 丢掉 $o(h)$，就是对 forward equation 做 Euler：$x_{k+1}=x_k(I+hQ)$。$I+hQ$ 的 eigenvector 和 $Q$ 相同，eigenvalue 是 $1,\ 1-2h,\ 1-4h$；准确的 $P(h)=e^{hQ}$ 的是 $1,\ e^{-2h},\ e^{-4h}$，永远在 0 和 1 之间。从 state 1 出发算：

- $h=0.25$：$I+\tfrac14Q$ 的 eigenvalue 是 $1,0.5,0$，是一个正常的 transition matrix，$x_{20}=(0.375,0.5,0.125)=\pi$。
- $h=0.45$：$1-4h=-0.8$，仍然 converge，可 $I+hQ$ 的 diagonal entry $1-3h=-0.35<0$，第 2 步 $x_2=(0.6175,0.495,-0.1125)$，probability 出现了负数。$h\le\tfrac13$ 才保证 $I+hQ$ 每个 entry 非负。
- $h=0.6$：$1-4h=-1.4$，$x_{10}=(11.2,\ 0.5,\ -10.7)$，越跳越大。

**Complex 的 $\lambda$ 更早出界。** RB2203 下垂的 joint，$\lambda=-1\pm6.18j$，$|\lambda|^2=1+38.24=39.24$：

$$|1+h\lambda|^2=(1-h)^2+(6.18h)^2=1-2h+39.24h^2<1\iff h<\frac{2}{39.24}=0.051\text{ s}$$

真实的 joint 每 0.06 s 振幅缩到 $|e^{0.06\lambda}|=e^{-0.06}=0.942$；Euler 用 $h=0.06$ s 模拟，每步乘 1.011，模拟出来的摆动越来越大。$\lambda$ 越靠近 imaginary axis，允许的 $h$ 越小；没有 damping 时 $\lambda=\pm j\omega$，$|1+jh\omega|=\sqrt{1+h^2\omega^2}>1$，任何 $h$ 都会让 forward Euler 往 undamped oscillator 里加 energy。

::fig[thread-eigen-zplane] 横竖轴是离散时间的 eigenvalue 所在的 complex plane，圆是 unit circle。左边是 MA3238 的 $Q$，右边是 RB2203 下垂的 joint（放大了 $z=1$ 附近）。$h$ 从 0 开始增大：空心点是准确的 $e^{h\lambda}$，始终在圆内；实心点是 Euler 的 $1+h\lambda$，沿直线往外走，左边在 $h=0.5$、右边在 $h=0.051$ s 时出界。

### <span id="bridge3"></span>桥三：Trace–determinant 判据就是二阶的 Routh–Hurwitz

LSM2234 用 Gore 课上的判据判断 $2\times2$ Jacobian：trace $<0$ 且 determinant $>0$ 时 stable（MIT 18.06 第 23 讲给的是同一个 test）。EE3331C 用 Routh array 判断 characteristic polynomial。两者是同一件事。$J=\begin{pmatrix}p&q\\r&s\end{pmatrix}$ 的 characteristic polynomial 是

$$\det(\lambda I-J)=(\lambda-p)(\lambda-s)-qr=\lambda^2-(p+s)\lambda+(ps-qr)=\lambda^2-(\operatorname{tr}J)\,\lambda+\det J$$

EE3331C 第 3 站说过，second order 时“coefficient 全为正”既必要又充分。这里两个 coefficient 是 $-\operatorname{tr}J$ 和 $\det J$，“全为正”就是 trace 为负、determinant 为正。Routh array 只有三行：

$${\def\arraystretch{1.5}\begin{array}{c|cc}\lambda^2&1&\det J\\\lambda^1&-\operatorname{tr}J&0\\\lambda^0&\det J&\end{array}}$$

First column 是 $1,\ -\operatorname{tr}J,\ \det J$。拿 toggle switch（$\alpha=3$，$n=2$）核对：

- 对角线上的 fixed point：$J=\begin{pmatrix}-1&-1.191\\-1.191&-1\end{pmatrix}$，$\operatorname{tr}J=-2$，$\det J=1-1.191^2=-0.419$。First column $1,\ 2,\ -0.419$，一次 sign change，一个 root 在 right half-plane，正是 eigenvalue 0.191。
- 两个不对称的 fixed point：$\det J=1-\tfrac4{\alpha^2}=\tfrac59$，first column $1,\ 2,\ \tfrac59$，没有 sign change，stable，eigenvalue $-\tfrac13,-\tfrac53$。

Routh 的读法比“stable 与否”多一点：sign change 的次数是 right half-plane 里 root 的个数，所以 $\det J<0$ 一定是一正一负，也就是 saddle。$\alpha$ 从 1.5 增大到 3 时，对角线上那个点的 $\det J=1-a^2$ 从 0.275 降到 $-0.419$，在 $\alpha=2$（$a=1$）穿过 0，first column 的最后一项变号；同一时刻两个不对称的 fixed point 从它身上分出来，$\det J=1-4/\alpha^2$ 从 0 开始变正。

::fig[thread-eigen-toggle] Toggle switch 的 phase plane，$\alpha$ 从 1.5 增大到 3。两条曲线是 nullcline，交点是 fixed point（实心 stable，空心 saddle）。看 $\alpha$ 过 2 时：中间的点变成空心，Routh 的 first column 最后一项变成负的，同时两侧各长出一个 stable 的点。

### <span id="bridge4"></span>桥四：Harris 的 $M$ 是 gradient 的 PCA（不 center），PCA 可以用 power iteration 算

CS4243 第 2 站的 $M=\sum_W\nabla I\,\nabla I^\top$ 和第 8 站的 $nC=\sum_ix_ix_i^\top$ 是同一个式子：把 window 里每个 pixel 的 gradient $\nabla I=(I_x,I_y)$ 当作一个 data point $x_i$，$M$ 就是这团点的 second moment matrix，它的 eigenvector 是这团 gradient 的 principal direction，eigenvalue 是沿该方向的“energy” $\sum_i(e^\top x_i)^2$。Flat、edge、corner 于是可以按 PCA 来读：

- Corner（toy image 的 (5, 5)）：9 个 pixel 的 gradient 是 3 个 $(5,0)$、3 个 $(0,5)$、1 个 $(5,5)$、2 个 $(0,0)$。$M=3\begin{pmatrix}25&0\\0&0\end{pmatrix}+3\begin{pmatrix}0&0\\0&25\end{pmatrix}+\begin{pmatrix}25&25\\25&25\end{pmatrix}=\begin{pmatrix}100&25\\25&100\end{pmatrix}$。这团点在 $(1,1)$ 和 $(1,-1)$ 两个方向上都散开，energy 125 和 75。
- Edge（(8, 5)）：6 个 $(5,0)$、3 个 $(0,0)$，所有 gradient 平行，只有一个 principal direction：$M=\begin{pmatrix}150&0\\0&0\end{pmatrix}$。
- Flat：9 个 $(0,0)$，没有 direction。

“$\lambda_{\min}$ 大”的意思是：gradient 这团点不是一条线，是一片。

::fig[thread-eigen-harris] 左边是 window 里的 9 个 pixel 和各自的 gradient，右边把这 9 个 gradient 画成 $(I_x,I_y)$ plane 里的点（旁边的数是重合的个数）。Corner 的点散成一片，两个 principal direction 都有 energy；edge 的点全在 $I_x$ 轴上。

:::wrong Harris 既然是 PCA，就该先减去平均的 gradient
CS3244 的 PCA 必须先 center，否则第一个方向会被 mean 占据。Harris 不能 center。取 ramp $I(x,y)=5x$，window 里 9 个 gradient 全是 $(5,0)$。Center 之后全是 0，covariance 是 zero matrix，会被判成 flat；可 window 横挪一格，9 个 pixel 每个都差 5，$E(1,0)=9\times25=225$；不 center 的 $M=\begin{pmatrix}225&0\\0&0\end{pmatrix}$ 给出的正是 225。Harris 要估计的是 $E(u,v)\approx(u,v)M(u,v)^\top$，这是 gradient 关于 0 的 second moment，不是关于 mean 的 variance。
:::

反过来，PCA 也能像 power iteration 那样算，而且不必形成 covariance。$Cu=\frac1n\sum_ix_i\,(x_i^\top u)$：一步就是“把所有点投到 $u$ 上，再以 projection 为 weight 把点加起来”，每步把 data 过一遍。CS4243 的 4096 维 image，$C$ 有 1678 万个 entry，这样做不必存 $C$。在 2-pixel 的 12 张 image 上从 $u_0=(1,0)$ 出发：

| $k$ | $u_k$ | 与 $(1,1)$ 的 angle | Rayleigh quotient $u_k^\top Cu_k$ |
|---|---|---|---|
| 0 | $(1,\ 0)$ | 45° | 476.25 |
| 1 | $(0.7947,\ 0.6070)$ | 7.63° | 827.18 |
| 2 | $(0.7197,\ 0.6943)$ | 1.03° | 839.77 |
| 3 | $(0.7088,\ 0.7054)$ | 0.138° | 839.996 |

Angle 的 tangent 每步乘 $\frac{112.5}{840}=0.134$，正是 $\lambda_2/\lambda_1$；Rayleigh quotient 趋向 840。

::fig[thread-eigen-pca] 12 张 2-pixel image（减去 mean 之后），每一帧是一步 power iteration：细线是当前的 $u_k$，灰线连着每个点和它在 $u_k$ 上的 projection，彩色箭头是以 projection 为 weight 的平均 $Cu_k$（缩小画出），下一帧的 $u$ 就沿着它。两三步之后 $u$ 已经贴在 $(1,1)$ 上。

:::from
骨架的讲法跟着 MIT 18.06 的三讲（读的是逐字稿的逐段转述）：[第 22 讲](https://dspace.mit.edu/bitstream/handle/1721.1/59010/18-06-spring-2005/contents/video-lectures/1806_2005L22.pdf)的 $A^k=S\Lambda^kS^{-1}$、“把 $u_0$ 按 eigenvector 拆开，每个 eigenvector 各走各的”、$|\lambda|<1$ 时 $A^k\to0$、eigenvector 不够的反例；[第 23 讲](https://www.ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/6d67704459268b5517f5f800a2aae300_IZqwi0wJovM.pdf)的 $e^{\lambda t}x$、real part 决定 stability、$2\times2$ 的 trace 与 determinant test、$e^{At}$ 与 $A^k$ 的 left half-plane 与 unit circle 的对比；[第 24 讲](https://dspace.mit.edu/bitstream/handle/1721.1/59010/18-06-spring-2005/contents/video-lectures/1806_2005L24.pdf)的 Markov matrix 用 column sum、eigenvalue 1 的来历和“其他教材用 row”的说明。Euler 的 $|1+\lambda\Delta t|\le1$ 与 $\Delta t_{cr}=2/|\lambda|$ 对照了 [MIT 2.086 的 IVP 讲义](https://ocw.mit.edu/courses/2-086-numerical-computation-for-mechanical-engineers-fall-2014/068775dca10e75dabec9e5eedd4b5dcf_MIT2_086F14_IVP_V1.3.pdf)第 4 节；那份讲义只讲 real 的 $\lambda$，complex $\lambda$ 的 disk 和 undamped oscillator 的结论是我自己推的。Dobrushin coefficient 的 formula $q(B)=\tfrac12\max_{i,k}\sum_j|b_{ij}-b_{kj}|=1-\min_{i,k}\sum_j\min(b_{ij},b_{kj})$、$|\lambda_2|=\lim q(A^k)^{1/k}$ 以及 Google matrix 的 $|\lambda_2|\le c$，对照了 [Nussbaum 的 Notes on the Second Eigenvalue of the Google Matrix](https://arxiv.org/pdf/math/0307056)；那篇只给出 $|\lambda_2|$ 的 bound 和等号条件，“$G$ 的 eigenvalue 恰好是 $(1-\alpha)\lambda_i(P)$”的 proof、用 $e^+,e^-$ 推出 $q$ 的那几行、$\rho=\lim\|M^k\|^{1/k}$ 在 diagonalizable 情形的 proof，是我按标准论证写的，没有对着别的讲义核过。Haveliwala 与 Kamvar 的原文没有读到。Gradient descent 是 gradient flow 的 Euler 离散、Harris 的 $M$ 是 gradient 的 second moment、ramp 的反例、PCA 的“project 再加权平均”写法，凭自己的知识写。Matrix 的两种角色（作用与量）、八处 $\begin{pmatrix}a&b\\b&a\end{pmatrix}$ 的对照、pendulum 与 toggle switch 的 saddle 对照，是这一页自己的组织。各门课的例子和数字取自对应的课程页；开头 pendulum 的初值、$J^k$、三处的 $\|M^k\|^{1/k}$、PageRank 的 eigenvalue 与 1-norm 的循环、$I+hQ$ 的三种 $h$、RB2203 的 0.051 s、PCA 的 power iteration，都是为这一页用 numpy 算的。
:::
