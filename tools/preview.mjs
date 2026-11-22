// 预览并检查一门课：node tools/preview.mjs CS2040
// 只构建这一门课到 /tmp/socrates-<code>/，然后用无头浏览器检查，并把每张图和整页截图存到 shots/ 里。
// 需要 playwright（沙盒里在 /opt/npm-tools/node_modules）。
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const code = (process.argv[2] || '').toUpperCase();
if (!code) { console.error('用法：node tools/preview.mjs <课程代码>'); process.exit(2); }
// 概念线：node tools/preview.mjs thread:least-squares
const isThread = code.startsWith('THREAD:');
const slug = isThread ? code.slice(7).toLowerCase() : '';
const out = isThread ? `/tmp/socrates-thread-${slug}` : `/tmp/socrates-${code.toLowerCase()}`;
const NP = [path.join(ROOT, 'node_modules'), '/opt/npm-tools/node_modules', ...(process.env.NODE_PATH || '').split(':')].filter((d) => d && fs.existsSync(path.join(d, 'markdown-it'))).concat(['/opt/npm-tools/node_modules'])[0];
try {
  console.log(execFileSync('node', ['src/build.mjs'], { cwd: ROOT, env: { ...process.env, NODE_PATH: NP, SOCRATES_OUT: out, ONLY: isThread ? '__NONE__' : code }, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim());
} catch (e) { console.error('构建失败：\n' + (e.stdout || '') + (e.stderr || '')); process.exit(1); }

const require = createRequire(NP + '/');
const { chromium } = require('playwright');
const shots = path.join(out, 'shots');
fs.rmSync(shots, { recursive: true, force: true }); fs.mkdirSync(shots, { recursive: true });
const b = await chromium.launch();
const url = 'file://' + (isThread ? path.join(out, 'threads', slug + '.html') : path.join(out, 'courses', code + '.html'));
// 概念线里指向课程页的链接：课要已发布，#id 要是那门课真有的站
if (isThread) {
  const pub = new Set(fs.readFileSync(path.join(ROOT, 'tools/published.txt'), 'utf8').split(/\s+/).filter(Boolean));
  const md = fs.readFileSync(path.join(ROOT, 'content/threads', slug + '.md'), 'utf8');
  const dead = [];
  for (const m of md.matchAll(/\.\.\/courses\/([A-Za-z0-9.\-]+)\.html(?:#([\w-]+))?/g)) {
    const [, c, id] = m;
    if (!pub.has(c)) { dead.push(`${c}（还没发布）`); continue; }
    if (id) { const cm = fs.readFileSync(path.join(ROOT, 'content/courses', c + '.md'), 'utf8'); if (!new RegExp('^## \\[' + id + '\\]', 'm').test(cm) && !cm.includes(`id="${id}"`) && !new RegExp('^## [^\\n]*\\{#' + id + '\\}', 'm').test(cm)) dead.push(`${c}#${id}（没有这一站）`); }
  }
  if (dead.length) { console.log('概念线里有失效的链接：' + [...new Set(dead)].join('，')); }
}
let bad = 0;
for (const w of [1180, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 1200 } });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto(url); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const wide = [];
    document.querySelectorAll('.katex-display').forEach((d) => { const k = d.querySelector('.katex'); const pw = d.parentElement.getBoundingClientRect().width; if (k && k.getBoundingClientRect().width > pw + 2 && getComputedStyle(d).overflowX === 'visible') wide.push(k.textContent.slice(0, 50)); });
    // 图里的文字有没有伸出画布
    const clipped = [];
    document.querySelectorAll('svg.fig-svg').forEach((s, i) => { const vb = s.viewBox.baseVal; s.querySelectorAll('text').forEach((t) => { const bb = t.getBBox(); if (bb.x < vb.x - 1 || bb.y < vb.y - 1 || bb.x + bb.width > vb.x + vb.width + 1 || bb.y + bb.height > vb.y + vb.height + 1) clipped.push(`图 ${i + 1}: “${t.textContent.slice(0, 30)}”`); }); });
    // 动图的 keyTimes：必须从 0 开始、不减、个数和 values 一样；linear 的最后一个必须是 1，否则浏览器整段忽略
    const badAnim = [];
    document.querySelectorAll('svg.fig-svg').forEach((s, i) => { s.querySelectorAll('animate, animateTransform').forEach((a) => { const kt = a.getAttribute('keyTimes'), vs = a.getAttribute('values'); if (!kt || !vs) return; const k = kt.split(';').map(Number), n = vs.split(';').length, disc = a.getAttribute('calcMode') === 'discrete'; let ok = k.length === n && Math.abs(k[0]) < 1e-9 && k.every((x, j) => j === 0 || x >= k[j - 1]) && (disc ? k[k.length - 1] <= 1 + 1e-9 : Math.abs(k[k.length - 1] - 1) < 1e-9); if (!ok && !badAnim.includes(i + 1)) badAnim.push(i + 1); }); });
    return { badAnim, docW: document.documentElement.scrollWidth, katexErr: document.querySelectorAll('.katex-error').length, wide, clipped, figs: document.querySelectorAll('svg.fig-svg').length, stations: document.querySelectorAll('.stop-h').length, chars: document.querySelector('main').innerText.length };
  });
  const issues = [];
  if (r.docW > w + 1) issues.push(`页面比视口宽（${r.docW} > ${w}），有东西撑破了版面`);
  if (r.katexErr) issues.push(`${r.katexErr} 处公式渲染失败`);
  if (r.wide.length) issues.push('公式超宽：' + r.wide.join(' | '));
  if (w === 1180 && r.clipped.length) issues.push('图里的文字伸出了画布：' + r.clipped.join('；'));
  if (errs.length) issues.push('脚本错误：' + errs.join(' | '));
  if (w === 1180 && r.badAnim.length) issues.push('动图的 keyTimes 不合法（浏览器会不播放），图：' + r.badAnim.join(', '));
  console.log(`[${w}px] ${r.stations} 站，${r.figs} 张图，正文约 ${r.chars} 字` + (issues.length ? '\n  问题：\n  - ' + issues.join('\n  - ') : '，没有发现版面问题'));
  bad += issues.length;
  if (w === 1180) {
    const figs = await p.$$('.fig');
    // 动图停在第一帧再截，这样截到的是 reduced-motion 和静态时看到的样子
    await p.evaluate(() => document.querySelectorAll('svg.fig-anim').forEach((sv) => { sv.pauseAnimations(); sv.setCurrentTime(0); }));
    for (let i = 0; i < figs.length; i++) { await figs[i].scrollIntoViewIfNeeded(); await figs[i].screenshot({ path: path.join(shots, `fig-${String(i + 1).padStart(2, '0')}.png`) }); }
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    let n = 0;
    for (let y = 0; y < H; y += 1500) { await p.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y); await p.waitForTimeout(60); await p.screenshot({ path: path.join(shots, `page-${String(++n).padStart(2, '0')}.png`), clip: { x: 0, y: 0, width: w, height: Math.min(1500, 1200) } }); }
    console.log(`截图在 ${shots}/（fig-NN.png 每张图一张，page-NN.png 整页分段）。图一定要逐张打开看：文字有没有互相压住、压住线条。`);
  }
  await p.close();
}
await b.close();
process.exit(bad ? 1 : 0);
