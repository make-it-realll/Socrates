---
code: HF-LEROBOT
evidence: syllabus
evidenceNote: "前沿公开课，不是 NUS 课。期次：Hugging Face Robotics Course（2025 年 10 月起，课程页目前发布到 Unit 2，Unit 5 到 7 标为 coming soon）及其底稿 Robot Learning: A Tutorial（arXiv 2510.12403）。课程页读了目录、Unit 1 第 3、4 页（WebFetch 给出的详细摘要和其中的代码）；tutorial 分三段读了 imitation learning、async inference、SmolVLA 部分的摘要。LeRobot 仓库 clone 到 2026-11-20 的 commit b13b952，读了 docs 里的 dataset、录制、train、deploy、remote inference、RTC 页面，以及 dataset reader、ACT、Diffusion、SmolVLA、π0、RTC、remote inference 的 source code。"
exam: "无考试；以动手为主。课程每个 unit 带 quiz，没有评分作业，也没有证书。"
subskills:
  - id: record
    name: Data collection：teleoperation、loop 频率与 episode 设计
    l3: "能用 lerobot-record 录一组 episode，并说出 camera 名字会变成哪个 dataset key。"
    l4: "能读 cadence report 判断录到的 fps 是否可信，能按“每种 variation 重复多次”设计一组 50 条的示教。"
    l5: "能用数字说明 loop 跑慢时 dataset 里的时间为什么被压缩，以及它在 deploy 时变成什么后果。"
  - id: dataset
    name: LeRobotDataset：文件、episode index 与 temporal window
    l3: "能说出 meta/info.json、meta/stats.json、meta/episodes、data、videos 各存什么。"
    l4: "能由 delta_timestamps 算出 delta index，算出某个 anchor 的 window 里有几个 pad，并解释 loss 怎样把它们 mask 掉。"
    l5: "能从“多个 episode 共用一个 parquet 和 mp4”出发，讲清一次 dataset[i] 的查询经过哪几步，以及 delta_timestamps 为什么必须是 1/fps 的整数倍。"
  - id: train
    name: Training：从 ACT 起步，step 数、normalization 与瓶颈
    l3: "能用 lerobot-train 在自己的 dataset 上训一个 ACT。"
    l4: "能按 frame 数、batch size 和 epoch 数算出 --steps，能读 dataloading_s 和 update_s 判断瓶颈在哪。"
    l5: "能说明 MEAN_STD 和 MIN_MAX 两种 normalization 各自在什么 data 上出事，并用数字说明一个从不动的 joint 会怎样。"
  - id: vla
    name: Fine-tune SmolVLA 与 π0：camera 映射、冻结什么、flow 的方向
    l3: "能用 --rename_map 把自己的 camera 名映射到 smolvla_base 期望的 camera1、camera2、camera3 并开始 fine-tune。"
    l4: "能说出 SmolVLA 默认冻结了什么、prefix 和 suffix 各有多少 token、一次 inference 要过几遍 action expert，并估计 GPU memory 需求。"
    l5: "能用 SmolVLA 论文的 data 说明 pretraining 带来了什么、没带来什么，并能在 LeRobot 的 flow matching convention 下写出正确的 Euler step。"
  - id: exec
    name: Deployment：chunk 怎样执行、rollout 的检查与 HIL 迭代
    l3: "能用 lerobot-rollout 把 policy deploy 到真机，保持 robot.id、camera、task 文本与录制时一致。"
    l4: "能在 chunk_size、n_action_steps、temporal ensembling 之间做选择，并算出 synchronous 执行时 robot 在动的时间比例。"
    l5: "能用 SmolVLA 的 ablation 和 temporal ensembling 的 weight 算出“执行多少步”这个选择在 feedback 和平滑之间的交换。"
  - id: async
    name: Asynchronous inference：refill、aligned merge 与 RTC
    l3: "能启动 policy server 和 robot client，让 robot 在 inference 期间不停。"
    l4: "能由 refill_seconds 和 turnaround 算出 effective refill、每个 chunk 被 trim 和丢掉的 action 数，以及 observation 的年龄。"
    l5: "能说明 append、aligned、blending、RTC 各自改变了什么，并用一个例子说明 blending 为什么不能放进 gripper。"
open:
  - label: "Hugging Face Robotics Course：课程首页与 Unit 1（LeRobotDataset；Code Example: Batching a (Streaming) Dataset）"
    url: "https://huggingface.co/learn/robotics-course"
    note: "课程结构、Unit 1 第 3 页（v3 的三部分结构与目录）、第 4 页（delta_timestamps 的三种写法、streaming）。读的是 WebFetch 给出的摘要和代码。Unit 0、Unit 1 第 1、2 页、Unit 2 没有读。"
  - label: "Capuano et al., Robot Learning: A Tutorial（arXiv 2510.12403）"
    url: "https://arxiv.org/html/2510.12403"
    note: "课程的底稿。读了 imitation learning（ACT、Diffusion Policy）、async inference 的算法与 queue 分析、SmolVLA 一节的摘要；前面的 RL 部分没有读。"
  - label: "Shukor et al., SmolVLA（arXiv 2506.01844）"
    url: "https://arxiv.org/html/2506.01844v1"
    note: "第 4、5、6 站的真机结果、async 对 sync 的数字、chunk size 与 execution step 的 ablation。读了前 100k 字符（正文与主要表格）的摘要。"
  - label: "Stanford CS224R Spring 2026 Lecture 2：Imitation Learning（Finn）"
    url: "https://cs224r.stanford.edu/slides/02_cs224r_imitation_2026.pdf"
    note: "第 1 站“单一 demonstrator 与多个 demonstrator”、三种采集方式的利弊，第 5 站 HG-DAgger 的讲法。读的是 slides 的逐页摘要，图表里的数字没有读到。"
  - label: "MIT Underactuated Robotics（Tedrake）：Imitation Learning 一章"
    url: "https://underactuated.csail.mit.edu/imitation.html"
    note: "读了全章摘要。这一章多处还是提纲，对 action chunking 只有“像 MPC 一样执行、实验上更稳”一句，没有给出 data 量和 hyperparameter；本页只在第 5 站借用了这个说法。"
  - label: "LeRobot 仓库（commit b13b952，2026-11-20）的 docs 与 source code"
    url: "https://github.com/huggingface/lerobot"
    note: "lerobot-dataset-v3、il_robots、hardware_guide、act、smolvla、rename_map、inference、remote_inference、rtc、hil_data_collection、notebooks 各页；datasets/dataset_reader.py、utils.py、feature_utils.py，policies 下 act、diffusion、smolvla、pi0、rtc 的 config 与 modeling，inference/execution.py，scripts/lerobot_record.py。"
sources:
  - label: "LeRobot 文档：SmolVLA"
    url: "https://huggingface.co/docs/lerobot/smolvla"
  - label: "LeRobot 文档：Imitation Learning on Real-World Robots"
    url: "https://huggingface.co/docs/lerobot/il_robots"
  - label: "Train ACT with LeRobot（Colab notebook）"
    url: "https://colab.research.google.com/github/huggingface/notebooks/blob/main/lerobot/training-act.ipynb"
---

先看三次 deploy。三次的 policy 在 training 时 loss 都正常下降，问题都出在 model 之外。

**第一次。** 用 SO-101 录一组 pick-and-place，`--dataset.fps=30`，front camera 开到 1920×1080。设读一个 1080p 的 frame 加上读 joint 一共要 38 ms，超过 30 Hz 的 33.3 ms budget，loop 实际每 40 ms 走一圈，即 25 Hz。录完的 dataset 照样写着 30 fps。Train 出来的 policy deploy 后动作明显比示教时急，抓取时把 cube 撞开。

::fig[hfl-cadence] Frame 的 timestamp 由 index 算出（index / fps），和它实际被拍下的时刻无关。Loop 慢了，dataset 里的时间就被压缩。

**第二次。** 用 ACT 的默认 parameter 训了一个 policy：每次预测 100 个 action，100 个全部执行完再看下一次 camera。30 Hz 下这是 3.33 s。Gripper 刚出发 0.5 s，有人把 cube 推开 3 cm，gripper 照原计划走到原来的位置，在空处合上。

::fig[hfl-blind] Chunk 里的 action 在 chunk 开始时一次定好。图中每个点隔 10 个 action，按一条 minimum-jerk 的 profile 排布，所以前 15 个 action 里 gripper 几乎没动。

**第三次。** 换成 SmolVLA，loss 和成功率都更好，但 robot 每隔不到 2 s 就停一下。SmolVLA 默认每次预测 50 个 action、全部执行完再算下一个 chunk；设一次 inference 要 0.3 s，robot 就在每个 chunk 末尾等 0.3 s。

::fig[hfl-stall] Synchronous 执行：算的时候不动，动的时候不算。

三次事故分别在第 1、5、6 站得到解决。它们说明这门课的重点：一个 imitation learning 的 policy 在真机上能不能用，大半取决于 data 怎么录、怎么切成 training sample、chunk 怎么执行。Policy 本身（ACT 的 CVAE、diffusion、flow matching、VLA 的结构）在别的页面已经讲过，这一页讲把它们接到一台真 robot 上的那一整条链。

| 站 | 内容 | 对应材料 |
|---|---|---|
| 1 | teleoperation、录制 loop、episode 设计 | LeRobot il_robots 文档；CS224R Lecture 2 |
| 2 | LeRobotDataset v3 的文件与查询 | Robotics Course Unit 1；dataset reader source code |
| 3 | Train ACT：step 数、normalization、瓶颈 | hardware_guide；ACT、Diffusion 的 config |
| 4 | fine-tune SmolVLA 与 π0 | SmolVLA 论文与文档；tutorial 的 VLA 部分 |
| 5 | chunk 的执行、rollout、HIL | SmolVLA ablation；inference 文档；CS224R |
| 6 | remote inference 与 RTC | tutorial 的 async 一节；remote_inference source code |

快速路线（十几个小时）：第 1、2 站和第 4 站必读，对应研究底稿列的 Unit 1（约 1.5 小时）、tutorial 的 BC 到 VLA（约 4 小时）、SmolVLA 文档与 notebook（约 2 小时）；第 3 站读前两个小节；第 5、6 站在有真机时再读。Unit 2 的 classical robotics 学过 [Modern Robotics](../courses/NW-MODERNROBOTICS.html) 可以跳过。

:::note 和站内其他页面的分工
Behavior cloning 的 $T^2$ compounding error、DAgger、diffusion policy、action chunking 为什么有效、ACT 的 CVAE 与 temporal ensembling 的公式、RT-2、OpenVLA、π0 的结构，在 [RB4301](../courses/RB4301.html) 第 5 到 8 站。Flow matching 的 loss、probability path、Euler sampling 在 [MIT-6.S184](../courses/MIT-6.S184.html)。Decoding 为什么受 memory bandwidth 限制、synchronous 与 naive async 的失败方式、RTC 的 guidance 公式和 soft mask 在 [EE4706](../courses/EE4706.html#sys) 第 7 站。Action 的表示（relative 还是 absolute、rotation 怎么交给 network）和“几次 trial 才算数”在 [MIT-6.4210](../courses/MIT-6.4210.html#policy) 第 7 站。VLA 的 RL fine-tuning 在 [现代强化学习实践](../courses/MODERN-RL.html#finetune)。这一页只在用到时指过去。
:::

## [record] Data collection：teleoperation、loop 频率与 episode 设计

:::skip
快速路线必读。能说出 lerobot-record 每个 tick 做哪几步、dataset 里的 action 和 observation.state 分别是什么，能读 cadence report 判断 fps 可信不可信，能设计一组每种 variation 重复多次的 50 条示教，就可以去第 2 站。
:::

### 一个 tick 里发生了什么

SO-101 的标准做法是 leader-follower teleoperation：人手里拿一条和 robot 同样结构、但不带负载的 leader arm，follower arm 跟着 leader 的 joint position 走。CS224R 第 2 讲把采集方式分成三种：kinesthetic teaching（直接推着 robot 走，界面简单，但人出现在 camera 里）、remote controller（手柄、VR，latency 可能高）、puppeteering（leader-follower，要两套硬件）。LeRobot 默认用第三种。

`lerobot-record` 的 loop 按 `--dataset.fps` 定时，每个 tick 依次做五件事（这是 `lerobot_record.py` 里 record loop 的顺序，也是 cadence report 里的五个名字）：

1. **observe**：读 follower 的 joint position 和每个 camera 的一个 frame；
2. **process_obs**：过 observation processor；
3. **teleop**：读 leader 的 joint position，作为 action；
4. **send**：把 action 发给 follower 的 motor；
5. **record**：把 observation 和 action 写成 dataset 的一个 frame。

所以同一个 frame 里，`observation.state` 是 follower 这一刻**测到**的位置，`action` 是这一刻 leader 给出的**目标**位置。Follower 跟不上目标，两者就有差；policy 学的是“看到这个 state 和这些 image，下一个目标是什么”，这正是 deploy 时它要发给 motor 的东西。

按当前的代码，写进 dataset 的是 teleop 给出的 action，而不是经过 `max_relative_target` 截断后真正发出去的那个（代码里有一条 TODO 说明这一点）。录制时如果设了 `max_relative_target`，并且它真的截断过，dataset 里的 action 会比 robot 实际收到的大。

### Timestamp 由 index 算出来

开头第一次事故的原因在一个实现细节上：一个 frame 的 `timestamp` 等于 `frame_index / fps`，不记录它实际被拍下的时刻。Loop 只要有一个 tick 超过 budget，后面所有 frame 的“时间”就比实际早。

按开头的设定算一遍。Loop 每圈 40 ms，20 s 的一次示教录到

$$\frac{20\ \text{s}}{0.04\ \text{s}}=500\ \text{个 frame}$$

Dataset 认为这 500 个 frame 长 $500/30=16.7$ s。Policy 学到的是“16.7 s 做完这个动作”，deploy 时 rollout 按 30 Hz 发 action，motion 就比示教快 $20/16.7=1.2$ 倍：示教时 60°/s 的 joint 变成 72°/s。

LeRobot 为此在每个 episode 结束时打印一行 cadence，录完整个 session 再打印一块汇总。文档里的一个例子：

```
Cadence summary — whole run, 2 episodes · target 30 Hz (33.3 ms budget per tick): 1200 ticks, 1198 judged
  effective cadence: 29.88 Hz over 40.1 s measured
  ticks over the 33.3 ms work budget: 16/1198 (1.3%) — work mean 18.4 ms, worst 45.1 ms
  loop-body steps (share of measured work):
    observe      mean  13.65 ms · worst  40.20 ms ·  74.4% of work · 1200 calls
    ...
  pacing headroom: 15.1 ms slept per tick on average (max 16.7 ms) — near zero means the loop is saturated
```

读法：effective cadence 29.88 Hz 对 30 Hz，差 0.4%，可以接受；16 个 tick 超过 budget，observe 占了 74.4% 的工作时间，最坏一次 40.2 ms，说明超时的原因是 camera；pacing headroom 平均 15.1 ms，loop 还有余量。开头的情形里 effective cadence 会是 25 Hz，headroom 接近 0。

:::wrong 设了 `--dataset.fps=30`，dataset 就是 30 Hz 的
`fps` 只是 loop 的目标。实际达到多少要看 cadence report。开头的例子里差了 17%（25 对 30），dataset 文件里看不出任何异常：frame 数、timestamp、video 的 frame rate 都自洽，只是和真实时间对不上。解决办法是降 camera resolution（1920×1080 换成 640×480，LeRobot 的 train 与 deploy 示例都用这个 resolution）、减少 camera 数量，或者把 fps 降到 loop 能稳定达到的值，再看一遍 cadence。`--dataset.streaming_encoding=true` 省掉了每个 frame 先写 PNG、episode 结束再 encode 的那一步，但 streaming encoding 文档提醒 encoder thread 会在 capture 期间和 control loop 抢 CPU，打开它之后同样要重看 cadence。
:::

### 一组能用的 episode

LeRobot 文档给的起点是：抓一个物体放进 bin，录至少 50 个 episode，物体放在 5 个位置，每个位置 10 条。SmolVLA 论文的 SO-100 dataset 就是这样录的：“5 个起始位置各 10 条”。文档补充说，用 25 条的版本试过，效果差。

这个结构背后的理由可以用 CS224R 第 2 讲的分法说清楚：data 里同一种情形只有一种做法时（一个 consistent 的 demonstrator），unimodal 的 policy 就够；做法不一致时，需要一个能表示多个 mode 的 generative policy（[RB4301 第 6 站](../courses/RB4301.html#gen)）。录制时能控制的是前者，所以文档要求“camera 固定、抓取方式保持一致”。每个位置重复 10 次，是让 policy 在每个位置附近都见到足够多、做法一致的 sample。

文档还给了一条判断标准：**只看 camera 的画面，你自己能不能完成这个任务**。物体被 gripper 挡住、wrist camera 看不到 bin，policy 也看不到。

Variation 要一层一层加：先在 5 个位置上做到稳定抓取，再加新位置、新的抓法、动 camera。文档明确说太快加入太多 variation 会拖累结果。

:::edge Episode 的长度和 reset
默认 `--dataset.episode_time_s=60`、`--dataset.reset_time_s=60`。任务 20 s 就能完成时，用右方向键（或 `n`）提前结束这一条；做坏了用左方向键（或 `r`）丢掉重录。一条 episode 结尾停着不动的那几秒会被当成“正确的 action 是不动”学进去，[RB4301 第 7 站](../courses/RB4301.html#chunk)讲过 single-step policy 在停顿上会卡住，所以录完一个动作就结束 episode。中途断了用 `--resume=true` 接着录，这时 `--dataset.num_episodes` 是**还要录的条数**，不是总数；`lerobot-record` 会在 repo id 后面加上日期时间，接着录时要写完整的名字。
:::

### Camera 的名字就是 feature 的名字

`--robot.cameras="{ wrist: {...}, top: {...} }"` 里的 `wrist`、`top` 会变成 dataset 的 key `observation.images.wrist`、`observation.images.top`。用这个 dataset 训出的 policy，deploy 时期望同样的名字和同样的 resolution。文档的要求是：录制、train、deploy 三步用同一个 `--robot.cameras`。名字对不上时用第 4 站的 rename map。

Index 也要固定。`index_or_path: 0` 和 `1` 是系统给 camera 的编号，USB 插拔或重启后可能互换；wrist 和 top 互换后名字还对，画面却错了，policy 不会报错，只会表现很差。

:::from
采集方式的三分法和“单一 demonstrator 用 unimodal policy 就够”来自 [CS224R 2026 Lecture 2](https://cs224r.stanford.edu/slides/02_cs224r_imitation_2026.pdf)（slides 摘要）。录制 loop 的五步与 action 的来源读自 LeRobot source code `scripts/lerobot_record.py`；cadence report 的例子、“timestamp 由 index 得出”、50 条与 5 个位置、只看 camera 能否完成、variation 要慢慢加、键盘控制、resume 的规则来自 LeRobot 的 [il_robots 文档](https://huggingface.co/docs/lerobot/il_robots)；25 条不够来自 [SmolVLA 文档](https://huggingface.co/docs/lerobot/smolvla)。38 ms 的 observe 是假设的数，500 个 frame、1.2 倍、72°/s 是为这一页算的。“camera index 会互换”和“结尾停顿会被学进去”是经验，没有来源核对。
:::

## [dataset] LeRobotDataset：文件、episode index 与 temporal window

:::skip
快速路线必读。能说出一次 `dataset[i]` 要查哪几个文件，能由 `delta_timestamps` 算出 delta index 和某个 anchor 的 pad 数，知道 `*_is_pad` 在 loss 里怎样用，就可以去第 3 站。
:::

### 为什么不能一个 episode 一个文件

Robotics Course Unit 1 用 ImageNet 作对照：ImageNet 是“一张 image 一个 label”；robot data 是 multimodal、有时间顺序、按 episode 分段、dimension 很高。LeRobotDataset 的 v2 版本按 episode 存文件，每条一个 parquet、每个 camera 每条一个 mp4。一万条、三个 camera 就是四万个文件；Unit 1 指出 v3 的设计目标是“一百万条 episode 只有几百个文件”。

v3 的做法是把多个 episode 首尾相接存进同一个文件，episode 的边界改由 metadata 记录。一个 dataset 的目录是：

| 路径 | 存什么 |
|---|---|
| `meta/info.json` | 每个 feature 的名字、shape、dtype，`fps`，文件路径的模板 |
| `meta/stats.json` | 每个 feature 的 mean、std、min、max，training 时做 normalization |
| `meta/tasks.parquet` | 任务描述的文字和它的整数编号 |
| `meta/episodes/chunk-000/file-000.parquet` | 每个 episode 一行：长度、task、在共享文件里的起止位置 |
| `data/chunk-000/file-000.parquet` | 逐 frame 的 state、action、timestamp，许多 episode 接在一起 |
| `videos/<camera key>/chunk-000/file-000.mp4` | 每个 camera 一组 mp4，许多 episode 的画面接在一起 |

默认一个 data 文件到 100 MB、一个 video 文件到 200 MB 就换下一个，一个 chunk 目录最多 1000 个文件。Unit 1 建议读一个陌生 dataset 的顺序是：先 `info.json`（schema 和 fps），再 `stats.json`，再各打开一个 data 和 video 文件。

### 一次 `dataset[i]` 查了什么

设一个 dataset 有 3 个 episode，长度 600、450、600 个 frame（30 fps 下 20 s、15 s、20 s），只有一个 wrist camera。按 source code `dataset_reader.py`，取第 700 项时：

1. 从 data 里第 700 行读出 `episode_index = 1`。
2. 查 `meta/episodes` 的第 1 行：`dataset_from_index = 600`，`dataset_to_index = 1050`，wrist 这个 camera 的 `from_timestamp = 20.0`（列名是 `videos/<camera key>/from_timestamp`）。
3. 这一行在 episode 里的 `timestamp` 是 $(700-600)/30=3.333$ s。
4. Video 在共享 mp4 里的位置是 $20.0+3.333=23.333$ s，按这个时刻 decode。

::fig[hfl-layout] 共享文件里的 episode 只能通过 episodes 表定位。

第 4 步按 timestamp 而不是按 frame 编号取画面。Decoder 取离 23.333 s 最近的一个 frame，若相差超过 `tolerance_s`（默认 $10^{-4}$ s）就报错。这一条检查把录制和存储里的错位（丢帧、mp4 的 fps 与 info.json 不一致）在 train 开始时暴露出来，而不是悄悄让 image 和 action 错开几帧。

:::wrong 一个 episode 的 frame 在 parquet 里从第 0 行开始，所以 `dataset[i]` 就是 episode 里的第 $i$ 个 frame
只有 episode 0 如此。上面的例子里 `dataset[700]` 是 episode 1 的第 100 个 frame。自己写 data 处理代码时，按 `frame_index`（episode 内的编号）和 `episode_index` 取，不要用全局的行号去减 episode 的长度；用 `episodes=[1]` 只加载 episode 1 时，全局 index 和 parquet 里的相对行号又不一样，source code 里专门有一个 `_absolute_to_relative_idx` 做这一步换算。
:::

### Temporal window：`delta_timestamps`

Policy 要的往往不是一个 frame。ACT 要当前 observation 和接下来 100 个 action，Diffusion Policy 要前后两个 frame 的 observation 和 64 个 action。LeRobotDataset 用 `delta_timestamps` 描述：对每个 key 给一组相对当前 frame 的时间偏移（秒）。Unit 1 第 4 页给了三种写法：

```python
# 只要当前
delta_timestamps = {"observation.images.up": [0.0], "action": [0.0]}
# observation 带 200 ms 的历史
delta_timestamps = {"observation.images.up": [-0.2, -0.1, 0.0], "action": [0.0]}
# action chunking
delta_timestamps = {"observation.images.up": [-0.1, 0.0], "action": [0.0, 0.1, 0.2, 0.3]}
```

库里先把秒换成 frame 的偏移：$\text{round}(\Delta t\times\text{fps})$。30 fps 下 `[-0.2, -0.1, 0.0]` 是 $[-6,-3,0]$，`[0.0, 0.1, 0.2, 0.3]` 是 $[0,3,6,9]$。

换算之前有一道检查：每个 $\Delta t\times\text{fps}$ 必须离整数不超过 $\text{tolerance\_s}\times\text{fps}$。写 0.05 s：$0.05\times30=1.5$，离最近的整数差 0.5 个 frame，即 $0.5/30=0.0167$ s，远大于 $10^{-4}$ s，直接 `ValueError`。

:::wrong 照 Unit 1 的例子写 `"action": [0.0, 0.1, 0.2, 0.3]`，就得到一个 4 步的 action chunk
在 30 fps 的 dataset 上，这 4 个 action 是第 0、3、6、9 个 frame 的，彼此隔 100 ms。把它们当成连续 4 个 tick 的 action 来 train 和执行，robot 每个 tick 走了示教里 3 个 tick 的路，快 3 倍，和第 1 站开头的事故同一个形式。LeRobot 自带的 policy 不走这条路：它们在 config 里直接给 frame 的偏移，ACT 是 `action_delta_indices = range(chunk_size)`，即 $0,1,\dots,99$；training script 再把它们换成 $k/\text{fps}$ 秒。自己写 policy 时也应从“要几个连续的 frame”出发，再除以 fps。
:::

### Episode 边界：clamp 与 `_is_pad`

Anchor 离 episode 结尾不到 100 个 frame 时，ACT 要的 action 有一部分不存在。Source code 里的 `delta_window` 做两件事：把越界的位置 clamp 到 episode 的第一个 frame 或最后一个 frame，并返回一个 boolean mask，key 名是 `<key>_is_pad`。

算一个例子。Episode 长 600 个 frame，ACT 的 chunk 100，anchor $a=550$：要的位置是 $550,\dots,649$，其中 $600,\dots,649$ 共 50 个越界，它们都被换成第 599 个 frame 的 action，`action_is_pad` 的后 50 个是 True。

ACT 的 loss 只在有效位置上平均：

$$\mathcal L_{\text{L1}}=\frac{\sum_{j}\sum_{d}|a_{j,d}-\hat a_{j,d}|\,\mathbb 1[\text{not pad}_j]}{\#\{\text{有效的 }(j,d)\}}$$

$a=550$ 时分母只数前 50 个位置。整个 episode 里，anchor $a\ge501$ 的 99 个都碰到边界；把 600 个 anchor 的 100 个位置合起来，pad 占

$$\frac{1}{600\times100}\sum_{k=1}^{99}k=\frac{4950}{60000}=8.25\%$$

::fig[hfl-window] Window 越过 episode 结尾时，越界部分重复最后一个 frame，并在 `action_is_pad` 里标出来。

不是每个 policy 都 mask。Diffusion 的 config 里 `do_mask_loss_for_padding` 默认 False（注释说原版 Diffusion Policy 也不 mask），它的做法是让 sampler 不从每个 episode 的最后 `drop_n_last_frames = 7` 个 frame 里取 anchor。SmolVLA 和 π0 的 loss 会读 `action_is_pad`，用法和 ACT 相同。

:::edge `drop_n_last_frames` 和现在的 horizon 对不上
Diffusion config 里 `drop_n_last_frames: int = 7` 的注释写着它等于 `horizon - n_action_steps - n_obs_steps + 1`。原版的 16、8、2 代进去是 $16-8-2+1=7$；但这个 commit 的默认值已经是 `horizon=64`、`n_action_steps=32`，代进去是 $64-32-2+1=31$，字段仍是 7。Action 的 delta index 是 $-1,0,\dots,62$，按 7 个 frame 丢掉之后，600 个 frame 的 episode 里仍有 56 个 anchor 带 pad，最后一个 anchor（第 592 个 frame）有 55 个位置是重复的最后一个 frame，而 loss 不 mask 它们。用 Diffusion 训短 episode 时，值得自己把这个数设成 31，或者打开 `do_mask_loss_for_padding`。这一条是我读 config 时的推算，没有在仓库的 issue 里查到讨论。
:::

### Streaming

`StreamingLeRobotDataset` 不先下载，从 Hub 一边读一边训，接口和 `LeRobotDataset` 相同；training 时加 `--dataset.streaming=true`。Unit 1 报告 network 好时约每秒 80 到 100 个 iteration，扣掉初始化后接近本地读取。它适合 dataset 比 disk 大、想快速试几个 dataset、或在云上 train 的情形。文档说明 streaming 仍然保证每个 epoch 每个选中的 frame 恰好访问一次，episode 被取进一个有上限的 memory pool 里打乱。

:::from
ImageNet 的对照、三部分结构、读目录的顺序、“一百万条只有几百个文件”、`delta_timestamps` 的三种写法、streaming 的速度来自 [Robotics Course Unit 1 第 3 页](https://huggingface.co/learn/robotics-course/unit1/3)和[第 4 页](https://huggingface.co/learn/robotics-course/unit1/4)（摘要）。目录表、v2 到 v3 的变化、`finalize()` 与 streaming 的说明来自 LeRobot 的 `lerobot-dataset-v3` 文档。查询的四步、`from_timestamp`、`tolerance_s` 的检查、`delta_window` 的 clamp 与 mask、文件大小的默认值、ACT 的 masked L1、Diffusion 的 `do_mask_loss_for_padding` 与 `drop_n_last_frames` 读自 source code （`datasets/dataset_reader.py`、`utils.py`、`feature_utils.py`，`policies/act`、`policies/diffusion`）。三个 episode 的例子、700 号的查询、8.25%、56 个 anchor 与 55 个 pad 是为这一页算的。
:::

## [train] Training：从 ACT 起步，step 数、normalization 与瓶颈

:::skip
快速路线只读前两个小节。能按 frame 数和 batch size 算出合理的 `--steps`，能说出 ACT、Diffusion、SmolVLA 默认用哪种 normalization，能从 training log 判断 GPU 是不是在等 data，就可以去第 4 站。
:::

### 为什么先训 ACT

LeRobot 的 ACT 文档说它是“刚开始时我们推荐的第一个 model”：约 80M parameter，一张 GPU 几个小时，常常 50 条示教就有高成功率。同一组 data 上先有一个 ACT 的 baseline，后面换 SmolVLA 时才说得清 pretraining 和 language 带来了多少；第 4 站 SmolVLA 论文的表里，ACT 就是这样一个 baseline。

```bash
lerobot-train \
  --dataset.repo_id=${HF_USER}/record-test_YYYYMMDD_HHMMSS \
  --policy.type=act \
  --output_dir=outputs/train/act_so101_test \
  --policy.device=cuda \
  --policy.repo_id=${HF_USER}/my_policy
```

`--policy.type=act` 读 `configuration_act.py` 的默认值，并从 dataset 的 `info.json` 自动取 state、action 的 dimension 和 camera 的个数。值得知道的默认值：

| Parameter | 默认 | 含义 |
|---|---|---|
| `chunk_size` | 100 | 每次预测 100 个 action |
| `n_action_steps` | 100 | 每次执行 100 个再重新预测（第 5 站） |
| `vision_backbone` | resnet18，ImageNet pretrained | 每个 camera 一份 feature map |
| `dim_model`、`n_encoder_layers`、`n_decoder_layers` | 512、4、1 | decoder 只有 1 层，见下 |
| `use_vae`、`latent_dim`、`kl_weight` | True、32、10 | loss $=\mathcal L_{\text{L1}}+10\,\mathrm{KL}$ |
| `optimizer_lr` | $10^{-5}$ | backbone 同为 $10^{-5}$ |

`n_decoder_layers=1` 有一段来历，写在 config 的注释里：原版 ACT 代码写的是 7 层，但有一个 bug 让它实际只用到第 1 层，LeRobot 为了复现原版的结果设成 1。

### `--steps` 要自己算

不写 `--steps` 就是 100,000 步。LeRobot 的 hardware guide 给出的经验是 imitation learning 通常在 5 到 10 个 epoch 内 converge，并给了换算方法：

$$\text{steps per epoch}=\left\lceil\frac{\text{总 frame 数}}{\text{GPU 数}\times\text{batch size}}\right\rceil,\qquad\text{total steps}=\text{epoch 数}\times\text{steps per epoch}$$

按第 1 站的 50 条、每条 30 s、30 fps：总 frame 数 $50\times30\times30=45{,}000$。ACT 默认 batch 8，一张 GPU：每个 epoch $45000/8=5625$ 步，5 到 10 个 epoch 是 28,125 到 56,250 步。默认的 100,000 步是 $100000\times8/45000=17.8$ 个 epoch。

Guide 给的耗时参考（5 个 epoch、约 45,000 个 frame、640×480，量级而已，误差 ±50%）：

| 硬件 | Policy | Batch | 耗时 |
|---|---|---|---|
| RTX 4090 / 3090 | act | 8 | 30 到 60 分钟 |
| RTX 4090 / 3090 | diffusion | 8 | 2 到 4 小时 |
| L4 / A10G | smolvla | 4 | 3 到 6 小时 |
| A100 40 GB | smolvla | 16 | 1 到 2 小时 |
| A100 40 GB | pi0 / pi05 | 4 | 4 到 8 小时 |
| Apple M 系列 Max（MPS） | act | 4 | 6 到 14 小时 |

:::wrong 照抄别人的命令，`--steps=20000 --batch_size=64` 就是 SmolVLA 合适的 train 量
Step 数只有和 dataset 的大小放在一起才有意义。$20000\times64=1{,}280{,}000$ 个 sample：在 45,000 个 frame 的 dataset 上是 28.4 个 epoch，在一个 15 条、每条 20 s 的 dataset（9,000 个 frame）上是 142 个 epoch，相差 5 倍。两份 LeRobot 文档本身也不一致：SmolVLA 页给的是 20k 步、batch 64，hardware guide 说 5 到 10 个 epoch；SmolVLA 论文真机 fine-tune 用了 200,000 步。可靠的做法是先按 epoch 算一个数，存几个中间 checkpoint（`--save_freq`，默认每 20,000 步），在真机上比较。
:::

### Normalization：`stats.json` 用在哪里

Policy 不直接吃 joint 的角度。Training 前，preprocessor 用 `meta/stats.json` 把 state 和 action 每个 dimension 变到相近的尺度，输出再反变换回去。三种常用的模式（`processor/normalize_processor.py`）：

| 模式 | 公式 | 谁默认用 |
|---|---|---|
| MEAN_STD | $(x-\mu)/(\sigma+10^{-8})$ | ACT 的 image、state、action；SmolVLA 与 π0 的 state、action |
| MIN_MAX | $2(x-\min)/(\max-\min)-1$，落在 $[-1,1]$ | Diffusion 的 state、action |
| IDENTITY | 不变 | SmolVLA 的 image（VLM 自己处理） |

两种模式各有自己会出事的地方。

**MIN_MAX 加 Diffusion 的 clip。** Diffusion 的 config 有 `clip_sample=True`、`clip_sample_range=1.0`：denoising 的每一步都把 sample 截到 $[-1,1]$，换回原单位就是 training data 里每个 dimension 的 $[\min,\max]$。Policy 永远 output 不出示教里没到过的 joint 角度。示教里 wrist 只转到 40°，deploy 时需要 45° 才够得着的物体，它够不着。

**MEAN_STD 加一个从不动的 joint。** 

:::edge 一个 joint 在所有示教里都没动过
设 50 条示教里 wrist_roll 始终停在同一个读数，$\sigma=0$。STS3215 的 encoder 一圈 4096 格，一格是 $360/4096=0.088^\circ$。Deploy 时它的读数只要差一格，normalize 之后是

$$\frac{0.088}{0+10^{-8}}=8.8\times10^{6}$$

而 training 时这个 dimension 永远是 0。这样一个 input 进 network，output 是什么都不奇怪。真实的 encoder 往往有一点 noise，$\sigma$ 不会恰好是 0，但只要 $\sigma$ 远小于 deploy 时的偏差，就是同一个问题的较轻版本。Training 前打开 `stats.json` 看一眼每个 dimension 的 std；接近 0 的 dimension，要么在示教里让它动起来，要么从 input 里去掉。
:::

### Training log：GPU 是不是在等 data

Training log 把一个 iteration 拆成 `dataloading_s`（从 DataLoader 取一个 batch）、`preprocessing_s`（image 转换和 policy 的 preprocessor）、`update_s`（forward、backward、optimizer step）。Guide 在 4 张 H100 上测的一组：diffusion 的 `update_s` 0.167 s、`dataloading_s` 0.015 s，GPU 利用率约 90%；SmolVLA 0.312 s 对 0.011 s。这两组都是 GPU 在忙。如果你看到 `dataloading_s` 和 `update_s` 一样大，GPU 有一半时间在等，加 batch size 不会更快。

在 DataLoader worker 里，最贵的往往是 mp4 decode 和 image augmentation。v3 的 image transform 可以挪到 GPU 上做（`--dataset.image_transforms.backend=gpu`），worker 只负责 decode；文档提醒 `gpu_compile` 每种 image shape 第一次要 15 到 30 s 编译。另一个旋钮是 `--num_workers`（默认 4）。

:::from
ACT 是推荐的起点、80M parameter、默认 batch 8 起步来自 LeRobot 的 [ACT 文档](https://huggingface.co/docs/lerobot/act)；默认值表、decoder 的那段注释、MEAN_STD 的 $10^{-8}$、Diffusion 的 MIN_MAX 和 clip、SmolVLA 的 IDENTITY 读自 `policies/*/configuration_*.py` 与 `processor/normalize_processor.py`。5 到 10 个 epoch、换算公式、耗时表、4×H100 的分项时间来自 hardware guide（`docs/source/hardware_guide.mdx`）；200,000 步来自 [SmolVLA 论文](https://arxiv.org/html/2506.01844v1)。GPU backend 的说明来自 `lerobot-dataset-v3` 文档。45,000 个 frame 的各个换算、0.088° 与 $8.8\times10^6$ 是为这一页算的；“wrist 只转到 40°”是构造的例子。
:::

## [vla] Fine-tune SmolVLA 与 π0：camera 映射、冻结什么、flow 的方向

:::skip
快速路线必读。能用 `--rename_map` 把自己的 camera 接到 smolvla_base 上，说出默认冻结了什么、一次 inference 过几遍 action expert，并能对 SmolVLA 论文“pretraining 有用”的结论说出它的证据和边界，就可以去第 5 站。
:::

### 一次 inference 里 token 怎样走

SmolVLA 共约 450M parameter，π0 是 3.3B。它们的结构属于 [RB4301 第 8 站](../courses/RB4301.html#vla)讲过的“VLM 加 flow matching 的 action expert”一类。对 deploy 和 fine-tune 有影响的数字来自 SmolVLA 论文和 config：

- **Vision。** 每个 camera 的 image 缩放并 pad 到 512×512，SigLIP encode 后用 pixel shuffle 压成 64 个 token。不做 VLM pretraining 时用的 tiling，只用全局 image。
- **Language 与 state。** Task 文字最多 48 个 token（`tokenizer_max_length=48`）；state 先 pad 到 32 个 dimension（`max_state_dim=32`），再用一个 linear layer 投影成 **1 个** token。
- **VLM。** SmolVLM2 只用前 16 层，丢掉后一半。论文在 LIBERO 上的 ablation：8 层 75.0%、16 层 78.5%、24 层 79.5%、32 层 80.3%。
- **Action expert。** 约 100M parameter，hidden size 是 VLM 的 0.75 倍；cross-attention 层（action token 读 VLM 的 key/value）和 self-attention 层（action token 之间）交替。Ablation：只用 CA 79.0%，只用 SA 74.5%，交替 85.5%。
- **Output。** 一个 50 × 32 的 chunk（`chunk_size=50`、`max_action_dim=32`），SO-101 只用前 6 个 dimension。

::fig[hfl-smolvla] 3 个 camera 时 prefix 最多 $3\times64+48+1=241$ 个 token。Prefix 只过一遍 VLM，存成 KV cache；10 步 Euler integration 每一步只过 action expert。

这就是 source code `sample_actions` 的结构：先对 prefix 调一次 `vlm_with_expert.forward`，打开 `use_cache`；然后 `euler_integrate` 做 10 次 `denoise_step`，每次只把 50 个 action token 喂给 expert，读同一份 cache。π0 是同样的两段：prefix 过 PaliGemma（Gemma 2B），10 步只过 300M 的 expert。所以 inference 的时间大致是“一次 VLM prefill 加十次小 expert”，这也是 [EE4706 第 7 站](../courses/EE4706.html#sys)按 bandwidth 估算的那两项。

### 名字对上：`rename_map` 与 `empty_cameras`

`smolvla_base` 是在 450 多个社区 dataset 上 pretrain 的，论文为了统一，把 camera 按 top、wrist、side 的顺序排好，在 checkpoint 里叫 `observation.images.camera1`、`camera2`、`camera3`。你的 dataset 叫 `top`、`wrist`，training 时不映射就以 feature mismatch 报错。文档的命令：

```bash
lerobot-train \
  --policy.path=lerobot/smolvla_base \
  --dataset.repo_id=lerobot/svla_so100_pickplace \
  --rename_map='{"observation.images.top": "observation.images.camera1", "observation.images.wrist": "observation.images.camera2"}' \
  --batch_size=64 --steps=20000 \
  --policy.device=cuda
```

Deploy 时传同一个 `--rename_map`。映射要保持 pretrain 时的语义顺序：top 映到 camera1、wrist 映到 camera2。把 wrist 映到 camera1，形状照样对得上，不报错，pretrained 的视觉先验却用错了地方。

Camera 比 policy 期望的少时，设 `--policy.empty_cameras=N`：config 里多出 N 个 `observation.images.empty_camera_k`，运行时用 mask 掉的占位 tensor 填（SigLIP 类 encoder 填 $-1$，attention mask 为 0），不需要在 dataset 里放假 image。

`--task` 的文字也是 input。Deploy 时写的 task 要和录制时 `--dataset.single_task` 一致；SmolVLA 论文 pretrain 时专门用一个小 VLM 重写了社区 dataset 里含糊或缺失的 task 描述，说明 policy 对这段文字是敏感的。

### 冻结什么，要多少 GPU memory

SmolVLA 的默认 `freeze_vision_encoder=True`、`train_expert_only=True`、`train_state_proj=True`：VLM（包括 vision encoder）完全不更新，只训 action expert、state 的投影和 action 的 in/out 投影。π0 的默认相反，两个都是 False，整个 3.3B 一起训，learning rate $2.5\times10^{-5}$，gradient clip 1.0。

Hardware guide 的 GPU memory（batch 8，AdamW）：

| 组 | Policy | 峰值 GPU memory | 起步的 GPU |
|---|---|---|---|
| Light BC | act | 约 2 到 6 GB | 笔记本 RTX 3060、L4 |
| Diffusion | diffusion | 约 8 到 14 GB | RTX 4070 以上 |
| Small VLA | smolvla | 约 10 到 16 GB | RTX 4080 以上、L4 |
| Large VLA | pi0、pi0_fast、pi05 | 约 24 到 40 GB | A100 40 GB（24 GB 只够 batch 1） |

GPU memory 不够时三个办法：batch size 减半 GPU memory 大约减半；用 gradient accumulation 补回 effective batch；SmolVLA 保持 `freeze_vision_encoder=True`。π0 系列还可以开 `gradient_checkpointing=true`、`dtype=bfloat16`，guide 在 4 张 H100 上训 pi05 时就是这样设的。

### Pretraining 到底带来了什么

SmolVLA 论文在 SO-100 上的三个任务，每个任务 50 条示教（5 个位置各 10 条），success rate（%）：

| Policy | Pick-Place | Stacking | Sorting | 平均 |
|---|---|---|---|---|
| ACT，single-task | 70 | 50 | 25 | 48.3 |
| π0（3.5B），multi-task | 100 | 40 | 45 | 61.7 |
| SmolVLA，no pretraining，single-task | 55 | 45 | 20 | 40.0 |
| SmolVLA，no pretraining，multi-task | 80 | 40 | 35 | 51.7 |
| SmolVLA，pretrained，multi-task | 75 | 90 | 70 | 78.3 |

这张表支持的结论：同样 multi-task fine-tune，pretraining 把平均从 51.7 提到 78.3；不做 pretraining 的 SmolVLA（40.0）不如 ACT（48.3）。也就是说，小 data 上 SmolVLA 的优势几乎全部来自那 2 万多条社区 trajectory 的 pretraining，结构本身没有带来什么。

它不支持的结论：“SmolVLA 在每个任务上都更好”。Pick-Place 上 π0 是 100，SmolVLA 75。论文的 SO-101 实验还有一组 Lego pick-place：ACT in-distribution 70、out-of-distribution 40，SmolVLA 90 和 50；新位置上两者都掉了很多。论文没有在我读到的部分里写明每格是多少次 trial；所有数字都是 5 的倍数，若是 20 次，75 对 70 只差一次成功（[MIT-6.4210 第 7 站](../courses/MIT-6.4210.html#policy)算过这种差别需要多少次 trial 才分得开）。

:::wrong 按 MIT-6.S184 的写法，$t=0$ 是 noise、$t=1$ 是 data，所以改 LeRobot 的 sampling 时让 $t$ 从 0 走到 1
LeRobot 的 π0、π0.5、SmolVLA 沿用 openpi 的 convention，方向相反（`policies/common/flow_matching.py` 里叫 `NOISE_AT_ONE`）：

$$x_t=t\,\varepsilon+(1-t)\,a,\qquad u=\varepsilon-a$$

Sampling 时 $t$ 从 1 走到 0，每步 $dt=-\tfrac1{10}$。

用 1D 的情形算一遍。Action $a=0.6$，noise $\varepsilon=-1.2$，target velocity $u=\varepsilon-a=-1.8$，学好的 network 在这条直线上就输出 $-1.8$。从 $x=\varepsilon=-1.2$ 出发，按 LeRobot 的写法走 10 步：

$$x\leftarrow x+dt\cdot v=x+(-0.1)(-1.8)=x+0.18,\qquad -1.2+10\times0.18=0.6$$

到达 action。照 6.S184 的习惯写成 $dt=+0.1$：$-1.2+10\times(0.1)(-1.8)=-3.0$，离 action 越来越远。Source code 的 docstring 专门警告了这一点：training 时用的 convention 和 sampling 时用的不一致，什么检查都不会报错，policy 学到的 velocity 只是指向自己 schedule 的反方向。Time 的 sampling 也不同：这几个 policy 的 $t$ 取自 $\mathrm{Beta}(1.5,1)$ 乘 0.999 加 0.001，偏向 noise 一端，不是 uniform。
:::

::fig[hfl-flowdir] 同一个 velocity，$dt$ 的符号写反，10 步之后差 3.6。

:::edge π0 的 relative action
LeRobot 默认的 action 是 absolute joint position（dataset 里存的就是它）。π0 的 config 有 `use_relative_actions`（默认 False），打开后 action 变成“相对当前 state 的偏移”，gripper 默认排除在外（`relative_exclude_joints=["gripper"]`）。openpi 原版用 relative action；从 openpi 的 checkpoint 出发 fine-tune 时，这个开关要和它的 train 方式对上。Relative 和 absolute 各自的利弊在 [MIT-6.4210 第 7 站](../courses/MIT-6.4210.html#policy)。
:::

:::from
SmolVLA 的结构数字（450M、16 层、64 token、0.75 倍、CA/SA 交替、state 一个 token、10 步、chunk 50、512×512）、pretraining 的 450 多个 dataset 与 task 重写、camera 的统一顺序、SO-100 与 SO-101 的结果表、LIBERO 的 ablation 来自 [SmolVLA 论文](https://arxiv.org/html/2506.01844v1)和 [tutorial 的 SmolVLA 一节](https://arxiv.org/html/2510.12403)（摘要）。Rename map 的命令、feature mismatch、`empty_cameras` 来自 LeRobot 的 [SmolVLA 文档](https://huggingface.co/docs/lerobot/smolvla)和 rename_map 文档；GPU memory 表来自 hardware guide；冻结的默认值、π0 的 hyperparameter、prefix 与 KV cache 的两段、flow 的 convention 与 Beta distribution读自 `policies/smolvla`、`policies/pi0`、`policies/common/flow_matching.py`。241 个 token、1D 的 Euler 算例、“小 data 上优势来自 pretraining”的读法是为这一页算和写的；“camera 顺序映错不报错”是根据代码结构的推论，没有实测。
:::

## [exec] Deployment：chunk 怎样执行、rollout 的检查与 HIL 迭代

:::skip
有真机时必读，快速路线可以先跳过。能说出 `chunk_size` 和 `n_action_steps` 的区别并为自己的任务选一个数，能算 synchronous 执行时 robot 在动的比例，知道 deploy 前要对齐哪几样东西、失败之后怎样用 HIL 收集 data，就可以去第 6 站。
:::

### `chunk_size` 和 `n_action_steps` 是两个数

Policy 每次预测 `chunk_size` 个 action，执行其中前 `n_action_steps` 个，其余丢掉，再拿新的 observation 预测。Source code 里 ACT 的 `select_action` 就是一个 queue：queue 空了调一次 model，把前 `n_action_steps` 个放进去，然后每个 tick `popleft` 一个。

默认值：

| Policy | `chunk_size` | `n_action_steps` | 30 Hz 下一次盲走 |
|---|---|---|---|
| ACT | 100 | 100 | 3.33 s |
| Diffusion | horizon 64 | 32 | 1.07 s |
| SmolVLA | 50 | 50 | 1.67 s |
| π0 | 50 | 50 | 1.67 s |

开头第二次事故就是 ACT 的那一行。[RB4301 第 7 站](../courses/RB4301.html#chunk)讲了 chunk 越长、compounding error 的 bound 越小，同时 chunk 内部越像 open loop；Underactuated 的讲义把执行方式描述为“像 MPC 一样”预测一串、执行一段再重新预测。这里的问题是执行多少。

SmolVLA 论文在 LIBERO 上固定 chunk 50，只改执行的步数：

| 执行步数 | 1 | 10 | 30 | 50 |
|---|---|---|---|---|
| Success rate（%） | 80.3 | 82.8 | 70.8 | 51.8 |

全部执行完（也就是默认值）比执行 10 步低了 31 个百分点。同一篇论文改 chunk size（执行方式不变）：$n=1$ 是 50.0，$n=10$ 是 84.0，$n=50$ 是 80.3，$n=100$ 是 74.5。两张表合起来：预测得长有用，执行得长有害。Deploy 时应当用 `--policy.n_action_steps` 把执行步数调短，而不是去改 `chunk_size` 重训。

### 执行得短的代价：停得更频繁

Synchronous 执行时，queue 一空 robot 就停下来等 inference。设一次 inference 0.3 s，30 Hz 下是 9 个 tick，执行 $s$ 步、停 9 步，robot 在动的比例是 $s/(s+9)$：

| $s$ | 在动的比例 |
|---|---|
| 50 | $50/59=84.7\%$ |
| 10 | $10/19=52.6\%$ |
| 1 | $1/10=10\%$ |

::fig[hfl-sync] 每执行完 `n_action_steps` 个就停 9 个 tick。执行 10 个时，feedback 更新得快，robot 却有将近一半时间不动。

执行少则 feedback 多但停得多，执行多则不停但盲走。Synchronous 下这两者无法兼得，第 6 站的 asynchronous inference 就是为了拆开这对矛盾。停顿本身还有一个副作用：[EE4706 第 7 站](../courses/EE4706.html#sys)指出 robot 每 0.5 s 停一下时，dynamics 和示教里的连续动作不同，state 落到 training distribution 之外。

:::wrong ACT 打开 temporal ensembling（`temporal_ensemble_coeff=0.01`），每个 tick 都用新 observation，所以对突发变化反应很快
打开后 `n_action_steps` 必须是 1，每个 tick 都跑一次 model，同一时刻有 100 个 chunk 各给出一个 action，按 $w_i=e^{-0.01i}$ 加权平均，$w_0$ 属于**最早**的那次预测。100 个 weight 的和是

$$\sum_{i=0}^{99}e^{-0.01i}=\frac{1-e^{-1}}{1-e^{-0.01}}=63.5$$

最新的一次预测只占 $e^{-0.99}/63.5=0.58\%$，最旧的占 $1/63.5=1.57\%$。开头那个 cube 被推开之后，要过多少个 tick，“推开之后做的预测”加起来才占一半？设推开后已做了 $k$ 次预测，它们是最新的 $k$ 个：

$$\frac{1}{63.5}\sum_{i=100-k}^{99}e^{-0.01i}\ \ge\ 0.5$$

算出来 $k=63$，30 Hz 下 2.1 s。$m$ 取大一些更慢：$m=0.1$ 要 94 个 tick，$m=0.5$ 要 99 个。Temporal ensembling 让每个 action 都带上了新 observation 的一点影响，motion 更平滑，但对一个突然的变化，它的反应比 `n_action_steps=10` 的 queue（最多 10 个 tick 加一次 inference 就整体换成新 chunk）慢得多。代价还有一项：每个 tick 都要在 33.3 ms 内跑完一次 ACT。
:::

### Deploy 前对齐的五样东西

`lerobot-rollout` 是 deploy 的入口，`--strategy.type=base` 只跑不录，`episodic` 录评估 episode 并在 episode 之间留出 reset。文档要求以下几样和录制时一致：

1. **`--robot.id`**：calibration 文件按 id 存，id 不同就读不到同一份 calibration，joint 的零点和方向会不同。LeRobot 改过一次 calibration 的约定（`backwardcomp` 文档：shoulder_lift 的零点移了 90° 并反向，elbow_flex 移了 90°），用旧 calibration 录的 data 要经过换算才能和新代码一起用。
2. **`--robot.cameras`**：同样的名字、同样的 resolution，以及第 1 站说的同样的物理位置。
3. **`--task`**：和 `--dataset.single_task` 一字不差。ACT 不读它，SmolVLA 和 π0 读。
4. **`--rename_map`**：training 时传了什么，deploy 时就传什么。
5. **`--fps`**：默认 30，要和 dataset 的 fps 一致。

Deploy 时同样有 cadence report，多一个 `infer` 项。文档的例子里 infer 的 mean 是 5.18 ms、worst 40.00 ms：平均很快，但 queue 空的那一个 tick 要跑完整个 model，那一次就超过了 33.3 ms 的 budget。`infer` 占比高说明瓶颈在 policy 或 device，`observe` 占比高说明在 camera。在没有 GPU 的电脑上用 `--device=cpu` 跑 CUDA 训出的 checkpoint 是允许的，文档提醒先确认 CPU 上 inference 能跟上控制频率。

:::edge 安全
`--robot.max_relative_target` 限制每一步 joint 目标相对当前位置能跳多远，第一次 deploy 一个新 policy 时值得设上；第 1 站说过录制时设它会让 dataset 里的 action 和实际发出的不一致，所以录制和 deploy 可以用不同的值。Rollout 正常结束或出错时默认 `--return_to_initial_position=true`，先回到起始位置再断开；断开时是否放掉 torque 取决于 robot 的配置。
:::

### 失败之后：human-in-the-loop 收集 data

Policy 在真机上失败的地方，正是示教 data 没有覆盖的 state。CS224R 第 2 讲的两条出路是：收更多示教，或者收“纠正”的 data；后者的实用版本是 human-gated DAgger：policy 在跑，人看着，要出错时接管，示范怎样恢复，把这段并进 dataset 再训。

LeRobot 的 `--strategy.type=dagger` 实现的就是这个循环：看 policy 执行，按键暂停（robot 保持位置），用 leader arm 把 robot 带回好的状态再继续示范，交还给 policy，一条 episode 里可以反复几次。默认只录人控制的那几段，每段纠正自成一个 episode；`--strategy.record_autonomous=true` 时连 policy 自己执行的部分一起录成一条连续的 trajectory。

这要求 leader arm 带可以主动驱动的 motor：暂停时 leader 先自己转到 follower 当前的姿态，人再接手。否则交接的那一刻 leader 和 follower 位置不同，follower 会跳到 leader 那里，这一跳也会被录进纠正 data，教会 policy 一个猛的动作。

每一轮的流程是：用 v0 跑、收它的失败、和原 data 合在一起 fine-tune 得到 v1，再针对 v1 的失败收下一轮。CS224R 列出的代价是需要一个接管的界面，而且有些领域里错误很难及时发现。

:::back
Compounding error 与 DAgger 的理论在 [RB4301 第 5 站](../courses/RB4301.html#bc)；chunk 为什么有效在[第 7 站](../courses/RB4301.html#chunk)。Synchronous 执行的比例公式与 [EE4706 第 7 站](../courses/EE4706.html#sys)相同，这里用 LeRobot 的默认值代入。
:::

:::from
ACT 的 queue 与 temporal ensembling 的约束（`n_action_steps` 必须为 1、$w_0$ 是最旧的、建议值 0.01）读自 `policies/act`；各 policy 的默认 chunk 与执行步数读自各自的 config。执行步数与 chunk size 的 ablation 来自 [SmolVLA 论文](https://arxiv.org/html/2506.01844v1)的 Table 12、13（摘要）。“像 MPC 一样执行”来自 [Underactuated 的 Imitation Learning 一章](https://underactuated.csail.mit.edu/imitation.html)。Deploy 的对齐要求、strategy 的种类、cadence 的读法、`--device` 的说明来自 LeRobot 的 inference 与 il_robots 文档；calibration 的变化来自 backwardcomp 文档；HIL 的流程和 leader arm 的要求来自 hil_data_collection 文档；HG-DAgger 的利弊来自 [CS224R 2026 Lecture 2](https://cs224r.stanford.edu/slides/02_cs224r_imitation_2026.pdf)。0.3 s 的 inference 是假设的数；在动比例的表、temporal ensembling 的 63.5、0.58%、63 个 tick、94 与 99 是为这一页算的。
:::

## [async] Asynchronous inference：refill、aligned merge 与 RTC

:::skip
有真机且 inference 明显慢于一个 tick 时必读。能由 `refill_seconds` 和 turnaround 算出何时发请求、新 chunk 要 trim 几个、丢掉旧 chunk 几个、action 用的 observation 有多旧，并能说出 blending 和 RTC 各改变了什么，就读完这门课了。
:::

### 把“算”和“动”放进两个 process

第 5 站的矛盾来自 synchronous：算的时候不能动。Tutorial 的 async inference 一节和 LeRobot 的 remote inference 把它拆开：**policy server** 在 GPU 上跑 checkpoint；**robot client** 控制 camera 和 motor，手里有一个 action queue，每个 tick 从 queue 里取一个执行。Queue 快空时 client 发一个新的 observation，在 server 计算期间继续从 queue 里执行，新 chunk 到达后接进 queue 还没执行的部分。

这同时解决了另一个实际问题：robot 旁边的电脑常常是没有 GPU 的笔记本或 single-board computer，GPU 在实验室另一头。Server 只需要 checkpoint 和它所对应的 robot 的描述；robot 这边不加载 weight。

两个 process 在同一台机器上也可以用这条路（`--inference.type=remote`）；另一种不分 process 的 asynchronous 是本地 RTC（`--inference.type=rtc`），inference 在 rollout process 的一个后台 thread 里。

### 什么时候发请求

Tutorial 的 Algorithm 1 用一个比例 $g\in[0,1]$：queue 里剩下的 action 数 $|A_t|$ 与 chunk 长 $H_a$ 之比低于 $g$ 时发请求。它的分析：设 inference 平均要 $\mathbb E[\ell_S]$，每个 tick $\Delta t$，robot 不停的条件是请求时 queue 里剩下的足够撑过 inference：

$$g\,H_a\,\Delta t\ \ge\ \mathbb E[\ell_S]\quad\Longleftrightarrow\quad g\ \ge\ \frac{\mathbb E[\ell_S]/\Delta t}{H_a}$$

$g=0$ 时 queue 空了才发，退化成 synchronous，每个 chunk 停 $\mathbb E[\ell_S]$；$g=1$ 时每个 tick 都发，每个 tick 一次 forward，SmolVLA 论文称它在有限的硬件上代价过高；论文举的中间值是 $g=0.7$。用开头的数：$\ell=0.3$ s，$\Delta t=1/30$ s，$H_a=50$，下限是 $9/50=0.18$。

现在的 LeRobot 把这个比例换成了秒：`refill_seconds`（默认 0.5 s）是“queue 里剩下的 playback 时间低于它就发请求”。Client 还会用实测的 turnaround（encode、network、排队、inference、decode 的总和，取最近若干次里的**最大值**）自动抬高它，source code `inference/execution.py` 里：

$$\text{effective refill}=\max\big(\text{refill\_seconds},\ \text{turnaround}+1/\text{fps}\big)$$

代入：$\max(0.5,\ 0.3+0.033)=0.5$ s，也就是 queue 剩 15 个 action 时发请求。

### 新 chunk 到达时：aligned merge

新 chunk 是按发请求那一刻的 observation 算的。等它到达，robot 已经又执行了 $\lceil0.3\times30\rceil=9$ 个 action。新 chunk 的第 0 个 action 对应的是 9 个 tick 之前的那一刻。

默认的 `chunk_merge=aligned` 这样处理（source code `_accept_aligned`）：发请求时记下 queue 的 cursor 作为 anchor，到达时 `trim = 当前 cursor − anchor`，把新 chunk 的前 `trim` 个丢掉，剩下的**替换** queue 里还没执行的全部 action。

按上面的数走一遍，从 chunk A 开始执行：

| 事件 | tick | 说明 |
|---|---|---|
| A 开始执行 | 0 | A 覆盖 tick 0 到 49 |
| 发请求，拍下 observation | 35 | A 还剩 15 个 = 0.5 s |
| B 到达 | 44 | 过了 9 个 tick；B 覆盖 35 到 84，trim 前 9 个，剩 41 个替换 A 的最后 6 个 |
| 再发请求 | 70 | B 剩 15 个 |
| C 到达 | 79 | C trim 9 个，替换 B 的最后 6 个 |

每 35 个 tick（1.17 s）来一个新 chunk，每个 chunk 实际执行 35 个 action（第 9 到 43 个），robot 从不停。B 的 action 在 tick 44 到 78 执行，所依据的 observation 是 tick 35 拍的，年龄从 9 个 tick（0.3 s）到 43 个 tick（1.43 s）。对比第 5 站的 synchronous、执行 50 个：observation 的年龄从 0.3 s 到 $0.3+49/30=1.93$ s，而且每次停 0.3 s。

::fig[hfl-async] Aligned merge：新 chunk 的开头已经过去，trim 掉；剩下的替换旧 chunk 还没执行的部分。

另一个选择 `chunk_merge=append` 把新 chunk 整个接在旧 chunk 之后，不 trim。它保留了每个 chunk 的完整执行，但新 chunk 的开头对应的是一个更旧的 observation，文档只建议把它当 baseline。

SmolVLA 论文在三个 SO-100 任务上比较了 sync 和 async：

| | Sync | Async |
|---|---|---|
| 平均完成时间 | 13.75 s | 9.70 s |
| 60 s 内搬完的 cube（5 次合计） | 9 | 19 |
| Success rate 平均（Pick-Place / Stacking / Sorting） | 78.3（75 / 90 / 70） | 73.3（80 / 90 / 50） |

快了约 30%，同样时间里多做了一倍；但 Sorting 的成功率从 70 掉到 50。

:::wrong Async 只是消除了停顿，其他一切照旧，所以总是更好
Async 改变了每个 action 所依据的 observation 有多旧，也改变了 chunk 和 chunk 之间怎样衔接。上表 Sorting 一项下降 20 个百分点，论文没有给出原因。可以确定的是两种执行下 policy 看到的东西不同：aligned merge 时，每次换 chunk 都可能换到另一个 mode（旧的从左边绕、新的从右边绕），[EE4706 第 7 站](../courses/EE4706.html#sys)讲过这种切换带来的跳变。换成 async 之后要重新评估成功率，不能只看完成时间。
:::

### 可用的 playback：一个硬上限

Chunk 的标称长度不等于能用的长度。文档的例子：chunk 50 个、30 Hz，标称 1.67 s；inference 要 1 s，到达时已经过去 30 个 tick，trim 后只剩 0.67 s。下一次 inference 又要 1 s，无论 `refill_seconds` 怎么设都接不上。把它写成不等式：要连续，trim 后剩下的必须撑过下一次 inference，

$$H\,\Delta t-\ell\ \ge\ \ell\quad\Longleftrightarrow\quad\ell\ \le\ \tfrac12H\,\Delta t$$

这和 [EE4706 第 7 站](../courses/EE4706.html#sys)从 RTC 的 mask 推出的 $d\le H/2$ 是同一个条件。超过时，只能缩短 inference、换更长 horizon 的 checkpoint，或换一个 action 频率。加大 timeout 和 starvation grace 不会多出 action。

Queue 真的空了（starvation）时，client 保持最后一个实际发出的目标，最多等 `action_starvation_grace_s`（默认 1 s），然后只用等待开始之后拍的新 observation 重新预测；超时就终止 policy motion。这要求 robot driver 支持 position hold：SO、OMX、Koch 等 follower 支持，mobile base 不支持。

### Blending 与 RTC

Aligned merge 在接缝处仍可能跳。可选的 blending 对重叠的前 `blend_steps` 个位置做

$$q\leftarrow q+b_w\,(i-q)$$

$q$ 是 queue 里旧的目标，$i$ 是新 chunk 同一时刻的目标，$b_w$ 是 `blend_weight`（默认 0.5）。旧目标 10°、新目标 14°，blend 之后是 12°。Blending 必须用 `blend_components` 明确列出参与的 dimension。

:::edge 不要把 gripper 放进 blend
旧 chunk 在这一时刻要合上 gripper（读数 0），新 chunk 认为还没到，要张开（100），$b_w=0.5$ 的 blend 给出 50：半开半合，抓不住也放不下。两个 chunk 在 arm 的 joint 上属于不同 mode 时同理，平均出来的可能正好从两条路中间穿过去。文档的建议是先只用 aligned、不 blend，把 cadence 和任务调通；blend 只放连续的 arm joint；一次只改一个设置。
:::

RTC 走的是另一条路：不在生成之后拼接，而在生成时就让新 chunk 的前一段和旧 chunk 一致。原理和 guidance 公式在 [EE4706 第 7 站](../courses/EE4706.html#sys)，这里只说 LeRobot 的开关。Deploy SmolVLA 时加 `--inference.type=rtc`、`--inference.rtc.execution_horizon=10`、`--inference.rtc.max_guidance_weight=10.0` 三个 flag（π0、π0.5 同样可用）；remote 路径上在 server 端启用、client 用 `--inference.mode=rtc_guided`。

LeRobot 的 mask 和 EE4706 那一页写的论文版本有两点不同。一是默认的 `prefix_attention_schedule=LINEAR`，论文用的是 exponential（也提供，选 `EXP`）。二是 mask 的三段由 inference delay $d$ 和 `execution_horizon` 决定（source code `get_prefix_weights`）：前 $d$ 个 weight 为 1；$d$ 到 `execution_horizon` 之间从 1 线性降到 0（两端不取）；之后全为 0。按上面的数，$d=9$、`execution_horizon=10`：中间只有一个位置，weight 是 0.5，其余 40 个完全自由。$d$ 一旦达到 10，source code 把起点截成 `execution_horizon`，就只剩前 10 个硬冻结。所以 `execution_horizon` 要比实测的 delay 大出一截，soft 的那一段才存在。

:::back
Synchronous 与 naive async 的失败方式、RTC 的 inpainting 与 soft mask、$d\le H/2$ 的推导在 [EE4706 第 7 站](../courses/EE4706.html#sys)；mode 平均的问题在 [RB4301 第 6 站](../courses/RB4301.html#gen)；执行步数的取舍在[第 5 站](#exec)。
:::

:::from
Server 与 client 的分工、$g$ 的定义、no-idle 条件、$g=0$、$g=1$ 与 0.7 的讨论来自 [tutorial 的 async inference 一节](https://arxiv.org/html/2510.12403)和 [SmolVLA 论文](https://arxiv.org/html/2506.01844v1)（摘要）；sync 与 async 的结果表来自 SmolVLA 论文。`refill_seconds`、effective refill、aligned 的 trim 与替换、append、blending 的公式与 gripper 的建议、可用 playback 的例子、starvation 的行为来自 LeRobot 的 remote_inference 文档，并在 `inference/execution.py` 的 `effective_refill`、`should_request`、`_accept_aligned` 里核对过。RTC 的开关来自 SmolVLA 与 inference 文档；LINEAR schedule 与三段 mask 读自 `policies/rtc/modeling_rtc.py`。0.3 s 的 inference 是假设的数；15 个、9 个、35 个 tick、0.3 到 1.43 s、0.18、$\ell\le\tfrac12H\Delta t$ 的写法、gripper 50 的例子是为这一页算的。
:::

## 作业

这门课没有评分作业。课程页每个 unit 有 quiz 和 LeRobot 的代码示例，LeRobot 文档另有 ACT 和 SmolVLA 的 Colab notebook。下面按研究底稿的两项（SmolVLA 必做、ACT 值得做）加上 Unit 1 的代码和一个真机环节排列，每条提示注明来源。人工时间各处都没有给出，下面写的是估计。

### Unit 1 代码：读一个 LeRobotDataset（先做）

**要做什么。** 加载 `lerobot/svla_so101_pickplace`，用 Unit 1 第 4 页的三组 `delta_timestamps` 各取一个 sample，看 shape；换成 `StreamingLeRobotDataset` 再做一遍；接一个 `DataLoader` 跑几个 batch。

**做完会什么。** 第 2 站：知道一个 sample 里有哪些 key、window 怎样变成 tensor 的第一个 dimension、pad 在哪里。

**时间与算力。** 底稿估 1.5 小时（读 Unit 1 的时间）。CPU 就够，免费 Colab 也够。

**提示。**
- 先 `print(dataset.meta.features)` 看 key 的名字，再写 `delta_timestamps`；Unit 1 的例子用 `observation.images.up`，换别的 dataset 时 camera 名不同。（来源：`lerobot-dataset-v3` 文档。）
- 取一个 episode 最后几个 frame 的 sample，打印 `action_is_pad`，对照第 2 站的算法核对 True 的个数。（来源：经验，依据 source code `delta_window`。）
- 偏移写成 0.05 之类不是 $1/\text{fps}$ 整数倍的数会直接报 `ValueError`；`[0.0, 0.1, 0.2, 0.3]` 在 30 fps 下取的是隔 3 个 frame 的 action。（来源：`feature_utils.py`。）
- `DataLoader` 用 `num_workers>0` 时，不要在主 process 里另开一个 `num_workers=0` 的 loader 去读 video，source code 注释说会 segmentation fault。（来源：`dataset_reader.py` 的 `_query_videos` 注释。）

### Train ACT with LeRobot（Colab notebook，值得做）

**要从零写什么。** 不需要写 model。在 Hub 上的一个 dataset 上用 `lerobot-train --policy.type=act` train，作为 SmolVLA 的不带 language 的 baseline。

**做完会什么。** 第 3 站：`--steps` 的换算、checkpoint 与 resume、读 training log。

**时间与算力。** Notebooks 页：A100、batch 64、100k 步约 1.5 小时。要 GPU；开始前确认 Colab 的 runtime 设成了 GPU（底稿）。免费 T4 会慢很多，按第 3 站的公式把 step 数减到 5 到 10 个 epoch（估计）。

**提示。**
- 同一个 dataset 上先训 ACT 再训 SmolVLA，比较成功率和 inference latency，才能判断 language 条件和 pretraining 带来了什么。（来源：研究底稿的建议。）
- 默认 `n_action_steps=100`，deploy 或在 simulation 里评估时用 `--policy.n_action_steps` 调短，对比几个值。（来源：第 5 站，依据 SmolVLA 论文的 ablation。）
- 从 checkpoint 接着训：`--config_path` 指向 `checkpoints/last/pretrained_model/` 里的 `train_config.json`，再加 `--resume=true`。（来源：il_robots 文档。）
- Batch size 从 8 开始，按 GPU memory 调整。（来源：ACT 文档。）
- Training curve 可以接 Trackio（`--trackio.enable=true`）或 Weights & Biases，方便和 SmolVLA 的 run 对齐比较。（来源：il_robots 文档与 notebooks 页。）

### Fine-tune SmolVLA（LeRobot 文档 + Colab notebook，先做）

**要从零写什么。** 从 `lerobot/smolvla_base` 出发，在一个 LeRobotDataset（官方的 `lerobot/svla_so100_pickplace`，或自己录的约 50 条）上 fine-tune 一个 pick-and-place policy；有 SO-101 就用 `lerobot-rollout` deploy。

**做完会什么。** 第 4 站全部；deploy 时用到第 5、6 站。

**时间与算力。** SmolVLA 文档：一张 A100 上 20k 步约 4 小时；notebooks 页写 batch 64、20k 步约 5 小时。GPU memory 约 10 到 16 GB（hardware guide），免费 Colab 的 T4 有 16 GB，要把 batch 降下来、步数按 epoch 重算，速度会慢很多（估计）。真机 deploy 要 SO-100 或 SO-101 和两路 camera。

**提示。**
- `smolvla_base` 期望的 camera 名是 `camera1`、`camera2`、`camera3`，必须用 `--rename_map` 映射，否则 feature mismatch；deploy 时传同一个 map。按 top、wrist、side 的顺序映射。（来源：SmolVLA 文档；顺序来自论文的 camera 统一方式。）
- Data 量从 50 条起步，每种 variation 重复多次；论文用 5 个位置各 10 条，25 条的版本效果差。（来源：SmolVLA 文档。）
- Deploy 时 camera 名、resolution、`--rename_map`、`--task` 文字都要和录 data 时一致。（来源：SmolVLA 文档。）
- Inference 慢导致动作卡顿时开 RTC：`--inference.type=rtc`，并把 `--inference.rtc.` 下的 `execution_horizon` 设为 10、`max_guidance_weight` 设为 10.0；`execution_horizon` 要明显大于实测 delay 的 tick 数，否则没有 soft 的过渡段。（来源：SmolVLA 文档；后半句来自 `modeling_rtc.py`，第 6 站。）
- Batch size 从小开始，GPU 放得下再加，同时注意 data loading 不要成为瓶颈，看 `dataloading_s`。（来源：SmolVLA 文档；log 字段来自 hardware guide。）
- 默认只训 action expert（`train_expert_only=True`）；想同时更新 VLM 要显式关掉它和 `freeze_vision_encoder`，GPU memory 会明显上升。（来源：`configuration_smolvla.py`；GPU memory 的说法是估计。）

### 真机：录一组、训、deploy、HIL 一轮（有余力再做）

**要做什么。** 在自己的 arm 上按第 1 站录 50 条，读 cadence；训 ACT 和 SmolVLA；deploy 时比较 `n_action_steps` 的几个取值、sync 和 remote async；收一轮 HIL 纠正 data 再 fine-tune。LeRobot 没有把这一套写成作业，这里按文档的各页串起来。

**做完会什么。** 开头三次事故各自亲手遇到一遍，以及第 5 站的 HIL 循环。

**时间与算力。** 录 50 条、每条 20 s 加 10 s reset，约 25 分钟（估计，不算做坏重录）；train 见上两项。Remote inference 要一台 GPU 机器和 robot 旁边的一台电脑在同一 network 里。

**提示。**
- 录制前先用 `lerobot-teleoperate` 带 camera 跑一会儿，看它的 cadence；fps 不达标先降 resolution。（来源：il_robots 文档的 cadence 一节。）
- 判断一个 setup 能不能用的标准：只看 camera 画面，你自己能不能完成任务。（来源：il_robots 文档。）
- `lerobot-record` 会给 repo id 加上时间戳；不想要就加 `--dataset.no_stamp=true`。自己写录制代码时，push 之前必须调 `dataset.finalize()`，否则 parquet 文件不完整。（来源：il_robots 与 `lerobot-dataset-v3` 文档。）
- Remote inference 先用 aligned、不 blend；看 log 里的 configured 与 effective refill 和 trim 的个数；再加短的 blend，只放 arm 的 joint。（来源：remote_inference 文档。）
- HIL 要 leader arm 能主动转到 follower 的姿态，否则交接时的跳变会被录进 data。（来源：hil_data_collection 文档。）
- 每次换执行方式（sync/async、执行步数）都重新数成功率，trial 次数够不够按 [MIT-6.4210 第 7 站](../courses/MIT-6.4210.html#policy)算。（来源：经验。）
