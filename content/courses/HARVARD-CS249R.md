---
code: HARVARD-CS249R
evidence: syllabus
evidenceNote: "前沿公开课，没有 NUS 大纲，也不是一期有固定日程的课。分站按 MLSysBook Volume I 的 16 周 semester plan（Instructor Hub 的 foundations syllabus），侧重其中和 edge deployment 有关的章节；材料全部来自 harvard-edge/cs249r_book 仓库（2026 年 11 月 20 日的 commit 重新 clone 核对过）：教材源文件、TinyTorch 20 个 module 的 guide（全部 20 页的 “When it fails” 都对过）和部分源码、Raspberry Pi 五个 kit lab 与 XIAO ESP32S3 KWS lab 的源文件、Co-Labs 的 learning path 和 Lab 01 的 instructor note。教材正文的数字由 mlsysim 在构建时算出，源文件只有变量名；这次读了 mlsysim 的 scenario 定义，引用的几个教材例子（1500 km 的 robot arm、2/8/1 s 的 iron law）数字取自那里，其余数字是 lab 实测、论文和我自己算的。另外读了 MIT 6.172 Lecture 1、Stanford CS329S 的 distribution shift 讲义、MLPerf Inference、TensorFlow Lite Micro、CMSIS-NN 和 Mohan et al. 的 data stall 论文，以及 PyTorch DataLoader 文档。没有找到公开的课堂录像；Co-Labs 是在浏览器里跑的交互 notebook，我只读了源码里的题目和结构，没有实际跑。"
exam: "无考试；以作业为主。Instructor Hub 给的建议比例是：TinyTorch module（8 个，autograde）35%，lab 的 Decision Log（短的书面分析）25%，lab 里开放的 design challenge 20%，capstone（把一个应用 deploy 到几种 hardware 上并写 design report）20%；每次开课自己定。"
subskills:
  - id: env
    name: Deployment envelope 与 iron law
    l3: "有提示能做：给出距离和 control frequency，算出 cloud round trip 的下界，判断 model 能不能放在远端。"
    l4: "能独立做：把一次 inference 的时间拆成 memory、compute、overhead 三项，用 Amdahl's law 算出只加速其中一段时总时间能降多少。"
    l5: "能讲给别人：说明为什么 latency、power、memory 三条物理限制把 deployment 分成 cloud、edge、mobile、TinyML 四档，以及 overhead 项为什么在小 model 上反而最要紧。"
  - id: data
    name: ML lifecycle 与 data engineering
    l3: "有提示能做：找出一段 preprocessing 代码里 training 和 serving 用了不同 state 的地方。"
    l4: "能独立做：按 episode 切分 robot data，算出 dataloader 需要几个 worker 才能让 GPU 不等 data。"
    l5: "能讲给别人：解释 training-serving skew 为什么不报错、为什么“共用代码”不够，以及 data cascade 为什么在 deployment 时才暴露。"
  - id: kernel
    name: 从 framework 到 kernel
    l3: "有提示能做：写出一个 tensor 的 stride，说出 transpose 为什么不用 copy。"
    l4: "能独立做：用 cache line 解释 loop order 的快慢，按 L1 的大小选 tile size，把一个 convolution 用 im2col 写成 GEMM 并算出 memory 的放大倍数。"
    l5: "能讲给别人：从 dispatch overhead、data movement、interpreter 三个角度说明同样的 multiply-add 为什么能差两三个数量级，以及什么时候 tiling 写在 Python 里没有用。"
  - id: deploy
    name: On-device deployment：export、runtime 与 memory planning
    l3: "有提示能做：按 input tensor 的 scale 和 zero point 把一张图转成 int8 input。"
    l4: "能独立做：对一个小 network 按 lifetime 用 first-fit decreasing 排出 tensor arena，并和各占一块的大小比较。"
    l5: "能讲给别人：说明 export 把哪些东西固定进了 graph、为什么同一种 export 对不同 model 效果相反，以及 cold start 的时间花在哪里。"
  - id: serve
    name: Serving：latency budget、pipeline 与 batching
    l3: "有提示能做：用 Little's law 和 M/M/1 的 formula 算出平均 latency 和在系统里的 request 数。"
    l4: "能独立做：把 camera pipeline 拆成 stage，算出 serial 和 pipeline 化后的 throughput 与 latency，并给 batch size 选一个能稳定的值。"
    l5: "能讲给别人：解释 robot 的 perception 为什么宁可丢 frame 也不排队，以及 utilization 接近 1 时 tail latency 为什么爆炸。"
  - id: bench
    name: Benchmarking、profiling 与 energy
    l3: "有提示能做：从一组 latency 里算 median、p90、p99，并用 t distribution 给 mean 的 confidence interval。"
    l4: "能独立做：照 MLPerf 的四种 scenario 选一个和 deployment 场景对应的测法，说出要多少个 query 才能可信地报 p99。"
    l5: "能讲给别人：用 $P\\propto f^3$ 推出什么情况下应该跑满 frequency 再 sleep、什么情况下应该降低 frequency，并说明 burst benchmark 为什么高估 edge device。"
  - id: ops
    name: MLOps 与 robustness
    l3: "有提示能做：区分 covariate shift、label shift、concept drift，并各举一个 robot 上的例子。"
    l4: "能独立做：在没有 label 的情况下用 prediction 的 distribution 做 two-sample test，算出 canary 要多少个 sample 才能看出 1 个百分点的 accuracy 下降。"
    l5: "能讲给别人：设计一个 edge device 上的 OTA 更新和回滚流程，并说明 fp32 与 int8 在 bit flip 下为什么脆弱程度不同。"
open:
  - label: "MLSysBook Volume I: Introduction to Machine Learning Systems（Vijay Janapa Reddi），2026 版源文件"
    url: "https://mlsysbook.ai/vol1/"
    note: "从 GitHub 仓库 clone 后按需读了源文件的正文部分：Introduction 的 silent degradation 与 iron law 两节（全文）、System Paradigms 的 physical constraints、distance penalty 和 tier 对比、ML Lifecycle 的六个阶段与 constraint propagation、Data Engineering 的 data cascade、training-serving consistency 与 feeding problem、ML Frameworks 的 dispatch overhead 与 overhead ratio、Hardware Acceleration 的 tensor layout（NCHW 与 NHWC）、Model Serving 的 Little's law、M/M/1 的 mean 与 p99、batching 的两种 trigger、Benchmarking 的 percentile、warm-up 与 “1 W AI” 的例子、ML Operations 的 canary、Knight Capital、WCET、OTA 与 graceful degradation。各章其余部分没读。"
  - label: "MLSysBook Instructor Hub：Introduction to ML Systems 的 16 周 syllabus 与 Edge AI reading list"
    url: "https://mlsysbook.ai/instructors/foundations-syllabus.html"
    note: "读了全文（仓库里的源文件），以及同目录下的 Edge AI reading list。分站顺序和 frontmatter 的考核比例来自这里。"
  - label: "TinyTorch：20 个 module 的源码与 guide（harvard-edge/cs249r_book 仓库的 tinytorch/ 目录）"
    url: "https://github.com/harvard-edge/cs249r_book"
    note: "读了 README、Getting Started（含 milestone 表）、全部 20 个 module guide 的 Overview、时间与前置、“What you'll build” 和 “When it fails”，以及 Module 14、17、19 源码里的讲解部分。第 3、6 站和“作业”一节的主要来源。"
  - label: "MLSysBook Hardware Kits：Raspberry Pi 的 Setup、Image Classification、Object Detection、Small Language Models、Vision-Language Models 实验；XIAO ESP32S3 的 Keyword Spotting 实验"
    url: "https://mlsysbook.ai/kits/contents/raspi/raspi.html"
    note: "Object Detection 读了 YOLO 部分全文（含 export 对比、imgsz 规则、cold 与 warm 两次运行）和 SSD、FOMO 的结果；Setup 读了 swap（zram 对 swap file）、温度和 power 测量两节；Image Classification 读了 int8 input 的 preprocessing 代码和 latency；SLM 读了 Ollama 的计时和温度；VLM 读了 Florence-2 的介绍、计时汇总和 memory；KWS 读了 PSRAM、MFCC 和部署，Edge Impulse 的 on-device performance 截图也看了。"
  - label: "MLSysBook Co-Labs：Volume I 的 17 个交互 lab（labs/ 目录）"
    url: "https://mlsysbook.ai/labs/"
    note: "读了 README、Lab 01 的 instructor note、Lab 02 的源码和 Volume I learning path（每个 lab 的 part 与问题）。没有在浏览器里实际跑过。“作业”一节的 Co-Labs 部分来自这里。"
  - label: "MIT 6.172 Performance Engineering of Software Systems（Fall 2018）Lecture 1：Introduction and Matrix Multiplication"
    url: "https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/d0c73dd51c79b95196a2e6faa824e1b4_MIT6_172F18_lec1.pdf"
    note: "读了 slides 全文，其中机器规格、loop order 的六种时间与 miss rate、tile size 表和最后的汇总表又逐项核对了一遍。第 3 站的 loop order、tiling 和那张 11 个版本的表来自这里。"
  - label: "Stanford CS329S Machine Learning Systems Design（Chip Huyen）：Data Distribution Shifts and Monitoring 讲义"
    url: "https://huyenchip.com/2022/02/07/data-distribution-shifts-and-monitoring.html"
    note: "读了全文。第 7 站的 failure 分类、三种 shift、two-sample test 和 time window 的讲法来自这里。"
  - label: "Reddi et al.：MLPerf Inference Benchmark（ISCA 2020）"
    url: "https://ar5iv.labs.arxiv.org/html/1911.02549"
    note: "读了正文前 100,000 个字符（几乎全文）。第 6 站的四种 scenario 和 query 数的计算。"
  - label: "David et al.：TensorFlow Lite Micro: Embedded Machine Learning on TinyML Systems"
    url: "https://arxiv.org/pdf/2010.08678"
    note: "读了 arena、memory planner 和 benchmark 几节。第 1、4 站。"
  - label: "Lai, Suda, Chandra：CMSIS-NN: Efficient Neural Network Kernels for Arm Cortex-M CPUs"
    url: "https://ar5iv.labs.arxiv.org/html/1801.06601"
    note: "只读了 convolution 一节里 partial im2col 和 data layout 的段落。第 3 站。"
  - label: "Mohan et al.：Analyzing and Mitigating Data Stalls in DNN Training（VLDB 2021）"
    url: "https://ar5iv.labs.arxiv.org/html/2007.06775"
    note: "读了 abstract、introduction 和主要发现的表（前 100,000 个字符），后半部分没读。第 2 站 feeding problem 的数字。"
  - label: "PyTorch 文档：torch.utils.data（2.2 版）"
    url: "https://docs.pytorch.org/docs/2.2/data.html"
    note: "只读了 DataLoader 的 num_workers、prefetch_factor、pin_memory、persistent_workers 和 multi-process data loading 一节。第 2 站。"
sources:
  - label: "harvard-edge/cs249r_book（教材、TinyTorch、kits 的源仓库）"
    url: "https://github.com/harvard-edge/cs249r_book"
  - label: "Raspberry Pi kit：Object Detection 实验"
    url: "https://mlsysbook.ai/kits/contents/raspi/object_detection/object_detection.html"
---

先看同一个 lab 里的三件事。Raspberry Pi Zero 2 W 上跑一个自己 train 的 YOLO detector，图片是 320×320，model 已经导出成 NCNN 格式。

**第一件。** 导出时忘了写 `imgsz=320`，graph 的 input 被定成了默认的 640×640。拿一张只有一个盒子的图去 predict，输出 113 个 box、164 个 wheel，大多 confidence 是 1.00。程序没有报错，也没有警告。

::fig[cs249r-imgsz] 第一件：train、export、predict 三处的 imgsz 不一致，结果全错，却没有任何报错。

**第二件。** 同一条命令连跑两次。第一次 inference 2545.1 ms，第二次 519.3 ms，差了将近五倍，model 和命令都没变。

**第三件。** 看第二次的时间怎么分：preprocess 237.6 ms，inference 519.3 ms，postprocess 506.7 ms。Inference 只占 41%，postprocess（主要是 NMS）几乎和它一样长。

::fig[cs249r-stages] 第二、三件：两次运行的三段时间，按同一个比例画。

这三件事都和 model 的 accuracy 无关，也都不是“model 不够快”。第一件是 data 进入 model 的方式在 training 和 deployment 两边不一致；第二件是测量方法的问题，第一次付的是从 SD 卡把代码和 weight 读进 memory 的钱；第三件是 model 之外的代码占了一大半时间。这门课研究的就是 model 周围的这一整套东西：data 从哪里来、怎样变成 tensor、framework 怎样把 operation 变成 kernel、导出后的 model 在 device 上怎样被 schedule、怎样量它、怎样在它变坏时发现并修好。

Harvard CS249r 由 Vijay Janapa Reddi 开设，配套一本开源教材（MLSysBook，两卷）、一个自己从零写的 framework（TinyTorch，20 个 module，只用 NumPy）和一组在真实开发板上做的实验（Hardware Kits：Raspberry Pi、Seeed XIAO ESP32S3、Arduino Nicla Vision 等）。本页按 Volume I 的顺序分七站：先讲 deployment 的物理限制和计时的总账（第 1 站），然后是 data（第 2 站），framework 怎样执行（第 3 站），导出到 device 上（第 4 站），device 上怎样排队和 pipeline（第 5 站），怎样测、能耗多少（第 6 站），最后是上线之后（第 7 站）。

和 [MIT 6.5940](../courses/MIT-6.5940.html) 重叠的内容不重复：roofline 和 energy table 在它的[第 1 站](../courses/MIT-6.5940.html#eff)，quantization 在[第 3 站](../courses/MIT-6.5940.html#quant)，MCU 的 peak activation 在[第 7 站](../courses/MIT-6.5940.html#mcu)，VLA 在 Jetson 上的 latency 下界在[第 8 站](../courses/MIT-6.5940.html#robot)。Autograd 在 [Karpathy 那一页的第 1 站](../courses/KARPATHY-Z2H.html#micrograd)，GPU 上的 fusion 和 tiling 在 [CS336 的第 5 站](../courses/STANFORD-CS336.html#gpu)。本页讲的是把这些拼成一个能在 robot 上跑的系统时，多出来的那些问题。

| 站 | 回答的问题 | 开头哪件事在这里解释 |
|---|---|---|
| 1 | model 该放在哪里，时间的总账怎么记 | 第三件 |
| 2 | data 怎样变成 model 的 input，怎样不让 GPU 等 | 第一件 |
| 3 | 同样的 multiply-add 为什么快慢差几个数量级 | |
| 4 | 导出后的 model 在 device 上怎样跑、要多少 memory | 第一、二件 |
| 5 | 一串 frame 进来时怎样排 | |
| 6 | 怎样测才可信，耗多少电 | 第二件 |
| 7 | 上线之后变坏了怎么发现 | |

## [env] Deployment envelope 与 iron law

:::skip
快速路线必读。能算出 Singapore 到最近几个 cloud region 的 round trip 下界，说出 iron law 的三项各由什么决定，并用 Amdahl's law 算出开头第三件事里 model 快一倍时总时间降多少，就可以去第 2 站。
:::

### 光速给 cloud 定了一个下界

一台 robot 的 control loop 跑 50 Hz，每个周期 20 ms。Perception model 能不能放在 cloud 上，每个 frame 把图像传过去、把结果传回来？

先不管网络拥塞、routing 和服务器上的计算，只看光。光在 fiber 里的速度大约是真空中的三分之二，200,000 km/s。往返一次的最短时间是

$$t_\text{RTT}\ge\frac{2\times\text{distance}}{200{,}000\ \text{km/s}}$$

从 Singapore 出发，按 great-circle distance 算：

::fig[cs249r-light] 光在 fiber 里往返一次的最短时间，和 50 Hz 的周期比。

到 Mumbai 3904 km，往返至少 39.0 ms；到 Tokyo 5311 km，至少 53.1 ms；到 San Francisco 13582 km，至少 135.8 ms。离开 Singapore 的任何一个 region 都已经是周期的两倍以上。Singapore 本地也有 cloud region，fiber 只有几十 km，传播时间不到 1 ms；这时限制换成了 Wi-Fi 和 internet 上的排队与抖动，它们没有可靠的上界，网络断掉时 robot 也必须能动（这一句是凭我自己的知识写的）。所以 control loop 里的 model 只能放在 robot 身上，或者放在同一个局域网里的 edge server 上。

教材自己的例子更严：工厂里一台 robot arm 的 safety stop 要在看到人之后 10 ms 内完成，model 放在 1500 km 外的 regional cloud 上。光往返一次就要

$$\frac{2\times1500\ \text{km}}{200{,}000\ \text{km/s}}=0.015\ \text{s}=15\ \text{ms}$$

还没开始 inference 就已经超了 5 ms。教材的结论也只到这一步：把 model 搬到 arm 旁边，只是去掉了传播这一项，sensing、inference、control 整条路径还要另外对着 deadline 核一遍。

这是第一条物理限制，教材叫它 light barrier。另外两条是 power wall 和 memory wall。

**Power wall。** CMOS 电路的 dynamic power 是 $P\propto CV^2f$，$C$ 是被开关的 capacitance，$V$ 是 voltage，$f$ 是 frequency。Frequency 提高时 voltage 也要跟着提高，晶体管才能可靠地翻转；近似地取 $V\propto f$，就得到

$$P\propto f^3$$

教材的说法是 frequency 加倍，dynamic power 大约变成 $2^3=8$ 倍。Frequency 提高 50%，power 变成 $1.5^3=3.375$ 倍，这些功率全部变成热，要靠散热片和外壳带走。一台没有风扇的小 robot 能散多少热，决定了它能持续跑多快。第 6 站会用这条关系算 energy。

**Memory wall。** Model 和 activation 必须放得进 device 的 memory，每次 inference 还要把 weight 搬一遍。MIT 6.5940 的[第 1 站](../courses/MIT-6.5940.html#eff)已经从 roofline 讲过：decode 这类 workload 的速度由 bandwidth 决定，不由算力决定。

### 四档 deployment

三条限制哪一条先碰到，取决于 device。教材按 power 把 deployment 分成四档，从 megawatt 级的 data center 到 milliwatt 级的 microcontroller，跨了九个数量级。和 robot 有关的几种 device，数字取自 kit 和 NVIDIA 的资料：

| 档 | 例子 | memory | power | 先碰到的限制 |
|---|---|---|---|---|
| Cloud | data center 的 GPU 服务器 | 几十到几百 GB | 每台几百 W 到几 kW | light barrier：离 robot 太远 |
| Edge | Jetson Orin NX 8GB；Raspberry Pi 5 | 8 GB；4 或 8 GB | 10–20 W；3–10 W | power 和散热，sustained 速度 |
| Mobile | 手机 SoC | 几 GB，和其他 app 共用 | 3–5 W 的 thermal envelope | thermal throttling |
| TinyML | ESP32-S3；Cortex-M4 | 几百 KB 片上 SRAM（ESP32-S3 外加最多 16 MB PSRAM） | mW 级 | SRAM 放不下 activation |

一台 robot 常常同时用到两三档：关节上的 MCU 跑 1 kHz 的电流环，主控的 Jetson 跑 perception 和 policy，大 model 的 fine-tuning 在 cloud 上做。每一档有自己的 runtime、自己的更新方式和自己的失败方式，这就是后面几站要分开讲的原因。

### Iron law：时间的总账

一次 inference 的时间由三件事组成：把 data 搬到计算单元，做计算，以及与 data 量和计算量都无关的固定开销。教材把它写成 ML 系统的 iron law：

$$T=\underbrace{\frac{D_\text{vol}}{BW}}_\text{memory}+\underbrace{\frac{O}{R_\text{peak}\cdot\eta}}_\text{compute}+\underbrace{L_\text{lat}}_\text{overhead}$$

$D_\text{vol}$ 是搬运的 bytes，$BW$ 是 bandwidth；$O$ 是 operation 数，$R_\text{peak}$ 是peak FLOPS，$\eta$ 是实际达到的比例；$L_\text{lat}$ 是 dispatch、schedule、序列化之类的固定开销。这个和式假设三件事依次发生。

教材在它前面还有一个乘积形式，按 data、algorithm、machine 三个因子拆：

$$T=\frac{\text{Samples}}{\text{Task}}\times\frac{\text{FLOPs}}{\text{Sample}}\times\frac{\text{Seconds}}{\text{FLOP}}$$

前两个因子相乘就是 $O$。把上面的和式除以 $O$，得到的正是第三个因子：实际每个 FLOP 花的时间，它由 memory、compute、overhead 三项一起决定，而不是 datasheet 上的 $1/R_\text{peak}$。两种写法是同一条 law。乘积形式说明了为什么 inference 比 training 难跑满：training 一个 step 有成千上万个 sample 共用一次 weight 读取和一次 dispatch，Samples/Task 大，摊下来的 Seconds/FLOP 接近硬件下限；inference 的 Samples/Task 常常是 1，同样的 weight 读取和 overhead 只摊给一个 sample，Seconds/FLOP 就大得多。

搬运和计算能重叠时（hardware 一边算当前这块 data、一边搬下一块），和式里前两项换成两者中大的那个：

$$T\ge\max\!\left(\frac{D_\text{vol}}{BW},\ \frac{O}{R_\text{peak}\cdot\eta}\right)+L_\text{lat}$$

MIT 6.5940 只用了 max 那一部分。这里多出来的 $L_\text{lat}$ 在 server 上的大 model 里可以忽略，在 edge 的小 model 上却常常是主角。

用 TensorFlow Lite Micro 论文里的数检验。同一块 SparkFun Edge（Cortex-M4，96 MHz）跑两个 model，论文分别量了总 cycle 数和 kernel 本身的 cycle 数，差就是 interpreter 的 overhead：

| model | 总 cycle | kernel cycle | overhead | 换成时间 | 占比 |
|---|---|---|---|---|---|
| VWW（person detection，optimized kernel） | 4,857.7 K | 4,852.9 K | 4.8 K cycle | 50.0 µs | 小于 0.1% |
| Google Hotword（optimized kernel） | 36.4 K | 34.9 K | 1.5 K cycle | 15.6 µs | 4.1% |

时间一列是 cycle 数除以 96 MHz，例如 $1.5\times10^3/96\times10^6=15.6\ \mu\text{s}$。两个 model 的 overhead 都是几十 µs，同一个量级；VWW 的 kernel 要算 50 ms，overhead 淹没在里面，Hotword 的 kernel 只算 0.36 ms，overhead 就占了 4%。Model 越小，固定开销越显眼。第 3 站会在 NumPy 上量到一个极端的例子：overhead 比计算本身大 40 多倍。

### 只加速一段：Amdahl's law

开头第三件事里，有人提议换一个快一倍的 model。总时间会降多少？

设被加速的那一段占总时间的比例是 $p$，这一段加速 $s$ 倍，其余不变。新时间是 $(1-p)+p/s$（以原来的总时间为 1），speedup 是

$$\text{speedup}=\frac{1}{(1-p)+p/s}$$

先用教材的例子检验：搬运 2 s、计算 8 s、overhead 1 s，共 11 s，算力加倍。计算变成 4 s，总时间 $2+4+1=7$ s，不是一半的 5.5 s。用公式，$p=8/11$，$s=2$：

$$\frac{1}{3/11+4/11}=\frac{11}{7}=1.571$$

正好是 11 s 除以 7 s。

第二次运行里 $p=519.3/1263.6=0.411$。

- $s=2$：$1/(0.589+0.2055)=1.259$，总时间从 1263.6 ms 降到 1004.0 ms。
- $s=10$：$1/(0.589+0.0411)=1.587$，降到 796.2 ms。
- $s\to\infty$，inference 完全不花时间：$1/0.589=1.698$，还剩 744.3 ms。

Model 再快，这条 pipeline 也到不了 1.7 倍以上。上限由没被加速的 preprocess 和 postprocess 决定。

:::wrong 换一块 peak FLOPS 是原来 10 倍的板子，detector 就快 10 倍
Peak FLOPS 只进 iron law 的 compute 一项，而且只对 model 那一段起作用。上面算过：inference 加速 10 倍，总时间只快 1.59 倍。如果 preprocess 和 postprocess 在新板子的 CPU 上并没有变快，剩下的 744.3 ms 一点不少。还要先问 model 本身是 memory-bound 还是 compute-bound：前者换更高的 peak FLOPS 也没用，要看 bandwidth。正确的做法是先把总时间拆成段（第 6 站的 profiling），看最大的那段归哪一项管，再决定换什么。
:::

:::from
Light barrier、power wall（含“frequency 加倍、power 约 8 倍”）、memory wall 的提法，四档 deployment 和九个数量级，iron law 的乘积形式、和式、重叠时的 max 形式和它与 Amdahl's law 的关系，按 MLSysBook Volume I 的 Introduction（“Iron Law of ML Systems”一节，全文）和 System Paradigms（“Physical Constraints on Deployment”和 distance penalty 的例子）的源文件。教材正文里的数字由 mlsysim 生成；robot arm 的 1500 km 与 10 ms、iron law 的 2/8/1 s 取自仓库里 mlsysim 的 scenario 定义（`RoboticArmRegionalCloud`、`IronLawComputeHeavyExample`），15 ms 和 1.571 是我按教材的公式算的。乘积形式对 training 和 inference 的对比按教材那一节的两条说明改写。三个城市的距离和 RTT 是我用 haversine 公式算的（Earth radius 6371 km）。表里的 device 数字：Jetson Orin NX 的 memory 和 power 取自 [MIT 6.5940 那一页](../courses/MIT-6.5940.html#robot)引用的 NVIDIA 博客，Pi 5 的 power 取自 kit 的 Setup 实验，ESP32-S3 的 SRAM 和 PSRAM 取自 XIAO ESP32S3 的 KWS 实验，手机的 3–5 W 是教材 System Paradigms 一章 power wall 一段引用的 mobile TDP（数值在 mlsysim 的 platform registry 里）；cloud 一行和“一台 robot 用到两三档”是凭我自己的知识写的。TFLM 的 cycle 数出自 [TFLM 论文](https://arxiv.org/pdf/2010.08678)的 Table 2，换算成时间是我算的（论文给的 Hotword 占比是 4.1%，和表里的差一致）。Pi 的三段时间出自 [Object Detection 实验](https://mlsysbook.ai/kits/contents/raspi/object_detection/object_detection.html)，Amdahl 的计算是为这一页做的。
:::

## [data] ML lifecycle 与 data engineering

:::skip
快速路线里可以只读“Training-serving skew”和“Feeding problem”两节。能说出一个不报错的 skew 的例子、按 episode 切分 robot data，并算出要几个 dataloader worker，就可以去第 3 站。
:::

### Lifecycle 是一个环

普通软件的需求写在 spec 里，代码满足 spec 就完成了。ML 系统的“需求”有一大半写在 data 里，而 data 所描述的世界会变。所以 ML 的 lifecycle 是一个环：problem definition → data collection 与 preparation → model development → evaluation → deployment → monitoring，monitoring 发现问题后回到 data。教材强调的是环上的约束会往回传：deployment 目标定下来以后，它会改写前面每一步。

教材用一个时间线说明约束不往回传时会怎样。一个给乡村诊所做 diabetic retinopathy screening 的团队：第 90 天 validation sensitivity 92%，第 120 天调 architecture 调到 94%，第 150 天交给 deployment 工程师，第 151 天发现 model 要 4 GB memory，第 152 天才去查目标 device：诊所里的 edge device 一共 4 到 8 GB，和操作系统、camera pipeline、诊所软件共用，IT 只给 model 留了约 500 MB。第 153 天，五个月的工作作废。Model 的 accuracy 没有问题，问题是 500 MB 这条约束在第一天就该决定哪些 architecture 值得考虑。教材把这叫 constraint propagation principle：越晚发现的约束，要回头返工的阶段越多。

拿开头的 detector 走一遍。Deployment 目标是 Pi Zero 2 W、int8、320×320。这条约束往回传：

1. Model 只能选 YOLO 的 nano 一档或 FOMO 这样的小 model（第 4 站会看到它们在同一块板子上差几十倍）。
2. train 时的 input 也必须是 320×320，所以采集和标注时就要按这个分辨率检查目标还看不看得清。
3. Evaluation 必须在 int8、320×320 的导出 model 上做，而不是在 PyTorch 的 fp32 model 上做。
4. deploy 后 monitoring 只能用 Pi 上便宜的统计量（第 7 站）。

如果到第 3 步才发现目标在 320×320 下太小，就要回到第 1 步重新采集。教材把这种早期的 data 问题在后期才暴露、一路放大的现象叫 data cascade。

### Training-serving skew：不报错的错误

开头第一件事是 skew 的一个例子：training 和 serving 用了不同的 input shape。更隐蔽的 skew 出在 preprocessing 的 state 上。

一个 feature 在 training 时做了 standardization：

$$\hat x=\frac{x-\mu}{\sigma}$$

$\mu$ 和 $\sigma$ 是在 training set 上算的。到了 serving，有人复用了同一个函数，函数内部用“当前这个 batch”的 mean 和 standard deviation。Robot 上每次只来一个 frame，batch size 是 1：

$$\mu_\text{batch}=x,\qquad\hat x=\frac{x-x}{\sigma_\text{batch}+\epsilon}=0$$

无论 $x$ 是多少，送进 model 的都是 0。Model 照样输出一个合法的数，latency 照样很低，没有任何 exception，只是 prediction 和 input 无关了。教材把这条原则叫 consistency imperative：training 里从 data 学到的 state（normalization 的常数、vocabulary、类别编码）必须存下来，和 model 一起发布，serving 时原样使用；只共享代码不够，因为同一段代码在两边各算一遍 state，得到的是两个不同的变换。

:::wrong Training 和 serving 调用的是同一个 preprocess 函数，所以两边一定一致
上面的例子里两边就是同一个函数。函数一样，state 不一样：training 时 batch 有几百个 sample，$\mu$ 接近 training set 的 mean；serving 时 batch 只有 1，$\mu$ 就是这个 sample 本身。检查一致性要比的是“同一个 raw input 在两边变成的 tensor 是否相同”，而不是代码是否相同。教材建议的做法是 parity test：同一条 raw record 分别走 training 和 serving 两条路径，比较输出，允许的数值误差事先写明。
:::

### Split 要按 episode 切

Robot 的 demonstration 是一段一段录的，30 fps 下相邻两个 frame 只差 33 ms，几乎一模一样。如果把所有 frame 混在一起随机切 train 和 test：

::fig[cs249r-split] 同样的三段 data，两种切法。

随机切时，每个 test frame 前后都有几乎相同的 train frame，model 只要记住这一段就能答对，test accuracy 量到的是 memorization。真正要知道的是：换一次物体摆放、换一个光照、换一个操作者之后还行不行。所以 split 的单位必须是 episode（或者更粗：按天、按场地、按操作者）。教材在 keyword spotting 的例子里说的是同一件事：同一个人反复录的几遍 wake word 是 near-duplicate，必须落在同一个 split 里。同样的道理也适用于 preprocessing 的 state：$\mu$、$\sigma$、vocabulary 只能在 training split 上 fit，否则 test set 的信息漏进了 training。

### Feeding problem：别让 GPU 等 data

在 workstation 上 fine-tune 一个 vision policy。每个 batch：CPU 上 decode JPEG 加 augmentation 要 30 ms，GPU 上 forward 和 backward 要 20 ms。5 个 batch 要多久？

**不 prefetch。** 读一个 batch，算一个 batch，再读下一个。每个 batch 30 + 20 = 50 ms，5 个是 250 ms。GPU 有 60% 的时间在等。

**一个 worker 在后台读。** Loader 一直往一个 queue 里放 batch，不等 GPU。Batch $i$ 在 $30(i+1)$ ms 读完；GPU 处理 batch $i$ 的开始时间是“它读完”和“上一个算完”中晚的那个。因为 30 > 20，GPU 每次都比 loader 先空下来，所以 batch $i$ 在 $30(i+1)$ 开始、$30(i+1)+20$ 结束。最后一个在 $30\times5+20=170$ ms 结束。

**两个 worker。** 两个 worker 轮流读，每 30 ms 一起交出两个 batch，loader 的速度变成每 15 ms 一个，比 GPU 的 20 ms 快。GPU 第一次要等 30 ms，之后连续不停：$30+5\times20=130$ ms。

::fig[cs249r-loader] 三种排法的时间线。游标走过时，每个 block 按真实时间长出来。

一般地，有 $W$ 个 worker、每个 batch 的 load 时间是 $t_L$、compute 时间是 $t_C$ 时，steady state 下每个 batch 的时间是

$$\max\!\left(\frac{t_L}{W},\ t_C\right)$$

要让 GPU 不等，需要 $W\ge t_L/t_C=1.5$，取 2。教材把这个缺口叫 feeding problem，并指出它是量出来的，不是假想的：Mohan et al. 测了九个常用的 vision 和 audio model（ShuffleNetv2、AlexNet、ResNet18、SqueezeNet、MobileNetv2、ResNet50、VGG11、SSD+Res18、M5），很多情况下 training time 的大头是 data stall。论文把它分成两种：prep stall（等 decode 和 augmentation，最多占一个 epoch 的 65%，主要花在重复 decode 上）和 fetch stall（等 I/O，blocking I/O 占 epoch 的 10% 到 70%）；要喂饱一块 GPU，preprocessing 需要每块 GPU 3 到 24 个 CPU core，ResNet50 这样计算重的 model 3 到 4 个就够。这正是上面 $t_L/t_C$ 的道理：model 越轻，$t_C$ 越小，要的 worker 越多。

在 PyTorch 里对应的旋钮是 `DataLoader` 的 `num_workers` 和 `prefetch_factor`。`num_workers` 的默认值是 0，意思是在主进程里读 data，也就是上面“不 prefetch”那种排法；设成正整数才会开出那么多个 worker 进程，每个 worker 预先读好 `prefetch_factor` 个 batch（有 worker 时默认 2），所以一共最多预取 $2W$ 个 batch。多开 worker 的代价是 CPU core 和 host memory，在 Jetson 这类 CPU 只有几个 core 的 device 上，worker 还会和 robot 的其他进程抢 core（这一句是凭我自己的知识写的）。

:::edge Decode 放在哪里
一张 JPEG 在磁盘上可能只有几十 KB，decode 成 fp32 tensor 后是 $3\times224\times224\times4=602{,}112$ byte，大约放大一个数量级。在 CPU 上 decode 并转成 fp32 再传给 GPU，搬运的是放大后的 bytes；只传 uint8 像素、到 GPU 上再转 fp32，就少搬四倍。教材的说法是：compression 用 CPU 的 decode 工作换 storage bandwidth，每一处都要算清楚是哪边先成为瓶颈。反过来把 decode 好的 tensor 存在磁盘上省掉 decode，storage 就要按放大后的 bytes 供货，而且 augmentation 的 random crop 被固定了，每个 epoch 看到的是同一份。
:::

:::from
Lifecycle 的六个阶段、constraint propagation principle 和 diabetic retinopathy 的时间线，按 MLSysBook Volume I 的 ML Lifecycle 一章源文件；data cascade（教材在 Data Engineering 一章定义，引 Sambasivan et al. 2021）、consistency imperative 与 training-serving skew 的定义（教材的例子正是 serving 时按 batch 重算 mean 和 variance）、parity test、feature state 只在 training split 上 fit、KWS 里同一说话人的 near-duplicate、feeding problem、compression 用 CPU 换 bandwidth 和预存 decode 后 tensor 的代价，按 Data Engineering 一章源文件（“Training-serving consistency”“The feeding problem”两节读得最细）。九个 model、65%、10–70%、3 到 24 个 core 出自 [Mohan et al. 的论文](https://ar5iv.labs.arxiv.org/html/2007.06775)的 abstract、Table 1 和第 4.3 节。`num_workers` 默认 0、`prefetch_factor` 默认 2 和“共 $2W$ 个 batch”出自 [PyTorch 2.2 的 DataLoader 文档](https://docs.pytorch.org/docs/2.2/data.html)。Batch size 为 1 时 standardization 退化成 0 的算式、episode split 的图、dataloader 的三种排法和 $\max(t_L/W,t_C)$ 是我为这一页构造的例子（教材在 data ingestion 一节给了同样的 slowest-stage bound）；Jetson 上抢 core 的说法是凭我自己的知识写的。Detector 的 deployment 约束取自 Object Detection 实验。
:::

## [kernel] 从 framework 到 kernel

:::skip
快速路线必读，它对应 TinyTorch 最值得做的 Module 17。能解释 loop order 为什么让 MIT 6.172 的 C 程序快 6.5 倍、按 L1 大小算出 tile size、写出 im2col 的 shape 和 memory 放大倍数，并说出一个小 MLP 的时间为什么几乎全是 dispatch overhead，就可以去第 4 站。
:::

### 同样的 multiply-add，差五万倍

MIT 6.172 的第一讲做了一个实验：两个 $4096\times4096$ 的 double matrix 相乘，一共 $2n^3=2^{37}\approx1.37\times10^{11}$ 次 floating-point operation，在一台 18 core 的 Haswell 服务器上，从 Python 一路改到手写 AVX：

| 版本 | 时间（s） | 相对上一版 | 相对 Python | 占峰值 |
|---|---|---|---|---|
| Python 三重循环 | 21041.67 | | 1 | 0.001% |
| Java | 2387.32 | 8.8× | 9 | 0.007% |
| C | 1155.77 | 2.1× | 18 | 0.014% |
| 交换 loop order | 177.68 | 6.5× | 118 | 0.093% |
| compiler optimization flag | 54.63 | 3.3× | 385 | 0.301% |
| parallel loop（18 core） | 3.04 | 18.0× | 6,921 | 5.4% |
| tiling | 1.79 | 1.7× | 11,772 | 9.2% |
| parallel divide-and-conquer | 1.30 | 1.4× | 16,197 | 12.6% |
| compiler vectorization | 0.70 | 1.9× | 30,272 | 23.5% |
| AVX intrinsics | 0.39 | 1.8× | 53,292 | 41.7% |
| Intel MKL | 0.41 | | 51,497 | 40.1% |

每一行做的 multiply-add 个数完全一样。前三行差在 interpreter；第四行只是把三重循环换了个顺序，没有多用任何 hardware，却快了 6.5 倍。后面每一行都对应 iron law 里的一项：parallel 和 vectorization 提高 $R_\text{peak}\cdot\eta$，loop order 和 tiling 减少从 DRAM 搬的 bytes。下面三节分别讲 interpreter、loop order 和 tiling，最后一节把 convolution 也变成这种 matrix multiplication。

### Eager execution 的 dispatch overhead

PyTorch 默认是 eager execution：Python 每执行一行，就把一个 operation 交给 C++ 后端，后端选 kernel、分配 output、再执行。每个 operation 都付一次这样的固定开销，就是 iron law 里的 $L_\text{lat}$。

我在写这一页用的 container 上量了一次（2 核 Xeon 2.1 GHz，NumPy 2.5，取 7 次的 median）。一个 keyword spotting 大小的 MLP，40 → 64 → 64 → 12，三层，每层是 matmul、加 bias、ReLU 三个 NumPy 调用：

$$\text{FLOPs}=2\times(40\times64+64\times64+64\times12)=14{,}848$$

- Batch size 1：每次 forward 6.8 µs。
- 同一台机器上 $1024\times1024$ 的 GEMM 跑到约 100 GFLOPS，按这个速度，14,848 个 FLOP 只需要 0.15 µs。
- 所以 6.8 µs 里大约 98% 是 9 次调用的固定开销，平均每次约 0.76 µs。
- Batch size 16：一次 10.8 µs，每个 sample 0.68 µs；batch size 256：每个 sample 0.28 µs。

FLOP 数多了 256 倍，时间只多了 10 倍。小 operation 的时间由“调用了几次”决定，不由“算了多少”决定。教材把这种 workload 叫 overhead-bound。解决办法有两类：把很多小 operation 合成一个（graph capture、`torch.compile`、导出成静态 graph 后由 runtime 一次 schedule），或者把很多 sample 合成一个 batch（第 5 站）。TinyTorch Module 17 的结论更直接：它把 Module 09 里七重 Python 循环的 convolution 换成一次 matrix multiplication，快两到三个数量级，原因就是 multiply-add 不再经过 interpreter。

:::wrong 在 Python 里把 matrix multiplication 改写成分块的 tiling，就会像 MIT 6.172 那样变快
TinyTorch Module 17 专门测了这件事：用 Python 循环遍历 tile、每个 tile 调一次 NumPy，比直接调一次 `a @ b` 慢。原因是 NumPy 背后的 BLAS 已经在 assembly 里做好了 register 和 cache 两级的 tiling，外面再包一层 Python 循环，只是加了很多次 interpreter 的迭代。Module 17 的 tile sweep 里 tile 越大越快，也是因为 tile 越大，Python 迭代越少，这和 L1 能放多少无关。Tiling 的道理要在compile 过的代码里（C、CUDA、Triton）才看得到；在 Python 层面写它，是为了看懂累加的顺序。
:::

### Loop order：一次搬一整条 cache line

C 版本的三重循环是

```c
for (int i = 0; i < n; ++i)
  for (int j = 0; j < n; ++j)
    for (int k = 0; k < n; ++k)
      C[i][j] += A[i][k] * B[k][j];
```

C 的二维 array 是 row-major：`B[k][j]` 和 `B[k][j+1]` 在 memory 里挨着，`B[k][j]` 和 `B[k+1][j]` 相隔一整行，也就是 $4096\times8=32{,}768$ byte。CPU 从 DRAM 读 data，一次读一整块连续的 memory，叫 cache line；在 6.172 用的 Haswell 上一条 line 是 64 byte，也就是 8 个 double（cache 的基本结构见 [CS2100 的 cache 一站](../courses/CS2100.html#cache)）。

最内层循环是 `k`。每加 1，`B[k][j]` 就跳到下一行，落在另一条 cache line 上。这条 line 搬进来 8 个数，这一步只用了 1 个，剩下 7 个等到下次要用时早已被挤出 cache（B 有 $4096^2\times8=134$ MB，比 25 MB 的 L3 大得多）。搬进来的 bytes 只用上 12.5%。

把 `j` 和 `k` 两层交换：

```c
for (int i = 0; i < n; ++i)
  for (int k = 0; k < n; ++k)
    for (int j = 0; j < n; ++j)
      C[i][j] += A[i][k] * B[k][j];
```

结果不变，因为每个 `C[i][j]` 加上的还是同样那些项，只是加的先后不同。现在最内层沿 `B[k][·]` 和 `C[i][·]` 的一行走，一条 cache line 里的 8 个数接连都用上；`A[i][k]` 在内层不变，放在 register 里。

::fig[cs249r-cache] 两种 loop order 下，最内层循环 8 步读 B 的哪些数、搬进了多少条 cache line。为了画得下，这里一条 line 只装 4 个数。

6.172 把六种顺序都跑了，并用 Cachegrind 量了 last-level cache 的 miss rate：

| loop order（外 → 内） | 时间（s） | LLC miss rate | 最内层循环沿哪里走 |
|---|---|---|---|
| i, k, j | 177.68 | 1.0% | B 和 C 的一行，连续 |
| k, i, j | 179.21 | 1.0% | B 和 C 的一行，连续 |
| j, i, k | 1080.61 | 8.6% | A 的一行连续，B 的一列跳行 |
| i, j, k | 1155.77 | 7.7% | A 的一行连续，B 的一列跳行 |
| k, j, i | 3032.82 | 15.4% | A 和 C 的一列，都跳行 |
| j, k, i | 3056.63 | 15.4% | A 和 C 的一列，都跳行 |

最后一列是按上面 row-major 的分析推的：最内层的 index 是 `j` 时，B 和 C 都沿行走，全部连续；是 `k` 时，A 连续、B 跳行；是 `i` 时，A 和 C 都跳行，最慢。最快和最慢差 $3056.63/177.68=17.2$ 倍，multiply-add 一个没少。

### Tiling：让搬进来的数被反复用

交换 loop order 之后，每一行 B 用完就被挤出 cache；下一个 `i` 又要把整个 B 从 DRAM 重读一遍。B 一共被读了 $n$ 遍，$n^3$ 个数：

$$4096^3\times8\ \text{byte}=5.5\times10^{11}\ \text{byte}=550\ \text{GB}$$

办法是把三个 matrix 切成 $t\times t$ 的 tile，一次只算一个 C 的 tile，每次只从 A 和 B 各取一个 tile 进来累加：

$$C_{IJ}\mathrel{+}=A_{IK}\,B_{KJ},\qquad K=0,1,\dots,\tfrac nt-1$$

::fig[cs249r-tile] $n=8$、$t=4$ 时的 8 步。每步只有三个 tile 需要在 cache 里。

数一下搬运量。C 有 $(n/t)^2$ 个 tile，每个要走 $n/t$ 步，每步从 DRAM 搬进 A、B 各 $t^2$ 个数：

$$\left(\frac nt\right)^2\cdot\frac nt\cdot2t^2=\frac{2n^3}{t}$$

不分 tile、每个 multiply-add 都去 DRAM 取的话是 $2n^3$。Tiling 把搬运量除以 $t$。图里 $n=8,t=4$：$2\times512/4=256$ 对比 1024。$n=4096,t=32$ 时，B 那部分从 550 GB 降到 17.2 GB。

$t$ 能取多大，由 cache 决定：一步里 A、B、C 三个 tile 要同时在 L1 里。6.172 那台机器的 L1 data cache 是 32 KB，double 是 8 byte：

$$3t^2\times8\le32{,}768\quad\Longrightarrow\quad t^2\le1365.3\quad\Longrightarrow\quad t\le36.9$$

取 2 的 power，是 32。6.172 实测的 tile size 表：

| $t$ | 4 | 8 | 16 | 32 | 64 | 128 |
|---|---|---|---|---|---|---|
| 时间（s） | 6.74 | 2.76 | 2.49 | 1.74 | 2.33 | 2.13 |

最快的正是 32；到 64 时三个 tile 共 96 KB，放不进 L1，又变慢。TinyTorch Module 17 用 fp32 做同样的推导，$3t^2\times4\le32{,}768$，得到 $t\le52$。两级 cache 就有两个 tile size 要调，6.172 的说法是只能靠实验，不能用 binary search。

### Convolution 变成 GEMM：im2col

上面的优化都是针对 matrix multiplication 的，BLAS 库、GPU 的 Tensor Core、NPU 的 systolic array 也都是为它设计的。Convolution 要用上它们，就得先变成 matrix multiplication。

每个 output 位置的值，是 kernel 和对应的那块 input（叫 patch 或 receptive field）的 inner product。把每个 patch 展平成一行，所有行叠起来，就是一个 matrix $X_\text{col}$；kernel 展平成一列，两者相乘就是全部 output。

::fig[cs249r-im2col] 1 个 channel、$3\times3$ input、$2\times2$ kernel 的 im2col，例子取自 TinyTorch Module 17。

一般地，input 是 $(N, C_\text{in}, H, W)$，kernel 是 $(C_\text{out}, C_\text{in}, K, K)$：

$$X_\text{col}\in\mathbb R^{(N\,H_\text{out}W_\text{out})\times(C_\text{in}K^2)},\qquad W_\text{row}\in\mathbb R^{(C_\text{in}K^2)\times C_\text{out}},\qquad Y_\text{col}=X_\text{col}W_\text{row}$$

再把 $Y_\text{col}$ reshape、transpose 回 $(N, C_\text{out}, H_\text{out}, W_\text{out})$。

代价是 memory。相邻 patch 重叠，stride 1 时每个像素被复制最多 $K^2$ 次。Module 17 的例子：input $(4,32,32,32)$，$3\times3$ kernel，stride 1，padding 1。

- Input：$4\times32\times32\times32=131{,}072$ 个 fp32，524,288 byte，约 0.52 MB。
- $X_\text{col}$：$(4\times32\times32)\times(32\times9)=4096\times288=1{,}179{,}648$ 个，4,718,592 byte，约 4.72 MB，是 input 的 9 倍。

在有几 GB memory 的 Pi 或 Jetson 上这没问题。在一块几百 KB SRAM 的 MCU 上，展开整个 input 是不可能的。Arm 给 Cortex-M 写的 kernel 库 CMSIS-NN 用的是 partial im2col：每次只展开很少几列（论文举的是 2 列），刚好够让 matrix multiplication 的 kernel 跑到最快，展开的 buffer 却很小。论文里的 CIFAR-10 network 如果不用 partial im2col，memory footprint 约 332 KB，放不进那块板子。

:::edge Tensor 的 layout 与 stride
Framework 里的 tensor 是一块连续 memory 加上 shape 和 stride。Shape $(1,3,4,4)$ 的 NCHW tensor，stride 是 $(48,16,4,1)$ 个元素：沿 W 走一步跨 1 个，沿 H 跨 4 个，沿 C 跨 16 个。Transpose 只改 stride，不搬 data，所以很快；但 transpose 之后沿最后一维已经不再连续，下一个 kernel 要么按跳跃的地址读（上面 i,j,k 那种情形），要么先 `contiguous()` 复制一份。同一个 convolution 在 NCHW 和 NHWC 两种 layout 下哪个快，取决于 kernel 库是为哪种写的。教材的对照是：PyTorch 的 tensor 默认 NCHW，TensorFlow（以及由它导出的 TFLite）默认 NHWC；NHWC 把同一个像素的所有 channel 放在一起，适合 CPU 上沿 channel 做 SIMD，也适合 Tensor Core 上把 convolution 变成 GEMM 时沿 channel 求和。CMSIS-NN 选的也是 HWC，理由是同一个像素的 data 连续，im2col 复制时可以整块搬。导出时 layout 不匹配，runtime 会在 operation 之间插 transpose，第 4 站会看到这类隐藏的开销。
:::

:::from
那张 11 行的表、i,j,k 与 i,k,j 的 cache 分析、Cachegrind 的 miss rate、tile size 表和“两级 cache 要靠实验调”，按 [MIT 6.172 Lecture 1](https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/d0c73dd51c79b95196a2e6faa824e1b4_MIT6_172F18_lec1.pdf) 的 slides（slides 上 Java 一页写 2,738 s，汇总表写 2387.32 s，slides 自己没解释，我用的是汇总表；六种顺序的时间在 slides 30 和 33–35，miss rate 在 slide 36，抓到的文字里 miss rate 表的行与数的对应是乱的，是按每种顺序的单项时间对上的；“最内层沿哪里走”一列是我按 row-major 推的；64 byte 的 line size 是凭我自己的知识写的，slides 只说 cache line 是连续的一块）。L1 的 tile 推导、im2col 的 3×3 例子和 9 倍放大、“Python 里写 tiling 没有用”和“离开 interpreter 就是全部 speedup”，按 TinyTorch Module 17 的源码与 guide。Eager execution 的 dispatch overhead 和 overhead-bound 的分类（host 时间与 device 时间之比大于 1）按 MLSysBook 的 ML Frameworks 一章；NCHW 与 NHWC 的对照按 Hardware Acceleration 一章的 tensor layout 一节；partial im2col、“2 列”、332 KB 和 HWC 的理由出自 [CMSIS-NN 论文](https://ar5iv.labs.arxiv.org/html/1801.06601)（论文把 CHW 叫 channel last、HWC 叫 channel first，和通常的叫法相反，本页按通常的叫法）。NumPy 的计时是我自己在本页写作环境里量的，换一台机器数字会变，结论（overhead 占绝大部分）不会。$2n^3/t$ 的搬运量推导、550 GB 和 17.2 GB 是我算的。
:::

## [deploy] On-device deployment：export、runtime 与 memory planning

:::skip
快速路线必读，它对应 Raspberry Pi kit 的 Object Detection 实验。能把一张图正确转成 int8 input、说出 export 固定了 graph 的哪些东西、给一个小 network 排出 tensor arena，就可以去第 5 站。
:::

### Export 把什么固定了下来

PyTorch 里的 model 是一段 Python 程序，每次 forward 都重新执行一遍，shape 可以随时变，任何 operation 都能调用。device 上的 runtime（TFLite、TFLite Micro、NCNN、ONNX Runtime、TensorRT）拿到的是一个静态 graph：一串 operation、它们之间的连接、每个 tensor 的 shape 和 dtype、weight，全部在导出时定好。

固定下来的东西有三类，每一类都可能出事：

1. **Shape。** 开头第一件事就是这一条。Kit 的原话是：NCNN、ONNX、TFLite 都在导出时把 input shape 写进 graph，predict 时再给别的 `imgsz` 要么被忽略，要么输出无意义的结果。规则是 training、export、inference 三处的 `imgsz` 必须相同，导出后先核对 predict 输出第一行打印的 shape。
2. **Operation 的集合。** Runtime 只实现了一部分 operation。遇到不支持的，要么导出失败，要么被换成别的实现（YOLO26 导出到 NCNN 时，end-to-end 的 head 被换回了需要 NMS 的 one-to-many head）。
3. **Dtype 和数值约定。** int8 model 的 input 和 output 都是 int8，要按 graph 里存的 scale 和 zero point 换算（下一节）。

### Export 不一定变快

Kit 在 Pi Zero 2 W 上对同一张 `bus.jpg` 量了 steady state（第二次运行）的时间：

| model | 格式 | head | inference（ms） | postprocess（ms） |
|---|---|---|---|---|
| YOLO11n | PyTorch | one-to-many | 4672 | 276 |
| YOLO11n | NCNN | one-to-many | 2748 | 533 |
| YOLO26n | PyTorch | end-to-end | 2750 | 36 |
| YOLO26n | PyTorch（`end2end=False`） | one-to-many | 4515 | 192 |
| YOLO26n | NCNN | one-to-many | 5436 | 826 |
| YOLO26n | ONNX | end-to-end | 2274 | 265 |

比较之前先对齐 input 的大小。PyTorch 那几行跑的是 $640\times480$（letterbox 成长方形），导出的跑 $640\times640$，像素多了 $640\times640/(640\times480)=4/3$ 倍。把 PyTorch 的数乘 4/3 再比：

- YOLO11n：$4672\times4/3=6229$ ms 对 NCNN 的 2748 ms，NCNN 快 2.27 倍。
- YOLO26n（同样是 one-to-many head）：$4515\times4/3=6020$ ms 对 NCNN 的 5436 ms，只快 1.11 倍。

而 YOLO26n 原本的 end-to-end head 不需要 NMS（postprocess 36 ms 对 192 ms），NCNN 强制换成了 one-to-many head，结果 NCNN 版本比不导出的 PyTorch 版本还慢。只有 ONNX 保留了 end-to-end head，是三者里最快的。

:::wrong 导出成 NCNN 或 ONNX 这类为 ARM 优化的格式，model 一定变快
同一个 NCNN 流程，对 YOLO11n 快 2.27 倍，对 YOLO26n 几乎没有帮助，还因为换掉了 head 让总时间变长。Runtime 的快慢取决于它对这个 model 里每个 operation 有没有好的 kernel、会不会改写 graph 的结构，这些只有在目标板子上量了才知道。Kit 的结论是：model 和导出路径要一起选，并在目标 hardware 上测。
:::

### int8 input：按 graph 里的 scale 换算

int8 model 的 input tensor 带着两个数，scale $S$ 和 zero point $Z$，表示 real value $r$ 和存下的整数 $q$ 之间的关系 $r=S(q-Z)$（推导见 [MIT 6.5940 的第 3 站](../courses/MIT-6.5940.html#quant)）。反过来，把一张图送进去：

$$q=\operatorname{clip}\!\left(\operatorname{round}\!\left(\frac{r}{S}\right)+Z,\ -128,\ 127\right)$$

Kit 里的代码是先把像素除以 255 变成 $[0,1]$ 的 $r$，再做这一步，$S$ 和 $Z$ 从 `input_details[0]["quantization"]` 读。设读到的是 $S=1/255\approx0.003922$、$Z=-128$（这两个值是我为例子取的，常见于从 $[0,1]$ 的 float input 转过来的 model；实际值以 input details 为准），一个值为 200 的像素：

$$r=\frac{200}{255}=0.7843,\qquad\frac{r}{S}=200,\qquad q=200-128=72$$

忘了除以 255：

$$\frac{200}{0.003922}=51{,}000,\qquad q=\operatorname{clip}(51{,}000-128)=127$$

不只这一个像素。任何不为 0 的像素，$r/S\ge255$，加上 $-128$ 之后至少是 127，全部 clip 到 127；值为 0 的像素是 $-128$。整张图变成了只有两个值的剪影，model 照样输出 box。还要注意 model 的 input 也可能是 uint8（Image Classification 实验里就有这样的 model），那时直接送 0–255 的像素，不做任何换算。先读 input details 的 dtype 再决定怎么处理。

:::edge Kit 的代码没有 round
Image Classification 实验里这一步写的是 `(img_array / scale + zero_point).clip(-128, 127).astype(np.int8)`。`astype` 不做 round，直接把小数部分砍掉（向 0 截断）。沿用上面取的 $S=1/255$：TFLite 把 scale 存成 float32，就是 $0.003921569$，不是精确的 $1/255$，代码里 `img_array` 也是 float32，所以 200 这个像素算出来是

$$\frac{200/255}{0.003921569}-128=199.99998-128=71.99998$$

截断成 71，而 round 是 72。我用 float32 把 0 到 255 全部算了一遍：193 到 255 这 63 个值都比 round 的结果小 1，其余相同（负数一侧向 0 截断，$-1.0000076$ 截成 $-1$，碰巧是对的）。差一个 quantization step，也就是 $1/255$，对 classification 影响很小；但这是 train 时的 quantization（round）和 serving 时的 preprocessing（截断）不一致，属于第 2 站说的 skew，要和 parity test 对得上就该写成 `np.round(...)` 再 `clip`、再 `astype`。
:::

### Tensor arena：把 memory 在初始化时排好

MCU 上没有操作系统帮你管 memory，长期运行时反复 `malloc` 和 `free` 还会产生 fragmentation。TensorFlow Lite Micro 的做法是：application 提供一整块固定大小的 memory，叫 tensor arena，所有 tensor 在初始化时一次排好位置，inference 期间不再分配。Arena 从两头用：一头放整个 interpreter 生命周期都要的东西（persistent），另一头放 inference 中间的 tensor（non-persistent）；两头相遇就是 arena 不够，初始化时报错。

中间 tensor 怎样排？一个 tensor 只需要从“写它的 operation 开始前”活到“最后一个读它的 operation 结束”。Lifetime 不重叠的两个 tensor 可以共用同一段地址。TFLM 用的是 first-fit decreasing：按 size 从大到小，每个放进第一个够大的、在它活着的时间里没被占用的空隙。

例子（我构造的）：五个 operation，A 有一条 skip connection 进 op 4。

| tensor | size（KB） | 由谁写 | 最后谁读 | lifetime |
|---|---|---|---|---|
| X（input） | 48 | | op 1 | input 到 op 1 |
| A | 64 | op 1 | op 4 | op 1 到 op 4 |
| B | 128 | op 2 | op 3 | op 2 到 op 3 |
| C | 64 | op 3 | op 4 | op 3 到 op 4 |
| D | 64 | op 4 | op 5 | op 4 到 op 5 |
| E（output） | 16 | op 5 | | op 5 |

按 size 排序：B、A、C、D、X、E（同样大的按原来的顺序）。

1. B 最大，放在 offset 0，占 [0, 128)。
2. A 和 B 在 op 2、op 3 同时活着，不能重叠，放在 128。
3. C 在 op 3 和 A、B 都活着，放在 192，到 256。
4. D 的 lifetime 是 op 4 到 op 5，B 在 op 3 之后已经不用了，D 用回 offset 0。
5. X 只在 op 1 之前活着，只和 A 重叠，也放在 0。
6. E 只在 op 5，和 D 重叠，放在 D 上面的 64。

::fig[cs249r-arena] 上面是 network，下面是 arena：横轴是时间（第几个 operation），纵轴是地址。每一步放一个 tensor。

Arena 一共 256 KB；每个 tensor 各占一块要 $48+64+128+64+64+16=384$ KB。256 也是这个例子能达到的最小值：op 3 执行时 A、B、C 同时活着，$64+128+64=256$。一般的 network 上 first-fit decreasing 不保证最优，论文说最优排法是一个没有解决的问题。它也要求所有 shape 在初始化时已知，所以 TFLM 不支持 dynamic shape。论文里 VWW 在 SparkFun Edge 上的 arena 是 81.79 kB（persistent 26.50 kB，non-persistent 55.30 kB）。MCU 上 activation 的大小本身怎样算，见 [MIT 6.5940 的第 7 站](../courses/MIT-6.5940.html#mcu)。

### Cold start：第一次为什么慢五倍

开头第二件事。Kit 的解释：第一次运行要加载 library 的代码，并把 model 的 weight 从 SD 卡 page in 到 memory，第二次这些都已经在 memory 里了。在 Zero 2 W 这种 memory 小、存储慢的板子上，这个代价比 inference 本身还大。它对 deployment 的含义是两面的：

- 一个长期运行的 perception 进程只在启动时付一次，启动后先跑几次 warm-up，再开始 control loop。
- 如果为了省电，每次需要时才启动进程、跑一个 frame、退出，那每一个 frame 付的都是 cold 的 2545 ms。

JIT 的 runtime 更明显：TinyTorch Module 19 指出，`torch.compile`、JAX 这类栈第一次调用还要付 tracing 和 compilation 的时间，常常比其他开销大几个数量级。

:::from
“imgsz 三处必须一致”、export 固定 input shape、YOLO11n 与 YOLO26n 在不同格式下的表、4/3 的像素修正和“model 与导出路径要一起选”、int8 input 的 preprocessing 代码、cold 与 warm 两次运行的表和它的解释，出自 [Raspberry Pi kit 的 Object Detection 实验](https://mlsysbook.ai/kits/contents/raspi/object_detection/object_detection.html)；uint8 input 的情形和 `astype` 那一行代码出自 Image Classification 实验（实验按 dtype 分 uint8、int8、float32 三支处理）。2.27 倍和 1.11 倍（kit 自己的说法是“more than half”和“roughly 10%”）、int8 换算的数值例子（$S$、$Z$ 是我取的）和 63 个截断不一致的像素值是我算的；“scale 存成 float32”和“train 时是 round”是凭我自己对 TFLite quantization 约定的了解写的，没有去读 schema 和 converter 的源码核对。Tensor arena 的两头结构、lifetime、first-fit decreasing、“最优排法未解决”、不支持 dynamic shape、不做运行时分配是为了避免 fragmentation、VWW 的 arena 大小，出自 [TFLM 论文](https://arxiv.org/pdf/2010.08678)第 4.4 节和 Table 3；六个 tensor 的例子是我构造并用代码排的。JIT 的 warm-up 一句出自 TinyTorch Module 19 源码。
:::

## [serve] Serving：latency budget、pipeline 与 batching

:::skip
快速路线里可以只读前两节。能算出 camera pipeline serial 和 pipeline 化后的 fps 与 latency，并说清 robot 的 perception 为什么要丢 frame，就可以去第 6 站。Queueing 和 batching 两节在 robot 本身上用得少，在一台 edge server 服务好几台 robot 时才用得上。
:::

### 30 fps 的 camera，39 ms 的处理

Pi 5 上一个 detector，camera 每 $1000/30=33.3$ ms 来一个 frame。每个 frame preprocess 8 ms、inference 25 ms、postprocess 6 ms（这三个数是我为例子取的，量级和 kit 里 Pi 5 上的小 model 相当）。

一个 thread 依次做完：每个 frame $8+25+6=39$ ms，最多 $1000/39=25.6$ fps，跟不上 30 fps。每来一个 frame，处理就比到达多落后 $39-33.3=5.7$ ms。

把三个 stage 分到不同的 core 上（或者 inference 放在 NPU、GPU 上），各自只做自己那一段，frame 在 stage 之间传递。这时 throughput 由最慢的 stage 决定：

$$\text{throughput}=\frac{1}{\max(t_\text{pre},t_\text{inf},t_\text{post})}=\frac{1}{25\ \text{ms}}=40\ \text{fps}$$

比 30 fps 快，每个 frame 到了就能马上处理，latency 是三段之和 39 ms，不再增长。

::fig[cs249r-pipe] serial 和 pipeline 化的时间线，前 6 个 frame。serial 时第 6 个 frame（f5）从到达到出结果已经 67.3 ms。

pipeline 化提高 throughput，不缩短单 frame 的 latency。Throughput 和 latency 是两个独立的量，前者由最慢的 stage 决定，后者由所有 stage 之和决定，要分开报告。

### Robot 宁可丢 frame

serial 处理时，来不及处理的 frame 怎么办？最自然的写法是放进一个 FIFO queue，按顺序处理，一个 frame 都不丢。

算一下 10 秒之后。frame 以 30 fps 到达，以 25.6 fps 被处理，queue 每秒长 $30-25.6=4.4$ 个 frame，10 秒后积压 44 个 frame。新到的一个 frame 要等前面 44 个 frame 处理完，$44\times39\ \text{ms}=1.7$ s 之后才轮到它。Robot 拿到的“当前”检测结果，看的是 1.7 秒前的世界，而且这个 latency 还在一直变大。

Control 要的是最新的状态，不是完整的历史。正确的做法是 queue 的长度设成 1：处理完一个 frame 后直接取最新到达的那一个 frame，中间的全部丢掉。Throughput 仍是 25.6 fps，但每个 frame 从拍下到出结果的时间不超过一个 frame 间隔加一次处理，$33.3+39=72.3$ ms，而且不会增长。

:::wrong Queue 越深越不容易丢 frame，所以越好
上面的 FIFO 一个 frame 没丢，10 秒后每个结果都晚了 1.7 秒，用这样的结果去 control，比丢掉 14% 的 frame 糟糕得多。Queue 只能吸收短时间的突发；当平均到达速度大于处理速度，任何长度的 queue 都会被填满，深的 queue 只是让 latency 涨得更高。对 robot 来说，要先保证“结果有多新”，再谈“处理了多少 frame”。
:::

### 几台 robot 共用一台 edge server

实验室里 8 台 robot，每台 10 Hz 把观测发给一台 edge server 上的 policy，每次 inference 10 ms。Server 一秒能做 100 次，要做 80 次，utilization $\rho=80/100=0.8$。会排多久？

**Little's law。** 稳定的系统里，平均在系统中的 request 数 $L$、到达速度 $\lambda$、每个 request 在系统里的平均时间 $W$ 满足

$$L=\lambda W$$

它不依赖到达和服务时间的 distribution，只要求系统稳定、request 不凭空产生或消失。

**M/M/1。** 再假设到达是 Poisson、服务时间是 exponential、只有一个 server，平均时间是

$$W=\frac{1}{\mu-\lambda}=\frac{S}{1-\rho}$$

$S=1/\mu$ 是服务时间。代进去，$W=10/(1-0.8)=50$ ms，$L=80\times0.05=4$：平均有 4 个 request 在 server 上，一个在算，其余在等。

平均数不够，还要看尾巴。这个模型里一个 request 在系统里的时间 $T$ 服从 mean 为 $W$ 的 exponential distribution，$P(T\le t)=1-e^{-t/W}$。令它等于 $p$：

$$1-e^{-t_p/W}=p\quad\Longrightarrow\quad e^{-t_p/W}=1-p\quad\Longrightarrow\quad t_p=W\ln\frac{1}{1-p}$$

p90 是 $W\ln10=2.30\,W$，p99 是 $W\ln100=4.61\,W$：

| $\rho$ | 平均 $W$ | p90 | p99 |
|---|---|---|---|
| 0.5 | 20 ms | 46 ms | 92 ms |
| 0.8 | 50 ms | 115 ms | 230 ms |
| 0.9 | 100 ms | 230 ms | 461 ms |
| 0.95 | 200 ms | 461 ms | 921 ms |

服务时间始终是 10 ms。Utilization 从 0.5 涨到 0.9，平均等待变成 5 倍；p99 从 92 ms 涨到 461 ms，是 control 周期的几十倍。真实的服务时间比 exponential 更稳定，数字会小一些，但“$\rho$ 接近 1 时 latency 发散”这一点不变。所以给 latency 敏感的 server 定容量，要留出 headroom，不能按平均算力刚好够来买。

### Batching：用等待换 throughput

如果 server 上的 inference 在 batch size 1 时是 memory-bound 或 overhead-bound 的（第 3 站量过：小 MLP 的 batch 从 1 到 16，时间只多了 60%），合成 batch 就能提高 throughput。设一个 batch 的执行时间是

$$T(B)=8+B\ \text{ms}$$

（固定开销 8 ms 加每个 request 1 ms，我取的数）。Throughput 是 $\mu(B)=B/T(B)$：$B=1$ 时每秒 111 个，$B=2$ 时 200 个，$B=4$ 时 333 个，$B=8$ 时 500 个。

Request 平均每秒来 200 个。$B=1$ 时 $\rho=200/111=1.8$，queue 无限增长；$B=2$ 时 $\rho=1.0$，恰好不稳定；$B=4$ 才稳定，$\rho=0.6$。

代价是凑 batch 的等待。如果规定凑满 $B$ 个才发，第一个 request 要等后面 $B-1$ 个，平均每个 request 等 $(B-1)/(2\lambda)$：

$$\text{latency}\approx\frac{B-1}{2\lambda}+T(B)$$

$B=4$：$3/(2\times0.2)+12=7.5+12=19.5$ ms。$B=8$：$7/0.4+16=33.5$ ms，throughput 更高，latency 也更高。

只按数量凑有一个问题：request 来得少的时候，第一个可能等很久。实际的 server 用两个条件，哪个先满足就发：凑满 $B_\text{max}$ 个，或者最早的那个已经等了一个 window。

::fig[cs249r-batch] $B_\text{max}=4$、window 10 ms 的 batcher，按一串随机到达的 request 模拟。每条细线从一个 request 的到达连到它所在 batch 开始执行的时刻；B 小于 4 的 batch 是最早的 request 等满 10 ms 才发的，或者是 GPU 空出来时队里已经有人等满了 10 ms。

这次模拟里 27 个 request 分成 9 个 batch，大小在 2 到 4 之间；平均 latency 18.0 ms，最长 25.0 ms，和上面 $B=4$ 的估计 19.5 ms 接近。Window 给 latency 加了一个上界：最坏是等满 10 ms，再等前一个 batch 做完，再加自己的 $T(B)$。LLM serving 里的 continuous batching 是同一个想法推到 token 级别，见 [CS336 的第 8 站](../courses/STANFORD-CS336.html#infer)。

:::edge 一台 robot 上的多路 camera
同一台 robot 上 4 路 camera 同步曝光，4 个 frame 同时到达，凑 batch 不需要等待，$B=4$ 只有好处没有等待。这正是 MLPerf 里 multistream scenario 测的情形（第 6 站）。但如果 4 路不同步，就回到上面的 trade-off：要么等齐，要么各自单独跑。
:::

:::from
Little's law（及它不依赖 distribution、只要求稳定的条件）、M/M/1 的 $W=S/(1-\rho)$、latency 服从 exponential 所以 p99 是 $W\ln100\approx4.6\,W$、count-triggered batcher 的 $(B-1)/(2\lambda)+T(B)$、dual-trigger batcher 的定义，以及“utilization 接近 1 时 latency 崩溃、要留 headroom”的论证，按 MLSysBook Volume I 的 Model Serving 一章（“Queuing Theory”和“Throughput Optimization”两节）的源文件；教材的场景是 H100 上的 ResNet-50，具体数字由 mlsysim 生成，我没有用。表里任意 percentile 的 $W\ln\frac{1}{1-p}$ 是把教材的 p99 推导换成一般的 $p$；camera pipeline、FIFO 积压、8 台 robot、$T(B)=8+B$ 和 batcher 的模拟都是我为这一页构造和计算的。“Robot 宁可丢 frame”的说法是凭我自己的知识写的，教材没有这一节。
:::

## [bench] Benchmarking、profiling 与 energy

:::skip
快速路线必读，它对应 TinyTorch Module 14 和 19。能说出为什么报 median 而不报 mean、为什么第一次运行要丢掉、MLPerf 的四种 scenario 各对应什么 deployment，并算出一个 duty cycle 下的平均 power，就可以去第 7 站。“DVFS”一节是加深，可以跳。
:::

### 怎样测一次 latency

开头第二件事说明，同一条命令的两次运行可以差五倍。一个可信的 latency 数字至少要做到：

1. **Warm-up。** 先跑几次不计时。第一次付的是 first-touch page fault、library 加载、L1/L2/L3 里还没有这些 data、BLAS 的 thread pool 还没起来；JIT 的栈还有 kernel compilation。TinyTorch Module 14 的表说头几次通常慢 5 到 20 倍，建议 3 到 10 次 warm-up（它的 `measure_latency` 默认 10 次 warm-up、100 次计时）。
2. **重复很多次，看 distribution。** OS 的中断、garbage collection、别的进程抢 cache，都会让个别几次变慢。Latency 的 distribution 是右偏的，有一条长尾。
3. **报 median 和 percentile，不只报 mean。**

::fig[cs249r-latdist] 1000 次 latency 的 histogram（我用一个 lognormal 加上 6% 的停顿造出来的 data）。

这组 data：median 20.1 ms，mean 20.8 ms，p90 23.0 ms，p99 34.4 ms，最长 75.3 ms。Mean 被尾巴往右拉了；p99 是 median 的 1.7 倍。对一个 30 Hz 的 control loop，要看的是 p99 有没有超过 33 ms，而不是 mean。这组数里 p99 就超了。

如果要给 mean 一个 confidence interval，用 Student's $t$：

$$\bar X\pm t_{0.975,\,n-1}\frac{s}{\sqrt n}$$

TinyTorch Module 19 指出一个常见错误：$n=10$ 时 $t_{0.975,9}=2.262$，有人用正态 distribution 的 1.96 代替，$1.96/2.262=0.866$，报出的 interval 比 data 支持的窄 13%。两者在 $n$ 超过 60 左右才差到 2% 以内。

还有一个容易混的地方：throughput $=1/\text{latency}$ 只在每次只处理一个 sample 时成立。Batch 时 throughput 是 $B/T(B)$，可以比 $1/T(1)$ 高一个数量级，而每个 sample 的 latency 变长了（第 5 站）。只报其中一个、又把它叫成另一个，是 benchmark 误导人最常见的方式。

### MLPerf 的四种 scenario

同一个 model、同一块板子，“多快”的答案取决于 request 怎样到来。MLPerf Inference 用一个叫 LoadGen 的程序按四种方式发 request：

| scenario | request 怎样来 | 报什么 | 对应的 robot 场景 |
|---|---|---|---|
| single-stream | 一次一个，上一个完成才发下一个 | p90 latency | 一路 camera，处理完再取下一个 frame |
| multistream | 每隔固定时间（50–100 ms）来一组 N 个 sample | 满足 latency 要求的最大 N | 多路同步 camera |
| server | Poisson 到达，每次一个 | 满足 p99 latency 上界的最大 QPS | 一台 edge server 服务多台 robot |
| offline | 一次给出全部 sample，顺序随意 | samples/s | 晚上批量重新标注录下的 data |

要多少个 query 才能可信地报一个 percentile？论文的算法：要求 99% 的 confidence，margin 取 $(1-p)/20$，

$$n=\frac{z^2\,p(1-p)}{\text{margin}^2},\qquad z=2.576$$

- p90：$\text{margin}=0.005$，$n=2.576^2\times0.09/0.005^2=23{,}886$，向上取到 $2^{13}=8192$ 的倍数，24,576。
- p99：$\text{margin}=0.0005$，$n=2.576^2\times0.0099/0.0005^2=262{,}742$，取到 270,336。

p99 要的 sample 是 p90 的 11 倍，因为尾巴上的 sample 少。拿 100 次运行报 p99，等于用 1 个 sample 定这个数。论文还要求每次 benchmark 至少跑 60 秒，理由是让 power management 和 DVFS 进入平衡态；accuracy 必须达到 fp32 reference 的 99%（MobileNet 类放宽到 98%）。这条 accuracy 门槛防的是用一个很快但答错的 model 刷速度，TinyTorch 的 capstone 也有同样的规则（Latency Sprint 要求 accuracy 至少 85%）。

### Profiling：先看时间花在哪一段

第 1 站的 Amdahl's law 说，加速之前先要知道每一段占多少。开头的 detector 在 Zero 2 W 上：preprocess 19%，inference 41%，postprocess 40%。这里最值得先动的是 postprocess：把 confidence threshold 调高减少进入 NMS 的 box，或者换一个不需要 NMS 的 head（第 4 站 YOLO26 的 end-to-end head 把 postprocess 从 192 ms 降到 36 ms）。

MCU 上也一样。XIAO ESP32S3 的 keyword spotting 实验里，Edge Impulse 对 MFCC 这一步 preprocessing 估计的时间是 675 ms（按 ESP-EYE 估的，它的 CPU 是更老的 Xtensa LX6，实验作者说实际会更短），而同一页截图里 int8 model 本身的 on-device 估计是 inference 6 ms、peak RAM 3.7 KB、flash 27.1 KB。按这两个估计，preprocessing 是 model 的 $675/6=112.5$ 倍。要缩短 latency，先回去改 FFT length（实验建议降到 256）和 coefficient 个数，model 再快一倍，总时间也只少 3 ms。

TinyTorch Module 14 写的 profiler 统计的是 parameter 数、FLOPs、memory 和 latency 四样，并用 arithmetic intensity 判断每层是 memory-bound 还是 compute-bound（方法见 [MIT 6.5940 的第 1 站](../courses/MIT-6.5940.html#eff)）。

### Energy：power 乘时间

电池供电的 robot 关心的是每次 inference 用多少 energy，$E=P\times t$，以及平均 power 决定的续航。

**Duty cycle。** Kit 给出 Pi 5 在主动散热下的典型 power：idle 3.0–3.5 W，重负载 7–10 W。取中间值 3.25 W 和 8.5 W。如果 detector 只在 30% 的时间里满负载：

$$P_\text{avg}=0.3\times8.5+0.7\times3.25=4.83\ \text{W}$$

一块 50 Wh 的电池能用 $50/4.83=10.4$ 小时；一直满负载是 $50/8.5=5.9$ 小时。Idle power 占了平均值的一半，这是“只看 active power”的 benchmark 会漏掉的。

**Thermal throttling。** Kit 写明 Raspberry Pi 在 80 °C 开始 throttle，85 °C 是硬上限。Setup 实验里，装了主动散热的 Pi 5 跑 Llama 3.2 3B 时升到 70–75 °C、10–11 W；VLM 实验里跑 Florence-2 时 CPU 温度能到 80 °C 以上，已经在 throttle 的边上。教材 Benchmarking 一章的例子是一块宣称“1 W AI”的芯片：短时间测和宣传一致，连续跑几分钟后结温升高、throttle，steady state 的 throughput 掉下来。所以 edge device 的 benchmark 要连续跑到温度稳定，并报告散热条件。

### DVFS：跑满再睡，还是慢慢跑

:::skip
这一节是加深：用 $P\propto f^3$ 推出两种策略各在什么条件下更省电。跳过它会少掉“什么时候该降低 frequency”的判断依据。
:::

设 CPU 的 power 是一个固定的 static 部分加上 dynamic 部分：

$$P(f)=P_s+kf^3$$

一次 inference 要 $W$ 个 cycle，用时 $t=W/f$。取 $P_s=2$ W，满频 2.4 GHz 时 dynamic 是 6 W，所以 $k=6/2.4^3=0.434$ W/GHz³；$W=0.024$ G cycle，满频时 10 ms（这些数是我取的）。Control loop 是 30 Hz，周期 33.3 ms。

**情形一：做完就能进入几乎不耗电的 sleep**（MCU 常见）。每个 frame 的 energy 只算 active 的那段：

$$E(f)=(P_s+kf^3)\frac{W}{f}=\frac{P_sW}{f}+kWf^2$$

对 $f$ 求导等于 0：$-P_sW/f^2+2kWf=0$，得 $f^*=\sqrt[3]{P_s/(2k)}=\sqrt[3]{2/0.868}=1.32$ GHz。代几个点：2.4 GHz 时 0.080 J，1.6 GHz 时 0.057 J，1.2 GHz 时 0.055 J，0.8 GHz 时 0.067 J。frequency 太高，dynamic 部分涨得像 $f^2$；太低，static 部分要付更长时间。

**情形二：做完也不能 sleep，整个周期都付 $P_s$**（Pi、Jetson 这类一直开着的主控板常见）：

$$E_\text{周期}=P_s\times33.3\ \text{ms}+kWf^2$$

第一项和 $f$ 无关，第二项随 $f$ 增大。只要在 deadline 前做完，frequency 越低越省：2.4 GHz 时 0.127 J，0.8 GHz（用时 30 ms，还赶得上 33.3 ms 的周期）时 0.073 J，少 42%。

:::wrong 跑得越快，每次 inference 用的 energy 越少
“Race to idle”只在情形一成立，而且也只到 $f^*$ 为止：上面 2.4 GHz 比 1.32 GHz 多用 47% 的 energy。情形二里 static power 无论快慢都要付满整个周期，加速只增加 dynamic 的部分。判断之前先问：做完之后 device 能不能真的 sleep，sleep 时 power 多少，以及 deadline 有多紧。
:::

:::from
Warm-up 的几种原因、5 到 20 倍、3 到 10 次和 `measure_latency` 的默认值、报 median、benchmark harness 控制了和没控制的噪声、$t$ 与 1.96 的 13%、throughput $=1/\text{latency}$ 只在 single-stream 成立，按 TinyTorch Module 14 和 19 的源码讲解部分；capstone 的 85% 门槛出自 Module 20 的 guide。四种 scenario、24,576 与 270,336 的算法、至少 60 秒的理由和 accuracy 门槛，出自 [MLPerf Inference 论文](https://ar5iv.labs.arxiv.org/html/1911.02549)（论文说的是 DVFS 和 power management 的平衡态，没提 thermal throttling）。Pi 5 的 power 表、80/85 °C、跑 Llama 3.2 3B 时 70–75 °C 与 10–11 W 出自 kit 的 Setup 实验，80 °C 以上出自 VLM 实验；“1 W AI”的例子和 peak 与 sustained 的区别出自教材 Benchmarking 一章；675 ms 出自 XIAO ESP32S3 的 KWS 实验正文，6 ms、3.7 KB、27.1 KB 是我从同一实验里 Edge Impulse 的 model 页面截图读的，112.5 倍是我算的。Latency 的 histogram 是我造的 data；duty cycle、电池、DVFS 的两种情形和所有数值是我算的；“对应的 robot 场景”一列是我加的。
:::

## [ops] MLOps 与 robustness

:::skip
快速路线里可以只读前三节。能区分三种 distribution shift、说出没有 label 时监控什么、并设计一个能自动回滚的 OTA 更新，就读完了。最后一节（bit flip）是加深。
:::

### 不报错的 failure

一个 detector 上线一个月后，accuracy 慢慢掉了，但所有 service 都是绿的：进程在跑，latency 正常，没有 exception。CS329S 的讲义把 ML 系统的 failure 分成两类：所有软件都有的 software system failure（dependency 出错、deploy 了错的版本、hardware 坏了、宕机），和 ML 特有的 failure（data 处理出错、training 和 inference 的 pipeline 不一致、distribution shift、edge case、degenerate feedback loop）。它引用了一项对 Google 一条大型 ML pipeline 15 年里 96 次故障的回顾：60 次不直接和 ML 有关，剩下 36 次和 ML 有关。后一类数量少，但更危险，因为它们不报错。

所以 ML 系统的 monitoring 要比普通 service 多一层：不只看“它在不在跑”，还要看“它的输出还对不对”。

### 三种 distribution shift

Input 和 label 的 joint distribution 可以两种方式分解：

$$P(X,Y)=P(Y\mid X)\,P(X)=P(X\mid Y)\,P(Y)$$

哪个因子变了，对应三种 shift：

| 名称 | 变的 | 不变的 | robot 上的例子 |
|---|---|---|---|
| covariate shift | $P(X)$ | $P(Y\mid X)$ | 实验室从白天的自然光换成晚上的灯光，图像的 distribution 变了，同一张图该是什么物体没变 |
| label shift | $P(Y)$ | $P(X\mid Y)$ | 分拣线上来的零件比例变了，从多数是螺母变成多数是垫片，每种零件长什么样没变 |
| concept drift | $P(Y\mid X)$ | $P(X)$ | 换了一种更软的 gripper pad，同样的观测下“能不能抓稳”的答案变了 |

区分它们决定了修法。Covariate shift 补采新光照下的 data 就行；label shift 可以只重新估计 class prior；concept drift 意味着旧的 label 本身过时了，必须重新标。

### 没有 label 时监控什么

Robot 在现场跑时，没有人实时告诉它每次检测对不对。讲义列出几层能看到的东西：

1. **Operational metric**：latency、throughput、CPU/GPU 和 memory 的使用、温度。
2. **Prediction 的 distribution**：它是低维的，最容易监控。Model 的 weight 没变，prediction 的 distribution 变了，就说明 input 的 distribution 变了。一长串一模一样的 prediction 这类异常能马上抓到。
3. **Feature 的 distribution 和 schema**：值的 range、格式、取值集合、feature 之间的关系。
4. **用户或下游的反馈**：例如 grasp 的成功率、人工接管的次数。

比较两段时间的 distribution，只比 mean 不够。一个 detector 的 confidence，上周 10 次和这周 10 次：

| | 排序后的 10 个 confidence | mean |
|---|---|---|
| 上周 | 0.85 0.86 0.87 0.88 0.89 0.90 0.91 0.92 0.93 0.94 | 0.895 |
| 这周 | 0.78 0.79 0.80 0.81 0.84 0.97 0.98 0.99 0.99 1.00 | 0.895 |

Mean 完全一样，distribution 却从集中在 0.9 附近变成了两团：一团过度自信，一团明显没把握。只盯 mean 的 dashboard 看不到任何变化。

Two-sample Kolmogorov–Smirnov test 比较的是整个 distribution：把两组数各自的 empirical CDF 画出来，取两条曲线之间最大的竖直距离

$$D=\max_x\left|F_\text{上周}(x)-F_\text{这周}(x)\right|$$

在 $x=0.84$：上周没有一个 $\le0.84$，$F=0$；这周有 5 个，$F=0.5$，差 0.5。在 $x=0.94$：上周 $F=1.0$，这周 $F=0.5$，也差 0.5。其他位置都不超过 0.5，所以 $D=0.5$。

significance level 0.05 时，critical value 大约是 $1.36\sqrt{(n+m)/(nm)}$（这是大 sample 的近似，sample 这么小时只能当参考）。$n=m=10$：$1.36\sqrt{20/100}=0.61$，$D=0.5$ 不够。同样的形状、每周 100 个 sample：critical value $1.36\sqrt{200/10{,}000}=0.19$，0.5 远远超过。讲义的经验法则正好对上：小 sample 就能看出来的差别多半是严重的；要很大 sample 才看得出来的，多半不要紧。KS test 只能用在一维的量上，所以它适合 prediction 和 confidence；高维的 feature 要先降维。

:::wrong 累计的 accuracy 一直稳定在 85% 以上，model 就没有问题
讲义的例子是 cumulative statistic 会把突然的下跌藏起来。设前 15 个小时每小时 accuracy 0.9，之后 3 个小时掉到 0.6。到第 18 小时，累计 accuracy 是 $(15\times0.9+3\times0.6)/18=0.85$，看上去只是略降；按小时的 sliding window 显示的是 0.6。Window 的长短也有代价：短 window 反应快，误报也多。讲义还警告 alert fatigue：几百个 feature 各自报警，大多是无害的波动，团队很快就不再看。报警条件要少而有意义。
:::

### 把新 model 送到 device 上：OTA 与回滚

Cloud 上的 service 出了问题，换回旧版本只是改一下路由。Edge device 装在 robot 里、连着不稳定的 Wi-Fi，不能指望工程师 SSH 上去手动回滚。教材以 keyword spotting device 为例给出的设计：

1. **Dual-bank flash。** device 一直从 Bank A 运行，同时把新的 model 和 runtime 写进 Bank B。
2. **切换后由 watchdog 和 self-test 看着。** 切到 Bank B 后，hardware watchdog timer 和启动后的自检盯住最初的若干次 inference；如果出现 memory fault、卡死或者超出 latency budget，自动切回 Bank A。
3. **Staged rollout。** 先推给一小部分 device（canary），telemetry 没有问题再扩大。
4. **核对版本。** 每台 device 报告它实际加载的 bundle 的 hash，和 model registry 里发布的版本比对，不一致的 device 不接流量。教材举的 Knight Capital 事故（2012 年）：一次部署把 order-routing 软件更新到了 8 台 production server 中的 7 台，漏了第 8 台，约 45 分钟里 212 个 parent order 产生了几百万个 child order，损失超过 4.6 亿美元。

Safety-critical 的 device 还要把 worst-case execution time 列进发布条件，因为 thermal throttling 和 memory contention 会把个别几次 inference 推过 deadline，而平均 latency 看不出来。

Canary 要多大？Accuracy 的下降是统计上的，不是一次 crash。要以 5% 的significance level、80% 的 power 看出 accuracy 从 95% 掉到 94%，每一组需要

$$n=\frac{(z_{0.975}+z_{0.8})^2\,\big[p_1(1-p_1)+p_2(1-p_2)\big]}{(p_1-p_2)^2}=\frac{(1.960+0.842)^2\times(0.0475+0.0564)}{0.01^2}=8155$$

个有 label 的 sample。如果每台 robot 每天只有几十次能拿到 label（例如 grasp 成功与否），一个 canary 要跑很多天。这是 ML 的 canary 比普通软件慢的根本原因。

### 现场的 fallback

Edge 上的 model 做出的决定直接变成动作，不能像 cloud 的 training job 那样回滚到上一个 checkpoint。教材举的 2018 年 Tempe 事故：自动驾驶测试车在撞击前 5.6 秒就检测到了行人，但分类在 vehicle、other、bicycle 之间反复跳，每跳一次 path prediction 就丢掉之前的 tracking history，直到撞击前 1.2 秒才认出即将碰撞；认出之后系统又压住动作一秒、没有提醒安全员，之后才报警并计划缓慢减速，安全员没来得及介入。每一个 frame 的检测本身都“有输出”，失败出在 frame 与 frame 之间不稳定的 prediction、下游对它的处理和 fallback 的时机。

Volume II 的要求是：主路径不能支持决策时，要有一条独立的 fallback（一个本地的、基于传感器的 controller，或者一个验证过的安全动作），而且它要在 deadline 之前给出结果；一个答得很好但赶不上 deadline 的远端 model 不算 fallback。Volume I 的 ML Operations 一章补上了资源一侧：热量或电量不够时，edge 的 runtime 要能主动降级（graceful degradation）：降低 input 的采样率、跳过可选的 stage、换一个更浅的 model，每一级降级都要事先对着应用的安全和质量要求验证过。对 robot arm 来说，最常见的 fallback 就是减速并停到安全姿态（这一句是凭我自己的知识写的）。

### Bit flip：一个数怎样变成 $10^{37}$

:::skip
这一节是加深：hardware 的 soft error 怎样绕过所有 NaN 检查。跳过它会少掉“为什么要对 weight 和 activation 做 range check”的理由。
:::

Memory 里的一个 bit 可能因为宇宙射线、voltage 波动或芯片缺陷翻转，hardware 不报任何错，叫 silent data corruption。教材的例子是一个 fp32 weight 0.042。

::fig[cs249r-bitflip] 同一个 weight 存成 fp32 和 int8，各翻一个 bit。

0.042 的 fp32 表示：exponent 字段是 122，mantissa 是 1.344，值为 $1.344\times2^{122-127}=0.042$。Exponent 的最高位（整个 word 的 bit 30）是 0，翻成 1 后 exponent 变成 $122+128=250$：

$$1.344\times2^{250-127}=1.344\times2^{123}\approx1.43\times10^{37}$$

这是一个合法的有限数，不是 NaN 也不是 Inf，任何 NaN check 都拦不住。它乘上一个 activation 之后，下游所有 logit 都被它淹没。

同一个 weight 存成 int8：设这一层 weight 的 range 是 $\pm0.5$，scale $S=0.5/127$，$q=\operatorname{round}(0.042/S)=11$。最坏的情形是最高位翻转，$q$ 变成 $-117$，值是 $-117\times0.5/127=-0.461$。错了，但仍在这一层 weight 本来的 range 里。int8 能表示的值全在 $\pm0.5$ 之间，翻哪一位都跑不出去。

:::wrong int8 的 precision 低，所以比 fp32 更怕 bit flip
Precision 和对 bit flip 的敏感程度是两回事。fp32 用 exponent 换来了巨大的动态 range，一个 exponent bit 的翻转就是乘以 $2^{128}$ 这样的倍数；int8 是均匀的格子，最坏的翻转也只让值在原来的 range 里挪动。教材给出的防线也正是利用这一点：对 weight 做一次 $|w|\le w_\text{max}$ 的 range check，每个值只多一次比较，就能抓住 exponent 的翻转；对每层的 activation 按校准时看到的 range 设上下界，同样能抓住 runtime 的 corruption。
:::

:::from
Failure 的两类、Google 的 96 次故障（60 次不直接和 ML 有关，36 是我减出来的）、三种 shift 的分解和 house price、cancer screening 一类例子的讲法、监控的几层、KS test 只适用于一维、降维、小 sample 的经验法则、cumulative 与 sliding window、alert fatigue，按 [CS329S 的讲义](https://huyenchip.com/2022/02/07/data-distribution-shifts-and-monitoring.html)；三种 shift 的 robot 例子、confidence 那两组数、$D=0.5$ 和两个 critical value、15 小时与 3 小时的例子是我构造并计算的，KS critical value 用的是大 sample 近似。Dual-bank flash、watchdog、staged rollout、bundle hash、Knight Capital（7/8 台、45 分钟、212 个 parent order、超过 4.6 亿美元）、WCET、graceful degradation 的三种做法出自 MLSysBook Volume I 的 ML Operations 一章；canary 的 sample 量是我按 two-proportion test 的标准公式算的（教材只说看出很小的 accuracy 差别“可能需要几千次 inference”）。Tempe 事故（5.6 秒、三种分类、1.2 秒、压住动作一秒）、fallback 的要求和 0.042 翻转 bit 30 的例子出自 Volume II 的 Robust AI 一章；$1.43\times10^{37}$、int8 的对照和 $\pm0.5$ 的 scale 是我算的和取的。
:::

## 作业

CS249r 不是一期有固定日程的课，没有统一的 deadline 和 autograder。作业有三类：TinyTorch 的 20 个 module（在自己机器上跑，只要 CPU）；教材每章配的 Co-Lab（浏览器里跑的交互 notebook，交的是 Decision Log）；Hardware Kits 的实验（要买板子）。Instructor Hub 的 semester plan 里每周读一章、做对应的 Co-Lab，前 11 周还各配一个 TinyTorch module，由老师决定布置哪些；capstone 是把一个应用 deploy 到几种 hardware 上并写 design report。

TinyTorch 的共同提示（来源：Getting Started 页）：

- 安装：`curl -sSL mlsysbook.ai/tinytorch/install.sh | bash`，然后 `cd tinytorch && source .venv/bin/activate && tito setup`。需要 Python 3.10 以上和 git。
- 每开一个新终端都要先 `source .venv/bin/activate`，否则 `tito` 命令找不到。
- `tito module start 01` 默认打开的 notebook 里答案已经填好，适合从头读到尾。要自己写，用 `tito module start 01 --exercise`（或 `--assignment`），它会去掉答案、生成空的 stub。
- `tito module test N` 只跑 notebook 里的测试；`tito module complete N` 再跑一遍，把代码导出到 `tinytorch` package，对 package 跑第二组测试，并记为完成。后面的 module 依赖导出的代码，所以每个都要 complete。
- 只用 NumPy，CPU 就够，免费 Colab 也能跑。README 说用纯 NumPy train CIFAR-10 的快速版本能到 37%（随机猜是 10%），不要期待 PyTorch 的速度。
- 完成特定 module 会解锁 milestone（`tito milestone run <name>`）：Module 03 之后是 1958 年的 perceptron（只有 forward，weight 是随机的）和 1969 年的 XOR crisis，08 之后是 1986 年的 MLP，09 之后是 1998 年的 CNN，13 之后是 Transformer 和 TinyGPT，17 之后是 Custom Kernels（把自己的 tiled、fused、im2col kernel 放到不规则的 shape 上检查，再和 C++ SIMD、Apple Metal、Triton 的实现比时间），19 之后是 MLPerf 风格的测量。
- Module 是按顺序依赖的，跳不过去：每个 guide 写明了前置：Module 14 要求 01 到 13，15 到 18 要求 01 到 14，19 要求 01 到 18，capstone 要求 01 到 13 和 19。所以只想做后面的 Optimization tier，也得先把前面的 module（包括 10 到 13 的 language model 部分）用带答案的默认 notebook complete 一遍。（来源：各 module guide 的前置一栏）

### TinyTorch Part I：Module 01–08（Tensor 到 Training）

- **从零实现**：Tensor、activation、Linear 等 layer、loss、DataLoader、autograd、SGD 与 Adam、training loop。
- **做完会什么**：一个能 train MLP 的 framework。Autograd 的原理见 [Karpathy 那一页的第 1 站](../courses/KARPATHY-Z2H.html#micrograd)。
- **时间**：guide 上 01 到 08 依次是 4–6、3–5、5–7、4–6、3–5、6–8、3–5、5–7 小时，合计 33–49 小时。
- **优先级**：已经写过 micrograd 或 CMU 10-714 的 needle 的话，可以用默认带答案的 notebook 快速读过并 complete（后面的 module 要依赖它们），把时间留给 Optimization tier（Module 14–19）。
- **提示**（来源：各 module guide 的 “When it fails”）：
  - Module 01：`__init__` 要用 `np.array(data, dtype=np.float32)` 统一成 float32，并设好 `shape`、`size`、`dtype`，后面每个 operation 都读它们。
  - Module 02：sigmoid 直接写 `1 / (1 + np.exp(-x))` 在很大的负数上 overflow，先算 `np.exp(-np.abs(x))` 再按符号分两支；softmax 先减每行的 max，并且沿 `self.dim` 用 `keepdims=True` 求和。
  - Module 03：TinyTorch 的 `Linear` 把 weight 存成 `(in_features, out_features)`，forward 是 `x.matmul(self.weight)`，不要 transpose；dropout 要写成 `x * mask`，留在 Module 06 能求导的路径上。
  - Module 04：cross-entropy 用 `LogSoftmax`（先减 max），guide 的例子是 logits $[1000,1002,1001]$，直接 exp 会 overflow，减去 1002 后得 loss 约 0.4076。
  - Module 05：最后一个不满的 batch 不能丢，用 `range(0, len(indices), self.batch_size)` 走 index；`__iter__` 要把 sample list 交给 `_collate_batch` 叠成 tensor；`shuffle` 为真时每个 epoch 开头都要重新 shuffle。
  - Module 06：$C=AB$ 的 backward 是 $\partial A=\partial C\,B^\top$，忘了 transpose 在方阵上给出错的数，在非方阵上直接 shape 不匹配；MSE 的 gradient 是 $2(p-t)/N$，少了 2 或 $N$ 都只差一个常数倍，测试会报出来。
  - Module 07：Adam 的 bias correction 要除以 $1-\beta_1^t$ 和 $1-\beta_2^t$，而且先把步数 $t$ 加 1 再算，否则第一步 $t=0$，$1-\beta_1^0=0$，得到 inf。
  - Module 08：最后不满 `accumulation_steps` 的那几个 batch 的 gradient 也要在循环结束后 update 一次；`self.epoch` 要在每个 epoch 末尾加 1，learning rate 的 schedule 读的是它。

### TinyTorch Module 10–13：Tokenization 到 Transformer

- **从零实现**：character-level tokenizer 和 BPE tokenizer（10）；embedding layer 和 sinusoidal positional encoding（11）；scaled dot-product attention 和 multi-head attention（12）；layer norm、transformer block 和一个能 `generate` 的 GPT（13）。
- **做完会什么**：一个能 train 和生成文本的小 GPT，以及几个后面要用的 systems 事实：vocabulary 越小 sequence 越长，attention 的 $QK^\top$ 是 $n\times n$，cost 随 sequence 长度平方增长（12 的 guide）；guide 13 的配置（768 宽、12 个 block、50,000 个 token 的 vocabulary）约 163M parameter，其中 block 只占 85M，其余在 token table 和 language head。
- **时间**：4–6、3–5、5–7、8–10 小时，合计 20–28 小时（guide）。
- **优先级**：Optimization tier 的前置，必须 complete；做过 CS336 或 Karpathy 那一页的 [GPT](../courses/KARPATHY-Z2H.html#gpt) 和 [tokenizer](../courses/KARPATHY-Z2H.html#tok) 两站的话用带答案的 notebook 读过即可，没做过的话值得自己写 12 和 13。
- **提示**（来源：各 module guide 的 “When it fails”）：
  - Module 10：数 byte pair 时每个 word 要乘它在 corpus 里的出现次数 `freq`；merge 之后 index 要前进 2 而不是 1，否则 pair 的第二个 symbol 被用了两次；相邻 pair 是 `range(len(tokens) - 1)`，别漏最后一对。
  - Module 11：embedding 的 backward 要用 `np.add.at(grad_weight, indices, grad)`，`grad_weight[indices] += grad` 在同一个 ID 出现两次时只加一次；positional encoding 偶数维是 sin、奇数维是 cos，frequency 是 `exp(-log(10000) * 2i / d)`，维数越高越慢。
  - Module 12：softmax 沿 key 那一维（`dim=-1`）归一化；causal mask 要在 softmax 之前加上。
  - Module 13：layer norm 沿 feature 维（`axis=-1`）求 mean 和 variance，不是沿 batch 维；分母是 `np.sqrt(variance + eps)`。

### TinyTorch Module 09：Convolutions

- **从零实现**：用七重循环写 Conv2d、pooling 和一个 CNN。
- **做完会什么**：convolution 的精确定义。这个慢版本是 Module 17 的对照组。
- **时间**：6–8 小时（guide）。
- **优先级**：值得做。
- **提示**（来源：guide）：
  - 每个 window 的和要用 `+=` 累加，不是赋值。
  - Input 必须是 4 维的 `(batch, channels, height, width)`，灰度图要 reshape 成 `(32, 1, 8, 8)` 这样补上 channel 维。

### TinyTorch Module 14：Profiling

- **从零实现**：数 parameter、数 FLOPs（conv 和 linear 分开数）、arithmetic intensity、判断 memory-bound 还是 compute-bound、带 warm-up 的 latency 测量、backward 和 Adam 的 memory 估计。
- **做完会什么**：第 6 站的前半部分，以及第 1 站 iron law 里每一项怎样数。
- **时间**：3–5 小时（guide）。
- **优先级**：先做。
- **提示**：
  - 一个 multiply-accumulate 算 2 个 FLOP，忘了乘 2 的测试会报 “Expected 16384, got 8192”。（来源：guide）
  - Module 自己承认它的 latency 是 best case：timed loop 反复用同一个 input，第一次之后它就在 cache 里了，真实的 serving 每次都是冷的。（来源：源码）

### TinyTorch Module 15–16：Quantization 与 Compression

- **从零实现**：int8 的 quantize 和 dequantize、量化一个 model；magnitude pruning 等压缩方法。
- **做完会什么**：[MIT 6.5940 第 2、3 站](../courses/MIT-6.5940.html#quant)的内容落在自己的 framework 上。
- **时间**：各 4–6 和 5–7 小时（guide）。
- **优先级**：做过 6.5940 的 Lab 2、Lab 4 的话可以只做 15；没做过的话两个都值得做。
- **提示**（来源：guide）：
  - 算 scale 前先把 range 扩到包含 0.0，否则 zero point 落在 int8 range 之外被 clip，最坏误差远超 $S/2$。
  - 常数 tensor 的 max 等于 min，scale 是 0，要单独处理。
  - Quantize 是 $x/S+Z$，dequantize 是 $(q-Z)S$，zero point 的符号反了会让 round-trip 误差巨大。
  - Pruning 只剪 `ndim > 1` 的 weight matrix，把 bias 算进去会得到 33% 而不是 50% 的 sparsity。

### TinyTorch Module 17：Acceleration

- **从零实现**：vectorized GEMM、fused GELU、tiled matmul、im2col 与 im2col 的 convolution，以及反向的 col2im 和能 train 的 `Im2colConv2dFunction`。
- **做完会什么**：第 3 站的全部内容，并亲手量到 im2col 比 Module 09 的循环快两到三个数量级、Python 里的 tiling 反而更慢。
- **时间**：5–7 小时（guide）。
- **优先级**：先做。这是整套 TinyTorch 里和“系统”关系最直接的一个。
- **提示**（来源：guide）：
  - Tiled matmul 要沿 `k` 的 tile 累加：`C[i0:i1, j0:j1] += A_tile @ B_tile`，用 `=` 会只留最后一个 tile。
  - im2col 的每一行必须按 (channel, kernel row, kernel column) 的顺序展平，和 `weight.reshape(out_ch, -1)` 一致；channel 跑到最后一维时，把 `(N, C, k, k, out_h, out_w)` 用 `(0, 4, 5, 1, 2, 3)` transpose。
  - 展平的 weight 要 transpose 成 `(C·k·k, out_ch)` 再乘；结果先 reshape 成 `(N, out_h, out_w, out_ch)`，再把 channel 换到第二维。
  - col2im 里重叠的 patch 必须用 `+=`，一个像素被几个 patch 覆盖，它的 gradient 是几个的和。

### TinyTorch Module 18：Memoization（KV cache）

- **从零实现**：KV cache 和带 cache 的 attention。
- **做完会什么**：decode 时为什么不用重算前面的 token。原理和大小的算法见 [MIT 6.5940 第 6 站](../courses/MIT-6.5940.html#gen)。
- **时间**：3–5 小时（guide）。
- **优先级**：做过 CS336 或 6.5940 的可以跳。
- **提示**（来源：guide）：`get` 只返回已经填了的位置 `[:, :, :seq_pos, :]`，不是整个预分配的 buffer；`update` 要写在 `[:, :, seq_pos:seq_pos + 1, :]`，写错位置的话所有 token 会挤在同一格。

### TinyTorch Module 19–20：Benchmarking 与 Capstone

- **从零实现**：带 warm-up、多次重复、median、percentile 和 $t$ distribution confidence interval 的 benchmark harness，多指标对比和 Pareto frontier；capstone 里对 baseline 和优化后的 model 各跑一遍，参加五个 event。
- **做完会什么**：第 6 站。
- **时间**：19 是 5–7 小时，20 是 6–8 小时（guide）。
- **优先级**：19 先做，20 值得做。
- **提示**：
  - Timer 要在 `with` 块结束时记录时间：在 `yield` 之后的 `finally` 里写 `timer.elapsed = time.perf_counter() - timer.start_time`。（来源：Module 19 guide）
  - Capstone 的五个 event 各有门槛：Latency Sprint 和 Memory Challenge 要 accuracy 至少 85%，Accuracy Contest 要 median latency 低于 100 ms、model 小于 10 MB，Extreme Push 要 accuracy 至少 80%。没有综合分，accuracy、latency、storage 要分开看。（来源：Module 20 guide）
  - 用 TinyDigits 时在 `datasets/tinydigits/test.pkl` 的 200 个 sample 上评估，并把 dataset、split、preprocessing 和结果一起记下来；module 开头的演示用的是 100 个合成 sample，不是 TinyDigits 的 accuracy。（来源：Module 20 guide）

### Co-Labs：每章一个 lab，交 Decision Log

- **内容**：Volume I 有 17 个 lab（Lab 00 是上手，01 到 16 各对一章），在浏览器里用 WebAssembly 跑，不用安装。每个 lab 分 A 到 E 几个 part，每个 part 先锁定一个 prediction（单选或填数，不能写自由文字），再动 lab 里的控件做对照实验，把“基线”和“改了一个条件”的两次结果存下来，写一段解释；最后写一个推荐（或者“暂缓”），说清被否掉的方案和什么情况下会改主意，下载下来交。计算由 mlsysim 做，lab 开始时选一个 track（TinyML、Mobile、Edge、Cloud），同样的问题在不同 track 上数字不同。
- **和本页对应的几个**（题目取自 Volume I 的 learning path）：
  - Lab 01（Introduction）：runtime 正常但 population 变了，怎样证明 task quality 受影响；哪一项时间值得先优化（memory、compute、overhead 三段的堆叠条）。对应第 1 站。
  - Lab 02（System Paradigms，“Where should inference run?”）：remote path 的 upload、传播、计算、download 四段里，改哪一段能赶上 deadline；换更快的 processor 还是换 memory；duty cycle 和电量；最后在 raw data 不许离开 device 时重新选 placement。对应第 1 站。
  - Lab 04（Data Engineering）：split 和 preprocessing 怎样让 accuracy 更高、证据却更弱（leakage）；execution 为什么在等 data。对应第 2 站。
  - Lab 07（ML Frameworks，“The Framework Tax”）：同样的计算量、不同的 dispatch 次数；compilation 什么时候回本；fusion 省掉了什么；runtime 能不能执行这个 graph 的每个 operation。对应第 3、4 站。
  - Lab 12（Benchmarking）：局部的 speedup 有没有改善整条用户路径；要测多少次；持续运行后赢家还是不是赢家；变快之后行为还对不对。对应第 6 站。
  - Lab 13（Model Serving）：bursty 的 demand 下 headroom 够不够；什么时候等着凑 batch 值得；weight 放得下不等于并发的 request 放得下；overload 时怎样保住有用的服务。对应第 5 站。
  - Lab 14（ML Operations）：proxy 报警算不算 outcome 失败；canary 在 outcome 证据攒够之前能不能放得下；快速回滚 routing 算不算恢复。对应第 7 站。
- **所需**：浏览器。Lab 01 的 instructor note 估计一个 lab 约 50–55 分钟，并注明这是设计时的估计，还没有学生试过。
- **优先级**：值得做，尤其是 02、07、13：它们正好是本页第 1、3、5 站的计算，lab 让你在 prediction 先锁定的条件下看自己错在哪。
- **提示**（来源：labs 的 README、landing page 和 Lab 01 instructor note）：
  - 第一次打开要下载 runtime 和依赖，可能要几分钟。
  - 存下来的对照是冻结的，之后再动控件不会改它；但改了前面 part 的条件，后面 part 存的结论会被标成过期，要重新存。
  - 一次只改一个条件再存；改了两个以上，lab 会提示这组对照分不开两个因素的作用。
  - Instructor note 明确说：完成的标准是用对照证据为一个决定辩护，不要求把每个模拟系统都调成可行；一开始猜错的 prediction 要留着，它就是证据。

### Raspberry Pi kit：Setup 与 Image Classification

- **内容**：给 Pi 装系统、远程连接、测温度和 power；用 TFLite 跑 MobileNet 分类，再用 Edge Impulse 做 transfer learning 并 deploy int8 model。
- **所需**：Raspberry Pi Zero 2 W（约 15 美元）、Pi 4（4 GB，约 55 美元）或 Pi 5（4 GB 约 60 美元，8 GB 约 80 美元），价格来自 Instructor Hub；一张 SD 卡和 camera。时间页面没写，我估计各 3–5 小时。
- **优先级**：先做（后面的实验都建立在它上面）。
- **提示**：
  - 先看 input details 的 dtype：uint8 的 model 直接送 0–255 像素，int8 的要先除以 255 再按 scale 和 zero point 换算，float32 的除以 255。（来源：Image Classification 实验）实验代码换算时用 `astype` 截断，不是 round，亮的那四分之一像素会差一个 step，见[第 4 站](#deploy)的边界情况。（来源：我自己算的）
  - Kit 给的参考：Edge Impulse Studio 对 transfer learning 得到的 model 估计 Pi 4 上约 35 ms；实测 Pi Zero 上 160×160 的 int8 model 约 125 ms，是 Pi 5 的 3 到 4 倍。（来源：Image Classification 实验）
  - Setup 实验里有一个 Pi 5 用的脚本 `avg_temp_power.sh`：每秒一次、共 50 次，用 `vcgencmd measure_temp` 读温度，用 `vcgencmd pmic_read_adc` 读各条 PMIC rail 的 voltage 和 current，把 $\sum V_iI_i$ 加起来，再按 $1.1451P+0.5879$ 线性校正成估计的整板 power，输出平均值和标准差。它量到的是 board 核心的 power，不含 USB 设备和电源损耗。Idle 的例子是 47.25 °C、估计 3.235 W。做后面任何 benchmark 时都开着它。（来源：Setup 实验）
  - Pi Zero 2 W 上做 ML 要把默认的 zram 关掉，改用 SD 卡上的 2 GB swap file。zram 是放在 RAM 里的压缩 swap，Zero 2 W 只有约 415 MB 可用，zram 占掉约三分之一，真正腾不出 memory。实验量到 YOLO11n 在 320 下 zram 7562 ms 对 swap file 1946 ms，640 下 13541 ms 对 5426 ms，开着 zram 时 Python 进程还会被 OOM killer 杀掉。（来源：Setup 实验）

### Raspberry Pi kit：Object Detection

- **内容**：在 Pi 上采集图片，用 Roboflow 做 annotation，分别 train 并 deploy SSD-MobileNet、FOMO（Edge Impulse）和 Ultralytics 的 YOLO（在 Colab 上 train），比较 latency 和效果，处理 int8 input、NMS 和 live stream。
- **做完会什么**：开头三件事和第 4 站的全部内容。
- **所需**：同上；YOLO 在 Colab 的免费 GPU 上 train。时间页面没写，我估计 6–10 小时。
- **优先级**：先做。
- **提示**（来源：Object Detection 实验）：
  - train、export、inference 三处 `imgsz` 必须相同；export 后先看 predict 输出第一行的 shape。
  - 量 latency 前先跑一次 warm-up。Zero 2 W 上第一次和第二次差将近五倍。
  - 不同 model 的差别是数量级的：SSD-MobileNet 在 Pi Zero 上 0.5 到 1.3 秒一个 frame，FOMO 在 Pi 4 上 8 ms，大约快 60 倍。
  - Confidence threshold 调低会出现重复的框，要做 NMS；YOLO26 默认的 end-to-end head 不需要 NMS，`iou` 参数对它无效。
  - NCNN 不一定更快：YOLO26 导出到 NCNN 会被换成 one-to-many head，比原来的 PyTorch 版本还慢，用 ONNX 才保留 end-to-end head。
  - 在 Zero 2 W 上做 NCNN 的转换要在 terminal 里跑，不要在 Jupyter 里：转换工具 `pnnx` 会占满四个 core 一分钟以上，并在 PyTorch 之外另外分配 memory，在已经载了几个 model 的 notebook 里跑，板子反复重启；从 SSH 直接跑约 90 秒完成。
  - 装 Ultralytics 用普通的包就够，`ultralytics[export]` 会额外装 TensorFlow、OpenVINO、CoreMLTools，在 Zero 2 W 上装很久而且本实验用不到；NCNN 导出需要的 `pnnx` 会在用到时自己下载。
  - 长方形的图要压扁成正方形，不要裁剪；Edge Impulse 免费版的 data 集不能导出到别的平台，所以实验用 Roboflow 管理 data。

### Raspberry Pi kit：Small Language Models 与 Vision-Language Models

- **内容**：在 Pi 5 上用 Ollama 跑 Llama 3.2 等 small language model，用 Python 调用；跑 Florence-2 做 captioning、detection、segmentation。
- **所需**：Pi 5（kit 说 GenAI 实验需要 Pi 5）和主动散热器。时间我估计各 3–5 小时。
- **优先级**：有余力再做。
- **提示**：
  - 一定装主动散热器：Pi 在 80 °C 开始 throttle，85 °C 是上限；Active Cooler 的风扇在 60 °C 打开、67.5 °C 加速。装了散热器跑 SLM 时 CPU 100% 也会到将近 70 °C。（来源：Small Language Models 实验）
  - Ollama 加 `--verbose` 会分别报 prompt eval rate 和 eval rate。Kit 在 Pi 5 上量到 Llama 3.2 1B 的 prompt eval rate 19.46 token/s、eval rate 8.99 token/s，3B 的 eval rate 5.3 token/s，Phi-3.5 3.8B 只有 2.25 token/s。处理 prompt 时一次喂进很多 token，weight 读一遍能算很多个 token；生成时每个 token 都要把 weight 读一遍，所以生成比处理 prompt 慢（这个解释是我加的，roofline 的讲法见 [MIT 6.5940 第 1 站](../courses/MIT-6.5940.html#eff)）。在 Pi 5 的 CPU 上两者只差约 2 倍。（来源：Small Language Models 实验）
  - 读 `--verbose` 的输出要按 token 算。Kit 那次 1B 的运行：prompt 32 个 token 用了 1.645 s，生成 8 个 token 用了 0.890 s，kit 的正文据此说 prompt 的处理“占了大头”、生成“计算量更小”。按每个 token 算正好相反：prompt 每个 token $1.645/32=51$ ms，生成每个 token $0.890/8=111$ ms。Prompt 的总时间长，只是因为它的 token 多。（来源：Small Language Models 实验的数，除法是我算的）
  - Florence-2 在 Pi 5 上：caption 16–17 秒，object detection 20–41 秒，OCR 37–38 秒，segmentation 83–207 秒，只适合离线处理，不能进 control loop。跑 object detection 时四个 core 全满、memory 用到 5 GB 以上，实验建议把 swap 加到 2 GB；温度能到 80 °C 以上。（来源：VLM 实验的 latency 汇总）

### MCU kit：XIAO ESP32S3、Nicla Vision、Grove Vision AI V2

- **内容**：在 microcontroller 上做 keyword spotting、image classification、object detection、motion classification，主要用 Edge Impulse 做 training、Arduino IDE 做 deployment。
- **做完会什么**：TinyML 一档的真实约束：几百 KB 的 SRAM、PSRAM 的使用、preprocessing 比 model 还贵。
- **所需**：三种板子按手头有的选一种即可，内容大致平行。时间页面没写。
- **优先级**：有余力再做；研究方向在 MCU 级 sensing 的话先做 KWS。
- **提示**（来源：XIAO ESP32S3 的 KWS 实验）：
  - 必须在 Arduino IDE 里打开 PSRAM（`Tools > PSRAM: OPI PSRAM`），录音的 buffer 用 `ps_malloc` 分在 PSRAM 上。
  - 实验要求 `esp32 by Espressif Systems` 的 library 停在页面指定的版本（页面写作 2.017），不要升级。
  - XIAO ESP32S3 Sense 板上是 8 MB PSRAM 和 8 MB flash；芯片内部的 RAM 只有几百 KB。
  - MFCC 的 preprocessing 估计要 675 ms，model 本身估计 6 ms；要降 latency 先改 FFT length（实验建议降到 256）和 coefficient 个数。
  - 部署后的 sketch 会打印 `DSP`、`Classification`、`Anomaly` 三段各多少 ms，拿它核对上面两个估计。
