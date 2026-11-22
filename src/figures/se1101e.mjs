import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, anim, apath, acircle, ashow, f1 } from '../lib/svg.mjs';

// ---------- 自己画的示意海岸线（lon, lat），只求轮廓可认，不是测绘数据 ----------
const MAINLAND = [[60, 40], [60, 25.3], [66.5, 25.4], [67.0, 24.8], [67.4, 23.9], [68.4, 23.5], [68.8, 22.8], [69.2, 22.3], [70.3, 21.0], [71.0, 20.75], [72.1, 21.3], [72.6, 22.0], [72.85, 21.0], [72.85, 19.9], [72.8, 18.9], [73.1, 17.6], [73.4, 16.4], [73.8, 15.4], [74.3, 14.3], [74.8, 12.9], [75.4, 11.8], [75.85, 11.0], [76.2, 10.0], [76.6, 8.9], [77.55, 8.1], [78.2, 8.85], [79.0, 9.3], [79.3, 10.3], [79.85, 10.8], [79.85, 12.0], [80.3, 13.3], [80.1, 14.6], [80.1, 15.5], [80.9, 15.9], [81.4, 16.4], [82.3, 16.6], [82.9, 17.4], [83.6, 18.2], [84.7, 19.2], [85.8, 19.85], [86.9, 20.6], [87.0, 21.5], [88.1, 21.6], [89.0, 21.7], [90.3, 22.0], [91.0, 22.6], [91.85, 22.3], [92.2, 21.3], [92.3, 20.7], [93.0, 20.0], [93.7, 19.3], [94.2, 18.2], [94.5, 17.2], [94.3, 16.0], [94.9, 15.8], [95.4, 15.8], [96.3, 16.5], [97.0, 17.0], [97.6, 16.5], [97.6, 15.4], [97.8, 14.6], [98.2, 13.4], [98.6, 12.4], [98.5, 11.5], [98.6, 10.0], [98.3, 9.0], [98.3, 8.0], [98.8, 8.1], [99.3, 7.3], [99.8, 6.5], [100.3, 5.6], [100.35, 5.0], [100.7, 4.2], [101.3, 2.9], [102.0, 2.4], [102.6, 1.9], [103.4, 1.45], [104.25, 1.4], [104.1, 2.0], [103.5, 2.8], [103.4, 3.8], [103.4, 4.3], [103.15, 5.3], [102.6, 5.9], [102.2, 6.2], [101.6, 6.8], [101.0, 6.9], [100.4, 7.4], [100.25, 8.3], [99.9, 9.2], [99.2, 9.3], [99.2, 10.3], [99.5, 11.0], [99.7, 11.8], [99.9, 12.6], [100.0, 13.4], [100.5, 13.5], [100.9, 13.2], [100.95, 12.7], [101.4, 12.65], [102.1, 12.2], [102.7, 11.6], [103.1, 10.9], [103.6, 10.5], [104.4, 10.4], [104.8, 9.3], [104.8, 8.6], [105.2, 8.7], [106.2, 9.3], [106.7, 9.9], [106.9, 10.4], [107.5, 10.5], [108.2, 10.9], [109.0, 11.4], [109.2, 12.2], [109.3, 13.0], [109.1, 14.2], [108.8, 15.2], [108.3, 15.9], [107.7, 16.4], [107.1, 17.0], [106.5, 17.8], [105.8, 18.6], [105.7, 19.2], [106.3, 20.0], [106.8, 20.7], [107.7, 21.3], [108.5, 21.6], [109.2, 21.5], [109.7, 21.5], [109.9, 20.4], [110.4, 20.3], [110.6, 21.2], [111.6, 21.6], [112.8, 21.9], [113.6, 22.2], [114.3, 22.4], [115.5, 22.8], [116.6, 23.2], [117.6, 23.9], [118.5, 24.6], [119.3, 25.4], [119.7, 26.3], [120.3, 27.2], [121.0, 28.2], [121.9, 29.8], [122, 40]];
const ISLANDS = {
  hainan: [[108.65, 19.2], [109.1, 18.45], [109.6, 18.2], [110.5, 18.7], [111.0, 19.6], [110.6, 20.1], [109.6, 20.0], [108.7, 19.7]],
  taiwan: [[120.1, 23.0], [120.7, 22.0], [120.9, 22.3], [121.4, 23.0], [121.9, 24.6], [121.6, 25.3], [121.0, 25.0], [120.2, 23.7]],
  srilanka: [[79.85, 9.6], [80.4, 9.6], [81.2, 8.5], [81.85, 7.2], [81.6, 6.4], [80.6, 5.95], [80.0, 6.3], [79.7, 7.8]],
  sumatra: [[95.2, 5.6], [95.9, 5.55], [97.5, 5.2], [98.3, 4.2], [99.6, 3.2], [100.6, 2.15], [101.45, 1.7], [102.4, 1.05], [103.4, -0.3], [103.9, -1.0], [104.5, -1.8], [105.0, -2.1], [105.8, -2.8], [106.05, -3.3], [105.85, -4.2], [105.85, -5.8], [105.2, -5.8], [104.5, -5.85], [103.7, -4.9], [102.3, -3.8], [101.3, -2.7], [100.35, -0.95], [99.6, 0.2], [98.8, 1.75], [97.6, 2.85], [96.9, 3.6], [96.1, 4.1], [95.4, 4.9]],
  bangka: [[105.15, -1.6], [105.9, -1.55], [106.75, -2.9], [106.0, -3.05], [105.6, -2.4]],
  bintan: [[104.25, 1.2], [104.65, 1.2], [104.6, 0.85], [104.25, 0.9]],
  singapore: [[103.62, 1.33], [103.68, 1.44], [103.9, 1.45], [104.05, 1.38], [103.85, 1.27]],
  java: [[105.2, -6.8], [105.9, -6.0], [106.7, -6.05], [107.6, -6.2], [108.3, -6.25], [108.7, -6.8], [109.7, -6.85], [110.4, -6.95], [110.9, -6.4], [111.6, -6.6], [112.6, -6.9], [112.9, -7.6], [113.8, -7.65], [114.4, -7.75], [114.5, -8.7], [113.3, -8.3], [112.0, -8.3], [110.5, -8.1], [109.0, -7.7], [108.0, -7.75], [106.5, -7.4], [105.5, -6.85]],
  madura: [[112.7, -7.05], [114.1, -6.9], [113.9, -7.2], [112.8, -7.2]],
  bali: [[114.6, -8.1], [115.1, -8.05], [115.7, -8.4], [115.2, -8.8], [114.75, -8.4]],
  lombok: [[116.0, -8.35], [116.6, -8.25], [116.75, -8.75], [116.1, -8.9]],
  sumbawa: [[116.8, -8.5], [117.6, -8.1], [118.3, -8.3], [119.0, -8.25], [119.1, -8.7], [118.0, -8.8], [117.0, -9.0]],
  flores: [[119.8, -8.4], [121.0, -8.4], [122.3, -8.1], [123.0, -8.3], [122.8, -8.7], [121.0, -8.9], [119.9, -8.8]],
  sumba: [[119.0, -9.5], [120.0, -9.4], [120.8, -10.1], [119.6, -9.95]],
  timor: [[123.5, -10.3], [124.4, -9.4], [125.2, -8.6], [127.0, -8.3], [126.8, -8.6], [125.0, -9.5], [123.8, -10.4]],
  borneo: [[108.95, 1.6], [109.6, 2.05], [110.4, 1.7], [111.1, 1.8], [111.4, 2.6], [113.0, 3.2], [114.0, 4.6], [114.6, 4.9], [115.3, 5.0], [116.0, 6.0], [116.8, 7.0], [117.3, 6.6], [117.8, 6.0], [118.2, 5.8], [119.2, 5.3], [118.3, 4.4], [117.7, 4.1], [117.9, 3.0], [118.0, 2.1], [118.9, 1.0], [117.9, 0.8], [117.4, 0.0], [117.0, -0.8], [116.6, -1.5], [116.5, -2.6], [116.0, -3.6], [114.6, -4.0], [113.9, -3.4], [113.0, -3.2], [111.7, -3.0], [111.4, -3.5], [110.2, -2.9], [110.1, -1.7], [109.4, -1.0], [109.0, 0.0], [108.9, 0.9]],
  belitung: [[107.6, -2.6], [108.2, -2.6], [108.3, -3.1], [107.7, -3.2]],
  sulawesi: [[119.45, -5.55], [119.4, -4.2], [119.6, -3.5], [118.8, -2.7], [119.3, -1.2], [119.8, 0.0], [120.1, 0.75], [120.9, 1.3], [122.5, 1.0], [123.8, 0.9], [124.8, 1.4], [125.2, 1.6], [124.6, 0.5], [123.4, 0.35], [121.9, 0.45], [120.6, 0.5], [120.3, -0.3], [120.7, -0.95], [121.6, -0.85], [122.6, -0.75], [123.4, -0.95], [122.5, -1.5], [121.4, -1.9], [121.9, -2.6], [122.4, -3.3], [122.9, -4.4], [122.5, -4.8], [121.6, -4.5], [121.2, -3.5], [120.95, -2.8], [120.4, -2.95], [120.4, -4.0], [120.4, -5.5], [119.9, -5.6]],
  halmahera: [[127.6, 2.1], [128.0, 1.5], [128.6, 1.6], [128.0, 1.0], [128.7, 0.35], [128.1, 0.2], [128.3, -0.6], [127.7, -0.5], [127.9, 0.4], [127.4, 1.0]],
  seram: [[128.0, -3.1], [129.5, -2.8], [130.8, -3.4], [130.0, -3.6], [128.4, -3.6]],
  buru: [[125.9, -3.1], [126.7, -3.1], [127.2, -3.6], [126.2, -3.7]],
  newguinea: [[130.9, -1.4], [131.5, -0.8], [132.4, -0.35], [133.5, -0.7], [134.1, -1.0], [134.0, -2.5], [135.5, -3.3], [137, -1.5], [141, -2.6], [141, -9], [138.0, -8.4], [137.6, -5.5], [134.5, -4.0], [133.6, -3.9], [132.8, -4.0], [132.0, -2.9], [133.0, -2.4], [132.1, -2.2], [131.3, -1.5]],
  luzon: [[120.6, 18.5], [121.2, 18.6], [122.2, 18.5], [122.3, 17.2], [122.1, 16.3], [121.6, 15.9], [121.5, 15.2], [121.7, 14.3], [122.2, 13.9], [122.8, 14.2], [123.3, 13.8], [123.9, 13.2], [124.2, 12.6], [123.6, 12.7], [123.0, 13.0], [122.5, 13.4], [122.0, 13.8], [121.2, 13.6], [120.6, 14.2], [120.6, 14.6], [120.2, 14.8], [120.0, 15.4], [119.8, 16.3], [120.3, 16.6], [120.4, 17.5]],
  mindoro: [[120.3, 13.5], [121.2, 13.4], [121.5, 12.6], [121.1, 12.2], [120.6, 12.6]],
  samar: [[124.3, 12.55], [125.3, 12.3], [125.7, 11.1], [125.2, 10.4], [125.0, 10.0], [124.5, 10.3], [124.4, 11.4]],
  panay: [[121.9, 11.9], [122.6, 11.6], [123.1, 11.2], [122.6, 10.6], [122.0, 10.5], [121.9, 11.2]],
  negros: [[122.9, 10.9], [123.5, 10.7], [123.3, 9.3], [122.9, 9.1], [122.4, 9.9], [122.9, 10.4]],
  cebu: [[123.8, 11.2], [124.1, 10.8], [123.5, 9.6], [123.4, 10.3]],
  palawan: [[117.2, 8.35], [117.9, 8.7], [118.7, 9.6], [119.5, 10.5], [119.7, 11.3], [119.3, 10.9], [118.5, 10.1], [117.6, 9.0]],
  mindanao: [[121.9, 7.0], [122.2, 7.8], [123.0, 8.1], [123.6, 8.6], [124.2, 8.5], [124.8, 9.0], [125.4, 9.8], [125.6, 9.2], [126.2, 8.5], [126.6, 7.3], [126.1, 6.4], [125.6, 6.9], [125.4, 5.6], [124.6, 6.0], [124.0, 6.6], [124.2, 7.2], [123.6, 7.8], [123.0, 7.5], [122.1, 6.9]],
  jolo: [[120.8, 6.1], [121.3, 6.1], [121.2, 5.9], [120.85, 5.92]],
};
const ALL_LAND = [MAINLAND, ...Object.values(ISLANDS)];

// equirectangular 投影：返回 P(lon, lat) → [x, y]
function proj(lon0, lon1, lat0, lat1, x0, y0, s) {
  const P = ([lo, la]) => [x0 + (lo - lon0) * s, y0 + (lat1 - la) * s];
  P.w = (lon1 - lon0) * s; P.h = (lat1 - lat0) * s; P.x0 = x0; P.y0 = y0; P.s = s;
  return P;
}
// Sutherland–Hodgman：把投影后的多边形裁到map矩形内
function clipRect(pts, x0, y0, x1, y1) {
  const edges = [[(p) => p[0] >= x0, (a, b) => [x0, a[1] + ((b[1] - a[1]) * (x0 - a[0])) / (b[0] - a[0])]],
    [(p) => p[0] <= x1, (a, b) => [x1, a[1] + ((b[1] - a[1]) * (x1 - a[0])) / (b[0] - a[0])]],
    [(p) => p[1] >= y0, (a, b) => [a[0] + ((b[0] - a[0]) * (y0 - a[1])) / (b[1] - a[1]), y0]],
    [(p) => p[1] <= y1, (a, b) => [a[0] + ((b[0] - a[0]) * (y1 - a[1])) / (b[1] - a[1]), y1]]];
  let out = pts;
  for (const [inside, cut] of edges) {
    const inp = out; out = [];
    for (let i = 0; i < inp.length; i++) {
      const a = inp[(i + inp.length - 1) % inp.length], b = inp[i];
      if (inside(b)) { if (!inside(a)) out.push(cut(a, b)); out.push(b); } else if (inside(a)) out.push(cut(a, b));
    }
    if (!out.length) break;
  }
  return out;
}
const polyD = (pts, P) => { const c = clipRect(pts.map(P), P.x0, P.y0, P.x0 + P.w, P.y0 + P.h); return c.length > 2 ? d(c) + 'Z' : ''; };
const landD = (P) => ALL_LAND.map((p) => polyD(p, P)).join('');
function mapBase(P, id, landCls = 'faint-f') {
  const clip = `<clipPath id="${id}"><rect x="${f1(P.x0)}" y="${f1(P.y0)}" width="${f1(P.w)}" height="${f1(P.h)}"/></clipPath>`;
  return { clip, open: `<g clip-path="url(#${id})">`, land: path(landD(P), landCls) + path(landD(P), 'mute'), frame: rect(P.x0, P.y0, P.w, P.h, 'frame') };
}
const PORT = {
  Malacca: [102.25, 2.2], Singapore: [103.85, 1.3], Palembang: [104.75, -2.98], Jambi: [103.6, -1.6], Aceh: [95.3, 5.55],
  Banten: [106.15, -6.0], Batavia: [106.8, -6.2], Makassar: [119.4, -5.1], Ternate: [127.4, 0.8], Banda: [129.9, -4.5],
  Manila: [120.98, 14.6], Ayutthaya: [100.57, 14.35], Pegu: [96.48, 17.33], Angkor: [103.87, 13.41], OcEo: [105.15, 10.25],
  Guangzhou: [113.26, 23.13], Penang: [100.33, 5.41], Bangkok: [100.5, 13.75], Hue: [107.58, 16.46], Udong: [104.74, 11.82],
  Nagapattinam: [79.84, 10.77], Kra: [99.0, 10.3], Brunei: [114.94, 4.9], Jolo: [121.0, 6.05],
};
const R = Math.PI / 180;
const km = (a, b) => {
  const [l1, p1] = a, [l2, p2] = b, dp = (p2 - p1) * R, dl = (l2 - l1) * R;
  const h = Math.sin(dp / 2) ** 2 + Math.cos(p1 * R) * Math.cos(p2 * R) * Math.sin(dl / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};
// 一组 [t_on, t_off]（0..1）窗口 → discrete opacity
function showWin(wins, dur) {
  const kt = [0], v = [0];
  for (const [a, b] of wins) { if (a <= 0) v[0] = 1; else { kt.push(a); v.push(1); } if (b < 1) { kt.push(b); v.push(0); } }
  return anim('opacity', v, kt, dur, true);
}
const lab = (x, y, s, cls = 't', anchor = 'start', extra = '') => `<text x="${f1(x)}" y="${f1(y)}" class="${cls}" text-anchor="${anchor}"${extra}>${s}</text>`;

// ---------- 开头：三个谜题在map上 ----------
const L1824 = [[97.0, 6.0], [99.5, 5.4], [100.1, 3.6], [100.9, 2.75], [101.8, 2.0], [102.6, 1.5], [103.3, 1.24], [104.5, 1.24], [105.3, 1.6]];
function puzzles() {
  const P = proj(92, 132, -12, 23, 10, 10, 13.5);
  const m = mapBase(P, 'se1101e-cp');
  let o = m.clip + m.open + m.land + path(d(L1824.map(P)), 'ln-dash') + '</g>' + m.frame;
  const at = (lo, la) => P([lo, la]);
  const T = (lo, la, s, cls = 'ts', a = 'start') => { const [x, y] = at(lo, la); return lab(x, y, s, cls, a); };
  const lines = (x, y, arr) => arr.map(([s, cls], i) => lab(x, y + i * 15, s, cls, 'start')).join('');
  // ① Bali：下方海面
  const B = at(115.15, -8.4);
  o += circle(B[0], B[1], 6, 'ln') + line(B[0], B[1] + 6, B[0], 450, 'mute');
  o += lab(B[0] - 28, 462, '① Bali：majority Hindu', 'tb', 'middle') + lab(B[0] - 28, 477, '西边 Java、东边 Lombok 都是 majority Muslim', 'ts', 'middle');
  // ② Luzon、Visayas：Luzon 北边；Sulu：Celebes Sea
  o += lines(at(120.3, 0)[0], at(0, 21.0)[1], [['② Luzon、Visayas：', 'tb'], ['majority Catholic', 'ts']]);
  o += line(at(121.4, 0)[0], at(0, 19.9)[1], at(121.4, 0)[0], at(0, 18.75)[1], 'mute');
  const Su = at(121.0, 6.05), Mi = at(123.0, 7.5);
  o += circle(Su[0], Su[1], 3.5, 'ln-f') + circle(Mi[0], Mi[1], 3.5, 'ln-f');
  o += lines(at(119.5, 0)[0], at(0, 3.4)[1], [['Sulu、west Mindanao：', 'tb'], ['Muslim', 'ts']]);
  o += line(Su[0], Su[1] + 4, Su[0], at(0, 4.2)[1], 'mute');
  // ③ Malacca：Andaman Sea，折线穿过 Strait 指到 Malacca
  const Ma = at(102.25, 2.2);
  o += circle(Ma[0], Ma[1], 3.5, 'ln-f');
  o += lines(at(92.3, 0)[0], at(0, 14.4)[1], [['③ Malacca', 'tb'], ['1400 年前后还是', 'ts'], ['fishing village，', 'ts'], ['15 世纪末超过', 'ts'], ['100,000 人', 'ts']]);
  o += path(d([at(94.6, 8.6), at(99.6, 4.4), at(100.4, 2.8), at(101.95, 2.2)]), 'mute');
  // ④ Singapore Strait：South China Sea，斜线指过去
  const Sg = at(104.1, 1.2);
  o += lines(at(110.4, 0)[0], at(0, 16.5)[1], [['④ 1824 年以前', 'tb'], ['两岸同属一个', 'ts'], ['sultanate；今天', 'ts'], ['北岸是 Malaysia、', 'ts'], ['Singapore，南岸的', 'ts'], ['Riau 属 Indonesia', 'ts']]);
  o += line(at(111.2, 8.9)[0], at(111.2, 8.9)[1], Sg[0] + 5, Sg[1] - 4, 'mute') + circle(Sg[0], Sg[1], 6, 'ln');
  o += T(99.3, 20.0, 'mainland', 'ts', 'middle') + T(113.0, 0.8, 'Borneo', 'ts', 'middle') + T(103.2, -2.4, 'Sumatra', 'ts', 'middle') + T(110.0, -7.85, 'Java', 'ts', 'middle');
  return svg(560, 484, o, '示意 map：Southeast Asia 上标出四处，Bali 是 majority Hindu，Luzon 与 Visayas 是 majority Catholic 而 Sulu 与 west Mindanao 是 Muslim，Malacca 从 fishing village 变成大港，Singapore Strait 两岸在 1824 年被一条分界分开');
}

// ---------- 第 1 站：monsoon 一年里的风向 ----------
function monsoonA() {
  const P = proj(66, 126, -12, 26, 10, 34, 9);
  const m = mapBase(P, 'se1101e-cm');
  let o = m.clip + m.open + m.land + '</g>' + m.frame;
  const pts = [[68, 12.5], [68, 17], [71, 5.5], [86, 15], [89, 9], [93.5, 12], [84, 3], [112, 17.5], [116.5, 16], [110, 8], [109, 3.5], [116, -5.4], [79, -5], [90, -6], [100, -8.5], [97, -2.5], [123.5, -5.5], [86, -10], [72, -9]];
  const L = 11;
  const arrowAt = (lo, la, ang) => { const [x, y] = P([lo, la]); const dx = Math.cos(ang * R) * L, dy = Math.sin(ang * R) * L; return arrow(x - dx, y - dy, x + dx, y + dy, 'ink', 6); };
  // 屏幕坐标：x 向右、y 向下；角度是风吹去的方向
  const jan = (la) => (la > 1.5 ? 135 : la < -1.5 ? 45 : 90);
  const jul = (la) => (la > 1.5 ? -45 : la < -1.5 ? -135 : -90);
  const T = 12, kt = []; for (let i = 0; i <= 12; i++) kt.push(i / 12);
  //            J  F  M  A    M    J  J  A  S  O    N    D  J
  const neOp = [1, 1, 1, 0.3, 0, 0, 0, 0, 0, 0, 0.35, 1, 1];
  const swOp = [0, 0, 0, 0, 0.45, 1, 1, 1, 1, 0.3, 0, 0, 0];
  o += `<g opacity="1">${pts.map(([lo, la]) => arrowAt(lo, la, jan(la))).join('')}${anim('opacity', neOp, kt, T)}</g>`;
  o += `<g opacity="0">${pts.map(([lo, la]) => arrowAt(lo, la, jul(la))).join('')}${anim('opacity', swOp, kt, T)}</g>`;
  const names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const what = (i) => ([11, 0, 1, 2].includes(i) ? 'Northeast Monsoon：equator 以北吹 NE 风，以南转成 NW 风' : [5, 6, 7, 8].includes(i) ? 'Southwest Monsoon：equator 以北吹 SW 风，以南是 SE trades' : 'Inter-monsoon：风弱、方向不定');
  for (let i = 0; i < 12; i++) {
    const on = []; for (let k = 0; k <= 12; k++) on.push(k === i || (i === 0 && k === 12));
    o += lab(10, 20, names[i] + '　' + what(i), i === 0 ? 'tb' : 'tb', 'start', i ? ' opacity="0"' : '').replace('</text>', ashow(on, kt, T) + '</text>');
  }
  // 地名
  const nm = (lo, la, s, a = 'middle') => { const [x, y] = P([lo, la]); return lab(x, y, s, 'ts', a); };
  o += nm(67.3, 9.0, 'Arabian Sea', 'start') + nm(89, 18.6, 'Bay of Bengal') + nm(114.0, 12.4, 'South China Sea') + nm(110.5, -5.0, 'Java Sea') + nm(81, -1.5, 'Indian Ocean');
  o += line(P([66, 0])[0], P([66, 0])[1], P([126, 0])[0], P([126, 0])[1], 'grid') + nm(66.4, 0.6, 'equator', 'start');
  o += lab(280, 402, '箭头是风吹去的方向。Sailing ship 顺风走：每个方向的航段，一年里只有一个季节能走。', 'ts', 'middle');
  return svgA(560, 410, o, '动图：一年十二个月里 Indian Ocean 到 South China Sea 的风向，12 到 3 月 equator 以北吹东北风，6 到 9 月吹西南风，中间是风弱的 inter-monsoon');
}

// ---------- 第 1 站：两段航程的 space-time 图 ----------
// 规则（示意 model）：东行、北行的航段只能在 5–8 月出发（SW monsoon），
// 西行、南行的航段只能在 12–3 月出发（NE monsoon）；每段一个月。
const SW = (m) => [4, 5, 6, 7].includes(((m % 12) + 12) % 12);
const NE = (m) => [11, 0, 1, 2].includes(((m % 12) + 12) % 12);
function sail(start, legs, holdUntil = {}) {
  // legs: [[from, to, 'E'|'W']]；返回 [[month, place]] 的折线
  let t = start; const pts = [[t, legs[0][0]]];
  legs.forEach(([a, b, dir], i) => {
    let w = Math.max(t, holdUntil[i] ?? t);
    while (!(dir === 'E' ? SW(w) : NE(w))) w++;
    if (w > t) pts.push([w, a]);
    t = w + 1; pts.push([t, b]);
  });
  return pts;
}
export function voyageModel() {
  const through = (s) => sail(s, [[0, 1, 'E'], [1, 2, 'E'], [2, 1, 'W'], [1, 0, 'W']]);
  const T = through(7), S = sail(7, [[0, 1, 'E'], [1, 0, 'W']], { 1: 13 }), C = sail(11, [[2, 1, 'W'], [1, 2, 'E']]);
  const totals = [4, 5, 6, 7].map((s) => { const p = through(s); return [s, p[p.length - 1][0] - s]; });
  return { T, S, C, totals };
}
function voyageA() {
  const { T: tr, S: st, C: ch, totals } = voyageModel();
  const sx = lin(6, 26, 70, 400), Y = [70, 160, 250];
  let o = '';
  // 风的窗口：竖条
  for (let mth = 6; mth < 26; mth++) {
    if (SW(mth)) o += rect(sx(mth), 52, sx(mth + 1) - sx(mth), 226, 'wash');
    if (NE(mth)) o += rect(sx(mth), 52, sx(mth + 1) - sx(mth), 226, 'wash2');
  }
  for (const [a, b, s] of [[6, 8, 'SW'], [11, 15, 'NE'], [16, 20, 'SW'], [23, 26, 'NE']]) o += lab((sx(a) + sx(b)) / 2, 46, s, 'tb', 'middle');
  const names = ['India', 'Malacca', 'Guangzhou'];
  Y.forEach((y, i) => { o += line(sx(6), y, sx(26), y, 'grid') + lab(62, y + 4, names[i], 'tb', 'end'); });
  o += lab(62, Y[0] + 19, '2,650 km', 'ts', 'end').replace('2,650 km', String(Math.round(km(PORT.Nagapattinam, PORT.Malacca) / 50) * 50).replace(/\B(?=(\d{3})+$)/g, ',') + ' km ↓');
  o += lab(62, Y[1] + 19, String(Math.round(km(PORT.Malacca, PORT.Guangzhou) / 50) * 50).replace(/\B(?=(\d{3})+$)/g, ',') + ' km ↓', 'ts', 'end');
  const mo = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  for (let mth = 6; mth <= 26; mth++) {
    o += line(sx(mth), 278, sx(mth), 282, 'axis');
    if (mth < 26) o += lab((sx(mth) + sx(mth + 1)) / 2, 294, mo[mth % 12], 'ts', 'middle');
  }
  o += line(sx(6), 278, sx(26), 278, 'axis');
  for (const [yr, a, b] of [['第 1 年', 6, 12], ['第 2 年', 12, 24], ['第 3 年', 24, 26]]) o += lab((sx(a) + sx(b)) / 2, 310, yr, 'ts', 'middle') + line(sx(a), 300, sx(a), 314, 'grid');
  // 三条船各自上下错开几个像素，等风的水平段不会互相盖住
  const OFF = { T: -5, S: 0, C: 5 };
  const route = (pts, cls, off) => path(d(pts.map(([t, p]) => [sx(t), Y[p] + off])), cls);
  o += route(tr, 'ln', OFF.T) + route(st, 'ink-b', OFF.S) + route(ch, 'dash', OFF.C);
  o += lab(sx(10.5), Y[1] - 26, 'T 在 Malacca', 'tl', 'middle') + lab(sx(10.5), Y[1] - 11, '等 8 个月', 'tl', 'middle');
  o += lab(sx(20), Y[2] + 22, 'T 在 Guangzhou 等 6 个月', 'tl', 'middle');
  o += lab(sx(9.8), Y[1] + 20, 'S 等中国货', 'tb', 'middle');
  o += lab(sx(11.55) + 6, 212, 'C', 'tb', 'start');
  // 动画：时间光标和三个点
  const t0 = 6, t1 = 26, dur = 14, N = (t1 - t0) * 4, kt = [], cur = [];
  for (let i = 0; i <= N; i++) { kt.push(i / N); cur.push(t0 + ((t1 - t0) * i) / N); }
  const at = (pts, t, off) => {
    if (t < pts[0][0]) return null;
    for (let i = 1; i < pts.length; i++) { const [ta, pa] = pts[i - 1], [tb, pb] = pts[i]; if (t <= tb) return off + Y[pa] + ((Y[pb] - Y[pa]) * (t - ta)) / (tb - ta); }
    return null;
  };
  o += `<line x1="${f1(sx(t0))}" y1="52" x2="${f1(sx(t0))}" y2="278" class="mute">${anim('x1', cur.map((t) => f1(sx(t))), kt, dur)}${anim('x2', cur.map((t) => f1(sx(t))), kt, dur)}</line>`;
  const mover = (pts, cls, r, off) => {
    const ys = cur.map((t) => at(pts, t, off)), vis = ys.map((y) => y !== null);
    const yy = ys.map((y, i) => (y === null ? (ys.find((v) => v !== null) ?? Y[0]) : y));
    return `<circle cx="${f1(sx(t0))}" cy="${f1(yy[0])}" r="${r}" class="${cls}" opacity="${vis[0] ? 1 : 0}">${anim('cx', cur.map((t) => f1(sx(t))), kt, dur)}${anim('cy', yy.map(f1), kt, dur)}${ashow(vis, kt, dur)}</circle>`;
  };
  o += mover(tr, 'ln-f', 6, OFF.T) + mover(st, 'ink-f', 5, OFF.S) + mover(ch, 'paper', 5, OFF.C);
  // 右侧：图例写成句子 + 出发月份的表
  const X = 418;
  o += lab(X, 62, 'T：一路到 Guangzhou', 'tl') + lab(X, 77, '　 再回来', 'tl') + lab(X, 96, 'S：只走 India–Malacca', 'tb') + lab(X, 114, 'C：中国船，只走一段', 'tb');
  o += lab(X, 136, 'T 从 India 出发的月份', 'tb') + lab(X, 152, '和回到 India 用的月数', 'ts');
  const mn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'];
  totals.forEach(([s, n], i) => { o += lab(X + 6, 174 + i * 18, mn[s], i === 3 ? 'tl' : 't') + lab(X + 128, 174 + i * 18, n + ' 个月', i === 3 ? 'tl' : 't', 'end'); });
  o += lab(X, 254, '晚一个月出发，多一年', 'ts');
  o += lab(235, 334, '示意 model：东行、北行只能 5–8 月出发，西行、南行只能 12–3 月出发，每段一个月。', 'ts', 'middle');
  return svgA(560, 340, o, '动图：横轴是月份，纵轴是 India、Malacca、Guangzhou 三个 port；8 月从 India 出发、一路去 Guangzhou 的船要 18 个月才回到 India，只走一段的船几个月就回去了');
}

// ---------- 第 1 站：port的兴衰与航线的移动 ----------
function portsA() {
  const P = proj(78, 122, -8, 24, 126, 8, 7);
  const m = mapBase(P, 'se1101e-cq');
  let o = m.clip + m.open + m.land;
  const T = 18, y0 = 150, y1 = 1900, tk = (yr) => (yr - y0) / (y1 - y0);
  // 两条航线
  const kra = [[80.3, 12.5], [90, 11.5], [98.3, 10.0], [99.4, 10.4], [102, 10.2], [105.0, 10.0], [109, 12], [113.0, 21.0]];
  const strait = [[80.3, 12.0], [92, 7.5], [98, 5.2], [101.0, 2.6], [103.8, 1.15], [106, 2.5], [110, 7.5], [113.0, 21.0]];
  o += `<path d="${d(kra.map(P))}" class="ln">${showWin([[0, tk(450)]], T)}</path>`;
  o += `<path d="${d(kra.map(P))}" class="dash" opacity="0">${showWin([[tk(450), 1]], T)}</path>`;
  o += `<path d="${d(strait.map(P))}" class="ln" opacity="0">${showWin([[tk(450), 1]], T)}</path>`;
  o += '</g>' + m.frame;
  const [kx, ky] = P([99.0, 10.3]);
  o += lab(kx - 8, ky + 20, 'Kra portage', 'ts', 'end');
  // 各港：[名字, 坐标, [[起, 止]...], 标签位置]
  const ports = [
    ['Oc Eo（Funan）', PORT.OcEo, [[150, 500]], 'Oc Eo', 4, 18, 'start'],
    ['Palembang（Srivijaya）', PORT.Palembang, [[670, 1025]], 'Palembang', 8, 4, 'start'],
    ['Malacca', PORT.Malacca, [[1400, 1511]], 'Malacca', -8, -4, 'end'],
    ['Aceh', PORT.Aceh, [[1520, 1690]], 'Aceh', -8, 4, 'end'],
    ['Banten', PORT.Banten, [[1527, 1683]], 'Banten', -8, -6, 'end'],
    ['Makassar', PORT.Makassar, [[1607, 1669]], 'Makassar', 8, 4, 'start'],
    ['Batavia', PORT.Batavia, [[1619, 1900]], 'Batavia', 6, 13, 'start'],
    ['Singapore', PORT.Singapore, [[1819, 1900]], 'Singapore', 8, -4, 'start'],
  ];
  // map上的点：活跃时实心
  ports.forEach(([n, c, ws, short, dx, dy, an]) => {
    const [x, y] = P(c), win = showWin(ws.map(([a, b]) => [tk(a), tk(b)]), T), on = ws[0][0] <= y0 ? 1 : 0;
    o += circle(x, y, 3, 'mute-f');
    o += `<circle cx="${f1(x)}" cy="${f1(y)}" r="5.5" class="ln-f" opacity="${on}">${win}</circle>`;
    o += `<text x="${f1(x + dx)}" y="${f1(y + dy)}" class="tl" text-anchor="${an}" opacity="${on}">${short}${win}</text>`;
  });
  // 时间轴
  const sx = lin(y0, y1, 150, 548), top = 256, rh = 19;
  ports.forEach(([n, c, ws], i) => {
    const y = top + i * rh;
    o += lab(144, y + 13, n, 'ts', 'end');
    ws.forEach(([a, b]) => { o += rect(sx(a), y + 3, Math.max(sx(b) - sx(a), 2), 13, 'wash-strong', 2); });
  });
  const ay = top + ports.length * rh + 6;
  o += line(sx(y0), ay, sx(y1), ay, 'axis');
  for (const yr of [150, 500, 1000, 1500, 1900]) o += line(sx(yr), ay, sx(yr), ay + 4, 'axis') + lab(sx(yr), ay + 17, String(yr), 'ts', 'middle');
  // 事件
  const ev = [[450, '5 世纪：主航线改走 Strait'], [1025, '1025：Chola raid'], [1511, '1511：Portuguese 占 Malacca']];
  ev.forEach(([yr, s], i) => { o += line(sx(yr), top - 4, sx(yr), ay, 'grid') + lab(sx(yr), top - 7, String(yr), 'ts', 'middle'); });
  // 光标
  const N = 90, kt = [], xs = [];
  for (let i = 0; i <= N; i++) { kt.push(i / N); xs.push(f1(sx(y0 + ((y1 - y0) * i) / N))); }
  o += `<line x1="${xs[0]}" y1="${top - 4}" x2="${xs[0]}" y2="${ay}" class="ln">${anim('x1', xs, kt, T)}${anim('x2', xs, kt, T)}</line>`;
  // 年份读数
  const steps = [150]; for (let yr = 200; yr <= 1900; yr += 50) steps.push(yr);
  steps.forEach((yr, i) => {
    const a = tk(yr), b = i + 1 < steps.length ? tk(steps[i + 1]) : 1.01;
    o += `<text x="12" y="40" class="tbig" text-anchor="start" opacity="${i ? 0 : 1}">${yr}${showWin([[a, Math.min(b, 1.01)]], T)}</text>`;
  });
  o += lab(12, 62, '实心点：这一年', 'ts') + lab(12, 77, '是区域主要 entrepôt', 'ts');
  o += lab(12, 106, '450 年前后以前，', 'ts') + lab(12, 121, '货在 Kra 上岸，', 'ts') + lab(12, 136, '翻过地峡；之后', 'ts') + lab(12, 151, '船直接穿过', 'ts') + lab(12, 166, 'Strait of Malacca', 'ts');
  o += lab(12, 196, '每一次换位，换的', 'ts') + lab(12, 211, '是谁控制中途', 'ts') + lab(12, 226, '等风的地方', 'ts');
  o += lab(349, ay + 34, '年份取整，条的起止按文中各自的来源；1600 年以后几个 port 是同时竞争的', 'ts', 'middle');
  return svgA(560, ay + 42, o, '动图：从 100 年到 1900 年，Southeast Asia 主要 entrepôt 的位置怎样移动；450 年前后航线从 Kra 地峡转到 Strait of Malacca，主要 port 依次是 Oc Eo、Palembang、Malacca，16、17 世纪 Aceh、Banten、Makassar 竞争，之后是 Batavia 和 Singapore');
}

// ---------- 第 2 站：Bronson 的 upstream–downstream model ----------
function river() {
  let o = rect(10, 248, 540, 44, 'wash') + lab(540, 284, 'sea', 'ts', 'end');
  const A = [222, 172], B = [140, 108], C = [306, 112], Dd = [392, 70], E = [86, 52], F = [486, 44];
  const A1 = [478, 178];
  // 主河与支流
  o += path(d([[204, 248], [214, 214], A]), 'ln') + path(d([A, [180, 138], B, [112, 80], E]), 'ln') + path(d([A, [262, 140], C, [350, 92], Dd, [440, 60], F]), 'ln');
  // 对手的河
  o += path(d([[470, 248], [474, 214], A1, [496, 130], [520, 84]]), 'ln');
  const node = (p) => circle(p[0], p[1], 6, 'paper');
  o += node(A) + node(B) + node(C) + node(Dd) + node(A1) + circle(E[0], E[1], 4.5, 'ink-f') + circle(F[0], F[1], 4.5, 'ink-f');
  o += lab(210, 198, 'A：河口或汇流处的中心', 'tb', 'end') + lab(210, 214, '例如 Musi 河上的 Palembang', 'ts', 'end');
  o += lab(128, 112, 'B：upstream 次级中心', 't', 'end');
  o += lab(318, 128, 'C：upstream 次级中心', 't', 'start');
  o += lab(400, 88, 'D：远处的集散点', 't', 'start');
  o += lab(E[0], 36, 'E：hinterland 的 producer', 'ts', 'middle');
  o += lab(F[0], 28, 'F：upland 的 producer', 'ts', 'middle');
  o += lab(466, 200, 'A₁：对手的 river mouth', 'tb', 'end') + lab(466, 216, '例如 Batanghari 河上的 Jambi', 'ts', 'end');
  // 货物流向：沿河画平行的小箭头
  o += arrow(152, 136, 184, 162, 'ink', 6) + lab(146, 150, 'forest product、rice', 'ts', 'end');
  o += arrow(268, 160, 296, 136, 'ink', 6) + lab(276, 172, 'cloth、salt、metal', 'ts', 'start');
  // 两个河口之间的竞争
  o += arrow(268, 238, 232, 238, 'dash', 6) + arrow(412, 238, 462, 238, 'dash', 6) + lab(340, 242, '争同一批 producer 和 X', 'ts', 'middle');
  // 海外的 X
  o += rect(62, 256, 70, 28, 'paper', 4) + lab(97, 275, 'X', 'tb', 'middle');
  o += arrow(134, 266, 198, 250, 'ink', 6);
  o += lab(10, 304, 'X：海外的 consumer（例如来自 China 的船），只能在 A 交易', 'ts', 'start');
  return svg(560, 310, o, 'Bronson 的 riverine exchange model：河口或汇流处的中心 A 控制上游的 B、C、D 和 producer E、F 的货物，也控制与海外 X 的交易；相邻河口的 A1 是它的对手');
}

// ---------- 第 2 站：mandala，两个中心的 reach 随 reign 变化 ----------
function mandalaA() {
  const P = proj(97, 111, 7.5, 20.5, 10, 30, 22);
  const m = mapBase(P, 'se1101e-cn');
  let o = m.clip + m.open + m.land;
  const kmPx = P.s / 111;
  const A = P(PORT.Bangkok), B = P(PORT.Hue), C = P(PORT.Udong);
  const dA = km(PORT.Bangkok, PORT.Udong), dB = km(PORT.Hue, PORT.Udong);
  // 每个 reign 的 reach（km，假设的数字）
  const reigns = [[650, 650], [450, 700], [700, 520], [600, 640]];
  const T = 12, per = T / reigns.length, kt = [], rA = [], rB = [];
  reigns.forEach(([a, b], i) => { kt.push((i * per) / T, (i * per + per * 0.7) / T); rA.push(a, a); rB.push(b, b); });
  kt.push(1); rA.push(reigns[0][0]); rB.push(reigns[0][1]);
  o += `<circle cx="${f1(A[0])}" cy="${f1(A[1])}" r="${f1(rA[0] * kmPx)}" class="wash">${anim('r', rA.map((r) => f1(r * kmPx)), kt, T)}</circle>`;
  o += `<circle cx="${f1(B[0])}" cy="${f1(B[1])}" r="${f1(rB[0] * kmPx)}" class="wash">${anim('r', rB.map((r) => f1(r * kmPx)), kt, T)}</circle>`;
  o += `<circle cx="${f1(A[0])}" cy="${f1(A[1])}" r="${f1(rA[0] * kmPx)}" class="ln-dash">${anim('r', rA.map((r) => f1(r * kmPx)), kt, T)}</circle>`;
  o += `<circle cx="${f1(B[0])}" cy="${f1(B[1])}" r="${f1(rB[0] * kmPx)}" class="ln-dash">${anim('r', rB.map((r) => f1(r * kmPx)), kt, T)}</circle>`;
  o += '</g>' + m.frame;
  o += line(A[0], A[1], C[0], C[1], 'mute') + line(B[0], B[1], C[0], C[1], 'mute');
  o += circle(A[0], A[1], 5, 'ink-f') + circle(B[0], B[1], 5, 'ink-f') + circle(C[0], C[1], 5.5, 'ln-f');
  o += lab(A[0] - 8, A[1] - 7, 'Bangkok', 'tb', 'end') + lab(B[0] + 8, B[1] - 6, 'Huế', 'tb', 'start') + rect(C[0] + 6, C[1] + 5, 64, 17, 'paper-f', 3) + lab(C[0] + 9, C[1] + 18, 'Cambodia', 'tl', 'start');
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const mA = mid(A, C), mB = mid(B, C);
  o += lab(mA[0] - 4, mA[1] + 16, Math.round(dA) + ' km', 'ts', 'middle') + lab(mB[0] + 8, mB[1] + 4, Math.round(dB) + ' km', 'ts', 'start');
  // 右侧读数
  const X = 330;
  o += lab(X, 46, '每个 reign 的 reach（假设的数字）', 'tb');
  reigns.forEach(([a, b], i) => {
    const toA = dA <= a, toB = dB <= b;
    const who = toA && toB ? '向两边都送 tribute' : toA ? '只向 Bangkok 送 tribute' : '只向 Huế 送 tribute';
    const win = showWin([[kt[2 * i], i + 1 < reigns.length ? kt[2 * i + 2] : 1]], T);
    o += `<g opacity="${i ? 0 : 1}">${lab(X, 76, 'Bangkok reach ' + a + ' km', 't')}${lab(X, 94, 'Huế reach ' + b + ' km', 't')}${lab(X, 122, 'Cambodia 离 Bangkok ' + Math.round(dA) + ' km，' + (toA ? '在内' : '在外'), 'ts')}${lab(X, 138, '离 Huế ' + Math.round(dB) + ' km，' + (toB ? '在内' : '在外'), 'ts')}${lab(X, 162, '→ ' + who, 'tl')}${win}</g>`;
  });
  o += lab(X, 206, '圈是 power 能到达的范围，', 'ts') + lab(X, 222, '随 ruler 的强弱变大变小。', 'ts') + lab(X, 246, '两圈重叠的地方，', 'ts') + lab(X, 262, '一个 polity 可以同时', 'ts') + lab(X, 278, '属于两个 overlord。', 'ts');
  return svgA(560, 322, o, '动图：Bangkok 和 Huế 两个中心各有一个 power 能到达的圈，圈的大小随每个 reign 变化；位于两者之间的 Cambodia 有时在两个圈里，向两边都送 tribute，有时只在一个圈里');
}

// ---------- 第 3 站：Malacca 的四个 shahbandar ----------
function malacca() {
  let o = '';
  const box = (x, y, w, h, title, lines) => {
    let s = rect(x, y, w, h, 'paper', 6) + lab(x + w / 2, y + 19, title, 'tb', 'middle');
    lines.forEach((l, i) => { s += lab(x + w / 2, y + 38 + i * 15, l, 'ts', 'middle'); });
    return s;
  };
  o += box(170, 8, 220, 46, '四人之上的一位 officer', ['裁决不同群体之间的纠纷']);
  const sb = [
    ['Shahbandar 1', ['Gujarat']],
    ['Shahbandar 2', ['Coromandel、Bengal、', 'Pegu、Pasai']],
    ['Shahbandar 3', ['Java、Maluku、Banda、', 'Palembang、Borneo、', 'Luzon']],
    ['Shahbandar 4', ['Laksamana 兼任：', 'China、Ryukyu、', 'Cochin China、Champa']],
  ];
  const bw = 130, gap = 6, x0 = 11, by = 82, bh = 84;
  sb.forEach(([t, ls], i) => {
    const x = x0 + i * (bw + gap);
    o += box(x, by, bw, bh, t, ls) + line(x + bw / 2, by, 280, 54, 'mute');
  });
  o += rect(150, 204, 260, 64, 'wash', 8) + lab(280, 225, 'Malacca：river mouth、市场、仓库', 'tb', 'middle') + lab(280, 243, 'Vann：每船货按定好的 percentage 收税', 'ts', 'middle') + lab(280, 259, 'Pires：China 的 junk 不交税，只送礼', 'ts', 'middle');
  sb.forEach((_, i) => { const x = x0 + i * (bw + gap) + bw / 2; o += line(x, by + bh, 175 + i * 70, 204, 'mute'); });
  o += arrow(10, 236, 146, 236, 'ln', 8) + lab(12, 226, '西边来的船', 'tb') + lab(12, 254, '随 SW monsoon 到', 'ts');
  o += arrow(550, 236, 414, 236, 'ln', 8) + lab(548, 226, '东边来的船', 'tb', 'end') + lab(548, 254, '随 NE monsoon 到', 'ts', 'end');
  o += lab(280, 290, '每个 shahbandar 管一组按来处划分的 merchant，并向他们收税或收礼', 'ts', 'middle');
  return svg(560, 298, o, 'Malacca 约 1500 年的 port 管理：四个 shahbandar 各管一组按来处划分的 merchant，上面一位 officer 裁决群体之间的纠纷；西边的船随 SW monsoon 来，东边的船随 NE monsoon 来');
}

// ---------- 第 4 站：language family 的示意分布 ----------
function langmap() {
  const P = proj(92, 128, -11.5, 26, 10, 10, 12);
  const m = mapBase(P, 'se1101e-cl', 'paper-f');
  let o = m.clip + m.open;
  const isl = Object.entries(ISLANDS).filter(([k]) => !['hainan', 'srilanka'].includes(k)).map(([, p]) => polyD(p, P)).join('');
  const mainD = polyD(MAINLAND, P);
  o += path(mainD, 'paper-f') + path(isl, 'wash-strong');
  o += `<clipPath id="se1101e-clm"><path d="${mainD}"/></clipPath>`;
  const pen = [[99.5, 7.0], [101.6, 6.8], [104.5, 6.6], [104.5, 0.5], [99.5, 3.5]];
  const cham = [[107.6, 16.2], [109.6, 15.5], [109.6, 11.0], [107.8, 11.0], [108.2, 13.5]];
  o += `<path d="${polyD(pen, P)}${polyD(cham, P)}" class="wash-strong" clip-path="url(#se1101e-clm)"/>`;
  o += path(landD(P), 'mute') + '</g>' + m.frame;
  const at = (lo, la) => P([lo, la]);
  const tx = (lo, la, s, cls = 'ts', a = 'middle') => { const [x, y] = at(lo, la); return lab(x, y, s, cls, a); };
  o += lab(14, at(0, 23.2)[1], 'Sino-Tibetan', 'tb') + lab(14, at(0, 22.0)[1], 'Burmese、Karen', 'ts');
  o += tx(104.6, 23.6, 'Hmong-Mien（山地）');
  o += tx(105.2, 21.6, 'Vietnamese', 'ts') + tx(102.7, 20.6, '（Austroasiatic）', 'ts');
  o += tx(101.2, 18.6, 'Tai-Kadai', 'tb') + tx(101.2, 17.4, 'Thai、Lao、Shan');
  o += tx(95.6, 17.6, 'Mon', 'ts');
  o += tx(104.3, 13.0, 'Austroasiatic', 'tb') + tx(104.3, 11.8, 'Khmer');
  o += tx(110.0, 13.6, 'Cham', 'tl', 'start') + tx(110.0, 12.6, '（Austronesian）', 'ts', 'start');
  o += tx(113.3, -0.1, 'Austronesian', 'tl') + tx(113.3, -1.3, 'Malay、Javanese') + tx(113.3, -2.4, 'Tagalog……');
  // Out of Taiwan：有年份的两步画实线，之后的扩散画虚线
  const Tw = at(120.8, 21.9), Lz = at(121.2, 18.9);
  o += arrow(Tw[0], Tw[1] + 2, Lz[0], Lz[1], 'ln', 8);
  const X = 452;
  o += lab(X, at(0, 23.6)[1], 'Out of Taiwan', 'tl') + lab(X, at(0, 23.6)[1] + 15, '约 3000–2200 BCE', 'ts') + lab(X, at(0, 23.6)[1] + 30, '到 north Luzon', 'ts');
  const My = at(0, 19.6)[1];
  o += arrow(at(122.6, 0)[0], My, 536, My, 'ln', 8) + lab(X, My + 18, '约 1500 BCE', 'ts') + lab(X, My + 33, '到 Mariana Islands', 'ts');
  o += arrow(at(119.0, 15.0)[0], at(119.0, 15.0)[1], at(114.5, 7.5)[0], at(114.5, 7.5)[1], 'ln-dash', 7);
  o += arrow(at(123.5, 10.0)[0], at(123.5, 10.0)[1], at(123.0, 3.0)[0], at(123.0, 3.0)[1], 'ln-dash', 7);
  o += arrow(at(98.0, -3.2)[0], at(98.0, -3.2)[1], at(92.5, -6.2)[0], at(92.5, -6.2)[1], 'ln-dash', 7);
  o += lab(14, at(0, -7.6)[1], '← Malagasy（Madagascar）', 'ts');
  o += lab(14, at(0, -8.8)[1], '公元 5 世纪或更晚', 'ts');
  o += lab(226, 476, '深色：Austronesian language 区（示意）；虚线箭头是更晚的扩散，方向示意', 'ts', 'middle');
  return svg(560, 482, o, '示意 map：岛屿和 Malay peninsula 是 Austronesian language 区，从 Taiwan 约 3000 到 2200 BCE 到 north Luzon、约 1500 BCE 到 Mariana Islands；mainland 按河谷分布 Sino-Tibetan、Tai-Kadai、Austroasiatic，山地有 Hmong-Mien，中部沿海的 Cham 是 Austronesian');
}

// ---------- 第 4 站：religion 一层层叠上去 ----------
function faithA() {
  const y0 = 300, y1 = 1800, sx = lin(y0, y1, 176, 470);
  // 段：[起, 止, 文字, class]；split 段：[起, 止, 文字, 上半 class, 下半 class]
  const rows = [
    ['Burma', [[300, 1056, 'Hindu-Buddhist', 'wash'], [1056, 1800, 'Theravada', 'wash-strong']], 'Theravada'],
    ['Siam、Laos、Cambodia', [[300, 1300, 'Hindu-Buddhist', 'wash'], [1300, 1800, 'Theravada', 'wash-strong']], 'Theravada'],
    ['Vietnam（Red River）', [[300, 1800, 'Mahayana + Confucian', 'wash2']], 'Mahayana'],
    ['Sumatra、Malay 半岛', [[300, 650, '', 'paper'], [650, 1297, 'Buddhist', 'wash'], [1297, 1450, '', 'band-n', 'wash'], [1450, 1800, 'Islam', 'band-n']], 'Muslim'],
    ['Java', [[300, 450, '', 'paper'], [450, 1450, 'Hindu-Buddhist', 'wash'], [1450, 1527, '', 'band-n', 'wash'], [1527, 1800, 'Islam', 'band-n']], 'Muslim'],
    ['Bali', [[300, 900, '', 'paper'], [900, 1800, 'Hindu-Buddhist', 'wash']], 'Hindu'],
    ['Maluku', [[300, 1465, 'local', 'paper'], [1465, 1620, '', 'band-n', 'paper'], [1620, 1800, 'Islam', 'band-n']], 'Muslim'],
    ['Sulu、west Mindanao', [[300, 1457, 'local', 'paper'], [1457, 1800, 'Islam', 'band-n']], 'Muslim'],
    ['Luzon、Visayas', [[300, 1500, 'local', 'paper'], [1500, 1571, '', 'band-n', 'paper'], [1571, 1800, 'Catholic', 'band-p']], 'Catholic'],
  ];
  const top = 40, rh = 30;
  let o = lab(168, 26, 'region', 'ts', 'end') + lab(478, 26, '今天的 majority', 'ts', 'start');
  rows.forEach(([n, segs, today], i) => {
    const y = top + i * rh;
    o += lab(168, y + 18, n, 't', 'end');
    segs.forEach(([a, b, s, c1, c2]) => {
      const w = sx(b) - sx(a), h = rh - 6;
      const fix = (c) => (c === 'paper' ? 'frame' : c);
      if (c2) o += rect(sx(a), y + 3, w, h / 2, fix(c1)) + rect(sx(a), y + 3 + h / 2, w, h / 2, fix(c2));
      else o += rect(sx(a), y + 3, w, h, fix(c1));
      if (s && w > 60) o += lab((sx(a) + sx(b)) / 2, y + 19, s, 'ts', 'middle');
    });
    o += lab(478, y + 18, today, 'tb', 'start');
  });
  const ay = top + rows.length * rh + 6;
  o += line(sx(y0), ay, sx(y1), ay, 'axis');
  for (const yr of [300, 600, 900, 1200, 1500, 1800]) o += line(sx(yr), ay, sx(yr), ay + 4, 'axis') + lab(sx(yr), ay + 17, String(yr), 'ts', 'middle');
  // 光标：匀速走，在每个事件处停一下，让文字读得完
  const evs = [
    [300, 'Hindu、Buddhist 的 idea 经由 court 进入'],
    [1056, '1056：Pagan 的 Anawrahta 改信 Theravada'],
    [1297, '1297：Pasai 已有 Muslim ruler（Malik al-Salih 的墓）'],
    [1300, '13、14 世纪：Theravada 传到 Siam、Laos、Cambodia'],
    [1450, '15 世纪：Java 北岸的 merchant 后代成了 Muslim lord'],
    [1457, '约 1457：Sulu 成为 sultanate'],
    [1465, '约 1465：Maluku 的 ruler convert，百姓多数还不是'],
    [1527, '1527：Demak 攻下 Daha，Majapahit 的 court 退往 Bali'],
    [1571, '1571：Spain 占 Manila，Islam 在 Luzon 被截断'],
    [1605, '1605：Makassar 的 ruler convert'],
    [1620, '17 世纪：Maluku 的多数成为 Muslim（年份示意）'],
    [1800, 'Bali 一直留在 Hindu-Buddhist 一层'],
  ];
  const speed = 260, dwell = 1.6; // 年/秒，停留秒数
  const ts = [], ys = []; let t = 0, prev = y0;
  evs.forEach(([yr], i) => { if (i) { t += (yr - prev) / speed; } ts.push(t); ys.push(yr); t += dwell; ts.push(t); ys.push(yr); prev = yr; });
  const T = t + 0.4; ts.push(T); ys.push(y0);
  const kt = ts.map((v) => v / T);
  // 最后一段跳回起点用 discrete 不好做，改成：最后 0.4 s 内回到起点
  o += `<line x1="${f1(sx(y0))}" y1="${top - 2}" x2="${f1(sx(y0))}" y2="${ay}" class="ln">${anim('x1', ys.map((v) => f1(sx(v))), kt, T)}${anim('x2', ys.map((v) => f1(sx(v))), kt, T)}</line>`;
  evs.forEach(([yr, s], i) => {
    const a = kt[2 * i], b = i + 1 < evs.length ? kt[2 * i + 2] : 1;
    o += `<text x="176" y="${ay + 40}" class="tb" text-anchor="start" opacity="${i ? 0 : 1}">${s}${showWin([[a, b]], T)}</text>`;
  });
  return svgA(560, ay + 50, o, '动图：九个地区从 300 年到 1800 年的 religion 层次，光标扫过时间轴并在每个关键年份停下：Hindu-Buddhist 经由 court 进入，mainland 转向 Theravada，Islam 沿 port 传播，Spain 在 Islam 刚到 Manila 时占领了它，Bali 一直保持 Hindu-Buddhist');
}

// ---------- 第 5 站：colonial 的势力范围随时间变化 ----------
const CELLS = {
  bengal: [[88, 23.5], [92.6, 23.5], [92.6, 21.2], [92.2, 20.7], [88, 20.7]],
  arakan: [[92.6, 23.5], [94.5, 23.5], [94.7, 21.5], [94.9, 19.0], [94.9, 17.0], [94.2, 15.5], [92.0, 15.5], [92.0, 20.7], [92.2, 20.7], [92.6, 21.2]],
  tenass: [[97.4, 17.3], [98.8, 17.3], [98.6, 16.4], [98.4, 15.2], [99.1, 13.2], [99.6, 11.8], [98.7, 10.2], [98.4, 9.6], [97.0, 9.6], [97.0, 17.3]],
  lburma: [[94.9, 19.2], [96.9, 19.2], [97.7, 19.0], [97.7, 18.3], [98.6, 17.3], [97.0, 17.3], [97.0, 15.0], [94.2, 15.5], [94.9, 17.0], [94.9, 19.0]],
  uburma: [[94.5, 23.5], [99.5, 23.5], [100.2, 22.0], [101.2, 21.6], [100.1, 20.4], [99.5, 20.1], [98.0, 19.8], [97.7, 19.0], [96.9, 19.2], [94.9, 19.2], [94.9, 19.0], [94.7, 21.5]],
  laos: [[100.1, 20.4], [100.6, 20.15], [101.3, 19.5], [101.2, 17.6], [102.0, 17.9], [102.6, 17.95], [103.5, 18.4], [104.0, 17.9], [104.8, 17.4], [104.75, 16.5], [105.4, 16.0], [105.6, 15.5], [105.5, 14.4], [106.0, 13.95], [107.0, 14.3], [107.55, 14.7], [107.5, 15.5], [107.6, 16.0], [106.9, 16.5], [106.5, 17.4], [105.6, 18.3], [105.0, 18.9], [104.1, 19.5], [104.4, 20.0], [103.9, 20.5], [102.7, 21.0], [102.9, 21.7], [102.2, 22.4], [101.8, 22.4], [101.2, 21.6]],
  cambW: [[102.5, 12.6], [102.4, 13.6], [103.0, 14.3], [104.3, 14.35], [104.1, 13.3], [103.5, 12.5], [102.9, 12.1]],
  camb: [[104.3, 14.35], [105.5, 14.4], [106.0, 13.95], [107.0, 14.3], [107.55, 14.7], [107.6, 12.8], [106.4, 11.7], [106.0, 11.0], [105.0, 10.9], [104.5, 10.2], [103.3, 10.2], [102.6, 11.4], [102.9, 12.1], [103.5, 12.5], [104.1, 13.3]],
  cochin: [[105.0, 10.9], [106.0, 11.0], [106.4, 11.7], [107.3, 11.8], [108.0, 10.9], [108, 8], [104, 8], [104.5, 10.2]],
  annam: [[107.3, 11.8], [106.4, 11.7], [107.6, 12.8], [107.55, 14.7], [107.5, 15.5], [107.6, 16.0], [106.9, 16.5], [106.5, 17.4], [105.6, 18.3], [105.0, 18.9], [104.1, 19.5], [104.4, 20.0], [103.9, 20.5], [102.7, 21.0], [102.9, 21.7], [102.2, 22.4], [102.5, 22.7], [103.9, 22.5], [105.3, 23.0], [106.7, 22.8], [107.9, 21.5], [110, 21], [110, 11], [108.0, 10.9]],
  nmalay: [[100.13, 6.45], [101.0, 6.0], [101.4, 5.8], [101.9, 5.85], [102.1, 6.25], [104, 6.5], [104, 4.2], [103.45, 4.2], [102.6, 4.6], [101.8, 4.6], [101.3, 5.3], [100.9, 5.5], [100.3, 5.25], [99.5, 5.4], [99.5, 6.6]],
  smalay: [[99.5, 5.4], [100.3, 5.25], [100.9, 5.5], [101.3, 5.3], [101.8, 4.6], [102.6, 4.6], [103.45, 4.2], [104, 4.2], [104.6, 1.24], [103.3, 1.24], [102.6, 1.5], [101.8, 2.0], [100.9, 2.75], [100.1, 3.6]],
  aceh: [[94, 7], [98.6, 7], [98.3, 4.2], [97.9, 2.3], [94, 2.3]],
  bencoolen: [[100.8, -2.0], [101.8, -2.3], [103.0, -3.5], [103.9, -4.6], [104.0, -6.5], [101, -6.5], [99.5, -3.0]],
  sumatra: [[94, 2.3], [97.9, 2.3], [98.3, 4.2], [98.6, 5.0], [99.5, 5.0], [100.1, 3.6], [100.9, 2.75], [101.8, 2.0], [102.6, 1.5], [103.0, 0.9], [103.7, 0.3], [104.2, -0.6], [105.2, -0.6], [107.5, -1.0], [107.5, -5.3], [106.2, -5.6], [105.6, -6.0], [104.0, -6.5], [103.9, -4.6], [103.0, -3.5], [101.8, -2.3], [100.8, -2.0], [99.0, -1.0], [96, 1.5]],
  riau: [[103.3, 1.24], [105.2, 1.24], [105.2, -0.6], [104.2, -0.6], [103.7, 0.3], [103.0, 0.9]],
  javaW: [[104.0, -6.5], [105.6, -6.0], [106.2, -5.6], [107.5, -5.3], [108.5, -5.3], [108.5, -9.5], [104.0, -9.5]],
  javaE: [[108.5, -5.3], [114.4, -5.3], [114.52, -7.5], [114.56, -8.25], [114.66, -9.5], [108.5, -9.5]],
  bali: [[114.52, -7.5], [115.9, -7.5], [115.9, -9.3], [114.66, -9.3], [114.56, -8.25]],
  lsunda: [[115.9, -7.5], [123.4, -7.5], [123.4, -9.25], [121.5, -11], [115.9, -11]],
  timorW: [[123.4, -9.25], [124.9, -8.5], [125.05, -9.8], [124, -11], [121.5, -11]],
  timorE: [[124.9, -8.5], [128, -8], [128, -9.5], [125.05, -9.8]],
  borneoD: [[108.3, 2.5], [109.65, 2.08], [110.3, 0.95], [111.5, 1.0], [112.5, 1.5], [113.8, 1.3], [114.6, 1.5], [115.5, 2.5], [115.6, 3.5], [115.6, 4.2], [115.8, 4.2], [116.5, 4.3], [117.6, 4.17], [119, 4.2], [119.6, 1.5], [118.8, -1], [117, -4.5], [110, -4.5], [108.3, -1.5]],
  sarawak: [[109.0, 3.5], [109.65, 2.08], [110.3, 0.95], [111.5, 1.0], [112.5, 1.5], [113.8, 1.3], [114.6, 1.5], [115.5, 2.5], [115.6, 3.5], [115.6, 4.2], [115.35, 4.4], [114.9, 4.0], [114.6, 4.0], [114.1, 4.6], [113, 5.5], [110, 4]],
  brunei: [[114.1, 4.6], [114.6, 5.3], [115.35, 5.3], [115.35, 4.4], [114.9, 4.0], [114.6, 4.0]],
  nborneo: [[115.35, 4.4], [115.35, 5.3], [115.6, 6.5], [117, 8], [120, 6], [119, 4.2], [117.6, 4.17], [116.5, 4.3], [115.8, 4.2], [115.6, 4.2]],
  sulS: [[118, -3.3], [120.85, -3.3], [120.85, -6.5], [118, -6.5]],
  sul: [[119.6, 2.5], [126, 2.5], [124, -6.5], [120.85, -6.5], [120.85, -3.3], [118.0, -3.3], [118.8, -1], [119.6, 1.5]],
  maluku: [[126, 2.5], [129.9, 2.5], [130.7, -1.2], [131.6, -3.0], [131.6, -6.5], [124, -6.5]],
  png: [[129.9, 2.5], [135, 2.5], [135, -9.5], [131.6, -6.5], [131.6, -3.0], [130.7, -1.2]],
  phN: [[116, 12], [120.3, 11.9], [121.5, 10.3], [122.6, 8.9], [123.6, 9.3], [124.3, 9.5], [125.5, 10.0], [127, 10.5], [127, 20], [119, 20]],
  phS: [[116, 12], [120.3, 11.9], [121.5, 10.3], [122.6, 8.9], [123.6, 9.3], [124.3, 9.5], [125.5, 10.0], [127, 10.5], [127, 4.5], [121.5, 4.5], [120, 6], [117, 8], [115.6, 6.5]],
};
export const COLONY_YEARS = [1600, 1700, 1790, 1830, 1870, 1890, 1914];
// 每个 cell：[[起始 frame 的年份, owner], ...]，owner：B British、D Dutch、F French、S Spanish、U US、P Portuguese
const OWN = {
  bengal: [[1790, 'B']], arakan: [[1830, 'B']], tenass: [[1830, 'B']], lburma: [[1870, 'B']], uburma: [[1890, 'B']],
  laos: [[1914, 'F']], cambW: [[1914, 'F']], camb: [[1870, 'F']], cochin: [[1870, 'F']], annam: [[1890, 'F']],
  nmalay: [[1914, 'B']], smalay: [[1890, 'B']],
  aceh: [[1914, 'D']], bencoolen: [[1700, 'B'], [1830, 'D']], sumatra: [[1870, 'D']], riau: [[1830, 'D']],
  javaW: [[1700, 'D']], javaE: [[1790, 'D']], bali: [[1914, 'D']], lsunda: [[1914, 'D']], timorW: [[1700, 'D']], timorE: [[1700, 'P']],
  borneoD: [[1870, 'D']], sarawak: [[1890, 'B']], brunei: [[1890, 'B']], nborneo: [[1890, 'B']],
  sulS: [[1700, 'D']], sul: [[1914, 'D']], maluku: [[1600, 'P'], [1700, 'D']], png: [[1914, 'D']],
  phN: [[1600, 'S'], [1914, 'U']], phS: [[1890, 'S'], [1914, 'U']],
};
export function ownerAt(cell, yr) { let w = null; for (const [y, o] of OWN[cell] || []) if (yr >= y) w = o; return w; }
function colonyA() {
  const P = proj(92, 132, -11.5, 23, 10, 10, 13.5);
  const m = mapBase(P, 'se1101e-cc', 'paper-f');
  const frames = [1914, ...COLONY_YEARS];
  const first = 3.2, per = 1.7, T = first + per * COLONY_YEARS.length;
  const kt0 = frames.map((_, i) => (i === 0 ? 0 : (first + per * (i - 1)) / T));
  const winOf = (pred) => { const w = []; frames.forEach((yr, i) => { if (pred(yr)) w.push([kt0[i], i + 1 < frames.length ? kt0[i + 1] : 1]); }); const mg = []; for (const x of w) { if (mg.length && Math.abs(mg[mg.length - 1][1] - x[0]) < 1e-9) mg[mg.length - 1][1] = x[1]; else mg.push([...x]); } return mg; };
  const CLS = { B: 'wash-strong', D: 'band-n', F: 'wash', S: 'wash2', U: 'wash2', P: 'solid2' };
  let o = m.clip + `<clipPath id="se1101e-ccl"><path d="${landD(P)}"/></clipPath>` + m.open + m.land;
  o += '<g clip-path="url(#se1101e-ccl)">';
  for (const cell of Object.keys(CELLS)) {
    const owners = [...new Set((OWN[cell] || []).map(([, w]) => w))];
    for (const w of owners) {
      const ws = winOf((yr) => ownerAt(cell, yr) === w);
      if (!ws.length) continue;
      const vis0 = ownerAt(cell, frames[0]) === w;
      o += `<path d="${polyD(CELLS[cell], P)}" class="${CLS[w]}" opacity="${vis0 ? 1 : 0}">${showWin(ws, T)}</path>`;
    }
  }
  o += '</g>' + path(landD(P), 'mute');
  // 1824 分界
  const L1824 = [[97.0, 6.0], [99.5, 5.4], [100.1, 3.6], [100.9, 2.75], [101.8, 2.0], [102.6, 1.5], [103.3, 1.24], [104.5, 1.24], [105.3, 1.6]];
  o += `<path d="${d(L1824.map(P))}" class="ln-dash" opacity="1">${showWin(winOf((yr) => yr >= 1830), T)}</path>`;
  o += '</g>' + m.frame;
  // Straits Settlements 等port点
  const dots = [['Malacca', [[1600, 'P'], [1700, 'D'], [1830, 'B']]], ['Penang', [[1790, 'B']]], ['Singapore', [[1830, 'B']]], ['Batavia', [[1700, 'D']]], ['Manila', [[1600, 'S'], [1914, 'U']]]];
  for (const [n, hist] of dots) {
    const [x, y] = P(PORT[n]);
    const has = (yr) => hist.some(([y0]) => yr >= y0);
    o += `<circle cx="${f1(x)}" cy="${f1(y)}" r="3.6" class="ln-f" opacity="${has(frames[0]) ? 1 : 0}">${showWin(winOf(has), T)}</circle>`;
  }
  // 名字（直接写在势力旁边）
  const tag = (lo, la, s, pred, a = 'middle', cls = 'tb') => { const [x, y] = P([lo, la]); return `<text x="${f1(x)}" y="${f1(y)}" class="${cls}" text-anchor="${a}" opacity="${pred(frames[0]) ? 1 : 0}">${s}${showWin(winOf(pred), T)}</text>`; };
  const any = (w) => (yr) => Object.keys(OWN).some((c) => ownerAt(c, yr) === w);
  o += tag(93.1, 12.6, 'British', (yr) => yr >= 1790, 'start');
  o += tag(111.4, 7.2, 'British', (yr) => yr >= 1890, 'middle');
  o += tag(113.0, -9.6, 'Dutch', any('D'), 'middle');
  o += tag(110.6, 15.0, 'French', any('F'), 'start');
  o += tag(124.0, 17.4, 'Spanish', (yr) => yr < 1914, 'start');
  o += tag(124.0, 17.4, 'US', (yr) => yr >= 1914, 'start');
  o += tag(128.6, -8.9, 'Portuguese', any('P'), 'start', 'ts');
  o += tag(100.9, 15.4, 'Siam', () => true, 'middle') + tag(111.0, 22.3, 'China', () => true, 'middle', 'ts');
  // 年份与说明
  const note = {
    1600: 'Europeans 只有几个据点：Portuguese 的 Malacca、Spain 的 Manila',
    1700: 'VOC：Batavia（1619）、Maluku、Makassar（1669）',
    1790: 'British：Bengal、Bencoolen、Penang（1786）',
    1830: '1824 的 treaty 之后：分界北边 British，南边 Dutch',
    1870: 'Lower Burma（1852）；French：Cochinchina、Cambodia',
    1890: 'Upper Burma（1885）、Malay states；Tonkin、Annam',
    1914: '只剩 Siam 没有被 colonize，它的 border 也是这时定的',
  };
  frames.forEach((yr, i) => {
    const w = [[kt0[i], i + 1 < frames.length ? kt0[i + 1] : 1]];
    const s = i === 0 ? '1914：几乎整个 region 都在 colonial rule 下' : note[yr];
    o += `<g opacity="${i ? 0 : 1}">${lab(18, 440, String(yr), 'tbig')}${lab(18, 460, s, 'ts')}${showWin(w, T)}</g>`;
  });
  o += lab(280, 496, '示意：只画大块的归属，年份取整；颜色深浅只区分不同的 power', 'ts', 'middle');
  return svgA(560, 502, o, '动图：先显示 1914 年的 colonial 版图，然后从 1600 年起逐帧显示 1700、1790、1830、1870、1890、1914 年 British、Dutch、French、Spanish 和 US、Portuguese 的势力范围，Siam 始终没有被 colonize');
}

export default {
  'se1101e-puzzles': puzzles,
  'se1101e-monsoon': monsoonA,
  'se1101e-voyage': voyageA,
  'se1101e-ports': portsA,
  'se1101e-river': river,
  'se1101e-mandala': mandalaA,
  'se1101e-malacca': malacca,
  'se1101e-lang': langmap,
  'se1101e-faith': faithA,
  'se1101e-colony': colonyA,
};
