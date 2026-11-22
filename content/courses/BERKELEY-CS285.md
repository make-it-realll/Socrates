---
code: BERKELEY-CS285
evidence: syllabus
evidenceNote: "前沿公开课，没有 NUS 大纲。分站和讲次以 Berkeley CS 185/285 Spring 2026（Sergey Levine）的课表和 slides 为准，作业以 Spring 2026 的 HW1–HW5 handout 和 GitHub 上的 starter code（README、pyproject、每个作业的代码骨架都读了）为准；Spring 2026 没有公开录像，观看顺序对照 Fall 2023 的 YouTube playlist。Slides 通过抓取工具只读到文字和 slide 标题，公式是图片，读不到；slides 上只有图的推导（performance difference、Fisher matrix、natural gradient、AWR 的 duality、CQL 的 bound）改为对照原论文（PPO、IQL、CQL、MOPO、RLPD、FQL、GAE、Dr. GRPO）核对，论文里也没有的按论证顺序自己补全并逐行核对。Lecture 4、11–13、19、20、23–25 后来补读了 slides 的文字（同样读不到公式），分别写成第 2、7–9、13–17 站，公式对照 VAE、control as inference 的 tutorial、MaxEnt IRL、guided cost learning、GAN 与 IRL、pseudo-count、RND、RL theory 教科书、DIAYN、Skew-Fit、HER、successor feature、C-learning 等原论文；Lecture 21 是 midterm review（只读了标题），Lecture 22 没有读。"
exam: "自学没有考试，以作业为主。Spring 2026 的 syllabus 写明注册学生的成绩由 5 份编程作业（50%，每份 10%）、final project（20%）、exam（20%）和每讲之后的 mini-quiz（10%）组成，midterm 在 4 月 15 日那一周。Autograder（Gradescope）和课程提供的 Modal 额度只对注册学生开放，自学时用 handout 里给的目标数字自查。"
subskills:
  - id: il
    name: Imitation learning：expressive policy 与 goal-conditioned BC
    l3: "能说出 MSE policy 等于固定 variance 的 Gaussian maximum likelihood，并能在两个 mode 的 data 上算出 MSE、逐维 discretization 和 autoregressive discretization 各自给出什么。"
    l4: "能独立写出 flow matching policy 的 training loss 和 Euler sampling，并解释 velocity network 为什么必须以 flow timestep $\\tau$ 为 input。"
    l5: "能对 $\\pm1$ 两个 mode 推出 optimal velocity field 的 closed form，并用 hindsight relabeling 的 random walk 例子说明 goal-conditioned BC 为什么能从 random 的 data 里学出朝向 goal 的 policy。"
  - id: basics
    name: RL 的骨架：Markov chain、objective 与 algorithm 的构成
    l3: "能写出 policy 加 MDP 得到的 state-action transition matrix，并对两个 state 的例子迭代算出 state marginal。"
    l4: "能由 $\\mu=\\mathcal T\\mu$ 解出 stationary distribution、用另一个 eigenvalue 说出 converge 的速度，并说明单个 sample 的 reward 不连续时 expectation 为什么仍对 $\\theta$ 可导。"
    l5: "能把四类 algorithm 放进“generate samples、fit、improve”的循环里，说出各自 fit 什么、sample efficiency 与 stability 差在哪，以及 sample efficiency 低的方法为什么在 simulator 里反而更快。"
  - id: pg
    name: Policy gradient 的 variance：causality、baseline 与 discount
    l3: "能写出 reward-to-go 形式的 policy gradient 和对应的 pseudo-loss，并对一个 Gaussian policy 手算一次 gradient。"
    l4: "能证明 causality（$t'<t$ 的 reward 与 $\\nabla\\log\\pi(a_t\\mid s_t)$ 的乘积 expectation 为 0），并说出 HW2 里两种 discount 写法的差别。"
    l5: "能把 full-return estimator 的 variance 拆成 reward 水平、luck 和其他 action 三部分，并说明 reward-to-go 和 baseline 各去掉了哪一部分。"
  - id: ac
    name: Actor-critic：critic、GAE 与 reparameterization
    l3: "能写出 n-step advantage 和 GAE 的 recursion，并按 recursion 从后往前算出一条 trajectory 的 advantage。"
    l4: "能证明 GAE 等于 $\\sum_l(\\gamma\\lambda)^l\\delta_{t+l}$，说出 $\\lambda=0$ 与 $\\lambda=1$ 的 bias 和 variance，并解释为什么 state-dependent baseline 不引入 bias 而 bootstrapped target 会。"
    l5: "能说清 off-policy actor-critic 的 naive 版本错在哪两处、怎样改成学 $Q$ 并用 reparameterization，并对一个 quadratic $Q$ 算出 score-function 与 reparameterized gradient 的 variance。"
  - id: q
    name: Q-learning 的实际做法：target network、n-step 与 SAC
    l3: "能写出 DQN、Double DQN 的 target，以及 hard 与 Polyak 两种 target network update。"
    l4: "能用两个 next state 的例子说明 residual gradient 为什么学错，能算出 off-policy n-step target 的 fixed point，能推出 Polyak update 的平均 lag。"
    l5: "能推出 tanh-squashed Gaussian 的 log-probability 修正、说明 $[-1,1]$ 上 entropy 的 upper bound 是 $\\log2$，并用它解释 HW3 entropy sanity check 偏高或偏低各意味着什么 bug。"
  - id: trpo
    name: Advanced policy gradient：performance difference、natural gradient 与 PPO
    l3: "能写出 importance-sampled surrogate objective，并说出 trajectory 级 importance weight 的 variance 为什么随 horizon 指数增长。"
    l4: "能证明 performance difference lemma，能由 KL 的 second-order expansion 推出 Fisher information matrix 和 natural gradient 的 step。"
    l5: "能在 LQR 的 $(k,\\sigma)$ 例子上算出 vanilla 与 natural gradient 的方向，并解释同样长度的 step 为什么一个让 KL 变成 100、一个只有 0.02。"
  - id: vi
    name: Variational inference：latent variable model、ELBO 与 VAE
    l3: "能写出 ELBO 的两种形式（expected log joint 加 entropy；reconstruction 减 KL），并在一个两点 mixture 上算出 ELBO 与 $\\log p(x)$ 的差。"
    l4: "能证明 $\\log p(x)=\\mathcal L(q)+\\mathrm{KL}(q\\|p(z\\mid x))$，写出 amortized VI 的 score-function 与 reparameterized gradient，并推出两个 Gaussian 的 KL。"
    l5: "能说明 discrete latent 为什么不能 reparameterize，并在 $\\pm1$ 两个 mode 的例子上推出 conditional VAE 的 $\\tanh$ decoder、解释它为什么能表示两个 mode。"
  - id: cai
    name: Control as inference：soft optimality 与 MaxEnt RL
    l3: "能写出 optimality variable 的定义、$V=\\log\\int\\exp Q$ 与 $\\pi=\\exp(Q-V)$，并对给定的 $Q$ 和 temperature 算出 policy。"
    l4: "能由 backward message 的 recursion 推出 soft backup，并用 forward message 说明 optimal behavior 的 state marginal 正比于 $\\alpha_t\\beta_t$。"
    l5: "能用一个 stochastic 的例子说明 exact inference 为什么 optimistic，并由固定 dynamics 的 variational distribution 推出 $\\sum_t\\mathbb E[r+\\mathcal H(\\pi)]$ 和 soft value iteration。"
  - id: irl
    name: Inverse RL：MaxEnt IRL、guided cost learning 与 adversarial imitation
    l3: "能写出 MaxEnt IRL 的 likelihood 与 gradient（demonstration 的 expectation 减当前 reward 下 soft optimal 的 expectation），并说出 reward 为什么只被确定到差一个 constant。"
    l4: "能在一个小的 chain 上用 backward 与 forward message 算出 expected visitation 并走一步 gradient，能写出 guided cost learning 的 importance weight。"
    l5: "能推出 GAN 的 optimal discriminator、IRL 形式的 discriminator 与 generator loss 等于 MaxEnt RL objective 的关系，并说明 GAIL 的 discriminator 为什么不能拿来重新 optimize。"
  - id: llm
    name: LLM 上的 RL：KL regularization、GRPO 与 KL estimator
    l3: "能写出 HW4 的 group-relative advantage、GR-REINFORCE loss 和 GRPO loss，并知道 mask 要盖住哪些 token。"
    l4: "能推出 KL-regularized objective 的 optimal policy $\\pi_{\\text{ref}}e^{r/\\beta}/Z$，能证明 $e^\\Delta-\\Delta-1$ 是 KL 的 unbiased、nonnegative estimator。"
    l5: "能说出 group 里 reward 全相同时 gradient 为什么消失、std normalization 怎样改变各 prompt 的权重，并推出把 $k_3$ 当 loss 求 gradient 时实际在 optimize 哪个方向的 KL。"
  - id: mbrl
    name: Model-based RL：planning、model 上的 gradient 与 latent model
    l3: "能写出 random shooting 和 CEM 的步骤，并说明 open-loop plan 和 closed-loop policy 的区别。"
    l4: "能用一个例子算出 open-loop 与 closed-loop 的 value 差，用 Jacobian 连乘解释 backprop through model 为什么 explode 或 vanish。"
    l5: "能说明 model-based value expansion 怎样避开 off-policy n-step 的 bias，以及只用 latent dynamics loss train deterministic encoder 为什么会 collapse。"
  - id: offline
    name: Offline RL：OOD action、policy constraint、IQL、CQL 与 FQL
    l3: "能写出 SAC+BC、IQL、FQL 三个 actor loss，并由 reward 取 $\\{-1,0\\}$、$\\gamma=0.99$ 说出 Q 值应该落在什么范围。"
    l4: "能用 linear Q 的例子算出 Q-learning 在 data 外的 max 怎样把 Q 值推到 90，能由 KL constraint 推出 AWR 的 weighted maximum likelihood，能由 CQL 的 objective 推出 tabular update 并在一个 state 的例子上算出它扣掉的 $\\chi^2$ penalty。"
    l5: "能由 expectile 的 first-order condition 算出 $\\tau\\to1$ 时它趋向 in-support 的 max，说明 IQL 为什么要分开 $V$ 和 $Q$，以及 FQL 为什么要把 flow policy distill 成 one-step policy。"
  - id: explore
    name: Exploration：optimism、count-based bonus 与 RND
    l3: "能写出 count-based bonus $r^+=r+\\mathcal B(N)$ 和几种 bonus 的 form，并由 density model 的两个 probability 算出 pseudo-count。"
    l4: "能推出 combination lock 上 random exploration 的 $2^{n+1}-2$，并说明 count bonus 为什么只要 $n^2$ 量级。"
    l5: "能说出 prediction error 的四个来源、RND 的 target 为什么要 deterministic，以及 noisy TV 问题出在哪个来源。"
  - id: theory
    name: RL theory：contraction、sample complexity 与 fitted Q-iteration 的 error
    l3: "能写出 $Q^\\pi=(I-\\gamma P^\\pi)^{-1}r$，证明每行和为 $1/(1-\\gamma)$，并证明 Bellman operator 是 $\\gamma$-contraction。"
    l4: "能推出 simulation lemma，并由 Hoeffding 与 union bound 说明 generative model 下 $Q$ 的 error 为什么是 horizon 的平方、按 $1/\\sqrt N$ 下降。"
    l5: "能把 fitted Q-iteration 的 error 拆成 sampling 与 approximation 两部分并推出 $(\\epsilon_a+\\epsilon_s)/(1-\\gamma)$，并说明这些 bound 为什么只能读成定性结论。"
  - id: skills
    name: Unsupervised skill discovery：mutual information、DIAYN 与 Skew-Fit
    l3: "能由定义推出 $I(x;y)=\\mathcal H(y)-\\mathcal H(y\\mid x)$，并算出一个简单 transition 的 empowerment。"
    l4: "能推出 DIAYN 的 lower bound 与 reward $\\log q(z\\mid s)-\\log p(z)$，并说出去掉 $-\\log p(z)$ 会怎样。"
    l5: "能把 goal reaching 写成 $\\mathcal H(G)-\\mathcal H(G\\mid S)$，算一次 Skew-Fit 的 reweighting，并说出它的局限。"
  - id: multitask
    name: Multi-task RL：goal relabeling、successor representation、hierarchy 与 meta-RL
    l3: "能说出 multi-task RL 为什么就是 joint MDP 上的 single-task RL，并对一条 bit-flipping 的 trajectory 做 final 与 future relabeling。"
    l4: "能推出 successor representation 的定义与 Bellman equation，说明 $V=\\frac1{1-\\gamma}\\mu^\\top r$，并在一个 chain 上用 GPI 拼出新 task 的 policy。"
    l5: "能说明 relabeling 为什么需要 off-policy 的 algorithm、C-learning 的 classifier 为什么给出 density ratio，以及 meta-RL 的 RNN policy 为什么不能在 episode 之间重置 hidden state。"
  - id: open
    name: Challenges and open problems：RL 作为工程工具、在真实世界里、作为通用的 learning
    l3: "能说出 Lecture 25 的三个视角，并把课程的各类 algorithm 对到这一页的站上。"
    l4: "能说出“能 simulate 就能 control”的力量和代价，以及 easy universe 与 hard universe 在三件事上的差别。"
    l5: "能说明 offline RL 为什么是“便宜的 data 学 world、reward 定义 task”这套 recipe 的中心，并举出 dialogue agent 的例子。"
open:
  - label: "Berkeley CS 185/285 Deep Reinforcement Learning（Spring 2026，Sergey Levine）课程主页、syllabus 与 Lecture 2–20、23–25 的 slides"
    url: "https://rail.eecs.berkeley.edu/deeprlcourse/"
    note: "全页的分站和每站的论证顺序；syllabus 给出成绩构成。抓取工具只给出 slides 的文字和标题（多数是转述，不是逐字原文），公式是图片没有读到；Lecture 21（midterm review）只读了标题，Lecture 22 没有读。"
  - label: "CS 185/285 Spring 2026 starter code 仓库（git clone 后读了五个作业的 README、pyproject.toml 和代码骨架，以及两个 default final project 的骨架）"
    url: "https://github.com/berkeleydeeprlcourse/homework_spring2026"
    note: "环境和 Python 版本、HW2 与 HW3 怎样处理时限截断、HW3 的 tanh distribution、HW4 的 advantage 和 KL 骨架、HW5 的 checkpoint，以及 final project 里 Dr. GRPO 的说明。"
  - label: "CS 185/285 Spring 2026 HW1: Imitation Learning（handout）"
    url: "https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw1.pdf"
    note: "第 1 站 flow matching 的 loss 与 Euler sampling 的写法；作业一节。"
  - label: "CS 185/285 Spring 2026 HW2: Policy Gradients（handout）"
    url: "https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw2.pdf"
    note: "第 3、4 站的 discount 两种写法、n-step advantage、GAE 的 recursion；作业一节。"
  - label: "CS 185/285 Spring 2026 HW3: Q-Learning and Actor-Critic（handout）"
    url: "https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw3.pdf"
    note: "第 5 站 SAC 的各个部件、entropy 的 sanity check；作业一节。"
  - label: "CS 185/285 Spring 2026 HW4: LLM RL（handout）"
    url: "https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw4.pdf"
    note: "第 10 站 group advantage、两种 loss 和 KL estimator 的写法；作业一节。"
  - label: "CS 185/285 Spring 2026 HW5: Offline RL（handout）"
    url: "https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw5.pdf"
    note: "第 12 站 SAC+BC、IQL、FQL 的 loss 和 Q 值 sanity check；作业一节。"
  - label: "CS 285 Fall 2023 课程主页（讲次表）与 Lecture 6、Lecture 16 的 slides"
    url: "https://rail.eecs.berkeley.edu/deeprlcourse-fa23/"
    note: "录像的观看顺序；Lecture 6 off-policy actor-critic 一节和 Lecture 16 的 policy constraint、IQL、CQL 部分（都只读到文字）。"
  - label: "Schulman et al. 2016, High-Dimensional Continuous Control Using Generalized Advantage Estimation"
    url: "https://arxiv.org/pdf/1506.02438v5"
    note: "第 4 站 TD residual、$k$-step estimator、GAE 的 closed form、$\\lambda=0,1$ 两端的性质，以及实验里 best $\\lambda$ 的范围。"
  - label: "Schulman et al. 2015, Trust Region Policy Optimization"
    url: "https://arxiv.org/pdf/1502.05477v4"
    note: "第 6 站 performance difference identity（引 Kakade 与 Langford 2002）的证明、Theorem 1、KL 的 quadratic approximation、conjugate gradient 与 line search、$\\delta=0.01$。"
  - label: "Schulman et al. 2017, Proximal Policy Optimization Algorithms"
    url: "https://arxiv.org/pdf/1707.06347"
    note: "第 6 站 adaptive KL penalty 的规则、clip objective、entropy bonus 的系数。"
  - label: "Liu et al. 2025, Understanding R1-Zero-Like Training: A Critical Perspective（Dr. GRPO）"
    url: "https://arxiv.org/html/2503.20783v2"
    note: "第 10 站 $1/T_i$ 和 std normalization 两种 bias。读了前 10 万字符（第 3 节在内）。"
  - label: "Kostrikov, Nair, Levine 2022, Offline Reinforcement Learning with Implicit Q-Learning"
    url: "https://arxiv.org/pdf/2110.06169"
    note: "第 12 站的 expectile loss、三个 loss、Lemma 1、为什么要分开 $V$ 和 $Q$（第 4.2 节），以及 Appendix B 的 hyperparameter。"
  - label: "Kumar, Zhou, Tucker, Levine 2020, Conservative Q-Learning for Offline Reinforcement Learning"
    url: "https://arxiv.org/pdf/2006.04779"
    note: "第 12 站 CQL 的两个 objective、Theorem 3.1 与 3.2、tabular 的 update。读了前 10 万字符；抓取工具提示部分记号是从上下文补的，用到的式子都按论文的推导重新核对过。"
  - label: "Ball, Smith, Kostrikov, Levine 2023, Efficient Online Reinforcement Learning with Offline Data（RLPD）"
    url: "https://arxiv.org/pdf/2302.02948"
    note: "第 12 站 offline 到 online 的三个设计：symmetric sampling、LayerNorm、ensemble。"
  - label: "Yu et al. 2020, MOPO: Model-based Offline Policy Optimization"
    url: "https://arxiv.org/pdf/2005.13239"
    note: "第 12 站 uncertainty-penalized reward 和 Theorem 4.4。"
  - label: "Park, Li, Levine 2025, Flow Q-Learning"
    url: "https://arxiv.org/pdf/2502.02538"
    note: "第 12 站 FQL 的动机、loss、10 步 Euler、Table 2 里与 IQL、ReBRAC 的对比数字。"
  - label: "CS 285 Fall 2023 Lecture 4 与 Lecture 17（RL theory basics）的 slides"
    url: "https://rail.eecs.berkeley.edu/deeprlcourse-fa23/deeprlcourse-fa23/static/slides/lec-4.pdf"
    note: "第 2 站和第 14 站对照用，只读到文字，公式和图都没有。"
  - label: "Kingma 与 Welling 2013, Auto-Encoding Variational Bayes"
    url: "https://ar5iv.labs.arxiv.org/html/1312.6114"
    note: "第 7 站 ELBO 的分解、reparameterization、Gaussian KL 的 closed form 与 VAE estimator（读了前 20 万字符，Appendix B 的最后一步没有读到）。"
  - label: "Levine 2018, Reinforcement Learning and Control as Probabilistic Inference: Tutorial and Review"
    url: "https://arxiv.org/pdf/1805.00909v2"
    note: "第 8 站 optimality variable、backward message、optimism、variational distribution、soft value iteration 及其变体（第 2、3 节；抓取工具只给了重述）。"
  - label: "Ziebart 等 2008, Maximum Entropy Inverse Reinforcement Learning"
    url: "https://www.ri.cmu.edu/pub_files/pub4/ziebart_brian_d_2008_1/ziebart_brian_d_2008_1.pdf"
    note: "第 9 站 trajectory distribution、用 visitation 写的 gradient、Algorithm 1、feature matching 与 ambiguity。"
  - label: "Finn、Levine、Abbeel 2016, Guided Cost Learning"
    url: "https://arxiv.org/pdf/1603.00448"
    note: "第 9 站 importance-sampled 的 loss 与 gradient、Algorithm 1、sampler 的更新方式。"
  - label: "Finn、Christiano、Abbeel、Levine 2016, A Connection between GANs, Inverse RL, and Energy-Based Models"
    url: "https://arxiv.org/pdf/1611.03852"
    note: "第 9 站 optimal discriminator、reward 决定的 discriminator、三个等价结论与 generator loss。"
  - label: "Bellemare 等 2016, Unifying Count-Based Exploration and Intrinsic Motivation"
    url: "https://arxiv.org/pdf/1606.01868"
    note: "第 13 站 pseudo-count 的定义与解、bonus 的 form、Montezuma's Revenge 的房间数。"
  - label: "Burda 等 2018, Exploration by Random Network Distillation"
    url: "https://arxiv.org/pdf/1810.12894v1"
    note: "第 13 站 RND 的定义、prediction error 的四个来源、normalization 与结果。"
  - label: "Auer、Cesa-Bianchi、Fischer 2002, Finite-time Analysis of the Multiarmed Bandit Problem"
    url: "https://homes.di.unimi.it/%7Ecesabian/Pubblicazioni/ml-02.pdf"
    note: "第 13 站 regret 的定义与 UCB1 的 index。"
  - label: "Agarwal、Jiang、Kakade、Sun, Reinforcement Learning: Theory and Algorithms"
    url: "https://rltheorybook.github.io/rltheorybook_AJKS.pdf"
    note: "第 14 站 Corollary 1.5、Lemma 1.10、simulation lemma（Lemma 2.2）、Lemma A.8、Proposition 2.1 与 Theorem 2.6–2.8（读了前 10 万字符）。"
  - label: "Eysenbach、Gupta、Ibarz、Levine 2018, Diversity is All You Need"
    url: "https://arxiv.org/pdf/1802.06070"
    note: "第 15 站 DIAYN 的 objective、lower bound、pseudo-reward、algorithm 与 $-\\log p(z)$ 的理由。"
  - label: "Pong、Dalal 等 2019, Skew-Fit: State-Covering Self-Supervised Reinforcement Learning"
    url: "https://arxiv.org/pdf/1903.03698"
    note: "第 15 站 $I(S;G)$ 的写法、skew 的 weight、Lemma 3.1 与 3.2 的条件、实验的 $\\alpha$。"
  - label: "Andrychowicz 等 2017, Hindsight Experience Replay"
    url: "https://arxiv.org/pdf/1707.01495"
    note: "第 16 站 bit-flipping 的设定与结果、Algorithm 1、四种 relabel 的 strategy。"
  - label: "Barreto 等 2017, Successor Features for Transfer in Reinforcement Learning"
    url: "https://arxiv.org/pdf/1606.05312"
    note: "第 16 站 successor feature 的定义、$Q=\\psi^\\top w$、GPI 的 Theorem 1 与 Theorem 2。"
  - label: "Eysenbach、Salakhutdinov、Levine 2020, C-Learning: Learning to Achieve Goals via Recursive Classification"
    url: "https://arxiv.org/pdf/2011.08909"
    note: "第 16 站 classifier、density ratio、on-policy 与 off-policy 的形式（抓取工具只给了重述）。"
  - label: "Schaul 等 2019, Ray Interference: a Source of Plateaus in Deep Reinforcement Learning（只读了摘要）"
    url: "https://arxiv.org/abs/1904.11455v1"
    note: "第 16 站 ray interference 的描述。"
  - label: "OpenAI Spinning Up：Exercises 与 Exercise 2.2 的 solution"
    url: "https://spinningup.openai.com/en/latest/spinningup/exercises.html"
    note: "开头“更轻的几条路”和作业一节最后的 note。"
  - label: "Hugging Face Deep RL Course 的 GitHub 仓库（README 的 maintenance notice、Unit 4 与 Unit 8 的 introduction）"
    url: "https://www.github.com/huggingface/deep-rl-class"
    note: "开头“更轻的几条路”。"
sources:
  - label: "CS 285 Fall 2023 录像 playlist（YouTube）"
    url: "https://www.youtube.com/playlist?list=PL_iWQOsE6TfVYGEGiAOMaOzzv41Jfm_Ps"
  - label: "Stanford CS224R Spring 2026 课程主页（只核对了讲次表）"
    url: "https://cs224r.stanford.edu"
---

先看三次训练。三次都没有报错，代码也都照着 formula 写对了。

**第一次。** 一个 10 步的问题，policy gradient 的 estimate 是 unbiased 的。每次用 4 条 trajectory 估一个 gradient，三次里有一次估出来的方向是反的。

::fig[cs285-pgbatch] 动图，每一帧是一个新的 batch。看下面的点：每个 batch 估出的 $g$ 从 −12 散到 14，true gradient 只有 2.5，24 个点里有 8 个落在 0 的左边。上面是这个 batch 的 4 条 trajectory，$X$ 是 $\sum_t\nabla\log\pi$，$R$ 是 return。第 3 站细讲。

**第二次。** 一个只有 action 0 和 action 1 的 dataset，用 linear Q-function 做 fitted Q-iteration。Q 值从 9 一路涨到 90，最被看好的是 data 里从没出现过的 action 9。真正能拿到的 Q 只有 10。

::fig[cs285-ood] 动图，一轮一轮做 fitted Q-iteration。看彩色 line 右端的圆圈：max 每轮都落在 data 之外的 $a=9$，target 跟着它涨，整条 line 被一轮轮抬高；黑线是只在 data 的 action 里取 max，停在 10。第 12 站细讲。

**第三次。** 用 GRPO train 一个 math 题答对率 23% 的 LLM，每个 prompt 抽 8 个回答。有 12% 的 prompt 上 8 个回答全错，这些 prompt 贡献的 gradient 恰好是 0，不管 loss 写得对不对。

::fig[cs285-grpo] 动图，每一帧换一批 prompt。看涂色的列：8 个回答全错，reward 全是 0，group 里没有比较对象，advantage 全是 0。

RL 里几乎每个 algorithm 都在做同一件事：用 sample 去估一个 expectation，有时是 gradient，有时是 value。出问题的方式只有两种。一种是 sample 太吵，estimate 的 variance 大到方向都不可靠（第一次、第三次）；另一种是 sample 来自一个 distribution，问题却关于另一个 distribution（第二次）。这门课的每一讲都可以读成在对付其中一种。

| 站 | 在估什么 | 麻烦来自 | 办法 |
|---|---|---|---|
| 1 Imitation learning | expert 的 action distribution | multimodal 的 action；test 时的 state 和 goal 与 data 不同 | autoregressive discretization、flow matching、relabeling |
| 2 RL 的骨架 | trajectory distribution 下的 total reward | reward 不光滑；各类方法 fit 的东西不同 | 把 policy 加 MDP 看成 Markov chain，求 expectation |
| 3 Policy gradient | $\nabla_\theta J$ | 一条 trajectory 的 return 太吵 | causality、baseline |
| 4 Actor-critic | advantage | Monte Carlo 太吵，critic 有 bias | GAE 在两者之间取舍，reparameterization |
| 5 Q-learning | $Q^*$ | target 跟着自己动；n-step 的 reward 来自旧 policy | target network、double Q、SAC 的 entropy |
| 6 Advanced PG | 新 policy 的 return | data 来自旧 policy | importance sampling、KL constraint、natural gradient |
| 7 Variational inference | latent variable model 的 likelihood | posterior 求不出；score-function gradient 太吵 | ELBO、amortized $q$、reparameterization |
| 8 Control as inference | soft optimal 的 policy | exact inference 假设自己运气好 | 固定 dynamics 的 variational inference，soft value iteration |
| 9 Inverse RL | 能解释 demonstration 的 reward | partition function 要解一整个 RL；reward 不唯一 | forward-backward、importance sampling、GAN 形式 |
| 10 LLM RL | outcome reward 的 gradient | group 里 reward 相同时没有信号；reward 不可信 | group baseline、KL 到 reference model |
| 11 Model-based RL | model 里的 return | planner 去 model 错的地方；Jacobian 连乘 | CEM、short rollout、latent model |
| 12 Offline RL | data 之外的 action 的 value | 无法试，Q 在 data 外乱涨 | policy constraint、expectile、FQL |
| 13 Exploration | 一个 state 有多新 | 高维 state 没有 count；random exploration 要 exponential 的时间 | optimism、pseudo-count、RND |
| 14 RL theory | $Q$ 的 error | sampling 与 approximation 的 error 随 horizon 累积 | contraction、concentration、simulation lemma |
| 15 Skill discovery | skill 与 state 的 mutual information | 没有 reward；见过的 state 集中在起点附近 | discriminator 的 lower bound、Skew-Fit |
| 16 Multi-task RL | 新 task 的 $Q$ | reward sparse；task 之间互相干扰；task 看不见 | relabeling、successor feature 与 GPI、RNN 的 meta-RL |
| 17 Open problems | 整门课还缺什么 | 没有 simulator 的 hard universe | 用 offline RL 消化大量便宜的 data |

这一页默认读过 [CS4246](../courses/CS4246.html) 的 MDP、Bellman equation、TD、DQN 和 policy gradient 的基本推导，以及 [RB4301](../courses/RB4301.html) 的 compounding error、DAgger、diffusion policy、action chunking、TD3、SAC 的 objective、PPO 的 clip、learned dynamics 与 MPC。那些内容这里只给链接，篇幅留给 CS285 讲得更深的部分，每站开头的 `:::skip` 写明这一站在“只有十几个小时”的快速路线里是否必读。

Spring 2026 的 slides 是最新的，Fall 2023 有完整录像，两期的讲次编号不同：

| 站 | Spring 2026 slides | Fall 2023 录像 |
|---|---|---|
| 1 | Lecture 2–3 Behavioral Cloning | Lecture 2 |
| 2 | Lecture 4 RL Basics | Lecture 4 |
| 3 | Lecture 5 Policy Gradients | Lecture 5 |
| 4 | Lecture 6 Actor-Critic | Lecture 6 |
| 5 | Lecture 7–8 Value-Based RL、Q-learning in Practice | Lecture 7–8 |
| 6 | Lecture 9–10 Advanced Policy Gradients | Lecture 9 |
| 7 | Lecture 11 Variational Inference、Lecture 12 前两部分 | Lecture 18 |
| 8 | Lecture 12 第三部分、Lecture 13 前三部分 | Lecture 19 |
| 9 | Lecture 13 后两部分 | Lecture 20 |
| 10 | Lecture 14 LLM RL | 没有对应的一讲，只读 slides |
| 11 | Lecture 15–16 Model-Based RL | Lecture 10–12 |
| 12 | Lecture 17–18 Offline RL | Lecture 15–16 |
| 13 | Lecture 19 Exploration | Lecture 13 |
| 14 | Lecture 20 RL Theory | Lecture 17 |
| 15 | Lecture 23 Advanced Exploration（slides 标题是 Exploration and Skill Learning） | Lecture 14 |
| 16 | Lecture 24 Multi-task RL（slides 标题是 Multi-Task and Hierarchical RL） | Lecture 22 |
| 17 | Lecture 25 Challenges and Open Problems | Lecture 23 |

Lecture 21–22 是 midterm review，没有单独成站（Lecture 21 的 slide 标题全是 Lecture 2–10 讲过的内容；Lecture 22 没有读）。Fall 2023 那一列只按 Fall 2023 课程主页的讲次标题对应，录像本身没有看过。

:::note 更轻的几条路
同样讲 deep RL 的公开课还有三门。Stanford CS224R（Chelsea Finn，Spring 2026）比 CS285 短，更偏机器人：课表里有 Lecture 16 “RL for Robots: Sim-to-Real Transfer”和 Lecture 17 “RL for VLAs”；据本站的调研条目（这一页没有重读 handout），它的 HW2 在 Sawyer 锤钉子这种 sparse reward 的任务上对比 PPO 和 off-policy actor-critic，handout 只支持在 Modal 上跑。Hugging Face Deep RL Course 是最快的上手路线：Unit 4 用 PyTorch 从零写 Monte Carlo REINFORCE，Unit 8 照着 CleanRL 的实现从零写 PPO 并在 LunarLander-v2 上测；仓库 README 说课程已进入 low-maintenance 状态，Unit 7 的 AI vs AI 对战和 leaderboard 不再工作（agent 仍然可以 train）。OpenAI Spinning Up 的 Exercise 2.2 “Silent Bug in DDPG”给一份带 bug 的 DDPG，跑 6 个 run（有 bug 与没 bug 各 3 个 seed，每个约 10 分钟），让你不看源码找出 bug 是什么；有 PyTorch 和 TensorFlow 两个版本。时间只有一两个周末时，先做 Hugging Face 的 Unit 4 和 Unit 8 建立手感，再回到这一页。
:::

## [il] Imitation learning：expressive policy 与 goal-conditioned BC

:::skip
快速路线必读，HW1 直接依赖它。已经读过 [RB4301 的 bc、gen、chunk 三站](../courses/RB4301.html#bc)的，第一小节可以略过。能说出逐维 discretization 为什么错、autoregressive discretization 为什么对，能写出 flow matching 的 loss 并解释 $\tau$ 为什么必须进 network，就可以去第 2 站。
:::

### Behavioral cloning 就是 maximum likelihood

手里有 demonstration $\mathcal D=\{(o_i,a_i)\}$，behavioral cloning（BC）就是

$$\theta^*=\arg\max_\theta\sum_i\log\pi_\theta(a_i\mid o_i)$$

Action 是 discrete 的（Atari 的按键、LLM 的 token），network 输出 logits，$-\log\pi$ 就是 cross-entropy。Action 是 continuous 的，network 输出一个 distribution 的 parameter。最常见的选择是 variance 固定为 $\sigma^2I$ 的 Gaussian，这时

$$-\log\mathcal N\big(a;\mu_\theta(o),\sigma^2I\big)=\frac{\|a-\mu_\theta(o)\|^2}{2\sigma^2}+\frac d2\log(2\pi\sigma^2)$$

第二项和 $\theta$ 无关。所以 HW1 第一部分的 MSE policy（handout 的 Eq. 1）不是一个另起炉灶的 loss，它是“policy 是单个 Gaussian”这一假设下的 maximum likelihood。这个假设决定了它能表示什么：一个以 $\mu_\theta(o)$ 为中心的 bump。MSE 的 minimizer 是 conditional mean $\mathbb E[a\mid o]$，推导在 [RB4301](../courses/RB4301.html#gen)。

BC 和普通 supervised learning 的区别在于 i.i.d. 假设不成立：policy 自己的 action 决定它下一步看到什么 observation。Error 按 $T^2$ 累积、DAgger 怎样把它降到 linear，在 [RB4301 的 bc 站](../courses/RB4301.html#bc)有完整推导。Lecture 3 把“fit expert 也会失败”的原因归成两条：expert 的行为不是 Markovian 的（依赖历史），以及 expert 的行为是 multimodal 的。这一站讲后一条。

### 一维一维地 discretize：为什么可以

设想 demonstration 里的人绕过一个障碍物，从左下绕（action $(-1,-1)$）或从右上绕（action $(+1,+1)$），两种各一半。用 seed 0 抽 200 条，$(+1,+1)$ 占 55.5%。三种 policy class 各给出什么：

| Policy | 学到的东西 | 撞上障碍物的 action $(-1,+1)$、$(+1,-1)$ 或中间 |
|---|---|---|
| MSE（单个 Gaussian） | mean $(0.11,\ 0.11)$ | 100%：输出就在两条路中间 |
| 每一维一个独立的 softmax | $P(a_1{=}{+}1)=P(a_2{=}{+}1)=0.555$ | $0.555\times0.445\times2=49.4\%$ |
| Autoregressive：先 $a_1$，再 $a_2\mid a_1$ | $P(a_2{=}{+}1\mid a_1{=}{+}1)=1$，$P(a_2{=}{+}1\mid a_1{=}{-}1)=0$ | 0 |

::fig[cs285-ar] 同一份 data 下三种 policy 在四个格子上的 probability。逐维独立的 softmax 把 marginal 学对了，却把一半的 mass 放到了 data 里没有的两个角上。

Discretize 本身没有问题，1 维 action 切成 $N$ 个 bin，softmax 能表示这 $N$ 个 bin 上的任意 distribution。问题在 dimension：$d$ 维的 joint 有 $N^d$ 个格子。机器人 arm 的 action 是 7 维，每维 256 个 bin，joint 是 $256^7\approx7.2\times10^{16}$ 个 output，做不出来。逐维独立地 discretize 只要 $7\times256=1792$ 个 output，代价是它只能表示 $p(a_1)\,p(a_2)\cdots p(a_d)$ 这种各维互相独立的 distribution，上表第二行就是这个代价。

Lecture 3 的办法是 autoregressive discretization：一次只 discretize 一维，后面的维以前面已经取定的值为 condition。Slide 问“why does this work?”，答案是 probability 的 chain rule，它对任何 joint distribution 都恰好成立：

$$p(a_1,\dots,a_d\mid o)=p(a_1\mid o)\,p(a_2\mid o,a_1)\cdots p(a_d\mid o,a_1,\dots,a_{d-1})$$

右边每个 factor 都是一维的 distribution，用一个 $N$ 个 bin 的 softmax 就能表示到 bin 的精度。所以 autoregressive 的 policy 除了 binning 之外没有做任何 approximation，output 的个数仍然是 $d\times N$。Sampling 时依次抽 $a_1$、把它喂回去抽 $a_2$，和 LLM 逐个生成 token 是同一个结构，上表第三行的 $P(a_2\mid a_1)$ 正是这样学到的。

:::wrong 每一维的 distribution 都学对了，合起来的 action 就是对的
上表第二行每一维的 marginal 都和 data 一模一样（0.555 对 0.445），可是有 49.4% 的 sample 落在 data 里一次都没出现过的两个角上。Marginal 只描述各维自己，两条路线的区别全在维与维之间的 correlation 里：$a_1=+1$ 时 $a_2$ 一定是 $+1$。逐维独立的 policy 在结构上就丢掉了它。
:::

### Flow matching policy：noise 必须真的被用上

Continuous action 想要多个 mode，常见的思路是给 network 喂一个 noise $z$，希望不同的 $z$ 落到不同的 mode。Lecture 3 指出这里的关键困难：noise 必须真的被 model 用上。直接用 MSE 去 train $f_\theta(o,z)\approx a$ 是不行的。$z$ 和 data 里的 $a$ 互相独立，所以 MSE 的 minimizer 是 $\mathbb E[a\mid o,z]=\mathbb E[a\mid o]$，network 学会忽略 $z$，输出 mean。Training target 必须把每个 $z$ 和某个具体的 $a$ 绑在一起。

Flow matching 的绑法是一条从 noise 到 data 的直线。HW1 的写法（$A_t$ 是 $K$ 步的 action chunk，$A_{t,0}\sim\mathcal N(0,I)$，$\tau\sim U(0,1)$）：

$$A_{t,\tau}=\tau A_t+(1-\tau)A_{t,0},\qquad\mathcal L_{\text{FM}}(\theta)=\frac1B\sum_j\Big\|v_\theta\big(o_t,A_{t,\tau},\tau\big)-\big(A_t-A_{t,0}\big)\Big\|_2^2$$

$A_t-A_{t,0}$ 是沿这条直线走的 velocity。Inference 时从 $A_{t,0}\sim\mathcal N(0,I)$ 出发，用 $n$ 步 Euler 走到 $\tau=1$：

$$A_{t,\tau+1/n}=A_{t,\tau}+\frac1n\,v_\theta(o_t,A_{t,\tau},\tau)$$

Network 学到的是什么？这又是一个 MSE，minimizer 是 conditional expectation：

$$v^*(x,\tau)=\mathbb E\big[A_t-A_{t,0}\ \big|\ A_{t,\tau}=x\big]$$

在最小的例子上把它算出来。Action 是 1 维的，data 里 $a=+1$、$a=-1$ 各一半，记 $s=1-\tau$。给定 $a$，$x=\tau a+s z$ 服从 $\mathcal N(\tau a,s^2)$，两个 mode 的 likelihood 之比是

$$\frac{\mathcal N(x;\tau,s^2)}{\mathcal N(x;-\tau,s^2)}=\exp\Big(\frac{(x+\tau)^2-(x-\tau)^2}{2s^2}\Big)=\exp\Big(\frac{2\tau x}{s^2}\Big)$$

所以 $P(a=+1\mid x)=1/(1+e^{-2\tau x/s^2})$，$\mathbb E[a\mid x]=2P(a=+1\mid x)-1=\tanh(\tau x/s^2)$。又由 $x=\tau a+sz$ 得 $z=(x-\tau a)/s$，

$$a-z=a-\frac{x-\tau a}{s}=\frac{a-x}{s}\qquad\Longrightarrow\qquad v^*(x,\tau)=\frac{\tanh\big(\tau x/(1-\tau)^2\big)-x}{1-\tau}$$

拿它检验一下：$\tau=0$ 时 $v^*=-x$，Euler 一步从任何 $x$ 都走到 0，正是 mean，和 [RB4301](../courses/RB4301.html#gen) 里“一步 flow matching 就是 MSE regression”一致。$\tau$ 接近 1 时，$\tanh$ 里的 argument 被 $(1-\tau)^2$ 放大，$x$ 只要稍微偏正就被推向 $+1$，偏负就被推向 $-1$。这个 field 前期把 sample 往中间收，后期再果断地分开。

用 $n=10$ 步 Euler、2000 个 $z$（seed 0）实际走一遍：全部 sample 落在 $\pm1$ 的 0.1 以内。

HW1 的 tip 说 network 必须以 $\tau$ 为 input。漏掉它会怎样？Network 只看到 $x$，MSE 的 minimizer 变成对 $\tau$ 平均后的 $\bar v(x)=\mathbb E[A_t-A_{t,0}\mid A_{t,\tau}=x]$，其中 $\tau$ 也是 random 的。按 $p(x\mid\tau)$ 加权对 $\tau$ 做 numerical integration：$\bar v(0.25)=0.31$，$\bar v(0.5)=0.53$，$\bar v(1)=-0.08$，$\bar v(2)=-1.88$。它是一个和时间无关的 field，在 0 和 $\pm1$ 附近有 fixed point。同样 10 步 Euler、同样的 2000 个 $z$：

| | 落在 $\pm1$ 的 0.1 以内 | 停在 $\lvert x\rvert<0.5$ |
|---|---|---|
| $v^*(x,\tau)$，network 看得到 $\tau$ | 100% | 0 |
| $\bar v(x)$，network 看不到 $\tau$ | 71.5% | 12.0% |

::fig[cs285-flowtau] 左边 network 知道 $\tau$：前半段收拢，最后几步把每条 path 分到某一个 mode。右边 network 不知道 $\tau$：它只能用一个平均的 field，从 0 附近出发的 path 走完整段时间也没离开中间。

原因在 0 附近。真正的 field 在 $\tau=0.9$ 时于 $x=0$ 处的 slope 是 $\tau/(1-\tau)^3-1/(1-\tau)\approx890$，$x$ 离 0 一点点就被放大成一整个 mode；平均之后的 $\bar v$ 在 0 附近的 slope 只有 1.3，从 $z=0.05$ 出发，10 步 Euler 走完只到 0.17；同一个起点用 $v^*$ 走，最后落在 1.00。Flow timestep 告诉 network“现在是该收拢还是该分开”。

Action 换成 $K$ 步的 chunk 时，上面每个量都换成 $K\times2$ 维的 vector，推导不变。为什么要一次输出一个 chunk，见 [RB4301 的 chunk 站](../courses/RB4301.html#chunk)。

:::wrong 把 noise 喂进 network，policy 就是 stochastic 的，自然能表示多个 mode
只把 $z$ 当 input、用 MSE 去 fit dataset action，$z$ 和 $a$ 独立，minimizer 是 $\mathbb E[a\mid o]$：对上面 $\pm1$ 的 data，每个 $z$ 都输出 0，policy 是 deterministic 的，而且正好落在两个 mode 中间。Stochastic 的 input 不等于 stochastic 的 output。Flow matching 之所以能用上 noise，是因为 target $A_t-A_{t,0}$ 本身含有 $z$，每个 noise 在 training 时都和一个具体的 action 配了对。
:::

### Goal-conditioned BC 与 hindsight relabeling

Lecture 3 的第三部分问：学很多个 task 会不会反而更容易？把 policy 写成 $\pi(a\mid s,g)$，$g$ 是要到达的 goal。任何一条 trajectory，不管当初想去哪里，都是“到达它自己的终点”的 demonstration。把终点 $s_T$ 填进 $g$，这叫 hindsight relabeling，它让随便收集的 data 都变成 demonstration。

随便收集的 data 学得出好的 policy 吗？算一个例子。一维的 random walk，从 0 出发，每步以 probability $\tfrac12$ 走 $+1$ 或 $-1$，走 10 步。把每条 trajectory 按终点 relabel，policy 以 $(s,g,n)$ 为 condition，$n$ 是剩余步数，$d=g-s$ 是剩余位移。在终点为 $g$ 的 trajectory 里，下一步朝 goal 走的比例是多少？剩余 $n$ 步、位移 $d$，需要向上 $(n+d)/2$ 步，这样的 path 有 $\binom{n}{(n+d)/2}$ 条，其中第一步向上的有 $\binom{n-1}{(n+d)/2-1}$ 条，相除：

$$P(\text{下一步朝 goal}\mid d,n)=\frac{\binom{n-1}{(n+d)/2-1}}{\binom{n}{(n+d)/2}}=\frac{(n+d)/2}{n}=\frac{n+d}{2n}$$

$g=2$：$126/210=0.6$；$g=4$：$0.7$；$g=10$：只有一条 path，$1.0$。只要 $d>0$，这个比例就大于 $\tfrac12$。所以 BC 学到的 policy 的 mode 总是朝向 goal，取 argmax 执行就直奔目标，哪怕 data 全是 random walk 走出来的。直接从这个 policy 里 sample 则会复现“恰好在第 10 步到达 $g$”的那种 random path，一定到得了，但不走捷径。

Lecture 3 说 goal-conditioned BC 的 distribution shift 出现在两个地方，slide 把第二个留作问题。第一个和普通 BC 一样，在 state 上。第二个在 goal 上：test 时要求的 goal 未必是 data 里常见的终点。上面的 random walk 走 10 步，终点满足 $|g|\ge8$ 的 trajectory 只占 $22/1024=2.1\%$，$g=10$ 只占 $1/1024$。离出发点越远的 goal，data 越少，policy 越不可靠。

::fig[cs285-relabel] 左：终点 $g=2$ 的 path 在第一步的分叉。右：10 步 random walk 的终点，也就是 relabel 之后 data 里各个 goal 的比例。

标题为“Going beyond just imitation?”的那页 slide 给出的办法是把这个过程反复做：从 random policy 开始，用当前的 goal-conditioned policy 去追 random 选的 goal，把实际到达的地方 relabel 成 goal 加进 data，再 train，然后重复。Policy 每一轮都比 random walk 走得更远，下一轮的 data 就覆盖更远的 goal。后面一页“Also related (for later…)”说同样的 relabeling 也用在 off-policy 的 value-based RL 里，要等讲完那一类 algorithm 才看得懂。Lecture 3 举的大规模例子是 GNM（Shah 等，2022）：一个 goal-conditioned 的 navigation policy，用多种 robot 的 data 一起 train。

:::edge 只用少量高质量 data 为什么也会失败
Lecture 3 的“pre-training and post-training data”一页：laundry folding 和 box building 各约 20 小时的 post-training data，strategy 一致、质量很高，单独拿来 train 却不行，robot 一出错就不知道怎么办；和约 10,000 小时 broad 但质量一般的 pre-training data 合起来才好用（slide 没有写是哪个 robot 或哪篇论文）。这正是 compounding error 的情形：质量高的 data 恰恰很少包含“犯错之后怎么回来”的 state。“Some common tricks”一页列的另一条是故意在 data 里加入犯错和纠正：错误本身有害，但纠正带来的好处往往比错误的害处大。
:::

:::back
MSE 的 minimizer 是 conditional mean、diffusion policy、一步 flow matching 等于 MSE，见 [RB4301 的 gen 站](../courses/RB4301.html#gen)；BC 的 $T^2$ bound 和 DAgger 见 [RB4301 的 bc 站](../courses/RB4301.html#bc)。
:::

:::from
分站顺序、“fit expert 失败的两个原因”、autoregressive discretization 和“why does this work?”的问题、“noise 必须被用上”、goal-conditioned BC 的 pipeline 和 data scale 的数字，来自 [Spring 2026 Lecture 3](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-3.pdf)；BC 是 maximum likelihood 来自 [Lecture 2](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-2.pdf)。两讲只读到文字和 slide 标题（slide 没有编号，文中用标题指认），flow matching 的几页（“Flow matching & diffusion”“Flow matching overview”“Flow matching policy training implementation”）只有标题、插图出处和“target velocity”这样的标注，loss 与 Euler 公式取自 [HW1 handout](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw1.pdf)。Slide 问的“distribution shift 的第二个地方”slide 自己没有给答案，这里的答案（goal）是自己写的。两个 mode 的例子、$v^*$ 的 closed form、看不到 $\tau$ 时的 $\bar v$ 和两张数表、random walk 的 relabeling 计算都是为这一页推导并用 `python3 -I` 实际算的（seed 0）。
:::

## [basics] RL 的骨架：Markov chain、objective 与 algorithm 的构成

:::skip
快速路线里可以略读：[CS4246 的 mdp 站](../courses/CS4246.html#mdp)已经讲过 MDP、value function 和 Bellman equation。这一站讲 Lecture 4 另外强调的四件事：policy 加 MDP 就是一个 Markov chain，所以 objective 可以用 linear algebra 操作；reward 不连续时它的 expectation 照样光滑；$Q$ 和 $V$ 怎样直接拿来改进 policy；各类 algorithm 在同一个循环里把力气花在哪一步。能用 transition matrix 算出 state marginal 和 stationary distribution，能说出 $\mathbb E[r]$ 为什么对 $\theta$ 可导，能说出四类 algorithm 在 sample efficiency 和 stability 上各差在哪，就可以去第 3 站。
:::

### Policy 加上 MDP 就是一个 Markov chain

Lecture 4 从最简单的 dynamical system 讲起。Markov chain 只有 state，没有 action：$\mathcal M=\{\mathcal S,\mathcal T\}$，$\mathcal T_{ij}=p(s_{t+1}=i\mid s_t=j)$。把 $t$ 时刻的 state distribution 写成 vector $\mu_t$，第 $i$ 个分量是 $p(s_t=i)$，往前走一步就是一次 matrix-vector 乘法：

$$\mu_{t+1}=\mathcal T\mu_t$$

Slide 上那句 “This bit of linear algebra will be important later!” 指的就是它。MDP 多了 action 和 reward，$\mathcal M=\{\mathcal S,\mathcal A,\mathcal T,r\}$，transition 变成 $p(s_{t+1}\mid s_t,a_t)$。Policy $\pi(a\mid s)$ 一旦固定，action 的 distribution 由 state 决定，(state, action) 这一对又构成一个 Markov chain：

$$p\big((s_{t+1},a_{t+1})\mid(s_t,a_t)\big)=p(s_{t+1}\mid s_t,a_t)\,\pi(a_{t+1}\mid s_{t+1})$$

把它算出来。一辆车在 road 上（state R），每步 reward $+1$；掉进 ditch（state O），每步 reward $-1$。在 R 有两个 action：steady 留在 R，swerve 掉进 O。在 O 只能往回爬，每步以 probability $0.5$ 回到 R。Policy 以 probability $\theta$ 选 swerve。只看 state，transition matrix 的第 $j$ 列是“从 state $j$ 出发”：

$$\mathcal T(\theta)=\begin{pmatrix}1-\theta&0.5\\ \theta&0.5\end{pmatrix}$$

取 $\theta=0.2$，从 R 出发，$\mu_1=(1,0)^\top$：

$$\mu_2=\begin{pmatrix}0.8&0.5\\0.2&0.5\end{pmatrix}\begin{pmatrix}1\\0\end{pmatrix}=\begin{pmatrix}0.8\\0.2\end{pmatrix},\qquad\mu_3=\begin{pmatrix}0.8\times0.8+0.5\times0.2\\0.2\times0.8+0.5\times0.2\end{pmatrix}=\begin{pmatrix}0.74\\0.26\end{pmatrix}$$

再往后 $\mu_t(R)$ 是 $0.722$、$0.7166$、$0.715$，停在 $0.7143$。

State-action 的 chain 有三个元素：(R, steady)、(R, swerve)、O（O 只有一个 action）。按上式，(R, steady) 之后一定回到 R，再以 $0.8$、$0.2$ 选两个 action；(R, swerve) 之后一定到 O；O 之后以 $0.5$ 回到 R（再分成 $0.5\times0.8=0.4$ 和 $0.5\times0.2=0.1$），以 $0.5$ 留在 O。以“从哪个元素出发”为行：

$$P^\pi=\begin{pmatrix}0.8&0.2&0\\0&0&1\\0.4&0.1&0.5\end{pmatrix}$$

每一行加起来是 1。[第 14 站](#theory)会拿这个 matrix 做 policy evaluation。

::fig[cs285-roadA] 动图，一步一步把 $\mu_t$ 乘上 $\mathcal T$。左边是这个 MDP，箭头上是 $\theta=0.2$ 时的 transition probability；右边两根柱子是 $\mu_t$，虚线是 stationary distribution $(0.714,\ 0.286)$。第 2 步离虚线 $0.086$，第 3 步 $0.026$，每步缩成 0.3 倍。

### Stationary distribution：infinite horizon 的 objective

RL 的 objective 是 trajectory distribution 下 total reward 的 expectation：

$$\theta^*=\arg\max_\theta\ \mathbb E_{\tau\sim p_\theta(\tau)}\Big[\sum_tr(s_t,a_t)\Big],\qquad p_\theta(\tau)=p(s_1)\prod_t\pi_\theta(a_t\mid s_t)\,p(s_{t+1}\mid s_t,a_t)$$

Horizon $T$ 有限时，sum 和 expectation 可以交换，只需要每个时刻的 state-action marginal：

$$\sum_{t=1}^T\mathbb E_{(s_t,a_t)\sim p_\theta(s_t,a_t)}\big[r(s_t,a_t)\big]$$

例子里 $r$ 只依赖 state，$\mathbb E[r(s_t)]=\mu_t(R)-\mu_t(O)$。$T=10$ 时把 $t=1$ 到 $10$ 的这个量加起来：$1+0.6+0.48+0.444+\cdots=5.102$。

$T\to\infty$ 时 sum 发散，Lecture 4 改看平均 $\frac1T\sum_t\mathbb E[r]$。Marginal 会不会停下来？如果 $\mu_t$ converge 到某个 $\mu$，那么 $\mu=\mathcal T\mu$，即 slide 上的 “stationary = the same before and after transition”。所以 $\mu$ 是 $\mathcal T$ 的 eigenvalue 为 1 的 eigenvector。例子里解 $(\mathcal T-I)\mu=0$：第一行是 $-\theta\mu_R+0.5\mu_O=0$，加上 $\mu_R+\mu_O=1$，

$$\mu_R=\frac{0.5}{0.5+\theta},\qquad\mu_O=\frac{\theta}{0.5+\theta}$$

$\theta=0.2$ 时是 $(0.7143,\ 0.2857)$，正是上面 iterate 停下的地方。$2\times2$ 的 matrix 两个 eigenvalue 之和等于 trace，另一个 eigenvalue 是 $(1-\theta)+0.5-1=0.3$。把 $\mu_1$ 拆成 stationary 的部分加上这个 eigenvector 的部分，后者每步乘 0.3：

$$\mu_t(R)=\mu_R+(1-\mu_R)\,0.3^{\,t-1}$$

$t=2$：$0.7143+0.2857\times0.3=0.8$，和直接算的一致。

平均 reward 的极限只由 $\mu$ 决定：

$$\lim_{T\to\infty}\frac1T\sum_{t=1}^T\mathbb E[r(s_t)]=\mathbb E_{s\sim\mu}[r(s)]=\mu_R-\mu_O=\frac{0.5-\theta}{0.5+\theta}$$

$\theta=0.2$ 时是 0.4286。Slide 接着说 RL algorithm 通常不直接解 stationary distribution，但用 linear algebra 操作 objective 对从理论上理解 algorithm 很有用：[第 6 站](#trpo)的 state distribution bound、[第 14 站](#theory)的 $(I-\gamma P^\pi)^{-1}$、[第 16 站](#multitask)的 successor representation 都是这个视角。

### Reward 不光滑，expectation 光滑

Lecture 4 有一页 “Expectations and stochastic systems”，正文是 “In RL, we almost always care about expectations”，旁边只有 $+1$、$-1$ 两个标注（图没有读到，下面的读法按 road 和 ditch 这个例子自己写）。

一个 sample 的 reward 只能是 $+1$ 或 $-1$。固定 random seed，把 $\theta$ 调大一点点，这个 sample 要么不变，要么从 $+1$ 跳到 $-1$，它对 $\theta$ 没有 derivative。可它的 expectation $\frac{0.5-\theta}{0.5+\theta}$ 是光滑的：

$$\frac{d}{d\theta}\,\frac{0.5-\theta}{0.5+\theta}=\frac{-(0.5+\theta)-(0.5-\theta)}{(0.5+\theta)^2}=-\frac{1}{(0.5+\theta)^2}$$

$\theta=0.2$ 时是 $-2.04$。Policy（以及 dynamics）的 randomness 把一个离散的结果变成了 parameter 的光滑 function。[第 3 站](#pg)能对一个不可导的 reward 求 policy gradient，靠的就是这一点：求导的对象是 $\theta$ 控制的 probability，reward 只是被加权的数。

::fig[cs285-smooth] 横轴是 swerve 的 probability $\theta$。点是从 stationary distribution 抽出的单个 state 的 reward，只有 $+1$ 和 $-1$ 两层，随 $\theta$ 跳来跳去；曲线是它的 expectation $(0.5-\theta)/(0.5+\theta)$，在 $\theta=0.2$ 处的 slope 是 $-2.04$。

:::wrong Reward 只有 0/1 或 $\pm1$ 两种值，是不连续的 function，所以不能用 gradient 去 optimize
不连续的是单个 sample 的 reward 和 $\theta$ 的关系。被 optimize 的是 expectation，这个例子里它是 $\frac{0.5-\theta}{0.5+\theta}$，处处可导。[第 10 站](#llm)的 verifier reward 只有对错两种值，GRPO 照样能 train，靠的就是这件事。需要担心的是另一件事：expectation 可导不等于 gradient 好估。本页开头第三次训练里，8 个回答 reward 全是 0 的 prompt，估出来的 gradient 恰好是 0。
:::

### Q-function 与 value function：用它们改进 policy

Lecture 4 的 Part 4 问 “What if we knew this part?”。图没有读到，按标准讲法，“this part”是 objective 里对 $a_t$ 取 expectation 的那一项，也就是 Q-function：

$$Q^\pi(s_t,a_t)=\sum_{t'=t}^T\mathbb E_{\pi}\big[r(s_{t'},a_{t'})\mid s_t,a_t\big],\qquad V^\pi(s_t)=\mathbb E_{a_t\sim\pi(a_t\mid s_t)}\big[Q^\pi(s_t,a_t)\big]$$

Objective 就是 $\mathbb E_{s_1\sim p(s_1)}[V^\pi(s_1)]$。“Using Q-functions and value functions”这一页只读到了标题，下面两种用法按标准讲法写：

1. 知道 $Q^\pi$，令 $\pi'(a\mid s)=1$ 当且仅当 $a=\arg\max_aQ^\pi(s,a)$。$\pi'$ 至少和 $\pi$ 一样好（policy improvement，证明在 [CS4246 的 dp 站](../courses/CS4246.html#dp)）。这是[第 5 站](#q) value-based 方法的出发点。
2. 知道 $Q^\pi$ 和 $V^\pi$，$Q^\pi(s,a)>V^\pi(s)$ 说明 $a$ 比这个 state 下的平均水平好，就提高 $\pi(a\mid s)$。这是[第 3 站](#pg) policy gradient 和[第 4 站](#ac) actor-critic 的出发点，$Q-V$ 就是 advantage。

在例子上算一次。Infinite horizon 要加 discount 才有限，取 $\gamma=0.9$（discount 在 Lecture 6 引入），$V^\pi$ 满足两个 linear equation：

$$V(R)=1+0.9\big(0.8V(R)+0.2V(O)\big),\qquad V(O)=-1+0.9\big(0.5V(R)+0.5V(O)\big)$$

由第二式，$0.55V(O)=-1+0.45V(R)$。代入第一式 $0.28V(R)=1+0.18V(O)$：

$$0.28V(R)=1+\frac{0.18\,(-1+0.45V(R))}{0.55}=0.6727+0.1473\,V(R)\quad\Longrightarrow\quad V(R)=\frac{0.6727}{0.1327}=5.068$$

$V(O)=(-1+0.45\times5.068)/0.55=2.329$。于是

$$Q(R,\text{steady})=1+0.9\times5.068=5.562,\qquad Q(R,\text{swerve})=1+0.9\times2.329=3.096$$

Advantage 是 $+0.493$ 和 $-1.973$，按 policy 加权 $0.8\times0.493+0.2\times(-1.973)=0$，正好是“平均水平”的意思。第一种用法直接把 $\theta$ 设成 0，新 policy 的 $V(R)=1/(1-0.9)=10$，$V(O)=6.364$，两个 state 都变好了；第二种用法把 $\theta$ 往小推一步。

### 一个 RL algorithm 的三步

Lecture 4 Part 3 把所有 RL algorithm 画成同一个循环：

1. **Generate samples**：run the policy，收集 trajectory。
2. **Fit a model / estimate the return**：从 sample 里 fit 一个东西。
3. **Improve the policy**。

Slide 上两个例子。Policy gradient 的第 2 步只是把 reward 加起来 $R(\tau)=\sum_tr$，第 3 步是 $\theta\leftarrow\theta+\alpha\nabla_\theta J$。“RL by backprop”的第 2 步是 fit 一个 dynamics model $s_{t+1}\approx f_\phi(s_t,a_t)$，第 3 步是把 $r$ 经过 $f_\phi$ 和 $\pi_\theta$ 一路 backprop 回 $\theta$（[第 11 站](#mbrl)会说这条路的 Jacobian 连乘问题）。

哪一步贵？Slide 的回答：第 1 步在真实的 robot、car、power grid 上只能以 1 倍的真实时间跑（“until we invent time travel”），在快的 simulator 里可以到 10000 倍；第 2 步从“trivial, fast”（加起来）到“expensive”（fit 一个大 model）；第 3 步同样从一步 gradient 到一整套 optimization。

::fig[cs285-anatomy] Lecture 4 的循环。每一类 algorithm 在第 2 步 fit 不同的东西，第 3 步用不同的方式改进 policy。

四类 algorithm 的区别就落在第 2、3 步：

| 类型 | 第 2 步 fit 什么 | 第 3 步怎样改进 | 本页 |
|---|---|---|---|
| Policy gradient | 只把 reward 加起来 | 对 objective 直接求 gradient | [第 3 站](#pg)、[第 6 站](#trpo) |
| Value-based | optimal policy 的 $Q$ 或 $V$，没有显式的 policy | $\pi(s)=\arg\max_aQ(s,a)$ | [第 5 站](#q) |
| Actor-critic | 当前 policy 的 $Q$ 或 $V$ | 用它算 policy gradient | [第 4 站](#ac)、[第 5 站](#q) 的 SAC |
| Model-based | transition model $p(s_{t+1}\mid s_t,a_t)$ | 用它 planning、把 gradient backprop 进 policy，或用它帮 model-free 的方法学 value | [第 11 站](#mbrl) |

Model-based 的三种用法，slide 分别举了例子：只 plan、没有显式 policy（continuous space 里的 trajectory optimization，本质是 backprop 来 optimize action；discrete action 里的 Monte Carlo tree search）；把 gradient backprop 进 policy（slide 说要一些 trick 才能 work）；用 model 学 value function（dynamic programming，或者给 model-free learner 生成 simulated experience，即 Dyna 和 MBPO）。

### 为什么有这么多 algorithm：sample efficiency 与 stability

Lecture 4 Part 5 列出几种 tradeoff：sample efficiency、stability 与 ease of use，以及不同的假设（stochastic 还是 deterministic、continuous 还是 discrete、episodic 还是 infinite horizon），还有不同的问题里 policy 和 model 哪个更好表示。

**Sample efficiency** 是要多少 sample 才能得到好的 policy。Slide 说最重要的问题是 algorithm 是不是 off-policy：off-policy 能在不从当前 policy 生成新 sample 的情况下改进 policy；on-policy 只要 policy 变了一点，就必须重新 sample，所以第 3 步常常只能做一步 gradient。从省 sample 到费 sample 排列：off-policy Q-function learning、model-based deep RL、actor-critic style methods、on-policy policy gradient、evolutionary 或 gradient-free 的方法。

**Stability** 问的是：converge 吗？converge 到哪里？每次都 converge 吗？Supervised learning 几乎总是 gradient descent，RL 常常不是：

- Value function fitting 最多也只是 minimize fitting error（Bellman error），这不等于 expected reward；最坏情况下它什么也没 optimize。很多流行的 deep value fitting algorithm 在 nonlinear 的情况下没有 converge 的保证。[第 5 站](#q)的 residual gradient 例子说明了 Q-learning 为什么不是对任何 objective 的 gradient descent。
- Model-based RL 的 model minimize fitting error，这一步会 converge，但没有保证更好的 model 带来更好的 policy。
- Policy gradient 是唯一一类对真正的 objective 做 gradient ascent 的方法，代价是最费 sample。

:::edge Sample efficiency 低的 algorithm 为什么还有人用
Slide 的问题是 “why would we use a less efficient algorithm?”，答案是 wall clock time 和 sample efficiency 不是一回事。拿 slide 上的两个速度算：假设某个 on-policy 方法需要的 sample 是某个 off-policy 方法的 100 倍（这个倍数是为了算账假设的）。Off-policy 方法在真实 robot 上以 1 倍真实时间收集 $N$ 个 sample，用时 $N$；on-policy 方法在 10000 倍速的 simulator 里收集 $100N$ 个，用时 $100N/10000=N/100$。Sample 多花了 100 倍，时间反而少了 100 倍。这就是 locomotion 的 sim-to-real 普遍用 PPO 的原因之一，[第 17 站](#open)会回到“有 simulator 就能控制”这个视角。
:::

:::back
MDP、Bellman equation、policy improvement 在 [CS4246 的 mdp、dp 两站](../courses/CS4246.html#mdp)。
:::

:::from
Markov chain 与 MDP 的定义、“this bit of linear algebra will be important later”、state-action marginal 和 Markov chain 视角、stationary distribution（“the same before and after transition”）、“we almost always care about expectations”、三步循环与哪一步贵、四类 algorithm 与 model-based 的三种用法、sample efficiency 的排序和 “wall clock time is not the same as efficiency”、stability 的四条，来自 [Spring 2026 Lecture 4](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-4.pdf)，对照了 [Fall 2023 Lecture 4](https://rail.eecs.berkeley.edu/deeprlcourse-fa23/deeprlcourse-fa23/static/slides/lec-4.pdf)。两份都只读到文字，公式和图是图片：$\pm1$ 那一页只有两个标注，“Using Q-functions and value functions”只有标题，所以 road 与 ditch 的 MDP、它的 transition matrix、eigenvalue 0.3、光滑性的推导、两种用 $Q$ 的方法和数值、wall clock 的算账都是为这一页按自己的知识写并用 `python3 -I` 算的。
:::

## [pg] Policy gradient 的 variance：causality、baseline 与 discount

:::skip
快速路线必读，HW2 依赖它。Log-derivative trick、baseline 不改变 expectation、optimal baseline 已在 [CS4246 的 pg 站](../courses/CS4246.html#pg)推过，这里不再重复。能证明 causality、能说出 full-return estimator 的 variance 由哪几部分组成、能说出 HW2 的两种 discount 写法差在哪，就可以去第 4 站。
:::

### 一个可以算清楚的 variance

从 [CS4246](../courses/CS4246.html#pg) 的结论出发：

$$\nabla_\theta J=\mathbb E_{\tau\sim\pi_\theta}\Big[\Big(\sum_t\nabla_\theta\log\pi_\theta(a_t\mid s_t)\Big)\Big(\sum_tr_t\Big)\Big]$$

Lecture 5 用下棋说明它的毛病：赢了，开局运气好也被加分，好棋被后来的失误连累扣分，坏棋因为对手失误被加分。这些平均下来会抵消，但需要很多 sample。这叫 high variance。

把它变成一个能算清楚的例子。$T=10$ 步，每步选 $a_t\in\{0,1\}$，$\pi_\theta(a_t=1)=\sigma(\theta)$，$\theta=0$，所以 $p=0.5$。Reward 是 $r_t=a_t+\ell_t$，$\ell_t\sim\mathcal N(0,1)$ 是和 action 无关的 luck。$\nabla_\theta\log\pi_\theta(a)=a-p$，记作 $x_t\in\{\pm\tfrac12\}$。True gradient：$J=T\sigma(\theta)$，$\nabla J=Tp(1-p)=2.5$。

Full-return estimator $g=X\cdot R$，其中 $X=\sum_tx_t$，$L=\sum_t\ell_t$，$R=\sum_tr_t=Tp+X+L$。它的 second moment：

$$\mathbb E[g^2]=\mathbb E\big[X^2(Tp+X+L)^2\big]=(Tp)^2\,\mathbb E[X^2]+\mathbb E[X^4]+\mathbb E[X^2]\,\mathbb E[L^2]$$

含 $X$ 的奇数次方的 term 因为 $X$ 关于 0 symmetric 而消失，含 $L$ 一次方的 term 因为 $L$ 独立且 mean 为 0 而消失。代数：$\mathbb E[X^2]=T\cdot\tfrac14=2.5$，$\mathbb E[L^2]=10$，$\mathbb E[X^4]=T\,\mathbb E[x^4]+3T(T-1)\,(\mathbb E[x^2])^2=10\cdot\tfrac1{16}+270\cdot\tfrac1{16}=17.5$。

$$\mathbb E[g^2]=\underbrace{25\times2.5}_{62.5}+\underbrace{17.5}_{\text{其他 action 的 reward}}+\underbrace{2.5\times10}_{25,\ \text{luck}}=105,\qquad\mathrm{Var}(g)=105-2.5^2=98.75$$

Gradient 只有 2.5，一条 trajectory 的 standard deviation 却接近 10。三块的来源各不相同：62.5 来自 reward 的整体水平 $Tp=5$，所有 reward 都是正的，于是每个 action 都被加分，只是加得多少不同；25 来自和 action 无关的 luck；17.5 来自别的时刻的 action 带来的 reward。用 $M=200{,}000$ 条 trajectory（seed 0）模拟，variance 是 97.7，和 98.75 一致。

### Causality：后面的 action 不为前面的 reward 负责

时刻 $t$ 的 action 不可能影响 $t$ 之前的 reward。这句话在 estimator 里对应一个 expectation 为 0 的 term：对 $t'<t$，

$$\mathbb E\big[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\,r_{t'}\big]=\mathbb E\Big[r_{t'}\ \mathbb E\big[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\ \big|\ s_{0:t},a_{0:t-1}\big]\Big]=0$$

第一个等号：$r_{t'}$ 由 $a_t$ 之前的 history 决定，可以从内层 expectation 里提出来。第二个等号：内层是对 $a_t\sim\pi_\theta(\cdot\mid s_t)$ 求 expectation，

$$\sum_a\pi_\theta(a\mid s_t)\,\nabla_\theta\log\pi_\theta(a\mid s_t)=\sum_a\nabla_\theta\pi_\theta(a\mid s_t)=\nabla_\theta\sum_a\pi_\theta(a\mid s_t)=\nabla_\theta1=0$$

这些 term 不改变 expectation，只贡献 noise，删掉：

$$\nabla_\theta J\approx\frac1N\sum_i\sum_t\nabla_\theta\log\pi_\theta(a_t^i\mid s_t^i)\,\hat Q_t^i,\qquad\hat Q_t^i=\sum_{t'\ge t}r_{t'}^i$$

$\hat Q_t$ 叫 reward-to-go（HW2 的 Eq. 9）。例子里它删掉了 $t$ 之前的 luck 和 $t$ 之前其他 action 的 reward，模拟的 variance 从 97.7 降到 40.3。

再减去 baseline。这里用 $b_t=\mathbb E[\hat Q_t]=(T-t)p$，它依赖时刻 $t$ 但不依赖 $a_t$，按 [CS4246](../courses/CS4246.html#pg) 的论证不改变 expectation。它去掉的是 reward 的整体水平，variance 降到 16.5。

| Estimator | 一条 trajectory 的 variance（模拟） | $N=4$ 条时方向估反的 probability | $N=16$ | $N=64$ |
|---|---|---|---|---|
| Full return | 97.7（exact 98.75） | 33.1% | 15.2% | 1.8% |
| Reward-to-go | 40.3 | 20.9% | 5.3% | 0.07% |
| Reward-to-go 减 baseline | 16.5 | 8.6% | 0.4% | 0 |

::fig[cs285-pgvar] 每个 batch 用 $N$ 条 trajectory 估 gradient，估出的 gradient 与 true gradient 反号的 probability。三条 curve 都随 $N$ 下降，但要达到同样的可靠程度，full return 需要的 trajectory 数是另外两种的好几倍。

:::wrong Policy gradient 的 estimate 是 unbiased 的，所以每一步都在往好的方向走
Unbiased 说的是许多个 batch 平均起来方向对。单看一个 batch，上表 full return 用 4 条 trajectory 时，三步里就有一步在往坏的方向走。Lecture 5 的结论是 policy gradient 需要大得多的 batch，learning rate 难调；“曲线在抖、偶尔掉下去”在 RL 里不一定是 bug，batch 太小时正确的实现也是这样。
:::

### Discount 的两种写法

无穷长或很长的任务需要 discount。HW2 写了两种：

$$\text{(Eq. 10)}\quad\sum_t\nabla_\theta\log\pi_\theta(a_t\mid s_t)\sum_{t'=0}^{T-1}\gamma^{t'}r_{t'},\qquad\text{(Eq. 11)}\quad\sum_t\nabla_\theta\log\pi_\theta(a_t\mid s_t)\sum_{t'=t}^{T-1}\gamma^{t'-t}r_{t'}$$

Eq. 10 是 discounted objective $\mathbb E[\sum_t\gamma^tr_t]$ 的 gradient。对它同样用 causality，再把 $\gamma^{t'}=\gamma^t\gamma^{t'-t}$ 拆开：

$$\sum_t\nabla_\theta\log\pi_\theta(a_t\mid s_t)\sum_{t'\ge t}\gamma^{t'}r_{t'}=\sum_t\gamma^t\,\nabla_\theta\log\pi_\theta(a_t\mid s_t)\sum_{t'\ge t}\gamma^{t'-t}r_{t'}$$

和 Eq. 11 只差最前面的 $\gamma^t$。这个 factor 说：越晚的 decision 越不重要。$\gamma=0.99$ 时，$\gamma^{100}=0.37$，$\gamma^{500}=0.0066$，第 500 步的 decision 几乎得不到 training。如果 $\gamma$ 的含义是“每一步有 $1-\gamma$ 的 probability 结束”，这是对的；可实际使用时 $\gamma$ 多半只是为了让 return 有界、variance 小一点，我们希望 robot 在第 500 步和第 1 步一样会走路。HW2 问“we almost always use the second formulation, do you see why?”，原因就在这里：Eq. 11 把每个时刻都当作新的起点。

### 写成代码：weighted maximum likelihood

Lecture 5 的 implementation 部分把 policy gradient 和 supervised learning 并排写。Supervised 的 maximum likelihood 是对 $\log\pi_\theta(a_i\mid s_i)$ 求平均再求 gradient；policy gradient 只多一步，把每一项乘上 advantage：

$$\tilde L(\theta)=-\frac1{NT}\sum_{i,t}\log\pi_\theta(a_t^i\mid s_t^i)\,\hat A_t^i,\qquad\nabla_\theta\tilde L=-\hat g$$

$\hat A$ 在这里是 constant，不能对它求 gradient（代码里要 detach）。$\tilde L$ 本身的数值没有意义，它只是一个 gradient 恰好等于 $-\hat g$ 的 pseudo-loss，所以看到它上升或下降都说明不了 policy 在变好还是变坏。

Gaussian policy $\pi_\theta(a\mid s)=\mathcal N(\mu_\theta(s),\sigma^2)$，

$$\nabla_\mu\log\pi=\frac{a-\mu}{\sigma^2}$$

算一次。$\mu=0$，$\sigma=1$，四个 sample 的 action 是 $(0.5,\ -1.0,\ 1.5,\ 0.2)$，advantage 是 $(1,\ -1,\ 2,\ -0.5)$：

$$\hat g_\mu=\tfrac14\big(1\times0.5+(-1)\times(-1.0)+2\times1.5+(-0.5)\times0.2\big)=\tfrac14(0.5+1.0+3.0-0.1)=1.1$$

$\mu$ 往 1.5 和 0.5 这两个好 action 的方向挪，离开坏 action $-1.0$。Advantage 为负的 sample 是在“推开”，所以 $-1.0$ 那一项的贡献也是正的。这就是 slide 上“好的变得更可能、坏的变得更不可能”。

:::edge Partial observability 下推导照样成立
把 $s_t$ 换成 observation $o_t$，trajectory 的 probability 里 policy 的 factor 是 $\pi_\theta(a_t\mid o_t)$，dynamics 的 factor 和 $\theta$ 无关，求 $\nabla_\theta\log$ 时照样消失。整个推导从没用过 Markov property，所以 policy gradient 可以直接用在 observation 上（Lecture 5 的 partial observability 一页）。用到 value function 的方法就没这么幸运，第 4 站的 critic 需要 state 才有意义。
:::

:::back
Log-derivative trick 的推导、baseline 不改变 expectation 的证明、optimal baseline 的 formula 在 [CS4246 的 pg 站](../courses/CS4246.html#pg)。
:::

:::from
下棋的例子、“baseline 用平均 reward 不是最好但够用”、causality、用 autodiff 写 pseudo-loss 的两段伪代码、“batch 要大、learning rate 难调、Adam 还行”来自 [Spring 2026 Lecture 5](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-5.pdf)（只读到文字，公式没有读到）。Discount 的两种写法和那个问题来自 [HW2 handout](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw2.pdf)。10 步的例子、variance 的 exact 分解、200,000 条 trajectory 的模拟和方向估反的 probability（seed 0、1）、Gaussian 的数值例子都是为这一页算的；causality 的证明是标准写法，按自己的知识补全。
:::

## [ac] Actor-critic：critic、GAE 与 reparameterization

:::skip
快速路线必读：HW2 的 baseline 与 GAE、HW3 的 SAC 都从这里来。能证明 GAE 的 closed form，能说出 $\lambda$ 在 bias 和 variance 之间怎样取舍，能说出 off-policy actor-critic 的 naive 版本错在哪两处，就可以去第 5 站。
:::

### 用一个 function 代替一条 trajectory

上一站的 reward-to-go $\hat Q_t$ 是 $Q^\pi(s_t,a_t)=\mathbb E[\sum_{t'\ge t}r_{t'}\mid s_t,a_t]$ 的单个 sample。如果手里有 $Q^\pi$ 本身，就不必用一个 sample 去估它；再减去 $V^\pi(s_t)=\mathbb E_{a\sim\pi}[Q^\pi(s_t,a)]$，得到 advantage $A^\pi=Q^\pi-V^\pi$，它衡量 $a_t$ 比这个 state 下的平均水平好多少。Lecture 6 的说法是：value 估得越好，variance 越低。

$V^\pi$ 要从 data 里 fit，这个 network 叫 critic。Training target 有两种：

$$y_t^{\text{MC}}=\sum_{t'\ge t}\gamma^{t'-t}r_{t'},\qquad y_t^{\text{boot}}=r_t+\gamma\hat V(s_{t+1})$$

Monte Carlo target 是 $V^\pi(s_t)$ 的 unbiased sample，但吵；bootstrapped target 只含一步的 randomness，但 $\hat V(s_{t+1})$ 的 error 原样进入 target。Infinite horizon 的问题里 bootstrapping 必须有 $\gamma<1$，否则 $\hat V$ 可以无限增长。

### Critic 当 baseline 不引入 bias，当 target 就会

Lecture 6 留了一个练习：证明用 critic 当 baseline 仍然 unbiased。$\hat V(s_t)$ 不依赖 $a_t$，和上一站 causality 的证明一样：

$$\mathbb E\big[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\,\hat V(s_t)\big]=\mathbb E\Big[\hat V(s_t)\sum_a\nabla_\theta\pi_\theta(a\mid s_t)\Big]=\mathbb E\big[\hat V(s_t)\cdot0\big]=0$$

所以 $\hat Q_t-\hat V(s_t)$ 对任何 $\hat V$ 都 unbiased，$\hat V$ 再差也只影响 variance。

换成 TD error $\delta_t=r_t+\gamma\hat V(s_{t+1})-\hat V(s_t)$ 就不同了。设 $\hat V=V^\pi+e$，

$$\mathbb E[\delta_t\mid s_t,a_t]=A^\pi(s_t,a_t)+\gamma\,\mathbb E\big[e(s_{t+1})\mid s_t,a_t\big]-e(s_t)$$

$-e(s_t)$ 不依赖 $a_t$，无害。$e(s_{t+1})$ 却依赖 $a_t$：不同的 action 去不同的 next state，那里 critic 的 error 不同。这一项进入 policy gradient，就是 bias。

### n-step return 与 GAE

在两者之间取舍：先用 $n$ 步真实的 reward，再接 critic。HW2 的 Eq. 17：

$$\hat A_t^{(n)}=\sum_{l=0}^{n-1}\gamma^lr_{t+l}+\gamma^n\hat V(s_{t+n})-\hat V(s_t)$$

它可以写成 $n$ 个 TD error 之和。把 $\delta_{t+l}=r_{t+l}+\gamma\hat V(s_{t+l+1})-\hat V(s_{t+l})$ 乘上 $\gamma^l$ 相加，中间的 $\hat V$ 两两抵消：

$$\sum_{l=0}^{n-1}\gamma^l\delta_{t+l}=\sum_{l=0}^{n-1}\gamma^lr_{t+l}+\sum_{l=0}^{n-1}\big(\gamma^{l+1}\hat V(s_{t+l+1})-\gamma^l\hat V(s_{t+l})\big)=\sum_{l=0}^{n-1}\gamma^lr_{t+l}+\gamma^n\hat V(s_{t+n})-\hat V(s_t)$$

$n=1$ 是 $\delta_t$；$n$ 取到 episode 结束是 Monte Carlo 减 baseline。$n$ 越大，critic 的 error 被 $\gamma^n$ 压得越小，reward 的 noise 却加进来越多。

Generalized advantage estimation（GAE）不选某一个 $n$，而是对所有 $n$ 按 $\lambda^{n-1}$ 加权平均（weight 之和 $(1-\lambda)\sum_{n\ge1}\lambda^{n-1}=1$）：

$$\hat A_t^{\text{GAE}}=(1-\lambda)\sum_{n=1}^{\infty}\lambda^{n-1}\hat A_t^{(n)}$$

代入 $\hat A_t^{(n)}=\sum_{l<n}\gamma^l\delta_{t+l}$，交换求和次序：$\delta_{t+l}$ 出现在所有 $n>l$ 的 term 里，

$$\hat A_t^{\text{GAE}}=\sum_{l=0}^{\infty}\gamma^l\delta_{t+l}\,(1-\lambda)\sum_{n=l+1}^{\infty}\lambda^{n-1}=\sum_{l=0}^{\infty}\gamma^l\delta_{t+l}\,(1-\lambda)\frac{\lambda^l}{1-\lambda}=\sum_{l=0}^{\infty}(\gamma\lambda)^l\delta_{t+l}$$

::fig[cs285-gaesum] 交换求和次序：先按行（每个 $n$）加，等于先按列（每个 $\delta_{t+l}$）加。

最后的形式可以从后往前一步算出来，这就是 HW2 要实现的 recursion（Eq. 22）：

$$\hat A_t^{\text{GAE}}=\delta_t+\gamma\lambda\,\hat A_{t+1}^{\text{GAE}}$$

把右边的 $\hat A_{t+1}^{\text{GAE}}=\sum_l(\gamma\lambda)^l\delta_{t+1+l}$ 代进去，正好是 $\delta_t$ 加上后面每一项多乘一个 $\gamma\lambda$。Episode 的最后一步没有 next state，$\delta_{H-1}=r_{H-1}-\hat V(s_{H-1})$，recursion 从这里开始。有限长的 episode 里 weight 之和不到 1，HW2 的 Eq. 18 多除了一个 $1-\lambda^{H-t-1}$ 做 normalization。

两端：$\lambda=0$ 是 $\delta_t$，variance 最小，critic 不准时 biased；$\lambda=1$ 是 $\sum_l\gamma^lr_{t+l}-\hat V(s_t)$，按上一小节的证明对任何 $\hat V$ 都 unbiased（相对于 discounted 的 gradient），variance 最大。

### 在一个 random walk 上量 bias 和 variance

State $0,1,\dots,10$，从 5 出发，每步向右的 probability 是 $\sigma(\theta)$，$\theta=0$；到 10 得 reward 1 并结束，到 0 得 0 并结束；每步另有 std 0.3 的 reward noise；$\gamma=1$。True value $V^\pi(s)=s/10$。由 gambler's ruin 的 formula 对 $\theta$ 求 derivative，true gradient 是 1.25。Critic 是 $\hat V(s)=V^\pi(s)+e(s)$，$e(s)$ 取 std 0.15 的固定 error（seed 3，两个 terminal state 上为 0）。

::fig[cs285-walk] 这个 random walk。

$\lambda=0$ 的 bias 可以 exact 算出。上一小节说 bias 来自 $\mathbb E[x_t\,e(s_{t+1})]$：在 state $s$，$x_t=+\tfrac12$ 时去 $s+1$，$x_t=-\tfrac12$ 时去 $s-1$，各占一半，所以每访问一次 $s$ 贡献 $\tfrac14\big(e(s+1)-e(s-1)\big)$。Symmetric random walk 从 5 出发、到 0 或 10 停止，访问 $s$ 的 expected 次数是 $2\min(s,5)\,(10-\max(s,5))/10$，即 $1,2,3,4,5,4,3,2,1$。加权求和，bias 是 0.252。

模拟 250,000 个 episode（seed 3），每个 episode 算一次 $\sum_tx_t\hat A_t^{\text{GAE}}$：

| $\lambda$ | 0 | 0.5 | 0.8 | 0.9 | 0.95 | 0.98 | 1 |
|---|---|---|---|---|---|---|---|
| bias | 0.256 | 0.175 | 0.104 | 0.064 | 0.036 | 0.015 | 0（exact） |
| 一个 episode 的 variance | 2.62 | 2.23 | 2.33 | 2.56 | 2.81 | 3.06 | 3.35 |
| 一个 batch 100 个 episode 的 $\text{bias}^2+\text{var}/100$ | 0.092 | 0.053 | 0.034 | 0.030 | 0.029 | 0.031 | 0.034 |

$\lambda=0$ 的 bias 0.256 与 exact 的 0.252 相差 1.3 个 standard error。Bias 随 $\lambda$ 单调下降；variance 先降后升，$\lambda=0$ 并不是 variance 最小的，因为 critic 的 error 本身也给 $\delta$ 加了 noise。一个 batch 的 mean squared error 在 $\lambda=0.9$ 到 0.95 之间最小。

::fig[cs285-gae] Batch 为 100 个 episode 时 gradient estimate 的 error 拆成两部分：$\text{bias}^2$ 随 $\lambda$ 下降，$\text{variance}/100$ 在 $\lambda$ 接近 1 时上升，总和在 0.9 到 0.95 附近最低。

:::wrong $\lambda=1$ 没有 bias，所以总该用 $\lambda=1$
Batch 有限时要比的是 $\text{bias}^2+\text{variance}/N$。上表 $N=100$ 时 $\lambda=1$ 是 0.034，$\lambda=0.95$ 是 0.029：用一点 bias 换来的 variance 下降更划算。GAE 的论文也报告 best 的 $\lambda$ 明显低于 best 的 $\gamma$，作者的解释是 critic 还算准时，$\lambda$ 带来的 bias 远小于 $\gamma$ 带来的。论文的实验里，cart-pole 最好的是 $\lambda\in[0.92,0.99]$，3D biped 是 $\lambda\in[0.96,0.99]$（$\gamma\in[0.99,0.995]$），结论建议 $\lambda$ 取 $[0.9,0.99]$ 里的中间值，和上表的 0.9 到 0.95 对得上。HW2 的 LunarLander 实验扫 $\lambda\in\{0,0.95,0.98,0.99,1\}$，就是要你自己看到这个取舍。
:::

:::edge Episode 被时间截断不等于结束
$\delta_{H-1}=r_{H-1}-\hat V(s_{H-1})$ 假设 $s_{H-1}$ 之后再也没有 reward。如果 episode 是因为达到最大步数被截断的（InvertedPendulum 撑满 1000 步），之后本来还有 reward，把它当 terminal 会让 critic 学到“快到时限的 state 价值低”，而 state 里并没有时间，critic 无从区分。截断时正确的做法是仍用 $\gamma\hat V(s_H)$ bootstrap。

两份作业的 starter code 在这里做法不同。HW2 和 HW3 用的都是旧版的 `gym==0.25.2`，`env.step` 返回 `(next_ob, rew, done, info)` 四项，时限截断时 `done` 也是 True，只在 `info["TimeLimit.truncated"]` 里留了记号。HW2 的 `sample_trajectory` 在 `done` 或达到 `max_length` 时结束 rollout，记下的 `terminals[i]` 在 trajectory 的最后一步一律为 1，GAE 那段的 hint 也只说“用 terminals 处理边界”，所以照 starter code 写，截断会被当成结束，正是上面说的那种简化。HW3 的 `run_sac.py` 和 `run_dqn.py` 存进 replay buffer 的是 `done and not info.get("TimeLimit.truncated", False)`，截断的 transition 照样 bootstrap。HW2 里这个简化的影响有限：HW2 的 critic 用 Monte Carlo 的 reward-to-go 当 target，只有 GAE 的 recursion 在最后一步少接了一项 $\gamma\hat V(s_H)$。
:::

### Off-policy actor-critic：naive 的版本错在两处

On-policy actor-critic 每批 data 用完就扔。想用 replay buffer 里旧 policy 收集的 transition $(s,a,r,s')$，Lecture 6 先给出一个 naive 的版本并说它是坏的：用 $r+\gamma\hat V(s')$ fit $\hat V$，再用 $\nabla\log\pi_\theta(a\mid s)\,\hat A$ 更新 actor。两处错误：

1. **Critic。** Buffer 里的 $a$ 来自旧 policy，$r+\gamma\hat V(s')$ 估的是旧 policy 在 $s$ 的 value，不是当前 policy 的。改成学 $Q(s,a)$：它以 action 为 condition，buffer 里的 $a$ 是谁选的都无所谓。Target 里的 next action 要从当前 policy 现抽：$y=r+\gamma Q_\phi(s',a')$，$a'\sim\pi_\theta(\cdot\mid s')$。
2. **Actor。** $\nabla\log\pi_\theta(a\mid s)$ 要求 $a\sim\pi_\theta$，buffer 里的 $a$ 不是。改成对 buffer 里的每个 $s$ 现抽 $a^\pi\sim\pi_\theta(\cdot\mid s)$，用 $Q_\phi(s,a^\pi)$。

剩下的 state distribution 仍然是旧的。Slide 在这里只问“Is there any remaining problem?”（Spring 2026 和 Fall 2023 的文字都只有这一句，答案在图里，没有读到）。通常的做法是接受它：buffer 里的 state 比当前 policy 会去的更广，在更广的 state 上把 policy 训好不是坏事。这个理由是凭自己的知识写的。

Actor 的 gradient 有了 $Q_\phi$ 之后还可以换一种方式来求。把 sample 写成 $a=\mu_\theta(s)+\sigma_\theta(s)\varepsilon$，$\varepsilon\sim\mathcal N(0,I)$，randomness 全在 $\varepsilon$ 里，$\theta$ 只出现在一个可导的 function 里：

$$\nabla_\theta\,\mathbb E_{a\sim\pi_\theta}\big[Q(s,a)\big]=\mathbb E_\varepsilon\Big[\nabla_aQ(s,a)\big|_{a=\mu_\theta+\sigma_\theta\varepsilon}\ \nabla_\theta\big(\mu_\theta(s)+\sigma_\theta(s)\varepsilon\big)\Big]$$

这叫 reparameterization，它用上了 $Q$ 对 action 的 derivative，而 likelihood-ratio（score-function）的写法只用 $Q$ 的值。差多少？取 $Q(a)=-(a-2)^2$，$\pi=\mathcal N(\mu,1)$，$\mu=0$，对 $\mu$ 求 gradient。$\mathbb E[Q]=-\big((\mu-2)^2+1\big)$，true gradient 是 $-2(\mu-2)=4$。

- Reparameterized：$g=Q'(\mu+\varepsilon)=-2(\varepsilon-2)=4-2\varepsilon$，$\mathrm{Var}=4$。
- Score-function：$g=Q(a)\,(a-\mu)=-(\varepsilon-2)^2\varepsilon$。展开 $(\varepsilon-2)^4\varepsilon^2=\varepsilon^6-8\varepsilon^5+24\varepsilon^4-32\varepsilon^3+16\varepsilon^2$，用 $\mathbb E[\varepsilon^2]=1$、$\mathbb E[\varepsilon^4]=3$、$\mathbb E[\varepsilon^6]=15$，得 $\mathbb E[g^2]=15+72+16=103$，$\mathrm{Var}=103-16=87$。
- Score-function 减 baseline $b=\mathbb E[Q]=-5$：$g=(Q+5)\varepsilon=-\varepsilon^3+4\varepsilon^2+\varepsilon$，$g^2$ 的 expectation 是 $15+14\times3+1=58$，$\mathrm{Var}=42$。

同一个 gradient，variance 是 87、42、4（用 200 万个 sample 核对，seed 0）。这就是 SAC 用 reparameterization 的原因，HW3 要求用 `.rsample()` 而不是 `.sample()`，前者保留了 $a$ 对 $\theta$ 的 gradient 路径。

:::back
Actor-critic 用 TD error 当 weight、$\mathbb E[\delta_t]=A^\pi$ 在 [CS4246 的 pg 站](../courses/CS4246.html#pg)；用 critic 对 action 的 gradient train deterministic actor（DDPG）在 [RB4301 的 ac 站](../courses/RB4301.html#ac)，它是 reparameterization 在 $\sigma=0$ 时的特例。
:::

:::from
“value 越准 variance 越低”、MC 与 bootstrapped target、critic 当 baseline 的练习、n-step 与 GAE 的动机、naive off-policy actor-critic 及两处修正、reparameterization 引出 SAC 的顺序来自 [Spring 2026 Lecture 6](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-6.pdf)（只读到文字）。n-step advantage、GAE 的 normalization 和 recursion 的写法来自 [HW2 handout](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw2.pdf)。GAE 的 closed form、$\lambda=0,1$ 的性质、best $\lambda$ 低于 best $\gamma$ 以及实验里 $\lambda$ 的范围来自 [GAE 论文](https://arxiv.org/pdf/1506.02438v5)。截断的处理对照的是 [starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026) 里 HW2 的 `infrastructure/utils.py`、`agents/pg_agent.py` 和 HW3 的 `scripts/run_sac.py`、`scripts/run_dqn.py`。Random walk 的例子、$\lambda=0$ 的 exact bias、250,000 个 episode 的数表、三种 gradient estimator 的 variance 都是为这一页推导和实算的；off-policy 时 state distribution 那一句凭自己的知识写。
:::

## [q] Q-learning 的实际做法：target network、n-step 与 SAC

:::skip
快速路线必读，HW3 依赖它。Replay buffer、target network 治什么、deadly triad 在 [CS4246 的 fa 站](../courses/CS4246.html#fa)；overestimation 的数表、TD3、SAC 的 objective 在 [RB4301 的 ac 站](../courses/RB4301.html#ac)。能说出 residual gradient 为什么学错、off-policy n-step target converge 到哪里，能推出 tanh-squashed policy 的 log-probability 并解释 HW3 的 entropy sanity check，就可以去第 6 站。
:::

### 三个 process 以不同的速度跑

Lecture 7 从 actor-critic 去掉 actor 得到 fitted Q-iteration：(1) 收集 transition 放进 dataset；(2) 用 target parameter $\phi'$ 算 $y=r+\gamma\max_{a'}Q_{\phi'}(s',a')$；(3) 对 $Q_\phi(s,a)\approx y$ 做 regression。Lecture 8 把各种 Q-learning 都看成这三个 process，只是速度不同：

| Algorithm | (1) 收集 data | (2) 更新 target $\phi'$ | (3) regression |
|---|---|---|---|
| Online Q-learning | 每步一次 | 每步一次（$\phi'=\phi$） | 每步一次 |
| DQN | 每步一次 | 慢：经典 DQN 每 10,000 步一次（HW3 的 config 是 1000 或 2000） | 每步一次 |
| Fitted Q-iteration | 最外层 | 中间层 | 最内层，跑到 converge |

每收集一条 transition 做几次 gradient step，叫 update-to-data（UTD）ratio。Lecture 8 的说法是 UTD 高，学得快、算得多；过高会“overfitting”到 buffer 里那点 data，这和第 12 站 offline RL 的问题是同一个。

### Q-learning 不是 gradient descent

Q-learning 的 update 是 $\phi\leftarrow\phi-\alpha\,\nabla_\phi Q_\phi(s,a)\,\big(Q_\phi(s,a)-y\big)$，$y$ 里也有 $\phi$（或 $\phi'$），但不对它求 gradient。Lecture 8 写的是“Q-learning is not gradient descent!”，原因是“no gradient through target value”。那为什么不老老实实对 squared Bellman error 求完整的 gradient（这叫 residual gradient，slides 没有讲，下面是补充）？算一个例子。

$s_0$ 以各一半的 probability 转到 $s_1$ 或 $s_2$，reward 0；$s_1$ 结束时得 1，$s_2$ 结束时得 0；$\gamma=1$。True value：$V_1=1$，$V_2=0$，$V_0=0.5$。每个 episode 产生两条 transition，residual gradient 最小化的是 sampled transition 上的 squared error 的 expectation：

$$L=\tfrac12(V_0-V_1)^2+\tfrac12(V_0-V_2)^2+\tfrac12(V_1-1)^2+\tfrac12V_2^2$$

前两项来自 $s_0$（各一半），后两项来自 $s_1$、$s_2$（各在一半的 episode 里出现）。对三个 value 求 derivative 令其为 0：

$$\partial_{V_0}:\ 2V_0=V_1+V_2,\qquad\partial_{V_1}:\ 2V_1=V_0+1,\qquad\partial_{V_2}:\ 2V_2=V_0$$

后两式相加得 $2(V_1+V_2)=2V_0+1$，代入第一式得 $4V_0=2V_0+1$，所以 $V_0=0.5$，$V_1=0.75$，$V_2=0.25$。$V_1$、$V_2$ 都被拉向了中间。原因在 $s_0$ 那两项：记 $m=\tfrac12(V_1+V_2)$，$d=\tfrac12(V_1-V_2)$，则 $V_0-V_1=(V_0-m)-d$，$V_0-V_2=(V_0-m)+d$，

$$\tfrac12(V_0-V_1)^2+\tfrac12(V_0-V_2)^2=(V_0-m)^2+d^2$$

第一项是想要的 Bellman error；第二项是 next state value 的 variance，它惩罚 $V_1$ 和 $V_2$ 不相等。Transition 有 randomness 时，sampled 的 squared Bellman error 多了一个 variance term，要消掉它需要从同一个 $s$ 独立抽两次 $s'$，data 里没有这样的 sample。只更新 $Q(s,a)$、把 target 当 constant 的做法，在 table 上 converge 到 $V_1=1$、$V_2=0$。代价是它不再是任何 objective 的 gradient，function approximation 下没有 convergence 的保证（Lecture 8 的 theory 部分，例子见 [CS4246](../courses/CS4246.html#fa)）。

::fig[cs285-residual] 这个例子的结构和两种做法 converge 到的 value。

### Target network：hard update 与 Polyak

$y$ 随 $\phi$ 一起动，regression 的目标就一直在跑。Target network 把 $y$ 冻住一段时间，在这段时间里它是一个 well-defined 的 regression。两种做法，HW3 都要实现：hard update 每 $K$ 步令 $\phi'\leftarrow\phi$；Polyak（soft）update 每步令

$$\phi'\leftarrow\phi'+\tau(\phi-\phi')=(1-\tau)\phi'+\tau\phi$$

Hard update 的 lag 是锯齿形的，刚更新完为 0，更新前为 $K-1$，平均 $(K-1)/2$。Lecture 8 的 slide 说这“feels weirdly uneven”，问能不能“always have the same lag”，给出的答案就是 Polyak update。把 recursion 展开，$\phi'_t=\sum_{k\ge0}\tau(1-\tau)^k\phi_{t-k}$，$\phi'$ 是过去各个 $\phi$ 的 weighted average，weight 是 $k$ 步之前 $\tau(1-\tau)^k$。平均 lag 是

$$\sum_{k\ge0}k\,\tau(1-\tau)^k=\tau\cdot\frac{1-\tau}{\tau^2}=\frac{1-\tau}{\tau}$$

（用了 $\sum_kkx^k=x/(1-x)^2$。）HW3 所有 SAC config 里的 `soft_target_update_rate` 都是 $\tau=0.005$，对应平均 lag 199 步，和每 399 步 hard update 一次的平均 lag 相同。

### Double Q 与 n-step return

Max 把 critic 的 noise 变成系统性的 overestimation，数表在 [RB4301](../courses/RB4301.html#ac)。Double DQN 把“选 action”和“评估 action”分给两个 network，HW3 的写法是

$$a'=\arg\max_{a'}Q_\phi(s',a'),\qquad y=r+\gamma(1-d)\,Q_{\phi'}(s',a')$$

$Q_\phi$ 碰巧估高的那个 action 被选中，但它的 value 由 $Q_{\phi'}$ 给出，后者的 error 和这次挑选的相关性小得多。Lecture 8 的 tips 说 double Q 帮助很大，而且没有坏处。

N-step return 让 reward 每次 backup 往前传 $n$ 步：

$$y_t=\sum_{l=0}^{n-1}\gamma^lr_{t+l}+\gamma^n\max_aQ(s_{t+n},a)$$

Lecture 8 的文字只说它“also help a lot, but have some downsides”，downside 是什么在图里，没有读到，下面是自己的分析。Downside 在于 $r_{t+1},\dots,r_{t+n-1}$ 是 buffer 里那条 trajectory 上 behavior policy 的 action 拿到的，而 $Q^*$ 要求之后都按 optimal 行动。算一个例子：每个 state 都一样，optimal action 得 reward 1，另一个 action 得 0；behavior policy 以一半的 probability 选 optimal；$\gamma=0.9$。$Q^*(s,a^*)=1/(1-\gamma)=10$，behavior policy 自己的 $Q^\beta(s,a^*)=1+\gamma\cdot0.5/(1-\gamma)=5.5$。$n$-step target 的 expectation 是

$$\mathbb E[y]=1+0.5\sum_{l=1}^{n-1}\gamma^l+\gamma^nQ$$

Q-learning 反复做这个 backup，converge 到 $Q=\mathbb E[y]$ 的 fixed point：

$$Q_n=\frac{1+0.5\sum_{l=1}^{n-1}\gamma^l}{1-\gamma^n}$$

| $n$ | 1 | 2 | 3 | 5 | 10 |
|---|---|---|---|---|---|
| Fixed point $Q_n$ | 10.000 | 7.632 | 6.845 | 6.221 | 5.768 |

$n=1$ 是 $Q^*$；$n$ 越大越接近 $Q^\beta=5.5$。Buffer 里的 data 接近当前 greedy policy 时（buffer 新、$\varepsilon$ 小）这个 bias 小，所以 $n$ 取 3 到 5 在实践中常常有用。

:::wrong N-step return 只是在 bias 和 variance 之间折中，$n$ 取大一点只会让它更快地学到 $Q^*$
上表 $n=10$ 时 Q-learning converge 到 5.77，离 $Q^*=10$ 很远，而且再多的 data、再久的 training 都不会把它拉回来。这是 bias，不是 variance，它来自 target 里混进了 behavior policy 的 action，和 data 是 off-policy 这件事绑在一起。
:::

另外几条 tips（Lecture 8，slide 注明“partly borrowed from J. Schulman”）：Bellman error 的 gradient 可能很大，用 Huber loss（error 超过某个阈值后 loss 变成 linear，gradient 的大小被截在阈值上）或 gradient clipping，HW3 的 MsPacman config 就设了 `clip_grad_norm: 10.0`；exploration 和 learning rate 都从高往低 schedule，Adam 也有帮助；不同 seed 的结果差别很大，至少跑几个 seed 再下结论。

Continuous action 时 $\max_{a'}Q(s',a')$ 本身就求不出来。Lecture 8 给了两条路：一是对每个 $s'$ 做 stochastic optimization，最简单的是抽一批 action 取最好的，更准的是 CEM 或 CMA-ES，slide 说这类方法“works OK, for up to about 40 dimensions”；二是“learn an approximate maximizer”，再 train 一个 network $\mu(s)\approx\arg\max_aQ(s,a)$，这就是 DDPG，也是 SAC 的 actor 在做的事。CEM 在第 11 站还会出现，它的 dimension 上限在那里算给你看。

### HW3 里 SAC 的每一个部件

HW3 的 SAC 由四块拼成，variable 的名字照 handout：temperature 在 Section 3.3 记作 $\beta$（Section 3.5 改记作 $\alpha$，代码里是 `temperature` 和 `log_alpha`），$\mathcal H(\pi)=\mathbb E_{a\sim\pi}[-\log\pi(a\mid s)]$。

**Critic。** $y\leftarrow r_t+\gamma(1-d_t)\big[Q_{\phi'}(s_{t+1},a_{t+1})+\beta\,\mathcal H(\pi(\cdot\mid s_{t+1}))\big]$，$a_{t+1}\sim\pi(\cdot\mid s_{t+1})$。实现时 $\mathcal H$ 用一个 sample 估：$-\log\pi(a_{t+1}\mid s_{t+1})$。

**Actor。** Handout 写的是 $J_\pi=Q\big(s,\mu_\theta(s)+\sigma_\theta(s)\varepsilon\big)+\beta\,\mathcal H(\pi(a\mid s))$，loss 为 $-J_\pi$，用上一站的 reparameterization。所有 SAC config 都设了 `use_tanh: true`，实际送进 $Q$ 的 action 是 $\tanh(\mu_\theta+\sigma_\theta\varepsilon)$。

**Tanh。** Action 被限制在 $[-1,1]$，所以先抽 $u\sim\mathcal N(\mu,\sigma^2)$ 再令 $a=\tanh u$。$a$ 的 density 要做 change of variables：$a$ 落在 $[a,a+da]$ 等价于 $u$ 落在 $[u,u+du]$，$du=da/(1-\tanh^2u)$，所以

$$\log\pi(a\mid s)=\log\mathcal N(u;\mu,\sigma^2)-\log\big(1-\tanh^2u\big)$$

多维时对每一维减去这一项再相加。直接算 $\log(1-\tanh^2u)$ 在 $|u|$ 大时会得到 $\log0$，numerically stable 的写法是 $1-\tanh^2u=4/(e^u+e^{-u})^2$，取 log：

$$\log\big(1-\tanh^2u\big)=2\log2-2\log\big(e^u+e^{-u}\big)=2\big(\log2-u-\mathrm{softplus}(-2u)\big)$$

最后一步：$\log(e^u+e^{-u})=u+\log(1+e^{-2u})=u+\mathrm{softplus}(-2u)$。这一项不用自己写。HW3 starter code 的 `make_tanh_transformed` 用 PyTorch 的 `TransformedDistribution` 加 `TanhTransform`，它的 `log_prob` 已经减去了这一项，PyTorch 源码里 `TanhTransform.log_abs_det_jacobian` 正是 `2.0 * (math.log(2.0) - x - softplus(-2.0 * x))`。推一遍是为了知道 `log_prob` 里有什么，以及下面那个 sanity check 的数从哪来。

**Entropy 的上界。** HW3 Section 3.3 的 sanity check：跑 `sanity_invertedpendulum.yaml`，entropy 应该一直上升，接近 action space 能达到的最大 entropy，对 1 维 tanh-squashed 的 action 约为 $\log2\approx0.69$；handout 说明显高于或低于它就多半有 bug。为什么是 $\log2$？$[-1,1]$ 上的 uniform density 是 $\tfrac12$，任何 density $p$ 与它的 KL divergence 非负：

$$0\le\int p\log\frac{p}{1/2}=-\mathcal H(p)+\log2\qquad\Longrightarrow\qquad\mathcal H(p)\le\log2$$

等号只在 $p$ 是 uniform 时成立。Tanh-squashed Gaussian 不可能恰好是 uniform，它能达到多少？由上面的 change of variables，$\mathcal H(a)=\mathcal H(u)+\mathbb E[\log(1-\tanh^2u)]$，$\mu=0$ 时对 $\sigma$ 做 numerical integration：

| $\sigma$ | 0.3 | 0.5 | 0.87 | 1.5 | 3 |
|---|---|---|---|---|---|
| $\mathcal H(\tanh u)$ | 0.129 | 0.500 | 0.684（最大） | 0.423 | $-1.096$ |
| 不做 tanh 修正时算出的“entropy” $\tfrac12\log(2\pi e\sigma^2)$ | 0.215 | 0.726 | 1.28 | 1.83 | 2.52 |

::fig[cs285-tanh] 左：$\sigma$ 不同时 $a=\tanh u$ 的 density。$\sigma$ 太大，mass 被推到 $\pm1$ 两端，entropy 反而下降。右：entropy 随 $\sigma$ 的变化，最大值 0.684 略低于 uniform 的 $\log2$。

所以 sanity check 的读法是这样的。升到 0.68 左右停住，正确。一路涨过 1、2 还在涨，说明你算的不是 $a=\tanh u$ 的 entropy，而是 $u$ 的：比如对 Gaussian 用了 closed-form 的 $\tfrac12\log(2\pi e\sigma^2)$，或者 `log_prob` 是在 tanh 之前的 $u$ 上算的，表的第二行就是这时看到的数，$\sigma$ 越大越“好”。不涨，停在初始值附近，先看 `entropy()` 里抽 sample 用的是不是 `.sample()`：$\hat{\mathcal H}=-\log\pi_\theta(a)$ 里 $a$ 被当成常数时，$\nabla_\theta\hat{\mathcal H}=-\nabla_\theta\log\pi_\theta(a)$，按[第 3 站](#pg)的 $\mathbb E_{a\sim\pi_\theta}[\nabla_\theta\log\pi_\theta(a)]=0$，entropy bonus 给 actor 的 gradient 在 expectation 上恰好是 0，只剩 noise。Starter code 在 `entropy()` 里留的提示就是“Think about whether to use .rsample() or .sample() here”。再往下查 entropy 的 sign，和 `update()` 里有没有真的调用 actor 的 update。

**Temperature 自动调节。** HW3 把问题写成 constraint：最大化 return，同时要求 $\mathbb E[\mathcal H(\pi)]\ge\bar{\mathcal H}$，$\bar{\mathcal H}=-\dim(\mathcal A)$。$\beta$ 是这个 constraint 的 Lagrange multiplier，对它做 gradient descent 的 loss 是

$$J(\beta)=\mathbb E_{a\sim\pi}\big[-\beta\big(\log\pi(a\mid s)+\bar{\mathcal H}\big)\big],\qquad\frac{dJ}{d\beta}=\mathbb E[-\log\pi]-\bar{\mathcal H}=\mathcal H(\pi)-\bar{\mathcal H}$$

Entropy 高于目标时 derivative 为正，gradient descent 让 $\beta$ 变小，entropy 的 bonus 减弱；低于目标时 $\beta$ 变大。用 $\beta=\exp(\log\beta)$ 做 parameterization，保证它为正，对 $\log\beta$ 的 derivative 是 $\beta(\mathcal H-\bar{\mathcal H})$，同号。Fixed point 处 entropy 等于目标值。

:::wrong 用 `.sample()` 抽 action 也行，反正 critic 会告诉 actor 哪里好
`.sample()` 返回的 tensor 和 $\theta$ 之间没有 gradient 路径，actor loss 里的 $Q(s,a)$ 对 $\theta$ 的 gradient 是 0。$\log\pi_\theta(a\mid s)$ 那一项仍然有 gradient（$a$ 固定时 density 仍依赖 $\theta$），所以 loss 在变、training 在跑，不报错。可是上面刚算过，对同一个被当成常数的 $a$，这一项的 gradient 在 expectation 上是 0。Actor 完全不看 $Q$；如果 entropy 也是在这个 $a$ 上估的，它连 entropy 都不在提高，每一步只收到 zero-mean 的 noise。上一站的 variance 比较说明了为什么要走 reparameterization 这条路；HW3 Section 3.4 写的是“Be careful to use the reparametrization trick for sampling!”，并提示用 `.rsample()`。
:::

:::back
上一站的 reparameterization 和 off-policy actor-critic 的两处修正；clipped double-Q 和 entropy objective 的 optimal policy 见 [RB4301 的 ac 站](../courses/RB4301.html#ac)。Entropy 这一项从哪里来、为什么 critic 的 target 里也要加它，见[第 8 站](#cai)的 control as inference。
:::

:::from
Fitted Q-iteration 的引出、三个 process 的视角和 UTD、“Q-learning is not gradient descent”、DQN 每 10,000 步更新 target、hard update “weirdly uneven”的 lag 和 Polyak 的引出、double Q 的推广、两组 practical tips（Huber、clipping、schedule、多个 seed）、continuous action 的两种办法和“up to about 40 dimensions”、fitted value iteration 不 converge 的结论，来自 [Spring 2026 Lecture 7](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-7.pdf) 和 [Lecture 8](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-8.pdf)（只读到文字，overestimation 和 n-step 的 downside 两处只有标题和一句话）。DQN、Double DQN、SAC 四个部件的写法、两个 sanity check 和 `.rsample()` 的提示来自 [HW3 handout](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw3.pdf)；target update 的周期、$\tau=0.005$、`TanhTransform` 和 `entropy()` 的提示来自 [starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026) 的 HW3 config 和代码，`TanhTransform` 的 stable 写法核对的是 PyTorch 的 `torch/distributions/transforms.py`。Residual gradient 的例子、Polyak lag 的推导、n-step 的 downside 和 fixed point 表、tanh 的 change of variables、entropy 的 numerical integration、`.sample()` 时 gradient 为 0 的论证是按自己的知识写出并实际算的。
:::

## [trpo] Advanced policy gradient：performance difference、natural gradient 与 PPO

:::skip
不在快速路线里。做 HW4 之前读最后一小节“PPO 的两种写法”和 [RB4301](../courses/RB4301.html#ac) 里 clip 的四种情况即可。能证明 performance difference lemma、由 KL 推出 Fisher matrix 和 natural gradient，并说出 PPO 的 clip 是在 approximate 什么，就可以去第 7 站。
:::

### 每批 data 只能用一次

Lecture 9 说 policy gradient 的好处是稳：Monte Carlo 的 advantage 让 gradient unbiased，critic 再差也不会让它走歪，所以 sim-to-real 的 robotics 和 LLM training 都偏爱它。毛病是每走一步都要重新 sample：data 来自 $\pi_\theta$，走了一步之后就不是当前 policy 的 data 了。

想用旧 data 估新 policy $\pi_{\theta'}$ 的 return，importance sampling 是现成的工具：

$$J(\theta')=\mathbb E_{\tau\sim p_{\theta'}}[R(\tau)]=\mathbb E_{\tau\sim p_\theta}\Big[\frac{p_{\theta'}(\tau)}{p_\theta(\tau)}R(\tau)\Big],\qquad\frac{p_{\theta'}(\tau)}{p_\theta(\tau)}=\prod_t\frac{\pi_{\theta'}(a_t\mid s_t)}{\pi_\theta(a_t\mid s_t)}$$

Trajectory probability 里 initial state 和 dynamics 的 factor 两边相同，相除时消掉，只剩每一步的 action ratio。问题在连乘。设每步 action 是 binary，$\pi_\theta(1)=0.5$，$\pi_{\theta'}(1)=0.6$，ratio $w$ 以各一半的 probability 取 1.2 或 0.8。$\mathbb E[w]=1$，$\mathbb E[w^2]=\tfrac12(1.44+0.64)=1.04$。$T$ 步独立相乘，$W=\prod w_t$ 的 $\mathbb E[W]=1$，$\mathbb E[W^2]=1.04^T$：

| $T$ | 10 | 100 | 1000 |
|---|---|---|---|
| $\mathrm{Var}(W)=1.04^T-1$ | 0.48 | 49.5 | $1.1\times10^{17}$ |

每一步 policy 只变了 0.1，1000 步的 weight 就已经没法用了。Lecture 9 的说法是 weight 一离开 1，variance 就大到 estimator 失去用处。

:::wrong Importance weight 的 expectation 是 1，所以 importance sampling 总可以放心用
Unbiased 不等于能用。上表 $T=100$ 时 weight 的 variance 是 49.5，要把 estimate 的 standard error 压到和不加 weight 时相当，需要约 50 倍的 sample；$T=1000$ 时需要 $10^{17}$ 倍。实际上绝大多数 trajectory 的 $W$ 接近 0，极少数巨大，sample mean 几乎总是偏小，偶尔爆炸。
:::

### Performance difference lemma

只对当前一步的 action 做 importance sampling、不管 state distribution 的变化，为什么基本可以？先证一个 identity：

$$J(\theta')-J(\theta)=\mathbb E_{\tau\sim p_{\theta'}}\Big[\sum_t\gamma^tA^{\pi_\theta}(s_t,a_t)\Big]$$

新 policy 的 return 比旧的多出的部分，等于新 policy 走出的 trajectory 上旧 policy 的 advantage 之和。证明：$J(\theta)=\mathbb E_{s_0}[V^{\pi_\theta}(s_0)]$，而 $s_0$ 的 distribution 和 policy 无关，所以可以写成新 policy 下的 expectation。把 $V(s_0)$ 写成 telescoping sum（$\gamma^tV\to0$）：

$$V^{\pi_\theta}(s_0)=\sum_{t\ge0}\big(\gamma^tV^{\pi_\theta}(s_t)-\gamma^{t+1}V^{\pi_\theta}(s_{t+1})\big)$$

于是

$$\begin{aligned}J(\theta')-J(\theta)&=\mathbb E_{\tau\sim p_{\theta'}}\Big[\sum_t\gamma^tr_t\Big]-\mathbb E_{\tau\sim p_{\theta'}}\Big[\sum_t\big(\gamma^tV^{\pi_\theta}(s_t)-\gamma^{t+1}V^{\pi_\theta}(s_{t+1})\big)\Big]\\&=\mathbb E_{\tau\sim p_{\theta'}}\Big[\sum_t\gamma^t\big(r_t+\gamma V^{\pi_\theta}(s_{t+1})-V^{\pi_\theta}(s_t)\big)\Big]\end{aligned}$$

括号里对 $s_{t+1}$ 取 expectation 就是 $Q^{\pi_\theta}(s_t,a_t)-V^{\pi_\theta}(s_t)=A^{\pi_\theta}(s_t,a_t)$。证毕。

右边的 expectation 是在新 policy 的 trajectory 上取的。拆成 state 和 action 两层，对 action 用 importance sampling：

$$J(\theta')-J(\theta)=\sum_t\mathbb E_{s_t\sim p_{\theta'}}\Big[\mathbb E_{a_t\sim\pi_\theta}\Big[\frac{\pi_{\theta'}(a_t\mid s_t)}{\pi_\theta(a_t\mid s_t)}\gamma^tA^{\pi_\theta}(s_t,a_t)\Big]\Big]$$

只剩 state distribution $p_{\theta'}(s_t)$ 是新 policy 的。把它换成旧的 $p_\theta(s_t)$，得到 surrogate $\bar A(\theta')$，它可以完全用旧 data 计算，而且在 $\theta'=\theta$ 处对 $\theta'$ 的 gradient 正是 policy gradient（ratio 的 gradient 是 $\nabla\log\pi$）。所以 policy gradient 就是在 optimize 这个 surrogate 的 linearization，Lecture 10 称之为“policy gradient as policy iteration”：用旧 policy 的 advantage 去改进 policy。

换 state distribution 引入多少 error？设每个 state 上新旧 policy 的 total variation 不超过 $\varepsilon$，[RB4301](../courses/RB4301.html#ac) 推过 $\sum_s|p_{\theta'}(s_t)-p_\theta(s_t)|\le2\varepsilon t$。$\gamma^tA$ 的绝对值不超过某个 $C$（$r_{\max}/(1-\gamma)$ 的量级），所以

$$J(\theta')-J(\theta)\ \ge\ \bar A(\theta')-\sum_t2\varepsilon t\,C$$

Lecture 10 的评语是“not a great bound, but a bound”：policy 每一步变得不多，最大化 surrogate 就保证 return 变好。Total variation 不好直接约束，用 Pinsker inequality 换成 KL：$\tfrac12\sum_a|\pi'(a\mid s)-\pi(a\mid s)|\le\sqrt{\tfrac12\mathrm{KL}(\pi'\|\pi)}$。于是问题变成

$$\max_{\theta'}\ \bar A(\theta')\qquad\text{subject to}\qquad\mathbb E_{s\sim p_\theta}\big[\mathrm{KL}\big(\pi_{\theta'}(\cdot\mid s)\,\|\,\pi_\theta(\cdot\mid s)\big)\big]\le\epsilon$$

### KL 的 second-order 展开就是 Fisher matrix

Constraint 里的 KL 在 $\theta'=\theta$ 附近长什么样？记 $\theta'=\theta+\Delta$，对固定的 $s$，

$$\mathrm{KL}(\pi_\theta\|\pi_{\theta+\Delta})=\mathbb E_{a\sim\pi_\theta}\big[\log\pi_\theta(a)-\log\pi_{\theta+\Delta}(a)\big]$$

（$\mathrm{KL}(\pi_\theta\|\pi_{\theta'})$ 和 $\mathrm{KL}(\pi_{\theta'}\|\pi_\theta)$ 到 second order 相同，这里用前者，expectation 在 $\pi_\theta$ 下。）把 $\log\pi_{\theta+\Delta}(a)$ 在 $\theta$ 处 Taylor expand：

$$\log\pi_{\theta+\Delta}(a)=\log\pi_\theta(a)+\Delta^\top\nabla\log\pi_\theta(a)+\tfrac12\Delta^\top\nabla^2\log\pi_\theta(a)\,\Delta+\cdots$$

代回去，zeroth-order 的 term 抵消；first-order 的 term 是 $-\Delta^\top\mathbb E[\nabla\log\pi_\theta]=0$（上一站证过）；剩下

$$\mathrm{KL}\approx-\tfrac12\Delta^\top\mathbb E\big[\nabla^2\log\pi_\theta(a)\big]\Delta$$

再用一个 identity：$\nabla^2\log\pi=\nabla\big(\nabla\pi/\pi\big)=\nabla^2\pi/\pi-\nabla\log\pi\,\nabla\log\pi^\top$，而 $\mathbb E_{\pi}[\nabla^2\pi/\pi]=\sum_a\nabla^2\pi(a)=\nabla^2\sum_a\pi(a)=0$。所以 $-\mathbb E[\nabla^2\log\pi]=\mathbb E[\nabla\log\pi\,\nabla\log\pi^\top]$，

$$\mathrm{KL}(\pi_\theta\|\pi_{\theta+\Delta})\approx\tfrac12\Delta^\top F\Delta,\qquad F=\mathbb E_{a\sim\pi_\theta}\big[\nabla_\theta\log\pi_\theta(a)\,\nabla_\theta\log\pi_\theta(a)^\top\big]$$

$F$ 叫 Fisher information matrix，它只用 sample 和 $\nabla\log\pi$ 就能估。

用一次。Gaussian policy $a\sim\mathcal N(ks,\sigma^2)$，parameter 是 $(k,\sigma)$。记 $\xi=(a-ks)/\sigma\sim\mathcal N(0,1)$：

$$\partial_k\log\pi=\frac{(a-ks)s}{\sigma^2}=\frac{\xi s}{\sigma},\qquad\partial_\sigma\log\pi=-\frac1\sigma+\frac{(a-ks)^2}{\sigma^3}=\frac{\xi^2-1}{\sigma}$$

$\mathbb E[\xi^2]=1$，$\mathbb E[(\xi^2-1)^2]=3-2+1=2$，$\mathbb E[\xi(\xi^2-1)]=0$，所以 $F=\mathrm{diag}\big(s^2/\sigma^2,\ 2/\sigma^2\big)$。两个 diagonal entry 都含 $1/\sigma^2$：$\sigma$ 越小，同样大小的 parameter 变化让 distribution 变得越多。

### Natural gradient

Lecture 10 说，对 surrogate 做 first-order expansion，得到的就是普通的 policy gradient $g$；但“在 parameter space 里走一小步”和“在 KL 意义下走一小步”不是一回事。把 constraint 换成上面的 second-order 形式：

$$\max_\Delta\ g^\top\Delta\qquad\text{subject to}\qquad\tfrac12\Delta^\top F\Delta\le\epsilon$$

Lagrangian 对 $\Delta$ 求 derivative：$g-\lambda F\Delta=0$，所以 $\Delta=\tfrac1\lambda F^{-1}g$。代入 constraint 取等号：$\tfrac1{2\lambda^2}g^\top F^{-1}g=\epsilon$，$\tfrac1\lambda=\sqrt{2\epsilon/(g^\top F^{-1}g)}$。

$$\Delta=\sqrt{\frac{2\epsilon}{g^\top F^{-1}g}}\;F^{-1}g$$

$F^{-1}g$ 叫 natural gradient。普通 gradient ascent 相当于把 $F$ 换成 identity matrix，也就是假设每个 parameter 对 distribution 的影响一样大。

Lecture 10 引用 Peters 与 Schaal（2008）的图说明这在实际中是个问题。用同样的设置把数算出来：1 维 linear system $s_{t+1}=s_t+a_t$，reward $-s_t^2-a_t^2$，$s_0\sim\mathcal N(0,1)$，$\gamma=0.9$，policy $a_t\sim\mathcal N(ks_t,\sigma^2)$。代入得 $s_{t+1}=(1+k)s_t+\sigma\xi_t$，记 $m_t=\mathbb E[s_t^2]$，$\rho=(1+k)^2$，则 $m_{t+1}=\rho m_t+\sigma^2$，$\mathbb E[a_t^2]=k^2m_t+\sigma^2$。令 $M=\sum_t\gamma^tm_t$，由 recursion 两边乘 $\gamma^{t+1}$ 求和得 $M-m_0=\gamma\rho M+\gamma\sigma^2/(1-\gamma)$，所以

$$M=\frac{m_0+\gamma\sigma^2/(1-\gamma)}{1-\gamma\rho},\qquad J(k,\sigma)=-\Big[(1+k^2)M+\frac{\sigma^2}{1-\gamma}\Big]$$

Numerically optimize 得 optimum 在 $k^*=-0.588$、$\sigma^*=0$。在 $(k,\sigma)=(-1,0.1)$ 处，$\rho=0$，$M=1+0.9\times0.01/0.1=1.09$，$\partial M/\partial k\propto(1+k)=0$：

$$\partial_kJ=-2kM=2.18,\qquad\partial_\sigma J=-\Big[(1+k^2)\frac{2\gamma\sigma}{1-\gamma}+\frac{2\sigma}{1-\gamma}\Big]=-(3.6+2)=-5.6$$

Vanilla gradient $(2.18,-5.6)$ 主要指向“把 $\sigma$ 减小”，可是 $\sigma$ 只剩 0.1，而 $k$ 还差 0.41。Fisher matrix 用 discounted state distribution 加权，$F_{kk}=M/\sigma^2=109$，$F_{\sigma\sigma}=2\sum_t\gamma^t/\sigma^2=2000$，natural gradient 是 $(2.18/109,\ -5.6/2000)=(0.020,\ -0.0028)$，几乎全在 $k$ 方向。

两个方向各走 Euclidean length 0.1 的一步，只看 $\sigma$ 变化带来的 KL（$\mathrm{KL}=\log(\sigma_2/\sigma_1)+\sigma_1^2/(2\sigma_2^2)-\tfrac12$）：vanilla 方向把 $\sigma$ 从 0.1 压到 0.0068，KL 是 104，$k$ 只挪了 0.036；natural 方向把 $\sigma$ 变到 0.086，KL 是 0.025，$k$ 挪了 0.099。

::fig[cs285-natgrad] 同一个 LQR 问题在 $(k,\sigma)$ 平面上的 gradient 方向（箭头都缩放成同样长）。左边 vanilla gradient 在大多数点上主要指向“$\sigma$ 变小”，先把 policy 变成 deterministic，再慢慢挪 $k$；右边 natural gradient 指向 optimum 所在的 $k^*=-0.588$。

$F$ 是 $n\times n$ 的，$n$ 是 network 的 parameter 数，存不下也求不了 inverse。TRPO 用 conjugate gradient 解 $Fx=g$：conjugate gradient 只需要能算 $Fv$，而 $Fv$ 等于 KL 的 Hessian 乘 $v$，可以对 $\nabla\mathrm{KL}^\top v$ 再求一次 gradient 得到，不必写出 $F$。每次 $Fv$ 的代价和一次 backward pass 相当。TRPO 论文的做法：conjugate gradient 迭代 10 次得到 $s\approx F^{-1}g$，$Fv$ 只用约 10% 的 data 估；step 长度取 $\sqrt{2\delta/(s^\top Fs)}$，正是上面的公式（$s^\top Fs=g^\top F^{-1}g$）；因为 quadratic 只是 approximation，再做 backtracking line search，把 step 指数缩小，直到 surrogate 确实变好、真实的 KL 也满足 constraint。所有实验都用 $\delta=0.01$。论文的 bound 用的是各个 state 上 KL 的最大值，系数 $2\epsilon\gamma/(1-\gamma)^2$ 大到按它走 step 会小得没法用，这是它改用 constraint、并把 max 换成平均 KL 的理由。

### PPO 的两种写法

TRPO 精确地解 constraint 问题，实现复杂。Lecture 10 讲了两条更简单的路。一是把 constraint 变成 penalty：

$$\max_{\theta'}\ \bar A(\theta')-\beta\,\mathbb E_s\big[\mathrm{KL}(\pi_{\theta'}\|\pi_\theta)\big]$$

对同一批 data 做几个 epoch 的 minibatch SGD。PPO 论文第 4 节的 $\beta$ 是 adaptive 的：每轮更新完算出新旧 policy 之间的平均 KL，记作 $d$，目标值记作 $d_{\text{targ}}$；$d<d_{\text{targ}}/1.5$ 就令 $\beta\leftarrow\beta/2$，$d>1.5\,d_{\text{targ}}$ 就令 $\beta\leftarrow2\beta$，新的 $\beta$ 用于下一轮。论文说 1.5 和 2 是 heuristic 选的，algorithm 对它们不敏感。

二是 clip：

$$L^{\text{CLIP}}(\theta)=\hat{\mathbb E}_t\Big[\min\big(r_t(\theta)\hat A_t,\ \mathrm{clip}(r_t(\theta),1-\epsilon,1+\epsilon)\hat A_t\big)\Big],\qquad r_t(\theta)=\frac{\pi_\theta(a_t\mid s_t)}{\pi_{\theta_{\text{old}}}(a_t\mid s_t)}$$

把 ratio 推出 $[1-\epsilon,1+\epsilon]$ 之外不再给奖励，取 min 让它成为 unclipped objective 的一个 pessimistic 的下界；论文建议 $\epsilon=0.2$，四种情况的逐一计算见 [RB4301](../courses/RB4301.html#ac)。Lecture 10 的总结是：clip 版本是 KL penalty 版本的一个 heuristic approximation，两者都在实现“policy 一次不要变太多”。PPO 论文的实验里 KL penalty 版本不如 clip，作者只把它当作 baseline 保留。

实际的 PPO 是第 4 站的 GAE 加上 clip，value function 与 policy 共用 network 时再加一项 value loss 和一项 entropy bonus：$L^{\text{CLIP}}-c_1L^{\text{VF}}+c_2S[\pi_\theta]$，Atari 实验用 $c_1=1$、$c_2=0.01$，同一批 data 做多个 epoch 的 minibatch 更新。第 10 站的 GRPO 就是把其中的 GAE 换成了 group baseline，并去掉了 value loss。

:::back
$2\varepsilon t$ 的 state distribution bound 和 PPO clip 的四种情况在 [RB4301 的 ac 站](../courses/RB4301.html#ac)；$\mathbb E[\nabla\log\pi]=0$ 在[第 3 站](#pg)。
:::

:::from
“为什么喜欢 policy gradient”、每一步都要新 sample 的问题、importance sampling、weight 离开 1 之后 variance 爆炸、clipped importance weight 和 KL penalty 的 PPO 来自 [Spring 2026 Lecture 9](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-9.pdf)；“policy gradient as policy iteration”、bounding the distribution change（引 TRPO 论文）、“not a great bound, but a bound”、first-order 与 second-order expansion、Peters 与 Schaal 的图、conjugate gradient 来自 [Lecture 10](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-10.pdf)。两讲都只读到文字，没有看到图；performance difference lemma 的 telescoping 证明、KL 的 quadratic approximation、conjugate gradient 与 step 长度、$\delta=0.01$ 和 bound 的系数对照的是 [TRPO 论文](https://arxiv.org/pdf/1502.05477v4)（Eq. 1 与 Appendix A、Theorem 1、Appendix C），Fisher matrix 等于 KL 的 Hessian 的那一行 identity 和 natural gradient 的 Lagrangian 是自己补的推导。Adaptive $\beta$ 的规则、$L^{\text{CLIP}}$、$\epsilon=0.2$、KL penalty 不如 clip、$c_1,c_2$ 来自 [PPO 论文](https://arxiv.org/pdf/1707.06347) 第 3–5 节。IS 的数表、LQR 的 closed form、gradient 场和两种 step 的 KL 都是为这一页算的。
:::

## [vi] Variational inference：latent variable model、ELBO 与 VAE

:::skip
不在快速路线里。它是[第 8 站](#cai)和[第 9 站](#irl)的数学工具，也是 HW1 的 flow policy、[RB4301 的 chunk 站](../courses/RB4301.html#chunk)里 ACT 用的 CVAE 背后的 framework。[CS3244 的 em 站](../courses/CS3244.html#em)已经用 Jensen's inequality 推过 ELBO 和 EM，第二小节可以对照着读。能写出 $\log p(x)=\mathcal L(q)+\mathrm{KL}\big(q\,\|\,p(z\mid x)\big)$ 并在一个 mixture 上验证，能说出 amortized VI 的 gradient 为什么要 reparameterize、什么时候不能，能说出 conditional VAE 为什么能表示两个 mode，就可以去第 8 站。
:::

### Latent variable model：sample 容易，likelihood 难算

Lecture 11 从 probabilistic model 讲起：要 model 的是 $p(x)$，或者 conditional 的 $p(y\mid x)$。Latent variable model 引入一个看不见的 $z$：

$$p(x)=\sum_zp(x\mid z)\,p(z)\qquad\text{或}\qquad p(x)=\int p(x\mid z)\,p(z)\,dz$$

最简单的是 mixture：$z$ 是“第几个 element”，每个 element 是一个 Gaussian。一般情况下 $p(z)$ 取 $\mathcal N(0,I)$，$p(x\mid z)=\mathcal N\big(\mu_{\text{nn}}(z),\sigma_{\text{nn}}(z)\big)$，两个都是 slide 说的 “easy” distribution，合起来的 $p(x)$ 却可以很复杂。Sample 很容易：先抽 $z$，再抽 $x$。在 RL 里它出现在两处：multimodal 的 policy（[第 1 站](#il)的两个 mode 的问题）和 model-based RL 的 latent state（[第 11 站](#mbrl)的 latent model）。

难的是 training。Maximum likelihood 要的是

$$\theta\leftarrow\arg\max_\theta\frac1N\sum_i\log p_\theta(x_i)=\arg\max_\theta\frac1N\sum_i\log\int p_\theta(x_i\mid z)\,p(z)\,dz$$

$z$ 是 continuous 的高维 vector 时，这个 integral 算不出来。Lecture 11 的想法是先“猜”每个 $x_i$ 对应的 $z$：如果知道 posterior $p(z\mid x_i)$，就可以改 maximize expected log-likelihood $\frac1N\sum_i\mathbb E_{z\sim p(z\mid x_i)}[\log p_\theta(x_i,z)]$，它的每一项都好算。求 posterior 就是 slide 说的 probabilistic inference。

把一个最小的例子算到底。$z\in\{1,2\}$，各占一半；$p(x\mid z=1)=\mathcal N(2,1)$，$p(x\mid z=2)=\mathcal N(-2,1)$；观测到 $x=1$。$\log\mathcal N(1;2,1)=-\tfrac12\log2\pi-\tfrac12=-1.419$，$\log\mathcal N(1;-2,1)=-0.919-4.5=-5.419$，所以

$$\log p(x,z{=}1)=\log0.5-1.419=-2.112,\qquad\log p(x,z{=}2)=-6.112$$

$$\log p(x)=\log\big(e^{-2.112}+e^{-6.112}\big)=-2.094,\qquad p(z{=}1\mid x)=\frac{1}{1+e^{-4}}=0.982$$

### ELBO：对任何 $q$ 都成立的 lower bound

Posterior 一般求不出来，换一个好处理的 $q(z)$ 去 approximate 它（slide：“incorrect but very convenient”）。对任何 $q$，用 Jensen's inequality（$\log$ 是 concave 的，log 的平均不超过平均的 log）：

$$\log p(x)=\log\sum_zp(x,z)=\log\mathbb E_{z\sim q}\Big[\frac{p(x,z)}{q(z)}\Big]\ \ge\ \mathbb E_{z\sim q}\big[\log p(x,z)-\log q(z)\big]$$

右边记作 $\mathcal L(q)$，叫 evidence lower bound（ELBO）。它是两项：

$$\mathcal L(q)=\mathbb E_{z\sim q}\big[\log p(x,z)\big]+\mathcal H(q),\qquad\mathcal H(q)=-\mathbb E_{z\sim q}[\log q(z)]$$

Slide 用两页讲这两个量。Entropy 衡量一个 distribution 有多 random，也就是它在自己的 sample 上 log-probability 的 expectation 的相反数。KL divergence $\mathrm{KL}(q\|p)=\mathbb E_q[\log q-\log p]=-\mathbb E_q[\log p]-\mathcal H(q)$ 衡量两个 distribution 有多不同。ELBO 的第一项要 $q$ 把 mass 放在 $p(x,z)$ 大的地方；第二项要 $q$ 尽量宽。只有第一项时，$q$ 会缩成 $p(x,z)$ 最大处的一个点。

Bound 差多少？把 $p(x,z)=p(z\mid x)\,p(x)$ 代进第一项：

$$\mathcal L(q)=\mathbb E_q\big[\log p(z\mid x)\big]+\log p(x)-\mathbb E_q[\log q(z)]=\log p(x)-\mathrm{KL}\big(q(z)\,\|\,p(z\mid x)\big)$$

$$\log p(x)=\mathcal L(q)+\mathrm{KL}\big(q(z)\,\|\,p(z\mid x)\big)$$

KL 非负，只在 $q$ 等于 posterior 时为 0。所以对 $q$ maximize ELBO，等价于让 $q$ 逼近 posterior，同时 bound 贴紧。

在例子上核对。$q(z{=}1)=0.5$：

$$\mathcal L=0.5\times(-2.112)+0.5\times(-6.112)+\log2=-4.112+0.693=-3.419$$

和 $\log p(x)=-2.094$ 差 $1.325$。直接算 $\mathrm{KL}(q\|p(z\mid x))=0.5\log\frac{0.5}{0.982}+0.5\log\frac{0.5}{0.018}=0.5\times(-0.675)+0.5\times3.325=1.325$，相等。$q(z{=}1)=0.9$ 时差 0.093，$q(z{=}1)=0.982$ 时差 0。

::fig[cs285-elbo] 左：两个 element 的 Gaussian 和观测 $x=1$，$x$ 几乎只可能来自右边那个。右：ELBO 随 $q(z{=}1)$ 的变化，最高点在 posterior 0.982，正好碰到 $\log p(x)$；任何一点到虚线的距离都等于 $\mathrm{KL}(q\|p(z\mid x))$。

怎样用它 train $\theta$？对每个 $x_i$ 有一个 $q_i$，$\mathcal L_i(p,q_i)=\mathbb E_{z\sim q_i}[\log p_\theta(x_i\mid z)+\log p(z)]+\mathcal H(q_i)$。Lecture 11 的循环：对每个 $x_i$，从 $q_i$ 抽 $z$ 估出 $\nabla_\theta\mathcal L_i\approx\nabla_\theta\log p_\theta(x_i\mid z)$，更新 $\theta$；再更新 $q_i$ 让 $\mathcal L_i$ 变大。Slide 最后问 “What's the problem?”：每个 data point 一个 $q_i=\mathcal N(\mu_i,\sigma_i)$，parameter 数是 $|\theta|+(|\mu_i|+|\sigma_i|)\times N$。一百万张图、$z$ 是 64 维，就多出 $2\times64\times10^6=1.28\times10^8$ 个 parameter，而且新来一张图要从头 optimize 它的 $q$。

### Amortized VI：一个 network 给所有 data point 出 $q$

Lecture 12 的办法是 amortize：用一个 network $q_\phi(z\mid x)=\mathcal N\big(\mu_\phi(x),\sigma_\phi(x)\big)$ 代替所有的 $q_i$。ELBO 变成

$$\mathcal L(p_\theta,q_\phi)=\mathbb E_{z\sim q_\phi(z\mid x_i)}\big[\log p_\theta(x_i\mid z)+\log p(z)\big]+\mathcal H\big(q_\phi(z\mid x_i)\big)$$

对 $\theta$ 求 gradient 和前面一样。对 $\phi$ 求 gradient，entropy 那项 slide 说“look up formula for entropy of a Gaussian”：每一维是 $\tfrac12\log(2\pi e\sigma^2)$，可以直接求导。第一项记作 $J(\phi)=\mathbb E_{z\sim q_\phi(z\mid x_i)}[r(x_i,z)]$，$r(x_i,z)=\log p_\theta(x_i\mid z)+\log p(z)$。它和 RL 的 objective 形状完全一样：$q_\phi$ 是 policy，$z$ 是 action，$r$ 是 reward。Slide 说 “can just use policy gradient!”：

$$\nabla_\phi J\approx\frac1M\sum_j\nabla_\phi\log q_\phi(z_j\mid x_i)\,r(x_i,z_j)$$

接着问 “What's wrong with this gradient?”：variance 大。[第 4 站](#ac)在 $Q(a)=-(a-2)^2$ 上算过同一件事，score-function 的 variance 是 87，reparameterization 是 4。Reparameterization 把 sample 写成 $z=\mu_\phi(x)+\sigma_\phi(x)\varepsilon$，$\varepsilon\sim\mathcal N(0,I)$：

$$\nabla_\phi J=\mathbb E_{\varepsilon\sim\mathcal N(0,I)}\Big[\nabla_\phi\,r\big(x_i,\mu_\phi(x_i)+\sigma_\phi(x_i)\varepsilon\big)\Big]$$

一个 sample 的 $\varepsilon$ 往往就够，slide 说 PyTorch 这类 autodiff 会替你算。

Slide 给的另一种看法是把 $\log p(z)$ 和 entropy 合并成一个 KL：

$$\mathcal L=\mathbb E_{z\sim q_\phi(z\mid x_i)}\big[\log p_\theta(x_i\mid z)\big]-\mathrm{KL}\big(q_\phi(z\mid x_i)\,\|\,p(z)\big)$$

两个 Gaussian 的 KL 有 closed form。一维时 $q=\mathcal N(\mu,\sigma^2)$、$p=\mathcal N(0,1)$：$\mathbb E_q[\log q]=-\tfrac12\log(2\pi\sigma^2)-\tfrac12$，$\mathbb E_q[\log p]=-\tfrac12\log2\pi-\tfrac12(\mu^2+\sigma^2)$，相减

$$\mathrm{KL}\big(\mathcal N(\mu,\sigma^2)\,\|\,\mathcal N(0,1)\big)=\tfrac12\big(\mu^2+\sigma^2-1-\log\sigma^2\big)$$

$\mu=1$、$\sigma=0.5$ 时是 $\tfrac12(1+0.25-1+1.386)=0.818$。多维 diagonal 的情况对每一维求和，这正是 VAE 论文 Appendix B 的式子，只有 reconstruction 那项需要 sample。

| | Policy gradient（score function） | Reparameterization |
|---|---|---|
| 能处理的 latent | discrete 和 continuous | 只有 continuous |
| Variance | 高，要多个 sample、小的 learning rate | 低 |
| 实现 | 需要 $\log q$ 的 gradient | 简单，autodiff 自动做 |

:::wrong 把 sample 写成 $\phi$ 的 function 再 backprop，任何 latent variable 都能这样做
上面 mixture 的例子里 $z$ 是 discrete 的。设 $q_\phi(z{=}1)=\phi$，抽 $u\sim U(0,1)$，$z=1$ 当且仅当 $u<\phi$。这确实是“$\phi$ 的 function”，可它是分段常数：$\phi$ 动一点，$z$ 不变，$\partial z/\partial\phi=0$ 几乎处处成立，backprop 得到的 gradient 永远是 0。真正的 derivative 是

$$\frac{d\mathcal L}{d\phi}=\log p(x,z{=}1)-\log p(x,z{=}2)-\log\phi+\log(1-\phi)$$

在 $\phi=0.5$ 处等于 $-2.112+6.112-0=4$。Score-function 的 estimator 照样 unbiased，能拿到这个 4；只有两个值时还可以直接把 sum 写出来。Slide 的对比表里 policy gradient 一栏“can handle both discrete and continuous latent variables”，说的就是这一点。
:::

### VAE 与 conditional VAE

Variational autoencoder（VAE）把上面的东西组装起来：encoder $q_\phi(z\mid x)$、decoder $p_\theta(x\mid z)$、prior $p(z)=\mathcal N(0,I)$，objective 是上式对所有 data point 求平均，reconstruction 用一个 reparameterized sample 估。用的时候只要 decoder：$z\sim p(z)$，$x\sim p_\theta(x\mid z)$。为什么这样抽出来的 $x$ 像 data？KL 那一项把每个 $q_\phi(z\mid x_i)$ 拉向 prior，prior 抽出的 $z$ 落在 encoder 见过的地方。Lecture 12 举的 representation learning 例子是 Higgins 等（2017）：在 state 上 train VAE，把 $z$ 当成 RL 的 state，slide 说它对 reuse prior data 有用。

Conditional VAE 对 $p(y\mid x)$ 做同样的事：encoder $q_\phi(z\mid x,y)$，decoder $p_\theta(y\mid x,z)$，prior $p(z)$（或 $p(z\mid x)$）。Multimodal imitation learning 里 $x$ 是 observation，$y$ 是 action。

回到[第 1 站](#il)的例子：同一个 observation 下 action 是 $+1$ 或 $-1$，各一半，MSE policy 输出 0。用一维的 $z$ 做 conditional VAE。Encoder 取 $q(z\mid a)=\mathcal N(c\,a,\ s^2)$，decoder 取 $p(a\mid z)=\mathcal N(f(z),\ 0.1^2)$。给定 encoder，decoder 的 mean 最好取 $f(z)=\mathbb E_q[a\mid z]$；$z$ 在 $a=\pm1$ 时分别服从 $\mathcal N(\pm c,s^2)$，和第 1 站推 $v^*$ 时是同一个计算：

$$\frac{p(z\mid a{=}{+}1)}{p(z\mid a{=}{-}1)}=\exp\Big(\frac{(z+c)^2-(z-c)^2}{2s^2}\Big)=\exp\Big(\frac{2cz}{s^2}\Big)\quad\Longrightarrow\quad f(z)=\tanh\Big(\frac{cz}{s^2}\Big)$$

只剩 $c$、$s$ 两个数，对 ELBO 做 grid search：$c=0.958$，$s=0.292$，KL 项是 1.234，reconstruction 的 squared error 平均 0.0016。Decoder 是 $\tanh(11.27z)$，在 $z=0$ 附近陡峭地从 $-1$ 翻到 $+1$。Test 时从 prior 抽 20 万个 $z\sim\mathcal N(0,1)$ 送进 decoder（seed 0）：89.6% 的 action 落在 $\pm1$ 的 0.1 以内，只有 3.9% 落在 $|a|<0.5$。

::fig[cs285-cvae] 一维 latent 的 conditional VAE。下面是 latent 空间：两个彩色 Gaussian 是 encoder 对 $a=+1$、$a=-1$ 给出的 $q(z\mid a)$，虚线是 prior $\mathcal N(0,1)$。上面是 decoder $f(z)=\tanh(11.27z)$：prior 抽出的 $z$ 绝大多数被送到 $\pm1$，只有落在 0 附近窄带里的才停在中间。

$z$ 在 training 时由 encoder 从 $a$ 算出来，所以它带着“这次是哪个 mode”的信息；decoder 学的是“给定 mode，action 是什么”。这和[第 1 站](#il)说的“noise 必须真的被用上”是同一个要求：只把 noise 当 input 去 fit action，$z$ 和 $a$ 独立，学出来的是 mean；CVAE 让 encoder 去挑 $z$，于是 $z$ 和 $a$ 绑在一起。剩下 10% 来自 prior 和 encoder 的 mixture $\tfrac12\mathcal N(\pm0.958,\ 0.292^2)$ 并不一致，prior 在 0 附近有 mass，那里 encoder 没给过 $z$。

:::edge Test 时只取 $z=0$
[RB4301 的 chunk 站](../courses/RB4301.html#chunk)讲的 ACT 在 test 时丢掉 encoder，取 prior 的 mean $z=0$，deterministic 地 decode。放到上面的一维例子里，$f(0)=\tanh(0)=0$，正好是两个 mode 的中间，和 MSE policy 一样。原因是这个例子完全对称，$z=0$ 恰好是两个 encoder Gaussian 的分界线。取 $z=0$ 能用，要求 decoder 在 $z=0$ 附近给出的是某一个 mode，而这件事 ELBO 本身不保证；要真正表示多个 mode，就得从 prior 里 sample $z$。
:::

Lecture 12 接着把 VAE 和第 1 站的 flow matching 放在一起：forward（noising）process 是固定的 encoder，reverse（denoising）process 是 decoder，slide 的说法是 “diffusion can be thought of as a hierarchical VAE”，一层层的 latent 就是不同 noise level 下的 sample。区别是 diffusion 和 flow 的 encoder 不学，只学 decoder。

最后一页是 state space model：latent 是一串 $z_1,\dots,z_T$，slide 问 prior、decoder、encoder 各是什么。按 [第 11 站](#mbrl)的记号，prior 是 $p(z_1)$ 和 learned 的 latent dynamics $p(z_{t+1}\mid z_t,a_t)$，decoder 是 $p(o_t\mid z_t)$，encoder 是 $q(z_t\mid o_{1:t})$ 或用整条 sequence 的 $q(z_{1:T}\mid o_{1:T})$。第 11 站说 deterministic encoder 会 collapse、需要 reconstruction 项，那里的 objective 就是这个 ELBO 去掉 entropy 之后的样子。

:::back
Jensen's inequality、EM 和 ELBO 取等号的条件在 [CS3244 的 em 站](../courses/CS3244.html#em)；reparameterization 与 score function 的 variance 对比在[第 4 站](#ac)；两个 mode 的 $\tanh$ 计算在[第 1 站](#il)。
:::

:::from
Latent variable model 的引入、RL 里的两种用法、“probabilistic inference”、variational approximation 与 Jensen、entropy 和 KL 的两种直觉及“why entropy?”、per-datapoint $q_i$ 的问题、amortized VI、“look up formula for entropy of a Gaussian”“can just use policy gradient!”“What's wrong with this gradient?”、reparameterization 与 “alternative view”、两种 gradient 的对比表、VAE、representation learning（Higgins 等 2017）、conditional model 与 multimodal imitation、与 diffusion 的关系、state space model 的三个问题，来自 [Spring 2026 Lecture 11](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-11.pdf) 和 [Lecture 12](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-12.pdf) 的前两部分（只读到文字，公式是图）。ELBO 的分解、Gaussian reparameterization、Gaussian KL 的 closed form 和 VAE estimator 核对的是 [Kingma 与 Welling 的 VAE 论文](https://ar5iv.labs.arxiv.org/html/1312.6114)（Appendix B 的最后一步化简没有读到，按两个 expectation 自己相减）。Mixture 的数值、discrete $z$ 时 pathwise gradient 为 0 的例子、一维 CVAE 的 $\tanh$ decoder 与 grid search、prior sample 的比例（seed 0）、state space model 三个问题的答案是为这一页推导并用 `python3 -I` 算的。
:::

## [cai] Control as inference：soft optimality 与 MaxEnt RL

:::skip
不在快速路线里，做 HW3 不需要它。但 SAC 的 entropy term、[第 9 站](#irl)的 inverse RL、[第 10 站](#llm)的 KL-regularized optimum 都是这一站的特例。能由 backward message 的 recursion 推出 $\pi=\exp(Q-V)$，能用一个例子说明 exact inference 为什么 optimistic，能由 variational inference 推出 soft value iteration 和 $\sum_t\mathbb E[r+\mathcal H(\pi)]$ 这个 objective，就可以去第 9 站。
:::

### 不完美的 behavior 需要一个 probabilistic model

Lecture 12 的 Part 3 从“optimal control as a model of human behavior”讲起（Mombaur 等 2009、Li 与 Todorov 2006、Ziebart 2008）：找一个 reward，使 optimal control 的结果能解释观测到的 behavior。Slide 接着问 “What if the data is not optimal?”，给出三条观察：有些错误比另一些要紧；behavior 是 stochastic 的；但好的 behavior 仍然最常见。

Deterministic 的 optimality 表达不了这三条。三个 action 的 reward 是 $0$、$-1$、$-3$，optimal control 说“永远选第一个”，看到一次第二个就说明 model 错了。如果 model 说 probability 正比于 $e^{r}$，三个 action 是

$$\frac{(e^0,\ e^{-1},\ e^{-3})}{e^0+e^{-1}+e^{-3}}=(0.705,\ 0.259,\ 0.035)$$

好的最常见；代价小的错出现的次数是代价大的错的 $0.259/0.035=7.4$ 倍。这一站把这个想法推广到整条 trajectory。

### Optimality variable

在 state 和 action 之外加一串 binary 的 optimality variable $O_t$，规定

$$p(O_t=1\mid s_t,a_t)=\exp\big(r(s_t,a_t)\big)$$

这要求 $r\le0$（任何 bounded reward 都可以平移成这样，第 9 站会看到平移不改变任何东西）。下面 $O_t$ 一律指 $O_t=1$。以“每一步都 optimal”为 condition，trajectory 的 posterior 是

$$p(\tau\mid O_{1:T})=\frac{p(\tau,O_{1:T})}{p(O_{1:T})}\ \propto\ p(\tau)\prod_t\exp\big(r(s_t,a_t)\big)=\Big[p(s_1)\prod_tp(s_{t+1}\mid s_t,a_t)\Big]\exp\Big(\sum_tr(s_t,a_t)\Big)$$

这里 $p(\tau)$ 里的 action 用 uniform 的 prior。Dynamics 是 deterministic 的时候，$p(\tau)$ 对可行的 trajectory 是常数，posterior 就是“可行的 trajectory 按 $\exp(\text{total reward})$ 加权”：probability 最大的那条是 optimal plan，次优的按 exponential 变少。Slide 说这个 model 没有假设 behavior 是 optimal 的，它有意思在三处：能 model 次优的 behavior（inverse RL 需要），能用 inference 的 algorithm 解 control 和 planning，能解释为什么 stochastic 的 behavior 可能更好（exploration 和 transfer）。

Inference 要做三件事：backward message $\beta_t(s_t,a_t)=p(O_{t:T}\mid s_t,a_t)$；policy $p(a_t\mid s_t,O_{1:T})$；forward message $\alpha_t(s_t)=p(s_t\mid O_{1:t-1})$。

### Backward message 就是 soft value iteration

$O_t$ 只依赖 $(s_t,a_t)$；给定 $s_{t+1}$，后面的 $O_{t+1:T}$ 和 $(s_t,a_t)$ 无关。所以

$$\beta_t(s_t,a_t)=p(O_{t:T}\mid s_t,a_t)=\int p(O_{t+1:T}\mid s_{t+1})\,p(s_{t+1}\mid s_t,a_t)\,p(O_t\mid s_t,a_t)\,ds_{t+1}$$

$p(O_{t+1:T}\mid s_{t+1})$ 是对 action prior 取平均：

$$\beta_{t+1}(s_{t+1})=\int p(O_{t+1:T}\mid s_{t+1},a_{t+1})\,p(a_{t+1}\mid s_{t+1})\,da_{t+1}=\mathbb E_{a_{t+1}\sim p(a\mid s)}\big[\beta_{t+1}(s_{t+1},a_{t+1})\big]$$

$p(a\mid s)$ 是 action prior，不是 policy，先取 uniform。从 $t=T$ 开始往回算：$\beta_T(s,a)=\exp(r(s,a))$，然后交替用上面两个式子。

取 log。令 $V_t(s)=\log\beta_t(s)$，$Q_t(s,a)=\log\beta_t(s,a)$。Uniform prior 的常数先忽略：

$$V_t(s_t)=\log\int\exp\big(Q_t(s_t,a_t)\big)\,da_t,\qquad Q_t(s_t,a_t)=r(s_t,a_t)+\log\mathbb E_{s_{t+1}}\big[\exp\big(V_{t+1}(s_{t+1})\big)\big]$$

$\log\int\exp$ 是 soft max：$Q$ 的值相差大时它接近 $\max_aQ$。比如 $Q=(1,\ 0.5,\ -1)$，$\log(e^1+e^{0.5}+e^{-1})=1.555$，比 max 多一点。Dynamics deterministic 时第二式就是 $Q=r+V(s_{t+1})$，和 Bellman backup 一样；stochastic 时 $\log\mathbb E[\exp V]$ 不是 $\mathbb E[V]$，下面会看到这是个问题。

Action prior 不 uniform 怎么办？$V_t(s)=\log\int\exp\big(Q_t(s,a)+\log p(a\mid s)\big)\,da$，把 $\log p(a\mid s)$ 并进 reward，$\tilde r=r+\log p(a\mid s)$，形式不变。Slide 因此说可以不失一般性地假设 uniform prior。这件事在 [第 10 站](#llm)用上了：LLM 的 reference model $\pi_{\text{ref}}$ 就是 action prior，KL-regularized 的 optimum $\pi_{\text{ref}}e^{r/\beta}/Z$ 正是这里的 posterior policy。

### Policy 是 $\exp(Q-V)$

给定 $s_t$，过去的 $O_{1:t-1}$ 不影响 $a_t$，用 Bayes rule：

$$p(a_t\mid s_t,O_{t:T})=\frac{p(O_{t:T}\mid s_t,a_t)\,p(a_t\mid s_t)}{p(O_{t:T}\mid s_t)}=\frac{\beta_t(s_t,a_t)}{\beta_t(s_t)}\,p(a_t\mid s_t)$$

Uniform prior 下，policy 是

$$\pi(a_t\mid s_t)=\frac{\beta_t(s_t,a_t)}{\beta_t(s_t)}=\exp\big(Q_t(s_t,a_t)-V_t(s_t)\big)=\exp\big(A_t(s_t,a_t)\big)$$

Slide 的读法：更好的 action 更 probable；两个 action 一样好时随机选；它像 Boltzmann exploration；加上 temperature，$\pi=\exp\big(\tfrac1\alpha Q-\tfrac1\alpha V\big)$，$\alpha\to0$ 时趋向 greedy policy。$Q=(1,\ 0.5,\ -1)$：

| Temperature $\alpha$ | 1 | 0.3 | 0.1 |
|---|---|---|---|
| $\pi$ | $(0.574,\ 0.348,\ 0.078)$ | $(0.840,\ 0.159,\ 0.001)$ | $(0.993,\ 0.007,\ 0.000)$ |

### Forward message：会被经过的 state

$\alpha_t(s_t)=p(s_t\mid O_{1:t-1})$ 由前一步推来：

$$\alpha_t(s_t)=\int p(s_t\mid s_{t-1},a_{t-1})\,p(a_{t-1}\mid s_{t-1},O_{t-1})\,p(s_{t-1}\mid O_{1:t-2})\,ds_{t-1}\,da_{t-1}$$

中间的 factor 由 Bayes rule 得 $p(O_{t-1}\mid s_{t-1},a_{t-1})p(a_{t-1}\mid s_{t-1})/p(O_{t-1}\mid s_{t-1})$，都是已知量；$\alpha_1=p(s_1)$。有了两个 message，optimal behavior 下 $s_t$ 的 marginal 是

$$p(s_t\mid O_{1:T})=\frac{p(O_{t:T}\mid s_t)\,p(s_t,O_{1:t-1})}{p(O_{1:T})}\ \propto\ \beta_t(s_t)\,\alpha_t(s_t)$$

$\beta_t$ 大的是“从这里出发能拿到高 reward”的 state，$\alpha_t$ 大的是“从起点出发、一路拿着高 reward 能走到”的 state，两者的交集就是 optimal behavior 会经过的地方。Slide 引 Li 与 Todorov（2006），用的是人伸手去够目标时手的轨迹分布。

一维的例子：position $x\in\{0,\dots,12\}$，时间 $t=0,\dots,12$，从 $x=0$ 出发，每步 action 是 $-1,0,+1$（uniform prior，碰到边界停住），只有最后一步有 reward $r_{12}(x)=-(x-8)^2/2$。中间没有 reward，$\alpha_t$ 就是 random walk 的 distribution；$\beta_t(x)$ 是从 $x$ random walk 到终点时 $\exp(r_{12})$ 的 expectation。两者相乘再 normalize，$t=6$ 时 posterior 的 mean 在 3.37，$t=12$ 时在 7.0。终点没有停在 goal 8：12 步里要走 8 次 $+1$ 的 path 在 prior 下很少，而 $x=7$ 只被罚 0.5，posterior 在两者之间取舍。

::fig[cs285-cigarA] 动图。横轴是时间，纵轴是 position，颜色越深 probability 越大。先从右往左算 backward message $\beta_t$（从这里能不能到 goal 附近），再从左往右算 forward message $\alpha_t$（从起点能不能走到这里），最后两者相乘：optimal behavior 的 state marginal 是一条从起点斜着通向 goal 的带子。

### Exact inference 太 optimistic

$Q=r+\log\mathbb E[\exp V(s')]$ 在 stochastic 的 dynamics 下会出问题。例子：从 $s_0$ 出发只走一步。Safe 的 action 一定到一个 reward $-3$ 的 state；risky 的 action 以 0.1 到 reward $0$ 的 state，以 0.9 到 reward $-10$ 的 state。

$$Q(\text{safe})=-3,\qquad Q(\text{risky})=\log\big(0.1\,e^{0}+0.9\,e^{-10}\big)=\log0.100041=-2.302$$

Inference 给出的 policy 以 $e^{-2.302}/(e^{-3}+e^{-2.302})=0.668$ 的 probability 选 risky。可 risky 真实的 expected reward 是 $0.1\times0+0.9\times(-10)=-9$，比 safe 差得多。这个 policy 的真实 expected reward 是 $0.332\times(-3)+0.668\times(-9)=-7.01$。

原因在 posterior 里的 dynamics。以 $O$ 为 condition，transition 也被改写了：

$$p(s_1=\text{win}\mid s_0,\text{risky},O)=\frac{0.1\times e^{0}}{0.1\times e^0+0.9\times e^{-10}}=0.99959$$

Inference 回答的问题是“已知这个 agent 成功了，它多半做了什么、遇到了什么”。成功的人里买了彩票的多半中了奖，这个推断本身没错；错在拿它当 control：agent 控制不了 nature，选 risky 时真实的 transition 仍是 0.1。Slide 上的话是这个“optimistic” transition 不是好主意。

::fig[cs285-optimism] 同一个一步的问题。左边是真实的 transition，右边是以 optimality 为 condition 的 posterior transition：risky 之后几乎一定“中奖”，所以 $Q(\text{risky})$ 被算成 $-2.30$，高过 safe 的 $-3$。

:::wrong 以 optimality 为 condition 的 posterior policy $p(a\mid s,O_{1:T})$，就是 entropy-regularized 的 optimal policy
Dynamics deterministic 时两者相同；stochastic 时不同。上面的例子里 posterior policy 选 risky 的 probability 是 0.668，真实 expected reward $-7.01$；下面用 variational inference 求出的 policy 选 risky 的 probability 是 0.0025，expected reward $-3.01$。差别全在 $\log\mathbb E[e^V]$ 和 $\mathbb E[V]$：前者被 0.1 probability 的好结果主导。
:::

### 用 variational inference 修正

Lecture 13 的 Part 2：找一个 $q(s_{1:T},a_{1:T})$ 去 approximate posterior $p(s_{1:T},a_{1:T}\mid O_{1:T})$，但规定 $q$ 的 dynamics 就是真实的 dynamics，只有 policy 可以变：

$$q(\tau)=p(s_1)\prod_tp(s_{t+1}\mid s_t,a_t)\,q(a_t\mid s_t)$$

套用[第 7 站](#vi)的 ELBO，observed 的是 $x=O_{1:T}$，latent 的是 $z=(s_{1:T},a_{1:T})$：

$$\log p(O_{1:T})\ \ge\ \mathbb E_{\tau\sim q}\big[\log p(O_{1:T},\tau)-\log q(\tau)\big]$$

把两个 distribution 展开。$p(O_{1:T},\tau)=p(s_1)\prod_tp(s_{t+1}\mid s_t,a_t)\,p(a_t\mid s_t)\exp(r(s_t,a_t))$，$p(a_t\mid s_t)$ 是 uniform 的常数。$\log p(s_1)$ 和每个 $\log p(s_{t+1}\mid s_t,a_t)$ 在两边各出现一次，相减抵消：

$$\log p(O_{1:T})\ \ge\ \mathbb E_{\tau\sim q}\Big[\sum_t\big(r(s_t,a_t)-\log q(a_t\mid s_t)\big)\Big]+\text{const}=\sum_t\mathbb E_{(s_t,a_t)\sim q}\big[r(s_t,a_t)+\mathcal H\big(q(\cdot\mid s_t)\big)\big]+\text{const}$$

这就是 maximum entropy RL 的 objective：期望 reward 加上每一步 policy 的 entropy。Dynamics 被固定，agent 不再能“假设自己运气好”。

从最后一步往回 optimize。$t=T$ 时只有一项：

$$\max_{q(\cdot\mid s_T)}\ \mathbb E_{a\sim q}\big[r(s_T,a)\big]+\mathcal H\big(q(\cdot\mid s_T)\big)=\max_q\ -\mathrm{KL}\Big(q\ \Big\|\ \frac{\exp(r(s_T,\cdot))}{\int\exp(r(s_T,a))da}\Big)+\log\int\exp\big(r(s_T,a)\big)\,da$$

（和[第 10 站](#llm)推 KL-regularized optimum 时一样，把 $r$ 并进 log。）所以 $q(a_T\mid s_T)=\exp\big(Q_T-V_T\big)$，$Q_T=r$，$V_T=\log\int\exp Q_T\,da$，最大值是 $V_T(s_T)$。往前一步，$t=T-1$ 的那一项多了 $\mathbb E_{s_T\sim p(s_T\mid s_{T-1},a_{T-1})}[V_T(s_T)]$，形式完全相同。一般地：

$$Q_t(s_t,a_t)=r(s_t,a_t)+\mathbb E_{s_{t+1}\sim p(s_{t+1}\mid s_t,a_t)}\big[V_{t+1}(s_{t+1})\big],\qquad V_t(s_t)=\log\int\exp\big(Q_t(s_t,a_t)\big)\,da_t,\qquad q(a_t\mid s_t)=\exp(Q_t-V_t)$$

和 exact inference 的唯一区别是 $\mathbb E[V]$ 代替了 $\log\mathbb E[\exp V]$。这叫 soft value iteration。Levine（2018）的 tutorial 列出的变体：加 discount 时 $Q=r+\gamma\,\mathbb E[V]$；加 temperature 时 $V=\alpha\log\int\exp(Q/\alpha)\,da$，$\alpha\to0$ 回到普通的 value iteration。

回到 safe 与 risky：$Q(\text{risky})=\mathbb E[r]=-9$，$Q(\text{safe})=-3$，$q(\text{risky})=e^{-9}/(e^{-3}+e^{-9})=0.0025$。

### MaxEnt RL 的三个 algorithm

Lecture 13 Part 3 把 soft optimality 放进前面学过的三类 algorithm：

- **Soft Q-learning。** Target 里的 max 换成 soft max：$y=r(s,a)+\gamma V(s')$，$V(s')=\log\int\exp\big(Q(s',a')\big)\,da'$；policy 是 $\pi(a\mid s)=\exp(Q-V)$。Discrete action 时 soft max 直接求和；continuous 时要用 sample 估。
- **Soft policy gradient。** Objective 是 $\sum_t\mathbb E[r(s_t,a_t)]+\mathbb E\big[\mathcal H(\pi_\theta(\cdot\mid s_t))\big]$。Slide 说通常就是在 policy gradient 的 objective 里加 entropy，而大多数常见的 policy class 的 entropy 有 closed form（Gaussian 每一维 $\tfrac12\log(2\pi e\sigma^2)$），直接写进 loss。
- **Soft actor-critic。** Critic 学当前 policy 的 soft $Q$，target 是 $r+\gamma\,\mathbb E_{a'\sim\pi}\big[Q(s',a')-\log\pi(a'\mid s')\big]$；actor 去逼近 $\exp(Q-V)$，即 minimize $\mathrm{KL}\big(\pi\,\|\,\exp(Q-V)\big)=\mathbb E_{a\sim\pi}[\log\pi(a\mid s)-Q(s,a)]+V(s)$，$V$ 和 actor 无关。用 replay buffer，slide 说它是最常用的 off-policy actor-critic 之一。这正是 [第 5 站](#q) HW3 的 SAC：critic target 里的 $\beta\mathcal H$、actor loss 里的 $\beta\mathcal H$，就是这里 temperature 为 $\beta$ 的版本。

:::edge Dynamics deterministic 时 inference 和 variational 的答案相同
$s_{t+1}$ 由 $(s_t,a_t)$ 唯一决定时 $\log\mathbb E[\exp V]=V(s_{t+1})=\mathbb E[V]$，两种 backup 一模一样，optimism 的问题不出现。Lecture 12 用 deterministic 的情形说明“inference = planning”时并没有犯错，问题只在 stochastic dynamics。
:::

:::back
ELBO 在[第 7 站](#vi)；SAC 的四个部件在[第 5 站](#q)；KL-regularized 的 closed form 在[第 10 站](#llm)。
:::

:::from
“optimal control as a model of human behavior”（Mombaur 等 2009、Li 与 Todorov 2006、Ziebart 2008）、“What if the data is not optimal?”的三条、“no assumption of optimal behavior”、它有意思的三点、backward message、uniform action prior 不失一般性、policy computation 的读法与 Boltzmann exploration、forward message 与两者的交集，来自 [Spring 2026 Lecture 12](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-12.pdf) 的 Part 3；“optimistic” transition 的问题、control via variational inference、三个 MaxEnt algorithm 与 SAC 的描述来自 [Lecture 13](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-13.pdf) 的 Part 1–3。两讲都只读到文字和标题，公式是图：optimality variable 的定义、posterior 的形式、$\beta$ 的 recursion、$Q=\log\beta$、optimism 的来源、variational distribution 的形式、ELBO 化成 reward 加 entropy、soft value iteration 及 discount 和 temperature 的变体，对照的是 [Levine 2018 的 tutorial](https://arxiv.org/pdf/1805.00909v2) 第 2、3 节（抓取工具只给出了重述，没有逐字原文）。三个 action 的例子、temperature 的数表、一维 posterior 的带子（mean 3.37 与 7.0）、safe 与 risky 的例子和全部数字、SAC actor loss 写成 KL 的那一行，是为这一页推导并用 `python3 -I` 算的。
:::

## [irl] Inverse RL：MaxEnt IRL、guided cost learning 与 adversarial imitation

:::skip
不在快速路线里。[RB4301 的 bc 站](../courses/RB4301.html#bc)已经在四条路线的例子上走过 MaxEnt IRL 的 feature matching gradient，这一站讲 CS285 加上的部分：把 IRL 放进[第 8 站](#cai)的 graphical model，在有 dynamics 的 MDP 上用 backward 和 forward message 算 gradient，用 importance sampling 避开内层的 RL，以及它和 GAN 的关系。能在一个 chain 上走完一轮 gradient，能写出 guided cost learning 的 importance weight，能说出 GAIL 的 discriminator 为什么不能当 reward 拿去重新 optimize，就可以去第 10 站。
:::

### 为什么要学 reward

Lecture 13 Part 4 从两个角度说为什么要学 reward。Imitation learning 的角度：standard imitation 复制 expert 的 action，人的 imitation 复制 expert 的 intent，做出来的 action 可能很不一样（换一个身体、换一个起点）。RL 的角度：游戏里有分数，现实任务里 reward 从哪来？Inverse RL 从 demonstration 里推断 reward function，再用它去学 policy。

Slide 指出这个问题本身是 underdetermined 的：很多 reward 能解释同样的 behavior。最直接的一种：给每一步的 reward 加同一个 constant $c$，长度为 $T$ 的 trajectory 的 total reward 全都加 $Tc$，任何两条 trajectory 的比较都不变。

形式上：给定 state、action、（有时）transition，以及从 $\pi^*$ 抽出的 sample $\{\tau_i\}$，学 $r_\psi(s,a)$，再用它学 $\pi^*$。Reward 常取 linear 的 $r_\psi(s,a)=\psi^\top f(s,a)$，也可以是 network。

### 把 reward 写进 optimality variable

用[第 8 站](#cai)的 model，让 reward 带 parameter：$p(O_t\mid s_t,a_t,\psi)=\exp\big(r_\psi(s_t,a_t)\big)$。Demonstration 被当成 optimal behavior 的 sample，$p(\tau\mid O_{1:T},\psi)\propto p(\tau)\exp\big(\sum_tr_\psi(s_t,a_t)\big)$。对 demonstration 做 maximum likelihood，$p(\tau)$ 和 $\psi$ 无关，去掉：

$$\max_\psi\ \frac1N\sum_i\log p(\tau_i\mid O_{1:T},\psi)=\max_\psi\ \frac1N\sum_ir_\psi(\tau_i)-\log Z,\qquad Z=\int p(\tau)\exp\big(r_\psi(\tau)\big)\,d\tau$$

$r_\psi(\tau)=\sum_tr_\psi(s_t,a_t)$，$Z$ 是 partition function。对 $\psi$ 求 gradient：

$$\nabla_\psi\mathcal L=\frac1N\sum_i\nabla_\psi r_\psi(\tau_i)-\frac1Z\int p(\tau)\exp\big(r_\psi(\tau)\big)\nabla_\psi r_\psi(\tau)\,d\tau=\mathbb E_{\tau\sim\pi^*}\big[\nabla_\psi r_\psi(\tau)\big]-\mathbb E_{\tau\sim p(\tau\mid O_{1:T},\psi)}\big[\nabla_\psi r_\psi(\tau)\big]$$

第一项用 demonstration 估；第二项是当前 reward 下 soft optimal policy 的 expectation。$\nabla_\psi\mathcal L=0$ 时两者相等：在当前 reward 下按 soft optimal 行动，看起来和 expert 一样。

第二项按时间拆开，只需要每个时刻 $(s_t,a_t)$ 的 marginal。用[第 8 站](#cai)的两个 message：

$$p(s_t,a_t\mid O_{1:T},\psi)=p(a_t\mid s_t,O_{1:T},\psi)\,p(s_t\mid O_{1:T},\psi)=\frac{\beta_t(s_t,a_t)}{\beta_t(s_t)}\cdot\frac{\beta_t(s_t)\,\alpha_t(s_t)}{\text{const}}\ \propto\ \beta_t(s_t,a_t)\,\alpha_t(s_t)$$

记 normalize 之后的 marginal 为 $\mu_t(s_t,a_t)$。MaxEnt IRL（Ziebart 等 2008）的一轮就是：

1. 用当前 $\psi$ 算 backward message $\beta$；
2. 算 forward message $\alpha$；
3. 得到 $\mu_t(s_t,a_t)\propto\beta_t(s_t,a_t)\alpha_t(s_t)$；
4. $\nabla_\psi\mathcal L=\frac1N\sum_i\sum_t\nabla_\psi r_\psi(s_{i,t},a_{i,t})-\sum_t\iint\mu_t(s_t,a_t)\,\nabla_\psi r_\psi(s_t,a_t)\,ds_t\,da_t$；
5. $\psi\leftarrow\psi+\eta\nabla_\psi\mathcal L$。

Reward 是 linear 的时候 $\nabla_\psi r=f$，gradient 就是“demonstration 的 feature count 减 expected feature count”，converge 时两者 match。Ziebart 的论证是：match feature 的 distribution 有很多，选 entropy 最大的那个，就是不做多余的假设，解出来正好是 $\exp(\psi^\top f)$ 的形式。

### 在一个 chain 上走一遍

State $0,1,2,3,4$ 排成一排，从 0 出发走 $T=4$ 步，action 是 $-1,0,+1$（碰到两端停住），dynamics deterministic。Reward 只看到达的 state，feature 是 one-hot，所以 $\psi$ 就是每个 state 一个数。Expert 按 reward $r^*(s)=-|s-3|=(-3,-2,-1,0,-1)$ 做 soft optimal 的 behavior。它在 4 步里访问各 state 的 expected 次数（对 $t=1..4$ 求和）是

$$d^*=(0.093,\ 1.175,\ 1.411,\ 1.190,\ 0.131)$$

总和是 4。按时间看：$t=1$ 时 $(0.069,\ 0.931,\ 0,\ 0,\ 0)$，$t=4$ 时 $(0.007,\ 0.045,\ 0.245,\ 0.571,\ 0.131)$。Soft optimal 的 expert 也会偶尔留在原地，或走过头到 state 4。

从 $\psi=0$ 出发。Reward 全是 0，backward message 处处相同，policy 是 uniform 的 random walk，forward message 算出的 expected visitation 是 $(2.136,\ 1.321,\ 0.432,\ 0.099,\ 0.012)$：一半时间困在 0 附近。Gradient 是两者之差

$$d^*-d_\psi=(-2.043,\ -0.146,\ 0.979,\ 1.091,\ 0.119)$$

取 $\eta=0.5$，第一步之后 $\psi=(-1.021,\ -0.073,\ 0.489,\ 0.546,\ 0.059)$：0 附近被罚，2 和 3 被奖励。继续做：

| 第几步 | $\psi$ | $d_\psi$ |
|---|---|---|
| 0 | $(0,\ 0,\ 0,\ 0,\ 0)$ | $(2.136,\ 1.321,\ 0.432,\ 0.099,\ 0.012)$ |
| 1 | $(-1.021,\ -0.073,\ 0.489,\ 0.546,\ 0.059)$ | $(0.359,\ 1.585,\ 1.452,\ 0.543,\ 0.061)$ |
| 5 | $(-1.333,\ -0.498,\ 0.396,\ 1.281,\ 0.154)$ | $(0.154,\ 1.230,\ 1.423,\ 1.090,\ 0.102)$ |
| 20 | $(-1.523,\ -0.598,\ 0.405,\ 1.413,\ 0.303)$ | $(0.103,\ 1.176,\ 1.411,\ 1.192,\ 0.119)$ |
| 100 | $(-1.6,\ -0.6,\ 0.4,\ 1.4,\ 0.4)$ | $(0.093,\ 1.175,\ 1.411,\ 1.190,\ 0.131)$ |

Converge 到的 $\psi$ 是 $r^*-\overline{r^*}$：$r^*$ 的 mean 是 $-1.4$，减掉之后正是 $(-1.6,-0.6,0.4,1.4,0.4)$。Mean 为什么永远是 0？$d^*$ 和 $d_\psi$ 的总和都是 4，gradient 的各分量加起来是 0，从 $\psi=0$ 出发 mean 就不会动。这是上面说的 underdetermined：把 $\psi$ 整体加 5，$d_\psi$ 完全不变（实算是 $(0.093,\ 1.175,\ 1.411,\ 1.190,\ 0.131)$），likelihood 没有办法区分它们。

::fig[cs285-irlA] 动图，一步步做 MaxEnt IRL 的 gradient ascent。上面的柱子是学到的 reward $\psi$（彩色）和 expert 的 $r^*$ 减去 mean（灰框）；下面是当前 reward 下 soft optimal policy 的 expected visitation（彩色）和 demonstration 的（灰框）。两边一起对上。

:::wrong IRL 学出来的 reward 就是 expert 心里的那个 reward
上面的例子里 likelihood 只能决定 $\psi$ 到差一个 constant，$\psi$ 与 $\psi+5$ 给出完全相同的 behavior。Demonstration 有限时还要加上 sampling 的误差：用 20 条 expert trajectory（seed 0）的 visitation $(0.05,\ 1.2,\ 1.4,\ 1.25,\ 0.1)$ 去做，converge 到的（减 mean 之后）是 $(-2.00,\ -0.31,\ 0.48,\ 1.61,\ 0.21)$，state 0 和 state 3 的差从真实的 3 变成了 3.61。IRL 给出的是“一个能解释这些 demonstration 的 reward”，用来在别处重新 optimize 时要记得它只被 data 确定到这个程度。
:::

:::edge Expert 是 deterministic 的
MaxEnt 的 model 假设 expert 有一点 randomness。如果 demonstration 全是同一条 $0\to1\to2\to3\to3$，visitation 是 $(0,\ 1,\ 1,\ 2,\ 0)$，要让 soft optimal 的 behavior 完全不碰 state 0 和 4，reward 的差必须无穷大。实算同一个 gradient ascent：state 3 的 $\psi$（减 mean 之后）在第 10、100、1000、10000、100000 步是 2.96、4.76、6.57、8.39、10.22，每多 10 倍的步数涨约 1.8，不 converge；$d_\psi$ 和 $(0,1,1,2,0)$ 的差距在第 10 万步是 $1.6\times10^{-5}$。Likelihood 越来越接近它的 supremum，reward 的 scale 随之发散。实际中这由 reward 的 regularization 或 network 的有限容量挡住。
:::

### 内层的 RL：importance sampling 与 guided cost learning

上面的第 1–3 步要求 enumerate 所有 state、知道 dynamics。State 很大或 continuous、dynamics 未知时，第二项 $\mathbb E_{p(\tau\mid O,\psi)}[\nabla r_\psi]$ 只能这样估：用 MaxEnt RL（[第 8 站](#cai)的 soft Q-learning 或 SAC）在当前 reward 下学出 soft optimal policy $p(a_t\mid s_t,O_{1:T},\psi)$，再 run 它收集 $\{\tau_j\}$，取 $\frac1M\sum_j\nabla_\psi r_\psi(\tau_j)$。每走一步 gradient 都要解一次 RL，太贵。

Lecture 13 的 “more efficient sample-based updates”：不把内层的 RL 解到 converge，每次只把 policy $\pi$ 改进一点。这样 sample 来自 $\pi$，不来自 $p(\tau\mid O,\psi)$，用 importance sampling 补回来：

$$\mathbb E_{p(\tau\mid O,\psi)}\big[\nabla_\psi r_\psi\big]\approx\frac{1}{\sum_jw_j}\sum_jw_j\,\nabla_\psi r_\psi(\tau_j),\qquad w_j=\frac{p(\tau_j)\exp\big(r_\psi(\tau_j)\big)}{\pi(\tau_j)}=\frac{\exp\big(\sum_tr_\psi(s_t,a_t)\big)}{\prod_t\pi(a_t\mid s_t)}$$

$p(\tau)$ 和 $\pi(\tau)$ 里的 initial state 与 dynamics 相同，相除后只剩 action 的部分（uniform action prior 的常数在 normalize 时消掉）。Weight 自己 normalize，$Z$ 不用算。Policy 每次朝当前 reward 改进，越来越接近 $p(\tau\mid O,\psi)$，weight 越来越接近常数。这是 guided cost learning（Finn、Levine、Abbeel 2016）的循环：从 $\pi$ 抽 sample；用 sample 和 demonstration 更新 reward（demonstration 的 reward 往上推，sample 的 reward 按 $w_j$ 往下推）；在新 reward 下更新 $\pi$。论文里 $\pi$ 用 local linear-Gaussian 的 controller，按 MaxEnt 的 objective 做 KL-constrained 的更新；demonstration 还用来初始化 $\pi$。

在 chain 上看 sampler 的作用。取 $\psi=r^*$，用 uniform random policy 当 $\pi$（每条 action sequence 的 probability 都是 $3^{-4}$，weight 正比于 $\exp(\sum r)$），每次估 expected visitation，重复 200 次看平均和 spread：

| 每次的 sample 数 $M$ | 估计的平均 | 各 state 的 std 最大是 |
|---|---|---|
| 10 | $(0.468,\ 1.605,\ 1.283,\ 0.555,\ 0.088)$ | 0.607 |
| 100 | $(0.109,\ 1.201,\ 1.438,\ 1.122,\ 0.130)$ | 0.280 |
| 1000 | $(0.094,\ 1.177,\ 1.416,\ 1.178,\ 0.135)$ | 0.082 |
| exact | $(0.093,\ 1.175,\ 1.411,\ 1.190,\ 0.131)$ | |

$M=10$ 时偏得厉害：random walk 很少走到 state 3，一旦走到，那一条的 weight 就压倒其他所有 sample。Sampler 越接近 $\exp(r_\psi)$，同样的 $M$ 估得越准，这就是 guided cost learning 要同时 train policy 的原因。

### IRL 是一个 GAN

Lecture 13 Part 5 说这个过程“looks a lot like a game”：policy 想让自己的 sample 看起来像 demonstration；reward 想让 demonstration 看起来好、policy 的 sample 看起来差。GAN（Goodfellow 等 2014）是同样的结构。固定 generator 的 density $q$，discriminator $D$ maximize $\mathbb E_{x\sim p^*}[\log D(x)]+\mathbb E_{x\sim q}[\log(1-D(x))]$。在每个 $x$ 上分别 maximize $p^*\log D+q\log(1-D)$，对 $D$ 求 derivative：$p^*/D=q/(1-D)$，所以

$$D^*(x)=\frac{p^*(x)}{p^*(x)+q(x)}$$

Finn、Christiano、Abbeel、Levine（2016）把 IRL 写成 GAN：discriminator 不是一个任意的 classifier，而是由 reward 决定的

$$D_\psi(\tau)=\frac{\frac1Z\exp\big(r_\psi(\tau)\big)}{\frac1Z\exp\big(r_\psi(\tau)\big)+\pi_\theta(\tau)}$$

（$p(\tau)$ 的 dynamics 部分同样在两边约掉。）$\psi$ 和 $Z$ 一起按 GAN 的 discriminator loss 来 optimize。论文证明了三件事：使 loss 最小的 $Z$ 正是 partition function 的 importance-sampled estimate；在这个 $Z$ 下，discriminator loss 对 $\psi$ 的 gradient 等于 MaxEnt IRL objective 的 gradient；generator 的 loss 等于 MaxEnt RL 的 objective 加上 $\log Z$。最后一点可以直接验证：

$$\frac{1-D_\psi}{D_\psi}=\frac{\pi_\theta(\tau)}{\frac1Z\exp(r_\psi(\tau))}\quad\Longrightarrow\quad\mathbb E_{\tau\sim\pi_\theta}\big[\log(1-D_\psi)-\log D_\psi\big]=\log Z-\mathbb E_{\pi_\theta}\big[r_\psi(\tau)\big]+\mathbb E_{\pi_\theta}\big[\log\pi_\theta(\tau)\big]$$

右边去掉常数 $\log Z$，就是 $-\big(\mathbb E[r_\psi]+\mathcal H(\pi_\theta)\big)$，generator minimize 它等于做 MaxEnt RL。

Converge 时 $\pi_\theta=p(\tau\mid O,\psi)$，$D_\psi=\tfrac12$ 处处成立，但 $r_\psi$ 留下来了：$\log\frac{D_\psi}{1-D_\psi}=r_\psi(\tau)-\log Z-\log\pi_\theta(\tau)$，discriminator 的 logit 里减去了 $\log\pi_\theta$，reward 在 $\psi$ 里。

Slide 接着问：能不能直接用一个普通的 binary classifier 当 discriminator？这是 GAIL（Ho 与 Ermon 2016）：$D_\psi(s,a)$ 是任意 network，policy 用 $\log D_\psi$ 当 reward 去 optimize。Slide 列的优点是 optimization 通常更简单、moving parts 更少；缺点是 converge 时 discriminator 对 task 一无所知，一般无法拿它重新 optimize 出“reward”。在 chain 上：GAIL converge 时 $\pi$ 的 visitation 等于 $d^*$，$D=\tfrac12$ 对每条 trajectory 都成立，$\log D=-0.693$ 是一个常数，拿它当 reward 在任何环境里都学不出东西；IRL 形式的 discriminator converge 时 $\psi=(-1.6,-0.6,0.4,1.4,0.4)$，换一个起点或一条更长的 chain 照样能用。最后一页把这一类方法（Hausman、Chebotar、Schaal、Sukhatme、Lim，以及 Peng、Kanazawa、Toyer、Abbeel、Levine）画成 robot 的尝试、classifier、reward 三者的循环，标注 “actually the same thing”。

:::back
Backward 与 forward message 在[第 8 站](#cai)；trajectory 级的 MaxEnt IRL 与 feature matching 在 [RB4301 的 bc 站](../courses/RB4301.html#bc)；importance sampling 的 variance 问题在[第 6 站](#trpo)。
:::

:::from
“why should we worry about learning rewards”的两个角度、IRL 的定义和 underdetermined、learning the optimality variable、partition function、gradient 的估法、“more efficient sample-based updates”、importance sampling、guided cost learning 的循环（Finn 等 ICML 2016）、“looks a lot like a game”、GAN、IRL as GAN、GAIL 的优缺点、IRL as adversarial optimization，来自 [Spring 2026 Lecture 13](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-13.pdf) 的 Part 4–5（只读到文字和标题）。Trajectory distribution、gradient 用 state visitation 写的形式、Algorithm 1 的 backward 与 forward pass、feature matching 与 ambiguity 来自 [Ziebart 等 2008](https://www.ri.cmu.edu/pub_files/pub4/ziebart_brian_d_2008_1/ziebart_brian_d_2008_1.pdf)；importance-sampled 的 loss、gradient、Algorithm 1 和 sampler 的更新方式来自 [Finn、Levine、Abbeel 2016](https://arxiv.org/pdf/1603.00448)；$D^*$、reward 决定的 discriminator、三个等价结论和 generator loss 的化简来自 [Finn、Christiano、Abbeel、Levine 2016](https://arxiv.org/pdf/1611.03852)。GAIL 的论文没有读，只用了 slide 的描述。Chain 的例子、gradient ascent 的数表、20 条 demonstration 的结果、deterministic expert 时的发散、importance sampling 的数表是为这一页写并用 `python3 -I` 算的（seed 0）。
:::

## [llm] LLM 上的 RL：KL regularization、GRPO 与 KL estimator

:::skip
做 HW4 就必读，否则可以放到最后。Fall 2023 没有对应的录像，读 Spring 2026 Lecture 14 的 slides 加这一站。能推出 KL-regularized objective 的 optimal policy、写出 GRPO 的 loss 并说出 group 里 reward 全相同时会怎样、证明 $e^\Delta-\Delta-1$ 是 KL 的 unbiased estimator，就可以去第 11 站。
:::

### 一次生成是一步，也是很多步

Lecture 14 的 basic formulation：给一个 prompt $x$，policy 生成 completion $y=(y_1,\dots,y_T)$，最后得到一个 reward $r(x,y)$。从 sequence 的角度这是一步的 RL（一个 bandit），$\pi_\theta(y\mid x)=\prod_t\pi_\theta(y_t\mid x,y_{<t})$，policy gradient 是

$$\nabla_\theta\,\mathbb E_{y\sim\pi_\theta}[r(x,y)]=\mathbb E\Big[r(x,y)\sum_t\nabla_\theta\log\pi_\theta(y_t\mid x,y_{<t})\Big]$$

从 token 的角度，每生成一个 token 是一步，state 是 $(x,y_{<t})$，只有最后一步有 reward。两种看法给出同一个 gradient；token 级的看法在有中间 reward、或要用 value function 做 baseline 时更自然。Lecture 14 提到 value baseline 的两种做法：在 LLM 上加一个 value head，或者整个复制一份 network；value function 只在 completion 部分 train，不在 prompt 上。

Reward 从哪来，Lecture 14 列了两类：人类的 preference（RLHF，用 Bradley–Terry model 把“A 比 B 好”变成 reward model，fit 的方式很像 logistic regression），以及 verifier（答案对不对）。HW4 用的是后一类，format copy 和 MATH 的 reward 都由 parser 自动给出。

### 为什么要拉住 reference model

只最大化 reward，policy 会去找 reward 的漏洞：reward model 是 learned 的，在它没见过的输出上可能给出离谱的高分；即使是 verifier，也可能给不再像正常语言的输出高分。Lecture 14 的 reference-model regularization 有两个理由：输出必须仍是 valid English，以及不要 exploit 不完美的 reward model。Objective 是

$$\max_\pi\ \mathbb E_{y\sim\pi}\big[r(x,y)\big]-\beta\,\mathrm{KL}\big(\pi(\cdot\mid x)\,\|\,\pi_{\text{ref}}(\cdot\mid x)\big)$$

它的 optimal policy 有 closed form。令 $\pi^*(y)=\pi_{\text{ref}}(y)e^{r(y)/\beta}/Z$，$Z=\sum_y\pi_{\text{ref}}(y)e^{r(y)/\beta}$。把 objective 整理：

$$\mathbb E_\pi[r]-\beta\sum_y\pi(y)\log\frac{\pi(y)}{\pi_{\text{ref}}(y)}=-\beta\sum_y\pi(y)\log\frac{\pi(y)}{\pi_{\text{ref}}(y)e^{r(y)/\beta}}=-\beta\,\mathrm{KL}(\pi\,\|\,\pi^*)+\beta\log Z$$

（第一个等号把 $r(y)=\beta\log e^{r(y)/\beta}$ 并进 log；第二个等号用 $\pi_{\text{ref}}e^{r/\beta}=Z\pi^*$。）$\beta\log Z$ 和 $\pi$ 无关，KL 非负且只在 $\pi=\pi^*$ 时为 0，所以 $\pi^*$ 是 optimum，最大值是 $\beta\log Z$。

三个 completion，$\pi_{\text{ref}}=(0.7,\ 0.2,\ 0.1)$，reward $(0,\ 1,\ 1)$：

| $\beta$ | $\pi^*$ | $\mathbb E[r]$ | KL | objective $=\beta\log Z$ |
|---|---|---|---|---|
| 2 | $(0.586,\ 0.276,\ 0.138)$ | 0.414 | 0.029 | 0.356 |
| 0.5 | $(0.240,\ 0.507,\ 0.253)$ | 0.760 | 0.450 | 0.535 |
| 0.1 | $(0.0001,\ 0.667,\ 0.333)$ | 1.000 | 1.203 | 0.880 |

两个 reward 相同的 completion，比例始终是 $2:1$，和 $\pi_{\text{ref}}$ 一样：reward 区分不了的地方，policy 保留 reference model 的偏好。$\beta\to0$ 时 KL 趋向 $-\log0.3=1.204$，即把 $\pi_{\text{ref}}$ 在 reward 为 1 的那部分（共 0.3）放大成全部。

### Group baseline

Lecture 14 的“baselining without value functions”就是 GRPO 的做法：对同一个 prompt 抽 $G$ 个 completion，用它们 reward 的平均当 baseline。HW4 的写法还除以 group 内的 population std：

$$A_{i,j}=\frac{r_{i,j}-\mu_i}{\sigma_i+\epsilon},\qquad\mu_i=\frac1G\sum_jr_{i,j},\qquad\sigma_i=\sqrt{\frac1G\sum_j(r_{i,j}-\mu_i)^2}$$

**Mean 里含自己，gradient 会缩小。** 第 $j$ 个 completion 的 baseline $\mu_i$ 里有 $r_{i,j}/G$ 这一项，它依赖 $y_{i,j}$。拆开：

$$\mathbb E\Big[\nabla\log\pi(y_j)\Big(r_j-\frac1G\sum_kr_k\Big)\Big]=\Big(1-\frac1G\Big)\mathbb E\big[\nabla\log\pi(y_j)\,r_j\big]-\frac1G\sum_{k\ne j}\mathbb E\big[\nabla\log\pi(y_j)\big]\,\mathbb E[r_k]$$

$k\ne j$ 的 completion 和 $y_j$ 独立，expectation 分开，$\mathbb E[\nabla\log\pi(y_j)]=0$。结果是 true gradient 乘 $(1-1/G)$，方向不变。用 leave-one-out mean（不含自己）则完全 unbiased。

**除以 std 改变了各 prompt 的权重。** Reward 是 0 或 1 时，一个 8 选 1 对的 group，$\mu=0.125$，$\sigma=\sqrt{0.125\times0.875}=0.331$，答对的那个 advantage 是 $0.875/0.331=2.65$，答错的各是 $-0.378$；一个 8 选 4 对的 group，$\sigma=0.5$，advantage 是 $\pm1$。难题上偶然答对的那一次被放大到 2.65 倍。Dr. GRPO 一文（Liu 等，2025）把这叫 question-level difficulty bias：std 小的题，也就是几乎总答对或几乎总答错的题，在 update 里得到更大的 weight。$G$ 个回答里只有 1 个对时，$\mu=1/G$，$\sigma=\sqrt{\tfrac1G\cdot\tfrac{G-1}G}=\tfrac{\sqrt{G-1}}G$，答对那个的 advantage 是 $\tfrac{(G-1)/G}{\sqrt{G-1}/G}=\sqrt{G-1}$，group 越大越极端。HW4 的 starter code 把 advantage clip 在 $[-5,5]$（`adv_clip=5.0`）：$G=8$ 时是 2.65，$G=16$ 时是 3.87，都不受影响；做 hyperparameter 变体时把 group 调到 32，这个数是 5.57，会被截到 5。

**Reward 全相同的 group 没有信号。** 8 个回答全对或全错时 $r_{i,j}-\mu_i=0$，这个 prompt 的 gradient 恰好是 0。每个回答答对的 probability 为 $p$ 时，这件事的 probability 是 $p^8+(1-p)^8$：

| $p$ | 0.05 | 0.23 | 0.5 | 0.9 |
|---|---|---|---|---|
| 一个 group 全相同 | 66.3% | 12.4% | 0.8% | 43.0% |

HW4 说 MATH 子集上 RL 之前的 eval 约 0.23，于是一开始约 12% 的 prompt 不贡献 gradient；太难（$p=0.05$）或太容易（$p=0.9$）的题，大部分 batch 白算。HW4 的 reward 里有 format 分（出现 `\boxed{` 加 0.1 等），handout 说这些辅助项帮助 exploration，从这里也能看出原因：它们让同一个 group 里的 reward 不容易完全相同。

### GR-REINFORCE 与 GRPO 的 loss

HW4 的 GR-REINFORCE 先在每个 completion 内对 token 的 log-probability 取平均，$\bar\ell_i=\frac1{T_i}\sum_t\log\pi_\theta(y_{i,t}\mid x_i,y_{i,<t})$，再乘 advantage：

$$L=-\frac1N\sum_iA_i\,\bar\ell_i+\beta\,\mathrm{KL}(\pi_\theta\|\pi_{\text{ref}})$$

每个 rollout 只做一次 update，strictly on-policy。GRPO 改用第 6 站的 PPO clip，ratio 是 token 级的 $\rho_{i,t}=\pi_\theta(y_{i,t}\mid\cdot)/\pi_{\text{old}}(y_{i,t}\mid\cdot)$，$\pi_{\text{old}}$ 的 log-probability 在 rollout 时存下来：

$$L=-\frac1N\sum_i\frac1{T_i}\sum_t\min\big(\rho_{i,t}A_i,\ \mathrm{clip}(\rho_{i,t},1-\epsilon,1+\epsilon)A_i\big)+\beta\,\mathrm{KL}$$

HW4 用 $\epsilon=0.2$、$\beta=0.05$，同一个 rollout 做两个 PPO epoch。README 里两条 math 命令的 batch（8 个 prompt、每个 8 个回答）、minibatch、gradient accumulation、learning rate $3\times10^{-5}$、KL 系数都一样，algorithm 上的差别只有 GRPO 的两个 epoch 和 clip；GR-REINFORCE 跑 201 步，GRPO 跑 501 步，所以 HW4 让你比较前 200 个 iteration 的曲线。

$1/T_i$ 的作用：handout 说是防止长的 completion 主导 loss。它也有副作用：每个 token 的 weight 是 $A_i/T_i$。两个答错的 completion，$A=-1$，长度 10 和 100，每个 token 分别被推开 $-0.1$ 和 $-0.01$，长的错误答案每个 token 受的惩罚只有十分之一。Dr. GRPO 一文把这叫 response-level length bias：答对时短的回答得到更大的 update，答错时长的回答受罚更轻，policy 于是在答错的回答里偏好更长的。它的修正是把 $1/T_i$ 和上面的 std normalization 都去掉，advantage 只用 $r_{i,j}-\mu_i$，作者说这样回到了 PPO 的 objective，实验里答错的回答长度明显变短。CS285 Spring 2026 的 LLM RL default final project 就让你实现它，starter code 里 `DrGRPO` 的说明是“removes the GRPO sequence-length normalization and std scaling”。

:::wrong Prompt token 也算进 loss 没关系，反正它们的 advantage 都一样
Prompt 不是 policy 的 action，它们的 log-probability 乘上 advantage，会让 model 在答对时提高“生成这段 prompt”的 probability、答错时降低它，学的是和 task 无关的东西。长度上它还会淹没真正的信号：200 个 token 的 prompt 加 20 个 token 的回答，没有 mask 时 loss 里 91% 的 term 落在 prompt 上。HW4 的 checklist 要求只给 completion token 打分、prompt 和 padding 都 mask 掉，debugging tips 说 format copy 上 reward 到第 10 步还没涨，先查 mask 和 logprob 的对齐（position $t-1$ 的 logits 预测 token $t$）。
:::

### KL 用 sample 估

完整的 $\mathrm{KL}(\pi_\theta\|\pi_{\text{ref}})$ 要对整个 vocabulary 求和，每个位置都要两个 model 的完整 distribution，又贵又占 memory。HW4 只在 sample 出来的 token 上估，$\pi_{\text{ref}}$ 的 log-probability 在 rollout 时就算好存下（`ref_logprobs`），update 时只需重算当前 policy 的。记 $\Delta(a)=\log\pi_{\text{ref}}(a)-\log\pi_\theta(a)$，$a\sim\pi_\theta$，三个常见的 estimator：

$$k_1=-\Delta,\qquad k_2=\tfrac12\Delta^2,\qquad k_3=e^\Delta-\Delta-1$$

**$k_1$ unbiased**：$\mathbb E_{\pi_\theta}[-\Delta]=\sum_a\pi_\theta(a)\log\frac{\pi_\theta(a)}{\pi_{\text{ref}}(a)}=\mathrm{KL}$。但它可以是负的，而 KL 不可能为负。

**$k_3$ 也 unbiased**：$\mathbb E_{\pi_\theta}[e^\Delta]=\sum_a\pi_\theta(a)\frac{\pi_{\text{ref}}(a)}{\pi_\theta(a)}=1$，所以 $\mathbb E[k_3]=1+\mathrm{KL}-1=\mathrm{KL}$。$e^\Delta-1$ 这一项 expectation 为 0，加上它不改变 mean，却和 $-\Delta$ 负相关，抵消掉一部分 noise。

**$k_3$ 非负**：$e^x\ge1+x$ 对所有 $x$ 成立，所以 $e^\Delta-\Delta-1\ge0$。

HW4 的 `approx_kl_from_logprobs` 用的就是 $k_3$：先把 $\Delta$ clamp 到 $[-20,20]$ 再取 exp，然后对整个 minibatch 里所有 completion token 取平均（不是先在每个 completion 内平均）。代码注释说 clamp 是为了 numerical stability 和控制 variance：$\Delta$ 大，意味着 sample 到的 token 在 $\pi_\theta$ 下 probability 极小、在 $\pi_{\text{ref}}$ 下却不小，$k_3$ 随 $e^\Delta$ 指数增长，$\Delta=20$ 时已是 $e^{20}\approx4.9\times10^8$，一个 token 就能淹没整个 minibatch 的 estimate。

$k_2$ 不是 unbiased 的，KL 小时 approximately 正确。在一个 50 个 token 的 vocabulary 上实算（$\pi_\theta$ 的 logits 取 $\mathcal N(0,1)$，$\pi_{\text{ref}}$ 的 logits 再加 std 为 $s$ 的扰动，seed 0）：

| 扰动 $s$ | exact KL | $k_1$ 的 std | $k_1<0$ 的比例 | $\mathbb E[k_2]$ | $k_3$ 的 std |
|---|---|---|---|---|---|
| 0.1 | 0.0059 | 0.108 | 49% | 0.0059 | 0.0061 |
| 0.5 | 0.104 | 0.484 | 51% | 0.123 | 0.129 |
| 2.0 | 1.233 | 1.604 | 25% | 2.046 | 1.455 |

两个 policy 接近时（这正是 KL penalty 想维持的情形），$k_3$ 的 std 比 $k_1$ 小 18 倍；$k_1$ 有一半的 sample 是负的。

::fig[cs285-kl] 以 ratio $\pi_{\text{ref}}/\pi_\theta=e^\Delta$ 为横轴，$k_1=-\log(\text{ratio})$ 和 $k_3=\text{ratio}-1-\log(\text{ratio})$。$k_3$ 在 ratio 为 1 处与横轴相切，处处非负。

:::edge 把 $k_3$ 当 loss 求 gradient，得到的是另一个方向的 KL
上面证的是 $k_3$ 的 value unbiased。HW4 把它直接加进 loss 求 gradient，sample $a$ 固定，对 $\theta$ 求导：

$$\nabla_\theta k_3=\nabla_\theta\Big(\frac{\pi_{\text{ref}}(a)}{\pi_\theta(a)}+\log\pi_\theta(a)\Big)=\Big(1-\frac{\pi_{\text{ref}}(a)}{\pi_\theta(a)}\Big)\nabla_\theta\log\pi_\theta(a)$$

对 $a\sim\pi_\theta$ 取 expectation，第一项 $\mathbb E[\nabla\log\pi_\theta]=0$，第二项 $-\sum_a\pi_{\text{ref}}(a)\nabla\log\pi_\theta(a)$，正是 $\nabla_\theta\mathrm{KL}(\pi_{\text{ref}}\|\pi_\theta)$。而 $\nabla_\theta\mathrm{KL}(\pi_\theta\|\pi_{\text{ref}})=\mathbb E_{\pi_\theta}\big[\nabla\log\pi_\theta\cdot\log(\pi_\theta/\pi_{\text{ref}})\big]$，两者一般不相等，只在 $\pi_\theta$ 接近 $\pi_{\text{ref}}$ 时到 first order 一致。两个 policy 不远时这无关紧要；但“penalty 的 value 是 reverse KL”不等于“penalty 的 gradient 在减小 reverse KL”。这一段是自己推的，HW4 没有讨论它。
:::

:::back
PPO clip 见[第 6 站](#trpo)和 [RB4301](../courses/RB4301.html#ac)；$\pi\propto\pi_{\text{ref}}e^{r/\beta}$ 和 SAC 的 $\pi\propto e^{Q/\alpha}$ 是同一个 Lagrangian 的结果，后者在 [RB4301](../courses/RB4301.html#ac)，第 12 站的 AWR 还会再用一次。
:::

:::from
One-step 与 token 级两种看法、value baseline 的两种做法、GRPO 这个名字、reference-model regularization 的两个理由、Bradley–Terry 和 verifier reward 来自 [Spring 2026 Lecture 14](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-14.pdf)（只读到文字，slides 只给了 GRPO 的名字，没有 formula）。Group advantage、两种 loss、KL estimator、reward 的构成、预期的数字和 debugging tips 来自 [HW4 handout](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw4.pdf)。Population std、advantage clip、KL 的 clamp 与平均方式、两条 math 命令的设置来自 [starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026) 的 HW4 代码和 README。两种 bias 的名字和 Dr. GRPO 的修正来自 [Dr. GRPO 论文](https://arxiv.org/html/2503.20783v2) 第 3 节，final project 的 `rl/dr_grpo.py` 是同一件事在课程里的出处。Optimal policy 的推导、mean 含自己时的 $(1-1/G)$、$\sqrt{G-1}$、全相同 group 的 probability、三个 estimator 的数表和 $k_3$ 的 gradient 都是为这一页推导和实算的。
:::

## [mbrl] Model-based RL：planning、model 上的 gradient 与 latent model

:::skip
不在快速路线里；研究方向是 world model 的不要跳。Ensemble、aleatoric 与 epistemic uncertainty、MPC、MBPO 的 short rollout 在 [RB4301 的 mpc 站](../courses/RB4301.html#mpc)已经讲透，这一站只讲 CS285 另外强调的部分。能用例子说明 open-loop plan 为什么吃亏、CEM 为什么受 dimension 限制、对 model 求 gradient 为什么会 explode，以及 latent model 为什么需要 reconstruction，就可以去第 12 站。
:::

### Open-loop plan 即使 model 完美也会吃亏

Lecture 16 先区分两种 plan。Open-loop：在 $t=1$ 就决定整条 action sequence，之后只执行；closed-loop：每一步看到 state 再决定。Deterministic 的 dynamics 下两者一样好；dynamics 有 randomness 时，open-loop 是 suboptimal 的。

最小的例子：第一步不管做什么，nature 以各一半的 probability 把 state 变成 $L$ 或 $R$；第二步选 left 或 right，和 state 一致得 reward 1，否则 0。Open-loop 的 plan 必须在看到 state 之前定下第二步，不管定哪个，expected reward 都是 0.5。Closed-loop 的 policy 看到 state 再选，expected reward 是 1。这里 model 是完美的，差距全部来自“plan 不能对还没发生的 randomness 做反应”。

::fig[cs285-openloop] 同一个 model 上的两种 plan。彩色是实际执行的选择。

:::wrong 只要 model 是对的，optimize 出来的 action sequence 就是 optimal 的
上面的例子 model 完全正确，open-loop 的最好 plan 也只有 0.5，closed-loop 是 1。Optimize 一条 action sequence 和 optimize 一个 policy 是两个问题：前者的 optimum 是对所有可能的未来取平均后最好的那一条，后者可以对每个未来各自选。MPC 每一步重新 plan，用 replanning 把一部分 closed-loop 的好处找回来（见 [RB4301](../courses/RB4301.html#mpc)）。
:::

### Random shooting 与 CEM：维数是上限

Lecture 16 把 planning 当作对 action sequence $A=(a_1,\dots,a_H)$ 的 black-box optimization。Random shooting 随机抽 $N$ 条，挑最好的；cross-entropy method（CEM）用一个 Gaussian 抽，留下 cost 最低的 elite，用 elite 的 mean 和 std 重新 fit Gaussian，重复几轮。

例子：$s_0=0$，$s_t=s_{t-1}+a_t$，cost 是 $\sum_t(s_t-3)^2$。Optimum 是 $a_1=3$，其余为 0，cost 为 0。初始 Gaussian 的 std 都是 2。$H=2$ 时 CEM 每轮 100 个 sample、留 10 个 elite（seed 0），mean 的轨迹：

$$(0,0)\to(2.48,\ 0.64)\to(2.92,\ 0.14)\to(2.97,\ 0.02)\to(2.997,\ 0.003)$$

std 从 2 降到 0.03 左右。

::fig[cs285-cem] $H=2$ 时 cost 的 contour 和 CEM 前四轮的 Gaussian（mean 和 2 倍 std 的范围）。每一轮的 Gaussian 都缩到上一轮最好的那一小块里。

同样 500 次 cost evaluation，比较 random shooting（一次抽 500 条）和 CEM（5 轮、每轮 100 条），各跑 20 个 seed 取 median：

| Horizon $H$ | 2 | 10 | 30 |
|---|---|---|---|
| Random shooting 的最好 cost | 0.048 | 10.3 | 95.5 |
| CEM 的最好 cost | 0.000 | 2.2 | 52.8 |

$H$ 大了两者都远离 0。Lecture 16 把这列为 CEM 的主要缺点（“harsh dimensionality limit”），另一个缺点是它只能做 open-loop plan；优点是简单、可以大规模并行。Lecture 8 提到更复杂的 CMA-ES 大约能用到 40 维。

### 对 model 求 gradient：Jacobian 连乘

Model 是 network，可导，为什么不直接把 return 对 action 或 policy parameter 求 gradient？Lecture 16 比较了 policy gradient 和 pathwise（backprop through the model）gradient。Pathwise gradient 要穿过整条 rollout：

$$\frac{\partial s_T}{\partial a_1}=\frac{\partial f}{\partial s}\Big|_{T-1}\cdots\frac{\partial f}{\partial s}\Big|_{2}\ \frac{\partial f}{\partial a}\Big|_{1}$$

1 维 linear model $s_{t+1}=cs_t+a_t$ 上它是 $c^{T-1}$：

| $c$ | $T=10$ | $T=50$ | $T=100$ |
|---|---|---|---|
| 1.1 | 2.36 | 106.7 | 12,528 |
| 0.9 | 0.39 | 0.0057 | $3.0\times10^{-5}$ |

和 RNN 的 backpropagation through time 是同一个现象，区别在于 RNN 的 dynamics 可以设计成好求 derivative 的（LSTM），环境的 dynamics 是给定的。Policy gradient 不对 dynamics 求 derivative，没有这个连乘，代价是 variance；Lecture 16 引 Parmas 等（2018）说，sample 够多时它反而可能更稳。

另一条出路是 rollout 短。Short rollout 从真实 data 的 state 出发、只在 model 里走几步，error 累积的推导和 MBPO 在 [RB4301](../courses/RB4301.html#mpc)。Lecture 16 列了几种用 model 加速 off-policy RL 的做法，MBPO 在 RB4301 讲过；Model-Based Value Expansion（MVE）值得和[第 5 站](#q)的 n-step 对照：它在 model 里按当前 policy 走 $k$ 步，再接 $\gamma^kQ(s_{t+k},a_{t+k})$。第 5 站的 n-step target 偏向 behavior policy，是因为中间的 reward 来自 buffer 里旧 policy 的 action；在 model 里展开时中间的 action 由当前 policy 选，这个 bias 没有了，换成了 model 的 error。

### Latent space model

Observation 是 image 时，直接在 pixel 上预测下一帧又贵又难，Lecture 15 说直接在 pixel 上 plan 非常困难。办法是学一个 latent state $z$：encoder $q(z_t\mid o_t)$、latent dynamics $p(z_{t+1}\mid z_t,a_t)$、decoder $p(o_t\mid z_t)$、reward model $p(r_t\mid z_t)$，一起 train：

$$\max\ \sum_t\mathbb E\Big[\log p(z_{t+1}\mid z_t,a_t)+\log p(o_t\mid z_t)+\log p(r_t\mid z_t)\Big]$$

Slide 问：deterministic encoder 为什么可能是个坏主意？看去掉 decoder 那一项会怎样。只 train latent dynamics 和 reward，loss 是 $\|e(o_{t+1})-f(e(o_t),a_t)\|^2$ 加上 reward 的 error。令 encoder $e(o)\equiv0$、dynamics $f\equiv0$，dynamics loss 恰好为 0，不管 data 是什么。Encoder 把一切都映到同一个点，dynamics 就“完美”了，代价只是 reward 预测得差一些。Reconstruction 项 $\log p(o_t\mid z_t)$ 要求 $z$ 能还原 observation，排除了这种 collapse。Lecture 16 说很多实用的方法用 stochastic encoder 或完整的 smoothing posterior，尤其在 partially observed 的问题里；这需要[第 7 站](#vi)的 variational inference：state space model 的 prior、decoder、encoder 各是什么，那里有答案。学好的 latent 可以直接给 actor-critic 用，在 replay buffer 上 train。

:::back
CEM、ensemble、MPC、MBPO 和 model error 的累积在 [RB4301 的 mpc 站](../courses/RB4301.html#mpc)；n-step 的 bias 在[第 5 站](#q)。
:::

:::from
Open-loop 与 closed-loop、random shooting、CEM 的优缺点、其他 planning 方法、policy gradient 与 pathwise gradient 的比较、short rollout、Dyna、MBA/MVE/MBPO、latent space model 的组成和“deterministic encoder 为什么是坏主意”，来自 [Spring 2026 Lecture 16](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-16.pdf)；distributional shift、uncertainty、ensemble 的部分来自 [Lecture 15](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-15.pdf)，已在 RB4301 讲过。两讲只读到文字：open-loop 一页只有“why is this suboptimal?”这个问题，pathwise gradient 的式子、MVE 的具体做法、latent model 的 training objective 都在图里没有读到（slide 只列出 MVE 是 Feinberg 等 2018、只问“How to train?”）。抛硬币的例子、CEM 的 mean 变化和对比表（20 个 seed 的 median）、Jacobian 的数表、MVE 的做法和它与 n-step 的对照、latent model 的 objective、collapse 的论证是为这一页按自己的知识写的。
:::

## [offline] Offline RL：OOD action、policy constraint、IQL、CQL 与 FQL

:::skip
快速路线必读，HW5 依赖它，也是“用固定的 demonstration 和 rollout data 做 post-training”的理论基础。能用 linear Q 的例子说明 Q-learning 在 data 外的 max 会怎样、由 KL constraint 推出 AWR、算出 expectile 怎样趋向 in-support 的 max，并说出 FQL 为什么要 distill，就可以去第 13 站。CQL、offline 到 online、model-based offline RL 三个小节是 Lecture 18 的后半，HW5 不考，快速路线可以先跳。
:::

### 只有 data，不能试

Offline RL 只有一个固定的 dataset $\mathcal D$，由某个 behavior policy $\pi_\beta$（人、旧的 controller、以前的 RL run）收集，training 期间不能再和环境交互。Lecture 17 说它可能超过 data 里最好的 trajectory，靠三件事：从质量参差的 data 里挑出好的部分；generalization；以及 stitching，把不同 trajectory 里好的片段接起来。例如 data 里有一条 A 到 B、一条 B 到 C，没有 A 到 C；BC 只能模仿其中某一条，value-based 的方法通过 B 处的 value 把两段接上。

难处是 counterfactual query。Policy improvement 要问“如果在这里做一个 data 里没有的 action，会怎样”，online RL 可以去试，offline 只能靠 Q-function 外推。

### Q-learning 在 data 外取 max

把这件事算出来。一个 state，自己转回自己，$\gamma=0.9$；action $a\in\{0,1,\dots,9\}$；dataset 里只有 $a=0$（reward 0）和 $a=1$（reward 1）。Q-function 是 linear 的，$Q(a)=w_0+w_1a$。Fitted Q-iteration 每轮的 target 是 $y(a)=r(a)+\gamma\max_{a'\in\{0..9\}}Q(a')$，在两个 data point 上 fit。两个 target 共用同一个 max，所以 fit 的结果是 $w_1=y(1)-y(0)=1$，$w_0=y(0)=\gamma\max Q=\gamma(w_0+9w_1)$：

| 第几轮 | 1 | 2 | 3 | 5 | 10 | 20 | 60 |
|---|---|---|---|---|---|---|---|
| $Q(9)$ | 9.0 | 17.1 | 24.4 | 36.9 | 58.6 | 79.1 | 89.8 |
| $Q(1)$ | 1.0 | 9.1 | 16.4 | 28.9 | 50.6 | 71.1 | 81.8 |

Fixed point 是 $w_0=9\gamma/(1-\gamma)=81$，$Q(9)=90$。Greedy policy 选 action 9，它从未出现在 data 里。如果 action 9 的真实 reward 是 0，按它行动得到的 return 是 0；而只在 data 的 action 里取 max（把 $\max$ 限制在 $\{0,1\}$），fixed point 是 $w_0=\gamma(w_0+1)$，即 $w_0=9$、$Q(1)=10$，正好是一直选 action 1 的真实 return。

Online 时这不是问题：policy 去试 action 9，拿到 0，Q 被纠正。Offline 时没有这一步，max 不断地挑 extrapolation 最乐观的地方，bootstrapping 再把它传回所有 state。Lecture 17 有一页“An example with soft actor-critic”：横轴是 data 的数量（log scale），一条线是 policy 实际做得多好，一条是它的 Q 值“认为”自己多好，slide 标着“massive overestimation”。

::fig[cs285-ood] 动图，和开头那张相同。Linear Q-function 在两个 data point 上 fit，max 取在 data 之外的 $a=9$。看右边的读数和表对上：前几轮每轮涨 7 到 8，越往后涨得越慢，60 轮后整条 line 抬到 81 到 90；只在 data 的 action 上取 max（黑线），$Q(1)$ 停在真实值 10。

:::wrong Data 够多，overestimation 自然会消失
上面的例子里两个 data point 的 target 是 exact 的，没有任何 sampling noise，Q 照样涨到 90。再多 $a=0,1$ 的 data 也只是让这两个点 fit 得更准，丝毫不约束 $a=9$ 处的 extrapolation。Lecture 17 说 sampling error 和 function approximation error 在普通 RL 里就有，offline 时变得严重得多，因为没有新 data 来纠正。
:::

Lecture 17 列了对付它的三条原则，Lecture 18 开头再列一遍，然后逐条展开：policy constraint（“train the policy so that it stays close to data”）；pessimism（“train the Q-function so that it doesn't overestimate”，代表是 CQL）；以及“set up the whole algorithm to avoid out-of-sample actions”（代表是 IQL）。HW5 的三个 algorithm 分别属于第一条、第三条，以及第一条的一个更好的实现；CQL 不在作业里，下面单独讲。

### Policy constraint：BC 项

HW5 的 SAC+BC 在 actor loss 里加一个 behavioral cloning 项：

$$L(\pi)=\mathbb E\Big[-\tfrac12\sum_iQ_i(s,a^\pi)+\alpha\,\tfrac1{|\mathcal A|}\|a-a^\pi\|^2+\beta\log\pi(a^\pi\mid s)\Big]$$

$a$ 是 dataset 里的 action，$a^\pi$ 是 reparameterized sample。$\alpha$ 大，policy 贴着 data；$\alpha$ 小，policy 去追 Q。HW5 说 $\alpha$ 是最敏感的 hyperparameter，要逐个 task 调。BC 项对 action 维取 mean，如果写成 sum，等效的 $\alpha$ 就乘了 $|\mathcal A|$，handout 给的 grid 就对不上了。

Lecture 18 把这类做法叫 explicit policy constraint：在 actor 的 objective 里加一项到 behavior policy 的 divergence，命名常是“[method]+BC”（DDPG+BC、TD3+BC、SAC+BC）。Slide 的评价是“generally not the best way to fix the problem, but can work well if done right”。它只在每个 state 上各自约束 actor：$Q$ 里没有任何“离 data 多远”的信息，所以 actor 在 $s$ 处挑 action 时，不知道这个 action 会不会把它带到一个将来不得不偏离 data 的 state。Lecture 18 接着给出第二种 explicit constraint，把 divergence 放进 reward：$\tilde r(s,a)=r(s,a)-\beta\,D\big(\pi(\cdot\mid s),\pi_\beta(\cdot\mid s)\big)$，于是 critic 学到的 value 也会为将来的偏离付出代价（slide：“also accounts for future divergence”），代价是要先估出 $\pi_\beta$，通常配合 reverse KL 和 MaxEnt RL（BRAC 一类方法）。

“贴着 data”用什么量？Lecture 17 和 Lecture 18 都比较了两个方向的 KL。Behavior 是两个 mode 的 mixture $\tfrac12\mathcal N(-1,0.1^2)+\tfrac12\mathcal N(1,0.1^2)$，用一个 Gaussian 去 fit：最小化 $\mathrm{KL}(\pi_\beta\|\pi)$（mode covering）得到 moment matching 的 $\mathcal N(0,1.005^2)$，mean 落在两个 mode 中间 behavior density 几乎为 0 的地方；最小化 $\mathrm{KL}(\pi\|\pi_\beta)$（mode seeking）只盖住一个 mode。Lecture 17 说真正想要的是 support constraint：只禁止 behavior policy 不可能做的 action，在 data 支持的范围内随便选。它很难直接实现。MSE 形式的 BC 项和 forward KL 一样会把 unimodal 的 policy 拉向两个 mode 的中间，这是 FQL 要解决的问题。

### AWR：只在 dataset action 上做 weighted maximum likelihood

另一种实现 constraint 的办法不显式惩罚，而是把 constraint 问题解出来，Lecture 18 叫它 implicit policy constraint：optimal 的 constrained policy“straightforward to show via duality”，再“approximate via weighted max likelihood”。对每个 $s$：

$$\max_\pi\ \mathbb E_{a\sim\pi}\big[A(s,a)\big]\qquad\text{subject to}\qquad\mathrm{KL}\big(\pi(\cdot\mid s)\,\|\,\pi_\beta(\cdot\mid s)\big)\le\epsilon$$

这和第 10 站的 KL-regularized objective 是同一个形式（$A$ 代替 $r$，$\pi_\beta$ 代替 $\pi_{\text{ref}}$，Lagrange multiplier $\lambda$ 代替 $\beta$），optimum 是

$$\pi^*(a\mid s)=\frac1{Z(s)}\pi_\beta(a\mid s)\exp\big(A(s,a)/\lambda\big)$$

$\pi_\beta$ 不知道，但不需要知道。把 $\pi^*$ project 到 parametric 的 $\pi_\phi$ 上，最小化 $\mathrm{KL}(\pi^*\|\pi_\phi)$，去掉和 $\phi$ 无关的 $\mathbb E_{\pi^*}[\log\pi^*]$：

$$\begin{aligned}\arg\min_\phi\mathrm{KL}(\pi^*\|\pi_\phi)&=\arg\max_\phi\mathbb E_{a\sim\pi^*}\big[\log\pi_\phi(a\mid s)\big]\\&=\arg\max_\phi\mathbb E_{a\sim\pi_\beta}\Big[\frac{\exp(A(s,a)/\lambda)}{Z(s)}\log\pi_\phi(a\mid s)\Big]\end{aligned}$$

最后一步是 importance sampling：$\pi^*/\pi_\beta=\exp(A/\lambda)/Z$，$\pi_\beta$ 消失了。$a\sim\pi_\beta$ 就是 dataset 里的 action。这是 advantage-weighted regression（AWR）：对 dataset 的 action 做 maximum likelihood，advantage 大的 weight 大。Actor 从不在 data 外的 action 上取值。HW5 的 IQL actor loss 就是它，$\alpha=1/\lambda$ 叫 inverse temperature，weight clip 在 $M=100$：

$$L(\pi)=\mathbb E_{(s,a)\sim\mathcal D}\Big[-\min\big(\exp(\alpha A(s,a)),\,M\big)\log\pi(a\mid s)\Big]$$

$\alpha=0$ 是纯 BC，$\alpha$ 很大时只模仿 advantage 最大的那些 action。Lecture 18 的“AWAC-like algorithm”就是两步交替：用 dataset 的 $(s,a,r,s')$ 和当前 policy 的 $a'\sim\pi$ fit $Q$，再用上式 update actor。Slide 留了一个问题：这样做还有什么毛病？答案在 critic：$Q$ 的 target 里 $a'$ 由 $\pi$ 抽出，$\pi$ 偏离 data 的地方仍然要 query OOD action。下面的 IQL 就是为了连这一步也去掉。

### IQL：用 expectile 代替 max

AWR 需要 $A=Q-V$，而 Q 本身的 target 里有 $\max_{a'}Q(s',a')$，又回到了 OOD action。Implicit Q-learning（IQL）把 max 换掉：$V(s)$ 不对所有 action 取 max，而是对 dataset 里出现过的 action 的 $Q(s,a)$ 取一个 upper expectile。

Random variable $X$ 的 $\tau$-expectile $m_\tau$ 是 asymmetric squared loss 的 minimizer：

$$m_\tau=\arg\min_m\mathbb E\big[\ell_\tau^2(X-m)\big],\qquad\ell_\tau^2(u)=\big|\tau-\mathbf 1(u<0)\big|\,u^2$$

$\tau=0.5$ 是普通的 MSE，$m$ 是 mean；$\tau>0.5$ 时，$X$ 高于 $m$ 的部分被加重。对 $m$ 求 derivative 令其为 0：

$$\tau\,\mathbb E\big[(X-m)_+\big]=(1-\tau)\,\mathbb E\big[(m-X)_+\big]$$

算一次。某个 state 上 dataset 里的 action 对应的 Q 值是 $0,1,2,5$，频率 $0.4,0.3,0.2,0.1$。$\tau=0.9$ 时试 $m=2.889$：左边 $0.9\times0.1\times(5-2.889)=0.190$，右边 $0.1\times(0.4\times2.889+0.3\times1.889+0.2\times0.889)=0.1\times1.900=0.190$，相等。

| $\tau$ | 0.5 | 0.7 | 0.9 | 0.99 | 0.999 |
|---|---|---|---|---|---|
| $m_\tau$ | 1.200 | 1.714 | 2.889 | 4.648 | 4.962 |

$\tau\to1$ 时趋向 5，即 data 里的 max。IQL 论文的 Lemma 1：bounded 的 random variable，$\tau\to1$ 时 expectile 趋向它的 supremum。用在 Q 上，$V(s)$ 趋向“data 支持的 action 里最好的那个”的 value，整个过程只在 dataset 的 $(s,a)$ 上算 loss。上面 linear Q 的例子里，$V$ 取 $\{Q(0),Q(1)\}$ 的高 expectile，fixed point 就是 $Q(1)=10$ 那一个。

::fig[cs285-expectile] 这个四点 distribution 的 $m_\tau$ 随 $\tau$ 的变化：从 mean 1.2 出发，单调上升，趋向 data 里的最大值 5，从不超过它。

HW5 的三个 loss（$\tau=0.9$，两个 target Q 取 min）：

$$L(V)=\mathbb E\big[\ell_\tau^2\big(\min_i\bar Q_i(s,a)-V(s)\big)\big],\qquad L(Q)=\sum_i\mathbb E\big[\big(Q_i(s,a)-r-\gamma V(s')\big)^2\big]$$

加上上面的 AWR actor loss。HW5 的 IQL 默认 `expectile=0.9`、`alpha=10`，和 IQL 论文 Appendix B 给 AntMaze 的 $\tau=0.9$、$\beta=10$ 相同（论文在 MuJoCo locomotion 上用 $\tau=0.7$、$\beta=3$）。

为什么要分开 $V$ 和 $Q$，不直接对 TD target 取 expectile？IQL 论文第 4.2 节的解释：那样做会把 environment dynamics $s'\sim p(\cdot\mid s,a)$ 的 randomness 也带进来，一个大的 target 不一定说明存在一个能拿到它的 action，可能只是一次“lucky”的 transition。用上面的例子算一下差多少：设某个 $(s,a)$ 以 0.9 的 probability 转到 value 为 0 的 state、以 0.1 转到 value 为 10 的 state，reward 为 0，$\gamma=1$。真正的 $Q(s,a)=0.9\times0+0.1\times10=1$。对这两个 target 取 $\tau=0.9$ 的 expectile，first-order condition 是 $0.9\times0.1\times(10-m)=0.1\times0.9\times m$，得 $m=5$，是真值的 5 倍，而这个 $(s,a)$ 上根本没有可选的东西。$Q$ 用普通 MSE 对 $s'$ 求平均，$V$ 的 expectile 只作用在 action 的选择上，两种 randomness 就分开了。Lecture 18 的说法是 $V$ 的 distribution“induced by actions only”，value 的 update 因此“without ever risking out-of-distribution actions”。

### CQL：直接把 Q 往下压

:::skip
HW5 不考 CQL。跳过它会少掉第二条原则的具体做法，以及“pessimism 在最简单的情形下就是一个 policy constraint”这个对应；下一小节的 offline 到 online 会用到这里的 penalty 公式。
:::

第二条原则不去管 policy，而是让 Q 本身不 overestimate。Lecture 18 的 CQL 分两步。第一步在 Q 的 regression loss 上加一项“push down big Q-values”的 term（CQL 论文 Eq. 1）：

$$\hat Q^{k+1}=\arg\min_Q\ \alpha\,\mathbb E_{s\sim\mathcal D,a\sim\mu(a\mid s)}\big[Q(s,a)\big]+\tfrac12\,\mathbb E_{(s,a)\sim\mathcal D}\Big[\big(Q(s,a)-\hat{\mathcal B}^\pi\hat Q^k(s,a)\big)^2\Big]$$

$\mu$ 选在 Q 大的地方，实际就取当前 policy $\pi$。论文的 Theorem 3.1 证明这样得到的 $\hat Q$ 对每一个 $(s,a)$ 都是 $Q^\pi$ 的 lower bound，但太保守了：data 里的 action 也被一起压低。第二步（Eq. 2）再减去一项，“push up on $(s,a)$ samples in data”：

$$\begin{aligned}\hat Q^{k+1}=\arg\min_Q\ &\alpha\Big(\mathbb E_{s\sim\mathcal D,a\sim\mu}\big[Q(s,a)\big]-\mathbb E_{(s,a)\sim\mathcal D}\big[Q(s,a)\big]\Big)\\&+\tfrac12\,\mathbb E_{(s,a,s')\sim\mathcal D}\Big[\big(Q(s,a)-\hat{\mathcal B}^\pi\hat Q^k(s,a)\big)^2\Big]\end{aligned}$$

这时 $\hat Q$ 不再逐点小于 $Q^\pi$，Theorem 3.2 换成了对 value 的保证：$\mu=\pi$ 时 $\hat V^\pi(s)\le V^\pi(s)$，前提是 $\alpha$ 大到能盖住 sampling error 那一项。

**Tabular 时它在做什么。** 每个 $(s,a)$ 是一个独立的 parameter。记 data 里 state 的 distribution 为 $d(s)$、behavior policy 为 $\pi_\beta$，上式对 $Q(s,a)$ 求 derivative 令其为 0：

$$\alpha\,d(s)\big(\mu(a\mid s)-\pi_\beta(a\mid s)\big)+d(s)\,\pi_\beta(a\mid s)\big(Q(s,a)-\hat{\mathcal B}^\pi\hat Q^k(s,a)\big)=0$$

两边除以 $d(s)\pi_\beta(a\mid s)$：

$$\hat Q^{k+1}(s,a)=\hat{\mathcal B}^\pi\hat Q^k(s,a)-\alpha\Big(\frac{\mu(a\mid s)}{\pi_\beta(a\mid s)}-1\Big)$$

这正是 CQL 论文里的 tabular update。$\mu$ 比 $\pi_\beta$ 更爱选的 action 被扣分，$\mu$ 比 $\pi_\beta$ 更少选的 action 反而加分；$\mu=\pi_\beta$ 时什么也不改。

**一个 state 的例子。** 一个 state，自己转回自己，$\gamma=0.9$，三个 action。Data 里 $\pi_\beta=(0.7,\ 0.25,\ 0.05)$，真实 reward 是 $(0,\ 1,\ 0.5)$；action 2 在 data 里很少，它的几个 sample 恰好偏高，估出的 $\hat r=(0,\ 1,\ 2)$。Data 里最好的 policy 是一直选 action 1，return $1/(1-\gamma)=10$。

取 $\mu=\pi$，fixed point 满足 $\hat Q(a)=\hat r(a)-\alpha\big(\pi(a)/\pi_\beta(a)-1\big)+\gamma\hat V$，$\hat V=\sum_a\pi(a)\hat Q(a)$。按 $\pi(a)$ 加权求和：

$$\hat V=\sum_a\pi(a)\hat r(a)-\alpha\Big(\sum_a\frac{\pi(a)^2}{\pi_\beta(a)}-1\Big)+\gamma\hat V\qquad\Longrightarrow\qquad\hat V=\frac{\mathbb E_\pi[\hat r]-\alpha\,\chi^2(\pi\|\pi_\beta)}{1-\gamma}$$

其中用到了 $\sum_a\pi^2/\pi_\beta-1=\sum_a(\pi-\pi_\beta)^2/\pi_\beta$（展开右边：$\sum\pi^2/\pi_\beta-2\sum\pi+\sum\pi_\beta$），这就是 $\chi^2(\pi\|\pi_\beta)$。在这个例子里，CQL 的 pessimism 恰好是一个 policy constraint：每个 policy 的 value 被扣掉它离 $\pi_\beta$ 的 $\chi^2$ divergence，$\pi=\pi_\beta$ 时一分不扣。

在所有 policy 里挑 $\hat V$ 最大的，就是最大化 $\sum_a\pi(a)\hat r(a)-\alpha\sum_a\pi(a)^2/\pi_\beta(a)$，约束 $\sum_a\pi(a)=1$、$\pi\ge0$。对 $\pi(a)$ 求 derivative，加 Lagrange multiplier $\lambda$：$\hat r(a)-2\alpha\pi(a)/\pi_\beta(a)=\lambda$，所以

$$\pi(a)=\max\Big(0,\ \frac{\pi_\beta(a)\,\big(\hat r(a)-\lambda\big)}{2\alpha}\Big)$$

$\lambda$ 由和为 1 定出。以 $\alpha=0.15$ 为例：先猜 action 0 的 probability 为 0，则 $\frac{0.25(1-\lambda)+0.05(2-\lambda)}{0.3}=1$，$0.35-0.3\lambda=0.3$，$\lambda=0.167$；$\pi(1)=0.25\times0.833/0.3=0.694$，$\pi(2)=0.05\times1.833/0.3=0.306$；action 0 的式子给出负数，确实为 0。这个 policy 的真实 return 是 $(0.694\times1+0.306\times0.5)/0.1=8.47$。

| $\alpha$ | $\pi$ | $\hat V$ | 真实 return |
|---|---|---|---|
| 0（普通 Q-learning） | $(0,\ 0,\ 1)$ | 20.00 | 5.00 |
| 0.05 | $(0,\ 0.417,\ 0.583)$ | 12.58 | 7.08 |
| 0.15 | $(0,\ 0.694,\ 0.306)$ | 8.86 | 8.47 |
| 0.3 | $(0.292,\ 0.521,\ 0.188)$ | 6.23 | 6.15 |
| 1 | $(0.578,\ 0.331,\ 0.091)$ | 4.32 | 3.77 |
| $\infty$ | $\pi_\beta$ | 3.50 | 2.75 |

::fig[cs285-cql] 同一份 data 下，CQL 的 $\alpha$ 从 0 到 $\infty$ 时 policy 的变化。$\alpha$ 小，policy 追着 sample 偏高的 action 2；$\alpha$ 大，policy 退回 $\pi_\beta$，连没用的 action 0 都选；真实 return 在中间最高。

读这张表有三点。$\alpha=0$ 时 greedy 地选 action 2，$\hat V=20$，真实只有 5，这就是 offline 的 overestimation。$\alpha$ 越大，policy 越贴近 $\pi_\beta$，$\alpha\to\infty$ 时退化成 behavior cloning，真实 return 只剩 2.75；真实 return 在 $\alpha$ 取中间值时最高，和 HW5 里“$\alpha$ 是最敏感的 hyperparameter”是同一件事。表里每一行的 $\hat V$ 都还高于真实 return：action 2 的 reward 估高了 1.5，被选中的 policy 恰恰偏爱它。Theorem 3.2 的 lower bound 要求 $\alpha$ 盖住 sampling error，而 policy 又专挑 sampling error 偏乐观的地方，在 data 很少的 action 上这个要求很难满足。

上面是“在所有 policy 里挑 $\hat V$ 最大的”。CQL 实际是 actor-critic 交替：actor 对固定的 $\hat Q$ 做 improvement。交替到不动时，被选中的 action 的 $\hat Q(a)=\hat r(a)-\alpha\pi(a)/\pi_\beta(a)+\text{const}$ 必须相等，这和上面的 stationarity condition 只差把 $2\alpha$ 换成 $\alpha$：actor-critic 用 $\alpha$ 时停在表里 $\alpha/2$ 那一行的 policy，表的形状不变。

实用的版本是 CQL($\mathcal H$)（论文 Eq. 4）：push down 的那一项取成 $\log\sum_a\exp Q(s,a)$，即对一个 maximum entropy 的 $\mu$ 取 soft maximum，continuous action 时用 sample 估。论文还证明了“gap-expanding”：$\alpha$ 够大时，$\hat Q$ 在 $\pi_\beta$ 和 $\mu$ 上的 expectation 之差比真实 Q 的差更大，data 外的 action 不会显得比 data 里的好。

### 从 offline 到 online

:::skip
HW5 不做 online fine-tuning，Spring 2026 的“Offline-to-Online RL”default final project 做。跳过它会少掉 fine-tuning 一开始那段 performance 下跌的原因。
:::

实际用法常常是先用 offline data pretrain，再让 agent 和环境交互 fine-tune。Lecture 18 的“What's the problem?”一页拿 CQL 举例：第 50k 步切到 online 之后，performance 先掉下去再慢慢爬回来，slide 的说法是 offline 阶段“underestimating too much”，online 一开始的那段时间都在“recalibrating the value function”，白白用来恢复 offline 已经有的 performance；“Different offline RL algorithms have different versions of this problem.”

上一小节的公式说明了 underestimation 有多大、为什么会被慢慢收回。$\alpha=0.15$ 时 policy 是 $(0,\ 0.694,\ 0.306)$，CQL 对它的 value 扣掉 $\alpha\chi^2(\pi\|\pi_\beta)/(1-\gamma)=0.15\times2.796/0.1=4.19$。Online 阶段 buffer 里不断加入这个 policy 自己的 data，buffer 的 behavior distribution 变成 mixture $w\pi_\beta+(1-w)\pi$，$w$ 是 offline data 所占的比例：

| Offline data 占 buffer 的比例 $w$ | 1 | 0.5 | 0.2 | 0.1 |
|---|---|---|---|---|
| Buffer 的 behavior distribution | $(0.7,\ 0.25,\ 0.05)$ | $(0.35,\ 0.472,\ 0.178)$ | $(0.14,\ 0.606,\ 0.254)$ | $(0.07,\ 0.65,\ 0.28)$ |
| $\chi^2(\pi\|\text{buffer})$ | 2.796 | 0.546 | 0.163 | 0.075 |
| CQL 扣掉的 value | 4.19 | 0.82 | 0.25 | 0.11 |

Value 要从被压低 4.19 的位置一路涨回来，critic 在涨回来之前给 actor 的信号是错的。把 $\alpha$ 一下子调成 0 也不行，那就回到了 $\alpha=0$ 那一行的 overestimation。

Lecture 18 介绍的 simple baseline 来自 RLPD（Ball、Smith、Kostrikov、Levine 2023），slide 称它“embarrassingly effective”。它干脆不做 offline pretraining，从零开始跑 online off-policy RL，只是把 offline data 放进来，三个设计：

1. **Symmetric sampling。** 每个 batch 一半从 offline data 抽，一半从 online 的 replay buffer 抽。
2. **LayerNorm。** Critic 最后一层之前加 LayerNorm。先不算它可学的 scale 和 shift，LayerNorm 的输出 $h$ 满足 $\|h\|_2=\sqrt d$（$d$ 是维数，每一维减 mean 除 std 之后平方和为 $d$），所以 $|Q|=|w^\top h|\le\|w\|_2\sqrt d$，data 外的 action 也不可能让 $Q$ 涨过这个界。对照本站开头的 linear Q：feature 是 $a$ 本身，没有上界，$Q(9)$ 才会一路涨到 90。
3. **Large ensemble 和高 UTD。** 用多个 critic，每个 environment step 做多次 update。

Lecture 18 的最后一点：actor 换成 diffusion 或 flow matching 往往让 offline 到 online 更顺利，slide 的推测是这类 actor 不需要靠 RL update 去捕捉多个 mode。列出的例子有 IDQL、FQL（下一小节），以及 diffusion steering（Wagenmaker 等）：在 diffusion policy 的 latent noise 空间里做 online RL，不管 noise 怎么选，decode 出来的 action 都在 data 的 distribution 里。Final project 的 starter code 里就有 SAC+BC、FQL、IFQL、QSM、DSRL 五个 agent。

### Model-based offline RL

:::skip
不在 HW5 里。跳过它会少掉“model 的 uncertainty 怎样当 penalty 用”。
:::

[第 11 站](#mbrl)的 planner 会去 model 错的地方，offline 时没有新 data 来纠正，问题更严重。Lecture 18 的 MOPO 在 model 生成的 reward 上减一项 uncertainty penalty：

$$\tilde r(s,a)=r(s,a)-\lambda\,u(s,a)$$

$u$ 要满足 $d_{\mathcal F}\big(\hat T(s,a),T(s,a)\big)\le u(s,a)$，即 model 的 transition 和真实 transition 之间的差距处处不超过它。MOPO 论文的 Theorem 4.4 证明，在 $\tilde r$ 定义的 model MDP 里求出的 policy $\hat\pi$ 满足

$$\eta_M(\hat\pi)\ \ge\ \sup_\pi\big\{\eta_M(\pi)-2\lambda\,u(\pi)\big\}$$

$\eta_M$ 是真实环境里的 return，$u(\pi)$ 是 $\pi$ 在 model 里走过的地方的平均 uncertainty。右边对任何 $\pi$ 成立：$\hat\pi$ 至少和“真实 return 高、又只走 model 有把握的地方”的那个 policy 差不多好，例如 behavior policy 本身，它走的正是 data 覆盖的地方。实际的 $u(s,a)$ 取 model ensemble 里各个 model 预测的 std 的最大值，ensemble 在 [RB4301 的 mpc 站](../courses/RB4301.html#mpc)讲过；取 max 而不取 mean 是为了更保守。

COMBO 把 CQL 用到 model 上：slide 的原话是“just like CQL minimizes Q-value of policy actions, we can minimize Q-value of model state-action tuples”，push down 的对象换成 model rollout 产生的 $(s,a)$，push up 的仍是真实 data。它不需要显式的 uncertainty estimate。MOReL（Kidambi 等）是和 MOPO 同期的做法。

### FQL：flow policy 负责 BC，one-step policy 负责 Q

回到 BC 项的问题：behavior 是 multimodal 的，Gaussian policy 的 MSE 项把它拉向两个 mode 的中间。第 1 站已经有了能表示 multimodal behavior 的 flow policy $\pi_v$。直接在 SAC+BC 里用它（HW5 称之为 FBRAC）要让 $Q$ 的 gradient 穿过 10 步 Euler 的 ODE solver，相当于 backpropagation through time，FQL 论文说这既不稳定又贵。

FQL 的办法是两个 policy 分工。$\pi_v$ 只做 flow matching 的 BC（第 1 站的 loss，对 action 维取 mean）。另一个 one-step policy $\pi_\omega(s,z)$ 把 noise $z$ 一步映成 action，它的 loss 是

$$L(\pi_\omega)=\mathbb E\Big[-\tfrac12\sum_iQ_i\big(s,\pi_\omega(s,z)\big)+\frac{\alpha}{|\mathcal A|}\big\|\pi_\omega(s,z)-\pi_v(s,z)\big\|^2\Big]$$

$\pi_v(s,z)$ 是同一个 $z$ 经过 10 步 Euler 得到的 action，distillation 项不对它求 gradient，$Q$ 项只对 $\pi_\omega$ 做一次普通的 backward pass。关键在 distillation 是按 $z$ 对齐的：在第 1 站 $\pm1$ 的例子里，$\pi_v(s,z)$ 对 $z>0$ 给出 $+1$ 附近、对 $z<0$ 给出 $-1$ 附近，所以 $\pi_\omega$ 学的是“正的 $z$ 去右边的 mode、负的 $z$ 去左边的 mode”，每个 target 都在 data 的 support 里，不会被拉到中间；$Q$ 项再在各个 mode 内往高处推。Critic 的 target 和 evaluation 都用 $\pi_\omega$，FQL 论文说 test 时部署的就是 one-step policy；所有任务都用 10 步 Euler，论文的 ablation 说只要步数不太少，结果对它不敏感。论文 Table 2（OGBench，每个环境 5 个 task 的平均 success rate，%）：antsoccer-arena 上 FQL 60、IQL 8、ReBRAC 0、直接 backprop through the flow 的 FBRAC 16；cube-single 上 FQL 96、ReBRAC 91、IQL 83、FBRAC 79，这两个正是 HW5 用的环境。

### Q 值的 sanity check

HW5 的 reward 每步是 $-1$ 或 $0$，$\gamma=0.99$。所以 Q 一定在 $[-1/(1-\gamma),\,0]=[-100,0]$ 里。离 goal 还有 $n$ 步、每步 $-1$ 时，

$$Q=-\sum_{l=0}^{n-1}\gamma^l=-\frac{1-\gamma^n}{1-\gamma}$$

| 还要走的步数 $n$ | 10 | 50 | 100 | 200 |
|---|---|---|---|---|
| $Q$ | $-9.6$ | $-39.5$ | $-63.4$ | $-86.6$ |

HW5 说 antmaze 和 antsoccer 上 batch 里的 q_max 应趋向 0、q_min 趋向 $-100$，cube-single 上 q_min 可能停在 $-50$ 到 $-70$，按上表大约对应 70 到 120 步之外的 state。Q 跑出 $[-100,0]$，或者长期贴在 $-100$，先查 Bellman backup 里有没有乘 $(1-d)$、reward 的 sign 对不对。

:::back
Flow matching policy 在[第 1 站](#il)；AWR 的 Lagrangian 和[第 10 站](#llm)的 KL-regularized optimum 是同一个推导；$\max$ 带来的 overestimation 的 online 版本在 [RB4301](../courses/RB4301.html#ac)。
:::

:::from
Offline RL 的设定、三种超过 data 的机制、counterfactual query、SAC 的 overestimation 图、三条原则、forward 与 reverse KL、support constraint 来自 [Spring 2026 Lecture 17](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-17.pdf)。Explicit 与 reward-modifying 两种 policy constraint 和对 TD3+BC 的评价、implicit constraint 由 duality 得到并用 weighted max likelihood 近似、AWAC-like algorithm 和它留的问题、IQL 的“induced by actions only”、CQL 的两步、offline 到 online 的 underestimation 与 50/50 的 baseline 及 diffusion/flow actor 的几篇论文、MOPO 与 COMBO，来自 [Spring 2026 Lecture 18](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-18.pdf)；Fall 2023 的 [Lecture 16](https://rail.eecs.berkeley.edu/deeprlcourse-fa23/deeprlcourse-fa23/static/slides/lec-16.pdf) 讲同样的内容，用来对照顺序。两讲都只读到文字和标题，公式是图：AWR 的 Lagrangian 推导按自己的知识补全；CQL 的 objective、Theorem 3.1 与 3.2、tabular update 和 CQL($\mathcal H$) 来自 [CQL 论文](https://arxiv.org/pdf/2006.04779)；RLPD 的三个设计和 LayerNorm 的论证来自 [RLPD 论文](https://arxiv.org/pdf/2302.02948)；MOPO 的 penalty、admissible 的条件和 Theorem 4.4 来自 [MOPO 论文](https://arxiv.org/pdf/2005.13239)。Expectile loss、三个 loss、Lemma 1、分开 $V$ 和 $Q$ 的理由（第 4.2 节）和 Appendix B 的 hyperparameter 来自 [IQL 论文](https://arxiv.org/pdf/2110.06169)；FQL 的动机、loss、10 步 Euler 和 Table 2 的数字来自 [FQL 论文](https://arxiv.org/pdf/2502.02538)；SAC+BC、IQL、FQL 在作业里的具体写法和 Q 值范围来自 [HW5 handout](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw5.pdf)，默认的 expectile 与 $\alpha$ 来自 starter code 的 config。Linear Q 的例子、expectile 的数表、lucky transition 的两点例子、两种 KL fit、CQL 的一个 state 例子（$\chi^2$ 的形式、$\alpha$ 的数表、actor-critic 时 $\alpha$ 减半）、buffer mixture 的数表、LayerNorm 的 $\sqrt d$ 界、Q 与步数的对照是为这一页推导并用 `python3 -I` 算的。
:::

## [explore] Exploration：optimism、count-based bonus 与 RND

:::skip
不在快速路线里。Multi-armed bandit、regret 的定义和分解、UCB1 由 Hoeffding inequality 推出并达到 $\log T$ 的 regret，[CS4246 的 bandit 站](../courses/CS4246.html#bandit)已经从头算过，这里只用它的结论。能用 combination lock 说明 random exploration 为什么要 exponential 的时间、count bonus 为什么只要 $n^2$ 量级，能由 density model 的两个 probability 解出 pseudo-count，能说出 RND 的 target 为什么要是 deterministic 的，就可以去第 14 站。
:::

### 有些任务大部分容易，有些几乎不可能

Lecture 19 拿两个 Atari 游戏对比：有的“mostly easy”，Montezuma's Revenge 几乎不可能。后者拿到钥匙有 reward，开门有 reward，被骷髅杀死没有 reward，也说不清它是好是坏；通关的进展和 reward 只有很弱的相关。人知道该做什么，是因为认得出这些 sprite 是什么意思。Slide 让你站到 algorithm 的位置上：玩一个叫 Mao 的纸牌游戏，唯一被告知的规则是“违反规则会被罚”，规则只能靠试错发现，而且不一定合理；目标是赢 50 局。任务越长、对规则知道得越少，越难。

Exploration 有两种说法：怎样发现需要一长串复杂 behavior 才拿得到的高 reward 的 policy；怎样在“试新东西”和“继续做已知最好的事”之间取舍。Slide 说两者是同一个问题：exploitation 是做已知能拿到最高 reward 的事，exploration 是做没做过的事，期望拿到更高的 reward。

能不能有 optimal 的 exploration？“optimal”可以指 regret 最小，也可以指 Bayes-optimal。Slide 按 tractability 列了一张表：multi-armed bandit（一步、没有 state）和 contextual bandit（一步）在理论上 tractable；小的 tabular MDP 也 tractable；没有已知结构的大 MDP 在理论上 intractable。前几种的 optimal 方法分别是：把 bandit 当成一个 POMDP 的 identification 问题；contextual bandit 即便是 POMDP，policy learning 也简单；tabular MDP 当成 Bayesian model identification，显式地推理 value of information。大的 MDP 里这些都不能直接用，但可以从小问题的 optimal 方法里借想法，再加 hack。

Bandit 是 exploration 的 drosophila。$K$ 个 arm 的 reward 来自未知的 $p_{\theta_i}(r)$，regret 是

$$\mathrm{Reg}(T)=T\,\mathbb E[r(a^*)]-\sum_{t=1}^Tr(a_t)$$

解出那个 POMDP 能得到 optimal exploration，但 belief state 太大；简单的做法常常够好。Optimistic exploration 选 $a=\arg\max_a\hat\mu_a+C\sigma_a$，每个 arm 一直试到确信它不够好为止。UCB1 取 $\hat\mu_a+\sqrt{2\ln T/N(a)}$，regret 是 $O(\log T)$，推导在 [CS4246](../courses/CS4246.html#bandit)。

### Combination lock：random exploration 要 exponential 的时间

把 optimism 搬到 MDP 里之前，先看 random exploration 差在哪里。一排 state $0,1,\dots,n$，从 0 出发，$n$ 是 goal（唯一的 reward）。每个 state 有两个 action，其中一个通往下一个 state，另一个让你回到 0；哪个是对的，每个 state 各不相同，agent 不知道。

$\varepsilon=1$ 的 random policy 要多久才能第一次到 goal？记 $h_k$ 为从 0 出发第一次到达 $k$ 的 expected 步数。到了 $k$ 之后再走一步：一半的 probability 到 $k+1$；另一半回到 0，从头再来，还需要 $h_{k+1}$ 步：

$$h_{k+1}=h_k+1+\tfrac12h_{k+1}\quad\Longrightarrow\quad h_{k+1}=2h_k+2$$

$h_0=0$，所以 $h_1=2$，$h_2=6$，$h_3=14$，一般地 $h_n=2^{n+1}-2$。$n=10$ 要 2046 步，$n=20$ 要 209 万步，$n=40$ 要 $2.2\times10^{12}$ 步。

换成 optimistic 的 agent。Lecture 19 的 “optimistic exploration in RL”：把 UCB 的想法写成 reward 上的 exploration bonus，

$$r^+(s,a)=r(s,a)+\mathcal B\big(N(s,a)\big)$$

$\mathcal B$ 随 count $N$ 下降。Slide 说它的好处是可以加在任何 RL algorithm 上，坏处是 bonus 的 weight 要调。这里取 $\mathcal B=1/\sqrt{N(s,a)}$，没试过的 $(s,a)$ 当作 value 为 $1/(1-\gamma)$（$\gamma=0.95$），每一步在已经见过的 transition 上做 value iteration 再 greedy 地选 action。

| $n$ | 5 | 10 | 15 | 20 |
|---|---|---|---|---|
| Random policy，理论 $2^{n+1}-2$ | 62 | 2046 | 65534 | 2097150 |
| Random policy，20 个 seed 的平均 | 42 | 1824 | 54053 | 没跑 |
| Count bonus，20 个 seed 的平均 | 15 | 50 | 116 | 202 |

Count bonus 的 agent 不会去重试一个已经知道会把它送回 0 的 action（它的 bonus 已经降下来），没试过的 action 又总是最有吸引力的。所以每个 state 的两个 action 最多各试一次；试错了，代价是从 0 走回来的那几步。到第 $k$ 个 state 的代价是 $k$ 量级，加起来是 $n^2$ 量级。$n$ 从 10 翻到 20，random 的步数乘了 1000 倍，count bonus 只乘了 4 倍。

::fig[cs285-lockA] 动图，$n=10$ 的 combination lock，同一个 seed。每一格是一个 state，柱子是到目前为止到达这个 state 的次数（含起点）。上面是 random policy：反复被送回 0，到第 56 步最远只到过 state 5，这一次它要 6601 步才第一次到 goal；下面是 count bonus：每到一个新 state 就试没试过的 action，第 56 步到 goal。

:::wrong Exploration 不够就把 $\varepsilon$ 调大
Combination lock 里 $\varepsilon=1$ 已经是完全 random 的 policy，要 $2^{n+1}-2$ 步。调大 $\varepsilon$ 只是让 agent 更频繁地做 uniformly random 的 action，而 random action 在每个 state 都有一半机会把它送回起点，走得越远，被送回去之前连续选对的 probability 越小。Count bonus 改变的是“往哪里试”：它记得哪里已经试过。
:::

### 高维 state 里没有 count：pseudo-count

Bonus 需要 $N(s)$。Slide 问 “But what's a count?”：Atari 的 frame、robot 的 camera image，几乎不会有两个完全相同的 state，count 永远是 0 或 1。但有些 state 彼此很像。Lecture 19 的做法是 fit 一个 generative model $p_\theta(s)$ 来估 density，再从 density 反推一个 pseudo-count（Bellemare 等 2016）。

想法来自真正的 count。看过 $n$ 个 state、其中 $s$ 出现 $N(s)$ 次，empirical 的 probability 是 $P(s)=N(s)/n$；再看到一次 $s$，变成 $P'(s)=(N(s)+1)/(n+1)$。对一个 density model：先在已有的 data 上得到 $p_\theta(s_i)$，把 $s_i$ 加进去再 fit 一步，得到 $p_{\theta'}(s_i)$（论文叫 recoding probability）。要求 pseudo-count $\hat N$ 和 pseudo-total $\hat n$ 满足同样的两个式子：

$$p_\theta(s_i)=\frac{\hat N(s_i)}{\hat n},\qquad p_{\theta'}(s_i)=\frac{\hat N(s_i)+1}{\hat n+1}$$

由第一式 $\hat N=p\hat n$（$p=p_\theta(s_i)$，$p'=p_{\theta'}(s_i)$），代入第二式：$p'(\hat n+1)=p\hat n+1$，即 $\hat n(p'-p)=1-p'$，

$$\hat n=\frac{1-p'}{p'-p},\qquad\hat N(s_i)=\hat n\,p=\frac{p\,(1-p')}{p'-p}$$

两个 unknown、两个 equation，正好解出。核对：如果 density model 就是 empirical 的频率，$N=50$，$n=5000$，那么 $p=0.01$，$p'=51/5001=0.0101980$，$p'-p=0.99/5001=1.98\times10^{-4}$，$\hat N=0.01\times0.98980/(1.98\times10^{-4})=50.0$，还原出真实的 count。一个会 generalize 的 model 看到一次 $s_i$ 后 probability 涨得多，说明 $s_i$ 新：$p=0.01$、$p'=0.011$ 时 $\hat N=0.01\times0.989/0.001=9.89$；涨得少，说明见过很多类似的：$p'=0.0102$ 时 $\hat N=49.5$。

Algorithm：用目前见过的所有 state 去 fit $p_\theta(s)$；走一步得到 $s_i$；把 $s_i$ 加进去 fit 出 $p_{\theta'}$；算 $\hat N(s_i)$；令 $r_i^+=r_i+\mathcal B(\hat N(s_i))$；拿 $r^+$ 去做 RL。

Bonus 取什么 form？Slide 列了文献里几种 UCB 式的 bonus：UCB 的 $\sqrt{2\ln n/N(s)}$；MBIE-EB（Strehl 与 Littman 2008）的 $\sqrt{1/N(s)}$；BEB（Kolter 与 Ng 2009）的 $1/N(s)$。Bellemare 等的论文用的是 $\beta(\hat N+0.01)^{-1/2}$，DQN 实验 $\beta=0.05$，附录里也和 $1/\hat N$ 的版本比过。上面两个 $\hat N$ 对应的 bonus 是 $0.05/\sqrt{9.90}=0.0159$ 和 $0.05/\sqrt{49.5}=0.0071$。论文报告 Montezuma's Revenge 上 50M frame 时，带 bonus 的 agent 走过 15 个房间，不带的只有 2 个。

Density model 用什么？Slide 说它只需要输出 density，不需要生成好看的 sample，这和 GAN 一类流行的 generative model 的重点正好相反。Bellemare 等用的是 CTS model：每个 pixel 以它左上方的邻域为 condition。

### 用 prediction error 当 count：RND

再退一步：model 连好的 density 都不必给，只要能分辨 state 新不新。Fit 一个 $\hat f_\theta(s)$ 去逼近某个 target function $f^*(s)$，training data 是 buffer 里见过的 state；error $\mathcal E(s)=\|\hat f_\theta(s)-f^*(s)\|^2$ 在见过很多次的 state 上小，在新的 state 上大，于是可以当 bonus。Target 用什么？一个选择是 $f^*(s,a)=s'$，预测下一个 state。Random network distillation（RND，Burda 等 2018）用一个随机初始化、不再 train 的 network $f_\phi(s)$ 当 target，exploration bonus 是 $\|\hat f_\theta(s_{t+1})-f_\phi(s_{t+1})\|^2$。

一维的例子：state 只在 $[-1,1]$ 里被访问过（2000 个），target 和 predictor 都是 64 个 hidden unit 的 ReLU network，各自随机初始化，predictor 用 Adam train 8000 步（seed 0）。$[-1,1]$ 里的 error 都在 $10^{-4}$ 量级；离开 data 越远越大：$x=-1.5$ 是 0.037，$x=-2$ 是 0.30，$x=-3$ 是 3.3；$x=1.5$ 是 0.026，$x=2$ 是 0.23，$x=3$ 是 1.5。

::fig[cs285-rnd] RND 的 bonus。阴影是访问过的 state，曲线是 predictor 与 random target 的 squared error：在 data 里几乎为 0，离开 data 后迅速变大。

为什么 target 要是一个 fixed 的 random network，而不是下一个 state？RND 论文列了 prediction error 的四个来源：training data 少（epistemic uncertainty，这是想要的）；target 本身有 randomness（aleatoric uncertainty）；model misspecification（缺信息，或 model class 太简单）；learning dynamics（optimization 没找到最好的 approximation）。Target 是 deterministic 的，第二个来源就没有了；target 和 predictor 是同一种 network，第三个来源也没有了。剩下的 error 主要反映“见过多少”。实现上 observation 要按 running mean 和 std 做 normalize 并 clip 到 $[-5,5]$，intrinsic reward 要除以它 running std 的估计，否则 scale 会漂。论文在 Montezuma's Revenge 上的平均分是 8152（PPO baseline 2497，人类平均 4753），最好的 agent 通常能找到第一关 24 个房间里的 22 个。

:::edge Noisy TV：target 有 randomness 时 error 永远降不下来
如果用 $f^*(s,a)=s'$ 当 target，而环境里有一块屏幕每一帧随机换画面，那一块的预测 error 不管看多少次都不会下降：它来自第二个来源，aleatoric 的 randomness，不来自“没见过”。Agent 会被吸引过去一直盯着屏幕看。RND 的 target 是 $s_{t+1}$ 的 deterministic function，同一个 $s_{t+1}$ 永远给出同一个 target，见多了 error 就降到 0；屏幕上每一帧都不一样，它仍然是“新”的 state，所以 RND 只是避开了 transition randomness 那一部分，并不保证完全不受这类 state 的吸引。
:::

:::back
UCB1、regret 的 $\log T$ 推导在 [CS4246 的 bandit 站](../courses/CS4246.html#bandit)；在 data 外 prediction 变大这件事，和[第 12 站](#offline) offline RL 的 OOD 问题是同一个现象，那里要 pessimism，这里要 optimism。
:::

:::from
Montezuma's Revenge 与 Mao 的例子、exploration 的两种定义、exploitation 与 exploration 的例子（来自 D. Silver 的讲义）、regret 与 Bayes-optimal、tractability 的表与每一行的做法、bandit 是 drosophila、optimistic exploration、“what's a count?”、fit generative model 估 pseudo-count、三种 bonus、density model 只需输出 density、CTS、prediction error 当 count、RND，来自 [Spring 2026 Lecture 19](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-19.pdf)（只读到文字，公式是图）。Pseudo-count 的两个 equation 和解、bonus 的 form、$\beta=0.05$、15 个房间对 2 个来自 [Bellemare 等 2016](https://arxiv.org/pdf/1606.01868)；slide 上说 Bellemare 用的是哪一种 bonus，抓取工具的转述和论文正文对不上，这里以论文为准。RND 的定义、四个 error 来源、normalization、8152 与 22 个房间来自 [Burda 等 2018](https://arxiv.org/pdf/1810.12894v1)；UCB1 的 index 核对了 [Auer 等 2002](https://homes.di.unimi.it/%7Ecesabian/Pubblicazioni/ml-02.pdf)。Combination lock 的 $h_n$ 推导、两种 agent 的模拟（20 个 seed）、pseudo-count 的数值核对、一维 RND 的实验（seed 0）、noisy TV 的分析是为这一页写并用 `python3 -I` 算的。
:::

## [theory] RL theory：contraction、sample complexity 与 fitted Q-iteration 的 error

:::skip
不在快速路线里。Value iteration 的 contraction 在 [CS4246 的 dp 站](../courses/CS4246.html#dp)对 $V$ 证过一次，这里用 $Q$ 和 matrix 的写法再走一遍，因为后面的 sample complexity 要用同一套记号。能证明 $(I-\gamma P^\pi)^{-1}$ 的每一行加起来是 $1/(1-\gamma)$，能推出 simulation lemma 并由它说明 error 为什么是 horizon 的平方，能把 fitted Q-iteration 的 error 拆成 sampling 和 approximation 两部分，就可以去第 15 站。
:::

### 理论问什么、假设什么

Lecture 20 开头列了 RL theory 常问的问题：用 $N$ 个 sample 学出来的 $Q$ 离真实的差多少（sample complexity）；converge 之后的 policy 有多好（asymptotic performance）。要得到有意思的结论，必须做很强的假设，目标是假设不至于离现实太远。两个主要的困难是 exploration（多大的可能找到 sparse reward）和 learning（exploration 解决之后，要多少 sample 才能学好 model 或 value function）。Worst case 下 exploration 极难，所以 learning 的分析常常用一个“generative model”把 exploration 抽象掉：可以对任意 $(s,a)$ 直接要一个 sample $s'\sim P(\cdot\mid s,a)$。

Slide 对理论的用处说得很克制。证明 deep RL 的 algorithm 一定 work 一般做不到，它们常常连 convergence 都没有保证；理论能做的是看清问题的 parameter 怎样影响 error，比如 discount 大一点好不好、要把 error 减半 sample 要多几倍。强假设下得到精确的结论，翻译成现实只剩定性的判断，它可能适用也可能不适用。所以 slide 的原话是：谁说他的 RL algorithm 有 “provable guarantees”，不要太当真，假设几乎总是不现实的。

### 两个有用的 identity

把 $Q$ 写成 $|\mathcal S||\mathcal A|$ 维的 vector，$P$ 是 $|\mathcal S||\mathcal A|\times|\mathcal S|$ 的 transition matrix，$\Pi$ 是 $|\mathcal S|\times|\mathcal S||\mathcal A|$ 的 policy matrix（$V^\pi=\Pi Q^\pi$）。Bellman equation：

$$Q^\pi=r+\gamma PV^\pi=r+\gamma P\Pi Q^\pi=r+\gamma P^\pi Q^\pi,\qquad P^\pi=P\Pi$$

$P^\pi$ 是 state-action 的 transition matrix，就是[第 2 站](#basics)的那个 Markov chain。移项：

$$Q^\pi=(I-\gamma P^\pi)^{-1}r$$

Slide 标注 “policy evaluation is a linear operation”。$(I-\gamma P^\pi)^{-1}$ 有多大？展开成 Neumann series：

$$(I-\gamma P^\pi)^{-1}=\sum_{k\ge0}\gamma^k(P^\pi)^k$$

$(P^\pi)^k$ 是 $k$ 步的 transition matrix，每一行是一个 distribution，加起来是 1。所以 $(I-\gamma P^\pi)^{-1}$ 每一行的和是 $\sum_k\gamma^k=1/(1-\gamma)$，slide 叫它 “horizon-like term”；而且所有 entry 非负。由此对任何 vector $v$：

$$\big\|(I-\gamma P^\pi)^{-1}v\big\|_\infty\le\frac{\|v\|_\infty}{1-\gamma}$$

每一行是对 $v$ 的非负加权求和，weight 之和是 $1/(1-\gamma)$。

在第 2 站的例子上核对（$\theta=0.2$，$\gamma=0.9$，顺序是 (R, steady)、(R, swerve)、O）：

$$(I-0.9P^\pi)^{-1}=\begin{pmatrix}6.425&1.356&2.219\\4.438&2.110&3.452\\4.932&1.233&3.836\end{pmatrix}$$

三行各自加起来都是 10.000。乘上 $r=(1,1,-1)^\top$，第一行 $6.425+1.356-2.219=5.562$，正是第 2 站算出的 $Q(R,\text{steady})$。

### Value iteration 为什么 converge

Bellman optimality operator $\mathcal TQ=r+\gamma P\max_aQ$。对任意两个 $Q,\bar Q$：

$$\|\mathcal TQ-\mathcal T\bar Q\|_\infty=\gamma\,\big\|P\big(\max_aQ-\max_a\bar Q\big)\big\|_\infty\le\gamma\,\big\|\max_aQ-\max_a\bar Q\big\|_\infty\le\gamma\,\|Q-\bar Q\|_\infty$$

第一个不等号：$P$ 的每一行是 distribution，对一个 vector 取加权平均不会超过它的最大绝对值。第二个不等号：在每个 state 上 $|\max_af(a)-\max_ag(a)|\le\max_a|f(a)-g(a)|$。所以 $\mathcal T$ 是 $\gamma$-contraction，$Q^*$ 是它唯一的 fixed point，value iteration 每一步把 error 至少乘 $\gamma$：

$$\|Q_k-Q^*\|_\infty\le\gamma^k\,\|Q_0-Q^*\|_\infty$$

例子里 $Q^*=(10,\ 6.727,\ 6.364)$。从 $Q_0=0$ 出发，error 恰好是 $10\times0.9^k$：$k=10$ 时 3.487，$k=30$ 时 0.424。

::fig[cs285-contractA] 动图，在第 2 站的 MDP 上做 value iteration。三根柱子是 $Q_k$ 的三个分量，虚线是 $Q^*$；右边是 $\|Q_k-Q^*\|_\infty$，每一步乘 0.9。

### 有 generative model 时要多少 sample

设定：对每个 $(s,a)$ 向 generative model 要 $N$ 个 $s'$，用频率估 $\hat P(s'\mid s,a)=\text{count}(s,a,s')/N$，reward 已知；在 $\hat P$ 上算出 $\hat Q^\pi$、$\hat Q^*$ 和 greedy 的 $\hat\pi$。三个问题：$\|Q^\pi-\hat Q^\pi\|_\infty$ 有多大？$\|Q^*-\hat Q^*\|_\infty$ 呢？用 $\hat\pi$ 在真实环境里差多少，即 $\|Q^*-Q^{\hat\pi}\|_\infty$？

**Concentration。** Hoeffding inequality：$n$ 个 i.i.d. 的取值在 $[b_-,b_+]$ 的 sample，sample mean $\bar X$ 与 mean $\mu$ 满足 $P(|\bar X-\mu|\ge\epsilon)\le2\exp\big(-2n\epsilon^2/(b_+-b_-)^2\big)$。令右边等于 $\delta$ 解出 $\epsilon$：以至少 $1-\delta$ 的 probability，

$$|\bar X-\mu|\le(b_+-b_-)\sqrt{\frac{\log(2/\delta)}{2n}}$$

对整个 distribution 的估计，RL theory 教科书（Agarwal、Jiang、Kakade、Sun）的 Lemma A.8 给出

$$\big\|\hat P(\cdot\mid s,a)-P(\cdot\mid s,a)\big\|_1\le c\sqrt{\frac{|\mathcal S|\log(1/\delta)}{N}}$$

对所有 $(s,a)$ 同时成立需要 union bound，把 $\delta$ 换成 $\delta/(|\mathcal S||\mathcal A|)$。

**Simulation lemma。** 两个 matrix 的 inverse 之差有一个 identity：$A^{-1}-B^{-1}=B^{-1}(B-A)A^{-1}$（右边乘开是 $B^{-1}BA^{-1}-B^{-1}AA^{-1}$）。取 $A=I-\gamma P^\pi$，$B=I-\gamma\hat P^\pi$，$B-A=\gamma(P^\pi-\hat P^\pi)=\gamma(P-\hat P)\Pi$：

$$Q^\pi-\hat Q^\pi=\big(A^{-1}-B^{-1}\big)r=\gamma(I-\gamma\hat P^\pi)^{-1}(P-\hat P)\,\Pi Q^\pi=\gamma(I-\gamma\hat P^\pi)^{-1}(P-\hat P)V^\pi$$

右边三样东西各自用上面的结论 bound：$(I-\gamma\hat P^\pi)^{-1}$ 最多放大 $1/(1-\gamma)$ 倍；$(P-\hat P)V^\pi$ 的每个分量是 $\sum_{s'}\big(P(s'\mid s,a)-\hat P(s'\mid s,a)\big)V^\pi(s')$，不超过 $\|P(\cdot\mid s,a)-\hat P(\cdot\mid s,a)\|_1\|V^\pi\|_\infty$；$\|V^\pi\|_\infty\le R_{\max}/(1-\gamma)$。合起来：

$$\|Q^\pi-\hat Q^\pi\|_\infty\le\frac{\gamma}{1-\gamma}\max_{s,a}\|P-\hat P\|_1\cdot\frac{R_{\max}}{1-\gamma}\le\frac{\gamma R_{\max}}{(1-\gamma)^2}\,c\sqrt{\frac{|\mathcal S|\log(|\mathcal S||\mathcal A|/\delta)}{N}}$$

Slide 的两条读法：sample 越多 error 越小，按 $1/\sqrt N$；error 是 horizon $1/(1-\gamma)$ 的平方，因为每次 backup 都带进一点 error，一次来自 $V^\pi$ 的大小，一次来自 $(I-\gamma\hat P^\pi)^{-1}$ 把它累积起来。反过来解 $N$：要 $\|Q^\pi-\hat Q^\pi\|_\infty\le\epsilon$，每个 $(s,a)$ 的 sample 数要和 $\frac{|\mathcal S|\log(|\mathcal S||\mathcal A|/\delta)}{(1-\gamma)^4\epsilon^2}$ 成正比，总数再乘 $|\mathcal S||\mathcal A|$。教科书 Proposition 2.1 正是这个 $(1-\gamma)^{-4}$ 的结果；更细的分析（Theorem 2.6）把它降到 $(1-\gamma)^{-3}$，并且有匹配的 lower bound。

**三个问题的答案。** 上面的 bound 只用到“每个 $(s,a)$ 的 $\|P-\hat P\|_1$ 都小”这一个事件，事件成立时它对所有 $\pi$ 同时成立。$Q^*\ge Q^{\hat\pi^*}$ 而 $\hat Q^*=\hat Q^{\hat\pi^*}$，所以 $\hat Q^*-Q^*\le\hat Q^{\hat\pi^*}-Q^{\hat\pi^*}\le\epsilon$；同理 $Q^*-\hat Q^*\le Q^{\pi^*}-\hat Q^{\pi^*}\le\epsilon$，合起来 $\|Q^*-\hat Q^*\|_\infty\le\epsilon$（$\hat\pi^*$ 是 $\hat P$ 里的 optimal policy，也就是 $\hat\pi$）。$\hat\pi$ 在真实环境里的 performance：

$$\|Q^*-Q^{\hat\pi}\|_\infty\le\|Q^*-\hat Q^{\hat\pi}\|_\infty+\|\hat Q^{\hat\pi}-Q^{\hat\pi}\|_\infty\le\epsilon+\epsilon=2\epsilon$$

第一项里 $\hat Q^{\hat\pi}=\hat Q^*$；第二项是同一个 policy $\hat\pi$ 在两个 MDP 里的 $Q$，正是 simulation lemma 的对象（slide 上标着 “same policy”）。

在第 2 站的例子上实测。唯一不确定的 entry 是“从 O 回到 R”的 probability 0.5，用 $N$ 个 sample 去估，每个 $N$ 重复 5000 次（seed 0），看 $\|Q^\pi-\hat Q^\pi\|_\infty$ 的平均。Bound 用 Hoeffding（$\delta=0.05$）：$\|P-\hat P\|_1=2|\hat p-0.5|\le2\sqrt{\log40/(2N)}$，$\|V^\pi\|_\infty\le1/(1-\gamma)$。

| $N$ | 10 | 100 | 1000 | 10000 |
|---|---|---|---|---|
| $\gamma=0.9$，实测平均 | 1.28 | 0.378 | 0.119 | 0.037 |
| $\gamma=0.9$，bound | 77.3 | 24.4 | 7.73 | 2.44 |
| $\gamma=0.99$，实测平均 | 11.8 | 3.32 | 1.05 | 0.334 |
| $\gamma=0.99$，bound | 8503 | 2689 | 850 | 269 |

两行实测和两行 bound 都是 $N$ 每乘 100，error 除以 10。$\gamma$ 从 0.9 到 0.99，bound 乘了 110 倍，实测只乘了 9 倍。

::fig[cs285-simlemma] Log-log 坐标。彩色是 $\gamma=0.99$，黑色是 $\gamma=0.9$；实线是实测的平均 error，虚线是 bound。四条线 slope 都是 $-\tfrac12$，bound 在实测上方两到三个数量级。

:::wrong Bound 说要 $10^9$ 个 sample，实际就要这么多
Bound 是 worst case 的上界。上表 $\gamma=0.99$、$N=10000$ 时 bound 是 269，实测平均是 0.334，差 800 倍。这个 MDP 里只有一个 entry 不确定，$V^\pi$ 的变化也远小于 $R_{\max}/(1-\gamma)$，bound 的每一步放大都没有发生。Bound 有用的是形状：$1/\sqrt N$ 的 rate 在实测里一模一样。Horizon 的平方在这里没有出现，实测只多了大约一个 horizon 的倍数。所以 slide 说理论给出的是定性的结论，“provable guarantees”不要当成实际要多少 sample 的预测。
:::

### Fitted Q-iteration 的 error

Model-free 的情况：没有 $\hat P$，只有 data 里的 transition。Fitted Q-iteration 每一轮做 $\hat Q_{k+1}\leftarrow\arg\min_{\hat Q}\|\hat Q-\hat{\mathcal T}\hat Q_k\|$，其中

$$\hat{\mathcal T}Q(s,a)=\hat r(s,a)+\gamma\,\mathbb E_{s'\sim\hat P(\cdot\mid s,a)}\big[\max_{a'}Q(s',a')\big]$$

$\hat r$、$\hat P$ 是 data 里 $(s,a)$ 的 transition 的平均。Slide 特别注明 “these are not models, this is the effect of averaging together transitions in the data!”：对同一个 $(s,a)$ 的几条 transition 做 regression，回归出来的就是它们 target 的平均。和 $\mathcal T$ 比，error 有两个来源：sampling error $\hat{\mathcal T}-\mathcal T$，以及 approximation error（function class 表示不了 $\hat{\mathcal T}\hat Q_k$）。用哪个 norm？下面都用 $\infty$-norm，这是很强的假设。

**Sampling error。** 对每个 $(s,a)$：

$$\big|\hat{\mathcal T}Q(s,a)-\mathcal TQ(s,a)\big|\le|\hat r(s,a)-r(s,a)|+\gamma\Big|\mathbb E_{\hat P}\big[\max_{a'}Q\big]-\mathbb E_P\big[\max_{a'}Q\big]\Big|$$

第一项是 continuous random variable 的 estimation error，直接用 Hoeffding：reward 在 $[-R_{\max},R_{\max}]$ 里，它不超过 $2R_{\max}\sqrt{\log(2/\delta)/(2N)}$。第二项和上一小节一样不超过 $\|\hat P-P\|_1\|Q\|_\infty\le c\sqrt{|\mathcal S|\log(1/\delta)/N}\cdot R_{\max}/(1-\gamma)$。对所有 $(s,a)$ 取 union bound，得到 $\|\hat{\mathcal T}Q-\mathcal TQ\|_\infty\le\epsilon_s$，$\epsilon_s$ 按 $1/\sqrt N$ 下降，量级是 $R_{\max}/(1-\gamma)$。

**Approximation error。** 假设每一轮 regression 都做得足够好：$\|\hat Q_{k+1}-\mathcal T\hat Q_k\|_\infty\le\epsilon_a$（slide：“This is a strong assumption!”）。先只看它，backup 用 exact 的 $\mathcal T$：

$$\|\hat Q_k-Q^*\|_\infty\le\|\hat Q_k-\mathcal T\hat Q_{k-1}\|_\infty+\|\mathcal T\hat Q_{k-1}-\mathcal TQ^*\|_\infty\le\epsilon_a+\gamma\|\hat Q_{k-1}-Q^*\|_\infty$$

第二项用了 contraction 和 $Q^*=\mathcal TQ^*$。展开 $k$ 次：

$$\|\hat Q_k-Q^*\|_\infty\le\epsilon_a\big(1+\gamma+\cdots+\gamma^{k-1}\big)+\gamma^k\|\hat Q_0-Q^*\|_\infty\ \xrightarrow{k\to\infty}\ \frac{\epsilon_a}{1-\gamma}$$

每一轮 0.1 的 regression error，$\gamma=0.9$ 时最终可能差到 1，$\gamma=0.99$ 时可能差到 10。

**合起来。** Backup 用的是 $\hat{\mathcal T}$，每一轮实际的 error 是 $\|\hat Q_{k+1}-\mathcal T\hat Q_k\|_\infty\le\|\hat Q_{k+1}-\hat{\mathcal T}\hat Q_k\|_\infty+\|\hat{\mathcal T}\hat Q_k-\mathcal T\hat Q_k\|_\infty\le\epsilon_a+\epsilon_s$，代进上面的递推：

$$\lim_{k\to\infty}\|\hat Q_k-Q^*\|_\infty\le\frac{\epsilon_a+\epsilon_s}{1-\gamma}$$

$\epsilon_s$ 自己就是 $1/(1-\gamma)$ 的量级，sampling 那部分又是 horizon 的平方。Slide 的总结：error 随 horizon、随 iteration、随 sampling 累积；到目前为止需要很强的 $\infty$-norm 假设，更进一步的结果在某个 distribution 下用 $p$-norm。

:::edge 为什么一定要 $\infty$-norm
Contraction 是对 $\infty$-norm 说的。Fitted Q-iteration 的 regression 实际 minimize 的是 data distribution 下的 squared error，即一个加权的 2-norm；$\mathcal T$ 在 2-norm 下不一定是 contraction，regression 这一步（projection）也不保证不放大 error，两者合起来可以 diverge，[CS4246 的 fa 站](../courses/CS4246.html#fa)的最小 divergence 例子就是这样。“$\|\hat Q_{k+1}-\mathcal T\hat Q_k\|_\infty\le\epsilon_a$”这个假设把这个问题绕开了：它要求 regression 在每个 $(s,a)$ 上都准，包括 data 很少的地方，这正是[第 12 站](#offline)的 offline RL 做不到的。
:::

:::back
$P^\pi$ 和 $Q^\pi$ 的数值在[第 2 站](#basics)；contraction 对 $V$ 的证明和 policy iteration 在 [CS4246 的 dp 站](../courses/CS4246.html#dp)；Hoeffding inequality 在 [CS3244 的 vc 站](../courses/CS3244.html#vc)。
:::

:::from
理论问的问题、两类困难与 generative model、“What's the point?”和对 “provable guarantees” 的提醒、“policy evaluation is a linear operation”“horizon-like term”、VI 的 convergence、generative model 的设定、concentration inequality、几个 lemma（“difference in probabilities”“evaluation operator”“triangle inequality”）、union bound、“more samples = lower error”“error grows quadratically in the horizon”、“same policy”、fitted Q-iteration 的两种 error、“these are not models…”、Hoeffding、“This is a strong assumption!”、approximation error 随 horizon、合起来的三条结论，来自 [Spring 2026 Lecture 20](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-20.pdf)（slide 注明取自 Agarwal、Jiang、Kakade、Sun 的教科书和 Aviral Kumar 的 slides），对照了 [Fall 2023 Lecture 17](https://rail.eecs.berkeley.edu/deeprlcourse-fa23/deeprlcourse-fa23/static/slides/lec-17.pdf)。两份都只读到文字，没有一个公式。$Q^\pi=(I-\gamma P^\pi)^{-1}r$ 与行和、contraction（Lemma 1.10）、generative model 的设定、simulation lemma（Lemma 2.2）、$\ell_1$ 的 concentration（Lemma A.8）、Proposition 2.1 的 $(1-\gamma)^{-4}$ 和 Theorem 2.6–2.8 来自 [RL theory 教科书](https://rltheorybook.github.io/rltheorybook_AJKS.pdf)（读了前 10 万字符，含第 1、2 章）。Simulation lemma 的 matrix identity 推导、把三样东西逐个 bound 的过程、fitted Q-iteration 两种 error 的具体 bound 和递推是按教科书的记号自己补的；例子的 matrix、VI 的数、5000 次重复的实测与 bound 的数表是为这一页用 `python3 -I` 算的（seed 0）。
:::

## [skills] Unsupervised skill discovery：mutual information、DIAYN 与 Skew-Fit

:::skip
不在快速路线里。能由定义推出 $I(x;y)=\mathcal H(y)-\mathcal H(y\mid x)$，能说出 DIAYN 的 reward 为什么是 $\log q(z\mid s)-\log p(z)$、少了 $-\log p(z)$ 会怎样，能把 goal reaching 写成 $\mathcal H(G)-\mathcal H(G\mid S)$ 并算一次 Skew-Fit 的 reweighting，就可以去第 16 站。
:::

### 没有 reward 时学什么

Lecture 23 先回到上一讲的问题：有些任务容易，有些几乎不可能。然后换一个问法：完全不给 reward function，能不能学到多样的 behavior？Slide 列了三个用处：先无监督地学 skill，之后用来完成 goal；学 sub-skill，给 hierarchical RL 用；探索可能的 behavior 的空间。例子是一个 robot 在 training 时没有任何 task，test 时才被告知 goal：“How can you prepare for an unknown future goal?”

### Information theory 回顾

Entropy $\mathcal H(p(x))=-\mathbb E_{x\sim p}[\log p(x)]$ 衡量 $p$ 有多宽。Mutual information 是 joint 与“假装独立”之间的 KL：

$$I(x;y)=\mathrm{KL}\big(p(x,y)\,\|\,p(x)p(y)\big)=\mathbb E_{(x,y)\sim p}\Big[\log\frac{p(x,y)}{p(x)p(y)}\Big]$$

把 $p(x,y)=p(y\mid x)p(x)$ 代进去，$p(x)$ 消掉：

$$I(x;y)=\mathbb E\big[\log p(y\mid x)\big]-\mathbb E\big[\log p(y)\big]=\mathcal H(p(y))-\mathcal H(p(y\mid x))$$

知道 $x$ 之后 $y$ 的 entropy 减少了多少。$x$ 和 $y$ 独立时为 0；$y$ 由 $x$ 完全决定时等于 $\mathcal H(y)$。

在 RL 里，记 $\pi(s)$ 为 policy 的 state marginal，$\mathcal H(\pi(s))$ 量的是 coverage：policy 走得有多散。Empowerment 是 $I(s_{t+1};a_t)=\mathcal H(s_{t+1})-\mathcal H(s_{t+1}\mid a_t)$，slide 说可以把它看成用 information theory 量化的 “control authority”：第一项要 next state 尽量多样，第二项要 action 能决定 next state。两个 action 等可能、各自确定地去两个不同的 state，$I=\log2=0.693$；每个 action 只有 0.9 的 probability 去它想去的地方，$\mathcal H(s_{t+1}\mid a_t)=-0.1\log0.1-0.9\log0.9=0.325$，$I=0.693-0.325=0.368$。

### DIAYN：让 skill 去不同的地方

Diversity is all you need（DIAYN，Eysenbach、Gupta、Ibarz、Levine 2018）的直觉：不同的 skill 应该去 state space 里不同的地方。Slide 补了两句：到达不同的 goal 和做不同的 task 不是一回事；并不是所有 behavior 都能写成 goal reaching。所以 skill 用一个 index $z$ 表示，policy 是 $\pi(a\mid s,z)$。

怎样让不同的 $z$ 去不同的地方？Train 一个 discriminator $q_\phi(z\mid s)$，从 state 猜是哪个 skill；policy 的 reward 是“这个 state 有多容易被认出是 $z$”。用 information theory 写：要让 $z$ 和 $s$ 的 mutual information 大，

$$I(z;s)=\mathcal H(z)-\mathcal H(z\mid s)$$

第一项让 $z$ 的 prior 最宽，DIAYN 直接把 $p(z)$ 固定为 uniform 的 categorical（实验多用 50 个 skill）。第二项要 $s$ 能决定 $z$。$p(z\mid s)$ 不知道，用 discriminator 代替会得到一个 lower bound：

$$-\mathcal H(z\mid s)=\mathbb E\big[\log p(z\mid s)\big]=\mathbb E\big[\log q_\phi(z\mid s)\big]+\mathbb E_s\Big[\mathrm{KL}\big(p(z\mid s)\,\|\,q_\phi(z\mid s)\big)\Big]\ge\mathbb E\big[\log q_\phi(z\mid s)\big]$$

所以 $I(z;s)\ge\mathbb E_{z\sim p(z),\,s\sim\pi(z)}\big[\log q_\phi(z\mid s)-\log p(z)\big]$。Policy 把括号里的东西当 reward：

$$r_z(s,a)=\log q_\phi(z\mid s)-\log p(z)$$

论文的完整 objective 还加了 $\mathcal H[A\mid S,Z]$，每个 skill 在不影响可辨认的前提下尽量 random，用 SAC 来 train。Algorithm：每个 episode 抽 $z\sim p(z)$；用 $\pi(a\mid s,z)$ 走，每一步的 reward 是 $\log q_\phi(z\mid s_{t+1})-\log p(z)$；SAC 更新 policy；SGD 更新 discriminator，让它从 $s$ 猜对 $z$。两者合作：discriminator 越会认，policy 越往好认的地方走，discriminator 又更会认。

算一个例子。4 个 skill，$p(z)=\tfrac14$，final state 落在 $\mathcal N(d\,u_z,\ 0.5^2I)$，$u_z$ 是四个方向的 unit vector，$d$ 是 skill 离开原点的距离。Discriminator 取 Bayes-optimal 的 posterior，Monte Carlo 估 $I(z;s)$（20 万个 sample，seed 0）：

| $d$ | 0 | 0.25 | 0.5 | 1 | 1.5 | 2 |
|---|---|---|---|---|---|---|
| $I(z;s)$ | 0 | 0.116 | 0.403 | 1.000 | 1.295 | 1.373 |
| Discriminator 猜对的比例 | 25% | 41% | 58% | 85% | 97% | 99.5% |

$d=0$ 时 4 个 skill 去同一个地方，discriminator 只能乱猜，$I=0$；$d=2$ 时接近上限 $\log4=1.386$。Reward 的平均就是这个 $I$，policy 每把 skill 推开一点，reward 都变大。

::fig[cs285-diaynA] 动图，4 个 skill 的 final state 一步步分开。彩色的那一团是 skill 1，灰色是另外三个；右边是 $I(z;s)$ 和 discriminator 的准确率，上限是 $\log4$。

Slide 展示了在 Cheetah、Ant、Mountain car 上学到的 skill（只有标题，视频没有读到），训练中没有用任何 reward。Slide 还指出这个 objective 和 Gregor 等（2016）的 variational intrinsic control 是同一个 mutual information。

:::wrong Reward 取 $\log q_\phi(z\mid s)$ 就够了，$-\log p(z)$ 是个常数，不影响 optimization
它对 discriminator 是常数，对 policy 不是：它决定 reward 的 sign。$q_\phi(z\mid s)\le1$，$\log q_\phi$ 永远 $\le0$，skill 认得再准，比如 $q=0.9$，每一步也是 $-0.105$。环境里 episode 可以提前结束时（摔倒、出界），活得越久扣得越多，optimal 的做法是尽快结束 episode。加上 $-\log p(z)=\log4$ 之后，$q=0.9$ 的 reward 是 $+1.281$；只要 discriminator 比乱猜（$q=\tfrac14$）强，reward 就是正的，agent 有理由活下去。这是 DIAYN 论文给出的理由。
:::

### Goal reaching 也是 mutual information

把 skill $z$ 换成 goal $g$，discriminator 从 final state 猜 goal（slide：“a little tweak”）。Skew-Fit 一文（Pong、Dalal 等 2019）把 goal-conditioned RL 写成

$$I(S;G)=\mathcal H(G)-\mathcal H(G\mid S)$$

第二项小：到达的 state 能确定当初的 goal，也就是 goal reaching 做得好。Goal-conditioned 的 policy 完美地到达 goal 时 $\mathcal H(G\mid S)=0$。第一项大：练习的 goal 要多样。Slide 在这一页注明 “this is often where a lot of interesting stuff happens”：goal 从哪来决定了 agent 能探索多远。

自己生成 goal 的一种做法（slide 引的 Nair、Pong 等 2018，这里按 Skew-Fit 论文的描述）：在见过的 state 上 train 一个 VAE，从中抽 goal，让 goal-conditioned policy 去追，追到的 state 再加进 data。问题是见过的 state 集中在起点附近，按这个 distribution 抽 goal，大部分 goal 都在已经熟悉的地方。Skew-Fit 把抽 goal 的 distribution 扭一下：

$$p_{\text{skewed}}(s)\ \propto\ p(s)^{1+\alpha},\qquad\alpha\in[-1,0)$$

实现上是对 data 里的每个 state 加 weight $w=q(s)^\alpha$（$q$ 是 VAE 估的 density），再做 sampling importance resampling。$\alpha=-1$ 时 weight 是 $1/q$，等于直接 importance-sample 成 uniform；$\alpha=0$ 不改。论文实验里 Visual Pusher 和 Pickup 用 $\alpha=-1$，door 用 $-\tfrac12$，Ant 迷宫用 $-2.5$。

算一次。见过的 state 的 distribution 是 $p=(0.5,\ 0.25,\ 0.15,\ 0.07,\ 0.03)$，entropy 1.269，最大可能是 $\log5=1.609$：

| $\alpha$ | 0 | $-0.25$ | $-0.5$ | $-1$ |
|---|---|---|---|---|
| Skewed distribution | $(0.5,\ 0.25,\ 0.15,\ 0.07,\ 0.03)$ | $(0.426,\ 0.253,\ 0.172,\ 0.097,\ 0.052)$ | $(0.348,\ 0.246,\ 0.191,\ 0.130,\ 0.085)$ | uniform |
| Entropy | 1.269 | 1.394 | 1.504 | 1.609 |

再假设 policy 能完美到达抽出的 goal，于是下一轮见过的 state 就是这一轮的 goal distribution。$\alpha=-\tfrac12$ 时每一轮 $p\leftarrow p^{1/2}/\sum p^{1/2}$，entropy 依次是 1.269、1.504、1.581、1.602、1.608，第 6 轮到 1.609，converge 到 uniform。论文的 Lemma 3.1、3.2 证明的是这类 convergence，但条件比这里强：一般情形只保证存在某个范围的 $\alpha<0$ 使 entropy 增大，$q=p$ 的简化情形才对整个 $[-1,0)$ 成立。

::fig[cs285-skewA] 动图，$\alpha=-\tfrac12$ 的 Skew-Fit 一轮轮作用在五个 state 上。柱子是抽 goal 的 distribution，常见的 state 被压低、罕见的被抬高，entropy 一轮轮涨到 $\log5$。

Slide 留了一个问题：“what might be suboptimal about this method?” Slide 没有给答案，下面两点是自己的看法。第一，skew 只能抬高见过的 state，density 为 0 的地方永远抽不到，走出已知区域仍然要靠 policy 追 goal 时偶然的偏差；第二，它把“多样”定义成 state 上的 uniform，而上面 DIAYN 一节的 slide 说过，多样的 goal 不等于多样的 task。

:::back
KL 和 entropy 在[第 7 站](#vi)；SAC 在[第 5 站](#q)和[第 8 站](#cai)；goal-conditioned 的 relabeling 在[第 1 站](#il)，[第 16 站](#multitask)还会再讲。
:::

:::from
无监督学 behavior 的三个动机、“How can you prepare for an unknown future goal?”、information theory 的 identity、coverage 与 empowerment（“control authority”）、DIAYN 的直觉和两句提醒、discriminator 的结构、学到的 task 的例子、与 mutual information 的联系（引 Gregor 等 2016）、“a little tweak”、goal reaching as MI 与 “this is often where a lot of interesting stuff happens”、RIG 与 Skew-Fit、“what might be suboptimal about this method?”，来自 [Spring 2026 Lecture 23](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-23.pdf)（只读到文字，公式是图）。DIAYN 的 objective $F(\theta)$、lower bound、pseudo-reward、Algorithm 1、uniform 的 $p(z)$ 与 50 个 skill、$-\log p(z)$ 的理由来自 [DIAYN 论文](https://arxiv.org/pdf/1802.06070)；$I(S;G)$ 的写法、weight $q^\alpha$ 与 SIR、各实验的 $\alpha$、Lemma 3.1 与 3.2 的条件、VAE 怎样估 density 来自 [Skew-Fit 论文](https://arxiv.org/pdf/1903.03698)。Slide 最后一页还列了 Go-Explore 和 HOMER，这一页没有读它们，也没有写。Empowerment 的两个数、4 个 skill 的 mutual information 数表（seed 0）、Skew-Fit 的数表和 iteration、“what might be suboptimal”的两点是为这一页写并用 `python3 -I` 算的。
:::

## [multitask] Multi-task RL：goal relabeling、successor representation、hierarchy 与 meta-RL

:::skip
不在快速路线里；做 multi-task 或 goal-conditioned 的真机 policy 的不要跳。能说出 multi-task RL 为什么就是一个 joint MDP 上的 single-task RL、relabeling 为什么要 off-policy 的 algorithm，能在一个 chain 上用 successor feature 和 GPI 拼出新 task 的 optimal policy，能说出 meta-RL 的 RNN policy 为什么不能在 episode 之间重置 hidden state，就可以去第 17 站。
:::

### 为什么一个 policy 要学很多 task

Lecture 24 从 generalist model 讲起：segmentation、classification、captioning、VQA、sentiment、summarization 曾经各有各的 model，现在被一个 foundation model 加 fine-tuning 或 prompt 取代（CLIP、SAM、LLM）。核心想法是 multi-task learning 让每个 task 需要的 data 大幅减少。RL 里的对应：policy 以一个 task context $\omega$ 为 condition，$\omega$ 可以是一句 language instruction、一个 goal、一款游戏、一个目的地，并问它在 training 时见没见过。同时学多个 task 可以加快学习，也可以给 downstream 的 task 当 pretraining。

能 transfer 什么？Slide 拿游戏的 sprite 说：有的 transfer 很容易，有的不可能；对“钥匙开门、梯子能爬”的 prior knowledge 能加快解题。知识可以存在 Q-function、policy、model（物理规律）、feature 或 latent state 里。

### Multi-task RL 就是一个 joint MDP

把 MDP 0、1、2 合成一个 joint MDP：每个 episode 开始时随机选一个 MDP，把它的编号 $\omega$ 写进 state，$\tilde s=(s,\omega)$。在 joint MDP 上做普通的 single-task RL，学到的 $\pi(a\mid s,\omega)$ 就是 multi-task policy。Slide 问这和普通 RL 有没有不同，答案是 “No”，并提示 HW4 已经这样做过：每个 prompt 是一个 task，policy 以 prompt 为 condition。

既然一样，为什么难？Slide 引 Schaul 等（2019）的 ray interference：with function approximation，学习和 data 的生成耦合在一起时，学习会依次经过多个 plateau，实际效果是 agent “一次只学会一件事”。容易的 task 学得快，会干扰难的 task；在 RL 里容易的 task 有时能形成 curriculum 帮助难的，有时 agent 忙着 exploit 容易的 task，难的 task 的 data 越来越少。两种缓解：curriculum（先学容易的，帮后面的）；relabeling（用 replay buffer 里的经验配上别的 context 再用一次，像 data augmentation）。

### Goal-conditioned RL 与 relabeling

Goal-conditioned RL 是 context 为 goal state 的特例：$\pi(a\mid s,g)$，reward 例如 $r(s,a,g)=-1$ 直到 $s=g$。好处是不必为每个 task 手写 reward，可以 zero-shot 地换新 goal；坏处是实际 train 起来难，而且不是所有 task 都是到达某个 goal。

难在 reward 太 sparse。Hindsight experience replay（HER，Andrychowicz 等 2017）的 bit-flipping 例子：state 是 $n$ 个 bit，action 是翻转其中一位，每个 episode 随机抽起点和 target，没到 target 时 reward 一直是 $-1$。Random 的 behavior 每一步恰好在 target 上的 probability 是 $2^{-n}$，$n=40$ 时是 $9.1\times10^{-13}$，agent 几乎只会看到 $-1$。论文报告不用 HER 的 DQN 只能解 $n\le13$，用了 HER 能解到 $n=50$。

Relabeling 的想法：没到达指定 goal 的 trajectory，恰好到达了别的地方，把那里当 goal 再存一遍，reward 就不再 sparse 了。3 个 bit 的一条 trajectory，起点 000，target $g=111$：

| $t$ | $s_t$ | action | $s_{t+1}$ | 原 goal $111$ 的 reward | relabel 成 $g'=001$ 的 reward |
|---|---|---|---|---|---|
| 0 | 000 | 翻第 1 位 | 100 | $-1$ | $-1$ |
| 1 | 100 | 翻第 3 位 | 101 | $-1$ | $-1$ |
| 2 | 101 | 翻第 1 位 | 001 | $-1$ | $0$ |

原 goal 下三条 transition 全是 $-1$。$g'=001$ 是这条 trajectory 的终点（HER 的 “final” strategy），relabel 之后最后一条 transition 是成功的。HER 的四种挑 $g'$ 的 strategy：final（终点）；future（这条 transition 之后、同一条 trajectory 上的 state 里随机挑 $k$ 个）；episode（同一条 trajectory 上任意 state）；random（整个 training 过程中见过的任何 state）。论文的结论是 future strategy 在 $k=4$ 或 8 时最好，$k$ 再大，普通 replay 的比例太低，反而变差。Relabel 之后的 transition 和原来的一起放进 replay buffer，用 DQN 或 DDPG 这类 off-policy 的 algorithm 学 $Q(s,a,g)$。

::fig[cs285-her] 3 个 bit 的 bit-flipping。上：原来的 target 111 一次也没到，三条 transition 的 reward 全是 $-1$。下：把终点 001 当成 goal 再存一遍，最后一条 transition 变成 reward 0 的成功例子；future strategy 还会把 101 当 goal，给第二条 transition 一个成功。

:::wrong Relabel 之后的 transition 仍然是 on-policy 的 data，可以直接拿去做 policy gradient
Action 是 policy 为了原 goal $111$ 选的，在 relabel 之后的问题里它们服从的是 $\pi(a\mid s,111)$，不是 $\pi(a\mid s,001)$。Policy gradient 要求 action 来自当前 policy 在“当前 condition”下的 distribution，对 $g'$ 来说这批 action 是另一个 policy 产生的。比如 $\pi(\cdot\mid s,001)$ 在 $s=000$ 时以 0.9 的 probability 翻第 3 位，而 data 里翻的是第 1 位，这条 transition 的 importance weight 是 $0.1/\pi(\text{翻第 1 位}\mid000,111)$，一般远离 1。Slide 的问题 “Why do we need off-policy?” 的答案就在这里：Q-learning 学 $Q(s,a,g')$ 时对 action 从哪里来不敏感（[第 5 站](#q)），所以 relabeling 总是和 off-policy 的 algorithm 搭配。
:::

Slide 还给了一个 geometric 的直觉：goal-conditioned value function 像是 state 之间的“距离”，可以拿来在 goal 之间做 planning，也可以当 auxiliary loss。

### Successor representation：把 dynamics 和 reward 分开

Slide 说 goal-conditioned RL 很像一个 model：它告诉你从一个 state 到另一个 state 有多容易。顺着这个想法问：要 evaluate 一个 policy，最少需要什么样的 model？“If we can evaluate, we can improve.” 为了推导简单，先假设 reward 只依赖 state。

$$V^\pi(s_t)=\sum_{t'\ge t}\gamma^{t'-t}\,\mathbb E\big[r(s_{t'})\mid s_t\big]=\sum_{t'\ge t}\gamma^{t'-t}\sum_ip(s_{t'}=i\mid s_t)\,r(i)=\frac1{1-\gamma}\sum_i\mu^\pi_i(s_t)\,r(i)$$

最后一步把和 reward 无关的部分收进

$$\mu^\pi_i(s_t)=(1-\gamma)\sum_{t'\ge t}\gamma^{t'-t}\,p(s_{t'}=i\mid s_t)$$

前面的 $1-\gamma$ 让 $\sum_i\mu^\pi_i(s_t)=1$，$\mu^\pi(s_t)$ 是一个 distribution：从 $s_t$ 出发、按 geometric 的 weight 看未来，落在各个 state 的 probability。这就是 successor representation（Dayan 1993）。$V^\pi=\frac1{1-\gamma}\mu^{\pi\top}r$：dynamics 和 policy 都在 $\mu$ 里，reward 只出现在最后一个 inner product。

它满足一个 Bellman equation，把 $t'=t$ 那一项拿出来：

$$\mu^\pi_i(s_t)=(1-\gamma)\,\delta(s_t=i)+\gamma\,\mathbb E_{a_t\sim\pi,\,s_{t+1}\sim p}\big[\mu^\pi_i(s_{t+1})\big]$$

“reward”是 indicator $\delta(s_t=i)$，所以能像学 value function 一样学 $\mu$。写成 matrix，$M^\pi=(1-\gamma)\,(I-\gamma P^\pi)^{-1}$：正是[第 14 站](#theory)那个每行和为 $1/(1-\gamma)$ 的 matrix 乘上 $1-\gamma$，行和变成 1。

一个 chain：state $0..4$，action 是往左或往右（到两端停住），$\gamma=0.9$。$\pi_R$ 一直往右。从 state 0 出发，$\pi_R$ 在第 $t$ 步到 state $\min(t,4)$，所以

$$\mu^{\pi_R}(0)=0.1\times\big(1,\ 0.9,\ 0.81,\ 0.729,\ 0.9^4+0.9^5+\cdots\big)=(0.1,\ 0.09,\ 0.081,\ 0.073,\ 0.656)$$

最后一项是 $0.1\times0.6561/0.1=0.656$。

Slide 列了 successor representation 的三个问题：学它是否比 model-free RL 容易并不清楚；怎样扩展到很大的 state space；怎样推广到 continuous state。

### Successor feature 与 GPI

Feature 的个数远小于 state 数时学起来容易得多。取 feature $\phi(s)$，successor feature 是 $\psi^\pi_j(s_t)=\sum_s\mu^\pi_s(s_t)\phi_j(s)$。如果 reward 是 feature 的 linear combination $r(s)=\phi(s)^\top w$，那么

$$V^\pi(s_t)=\frac1{1-\gamma}\,\psi^\pi(s_t)^\top w$$

对 $(s,a)$ 定义同样的 $\psi^\pi(s,a)$，$Q^\pi(s,a)=\psi^\pi(s,a)^\top w$（Barreto 等 2017 的写法不除 $1-\gamma$，下面跟论文）。$\psi$ 学一次，换一个 task 只要换 $w$。

两种用法。Idea 1：给一个新的 $w$，立刻得到 $Q^\pi=\psi^{\pi\top}w$，取 $\arg\max_a$ 就是对 $\pi$ 做了一步 policy improvement。Slide 的评价是“better than nothing, but not optimal”。Idea 2：手里有多个 policy $\pi_1,\dots,\pi_k$ 的 $\psi$，在每个 state 上选所有 policy 里 $Q$ 最大的那个 action：

$$\pi(s)=\arg\max_a\ \max_i\ \psi^{\pi_i}(s,a)^\top w$$

这叫 generalized policy improvement（GPI）。Barreto 等的 Theorem 1：如果各个 $Q^{\pi_i}$ 的估计 error 都不超过 $\epsilon$，这样得到的 $\pi$ 满足 $Q^\pi(s,a)\ge\max_iQ^{\pi_i}(s,a)-\frac{2}{1-\gamma}\epsilon$；$\epsilon=0$ 时它不比任何一个 $\pi_i$ 差。

Chain 上用 one-hot feature（$w$ 就是每个 state 的 reward），两个已学好的 policy：$\pi_R$ 一直往右，$\pi_L$ 一直往左。新 task 是 $w=(1,\ 0,\ 0,\ 0,\ 0.9)$：两端都有 reward，左端多一点。从各 state 出发的 value（$V(s)=\sum_t\gamma^tr(s_t)$，含出发时的 state）：

| State | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| $V^{\pi_R}$ | 6.905 | 6.561 | 7.290 | 8.100 | 9.000 |
| $V^{\pi_L}$ | 10.000 | 9.000 | 8.100 | 7.290 | 7.461 |
| 只用 $\pi_R$ 做 Idea 1 | 10.000 | 6.561 | 7.290 | 8.100 | 9.000 |
| GPI | 10.000 | 9.000 | 8.100 | 8.100 | 9.000 |
| Optimal $V^*$ | 10.000 | 9.000 | 8.100 | 8.100 | 9.000 |

只用 $\pi_R$ 改进一步，state 2 上比较的是 $Q^{\pi_R}(2,\text{left})=0+0.9\times V^{\pi_R}(1)=5.905$ 和 $Q^{\pi_R}(2,\text{right})=7.290$，选了右；可往左走到 0 停住的价值是 8.1，$\pi_R$ 的 $Q$ 里没有这条路。GPI 在 state 2 还看 $Q^{\pi_L}(2,\text{left})=8.1$，选左。结果在每个 state 上都是 optimal 的：靠左的三个 state 跟 $\pi_L$，靠右的两个跟 $\pi_R$。

::fig[cs285-sr] Chain 上的 GPI。上面两行是两个已学好的 policy，下面一行是 GPI 对新 reward（左端 1、右端 0.9）在每个 state 选的 action 和 value，和 optimal 一致；“只用 $\pi_R$ 改进一步”在 state 1、2 上选错了方向。

Continuous state 时，sample 到的 state 上 $\mu$ 几乎总是 0（它是 density，不是 probability）。C-learning（Eysenbach、Salakhutdinov、Levine 2020）改学一个 classifier：$C(F=1\mid s_t,a_t,s_+)$ 判断 $s_+$ 是从 $(s_t,a_t)$ 出发的未来 state（positive，未来时刻按 geometric distribution 抽），还是从 marginal $p(s_+)$ 随便抽的（negative）。Bayes-optimal 的 classifier 满足

$$\frac{C}{1-C}=\frac{p^\pi(s_+\mid s_t,a_t)}{p(s_+)}$$

于是 classifier 的 odds 乘上 $p(s_+)$ 就是 successor 的 density。Slide 说这个 Monte Carlo 版本是 on-policy 的，也可以推出 off-policy 的版本：论文用下一个 state 当 positive（weight $1-\gamma$），再把 marginal 抽的 state 按 $\gamma\,C/(1-C)$（在 $(s_{t+1},a_{t+1})$ 上算、stop gradient）当 positive，形式上就是 TD。

### Hierarchical RL

经典的视角是 option（Sutton、Precup、Singh 的 framework）：一个 option 由三样东西组成，initiation set（可以从哪些 state 开始）、termination set（在哪些 state 结束）和 option policy（一个普通的 policy）。高层 policy 在 option 之间选，一个 option 一旦开始就执行到结束。Slide 问为什么这是好主意、又为什么可能是坏主意，并指出 option 从哪里来是问题：和 policy 一起 end-to-end 地学 option（Bacon 等的 option-critic），可能把 hierarchy 的大部分好处都抵消掉。

另一种看法：option 本身就是 multi-task policy。低层是 $\pi(a\mid s,z)$，高层选 $z$。$z$ 可以是上一站 DIAYN 学到的 skill，可以是 goal（slide 引 Nachum 等的 data-efficient HRL：有好的 goal-conditioned policy 时效果很好），也可以是一句 language（slide 引 Zhou 等的 ArCHer）。这几篇论文这一页没有读，只用了 slide 的描述。

### Meta-RL

Supervised 的 meta-learning：每个 task 给一个很小的 training set 和一个 test input，要预测 test label；把整个 training set 读进来的一种办法是 RNN。被“学”的东西有两层：meta-learned 的 weight，以及读完 training set 之后 RNN 的 hidden state，后者就是“adapt 之后的 parameter”。

Meta-RL：task 之间有差别，例如 robot 要以 0.5、0.7、$-0.2$、$-0.7$ m/s 等不同速度跑，但 policy 事先不知道是哪一个，只能从自己的经验里推断。Contextual policy 是 $\pi(a\mid s,\omega)$，这里 $\omega$ 看不见，换成 RNN 的 hidden state：policy 读进到目前为止的 $(s,a,r)$，hidden state 里存它对 task 的推断。关键是 hidden state 在同一个 task 的多个 episode 之间不重置，optimize 的是整个 meta-episode 的 total reward。Slide 说这样 RNN policy 会自动学会 explore。

用一个两个 arm 的 bandit 看“学会 explore”是什么意思。Task 1 里 arm A 以 0.9 的 probability 给 1，task 2 里以 0.1；arm B 在两个 task 里都以 0.5 给 1；两个 task 各一半。每个 task 拉 10 次，算 total reward 的 expectation：

- 不看历史的 policy，每次拉 A 和拉 B 的 expected reward 都是 0.5，10 次共 5.0。
- 先拉一次 A：中了，task 1 的 posterior 是 $0.5\times0.9/(0.5\times0.9+0.5\times0.1)=0.9$，之后每次拉 A 的 expected reward 是 $0.9\times0.9+0.1\times0.1=0.82$；没中，task 1 的 posterior 是 0.1，改拉 B 每次 0.5。共 $0.5\times(1+9\times0.82)+0.5\times(0+9\times0.5)=6.44$。
- 对 posterior 做完整的 dynamic programming（Bayes-optimal），是 6.556。

第一次拉 A 本身的 expected reward 并不比拉 B 高，它的价值是 information。这件事只有 hidden state 记得“上次拉 A 中没中”时才做得到；每个 episode 重置 hidden state，policy 又回到 5.0。

::fig[cs285-meta] 两个 arm 的 meta-RL。第一次拉 A 是 exploration：结果改变了对 task 的 posterior，后面 9 次按 posterior 选 arm。不看历史的 policy 每次只能拿 0.5。

Slide 最后把 meta-RL 看成 partially observed RL：task 是 state 里看不见的部分，policy 要 encode 解决当前 task 需要的信息，也就是 belief state。带 memory 的 policy（in-context learning）是最简单的做法，其他做法有 variational inference 和基于 gradient 的方法。

:::back
Goal-conditioned BC 的 relabeling 在[第 1 站](#il)；$(I-\gamma P^\pi)^{-1}$ 在[第 14 站](#theory)；DIAYN 的 skill 在[第 15 站](#skills)；belief state 在 [CS4246 的 pomdp 站](../courses/CS4246.html#pomdp)。
:::

:::from
Generalist model、task context、multi-task 的好处与 transfer、joint MDP 与 “No”、ray interference（引 Schaul 等）、curriculum 与 relabeling、goal-conditioned policy 的优缺点、goal relabeling、“why do we need off-policy?”、geometric 直觉、“if we can evaluate, we can improve”、successor representation（Dayan 1993）与它的三个问题、successor feature、两种用法与 “better than nothing, but not optimal”、continuous 时 $\mu$ 为 0、C-learning、option 的三个组成、option-critic 的问题、goal 与 language 的 hierarchy、supervised 与 RL 的 meta-learning、不同速度的 task、hidden state 不重置、“learns to explore”、meta-RL 即 partially observed RL，来自 [Spring 2026 Lecture 24](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-24.pdf)（只读到文字，公式是图）。Bit-flipping 的设定和 13、40、50 这三个数、Algorithm 1、四种 relabel 的 strategy与 $k=4$ 来自 [HER 论文](https://arxiv.org/pdf/1707.01495)；ray interference 的描述来自 [Schaul 等 2019 的摘要](https://arxiv.org/abs/1904.11455v1)；successor feature 的定义、$Q=\psi^\top w$ 与 Theorem 1、2 来自 [Barreto 等 2017](https://arxiv.org/pdf/1606.05312)；C-learning 的 classifier、density ratio、on-policy 与 off-policy 的形式来自 [C-learning 论文](https://arxiv.org/pdf/2011.08909)（抓取工具只给了重述）。Successor representation 的推导与 Bellman equation 按 slide 的顺序自己补全；option 的 framework 和 option-critic、Nachum 等、ArCHer、RL² 一类的 RNN meta-RL 论文没有读。3 bit 的 relabel 表、importance weight 的例子、chain 上的 SR 与 GPI 数表、两个 arm 的 meta-RL 计算是为这一页写并用 `python3 -I` 算的。
:::

## [open] Challenges and open problems：RL 作为工程工具、在真实世界里、作为通用的 learning

:::skip
不在快速路线里，没有新的 algorithm。这一站是 Lecture 25 的论证：把整门课的 algorithm 放回三个视角里，看各自缺什么。读完能说出“能 simulate 就能 control”这句话的力量和代价、easy universe 与 hard universe 差在哪三件事、offline RL 为什么是“用便宜的 data 学 world、用 reward 定义 task”这套 recipe 的中心，就读完了这一页的讲义部分。
:::

### 整门课的地图

Lecture 25 开头把课程画成一棵树，问 “Why so many RL algorithms?” 把它和这一页的站对上：

| Lecture 25 的分支 | 本页 |
|---|---|
| Imitation learning | [第 1 站](#il) |
| Policy gradient（TRPO、PPO） | [第 3 站](#pg)、[第 6 站](#trpo)、[第 10 站](#llm) |
| Value-based、actor-critic、Q-function actor-critic（SAC） | [第 4 站](#ac)、[第 5 站](#q) |
| Model-based control 与 model-based RL | [第 11 站](#mbrl) |
| Offline RL | [第 12 站](#offline) |
| Exploration、unsupervised RL | [第 13 站](#explore)、[第 15 站](#skills) |
| Probabilistic inference、control as inference、inverse RL | [第 7 站](#vi)、[第 8 站](#cai)、[第 9 站](#irl) |

答案在[第 2 站](#basics)已经给过：sample efficiency、stability、假设不同，没有一个 algorithm 在所有维度上最好。Slide 接着给 RL 两个定义：learning-based decision making 的数学 formalism；以及一种从经验中学习 decision making 和 control 的方法。和 supervised learning 的区别是多了 action 和 consequence：animal（肌肉收缩，看到和闻到的，食物）、robot（motor current，camera image，跑的速度）、business（采购决策，库存，利润）。例子是 Rudin 等（2022）端到端学 locomotion 和 local navigation、slide 上链接到 pi.website 的 robot 视频，以及 Hugging Face 介绍 LLM 的 RLHF 的博客。

Lecture 25 从三个视角讨论 RL 现在缺什么。

### 视角一：RL 是一个工程工具

传统的控制系统工程是三步：characterize（测出系统的参数）、simulate（写出 model）、control（在 model 上设计 controller）。RL 把第三步换掉：characterize、simulate、run RL。Slide 把 RL 叫做一个强大的“inversion engine”：只要能 simulate，就能 control，不必手工推 controller。今天工业界多数 RL 的用法都基于这一条。

Slide 的三个例子都是“在 simulator 里学”：AlphaGo（规则就是 simulator）；LLM 的 RL，slide 说它也常常是在“simulation”里学，和真实使用之间有很大的 gap，[第 10 站](#llm) HW4 的 verifier 就是这样一个 simulator，它只检查答案对不对；sim-to-real 的 robot（[第 2 站](#basics)算过，10000 倍速的 simulator 可以把 sample efficiency 的劣势变成 wall clock 的优势）。

主要的弱点同样写在 slide 上：仍然需要一个 simulator。能 simulate 的东西才能这样 control。

::fig[cs285-pipeline] Lecture 25 的三种流程。上：传统的控制工程，characterize、simulate 之后人来设计 controller。中：把最后一步换成 RL，simulator 越准越好用。下：真实世界“自己 simulate 自己”，没有 sim-to-real gap，但 data 只能以真实时间收集，失败的代价是真的。

### 视角二：RL 与真实世界

Moravec 的观察：感知和运动是人人都擅长、进化了很久的能力，抽象思维是新近才有、还没完全掌握的能力。Slide 引 Pinker 的总结：AI 研究的主要教训是难的问题其实容易、容易的问题其实难，婴儿就会的认脸、走路，在工程上最难。Slide 的评论是这个 paradox 与其说是关于 AI，不如说是关于物理世界：

| | “Easy” universe | “Hard” universe |
|---|---|---|
| 成功意味着 | 高 reward（optimal control） | 活下去（good enough control） |
| 世界 | closed world，规则已知 | open world，一切都要从 data 里来 |
| Simulation | 大量 | 没有，规则未知 |

问题是 RL 能不能在 hard universe 里 generalize 和 adapt。Slide 说人在这类任务上极其擅长：外部监督极少，要适应意外的情境，要自主地找到解法，还得活下来才能找到；现在的 AI 系统在这方面很差，原则上只有 RL 能做到。具体的开放问题：怎样用经验和 prior data 去 generalize；怎样在持续变化的环境里完全自主地学；怎样告诉 RL agent 我们想要什么；怎样用过去的经验引导 exploration；环境变了怎样保持 robust。这不只是 robot 的问题，robot 只是最容易想象的例子。

Slide 的例子是 Gupta 等（2021）的 reset-free RL：robot 用 multi-task learning 互相当彼此的 reset，没有人工干预地学 dexterous manipulation，和[第 16 站](#multitask)的 multi-task 是同一类想法。真实世界里学的好处是 “the real world simulates itself”：没有 sim 与 real 的 gap，没有 train 与 test 的 mismatch；难处是要在真实的约束下学。Slide 说这是 continual learning 和 self-improving system 的关键，也是当前 RL 方法的前沿。

:::wrong RL 在 Go 和 Atari 上超过了人，hard universe 只是更大、更费 sample 的同一类问题
上表三行都不同。Go 的成功是 reward 高，规则已知，可以 simulate 几百万局；hard universe 里的成功是“活下去”，规则未知，没有 simulator，经验以 1 倍的真实时间到来，失败会终止学习本身。[第 13 站](#explore)的 combination lock 只要 $n=40$ 就需要 $2.2\times10^{12}$ 步的 random exploration，那还是一个规则不变、可以无限次 reset 的问题。Slide 列的开放问题（用 prior data generalize、无 reset 地自主学、告诉 agent 要什么、robust）没有一个是靠更多 sample 自动解决的。
:::

### 视角三：RL 作为“通用”的 learning

Deep learning 为什么 work：大 model 加大 dataset。小规模的 labeled data 贵，海量的 unlabeled data 便宜；unsupervised learning（例如 LLM 的 pretraining）减轻了监督的负担。Slide 补了一句：这也许解释了为什么 prompt LLM 是一门艺术，pretraining 没有告诉 model 我们要什么。

再退一步。Slide 引 Daniel Wolpert：大脑的主要功能是产生 adaptable、complex 的运动。类比到 machine learning：它唯一的目的是产生 adaptable、complex 的 decision。给图打 label 也是为了某个 decision：给用户的照片打 tag、在 camera trap 里找濒危动物。

于是有一个分工：大量事先收集的 data 告诉我们 world 怎样运作（dynamics），reward function 定义 task。RL 用来消化“便宜”的已有 data，train 出最好的初始 model，再 adapt 到新 task。Slide 写成一个 recipe：从大量多样、质量未必高的 behavior data 出发；用 offline RL 学点什么，可以是 goal-conditioned RL（[第 16 站](#multitask)）、self-supervised skill discovery（[第 15 站](#skills)）、人定义的 skill，或者一个 model；再用到 downstream 的 task 上。[第 12 站](#offline)的 offline RL 正是这个 recipe 的中心。

Slide 的例子是 Hong、Levine、Dragan（2023）的 dialogue agent。任务是“做一个能教人 behavioral cloning、会问 clarifying question 的对话 agent”。做法是“model-based”的：让 LLM 扮演“human simulator”，生成大量想象出来的对话，这些对话不必好，只要合理；再在这些 data 上做 offline RL，RL 去看 model 认为可能发生的情况，推断出怎样才能得到好结果。Slide 的结论是 RL 加 LLM 适合那些 LLM 容易 simulate、却难以 optimal 地去做的 task。这和视角一的 “simulate 就能 control” 是同一个结构，只是 simulator 换成了 LLM。

### 缺什么、怎样回答

Slide 的最后部分问：learning 的 signal 从哪来？列出的候选：LeCun 的“蛋糕”（unsupervised、self-supervised learning）；model learning（预测未来）；世界的 generative modeling；在达成 goal 之前有很多事可做；模仿和理解其他 agent；social 与 cultural 的学习；value 的全局 backup（“just need that +1”）；或者以上全部。

怎样回答这些问题，slide 的建议：选对问题，问“这有没有机会解决一个重要的问题”；optimism in the face of uncertainty 是好的 exploration strategy（[第 13 站](#explore)的结论用在研究上）；不要怕改 problem formulation；很多挑战不能靠在现有 benchmark 上 iterate 解决；application 很重要，在现实而困难的 domain 里用方法，才会暴露缺的关键部件，RL 历来忽视这一点。最后一句是 “Think big and start small”。

:::from
整页内容来自 [Spring 2026 Lecture 25](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-25.pdf)（只读到文字，slide 里没有公式），包括课程的树、RL 的两个定义和三个例子、三个视角、characterize–simulate–RL、“inversion engine”、AlphaGo、LLM 与 sim-to-real 的例子、Moravec 与 Pinker、easy 与 hard universe 的表、开放问题的列表、Gupta 等 2021、“the real world simulates itself”、大 model 加大 data、Wolpert、data 与 task 的分工、offline RL 的 recipe、Hong 等 2023 的 dialogue agent、signal 的来源、最后的建议。Slide 引的论文都没有读，只用了 slide 上的描述。和本页各站的对应、combination lock 的数字、wall clock 的算账、HW4 verifier 的类比是自己加的。Lecture 21、22 是 midterm review，Lecture 21 只读了 slide 标题，确认是对 Lecture 2–10 的复习，没有新内容；Lecture 22 没有读。
:::

## 作业

五份作业都在 GitHub 的 `berkeleydeeprlcourse/homework_spring2026` 里，handout 公开。所有命令都用 `uv run` 执行（每个作业带 `pyproject.toml` 和 `uv.lock`，HW1 的 README 明确说不要直接跑 `python` 或 `pip`）；autograder 在 Gradescope，课程提供的 Modal 额度只给注册学生，自学时没有人给分，用 handout 里的目标数字当 test。HW1 的 README 说新注册的 Modal 账号会有 30 美元的免费额度，对 HW1 绰绰有余。下面每条提示后面注明来源：handout 指对应作业的 PDF，README 和代码指 starter code 仓库，“调研”指本站调研条目里的说法，“经验”是没有官方出处的工程经验。

| 作业 | 本地 CPU | 需要 GPU 的部分 | 免费 Colab | 优先级 |
|---|---|---|---|---|
| HW1 Imitation | 够，几分钟一个 run | 无 | 够 | 先做 |
| HW2 Policy gradient | 够，每个 run 几秒到约 10 分钟 | 无 | 够 | 值得做 |
| HW3 DQN 与 SAC | CartPole、LunarLander、InvertedPendulum、Hopper 够 | MsPacman、HalfCheetah 在 GPU 上约 3 小时一个 run | 勉强，长 run 会断 | 先做 |
| HW4 LLM RL | 不够 | 全部，约 8 个 H100 小时 | 不够 | 值得做 |
| HW5 Offline RL | 不够 | 全部，单个 run 最长约 6 小时 | T4 算力够，会话会断 | 先做 |

### 环境：uv、MuJoCo 与没有显示器的服务器

- 每个作业目录里 `uv sync` 装好依赖，之后一律 `uv run ...`；要用 WandB 的先 `uv run wandb login`，用 Modal 的先 `uv run modal token new`（README）。
- Python 版本各不相同，`uv` 会按 `pyproject.toml` 自己装：HW1 和 HW5 要 3.11 以上，HW2 要 3.10 以上，HW3 必须是 3.10，HW4 是 3.12（pyproject）。
- HW2、HW3 用的不是 Gymnasium，而是旧版的 `gym[...,mujoco,box2d]==0.25.2`，`env.step` 返回四项（pyproject、代码）。HalfCheetah-v4、InvertedPendulum-v4、Hopper-v4 走的是 pip 的 `mujoco` 包，不需要 license，也不需要更旧的 `mujoco-py`（调研，与 pyproject 一致）。
- LunarLander 依赖 Box2D，`box2d-py` 编译时需要系统里有 `swig` 和 `cmake`，Mac 上 `brew install swig cmake`、Ubuntu 上 `sudo apt-get install swig`；本地装不上可以全部改在 Modal 上跑（HW2、HW3 的 README）。
- 在没有显示器的服务器上录 MuJoCo 视频，设 `MUJOCO_GL=egl`（有 NVIDIA driver）或 `MUJOCO_GL=osmesa`，否则会报 OpenGL 相关的错（经验）。

### HW1：Imitation learning（Push-T 上的 MSE chunking policy 与 flow matching policy）

**要实现的**：Push-T 的 observation 是 5 维（T 和 agent 的位置），action 是 2 维（agent 的目标位置）。在 `model.py` 里写 `MSEPolicy`（一次输出 $K$ 步的 action chunk，loss 是 handout 的 Eq. 1）和 `FlowMatchingPolicy`（loss 是 Eq. 2，inference 用 Eq. 3 的 Euler），在 `train.py` 里写 training loop。**做完会的**：[第 1 站](#il)的全部内容，亲眼看到 MSE policy 在 T 两侧都能推时的表现和 flow policy 的区别。**时间和算力**：handout 说小 MLP 在笔记本 CPU 上几分钟训完。**优先级**：先做。

- Flow matching 的 network 必须以 $\tau$ 为 input（handout）。漏掉时会发生什么，第 1 站在一维的例子上算过：12% 的 sample 停在两个 mode 中间。
- 训练中要周期性调用 `evaluate_policy`，不要改它；结束时调用 `logger.dump_for_grading()`（handout）。
- 目标：MSE policy 的 reward 至少 0.5，flow policy 至少 0.7（handout）。
- Optimizer 用 PyTorch 自带的 Adam，train step 加 `torch.compile`，handout 说提速明显。README 说 Modal 对这份作业多半没必要，测试时笔记本 CPU 反而快得多。
- 报告要求根据视频比较两种 policy。MSE policy 学的是 conditional mean，T 两侧都可以推的 state 上它会输出两种推法的平均；从这里入手看视频（调研里的理解，handout 没有给结论）。

### HW2：Policy gradients（reward-to-go、baseline、GAE）

**要实现的**：`pg_agent.py` 里 full return 与 reward-to-go 两种 $Q$ 值、neural network baseline、advantage normalization、GAE 的 recursion；四个实验分别在 CartPole-v0、HalfCheetah-v4、LunarLander-v2（noisy action）、InvertedPendulum-v4 上。**做完会的**：[第 3 站](#pg)、[第 4 站](#ac)的每一个 formula 都写成代码，并用曲线看到 causality、baseline 和 $\lambda$ 的作用。**时间和算力**：每个 run 在笔记本 CPU 上几秒到约 10 分钟，handout 明确建议用 CPU 而不是云 GPU，把额度留给后面的作业。**优先级**：值得做（第 5 站以后都建立在它上面，但概念比代码重要）。

- 画图的横轴用 `Train_EnvstepsSoFar`，不是 iteration；InvertedPendulum 要求在 100K 个 environment step 内到 1000（handout）。
- Seed 之间 variance 很大，正确的实现也可能出一次坏 run；handout 说 2 到 3 次之内应该能拿到达标的 run，否则回头查实现。
- LunarLander 扫 $\lambda\in\{0,0.95,0.98,0.99,1\}$ 时不要动其他 hyperparameter（handout）。
- 目标值：CartPole 最好的配置到 200；HalfCheetah 带 baseline 最终超过 300；LunarLander 最好的 $\lambda$ 至少一次超过 150（handout）。
- Advantage 在乘进 pseudo-loss 之前要 detach，否则 gradient 会流进 baseline network；pseudo-loss 的数值不说明任何问题，看 return（经验，第 3 站）。
- `-na`（advantage normalization）在简单环境里常常能代替 baseline，handout 在 HalfCheetah 实验里故意不加它，就是为了让你看到 baseline 的作用。

### HW3：Q-learning 与 actor-critic（DQN、Double DQN、SAC）

**要实现的**：DQN 的 critic update、$\varepsilon$-greedy、target network、Double DQN；SAC 的 bootstrapped critic（hard 与 soft target update）、entropy bonus、reparameterized actor、自动 temperature、clipped double-Q。**做完会的**：[第 5 站](#q)的全部，以及一套以后可以直接拿去做机器人 RL 的 off-policy 代码。**时间和算力**：CartPole、LunarLander、InvertedPendulum、Hopper 本地即可；MsPacman 和 HalfCheetah 即使在 GPU 上也约 3 小时一个 run，handout 建议用 Modal 并尽早开始。没有课程额度时用实验室 GPU；Colab 免费版的会话时长有限，HW3 的 starter code 不像 HW5 那样自带 checkpoint 续跑，3 小时的 run 要自己加（代码，经验）。**优先级**：先做。

- Critic 的 sanity check（InvertedPendulum，没有 actor）：Q 值应稳定在一个合理的值；发散到无穷大或一直是 0 就是 bug（handout）。
- Entropy 的 sanity check：`sanity_invertedpendulum.yaml` 上 1 维 tanh-squashed action 的 entropy 应升到约 $\log2\approx0.69$，明显偏高或偏低就有 bug（handout）。`log_prob` 里的 tanh 修正 starter code 已经做了（`make_tanh_transformed`）；一路涨过 1，多半是 entropy 算在了 tanh 之前的 Gaussian 上；不涨，多半是 `entropy()` 里用了 `.sample()`（代码；读法是第 5 站的推导）。
- Actor loss 里用 `.rsample()`（handout：“Be careful to use the reparametrization trick for sampling!”）。
- 目标：CartPole-v1 至少一次到 500，LunarLander-v2 至少一次到 200，MsPacman 约 1500，Hopper 上 clipped double-Q 至少一次到 1500（handout）。HW3 的 CartPole 是 v1，HW2 的是 v0，满分分别是 500 和 200（config）。
- 别忘了在 `update()` 里调用 `update_actor()` 和 `update_alpha()`（handout）。
- MsPacman 用默认 config（double Q 开着，`target_update_period: 2000`、`clip_grad_norm: 10.0`），到不了约 1500 多半是实现的问题（handout，config）。
- Critic 的输出要是 `(num_critic_networks, batch_size)`，starter code 里每一步都 assert 了 shape，不要为了让它通过而乱 reshape：多出一个长度为 1 的维度时，和 shape 为 `(batch_size,)` 的 reward 相加会 broadcast 成 `batch_size × batch_size` 的矩阵，loss 照样算得出来，不报错（代码；broadcast 的后果是经验）。
- 长 run 用 Modal 时加 `--detach`，结果用 `uv run modal volume get hw3-ql-volume exp/` 下载（handout）。
- Hopper 上比较 single Q 与 clipped double Q 时把 Q 值曲线也画出来，overestimation 在 Q 值上比在 return 上明显（handout 要求画，读法是经验）。

### HW4：LLM RL（GR-REINFORCE 与 GRPO）

**要实现的**：token log-probability 与 completion mask、approximate KL、minibatch iteration、group advantage、`Reinforce.update` 和 `GRPO.update`；在 format copy（把一个整数抄进 XML）和 MATH level-5 子集上做 outcome reward 的 post-training，加至少 5 个 GRPO 的 hyperparameter 变体。**做完会的**：[第 10 站](#llm)的全部，以及 LLM RL 代码里最容易错的 mask 和对齐。**时间和算力**：format copy 约 5 分钟，math 的 GR-REINFORCE 约 2 小时，GRPO 约 5 小时；handout 说整份作业约 8 个 H100 小时，建议不超过 Modal 额度的三分之一。免费 Colab 不够；自学者要自付 GPU 费用或用实验室的卡。**优先级**：值得做；如果目标是 VLA 和 LLM 的 post-training，提前到先做。

- 先跑 format copy 调通再跑 math。format copy 结束时 reward 接近 1.3、eval exact match 接近 1.0，eval 明显低于 0.8 就要 debug（handout）。
- Reward 到第 10 步左右还没涨，先查 mask 和 logprob 的对齐：position $t-1$ 的 logits 预测 token $t$（handout）。
- RL 之前 math 的 eval 应约 0.23；远低于它，先查 generation 和 parsing，不是 RL 的问题（handout）。
- 目标：math GRPO 最终 eval 超过 0.37（低于约 0.35 要查），GR-REINFORCE 约 0.31（低于约 0.27 要查）。Rollout reward 本来就很吵，比较 algorithm 看 eval 曲线（handout）。
- Group normalization 之前把 reward reshape 成 `[num_groups, group_size]`；GRPO 的 ratio 用 rollout 时缓存的 logprob（handout）。
- 四条必跑命令不能改任何 flag，autograder 依赖它们（handout）。
- 读 WandB 里的 sampled generation：一组 8 个回答 reward 全相同时 advantage 全是 0，这类 group 多，学得就慢（经验，第 10 站的表）。

### HW5：Offline RL（SAC+BC、IQL、FQL，OGBench）

**要实现的**：`sacbc_agent.py`、`iql_agent.py`、`fql_agent.py`，在 OGBench 的 cube-single 和 antsoccer-arena 上调 $\alpha$；antmaze-medium 只用来 debug。**做完会的**：[第 12 站](#offline)的全部，三种“用固定 data 做 RL”的主流做法各写一遍，其中 FQL 把第 1 站的 flow policy 接上了 Q-learning。**时间和算力**：单个 run 最长约 6 小时；handout 建议一张 GPU 并行跑 4 个 agent，4 个 agent 到 1M 步在 T4 上 3 到 7 小时、A10 上 2 到 6 小时，视 algorithm 而定。T4 级别的卡就够，但免费 Colab 的会话会断。Starter code 已经处理了续跑：`run.py` 每次 eval 时把 agent、所有 optimizer 和 random state 存成 `checkpoint.pt`，同一条命令再跑一次就从最近的 checkpoint 接着跑（README、代码）；offline 的 dataset 是固定的，没有 replay buffer 要存。在 Colab 上把 `exp/` 放到挂载的 Google Drive 里即可（经验）。**优先级**：先做。

- 每个 Bellman backup 都要带 done（handout）。
- BC 项对 action 维取 mean，handout 给的 $\alpha$ grid 是按 mean 定的（handout）。
- Q 值的 sanity check：都应在 $[-100,0]$ 里；antmaze 和 antsoccer 上 q_max 趋向 0、q_min 趋向 $-100$；cube-single 的 q_min 可能停在 $-50$ 到 $-70$（handout）。
- 跟踪 dataset action 与 policy action 的 MSE：它随 $\alpha$ 增大而下降，最好的 $\alpha$ 通常在 MSE 略高于纯 BC 下限的地方（handout）。
- FQL：送进 Q 之前把 flow policy 的 action clip 到 $[-1,1]$；distillation 项里不要 clip one-step policy 的 action，否则它没法纠正越界的输出；evaluation 和 backup 都用 one-step policy（handout）。
- antsoccer-arena 上 FQL 和 SAC+BC 的 target 用两个 Q 的平均而不是 min；成功率低是正常的，但不应该是 0（handout）。
- Debug 时可以关掉 `@torch.compile`；antmaze-medium 是最快的 sanity check（handout）。
- 默认值：IQL `expectile=0.9`、`alpha=10`，FQL `flow_steps=10`，三者 `discount=0.99`（config）。

### RL 不报错但不学：先查这几样

1. 横轴是 environment step 吗？多跑了几个 seed 吗？单个 seed 的好坏说明不了问题（HW2、HW3 handout）。
2. Q 值有没有发散、是不是一直是 0、有没有跑出 reward 决定的范围（HW3、HW5 handout）。
3. Bellman target 里有没有 $(1-d)$；episode 是终止还是被时限截断（HW3、HW5 handout；截断的处理见第 4 站，HW3 的 starter code 已经区分）。
4. Advantage 有没有 detach、sign 对不对；pseudo-loss 的数值别当成 performance（经验）。
5. Reparameterized sample 用的是 `.rsample()` 吗，entropy 是在 tanh 之后的 action 上算的吗（HW3 handout 与代码；第 5 站）。
6. Tensor 的 shape 有没有悄悄 broadcast（HW3 代码里的 assert）。
7. LLM 的 loss 有没有只算 completion token，logits 和 token 有没有错一位（HW4 handout）。
8. 拿 handout 的目标数字比；比不上而且换了 2 到 3 个 seed 仍然比不上，回头查实现，而不是调 hyperparameter（HW2、HW3 handout）。

:::note 专门练习找这类 bug
OpenAI Spinning Up 的 Exercise 2.2 “Silent Bug in DDPG” 给一份能跑、不报错、performance 却明显变差的 DDPG：跑有 bug 和没 bug 各 3 个 seed，每个约 10 分钟，然后不看 `core.py` 推断 bug 是什么、怎样破坏了 learning，bonus 是找出哪些 hyperparameter 会掩盖它。Solution 的结果图是在旧版的 HalfCheetah-v2 上画的，所以需要能装旧版 MuJoCo 环境。做完 HW3 之后做它，正好检验上面这张清单；答案在 Spinning Up 的 solution 页，先别看。
:::
