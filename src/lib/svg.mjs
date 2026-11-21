// 画图解用的小工具。所有颜色都走 CSS 变量（见 style.css 的 .fig-svg），
// 这样浅色/深色主题和每门课的线路色都能自动跟上。

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const f1 = (v) => (Math.round(v * 10) / 10).toString();

export function svg(w, h, body, label) {
  return `<svg class="fig-svg" viewBox="-4 -6 ${w + 8} ${h + 12}" role="img" aria-label="${esc(label)}">${body}</svg>`;
}
export const lin = (d0, d1, r0, r1) => (v) => r0 + ((v - d0) * (r1 - r0)) / (d1 - d0);
export const logx = (d0, d1, r0, r1) => (v) => r0 + ((Math.log10(v) - Math.log10(d0)) * (r1 - r0)) / (Math.log10(d1) - Math.log10(d0));

export const d = (pts) => pts.map(([x, y], i) => (i ? 'L' : 'M') + f1(x) + ' ' + f1(y)).join('');
export const path = (dd, cls) => `<path d="${dd}" class="${cls}"/>`;
export const line = (x1, y1, x2, y2, cls = 'ink') => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" class="${cls}"/>`;
export const rect = (x, y, w, h, cls, rx = 0) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${rx}" class="${cls}"/>`;
export const circle = (x, y, r, cls) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" class="${cls}"/>`;
export const poly = (pts, cls) => `<polygon points="${pts.map(([x, y]) => f1(x) + ',' + f1(y)).join(' ')}" class="${cls}"/>`;
export const text = (x, y, s, cls = 't', anchor = 'start') => `<text x="${f1(x)}" y="${f1(y)}" class="${cls}" text-anchor="${anchor}">${s}</text>`;
export const it = (s) => `<tspan class="i">${s}</tspan>`;
export const sub = (s) => `<tspan class="sub" dy="3">${s}</tspan><tspan dy="-3">​</tspan>`;

// 带箭头的线段
export function arrow(x1, y1, x2, y2, cls = 'ink', size = 7) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p = (ang) => [x2 - size * Math.cos(a + ang), y2 - size * Math.sin(a + ang)];
  const fillCls = cls.split(' ').map((c) => c + '-f').join(' ');
  return line(x1, y1, x2 - 2 * Math.cos(a), y2 - 2 * Math.sin(a), cls) + poly([[x2, y2], p(0.42), p(-0.42)], fillCls);
}

// 函数曲线 → path d
export function curve(fn, x0, x1, sx, sy, n = 240) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    const y = fn(x);
    if (Number.isFinite(y)) pts.push([sx(x), sy(y)]);
  }
  return d(pts);
}
// 曲线下面积
export function area(fn, x0, x1, sx, sy, base = 0, n = 160) {
  const pts = [[sx(x0), sy(base)]];
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    pts.push([sx(x), sy(fn(x))]);
  }
  pts.push([sx(x1), sy(base)]);
  return d(pts) + 'Z';
}

// 坐标轴：xt / yt 是刻度数组（数或 [值, 标签]）
export function axes({ sx, sy, x0, x1, y0, y1, xt = [], yt = [], xl = '', yl = '', xAt = null, yAt = null, grid = false }) {
  const ay = sy(xAt ?? y0), ax = sx(yAt ?? x0);
  let o = '';
  const lab = (t) => (Array.isArray(t) ? t : [t, String(t)]);
  for (const t of xt) {
    const [v, s] = lab(t);
    if (grid) o += line(sx(v), sy(y0), sx(v), sy(y1), 'grid');
    o += line(sx(v), ay, sx(v), ay + 4, 'axis') + text(sx(v), ay + 17, s, 'ts', 'middle');
  }
  for (const t of yt) {
    const [v, s] = lab(t);
    if (grid) o += line(sx(x0), sy(v), sx(x1), sy(v), 'grid');
    o += line(ax - 4, sy(v), ax, sy(v), 'axis') + text(ax - 7, sy(v) + 4, s, 'ts', 'end');
  }
  o += line(sx(x0), ay, sx(x1), ay, 'axis') + line(ax, sy(y0), ax, sy(y1), 'axis');
  if (xl) o += text(sx(x1), ay + 32, xl, 'ts', 'end');
  if (yl) o += text(ax - 4, sy(y1) - 8, yl, 'ts', 'start');
  return o;
}

// ---------- 动图（SMIL）：一组 keyframe 值，循环播放 ----------
// svgA 和 svg 一样，只是多一个 class，app.js 用它做“点一下暂停”和 reduced-motion。
export function svgA(w, h, body, label) {
  return `<svg class="fig-svg fig-anim" viewBox="-4 -6 ${w + 8} ${h + 12}" role="img" aria-label="${esc(label)}">${body}</svg>`;
}
// anim(attr, values, kt, dur, discrete)：values 和 kt（0..1 的 keyTimes）一一对应
export const anim = (attr, values, kt, dur, discrete = false) =>
  `<animate attributeName="${attr}" values="${values.join(';')}" keyTimes="${kt.map((t) => (Math.round(t * 1e5) / 1e5).toString()).join(';')}" dur="${dur}s" repeatCount="indefinite" calcMode="${discrete ? 'discrete' : 'linear'}"/>`;
export const animRot = (angles, cx, cy, kt, dur) =>
  `<animateTransform attributeName="transform" type="rotate" values="${angles.map((a) => f1(a) + ' ' + f1(cx) + ' ' + f1(cy)).join(';')}" keyTimes="${kt.map((t) => (Math.round(t * 1e5) / 1e5).toString()).join(';')}" dur="${dur}s" repeatCount="indefinite"/>`;
// 带动画的 path / circle / text：第一个值就是静态时（截图、reduced-motion）显示的样子
export const apath = (ds, kt, dur, cls, discrete = false) => `<path d="${ds[0]}" class="${cls}">${anim('d', ds, kt, dur, discrete)}</path>`;
export const acircle = (xs, ys, kt, dur, r, cls) => `<circle cx="${f1(xs[0])}" cy="${f1(ys[0])}" r="${r}" class="${cls}">${anim('cx', xs.map(f1), kt, dur)}${anim('cy', ys.map(f1), kt, dur)}</circle>`;
export const ashow = (on, kt, dur) => anim('opacity', on.map((v) => (v ? 1 : 0)), kt, dur, true);
