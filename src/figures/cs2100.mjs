import { svg, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

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
  const W = 78, H = 56, y = 86, xs = [430, 310, 190, 70];
  const sub = (s, k) => `${s}<tspan class="sub" dy="3">${k}</tspan><tspan dy="-3">​</tspan>`;
  xs.forEach((x, i) => {
    o += rect(x, y, W, H, 'paper', 6) + text(x + W / 2, y + 24, 'Full adder', 'ts tb', 'middle') + text(x + W / 2, y + 42, 'bit ' + i, 'ts', 'middle');
    o += arrow(x + 24, y - 30, x + 24, y - 2, 'ink') + arrow(x + 54, y - 30, x + 54, y - 2, 'ink');
    o += text(x + 24, y - 36, sub('X', i), 't', 'middle') + text(x + 54, y - 36, sub('Y', i), 't', 'middle');
    o += arrow(x + W / 2, y + H, x + W / 2, y + H + 30, 'ink') + text(x + W / 2, y + H + 46, sub('S', i), 'tb', 'middle');
    o += text(x + W / 2, y + H + 64, `${2 * i + 2}t`, 'tl', 'middle');
    // carry out 往左
    const xl = i < 3 ? xs[i + 1] + W : x - 46;
    o += arrow(x, y + H / 2, xl + 2, y + H / 2, 'ln');
    o += text((x + xl) / 2, y + H / 2 - 9, sub('C', i + 1), 't', 'middle') + text((x + xl) / 2, y + H / 2 + 20, `${2 * i + 3}t`, 'tl', 'middle');
  });
  o += arrow(xs[0] + W + 40, y + H / 2, xs[0] + W + 2, y + H / 2, 'ln') + text(xs[0] + W + 24, y + H / 2 - 9, sub('C', 0), 't', 'middle') + text(xs[0] + W + 24, y + H / 2 + 20, '0', 'tl', 'middle');
  o += text(280, 24, '所有 X、Y 和 C₀ 在时刻 0 同时到达；粗体数字是每个 output 稳定下来的时刻（t = 一个 gate 的 delay）', 'ts', 'middle');
  o += text(280, 232, 'Bit 3 的 full adder 要等 C₃，C₃ 要等 C₂，C₂ 要等 C₁：最后一个 sum 在 8t，最后一个 carry 在 9t', 'ts', 'middle');
  return svg(560, 246, o, '四个 full adder 串成 ripple-carry adder，carry 从 bit 0 逐级传到 bit 3，各级 sum 依次在 2t、4t、6t、8t 稳定');
}

// Mod-3 counter 的 state diagram，包括 unused state
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
  for (let i = 0; i < 8; i++) names.push('A' + i, 'B' + i);
  names.forEach((s, i) => { o += text(x0 + i * cw + cw / 2, 40, s, 'ts', 'middle'); });
  o += text(x0 - 10, 40, 'access', 'ts', 'end');
  const rowsD = [['Direct-mapped', '4 blocks × 8 bytes', 'MMMMMMMMMMMMMMMM', '0 / 16 hit'], ['2-way set-associative', '2 sets × 2 ways × 8 bytes', 'MMHHMMHHMMHHMMHH', '8 / 16 hit']];
  rowsD.forEach(([a, b, s, res], r) => {
    const y = y0 + r * rh;
    o += text(x0 - 10, y + 13, a, 'tb', 'end') + text(x0 - 10, y + 29, b, 'ts', 'end');
    [...s].forEach((ch, i) => {
      o += rect(x0 + i * cw + 2, y + 4, cw - 4, 26, ch === 'H' ? 'solid' : 'wash2', 4) + text(x0 + i * cw + cw / 2, y + 22, ch, ch === 'H' ? 'tw' : 'ts', 'middle');
    });
  });
  o += text(20, y0 + 2 * rh + 16, '上：A[i] 和 B[i] 抢同一个位置，互相把对方的 block 赶出去，16 次全部 miss。', 'ts');
  o += text(20, y0 + 2 * rh + 34, '下：一个 set 里有两个位置，A 和 B 的 block 可以并存，每个 block 的第二个 word 都 hit。', 'ts');
  o += text(20, 18, 'sum += A[i] * B[i]，B 的 address 比 A 大 32；两个 cache 的总 capacity 都是 32 bytes', 'ts');
  return svg(560, 186, o, '同一串 16 次 access：direct-mapped cache 全部 miss，capacity 相同的 2-way set-associative cache 有一半 hit');
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
};
