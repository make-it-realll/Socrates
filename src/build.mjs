// 构建脚本：content/ 里的 Markdown → docs/ 里的静态网站（GitHub Pages 直接托管 docs/）。
// 用法：npm run build
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { lines, courses, edges } from './catalog.mjs';
import { esc } from './lib/svg.mjs';
import figST from './figures/st2131.mjs';
import figEE from './figures/ee2023.mjs';
import figDSA from './figures/dsa2102.mjs';

const require = createRequire(import.meta.url);
const MarkdownIt = require('markdown-it');
const katex = require('katex');
const matter = require('gray-matter');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'docs');
const figures = { ...figST, ...figEE, ...figDSA };
const md = new MarkdownIt({ html: true, linkify: false, typographer: false });
const lineOf = Object.fromEntries(lines.map((l) => [l.id, l]));
const courseOf = Object.fromEntries(courses.map((c) => [c.code, c]));
const problems = [];
let EDGES_R = [];

// ---------- Markdown + 公式 + 自定义块 ----------
const BLOCKS = {
  wrong: '看起来对，其实不对',
  edge: '边界情况',
  exam: '真题走读',
  skip: '可以跳过吗',
  back: '回头看',
  note: '',
};

function tex(src, display, where) {
  try {
    return katex.renderToString(src.trim(), { displayMode: display, throwOnError: true, strict: false, output: 'htmlAndMathml' });
  } catch (e) {
    problems.push(`${where}: KaTeX 报错 — ${e.message.slice(0, 120)} — in: ${src.slice(0, 60)}`);
    return `<code>${esc(src)}</code>`;
  }
}

function inl(src, where = '') {
  const store = [];
  const s = String(src).replace(/\$([^$\n]+?)\$/g, (_, m) => `@@K${store.push(tex(m, false, where)) - 1}@@`);
  return md.renderInline(s).replace(/@@K(\d+)@@/g, (_, i) => store[+i]);
}

function renderMd(src, where) {
  const store = [];
  const keep = (html) => `@@K${store.push(html) - 1}@@`;
  // 1) 公式先拿走，避免被 Markdown 当成强调/表格语法
  let s = src.replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => '\n\n' + keep(`<div class="math-d">${tex(m, true, where)}</div>`) + '\n\n');
  s = s.replace(/\$([^$\n]+?)\$/g, (_, m) => keep(tex(m, false, where)));
  // 2) 自定义块与图
  const out = [];
  let buf = [], blk = null;
  const flush = () => { if (buf.length) out.push(md.render(buf.join('\n'))); buf = []; };
  for (const ln of s.split('\n')) {
    let m;
    if (!blk && (m = ln.match(/^:::(\w+)\s*(.*)$/)) && m[1] in BLOCKS) {
      flush();
      blk = { kind: m[1], title: m[2].trim() };
    } else if (blk && /^:::\s*$/.test(ln)) {
      const inner = md.render(buf.join('\n'));
      buf = [];
      const k = BLOCKS[blk.kind];
      const head = (k ? `<span class="blk-k">${k}</span>` : '') + (blk.title ? `<span class="blk-t">${md.renderInline(blk.title)}</span>` : '');
      out.push(`<aside class="blk blk-${blk.kind}">${head ? `<p class="blk-h">${head}</p>` : ''}${inner}</aside>`);
      blk = null;
    } else if (!blk && (m = ln.match(/^::fig\[([\w-]+)\]\s*(.*)$/))) {
      flush();
      const fn = figures[m[1]];
      if (!fn) problems.push(`${where}: 找不到图 ${m[1]}`);
      out.push(`<figure class="fig">${fn ? fn() : ''}<figcaption>${md.renderInline(m[2])}</figcaption></figure>`);
    } else buf.push(ln);
  }
  if (blk) problems.push(`${where}: 块 :::${blk.kind} 没有闭合`);
  flush();
  let html = out.join('\n');
  // 3) 放回公式
  html = html.replace(/<p>\s*(@@K\d+@@)\s*<\/p>/g, '$1').replace(/@@K(\d+)@@/g, (_, i) => store[+i]);
  html = html.replace(/<table>/g, '<div class="tbl"><table>').replace(/<\/table>/g, '</table></div>');
  return html;
}

// ---------- 页面外壳 ----------
function shell({ title, root, body, line, cls = '' }) {
  const l = line ? lineOf[line] : null;
  const style = l ? ` style="--line-l:${l.color};--line-dk:${l.dark}"` : '';
  return `<!doctype html>
<html lang="zh-Hans">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<link rel="stylesheet" href="${root}assets/katex/katex.min.css">
<link rel="stylesheet" href="${root}assets/style.css">
</head>
<body class="${cls}"${style}>
<a class="skip-link" href="#main">跳到正文</a>
<header class="top">
  <a class="brand" href="${root}index.html"><span class="brand-mark" aria-hidden="true"></span>Socrates</a>
  <nav class="top-nav" aria-label="全站">
    <a href="${root}index.html#map">谱系图</a>
    <a href="${root}index.html#lines">全部课程</a>
    <a href="${root}index.html#threads">概念线</a>
    <a href="${root}index.html#how">怎么用</a>
  </nav>
</header>
${body}
<footer class="foot">
  <p>讲义是按公开课、课程大纲和可查到的往年卷子写的自学笔记，不是任何课程的官方材料，可能有错。往年卷子的原题不在本站，页面里给的是图书馆的链接。</p>
  <p>等级是你自己点的，只存在这台设备的浏览器里。</p>
</footer>
<script src="${root}assets/app.js" defer></script>
</body>
</html>`;
}

const EVID = {
  paper: ['有往年卷子', '等级标准和走读都对着真卷写'],
  substitute: ['用替代卷', '本课卷子查不到，用内容相同的另一门课的卷子'],
  syllabus: ['只有大纲', '没有卷子可对照，按大纲和公开课写'],
};
const LEVELS = ['没听过', '听过', '能跟上', '有提示能做', '能独立做', '能讲给别人'];

// ---------- 课程页 ----------
function buildCourse(file) {
  const { data: fm, content } = matter(fs.readFileSync(file, 'utf8'));
  const c = courseOf[fm.code];
  if (!c) throw new Error('目录里没有 ' + fm.code);
  const where = fm.code;
  const skills = fm.subskills || [];
  const skillOf = Object.fromEntries(skills.map((s, i) => [s.id, { ...s, n: i + 1 }]));
  // 按二级标题切段
  const parts = content.split(/^(?=## )/m);
  const intro = parts[0].startsWith('## ') ? '' : parts.shift();
  const rail = [];
  const seen = new Set();
  const secs = parts.map((p, i) => {
    const nl = p.indexOf('\n');
    const head = p.slice(3, nl).trim(), bodySrc = p.slice(nl + 1);
    const m = head.match(/^\[([\w-]+)\]\s*(.+)$/);
    if (m) {
      const sk = skillOf[m[1]];
      if (!sk) { problems.push(`${where}: 正文里的 [${m[1]}] 不在 subskills 里`); return ''; }
      seen.add(sk.id);
      rail.push({ id: sk.id, label: m[2], skill: true, n: sk.n });
      const crit = [3, 4, 5].map((k) => `<div class="crit"><dt><span class="crit-n">${k}</span>${LEVELS[k]}</dt><dd>${inl(sk['l' + k] || '')}</dd></div>`).join('');
      const btns = LEVELS.map((nm, k) => `<button type="button" class="rate-b" data-level="${k}" aria-label="${k} 级：${nm}" aria-pressed="false">${k}</button>`).join('');
      return `<section class="stop" id="${sk.id}" data-skill="${sk.id}" data-name="${esc(sk.name)}">
<header class="stop-h"><span class="stop-n">第 ${sk.n} 站</span><h2>${md.renderInline(m[2])}</h2></header>
<div class="lv"><dl class="crits">${crit}</dl>
<div class="rate"><span class="rate-l" id="rl-${sk.id}">我现在在几级</span><div class="rate-bs" role="group" aria-labelledby="rl-${sk.id}">${btns}</div><span class="rate-now" aria-live="polite"></span></div></div>
${renderMd(bodySrc, where + '#' + sk.id)}
</section>`;
    }
    const id = 'sec-' + (i + 1);
    rail.push({ id, label: head, skill: false });
    return `<section class="plain" id="${id}"><h2>${md.renderInline(head)}</h2>${renderMd(bodySrc, where + '#' + head)}</section>`;
  });
  for (const s of skills) if (!seen.has(s.id)) problems.push(`${where}: subskill ${s.id} 没有对应正文`);

  const ev = EVID[fm.evidence] || EVID.syllabus;
  const railHtml = rail.map((r) => `<li class="${r.skill ? 'rs' : 'rp'}"><a href="#${r.id}"${r.skill ? ` data-skill="${r.id}"` : ''}><span class="dot" aria-hidden="true"></span><span class="rl">${md.renderInline(r.label)}</span></a></li>`).join('');
  const openHtml = (fm.open || []).map((o) => `<li><a href="${o.url}" rel="noopener">${esc(o.label)}</a><span>${inl(o.note || '')}</span></li>`).join('');
  const srcHtml = (fm.sources || []).map((o) => `<li><a href="${o.url}" rel="noopener">${esc(o.label)}</a>${o.note ? `<span>${inl(o.note)}</span>` : ''}</li>`).join('');
  const body = `<main id="main" class="course" data-course="${c.code}" data-title="${esc(c.title)}" data-zh="${esc(c.zh)}">
<header class="c-head">
  <p class="c-line">${lineOf[c.line].name}线</p>
  <h1><span class="c-code">${c.code}</span><span class="c-zh">${c.zh}</span></h1>
  <p class="c-title">${esc(c.title)}</p>
  <dl class="c-meta">
    <div><dt>依据</dt><dd><strong>${ev[0]}</strong>${inl(fm.evidenceNote || ev[1])}</dd></div>
    ${fm.exam ? `<div><dt>考试</dt><dd>${inl(fm.exam)}</dd></div>` : ''}
  </dl>
</header>
<div class="c-grid">
<nav class="rail" aria-label="本课各站"><ol>${railHtml}</ol></nav>
<div class="c-body">
<section class="mine" aria-label="我的进度">
  <h2>我的进度</h2>
  <div class="map-rows" id="skill-map"></div>
  <p class="mine-note">等级自己点，标准写在每一站开头。想被真正提问，把进度块贴回 Claude 对话里说 “resume from:”。</p>
  <div class="mine-act"><button type="button" id="btn-copy">复制进度块</button><span id="copy-ok" aria-live="polite"></span>
  <details><summary>从进度块恢复</summary><textarea id="imp" rows="5" aria-label="粘贴进度块"></textarea><button type="button" id="btn-imp">恢复</button><span id="imp-ok" aria-live="polite"></span></details></div>
</section>
${intro ? `<section class="plain lead">${renderMd(intro, where)}</section>` : ''}
${secs.join('\n')}
${openHtml ? `<section class="plain" id="open"><h2>公开课对照</h2><p>讲法不同、内容对得上的公开材料。想换个角度看同一件事，从这里进。</p><ul class="links">${openHtml}</ul></section>` : ''}
${srcHtml ? `<section class="plain" id="src"><h2>来源</h2><ul class="links">${srcHtml}</ul></section>` : ''}
</div></div></main>`;
  fs.writeFileSync(path.join(OUT, 'courses', c.code + '.html'), shell({ title: `${c.code} ${c.zh} · Socrates`, root: '../', body, line: c.line, cls: 'p-course' }));
  return { code: c.code, skills: skills.map((s) => ({ id: s.id, name: s.name })) };
}

// ---------- 概念线页 ----------
function buildThread(file) {
  const { data: fm, content } = matter(fs.readFileSync(file, 'utf8'));
  const slug = path.basename(file, '.md');
  const body = `<main id="main" class="thread"><header class="c-head"><p class="c-line">概念线</p><h1><span class="c-zh">${esc(fm.title)}</span></h1><p class="c-title">${inl(fm.lead || '')}</p></header>
<div class="t-body">${renderMd(content, 'thread:' + slug)}</div></main>`;
  fs.writeFileSync(path.join(OUT, 'threads', slug + '.html'), shell({ title: `${fm.title} · 概念线 · Socrates`, root: '../', body, line: fm.line, cls: 'p-thread' }));
  return { slug, title: fm.title, lead: fm.lead || '', stops: fm.stops || [] };
}

// ---------- 谱系图 ----------
function buildMap(written) {
  // 去掉可由更长路径推出的官方先修边，图更干净
  const adj = {};
  for (const e of edges) (adj[e.from] ||= []).push(e.to);
  const reach = (a, b, skip) => {
    const st = [...(adj[a] || []).filter((x) => !(x === b && skip))], seenN = new Set();
    while (st.length) { const x = st.pop(); if (x === b) return true; if (!seenN.has(x)) { seenN.add(x); st.push(...(adj[x] || [])); } }
    return false;
  };
  const E = edges.filter((e) => !reach(e.from, e.to, true));
  EDGES_R = E;
  const inc = {};
  for (const e of edges) (inc[e.to] ||= []).push(e.from);
  const depth = {};
  const dep = (c) => depth[c] ?? (depth[c] = Math.max(-1, ...(inc[c] || []).map(dep)) + 1);
  courses.forEach((c) => dep(c.code));
  const maxD = Math.max(...Object.values(depth));
  const X0 = 150, COL = 236, ROW = 31, GAP = 20, R = 6.5;
  let y = 34;
  const pos = {};
  const bands = [];
  for (const l of lines) {
    const cols = Array.from({ length: maxD + 1 }, () => []);
    courses.filter((c) => c.line === l.id).forEach((c) => cols[depth[c.code]].push(c));
    const rows = Math.max(...cols.map((a) => a.length));
    cols.forEach((a, di) => a.forEach((c, i) => { pos[c.code] = { x: X0 + di * COL, y: y + (i + (rows - a.length) / 2 + 0.5) * ROW }; }));
    bands.push({ l, y0: y, y1: y + rows * ROW });
    y += rows * ROW + GAP;
  }
  const W = X0 + maxD * COL + 210, H = y + 6;
  let o = '';
  for (const b of bands) {
    o += `<g class="band" data-line="${b.l.id}" style="--line-l:${b.l.color};--line-dk:${b.l.dark}">`;
    o += `<rect class="band-bg" x="0" y="${b.y0 - 4}" width="${W}" height="${b.y1 - b.y0 + 8}"/>`;
    o += `<rect class="band-bar" x="10" y="${b.y0 + 3}" width="5" height="${b.y1 - b.y0 - 6}" rx="2.5"/>`;
    o += `<text class="band-name" x="24" y="${(b.y0 + b.y1) / 2 + 5}">${b.l.name}</text></g>`;
  }
  // 出边从"站名"的右端出发，不从圆点出发，这样线不会压在自己的站名上
  const labelW = (c) => c.code.length * 8.4 + 6 + [...c.zh].reduce((w, ch) => w + (ch.charCodeAt(0) > 0x2e80 ? 12.2 : 6.6), 0);
  const curveD = (a, b) => { const mx = (a.x + b.x) / 2; return `M${a.x} ${a.y}C${mx} ${a.y} ${mx} ${b.y} ${b.x} ${b.y}`; };
  o += '<g class="edges">';
  for (const e of E) {
    const a0 = pos[e.from], b = pos[e.to];
    const a = { x: a0.x + 13 + labelW(courseOf[e.from]) + 5, y: a0.y };
    const same = courseOf[e.from].line === courseOf[e.to].line;
    const l = lineOf[courseOf[e.to].line];
    o += `<path class="edge ${same ? 'same' : 'cross'} ${e.kind}" data-from="${e.from}" data-to="${e.to}" style="--line-l:${l.color};--line-dk:${l.dark}" d="${curveD(a, b)}"/>`;
  }
  o += '</g><g class="stations">';
  for (const c of courses) {
    const p = pos[c.code], l = lineOf[c.line], has = written.has(c.code);
    const inner = `<circle class="st-dot" cx="${p.x}" cy="${p.y}" r="${R}"/><text class="st-code" x="${p.x + 13}" y="${p.y + 4.5}">${c.code}<tspan class="st-zh" dx="6">${c.zh}</tspan></text>`;
    const attrs = `class="st ${has ? 'on' : 'off'}" data-code="${c.code}" data-line="${c.line}" style="--line-l:${l.color};--line-dk:${l.dark}"`;
    o += has
      ? `<a ${attrs} href="courses/${c.code}.html" aria-label="${c.code} ${c.zh}，已写好">${inner}</a>`
      : `<g ${attrs} tabindex="0" role="img" aria-label="${c.code} ${c.zh}，还没写">${inner}</g>`;
  }
  o += '</g>';
  return `<svg id="gmap" class="gmap" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="group" aria-label="课程谱系图：${courses.length} 门课，先修在左，后续在右">${o}</svg>`;
}

// ---------- 关系图（力导向布局，构建时算好） ----------
function buildGraph(written) {
  const d3 = require('d3-force');
  const CX = 600, CY = 420;
  const center = {};
  lines.forEach((l, i) => { const a = (i / lines.length) * 2 * Math.PI - Math.PI / 2; center[l.id] = [CX + 430 * Math.cos(a), CY + 300 * Math.sin(a)]; });
  const out = {};
  for (const e of EDGES_R) out[e.from] = (out[e.from] || 0) + 1;
  const seenInLine = {};
  const nodes = courses.map((c) => {
    const k = (seenInLine[c.line] = (seenInLine[c.line] || 0) + 1);
    return { id: c.code, line: c.line, r: Math.min(6 + 1.1 * (out[c.code] || 0), 15), x: center[c.line][0] + 24 * Math.cos(k * 2.4), y: center[c.line][1] + 24 * Math.sin(k * 2.4) };
  });
  const links = EDGES_R.map((e) => ({ source: e.from, target: e.to, kind: e.kind, same: courseOf[e.from].line === courseOf[e.to].line }));
  const sim = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id((n) => n.id).distance((l) => (l.same ? 84 : 170)).strength((l) => (l.same ? 0.7 : 0.06)))
    .force('charge', d3.forceManyBody().strength(-380).distanceMax(460))
    .force('collide', d3.forceCollide(47).strength(1))
    .force('x', d3.forceX((n) => center[n.line][0]).strength(0.15))
    .force('y', d3.forceY((n) => center[n.line][1]).strength(0.2))
    .stop();
  for (let i = 0; i < 600; i++) sim.tick();
  const xs = nodes.map((n) => n.x), ys = nodes.map((n) => n.y);
  const minX = Math.min(...xs), minY = Math.min(...ys);
  const PADX = 70, PADT = 30, PADB = 50;
  nodes.forEach((n) => { n.x = Math.round(n.x - minX + PADX); n.y = Math.round(n.y - minY + PADT); });
  const W = Math.round(Math.max(...xs) - minX + 2 * PADX), H = Math.round(Math.max(...ys) - minY + PADT + PADB);
  const at = Object.fromEntries(nodes.map((n) => [n.id, n]));
  let o = '<g class="edges">';
  for (const l of links) {
    const a = l.source, b = l.target, dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
    const tx = b.x - ux * (b.r + 4), ty = b.y - uy * (b.r + 4);
    const ln = lineOf[b.line];
    const cls = `${l.same ? 'same' : 'cross'} ${l.kind}`, data = `data-from="${a.id}" data-to="${b.id}" style="--line-l:${ln.color};--line-dk:${ln.dark}"`;
    o += `<line class="edge ${cls}" ${data} x1="${a.x}" y1="${a.y}" x2="${(tx - ux * 6).toFixed(1)}" y2="${(ty - uy * 6).toFixed(1)}"/>`;
    const s = l.same ? 5 : 4;
    o += `<polygon class="edge arr ${cls}" ${data} points="${tx.toFixed(1)},${ty.toFixed(1)} ${(tx - ux * 9 - uy * s).toFixed(1)},${(ty - uy * 9 + ux * s).toFixed(1)} ${(tx - ux * 9 + uy * s).toFixed(1)},${(ty - uy * 9 - ux * s).toFixed(1)}"/>`;
  }
  o += '</g><g class="stations">';
  for (const c of courses) {
    const n = at[c.code], l = lineOf[c.line], has = written.has(c.code);
    const inner = `<circle class="st-dot" cx="${n.x}" cy="${n.y}" r="${n.r.toFixed(1)}"/><text class="st-code" x="${n.x}" y="${(n.y + n.r + 14).toFixed(1)}">${c.code}</text><text class="st-zh2" x="${n.x}" y="${(n.y + n.r + 27).toFixed(1)}">${c.zh}</text>`;
    const attrs = `class="st ${has ? 'on' : 'off'}" data-code="${c.code}" data-line="${c.line}" style="--line-l:${l.color};--line-dk:${l.dark}"`;
    o += has
      ? `<a ${attrs} href="courses/${c.code}.html" aria-label="${c.code} ${c.zh}，已写好">${inner}</a>`
      : `<g ${attrs} tabindex="0" role="img" aria-label="${c.code} ${c.zh}，还没写">${inner}</g>`;
  }
  o += '</g>';
  return `<svg class="gmap net" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="group" aria-label="课程关系图：箭头从先修指向后续，圆越大后续课越多">${o}</svg>`;
}

// ---------- 首页 ----------
function buildHome(built, threads) {
  const written = new Set(built.map((b) => b.code));
  const legend = lines.map((l) => `<button type="button" class="lg" data-line="${l.id}" aria-pressed="false" style="--line-l:${l.color};--line-dk:${l.dark}"><span class="lg-sw" aria-hidden="true"></span>${l.name}</button>`).join('');
  const lineList = lines.map((l) => {
    const items = courses.filter((c) => c.line === l.id).map((c) => written.has(c.code)
      ? `<li><a href="courses/${c.code}.html"><span class="ll-code">${c.code}</span>${c.zh}<span class="ll-en">${esc(c.title)}</span></a></li>`
      : `<li class="off"><span class="ll-code">${c.code}</span>${c.zh}<span class="ll-en">${esc(c.title)}</span></li>`).join('');
    return `<section class="ll" style="--line-l:${l.color};--line-dk:${l.dark}"><h3>${l.name}</h3><ul>${items}</ul></section>`;
  }).join('');
  const threadList = threads.map((t) => `<li><a href="threads/${t.slug}.html">${esc(t.title)}</a><span>${inl(t.lead)}</span></li>`).join('');
  const body = `<main id="main" class="home">
<section class="hero" id="map">
  <div class="hero-t">
    <h1>课程谱系</h1>
    <p>${courses.length} 门课排成 ${lines.length} 条线。左边的课是右边的先修。实心的站已经写好，点进去一站一站读；空心的还没写。</p>
  </div>
  <div class="hero-ctl">
    <label class="find"><span>找一门课</span><input id="find" type="search" placeholder="课号或名字，比如 2131、控制" autocomplete="off"></label>
    <div class="legend" role="group" aria-label="只看一条线">${legend}</div>
    <p class="key"><span class="k-on" aria-hidden="true"></span>已写好 <span class="k-off" aria-hidden="true"></span>还没写 <span class="k-pre" aria-hidden="true"></span>官方先修 <span class="k-con" aria-hidden="true"></span>内容上接着讲</p>
  </div>
  <div class="view-sw" role="group" aria-label="换一种画法"><button type="button" data-view="lines" aria-pressed="true">线路图</button><button type="button" data-view="net" aria-pressed="false">关系图</button><span class="view-note" id="view-note">按线分行，先修在左，后续在右。</span></div>
  <div class="map-wrap" data-view="lines" tabindex="0" role="region" aria-label="线路图，可横向滚动">${buildMap(written)}</div>
  <div class="map-wrap" data-view="net" hidden tabindex="0" role="region" aria-label="关系图，可横向滚动">${buildGraph(written)}</div>
</section>
<section class="sec" id="lines"><h2>全部课程</h2><div class="ll-grid">${lineList}</div></section>
<section class="sec" id="threads"><h2>概念线</h2><p class="sec-lead">同一个想法在不同课里换着名字出现。一条概念线把这些地方串起来。</p><ul class="links">${threadList}</ul></section>
<section class="sec how" id="how"><h2>怎么用</h2>
<div class="how-grid">
<div><h3>每门课拆成几站</h3><p>一站是一项能力。每站开头写明 3、4、5 级分别要做到什么，有往年卷子的课，4 级直接对应卷子上的某道题。</p></div>
<div><h3>每站的写法固定</h3><p>先说这一站要解决什么问题，再摆出一个看起来对的错想法，说清它错在哪，然后才是正确的推导、图解和边界情况。</p></div>
<div><h3>等级自己点</h3><p>0 没听过，1 听过，2 能跟上，3 有提示能做，4 能独立做，5 能讲给别人。网站没法考你，所以要对自己严一点：没独立做出来过，就不算 4。</p></div>
<div><h3>想被提问</h3><p>课程页里“复制进度块”，贴到 Claude 对话里说 “resume from:”，那边会按你的等级接着问。</p></div>
</div></section>
</main>`;
  fs.writeFileSync(path.join(OUT, 'index.html'), shell({ title: 'Socrates · 课程谱系', root: './', body, cls: 'p-home' }));
}

// ---------- 主流程 ----------
function copyDir(src, dst, filter = () => true) {
  fs.mkdirSync(dst, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    const s = path.join(src, f), t = path.join(dst, f);
    if (fs.statSync(s).isDirectory()) copyDir(s, t, filter);
    else if (filter(f)) fs.copyFileSync(s, t);
  }
}
fs.rmSync(OUT, { recursive: true, force: true });
for (const dd of ['courses', 'threads', 'assets/katex/fonts']) fs.mkdirSync(path.join(OUT, dd), { recursive: true });
const kdist = path.join(path.dirname(require.resolve('katex/package.json')), 'dist');
fs.copyFileSync(path.join(kdist, 'katex.min.css'), path.join(OUT, 'assets/katex/katex.min.css'));
copyDir(path.join(kdist, 'fonts'), path.join(OUT, 'assets/katex/fonts'), (f) => f.endsWith('.woff2'));
copyDir(path.join(ROOT, 'src/assets'), path.join(OUT, 'assets'));
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

const cdir = path.join(ROOT, 'content/courses'), tdir = path.join(ROOT, 'content/threads');
const built = fs.readdirSync(cdir).filter((f) => f.endsWith('.md')).sort().map((f) => buildCourse(path.join(cdir, f)));
const threads = fs.readdirSync(tdir).filter((f) => f.endsWith('.md')).sort().map((f) => buildThread(path.join(tdir, f)));
buildHome(built, threads);

console.log(`built ${built.length} courses, ${threads.length} threads → docs/`);
if (problems.length) { console.error('问题：\n' + problems.join('\n')); process.exit(1); }
