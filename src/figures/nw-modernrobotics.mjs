import { svg, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes, sub } from '../lib/svg.mjs';

// capstone 的 Xerr：为这一页自己写的 youBot kinematic simulation（NextState + TrajectoryGenerator + FeedbackControl，Python）算出，0 到 3 s 每 0.03 s 取一个点
const XERR = {"best":[[0.29,0.277,0.265,0.253,0.242,0.231,0.221,0.211,0.202,0.193,0.184,0.176,0.168,0.161,0.154,0.147,0.14,0.134,0.128,0.122,0.117,0.112,0.107,0.102,0.098,0.093,0.089,0.085,0.081,0.078,0.074,0.071,0.068,0.065,0.062,0.059,0.057,0.054,0.052,0.049,0.047,0.045,0.043,0.041,0.039,0.038,0.036,0.034,0.033,0.031,0.03,0.029,0.027,0.026,0.025,0.024,0.023,0.022,0.021,0.02,0.019,0.018,0.017,0.017,0.016,0.015,0.015,0.014,0.013,0.013,0.012,0.012,0.011,0.011,0.01,0.01,0.009,0.009,0.008,0.008,0.008,0.007,0.007,0.007,0.006,0.006,0.006,0.006,0.005,0.005,0.005,0.005,0.004,0.004,0.004,0.004,0.004,0.004,0.003,0.003,0.003],[-0.624,-0.597,-0.57,-0.545,-0.521,-0.498,-0.476,-0.455,-0.434,-0.415,-0.397,-0.379,-0.362,-0.346,-0.331,-0.316,-0.302,-0.289,-0.276,-0.264,-0.252,-0.241,-0.23,-0.22,-0.21,-0.201,-0.192,-0.184,-0.175,-0.168,-0.16,-0.153,-0.146,-0.14,-0.134,-0.128,-0.122,-0.117,-0.111,-0.107,-0.102,-0.097,-0.093,-0.089,-0.085,-0.081,-0.078,-0.074,-0.071,-0.068,-0.065,-0.062,-0.059,-0.056,-0.054,-0.052,-0.049,-0.047,-0.045,-0.043,-0.041,-0.039,-0.038,-0.036,-0.034,-0.033,-0.031,-0.03,-0.029,-0.027,-0.026,-0.025,-0.024,-0.023,-0.022,-0.021,-0.02,-0.019,-0.018,-0.017,-0.017,-0.016,-0.015,-0.014,-0.014,-0.013,-0.013,-0.012,-0.012,-0.011,-0.011,-0.01,-0.01,-0.009,-0.009,-0.008,-0.008,-0.008,-0.007,-0.007,-0.007],[0.094,0.09,0.086,0.083,0.079,0.076,0.072,0.069,0.066,0.063,0.06,0.058,0.055,0.053,0.05,0.048,0.046,0.044,0.042,0.04,0.038,0.037,0.035,0.034,0.032,0.031,0.029,0.028,0.027,0.026,0.024,0.023,0.022,0.021,0.02,0.019,0.019,0.018,0.017,0.016,0.016,0.015,0.014,0.014,0.013,0.012,0.012,0.011,0.011,0.01,0.01,0.009,0.009,0.009,0.008,0.008,0.007,0.007,0.007,0.007,0.006,0.006,0.006,0.005,0.005,0.005,0.005,0.005,0.004,0.004,0.004,0.004,0.004,0.003,0.003,0.003,0.003,0.003,0.003,0.003,0.003,0.002,0.002,0.002,0.002,0.002,0.002,0.002,0.002,0.002,0.002,0.002,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001],[-0.023,-0.022,-0.021,-0.02,-0.019,-0.019,-0.018,-0.017,-0.016,-0.016,-0.015,-0.014,-0.014,-0.013,-0.013,-0.012,-0.012,-0.011,-0.011,-0.01,-0.01,-0.01,-0.009,-0.009,-0.008,-0.008,-0.008,-0.007,-0.007,-0.007,-0.006,-0.006,-0.006,-0.006,-0.005,-0.005,-0.005,-0.005,-0.004,-0.004,-0.004,-0.004,-0.004,-0.004,-0.003,-0.003,-0.003,-0.003,-0.003,-0.003,-0.003,-0.003,-0.003,-0.002,-0.002,-0.002,-0.002,-0.002,-0.002,-0.002,-0.002,-0.002,-0.002,-0.002,-0.002,-0.002,-0.002,-0.002,-0.002,-0.002,-0.002,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.0,-0.0,-0.0,-0.0,-0.0,-0.0,-0.0,-0.0],[-0.308,-0.295,-0.282,-0.269,-0.257,-0.246,-0.235,-0.225,-0.215,-0.205,-0.196,-0.187,-0.179,-0.171,-0.164,-0.156,-0.149,-0.143,-0.136,-0.13,-0.125,-0.119,-0.114,-0.109,-0.104,-0.099,-0.095,-0.091,-0.087,-0.083,-0.079,-0.076,-0.072,-0.069,-0.066,-0.063,-0.06,-0.058,-0.055,-0.053,-0.05,-0.048,-0.046,-0.044,-0.042,-0.04,-0.038,-0.037,-0.035,-0.033,-0.032,-0.031,-0.029,-0.028,-0.027,-0.025,-0.024,-0.023,-0.022,-0.021,-0.02,-0.019,-0.019,-0.018,-0.017,-0.016,-0.015,-0.015,-0.014,-0.013,-0.013,-0.012,-0.012,-0.011,-0.011,-0.01,-0.01,-0.009,-0.009,-0.009,-0.008,-0.008,-0.007,-0.007,-0.007,-0.006,-0.006,-0.006,-0.006,-0.005,-0.005,-0.005,-0.005,-0.005,-0.004,-0.004,-0.004,-0.004,-0.004,-0.003,-0.003],[-0.361,-0.345,-0.33,-0.315,-0.301,-0.288,-0.275,-0.263,-0.251,-0.24,-0.229,-0.219,-0.209,-0.2,-0.191,-0.183,-0.175,-0.167,-0.16,-0.152,-0.146,-0.139,-0.133,-0.127,-0.122,-0.116,-0.111,-0.106,-0.101,-0.097,-0.093,-0.089,-0.085,-0.081,-0.077,-0.074,-0.071,-0.067,-0.064,-0.062,-0.059,-0.056,-0.054,-0.051,-0.049,-0.047,-0.045,-0.043,-0.041,-0.039,-0.037,-0.036,-0.034,-0.033,-0.031,-0.03,-0.029,-0.027,-0.026,-0.025,-0.024,-0.023,-0.022,-0.021,-0.02,-0.019,-0.018,-0.017,-0.017,-0.016,-0.015,-0.014,-0.014,-0.013,-0.013,-0.012,-0.012,-0.011,-0.011,-0.01,-0.01,-0.009,-0.009,-0.008,-0.008,-0.008,-0.007,-0.007,-0.007,-0.006,-0.006,-0.006,-0.006,-0.005,-0.005,-0.005,-0.005,-0.004,-0.004,-0.004,-0.004]],"over":[[0.29,0.272,0.253,0.235,0.216,0.197,0.178,0.159,0.141,0.123,0.108,0.096,0.082,0.067,0.051,0.035,0.021,0.007,-0.007,-0.019,-0.031,-0.041,-0.051,-0.06,-0.069,-0.076,-0.082,-0.088,-0.093,-0.097,-0.1,-0.103,-0.105,-0.106,-0.107,-0.107,-0.106,-0.105,-0.104,-0.102,-0.099,-0.097,-0.093,-0.09,-0.086,-0.082,-0.078,-0.074,-0.069,-0.065,-0.06,-0.055,-0.05,-0.046,-0.041,-0.036,-0.032,-0.028,-0.023,-0.019,-0.015,-0.011,-0.007,-0.004,-0.0,0.003,0.006,0.008,0.011,0.013,0.015,0.017,0.019,0.021,0.022,0.023,0.024,0.025,0.025,0.026,0.026,0.026,0.026,0.026,0.025,0.025,0.025,0.024,0.023,0.022,0.022,0.021,0.02,0.019,0.018,0.016,0.015,0.014,0.013,0.012,0.011],[-0.624,-0.586,-0.546,-0.506,-0.465,-0.424,-0.384,-0.344,-0.304,-0.265,-0.227,-0.19,-0.154,-0.12,-0.087,-0.055,-0.025,0.004,0.03,0.055,0.078,0.1,0.12,0.137,0.153,0.168,0.18,0.191,0.201,0.208,0.214,0.219,0.222,0.224,0.224,0.224,0.222,0.219,0.215,0.21,0.205,0.198,0.191,0.184,0.175,0.167,0.158,0.148,0.139,0.129,0.119,0.11,0.1,0.09,0.08,0.071,0.061,0.052,0.043,0.034,0.026,0.018,0.011,0.004,-0.003,-0.01,-0.015,-0.021,-0.026,-0.031,-0.035,-0.039,-0.042,-0.045,-0.047,-0.049,-0.051,-0.053,-0.054,-0.054,-0.055,-0.055,-0.054,-0.054,-0.053,-0.052,-0.051,-0.049,-0.048,-0.046,-0.044,-0.042,-0.04,-0.038,-0.035,-0.033,-0.031,-0.028,-0.026,-0.023,-0.021],[0.094,0.089,0.083,0.077,0.071,0.065,0.059,0.053,0.047,0.041,0.036,0.03,0.025,0.02,0.015,0.01,0.005,0.0,-0.004,-0.008,-0.012,-0.015,-0.018,-0.021,-0.024,-0.026,-0.028,-0.03,-0.031,-0.032,-0.033,-0.034,-0.035,-0.035,-0.035,-0.035,-0.035,-0.034,-0.034,-0.033,-0.032,-0.031,-0.03,-0.029,-0.027,-0.026,-0.025,-0.023,-0.022,-0.02,-0.019,-0.017,-0.015,-0.014,-0.012,-0.011,-0.009,-0.008,-0.007,-0.005,-0.004,-0.003,-0.001,-0.0,0.001,0.002,0.003,0.003,0.004,0.005,0.006,0.006,0.007,0.007,0.008,0.008,0.008,0.008,0.008,0.009,0.009,0.009,0.009,0.008,0.008,0.008,0.008,0.008,0.007,0.007,0.007,0.007,0.006,0.006,0.005,0.005,0.005,0.004,0.004,0.004,0.003],[-0.023,-0.022,-0.02,-0.019,-0.018,-0.016,-0.015,-0.014,-0.013,-0.012,-0.011,-0.009,-0.007,-0.006,-0.004,-0.003,-0.002,-0.001,0.001,0.002,0.003,0.003,0.004,0.005,0.006,0.006,0.007,0.007,0.008,0.008,0.008,0.009,0.009,0.009,0.009,0.009,0.009,0.009,0.008,0.008,0.008,0.008,0.007,0.007,0.007,0.006,0.006,0.006,0.005,0.005,0.004,0.004,0.004,0.003,0.003,0.002,0.002,0.001,0.001,-0.0,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.001,-0.0,-0.0,-0.0,-0.0,-0.0,-0.0,-0.0,-0.0],[-0.308,-0.289,-0.27,-0.25,-0.23,-0.21,-0.19,-0.17,-0.151,-0.131,-0.115,-0.099,-0.084,-0.067,-0.05,-0.034,-0.018,-0.004,0.01,0.023,0.035,0.046,0.056,0.066,0.074,0.082,0.089,0.094,0.099,0.104,0.107,0.11,0.111,0.113,0.113,0.113,0.112,0.111,0.109,0.107,0.104,0.101,0.098,0.094,0.09,0.086,0.081,0.077,0.072,0.067,0.062,0.057,0.052,0.047,0.042,0.037,0.032,0.028,0.023,0.019,0.015,0.011,0.007,0.003,-0.001,-0.004,-0.007,-0.01,-0.012,-0.015,-0.017,-0.019,-0.021,-0.022,-0.023,-0.025,-0.026,-0.026,-0.027,-0.027,-0.027,-0.028,-0.027,-0.027,-0.027,-0.026,-0.026,-0.025,-0.024,-0.023,-0.022,-0.021,-0.02,-0.019,-0.018,-0.017,-0.016,-0.015,-0.013,-0.012,-0.011],[-0.361,-0.338,-0.315,-0.292,-0.269,-0.245,-0.222,-0.199,-0.176,-0.153,-0.133,-0.113,-0.093,-0.074,-0.054,-0.036,-0.018,-0.001,0.014,0.029,0.043,0.056,0.067,0.078,0.088,0.096,0.104,0.11,0.116,0.121,0.124,0.127,0.129,0.13,0.131,0.131,0.13,0.128,0.126,0.123,0.12,0.116,0.112,0.108,0.103,0.098,0.093,0.088,0.082,0.076,0.071,0.065,0.059,0.053,0.048,0.042,0.037,0.031,0.026,0.021,0.016,0.012,0.007,0.003,-0.001,-0.005,-0.008,-0.011,-0.014,-0.017,-0.02,-0.022,-0.024,-0.026,-0.027,-0.028,-0.029,-0.03,-0.031,-0.031,-0.032,-0.032,-0.031,-0.031,-0.031,-0.03,-0.029,-0.029,-0.028,-0.027,-0.026,-0.025,-0.023,-0.022,-0.021,-0.019,-0.018,-0.017,-0.015,-0.014,-0.012]]};

const R2D = 180 / Math.PI, D2R = Math.PI / 180;

// ---------- 2R arm 与圆形障碍：workspace 和 C-space（torus） ----------
const OBS2R = [[0.6, 0, 0.15], [-0.8, 1.2, 0.3]];
function segDist(px, py, ax, ay, bx, by) {
  const abx = bx - ax, aby = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * abx + (py - ay) * aby) / (abx * abx + aby * aby)));
  return Math.hypot(ax + t * abx - px, ay + t * aby - py);
}
function armPts(t1, t2) {
  const b = [Math.cos(t1), Math.sin(t1)];
  return [[0, 0], b, [b[0] + Math.cos(t1 + t2), b[1] + Math.sin(t1 + t2)]];
}
function hit(t1, t2) {
  const [a, b, c] = armPts(t1, t2);
  return OBS2R.some(([ox, oy, R]) => segDist(ox, oy, a[0], a[1], b[0], b[1]) < R || segDist(ox, oy, b[0], b[1], c[0], c[1]) < R);
}

function cspace() {
  const N = 90, cell = 360 / N;
  const ang = (i) => (-180 + (i + 0.5) * cell) * D2R;
  const G = [];
  for (let i = 0; i < N; i++) { G.push([]); for (let j = 0; j < N; j++) G[i].push(hit(ang(i), ang(j))); }
  // BFS（8 邻接，θ₁ 与 θ₂ 都首尾相接）
  const idx = (deg) => Math.floor((deg + 180) / cell);
  const s = [idx(-60), idx(60)], g = [idx(60), idx(45)];
  const prev = new Map(), key = (i, j) => i * N + j;
  const q = [s]; prev.set(key(...s), null);
  while (q.length) {
    const [i, j] = q.shift();
    if (i === g[0] && j === g[1]) break;
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      const a = (i + di + N) % N, b = (j + dj + N) % N;
      if (!G[a][b] && !prev.has(key(a, b))) { prev.set(key(a, b), [i, j]); q.push([a, b]); }
    }
  }
  let cur = g; const cells = [];
  while (cur) { cells.push(cur); cur = prev.get(key(...cur)); }
  cells.reverse();
  // 展开成连续的角度（跨边界时不跳），再做 shortcut smoothing
  const pts = [[-180 + (cells[0][0] + 0.5) * cell, -180 + (cells[0][1] + 0.5) * cell]];
  for (let k = 1; k < cells.length; k++) {
    let d1 = cells[k][0] - cells[k - 1][0], d2 = cells[k][1] - cells[k - 1][1];
    if (d1 > 1) d1 -= N; if (d1 < -1) d1 += N; if (d2 > 1) d2 -= N; if (d2 < -1) d2 += N;
    const p = pts[pts.length - 1]; pts.push([p[0] + d1 * cell, p[1] + d2 * cell]);
  }
  const free = (p, r) => { for (let k = 0; k <= 60; k++) { const x = p[0] + (r[0] - p[0]) * k / 60, y = p[1] + (r[1] - p[1]) * k / 60; if (hit(x * D2R, y * D2R)) return false; } return true; };
  const sm = [pts[0]]; let a = 0;
  while (a < pts.length - 1) { let b = pts.length - 1; while (b > a + 1 && !free(pts[a], pts[b])) b--; sm.push(pts[b]); a = b; }
  { const w = (v) => ((v + 180) % 360 + 360) % 360 - 180; const L = sm[sm.length - 1];
    sm[0] = [-60, 60]; sm[sm.length - 1] = [L[0] + (60 - w(L[0])), L[1] + (45 - w(L[1]))]; }

  let o = '';
  // 左：workspace
  const wx = lin(-2.15, 2.15, 18, 258), wy = lin(-2.15, 2.15, 268, 28), sc = 240 / 4.3;
  o += circle(wx(0), wy(0), 2 * sc, 'dash') + line(wx(-2.15), wy(0), wx(2.15), wy(0), 'grid') + line(wx(0), wy(-2.15), wx(0), wy(2.15), 'grid');
  for (const [ox, oy, R] of OBS2R) o += circle(wx(ox), wy(oy), R * sc, 'band-n');
  o += text(wx(0.6), wy(0) + 26, 'A', 'tb', 'middle') + text(wx(-0.8) - 28, wy(1.2) + 5, 'B', 'tb', 'middle');
  const drawArm = (t1, t2, cls, lab, dx, dy, anc = 'start') => {
    const P = armPts(t1 * D2R, t2 * D2R).map(([x, y]) => [wx(x), wy(y)]);
    return path(d(P), cls) + circle(P[1][0], P[1][1], 3.5, 'ink-f') + circle(P[2][0], P[2][1], 3.5, cls === 'ln' ? 'ln-f' : 'ink-f') + text(P[2][0] + dx, P[2][1] + dy, lab, cls === 'ln' ? 'tl' : 'tb', anc);
  };
  o += drawArm(-60, 60, 'ink-b', 'start', 8, 4) + drawArm(60, 45, 'ln', 'goal', -10, 16, 'end') + circle(wx(0), wy(0), 4, 'ink-f');
  o += text(138, 18, 'workspace（L₁ = L₂ = 1）', 'tb', 'middle');
  // 右：C-space
  const x0 = 318, y0 = 34, S = 222;
  const cx = lin(-180, 180, x0, x0 + S), cy = lin(-180, 180, y0 + S, y0);
  for (let i = 0; i < N; i++) {
    let j = 0;
    while (j < N) {
      if (!G[i][j]) { j++; continue; }
      let k = j; while (k < N && G[i][k]) k++;
      o += rect(cx(-180 + i * cell), cy(-180 + k * cell), S / N + 0.3, (k - j) * S / N + 0.3, 'band-n');
      j = k;
    }
  }
  o += rect(x0, y0, S, S, 'frame');
  // 路径：遇到 ±180° 就断开，从对面接上
  const wrap = (v) => ((v + 180) % 360 + 360) % 360 - 180;
  for (let k = 0; k < sm.length - 1; k++) {
    let [p, r] = [sm[k], sm[k + 1]];
    const sh = wrap(p[0]) - p[0]; p = [p[0] + sh, p[1]]; r = [r[0] + sh, r[1]];
    if (r[0] > 180 || r[0] < -180) {
      const edge = r[0] > 180 ? 180 : -180, t = (edge - p[0]) / (r[0] - p[0]), m = [edge, p[1] + t * (r[1] - p[1])];
      o += line(cx(p[0]), cy(p[1]), cx(m[0]), cy(m[1]), 'ln') + line(cx(m[0] - 2 * edge), cy(m[1]), cx(r[0] - 2 * edge), cy(r[1]), 'ln');
    } else o += line(cx(p[0]), cy(p[1]), cx(r[0]), cy(r[1]), 'ln');
  }
  o += circle(cx(-60), cy(60), 4.5, 'ink-f') + text(cx(-60) - 8, cy(60) - 8, 'start', 'tb', 'end');
  o += circle(cx(60), cy(45), 4.5, 'ln-f') + text(cx(60) - 8, cy(45) + 18, 'goal', 'tl', 'end');
  for (const v of [-180, 0, 180]) o += text(cx(v), y0 + S + 16, String(v) + '°', 'ts', 'middle') + text(x0 - 6, cy(v) + 4, String(v) + '°', 'ts', 'end');
  o += text(x0 + S, y0 + S + 32, 'θ₁', 'ts', 'end') + text(x0 - 42, y0 + 4, 'θ₂', 'ts', 'end');
  // 左右边、上下边粘在一起的记号
  for (const yy of [y0 + 70, y0 + 152]) o += arrow(x0 + 0.5, yy + 8, x0 + 0.5, yy - 8, 'mute') + arrow(x0 + S - 0.5, yy + 8, x0 + S - 0.5, yy - 8, 'mute');
  o += text(x0 + S / 2, 18, 'C-space：左右两边是同一条边', 'tb', 'middle');
  o += text(280, 312, '深色是 C-obstacle。link 1 扫过 θ₁ ≈ 0° 附近就碰到 A，竖直的 band 把 square 切成两块；', 'ts', 'middle');
  o += text(280, 330, '但 θ₁ = 180° 和 −180° 是同一个 configuration，path 从右边出去、从左边进来，arm 绕背后转过去。', 'ts', 'middle');
  return svg(560, 340, o, '2R arm 的 workspace 与 C-space。靠近 base 的 obstacle 在 C-space 里成为一条竖直的 band，把方形切成两块，但沿 θ1 首尾相接后仍连通，path 从 180 度处绕过去');
}


// ---------- 开头第一次失败：2R arm 绕过柱子（只画 workspace，C-space 见 mr-cspace） ----------
function pillar() {
  const P = [0.6, 0, 0.15];
  const hitP = (t1, t2) => { const [a, b, c] = armPts(t1 * D2R, t2 * D2R); return segDist(P[0], P[1], a[0], a[1], b[0], b[1]) < P[2] || segDist(P[0], P[1], b[0], b[1], c[0], c[1]) < P[2]; };
  let o = '';
  const panel = (x0, title, route) => {
    const wx = lin(-2.15, 2.15, x0, x0 + 240), wy = lin(-2.15, 2.15, 278, 38), sc = 240 / 4.3;
    let q = text(x0 + 120, 22, title, 'tb', 'middle');
    q += circle(wx(0), wy(0), 2 * sc, 'dash') + line(wx(-2.15), wy(0), wx(2.15), wy(0), 'grid') + line(wx(0), wy(-2.15), wx(0), wy(2.15), 'grid');
    q += circle(wx(P[0]), wy(P[1]), P[2] * sc, 'band-n') + text(wx(P[0]) + 22, wy(0) + 22, '柱子', 'ts', 'start');
    // 中间姿态（淡）
    for (const [t1, t2] of route) {
      const A = armPts(t1 * D2R, t2 * D2R).map(([x, y]) => [wx(x), wy(y)]);
      q += path(d(A), hitP(t1, t2) ? 'mute' : 'dash');
    }
    // link 1 末端扫过的弧
    const t0 = route[0][0], t9 = route[route.length - 1][0], n = 60, arc = [];
    for (let k = 0; k <= n; k++) { const t = (t0 + (t9 - t0) * k / n) * D2R; arc.push([wx(0.62 * Math.cos(t)), wy(0.62 * Math.sin(t))]); }
    q += path(d(arc), 'ln');
    const e = arc[arc.length - 1], e0 = arc[arc.length - 4];
    q += arrow(e0[0], e0[1], e[0], e[1], 'ln');
    const draw = (t1, t2, cls, lab, dx, dy, anc) => {
      const A = armPts(t1 * D2R, t2 * D2R).map(([x, y]) => [wx(x), wy(y)]);
      return path(d(A), cls) + circle(A[1][0], A[1][1], 3.5, 'ink-f') + circle(A[2][0], A[2][1], 3.5, cls === 'ln' ? 'ln-f' : 'ink-f') + text(A[2][0] + dx, A[2][1] + dy, lab, cls === 'ln' ? 'tl' : 'tb', anc);
    };
    q += draw(-60, 60, 'ink-b', 'start (−60°, 60°)', 4, 20, 'end') + draw(60, 45, 'ln', 'goal (60°, 45°)', 8, -6, 'start') + circle(wx(0), wy(0), 4, 'ink-f');
    return q;
  };
  // 左：θ₁ 从 −60° 直接增到 60°，中途 link 1 扫过柱子
  const direct = [], back = [];
  for (let k = 1; k < 6; k++) direct.push([-60 + 120 * k / 6, 60 - 15 * k / 6]);
  for (let k = 1; k < 6; k++) back.push([-60 - 240 * k / 6, 60 - 15 * k / 6]);
  o += panel(16, '在 square 里找：θ₁ 只能从 −60° 增到 60°', [[-60, 60], ...direct, [60, 45]]);
  o += panel(300, '实际可行：θ₁ 往回转 240°，从背后绕过去', [[-60, 60], ...back, [-300, 45]]);
  // 左图标出碰撞的姿态
  const wxL = lin(-2.15, 2.15, 16, 256), wyL = lin(-2.15, 2.15, 278, 38);
  o += text(wxL(-2.05), wyL(1.75), '灰线：这个姿态', 'ts', 'start') + text(wxL(-2.05), wyL(1.75) + 15, '会碰到柱子', 'ts', 'start');
  o += text(280, 306, '虚线是途中的姿态（灰线表示这一姿态会碰到柱子），彩色弧是 link 1 上一点走过的路。', 'ts', 'middle');
  o += text(280, 324, '−60° 往回转 240° 是 −300°，和 60° 是同一个角；把 θ₁ 限定在 [−180°, 180°) 的 grid 看不见这条路。', 'ts', 'middle');
  return svg(560, 334, o, '2R arm 绕过柱子：左边沿 θ1 直接增加会扫到柱子；右边 θ1 往回转 240 度从背后绕过去到达同一个 goal');
}

// ---------- Example 3.26：平面里任何一次位移都是绕一个点的转动 ----------
function screw() {
  const sx = lin(-0.4, 4.3, 30, 30 + 4.7 * 56), sy = lin(-0.4, 4.3, 292, 292 - 4.7 * 56), u = 56;
  const frame = (x, y, a, lab, cls) => {
    const c = Math.cos(a * D2R), s = Math.sin(a * D2R), L = 0.75;
    return arrow(sx(x), sy(y), sx(x + L * c), sy(y + L * s), cls) + arrow(sx(x), sy(y), sx(x - L * s), sy(y + L * c), 'mute')
      + text(sx(x + L * c) + 4, sy(y + L * s) + 4, 'x', 'ts')
      + text(sx(x) - 8, sy(y) + 14, lab, cls === 'ln' ? 'tl' : 'tb', 'end');
  };
  const q = [3.366, 3.366];
  let o = line(sx(-0.4), sy(0), sx(4.3), sy(0), 'grid') + line(sx(0), sy(-0.4), sx(0), sy(4.3), 'grid');
  o += frame(0, 0, 0, '{s}', 'mute') + frame(1, 2, 30, '{b}', 'ink') + frame(2, 1, 60, '{c}', 'ln');
  o += line(sx(q[0]), sy(q[1]), sx(1), sy(2), 'dash') + line(sx(q[0]), sy(q[1]), sx(2), sy(1), 'dash');
  const r = Math.hypot(1 - q[0], 2 - q[1]), a0 = Math.atan2(2 - q[1], 1 - q[0]);
  const arc = []; for (let k = 0; k <= 30; k++) { const a = a0 + (Math.PI / 6) * k / 30; arc.push([sx(q[0] + r * Math.cos(a)), sy(q[1] + r * Math.sin(a))]); }
  o += path(d(arc), 'ln-dash');
  const e = arc[arc.length - 1], e2 = arc[arc.length - 3];
  o += arrow(e2[0], e2[1], e[0], e[1], 'ln');
  o += circle(sx(q[0]), sy(q[1]), 4.5, 'ink-f') + text(sx(q[0]) + 8, sy(q[1]) - 8, 'q = (3.37, 3.37)', 'tb');
  o += text(sx(q[0]) - 30, sy(q[1]) + 30, '30°', 'ts', 'middle');
  const tx = 330;
  o += text(tx, 120, '从 {b} 到 {c}：', 'tb') + text(tx, 142, '转了 30°，origin 从 (1, 2) 到 (2, 1)', 't');
  o += text(tx, 172, '等价于绕 q 转 30°：', 'tb') + text(tx, 194, 'S = (0, 0, 1, 3.37, −3.37, 0)', 't') + text(tx, 214, 'θ = π/6', 't');
  o += text(tx, 244, 'v = −ω × q，所以 q 能从 S 读出来', 'ts') + text(tx, 266, '短箭头：灰色是各 frame 的 y 轴', 'ts');
  return svg(560, 305, o, 'Frame b 到 frame c 的位移，等价于绕点 q 等于 3.37, 3.37 转 30 度；虚线是两个 origin 到 q 的距离，弧线是 origin 走过的路径');
}

// ---------- 3R spatial open chain（Example 4.1 的形状）：home configuration 与三个 screw axis ----------
function poe() {
  const P = (x, y, z) => [105 + 150 * (x + 0.42 * y), 120 - 150 * (z + 0.3 * y)];
  const L = (a, b, cls) => { const p = P(...a), q = P(...b); return line(p[0], p[1], q[0], q[1], cls); };
  const A = (a, b, cls) => { const p = P(...a), q = P(...b); return arrow(p[0], p[1], q[0], q[1], cls); };
  let o = '';
  o += L([0, 0, -0.75], [0, 0, 0.5], 'dash') + L([1, -0.9, 0], [1, 0.9, 0], 'dash') + L([0.15, 0, -0.5], [1.55, 0, -0.5], 'dash');
  o += L([0, 0, 0], [1, 0, 0], 'ink-b') + L([1, 0, 0], [1, 0, -0.5], 'ink-b') + L([0, 0, -0.75], [0, 0, 0], 'ink-b');
  for (const p of [[0, 0, 0], [1, 0, 0], [1, 0, -0.5]]) { const q = P(...p); o += circle(q[0], q[1], 4.5, 'ink-f'); }
  // {s}
  o += A([0, 0, 0], [0.32, 0, 0], 'mute') + A([0, 0, 0], [0, 0.45, 0], 'mute');
  const ps = P(0.33, 0, 0), py = P(0, 0.47, 0); o += text(ps[0] + 2, ps[1] + 16, 'x', 'ts') + text(py[0] + 4, py[1] - 2, 'y', 'ts') + text(P(0, 0, 0)[0] - 10, P(0, 0, 0)[1] + 18, '{s}', 'tb', 'end');
  // {b}：x_b = −ẑ_s，y_b = ŷ_s，z_b = x̂_s
  o += A([1, 0, -0.5], [1, 0, -0.82], 'ln') + A([1, 0, -0.5], [1.3, 0, -0.5], 'ln') + A([1, 0, -0.5], [1, 0.45, -0.5], 'ln');
  const bx = P(1, 0, -0.84), bz = P(1.32, 0, -0.5), by = P(1, 0.47, -0.5);
  o += text(bx[0] + 6, bx[1] + 6, 'x_b', 'tl') + text(bz[0] + 4, bz[1] + 14, 'z_b', 'tl') + text(by[0] + 4, by[1] - 2, 'y_b', 'tl');
  const b0 = P(1, 0, -0.5); o += text(b0[0] - 12, b0[1] + 20, '{b}，M 在这里', 'tl', 'end');
  // 标注三个 axis
  const a1 = P(0, 0, 0.5), a2 = P(1, 0.9, 0), a3 = P(1.55, 0, -0.5);
  o += text(a1[0] + 6, a1[1] + 2, 'axis 1：ω₁ = (0, 0, 1)，过 (0, 0, 0)', 't');
  o += text(a2[0] + 6, a2[1] + 2, 'axis 2：ω₂ = (0, −1, 0)', 't') + text(a2[0] + 6, a2[1] + 20, '过 (1, 0, 0)', 't');
  o += text(a3[0] + 6, a3[1] + 4, 'axis 3：ω₃ = (1, 0, 0)', 't') + text(a3[0] + 6, a3[1] + 22, '过 (0, 0, −0.5)', 't');
  const m = P(0.5, 0, 0); o += text(m[0], m[1] - 8, 'L₁ = 1', 'ts', 'middle');
  const m2 = P(1, 0, -0.2); o += text(m2[0] + 8, m2[1] + 4, 'L₂ = 0.5', 'ts');
  o += text(280, 272, '虚线是 joint axis，画的是 home configuration（θ = 0）。', 'ts', 'middle') + text(280, 290, 'PoE 只需要这三条线的方向和线上一点，再加上 {b} 在 home 时的 pose M。', 'ts', 'middle');
  return svg(560, 300, o, '3R spatial open chain 的 home configuration：axis 1 竖直过 origin，axis 2 沿 −y 过 (1,0,0)，axis 3 沿 x 过 (0,0,−0.5)，end-effector frame b 在 (1,0,−0.5)');
}

// ---------- Example 6.1：body twist 是绕一个点转，不朝目标走 straight line ----------
function iktwist() {
  const sx = lin(-0.6, 2.3, 40, 40 + 2.9 * 118), sy = lin(-0.45, 1.75, 270, 270 - 2.2 * 118);
  const arm = (t1, t2, cls) => {
    const a = t1 * D2R, b = (t1 + t2) * D2R, P = [[0, 0], [Math.cos(a), Math.sin(a)], [Math.cos(a) + Math.cos(b), Math.sin(a) + Math.sin(b)]];
    return [path(d(P.map(([x, y]) => [sx(x), sy(y)])), cls), P[2], b];
  };
  let o = line(sx(-0.6), sy(0), sx(2.3), sy(0), 'grid');
  const [a0, p0, h0] = arm(0, 30, 'mute'), [a1, p1, h1] = arm(30, 90, 'ink-b');
  o += a0 + a1 + circle(sx(0), sy(0), 4, 'ink-f');
  const fr = (p, h, cls, lab, dx, dy) => {
    const L = 0.32, c = Math.cos(h), s = Math.sin(h);
    return arrow(sx(p[0]), sy(p[1]), sx(p[0] + L * c), sy(p[1] + L * s), cls) + arrow(sx(p[0]), sy(p[1]), sx(p[0] - L * s), sy(p[1] + L * c), 'mute')
      + text(sx(p[0] + L * c) + dx, sy(p[1] + L * s) + dy, lab, cls === 'ln' ? 'tl' : 'tb');
  };
  o += fr(p0, h0, 'ln', 'x_b', 4, 4) + fr(p1, h1, 'ink', 'x_d', -26, -4);
  const q = [0.683, 0.183];
  o += line(sx(p0[0]), sy(p0[1]), sx(p1[0]), sy(p1[1]), 'dash');
  const r = Math.hypot(p0[0] - q[0], p0[1] - q[1]), g0 = Math.atan2(p0[1] - q[1], p0[0] - q[0]);
  const arc = []; for (let k = 0; k <= 40; k++) { const g = g0 + (Math.PI / 2) * k / 40; arc.push([sx(q[0] + r * Math.cos(g)), sy(q[1] + r * Math.sin(g))]); }
  o += path(d(arc), 'ln');
  o += arrow(arc[38][0], arc[38][1], arc[40][0], arc[40][1], 'ln');
  o += circle(sx(q[0]), sy(q[1]), 4.5, 'ln-f') + text(sx(q[0]) + 8, sy(q[1]) + 18, 'screw center (0.68, 0.18)', 'tl');
  o += text(sx(p0[0]) + 10, sy(p0[1]) + 22, 'θ⁰ = (0°, 30°)', 'ts') + text(sx(p1[0]) - 30, sy(p1[1]) + 34, 'target：(30°, 90°)', 'ts', 'end');
  o += text(430, 70, '彩线：V_b 让 tool', 'ts') + text(430, 86, 'frame 在单位时间', 'ts') + text(430, 102, '里走的路', 'ts');
  o += text(430, 128, '虚线：直接朝目标', 'ts');
  o += text(430, 166, '起步方向在 x_b 上', 'ts') + text(430, 182, '的 component 为正', 'ts');
  return svg(560, 285, o, '2R arm 从初始猜测到目标 pose：body twist 对应绕一个 screw center 转 90 度的 arc，起步时有正的 x_b component，而不是沿直线朝目标走');
}

// ---------- RRT：point robot、圆形 obstacle、straight-line local planner ----------
function rrt() {
  const OB = [[0, 0, 0.13], [-0.28, 0.16, 0.1], [0.24, -0.2, 0.11], [0.2, 0.28, 0.08], [-0.16, -0.3, 0.09], [0.38, 0.06, 0.06], [-0.36, -0.06, 0.06]];
  let seed = 7; const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const segFree = (a, b) => OB.every(([ox, oy, R]) => segDist(ox, oy, a[0], a[1], b[0], b[1]) > R);
  const S = [-0.5, -0.5], Gl = [0.5, 0.5], step = 0.1;
  const nodes = [S], par = [-1]; let goalIdx = -1;
  for (let it = 0; it < 3000 && goalIdx < 0; it++) {
    const smp = rnd() < 0.1 ? Gl : [rnd() - 0.5, rnd() - 0.5];
    let bi = 0, bd = 1e9; nodes.forEach((n, i) => { const dd = Math.hypot(n[0] - smp[0], n[1] - smp[1]); if (dd < bd) { bd = dd; bi = i; } });
    const n = nodes[bi], t = Math.min(1, step / bd), nw = [n[0] + t * (smp[0] - n[0]), n[1] + t * (smp[1] - n[1])];
    if (!segFree(n, nw)) continue;
    nodes.push(nw); par.push(bi);
    if (Math.hypot(nw[0] - Gl[0], nw[1] - Gl[1]) < 1e-9) goalIdx = nodes.length - 1;
  }
  const X = lin(-0.5, 0.5, 30, 270), Y = lin(-0.5, 0.5, 274, 34);
  let o = rect(30, 34, 240, 240, 'frame');
  for (const [ox, oy, R] of OB) o += circle(X(ox), Y(oy), R * 240, 'band-n');
  for (let i = 1; i < nodes.length; i++) { const a = nodes[par[i]], b = nodes[i]; o += line(X(a[0]), Y(a[1]), X(b[0]), Y(b[1]), 'mute'); }
  const pathPts = []; for (let k = goalIdx; k >= 0; k = par[k]) pathPts.push([X(nodes[k][0]), Y(nodes[k][1])]);
  o += path(d(pathPts), 'ln');
  o += circle(X(-0.5), Y(-0.5), 5, 'ink-f') + circle(X(0.5), Y(0.5), 5, 'ln-f');
  o += text(X(-0.5) + 6, Y(-0.5) + 20, 'start', 'tb') + text(X(0.5) + 6, Y(0.5) - 8, 'goal', 'tl');
  const tx = 296;
  o += text(tx, 50, `这一次：${nodes.length} 个 node`, 'tb');
  o += text(tx, 78, '每一轮：', 't');
  const L = ['1. 取 sample（10% 的时候取 goal）', '2. 找 tree 里最近的 node', '3. 朝 sample 走 d = 0.1', '4. 这段 segment 不碰 obstacle', '    才把新 node 加进 tree', '5. 新 node 就是 goal：结束'];
  L.forEach((s, i) => { o += text(tx, 100 + i * 21, s, 'ts'); });
  o += text(tx, 240, '灰线是整棵 tree，彩线是', 'ts') + text(tx, 258, '从 goal 沿 parent 回溯的 path', 'ts');
  return svg(560, 302, o, `RRT 在有七个圆形 obstacle 的方形 C-space 里从左下角长到右上角，一共 ${nodes.length} 个 node；彩线是找到的 path`);
}

// ---------- velocity-controlled joint 的 PI error response ----------
function pi() {
  const Kp = 20, T = 0.8;
  const sim = (Ki) => { const pts = []; let e = 1, de = -Kp; const h = 1e-4; for (let k = 0; k <= T / h; k++) { if (k % 20 === 0) pts.push([k * h, e]); const dde = -Kp * de - Ki * e; de += dde * h; e += de * h; } return pts; };
  const sx = lin(0, T, 60, 385), sy = lin(-0.4, 1.05, 250, 30);
  let o = axes({ sx, sy, x0: 0, x1: T, y0: -0.4, y1: 1.05, xt: [0, 0.2, 0.4, 0.6, 0.8], yt: [[-0.3, '−0.3'], [0, '0'], [0.5, '0.5'], [1, '1']], grid: true });
  o += line(sx(0), sy(0), sx(T), sy(0), 'axis') + text(385, 284, 't（s）', 'ts', 'end') + text(56, 22, 'θₑ（从 θₑ(0) = 1 出发）', 'ts');
  const cases = [[0, 'dash', 'Kᵢ = 0（只有 P）'], [44.4, 'mute', 'Kᵢ = 44.4，ζ = 1.5'], [100, 'ink', 'Kᵢ = 100，ζ = 1'], [400, 'ln', 'Kᵢ = 400，ζ = 0.5']];
  cases.forEach(([Ki, cls, lab], i) => {
    o += path(d(sim(Ki).map(([t, e]) => [sx(t), sy(e)])), cls);
    o += line(398, 70 + i * 26, 420, 70 + i * 26, cls) + text(425, 74 + i * 26, lab, 'ts');
  });
  o += text(398, 44, 'Kₚ = 20', 'tb');
  o += text(398, 196, '最低点：', 'ts') + text(398, 214, 'ζ = 1.5：−0.075', 'ts') + text(398, 232, 'ζ = 1：−0.135', 'ts') + text(398, 250, 'ζ = 0.5：−0.298', 'ts');
  return svg(560, 300, o, 'Kp 等于 20 时，Ki 取 0、44.4、100、400 的 error response；只有 P 时单调衰减，加了 I 之后即使 zeta 大于等于 1 也会越过零');
}

// ---------- 同一对 pose 的两种 path：screw path 与 decoupled（Cartesian）path ----------
function paths() {
  let o = '';
  const panel = (x0, title, posFn, note) => {
    const X = lin(-0.25, 1.25, x0, x0 + 240), Y = lin(-0.4, 0.4, 175, 175 - 0.8 * 160);
    o += line(X(-0.25), Y(0), X(1.25), Y(0), 'grid');
    const tr = []; for (let k = 0; k <= 60; k++) { const p = posFn(k / 60); tr.push([X(p[0]), Y(p[1])]); }
    o += path(d(tr), 'ln-dash');
    for (const s of [0, 0.25, 0.5, 0.75, 1]) {
      const p = posFn(s), h = (Math.PI / 2) * s, L = 0.17;
      o += arrow(X(p[0]), Y(p[1]), X(p[0] + L * Math.cos(h)), Y(p[1] + L * Math.sin(h)), 'ink') + arrow(X(p[0]), Y(p[1]), X(p[0] - L * Math.sin(h)), Y(p[1] + L * Math.cos(h)), 'mute') + circle(X(p[0]), Y(p[1]), 3, 'ink-f');
    }
    const m = posFn(0.5); o += text(X(m[0]), Y(m[1]) + 22, `s = 0.5：(${m[0].toFixed(2)}, ${m[1].toFixed(2)})`, 'ts', 'middle');
    o += text(x0 + 120, 22, title, 'tb', 'middle') + text(x0 + 120, 204, note, 'ts', 'middle');
    o += text(X(0) - 6, Y(0) + 4, 'start', 'ts', 'end') + text(X(1) + 6, Y(1) - 4, '', 'ts');
  };
  const scr = (s) => { const a = (Math.PI / 2) * s, q = [0.5, 0.5]; return [q[0] + Math.cos(a) * (0 - q[0]) - Math.sin(a) * (0 - q[1]), q[1] + Math.sin(a) * (0 - q[0]) + Math.cos(a) * (0 - q[1])]; };
  panel(25, 'ScrewTrajectory', scr, '绕 (0.5, 0.5) 转，origin 走 arc');
  panel(295, 'CartesianTrajectory', (s) => [s, 0], 'position 走 straight line，rotation 单独 interpolate');
  o += text(280, 230, '从 origin、朝向 0° 到 (1, 0)、朝向 90°，s = 0, 0.25, 0.5, 0.75, 1 处的 frame（黑箭头是 x 轴）', 'ts', 'middle');
  return svg(560, 240, o, '同样从原点朝向 0 度到 (1, 0) 朝向 90 度：screw path 的 origin 沿 arc 走到最低 y 等于负 0.207，Cartesian path 的 origin 走直线，两者 rotation 相同');
}

// ---------- form closure：同样四个 contact，位置不同 ----------
function closure() {
  let o = '';
  const panel = (x0, title, cs, free, note) => {
    const X = lin(0, 1, x0 + 40, x0 + 190), Y = lin(0, 1, 250, 100);
    o += rect(X(0), Y(1), 150, 150, 'ink-s paper-f') + rect(X(0), Y(1), 150, 150, 'wash');
    for (const [p, n] of cs) o += line(X(p[0] - 0.4 * n[0]), Y(p[1] - 0.4 * n[1]), X(p[0] + 1.3 * n[0]), Y(p[1] + 1.3 * n[1]), 'grid');
    for (const [p, n] of cs) {
      const a = [p[0] - 0.32 * n[0], p[1] - 0.32 * n[1]];
      o += arrow(X(a[0]), Y(a[1]), X(p[0]), Y(p[1]), 'ln') + circle(X(p[0]), Y(p[1]), 3, 'ink-f');
    }
    if (free) {
      const c = [X(0.5), Y(0.5)], r = 26, arc = [];
      for (let k = 0; k <= 30; k++) { const g = -0.3 + 4.3 * k / 30; arc.push([c[0] + r * Math.cos(g), c[1] - r * Math.sin(g)]); }
      o += path(d(arc), 'ink') + arrow(arc[28][0], arc[28][1], arc[30][0], arc[30][1], 'ink') + circle(c[0], c[1], 3, 'ink-f');
    }
    o += text(x0 + 115, 30, title, 'tb', 'middle') + text(x0 + 115, 332, note[0], 'ts', 'middle') + text(x0 + 115, 350, note[1], 'ts', 'middle');
  };
  panel(10, '(a) form closure', [[[0, 0.25], [1, 0]], [[1, 0.75], [-1, 0]], [[0.25, 0], [0, 1]], [[0.75, 1], [0, -1]]], false, ['两条 normal 挡逆时针转，两条挡顺时针转', 'rank F = 3，LP 解得 k = (1, 1, 1, 1)']);
  panel(290, '(b) 不是 form closure', [[[0, 0.5], [1, 0]], [[1, 0.5], [-1, 0]], [[0.5, 0], [0, 1]], [[0.5, 1], [0, -1]]], true, ['四条 normal 都过 center，绕 center 转不受阻挡', 'rank F = 2']);
  return svg(560, 360, o, '两个 unit square 各有四个 point contact。左边的 contact normal 两两错开，能挡住两个方向的转动；右边四条 normal 都过 center，body 可以绕 center 转');
}

// ---------- 两指夹 triangle：friction cone 与 line of sight ----------
function cone() {
  let o = '';
  const s3 = Math.sqrt(3), h = 0.3;
  const panel = (x0, mu, ok) => {
    const X = lin(0, 1, x0 + 30, x0 + 230), Y = lin(0, 0.866, 230, 230 - 0.866 * 200);
    o += poly([[X(0), Y(0)], [X(1), Y(0)], [X(0.5), Y(0.866)]], 'ink-s paper-f');
    o += poly([[X(0), Y(0)], [X(1), Y(0)], [X(0.5), Y(0.866)]], 'wash');
    const pL = [h / s3, h], pR = [1 - h / s3, h], nL = [s3 / 2, -0.5], nR = [-s3 / 2, -0.5], al = Math.atan(mu), R = 0.42;
    for (const [p, n] of [[pL, nL], [pR, nR]]) {
      const b = Math.atan2(n[1], n[0]);
      const e1 = [p[0] + R * Math.cos(b + al), p[1] + R * Math.sin(b + al)], e2 = [p[0] + R * Math.cos(b - al), p[1] + R * Math.sin(b - al)];
      o += poly([[X(p[0]), Y(p[1])], [X(e1[0]), Y(e1[1])], [X(e2[0]), Y(e2[1])]], 'band-p');
      o += line(X(p[0]), Y(p[1]), X(p[0] + R * n[0]), Y(p[1] + R * n[1]), 'ink');
      o += circle(X(p[0]), Y(p[1]), 3.5, 'ink-f');
    }
    o += line(X(pL[0]) - 20, Y(h), X(pR[0]) + 20, Y(h), 'dash');
    o += text(x0 + 130, 22, `μ = ${mu}：cone half-angle ${(al * R2D).toFixed(1)}°`, 'tb', 'middle');
    o += text(x0 + 130, 256, ok ? 'line of sight 在两个 cone 里：force closure' : 'line of sight 和 normal 差 30°，在 cone 外', 'ts', 'middle');
  };
  panel(0, 0.25, false);
  panel(280, 1, true);
  o += text(280, 282, '黑线是 contact normal，彩色扇形是 friction cone，虚线连着两个 contact。临界值 μ = tan 30° ≈ 0.577。', 'ts', 'middle');
  return svg(560, 292, o, '两根 finger 夹住 equilateral triangle 的两条边。mu 等于 0.25 时 friction cone 的 half-angle 只有 14 度，两个 contact 的连线落在 cone 外；mu 等于 1 时 half-angle 45 度，连线落在两个 cone 内');
}

// ---------- youBot 的 mecanum chassis ----------
function mecanum() {
  const l = 0.235, w = 0.15, sc = 440;
  const X = (x) => 175 + sc * x, Y = (y) => 140 - sc * y;
  let o = rect(X(-l - 0.03), Y(w - 0.035), sc * 2 * (l + 0.03), sc * 2 * (w - 0.035), 'wash2');
  const wheels = [[l, w, -45, 1], [l, -w, 45, 2], [-l, -w, -45, 3], [-l, w, 45, 4]];
  for (const [x, y, g, k] of wheels) {
    const ww = 0.1, wh = 0.05;
    o += rect(X(x - ww / 2), Y(y + wh / 2), sc * ww, sc * wh, 'paper', 4);
    for (let t = -2; t <= 2; t++) {
      const cx = x + t * 0.018, gg = g * D2R, L = 0.022;
      o += line(X(cx - L * Math.cos(gg)), Y(y - L * Math.sin(gg)), X(cx + L * Math.cos(gg)), Y(y + L * Math.sin(gg)), 'ink');
    }
    o += text(X(x), Y(y) + (y > 0 ? -22 : 34), String(k), 'tb', 'middle');
  }
  o += arrow(X(0), Y(0), X(0.12), Y(0), 'ln') + arrow(X(0), Y(0), X(0), Y(0.09), 'ln') + text(X(0.12) + 4, Y(0) + 4, 'x_b', 'tl') + text(X(0) + 4, Y(0.09) - 4, 'y_b', 'tl') + circle(X(0), Y(0), 3, 'ln-f');
  o += line(X(0), Y(-w - 0.1), X(l), Y(-w - 0.1), 'mute') + text(X(l / 2), Y(-w - 0.1) + 16, 'l = 0.235', 'ts', 'middle');
  o += line(X(-0.13), Y(0), X(-0.13), Y(w - 0.035), 'mute') + text(X(-0.13) + 6, Y(0.05) + 4, 'w = 0.15', 'ts');
  const tx = 330;
  o += text(tx, 40, 'wheel 朝 +x_b 转为正（r = 0.0475）', 'ts');
  o += text(tx, 70, 'chassis 的动作', 'tb') + text(tx + 150, 70, 'u₁ u₂ u₃ u₄', 'tb');
  const rows = [['前进 +x_b', '+  +  +  +'], ['横移 +y_b', '−  +  −  +'], ['逆时针转', '−  +  +  −']];
  rows.forEach(([a, b], i) => { o += text(tx, 96 + i * 24, a, 't') + text(tx + 150, 96 + i * 24, b, 't'); });
  o += text(tx, 190, '短线是贴地 roller 的 axis 方向：', 'ts') + text(tx, 208, 'contact point 沿这个方向不能滑，', 'ts') + text(tx, 226, '垂直于它的方向可以自由滑动。', 'ts');
  return svg(560, 270, o, 'youBot chassis 的俯视图：四个 mecanum wheel 编号 1 到 4，roller 的 axis 与 driving direction 成正负 45 度；右边列出三种基本动作时四个车轮转动的 sign');
}

// ---------- capstone：Xerr 的六个 component（自己写的 kinematic simulation） ----------
function capxerr() {
  let o = '';
  const panel = (y0, data, title, note) => {
    const sx = lin(0, 3, 60, 520), sy = lin(-0.7, 0.4, y0 + 120, y0);
    o += axes({ sx, sy, x0: 0, x1: 3, y0: -0.7, y1: 0.4, xt: [0, 1, 2, 3], yt: [[-0.6, '−0.6'], [-0.3, '−0.3'], [0, '0'], [0.3, '0.3']], grid: true }) + line(sx(0), sy(0), sx(3), sy(0), 'axis');
    data.forEach((col, j) => { o += path(d(col.map((v, i) => [sx(i * 0.03), sy(v)])), j < 3 ? 'ink' : 'ln'); });
    o += text(60, y0 - 10, title, 'tb') + text(520, y0 - 10, note, 'ts', 'end');
  };
  panel(40, XERR.best, 'Kₚ = 1.5 I，Kᵢ = 0', '没有 overshoot，2.8 s 时六个 component 都小于 0.01');
  panel(232, XERR.over, 'Kₚ = 2 I，Kᵢ = 6 I', '越过零约 36%，再回来');
  o += text(520, 400, 't（s）', 'ts', 'end');
  o += line(60, 412, 84, 412, 'ink') + text(90, 416, 'angular component（rad）', 'ts') + line(270, 412, 294, 412, 'ln') + text(300, 416, 'linear component（m）', 'ts');
  return svg(560, 424, o, 'Capstone 的 Xerr 六个 component 随时间的变化：上图 Kp 1.5、Ki 0，单调衰减；下图 Kp 2、Ki 6，越过零之后回来');
}

export default {
  'mr-pillar': pillar,
  'mr-cspace': cspace,
  'mr-screw': screw,
  'mr-poe': poe,
  'mr-iktwist': iktwist,
  'mr-rrt': rrt,
  'mr-pi': pi,
  'mr-paths': paths,
  'mr-closure': closure,
  'mr-cone': cone,
  'mr-mecanum': mecanum,
  'mr-capxerr': capxerr,
};
