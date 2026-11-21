import { svg, svgA, anim, ashow, f1, esc, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

// 动图小工具：durs 是每一帧停留的秒数 → keyTimes；on[k] 决定第 k 帧显示不显示
const frames = (durs) => { const T = durs.reduce((a, b) => a + b, 0); let acc = 0; const kt = durs.map((v) => { const t = acc / T; acc += v; return t; }); return { kt, T }; };
const sText = (x, y, s, cls, anchor, on, F) => `<text x="${f1(x)}" y="${f1(y)}" class="${cls}" text-anchor="${anchor}">${s}${ashow(on, F.kt, F.T)}</text>`;
const sPath = (dd, cls, on, F) => `<path d="${dd}" class="${cls}">${ashow(on, F.kt, F.T)}</path>`;
const sRect = (x, y, w, h, cls, rx, on, F) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${rx}" class="${cls}">${ashow(on, F.kt, F.T)}</rect>`;

const dot = (x, y) => circle(x, y, 2.6, 'ink-f');
const wire = (pts, cls = 'ink') => path(d(pts), cls);

// 4-bit number wheel：同一圈 pattern，unsigned 和 two's complement 只是断口位置不同
function wheel() {
  const C = [170, 172], R = 96;
  const P = (k, r) => { const a = (-90 + k * 22.5) * Math.PI / 180; return [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a)]; };
  let o = circle(C[0], C[1], R, 'frame');
  for (let k = 0; k < 16; k++) {
    const p = P(k, R), q = P(k, R + 24), s = P(k, R - 22), u = P(k, R - 46);
    o += circle(p[0], p[1], 3.2, k >= 8 ? 'ln-f' : 'ink-f');
    o += text(q[0], q[1] + 4, k.toString(2).padStart(4, '0'), 't', 'middle');
    o += text(s[0], s[1] + 4, String(k < 8 ? k : k - 16).replace('-', '−'), k >= 8 ? 'tl' : 'tb', 'middle');
    o += text(u[0], u[1] + 4, String(k), 'ts', 'middle');
  }
  // 两个断口
  const seam = (k, r0, r1, cls) => { const a = P(k + 0.5, r0), b = P(k + 0.5, r1); return line(a[0], a[1], b[0], b[1], cls); };
  o += seam(15, R - 58, R - 35, 'ink-b') + seam(7, R - 34, R - 9, 'ln');
  // 顺时针 +1
  const arc = [];
  for (let i = 0; i <= 20; i++) arc.push(P(1.15 + (1.7 * i) / 20, R + 46));
  o += path(d(arc.slice(0, 20)), 'mute') + arrow(arc[18][0], arc[18][1], arc[20][0], arc[20][1], 'mute');
  o += text(P(2.6, R + 50)[0] + 6, P(2.6, R + 50)[1] - 6, '+1', 'ts');
  const X = 348;
  o += text(X, 66, '每个点是一个 4-bit pattern', 'tb');
  o += text(X, 86, '外圈：pattern 本身', 'ts') + text(X, 103, '中圈粗体：读成 two’s complement', 'ts') + text(X, 120, '内圈灰字：读成 unsigned', 'ts');
  o += text(X, 152, '加 1 就是顺时针走一格，', 't') + text(X, 170, '两种读法走的是同一格。', 't');
  o += text(X, 203, '内圈顶上的短杠：unsigned 的断口', 't') + text(X, 220, '15 再加 1 回到 0', 'ts');
  o += text(X, 251, '中圈底下的短杠：', 't') + text(X, 268, 'two’s complement 的断口', 't') + text(X, 285, '7 再加 1 变成 −8，这就是 overflow', 'ts');
  o += text(X, 316, '左半圈：MSB 是 1，读出来是负数', 'ts');
  return svg(560, 340, o, '4-bit 的 16 个 pattern 排成一圈；同一圈既可读成 unsigned 的 0 到 15，也可读成 two’s complement 的 −8 到 7，区别只在断口的位置');
}

// IEEE 754 single precision：−6.625 的 32 个 bit
function float() {
  const bits = '11000000110101000000000000000000';
  const x0 = 40, w = 15, y = 62, h = 26;
  let o = '';
  for (let i = 0; i < 32; i++) {
    const cls = i === 0 ? 'solid' : i < 9 ? 'wash-strong' : 'wash';
    o += rect(x0 + i * w, y, w, h, cls) + rect(x0 + i * w, y, w, h, 'frame');
    o += text(x0 + i * w + w / 2, y + 18, bits[i], i === 0 ? 'tw' : 't', 'middle');
  }
  const br = (a, b, yy, up) => { const xa = x0 + a * w + 2, xb = x0 + b * w - 2; return line(xa, yy, xb, yy, 'mute') + line(xa, yy, xa, yy + (up ? 5 : -5), 'mute') + line(xb, yy, xb, yy + (up ? 5 : -5), 'mute'); };
  o += text(x0 + w / 2, 30, 'sign', 'tb', 'middle') + text(x0 + w / 2, 46, '1 bit', 'ts', 'middle');
  o += br(1, 9, 50, true) + text(x0 + 5 * w, 30, 'exponent', 'tb', 'middle') + text(x0 + 5 * w, 46, '8 bits', 'ts', 'middle');
  o += br(9, 32, 50, true) + text(x0 + 20.5 * w, 30, 'fraction', 'tb', 'middle') + text(x0 + 20.5 * w, 46, '23 bits', 'ts', 'middle');
  // 每 4 bit 一个 hex digit
  const hex = 'C0D40000';
  for (let i = 0; i < 8; i++) o += br(i * 4, i * 4 + 4, 100, false) + text(x0 + (i * 4 + 2) * w, 116, hex[i], 'ts', 'middle');
  o += text(x0 + 32 * w + 6, 116, 'hex', 'ts');
  o += text(x0, 150, '1', 'tb') + text(x0 + 14, 150, '→ 负数', 't');
  o += text(x0 + 76, 150, '1000 0001 = 129', 'tb') + text(x0 + 76, 168, '→ 129 − 127 = 2', 't');
  o += text(x0 + 236, 150, '10101 000…0', 'tb') + text(x0 + 236, 168, '→ 前面补上没存的 1：1.10101', 't');
  o += text(280, 204, 'value = −1.10101₂ × 2² = −110.101₂ = −6.625', 'tl', 'middle');
  return svg(560, 220, o, '−6.625 的 IEEE 754 single precision 表示：1 个 sign bit、8 个 exponent bit、23 个 fraction bit，合起来是 hex 的 C0D40000');
}

// pointer 与 array：四条 statement 之后 memory 的样子
function ptr() {
  const x0 = 96, w = 72, y = 92, h = 40;
  const vals = ['10', '21', '50', '40', '50'], changed = [false, true, true, false, false];
  let o = text(x0 - 12, y + 25, 'A', 'tb', 'end');
  for (let i = 0; i < 5; i++) {
    o += rect(x0 + i * w, y, w, h, changed[i] ? 'wash' : 'paper-f') + rect(x0 + i * w, y, w, h, 'frame');
    o += text(x0 + i * w + w / 2, y + 26, vals[i], 'tb', 'middle');
    o += text(x0 + i * w + w / 2, y - 26, `A[${i}]`, 't', 'middle');
    o += text(x0 + i * w + w / 2, y - 9, i === 0 ? '0x10010000' : '…' + (4 * i).toString(16).toUpperCase().padStart(4, '0'), 'ts', 'middle');
  }
  o += text(x0 + 5 * w + 8, y + 25, '每格 4 bytes', 'ts');
  // p
  const py = 198;
  o += rect(x0 + w - 8, py, w + 16, 34, 'paper', 6) + text(x0 + w + w / 2, py + 22, '0x10010004', 't', 'middle') + text(x0 + w - 16, py + 22, 'p', 'tl', 'end');
  o += arrow(x0 + w + w / 2, py - 2, x0 + w + w / 2, y + h + 4, 'ln');
  o += text(x0 + w + w / 2 - 10, py - 22, '*p', 'tl', 'end');
  // p + 2
  const bx = x0 + 3 * w + w / 2;
  o += path(`M${x0 + 2 * w + 10} ${py + 17}L${bx - 8} ${py + 17}Q${bx} ${py + 17} ${bx} ${py + 9}L${bx} ${y + h + 12}`, 'dash') + arrow(bx, y + h + 14, bx, y + h + 4, 'ink');
  o += text(bx + 10, py + 6, 'p + 2', 'tb') + text(bx + 10, py + 23, 'address 加 2 × 4 = 8', 'ts');
  o += text(280, 266, '浅色的两格是被改过的：(*p)++ 把 A[1] 从 20 改成 21，p[1] = x + z 把 A[2] 改成 50', 'ts', 'middle');
  return svg(560, 280, o, 'Array A 的五个 element 在 memory 里连续排列，每个占 4 bytes；pointer p 里存的是 A[1] 的 address，p 加 2 指向 A[3]');
}

// MIPS 的三种 instruction format，各配 loop 里的一条 instruction
function formats() {
  const x0 = 96, bw = 14;
  let o = '';
  const row = (y, title, asm, fields) => {
    o += text(14, y + 22, title, 'tb') + text(14, y + 40, 'format', 'ts');
    let b = 0;
    for (const [name, n, val, dec, cls] of fields) {
      const x = x0 + b * bw, ww = n * bw;
      o += rect(x, y, ww, 46, cls || 'paper-f') + rect(x, y, ww, 46, 'frame');
      o += text(x + ww / 2, y + 16, name, 'ts', 'middle') + text(x + ww / 2, y + 34, val, n > 10 ? 't' : 'ts tb', 'middle');
      o += text(x + ww / 2, y + 62, dec, 'ts', 'middle');
      b += n;
    }
    o += text(x0, y - 8, asm, 'tl');
  };
  // 顶部 bit 位置
  for (const [b, s] of [[0, '31'], [6, '26 25'], [11, '21 20'], [16, '16 15'], [21, '11 10'], [26, '6 5'], [32, '0']]) o += text(x0 + b * bw, 16, s, 'ts', b === 0 ? 'start' : b === 32 ? 'end' : 'middle');
  row(50, 'R', 'add $s1, $s1, $t3', [['opcode', 6, '000000', '0', 'wash'], ['rs', 5, '10001', '17 = $s1'], ['rt', 5, '01011', '11 = $t3'], ['rd', 5, '10001', '17 = $s1'], ['shamt', 5, '00000', '0'], ['funct', 6, '100000', '32', 'wash']]);
  row(152, 'I', 'lw $t3, 0($t2)', [['opcode', 6, '100011', '35', 'wash'], ['rs', 5, '01010', '10 = $t2'], ['rt', 5, '01011', '11 = $t3'], ['immediate', 16, '0000 0000 0000 0000', '0']]);
  row(254, 'J', 'j loop', [['opcode', 6, '000010', '2', 'wash'], ['target', 26, '00 0001 0000 0000 0000 0000 0010', '0x0100002 = 0x00400008 ÷ 4']]);
  o += text(280, 338, '三种 format 的 opcode 都在最高 6 位；rs、rt 在 R 和 I 里位置相同，', 'ts', 'middle');
  o += text(280, 355, 'hardware 不用等 opcode decode 完就可以先去读 register', 'ts', 'middle');
  return svg(560, 368, o, 'MIPS 的 R、I、J 三种 instruction format 的 field 划分，以及 add、lw、j 三条 instruction 各自的 32-bit encoding');
}

// Single-cycle datapath（简化）：control signal 用彩色小字标在它控制的元件旁
function datapath() {
  let o = '';
  const box = (x, y, w, h, lines, cls = 'paper') => { let s = rect(x, y, w, h, cls, 4); lines.forEach((t, i) => { s += text(x + w / 2, y + 16 + i * 13, t, 'ts', 'middle'); }); return s; };
  const mux = (x, y, h, a, b) => rect(x, y, 14, h, 'paper', 7) + text(x + 7, y + 14, a, 'ts', 'middle') + text(x + 7, y + h - 5, b, 'ts', 'middle');
  const ctl = (x, y, s, anchor = 'middle') => text(x, y, s, 'ts tl', anchor);
  // ---- next-PC logic（上面一排）
  o += wire([[46, 200], [46, 38], [60, 38]]) + dot(46, 200);
  o += text(77, 84, '4', 'ts', 'middle') + line(77, 72, 77, 64, 'ink');
  o += box(60, 28, 34, 36, ['Add']);
  o += wire([[94, 44], [440, 44]]) + dot(352, 44) + wire([[352, 44], [352, 74], [362, 74]]);
  o += box(362, 62, 36, 46, ['Add']);
  o += text(228, 38, 'PC + 4', 'ts', 'middle');
  o += wire([[398, 85], [440, 85]]);
  o += mux(440, 32, 64, '0', '1');
  o += wire([[454, 64], [468, 64], [468, 12], [6, 12], [6, 200], [14, 200]]) + poly([[14, 200], [8, 197], [8, 203]], 'ink-f');
  o += ctl(476, 46, 'PCSrc', 'start') + text(476, 61, '= Branch', 'ts') + text(476, 75, 'AND Zero', 'ts');
  // ---- PC, instruction memory
  o += rect(14, 170, 24, 60, 'paper', 4) + text(26, 204, 'PC', 'ts', 'middle');
  o += wire([[38, 200], [54, 200]]);
  o += box(54, 150, 72, 110, ['Instruction', 'memory']);
  o += text(58, 204, 'Addr', 'ts');
  o += wire([[126, 200], [140, 200]]) + line(140, 78, 140, 314, 'ink-b');
  // control
  o += wire([[140, 78], [150, 78]]) + rect(150, 66, 54, 24, 'wash', 12) + rect(150, 66, 54, 24, 'ink', 12) + text(177, 82, 'Control', 'ts tb', 'middle');
  o += text(135, 82, 'opcode', 'ts', 'end') + text(210, 82, '输出粗体字标的 signal', 'ts');
  // ---- register file
  o += rect(198, 140, 84, 144, 'paper', 4) + text(240, 156, 'Register file', 'ts tb', 'middle');
  o += wire([[140, 168], [198, 168]]) + text(150, 164, 'rs', 'ts') + text(202, 172, 'RR1', 'ts');
  o += wire([[140, 190], [198, 190]]) + text(164, 186, 'rt', 'ts') + text(202, 194, 'RR2', 'ts') + dot(158, 190);
  o += wire([[158, 190], [158, 224], [172, 224]]);
  o += wire([[140, 244], [172, 244]]) + text(150, 240, 'rd', 'ts');
  o += mux(172, 212, 44, '0', '1') + wire([[186, 234], [198, 234]]) + text(202, 238, 'WR', 'ts');
  o += ctl(186, 274, 'RegDst', 'end');
  o += text(202, 268, 'WD', 'ts') + text(278, 182, 'RD1', 'ts', 'end') + text(278, 224, 'RD2', 'ts', 'end');
  o += ctl(240, 134, 'RegWrite');
  // ---- sign extend
  o += wire([[140, 314], [222, 314]]) + text(150, 310, 'imm', 'ts');
  o += rect(222, 302, 60, 24, 'paper', 12) + text(252, 318, 'Sign ext', 'ts', 'middle');
  o += wire([[282, 314], [300, 314], [300, 96], [310, 96]]) + dot(300, 244) + wire([[300, 244], [322, 244]]);
  o += rect(310, 86, 30, 20, 'paper', 10) + text(325, 100, '<< 2', 'ts', 'middle') + wire([[340, 96], [362, 96]]);
  // ---- ALU
  o += wire([[282, 178], [352, 178]]);
  o += wire([[282, 220], [322, 220]]) + dot(312, 220) + wire([[312, 220], [312, 282], [440, 282]]);
  o += mux(322, 208, 48, '0', '1') + wire([[336, 232], [352, 232]]);
  o += ctl(346, 202, 'ALUSrc', 'end');
  o += poly([[352, 158], [402, 183], [402, 227], [352, 252], [352, 214], [362, 205], [352, 196]], 'paper') + text(384, 209, 'ALU', 'ts tb', 'middle');
  o += ctl(377, 269, 'ALUcontrol');
  o += wire([[402, 192], [412, 192]]) + text(404, 185, 'Zero', 'ts');
  o += wire([[402, 212], [440, 212]]) + dot(431, 212) + wire([[431, 212], [431, 138], [517, 138], [517, 236], [522, 236]]);
  // ---- data memory
  o += rect(440, 170, 72, 126, 'paper', 4) + text(476, 186, 'Data memory', 'ts', 'middle');
  o += text(444, 216, 'Address', 'ts') + text(444, 286, 'Write data', 'ts') + text(508, 254, 'Read data', 'ts', 'end');
  o += ctl(474, 163, 'MemWrite') + ctl(478, 312, 'MemRead', 'end');
  o += wire([[512, 258], [522, 258]]);
  o += mux(522, 222, 50, '0', '1');
  o += ctl(548, 312, 'MemToReg', 'end');
  // ---- write back
  o += wire([[536, 247], [553, 247], [553, 352], [190, 352], [190, 264], [198, 264]]) + poly([[198, 264], [192, 261], [192, 267]], 'ink-f');
  o += text(372, 346, 'write back', 'ts', 'middle');
  return svg(560, 366, o, 'Simplified 的 MIPS single-cycle datapath：PC、instruction memory、register file、ALU、data memory 从左到右排开，四个 MUX 分别由 RegDst、ALUSrc、MemToReg、PCSrc 控制');
}

// K-map：3-variable 的 Cout 和 4-variable 的 segment e
function kmap() {
  const S = 38;
  let o = '';
  const gray = ['00', '01', '11', '10'];
  const grid = (x0, y0, rows, rowLab, cells, rowVar, colVar) => {
    for (let r = 0; r < rows; r++) for (let c = 0; c < 4; c++) {
      const v = cells[r][c];
      o += rect(x0 + c * S, y0 + r * S, S, S, 'frame') + text(x0 + c * S + S / 2, y0 + r * S + S / 2 + 5, v, v === '1' ? 'tb' : 'ts', 'middle');
    }
    for (let c = 0; c < 4; c++) o += text(x0 + c * S + S / 2, y0 - 8, gray[c], 'ts', 'middle');
    for (let r = 0; r < rows; r++) o += text(x0 - 8, y0 + r * S + S / 2 + 4, rowLab[r], 'ts', 'end');
    o += text(x0 + 2 * S, y0 - 26, colVar, 't', 'middle') + text(x0 - 34, y0 + (rows * S) / 2 + 4, rowVar, 't', 'end');
  };
  // ---- 左：Cout(A, B, Cin) = Σm(3,5,6,7)
  const L = [70, 96];
  grid(L[0], L[1], 2, ['0', '1'], [['0', '0', '1', '0'], ['0', '1', '1', '1']], it('A'), it('B') + ' ' + it('C') + '<tspan class="sub" dy="3">in</tspan>');
  o += rect(L[0] + 2 * S + 5, L[1] + 5, S - 10, 2 * S - 10, 'ln', 9);
  o += rect(L[0] + S + 4, L[1] + S + 8, 2 * S - 8, S - 16, 'ink', 9);
  o += rect(L[0] + 2 * S + 9, L[1] + S + 3, 2 * S - 12, S - 6, 'dash', 9);
  o += text(L[0] + 2 * S, 40, 'Full adder 的 carry out', 'tb', 'middle');
  o += text(L[0] + 2 * S, L[1] + 2 * S + 26, 'C' + '<tspan class="sub" dy="3">out</tspan><tspan dy="-3"> = BC</tspan><tspan class="sub" dy="3">in</tspan><tspan dy="-3"> + AC</tspan><tspan class="sub" dy="3">in</tspan><tspan dy="-3"> + AB</tspan>', 'tl', 'middle');
  o += text(L[0] + 2 * S, L[1] + 2 * S + 46, '三个 group 都盖住 m₇，group 可以重叠', 'ts', 'middle');
  // ---- 右：segment e = Σm(0,2,6,8) + d(10..15)
  const Rg = [346, 96];
  grid(Rg[0], Rg[1], 4, gray, [['1', '0', '0', '1'], ['0', '0', '0', '1'], ['X', 'X', 'X', 'X'], ['1', '0', 'X', 'X']], it('A') + it('B'), it('C') + it('D'));
  const [x0, y0] = Rg, x4 = x0 + 4 * S, y4 = y0 + 4 * S, k = 29;
  // 四个角：B'D'
  o += path(`M${x0} ${y0 + k}L${x0 + k - 7} ${y0 + k}Q${x0 + k} ${y0 + k} ${x0 + k} ${y0 + k - 7}L${x0 + k} ${y0}`, 'ln');
  o += path(`M${x4} ${y0 + k}L${x4 - k + 7} ${y0 + k}Q${x4 - k} ${y0 + k} ${x4 - k} ${y0 + k - 7}L${x4 - k} ${y0}`, 'ln');
  o += path(`M${x0} ${y4 - k}L${x0 + k - 7} ${y4 - k}Q${x0 + k} ${y4 - k} ${x0 + k} ${y4 - k + 7}L${x0 + k} ${y4}`, 'ln');
  o += path(`M${x4} ${y4 - k}L${x4 - k + 7} ${y4 - k}Q${x4 - k} ${y4 - k} ${x4 - k} ${y4 - k + 7}L${x4 - k} ${y4}`, 'ln');
  // 最右一列：CD'
  o += rect(x0 + 3 * S - 3, y0 + 3, S, 4 * S - 6, 'ink', 9);
  // 下两行的左右两端：AD'（不是 essential）
  const ya = y0 + 2 * S + 4, yb = y4 - 4;
  o += path(`M${x0} ${ya}L${x0 + 28} ${ya}Q${x0 + 35} ${ya} ${x0 + 35} ${ya + 7}L${x0 + 35} ${yb - 7}Q${x0 + 35} ${yb} ${x0 + 28} ${yb}L${x0} ${yb}`, 'dash');
  o += path(`M${x4} ${ya}L${x4 - 28} ${ya}Q${x4 - 35} ${ya} ${x4 - 35} ${ya + 7}L${x4 - 35} ${yb - 7}Q${x4 - 35} ${yb} ${x4 - 28} ${yb}L${x4} ${yb}`, 'dash');
  o += text(x0 + 2 * S, 40, '7-segment display 的 segment e', 'tb', 'middle');
  o += text(x0 + 2 * S, y4 + 26, 'e = B′D′ + CD′', 'tl', 'middle');
  o += line(60, 300, 86, 300, 'ln') + text(92, 304, '粗线：四个角 B′D′（上下、左右都相邻，合成一个 group）', 'ts');
  o += line(60, 318, 86, 318, 'ink') + text(92, 322, '细实线：最右的 column CD′', 'ts');
  o += line(60, 336, 86, 336, 'dash') + text(92, 340, '虚线：AD′，也是 prime implicant，但它盖住的那个 1 已经被 B′D′ 盖了', 'ts');
  return svg(560, 352, o, '两张 K-map：左边是 full adder 的 carry out，三个两格的 group；右边是 segment e，四个角一组、最右一列一组，还有一个不是 essential 的 prime implicant');
}

// 4-bit ripple-carry adder：carry 一级一级传，delay 随位数线性增长
function ripple() {
  let o = '';
  const W = 70, H = 56, y = 96, xs = [440, 320, 200, 80];
  const sub = (s, k) => `${s}<tspan class="sub" dy="3">${k}</tspan><tspan dy="-3">​</tspan>`;
  // 例子：X = 0111，Y = 0001，C0 = 0 → carry 一路是 1
  const X = [1, 1, 1, 0], Y = [1, 0, 0, 0], C = [0];
  const S = [];
  for (let i = 0; i < 4; i++) { const t = X[i] + Y[i] + C[i]; S.push(t & 1); C.push(t >> 1); }
  // 帧：第 0 帧 = 全部稳定（t = 9），然后从 t = 0 一格一格走到 9
  const ts = [9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const F = frames([2.6, 0.9, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.6]);
  const ready = (t0) => ts.map((t) => t >= t0);
  const notReady = (t0) => ts.map((t) => t < t0);
  xs.forEach((x, i) => {
    const sReady = 2 * i + 2, cReady = 2 * i + 3;
    // 正在算：sum 还没稳定时 box 涂浅底
    o += rect(x, y, W, H, 'paper', 6) + sRect(x, y, W, H, 'wash', 6, ts.map((t) => t < sReady), F) + rect(x, y, W, H, 'frame', 6);
    o += text(x + W / 2, y + 24, 'Full adder', 'ts tb', 'middle') + text(x + W / 2, y + 42, 'bit ' + i, 'ts', 'middle');
    o += arrow(x + 20, y - 30, x + 20, y - 2, 'ink') + arrow(x + 50, y - 30, x + 50, y - 2, 'ink');
    o += text(x + 20, y - 36, sub('X', i), 't', 'middle') + text(x + 50, y - 36, sub('Y', i), 't', 'middle');
    o += text(x + 14, y - 12, String(X[i]), 'tl', 'end') + text(x + 56, y - 12, String(Y[i]), 'tl', 'start');
    // sum
    o += sPath(d([[x + W / 2, y + H], [x + W / 2, y + H + 28]]), 'dash', notReady(sReady), F);
    o += `<g>${arrow(x + W / 2, y + H, x + W / 2, y + H + 30, 'ink-b')}${ashow(ready(sReady), F.kt, F.T)}</g>`;
    o += sText(x + W / 2, y + H + 46, sub('S', i) + ' = ?', 'ts', 'middle', notReady(sReady), F);
    o += sText(x + W / 2, y + H + 46, sub('S', i) + ' = ' + S[i], 'tb', 'middle', ready(sReady), F);
    o += sText(x + W / 2, y + H + 64, `${sReady}t`, 'tl', 'middle', ready(sReady), F);
    // carry out 往左
    const xl = i < 3 ? xs[i + 1] + W : x - 46;
    o += sPath(d([[x, y + H / 2], [xl + 2, y + H / 2]]), 'dash', notReady(cReady), F);
    o += `<g>${arrow(x, y + H / 2, xl + 2, y + H / 2, 'ln')}${ashow(ready(cReady), F.kt, F.T)}</g>`;
    o += sText((x + xl) / 2, y + H / 2 - 9, sub('C', i + 1) + ' = ?', 'ts', 'middle', notReady(cReady), F);
    o += sText((x + xl) / 2, y + H / 2 - 9, sub('C', i + 1) + ' = ' + C[i + 1], 't', 'middle', ready(cReady), F);
    o += sText((x + xl) / 2, y + H / 2 + 20, `${cReady}t`, 'tl', 'middle', ready(cReady), F);
  });
  o += arrow(xs[0] + W + 40, y + H / 2, xs[0] + W + 2, y + H / 2, 'ln') + text(xs[0] + W + 24, y + H / 2 - 9, sub('C', 0) + ' = 0', 't', 'middle') + text(xs[0] + W + 24, y + H / 2 + 20, '0', 'tl', 'middle');
  o += text(20, 22, '0111 + 0001：所有 X、Y 和 C₀ 在时刻 0 同时到达（t = 一个 gate 的 delay）', 'ts');
  ts.forEach((t, k) => {
    const on = ts.map((_, j) => j === k);
    if (k === 0 || k === ts.length - 1) return;
    o += sText(540, 44, `时刻 ${t}t`, 'tb', 'end', on, F);
  });
  o += sText(540, 44, '全部稳定：1000', 'tb', 'end', ts.map((_, j) => j === 0 || j === ts.length - 1), F);
  o += text(280, 250, '浅底的 full adder 正在等右边的 carry；虚线和 ? 表示这个 output 还没稳定。', 'ts', 'middle');
  o += text(280, 268, 'Sum 依次在 2t、4t、6t、8t 定下来，最后一个 carry 在 9t。', 'ts', 'middle');
  return svgA(560, 278, o, '动图：0111 加 0001 的 ripple-carry adder，时刻从 0 走到 9 个 gate delay，carry 一级一级往左传，S0 到 S3 依次在 2t、4t、6t、8t 稳定，C4 在 9t 稳定');
}

function fsm() {
  let o = '';
  const R = 28;
  const S = { '00': [120, 70], '01': [250, 70], '10': [185, 180], '11': [380, 180] };
  const edge = (a, b, cls) => {
    const [x1, y1] = S[a], [x2, y2] = S[b];
    const ang = Math.atan2(y2 - y1, x2 - x1);
    return arrow(x1 + (R + 2) * Math.cos(ang), y1 + (R + 2) * Math.sin(ang), x2 - (R + 3) * Math.cos(ang), y2 - (R + 3) * Math.sin(ang), cls);
  };
  o += edge('00', '01', 'ink') + edge('01', '10', 'ink') + edge('10', '00', 'ink') + edge('11', '01', 'dash');
  for (const [k, [x, y]] of Object.entries(S)) {
    o += circle(x, y, R, k === '11' ? 'paper' : 'wash') + circle(x, y, R, k === '11' ? 'dash' : 'ink') + text(x, y + 5, k, 'tb', 'middle');
  }
  o += text(185, 22, 'Q₁Q₀：每个 clock edge 走一步', 'ts', 'middle');
  o += text(380, 228, 'unused state', 'ts', 'middle') + text(380, 244, 'power-up 时可能落在这里', 'ts', 'middle');
  o += text(346, 116, '代入 input equation', 'ts') + text(346, 132, '算出它去 01', 'ts');
  o += text(436, 44, 'J₁ = Q₀', 't') + text(436, 64, 'K₁ = 1', 't') + text(436, 84, 'T₀ = Q₁′', 't');
  o += text(280, 276, '三个实线 state 是设计时给定的；11 的去向不是设计出来的，是 simplify 时对 don’t-care 的取法顺带决定的', 'ts', 'middle');
  return svg(560, 290, o, 'Mod-3 counter 的 state diagram：00 到 01 到 10 再回到 00；unused state 11 在 simplify 之后的 circuit 里会走到 01');
}

// Pipeline diagram：forwarding 之后仍然需要的 load-use stall
function pipeline() {
  let o = '';
  const x0 = 150, cw = 44, y0 = 56, rh = 40, bh = 26;
  for (let c = 0; c < 9; c++) o += text(x0 + c * cw + cw / 2, 40, String(c + 1), 'ts', 'middle') + line(x0 + c * cw, 48, x0 + c * cw, y0 + 4 * rh, 'grid');
  o += line(x0 + 9 * cw, 48, x0 + 9 * cw, y0 + 4 * rh, 'grid') + text(x0 - 10, 40, 'clock cycle', 'ts', 'end');
  const rows = [
    ['add $t2, $s0, $t2', [[0, 'IF'], [1, 'ID'], [2, 'EX'], [3, 'MEM'], [4, 'WB']]],
    ['lw $t3, 0($t2)', [[1, 'IF'], [2, 'ID'], [3, 'EX'], [4, 'MEM'], [5, 'WB']]],
    ['add $s1, $s1, $t3', [[2, 'IF'], [3, 'ID'], [4, '·'], [5, 'EX'], [6, 'MEM'], [7, 'WB']]],
    ['addi $t0, $t0, 1', [[3, 'IF'], [4, '·'], [5, 'ID'], [6, 'EX'], [7, 'MEM'], [8, 'WB']]],
  ];
  const cx = (c) => x0 + c * cw, cy = (r) => y0 + r * rh + (rh - bh) / 2;
  rows.forEach(([name, st], r) => {
    o += text(x0 - 10, cy(r) + 18, name, 't', 'end');
    for (const [c, s] of st) {
      if (s === '·') o += rect(cx(c) + 3, cy(r), cw - 6, bh, 'wash2', 4) + text(cx(c) + cw / 2, cy(r) + 17, 'stall', 'ts', 'middle');
      else o += rect(cx(c) + 3, cy(r), cw - 6, bh, s === 'EX' || s === 'MEM' ? 'wash' : 'paper-f', 4) + rect(cx(c) + 3, cy(r), cw - 6, bh, 'frame', 4) + text(cx(c) + cw / 2, cy(r) + 17, s, 'ts tb', 'middle');
    }
  });
  // forwarding：add 的 EX 结果 → lw 的 EX
  o += arrow(cx(3) - 3, cy(0) + bh, cx(3) + 5, cy(1) - 1, 'ln');
  // forwarding：lw 的 MEM 结果 → add 的 EX
  o += arrow(cx(5) - 3, cy(1) + bh, cx(5) + 5, cy(2) - 1, 'ln');
  o += text(20, y0 + 4 * rh + 24, '粗箭头是 forwarding：上一条 instruction 某个 stage 末尾的结果，直接送到下一个 cycle 的 EX 入口。', 'ts');
  o += text(20, y0 + 4 * rh + 42, 'lw 的 data 在 cycle 5（MEM）末尾才有，下一条 add 的 EX 最早只能排在 cycle 6，所以空出一格。', 'ts');
  o += text(20, 18, '$t2 由第一条 add 算出、lw 马上要用；$t3 由 lw 读出、第二条 add 马上要用', 'ts');
  return svg(560, 268, o, 'Pipeline diagram：add 之后的 lw 靠 forwarding 不用 stall；lw 之后马上用它结果的 add 必须 stall 一个 cycle');
}

// Address 怎么切成 tag / index / offset，以及一次 lookup
function addr() {
  let o = '';
  const bits = (0x10010024).toString(2).padStart(32, '0');
  const x0 = 56, w = 14, y = 46, h = 24;
  for (let i = 0; i < 32; i++) {
    const cls = i < 27 ? 'wash2' : i < 29 ? 'solid' : 'wash';
    o += rect(x0 + i * w, y, w, h, cls) + rect(x0 + i * w, y, w, h, 'frame') + text(x0 + i * w + w / 2, y + 17, bits[i], i >= 27 && i < 29 ? 'tw' : 'ts', 'middle');
  }
  o += text(x0, 22, 'address 0x10010024（B[1]）', 'tb');
  o += text(x0 + 13.5 * w, y + h + 16, 'tag：27 bits = 0x800801', 't', 'middle');
  o += text(x0 + 28 * w - 8, y + h + 16, 'index：2 bits = 0', 't', 'end');
  o += text(x0 + 32 * w, y - 8, 'offset：3 bits = 4', 't', 'end');
  // cache table
  const tx = 150, ty = 150, rh = 26, cols = [[0, 44, 'index'], [44, 44, 'valid'], [88, 96, 'tag'], [184, 150, 'data（2 words）']];
  for (const [dx, cw, s] of cols) o += text(tx + dx + cw / 2, ty - 8, s, 'ts', 'middle');
  const rowsD = [['0', '1', '0x800800', 'A[0]   A[1]'], ['1', '0', '', ''], ['2', '0', '', ''], ['3', '0', '', '']];
  rowsD.forEach((r, i) => {
    for (let j = 0; j < 4; j++) {
      const [dx, cw] = cols[j];
      o += rect(tx + dx, ty + i * rh, cw, rh, j === 0 ? 'wash2' : i === 0 ? 'wash' : 'paper-f') + rect(tx + dx, ty + i * rh, cw, rh, 'frame');
      o += text(tx + dx + cw / 2, ty + i * rh + 17, r[j], j === 0 ? 'ts' : 't', 'middle');
    }
  });
  // index 选 row
  o += wire([[x0 + 28 * w, y + h + 2], [x0 + 28 * w, 118], [120, 118], [120, ty + rh / 2]], 'ln') + arrow(120, ty + rh / 2, tx - 2, ty + rh / 2, 'ln');
  o += text(126, 112, '① index 选出一个 row', 'ts');
  // tag 比较
  o += text(tx + 88 + 48, ty + 4 * rh + 20, '② 存着的 tag 0x800800 ≠ address 的 tag 0x800801', 't', 'middle');
  o += text(tx + 88 + 48, ty + 4 * rh + 38, '→ miss：把 B[0]、B[1] 这个 block 读进来，换掉 A 的 block', 'tl', 'middle');
  o += text(tx + 88 + 48, ty + 4 * rh + 58, '（如果 hit，③ 再用 offset 在 block 里挑出要的那个 word）', 'ts', 'middle');
  return svg(560, 328, o, '32-bit address 被切成 27-bit tag、2-bit index、3-bit offset；index 选出 cache 的一个 row，再比较 tag 决定 hit 还是 miss');
}

// 同一串 access，direct-mapped 与 2-way set-associative
function trace() {
  let o = '';
  const x0 = 176, cw = 23, y0 = 54, rh = 44;
  const names = [];
  for (let i = 0; i < 8; i++) names.push(['A', i], ['B', i]);
  // 模拟两个 cache：block = 2 words；A[i] 在 block i>>1，B[i] 在 block 4 + (i>>1)
  const lab = (arr, blk) => `${arr}[${2 * blk}..${2 * blk + 1}]`;
  const dm = [null, null, null, null], sa = [[null, null], [null, null]], lru = [0, 0];
  const st = []; // 每次 access 之后的状态
  names.forEach(([arr, i]) => {
    const blk = (arr === 'A' ? 0 : 4) + (i >> 1), tagLab = lab(arr, i >> 1);
    const di = blk % 4, dHit = dm[di] === tagLab; if (!dHit) dm[di] = tagLab;
    const si = blk % 2; let w = sa[si].indexOf(tagLab); const sHit = w >= 0;
    if (!sHit) { w = sa[si].indexOf(null); if (w < 0) w = lru[si]; sa[si][w] = tagLab; }
    lru[si] = 1 - w;
    st.push({ dm: [...dm], sa: sa.map((s) => [...s]), dHit, sHit, di, si, w, arr, i });
  });
  // 帧：0 = 全部做完；然后逐次 access
  const idx = [15, ...names.map((_, k) => k)];
  const F = frames(idx.map((k, j) => (j === 0 ? 3 : k === 15 ? 1.6 : 0.85)));
  const upto = (k) => idx.map((j, f) => (f === 0 ? true : j >= k));
  const now = (k) => idx.map((j, f) => f > 0 && j === k);
  names.forEach(([a, i], k) => {
    const x = x0 + k * cw;
    o += sRect(x + 1, 30, cw - 2, 112, 'wash2', 3, now(k), F);
    o += text(x + cw / 2, 46, a + i, 'ts', 'middle');
  });
  o += text(x0 - 10, 46, 'access', 'ts', 'end');
  const rowsD = [['Direct-mapped', '4 blocks × 8 bytes', 'dHit'], ['2-way set-associative', '2 sets × 2 ways × 8 bytes', 'sHit']];
  rowsD.forEach(([a, b, key], r) => {
    const y = y0 + r * rh;
    o += text(x0 - 10, y + 13, a, 'tb', 'end') + text(x0 - 10, y + 29, b, 'ts', 'end');
    st.forEach((s, i) => {
      const h = s[key], on = upto(i);
      o += sRect(x0 + i * cw + 2, y + 4, cw - 4, 26, h ? 'solid' : 'paper', 4, on, F) + sText(x0 + i * cw + cw / 2, y + 22, h ? 'H' : 'M', h ? 'tw' : 'ts', 'middle', on, F);
    });
  });
  // 两个 cache 本身：每一格里是哪个 block
  const cy = 170, sh = 26;
  const slot = (x, y, w, contents, hitAt, touchAt) => {
    let q = rect(x, y, w, sh, 'paper', 3);
    q += sRect(x, y, w, sh, 'wash-strong', 3, touchAt, F);
    const seen = [...new Set(contents.filter(Boolean))];
    for (const c of seen) q += sText(x + w / 2, y + 18, c, 't', 'middle', contents.map((v) => v === c), F);
    q += sText(x + w / 2, y + 18, '空', 'ts', 'middle', contents.map((v) => !v), F);
    return q;
  };
  o += text(20, cy - 8, 'Direct-mapped：index = block mod 4', 'tb');
  for (let r = 0; r < 4; r++) {
    o += text(36, cy + r * (sh + 4) + 18, String(r), 'ts', 'middle');
    o += slot(52, cy + r * (sh + 4), 150, idx.map((k) => st[k].dm[r]), null, idx.map((k, f) => f > 0 && st[k].di === r));
  }
  o += text(300, cy - 8, '2-way：set = block mod 2', 'tb');
  o += text(370, cy + 6, 'way 0', 'ts', 'middle') + text(480, cy + 6, 'way 1', 'ts', 'middle');
  for (let r = 0; r < 2; r++) {
    const yy = cy + 14 + r * (sh + 4);
    o += text(314, yy + 18, 'set ' + r, 'ts', 'end');
    for (let w = 0; w < 2; w++) o += slot(320 + w * 110, yy, 104, idx.map((k) => st[k].sa[r][w]), null, idx.map((k, f) => f > 0 && st[k].si === r && st[k].w === w));
  }
  // 状态说明
  const msgY = 310;
  idx.forEach((k, f) => {
    const s = st[k], on = idx.map((_, g) => g === f);
    if (f === 0) {
      o += sText(20, msgY, '上：A[i] 和 B[i] 抢同一个 index，互相把对方的 block 赶出去，16 次全部 miss。', 'ts', 'start', on, F);
      o += sText(20, msgY + 18, '下：一个 set 里有两个 way，A 和 B 的 block 可以并存，每个 block 的第二个 word 都 hit。', 'ts', 'start', on, F);
      return;
    }
    const nm = `${s.arr}[${s.i}]`;
    o += sText(20, msgY, `${nm}：direct-mapped 看 index ${s.di}，` + (s.dHit ? 'hit' : 'miss，换成 ' + s.dm[s.di]), 't', 'start', on, F);
    o += sText(20, msgY + 18, `${nm}：2-way 看 set ${s.si}，` + (s.sHit ? 'hit' : 'miss，放进 way ' + s.w), 't', 'start', on, F);
  });
  o += text(20, 18, 'sum += A[i] * B[i]，B 的 address 比 A 大 32；两个 cache 的总 capacity 都是 32 bytes', 'ts');
  return svgA(560, 332, o, '动图：同一串 16 次 access，A0 B0 A1 B1 一直到 A7 B7，下面画出两个 cache 每一格里放着哪个 block。Direct-mapped cache 里 A 和 B 的 block 落在同一个 index，互相赶出，全部 miss；capacity 相同的 2-way set-associative cache 里两者并存，一半 hit');
}

function rowcol() {
  let o = '';
  const cs = 14, R = 8, C = 16;
  const panel = (x0, title, sub2, mode) => {
    const y0 = 70;
    o += text(x0 + C * cs / 2, 24, title, 'tb', 'middle') + text(x0 + C * cs / 2, 42, sub2, 'ts', 'middle');
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      let cls = 'paper-f';
      if (mode === 'row' && r < 2) cls = c % 4 === 0 ? 'solid' : 'wash';
      if (mode === 'col' && c < 2) cls = 'solid';
      o += rect(x0 + c * cs, y0 + r * cs, cs, cs, cls) + rect(x0 + c * cs, y0 + r * cs, cs, cs, 'frame');
    }
    for (let r = 0; r < R; r++) for (let b = 0; b < C / 4; b++) o += rect(x0 + b * 4 * cs, y0 + r * cs, 4 * cs, cs, 'ink');
    o += text(x0 + C * cs + 6, y0 + 10, '…', 'ts') + text(x0 + C * cs / 2, y0 + R * cs + 16, '⋮', 'ts', 'middle');
    if (mode === 'row') {
      o += arrow(x0 + 2, y0 - 7, x0 + C * cs - 2, y0 - 7, 'ln');
    } else {
      o += arrow(x0 - 7, y0 + 2, x0 - 7, y0 + R * cs - 2, 'ln');
    }
  };
  panel(28, '按 row 读：sum += A[i][j]，j 在内层', '相邻两次 access 差 4 bytes', 'row');
  panel(312, '按 column 读：i 在内层', '相邻两次 access 差 64 × 4 = 256 bytes', 'col');
  const ly = 214;
  o += rect(28, ly - 10, 12, 12, 'solid') + text(46, ly, 'miss', 'ts') + rect(90, ly - 10, 12, 12, 'wash') + text(108, ly, 'hit', 'ts');
  o += rect(146, ly - 11, 56, 14, 'ink') + text(208, ly, '一个 block = 16 bytes = 4 个 int', 'ts');
  o += text(28, 238, '左：每个 block 第一次碰到是 miss，带回来的另外 3 个 int 都 hit，4096 / 4 = 1024 次 miss。', 'ts');
  o += text(28, 256, '右：每次都落进一个新的 block；回头要用同一个 block 的下一个 int 时，', 'ts');
  o += text(28, 272, '它已经被换掉了，4096 次全 miss（原因在第 8 站）。图里只画了左上角 8 个 row × 16 个 column。', 'ts');
  return svg(560, 284, o, '64 乘 64 的 int array：按 row 读时每个 4 个 int 的 block 一次 miss 三次 hit；按 column 读时每次 access 都 miss');
}

// ---------- Float 的间隔：2^24 两边 ----------
function gap() {
  let o = '';
  const sx = lin(-6, 8, 40, 520), y = 96;
  o += line(sx(-6.4), y, sx(8.4), y, 'axis');
  for (let k = -6; k <= 8; k++) {
    o += line(sx(k), y - 4, sx(k), y + 4, 'axis');
    if (k % 2 === 0) o += text(sx(k), y + 34, k === 0 ? '2²⁴' : '2²⁴' + (k > 0 ? '+' : '−') + Math.abs(k), 'ts', 'middle');
    const rep = k < 0 || k % 2 === 0;
    o += circle(sx(k), y, 5, rep ? 'ink-f' : 'paper');
    if (!rep) o += circle(sx(k), y, 5, 'ink');
  }
  o += text(sx(0), 30, '2²⁴ = 16777216', 'tb', 'middle') + line(sx(0), 36, sx(0), y - 8, 'dash');
  // 间隔标注
  o += path(`M${sx(-5)} ${y - 18}L${sx(-5)} ${y - 24}L${sx(-4)} ${y - 24}L${sx(-4)} ${y - 18}`, 'ink') + text(sx(-4.5), y - 30, 'gap 1', 'ts', 'middle');
  o += path(`M${sx(4)} ${y - 18}L${sx(4)} ${y - 24}L${sx(6)} ${y - 24}L${sx(6)} ${y - 18}`, 'ink') + text(sx(5), y - 30, 'gap 2', 'ts', 'middle');
  o += text(sx(-3), y + 92, '[2²³, 2²⁴)：exponent 23，间隔 2²³⁻²³ = 1', 'ts', 'middle');
  o += text(sx(4.5), y + 92, '[2²⁴, 2²⁵)：exponent 24，间隔 2²⁴⁻²³ = 2', 'ts', 'middle');
  // 16777217
  o += arrow(sx(1), y + 50, sx(1), y + 8, 'ln') + arrow(sx(1) - 2, y - 11, sx(0) + 2, y - 11, 'ln');
  o += text(sx(1), y + 66, '16777217 = 2²⁴+1 没有对应的 pattern，round 到 16777216', 'tl', 'middle');
  o += circle(60, 218, 5, 'ink-f') + text(72, 222, 'float 能表示的数', 'ts') + circle(200, 218, 5, 'paper') + circle(200, 218, 5, 'ink') + text(212, 222, '表示不了的 integer', 'ts');
  return svg(560, 234, o, '2 的 24 次方两边能表示的 float：左边每个 integer 都有，右边只有偶数，16777217 被 round 到 16777216');
}

// ---------- Struct 的 layout：alignment 与 padding ----------
function structs() {
  let o = '';
  const bw = 22, x0 = 132;
  const lay = (fields) => { // [name, size, align]
    let off = 0, maxA = 1; const out = [];
    for (const [n, s, a] of fields) {
      maxA = Math.max(maxA, a);
      const p = (a - (off % a)) % a;
      if (p) { out.push(['pad', off, p]); off += p; }
      out.push([n, off, s]); off += s;
    }
    const p = (maxA - (off % maxA)) % maxA;
    if (p) { out.push(['pad', off, p]); off += p; }
    return [out, off];
  };
  const rows = [
    ['student_t', [['id', 4, 4], ['grade', 1, 1], ['marks[0]', 4, 4], ['marks[1]', 4, 4]]],
    ['{ char c; int x; char d; }', [['c', 1, 1], ['x', 4, 4], ['d', 1, 1]]],
    ['{ int x; char c; char d; }', [['x', 4, 4], ['c', 1, 1], ['d', 1, 1]]],
  ];
  for (let k = 0; k <= 16; k += 4) o += text(x0 + k * bw, 28, String(k), 'ts', 'middle') + line(x0 + k * bw, 34, x0 + k * bw, 40, 'axis');
  o += text(x0 - 10, 28, 'offset', 'ts', 'end');
  rows.forEach(([name, f], r) => {
    const y = 46 + r * 62, [L, size] = lay(f);
    o += text(x0 - 10, y + 17, r === 0 ? name : '', 'tb', 'end');
    if (r) o += text(x0, y - 4, name, 'ts');
    for (let b = 0; b < size; b++) o += rect(x0 + b * bw, y, bw, 26, 'frame');
    for (const [n, off, s] of L) {
      o += rect(x0 + off * bw + 1.5, y + 1.5, s * bw - 3, 23, n === 'pad' ? 'wash2' : 'wash', 3);
      o += text(x0 + (off + s / 2) * bw, y + 17, n === 'pad' ? (s > 1 ? 'padding' : 'pad') : n, n === 'pad' ? 'ts' : 't', 'middle');
    }
    o += text(x0 + size * bw + 8, y + 17, size + ' bytes', 'tl');
    if (r === 0) o += text(x0 - 10, y + 33, '', 'ts', 'end');
  });
  o += text(20, 234, 'int 只能从 4 的倍数开始；struct 的 size 也要补成 4 的倍数（最大的 alignment），', 'ts');
  o += text(20, 250, '这样 array 里下一个 struct 的 int 仍然对齐。', 'ts');
  return svg(560, 262, o, '三个 struct 的 byte layout：student_t 16 bytes；char、int、char 的顺序 12 bytes；int、char、char 的顺序 8 bytes');
}

// ---------- Branch 的 immediate：从 PC + 4 数起 ----------
function branch() {
  let o = '';
  const A = ['addi $t0, $zero, 0', 'addi $s1, $zero, 0', 'slti $t1, $t0, 8', 'beq $t1, $zero, exit', 'sll $t2, $t0, 2', 'add $t2, $s0, $t2', 'lw $t3, 0($t2)', 'add $s1, $s1, $t3', 'addi $t0, $t0, 1', 'j loop', 'exit:'];
  const B = ['addi $t0, $zero, 0', 'addi $s1, $zero, 0', 'sll $t2, $t0, 2', 'add $t2, $s0, $t2', 'lw $t3, 0($t2)', 'add $s1, $s1, $t3', 'addi $t0, $t0, 1', 'slti $t1, $t0, 8', 'bne $t1, $zero, loop', 'exit:'];
  const rh = 20, y0 = 70;
  const panel = (x0, title, L, br, tgt) => {
    o += text(x0, 24, title, 'tb');
    L.forEach((s, i) => {
      const y = y0 + i * rh;
      const cls = i === br || i === tgt ? 'wash2' : '';
      if (cls) o += rect(x0 - 4, y - 14, 200, rh - 2, cls, 3);
      o += text(x0, y, '0x' + (0x00400000 + 4 * i).toString(16).toUpperCase().padStart(8, '0').slice(-2), 'ts') + text(x0 + 34, y, s, i === br ? 'tb' : 't');
    });
    const n = tgt - (br + 1), ax = x0 + 226;
    // 数的那几条
    const lo = Math.min(br + 1, tgt), hi = Math.max(br + 1, tgt);
    for (let i = lo; i < hi; i++) o += text(ax - 6, y0 + i * rh, String(n > 0 ? i - br : i - br - 1).replace('-', '−'), 'tl', 'end');
    const ya = y0 + (br + 1) * rh - 5, yb = y0 + tgt * rh - 5;
    o += line(ax, ya, ax + 10, ya, 'ln') + line(ax + 10, ya, ax + 10, yb, 'ln') + arrow(ax + 10, yb, ax + 1, yb, 'ln');
    o += text(ax + 16, (ya + yb) / 2 + 4, 'imm', 'ts') + text(ax + 16, (ya + yb) / 2 + 20, '= ' + (n > 0 ? n : '−' + -n), 'tl');
  };
  panel(14, 'Version A：beq 往前跳', A, 3, 10);
  panel(290, 'Version B：bne 往回跳', B, 8, 2);
  o += text(14, 42, 'address 只写最低两个 hex digit', 'ts') + text(290, 42, '灰底：branch（粗体）和它的 target', 'ts');
  o += text(14, 304, '左：从 PC + 4（0x10）开始数，跳过 6 条到 0x28。右：PC + 4 是 0x24，往回数 7 条到 0x08。', 'ts');
  o += text(14, 322, '右边的小数字是数到的第几条；immediate = (target − (PC + 4)) / 4。', 'ts');
  return svg(560, 334, o, '两个 branch 的 immediate：version A 的 beq 从下一条数起往前 6 条到 exit；version B 的 bne 从下一条往回 7 条到 loop');
}

// ---------- segment e 的 POS：圈 0 ----------
function kpos() {
  let o = '';
  const S = 40, x0 = 120, y0 = 72, gray = ['00', '01', '11', '10'];
  const val = (m) => ([0, 2, 6, 8].includes(m) ? '1' : m >= 10 ? 'X' : '0');
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    const m = parseInt(gray[r] + gray[c], 2), v = val(m);
    o += rect(x0 + c * S, y0 + r * S, S, S, 'frame') + text(x0 + c * S + S / 2, y0 + r * S + S / 2 + 5, v, v === '0' ? 'tb' : 'ts', 'middle');
  }
  for (let c = 0; c < 4; c++) o += text(x0 + c * S + S / 2, y0 - 8, gray[c], 'ts', 'middle');
  for (let r = 0; r < 4; r++) o += text(x0 - 8, y0 + r * S + S / 2 + 4, gray[r], 'ts', 'end');
  o += text(x0 + 2 * S, y0 - 26, it('C') + it('D'), 't', 'middle') + text(x0 - 34, y0 + 2 * S + 4, it('A') + it('B'), 't', 'end');
  // D：中间两列
  o += rect(x0 + S + 3, y0 + 3, 2 * S - 6, 4 * S - 6, 'ln', 10);
  // BC'：row 01、11 × column 00、01
  o += rect(x0 + 7, y0 + S + 7, 2 * S - 14, 2 * S - 14, 'dash', 10);
  const tx = 330;
  o += text(tx, 92, '圈的是 0 和 X，不碰 1', 'tb');
  o += line(tx, 118, tx + 26, 118, 'ln') + text(tx + 32, 122, '中间两列（D = 1）：' + it('D'), 't');
  o += line(tx, 144, tx + 26, 144, 'dash') + text(tx + 32, 148, 'm₄、m₅、m₁₂、m₁₃：' + it('BC') + '′', 't');
  o += text(tx, 182, 'e′ = D + BC′', 'tl');
  o += text(tx, 204, 'e = (D + BC′)′ = D′(B′ + C)', 'tl');
  o += text(20, 256, '同一张图、同样的 X：SOP 圈 1，POS 圈 0。', 'ts');
  return svg(560, 268, o, 'segment e 的 K-map 上圈 0：中间两列是 D，左边中间四格是 BC 非，于是 e 等于 D 非乘以 B 非加 C');
}

// ---------- Static hazard：Y = AC' + BC ----------
function hazard() {
  let o = '';
  const S = 38, x0 = 64, y0 = 74, gray = ['00', '01', '11', '10'];
  const Y = (a, b, c) => (a && !c) || (b && c) ? '1' : '0';
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
    const v = Y(r, +gray[c][0], +gray[c][1]);
    o += rect(x0 + c * S, y0 + r * S, S, S, 'frame') + text(x0 + c * S + S / 2, y0 + r * S + S / 2 + 5, v, v === '1' ? 'tb' : 'ts', 'middle');
  }
  for (let c = 0; c < 4; c++) o += text(x0 + c * S + S / 2, y0 - 8, gray[c], 'ts', 'middle');
  ['0', '1'].forEach((s, r) => { o += text(x0 - 8, y0 + r * S + S / 2 + 4, s, 'ts', 'end'); });
  o += text(x0 + 2 * S, y0 - 26, it('B') + it('C'), 't', 'middle') + text(x0 - 26, y0 + S + 4, it('A'), 't', 'end');
  // BC：column 11 两格
  o += rect(x0 + 2 * S + 5, y0 + 5, S - 10, 2 * S - 10, 'ink', 9);
  // AC'：row 1 的 column 00 和 10，左右相邻（两个半开的框）
  const yb = y0 + S + 5, yt = y0 + 2 * S - 5, k = 30;
  o += path(`M${x0} ${yb}L${x0 + k - 7} ${yb}Q${x0 + k} ${yb} ${x0 + k} ${yb + 7}L${x0 + k} ${yt - 7}Q${x0 + k} ${yt} ${x0 + k - 7} ${yt}L${x0} ${yt}`, 'ink');
  const x4 = x0 + 4 * S;
  o += path(`M${x4} ${yb}L${x4 - k + 7} ${yb}Q${x4 - k} ${yb} ${x4 - k} ${yb + 7}L${x4 - k} ${yt - 7}Q${x4 - k} ${yt} ${x4 - k + 7} ${yt}L${x4} ${yt}`, 'ink');
  // AB：row 1 的 column 11、10
  o += rect(x0 + 2 * S + 10, y0 + S + 10, 2 * S - 14, S - 20, 'ln', 7);
  o += text(x0 + 2 * S, y0 + 2 * S + 24, '细线：' + it('AC') + '′、' + it('BC') + '；粗线：补上的 ' + it('AB'), 'ts', 'middle');
  o += text(x0 + 2 * S, y0 + 2 * S + 42, 'A = B = 1 时 C 从 1 变 0：', 'ts', 'middle') + text(x0 + 2 * S, y0 + 2 * S + 58, '从 column 11 跨到 column 10', 'ts', 'middle');
  // timing：A = B = 1，C 在 t = 1 从 1 变 0，每个 gate delay = 1
  const dl = 1;
  const C = (t) => (t < 1 ? 1 : 0);
  const Cn = (t) => 1 - C(t - dl);
  const BC = (t) => C(t - dl);
  const ACn = (t) => Cn(t - dl);
  const Yv = (t) => (BC(t - dl) || ACn(t - dl) ? 1 : 0);
  const Yfix = (t) => (BC(t - dl) || ACn(t - dl) || 1 ? 1 : 0);
  const sig = [['C', C], ['C′', Cn], ['BC', BC], ['AC′', ACn], ['Y', Yv], ['Y + AB', Yfix]];
  const tx = lin(0, 6, 340, 540), rh = 34, ty0 = 40;
  o += text(440, 22, 'A = B = 1，每个 gate 的 delay 是 1', 'ts', 'middle');
  sig.forEach(([n, f], i) => {
    const yb2 = ty0 + i * rh + 24, hi = 16, pts = [];
    for (let s = 0; s <= 600; s++) { const t = s / 100; pts.push([tx(t), yb2 - hi * f(t)]); }
    // 去掉重复的点，保留竖直跳变
    o += path(d(pts), n === 'Y' ? 'ln' : 'ink') + text(330, yb2 - 3, n, n === 'Y' ? 'tl' : 't', 'end');
  });
  o += line(tx(1), ty0 + 4, tx(1), ty0 + 6 * rh + 4, 'grid');
  for (let t = 0; t <= 6; t++) o += text(tx(t), ty0 + 6 * rh + 18, String(t), 'ts', 'middle');
  o += text(tx(3.5), ty0 + 4 * rh + 2, 'glitch', 'tl', 'middle');
  return svg(560, 278, o, 'Y 等于 A C 非加 B C 的 K-map，两个 group 相邻不重叠；时序图显示 C 下降时 Y 短暂掉到 0，补上 AB 之后 Y 一直是 1');
}

// ---------- SR latch：两个 NOR 交叉相接 ----------
function latch() {
  let o = '';
  const nor = (x, y) => {
    const w = 52, h = 44;
    return path(`M${x} ${y - h / 2}Q${x + 14} ${y} ${x} ${y + h / 2}Q${x + w * 0.62} ${y + h / 2} ${x + w} ${y}Q${x + w * 0.62} ${y - h / 2} ${x} ${y - h / 2}Z`, 'paper') + circle(x + w + 5, y, 5, 'paper');
  };
  const gx = 190, y1 = 80, y2 = 200, out = gx + 62, fx = 300, bx = 150;
  // 逐个 gate delay 推出来的 (S, R, Q, Q′)
  const seq = [];
  let S = 0, R = 0, Q = 0, Qn = 1;
  const push = (msg, dur) => seq.push({ S, R, Q, Qn, msg, dur });
  const settle = (msgs) => { // 每个 gate delay 两个 NOR 同时按旧值更新一次
    for (let k = 0; k < 3; k++) {
      const q = 1 - (R | Qn), qn = 1 - (S | Q);
      if (q === Q && qn === Qn) break;
      Q = q; Qn = qn; push(msgs[k] || msgs[msgs.length - 1], 0.9);
    }
  };
  // 第 0 帧：S 已经松开，Q 还是 1 —— 这张图要讲的就是这一刻
  S = 0; R = 0; Q = 1; Qn = 0; push('S 已经松开，Q 还是 1：两个 output 互相撑住，记住了这个 bit', 3.0);
  R = 1; push('R = 1', 0.9); settle(['一个 gate delay 后 Q = 0', '再一个 delay，Q′ = 1']);
  R = 0; push('R 松开：Q 留在 0', 1.8);
  S = 1; push('S = 1', 0.9); settle(['一个 gate delay 后 Q′ = 0', '再一个 delay，Q = 1']);
  S = 0; push('S 松开：Q 留在 1', 1.0);
  const F = frames(seq.map((f) => f.dur));
  const on = (fn) => seq.map(fn);
  o += nor(gx, y1) + nor(gx, y2);
  const wires = {
    R: d([[90, y1 - 12], [gx + 4, y1 - 12]]),
    S: d([[90, y2 + 12], [gx + 4, y2 + 12]]),
    Q: d([[out, y1], [380, y1]]) + d([[fx, y1], [fx, y1 + 32], [bx, y2 - 40], [bx, y2 - 12], [gx + 4, y2 - 12]]),
    Qn: d([[out, y2], [380, y2]]) + d([[fx, y2], [fx, y2 - 32], [bx, y1 + 40], [bx, y1 + 12], [gx + 4, y1 + 12]]),
  };
  for (const k of ['R', 'S', 'Q', 'Qn']) {
    o += path(wires[k], 'mute') + sPath(wires[k], 'ln', on((f) => f[k] === 1), F);
  }
  o += circle(fx, y1, 3, 'ink-f') + circle(fx, y2, 3, 'ink-f');
  o += text(80, y1 - 8, it('R'), 't', 'end') + text(80, y2 + 16, it('S'), 't', 'end');
  o += text(388, y1 + 5, it('Q'), 'tb') + text(388, y2 + 5, it('Q') + '′', 'tb');
  // 每根线上的 value
  const val = (x, y, k, anchor) => [0, 1].map((v) => sText(x, y, String(v), v ? 'tl' : 'ts', anchor, on((f) => f[k] === v), F)).join('');
  o += val(104, y1 - 18, 'R', 'middle') + val(104, y2 + 6, 'S', 'middle') + val(360, y1 - 6, 'Q', 'middle') + val(360, y2 - 6, 'Qn', 'middle');
  o += text(420, 100, 'Q = (R + Q′)′', 't') + text(420, 124, 'Q′ = (S + Q)′', 't');
  o += text(420, 160, '主题色粗线 = 1', 'ts') + text(420, 178, '细灰线 = 0', 'ts');
  seq.forEach((f, k) => { o += sText(20, 256, f.msg, k === 0 ? 'tb' : 't', 'start', seq.map((_, j) => j === k), F); });
  o += text(20, 276, 'S、R 只是短暂地给一下 1；松开以后（S = R = 0），交叉接回的两根线让 Q 保持住。', 'ts');
  return svgA(560, 284, o, '动图：SR latch。先在 Q = 1 时 S = R = 0，output 保持；给 R 一个 1，Q 经过一个 gate delay 变成 0，再一个 delay Q′ 变成 1；松开 R 后 Q 留在 0；给 S 一个 1 再松开，Q 回到 1 并保持');
}

function overlap() {
  let o = '';
  const sx = lin(0, 24, 120, 540), bh = 22;
  const st = [['IF', 2], ['ID', 1], ['EX', 2], ['MEM', 2], ['WB', 1]];
  const hw = ['Instr mem', 'Reg file', 'ALU', 'Data mem', 'Reg write'];
  const ins = [['lw', [1, 1, 1, 1, 1]], ['add', [1, 1, 1, 0, 1]], ['beq', [1, 1, 1, 0, 0]]];
  o += text(20, 24, '每个 stage 的 delay 用第 4 站的数字：memory 2 ns、ALU 2 ns、register file 1 ns', 'ts');
  // single-cycle：一行，三段各 8 ns
  let y = 58;
  o += text(20, y + 15, 'single-cycle', 'tb') + text(20, y + 31, 'clock 8 ns', 'ts');
  ins.forEach(([n, use], k) => {
    const t0 = 8 * k, used = st.reduce((s, [, dt], j) => s + (use[j] ? dt : 0), 0);
    o += rect(sx(t0), y, sx(t0 + used) - sx(t0), bh, 'wash') + rect(sx(t0), y, sx(t0 + used) - sx(t0), bh, 'frame');
    if (used < 8) o += rect(sx(t0 + used) + 2, y + 2, sx(t0 + 8) - sx(t0 + used) - 4, bh - 4, 'dash', 3);
    o += text((sx(t0) + sx(t0 + used)) / 2, y + 15, n + '：' + used + ' ns', 't', 'middle');
  });
  o += text(sx(24), y + 40, '24 ns', 'tl', 'end');
  // pipeline：三行，每个 stage 2 ns
  y = 128;
  o += text(20, y + 15, 'pipeline', 'tb') + text(20, y + 31, 'clock 2 ns', 'ts');
  ins.forEach(([n], k) => {
    const yy = y + k * (bh + 6);
    st.forEach(([s], j) => {
      const t0 = 2 * (k + j);
      o += rect(sx(t0) + 1, yy, sx(2) - sx(0) - 2, bh, 'wash', 3) + text(sx(t0 + 1), yy + 15, s, 'ts tb', 'middle');
    });
    o += text(sx(2 * k) - 6, yy + 15, n, 't', 'end');
  });
  o += line(sx(14), y - 6, sx(14), y + 3 * (bh + 6), 'dash') + text(sx(14) + 6, y + 3 * (bh + 6) - 4, '(3 + 4) × 2 = 14 ns', 'tl');
  const ay = 232;
  o += line(sx(0), ay, sx(24), ay, 'axis');
  for (let t = 0; t <= 24; t += 2) o += line(sx(t), ay, sx(t), ay + 4, 'axis') + text(sx(t), ay + 17, String(t), 'ts', 'middle');
  o += text(sx(24), ay + 32, 'ns', 'ts', 'end');
  // 动画：时间指针每 1 ns 一格；第 0 帧停在 6–7 ns（pipeline 里三条同时在走）
  const times = []; for (let t = 6; t < 24; t++) times.push(t); for (let t = 0; t <= 6; t++) times.push(t);
  const durs = times.map((t, k) => (k === 0 ? 2.6 : t === 23 ? 1.4 : 0.55));
  const F = frames(durs);
  // 指针：1 ns 宽的灰带，画在最底层；轴上用实心块标出这 1 ns
  const band = (y0, h, cls) => `<rect x="${f1(sx(times[0]))}" y="${y0}" width="${f1(sx(1) - sx(0))}" height="${h}" class="${cls}">${anim('x', times.map((t) => f1(sx(t))), F.kt, F.T, true)}</rect>`;
  o = band(50, ay - 50, 'wash2') + o + band(ay - 3, 6, 'solid');
  // 这一刻各块 hardware 在做哪条
  const scAt = (t) => { // single-cycle：返回 [stage, instr] 或 null
    const k = Math.floor(t / 8), tau = t - 8 * k; let acc = 0;
    for (let j = 0; j < 5; j++) { if (tau < acc + st[j][1]) return ins[k][1][j] ? [j, k] : null; acc += st[j][1]; }
    return null;
  };
  const plAt = (t, j) => { const k = Math.floor(t / 2) - j; return k >= 0 && k < 3 ? k : -1; };
  const bx0 = 116, bw = 82, gap = 4, rows = [[306, 'single-cycle'], [348, 'pipeline']];
  o += text(20, 276, '灰带所在的这 1 ns 里，五块 hardware 各在做哪条 instruction：', 'ts');
  rows.forEach(([yy, name], r) => {
    o += text(20, yy + 22, name, 'tb');
    if (r === 0) hw.forEach((h, j) => { o += text(bx0 + j * (bw + gap) + bw / 2, yy - 6, st[j][0], 'ts tb', 'middle'); });
    hw.forEach((h, j) => {
      const x = bx0 + j * (bw + gap);
      const busy = times.map((t) => (r === 0 ? (scAt(t)?.[0] === j) : plAt(t, j) >= 0));
      o += rect(x, yy, bw, 36, 'paper', 4) + sRect(x, yy, bw, 36, 'wash-strong', 4, busy, F);
      o += text(x + bw / 2, yy + 14, h, 'ts', 'middle');
      ins.forEach(([n], k) => {
        const onK = times.map((t) => (r === 0 ? (scAt(t)?.[0] === j && scAt(t)[1] === k) : plAt(t, j) === k));
        o += sText(x + bw / 2, yy + 30, n, 'tb', 'middle', onK, F);
      });
      o += sText(x + bw / 2, yy + 30, '空闲', 'ts', 'middle', busy.map((b) => !b), F);
    });
  });
  o += text(20, 408, '上：每条都等满 8 ns，任何时刻只有一块 hardware 在用。下：五块同时在忙，每 2 ns 完成一条。', 'ts');
  return svgA(560, 416, o, '动图：同样三条 instruction，时间指针从 0 走到 24 ns。Single-cycle 每条 8 ns 共 24 ns，同一时刻只有一块 hardware 在工作；pipeline 每个 stage 2 ns，三条重叠，共 14 ns，同一时刻最多三块 hardware 同时在工作');
}

function loopC() {
  let o = '';
  // dep：[producer 下标, 'alu' | 'load']；branch 在 ID 比较
  const L = [
    ['I1 sll $t2, $t0, 2', null, false],
    ['I2 add $t2, $s0, $t2', [0, 'alu'], false],
    ['I3 lw $t3, 0($t2)', [1, 'alu'], false],
    ['I4 add $s1, $s1, $t3', [2, 'load'], false],
    ['I5 addi $t0, $t0, 1', null, false],
    ['I6 slti $t1, $t0, 8', [4, 'alu'], false],
    ['I7 bne $t1, $zero, loop', [5, 'alu'], true],
  ];
  const sch = [];
  L.forEach(([, dep, br], i) => {
    const p = sch[i - 1];
    const ifs = p ? Math.max(p.ifs + 1, p.ids) : 1;
    const ids = p ? Math.max(ifs + 1, p.ide + 1) : ifs + 1;
    let ide = ids;
    if (dep) {
      const q = sch[dep[0]], ready = dep[1] === 'load' ? q.ide + 2 : q.ide + 1; // EX 或 MEM 结束的 cycle
      ide = Math.max(ids, br ? ready + 1 : ready);
    }
    sch.push({ ifs, ids, ide });
  });
  const b = sch[6], fl = { ifs: Math.max(b.ifs + 1, b.ids), ide: b.ide }, nxt = b.ide + 1;
  const x0 = 160, cw = 29, y0 = 50, rh = 25, bh = 19, NC = 13;
  for (let c = 0; c < NC; c++) o += text(x0 + c * cw + cw / 2, 40, String(c + 1), 'ts', 'middle') + line(x0 + c * cw, 46, x0 + c * cw, y0 + 9 * rh, 'grid');
  o += line(x0 + NC * cw, 46, x0 + NC * cw, y0 + 9 * rh, 'grid') + text(x0 - 8, 40, 'cycle', 'ts', 'end');
  const cell = (r, c, s, kind) => {
    const x = x0 + (c - 1) * cw + 2, y = y0 + r * rh + 3;
    if (kind === 'stall') return rect(x, y, cw - 4, bh, 'wash2', 3) + text(x + cw / 2 - 2, y + 14, '·', 'ts', 'middle');
    if (kind === 'flush') return rect(x, y, cw - 4, bh, 'dash', 3) + text(x + cw / 2 - 2, y + 13, s, 'sub', 'middle');
    return rect(x, y, cw - 4, bh, s === 'EX' || s === 'MEM' ? 'wash' : 'paper-f', 3) + rect(x, y, cw - 4, bh, 'frame', 3) + text(x + cw / 2 - 2, y + 13, s, 'sub tb', 'middle');
  };
  sch.forEach(({ ifs, ids, ide }, r) => {
    o += text(x0 - 8, y0 + r * rh + 17, L[r][0], 'ts', 'end');
    o += cell(r, ifs, 'IF');
    for (let c = ifs + 1; c < ids; c++) o += cell(r, c, '', 'stall');
    o += cell(r, ids, 'ID');
    for (let c = ids + 1; c <= ide; c++) o += cell(r, c, '', 'stall');
    o += cell(r, ide + 1, 'EX') + cell(r, ide + 2, 'MEM') + cell(r, ide + 3, 'WB');
  });
  o += text(x0 - 8, y0 + 7 * rh + 17, '猜的下一条：猜错，flush', 'ts', 'end');
  o += cell(7, fl.ifs, 'IF', 'flush');
  for (let c = fl.ifs + 1; c <= fl.ide; c++) o += cell(7, c, '', 'stall');
  o += text(x0 - 8, y0 + 8 * rh + 17, '下一遍的 I1', 'ts', 'end') + cell(8, nxt, 'IF');
  o += text(20, y0 + 9 * rh + 22, '灰格是 stall：I4 等 lw 的 MEM（load-use，1）；I7 在 ID 比较，要等 I6 的 EX（1）；', 'ts');
  o += text(20, y0 + 9 * rh + 38, `猜错 flush 掉一条（1）。I1 在 cycle 1 取，下一遍的 I1 在 cycle ${nxt} 取：`, 'ts');
  o += text(20, y0 + 9 * rh + 54, `一遍 ${nxt - 1} 个 cycle = 7 + 3，就是表里设定 C 的 3。`, 'ts');
  return svg(560, y0 + 9 * rh + 66, o, '设定 C 下 version B 的 loop 一遍的 pipeline diagram：load-use stall 一个 cycle，branch 等 slti 一个 cycle，猜错 flush 一个 cycle');
}

// ---------- 三种 block size 下 instruction 的 block 与 index ----------
function iblocks() {
  let o = '';
  const cw = 46, x0 = 128, n = 9;
  for (let i = 0; i < n; i++) o += text(x0 + i * cw + cw / 2, 56, '0x' + (4 * i).toString(16).toUpperCase().padStart(2, '0'), 'ts', 'middle');
  // loop body：0x08 到 0x20
  o += path(`M${x0 + 2 * cw + 2} 38L${x0 + 2 * cw + 2} 32L${x0 + n * cw - 2} 32L${x0 + n * cw - 2} 38`, 'ln') + text(x0 + 5.5 * cw, 26, 'loop body（每遍都要取）', 'tl', 'middle');
  const cfg = [[4, 8, 9], [8, 4, 5], [16, 2, 17]];
  cfg.forEach(([B, nb, miss], r) => {
    const y = 70 + r * 66;
    o += text(x0 - 10, y + 16, B + '-byte block', 'tb', 'end') + text(x0 - 10, y + 32, nb + ' 个 index · ' + miss + ' miss', 'ts', 'end');
    const per = B / 4;
    for (let s = 0; s < n; s += per) {
      const idx = (4 * s / B) % nb, w = Math.min(per, n - s);
      // 同一个 index 被两个 block 用，且两者都在 loop 里
      const others = [];
      for (let t = 0; t < n; t += per) if (t !== s && (4 * t / B) % nb === idx) others.push(t);
      const clash = others.length > 0, both = clash && [s, ...others].every((t) => t + per > 2);
      o += rect(x0 + s * cw + 2, y, w * cw - 4, 26, both ? 'band-n' : clash ? 'wash2' : 'wash', 4);
      if (clash && !both) o += rect(x0 + s * cw + 2, y, w * cw - 4, 26, 'dash', 4);
      o += text(x0 + (s + Math.min(per, n - s) / 2) * cw, y + 17, 'index ' + idx, w === 1 ? 'sub tb' : 'ts tb', 'middle');
    }
  });
  o += rect(20, 276, 12, 12, 'wash') + text(38, 286, '这个 index 只有一个 block', 'ts');
  o += rect(190, 276, 12, 12, 'wash2') + rect(190, 276, 12, 12, 'dash') + text(208, 286, '和 0x00 那个 block 抢，但 0x00 只取一次', 'ts');
  o += rect(20, 296, 12, 12, 'band-n') + text(38, 306, '两个 block 都在 loop 里，每遍互相换掉一次：16 bytes 时每遍多 2 次 miss', 'ts');
  return svg(560, 318, o, '0x00 到 0x20 的 9 条 instruction 在三种 block size 下分成的 block 和 index；16 字节的 block 时两个 loop 里的 block 抢同一个 index');
}

// ---------- 按 column 读：一个 column 只落在 4 个 index 上 ----------
function colmap() {
  let o = '';
  const y0 = 64, rh = 22;
  o += text(20, 26, 'A[i][0]，i = 0, 1, 2, …（A[0][0] 当作 byte 0）', 'tb');
  ['element', 'byte', 'block', 'index'].forEach((s, k) => { o += text([20, 104, 160, 214][k], 50, s, 'ts'); });
  const cx = 330, cy = 56, cs = 24;
  for (let r = 0; r < 8; r++) {
    const byte = 256 * r, blk = byte / 16, idx = blk % 64, y = y0 + r * rh;
    o += text(20, y + 4, `A[${r}][0]`, 't') + text(104, y + 4, String(byte), 't') + text(160, y + 4, String(blk), 't') + text(214, y + 4, String(idx), 'tl');
    const gy = cy + Math.floor(idx / 8) * cs + cs / 2;
    o += path(d([[244, y], [cx - 4, gy]]), r < 4 ? 'ink' : 'dash');
  }
  o += text(20, y0 + 8 * rh + 2, '⋮', 'ts');
  for (let i = 0; i < 64; i++) {
    const r = Math.floor(i / 8), c = i % 8, hitI = i % 16 === 0;
    o += rect(cx + c * cs, cy + r * cs, cs, cs, hitI ? 'band-n' : 'paper-f') + rect(cx + c * cs, cy + r * cs, cs, cs, 'frame');
    if (hitI || c === 0) o += text(cx + c * cs + cs / 2, cy + r * cs + 16, String(i), hitI ? 'tb' : 'ts', 'middle');
  }
  o += text(cx + 4 * cs, cy + 8 * cs + 18, '1 KB cache 的 64 个 index', 'ts', 'middle');
  o += text(20, 290, '每往下 4 个 row，index 转回原处：A[4][0] 把 A[0][0..3] 那个 block 换掉。', 'ts');
  o += text(20, 308, '一个 column 的 64 个 element 只用到 index 0、16、32、48，每个被改写 16 次；', 'ts');
  o += text(20, 326, '轮到 A[0][1] 时，它所在的 block 早已不在。', 'ts');
  return svg(560, 338, o, '按 column 读时 A[i][0] 的 address 每次加 256，block 号每次加 16，index 只在 0、16、32、48 四个之间轮转');
}

export default {
  'cs2100-wheel': wheel,
  'cs2100-float': float,
  'cs2100-ptr': ptr,
  'cs2100-formats': formats,
  'cs2100-datapath': datapath,
  'cs2100-kmap': kmap,
  'cs2100-ripple': ripple,
  'cs2100-fsm': fsm,
  'cs2100-pipeline': pipeline,
  'cs2100-addr': addr,
  'cs2100-trace': trace,
  'cs2100-rowcol': rowcol,
  'cs2100-gap': gap,
  'cs2100-struct': structs,
  'cs2100-branch': branch,
  'cs2100-kpos': kpos,
  'cs2100-hazard': hazard,
  'cs2100-latch': latch,
  'cs2100-overlap': overlap,
  'cs2100-loopc': loopC,
  'cs2100-iblocks': iblocks,
  'cs2100-colmap': colmap,
};
