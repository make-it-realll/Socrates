import { svg, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

// 从 past 到 account 的四步，用 Carr 讲的 Stresemann papers 做例子
function chain() {
  const rows = [
    ['The past', '六年 Foreign Minister 任内的全部言行'],
    ['Source（trace）', '他自己写下的 conversation record 等'],
    ['Archive', '1929 年去世时留下约 300 箱 papers'],
    ['Selection', 'Bernhard 编三卷约 1,800 页；Sutton 英译约 1,200 页'],
    ['Account', '只读 English 的人眼里的 Stresemann'],
  ];
  const notes = [
    ['fact creation', '写下什么由当事人定：', 'record 里他总占上风'],
    ['fact assembly', '哪些 paper 被留下、', '归在一起'],
    ['fact retrieval', '选编突出 western policy，', '压缩 eastern policy'],
    ['retrospective significance', '原件若在 1945 年毁掉，', '没有人能质疑这个版本'],
  ];
  const x = 16, w = 316, h = 46, gap = 40;
  let o = '';
  rows.forEach(([a, b], i) => {
    const y = 12 + i * (h + gap);
    o += rect(x, y, w, h, i === 0 ? 'wash' : 'paper', 6);
    if (i === 0) o += rect(x, y, w, h, 'frame', 6);
    o += text(x + 12, y + 19, a, 'tb') + text(x + 12, y + 37, b, 'ts');
    if (i < rows.length - 1) {
      const ya = y + h + 3, yb = y + h + gap - 3;
      o += arrow(x + 40, ya, x + 40, yb, 'ink');
      const [k, n1, n2] = notes[i];
      o += text(x + 58, ya + 14, k, 'tl');
      o += line(x + w + 12, ya + 2, x + w + 12, yb - 2, 'mute');
      o += text(x + w + 22, ya + 11, n1, 'ts') + text(x + w + 22, ya + 27, n2, 'ts');
    }
  });
  return svg(560, 12 + 5 * h + 4 * gap + 12, o, '从 the past 到 source、archive、selection、account 的四步，每一步旁边写着 Stresemann 的 papers 在这一步由谁决定、丢掉了什么');
}

// Donation of Constantine：四处不可能出自 4 世纪初的用语
function donation() {
  const px = 16, py = 34, pw = 178, ph = 212;
  let o = rect(px, py, pw, ph, 'paper', 4);
  o += text(px + pw / 2, 22, 'Donation 的 text', 'tb', 'middle');
  const marks = [
    [58, '“satraps”', 'Roman 的 government 里', '没有这个官职'],
    [108, '“see of Constantinople”', '同一份 text 说', '这座城还没有建'],
    [158, '“universal pope”', '当时还不是 Rome 的 bishop', '专用的 title'],
    [208, '“consul IV, with Gallicanus”', '315 年与 317 年，', '两个年份对不上'],
  ];
  // 灰色的“正文”行
  for (let y = py + 14; y < py + ph - 6; y += 10) {
    if (marks.some(([my]) => Math.abs(y - (my - 3)) < 12)) continue;
    o += line(px + 12, y, px + pw - 12 - ((y * 7) % 31), y, 'grid');
  }
  for (const [y, w1, n1, n2] of marks) {
    o += rect(px + 8, y - 13, pw - 16, 19, 'wash', 3);
    o += text(px + pw / 2, y + 1, w1, 'ts', 'middle');
    o += arrow(px + pw + 4, y - 4, 236, y - 4, 'ink');
    o += text(244, y - 6, n1, 't') + text(244, y + 11, n2, 't');
  }
  const by = 268;
  o += rect(16, by, 210, 46, 'wash2', 6) + text(28, by + 19, '它自称', 'tb') + text(28, by + 37, 'Constantine，约 315–317 年', 'ts');
  o += arrow(232, by + 23, 300, by + 23, 'ln') + text(266, by + 15, '约 440 年', 'ts', 'middle');
  o += rect(306, by, 238, 46, 'wash', 6) + text(318, by + 19, 'Criticism 之后', 'tl') + text(318, by + 37, '8 世纪中后期的 papal chancery', 'ts');
  return svg(560, by + 58, o, 'Donation of Constantine 的 text 里四处用语：satraps、see of Constantinople、universal pope、Constantine 第四次任 consul 与 Gallicanus 同任，每一处都不可能出自 4 世纪初');
}

// 从事情发生到被写下来隔了多久（年，log scale）
function gap() {
  const items = [
    ['Japanese 驻军 diary（1942）', '记当月的 Sook Ching', 0],
    ['1819 年的 treaty', '它本身是那次签字的一部分', 0],
    ['Coras, Arrest Memorable（1561）', '记 1560 年的 trial', 1],
    ['Farquhar 的 Memorial（1824）', '记 1819 年的选址', 5],
    ['Wang Dayuan（1349）', '记 1330 年代到过的 Temasek', 15],
    ['Hikayat Abdullah（1843）', '记 1819 年的上岸', 24],
    ['Sejarah Melayu（1612 年的 version）', '记约 1299 年的建城', 313],
    ['Donation（约 760）', '自称记 315–317 年的 grant', 443],
  ];
  const x0 = 252, sx = logx(1, 1000, 290, 524), top = 44, rh = 33;
  let o = text(16, 20, '从事情发生到被写下来，隔了多少年', 'tb');
  const yb = top + items.length * rh;
  for (const v of [1, 10, 100, 1000]) o += line(sx(v), top - 8, sx(v), yb, 'grid') + text(sx(v), yb + 16, String(v), 'ts', 'middle');
  o += line(x0, top - 8, x0, yb, 'grid') + text(x0, yb + 16, '当时', 'ts', 'middle');
  o += text(540, yb + 34, '年（log scale）', 'ts', 'end');
  items.forEach(([a, b, v], i) => {
    const y = top + i * rh + 10;
    o += text(238, y - 2, a, 't', 'end') + text(238, y + 13, b, 'ts', 'end');
    const x = v === 0 ? x0 : sx(v);
    if (v > 0) o += line(x0, y + 2, x, y + 2, 'mute');
    o += circle(x, y + 2, 5, v >= 100 ? 'ln-f' : 'ink-f');
    if (v > 0) o += text(x + 9, y + 6, v + ' 年', v >= 100 ? 'tl' : 'ts');
  });
  return svg(560, yb + 44, o, '这一页用到的八份 source 从事情发生到被写下来的间隔：从当时写下的 diary 和 treaty，到隔了三百多年的 Sejarah Melayu 和隔了四百四十多年的 Donation');
}

// 1914：35 年的 structure 与 37 天的决定
function causes() {
  const sx = lin(1875, 1915, 40, 520), y1 = 84;
  let o = text(16, 22, 'Structure：1879–1914', 'tb');
  o += line(sx(1875), y1, sx(1915), y1, 'axis');
  for (const yr of [1880, 1890, 1900, 1910]) o += line(sx(yr), y1, sx(yr), y1 + 5, 'axis') + text(sx(yr), y1 + 19, String(yr), 'ts', 'middle');
  o += circle(sx(1879), y1, 5, 'ink-f') + text(sx(1879) - 6, y1 - 12, '1879 Dual Alliance', 't');
  o += circle(sx(1894), y1, 5, 'ink-f') + line(sx(1894), y1 - 8, sx(1894), y1 - 26, 'mute') + text(sx(1894), y1 - 31, '1894 Franco-Russian alliance', 't', 'middle');
  for (const yr of [1905, 1911]) o += circle(sx(yr), y1, 5.5, 'paper');
  o += text(sx(1908), y1 - 31, '1905、1911', 't', 'middle') + text(sx(1908), y1 - 14, 'Moroccan crisis：没有 war', 'ts', 'middle');
  o += circle(sx(1914.5), y1, 6, 'ln-f') + text(sx(1914.5) + 2, y1 + 19, '1914', 'tl', 'middle');
  // 放大
  const sd = lin(0, 37, 52, 508), y2 = 190;
  o += line(sx(1914.5), y1 + 26, sd(0), y2 - 30, 'dash') + line(sx(1914.5), y1 + 26, sd(37), y2 - 30, 'dash');
  o += text(16, y2 - 58, '最后 37 天', 'tb');
  o += line(sd(0), y2, sd(37), y2, 'ink');
  const ev = [[0, '6 月 28 日 Sarajevo'], [7, '7 月 5–6 日 blank cheque'], [25, '7 月 23 日 ultimatum'], [30, '7 月 28 日对 Serbia 宣战'], [32.3, '7 月 30 日 Russia 的 general mobilisation'], [37, '8 月 4 日 Britain 宣战']];
  ev.forEach(([dday], i) => {
    o += circle(sd(dday), y2, 9.5, 'solid') + text(sd(dday), y2 + 4.5, String(i + 1), 'tw', 'middle');
  });
  for (const dd of [0, 10, 20, 30]) o += text(sd(dd), y2 + 28, '第 ' + dd + ' 天', 'ts', 'middle');
  ev.forEach(([, s], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = col === 0 ? 40 : 290, y = y2 + 56 + row * 20;
    o += circle(x, y - 4, 8, 'solid') + text(x, y, String(i + 1), 'tw', 'middle') + text(x + 14, y, s, 'ts');
  });
  const yf = y2 + 128;
  o += rect(16, yf - 18, 528, 44, 'wash', 6);
  o += text(280, yf, 'Structure 在 1905、1911 年都在，war 没有来：单独 not sufficient。', 'ts', 'middle');
  o += text(280, yf + 17, '加上一个 trigger 和 37 天里的每一次决定，合起来才 sufficient。', 'ts', 'middle');
  return svg(560, yf + 36, o, '上面一条 timeline 是 1879 到 1914 年的 alliance 与两次没有引出 war 的 Moroccan crisis，下面一条把 1914 年 6 月 28 日到 8 月 4 日的 37 天放大，标出六个决定');
}

// 持续时间（天，log scale）与 Braudel 的三层 time
function scales() {
  const Y = 365.25;
  const items = [
    ['Battle of Lepanto（1571）', 1, '1 天'],
    ['Sook Ching 的 screening（1942）', 15, '15 天'],
    ['July Crisis（1914）', 37, '37 天'],
    ['Arnaud 在 Artigat（1556–1559）', 3 * Y, '约 3 年'],
    ['Farquhar 任 Resident（1819–1823）', 1544, '4.2 年'],
    ['Alliance 体系（1879–1914）', 35 * Y, '35 年'],
    ['Philip II 在位（1556–1598）', 42 * Y, '42 年'],
    ['Fort Canning 的 settlement', 100 * Y, '约 100 年'],
    ['Donation 被当作真的', 680 * Y, '约 680 年'],
  ];
  const sx = logx(1, 1200000, 236, 516), top = 50, rh = 25, yb = top + items.length * rh;
  const b1 = sx(5 * Y), b2 = sx(100 * Y);
  let o = rect(sx(1) - 8, top - 22, b1 - sx(1) + 6, yb - top + 26, 'wash2', 4) + rect(b1 + 2, top - 22, b2 - b1 - 4, yb - top + 26, 'wash', 4) + rect(b2 + 2, top - 22, 546 - b2 - 2, yb - top + 26, 'wash-strong', 4);
  o += text((sx(1) + b1) / 2, top - 30, 'événement', 'ts', 'middle') + text((b1 + b2) / 2 - 2, top - 30, 'conjuncture', 'ts', 'middle') + text((b2 + 546) / 2 + 4, top - 30, 'longue durée', 'ts', 'middle');
  items.forEach(([a, v, s], i) => {
    const y = top + i * rh + 6;
    o += text(222, y + 4, a, 't', 'end');
    o += line(sx(1), y, sx(v), y, 'ink') + circle(sx(v), y, 4.5, 'ink-f');
    o += text(sx(v) + 9, y + 4, s, 'ts');
  });
  for (const [v, s] of [[1, '1 天'], [30, '1 月'], [Y, '1 年'], [10 * Y, '10 年'], [100 * Y, '100 年'], [1000 * Y, '1000 年']]) o += line(sx(v), yb + 6, sx(v), yb + 11, 'axis') + text(sx(v), yb + 25, s, 'ts', 'middle');
  o += line(sx(1), yb + 6, 546, yb + 6, 'axis');
  return svg(560, yb + 36, o, '这一页里九件事的持续时间画在 log scale 上：从一天的 Battle of Lepanto、37 天的 July Crisis，到三十多年的 alliance 体系和约六百八十年里被当作真的 Donation，分别落在 événement、conjuncture、longue durée 三个范围里');
}

// First World War origins 的 historiography：1914–2014
function debate() {
  const sx = lin(1910, 2020, 170, 546);
  const rows = [['Germany（及 allies）', '负主要责任'], ['Germany 的份额', '比别国大'], ['各国分担，', '或 system 的失败'], ['强调 Entente 一方', '（Russia、France、Britain）']];
  const ry = (i) => 52 + i * 62;
  let o = '';
  rows.forEach(([a, b], i) => {
    o += line(170, ry(i), 546, ry(i), 'grid') + text(16, ry(i) - 2, a, 't') + text(16, ry(i) + 14, b, 'ts');
  });
  // [年, 行, 标签, 上(-1)/下(1), anchor, 是否主流看法]
  const pts = [
    [1919, 0, 'Versailles 1919', -1, 'start', 1],
    [1930, 0, 'Schmitt 1930', 1, 'start', 0],
    [1961, 0, 'Fischer 1961', -1, 'middle', 0],
    [2013, 0, 'Hastings 2013', -1, 'end', 0],
    [1942.5, 1, 'Albertini 1942–43', -1, 'middle', 0],
    [1985, 1, '1980 年代的共识', -1, 'middle', 1],
    [1928, 2, 'Fay 1928', -1, 'middle', 0],
    [1935, 2, '1930 年代的主流', 1, 'start', 1],
    [1962, 2, 'Ritter 1962', -1, 'start', 0],
    [2012, 2, 'Clark 2012', -1, 'end', 0],
    [1926, 3, 'Barnes 1926', -1, 'middle', 0],
    [1998, 3, 'Ferguson 1998', -1, 'end', 0],
    [2011, 3, 'McMeekin 2011', 1, 'end', 0],
  ];
  for (const [yr, r, s, side, anc, main] of pts) {
    const x = sx(yr), y = ry(r);
    o += main ? circle(x, y, 6.5, 'ln-f') : circle(x, y, 4.5, 'ink-f');
    const dx = anc === 'start' ? -4 : anc === 'end' ? 4 : 0;
    o += text(x + dx, side < 0 ? y - 11 : y + 20, s, main ? 'tl' : 'ts', anc);
  }
  const ya = ry(3) + 44;
  o += line(170, ya, 546, ya, 'axis');
  for (const yr of [1920, 1940, 1960, 1980, 2000, 2020]) o += line(sx(yr), ya, sx(yr), ya + 5, 'axis') + text(sx(yr), ya + 19, String(yr), 'ts', yr === 2020 ? 'end' : 'middle');
  o += circle(22, ya + 40, 6.5, 'ln-f') + text(34, ya + 44, '一个时期的主流看法', 'ts') + circle(180, ya + 40, 4.5, 'ink-f') + text(190, ya + 44, '一部著作', 'ts');
  return svg(560, ya + 56, o, '1919 到 2013 年关于 First World War 责任的十三种看法按年份和 position 排列：Versailles、Schmitt、Fischer、Hastings 认为 Germany 负主要责任，Albertini 和 1980 年代的共识认为 Germany 份额更大，Fay、1930 年代的主流、Ritter、Clark 主张各国分担，Barnes、Ferguson、McMeekin 强调 Entente 一方');
}

// Davis 与 Finlay：同样的四条 evidence，两种读法
function argmap() {
  const mx = 190, mw = 180, top = 62, rh = 64, gapy = 12;
  let o = text(174, 22, 'Davis', 'tl', 'end') + text(174, 40, '她知情，并且合作', 'ts', 'end');
  o += text(mx + mw / 2, 22, 'Coras 与 Le Sueur 记下的', 'tb', 'middle') + text(mx + mw / 2, 40, '双方都不否认', 'ts', 'middle');
  o += text(386, 22, 'Finlay', 'tb') + text(386, 40, '她和全村一样受了骗', 'ts');
  const rows = [
    [['他叫得出村民的名字，', '说得出共同的往事'], ['有人长期教他，', '最可能是她'], ['全村和家人都被骗了，', '她也一样']],
    [['Witness：他更矮更壮，', '鞋的尺码也小'], ['同住几年的 wife', '不会注意不到'], ['婚后八九年没有同房，', '之后又分开八年']],
    [['被捕前她一直认他；', '被捕次日成了 plaintiff，', '中间没有新的 proof'], ['先认后告，', '两次都是权衡过的'], ['同谋不会去起诉', '自己的同伙']],
    [['两次受审，两人对', '私密细节的说法一致'], ['事先对过；她本可以', '随时揭穿他'], ['没有 source 说两人串通；', 'court 认定她受骗']],
  ];
  rows.forEach(([m, l, r], i) => {
    const y = top + i * (rh + gapy), cy = y + rh / 2;
    o += rect(mx, y, mw, rh, 'paper', 6);
    const m0 = cy - (m.length - 1) * 8 + 4;
    m.forEach((s, k) => { o += text(mx + mw / 2, m0 + k * 16, s, 'ts', 'middle'); });
    o += arrow(mx - 2, cy, mx - 14, cy, 'ln') + arrow(mx + mw + 2, cy, mx + mw + 14, cy, 'ink');
    l.forEach((s, k) => { o += text(170, cy - 4 + k * 16, s, 'ts', 'end'); });
    r.forEach((s, k) => { o += text(390, cy - 4 + k * 16, s, 'ts'); });
  });
  return svg(560, top + 4 * rh + 3 * gapy + 10, o, '中间是 Coras 和 Le Sueur 记下的四件事，左边是 Davis 从每件事推出 Bertrande 知情的读法，右边是 Finlay 认为她受骗的读法');
}

export default {
  'hy2259-chain': chain,
  'hy2259-donation': donation,
  'hy2259-gap': gap,
  'hy2259-causes': causes,
  'hy2259-scales': scales,
  'hy2259-debate': debate,
  'hy2259-argmap': argmap,
};
