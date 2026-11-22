---
code: MIT-6.5940
evidence: syllabus
evidenceNote: "期次：Fall 2026（正在进行，Lecture 1–19 的 slides 和录像已发布）；Fall 2024 一期材料完整。课程主页的讲次表、lab 列表和评分规则是直接读的；slides 放在 Dropbox 上，这次抓取被拒，没有读到 slides 原文。各站的讲法依据是：erectbranch 与 TinyML KOR 两份对着 2022–2024 版 slides 写的逐讲笔记、课程引用的原始论文（Han 2015、Deep Compression、SmoothQuant、AWQ、MCUNet、MCUNetV2、Once-for-All、SVDQuant），以及 2024 版 lab 的社区镜像。每站末尾写明具体读了什么。"
exam: "无考试；以作业为主。按 Fall 2026 课程主页：5 个 lab 个人完成，至少交 4 个才能 pass；另有分组 final project（proposal、poster presentation、final report）。主页没有给出各部分的百分比权重。"
subskills:
  - id: eff
    name: Efficiency 的账：memory、compute 与 energy
    l3: "有提示能做：给出一个 Transformer 的 shape，数出 parameter 数和 fp16 下的 model size。"
    l4: "能独立做：算出 decode 一个 token 的 FLOPs、bytes 和 arithmetic intensity，用 roofline 判断它是 memory-bound 还是 compute-bound，并给出 latency 的下界。"
    l5: "能讲给别人：从 energy table 和 roofline 两条线解释为什么这门课的每个方法都在减少被搬动的 bytes，而不只是减少 FLOPs。"
  - id: prune
    name: Pruning 与 sparsity
    l3: "有提示能做：对一个小 matrix 按 magnitude 剪到给定 sparsity，并算出剪后的 error。"
    l4: "能独立做：用 sensitivity scan 给每层选 sparsity，做 channel pruning 时同步改 BatchNorm 和下一层的 input channel，并估计 MACs 降多少。"
    l5: "能讲给别人：用 CSR 的 storage 账和 GPU 的执行方式说明 unstructured sparsity 为什么很少变快，以及 2:4 和 channel pruning 各自怎样绕过这个问题。"
  - id: quant
    name: Quantization：从 k-means 到 integer-only inference
    l3: "有提示能做：对一个 matrix 算出 linear quantization 的 scale 和 zero point，并量出 reconstruction error。"
    l4: "能独立做：推导 quantized matrix multiplication 里每一项哪些能 offline 算好，写出 int32 accumulation 和 fixed-point rescale 的流程，区分 per-tensor 与 per-channel。"
    l5: "能讲给别人：解释 rounding error 与 clipping error 的取舍、STE 为什么让 QAT 能训练，以及 k-means quantization 省 storage 却不省 compute 的原因。"
  - id: llmq
    name: LLM 的 quantization：outlier、SmoothQuant 与 AWQ
    l3: "有提示能做：对一个带 outlier channel 的 activation 算出 per-tensor int8 的 error，再用 SmoothQuant 的 formula 算 smoothing factor。"
    l4: "能独立做：说明 per-input-channel 的 activation scale 为什么不能放进 integer GEMM，并按 decode 的 bytes 判断 W4A16 和 W8A8 哪个更快。"
    l5: "能讲给别人：从 AWQ 的 error 推导解释 scale salient channel 为什么有效、为什么 s 不能取太大。"
  - id: nas
    name: Neural architecture search 与 knowledge distillation
    l3: "有提示能做：算出 regular conv 与 depthwise-separable conv 的 MACs 和 bytes。"
    l4: "能独立做：说明 hardware-aware NAS 为什么用 latency lookup table 而不用 MACs；写出带 temperature 的 distillation loss 并算一组 soft target。"
    l5: "能讲给别人：从 soft target 的 gradient 解释 dark knowledge 和 $T^2$ factor 的来由，以及 Once-for-All 为什么能把搜索成本摊到很多 hardware 上。"
  - id: gen
    name: LLM 与 diffusion 的高效推理
    l3: "有提示能做：用 formula 算出一个 LLM 在给定 sequence length 和 batch size 下的 KV cache 大小。"
    l4: "能独立做：算出 GQA 省多少 KV cache；推出 speculative decoding 每次 target model forward 期望产出的 token 数和 speedup。"
    l5: "能讲给别人：证明 speculative sampling 的输出分布等于 target model 的分布；解释 diffusion model 为什么是 compute-bound，因而需要 W4A4 和 SVDQuant 的 low-rank branch。"
  - id: mcu
    name: Microcontroller 上的 deep learning：MCUNet 与 TinyEngine
    l3: "有提示能做：逐层算出 MobileNetV2 的 int8 peak activation memory，并和 MCU 的 SRAM 比较。"
    l4: "能独立做：解释 in-place depthwise convolution 怎样把 2N 降到 N+1，算出 patch-based inference 的 halo overhead。"
    l5: "能讲给别人：说明为什么 MCU 上的瓶颈是 activation 而不是 weight，以及 TinyNAS 和 TinyEngine 是怎样一起解决它的。"
  - id: robot
    name: 接到机器人：Jetson 级硬件上的 policy
    l3: "有提示能做：用 weight bytes 除以 memory bandwidth，给一个 7B 的 VLA 在 Jetson 上每个 control step 的 latency 下界。"
    l4: "能独立做：比较 bf16、int8、int4 三种精度在 memory、success rate、实际频率上的取舍，并说出 int8 反而更慢可能的原因。"
    l5: "能讲给别人：把前面各站的结论分成“可以直接搬到机器人上”和“必须在设备上实测”两类，并说清依据。"
open:
  - label: "MIT 6.5940 TinyML and Efficient Deep Learning Computing（Song Han），Fall 2026 课程主页"
    url: "https://hanlab.mit.edu/courses/2026-fall-65940"
    note: "读了讲次表、lab 列表、评分规则。slides 链接到 Dropbox，抓取被拒，没有读到。"
  - label: "MIT 6.5940 Fall 2024 课程主页"
    url: "https://hanlab.mit.edu/courses/2024-fall-65940"
    note: "读了讲次表和 lab 列表（含 On-Device Training 一讲）；slides 同样在 Dropbox，没读到。"
  - label: "erectbranch：MIT Efficient AI 逐讲笔记（对着 2022–2024 版 slides 写）"
    url: "https://erectbranch.github.io/MIT-Efficient-AI/notes/"
    note: "读了 Lecture 2（efficiency metrics）、3–4（pruning、sparse hardware）、5–6（quantization、PTQ、QAT）、7–8（NAS）、10（distillation）、12（Transformer variants）、13（LLM quantization、serving）各篇。是第 1–6 站的主要讲法来源。"
  - label: "TinyML KOR：Lab 1 Pruning、Lab 2 Quantization 的 notebook 镜像与运行结果；Lecture 3 笔记"
    url: "https://tinyml-kor.github.io/blog/posts/labs/lab01.html"
    note: "第 2、3 站的 lab 数字和“作业”一节的提示。Lab 2 的镜像在 https://tinyml-kor.github.io/blog/posts/labs/lab02.html 。"
  - label: "gozhiyuan：6.5940 Fall 2024 Lecture 5、10、11 笔记"
    url: "https://gozhiyuan.github.io/tinyml/large-language-model/2024/10/21/mit-tinyml-11.html"
    note: "读了，内容较简略，只用来核对讲次顺序和 TinyEngine 的几个名词。"
  - label: "Han et al. 2015：Learning both Weights and Connections for Efficient Neural Networks"
    url: "https://ar5iv.labs.arxiv.org/html/1506.02626"
    note: "第 1 站的 energy table、第 2 站的三步法和 AlexNet、VGG-16 的数字。"
  - label: "Han et al.：Deep Compression"
    url: "https://ar5iv.labs.arxiv.org/html/1510.00149"
    note: "第 3 站 k-means quantization 的 compression rate 和 35×、49× 的结果。"
  - label: "SmoothQuant 与 AWQ 论文"
    url: "https://arxiv.org/html/2306.00978v5"
    note: "第 4 站。SmoothQuant 读的是 https://arxiv.org/html/2211.10438v7 。"
  - label: "MCUNet 与 MCUNetV2 论文"
    url: "https://ar5iv.labs.arxiv.org/html/2007.10319"
    note: "第 7 站。MCUNetV2 读的是 https://arxiv.org/html/2110.15352v2 。"
  - label: "Once-for-All、Hinton 等的 Distilling the Knowledge in a Neural Network"
    url: "https://ar5iv.labs.arxiv.org/html/1908.09791"
    note: "第 5 站。Hinton 的论文读的是 https://ar5iv.labs.arxiv.org/html/1503.02531 。"
  - label: "Leviathan et al.：Speculative Decoding；SVDQuant"
    url: "https://ar5iv.labs.arxiv.org/html/2211.17192"
    note: "第 6 站。SVDQuant 读的是 https://arxiv.org/html/2411.05007v4 。"
  - label: "OpenVLA 论文；TinyChatEngine README；tinychat-tutorial README"
    url: "https://arxiv.org/html/2406.09246v3"
    note: "第 8 站和 Lab 5 的提示。README 在 https://github.com/mit-han-lab/tinychatengine 与 https://github.com/mit-han-lab/tinychat-tutorial 。"
sources:
  - label: "6.5940 Fall 2026 课程主页（讲次、lab、评分）"
    url: "https://hanlab.mit.edu/courses/2026-fall-65940"
  - label: "NVIDIA 技术博客：Jetson AGX Orin 与 Orin NX 规格"
    url: "https://developer.nvidia.com/blog/delivering-server-class-performance-at-the-edge-with-nvidia-jetson-orin"
---

先看三次部署。每一次模型都训练好了、准确率也够，到了设备上却跑不起来。

**第一次。** Llama-2-7B 有 67.4 亿个 parameter，每个存成 fp16 占 2 byte，光 weight 就是 13.5 GB。Jetson Orin NX 8GB 一共只有 8 GB memory，放不下。

::fig[m6940-fit] 第一次：weight 的大小与 8 GB 的设备。

**第二次。** 换一块 RTX 4090，165 TFLOPS 的算力，生成一个 token 只需要 135 亿次 floating-point operation，照这个算一秒能出一万多个 token。实测是 20 个 token 要 310 ms，每秒 65 个左右，算力用掉不到百分之一。

::fig[m6940-roofline] 第二次：decode 落在 roofline 的斜线段上，离拐点很远（第 1 站会算出这些位置）。

**第三次。** MobileNetV2 只有 340 万个 parameter，int8 之后 3.4 MB。放到一块 320 KB SRAM 的 microcontroller 上，问题出在 activation：网络前部的一个 $1\times1$ conv，input 加 output 要 1372 KiB，是 SRAM 的四倍多。

::fig[m6940-invres] 第三次：那个 $1\times1$ conv 的 input、output 与 SRAM（第 7 站逐层算）。动起来看 output 一个 channel 一个 channel 写出来，input 一直不能丢，写到第 10 个 channel 就越过了 SRAM 那条虚线。

三件事的原因是同一个：设备的瓶颈常常是“把多少 byte 从哪里搬到哪里”，而不是“做多少次乘法”。这门课的每个方法都可以用同一组问题去检验：它减少了存下的 bytes 吗？减少了每次 inference 要搬的 bytes 吗？减少了 operation 吗？在真实 hardware 上变快了吗？最后一个问题的答案常常和前三个不一样。

课程的顺序是：先学会记账（第 1 站），然后用三种办法把模型变小，减少 weight 的个数（第 2 站）、减少每个数的 bit 数（第 3、4 站）、换一个更好的结构或者让小模型向大模型学（第 5 站）；接着处理 generative model 特有的成本（第 6 站）；再到最小的设备 microcontroller 上（第 7 站）。第 8 站不在课程里，是用前七站的账去算一个机器人 policy 在 Jetson 上能跑多快。

| 方法 | 减少了什么 | 在哪种情况下能变快 |
|---|---|---|
| Fine-grained pruning | weight 的个数 | 几乎只在专用 hardware 上 |
| Channel pruning、2:4 sparsity | weight 个数和 MACs | 普通 hardware；2:4 需要 Ampere 以后的 GPU |
| Weight-only quantization（W4A16） | 搬动的 weight bytes | memory-bound 的时候，例如 LLM decode |
| Weight-activation quantization（W8A8、W4A4） | bytes 和 operation 的位宽 | compute-bound 的时候，例如 prefill、diffusion |
| KV cache、GQA、speculative decoding | 重复计算、KV 的 bytes、forward 的次数 | LLM 生成 |
| MCUNet、TinyEngine | peak activation memory | microcontroller |

## [eff] Efficiency 的账：memory、compute 与 energy

:::skip
快速路线里这一站不是 brief 列出的必读讲次（Lecture 1–2），但后面每一站都要用这里的账。能自己算出 Llama-2-7B 的 fp16 model size、decode 一个 token 的 arithmetic intensity，并说出它在 RTX 4090 上为什么是 memory-bound，就可以去第 2 站。
:::

### 先数一个真实模型

Llama-2-7B 的 shape：hidden size $d=4096$，32 个 layer，FFN 的 hidden size 11008，vocabulary 32000。数 parameter 只需要 layer 的两条规则：linear layer 的 parameter 数是 $c_o\times c_i$，convolution 是 $c_o\times c_i\times k_h\times k_w$（bias 忽略）。

每个 layer 的 attention 有 $W_Q,W_K,W_V,W_O$ 四个 $d\times d$ 的 matrix：

$$4d^2=4\times4096^2=67{,}108{,}864$$

FFN 用的是 SwiGLU，有三个 matrix（两个 $d\times11008$，一个 $11008\times d$）：

$$3\times4096\times11008=135{,}266{,}304$$

加上两个 norm 的 $2d$ 个 parameter，每个 layer 是 202,383,360 个。32 层再加上 input embedding 和 output head（各 $32000\times4096$）以及最后一个 norm：

$$32\times202{,}383{,}360+2\times131{,}072{,}000+4096=6{,}738{,}415{,}616$$

约 67.4 亿，其中 96.1% 在 linear layer 里。所以后面讨论 quantization、pruning 时，只要盯住 linear layer 就够了。

Model size 等于 parameter 数乘 bit width：

| 精度 | model size |
|---|---|
| fp16 / bf16 | 13.48 GB |
| int8 | 6.74 GB |
| int4 | 3.37 GB（还要加上 scale，见第 4 站） |

第一次事故到这里就算清楚了：8 GB 的设备放不下 fp16，放得下 int4。

### Parameter 少不等于计算少

Linear layer 每个 weight 对每个 token 做一次 multiply-accumulate（MAC），所以 MACs 和 parameter 数相同。Convolution 不一样：同一个 kernel 要在 output 的每个位置上用一次，

$$\text{MACs}=c_o\times c_i\times k_h\times k_w\times h_o\times w_o$$

课上用 AlexNet 的 conv1 算过：96 个 $3\times11\times11$ 的 kernel，output 是 $55\times55$。

$$\text{params}=96\times3\times11\times11=34{,}848,\qquad\text{MACs}=34{,}848\times55\times55=105{,}415{,}200$$

而 AlexNet 的第一个 fully-connected layer 有 $4096\times9216=37{,}748{,}736$ 个 parameter，MACs 也只是这么多。前者 parameter 是后者的千分之一，MACs 却是后者的 2.8 倍。“参数量”“计算量”“memory”是三本不同的账，只看一本会得出错误的结论。1 个 MAC 记作 2 个 FLOP（一乘一加），所以上面的 105M MACs 是 211M FLOP。

::fig[m6940-convfc] AlexNet 的 conv1 与第一个 FC layer，两本账方向相反。

### Latency 由两个时间里大的那个决定

一次 inference 要做两件事：把数据（weight 和 activation）从 memory 搬到计算单元，以及做计算。两件事可以流水线重叠，所以

$$\text{latency}\approx\max\big(T_\text{compute},\ T_\text{memory}\big),\qquad T_\text{compute}=\frac{\text{FLOPs}}{\text{peak FLOPS}},\qquad T_\text{memory}=\frac{\text{bytes}}{\text{bandwidth}}$$

现在算第二次事故。Batch size 为 1 时，生成一个 token 要把整个模型过一遍，每个 weight 恰好用一次（一个 MAC），所以

$$\text{FLOPs}=2\times6.738\times10^9=13.48\times10^9,\qquad\text{bytes}\approx2\times6.738\times10^9=13.48\times10^9$$

AWQ 论文给出 RTX 4090 的两个数：peak 165 TFLOPS，memory bandwidth 1 TB/s。

$$T_\text{compute}=\frac{13.48\times10^9}{165\times10^{12}}=0.082\ \text{ms},\qquad T_\text{memory}=\frac{13.48\times10^9}{10^{12}}=13.5\ \text{ms}$$

搬 weight 的时间是算的时间的 165 倍。Latency 至少 13.5 ms，每秒最多 74 个 token。AWQ 论文实测 20 个 token 用 310 ms，平均 15.5 ms 一个，已经贴着这个下界。

两个时间之比可以写成一个只和 workload 有关的量和一个只和 hardware 有关的量。前者叫 arithmetic intensity：

$$I=\frac{\text{FLOPs}}{\text{bytes}}$$

后者是 peak FLOPS 除以 bandwidth，RTX 4090 是 $165\times10^{12}/10^{12}=165$ FLOP/byte。$I$ 小于它时，算力闲着等数据，叫 memory-bound；大于它时叫 compute-bound。能达到的速度是

$$\text{attainable FLOPS}=\min\big(\text{peak FLOPS},\ I\times\text{bandwidth}\big)$$

画出来是一条先斜后平的线，叫 roofline。

::fig[m6940-roofline] RTX 4090 的 roofline（两个参数取自 AWQ 论文）。斜线段上的 workload 受 bandwidth 限制，平线段上的受算力限制，拐点在 165 FLOP/byte。

一个 linear layer（$d\times d$，fp16）同时处理 $N$ 个 token 时，FLOPs 是 $2Nd^2$，要搬的是 $2d^2$ 个 byte 的 weight 加上 $2N\cdot d$ 的 input 和 $2N\cdot d$ 的 output：

$$I=\frac{2Nd^2}{2d^2+4Nd}=\frac{N}{1+2N/d}$$

- Decode（$N=1$，$d=4096$）：$I=1/(1+2/4096)\approx1.0$。
- 处理 200 个 token 的 prompt（叫 prefill）：$I=200/(1+400/4096)=182$，越过拐点，变成 compute-bound。AWQ 论文实测这一步只要约 10 ms。

同一个模型、同一块 GPU，prompt 阶段和生成阶段落在 roofline 的两侧。所以后面会看到两类不同的优化：让 decode 少搬 bytes（第 4 站的 W4A16），让 prefill 和 diffusion 少算（第 4 站的 W8A8、第 6 站的 W4A4）。

:::wrong 每个 token 只要 135 亿次 operation，165 TFLOPS 的 GPU 一秒能生成一万个 token
$165\times10^{12}/13.48\times10^9=12{,}240$，这是只看 compute 那本账的结果。Decode 的 arithmetic intensity 只有 1 FLOP/byte，在拐点（165）左边很远，速度由 bandwidth 决定：$10^{12}$ byte/s 除以每个 token 的 $13.48\times10^9$ byte，是 74 个 token 每秒，差了 165 倍。判断一个模型在某个设备上多快，先算 $I$，看它落在 roofline 的哪一侧。
:::

### Energy：搬数据比算数据贵

在电池和散热有限的设备上，energy 和 latency 同样要紧。Han 2015 引用了 Horowitz 在 45 nm 工艺下测的一张表（每次 32-bit operation）：

| operation | energy（pJ） |
|---|---|
| int ADD | 0.1 |
| float ADD | 0.9 |
| register file | 1 |
| int MULT | 3.1 |
| float MULT | 3.7 |
| SRAM cache 读 | 5 |
| DRAM 读 | 640 |

从 DRAM 读一个 32-bit 的数要 640 pJ，是一次 float 乘法的 173 倍，是从片上 SRAM 读的 128 倍。拿 decode 来算：每个 weight 要从 DRAM 读一次（640 pJ），只参与一次乘加（3.7 + 0.9 = 4.6 pJ），搬运的 energy 是计算的 139 倍。

这张表和 roofline 指向同一个结论：要省的首先是 off-chip memory 的访问。能放进 SRAM 的东西就别放 DRAM，必须放 DRAM 的东西就让它更少、更短。这是 pruning 和 quantization 的原始动机，也是第 7 站里 weight 放 Flash、activation 必须挤进 SRAM 的原因。

### Memory 不只是 weight

Inference 时还要存 activation。一个 layer 执行时，它的 input 和 output 必须同时在 memory 里，所以 activation 的 peak 大约是

$$\text{peak activation}\approx\max_\text{layer}\big(\text{input size}+\text{output size}\big)$$

AlexNet conv1：input $3\times224\times224=150{,}528$，output $96\times55\times55=290{,}400$，合计 440,928 个数，是 conv1 的 34,848 个 parameter 的 12.7 倍。课上的另一个例子是 MobileNetV2 与 ResNet 的对比：MobileNetV2 的 parameter 少得多，peak activation 却没有跟着变小，瓶颈集中在靠近 input、resolution 还很大的那几个 layer。第 7 站会把这件事从头算一遍。Training 时还要为 backward 存下所有 layer 的 activation，那时 activation 是 memory 的主要部分。

:::from
Efficiency metrics 的分类（latency、storage、memory、MACs、peak activation）、latency $\approx\max(T_\text{compute},T_\text{memory})$、各类 layer 的 parameter 和 MACs formula、AlexNet 的数字、MobileNetV2 的 activation 瓶颈，按 [erectbranch 的 Lecture 2 笔记](https://erectbranch.github.io/MIT-Efficient-AI/notes/2022/lec02/summary02)（对着 2022 版 slides 写的；我没有读到 2026 版 slides，Dropbox 被拒）。Energy table 出自 [Han et al. 2015](https://ar5iv.labs.arxiv.org/html/1506.02626) 的 Figure 1。RTX 4090 的 165 TFLOPS、1 TB/s、20 个 token 310 ms、200 个 token 的 prompt 约 10 ms 出自 [AWQ 论文](https://arxiv.org/html/2306.00978v5)。Llama-2-7B 的 shape（4096、32、11008、32000）是凭我自己的知识写的，用它算出的 6,738,415,616 与公开的 6.7B 一致；arithmetic intensity 的 formula 和所有计算是为这一页做的。
:::

## [prune] Pruning 与 sparsity

:::skip
快速路线必读（Lecture 3–4，Pruning lab 直接依赖它）。能对一个 matrix 做 magnitude pruning 并量出 error，能用 CSR 的 storage 账说明 50% 的 unstructured sparsity 为什么不省 memory，能算出 30% channel pruning 让 MACs 降到多少，就可以去第 3 站。
:::

### 哪些 weight 可以去掉

Pruning 的目标写成一个 optimization problem：在 nonzero 的 weight 不超过 $N$ 个的条件下，让 loss 最小。

$$\min_{W_p}\ L(x;W_p)\qquad\text{subject to}\qquad\|W_p\|_0<N$$

$\|W_p\|_0$ 是 nonzero entry 的个数。这个问题是 combinatorial 的，没法直接解，需要一个 criterion 判断每个 weight 有多重要。最简单的是看 absolute value：去掉 $w_i$，output 少了 $w_ix_i$ 这一项，在各个 input 大小差不多时，$|w_i|$ 越小，影响越小。这叫 magnitude-based pruning。

这一站和下一站都用课上反复出现的这个 $4\times4$ weight matrix：

$$W=\begin{pmatrix}2.09&-0.98&1.48&0.09\\0.05&-0.14&-1.08&2.12\\-0.91&1.92&0&-1.03\\1.87&0&1.53&1.49\end{pmatrix}$$

剪掉 50%，即 8 个。把 16 个 absolute value 排好：

$$0,\ 0,\ 0.05,\ 0.09,\ 0.14,\ 0.91,\ 0.98,\ \mathbf{1.03},\ 1.08,\ 1.48,\ 1.49,\ 1.53,\ 1.87,\ 1.92,\ 2.09,\ 2.12$$

第 8 小的是 1.03，取它作 threshold，保留 $|w|>1.03$ 的 entry（Lab 里的 `fine_grained_prune` 就是这样做的，用 `torch.kthvalue` 取第 $k$ 小的值）：

$$W_p=\begin{pmatrix}2.09&0&1.48&0\\0&0&-1.08&2.12\\0&1.92&0&0\\1.87&0&1.53&1.49\end{pmatrix}$$

剪掉的 8 个数的 sum of squares 是 2.88，原来的是 26.84。用 Frobenius norm 量 error：

$$\frac{\|W-W_p\|_F}{\|W\|_F}=\sqrt{\frac{2.88}{26.84}}=0.328$$

剪 25% 时这个数是 0.020（剪掉的四个都在 0.1 以下），剪 75% 时是 0.634。随机剪掉一半，期望的 error 是 $\sqrt{0.5}=0.707$。在一个 $1024\times1024$、entry 服从 standard normal 的 matrix 上实际算：magnitude pruning 剪 50%，error 0.267；随机剪 50%，0.706；乘上一个随机 input vector 之后的 output error 分别是 0.269 和 0.699。Magnitude 这个 criterion 把 error 压到随机的三分之一多一点。

### 剪完要 fine-tune，而且要反复做

0.27 的 error 仍然很大，直接拿去用，accuracy 会掉很多。Han 2015 的做法分三步：先正常 train，按 threshold 剪掉小的 weight，再用剩下的 weight 继续 train（fine-tune）。论文说第三步是关键，没有它 accuracy 会大幅下降。

一次剪很多不如分几轮，每轮剪一点、fine-tune 一次。在 AlexNet 上，这样把能剪的比例从 5 倍提高到 9 倍。最终结果：

| 模型 | parameter 数 | 压缩倍数 | top-1 error |
|---|---|---|---|
| AlexNet | 61M → 6.7M | 9× | 42.78% → 42.77% |
| VGG-16 | 138M → 10.3M | 13× | 31.50% → 31.34% |

### 每层剪多少：sensitivity scan

各个 layer 能承受的 sparsity 不同。课上和 lab 用的办法是逐层扫一遍：每次只剪一个 layer，sparsity 取 0.4 到 0.9，看 accuracy 掉多少，其余 layer 保持原样。下面是 2024 版 Pruning lab（VGG，CIFAR-10，dense accuracy 92.95%）镜像里的实际结果。

::fig[m6940-sensitivity] 逐层 sensitivity scan。第一层（最下面那条）剪到 0.9 时 accuracy 掉到 31.81%，最后一层几乎不受影响。数据来自 2024 版 lab 的社区镜像。

根据这张图，镜像里给每层选的 sparsity 是：第一个 conv 不剪，接下来四个 0.5，再两个 0.8，最后一个 conv 0.9，classifier 不剪。Lab 的要求是 model size 不超过 dense 的 25%、accuracy 不低于 92.5%。剪完立刻测：size 是 dense 的 24.50%，accuracy 87.00%；fine-tune 5 个 epoch 后最好是 92.80%。

Sensitivity scan 有一个局限：它一次只动一个 layer，不考虑 layer 之间的相互影响，选出来的组合不一定最优。课上接着讲了自动选 sparsity 的办法（AMC 用 reinforcement learning，NetAdapt 每轮只剪一个 layer 并用 latency lookup table 控制目标），思路都是把“每层剪多少”交给一个以 latency 或 FLOPs 为约束的搜索。

### 剪掉的 0 怎么排：granularity

剪掉哪些位置，自由度从大到小排：

- **Fine-grained（unstructured）**：任意位置都可以剪，同样 sparsity 下 accuracy 最好。
- **Pattern-based（N:M）**：每连续 $M$ 个 weight 里剪掉 $N$ 个，最常见的是 2:4，即 50%。
- **Channel**：整个 output channel 一起剪掉。

::fig[m6940-granularity] 同样是一个 $8\times8$ 的 weight matrix，三种 granularity 剪掉的位置。越往右越规整，hardware 越容易利用，可选的剪法越少。

### 为什么 unstructured sparsity 很少在 GPU 上变快

剪掉一半 weight，看起来 model 就小了一半、算得快了一倍。分开看 storage 和 compute 两本账。

**Storage。** Sparse matrix 要记住每个 nonzero 在哪里。常用的 CSR 格式存三个 array：nonzero 的 value、每个 value 的 column index、每个 row 从第几个 nonzero 开始（row pointer）。对一个 $4096\times4096$ 的 fp16 matrix，dense 存储是 $4096^2\times2=33.55$ MB。Value 占 2 byte；column index 用 int32 占 4 byte，用 int16 占 2 byte。

| sparsity | CSR（int32 index） | CSR（int16 index） |
|---|---|---|
| 50% | 50.35 MB（dense 的 1.50 倍） | 33.57 MB（1.00 倍） |
| 70% | 30.22 MB（0.90 倍） | 20.15 MB（0.60 倍） |
| 90% | 10.08 MB（0.30 倍） | 6.73 MB（0.20 倍） |

每个 nonzero 的代价从 2 byte 变成了 $2+b$ byte（$b$ 是 index 的 byte 数），要省 memory 就要 $(1-s)(2+b)<2$，即

$$s>1-\frac{2}{2+b}$$

int32 index 要 sparsity 超过 66.7% 才开始省，int16 要超过 50%。Han 2015 为了压低这个代价改存相邻 nonzero 之间的相对距离，FC layer 的 index 只用 5 bit，conv layer 用 8 bit，整体额外开销 15.6%。

**Compute。** GPU 上的 dense GEMM 用 Tensor Core 按固定大小的 tile 计算，每个 tile 的数据在 memory 里连续，每个 thread 的工作量相同。Sparse 的乘法要先读 column index，再按 index 去 input vector 里取对应的数，这是不连续的 memory access；各个 row 的 nonzero 个数不同，分给不同 warp 的工作量不均。课上引用的测量是：在 V100 上，sparse kernel 要到 sparsity 超过 71% 才比 dense GEMM 快。

两本账合起来：50% 的 unstructured sparsity 在普通 GPU 上既不省 memory，也不省时间。它的用处在于和后面的 quantization 叠加着压 storage，或者配合专门为 sparsity 设计的 hardware。

:::wrong 剪掉 50% 的 weight，model 就小一半、快一倍
按上面的表，$4096\times4096$ 的 fp16 matrix 剪掉 50% 后用 int32 index 的 CSR 存，是 50.35 MB，比 dense 的 33.55 MB 还大 50%。Decode 是 memory-bound 的（第 1 站），bytes 没少，latency 就不会少；再加上不规则访问，通常还更慢。Lab 1 的问题 Q9 要求对比 fine-grained 和 channel pruning 的取舍，镜像里给出的回答也是：在手机这类没有专门 sparse 支持的 hardware 上选 channel pruning。
:::

### 规整的 sparsity：2:4 和 channel pruning

**2:4 sparsity。** 每 4 个 weight 里只留 2 个。存的时候留下 2 个 value，再用 2 个 2-bit 的 index 记它们在 4 个位置里的哪两个。fp16 下每 4 个 weight 占

$$2\times16+2\times2=36\ \text{bit},\qquad\frac{36}{4\times16}=56.25\%$$

int8 时是 $(2\times8+2\times2)/32=62.5\%$。位置的种类固定（4 选 2 只有 6 种），hardware 可以用 index 直接从 input 里选出对应的那一半做 dense 计算，GEMM 的长度从 $K$ 变成 $K/2$。NVIDIA 从 Ampere 开始支持，课上给的测量是 A100 上 int8 GEMM 接近 2 倍。NVIDIA 给 Jetson AGX Orin 64GB 标的算力是 275 sparse TOPS、138 dense TOPS，比值 1.99，指的就是这种 2:4。

**Channel pruning。** 剪掉 conv layer $\ell$ 的一部分 output channel，就是让这个 layer 的 weight tensor 变“瘦”，结果仍然是一个普通的 dense layer，任何 hardware 都能直接受益。代价是要同时改三处：layer $\ell$ 的 weight（第 0 维）、它后面 BatchNorm 的四个 tensor（weight、bias、running mean、running var），以及 layer $\ell+1$ 的 weight（第 1 维，即 input channel）。

::fig[m6940-chprune] 每层剪掉 30% output channel 时要同时改的三处。

MACs 降多少？Layer $\ell+1$ 的 MACs 是 $c_o\,c_i\,k^2\,h\,w$。每个 layer 都剪掉 30% 的 output channel 时，$c_i$ 和 $c_o$ 都乘 0.7：

$$0.7\times0.7=0.49,\qquad\frac{1}{0.49}=2.04$$

Lab 镜像的实测：MACs 606M → 305M（1.99 倍），parameter 9.23M → 5.01M（1.84 倍），CPU latency 24.2 ms → 13.0 ms（1.86 倍）。MACs 没有到 2.04 倍，原因之一是第一个 conv 的 input 是图像的 3 个 channel，不能剪，它的 MACs 只乘了 0.7。Latency 又比 MACs 少一点，是因为 latency 里还有不随 channel 数等比例缩小的部分（memory access、kernel 启动）。

只剪不挑，accuracy 掉得很厉害：镜像里按顺序留下前 70% 的 channel，accuracy 从 92.95% 掉到 28.14%。改成先按 importance 排序再留前 70%：importance 用 layer $\ell+1$ 里对应 input channel 那一片 weight 的 Frobenius norm，accuracy 变成 36.81%，fine-tune 5 个 epoch 后回到 92.18%。

:::edge 排序本身不改变模型
把 layer $\ell$ 的 output channel、它的 BatchNorm、layer $\ell+1$ 的 input channel 按同一个 permutation 重排，计算结果和原来完全一样（镜像里排序后 dense accuracy 仍是 92.95%）。三处用的 permutation 不一致，模型就坏了，这是 lab 里最常见的 bug。
:::

:::from
Optimization 的写法、magnitude criterion、granularity 的分类、2:4 的存储方式、V100 上 71% 的测量，按 [erectbranch 的 Lecture 3 笔记](https://erectbranch.github.io/MIT-Efficient-AI/notes/2022/lec03/)和 [Lecture 4 笔记](https://erectbranch.github.io/MIT-Efficient-AI/notes/2022/lec04/summary03)；AMC、NetAdapt 按[另一篇 Lecture 4 笔记](https://erectbranch.github.io/MIT-Efficient-AI/notes/2022/lec04/summary01)，只读了笔记，没有展开。三步法、iterative pruning、AlexNet 和 VGG-16 的数字、相对 index 的 5 bit 与 8 bit 出自 [Han et al. 2015](https://ar5iv.labs.arxiv.org/html/1506.02626)。Sensitivity scan 的数据、选定的 sparsity、channel pruning 的所有数字出自 [2024 版 Pruning lab 的社区镜像](https://tinyml-kor.github.io/blog/posts/labs/lab01.html)。Orin 的 sparse/dense TOPS 出自 [NVIDIA 技术博客](https://developer.nvidia.com/blog/delivering-server-class-performance-at-the-edge-with-nvidia-jetson-orin)。$4\times4$ matrix 上的 pruning、Gaussian matrix 的对比、CSR 的 storage 表和 break-even 公式是为这一页算的。
:::

## [quant] Quantization：从 k-means 到 integer-only inference

:::skip
快速路线必读（Lecture 5–6，Quantization lab 和第 4 站都建立在它上面）。能对一个 matrix 算出 scale 和 zero point，推出 quantized matrix multiplication 里哪些项能 offline 算好、为什么 accumulator 要用 int32，并说出 per-channel 比 per-tensor 好在哪里，就可以去第 4 站。
:::

### 两种减少 bit 的办法

还是上一站的 $W$，这次不剪，而是让每个数用更少的 bit 存。fp32 存 16 个数要 $16\times32=512$ bit，即 64 byte。

**第一种：k-means quantization。** 只允许 $W$ 里出现 4 个不同的值，每个 entry 存一个 2-bit 的 index，另存一张 4 个 fp32 值的表（codebook）。4 个值怎么选？让每个 weight 到它所用的值的距离的 sum of squares 最小，这正是 k-means clustering。

从 min 到 max 等距地取初值 $(-1.08,\ -0.013,\ 1.053,\ 2.12)$，每个 weight 归到最近的值，再把每个值换成归到它的 weight 的 mean：

| cluster | 归进来的 weight | mean |
|---|---|---|
| 0 | $-0.98,\ -1.08,\ -0.91,\ -1.03$ | $-1.00$ |
| 1 | $0.09,\ 0.05,\ -0.14,\ 0,\ 0$ | $0.00$ |
| 2 | $1.48,\ 1.53,\ 1.49$ | $1.50$ |
| 3 | $2.09,\ 2.12,\ 1.92,\ 1.87$ | $2.00$ |

再归一次，分组不变，k-means 就停了。Codebook 是 $(-1,\ 0,\ 1.5,\ 2)$，存储变成 2-bit 的 index $16\times2=32$ bit（4 byte）加上 codebook $4\times32=128$ bit（16 byte），共 20 byte，压缩 3.2 倍。Deep Compression 把这个写成一般的 formula：$n$ 个 weight、每个原来 $b$ bit、codebook 有 $k$ 个值，

$$r=\frac{nb}{n\log_2k+kb}=\frac{16\times32}{16\times2+4\times32}=3.2$$

$n$ 很大时 codebook 可以忽略，压缩倍数趋于 $b/\log_2k$，2-bit 时是 16。Reconstruction error 是 $\|W-\hat W\|_F/\|W\|_F=0.059$，最大的单个 error 是 0.14（$-0.14$ 被当成 0）。

::fig[m6940-kmeans] 同样 4 个值：k-means 让它们落在 weight 聚集的地方，linear 只能等距（下一小节）。

Codebook 还能 fine-tune。$w_i=c_{\ell(i)}$，$\ell(i)$ 是 $w_i$ 所在的 cluster，由 chain rule

$$\frac{\partial L}{\partial c_k}=\sum_{i:\ \ell(i)=k}\frac{\partial L}{\partial w_i}$$

把属于同一个 cluster 的 gradient 加起来去更新那个 centroid。Lab 镜像里 4-bit k-means 不 fine-tune 时 accuracy 只有 79.07%，fine-tune 一个 epoch 回到 92.47%；2-bit 掉到 10.00%（CIFAR-10 上等于随机猜），fine-tune 5 个 epoch 回到 91.17%。Deep Compression 把 pruning、k-means quantization（conv 8 bit、FC 5 bit）和 Huffman coding 叠在一起，AlexNet 从 240 MB 压到 6.9 MB（35 倍），VGG-16 从 552 MB 压到 11.3 MB（49 倍），accuracy 没有损失。

它的局限在 compute：计算时要先查表把 index 换回 fp32，乘法仍是 floating-point 的。省了 storage 和搬运，没省 operation 本身。

### Linear quantization：$r=S(q-Z)$

要让乘法本身变成 integer 的，就得让 integer 和 real number 之间是一个简单的 affine 关系：

$$r=S\,(q-Z)$$

$r$ 是 real number，$q$ 是 $N$-bit integer，$S$（scale）是一个正的 real number，$Z$（zero point）是一个 integer。Signed $N$-bit 的范围是 $q_\text{min}=-2^{N-1}$ 到 $q_\text{max}=2^{N-1}-1$。

$S$ 和 $Z$ 由两个条件定：$r_\text{max}$ 对应 $q_\text{max}$，$r_\text{min}$ 对应 $q_\text{min}$。

$$r_\text{max}=S(q_\text{max}-Z),\qquad r_\text{min}=S(q_\text{min}-Z)$$

两式相减，$Z$ 消掉：

$$S=\frac{r_\text{max}-r_\text{min}}{q_\text{max}-q_\text{min}}$$

代回第二式：$Z=q_\text{min}-r_\text{min}/S$，再 round 成 integer。为什么 $Z$ 必须是 integer？Real number 0 要能被精确表示：padding 的 0、ReLU 输出的 0 都非常多，$r=0$ 对应 $q=Z$，只有 $Z$ 是 integer 时这个对应才没有 error。

用 $W$ 做 2-bit 的例子，$q\in\{-2,-1,0,1\}$，$r_\text{max}=2.12$，$r_\text{min}=-1.08$：

$$S=\frac{2.12-(-1.08)}{1-(-2)}=\frac{3.2}{3}=1.0667,\qquad Z=\mathrm{round}\Big(-2-\frac{-1.08}{1.0667}\Big)=\mathrm{round}(-0.9875)=-1$$

Quantize 的规则是 $q=\mathrm{clamp}\big(\mathrm{round}(r/S)+Z,\ q_\text{min},\ q_\text{max}\big)$。先算 $r/S$，再 round、加 $Z$：

$$\frac{W}{S}=\begin{pmatrix}1.96&-0.92&1.39&0.08\\0.05&-0.13&-1.01&1.99\\-0.85&1.80&0&-0.97\\1.75&0&1.43&1.40\end{pmatrix}\ \longrightarrow\ q=\begin{pmatrix}1&-2&0&-1\\-1&-1&-2&1\\-2&1&-1&-2\\1&-1&0&0\end{pmatrix}$$

Dequantize 回来，$\hat r=S(q-Z)$ 只能取 $-1.0667,\ 0,\ 1.0667,\ 2.1333$ 四个值：

$$\hat W=\begin{pmatrix}2.13&-1.07&1.07&0\\0&0&-1.07&2.13\\-1.07&2.13&0&-1.07\\2.13&0&1.07&1.07\end{pmatrix}$$

最大的 error 是 1.48 被变成 1.07，差 0.46，在 $S/2=0.53$ 之内。整体 error 0.167，是 k-means 的 2.8 倍：同样 4 个值，k-means 可以把它们放在 weight 密集的地方，linear quantization 只能等距。换来的是 integer arithmetic。

::fig[m6940-linquant] 2-bit linear quantization 把 $[-1.08,\ 2.12]$ 等分成 4 个格点。Real number 0 恰好落在 $q=Z=-1$ 上。

Bit 数每加 1，$S$ 大约减半，error 也大约减半：

| bit | $S$ | $Z$ | $\|W-\hat W\|_F/\|W\|_F$ |
|---|---|---|---|
| 2 | 1.0667 | $-1$ | 0.167 |
| 3 | 0.4571 | $-2$ | 0.087 |
| 4 | 0.2133 | $-3$ | 0.036 |
| 8 | 0.01255 | $-42$ | 0.0019 |

### Error 有两种来源：rounding 和 clipping

上面用 $r_\text{max}$、$r_\text{min}$ 定 range，range 内的数只受 rounding error（最多 $S/2$），range 外没有数。实际的 activation 常常有少数离得很远的值，如果为了照顾它们把 range 放大，$S$ 跟着变大，所有数的 rounding error 都变大；如果把 range 收窄，range 外的数被 clamp 到边界，产生 clipping error。

在一个 Laplace 分布（scale $b=1$，variance 2）上算 4-bit symmetric quantization 的 mean squared error，clip 的位置 $\alpha$ 从小到大扫一遍：

::fig[m6940-clip] 4-bit 量化一个 Laplace 分布时，total MSE 随 clipping range $\alpha$ 的变化。左边 clipping error 主导，右边 rounding error 主导。

最小值在 $\alpha\approx4.8$，MSE 0.055。如果从 4096 个 sample 里取最大的 absolute value 当 range（这次是 7.9），MSE 是 0.102，差不多翻倍。课上给了三种选 range 的办法：对 min/max 做 exponential moving average、直接最小化 MSE（就是上图）、最小化原分布与量化后分布的 KL divergence。都要用一小批真实数据跑一遍（calibration）。

### Per-tensor 还是 per-channel

到这里一个 tensor 只用一个 $S$。如果不同 output channel 的 weight 范围差别很大，一个 $S$ 就照顾不过来。把 $W$ 的第 2 个 row（一个 output channel）整体乘 0.01，模拟一个 range 很小的 channel，用 symmetric quantization（$Z=0$，$S=\max|w|/q_\text{max}$）：

| | 8-bit per-tensor | 8-bit per-channel | 4-bit per-tensor | 4-bit per-channel |
|---|---|---|---|---|
| row 2 的 relative error | 0.316 | 0.0034 | 1.000 | 0.083 |
| 其余 row 的 relative error | 0.003–0.004 | 0.001–0.004 | 0.031–0.079 | 0.045–0.047 |

Per-tensor 时 $S=2.09/127=0.0165$，row 2 的四个数（最大 0.0212）几乎都被 round 成 0 或 $\pm1$；4-bit 时全部变成 0，这个 channel 整个消失了。Per-channel 给每个 output channel 一个自己的 $S_j$，row 2 的 $S$ 是 0.000167，问题就没了。

Per-output-channel 的 scale 不增加计算的麻烦：$y_j=\sum_iw_{ji}x_i$，若 $w_{ji}=S_j\,q_{ji}$，则

$$y_j=S_j\sum_iq_{ji}x_i$$

$S_j$ 在 sum 外面，integer 的 sum 算完再乘一次就行。如果 scale 随 sum 里的 index $i$（input channel）变，就提不出来了，这是第 4 站的问题。再细一层是 group quantization：每 $g$ 个连续的 weight（常取 128）共用一个 scale，第 4 站的 AWQ 用的就是它。

### Integer-only 的 matrix multiplication

现在把 $Y=WX$ 里的三个量都写成 $S(q-Z)$ 的形式：

$$S_Y(q_Y-Z_Y)=S_W(q_W-Z_W)\cdot S_X(q_X-Z_X)$$

解出 $q_Y$：

$$q_Y=\frac{S_WS_X}{S_Y}\Big(q_Wq_X-Z_Wq_X-Z_Xq_W+Z_WZ_X\Big)+Z_Y$$

括号里四项，看哪些在 inference 前就知道：$Z_Xq_W$ 和 $Z_WZ_X$ 只依赖 weight 和常数，可以 offline 算好；$Z_Wq_X$ 依赖 input，要在线算。所以 weight 一般取 symmetric，$Z_W=0$，这一项和最后一项都消失：

$$q_Y=\underbrace{\frac{S_WS_X}{S_Y}}_{M}\Big(q_Wq_X-Z_X\,q_W\mathbf{1}\Big)+Z_Y$$

$q_W\mathbf{1}$ 是 $q_W$ 每个 row 的和，offline 算好。Bias 也照此处理：令 $S_b=S_WS_X$、$Z_b=0$，把 $-Z_Xq_W\mathbf{1}$ 直接折进 int32 的 bias 里。剩下的 $M$ 是一个 0 到 1 之间的 real number，写成 $M=2^{-n}M_0$，$M_0\in[0.5,1)$ 存成 fixed-point integer，乘 $M$ 就变成一次 integer 乘法加一次 bit shift。整条路上没有 floating-point operation。

走一遍。$W$ 用 8-bit symmetric：$S_W=2.12/127=0.016693$，

$$q_W=\begin{pmatrix}125&-59&89&5\\3&-8&-65&127\\-55&115&0&-62\\112&0&92&89\end{pmatrix},\qquad q_W\mathbf{1}=\begin{pmatrix}160\\57\\-2\\293\end{pmatrix}$$

Input $x=(0.3,\ 1.2,\ -0.4,\ 0.8)$ 用 8-bit asymmetric：$S_X=1.6/255=0.0062745$，$Z_X=\mathrm{round}(-128+0.4/0.0062745)=\mathrm{round}(-64.25)=-64$，$q_X=(-16,\ 127,\ -128,\ 64)$。

Integer 部分：

$$q_Wq_X=\begin{pmatrix}-20565\\15384\\11517\\-7872\end{pmatrix},\qquad Z_X\,q_W\mathbf{1}=-64\times\begin{pmatrix}160\\57\\-2\\293\end{pmatrix}=\begin{pmatrix}-10240\\-3648\\128\\-18752\end{pmatrix}$$

相减得 accumulator $(-10325,\ 19032,\ 11389,\ 10880)$。乘上 $S_WS_X$ 得 $(-1.081,\ 1.993,\ 1.193,\ 1.140)$，floating-point 的 exact answer 是 $(-1.069,\ 1.975,\ 1.207,\ 1.141)$。

Output 也要回到 int8。$Y$ 的 range 是 $[-1.069,\ 1.975]$，$S_Y=0.011937$，$Z_Y=-38$，

$$M=\frac{S_WS_X}{S_Y}=0.0087742=2^{-6}\times0.56155$$

$q_Y=\mathrm{clamp}(\mathrm{round}(M\times\text{acc})+Z_Y)=(-128,\ 127,\ 62,\ 57)$，dequantize 后是 $(-1.074,\ 1.970,\ 1.194,\ 1.134)$。

::fig[m6940-intmm] 上面这次计算的数据流和每一步的位宽。

:::wrong int8 的模型里所有数都是 8-bit 的
上面的 accumulator 里出现了 $-20565$、$19032$，int8 存不下，int16 也只是勉强。一般地，$K$ 个 int8 乘积相加，最大可以到 $K\times128\times128$；$K=4096$ 时是 $6.7\times10^7$，要 int32。Bias 存 int32，$M_0$ 是 32-bit 的 fixed-point 数。“int8”说的是 weight 和 activation 在 memory 里的格式，计算中间值都更宽。Lab 里先 cast 成 int8 再加 zero point 会溢出，就是这个原因。
:::

### QAT：让 training 看见 quantization

PTQ（post-training quantization）在模型 train 好之后直接量化，快，不需要 training data 以外的东西，但 bit 少时 accuracy 掉得难以控制。QAT（quantization-aware training）在 training 的 forward 里就模拟 quantization：

$$W\ \to\ Q(W)=S_W\big(\mathrm{round}(W/S_W)-Z_W\big)$$

Forward 用 $Q(W)$，同时保留一份 full-precision 的 $W$ 用来接收 update，因为单次 update 往往比 $S$ 小，直接改量化后的值会被 round 掉。

问题在 backward：round 是阶梯 function，derivative 几乎处处为 0，

$$\frac{\partial L}{\partial W}=\frac{\partial L}{\partial Q(W)}\cdot\frac{\partial Q(W)}{\partial W}=0$$

Gradient 传不回去。Straight-through estimator（STE）的做法是把 $\partial Q(W)/\partial W$ 当成 1：

$$\frac{\partial L}{\partial W}\approx\frac{\partial L}{\partial Q(W)}$$

意思是：按“如果 weight 往这个方向挪，量化后的值也大致往这个方向挪”来更新。训练的结果是 weight 自己学会落在格点附近。上面 k-means 那部分的 centroid fine-tune，就是 QAT 在 k-means quantization 上的版本。

### 1 bit 和 2 bit

:::skip
这一小节是 bit 数推到极限时的情形，部署时很少用。跳过它会少掉 binary、ternary quantization 的做法，不影响后面各站。
:::

Weight 只取 $\pm1$（binary）时，乘法变成加减；weight 和 activation 都取 $\pm1$ 时，dot product 变成 XNOR 加 popcount。Ternary 允许 $\{-1,0,+1\}$ 再乘一个 scale。课上的 TWN 规则：threshold $\Delta=0.7\times\mathrm{mean}|w|$，超过它的取 $\pm r_t$，$r_t$ 是这些 weight 的 absolute value 的 mean。用 $W$ 算：$\mathrm{mean}|w|=1.049$，$\Delta=0.734$，超过的有 11 个，它们的 absolute value 的 mean 恰好是 1.50，

$$\hat W=\begin{pmatrix}1.5&-1.5&1.5&0\\0&0&-1.5&1.5\\-1.5&1.5&0&-1.5\\1.5&0&1.5&1.5\end{pmatrix},\qquad\frac{\|W-\hat W\|_F}{\|W\|_F}=0.279$$

ResNet-18 在 ImageNet 上的 top-1：full precision 69.6%，binary（BWN）60.8%，ternary（TWN）65.3%，scale 可学的 TTQ 66.7%。

:::back
Quantization 省下的是第 1 站那两本账里的 bytes（model size、memory traffic）和 operation 的位宽。Per-input-channel 的 scale 提不到 sum 外面这件事，是[第 4 站](#llmq)的出发点。
:::

:::from
数据类型、k-means 与 linear quantization、$S$ 和 $Z$ 的推导、2-bit 的例子（同一个 $4\times4$ matrix，$S=1.07$、$Z=-1$）、quantized matrix multiplication 的推导、$M=2^{-n}M_0$、bias 的处理、rounding 与 clipping 的取舍，按 [erectbranch 的 Lecture 5 笔记](https://erectbranch.github.io/MIT-Efficient-AI/notes/2022/lec05/summary01/)；per-channel、calibration 的三种办法按 [Lecture 6 笔记](https://erectbranch.github.io/MIT-Efficient-AI/notes/2022/lec06/summary01)；QAT、STE、binary 和 ternary（含 TWN 的 0.73 与 1.5、ResNet-18 的表）按[另一篇 Lecture 6 笔记](https://erectbranch.github.io/MIT-Efficient-AI/notes/2022/lec06/summary02)。Compression rate formula、3.2、35 倍与 49 倍出自 [Deep Compression](https://ar5iv.labs.arxiv.org/html/1510.00149)。Lab 的 k-means 数字出自 [Quantization lab 镜像](https://tinyml-kor.github.io/blog/posts/labs/lab02.html)。k-means 的迭代过程、各 bit 数的 error 表、Laplace 的 clipping 曲线、per-channel 的例子和 integer matmul 的完整数值是为这一页算的。
:::

## [llmq] LLM 的 quantization：outlier、SmoothQuant 与 AWQ

:::skip
快速路线必读（Lecture 13，Lab 5 跑的就是 AWQ 的 int4 模型）。能说出 activation 里的 outlier channel 为什么让 per-tensor int8 失效、SmoothQuant 把难度挪到了哪里、AWQ 为什么只量化 weight，并按 decode 的 bytes 判断 W4A16 与 W8A8 谁快，就可以去第 5 站。
:::

### W8A8 在 6.7B 之后坏掉了

上一站的方法用在 CNN 和小的 Transformer 上没问题。SmoothQuant 论文观察到，模型超过 6.7B 之后，W8A8（weight 和 activation 都 int8）的 accuracy 大幅下降。OPT-175B 上，FP16 在一组任务上的平均 accuracy 是 66.9%，naive W8A8 只有 35.5%。

原因在 activation：少数几个 channel 的值比其余 channel 大约 100 倍，而且总是固定的那几个 channel，每个 token 都如此。Weight 的分布则平坦得多。

用一个小例子看它怎么坏。3 个 token、4 个 channel 的 activation，第 3 个 channel 是 outlier；weight 是 $4\times2$：

$$X=\begin{pmatrix}0.8&-1.2&95&0.5\\-0.6&0.9&-110&1.1\\1.0&-0.7&102&-0.9\end{pmatrix},\qquad W=\begin{pmatrix}0.40&-0.30\\0.25&0.50\\-0.02&0.01\\0.35&-0.45\end{pmatrix}$$

$X$ 做 per-tensor 的 int8 symmetric quantization：$S_X=110/127=0.866$。其余三个 channel 的数都在 1.2 以内，除以 0.866 之后只能 round 成 $\pm1$ 或 0：0.5 和 1.1 都变成 0.866，$-1.2$ 也变成 $-0.866$。这三个 channel 的信息基本只剩下 sign。算出来的 $Y=XW$ 和 exact 相比，relative error 是 10.4%。8 bit 本来应该给出千分之几的 error。

### 为什么不能给 activation 每个 channel 一个 scale

最直接的想法是像 weight 一样 per-channel。看 $Y=XW$ 的一个 entry：

$$Y_{tj}=\sum_iX_{ti}W_{ij}$$

$t$ 是 token，$i$ 是 input channel，$j$ 是 output channel。如果 activation 每个 token 一个 scale $a_t$、weight 每个 output channel 一个 scale $b_j$，

$$Y_{tj}=\sum_ia_t\,q_{ti}\,b_j\,q'_{ij}=a_t\,b_j\sum_iq_{ti}\,q'_{ij}$$

两个 scale 都在 sum 外面，integer GEMM 算完再乘一次。但 outlier 是沿 $i$ 这个维度分布的，要按 input channel 给 scale $c_i$：

$$Y_{tj}=\sum_ic_i\,q_{ti}\,q'_{ij}$$

$c_i$ 留在 sum 里，每一项乘的数都不一样，这就不再是一个 integer GEMM 了。Tensor Core 一类的 hardware 只做一长串同样的 integer multiply-accumulate，中间插不进别的 operation。

::fig[m6940-scaleaxes] 三种 scale 各沿哪个维度。

### SmoothQuant：把难度挪到 weight 上

既然 activation 的某个 input channel 太大，那就在 quantize 之前把它除掉一个数，再在 weight 对应的 row 上乘回去：

$$Y=XW=\big(X\,\mathrm{diag}(s)^{-1}\big)\big(\mathrm{diag}(s)\,W\big)$$

数学上完全相等。$\hat X=X\,\mathrm{diag}(s)^{-1}$ 的第 $j$ 个 channel 除以 $s_j$，$\hat W=\mathrm{diag}(s)W$ 的第 $j$ 个 row 乘 $s_j$。$s_j$ 怎么取？论文的选法是

$$s_j=\frac{\max|X_j|^{\alpha}}{\max|W_j|^{1-\alpha}}$$

$\alpha$ 叫 migration strength。看 $\alpha=0.5$ 时两边各剩下多少：

$$\max|\hat X_j|=\frac{\max|X_j|}{s_j}=\sqrt{\max|X_j|\cdot\max|W_j|},\qquad\max|\hat W_j|=s_j\max|W_j|=\sqrt{\max|X_j|\cdot\max|W_j|}$$

两者相等：每个 channel 的“难度”被平分给 activation 和 weight。

对上面的例子，四个 channel 的 $\max|X_j|$ 是 $(1.0,\ 1.2,\ 110,\ 1.1)$，$\max|W_j|$ 是 $(0.40,\ 0.50,\ 0.02,\ 0.45)$，所以

$$s=(1.581,\ 1.549,\ 74.16,\ 1.563)$$

Smoothing 之后每个 channel 的 $\max|\hat X_j|$ 和 $\max|\hat W_j|$ 都是 $(0.632,\ 0.775,\ 1.483,\ 0.704)$，最大和最小只差 2.3 倍。再做同样的 per-tensor int8 quantization，$Y$ 的 relative error 从 10.4% 降到 0.59%。

::fig[m6940-smooth] 例子里四个 input channel 的 $\max|X_j|$ 与 $\max|W_j|$，smoothing 前后（log scale）。Smoothing 后两边每个 channel 的最大值相等。

$\mathrm{diag}(s)^{-1}$ 可以 offline 折进前一个 LayerNorm 的参数，$\mathrm{diag}(s)$ 折进 $W$，inference 时没有任何额外的 operation。论文建议多数模型取 $\alpha=0.5$；$\alpha$ 在 0.4 到 0.6 之间效果最好，小于 0.4 时 activation 仍然难量化，大于 0.6 时轮到 weight 难量化。结果：OPT-175B 的平均 accuracy 66.8%，FP16 是 66.9%；最多 1.56 倍 speedup，memory 约减半。

### W4A16：decode 只关心 bytes

SmoothQuant 让 int8 的 GEMM 能用，省的是 compute 和一半的 bytes。但第 1 站算过，batch size 为 1 的 decode 是 memory-bound 的，那里算力本来就闲着。对它来说更有效的是把 weight 压得更短，activation 保持 fp16：W4A16。计算时把 4-bit 的 weight 在片上解回 fp16 再乘，多出的这点计算在 memory-bound 的情况下是免费的。

课上的比较：在小 batch 下，W4A16 的 compute intensity 比 W8A8 高；AWQ 论文的 roofline 估计是，fp16 的 decode 约 1 FLOP/byte，weight 换成 4 bit 后约 4 FLOP/byte。

:::wrong W8A8 的 activation 也是 8-bit，所以比 W4A16 快
看 decode 一个 token 搬多少 byte。Llama-2-7B 的 weight 在 W8A8 下是 6.74 GB；在 W4A16 下，linear layer 按 group size 128 存 4-bit weight 加一个 fp16 scale（每个 weight 平均 4.125 bit），embedding 留 fp16，合计 3.86 GB。Activation 每层只有几千个数，可以忽略。在 204.8 GB/s 的 Jetson AGX Orin 上，两者的下界是 32.9 ms 和 18.9 ms，W4A16 快 1.7 倍。W8A8 的优势在 batch 大、compute-bound 的服务端；课上也是这样定位的：SmoothQuant 适合大 batch 的 serving，不适合单个 query 的 on-device 场景。
:::

### AWQ：哪些 weight 不能随便量化

Weight 量化到 3 bit（INT3，group size 128，round-to-nearest），OPT-6.7B 在 WikiText-2 上的 perplexity 从 FP16 的 10.86 涨到 23.54。AWQ 论文做了一个实验：挑 1% 的 input channel，让它们的 weight 保持 FP16，其余照样量化。挑法不同，结果差别很大：

| 怎么挑那 1% | perplexity |
|---|---|
| 不挑（全部 INT3） | 23.54 |
| activation 最大的 channel | 11.39 |
| weight norm 最大的 channel | 22.37 |
| 随机 | 24.23 |

决定一个 weight 重不重要的是它乘的 activation，而不是它自己的大小。这和第 2 站 magnitude pruning 的假设（各个 input 大小差不多）正好相反：在 LLM 里，input 的大小差别很大。

但 mixed precision（1% FP16、99% INT3）在 hardware 上很难高效实现。AWQ 换了一个办法：不留 FP16，而是把 salient channel 的 weight 放大 $s$ 倍、对应的 activation 缩小 $s$ 倍，再一起量化。为什么这能减小 error？

设 quantizer 是 $Q(w)=\Delta\cdot\mathrm{Round}(w/\Delta)$，$\Delta=\max|w|/2^{N-1}$，$\max$ 在同一个 group 里取。原来一个 weight 乘 input 的 error 是

$$Q(w)\,x-wx=\Delta\cdot\varepsilon\cdot x,\qquad\varepsilon=\mathrm{Round}(w/\Delta)-w/\Delta$$

$\varepsilon$ 是 rounding error，在 $[-0.5,0.5]$ 里，平均 absolute value 约 0.25。放大之后：

$$Q(ws)\cdot\frac{x}{s}-wx=\Delta'\cdot\varepsilon'\cdot\frac{x}{s}$$

$\Delta'$ 是放大后 group 的新 $\Delta$。只放大一个 channel 时，group 里的最大值通常不在这个 channel 上，$\Delta'\approx\Delta$；$\varepsilon'$ 的平均大小仍约 0.25。所以 error 之比约为

$$\frac{\Delta'}{\Delta}\cdot\frac{1}{s}$$

$s>1$ 时 salient channel 的 error 变小。但 $s$ 太大时，这个 channel 的 weight 会变成 group 的最大值，$\Delta'$ 跟着变大，group 里其他 weight 的 error 全部变大。论文在 OPT-6.7B 上的实测：

| $s$ | $\Delta'\ne\Delta$ 的 group 比例 | 平均 $\Delta'/\Delta$ | perplexity |
|---|---|---|---|
| 1 | 0% | 1.000 | 23.54 |
| 1.25 | 2.8% | 1.005 | 12.87 |
| 1.5 | 4.4% | 1.013 | 12.48 |
| 2 | 8.2% | 1.038 | 11.92 |
| 4 | 21.2% | 1.213 | 12.36 |

为了亲眼看到这个取舍，我做了一个小模拟：512 个 output channel、128 个 input channel 的随机 weight，128 个 input channel 里有 2 个的 activation 是其余的 20 倍，3-bit、每个 output channel 的 128 个 weight 一组。只放大那 2 个 channel：

| $s$ | output relative error | salient weight 的平均 error | 其余 weight 的平均 error | $\Delta$ 变大的 group 比例 |
|---|---|---|---|---|
| 1 | 0.211 | 0.00361 | 0.00363 | 0% |
| 1.5 | 0.179 | 0.00267 | 0.00374 | 13% |
| 2 | 0.181 | 0.00244 | 0.00399 | 30% |
| 4 | 0.213 | 0.00213 | 0.00608 | 75% |
| 8 | 0.289 | 0.00210 | 0.01029 | 92% |

Salient weight 的 error 随 $s$ 一直下降，其余 weight 的 error 随 $s$ 上升，output error 在 1.5 到 2 之间最小，和论文的趋势一致。

实际的 $s$ 不是手挑的。AWQ 让每个 channel 的 $s$ 由它的平均 activation 大小 $s_X$ 决定：$s=s_X^{\alpha}$，在 $[0,1]$ 上对 $\alpha$ 做 grid search，目标是这一层量化后的 output 和原来的差最小。不需要 backpropagation，只需要一小批 calibration data。放大的 $1/s$ 同样可以折进前一个 operation。

结果：在 Hugging Face 的 FP16 实现之上，TinyChat 跑 AWQ 的 W4A16 模型平均快 3.2 到 3.3 倍，RTX 4090 上最多 3.9 倍，Jetson Orin 上 3.5 倍；Llama-2-70B 可以放进一块 64 GB 的 Jetson Orin。

:::edge W4A16 对 diffusion model 没有用
上面的论证全部建立在“decode 是 memory-bound”上。Diffusion model 在 batch size 为 1 时也是 compute-bound 的（[第 6 站](#gen)会算），weight 解回 fp16 之后照样要做 fp16 的乘法，W4A16 省下的 bytes 换不来时间。那里需要 weight 和 activation 都是 4 bit。
:::

:::from
“W8A8 在 6.7B 之后失效”、outlier 的观察、SmoothQuant 与 AWQ 的先后顺序和“SmoothQuant 适合 batch serving、W4A16 适合单 query”的定位，按 [erectbranch 的 2024 Lecture 13 笔记](https://erectbranch.github.io/MIT-Efficient-AI/notes/2024/lec13/summary01)。Per-channel activation scale 进不了 GEMM 的论证、smoothing formula、$\alpha$ 的取值和 OPT-175B 的结果出自 [SmoothQuant 论文](https://arxiv.org/html/2211.10438v7)。Salient channel 的表、error 推导、$s$ 的表、$\alpha$ 的 grid search、TinyChat 和 Jetson Orin 的数字出自 [AWQ 论文](https://arxiv.org/html/2306.00978v5)。$3\times4$ 的 smoothing 例子、AWQ 的模拟、W8A8 与 W4A16 在 Orin 上的 latency 下界是为这一页算的；Orin 的 204.8 GB/s 出自 NVIDIA 技术博客（开发者套件的数字）。
:::

## [nas] Neural architecture search 与 knowledge distillation

:::skip
快速路线里整站可以跳（brief 建议先跳 Lecture 7–8 和 NAS lab）。跳过的代价是：不知道 MACs 为什么不能代替 latency（这一条第 5、7 站都会用），不了解 Once-for-All 这类 hardware-aware NAS，以及 knowledge distillation 的 loss 是怎么来的。
:::

### MACs 不等于 latency

前三站是在一个给定的模型上减东西。另一条路是一开始就挑一个对目标 hardware 合适的结构。第一个问题是用什么衡量“合适”。课上给了一组数：MobileNetV2、NASNet-A、AmoebaNet-A 的 MACs 差不多，latency 分别约是 140 ms、180 ms、190 ms。MACs 预测不了 latency。

拿一个具体的层算清楚为什么。$56\times56$ 的 feature map，128 个 channel 进、128 个 channel 出，$3\times3$ kernel。

**Regular convolution：**

$$\text{MACs}=56\times56\times128\times128\times9=462{,}422{,}016,\qquad\text{weights}=147{,}456$$

**Depthwise-separable：**先用 depthwise conv（每个 channel 只和自己卷积），再用 $1\times1$ 的 pointwise conv 混合 channel。

$$\text{depthwise}=56\times56\times128\times9=3{,}612{,}672,\qquad\text{pointwise}=56\times56\times128\times128=51{,}380{,}224$$

合计 54,992,896，是 regular 的 $1/8.41$。一般地，比值是 $1\big/\big(\tfrac{1}{C}+\tfrac{1}{9}\big)$，$C=128$ 时正是 8.41。

现在看 bytes（int8，input 和 output 各 $56\times56\times128=401{,}408$ byte，加上 weight）：

| layer | MACs | bytes | MAC/byte |
|---|---|---|---|
| regular $3\times3$ | 462.4M | 950,272 | 487 |
| depthwise $3\times3$ | 3.6M | 803,968 | 4.5 |
| pointwise $1\times1$ | 51.4M | 819,200 | 62.7 |

Depthwise 只占 depthwise-separable 的 6.6% 的 MACs，搬的 bytes 却和 pointwise 一样多，arithmetic intensity 只有 4.5。在任何 roofline 拐点高于 4.5 的设备上，它的 latency 由 bytes 决定，和它那一点点 MACs 无关。这就是 MACs 和 latency 对不上的原因：MACs 只记了 compute 那一本账。

### Search space 有多大，怎样不逐个 train

Once-for-All（OFA）的 search space：网络分 5 个 unit，每个 unit 有 2、3 或 4 个 layer；每个 layer 的 kernel 取 3、5、7，expand ratio 取 3、4、6，共 9 种。一个 unit 的选法有

$$9^2+9^3+9^4=81+729+6561=7371$$

种，5 个 unit 独立，

$$7371^5\approx2.2\times10^{19}$$

和论文给的“约 $2\times10^{19}$ 个 sub-network”一致。逐个 train 不可能。办法是 weight sharing：train 一个最大的 supernet，所有 sub-network 都是它的一部分，直接继承它的 weight。OFA 的 progressive shrinking 按这个顺序放开：先 train 最大的网络（kernel 7、depth 4、expand 6），再允许 kernel 变小，再允许 depth 变浅，再允许 width 变窄；最大网络 train 好之后，用它做 teacher 给 sub-network 做 knowledge distillation（本站后半部分）。

要给一块新 hardware 挑结构时，不再 train 任何东西：用一个 latency lookup table（在那块 hardware 上把每种 layer 测一遍）预测 sub-network 的 latency，用一个小的 accuracy predictor（三层 MLP，在 16K 个 sub-network 上 train，test RMSE 0.21%）预测 accuracy，在两个 predictor 上做 evolutionary search。

成本对比（40 个部署场景）：

| 方法 | GPU hours |
|---|---|
| OFA（一次性 train 1,200 + predictor 40 + 每个场景 fine-tune 75） | 约 4.2k |
| ProxylessNAS | 约 20k |
| MnasNet | 约 1.6M |

OFA 在 595M MACs 下做到 ImageNet top-1 80.0%。论文还发现不同 hardware 挑出不同结构：FPGA 上搜出来的偏好 $3\times3$ kernel，CPU 上的用了更多大 kernel。这正是用 lookup table 而不用 MACs 的理由。

:::edge 为什么 latency lookup table 能把各层的 latency 相加
Lookup table 假设整个网络的 latency 约等于各层 latency 之和。层与层之间有 overlap、有 cache 的影响时这不完全成立。课上提到 HAT 改为直接测整个 sub-network 的 latency。部署前最终一定要在设备上实测。
:::

### Knowledge distillation：小模型向大模型学什么

小模型单独 train 往往不如大模型。Hinton 等在 MNIST 上的数字：一个大的、regularized 的网络（两个 hidden layer，各 1200 unit）有 67 个 test error；一个小网络（各 800 unit）单独 train 有 146 个；同一个小网络改用大网络的 soft target 来 train（$T=20$），只有 74 个。小网络的容量够，缺的是 training signal。

Hard label 只告诉小网络“这是 cat”。大网络的 output 还说了“它有点像 dog，完全不像 car”。这部分信息在普通 softmax 下几乎看不见，所以加一个 temperature $T$：

$$p_i=\frac{\exp(z_i/T)}{\sum_j\exp(z_j/T)}$$

课上的例子：logit 是 cat 5、dog 1。$T=1$ 时 $P(\text{cat})=0.982$，$T=10$ 时 $P(\text{cat})=e^{0.5}/(e^{0.5}+e^{0.1})=0.599$。用一个三类的例子看得更清楚，teacher 的 logit 是 cat 5、dog 3、car $-2$：

| $T$ | cat | dog | car |
|---|---|---|---|
| 1 | 0.880 | 0.119 | 0.0008 |
| 2 | 0.715 | 0.263 | 0.022 |
| 4 | 0.562 | 0.341 | 0.098 |
| 10 | 0.432 | 0.354 | 0.215 |

::fig[m6940-kd] 同一组 teacher logit 在不同 temperature 下的 soft target。$T$ 越大，dog 和 car 之间的差别越容易被 student 看到；$T$ 太大时连 car 也被抬得很高。

Loss 是两部分的加权：student 与 hard label 的 cross-entropy，加上 student 与 teacher 在同一个 $T$ 下的 soft distribution 之间的 cross-entropy。对后者求 student logit $z_i$ 的 gradient：

$$\frac{\partial}{\partial z_i}\Big(-\sum_kp_k\log q_k\Big)=\frac{1}{T}\big(q_i-p_i\big)$$

$q$ 是 student 在温度 $T$ 下的 softmax，$p$ 是 teacher 的。设 student 现在的 logit 是 $(2,\ 2,\ 1)$，$T=4$ 时 $q=(0.360,\ 0.360,\ 0.280)$，

$$\frac{1}{T}(q-p)=\frac14\big(0.360-0.562,\ 0.360-0.341,\ 0.280-0.098\big)=(-0.0505,\ 0.0048,\ 0.0457)$$

两件事。第一，方向：dog 那一项几乎为 0，car 那一项是正的（要把 car 压下去）。Hard label 的 gradient 是 $q-\text{onehot}=(-0.578,\ 0.422,\ 0.155)$（$T=1$），它把 dog 压得比 car 还狠。Soft target 告诉 student：dog 本来就该有一些 probability。第二，大小：soft target 的 gradient 带着 $1/T$，而 $q-p$ 本身也随 $T$ 变小，Hinton 的论文说明整体按 $1/T^2$ 缩小。所以 soft target 那一项的 loss 要乘 $T^2$，这样换 $T$ 时两项的相对权重不变。乘上 16 之后，上面的 gradient 是 $(-0.81,\ 0.08,\ 0.73)$，和 hard label 的量级相当。

$T$ 很大时（相对 logit 而言），这个 gradient 近似为 $\frac{1}{NT^2}(z_i-v_i)$（$N$ 是类别数，$v$ 是 teacher 的 logit，均已减去 mean），distillation 退化成直接让 student 的 logit 去拟合 teacher 的 logit。

:::wrong Temperature 越高，soft target 里的信息越多，越好
看上表 $T=10$ 那一行：car 被抬到 0.215，几乎和 dog 的 0.354 平起平坐，而 teacher 在 $T=1$ 时认为它只有 0.0008。Temperature 太高时，那些非常负的 logit（teacher 确信“不是”的类别）也被放大成要拟合的目标，它们多半是噪声。Hinton 的语音实验试了 1、2、5、10，$T=2$ 最好；课上也提到 teacher 和 student 大小差得越多，越适合用小一点的 $T$。
:::

课上还讲了 match 中间层 feature、attention map 的做法，以及不需要预先 train 好 teacher 的 self-distillation 和 online distillation。在这门课的主线里，distillation 最常见的用法就是上面 OFA 那样：大网络 train 好以后，当它所有 sub-network 的 teacher。

:::back
MACs 与 bytes 的对比用的是[第 1 站](#eff)的 roofline。TinyNAS 在 microcontroller 上用同样的 weight-sharing 思路，见[第 7 站](#mcu)。
:::

:::from
MobileNetV2、NASNet-A、AmoebaNet-A 的 140/180/190 ms、ProxylessNAS 的 lookup table、HAT 的 network-wise profiling、progressive shrinking 的顺序，按 [erectbranch 的 Lecture 8 笔记](https://erectbranch.github.io/MIT-Efficient-AI/notes/2022/lec08)。OFA 的 search space、$2\times10^{19}$、predictor、成本表和 80.0% 出自 [Once-for-All 论文](https://ar5iv.labs.arxiv.org/html/1908.09791)。Temperature 的例子（5 和 1，0.982 与 0.599）、teacher/student 的设定、match 中间层的各种做法按 [erectbranch 的 Lecture 10 笔记](https://erectbranch.github.io/MIT-Efficient-AI/notes/2022/lec10/summary01)。Gradient formula、$T^2$ 的理由、high-temperature limit、MNIST 和语音的数字出自 [Hinton 等的论文](https://ar5iv.labs.arxiv.org/html/1503.02531)。Depthwise 的 MACs 与 bytes 表、$7371^5$ 的计算、三类例子和它的 gradient 是为这一页算的。没有读到 NAS lab 的 notebook。
:::

## [gen] LLM 与 diffusion 的高效推理

:::skip
快速路线里 Lecture 13 必读，Lecture 12、15 和 diffusion 两讲是加深。能算出 Llama-2-7B 在 4096 个 token 下的 KV cache、GQA 省多少，推出 speculative decoding 的期望 token 数，并说出 diffusion 为什么需要 W4A4，就可以去第 7 站。
:::

### KV cache 从哪来、有多大

Decoder-only 的 Transformer 每生成一个 token，这个 token 的 query 要和之前所有 token 的 key、value 做 attention。之前的 token 的 key、value 不会变，每一步重新算一遍是浪费，所以存下来，这就是 KV cache。代价是要放在 memory 里。

每个 token、每个 layer、每个 head 存一个 key 和一个 value，各 $d_h$ 个数：

$$\text{KV cache}=2\times L\times H\times d_h\times N\times B\times\text{bytes}$$

$L$ 是 layer 数，$H$ 是 head 数，$d_h$ 是 head dimension，$N$ 是 sequence length，$B$ 是 batch size。Llama-2-7B：$L=32$，$H=32$，$d_h=128$，fp16：

$$2\times32\times32\times128\times2=524{,}288\ \text{byte}=512\ \text{KiB per token}$$

$N=4096$ 时是 2 GiB；$B=16$ 时是 32 GiB，比 13.5 GB 的 weight 还大一倍多。Llama-2-70B（$L=80$，$H=64$）如果用普通的 multi-head attention，每个 token 2.5 MiB，$B=16$、$N=4096$ 时是 160 GiB。

KV cache 也是 decode 时要搬的 bytes。Llama-2-7B 在 $N=4096$ 时每生成一个 token 要读 2.15 GB 的 KV，相当于 weight 的 16%，而且随 $N$ 线性增长。

::fig[m6940-kvcache] KV cache 随 sequence length 的增长（batch size 16，fp16）。70B 的模型换成 GQA 后，KV cache 小 8 倍。

### Multi-query 与 grouped-query attention

既然 KV cache 正比于 head 数 $H$，就让几个 query head 共用同一组 key 和 value。只用 1 组叫 multi-query attention（MQA），分 $G$ 组叫 grouped-query attention（GQA）。课上的常用设置是 $G=H/8$。

Llama-2-70B 的 64 个 head 分成 8 组：

$$2\times80\times8\times128\times2=327{,}680\ \text{byte}=320\ \text{KiB per token}$$

$B=16$、$N=4096$ 时从 160 GiB 降到 20 GiB。Query head 的数目不变，计算量几乎不变；按课上的说法，accuracy 基本保住。

::fig[m6940-gqa] Llama-2-70B 的 64 个 query head 与 KV 的对应。

### KV cache 怎样分配

:::skip
这一小节是 serving 系统的内容，单机部署用不太到。跳过它会少掉 PagedAttention 的动机。
:::

Serving 时同时处理很多 request，每个 request 最终会生成多少 token 事先不知道。如果按最大长度预留连续的 memory，例如 2048 个 token，Llama-2-7B 一个 request 要预留 $2048\times512$ KiB $=1$ GiB；实际只生成到 300 个 token 时用了 150 MiB，85% 被浪费。课上引用的统计是 KV cache 的 memory 有 60% 到 80% 浪费在这类碎片和预留上。vLLM 的 PagedAttention 借用 operating system 的 paging：把 KV cache 切成固定大小的 block（例如每块 16 个 token），用一张 block table 把逻辑上连续的 block 映射到物理上不连续的位置，用满一块再分一块。每个 request 最多浪费不满的最后一块，16 个 token 是 8 MiB。

### Speculative decoding：一次 forward 产出几个 token

Decode 是 memory-bound 的：target model 每做一次 forward，都要把全部 weight 搬一遍，却只产出一个 token。第 1 站的 formula 说，同一次 forward 同时处理几个 token，搬的 bytes 几乎不变。所以如果能先猜出后面几个 token，就可以用一次 forward 把它们一起检查。

做法：一个小的 draft model（分布记作 $q$）自己 autoregressive 地先生成 $\gamma$ 个 token；大的 target model（分布 $p$）一次 forward 算出这 $\gamma$ 个位置以及下一个位置的分布；从第一个开始逐个决定接受还是拒绝，遇到第一个拒绝就停，在那个位置上由 target model 重新采样一个 token。

接受规则：draft 给出的 token $x$，以概率

$$\min\Big(1,\ \frac{p(x)}{q(x)}\Big)$$

接受；被拒绝时，从

$$p'(x)=\frac{\max\big(0,\ p(x)-q(x)\big)}{\sum_y\max\big(0,\ p(y)-q(y)\big)}$$

里重新采样。这样得到的 token 的分布恰好是 $p$。证明只要把两条路径加起来。经过“接受”这条路得到 $x$ 的概率是

$$q(x)\cdot\min\Big(1,\frac{p(x)}{q(x)}\Big)=\min\big(p(x),q(x)\big)$$

被拒绝的总概率是 $1-\sum_y\min(p(y),q(y))$。因为 $\sum p=\sum q=1$，而 $p=\min(p,q)+\max(0,p-q)$，所以它等于 $\sum_y\max(0,p(y)-q(y))$，正好是 $p'$ 的 denominator。经过“拒绝再采样”得到 $x$ 的概率就是 $\max(0,p(x)-q(x))$。两者相加：

$$\min\big(p(x),q(x)\big)+\max\big(0,p(x)-q(x)\big)=p(x)$$

用三个 token 的例子核对：$p=(0.5,\ 0.3,\ 0.2)$，$q=(0.2,\ 0.6,\ 0.2)$。接受概率是 $(1,\ 0.5,\ 1)$；$\sum\min(p,q)=0.2+0.3+0.2=0.7$，被拒绝的概率 0.3；$\max(0,p-q)=(0.3,\ 0,\ 0)$，所以被拒绝后一定采到第一个 token。最终分布 $(0.2+0.3,\ 0.3,\ 0.2)=(0.5,\ 0.3,\ 0.2)=p$。输出和只用 target model 时完全同分布，speculative decoding 不改变结果，只改变速度。

**一次 target forward 期望产出几个 token。** 设每个 draft token 被接受的概率都是 $\alpha$，彼此独立。前 $i$ 个全被接受的概率是 $\alpha^i$。产出的 token 数等于“被接受的 draft token 数加 1”（最后总有 target model 补的一个），所以

$$E[\#\text{tokens}]=\sum_{i=0}^{\gamma}P(\text{前 }i\text{ 个都被接受})=\sum_{i=0}^{\gamma}\alpha^i=\frac{1-\alpha^{\gamma+1}}{1-\alpha}$$

**Speedup。** 设 draft model 跑一次的时间是 target 的 $c$ 倍。一轮要跑 $\gamma$ 次 draft 和 1 次 target，时间是 $\gamma c+1$ 个 target forward，产出上面那么多 token：

$$\text{speedup}=\frac{1-\alpha^{\gamma+1}}{(1-\alpha)(\gamma c+1)}$$

取 $\alpha=0.8$，$\gamma=4$，$c=0.05$：

$$E=\frac{1-0.8^5}{0.2}=\frac{1-0.32768}{0.2}=3.36,\qquad\text{speedup}=\frac{3.36}{1+4\times0.05}=2.80$$

::fig[m6940-specdec] 上：一轮 speculative decoding 一步步走，看 4 个 draft token 怎样只用 target model 的一次 forward 检查完，在第一个被拒绝的位置由 target 补一个 token。下：speedup 随每轮 draft 长度 $\gamma$ 的变化（$c=0.05$）。$\gamma$ 太大时，后面的 draft token 大多被拒绝，draft 的时间白花了。

论文在 T5-XXL 上得到 2 到 3 倍的 latency 改善，输出与原来完全相同。

:::edge $\alpha$ 是 draft 与 target 有多像
$\alpha=E\big[\sum_x\min(p(x),q(x))\big]$，两个分布越接近，$\alpha$ 越大。上面三个 token 的例子里 $\alpha=0.7$。Draft model 选得不像（例如 domain 不同），$\alpha$ 掉到 0.5 以下，$\gamma=4$、$c=0.05$ 时 speedup 只剩 $\frac{1-0.5^5}{0.5\times1.2}=1.6$。
:::

### Diffusion model：换成 compute-bound

Diffusion model 生成一张图要把同一个网络跑几十步，每一步都处理全部的 image token。用第 1 站的 formula 算一个 linear layer：取 $d=3072$，$N=4096$ 个 token，

$$I=\frac{N}{1+2N/d}=\frac{4096}{1+8192/3072}=1117\ \text{FLOP/byte}$$

远在 RTX 4090 的拐点 165 右边，batch size 为 1 也是 compute-bound。所以第 4 站的 W4A16 在这里不起作用：weight 解回 16 bit 后，乘法仍是 16 bit 的，省下的 bytes 不是瓶颈。SVDQuant 论文直接说 weight-only quantization 不能加速 diffusion model。要变快，weight 和 activation 都得是 4 bit（W4A4），乘法本身才变便宜。

W4A4 的难处是两边都有 outlier。SmoothQuant 的办法只能把 outlier 从 activation 挪到 weight，weight 4 bit 承受不住。SVDQuant 的做法是再把 weight 拆成两部分：

$$\hat W=L_1L_2+R$$

$L_1L_2$ 是 rank 为 $r$ 的 low-rank 部分，用 16 bit 计算；只对剩下的 $R$ 做 4-bit quantization。$L_1,L_2$ 取 $\hat W$ 的 SVD 的前 $r$ 项，按 Eckart–Young，这时 $R$ 最小，

$$\|R\|_F=\sqrt{\sum_{i>r}\sigma_i^2}$$

Smoothing 之后的 weight 里，outlier 集中在少数几个 input channel（column）上，这样的 matrix 前几个 singular value 特别大。在一个 $256\times256$ 的随机 matrix 上验证：把 4 个 column 放大 25 倍模拟 smoothing 后的 outlier。它的 singular value 是 8.80、8.58、7.95、7.44，然后掉到 0.618。

| 做法 | $\max|R|/\max|W|$ | weight relative error | output relative error |
|---|---|---|---|
| 直接 4-bit（per-row scale） | 1 | 0.281 | 0.300 |
| 先减去 rank-4，再量化 $R$ | 0.047 | 0.037 | 0.040 |

减掉 rank-4 之后，$R$ 的最大值只剩原来的 4.7%，4-bit 的 scale 跟着缩小 21 倍。Low-rank branch 多出的 parameter 是 $r(m+n)/(mn)$；对 $3072\times3072$ 的 layer，$r=32$ 时是 2.1%。

这个 branch 如果单独做成 kernel，论文测得 rank 32 时会多出约 57% 的 latency，原因是它要多读写一遍 activation。SVDQuant 的推理引擎把 low-rank 的 down projection 和 quantization kernel 融合、up projection 和 4-bit 的计算 kernel 融合，额外开销降到 5% 到 10%。结果：12B 的 FLUX.1 的 transformer 从 22.2 GiB 变成 6.1 GiB，在 16 GB 的笔记本 RTX 4090 上比 4-bit weight-only 的 NF4 快 3.0 倍。

:::wrong 4-bit weight-only quantization 对所有 generative model 都一样有效
它对 LLM 的 decode 有效，是因为那里 $I\approx1$。Diffusion 的 $I$ 上千，瓶颈在乘法，W4A16 不减少乘法的成本。判断一个 quantization 方案会不会加速，先看 workload 落在 roofline 的哪一侧。
:::

:::back
Roofline 和 arithmetic intensity 来自[第 1 站](#eff)；smoothing 来自[第 4 站](#llmq)；SVD 与 low-rank approximation 的 Eckart–Young theorem 在 DSA2102 的 eigenvalue 与 SVD 一站讲过。
:::

:::from
KV cache 的 formula、Llama-2 的每 token 512 KB / 800 KB / 2.5 MB、MHA/MQA/GQA 与 $G=H/8$，按 [erectbranch 的 Lecture 12 笔记](https://erectbranch.github.io/MIT-Efficient-AI/notes/2023/lec12/summary02)；KV cache 60–80% 的浪费、PagedAttention、speculative decoding 的流程，按 [Lecture 13 的 serving 笔记](https://erectbranch.github.io/MIT-Efficient-AI/notes/2024/lec13/summary04)。接受规则、residual 分布、$\alpha$ 的定义、期望 token 数与 speedup 的 formula、T5-XXL 的 2–3 倍出自 [Leviathan 等的论文](https://ar5iv.labs.arxiv.org/html/2211.17192)（证明的附录没读到，上面的证明是我自己补的两行）。Diffusion 为什么 compute-bound、W4A4、low-rank branch、57% 与 5–10%、FLUX.1 的数字出自 [SVDQuant 论文](https://arxiv.org/html/2411.05007v4)。2026 版 diffusion 两讲（Lecture 17–18）的 slides 没读到，所以不确定课上是否按这个顺序讲 SVDQuant；它是 Song Han 组的工作。KV cache 的图、GQA 下 70B 的 320 KiB、paged 的例子、三个 token 的核对、speedup 表、$I=1117$ 和 SVD 的小实验是为这一页算的。
:::

## [mcu] Microcontroller 上的 deep learning：MCUNet 与 TinyEngine

:::skip
快速路线必读（Lecture 10–11，Lab 5 的 loop unrolling、multithreading、SIMD 也来自这里）。能逐层算出 MobileNetV2 的 int8 peak activation、说清 weight 放 Flash 而 activation 必须进 SRAM 的原因，并解释 in-place depthwise 和 patch-based inference 各省了什么，就可以去第 8 站。
:::

### 两块 memory，两种约束

课上用的典型 microcontroller 是 STM32F746：一个 ARM Cortex-M7 core，320 kB SRAM，1 MB Flash。Flash 只能读，适合放 weight；SRAM 能读能写，activation 只能放这里。于是有两个互不相干的约束：

$$\text{model size}\le\text{Flash},\qquad\text{peak activation}\le\text{SRAM}$$

MCUNet 论文说 microcontroller 的 memory 比手机小约 3 个数量级。ResNet-50 超出 storage 限制 100 倍；MobileNetV2 的 peak memory 超出 22 倍，int8 量化之后仍然要 5.3 倍。

### 算一遍 MobileNetV2 的 peak activation

int8 下一个数占 1 byte，input 是 $224\times224$。MobileNetV2 的 block 是 inverted residual：先用 $1\times1$ conv 把 channel 扩大 $t$ 倍（expand），再做 $3\times3$ depthwise，再用 $1\times1$ conv 压回去（project）。一个 layer 执行时它的 input 和 output 都要在 SRAM 里。

- Stem：$3\times224\times224=150{,}528$ 进，$32\times112\times112=401{,}408$ 出。
- 第 1 个 block（$t=1$，16 个 output channel）：depthwise 在 $112\times112\times32$ 上，in + out 是 802,816；project 后变成 $16\times112\times112=200{,}704$。
- 第 2 个 block（$t=6$，stride 2，24 个 output channel）：expand 把 16 个 channel 扩成 96 个，
$$\underbrace{16\times112\times112}_{200{,}704}+\underbrace{96\times112\times112}_{1{,}204{,}224}=1{,}404{,}928\ \text{byte}=1372\ \text{KiB}$$
接着的 depthwise（stride 2）输出 $96\times56\times56=301{,}056$，in + out 是 1,505,280 byte $=1470$ KiB。

::fig[m6940-invres] 这一层的 input、output 与 SRAM。看 output 写到第几个 channel 时越过 SRAM 的虚线。

按 in + out 硬算，peak 是 1470 KiB，在第 2 个 block 的 depthwise。如果 depthwise 能原地计算（下面 TinyEngine 那部分），它只需要 input 那么多加一点，peak 落到 expand 那一层的 1372 KiB。这正是 MCUNetV2 论文 Table 1 里 MobileNetV2 的 peak SRAM 1372 kB，$1372/256=5.36$ 也就是 MCUNet 说的“int8 之后仍要 5.3 倍”（对 256 kB 的预算而言）。

::fig[m6940-mcupeak] MobileNetV2（int8，224 input，depthwise 按 in-place 计）每个 block 的 peak activation。stem 和前 4 个 block 都超过 500 KiB，之后的都在 200 KiB 以下。

这个分布极不均衡：前几个 block 的 resolution 大，后面的 resolution 小、channel 多，activation 变小、weight 变大。MCUNetV2 说第三个 block 的 memory 是网络其余部分的约 8 倍；上图里 1372 KiB 和后面 13 个 block 中最大的 196 KiB 之比是 7.0。

Peak activation 随 input resolution 的平方缩小。同样按 in-place depthwise 计：

| input resolution | 224 | 160 | 128 | 96 |
|---|---|---|---|---|
| peak（KiB） | 1372 | 700 | 448 | 252 |

### TinyNAS：先挑 search space

Resolution 和 width 都能让模型塞进去，问题是挑哪个组合 accuracy 最高。MCUNet 的 TinyNAS 分两步。第一步挑 search space：input resolution $R$ 取 48 到 224，width multiplier $W$ 取 0.2 到 1.0，共 $12\times9=108$ 个候选空间。每个空间里随机采样一些满足 memory 约束的网络，看它们的 FLOPs 分布：在同样的 memory 约束下，一个空间里的网络能做的计算越多，accuracy 通常越高。论文的例子里，一个空间的前 20% 网络 FLOPs 在 50.3M 以上，另一个只有 32.3M，前者的最终 accuracy 高 4.5%。第二步在挑好的空间里做 one-shot NAS（和第 5 站的 weight sharing 一样），搜索成本比逐个 train 低 200 倍。

### TinyEngine：把 buffer 排好

Model 搜好了，还要一个 inference engine 把它跑起来，engine 本身也吃 memory。

**Code generation 代替 interpreter。** TF-Lite Micro 一类的 interpreter 在运行时解析模型，要为所有可能的 operator 留代码和 metadata，论文说这部分可以占到 peak memory 的 65%，并多出 22% 的 latency。TinyEngine 在编译时只生成这个模型用到的 kernel，binary 比 TF-Lite Micro 小 4.5 倍。

**Model-adaptive memory scheduling。** im2col 一类的 buffer 大小取决于 layer 的 $k^2\times c_\text{in}$。TinyEngine 取整个模型里最大的那个作为 buffer 大小 $M$，每层再按 $\lfloor M/(k^2c_\text{in})\rfloor$ 决定一次处理多少，让每一层都把同一块 buffer 用满。

**In-place depthwise convolution。** Depthwise 的第 $c$ 个 output channel 只依赖第 $c$ 个 input channel。所以可以一个 channel 一个 channel 地算：把 output channel $c$ 写进一个临时 buffer，算完后 input channel $c$ 已经不再需要，把临时 buffer 拷回它的位置。$N$ 个 channel 的 layer，普通做法要 $2N$ 个 channel 的空间，in-place 只要 $N+1$ 个。以第 3 个 block 的 depthwise 为例（$56\times56$，144 个 channel）：

$$2\times144\times3136=903{,}168\ \text{byte}=882\ \text{KiB}\quad\longrightarrow\quad145\times3136=454{,}720\ \text{byte}=444\ \text{KiB}$$

几乎减半。论文实测 in-place depthwise 让 memory 少 1.6 倍。

**Kernel specialization。** 按 kernel size 把 loop 展开（$3\times3$ 展开成 9 段），把 conv、padding、ReLU、BN 融合成一个 kernel。

TinyEngine 合起来让 peak memory 少 3.4 倍，比 TF-Lite Micro 和 CMSIS-NN 快 1.7 到 3.3 倍。MCUNet 在 STM32F746 上的 ImageNet top-1 是 63.5%，在 STM32H743（512 kB SRAM、2 MB Flash）上 4-bit 量化做到 70.7%。

:::wrong MobileNetV2 只有 3.4M 个 parameter，int8 后 3.4 MB，换一块 Flash 大一点的 MCU 就能跑
Flash 只管 weight。真正卡住的是 SRAM：上面算出 peak activation 是 1372 KiB，STM32F746 的 SRAM 是 320 kB，差 4 倍多，和 Flash 多大无关。即使把 weight 压到 1 MB 以内，模型照样跑不起来。在 MCU 上先算 peak activation。
:::

### MCUNetV2：patch-based inference

既然 peak 只出现在前几个 block，就只让这一段分块执行：把 input 切成 $p\times p$ 个 patch，每个 patch 单独跑完前几个 block，得到 output feature map 的一小块，拼起来之后，剩下的网络照常逐层执行。每次只有一个 patch 的 activation 在 SRAM 里。

代价是 receptive field。Output 的一块要用到 input 中更大的一块，相邻 patch 的 input 有重叠（halo），重叠的部分被重复计算。例如连续 3 个 $3\times3$、stride 1 的 conv，每层往外多要 1 个像素，output 上 $28\times28$ 的 patch 需要 input 上 $34\times34$：

$$\Big(\frac{34}{28}\Big)^2=1.47$$

这一段的计算多出 47%。Patch 越小越糟：$14\times14$ 的 patch 要 $20\times20$ 的 input，多出 104%。

::fig[m6940-patch] Patch-based inference：看左边的框一块块扫过 input，每个 patch 带着一圈和邻居重叠的 halo 跑完前几个 block，右边的 feature map 一块块拼满；后面的 block 照常逐层执行。

MCUNetV2 论文：MobileNetV2 的 peak SRAM 从 1372 kB 降到 172 kB（8 倍），整体计算多出约 10%（patch 段内部多出 42%）。再把前面这一段的 receptive field 缩小（用小 kernel、少几个 block），把缺的 receptive field 补到后面的 layer-by-layer 段，overhead 降到 3%，accuracy 不变。结果：STM32H743 上 ImageNet 71.8%；Visual Wake Words 在 32 kB SRAM 下超过 90%。

:::back
Peak activation 的定义来自[第 1 站](#eff)。TinyNAS 的 weight sharing 和[第 5 站](#nas)的 OFA 是同一个思路。4-bit 量化来自[第 3 站](#quant)。
:::

:::from
STM32F746 的规格、Flash 与 SRAM 的分工、100 倍 / 22 倍 / 5.3 倍、TinyNAS 的 108 个空间和 FLOPs heuristic、TinyEngine 的 65% / 22% / 4.5 倍、memory scheduling 的两个 formula、$2N\to N+1$、3.4 倍与 1.7–3.3 倍、63.5% 与 70.7%，出自 [MCUNet 论文](https://ar5iv.labs.arxiv.org/html/2007.10319)。不均衡的 memory 分布、1372 kB → 172 kB、10% 与 42%、receptive field redistribution、71.8% 出自 [MCUNetV2 论文](https://arxiv.org/html/2110.15352v2)。Lecture 10–11 的讲次顺序和 TinyEngine 的几个名词核对了 [gozhiyuan 的笔记](https://gozhiyuan.github.io/tinyml/large-language-model/2024/10/20/mit-tinyml-10.html)，那份笔记没有数字；slides 没读到。MobileNetV2 的逐层计算、1372 KiB 与论文数字的对应（“按 in-place depthwise 计”是我的推断）、resolution 表、882 → 444 KiB、halo 的例子是为这一页算的。MobileNetV2 的 block 配置凭我自己的知识。
:::

## [robot] 接到机器人：Jetson 级硬件上的 policy

:::skip
课程没有专门讲机器人的一讲。这一站用前七站的账去算一个 VLA 在 Jetson 上能跑多快，数据来自 OpenVLA 论文、AWQ 论文和 NVIDIA 的规格，凡是推论都标明了。只想学课程本身可以跳过。
:::

### Jetson 在 roofline 上的位置

NVIDIA 给出的两个 Orin 模块：

| | Jetson AGX Orin 64GB | Jetson Orin NX 8GB |
|---|---|---|
| INT8 算力 | 275 sparse / 138 dense TOPS | 70 sparse / 35 dense TOPS |
| memory | 64 GB | 8 GB |
| 功耗 | 15–60 W | 10–20 W |

同一篇博客给出 AGX Orin 开发者套件（32 GB DRAM）的 memory bandwidth 是 204.8 GB/s。和第 1 站的 RTX 4090（1 TB/s）比，bandwidth 是它的五分之一。Sparse 和 dense 的 TOPS 差 2 倍，指的是第 2 站的 2:4 sparsity。

### 算一个 VLA 每一步要多久

OpenVLA 是一个 7B 的 vision-language-action model，language backbone 是 Llama 2 7B，vision encoder 融合了 DINOv2 和 SigLIP 的 feature。它把 robot 的 action 表示成 7 个维度，每个维度离散成 256 个 bin，所以输出一个 action 就是生成 7 个 token。

每个 control step 至少要 decode 7 个 token。第 1 站说 decode 是 memory-bound 的，每个 token 的时间至少是 weight bytes 除以 bandwidth。只算 Llama 2 7B 的 weight（vision encoder 和处理图像 token 的 prefill 都不算，所以是下界），在 204.8 GB/s 上：

| 精度 | weight bytes | 每个 token | 7 个 token | 频率上界 |
|---|---|---|---|---|
| bf16 | 13.48 GB | 65.8 ms | 461 ms | 2.2 Hz |
| int8 | 6.74 GB | 32.9 ms | 230 ms | 4.3 Hz |
| int4（linear 层 g128 + fp16 embedding） | 3.86 GB | 18.9 ms | 132 ms | 7.6 Hz |

OpenVLA 在 BridgeData V2 上用的是 5 Hz 的 controller，DROID 上是 15 Hz。在 AGX Orin 上，bf16 连 5 Hz 的上界都达不到，int4 的上界是 7.6 Hz，扣掉 prefill 和其他开销后能不能到 5 Hz 要实测；15 Hz 在这个模型大小下没有可能。

这个下界的算法可以拿已知的测量检验。OpenVLA 论文说 bf16 在 RTX 4090 上约 6 Hz。按 1 TB/s 算，7 个 token 的下界是 94 ms，即不超过 10.6 Hz；实测 6 Hz 在下界以内，差的部分是 prefill 和别的开销。

### 量化之后发生了什么

OpenVLA 论文在 8 个 BridgeData V2 任务上（每个 80 次 rollout）比较了三种精度：

| 精度 | success rate | VRAM |
|---|---|---|
| bf16 | 71.3 ± 4.8% | 16.8 GB |
| int8 | 58.1 ± 5.1% | 10.2 GB |
| int4 | 71.9 ± 4.7% | 7.0 GB |

在 A5000 上，int8 只跑到约 1.2 Hz，int4 约 3 Hz。

:::wrong int8 一定比 int4 准、比 bf16 快
这张表里 int8 的 success rate 最低，速度也最慢。论文的解释是 int8 加进去的 quantization operation 有额外开销，inference 变慢，success rate 的下降也归因于这一点。按这个解释，问题出在速度：在 5 Hz 的 non-blocking controller 下，policy 给出 action 太晚（这一句是我的理解）。这和第 4 站的结论一致：同样是“8-bit”，实现方式决定了它是省时间还是费时间。论文没有说明 int8 用的是哪种实现，我没有核对。
:::

int4 的 success rate 和 bf16 相当，memory 是它的 42%，正是第 4 站 W4A16 的情形。

### Han 组在 Orin 上测过的数

AWQ 论文用 TinyChat 在 Jetson Orin 上跑 W4A16：相对 FP16 最多 3.5 倍；VILA-7B（一个 vision-language model）从 11.5 提到 35.6 token/s，VILA-13B 从 6.1 提到 17.5；Llama-2-70B 能放进一块 64 GB 的 Orin（按第 4 站的算法，70B 的 4.125-bit weight 约 36 GB，fp16 要 140 GB）。Lab 5 用的 TinyChatEngine 支持 compute capability 6.1 以上的 CUDA 设备，README 举的例子就是 Jetson AGX Orin。

### 哪些结论能直接搬，哪些必须实测

下面是把前几站的结论套到机器人 policy 上的推论，我没有找到课程或论文对 VLA 在 Jetson 上逐项实测的资料。

- **能直接搬的**：autoregressive 地输出 action token 的部分是 memory-bound 的，W4A16（第 4 站）一定省时间，上界可以按上面的表格先算。KV cache 的大小可以按第 6 站的 formula 算出来，多帧 observation 让 sequence 变长时它会线性增长。
- **要看结构的**：图像 token 的 prefill 是 compute-bound 的（第 1 站，$N$ 大），那里 int8 的 Tensor Core 和 2:4 sparsity 才有用。如果 action head 是 diffusion 一类的多步生成，按第 6 站的分析它是 compute-bound 的，W4A16 帮不上忙。
- **必须实测的**：MACs 预测不了 latency（第 5 站）；int8 可能比 bf16 慢（上面 OpenVLA 的例子）；Jetson 的功耗模式会改变频率。部署前在目标设备上量端到端的 control frequency，而不是看 parameter 数或 FLOPs。

:::from
Orin 的规格出自 [NVIDIA 技术博客](https://developer.nvidia.com/blog/delivering-server-class-performance-at-the-edge-with-nvidia-jetson-orin)（NVIDIA 产品页的抓取被拒）。OpenVLA 的结构、7 个 action token、256 个 bin、5 Hz 与 15 Hz、4090 上 6 Hz、量化表、A5000 上的频率和对 int8 的解释出自 [OpenVLA 论文](https://arxiv.org/html/2406.09246v3)。Orin 上的 3.5 倍、VILA 的 token/s、70B 放进 64 GB 出自 [AWQ 论文](https://arxiv.org/html/2306.00978v5)；TinyChatEngine 支持 Jetson AGX Orin 出自它的 [README](https://github.com/mit-han-lab/tinychatengine)。延迟下界的表格和最后一节的分类是我用前几站的方法算出和推出的，没有实测核对。
:::

## 作业

Fall 2026 有 6 个 lab（Lab 0 到 Lab 5）和一个 final project。Lab 个人完成，6 个 late day 不扣分，用完后每晚一天扣一半，至少交 4 个 lab 才能 pass。外部学习者没有 autograder，只能靠 notebook 里的检查和自己对照结果。Colab notebook 要登录 Google 才看得到正文；下面关于 Pruning 和 Quantization lab 的具体内容来自 2024 版（当时编号 Lab 1、Lab 2）的社区镜像，2026 版可能有改动。

### Lab 0（2026）

- **内容**：课程主页没有写题目，notebook 正文这次没有读到。按它的发布时间（第 2 讲之后）和 2024 版的同名 lab，应当是 PyTorch 的热身，这是推测。
- **算力**：Colab notebook。
- **优先级**：会写 PyTorch training loop 就可以跳。

### Lab 1：GPU Basics（2026 新增）

- **内容**：以 zip 发布，这次没有读到内容。
- **优先级**：有余力再做。它和 Lab 5 的 kernel 优化有关，但具体要求未知。

### Lab 2：Pruning（2026 编号；2024 是 Lab 1）

- **从零实现**：magnitude-based 的 fine-grained pruning（用 `torch.kthvalue` 求 threshold、生成 mask）；对每个 conv 和 FC layer 做 sensitivity scan 并选 sparsity；channel pruning（保留前若干个 output channel，同步裁 BatchNorm 和下一层的 input channel）；按 Frobenius norm 排序 channel；fine-tune；测 MACs、model size 和 CPU latency。
- **做完会什么**：第 2 站的全部内容，以及“为什么 fine-grained 不提速、channel pruning 提速”的实测体会。
- **时间与算力**：handout 没给时间，调研条目估计 4 到 6 小时。Notebook 调用 `.cuda()`，要 Colab 的 GPU runtime，免费的 T4 够用；latency 在 CPU 上测。
- **优先级**：先做。
- **提示**：
  - Fine-grained pruning 的约束是 model size 不超过 dense 的 25%、accuracy 不低于 92.5%。镜像里的一组可行答案是：第一个 conv 0，接下来四个 0.5，再两个 0.8，最后一个 conv 0.9，classifier 0；剪完 87.00%，fine-tune 后 92.80%。（来源：2024 版 lab 镜像）
  - `mask = importance > threshold` 在有并列值时会多剪一点，镜像里目标 0.75 实测 0.76，属于正常。（来源：lab 镜像）
  - Fine-tune 时，每次 `optimizer.step()` 之后都要把 mask 乘回 weight，否则被剪掉的 weight 会重新长出来。Sensitivity scan 每试一个组合后要恢复原始 weight，否则后面的扫描是在已经剪过的模型上做的。（来源：调研条目引用的镜像；我这次读镜像时没有核到这两条的原文，但按 pruning 的流程它们必然成立）
  - Channel pruning 要同步改四个 BatchNorm tensor（weight、bias、running mean、running var）和下一层 conv 的 `weight[:, :n_keep]`；排序时三处用同一个 permutation。排序后 dense accuracy 应当仍是 92.95%，不是就说明三处没对齐。（来源：lab 镜像）
  - 只剪不排序，accuracy 掉到 28.14%；排序后 36.81%；fine-tune 5 个 epoch 回到 92.18%。看到暴跌先别怀疑实现，先看 fine-tune 之后的数。（来源：lab 镜像）
  - 30% channel pruning 的实测：MACs 1.99 倍、parameter 1.84 倍、latency 1.86 倍。Q8 问为什么 MACs 接近 2 倍、latency 稍少，按第 2 站的 $0.7^2$ 和第 1 站的 memory 账回答。（来源：lab 镜像；解释是本页的）

### Lab 3：Neural Architecture Search（2026 编号）

- **内容**：notebook 正文没有读到。调研条目建议先跳；部署时很少需要自己跑 NAS。
- **优先级**：有余力再做。做的话先读第 5 站，并把 OFA 论文里的 latency lookup table 和 accuracy predictor 看懂。

### Lab 4：Quantization（2026 编号；2024 是 Lab 2）

- **从零实现**：k-means quantization（用 `fast_pytorch_kmeans`）和 codebook 更新（每个 centroid 取所属 weight 的 mean）；linear quantization 的 `linear_quantize`、scale 与 zero point；int32 bias；`quantized_linear` 和 `quantized_conv2d`；BatchNorm fusion、activation range calibration、input preprocessing，最后把 VGG 变成 integer-only 的 int8 模型。
- **做完会什么**：第 3 站的全部内容，以及 integer-only inference 每一步的数据类型。
- **时间与算力**：handout 没给时间，调研条目估计 5 到 8 小时。用到 `.cuda()`，要 Colab GPU runtime。
- **优先级**：先做。
- **提示**：
  - k-means 不 fine-tune 时 4-bit 是 79.07%，2-bit 是 10.00%；fine-tune 后 92.47% 和 91.17%。2-bit 的崩溃是预期现象。（来源：lab 镜像）
  - Zero point 的写法是 `qmin - round(fp_min / scale)`，再 clamp 到 $[q_\text{min},q_\text{max}]$。（来源：lab 镜像）
  - Bias 用 int32，`bias_scale = weight_scale * input_scale`，zero point 为 0；input zero point 带来的修正项折进 bias：linear 是 `quantized_bias - quantized_weight.sum(1) * input_zero_point`，conv 是对 `(1, 2, 3)` 三个维度求和。这就是第 3 站推导里的 $-Z_Xq_W\mathbf{1}$。（来源：lab 镜像）
  - 输出要先在 int32 里加上 zero point 并 clamp 到 int8 范围，再 cast 成 int8；先 cast 再加会溢出或 wraparound。（来源：调研条目，部分来自镜像代码，部分是经验；理由见第 3 站的 :::wrong）
  - 先 fuse BatchNorm 再收集 activation range（fuse 后 backbone 从 29 层变成 21 层，accuracy 仍是 92.95%）。Input 图像在 $(0,1)$ 内，要用 `x * 255 - 128` 映射到 int8 再 clamp，漏掉这一步整个模型的 accuracy 会很低。最终 int8 模型 92.90%。（来源：lab 镜像）

### Lab 5：LLM Deployment on Laptop（TinyChatEngine）

- **从零实现**：在 TinyChatEngine 里部署 AWQ 量化的 LLaMA2-7B-chat，给 linear kernel 依次加上 loop unrolling、multithreading、SIMD，测每一步对端到端 latency 的影响。提交用 `git diff` 生成的 patch（命名 `{studentID}-{ISA}.patch`，ISA 取 x86 或 ARM）和报告。
- **做完会什么**：第 4 站 W4A16 在 CPU 上的真实样子，int4 weight 怎样在 SIMD register 里解包，以及 memory-bound 的 kernel 该怎么优化。
- **时间与算力**：详细步骤在 tutorial 链接的 Google Doc 里，这次没读到（要 JavaScript）；调研条目估计 8 到 12 小时。不需要 GPU，x86 或 ARM 的笔记本都行。按第 4 站的算法，int4 的 7B 模型约 3.9 GB，磁盘和 memory 要留出几 GB。
- **优先级**：先做。这是这门课里唯一能直接搬到 Jetson、Raspberry Pi 上的作业。
- **提示**：
  - 先确认自己机器的 ISA，只改对应的 SIMD 路径（x86 是 AVX，ARM 是 NEON），patch 名字里写对。（来源：tinychat-tutorial README）
  - macOS 要先用 Homebrew 装 boost 和 llvm，Apple Silicon 还要装 Xcode 以获得 Metal compiler；CUDA 设备要按自己 GPU 的 compute capability 改 `llm/Makefile` 里的 `-gencode arch=compute_xx,code=sm_xx`。（来源：TinyChatEngine README）
  - ARM 的 int4 layout 是为 128-bit SIMD 准备的：weight 被交错成 $[w_0,w_{16},w_1,w_{17},\dots,w_{15},w_{31}]$，一个 byte 的低 4 bit 和高 4 bit 分别属于前半和后半，用一次 AND（`0x0F`）和一次 shift（`>> 4`）就能同时解出 16 对。例如 byte `0xB3`（二进制 1011 0011）解出低位 3、高位 11，再按 $r=S(q-Z)$ 换回 real number。这个重排是在模型转换时 offline 做的。x86 的 layout 对应 256-bit SIMD。（来源：TinyChatEngine README；数值例子是本页的）
  - 报告要分别给出每一步优化的提速，所以每加一种优化就单独测一次、记下数字，不要三种一起改完才测。（来源：tinychat-tutorial README 对报告的要求）
  - 每加一步先对比参考输出确认结果没变，再测速度；笔记本测速时插电、多跑几次取稳定值，降频会让同一份代码的 latency 波动很大。（来源：经验）
  - 优化完的 kernel 仍然是 memory-bound 的：按第 1 站的账，下界是 3.9 GB 除以你机器的 memory bandwidth。实测的每 token latency 离这个下界有多远，说明 kernel 还剩多少空间。（来源：本页的推论）

### Final project

分组完成，三部分：proposal（Fall 2026 截止 11 月 19 日）、poster presentation（12 月 3 日至 10 日）、final report（12 月 13 日）。可以从课程给的 project idea 列表里选，也可以自己提；列表是一个公开的 Google Doc，这次没有读到正文。对这一页的读者，一个自然的题目是第 8 站的问题：把一个 VLA 或视觉 encoder 量化到 int4，部署到 Jetson 上，测出端到端的 control frequency，和第 8 站的下界对照。
