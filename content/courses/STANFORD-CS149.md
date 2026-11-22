---
code: STANFORD-CS149
evidence: syllabus
evidenceNote: "Stanford CS149 Parallel Computing，Fall 2025 一期（Kayvon Fatahalian、Kunle Olukotun；Fall 2026 的公开页面还没有出现）。讲法跟着课程网站上的 slides：Lecture 2、3、5、6、7、8、10、13、14、15、16 的 PDF 是通过 WebFetch 读的，拿到的是工具抽出的逐页文字摘要，slides 上的图没有看到；Lecture 1、4、9、11、12、17、18 没有读。五个作业的 README 是 git clone 下来逐段读的（asst1、asst2、asst3、asst4-trainium2、asst5-kernels），asst1 的 Mandelbrot 参数取自仓库里的 main.cpp。没有看 YouTube 录像。"
exam: "无考试；以作业为主。Fall 2025 有五个编程作业，各自带 writeup，asst5 按工作日志评分。以当期课程网站为准。"
subskills:
  - id: core
    name: Multi-core、SIMD 与 latency hiding
    l3: "有提示能做：数出一个带 if/else 的 SIMD 片段的 lane utilization，算出给定 latency 下要几个 hardware thread 才能让 core 不停。"
    l4: "能独立做：对一个 kernel 分别算出 compute 和 memory traffic 各要多久，判断它是 compute-bound 还是 bandwidth-bound，并说出加 thread、加 SIMD 各自能不能救。"
    l5: "能讲给别人：multi-core、SIMD、multithreading 三个想法各自省掉了什么硬件、换来了什么限制，以及 GPU 为什么把这三样都推到极端。"
  - id: ispc
    name: ISPC：SPMD 的 abstraction 与 implementation
    l3: "有提示能做：读一段 ISPC code，说出每个 program instance 处理哪些 element、每条 instruction 是 packed load 还是 gather。"
    l4: "能独立做：用 foreach、uniform、reduce_add 写出正确的 reduction，用 launch 把工作分到多个 core。"
    l5: "能讲给别人：SPMD 这个 abstraction 承诺了什么、ISPC 实际怎样把它编成 SIMD instruction，以及 gang 和 task 为什么是两层。"
  - id: work
    name: Work distribution 与 scheduling
    l3: "有提示能做：给出每块工作的 cost，算出某种 static assignment 的 speedup 上限。"
    l4: "能独立做：在 static、dynamic、work stealing 之间选择，并为 dynamic assignment 选 granularity。"
    l5: "能讲给别人：Cilk 为什么选 continuation stealing、thief 为什么从 deque 的另一头偷，以及这对 memory 和 locality 意味着什么。"
  - id: locality
    name: Locality、communication 与 arithmetic intensity
    l3: "有提示能做：写出 grid solver 在 1D 和 2D blocked assignment 下的 communication-to-computation ratio。"
    l4: "能独立做：区分 inherent 与 artifactual communication，用 fusion 和 blocking 提高 arithmetic intensity，并用 high-watermark 实验找瓶颈。"
    l5: "能讲给别人：为什么 communication 在 shared address space 的 program 里同样存在，以及 problem size 和 processor 数怎样改变结论。"
  - id: gpu
    name: GPU 与 CUDA programming model
    l3: "有提示能做：写出 CUDA kernel 的 index 计算，算出一个 SM 上能同时放几个 thread block，数出 warp divergence 的 utilization。"
    l4: "能独立做：用 shared memory 和 __syncthreads 写有 data reuse 的 kernel，用 upsweep/downsweep 实现 exclusive scan 并用它做 stream compaction。"
    l5: "能讲给别人：CUDA 的 block 为什么必须可以按任意顺序执行，SIMT 和 SIMD 是什么关系，以及 data-parallel primitive 怎样把 fine-grained synchronization 换成多遍扫描。"
  - id: coherence
    name: Cache coherence 与 memory consistency
    l3: "有提示能做：对一串 read/write 走一遍 MSI，写出每一步各 cache 的 state 和 bus transaction。"
    l4: "能独立做：解释 MESI 的 E state 省了什么，诊断并修好 false sharing，判断一个 litmus test 在 SC 和 TSO 下允许哪些结果。"
    l5: "能讲给别人：coherence 和 consistency 各管什么，write buffer 为什么会打破 SC，以及 data-race-free 的 program 为什么不必关心 hardware 的 memory model。"
  - id: sync
    name: Synchronization：lock 与 lock-free
    l3: "有提示能做：说出 test-and-set lock 在 waiting 时产生什么 coherence traffic。"
    l4: "能独立做：写出 test-and-test-and-set、ticket lock、CAS loop，用 condition variable 写一个不 spin 的 thread pool。"
    l5: "能讲给别人：hand-over-hand locking 为什么不会 deadlock，ABA problem 怎样发生，以及 lock-free 在什么场合真的比 lock 好。"
  - id: special
    name: DSL 与 domain-specific hardware
    l3: "有提示能做：用 energy per operation 的数字解释 instruction overhead，画出 systolic array 里 data 的流动。"
    l4: "能独立做：把 convolution 写成一串 matmul 并按 accelerator 的 tile 限制安排 loop order，用 Halide 的 schedule 在 parallelism、locality、redundant work 之间权衡。"
    l5: "能讲给别人：专用硬件的效率来自哪三处，DSL 为什么能让 compiler 或 search 去做 optimization。"
open:
  - label: "Stanford CS149 Fall 2025 课程网站与 lecture 列表"
    url: "https://gfxcourses.stanford.edu/cs149/fall25/lecture"
    note: "分站按这里的 18 讲；slides PDF 的地址都从各讲的页面里取得。"
  - label: "Lecture 2: A Modern Multi-Core Processor (Part I)"
    url: "https://gfxcourses.stanford.edu/cs149/fall25content/media/multicore1/02_basicarch.pdf"
    note: "第 1 站。sinx 例子、masking、multithreading 的 utilization 计算、Kaby Lake 和 V100 的数字。WebFetch 抽出的文字摘要。"
  - label: "Lecture 3: Multi-Core Architecture (Part II) + ISPC Programming Abstractions"
    url: "https://gfxcourses.stanford.edu/cs149/fall25content/media/multicore2/03_multicore2-ispc_WueDBzT.pdf"
    note: "第 1、2 站。bandwidth-bound 的例子、ISPC 的 gang、interleaved 与 blocked、reduction。文字摘要。"
  - label: "Lecture 5: Work Distribution and Scheduling"
    url: "https://gfxcourses.stanford.edu/cs149/fall25content/media/perfopt1/05_progperf1.pdf"
    note: "第 3 站。文字摘要。"
  - label: "Lecture 6: Locality, Communication, and Contention"
    url: "https://gfxcourses.stanford.edu/cs149/fall25content/media/perfopt2/06_progperf2.pdf"
    note: "第 4 站。文字摘要。"
  - label: "Lecture 7: GPU Architecture and CUDA Programming"
    url: "https://gfxcourses.stanford.edu/cs149/fall25content/media/gpuarch/07_gpuarch.pdf"
    note: "第 5 站。文字摘要。"
  - label: "Lecture 8: Data-Parallel Thinking"
    url: "https://gfxcourses.stanford.edu/cs149/fall25content/media/dataparallel/08_dataparallel.pdf"
    note: "第 5 站的 scan 与 data-parallel primitive。文字摘要。"
  - label: "Lecture 10: Hardware Specialization"
    url: "https://gfxcourses.stanford.edu/cs149/fall25content/media/accelerators/10_Specialized.pdf"
    note: "第 8 站。文字摘要。"
  - label: "Lecture 13: Domain-Specific Programming Systems and AI-Driven Performance Optimization"
    url: "https://gfxcourses.stanford.edu/cs149/fall25content/media/aiperfoptimization/13_autooptimize.pdf"
    note: "第 8 站的 Halide。文字摘要。"
  - label: "Lecture 14: Cache Coherence"
    url: "https://gfxcourses.stanford.edu/cs149/fall25content/media/cachecoherence/14_coherence.pdf"
    note: "第 6 站。文字摘要。"
  - label: "Lecture 15: Implementing Synchronization + Memory Consistency"
    url: "https://gfxcourses.stanford.edu/cs149/fall25content/media/sync_consistency/15_consistency.pdf"
    note: "第 6 站的 consistency 部分。摘要里没有出现 lock 和 barrier 的实现。"
  - label: "Lecture 16: Fine-Grained Locking and Lock-Free Programming"
    url: "https://gfxcourses.stanford.edu/cs149/fall25content/media/finegrainedsync/16_finegrainedlock.pdf"
    note: "第 7 站。文字摘要，没有可读的数据。"
  - label: "stanford-cs149/asst1 至 asst5 的 README（git clone 后逐段读）"
    url: "https://github.com/stanford-cs149/asst1"
    note: "作业一节的全部提示；asst2 在 stanford-cs149/asst2，asst3 在 asst3，asst4 在 asst4-trainium2，asst5 在 asst5-kernels。"
---

先看三次加速失败。

**第一次。** 一台四核、每核两个 hardware thread 的机器，用 `std::thread` 把 Mandelbrot 图像按 row 切成连续的几块，每个 thread 算一块。2 个 thread 时工作量本身允许 2 倍 speedup；3 个 thread 反而只允许 1.65 倍。

**第二次。** `saxpy`（`result = scale*X + Y`，2000 万个 float）在同一台机器上，用满 4 个 core 和 8-wide SIMD，峰值算力每秒约 4000 亿次 floating-point operation，算完只要 0.1 ms；可是三个 array 共 240 MB，按 38.4 GB/s 的 memory bandwidth 至少要搬 6.25 ms。再加 thread、再加 SIMD，时间几乎不动。

**第三次。** 8 个 thread 各自对自己的 counter 加很多次，counter 放在一个 `int` array 里。没有任何两个 thread 碰同一个 counter，跑了 14.2 秒；每个 counter 后面补上 padding，变成 4.7 秒。

::fig[cs149-mandel] 第一次失败的原因。左边是 Mandelbrot 默认 view 每 30 个 row 的 iteration 总数（按 asst1 的 1600 × 1200、最多 256 次 iteration 实际算出）；3 个 thread 各拿 400 个 row，中间那个拿到六成。右边是两种分法下三个 thread 各自的工作量。

三次失败对应这门课的三件事：工作要分得匀（第 3 站），数据要搬得少（第 1、4 站），多个 core 之间看不见的通信要算进去（第 6 站）。整门课教的是一种推理：给一段 program 和一台机器，说出它的时间花在哪一类资源上，该改哪里。硬件的部分讲到能做这种推理为止：multi-core CPU 的三种 parallelism（第 1 站）、GPU（第 5 站）、cache coherence（第 6 站）、专用硬件（第 8 站）；programming model 的部分讲每个 abstraction 承诺什么、底下怎么实现：ISPC（第 2 站）、CUDA（第 5 站）、lock 与 atomic（第 7 站）、DSL（第 8 站）。

| 站 | 内容 | 对应 lecture | 对应作业 |
|---|---|---|---|
| 1 | Multi-core、SIMD、multithreading、bandwidth | 1、2、3 | A1 |
| 2 | ISPC | 3 | A1 |
| 3 | Work distribution、scheduling | 4、5 | A1、A2 |
| 4 | Locality、communication | 6 | A1、A3 |
| 5 | GPU、CUDA、data-parallel thinking | 7、8 | A3、A5 |
| 6 | Cache coherence、memory consistency | 14、15 | A2 |
| 7 | Lock、lock-free | 15、16 | A2 |
| 8 | Domain-specific hardware 与 DSL | 10、11、13 | A4、A5 |

这一页假定读者懂 cache 的 tag、index、offset 和 hit/miss（[CS2100 第 8 站](../courses/CS2100.html#cache)），懂 instruction pipeline（[CS2100 第 7 站](../courses/CS2100.html#pipe)）。Amdahl's law 在 [CS249R 第 1 站](../courses/HARVARD-CS249R.html#env)；roofline、GPU 上的 fusion 和 tiling、FlashAttention 在 [CS336 第 5 站](../courses/STANFORD-CS336.html#gpu)；loop order、im2col 在 [CS249R 第 3 站](../courses/HARVARD-CS249R.html#kernel)。这些地方这里只给链接。

只有十几个小时时的路线：第 1、2、3、4、5、8 站必读，对应 Lecture 1 到 3、5 到 10；第 6、7 站可以先跳，代价是对多线程 program 的正确性理解浅一些，做 A2 时会吃亏。

## [core] Multi-core、SIMD 与 latency hiding

:::skip
能算出一个 if/else 片段在 8-wide SIMD 上的 lane utilization，能用“latency 除以每次 load 之间的 compute”算出要几个 hardware thread，能判断 `saxpy` 为什么加 thread 也不快，就可以去第 2 站。快速路线必读，A1 的六个 program 都建立在这一站上。
:::

### 一个 instruction stream 不够用

Lecture 2 的例子贯穿前两站：对 $N$ 个 float 各算一次 $\sin x$ 的 Taylor series 前几项，

$$\sin x\approx x-\frac{x^3}{3!}+\frac{x^5}{5!}-\frac{x^7}{7!}+\cdots$$

每个 element 的计算互不相干。编译成 scalar instruction 后，processor 一次处理一个 element：load、几次 multiply 和 add、store。

一个 core 想自己变快，只能在同一个 instruction stream 里找互不依赖的 instruction 同时做，这叫 instruction-level parallelism（ILP），能这样做的 core 叫 superscalar。可是 Taylor series 的每一项都要用上一项的结果，内层没有 ILP，一个能同时发两条 instruction 的 core 也只发得出一条。

Multi-core 的想法是把以前花在“让一个 stream 更快”（大 cache、out-of-order、branch prediction）上的 transistor 拿去多做几个更简单的 core。Lecture 2 的算法：简单 core 每个慢 25%，两个就是 $2\times0.75=1.5$ 倍。代价同样明显：一个不分工作的 program 只能用一个 core，而且这个 core 还慢了 25%，结果是 $0.75$ 倍。Parallelism 必须由 program 自己说出来，例如开一个 `std::thread` 算前一半，main thread 算后一半，最后 `join`。

### SIMD：一次 fetch，八个 ALU

再往前一步：一个 core 里 fetch 和 decode 一条 instruction 的电路很贵，ALU 很便宜。既然 $N$ 个 element 做的是同一串 operation，就让一条 instruction 同时驱动 8 个 ALU，每个 ALU 算一个 element。这叫 SIMD（single instruction, multiple data）。AVX2 的 register 是 256 bit，装 8 个 32-bit float，一条 `vmulps` 做 8 次 multiply；AVX-512 是 16 个；ARM 的 NEON 是 4 个。

把三样乘起来就是一块 CPU 的峰值。asst1 用的 myth 机器是 Intel Core i7-7700K（Kaby Lake），Lecture 2 的数是 4 个 core、每个 core 三个 8-wide SIMD ALU、4.2 GHz：

$$4\times3\times8\times4.2\times10^9\approx4.0\times10^{11}\ \text{FLOP/s}$$

一个只用一个 core、只发 scalar instruction、每个 clock 做一次 operation 的 program，最多用到其中的 $1/(4\times3\times8)=1/96$。

### Branch：两条路都要走

SIMD 的前提是 8 个 element 走同一串 instruction。代码里有 `if` 时，8 个 element 可能一半走这边、一半走那边。8 条 lane 只有一个 instruction stream，没有办法同时执行两条 branch，只能两条都执行，每条 branch 期间把不该走这条路的 lane 关掉（masked），它们的结果被丢弃。

::fig[cs149-simd] Lecture 2 的 masking 例子，x 的 8 个值是我取的，正好给出 slides 上的 T T F T F F F F。动起来时框一条一条往下走：每一拍只有深色的 lane 在算。

所有 lane 走同一串 instruction 叫 coherent execution；反之叫 divergent execution。前者是 SIMD 高效的必要条件，对 multi-core 则无所谓，因为每个 core 有自己的 instruction stream。

:::wrong 只有一条 lane 进了 if，其余 lane 已经跳过去了，不耽误时间
其余 7 条 lane 和这一条共用一个 instruction stream，它们只能被 mask 掉，陪着走完整个 then branch。设 then branch 有 100 条 instruction、else branch 是空的，8 条 lane 里只有 1 条为 true：这 100 条 instruction 每条占 8 个 lane slot，用上 1 个，这一段的 utilization 是 $100/800=12.5\%$，正好是峰值的 $1/8$，也就是 SIMD 一点都没帮上。这是 8-wide SIMD 上一个 `if` 能造成的最坏情况。
:::

### Stall：等 memory 的时候 core 在干什么

到目前为止假设 data 随要随到。实际上 load 一个不在 cache 里的数要等很久。Lecture 2 给的 Kaby Lake 数字（4 GHz 下的 cycle 数）：L1 约 4，L2 约 12，L3 约 38，DRAM 最好情况约 248。Cache 和 hardware prefetching 能减少等待（[CS2100 第 8 站](../courses/CS2100.html#cache)），但像 `y = A[x]` 这种 address 无法预测的 load 照样要等。

第三个想法是 multithreading：一个 core 里存几套 execution context（register、program counter），一个 thread 卡在 load 上，下一个 clock 就去执行另一个 thread 的 instruction。Memory latency 一点没变短，变的是 core 不再空等。

Lecture 2 的练习：每个 thread 反复做 3 条 arithmetic，然后一个要等 12 个 cycle 的 load。Core 每个 clock 发一条 instruction。

::fig[cs149-mthread] 一个 thread 时，15 个 cycle 里只有 3 个在 issue instruction；第二个 thread 填进第一个等待的空当；5 个 thread 刚好把 15 个 cycle 填满。

一个 thread 的周期是 $3+12=15$ 个 cycle，其中 3 个在算，utilization $3/15=20\%$。$n$ 个 thread 轮流，utilization 是 $\min(1,\,3n/15)$：2 个 40%，5 个 100%，第 6 个已经没有空当可填。一般地，要填满需要

$$n=1+\frac{\text{latency}}{\text{每次 load 之间的 compute}}=1+\frac{12}{3}=5$$

把每次 load 之间的 arithmetic 加到 6 条，$n=1+12/6=3$。每搬一次数做的计算越多，需要的 thread 越少。

代价是 context 要占芯片上的 storage：同样大小的 register file，可以存 16 个小 context（每个 thread 能用的 register 少，但能藏住很长的 latency），也可以存 4 个大 context。另一个代价是每个 thread 自己反而更晚做完，multithreading 换来的是 throughput，不是 latency。

把三个想法叠起来，program 要准备的独立工作量是乘出来的。Lecture 2 的虚构芯片：16 个 core，每个 8 条 SIMD lane、4 个 thread，要 $16\times8\times4=512$ 个独立的 work item 才能同时把 ALU 喂满又藏住 latency。NVIDIA V100 每个 SM 最多 64 个 warp、每个 warp 32 条 lane，一个 SM 同时容纳 $64\times32=2048$ 个 CUDA thread，80 个 SM 共 $163{,}840$ 个。GPU 把 multithreading 推到了极端，第 5 站再展开。

### Bandwidth：thread 再多也藏不住的情况

Multithreading 能藏住 latency 的前提是 memory 来得及送。Lecture 3 的思想实验：每个 thread 反复做“load 64 byte，然后两次 add”，memory 每个 clock 送 8 byte。一个 64-byte 的 load 要占 memory 8 个 clock，这 8 个 clock 里 core 只有 2 条 instruction 可做。Thread 再多，memory 已经 100% 在忙，ALU 的 utilization 停在 $2/8=25\%$。此时时间只由“要搬多少 byte”和“bandwidth 多大”决定，和 latency、thread 数都无关。这叫 bandwidth-bound。

Lecture 3 用 V100 算了一个 element-wise multiply `C[i] = A[i] * B[i]`：每次 multiply 要读两个、写一个 float，共 12 byte。V100 有 $80\times64=5120$ 个 fp32 ALU，按 slides 用的 1.6 GHz，全部喂满需要

$$5120\times12\ \text{byte}\times1.6\times10^9/\text{s}=9.8\times10^{13}\ \text{byte/s}=98\ \text{TB/s}$$

V100 的 HBM 是 900 GB/s，只够这个数的 $0.9\%$。GPU 仍然比 CPU 快，因为它的 bandwidth 也比 CPU 大一个数量级，但它的 ALU 绝大部分时间在等。

开头的 `saxpy` 是同一件事。$N=2\times10^7$，每个 element 做 2 次 floating-point operation、碰 3 个 float：

| | 量 | 按 myth 的峰值 | 时间下限 |
|---|---|---|---|
| compute | $2N=4\times10^7$ FLOP | $4.0\times10^{11}$ FLOP/s | 0.099 ms |
| memory | $3N\times4=2.4\times10^8$ byte | 38.4 GB/s | 6.25 ms |

Memory 那一行是 compute 的 63 倍。开 thread、开 SIMD 只缩短第一行。实际搬的 byte 比 $3N$ 个 float 还多一些，原因在第 6 站讲 write-allocate 时出现，A1 Program 5 会让你自己找。Arithmetic intensity 和 roofline 的完整画法见 [CS336 第 5 站](../courses/STANFORD-CS336.html#gpu)，[MIT 6.5940 第 1 站](../courses/MIT-6.5940.html#eff)从 energy 的角度讲了同一件事。

所以写高效的 parallel program 要满足三条（Lecture 2 的总结）：有足够多的独立工作喂满所有 ALU；同一批 work item 走同样的 instruction，SIMD 才不浪费；独立工作要比 ALU 多得多，core 才能在等 memory 时切换。再加 Lecture 3 的第四条：每搬一个 byte 要做足够多的计算，否则前三条都不起作用。

:::from
讲法跟 Stanford CS149 Fall 2025 的 [Lecture 2](https://gfxcourses.stanford.edu/cs149/fall25content/media/multicore1/02_basicarch.pdf) 和 [Lecture 3](https://gfxcourses.stanford.edu/cs149/fall25content/media/multicore2/03_multicore2-ispc_WueDBzT.pdf)：sinx 例子、$2\times0.75$ 的算法、masking 的 T T F T F F F F、3 条 arithmetic 加 12 cycle load 的 utilization、512 个 work item、V100 和 98 TB/s 都出自这两讲。读的是 WebFetch 抽出的文字摘要，slides 上的图没看到。“需要的 thread 数 $=1+\text{latency}/\text{compute}$”的写法、then branch 100 条 instruction 的例子、`saxpy` 那张表的计算是我加的；38.4 GB/s 是 i7-7700K 的规格值（Lecture 2 写作 38 GB/s），没有在 myth 上实测。
:::

## [ispc] ISPC：SPMD 的 abstraction 与 implementation

:::skip
能读一段 ISPC code，说出每个 program instance 处理哪些 element、哪里会变成 gather、`uniform` 和 `reduce_add` 在做什么，并说清 gang 和 task 的区别，就可以去第 3 站。快速路线必读，A1 的 Program 3、4、5 用的都是 ISPC。
:::

### 一个 gang：programCount 与 programIndex

手写 AVX intrinsics 能用上 SIMD，但 code 和机器的 vector 宽度绑死了。ISPC 换一种说法：你写的是一个 program instance 的 code，像写普通 C 一样；C code 调用一个 ISPC function 时，同时启动一组 program instance，叫一个 gang，它们全部跑完 function 才返回。每个 instance 有自己的 local variable，还能读两个内建的量：

- `programCount`：gang 里有几个 instance。对 AVX2 的 float 计算通常是 8。
- `programIndex`：自己是第几个，0 到 `programCount-1`。

Lecture 3 的 sinx：

```c
export void ispc_sinx(uniform int N, uniform int terms,
                      uniform float* x, uniform float* result) {
    for (uniform int i = 0; i < N; i += programCount) {
        int idx = i + programIndex;
        float value = x[idx];
        float numer = x[idx] * x[idx] * x[idx];
        uniform int denom = 6;   // 3!
        uniform int sign = -1;
        for (uniform int j = 1; j <= terms; j++) {
            value += sign * numer / denom;
            numer *= x[idx] * x[idx];
            denom *= (2*j+2) * (2*j+3);
            sign *= -1;
        }
        result[idx] = value;
    }
}
```

这段 code 描述的是 8 个 logical 的 instruction stream（这是 SPMD 这个 abstraction 的承诺）。ISPC compiler 的实现是把它们编成一个 instruction stream 的 8-wide SIMD instruction，instance $k$ 就是第 $k$ 条 lane。Abstraction 说“8 个 instance 并发”，implementation 是“一条 lane 一个 instance”；第 1 站的 masking 就是 implementation 处理 `if` 的办法。

### Interleaved 还是 blocked

上面那段 code 让 instance $k$ 处理 $k,\,k+8,\,k+16,\ldots$，叫 interleaved assignment。另一种自然的写法是 blocked：把 $N$ 切成 8 段，instance $k$ 处理第 $k$ 段，`start = programIndex * count`。两种分法每个 instance 的工作量一样，可是对 SIMD 差别很大。

::fig[cs149-gang] 32 个 float、8 个 instance。看第一次 load 时 8 条 lane 一起要的那 8 个 address。

Interleaved 时，一条 load instruction 里 8 条 lane 要的是相邻的 8 个 float，正好是一条 packed load（`vmovaps`，或者 intrinsics 里的 `_mm256_load_ps`）。Blocked 时，8 条 lane 要的 address 间隔 4 个 element，只能用 gather（`vgatherdps`），它逐个去取，慢得多。这和 multi-core 上的选择正好相反：给不同 core 分工作时，blocked 让每个 core 碰连续的 memory，往往更好。

### foreach：只说有哪些 iteration

上面的 code 自己决定了 instance 和 element 的对应关系。更常用的是 `foreach`：

```c
export void ispc_sinx_v2(uniform int N, uniform int terms,
                         uniform float* x, uniform float* result) {
    foreach (i = 0 ... N) {
        // 同样的 Taylor series，只是用 x[i]、result[i]
    }
}
```

`foreach` 只声明“整个 gang 一共要做这 $N$ 个 iteration，它们之间互不依赖”，怎么分给 instance 由 ISPC 决定：可以 interleaved，可以 blocked，也可以用一个 atomic counter 动态领取。前一种写法是 imperative 的（说怎么做），这一种是 declarative 的（只说做什么）。

“互不依赖”是你对 compiler 的承诺，compiler 不检查。Lecture 3 的反例是在 `foreach` 里写邻居：

```c
foreach (i = 0 ... N) {
    if (x[i] < 0) y[i-1] = x[i];
    else          y[i]   = x[i];
}
```

`x[i]` 为负、`x[i-1]` 为正时，iteration $i$ 和 $i-1$ 都写 `y[i-1]`。在 sequential 的 C 里，后写的赢；在 gang 里它们可能在同一条 instruction 里同时写，结果没有定义。

### uniform、varying 与 reduction

ISPC 里的 variable 默认是 varying，每个 instance 一份（对应一个 vector register）；`uniform` 表示所有 instance 共用一个值（对应一个 scalar register）。它主要是 optimization 的提示，帮 compiler 少用 vector register、少做 mask 运算。

求和是检验这两个概念的地方。Lecture 3 列了两个编不过的写法：

```c
uniform float sum = 0;
foreach (i = 0 ... N) sum += x[i];   // 错：varying 的值加进 uniform
```

```c
float sum = 0;
foreach (i = 0 ... N) sum += x[i];
return sum;                          // 错：C 只能接一个 float，这里有 8 个
```

正确的写法是让每个 instance 先在自己的 varying `partial` 里累加（不需要任何 communication），最后用跨 instance 的操作合成一个 uniform 的值：

```c
export uniform float sum(uniform int N, uniform float* x) {
    float partial = 0;
    foreach (i = 0 ... N) partial += x[i];
    return reduce_add(partial);
}
```

实现上，`partial` 是一个 8-wide 的 vector register，`foreach` 的循环体是一条 vector add，`reduce_add` 是最后一次 horizontal add，和手写 AVX 的结果一样。类似的跨 instance 操作还有 `reduce_min`、`broadcast(value, index)`（把一个 instance 的值发给所有人）、`rotate(value, offset)`（instance $i$ 拿到 instance $i+\text{offset}$ 的值）。8 个数的乘积可以用 `shift` 做 $\log_28=3$ 步得到。

### Task：把工作分到多个 core

一个 gang 是一个 instruction stream，只在一个 core 上跑。myth 有 4 个 core，只用 gang 最多用到四分之一。ISPC 的第二层是 task：`launch[n] f(...)` 创建 $n$ 个 task，每个 task 是一个 gang 要执行的 function，task 之间可以按任意顺序、在任意 core 上执行，`sync` 等它们全部结束。两层的分工是：gang 对应一个 core 里的 SIMD，task 对应多个 core。

:::wrong 一个 gang 的 8 个 program instance 是 8 个 thread，会被分到不同的 core 上
它们是同一个 core 上一条 instruction 的 8 条 lane。只调用一个 ISPC function、不用 `launch` 的 program，在 4 核 8-wide 的 myth 上 speedup 的上限是 8 而不是 32：$8$ 来自 SIMD，core 只用了 1 个。A1 Program 3 的 Mandelbrot 不加 `--tasks` 时实测到不了 8，原因是第 1 站的 divergence：同一个 gang 里相邻 pixel 的 iteration 次数不同（第 5 站的动图会看到具体数字），要等最慢的那条 lane。加上 task 之后，上限才变成 $8\times4=32$。
:::

:::from
讲法跟 [Lecture 3](https://gfxcourses.stanford.edu/cs149/fall25content/media/multicore2/03_multicore2-ispc_WueDBzT.pdf) 的后半：gang、programIndex、interleaved 与 blocked 的 packed load 和 gather、`foreach` 的三种可能实现、写邻居的反例、两个编不过的求和、`reduce_add`、task。读的是文字摘要，slides 上的 code 我按摘要重写，ISPC 语法对照了 asst1 README 里的 `sum` 和 `sum2`。“blocked 在 multi-core 上反而更好”的对比和 :::wrong 里的 speedup 上限是我加的。
:::

## [work] Work distribution 与 scheduling

:::skip
能从每块工作的 cost 算出一种分法的 speedup 上限，能说出 static、dynamic、work stealing 各在什么时候合适，能为 dynamic assignment 选 granularity，就可以去第 4 站。快速路线必读（Lecture 5），A1 Program 1 和 A2 都直接用到。
:::

### 3 个 thread 比 2 个还慢

回到开头的图。Mandelbrot 每个 pixel 要 iterate 到 $|z|>2$ 或者满 256 次；落在 set 里面的 pixel 每个都是 256 次，外面的几次就退出。默认 view 的 set 集中在图像中间的 row，所以每个 row 的 cost 差别很大。

Speedup 的上限由最慢的那个 thread 决定：如果最重的 thread 拿到总工作量的比例是 $s_{\max}$，其他 thread 早早做完也只能等它，

$$\text{speedup}\le\frac{1}{s_{\max}}$$

按 asst1 的参数把 1600 × 1200 个 pixel 的 iteration 次数全部算出来，按连续的 row 平分给 $T$ 个 thread：

| $T$ | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|
| 最重的 thread 的份额 | 50.1% | 60.5% | 40.5% | 39.8% | 30.3% | 28.9% | 24.3% |
| blocked 的 speedup 上限 | 2.00 | 1.65 | 2.47 | 2.52 | 3.30 | 3.46 | 4.11 |
| 按 row interleaved 的上限 | 2.00 | 3.00 | 4.00 | 4.99 | 5.98 | 6.98 | 7.98 |

$T=2$ 时上下两半对称，各一半。$T=3$ 时中间那块正好包住 set 最胖的部分，拿到 60.5%，于是 3 个 thread 的上限只有 $1/0.605=1.65$。$T=4$ 时中间两块各约 40%，上限 2.47。这些还是上限，实际再扣掉 thread 创建和 hyper-thread 共享 core 的损失。

最后一行的分法是 thread $t$ 拿第 $t,\,t+T,\,t+2T,\ldots$ 个 row。相邻的 row 工作量几乎一样，每个 thread 都均匀地拿到了轻的和重的部分。这是一种 static assignment：开始执行之前就定好谁做什么，运行时零开销。Static assignment 适用的条件是每块工作的 cost 可以预先知道，或者像这里一样，虽然不知道但在统计上被分匀了。

Lecture 5 用 Amdahl's law 的语言说同一件事：4 个 processor，P4 的工作是其他人的 2 倍，后一半时间里只有 P4 在算，相当于程序的一部分变成了 serial。Amdahl's law 的推导见 [CS249R 第 1 站](../courses/HARVARD-CS249R.html#env)。

Semi-static 的情形介于其间：cost 会变，但变得慢，例如 particle simulation 里 particle 慢慢聚集。程序每隔一段时间量一下各部分的 cost，重新分一次。

### Dynamic assignment 与 granularity

Cost 事先完全不知道时，只能边做边分。Lecture 5 的例子是对 1024 个数做 primality test，每个数的 cost 差很多。用一个 lock 保护的 counter，每个 thread 做完一个就去领下一个：

```c
int counter = 0;           // shared
std::mutex counter_lock;

void worker(int* x, bool* is_prime, int N) {
    while (true) {
        int i;
        { std::lock_guard<std::mutex> g(counter_lock); i = counter++; }
        if (i >= N) return;
        is_prime[i] = test_primality(x[i]);
    }
}
```

这样 load balance 最好，但每做一个数就进一次 critical section，1024 次。Critical section 一次只能一个 thread 进，test 本身越便宜，大家越是排队等 lock。改成一次领 `GRANULARITY = 10` 个，只要 $\lceil1024/10\rceil=103$ 次。

Granularity 的两头：task 越多越小，balance 越好；task 越少越大，overhead 越小。Lecture 5 的经验是 task 数要远多于 processor 数（Cilk 部分给的数是每个 execution unit 约 8 份独立工作，叫 parallel slack），但不要多到 overhead 占主导。

Task 的 cost 不一样时，顺序也有关系。16 个 task 里最长的那个如果最后才被领走，其他 thread 都做完了还要等它一整个 task 的时间。两个办法：把它拆小（它本身是 sequential 的就拆不了）；或者先分长的（需要能预估 cost）。

### Work stealing 与 Cilk

一个 shared counter 或 shared queue 在 thread 多了之后本身就成了 contention 的地方。改成每个 worker 一个 queue：自己产生的 task 放进自己的 queue，自己从里面取；空了就随机挑一个别人的 queue 偷一个。

Cilk 把这个机制藏在 fork-join 的语法后面：

```c
void quick_sort(int* begin, int* end) {
    if (end - begin <= PARALLEL_CUTOFF) {
        std::sort(begin, end);
    } else {
        int* middle = partition(begin, end);
        cilk_spawn quick_sort(begin, middle);   // 调用者不等它，继续往下
        quick_sort(middle + 1, end);
    }
}   // 函数结尾有一个隐含的 cilk_sync
```

`cilk_spawn` 说“这个调用可以和后面的 code 并行”，`cilk_sync` 说“等我 spawn 的所有调用结束”。Abstraction 不规定 spawn 出去的调用何时、在哪个 thread 上执行。`PARALLEL_CUTOFF` 以下改回 `std::sort`，因为对很短的区间，spawn 的开销比它带来的 parallelism 大。

Runtime 的设计要回答：spawn 的那一刻，当前 thread 先做 child（被 spawn 的调用）还是先做 continuation（spawn 后面的 code），另一半留给 thief？

- **Child stealing**：先做 continuation，把 child 放进 queue。一个 `for (i = 0; i < N; i++) cilk_spawn foo(i);` 会先把 $N$ 个 child 全部排进 queue，queue 长度是 $O(N)$。
- **Continuation stealing**（Cilk 的选择）：先做 child，把 continuation 放进 queue。同一个 loop，thread 执行 `foo(0)` 时 queue 里只有一个“从 $i=1$ 继续”的 continuation；没人偷的话，执行顺序和 sequential program 完全一样，stack 的深度也一样。

每个 worker 的 queue 是一个 deque：owner 在 bottom 一端 push 和 pop，thief 从 top 一端偷。Divide-and-conquer 里越靠 top 的 continuation 越早产生，代表的工作越大，偷一次能拿走一大块，偷的次数就少；两端分开也让 owner 和 thief 很少抢同一个元素。

`cilk_sync` 也不让 thread 干等。Runtime 为每个有 spawn 的 frame 记两个数：spawn 了几个、完成了几个。没有发生过 steal 时 `cilk_sync` 什么都不用做；发生过 steal 时，先到 sync 的 thread 不等，去偷别的工作，最后一个完成的 thread 接着执行 sync 之后的 code，这叫 greedy join，所以 sync 之后的 thread 未必是 spawn 之前的那个。

:::wrong 拆得越细越平衡，所以 dynamic assignment 的 granularity 越小越好
领一次 task 的开销是固定的，task 越小，开销所占的比例越大。上面的 primality test，GRANULARITY 从 10 降到 1，进 critical section 的次数从 103 涨到 1024；如果一次 test 只要几十个 ns，和一次有竞争的 lock 差不多贵，大部分时间就花在排队上。反过来，cost 均匀、可以预知的工作（例如 `saxpy`）根本不需要 dynamic assignment，static 分好之后运行时零开销。
:::

:::edge 多于 hardware thread 的 software thread
myth 有 4 个 core、每个 2 个 hyper-thread，共 8 个 execution context。开 16 个 thread 不会更快：OS 只能让它们轮流占这 8 个 context，多出来的只增加切换开销。而且同一个 core 上的两个 hyper-thread 共用 ALU，Mandelbrot 这种 compute-bound 的 program 从 4 个 thread 到 8 个 thread 收益远小于 2 倍。
:::

:::from
讲法跟 [Lecture 5](https://gfxcourses.stanford.edu/cs149/fall25content/media/perfopt1/05_progperf1.pdf)：static、semi-static、dynamic 三种 assignment，1024 个 primality test 和 GRANULARITY = 10，16 个 task 的长 task 问题，distributed queue，Cilk 的 quicksort、child-first、deque 的两端、block descriptor 和 greedy join 都出自这一讲的文字摘要。Mandelbrot 那张表是我用 asst1 `main.cpp` 的参数（1600 × 1200、`maxIterations = 256`、view 1 的范围）以 float 运算实际算的，这是工作量的上限，不是实测时间。Lecture 4（Parallelizing Code: An Example Thought Process）没有读。
:::

## [locality] Locality、communication 与 arithmetic intensity

:::skip
能写出 grid solver 两种分法的 communication-to-computation ratio，分得清 inherent 和 artifactual communication，能算出 fusion 前后的 arithmetic intensity，知道用哪几个 high-watermark 实验找瓶颈，就可以去第 5 站。快速路线必读（Lecture 6）。
:::

### 每次搬数据都是 communication

在 shared address space 里，任何 thread 都能直接读写任何 address，看起来没有“通信”这件事。Lecture 6 的观点是：只要 data 要从一个地方搬到另一个地方（从 memory 到 cache，从一个 core 的 cache 到另一个 core 的 cache，从一个 socket 到另一个 socket），就是 communication。Message passing 的 program（每个 thread 有私有的 address space，只能 `send`/`recv`）只是把它写明了而已。Kaby Lake 的 ring interconnect 从 core 到 L3 的峰值约 435 GB/s，前提是每个 core 访问离自己最近的那片 L3；一块芯片上的 memory access 已经有远近之分（NUMA），多 socket 时更明显。

### Inherent communication：grid solver 的两种分法

Lecture 6 的例子是一个 $N\times N$ 的 grid solver：每轮 iteration，每个 cell 更新为它和上下左右邻居的平均。把 grid 分给 $P$ 个 processor，每个 processor 要更新自己那块，但边上的 cell 要用到别人那块边上的值（ghost cell），每轮都得从邻居那里拿一次。

::fig[cs149-grid] $N=16$、$P=16$ 时两种分法下一个 processor 的工作（深色）和每轮要收的 ghost cell（浅色）。

**1D blocked**（按 row 切成 $P$ 条）：每个 processor 算 $N^2/P$ 个 cell，要收上下两条 row 共 $2N$ 个值，

$$\frac{\text{communication}}{\text{computation}}=\frac{2N}{N^2/P}=\frac{2P}{N}$$

**2D blocked**（切成 $\sqrt P\times\sqrt P$ 个方块，每块边长 $N/\sqrt P$）：计算量同样是 $N^2/P$，要收四条边共 $4N/\sqrt P$ 个值，

$$\frac{\text{communication}}{\text{computation}}=\frac{4N/\sqrt P}{N^2/P}=\frac{4\sqrt P}{N}$$

图里 $N=16$、$P=16$：1D 是 $2\times16/16=2$，2D 是 $4\times4/16=1$。换成 $N=1024$：$P=16$ 时 1D 是 $32/1024=0.031$，2D 是 $16/1024=0.016$；$P=64$ 时 1D 涨到 $128/1024=0.125$，2D 只到 $32/1024=0.031$。Processor 越多，2D 的优势越大，因为它的 communication 只随 $\sqrt P$ 增长。

这个比值的倒数就是 arithmetic intensity：每搬一个值做多少计算。它是 assignment 本身决定的，叫 inherent communication。按 row interleaved 分（processor $p$ 拿第 $p,\,p+P,\ldots$ 行）在第 3 站对 Mandelbrot 很好，在这里却最差：每一行的上下邻居都属于别人，每算 $N$ 个 cell 要收 $2N$ 个值，比值是 2，和 $N$、$P$ 都无关。

### Artifactual communication

Assignment 定了之后，实现方式还会额外搬很多不需要的 data，叫 artifactual communication。Lecture 6 举的几种：

- Memory 以 cache line 为单位搬。读一个 4-byte 的 float 会搬进整条 64-byte 的 line，如果 line 里别的数用不上，就多搬了 16 倍。按 column 走一个 row-major 的 array 就是这种情形。
- 把一整条 line 全部覆盖写掉，硬件也要先把它从 memory 读进来（write-allocate，第 6 站），搬运量翻倍。
- Cache 太小，算到后面时前面用过的数已经被 evict，再用时要重新读（capacity miss）。

Lecture 6 用 grid solver 演示最后一种：cache line 4 个 element、cache 能放 24 个 element，按 row-major 顺序扫，一个 cell 的上一行邻居要隔一整行才再被用到，早已被 evict，平均每 4 个 output 要读 3 条 line。把 iteration 顺序改成按小块走（blocking），同一批 line 还在 cache 里时就被反复用到，变成每 6 个 output 读 2 条 line。Blocking 的完整写法见 [CS249R 第 3 站](../courses/HARVARD-CS249R.html#kernel)，GPU 上的 tiling 见 [CS336 第 5 站](../courses/STANFORD-CS336.html#gpu)。

### Fusion：中间结果不进 memory

Lecture 6 的另一个例子是三步 element-wise 的运算 $E=D+(A+B)\times C$，按 library 的习惯分三次调用：

```c
void add(int n, float* A, float* B, float* C) { for (int i=0; i<n; i++) C[i] = A[i] + B[i]; }
void mul(int n, float* A, float* B, float* C) { for (int i=0; i<n; i++) C[i] = A[i] * B[i]; }

add(n, A, B, tmp1);
mul(n, tmp1, C, tmp2);
add(n, tmp2, D, E);
```

每个 loop 每个 element 读 2 个、写 1 个、算 1 次，arithmetic intensity 是 $1/3$（每次 memory operation 做的 math）。三个 loop 合成一个：

```c
for (int i=0; i<n; i++) E[i] = D[i] + (A[i] + B[i]) * C[i];
```

每个 element 读 4 个、写 1 个、算 3 次，intensity 是 $3/5$。`tmp1`、`tmp2` 只活在 register 里，从来不进 memory。对 bandwidth-bound 的运算，memory operation 从 9 次降到 5 次，时间就按这个比例降。

### Contention 与 overlap

同一个资源在短时间里被很多人请求，就会排队，叫 contention。Lecture 6 的例子是 office hours：5 个学生同时到，一个一个来，最后一个人总共花了 23 分钟；改成预约，每个人约 10 分钟。程序里的 shared counter、shared queue、一个被所有 thread 写的变量都是这种 hot spot。办法是复制资源（每个 thread 一个 queue，空了再偷，第 3 站）、用更细的 lock，或者把访问错开。把结果汇总给 thread 0 时，所有人直接发给它（flat）延迟最低但有 hot spot，排成一棵树逐层汇总没有 hot spot 但多几层延迟。

还剩的 communication 能不能藏起来，取决于有没有别的事可做：asynchronous 的 `send`、prefetch、multithreading 都是同一个思路，前提是 concurrency 多于 execution unit。

### 先量再改

Lecture 6 最后给的是一套确定瓶颈的实验，每个都给出一个“最多能好多少”的上限：

- 只加 math instruction，不改 memory access：时间线性增长，说明受 instruction rate 限制。
- 把所有 array access 改成 `A[0]`：得到的时间是 locality 完美时的下限。
- 去掉 lock 和 atomic：得到 synchronization 不花时间时的下限。
- 去掉大部分 math、保留 load：时间几乎不降，说明是 memory-bound。

衡量 speedup 时，分母要用最好的 sequential program，而不是 parallel 版本在一个 core 上跑。Problem size 也会骗人：太小时 communication 占主导，加 processor 也不快；太大时一台小机器放不下 working set，大机器放得下，就会出现超过 $P$ 倍的 super-linear speedup。

:::wrong Shared memory 的 program 没有 communication，communication 是 message passing 才有的事
Communication 是 data 的搬运，不管 program 怎么写都要发生。按 column 遍历一个 row-major 的 `float` array，每读一个 4-byte 的数要搬一条 64-byte 的 line，下一次用到这条 line 时它很可能已经被 evict，等于每个数搬 16 倍的量，program 里一个 `send` 都没有。开头第三次失败也是：8 个 thread 各写各的 counter，program 里没有任何 shared data，cache line 却在 core 之间来回搬，时间是 padding 之后的 3 倍（第 6 站）。
:::

:::from
讲法跟 [Lecture 6](https://gfxcourses.stanford.edu/cs149/fall25content/media/perfopt2/06_progperf2.pdf)：communication 的广义定义、grid solver 的 blocked 与 2D blocked、inherent 与 artifactual、4 元素 line 和 24 元素 cache 的 blocking 例子、add/mul 的 fusion（1/3 与 3/5）、office hours、high-watermark 实验、super-linear speedup，都来自这一讲的文字摘要。2D blocked 的 $4N/\sqrt P$ 在摘要里是乱码，按 2D 分块的几何重新推导；$N=1024$ 的几组数和 interleaved 在这里比值为 2 的分析是我算的。
:::

## [gpu] GPU 与 CUDA programming model

:::skip
能写出 CUDA kernel 的 index 计算和边界检查，能用 shared memory 和 `__syncthreads` 让一个 block 共享 input，能算出一个 SM 上同时放得下几个 block，数得出一个 warp 的 divergence 损失，能手算 work-efficient scan 并用它做 `find_repeats`，就可以去第 6 站。快速路线必读（Lecture 7、8），A3 全部建立在这一站。
:::

### Grid、block、thread

CUDA 的 program 分两部分：host（CPU）上的普通 code，和 device（GPU）上的 kernel。Kernel 用 `__global__` 标记，launch 时创建一个 grid，grid 由很多 thread block 组成，每个 block 由很多 thread 组成，每个 thread 执行同一个 kernel function，和 ISPC 的 instance 一样是 SPMD。

Lecture 7 的例子：两个 $12\times6$ 的 matrix 相加。

```c
const int Nx = 12, Ny = 6;
dim3 threadsPerBlock(4, 3);
dim3 numBlocks(Nx / threadsPerBlock.x, Ny / threadsPerBlock.y);   // (3, 2)
matrixAdd<<<numBlocks, threadsPerBlock>>>(A, B, C);

__global__ void matrixAdd(float A[Ny][Nx], float B[Ny][Nx], float C[Ny][Nx]) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    int j = blockIdx.y * blockDim.y + threadIdx.y;
    C[j][i] = A[j][i] + B[j][i];
}
```

每个 block 是 $4\times3=12$ 个 thread，一共 $3\times2=6$ 个 block、72 个 thread，正好一个 element 一个。$N$ 不是 block 大小的整数倍时，block 数向上取整 `(N + tpb - 1) / tpb`，kernel 里加 `if (i < Nx && j < Ny)`，多出来的 thread 什么都不做。

Host 和 device 的 memory 是分开的 address space：`cudaMalloc` 在 device 上分配，`cudaMemcpy` 在两边之间复制。Device 上又分三层：每个 thread 私有的 local memory、每个 block 共享的 shared memory（在 SM 上，很快、很小）、所有 thread 都能访问的 global memory（HBM）。

### Shared memory 与 __syncthreads：1D convolution

Lecture 7 的 kernel 算 3 点平均：`output[i] = (input[i] + input[i+1] + input[i+2]) / 3`。最直接的写法每个 thread 从 global memory 读 3 个数，一个 128 thread 的 block 读 $128\times3=384$ 次，其中相邻 thread 读的大部分是同一批数。改成整个 block 先合作把要用的 130 个 input 搬进 shared memory，再各自从 shared memory 读 3 个：

```c
#define THREADS_PER_BLK 128

__global__ void convolve(int N, float* input, float* output) {
    __shared__ float support[THREADS_PER_BLK + 2];
    int index = blockIdx.x * blockDim.x + threadIdx.x;

    support[threadIdx.x] = input[index];
    if (threadIdx.x < 2)
        support[THREADS_PER_BLK + threadIdx.x] = input[index + THREADS_PER_BLK];

    __syncthreads();   // 全部搬完，才开始读

    float result = 0.0f;
    for (int i = 0; i < 3; i++) result += support[threadIdx.x + i];
    output[index] = result / 3.f;
}
```

Global load 从 384 次降到 130 次。`__syncthreads()` 是 block 内所有 thread 的 barrier：没有它，thread 5 可能在 thread 6 把 `input[index+1]` 写进 `support[6]` 之前就去读了。

::fig[cs149-conv] 上半是这个 block 的 data：130 个 input 进 shared memory，128 个 output 各读 3 个。下半是 Lecture 7 那个虚构 GPU core 的资源，看它同时能放下几个这样的 block。

### Block 怎样落到 SM 上

Block 是调度的单位。GPU 开始执行一个 block 时，一次性给它预留所需的资源（warp 的 execution context、register、shared memory），block 的所有 thread 结束才释放。所以一个 SM 上能同时放几个 block，取决于哪一样资源先用完。

Lecture 7 的虚构 core：12 个 warp 的 context（384 个 thread）、1.5 KB shared memory。上面的 `convolve` 每个 block 128 个 thread（4 个 warp）、$130\times4=520$ byte shared memory。按 thread 数可以放 $384/128=3$ 个；按 shared memory，$3\times520=1560>1536$，只能放 2 个。剩下的 4 个 warp context 空着，第 3 个 block 要等前面某个 block 结束。

真实的 V100（Lecture 7 的数字）：80 个 SM，每个 SM 4 个 sub-core，每个 sub-core 16 个 fp32 multiply-add ALU，共 $80\times4\times16=5120$ 个；1.245 GHz 下 multiply-add 算 2 次，峰值 $5120\times2\times1.245\times10^9=12.7$ TFLOP/s。每个 SM 最多 64 个 warp、256 KB register file、128 KB 的 shared memory 与 L1；chip 上 6 MB L2、16 GB HBM、900 GB/s。

Block 可以按任意顺序、在任意 SM 上执行，programming model 假设 block 之间没有依赖。这个限制换来的是同一个 program 能在 SM 数不同的 GPU 上跑。Block 之间仍然可以用 atomic 操作 global memory，例如每个 thread 对自己读到的值 `atomicAdd(&counts[A[i]], 1)` 求 histogram：atomic 只保证 mutual exclusion，不要求哪个 block 先跑。

:::wrong 让 block 1 spin 等 block 0 写一个 global flag，就能在 block 之间同步
```c
__global__ void bad(int* flag) {
    if (blockIdx.x == 0) { /* ...做完一些事... */ *flag = 1; }
    else                 { while (*flag == 0) { } }   // 等 block 0
}
```
Programming model 不保证这两个 block 同时在跑。在一个一次只能放一个 block 的 GPU 上（或者 block 1 先被调度、占满了资源），block 1 永远 spin，block 0 永远上不了 SM，程序 deadlock。Lecture 7 里的 persistent thread 写法（只 launch $80\times(32\times64/128)=1280$ 个 block 正好填满 V100，再让 block 自己从 global counter 领工作）同样依赖“所有 block 同时在跑”，这是对具体硬件的假设，model 本身不承诺。
:::

### Warp 与 divergence

一个 SM 不是一条条 thread 地执行。连续的 32 个 thread 组成一个 warp，warp 共用一个 instruction stream，在 SIMD 的 ALU 上执行；一个 128 thread 的 block 是 4 个 warp。CUDA 让你按 scalar 的 thread 写 code，硬件在运行时把同一个 warp 里走同一条 instruction 的 thread 一起执行，这叫 SIMT。它和第 1 站的 SIMD 是同一个硬件，只是 masking 由硬件动态做，不由 compiler 静态做。

Warp 里的 thread 走了不同的路，代价和第 1 站一样。Loop 次数不同是最常见的情形：

::fig[cs149-warp] 一个 thread 算一个 Mandelbrot pixel。动起来时红线是 warp 已经发了多少轮 loop：每条 lane 到了自己的次数就退出，变灰，但 warp 要一直走到最慢那条的 84 次。

这 32 个 pixel 的 iteration 次数从 11 到 84，总共 1007 次。Warp 发出 84 轮，每轮 32 条 lane，utilization $1007/(32\times84)=37.5\%$。这正是 A1 里 ISPC 版 Mandelbrot 到不了 8 倍的原因，GPU 上同样存在，只是宽度从 8 变成 32。

### Data-parallel thinking：scan

GPU 要 $10^5$ 个以上的独立 work item 才喂得饱。Lecture 8 的回答是把算法写成对整个 sequence 的操作：map（对每个 element 独立做一件事）、fold（用 associative 的 operator 合成一个值）、scan、gather/scatter、sort。这些 primitive 都有高效的 parallel 实现，只要 program 只用它们，就自动 parallel。

Scan（prefix sum）是其中最有用的。Inclusive scan 第 $i$ 个输出是前 $i+1$ 个的和：$[3,8,4,6,3,9,2,8]$ 得 $[3,11,15,21,24,33,35,43]$；exclusive scan 不含自己：$[0,3,11,15,21,24,33,35]$。

Sequential 的 scan 是一个 loop，$N-1$ 次加法，看起来每一步都依赖上一步。最直接的 parallel 版本：第 $k$ 轮每个位置加上它左边 $2^k$ 处的值，$\log_2N$ 轮之后完成。它的 span（最长依赖链）只有 $O(\log N)$，但每轮都要做接近 $N$ 次加法，总 work 是 $O(N\log N)$。$N=2^{20}$ 时是 $19N+1\approx1.99\times10^7$ 次，比 sequential 多 19 倍。

Work-efficient 的版本分两段，A3 的 pseudocode 就是它：

```c
// upsweep：每层把左半块的和加到右半块的最后一个位置
for (int two_d = 1; two_d <= N/2; two_d *= 2) {
    int two_dplus1 = 2 * two_d;
    parallel_for (int i = 0; i < N; i += two_dplus1)
        output[i+two_dplus1-1] += output[i+two_d-1];
}
output[N-1] = 0;
// downsweep：每层左边拿右边的旧值，右边加上左边的旧值
for (int two_d = N/2; two_d >= 1; two_d /= 2) {
    int two_dplus1 = 2 * two_d;
    parallel_for (int i = 0; i < N; i += two_dplus1) {
        int t = output[i+two_d-1];
        output[i+two_d-1] = output[i+two_dplus1-1];
        output[i+two_dplus1-1] += t;
    }
}
```

::fig[cs149-scan] 在 Lecture 8 的那 8 个数上逐层执行，每层深色的是被写的位置，灰线是读的来源。

Upsweep 结束时最后一个位置是总和 43，中间那些位置是各个子树的和（第 4 个位置是前 4 个的和 21）。Downsweep 从根往下，把“左边所有 element 的和”一层层传给每个位置。两段各 $N-1$ 次加法，总 work $2(N-1)$，$N=2^{20}$ 时约 $2.1\times10^6$ 次，span 仍是 $O(\log N)$。

Work-efficient 并不总是更好。Lecture 8 指出，在一个 32-wide 的 warp 里做 scan，反而用 $N\log N$ 的版本：work-efficient 版本 instruction 多一倍以上，而且越往上层活跃的 lane 越少。大 array 分层做：每个 warp 内 scan，每个 block 内合并各 warp 的结果，最后再用一个 kernel 把每个 block 的 base 加回去。Lecture 8 还给了两核 CPU 的做法：每个 core 先 scan 自己那一半，第二半整体加上第一半的总和，总 work 约 $1.5N$。

**用 scan 做 stream compaction。** A3 的 `find_repeats`：给定 $A$，输出所有满足 $A[i]=A[i+1]$ 的 $i$。输入 $\{1,2,2,1,1,1,3,5,3,3\}$，答案是 $\{1,3,4,8\}$。每个 thread 只看自己的 $i$，难处在于它不知道自己的结果该写到输出的第几个位置。三步：

| $i$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|---|
| $A[i]$ | 1 | 2 | 2 | 1 | 1 | 1 | 3 | 5 | 3 | 3 |
| map：flag $=[A[i]=A[i+1]]$ | 0 | 1 | 0 | 1 | 1 | 0 | 0 | 0 | 1 | 0 |
| exclusive scan of flag | 0 | 0 | 1 | 1 | 2 | 3 | 3 | 3 | 3 | 4 |

flag 为 1 的 thread 把 $i$ 写到 `out[scan[i]]`：$i=1$ 写到位置 0，$i=3$ 写到 1，$i=4$ 写到 2，$i=8$ 写到 3。输出的长度是最后一个 scan 值加最后一个 flag，$4+0=4$。没有一个 lock，也没有一个 atomic。

同样的思路，Lecture 8 用来做 sparse matrix-vector multiply（gather 取 $x$、map 相乘、segmented scan 按 row 求和）和 particle binning：一百万个 particle 放进 16 个 cell，不给每个 cell 配 lock，改为 map 出每个 particle 的 cell ID、按 cell ID sort、再找每个 cell 的起止位置。代价是多遍扫描 data，所以这些写法本身容易变成 bandwidth-bound。

:::from
讲法跟 [Lecture 7](https://gfxcourses.stanford.edu/cs149/fall25content/media/gpuarch/07_gpuarch.pdf) 和 [Lecture 8](https://gfxcourses.stanford.edu/cs149/fall25content/media/dataparallel/08_dataparallel.pdf)：$12\times6$ 的 matrix add、`convolve` 的 384 与 130、虚构 core 的 384 个 thread 和 1.5 KB、V100 的数字、block 之间的 deadlock、persistent thread 的 1280、map/fold/scan 的 $[3,8,4,6,3,9,2,8]$、warp 内选 $N\log N$ 版本、两核的 $1.5N$、particle binning 都出自这两讲的文字摘要；scan 的 code 和 `find_repeats` 的例子取自 asst3 README。Warp 动图的 32 个 pixel 是我按 asst1 的参数从 view 1 第 225 行、第 800 到 831 个 pixel 算出来的；scan 各层的数值、$19N+1$ 的计算、`find_repeats` 的那张表是我算的。
:::

## [coherence] Cache coherence 与 memory consistency

:::skip
能对一串 read/write 走一遍 MSI、说出 MESI 的 E state 省了什么，能认出并修好 false sharing，能判断一个 litmus test 在 SC 和 TSO 下允许哪些结果，就可以去第 7 站。快速路线可以跳过（Lecture 14、15），代价是第 7 站和 A2 的同步问题会讲不清为什么。
:::

### 两个 cache 里的同一个 address

每个 core 有自己的 L1、L2，同一个 address 可以同时在几个 cache 里各有一份 copy。Lecture 14 的例子：write-back cache，`x` 一开始在 memory 里是 0。P1 写 `x = 1`，新值只留在 P1 的 cache 里，标成 dirty，memory 里还是 0；这时 P2 读 `x`，从 memory 读到 0。直到某次 P1 读别的东西把这条 line evict，1 才写回 memory。

这不是 mutual exclusion 的问题，加 lock 解决不了：P1 和 P2 根本没有同时碰 `x`，问题出在 data 被复制了。要的性质是：读一个 address，得到的是任何 processor 最后一次写进它的值。精确的定义是，对每一个 address，存在一个所有 processor 对它的 operation 的 serial order，使得每个 processor 自己的 operation 在其中保持 program order，并且每次 read 返回这个 order 里在它之前最后一次 write 的值。

实现上常用的两条 invariant：任何时刻，一个 address 要么只有一个 processor 可以读写它（read-write epoch），要么有任意多个 processor 只读它（read-only epoch），这叫 single-writer, multiple-reader（SWMR）；每个 epoch 开始时的值等于上一个 read-write epoch 结束时的值。

### Snooping 与 MSI

最简单的实现是所有 cache 挂在一条 bus 上，每个 cache controller 既响应自己 processor 的 read/write，也监听（snoop）bus 上别人的请求。Write-through 的 cache 很好办：每次写都上 bus、写进 memory，别的 cache 听到就把自己的 copy invalidate。代价是每次写都要占 memory bandwidth。

Write-back 的 cache 把写留在本地，于是要记录“这条 line 我独占、而且改过”。MSI protocol 给每条 line 三个 state：

- **M**（Modified）：只有这个 cache 有，而且改过，memory 里的是旧值。
- **S**（Shared）：一个或多个 cache 有，和 memory 一致，只能读。
- **I**（Invalid）：没有，或者已经作废。

Processor 发出的是 PrRd、PrWr；bus 上的 transaction 有三种：BusRd（要一份 copy 来读）、BusRdX（要一份 copy 来写，别人的都要作废）、BusWB（把 dirty 的 line 写回）。

::fig[cs149-msi] Lecture 14 的五步 trace，值是我加的。动起来时每一步上面显示各 cache 的 state、bus 上的 transaction 和 data 的来源，下面的 state diagram 里亮起的是这一步走过的 transition。

逐步看：

| 步 | 操作 | P1 | P2 | P3 | bus | data 来自 |
|---|---|---|---|---|---|---|
| 1 | P1 read x | S | – | – | BusRd | memory |
| 2 | P3 read x | S | – | S | BusRd | memory |
| 3 | P3 write x | I | – | M | BusRdX | memory |
| 4 | P1 read x | S | – | S | BusRd | P3 的 cache |
| 5 | P2 write x | I | M | I | BusRdX | memory |

第 3 步 P3 手里已经有 S 的 copy，但 S 不能写，必须发 BusRdX 升级到 M；P1 听到 BusRdX，S 变 I。第 4 步 P1 发 BusRd，P3 听到之后必须把它 dirty 的值送出来（BusWB，memory 同时更新），自己降到 S。降到 S 而不是 I，是赌 P3 之后还会读：留着 S 下次读不用再上 bus。第 5 步 P2 的 BusRdX 让所有其他 copy 作废。

### MESI：读完再写，不必上两次 bus

MSI 有一个常见的浪费：一个 thread 读一个变量、再写它（例如 `x = x + 1`），而别的 core 根本没有这条 line。读的时候 I→S 一次 BusRd，写的时候 S→M 又一次 BusRdX，两次 bus transaction，第二次纯粹是为了确认“没有别人”。

MESI 加一个 state **E**（Exclusive clean）：只有我有，没改过。PrRd 时如果没有别的 cache 声明自己有这条 line，直接进 E；之后 PrWr 时 E→M 不上 bus，因为已经知道没有别的 copy 需要作废。读完再写变成一次 transaction。E 听到 BusRd 降到 S，听到 BusRdX 变 I。

### Directory：不广播

Snooping 要求每个 coherence 请求广播给所有 cache，core 一多，bus 先撑不住。Directory 的办法是为每条 line 记下“哪些 cache 有它”，只给有关的 cache 发点对点消息。Lecture 14 的例子是 Core i7：L3 是 inclusive 的（L2 里的每条 line 在 L3 里都有），L3 的每个 entry 记下哪些 core 的 L2 有这条 line，L3 本身就是 directory 和 serialization point，core 之间是一个 ring 而不是 bus。

这些都会出现在 latency 里。Lecture 14 给的 Xeon 5500 数字：

| data 在哪 | latency |
|---|---|
| L1 hit | 约 4 cycle |
| L2 hit | 约 10 cycle |
| L3 hit，别的 core 没有 | 约 40 cycle |
| L3 hit，别的 core 有 S 的 copy | 约 65 cycle |
| L3 hit，别的 core 改过（M） | 约 75 cycle |
| 本地 DRAM | 约 120 cycle |
| 另一个 socket 的 DRAM | 约 400 cycle |

### False sharing

Coherence 的单位是 cache line，不是 variable。两个 core 写不同的 variable，只要它们落在同一条 line 上，protocol 就把它们当成在写同一个东西。

::fig[cs149-falseshare] 开头第三次失败。上面：8 个 `int` counter 挤在一条 64-byte 的 line 里；下面：padding 之后各占一条。

Core 0 写 `c0` 需要这条 line 在自己这里是 M，于是发 BusRdX，core 1 的 copy 变 I；core 1 接着写 `c1`，又发 BusRdX 把 line 抢回去。每次写都是一次 coherence miss，按上表约 75 cycle 而不是 4 cycle。两个 thread 从来没有共享任何 data，这是纯粹的 artifactual communication（第 4 站）。修法是让每个 thread 的 data 独占一条 line：

```c
struct PerThreadState {
    int myPerThreadCounter;
    char padding[CACHE_LINE_SIZE - sizeof(int)];
};
PerThreadState myPerThreadCounter[NUM_THREADS];
```

Lecture 14 的实测：8 个 thread、4 核，挤在一起 14.2 s，padding 之后 4.7 s，快了 3 倍。Line 越大，false sharing 越容易发生，这是 cache line 不能无限加大的原因之一。

**Write-allocate。** Lecture 14 也写了 write-back cache 在 write miss 时做什么：选一个位置（如果那里有 dirty 的 line 先写回），把整条 line 从 memory 读进来，改写其中被写的那几个 byte，标成 dirty。只写不读的 array 因此也要先读一遍。

### Memory consistency：不同 address 之间的顺序

Coherence 只管同一个 address。另一个问题是：一个 processor 对不同 address 的 operation，在别的 processor 看来是什么顺序？这是 memory consistency model 规定的。一个 processor 的 program order 里有四种先后：W→R、R→R、R→W、W→W（前一个 operation 对后一个 address 不同的 operation）。

Sequential consistency（SC）保持全部四种：所有 processor 的 operation 好像被排成一个全局的序列，每个 processor 的 operation 在里面按 program order 出现。Lecture 15 的 litmus test，一开始 A = B = 0：

```
P0:  A = 1;  r1 = B;
P1:  B = 1;  r2 = A;
```

SC 下按 program order 交错的方式有 6 种：P0 两条全在前，得 $(r_1,r_2)=(0,1)$；P1 两条全在前，得 $(1,0)$；其余 4 种两个 write 都在两个 read 之前，得 $(1,1)$。$(0,0)$ 不可能：要 $r_1=0$，P0 的 read 必须排在 `B = 1` 之前，而 P1 的 `B = 1` 又在 `r2 = A` 之前，于是 P0 的 `A = 1` 早于 `r2 = A`，$r_2=1$。

可是真实的 processor 会给出 $(0,0)$。写一个不在 cache 里的 address 要等很久，processor 把 write 放进 write buffer 就继续执行后面的 read，read 不必等前面的 write 对别人可见。

::fig[cs149-litmus] 两个 write 都还停在各自的 write buffer 里，两个 read 已经从 memory 读到了旧值。

这就是放松了 W→R：Total Store Order（TSO），x86 实现的大致是它。Processor Consistency（PC）与之类似。Partial Store Order（PSO）再放松 W→W，于是 Lecture 15 的另一个例子会出错：

```c
// Thread 1          // Thread 2
A = 1;               while (flag == 0) { }
flag = 1;            print(A);
```

在 SC 和 TSO 下 Thread 2 一定打印 1；在 PSO 下 `flag = 1` 可能先于 `A = 1` 对 Thread 2 可见，打印 0。Weak ordering 和 release consistency 把四种都放松，顺序全靠显式的 synchronization。

需要某个顺序时用 fence：fence 之前的所有 memory operation 完成之后，之后的才能开始。x86 有 `lfence`、`sfence`、`mfence`。Fence 很贵，所以只放在必须的地方。

程序员一般不直接写 fence。两个 operation 访问同一个 address、至少一个是 write、又没有被 synchronization 排序，叫 data race。不含 data race 的 program（data-race-free）在 relaxed 的硬件上也表现得和 SC 一样：C11、C++11 和 Java 5 之后的 memory model 都这样保证，前提是 synchronization 通过 library 的 lock、`std::atomic` 等完成，它们内部放好了 fence。

:::wrong 有了 cache coherence，所有 processor 看到的 memory operation 顺序就一致了
上面的 litmus test 在 coherent 的机器上照样得到 $(0,0)$。Coherence 只保证同一个 address 上的 operation 有一个大家同意的顺序：对 A 来说是“P1 读到 0，然后 P0 的写生效”，对 B 来说是“P0 读到 0，然后 P1 的写生效”，每个 address 单独看都没有矛盾。矛盾只在把 A 和 B 放到一起看时出现，而那是 consistency model 管的事。在 x86 上要禁止 $(0,0)$，需要在每个 processor 的 write 和 read 之间放 `mfence`。
:::

:::from
讲法跟 [Lecture 14](https://gfxcourses.stanford.edu/cs149/fall25content/media/cachecoherence/14_coherence.pdf) 和 [Lecture 15](https://gfxcourses.stanford.edu/cs149/fall25content/media/sync_consistency/15_consistency.pdf)：coherence 的问题、定义、SWMR、write-through invalidation、MSI 的 state 和五步 trace、M→S 的理由、MESI、Core i7 的 directory、latency 表、false sharing 的 14.2 s 和 4.7 s、write-allocate 的四步，consistency 的四种 ordering、litmus test、write buffer、TSO/PC/PSO/WO/RC、fence、data-race-free，都出自文字摘要。摘要里 MESI 的 diagram 文字有乱码，E state 的 transition 按标准的 MESI 补齐。MSI trace 里 x 的具体值、litmus test 6 种交错的枚举（用 code 算过）和 $(0,0)$ 不可能的论证、:::wrong 的写法是我加的。
:::

## [sync] Synchronization：lock 与 lock-free

:::skip
能说出 test-and-set lock 在等待时产生什么 bus traffic、test-and-test-and-set 和 ticket lock 各省了什么，能用 CAS 写一个 lock-free stack 并说出 ABA problem，能用 condition variable 写一个不 spin 的 worker，就读完了这一站。快速路线可以跳过（Lecture 15、16），但 A2 的 Part A 第 3 步和 Part B 都要用到最后一节。
:::

### 先把词说清楚

Lecture 16 先定义三种“没有进展”：

- **Deadlock**：每个 operation 都拿着别人需要的资源，等别人放手，谁也动不了。要同时满足四个条件：mutual exclusion、hold-and-wait、no preemption、circular wait。
- **Livelock**：thread 都在跑（典型的是不停 abort、retry），但没有有效进展。
- **Starvation**：整体在进展，但某些 thread 一直轮不到。这是 fairness 的问题。

### Lock 要靠 atomic instruction

用普通的 load 和 store 写一个 lock 是错的：

```c
void lock(int* l) {
    while (*l != 0) { }   // 等它变成 0
    *l = 1;               // 拿到
}
```

两个 thread 可能同时读到 0，都以为自己拿到了。“读、判断、写”必须是一个 atomic 的整体。硬件提供这样的 instruction，最简单的是 test-and-set：atomically 把一个位置置 1 并返回旧值。

```c
void lock(int* l)   { while (test_and_set(l) == 1) { } }
void unlock(int* l) { *l = 0; }
```

### Test-and-set 在 coherence 上的代价

把第 6 站的 MSI 套上去。Test-and-set 是一个 write，每执行一次都要把 line 拿到 M，也就是一次 BusRdX。一个 thread 拿着 lock 时，其余 $P-1$ 个 waiting 的 thread 每个都在不停地发 BusRdX，line 在它们之间来回搬，每次都让别人的 copy 作废。Lock 的持有者想 `unlock` 也要抢这条 line，还会被 bus 上的 traffic 拖慢。Uncontended 时它 latency 最低，但 thread 多了之后 scale 很差，也不 fair。

**Test-and-test-and-set。** 等待时先只读：

```c
void lock(volatile int* l) {
    while (true) {
        while (*l != 0) { }                 // 在自己 cache 的 S copy 上 spin，不上 bus
        if (test_and_set(l) == 0) return;   // 看上去空了，才真的去抢
    }
}
```

等待期间每个 waiting thread 的 cache 里都是 S 的 copy，读不产生 bus traffic。只有 `unlock` 的那一次 write 让所有 copy 作废，大家重新读、发现变成 0、一起去 test-and-set，只有一个成功。Traffic 大幅降低，uncontended 时多一次 read，仍然不 fair。

**Ticket lock。** 两个 counter：`next_ticket` 和 `now_serving`。

```c
struct lock { std::atomic<int> next_ticket{0}; volatile int now_serving = 0; };

void lock(lock* l)   { int my = l->next_ticket.fetch_add(1); while (my != l->now_serving) { } }
void unlock(lock* l) { l->now_serving++; }
```

每个 thread 拿号的时候做一次 atomic increment，之后只读 `now_serving`。Release 只产生一次 invalidation，没有一群 thread 同时去抢的 write，并且严格按拿号顺序得到 lock，是 fair 的。

**Compare-and-swap（CAS）。** `CAS(addr, expected, new)`：如果 `*addr == expected` 就写入 `new`，返回是否成功，整个过程 atomic。任何 fetch-and-op 都能用它写成一个 retry loop：

```c
int fetch_and_min(int* addr, int x) {
    int old = *addr;
    while (!CAS(addr, old, min(old, x))) old = *addr;
    return old;
}
```

另一种 primitive 是 load-linked / store-conditional（LL/SC）。C++11 的 `std::atomic<T>` 和 CUDA 的 `atomicCAS` 等直接提供这些操作。

### Fine-grained locking：linked list

一个 sorted linked list 被多个 thread 同时 insert、delete，不加保护会丢掉 update 或者把 list 弄断。最简单的修法是一把全局 lock，正确，但所有 operation 都串行。

Hand-over-hand locking 给每个 node 一把 lock。沿 list 往前走时，先拿下一个 node 的 lock，再放当前 node 的 lock，任何时刻手里最多拿两把。不同 thread 可以同时在 list 的不同位置工作。所有 thread 都按 list 的顺序拿 lock，不会出现 A 拿着前面等后面、B 拿着后面等前面的环，也就满足不了 circular wait，不会 deadlock。代价是每走一步都要 lock/unlock 一次，每个 node 多存一把 lock。Lock 的粒度和第 3 站 task 的粒度是同一种权衡。

### Lock-free 与 ABA problem

拿着 lock 的 thread 被 preempt、遇到 page fault，所有等这把 lock 的 thread 都动不了。Lock-free 的数据结构保证任何时刻总有某个 thread 在进展（单个 thread 仍可能 starve）。

Lock-free stack 的 pop 用 CAS 改 top pointer：

```c
Node* pop(Stack* s) {
    while (true) {
        Node* old_top = s->top;
        if (old_top == NULL) return NULL;
        Node* new_top = old_top->next;
        if (CAS(&s->top, old_top, new_top)) return old_top;
    }
}
```

它有一个漏洞。Stack 从 top 往下是 A → B → C：

1. Thread 1 读到 `old_top = A`、`new_top = B`，然后被 preempt。
2. Thread 2 pop 掉 A，pop 掉 B（B 被 free），再把 A push 回去。现在 stack 是 A → C。
3. Thread 1 醒来，CAS 检查 top 仍然是 A，成功，把 top 设成 B。B 已经被 free 了，C 从 stack 上丢失。

CAS 只比较 pointer 的值，看不出 A 中间离开过又回来了，这叫 ABA problem。修法之一是在 top 旁边放一个每次 pop 都加 1 的 counter，用 double-wide CAS（x86 的 `cmpxchg16b`）同时比较 pointer 和 counter；另一种是 hazard pointer：一个 thread 正在看的 node，别的 thread 不能 free。

Lock-free 的 insert 比较简单，delete 难得多：一个 thread 删掉 node X 的同时，另一个 thread 可能正把新 node 接在 X 后面，这个新 node 会跟着 X 一起消失。

:::wrong Lock-free 的数据结构一定比用 lock 的快
Lecture 16 的结论正好相反：在专门跑这个 workload、thread 不会被打断的场合，写得好的 lock-based code 往往和 lock-free 一样快甚至更快，而且简单得多。Lock-free 不消除 contention，CAS 在激烈竞争时会反复失败重试；在 relaxed 的硬件上它还得自己放 fence。它的价值在 thread 可能在 critical section 里被 preempt、遇到 page fault 或 priority inversion 的场合，那时一把 lock 会让所有人陪着等。
:::

### Condition variable：等的时候别占着 core

:::skip
这一小节是 A2 要用的工具，Lecture 15、16 的摘要里没有出现，内容凭我自己的知识写，对照了 asst2 README 的要求。不做 A2 可以跳过。
:::

A2 的 thread pool 里，worker 没事做时如果在 `while (no_work) { }` 里 spin，它占着一个 execution context。myth 和 AWS 机器上同一个 core 的两个 hyper-thread 共用 ALU，spin 的 thread 会拖慢正在干活的那个；main thread 等所有 task 完成时 spin，也一样。

Condition variable 让 thread 睡着等一个条件：

```cpp
std::mutex m;
std::condition_variable cv;
int remaining = 0;            // 被 m 保护

// worker 完成一个 task 后
{
    std::lock_guard<std::mutex> g(m);
    if (--remaining == 0) cv.notify_all();
}

// main thread 等全部完成
{
    std::unique_lock<std::mutex> lk(m);
    while (remaining != 0) cv.wait(lk);   // wait 会原子地放开 m 并睡下，醒来时重新拿到 m
}
```

两个要点。第一，`wait` 一定放在检查条件的 `while` 里：thread 可能在条件不成立时醒来（spurious wakeup），也可能醒来时条件已被别的 thread 改回去。第二，修改条件和 `notify` 要在同一个 mutex 的保护下，或者至少修改在 mutex 里；否则可能出现 main thread 刚检查完 `remaining != 0`、还没睡下，worker 就把它减到 0 并 notify，这个 notify 没人听见，main thread 睡下之后再也不会被叫醒（missed wakeup）。

:::from
讲法跟 [Lecture 16](https://gfxcourses.stanford.edu/cs149/fall25content/media/finegrainedsync/16_finegrainedlock.pdf)：deadlock、livelock、starvation 的定义，test-and-set、test-and-test-and-set、ticket lock 的 traffic 与 fairness，CAS 和 LL/SC，hand-over-hand locking，lock-free stack、ABA 和两种修法，lock-free 与 lock 的性能结论，都来自文字摘要；摘要里 code 只有描述，上面的 code 是我按描述写的。ABA 的三步例子是我构造的。Condition variable 一节凭我自己的知识写，对照了 asst2 README 里 spinning 与 sleeping 两步的要求。Lecture 15 的摘要里没有 lock 和 barrier 的实现，barrier 这里没有讲。
:::

## [special] DSL 与 domain-specific hardware

:::skip
能用 energy per operation 的数字说明 instruction overhead 和 data movement 的代价，能画出 systolic array 里 data 的流动，能把 convolution 写成一串 matmul 并按 accelerator 的 tile 限制安排 loop，能说清 Halide 的 algorithm 与 schedule 各管什么，就读完了这门课的主线。快速路线必读（Lecture 10），A4 和 A5 都直接用到。
:::

### 一次 add 的能量花在哪

Lecture 10 给的能量数字（约数）：一次 integer operation 约 1 pJ，一次 floating-point operation 约 20 pJ；从 1 mm 外的小块 SRAM 读 64 bit 约 26 pJ，从手机用的 LPDDR DRAM 读 64 bit 约 1200 pJ。从 DRAM 读一个 double 的能量是做一次 floating-point operation 的 60 倍。按这个数，每秒从 DRAM 读 10 GB 要 $10^{10}/8\times1200\ \text{pJ}=1.5$ W，而一块手机 GPU 的整个 power budget 大约 1 W。

前面的数字还没算“执行一条 instruction”本身：fetch、decode、读写 register file。Lecture 10 估计了 programmability 的 overhead 相对于真正的 arithmetic 的比例：一条 half-precision FMA 约 2000%，一条 half-precision 4 元 dot product 约 500%，一条 half-precision 4×4 matrix multiply-accumulate 约 27%。一条 instruction 做的 arithmetic 越多，fetch/decode 的成本被摊得越薄，这和第 1 站 SIMD 的理由是同一个，推得更远。

所以专用硬件快的来源有三处（Lecture 10 的总结）：大量的 arithmetic unit；定制的 datapath，中间结果直接从一个 unit 传给下一个，不经过 register file；大块的 on-chip storage，减少 off-chip 访问。Lecture 10 引的对比：相对写得好的 CPU code，GPU 在 data-parallel、compute-bound 的 code 上 perf/watt 约好 10 倍，TPU 这类 domain-specific accelerator 约 20 倍，fixed-function ASIC 可以到 100 到 1000 倍。

### Systolic array

Matrix multiply 每个输入被用很多次，正适合“中间结果直接传给邻居”。Systolic array 是一片 processing element（PE）的格子，每个 PE 每个 cycle 只做一次 multiply-add，只和上下左右的邻居交换 data，没有 instruction fetch，没有共享的 register file。

::fig[cs149-systolic] Lecture 10 用 4×4 的 PE 演示 $y=Wx$。Weight 预先放进 PE；$x$ 的四个分量错开一拍从左边进入，每拍向右传一格；部分和每拍向下传一格。

第 $r$ 行第 $k$ 列的 PE 存 $w_{k+1,r+1}$。$x_{r+1}$ 在 cycle $r$ 进入第 $r$ 行，cycle $r+k$ 到达第 $k$ 列；第 $k$ 列的部分和在 cycle $r+k$ 到达第 $r$ 行，正好和 $x_{r+1}$ 相遇，加上 $w_{k+1,r+1}x_{r+1}$ 往下传。走完 4 行，cycle $k+4$ 从底下出来的是 $y_{k+1}=\sum_rw_{k+1,r+1}x_{r+1}$。对 matrix-matrix multiply，把很多个 $x$ 一个接一个送进去，填满之后 16 个 PE 每个 cycle 都在做有用的 multiply-add。

TPU v1 的芯片上 arithmetic unit 占约 30% 的面积，control 很小。A4 用的 AWS Trainium2，每个 NeuronCore 的 Tensor Engine 是一个 128×128 的 systolic array，从 SBUF（28 MiB 的 on-chip storage）读输入，把结果写进 PSUM（2 MiB，专门存 matmul 的部分和）。

### GPU 的 tensor core

GPU 也走了同一条路，在 SM 里加了专做小 matrix multiply 的 tensor core。Lecture 10 的数字：A100 有 108 个 SM、6912 个 fp32 ALU，fp32 峰值 19.5 TFLOP/s；432 个 tensor core 做 fp16 输入、fp32 累加，312 TFLOP/s，是前者的 16 倍。H100 的 tensor core fp16 约 989 TFLOP/s，SIMD 的 fp32 是 67 TFLOP/s，约 15 倍。一个只用普通 CUDA core 的 matmul kernel 最多用到 H100 matmul 能力的十五分之一。

数字格式也在为此缩小：BF16（1 位 sign、8 位 exponent、7 位 mantissa，range 和 fp32 一样、precision 低）、FP8 的 E4M3（最大 448）和 E5M2（最大 57344）。H100 还加了 Tensor Memory Accelerator（TMA），异步地把 tensor 从 global memory 搬进 shared memory，让搬运和计算重叠。

### Convolution 变成一串 matmul

Accelerator 只会做 matmul，其他运算都要想办法变成 matmul。Convolution 的标准做法是 im2col（见 [CS249R 第 3 站](../courses/HARVARD-CS249R.html#kernel)），它要为每个 spatial patch 复制一行 input。A4 的 README 用的是另一种更适合 Trainium 的写法：

```
input: (C_in, H*W)            weight: (K, K, C_in, C_out)
output: (C_out, H_out*W_out) = 0
for i in range(K):
    for j in range(K):
        output += matmul(transpose(weight[i, j]), shift(input, (i, j)))
```

对 filter 的每个位置 $(i,j)$，把 input 平移 $(i,j)$，乘上这个位置的 $C_{in}\times C_{out}$ 的 weight 切片，累加进 output。一个 $K\times K$ 的 convolution 变成 $K^2$ 个在 $C_{in}$ 上 contract 的 matmul，不复制 input。

Tensor Engine 的 tile 有上限：左边的 matrix 最大 $128\times128$，右边最大 $128\times512$，结果最大 $128\times512$，partition dimension（第一维）不超过 128。一个 $128\times512$ 的 fp32 结果 tile 是 $128\times512\times4=262{,}144$ byte $=256$ KiB，2 MiB 的 PSUM 只放得下 8 个。所以 loop order 的目标是：一个 output tile 在 PSUM 里把 $K^2$ 个位置和所有 $C_{in}$ 的 tile 全部累加完，再一次写出去；如果 loop 顺序让部分和中途离开 PSUM 再回来，就多了一倍以上的搬运。这正是第 4 站的 locality 问题，换了一种 memory hierarchy。

### Halide：algorithm 与 schedule 分开

上面每一步优化都要专家手写，而且换一台机器要重写。Lecture 13 的例子是 3×3 box blur：

- 直接做 2D：每个 output pixel 9 次 multiply-add，共 $9WH$。
- 拆成横向 1D blur 再纵向 1D blur：$3WH+3WH=6WH$，但要一个 $W\times(H+2)$ 的中间 buffer，读写它让 arithmetic intensity 降一半。
- 按 16 行一块做：每块 16 行 output 需要 18 行横向结果，work 是 $\frac{18+16}{16}\times3WH=\frac{34}{16}\times3WH\approx6.4\,WH$，中间结果只有 18 行，留在 cache 里。

再加上 SIMD intrinsics、$256\times32$ 的 tile、按行切给多个 core、把两遍 fuse 在一起，Lecture 13 说在四核 CPU 上比原来的两遍 code 快约 10 倍，代价是 code 难读、只适用于 SSE 和 CPU。

Halide 把“算什么”和“怎么算”分开写。Algorithm 只有两行，没有 loop，没有存储顺序：

```cpp
blurx(x, y) = (in(x-1, y) + in(x, y) + in(x+1, y)) / 3.0f;
out(x, y)   = (blurx(x, y-1) + blurx(x, y) + blurx(x, y+1)) / 3.0f;
```

Schedule 另写：

```cpp
out.tile(x, y, xi, yi, 256, 32).vectorize(xi, 8).parallel(y);
blurx.compute_at(out, x).vectorize(x, 8);
```

`tile` 把 output 切成 $256\times32$ 的块，`vectorize` 把最内层映射到 8 条 SIMD lane，`parallel` 把 tile 的行分给多个 thread。`compute_at(out, x)` 决定 blurx 在哪里算：每个 output tile 自己算它需要的那部分 blurx。

::fig[cs149-halide] 一个 output tile 和它需要的 blurx。

`blurx.compute_root()` 是另一个极端：先把整张 blurx 算完存下来，没有重复计算，但中间结果要进 memory。三个目标在 schedule 里互相拉扯：parallelism、locality、redundant work。Halide 的 compiler 本身“不聪明”，它只机械地执行 schedule；能这样做的前提是这个 domain 足够规整：regular 的 N 维 domain、feed-forward 的 pipeline、compiler 能推出的依赖关系。Lecture 13 引的结果：bilateral filter 从 122 行 C++ 变成 34 行 algorithm 加 6 行 schedule，CPU 上快 5.9 倍，GPU 上比手写 CUDA 快 2 倍。

Schedule 是一串有限的选择，于是可以交给 search。Lecture 13 讲的 autoscheduler（Adams 2019）从 output 往回，对每个 node 选 `compute_at` 的位置和 tile 大小，用 beam search 搜，用一个在随机生成的 Halide program 上训练的小 MLP 当 cost model，166 秒评估 140 万个 schedule，在 CPU 上的 image processing 程序上追平最好的人写 schedule。Lecture 13 后半讲 LLM 写 kernel：把 PyTorch code 交给 LLM 写 CUDA，执行、profile，把 profiler 的数字（例如 SM utilization 42%、DRAM utilization 89%）喂回去再改；用 Triton、TileLang 这类 DSL 让 LLM 拼装高性能 primitive，比直接写 CUDA 更少出错。A5 就是按这个思路设计的。

:::wrong 专用硬件快，是因为它的 ALU 比 CPU 的 ALU 快
一个 multiply-add 在哪里做都是那么几十个 pJ。差别在 ALU 以外：一条 FMA instruction 的 fetch、decode、register 读写开销约是 arithmetic 本身的 20 倍（2000%），一条 4×4 MMA 只有 27%；从 DRAM 读一个 64-bit 的数是一次 floating-point operation 的 60 倍。Systolic array 和 tensor core 省掉的是这两块：一条 instruction 驱动成百上千次 multiply-add，中间结果在 PE 之间直接传，不回 register file，更不回 DRAM。
:::

:::from
讲法跟 [Lecture 10](https://gfxcourses.stanford.edu/cs149/fall25content/media/accelerators/10_Specialized.pdf) 和 [Lecture 13](https://gfxcourses.stanford.edu/cs149/fall25content/media/aiperfoptimization/13_autooptimize.pdf)：能量数字、instruction overhead 的三个百分比、perf/watt 对比、4×4 systolic array 的 $y=Wx$、TPU v1 的 30%、A100 和 H100 的数字、BF16 和 FP8、box blur 的 $9WH$、$6WH$ 和 $34/16$、Halide 的 algorithm 与 schedule、autoscheduler 的 140 万个 schedule、LLM 的 reflection loop，都出自文字摘要。Convolution 的写法、Tensor Engine 的 tile 限制、SBUF 和 PSUM 的大小取自 asst4 README。$1.5$ W（slides 写约 1.6 W）、60 倍、PSUM 放 8 个 tile、systolic array 各 PE 的 cycle 编号、Halide tile 的 2/32 是我算的。Lecture 9（DNN 在 GPU 上的 evaluation）、Lecture 11、12 没有读。
:::

## 作业

Fall 2025 的五个作业都在 GitHub 的 stanford-cs149 下公开，带 starter code、checker 脚本和参考实现的 binary。官方的评测环境是 myth 机器（A1）、AWS 的 ARM 实例（A2）、AWS 上的 NVIDIA T4（A3）、AWS Trainium2（A4）和课程托管的 H100 队列（A5），校外只能在自己的硬件上跑，每个作业下面写了替代办法。早几年的 CS149 有一个 graph processing（BFS、PageRank）的作业，Fall 2025 没有，这里不写。

### Assignment 1：Analyzing Parallel Program Performance on a Quad-Core CPU（先做）

**要做什么。** 六个小 program，代码量不大，重点是分析：Program 1 用 `std::thread` 并行 Mandelbrot 并解释 speedup 曲线（第 3 站）；Program 2 用课程的 fake vector intrinsics 手写带 mask 的 `clampedExp`（第 1 站）；Program 3 用 ISPC 写 Mandelbrot，先单 core SIMD、再加 task（第 2 站）；Program 4 用 ISPC 的迭代 `sqrt` 构造让 SIMD 最好和最差的输入；Program 5 分析 `saxpy` 为什么不 scale（第 1 站）；Program 6 找出 k-means 的 hotspot 并只并行化一个 function，要求 2.1 倍以上。

**做完会什么。** 对一段 code 先预测 speedup、再测、再解释差距；分得清 load imbalance、divergence、bandwidth 三种原因。

**时间与算力。** README 没有给时间，调研时估计 10 到 15 小时。不需要 GPU：一台有 AVX2 的 x86 机器装上 ISPC 就行（README 给的版本是 v1.28.1）；Apple Silicon 有单独的 `README_aarch64.md`。数字和 handout 不同是正常的，writeup 里写清楚机器。

**提示。**

- Program 1 先按连续的 row 分块，画出 2 到 8 个 thread 的 speedup 曲线，README 让你特别看 3 个 thread 的那个点；然后在 `workerThreadStart()` 首尾计时，看每个 thread 各用了多久。要求的最终分法只能是一个对所有 thread 数都适用的 static assignment，不许 thread 之间有任何 synchronization，目标是两个 view 都到 7 到 8 倍左右。（README）
- 第 3 站那张表是按这里的参数算的工作量上限，可以拿来核对自己的测量；view 2 的 blocked 上限是另一组数（2 个 thread 1.70、8 个 4.33），因为它的工作偏在一侧：前 600 个 row 占 58.8%。（经验，按仓库参数计算）
- Program 2：每条 vector instruction 都可以带 mask，mask 里 0 的 lane 不被写。需要好几个 mask：哪些 lane 在有效范围内、哪些 lane 的 exponent 还没减到 0、哪些要 clamp。`_cs149_cntbits` 可以判断是否所有 lane 都已结束。（README）
- 一定用不是 vector 宽度整数倍的 $N$ 测试，README 建议 `./myexp -s 3`；`_cs149_init_ones(n)` 生成前 $n$ 条 lane 为 1 的 mask，处理尾巴。`./myexp -l` 打印每条执行过的 vector instruction，tail 和 mask 的 bug 都靠它找。性能看的是 “Total Vector Instructions”，utilization 看 “Vector Utilization”。（README）
- 改 `VECTOR_WIDTH` 从 2 扫到 16，看 utilization 怎么变：宽度越大，一个 vector 里 exponent 最大的那条 lane 拖住其余 lane 的机会越多（第 1 站的 masking）。附加题的 `arraySumVector` 要做到 $N/\text{VECTOR\_WIDTH}+\log_2(\text{VECTOR\_WIDTH})$，用 `hadd` 和 `interleave`。（README；分析是经验）
- Program 3 第 1 部分问 8-wide AVX2 的理想 speedup 和实测差在哪：答案要落到图像的哪些区域里相邻 pixel 的 iteration 次数差别大（第 5 站的 warp 图是同一件事）。第 2 部分只能改 `mandelbrot_ispc_withtasks()` 里 task 的个数，目标是超过 sequential 的 32 倍；想想 task 少于或刚等于 execution context 时，最重的那个 task 是否决定了时间（第 3 站）。（README；第二句是经验）
- Program 4：构造输入时想清楚，一个 gang 的 8 条 lane 一起跑，时间由其中 iteration 最多的那条决定；同样的分析也决定 task 版本的 multi-core speedup 会不会变。（经验）
- Program 5 的答案从 bandwidth 出发，不从算力出发（第 1 站那张表）。附加题问 `TOTAL_BYTES` 为什么是 `4 * N * sizeof(float)` 而不是 3，线索在第 6 站的 write-allocate。（README；线索是经验）
- Program 6 只许并行化 `dist`、`computeAssignments`、`computeCentroids`、`computeCost` 中的一个，不能改算法语义和 `stoppingConditionMet`。先用 `CycleTimer::currentSeconds()` 给每个 function 计时，再看清 K、M、N 的相对大小，选并行的那一维。官方答案改了 20 到 25 行。数据约 800 MB，在 myth 上用符号链接而不是复制。（README）

### Assignment 2：Building a Task Execution Library from the Ground Up（值得做）

**要做什么。** 用 C++ 写一个 task execution library。Part A 实现 bulk launch 的 `run(runnable, num_total_tasks)`，三个版本：每次 `run()` 都 spawn thread、spinning 的 thread pool、sleeping 的 thread pool。Part B 加上异步的 `runAsyncWithDeps(runnable, num_tasks, deps)` 和 `sync()`，按依赖关系执行一个 task graph。

**做完会什么。** 第 3 站的 dynamic assignment 和 granularity、第 7 站的 mutex 和 condition variable，以及 thread pool 和依赖调度的实际写法。

**时间与算力。** README 没有给时间，调研时估计 12 到 20 小时。官方评测在 AWS `c7g.4xlarge`（ARM，16 个 execution context）上；仓库带 Linux ARM、macOS ARM、macOS x86 的参考 binary，任何多核机器都能开发。Mac 上用 `runtasks_ref_osx_arm`。

**提示。**

- 不要改提供的 `Makefile`，评分脚本依赖它。（README）
- 按 README 的顺序走，每一步都保持完全正确：先 spawn，再 spinning pool，再 sleeping pool。小的 `simple_test_sync`、`simple_test_async` 适合用 print 和 debugger 调正确性，不要用来测性能。（README）
- `python3 ../tests/run_test_harness.py` 打印你的时间和参考实现的比值，Part A 在 20% 以内、Part B 在 50% 以内拿满性能分。`./runtasks` 默认取多次运行的最小值。（README）
- 测试集里有每个 task 极轻的（`super_super_light`）和 task cost 不均的。前者考 overhead：每领一次 task 都进 critical section 会很慢，想第 3 站的 granularity；后者考 balance。（README 的测试描述；分析是经验）
- Spinning pool 里 `run()` 怎样知道所有 task 都做完，是这一步的难点：一个“已完成 task 数”的 counter 要被保护。Sleeping pool 里 worker 没活时睡，main thread 等完成时也睡。（README）
- `cv.wait` 一定放在检查条件的 `while` 里；修改条件和 `notify` 要在同一个 mutex 下，否则会 missed wakeup 卡死。（经验，见第 7 站）
- 评测机是 ARM，memory model 比 x86 弱。在 x86 上碰巧能跑的“普通变量当 flag”写法，在 ARM 上可能读到旧值或乱序（第 6 站的 PSO 例子），所有 shared 的状态都用 mutex 或 `std::atomic`。（经验）
- Part B 用两个结构：一个放还在等依赖的 launch，一个 ready queue 放可以马上执行的 task；关键的 bookkeeping 在“一个 launch 的最后一个 task 完成”那一刻，检查哪些等待中的 launch 因此变成 ready。可以假设一个 program 只调用 `run()` 或只调用 `runAsyncWithDeps()`，所以 `run()` 可以写成 `runAsyncWithDeps()` 加 `sync()`。（README）

### Assignment 3：A Simple CUDA Renderer（先做）

**要做什么。** Part 1 用 CUDA 写 `saxpy`，分别测只含 kernel 和含 host-device 复制的时间。Part 2 用 upsweep/downsweep 写 exclusive scan，再用它写 `find_repeats`（第 5 站）。Part 3 是主体（85 分里的 72 分是性能和正确性）：一个画半透明圆的 renderer，必须保证每个 pixel 的更新 atomic，并且按圆的输入顺序进行；starter code 一个 thread 画一个圆，两条都违反了。

**做完会什么。** CUDA 的完整流程，scan 这类 data-parallel primitive 的实际用法，以及在“跨 pixel”和“跨圆”两种 parallelism 之间组织一个有顺序约束的问题。

**时间与算力。** README 没有给时间，调研时估计 20 到 30 小时。需要 NVIDIA GPU；官方参考机是 AWS 上的 T4。免费 Colab 的 GPU 通常也是 T4，但 README 没有 Colab 的流程，要自己在 notebook 里编译 `.cu`（调研时的经验）。

**提示。**

- Kernel launch 是异步的。只给 kernel 计时，launch 之后要 `cudaDeviceSynchronize()` 再停 timer；含 `cudaMemcpy` 的计时不需要，它本身是同步的。Part 1 的问题要你拿测得的 bandwidth 和 T4 的 HBM、PCIe 的 bandwidth 比。（README）
- 所有 CUDA API 调用都包一层错误检查。Kernel launch 不能直接包，它的错误会在下一次被检查的调用（例如 `cudaDeviceSynchronize()`）时报出来；一个没检查的错误会在之后任何一次检查时冒出来，指向错的行。（README）
- Scan 每一层 `parallel_for` 启动一次 kernel，thread 数等于这一层真正要做的加法数，不要每层都开 $N$ 个 thread 再用 `if` 筛掉绝大部分。Starter code 已经把长度向上补成 2 的幂，只复制回 $N$ 个。拿满分只需要直接移植 pseudocode，在参考时间的 20% 以内即可；和 Thrust 一样快有附加分。（README）
- Renderer 先保证顺序，再考虑 atomic，README 说做好了顺序之后 atomic 的问题可能根本不存在了。违反任何一条，Part 3 最多 12 分。（README）
- 要同时用两种 parallelism：跨 pixel，和跨圆（只要同一个 pixel 上的更新保持顺序）。顺序只约束覆盖同一个 pixel 的圆，不覆盖同一 pixel 的圆之间完全独立。`circleBoxTest.cu_inl` 里的“圆和方块是否相交”测试很有用。（README）
- `exclusiveScan.cu_inl` 提供了 shared memory 里的 exclusive scan，只支持 2 的幂长度，而且 block 的 thread 数必须等于 array 长度，用之前读注释。README 说常见的一种解法用它，另一种用 Thrust 的 scan。（README）
- `shadePixel` 每次都读写 global memory；在 kernel 里用一个 register 里的局部变量累加 pixel 的颜色，最后只写一次。README 还问：renderer 里有没有 data reuse，怎样利用。（README）
- `rand1M` 和 `micro2M` 的临时结构可能耗尽显存，`cudaMalloc` 的返回值一定要检查，否则表现为莫名的 correctness 失败。评测只用边长是 256 倍数的图像。（README）
- `create_submission.sh` 会先 `make clean`，打包之后要重新编译才能再跑。（README）

### Assignment 4：Programming a Machine Learning Accelerator（有余力再做）

**要做什么。** 用 NKI（Neuron Kernel Interface）在 AWS Trainium2 上写 kernel。Part 1：vector add 从一次一个 element，到按 128 条 partition 分块，再到加大 free dimension 减少 DMA 次数；用 `neuron-profile` 看 timeline；写一个 matrix transpose。Part 2（70 分）：把 convolution 写成第 8 站那样的一串 matmul，加 bias，并和 max pool 融合成一个 kernel，报告 fp16 和 fp32 的 MFU。

**做完会什么。** 在一个没有 cache、要自己管 SBUF 和 PSUM 的 memory hierarchy 上做第 4 站的 locality 推理。

**时间与算力。** README 没有给时间。需要 AWS 的 `Trn2.3xlarge` 实例；测试脚本的 `--simulate` 可以在 CPU 上模拟检查正确性，但 README 提醒模拟结果可能和真机不同，性能只能在真机上测。没有 AWS 额度的话，只能做到正确性。

**提示。**

- SBUF tensor 的第一维（partition dimension）最多 128，第二维单条 instruction 最多 64K 个 element。Part 1 Step 1 让你试 `row_chunk = 256`，会报错，原因就在这里。（README）
- Free dimension 的大小是权衡：太小，instruction overhead 占主导；太大，engine 之间 pipeline 不起来，SBUF 也容易满。（README）
- Part 2 先从最简单的情形做起：小图、无 bias、无 max pool；然后是放不进 SBUF 的大图（224 × 224），再加 bias，最后融合 max pool。测试脚本按从易到难排序，也可以先跳过 max pool 的测试。（README）
- `nc_matmul` 的第一个输入是转置的，输入可能要先 reshape 或 transpose。先在纸上画出每个 matrix 的 shape，决定 output 按哪一维切 tile，再推出一个 output tile 需要 X 和 W 的哪一部分。（README）
- Loop 来自三处：filter 的高和宽、tiled matmul、batch。推荐的顺序是让部分和一直留在 PSUM 里直到这个 output tile 完成，SBUF 里的结果只写一次；然后再为 input 的 locality 调剩下的 loop。（README）
- 计算优先用 `nki.isa` 的 API（`nisa.nc_matmul` 而不是 `nl.matmul`），搬运用 `nisa.dma_copy()`；函数都定义在 module 顶层，不要嵌套；`nl.device_print` 只在 `--simulate` 下可用。（README）
- 性能测试不带 `--profile`（它会稍微改变时间）。在未优化参考实现的 120% 以内拿 95% 的性能分，在优化参考实现的 120% 以内拿满分；fp16 的要求更严。（README）

### Assignment 5：Write a Fast Kernel（值得做）

**要做什么。** 从 Histogram、1D occupancy decoder、FlashAttention、3D heat equation（RK4）、SwiGLU 里选一个或几个，用 CUDA、Triton 或 TileLang 优化，评分看工作日志：每一步的 code 结构、实测时间、profiler 的指标、对瓶颈的假设、下一步改什么，以及最后为什么停下。允许用 LLM，但日志里要说明怎么用的、有没有帮助。

**做完会什么。** 没有参考答案可追时，按“测量、假设、修改、再测量”的循环做 performance engineering，这正是第 4 站最后一节的方法。

**时间与算力。** README 说大约两个晚上能拿到不错的分数，想冲排行榜可以多花很多时间。官方提交到课程托管的 H100 队列，校外用不了；README 说本地任何 CUDA GPU 都可以开发和验证正确性（举例 AWS `g6.xlarge` 的 L4），但要为 H100 调参数，小 GPU 上的结论不一定适用。

**提示。**

- 日志按 README 的格式写：每一步“code 结构、时间、看了哪些统计、结论、假设、下一步”。README 列出的四个方向就是这门课的四件事：增加 parallelism、减少 memory traffic、藏住 memory latency、缓解 contention。（README）
- Histogram 的测试 shape 是 `[1048576, 512]` 的输入、256 个 bin，输出 `[512, 256]`。README 点名的问题是大量 thread 对同一个 bin 的 atomic contention：先在每个 block 的 shared memory 里做局部 histogram，再合并到 global，是第 4 站“复制资源”的做法。（README 的问题描述；做法是经验）
- FlashAttention 的思路见 [CS336 第 5 站](../courses/STANFORD-CS336.html#gpu)；SwiGLU 是 element-wise 加 matmul，先算它的 arithmetic intensity，判断该从哪一边优化。（经验）
- 本地用 `ncu` 需要打开 performance counter 的权限，README 给了修改 `/etc/modprobe.d` 的步骤；用 inline CUDA 时遇到 `GLIBCXX` 版本错误，用 `LD_PRELOAD` 指向系统的 `libstdc++.so.6`。（README）
- 只有一组固定 shape 参与 benchmark（各题 `test_cases` 里的那组），调参前先确认调的是它。（README）
