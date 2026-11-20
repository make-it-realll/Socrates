# 前沿公开课清单：给调研者的说明

读者是 NUS 数据科学专业大二学生，在实验室做机器人实验，研究兴趣是机器人自主性、能在边缘平台上跑的机器人模型，以及 robot foundation model 的 pre-training / post-training。他的原话是：领域"现在都太快了，感觉这样上课已经跟不上了。完整的上课的话，只能这样快快的略一遍"。他点名提到的例子：Modern Robotics、Deep Reinforcement Learning、MIT 最近出的扩散模型相关的课。

所以这份清单的目的不是"列出好课"，而是帮一个时间很少的人决定：这门课值不值得花时间、如果只有十几个小时该看哪几讲、作业里哪几个最值得做、做的时候会卡在哪里。**作业是重点。**

## 你的产出

只写一个 JSON 文件（路径在任务里给出），UTF-8，合法 JSON，写完用 `python3 -I -c "import json;json.load(open('<路径>'))"` 校验。不改别的文件，不跑构建，不 commit，不用浏览器、computer-use、memory 工具，不再开子 agent。

```json
{
  "updated": "2026-11-21",
  "group": "robotics",
  "courses": [
    {
      "id": "mit-6.s184",
      "school": "MIT",
      "code": "6.S184",
      "title": "Introduction to Flow Matching and Diffusion Models",
      "zh": "Flow matching 与 diffusion 入门",
      "term": "IAP 2025",
      "instructors": "……",
      "url": "https://……",
      "materials": "lecture video 是否齐全、notes、slides、作业 handout、starter code、autograder/tests 是否公开",
      "why": "两三句：这门课回答什么问题，为什么现在值得学，学完能做什么。",
      "prereq": "真正需要的前置知识，说具体（例如“会写 PyTorch training loop、懂 ODE 的数值解”），并写出本站对应的课程代码（如 ST2131、CS3264）。",
      "related": ["ST2131", "CS3264"],
      "quick": [
        { "part": "Lecture 1–3", "hours": 4, "why": "为什么先看这几讲：它们建立了什么，后面哪些内容依赖它们。" }
      ],
      "skip": "时间少时可以跳过的部分，以及跳过的代价。",
      "assignments": [
        {
          "title": "Lab 1: ……",
          "url": "https://……",
          "build": "要你从零实现什么、最后得到什么（一两句）。",
          "time": "handout 写的预计时间，没写就写“handout 未给出”，可附你的估计并注明是估计。",
          "needs": "算力/环境要求（GPU、显存、Colab 是否够、依赖的 simulator）。",
          "priority": "must | good | optional",
          "tips": [
            "具体、可执行的提示。"
          ],
          "tipsSource": "每条 tip 来自哪里：handout / FAQ / 课程论坛公开帖 / 课程 GitHub issues / 自己的工程经验（要写明）。"
        }
      ]
    }
  ]
}
```

`related` 只能用本站已有的课程代码。可用的有：ST2131 ST2132 ST3131 ST3236 ST3248 ST4248 MA2101 MA2108 MA3220 MA3236 MA3252 MA3270 MA4275 MA4261 DSA2102 DSA3102 DSA4212 CS2040 CS2100 CS2030 CS2106 CS3210 CS3230 CS2109S CS3244 CS3263 CS3264 CS4243 CS4246 CS4248 CS4262 CS4277 DSA4213 EE2023 EE3331C EE3731C EE4308 EE4309 RB2202 RB2203 RB3302 RB4301 CS4278 EE4706。没有合适的就留空数组。

## 规矩

1. **每门课都要在这次调研中真的打开过**：用 WebSearch 找到最新一期的课程主页，WebFetch 读主页、schedule、作业页或 GitHub 仓库。确认它存在、是哪一期、材料公开到什么程度。打不开的不收。
2. **网址不要凭记忆写，也不要自己拼。** 只抓 WebSearch 结果里的地址、已抓页面里出现的链接。自己拼的地址会触发权限提示，整个 session 会停下来等人。
3. **优先最新一期**（2025–2026），并写明期次。如果老一期材料更完整（比如有录像），说明为什么推荐老一期。
4. **作业 tips 要具体，而且要说清楚来源。** 好的 tip 像这样：“handout 要求 BPE 训练在 TinyStories 上 2 分钟以内，朴素地每轮重算所有 pair count 会远超这个时间，要维护增量的 pair 计数”（来源：handout）。不好的 tip 像这样：“注意调参”“多看文档”。优先从 handout、FAQ、课程 GitHub 的 issues、公开的课程论坛帖里找真实的卡点；凭自己的工程经验写的 tip 也可以，但 `tipsSource` 里必须写明“自己的经验”，并且只写你有把握的。不知道就不写，不要编。
5. **quick 路线**是给只有 10–15 小时的人的：挑出最核心的几讲，说清楚为什么是这几讲、它们和作业的关系。
6. **语言**：中文句子，所有术语用英文（diffusion、score function、policy gradient、forward kinematics……），不翻译。不写夸张的话（“必看”“神课”），不写破折号。
7. 版权：不大段照抄 handout，用自己的话转述。

最后的汇报（简短、如实）：收了哪几门；每门实际读了哪些页面（主页、作业 handout、GitHub）；哪些 tips 来自材料、哪些是自己的经验；哪些想收但打不开或核实不了。
