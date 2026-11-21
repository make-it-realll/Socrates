import { svg, lin, d, path, line, rect, circle, poly, text, arrow, esc } from '../lib/svg.mjs';

// 一个 heap object：标题栏加若干行 field
function obj(x, y, w, title, rows, cls = 'paper') {
  const h = 24 + rows.length * 19 + 5;
  let o = rect(x, y, w, h, cls, 6) + line(x, y + 24, x + w, y + 24, 'mute') + text(x + w / 2, y + 16.5, esc(title), 'tb', 'middle');
  rows.forEach((r, i) => { o += text(x + 10, y + 41 + i * 19, esc(r), 't'); });
  return o;
}
// stack 上的一个 variable：名字在左，格子在右，格子里一个圆点表示 reference
function slot(x, y, name, val = null) {
  let o = text(x - 8, y + 4.5, esc(name), 't', 'end') + rect(x, y - 11, 46, 22, 'paper', 3);
  o += val === null ? circle(x + 23, y, 3.2, 'ink-f') : text(x + 23, y + 4.5, esc(val), 't', 'middle');
  return o;
}

// 第 1 站：stack 与 heap，三条 reference 指向同一个 Point
function heap() {
  let o = '';
  o += text(92, 22, 'stack', 'tb', 'middle') + text(385, 22, 'heap', 'tb', 'middle');
  o += rect(22, 34, 140, 222, 'frame', 8) + text(32, 52, 'main', 'ts');
  o += slot(98, 82, 'c1') + slot(98, 148, 'c2') + slot(98, 222, 'p');
  o += line(190, 30, 190, 262, 'grid');
  o += obj(236, 44, 126, 'Circle', ['c:', 'r: 1.0']);
  o += obj(236, 122, 126, 'Circle', ['c:', 'r: 4.0']);
  o += obj(424, 178, 112, 'Point', ['x: 1.0', 'y: 1.0'], 'paper');
  o += rect(424, 178, 112, 67, 'wash', 6);
  // stack → heap
  o += arrow(121, 82, 234, 82, 'ink') + arrow(121, 148, 234, 148, 'ink') + arrow(121, 222, 422, 222, 'ln');
  // Circle.c → Point
  o += circle(272, 80, 3.2, 'ink-f') + circle(272, 158, 3.2, 'ink-f');
  o += path('M272 80 L392 80 L452 176', 'ln') + poly([[452, 176], [445.6, 170.6], [451.2, 167.2]], 'ln-f');
  o += path('M272 158 L392 158 L432 176', 'ln') + poly([[432, 176], [424.7, 174.6], [428.1, 168.9]], 'ln-f');
  o += text(280, 284, '三条 reference 指向同一个 Point。c1.moveTo(1, 1) 改的是这个 object，c2 看到的 center 也变成 (1.0, 1.0)。', 'ts', 'middle');
  return svg(560, 296, o, 'Stack 上的 variable c1、c2、p 各存一个 reference；heap 上有两个 Circle 和一个 Point，两个 Circle 的 field c 与 variable p 指向同一个 Point');
}

// 第 2 站：method invocation 的两个 stage
function dispatch() {
  let o = '';
  o += text(280, 22, esc('A x = new B();   B y = new B();   x.f(y);'), 'tb', 'middle');
  // 中间：两个 class
  o += obj(212, 50, 136, 'class A', ['void f(A)']);
  o += obj(212, 158, 136, 'class B extends A', ['void f(A)', 'void f(B)']);
  o += arrow(280, 156, 280, 100, 'mute') + text(288, 132, 'extends', 'ts');
  // 左：stage 1
  o += text(20, 62, 'Stage 1 · compile time', 'tl');
  o += text(20, 84, 'x 的 compile-time type 是 A', 't') + text(20, 103, '只在 A 里找名叫 f 的 method', 't') + text(20, 122, 'argument 是 B，B <: A，f(A) 适用', 'ts');
  o += text(20, 146, 'bytecode 里记下 descriptor：', 't') + text(20, 165, 'void f(A)', 'tb');
  o += path('M196 80 L210 86', 'ln') + poly([[210, 86], [202.5, 86.6], [204.8, 80.9]], 'ln-f');
  // 右：stage 2
  o += text(370, 170, 'Stage 2 · run time', 'tl');
  o += text(370, 192, 'x 指向的 object 是 B', 't') + text(370, 211, '从 B 起向上找 void f(A)', 't') + text(370, 230, 'B 里就有：run B::f(A)', 'tb');
  o += arrow(366, 196, 350, 196, 'ln');
  o += rect(216, 185, 128, 19, 'wash', 3) + rect(216, 77, 128, 19, 'wash', 3);
  o += text(370, 262, 'f(B) 的 descriptor 不同，', 'ts') + text(370, 278, 'stage 2 不会去看它', 'ts');
  o += path('M366 266 L340 266 L322 232', 'mute') + poly([[322, 232], [328.2, 237.3], [322.7, 240.2]], 'mute-f');
  o += text(20, 262, '输出：B.f(A)', 'tb');
  o += text(20, 280, '选哪个 descriptor 只看 compile-time type', 'ts') + text(20, 296, '选哪份 implementation 只看 run-time type', 'ts');
  return svg(560, 306, o, 'Method invocation 的两个 stage：compile time 根据 target 的 compile-time type A 选出 descriptor void f(A)，run time 从 object 的 run-time type B 开始向上找这个 descriptor 的 implementation，找到 B 里的 f(A)');
}

// 第 3 站：三个 class 的 canMakeReservation 在哪些 time 返回 true
function lsp() {
  const sx = lin(1100, 2300, 196, 536);
  let o = '';
  for (const t of [1200, 2200]) o += line(sx(t), 48, sx(t), 226, 'dash') + text(sx(t), 242, String(t), 'ts', 'middle');
  o += line(sx(1400), 108, sx(1400), 140, 'dash') + line(sx(1400), 222, sx(1400), 228, 'axis') + text(sx(1400), 242, '1400', 'ts', 'middle');
  o += text(184, 242, 'time', 'ts', 'end');
  const row = (y, name, segs, note, bad = null) => {
    o += text(184, y + 5, name, 't', 'end') + line(sx(1100), y, sx(2300), y, 'grid');
    for (const [a, b] of segs) o += rect(sx(a), y - 8, sx(b) - sx(a), 16, 'solid', 3);
    if (bad) o += rect(sx(bad[0]), y - 8, sx(bad[1]) - sx(bad[0]), 16, 'paper', 3) + path(`M${sx(bad[0]) + 6} ${y - 5}L${sx(bad[1]) - 6} ${y + 5}M${sx(bad[0]) + 6} ${y + 5}L${sx(bad[1]) - 6} ${y - 5}`, 'ink');
    if (note) o += text(sx(1200) + 8, y + 27, note, 'ts', 'start');
  };
  o += text(184, 37, 'specification', 'tb', 'end') + rect(sx(1200), 24, sx(2200) - sx(1200), 16, 'wash-strong', 3) + text(sx(1700), 16, 'opening hours 内必须返回 true', 'ts', 'middle');
  row(80, 'Restaurant', [[1200, 2200]], '');
  row(124, 'LunchRestaurant', [[1400, 2200]], '1200 到 1400 返回 false：test 不通过', [1200, 1400]);
  row(186, 'DigitalReadyRestaurant', [[1100, 2300]], '多出来的 true 落在 specification 不管的 time 上');
  o += text(280, 268, '实心条：canMakeReservation(time) 返回 true 的 time。Subtype 的条必须盖住 specification 的条。', 'ts', 'middle');
  return svg(560, 280, o, '三个 class 的 canMakeReservation 返回 true 的时间段：Restaurant 是 1200 到 2200，LunchRestaurant 缺了 1200 到 1400，DigitalReadyRestaurant 在所有时间都返回 true');
}

// 第 4 站：array 记得自己的 element type，generic 的 object 不记得
function arrayhole() {
  let o = '';
  const panel = (x0, title, vars, objTitle, rows, tag, store, lines) => {
    o += text(x0 + 126, 20, title, 'tb', 'middle');
    vars.forEach(([name, ty], i) => {
      const y = 62 + i * 46;
      o += text(x0 + 4, y, name, 'tb') + text(x0 + 4, y + 15, esc(ty), 'ts') + circle(x0 + 122, y - 4, 3.2, 'ink-f');
      o += arrow(x0 + 122, y - 4, x0 + 150, i === 0 ? 72 : 98, 'ink');
    });
    o += obj(x0 + 152, 50, 100, objTitle, rows);
    o += text(x0 + 126, 142, tag[0], 'ts', 'middle') + text(x0 + 126, 158, esc(tag[1]), 'tb', 'middle');
    o += rect(x0, 172, 252, 26, 'wash2', 5) + text(x0 + 126, 189.5, esc(store), 't', 'middle');
    lines.forEach((t, i) => { o += text(x0 + 126, 218 + i * 17, esc(t), i === lines.length - 1 ? 'tb' : 'ts', 'middle'); });
  };
  panel(14, 'Array', [['intArray', 'Integer[]'], ['objArray', 'Object[]']], 'array', ['[0]: 10', '[1]: 20'], ['这个 object 记着自己的 run-time type：', 'Integer[]'], 'objArray[0] = "Hello!";', ['JVM 查这个 array 的 element type', 'String 不是 Integer', 'ArrayStoreException，当场停下']);
  panel(294, 'Generic class', [['intList', 'ArrayList<Integer>'], ['rawList', 'ArrayList（raw type）']], 'ArrayList', ['size: 0', '（空）'], ['这个 object 的 run-time type 只有：', 'ArrayList'], 'rawList.add("Hello!");', ['JVM 没有 element type 可查', 'String 被存进去：heap pollution', '到 intList.get(0) 才出错']);
  o += line(280, 10, 280, 262, 'grid');
  return svg(560, 270, o, '左边两个 array variable 指向同一个 Integer array，这个 object 记着自己的 element type，存入 String 时 JVM 抛出 ArrayStoreException；右边两个 variable 指向同一个 ArrayList，object 里没有 type argument，String 被悄悄存进去');
}

// 第 4 站：带 wildcard 的 subtype 关系
function lattice() {
  let o = '';
  const node = (cx, cy, s, w, cls = 'paper') => rect(cx - w / 2, cy - 13, w, 26, cls, 6) + text(cx, cy + 4.5, esc(s), 't', 'middle');
  const L = 150, R = 410, y0 = 28, y1 = 92, y2 = 160, y3 = 244;
  // 边（先画，节点盖在上面）
  o += arrow(L, y3 - 13, L, y2 + 15, 'ink') + arrow(L, y2 - 13, L, y1 + 15, 'ink');
  o += arrow(R, y3 - 13, R, y2 + 15, 'ink') + arrow(R, y2 - 13, R, y1 + 15, 'ink');
  o += arrow(L + 40, y3 - 13, R - 42, y1 + 15, 'ln') + arrow(R - 40, y3 - 13, L + 42, y1 + 15, 'ln');
  o += arrow(L + 30, y1 - 13, 252, y0 + 14, 'ink') + arrow(R - 30, y1 - 13, 308, y0 + 14, 'ink');
  o += node(280, y0, 'List<?>', 78);
  o += node(L, y1, 'List<? extends Number>', 168) + node(R, y1, 'List<? super Integer>', 160);
  o += node(L, y2, 'List<? extends Integer>', 168) + node(R, y2, 'List<? super Number>', 160);
  o += node(L, y3, 'List<Integer>', 108, 'paper') + node(R, y3, 'List<Number>', 108, 'paper');
  o += rect(L - 54, y3 - 13, 108, 26, 'wash', 6) + rect(R - 54, y3 - 13, 108, 26, 'wash', 6);
  // 底部：没有箭头
  o += line(L + 58, y3, R - 58, y3, 'dash') + path(`M274 ${y3 - 6}L286 ${y3 + 6}M274 ${y3 + 6}L286 ${y3 - 6}`, 'ink-b');
  o += text(280, y3 + 26, 'Integer <: Number，但这两个之间没有 arrow', 'ts', 'middle');
  o += text(L - 84, y1 - 22, 'covariant 的一列', 'ts') + text(R + 80, y1 - 22, 'contravariant 的一列', 'ts', 'end');
  o += text(280, 296, 'Arrow 从 subtype 指向 supertype。左边一列随 type argument 同向，右边一列反向。', 'ts', 'middle');
  return svg(560, 308, o, 'List 的各种 parameterized type 之间的 subtype 关系：List<Integer> 是 List<? extends Integer> 和 List<? super Integer> 的 subtype，List<Number> 是 List<? extends Number> 和 List<? super Number> 的 subtype，List<? extends Integer> 是 List<? extends Number> 的 subtype，List<? super Number> 是 List<? super Integer> 的 subtype，它们都是 List<?> 的 subtype；List<Integer> 与 List<Number> 之间没有关系');
}

// 第 5 站：variable capture。makeTax 的 frame 已经销毁，rate 的 copy 留在 lambda 的 object 里
function capture() {
  let o = '';
  o += text(96, 22, 'stack', 'tb', 'middle') + text(400, 22, 'heap', 'tb', 'middle');
  o += rect(22, 34, 150, 58, 'dash', 8) + text(32, 52, 'makeTax：frame 已销毁', 'ts');
  o += text(96, 78, 'rate', 'ts', 'end') + rect(104, 66, 46, 22, 'dash', 3) + text(127, 82, '9', 'ts', 'middle');
  o += rect(22, 104, 150, 108, 'frame', 8) + text(32, 122, 'main', 'ts');
  o += slot(104, 148, 'gst') + slot(104, 188, 'old');
  o += line(196, 30, 196, 218, 'grid');
  o += obj(262, 44, 220, 'lambda object', ['code: x -> x * rate / 100', 'captured rate: 9']);
  o += obj(262, 138, 220, 'lambda object', ['code: x -> x * rate / 100', 'captured rate: 7']);
  o += rect(266, 91, 212, 19, 'wash', 3) + rect(266, 185, 212, 19, 'wash', 3);
  o += arrow(127, 148, 260, 84, 'ink') + arrow(127, 188, 260, 176, 'ink');
  o += text(280, 240, 'makeTax 的 frame 连同 local variable rate 已经销毁；lambda 用的是创建时 copy 进 object 的值。', 'ts', 'middle');
  o += text(280, 257, '原件和 copy 一旦可以各自改动就会对不上，所以被 capture 的 variable 必须 effectively final。', 'ts', 'middle');
  return svg(560, 268, o, 'makeTax 已经 return，它的 stack frame 和 local variable rate 已销毁；main 里的 gst 和 old 各指向 heap 上的一个 lambda object，object 里存着被 capture 的 rate 的 copy，分别是 9 和 7');
}

// 第 6 站：alt.head() 的求值过程
function lazylist() {
  let o = '';
  const X = [10, 196, 382], W = 168, Y = 64;
  const names = ['alt', 'odds', 'evens'];
  const heads = ['head: () -> g(odds.head())', 'head: () -> f(evens.head())', 'head: () -> 0'];
  const tails = ['tail: () -> …', 'tail: () -> …', 'tail: () -> …'];
  for (let i = 0; i < 3; i++) {
    o += rect(X[i], Y, W, 76, 'paper', 6) + line(X[i], Y + 24, X[i] + W, Y + 24, 'mute');
    o += text(X[i] + W / 2, Y + 16.5, names[i], 'tb', 'middle');
    o += rect(X[i] + 4, Y + 28, W - 8, 20, 'wash', 3) + text(X[i] + 9, Y + 42.5, esc(heads[i]), 'ts');
    o += text(X[i] + 9, Y + 64, esc(tails[i]), 'ts') + text(X[i] + W - 9, Y + 64, '没有运行', 'ts', 'end');
  }
  // 请求：从左到右（上方）
  o += arrow(4, 44, 50, 62, 'dash') + text(6, 34, '① alt.head()', 't');
  o += path(`M${X[0] + 120} 62 Q${(X[0] + 120 + X[1] + 40) / 2} 30 ${X[1] + 40} 60`, 'dash') + poly([[X[1] + 40, 61], [X[1] + 31, 57.5], [X[1] + 36, 52.5]], 'ink-f');
  o += text((X[0] + 120 + X[1] + 40) / 2, 32, '② odds.head()', 't', 'middle');
  o += path(`M${X[1] + 120} 62 Q${(X[1] + 120 + X[2] + 40) / 2} 30 ${X[2] + 40} 60`, 'dash') + poly([[X[2] + 40, 61], [X[2] + 31, 57.5], [X[2] + 36, 52.5]], 'ink-f');
  o += text((X[1] + 120 + X[2] + 40) / 2, 32, '③ evens.head()', 't', 'middle');
  // 返回值：从右到左（下方）
  const yb = Y + 78;
  o += path(`M${X[2] + 40} ${yb} Q${(X[1] + 120 + X[2] + 40) / 2} ${yb + 34} ${X[1] + 120} ${yb + 2}`, 'ln') + poly([[X[1] + 120, yb + 1], [X[1] + 129, yb + 4.5], [X[1] + 124, yb + 9.5]], 'ln-f');
  o += text((X[1] + 120 + X[2] + 40) / 2, yb + 36, '④ 返回 0', 'tl', 'middle');
  o += path(`M${X[1] + 40} ${yb} Q${(X[0] + 120 + X[1] + 40) / 2} ${yb + 34} ${X[0] + 120} ${yb + 2}`, 'ln') + poly([[X[0] + 120, yb + 1], [X[0] + 129, yb + 4.5], [X[0] + 124, yb + 9.5]], 'ln-f');
  o += text((X[0] + 120 + X[1] + 40) / 2, yb + 36, '⑤ f(0) = 1', 'tl', 'middle');
  o += arrow(50, yb + 2, 6, yb + 22, 'ln') + text(6, yb + 40, '⑥ g(1) = 2', 'tl');
  o += text(280, 214, 'f 是 x -> x + 1，g 是 x -> x * 2。虚线是向 source 方向的请求，实线是算好的值往回传。', 'ts', 'middle');
  o += text(280, 231, '三个 tail 的 Producer 都没有被调用，第二个 element 根本没有生成。', 'ts', 'middle');
  return svg(560, 242, o, 'alt.head() 的求值：请求从 alt 传到 odds 再传到 evens，evens 的 head 返回 0，odds 对它应用 f 得到 1，alt 对它应用 g 得到 2；三个 list 的 tail 都没有被求值');
}

// 第 6 站：stream 的 element 一个一个被拉过整条 pipeline
function stream() {
  let o = '';
  const cols = [['iterate', 'x -> x + 1'], ['filter', 'x % 2 == 0'], ['map', 'x -> x * x'], ['limit(2)', ''], ['forEach', 'println']];
  const cx = (i) => 92 + i * 98;
  cols.forEach(([a, b], i) => {
    o += rect(cx(i) - 42, 14, 84, 40, i === 4 ? 'wash' : 'paper', 6) + text(cx(i), b ? 31 : 38.5, a, 'tb', 'middle') + (b ? text(cx(i), 47, esc(b), 'ts', 'middle') : '');
    o += line(cx(i), 54, cx(i), 250, 'grid');
  });
  const rows = [
    { y: 84, vals: ['1'], stop: 1, note: '被 filter 丢掉' },
    { y: 124, vals: ['2', '2', '4', '4'], stop: 4, note: '打印 4' },
    { y: 164, vals: ['3'], stop: 1, note: '被 filter 丢掉' },
    { y: 204, vals: ['4', '4', '16', '16'], stop: 4, note: '打印 16，limit 已满，停' },
  ];
  rows.forEach((r, k) => {
    o += text(26, r.y + 4.5, '第 ' + (k + 1) + ' 次', 'ts', 'middle');
    for (let i = 0; i < r.stop; i++) {
      o += arrow(cx(i) + 13, r.y, cx(i + 1) - 13, r.y, r.stop === 4 ? 'ln' : 'ink');
      o += text((cx(i) + cx(i + 1)) / 2, r.y - 6, r.vals[i], r.stop === 4 ? 'tl' : 't', 'middle');
    }
    o += circle(cx(0), r.y, 4, r.stop === 4 ? 'ln-f' : 'ink-f');
    if (r.stop === 1) o += path(`M${cx(1) - 5} ${r.y - 5}L${cx(1) + 5} ${r.y + 5}M${cx(1) - 5} ${r.y + 5}L${cx(1) + 5} ${r.y - 5}`, 'ink-b') + text(cx(1) + 14, r.y + 4.5, r.note, 'ts');
    else o += circle(cx(4), r.y, 4, 'ln-f');
  });
  o += text(cx(0), 240, '5 没有被生成', 'ts', 'middle');
  o += text(280, 268, '每一行是 forEach 向上游要一个 element 的全过程。', 'ts', 'middle');
  o += text(280, 285, '一个 element 走完整条 pipeline，下一个才从 iterate 出来。', 'ts', 'middle');
  return svg(560, 296, o, 'Stream pipeline 的求值顺序：element 1 被 filter 丢掉；element 2 通过 filter，map 成 4，被打印；element 3 被丢掉；element 4 map 成 16 被打印，limit 满了，pipeline 结束，5 没有被生成');
}

// 第 8 站：CompletableFuture 的 dependency graph，画在 time axis 上
function cf() {
  const sx = lin(0, 900, 96, 520);
  let o = '';
  const T = { A: [0, 300, 58], D: [300, 700, 106], C: [300, 500, 154], B: [300, 800, 206], E: [800, 900, 256] };
  const lab = { A: 'A = supplyAsync(…)', D: 'D = A.thenApplyAsync(…)', C: 'C = A.thenApplyAsync(…)', B: 'B = A.thenApplyAsync(…)', E: 'E = B.thenCombineAsync(C, …)' };
  const dur = { A: 300, B: 500, C: 200, D: 400, E: 100 };
  const ticks = [0, 300, 500, 700, 800, 900];
  for (const t of ticks) o += line(sx(t), 40, sx(t), 276, 'grid') + text(sx(t), 292, t === 900 ? '900 ms' : String(t), 'ts', 'middle');
  for (const k of Object.keys(T)) {
    const [a, b, y] = T[k];
    o += text(84, y + 4.5, k + '：' + dur[k] + ' ms', 'ts', 'end');
    o += rect(sx(a), y - 11, sx(b) - sx(a), 22, k === 'E' ? 'solid' : 'wash-strong', 5) + text((sx(a) + sx(b)) / 2, y + 4.5, k, k === 'E' ? 'tw' : 'tb', 'middle');
    if (k === 'A') o += text(sx(b) + 10, y + 4.5, lab[k], 'ts');
    else if (k === 'E') o += text(sx(a) - 10, y + 4.5, lab[k], 'ts', 'end');
    else o += text(sx(a) + 8, y - 17, lab[k], 'ts');
  }
  // dependency：A 完成后 B、C、D 才能开始；B、C 都完成后 E 才能开始
  o += line(sx(300), 58, sx(300), 217, 'ink-b') + line(sx(800), 154, sx(800), 267, 'ink-b');
  o += line(sx(500), 154, sx(800), 154, 'dash') + text(sx(500) + 10, 171, 'C 已完成，E 还在等 B', 'ts');
  o += text(280, 314, '粗竖线是 dependency：一个 task 的起点，由它依赖的 task 里最晚完成的那个决定。', 'ts', 'middle');
  o += text(280, 331, '总共 900 ms；五个 task 一个接一个做要 300 + 500 + 200 + 400 + 100 = 1500 ms。', 'ts', 'middle');
  return svg(560, 342, o, '五个 task 在 time axis 上：A 从 0 到 300 毫秒；B、C、D 都依赖 A，从 300 毫秒同时开始，分别到 800、500、700 毫秒；E 依赖 B 和 C，从 800 毫秒开始到 900 毫秒');
}

// 第 8 站：Summer 的 fork/join recursion tree（array 是 1..8，FORK_THRESHOLD = 2）
function forkjoin() {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8];
  const sum = (a, b) => arr.slice(a, b).reduce((s, v) => s + v, 0);
  const X = (a, b) => 46 + ((a + b) / 2) * 60;
  const Y = [34, 100, 166, 232];
  let o = '';
  const node = (a, b, lv) => {
    const w = lv === 3 ? 44 : 64;
    return rect(X(a, b) - w / 2, Y[lv] - 15, w, 30, lv === 3 ? 'wash' : 'paper', 6) + text(X(a, b), Y[lv] - 1, `[${a}, ${b})`, 'ts', 'middle') + text(X(a, b), Y[lv] + 12, String(sum(a, b)), 'tb', 'middle');
  };
  const rec = (a, b, lv) => {
    if (b - a < 2) { o += node(a, b, lv); return; }
    const m = (a + b) / 2;
    o += line(X(a, b) - 10, Y[lv] + 15, X(a, m), Y[lv + 1] - 15, 'ln-dash') + line(X(a, b) + 10, Y[lv] + 15, X(m, b), Y[lv + 1] - 15, 'ink');
    rec(a, m, lv + 1); rec(m, b, lv + 1);
    o += node(a, b, lv);
  };
  rec(0, 8, 0);
  o += line(16, 268, 42, 268, 'ln-dash') + text(48, 272, 'left.fork()：进 deque，别的 thread 可以 steal', 'ts');
  o += line(316, 268, 342, 268, 'ink') + text(348, 272, 'right.compute()：当前 thread 自己算', 'ts');
  o += text(280, 294, 'Node 上面是 index 范围，下面是这一段的 sum；sum 由 join() 逐层加回去：36 = 10 + 26。', 'ts', 'middle');
  return svg(560, 306, o, 'Summer 对 1 到 8 的 array 做 fork join 的 recursion tree：每个 node 把范围对半分，左半 fork，右半 compute，leaf 是单个 element，sum 由下向上合并成 36');
}

// ---------- 开头第三个 program：EagerList.iterate 一直往 stack 上压 frame ----------
function eager() {
  let o = '';
  o += text(130, 22, 'stack（往上长）', 'tb', 'middle') + text(410, 22, 'heap', 'tb', 'middle');
  const fx = 20, fw = 220, fh = 30, base = 290;
  const frames = ['main：nat = EagerList.iterate(0, …)', 'iterate(0, …)', 'iterate(1, …)', 'iterate(2, …)', 'iterate(3, …)'];
  frames.forEach((s, k) => {
    const y = base - (k + 1) * (fh + 6);
    o += rect(fx, y, fw, fh, k ? 'paper' : 'wash2', 5) + text(fx + 10, y + 19, s, k ? 't' : 'ts');
    if (k) o += text(fx + fw - 8, y + 19, `等 iterate(${k}, …)`, 'ts', 'end');
  });
  const ytop = base - 6 * (fh + 6);
  o += text(fx + fw / 2, ytop + 22, '⋮', 'tb', 'middle');
  o += rect(fx, ytop - 24, fw, 26, 'solid', 5) + text(fx + fw / 2, ytop - 6, 'StackOverflowError', 'tw', 'middle');
  o += line(280, 30, 280, base, 'grid');
  o += rect(320, 100, 180, 120, 'frame', 8) + text(410, 152, '一个 EagerList 都没有', 'ts', 'middle') + text(410, 170, '（new 从没执行到）', 'ts', 'middle');
  o += text(20, base + 26, '每个 iterate(k, …) 在 call constructor 之前，要先算出第二个 argument iterate(k + 1, …)：', 'ts');
  o += text(20, base + 44, '它自己的 frame 留在 stack 上等着，永远等不到。', 'ts');
  return svg(560, base + 56, o, 'EagerList.iterate 每一层都要先算出下一层才能 new，stack 上的 frame 越压越多，heap 上一个 object 都没有');
}

// ---------- reset 与 shift：parameter 得到的是 reference 的 copy ----------
function passval() {
  let o = '';
  const panel = (x0, title, mname, after) => {
    o += text(x0 + 130, 22, title, 'tb', 'middle');
    o += rect(x0 + 6, 40, 104, 58, 'frame', 6) + text(x0 + 14, 56, 'main', 'ts') + slot(x0 + 50, 78, 'a');
    o += rect(x0 + 6, 112, 104, 58, 'frame', 6) + text(x0 + 14, 128, mname, 'ts') + slot(x0 + 50, 150, 'q');
    if (after === 'reset') {
      o += obj(x0 + 150, 46, 104, 'Point', ['x: 3.0', 'y: 4.0']);
      o += obj(x0 + 150, 122, 104, 'Point', ['x: 0.0', 'y: 0.0']);
      o += arrow(x0 + 80, 78, x0 + 148, 78, 'ink') + arrow(x0 + 80, 150, x0 + 148, 152, 'ln');
      o += path(`M${x0 + 80} 146L${x0 + 118} 110L${x0 + 140} 90`, 'dash');
      o += text(x0 + 130, 210, 'q 改指新 object；a 没动', 'ts', 'middle');
    } else {
      o += obj(x0 + 150, 80, 104, 'Point', ['x: 9.0', 'y: 9.0']);
      o += rect(x0 + 150, 80, 104, 67, 'wash', 6);
      o += arrow(x0 + 80, 78, x0 + 148, 98, 'ink') + arrow(x0 + 80, 150, x0 + 148, 128, 'ln');
      o += text(x0 + 130, 210, '顺着 q 改了 a 指的那个 object', 'ts', 'middle');
    }
  };
  panel(10, 'reset(a) 里，q = new Point(0, 0) 之后', 'reset', 'reset');
  panel(290, 'shift(a) 里，q.moveTo(9, 9) 之后', 'shift', 'shift');
  o += text(280, 238, '两次 call 开始时，q 都是 a 里那个 reference 的 copy（虚线是 reset 里 q 原来的指向）。', 'ts', 'middle');
  return svg(560, 250, o, 'reset 让 parameter q 改指一个新 Point，caller 的 a 不受影响；shift 顺着 q 修改 a 指向的同一个 Point');
}

// ---------- immutable 的 Circle：c1 = c1.moveTo(1, 1) 之后 ----------
function immut() {
  let o = '';
  o += text(92, 22, 'stack', 'tb', 'middle') + text(385, 22, 'heap', 'tb', 'middle');
  o += rect(22, 34, 140, 232, 'frame', 8) + text(32, 52, 'main', 'ts');
  o += slot(98, 82, 'p') + slot(98, 160, 'c2') + slot(98, 232, 'c1');
  o += line(190, 30, 190, 272, 'grid');
  o += obj(236, 44, 126, 'Circle', ['c:', 'r: 1.0']) + rect(236, 44, 126, 67, 'dash', 6);
  o += obj(236, 126, 126, 'Circle', ['c:', 'r: 4.0']);
  o += obj(424, 70, 112, 'Point', ['x: 0.0', 'y: 0.0']);
  o += obj(236, 202, 126, 'Circle', ['c:', 'r: 1.0']) + rect(236, 202, 126, 67, 'wash', 6);
  o += obj(424, 202, 112, 'Point', ['x: 1.0', 'y: 1.0']) + rect(424, 202, 112, 67, 'wash', 6);
  o += text(299, 38, '原来的 c1，已经没人指着', 'ts', 'middle');
  o += path('M121 82 L206 82 L206 118 L414 118', 'ink') + poly([[422, 118], [414, 114], [414, 122]], 'ink-f');
  o += arrow(121, 160, 234, 160, 'ink') + arrow(121, 232, 234, 232, 'ln');
  o += circle(272, 80, 3.2, 'ink-f') + circle(272, 162, 3.2, 'ink-f') + circle(272, 238, 3.2, 'ink-f');
  o += path('M272 80 L400 80 L422 90', 'mute') + path('M272 162 L400 162 L422 120', 'ink') + poly([[422, 120], [414, 122], [418, 114]], 'ink-f');
  o += arrow(272, 238, 422, 238, 'ln');
  o += text(280, 292, '浅色底是 moveTo 新造的两个 object。原来的 Point 和 c2 一点没变。', 'ts', 'middle');
  return svg(560, 304, o, 'Immutable 的 Circle 和 Point：c1 改指新造的 Circle 和 Point，c2 和 p 仍指向原来那个在原点的 Point');
}

// ---------- Roster 的 representation exposure ----------
function roster() {
  let o = '';
  o += text(92, 22, 'stack', 'tb', 'middle') + text(385, 22, 'heap', 'tb', 'middle');
  o += rect(22, 34, 140, 140, 'frame', 8) + text(32, 52, 'main', 'ts');
  o += slot(98, 82, 'src') + slot(98, 142, 'r');
  o += line(190, 30, 190, 180, 'grid');
  o += obj(236, 110, 126, 'Roster', ['names:']);
  o += obj(412, 50, 124, 'ArrayList', ['"Ann"', '"Bob"']);
  o += arrow(121, 82, 410, 82, 'ink') + arrow(121, 142, 234, 142, 'ink');
  o += circle(300, 140, 3.2, 'ink-f') + path('M300 140 L380 140 L410 110', 'ln') + poly([[410, 110], [402, 112], [406, 104]], 'ln-f');
  o += text(280, 200, 'src.add("Bob") 之后：Roster 的 private final field 和 caller 的 src 指向同一个 list。', 'ts', 'middle');
  o += text(280, 218, 'getNames() 再交出去一份，外面的 code 就能直接 clear() 它。', 'ts', 'middle');
  return svg(560, 230, o, 'Roster 的 field names 和 caller 的 src 指向同一个 ArrayList，外面改这个 list，Roster 的 state 就变了');
}

// ---------- race condition：两个 thread 交错执行 balance = balance + 1 ----------
function race() {
  let o = '';
  const steps = [['T1', '读 balance：41'], ['T2', '读 balance：41'], ['T1', '算 41 + 1，写回 42'], ['T2', '算 41 + 1，写回 42']];
  const bal = [41, 41, 42, 42];
  const sx = (k) => 110 + k * 108, lanes = { T1: 50, T2: 106 };
  o += text(96, lanes.T1 + 18, 'thread 1', 'tb', 'end') + text(96, lanes.T2 + 18, 'thread 2', 'tb', 'end') + text(96, 182, 'balance', 'tb', 'end');
  steps.forEach(([t, s], k) => {
    const y = lanes[t];
    o += rect(sx(k) + 2, y, 104, 28, k >= 2 ? 'wash' : 'paper', 4) + text(sx(k) + 54, y + 18, s.split('，')[0], 'ts', 'middle');
    if (s.includes('，')) o += text(sx(k) + 54, y + 42, s.split('，')[1], 'tl', 'middle');
    o += rect(sx(k) + 30, 166, 48, 24, 'paper', 4) + text(sx(k) + 54, 183, String(bal[k]), 't', 'middle');
    o += text(sx(k) + 54, 34, `第 ${k + 1} 步`, 'ts', 'middle');
  });
  o += line(110, 156, 542, 156, 'grid');
  o += text(20, 222, '两个 thread 都在对方写回之前读到了 41，各自写回 42：做了两次加 1，balance 只多了 1。', 'ts');
  o += text(20, 240, '换一种交错（T1 读、写完了 T2 再读）就是 43。结果取决于 thread 恰好怎么排。', 'ts');
  return svg(560, 252, o, 'Race condition：thread 1 和 thread 2 先后读到 41，再先后写回 42，丢掉了一次加 1');
}

// ---------- parallel reduce：每段各自从 identity 开始 ----------
function preduce() {
  let o = '';
  const panel = (x0, title, id, op, sym, seqv) => {
    const leaves = [1, 2, 3, 4].map((e) => [e, op(id, e)]);
    const m1 = op(leaves[0][1], leaves[1][1]), m2 = op(leaves[2][1], leaves[3][1]), top = op(m1, m2);
    o += text(x0 + 130, 22, title, 'tb', 'middle');
    const X = (k) => x0 + 32 + k * 65, y1 = 70, y2 = 140, y3 = 206;
    leaves.forEach(([e, v], k) => {
      o += text(X(k), 46, `${id} ${sym} ${e}`, 'ts', 'middle');
      o += rect(X(k) - 22, y1 - 14, 44, 26, 'paper', 4) + text(X(k), y1 + 4, String(v).replace('-', '−'), 't', 'middle');
    });
    const c1 = (X(0) + X(1)) / 2, c2 = (X(2) + X(3)) / 2, c3 = (c1 + c2) / 2;
    o += line(X(0), y1 + 12, c1, y2 - 14, 'mute') + line(X(1), y1 + 12, c1, y2 - 14, 'mute') + line(X(2), y1 + 12, c2, y2 - 14, 'mute') + line(X(3), y1 + 12, c2, y2 - 14, 'mute');
    o += rect(c1 - 22, y2 - 14, 44, 26, 'paper', 4) + text(c1, y2 + 4, String(m1).replace('-', '−'), 't', 'middle');
    o += rect(c2 - 22, y2 - 14, 44, 26, 'paper', 4) + text(c2, y2 + 4, String(m2).replace('-', '−'), 't', 'middle');
    o += line(c1, y2 + 12, c3, y3 - 14, 'mute') + line(c2, y2 + 12, c3, y3 - 14, 'mute');
    o += rect(c3 - 24, y3 - 14, 48, 26, 'solid', 4) + text(c3, y3 + 4, String(top).replace('-', '−'), 'tw', 'middle');
    o += text(x0 + 130, 244, `parallel ${String(top).replace('-', '−')}；sequential ${String(seqv).replace('-', '−')}`, 'tl', 'middle');
  };
  const seq = (id, op) => [1, 2, 3, 4].reduce(op, id);
  panel(10, 'identity 1，(x, y) -> x + y', 1, (a, b) => a + b, '+', seq(1, (a, b) => a + b));
  panel(290, 'identity 0，(x, y) -> x - y', 0, (a, b) => a - b, '−', seq(0, (a, b) => a - b));
  o += text(280, 274, '最上面一行：4 个 element 各成一段，每段先和 identity 算一次；往下两两合并用的是同一个 function。', 'ts', 'middle');
  o += text(280, 292, '左边 1 被加了四次；右边减法换一种加括号的方式就换一个答案。', 'ts', 'middle');
  return svg(560, 304, o, 'Parallel reduce 对 1 到 4：identity 1 配加法得 14 而不是 11；identity 0 配减法得 0 而不是负 10');
}

export default {
  'cs2030-eager': eager,
  'cs2030-passval': passval,
  'cs2030-immut': immut,
  'cs2030-roster': roster,
  'cs2030-race': race,
  'cs2030-preduce': preduce,
  'cs2030-heap': heap,
  'cs2030-dispatch': dispatch,
  'cs2030-lsp': lsp,
  'cs2030-arrayhole': arrayhole,
  'cs2030-lattice': lattice,
  'cs2030-capture': capture,
  'cs2030-lazylist': lazylist,
  'cs2030-stream': stream,
  'cs2030-cf': cf,
  'cs2030-forkjoin': forkjoin,
};
