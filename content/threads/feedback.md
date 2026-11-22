---
title: 绕回来的信号
lead: "把 output 量回来去改 input。从一个 motor 的 current loop 推出 1/(1+L)、closed-loop pole 和 delay margin，再用同一个 loop 去读 PID 与 sampling、Lyapunov、gene 的 negative autoregulation 与 toggle switch、multiplier 与 climate sensitivity、cobweb，以及 El Niño 的 delayed oscillator。"
line: sig
---

[RB2203 第 2 站](../courses/RB2203.html#pid)把 joint 的 input 当成 torque，理由是 current loop 在 0.2 ms 内就跟上 command。那个 loop 管的是 motor 的 armature circuit：

$$L_a\frac{di}{dt}=-R\,i+V$$

Joint J 的 motor 是 $R=1\ \Omega$、$L_a=0.5$ mH（RB2203 把 inductance 记作 $L$，这里加一个下标，把 $L$ 留给 loop gain）。Back-EMF 变化慢，先不管。目标是 1 A，下面三件事都发生在这个 circuit 上。

**第一件。** 不量 current，按 model 直接给 $V=R\,i_d=1$ V。Motor 连续工作、绕组发热，$R$ 升到 1.2 Ω，current 停在 $1/1.2=0.833$ A，torque 少了 16.7%，controller 不知道。到达 final value 的 63% 要 $L_a/R=0.42$ ms。

**第二件。** 装一个 current sensor，在原来的 voltage 上加一项和 error 成正比的修正：

$$V=\hat R\,i_d+k_p\,(i_d-i),\qquad \hat R=1\ \Omega,\quad k_p=5\ \text{V/A}$$

$\hat R$ 是 model 里的 resistance。同一个发热的 motor，current 停在 $\dfrac{1+5}{1.2+5}=0.968$ A，只少 3.2%；63% 的时间缩到 $L_a/(R+k_p)=0.081$ ms。Error 从 16.7% 降到 3.2%，小了 $\frac{0.2/1.2}{0.2/6.2}=\frac{6.2}{1.2}=5.17$ 倍；63% 的时间从 0.417 ms 缩到 0.0806 ms，也是 $\frac{6.2}{1.2}=5.17$ 倍。

**第三件。** Controller 用的是 measurement，measurement 要经过 ADC、filter 和计算，用上的时候已经是 $\tau$ 之前的值。$R$ 回到 1 Ω，只看 delay：$\tau=0.1$ ms 时 current 冲到 1.47 A，来回几次才停；$\tau=0.2$ ms 时每一次都比上一次冲得远，2 ms 内到了 2.9 A。放进 1 kHz 的 joint controller，$\tau$ 至少是 1 ms。

::fig[thread-feedback-current] 左边是 loop 本身：driver 给 coil 加 voltage，sensor 量 current，measurement 经过一段 delay 才回到 controller。右边上图是发热的 motor（$R=1.2\ \Omega$）：open loop 停在 0.833，closed loop 停在 0.968 而且快得多。下面两条只有 delay 不同：0.1 ms 时振几下就停，0.2 ms 时越振越大。

三件事留下三个问题：feedback 把 plant 的误差缩小多少倍；为什么同时变快，而且快的倍数和准的倍数都是 5.17；delay 从多少开始让 feedback 变成坏事，界线在 0.1 ms 和 0.2 ms 之间的哪里。答案在下面的骨架里，它只用一个 first-order plant、一个 gain 和一段 delay。后面每门课，从 joint 的 PID 到 cell 里的 protein、market 的 price、Pacific 的 SST，做的都是这个 loop，只是 plant、gain 和 delay 换了名字。

## 骨架：一个 first-order loop

### Loop 的 algebra：plant 的误差被除以 1+L

先只看 steady state。Plant 把 input $u$ 变成 output $y=P\,(u+d)$：$P$ 是 plant 的 gain（current loop 里 $P=1/R$），$d$ 是加在 input 上的 disturbance。Controller 是 feedforward 加 feedback：

$$u=F\,r+C\,(r-y)$$

$F$ 是按 model 算的部分（$F=\hat R$），$C$ 是 feedback 的 gain（$C=k_p$）。代进去，把含 $y$ 的项移到左边：

$$y=P(F+C)\,r-PC\,y+P\,d\quad\Longrightarrow\quad y=\frac{P(F+C)}{1+PC}\,r+\frac{P}{1+PC}\,d$$

$L=PC$ 叫 loop gain：从比较的地方出发，沿 loop 走一圈被乘上的倍数。Current loop 里 $L=k_p/R=5$。

**对 plant 变化的 sensitivity。** $P$ 变一个百分比，$y$ 变多少百分比？取 log，$\ln y=\ln P+\ln(F+C)+\ln r-\ln(1+PC)$，对 $\ln P$ 求 derivative（$\frac{d}{d\ln P}=P\frac{d}{dP}$）：

$$S\equiv\frac{d\ln y}{d\ln P}=1-\frac{PC}{1+PC}=\frac{1}{1+L}$$

$C=0$ 时 $S=1$：open loop 时 plant 偏多少 output 就偏多少。$F$ 不在 $S$ 里：feedforward 决定名义上准不准，feedback 决定偏了以后还剩多少。$L=5$ 时 $S=1/6$。第一件事里 $P$ 从 1 变成 $1/1.2$，变了 $-16.7\%$，按 $S$ 估计 output 变 $-16.7\%/6=-2.8\%$，实际是 $-3.2\%$：$-16.7\%$ 不是无穷小，$S$ 在途中从 $1/6$ 走到了 $1/(1+5/1.2)=0.194$。

**对 disturbance。** $d$ 前面的 factor 同样多了 $\frac1{1+L}$。Joint 以 0.2 rad/s 转动时，back-EMF 是 $KN\dot\theta=0.05\times50\times0.2=0.5$ V（$K$、$N$ 取自 [RB2203 第 1 站](../courses/RB2203.html#model)），它就是 $d=-0.5$ V。Open loop 的 current 只剩 $(1-0.5)/1=0.5$ A。Closed loop 由 $R\,i=\hat R\,i_d+k_p(i_d-i)-0.5$ 得 $i=\dfrac{1+5-0.5}{6}=0.917$ A，少掉的 0.5 A 只剩 $0.5/6=0.083$ A。要把它消到 0，$C$ 在 steady state 时要无穷大，也就是 integral；RB2203 的 current loop 用 PI，理由见 [EE3331C 第 8 站](../courses/EE3331C.html#pid)。

:::wrong Loop gain 是 5，每次纠正都过头 5 倍，所以 negative feedback 的 loop gain 必须小于 1
把 loop 一圈一圈地展开：送进 $r$，plant 给出 $Lr$；error 是 $r-Lr$，下一圈给出 $L(r-Lr)$；如此下去，output 是 $Lr\,(1-L+L^2-\cdots)$，$L=5$ 时发散。可第二件事里 current 稳稳停在 0.968 A。逐圈展开假设每一圈里 plant 先完全响应，controller 再看下一眼，等于每圈有一整段 delay；连续工作的 loop 在每个 $dt$ 里只改一点点，下一小节会看到它对任何 $L>0$ 都 stable。真正一圈一圈运行的 system 里这个说法成立，[桥三](#bridge3)的 cobweb 就是，那里 loop gain 确实必须小于 1。Positive feedback 的展开 $1+f+f^2+\cdots=\frac1{1-f}$ 在 $f<1$ 时收敛到正确答案，这就是 EC1101E 那张 multiplier 的逐轮表（[桥二](#bridge2)）。
:::

### Closed-loop pole：快了同样的 1+L 倍

Current loop 两边除以 $L_a$：$\dot i=-\frac{R}{L_a}i+\frac{1}{L_a}V$。一般地写

$$\dot y=-a\,y+b\,(u+d)$$

$a$ 是 plant 自己回到 0 的 rate（current loop 里 $a=R/L_a=2000$ /s，time constant 0.5 ms），$b=1/L_a$。Steady state 时 $y=\frac ba(u+d)$，所以 $P=b/a$。代入 $u=Fr+k(r-y)$（$k$ 就是上一小节的 $C$）：

$$\dot y=-(a+bk)\,y+b(F+k)\,r+b\,d$$

Deviation 按 $e^{-(a+bk)t}$ 衰减，closed-loop pole 是

$$p=-(a+bk)=-a\Big(1+\frac{bk}{a}\Big)=-a\,(1+L)$$

$bk/a=Pk$ 正是上一小节的 loop gain。快的倍数和准的倍数是同一个 $1+L$：开头两个 5.17 都是 $1+k_p/R=1+5/1.2$。名义上 $p=-2000\times6=-12000$ /s，time constant 83 μs。

两个倍数相同有一个原因。$e^{st}$ 经过 plant 被乘上 $\frac{b}{s+a}$（[EE2023 第 4 站](../courses/EE2023.html#laplace)），所以 loop gain 也随 frequency 变，$L(s)=\frac{bk}{s+a}$。$s=0$ 是 steady state，$S(0)=\frac1{1+L(0)}$ 读出准不准；$1+L(s)=0$ 的 root $s=-(a+bk)$ 是 closed-loop pole，读出快不快。两样都来自同一个 $1+L(s)$。

::fig[thread-feedback-pole] 左边是 s-plane 的 real axis，右边是同一时刻的 step response（右上按 final value 归一化，右下以没有 feedback 时的 final value 为 1）。$L$ 从 0 加到 5，pole 从 $-a$ 滑到 $-6a$，response 快 6 倍；然后换成 positive feedback，$f$ 从 0 加到 0.8，pole 往 0 靠，response 慢 5 倍、终值放大 5 倍；$f=1.2$ 时 pole 越过 0，output 一直长下去。

**Positive feedback。** 回来的信号若是加上去的，$u=u_0+k'y$，$k'>0$，代入得 $\dot y=-(a-bk')y+bu_0$。记 $f=bk'/a$：

$$p=-a\,(1-f),\qquad y_{ss}=\frac{b\,u_0/a}{1-f}$$

$b\,u_0/a$ 是没有 feedback 时的 output。$f<1$ 时 stable，output 放大 $\frac1{1-f}$ 倍，response 也慢 $\frac1{1-f}$ 倍；$f=1$ 时 pole 在 0，plant 成了 integrator，任何 input 都一直累积；$f>1$ 时 pole 进入 right half-plane，deviation 指数增长，直到某个 nonlinearity 让它停下。

**Order 更高时。** Plant 有多个 pole，closed-loop pole 就是 $1+L(s)=0$ 的所有 root，也是 closed-loop state matrix（如 $A-BK$）的 eigenvalue；全部在 left half-plane 才 stable，不解 root 判断它们在哪一侧用 Routh array。这两件事在[不被转走的方向](../threads/eigen.html)的骨架和[桥三](../threads/eigen.html#bridge3)里推过，这里不重复。First order 的特别之处是 $1+L(s)$ 只有一个 root，gain 加多大它都在左边。[EE3331C 第 5 站](../courses/EE3331C.html#rlocus)的 root locus 说明，pole 比 zero 多两个以上时，high gain 一定把某些 branch 拉过 imaginary axis。Delay 对 loop 做的是同一件事，而且一个 first-order plant 就够了。

### Delay：纠正迟到了 τ

Measurement 晚 $\tau$ 到达，$u$ 里的 $y$ 换成 $y(t-\tau)$。$r$、$d$ 是 constant，减去 steady state 后只剩 deviation，记 $g=bk$：

$$\dot y(t)=-a\,y(t)-g\,y(t-\tau)$$

试 $y=e^{st}$，$s\,e^{st}=-a\,e^{st}-g\,e^{s(t-\tau)}$，两边除以 $e^{st}$：

$$s+a+g\,e^{-s\tau}=0$$

它不是 polynomial，有无穷多个 root，Routh 用不上。换个问法：$\tau$ 从 0 连续增大，root 连续移动；$\tau=0$ 时唯一的 root $-(a+g)$ 在左边，要变得 unstable，必须有 root 穿过 imaginary axis。$s=0$ 不满足（$a+g\ne0$），所以只能是某个 $s=j\omega$，$\omega>0$：

$$a+j\omega=-g\,e^{-j\omega\tau}$$

两边 magnitude 相等，$\sqrt{a^2+\omega^2}=g$：

$$\omega_c=\sqrt{g^2-a^2}$$

两边 angle 相等。左边是 $\arctan(\omega/a)$；右边 $-1=e^{j\pi}$，angle 是 $\pi-\omega\tau$：

$$\tau_c=\frac{\pi-\arctan(\omega_c/a)}{\omega_c}$$

Current loop：$a=2000$，$g=k_p/L_a=10000$，$\omega_c=\sqrt{10^8-4\times10^6}=9798$ rad/s，$\arctan(9798/2000)=\arctan4.899=1.369$ rad，$\tau_c=\dfrac{3.1416-1.369}{9798}=0.181$ ms。开头的 0.1 ms 在界线以内，0.2 ms 在界线以外。拿 simulation 核对：$\tau=0.17$ ms 时 oscillation 一圈比一圈小，0.19 ms 时一圈比一圈大。刚过界线时 oscillation 的 frequency 是 $\omega_c$，period $2\pi/\omega_c=0.64$ ms。

**这就是 phase margin。** 在比较的地方把 loop 断开，送进 $e^{j\omega t}$，绕一圈回来被乘上

$$L(j\omega)=\frac{g\,e^{-j\omega\tau}}{j\omega+a}$$

$\lvert L(j\omega)\rvert=g/\sqrt{\omega^2+a^2}$ 恰好在 $\omega_c$ 等于 1，$\omega_c$ 就是 crossover frequency。没有 delay 时 $L(j\omega_c)$ 的 angle 是 $-\arctan(\omega_c/a)=-78.5^\circ$，离 $-180^\circ$ 还有

$$\mathrm{PM}=180^\circ-\arctan\frac{\omega_c}{a}=101.5^\circ$$

Delay 不改 $\lvert L\rvert$，只把每个 frequency 的 angle 减去 $\omega\tau$。在 $\omega_c$ 上减完 PM 时 $L(j\omega_c)=-1$：回来的信号经过 feedback 的减号，和送出去的一模一样，loop 不要 input 也能维持这个 oscillation。所以

$$\tau_c=\frac{\mathrm{PM}}{\omega_c}$$

和上面解出的是同一个式子，它就是 [EE3331C 第 6 站](../courses/EE3331C.html#nyquist)的 delay margin。

::fig[thread-feedback-margin] Current loop 的 $L(j\omega)$（$\omega\ge0$ 的那一半 Nyquist plot），圆是 unit circle，彩色点是 crossover 点 $L(j\omega_c)$，它到 $-1$ 的 angle 就是 PM。$\tau$ 从 0 增大，整条 curve 按 $e^{-j\omega\tau}$ 卷起来（灰线留在 $\tau=0$ 的位置），crossover 点沿 unit circle 转 $\omega_c\tau$；$\tau=0.181$ ms 时它压到 $-1$ 上。

**Plant 自己放大时。** $a<0$ 表示没有 feedback 时偏差会自己长大（upright 的 pendulum、后面的 El Niño）。$\tau=0$ 时 rate 是 $-(a+g)$，要 $g>\lvert a\rvert$ 才 stable。穿越的分析一字不改，$\omega_c=\sqrt{g^2-a^2}$ 仍然成立，只是 $a+j\omega$ 落在第二象限，angle 是 $180^\circ-\arctan(\omega/\lvert a\rvert)$，于是 $\mathrm{PM}=\arctan(\omega_c/\lvert a\rvert)$，小于 $90^\circ$。同样的 $g$，open loop unstable 的 plant 留给 delay 的 phase 少得多。

**弱的 feedback 不怕 delay。** $g\le a$（$L\le1$）时，$\lvert L(j\omega)\rvert<1$ 对所有 $\omega>0$ 成立，$\omega_c$ 不存在，回来的信号总比送出去的小，什么样的 delay 都不能让 root 穿过 imaginary axis。Delay 只惩罚 $L>1$ 的 loop，而 feedback 的好处恰恰来自 $L$ 大。

**强的 feedback 有一条通用的界限。** $L\gg1$ 时 $\omega_c\approx g$，$\arctan(\omega_c/a)\to90^\circ$，PM 趋向 $90^\circ$，于是 $g\,\tau_c\to\pi/2$。逐个算出来：

| $L=g/a$ | 1.5 | 2 | 5 | 10 | 25 | 100 |
|---|---|---|---|---|---|---|
| PM | $131.8^\circ$ | $120.0^\circ$ | $101.5^\circ$ | $95.7^\circ$ | $92.3^\circ$ | $90.6^\circ$ |
| $g\,\tau_c$ | 3.09 | 2.42 | 1.81 | 1.68 | 1.61 | 1.58 |
| $\tau_c$ 是 closed-loop time constant $\frac1{a+g}$ 的几倍 | 5.14 | 3.63 | 2.17 | 1.85 | 1.68 | 1.60 |

最后一行：$L$ 大时，delay 只要超过没有 delay 时 closed-loop time constant 的 1.6 倍左右，loop 就不 stable。一个 loop 不可能比它自己的 delay 快很多。Current loop 要 83 μs 的 time constant，sample 加计算就必须在 0.18 ms 之内完成，这是它要放在 driver 里、以远高于 joint controller 的 rate 运行的原因。

:::edge 刚过 τ_c 之后
Linear model 说 oscillation 以 $\omega_c$ 指数增长。真实的 system 里 voltage 有上限，amplitude 大到 saturation 之后，平均意义上的 gain 变小，增长停下，留下一个 amplitude 固定的 oscillation（limit cycle）。[桥一](#bridge1)里带 delay 的 gene 和[桥四](#bridge4)的 El Niño 都停在这样的 oscillation 上，限制 amplitude 的分别是 Hill function 的饱和与 $-T^3$ 那一项。
:::

### 每隔 h 看一次：离散的 loop

Digital controller 每 $h$ 秒读一次 sensor、算一次、output 一次。最简单的 plant 只积分（$a=0$，例如 [RB2203 第 3 站](../courses/RB2203.html#real)接受 velocity command 的 joint），$x_{k+1}=x_k+h\,u_k$；controller 用 $d$ 步以前的 measurement，$u_k=-k\,x_{k-d}$。记 $c=kh$：

$$x_{k+1}=x_k-c\,x_{k-d}$$

试 $x_k=z^k$，得 $z^{d+1}-z^d+c=0$。$c$ 很小时一个 root 在 $1-c$ 附近，其余在 0 附近，stable。和连续时间一样，问 $c$ 增大时 root 什么时候穿过 unit circle。设 $z=e^{j\theta}$，$0<\theta\le\pi$，equation 写成

$$e^{j\theta d}\,(e^{j\theta}-1)=-c$$

$e^{j\theta}-1=e^{j\theta/2}\big(e^{j\theta/2}-e^{-j\theta/2}\big)=2j\sin\tfrac\theta2\;e^{j\theta/2}$，它的 magnitude 是 $2\sin\frac\theta2$，angle 是 $\frac\theta2+\frac\pi2$。Magnitude 等于 $c$；angle 加上 $\theta d$ 要等于 $-c$ 的 angle $\pi$：

$$\theta d+\frac\theta2+\frac\pi2=\pi\ \Longrightarrow\ \theta=\frac{\pi}{2d+1},\qquad c_{\max}=2\sin\frac{\pi}{2(2d+1)}$$

| $d$ | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| $c_{\max}$ | 2 | 1 | 0.618 | 0.445 | 0.347 |
| 穿过时的 $\theta$ | $180^\circ$ | $60^\circ$ | $36^\circ$ | $25.7^\circ$ | $20^\circ$ |
| 临界 oscillation 的 period（步） | 2 | 6 | 10 | 14 | 18 |

（每个 $c_{\max}$ 都用 numpy 求 root 核对过：差 $10^{-6}$ 时 $\max\lvert z\rvert$ 分别落在 1 的两侧。）$d=0$ 的 $c<2$ 是 RB2203 的 $hK_p<2$，也是 explicit Euler 的 $\lvert1+h\lambda\rvert<1$（[不被转走的方向，桥二](../threads/eigen.html#bridge2)）：没有 computation delay，hold 住的 $u_k$ 在整个 $h$ 里用的也是 $x_k$ 这个旧值。$d=1$ 的 $c<1$ 是 RB2203“一个 sample 的 delay 让允许的 gain 减半”，$d=2$ 的 0.618 是 [RB4301 第 4 站](../courses/RB4301.html#s2r)数值求出的界限。

$d$ 很大时 $c_{\max}\approx\frac{\pi}{2d+1}$。Delay 是 $\tau=dh$，所以 $k\tau=c_{\max}\,d\approx\frac{\pi d}{2d+1}\to\frac\pi2$，回到连续时间 $a=0$ 时的 $g\,\tau_c=\pi/2$。

::fig[thread-feedback-zroots] 三个 $d$ 的 $z^{d+1}-z^d+c=0$ 的 root，$c$ 同步从 0 加到 $1.15\,c_{\max}$。灰线是 root 走过的路线。$d=0$ 的唯一 root 沿 real axis 往左，在 $-1$（$\theta=180^\circ$）出界；$d\ge1$ 时两个 root 先在 real axis 上相遇，再分开变成 complex，在 $60^\circ$、$36^\circ$ 处穿出 unit circle。

### Nonlinear 的 loop：loop gain 是 slope

Cell 里的 protein、market 的 price、地球的 temperature 都不是 linear 的。一维时写成

$$\dot x=F(x)-a\,x$$

$F$ 是依赖 $x$ 的 input（production、spending、吸收的 energy），$a\,x$ 是 removal。Equilibrium 满足 $F(x^*)=a\,x^*$。令 $x=x^*+y$，把 $F$ 在 $x^*$ 展开到一次项，$\dot y\approx\big(F'(x^*)-a\big)\,y$，和 $-a(1+L)$ 对照：

$$L=-\frac{F'(x^*)}{a}$$

$F$ 随 $x$ 下降是 negative feedback（$L>0$），随 $x$ 上升是 positive feedback（$f=-L=F'(x^*)/a$）。Equilibrium stable 当且仅当 $F'(x^*)<a$：在图上，$F$ 的 curve 从上方穿过 removal 的那条直线。

Steady state 对 input 强度的 sensitivity 也是同一个式子。把 $F$ 乘上 $1+\varepsilon$，新的 equilibrium $x^*+\delta$ 满足 $(1+\varepsilon)F(x^*+\delta)=a(x^*+\delta)$。展开到一次项，$F(x^*)+F'(x^*)\delta+\varepsilon F(x^*)=a x^*+a\delta$，用 $F(x^*)=a x^*$ 消去常数项：

$$\frac{\delta/x^*}{\varepsilon}=\frac{a}{a-F'(x^*)}=\frac{1}{1+L}$$

Linearization 只管 equilibrium 附近。离得远时 $F$ 可能已经饱和、slope 接近 0，loop 实际上断开了：RB2203 第 3 站 torque 顶在上限时 integral 照常累积，[MIT-6.8210 第 5 站](../courses/MIT-6.8210.html#lyap)的 pendulum 静止在离 upright 超过 0.205 rad 的地方时，2 N·m 已经抵不过 gravity。要证明从多远回得来，需要一个沿 trajectory 不增的 $V(x)$，那是 Lyapunov function 的工作。

## 逐门课：名字、记号、加了什么

| 课 | 被量回来的量 | 这里叫什么 | 记号 | 对应骨架的哪一部分 |
|---|---|---|---|---|
| EE2023 | 没有 loop | pole、mode、time constant | $H(s)$，$p_k$，$e^{p_kt}$ | plant 自己的 $-a$ |
| EE3331C | position、speed | loop transfer function、sensitivity、closed-loop pole、PM、delay margin | $L=CG$，$S=\frac1{1+L}$，$1+L=0$，$\tau_{\max}=\mathrm{PM}/\omega_c$ | 全部，plant 是 third order |
| RB2203 | joint angle、current | PD、PID、sampled loop、state feedback | $K_p,K_i,K_d$，$hK_p$，$A-BK$ | $g$ 与 $K_p$，离散的 loop |
| RB4301 | 1D plant 的 state | latency 的步数 | $c=\Delta t\,K/m$，$d$ | 离散的 loop，$c=gh$ |
| MIT-6.8210 | pendulum 的 state | fixed point 的 slope、Lyapunov function、ROA | $f'(x^*)$，$V$，$\dot V$，$\rho$ | linearization 管不到的地方 |
| LSM2234 | protein 浓度 | negative autoregulation、Hill function、toggle switch | $\frac{\beta}{1+(x/K)^n}-\alpha x$，$J$ | $a=\alpha$，$L=-\beta'(x^*)/\alpha$ |
| LSM2213 | cortisol | HPA axis 的 negative feedback | $\tau\dot g=s-(1+k)g$ | $L=k$ |
| CS4278 | lateral error | pure pursuit、latency | $\kappa=2x/L_d^2$，$\tau_c=0.520\,L_d/v$ | delay margin，plant 是 second order |
| HARVARD-CS249R | perception 的结果 | latency budget | 每个 frame 的 latency | $\tau$ |
| EC1101E | price；income | surplus 与 shortage；multiplier | $Q_D-Q_S$；$\frac1{1-c_1}$ | price 是 integrator；$f=c_1$ |
| GE1101E | temperature | Planck response、feedback、thermostat | $4\sigma T_e^3$，ECS | removal 的 $a$ 与 positive 的 $f$ |
| SIO-210 | 东太平洋的 SST | Bjerknes feedback、delayed oscillator | 83 天加 248 天 | plant 自己放大，negative feedback 晚 $\tau$ |

记号有三处要对齐。RB2203 和 EE3331C 第 1 站把 inductance 写作 $L$，这一页写 $L_a$，$L$ 只指 loop gain。EE3331C 的 $L(s)$ 是整个 transfer function，这一页的 $L$ 多数时候指它在 $s=0$ 的值，算 phase margin 时才用 $L(j\omega)$。Roe 与 Baker 的 feedback factor $f$（GE1101E 只说 feedback 把 Planck response 放大约 3 倍）正是这一页的 $f=-L$。

### EE2023：open loop 的语言

[EE2023 第 5 站](../courses/EE2023.html#pz)说每个 pole $p$ 贡献一个 mode $e^{pt}$，全部 pole 在 left half-plane 才 BIBO stable。First-order plant $\frac{b}{s+a}$ 只有一个 mode $e^{-at}$，它自己多快回来是定死的。Feedback 没有带来新的语言，它只是把 pole 从 $-a$ 挪到 $-a(1+L)$；挪到哪里、还能挪多远，就是 EE3331C 的内容。[第 6 站](../courses/EE2023.html#bode)的 Bode plot 是读 crossover 和 phase 的工具，上面的 PM 在 Bode plot 上就是 magnitude 穿过 0 dB 处的 phase 离 $-180^\circ$ 有多远。

### EE3331C：1+L 的全部用法

[第 1 站](../courses/EE3331C.html#feedback)用 $\frac{dT/T}{dG/G}$ 推出同一个 $S=\frac1{1+L}$，speed loop 的 $L(0)=25$ 让 plant 偏 20% 时 output 只偏 0.95%。它多加的一条是 $S+T=1$：$S$ 小的 frequency 上 $T\approx1$，sensor noise 原样进入 output，所以只能让 $\lvert L\rvert$ 在低 frequency 大、高 frequency 小。[第 4 站](../courses/EE3331C.html#sse)把“$L(0)$ 越大误差越小”推到极限：loop 里有 integrator 时 $L(0)=\infty$，step 的 error 是 0；[第 8 站](../courses/EE3331C.html#pid)的论证（只要进入 steady state，integral 的 input 就必须是 0）不依赖 plant，[桥三](#bridge3)会把它用在 market 上。[第 3、5 站](../courses/EE3331C.html#routh)处理 plant 是 third order 时 high gain 本身就造成的 instability（$K>44$）。[第 6 站](../courses/EE3331C.html#nyquist)给出 delay margin $\tau_{\max}=\mathrm{PM}/\omega_c$，$K=3.34$ 时是 0.66 s，设计快到 $\omega_c=3.7$ 到 5 rad/s 时缩到 0.17 到 0.22 s；它还处理 open loop 本身 unstable 的情形（$Z=N+P$，inverted pendulum 要 counter-clockwise 包围 $-1$），[桥四](#bridge4)的 El Niño 就是这种 loop。

### RB2203 与 RB4301：gain、sampling 和 latency

[RB2203 第 2 站](../courses/RB2203.html#pid)的 PD 把 $K_p$ 当 spring、$K_d$ 当 damper；gravity 是 plant input 上的 constant disturbance，P term 只能靠 error 顶住它，$e\approx mgr/K_p$，加倍 $K_p$ 只能把 error 减半，这是 $\frac1{1+L}$ 在一个本身有 integrator 的 plant 上的样子。加 integral 后 order 升到 3，$K_i<800$ 是又一个由 order 带来的 gain 上限。[第 3 站](../courses/RB2203.html#real)加了三样骨架里没有的东西：saturation 让 loop 断开、integral wind up；derivative filter 的 $T_f$ 也是一段 lag，$T_f$ 从 0 加到 20 ms，1 kHz loop 能用的最大 $\omega_n$ 从 323 降到 93 rad/s；Joint J 在 59 Hz 以下发散，而它的 closed loop 只有 3.2 Hz。[第 4 站](../courses/RB2203.html#ss)的 $u=-Kx$ 把 feedback 写成 matrix，选 $K$ 就是选 $A-BK$ 的 eigenvalue。

[RB4301 第 4 站](../courses/RB4301.html#s2r)用 $x_{t+1}=x_t-c\,x_{t-d}$ 说明 sim-to-real：simulator 里 $d=0$、$c=1$ 一步归零，真机轻 20% 又有一步 latency，$c=1.25>1$，root 的 magnitude 是 $\sqrt{1.25}=1.118$，每步放大 11.8%。它加的是另一面：latency 不写进 model，system identification 会把它揉进别的 parameter，white noise 激励下甚至估出负的 mass。

### MIT-6.8210：linearization 管多远

[第 1 站](../courses/MIT-6.8210.html#pend)判断一维 fixed point 只看 $\dot x$ 对 $x$ 的 slope，就是上面 nonlinear 一节的 $F'(x^*)-a$。[第 3 站](../courses/MIT-6.8210.html#lqr)的 cart-pole 在 upright 处 open loop 的 eigenvalue 有一个是 $+6.766$：plant 自己会放大偏差，和骨架里 $a<0$ 的情形一样，feedback 必须比这个放大更强。LQR 让 closed loop 的 eigenvalue 全在左边，从 70° 放手 pole 照样倒下。[第 5 站](../courses/MIT-6.8210.html#lyap)把“回得来”变成可以证明的：$V=\bar x^\top S\bar x$ 的 sublevel set 上处处 $\dot V<0$，set 就在 ROA 里；torque 限在 2 N·m 时 $\rho=2.607$，ellipse 在 $\bar\theta$ 轴上到 0.1985 rad，物理极限是 $\arcsin(2/9.81)=0.205$ rad。它还纠正一个错觉：某一点 $\dot V<0$ 不说明从那里回得来。

### LSM2234 与 LSM2213：cell 和 hormone 里的 loop

[LSM2234 第 3 站](../courses/LSM2234.html#gene)：没有 regulation 时 protein 的 response time 只由 dilution rate $\alpha$ 决定，强 promoter 也快不了；自己 repress 自己以后，$t_{1/2}$ 从 $0.693/\alpha$ 缩到 $0.147/\alpha$。[第 4 站](../courses/LSM2234.html#switch)的 toggle switch 是两个 repression 串成的 loop，两个负号相乘，是 positive feedback。[LSM2213 第 7 站](../courses/LSM2213.html#emotion)的 HPA model $\tau\dot g=s-(1+k)g$ 一字不差就是骨架：level 是 $s/(1+k)$，time constant 是 $\tau/(1+k)$，$k$ 就是 $L$；glucocorticoid cascade hypothesis 说长期的高 cortisol 让 $k$ 变小，是一个更慢的 positive feedback 在侵蚀 negative feedback。[第 2 站](../courses/LSM2213.html#spike)的 threshold 来自 $\mathrm{Na^+}$ 的 positive feedback：depolarization 打开 channel，channel 让 depolarization 更大。三处的对应在[桥一](#bridge1)和[桥二](#bridge2)。

### EC1101E 与 GE1101E：market 的 integrator 与 positive feedback

[EC1101E 第 2 站](../courses/EC1101E.html#market)说 price 高于 equilibrium 时有 surplus，seller 降价；低于时有 shortage，buyer 加价。写成 $\dot P=\gamma\,(Q_D-Q_S)$，price 是 excess demand 的 integral。布的 market 里 $Q_D-Q_S=75-1.5P$，$\dot P=-1.5\gamma(P-50)$，pole $-1.5\gamma$，任何 $\gamma>0$ 都 stable。[第 7 站](../courses/EC1101E.html#adas)的 multiplier 是 positive feedback：income 变成 consumption，consumption 又是别人的 income，$f=c_1=0.75$。[GE1101E 第 5 站](../courses/GE1101E.html#coast)的 Planck response 是 removal 的 $a$（每暖 1 K 多辐射 3.74 W/m²），water vapor 和 ice–albedo 是 positive feedback；[第 2 站](../courses/GE1101E.html#rocks)的 silicate weathering 是 negative feedback，要几十万年以上才起作用。

### SIO-210：Bjerknes feedback 与 delayed oscillator

[SIO-210 第 8 站](../courses/SIO-210.html#enso)：trade winds 强，东边 thermocline 浅，upwelling 冷，东西温差大，trade winds 更强，这是 positive feedback，让 equatorial Pacific 难以停在中间。结束 El Niño 的是往西的 Rossby wave 在西边界反射回来的 Kelvin wave，一来一回 $83+248=331$ 天：一个晚到将近一年的 negative feedback。

### CS4278 与 HARVARD-CS249R：latency 是 loop 的 budget

[CS4278 第 7 站](../courses/CS4278.html#system)把 golf cart 的 pipeline latency 算到最坏 837 ms，又对 pure pursuit 推出临界 delay $\tau_c=0.520\,L_d/v$，说明速度加倍、能容忍的 delay 减半，所以 lookahead 要随速度变。[HARVARD-CS249R 第 5 站](../courses/HARVARD-CS249R.html#serve)说 perception 宁可丢 frame：queue 长度为 1 时每个结果最多晚 72.3 ms，FIFO 10 秒后晚 1.7 s 而且还在涨。两处都没有说出这两个数在 loop 里意味着什么，[桥四](#bridge4)把它们放进同一个 $\tau_c=\mathrm{PM}/\omega_c$。

## 课程页之间的桥

### <span id="bridge1"></span>桥一：Negative autoregulation 就是 P control

LSM2234 的 negative autoregulation 取 $\beta=10$、$K=1$、$n=2$，浓度以 $K$、时间以 $1/\alpha$ 为单位：

$$\dot x=\frac{10}{1+x^2}-x$$

Equilibrium 是 $x^*=2$（$2^3+2=10$）。按 nonlinear 一节，$F(x)=\frac{10}{1+x^2}$，$F'(x)=-\frac{20x}{(1+x^2)^2}$，$F'(2)=-\frac{40}{25}=-1.6$，$a=1$：

$$L=1.6,\qquad 1+L=2.6,\qquad S=\frac1{2.6}=0.385$$

三个 loop 放在一起：

| | 开头的 current loop | LSM2234 negative autoregulation | LSM2213 HPA |
|---|---|---|---|
| 被量回来的量 | current $i$ | protein 浓度 $x$ | cortisol $g$ |
| Plant 自己的 rate $a$ | $R/L_a=2000$ /s | dilution $\alpha$ | $1/\tau$ |
| Feedback 的 rate $g$ | $k_p/L_a=10000$ /s | $-\beta'(x^*)=1.6\,\alpha$ | $k/\tau$ |
| 谁扮演 sensor 和 controller | current sensor 与 $k_p$ | 结合在 promoter 上的 X 自己 | pituitary、hypothalamus、hippocampus |
| $L$ | 5 | 1.6 | $k$（例子取 3） |
| Equilibrium 附近快了 $1+L$ 倍 | 6 | 2.6 | 4 |
| 对 plant 或 production 变化的 $S$ | $1/6$ | 0.385 | $1/4$ |

**两边各算一遍 sensitivity。** Current loop 里 $R$ 变 20%，output 变 3.2%，open loop 变 16.7%。Gene 这边把 promoter 的强度 $\beta$ 加 20%：simple regulation 的 $x^*=\beta/\alpha$ 跟着加 20%；negative autoregulation 解 $x^3+x=12$ 得 $x^*=2.144$，只加 7.2%（减 20% 时解 $x^3+x=8$，$x^*=1.834$，减 8.3%）。按 $S$ 估计是 $20\%\times0.385=7.7\%$。Dilution rate $\alpha$ 变化（cell 长得快或慢）在 equation 里和 $\beta$ 变化只差一个方向，sensitivity 也是 $-0.385$。Karin 的讲义只定性地说 steep 的 negative autoregulation 让 steady state 几乎只由 $K$ 决定、对 production rate 和 growth rate 的 fluctuation 不敏感；$\frac1{1+L}$ 给出了这个“几乎”是多少，$x^*$ 固定时 $n$ 越大，$-\beta'(x^*)$ 越大，$S$ 越小。

::fig[thread-feedback-nar] 一维 loop 的“rate balance”：直线是 removal $x$，curve 是 production。左边 simple regulation 的 production 是常数 2，加 20% 后 intersection 从 2 移到 2.4；右边 negative autoregulation 的 production 随 $x$ 下降，同样加 20%，intersection 只从 2 移到 2.144。Intersection 处 production 的 slope 是 $-1.6$，除以 removal 的 slope 1 再取负号，就是 $L=1.6$。

**两边各算一遍速度。** Equilibrium 附近 deviation 按 $e^{-2.6t}$ 衰减：simulation 里 $t=2$ 到 5 之间 deviation 的 decay rate 是 2.600。LSM2234 算的 $t_{1/2}$ 是 $0.147/\alpha$，快了 4.7 倍，比 2.6 倍还多。多出来的部分来自 nonlinearity：从 $x=0$ 出发时 repression 还没起作用，production 是 10，是 simple regulation 的 5 倍。这和 current loop 开始时 error 很大、voltage 很大是同一个现象，loop gain 只描述 equilibrium 附近。

**Delay 的界限也是同一个式子。** Transcription、translation、folding 都要时间，X 抑制自己的 promoter 时用的是 $\tau$ 以前的浓度：$\dot x=\frac{10}{1+x(t-\tau)^2}-x$。Linearize，$a=1$，$g=1.6$：

$$\omega_c=\sqrt{1.6^2-1}=1.249,\qquad \mathrm{PM}=180^\circ-\arctan1.249=128.7^\circ=2.246\ \text{rad},\qquad \tau_c=\frac{2.246}{1.249}=1.80$$

单位是 $1/\alpha$。E. coli 每 30 min 分裂一次、protein 只靠 dilution 消失时 $\alpha=\ln2/30$ /min，$\tau_c=1.80\times43.3=77.8$ min。Nonlinear 的 equation 直接 simulate：$\tau=1.7$ 时 oscillation 慢慢消失，$\tau=1.9$ 时停在 $\pm0.45$ 左右的 limit cycle 上，period 5.26（linear 预测的临界 period 是 $2\pi/1.249=5.03$），$\tau=2.5$ 时 amplitude 涨到 2.1。Karin 的讲义用 X 激活 Y、Y 抑制 X 的两步 loop 说明 negative feedback 会给出 damped oscillation；那个 loop 的 linearization 的 trace 永远为负，只能 damped；加上一段真正的 delay，damped 与 sustained 之间就有了一条界线，就是这里的 $\tau_c$。

反过来，$n=1$ 的 negative autoregulation 要停在同一个 $x^*=2$，$\beta=6$，$F'(2)=-\frac{6}{(1+2)^2}=-0.667$，$L=0.667<1$。按骨架里“弱的 feedback 不怕 delay”，linearization 对任何 $\tau$ 都 stable，代价是 $S=0.6$，比 $n=2$ 时不准得多。Cooperativity 同时买来了 robustness 和 oscillation 的可能，和 EE3331C 的 high gain 一样。

:::wrong Negative feedback 越强，system 越稳
没有 delay 时，first-order loop 的 $L$ 越大 pole 越往左，确实越稳。有 delay 时，$\tau_c$ 随 $L$ 变短：$L=1.6$ 时 $1.80/\alpha$，$L=5$ 时 $1.81/g=0.36/a$，$L=25$ 时 $1.61/g=0.064/a$。同一个 transcription delay，weak repression 下的 gene 不会 oscillate，steep repression 下的会。“稳”要说清楚是 equilibrium 附近衰减得快，还是对 delay 有余量，两者朝相反方向变。
:::

### <span id="bridge2"></span>桥二：Multiplier、climate sensitivity、toggle switch，同一个 1/(1−f)

骨架里 positive feedback 的 steady state 是 open loop 的 $\frac1{1-f}$ 倍。三门课各自有一个这样的 loop：

| | EC1101E multiplier | GE1101E climate sensitivity | LSM2234 toggle switch |
|---|---|---|---|
| 绕一圈回来的东西 | income 变成 consumption，又成为别人的 income | 变暖让 water vapor 增加、ice 减少，又多吸收 energy | U 压低 V，V 降低又解除对 U 的压制 |
| 没有 feedback 的 response | autonomous spending 的变化 $\Delta A$ | Planck response $\Delta T_0=\Delta F/(4\sigma T_e^3)$ | 直接加在 U 上的 input |
| $f$ | $c_1=0.75$ | $1-\Delta T_0/\mathrm{ECS}$ | 两个 repression slope 之积 $a^2$ |
| $\frac1{1-f}$ | 4 | 约 3 | 见下 |

**两边各算一遍。** EC1101E：investment 少 25，$\Delta Y=\frac{-25}{1-0.75}=-100$。逐轮写开是 $25+18.75+14.06+\cdots$，每轮乘 $f=0.75$。GE1101E：$\mathrm{CO_2}$ 加倍，$\Delta F=3.71$ W/m²，Planck response 是 $3.71/3.74=0.99$ K；暖了 $\Delta T$ 之后 feedback 相当于再多给 $f\cdot\Delta T$ 的 warming，

$$\Delta T=\Delta T_0+f\,\Delta T\quad\Longrightarrow\quad\Delta T=\frac{\Delta T_0}{1-f}$$

这正是 Roe 与 Baker（2007）补充材料里的式子，他们取 $\lambda_0=1/(4\sigma T_e^3)=0.26$ K/(W m⁻²)、$f$ 的典型值 0.65。GE1101E 的 ECS 约 3 K 对应 $f=1-0.99/3=0.67$；$f=0.65$ 给出 $0.99/0.35=2.83$ K。逐轮写开是 $0.99+0.66+0.44+\cdots$ K，和 multiplier 的表同一个形状。

::fig[thread-feedback-cross] 左边是 EC1101E 的 Keynesian cross（$Z=225+0.75Y$ 对 45° 线），右边把 climate 写成同样的形式（$\Delta T_{\text{new}}=0.99+0.67\,\Delta T$ 对 45° 线）。阶梯是逐轮展开：每一轮的竖段是上一轮的 $f$ 倍，阶梯停在两条线的交点。

**Positive feedback 放大 uncertainty。** Negative feedback 让 output 对 plant 不敏感；positive feedback 反过来，让 output 对 $f$ 本身极其敏感：$\frac{d}{df}\frac{\Delta T_0}{1-f}=\frac{\Delta T_0}{(1-f)^2}$。$f$ 在 $0.65\pm0.1$ 之间，ECS 在 $0.99/0.45=2.20$ K 和 $0.99/0.25=3.96$ K 之间：往下少 0.63 K，往上多 1.13 K。$f$ 的 uncertainty 是对称的，ECS 的 uncertainty 向高的一侧拖出长尾，这是 Roe 与 Baker 的论证。Multiplier 也一样：$c_1$ 在 0.7 和 0.8 之间，multiplier 在 3.33 和 5 之间。骨架还给出一个两边都没写的推论：pole 是 $-a(1-f)$，$f$ 越接近 1，回到新 equilibrium 越慢。Climate 的 ECS 越高，走到它的时间也越长。

**Toggle switch：$f$ 穿过 1 就是 bistability 出现的地方。** 在对角线上的 fixed point，LSM2234 的 Jacobian 是 $\begin{pmatrix}-1&-a\\-a&-1\end{pmatrix}$，$a=\frac{2u^{*2}}{1+u^{*2}}$。只对 U 加一点 input $w$，linearize 后 steady state 满足 $\delta u=-a\,\delta v+w$、$\delta v=-a\,\delta u$，代入得

$$\delta u=\frac{w}{1-a^2}$$

$f=a^2$：两个负号相乘，loop 是 positive 的。逐个 $\alpha$ 算：

| $\alpha$ | $u^*$ | $a$ | $f=a^2$ | 沿 $(1,-1)$ 的 eigenvalue $-1+a$ | |
|---|---|---|---|---|---|
| 1.5 | 0.861 | 0.852 | 0.725 | $-0.148$ | 一个 stable state，input 放大 3.64 倍 |
| 2 | 1 | 1 | 1 | 0 | 分叉点 |
| 3 | 1.213 | 1.191 | 1.419 | $+0.191$ | saddle，两侧各一个 stable state |

$f<1$ 时 positive feedback 只是放大和变慢（eigenvalue $-0.148$，比没有 feedback 的 $-1$ 慢 6.8 倍）；$f$ 穿过 1，pole 穿过 0，中间的 state 变成 saddle，switch 才存在。LSM2234 推出的 bistability 条件 $\alpha>2$，就是“对角线上的 loop gain 大于 1”；用 trace 和 determinant 读同一件事见[不被转走的方向，桥三](../threads/eigen.html#bridge3)。LSM2213 的 action potential 是同一种结构：threshold 是 $\mathrm{Na^+}$ 那个 positive loop 的 gain 超过 1 的 unstable equilibrium，越过它，loop 自己跑到底。Climate 的 $f\ge1$ 也有对应：Roe 与 Baker 写明，$f\ge1$ 时按他们假设的 physics 不再有新的 equilibrium。

### <span id="bridge3"></span>桥三：Cobweb 是一个每轮迟到一整季的 loop

EC1101E 的布 market，$Q_D=70-P$，$Q_S=\frac{P-10}2$，equilibrium $(Q,P)=(20,50)$。Seller 要提前一季决定产量，只能按上一季的 price 定：$Q_t=Q_S(P_{t-1})$；货到了以后 price 调到恰好卖完，$Q_D(P_t)=Q_t$：

$$70-P_t=\frac{P_{t-1}-10}{2}\ \Longrightarrow\ P_t=75-\frac{P_{t-1}}2\ \Longrightarrow\ P_t-50=-\frac12\,(P_{t-1}-50)$$

从 $P_0=56$ 出发：47、51.5、49.25、50.375、49.81，每季变号，偏差每季减半。这是 cobweb model（“cobweb theorem”这个名字是 Kaldor 1934 年起的，QuantEcon 用美国 hog price 的周期作例子）。

**对应到离散的 loop。** 记 excess demand $Z(P)=Q_D-Q_S=75-1.5P$，$b_D=1$、$b_S=\frac12$ 是 demand 和 supply 对 price 的 slope。上面的递推可以写成

$$P_t=P_{t-1}+\frac{1}{b_D}\,Z(P_{t-1})\qquad(\text{核对：}P_{t-1}+75-1.5P_{t-1}=75-0.5P_{t-1})$$

把 $p_t=P_t-50$ 代进去，$Z=-(b_D+b_S)\,p$：

$$p_t=p_{t-1}-c\,p_{t-1},\qquad c=\frac{b_D+b_S}{b_D}=1+\frac{b_S}{b_D}=1.5$$

这就是骨架里 $d=0$ 的离散 loop，和 RB2203 第 3 站 $hK_p=1.5$ 的那条 error 序列一模一样：每步乘 $1-c=-0.5$。所以：

| | 连续调整 $\dot P=\gamma Z(P)$ | Cobweb |
|---|---|---|
| 骨架里的样子 | integrator 加 P control，没有 delay | 每一轮看一次，一次补足 |
| 条件 | 任何 $\gamma>0$ 都 stable | $c<2$，即 $b_S<b_D$ |
| 布 market | pole $-1.5\gamma$ | 每季乘 $-0.5$ |

$c<2$ 换回 market 的话就是 supply 对 price 比 demand 迟钝：inverse supply 的 slope（2）大于 inverse demand 的 slope 的 absolute value（1），这是 cobweb 收敛的标准条件。把 supply 换成 $Q_S=1.25(P-34)$（equilibrium 仍是 $(20,50)$），$c=2.25$，每季乘 $-1.25$：56、42.5、59.4、38.3、64.6、31.7，越摆越大。Market 本身没有变坏，坏在 seller 对上一季的 price 一次反应到底，而这个 price 晚了一整季。每季的倍数 $1-c=-b_S/b_D$，它的 absolute value 就是骨架 :::wrong 里逐圈展开时的 loop gain：那个逐圈展开的 loop，在这里是真的，所以它必须小于 1。

::fig[thread-feedback-cobweb] 两个 market 的 cobweb。点沿着“按上季 price 定产量（横着走到 supply）、按产量定 price（竖着走到 demand）”一季一季走：左边 supply 陡，转着圈收进 equilibrium；右边 supply 平，转着圈甩出去。

**降低 gain：adaptive expectations。** QuantEcon 讨论的 adaptive expectations 让 seller 按一个慢慢修正的预期 price 定产量：$P^e_t=P^e_{t-1}+\alpha_e\,(P_{t-1}-P^e_{t-1})$，每季只把预期往上季的 price 挪 $\alpha_e$ 那么多。按同样的方法记 $e_t=P^e_t-50$：产量的偏差是 $b_S e_t$，price 的偏差是 $p_t=-\frac{b_S}{b_D}e_t$，代进 update：

$$e_{t+1}=e_t+\alpha_e\Big(-\frac{b_S}{b_D}e_t-e_t\Big)=\Big(1-\alpha_e\big(1+\tfrac{b_S}{b_D}\big)\Big)e_t$$

$c=\alpha_e(1+b_S/b_D)$：adaptive expectations 就是把 loop gain 乘上 $\alpha_e$。那个发散的 market，$\alpha_e<2/2.25=0.889$ 就收敛；$\alpha_e=0.5$ 时 $c=1.125$，price 是 42.5、50.94、49.88、50.02，四季内到了 equilibrium；$\alpha_e=0.9$ 时 $c=2.025$，仍然发散。和 RB2203 降低 $K_p$ 让 sampled loop 回到 stable 是同一个动作。

**Price 是 integrator 带来的另一件事。** 连续调整时 $\dot P=\gamma Z$，只要 price 停下来，$Z$ 就必须是 0，不管两条 curve 长什么样、知不知道它们。这正是 EE3331C 第 8 站对 integral action 的论证：只要进入 steady state，integrator 的 input 只能是 0。Market clearing 是 price 这个 integrator 的 steady state。

### <span id="bridge4"></span>桥四：0.520 就是 PM/ω_c，El Niño 是越过了 delay margin 的 loop

**CS4278 的 pure pursuit。** 在 steering command 处把 loop 断开。Lateral error 对 curvature command 是两次 integral（$\dot y=v\theta$，$\dot\theta=v\kappa$），controller 是 $\kappa=-\frac{2}{L_d^2}(y+L_d\theta)$，所以

$$L(s)=\frac{\frac{2v}{L_d}s+\frac{2v^2}{L_d^2}}{s^2}\,e^{-s\tau}$$

取 $v/L_d=1$ 为单位，$\lvert L(j\omega)\rvert=\frac{2\sqrt{1+\omega^2}}{\omega^2}=1$ 化成 $\omega^4=4\omega^2+4$，$\omega_c=2.197$，正是 CS4278 的 $\Omega$。没有 delay 时 $L(j\omega_c)$ 的 angle 是 $\arctan\omega_c-180^\circ$，

$$\mathrm{PM}=\arctan2.197=65.5^\circ=1.1434\ \text{rad},\qquad \tau_c=\frac{\mathrm{PM}}{\omega_c}=\frac{1.1434}{2.197}=0.520$$

CS4278 解出的 phase 条件 $\omega\tau=\arctan\Omega$ 就是“delay 吃掉的 phase 等于 PM”。$L_d=kv$ 的做法让 $\omega_c$ 和 $1/\tau$ 按同一比例变，PM 不变。

**HARVARD-CS249R 的 latency。** 把 CS249R 的 perception 放进这辆车的 loop，$v=1.5$ m/s：queue 长度为 1 时 latency 最多 72.3 ms，要 $L_d\ge0.0723\times1.5/0.520=0.21$ m；FIFO 10 秒后的 1.7 s 要 $L_d\ge4.9$ m，而且 latency 还在涨，迟早超过任何 $L_d$ 的 margin。“宁可丢 frame”在 loop 里的意思是：丢 frame 的代价是 sample 变稀，排队的代价是 $\tau$ 无限增长。

**同一个公式，五个 loop。**

| Loop | $L(s)$（不含 delay） | $\omega_c$ | PM | $\tau_c=\mathrm{PM}/\omega_c$ |
|---|---|---|---|---|
| 开头的 current loop | $\dfrac{5}{1+s/2000}$ | 9798 rad/s | $101.5^\circ$ | 0.181 ms |
| EE3331C 的 motor，$K=3.34$ | $\dfrac{66.8}{s(s+2)(s+20)}$ | 1.37 rad/s | $51.6^\circ$ | 0.66 s |
| CS4278 pure pursuit，$v=1.5$，$L_d=1$ | 上式 | 3.30 rad/s | $65.5^\circ$ | 0.347 s |
| LSM2234 negative autoregulation | $\dfrac{1.6\alpha}{s+\alpha}$ | $1.249\,\alpha$ | $128.7^\circ$ | 77.8 min |
| SIO-210 El Niño（下面的 warm state） | $\dfrac{0.75}{s-0.25}$ | 0.707 | $70.5^\circ$ | 1.74 |

**El Niño：plant 自己放大，negative feedback 晚到。** Battisti 与 Hirst（1989）把 eastern equatorial Pacific 的 SST anomaly $T$ 写成 $\dot T=T-\alpha T(t-\tau)$：$+T$ 是 Bjerknes 的 positive feedback，$-\alpha T(t-\tau)$ 是 ocean wave 带回来的 negative feedback，晚了 wave 横穿 basin 的时间。Suarez 与 Schopf（1988）加上 $-T^3$：

$$\dot T=T-\alpha\,T(t-\tau)-T^3,\qquad 0<\alpha<1$$

时间以 Bjerknes 那一项的 growth time 为单位。$T=0$ 总是 unstable 的（$\tau=0$ 时 rate 是 $1-\alpha>0$），另有两个 equilibrium $T_1=\pm\sqrt{1-\alpha}$，一个偏暖、一个偏冷。取 $\alpha=0.75$，$T_1=0.5$。在它附近 $T=0.5+y$，$T-T^3$ 的 slope 是 $1-3\times0.25=0.25$：

$$\dot y=0.25\,y-0.75\,y(t-\tau)$$

这是骨架里 $a=-0.25$ 的情形：plant 自己以 rate 0.25 放大偏差，feedback 的 $g=0.75$ 更强，所以 $\tau=0$ 时 rate $0.25-0.75=-0.5$，stable。$L(s)=\frac{0.75\,e^{-s\tau}}{s-0.25}$ 在 right half-plane 有 pole，是 EE3331C 第 6 站 inverted pendulum 那一类 loop。Crossover：$\sqrt{\omega^2+0.25^2}=0.75$，$\omega_c=0.707$；$j\omega_c-0.25$ 的 angle 是 $180^\circ-\arctan(0.707/0.25)=109.5^\circ$，所以没有 delay 时 $L(j\omega_c)$ 的 angle 是 $-109.5^\circ$，

$$\mathrm{PM}=70.5^\circ=1.231\ \text{rad},\qquad\tau_c=\frac{1.231}{0.707}=1.74$$

Simulate 这个 nonlinear 的 equation（从 $T=0.6$ 出发）：$\tau=1.6$ 时 $T$ 停在 0.5，Pacific 永远偏暖；$\tau=1.9$ 时 warm state 失去 stability，$T$ 在 $-0.99$ 和 $0.99$ 之间来回，period 10.1；$\tau=4$ 时 period 12.3（$3.1\tau$），$\tau=6$ 时 16.2（$2.7\tau$），向 Suarez 与 Schopf 数值上得到的“period 约为 delay 的两倍”靠拢。Ghil 等人按 wave 的横穿时间估计 $\tau$ 约 6 到 8 个月，并指出这样得到的 period 只有观测到的 2 到 7 年的一半左右；SIO-210 用 $c=2.1$ m/s 算出的一来一回是 331 天。

::fig[thread-feedback-enso] 上面是 equatorial Pacific 的截面，thermocline 的东端随 $T$ 上下（$T>0$ 时东边变深、变暖）。下面是 $\tau=4$ 的 $T(t)$：实心点是现在的 $T$，空心点是 $\tau$ 以前的 $T$，它正是此刻起作用的 negative feedback。看 $T$ 刚升到顶时，空心点还在底部：此刻起作用的 feedback 依据的是偏冷的旧值，还在往暖的方向推；等空心点也升上来，feedback 才反向，把 $T$ 推到另一侧。

Delayed oscillator 和开头第三件事、CS4278 的车在 $\tau>0.347$ s 时来回晃、LSM2234 的 gene 在 $\tau>78$ min 时 oscillate，是同一个 mechanism：feedback 的方向对，但晚到了 PM 对应的那段 phase，于是在 $\omega_c$ 上推的方向和偏差一致。差别只在 plant：El Niño 的 plant 本身会放大（Bjerknes），没有 delay 的 negative feedback 能把它按住在偏暖或偏冷的一侧，晚到之后就只能让它来回翻。

:::from
骨架是这一页自己的组织，三部分各有对照。$S=\frac1{1+L}$、disturbance 被除以 $1+L$、$S+T=1$、delay margin $\tau_{\max}=\mathrm{PM}/\omega_c$ 以及 $Z=N+P$ 的 open-loop unstable 情形，取自 [EE3331C](../courses/EE3331C.html) 的第 1、6 站（它们的讲法跟 MIT 16.06 与 Åström、Murray）；这里改用 log derivative 推 $S$，加了 feedforward $F$。Åström 与 Murray 第 2 章（[Feedback Principles](http://www.cds.caltech.edu/~murray/books/AM08/pdf/fbs-principles_24Jul2020.pdf)）这次抓取被拦下，没有读到。$s+a+ge^{-s\tau}=0$ 的穿越分析、“$g\le a$ 时任何 delay 都不能 destabilize”、$g\tau_c\to\pi/2$ 与那张 $L$ 的表、离散 loop 的 $c_{\max}=2\sin\frac{\pi}{2(2d+1)}$ 及其连续极限，是我按标准方法推的，数值用 numpy 核对过，没有对着某一讲。

Negative autoregulation 的 model、E. coli 里 40 个 autoregulation 中 32 个是 negative、step 形 Hill function 下 response time 约为 $K/\beta$、steep repression 让 steady state 几乎只由 $K$ 决定（只有定性的说法）、两步 loop 的 Jacobian 与“delay 让 negative feedback 出现 damped oscillation”，对照了 [Karin 的 Lecture 2](https://karin-lab.github.io/sysbio2023/lecture_2_autoregulation.pdf)（读的是逐节转述）；sensitivity 0.385、7.2% 与 8.3%、带 delay 的 $\tau_c=1.80/\alpha$ 与 77.8 min、limit cycle 的 simulation、$n=1$ 的对比，是我算的。$\Delta T=\Delta T_0/(1-f)$、$\lambda_0=1/(4\sigma T_e^3)=0.26$、$f\approx0.65$、“$f\ge1$ 时没有新的 equilibrium”来自 [Roe 与 Baker 的补充材料](https://earthweb.ess.washington.edu/roe/Web/GerardWeb/Publications_files/RoeBakerSOM_Science_07.pdf)，“response 正比于 $1/(1-f)$，长尾来自 $f$ 的分布”来自 [RealClimate 对该文的介绍](https://www.realclimate.org/index.php/archives/2007/10/the-certainty-of-uncertainty/)；两处都是转述，不是全文。Cobweb 的设定（按上期 price 生产、按 demand 定 price）、hog cycle 的例子、adaptive expectations 的写法来自 [QuantEcon 的 Cobweb Model 一讲](https://intro.quantecon.org/cobweb.html)，它没有给出 slope 条件；收敛条件的 slope 与 elasticity 两种说法和 Kaldor 1934 来自 [Wikipedia 的 Cobweb model 条目](https://en.wikipedia.org/wiki/Cobweb_model)。Cobweb 与 $c=1+b_S/b_D$ 的对应、adaptive expectations 是把 gain 乘 $\alpha_e$、price 是 integrator 的论证，是我推的。Battisti 与 Hirst 的 $\dot T=T-\alpha T(t-\tau)$、各项的物理意义、Suarez 与 Schopf 的 $-T^3$、$0<\alpha<1$、两个外侧 equilibrium、period 约为 $2\tau$、$\tau$ 约 6 到 8 个月及其与观测周期的差距，来自 [Ghil、Zaliapin 与 Thompson（2008）](https://arxiv.org/pdf/0712.1312) 的引言（转述）；方程的形式也对照了 [arXiv:2102.11711](https://ar5iv.labs.arxiv.org/html/2102.11711) 的引言。$\alpha=0.75$ 是我取的值，warm state 的 linearization、$\tau_c=1.74$ 和各个 period 是我 simulate 的；两篇原始论文（Suarez 与 Schopf 1988、Battisti 与 Hirst 1989）本身没有读到。

各门课的设定和数字取自对应的课程页。开头 current loop 的发热（$R$ 升 20%）、feedforward 加 P 的写法、0.1 与 0.2 ms 的 delay、back-EMF 0.5 V 的例子，toggle switch 对单个 node 的放大 $\frac1{1-a^2}$，pure pursuit 的 loop transfer function 与 PM，CS249R 的 latency 换算成 $L_d$，都是为这一页算的。把 LSM2213 的 threshold 读成“positive loop 的 gain 超过 1 的 unstable equilibrium”是我的解读，LSM2213 的页面只说 inward current 胜出的交叉点。“current loop 要放在 driver 里以更高的 rate 运行”是由 $\tau_c=0.18$ ms 推出的结论，我没有对着具体的 driver datasheet 核对它的 sampling rate。
:::
