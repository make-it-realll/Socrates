// Socrates 的前端脚本：只做三件事——记住你点的等级、在谱系图上高亮先修链、导出/恢复进度块。
(function () {
  'use strict';
  var KEY = 'socrates:v1';
  var NAMES = ['没听过', '听过', '能跟上', '有提示能做', '能独立做', '能讲给别人'];

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || { courses: {} }; } catch (e) { return { courses: {} }; }
  }
  function save(db) {
    try { localStorage.setItem(KEY, JSON.stringify(db)); return true; } catch (e) { return false; }
  }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  // ---------- 课程页 ----------
  var main = $('main.course');
  if (main) {
    var code = main.dataset.course;
    var stops = $$('.stop[data-skill]');
    var db = load();
    var rec = db.courses[code] || { lv: {} };
    rec.n = stops.length;

    var paint = function () {
      var sum = 0;
      var rows = stops.map(function (st) {
        var id = st.dataset.skill, lv = rec.lv[id] || 0;
        sum += lv;
        $$('.rate-b', st).forEach(function (b) {
          var k = +b.dataset.level;
          b.classList.toggle('fill', k <= lv && lv > 0 || (k === 0 && lv === 0));
          b.setAttribute('aria-pressed', String(k === lv));
        });
        $('.rate-now', st).textContent = lv + ' 级 · ' + NAMES[lv];
        var dot = $('.rail a[data-skill="' + id + '"] .dot');
        if (dot) dot.style.setProperty('--lv', lv);
        var bar = '';
        for (var i = 1; i <= 5; i++) bar += '<i' + (i <= lv ? ' class="f"' : '') + '></i>';
        return '<div class="mr"><a href="#' + id + '">' + st.dataset.name + '</a><span class="mr-bar" aria-hidden="true">' + bar + '</span><span class="mr-n">' + lv + '/5</span></div>';
      });
      $('#skill-map').innerHTML = rows.join('');
      var pct = stops.length ? Math.round((sum / (5 * stops.length)) * 100) : 0;
      var h = $('.mine h2');
      h.innerHTML = '我的进度<span class="tot">' + pct + '%</span>';
    };
    var commit = function () { db.courses[code] = rec; save(db); paint(); };

    stops.forEach(function (st) {
      $$('.rate-b', st).forEach(function (b) {
        b.addEventListener('click', function () { rec.lv[st.dataset.skill] = +b.dataset.level; commit(); });
      });
    });
    paint();

    var block = function () {
      var lines = ['resume from:', 'Topic: ' + code + ' ' + main.dataset.title + '（' + main.dataset.zh + '）', 'Target: 4/5 on every subskill', 'Skill map (self-rated on Socrates, not yet verified by questioning):'];
      stops.forEach(function (st) { lines.push('- ' + st.dataset.name + ' [' + st.dataset.skill + ']: ' + (rec.lv[st.dataset.skill] || 0) + '/5'); });
      lines.push('Notes: 等级是我在 Socrates 上自评的，没有被提问检验过。请先用两三个问题核对每一项，再从最弱的一项开始。');
      return lines.join('\n');
    };
    $('#btn-copy').addEventListener('click', function () {
      var t = block(), ok = $('#copy-ok');
      var done = function () { ok.textContent = '已复制'; setTimeout(function () { ok.textContent = ''; }, 2500); };
      var fallback = function () { var ta = $('#imp'); ta.closest('details').open = true; ta.value = t; ta.select(); ok.textContent = '已放进下面的文本框，请手动复制'; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, fallback); else fallback();
    });
    $('#btn-imp').addEventListener('click', function () {
      var txt = $('#imp').value, n = 0, re = /\[([\w-]+)\]:\s*([0-5])\s*\/\s*5/g, m;
      var ids = stops.map(function (s) { return s.dataset.skill; });
      while ((m = re.exec(txt))) if (ids.indexOf(m[1]) >= 0) { rec.lv[m[1]] = +m[2]; n++; }
      if (n) commit();
      $('#imp-ok').textContent = n ? '已恢复 ' + n + ' 项' : '没认出进度块。要的是带 “[id]: 3/5” 这种行的文本。';
    });

    // 读到哪一站，侧边线路上就亮哪一站
    if ('IntersectionObserver' in window) {
      var links = {};
      $$('.rail a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { $$('.rail a.here').forEach(function (a) { a.classList.remove('here'); }); var a = links[e.target.id]; if (a) a.classList.add('here'); }
        });
      }, { rootMargin: '-15% 0px -75% 0px' });
      $$('.c-body section[id]').forEach(function (s) { io.observe(s); });
    }
  }

  // ---------- 首页：线路图与关系图 ----------
  var maps = $$('.gmap');
  if (maps.length) {
    var pinned = null, query = '', resets = [];
    maps.forEach(function (gmap) {
      var sts = $$('.st', gmap), eds = $$('.edge', gmap), bands = $$('.band', gmap);
      var up = {}, down = {}, lineOfCode = {};
      sts.forEach(function (s) { lineOfCode[s.dataset.code] = s.dataset.line; });
      eds.forEach(function (e) {
        (down[e.dataset.from] = down[e.dataset.from] || []).push(e.dataset.to);
        (up[e.dataset.to] = up[e.dataset.to] || []).push(e.dataset.from);
      });
      var chain = function (c) {
        var a = {}, b = {}; a[c] = 1; b[c] = 1;
        var walk = function (x, g, set) { (g[x] || []).forEach(function (y) { if (!set[y]) { set[y] = 1; walk(y, g, set); } }); };
        walk(c, up, a); walk(c, down, b);
        return { up: a, down: b };
      };
      var apply = function (keepSt, keepEd) {
        gmap.classList.add('dim');
        sts.forEach(function (s) { s.classList.toggle('hl', !!keepSt(s)); });
        eds.forEach(function (e) { e.classList.toggle('hl', !!keepEd(e)); });
        bands.forEach(function (b) { b.classList.add('hl'); });
      };
      var reset = function () {
        if (pinned) return apply(function (s) { return s.dataset.line === pinned; }, function (e) { return lineOfCode[e.dataset.from] === pinned && lineOfCode[e.dataset.to] === pinned; });
        if (query) return apply(function (s) { return s.getAttribute('aria-label').toLowerCase().indexOf(query) >= 0; }, function () { return false; });
        gmap.classList.remove('dim');
        $$('.hl', gmap).forEach(function (x) { x.classList.remove('hl'); });
      };
      resets.push(reset);
      sts.forEach(function (s) {
        var on = function () {
          var ch = chain(s.dataset.code);
          apply(function (x) { return ch.up[x.dataset.code] || ch.down[x.dataset.code]; },
            function (e) { return (ch.up[e.dataset.from] && ch.up[e.dataset.to]) || (ch.down[e.dataset.from] && ch.down[e.dataset.to]); });
        };
        s.addEventListener('mouseenter', on); s.addEventListener('focus', on);
        s.addEventListener('mouseleave', reset); s.addEventListener('blur', reset);
      });
    });
    var resetAll = function () { resets.forEach(function (r) { r(); }); };
    $$('.lg').forEach(function (b) {
      b.addEventListener('click', function () {
        pinned = pinned === b.dataset.line ? null : b.dataset.line;
        $$('.lg').forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.line === pinned)); });
        resetAll();
      });
    });
    var find = $('#find');
    find.addEventListener('input', function () {
      query = find.value.trim().toLowerCase();
      resetAll();
      if (query) { var hit = $('.map-wrap:not([hidden]) .st.hl'); if (hit && hit.scrollIntoView) hit.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
    });
    // 两种画法之间切换，记住上次的选择
    var NOTES = { lines: '按线分行，先修在左，后续在右。', net: '箭头从先修指向后续；圆越大，后面接着它的课越多。' };
    var show = function (v) {
      $$('.map-wrap').forEach(function (w) { w.hidden = w.dataset.view !== v; });
      $$('.view-sw button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.view === v)); });
      $('#view-note').textContent = NOTES[v];
      try { localStorage.setItem(KEY + ':view', v); } catch (e) {}
    };
    $$('.view-sw button').forEach(function (b) { b.addEventListener('click', function () { show(b.dataset.view); }); });
    var last = null; try { last = localStorage.getItem(KEY + ':view'); } catch (e) {}
    if (last === 'net') show('net');
    // 已经点过等级的课，在站名后面标上百分比
    var saved = load().courses;
    Object.keys(saved).forEach(function (c) {
      var r = saved[c];
      if (!r.n) return;
      var sum = 0; Object.keys(r.lv || {}).forEach(function (k) { sum += r.lv[k]; });
      if (!sum) return;
      $$('.st[data-code="' + c + '"] .st-code').forEach(function (st) {
        var t = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        t.setAttribute('class', 'st-pct'); t.setAttribute('dx', '5');
        t.textContent = Math.round((sum / (5 * r.n)) * 100) + '%';
        st.appendChild(t);
      });
    });
  }

  // ---------- 动图：点一下暂停/继续；系统要求减少动效时默认停住 ----------
  var anims = $$('svg.fig-anim');
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  anims.forEach(function (sv) {
    if (!sv.pauseAnimations) return;
    var fig = sv.closest('.fig');
    if (fig) fig.classList.add('has-anim');
    var set = function (paused) {
      if (paused) sv.pauseAnimations(); else sv.unpauseAnimations();
      if (fig) fig.classList.toggle('is-paused', paused);
    };
    if (still) { sv.setCurrentTime(0); set(true); }
    sv.addEventListener('click', function () { set(!sv.animationsPaused()); });
  });
})();
