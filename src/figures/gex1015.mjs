import { svg, path, line, rect, circle, text, arrow } from '../lib/svg.mjs';

// 一个带圆角的卡片，里面若干行居中的字
function card(x, y, w, h, lines, cls = 'paper') {
  let o = rect(x, y, w, h, cls, 6);
  for (const [dy, s, c] of lines) o += text(x + w / 2, y + dy, s, c || 't', 'middle');
  return o;
}

// 第 1 站：一个 argument 的结构，以及可以反对的两处
function argmap() {
  let o = text(280, 20, '反对方式一：否认某一条 premise（那它就不 sound）', 'ts', 'middle');
  o += card(30, 32, 235, 44, [[27, 'P1  If God exists, there is no evil']]);
  o += card(295, 32, 235, 44, [[27, 'P2  There is evil']]);
  o += path('M147.5 76L147.5 104L412.5 104L412.5 76', 'ink');
  o += arrow(280, 104, 280, 160, 'ink');
  o += text(266, 128, 'Premise 全真时，', 'ts', 'end') + text(266, 144, 'conclusion 能不能假？', 'ts', 'end');
  o += text(294, 128, '反对方式二：指出这一步 invalid', 'ts') + text(294, 144, '（要给出 counterexample）', 'ts');
  o += rect(162.5, 162, 235, 44, 'wash', 6) + rect(162.5, 162, 235, 44, 'ink', 6) + text(280, 189, 'C  God does not exist', 'tb', 'middle');
  o += text(280, 228, '两处都反对不了，就只能接受 conclusion', 'ts', 'middle');
  return svg(560, 240, o, '两条 premise 汇合后经过一步 inference 得到 conclusion；可以反对的地方是某条 premise 或者这一步 inference');
}

// 第 2 站：logical problem of evil 的四条实质 premise，受攻击最多的是 P4
function evil() {
  let o = rect(10, 8, 540, 172, 'frame', 8);
  const box = (x, y, t1, t2, t3, hot) => {
    let s = hot ? rect(x, y, 250, 72, 'wash', 6) + rect(x, y, 250, 72, 'ln', 6) : rect(x, y, 250, 72, 'paper', 6);
    s += text(x + 125, y + 22, t1, 'tb', 'middle') + text(x + 125, y + 42, t2, 't', 'middle') + text(x + 125, y + 60, t3, hot ? 'tl' : 'ts', 'middle');
    return s;
  };
  o += box(20, 16, 'P2  Omnipotent', '有 power 消除一切 evil', '通常限定为 logically possible 的事');
  o += box(290, 16, 'P3  Omniscient', '知道 evil 何时存在', '很少有人否认');
  o += box(20, 98, 'P4  Morally perfect', '有 desire 消除一切 evil', 'Theodicy 与 free will defence 否认它', true);
  o += box(290, 98, 'P5  Evil exists', 'World 里确实有 evil', '否认它的代价最大');
  o += arrow(280, 180, 280, 212, 'ink');
  o += text(294, 201, '四条合起来（加上 P1、P6）', 'ts');
  o += rect(160, 214, 240, 42, 'paper', 6) + text(280, 240, 'C  这样的 God 不存在', 'tb', 'middle');
  return svg(560, 266, o, 'Logical problem of evil 的四条 premise 共同推出 God 不存在；其中 morally perfect 的 being 想消除一切 evil 这一条是主要的攻击对象');
}

// 第 3 站：三句话不能同时为真，各方各弃一句
function triad() {
  let o = '';
  o += line(212, 60, 130, 196, 'ink') + line(348, 60, 430, 196, 'ink') + line(250, 226, 310, 226, 'ink');
  o += card(170, 16, 220, 44, [[27, '(A)  我 know 我有手', 'tb']]);
  o += card(10, 196, 240, 60, [[24, '(B)  Closure', 'tb'], [45, 'know p 且 know p entails q，就 know q', 'ts']]);
  o += card(310, 196, 240, 60, [[24, '(C)  我不 know 我不是 BIV', 'tb'], [45, '两种情形下 experience 完全相同', 'ts']]);
  o += text(150, 116, 'Moore', 'tb', 'end') + text(150, 134, '留 (A)(B)，否认 (C)', 'ts', 'end');
  o += text(410, 116, 'Dretske、Nozick', 'tb') + text(410, 134, '留 (A)(C)，否认 (B)', 'ts');
  o += text(280, 150, '任意两句', 'ts', 'middle') + text(280, 166, '推出第三句为假', 'ts', 'middle');
  o += line(280, 226, 280, 268, 'mute');
  o += text(280, 284, 'Sceptic：留 (B)(C)，否认 (A)', 'tb', 'middle');
  return svg(560, 296, o, '三句话摆成三角形：我知道我有手、closure、我不知道我不是 BIV；Moore、Dretske 与 Nozick、sceptic 各保留其中两句而否认第三句');
}

// 第 4 站：四种立场和各自的麻烦
function mindmap() {
  let o = '';
  o += line(220, 50, 142, 92, 'ink') + line(340, 50, 418, 92, 'ink');
  o += line(90, 146, 76, 190, 'ink') + line(194, 146, 212, 190, 'ink') + line(366, 146, 352, 190, 'ink') + line(470, 146, 488, 190, 'ink');
  o += card(150, 12, 260, 38, [[25, 'Mental state 是 physical state 吗？', 'tb']]);
  o += card(24, 92, 236, 54, [[22, '不是：dualism', 'tb'], [42, 'Non-physical 的是一个 substance 吗？', 'ts']]);
  o += card(300, 92, 236, 54, [[22, '是：physicalism', 'tb'], [42, '一种 mental state 由什么确定？', 'ts']]);
  const leaf = (x, a, n1, n2) => card(x, 190, 128, 66, n2 ? [[18, a, 'ts'], [38, n1, 'tb'], [55, n2, 'tb']] : [[18, a, 'ts'], [46, n1, 'tb']], 'paper');
  o += leaf(12, '是', 'Substance', 'dualism') + leaf(148, '只是 property', 'Property', 'dualism');
  o += leaf(288, '由 brain state 的种类', 'Identity', 'theory') + leaf(424, '由 causal role', 'Functionalism');
  o += text(76, 276, 'Mind 怎样推动 body', 'ts', 'middle') + text(212, 276, 'Epiphenomenalism', 'ts', 'middle');
  o += text(352, 276, 'Multiple realizability', 'ts', 'middle') + text(488, 276, 'Absent qualia', 'ts', 'middle');
  o += path('M290 286L290 292L550 292L550 286', 'mute');
  o += text(420, 308, 'Mary 的 knowledge argument 针对这两种', 'ts', 'middle');
  return svg(560, 318, o, '从 mental state 是不是 physical state 这个问题分出 substance dualism、property dualism、identity theory、functionalism 四种立场，每种下面写着它最主要的麻烦');
}

// 第 5 站：Parfit 的三个 case
function fission() {
  const R = 15;
  const person = (cx, cy, L, Rt, newBody) => {
    let s = rect(cx - 13, cy + R + 3, 26, 17, newBody ? 'wash2 ink-s' : 'paper', 5) + circle(cx, cy, R, 'paper');
    if (L) s += path(`M${cx} ${cy - R}A${R} ${R} 0 0 0 ${cx} ${cy + R}Z`, 'wash-strong');
    if (Rt) s += path(`M${cx} ${cy - R}A${R} ${R} 0 0 1 ${cx} ${cy + R}Z`, 'band-n');
    s += circle(cx, cy, R, 'ink') + line(cx, cy - R, cx, cy + R, 'ink');
    return s;
  };
  let o = '';
  // 第一行
  o += text(16, 38, 'Brain transplant 1', 'tb') + text(16, 56, '整个 brain 移进新的 body', 'ts');
  o += person(210, 40, true, true, false) + arrow(238, 40, 300, 40, 'ink') + person(332, 40, true, true, true);
  o += text(210, 17, '你', 'ts', 'middle') + text(332, 17, '新的 body', 'ts', 'middle');
  o += text(374, 45, '你 survive（P1）', 't');
  // 第二行
  o += text(16, 122, 'Brain transplant 2', 'tb') + text(16, 140, '右半被毁，左半移进新的 body', 'ts');
  o += person(210, 124, true, true, false) + arrow(238, 124, 300, 124, 'ink') + person(332, 124, true, false, true);
  o += text(374, 129, '你 survive（P2）', 't');
  // 第三行
  o += text(16, 220, 'Fission', 'tb') + text(16, 238, '两半各移进一个新的 body', 'ts');
  o += person(210, 222, true, true, false) + arrow(238, 214, 300, 196, 'ink') + arrow(238, 230, 300, 250, 'ink');
  o += person(332, 190, true, false, true) + person(332, 256, false, true, true);
  o += text(374, 186, 'Lefty', 'tb') + text(374, 204, '单独看，和第二行的结果一样', 'ts');
  o += text(374, 252, 'Righty', 'tb') + text(374, 270, '和 Lefty 完全对称', 'ts');
  o += line(16, 86, 544, 86, 'grid') + line(16, 166, 544, 166, 'grid');
  return svg(560, 300, o, '三行示意：整个 brain 移进新的 body；半个 brain 被毁、另一半移进新的 body；两半 brain 各移进一个新的 body，得到 Lefty 和 Righty');
}

// 第 6 站：立场地图
function freemap() {
  const X = [170, 355, 540], Y = [40, 110, 180];
  let o = rect(X[0], Y[0], 370, 70, 'wash', 0);
  o += rect(X[0], Y[0], 370, 140, 'frame') + line(X[1], Y[0], X[1], Y[2], 'grid') + line(X[0], Y[1], X[2], Y[1], 'grid');
  o += text(262.5, 26, 'Determinism 为真', 'tb', 'middle') + text(447.5, 26, 'Determinism 为假', 'tb', 'middle');
  o += text(14, 66, 'Compatibilism', 'tb') + text(14, 84, 'Free will 与 determinism', 'ts') + text(14, 99, '可以并存', 'ts');
  o += text(14, 136, 'Incompatibilism', 'tb') + text(14, 154, '两者不能并存', 'ts');
  o += text(262.5, 70, '有 free will', 'tb', 'middle') + text(262.5, 90, 'Hume、Frankfurt', 'ts', 'middle');
  o += text(447.5, 70, '同样可以有 free will', 'tb', 'middle') + text(447.5, 90, '不取决于 determinism 的真假', 'ts', 'middle');
  o += text(262.5, 138, 'Hard determinism', 'tb', 'middle') + text(262.5, 158, '没有 free will', 'ts', 'middle');
  o += text(447.5, 132, 'Libertarianism', 'tb', 'middle') + text(447.5, 150, '有 free will', 'ts', 'middle') + text(447.5, 165, '要回答 luck objection', 'ts', 'middle');
  o += rect(X[0], 198, 370, 48, 'paper', 6);
  o += text(355, 218, 'Basic Argument（Galen Strawson）', 'tb', 'middle') + text(355, 236, '不管 determinism 真假，真正的 moral responsibility 都不可能', 'ts', 'middle');
  o += text(14, 214, '表格之外', 'tb') + text(14, 231, '不用 determinism', 'ts') + text(14, 246, '作 premise', 'ts');
  return svg(560, 258, o, '两行两列的立场地图：compatibilism 认为无论 determinism 真假都可以有 free will；incompatibilism 之下，determinism 为真是 hard determinism，为假是 libertarianism；Galen Strawson 的 Basic Argument 在表格之外');
}

// 第 7 站：三种轨道
function trolley() {
  let o = '';
  const five = (x0, xs) => xs.map((x) => circle(x0 + x, 70, 3.5, 'ink-f')).join('');
  const car = (x0) => rect(x0 + 10, 62, 22, 16, 'solid2', 3) + arrow(x0 + 36, 70, x0 + 54, 70, 'ink', 6);
  const notes = (x0, title, l1, l2, role, verdict) => text(x0 + 86, 22, title, 'tb', 'middle') + text(x0 + 86, 164, l1, 'ts', 'middle') + text(x0 + 86, 180, l2, 'ts', 'middle') + text(x0 + 86, 204, role, 't', 'middle') + text(x0 + 86, 226, verdict, 'tb', 'middle');
  // Switch
  let x0 = 14;
  o += line(x0 + 56, 70, x0 + 164, 70, 'ink') + line(x0 + 70, 70, x0 + 150, 130, 'ink') + car(x0) + five(x0, [118, 127, 136, 145, 154]);
  o += circle(x0 + 122, 109, 5, 'ln-f');
  o += notes(x0, 'Switch', '那一个人不在场，', '五个人照样得救', '他的死是 side effect', '多数判断：可以扳');
  // Footbridge
  x0 = 194;
  o += line(x0 + 56, 70, x0 + 164, 70, 'ink') + car(x0) + five(x0, [118, 127, 136, 145, 154]);
  o += line(x0 + 76, 36, x0 + 76, 104, 'mute') + line(x0 + 94, 36, x0 + 94, 104, 'mute');
  o += circle(x0 + 85, 48, 5, 'ln-f') + arrow(x0 + 85, 55, x0 + 85, 66, 'ln', 5);
  o += text(x0 + 100, 44, 'bridge', 'ts');
  o += notes(x0, 'Footbridge', '没有他的 body，', 'trolley 停不下来', '他的 body 是 means', '多数判断：不许推');
  // Loop
  x0 = 374;
  o += line(x0 + 56, 70, x0 + 160, 70, 'ink') + car(x0) + five(x0, [100, 109, 118, 127, 136]);
  o += path(`M${x0 + 66} 70C${x0 + 72} 110 ${x0 + 80} 128 ${x0 + 100} 128L${x0 + 136} 128C${x0 + 156} 128 ${x0 + 160} 108 ${x0 + 160} 70`, 'ink');
  o += circle(x0 + 118, 128, 5, 'ln-f');
  o += notes(x0, 'Loop', '没有他的 body，', 'trolley 绕回来撞五个人', '他的 body 是 means', '多数判断：可以扳');
  o += line(187, 14, 187, 232, 'grid') + line(367, 14, 367, 232, 'grid');
  return svg(560, 240, o, '三种轨道的俯视示意：switch 里岔道通向一个人；footbridge 里一个人站在轨道上方的桥上；loop 里岔道绕一圈接回主轨，岔道上有一个人');
}

// 第 5 站：Williams 的 case，同一个结果，两种讲法
function williams() {
  let o = text(280, 22, '机器把两人 brain 里的全部信息互换', 'ts', 'middle');
  const body = (x, y, who, info, cls) => rect(x, y, 175, 46, 'paper', 6) + text(x + 12, y + 19, who + ' 的 body', 'tb') + text(x + 12, y + 37, info + ' 的 memory、personality', cls);
  o += text(107, 22, '之前', 'tb', 'middle') + text(452, 22, '之后', 'tb', 'middle');
  o += body(20, 34, 'A', 'A', 'tl') + body(20, 94, 'B', 'B', 'ts');
  o += body(365, 34, 'A', 'B', 'ts') + body(365, 94, 'B', 'A', 'tl');
  o += arrow(197, 66, 361, 112, 'ln') + arrow(197, 112, 361, 66, 'mute');
  const card = (x, title, lines, verdict) => {
    let c = rect(x, 176, 250, 128, 'wash', 6) + text(x + 12, 198, title, 'tb');
    lines.forEach((t, i) => { c += text(x + 12, 220 + i * 18, t, 'ts'); });
    return c + text(x + 12, 292, verdict, 'tl');
  };
  o += path('M452 140L452 150L145 150L145 174', 'mute') + path('M415 150L415 174', 'mute');
  o += text(280, 167, '你是 A。对这同一个结果，有两种问法', 'ts', 'middle');
  o += card(20, '讲法一：先让你分配', ['一个拿 100,000 美元，一个受酷刑，', '你出于自私来指定。多数人：钱给', 'B 的 body，酷刑给 A 的 body。'], '跟着 memory 走：personality theory');
  o += card(290, '讲法二：一条一条往上加', ['明天你受酷刑；先抹掉 memory，再', '改 personality……加完第 6 条，', '怕的仍是 A 的 body 受刑。'], '留在这个 body 里：body theory');
  return svg(560, 314, o, 'Williams 的 case：机器把 A 和 B 的 brain 信息互换，A 的 body 带着 B 的 memory，B 的 body 带着 A 的；先问怎样分配奖惩时多数人站在 personality theory 一边，一条条加条件时人们又站在 body theory 一边');
}

// 第 6 站：Frankfurt 的 case，两条路都通向开枪
function frankfurt() {
  const card = (x, y, w, a, b, cls = 'paper') => rect(x, y, w, 46, cls, 6) + text(x + w / 2, y + 20, a, 'tb', 'middle') + text(x + w / 2, y + 37, b, 'ts', 'middle');
  let o = card(16, 102, 132, 'Jones 已决定', '开枪打死 Smith');
  o += card(206, 34, 150, '没有反悔', '实际发生的', 'wash');
  o += card(206, 170, 150, '露出要反悔的迹象', '没有发生');
  o += card(412, 102, 132, 'Jones 开枪', 'Smith 死');
  o += arrow(148, 116, 204, 64, 'ln') + arrow(356, 56, 410, 112, 'ln');
  o += arrow(148, 136, 204, 190, 'dash') + arrow(356, 194, 410, 138, 'dash');
  o += text(376, 60, '出于他自己的理由', 'tl');
  o += text(392, 180, 'Black 介入，', 'ts') + text(392, 196, '操纵他照样开枪', 'ts');
  o += text(281, 20, 'Black 一直准备着，实际上没有介入', 'ts', 'middle');
  o += rect(16, 250, 528, 58, 'frame', 6);
  o += text(28, 272, 'Jones 当时能不开枪吗？不能：两条路都通向开枪。', 't');
  o += text(28, 294, 'Jones 负 moral responsibility 吗？负：实际走的那条路上只有他自己的理由。', 't');
  return svg(560, 318, o, 'Frankfurt case 的两条路：实际上 Jones 没有反悔，出于自己的理由开枪；假如他露出反悔的迹象，Black 会介入操纵他照样开枪。两条路都通向开枪，所以 Jones 没有 alternative，却仍然负 moral responsibility');
}

export default {
  'gex1015-williams': williams,
  'gex1015-frankfurt': frankfurt,
  'gex1015-argmap': argmap,
  'gex1015-evil': evil,
  'gex1015-triad': triad,
  'gex1015-mindmap': mindmap,
  'gex1015-fission': fission,
  'gex1015-freemap': freemap,
  'gex1015-trolley': trolley,
};
