---
code: HF-LEROBOT
evidence: syllabus
evidenceNote: "前沿公开课，不是 NUS 课。期次：Hugging Face Robotics Course（2025 年 10 月起；课程源码仓库 huggingface/robotics-course 在 2026-10-14 的 commit 2a50023 发布了 Unit 0、1、2，Unit 5、6、7 仍标为 Coming Soon）及其底稿 Robot Learning: A Tutorial（arXiv 2510.12403）。课程已发布的 11 页（含 Unit 1 与 Unit 2 的两份 quiz）从仓库 clone 下来逐字读完。Tutorial 的 RL、classical robotics、LeRobotDataset、imitation learning、async inference、π0、SmolVLA 各节用 WebFetch 分段读（工具只给逐段转述和公式，不给大段原文），Code 3 到 6、11 到 14 的参数逐项读到。SmolVLA 论文用 WebFetch 读了全部表格（Table 1 到 13、Figure 5）和 evaluation、async、ablation 各段。CS224R Lecture 2 读了逐页的 slide 文字（图表里的数字读不到）。Underactuated 的 Imitation Learning 一章从源码仓库读了全文。LeRobot 仓库 clone 到 2026-11-20 的 commit b13b952，读了 docs 与 source code（见 open）。"
exam: "无考试；以动手为主。课程 Unit 1 第 4 页有 11 题、Unit 2 第 5 页有 9 题 multiple-choice quiz，不计分，没有证书；课程建议每个 unit 30 到 45 分钟。"
subskills:
  - id: classic
    name: Classical robotics：planar 2R arm、IK、differential IK 与 feedback
    l3: "能写出 planar 2R arm 的 forward kinematics，并说出 IK 为什么会有两组解。"
    l4: "能用 law of cosines 解出两组 IK，用 surface 约束排掉一组，算出 Jacobian 和 J⁺ ṗ* 给出的 joint velocity。"
    l5: "能用数字说明 model 有误差时 open-loop differential IK 偏多少、加 k_p 的 feedback 之后误差怎样衰减到多少，以及 Unit 2 列出的四条 limitation 各指什么。"
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
    l4: "能按 frame 数、batch size 和 epoch 数算出 --steps，能读 dataloading_s 和 update_s 判断瓶颈在哪，能算出 learning rate schedule 在给定 --steps 下怎么走。"
    l5: "能说明 MEAN_STD 和 MIN_MAX 两种 normalization 各自在什么 data 上出事，并用数字说明一个从不动的 joint 会怎样。"
  - id: vla
    name: Fine-tune SmolVLA 与 π0：camera 映射、冻结什么、flow 的方向
    l3: "能用 --rename_map 把自己的 camera 名映射到 smolvla_base 期望的 camera1、camera2、camera3 并开始 fine-tune。"
    l4: "能说出 SmolVLA 默认冻结了什么、prefix 和 suffix 各有多少 token、一次 inference 要过几遍 action expert，并估计 GPU memory 需求。"
    l5: "能用 SmolVLA 论文的 data（包括它的 partial-credit 评分和 ablation 的设定）说明 pretraining 带来了什么、没带来什么，并能在 LeRobot 的 flow matching convention 下写出正确的 Euler step。"
  - id: exec
    name: Deployment：chunk 怎样执行、rollout 的检查与 HIL 迭代
    l3: "能用 lerobot-rollout 把 policy deploy 到真机，保持 robot.id、camera、task 文本与录制时一致。"
    l4: "能在 chunk_size、n_action_steps、temporal ensembling 之间做选择，并算出 synchronous 执行时 robot 在动的时间比例。"
    l5: "能用 SmolVLA 的 ablation 和 temporal ensembling 的 weight 算出“执行多少步”这个选择在 feedback 和平滑之间的交换。"
  - id: async
    name: Asynchronous inference：refill、aligned merge 与 RTC
    l3: "能启动 policy server 和 robot client，让 robot 在 inference 期间不停。"
    l4: "能由 refill_seconds 和 turnaround 算出 effective refill、每个 chunk 被 trim 和丢掉的 action 数、新 chunk 多久来一个，以及 observation 的年龄。"
    l5: "能说明 tutorial 的 threshold g 与现在的 refill 有什么不同，append、aligned、blending、RTC 各自改变了什么，并用一个例子说明 blending 为什么不能放进 gripper。"
  - id: rl
    name: Real-world RL：reward classifier、actor-learner 与 HIL-SERL
    l3: "能说出 HIL-SERL 的四个组成部分（示教、reward classifier、SAC 的 actor-learner、人的 intervention）各解决什么问题。"
    l4: "能由 discount 和 fps 算出 effective horizon，并算出 online/offline 各半的 batch 里 intervention 占多少。"
    l5: "能说明 tutorial 为什么认为真机 RL 难（reset、sample efficiency、reward），以及 RLPD、SERL、HIL-SERL 一层层补上了什么。"
open:
  - label: "Hugging Face Robotics Course（GitHub 源码 huggingface/robotics-course，commit 2a50023）"
    url: "https://huggingface.co/learn/robotics-course"
    note: "Unit 0 第 1、2 页，Unit 1 第 1 到 4 页（含 11 题 quiz），Unit 2 第 1 到 5 页（含 9 题 quiz），全部从 clone 下来的 mdx 源文件逐字读完。第 1 站、第 3 站和作业里的 quiz 一节以它为准。"
  - label: "Capuano et al., Robot Learning: A Tutorial（arXiv 2510.12403）"
    url: "https://arxiv.org/html/2510.12403"
    note: "课程的底稿。用 WebFetch 分三段（0 到 100k、100k 到 200k、200k 到 272k 字符）读：RL 一节（MDP、DQN、DDPG、SAC、RLPD、SERL、HIL-SERL 与 Code 3 到 6）、classical robotics、LeRobotDataset 与 Code 2、generative model 与 ACT、Diffusion Policy、Optimized Inference（Algorithm 1、threshold g、similarity filter、Code 11 与 12）、π0（Eq. 52、53）、SmolVLA 与 Code 13、14。工具只给逐段转述和公式，原文没有整段读到；HF Space 的 git 仓库和 arXiv 的直接下载被网络代理拒绝。"
  - label: "Shukor et al., SmolVLA（arXiv 2506.01844）"
    url: "https://arxiv.org/html/2506.01844v1"
    note: "第 5、6、7 站。用 WebFetch 读了 Table 1 到 13 的全部数字、Figure 5 的 sync/async 数字、Section 3.3、4.1、4.6、4.7 的逐段转述和附录的 task annotation prompt。"
  - label: "Stanford CS224R Spring 2026 Lecture 2：Imitation Learning（Finn）"
    url: "https://cs224r.stanford.edu/slides/02_cs224r_imitation_2026.pdf"
    note: "第 2 站三种采集方式的利弊、“单一 demonstrator 与多个 demonstrator”，第 6 站 DAgger 与 HG-DAgger 的利弊。用 WebFetch 逐页读了 slide 文字；slide 15 两张柱状图的数字在 PDF 文字层里没有，读不到。"
  - label: "MIT Underactuated Robotics（Tedrake）：Ch. 21 Imitation Learning"
    url: "https://underactuated.csail.mit.edu/imitation.html"
    note: "从 github.com/RussTedrake/underactuated（commit 61652c2）的 book/imitation.html 读了全文。这一章多处还是提纲；第 6 站借用了“像 model-predictive control 一样执行、实验上更稳”的说法。"
  - label: "LeRobot 仓库（commit b13b952，2026-11-20）的 docs 与 source code"
    url: "https://github.com/huggingface/lerobot"
    note: "docs：lerobot-dataset-v3、il_robots、hardware_guide、act、smolvla、rename_map、inference、remote_inference、rtc、hil_data_collection、hilserl、notebooks、backwardcomp。Source code：datasets/dataset_reader.py、utils.py、feature_utils.py，policies 下 act、diffusion、smolvla、pi0、rtc 的 config 与 modeling，policies/common/flow_matching.py，optim/schedulers.py、optim/factory.py，inference/execution.py，rl/learner.py、rl/data_sources/data_mixer.py、rl/algorithms/sac，scripts/lerobot_record.py。"
sources:
  - label: "LeRobot 文档：SmolVLA"
    url: "https://huggingface.co/docs/lerobot/smolvla"
  - label: "LeRobot 文档：Imitation Learning on Real-World Robots"
    url: "https://huggingface.co/docs/lerobot/il_robots"
  - label: "LeRobot 文档：HIL-SERL Real Robot Training Workflow"
    url: "https://huggingface.co/docs/lerobot/hilserl"
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

三次事故分别在第 2、6、7 站得到解决。它们说明这门课的重点：一个 imitation learning 的 policy 在真机上能不能用，大半取决于 data 怎么录、怎么切成 training sample、chunk 怎么执行。Policy 本身（ACT 的 CVAE、diffusion、flow matching、VLA 的结构）在别的页面已经讲过，这一页讲把它们接到一台真 robot 上的那一整条链。

课程本身现在发布了三个 unit：Unit 0 是课程介绍，Unit 1 讲 robot learning 的来历、LeRobot 和 LeRobotDataset（带一段 dataset 代码和 11 题 quiz），Unit 2 讲 classical robotics（planar arm 的 kinematics、differential IK、feedback，以及这些方法的四条 limitation，带 9 题 quiz）。规划中的 Unit 5（RL）、Unit 6（imitation learning）、Unit 7（foundation model）还是 Coming Soon，它们的内容在底稿 tutorial 里已经写完。这一页按“Unit 2 → Unit 1 → tutorial 的 IL、VLA、async inference → tutorial 的 RL”排站；tutorial 原文把 RL 放在 IL 之前，这里放到最后，是因为真机 RL 用到前面每一站的东西（dataset、teleoperation、intervention、actor 与 learner 分开跑）。

| 站 | 内容 | 对应材料 |
|---|---|---|
| 1 | planar 2R arm、IK、differential IK、feedback 与它们的 limitation | Robotics Course Unit 2；tutorial 的 classical robotics 一节 |
| 2 | teleoperation、录制 loop、episode 设计 | LeRobot il_robots 文档；tutorial 的 Code 2；CS224R Lecture 2 |
| 3 | LeRobotDataset v3 的文件与查询 | Robotics Course Unit 1；dataset reader source code |
| 4 | Train ACT：step 数、learning rate schedule、normalization、瓶颈 | hardware_guide；ACT、Diffusion 的 config |
| 5 | fine-tune SmolVLA 与 π0 | SmolVLA 论文与文档；tutorial 的 π0 与 SmolVLA 两节 |
| 6 | chunk 的执行、rollout、HIL | SmolVLA ablation；inference 文档；CS224R |
| 7 | remote inference 与 RTC | tutorial 的 Optimized Inference 一节；remote_inference source code |
| 8 | 真机 RL：reward classifier、actor-learner、HIL-SERL | tutorial 的 RL 一节；hilserl 文档与 rl source code |

快速路线（十几个小时）：第 2、3 站和第 5 站必读，对应研究底稿列的 Unit 1（约 1.5 小时）、tutorial 的 BC 到 VLA（约 4 小时）、SmolVLA 文档与 notebook（约 2 小时）；第 4 站读前三个小节；第 6、7 站在有真机时再读；第 8 站在要做真机 RL 时再读。第 1 站对应 Unit 2，学过 [Modern Robotics](../courses/NW-MODERNROBOTICS.html) 或 [RB2202](../courses/RB2202.html) 的 kinematics 可以跳过。

:::note 和站内其他页面的分工
Behavior cloning 的 $T^2$ compounding error、DAgger、diffusion policy、action chunking 为什么有效、ACT 的 CVAE 与 temporal ensembling 的公式、RT-2、OpenVLA、π0 的结构，在 [RB4301](../courses/RB4301.html) 第 5 到 8 站。Flow matching 的 loss、probability path、Euler sampling 在 [MIT-6.S184](../courses/MIT-6.S184.html)。Decoding 为什么受 memory bandwidth 限制、synchronous 与 naive async 的失败方式、RTC 的 guidance 公式和 soft mask 在 [EE4706](../courses/EE4706.html#sys) 第 7 站。Action 的表示（relative 还是 absolute、rotation 怎么交给 network）和“几次 trial 才算数”在 [MIT-6.4210](../courses/MIT-6.4210.html#policy) 第 7 站。SAC、RLPD 的推导在 [现代强化学习实践](../courses/MODERN-RL.html#offpolicy)，VLA 的 RL fine-tuning 在[同一页](../courses/MODERN-RL.html#finetune)。Jacobian、singularity 和 Newton–Raphson IK 的完整讲法在 [RB2202](../courses/RB2202.html#jac)。这一页只在用到时指过去。
:::

## [classic] Classical robotics：planar 2R arm、IK、differential IK 与 feedback

:::skip
快速路线可以跳过；学过 [RB2202](../courses/RB2202.html#ik) 或 [MIT-6.4210](../courses/MIT-6.4210.html#diffik) 的 differential IK 也可以跳过。能写出 2R arm 的 forward kinematics，解出一个目标点的两组 IK 并用约束排掉一组，算出一步 $\dot q=J^+\dot p^*$，说出 feedback 项消掉了什么误差、没消掉什么，就可以去第 2 站。
:::

Unit 2 只讲到 classical robotics 在哪里卡住为止，目的是让后面改用 data 的理由具体可见。它按 tutorial 的顺序走：先把 motion 分类，再用一条被锁成平面的 SO-100 算一遍 forward kinematics、inverse kinematics、differential IK，加上 feedback，最后列出四条 limitation。

### 三类 motion，和“只用 explicit model”这条路

Unit 2 先把产生 motion 的方法分成两派：**explicit（dynamics-based）**，靠手写的 rigid body 和 contact 的 model，例如 PID 和 MPC；**implicit（learning-based）**，从 data 里学 robot 与环境的交互，例如 RL 和 imitation learning。两者可以合用：tutorial 举的例子是把 TD-learning 和 MPC 接在一起，或者让 learning 去补 explicit model 太粗糙的那一块（perception、contact）。

Motion 本身按“任务改变了什么”分三类，Unit 2 给的判别方法是问 “what changes most?”：

| 类别 | 主要改变的是 | 例子 |
|---|---|---|
| Manipulation | 环境（物体的 pose 和状态），robot 本身位置不动 | arm 抓取、装配、用工具 |
| Locomotion | robot 自己在环境里的位置 | wheeled base、自动驾驶、legged robot |
| Mobile manipulation | 两者都改变，而且耦合 | 带 arm 的 mobile base；要协调的 variable 比前两类都多 |

这个分类决定 dataset 里该录哪些 sensor、policy 该预测什么 action space（joint velocity 还是 base velocity），后面几站都在 manipulation 这一类里。Unit 2 还给了一个成本的对比：SO-100 几百欧元、几个小时能 3D 打印出来；工业的 Franka Panda 几万欧元，设计不公开。这一页的例子都用 SO-100/SO-101。

### Forward kinematics

SO-100 有 5 个 joint 加一个 gripper。Tutorial 把 shoulder pan、wrist flex、wrist roll 锁住，只留 shoulder lift 和 elbow flex，arm 就变成一条在竖直平面里动的 2-dof planar manipulator，configuration 是 $q=[\theta_1,\theta_2]$，两段 link 一样长，都是 $l$。

Forward kinematics（FK）回答“给定 joint，hand 在哪里”。第一段 link 的终点（elbow）在 $(l\cos\theta_1,\ l\sin\theta_1)$；第二段从 elbow 出发，相对 world 转了 $\theta_1+\theta_2$，再加上 $(l\cos(\theta_1+\theta_2),\ l\sin(\theta_1+\theta_2))$。两段相加：

$$p(q)=\begin{pmatrix}l\cos\theta_1+l\cos(\theta_1+\theta_2)\\ l\sin\theta_1+l\sin(\theta_1+\theta_2)\end{pmatrix}$$

用一次：取 $l=0.10$ m，$\theta_1=30^\circ$，$\theta_2=60^\circ$，

$$p=\begin{pmatrix}0.10\times0.866+0.10\times\cos 90^\circ\\ 0.10\times0.5+0.10\times\sin 90^\circ\end{pmatrix}=\begin{pmatrix}0.0866\\ 0.150\end{pmatrix}\ \text{m}$$

FK 总是一行算式就能算完，给定 $q$ 只有一个答案。$q\in[-\pi,\pi]^2$ 时 hand 能到的地方是半径 $2l=0.2$ m 的 disk。

### Inverse kinematics：两组解和一个约束

Inverse kinematics（IK）反过来问：要让 hand 到 $p^*$，$q$ 取什么。2R arm 可以直接解。设 $p^*=(0.12,\ 0.09)$ m，它到 base 的距离 $r=\sqrt{0.12^2+0.09^2}=0.15$ m。两段 link 和 $r$ 构成一个三角形，由 law of cosines（$r^2=l^2+l^2+2l^2\cos\theta_2$，这里 $\theta_2$ 是第二段相对第一段的转角）：

$$\cos\theta_2=\frac{r^2-2l^2}{2l^2}=\frac{0.0225-0.02}{0.02}=0.125,\qquad \theta_2=\pm82.8^\circ$$

$\theta_2$ 有正负两个值，对应 elbow 在 $p^*$ 连线的哪一侧。$\theta_1$ 等于“$p^*$ 的方向角”减去“第二段 link 让 hand 偏开的角度”：

$$\theta_1=\operatorname{atan2}(0.09,\ 0.12)-\operatorname{atan2}\big(l\sin\theta_2,\ l+l\cos\theta_2\big)=36.87^\circ\mp41.41^\circ$$

两组解：A 是 $\theta_2=+82.8^\circ,\ \theta_1=-4.54^\circ$；B 是 $\theta_2=-82.8^\circ,\ \theta_1=78.28^\circ$。代回 FK 两组都得到 $(0.12,\ 0.09)$。

现在加上 Unit 2 的第二张图里那块 surface。Arm 装在桌面上，link 不能穿过桌面，tutorial 把它写成 $\theta_1\in[0,\pi]$，而且 $\theta_2$ 能取的范围还取决于 $\theta_1$。A 的 $\theta_1<0$，elbow 在 $(0.0997,\ -0.0079)$，比桌面低 0.8 cm，不可行；只剩 B。

::fig[hfl-ik] 同一个 $p^*$ 有两组 $q$。约束不改变 FK 的公式，只把可行的 $q$ 删掉一部分。

一般的 arm 没有这种封闭解，Unit 2 把 IK 写成 optimization：

$$\min_{q\in\mathcal Q}\ \|p(q)-p^*\|_2^2$$

$\mathcal Q$ 是满足 joint limit、不碰 surface、不碰障碍物的 $q$ 的集合。Unit 2 第三张图再加一个架子，$\mathcal Q$ 又少一块。Unit 2 的 warning 列了 IK 难的三个原因：多组解、nonlinear、constraint；这个例子里三样都出现了。如果要沿一条 trajectory $[p_0^*,p_1^*,\dots,p_K^*]$ 走，tutorial 指出要解 $K$ 次 IK，每次都可能跳到另一组解（[RB2202](../courses/RB2202.html#ik) 有一个这样跳变的动图）。

:::wrong IK 的解只要代回 FK 对得上，就可以发给 robot
A 和 B 代回 FK 都精确地得到 $(0.12,\ 0.09)$，A 却会让 link 1 撞进桌面。FK 对得上只说明 hand 到了，不说明 arm 的其他部分在哪里。Unit 2 quiz 第 5 题问的就是这一点：constraint 不改 FK，改的是可行的 $q$。
:::

### Differential IK：解 velocity 而不是 position

IK 难解时，Unit 2 改为处理小的 motion。对 FK 用 chain rule，$\dot p=J(q)\,\dot q$，$J(q)=\partial p/\partial q$ 是 Jacobian。对 2R arm 逐项求导：

$$J(q)=\begin{pmatrix}-l\sin\theta_1-l\sin(\theta_1+\theta_2) & -l\sin(\theta_1+\theta_2)\\ l\cos\theta_1+l\cos(\theta_1+\theta_2) & l\cos(\theta_1+\theta_2)\end{pmatrix}$$

Differential IK 给定想要的 hand velocity $\dot p^*$，解 joint velocity：

$$\dot q=\arg\min_\nu\ \|J(q)\,\nu-\dot p^*\|_2^2=J(q)^+\,\dot p^*$$

$J^+$ 是 Moore–Penrose pseudo-inverse；$J$ 是 square 且 invertible 时 $J^+=J^{-1}$。然后积分出下一步的 configuration：$q_{t+1}=q_t+\Delta t\,\dot q_t$。

在解 B（$\theta_1=78.28^\circ,\ \theta_1+\theta_2=-4.54^\circ$）上算一次。第一列是 $(-p_y,\ p_x)=(-0.09,\ 0.12)$，第二列是 $(-l\sin(-4.54^\circ),\ l\cos(-4.54^\circ))=(0.0079,\ 0.0997)$：

$$J=\begin{pmatrix}-0.0900 & 0.0079\\ 0.1200 & 0.0997\end{pmatrix},\qquad \det J=(-0.0900)(0.0997)-(0.0079)(0.1200)=-0.00992$$

$\det J$ 也等于 $l^2\sin\theta_2=0.01\times\sin(-82.8^\circ)=-0.00992$；$\theta_2=0$（arm 伸直）时它为 0，$J$ 不可逆，这就是 singularity（[RB2202](../courses/RB2202.html#jac)）。2×2 的逆：

$$J^{-1}=\frac1{\det J}\begin{pmatrix}0.0997 & -0.0079\\ -0.1200 & -0.0900\end{pmatrix}=\begin{pmatrix}-10.05 & 0.80\\ 12.09 & 9.07\end{pmatrix}$$

要 hand 以 3 cm/s 水平往左走，$\dot p^*=(-0.03,\ 0)$ m/s：

$$\dot q=\begin{pmatrix}-10.05\times(-0.03)+0.80\times0\\ 12.09\times(-0.03)+9.07\times0\end{pmatrix}=\begin{pmatrix}0.301\\ -0.363\end{pmatrix}\ \text{rad/s}=\begin{pmatrix}17.3\\ -20.8\end{pmatrix}{}^\circ/\text{s}$$

### Feedback：model 错了会怎样

$J^+\dot p^*$ 完全相信 model。设 model 以为 $l=0.10$ m，真实的 link 是 0.11 m（10% 的误差，相当于 calibration 不准）。用 model 解出的解 B 发给 robot，真实的 hand 在 $1.1\times(0.12,\ 0.09)=(0.132,\ 0.099)$，离 $p^*$ 已经差 $0.1\times0.15=15$ mm。之后每一步 $\dot q$ 都按 model 算，真实的 hand 一直是 model 位置的 1.1 倍，误差一直是 $0.1\,|p^*(t)|$：沿直线往左走 2 s（$p^*$ 从 $(0.12,0.09)$ 走到 $(0.06,0.09)$），误差从 15 mm 只降到约 10.8 mm，这是因为 $|p^*|$ 变小了，误差并没有被纠正。

Unit 2 的做法是把测到的 pose 误差 $\Delta p=p^*-p(q)$ 送回去，这里的 $p(q)$ 是测出来的（例如 camera 看到的），不是 model 算出来的：

$$\dot q=J(q)^+\big(\dot p^*+k_p\,\Delta p\big)$$

它为什么能消掉误差：真实的 hand velocity 是 model 的 1.1 倍，$\dot p=1.1\,J_{\text{model}}\dot q=1.1(\dot p^*+k_p\Delta p)$。误差的变化率

$$\dot{\Delta p}=\dot p^*-\dot p=-0.1\,\dot p^*-1.1\,k_p\,\Delta p$$

第二项让 $\Delta p$ 以 $e^{-1.1k_pt}$ 衰减；第一项是一个一直存在的小推力，误差停在 $\Delta p=-0.1\dot p^*/(1.1k_p)$。取 $k_p=5$：$|\Delta p|\to0.1\times0.03/5.5=0.55$ mm。用 $\Delta t=1/30$ s 一步步模拟：0.5 s 时误差 0.39 mm，2 s 时 0.54 mm。Open loop 是 10.5 mm（2 s 时，含 Euler 积分本身的一点偏差）。

::fig[hfl-fb] 同一个错的 model，同一条要走的直线。左边 open loop，hand 一直偏在直线外；右边加了 $k_p=5$ 的 feedback，半秒内贴到直线上。

Feedback 只消掉它测得到的误差。Unit 2 的第四张图里，一块 box 在 surface 上以 $\dot x_B$ 移动，arm 要躲开它；tutorial 说 $\dot x_B$ 已知时可以解析地处理，但若它带随机扰动 $\dot x_B\leftarrow\dot x_B+\varepsilon$、$\varepsilon\sim N(0,1)$，就只能每个 control cycle 用 feedback 维持一个距离条件。更强的做法是 feedback linearization、PID、LQR、MPC；tutorial 补充说调 gain 很费人工，contact 会带来 hybrid dynamics 和 Jacobian 的不连续，这常常逼人用保守的 gain。Unit 2 的 tip 给的实际做法：$k_p$ 从小往上加，盯着 oscillation，并加 watchdog 和 command 的 saturation。

:::wrong $k_p$ 越大越好：误差衰减得越快，steady-state 误差 $0.1\dot p^*/(1.1k_p)$ 也越小
连续时间的推导里确实如此，但 controller 每 $\Delta t$ 才更新一次。离散后误差每步大约乘 $(1-1.1k_p\Delta t)$：$k_p=5$、$\Delta t=1/30$ 时是 $0.817$；$k_p=50$ 时是 $1-1.833=-0.833$，误差每步变号、慢慢缩小，模拟出来 0.5 s 时还有 1.3 mm，比 $k_p=5$ 的 0.39 mm 还大；$k_p=60$ 时是 $-1.2$，绝对值大于 1，误差每步放大，模拟到 0.5 s 时已经是 161 mm，arm 来回甩。不发散的条件是 $|1-1.1k_p\Delta t|<1$，即 $k_p<2/(1.1\Delta t)=54.5$。Unit 2 的 tip 说“盯着 oscillation、从小往上加”，原因在这里。
:::

### 四条 limitation

Unit 2 用一张图列出 dynamics-based 方法的四条问题，后面每一站都是在回应其中一条：

1. **Integration。** Sensing、state estimation、mapping、planning、(diff-)IK、low-level control 各自开发，接口固定。前一块的误差传给下一块，任何一块变了整条 pipeline 都可能坏。
2. **Scalability。** Classical planner 在一个紧凑的、假定足够的 state 上工作；要直接用 RGB、depth、tactile、audio 这类高维、带 noise 的 input，就得为每种 sensor 和每个任务手工设计 feature。Tutorial 补了一句：每个新任务往往要重写 planner、goal 和 safety constraint，很少能复用。
3. **Modeling。** Contact、friction、compliance 很难准确建模；rigid body 的近似在 deformable 物体上不成立；参数稍有偏差，行为就变（上面 10% 的 link 误差就是一个最轻的版本）。
4. **Data。** 越来越多公开的、由许多个人分散贡献的 robot dataset，dynamics-based 方法用不上。

Unit 2 的结论是 learning 应当做到三件事：把 perception 和 control 接得更紧、少靠专家建模就能跨任务和 embodiment、随着 data 变多而变好。它同时提醒：纯 learning 和纯 classical 是一个 false dichotomy，例如可以把 control theory 的 safety constraint 和 learning 合起来用。第 6 站的 `max_relative_target` 和第 8 站的 end-effector bounds 就是这种组合。

:::from
分类、2R arm 的 FK、IK 的 optimization 写法、IK 难的三个原因、differential IK 与 pseudo-inverse、feedback 公式、$k_p$ 的调法、四条 limitation 与“false dichotomy”来自 [Robotics Course Unit 2](https://huggingface.co/learn/robotics-course/unit2/1) 第 1 到 5 页（源码逐字读过）。锁住哪几个 joint、$\theta_1\in[0,\pi]$ 的 surface 约束、$q_{t+1}=q_t+\Delta t\dot q_t$、$K$ 次 IK、移动的 box 与 $\varepsilon\sim N(0,1)$、调 gain 与 contact 的困难来自 [tutorial 的 classical robotics 一节](https://arxiv.org/html/2510.12403)（WebFetch 的逐段转述）。课程没有给任何数字：$l=0.10$ m、$p^*=(0.12,0.09)$、两组 IK 的角度、$J$ 与 $J^{-1}$、3 cm/s、10% 的 link 误差、open loop 与 feedback 的误差、离散后 $k_p<54.5$ 的条件都是为这一页构造并用 Python 算的。
:::

## [record] Data collection：teleoperation、loop 频率与 episode 设计

:::skip
快速路线必读。能说出 lerobot-record 每个 tick 做哪几步、dataset 里的 action 和 observation.state 分别是什么，能读 cadence report 判断 fps 可信不可信，能设计一组每种 variation 重复多次的 50 条示教，就可以去第 3 站。
:::

### 一个 tick 里发生了什么

SO-101 的标准做法是 leader-follower teleoperation：人手里拿一条和 robot 同样结构、但不带负载的 leader arm，follower arm 跟着 leader 的 joint position 走。CS224R 第 2 讲把采集方式分成三种：kinesthetic teaching（直接推着 robot 走，界面简单，但人出现在 camera 里）、remote controller（手柄、VR，latency 可能高）、puppeteering（leader-follower，要两套硬件）。LeRobot 默认用第三种。同一页 slide 还提醒，有的领域（slide 举 quadruped）根本收不到 demonstration；人或动物的 video 有 embodiment gap（外形和身体能力都不同），不能直接拿来当 action label，只能帮助 exploration。

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

读法：effective cadence 29.88 Hz 对 30 Hz，差 0.4%，可以接受；16 个 tick 超过 budget，observe 占了 74.4% 的工作时间，最坏一次 40.2 ms，说明超时的原因是 camera；pacing headroom 平均 15.1 ms，loop 还有余量。开头的情形里 effective cadence 会是 25 Hz，headroom 接近 0。这个 25 对 30 的例子就是 il_robots 文档自己举的：“一个实际跑在 25 Hz 的 session 产出的 dataset 仍然声称是 30”。Episode 之间的 reset 阶段同样按 fps 定时，但不算进这些数，因为它什么都不录。

:::wrong 设了 `--dataset.fps=30`，dataset 就是 30 Hz 的
`fps` 只是 loop 的目标。实际达到多少要看 cadence report。开头的例子里差了 17%（25 对 30），dataset 文件里看不出任何异常：frame 数、timestamp、video 的 frame rate 都自洽，只是和真实时间对不上。解决办法是降 camera resolution（1920×1080 换成 640×480，LeRobot 的 train 与 deploy 示例都用这个 resolution）、减少 camera 数量，或者把 fps 降到 loop 能稳定达到的值，再看一遍 cadence。`--dataset.streaming_encoding=true` 省掉了每个 frame 先写 PNG、episode 结束再 encode 的那一步，但 streaming encoding 文档提醒 encoder thread 会在 capture 期间和 control loop 抢 CPU，打开它之后同样要重看 cadence。
:::

### 一组能用的 episode

LeRobot 文档给的起点是：抓一个物体放进 bin，录至少 50 个 episode，每个位置 10 条（也就是 5 个位置）。SmolVLA 论文的 SO-100 dataset 就是这样录的：“5 个起始位置各 10 条”。文档补充说，用 25 条的版本试过，效果差。

这个结构背后的理由可以用 CS224R 第 2 讲的分法说清楚：data 里同一种情形只有一种做法时（一个 consistent 的 demonstrator），unimodal 的 policy 就够；做法不一致时，需要一个能表示多个 mode 的 generative policy（[RB4301 第 6 站](../courses/RB4301.html#gen)）。录制时能控制的是前者，所以文档要求“camera 固定、抓取方式保持一致”。每个位置重复 10 次，是让 policy 在每个位置附近都见到足够多、做法一致的 sample。

文档还给了一条判断标准：**只看 camera 的画面，你自己能不能完成这个任务**。物体被 gripper 挡住、wrist camera 看不到 bin，policy 也看不到。

Variation 要一层一层加：先在 5 个位置上做到稳定抓取，再加新位置、新的抓法、动 camera。文档明确说太快加入太多 variation 会拖累结果。

:::edge Episode 的长度和 reset
默认 `--dataset.episode_time_s=60`、`--dataset.reset_time_s=60`。任务 20 s 就能完成时，用右方向键（或 `n`）提前结束这一条；做坏了用左方向键（或 `r`）丢掉重录。一条 episode 结尾停着不动的那几秒会被当成“正确的 action 是不动”学进去，[RB4301 第 7 站](../courses/RB4301.html#chunk)讲过 single-step policy 在停顿上会卡住，所以录完一个动作就结束 episode。中途断了用 `--resume=true` 接着录，这时 `--dataset.num_episodes` 是**还要录的条数**，不是总数，并且必须给 `--dataset.root`（本地存新录部分的路径）；`lerobot-record` 会在 repo id 后面加上日期时间（`record-test_20260929_143012` 这样），接着录时要写完整的名字。不带 `--resume=true` 重跑同一条命令，会开一个带新时间戳的新 dataset。
:::

### 用 Python 自己写录制循环

`lerobot-record` 背后的东西，tutorial 的 Code 2 用二十几行 Python 摆出来了（录一个 SO-100、一个叫 `front` 的 640×480 camera）。它的结构：

1. `FPS = 30`、`EPISODE_TIME_SEC = 60`、`RESET_TIME_SEC = 10`、`NUM_EPISODES = 5`；follower 和 leader 的 port 用 `lerobot-find-port` 找，`id` 决定读哪一份 calibration。
2. Dataset 的 feature 不手写，从 robot 的描述生成，合在一起交给 `LeRobotDataset.create`：

   ```python
   action_features = hw_to_dataset_features(robot.action_features, "action")
   obs_features = hw_to_dataset_features(robot.observation_features, "observation")
   dataset = LeRobotDataset.create(
       repo_id=..., fps=FPS, features={**action_features, **obs_features},
       robot_type=robot.name, use_videos=True, image_writer_threads=4)
   ```
3. 每条 episode 调一次 `record_loop(robot, teleop, dataset, control_time_s=60, ...)`；之后再调一次 `record_loop` 跑 10 s 的 reset，这一次**不传** `dataset`，所以 reset 时的动作不进 dataset。
4. 按了“重录”就清掉 episode buffer 再来；否则 `dataset.save_episode()`，episode 计数加一。
5. 全部录完，`dataset.push_to_hub()`。

和第 3 站有关的一点：v3 是边录边往共享的 parquet 里写，按 `lerobot-dataset-v3` 文档，自己写录制代码时 push 之前必须先调 `dataset.finalize()`，否则 parquet 文件的 footer 没写完，dataset 读不出来。WebFetch 读到的 tutorial Code 2 在 `push_to_hub()` 前没有这一行；il_robots 文档里同样结构的录制脚本在循环结束后调了 `dataset.finalize()`。照 tutorial 抄时要补上；`lerobot-record` 自己会调。

### Camera 的名字就是 feature 的名字

`--robot.cameras="{ wrist: {...}, top: {...} }"` 里的 `wrist`、`top` 会变成 dataset 的 key `observation.images.wrist`、`observation.images.top`。用这个 dataset 训出的 policy，deploy 时期望同样的名字和同样的 resolution。文档的要求是：录制、train、deploy 三步用同一个 `--robot.cameras`。名字对不上时用第 5 站的 rename map。

Index 也要固定。`index_or_path: 0` 和 `1` 是系统给 camera 的编号，USB 插拔或重启后可能互换；wrist 和 top 互换后名字还对，画面却错了，policy 不会报错，只会表现很差。

:::from
采集方式的三分法、quadruped 与 video 的 embodiment gap、“单一 demonstrator 用 unimodal policy 就够”来自 [CS224R 2026 Lecture 2](https://cs224r.stanford.edu/slides/02_cs224r_imitation_2026.pdf)（WebFetch 逐页读了 slide 28、29、20 的文字；kinesthetic teaching 与 remote controller 的利弊在 PDF 文字层里排版交错，“界面简单”属于哪一种是按版面推断的）。Python 录制循环来自 [tutorial](https://arxiv.org/html/2510.12403) 的 Code 2（WebFetch 逐项读了参数）；`finalize()` 的要求来自 `lerobot-dataset-v3` 文档，il_robots 文档的录制脚本在循环之后调用 `finalize()`。录制 loop 的五步与 action 的来源读自 LeRobot source code `scripts/lerobot_record.py`；cadence report 的例子、“timestamp 由 index 得出”、50 条与 5 个位置、只看 camera 能否完成、variation 要慢慢加、键盘控制、resume 的规则（含 `--dataset.root`）、25 Hz 的例子来自 LeRobot 的 [il_robots 文档](https://huggingface.co/docs/lerobot/il_robots)；25 条不够来自 [SmolVLA 文档](https://huggingface.co/docs/lerobot/smolvla)。38 ms 的 observe 是假设的数，500 个 frame、1.2 倍、72°/s 是为这一页算的。“camera index 会互换”和“结尾停顿会被学进去”是经验，没有来源核对。
:::

## [dataset] LeRobotDataset：文件、episode index 与 temporal window

:::skip
快速路线必读。能说出一次 `dataset[i]` 要查哪几个文件，能由 `delta_timestamps` 算出 delta index 和某个 anchor 的 pad 数，知道 `*_is_pad` 在 loss 里怎样用，就可以去第 4 站。
:::

### 为什么不能一个 episode 一个文件

Robotics Course Unit 1 用 ImageNet 作对照：ImageNet 是“一张 image 一个 label”；robot data 有四个不同：multimodal（image、sensor 读数、action 要对齐）、temporal（observation 和 action 都是按时间顺序录的）、episodic（按 trajectory 分段）、high-dimensional（多个 camera、joint state、力）。除了这些逐 frame 的 data，一个 dataset 还要记下 task 的文字描述、robot 的型号、image 和 state 各自的 fps、camera 的种类和 resolution。

Unit 1 把 LeRobotDataset 的设计说成两层：磁盘上一层紧凑的存储，Python 里一层直接给出 tensor 的接口。存储固定分三部分：

- **Tabular data**：joint state、action 这类低维、高频的 data，存成 memory-mapped 的 parquet，交给 Hugging Face 的 `datasets` 库读；
- **Visual data**：camera 的 frame 接起来 encode 成 mp4，同一个 episode 的 frame 一定在同一个 video 里，video 按 camera 分组，再分进子目录，免得一个目录里文件太多；
- **Metadata**：一组 JSON（和 parquet）文件，记 feature 的 schema、fps、normalization 的统计量、episode 的边界。Unit 1 把它比作 relational database 里用 shared key 把几张表连起来的那一层。

为什么要把 episode 合进同一个文件：LeRobot 的 v2 格式一个 episode 一个文件（`lerobot-dataset-v3` 文档），每条一个 parquet、每个 camera 每条一个 mp4。一万条、三个 camera 就是 $10{,}000+3\times10{,}000=40{,}000$ 个文件。Unit 1 说 v3 的目标是支持上百万条 trajectory（几亿到几十亿个 camera frame），而“一百万条 episode 的 dataset 可能只有几百个文件”。代价是：要知道一个 episode 从哪里开始、到哪里结束，必须先查 metadata。

v3 的目录是：

| 路径 | 存什么 |
|---|---|
| `meta/info.json` | 每个 feature 的名字、shape、dtype，`fps`，文件路径的模板 |
| `meta/stats.json` | 每个 feature 的 mean、std、min、max，training 时做 normalization |
| `meta/tasks.parquet` | 任务描述的文字和它的整数编号（Unit 1 写的是 `tasks.jsonl`，那是 v2 的文件名；v3 的文档和代码都是 parquet） |
| `meta/episodes/chunk-000/file-000.parquet` | 每个 episode 一行：长度、task、在共享文件里的起止位置 |
| `data/chunk-000/file-000.parquet` | 逐 frame 的 state、action、timestamp，许多 episode 接在一起 |
| `videos/<camera key>/chunk-000/file-000.mp4` | 每个 camera 一组 mp4，许多 episode 的画面接在一起 |

默认一个 data 文件到 100 MB、一个 video 文件到 200 MB 就换下一个，一个 chunk 目录最多 1000 个文件。Unit 1 建议读一个陌生 dataset 的顺序是：先 `info.json`（schema 和 fps），再 `stats.json`（normalization 用；在代码里是 `dataset.meta.stats`），再各打开一个 data 和 video 文件。

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

Unit 1 给了第二、三种写法取 `dataset[100]` 的 shape：observation 带历史时 image 是 `[3, C, H, W]`（3 个 frame），action 是 `[action_dim]`；action chunking 时 image 是 `[2, C, H, W]`，action 是 `[4, action_dim]`。也就是说，window 的长度成了 tensor 最前面的那个 dimension；接上 `DataLoader`（Unit 1 的例子是 `batch_size=16, shuffle=True, num_workers=4`）之后，batch 再加在它前面，`batch["action"]` 是 `[16, 4, action_dim]`。

库里先把秒换成 frame 的偏移：$\text{round}(\Delta t\times\text{fps})$。30 fps 下 `[-0.2, -0.1, 0.0]` 是 $[-6,-3,0]$，`[0.0, 0.1, 0.2, 0.3]` 是 $[0,3,6,9]$。

换算之前有一道检查：每个 $\Delta t\times\text{fps}$ 必须离整数不超过 $\text{tolerance\_s}\times\text{fps}$。写 0.05 s：$0.05\times30=1.5$，离最近的整数差 0.5 个 frame，即 $0.5/30=0.0167$ s，远大于 $10^{-4}$ s，直接 `ValueError`。

:::wrong 照 Unit 1 的例子写 `"action": [0.0, 0.1, 0.2, 0.3]`，就得到一个 4 步的 action chunk
Unit 1 自己的 tip 写得清楚：`[0.0, 0.1, 0.2]` 是“当前和接下来 2 个 action（相隔 100 ms）”。在 30 fps 的 dataset 上，`[0.0, 0.1, 0.2, 0.3]` 这 4 个 action 是第 0、3、6、9 个 frame 的，彼此隔 100 ms。把它们当成连续 4 个 tick 的 action 来 train 和执行，robot 每个 tick 走了示教里 3 个 tick 的路，快 3 倍，和第 2 站开头的事故同一个形式。LeRobot 自带的 policy 不走这条路：它们在 config 里直接给 frame 的偏移，ACT 是 `action_delta_indices = range(chunk_size)`，即 $0,1,\dots,99$；training script 再把它们换成 $k/\text{fps}$ 秒。自己写 policy 时也应从“要几个连续的 frame”出发，再除以 fps。
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
Diffusion config 里 `drop_n_last_frames: int = 7` 的注释写着它等于 `horizon - n_action_steps - n_obs_steps + 1`。原版的 16、8、2 代进去是 $16-8-2+1=7$；但这个 commit 的默认值已经是 `horizon=64`、`n_action_steps=32`，代进去是 $64-32-2+1=31$，字段仍是 7。Action 的 delta index 是 $-1,0,\dots,62$，按 7 个 frame 丢掉之后，600 个 frame 的 episode 里 anchor 是 0 到 592；$a+62\ge600$ 即 $a\ge538$ 的 55 个 anchor 在结尾带 pad，再加上 $a=0$ 的 $-1$ 那一格，一共 56 个 anchor 带 pad。最后一个 anchor（第 592 个 frame）要的是 591 到 654，其中 600 到 654 这 55 个位置是重复的最后一个 frame，而 loss 不 mask 它们。用 Diffusion 训短 episode 时，值得自己把这个数设成 31，或者打开 `do_mask_loss_for_padding`。这一条是我读 config 时的推算，没有在仓库的 issue 里查到讨论。
:::

### Streaming

`StreamingLeRobotDataset` 不先下载，从 Hub 一边读一边训，接口和 `LeRobotDataset` 相同；training 时加 `--dataset.streaming=true`。Unit 1 报告 network 好时约每秒 80 到 100 个 iteration，扣掉初始化后接近本地读取。它适合 dataset 比 disk 大、想快速试几个 dataset、或在云上 train 的情形。文档说明 streaming 仍然保证每个 epoch 每个选中的 frame 恰好访问一次，episode 被取进一个有上限的 memory pool 里打乱。

:::from
ImageNet 的对照与四个特点、两层设计、三部分结构、relational 的比喻、读目录的顺序、“一百万条只有几百个文件”、`delta_timestamps` 的三种写法与 shape、`DataLoader` 的例子、“相隔 100 ms”的 tip、streaming 的速度和适用情形来自 [Robotics Course Unit 1 第 3 页](https://huggingface.co/learn/robotics-course/unit1/3)和[第 4 页](https://huggingface.co/learn/robotics-course/unit1/4)（源码逐字读过）。Unit 1 写的 `tasks.jsonl` 与 v3 的 `tasks.parquet` 不一致，以 v3 文档和代码为准。目录表、v2 到 v3 的变化、`finalize()` 与 streaming 的说明来自 LeRobot 的 `lerobot-dataset-v3` 文档。查询的四步、`from_timestamp`、`tolerance_s` 的检查、`delta_window` 的 clamp 与 mask、文件大小的默认值、ACT 的 masked L1、Diffusion 的 `do_mask_loss_for_padding` 与 `drop_n_last_frames` 读自 source code （`datasets/dataset_reader.py`、`utils.py`、`feature_utils.py`，`policies/act`、`policies/diffusion`）。四万个文件、三个 episode 的例子、700 号的查询、`[16, 4, action_dim]`、8.25%、56 个 anchor 与 55 个 pad 是为这一页算的。
:::

## [train] Training：从 ACT 起步，step 数、normalization 与瓶颈

:::skip
快速路线只读前三个小节。能按 frame 数和 batch size 算出合理的 `--steps` 并知道 learning rate schedule 会怎样跟着变，能说出 ACT、Diffusion、SmolVLA 默认用哪种 normalization，能从 training log 判断 GPU 是不是在等 data，就可以去第 5 站。
:::

### 为什么先训 ACT

LeRobot 的 ACT 文档说它是“刚开始时我们推荐的第一个 model”：约 80M parameter，一张 GPU 几个小时，常常 50 条示教就有高成功率。同一组 data 上先有一个 ACT 的 baseline，后面换 SmolVLA 时才说得清 pretraining 和 language 带来了多少；第 5 站 SmolVLA 论文的表里，ACT 就是这样一个 baseline。

Tutorial 的 ACT 一节转述了原论文里支持这两个设计的两组数：action chunking 的 ablation 里成功率从 1% 升到 44%；在人类示教上，把 CVAE 换成纯 L1 regression 差了 33.3%，而在 scripted 的示教上两者差不多（scripted 的示教只有一个 mode，见[第 2 站](#record)单一 demonstrator 的讨论）。CVAE 的 encoder 只在 training 时用；inference 时 latent $z$ 直接设成 0，不 sample（ACT 文档也这样写）。

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
| `n_action_steps` | 100 | 每次执行 100 个再重新预测（第 6 站） |
| `vision_backbone` | resnet18，ImageNet pretrained | 每个 camera 一份 feature map |
| `dim_model`、`n_encoder_layers`、`n_decoder_layers` | 512、4、1 | decoder 只有 1 层，见下 |
| `use_vae`、`latent_dim`、`kl_weight` | True、32、10 | loss $=\mathcal L_{\text{L1}}+10\,\mathrm{KL}$ |
| `optimizer_lr` | $10^{-5}$ | backbone 同为 $10^{-5}$ |

`n_decoder_layers=1` 有一段来历，写在 config 的注释里：原版 ACT 代码写的是 7 层，但有一个 bug 让它实际只用到第 1 层，LeRobot 为了复现原版的结果设成 1。

### `--steps` 要自己算

不写 `--steps` 就是 100,000 步。LeRobot 的 hardware guide 给出的经验是 imitation learning 通常在 5 到 10 个 epoch 内 converge，并给了换算方法：

$$\text{steps per epoch}=\left\lceil\frac{\text{总 frame 数}}{\text{GPU 数}\times\text{batch size}}\right\rceil,\qquad\text{total steps}=\text{epoch 数}\times\text{steps per epoch}$$

按第 2 站的 50 条、每条 30 s、30 fps：总 frame 数 $50\times30\times30=45{,}000$。ACT 默认 batch 8，一张 GPU：每个 epoch $45000/8=5625$ 步，5 到 10 个 epoch 是 28,125 到 56,250 步。默认的 100,000 步是 $100000\times8/45000=17.8$ 个 epoch。

Guide 给的耗时参考（5 个 epoch、约 45,000 个 frame、640×480，量级而已，误差 ±50%）：

| 硬件 | Policy | Batch | 耗时 |
|---|---|---|---|
| RTX 4090 / 3090（24 GB） | act | 8 | 30 到 60 分钟 |
| RTX 4090 / 3090（24 GB） | diffusion | 8 | 2 到 4 小时 |
| L4 / A10G（24 GB） | act | 8 | 1 到 2 小时 |
| L4 / A10G（24 GB） | smolvla | 4 | 3 到 6 小时 |
| A100 40 GB | smolvla | 16 | 1 到 2 小时 |
| A100 40 GB | pi0 / pi05 | 4 | 4 到 8 小时 |
| 4× H100 80 GB（`accelerate`） | diffusion | 32 | 30 到 60 分钟 |
| 4× H100 80 GB（`accelerate`） | smolvla | 32 | 1 到 2 小时 |
| Apple M1/M2/M3 Max（MPS） | act | 4 | 6 到 14 小时 |

多 GPU 用 `accelerate launch --num_processes=N`：每一步处理 $N\times$ batch size 个 sample，耗时和单卡一步差不多，所以按上面的公式 steps per epoch 除以 $N$。Guide 明确说只有 CPU 时不要 train，去用 Colab 或租 GPU；Hugging Face Jobs 的 `t4-small`、`t4-medium`（T4）在 guide 里标为“只适合 ACT”。

### Learning rate schedule 跟着 `--steps` 变吗

Hardware guide 有一条提醒：缩短 training（例如小 dataset 上只训 5k 到 10k 步）时，要把 `--policy.scheduler_decay_steps` 也改成约等于 `--steps`，否则 learning rate 一直停在峰值附近。对照这个 commit 的代码，四个常用 policy 的情况不一样：

| Policy | Scheduler | 和 `--steps` 的关系 |
|---|---|---|
| ACT | 没有（`get_scheduler_preset` 返回 None） | learning rate 恒为 $10^{-5}$ |
| Diffusion | diffusers 的 cosine，warmup 500 | 直接按 `--steps` 从峰值降到 0 |
| SmolVLA | cosine with warmup：峰值 $10^{-4}$，warmup 1000，`scheduler_decay_steps=30000`，终值 $2.5\times10^{-6}$ | `--steps` 小于 30000 时自动缩放；大于时不缩放 |
| π0 | 同上，峰值 $2.5\times10^{-5}$，`scheduler_decay_steps=30000` | 同上 |

`optim/schedulers.py` 里的缩放：`--steps` $<$ decay steps 时，比例 $s=\text{steps}/30000$，warmup 变成 $\lfloor1000s\rfloor$，decay 变成 `--steps`。代入 SmolVLA 文档的 20,000 步：$s=0.667$，warmup 666 步，cosine 在第 20,000 步正好降到 $2.5\times10^{-6}$。这个情形 guide 的提醒其实已经被代码处理了。

反过来的情形没有被处理。照 SmolVLA 论文真机 fine-tune 的 200,000 步：$200000>30000$，不缩放，learning rate 在第 30,000 步降到 $2.5\times10^{-6}$ 之后（代码里 `step = min(current_step, decay_steps)`）一直停在那里，后面 170,000 步、即 85% 的 training 都在最低的 learning rate 上。要训得比 30,000 步长，就要同时把 `--policy.scheduler_decay_steps` 设成 `--steps`。

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

Training log 把一个 iteration 拆成 `dataloading_s`（从 DataLoader 取一个 batch）、`preprocessing_s`（image 转换和 policy 的 preprocessor）、`update_s`（forward、backward、optimizer step）。Guide 在 4 张 H100 上测的一组（5000 步、batch 32、约 50 条 episode、640×480）：diffusion 的 `update_s` 0.167 s、`dataloading_s` 0.015 s，GPU 利用率约 90%，共 16 分 17 秒；SmolVLA（这一组把 `freeze_vision_encoder` 和 `train_expert_only` 都关掉了）0.312 s 对 0.011 s，约 80%，27 分 49 秒；pi05（开了 `gradient_checkpointing` 和 bfloat16）2.548 s 对 0.014 s，约 95%，3 小时 41 分。这几组都是 GPU 在忙。Guide 注明这组数早于 log 拆出 `preprocessing_s` 的版本，所以那里的 `dataloading_s` 包含了 preprocessing。如果你看到 `dataloading_s` 和 `update_s` 一样大，GPU 有一半时间在等，加 batch size 不会更快。

在 DataLoader worker 里，最贵的往往是 mp4 decode 和 image augmentation。v3 的 image transform 可以挪到 GPU 上做（`--dataset.image_transforms.backend=gpu`），worker 只负责 decode；文档提醒 `gpu_compile` 每种 image shape 第一次要 15 到 30 s 编译。另一个旋钮是 `--num_workers`（默认 4）。

:::from
ACT 是推荐的起点、80M parameter、默认 batch 8 起步来自 LeRobot 的 [ACT 文档](https://huggingface.co/docs/lerobot/act)；默认值表、decoder 的那段注释、MEAN_STD 的 $10^{-8}$、Diffusion 的 MIN_MAX 和 clip、SmolVLA 的 IDENTITY 读自 `policies/*/configuration_*.py` 与 `processor/normalize_processor.py`。Chunking 的 1% 到 44%、L1 差 33.3%、$z=0$ 来自 [tutorial 的 ACT 一节](https://arxiv.org/html/2510.12403)（WebFetch 转述，数字原出自 ACT 论文，ACT 论文本身没有读）。5 到 10 个 epoch、换算公式、耗时表、多 GPU、CPU 不要 train、T4 只适合 ACT、schedule 的提醒、4×H100 的分项时间来自 hardware guide（`docs/source/hardware_guide.mdx`）；四个 policy 的 scheduler 与缩放规则读自各自的 `get_scheduler_preset` 和 `optim/schedulers.py`、`optim/factory.py`（`build(optimizer, cfg.steps)`）；200,000 步来自 [SmolVLA 论文](https://arxiv.org/html/2506.01844v1)。GPU backend 的说明来自 `lerobot-dataset-v3` 文档。45,000 个 frame 的各个换算、666 步 warmup、170,000 步与 85%、0.088° 与 $8.8\times10^6$ 是为这一页算的；“wrist 只转到 40°”是构造的例子。
:::

## [vla] Fine-tune SmolVLA 与 π0：camera 映射、冻结什么、flow 的方向

:::skip
快速路线必读。能用 `--rename_map` 把自己的 camera 接到 smolvla_base 上，说出默认冻结了什么、一次 inference 过几遍 action expert，并能对 SmolVLA 论文“pretraining 有用”的结论说出它的证据和边界，就可以去第 6 站。
:::

### 一次 inference 里 token 怎样走

SmolVLA 共约 450M parameter，π0 是 3.3B。它们的结构属于 [RB4301 第 8 站](../courses/RB4301.html#vla)讲过的“VLM 加 flow matching 的 action expert”一类。对 deploy 和 fine-tune 有影响的数字来自 SmolVLA 论文和 config：

- **Vision。** 每个 camera 的 image 缩放并 pad 到 512×512，SigLIP encode 后用 pixel shuffle 压成 64 个 token。不做 VLM pretraining 时用的 tiling，只用全局 image。
- **Language 与 state。** Task 文字最多 48 个 token（`tokenizer_max_length=48`）；state 先 pad 到 32 个 dimension（`max_state_dim=32`），再用一个 linear layer 投影成 **1 个** token。
- **VLM。** SmolVLM2（SigLIP 的 vision encoder 加 SmolLM2 的 language decoder，checkpoint 是 `SmolVLM2-500M-Video-Instruct`）只用前 16 层，即 $N=L/2$，丢掉后一半，大部分 compute 跟着减半。
- **Action expert。** 约 100M parameter，hidden size 是 VLM 的 0.75 倍（`expert_width_multiplier=0.75`）；cross-attention 层（action token 只当 query，key/value 来自 VLM 的 feature，可以 cache）和 self-attention 层（action token 之间，causal mask）交替，`self_attn_every_n_layers=2`。
- **Output。** 一个 50 × 32 的 chunk（`chunk_size=50`、`max_action_dim=32`），SO-101 只用前 6 个 dimension。

::fig[hfl-smolvla] 3 个 camera 时 prefix 最多 $3\times64+48+1=241$ 个 token。Prefix 只过一遍 VLM，存成 KV cache；10 步 Euler integration 每一步只过 action expert。

这就是 source code `sample_actions` 的结构：先对 prefix 调一次 `vlm_with_expert.forward`，打开 `use_cache`；然后 `euler_integrate` 做 10 次 `denoise_step`，每次只把 50 个 action token 喂给 expert，读同一份 cache。π0 是同样的两段：prefix 过 PaliGemma（tutorial 写作 Gemma 2.6B 的 backbone 加 PaliGemma 的 image 与 language embedding），10 步只过 300M 的 expert。Tutorial 讲了 π0 为什么能这样 cache：它的 attention mask 分三块（image 与 language、proprioceptive state、action），块内双向，块间只允许后面的块看前面的块，pretrained 的 VLM token 看不到 robot 的 token，所以 prefix 的 key/value 在 10 个 denoising step 之间不变。SmolVLA 换成了普通的 causal mask 加上面那种 CA/SA 交替。所以 inference 的时间大致是“一次 VLM prefill 加十次小 expert”，这也是 [EE4706 第 7 站](../courses/EE4706.html#sys)按 bandwidth 估算的那两项。

### 名字对上：`rename_map` 与 `empty_cameras`

`smolvla_base` 是在社区上传的 SO-100 类 dataset 上 pretrain 的，论文 Table 1 的统计是 481 个 dataset、22.9K 个 episode、10.6M 个 frame（正文别处写作“不到 30k 个 episode”“约 23k 条 trajectory”）。论文为了统一，把 camera 按 top、wrist、side 的顺序排好，在 checkpoint 里叫 `observation.images.camera1`、`camera2`、`camera3`。π0 的做法类似：tutorial 说它固定用三个 camera 的位置，少的用 mask 掉的空位补；action 按 dataset 里 dof 最多的 robot 补零到同一长度。你的 dataset 叫 `top`、`wrist`，training 时不映射就以 feature mismatch 报错。文档的命令：

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

`--task` 的文字也是 input。Deploy 时写的 task 要和录制时 `--dataset.single_task` 一致；SmolVLA 论文 pretrain 时专门用一个现成的小 VLM 重写了社区 dataset 里含糊或缺失的 task 描述。附录给的 prompt 要求：只写一句、不超过 30 个字符、以动词开头（Pick、Place、Open 这类），并给了“pick up the cube and place it in the box”“open the drawer”这样的例子。作者专门做这一步，说明 policy 对这段文字是敏感的；自己录 data 时，task 也照这个风格写成一句短的动词开头的话。

### 冻结什么，要多少 GPU memory

SmolVLA 的默认 `freeze_vision_encoder=True`、`train_expert_only=True`、`train_state_proj=True`：VLM（包括 vision encoder）完全不更新，只训 action expert、state 的投影和 action 的 in/out 投影。这和论文的 pretraining 一致：pretraining 时 VLM 同样冻结，只训 action expert，200,000 步、global batch 256、AdamW（$\beta_1=0.9,\ \beta_2=0.95$）、cosine 从 $10^{-4}$ 降到 $2.5\times10^{-6}$、warmup 100 步，用 4 张 GPU；论文说整个项目一共用了约 30k GPU hour。π0 的默认相反，两个都是 False，整个 3.3B 一起训，learning rate $2.5\times10^{-5}$，gradient clip 1.0。

Hardware guide 的 GPU memory（batch 8，AdamW）：

| 组 | Policy | 峰值 GPU memory | 起步的 GPU |
|---|---|---|---|
| Light BC | act | 约 2 到 6 GB | 笔记本 RTX 3060、L4 |
| Diffusion | diffusion | 约 8 到 14 GB | RTX 4070 以上 |
| Small VLA | smolvla | 约 10 到 16 GB | RTX 4080 以上、L4 |
| Large VLA | pi0、pi0_fast、pi05 | 约 24 到 40 GB | A100 40 GB（24 GB 只够 batch 1） |

GPU memory 不够时三个办法：batch size 减半 GPU memory 大约减半；用 gradient accumulation 补回 effective batch；SmolVLA 保持 `freeze_vision_encoder=True`。π0 系列还可以开 `gradient_checkpointing=true`、`dtype=bfloat16`，guide 在 4 张 H100 上训 pi05 时就是这样设的。

### Pretraining 到底带来了什么

先看论文怎样打分。三个 SO-100 任务各录 50 条示教（5 个起始位置各 10 条），任务是：Pick-Place（把 cube 放进一个固定的小 box）、Stacking（把红 cube 叠到蓝 cube 上，两块的位置都变）、Sorting（红 cube 放右边的 box、蓝 cube 放左边，颜色对调的两种配置各 5 条）。真机的分数是 partial credit：Pick-Place 抓起 cube 得 0.5、放进 box 再得 0.5；Stacking 同样两个 0.5；Sorting 拆成 4 个 0.25（两块 cube 各自的抓起和放对）。所以表里的 75 不是“75% 的 trial 完全成功”，可能是“全部 trial 都抓起来了、一半放进去了”。论文写明 simulation 每个任务 10 次 trial、必须完整完成才算成功；真机每个任务做了多少次 trial，正文和表注里都没有写。

Success rate（%），Table 3 与 Table 5 合在一起：

| Policy | Pick-Place | Stacking | Sorting | 平均 |
|---|---|---|---|---|
| ACT，single-task | 70 | 50 | 25 | 48.3 |
| π0（3.5B），multi-task | 100 | 40 | 45 | 61.7 |
| SmolVLA，no pretraining，single-task | 55 | 45 | 20 | 40.0 |
| SmolVLA，no pretraining，multi-task | 80 | 40 | 35 | 51.7 |
| SmolVLA，pretrained，multi-task | 75 | 90 | 70 | 78.3 |

这张表支持的结论：同样 multi-task fine-tune，pretraining 把平均从 51.7 提到 78.3；同样 single-task，不做 pretraining 的 SmolVLA（40.0）不如 ACT（48.3）。在这三个各 50 条示教的真机任务上，SmolVLA 的优势主要来自那 22.9K 个社区 episode 的 pretraining。

这个结论不能推到“结构本身没用”。同一篇论文在 simulation 里，SmolVLA 不做 robot pretraining（Table 2 里 VLA Pt. 一列是 No）也很强：

| Policy | VLA pretraining | LIBERO 平均 | Meta-World 平均 |
|---|---|---|---|
| Diffusion Policy | 无 | 72.4 | 10.5 |
| OpenVLA（7B） | 有 | 76.5 | 无 |
| π0（3.3B / 3.5B） | 有 | 86.0 | 47.9 |
| SmolVLA（0.45B） | 无 | 87.3 | 57.3 |

LIBERO 每个 suite 有 10 个任务、各 50 条示教（这一点是凭对 LIBERO 的了解，没有在本页读过的材料里核对），data 比单个真机任务多一个数量级；在这里 SmolVLA 不做 robot pretraining 就和 pretrained 的 π0 持平。两个 setting 合起来读：data 少时 pretraining 决定成败，data 够时结构（frozen VLM 的 feature、flow matching 的 expert）本身也够用。

它不支持的结论：“SmolVLA 在每个任务上都更好”。Pick-Place 上 π0 是 100，SmolVLA 75。论文的 SO-101 实验还有一组 Lego pick-place（把粉色 Lego 放进一个透明 box，要求抓得更准）：ACT in-distribution 70、out-of-distribution 40，SmolVLA 90 和 50；新位置上两者都掉了很多。真机的 trial 次数没有写，分数又带 partial credit，75 对 70 这样 5 分的差别到底对应几次成功，从论文里算不出来；[MIT-6.4210 第 7 站](../courses/MIT-6.4210.html#policy)算过，即使是 80% 对 60% 这样 20 个百分点的差别，每个 policy 10 次 trial 时 Fisher exact test 的 p 也有 0.628，5 个点的差别更分不开。

### 论文的 ablation 能说明什么

:::skip
加深内容。跳过它会少掉“读 VLA 论文的 ablation 时先看 baseline 是哪一行”这个习惯，以及 SmolVLA 各个设计各自有多少证据。
:::

Section 4.7 的 ablation 全在 LIBERO 上做，从零 train（不做 robotics pretraining），VLM 冻结，只训 action expert。各张表（LIBERO 四个 suite 的平均，%）：

| 被改的设计 | 选项与结果 |
|---|---|
| Attention（Table 6） | 只用 CA 79.0；只用 SA 74.5；CA 与 SA 交替 85.5 |
| Mask（Table 7） | bidirectional 67.5；causal 74.5 |
| VLM 层数（Table 8） | 8 层 75.0；16 层 78.5；24 层 79.5；32 层 80.3；隔层跳（skip %2）75.5；换更小的 256M VLM 75.8 |
| Expert 宽度（Table 9） | 1.00 倍 82.3；0.75 倍 77.5；0.50 倍 80.3；0.25 倍 73.8 |
| Objective（Table 10） | flow matching 80.25；L1 regression 75.25 |
| State 送到哪（Table 11） | 送进 VLM（prefix）+ CA 80.3；送进 expert（suffix）+ CA 73.3；prefix + SA 53.3；suffix + SA 74.8 |
| Chunk size（Table 12） | 1 → 50.0；10 → 84.0；30 → 78.5；50 → 80.3；100 → 74.5 |
| 执行步数（Table 13） | 1 → 80.3；10 → 82.8；30 → 70.8；50 → 51.8 |

读这组表要先找 baseline。四个 suite 是 89、94、85、53、平均 80.3 的那一行出现在 Table 8（32 层）、Table 9（0.50 倍）、Table 10（flow matching）、Table 11（prefix + CA）、Table 12（chunk 50）、Table 13（执行 1 步）里，说明 ablation 的参照 configuration 是“32 层、0.5 倍宽、只用 CA、chunk 50、每步重新预测”，和最终发布的 SmolVLA（16 层、0.75 倍、CA/SA 交替）不是同一个。所以这些数只能横向比同一张表里的几行，不能和最终 model 的 87.3 比。

逐条用一次：flow matching 比 L1 高 5 个点，支持“action 有多个 mode 时 generative objective 更好”，和第 4 站 ACT 的 33.3% 是同一个方向；state 进 prefix 在 CA 下好 7 个点。Expert 宽度这一条，论文正文说“0.75 倍在效果和效率之间平衡得最好”，但表里 0.75 倍（77.5）比 0.50 倍（80.3）还低，这句话没有被这张表支持。16 层对 32 层只差 1.8 个点，却省了一半的 VLM compute，这是“只用前一半层”的证据。

:::wrong 按 MIT-6.S184 的写法，$t=0$ 是 noise、$t=1$ 是 data，所以改 LeRobot 的 sampling 时让 $t$ 从 0 走到 1
LeRobot 的 π0、π0.5、SmolVLA 沿用 openpi 的 convention，方向相反（`policies/common/flow_matching.py` 里叫 `NOISE_AT_ONE`）：

$$x_t=t\,\varepsilon+(1-t)\,a,\qquad u=\varepsilon-a$$

Sampling 时 $t$ 从 1 走到 0，每步 $dt=-\tfrac1{10}$。

用 1D 的情形算一遍。Action $a=0.6$，noise $\varepsilon=-1.2$，target velocity $u=\varepsilon-a=-1.8$，学好的 network 在这条直线上就输出 $-1.8$。从 $x=\varepsilon=-1.2$ 出发，按 LeRobot 的写法走 10 步：

$$x\leftarrow x+dt\cdot v=x+(-0.1)(-1.8)=x+0.18,\qquad -1.2+10\times0.18=0.6$$

到达 action。照 6.S184 的习惯写成 $dt=+0.1$：$-1.2+10\times(0.1)(-1.8)=-3.0$，离 action 越来越远。Source code 的 docstring 专门警告了这一点：training 时用的 convention 和 sampling 时用的不一致，什么检查都不会报错，policy 学到的 velocity 只是指向自己 schedule 的反方向。Time 的 sampling 也不同：这几个 policy 的 $t$ 取自 $\mathrm{Beta}(1.5,1)$ 乘 0.999 加 0.001，不是 uniform。$\mathrm{Beta}(1.5,1)$ 的 density 是 $1.5\,t^{0.5}$，随 $t$ 增大，$P(t>0.5)=1-0.5^{1.5}=0.646$，mean 是 $1.5/2.5=0.6$；在 noise 在 $t=1$ 的 convention 下，这就是偏向 noise 一端，和 tutorial 说的“更多地训练噪声大的 chunk，让 model 学到 $\mathbb E[a\mid o]$ 而不是 identity map”一致。

Tutorial 自己的公式在这里也容易误导。它的 Eq. 52 把 network 的 input 写成 $\tau a+(1-\tau)\varepsilon$（$\tau=1$ 是 data），target 却写成 $\varepsilon-a$；Eq. 53 让 $\tau$ 往上走：$a^{\tau+\delta}=a^\tau+\delta\,v_\theta$。这三处不能同时成立：对 $\tau a+(1-\tau)\varepsilon$ 求导得到的是 $a-\varepsilon$，符号和 target 相反。照这组公式实现，正好得到上面 $dt=+0.1$ 那条跑到 $-3.0$ 的线。在它的 convention 下 $\mathrm{Beta}(1.5,1)$ 偏向的是 $\tau$ 大、也就是 data 一端，又和它自己说的“偏向更 noisy 的 timestep”矛盾。只有按代码的 `NOISE_AT_ONE` 去读，三件事才对得上。
:::

::fig[hfl-flowdir] 同一个 velocity，$dt$ 的符号写反，10 步之后差 3.6。

:::edge π0 的 relative action
LeRobot 默认的 action 是 absolute joint position（dataset 里存的就是它）。π0 的 config 有 `use_relative_actions`（默认 False），打开后 action 变成“相对当前 state 的偏移”，gripper 默认排除在外（`relative_exclude_joints=["gripper"]`）。openpi 原版用 relative action；从 openpi 的 checkpoint 出发 fine-tune 时，这个开关要和它的 train 方式对上。Relative 和 absolute 各自的利弊在 [MIT-6.4210 第 7 站](../courses/MIT-6.4210.html#policy)。
:::

:::from
SmolVLA 的结构数字（450M、16 层、64 token、0.75 倍、CA/SA 交替、state 一个 token、10 步、chunk 50、512×512）、Table 1 的 dataset 统计、task 重写的 prompt、camera 的统一顺序、pretraining 的 hyperparameter 与 GPU hour、partial-credit 的评分规则、Table 2 到 13 的数字、ablation 的设定来自 [SmolVLA 论文](https://arxiv.org/html/2506.01844v1)（WebFetch 读了全部表格与相关各段的逐段转述）；π0 的 Gemma 2.6B 与 300M、三块 attention mask、三个 camera 与 action 补零、Eq. 52 与 53、SmolVLA 的 causal mask 来自 [tutorial 的 π0 与 SmolVLA 两节](https://arxiv.org/html/2510.12403)（WebFetch，公式按 LaTeX 读到）。Rename map 的命令、feature mismatch、`empty_cameras` 来自 LeRobot 的 [SmolVLA 文档](https://huggingface.co/docs/lerobot/smolvla)和 rename_map 文档；GPU memory 表来自 hardware guide；冻结的默认值、π0 的 hyperparameter、prefix 与 KV cache 的两段、flow 的 convention 与 Beta distribution读自 `policies/smolvla`、`policies/pi0`、`policies/common/flow_matching.py`。241 个 token、1D 的 Euler 算例、Beta 的 0.646 与 0.6、Eq. 52 与 53 不自洽的检查、ablation 的共同 baseline 行、“小 data 上优势来自 pretraining”的读法是为这一页算和写的；“camera 顺序映错不报错”是根据代码结构的推论，没有实测。
:::

## [exec] Deployment：chunk 怎样执行、rollout 的检查与 HIL 迭代

:::skip
有真机时必读，快速路线可以先跳过。能说出 `chunk_size` 和 `n_action_steps` 的区别并为自己的任务选一个数，能算 synchronous 执行时 robot 在动的比例，知道 deploy 前要对齐哪几样东西、失败之后怎样用 HIL 收集 data，就可以去第 7 站。
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

SmolVLA 论文在 LIBERO 上做了两组 ablation（第 5 站说过，它们的参照 configuration 是 chunk 50、每步重新预测）。Table 13 固定 chunk 50，只改执行的步数：

| 执行步数 | 1 | 10 | 30 | 50 |
|---|---|---|---|---|
| Success rate（%） | 80.3 | 82.8 | 70.8 | 51.8 |

全部执行完（也就是 LeRobot 的默认值）比执行 10 步低了 31 个百分点。Table 12 改 chunk size：

| Chunk size | 1 | 10 | 30 | 50 | 100 |
|---|---|---|---|---|---|
| Success rate（%） | 50.0 | 84.0 | 78.5 | 80.3 | 74.5 |

论文正文没有写 Table 12 执行几步；它的 chunk 50 那一行和 Table 13 执行 1 步那一行四个 suite 的数完全相同（89、94、85、53），所以 Table 12 应当是“每步都重新预测、只用 chunk 的第一个 action”。在这个前提下，chunk size 只影响 training 时 model 要预测多远，执行方式没变：预测 10 个比只预测 1 个高 34 个点。论文的结论是 chunk 在 10 到 50 之间最好，执行步数是速度和 reactivity 的交换。两张表合起来：预测得长有用，执行得长有害。Deploy 时应当用 `--policy.n_action_steps` 把执行步数调短，而不是去改 `chunk_size` 重训。

### 执行得短的代价：停得更频繁

Synchronous 执行时，queue 一空 robot 就停下来等 inference。设一次 inference 0.3 s，30 Hz 下是 9 个 tick，执行 $s$ 步、停 9 步，robot 在动的比例是 $s/(s+9)$：

| $s$ | 在动的比例 |
|---|---|
| 50 | $50/59=84.7\%$ |
| 10 | $10/19=52.6\%$ |
| 1 | $1/10=10\%$ |

::fig[hfl-sync] 每执行完 `n_action_steps` 个就停 9 个 tick。执行 10 个时，feedback 更新得快，robot 却有将近一半时间不动。

执行少则 feedback 多但停得多，执行多则不停但盲走。Synchronous 下这两者无法兼得，第 7 站的 asynchronous inference 就是为了拆开这对矛盾。停顿本身还有一个副作用：[EE4706 第 7 站](../courses/EE4706.html#sys)指出 robot 每 0.5 s 停一下时，dynamics 和示教里的连续动作不同，state 落到 training distribution 之外。

:::wrong ACT 打开 temporal ensembling（`temporal_ensemble_coeff=0.01`），每个 tick 都用新 observation，所以对突发变化反应很快
打开后 `n_action_steps` 必须是 1，每个 tick 都跑一次 model，同一时刻有 100 个 chunk 各给出一个 action，按 $w_i=e^{-mi}$ 加权平均（$m$ 就是 `temporal_ensemble_coeff`，这里 0.01），$w_0$ 属于**最早**的那次预测。100 个 weight 的和是

$$\sum_{i=0}^{99}e^{-0.01i}=\frac{1-e^{-1}}{1-e^{-0.01}}=63.5$$

最新的一次预测只占 $e^{-0.99}/63.5=0.58\%$，最旧的占 $1/63.5=1.57\%$。开头那个 cube 被推开之后，要过多少个 tick，“推开之后做的预测”加起来才占一半？设推开后已做了 $k$ 次预测，它们是最新的 $k$ 个：

$$\frac{1}{63.5}\sum_{i=100-k}^{99}e^{-0.01i}\ \ge\ 0.5$$

逐个 $k$ 试，$k=63$ 时第一次超过一半，30 Hz 下 2.1 s。$m$ 取大一些更慢，因为权重更集中在旧的预测上：$m=0.1$ 要 94 个 tick，$m=0.5$ 要 99 个。Temporal ensembling 让每个 action 都带上了新 observation 的一点影响，motion 更平滑，但对一个突然的变化，它的反应比 `n_action_steps=10` 的 queue（最多 10 个 tick 加一次 inference 就整体换成新 chunk）慢得多。代价还有一项：每个 tick 都要在 33.3 ms 内跑完一次 ACT。
:::

### Deploy 前对齐的五样东西

`lerobot-rollout` 是 deploy 的入口，`--strategy.type` 决定一边跑一边录什么：

| Strategy | 做什么 |
|---|---|
| `base` | 只跑不录，`--duration` 秒后停（0 是一直跑），用于快速评估和 demo |
| `episodic` | 和 `lerobot-record` 一样按 episode 录评估数据，episode 之间留 reset 时间，可以接一个 teleoperator 在 reset 时复位场景；没接就原地保持 |
| `sentry` | 不停地自主跑并录，按 camera resolution 和 fps 自动切 episode，使每个 video 文件完整，每 N 个 episode 上传一次；episode 之间不 reset，policy 的内部状态（包括 RTC 的 queue）延续 |
| `highlight` | 自主跑，内存里一个 ring buffer 一直保留最近 N 秒（默认 10 s）；看到值得留的片段按键，把 buffer 里的和接下来的一起存成 episode |
| `dagger` | human-in-the-loop 收纠正 data，见下面 |

用来录的 strategy，dataset 名字必须以 `rollout_` 开头，同样会加时间戳。文档要求以下几样和录制时一致：

1. **`--robot.id`**：calibration 文件按 id 存，id 不同就读不到同一份 calibration，joint 的零点和方向会不同。LeRobot 改过一次 calibration 的约定（`backwardcomp` 文档：shoulder_lift 的零点移了 90° 并反向，elbow_flex 移了 90°），用旧 calibration 录的 data 要经过换算才能和新代码一起用。
2. **`--robot.cameras`**：同样的名字、同样的 resolution，以及第 2 站说的同样的物理位置。
3. **`--task`**：和 `--dataset.single_task` 一字不差。ACT 不读它，SmolVLA 和 π0 读。
4. **`--rename_map`**：training 时传了什么，deploy 时就传什么。
5. **`--fps`**：默认 30，要和 dataset 的 fps 一致。

Deploy 时同样有 cadence report，多一个 `infer` 项。文档的例子里 infer 的 mean 是 5.18 ms、worst 40.00 ms：平均很快，但 queue 空的那一个 tick 要跑完整个 model，那一次就超过了 33.3 ms 的 budget。`infer` 占比高说明瓶颈在 policy 或 device，`observe` 占比高说明在 camera。在没有 GPU 的电脑上用 `--device=cpu` 跑 CUDA 训出的 checkpoint 是允许的，文档提醒先确认 CPU 上 inference 能跟上控制频率。

:::edge 安全
`--robot.max_relative_target` 限制每一步 joint 目标相对当前位置能跳多远，第一次 deploy 一个新 policy 时值得设上；第 2 站说过录制时设它会让 dataset 里的 action 和实际发出的不一致，所以录制和 deploy 可以用不同的值。Rollout 正常结束或出错时默认 `--return_to_initial_position=true`，先回到起始位置再断开；断开时是否放掉 torque 取决于 robot 的配置。
:::

### 失败之后：human-in-the-loop 收集 data

Policy 在真机上失败的地方，正是示教 data 没有覆盖的 state。CS224R 第 2 讲的两条出路是：收更多示教，或者收“纠正”的 data；后者的实用版本是 human-gated DAgger：policy 在跑，人看着，要出错时接管，示范怎样恢复，把这段并进 dataset 再训。

LeRobot 的 `--strategy.type=dagger` 实现的就是这个循环：看 policy 执行，按 Space 暂停（robot 保持位置），按 Tab 开始纠正，用 leader arm 把 robot 带回好的状态再继续示范，再按 Tab 交还给 policy，一条 episode 里可以反复几次；也可以用脚踏板（`--strategy.input_device=pedal`）。人控制的 frame 带 `intervention=True` 的标记。默认只录人控制的那几段，每段纠正自成一个 episode；`--strategy.record_autonomous=true` 时连 policy 自己执行的部分一起录成一条连续的 trajectory。交接之后 robot 从当前状态继续，不需要因为一次接管就 reset。

这要求 leader arm 带可以主动驱动的 motor（能程序控制 torque 的开关、能转到目标位置）：暂停时 leader 先自己转到 follower 当前的姿态，人再接手。文档列出的兼容 teleoperator 是 `so100_leader`/`so101_leader`、`bi_so_leader` 和 `bi_openarm_mini`。否则交接的那一刻 leader 和 follower 位置不同，follower 会跳到 leader 那里，这一跳也会被录进纠正 data，教会 policy 一个猛的动作。

每一轮的流程是：用 v0 跑、收它的失败、和原 data 合在一起 fine-tune 得到 v1，再针对 v1 的失败收下一轮。文档的例子先用 ACT 在示教上训 50,000 步（batch 32），再收 50 条纠正 episode；ACT、Diffusion 用默认的 sync inference，SmolVLA、π0 这类慢的 model 加 `--inference.type=rtc`（文档这里用 `execution_horizon=20`、`max_guidance_weight=5.0`）。`--interpolation_multiplier=N` 让 motor 每个 policy action 收到 $N$ 个插值后的 command（control 跑在 $N\times$fps），policy 和 dataset 仍按 fps，所以 dataset 声称的 fps 和实际一致。

CS224R 第 2 讲对 DAgger 的评价是：从专家学习时 data efficiency 高，但在 agent 控制时向专家要 action 很难；HG-DAgger 把它变成人在出错时接管、给一段 partial demonstration，接口实用得多，代价是需要一个接管的界面，而且有些领域里错误很难及时发现（slide 上留了一个开放问题：能不能自动检测何时需要接管）。它的总结是：BC 简单、不需要 policy 自己的 data，但可能要不现实的 data 量，也不能从练习中进步；DAgger 类方法用在线的 intervention 补上这一点，data efficiency 更高；很多成功的方法把 imitation learning 和 RL 合在一起，这就是第 8 站。

:::back
Compounding error 与 DAgger 的理论在 [RB4301 第 5 站](../courses/RB4301.html#bc)；chunk 为什么有效在[第 7 站](../courses/RB4301.html#chunk)。Synchronous 执行的比例公式与 [EE4706 第 7 站](../courses/EE4706.html#sys)相同，这里用 LeRobot 的默认值代入。
:::

:::from
ACT 的 queue 与 temporal ensembling 的约束（`n_action_steps` 必须为 1、$w_0$ 是最旧的、建议值 0.01）读自 `policies/act`；各 policy 的默认 chunk 与执行步数读自各自的 config。执行步数与 chunk size 的 ablation 与论文的结论来自 [SmolVLA 论文](https://arxiv.org/html/2506.01844v1)的 Table 12、13 和 Section 4.7（WebFetch 读到全部数字）；“Table 12 是每步重新预测”是根据两张表的共同一行推断的，论文没有写。“像 MPC 一样执行”来自 [Underactuated 的 Imitation Learning 一章](https://underactuated.csail.mit.edu/imitation.html)。Deploy 的对齐要求、五种 strategy、DAgger 的按键与 `intervention` 标记、cadence 的读法、`--device` 的说明来自 LeRobot 的 inference 与 il_robots 文档；calibration 的变化来自 backwardcomp 文档；HIL 的流程、leader arm 的要求与兼容列表、50,000 步的例子、RTC 的参数、`interpolation_multiplier` 来自 hil_data_collection 文档；DAgger 与 HG-DAgger 的利弊和总结来自 [CS224R 2026 Lecture 2](https://cs224r.stanford.edu/slides/02_cs224r_imitation_2026.pdf) 的 slide 24 到 26、30（WebFetch 逐页文字）。0.3 s 的 inference 是假设的数；在动比例的表、temporal ensembling 的 63.5、0.58%、63 个 tick、94 与 99 是为这一页算的。
:::

## [async] Asynchronous inference：refill、aligned merge 与 RTC

:::skip
有真机且 inference 明显慢于一个 tick 时必读。能由 `refill_seconds` 和 turnaround 算出何时发请求、新 chunk 要 trim 几个、丢掉旧 chunk 几个、action 用的 observation 有多旧，并能说出 blending 和 RTC 各改变了什么，就可以去第 8 站。
:::

### 把“算”和“动”放进两个 process

第 6 站的矛盾来自 synchronous：算的时候不能动。Unit 1 第 2 页把“把 thinking（决定做什么）和 doing（执行 action）分开”列为 LeRobot 的设计重点，理由是这样 robot 能更快地反应，quiz 第 3 题考的也是这一条。Tutorial 的 Optimized Inference 一节和 LeRobot 的 remote inference 把两者拆开：**policy server** 在 GPU 上跑 checkpoint；**robot client** 控制 camera 和 motor，手里有一个 action queue，每个 tick 从 queue 里取一个执行。Queue 快空时 client 发一个新的 observation，在 server 计算期间继续从 queue 里执行，新 chunk 到达后接进 queue 还没执行的部分。

这同时解决了另一个实际问题：robot 旁边的电脑常常是没有 GPU 的笔记本或 single-board computer，GPU 在实验室另一头。Server 只需要 checkpoint 和它所对应的 robot 的描述；robot 这边不加载 weight。

两个 process 在同一台机器上也可以用这条路（`--inference.type=remote`）；另一种不分 process 的 asynchronous 是本地 RTC（`--inference.type=rtc`），inference 在 rollout process 的一个后台 thread 里。

### 什么时候发请求

Tutorial 的 Algorithm 1 用一个比例 $g\in[0,1]$：queue 里剩下的 action 数 $|A_t|$ 与 chunk 长 $H_a$ 之比低于 $g$ 时发请求。它的分析：设 inference 平均要 $\mathbb E[\ell_S]$，每个 tick $\Delta t$，robot 不停的条件是请求时 queue 里剩下的足够撑过 inference：

$$g\,H_a\,\Delta t\ \ge\ \mathbb E[\ell_S]\quad\Longleftrightarrow\quad g\ \ge\ \frac{\mathbb E[\ell_S]/\Delta t}{H_a}$$

这里的 $\ell=t_{C\to S}+\ell_S+t_{S\to C}$ 是从发出 observation 到收到 chunk 的总时间，tutorial 假设 network 的两段可以忽略，$\mathbb E[\ell]\simeq\mathbb E[\ell_S]$。Tutorial 把 $g$ 分成三段：

- $g=0$：queue 空了才发，退化成 synchronous，每个 chunk 停 $\mathbb E[\ell_S]$；
- $g\in(0,1)$：先用掉 queue 的 $1-g$ 再发请求，inference 的时间被执行掩盖，新旧 chunk 有重叠，可以互相缓冲 model 的误差；
- $g=1$：每个 tick 都发，queue 几乎总是满的（只有 $\Delta t/\mathbb E[\ell_S]<1$ 带来的一点锯齿），反应最快，但每个 tick 一次 forward。

SmolVLA 论文说小的 $g$ 会停顿，接近 1 的 $g$ 要求 model 很准、compute 很多；它举的中间值是 $g=0.7$，即用掉约 30% 的 queue 就发下一个请求。Tutorial 的 Code 12 用的是 `chunk_size_threshold=0.5`（这就是 $g$）、`actions_per_chunk=50`。用开头的数：$\ell=0.3$ s，$\Delta t=1/30$ s，$H_a=50$，下限是 $9/50=0.18$。

Tutorial 还有一个 similarity filter：发请求前把新 observation 和上一个在 joint space 里比较，距离小于阈值 $d_{\text{lim}}$ 就当作重复、不发；但 queue 一旦空了，最新的 observation 无论多相似都要处理。它的作用是 robot 静止时不去反复算几乎一样的 chunk。没有 filter 时，tutorial 估计每 $(1-g)H_a\Delta t$ 秒发一次 observation，新 chunk 平均每 $(1-g)H_a\Delta t+\mathbb E[\ell_S]$ 秒到一个。这个估计假设新 chunk 到达后 queue 回到满的 $H_a$ 个，即新 chunk 整个从头执行、不 trim。下面会看到，现在 LeRobot 默认的 aligned merge 会 trim，周期就变了。

Tutorial 的 Code 11、12（`PolicyServerConfig`、`RobotClientConfig`、`lerobot.async_inference`）是按较早的 LeRobot 写的。按这个 commit 的 remote_inference 文档，`lerobot[async]` 和 `lerobot.async_inference` 已经退役，换成 `lerobot-policy-server` 加 `lerobot-rollout --inference.type=remote`，并且明说旧的 chunk-size threshold 和 aggregation weight 与新的 refill、alignment、blending 不能一一换算，要重新调；similarity filter 在新的 `inference/` 代码里也没有对应的东西。

现在的 LeRobot 把这个比例换成了秒：`refill_seconds`（默认 0.5 s）是“queue 里剩下的 playback 时间低于它就发请求”。Client 还会用实测的 turnaround（encode、network、排队、inference、decode 的总和，取最近若干次里的**最大值**）自动抬高它，source code `inference/execution.py` 里：

$$\text{effective refill}=\max\big(\text{refill\_seconds},\ \text{turnaround}+1/\text{fps}\big)$$

代入：$\max(0.5,\ 0.3+0.033)=0.5$ s，也就是 queue 剩 15 个 action 时发请求，相当于 $g=15/50=0.3$。文档说明 turnaround 的初值来自第一次请求，之后用最多 100 个稳态 sample 里的最大值；所以 refill 既不是固定的请求周期，也不保证执行固定个数的 action，log 里要同时看 configured 和 effective 两个值。

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

每 35 个 tick（1.17 s）来一个新 chunk，每个 chunk 实际执行 35 个 action（第 9 到 43 个），robot 从不停。为什么是 35：chunk 到达时 trim 掉 $d=9$ 个，queue 里剩 $H_a-d=41$ 个；降到 15 个要执行 $41-15=26$ 个；再等 $d=9$ 个 tick 下一个到达。周期 $=26+9=35=H_a-15$，和 $d$ 无关。写成 tutorial 的记号就是 $(1-g)H_a\Delta t=0.7\times50/30=1.17$ s，比 tutorial 不 trim 时的 $(1-g)H_a\Delta t+\mathbb E[\ell_S]=1.47$ s（44 个 tick）短一个 latency。remote_inference 文档给的经验式“请求间隔约等于 execution horizon 减 effective refill”就是这个：$1.67-0.5=1.17$ s。B 的 action 在 tick 44 到 78 执行，所依据的 observation 是 tick 35 拍的，年龄从 9 个 tick（0.3 s）到 43 个 tick（1.43 s）。对比第 6 站的 synchronous、执行 50 个：observation 的年龄从 0.3 s 到 $0.3+49/30=1.93$ s，而且每次停 0.3 s。

::fig[hfl-async] Aligned merge：新 chunk 的开头已经过去，trim 掉；剩下的替换旧 chunk 还没执行的部分。

另一个选择 `chunk_merge=append` 把新 chunk 整个接在旧 chunk 之后，不 trim。它保留了每个 chunk 的完整执行，但新 chunk 的开头对应的是一个更旧的 observation，文档只建议把它当 baseline。

SmolVLA 论文比较了 sync 和 async（Figure 5）：

| | Sync | Async |
|---|---|---|
| Pick-Place 完成时间（10 次 trial、5 个 cube 位置；合计 / 平均 / std） | 137.5 / 13.75 / 2.42 s | 97.0 / 9.70 / 2.95 s |
| 60 s 内 pick-and-place 的 cube 数（合计 / 平均 / std） | 9 / 1.8 / 0.45 | 19 / 3.8 / 1.3 |
| 三个 SO-100 任务的 success rate（Pick-Place / Stacking / Sorting，平均） | 75 / 90 / 70，78.3 | 80 / 90 / 50，73.3 |

快了约 30%（$1-9.70/13.75=29.5\%$），同样时间里多做了一倍；但 Sorting 的成功率从 70 掉到 50。论文的说法是两种模式成功率“相近”，并说 async 因为没有预测的滞后，对物体被挪动和外部扰动反应更快；它没有解释 Sorting 为什么下降。

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
Synchronous 与 naive async 的失败方式、RTC 的 inpainting 与 soft mask、$d\le H/2$ 的推导在 [EE4706 第 7 站](../courses/EE4706.html#sys)；mode 平均的问题在 [RB4301 第 6 站](../courses/RB4301.html#gen)；执行步数的取舍在[第 6 站](#exec)。
:::

:::from
Server 与 client 的分工、$g$ 的定义与三段、$\ell$ 的分解、no-idle 条件、similarity filter、两个周期的估计、Algorithm 1、Code 11 与 12 的参数来自 [tutorial 的 Optimized Inference 一节](https://arxiv.org/html/2510.12403)（WebFetch 逐段转述，Algorithm 1 逐行读到）；$g=0.7$ 的讨论、sync 与 async 的结果和论文的解释来自 [SmolVLA 论文](https://arxiv.org/html/2506.01844v1) Section 3.3、4.6 与 Figure 5。“thinking 与 doing 分开”来自 Robotics Course Unit 1 第 2 页和它的 quiz 第 3 题。`lerobot.async_inference` 退役、旧参数不能换算、turnaround 用最多 100 个 sample、请求间隔的经验式来自 remote_inference 文档。`refill_seconds`、effective refill、aligned 的 trim 与替换、append、blending 的公式与 gripper 的建议、可用 playback 的例子、starvation 的行为来自 LeRobot 的 remote_inference 文档，并在 `inference/execution.py` 的 `effective_refill`、`should_request`、`_accept_aligned` 里核对过。RTC 的开关来自 SmolVLA 与 inference 文档；LINEAR schedule 与三段 mask 读自 `policies/rtc/modeling_rtc.py`。0.3 s 的 inference 是假设的数；15 个、9 个、35 个 tick 的推导与 44 个 tick 的对照、$g=0.3$、29.5%、0.3 到 1.43 s、0.18、$\ell\le\tfrac12H\Delta t$ 的写法、gripper 50 的例子是为这一页算的。
:::

## [rl] Real-world RL：reward classifier、actor-learner 与 HIL-SERL

:::skip
要在真机上做 RL 时必读，快速路线可以跳过。能说出 tutorial 认为真机 RL 难在哪三处，能由 discount 和 fps 算出 effective horizon，说清 RLPD、SERL、HIL-SERL 各补了什么，能算出 online/offline 各半的 batch 里 intervention 占多少，并按 LeRobot 的流程准备 workspace bound、示教、crop 和 reward classifier，就读完这门课了。
:::

前面七站都是 imitation learning：policy 最多学到和示范一样好，而且学不会示范里没有的恢复动作（第 6 站的 HIL 是在补这个洞）。CS224R 第 2 讲的总结说很多成功的方法把 imitation 和 RL 合起来用。Tutorial 的 RL 一节讲的就是这样一条路：怎样让 RL 直接在真 robot 上、几个小时内学会一个 manipulation 任务。课程的 Unit 5 还没发布，这一站跟 tutorial 和 LeRobot 的 hilserl 文档走。

### 真机 RL 难在哪里

Tutorial 先把问题写成一个有限 horizon 的 MDP $\mathcal M=\langle\mathcal S,\mathcal A,\mathcal D,r,\gamma,\rho,T\rangle$：$\mathcal D(s_t,a_t,s_{t+1})=\mathbb P(s_{t+1}\mid s_t,a_t)$ 是 dynamics，$r$ 是 reward，$\rho$ 是初始 state 的 distribution，return 是 $G(\tau)=\sum_{t=0}^{T-1}\gamma^tr_t$，目标是 $\max_\theta\ \mathbb E_{\tau\sim\pi_\theta}[G(\tau)]$。Discount $\gamma$ 决定 agent 实际“看多远”：$\sum_t\gamma^t=1/(1-\gamma)$，tutorial 称为 effective horizon。

用一次：LeRobot 的 SAC 默认 $\gamma=0.99$，effective horizon 是 $1/(1-0.99)=100$ 步。hilserl 文档的例子里 `gym_manipulator` 跑在 `fps: 10`，100 步就是 10 s。文档建议“任务要能在 5 到 10 s 内完成，避免很长的 horizon”，和这个数对得上：一个要 30 s 的任务，成功的 reward 在 300 步之后，折算到开头只剩 $0.99^{300}=0.049$。

在这个框架下，tutorial 列了真机上的三个难处：

1. **安全与 reset。** RL 早期的 exploration 动作很乱，会伤到硬件，要 watchdog、safety monitor、急停和大量人的看管；而且每个 episode 结束都要有人把场景复位。
2. **Sample efficiency。** SAC 这类算法要非常多的 transition，在真 robot 上一个个收太慢。
3. **Reward。** Dense reward 难设计，容易被 exploit 或卡在 local optimum；sparse reward（只在成功时给 1）安全，但学得慢。

Simulation 能绕开前两个，代价是 reality gap。Tutorial 讲的对策是 domain randomization：每次 reset 时从 $\Xi$ 里重新抽 simulator 的参数 $\xi\sim\Xi$，让 policy 对一族 dynamics 都 robust。难点在 $\Xi$ 本身：抽哪些参数（support）、范围多宽，太窄 transfer 不过去，太宽又让 policy 过于保守；AutoDR 按固定步长 $\Delta$ 加宽 uniform 的边界，DORAEMON 在保持性能的约束下最大化一个 Beta distribution 的 entropy（sim-to-real 的展开在 [RB4301 第 4 站](../courses/RB4301.html#s2r)）。Tutorial 补充说，contact 多或物体会变形的任务，高保真的 simulation 往往太慢，所以它转向直接在真机上学。

### 一层层补：SAC、RLPD、SERL、HIL-SERL

Tutorial 从 Q-learning 一路推到 SAC（DQN 的 TD loss、DPG 与 DDPG 对 continuous action 的处理、max-entropy 的 objective），推导在 [现代强化学习实践](../courses/MODERN-RL.html#offpolicy) 和 [CS285](../courses/BERKELEY-CS285.html#q)。这里只需要 SAC 的 soft TD target：

$$y=\mathbb E_{s_{t+1}}\Big[r_t+\gamma\big(Q_{\bar\theta}(s_{t+1},a_{t+1})-\alpha\log\pi_\phi(a_{t+1}\mid s_{t+1})\big)\Big],\qquad a_{t+1}\sim\pi_\phi(\cdot\mid s_{t+1})$$

$\alpha$ 是 entropy temperature：$-\alpha\log\pi$ 是一项“保持随机”的 bonus。SAC 是 off-policy 的，transition 存进 replay buffer 反复用，这是后面每一层的基础：buffer 里可以预先放进人的 data。

- **RLPD**（Ball et al., 2023）：不做 offline pretraining，每个 batch 从 offline buffer（示教）和 online buffer（自己跑的）**各取一半**，SAC 的 critic 加 LayerNorm 和 ensemble。
- **SERL**（Luo et al., 2025）：补上 reward 和 reset。Reward 由一个从成功与失败的例子 train 的 classifier $c$ 给出（tutorial 写作 $r(s)=\log c(e^+\mid s)$）；另外学一个 backward controller 负责把场景复位；state 和 action 都相对 $t=0$ 时的 end-effector pose 表示，这样只要随机化起始 pose，不必每一步随机化环境。
- **HIL-SERL**（Luo et al., 2024）：再加上人在 training 期间的 intervention。人接管时的 transition 同时进 offline 和 online 两个 buffer，policy 自己的 transition 只进 online buffer；于是 intervention 被抽中的次数比它的份额多，提供更强的监督，同时 policy 仍在自己探索。Tutorial 报告它在多种 manipulation 任务上 1 到 2 小时内达到 99% 以上的成功率。

### Buffer 和 batch：intervention 被放大多少

这个 commit 的 learner（`rl/learner.py`）就是这样做的：每个 transition 都进 online buffer，带 `is_intervention` 标记的再加进 offline buffer；`OnlineOfflineMixer` 的 `online_ratio` 默认 0.5，batch 一半一半。Tutorial 的 Code 5 写得更直白：`batch_size=32`，16 个 online、16 个 offline，Adam 的 learning rate $3\times10^{-4}$，每 10 个 training step 把参数发回 actor 一次。

算一个例子。示教 1,200 个 transition（15 条示教、每条约 8 s、10 fps）；跑了一阵之后，online buffer 有 6,000 个，其中 600 个是人接管的。Offline buffer 于是有 $1200+600=1800$ 个。一个 32 的 batch 里 intervention 的期望个数：

$$16\times\frac{600}{6000}+16\times\frac{600}{1800}=1.60+5.33=6.93$$

占 batch 的 $6.93/32=21.7\%$；而不同的 transition 一共 $1200+6000=7200$ 个，intervention 只占 $600/7200=8.3\%$，放大了 2.6 倍。单看 offline 那一半，一个 intervention 被抽中的概率是 online 那一半的 $6000/1800=3.3$ 倍。

::fig[hfl-rlbuf] Intervention 同时在两个 buffer 里；两边各抽一半时，它在 batch 里的份额比它在 data 里的份额大得多。

Actor 和 learner 是两个 process（可以在两台机器上）：learner 开一个 gRPC server，维护 buffer、做 gradient step、定期把 policy weight 推给 actor；actor 连上 learner，跑 environment，把 transition 发过去。这和第 7 站的 policy server 与 robot client 是同一种拆法：控制 robot 的那一边不被 gradient 计算拖住。

### LeRobot 里走一遍

hilserl 文档的流程，按顺序：

1. **找 workspace bound。** `lerobot-find-joint-limits` 要 robot 的 URDF（SO-101 用 SO-ARM100 仓库里的 `so101_new_calib.urdf`），你用 leader arm 把 follower 带着走遍完成任务需要的空间，它打印 end-effector 位置的最小、最大值。文档的例子写进 config 的是 $\max=(0.24,\ 0.20,\ 0.10)$、$\min=(0.16,\ -0.08,\ 0.03)$ m，也就是一个 $8\times28\times7$ cm 的盒子。这一步有两个用处：限制 exploration 的范围（也是 safety），并且让 RL 在 end-effector space 里学。文档说在 joint space 里学 manipulation 往往难得多，有的任务在 joint space 几乎学不会，换到 end-effector 坐标就能学。这正是第 1 站的 differential IK 在 learning pipeline 里的位置：policy 输出 $\Delta p$，IK 把它变成 joint 的 command。
2. **录示教。** `python -m lerobot.rl.gym_manipulator --config_path rl/env_config.json`，`mode: "record"`；例子里 `fps: 10`、每条最长 `control_time_s: 20`、reset `5` s、录 15 条，image 缩到 128×128，控制用 gamepad 或 leader arm。
3. **Crop。** RL 直接从 pixel 学，背景里的光线、影子、走过的人都会干扰它。`lerobot.rl.crop_dataset_roi` 在第一帧上手画一个矩形，例子输出 `observation.images.side: [180, 207, 180, 200]`（top、left、height、width），再缩到 128×128：$180\times200=36{,}000$ 个 pixel 变成 16,384 个，只留下工作区。文档说 policy 主要在 128×128 和 64×64 上验证过。
4. **Reward classifier（可选）。** 用预训练的 vision backbone（文档主要用 `helper2424/resnet10`）对每个 camera 判断成功与否，输出超过 `success_threshold=0.5` 时给 `success_reward=1.0` 并结束 episode。为它收 data 时要设 `terminate_on_success: false`，episode 在成功后继续录，正例才够多。第一轮也可以不用 classifier，用 gamepad 手动标成功。
5. **Actor-learner。** 先 `python -m lerobot.rl.learner --config_path rl/train_config.json`，再在另一个 terminal 跑 `lerobot.rl.actor`。
6. **Intervention。** Gamepad 右上的扳机（或键盘 space）暂停 policy、由人接管。文档给的打法：开头先让 policy 自己探索几个 episode；不要长时间接管，只在偏离时短暂纠正；policy 开始能完成任务后，只给“抓一下”这类很短的帮助。好的 run 里 intervention rate 随 training 逐渐下降；文档的图里有 intervention 时达到最高 reward 所需的步数缩短到四分之一。

:::wrong SAC 会自动调 temperature，所以 `temperature_init` 用默认的 1.0 就行
LeRobot 的 SAC 确实自动调 $\alpha$（target entropy 默认 $-|\mathcal A|/2$），但它是从 `temperature_init` 出发、用 learning rate $3\times10^{-4}$ 慢慢调 $\log\alpha$。Adam 每步对一个参数的改变大约不超过 learning rate，从 $\alpha=1$ 降到文档推荐的 $10^{-2}$，$\log\alpha$ 要走 $\ln100=4.61$，至少要 $4.61/(3\times10^{-4})\approx15{,}000$ 次 update。在这段时间里 entropy bonus 有多大：设 continuous action 是 $\Delta x,\Delta y,\Delta z$ 三维，每维是 std 0.5 的 Gaussian，$-\mathbb E\log\pi=3\times\tfrac12\ln(2\pi e\times0.25)=2.18$ nat；$\alpha=1$ 时每步 bonus 2.18，按 effective horizon 100 步累积约 218，而成功的 reward 只有 1。Critic 学到的主要是“保持随机”的价值，人接管示范的动作在这个 objective 里分量很小。文档的说法正是“设得太高会让 human intervention 失效、拖慢学习”，起点用 `1e-2`：每步 bonus 0.022，累积约 2.2，和 reward 同一个量级。（三维、std 0.5 是为了估量级设的数，tanh squash 之后的实际 entropy 会不同。）
:::

文档另外点名两个旋钮：`policy_parameters_push_frequency`（learner 每隔多少秒把 weight 推给 actor，默认 4 s，建议降到 1 到 2 s，actor 用的 policy 更新；网络慢时才调大，否则 sample efficiency 下降）和 `storage_device`（GPU memory 有余时设成 `"cuda"`，省掉 CPU 到 GPU 的搬运，learner 每秒的 update 次数能明显上升）。

:::edge 硬件要求
文档列的是：一个 gamepad（推荐）或键盘，一张 Nvidia GPU，follower 加 leader arm（用 gamepad 或键盘时 leader 可选），以及 robot 的 URDF。安装要 `pip install -e ".[hilserl]"`。Tutorial 的 Code 3 到 6 是用 `multiprocessing` 的 queue 在一台机器上把 actor 和 learner 串起来的简化版（reward classifier 用 `microsoft/resnet-18`、5 个 epoch；learner 的 batch 32），读懂结构用；真要跑用文档的 gRPC 版本。
:::

:::back
SAC、RLPD 与 high UTD 的推导在 [现代强化学习实践](../courses/MODERN-RL.html#offpolicy)；goal classifier 与 VICE 在 [CS224R 的 reward learning](../courses/STANFORD-CS224R.html#reward)；domain randomization 在 [RB4301 第 4 站](../courses/RB4301.html#s2r)；end-effector space 与 differential IK 在[第 1 站](#classic)；HG-DAgger 在[第 6 站](#exec)。
:::

:::from
MDP 的写法、effective horizon、三个难处、domain randomization 与 AutoDR、DORAEMON、SAC 的 soft TD target、RLPD 的 1:1、SERL 的 reward classifier、backward controller 与相对 pose、HIL-SERL 的 buffer 规则与 1 到 2 小时 99% 以上、Code 3 到 6 的参数来自 [tutorial 的 RL 一节](https://arxiv.org/html/2510.12403)（WebFetch 逐段转述，公式按 LaTeX 读到；RLPD、SERL、HIL-SERL 的原论文没有读）。Workspace bound、URDF、end-effector space 的理由、录制与 crop 的 config、128×128、reward classifier 的参数与 `terminate_on_success`、actor-learner 与 gRPC、intervention 的打法与图、三个 hyperparameter、硬件要求来自 LeRobot 的 [hilserl 文档](https://huggingface.co/docs/lerobot/hilserl)；buffer 的规则、`online_ratio=0.5`、$\gamma=0.99$、`temperature_init=1.0`、temperature 的 learning rate 与 target entropy 读自 `rl/learner.py`、`rl/data_sources/data_mixer.py`、`rl/train_rl.py`、`rl/algorithms/sac/`。10 s、0.049、$8\times28\times7$ cm、36,000 对 16,384、1,200 与 6,000 的 buffer 例子、6.93 与 21.7%、15,000 次 update、2.18 nat 与 218 是为这一页构造和计算的。
:::

## 作业

这门课没有评分作业。课程已发布的部分有两份 quiz（Unit 1 第 4 页、Unit 2 第 5 页）和 Unit 1 的 dataset 代码；Unit 0 建议每个 unit 花 30 到 45 分钟，包括读、理解和跑代码。LeRobot 文档另有 ACT 和 SmolVLA 的 Colab notebook，tutorial 的 Code 3 到 6 和 hilserl 文档给了一条真机 RL 的流程。下面按研究底稿的两项（SmolVLA 必做、ACT 值得做）加上 quiz、Unit 1 的代码、一个真机环节和一个真机 RL 环节排列，每条提示注明来源。人工时间除了 Unit 0 那一句和 hilserl 文档的“几个小时”，各处都没有给出，其余写的是估计。

### Unit 1 与 Unit 2 的 quiz（先做）

**要做什么。** 两份 multiple-choice quiz，共 20 题，每个选项都附有解释，不计分。课程建议认真做，用来找出要回头再看的地方。

**做完会什么。** 第 1、3 站的概念，以及 Unit 1 第 2 页对 LeRobot 的定位。

**时间与算力。** 不需要算力；两份合起来约 20 分钟（估计）。

下表是每题考什么、正确选项的意思、这一页哪一站讲了它（题目和答案的原文在课程页上，这里只写要点）：

| 题 | 考什么 | 正确选项的意思 | 本页 |
|---|---|---|---|
| U1-1 | LeRobot 和传统 robotics 库的区别 | 从硬件控制到 learning 算法 end-to-end 集成 | 开头 |
| U1-2 | 哪一项**不是** LeRobot 的组成 | “每接一个新 robot 都需要专家知识”（LeRobot 要消除的正是它） | 开头 |
| U1-3 | Optimized inference stack 的主要好处 | 把 action 的 planning 和 execution 分开，利于 real-time 控制 | 第 7 站 |
| U1-4 | 支持哪些平台 | manipulation、locomotion、whole-body control 都支持 | 开头 |
| U1-5 | “与 robotics stack end-to-end 集成”的意思 | 从底层硬件控制到高层 learning 算法都覆盖 | 开头 |
| U1-6 | `delta_timestamps` 的用途 | 定义 temporal window，取 observation 的历史和 action 序列 | 第 3 站 |
| U1-7 | LeRobotDataset 的三个组成 | tabular data、visual data、metadata | 第 3 站 |
| U1-8 | `StreamingLeRobotDataset` 做什么 | 不下载，直接从 Hub 流式读取 | 第 3 站 |
| U1-9 | Temporal windowing 指什么 | 取一个 frame 前后多个 time step 的 observation 和 action | 第 3 站 |
| U1-10 | Video 的存法好在哪里 | 多个 episode 接进一个大的 mp4，减少文件数 | 第 3 站 |
| U1-11 | 兼容性 | 直接接 PyTorch `DataLoader` 和 Hugging Face 生态 | 第 3 站 |
| U2-1 | Motion 的分类 | manipulation、locomotion、mobile manipulation | 第 1 站 |
| U2-2 | FK 和 IK 的本质区别 | FK：joint → end-effector pose；IK：目标 pose → joint | 第 1 站 |
| U2-3 | $J(q)$ 表示什么 | joint velocity 到 end-effector velocity 的 map | 第 1 站 |
| U2-4 | $J^+$ 的 + 是什么 | Moore–Penrose pseudo-inverse | 第 1 站 |
| U2-5 | 障碍物和 joint limit 对 IK 的影响 | 缩小可行的 configuration，使 IK 更难（FK 公式不变） | 第 1 站 |
| U2-6 | Classical pipeline 的特点 | 接口固定的模块串联（perception、state estimation、planning、control） | 第 1 站 |
| U2-7 | 四条 limitation | integration、scalability、modeling、忽视 data 的增长 | 第 1 站 |
| U2-8 | Learning 方法被强调的优势 | 从 data end-to-end 地学，能跨任务和 embodiment 泛化 | 第 1 站 |
| U2-9 | 公开 dataset 为什么重要 | 让 learning 方法能随 data 扩展、迁移知识 | 第 1 站 |

**提示。**
- U1-4 的答案说 LeRobot 支持“从简单的 arm 到复杂 humanoid 的全谱系”，但 Unit 1 第 2 页正文只举了 SO-100/SO-101 和 ALOHA/ALOHA-2，并让读者看 LeRobot 文档里最新的列表；答这题靠的是文档，不是课程正文。（来源：Unit 1 第 2 页与 quiz 原文。）
- U2-5 的错误选项里有“只改变 FK”和“保证唯一解”，第 1 站的两组 IK 例子正好是反例。（来源：Unit 2 quiz 原文；例子是本页的。）

### Unit 1 代码：读一个 LeRobotDataset（先做）

**要做什么。** 加载 `lerobot/svla_so101_pickplace`，用 Unit 1 第 4 页的三组 `delta_timestamps` 各取一个 sample，看 shape；换成 `StreamingLeRobotDataset` 再做一遍；接一个 `DataLoader` 跑几个 batch。

**做完会什么。** 第 3 站：知道一个 sample 里有哪些 key、window 怎样变成 tensor 的第一个 dimension、pad 在哪里。

**时间与算力。** 底稿估 1.5 小时（读 Unit 1 的时间）。CPU 就够，免费 Colab 也够。

**提示。**
- 先 `print(dataset.meta.features)` 看 key 的名字，再写 `delta_timestamps`；Unit 1 的例子用 `observation.images.up`，换别的 dataset 时 camera 名不同。（来源：`lerobot-dataset-v3` 文档。）
- 取一个 episode 最后几个 frame 的 sample，打印 `action_is_pad`，对照第 3 站的算法核对 True 的个数。（来源：经验，依据 source code `delta_window`。）
- 偏移写成 0.05 之类不是 $1/\text{fps}$ 整数倍的数会直接报 `ValueError`；`[0.0, 0.1, 0.2, 0.3]` 在 30 fps 下取的是隔 3 个 frame 的 action。（来源：`feature_utils.py`。）
- `DataLoader` 用 `num_workers>0` 时，不要在主 process 里另开一个 `num_workers=0` 的 loader 去读 video，source code 注释说会 segmentation fault。（来源：`dataset_reader.py` 的 `_query_videos` 注释。）

### Train ACT with LeRobot（Colab notebook，值得做）

**要从零写什么。** 不需要写 model。在 Hub 上的一个 dataset 上用 `lerobot-train --policy.type=act` train，作为 SmolVLA 的不带 language 的 baseline。

**做完会什么。** 第 4 站：`--steps` 的换算、checkpoint 与 resume、读 training log。

**时间与算力。** Notebooks 页：A100、batch 64、100k 步约 1.5 小时。要 GPU；开始前确认 Colab 的 runtime 设成了 GPU（底稿）。ACT 峰值 GPU memory 约 2 到 6 GB（batch 8），T4 够用，hardware guide 也把 T4 列为适合 ACT；速度会慢很多，按第 4 站的公式把 step 数减到 5 到 10 个 epoch（速度的说法是估计）。

**提示。**
- 同一个 dataset 上先训 ACT 再训 SmolVLA，比较成功率和 inference latency，才能判断 language 条件和 pretraining 带来了什么。（来源：研究底稿的建议。）
- 默认 `n_action_steps=100`，deploy 或在 simulation 里评估时用 `--policy.n_action_steps` 调短，对比几个值。（来源：第 6 站，依据 SmolVLA 论文的 ablation。）
- 从 checkpoint 接着训：`--config_path` 指向 `checkpoints/last/pretrained_model/` 里的 `train_config.json`，再加 `--resume=true`。（来源：il_robots 文档。）
- Batch size 从 8 开始，按 GPU memory 调整。（来源：ACT 文档。）
- Training curve 可以接 Trackio（`--trackio.enable=true`）或 Weights & Biases，方便和 SmolVLA 的 run 对齐比较。（来源：il_robots 文档与 notebooks 页。）

### Fine-tune SmolVLA（LeRobot 文档 + Colab notebook，先做）

**要从零写什么。** 从 `lerobot/smolvla_base` 出发，在一个 LeRobotDataset（官方的 `lerobot/svla_so100_pickplace`，或自己录的约 50 条）上 fine-tune 一个 pick-and-place policy；有 SO-101 就用 `lerobot-rollout` deploy。

**做完会什么。** 第 5 站全部；deploy 时用到第 6、7 站。

**时间与算力。** SmolVLA 文档：一张 A100 上 20k 步约 4 小时；notebooks 页写 batch 64、20k 步约 5 小时。GPU memory 约 10 到 16 GB（batch 8，hardware guide），推荐的起步 GPU 是 RTX 4080 以上、L4、A10G；hardware guide 把 T4 标为“只适合 ACT”。免费 Colab 的 T4 有 16 GB，按 batch 8 的数字勉强放得下，要把 batch 降下来、步数按 epoch 重算，速度会慢很多，guide 没有覆盖这种用法（估计）。真机 deploy 要 SO-100 或 SO-101 和两路 camera。

**提示。**
- `smolvla_base` 期望的 camera 名是 `camera1`、`camera2`、`camera3`，必须用 `--rename_map` 映射，否则 feature mismatch；deploy 时传同一个 map。按 top、wrist、side 的顺序映射。（来源：SmolVLA 文档；顺序来自论文的 camera 统一方式。）
- Data 量从 50 条起步，每种 variation 重复多次；论文用 5 个位置各 10 条，25 条的版本效果差。（来源：SmolVLA 文档。）
- Deploy 时 camera 名、resolution、`--rename_map`、`--task` 文字都要和录 data 时一致。（来源：SmolVLA 文档。）
- Inference 慢导致动作卡顿时开 RTC：`--inference.type=rtc`，并把 `--inference.rtc.` 下的 `execution_horizon` 设为 10、`max_guidance_weight` 设为 10.0；`execution_horizon` 要明显大于实测 delay 的 tick 数，否则没有 soft 的过渡段。（来源：SmolVLA 文档；后半句来自 `modeling_rtc.py`，第 7 站。）
- Batch size 从小开始，GPU 放得下再加，同时注意 data loading 不要成为瓶颈，看 `dataloading_s`。（来源：SmolVLA 文档；log 字段来自 hardware guide。）
- 默认只训 action expert（`train_expert_only=True`）；想同时更新 VLM 要显式关掉它和 `freeze_vision_encoder`，GPU memory 会明显上升。（来源：`configuration_smolvla.py`；GPU memory 的说法是估计。）
- `--steps` 超过 30,000 时把 `--policy.scheduler_decay_steps` 设成同一个数，否则 learning rate 在第 30,000 步之后一直停在最低值。（来源：`optim/schedulers.py`，第 4 站。）

### 真机：录一组、训、deploy、HIL 一轮（有余力再做）

**要做什么。** 在自己的 arm 上按第 2 站录 50 条，读 cadence；训 ACT 和 SmolVLA；deploy 时比较 `n_action_steps` 的几个取值、sync 和 remote async；收一轮 HIL 纠正 data 再 fine-tune。LeRobot 没有把这一套写成作业，这里按文档的各页串起来。

**做完会什么。** 开头三次事故各自亲手遇到一遍，以及第 6 站的 HIL 循环。

**时间与算力。** 录 50 条、每条 20 s 加 10 s reset，约 25 分钟（估计，不算做坏重录）；train 见上两项。Remote inference 要一台 GPU 机器和 robot 旁边的一台电脑在同一 network 里。

**提示。**
- 录制前先用 `lerobot-teleoperate` 带 camera 跑一会儿，看它的 cadence；fps 不达标先降 resolution。（来源：il_robots 文档的 cadence 一节。）
- 判断一个 setup 能不能用的标准：只看 camera 画面，你自己能不能完成任务。（来源：il_robots 文档。）
- `lerobot-record` 会给 repo id 加上时间戳；不想要就加 `--dataset.no_stamp=true`。自己写录制代码时，push 之前必须调 `dataset.finalize()`，否则 parquet 文件不完整。（来源：il_robots 与 `lerobot-dataset-v3` 文档。）
- Remote inference 先用 aligned、不 blend；看 log 里的 configured 与 effective refill 和 trim 的个数；再加短的 blend，只放 arm 的 joint。（来源：remote_inference 文档。）
- HIL 要 leader arm 能主动转到 follower 的姿态，否则交接时的跳变会被录进 data。（来源：hil_data_collection 文档。）
- 每次换执行方式（sync/async、执行步数）都重新数成功率，trial 次数够不够按 [MIT-6.4210 第 7 站](../courses/MIT-6.4210.html#policy)算。（来源：经验。）

### 真机 RL：HIL-SERL 一轮（有余力再做）

**要做什么。** 按第 8 站的流程，在 SO-100/SO-101 上选一个 5 到 10 s 能完成的任务（文档建议从“把 cube 推到目标区域”或“抓起并举起 cube”开始）：找 end-effector bound、录 15 条左右的示教、crop、（可选）train reward classifier、起 learner 和 actor、边训边 intervention，直到 intervention rate 降下来。

**做完会什么。** 第 8 站全部；和第 6 站的 HIL 对照，体会 imitation 里的 intervention 和 RL 里的 intervention 用法有什么不同（前者进 dataset 做 supervised fine-tune，后者进两个 replay buffer 给 SAC 用）。

**时间与算力。** hilserl 文档说“几个小时”能在真 robot 上用 RL 训出一个 policy；tutorial 报告 HIL-SERL 原论文在 1 到 2 小时内到 99% 以上。要一张 Nvidia GPU、gamepad 或键盘、robot 的 URDF；免费 Colab 不适用，因为 actor 要直接连着 robot。

**提示。**
- Action space 用 end-effector 而不是 joint：有的任务在 joint space 里几乎学不会。（来源：hilserl 文档。）
- Image 先 crop 到工作区再缩到 128×128；背景里移动的东西会干扰 pixel 上的 RL。（来源：hilserl 文档。）
- 为 reward classifier 收 data 时设 `terminate_on_success: false`，正例才够；正式 RL 时改回 `true`。（来源：hilserl 文档。）
- `temperature_init` 从 `1e-2` 开始，不用默认的 1.0。（来源：hilserl 文档；为什么见第 8 站的 `:::wrong`。）
- 开头让 policy 自己探索几个 episode，之后只做短的纠正，不长时间接管；在 Trackio 里看 intervention rate 是否逐渐下降。（来源：hilserl 文档。）
- `policy_parameters_push_frequency` 从默认 4 s 降到 1 到 2 s，GPU memory 够就把 `storage_device` 设成 `"cuda"`。（来源：hilserl 文档。）
- Tutorial 的 Code 3 到 6 用 `multiprocessing` 的 queue 把 actor 和 learner 放在一个 script 里，适合先读懂结构；它是按较早的 LeRobot 写的，跑的时候以 hilserl 文档的命令为准。（来源：tutorial 与 hilserl 文档的对照；“较早的版本”是根据 tutorial 的 async inference 代码已经退役推断的。）
