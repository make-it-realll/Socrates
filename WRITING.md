# 写一门课：给写作者的完整说明

Socrates 是一个静态网站，把 NUS 的课程按“一门课拆成几站（subskill），每站讲透”的方式写出来。读者是 NUS 数据科学专业的本科生，母语中文，课程全英文授课、全英文考试。他读这一页是为了把道理真正弄懂，而不是背结论。

**开始之前必须完整读两个文件**：`content/courses/DSA2102.md`（样板，照它的深度、结构和语气写）和 `src/figures/dsa2102.mjs`（图是怎么画的）。本文件说的每一条在样板里都有实例。

## 你只动两个文件

- `content/courses/<CODE>.md`：正文。
- `src/figures/<code 小写>.mjs`：这门课的图（构建时自动载入，不用去改 `build.mjs`）。

别的文件一律不改。不要 `git commit`、`git push`，不要运行 `node src/build.mjs`（它会重写 `docs/`，多人同时写时会互相覆盖）。预览和检查只用：

```
node tools/preview.mjs <CODE>
```

它把这一门课单独构建到 `/tmp/socrates-<code>/`，检查公式有没有渲染失败、版面有没有被撑破、图里的文字有没有伸出画布，并把每张图（`shots/fig-NN.png`）和整页分段截图（`shots/page-NN.png`）存下来。**每张图都要用 Read 打开亲眼看**：文字互相压住、文字压在线上、标注指错地方，这些只有看了才知道。有问题就改到没有为止。

不要使用浏览器工具（`Claude_Browser`、`claude-in-chrome`、`computer`）、memory 工具，也不要再开子 agent。

## 正文的标准

用户对上一版样板提过三次意见，下面每一条都是从那三次意见里来的，缺一不可。

1. **动机来自必要性。** 每个概念出现之前，读者应该已经遇到一个没有它就过不去的问题：一次真实的失败、一个具体的小例子、一个算不下去的地方。不要用生活比喻（“就像水管”“好比图书馆”），用户明确说不想看到“傻傻的比喻”。像 3Blue1Brown 和 MIT 18.06 那样，把问题的本质讲清楚。
2. **不跳步。** 检查的办法：一个没学过的人，能不能从上一行自己走到下一行。“代进去算”“容易验证”“可以推出”后面必须跟着那一行算式。用户对跳步的评价是“囫囵吞枣，不求甚解”。
3. **每个要求会做的方法，配一个从头算到尾的例子。** 尽量沿用页面上已经出现过的数据，让同一个小例子贯穿一站甚至几站。数字必须实际算过（`python3 -I`、`node` 都可以用），不许估。
4. **概念定义之后立刻用一次**，拿它去检验刚才的例子。只有定义和一句结论的概念，读者留不住。
5. **不写可有可无的话。** 没有过渡句、没有小结、没有“值得注意的是”、没有重复。一个主题要么讲到能用，要么不写；不留“一句话点名”（列出一串名词、每个一句）。篇幅长是因为内容多，不是因为话多。
6. **不出自编练习题。** 正文里的例子是讲解的一部分，可以自己构造或取自公开课；但不要在页面上出“练习”“思考题”。
7. **不写选课建议**（先修什么、值不值得选、workload 如何）。

每一站固定包含：`:::skip`（什么情况可以跳过）、按“问题 → 推导 → 例子”展开的若干 `###` 小节、至少一个 `:::wrong`（一个看起来对的错想法，说清它错在哪，最好用数字说话）、需要时的 `:::edge`（边界情况）、`:::back`（依赖前面哪几站，可选）、`:::from`（讲法来源，必须有）。

规模参考样板：5 到 8 站，每站 3 到 6 个小节，全文 6 万到 9 万字节，8 到 12 张图。

## 语言

句子用中文连起来，**所有术语一律用英文**，包括最基础的词：matrix、vector、function、derivative、error、algorithm、array、pointer、register、random variable、expectation、proof、sequence、limit……课程是英语授课，用户要求“immerse 一点”。不译成中文，也不要中英对照着各写一遍。

- 这样写：“三个 equation，两个 unknown，三个点不 collinear，所以没有 solution。”
- 不这样写：“三个方程，两个未知数……”也不写“方程（equation）”。
- 留中文的只有日常说法：加减乘除、“放大多少倍”、“代回去”、“左边/右边”，以及界面上固定的词。
- 句首和标题开头的英文词首字母大写；中文和英文、数字之间留一个空格；标点用中文全角。
- 图里的标注、frontmatter 里的站名和等级标准同样处理。
- 不要用破折号（——），不要写“不是……而是……”这类句式堆砌，不要写感叹句。平实地讲。

## 参考公开课：要真的读

写每一站之前，先去找讲这个主题讲得最好的公开课，**用 WebFetch 把那一讲的讲义或逐字稿读下来**，学它怎么引入问题、用什么例子、按什么顺序推，然后用自己的话写。不限于 MIT，哪家讲得好用哪家：

- MIT OCW（18.06、18.065、6.006、6.004、6.041/RES.6-012、RES.6-007、18.100、18.330……），lecture 页面上有 transcript PDF 的链接，先抓 lecture 页面问出 PDF 地址，再抓 PDF。
- Stanford（CS229、CS231n、CS224n、EE263、CS161、CS107、Stats 110 在 Harvard）、Berkeley（CS61A/B/C、CS70、CS162、CS188、EECS16A/B、Data 100、Stat 134）、CMU（15-213、15-445、15-451、10-301/601、21-241）、Harvard Stat 110、Princeton COS226。
- 3Blue1Brown 的 lessons（`https://www.3blue1brown.com/lessons/<slug>`）、Gilbert Strang 的书、公开的教材讲义。

URL 不要凭记忆编，用 WebSearch 搜到再抓。抓不到（被拒、超时）就换一个来源，不要绕过去。

每一站末尾的 `:::from` 如实写明：这一站的讲法跟的是哪门课的哪一讲（带链接）、用了它的什么（例子、图、论证顺序）、哪些部分是你另加的或自己算的。**只读了摘要就写“只读了摘要”，凭自己的知识写的就写明**，不要把没读过的课列成来源。frontmatter 的 `open` 列表只列真正读过的。

版权：不照抄讲义原文，不长段引用，用自己的话重讲。借用它的例子和数字没有问题，要注明出处。

## 这门课讲什么：以 NUS 的大纲为准

先弄清 NUS 这门课实际的范围，再决定分哪几站：

- 课程描述：WebFetch `https://api.nusmods.com/v2/2026-2027/modules/<CODE>.json`（抓不到就试 `2025-2026`，或 WebSearch “NUS <CODE> syllabus”）。
- 学生评价里常有大纲、考核方式、哪部分最难：WebFetch `https://disqus.com/embed/comments/?base=default&f=nusmods-prod&t_i=<CODE>&t_u=https%3A%2F%2Fnusmods.com%2Fcourses%2F<CODE>%2Freviews&s_o=default`，评论在页面里一段 JSON 的 `raw_message` 字段。抓不到就跳过，并在 `evidenceNote` 里说明。
- 往年卷子在 NUS 图书馆，需要登录，现在读不到。所以 `evidence` 一律写 `syllabus`，页面最后保留一节“真题走读：待补”（照抄样板最后一节的写法）。**例外**：重写已有页面时，原页面 frontmatter 里的 `evidence: paper`、`sources` 和正文里的 `:::exam` 真题走读是之前对着卷子写的，事实内容要原样保留（可以按新标准改写措辞和术语），不要删，也不要凭空新增真题走读。

## 文件格式

frontmatter（YAML）：

```yaml
---
code: CS2040
evidence: syllabus            # paper | substitute | syllabus
evidenceNote: "大纲取自……；讲法跟着……。还没有对着往年卷子核过。"
exam: "考核方式一两句，说明出处；不确定就写‘以当学期 Canvas 为准’。"
subskills:
  - id: heap                  # 小写字母，正文里用 ## [heap] 引用
    name: Binary heap 与 priority queue
    l3: "有提示能做：……"       # 三个等级各一句，写“能做什么”，不写“了解”“熟悉”
    l4: "能独立做：……"
    l5: "能讲给别人：……"
open:                          # 真正读过的公开课
  - label: "MIT 6.006 Lecture 4: Heaps and heap sort"
    url: "https://…"
    note: "第 3 站的讲法来源。"
sources:
  - label: "NUSMods：CS2040 课程评价"
    url: "https://nusmods.com/courses/CS2040/reviews"
---
```

YAML 里字符串含 `\` 时要写成 `\\`（见样板里的 `$\\|A\\|$`），含英文冒号、引号时整个值用双引号包住。

正文语法：

```
开头几段：这门课要解决什么问题（用几个具体的失败或例子引入），全课的线索。不加标题。

## [id] 站名                 ← id 必须在 subskills 里；站名和 frontmatter 的 name 一致
:::skip
能……就可以去下一站。
:::

### 小节标题

正文。行内公式 $...$，独立公式 $$...$$（KaTeX，构建时渲染；渲染失败会报错）。
> 引用块用来放一条关键原则，全页最多两三处。

::fig[cs2040-heap] 图注。一句话说清这张图要你看什么。

:::wrong 一个看起来对的想法（写成那个错想法本身）
它错在哪。
:::

:::edge 边界情况的标题
:::

:::back
依赖[第 2 站](#id)的……
:::

:::from
讲法来源。
:::
```

表格用标准 Markdown 表格。代码用 ``` 围栏（课程用什么语言就用什么：CS2040 是 Java，CS2100 是 C 和 MIPS）。矩阵、分式一律用 KaTeX 正经排版，不要写成 `[[a, b], [c, d]]`。

## 图

用户要求“合适恰当的图解”：图要画在文字讲不清、一看就明白的地方（一个结构长什么样、一个过程怎么走、两个量怎么此消彼长），不为了凑数。每张图只讲一件事。

`src/figures/<code>.mjs` 的形状：

```js
import { svg, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

function heap() {
  let o = '';
  // …拼 SVG 字符串
  return svg(560, 240, o, '给读屏用的一句话描述');   // 宽度固定 560，高度按内容
}

export default {
  'cs2040-heap': heap,        // 名字以课程代码小写开头，全站唯一
};
```

`src/lib/svg.mjs` 提供的工具：`lin(d0,d1,r0,r1)` 线性比例尺、`logx` 对数比例尺、`d(points)`、`path(d, cls)`、`line`、`rect(x,y,w,h,cls,rx)`、`circle`、`poly`、`text(x,y,s,cls,anchor)`、`arrow(x1,y1,x2,y2,cls)`、`curve(fn,x0,x1,sx,sy)`、`area(...)`、`axes({sx,sy,x0,x1,y0,y1,xt,yt,xl,yl,grid})`。先读一遍这个文件。

颜色只能通过 CSS class 给，不要写死颜色值（这样深色模式和每条线路的主题色才能自动适配）：

- 线条：`ink`（主线）、`ink-b`（粗）、`mute`（次要）、`dash`（虚线）、`axis`、`grid`、`frame`、`ln`（主题色粗线）、`ln-dash`
- 填充：`wash`（主题色浅底）、`wash-strong`、`wash2`（灰底）、`solid`（主题色实心）、`solid2`、`paper`（卡片底加描边）、`ink-f`、`ln-f`、`mute-f`
- 文字：默认 13px；`ts` 小号灰字、`tb` 加粗、`tl` 主题色加粗、`tw` 压在 `solid` 上的反白字、`tbig` 大号；`it('x')` 斜体数学字母

画图的要求：标注用英文术语；文字不能互相压住，也不能压在线条上；不要超出 560 宽的画布；曲线和数据点必须是算出来的，不是随手画的。画完跑 `node tools/preview.mjs <CODE>`，逐张打开 `fig-NN.png` 看。

## 人文社科的课（哲学、心理学、历史、政治、经济与社会）

标准不变，落到这些学科上是这样的：

- **动机来自必要性**：每个理论是为了回答一个具体的难题才出现的。先把难题摆出来（一个思想实验、一场审判、一次实验的意外结果、一段历史上解释不通的事），让读者看到常识性的回答在哪里走不下去，再引入理论。
- **不跳步**：
  - 哲学：把 argument 重构成编号的 premise 和 conclusion，说明它是否 valid，每个 premise 靠什么支持，反对者否认的是哪一条，以及最强的 objection 和回应。不能只写“Kant 认为……”。
  - 心理学：一项研究要写清 design（谁、多少人、怎么分组、操纵了什么、测了什么）、主要结果的数字、它能支持和不能支持的结论，以及后来的 replication 情况。很多经典研究没有复现成功或被重新解读，查到了就如实写，查不到就写“没有查到 replication 的情况”。
  - 历史：一个论断靠什么 source 支持，同一件事有哪几种 interpretation，它们分歧在哪条证据上。
  - 政治、经济、社会学：概念给出可操作的定义，理论给出它预测什么、哪个 case 支持它、哪个 case 是它的麻烦。经济学的模型要像数学课一样推导并算一个数值例子。
- **从头走到尾的例子**：完整分析一段原文、一个 case、一项实验或一组数据，而不是罗列人名和主义。
- **`:::wrong`**：写这门课里真实存在的误读（例如把 Milgram 实验读成“人性本恶”，把 utilitarianism 读成“多数人说了算”）。
- **有争议的问题**：把主要立场各自最强的版本讲清楚，写明分歧所在，页面自己不下结论，也不替读者选边。
- **准确**：不编造引文、年份、数字和文献。人名、书名、年份、实验数据都要查到来源；直接引语只在查到原文时用，而且要短（一句以内），其余用自己的话转述。
- **术语**：同样全部用英文（argument、premise、valid、sound、categorical imperative、confound、effect size、sovereignty、collective action problem……）。专有名词用通行的英文拼法（Socrates、Kant、Thucydides）。
- **参考来源**：Yale Open Courses（PHIL 176、PHIL 181、PLSC 114、PSYC 110、HIST 系列，有完整逐字稿）、MIT OCW（24.xx 哲学、9.00SC 心理学导论、17.xx 政治、14.01 微观经济学）、Harvard 的 Justice（Sandel）、Stanford Encyclopedia of Philosophy（plato.stanford.edu）、Internet Encyclopedia of Philosophy、OpenStax 和 Noba 的心理学开放教材、CORE Econ，以及公版的原著（Project Gutenberg、Perseus）。同样要真的读过才能列。
- **图**：argument 的结构图、时间线、实验 design 的示意、用已发表数字画的数据图（注明出处）、概念之间的关系图。数量可以比数学课少（4 到 8 张），但每张都要有用。

## 交付前自查

- `node tools/preview.mjs <CODE>` 两种宽度都“没有发现版面问题”。
- 每张图都看过；页面截图抽看过几段，公式、表格、代码块显示正常。
- 通读一遍全文：有没有跳步；每个 `:::wrong` 是不是一个真的会犯的错；有没有残留的中文术语；有没有一句话点名；有没有可有可无的话。
- 文中出现的每个数字都是算过的。
- `:::from` 和 `open` 里只列了真正读过的材料，没读全的写明了。

最后的汇报（简短）：分了哪几站；每站实际读了哪门课的哪一讲（读的是全文、摘要，还是没抓到）；哪些内容是凭自己的知识写的、没有来源核对；NUS 大纲有没有抓到；还有什么不确定或没做完的地方。不要报喜不报忧。
