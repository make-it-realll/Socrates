# Socrates

一张课程谱系图，加上按“站”拆开的讲义。静态网站，托管在 GitHub Pages：
<https://make-it-realll.github.io/Socrates/>

讲义是自学笔记，按公开课、课程大纲和可查到的往年卷子写成，不是任何课程的官方材料，可能有错。往年卷子的原题不放在这里，页面里只给图书馆的链接。

## 目录

```
content/courses/   每门课一个 Markdown 文件（讲义正文）
content/threads/   概念线：同一个想法在不同课里的出现
src/catalog.mjs    全部课程的目录：谱系、简称、先修关系
src/figures/       图解，每门课一个文件，用代码画成 SVG
src/build.mjs      构建脚本
src/assets/        样式和前端脚本
docs/              构建结果，GitHub Pages 直接托管这个目录
```

## 构建

```
npm install
npm run build
```

改完内容后重新构建，把 `docs/` 一起提交。

## 写一门课

在 `content/courses/` 里新建 `课号.md`，课号要先出现在 `src/catalog.mjs` 里。文件头部写：

```yaml
code: ST2131
evidence: paper        # paper 有往年卷子 / substitute 用替代卷 / syllabus 只有大纲
evidenceNote: "依据的具体说明"
exam: "考试形式"
subskills:
  - id: counting       # 英文小写，用作锚点
    name: 计数与容斥
    l3: "3 级要做到什么"
    l4: "4 级要做到什么（有卷子的课，对应到具体题目）"
    l5: "5 级要做到什么"
open:                  # 公开课对照
  - { label: "...", url: "...", note: "..." }
sources:
  - { label: "...", url: "..." }
```

正文里每一站用 `## [id] 标题` 开头，`id` 对应上面的 subskill。其他二级标题是普通小节。

每一站的写法：先说要解决什么问题，再摆一个看起来对的错想法，说清错在哪，然后是正确的推导、图解、边界情况、真题走读。对应的块：

```
:::skip                 可以跳过的条件
:::wrong 标题           看起来对、其实不对的想法
:::edge 标题            边界情况
:::exam 出处            真题走读（只转述题意，不贴原题）
:::back                 依赖哪些前面的站
:::
::fig[图的名字] 图注     插入 src/figures/ 里的一张图
```

公式用 `$...$` 和 `$$...$$`，构建时由 KaTeX 渲染成静态 HTML。

## 等级

0 没听过，1 听过，2 能跟上，3 有提示能做，4 能独立做，5 能讲给别人。等级由读者自己点，存在浏览器的 localStorage 里。课程页的“复制进度块”导出一段文本，可以贴进 Claude 对话里用 `resume from:` 接着被提问。
