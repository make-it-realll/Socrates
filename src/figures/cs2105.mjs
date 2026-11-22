import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, anim, ashow, f1, sub } from '../lib/svg.mjs';

// ---------- 小工具 ----------
// 箭头头部（单独一个 polygon，方便单独控制显隐）
function head(x1, y1, x2, y2, cls = 'ink-f', size = 7) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p = (ang) => [x2 - size * Math.cos(a + ang), y2 - size * Math.sin(a + ang)];
  return poly([[x2, y2], p(0.42), p(-0.42)], cls);
}
// 动图里的“先显示完整画面，再从头播放”：kt 0 是静态帧（完整），之后按时间显隐
const showAt = (t0, K, T, t1 = null) => {
  // 静态帧可见；动画开始时隐藏；t0 起显示；t1（可选）起再隐藏
  const v = [1, 0, 1], k = [0, K(-1), K(t0)];
  if (t1 !== null) { v.push(0); k.push(K(t1)); }
  return ashow(v, k, T);
};
const g = (inner, anims) => `<g>${inner}${anims}</g>`;

// ---------- 第 1 站：store-and-forward 的 space-time 图 ----------
function delay() {
  const L = 8000, R = 1e6, dp = 10; // ms
  const dt = (L / R) * 1000; // 8 ms
  const X = [90, 290, 490], y0 = 56, u = 5; // 1 ms = 5 px
  const Y = (t) => y0 + t * u;
  let o = '';
  const names = ['source', 'router', 'destination'];
  X.forEach((x, i) => { o += text(x, 30, names[i], 'tb', 'middle') + line(x, 42, x, Y(53), 'axis'); });
  o += text(190, 46, `link 1：R = 1 Mbps，d${sub('prop')} = ${dp} ms`, 'ts', 'middle') + text(390, 46, `link 2：同样`, 'ts', 'middle');
  const band = (xa, xb, ts, cls) => poly([[xa, Y(ts)], [xa, Y(ts + dt)], [xb, Y(ts + dt + dp)], [xb, Y(ts + dp)]], cls);
  let lastArr = 0;
  for (let i = 0; i < 3; i++) {
    const s1 = i * dt; // link 1 开始发
    o += band(X[0], X[1], s1, i === 2 ? 'wash-strong' : 'wash');
    const recv = s1 + dt + dp; // router 收完整个 packet
    const s2 = Math.max(recv, (i ? i * dt + dt + dp : 0)); // link 2 空闲时才发
    o += band(X[1], X[2], s2, i === 2 ? 'wash-strong' : 'wash');
    o += text(X[0] - 8, Y(s1 + dt / 2) + 4, `packet ${i + 1}`, 'ts', 'end');
    lastArr = s2 + dt + dp;
  }
  // 时间刻度
  for (const t of [0, 8, 16, 24, 36, 44, 52]) o += line(X[2], Y(t), X[2] + 5, Y(t), 'axis') + text(X[2] + 9, Y(t) + 4, t + ' ms', 'ts', 'start');
  o += line(X[1] - 6, Y(dt + dp), X[1] + 6, Y(dt + dp), 'ink');
  o += text(X[1] + 10, Y(dt + dp) - 2, `收完 packet 1（${dt + dp} ms）才开始转发`, 'ts', 'start');
  o += text(X[0] + 8, Y(dt / 2) + 4, `L / R = ${dt} ms`, 'ts', 'start');
  o += text(280, Y(lastArr) + 34, `最后一个 bit 在 ${lastArr} ms 到达：(2 + 3 − 1) × ${dt} + 2 × ${dp} = ${lastArr}`, 'ts', 'middle');
  o += text(280, Y(lastArr) + 52, `若 24000 bit 整个不拆开发：2 × 24 + 2 × ${dp} = ${2 * 24 + 2 * dp} ms`, 'ts', 'middle');
  return svg(560, Y(lastArr) + 58, o, '三个 8000 bit 的 packet 经过一个 router，用 space-time 图画出每个 packet 在两条 link 上的传输：router 收完一个 packet 才转发，两条 link 同时在忙，最后一个 bit 在 52 ms 到达');
}

// ---------- 第 1 站：encapsulation 动图 ----------
function encapA() {
  const layers = ['application', 'transport', 'network', 'link', 'physical'];
  const cols = [{ x: 140, n: 5, name: 'host A' }, { x: 254, n: 2, name: 'switch' }, { x: 368, n: 3, name: 'router' }, { x: 488, n: 5, name: 'host B' }];
  const top = 40, rh = 40, bw = 100;
  const rowY = (k) => top + k * rh; // 第 k 层（0 = application）
  let o = '';
  layers.forEach((n, k) => { o += text(84, rowY(k) + 21, n, 'ts', 'end'); });
  cols.forEach((c) => {
    o += text(c.x, 26, c.name, 'tb', 'middle');
    for (let k = 5 - c.n; k < 5; k++) o += rect(c.x - bw / 2, rowY(k), bw, rh - 6, 'frame', 4);
  });
  // 线缆
  const wy = rowY(5) + 6;
  for (const c of cols) o += line(c.x, rowY(4) + rh - 6, c.x, wy, 'mute');
  o += line(cols[0].x, wy, cols[3].x, wy, 'mute');
  // PDU：从左往右依次是 Hl、Hn、Ht、M（Hl 在 router 之后换成 H′l）
  const W = { M: 34, H: 17 };
  const subl = (b, s) => b + '<tspan class="sub" dy="3">' + s + '</tspan><tspan dy="-3">\u200b</tspan>';
  const pduRects = (cx, y, set) => {
    const parts = [];
    if (set.includes('l')) parts.push(set.includes("'") ? 'Hl2' : 'Hl');
    if (set.includes('n')) parts.push('Hn');
    if (set.includes('t')) parts.push('Ht');
    parts.push('M');
    const w = parts.reduce((s, p) => s + (p === 'M' ? W.M : W.H), 0);
    let x = cx - w / 2, q = '';
    for (const p of parts) {
      const ww = p === 'M' ? W.M : W.H;
      q += rect(x, y, ww, 20, p === 'M' ? 'paper' : p === 'Hn' ? 'wash-strong' : p === 'Hl2' ? 'solid2' : 'wash', 2) + rect(x, y, ww, 20, 'frame', 2);
      const lab = p === 'M' ? 'M' : p === 'Hl2' ? subl('H′', 'l') : subl('H', p[1]);
      q += text(x + ww / 2, y + 14.5, lab, p === 'Hl2' ? 'tw' : 'ts', 'middle');
      x += ww;
    }
    return q;
  };
  const stage = [];
  const A = ['M', 'tM', 'ntM', 'lntM'];
  for (let k = 0; k < 4; k++) stage.push({ c: 0, k, set: A[k] });
  stage.push({ c: 1, k: 3, set: 'lntM' });
  stage.push({ c: 2, k: 3, set: 'lntM', in: true }, { c: 2, k: 2, set: 'ntM' }, { c: 2, k: 3, set: "l'ntM" });
  stage.push({ c: 3, k: 3, set: "l'ntM" }, { c: 3, k: 2, set: 'ntM' }, { c: 3, k: 1, set: 'tM' }, { c: 3, k: 0, set: 'M' });
  const pos = (s) => [cols[s.c].x, rowY(s.k) + 7];
  const dwell = 0.9, T = 0.02 + stage.length * dwell + 2.6, K = (t) => (t < 0 ? 0.01 / T : Math.min(1, (0.02 + t) / T));
  // 静态帧：每一层画出它的 PDU（router 的 link 层画出去的那一个）
  let stat = '';
  stage.forEach((s) => { if (s.in) return; const [cx, y] = pos(s); stat += pduRects(cx, y, s.set); });
  o += `<g>${stat}${ashow([1, 0, 1], [0, K(-1), K(stage.length * dwell)], T)}</g>`;
  // 动画：每个 stage 依次出现一个 dwell
  stage.forEach((s, i) => {
    const [cx, y] = pos(s);
    o += `<g opacity="0">${pduRects(cx, y, s.set)}${ashow([0, 0, 1, 0], [0, K(-1), K(i * dwell), K((i + 1) * dwell)], T)}</g>`;
  });
  o += text(280, rowY(5) + 30, 'M = message；加 Hₜ 成为 segment，再加 Hₙ 成为 datagram，再加 Hₗ 成为 frame', 'ts', 'middle');
  o += text(280, rowY(5) + 48, 'switch 只拆到 link 层；router 拆到 network 层查 IP 地址，换一个新的 link header H′ₗ（深色）再发出去', 'ts', 'middle');
  return svgA(560, rowY(5) + 56, o, '动图：host A 的 message 从 application 层往下，每层加一个 header；经过 switch 只到 link 层；经过 router 拆到 network 层再换新的 link header；到 host B 后逐层拆掉 header');
}

// ---------- 第 2 站：HTTP 三种连接方式（base HTML + 2 张图） ----------
function http() {
  let o = '';
  const rttH = 40, y0 = 66;
  const panel = (x0, title, rounds, note) => {
    const xc = x0 + 22, xs = x0 + 108;
    o += text(x0 + 88, 20, title, 'tb', 'middle');
    o += text(xc, 42, 'client', 'ts', 'middle') + text(xs, 42, 'server', 'ts', 'middle');
    const yE = y0 + rounds.length * rttH;
    o += line(xc, 50, xc, yE, 'axis') + line(xs, 50, xs, yE, 'axis');
    rounds.forEach((r, i) => {
      const ya = y0 + i * rttH, ym = ya + rttH / 2 - 2, yb = ya + rttH - 4;
      o += arrow(xc, ya, xs, ym, r[1] ? 'mute' : 'ink', 5) + arrow(xs, ym, xc, yb, r[1] ? 'mute' : 'ln', 5);
      o += text(xs + 6, ym + 4, r[0], 'ts', 'start');
      o += text(xc - 8, ya + rttH / 2 + 2, String(i + 1), 'ts', 'end');
    });
    o += text(x0 + 88, yE + 22, note, 'tl', 'middle');
  };
  const syn = ['handshake', true];
  panel(8, 'non-persistent', [syn, ['GET base'], syn, ['GET img1'], syn, ['GET img2']], '6 RTT');
  panel(194, 'persistent', [syn, ['GET base'], ['GET img1'], ['GET img2']], '4 RTT');
  panel(380, 'pipelining', [syn, ['GET base'], ['GET img1+2']], '3 RTT');
  const yb = y0 + 6 * rttH;
  o += text(280, yb + 48, '每一行是一个 RTT（左边的数字），忽略 transmission time。', 'ts', 'middle');
  o += text(280, yb + 66, '灰线是 TCP handshake（SYN、SYNACK），黑线是 request，彩线是 response。', 'ts', 'middle');
  return svg(560, yb + 72, o, '取一个 base HTML 加两张图片：non-persistent HTTP 每个 object 要 2 个 RTT，共 6 个；persistent 共 4 个；persistent 加 pipelining 共 3 个');
}

// ---------- 第 2 站：DNS iterative 查询 ----------
function dns() {
  let o = '';
  const H = [55, 150], Rv = [228, 150];
  const S = [[445, 46, 'root server', 'a.root-servers.net'], [445, 150, 'TLD server（.edu）', '192.5.6.30'], [445, 254, 'authoritative（berkeley.edu）', '128.32.136.3']];
  const box = (x, y, t1, t2, w = 124) => rect(x - w / 2, y - 22, w, 44, 'paper', 6) + text(x, y - 3, t1, 'tb', 'middle') + text(x, y + 14, t2, 'ts', 'middle');
  o += box(H[0], H[1], 'host', 'stub resolver', 100);
  o += box(Rv[0], Rv[1], 'local DNS', 'recursive resolver');
  for (const [x, y, a, b] of S) o += rect(x - 92, y - 22, 184, 44, 'paper', 6) + text(x, y - 3, a, 'tb', 'middle') + text(x, y + 14, b, 'ts', 'middle');
  // 1, 8：host ↔ local
  o += arrow(H[0] + 52, H[1] - 8, Rv[0] - 64, Rv[1] - 8, 'ink', 6) + arrow(Rv[0] - 64, Rv[1] + 8, H[0] + 52, H[1] + 8, 'ln', 6);
  o += text((H[0] + Rv[0]) / 2 - 6, H[1] - 14, '1', 'tb', 'middle') + text((H[0] + Rv[0]) / 2 - 6, H[1] + 24, '8', 'tl', 'middle');
  // 2..7：local ↔ 三个 server
  const pairs = [[2, 3, 'NS a.edu-servers.net'], [4, 5, 'NS adns1.berkeley.edu'], [6, 7, 'A 23.185.0.1，TTL 86400']];
  S.forEach(([x, y], i) => {
    const xa = Rv[0] + 62, xb = x - 92;
    const ya = Rv[1] - 12 + i * 12, yb = y;
    const dx = xb - xa, dy = yb - ya, L = Math.hypot(dx, dy), nx = -dy / L * 6, ny = dx / L * 6;
    o += arrow(xa + nx, ya + ny - 2, xb + nx, yb + ny - 2, 'ink', 6) + arrow(xb - nx, yb - ny + 2, xa - nx, ya - ny + 2, 'ln', 6);
    const mx = xa + dx * 0.55, my = ya + dy * 0.55;
    o += text(mx + nx * 2.4, my + ny * 2.4 + 4, String(pairs[i][0]), 'tb', 'middle') + text(mx - nx * 2.4, my - ny * 2.4 + 4, String(pairs[i][1]), 'tl', 'middle');
    o += text(x, y + 36, '回答 ' + pairs[i][1] + '：' + pairs[i][2], 'ts', 'middle');
  });
  o += text(40, 214, '查询 eecs.berkeley.edu：', 'ts', 'start') + text(40, 232, '黑线是 query，彩线是 reply；', 'ts', 'start') + text(40, 250, 'root 和 TLD 只回答“去问谁”。', 'ts', 'start');
  return svg(560, 300, o, 'DNS iterative 查询：host 问 local DNS，local DNS 依次问 root、.edu 的 TLD server、berkeley.edu 的 authoritative server，前两个只给出下一个该问的 server，最后一个给出 A record');
}

// ---------- 第 3 站：stop-and-wait 与 pipelining ----------
function stopwait() {
  const Lr = 0.008, RTT = 30; // ms
  let o = '';
  const u = 14, y0 = 60; // 1 个 L/R 单位（图里放大画）= 14 px；RTT 画成 8 个单位
  const Ld = 1, Rd = 8;
  const panel = (x0, title, n) => {
    const xs = x0 + 30, xr = x0 + 210;
    o += text((xs + xr) / 2, 22, title, 'tb', 'middle') + text(xs, 44, 'sender', 'ts', 'middle') + text(xr, 44, 'receiver', 'ts', 'middle');
    const Yb = y0 + (Rd + Ld + 2) * u;
    o += line(xs, 50, xs, Yb, 'axis') + line(xr, 50, xr, Yb, 'axis');
    for (let i = 0; i < n; i++) {
      const t = i * Ld;
      o += poly([[xs, y0 + t * u], [xs, y0 + (t + Ld) * u], [xr, y0 + (t + Ld + Rd / 2) * u], [xr, y0 + (t + Rd / 2) * u]], 'wash-strong');
      const ta = t + Ld + Rd / 2;
      o += arrow(xr, y0 + ta * u, xs, y0 + (ta + Rd / 2) * u, 'mute', 5);
    }
    o += rect(xs - 7, y0, 7, n * Ld * u, 'solid');
    o += line(xs - 16, y0, xs - 16, y0 + (Ld + Rd) * u, 'ink') + line(xs - 20, y0, xs - 12, y0, 'ink') + line(xs - 20, y0 + (Ld + Rd) * u, xs - 12, y0 + (Ld + Rd) * u, 'ink');
    o += text(xs - 22, y0 + (Ld + Rd) * u / 2 + 4, 'RTT + L/R', 'ts', 'end');
    return Yb;
  };
  const yb = panel(70, 'stop-and-wait：一次一个', 1);
  panel(330, 'pipelining：一次三个', 3);
  const U1 = Lr / (RTT + Lr), U3 = 3 * U1;
  o += text(280, yb + 22, `实际数字：R = 1 Gbps，L = 8000 bit，L/R = ${Lr * 1000} µs，RTT = ${RTT} ms（图里 L/R 放大了很多倍）`, 'ts', 'middle');
  o += text(280, yb + 42, `U = (L/R) / (RTT + L/R)：一次一个 ${U1.toFixed(5)}；一次三个 ${U3.toFixed(5)}，正好 3 倍`, 'ts', 'middle');
  return svg(560, yb + 50, o, 'stop-and-wait 每发一个 packet 都要等一个 RTT 才能发下一个，sender 绝大部分时间空闲；pipelining 在同一个 RTT 里连发三个，utilization 是 3 倍');
}

// ---------- 第 3 站：GBN / SR 动图（同一个 packet loss 场景） ----------
function simARQ(mode) {
  const N = 4, D = 3, TO = 8, NP = 6;
  const msgs = []; // {dir, t0, t1, label, lost, note, noteT}
  const sendT = {}, acked = new Set(), ackTime = {}, sentFirst = {};
  let base = 0, next = 0, lastSend = -1, firstLossDone = false;
  const rcv = { exp: 0, buf: new Set(), deliverT: {}, bufT: {} };
  const pend = []; // 待发的重传
  const events = []; // [t, kind, data]
  const sendPkt = (t, s, re) => {
    const lost = s === 2 && !firstLossDone; if (lost) firstLossDone = true;
    sendT[s] = t; if (sentFirst[s] === undefined) sentFirst[s] = t;
    msgs.push({ dir: 's', t0: t, t1: lost ? t + D / 2 : t + D, label: 'pkt' + s, lost, re });
    if (!lost) events.push([t + D, 'rcvPkt', s]);
    lastSend = t;
  };
  const sendAck = (t, a, note) => { msgs.push({ dir: 'r', t0: t, t1: t + D, label: 'ack' + a, note }); events.push([t + D, 'rcvAck', a]); };
  const senderNotes = [];
  for (let t = 0; t <= 40; t++) {
    // receiver
    for (const [et, k, s] of events.filter((e) => e[0] === t && e[1] === 'rcvPkt')) {
      if (mode === 'gbn') {
        if (s === rcv.exp) { rcv.deliverT[s] = t; rcv.exp++; sendAck(t, s, ''); }
        else sendAck(t, rcv.exp - 1, `pkt${s} 乱序：丢弃，再发 ack${rcv.exp - 1}`);
      } else {
        if (s >= rcv.exp && s < rcv.exp + N) {
          if (s === rcv.exp) {
            rcv.buf.add(s); rcv.bufT[s] = rcv.bufT[s] ?? t;
            const got = []; while (rcv.buf.has(rcv.exp)) { rcv.deliverT[rcv.exp] = t; got.push(rcv.exp); rcv.buf.delete(rcv.exp); rcv.exp++; }
            sendAck(t, s, got.length > 1 ? `交付 pkt${got[0]}–${got[got.length - 1]}` : '');
          } else { rcv.buf.add(s); rcv.bufT[s] = t; sendAck(t, s, `pkt${s} 先存进 buffer`); }
        } else sendAck(t, s, '');
      }
    }
    // sender：ACK
    for (const [et, k, a] of events.filter((e) => e[0] === t && e[1] === 'rcvAck')) {
      if (mode === 'gbn') {
        if (a >= base) { for (let s = base; s <= a; s++) { acked.add(s); ackTime[s] = t; } base = a + 1; senderNotes.push([t, `ack${a}：base → ${base}`]); }
        else senderNotes.push([t, `重复的 ack${a}，不动`]);
      } else {
        if (!acked.has(a)) { acked.add(a); ackTime[a] = t; const ob = base; while (acked.has(base)) base++; senderNotes.push([t, base !== ob ? `ack${a}：base → ${base}` : `ack${a}：标记，base 仍是 ${base}`]); }
      }
    }
    // timeout
    if (mode === 'gbn') {
      if (base < next && sendT[base] + TO === t && !pend.length) { for (let s = base; s < next; s++) pend.push(s); senderNotes.push([t, `timeout：再发 ${base}–${next - 1}`]); }
    } else {
      for (let s = base; s < next; s++) if (!acked.has(s) && sendT[s] + TO === t) { pend.push(s); senderNotes.push([t, `timeout：只再发 pkt${s}`]); }
    }
    // 发：每个时间单位最多发一个
    if (pend.length) sendPkt(t, pend.shift(), true);
    else if (next < base + N && next < NP) { sendPkt(t, next, false); next++; }
  }
  const tEnd = Math.max(...msgs.map((m) => m.t1));
  return { msgs, senderNotes, ackTime, sentFirst, rcv, tEnd, N, D, TO, NP, nSent: msgs.filter((m) => m.dir === 's').length };
}
function arqA(mode) {
  const S = simARQ(mode);
  const xs = 196, xr = 372, y0 = 118, u = 14;
  const Y = (t) => y0 + t * u;
  const k = 0.42, hold = 3.2, Tend = S.tEnd + 1, T = 0.02 + Tend * k + hold;
  const K = (t) => (t < 0 ? 0.01 / T : (0.02 + t * k) / T);
  let o = '';
  o += text(xs, 108, 'sender', 'tb', 'middle') + text(xr, 108, 'receiver', 'tb', 'middle');
  o += line(xs, 112, xs, Y(Tend), 'axis') + line(xr, 112, xr, Y(Tend), 'axis');
  // 窗口条：sender 在左上，receiver 在右上
  const bw = 15, nb = 10;
  const strip = (x0, y, title) => { let q = text(x0, y - 8, title, 'ts', 'start'); for (let i = 0; i < nb; i++) q += rect(x0 + i * bw, y, bw, 18, 'frame') + text(x0 + i * bw + bw / 2, y + 13.5, String(i), 'ts', 'middle'); return q; };
  const sx0 = 34, rx0 = 360, sy = 40, ry = 40;
  o += strip(sx0, sy, 'sender：深色 = 已 ACK，浅色 = 已发未 ACK');
  o += text(sx0, sy + 36, '框 = sender window（N = 4）', 'ts', 'start');
  o += strip(rx0, ry, mode === 'gbn' ? 'receiver：深色 = 已交付' : 'receiver：浅色 = buffer，深色 = 已交付');
  // sender 每个格子的状态
  for (let s = 0; s < S.NP; s++) {
    const x = sx0 + s * bw;
    const tS = S.sentFirst[s], tA = S.ackTime[s];
    o += `<rect x="${x + 1}" y="${sy + 1}" width="${bw - 2}" height="16" class="wash" opacity="0">${ashow([0, 0, 1, 0], [0, K(-1), K(tS), K(tA)], T)}</rect>`;
    o += `<rect x="${x + 1}" y="${sy + 1}" width="${bw - 2}" height="16" class="solid2" opacity="0.55">${anim('opacity', [0.55, 0, 0.55], [0, K(-1), K(tA)], T, true)}</rect>`;
    const r = S.rcv;
    if (mode === 'sr' && r.bufT[s] !== undefined && r.bufT[s] < r.deliverT[s]) o += `<rect x="${rx0 + s * bw + 1}" y="${ry + 1}" width="${bw - 2}" height="16" class="wash-strong" opacity="0">${ashow([0, 0, 1, 0], [0, K(-1), K(r.bufT[s]), K(r.deliverT[s])], T)}</rect>`;
    o += `<rect x="${rx0 + s * bw + 1}" y="${ry + 1}" width="${bw - 2}" height="16" class="solid2" opacity="0.55">${anim('opacity', [0.55, 0, 0.55], [0, K(-1), K(r.deliverT[s])], T, true)}</rect>`;
  }
  // window 框：base 随时间变
  const baseAt = (t) => { let b = 0; while (S.ackTime[b] !== undefined && S.ackTime[b] <= t) b++; return b; };
  const ts = [...new Set([0, ...Object.values(S.ackTime)])].sort((a, b) => a - b);
  const vx = [sx0 + baseAt(1e9) * bw, ...ts.map((t) => sx0 + baseAt(t) * bw)];
  const vk = [0, ...ts.map((t, i) => (i === 0 ? K(-1) : K(t)))];
  const wW = Math.min(S.N, nb - baseAt(1e9)) * bw;
  o += `<rect x="${vx[0]}" y="${sy - 2}" width="${S.N * bw}" height="22" class="ln" rx="2">${anim('x', vx, vk, T, true)}</rect>`;
  // receiver 的 window（SR 才有 N 格；GBN 只有一个 expectedseqnum）
  const rN = mode === 'gbn' ? 1 : S.N;
  const rts = [...new Set([0, ...Object.values(S.rcv.deliverT)])].sort((a, b) => a - b);
  const rAt = (t) => { let b = 0; while (S.rcv.deliverT[b] !== undefined && S.rcv.deliverT[b] <= t) b++; return b; };
  const rvx = [rx0 + rAt(1e9) * bw, ...rts.map((t) => rx0 + rAt(t) * bw)];
  const rvk = [0, ...rts.map((t, i) => (i === 0 ? K(-1) : K(t)))];
  o += `<rect x="${rvx[0]}" y="${ry - 2}" width="${rN * bw}" height="22" class="ln" rx="2">${anim('x', rvx, rvk, T, true)}</rect>`;
  o += text(rx0, ry + 36, mode === 'gbn' ? '框 = expectedseqnum' : '框 = receiver window', 'ts', 'start');
  // 消息
  for (const m of S.msgs) {
    const [xa, xb] = m.dir === 's' ? [xs, xr] : [xr, xs];
    const ya = Y(m.t0), xe = m.lost ? (xa + xb) / 2 : xb, ye = Y(m.t1);
    const cls = m.dir === 's' ? (m.re ? 'ln' : 'ink') : 'mute';
    const full = `M${f1(xa)} ${f1(ya)}L${f1(xe)} ${f1(ye)}`, deg = `M${f1(xa)} ${f1(ya)}L${f1(xa)} ${f1(ya)}`;
    o += `<path d="${full}" class="${cls}">${anim('d', [full, deg, deg, full, full], [0, K(-1), K(m.t0), K(m.t1), 1], T)}</path>`;
    if (m.lost) o += g(text(xe, ye + 5, '✕', 'tl', 'middle'), showAt(m.t1, K, T));
    else o += g(head(xa, ya, xe, ye, cls.split(' ')[0] + '-f', 6), showAt(m.t1, K, T));
    if (m.dir === 's') o += g(text(xs - 6, ya + 4, m.label, m.re ? 'tl' : 't', 'end'), showAt(m.t0, K, T));
    else o += g(text(xr + 6, ya + 4, m.label + (m.note ? '　' + m.note : ''), 'ts', 'start'), showAt(m.t0, K, T));
  }
  // sender 的事件注记：写在最左边
  const used = {};
  for (const [t, s] of S.senderNotes) {
    let yy = Y(t) + 4; while (used[Math.round(yy)]) yy += 13; used[Math.round(yy)] = 1;
    o += g(text(xs - 52, yy, s, 'ts', 'end'), showAt(t, K, T));
  }
  const retx = S.nSent - S.NP;
  o += text(280, Y(Tend) + 22, `${S.NP} 个 packet 一共发了 ${S.nSent} 次（retransmit ${retx} 次），最后一个 ACK 在 t = ${S.tEnd} 到达。`, 'tb', 'middle');
  o += text(280, Y(Tend) + 40, `单程 ${S.D} 个时间单位，每单位最多发一个 packet，timeout = ${S.TO}，pkt2 第一次发送时丢失。彩色 = retransmit。`, 'ts', 'middle');
  const desc = mode === 'gbn'
    ? '动图：Go-Back-N，window 为 4，pkt2 丢失；receiver 丢弃后面乱序到达的 pkt3、4、5 并重复发 ack1；pkt2 timeout 后 sender retransmit 2 到 5'
    : '动图：Selective Repeat，window 为 4，pkt2 丢失；receiver 把 pkt3、4、5 存进 buffer 并分别 ACK；pkt2 timeout 后只 retransmit pkt2，到达后一次交付 2 到 5';
  return svgA(560, Y(Tend) + 48, o, desc);
}
const gbnA = () => arqA('gbn');
const srA = () => arqA('sr');

// ---------- 第 3 站：SR 的 sequence number 不够用 ----------
function srdilemma() {
  let o = '';
  const seq = [0, 1, 2, 3, 0, 1, 2];
  const bw = 12;
  const strip = (x0, y, w0) => {
    let q = '';
    seq.forEach((s, i) => { q += rect(x0 + i * bw, y, bw, 16, 'frame') + text(x0 + i * bw + bw / 2, y + 12.5, String(s), 'ts', 'middle'); });
    return q + rect(x0 + w0 * bw, y - 2, 3 * bw, 20, 'ln', 2);
  };
  const panel = (x0, title, lost, verdict, good) => {
    const xs = x0 + 100, xr = x0 + 180;
    o += text(x0 + 140, 20, title, 'tb', 'middle');
    o += text(xs, 42, 'sender', 'ts', 'middle') + text(xr, 42, 'receiver', 'ts', 'middle');
    o += line(xs, 50, xs, 258, 'axis') + line(xr, 50, xr, 258, 'axis');
    o += strip(x0 + 6, 56, 0) + text(x0 + 6, 88, '一开始的 window', 'ts', 'start');
    [0, 1, 2].forEach((k) => {
      const y1 = 98 + k * 14, y2 = y1 + 26;
      o += arrow(xs, y1, xr, y2, 'ink', 5) + text(xs - 6, y1 + 4, 'pkt' + k, 't', 'end');
      const a1 = y2, a2 = a1 + 26;
      if (lost) o += line(xr, a1, (xs + xr) / 2, (a1 + a2) / 2, 'mute') + text((xs + xr) / 2 - 1, (a1 + a2) / 2 + 5, '✕', 'tl', 'middle');
      else o += arrow(xr, a1, xs, a2, 'mute', 5);
      o += text(xr + 6, a1 + 4, 'ack' + k, 'ts', 'start');
    });
    o += strip(x0 + 186, 166, 3) + text(x0 + 186, 198, '收完 0、1、2', 'ts', 'start');
    if (!lost) {
      o += strip(x0 + 6, 166, 3) + text(x0 + 6, 198, 'ACK 到齐后', 'ts', 'start');
      o += arrow(xs, 212, xr, 238, 'ln', 5) + text(xs - 6, 216, 'pkt3', 't', 'end');
      o += arrow(xs, 230, xr, 256, 'ln', 5) + text(xs - 6, 234, 'pkt0（新）', 'tl', 'end');
    } else {
      o += strip(x0 + 6, 166, 0) + text(x0 + 6, 198, 'ACK 全丢，没动', 'ts', 'start');
      o += arrow(xs, 230, xr, 256, 'ln', 5) + text(xs - 6, 216, 'timeout', 'ts', 'end') + text(xs - 6, 234, 'pkt0（旧）', 'tl', 'end');
    }
    o += text(xr + 6, 252, '收下 0', 'ts', 'start');
    o += text(x0 + 140, 282, verdict, good ? 'tb' : 'tl', 'middle');
  };
  panel(0, '(a) 三个 ACK 都到了', false, '收下新的 pkt0：正确', true);
  panel(282, '(b) 三个 ACK 都丢了', true, '旧的 pkt0 被当成新数据：错误', false);
  o += text(280, 308, '只有 0–3 四个编号，window = 3。两种情况下 receiver 收到的东西一模一样，', 'ts', 'middle');
  o += text(280, 326, '它的 window 都是 {3, 0, 1}，编号为 0 的 packet 都落在里面。', 'ts', 'middle');
  return svg(560, 332, o, 'Selective Repeat 用 0 到 3 四个 sequence number、window 为 3 时，receiver 分不清新发的 pkt0 和 timeout 后 retransmit 的旧 pkt0');
}

// ---------- 第 4 站：TCP 的 byte sequence number 与 fast retransmit ----------
function fastrtx() {
  let o = '';
  const xs = 190, xr = 390, y0 = 50, u = 16;
  const Y = (t) => y0 + t * u;
  o += text(xs, 26, 'sender', 'tb', 'middle') + text(xr, 26, 'receiver', 'tb', 'middle');
  o += line(xs, 34, xs, Y(15.5), 'axis') + line(xr, 34, xr, Y(15.5), 'axis');
  const D = 4;
  const segs = [1000, 1100, 1200, 1300, 1400];
  segs.forEach((s, i) => {
    const t = i;
    if (s === 1100) { o += line(xs, Y(t), (xs + xr) / 2, Y(t + D / 2), 'ink') + text((xs + xr) / 2, Y(t + D / 2) + 5, '✕', 'tl', 'middle'); }
    else o += arrow(xs, Y(t), xr, Y(t + D), 'ink', 5);
    o += text(xs - 6, Y(t) + 4, `Seq = ${s}`, 'ts', 'end');
  });
  // ACK：1000 段到达 → ACK 1100；1200、1300、1400 到达 → 三个重复的 ACK 1100
  const acks = [[0 + D, 1100, ''], [2 + D, 1100, 'dup 1'], [3 + D, 1100, 'dup 2'], [4 + D, 1100, 'dup 3']];
  acks.forEach(([t, a, n]) => { o += arrow(xr, Y(t), xs, Y(t + D), 'mute', 5); o += text(xr + 6, Y(t) + 4, `ACK = ${a}${n ? '（' + n + '）' : ''}`, 'ts', 'start'); });
  const tr = 4 + 2 * D; // 第三个重复 ACK 到达
  o += arrow(xs, Y(tr), xr, Y(tr + D / 2 + 0.6), 'ln', 5);
  o += text(xs - 6, Y(tr) - 10, '第 3 个 dup ACK：', 'tl', 'end') + text(xs - 6, Y(tr) + 6, 'Retransmit Seq = 1100', 'tl', 'end');
  o += arrow(xr, Y(tr + D / 2 + 0.6), xs, Y(tr + D / 2 + 0.6 + 1.2), 'mute', 5);
  o += text(xr + 6, Y(tr + D / 2 + 0.6) + 4, 'ACK = 1500', 'ts', 'start') + text(xr + 6, Y(tr + D / 2 + 0.6) + 20, '（1200–1499 早已在 buffer）', 'ts', 'start');
  return svg(560, Y(15.5) + 14, o, 'TCP 用 byte 编号：Seq = 1100 的 segment 丢失，receiver 收到后面三个 segment 时都回 ACK 1100；sender 收到第三个重复 ACK 就立刻 retransmit，不等 timeout，receiver 随后回 ACK 1500');
}

// ---------- 第 4 站：cwnd 演化动图 ----------
function cwndSeq() {
  // 每个 RTT round 的 cwnd（单位 MSS），Reno：3 dup ACK 减半，timeout 回到 1
  const rows = []; let cw = 1, th = 16;
  const ev = { 9: 'dup', 14: 'to' };
  for (let r = 1; r <= 20; r++) {
    rows.push({ r, cw, th, ev: ev[r] || '' });
    if (ev[r] === 'dup') { th = cw / 2; cw = th; }
    else if (ev[r] === 'to') { th = cw / 2; cw = 1; }
    else cw = cw < th ? Math.min(2 * cw, th) : cw + 1;
  }
  return rows;
}
function cwndA() {
  const rows = cwndSeq();
  const sx = lin(0.5, 20.5, 60, 540), bh = 8.4, yb = 262;
  const sy = (v) => yb - v * bh;
  let o = '';
  const K0 = 0.02, step = 0.55, hold = 3, T = K0 + rows.length * step + hold;
  const K = (t) => (t < 0 ? 0.01 / T : (K0 + t * step) / T);
  // 坐标
  for (const v of [0, 5, 10, 15, 20]) o += line(56, sy(v), 540, sy(v), 'grid') + text(52, sy(v) + 4, String(v), 'ts', 'end');
  o += text(56, 44, 'cwnd（MSS）：每一列是这个 RTT 里发出的 segment，一格一个', 'ts', 'start');
  rows.forEach((w, i) => { if (w.r % 2 === 1 || w.r === 20) o += text(sx(w.r), yb + 16, String(w.r), 'ts', 'middle'); });
  o += text(540, yb + 32, 'transmission round（RTT）', 'ts', 'end');
  // ssthresh 阶梯线（静态）
  const thPts = [];
  rows.forEach((w) => { if (w.th <= 20) { thPts.push([sx(w.r) - 12, sy(w.th)], [sx(w.r) + 12, sy(w.th)]); } });
  o += path(d(thPts), 'ln-dash');
  o += text(sx(4) - 8, sy(16) - 6, 'ssthresh = 16', 'tl', 'end');
  // 列
  rows.forEach((w, i) => {
    let col = '';
    for (let k = 0; k < w.cw; k++) col += rect(sx(w.r) - 9, sy(k + 1) + 1, 18, bh - 2, w.cw <= w.th && w.r < 6 || (w.r >= 15 && w.r <= 18) ? 'wash-strong' : 'wash');
    if (w.ev) col += rect(sx(w.r) - 9, sy(w.cw) + 1, 18, bh - 2, 'solid');
    o += `<g>${col}${showAt(i, K, T)}</g>`;
  });
  // 事件标注
  const lab = (r, s1, s2) => { const w = rows[r - 1]; o += `<g>${text(sx(r) + 14, sy(w.cw) + 8, s1, 'tl', 'start') + text(sx(r) + 14, sy(w.cw) + 24, s2, 'ts', 'start')}${showAt(r - 1, K, T)}</g>`; };
  lab(9, '3 dup ACK', 'ssthresh = cwnd = 10');
  lab(14, 'timeout', 'ssthresh = 7，cwnd = 1');
  o += text(sx(3), sy(8) - 6, 'slow start', 'ts', 'middle') + text(sx(6.2), sy(19) - 6, 'congestion avoidance', 'ts', 'middle');
  o += text(sx(15.5), yb - 42, 'slow start，', 'ts', 'middle') + text(sx(15.5), yb - 28, '到 7 为止', 'ts', 'middle');
  // 读数（动画时逐行换）
  const desc = (w) => {
    const ph = w.cw < w.th ? 'slow start：每个 ACK 加 1，一个 RTT 翻倍' : 'congestion avoidance：一个 RTT 加 1';
    return `round ${w.r}：cwnd = ${w.cw}，ssthresh = ${w.th}　${w.ev === 'dup' ? '这一轮收到 3 个 dup ACK' : w.ev === 'to' ? '这一轮 timeout' : ph}`;
  };
  rows.forEach((w, i) => { o += `<g opacity="0">${text(60, 20, desc(w), 'tb', 'start')}${ashow([0, 0, 1, 0], [0, K(-1), K(i), K(i + 1)], T)}</g>`; });
  o += `<g>${text(60, 20, 'TCP Reno，MSS 为单位：slow start → AIMD → 3 dup ACK 减半 → timeout 回到 1', 'tb', 'start')}${ashow([1, 0, 1], [0, K(-1), K(rows.length)], T)}</g>`;
  return svgA(560, yb + 38, o, '动图：TCP Reno 的 cwnd 逐个 RTT 变化：从 1 开始 slow start 翻倍到 ssthresh 16，之后每个 RTT 加 1 到 20；收到 3 个 duplicate ACK 后减半到 10，再线性增长到 14；timeout 后 cwnd 回到 1、ssthresh 变成 7');
}

// ---------- 第 5 站：longest prefix match ----------
function lpm() {
  // 地址用第三个 byte 表示（前两个 byte 都是 200.23）
  const sx = lin(14, 34, 40, 540), ax = 170;
  let o = '';
  const pre = [[16, 24, '200.23.16.0/21', 'interface 0', 108], [24, 32, '200.23.24.0/21', 'interface 2', 108]];
  for (const [a, b, n, itf, y] of pre) {
    o += rect(sx(a), y, sx(b) - sx(a), 34, 'wash') + rect(sx(a), y, sx(b) - sx(a), 34, 'frame');
    o += text((sx(a) + sx(b)) / 2 + (a === 24 ? 30 : 0), y + 14, n, 'ts', 'middle') + text((sx(a) + sx(b)) / 2 + (a === 24 ? 30 : 0), y + 29, itf, 'tb', 'middle');
  }
  o += rect(sx(24), 62, sx(25) - sx(24), 30, 'wash-strong') + rect(sx(24), 62, sx(25) - sx(24), 30, 'frame');
  o += text(sx(24) - 6, 74, '200.23.24.0/24', 'ts', 'end') + text(sx(24) - 6, 89, 'interface 1', 'tb', 'end');
  o += line(sx(14), ax, sx(34), ax, 'axis');
  for (let v = 14; v <= 34; v += 2) o += line(sx(v), ax - 4, sx(v), ax + 4, 'axis') + text(sx(v), ax + 18, String(v), 'ts', 'middle');
  o += text(sx(34), ax + 34, '地址的第三个 byte（前两个 byte 都是 200.23）', 'ts', 'end');
  const tests = [[22 + 161 / 256, '200.23.22.161：只 match 第一条 → interface 0'], [24 + 170 / 256, '200.23.24.170：第二、三条都 match，/24 更长 → interface 1'], [30 + 5 / 256, '200.23.30.5：只 match 第三条 → interface 2']];
  const mark = ['①', '②', '③'];
  tests.forEach(([v, s], i) => {
    o += line(sx(v), 50, sx(v), ax, 'ink') + circle(sx(v), ax, 3.5, 'ink-f') + text(sx(v), 42, mark[i], 'tb', 'middle');
    o += text(40, 228 + i * 18, mark[i] + ' ' + s, 'ts', 'start');
  });
  o += text(40, 282, '200.23.40.1：都不 match → default（interface 3）', 'ts', 'start');
  return svg(560, 292, o, '三条 forwarding 规则画成地址区间：200.23.16.0/21 和 200.23.24.0/21 是两段长度相同的区间，200.23.24.0/24 是第二段里的一小段；落在小段里的地址两条都 match，按最长的 prefix 走 interface 1');
}

// ---------- 第 6 站：Dijkstra 动图（Kurose & Ross 的 6 点图） ----------
const GR = { nodes: { u: [40, 150], v: [130, 62], w: [250, 62], x: [130, 238], y: [250, 238], z: [330, 150] },
  edges: [['u', 'v', 2], ['u', 'w', 5], ['u', 'x', 1], ['v', 'x', 2], ['v', 'w', 3], ['x', 'w', 3], ['x', 'y', 1], ['w', 'y', 1], ['w', 'z', 5], ['y', 'z', 2]] };
function dijkstraSteps(src = 'u') {
  const names = Object.keys(GR.nodes), D = {}, P = {};
  names.forEach((n) => { D[n] = Infinity; P[n] = null; }); D[src] = 0;
  const done = [], steps = [];
  while (done.length < names.length) {
    const cand = names.filter((n) => !done.includes(n));
    cand.sort((a, b) => D[a] - D[b] || (b < a ? -1 : 1)); // tie：按 Kurose & Ross 课本，先取字母靠后的（y 先于 v）
    const m = cand[0]; done.push(m);
    for (const [a, b, c] of GR.edges) {
      const o = a === m ? b : b === m ? a : null;
      if (o && !done.includes(o) && D[m] + c < D[o]) { D[o] = D[m] + c; P[o] = m; }
    }
    steps.push({ add: m, D: { ...D }, P: { ...P }, done: [...done] });
  }
  return steps;
}
function dijkstraA() {
  const steps = dijkstraSteps();
  const N = GR.nodes;
  const fin = steps[steps.length - 1];
  const K0 = 0.02, st = 1.5, hold = 3, T = K0 + steps.length * st + hold;
  const K = (t) => (t < 0 ? 0.01 / T : (K0 + t * st) / T);
  const at = (i) => (i < 0 ? null : steps[i]);
  let o = '';
  // edges：静态帧显示最终 tree；动画里按步骤变色
  for (const [a, b, c] of GR.edges) {
    const [x1, y1] = N[a], [x2, y2] = N[b];
    const inTree = (s) => s && ((s.P[b] === a && s.done.includes(b)) || (s.P[a] === b && s.done.includes(a)));
    o += line(x1, y1, x2, y2, 'mute');
    const on = [inTree(fin), false, ...steps.map((s) => inTree(s))];
    const kt = [0, K(-1), ...steps.map((_, i) => K(i))];
    o += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="ln" opacity="${on[0] ? 1 : 0}">${ashow(on, kt, T)}</line>`;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    const ox = -dy / L * 11, oy = dx / L * 11;
    o += circle(mx + ox, my + oy, 8, 'paper-f') + text(mx + ox, my + oy + 4.5, String(c), 'ts', 'middle');
  }
  // nodes
  for (const [n, [x, y]] of Object.entries(N)) {
    const on = [1, n === 'u' ? 0 : 0, ...steps.map((s) => (s.done.includes(n) ? 1 : 0))];
    const kt = [0, K(-1), ...steps.map((_, i) => K(i))];
    o += circle(x, y, 15, 'paper') + `<circle cx="${x}" cy="${y}" r="13.5" class="wash-strong">${ashow(on, kt, T)}</circle>`;
    o += text(x, y + 5, n, 'tb', 'middle');
    // D 和 predecessor 的标签：每一步一个版本
    if (n === 'u') continue;
    const lab = (s) => (s.D[n] === Infinity ? '∞' : `${s.D[n]}，${s.P[n]}`);
    const lx = x + (x < 190 ? -20 : 20), ly = y + (y < 150 ? -18 : 30), anc = x < 190 ? 'end' : 'start';
    const fx = n === 'z' ? x : lx, fa = n === 'z' ? 'middle' : anc, fy = n === 'z' ? y - 24 : ly;
    o += `<g>${text(fx, fy, lab(fin), 'tl', fa)}${ashow([1, 0], [0, K(-1)], T)}</g>`;
    // 初始（只有 u 的邻居）
    const init = { v: '2，u', w: '5，u', x: '1，u', y: '∞', z: '∞' };
    const vers = [init[n], ...steps.map(lab)];
    vers.forEach((s, i) => {
      const t0 = i === 0 ? -1 : i - 1, t1 = i === vers.length - 1 ? null : i;
      // i=0：u 刚加入后的值；之后每加入一个点更新一次
      if (i === 0) return;
      const on = [0, 0, 1]; const kt = [0, K(-1), K(i - 1)];
      if (i < vers.length - 1) { on.push(0); kt.push(K(i)); }
      o += `<g opacity="0">${text(fx, fy, s, 'tl', fa)}${ashow(on, kt, T)}</g>`;
    });
  }
  // 右边：逐步列出
  const X = 372;
  o += text(X, 22, '从 u 出发', 'tb', 'start') + text(X + 62, 22, '标签：D，predecessor', 'ts', 'start');
  steps.forEach((s, i) => {
    const t = `${i + 1}. 加入 ${s.add}（D = ${s.D[s.add]}）`;
    o += `<g>${text(X, 50 + i * 20, t, i === steps.length - 1 ? 't' : 't', 'start')}${showAt(i, K, T)}</g>`;
  });
  // u 的 forwarding table
  const first = (n) => { let c = n; while (fin.P[c] && fin.P[c] !== 'u') c = fin.P[c]; return c; };
  o += text(X, 196, 'u 的 forwarding table', 'tb', 'start');
  ['v', 'w', 'x', 'y', 'z'].forEach((n, i) => { o += text(X + (i % 3) * 62, 218 + Math.floor(i / 3) * 18, `${n} → ${first(n)}`, 'ts', 'start'); });
  o += `<g>${text(X, 262, '彩色的 edge 组成 shortest-path tree', 'ts', 'start')}</g>`;
  return svgA(560, 272, o, '动图：在 6 个点的图上从 u 出发跑 Dijkstra，依次加入 u、x、y、v、w、z，每加入一个点更新邻居的 D 和 predecessor，彩色 edge 组成 shortest-path tree');
}

// ---------- 第 6 站：distance vector 的 count-to-infinity 动图 ----------
function dvSeq() {
  // x–y 4，y–z 1，x–z 50；x–y 变成 60。y、z 轮流更新 D(·, x)
  const cxy = 60, cxz = 50, cyz = 1;
  let Dy = 4, Dz = 5, vy = 'x', vz = 'y';
  const seq = [{ who: '—', Dy, Dz, vy, vz }];
  for (let i = 0; i < 200; i++) {
    // y 先算（它先发现 link cost 变了），用 z 上一次告诉它的值
    const ny = Math.min(cxy, cyz + Dz); const nvy = cxy <= cyz + Dz ? 'x' : 'z';
    let changed = ny !== Dy || nvy !== vy; Dy = ny; vy = nvy; if (changed) seq.push({ who: 'y', Dy, Dz, vy, vz });
    const nz = Math.min(cxz, cyz + Dy); const nvz = cxz <= cyz + Dy ? 'x' : 'y';
    const ch2 = nz !== Dz || nvz !== vz; Dz = nz; vz = nvz; if (ch2) seq.push({ who: 'z', Dy, Dz, vy, vz });
    if (!changed && !ch2) break;
  }
  return seq;
}
function dvA() {
  const seq = dvSeq();
  const n = seq.length;
  const K0 = 0.02, st = 0.32, hold = 3.4, T = K0 + n * st + hold;
  const K = (t) => (t < 0 ? 0.01 / T : (K0 + t * st) / T);
  let o = '';
  // 左：三个点
  const X = [60, 130], Yn = [200, 70], Z = [200, 200];
  const P = { x: [50, 135], y: [170, 55], z: [170, 215] };
  o += line(...P.x, ...P.y, 'ink-b') + line(...P.y, ...P.z, 'ink') + line(...P.x, ...P.z, 'ink');
  o += text((P.x[0] + P.y[0]) / 2 - 12, (P.x[1] + P.y[1]) / 2 - 6, '4 → 60', 'tl', 'end');
  o += text((P.y[0] + P.z[0]) / 2 + 8, (P.y[1] + P.z[1]) / 2 + 4, '1', 't', 'start');
  o += text((P.x[0] + P.z[0]) / 2 - 10, (P.x[1] + P.z[1]) / 2 + 14, '50', 't', 'end');
  for (const [k, [x, y]] of Object.entries(P)) o += circle(x, y, 15, 'paper') + text(x, y + 5, k, 'tb', 'middle');
  // y、z 当前的值
  const lab = (s, who) => (who === 'y' ? `D${sub('y')}(x) = ${s.Dy}，经 ${s.vy}` : `D${sub('z')}(x) = ${s.Dz}，经 ${s.vz}`);
  const last = seq[n - 1];
  for (const who of ['y', 'z']) {
    const [x, y] = P[who];
    const tx = x - 10, ty = who === 'y' ? y - 26 : y + 36;
    o += `<g>${text(tx, ty, lab(last, who), 'tl', 'start')}${ashow([1, 0], [0, K(-1)], T)}</g>`;
    seq.forEach((s, i) => {
      const on = [0, 0, 1]; const kt = [0, K(-1), K(i)]; if (i < n - 1) { on.push(0); kt.push(K(i + 1)); }
      o += `<g opacity="0">${text(tx, ty, lab(s, who), 'tl', 'start')}${ashow(on, kt, T)}</g>`;
    });
  }
  // 右：D_y(x)、D_z(x) 随更新次数的 staircase
  const sx = lin(0, n - 1, 330, 548), sy = lin(0, 60, 236, 40);
  for (const v of [0, 20, 40, 60]) o += line(326, sy(v), 548, sy(v), 'grid') + text(322, sy(v) + 4, String(v), 'ts', 'end');
  o += text(330, 26, 'D(·, x) 随第几次更新', 'tb', 'start');
  const ptsY = [], ptsZ = [];
  seq.forEach((s, i) => { ptsY.push([sx(i), sy(s.Dy)]); ptsZ.push([sx(i), sy(s.Dz)]); });
  o += path(d(ptsY), 'ln') + path(d(ptsZ), 'ink');
  const mid = Math.round(n / 2);
  o += text(sx(mid) - 8, sy(seq[mid].Dy) - 8, `D${sub('y')}(x)`, 'tl', 'end') + text(sx(mid) + 8, sy(seq[mid].Dz) + 16, `D${sub('z')}(x)`, 't', 'start');
  o += line(330, sy(50), 548, sy(50), 'dash') + text(334, sy(50) - 5, '直连 x–z 的 cost 50', 'ts', 'start');
  o += text(330, 254, '0', 'ts', 'middle') + text(548, 254, String(n - 1), 'ts', 'middle');
  const mx = seq.map((_, i) => sx(i)), my = seq.map((s) => sy(s.Dy));
  const kts = [0, K(-1), ...seq.map((_, i) => K(i))];
  o += `<circle cx="${f1(mx[n - 1])}" cy="${f1(my[n - 1])}" r="4.5" class="ln-f">${anim('cx', [mx[n - 1], mx[0], ...mx].map(f1), kts, T, true)}${anim('cy', [my[n - 1], my[0], ...my].map(f1), kts, T, true)}</circle>`;
  o += text(548, 272, `一共 ${n - 1} 次更新；最后 z 直连（50），y 经 z（51）`, 'ts', 'end');
  return svgA(560, 280, o, `动图：distance vector 的 count-to-infinity。x 到 y 的 link cost 从 4 变成 60，y 和 z 互相以对方为 next hop，D_y(x) 和 D_z(x) 每次只涨 2，一共 ${n - 1} 次更新后才收敛`);
}

// ---------- 第 7 站：CSMA/CD 为什么要 minimum frame size ----------
function csma() {
  let o = '';
  const xA = 90, xB = 400, y0 = 50, tau = 100;
  const u = 1.1, Y = (t) => y0 + t * u;
  const eps = 10, tb = tau - eps;
  o += text(xA, 30, 'A', 'tb', 'middle') + text(xB, 30, 'B', 'tb', 'middle');
  o += line(xA, 38, xB, 38, 'ink-b');
  o += line(xA, 42, xA, Y(2 * tau + 14), 'axis') + line(xB, 42, xB, Y(2 * tau + 14), 'axis');
  // 两端各自在发的时段：贴着竖线的粗条
  o += rect(xA - 4, Y(0), 8, Y(2 * tau) - Y(0), 'wash-strong');
  o += rect(xB - 4, Y(tb), 8, Y(tau) - Y(tb), 'solid');
  // 信号的 wavefront：A 的第一个 bit 向右走，B 的第一个 bit 向左走
  o += line(xA, Y(0), xB, Y(tau), 'ink') + line(xB, Y(tb), xA, Y(tb + tau), 'ln');
  o += text(xA - 28, Y(0) + 4, 'A 开始发', 'ts', 'end');
  o += text(xB + 10, Y(tb) + 2, 'B 还没收到 A 的信号，', 'ts', 'start') + text(xB + 10, Y(tb) + 17, '以为线上 idle，开始发', 'ts', 'start');
  o += text(xB + 10, Y(tau) + 26, 'A 的信号到了：', 'ts', 'start') + text(xB + 10, Y(tau) + 41, 'B 检测到 collision，停下', 'ts', 'start');
  o += circle(xA, Y(tb + tau), 4, 'ln-f') + text(xA + 10, Y(tb + tau) + 18, 'B 的信号到达 A：t = 2τ − ε', 'tl', 'start');
  o += text(xA + 10, Y(tb + tau) + 34, 'A 此时必须还在发，才知道撞了', 'ts', 'start');
  o += line(xA - 18, Y(0), xA - 18, Y(2 * tau), 'ink') + line(xA - 22, Y(0), xA - 14, Y(0), 'ink') + line(xA - 22, Y(2 * tau), xA - 14, Y(2 * tau), 'ink');
  o += text(xA - 24, Y(tau) + 4, '2τ', 't', 'end');
  o += text((xA + xB) / 2, 30, 'propagation：τ', 'ts', 'middle');
  o += text(280, Y(2 * tau) + 46, '所以 frame 的 transmission time ≥ 2τ。10 Mbps Ethernet 取 512 bit（64 byte）= 51.2 µs。', 'ts', 'middle');
  return svg(560, Y(2 * tau) + 52, o, 'CSMA/CD 的 space-time 图：A 在 0 时刻开始发，B 在 A 的信号到达前一刻也开始发，B 的信号要到接近 2 倍 propagation delay 时才回到 A，所以 A 的 frame 至少要发这么久才能检测到 collision');
}

// ---------- 第 8 站：public key 被替换，certificate 怎样挡住 ----------
function mitm() {
  let o = '';
  const A = 60, Tm = 280, B = 500;
  const row = (y0, title) => {
    o += text(20, y0, title, 'tb', 'start');
    for (const [x, n] of [[A, 'Alice（client）'], [Tm, 'Trudy（中间人）'], [B, 'Bob（server）']]) o += rect(x - 56, y0 + 12, 112, 30, 'paper', 6) + text(x, y0 + 32, n, 't', 'middle');
  };
  row(22, '没有 certificate');
  o += arrow(B - 58, 80, Tm + 58, 80, 'ink', 6) + text((B + Tm) / 2, 74, 'Bob 的 public key K⁺' + sub('B') + '', 'ts', 'middle');
  o += arrow(Tm - 58, 80, A + 58, 80, 'ln', 6) + text((A + Tm) / 2, 74, '换成 K⁺' + sub('T') + '，自称 Bob', 'tl', 'middle');
  o += text(280, 106, 'Alice 用 K⁺' + sub('T') + ' encrypt：Trudy 解开、看完、再用 K⁺' + sub('B') + ' encrypt 转给 Bob，两边都察觉不到', 'ts', 'middle');
  row(140, '有 certificate');
  o += arrow(B - 58, 198, Tm + 58, 198, 'ink', 6) + text((B + Tm) / 2, 192, 'cert = (Bob, K⁺' + sub('B') + ') + CA 的 signature', 'ts', 'middle');
  o += arrow(Tm - 58, 198, A + 58, 198, 'ln', 6) + text((A + Tm) / 2, 192, '把 K⁺' + sub('B') + ' 换成 K⁺' + sub('T') + '', 'tl', 'middle');
  o += text(A - 50, 224, 'Alice 用内置的 CA public key 验 signature：', 'ts', 'start');
  o += text(A - 50, 242, 'Signature 是对 (Bob, K⁺' + sub('B') + ') 签的，对 (Bob, K⁺' + sub('T') + ') 不成立 → 拒绝', 'ts', 'start');
  o += text(A - 50, 260, 'Trudy 没有 CA 的 private key，签不出 (Bob, K⁺' + sub('T') + ') 的 signature', 'ts', 'start');
  return svg(560, 268, o, '上面一行：Trudy 把 Bob 发给 Alice 的 public key 换成自己的，Alice 无从察觉；下面一行：Bob 发的是 CA signed certificate，Trudy 换掉 key 后 signature 验证失败');
}

// ---------- 第 2 站：机构的 web cache 与 access link 的 utilization ----------
function cache() {
  const reqRate = 15, objBits = 100e3, access = 1.54e6, lan = 1e9, hit = 0.4, rtt = 2.01;
  const load = reqRate * objBits; // 1.5 Mbps
  const rows = [
    { title: '没有 cache：全部 request 都走 access link', u: load / access, cache: false },
    { title: `装 web cache，hit rate ${hit}：${Math.round((1 - hit) * 100)}% 的 request 才走 access link`, u: (1 - hit) * load / access, cache: true },
  ];
  let o = '';
  const rh = 150;
  rows.forEach((r, i) => {
    const y0 = 18 + i * rh;
    o += text(10, y0, r.title, 'tb', 'start');
    // 机构网络
    const bx = 10, by = y0 + 14, bw = 196, bh = 92;
    o += rect(bx, by, bw, bh, 'paper', 6) + text(bx + 8, by + 17, `机构 LAN：${lan / 1e9} Gbps`, 'ts', 'start');
    for (let k = 0; k < 3; k++) o += rect(bx + 12, by + 28 + k * 20, 46, 14, 'wash', 2) + text(bx + 35, by + 39 + k * 20, 'browser', 'ts', 'middle');
    if (r.cache) o += rect(bx + 96, by + 40, 88, 34, 'wash-strong', 4) + text(bx + 140, by + 55, 'web cache', 'tb', 'middle') + text(bx + 140, by + 69, `命中 ${hit * 100}%`, 'ts', 'middle');
    else o += text(bx + 132, by + 54, 'LAN utilization', 'ts', 'middle') + text(bx + 132, by + 70, (load / lan).toFixed(4), 'ts', 'middle');
    // router
    const rx = 226, ry = by + bh / 2;
    o += line(bx + bw, ry, rx - 12, ry, 'ink') + circle(rx, ry, 12, 'paper') + text(rx, ry + 4, 'R', 'tb', 'middle');
    // access link：灰条 + 按 utilization 填色
    const lx0 = rx + 16, lx1 = 420, lw = lx1 - lx0, lh = 16;
    o += rect(lx0, ry - lh / 2, lw, lh, 'wash2', 2) + rect(lx0, ry - lh / 2, lw * r.u, lh, 'solid', 2) + rect(lx0, ry - lh / 2, lw, lh, 'frame', 2);
    o += text((lx0 + lx1) / 2, ry - 16, `access link ${access / 1e6} Mbps`, 'ts', 'middle');
    o += text((lx0 + lx1) / 2, ry + 26, `${(r.u * access / 1e6).toFixed(1)} Mbps / ${access / 1e6} Mbps = ${r.u.toFixed(2)}`, 'tl', 'middle');
    // Internet
    const ix = 430, iw = 126;
    o += rect(ix, by + 8, iw, bh - 16, 'paper', 6) + text(ix + iw / 2, by + 32, 'Internet', 'tb', 'middle') + text(ix + iw / 2, by + 50, 'origin servers', 'ts', 'middle') + text(ix + iw / 2, by + 68, 'RTT 2 s', 'ts', 'middle');
    const avg = r.cache ? (1 - hit) * rtt : null;
    o += text(10, by + bh + 22, r.cache
      ? `queue 变短；平均 delay ≈ ${1 - hit} × ${rtt} s + ${hit} × 几 ms ≈ ${avg.toFixed(1)} s`
      : `每秒 ${reqRate} 个 × ${objBits / 1e3} Kbit = ${load / 1e6} Mbps；utilization 接近 1，access link 上排队要几分钟`, 'ts', 'start');
  });
  return svg(560, 18 + 2 * rh - 4, o, '同一个机构的两种情形：没有 cache 时 1.5 Mbps 全部压在 1.54 Mbps 的 access link 上，utilization 0.97；装了 hit rate 0.4 的 web cache 后只有 0.9 Mbps 经过 access link，utilization 0.58，平均 delay 约 1.2 s');
}

// ---------- 第 4 站：receiver 什么时候回 ACK（delayed ACK 与 duplicate ACK） ----------
function delack() {
  const xs = 118, xr = 300, y0 = 44, u = 21;
  const Y = (t) => y0 + t * u;
  const D = 4;
  // [Seq, 发送时刻, 到达时刻]
  const segs = [[1000, 0, 0 + D], [1100, 1, 9], [1200, 2, 2 + D], [1300, 3.5, 3.5 + D], [1400, 6, 6 + D]];
  const tEnd = 10 + 3 + D + 1;
  let o = '';
  o += text(xs, 24, 'sender', 'tb', 'middle') + text(xr, 24, 'receiver', 'tb', 'middle');
  o += line(xs, 32, xs, Y(tEnd), 'axis') + line(xr, 32, xr, Y(tEnd), 'axis');
  for (const [s, t0, t1] of segs) {
    const late = s === 1100;
    o += arrow(xs, Y(t0), xr, Y(t1), late ? 'ln' : 'ink', 5);
    o += text(xs - 6, Y(t0) + 4, `Seq = ${s}`, late ? 'tl' : 'ts', 'end');
  }
  // receiver 在每个到达时刻的动作：[到达时刻, 说明, 回 ACK 的时刻或 null, ACK 号]
  const acts = [
    [4, '1000 按顺序：先压着，最多等 500 ms', null],
    [6, '1200 出现缺口：立刻 ACK 1100', 6, 1100, ''],
    [7.5, '1300 缺口还在：再 ACK 1100（duplicate）', 7.5, 1100, '（dup）'],
    [9, '1100 补上缺口：立刻 ACK 1400', 9, 1400, ''],
    [10, '1400 按顺序：先压着，等满 500 ms 才 ACK 1500', 13, 1500, ''],
  ];
  for (const [t, s, ta, a, tag] of acts) {
    o += circle(xr, Y(t), 3, 'ink-f') + text(xr + 8, Y(t) + 4, s, 'ts', 'start');
    if (ta !== null) {
      o += arrow(xr, Y(ta), xs, Y(ta + D), 'mute', 5);
      o += text(xs - 6, Y(ta + D) + 4, `ACK = ${a}${tag}`, 'ts', 'end');
    }
  }
  // 压着不发的时段：虚线
  o += line(xr - 6, Y(4), xr - 6, Y(6), 'dash') + line(xr - 6, Y(10), xr - 6, Y(13), 'dash');
  o += text(xr + 8, Y(11.6) + 4, '（500 ms 内没有下一个 segment）', 'ts', 'start');
  return svg(560, Y(tEnd) + 6, o, 'TCP receiver 的 ACK 规则：五个 100 byte 的 segment 按 1000、1200、1300、1100、1400 的顺序到达；1000 和 1400 按顺序到达时先压着 ACK，1200 和 1300 制造缺口时立刻回 ACK 1100，1100 补上缺口时立刻回 ACK 1400');
}

// ---------- 第 6 站：AY13/14 期末第 10 题的设定 ----------
function q10() {
  let o = '';
  const P = { x: [70, 128], w: [210, 50], z: [210, 206], y: [350, 206] };
  o += line(...P.x, ...P.w, 'ink') + line(...P.x, ...P.z, 'ink');
  o += text((P.x[0] + P.w[0]) / 2 - 10, (P.x[1] + P.w[1]) / 2 - 4, 'c(x, w) = 4', 'tb', 'end');
  o += text((P.x[0] + P.z[0]) / 2 - 10, (P.x[1] + P.z[1]) / 2 + 16, 'c(x, z) = 10', 'tb', 'end');
  // 看不见的 least-cost path：虚线弧
  const arc = (a, b, bend) => {
    const [x1, y1] = a, [x2, y2] = b, mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
    return `<path d="M${f1(x1)} ${f1(y1)}Q${f1(mx + nx * bend)} ${f1(my + ny * bend)} ${f1(x2)} ${f1(y2)}" class="dash"/>`;
  };
  o += arc(P.w, P.z, -46) + text(P.w[0] + 44, (P.w[1] + P.z[1]) / 2 + 4, `D${sub('w')}(z) = ?`, 'ts', 'start');
  o += arc(P.z, P.y, -30) + text((P.z[0] + P.y[0]) / 2, P.z[1] - 22, `D${sub('z')}(y) = ?`, 'ts', 'middle');
  for (const [k, [x, y]] of Object.entries(P)) o += circle(x, y, 15, 'paper') + text(x, y + 5, k, 'tb', 'middle');
  // x 的表
  const tx = 404, ty = 52, cw = [36, 48, 64];
  o += text(tx, ty - 12, 'x 收敛后的表', 'tb', 'start');
  const rowsT = [['dest', 'cost', 'next hop'], ['w', '4', 'w'], ['y', 'α', 'z'], ['z', 'β', 'w']];
  rowsT.forEach((r, i) => {
    let cx = tx;
    r.forEach((c, j) => {
      o += rect(cx, ty + i * 24, cw[j], 24, i === 0 ? 'wash2' : 'frame') + rect(cx, ty + i * 24, cw[j], 24, 'frame');
      o += text(cx + cw[j] / 2, ty + i * 24 + 16, c, i === 0 ? 'ts' : (j === 1 && i > 1 ? 'tl' : 't'), 'middle');
      cx += cw[j];
    });
  });
  o += text(tx, ty + 4 * 24 + 22, 'link cost 都是正整数', 'ts', 'start');
  return svg(560, 236, o, 'AY13/14 期末第 10 题：node x 的两个邻居 w 和 z，link cost 分别是 4 和 10；x 收敛后的表里去 w 是 4 经 w，去 y 是 α 经 z，去 z 是 β 经 w；w 到 z、z 到 y 的 least cost 未知');
}

// ---------- 第 8 站：secure email 的发送和接收 ----------
function email() {
  let o = '';
  const KA_ = `K${sub('A')}⁻`, KA = `K${sub('A')}⁺`, KB = `K${sub('B')}⁺`, KB_ = `K${sub('B')}⁻`, KS = `K${sub('S')}`;
  const box = (x, y, w, lab) => rect(x, y - 13, w, 26, 'wash-strong', 4) + text(x + w / 2, y + 5, lab, 'tb', 'middle');
  const val = (x, y, s, anc = 'middle') => text(x, y + 4, s, 't', anc);
  // ---- Alice ----
  let y1 = 46, y2 = 92, y3 = 138;
  o += text(8, 20, 'Alice 发送', 'tb', 'start');
  o += val(22, y1, 'm', 'middle');
  o += arrow(32, y1, 58, y1, 'ink', 5) + box(60, y1, 30, 'H') + arrow(90, y1, 112, y1, 'ink', 5) + val(136, y1, 'H(m)');
  o += arrow(160, y1, 180, y1, 'ink', 5) + box(182, y1, 34, KA_) + arrow(216, y1, 236, y1, 'ink', 5) + val(278, y1, `${KA_}(H(m))`);
  // m 和 signature 接在一起
  o += line(22, y1 + 10, 22, y2, 'mute') + arrow(22, y2, 236, y2, 'mute', 5);
  o += line(278, y1 + 12, 278, y2 - 22, 'mute') + arrow(278, y2 - 22, 272, y2 - 14, 'mute', 5);
  o += box(238, y2, 60, `用 ${KS}`) + arrow(298, y2, 318, y2, 'ink', 5) + val(392, y2, `${KS}(m, ${KA_}(H(m)))`);
  o += val(130, y2 - 10, '接在一起', 'middle');
  // 随机的 session key
  o += val(150, y3, `随机生成的 ${KS}`) + arrow(204, y3, 236, y3, 'ink', 5) + box(238, y3, 34, KB) + arrow(272, y3, 318, y3, 'ink', 5) + val(360, y3, `${KB}(${KS})`);
  o += line(225, y3, 225, y2 + 13, 'mute') + arrow(225, y2 + 13, 238, y2 + 6, 'mute', 5);
  o += line(470, y2, 496, y2, 'ln') + line(400, y3, 496, y3, 'ln') + line(496, y2, 496, y3, 'ln') + arrow(496, (y2 + y3) / 2, 518, (y2 + y3) / 2, 'ln', 6);
  o += text(524, (y2 + y3) / 2 - 3, '发给', 'tl', 'start') + text(524, (y2 + y3) / 2 + 13, 'Bob', 'tl', 'start');
  // ---- Bob ----
  const b0 = 186, c1 = b0 + 30, c2 = b0 + 76, c3 = b0 + 122;
  o += line(8, b0 - 12, 552, b0 - 12, 'grid');
  o += text(8, b0 + 4, 'Bob 接收', 'tb', 'start');
  o += val(58, c1, `${KB}(${KS})`) + arrow(98, c1, 118, c1, 'ink', 5) + box(120, c1, 34, KB_) + arrow(154, c1, 172, c1, 'ink', 5) + val(184, c1, KS);
  o += val(58, c2, `${KS}(m, …)`) + arrow(98, c2, 118, c2, 'ink', 5) + box(120, c2, 60, `用 ${KS}`) + line(184, c1 + 10, 184, c2 - 20, 'mute') + arrow(184, c2 - 20, 172, c2 - 14, 'mute', 5);
  o += arrow(180, c2, 204, c2 - 20, 'ink', 5) + val(214, c2 - 26, 'm', 'middle') + arrow(180, c2, 204, c2 + 20, 'ink', 5) + text(210, c2 + 30, `${KA_}(H(m))`, 't', 'start');
  // m → H
  o += arrow(224, c2 - 26, 262, c2 - 26, 'ink', 5) + box(264, c2 - 26, 30, 'H') + arrow(294, c2 - 26, 368, c2 - 26, 'ink', 5) + val(392, c2 - 26, 'H(m)');
  // signature → K_A^+
  o += arrow(292, c2 + 26, 310, c2 + 26, 'ink', 5) + box(312, c2 + 26, 34, KA) + arrow(346, c2 + 26, 368, c2 + 26, 'ink', 5) + val(392, c2 + 26, 'H(m)');
  // 比较
  o += line(416, c2 - 26, 438, c2 - 26, 'ink') + line(416, c2 + 26, 438, c2 + 26, 'ink') + line(438, c2 - 26, 438, c2 + 26, 'ink');
  o += arrow(438, c2, 456, c2, 'ink', 5) + rect(458, c2 - 15, 94, 30, 'paper', 6) + text(505, c2 + 5, '相同 → 接受', 'tb', 'middle');
  o += text(8, c3 + 26, `只有 Bob 有 ${KB_}，所以只有他拿得到 ${KS}；只有 Alice 有 ${KA_}，所以只有她签得出 ${KA_}(H(m))。`, 'ts', 'start');
  return svg(560, c3 + 34, o, 'Secure email：Alice 对 m 做 hash 并用自己的 private key 签名，把 m 和 signature 用随机的 session key 加密，再用 Bob 的 public key 加密 session key，两部分一起发出；Bob 用 private key 取回 session key，解出 m 和 signature，用 Alice 的 public key 打开 signature，和自己算的 H(m) 比较');
}

// ---------- 综合走读：AY13/14 期末第 11 题 ----------
function q11() {
  let o = '';
  // 两个 subnet 的底色
  o += rect(10, 22, 362, 150, 'wash', 10) + rect(392, 22, 158, 150, 'wash', 10);
  o += text(20, 40, 'subnet 1', 'ts', 'start') + text(540, 40, 'subnet 2', 'ts', 'end');
  const dev = (x, y, w, name, cls = 'paper') => rect(x - w / 2, y - 16, w, 32, cls, 6) + text(x, y + 5, name, 'tb', 'middle');
  const A = [60, 70], B = [60, 140], S = [190, 105], R = [382, 105], C = [480, 105];
  o += line(A[0] + 26, A[1], S[0] - 30, S[1] - 6, 'ink') + line(B[0] + 26, B[1], S[0] - 30, S[1] + 6, 'ink');
  o += line(S[0] + 30, S[1], R[0] - 34, R[1], 'ink') + line(R[0] + 34, R[1], C[0] - 26, C[1], 'ink');
  o += dev(...A, 52, 'A') + dev(...B, 52, 'B') + dev(...S, 60, 'switch S', 'wash2') + dev(...C, 52, 'C');
  o += rect(R[0] - 34, R[1] - 18, 68, 36, 'paper', 18) + text(R[0], R[1] + 5, 'router R', 'tb', 'middle');
  // interface 上的 IP：小圆点
  const ip = (x, y) => circle(x, y, 4, 'ln-f');
  o += ip(A[0] + 26, A[1]) + ip(B[0] + 26, B[1]) + ip(R[0] - 34, R[1]) + ip(R[0] + 34, R[1]) + ip(C[0] - 26, C[1]);
  o += text(S[0] + 6, S[1] + 34, '没有 IP 地址', 'ts', 'middle');
  o += text(S[0] - 36, S[1] - 14, '1', 'ts', 'middle') + text(S[0] - 40, S[1] + 18, '2', 'ts', 'middle') + text(S[0] + 36, S[1] - 6, '3', 'ts', 'middle');
  o += text(R[0] - 40, R[1] - 24, '左 interface', 'ts', 'end') + text(R[0] + 40, R[1] - 24, '右 interface', 'ts', 'start');
  // 各张表
  const table = (x, y, w, title, rows) => {
    let q = text(x, y, title, 'tb', 'start');
    rows.forEach((r, i) => { q += rect(x, y + 8 + i * 22, w, 22, 'frame') + text(x + 8, y + 23 + i * 22, r, 'ts', 'start'); });
    return q;
  };
  o += table(10, 196, 182, '(a) S 的 switch table', ['A 的 MAC → port 1', 'B 的 MAC → port 2', 'R 左 interface 的 MAC → port 3']);
  o += table(204, 196, 170, '(b) A 的 ARP table', ['B 的 IP → B 的 MAC', 'R 左 interface 的 IP → MAC']);
  o += table(386, 196, 164, '(c) C 的 ARP table', ['R 右 interface 的 IP → MAC']);
  o += circle(210, 288, 4, 'ln-f') + text(220, 292, '(d) 实心圆点是 IP 地址：A、B、C 各一个，R 两个，共 5 个', 'ts', 'start');
  return svg(560, 300, o, 'AY13/14 期末第 11 题的网络：A、B 经 switch S 连到 router R 的左 interface，C 连在 R 的右 interface；S 的 switch table 有 A、B、R 三项，A 的 ARP table 有 B、R 两项，C 的 ARP table 只有 R 一项，IP 地址共 5 个');
}

export default {
  'cs2105-cache': cache,
  'cs2105-delack': delack,
  'cs2105-q10': q10,
  'cs2105-email': email,
  'cs2105-q11': q11,
  'cs2105-delay': delay,
  'cs2105-encap': encapA,
  'cs2105-http': http,
  'cs2105-dns': dns,
  'cs2105-stopwait': stopwait,
  'cs2105-gbn': gbnA,
  'cs2105-sr': srA,
  'cs2105-srdilemma': srdilemma,
  'cs2105-fastrtx': fastrtx,
  'cs2105-cwnd': cwndA,
  'cs2105-lpm': lpm,
  'cs2105-dijkstra': dijkstraA,
  'cs2105-dv': dvA,
  'cs2105-csma': csma,
  'cs2105-mitm': mitm,
};

export { simARQ, cwndSeq, dijkstraSteps, dvSeq };
