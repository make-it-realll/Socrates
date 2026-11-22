// Re-number "第 N 站" in links of the form [...第 N 站...](../courses/CODE.html#id) (or CODE.html#id) to match the target page's current station order.
import fs from 'fs';
const dir = 'content/courses', tdir = 'content/threads';
const order = {};
for (const f of fs.readdirSync(dir)) if (f.endsWith('.md')) {
  const ids = [...fs.readFileSync(`${dir}/${f}`, 'utf8').matchAll(/^## \[([\w.-]+)\]/gm)].map((m) => m[1]);
  order[f.slice(0, -3)] = Object.fromEntries(ids.map((id, i) => [id, i + 1]));
}
let changes = 0;
const files = [...fs.readdirSync(dir).map((f) => `${dir}/${f}`), ...fs.readdirSync(tdir).map((f) => `${tdir}/${f}`)].filter((f) => f.endsWith('.md'));
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const self = file.startsWith(dir) ? file.split('/').pop().slice(0, -3) : null;
  const out = src.replace(/\[([^\]\n]*?)第 ?(\d+) ?站([^\]\n]*?)\]\(((?:\.\.\/courses\/)?([\w.-]+)\.html)?#([\w.-]+)\)/g, (m, pre, n, post, path, code, id) => {
    const c = code || self; const k = order[c]?.[id];
    if (!k || String(k) === n) return m;
    changes++; console.log(`${file}: ${c}#${id} 第${n}站 → 第${k}站`);
    return m.replace(/第 ?\d+ ?站/, (s) => s.replace(/\d+/, k));
  });
  if (out !== src) fs.writeFileSync(file, out);
}
console.log('changes', changes);
