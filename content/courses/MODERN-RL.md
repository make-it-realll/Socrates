---
code: MODERN-RL
evidence: syllabus
evidenceNote: "这一页不是一门课，是专题讲义：2024 到 2026 年实际在用的 RL。范围按用户的要求定（CS4246 讲到 actor-critic 为止，这一页从那里接着讲），讲法取自 Spinning Up、CleanRL 与《The 37 Implementation Details of PPO》、Berkeley CS285 Spring 2026 第 6、17 讲 slides（第 18 讲抓取被拒）、NYU Building LLM Reasoners 第 7 讲 slides，以及各篇论文的摘要和方法节（每站末尾写明读了哪一部分）。文中的小例子都用 python3 -I 实际算过，seed 写在旁边。"
exam: "无考试；以页末“动手做”里的项目为主。"
subskills:
  - id: ppo
    name: PPO：GAE、clipped objective 与实现细节
    l3: "对一条给出 reward 和 value 的短 trajectory 手算 GAE，并按 clip 规则判断某个 sample 有没有 gradient。"
    l4: "从 performance difference 推出 surrogate objective，说清 clipping 管住了什么、没管住什么，并对照 37 details 检查一份 PPO 代码。"
    l5: "用 k-step estimator 的加权平均推出 GAE，解释 $\\lambda$ 和 $\\gamma$ 各自引入什么 bias，并说明 advantage normalization、observation normalization 各自修的是哪个 scale 问题。"
  - id: simrl
    name: Simulation 里的大规模并行 on-policy RL
    l3: "读懂一个 Isaac Lab / rsl_rl 的 PPO 配置，算出每轮的 batch size、minibatch size 和 gradient step 数。"
    l4: "解释为什么 GPU simulation 里用 PPO 而不是 SAC，设计 asymmetric actor-critic 的 observation 分配和 teacher-student 两阶段训练。"
    l5: "说明 state-based critic 在什么条件下 unbiased、什么时候不是，以及 domain randomization 和 curriculum 各自在解决什么。"
  - id: reward
    name: Reward、termination 与 action space
    l3: "在一段 rollout 代码里分出 terminated 和 truncated，写对 bootstrap 的 mask。"
    l4: "证明 potential-based shaping 不改变 optimal policy，并读懂一份 locomotion reward 表里每一项的用途。"
    l5: "用一个 state 的例子算出 truncation bug 让 value 偏多少、会不会翻转 decision，并解释 PD target 作为 action 的好处和代价。"
  - id: offpolicy
    name: Off-policy 与 sample-efficient RL：SAC、高 UTD、RLPD、TD-MPC2
    l3: "写出 SAC 的 critic target 和 actor loss，并说出 clipped double Q 在 target 的哪一步。"
    l4: "算出 noisy estimate 取 max 的 overestimation，解释 REDQ、DroQ、LayerNorm 各自怎么让高 UTD 不发散，以及 RLPD 怎么用 demonstration。"
    l5: "判断一个真机任务能不能直接做 real-world RL：reward 从哪来、reset 怎么做、低层 controller 怎么保证安全。"
  - id: offline
    name: Offline RL 与 offline-to-online
    l3: "解释 offline 时 Q-learning 为什么会高估 dataset 以外的 action。"
    l4: "写出 CQL 和 IQL 的 loss，并在一个小例子上算出它们各自给出的 value 和 action。"
    l5: "说明 expectile 为什么在 $\\tau\\to1$ 时逼近 in-support 的 max，以及 offline pretrain 后转 online 时会遇到什么。"
  - id: finetune
    name: 大 model 的 RL fine-tuning：RLHF、DPO、GRPO 与 VLA
    l3: "对一组 binary reward 算出 GRPO 的 group-normalized advantage。"
    l4: "从 KL-regularized objective 推出 DPO loss，说出 GRPO 的 length bias 和 std normalization 问题，以及 dynamic sampling 在解决什么。"
    l5: "说清 diffusion / flow policy 为什么难做 policy gradient、DPPO 和 πRL 各自怎么绕过，以及“RL 是否教会了新能力”目前的证据和争议。"
  - id: debug
    name: Debugging RL：probe、logging 与 seed
    l3: "照着 CleanRL 的指标列表看一次训练，指出 approx_kl、clipfrac、explained_variance 哪个不正常。"
    l4: "写 probe environment 逐层排查 value、discount、policy 的 bug，并用多个 seed 和 IQM 报告结果。"
    l5: "推出 k3 KL estimator 为什么 unbiased 且非负，解释 shape broadcasting bug 为什么让 critic 学成 batch 平均。"
open:
  - label: "The 37 Implementation Details of Proximal Policy Optimization（ICLR Blog Track 2022）"
    url: "https://iclr-blog-track.github.io/2022/03/25/ppo-implementation-details"
    note: "第 1 站的实现细节和其中引用的 ablation 结论；读了全文前 10 万字符（全文约 10.6 万）。"
  - label: "OpenAI Spinning Up：Proximal Policy Optimization"
    url: "https://spinningup.openai.com/en/latest/algorithms/ppo.html"
    note: "第 1 站 clipped objective 按 advantage 正负分情况的讲法、clipping 不保证 KL 小。"
  - label: "CleanRL：PPO 文档"
    url: "https://cleanrl-i3o1olwa2-vwxyzjn.vercel.app/rl-algorithms/ppo"
    note: "第 1 站和第 7 站的指标定义（approx_kl 的 k1 与 k3、clipfrac、explained_variance），页末第一个项目。"
  - label: "Berkeley CS285 Spring 2026，Lecture 6：Actor-Critic"
    url: "https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-6.pdf"
    note: "第 1 站 n-step return 与 GAE 的引入顺序（“Cut everywhere all at once”）。读的是 slides 的文字，公式图片没有读到。"
  - label: "Berkeley CS285 Spring 2026，Lecture 17：Offline RL Part 1"
    url: "https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-17.pdf"
    note: "第 5 站的问题设定：counterfactual query、三类解法。第 18 讲（Offline RL Part 2）抓取时权限请求超时，没有读到。"
  - label: "NYU Building LLM Reasoners（Durrett，Spring 2026），Lecture 7：GRPO & RLVR"
    url: "https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec7.pdf"
    note: "第 6 站从 expert iteration 到 GRPO、Dr. GRPO、DAPO 的顺序。"
  - label: "Andy Jones：Debugging Reinforcement Learning Systems"
    url: "https://hn.jakechampion.name/reader/https://andyljones.com/posts/rl-debugging.html"
    note: "第 7 站的 probe environment 和要 log 的量（通过一个 reader 镜像读到原文）。"
  - label: "Gymnasium：Handling Time Limits"
    url: "https://gymnasium.farama.org/main/tutorials/handling_time_limits/"
    note: "第 3 站 terminated 与 truncated 的正确 target。"
  - label: "Isaac Lab 文档：Reinforcement Learning 与 Training with an RL Agent（Release 3.0）"
    url: "https://docs.nvidia.com/isaaclab/concepts/reinforcement-learning"
    note: "第 2 站支持的 RL library 和页末 Isaac Lab 项目的命令。"
sources:
  - label: "Schulman et al. 2015，GAE（读了第 3 节）"
    url: "https://ar5iv.labs.arxiv.org/html/1506.02438"
  - label: "Schulman et al. 2017，PPO（读了方法节和 Table 1）"
    url: "https://arxiv.org/pdf/1707.06347"
  - label: "Rudin et al. 2022，Learning to Walk in Minutes Using Massively Parallel Deep RL（全文）"
    url: "https://ar5iv.labs.arxiv.org/html/2109.11978"
  - label: "Lee et al. 2020，Learning Quadrupedal Locomotion over Challenging Terrain（方法与结果）"
    url: "https://ar5iv.arxiv.org/html/2010.11251"
  - label: "Schwarke et al. 2025，RSL-RL: A Learning Library for Robotics Research"
    url: "https://arxiv.org/html/2509.10771v1"
  - label: "Pinto et al. 2017，Asymmetric Actor Critic（只读了摘要）"
    url: "https://arxiv.org/abs/1710.06542"
  - label: "Baisero & Amato 2022，Unbiased Asymmetric RL under Partial Observability（只读了摘要）"
    url: "https://arxiv.org/abs/2105.11674"
  - label: "Pardo et al. 2018，Time Limits in Reinforcement Learning"
    url: "https://ar5iv.labs.arxiv.org/html/1712.00378"
  - label: "Peng & van de Panne 2017，Does the Choice of Action Space Matter?"
    url: "https://ar5iv.labs.arxiv.org/html/1611.01055"
  - label: "OpenAI 2016，Faulty Reward Functions in the Wild"
    url: "https://openai.com/index/faulty-reward-functions/"
  - label: "DeepMind 2020，Specification gaming: the flip side of AI ingenuity"
    url: "https://deepmind.google/discover/blog/specification-gaming-the-flip-side-of-ai-ingenuity/"
  - label: "Haarnoja et al. 2018，Soft Actor-Critic Algorithms and Applications（读了前 20 万字符）"
    url: "https://ar5iv.labs.arxiv.org/html/1812.05905"
  - label: "Chen et al. 2021，REDQ"
    url: "https://ar5iv.labs.arxiv.org/html/2101.05982"
  - label: "Hiraoka et al. 2022，DroQ（只读了摘要）"
    url: "https://arxiv.org/abs/2110.02034"
  - label: "Smith et al. 2022，A Walk in the Park"
    url: "https://ar5iv.labs.arxiv.org/html/2208.07860"
  - label: "Ball et al. 2023，RLPD"
    url: "https://ar5iv.labs.arxiv.org/html/2302.02948"
  - label: "Hansen et al. 2024，TD-MPC2"
    url: "https://arxiv.org/html/2310.16828v2"
  - label: "Luo et al. 2024，SERL"
    url: "https://arxiv.org/html/2401.16013v4"
  - label: "Luo et al. 2024，HIL-SERL"
    url: "https://arxiv.org/html/2410.21845"
  - label: "Kumar et al. 2020，CQL"
    url: "https://ar5iv.arxiv.org/html/2006.04779"
  - label: "Kostrikov et al. 2021，IQL"
    url: "https://ar5iv.arxiv.org/html/2110.06169"
  - label: "Ouyang et al. 2022，InstructGPT"
    url: "https://ar5iv.labs.arxiv.org/html/2203.02155"
  - label: "Rafailov et al. 2023，DPO（读了推导部分，实验节没有读到）"
    url: "https://arxiv.org/html/2305.18290v2"
  - label: "Shao et al. 2024，DeepSeekMath（GRPO）"
    url: "https://arxiv.org/html/2402.03300v3"
  - label: "Liu et al. 2025，Understanding R1-Zero-Like Training（Dr. GRPO）"
    url: "https://arxiv.org/html/2503.20783v2"
  - label: "Yue et al. 2025，Does RL Really Incentivize Reasoning Capacity Beyond the Base Model?（只读了摘要）"
    url: "https://arxiv.org/abs/2504.13837"
  - label: "Shao et al. 2025，Spurious Rewards: Rethinking Training Signals in RLVR（只读了摘要）"
    url: "https://arxiv.org/abs/2506.10947"
  - label: "Ren et al. 2025，DPPO: Diffusion Policy Policy Optimization"
    url: "https://arxiv.org/html/2409.00588v3"
  - label: "Chen et al. 2025，πRL: Online RL Fine-tuning for Flow-based VLA Models"
    url: "https://arxiv.org/pdf/2510.25889v3"
  - label: "Li et al. 2025，SimpleVLA-RL"
    url: "https://arxiv.org/html/2509.09674v1"
  - label: "Liu et al. 2025，What Can RL Bring to VLA Generalization?"
    url: "https://arxiv.org/html/2505.19789v4"
  - label: "Physical Intelligence 2025，π*0.6: a VLA That Learns From Experience（RECAP）"
    url: "https://arxiv.org/html/2511.14759v2"
  - label: "Henderson et al. 2018，Deep Reinforcement Learning that Matters"
    url: "https://ar5iv.labs.arxiv.org/html/1709.06560"
  - label: "Google Research，RLiable: Towards Reliable Evaluation & Reporting in RL"
    url: "https://research.google/blog/rliable-towards-reliable-evaluation-reporting-in-reinforcement-learning/"
  - label: "Hugging Face TRL：GRPOTrainer 文档"
    url: "https://huggingface.co/docs/trl/en/grpo_trainer"
---

先看四件事。

**第一件。** Henderson 等人把同一个 TRPO 在 HalfCheetah 上跑 10 次，代码和 hyperparameter 全都一样，只换 random seed，随机分成两组各 5 次取平均。两组的 learning curve 用 t-test 比较，$p=0.0016$：看上去是两个不同的 algorithm。同一篇文章里，同一个 algorithm 的三份公开实现给出的结果也差得很远。

**第二件。** Rudin 等人在一张 RTX A6000 上同时 simulate 4096 只 ANYmal，用 PPO 不到 20 分钟训出一个 rough terrain 的 policy：simulation 里 20 cm 以内的台阶几乎全部能上，部署到真机时 policy 不做任何修改，真机也能上下楼梯。

**第三件。** 同一篇文章里有一个只改一行的修正：episode 因为时间到了而结束时，critic 的 target 要继续 bootstrap，而不是当成终点。改了之后，total reward 提高了大约 10% 到 20%。论文说当时的标准接口不区分这两种结束，很多实现都没有做这个区分。

**第四件。** SimpleVLA-RL 把 OpenVLA-OFT 先用每个 task 一条 demonstration 做 SFT，在 LIBERO-Long 上 success rate 是 17.3%；再在 simulation 里只用“成功 / 失败”这一个 binary reward 做 RL，提到 91.7%。

CS4246 那一页停在 actor-critic：用 TD error 当 weight，换来更小的 variance。从那里到上面四件事，中间隔着的是一连串具体的问题：advantage 用几步 bootstrap 才合适（第 1 站），同一批 data 能不能用好几次（第 1 站），sample 便宜到每秒十万个时该用什么 algorithm（第 2 站），reward 和 episode 的边界写错时会发生什么（第 3 站），sample 贵到每个都要人看着时又该用什么（第 4 站），只有一份固定的 dataset 时怎么办（第 5 站），以及 policy 本身是一个几十亿 parameter 的 language model 或 VLA 时，前面这些还剩下什么（第 6 站）。最后一站讲怎么判断一次训练到底是对是错。

选 algorithm 主要看 sample 从哪来、有多贵：

| 场景 | sample 从哪来 | 一个 sample 的代价 | 常用方法 | 站 |
|---|---|---|---|---|
| GPU simulation 里训 locomotion、manipulation | 数千个并行 environment | 极低，瓶颈在 gradient step | PPO | 1、2 |
| 真机上直接学 | 真实交互，加少量 demonstration | 高，要人看着、要 reset | SAC 系、高 UTD、RLPD | 4 |
| 只有采好的 data | teleoperation、旧 policy 的 log | 不能再采 | IQL、CQL | 5 |
| fine-tune 大的 pretrained policy | model 自己的 rollout | 生成慢，model 大 | PPO、GRPO、DPO、advantage-conditioned | 6 |

更深的理论（policy gradient theorem 的各种形式、variational inference、exploration 的理论）在 [Berkeley CS285](../courses/BERKELEY-CS285.html) 那一页；这一页只讲做实验时会直接碰到的东西。

## [ppo] PPO：GAE、clipped objective 与实现细节

:::skip
能对一条短 trajectory 手算 GAE、说出 $\lambda$ 从 0 到 1 时 bias 和 variance 各往哪边走，能画出 clipped objective 在 $A>0$ 和 $A<0$ 时的形状并说出哪些 sample 没有 gradient，并且知道 advantage normalization、observation normalization、learning rate annealing 各自在修什么，就可以去第 2 站。快速路线里这一站必读，最后一个小节可以先只看表。
:::

### 两种 advantage 估计各坏在哪

CS4246 的最后一站留下了两种 weight。一种是 $G_t-V(s_t)$：$G_t$ 是真实的 discounted return，所以无论 $V$ 准不准，它都是 unbiased 的（$V(s_t)$ 只是 baseline），但它把整条 trajectory 后面所有的随机性都带了进来。另一种是 TD error

$$\delta_t=r_t+\gamma V(s_{t+1})-V(s_t)$$

它只带一步的随机性，但 $V$ 一旦不准，$\delta_t$ 的 expectation 就不再是 advantage。这两种不是仅有的选择。往前看 $k$ 步再 bootstrap：

$$\hat A_t^{(k)}=r_t+\gamma r_{t+1}+\cdots+\gamma^{k-1}r_{t+k-1}+\gamma^kV(s_{t+k})-V(s_t)$$

$k=1$ 就是 $\delta_t$，$k=\infty$ 就是 $G_t-V(s_t)$。$k$ 越大，$V$ 的 error 被乘上的 $\gamma^k$ 越小，bias 越小；被加进来的 reward 越多，variance 越大。

这个 estimator 可以写成 TD error 的和。把 $\delta_t,\delta_{t+1},\dots,\delta_{t+k-1}$ 依次乘上 $1,\gamma,\dots,\gamma^{k-1}$ 加起来：

$$\sum_{l=0}^{k-1}\gamma^l\delta_{t+l}=\sum_{l=0}^{k-1}\gamma^lr_{t+l}+\sum_{l=0}^{k-1}\gamma^{l+1}V(s_{t+l+1})-\sum_{l=0}^{k-1}\gamma^lV(s_{t+l})$$

后两个 sum 里，$\gamma V(s_{t+1}),\gamma^2V(s_{t+2}),\dots,\gamma^{k-1}V(s_{t+k-1})$ 各出现一次正、一次负，全部抵消，只剩第二个 sum 的最后一项 $\gamma^kV(s_{t+k})$ 和第三个 sum 的第一项 $-V(s_t)$。所以 $\hat A_t^{(k)}=\sum_{l=0}^{k-1}\gamma^l\delta_{t+l}$。

### GAE：所有的 $k$ 一起用

既然不知道哪个 $k$ 好，CS285 第 6 讲的说法是“cut everywhere all at once”：把所有 $k$ 按 exponentially 递减的 weight 平均，

$$\hat A_t^{\mathrm{GAE}(\gamma,\lambda)}=(1-\lambda)\big(\hat A_t^{(1)}+\lambda\hat A_t^{(2)}+\lambda^2\hat A_t^{(3)}+\cdots\big)$$

Weight $(1-\lambda)\lambda^{k-1}$ 加起来是 1。现在数一数 $\delta_{t+l}$ 一共被算了几次。它出现在所有 $k>l$ 的 $\hat A_t^{(k)}$ 里，每次的 coefficient 都是 $\gamma^l$，所以它的总 coefficient 是

$$\gamma^l\sum_{k=l+1}^{\infty}(1-\lambda)\lambda^{k-1}=\gamma^l(1-\lambda)\cdot\frac{\lambda^l}{1-\lambda}=(\gamma\lambda)^l$$

于是

$$\hat A_t^{\mathrm{GAE}}=\sum_{l=0}^{\infty}(\gamma\lambda)^l\,\delta_{t+l}$$

这是 Schulman 等人 GAE 论文第 3 节的结论。$\lambda=0$ 时只剩 $\delta_t$；$\lambda=1$ 时是 $\sum\gamma^l\delta_{t+l}=G_t-V(s_t)$。实现时从 trajectory 的末尾往回算，每一步只需要一次乘加：

$$\hat A_t=\delta_t+\gamma\lambda\,\hat A_{t+1}$$

走一条 4 步就结束的 trajectory。$\gamma=0.9$，reward 只在最后一步有 1，critic 给出的 value 依次是 0.5、0.6、0.7、0.8，终点之后 value 为 0。先算 TD error：

$$\delta_0=0+0.9\times0.6-0.5=0.04,\quad\delta_1=0+0.9\times0.7-0.6=0.03,\quad\delta_2=0+0.9\times0.8-0.7=0.02,\quad\delta_3=1+0-0.8=0.2$$

取 $\lambda=0.8$，$\gamma\lambda=0.72$，从后往前：

$$\hat A_3=0.2,\quad\hat A_2=0.02+0.72\times0.2=0.164,\quad\hat A_1=0.03+0.72\times0.164=0.1481,\quad\hat A_0=0.04+0.72\times0.1481=0.1466$$

| $t$ | $\delta_t$ | $\lambda=0$ | $\lambda=0.8$ | $\lambda=1$ | $G_t$ |
|---|---|---|---|---|---|
| 0 | 0.04 | 0.04 | 0.1466 | 0.229 | 0.729 |
| 1 | 0.03 | 0.03 | 0.1481 | 0.21 | 0.81 |
| 2 | 0.02 | 0.02 | 0.164 | 0.2 | 0.9 |
| 3 | 0.2 | 0.2 | 0.2 | 0.2 | 1 |

$\lambda=1$ 那一列正好是 $G_t-V(s_t)$，比如 $0.729-0.5=0.229$。这个 critic 一路低估了 value（真实的 $G_t$ 都比 $V(s_t)$ 大），$\lambda=0$ 时 advantage 只有 0.02 到 0.04，把这几步的贡献几乎全抹掉了；$\lambda$ 越大，越多真实 reward 绕过了不准的 $V$。

实现里还要顺手得到 critic 的 regression target。CleanRL 和 37 details 博客的做法是 $\hat R_t=\hat A_t+V(s_t)$，这正是 TD($\lambda$) 的 return。上表的例子里 $\lambda=0.8$ 时，$\hat R_0=0.1466+0.5=0.6466$。

### $\lambda$ 放在哪里

要看 $\lambda$ 的作用，得有一个 true advantage 已知的例子。取 21 个 state 排成一条线的 random walk，从中间出发，向右的 probability 0.6，走到最右端 reward 1，走到任何一端就结束，$\gamma=0.98$。用 dynamic programming 算出真正的 $V$，再给每个 state 的 value 加上一个 $N(0,0.1)$ 的固定 error（seed 0），当作一个不准的 critic。对第一个 action 的 policy gradient 的 estimate（advantage 乘 score），在 20000 条 trajectory（seed 1）上量它的 bias 和 standard deviation。

::fig[mrl-gae] 横轴是 $\lambda$。|bias| 从 $\lambda=0$ 的 0.031 单调降到 $\lambda=1$ 的 0；standard deviation 从 0.012 升到 0.0998，是 true gradient 0.0178 的 5.6 倍。两者合成的 RMSE 在 $\lambda=0.6$ 处最小。

这张图把 GAE 论文第 3 节的两句话都验证了。第一，$\lambda=1$ 无论 critic 准不准都没有 bias，因为 $V$ 只以 baseline 的身份出现；第二，$\lambda<1$ 只有在 critic 不准时才引入 bias（把 critic 的 error 减到 0.05，$\lambda=0$ 的 bias² 从 0.00094 降到 0.00023）。$\gamma$ 不一样：$\gamma<1$ 不管 critic 多准都会引入 bias，它改变的是要优化的 objective 本身。论文因此观察到最好的 $\lambda$ 比最好的 $\gamma$ 小得多。实际库里的默认值几乎都是 $\gamma=0.99$、$\lambda=0.95$。

### 同一批 data 想用好几次

Vanilla policy gradient 每收集一批 data 只做一次 gradient step，然后 data 作废，因为 gradient 公式里的 expectation 是在当前 policy 下取的。收集一批 data 要让 environment 一步步跑、每步还要做一次 forward，用一次就扔掉太浪费，自然想在同一批 data 上多走几步。

先问：换一个 policy $\pi'$ 之后，performance 改变多少？把 $\pi$ 的 advantage 沿 $\pi'$ 的 trajectory 加起来，

$$\sum_t\gamma^tA^\pi(s_t,a_t)\approx\sum_t\gamma^t\big(r_t+\gamma V^\pi(s_{t+1})-V^\pi(s_t)\big)=\sum_t\gamma^tr_t-V^\pi(s_0)$$

第一步用了 $A^\pi(s,a)=\mathbb E[r+\gamma V^\pi(s')\mid s,a]$（取 expectation 后是等号），第二步是和上面一样的 telescoping。对 $\pi'$ 的 trajectory 取 expectation，左边第一项是 $J(\pi')$，第二项是 $J(\pi)$：

$$J(\pi')-J(\pi)=\mathbb E_{\tau\sim\pi'}\Big[\sum_t\gamma^tA^\pi(s_t,a_t)\Big]$$

右边要用 $\pi'$ 去跑才能估计，可手里只有 $\pi$ 的 data。两处不同要处理。Action 的 distribution 可以用 importance ratio 换过来：$\mathbb E_{a\sim\pi'}[A]=\mathbb E_{a\sim\pi}\big[\tfrac{\pi'(a\mid s)}{\pi(a\mid s)}A\big]$，这是精确的。State 的 distribution 换不过来，只能假装 $\pi'$ 访问的 state 和 $\pi$ 一样。这样得到 surrogate objective（PPO 论文的 $L^{\mathrm{CPI}}$）：

$$L(\theta)=\mathbb E_{s,a\sim\pi_{\theta_{\text{old}}}}\big[\rho(\theta)\,\hat A\big],\qquad\rho(\theta)=\frac{\pi_\theta(a\mid s)}{\pi_{\theta_{\text{old}}}(a\mid s)}$$

（PPO 论文把 ratio 记作 $r_t(\theta)$，这里用 $\rho$ 免得和 reward 混。）在 $\theta=\theta_{\text{old}}$ 处，$\nabla_\theta\rho=\nabla_\theta\pi_\theta/\pi_{\theta_{\text{old}}}=\nabla_\theta\log\pi_\theta$，所以 $L$ 的 gradient 就是 policy gradient；离开 $\theta_{\text{old}}$ 越远，“state distribution 不变”这个假装越不成立。PPO 论文的说法是：不加约束地最大化 $L$，会导致“excessively large policy update”。

### Clipped objective

PPO 的做法是改 objective，让 ratio 离开 $[1-\varepsilon,1+\varepsilon]$ 之后不再有好处：

$$L^{\mathrm{CLIP}}(\theta)=\mathbb E\Big[\min\big(\rho\hat A,\ \operatorname{clip}(\rho,1-\varepsilon,1+\varepsilon)\,\hat A\big)\Big]$$

按 advantage 的 sign 分开看（Spinning Up 的讲法）。$\hat A>0$ 时，提高这个 action 的 probability 让 objective 变大，但 $\rho$ 一超过 $1+\varepsilon$，min 取到的是被 clip 的那项 $(1+\varepsilon)\hat A$，是常数，gradient 为 0。$\hat A<0$ 时，降低 probability 让 objective 变大，$\rho$ 一低于 $1-\varepsilon$，同样变成常数。

::fig[mrl-clip] 左边 $A>0$，右边 $A<0$。灰底以外，彩线一边是平的（没有 gradient），另一边仍然沿着虚线 $\rho A$（仍有 gradient）。

逐个 ratio 算一下，$\varepsilon=0.2$：

| $\rho$ | $\hat A=+1$：$L$ | 对 $\rho$ 的 gradient | $\hat A=-1$：$L$ | 对 $\rho$ 的 gradient |
|---|---|---|---|---|
| 0.5 | 0.5 | 1 | −0.8 | 0 |
| 0.9 | 0.9 | 1 | −0.9 | −1 |
| 1.0 | 1.0 | 1 | −1.0 | −1 |
| 1.1 | 1.1 | 1 | −1.1 | −1 |
| 1.3 | 1.2 | 0 | −1.3 | −1 |
| 1.5 | 1.2 | 0 | −1.5 | −1 |

注意 $\hat A=+1$、$\rho=0.5$ 那一行：这个好 action 的 probability 被压得太低了，clip 不拦它往回涨。$\hat A=-1$、$\rho=1.5$ 也一样：坏 action 被抬得太高，往回压不受限制。只在“往有利方向走过头”时才把 gradient 关掉。所以 $L^{\mathrm{CLIP}}\le L$ 处处成立，PPO 论文称之为 pessimistic bound。

PPO 论文 Table 1 在 7 个 MuJoCo 任务、每个 3 个 seed 上比较了几种做法（random policy 记 0，最好的结果记 1）：不 clip 也不加 penalty 是 −0.39（HalfCheetah 上跌到比 random 还差），$\varepsilon=0.1,0.2,0.3$ 分别是 0.76、0.82、0.70，adaptive KL penalty 最好的是 0.74。

### Clipping 买到了什么

想亲眼看 clipping 的作用，最小的例子是 bandit：一个 state、5 个 arm，真实 mean reward 是 1.0、1.2、0.8、1.1、0.9，reward 带 $N(0,1)$ 的 noise，softmax policy 从均匀开始。每轮收集 64 个 sample，advantage 取 reward 减去这批的平均，然后在这批 data 上做 $K$ 个 epoch 的 full-batch gradient ascent（step size 0.5），一共 30 轮，每种设置跑 1000 个 seed（0 到 999）。

Bandit 只有一个 state，“state distribution 不变”自动成立，surrogate 的 expectation 就是真实的 improvement。即便如此，不 clip 也会出事。

::fig[mrl-epochs] 左：30 轮后的 J（最好是 1.2）；右：最后卡在 J < 1.1 的 seed 的比例。Epoch 少时两者一样；epoch 多时，不 clip 的版本越来越多地过早 converge 到一个差的 arm。

原因在 noise。一批 64 个 sample 里，某个 arm 碰巧拿到几次高 reward，它的 $\hat A$ 就偏大。不 clip 时，在同一批 data 上做 100 个 epoch 等于把这批 data 的 noise 当真，一直推到 policy 几乎 deterministic；之后它几乎只拉这一个 arm，再也收集不到别的 arm 的信息。$K=100$ 时 58.8% 的 seed 卡死，clip 版本是 2.1%。Clip 版本对 $K$ 几乎不敏感：$K=10$ 和 $K=100$ 的平均 J 是 1.172 和 1.175。这就是 PPO 能放心地对同一批 data 做 4 到 10 个 epoch 的原因。

:::wrong 有了 clipping，新 policy 就不会离旧 policy 超过 $\varepsilon$
Clipping 只把“已经出界的那个 sample”的 gradient 关掉，别的 sample 照样在推同一组 parameter。上面的 bandit 里只训练 1 轮、100 个 epoch，2000 个 seed 中有 90.6% 最后至少有一个 arm 的 ratio 落在 $[0.8,1.2]$ 以外，最大的到了 1.754。Network 共享 parameter 时更是如此：state A 的 gradient 会改变 state B 的 probability。Spinning Up 的 PPO 页面直说了这一点，它的实现另加了 early stopping：新旧 policy 的平均 KL 超过 threshold 就停止这一轮的 gradient step。Rudin 等人的 locomotion 配置（第 2 站）则用 KL 调 learning rate：KL 超过目标值 0.01 的两倍时 learning rate 除以 1.5，低于一半时乘以 1.5。
:::

### 决定 PPO 能不能用的实现细节

PPO 论文的伪代码只有几行，OpenAI Baselines 的实现里却有几十处论文没写的选择。Huang 等人的 ICLR 博客把它们整理成 37 条，并逐条对照了 Engstrom 等人和 Andrychowicz 等人的大规模 ablation。最值得弄懂的是三处 scale 的问题。

**Advantage normalization。** 在每个 minibatch 里把 $\hat A$ 减去 mean、除以 standard deviation。CS4246 那一页算过：所有 reward 加上同一个 constant，policy gradient 的 variance 会随 constant 线性增长；减去 mean 正好消掉这部分。除以 std 则让 step size 和 reward 的单位无关：reward 乘 100，normalize 之后的 advantage 不变，同一个 learning rate 照样能用。要如实说的是，博客引用的 Andrychowicz 等人的结果是它对 performance 影响很小，大概因为 GAE 已经用 critic 当了 baseline。

**Observation normalization 和 reward scaling。** Network 的输入如果一个 component 在 $\pm0.01$ 量级、另一个在 $\pm100$ 量级，前者几乎影响不了第一层的输出，tanh 还会被后者推到饱和。用 running mean 和 std 把每个 component 标准化，博客引用 Andrychowicz 等人的结论是“very helpful”。Reward scaling 处理的是 critic 那一侧：return 的量级直接决定 value loss 的量级，return 在 1000 左右时 value loss 在 $10^6$ 量级，会压过 policy loss 并撑大 gradient。Baselines 的做法是把 reward 除以“discounted return 的 running std”（不减 mean），Engstrom 等人发现它对 performance 影响显著。

**Initialization 与 learning rate annealing。** Policy 输出层的 weight 用 orthogonal init 再乘 0.01，于是一开始所有 observation 下的输出都接近 0：discrete action 接近 uniform distribution，continuous action 的 mean 接近 0。这时 entropy 最大、各个方向的 exploration 一样多，也不会一上来就有某个 action 的 probability 极小，让后面的 ratio 剧烈波动。Learning rate 从初始值线性降到 0，Engstrom 等人发现有帮助，Andrychowicz 等人发现在 5 个任务中的 4 个上有小幅提升。

其余几条按博客汇总的证据列在下面，供检查代码时对照：

| 细节 | 默认做法 | 博客引用的 ablation 结论 |
|---|---|---|
| Value loss clipping | value 的更新也 clip 在 $\pm\varepsilon$ 内 | Engstrom：没有证据表明有帮助；Andrychowicz：可能有害。博客为了忠实复现仍然实现了 |
| Entropy bonus | Atari 0.01，MuJoCo 0 | Andrychowicz：continuous control 上没有证据表明有帮助 |
| Global gradient clipping | 所有 gradient 的 L2 norm 截到 0.5 | 小幅提升 |
| Adam 的 epsilon | 1e-5（PyTorch 默认 1e-8） | 论文没有提；属于复现时要对齐的细节 |
| Policy 与 value 分开两个 network | MuJoCo 默认分开 | 博客作者和 Andrychowicz 都发现分开通常更好 |
| Continuous action 的 log std | 与 state 无关的 parameter，初始为 0 | state-dependent 与否差别不大 |
| Action clipping | 采样后 clip 到合法范围，但存下未 clip 的 action 用来算 log-prob | tanh squashing 更好，博客为了一致性用 clipping |

MuJoCo 上的默认 hyperparameter：1 个 environment、每轮 2048 步、32 个 minibatch、10 个 epoch、$\varepsilon=0.2$、$\gamma=0.99$、$\lambda=0.95$、learning rate 3e-4 线性退火。

:::edge 博客里的官方实现并没有正确处理 truncation
37 details 博客特意说明：为了和原始代码逐位对齐，它没有实现“truncated 时 bootstrap”，episode 因时间到而结束时也当成终点。第 3 站会算出这个差别有多大。
:::

:::back
这一站接着 CS4246 的[第 7 站](../courses/CS4246.html#pg)：baseline 不改变 expectation、actor-critic 用 TD error 当 weight。GAE 里 $\lambda$ 的 bias-variance 交换，就是 CS4246 [第 5 站](../courses/CS4246.html#td)MC 与 TD 的交换。
:::

:::from
$k$-step estimator 到 GAE 的推导和“$\lambda$ 只在 critic 不准时引入 bias、$\gamma$ 总是引入 bias”来自 [GAE 论文第 3 节](https://ar5iv.labs.arxiv.org/html/1506.02438)；“cut everywhere all at once”的引入顺序来自 [CS285 Lecture 6](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-6.pdf)（slides 的公式是图片，推导是这里自己写的）。Surrogate objective、clipped objective、pessimistic bound、Table 1 的数字来自 [PPO 论文](https://arxiv.org/pdf/1707.06347)；按 advantage 的 sign 分情况讨论和“clipping 不保证 KL 小、用 early stopping”来自 [Spinning Up](https://spinningup.openai.com/en/latest/algorithms/ppo.html)。Performance difference 的推导（Kakade 与 Langford 的结果）是凭自己的知识写的，没有读原文。实现细节和 ablation 结论来自 [37 details 博客](https://iclr-blog-track.github.io/2022/03/25/ppo-implementation-details)，我没有直接读 Engstrom 和 Andrychowicz 的原文，结论是博客转述的。4 步 trajectory、random walk 的 bias-variance 实验、bandit 上的 clip 实验都是为这一页写代码算的。
:::

## [simrl] Simulation 里的大规模并行 on-policy RL

:::skip
能算出 Rudin 等人的配置里一轮有多少个 sample、多少个 gradient step，说出为什么 sample 便宜时选 PPO，能解释 critic 为什么可以看 policy 看不到的信息、什么时候这样做会有 bias，并能说出 teacher-student 为什么要用 DAgger 而不是直接 behavior cloning，就可以去第 3 站。实验室用 Isaac Lab 训 locomotion 的话，这一站必读。
:::

### 一轮 PPO 里发生了什么

Rudin 等人在 Isaac Gym（Isaac Lab 的前身）里训练 ANYmal C。配置是：4096 个 robot，每个 robot 每轮走 24 步，policy 50 Hz，所以每轮是 0.48 秒的经验。

$$4096\times24=98{,}304\ \text{个 sample}$$

这批 data 分成 4 个 minibatch（每个 24,576），过 5 个 epoch，一共 20 个 gradient step。其余设置和第 1 站一样：$\varepsilon=0.2$、$\gamma=0.99$、$\lambda=0.95$、entropy coefficient 0.01，learning rate 按 KL 自动调，目标 KL 0.01。Rough terrain 的 policy 训练 1500 轮，在一块 i9-11900K 加 RTX A6000 上不到 20 分钟。

::fig[mrl-batch] 一轮 PPO 的 data flow。Sample 的数量（98,304）是 gradient step 数量（20）的约 5000 倍。

把数字连起来：$1500\times98{,}304\approx1.47\times10^8$ 个 sample，20 分钟是 1200 秒，平均每秒至少 12 万个 sample。这个速度只有在 physics、observation、reward、reset 全部留在 GPU 上、不经过 CPU 时才可能做到。Isaac Lab 和它推荐的 RL library rsl_rl 都是按这个前提设计的：RSL-RL 的论文说它刻意只提供很少几种 algorithm（PPO 和一个类似 DAgger 的 distillation），换取 GPU 上的 throughput 和代码的可改动性。

### 为什么这里是 on-policy

第 4 站会讲 SAC 这一类 off-policy 方法：每个 sample 进 replay buffer，可以被反复用很多次，sample efficiency 高得多。为什么 GPU simulation 里几乎都用 PPO？

看 gradient step 和 sample 的比例，叫 update-to-data ratio（UTD）。上面的配置每个 sample 分到

$$\frac{20}{98{,}304}\approx0.0002\ \text{个 gradient step}$$

而 SAC 的标准设置是每个 sample 一个 gradient step，即 UTD = 1，第 4 站的高效版本是 UTD = 20。如果用 UTD = 1 的 off-policy 方法消化每秒 12 万个 sample，每秒就要做 12 万个 gradient step，是上面配置的 5000 倍。Simulation 把 sample 变得几乎免费之后，瓶颈换成了 gradient step，这时“每个 sample 尽量少花计算”的 on-policy 方法反而更快。Rudin 等人的标题“learning to walk in minutes”指的是 wall-clock time，不是 sample 数：1.47 亿个 sample 放在真机上是 800 多个小时。

PPO 在这里还有一个好处：batch 极大时，policy gradient 的 variance 被平均掉了，每个 gradient step 都很可靠，hyperparameter 几乎不用为每个任务重调。

### Robot 的数量和每个 robot 走的步数

Batch size 固定时，robot 越多，每个 robot 每轮走的步数越少。Rudin 等人量了这个 trade-off：

- 步数太少时 performance 急剧下降。论文说这个任务在每个 robot 连续走少于 25 步（0.5 秒）时就很难学；它最后选的 24 步正好在这条线附近。
- Robot 太少、每个走很多步时，performance 下降得慢一些，原因是同一条长 trajectory 里的 sample 彼此相关，不够 i.i.d.。
- Training time 在 4000 个 robot 以内几乎随 robot 数线性下降，之后收益变小。论文给出的最佳折中是 2048 到 4096 个 robot、batch 10 万到 20 万。

为什么步数少会坏？看 GAE 怎么处理一段只有 24 步的 trajectory。第 $t$ 步的 advantage 是 $\sum_{l}(\gamma\lambda)^l\delta_{t+l}$，加到这一段的最后一步为止；最后一个 $\delta_{23}$ 里含有 $\gamma V(s_{24})$。所以 $V(s_{24})$ 在 $\hat A_t$ 里的 coefficient 是 $\gamma(\gamma\lambda)^{23-t}$。$\gamma\lambda=0.99\times0.95=0.9405$，

$$t=0:\ 0.99\times0.9405^{23}=0.24,\qquad t=23:\ 0.99$$

24 个位置平均下来是 0.53。也就是说，这一段 trajectory 里大部分的 advantage 信号都要经过 critic 在段末的那一次 bootstrap。$\gamma=0.99$ 对应的 effective horizon $1/(1-\gamma)=100$ 步，即 2 秒，远长于 0.48 秒的一段；critic 不准，advantage 就不准。段长再缩短，问题只会更严重。

:::wrong 并行的 environment 越多越好
Batch size 不变时，environment 越多，每个 environment 每轮的步数越少，上面那个 coefficient 就越大，critic 的 error 被放大得越厉害。Rudin 等人在固定 batch 下增加 robot 数，performance 在超过某个点之后急剧下降。反过来，如果同时放大 batch，每轮的计算量随之增加，training time 在 4000 个 robot 之后就不再明显下降。Isaac Lab 文档对 `--num_envs` 的说法也是：加大它会加快 data collection，直到 simulation、optimization 或 GPU memory 成为瓶颈。
:::

### Critic 可以看 policy 看不到的东西

部署到真机上的 policy 只能用真机上有的 sensor：joint encoder、IMU、可能还有不太准的 height map。但训练时 simulator 知道一切：真实的 friction、地形的精确高度、每只脚是否着地、外力。能不能让 critic 用这些信息？

Pinto 等人 2017 年的 asymmetric actor-critic 就是这么做的：actor 只看 image，critic 看 simulator 的 full state。理由可以从 baseline lemma 直接得到。设 policy 是 $\pi_\theta(a\mid o)$，$o$ 是 observation；critic 给出的 $b(s)$ 依赖于 full state $s$。对给定的 $s$（从而给定的 $o$），

$$\mathbb E_{a\sim\pi_\theta(\cdot\mid o)}\big[\nabla_\theta\log\pi_\theta(a\mid o)\,b(s)\big]=b(s)\sum_a\nabla_\theta\pi_\theta(a\mid o)=b(s)\,\nabla_\theta\sum_a\pi_\theta(a\mid o)=0$$

Baseline 只要不依赖 action，依赖什么都不引入 bias。更进一步，如果 $o$ 是当前 $s$ 的 function（policy 是 reactive 的，没有 memory），那么把 policy 看成 $s$ 上的 policy $\tilde\pi(a\mid s)=\pi_\theta(a\mid o(s))$，整个问题就是一个以 $s$ 为 state 的 MDP，$V^{\tilde\pi}(s)$ 有明确的定义，用它做 TD error 和 GAE 都是标准的 actor-critic。而且 critic 用 $s$ 比用 $o$ 好：几个不同的 $s$ 可能有相同的 $o$，只看 $o$ 的 critic 只能给出它们的平均。

条件“policy 没有 memory”不是可有可无的。Policy 依赖 history 时（比如下面的 student 用一段 proprioception history），上面那个 baseline 的等式照样成立，所以只拿 $b(s)$ 去减 Monte Carlo return 仍然 unbiased；出问题的是 bootstrap。Policy 的行为取决于 history，同一个 $s$ 下的 value 随 history 而不同，$V(s)$ 就不再是某个确定的量的 estimate，用它算 TD error 和 GAE 时，$\lambda<1$ 的那部分就带上了 bias。Baisero 与 Amato 2022 年指出，常见的“history-based policy 配 state-based critic”是 biased 的，并提出了一个仍然利用 state 信息、但 unbiased 的变体（我只读了摘要，具体构造没有读到）。

### Teacher-student：先学会，再 distill

Asymmetric critic 解决不了一类问题：有些任务，只看 proprioception 时 RL 根本学不出来。Lee 等人 2020 年在 ANYmal 上做 rough terrain locomotion，论文说直接对只有 proprioception 的 policy 做 RL 没有成功：supervisory signal 太稀疏，在合理的时间内学不会走。他们把训练拆成两段。

**Teacher。** 用 RL（他们用的是 TRPO）训练一个能看 privileged information 的 policy：每只脚周围 9 个点的地形高度、foot contact 的 state 和 force、friction coefficient、训练时施加的外力。有了这些，问题简单得多。

**Student。** 只看 proprioception 的 history，用 temporal convolutional network 编码，从 history 里自己推断地面硬不硬、脚有没有打滑。它不用 RL 训练，而是模仿 teacher：student 自己在 simulation 里走，每到一个 state，就问 teacher 在这里会怎么做。Loss 是 student 与 teacher 的 action 之差的 square，加上 student 从 history 推出的 latent 与 teacher 的 latent 之差的 square。

::fig[mrl-teacher] 两个阶段。第二阶段的关键是“student 的 action 真的被执行”：训练 data 来自 student 自己走到的 state。

为什么要 student 自己走？如果只在 teacher 走过的 state 上模仿（behavior cloning），student 的小 error 会把它带到 teacher 从来没去过的 state，那里没有任何训练 data，error 越积越大。让 student 执行、teacher 标注，训练 data 就覆盖了 student 实际会遇到的 state，这就是 DAgger。RSL-RL 里的 distillation algorithm 做的也是这件事：rollout 用 student，label 用 expert。

结果：这个 controller 被部署在泥地、苔藓、雪地、碎石、密集植被和流水上，没有针对地形做任何调整。在 DARPA SubT Urban Circuit 上，两台 ANYmal-B 完成了四次 60 分钟的任务，failure 为零。带一个训练时没见过的 10 kg payload（机身重量的 22.7%），它能上 13.4 cm 的台阶，对照的 baseline controller 一个都上不去。

### Domain randomization：对一族 environment 求最优

Simulator 的 parameter 永远和真机对不上。与其把 simulator 调准，不如让 policy 在一族 parameter 上都能工作。

一个能完全算清楚的例子：一个质量为 $m$ 的物体，$x_{t+1}=x_t+u_t/m$，policy 是 $u_t=-kx_t$，从 $x_0=1$ 出发，cost 是 $\sum_tx_t^2$。代入得 $x_{t+1}=(1-k/m)\,x_t$，记 $c=1-k/m$，

$$\sum_{t\ge0}x_t^2=\sum_tc^{2t}=\frac{1}{1-c^2}\quad(\lvert c\rvert<1)$$

$\lvert c\rvert\ge1$ 时 diverge。如果 simulator 里 $m=1$，最优的 gain 是 $k=1$（$c=0$，一步归零，cost 1）。可如果真机的 $m=0.45$，$c=1-1/0.45=-1.22$，$\lvert x\rvert$ 每步放大 1.22 倍，20 步之后是 55。

把 $m$ 在 $[0.4,2]$ 上均匀随机，最小化平均 cost。$k$ 必须让所有 $m$ 都满足 $\lvert1-k/m\rvert<1$，也就是 $k<2m_{\min}=0.8$；在这个范围里数值求最优，得到 $k=0.728$。

::fig[mrl-dr] 彩线 $k=1$ 在 $m=1$ 处最好，但 $m<0.5$ 时 diverge；黑线 $k=0.728$ 在整个区间都 stable，最坏的 cost 是 $m=0.4$ 处的 3.05。

付出的代价是 nominal 处的 performance：$m=1$ 时 cost 从 1.00 变成 1.08。Policy 在训练时没见过具体是哪个 $m$，它学到的是对整个 distribution 都安全的保守行为。Rudin 等人的 randomization 是：每个 robot 的地面 friction 在 $[0.5,1.25]$ 里均匀取，每 10 秒随机推一下机身（x、y 方向速度最多改变 1 m/s），所有 observation 加 uniform noise（例如 joint position $\pm0.01$ rad、joint velocity $\pm1.5$ rad/s、地形高度 $\pm0.1$ m）。他们还用一个 neural network 拟合 ANYmal 的 series elastic actuator 的响应，替代 simulator 里理想的 motor model，这一项的作用是缩小 simulator 和真机的差距。

### Curriculum

一开始就把 robot 放在 20 cm 的台阶前，它每次都摔，reward 几乎一样差，advantage 几乎全是 0，学不到东西。Rudin 等人的 curriculum 像游戏关卡：地形分成平地、斜坡、粗糙地面、离散障碍、台阶五类，每类有一串难度（台阶高度 5 cm 到 20 cm，坡度 0° 到 25°）。一个 robot 在 episode 里走出了当前地形块的边界，下次 reset 时升一级；走的距离不到 command 速度应走距离的一半，就降一级；已经在最高级的 robot 被随机送回某一级，以免忘掉简单的地形。Lee 等人的做法不同，但目标一样：用 particle filter 维护地形 parameter 的 distribution，专门挑 traversability（成功通过的比例）在 0.5 到 0.9 之间的地形训练。

两种做法都是在让“成功”和“失败”同时出现在训练 data 里。第 6 站在 LLM 和 VLA 的 GRPO 里会再遇到这件事，并且能算出它的 probability。

:::back
GAE 的段末 bootstrap、KL 自适应 learning rate 见[第 1 站](#ppo)。Rudin 等人的 reward 设计和 time-out 处理放在[第 3 站](#reward)。
:::

:::from
配置数字、robot 数与步数的 trade-off、curriculum、randomization 来自 [Rudin et al. 2022](https://ar5iv.labs.arxiv.org/html/2109.11978) 全文；teacher 的 privileged information、student 的 TCN 与 loss、“直接 RL 学不出来”、实地结果来自 [Lee et al. 2020](https://ar5iv.arxiv.org/html/2010.11251) 的方法和结果部分；RSL-RL 的设计取舍来自 [RSL-RL 论文](https://arxiv.org/html/2509.10771v1)；asymmetric actor-critic 来自 [Pinto et al. 2017](https://arxiv.org/abs/1710.06542) 的摘要，state-based critic 有 bias 的论断来自 [Baisero & Amato](https://arxiv.org/abs/2105.11674) 的摘要，两篇都没有读正文。UTD 的对比、GAE 段末 coefficient 的计算、baseline 对 full state 仍然 unbiased 的推导、mass 的 domain randomization 例子是为这一页写的。DAgger 的道理是凭自己的知识讲的，没有读 Ross 等人的原文。
:::

## [reward] Reward、termination 与 action space

:::skip
能证明 potential-based shaping 不改变 optimal policy，能在自己的代码里指出 bootstrap mask 用的是 `terminated` 还是 `done`、并算出用错时 value 偏多少，能说出 policy 输出 PD target 而不是 torque 的理由，就可以去第 4 站。快速路线里 termination 那一小节必读。
:::

### Reward 里写了什么，agent 就优化什么

OpenAI 2016 年在 CoastRunners 这个划船竞速游戏上训练 agent。游戏的分数来自撞倒赛道沿途的 target，不是名次。Agent 找到一个封闭的小水湾，在里面一圈圈地转，算准时间撞倒三个会重新出现的 target；它不断着火、撞船、逆行，从来不跑完比赛，平均分数却比人类玩家高约 20%。DeepMind 2020 年整理的 specification gaming 例子里还有：要把红色积木叠到蓝色积木上，reward 是“红色积木底面的高度”，agent 学会了把红色积木翻过来；一个本该学走路的 simulated robot 利用 simulator 的 bug，把两条腿勾在一起在地上滑行。

把 CoastRunners 缩成一个能算的 MDP。赛道是 $0\to1\to2\to$ 终点，到终点得 10 分，$\gamma=0.99$。在 1 处可以拐进水湾 L，再回到 1。

::fig[mrl-shaping] 只给终点 reward 时，从 1 直接往前（9.90）比先绕一圈（9.70）好。给“撞到 L 里的 target”加 +1 后，绕圈的 value 是 50.25，远超跑完全程。

绕圈的 value 可以直接写出来：每 2 步拿一次 +1，永不结束，

$$Q(1,\text{loop})=1+\gamma^2+\gamma^4+\cdots=\frac{1}{1-\gamma^2}=\frac{1}{1-0.9801}=50.25$$

设计者加这个 +1 是想“reward 沿途的进展”，结果改变了 optimal policy。

### Potential-based shaping：怎样加 reward 才安全

问题出在 +1 可以被反复领取。Ng、Harada 与 Russell 1999 年给出了一类不会改变 optimal policy 的 shaping：任取一个 state 的 function $\Phi$，令额外的 reward 为

$$F(s,s')=\gamma\Phi(s')-\Phi(s)$$

证明只需要 telescoping。从 $s_0$ 出发的一条 trajectory，shaping 部分的 discounted sum 是

$$\sum_{t=0}^{T-1}\gamma^t\big(\gamma\Phi(s_{t+1})-\Phi(s_t)\big)=\gamma^T\Phi(s_T)-\Phi(s_0)$$

令 terminal state 的 $\Phi=0$（无限长时 $\gamma^T\to0$），右边就是 $-\Phi(s_0)$，和后面选什么 action 无关。所以对任何 policy，新的 $Q$ 都等于旧的 $Q$ 减去 $\Phi(s)$：

$$Q'(s,a)=Q(s,a)-\Phi(s)$$

同一个 $s$ 下所有 action 减的是同一个数，排序不变，optimal policy 不变。

在上面的例子里取 $\Phi$ 为赛道上的进度：$\Phi(0)=0$、$\Phi(1)=1$、$\Phi(2)=2$、$\Phi(L)=1$。算出来 $Q'(1,\text{fwd})=8.90$、$Q'(1,\text{loop})=8.70$，各比原来少 1，往前仍然更好。绕一圈 $1\to L\to1$ 拿到的 shaping 是

$$\big(\gamma\Phi(L)-\Phi(1)\big)+\gamma\big(\gamma\Phi(1)-\Phi(L)\big)=-(1-\gamma^2)\,\Phi(1)<0$$

$\Phi\ge0$ 时，任何回到原处的环路拿到的 shaping 都不是正的，绕圈占不到便宜。

实际的 robot reward 大多是一组 penalty 和 tracking 项的加权和，不满足 potential-based 的形式。这时没有理论保证，只能靠看 rollout 的视频和分项 log 来发现 agent 钻了哪个空子。

### 一份真实的 locomotion reward

Rudin 等人 Table 2 的 reward（每项再乘以 policy 的 time step）：

| 项 | 定义 | weight | 作用 |
|---|---|---|---|
| Linear velocity tracking | $\phi(v^*_{xy}-v_{xy})$ | 1 | 主目标：按 command 的水平速度走 |
| Angular velocity tracking | $\phi(\omega^*_z-\omega_z)$ | 0.5 | 按 command 转向 |
| Linear velocity penalty | $-v_z^2$ | 4 | 不要上下颠 |
| Angular velocity penalty | $-\lVert\omega_{xy}\rVert^2$ | 0.05 | 不要左右、前后晃 |
| Joint motion | $-\lVert\ddot q\rVert^2-\lVert\dot q\rVert^2$ | 0.001 | motion 平滑 |
| Joint torques | $-\lVert\tau\rVert^2$ | 0.00002 | 省力 |
| Action rate | $-\lVert\dot q^*\rVert^2$ | 0.25 | 相邻两步的 target 不要跳 |
| Collisions | $-n_{\text{collision}}$ | 0.001 | 只许脚着地 |
| Feet air time | $\sum_f(t_{\text{air},f}-0.5)$ | 2 | 鼓励迈步，抬脚至少 0.5 s 才有正的 reward |

Tracking 项用的是 $\phi(x)=\exp(-\lVert x\rVert^2/0.25)$，不是 $-\lVert x\rVert^2$。它有上界 1：速度 error 为 0、0.25、0.5、1 m/s 时分别是 1、0.78、0.37、0.02。有上界的 tracking reward 加上各种 penalty，agent 不会为了把一项刷到无穷大而牺牲其他项。最后一项鼓励把脚抬起来迈步。即便有它，论文也说 policy 总是 converge 到 trot，常带着拖腿之类的毛病。

Smith 等人在真机上训 A1 时的 reward 是 $r=r_v-0.1\,\omega_{\text{yaw}}^2$，$r_v$ 在目标速度区间内等于 1，区间外线性下降。他们特意把前进速度投影到地面上再算，因为不投影的话，robot 会学会向前扑倒来“获得速度”。

### Termination 与 truncation

一个 episode 结束有两种原因。Robot 摔倒、任务完成，是 **termination**：之后真的没有 reward 了。时间到了被强行 reset，是 **truncation**：如果不 reset，robot 还会继续拿 reward。Gymnasium 从 v0.26 起让 `step` 分别返回 `terminated` 和 `truncated`，它的教程把正确的 target 写成一行：

```python
# 错：done = terminated or truncated
vf_target = rew + gamma * (1 - done) * vf_next_state
# 对：只有 terminated 才不 bootstrap
vf_target = rew + gamma * (1 - terminated) * vf_next_state
```

错的版本到底错多少？取最简单的情形：一个 state，action “stay”每步 reward 1，永远停在原地，$\gamma=0.99$；为了让 data 多样，每 $T=100$ 步 reset 一次。Critic 评估“一直 stay”这个 policy。正确的 value 是

$$V=\frac{1}{1-\gamma}=100$$

有 bug 时，100 个 transition 里有 99 个的 target 是 $1+\gamma V$，1 个是 $1$（被当成了终点）。TD 的 fixed point 满足 $V$ 等于 target 的平均：

$$V=1+\gamma\cdot\frac{99}{100}\,V\qquad\Longrightarrow\qquad V=\frac{1}{1-0.99\times0.99}=50.25$$

用 learning rate 0.01 实际跑 3000 个 episode 的 TD(0)，得到 49.9（最后一步刚好是那个被拉低的 update）。Value 被低估了一半。

这会不会改变 decision？给这个 state 加一个 action “jump”：reward 60，然后 episode 真的结束。正确时 jump 的 advantage 是 $60-100=-40$，policy 会远离它；有 bug 时是 $60-50.25=+9.75$，policy gradient 把 policy 往 jump 推。

::fig[mrl-trunc] 有 bug 的 critic 学到的 value 随 time limit $T$ 的变化：$V=1/\big(1-\gamma(1-1/T)\big)$。$T$ 越短，偏得越多；$T$ 小于约 148 时，它掉到 jump 的 60 以下。

Robot 训练里的 time limit 一般是 20 秒，1000 步，看起来比 100 步长得多。但第 2 站说过，GAE 是按 24 步一段计算的，段末那一步若恰好是 time-out，用错的 mask 就会把那一步的整个未来清零。Rudin 等人测得，改用正确的 time-out bootstrap 后，flat 和 rough terrain 上的 total reward 都提高了大约 10% 到 20%，critic 的 loss 也更低；他们特别提到，标准的 Gym 接口（v0.26 之前）不区分这两种结束，很多实现因此写错。RSL-RL 的论文也说它的 PPO 正确处理了 time-out。

Pardo 等人 2018 年把这件事分成两种情形。如果任务本来就是限时的（比如“10 秒内走得越远越好”），剩余时间是 state 的一部分，应该放进 observation，这时 time-out 是真正的 termination；如果 time limit 只是为了让 data 多样，就应该在 time-out 时 bootstrap，他们称之为 partial-episode bootstrapping。用后者训练的 Hopper，训练时每个 episode 只有 200 到 300 步，评估时能连续跳至少 $10^6$ 步。

:::wrong done 就是 done，episode 结束了就不该再 bootstrap
“结束”是训练程序的决定，不是 environment 的性质。Truncation 之后 robot 本来还会继续拿 reward，target 里少了 $\gamma V(s')$，critic 就学到一个随“离 time-out 还有多远”而变的 value；observation 里没有时间，critic 只能把不同时刻的 value 平均，于是像上面那样系统性地偏低。要注意，正确的 bootstrap 用的是 truncation 那一刻的 observation 的 value，不是 reset 之后新 episode 第一个 observation 的 value；vectorized environment 会自动 reset，很多 library 要从 `info` 里才能取到前者。
:::

:::edge 这个 bug 不一定在曲线上看得出来
用 numpy 写的 PPO 在 CartPole（500 步 truncation）上各跑 10 个 seed（0 到 9，learning rate 3e-3，30 万步），正确版本和有 bug 的版本最后都稳定在 500，整条曲线的平均分别是 457.0 和 452.4，看不出差别：policy 已经完美，value 偏不偏不影响 action 的排序。Bug 在一个任务上“没影响”，不代表在另一个任务上也没有，这也是第 7 站主张用单元测试去查这类 bug 的原因。
:::

### Action space：为什么输出 PD target

Locomotion policy 很少直接输出 torque。Rudin 等人的 policy 输出每个 joint 的目标角度 $q^*$，由 PD controller 转成 torque：

$$\tau=K_p\,(q^*-q)-K_d\,\dot q$$

Policy 每 0.02 秒（50 Hz）给一次 $q^*$，simulator 每 0.005 秒走一步，所以每个 policy step 里 PD 闭环走 4 次。在真机上，PD 跑在 motor driver 里，频率是 kHz 级。

这样做有三点好处。第一，policy 两次输出之间，joint 一直被 PD 拉向目标，扰动在 policy 来得及反应之前就被部分修正了。第二，$q^*$ 的含义是“姿态”，接近 default 姿态的输出天然就是站着；而 torque 的含义依赖于当前姿态和重力，同一个 torque 在不同姿态下效果完全不同。第三，action 的合理范围容易限定。

代价是 policy 必须学会一个 offset。静止时 $\dot q=0$，若这个 joint 要承受重力矩 $\tau_g$，平衡时 $K_p(q^*-q)=\tau_g$，即

$$q=q^*-\frac{\tau_g}{K_p}$$

想让 joint 停在 $q$，就要输出 $q^*=q+\tau_g/K_p$，而不是 $q$ 本身。$K_p$ 越小，这个 offset 越大，joint 越“软”。

证据：Peng 与 van de Panne 2017 年在 2D simulation 里的角色上比较了四种 action：torque、muscle activation、PD 的目标角度、目标角速度。PD 在 7 个 motion 里的 5 个上学得最快，robustness 也在最好的一组；torque 的最终 performance 最差，角色越复杂差距越大；降低 policy 的 query 频率时，torque 退化得最快。Smith 等人在真机 A1 上用 20 Hz 的 PD target，发现 action 范围必须限制在 default 姿态附近（simulation 里不限制就完全学不动），$K_d=10$ 最好（$K_d=1$ 不稳定，$K_d=20$ 达不到目标速度）。

:::back
Time-out 的 bootstrap 与[第 1 站](#ppo)的 GAE 递推、[第 2 站](#simrl)的 24 步一段直接相关。
:::

:::from
CoastRunners 来自 [OpenAI 的博客](https://openai.com/index/faulty-reward-functions/)，积木和勾腿滑行的例子来自 [DeepMind 的 specification gaming 博客](https://deepmind.google/discover/blog/specification-gaming-the-flip-side-of-ai-ingenuity/)。Potential-based shaping 的 theorem 是 Ng、Harada 与 Russell 1999 年的结果，证明是按 telescoping 自己写的，没有读原文。Reward 表、time-out 的 10% 到 20%、PD 与 50 Hz 来自 [Rudin et al. 2022](https://ar5iv.labs.arxiv.org/html/2109.11978)；正确的 target 写法来自 [Gymnasium 的教程](https://gymnasium.farama.org/main/tutorials/handling_time_limits/)；两种 time limit 和 Hopper 的结果来自 [Pardo et al. 2018](https://ar5iv.labs.arxiv.org/html/1712.00378)；action space 的比较来自 [Peng & van de Panne 2017](https://ar5iv.labs.arxiv.org/html/1611.01055)；A1 的 reward 和 PD 设置来自 [Smith et al. 2022](https://ar5iv.labs.arxiv.org/html/2208.07860)。水湾 MDP、一个 state 的 truncation 例子、CartPole 的对照实验和 PD offset 的推导是为这一页算的。
:::

## [offpolicy] Off-policy 与 sample-efficient RL：真机上的选择

:::skip
能写出 SAC 的 critic target 和 actor loss，能算出“对 noisy estimate 取 max”的 bias 并说明 clipped double Q 怎么对付它，能说出 UTD 调高之后为什么会发散、REDQ 和 LayerNorm 各自怎么治，并能对一个真机任务判断 SERL 那一套前提是否满足，就可以去第 5 站。只在 simulation 里训练的话，这一站可以先跳过 TD-MPC2 那一小节。
:::

### 真机上 sample 贵在哪

第 2 站的 policy 用了 1.47 亿个 sample。真机上的数字是另一个量级：Haarnoja 等人用 SAC 让 Minitaur 这个 quadruped学会走路，用了约 16 万步，大约 2 小时；Smith 等人让 A1 在平地上学会走，用了不到 2 万个 sample，约 20 分钟；SERL 的 PCB 插件任务 20 分钟。每个 sample 都要真实的时间，要有人在旁边，要有办法 reset，还要承担硬件损坏的风险。这时“每个 sample 尽量多用”的 off-policy 方法重新占上风：把所有 transition 存进 replay buffer，每次 update 从里面抽。

### SAC：在 Q-learning 里加 entropy

SAC 优化的是 return 加上每一步 policy 的 entropy：

$$J(\pi)=\sum_t\mathbb E\big[r(s_t,a_t)+\alpha\,\mathcal H(\pi(\cdot\mid s_t))\big]$$

$\alpha$ 叫 temperature。相应地，value 的定义多了一项：

$$V(s)=\mathbb E_{a\sim\pi}\big[Q(s,a)-\alpha\log\pi(a\mid s)\big],\qquad Q(s,a)\leftarrow r(s,a)+\gamma\,\mathbb E_{s'}\big[V(s')\big]$$

在一个 state 上，哪个 policy 让 $\mathbb E_\pi[Q]+\alpha\mathcal H(\pi)$ 最大？答案是 $\pi(a\mid s)\propto\exp\big(Q(s,a)/\alpha\big)$（第 6 站推导 DPO 时会证明这一类结论）。算一个两个 action 的例子：$Q=(1,0)$，$\alpha=0.5$。

$$\pi=\frac{(e^{2},\,e^{0})}{e^2+1}=(0.881,\ 0.119),\qquad V=\alpha\log\big(e^{1/\alpha}+e^{0}\big)=0.5\log(8.389)=1.0635$$

对照两个别的 policy：deterministic 地选第一个，$1+0=1.0$；均匀，$0.5+0.5\log2=0.847$。都比 1.0635 小。$\alpha\to0$ 时 $V\to\max_aQ=1$，退回普通的 Q-learning；$\alpha$ 越大，policy 越随机。

Continuous action 时没法对 action 求和，actor 用 reparameterization：$a=f_\phi(\varepsilon;s)$，$\varepsilon\sim\mathcal N(0,I)$，最小化

$$J_\pi(\phi)=\mathbb E_{s\sim\mathcal D,\,\varepsilon}\big[\alpha\log\pi_\phi(f_\phi(\varepsilon;s)\mid s)-Q(s,f_\phi(\varepsilon;s))\big]$$

Gradient 直接穿过 $Q$ 流到 $\phi$，不需要 score function，variance 比 policy gradient 小得多。$\alpha$ 也不必手调：SAC 的第二篇论文把它变成一个约束“entropy 不低于 $\bar{\mathcal H}$”的 dual variable，最小化 $J(\alpha)=\mathbb E[-\alpha\log\pi(a\mid s)-\alpha\bar{\mathcal H}]$：entropy 低于目标时 $\alpha$ 上升，反之下降。常见实现把 $\bar{\mathcal H}$ 设成 $-\dim(\mathcal A)$。

两个实现细节要知道。Action 通常经过 tanh 压到 $[-1,1]$，log-likelihood 要按变量替换减去 $\sum_i\log(1-\tanh^2u_i)$，漏掉它 entropy 就算错了。Critic 用两个独立训练的 Q，target 取两者中较小的那个，下面解释为什么。

### Overestimation 与 clipped double Q

Target 里的 $\max_a$（或 actor 去找 Q 最大的 action）作用在一个带 noise 的 estimate 上。设两个 action 的真实 Q 都是 0，estimate 各带独立的 $\mathcal N(0,1)$ 的 error，那么

$$\mathbb E\big[\max(X_1,X_2)\big]=\frac{1}{\sqrt\pi}=0.564$$

真实的 max 是 0，estimate 的 max 平均是 0.564。Action 越多越严重：10 个时是 1.539，100 个时是 2.508。这个 bias 还会被 bootstrap 一路传下去。设每次 backup 新加 $c$ 的 bias，再继承下一个 state 的 bias 乘 $\gamma$，稳态时 $b=\gamma(b+c)$，即

$$b=\frac{\gamma c}{1-\gamma}$$

$\gamma=0.99$、$c=0.564$ 时 $b\approx56$。Clipped double Q 取两个 estimate 的较小者，$\mathbb E[\min(X_1,X_2)]=-0.564$，换成了 underestimation。两者不对称：被高估的 action 会被 actor 主动去选，error 被利用并放大；被低估的 action 只是少被选，不会自我强化。这个理由是 TD3 的论证，SAC 的论文只说两个 Q 能“significantly speed up training”。

### 把 UTD 调高

既然 sample 贵，每个 sample 多做几个 gradient step 是自然的想法。REDQ 的论文量了直接把 SAC 的 UTD 从 1 调到 20 会怎样：Ant 和 Humanoid 上 performance 变差，Q 的 bias 在训练中剧烈波动，不同 state-action 之间、不同 seed 之间都很不一致。每个 sample 被拟合 20 次，critic 对 replay buffer 里的 data overfit，又通过上面那条 bootstrap 的链放大。

**REDQ** 的三个成分：UTD $G=20$；10 个 Q 组成 ensemble，都朝同一个 target 更新；target 取随机抽出的 2 个 Q 的最小值。$N=M=2$、$G=1$ 时它就是 SAC。在 Hopper、Walker2d、Ant、Humanoid 上，它平均在训练到一半时达到 model-based 的 MBPO 的约 1.4 倍，结束时约 1.1 倍，parameter 只有 MBPO 的 26% 到 70%。

**DroQ** 把 10 个 Q 的 ensemble 换成少数几个带 dropout 和 layer normalization 的 Q，摘要说 sample efficiency 与 REDQ 相当，计算量接近 SAC。Smith 等人在 A1 上的实验里，真正起作用的只有 layer normalization 和高 UTD：每个 environment step 做 20 次 critic update、1 次 actor update。

**为什么 LayerNorm 管用。** RLPD 的论文给了一个论证。LayerNorm（不带 affine parameter）把最后一个 hidden layer 的 $d$ 个 feature 变成 mean 0、variance 1，所以 feature vector 的 length 恒为 $\sqrt d$。Q 是最后一层 weight $w$ 和它的 inner product，由 Cauchy–Schwarz：

$$\lvert Q(s,a)\rvert=\lvert w^\top\psi(s,a)\rvert\le\lVert w\rVert\,\lVert\psi\rVert=\lVert w\rVert\sqrt d$$

不论 input 离 data 多远，Q 都有界。没有 LayerNorm 的 ReLU network，input 放大 $c$ 倍时 hidden layer 近似也放大 $c$ 倍（bias 相对变小），Q 随 $c$ 线性增长。用 256 个 random ReLU feature（seed 0）拟合 $[-1,1]$ 上的 200 个点（target $1-a^2$ 加 noise），只训练最后一层，然后在 data 以外 evaluate：

| $a$ | 1 | 2 | 5 | 10 | 100 |
|---|---|---|---|---|---|
| 不加 LayerNorm | −0.02 | −2.42 | −8.17 | −17.05 | −174.7 |
| 加 LayerNorm | −0.02 | −1.14 | −1.14 | −0.94 | −0.66 |

加了 LayerNorm 的 bound 是 $\lVert w\rVert\sqrt{256}=145$，很松，但它存在；没加的版本在 $a=100$ 时已经超过它。这个例子里外推碰巧是负的；actor 会去找 Q 外推为正的方向，那时线性增长就是 overestimation。

### 用上 demonstration：RLPD

真机任务通常有几十条 teleoperation 的 demonstration。RLPD（RL with Prior Data）的做法刻意简单：不做 offline pretraining，直接从零开始 online RL，只是让每个 batch 一半来自 demonstration buffer、一半来自 online buffer（symmetric sampling）。再加上 critic 的 LayerNorm 和大 ensemble、高 UTD。论文在 21 个任务的主比较里，约 1 万个 online sample 内就达到或超过之前的方法；在 sparse reward 的 Adroit Door 上是之前最好结果的 2.5 倍；声称是第一个有效解决全部 D4RL AntMaze 任务的方法。它对每个 environment 有一份“先试什么”的清单：先去掉 target 里的 entropy 项，clipped double Q 先开着、但要 ablate（它在 AntMaze Large Diverse 和 Humanoid Walk 上反而有害）。

### Model-based 的选择：TD-MPC2

另一条路是学一个 model。TD-MPC2 只学为控制服务的几样东西，不学能生成图像的 world model：encoder 把 observation 变成 latent $z$，latent dynamics 预测下一个 $z$，reward head 预测 reward，Q 预测 planning horizon 之后的 return，再加一个 policy prior。它不重建 observation（decoder-free），dynamics 的 loss 是让预测的下一个 latent 接近真实下一个 observation 的 encoding。

做决定时它在 latent 空间里 plan：从一个 Gaussian 里采样很多条长度为 $H$ 的 action sequence（一部分来自 policy prior），用 model 往前推，按“预测的 reward 之和加上 discounted 的末端 Q”打分，用得分高的那些 sequence 重新估计 Gaussian 的 mean 和 std，迭代几次后执行第一个 action，下一步重新 plan。

论文在 DMControl、Meta-World、ManiSkill2、MyoSuite 的 104 个 continuous control 任务上只用一套 hyperparameter，single-task 上超过 SAC、DreamerV3 和第一版 TD-MPC；一个 317M parameter 的 multitask agent 在 80 个任务上 normalized score 70.6，性能随 model 变大而提升。论文自己列出的局限：discrete action 还不行；依赖 task reward；在没见过的任务上 finetune 仍是开放问题；visual RL 只与最好的 baseline 相当。

### 真机 RL 什么时候可行

SERL 和 HIL-SERL 是目前把 real-world RL 做到“拿来能用”的两套系统。它们的 algorithm 就是 RLPD，真正的工作在 algorithm 以外：

- **Reward。** 很多任务没有可以直接读出的 reward。它们训练一个 binary classifier 判断“成功了没有”，用它的 output 当 reward。HIL-SERL 每个任务收集约 200 个正例、1000 个负例，约 5 分钟，classifier accuracy 在 95% 以上。
- **安全。** RL policy 以 10 Hz 给出目标，impedance controller 以 1 kHz 跟踪，并把参考 error 截在一个范围内，从而限制接触力。这样 policy 可以随机 explore 而不撞坏东西，也不需要 force/torque sensor。
- **Reset。** 要么人工，要么训练一个 backward policy 把场景恢复原状（forward-backward）。
- **人的 intervention。** HIL-SERL 允许人用 SpaceMouse 接管，接管期间的 data 同时进入 demonstration buffer 和 RL buffer。Intervention 一开始频繁，随训练降到接近 0。

| 系统 | 任务举例 | demonstration | 训练时间 | RL 的 success | 对照 |
|---|---|---|---|---|---|
| SERL | PCB insertion、cable routing、object relocation | 每任务 20 条 | 20、31、105 分钟 | 均为 100/100 | BC 用 100 条 demo，RL 分别是它的 10、5、1.7 倍 |
| HIL-SERL | RAM、SSD、USB 插接，IKEA 组装，双臂传递，Jenga 抽打等 | 每任务 20 到 30 条 | 多数 1 到 2.5 小时，timing belt 6 小时 | 全部 100% | BC 平均 49.7%；cycle time 9.6 秒对 5.4 秒 |

两篇论文自己的数字有不一致的地方：SERL 摘要说每个 policy 25 到 50 分钟，表里 object relocation 是 105 分钟；HIL-SERL 摘要说 1 到 2.5 小时，表里 timing belt 是 6 小时。每个任务都要单独的 reward classifier、相机选择和裁剪、reset 方式，得到的是一个任务一个 policy。

:::wrong 真机 RL 做不起来，是因为 algorithm 不够好
Smith 等人的结论几乎相反：A1 在 20 分钟内学会走，“not enabled so much by any one algorithmic component”，起作用的是 JAX 的 JIT（把 critic update 从每秒 700 次提到 2400 次，否则跟不上 20 Hz 的控制）、限制在 default 姿态附近的 action 范围、合适的 $K_d$、把速度投影到地面的 reward、一个 learned reset policy。SERL 和 HIL-SERL 用的也是现成的 RLPD，篇幅花在 reward classifier、impedance controller 和 reset 上。真机 RL 失败时，先查这些。
:::

:::back
Clipped double Q 的 overestimation 问题是 CS4246 [第 6 站](../courses/CS4246.html#fa) deadly triad 的延续。“只有 demonstration、不能再采”的极端情形是[第 5 站](#offline)。
:::

:::from
SAC 的 objective、soft value、reparameterized actor loss、temperature 的 dual objective、两个 Q 取 min、Minitaur 和 valve 的数字来自 [SAC Algorithms and Applications](https://ar5iv.labs.arxiv.org/html/1812.05905)（读了前 20 万字符，tanh 的 log-likelihood 修正和 $-\dim(\mathcal A)$ 的默认值不在读到的部分，是凭自己的知识写的）。UTD 的定义、SAC-20 的失败、REDQ 的三个成分和结果来自 [REDQ 论文](https://ar5iv.labs.arxiv.org/html/2101.05982)；DroQ 只读了[摘要](https://arxiv.org/abs/2110.02034)。LayerNorm 的界、RLPD 的设计和结果来自 [RLPD 论文](https://ar5iv.labs.arxiv.org/html/2302.02948)；TD-MPC2 来自[论文正文](https://arxiv.org/html/2310.16828v2)；SERL、HIL-SERL 的数字来自 [SERL](https://arxiv.org/html/2401.16013v4) 和 [HIL-SERL](https://arxiv.org/html/2410.21845)。“高估被利用、低估不会自我强化”是 TD3 的论证，凭自己的知识写的。两个 action 的 soft value、max 与 min 的 expectation、bias 在 bootstrap 中的稳态、random feature 的 LayerNorm 对照是为这一页算的。
:::

## [offline] Offline RL 与 offline-to-online

:::skip
能用一个 state 的例子说明 offline 时 Q 为什么会在 data 以外被高估、而且高估会被 bootstrap 放大，能写出 CQL 和 IQL 的 loss 并说出 expectile 在 $\tau\to1$ 时逼近什么，知道 offline pretrain 之后转 online 时哪些方法会掉、哪些不会，就可以去第 6 站。快速路线里第一、三小节必读。
:::

### 只有 dataset 时，Q-learning 坏在哪

Robot 实验室里攒下的 data 有 teleoperation 的 demonstration、旧 policy 的 rollout、人 intervene 时的 correction。能不能不再和 environment 交互，直接从这些 data 学出比它们更好的 policy？CS285 第 17 讲把难处归结为 counterfactual query：algorithm 要估计“data 里从没出现过的 action 会怎样”，online RL 可以去试，offline RL 不能。Function approximation 的 error 在 online 时会被新 data 纠正，offline 时永远不会。

做一个能看清的例子。一个 state，每个 action 之后回到同一个 state，$\gamma=0.9$，action $a\in[-1,1]$，真实 reward $r(a)=1-a^2$，所以最好的是 $a=0$，$Q^*(a)=1-a^2+0.9\times10=10-a^2$。Dataset 只有 40 个 action 均匀落在 $[-0.3,0.3]$ 里，reward 带 $\mathcal N(0,0.1)$ 的 noise（seed 0）。Q 用 $a$ 的 cubic polynomial 表示。

先只 fit reward：在 data 区间里它很准，但外推到 $a=1$ 时是 3.96，而真实值是 0。Cubic term 由 $[-0.3,0.3]$ 里的 noise 决定，到了区间外被放大。现在做 fitted Q iteration，target 是 $r+\gamma\max_aQ(a)$。因为只有一个 state，$\max_aQ$ 对所有 sample 是同一个数，Q 的形状就是 reward 的 fit，只是整体抬高一个 constant $C$，且 $C=\gamma(\hat r_{\max}+C)$，

$$\max_aQ(a)=\frac{\hat r_{\max}}{1-\gamma}=\frac{3.96}{0.1}=39.6$$

真实的最优 value 是 10。被选中的 action 是 $a=1$，data 里一次都没有，真实 Q 只有 9。CS285 第 17 讲用 SAC 在 offline data 上的曲线说的就是这件事：在 log scale 的图上，Q 的 estimate（agent 以为自己能拿多少）远远高于实际的 return。

换成 soft 的 policy $\mu\propto\exp(Q)$（也就是 SAC 那一类 actor 会做的事），情况一样：

::fig[mrl-offline] 不加约束时（彩线）Q 在两端往上翘，softmax policy 有 85.5% 的 probability 落在 data 以外，Q 的平均 estimate 25.4，而这个 policy 的真实 value 只有 3.79。CQL（黑线）把 data 以外压下去，最大值回到 data 区域。

CS285 第 17 讲把解法归为三类：让 policy 别去 data 以外（policy constraint）；让 Q 别高估（conservative，例如 CQL）；整个 algorithm 只用 data 里的 action（implicit，例如 IQL）。

### CQL：把 data 以外的 Q 往下压

CQL 在 Bellman error 之外加一项：把某个 action distribution $\mu$ 下的 Q 往下压，把 data 里的 action 的 Q 往上推：

$$\min_Q\ \alpha\Big(\mathbb E_{s\sim\mathcal D,a\sim\mu}[Q(s,a)]-\mathbb E_{(s,a)\sim\mathcal D}[Q(s,a)]\Big)+\tfrac12\,\mathbb E_{\mathcal D}\Big[\big(Q(s,a)-\hat{\mathcal B}^\pi\hat Q(s,a)\big)^2\Big]$$

$\mu$ 应该挑最能暴露高估的那个，即让 $\mathbb E_\mu[Q]$ 最大的。如果对 $\mu$ 加一个 entropy regularizer，$\max_\mu\big(\mathbb E_\mu[Q]+\mathcal H(\mu)\big)$ 的解是 $\mu\propto\exp Q$，最大值是 $\log\sum_a\exp Q(s,a)$（和上一站 soft value 是同一个计算，temperature 取 1）。于是第一项变成

$$\alpha\,\mathbb E_s\Big[\log\sum_a\exp Q(s,a)-\mathbb E_{a\sim\mathcal D}[Q(s,a)]\Big]$$

这就是 CQL(H)。Logsumexp 是 soft 的 max，所以这一项的意思是：最大的 Q 不能比 data 里的 Q 高出太多。论文证明了 $\alpha$ 足够大时，policy 下的 expected value 是真实 value 的 lower bound。

在上面的例子里，action 取 $[-1,1]$ 上 41 个格点，target 用 $\mu$ 下的 expectation，对 cubic 的 coefficient 做优化：

| $\alpha$ | $\arg\max Q$ | $\mathbb E_\mu[\hat Q]$ | $\mu$ 的真实 value | $\mu$ 在 data 以外的 probability |
|---|---|---|---|---|
| 0 | 1.0 | 25.37 | 3.79 | 85.5% |
| 0.1 | 0 | 6.98 | 9.18 | 29.8% |
| 1 | 0 | 8.73 | 9.57 | 15.3% |
| 3 | 0.05 | 9.36 | 9.63 | 12.4% |

$\alpha>0$ 时 estimate 都低于真实值，和 lower bound 的结论一致；$\alpha$ 越大，policy 越集中在 data 里。代价是 logsumexp 要对 action 求和，continuous action 时只能 sample，论文也承认高维 action 下这一项难以估计准。

### IQL：从不查询 data 以外的 action

IQL 的想法更彻底：Bellman backup 里的 max 是问题的来源，那就不要显式地取 max。它用一个 state 的 function $V(s)$ 去拟合“data 里那些 action 的 Q 的上沿”：

$$L_V=\mathbb E_{(s,a)\sim\mathcal D}\big[L_2^\tau\big(Q(s,a)-V(s)\big)\big],\qquad L_2^\tau(u)=\lvert\tau-\mathbb 1(u<0)\rvert\,u^2$$

$\tau=0.5$ 时 $L_2^\tau$ 是普通的 square loss，$V$ 拟合的是 mean。$\tau>0.5$ 时，$Q$ 高于 $V$ 的 sample 被罚得更重，$V$ 就往上移。最优的 $v$ 满足 derivative 为 0：$\sum_{x_i>v}\tau(x_i-v)=\sum_{x_i<v}(1-\tau)(v-x_i)$，也就是 $v$ 是一个加权平均，高于 $v$ 的点 weight 为 $\tau$，低于的为 $1-\tau$。对四个数 $\{1,2,3,10\}$ 迭代这个加权平均：

| $\tau$ | 0.5 | 0.7 | 0.9 | 0.99 | 0.999 |
|---|---|---|---|---|---|
| expectile | 4.0 | 5.5 | 8.0 | 9.77 | 9.98 |

以 $\tau=0.9$ 验证：$v=8$ 时只有 10 在上面，$\dfrac{0.1\times(1+2+3)+0.9\times10}{0.1\times3+0.9}=\dfrac{9.6}{1.2}=8$。$\tau\to1$ 时 expectile 趋向最大值，但它只在出现过的数里取。IQL 论文的 Lemma 1 说的就是这件事：$V$ 逼近 data 支撑内的 max。Q 的 target 用 $V$：

$$L_Q=\mathbb E_{(s,a,s')\sim\mathcal D}\Big[\big(r(s,a)+\gamma V(s')-Q(s,a)\big)^2\Big]$$

两个 loss 里出现的 $a$ 全部来自 dataset。Policy 最后才抽出来，用 advantage-weighted regression：

$$L_\pi=-\mathbb E_{(s,a)\sim\mathcal D}\big[\exp\big(\beta(Q(s,a)-V(s))\big)\log\pi(a\mid s)\big]$$

这是 behavior cloning 加了 weight：比 $V$ 好的 action 被模仿得更多。$\beta$ 小时接近 BC，大时接近只模仿最好的那个。

回到同一个例子：$\tau=0.5,0.7,0.9,0.99$ 时 $V$ 分别是 9.97、10.05、10.14、10.23，真实最优是 10；略高于 10 是因为它在挑 noise 偏高的那几个 sample。$\beta=10$ 的 AWR 给出的 action 是 0.043，在 data 区间的正中。论文用的是 locomotion $\tau=0.7$、$\beta=3$，AntMaze $\tau=0.9$、$\beta=10$。

:::wrong Offline RL 不过是把 reward 低的 data 过滤掉再做 behavior cloning
过滤只能挑出整条好的 trajectory。CS285 第 17 讲强调 offline RL 能做到另一件事：stitching，把不同 trajectory 里好的片段拼起来。AntMaze 的 data 是 ant 在迷宫里随机走到随机目标，几乎没有从起点直达终点的完整 trajectory。IQL 论文 Table 1 的六个 AntMaze 任务合计：BC 100.2，CQL 303.6，IQL 378.0；medium 和 large 的四个任务上 BC 全是 0。
:::

### Offline 之后接着 online

Offline 学出的 policy 通常还要在真实 environment 里继续改进。IQL 论文在 AntMaze 上比较了先 offline 再 online 100 万步的结果（六个任务合计）：

| 方法 | offline 之后 | online 100 万步之后 |
|---|---|---|
| AWAC | 107.7 | 108.3 |
| CQL | 151.5 | 231.1 |
| IQL | 370.1 | 473.7 |

CQL 在 medium-play 上从 23.0 掉到 0.0：offline 阶段的保守在 online 阶段变成了阻碍，新 data 进来时，被压低的 Q 要先被“纠正”回来，这期间 policy 可能先变差。论文注明这里的 CQL 数字是他们自己复现的，比 CQL 论文报告的 offline 结果弱。

另一条路是第 4 站的 RLPD：根本不做 offline pretraining，把 offline data 放进 replay buffer，online 时每个 batch 混一半。它不会有“转换时掉下去”的问题，代价是需要 online 交互。

对 robot data 来说，这一站的工具出现在不同的位置。SERL 和 HIL-SERL 把 demonstration 当 replay buffer 的一部分；第 6 站的 π\*0.6 用 offline 的 value function 给大规模的混合 data 打分，再按分数训练 VLA；CS285 Spring 2026 的 HW5 在 OGBench 上让学生实现 SAC+BC、IQL 和 flow Q-learning。

:::back
Bootstrap 把 overestimation 放大的计算见[第 4 站](#offpolicy)。CQL(H) 的 logsumexp 和 SAC 的 soft value 是同一个式子。
:::

:::from
问题设定、counterfactual query、三类解法、SAC 在 offline data 上严重高估、stitching 来自 [CS285 Lecture 17](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-17.pdf)；第 18 讲（IQL、CQL 的细节和 offline-to-online）抓取被拒，没有读到。CQL 的 objective、CQL(H)、lower bound theorem 来自 [CQL 论文](https://ar5iv.arxiv.org/html/2006.04779)；IQL 的三个 loss、Lemma 1、hyperparameter 和两张 AntMaze 表来自 [IQL 论文](https://ar5iv.arxiv.org/html/2110.06169)。“对 $\mu$ 加 entropy 后得到 logsumexp”的推导是自己写的。一个 state 的 cubic 例子（naive、CQL、IQL 三种做法）和 expectile 的数表是为这一页算的。
:::

## [finetune] 大 model 的 RL fine-tuning：RLHF、DPO、GRPO 与 VLA

:::skip
能从 KL-regularized objective 推出 DPO loss，能对一组 binary reward 算出 GRPO 的 advantage 并说出全对或全错的组为什么没有 gradient，能说出 diffusion / flow policy 为什么不能直接套 PPO、DPPO 和 πRL 各自怎么绕过，并能如实转述“RL 有没有教会新能力”的证据和争议，就可以去第 7 站。只关心 VLA 的话，前两小节可以快读，最后两个小节必读。
:::

### RLHF：InstructGPT 的三步

把 language model 生成一段回答看成一个 MDP：state 是 prompt 加上已经生成的 token，action 是下一个 token，回答结束时拿到一个 reward。InstructGPT 的流程分三步。

1. **SFT。** 用 labeler 写的 demonstration 回答 fine-tune GPT-3。
2. **Reward model。** 对同一个 prompt 让 labeler 给 $K=4$ 到 9 个回答排序，得到 $\binom K2$ 个两两比较。按 Bradley–Terry model，“$y_w$ 比 $y_l$ 好”的 probability 是 $\sigma\big(r_\theta(x,y_w)-r_\theta(x,y_l)\big)$，loss 是它的 negative log-likelihood。Reward model 只有 6B，175B 的训练不稳定。
3. **PPO。** 最大化

$$\mathbb E_{(x,y)\sim\pi}\Big[r_\theta(x,y)-\beta\log\frac{\pi(y\mid x)}{\pi_{\text{SFT}}(y\mid x)}\Big]$$

$\log\pi(y\mid x)$ 是 token 的 log-probability 之和，所以这个 KL penalty 可以拆到每个 token 上，作为每一步的负 reward，只有最后一个 token 额外拿到 $r_\theta$。KL 项防止 policy 跑到 reward model 没见过、因而打分不可靠的地方。

结果是在 1.3B 的 InstructGPT 和 175B 的 GPT-3 之间，labeler 更喜欢前者。代价是在 SQuAD、DROP 等公开 benchmark 上退步（论文叫 alignment tax）；在 PPO 的 objective 里混入 pretraining 的 log-likelihood（PPO-ptx）大幅减少了退步。

PPO 在这里需要一个 value model，通常和 policy 一样大，还要从 reward model 和 reference model 各算一次 forward。GPU memory 里同时放四个大 model，是后面两种方法出现的原因之一。

### KL-regularized objective 的解，与 DPO

上面的 objective 在每个 prompt 上可以精确地求最优解。记 $\pi^*(y)=\pi_{\text{ref}}(y)\,e^{r(y)/\beta}/Z$，$Z=\sum_y\pi_{\text{ref}}(y)e^{r(y)/\beta}$。对任意 $\pi$：

$$\mathbb E_\pi[r]-\beta\,\mathrm{KL}(\pi\,\Vert\,\pi_{\text{ref}})=-\beta\,\mathbb E_\pi\Big[\log\frac{\pi(y)}{\pi_{\text{ref}}(y)e^{r(y)/\beta}}\Big]=-\beta\,\mathbb E_\pi\Big[\log\frac{\pi(y)}{Z\,\pi^*(y)}\Big]=\beta\log Z-\beta\,\mathrm{KL}(\pi\,\Vert\,\pi^*)$$

KL 非负，只在 $\pi=\pi^*$ 时为 0，所以 $\pi^*$ 就是最优解，最优值是 $\beta\log Z$。（第 4 站 SAC 的 $\pi\propto\exp(Q/\alpha)$ 是 $\pi_{\text{ref}}$ 取 uniform distribution 时的同一个结论。）

算一个三个回答的例子：$r=(1,0,-1)$，$\pi_{\text{ref}}=(0.5,0.3,0.2)$，$\beta=0.5$。

$$Z=0.5e^2+0.3+0.2e^{-2}=4.0216,\qquad\pi^*=(0.9187,\ 0.0746,\ 0.0067)$$

Objective 在 $\pi^*$ 处是 $0.5\log4.0216=0.6958$；在 $\pi_{\text{ref}}$ 处是 0.3；在几乎 greedy 的 $(0.98,0.01,0.01)$ 处是 0.6722，reward 更高但 KL 罚得更多。

DPO 把这个式子倒过来用。由 $\pi^*$ 的定义，

$$r(y)=\beta\log\frac{\pi^*(y)}{\pi_{\text{ref}}(y)}+\beta\log Z$$

例子里 $\beta\log(\pi^*/\pi_{\text{ref}})=(0.3042,\,-0.6958,\,-1.6958)$，恰好是 $r$ 减去同一个数 $\beta\log Z=0.6958$。Bradley–Terry 只依赖两个回答的 reward 之差，$\beta\log Z$ 消掉了。于是可以直接用 policy 表示 preference 的 likelihood，不需要单独的 reward model，也不需要 RL：

$$L_{\text{DPO}}=-\mathbb E\Big[\log\sigma\Big(\beta\log\frac{\pi_\theta(y_w\mid x)}{\pi_{\text{ref}}(y_w\mid x)}-\beta\log\frac{\pi_\theta(y_l\mid x)}{\pi_{\text{ref}}(y_l\mid x)}\Big)\Big]$$

它的 gradient 提高 $y_w$、降低 $y_l$ 的 likelihood，weight 是 implicit reward 把这一对排错的程度。DPO 在训练时不从 model 采样，只用一份固定的 preference data，所以它和第 5 站的 offline 方法一样，学不到 data 以外的东西。Durrett 的第 7 讲把 RLHF 的几处毛病列在一起作为 RLVR 的动机：reward model 与回答长度强相关，PPO 不能无限跑下去而不 overoptimize，DPO 作为 objective 是 mis-specified 的。

### GRPO：用一组 sample 的平均当 baseline

数学题、代码题的对错可以直接验证，reward 就是 1 或 0（reinforcement learning with verifiable rewards，RLVR）。DeepSeekMath 的 GRPO 去掉了 value model：对每道题采样 $G$ 个回答，用这一组的 reward 做 baseline，

$$\hat A_i=\frac{r_i-\operatorname{mean}(r_1,\dots,r_G)}{\operatorname{std}(r_1,\dots,r_G)}$$

同一个回答的每个 token 都用这个 $\hat A_i$。Objective 是 PPO 的 clipped surrogate，按 token 平均（每个回答除以自己的长度 $\lvert o_i\rvert$），再减去 $\beta$ 倍的 KL；KL 不放进 reward，而是直接加在 loss 上，用第 7 站会推导的 k3 estimator 估计。论文给出的理由有两条：value model 和 policy 一样大，负担很重；而且只有最后一个 token 有 reward，很难训练一个在每个 token 上都准的 value model。

8 个回答里 3 个对：mean 0.375，std 0.484（population std），对的 $\hat A=0.625/0.484=1.291$，错的 $\hat A=-0.375/0.484=-0.775$。用 sample std（除以 $G-1$）则是 1.208 和 −0.725，不同实现在这里不一样。

DeepSeekMath 的设置：$G=64$、learning rate 1e-6、$\beta=0.04$、最大长度 1024、batch size 1024，每次采样后只做一次 update。DeepSeekMath-Instruct 7B 经过 GRPO，GSM8K 从 82.9% 到 88.2%，MATH 从 46.8% 到 51.7%。

### GRPO 的几处 bias，以及修补

**全对或全错的组没有 gradient。** 8 个回答全对或全错时 std 为 0，advantage 全是 0（实现里分母加了一个小数，否则是 0/0）。单个回答的 success probability 为 $p$ 时，一组里对错都有的 probability 是 $1-p^G-(1-p)^G$。

::fig[mrl-mixed] $G=8$ 时，$p=0.01$ 的题只有 7.7% 的组能提供 gradient；$G=64$ 时是 47%。太难和太简单的题在 batch 里占位置，却不贡献 learning signal。

DAPO 的 dynamic sampling 就是把这样的组过滤掉，持续采样直到 batch 填满有效的组（Durrett 第 7 讲）；TRL 的 GRPOTrainer 专门 log 一个 `frac_reward_zero_std`，就是这类组的比例。这和第 2 站 curriculum 的目的相同。

**Length normalization 让错的长回答罚得更轻。** 每个回答的 loss 除以自己的长度，一个回答整体分到的 weight 都是 $\hat A_i$，但被摊到每个 token 上：$\hat A=-0.775$ 时，100 个 token 的回答每个 token 罚 0.00775，400 个 token 的只罚 0.00194。Liu 等人（Dr. GRPO）指出这让 policy 倾向于把错的回答写长，是 R1-Zero 一类训练中回答长度不断增长的原因之一；对正确的回答则反过来偏向短的。

**Std normalization 偏向太难或太简单的题。** 对错比例接近 0 或 1 时 std 很小，除下来 advantage 被放大，这些题的 weight 反而更高。

Dr. GRPO 去掉了这两处：不除以 std，length normalization 换成除以一个 constant（例如生成长度的上限），这样就回到了 PPO 的 objective、用 Monte Carlo return 和 unbiased 的 baseline。用这个做法在 Qwen2.5-Math-7B 上训练，8 张 A100 约 27 小时，AIME 2024 到 43.3%，错误回答也明显变短。TRL 现在把这些都做成了选项：`loss_type` 可选 `"dapo"`、`"dr_grpo"` 等，`scale_rewards` 可以关掉 std normalization，$\beta$ 默认是 0（不加 KL）。

### RL 到底教会了 model 什么

这里的证据有争议，下面只转述各方的结果，不下结论。

DeepSeekMath 自己就注意到，RL 提高了 Maj@K（采样 K 次取多数），但没有提高 Pass@K（采样 K 次至少一次对）。作者的解释是 RL 让输出 distribution 更稳，把已经在 top-K 里的正确答案往前提，而不是增强了根本能力。

Yue 等人（NeurIPS 2025 oral）在多个 model family、六种 RLVR algorithm、数学、代码和 visual reasoning 上系统地测了 pass@k：RL 之后的 model 在 $k$ 小时更好，$k$ 很大时 base model 反而更高。他们的结论是当前的训练设置没有引出新的 reasoning pattern，能力来自并受限于 base model；distillation 则能引入 teacher 的新模式。下面是一个构造的例子，说明两条曲线为什么会交叉。

::fig[mrl-passk] RL 之后的 model 把一半题做得更稳（0.6 到 0.95），但把另一半里本来偶尔能做对的题大多放弃了。Pass@1 从 0.31 到 0.485，pass@256 却从 0.997 降到 0.600。交叉发生在 $k=4$ 到 8 之间。

Shao 等人（Spurious Rewards）发现，在 Qwen2.5-Math-7B 上用随机 reward 做 GRPO，MATH-500 也能提高 21.4 个点，接近用正确 reward 的 29.1 个点；同样的做法在 Llama3、OLMo2 上通常无效。他们把原因归于 GRPO 的 clipping 放大了 model 在 pretraining 中已有的偏好（例如写成代码形式的 reasoning，频率从 65% 涨到 90% 以上），并建议 RL 方法要在多个 model family 上验证。Dr. GRPO 的作者也报告，DeepSeek-V3-Base 在 RL 之前就会说“Aha”和“wait”。

这些结果都是在特定 model、特定 benchmark 上的经验研究；它们说明的是“在这些设置下 RL 主要在重新分配已有能力的 probability”，并没有证明 RL 原则上做不到更多。

### VLA 与 diffusion / flow policy 的 RL fine-tuning

Policy gradient 和 PPO 都需要 $\log\pi(a\mid s)$。Diffusion policy 和 flow matching policy（π0 就是后者）生成 action 的方式是：从 Gaussian noise 出发，经过 $K$ 步 denoising 得到 action。最终 action 的 marginal probability 要对所有中间步积分，算不出来；flow 的 ODE sampler 还是 deterministic 的，从同一个 noise 出发永远得到同一个 action。

**DPPO** 换一个角度看 denoising：每一步 $a^{k-1}\sim\mathcal N\big(\mu_\theta(a^k,k,s),\sigma_k^2I\big)$ 都是一次 Gaussian 的“action”，整条链的 log-probability 是各步 Gaussian log-probability 之和，

$$\log\pi_\theta(a^{K-1},\dots,a^0\mid s)=\sum_{k=1}^{K}\log\mathcal N\big(a^{k-1};\ \mu_\theta(a^k,k,s),\ \sigma_k^2I\big)$$

每一项都有 closed form。于是把 environment 的 MDP 和 denoising 的 MDP 叠成两层，在上面跑 PPO，advantage 只依赖 environment 的 state。为了省 GPU memory 只 fine-tune 最后几步 denoising，exploration noise 的 std 设下限。结果：Robomimic Transport 上，用 state 输入超过 90%，用 pixel 输入超过 50%，Gaussian policy 停在 0%；Furniture-Bench 的 One-leg 任务 zero-shot 部署到真机，DPPO 16/20，而 Gaussian policy 在 simulation 里 88%、真机上 0%。论文认为 diffusion 的每一步 denoising 都把 action 拉回 demonstration 的 manifold，exploration 因此是“结构化”的。代价：sample efficiency 不如 off-policy 方法，wall-clock 最多慢一倍。

**πRL** 针对 π0 和 π0.5 这类 flow VLA 给出两种办法：Flow-Noise 加一个可学的 noise network，让 denoising 变成一个能算 exact log-likelihood 的离散 MDP（训练后丢掉，inference 仍是 deterministic）；Flow-SDE 把 ODE 换成保持 marginal distribution 不变的 SDE，同样叠成两层 MDP。RL algorithm 是 PPO。少量 demonstration SFT 之后，LIBERO 平均 success rate：π0 从 57.6% 到 97.6%（Flow-Noise），π0.5 从 77.1% 到 98.3%；ManiSkill 的 4,352 种任务组合上，π0 从 38.4% 到 77.8%，π0.5 从 40.1% 到 90.9%（Flow-SDE）。用 8 张 H100。论文自己说，online RL 的 sample efficiency 太低，目前只能在 simulation 里训、再 sim-to-real。

**SimpleVLA-RL** 用的是 token 化 action 的 OpenVLA-OFT，log-likelihood 现成，直接上 GRPO：每个任务 8 个 rollout、binary 的成功 reward、不加 KL，clip 范围放宽到 $[0.8,1.28]$，rollout temperature 1.6，只保留对错都有的组。每个任务 1 条 demonstration SFT 后，LIBERO 四个 suite 平均从 48.9% 到 96.9%（Long 从 17.3% 到 91.7%；论文引言写的是 17.1%，表里是 17.3%）；RoboTwin 2.0 的 12 个双臂任务从 38.3% 到 68.8%；4 个真机任务（simulation 训练、不用真机 demonstration）平均从 17.5% 到 38.5%，正文和表格在其中两个任务上的数字不一致。论文报告了一个现象：demonstration 里总是“抓起、移动、放下”，RL 之后 policy 学会了直接把东西推过去（他们叫 pushcut）。

**What Can RL Bring to VLA Generalization?** 在 ManiSkill 的 pick-and-place 上用同一个 OpenVLA 比较 PPO、GRPO、DPO：PPO 一致最好。与 SFT 相比，RL 在视觉变化上相当，在语义变化上更好，在执行变化（物体和 robot 的初始位置、中途挪动物体）上明显更好。他们的 PPO 让 critic 和 actor 共享 VLA 的 backbone（独立 critic 慢 35%、GPU memory 多 83%），每批 data 只做 1 个 epoch；在一张 A100 上约 42 小时 converge。

**π\*0.6（RECAP）** 是 Physical Intelligence 在真机上的做法，不用 policy gradient。论文给的理由是：flow matching model 没有现成的 log-likelihood；PPO 这样的 on-policy 方法用不上已有的大量 off-policy 和 offline data；AWR 这类加权方法会丢掉或几乎丢掉大部分 data。它先在 demonstration、autonomous rollout 和人的 correction 的混合 data 上训练一个 distributional value function（预测离成功还有多少步），算出每个 sample 的 advantage，再给每个 sample 打一个标签 $I=\mathbb 1(\hat A>\varepsilon)$，把标签作为 VLA 的一个输入一起训练；部署时输入 $I=1$。

为什么输入“$I=1$”能得到更好的 policy？由 Bayes rule，

$$\pi(a\mid s,I=1)=\frac{\pi(a\mid s)\,P(I=1\mid s,a)}{P(I=1\mid s)}\ \propto\ \pi(a\mid s)\,P(I=1\mid s,a)$$

$\hat A$ 是带 noise 的 estimate，$P(I=1\mid s,a)$ 随真实 advantage 增大而增大，这就把 data 里的 policy 往好的 action 重新加权。算一个三个 action 的例子：data 里的 policy 是 $(0.5,0.3,0.2)$，真实 advantage $(0,-0.2,0.3)$（在这个 policy 下平均为 0），$\hat A$ 带 $\mathcal N(0,0.3^2)$ 的 noise，$\varepsilon=0$。那么 $P(I=1\mid a)=\Phi(A/0.3)=(0.5,0.252,0.841)$，conditioned policy 是 $(0.506,0.153,0.341)$，平均 advantage 从 0 升到 0.072；像 classifier-free guidance 那样把 $P(I=1\mid a)$ 取 3 次方，得到 $(0.335,0.026,0.639)$，平均 advantage 0.186。论文说 guidance 的 weight 太大会让行为变得激进，所以选择调 threshold $\varepsilon$。结果是公司自己的评估：在最难的几个任务上 throughput 提高一倍以上、failure rate 大约减半，连续做了 13 小时 espresso、在一个新的家里连续叠了两个多小时衣服。它每轮先收集 data、再离线训练，不是完全 online 的；人的 correction 被一律标为好的。

| 工作 | policy | RL 方法 | rollout 在哪 | 主要结果 |
|---|---|---|---|---|
| DPPO | diffusion policy | PPO（两层 MDP） | simulation，zero-shot 真机 | Transport >90%，One-leg 真机 16/20 |
| πRL | π0、π0.5（flow） | PPO（Flow-Noise / Flow-SDE） | simulation | LIBERO 57.6→97.6、77.1→98.3 |
| SimpleVLA-RL | OpenVLA-OFT | GRPO，binary reward | simulation | LIBERO 1-demo 48.9→96.9 |
| RL4VLA 研究 | OpenVLA | PPO、GRPO、DPO 对比 | simulation | PPO 最好，OOD 执行上的 generalization 提升 |
| π\*0.6 | π0.6 | advantage-conditioned 训练 | 真机，人 intervene | throughput >2×（自评） |

:::wrong RL fine-tuning 能让 VLA 学会 SFT 里完全没有的技能
这些工作的增益都建立在 SFT 已经能偶尔成功的基础上。SimpleVLA-RL 明确报告：0 条 demonstration 的 SFT model 一次都不成功，binary reward 全是 0，RL 之后仍是 0%；100 条 demonstration 时 Pick Dual Bottles 只从 1.2% 到 4.3%。这正是上面那张 $1-p^G-(1-p)^G$ 的图：$p=0$ 时一组 rollout 永远全错，没有 gradient。Pushcut 这类“新”行为也是在已有 action 的基础上找到的捷径。
:::

:::back
GRPO 的 clipped surrogate 和 PPO 是同一个式子（[第 1 站](#ppo)）；dynamic sampling 与[第 2 站](#simrl)的 curriculum 目的相同；DPO 只用固定 data，性质上属于[第 5 站](#offline)；KL 的 k3 estimator 在[第 7 站](#debug)推导。
:::

:::from
三步流程、reward model 的 loss、per-token KL、1.3B 对 175B、alignment tax 来自 [InstructGPT](https://ar5iv.labs.arxiv.org/html/2203.02155)；DPO 的推导来自 [DPO 论文](https://arxiv.org/html/2305.18290v2)（读了推导部分，实验节没有读到，所以没有引用它的实验数字；“最优解是 $\beta\log Z-\beta\mathrm{KL}$”那一行是自己补的）。GRPO 的 objective、动机、hyperparameter、Maj@K 的发现来自 [DeepSeekMath](https://arxiv.org/html/2402.03300v3)；length 与 std 的两处 bias 和 43.3% 来自 [Dr. GRPO](https://arxiv.org/html/2503.20783v2)；从 expert iteration 到 DAPO 的顺序和“RLHF 的毛病”来自 [NYU 第 7 讲](https://gregdurrett.github.io/courses/sp2026/lec-pdfs/lec7.pdf)；TRL 的选项来自 [GRPOTrainer 文档](https://huggingface.co/docs/trl/en/grpo_trainer)（parameter 表被截断，部分默认值没有读到）。[Yue et al.](https://arxiv.org/abs/2504.13837) 和 [Spurious Rewards](https://arxiv.org/abs/2506.10947) 只读了摘要。VLA 部分来自 [DPPO](https://arxiv.org/html/2409.00588v3)、[πRL](https://arxiv.org/pdf/2510.25889v3)、[SimpleVLA-RL](https://arxiv.org/html/2509.09674v1)、[RL4VLA](https://arxiv.org/html/2505.19789v4)、[π\*0.6](https://arxiv.org/html/2511.14759v2) 的方法与实验部分。三个回答的 DPO 例子、GRPO 的 advantage 与 length 数字、mixed group 的 probability、pass@k 的构造例子、RECAP 的 Bayes 例子是为这一页算的。
:::

## [debug] Debugging RL：probe、logging 与 seed

:::skip
能为自己的代码写出前三个 probe environment 并说出正确的 value，能看懂 approx_kl、clipfrac、explained_variance 并推出 k3 estimator 为什么非负，能说出 10 个 seed 的结果该怎么报告，就读完了这一页。
:::

RL 的 bug 很少让程序崩溃。代码跑得通，曲线也在动，只是学得比应该的差，或者在某个 seed 上差。Supervised learning 里“loss 降了就对了”的直觉在这里不成立，需要别的检查手段。

### 先在 probe environment 上测

Andy Jones 的建议是：先造几个小到答案一眼可知的 environment，按顺序测，每个只多一样东西。

| | action | observation | 长度 | reward | 测的是 |
|---|---|---|---|---|---|
| 1 | 1 个 | 恒为 0 | 1 步 | 恒为 +1 | value loss 和 optimizer：$V$ 应该学到 1 |
| 2 | 1 个 | 随机 $\pm1$ | 1 步 | 等于 observation | backprop：$V(\pm1)=\pm1$ |
| 3 | 1 个 | 先 0 后 1 | 2 步 | 最后一步 +1 | discount：$V(0)=\gamma$，$V(1)=1$ |
| 4 | 2 个 | 恒为 0 | 1 步 | 取决于 action，$\pm1$ | policy loss 和 advantage：应选 +1 的 action |
| 5 | 2 个 | 随机 $\pm1$ | 1 步 | action 与 observation 相符为 +1 | policy 与 value 的配合 |

每个几秒钟就能跑完，而且判断是确定的：$\gamma=0.99$ 时第 3 个 environment 的 $V(0)$ 不在 0.99 附近，就是 discount 或 bootstrap 写错了。第 3 站的 truncation bug 用第 3 个 probe 的一个变体就能抓到：让 observation 1 之后一直停在 1、每步 +1，但第 2 步就 truncate。正确的 $V(1)$ 满足 $V(1)=1+\gamma V(1)$，是 $1/(1-\gamma)=100$；把 truncation 当成终点的代码会学出 1。他还建议同时准备“作弊”的 agent（多给它目标的位置，看任务本身是否可解）和不含 network 的手写 controller（看 environment 是否有 bug）。

### 每次 update 该看哪些数

CleanRL 的 PPO 默认 log 下面这些量，它们几乎覆盖了第 1 站的每个环节：

| 指标 | 定义 | 怎么读 |
|---|---|---|
| `charts/episodic_return` | 每个 episode 的 return | 唯一直接衡量 performance 的量 |
| `losses/approx_kl` | 新旧 policy 的 KL 的 k3 estimate | 通常在 0.01 左右；很大说明 update 太猛或 data 过期，为负说明计算有错 |
| `losses/clipfrac` | 触发 clip 的 sample 比例 | 一直很高说明 learning rate 或 epoch 太多 |
| `losses/entropy` | policy 的平均 entropy | 应缓慢下降；过早降到接近 0 是 collapse，一直不降是没在学 |
| `losses/explained_variance` | $1-\mathrm{Var}(\hat R-V)/\mathrm{Var}(\hat R)$ | critic 解释了多少 return 的 variance；长期接近 0 或为负，critic 没在学 |
| `losses/value_loss` | critic 的 MSE | return 变大时它也会变大，看趋势要结合 return 的量级 |

Andy Jones 的 residual variance 就是 $1-$explained variance。LLM 的 GRPO 训练还要加上 `frac_reward_zero_std`（第 6 站）和平均回答长度。

**KL 的两个 estimator。** 新旧 policy 的 KL 是 $\mathrm{KL}(\pi_{\text{old}}\Vert\pi_{\text{new}})=\mathbb E_{a\sim\pi_{\text{old}}}[-\log\rho]$，$\rho=\pi_{\text{new}}/\pi_{\text{old}}$。直接用 sample 的 $-\log\rho$ 取平均（CleanRL 叫 `old_approx_kl`，即 k1）是 unbiased 的，但单个 sample 可以是负的。k3 加上一项 expectation 为 0 的东西：

$$\mathbb E_{a\sim\pi_{\text{old}}}[\rho]=\sum_a\pi_{\text{old}}(a)\frac{\pi_{\text{new}}(a)}{\pi_{\text{old}}(a)}=1\quad\Longrightarrow\quad\mathbb E\big[(\rho-1)-\log\rho\big]=\mathrm{KL}$$

仍然 unbiased。又因为 $\log\rho\le\rho-1$ 对所有 $\rho>0$ 成立，每个 sample 的 $(\rho-1)-\log\rho\ge0$。用 $\mathcal N(0,1)$ 当旧 policy、$\mathcal N(0.2,1)$ 当新 policy，真实 KL 是 0.02；1000 个 sample（seed 0）：k1 平均 0.0296、std 0.195，43.3% 的 sample 是负的；k3 平均 0.0191、std 0.0278。GRPO 在 loss 里用的 KL estimator 就是这个 k3（第 6 站）。

### 一个不报错的 bug

Critic 输出的 shape 是 `(B, 1)`，target 是 `(B,)`，写 `((q - y) ** 2).mean()`。NumPy 和 PyTorch 的 broadcasting 把差变成 `(B, B)` 的 matrix，第 $(i,j)$ 个 entry 是 $q_i-y_j$。Loss 照样是一个数，照样会下降。对 $q_i$ 求 derivative：

$$\frac{\partial}{\partial q_i}\frac{1}{B^2}\sum_{i',j}(q_{i'}-y_j)^2=\frac{2}{B^2}\sum_j(q_i-y_j)=0\quad\Longrightarrow\quad q_i=\frac1B\sum_jy_j$$

每个 state 的 value 都被拉向这个 batch 的 target 平均值，和 state 无关。Critic 退化成一个常数 baseline，explained variance 接近 0，policy 还能学，只是慢。这类 bug 的通用检查是在 loss 之前 assert 两边的 shape。

### 读 learning curve：seed 与 variance

第 6 站的方法、第 1 站的 37 条细节，最后都要靠曲线比较。比较之前先要知道同一份代码自己会差多少。用一份 numpy 写的 PPO（4 个 environment、每轮 128 步、learning rate 1e-3、4 个 epoch × 4 个 minibatch）在 CartPole 上跑 10 个 seed，每个 15 万步。

::fig[mrl-seeds] 代码完全相同。按 seed 0–4 和 5–9 分成两组，两条平均曲线看上去像是两个 algorithm。

取最后 10 轮的平均分：seed 0–4 组 313.9，seed 5–9 组 204.6。两组的 two-sample t-test 给出 $p=0.106$。把 10 个 seed 分成两组 5 个，一共 252 种分法，其中一半的两组差距超过 50 分，最大 156.9 分。Henderson 等人在 HalfCheetah 上用 TRPO 做同样的事，两组差异的 $p=0.0016$。

报告时的做法（RLiable 的建议）：

- 跑足够多的 seed，报告 interval estimate 而不是一个平均数。上面 10 个 seed 的 mean 是 259.3，bootstrap（对 10 个 seed 有放回地重抽 10000 次，seed 0）的 95% confidence interval 是 [203.0, 326.4]。
- 跨多个任务汇总时用 interquartile mean（去掉最高和最低各 25% 后取平均）。它比 mean 不怕 outlier，比 median 用到更多 data。只有一个任务时它的好处不明显：上面 10 个 seed 的 IQM 是 239.4，区间 [184.7, 321.1]，并不比 mean 的区间窄。
- 报告 performance profile 或 probability of improvement。RLiable 的博客举例说，Procgen 上一些声称的改进，真的更好的 probability 只有 50% 到 70%。

:::wrong Loss 在下降，所以 agent 在学
RL 的 loss 衡量的不是 performance。Policy loss 是在当前这批 data 上定义的 surrogate，换一批 data 就是另一个 function，它的数值高低没有意义；Durrett 第 7 讲和 NYU A3 的 handout 都提醒不要盯 policy-gradient 的 loss，要看 reward。Value loss 在 agent 变好时常常上升，因为 return 变大、target 的 variance 变大。上面那个 shape bug 的 critic loss 也在正常下降。能说明 agent 在学的只有 episodic return 和 evaluation success rate，而且要看多个 seed。
:::

:::back
Probe 3 的变体抓的就是[第 3 站](#reward)的 truncation bug；approx_kl 对应[第 1 站](#ppo)的 KL early stopping 和 adaptive learning rate；GRPO 的 KL 项见[第 6 站](#finetune)。
:::

:::from
Probe environment、cheat agent 和手写 controller、residual variance、“用大 batch”来自 [Andy Jones 的文章](https://hn.jakechampion.name/reader/https://andyljones.com/posts/rl-debugging.html)；指标的名字和 k1、k3 的写法来自 [CleanRL 的 PPO 文档](https://cleanrl-i3o1olwa2-vwxyzjn.vercel.app/rl-algorithms/ppo)；seed 的 t-test 来自 [Henderson et al.](https://ar5iv.labs.arxiv.org/html/1709.06560)；IQM、bootstrap、Procgen 的例子来自 [RLiable 的博客](https://research.google/blog/rliable-towards-reliable-evaluation-reporting-in-reinforcement-learning/)。k3 unbiased 且非负的推导、Gaussian 上的数值、broadcasting bug 的推导、CartPole 的 10 个 seed 实验是为这一页写的；broadcasting 这个 bug 本身是常见经验，research 底稿里也提到过。
:::

## 动手做

1. **CleanRL 的 PPO 跑 CartPole（先做）。** `git clone https://github.com/vwxyzjn/cleanrl.git && cd cleanrl && uv pip install .`，然后 `uv run python cleanrl/ppo.py --seed 1 --env-id CartPole-v0 --total-timesteps 50000`，用 `tensorboard --logdir runs` 看曲线（[README](https://raw.githubusercontent.com/vwxyzjn/cleanrl/master/README.md)）。笔记本 CPU 即可，文档没有给运行时间。CleanRL 文档报告 `ppo.py` 在 CartPole-v1 上是 492.40 ± 13.05（[PPO 文档](https://cleanrl-i3o1olwa2-vwxyzjn.vercel.app/rl-algorithms/ppo)）。提示：把 `ppo.py` 和 [37 details 博客](https://iclr-blog-track.github.io/2022/03/25/ppo-implementation-details) 的 13 条核心细节逐条对照，在代码里找到每一条（博客）；至少跑 5 个 seed 再比较任何改动（第 7 站）；把 GAE 那几行改成 `done` 不区分 termination 和 truncation，再用 probe 3 测出差别（经验）。
2. **Isaac Lab 里训 locomotion（实验室用得上）。** Release 3.0 的命令是 `uv run isaaclab train --rl_library rsl_rl --task <task>`；先用 `--task Isaac-Cartpole --num_envs 64 --max_iterations 10` 做 smoke test，再跑 locomotion，例如 `uv run isaaclab train --rl_library rsl_rl --task Isaac-Velocity-Flat-H2 --num_envs 4096 physics=newton_mjwarp`，训完用 `uv run isaaclab play --rl_library rsl_rl --task <task> --checkpoint latest --num_envs 32 --viz newton_gl` 看效果（[RL 文档](https://docs.nvidia.com/isaaclab/concepts/reinforcement-learning)、[environment 列表](https://isaac-sim.github.io/IsaacLab/main/source/isaaclab/environments.html)）。需要 NVIDIA GPU，文档没有给训练时间。提示：训练默认 headless，测速时关掉 visualizer；out of memory 时先减 `--num_envs`（文档）；Isaac Lab 2.x 用的是 `isaaclab.sh` 加 `scripts/reinforcement_learning/...` 的写法，task 的名字也不同，先查清实验室装的是哪个版本再照着对应版本的文档做（文档 3.0 页面上 2.x 的写法没有读到，这一条是经验）；训起来之后打开 rsl_rl 的 config，对照第 2 站算出每轮的 sample 数和 gradient step 数，再看 reward 的每一项（第 3 站）。
3. **NYU Building LLM Reasoners 的 A3：自己写 GRPO（值得做）。** Handout 在 [a3.pdf](https://gregdurrett.github.io/courses/sp2026/a3.pdf)，starter repo 是 [gregdurrett/nyu-llm-reasoners-a3](https://github.com/gregdurrett/nyu-llm-reasoners-a3)。要实现 `compute_group_normalized_rewards`、`compute_grpo_clip_loss`、`masked_mean`、`grpo_microbatch_train_step` 等，在 Countdown 上用 Qwen 2.5 Math 1.5B Instruct 训练。每个 GRPO 实验要 2 张 GPU（一张跑 vLLM 采样，一张训练 policy），handout 没有给时间。提示：默认配置的参考实现在 Countdown 上约 37% validation accuracy，learning rate sweep 里至少要有一个到 30%（handout）；我读到的 handout 摘要显示默认值 `train_batch_size` 64 与 `gradient_accumulation_steps` 128 似乎过不了它自己的整除检查，开跑前先核对这两个数（未在代码里验证）；`masked_mean` 和按 constant normalize 的区别正是 Dr. GRPO 的 length bias，做消融时对照第 6 站（handout 与 Dr. GRPO）。
4. **TRL 的 GRPOTrainer（有余力再做）。** [文档](https://huggingface.co/docs/trl/en/grpo_trainer) 的 quick start 用 `Qwen/Qwen2.5-0.5B-Instruct`、`trl-lib/DeepMath-103K` 和 `trl.rewards.accuracy_reward`，`torchrun --nproc_per_node 8` 跑完约 1 天。提示：`beta` 默认是 0（不加 KL），`loss_type` 可选 `"dapo"`、`"dr_grpo"` 等，`scale_rewards=False` 关掉 std normalization（文档）；盯住 `frac_reward_zero_std`，它高时说明题太难或太简单（文档与第 6 站）；只有一张 GPU 时，先换一个更小的 dataset 子集把流程跑通再说（经验）。
