import { svg, svgA, anim, animRot, apath, ashow, f1, lin, logx, d, path, line, rect, circle, text, arrow } from '../lib/svg.mjs';

const R = Math.PI / 180;
const cents = (r) => 1200 * Math.log2(r);
// 一段时间内亮起：values 0 → 1 → 0（discrete）。on 为 0 时推迟一点，保证第一帧是暗的
const flash = (on, len, T) => ashow([0, 1, 0], [0, Math.max(on, 0.02) / T, Math.min(on + len, T - 0.001) / T], T);
// 绕回起点的那一下（第一帧就亮）：开头亮 len 秒，结尾最后一刻再亮
const flashWrap = (len, T) => ashow([1, 0, 1], [0, len / T, (T - 0.06) / T], T);

// ---------- 第 1 站：string 的 standing wave 与 harmonic series ----------
function string() {
  let o = text(20, 12, '两端固定的 string 只能这样振动：每一段都是半个 wave', 'ts');
  const x0 = 52, x1 = 292, L = x1 - x0;
  for (let n = 1; n <= 4; n++) {
    const yc = 48 + (n - 1) * 44, A = 13;
    o += line(x0, yc, x1, yc, 'grid');
    const up = [], dn = [];
    for (let i = 0; i <= 160; i++) {
      const x = x0 + (L * i) / 160, s = Math.sin((n * Math.PI * i) / 160);
      up.push([x, yc - A * s]); dn.push([x, yc + A * s]);
    }
    o += path(d(up), 'ln') + path(d(dn), 'ln-dash');
    o += rect(x0 - 7, yc - 17, 7, 34, 'solid2') + rect(x1, yc - 17, 7, 34, 'solid2');
    for (let k = 1; k < n; k++) o += circle(x0 + (L * k) / n, yc, 3, 'ink-f');
    o += text(316, yc - 1, `n = ${n}：${110 * n} Hz`, 'tb');
    o += text(316, yc + 15, n === 1 ? '整根是半个 wave（fundamental）' : `${n} 段，每段 L/${n}，frequency × ${n}`, 'ts');
  }
  o += text(x0, 228, '实线和虚线是同一根 string 振动的两个极端；黑点是 node（始终不动的点）', 'ts');
  // 下方：前 8 个 harmonic 排在 log 的 pitch 轴上
  const sx = logx(100, 920, 40, 540), Y = 300;
  o += text(20, 252, '前 8 个 harmonic 排在 pitch 轴上（等距 = 等 ratio）：相邻两个的 interval 越来越小', 'ts');
  o += line(40, Y, 540, Y, 'axis');
  const names = ['A2', 'A3', 'E4', 'A4', 'C♯5', 'E5', '≈G5', 'A5'];
  for (let n = 1; n <= 8; n++) {
    const x = sx(110 * n);
    o += circle(x, Y, 3.5, 'ink-f') + text(x, Y + 17, String(110 * n), 'ts', 'middle') + text(x, Y + 32, names[n - 1], 'ts', 'middle');
    if (n < 8) {
      const xa = sx(110 * n) + 3, xb = sx(110 * (n + 1)) - 3, xm = (xa + xb) / 2;
      o += line(xa, Y - 10, xb, Y - 10, 'mute') + line(xa, Y - 14, xa, Y - 6, 'mute') + line(xb, Y - 14, xb, Y - 6, 'mute');
      o += text(xm, Y - 18, `${n + 1}:${n}`, n < 3 ? 'tb' : 't', 'middle');
      o += text(xm, Y - 34, Math.round(cents((n + 1) / n)) + '¢', 'ts', 'middle');
    }
  }
  o += text(540, Y + 47, 'Hz', 'ts', 'end');
  return svg(560, 352, o, '一根两端固定的 string 的前四种 standing wave，以及 110 Hz 的前 8 个 harmonic 在 pitch 轴上的位置和相邻 interval');
}

// ---------- 第 1 站：三种 spectrum，同一个 fundamental ----------
function timbre() {
  const rows = [
    ['A', 'amplitude ∝ 1/n（sawtooth）', (n) => 1 / n],
    ['B', '只有 odd harmonics，∝ 1/n', (n) => (n % 2 ? 1 / n : 0)],
    ['C', '几乎只有 fundamental', (n) => (n === 1 ? 1 : n === 2 ? 0.12 : n === 3 ? 0.04 : 0)],
  ];
  let o = text(36, 12, 'spectrum：每个 harmonic 的 amplitude', 'tb') + text(290, 12, 'waveform：两个 period（共 18.2 ms）', 'tb');
  rows.forEach(([lab, desc, amp], i) => {
    const y0 = 34 + i * 92, base = y0 + 56;
    o += text(10, y0 + 34, lab, 'tbig', 'middle');
    o += line(34, base, 222, base, 'axis');
    for (let n = 1; n <= 10; n++) {
      const a = amp(n), x = 38 + (n - 1) * 18.5;
      if (a > 0) o += rect(x, base - 52 * a, 11, 52 * a, 'solid');
      o += text(x + 5.5, base + 13, String(n), 'ts', 'middle');
    }
    o += text(34, y0 - 4, desc, 'ts');
    // waveform
    const xa = 290, xb = 540, yc = y0 + 30, pts = [];
    const wave = (t) => { let s = 0; for (let n = 1; n <= 10; n++) s += amp(n) * Math.sin(2 * Math.PI * n * t); return s; };
    let mx = 0; for (let k = 0; k <= 400; k++) mx = Math.max(mx, Math.abs(wave((2 * k) / 400)));
    for (let k = 0; k <= 400; k++) { const t = (2 * k) / 400; pts.push([xa + ((xb - xa) * k) / 400, yc - (27 * wave(t)) / mx]); }
    o += line(xa, yc, xb, yc, 'grid') + line((xa + xb) / 2, yc - 30, (xa + xb) / 2, yc + 30, 'grid');
    o += path(d(pts), 'ink-b');
  });
  o += text(0, 314, '三行的 fundamental 都是 110 Hz（每个 period 9.09 ms），pitch 相同；不同的只有 recipe。', 'ts');
  return svg(560, 322, o, '三种 spectrum 和对应的 waveform：1/n 的 sawtooth、只有 odd harmonics、几乎只有 fundamental；三者 fundamental 相同');
}

// ---------- 第 2 站：beat、meter 与 syncopation（动图） ----------
function meter() {
  const bpm = 72, b = 60 / bpm, N = 12, Tp = N * b, T = Tp + 1.2;
  const x0 = 140, W = 390, xb = (beat) => x0 + 10 + (W * beat) / N; // beat 可以是小数；整数 k 是第 k+1 拍
  let o = text(10, 14, `tempo = ${bpm} beat per minute：每拍 ${b.toFixed(2)} s，12 拍共 ${Tp.toFixed(0)} s`, 'tb');
  const rowY = { sub: 50, duple: 100, triple: 154, rhy: 212 };
  o += text(10, rowY.sub + 4, 'subdivision', 't') + text(10, rowY.sub + 19, '每拍分成两半', 'ts');
  for (let k = 0; k < 2 * N; k++) o += line(xb(k / 2), rowY.sub - 5, xb(k / 2), rowY.sub + 5, k % 2 ? 'grid' : 'mute');
  const meterRow = (y, g, name, desc) => {
    o += text(10, y + 2, name, 'tb') + text(10, y + 17, desc, 'ts');
    for (let k = 0; k <= N; k += g) o += line(xb(k) - 10, y - 18, xb(k) - 10, y + 18, 'axis');
    for (let k = 0; k < N; k++) {
      const strong = k % g === 0;
      o += circle(xb(k), y, strong ? 8.5 : 4.5, strong ? 'ink-f' : 'paper');
      o += `<g>${circle(xb(k), y, 13, 'ln')}${flash(k * b, 0.28, T)}</g>`;
    }
  };
  meterRow(rowY.duple, 2, 'duple', 'strong–weak');
  meterRow(rowY.triple, 3, 'triple', 'strong–weak–weak');
  o += text(xb(N) - 10, rowY.duple - 24, '竖线 = bar line；大黑点 = downbeat', 'ts', 'end');
  o += text(10, rowY.rhy + 2, 'rhythm', 'tb') + text(10, rowY.rhy + 17, '叠在 beat 上的长短', 'ts');
  const pat = [[0, 1], [1, 1.5], [1.5, 3], [3, 4]];
  for (let g = 0; g < 3; g++) pat.forEach(([s0, e0], j) => {
    const a = 4 * g + s0, z = 4 * g + e0;
    o += rect(xb(a), rowY.rhy - 7, xb(z) - xb(a) - 3, 14, j === 2 ? 'solid' : 'solid2', 3);
    o += `<g>${rect(xb(a) - 3, rowY.rhy - 11, 8, 22, 'ln', 2)}${flash(a * b, 0.28, T)}</g>`;
  });
  o += line(xb(2), rowY.rhy - 16, xb(2), rowY.rhy + 16, 'dash');
  o += text((xb(1.5) + xb(3)) / 2, rowY.rhy + 34, '从半拍起、跨过第 3 拍：syncopation', 'tl', 'middle');
  const ph = (x) => d([[x, 30], [x, 226]]);
  o += apath([ph(xb(0)), ph(xb(N)), ph(xb(N))], [0, Tp / T, 1], T, 'ln');
  return svgA(560, 252, o, '动图：72 bpm 的 12 拍。同一串 beat 两拍一组是 duple，三拍一组是 triple；下面的 rhythm 里有一个从半拍开始、跨过下一拍的 note，是 syncopation');
}

// ---------- 第 3 站：sanfen sunyi 生成五声 ----------
function sanfen() {
  const seq = [['gong', 81], ['zhi', 108], ['shang', 72], ['yu', 96], ['jue', 64]];
  const base = 196, k = 1.3;
  let o = text(14, 12, '按生成的顺序：每一步把 pipe 加长或截短三分之一', 'tb');
  seq.forEach(([nm, len], i) => {
    const x = 40 + i * 68, h = len * k;
    o += rect(x, base - h, 26, h, 'paper', 3) + rect(x + 5, base - h, 16, 5, 'wash-strong', 1);
    o += text(x + 13, base + 18, nm, 'tb', 'middle') + text(x + 13, base + 34, String(len), 'ts', 'middle');
    if (i < 4) {
      const nx = 40 + (i + 1) * 68, up = i % 2 === 0;
      o += arrow(x + 28, 40, nx - 2, 40, 'ink', 6) + text((x + 26 + nx) / 2, 32, up ? '×4/3' : '×2/3', 'ts', 'middle');
    }
  });
  o += text(14, base + 58, '×4/3：pipe 长三分之一，低一个 fourth；×2/3：短三分之一，高一个 fifth', 'ts');
  // 右：按 pitch 排
  const lad = [['zhi', 108], ['yu', 96], ['gong', 81], ['shang', 72], ['jue', 64], ['zhi′', 54]];
  const cs = lad.map(([, l]) => cents(108 / l));
  const yy = (c) => base - 4 - c * 0.13, X = 420;
  o += text(470, 12, '按 pitch 排（从 zhi 起）', 'tb', 'middle');
  o += line(X, yy(0) + 6, X, yy(1200) - 6, 'axis');
  lad.forEach(([nm], i) => {
    o += circle(X, yy(cs[i]), 4, 'ink-f') + text(X - 10, yy(cs[i]) + 4, nm, i === 2 ? 'tl' : 't', 'end');
    if (i < lad.length - 1) {
      const r = lad[i][1] / lad[i + 1][1], c = cs[i + 1] - cs[i], small = Math.abs(r - 9 / 8) < 1e-9;
      o += text(X + 12, (yy(cs[i]) + yy(cs[i + 1])) / 2 + 4, (small ? '9:8' : '32:27') + '，' + Math.round(c) + '¢', small ? 'ts' : 'tl');
    }
  });
  return svg(560, 262, o, '三分损益：从长 81 的 pipe 出发，交替乘 4/3 和 2/3，得到 108、72、96、64；按 pitch 排列后相邻 interval 是 9:8 或 32:27');
}

// ---------- 第 3 站：几种 scale 怎样分 octave ----------
// UC Irvine 的 Sri Duhita primer 给的“相对 Western pitch 的偏差”，换成从最低音起的 cents
const fromDev = (devs) => { const abs = devs.map(([semi, dev]) => semi * 100 + dev); const o0 = abs[0]; return [...abs.map((c) => c - o0), 1200]; };
const SLENDRO = fromDev([[2, 28], [5, -35], [7, 17], [9, 40], [12, -10]]);          // D+28 F−35 G+17 A+40 C−10
const PELOG = fromDev([[2, -26], [3, -10], [5, -45], [7, 24], [8, 43], [9, 43], [11, 35]]); // D−26 E♭−10 F−45 G+24 G♯+43 A+43 B+35
function scales() {
  const sx = lin(0, 1200, 176, 536);
  const rows = [
    ['major', 'C D E F G A B', [0, 200, 400, 500, 700, 900, 1100, 1200]],
    ['natural minor', 'C D E♭ F G A♭ B♭', [0, 200, 300, 500, 700, 800, 1000, 1200]],
    ['gong mode', '三分损益的五声，从 gong 起', [0, 204, 408, 702, 906, 1200]],
    ['in scale', 'E F A B C（koto、shamisen）', [0, 100, 500, 700, 800, 1200]],
    ['slendro（一套实测）', '从 gulu 起', SLENDRO],
    ['pelog（同一份讲义）', '从 panunggul 起', PELOG],
  ];
  let o = text(sx(0), 14, '0', 'ts', 'middle') + text(sx(600), 14, '600¢', 'ts', 'middle') + text(sx(1200), 14, '1200¢（octave）', 'ts', 'end');
  for (let c = 0; c <= 1200; c += 100) o += line(sx(c), 22, sx(c), 280, 'grid');
  rows.forEach(([nm, sub, cs], i) => {
    const y = 46 + i * 44;
    o += text(0, y + 2, nm, 'tb') + text(0, y + 17, sub, 'ts');
    o += line(sx(0), y, sx(1200), y, 'axis');
    for (let j = 0; j < cs.length - 1; j++) {
      const step = cs[j + 1] - cs[j], semi = step <= 125;
      if (semi) o += line(sx(cs[j]) + 4, y, sx(cs[j + 1]) - 4, y, 'ln');
      o += text((sx(cs[j]) + sx(cs[j + 1])) / 2, y - 7, String(step), semi ? 'tl' : 'ts', 'middle');
    }
    cs.forEach((c) => (o += circle(sx(c), y, 4, 'ink-f')));
  });
  o += text(176, 306, '数字是相邻两音的距离（cents）；粗线标出 100 cents 左右的小步。', 'ts');
  return svg(560, 314, o, '六种 scale 在 0 到 1200 cents 的 octave 里的位置：major、natural minor、gong mode 五声、Japanese in scale，以及一套 gamelan 实测的 slendro 与 pelog');
}

// ---------- 第 4 站：四种 texture ----------
function texture() {
  const mel = [0, 2, 4, 2, 5, 4, 2, 0];
  const panel = (x0, y0, title, desc, draw) => rect(x0, y0, 266, 128, 'frame', 4) + text(x0 + 10, y0 + 18, title, 'tb') + text(x0 + 10, y0 + 34, desc, 'ts') + draw(x0 + 14, y0 + 118, 238 / 8);
  const bars = (X, Y, u, notes, off, lift, cls, dy = 6) => notes.map((p, i) => rect(X + (i + off) * u + 1, Y - (p + lift) * dy - 5, u - 2, 5, cls, 1)).join('');
  let o = '';
  o += panel(0, 0, 'monophony', '只有一条 line（unison 齐唱也算）', (X, Y, u) => bars(X, Y, u, mel, 0, 4, 'solid'));
  o += panel(282, 0, 'homophony', '一条 melody，加成块的 chord', (X, Y, u) => {
    let q = bars(X, Y, u, mel, 0, 7, 'solid', 5);
    const roots = [0, 0, 3, 3, 1, 1, 0, 0];
    for (let i = 0; i < 8; i += 2) for (const s of [0, 2, 4]) q += rect(X + i * u + 1, Y - (roots[i] + s) * 4 - 4, 2 * u - 2, 4, 'solid2', 1);
    return q;
  });
  o += panel(0, 140, 'polyphony', '两条独立的 line；第二条晚两拍模仿第一条', (X, Y, u) =>
    bars(X, Y, u, mel.slice(0, 7), 0, 6, 'solid') + bars(X, Y, u, mel.slice(0, 6), 2, 0, 'solid2'));
  o += panel(282, 140, 'heterophony', '同一条 melody 的两种走法同时进行', (X, Y, u) => {
    let q = bars(X, Y, u, mel, 0, 4, 'solid2');
    const seg = (t0, t1, p) => rect(X + t0 * u + 1, Y - (p + 4) * 6 - 13, (t1 - t0) * u - 2, 4, 'solid', 1);
    mel.forEach((p, i) => {
      const prev = i ? mel[i - 1] : p, lag = i ? 0.4 : 0;
      if (lag) q += seg(i, i + lag, prev);
      if (i % 2) q += seg(i + lag, i + 0.65, p) + seg(i + 0.65, i + 0.82, p + 1) + seg(i + 0.82, i + 1, p);
      else q += seg(i + lag, i + 1, p);
    });
    return q;
  });
  o += text(0, 286, '横轴是时间，纵轴是 pitch；同一种颜色是同一条 line。', 'ts');
  o += text(0, 302, 'Heterophony 里上面那条细的和下面的 melody 是同一个曲调：每个新音都晚到一点，有几处加了装饰音。', 'ts');
  return svg(560, 308, o, '四个小图：monophony 一条线；homophony 一条 melody 加成块的 chord；polyphony 两条独立并互相模仿的线；heterophony 同一条 melody 的朴素版和装饰版同时进行');
}

// ---------- 第 4 站：form 的几种排法 ----------
function form() {
  const cls = { A: 'wash-strong', B: 'wash', C: 'wash2' };
  const block = (x, y, w, lab, sub) => {
    const k = lab[0];
    return rect(x, y, w - 4, 30, (cls[k] || 'wash2') + '', 3) + rect(x, y, w - 4, 30, 'frame', 3) + text(x + (w - 4) / 2, y + 20, lab, 'tb', 'middle') + (sub ? text(x + (w - 4) / 2, y + 44, sub, 'ts', 'middle') : '');
  };
  let o = '';
  const X = 150;
  const row = (i, name, desc, items) => {
    const y = 14 + i * 60;
    o += text(0, y + 14, name, 'tb') + text(0, y + 30, desc, 'ts');
    let x = X;
    for (const [lab, w, sub] of items) { o += block(x, y, w, lab, sub); x += w; }
  };
  row(0, 'strophic', '同一段音乐配不同的 text', [['A', 128, 'verse 1'], ['A', 128, 'verse 2'], ['A', 128, 'verse 3']]);
  row(1, 'ternary', '离开，再回来', [['A', 128], ['B', 128], ['A', 128]]);
  row(2, 'rondo', 'Mouret 那一段（第 11 讲）', [['A', 72, '8 bars'], ['B', 72, '8 bars'], ['A', 56, '缩短'], ['C', 108, '约 20 bars'], ['A', 72]]);
  row(3, 'theme and variations', 'Brahms：每段都是 a b c b', [['a b c b', 96, 'theme'], ['a′ b′ c′ b′', 96, 'var. 1'], ['a″ b″ c″ b″', 96, 'var. 2'], ['…', 96]]);
  row(4, 'AABA（32 bars）', 'Over the Rainbow', [['intro', 40, '4'], ['A', 86, '8 bars'], ['A', 86, '8 bars'], ['B', 86, 'bridge 8'], ['A', 86, '8 bars']]);
  // ostinato：上面一直变，下面同一个 cycle
  const y = 14 + 5 * 60;
  o += text(0, y + 12, 'ostinato', 'tb') + text(0, y + 28, '下层同一个 cycle 一再重复，', 'ts') + text(0, y + 43, '上层不断变化', 'ts');
  const tops = ['A', 'B', 'C', 'D', 'E'];
  for (let j = 0; j < 5; j++) {
    o += rect(X + j * 77, y, 73, 20, j % 2 ? 'wash' : 'wash2', 3) + text(X + j * 77 + 36, y + 14, 'upper ' + tops[j], 'ts', 'middle');
    o += rect(X + j * 77, y + 24, 73, 20, 'solid2', 3) + text(X + j * 77 + 36, y + 38, 'bass cycle', 'tw', 'middle');
  }
  return svg(560, 366, o, '六种 form 的排法：strophic 的 A A A，ternary 的 A B A，rondo 的 A B A C A，theme and variations 的每段 a b c b，AABA 的 4 个 8 bar 段落，ostinato 的下层重复、上层变化');
}

// ---------- 第 5 站：ladrang 的 colotomic cycle（动图） ----------
const LADRANG = (() => {
  const kethuk = [], kempul = [], kenong = [];
  for (let k = 1; k <= 32; k++) {
    const m = ((k - 1) % 8) + 1; // 在 kenongan 里的第几拍
    if (m === 2 || m === 6) kethuk.push(k);
    if (m === 8) kenong.push(k);
    if (m === 4 && k > 8) kempul.push(k);
  }
  return { kethuk, kempul, kenong, wela: [4], gong: [32] };
})();
function ladrang() {
  const cx = 158, cy = 158, beat = 0.6, T = 32 * beat;
  const P = (k, r) => [cx + r * Math.cos((-90 + (360 * k) / 32) * R), cy + r * Math.sin((-90 + (360 * k) / 32) * R)];
  const rings = { kethuk: 112, kempul: 88, kenong: 64, gong: 36 };
  let o = '';
  for (const r of Object.values(rings)) o += circle(cx, cy, r, 'grid');
  for (let k = 1; k <= 32; k++) {
    const [x, y] = P(k, 134);
    o += circle(x, y, 2.2, 'mute-f');
    if (k % 4 === 0) { const [tx, ty] = P(k, 150); o += text(tx, ty + 4, String(k), k === 32 ? 'tl' : 'ts', 'middle'); }
  }
  // gatra 的分界：每 4 拍一条短线
  for (let g = 0; g < 8; g++) { const [a, b] = P(g * 4 + 0.5, 124), [c, e] = P(g * 4 + 0.5, 142); o += line(a, b, c, e, 'axis'); }
  const mark = (k, r, size, cls, on) => {
    const [x, y] = P(k, r);
    let q = circle(x, y, size, cls);
    q += `<g>${circle(x, y, size + 5, 'ln')}${k === 32 ? flashWrap(0.5, T) : flash(k * beat, 0.45, T)}</g>`;
    return on ? q : '';
  };
  for (const k of LADRANG.kethuk) o += mark(k, rings.kethuk, 4, 'ink-f', true);
  for (const k of LADRANG.kempul) o += mark(k, rings.kempul, 6.5, 'paper', true);
  { const [x, y] = P(4, rings.kempul); o += circle(x, y, 6.5, 'dash'); }
  for (const k of LADRANG.kenong) o += mark(k, rings.kenong, 7.5, 'solid2', true);
  o += mark(32, rings.gong, 11, 'solid', true);
  // pointer
  const [px, py] = P(0, 128);
  o += `<g>${line(cx, cy, px, py, 'ln')}${animRot([0, 360], cx, cy, [0, 1], T)}</g>` + circle(cx, cy, 3, 'ink-f');
  // 右边：图例和拍位
  const X = 330, Lx = 344;
  const leg = [
    ['gong ageng', LADRANG.gong.join(', ') + '（cycle 的最后一拍）', (x, y) => circle(x, y, 8, 'solid')],
    ['kenong', LADRANG.kenong.join(', '), (x, y) => circle(x, y, 7, 'solid2')],
    ['kempul', LADRANG.kempul.join(', ') + '（4 是 wela，空着）', (x, y) => circle(x, y, 6, 'paper')],
    ['kethuk', LADRANG.kethuk.slice(0, 3).join(', ') + ', …, ' + LADRANG.kethuk[7], (x, y) => circle(x, y, 4, 'ink-f')],
    ['balungan', '每一拍（外圈小点）', (x, y) => circle(x, y, 2.5, 'mute-f')],
  ];
  o += text(X, 26, 'ladrang：一个 gongan 32 拍', 'tb');
  leg.forEach(([nm, s, sym], i) => {
    const y = 58 + i * 40;
    o += sym(Lx, y - 4) + text(Lx + 16, y, nm, 'tb') + text(Lx + 16, y + 16, s, 'ts');
  });
  o += text(X, 270, '8 个 gatra（每个 4 拍，外圈短线分开）；', 'ts') + text(X, 286, '越大、越低的 gong 打得越稀，全部汇向 32。', 'ts');
  return svgA(560, 316, o, '动图：ladrang 的 32 拍排成一圈，32 在最上面。指针顺时针走，kethuk 在 2、6、10……30，kempul 在 12、20、28，kenong 在 8、16、24、32，gong ageng 在 32');
}

// ---------- 第 5 站：irama I 与 irama II 的层次（动图） ----------
function irama() {
  const Tw = 8, T = Tw + 1.2, x0 = 118, W = 418, tx = (t) => x0 + (W * t) / Tw;
  const insts = [['peking', 3, 'ln-f'], ['balungan', 4, 'ink-f'], ['kethuk', 4.5, 'ink-f'], ['kempul', 6, 'paper'], ['kenong', 6.5, 'solid2'], ['gong', 8, 'solid']];
  let o = '';
  const panel = (y0, title, beatLen, pekPer) => {
    const st = { peking: [], balungan: [], kethuk: [], kempul: [], kenong: [], gong: [] };
    let last = 24;
    for (let j = 1; j * beatLen <= Tw + 1e-9; j++) {
      const t = j * beatLen, k = 24 + j; // 第 25 到 32 拍：最后一个 kenongan
      last = k;
      st.balungan.push(t);
      if (LADRANG.kethuk.includes(k)) st.kethuk.push(t);
      if (LADRANG.kempul.includes(k)) st.kempul.push(t);
      if (LADRANG.kenong.includes(k)) st.kenong.push(t);
      if (k === 32) st.gong.push(t);
      for (let q = 1; q <= pekPer; q++) st.peking.push(t - beatLen + (q * beatLen) / pekPer);
    }
    o += text(0, y0, title, 'tb') + text(x0, y0, `balungan ${st.balungan.length} 拍（第 25 到 ${last} 拍），peking ${st.peking.length} 下，每拍 ${pekPer} 下`, 'ts');
    insts.forEach(([nm, r, cls], i) => {
      const y = y0 + 22 + i * 21;
      o += text(0, y + 4, nm, 'ts') + line(x0, y, x0 + W, y, 'grid');
      for (const t of st[nm]) {
        const x = tx(t) - (t >= Tw ? r : 0);
        o += circle(x, y, r, cls) + `<g>${circle(x, y, r + 4, 'ln')}${flash(t, 0.22, T)}</g>`;
      }
    });
  };
  panel(14, 'irama I', 1, 2);
  panel(192, 'irama II', 2, 4);
  const Y = 336;
  o += line(x0, Y, x0 + W, Y, 'axis');
  for (let t = 0; t <= Tw; t += 2) o += line(tx(t), Y, tx(t), Y + 4, 'axis') + text(tx(t), Y + 17, t + ' s', 'ts', 'middle');
  o += text(0, Y + 4, '同样的 8 s', 'ts');
  const ph = (x) => d([[x, 20], [x, Y]]);
  o += apath([ph(x0), ph(x0 + W), ph(x0 + W)], [0, Tw / T, 1], T, 'ln');
  o += text(x0 + W, 166, '一个 kenongan 走完：kenong 与 gong 在第 32 拍一起落下', 'ts', 'end');
  return svgA(560, 360, o, '动图：同样 8 秒里两种 irama 的各层乐器。irama I 时 balungan 每秒一拍，peking 每拍两下；irama II 时 balungan 两秒一拍，peking 每拍四下，peking 实际的快慢不变，框架被拉长一倍');
}

// ---------- 第 6 站：Yaman 与 Bhupali ----------
function raga() {
  const yy = (c) => 236 - (c + 100) * 0.15;
  const NOTE = { 'Ṇi': -100, Sa: 0, Re: 200, Ga: 400, Ma: 500, 'Ma♯': 600, Pa: 700, Dha: 900, Ni: 1100, 'Sȧ': 1200 };
  let o = '';
  for (const c of [0, 700, 1200]) o += rect(0, yy(c) - 5, 556, 10, 'wash', 2);
  const panel = (x0, title, sub, used, aroha, avaroha, vadi, samvadi) => {
    o += text(x0, 14, title, 'tb') + text(x0, 30, sub, 'ts');
    const ladder = ['Ṇi', 'Sa', 'Re', 'Ga', used.includes('Ma♯') ? 'Ma♯' : 'Ma', 'Pa', 'Dha', 'Ni', 'Sȧ'];
    for (const n of ladder) {
      const y = yy(NOTE[n]), on = used.includes(n);
      o += line(x0 + 52, y, x0 + 210, y, on ? 'ink' : 'grid') + text(x0 + 44, y + 4, n, on ? 't' : 'ts', 'end');
    }
    const pa = aroha.map((n, i) => [x0 + 62 + i * 10, yy(NOTE[n])]);
    const pd = avaroha.map((n, i) => [x0 + 134 + i * 10, yy(NOTE[n])]);
    o += path(d(pa), 'ln') + path(d(pd), 'ln-dash');
    for (const p of [...pa, ...pd]) o += circle(p[0], p[1], 2.6, 'ln-f');
    o += text(x0 + 56, yy(-100) + 22, 'aroha（上行）', 'ts') + text(x0 + 136, yy(-100) + 22, 'avaroha（下行）', 'ts');
    o += circle(x0 + 218, yy(NOTE[vadi]), 6, 'solid') + text(x0 + 228, yy(NOTE[vadi]) + 4, 'vadi', 'tl');
    o += circle(x0 + 218, yy(NOTE[samvadi]), 6, 'paper') + text(x0 + 228, yy(NOTE[samvadi]) + 4, 'samvadi', 'tb');
  };
  panel(0, 'Raga Yaman', 'Ma 用 tivra；aroha 从低音 Ni 起、跳过 Pa', ['Ṇi', 'Sa', 'Re', 'Ga', 'Ma♯', 'Pa', 'Dha', 'Ni', 'Sȧ'],
    ['Ṇi', 'Re', 'Ga', 'Ma♯', 'Dha', 'Ni', 'Sȧ'], ['Sȧ', 'Ni', 'Dha', 'Pa', 'Ma♯', 'Ga', 'Re', 'Sa'], 'Ga', 'Ni');
  panel(290, 'Raga Bhupali', '只有五个音（audav）', ['Sa', 'Re', 'Ga', 'Pa', 'Dha', 'Sȧ'],
    ['Sa', 'Re', 'Ga', 'Pa', 'Dha', 'Sȧ'], ['Sȧ', 'Dha', 'Pa', 'Ga', 'Re', 'Sa'], 'Ga', 'Dha');
  o += text(0, 280, '浅色横带是一直在响的 drone（Sa 与 Pa）；灰色的音名和细线是这个 raga 不用的音。', 'ts');
  o += text(0, 296, '纵轴按 equal temperament 的 cents 画，只为看清位置；实际的 intonation 由歌者对着 drone 校准。', 'ts');
  return svg(560, 302, o, 'Raga Yaman 与 Raga Bhupali 的音、上行与下行的走法、vadi 与 samvadi，以及一直在响的 Sa 和 Pa 的 drone');
}

// ---------- 第 6 站：tīntāl 的 cycle（动图） ----------
function tintal() {
  const cx = 150, cy = 150, Rr = 96, m = 0.5, T = 16 * m;
  const ang = (k) => (-90 + (360 * (k - 1)) / 16) * R; // 第 k 个 matra
  const P = (k, r) => [cx + r * Math.cos(ang(k)), cy + r * Math.sin(ang(k))];
  const bols = ['dhā', 'dhin', 'dhin', 'dhā', 'dhā', 'dhin', 'dhin', 'dhā', 'dhā', 'tin', 'tin', 'tā', 'tā', 'dhin', 'dhin', 'dhā'];
  let o = '';
  // vibhag 扇形
  for (let v = 0; v < 4; v++) {
    const a0 = ang(v * 4 + 1) - 11.25 * R, a1 = a0 + 90 * R, r0 = Rr - 30, r1 = Rr + 12;
    const pts = [];
    for (let s = 0; s <= 24; s++) { const a = a0 + ((a1 - a0) * s) / 24; pts.push([cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)]); }
    for (let s = 24; s >= 0; s--) { const a = a0 + ((a1 - a0) * s) / 24; pts.push([cx + r0 * Math.cos(a), cy + r0 * Math.sin(a)]); }
    o += path(d(pts) + 'Z', v === 2 ? 'wash2' : 'wash');
    o += line(cx + r0 * Math.cos(a0), cy + r0 * Math.sin(a0), cx + r1 * Math.cos(a0), cy + r1 * Math.sin(a0), 'ink');
  }
  for (let k = 1; k <= 16; k++) {
    const [x, y] = P(k, Rr - 10), [bx, by] = P(k, Rr + 26), [nx, ny] = P(k, Rr - 44);
    o += circle(x, y, k % 4 === 1 ? 6 : 3.5, k === 1 ? 'solid' : 'ink-f');
    o += `<g>${circle(x, y, 11, 'ln')}${k === 1 ? flashWrap(0.3, T) : flash((k - 1) * m, 0.3, T)}</g>`;
    o += text(bx, by + 4, bols[k - 1], k >= 10 && k <= 13 ? 'ts' : 't', 'middle');
    o += text(nx, ny + 4, String(k), 'ts', 'middle');
  }
  const marks = [[1, 'X'], [5, '2'], [9, '0'], [13, '3']];
  for (const [k, s] of marks) { const [x, y] = P(k - 0.55, Rr + 46); o += text(x, y + 6, s, 'tl', 'middle'); }
  const [px, py] = P(1, Rr + 4);
  o += `<g>${line(cx, cy, px, py, 'ln')}${animRot([0, 360], cx, cy, [0, 1], T)}</g>` + circle(cx, cy, 3, 'ink-f');
  const X = 338;
  o += text(X, 28, 'tīntāl：16 mātrā = 4 + 4 + 4 + 4', 'tb');
  const rows = [['X', 'sam：clap，mātrā 1'], ['2', 'tālī：clap，mātrā 5'], ['0', 'khālī：wave，mātrā 9'], ['3', 'tālī：clap，mātrā 13']];
  rows.forEach(([s, t], i) => { o += text(X + 6, 60 + i * 24, s, 'tl', 'middle') + text(X + 20, 60 + i * 24, t, 't'); });
  o += text(X, 172, '圈外是 theka 的 bol；灰底那一段', 'ts') + text(X, 188, '（mātrā 9 到 12）是 khālī，', 'ts') + text(X, 204, 'bol 换成 tin、tā。', 'ts');
  o += text(X, 236, '动图按每 mātrā 0.5 s：', 'ts') + text(X, 252, '一个 āvartan 8 s，回到 sam 重新开始。', 'ts');
  return svgA(560, 300, o, '动图：tintal 的 16 个 matra 排成一圈，分成四个 vibhag；sam 在最上面，clap 在 1、5、13，wave 在 9；圈外写着 theka 的 bol，指针每 0.5 秒走一个 matra');
}

// ---------- 第 6 站：tihai 落在 sam 上 ----------
function tihai() {
  const x0 = 70, u = 27.5, cx = (k) => x0 + (k - 1) * u;
  let o = '';
  for (let k = 1; k <= 17; k++) {
    o += rect(cx(k), 30, u - 3, 22, k === 17 ? 'wash-strong' : k >= 9 && k <= 12 ? 'wash2' : 'frame', 2);
    o += text(cx(k) + (u - 3) / 2, 46, k === 17 ? '1' : String(k), k === 17 || k === 1 ? 'tl' : 'ts', 'middle');
  }
  for (const [k, s] of [[1, 'X'], [5, '2'], [9, '0'], [13, '3'], [17, 'X']]) o += text(cx(k) + (u - 3) / 2, 22, s, 'tl', 'middle');
  o += text(0, 46, 'mātrā', 'ts') + text(cx(17) + u / 2, 68, '下一个 sam', 'ts', 'middle');
  const ex = (y, p, g) => {
    const total = 3 * p + 2 * g, start = 18 - total;
    o += text(0, y - 8, `phrase ${p} 拍` + (g ? `，中间空 ${g} 拍` : '，不留空'), 'tb');
    o += text(0, y + 26, `3 × ${p}` + (g ? ` + 2 × ${g}` : '') + ` = ${total}；起点 = 18 − ${total} = ${start}`, 'ts');
    let k = start;
    for (let r = 0; r < 3; r++) {
      o += rect(cx(k) + 1, y, p * u - 5, 14, r === 2 ? 'solid' : 'solid2', 3);
      k += p;
      if (r < 2 && g) { o += text(cx(k) + (g * u - 3) / 2, y + 11, '·', 'ts', 'middle'); k += g; }
    }
  };
  ex(104, 3, 1);
  ex(170, 5, 0);
  return svg(560, 206, o, '两种 tihai：3 拍的 phrase 中间各空 1 拍、从 matra 7 起；5 拍的 phrase 不留空、从 matra 3 起；两者的最后一个音都落在下一个 cycle 的 sam 上');
}

// ---------- 第 1 站：string 的 harmonic 与 gamelan bar 的 partial ----------
function partials() {
  const f0 = 393.5, sx = logx(0.9, 7.4, 40, 540);
  const rows = [
    ['string', '理想 string：1、2、3……倍', [1, 2, 3, 4, 5, 6, 7], 90],
    ['jublag bar 4', 'Jones、Gee 与 Grimshaw 2010 实测', [1, 2.77, 5.18, 5.33, 6.32], 196],
  ];
  let o = text(10, 14, `fundamental 都是 ${f0} Hz；竖线下的数字是 frequency ratio，括号里是 Hz`, 'ts');
  rows.forEach(([nm, sub, rs, y], i) => {
    o += text(10, y - 46, nm, 'tb') + text(10 + (i ? 104 : 60), y - 46, sub, 'ts');
    for (let n = 1; n <= 7; n++) o += line(sx(n), y - 34, sx(n), y + 4, 'grid');
    o += line(sx(0.95), y, sx(7.3), y, 'axis');
    rs.forEach((r, k) => {
      const x = sx(r);
      o += line(x, y, x, y - (k === 0 ? 30 : 22), i ? 'ln' : 'ink-b');
      const pair = i === 1 && (r === 5.18 || r === 5.33);
      const dx = !pair ? 0 : r === 5.18 ? -4 : 4, anc = !pair ? 'middle' : r === 5.18 ? 'end' : 'start';
      o += text(x + dx, y + 15, String(r), 'ts', anc);
      if (i === 1 && !pair) o += text(x, y + 29, '(' + f1(f0 * r) + ')', 'ts', 'middle');
    });
  });
  const a = f0 * 5.18, b = f0 * 5.33;
  o += text(sx(5.25) + 20, 246, `${f1(a)} 与 ${f1(b)} Hz 只差 ${Math.round(b - a)} Hz：roughness`, 'tl', 'end');
  return svg(560, 256, o, '理想 string 的 harmonic 是 1 到 7 倍的整数；Balinese gamelan 一根 jublag bar 实测的 partial 是 1、2.77、5.18、5.33、6.32 倍，其中 5.18 与 5.33 只差 59 Hz');
}

// ---------- 第 2 站：hemiola，同一串 eighth note 两种分组（动图） ----------
function hemiola() {
  const N = 12, e = 0.3, Tp = N * e, T = Tp + 1.2, x0 = 150, W = 384, xe = (k) => x0 + 12 + (W * k) / N;
  let o = text(10, 14, `12 个 eighth note（动图按每个 ${e} s 走）`, 'tb');
  o += text(10, 54, 'eighth note', 't');
  for (let k = 0; k < N; k++) o += circle(xe(k), 50, 3, 'mute-f') + text(xe(k), 36, String(k + 1), 'ts', 'middle');
  const row = (y, g, name, sub) => {
    o += text(10, y + 2, name, 'tb') + text(10, y + 17, sub, 'ts');
    for (let k = 0; k < N; k += g) {
      o += rect(xe(k) - 10, y - 14, (W * g) / N - 4, 28, g === 3 ? 'wash' : 'wash2', 4);
    }
    for (let k = 0; k < N; k++) {
      const strong = k % g === 0;
      o += circle(xe(k), y, strong ? 8 : 3.5, strong ? 'ink-f' : 'paper');
      if (strong) o += `<g>${circle(xe(k), y, 12, 'ln')}${flash(k * e, 0.22, T)}</g>`;
    }
  };
  row(100, 3, '6/8：3 + 3', '两拍一组，每拍三份');
  row(160, 2, 'hemiola：2 + 2 + 2', '临时改成三组二');
  for (const k of [0, 6]) o += line(xe(k), 76, xe(k), 182, 'dash');
  o += text(xe(6) - 6, 206, '只在第 1、7 个 eighth note 上两行同时重', 'ts', 'end');
  const ph = (x) => d([[x, 26], [x, 190]]);
  o += apath([ph(xe(0) - 10), ph(xe(N) - 10), ph(xe(N) - 10)], [0, Tp / T, 1], T, 'ln');
  return svgA(560, 216, o, '动图：12 个 eighth note，上面按 3 + 3 分组，重音在 1、4、7、10；下面按 2 + 2 + 2 分组，重音在 1、3、5、7、9、11；两行只在 1 和 7 同时重');
}

// ---------- 第 4 站：Bach C minor fugue 前 20 个 bar 的 subject ----------
function fugue() {
  const B = 20, x0 = 92, W = 444, xb = (bar) => x0 + (W * (bar - 1)) / B; // 第 bar 个 bar 的起点
  const Y = { soprano: 60, alto: 104, bass: 148 };
  let o = '';
  for (let b = 1; b <= B + 1; b++) for (const y of [60, 104, 148]) o += line(xb(b), y - 4, xb(b), y + 4, 'mute');
  for (const b of [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]) o += text(xb(b) + W / B / 2, 30, String(b), 'ts', 'middle');
  o += text(10, 30, 'bar', 'ts');
  for (const [v, y] of Object.entries(Y)) o += text(10, y + 4, v, 'tb') + line(x0, y, x0 + W, y, 'axis');
  const ent = [['alto', 1, 'C minor'], ['soprano', 3, ''], ['bass', 7, ''], ['soprano', 11, 'major'], ['alto', 15, '']];
  ent.forEach(([v, b, k], i) => {
    o += rect(xb(b) + 1, Y[v] - 9, 2 * (W / B) - 2, 18, i < 3 ? 'solid' : 'solid2', 3);
    o += text(xb(b) + W / B, Y[v] + 4, 'subject', 'tw', 'middle');
    if (k) o += text(xb(b) + W / B, Y[v] - 14, k, 'ts', 'middle');
  });
  // exposition bracket
  o += line(xb(1), 176, xb(9), 176, 'ink') + line(xb(1), 172, xb(1), 180, 'ink') + line(xb(9), 172, xb(9), 180, 'ink');
  o += text((xb(1) + xb(9)) / 2, 194, 'exposition', 'tb', 'middle') + text((xb(1) + xb(9)) / 2, 208, '三个 voice 依次进来', 'ts', 'middle');
  o += rect(xb(9) + 2, 172, 2 * (W / B) - 4, 8, 'wash2', 2) + text(xb(10), 194, 'episode', 'ts', 'middle');
  o += text(xb(10), 208, 'minor → major', 'ts', 'middle');
  o += rect(xb(17) + 2, 172, 4 * (W / B) - 4, 8, 'wash2', 2) + text(xb(19), 194, 'motive 互换', 'ts', 'middle');
  o += text(xb(19), 208, 'bass ↔ alto', 'ts', 'middle');
  o += text(10, 232, 'exposition 里的三次 subject 和之后的两次 entry 用两种颜色区分；每块按 2 个 bar 画。', 'ts');
  o += text(10, 248, '第 20 bar 之后音乐回到 C minor，subject 在 soprano 里最后出现一次，以 major chord 结束。', 'ts');
  return svg(560, 258, o, 'Bach 的 C minor fugue 前 20 个 bar：alto 在第 1 bar、soprano 在第 3 bar、bass 在第 7 bar 奏 subject，构成 exposition；第 9 到 10 bar 的 episode 从 minor 走到 major；soprano 在第 11 bar、alto 在第 15 bar 再奏 subject；第 17 到 20 bar 两个 motive 在 bass 和 alto 之间互换');
}

// ---------- 第 6 站：Bhupali 与 Deshkar，同样五个音 ----------
function deshkar() {
  const sx = lin(0, 1200, 120, 520);
  const notes = [['Sa', 0], ['Re', 200], ['Ga', 400], ['Pa', 700], ['Dha', 900], ['Sȧ', 1200]];
  const rows = [
    ['Bhupali', 'Kalyan thaat，晚上', { Ga: ['vadi', 12, 'solid'], Dha: ['samvadi', 8, 'paper'], Re: ['', 5, 'ink-f'] }, 70],
    ['Deshkar', 'Bilawal thaat，早晨', { Dha: ['vadi', 12, 'solid'], Ga: ['samvadi', 8, 'paper'], Re: ['弱化', 3, 'mute-f'] }, 160],
  ];
  let o = rect(sx(600), 120, sx(1200) - sx(600) + 14, 76, 'wash', 4) + text(sx(1200) + 10, 212, 'Deshkar 在上半个 octave 展开', 'ts', 'end');
  rows.forEach(([nm, sub, w, y]) => {
    o += text(0, y + 2, nm, 'tb') + text(0, y + 17, sub, 'ts');
    o += line(sx(0) - 8, y, sx(1200) + 8, y, 'axis');
    for (const [n, c] of notes) {
      const [lab, r, cls] = w[n] || ['', 5, 'ink-f'];
      o += circle(sx(c), y, r, cls) + text(sx(c), y - 18, n, 't', 'middle');
      if (lab) o += text(sx(c), y + 30, lab, lab === 'vadi' ? 'tl' : 'ts', 'middle');
    }
  });
  o += text(120, 238, '横轴按 equal temperament 的 cents 画（Sa = 0），只为看清位置。', 'ts');
  return svg(560, 246, o, 'Bhupali 与 Deshkar 用同样的 Sa Re Ga Pa Dha：Bhupali 的 vadi 是 Ga、samvadi 是 Dha，晚上奏；Deshkar 的 vadi 是 Dha、samvadi 是 Ga，Re 被弱化，在上半个 octave 展开，早晨奏');
}

// ---------- 第 5 站：键盘（triad 与 key 共用） ----------
const WHITE_PC = [0, 2, 4, 5, 7, 9, 11];
// 在 (x0, y0) 画 nWhite 个白键的键盘，从 C 开始；返回画法和 semitone → 键中心 x 的函数
function keyboard(x0, y0, ww, wh, nWhite) {
  const bw = ww * 0.6, bh = wh * 0.6;
  let o = '';
  for (let i = 0; i < nWhite; i++) o += rect(x0 + i * ww, y0, ww, wh, 'paper');
  for (let i = 0; i < nWhite - 1; i++) if ([0, 2, 5, 7, 9].includes(WHITE_PC[i % 7])) o += rect(x0 + (i + 1) * ww - bw / 2, y0, bw, bh, 'solid2');
  const kx = (s) => {
    const oct = Math.floor(s / 12), pc = s % 12, wi = WHITE_PC.indexOf(pc);
    if (wi >= 0) return { x: x0 + (oct * 7 + wi) * ww + ww / 2, black: false };
    return { x: x0 + (oct * 7 + WHITE_PC.indexOf(pc - 1) + 1) * ww, black: true };
  };
  return { o, kx, bh };
}

// ---------- 第 5 站：三种 triad ----------
function triads() {
  const rows = [
    ['major triad', 'C E G', [0, 4, 7], ['4 + 3 = 7 个 half step', '两端是 fifth（700¢）']],
    ['minor triad', 'C E♭ G', [0, 3, 7], ['3 + 4 = 7 个 half step', '两端仍是 fifth（700¢）']],
    ['diminished triad', 'C E♭ G♭', [0, 3, 6], ['3 + 3 = 6 个 half step', '两端 600¢，半个 octave']],
  ];
  let o = '';
  rows.forEach(([nm, notes, semis], j) => {
    const x0 = 6 + j * 186, y0 = 40, ww = 21, wh = 84;
    const k = keyboard(x0, y0, ww, wh, 8);
    o += text(x0, 14, nm, 'tb') + text(x0, 30, notes, 'ts') + k.o;
    const pts = semis.map((s) => k.kx(s));
    pts.forEach((q) => (o += circle(q.x, q.black ? y0 + k.bh - 10 : y0 + wh - 12, 6, 'solid')));
    for (let i = 0; i < 2; i++) {
      const xa = pts[i].x, xb = pts[i + 1].x, y = y0 + wh + 14;
      o += line(xa, y, xb, y, 'ink') + line(xa, y - 4, xa, y + 4, 'ink') + line(xb, y - 4, xb, y + 4, 'ink');
      o += text((xa + xb) / 2, y + 17, String(semis[i + 1] - semis[i]), 'tl', 'middle');
    }
    o += text(x0, y0 + wh + 52, rows[j][3][0], 'ts') + text(x0, y0 + wh + 68, rows[j][3][1], 'ts');
  });
  o += text(6, 222, '数字是相邻两音之间的 half step 个数。Triad 是在 scale 上“取一个、跳一个”取出的第 1、3、5 个 degree。', 'ts');
  return svg(560, 228, o, '三个键盘：major triad C E G 是 4 加 3 个 half step，minor triad C E♭ G 是 3 加 4，diminished triad C E♭ G♭ 是 3 加 3');
}

// ---------- 第 5 站：dominant key 与 relative major ----------
function keys() {
  const NOTE = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
  const rows = [
    ['G major', [7, 9, 11, 0, 2, 4, 6], 'D major', [2, 4, 6, 7, 9, 11, 1], ['七个音里六个相同，', '只差 C 和 C♯：', '去 dominant key 只改一个音。']],
    ['C minor', [0, 2, 3, 5, 7, 8, 10], 'E♭ major', [3, 5, 7, 8, 10, 0, 2], ['七个音完全相同，', '都是三个 flat；', '只是 tonic 从 C 换成 E♭。']],
  ];
  let o = '';
  rows.forEach(([na, a, nb, b, note], r) => {
    const y0 = 14 + r * 150, x0 = 150, ww = 34, wh = 100;
    const k = keyboard(x0, y0, ww, wh, 7);
    o += k.o;
    const nm = (arr) => arr.map((s) => NOTE[s]).join(' ');
    o += circle(8, y0 + 24, 6, 'solid') + text(20, y0 + 28, na, 'tb') + text(20, y0 + 44, nm(a), 'ts');
    o += circle(8, y0 + 66, 6, 'paper') + text(20, y0 + 70, nb, 'tb') + text(20, y0 + 86, nm(b), 'ts');
    for (const s of a) { const q = k.kx(s); o += circle(q.x, (q.black ? y0 + k.bh : y0 + wh) - 30, 6.5, 'solid'); }
    for (const s of b) { const q = k.kx(s); o += circle(q.x, (q.black ? y0 + k.bh : y0 + wh) - 12, 6.5, 'paper'); }
    WHITE_PC.forEach((pc, i) => (o += text(x0 + i * ww + ww / 2, y0 + wh + 16, NOTE[pc], 'ts', 'middle')));
    note.forEach((ln, i) => (o += text(400, y0 + 34 + i * 18, ln, i === 1 ? 'tl' : 'ts')));
  });
  o += text(0, 306, '实心点是前一个 key 的音，空心点是后一个 key 的音；只看 pitch class，不管哪个 octave。', 'ts');
  return svg(560, 312, o, '两组键盘：G major 与 D major 七个音里六个相同，只差 C 和 C sharp；C minor 与 E flat major 七个音完全相同');
}

// ---------- 第 5 站：Wright 的 sonata-allegro template ----------
function sonata() {
  const yb = 34, hb = 38, yI = 186, yV = 140;
  let o = '';
  const blk = (x0, x1, l1, l2, cls) => {
    let q = rect(x0, yb, x1 - x0 - 3, hb, cls, 3) + rect(x0, yb, x1 - x0 - 3, hb, 'frame', 3);
    const cx = (x0 + x1 - 3) / 2;
    q += l2 ? text(cx, yb + 16, l1, 'ts', 'middle') + text(cx, yb + 31, l2, 'ts', 'middle') : text(cx, yb + 24, l1, 'ts', 'middle');
    return q;
  };
  const head = (x0, x1, lab) => line(x0, 22, x1 - 3, 22, 'ink') + line(x0, 18, x0, 26, 'ink') + line(x1 - 3, 18, x1 - 3, 26, 'ink') + text((x0 + x1 - 3) / 2, 13, lab, 'tb', 'middle');
  o += head(36, 238, 'exposition') + head(244, 346, 'development') + head(350, 524, 'recapitulation');
  o += rect(0, yb, 32, hb, 'dash', 3) + text(16, yb + 24, 'intro', 'ts', 'middle');
  o += blk(36, 86, '1st', 'theme', 'wash-strong') + blk(86, 136, 'bridge', '', 'wash2') + blk(136, 186, '2nd', 'theme', 'wash') + blk(186, 234, 'closing', '', 'wash2');
  o += line(235, yb, 235, yb + hb, 'ink-b') + line(238.5, yb, 238.5, yb + hb, 'ink') + circle(231, yb + 13, 1.8, 'ink-f') + circle(231, yb + 25, 1.8, 'ink-f');
  o += text(236, yb + hb + 15, 'repeat', 'ts', 'middle');
  o += blk(244, 318, '', '', 'wash2') + blk(318, 346, 'retr.', '', 'wash2');
  o += blk(350, 394, '1st', 'theme', 'wash-strong') + blk(394, 438, 'bridge', '', 'wash2') + blk(438, 482, '2nd', 'theme', 'wash') + blk(482, 527, 'closing', '', 'wash2');
  o += rect(530, yb, 30, hb, 'dash', 3) + text(545, yb + 24, 'coda', 'ts', 'middle');
  // key 的轨迹
  o += line(36, yI, 560, yI, 'grid') + line(36, yV, 560, yV, 'grid');
  o += text(0, yI + 4, 'I', 'tb') + text(10, yI + 4, 'tonic', 'ts');
  o += text(0, yV - 2, 'V', 'tb') + text(14, yV - 2, 'dominant', 'ts') + text(0, yV + 13, '（minor：III）', 'ts');
  o += path(d([[36, yI], [86, yI], [136, yV], [235, yV]]), 'ln');
  o += rect(244, yV - 22, 71, yI - yV + 44, 'wash2', 4) + text(279, (yV + yI) / 2 + 4, '不停在换', 'ts', 'middle');
  o += path(d([[318, yV], [346, yV]]), 'ln') + path(d([[346, yV], [350, yI], [560, yI]]), 'ln');
  o += text(332, yV - 30, 'dominant', 'ts', 'middle') + text(332, yV - 16, 'preparation', 'ts', 'middle');
  o += text(279, yI + 38, 'tonal instability，', 'ts', 'middle') + text(279, yI + 53, '最 polyphonic', 'ts', 'middle');
  o += text(111, yI + 22, 'modulate，', 'ts', 'middle') + text(111, yI + 37, '不安定', 'ts', 'middle');
  o += text(416, yI + 22, 'bridge to nowhere：', 'ts', 'middle') + text(416, yI + 37, '不再 modulate', 'ts', 'middle');
  o += text(185, yV - 10, '在 V 和 I 之间来回', 'ts', 'middle');
  o += text(0, 262, '粗线是此刻在哪个 key：exposition 离开 tonic，development 没有固定的 key，', 'ts');
  o += text(0, 278, 'recapitulation 全部留在 tonic。虚线框的 intro 与 coda 可有可无。', 'ts');
  return svg(560, 284, o, 'Sonata-allegro form 的 template：exposition 由 1st theme、bridge、2nd theme、closing 组成并 repeat；development 的 key 不停在换，最后停在 dominant；recapitulation 全部在 tonic；intro 和 coda 可有可无');
}

// 137 个 bar；只 repeat exposition，共 192 个 bar；按 Wright 说的约 6 分钟，每个 bar 360 / 192 = 1.875 s
const EKN = { spb: 360 / 192 };
function ekn() {
  const pxs = 450 / 206.25, X0 = 96;
  const sxA = (t) => X0 + t * pxs, sxB = (t) => X0 + (t - 206.25) * pxs;
  const sp = EKN.spb, T1 = (b) => (b - 1) * sp, T2 = (b) => (55 + b - 1) * sp;
  const speed = 12, Tm = 360 / speed, T = Tm + 1.5;
  let o = '';
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
  const row = (y0, sx, bigs, subs, axis, keyPts, extra) => {
    for (const [a, b, lab, cls] of bigs) {
      o += rect(sx(a), y0, sx(b) - sx(a) - 2, 20, cls, 3) + text((sx(a) + sx(b)) / 2, y0 + 14, lab, 'ts', 'middle');
    }
    for (const [a, b, cls] of subs) o += rect(sx(a), y0 + 24, sx(b) - sx(a) - 2, 12, cls, 2);
    // key 轨迹
    const yG = y0 + 110, yD = y0 + 88;
    o += line(X0, yG, 546, yG, 'grid') + line(X0, yD, 546, yD, 'grid');
    o += text(0, yG + 4, 'G major', 't') + text(0, yD + 4, 'D major', 't');
    for (const seg of keyPts) o += path(d(seg.map(([t, k]) => [sx(t), k === 'G' ? yG : yD])), 'ln');
    // 时间轴
    const ya = y0 + 130;
    o += line(sx(axis[0]), ya, sx(axis[1]), ya, 'axis');
    for (let t = Math.ceil(axis[0] / 30) * 30; t <= axis[1] + 0.01; t += 30) o += line(sx(t), ya, sx(t), ya + 4, 'axis') + text(sx(t), ya + 16, fmt(t), 'ts', 'middle');
    o += extra(sx, y0, yG, yD);
  };
  // 第一行：exposition 两遍
  const subsExp = (off) => [[off + T1(1), off + T1(18), 'wash-strong'], [off + T1(18), off + T1(28), 'wash2'], [off + T1(28), off + T1(35), 'wash'], [off + T1(35), off + T1(56), 'solid2']];
  const ex1 = 55 * sp;
  row(14, sxA, [[0, ex1, 'exposition（bar 1–55）', 'wash'], [ex1, 2 * ex1, 'exposition repeat', 'wash2']], [...subsExp(0), ...subsExp(ex1)], [0, 206.25],
    [[[0, 'G'], [T1(18), 'G'], [T1(28), 'D'], [ex1, 'D']], [[ex1, 'G'], [ex1 + T1(18), 'G'], [ex1 + T1(28), 'D'], [2 * ex1, 'D']]],
    (sx, y0) => {
      const lab = (a, b, s, tier) => { const x = (sx(a) + sx(b)) / 2, y = y0 + 36; return line(x, y + 1, x, y + (tier ? 20 : 6), 'mute') + text(x, y + (tier ? 32 : 18), s, 'ts', 'middle'); };
      return lab(T1(1), T1(18), '1st theme', 0) + lab(T1(18), T1(28), 'transition', 1) + lab(T1(28), T1(35), '2nd theme', 0) + lab(T1(35), T1(56), 'closing', 1)
        + text(sxA(T1(21)) + 6, y0 + 126, 'C♯（bar 21）', 'ts');
    });
  // 第二行：development、recapitulation、coda
  const dv = T2(56), rc = T2(76), cd = T2(128), end = 360;
  row(196, sxB, [[dv, rc, 'development', 'wash2'], [rc, cd, 'recapitulation（76–127）', 'wash'], [cd, end, 'coda', 'wash-strong']],
    [[T2(56), T2(60), 'wash-strong'], [T2(60), T2(70), 'solid2'], [T2(70), T2(76), 'wash2'], [T2(76), T2(93), 'wash-strong'], [T2(93), T2(101), 'wash2'], [T2(101), T2(108), 'wash'], [T2(108), T2(128), 'solid2'], [T2(128), end, 'wash-strong']],
    [206.25, 360],
    [[[dv, 'D'], [T2(59), 'D']], [[T2(74), 'D'], [T2(76), 'D'], [T2(76), 'G'], [end, 'G']]],
    (sx, y0, yG, yD) => {
      let q = rect(sx(T2(59)), yD - 12, sx(T2(74)) - sx(T2(59)), yG - yD + 24, 'wash2', 3);
      q += text((sx(T2(59)) + sx(T2(74))) / 2, yG + 2, '不停在换', 'ts', 'middle');
      q += text(sx(T2(74)) + 2, yD - 6, 'V', 'tl');
      const lab = (a, b, s, tier, side) => {
        const x = (sx(a) + sx(b)) / 2, y = y0 + 36;
        return line(x, y + 1, x, y + (tier ? 20 : 6), 'mute') + text(side ? x - 4 : x, y + (tier ? 32 : 18), s, 'ts', side ? 'start' : 'middle');
      };
      q += lab(T2(56), T2(60), '56–59', 0) + lab(T2(60), T2(70), 'closing theme 60–69', 1) + lab(T2(70), T2(76), 'retransition 70–75', 0, 1);
      q += lab(T2(93), T2(101), 'transition 93–100，留在 G', 1, 1) + lab(T2(128), end, '128–137', 0);
      return q;
    });
  // 指针：第一行走完跳到第二行
  const pA = (x) => d([[x, 8], [x, 144]]), pB = (x) => d([[x, 190], [x, 326]]);
  const k1 = 206.25 / speed / T, k2 = Tm / T;
  o += apath([pA(sxA(0)), pA(sxA(206.25)), pB(sxB(206.25)), pB(sxB(360)), pB(sxB(360))], [0, k1, k1 + 0.0005, k2, 1], T, 'ln');
  o += text(0, 362, `横轴是时间（每个 bar ${sp} s，quarter note = 128），动图按 ${speed} 倍速走。`, 'ts');
  o += text(0, 378, '浅色块是 theme，灰块是 transition 或 retransition，深色块是 closing 和收尾。', 'ts');
  return svgA(560, 384, o, '动图：Eine kleine Nachtmusik 的 first movement 按约 6 分钟画在时间轴上。第一行是 exposition 和它的 repeat，key 从 G major 走到 D major；第二行是 development、recapitulation 和 coda，development 的 key 不停在换，最后停在 D，recapitulation 和 coda 都在 G major');
}

// ---------- 第 5 站：Beethoven Fifth Symphony 的 first movement development 的 196 到 248 bar（动图） ----------
function dev5() {
  const b0 = 194, b1 = 249, X0 = 118, u = 7.6, bx = (b) => X0 + (b - b0) * u, per = 0.5, N = b1 - b0, T = N * per + 1.2;
  const yW = 46, yS = 92;
  let o = text(0, yW + 4, 'winds', 'tb') + text(0, yW + 19, 'flute、oboe、clarinet', 'ts') + text(0, yS + 4, 'strings', 'tb');
  o += line(X0, yW, bx(b1), yW, 'grid') + line(X0, yS, bx(b1), yS, 'grid');
  const W = [], S = [], both = [];
  for (const b of [196, 197, 200, 201, 204, 205, 208, 209]) W.push(b);
  for (const b of [198, 199, 202, 203, 206, 207]) S.push(b);
  for (let b = 210; b <= 226; b += 2) S.push(b);
  for (let b = 211; b <= 227; b += 2) W.push(b);
  for (let b = 228; b <= 232; b++) both.push(b);
  for (const b of [233, 235, 237, 239]) W.push(b);
  for (const b of [234, 236, 238]) S.push(b);
  S.push(240);
  for (let b = 241; b <= 247; b++) both.push(b);
  const cell = (b, y, cls) => rect(bx(b) + 0.6, y - 9, u - 1.2, 18, cls, 1.5) + `<g>${rect(bx(b) - 1, y - 12, u + 2, 24, 'ln', 2)}${flash((b - b0) * per, per * 0.9, T)}</g>`;
  for (const b of W) o += cell(b, yW, 'solid');
  for (const b of S) o += cell(b, yS, 'solid2');
  for (const b of both) o += cell(b, yW, 'solid') + cell(b, yS, 'solid2');
  // 每多少 bar 一换
  const br = (a, b, s) => line(bx(a), 22, bx(b), 22, 'ink') + line(bx(a), 18, bx(a), 26, 'ink') + line(bx(b), 18, bx(b), 26, 'ink') + text((bx(a) + bx(b)) / 2, 13, s, 'ts', 'middle');
  o += br(196, 210, '每 2 bar 一换') + br(210, 228, '每 1 bar 一换') + br(233, 240, '又是每 1 bar');
  // 力度与事件
  const ev = [[210, 'dimin.'], [216, 'p'], [222, 'pp'], [228, 'ff'], [234, 'pp'], [241, 'ff']];
  for (const [b, s] of ev) if (s) o += text(bx(b) + 1, 124, s, 'tl');
  o += line(bx(248), 30, bx(248), 132, 'dash');
  for (const b of [196, 210, 228, 240]) o += text(bx(b), 146, String(b), 'ts', 'middle');
  o += text(bx(248) + 3, 146, '248 recap', 'tb', 'end');
  o += text(0, 146, 'bar', 'ts');
  o += text(0, 172, '228–232 与 241–247：四个音的 motive 在两排一起 ff 冲进来。', 'ts');
  o += text(0, 188, '233–239 的 chord 是 B D F A♭：三个 minor third 叠起来。', 'ts');
  const ph = (x) => d([[x, 28], [x, 108]]);
  o += apath([ph(bx(b0)), ph(bx(b1)), ph(bx(b1))], [0, (N * per) / T, 1], T, 'ln');
  return svgA(560, 196, o, '动图：Beethoven Fifth Symphony 的 first movement 第 194 到 249 bar。winds 和 strings 轮流奏 chord，先每 2 个 bar 一换，第 210 bar 起每 1 个 bar 一换，越来越弱；第 228 和 240 bar 四音 motive ff 冲进来，第 248 bar 开始 recapitulation');
}

// ---------- 第 5 站：Mozart 与 Beethoven 四个部分的比例 ----------
function proportion() {
  const X0 = 150, W = 400;
  const rows = [
    ['Mozart', 'Eine kleine Nachtmusik', [55, 20, 52, 10], [['G → D'], ['不停在换'], ['G'], ['G']], 44],
    ['Beethoven', 'Symphony No. 5', [124, 123, 126, 129], [['C minor →', 'E♭ major'], ['不停在换'], ['C minor；2nd theme', '在 C major'], ['C minor']], 160],
  ];
  const names = ['exposition', 'development', 'recapitulation', 'coda'];
  const cls = ['wash', 'wash2', 'wash', 'wash-strong'];
  let o = '';
  rows.forEach(([nm, sub, bars, ks, y]) => {
    const tot = bars.reduce((a, b) => a + b, 0);
    o += text(0, y + 12, nm, 'tb') + text(0, y + 28, sub, 'ts') + text(0, y + 44, `first movement，共 ${tot} bar`, 'ts');
    let x = X0;
    bars.forEach((b, i) => {
      const w = (W * b) / tot, cx = x + (w - 2) / 2;
      o += rect(x, y, w - 2, 26, cls[i], 3) + rect(x, y, w - 2, 26, 'frame', 3);
      const pct = Math.round((1000 * b) / tot) / 10;
      o += text(cx, y + 17, w > 40 ? `${b} bar` : String(b), 'ts', 'middle');
      o += text(cx, y - 6, w > 90 ? `${names[i]} ${pct}%` : `${pct}%`, 'ts', 'middle');
      ks[i].forEach((ln, k) => (o += text(cx, y + 44 + k * 15, ln, 'ts', 'middle')));
      x += w;
    });
  });
  o += text(0, 248, 'Mozart 的 development 只占 14.6%，coda 只有 10 个 bar；', 'ts');
  o += text(0, 264, 'Beethoven 四部分各占约四分之一。Mozart 一行窄的两段是 development 和 coda。', 'ts');
  return svg(560, 270, o, 'Mozart 的 Eine kleine Nachtmusik 的 first movement 55、20、52、10 个 bar，Beethoven Fifth Symphony 的 first movement 124、123、126、129 个 bar，以及各部分的 key');
}

// ---------- 第 8 站：同一组五声的四个出处 ----------
function pent() {
  const NOTE = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  const sets = [
    ['只弹黑键', 'Voiles、Hollywood', [6, 8, 10, 1, 3]],
    ['gong mode', '三分损益，gong = C', [0, 2, 4, 7, 9]],
    ['两个 min’yō tetrachord', 'E G A + B D E', [4, 7, 9, 11, 2]],
    ['Raga Bhupali', 'Sa = C', [0, 2, 4, 7, 9]],
  ];
  const r = 40;
  let o = '';
  sets.forEach(([nm, sub, pcs], j) => {
    const cx = 70 + j * 140, cy = 112;
    const P = (pc, rr) => [cx + rr * Math.sin((pc * 30) * R), cy - rr * Math.cos((pc * 30) * R)];
    o += text(cx, 16, nm, 'tb', 'middle') + text(cx, 32, sub, 'ts', 'middle');
    o += circle(cx, cy, r, 'grid');
    for (let k = 0; k < 12; k++) { const [x, y] = P(k, r); o += circle(x, y, 1.8, 'mute-f'); }
    const sorted = [...pcs].sort((a, b) => a - b);
    o += path(d(sorted.map((pc) => P(pc, r))) + 'Z', 'ln');
    for (const pc of pcs) {
      const [x, y] = P(pc, r), [lx, ly] = P(pc, r + 15);
      o += circle(x, y, 4.5, pc === pcs[0] ? 'solid' : 'ink-f') + text(lx, ly + 4, NOTE[pc], pc === pcs[0] ? 'tl' : 'ts', 'middle');
    }
    const steps = pcs.map((pc, i) => (((pcs[(i + 1) % 5] - pc) % 12) + 12) % 12);
    o += text(cx, cy + r + 34, 'step：' + steps.join(' '), 'ts', 'middle');
  });
  o += text(0, 222, '每个圆是一个 octave 的 12 个 pitch class，C 在最上面；主题色的点是起音。', 'ts');
  o += text(0, 238, '四个五边形是同一个形状，只是转了一个角度。按最近的 piano key 画；', 'ts');
  o += text(0, 254, 'gong mode 实际的 interval 是 204 与 294 cents（第 3 站）。', 'ts');
  return svg(560, 262, o, '四个 pitch class 圆：piano 黑键的五声、三分损益的 gong mode、两个 min’yō tetrachord 拼出的 E G A B D、Raga Bhupali，四个五边形形状相同，step 都是 2 和 3 个 half step 的同一种排列');
}

export default {
  'gec1014-string': string,
  'gec1014-timbre': timbre,
  'gec1014-meter': meter,
  'gec1014-sanfen': sanfen,
  'gec1014-scales': scales,
  'gec1014-texture': texture,
  'gec1014-form': form,
  'gec1014-ladrang': ladrang,
  'gec1014-irama': irama,
  'gec1014-raga': raga,
  'gec1014-tintal': tintal,
  'gec1014-tihai': tihai,
  'gec1014-partials': partials,
  'gec1014-hemiola': hemiola,
  'gec1014-fugue': fugue,
  'gec1014-deshkar': deshkar,
  'gec1014-triads': triads,
  'gec1014-keys': keys,
  'gec1014-sonata': sonata,
  'gec1014-ekn': ekn,
  'gec1014-dev5': dev5,
  'gec1014-proportion': proportion,
  'gec1014-pent': pent,
};
