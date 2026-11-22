---
title: 梯度下降
lead: "从 DSA2102 的 Jacobi iteration 到 CS336 训练 LLM 的 AdamW，都是 $x^+=x-P^{-1}\\nabla f(x)$ 这一步；各门课换的是 $P$、step size、momentum、noise 和 constraint。"
line: num
---

先在同一个问题上跑五门课里的五个 algorithm。问题取 [DSA3102](../courses/DSA3102.html#gd) 反复用的那组 data：

$$X=\begin{pmatrix}2&1\\1&2\\1&1\end{pmatrix},\qquad y=\begin{pmatrix}6\\5\\0\end{pmatrix},\qquad f(\beta)=\tfrac12\|X\beta-y\|^2$$

Minimizer 是 $\beta^\star=(2,1)$，$f^\star=5.5$。五个 algorithm 都从 $\beta_0=(0,0)$ 出发，那里 $f-f^\star=25$：

| 课 | algorithm | $\beta_1$ | $f(\beta_{10})-f^\star$ |
|---|---|---|---|
| DSA2102 | 对 normal equations $X^\top X\beta=X^\top y$ 做 Jacobi iteration | $(2.8333,\ 2.6667)$ | 0.652 |
| DSA3102 | gradient descent，$t=1/6$ | $(2.8333,\ 2.6667)$ | 0.652 |
| DSA3102 | coordinate descent | $(2.8333,\ 0.3056)$ | $9.0\times10^{-4}$ |
| CS4277 | Gauss–Newton | $(2,\ 1)$ | 0 |
| STANFORD-CS336 | AdamW（$\alpha=0.1$，$\lambda=0$，$\beta_1=0.9$，$\beta_2=0.95$） | $(0.1,\ 0.1)$ | 3.29 |

三件事要解释：

- 前两行不只是第一步相同。跑 60 步，每一步的 iterate 都相同，最大的差是 $9\times10^{-16}$，只是 rounding error。一个是解 linear system 的 iteration，一个是 optimization algorithm，两门课各自推导，都没有说它们是同一个 iteration。
- Gauss–Newton 一步就到了 $\beta^\star$。
- AdamW 的第一步，gradient 是 $(-17,-16)$，它却让两个 coordinate 各走了正好 0.1，之后几步仍是各走 0.1 左右；10 步后它最差。

::fig[thread-gradient-descent-five] 五个 algorithm 在同一张 contour 上同步走 12 步（Gauss–Newton 第 1 步之后不再动）。看三处：左上的 zigzag 同时是两个 algorithm 的路径；右上 coordinate descent 每次只沿一个 axis 走；右下 AdamW 沿 diagonal 每步挪 0.1，和 gradient 指向哪里关系不大。

这组 data 有 closed form，用它只是为了每个数都能核对。实际问题里 closed form 要么没有（logistic regression 和 neural network 的 loss，“gradient 等于 0”是解不出来的 nonlinear equation），要么算不起（$p$ 个 parameter 时解 normal equations 要 $p^3/3$ 次 operation，算一次 gradient 只要 $np$ 次）。手里只有 gradient 时，只能从当前点出发按它走一步，再重复。下面先推出这一步的共同形式，三件事都会在推导里得到解释；然后逐门课对齐名字和记号；最后是课程页之间没有接上的五座桥。

## 骨架：每一步都在最小化一个 quadratic model

### 一步就是 $x-P^{-1}g$

站在当前的 $x$，记 $g=\nabla f(x)$。Gradient 只告诉我们 $f$ 在 $x$ 附近的 tangent，要决定走多远，必须对 curvature 做一个假设。最简单的假设是一个 quadratic model：

$$m(d)=f(x)+g^\top d+\tfrac12\,d^\top Pd$$

$P$ 是 symmetric positive definite（SPD）matrix。对 $d$ 求 gradient 令其为 0：$g+Pd=0$，所以 $d=-P^{-1}g$，

$$x^+=x-P^{-1}\nabla f(x)$$

$P$ 是 SPD，保证这个 $d$ 是 model 的 minimum 而不是 saddle point。前两项是 gradient 本身提供的信息，所有 method 都一样；第三项是各自对 curvature 的假设，所有的差别都在 $P$ 里：

| $P$ | algorithm | 出现在 |
|---|---|---|
| $\tfrac1tI$ | gradient descent | MA3270、CS2109S、DSA3102、CS3264 |
| $D$（$f=\tfrac12x^\top Ax-b^\top x$ 时 $A$ 的 diagonal） | Jacobi iteration | DSA2102 |
| $\nabla^2f(x)$ | Newton's method | CS4277（作为比较） |
| $J^\top J$（$f=\tfrac12\|r(x)\|^2$，$J=\partial r/\partial x$） | Gauss–Newton；iLQR | CS4277；MIT-6.8210 |
| $J^\top J+\lambda\,\mathrm{diag}(J^\top J)$ | Levenberg–Marquardt | CS4277 |
| $F$（Fisher information matrix） | natural gradient | BERKELEY-CS285 |
| $\mathrm{diag}\big(\sqrt{\hat v}+\varepsilon\big)/\alpha$ | Adam | CMU-10714、STANFORD-CS336 |

拿开头的三件事检验。这里 $\nabla f(\beta)=X^\top X\beta-X^\top y$，$X^\top X=\begin{pmatrix}6&5\\5&6\end{pmatrix}$。

**Jacobi 与 $t=1/6$。** DSA2102 把 iterative method 写成 $x^{(k+1)}=x^{(k)}+M^{-1}\big(b-Ax^{(k)}\big)$，Jacobi 取 $M=D$。对 normal equations，$A=X^\top X$、$b=X^\top y$，而 $b-A\beta=-\nabla f(\beta)$，所以 Jacobi 就是 $\beta^+=\beta-D^{-1}\nabla f(\beta)$。$D=\mathrm{diag}(6,6)=6I$，正是 $t=1/6$ 的 gradient descent 的 $P$。$P$ 相同，iteration 就相同。

**Gauss–Newton 一步到。** Residual $r=X\beta-y$ 是 linear 的，$J=X$，$P=X^\top X$，这正是 $f$ 的 Hessian；$f$ 本身是 quadratic，model 就是 $f$ 本身，一步就到 minimum。

**AdamW 的 0.1。** 第一步 $m=(1-\beta_1)g$、$v=(1-\beta_2)g^2$，bias correction 分别除以 $1-\beta_1$ 和 $1-\beta_2$，得 $\hat m=g$、$\hat v=g^2$（[CMU-10714 第 2 站](../courses/CMU-10714.html#nnlib)算过这一步）。于是每个 coordinate 走 $-\alpha\,g_i/|g_i|=-\alpha\,\mathrm{sign}(g_i)$，即 $(0.1,0.1)$。换成 $P$ 的说法，$P=\mathrm{diag}(|g|)/\alpha$：curvature 的假设取自 gradient 自己的大小，所以 step 的长度与 gradient 有多大无关。

[DSA2102](../courses/DSA2102.html#cond) 的 Gauss–Seidel 取 $M$ 为 $A$ 的 diagonal 连同 lower triangular 部分。这个 $M$ 不 symmetric，不能读成最小化某个 model，但 iteration 仍是 $x-M^{-1}\nabla f$ 的形式；[DSA3102 第 5 站](../courses/DSA3102.html#scd)说明它就是表里第三行的 coordinate descent。

::fig[thread-gradient-descent-model] $f(x)=\ln\cosh x$，$f''=1/\cosh^2x\le1$，所以 $L=1$。每一帧画出在当前 $x_k$ 处的 model（彩色 parabola），它的最低点就是 $x_{k+1}$。左边 $t=1$：parabola 处处在 $f$ 上方，最低点处的 $f$ 一定更低。右边 $t=2.5$（超过 $2/L=2$）：parabola 太平，最低点落到 minimum 另一侧，几步之后就在 $\pm0.888$ 之间来回跳，$f$ 不再下降。

### 在 quadratic 上：error 每步乘 $I-P^{-1}H$

任何 Hessian 为 SPD matrix $H$ 的 quadratic 都可以写成 $f(x)=f^\star+\tfrac12(x-x^\star)^\top H(x-x^\star)$，于是 $\nabla f(x)=H(x-x^\star)$。代进 $x^+=x-P^{-1}\nabla f(x)$，两边减去 $x^\star$，error $e=x-x^\star$ 满足

$$e^+=e-P^{-1}He=\big(I-P^{-1}H\big)\,e$$

每一步 error 被乘上同一个 matrix，$k$ 步后是 $(I-P^{-1}H)^ke_0$。这和 DSA2102 分析 Jacobi 的 $G=I-M^{-1}A$ 是同一个式子：converge 当且仅当 spectral radius 小于 1，spectral radius 就是长期每步缩小的倍数。

**$P=\tfrac1tI$。** $I-tH$ 和 $H$ 有同样的 eigenvector，eigenvalue 是 $1-t\lambda_i$。记 $H$ 最大、最小的 eigenvalue 为 $L$、$m$：

- 要 converge，每个 $|1-t\lambda_i|<1$，最难满足的是 $\lambda=L$，所以 $0<t<2/L$。
- $1-t\lambda$ 对 $\lambda$ 是 linear 的，absolute value 的最大值只会在两端取到，速度是 $\max\big(|1-tL|,\ |1-tm|\big)$。
- $t$ 增大，$|1-tm|$ 变小、$|1-tL|$ 先变小后变大。两者相等时 max 最小：$1-tm=tL-1$，$t=\dfrac2{L+m}$，factor 是 $\dfrac{L-m}{L+m}=\dfrac{\kappa-1}{\kappa+1}$，$\kappa=L/m$ 是 condition number。
- 要 error 缩小到 $\varepsilon$ 倍，步数是 $\ln(1/\varepsilon)\big/\ln\frac{\kappa+1}{\kappa-1}$。$\ln\frac{\kappa+1}{\kappa-1}=\ln\big(1+\frac2{\kappa-1}\big)\approx\frac2\kappa$（$\kappa$ 大时），所以约 $\tfrac\kappa2\ln(1/\varepsilon)$ 步，与 $\kappa$ 成正比。

开头的 $X^\top X$ 的 eigenvalue 是 11 和 1，$L=11$、$m=1$、$\kappa=11$。最好的 $t$ 是 $2/12=1/6$，factor 是 $10/12=5/6$。所以 Jacobi 在这里不只是 gradient descent，还恰好是 fixed step size 里最好的那一个。Objective 的 error 正比于 error 的 square，每步乘 $(5/6)^2=0.694$：表外实际的数是 25、17.36、12.06、8.37，相邻比值都是 0.694。

::fig[thread-gradient-descent-factor] 开头那个问题里，两个 eigen-direction 每步乘的 factor 随 $t$ 的变化。$t$ 的上限由陡的方向（$\lambda=11$）定，速度由两条线里高的那条定；两条线交在 $t=1/6$，高度 $5/6$。

**一般的 $P$。** $P^{1/2}\big(I-P^{-1}H\big)P^{-1/2}=I-P^{-1/2}HP^{-1/2}$，两个 matrix similar，eigenvalue 相同。所以带 $P$ 的 iteration 的速度由 $P^{-1/2}HP^{-1/2}$ 的 condition number 决定。$P=H$ 时它是 $I$，$I-P^{-1}H=0$，一步到底，这是 Gauss–Newton 那一行。选 $P$ 就是想办法让 $P^{-1/2}HP^{-1/2}$ 接近 $I$，同时 $P^{-1}g$ 便宜好算；这叫 preconditioning，$P$ 叫 preconditioner。

### 不是 quadratic 的时候：两条 inequality 就够

一般的 $f$ 没有固定的 $H$。把上面的结论推广过去，只需要两条 inequality。

**Descent lemma。** 设 $\nabla f$ 是 $L$-Lipschitz：$\|\nabla f(x)-\nabla f(z)\|\le L\|x-z\|$。沿 segment 做 integration：

$$f(x+d)-f(x)-g^\top d=\int_0^1\big(\nabla f(x+sd)-\nabla f(x)\big)^\top d\;ds\le\int_0^1Ls\,\|d\|^2\,ds=\frac L2\|d\|^2$$

不等号先用 Cauchy–Schwarz，再用 Lipschitz 条件。所以 $P=LI$ 的 model 处处在 $f$ 上方（上面左图的情形）。代入 $d=-tg$：

$$f(x^+)\le f(x)-t\Big(1-\frac{Lt}2\Big)\|g\|^2$$

$t<2/L$ 时括号是正的，每步严格下降；$t=1/L$ 时下降至少 $\tfrac1{2L}\|g\|^2$。

**Polyak–Łojasiewicz（PL）inequality。** 设存在 $\mu>0$，对所有 $x$

$$\|\nabla f(x)\|^2\ge2\mu\big(f(x)-f^\star\big)$$

即离 optimal value 越远，gradient 一定越大。代进 $t=1/L$ 的 descent lemma：

$$f(x^+)-f^\star\le f(x)-f^\star-\frac1{2L}\cdot2\mu\big(f(x)-f^\star\big)=\Big(1-\frac\mu L\Big)\big(f(x)-f^\star\big)$$

每步乘一个固定的 factor，即 linear convergence。$\mu$-strongly convex 的 function 一定满足 PL：strong convexity 的 inequality $f(z)\ge f(x)+g^\top(z-x)+\tfrac\mu2\|z-x\|^2$ 两边对 $z$ 取 minimum，左边是 $f^\star$，右边在 $z=x-g/\mu$ 取到 $f(x)-\tfrac1{2\mu}\|g\|^2$，移项就是 PL（[CS3264 第 8 站](../courses/CS3264.html#opt)就是这样证 linear rate 的）。

这个 proof 没有用 convexity。[MIT-6.8210 第 7 站](../courses/MIT-6.8210.html#policy)的 LQR policy search 是一个例子：double integrator 的 cost $J(k_1,k_2)$ 在起点 $K=(0.4,4)$ 处的 Hessian 有 negative eigenvalue（$-0.051$），那里不 convex；那一站引用的结论是这个 $J$ 在 sublevel set 上满足 PL。按那一站的设定（step 0.03）重跑 gradient descent：

| $k$ | 0 | 50 | 100 | 150 | 200 | 250 | 300 |
|---|---|---|---|---|---|---|---|
| $J-J^\star$ | 4.22 | 0.399 | 0.181 | 0.0602 | 0.0136 | $2.2\times10^{-3}$ | $3.0\times10^{-4}$ |

每 50 步的比值是 0.33、0.23、0.16、0.14，折合每步 0.978 到 0.961，靠近 $(1-0.03\times0.698)^2=0.9586$（0.698 是 $K^\star=(1,\sqrt3)$ 处 Hessian 最小的 eigenvalue，即上一小节的局部速度）。沿整条路径 $\tfrac12\|\nabla J\|^2/(J-J^\star)\ge0.233$：PL 在这条路上以 $\mu\ge0.233$ 成立，CS3264 那几行 proof 一字不改就适用。

::fig[thread-gradient-descent-pl] 左：$J(k_1,k_2)$ 的 level set，灰底是 nonconvex 的区域，彩色是 gradient descent，从灰底里出发走向 $K^\star$。右：$J-J^\star$ 的 log scale，后段贴着每步乘 0.9586 的虚线。

:::wrong 只要 objective 每步都在下降，step size 就合适
Descent lemma 只保证 $t<2/L$ 时每步下降，不管多快。DSA3102 的表里 $t=0.18$ 每步都下降，100 步后 $f-f^\star$ 还有 0.435；$t=1/6$（也就是 Jacobi）100 步后是 $3.6\times10^{-15}$。$t=0.18$ 让陡的方向的 factor 变成 $-0.98$，几乎不缩小。
:::

:::from
Quadratic model 的读法和 $2/L$、$2/(L+m)$ 与 [CMU 10-725 Gradient Descent 一讲](https://www.stat.cmu.edu/~ryantibs/convexopt-F16/lectures/grad-descent.pdf)一致（DSA3102 那一页跟着它写过）；把 $\tfrac1tI$ 换成一般的 $P$、用 similarity 读出 preconditioning、把 Jacobi、Gauss–Newton、Adam 放进同一张表，是为这条线写的。Adam 的 bias correction 按 [Kingma 与 Ba](https://arxiv.org/pdf/1412.6980)（抓取工具的分段转述，不是逐字原文）。开头五个 algorithm、$\ln\cosh$、LQR 的 Hessian、$J-J^\star$ 和 PL 比值都是用 numpy 算的。
:::

## 各门课里的同一步

同一步在不同课里换了名字和字母：

| 课 | 叫什么 | 一步怎么写 | step size | curvature 用什么量 |
|---|---|---|---|---|
| [DSA2102](../courses/DSA2102.html#cond) | Jacobi、Gauss–Seidel iteration | $x^{(k+1)}=x^{(k)}+M^{-1}(b-Ax^{(k)})$ | 没有，藏在 $M^{-1}$ 里 | $\rho(G)$、$\kappa(A)=\sigma_1/\sigma_2$ |
| [MA3270](../courses/MA3270.html#gd) | gradient descent（steepest descent） | $\theta_{k+1}=\theta_k-\eta\nabla f(\theta_k)$ | $\eta$ | Hessian 的 eigenvalue、$\kappa$ |
| [CS2109S](../courses/CS2109S.html#linreg) | gradient descent，batch 与 stochastic | $w\leftarrow w-\alpha\nabla J(w)$ | $\alpha$（learning rate） | $H=\tfrac1nX^\top X$ |
| [DSA3102](../courses/DSA3102.html#gd) | gradient descent、proximal gradient | $x^+=x-t\nabla f(x)$ | $t$ | $L$、$m$、$\kappa$ |
| [CS3264](../courses/CS3264.html#opt) | GD 与 SGD | $x^+=x-t\nabla f(x)$；$w_{t+1}=w_t-\eta v_t$ | $t$、$\eta$ | $L$、$\mu$ |
| [CS3244](../courses/CS3244.html#nn) | backpropagation 加 gradient descent | $\partial J/\partial W^{[l]}=\delta^{[l]}a^{[l-1]\top}$ | — | 每层的 scale $\tfrac{nv}2$ |
| [KARPATHY-Z2H](../courses/KARPATHY-Z2H.html#micrograd) | training loop | `p.data += -lr * p.grad` | `lr` | update:data ratio |
| [CMU-10714](../courses/CMU-10714.html#nnlib) | SGD momentum、Adam | $\theta_{t+1}=\theta_t-\alpha u_{t+1}$ | $\alpha$ | $\hat v$ |
| [STANFORD-CS336](../courses/STANFORD-CS336.html#train) | AdamW | $\theta\leftarrow\theta-\alpha_t\frac{m}{\sqrt v+\varepsilon}$ | $\alpha_t$（schedule） | $v$ |
| [CS4277](../courses/CS4277.html#ba) | Gauss–Newton、Levenberg–Marquardt | $(J^\top J+\lambda\,\mathrm{diag}(J^\top J))\delta=-J^\top r$ | $1/\lambda$ 的作用 | $J^\top J$ |
| [MIT-6.8210](../courses/MIT-6.8210.html#trajopt) | shooting、iLQR、policy search | $u=\bar u+\alpha k+K(x-\bar x)$；$K\leftarrow K-\eta\nabla J$ | $\alpha$（line search）、$\eta$ | $Q_{uu}$ |
| [BERKELEY-CS285](../courses/BERKELEY-CS285.html#trpo) | natural gradient | $\Delta\propto F^{-1}g$ | 由 KL 的上限 $\epsilon$ 定 | $F$ |

:::note 同一个字母，不同的东西
$t$ 在 DSA3102、CS3264 的 GD 部分是 step size，在 CMU-10714、CS336 是步数。$\alpha$ 在 CS2109S 是 learning rate，在 iLQR 的 forward pass 是 line search 的比例，在 SVM 的 dual 里是 multiplier。$\lambda$ 在 CS4277 是 damping，在 CS336 是 weight decay，在 DSA3102 是 lasso 的 penalty，在这一页的推导里是 eigenvalue。$L$ 在 DSA3102 是 Lipschitz constant，在 MA3270 和 CS3244 是 loss。$m$ 在 DSA3102 是 strong convexity 的 constant，在 CS336 是 first moment，在 CS3264 是 sample 数，所以 CS3264 把 strong convexity 改记成 $\mu$。$\beta$ 在 DSA3102 是 regression coefficient，在 CMU-10714 是 momentum。$J$ 在 CS2109S、CS3244 是 loss，在 MIT-6.8210 是 cost，在 CS4277 是 Jacobian。
:::

按学习顺序，每门课往骨架上加的东西：

**DSA2102。** [第 3 站](../courses/DSA2102.html#cond)给出骨架最底下的那块：error 每步乘同一个 matrix $G$，长期速度是 spectral radius。Condition number 在那里的意思是 $b$ 的 relative error 被放大多少倍。对 SPD matrix，singular value 就是 eigenvalue，$\sigma_1/\sigma_2=L/m$：同一个数在 gradient descent 里又是步数的比例系数。Ellipse 越扁，解出的 $x$ 越不可信，gradient descent 也越慢。

**MA3270 与 CS2109S。** [MA3270 第 5 站](../courses/MA3270.html#gd)用 Cauchy–Schwarz 说明 negative gradient 是 linear approximation 下降最快的方向，在 $\tfrac12(x^2+10y^2)$ 上看 zigzag 和“步数与 $\kappa$ 成正比”，再用 XOR 上停在 loss 0.347 的 seed 说明 nonconvex 时 rate 不再成立。[CS2109S 第 5 站](../courses/CS2109S.html#linreg)把 step size 叫 learning rate，用 $H=\tfrac1nX^\top X$ 的 eigenvalue（5.546 和 0.120）解释 $\alpha$ 的上限和先快后慢，并给出第一个改 $P$ 的办法：feature scaling。它还第一次引入 SGD，只说“$\alpha$ 要逐渐减小”，没有说减小多少。

**DSA3102。** 骨架的完整版本在这里：[第 3 站](../courses/DSA3102.html#gd)的 descent lemma、$O(1/k)$ 和 linear rate、不知道 $L$ 时的 backtracking，以及 nonsmooth 时的 subgradient method 和它对 step size 的要求 $\sum t_k=\infty$、$\sum t_k^2<\infty$；[第 4 站](../courses/DSA3102.html#prox)把 constraint 和 nonsmooth term 放进 prox，并用 Nesterov momentum 把 $1/k$ 变成 $1/k^2$；[第 5 站](../courses/DSA3102.html#scd)算出 fixed step size 的 SGD 停在多大的 noise 里；[第 6、7 站](../courses/DSA3102.html#admm)对 dual 做 gradient ascent，multiplier 的 step size 就是 augmented Lagrangian 的 $\rho$。

**CS3264。** [第 8 站](../courses/CS3264.html#opt)用同样的 proof 证 GD 的 rate（strongly convex 时用 PL 形式的 inequality），然后问一个 optimization 课不问的问题：要优化到多准。SGD 每步抽新 sample 时直接最小化 true risk $L_{\mathcal D}$，optimization error 压到 statistical error 以下就没有意义了。

**CS3244 与 KARPATHY-Z2H。** 到了 neural network，gradient 本身要靠 backpropagation 算。[CS3244 第 6 站](../courses/CS3244.html#nn)推出 matrix 形式的 backward recursion，并说明 gradient 的 scale 每层乘 $\tfrac{nv}2$，所以 initialization 决定 gradient descent 一开始动不动得了。[KARPATHY-Z2H 第 1 站](../courses/KARPATHY-Z2H.html#micrograd)把一步写成 `zero_grad`、`backward`、update 三行；[第 2 站](../courses/KARPATHY-Z2H.html#lm)用从 $10^{-3}$ 扫到 1 的 learning rate 挑 `lr`，再用 0.1 到 0.01 的 step decay；[第 3 站](../courses/KARPATHY-Z2H.html#stats)用 update:data ratio（约 $10^{-3}$）同时监控 learning rate 和 weight 的 scale，并推出 BatchNorm 之后 weight 大 $\lambda$ 倍等于 learning rate 小 $\lambda^2$ 倍。

**CMU-10714 与 STANFORD-CS336。** [CMU-10714 第 2 站](../courses/CMU-10714.html#nnlib)把 optimizer 写成 module：momentum 用 exponential moving average 的写法，比 PyTorch 的多一个 $1-\beta$；Adam 的 bias correction 修的是第一步 3.16 倍的偏差。[STANFORD-CS336 第 4 站](../courses/STANFORD-CS336.html#train)用 AdamW 训练 Transformer：update 的大小由 learning rate 决定，weight decay 要从 gradient 里拿出来单独做，learning rate 先 warmup 再 cosine 衰减，gradient 按全局 norm clip。[第 7 站](../courses/STANFORD-CS336.html#scaling)讲 WSD schedule：长时间 constant，最后约 10% 快速衰减。

**CS4277。** [第 7 站](../courses/CS4277.html#ba)在 bundle adjustment 上用 $P=J^\top J$。Residual 小时它接近 Newton's method，error 按平方缩小；初值差时 Gauss–Newton 第一步就让 cost 变大，Levenberg–Marquardt 在 diagonal 上加 damping，$\lambda$ 大时退化成 gradient descent 的一小步。那一站还用 Schur complement 利用 $P$ 的 sparsity 来解 $P\delta=-g$。[CS4278 的 graph-based SLAM](../courses/CS4278.html#slam) 是同一套 Gauss–Newton。

**MIT-6.8210。** [第 4 站](../courses/MIT-6.8210.html#trajopt)的 decision variable 是一整条 control sequence。Shooting 的 Hessian 的 condition number 按 $1.1^{2N}$ 增长；iLQR 每步沿 trajectory 解一次 time-varying LQR，用 $\alpha$ 减半做 line search。[第 7 站](../courses/MIT-6.8210.html#policy)直接对 feedback gain $K$ 做 gradient descent，没有 model 时用 weight perturbation 估计 gradient，它的 expectation 是 $-\eta\nabla J$，和 REINFORCE 是同一件事。

**BERKELEY-CS285。** [第 6 站](../courses/BERKELEY-CS285.html#trpo)把“一小步”的“小”改用 KL divergence 量，推出 $P=F$ 的 natural gradient。那里的 $F$ 是 diagonal 的（$F_{kk}=109$，$F_{\sigma\sigma}=2000$），natural gradient 就是按 coordinate 重新 scale 的 gradient，即下一节的主题。

## 桥一：diagonal 的 $P$：Jacobi、feature scaling、Levenberg–Marquardt 与 Adam

完整的 $P=H$ 一步到底，但 $H$ 有 $p^2$ 个 entry，$p=10^9$ 时存都存不下。最便宜的折中是只用 diagonal。四门课各自用了一个 diagonal 的 $P$，名字完全不同。

### 四个 diagonal

- **Jacobi（DSA2102）**：$P=\mathrm{diag}(A)$，$t=1$。上面已经推过，它就是 $x-D^{-1}\nabla f$。
- **Feature scaling（CS2109S）**：把 feature $j$ 除以 $s_j$，相当于 change of variables $w=Sw'$，$S=\mathrm{diag}(1/s_j)$。在 $w'$ 上做 gradient descent：$\nabla_{w'}f(Sw')=S^\top\nabla f(w)$，$w'^+=w'-tS^\top\nabla f(w)$，两边乘 $S$ 换回 $w$：$w^+=w-t\,SS^\top\nabla f(w)$。所以 change of variables 就是用 $P=(SS^\top)^{-1}/t$ 做 preconditioning。
- **Levenberg–Marquardt（CS4277）**：$\lambda\to\infty$ 时 $J^\top J$ 相对于 $\lambda\,\mathrm{diag}(J^\top J)$ 可以忽略，$\delta\approx-\big(\lambda\,\mathrm{diag}(J^\top J)\big)^{-1}J^\top r$。$J^\top r$ 是 $\tfrac12\|r\|^2$ 的 gradient，$\mathrm{diag}(J^\top J)$ 是 Gauss–Newton Hessian 的 diagonal，所以这是 step size 为 $1/\lambda$ 的 Jacobi 式 preconditioned gradient descent。LM 在 Gauss–Newton 和它之间连续地调。
- **Adam（CMU-10714、CS336）**：$P=\mathrm{diag}(\sqrt{\hat v}+\varepsilon)/\alpha$，$\hat v$ 是 $g^2$ 的 moving average。Kingma 与 Ba 的论文指出两点：每步的移动大致不超过 $\alpha$，$\alpha$ 像一个 trust region；gradient 整体乘一个 constant $c$，$\hat m$ 和 $\sqrt{\hat v}$ 都乘 $c$，update 不变。第二点可以直接验证：对 $f=\tfrac c2x^2$ 从 0.35 出发、$\alpha=0.1$，$c=1$、100、$10^4$ 三种情况的前几步都是 0.25、0.1518、0.0581、$-0.0264$，一位不差；gradient descent 在 $c=10^4$ 时却必须 $t<2\times10^{-4}$。论文还说 $\hat v$ 近似 Fisher information matrix 的 diagonal，所以 Adam 和 CS285 的 natural gradient 相似，但 $P$ 里用的是它的 square root，更保守。

### Diagonal 能修好什么，修不好什么

$P^{-1/2}HP^{-1/2}$ 在 $P=\mathrm{diag}(H)$ 时的 entry 是 $H_{ij}/\sqrt{H_{ii}H_{jj}}$：diagonal 全是 1，off-diagonal 是 correlation。所以 diagonal preconditioner 消掉的是各 coordinate 的 scale，留下的是 coordinate 之间的 correlation。

用 CS2109S 那三个点算：

| | $H$ 的 condition number |
|---|---|
| 原始 feature $x=1,2,3$ | 46.1 |
| 只除以 diagonal（Jacobi 式的 $P$） | 25.96 |
| $x$ 换成 1000、2000、3000 | $3.27\times10^7$ |
| 1000、2000、3000 再除以 diagonal | 25.96 |
| standardize（减 mean 再除以 standard deviation） | 1 |

Diagonal 的 $P$ 把单位造成的 $3.27\times10^7$ 一下拉回 25.96，单位不再有任何影响；但 25.96 是 diagonal 修不动的部分，它来自两个 column $(1,1,1)$ 和 $(1,2,3)$ 的 cosine 0.926：除以 diagonal 之后 $P^{-1/2}HP^{-1/2}=\begin{pmatrix}1&0.926\\0.926&1\end{pmatrix}$，eigenvalue $1\pm0.926$，比值正是 25.96。Jacobi 的 $G$ 的 eigenvalue 是 $\pm0.926$，同一个数。Standardize 能做到 1，是因为减 mean 是一个 non-diagonal 的 change of variables：intercept 吸收了 $w_1\bar x$，两个 column 变成 perpendicular。

开头的问题更极端：$X^\top X$ 的 diagonal 已经是 $6I$，diagonal 的 $P$ 和 $I$ 没有区别，condition number 11 全部来自 correlation（两个 column 的 cosine 是 $5/6$，eigenvector 是 $(1,1)$ 和 $(1,-1)$，ellipse 斜 45°）。这解释了表里 AdamW 为什么最差：它的 $P$ 管不到斜着的 ellipse，而 step 又被 $\alpha$ 限住。

同样的事可以在 $\kappa=100$ 的 quadratic 上看得更清楚。$H=\mathrm{diag}(100,1)$ 和把它转 45° 的 $RHR^\top$ 是同一个 problem 换了 coordinate，起点也一起转。Gradient descent（$t=2/101$）在两边完全一样；Adam（$\beta_1=0.9$，$\beta_2=0.999$）不一样。$f$ 降到初值的 $10^{-6}$ 所需的步数：

| | axis-aligned | 转 45° |
|---|---|---|
| gradient descent，$t=2/101$ | 346 | 346 |
| Adam，$\alpha=0.1$ | 82 | 406 |
| Adam，$\alpha=0.03$ | 46 | 1000 步内没有到（1000 步时是初值的 $6.7\times10^{-6}$） |

::fig[thread-gradient-descent-adam] 同一个 $\kappa=100$ 的 valley，左边沿 axis，右边转了 45°；虚线是 Adam（$\alpha=0.03$）前 300 步的整条路径，动起来看彩色的最近 30 步。左边两个 coordinate 各自按自己的 scale 走，沿直线直奔 minimum；右边起初两个 coordinate 的 gradient 同号，Adam 沿陡的方向 $(-1,-1)$ 落到谷底，之后每个 coordinate 的 gradient 都被陡的方向的来回占满，沿谷底的平的方向每步只挪约 0.001，第 300 步离 minimum 还有 0.60。

:::wrong Adam 会自己适应 curvature，所以用了 Adam 就不用管 conditioning
Adam 只看每个 coordinate 自己的 gradient 有多大。陡和平如果沿 coordinate axis 分开，它很有效（82 步对 346 步）；如果陡的方向是几个 coordinate 的组合，它比 gradient descent 还慢（406 步）。所以用 Adam 训练 Transformer 时仍然要 normalization、合理的 initialization 和 warmup。
:::

:::from
四种 diagonal 放在同一个 $P$ 下、change of variables 等于 $SS^\top$、correlation 是 diagonal 修不掉的部分、所有表里的数，是为这条线写和算的。Adam 的“step 大致不超过 $\alpha$”、对 gradient rescaling invariant、$\hat v$ 近似 Fisher matrix 的 diagonal，来自 [Kingma 与 Ba](https://arxiv.org/pdf/1412.6980) 第 2.1、5 节（抓取工具的分段转述）。Adam 对 rotation 敏感只用自己的数值实验支持，没有找到讲义核对。
:::

## 桥二：noise floor 与 learning rate schedule

CS2109S 说 SGD 的 $\alpha$ 要逐渐减小，CS336 的 cosine schedule 从 $10^{-3}$ 降到 $10^{-4}$，WSD 在最后 10% 突然降，DSA3102 的 subgradient method 要求 $t_k\to0$。这四处说的是同一个量：fixed step size 下 iterate 停在离 minimum 多远。

### 一个方向上的 noise floor

[DSA3102 第 5 站](../courses/DSA3102.html#scd)的例子：$a=(1,2,4,7,11)$，$f(x)=\tfrac15\sum_i\tfrac12(x-a_i)^2$，minimizer 是 5，每次随机取一个 $a_i$，用 $x-a_i$ 当 gradient。它的 noise（$a_i$ 偏离 5 的部分）variance 是 $\sigma^2=13.2$。

一般化到 curvature 为 $\lambda$ 的一个方向：$e^+=(1-t\lambda)e+t\xi$，$\xi$ 是 mean 0、variance $\sigma^2$、与 $e$ independent 的 noise。两边取 variance，长期稳定时 $V=(1-t\lambda)^2V+t^2\sigma^2$。移项：$V\big(1-(1-t\lambda)^2\big)=t^2\sigma^2$，而 $1-(1-t\lambda)^2=t\lambda(2-t\lambda)$，所以

$$V=\frac{t\,\sigma^2}{\lambda\,(2-t\lambda)},\qquad\mathbb E\big[\tfrac12\lambda e^2\big]=\frac{t\,\sigma^2}{2\,(2-t\lambda)}$$

$\lambda=1$ 时就是 DSA3102 的 $V=t\sigma^2/(2-t)$：$t=0.5$ 时 standard deviation 2.10，loss 多出 2.20；$t=0.05$ 时只多 0.169。右边的式子在 $t\lambda$ 小时约等于 $t\sigma^2/4$，和 $\lambda$ 几乎无关：每个有 noise 的方向，不管陡还是平，都给 loss 加一份和 $t$ 成正比的 floor。

### 为什么不一开始就用小的 $t$：river valley

只有一个方向时，小 $t$ 只有好处。真正的 loss 还有平的方向。Wen 等人把 LLM 的 pretraining loss 描述成 river valley：两侧是陡的 hillside，谷底有一条几乎平的 river。用一个能精确算的版本：hillside 方向 $\lambda=1$，noise 就是上面那组 $a_i$；hillside 方向从谷底出发；river 方向 $\lambda=0.01$，起点离 minimum 30，noise 是同一组 data 乘上 0.01。每个方向的 mean 和 variance 都按 $\mathbb E e^+=(1-t\lambda)\mathbb Ee$、$V^+=(1-t\lambda)^2V+t^2\sigma^2$ 精确递推，不用 random sample。4000 步，$\mathbb Ef-f^\star$：

| schedule | $k=1000$ | $k=3600$ | $k=4000$ | 其中 hillside / river |
|---|---|---|---|---|
| constant $t=0.5$ | 2.200 | 2.200 | 2.200 | 2.200 / 0.0002 |
| constant $t=0.05$ | 1.824 | 0.292 | 0.252 | 0.169 / 0.082 |
| cosine，0.5 降到 0 | 1.791 | 0.048 | 0.017 | 0.017 / 0.0000 |
| WSD：0.5，最后 10% linear 降到 0 | 2.200 | 2.200 | 0.105 | 0.105 / 0.0001 |

两个 constant 各错一边。$t=0.5$ 时 river 方向每步乘 $0.995$，1000 步就走完了，但 hillside 的 floor 一直是 2.2。$t=0.05$ 时 floor 只有 0.169，river 方向却每步只乘 0.9995，4000 步后还剩 $\tfrac12\times0.01\times900\times0.9995^{8000}=0.082$。先大后小两头都要：大的 $t$ 走完 river，小的 $t$ 压下 hillside 的 noise。

WSD 那一行的形状正是 [CS336 第 7 站](../courses/STANFORD-CS336.html#scaling)和 MiniCPM 论文描述的：stable 阶段 loss 停在高处，decay 一开始就急剧下降（3600 到 4000 步每 100 步依次是 2.20、1.53、0.95、0.45、0.105）。下降全部来自 hillside，river 那一份在 stable 阶段早已降到 0.0002。所以 decay 时的 loss drop 来自 noise floor 跟着 $t$ 一起缩小，decay 期间并没有新学到什么；这也是 WSD 能从任一 stable checkpoint 拉出一段 decay 的原因。

这个 toy 里 WSD 最后比 cosine 高（0.105 对 0.017）：hillside 的 variance 跟上 $t$ 的变化大约要 $1/(2t)$ 步，linear decay 的最后几十步 $t$ 掉得比 variance 收缩得快（decay 拉长到 20% 是 0.074）。MiniCPM 报告的是在他们的 model 上 10% 的 decay 已经和 cosine 一样好；这个 toy 只用来说明 loss 为什么在 decay 时突然下降，不用来比较两种 schedule。

::fig[thread-gradient-descent-river] River valley 上的一次随机 run（WSD，4000 步）。灰色是 stable 阶段前 3600 步的整条路径：一边在 hillside 方向上下乱跳，一边沿 river 往右走到 minimum 附近，之后只剩乱跳；黑色是 decay 的最后 100 步，幅度收窄到 minimum 旁边。动起来每帧 50 步，彩色是最近 50 步，下方是当时的 learning rate。

### Adam 的 floor 不需要 noise

SGD 的 floor 来自 noise。Adam 还有一个与 noise 无关的 floor：$\beta_1=\beta_2=0$ 时它的 update 就是 $-\alpha\,\mathrm{sign}(g)$。拿 $f=\tfrac12x^2$ 从 0.35 出发，$\alpha=0.1$：

$$0.35\to0.25\to0.15\to0.05\to-0.05\to0.05\to-0.05\to\cdots$$

这和 DSA3102 第 3 站 subgradient method 在 $|x|$ 上、$t=0.1$ 时的数列逐位相同，原因也相同：step 的长度不随 gradient 变小而变小。那一站由此要求 $t_k\to0$；Adam 的 schedule 最后降到很小，起的是同样的作用。

带上 $\beta_1=0.9$、$\beta_2=0.95$，在 smooth 的 $\tfrac12x^2$ 上好一些：$\hat m$ 在 minimum 附近正负抵消，$\sqrt{\hat v}$ 还记着之前较大的 gradient，step 自己变小，第 200 到 300 步 $|x|\le0.0055$（论文叫 automatic annealing）；在 $|x|$ 上仍在 $\pm0.065$ 之间。有 noise 时两种 floor 叠在一起：用那组 $a_i$ 跑 Adam 4000 步、重复 200 次，最后离 5 的 root mean square，constant $\alpha=0.1$ 是 0.40；constant $\alpha=0.01$ 是 0.14，但第 100 步才走到 0.80；$\alpha$ 从 0.1 按 cosine 降到 0 是 0.12，第 100 步已到 5.05。

:::wrong 训练后期 loss 不降了，说明 model 已经学到头了
上表 constant $t=0.5$ 那一行从第 1000 步到第 4000 步纹丝不动，停在 2.20，可 optimal 的 loss 是 0；把 $t$ 降下来，几百步就降到 0.1 附近。Plateau 可能只是 noise floor，它的高度正比于当前的 step size。判断 model 有没有学到头之前，先看 learning rate 是不是还停在高处（CS336 那一站提醒过：只跑 5000 步时 $T_c$ 也要改成 5000）。
:::

:::from
$V=t\sigma^2/(2-t)$ 和 mean 的例子来自 DSA3102 第 5 站（跟的是 [CMU 10-725 Stochastic Gradient Descent 一讲](https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/stochastic-gd.pdf)）；推广到 curvature $\lambda$、两个方向的精确递推和所有数是为这条线算的。River valley 的说法来自 [Wen 等人，Understanding Warmup-Stable-Decay Learning Rates: A River Valley Loss Landscape Perspective](https://arxiv.org/abs/2410.05192v3)（只读了 abstract：stable 阶段在 hillside 之间大幅 oscillate、同时沿 river 前进，decay 压低 oscillation）。WSD 的定义、“decay 阶段 loss 急剧下降”、“10% 的 decay 已经足够”来自 [MiniCPM 论文](https://ar5iv.labs.arxiv.org/html/2404.06395)第 4 节（抓取工具的转述；论文没有把下降归因于 noise，这里的 noise floor 解释是我的）。Adam 的 automatic annealing 一词来自 Kingma 与 Ba 第 2.1 节；$\beta=0$ 时与 subgradient method 的逐位对应和 Adam 的模拟是为这条线算的。
:::

## 桥三：momentum：给 iteration 加一点 friction

### 在 quadratic 上把 momentum 解出来

DSA3102 第 4 站在 $\tfrac12(100x_1^2+x_2^2)$（$\kappa=100$）上比较了 gradient descent 和 Nesterov。现在用 heavy-ball 的写法（Distill 上 Goh 的文章用的就是这一种）：

$$z_{k+1}=\beta z_k+\nabla f(x_k),\qquad x_{k+1}=x_k-\alpha z_{k+1}$$

在 curvature 为 $\lambda$ 的一个 eigen-direction 上，$\nabla f=\lambda x$。由第二式 $z_k=(x_{k-1}-x_k)/\alpha$，代进第一式再代进第二式：

$$x_{k+1}=x_k-\alpha\beta\,\frac{x_{k-1}-x_k}{\alpha}-\alpha\lambda x_k=(1+\beta-\alpha\lambda)\,x_k-\beta\,x_{k-1}$$

这是 second-order recurrence，characteristic polynomial 是 $r^2-(1+\beta-\alpha\lambda)\,r+\beta=0$。两个 root 的乘积是 $\beta$。当 $(1+\beta-\alpha\lambda)^2<4\beta$ 时两个 root 是一对 complex conjugate，absolute value 相等，所以都是 $\sqrt\beta$。

这就是 momentum 的作用：在 complex root 的范围内，**每个方向每步都乘 $\sqrt\beta$，与 $\lambda$ 无关**。Gradient descent 的问题是平的方向 factor 接近 1；momentum 把陡和平的方向拉到同一个 factor 上。

拿 $\alpha=0.01$、$\beta=0.9$（PyTorch 风格的常用值）核对：$\lambda=100$ 时 $(1.9-1)^2=0.81<3.6$，$\lambda=1$ 时 $1.89^2=3.572<3.6$，两个方向都在 complex 范围，都乘 $\sqrt{0.9}=0.949$；gradient descent 同样的 $\alpha$ 下是 0 和 0.99。Goh 给出了 optimal 的选择 $\alpha=\big(2/(\sqrt L+\sqrt m)\big)^2$、$\beta=\big((\sqrt\kappa-1)/(\sqrt\kappa+1)\big)^2$，factor 是 $(\sqrt\kappa-1)/(\sqrt\kappa+1)$，把 gradient descent 的 $\kappa$ 换成了 $\sqrt\kappa$。从 $(1,1)$ 出发，$f$ 第一次低于 $10^{-6}$：

| method | hyperparameter | 每步 factor | 步数 |
|---|---|---|---|
| gradient descent | $t=0.01$ | 0.99 | 653 |
| Nesterov（DSA3102） | $t=0.01$ | — | 101 |
| heavy ball | $\alpha=0.01$，$\beta=0.9$ | 0.949 | 138 |
| heavy ball，optimal | $\alpha=0.0331$，$\beta=0.669$ | $9/11=0.818$ | 69 |

Stability 的条件也放宽了：Goh 给出 $0<\alpha\lambda<2+2\beta$，$\beta=0.9$ 时可到 3.8。

### 三门课的三种写法

**CMU-10714 的 EMA 写法。** $u_{k+1}=\beta u_k+(1-\beta)g_k$，$\theta_{k+1}=\theta_k-\alpha u_{k+1}$。令 $z=u/(1-\beta)$，它就是 heavy ball，step size 是 $\alpha(1-\beta)$。所以 EMA 写法的 $\alpha=0.1$ 等于 heavy ball 的 $\alpha=0.01$（iterate 最大差 $9\times10^{-16}$，同为 138 步）；仍用 $\alpha=0.01$ 则要 598 步，这就是那一站说的 step size 差 10 倍。Adam 的 $m$ 用的是 EMA 写法，$\beta_1$ 就是这一节的 $\beta$。

**KARPATHY-Z2H 忘了 `zero_grad`。** [第 1 站](../courses/KARPATHY-Z2H.html#micrograd)的 wrong 块里，不清零的版本 loss 降得更快。不清零时 `p.grad` 是之前所有 gradient 之和，$z_{k+1}=z_k+g_k$，正是 $\beta=1$。Root 的乘积是 1，complex 时 absolute value 是 1：没有 friction，永远不会停下来。在 $\tfrac12x^2$ 上取 $\alpha=0.05$ 从 1 出发：

| $k$ | 5 | 7 | 14 | 20 | 28 |
|---|---|---|---|---|---|
| gradient descent | 0.774 | 0.698 | 0.488 | 0.358 | 0.238 |
| $\beta=1$ | 0.334 | $-0.110$ | $-1.001$ | $-0.119$ | 1.001 |

前几步它确实比 gradient descent 快，第 14 步摆到 $-1$，第 28 步回到 1，之后以 28 步为周期一直摆。那一站只跑了 20 步，恰好停在“看起来更快”的那一段。

**DSA3102 的 Nesterov。** 第 4 站的 FISTA 把 momentum 的 weight 从 0 慢慢加到接近 1，并且在外推出去的点上算 gradient。那一站观察到 objective 每隔约 31 步回升一次，这就是 complex root 带来的 oscillation：momentum 换来速度，代价是失去“每步下降”。

::fig[thread-gradient-descent-momentum] 同一个 $\kappa=100$ 的 valley（横向是平的 $x_2$，纵向是陡的 $x_1$），三种 iteration 同步走 140 步。左：gradient descent，$x_1$ 第一步就到 0，之后沿谷底慢慢挪。中：$\beta=0.9$，冲过头再被拉回，螺旋着进去。右：$\beta=1$，没有 friction，绕着 minimum 一直转。

:::from
Heavy-ball 的写法、per-eigenvalue 的 $2\times2$ recurrence、$0<\alpha\lambda<2+2\beta$、optimal 的 $\alpha,\beta$ 和 $(\sqrt\kappa-1)/(\sqrt\kappa+1)$，来自 [Goh，Why Momentum Really Works（Distill）](https://distill.pub/2017/momentum/)（抓取工具给出的公式与转述，读了前半篇）。Second-order recurrence 的推导、“complex root 时每个方向都乘 $\sqrt\beta$”、表里的步数、EMA 与 heavy ball 的等价、$\beta=1$ 的数列，是为这条线推和算的。
:::

## 桥四：constraint：project 回去，或者给 constraint 一个价格

有 constraint 时，$x-P^{-1}g$ 可能走出 feasible set。课程里有两种处理办法，在同一个小例子上各算一遍。例子取 [DSA3102 第 6 站](../courses/DSA3102.html#dual)用 KKT 手解过的 problem：

$$\min_x\ (x_1-3)^2+(x_2-2)^2\quad\text{s.t.}\quad x_1+x_2\le2,\quad x_2\ge0$$

那一站的答案是 $x^\star=(1.5,0.5)$，第一个 constraint 的 multiplier $u_1^\star=3$。

### Primal：走一步，再 project 回来

DSA3102 第 4 站说明了：constraint 写成 indicator function 时，prox 就是 projection，proximal gradient 变成 projected gradient descent：

$$x^+=\Pi_C\big(x-t\nabla f(x)\big)$$

$\nabla f=2(x-p)$，$p=(3,2)$。取 $t=0.25$，gradient step 是 $x-0.5(x-p)=\tfrac12(x+p)$。从 $(0,0)$ 出发：

| $k$ | gradient step | project 之后 | 离 $x^\star$ |
|---|---|---|---|
| 1 | $(1.5,\ 1)$ | $(1.25,\ 0.75)$ | 0.25 |
| 2 | $(2.125,\ 1.375)$ | $(1.375,\ 0.625)$ | 0.125 |
| 3 | $(2.1875,\ 1.3125)$ | $(1.4375,\ 0.5625)$ | 0.0625 |

每次 gradient step 都越过 $x_1+x_2=2$，projection 沿 normal $(1,1)$ 把它拉回 line 上（减去超出量的一半）。在 line 上只剩 tangent 方向 $(1,-1)$ 可以动，那个方向的 error 每步乘 $1-2t=0.5$，表里离 $x^\star$ 的距离正是每步减半。

### Dual：对 multiplier 做 gradient ascent

另一种办法不动 constraint，给它一个价格。对 $x_1+x_2\le2$ 配 multiplier $u\ge0$（另一个 constraint 在 optimal 处不 active，multiplier 是 0，这里省掉），$x(u)=\arg\min_x\,f(x)+u(x_1+x_2-2)$：对 $x$ 求 gradient，$2(x-p)+u(1,1)=0$，$x(u)=p-\tfrac u2(1,1)$。代回去得 dual function：

$$g(u)=2\Big(\frac u2\Big)^2+u\,(5-u-2)=3u-\frac{u^2}2$$

$g'(u)=3-u$，正好是 $x(u)$ 处的 constraint residual $x_1+x_2-2=5-u-2$（DSA3102 第 7 站：dual 的 gradient 就是 constraint 的 residual）。对 $g$ 做 gradient ascent，再 project 到 $u\ge0$：$u^+=\max\big(0,\ u+s\,(x_1+x_2-2)\big)$。Constraint 被违反多少，价格就涨多少。

$g$ 是 concave quadratic，$|g''|=1$，所以骨架里的规则原样适用：$s<2$ converge，$s=1$ 一步到，factor 是 $1-s$。

| $s$ | $u_1$ | $u_2$ | $u_3$ | $u_4$ | 每步 factor |
|---|---|---|---|---|---|
| 0.5 | 1.5 | 2.25 | 2.625 | 2.8125 | 0.5 |
| 1 | 3 | 3 | 3 | 3 | 0 |
| 1.5 | 4.5 | 2.25 | 3.375 | 2.8125 | $-0.5$ |

$s=1.5$ 时 $u$ 在 3 两侧来回跳，跳的幅度每次减半，和 primal 上 $t$ 超过 $1/L$ 时的 zigzag 是同一回事。三种 $s$ 最后都给出 $u=3$、$x(3)=(1.5,0.5)$：dual ascent 自己找到了 DSA3102 用 KKT 解出的 multiplier，也就是那一站说的 shadow price。

::fig[thread-gradient-descent-constraint] 左：feasible set（浅色）和 projected gradient descent，每一步先沿 $-\nabla f$ 走出去（虚线），再 project 回来（实线）。右：dual function $g(u)=3u-u^2/2$ 上的 dual ascent，彩色 $s=0.5$ 从左边爬上去，灰色 $s=1.5$ 在顶点两侧来回跳。

### 在别的课里

- SVM 的 dual（[DSA3102 第 6 站](../courses/DSA3102.html#dual)、[CS3244 第 4 站](../courses/CS3244.html#svm)）是关于 $\alpha_i$ 的 concave quadratic，constraint 是 $\sum_i\alpha_iy_i=0$，soft margin 再加 box $0\le\alpha_i\le C$。对它做 projected gradient ascent 时，projection 是 $\alpha_i=\mathrm{clip}(v_i-\mu y_i,\ 0,\ C)$，其中 scalar $\mu$ 取到让 $\sum_i\alpha_iy_i=0$ 为止。
- [MIT-6.8210 第 4 站](../courses/MIT-6.8210.html#trajopt) 的 iLQR 处理不了 $|u|\le2$，那一站说实践中放进 cost 做 penalty 或 augmented Lagrangian。Augmented Lagrangian 就是 [DSA3102 第 7 站](../courses/DSA3102.html#admm)的 method of multipliers：primal 那一步交给 iLQR，multiplier 按 residual 涨价，涨价的 step size 是 $\rho$。
- [STANFORD-CS336](../courses/STANFORD-CS336.html#train) 的 gradient clipping 是对 step 的 constraint。在 GD 的 model $g^\top d+\tfrac1{2\alpha}\|d\|^2$ 上加 $\|d\|\le\alpha M$：model 等于 $\tfrac1{2\alpha}\|d+\alpha g\|^2$ 减一个 constant，所以要找 ball 里离 $-\alpha g$ 最近的点：$\|g\|\le M$ 时是 $-\alpha g$，否则是 $-\alpha\tfrac{M}{\|g\|}g$，正是 clip 之后的那一步。所以 clipping 是半径 $\alpha M$ 的 trust region，和 CS4277 的 Levenberg–Marquardt（那一页的来源称之为 trust region 方法）、Adam 的“step 不超过 $\alpha$”同属一类 step control。

:::from
Problem、$x^\star$ 和 $u_1^\star=3$ 来自 DSA3102 第 6 站；projection 与 prox、dual gradient 等于 residual 来自那一页第 4、7 站（跟的是 CMU 10-725 的对应几讲）。两种 iteration 的数表、dual function 的推导、step size 规则在 dual 上的对应、gradient clipping 等于 trust region 的推导，是为这条线算和写的。
:::

## 桥五：gradient 往回传：backprop、adjoint 与 iLQR

### 两条 chain 是同一条

MIT-6.8210 第 4 站的 shooting 把 trajectory optimization 写成 $\min_u J(u)$：

$$J=\sum_{n=0}^{N-1}\ell(x[n],u[n])+\ell_f(x[N]),\qquad x[n+1]=f(x[n],u[n]),\quad x[0]=x_0$$

要对 $u$ 做 gradient descent，需要 $\partial J/\partial u[n]$。Underactuated 教材的写法是：先 forward simulate 出 $x[\cdot]$，然后从 $\lambda[N-1]=\partial\ell_f/\partial x[N]$ 往回算

$$\lambda[n-1]=\frac{\partial\ell}{\partial x[n]}^{\!\top}+\frac{\partial f}{\partial x[n]}^{\!\top}\lambda[n],\qquad\frac{\partial J}{\partial u[n]}=\frac{\partial\ell}{\partial u[n]}+\lambda[n]^\top\frac{\partial f}{\partial u[n]}$$

$\lambda[n]$ 的意思是 $\partial J/\partial x[n+1]$，叫 adjoint 或 costate。把它和 CS3244 第 6 站的 backward recursion 放在一起：

| MIT-6.8210：shooting | CS3244：MLP |
|---|---|
| 时间步 $n$ | layer $l$ |
| state $x[n]$，forward simulate 时存下 | activation $a^{[l]}$，forward pass 时存下 |
| 每步注入的 $u[n]$ | 每层的 $W^{[l]}$、$b^{[l]}$ |
| $\partial f/\partial x$ | $\mathrm{diag}(\sigma')\,W^{[l]}$ |
| $\lambda[n]=\partial J/\partial x[n+1]$ | $\partial J/\partial a^{[l]}$ |
| $\lambda[n-1]=\ell_x^\top+f_x^\top\lambda[n]$ | $\delta^{[l-1]}=\sigma'\odot W^{[l]\top}\delta^{[l]}$ |
| $\partial J/\partial u[n]=\ell_u+f_u^\top\lambda[n]$ | $\partial J/\partial W^{[l]}=\delta^{[l]}a^{[l-1]\top}$ |

教材原文说 adjoint equation“就是”neural network 里的 backpropagation，更一般地说是 reverse-mode automatic differentiation。差别在于 MLP 每层是不同的 function，shooting 每一步用同一个 $f$、注入不同的 $u[n]$。后者是 RNN 的结构（同一个 cell，每个时刻不同的 input），对 RNN 的 backprop 因此叫 backpropagation through time；只是 shooting 里被 optimize 的是 input，不是 cell 的 weight。

MIT-6.8210 那一站的 pendulum swing-up（explicit Euler，$dt=0.05$，$N=80$，cost $\sum dt\,u^2+(x[N]-x_{goal})^\top\mathrm{diag}(200,20)(x[N]-x_{goal})$），在 $u\equiv0$ 处 adjoint 算的 gradient 与 central difference 最大差 $3.9\times10^{-7}$。

::fig[thread-gradient-descent-chain] 上一行是 shooting 的 chain，下一行是 MLP 的 chain，结构相同。动起来先看 forward（从左往右存下 $x$ 和 $a$），再看 backward（从右往左传 $\lambda$ 和 $\delta$）。柱子是传回来的 signal 的大小：上一行每步乘 1.1（MIT-6.8210 里 upright pendulum 的 eigenvalue），越往前越大；下一行每层乘 0.707（CS3244 里 $\mathrm{Var}(w)=1/n$ 的 ReLU network），越往前越小。

### Jacobian 连乘：vanishing、exploding 与 condition number

两条 chain 往回传时，每一步都乘一个 Jacobian，$k$ 步之后乘的是 $k$ 个 Jacobian 的积。CS3244 的表：$\mathrm{Var}(w)=0.01^2$ 时每层乘 0.113，20 层后剩 $10^{-19}$；$1/n$ 时每层乘 0.707；He 的 $2/n$ 让 factor 等于 1。MIT-6.8210 的 shooting：$A$ 的 eigenvalue 是 $1.1$，$u[0]$ 对 $x[N]$ 的影响按 $1.1^N$ 长，$N=150$ 时 $u[0]$ 和 $u[149]$ 的 gradient 差 $1.1^{149}=1.5\times10^6$ 倍，那一站读成每步多丢 $2\log_21.1=0.275$ bit。教材在这里明确拿 deep network 的 vanishing / exploding gradient 作类比。

对 gradient descent 来说，这就是骨架里的 $\kappa$：step size 要迁就 gradient 最大的方向，其余方向几乎不动。Pendulum 上 Gauss–Newton Hessian $J^\top J$（这里 $J$ 是 residual 的 Jacobian）在 solution 处的 condition number 是 24918。用 adjoint gradient 加 backtracking 做 gradient descent，2000 步后 cost 是 15.57，optimal 是 13.956。

两门课的对策不同。Deep learning 让 Jacobian 的积保持在 1 附近：He initialization、BatchNorm 与 LayerNorm，再用 Adam 按 coordinate 重新 scale。Control 换写法：transcription 把每个 $x[n]$ 也当作 variable，dynamics 变成只连相邻两步的 constraint，丢掉的 bit 数停在 9.5；或者换一个 $P$，就是下面的 iLQR。

### iLQR 的 backward pass 就是 Gauss–Newton

把 pendulum 的 cost 写成 $\|r(u)\|^2$，$r=\big(\sqrt{dt}\,u[0],\dots,\sqrt{dt}\,u[N-1],\ W^{1/2}(x[N](u)-x_{goal})\big)$，就是 CS4277 的 nonlinear least squares，可以做 Gauss–Newton：把 $x[N](u)$ linearize，解 $J^\top J\delta=-J^\top r$。

iLQR 的 backward pass 做的是：沿当前 trajectory 把 dynamics linearize、cost 展开到 second order，解一个 time-varying LQ problem。Linearize 之后 $x[N]$ 对 $\delta u$ 是 linear 的，cost 对 $\delta u$ 是 quadratic 的，这个 LQ problem 和 Gauss–Newton 的那个 linear least squares 是同一个 problem，只是 iLQR 用 Riccati recursion 从后往前解，Gauss–Newton 直接解 $N\times N$ 的 normal equations。在 $u\equiv0$ 处把 iLQR 的 $k[n]+K[n]\delta x[n]$ 沿 linearized dynamics 展开成 open-loop 的 $\delta u$，和 Gauss–Newton 的 $\delta$ 最大差 $8.8\times10^{-14}$。

两边丢掉的东西也一一对应：CS4277 说 Gauss–Newton 比 Newton 少了 $\sum_kr_k\nabla^2r_k$；MIT-6.8210 说 iLQR 比 DDP 少了 $f$ 的 second derivative。这里 $r$ 里唯一 nonlinear 的部分是 $x[N](u)$，它的 second derivative 正是由 $f$ 的 second derivative 连乘出来的，所以丢掉的是同一项。

不同的只有 forward pass。Gauss–Newton 把 $\delta$ 原样加到 $u$ 上；iLQR 用 $u[n]=\bar u[n]+\alpha k[n]+K[n](x[n]-\bar x[n])$ 在真实的 nonlinear dynamics 上重新 simulate，偏离了 $\bar x$ 就用 feedback 修正。两者都用 $\alpha$ 减半做 line search：

| iteration | 0 | 1 | 2 | 3 | 4 | 6 | 10 | 20 | 60 |
|---|---|---|---|---|---|---|---|---|---|
| iLQR | 1973.92 | 423.53 | 172.85 | 80.86 | 30.15 | 15.59 | 14.50 | 13.98 | 13.96 |
| Gauss–Newton | 1973.92 | 665.45 | 338.87 | 96.58 | 90.16 | 48.26 | 17.07 | 14.06 | 13.96 |
| GD（backtracking） | 1973.92 | 747.92 | 486.60 | 111.86 | 98.21 | 69.54 | 44.39 | 26.54 | 22.78 |

iLQR 那一行与 MIT-6.8210 那一站的表逐位一致。同一个 $P$，closed-loop 的 forward pass 让前几步快了一截；GD 没有 $P$，60 步还停在 22.78。CS4277 的 Levenberg–Marquardt 在 bundle adjustment 上做的是另一种 step control：不缩短 step，而是加大 $\lambda$，让 step 往 gradient 方向偏。

:::wrong Backpropagation 是 deep learning 自己的技巧，和 control 里的 optimization 无关
Control 的 adjoint equation 和 backprop 是同一个 reverse-mode differentiation，上面的对照表逐行对应；vanishing / exploding gradient 在 shooting 里就是 Hessian 的 condition number。iLQR 和 Gauss–Newton 则是 diagonal preconditioner 之外的另一条路：用 $J^\top J$ 做 $P$，代价是每步解一个 linear system。
:::

:::from
Shooting 的 adjoint recursion、$\lambda[n]=\partial J/\partial x[n+1]$、“adjoint equation 就是 backpropagation，也就是 reverse-mode automatic differentiation”、shooting 的数值问题与 vanishing / exploding gradient 的类比、transcription 把影响摊开、iLQR 与 DDP 的区别，来自 [Underactuated Robotics 第 10 章](https://underactuated.csail.mit.edu/trajopt.html)（抓取工具给出的公式与转述；那一章没有提 Gauss–Newton，也没有提 $Q_{uu}$ 的 regularization）。两条 chain 的对照表、iLQR 的 LQ problem 等于 Gauss–Newton 的 linear least squares、丢掉的项相同的论证，是为这条线写的；pendulum 上的 adjoint 核对、两种 $\delta$ 的比较、三种 iteration 的表、condition number 和 GD 的结果，是用 numpy 按 MIT-6.8210 那一站的设定重算的。
:::
