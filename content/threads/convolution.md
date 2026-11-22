---
title: 卷积与频率
lead: "对每个位置一视同仁的 linear operation 只能是 convolution，complex exponential 是它的 eigenvector，所以 filter 是逐个 frequency 的乘法、隔几个取一个会把 frequency 折叠；这一套推导串起 LTI system、sampling、image filter、CNN 的 conv layer、WaveNet 的 dilation，一直到 conv 在硬件上怎么切块。"
line: sig
---

先看两件事。

**第一件。** ResNet 每一段开头把 feature map 缩小一半，shortcut 那一路用 stride 2 的 1×1 conv 对齐 channel（ResNet 论文 3.3 节的 option B）。只看一个 channel、weight 取 1，它做的就是每隔一个位置取一个值。设这个 channel 的一行是细条纹，首尾相接的 8 个数 $x=(1,0,1,0,1,0,1,0)$。取第 0、2、4、6 个，得到 $(1,1,1,1)$。Image 向右挪一个 pixel，这一行变成 $(0,1,0,1,0,1,0,1)$，取出来是 $(0,0,0,0)$。[CS231N 第 2 站](../courses/STANFORD-CS231N.html#conv)说 conv layer 有 translation equivariance：input 挪一格，output 跟着挪一格，内容不变。这里 input 只挪了一个 pixel，output 从全是 1 变成全是 0。

**第二件。** [EE2023 第 7 站](../courses/EE2023.html#sampling)：6 kHz 的 $\cos$ 每秒取 10000 个 sample，每个 sample 上的值都和 4 kHz 的 $\cos$ 相同，还原出来是 4 kHz。

两件事是同一个操作：隔几个取一个。条纹写成 $x[n]=\tfrac12+\tfrac12\cos\pi n$。隔一个取一个之后 $n=2m$，$\cos2\pi m=1$，这一项变成 constant $\tfrac12$，和真正的 constant 混在一起；挪一个 pixel，它变成 $-\tfrac12$。EE2023 的办法是 sampling 之前先过一个 lowpass filter。试一个最简单的：每个位置换成 $\tfrac14\times$左邻 $+\tfrac12\times$自己 $+\tfrac14\times$右邻，也就是 [CS4243 第 1 站](../courses/CS4243.html#filter)那个 3×3 Gaussian kernel 的一行 $(1,2,1)/4$。条纹上值为 1 的位置得到 $\tfrac14\cdot0+\tfrac12\cdot1+\tfrac14\cdot0=\tfrac12$，值为 0 的位置得到 $\tfrac14\cdot1+\tfrac12\cdot0+\tfrac14\cdot1=\tfrac12$。整行都是 $\tfrac12$，挪不挪，取出来都是 $(\tfrac12,\tfrac12,\tfrac12,\tfrac12)$。

::fig[thread-convolution-stripes] 动图：左边直接隔一个取一个，右边先用 $(1,2,1)/4$ 平均再取，彩框是被取的位置。Input 每隔一会儿向右挪一个 pixel：左边的 output 在全 1 和全 0 之间跳，右边一直是 ½。

留下三个问题：为什么这三个数管用；条纹没这么细时它挡掉多少；CNN 的 conv layer 在 EE2023 的意义下算不算一个 filter。回答它们用的是同一套推导，它在十几门课里换着名字出现。下面先把它完整推一遍，再用一张表对齐各课的名字和记号，然后逐门课看它往骨架上加了什么；课程页之间没有说破的对应，用同一个小例子在两边各算一遍。

## 骨架

### 对每个位置一视同仁，就只能是 convolution

Signal 是一串数 $x[n]$，比如一行 pixel、一段 audio 的 sample。一个 operation $T$ 把它变成 $y=Tx$，要求两条：

- **Linear**：$T(ax_1+bx_2)=a\,Tx_1+b\,Tx_2$。
- **Shift-invariant**：记 $S$ 为整体向右挪一格，$(Sx)[n]=x[n-1]$。先挪再算等于先算再挪，$TS=ST$。

第二条就是 CS231N 的 translation equivariance，也是 [EE2023 第 1 站](../courses/EE2023.html#lti)的 time invariance。

记 $\delta$ 为只在 $n=0$ 处是 1、其余是 0 的 signal（unit impulse），$h=T\delta$ 为它的 output（impulse response）。任何 signal 都是挪过的 impulse 的 weighted sum，$x=\sum_kx[k]\,S^k\delta$。两条性质各用一次：

$$Tx=\sum_kx[k]\,T(S^k\delta)=\sum_kx[k]\,S^k(T\delta)=\sum_kx[k]\,S^kh$$

第一个等号用 linearity，第二个把 $TS=ST$ 用 $k$ 次。$S^kh$ 在 $n$ 处的值是 $h[n-k]$，所以

$$y[n]=\sum_kx[k]\,h[n-k]\ \equiv\ (x*h)[n]$$

这个 operation 叫 convolution。令 $m=n-k$，$\sum_kx[k]h[n-k]=\sum_mh[m]x[n-m]$，所以 $x*h=h*x$；写成 operator 是 $T=\sum_mh[m]\,S^m$：一个 convolution 就是 shift 的各个 power 的 weighted sum。Kernel $(1,2,1)/4$ 是 $h[-1]=h[1]=\tfrac14$、$h[0]=\tfrac12$，代进去 $y[n]=\tfrac14x[n+1]+\tfrac12x[n]+\tfrac14x[n-1]$，正是开头那个平均。

Signal 首尾相接、长 $N$ 时，$T$ 是一个 $N\times N$ 的 matrix $C$，$S$ 是 cyclic shift 的 permutation matrix，$e_j$ 是第 $j$ 个位置为 1 的 vector，$e_j=S^je_0$。由 $CS=SC$，

$$Ce_j=C\,S^je_0=S^j\,Ce_0=S^jh$$

第 $j$ 个 column 是第一个 column 往下挪 $j$ 格，挪出底部的从顶部回来。整个 matrix 由一个 column 决定，这样的 matrix 叫 circulant。

::fig[thread-convolution-circulant] 动图：$N=8$、kernel $(1,2,1)/4$ 的 circulant $C$，彩框依次走过每个 column，第 $j$ 个 column 是第一个往下挪 $j$ 格。右边是挪一格的 $S$，$C=\tfrac14S^{-1}+\tfrac12I+\tfrac14S$。

数一数要多少个数。任意的 linear map 是 $N^2$ 个；要求和 $S$ 可交换，只剩一个 column 的 $N$ 个；再要求 $h$ 只在 $|k|\le1$ 处不为零，只剩 3 个。CS231N 给 conv layer 的两条假设就是这两步：parameter sharing 是 shift invariance，local connectivity 是 $h$ 短。那一站的 AlexNet 第一层，只 local、不 share 时有 105,705,600 个 parameter，再 share 是 34,944 个。

### Complex exponential 是每个 convolution 的 eigenvector

取 $v[n]=e^{j\omega n}$。挪一格：$(Sv)[n]=e^{j\omega(n-1)}=e^{-j\omega}\,v[n]$，所以 $v$ 是 $S$ 的 eigenvector，eigenvalue $e^{-j\omega}$；它也是 $S^m$ 的 eigenvector，eigenvalue $e^{-j\omega m}$；于是也是这些 power 的任何 weighted sum 的 eigenvector：

$$h*v=\sum_mh[m]\,S^mv=\underbrace{\Big(\sum_mh[m]\,e^{-j\omega m}\Big)}_{H(\omega)}\,v$$

$H(\omega)$ 叫 frequency response。$m$ 是 integer，$e^{-j(\omega+2\pi)m}=e^{-j\omega m}$，所以 $H$ 以 $2\pi$ 为 period，只需看 $-\pi<\omega\le\pi$。

$(1,2,1)/4$ 的 frequency response：

$$H(\omega)=\tfrac14e^{j\omega}+\tfrac12+\tfrac14e^{-j\omega}=\tfrac12+\tfrac12\cos\omega=\cos^2\tfrac\omega2$$

$H(0)=1$，$H(\tfrac\pi2)=\tfrac12$，$H(\pi)=0$。用它重算开头：$\cos\pi n=(-1)^n=e^{j\pi n}$，条纹是 $x=\tfrac12e^{j0n}+\tfrac12e^{j\pi n}$，

$$h*x=\tfrac12H(0)+\tfrac12H(\pi)\,(-1)^n=\tfrac12$$

三个数管用，是因为它们的 $H$ 在 $\omega=\pi$ 处为零。

$h$ 是 real 的时候，对 $H$ 的定义取 conjugate 得 $H(-\omega)=H(\omega)^*$，于是 $\cos\omega n=\tfrac12e^{j\omega n}+\tfrac12e^{-j\omega n}$ 经过它变成 $|H(\omega)|\cos(\omega n+\angle H(\omega))$，和 EE2023 第 1 站那一行一样。再算一个后面要用的 kernel：central difference $(d*x)[n]=\tfrac12(x[n+1]-x[n-1])$，即 $d[-1]=\tfrac12$、$d[1]=-\tfrac12$，

$$D(\omega)=\tfrac12e^{j\omega}-\tfrac12e^{-j\omega}=j\sin\omega$$

$\omega$ 小时 $D\approx j\omega$，和 continuous time 里 derivative 对应乘 $s=j\omega$（[EE2023 第 4 站](../courses/EE2023.html#laplace)的 derivative property）一致；$\omega$ 接近 $\pi$ 时两者分开，$D(\pi)=0$，因为 $(-1)^n$ 的左右两个邻居相等。

::fig[thread-convolution-eigen] 动图：$\cos\omega n$ 经过 $(1,2,1)/4$，$\omega$ 从 $\tfrac\pi2$ 扫到 $\pi$、回到 0、再回到 $\tfrac\pi2$。空心的点是 input，彩色的点是 output：每个时刻 output 都是同一个 frequency 的 $\cos$，整体乘了右边 curve 上那个数。

**长度为 $N$ 时。** $\omega_k=2\pi k/N$（$k=0,\dots,N-1$）满足 $e^{j\omega_kN}=1$，所以 $e^{j\omega_kn}$ 首尾相接也对得上，是 cyclic shift 的 eigenvector。这 $N$ 个 vector 两两 orthogonal：$k\ne l$ 时 $\sum_{n=0}^{N-1}e^{j(\omega_k-\omega_l)n}$ 是 ratio 为 $r=e^{j2\pi(k-l)/N}\ne1$ 的 geometric series，等于 $\frac{1-r^N}{1-r}=0$。把它们排成 Fourier matrix $F$，第 $n$ 行第 $k$ 列是 $e^{j2\pi nk/N}$。每一个 circulant 都是

$$C=F\,\mathrm{diag}(\hat h_0,\dots,\hat h_{N-1})\,F^{-1},\qquad\hat h_k=H(\omega_k)=\sum_nh[n]\,e^{-j2\pi kn/N}$$

$\hat h$ 是 $h$ 的 DFT。由 orthogonality，$F^*F=NI$，$F^{-1}=\tfrac1NF^*$，所以 $x$ 的 DFT 是 $\hat x=F^*x=NF^{-1}x$。两边乘 $NF^{-1}$：

$$\widehat{h*x}=NF^{-1}Cx=\mathrm{diag}(\hat h)\,NF^{-1}x=\hat h\odot\hat x$$

这是 convolution theorem：在 eigenvector 的 coordinate 里，convolution 是逐个 component 的乘法。MIT 18.065 第 31、32 讲正是这样讲的：circulant 都是 cyclic shift $P$ 的 polynomial，所以共享 eigenvector $F$，$C$ 和 $D$ 相乘时 eigenvalue 相乘。

$N=8$ 的 $(1,2,1)/4$：$\hat h_k=\cos^2(\pi k/8)$，依次是 1、0.854、0.5、0.146、0、0.146、0.5、0.854，加起来是 4，等于 $C$ 的 trace $8\times\tfrac12$。拿 Zhang 的论文 Making Convolutional Networks Shift-Invariant Again（ICML 2019，研究的正是开头第一件事，下面简称 Zhang）Figure 4 的 signal $z=(0,0,1,1,0,0,1,1)$ 核对：$\hat z_0=4$，$\hat z_2=-2+2j$，$\hat z_6=-2-2j$，其余为 0。乘上 $\hat h$，$\hat z_0$ 不变，$\hat z_2$、$\hat z_6$ 减半：mean $\tfrac12$ 不动，period 为 4 的起伏减半，output 应当是 $(0.25,0.25,0.75,0.75,0.25,0.25,0.75,0.75)$。直接算第 2 个：$\tfrac14\cdot0+\tfrac12\cdot1+\tfrac14\cdot1=0.75$；第 0 个的左邻是首尾相接的 $z_7=1$：$\tfrac14\cdot1+\tfrac12\cdot0+\tfrac14\cdot0=0.25$。

[EE2023 第 3 站](../courses/EE2023.html#ft)走的是同一条路，$n$ 换成 continuous 的 $t$：$e^{st}$ 挪 $\sigma$ 只是乘 $e^{-s\sigma}$，所以 $e^{st}\to H(s)e^{st}$，$y=x*h\leftrightarrow Y=HX$。

### 两次 convolution 合成一次：kernel 与 kernel 做 convolution，$H$ 相乘

先过 $h$ 再过 $g$，$e^{j\omega n}$ 先乘 $H(\omega)$ 再乘 $G(\omega)$。合起来仍然 linear、shift-invariant，所以也是一个 convolution；送进 $\delta$，output 是 $g*(h*\delta)=g*h$，这就是它的 kernel，frequency response 是 $G(\omega)H(\omega)$：

$$g*(h*x)=(g*h)*x,\qquad g*h\ \longleftrightarrow\ G\,H$$

$h$ 在 $F_1$ 个相邻位置上不为零、$g$ 在 $F_2$ 个上不为零时，$g*h$ 在 $F_1+F_2-1$ 个上不为零。Strang 在 18.065 第 32 讲把它讲成 polynomial 乘法：$c*d$ 的第 $k$ 项是 exponent 加起来为 $k$ 的那些乘积之和，例子是 $(3+x)(1+2x)=3+7x+2x^2$，两项乘两项得三项。Kernel 也一样：$\big(\tfrac{1+x}2\big)^2=\tfrac{1+2x+x^2}4$，即 $(1,1)/2*(1,1)/2=(1,2,1)/4$。Frequency 一侧，$(1,1)/2$ 的 response 是 $\tfrac12(1+e^{-j\omega})=e^{-j\omega/2}\cos\tfrac\omega2$，square 是 $e^{-j\omega}\cos^2\tfrac\omega2$：$(1,2,1)/4$ 的 response 多乘一个 $e^{-j\omega}$，因为这个 product 从 index 0 开始，比居中的 $(1,2,1)/4$ 晚一格。

后面三处要用它。2D 的 $\tfrac1{16}(1,2,1)^\top(1,2,1)$ 等于先对每个 row 做 $(1,2,1)/4$、再对每个 column 做一次，这是 CS4243 说的 separable。CS4243 的 $\partial_x(g*I)=(\partial_xg)*I$ 是 $d*(g*I)=(d*g)*I$。不带 nonlinearity 的几层 conv 叠起来只是一个 conv，kernel 长 $\sum_l(F_l-1)+1$，这就是 receptive field。

### 隔 $M$ 个取一个：frequency 被折叠

$z[m]=y[Mm]$。$y=e^{j\omega n}$ 时 $z[m]=e^{j\omega Mm}$，frequency 乘了 $M$。$z$ 的 index 也是 integer，只认得 $M\omega$ 除以 $2\pi$ 的余数，所以 $\omega$ 和 $\omega+\tfrac{2\pi}M$ 在 $z$ 里完全一样。$M=2$ 时 $\omega$ 和 $\omega+\pi$ 分不开，只有 $|\omega|<\tfrac\pi2$ 的内容取完之后还认得出来。对 $0\le\omega\le\pi$ 的 $\cos\omega n$，取完之后的 frequency 是 $2\omega$ 折回 $[0,\pi]$：$\omega\le\tfrac\pi2$ 时是 $2\omega$，之后是 $2\pi-2\omega$，$\omega=\pi$ 折到 0。开头的条纹是最后这种。

EE2023 从 continuous time 开始取：$x(t)=e^{j2\pi ft}$，$x(nT_s)=e^{j(2\pi f/f_s)n}$，discrete 的 frequency 是 $\omega=2\pi f/f_s$。6 kHz、$f_s=10$ kHz 给出 $\omega=1.2\pi$，与 $-0.8\pi$ 相同，$0.8\pi$ 对应 $0.8\pi\cdot f_s/2\pi=4$ kHz。$f_s>2B$ 就是 $|\omega|<\pi$；对已经 sample 过的 signal 再隔 $M$ 个取一个，等于以 $f_s/M$ 重新 sample，条件变成 $|\omega|<\pi/M$。

::fig[thread-convolution-fold] 动图：$\cos\omega n$ 隔一个取一个，$\omega$ 在 $0.2\pi$ 和 $\pi$ 之间来回扫。实心点是留下的，空心点是丢掉的；灰线是 $\cos\omega n$，彩线是穿过留下的点、frequency 最低的 $\cos$。$\omega<\tfrac\pi2$ 时两条线重合；过了 $\tfrac\pi2$，右边的 frequency 折回来。静止时 $\omega=0.8\pi$，彩线每 10 个 input、也就是每 5 个留下的点转一圈，即取完之后的 $0.4\pi$。

**挪一格为什么不再是挪一格。** 设 input 里有两个会被折到一起的成分，$a\,e^{j\omega n}+b\,e^{j(\omega-\pi)n}$。Input 挪一格，两项分别乘 $e^{-j\omega}$ 和 $e^{-j(\omega-\pi)}=-e^{-j\omega}$。隔一个取一个之后两项都在 frequency $2\omega$ 上：

$$z[m]=(a+b)\,e^{j2\omega m},\qquad z'[m]=e^{-j\omega}\,(a-b)\,e^{j2\omega m}$$

$b=0$ 时 $z'=e^{-j\omega}z$，只差一个 phase。Frequency 为 $2\omega$ 的成分挪半个 output sample，正是乘 $e^{-j2\omega\cdot\frac12}=e^{-j\omega}$，所以 output 跟着挪了半格，也就是 input 的一格，equivariance 在这个意义下还在。$b\ne0$ 时 magnitude 从 $|a+b|$ 变成 $|a-b|$，形状变了。条纹是 $\omega=0$、$a=b=\tfrac12$：从 1 变成 0。

先过一个 kernel 再取，$b$ 变成 $H(\omega-\pi)\,b$，所以要看 $|H|$ 在 $(\tfrac\pi2,\pi]$ 上有多小。三个常用的 kernel，Zhang 的论文里叫 Rect-2、Tri-3、Bin-5：$(1,1)/2$ 的 $|H|=|\cos\tfrac\omega2|$；$(1,2,1)/4$ 是它的 square；$(1,4,6,4,1)/16=(1,2,1)/4*(1,2,1)/4$ 是它的 4 次 power。

| 被折的成分 $\omega$ | 折到 | Rect-2 | Tri-3 | Bin-5 |
|---|---|---|---|---|
| $\pi$ | $0$ | 0 | 0 | 0 |
| $0.9\pi$ | $0.2\pi$ | 0.156 | 0.024 | 0.0006 |
| $0.8\pi$ | $0.4\pi$ | 0.309 | 0.095 | 0.009 |
| $0.7\pi$ | $0.6\pi$ | 0.454 | 0.206 | 0.042 |
| $0.6\pi$ | $0.8\pi$ | 0.588 | 0.345 | 0.119 |

Kernel 越长挡得越干净，代价是要留下的那一半也被压低：$\omega=\tfrac\pi4$ 处三者分别剩 0.924、0.854、0.729。

:::wrong Average pooling 先求平均再 subsample，已经做过 anti-aliasing
1D 的 average pooling 就是 Rect-2 加隔一个取一个，Zhang 的论文正是这样拆的（AvgPool 等于配 box filter 的 BlurPool）。它确实把 $\omega=\pi$ 压成 0，开头的条纹它处理得了。条纹的 period 是 2.5 个 pixel 时（$\omega=0.8\pi$），它让 31% 的 amplitude 折成一个 $0.4\pi$ 的假 pattern；Tri-3 只让 9.5%，Bin-5 不到 1%。论文的结论是把 box 换成更强的 filter，shift 之后 output 更一致。
:::

:::edge 恰好在 $\omega=\tfrac\pi2$
Zhang 的 $z=(0,0,1,1,0,0,1,1)$ 的起伏在 $\tfrac\pi2$，取完之后落在 output 的 $\pi$ 上，就是 Nyquist 本身。先过 Tri-3 再取，得 $(0.25,0.75,0.25,0.75)$；挪一格之后是 $(0.75,0.25,0.75,0.25)$。Frequency 为 $\pi$ 的 output 挪半格应当是 $\cos\pi(m-\tfrac12)=\sin\pi m$，在 integer 上全是 0，两个 output 都不是对方挪半格的样子。这和 EE2023 第 7 站“恰好等于临界值”是同一件事：边界上的 frequency 总是含糊的，要留余量。
:::

## 各门课里的名字和记号

| 课和站 | 这门课的名字 | input，kernel | 一个 output 怎么算 | kernel 翻不翻 |
|---|---|---|---|---|
| [ST2131 第 6、7 站](../courses/ST2131.html#transform) | independent random variable 之和 | $f_X$，$f_Y$ | $\int f_X(x)f_Y(z-x)\,dx$ | 翻 |
| [MA2214 第 4 站](../courses/MA2214.html#gf) | sequence 的 convolution | $a_k$，$b_k$ | $\sum_ka_kb_{n-k}$ | 翻 |
| [EE2023 第 1、3、7 站](../courses/EE2023.html#lti) | LTI system | $x(t)$，$h(t)$ | $\int x(\tau)h(t-\tau)\,d\tau$ | 翻 |
| [CS4243 第 1 站](../courses/CS4243.html#filter) | correlation $\otimes$ | $I$，kernel $H$ | $\sum H(i,j)\,I(x+i,y+j)$ | 不翻 |
| [CS2109S 第 9 站](../courses/CS2109S.html#nn) | convolution layer | image，filter | 逐个 entry 相乘再求和 | 不翻 |
| [CS231N 第 2、3 站](../courses/STANFORD-CS231N.html#conv) | conv layer | $X$，$W_k$ | $\sum W_k[u][v][c]\,X[Si+u][Sj+v][c]$ | 不翻 |
| [Z2H 第 5 站](../courses/KARPATHY-Z2H.html#wavenet) | dilated causal convolution | $(B,T,C)$，Linear | 相邻两组拼起来乘 weight | 不翻 |
| [CMU-10714 第 6 站](../courses/CMU-10714.html#models) | conv op | $Z$，$W$ | im2col 之后一次 matmul | backward 翻 |
| [CS149 第 5、8 站](../courses/STANFORD-CS149.html#special) | `convolve`；一串 matmul | `input`，`weight` | $K^2$ 次 shift 加 matmul | 不翻 |
| [CS249R 第 3 站](../courses/HARVARD-CS249R.html#kernel) | im2col | $X_{\text{col}}$，$W_{\text{row}}$ | $X_{\text{col}}W_{\text{row}}$ | 不翻 |
| [MIT 6.5940 第 1、5、7 站](../courses/MIT-6.5940.html#eff) | conv、depthwise、pointwise | feature map，kernel | MACs 的 formula | 不翻 |

骨架里的 $x$ 是 input 那一列的第一个，$h$ 是第二个；“kernel 翻不翻”说的是一个 output 的写法里 kernel 的 index 和 input 的 index 是反向走还是同向走。Frequency 一侧只有前三门课有：ST2131 的 MGF $M_X(t)$、MA2214 的 generating function、EE2023 的 $H(f)$ 和 $H(s)$，下一节说这三个是同一个东西；后面各课都只在 position 一侧算。

同一个字母在不同课里指不同的东西。CS4243 的 $H$ 是 kernel 本身，EE2023 的 $H$ 是 frequency response；CS231N 的 $W$ 既是 input 的宽又是 weight；kernel 的大小在 CS231N 叫 $F$，在 CS249R、CMU-10714 叫 $K$，在 MIT 6.5940 叫 $k$。CS2109S、CS231N 和 PyTorch 叫 convolution 的，按 EE2023 和 CS4243 的定义是 correlation，下面 CS4243 一节说差在哪。

## ST2131 与 MA2214：density 和 coefficient 的 convolution

[ST2131 第 6 站](../courses/ST2131.html#transform)：$X$、$Y$ independent，$Z=X+Y$ 的 density 是 $f_Z(z)=\int f_X(x)f_Y(z-x)\,dx$。$X=x$ 时 $Z$ 的 density 是把 $f_Y$ 挪到 $x$，再以 $f_X$ 为 weight 加起来，正是骨架里“input 拆成挪过的 impulse，每个留下一份挪过的 $h$”，input 的位置是 $f_X$，kernel 是 $f_Y$。[MA2214 第 4 站](../courses/MA2214.html#gf)：两个 generating function 相乘，$x^n$ 的 coefficient 是 $\sum_ka_kb_{n-k}$。两门课在 frequency 一侧各有一个把 convolution 变成乘法的 transform，名字不同。

**MGF 是 $s=-t$ 处的 Laplace transform。** [ST2131 第 7 站](../courses/ST2131.html#limit)的 $M_X(t)=E[e^{tX}]=\int f_X(x)\,e^{tx}\,dx$，和 EE2023 的 $H(s)=\int h(\sigma)\,e^{-s\sigma}\,d\sigma$ 只差 exponent 的符号。$M_{X+Y}=M_XM_Y$ 就是 $Y(s)=H(s)X(s)$，代 $t=-j2\pi f$ 就是 Fourier transform 的 $Y(f)=H(f)X(f)$。两边各算一遍 Uniform(0,1)。ST2131 一侧：

$$M_U(t)=\int_0^1e^{tx}\,dx=\frac{e^t-1}{t}$$

EE2023 一侧，这个 density 是 $\mathrm{rect}(t-\tfrac12)$，第 3 站的 time shift 那一行给出 spectrum $\mathrm{sinc}(f)\,e^{-j\pi f}$。把 $t=-j2\pi f$ 代进 MGF：

$$\frac{e^{-j2\pi f}-1}{-j2\pi f}=e^{-j\pi f}\cdot\frac{e^{-j\pi f}-e^{j\pi f}}{-j2\pi f}=e^{-j\pi f}\cdot\frac{-2j\sin\pi f}{-j2\pi f}=e^{-j\pi f}\,\mathrm{sinc}(f)$$

两边相同；$f=\tfrac12$ 时都是 $-0.6366j$。所以 ST2131 第 6 站算出的 $U+V$ 的 triangle density 就是 EE2023 的 $\mathrm{rect}*\mathrm{rect}$，spectrum 是 $\mathrm{sinc}^2(f)\,e^{-j2\pi f}$；ST2131 第 7 站用 $\big(\frac{\lambda}{\lambda-t}\big)^n$ 认出 Gamma、“没有做一次 convolution”，用的就是 convolution theorem。

**Generating function 是 unit circle 上的 $H$。** 骨架的 $H(\omega)=\sum_kh[k]\,e^{-j\omega k}$ 就是 generating function $\sum_kh_kx^k$ 在 $x=e^{-j\omega}$ 处的值。MA2214 的“product 对应 convolution”和 convolution theorem 是同一个 identity，前者把 $x$ 当记号，后者把 $x$ 放在 unit circle 上。那一站 $(1+x+x^2+x^3+x^4)^2$ 的 coefficient 1、2、3、4、5、4、3、2、1，是两个 5 面 die 之和的 distribution 乘 25，形状正是 ST2131 的 triangle。

## EE2023：continuous time，以及只看 $h$ 能回答的问题

[EE2023 第 1 站](../courses/EE2023.html#lti)在 continuous time 里做骨架的推导：把 $x(t)$ 切成宽 $\Delta$ 的窄 pulse，每个留下 $x(k\Delta)\,\Delta\,h(t-k\Delta)$，$\Delta\to0$ 得 integral。它加上的是两个只看 $h$ 就能回答的问题：causal 当且仅当 $h(t)=0$（$t<0$），BIBO stable 当且仅当 $\int|h|<\infty$。Discrete 的版本一字不改：$n<0$ 时 $h[n]=0$，$\sum|h[n]|<\infty$。CNN 的 kernel 只有有限个 entry，一定 stable；WaveNet 要的 causal 就是这个条件，见下面 Z2H 一节。

那一站的 RC circuit $h(t)=e^{-t}u(t)$ 永远不为零，conv layer 装不下。每隔 $T$ 取一次 sample，convolution sum 是 $y[n]=T\sum_{k\le n}x[k]\,e^{-(n-k)T}$。把 $k=n$ 那一项拆出来，剩下的每一项都多一个 factor $e^{-T}$，加起来正是 $e^{-T}y[n-1]$：

$$y[n]=e^{-T}\,y[n-1]+T\,x[n]$$

这是一个 scalar 的 linear RNN，一个 weight 就表示了无穷长的 kernel $T\,e^{-nT}$。一般地 $y[n]=a\,y[n-1]+x[n]$ 的 impulse response 是 $a^n$：$a=0.9$ 时 $\sum|h|=10$，stable；$a=1.1$ 时 $h[50]=117$，一直涨。[CMU-10714 第 6 站](../courses/CMU-10714.html#models)的 RNN 里 hidden state 的 norm 在 200 步内涨到 $10^6$ 量级或缩到 $10^{-19}$ 量级，是同一笔账：每一步乘一次 $W_{hh}$，乘的数稍大于 1 或稍小于 1，都会被乘上几百次。[EE2023 第 5 站](../courses/EE2023.html#pz)说 pole 在 left half-plane 时 mode decay：RC circuit 的 pole 是 $-1$，取 sample 后 $a=e^{-T}<1$；pole 在 right half-plane 时 $a>1$，就是 $a=1.1$ 这一类。EE3731C（Signal Analytics）和 EE4212（Computer Vision）也在这条线上，那两页还没写。

## CS4243：kernel 把 noise 压掉多少

[CS4243 第 1 站](../courses/CS4243.html#filter)把骨架搬到 2D，加上了 noise 和 edge。它有两个结论，换到 frequency 一侧是课程页上没有的两个 identity。

**Noise factor 就是 Parseval。** CS4243 算的是：independent、variance 为 $\sigma^2$ 的 noise 经过 weight 为 $w_i$ 的 weighted sum，variance 变成 $\sigma^2\sum_iw_i^2$。EE2023 第 3 站的 energy 一节说 $\int|x|^2dt=\int|X|^2df$。Discrete 的版本：

$$\sum_n|h[n]|^2=\frac1{2\pi}\int_{-\pi}^{\pi}|H(\omega)|^2\,d\omega$$

证明只要把 $|H|^2=\sum_m\sum_kh[m]\,h[k]^*\,e^{-j\omega(m-k)}$ 代进去，$e^{-j\omega(m-k)}$ 在一个 period 上的 integral 在 $m=k$ 时是 $2\pi$，否则是 0。所以 filter 之后 noise 的 variance 是 $\sigma^2$ 乘 $|H|^2$ 在所有 frequency 上的平均：independent 的 noise 在每个 frequency 上一样多，filter 在每个 frequency 上留下 $|H(\omega)|^2$ 那么多。

两边各算一遍。$(1,2,1)/4$：$\sum h^2=\tfrac1{16}+\tfrac4{16}+\tfrac1{16}=0.375$；frequency 一侧 $|H|^2=\big(\tfrac{1+\cos\omega}2\big)^2=\tfrac14(1+2\cos\omega+\cos^2\omega)$，一个 period 上 $\cos\omega$ 平均为 0、$\cos^2\omega$ 平均为 $\tfrac12$，平均是 $\tfrac14\times1.5=0.375$。2D 的 kernel 是两个方向的 product，$\sum w^2$ 也是 product，$0.375^2=0.1406$，square root 是 0.375，正是 CS4243 那一站的 $\sqrt{36/256}$。Central difference：$\sum d^2=\tfrac12$；$|D|^2=\sin^2\omega$，平均 $\tfrac12$。$\sigma=2$ 时 noise 的 standard deviation 是 $2/\sqrt2=1.41$，和那一站的数一样。

**为什么 derivative 之前必须 smooth。** 那一站的 scanline 上，edge 在 10 个 pixel 内从 10 升到 30，它的内容几乎全在很低的 frequency。Central difference 在 $\omega\to0$ 时 $D\approx j\omega$，对 slope 的 response 是对的；可 $|D|=|\sin\omega|$ 在 $\omega=\tfrac\pi2$ 处最大，等于 1，那里 edge 几乎没有内容，noise 却和别处一样多。那一站 $\sigma=2$、17 个 tap 的 derivative of Gaussian 也 normalize 成对 unit slope 的 ramp 输出 1，所以 $\omega\to0$ 时同样约等于 $j\omega$；它的 $|W(\omega)|$ 在 $\omega=0.50$（约 $1/\sigma$）处到最大值 0.30，之后很快落到接近 0。$|W|^2$ 的平均是 0.0176，square root 是 0.133，和那一站的 noise factor 相同；noise 从 1.41 降到 0.27。两个 kernel 对 edge 给出同样的 slope，差别全在 edge 用不到的高 frequency 上。

::fig[thread-convolution-noise] 左边是 kernel 本身，右边是 $|H(\omega)|^2$。虚线是 $|H|^2$ 的平均，它下面的 area 等于 curve 下的 area，也等于左边 weight 的 square 之和，就是 noise 的 variance 缩小的倍数。第二行 central difference 的 $|D|^2=\sin^2\omega$ 在 $\tfrac\pi2$ 处最大；第三行 derivative of Gaussian 只留下 $|\omega|<1$ 附近，三行的纵轴比例相同。

**Correlation 与 convolution 差一个 conjugate。** CS4243 的 `:::wrong` 说两者差一次翻转。Correlation $\sum_kw[k]\,x[n+k]$ 是和 $\tilde w[n]=w[-n]$ 的 convolution，而

$$\tilde W(\omega)=\sum_nw[-n]\,e^{-j\omega n}=\sum_mw[m]\,e^{j\omega m}=W(\omega)^*\qquad(w\text{ real})$$

Magnitude 不变，phase 反号。Gaussian 这种 symmetric kernel 的 $H$ 是 real，翻不翻一样；Sobel 的一行 $(-1,0,1)$ 是 antisymmetric 的，当作 index 为 $-1,0,1$ 的 convolution kernel 时 $H(\omega)=-e^{j\omega}+e^{-j\omega}=-2j\sin\omega$，翻转后是 $2j\sin\omega$，处处差一个负号，这就是那一站 correlation 得 $+160$、convolution 得 $-160$ 的原因。同一个 conjugate 在下面 CMU-10714 的 backward 里还会出现。

## CS2109S 与 CS231N：conv layer、stride 与 receptive field

[CS2109S 第 9 站](../courses/CS2109S.html#nn)从 parameter 的个数讲起：200×200 的彩色 image，一个 fully connected 的 hidden unit 就要 120,000 个 weight，local connectivity 加 parameter sharing 之后，16 个 3×3 的 filter 只要 448 个。[CS231N 第 2 站](../courses/STANFORD-CS231N.html#conv)加上 stride、padding 和 channel，[第 3 站](../courses/STANFORD-CS231N.html#arch)加上 receptive field 和 ResNet。

**Stride 是先按 stride 1 算，再隔 $S$ 个取一个。** CS231N 的 $\text{out}[i]=\sum_uW[u]\,X[Si+u]$ 恰好是 stride 1 时第 $Si$ 个 output。所以 stride 2 的 conv 是 conv 加隔一个取一个，骨架的最后一节整个适用；那一站的 translation equivariance 是在 stride 1 下说的。Max pooling 同样可以拆开：Zhang 把 $\text{MaxPool}$ 写成 stride 1 的 max 再 subsample，前一半对 shift 一视同仁，破坏 equivariance 的是后一半。他的 Figure 4：$z=(0,0,1,1,0,0,1,1)$ 做 2×2、stride 2 的 max pooling 得 $(0,1,0,1)$，挪一格之后得 $(1,1,1,1)$。拆开做：stride 1 的 max 是 $m=(0,1,1,1,0,1,1,1)$，过 Tri-3 是 $(0.5,0.75,1,0.75,0.5,0.75,1,0.75)$，取 index 为 even 的位置得 $(0.5,1,0.5,1)$；挪一格的那个得 $(0.75,0.75,0.75,0.75)$。论文只说过了一个 low-pass filter，用 Tri-3 正好算出它的这两组数。两者仍不相同（$z$ 的起伏在 $\tfrac\pi2$，见上面的 edge），但近了很多。为什么 blur 要放在 max 之后：$z$ 本身没有 $\omega=\pi$ 的成分，$\sum_n(-1)^nz_n=0$；max 是 nonlinear 的，$\sum_n(-1)^nm_n=-2$，它造出了一个 $\omega=\pi$ 的成分，subsampling 时正好折到 0，这就是 max pooling 的 output 从 $(0,1,0,1)$ 跳到 $(1,1,1,1)$ 的来源。Tri-3 的 $H(\pi)=0$ 把它压掉：过完 Tri-3 的那一行 $b=(0.5,0.75,1,0.75,\dots)$ 满足 $\sum_n(-1)^nb_n=0$。

整个 network 的 stride 是各层的乘积。ResNet-50 的 conv1、max pool 和后三段的第一个 block 各 stride 2，共 $2^5=32$：input 挪 32 的整数倍时（不计边界），最后的 feature map 精确地挪相应的格数；挪别的距离，就要看 aliasing 有多少。Zhang 在 VGG16 和 ResNet50 里每次 subsampling 之前都插入 Bin-5，在 ImageNet 上量 consistency（同一张 image 随机挪两次，top-1 class 相同的 probability）：VGG16 从 88.52% 升到 90.19%，accuracy 从 71.59% 升到 72.33%；ResNet50 从 89.20% 升到 91.31%，accuracy 从 76.16% 升到 77.04%。EE2023 的 anti-aliasing filter 在这里不但没有损失 accuracy，还提高了它。

**Receptive field 是合起来那个 kernel 的长度，stride 变成 dilation。** CS231N 第 3 站的 recurrence 是

$$r_l=r_{l-1}+(F_l-1)\,j_{l-1},\qquad j_l=j_{l-1}S_l$$

它可以从骨架推出来。先隔一个取一个、再和 $g$ 做 convolution：

$$\sum_kg[k]\,y[2(m-k)]=\sum_kg[k]\,y[2m-2k]=\sum_ng_{\uparrow2}[n]\,y[2m-n],\qquad g_{\uparrow2}[2k]=g[k],\ g_{\uparrow2}[\text{odd}]=0$$

等于先和 $g_{\uparrow2}$（$g$ 的 tap 之间各插一个 0）做 convolution、再隔一个取一个。用这个 identity 把所有 subsampling 都推到最后，第 $l$ 层的 kernel 在 input 上相当于 tap 之间相隔 $j_{l-1}$ 的 kernel，覆盖 $(F_l-1)j_{l-1}+1$ 个位置。骨架第三节说两个 kernel 做 convolution 时长度相加再减 1，于是 $r_l=r_{l-1}+(F_l-1)j_{l-1}$。那一站的例子：3 的 conv、$F=2,S=2$ 的 pool、两层 3 的 conv。把 pool 换成 average（kernel $(1,1)$）、weight 全取 1，合起来的 kernel 是

$$(1,1,1)*(1,1)*(1,0,1,0,1)*(1,0,1,0,1)=(1,2,4,5,7,8,8,7,5,4,2,1)$$

长 12，就是那一站算出的 receptive field。12 个 pixel 的 weight 从 1 到 8 不等，下一节说为什么。

## 叠很多层之后是一个 Gaussian

CS231N 第 3 站的 `:::edge` 引了 Luo 等人的 effective receptive field：理论上的 receptive field 随层数 $n$ linear 地增长，真正起作用的部分只按 $\sqrt n$ 增长，形状接近 Gaussian。这是 ST2131 的 central limit theorem。

取 $L$ 层 $(1,1,1)/3$。合起来的 kernel 是它和自己做 $L$ 次 convolution；按 ST2131 第 6 站，它就是 $L$ 个 independent、uniform 地取 $-1,0,1$ 的 random variable 之和的 PMF。每个的 variance 是 $\tfrac13(1+0+1)=\tfrac23$，所以 $L$ 层之后 standard deviation 是 $\sqrt{2L/3}$，而 kernel 的长度是 $2L+1$。按 [ST2131 第 7 站](../courses/ST2131.html#limit)的 CLT，$L$ 大时它是 Gaussian。Luo 等人的 Section 2 正是这样推的：他们把 $n$ 层 kernel 的 frequency 一侧写成 $\big(\sum_me^{-j\omega m}\big)^n$，output 是展开式里 $e^{-j\omega t}$ 的 coefficient（MA2214 的 generating function），weight 为正且加起来是 1 时它等于 $P(S_n=t)$，再用 CLT；weight 都是 $1/k$ 时 standard deviation 是 $\sqrt{n(k^2-1)/12}$，$k=3$ 时就是 $\sqrt{2n/3}$。

| 层数 $L$ | 1 | 2 | 5 | 10 |
|---|---|---|---|---|
| receptive field $2L+1$ | 3 | 5 | 11 | 21 |
| standard deviation | 0.82 | 1.15 | 1.83 | 2.58 |
| $2\sigma$ 占 receptive field 的比例 | 0.54 | 0.46 | 0.33 | 0.25 |

::fig[thread-convolution-erf] 动图：$L$ 从 1 加到 10，每一格 input pixel 的高度是它在合起来那个 kernel 里的 weight。外面的括号是 receptive field，$2L+1$ 格；彩色的括号是 $\pm\sigma$。虚线是同样 variance 的 Gaussian。

:::wrong Receptive field 是 21 个 pixel，这 21 个 pixel 对 output 的影响差不多
10 层之后，中间那个 pixel 的 weight 是 0.152，最边上的是 $1.7\times10^{-5}$，差约 9000 倍；$\pm\sigma$（$\pm2.58$ 个 pixel）里集中了 66% 的 weight。Receptive field 只说明哪些 pixel 有可能影响 output：中间的 pixel 有很多条 path 通到 output，边上的只有一条。CS231N 那一站引的 CamVid 例子，理论值 505，训练开始时有效的直径约 100。
:::

CS4243 的 Gaussian kernel 是同一个 CLT 的另一头。$(1,2,1)/4$ 是两次 fair coin 里正面个数的 PMF，Binomial$(2,\tfrac12)$，variance $\tfrac12$；$(1,4,6,4,1)/16$ 是 Binomial$(4,\tfrac12)$，variance 1。拿它和 $N(0,1)$ 在 $-2,\dots,2$ 上的 density 比：0.0625、0.25、0.375 对 0.054、0.242、0.399，已经很近。两个 independent Gaussian 之和仍是 Gaussian、variance 相加，[CS5788 第 6 站](../courses/CORNELL-CS5788.html#diff)用 convolution 配方证过；所以 $\sigma_1$ 的 blur 接 $\sigma_2$ 的 blur 等于一次 $\sqrt{\sigma_1^2+\sigma_2^2}$ 的 blur。Diffusion 的 forward process 往 data 上加 Gaussian noise，在 density 上就是和 Gaussian 做 convolution（[MIT 6.S978 第 6 站](../courses/MIT-6.S978.html#diff)），还是 ST2131 的“independent 之和的 density 是 convolution”。

**3D Gaussian Splatting 的 0.3。** [CMU-16825 第 6 站](../courses/CMU-16825.html#gs)：投到 image 上之后，给 $\Sigma'$ 的每个 diagonal entry 加 0.3。原作者的 rasterizer 在这一行的注释是 low-pass filter，让每个 Gaussian 至少一个 pixel 宽。按上一段，对一个 normalized 的 Gaussian density，$\Sigma'+0.3I$ 正好是它和 $N(0,0.3I)$ 的 convolution：在 pixel center 上 sample 之前先 lowpass，就是 EE2023 的 anti-aliasing filter。这个 filter 的 $\sigma=\sqrt{0.3}=0.55$ pixel；那一站说它相当于“一个 pixel 大小的 box filter”，按 variance 算，宽一个 pixel 的 box 的 variance 只有 $\tfrac1{12}=0.083$，0.3 要宽得多。它在 Nyquist（每 pixel 0.5 个 cycle）处的 response 是 $e^{-2\pi^2\cdot0.3\cdot0.25}=0.23$。还要注意 rasterizer 里的 Gaussian 没有 normalize，peak 始终是 opacity，所以严格地说这一步把 footprint 撑大了，它下面的 integral 并不守恒。

## KARPATHY-Z2H：WaveNet 的 dilation

[Z2H 第 5 站](../courses/KARPATHY-Z2H.html#wavenet)把 8 个 character 两两合并、三层合成一个 node，并指出这是 WaveNet 的 dilated causal convolution：kernel 大小 2，dilation 1、2、4，receptive field 8；论文里 dilation 一直翻倍到 512，receptive field 1024。

两种写法正好是上一节那个 identity 的两边。Z2H 的 tree 每层把相邻两组拼起来乘同一个 weight，是 kernel 2、stride 2 的 conv，每层之后 subsample；把 subsampling 都推到最后，第二层的 kernel 在 input 上相隔 2，第三层相隔 4，就是 dilation 2、4 的 conv，最后隔 8 个取一个。WaveNet 不做最后的 subsampling，每个位置都算，于是相邻位置共用中间结果，这就是那一站说的 tree 每个位置要 7 个 node、conv 只要 3 个。Receptive field 用 CS231N 的 recurrence，$j$ 换成 dilation：$1+1\cdot1+1\cdot2+1\cdot4=8$；dilation 到 512 时 $1+(1+2+\cdots+512)=1024$。

Dilation 在 frequency 一侧是 $g_{\uparrow d}$ 的 response：

$$G_{\uparrow d}(\omega)=\sum_kg[k]\,e^{-j\omega dk}=G(d\omega)$$

把 $G$ 压窄 $d$ 倍，在 $(-\pi,\pi]$ 里重复 $d$ 次。Weight 都取 1 时，dilation 2 的那一层是 $1+e^{-j2\omega}$，在 $\omega=\tfrac\pi2$ 处为 0：period 为 4 的 input $(1,0,-1,0,\dots)$ 经过它，$x[n]+x[n-2]$ 处处是 0，这一层单独看不见 period 4 的 pattern。三层合起来是

$$(1+x)(1+x^2)(1+x^4)=(1+x+x^2+x^3)(1+x^4)=1+x+x^2+\cdots+x^7$$

（$x=e^{-j\omega}$）：一个 8 个 tap 的 box，每个 input 恰好一条 path。用 MA2214 的话说，每个 $0\le n\le7$ 的 binary 写法唯一，所以每个 coefficient 都是 1。真正的 WaveNet 每层是 matrix 加 gated nonlinearity，这里只是它的 linear 骨架。

Causal 是 EE2023 那个条件：$y[n]=g_0x[n]+g_1x[n-d]$ 的 kernel 只在 0 和 $d\ge0$ 处不为零，output 不依赖未来。

::fig[thread-convolution-dilate] 左边是 dilation 1、2、4 的三层。彩线是 $y[14]$ 依赖的 path，8 个 input 各一条；灰线是 $y[12]$ 的，深色的 node 两者共用。右边是 dilation 2 那一层单独遇到 period 4 的 input：每个 output 都是 $x[n]+x[n-2]=0$。

## CMU-10714：backward 是 transpose，transpose 是 flip

[CMU-10714 第 6 站](../courses/CMU-10714.html#models)把 1D 的 $y_i=\sum_kw_kx_{i+k}$（$x\in\mathbb R^5$，$w=(w_0,w_1,w_2)$）写成 $y=Wx$，$W$ 的每个 row 是 $w$ 往右挪一格，于是 $\bar x=W^\top\bar y$，并发现 $W^\top$ 的 row 把 kernel 倒过来读。在骨架里：forward 是和 $w$ 的 correlation，response 是 $W(\omega)^*$（上面 CS4243 一节）；transpose 把每个 entry 对调到 diagonal 另一侧，对 real 的 matrix 而言，circulant 的 transpose 就是把 $h[n]$ 换成 $h[-n]$，response 再取一次 conjugate，变回 $W(\omega)$。所以 backward 是和 $w$ 本身做真正的 convolution，output 的长度是 $3+3-1=5$。用 MA2214 的 product 核对那一站的数，$w=(1,2,3)$、$\bar y=(1,0,2)$：

$$(1+0\,x+2x^2)(1+2x+3x^2)=1+2x+3x^2+2x^2+4x^3+6x^4=1+2x+5x^2+4x^3+6x^4$$

coefficient $(1,2,5,4,6)$，和那一站直接乘 $W^\top$、以及“补 0 再用倒过来的 kernel 滑一遍”得到的相同。

::fig[thread-convolution-backward] 左边是 $W$（3×5），每个 row 是 kernel $(1,2,3)$ 往右挪一格；中间是 $W^\top$，第 3 个 row 从左往右读是 3、2、1。右边是同一件事的 polynomial 写法：$\bar y$ 的每个 entry 留下一份挪过的 kernel，按 column 加起来就是 $\bar x$。

Stride 大于 1 时，forward 是 stride 1 的 conv 再 subsample。Subsampling 的 transpose 是在 entry 之间插 0：$\langle y_{\downarrow2},z\rangle=\sum_my[2m]\,z[m]=\langle y,z_{\uparrow2}\rangle$，$z_{\uparrow2}$ 在 index $2m$ 处放 $z[m]$、odd 的 index 上放 0。所以 backward 先把 `out_grad` dilate，再做 stride 1 的 backward，正是 hw4 handout 的做法。

:::wrong Transposed convolution 把 convolution 撤销，还原出原来的 input
Transposed convolution 有时被叫作 deconvolution，名字容易让人这样想。拿开头的条纹试：$(1,2,1)/4$ 把 $(1,0,1,0,\dots)$ 变成处处 $\tfrac12$；对 $\tfrac12$ 再乘 $C^\top$（symmetric kernel，$C^\top=C$），还是处处 $\tfrac12$，条纹回不来。Transpose 在每个 frequency 上乘 $H(\omega)^*$，inverse 要乘 $1/H(\omega)$；$H(\pi)=0$，inverse 根本不存在，transpose 则把 $\omega=\pi$ 又压了一次。Backward 要的是 transpose，它把 gradient 按 forward 时的 weight 分回去，不负责还原。
:::

## CS149、CS249R 与 MIT 6.5940：把 convolution 算出来

三门课给出三种算法，都是骨架里的某一行。[CS249R 第 3 站](../courses/HARVARD-CS249R.html#kernel)和 CMU-10714 的 im2col 是 $y=\hat Xw$：$\hat X$ 的每个 row 是一个 window，是用 data 搭的 Toeplitz matrix，代价是每个 pixel 被复制最多 $K^2$ 次（CS249R 的 4.72 MB 对 0.52 MB）。[CS149 第 8 站](../courses/STANFORD-CS149.html#special)的 A4 写法

```
for i in range(K):
    for j in range(K):
        output += matmul(transpose(weight[i, j]), shift(input, (i, j)))
```

是骨架第一节的 $T=\sum_mh[m]\,S^m$ 原样照搬：$S^m$ 是 `shift`，$h[m]$ 从一个数换成一个 $C_{in}\times C_{out}$ 的 matrix，$K^2$ 次 matmul，不复制 input。[CS149 第 5 站](../courses/STANFORD-CS149.html#gpu)的 `convolve` 直接按定义算，3 点平均。

### 切块要多读一圈：halo

一块连续的 $B$ 个 output，要用到 input 上 $B+R-1$ 个位置，$R$ 是合起来那个 kernel 的长度，即 receptive field：第一个 output 用 $R$ 个，之后每多一个 output 多用一个 input。三门课各遇到一次，数都对得上这一个式子。

- CS149 的 `convolve`：$R=3$，一个 block 128 个 output，读 $128+2=130$ 个 input 进 shared memory，多 1.6%。
- CS149 第 8 站 Halide 的 3×3 box blur：纵向 $R=3$，每块 16 行 output 要 18 行 `blurx`，第一遍多算 12.5%（那一站的 $34/16$ 把两遍都算在内）。
- [MIT 6.5940 第 7 站](../courses/MIT-6.5940.html#mcu)的 MCUNetV2：三层 3×3、stride 1，$R=1+3\times2=7$，output 上 28×28 的 patch 要 input 上 $34\times34$，2D 是 $(34/28)^2=1.47$；14×14 要 $20\times20$，2.04。

Block 越小，同时在 memory 里的东西越少，重复算的比例 $\big((B+R-1)/B\big)^2$ 越大。MCUNetV2 后来把 patch 段的 receptive field 缩小，overhead 从 10% 降到 3%，动的正是这个 $R$。DSP 里用 FFT 分块算长 signal 的 overlap-save 也是这个式子：每块留 $K-1$ 个和上一块重叠的 sample。

::fig[thread-convolution-halo] 动图：三层 kernel 3 的 conv，从上往下追一块 4 个 output 依赖的范围，每往下一层两边各多一格，到 input 是 10 个。然后这块往右挪 4 格：两块的 input 重叠 6 个，这 6 个被读、被算两次。

### Frequency 一侧的 conv layer，以及为什么不用 FFT

Multi-channel 的 conv 是 $y_o=\sum_ch_{oc}*x_c$。在每个 $\omega$ 上，$Y_o(\omega)=\sum_cH_{oc}(\omega)\,X_c(\omega)$：conv layer 在每个 frequency 上是一个 $C_{out}\times C_{in}$ 的 matrix 乘 vector。CS231N 的 1×1 conv 是这个 matrix 不随 $\omega$ 变；6.5940 第 5 站的 depthwise conv 是这个 matrix 在每个 $\omega$ 上都是 diagonal；depthwise-separable 是一个固定的 matrix 乘一个随 $\omega$ 变的 diagonal matrix，只能表示这种 factor 形式的 response。[MIT 6.5940 第 5 站](../courses/MIT-6.5940.html#nas)的 128 进 128 出、3×3：regular 有 $128\times128\times9=147{,}456$ 个 weight，separable 是 $128\times9+128\times128=17{,}536$ 个，比值 8.41，和那一站的 MACs 之比 $1/(\tfrac1{128}+\tfrac19)$ 相同。

Convolution theorem 说 convolution 可以换成 DFT、逐个相乘、inverse DFT。Strang 在 18.065 第 32 讲的账：两个长 $N$ 的 vector 直接做 convolution 约 $N^2$ 次乘法，走 FFT 约 $2N\log_2N+N$ 次。Kernel 只有 $K$ 个 tap 时直接算是 $NK$ 次，按这个粗算，$K>2\log_2N+1$ 时 FFT 才划算，$N=1024$ 时是 21。CNN 的 kernel 是 3。Channel 多时 transform 的成本可以摊薄，剩下逐个 frequency 的 matrix 乘法：每个 pixel、每对 $(o,c)$，直接算是 $K^2$ 次 real multiply-add，frequency 一侧是一次 complex 乘法，即 4 次 real 乘法；就算 transform 不花时间，3×3 最多省到 $\tfrac49$，1×1 一点也不省。Kernel 的 spectrum 还要铺满整个 feature map：128 对 128 个 channel、56×56，是 $128\times128\times56\times56=5.1\times10^7$ 个 complex number，complex64 存要 411 MB，用 real FFT 省掉一半也要 213 MB，而 spatial 的 weight 只有 0.59 MB。另外 DFT 对应的是首尾相接的 circulant，算普通 convolution 要先补 0，否则 image 的左右边缘会互相渗进去（CS4243 那一站 zero padding 造出假 edge 是同一类边界问题）。所以 CS249R、CS149、CMU-10714 都把 3×3 conv 变成 GEMM。

:::from
骨架的论证顺序是为这条线安排的：shift invariance 推出 convolution 是 EE2023 第 1 站推导的 discrete、matrix 写法；circulant 与 cyclic shift 可交换、共享 Fourier matrix 这组 eigenvector、convolution rule、polynomial 乘法、$(3+x)(1+2x)$ 的例子、直接做 convolution 与走 FFT 的乘法次数，来自 MIT 18.065 [第 31 讲](https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-31-eigenvectors-of-circulant-matrices-fourier-matrix/)和[第 32 讲](https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-32-imagenet-is-a-cnn-the-convolution-rule/)的逐字稿（经抓取工具读到的是逐段转述；第 31 讲的逐字稿里没有“eigenvalue 等于 $F$ 乘第一个 column”这句，它出自 lecture 页面的 summary）。Zhang, [Making Convolutional Networks Shift-Invariant Again](https://arxiv.org/abs/1904.11486)（ICML 2019）读了 3.1、3.2 节和 ImageNet 的结果：shift-equivariance 与 periodic-N 的定义、MaxPool、strided conv、AvgPool 的拆法、Rect-2、Tri-3、Bin-5、Figure 4 的 $(0,0,1,1,0,0,1,1)$ 及其四个 output、consistency 的定义、VGG16 与 ResNet50 的四组数（读到的是逐段转述，没有核对 filter 的 normalization）。Luo 等, [Understanding the Effective Receptive Field](https://arxiv.org/pdf/1701.04128) 读了 Section 2（uniform weight、$(\sum e^{-j\omega m})^n$ 的 coefficient、$P(S_n=t)$ 与 CLT、$\sqrt{n(k^2-1)/12}$）。[ResNet 论文](https://arxiv.org/pdf/1512.03385) 3.3 节核对了 option B 的 1×1 projection 与 stride 2、Table 1 的各个 stride。3D Gaussian Splatting 的 0.3 与“low-pass filter”的注释、alpha 用不 normalize 的 Gaussian，核对的是 graphdeco-inria/diff-gaussian-rasterization 仓库 `cuda_rasterizer/forward.cu` 的源码。其余各课的说法和数字取自所链接的课程页。各座桥的对应和全部数字（circulant 的 eigenvalue、Zhang 例子的 DFT、leak 表、Parseval 的两边、derivative of Gaussian 的 response、MGF 与 sinc、composite kernel、ERF 表、backward 的 polynomial、halo、FFT 的 memory）是自己推导、用 numpy 实算的。凭自己的知识写、没有找原文核对的：discrete Parseval 与“subsample 之后和 $g$ 做 convolution，等于和 $g_{\uparrow2}$ 做 convolution 之后再 subsample”这两个 identity（推导写在正文里），RC circuit 取 sample 得到的 recursion，transposed convolution 又叫 deconvolution，overlap-save，以及 FFT 方案在 channel 多时的成本分析。
:::
