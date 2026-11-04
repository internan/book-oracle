/* Inter Books — Book Oracle quiz.
   Reads the book list from a published Google Sheet (CSV). Renders inside a shadow root so the
   Squarespace theme's styles can't clash with it. Settings live in window.IB_ORACLE_CONFIG. */
(function () {
  'use strict';

  var CSS = "/* Oracle stage: a night-indigo panel set into the paper page, brass rules, oxblood only for small marks.\n   Single deliberate look (it sits inside the light Inter Books site), so colours are set explicitly. */\n:host, .ibo {\n  --night: #2F2A4A;\n  --night-2: #3A345C;\n  --night-3: #4A4370;\n  --paper: #F7F5F2;\n  --paper-dim: #CFC9D9;\n  --brass: #B08D57;\n  --brass-hi: #D2B27E;\n  --ink: #2B2724;\n  --oxblood: #8E1B22;\n  --display: \"IM Fell English\", \"Iowan Old Style\", \"Palatino Linotype\", Palatino, Georgia, serif;\n  --smallcaps: \"IM Fell English SC\", \"IM Fell English\", Georgia, serif;\n  --body: \"Alegreya Sans\", \"Gill Sans\", \"Trebuchet MS\", system-ui, sans-serif;\n}\n:host { display: block; }\n* { box-sizing: border-box; }\n[hidden] { display: none !important; }\n.ibo {\n  position: relative;\n  max-width: 960px;\n  margin: 0 auto;\n  background: var(--night);\n  color: var(--paper);\n  font-family: var(--body);\n  font-size: 17px;\n  line-height: 1.5;\n  border-radius: 6px;\n  overflow: hidden;\n  isolation: isolate;\n}\n.ibo::before {\n  content: \"\";\n  position: absolute; inset: 10px;\n  border: 1px solid rgba(176, 141, 87, 0.45);\n  border-radius: 3px;\n  pointer-events: none;\n  z-index: -1;\n}\n.stage {\n  padding: clamp(28px, 5vw, 56px) clamp(20px, 5vw, 56px) clamp(32px, 5vw, 56px);\n  min-height: 520px;\n  display: flex; flex-direction: column; gap: 24px;\n}\n.eyebrow {\n  font-family: var(--smallcaps);\n  letter-spacing: 0.14em;\n  font-size: 0.82rem;\n  color: var(--brass-hi);\n  margin: 0;\n}\nh2, h3 { font-family: var(--display); font-weight: 400; margin: 0; text-wrap: balance; }\nh2 { font-size: clamp(1.9rem, 4.6vw, 2.8rem); line-height: 1.1; }\nh3 { font-size: 1.35rem; line-height: 1.2; }\np { margin: 0; }\n.lede { color: var(--paper-dim); max-width: 34em; font-size: 1.05rem; }\n\n/* buttons */\nbutton { font: inherit; color: inherit; }\n.btn {\n  display: inline-flex; align-items: center; justify-content: center; gap: 8px;\n  min-height: 46px; padding: 0 22px;\n  border-radius: 999px;\n  border: 1px solid var(--brass);\n  background: var(--brass); color: var(--ink);\n  font-family: var(--body); font-weight: 700; font-size: 0.98rem; letter-spacing: 0.02em;\n  text-decoration: none; cursor: pointer;\n  transition: background .15s ease, border-color .15s ease, color .15s ease;\n}\n.btn:hover { background: var(--brass-hi); border-color: var(--brass-hi); }\n.btn.ghost { background: transparent; color: var(--paper); border-color: rgba(247,245,242,.35); }\n.btn.ghost:hover { border-color: var(--brass-hi); color: var(--brass-hi); }\n.link {\n  background: none; border: 0; padding: 6px 0; cursor: pointer;\n  color: var(--paper-dim); font-size: 0.92rem; text-decoration: underline; text-underline-offset: 3px;\n}\n.link:hover { color: var(--brass-hi); }\n:focus-visible { outline: 2px solid var(--brass-hi); outline-offset: 3px; }\n\n/* intro */\n.intro { align-items: flex-start; justify-content: center; }\n.sigil { width: 72px; height: 72px; color: var(--brass); }\n.intro .facts { display: flex; flex-wrap: wrap; gap: 8px 22px; color: var(--paper-dim); font-size: 0.92rem; }\n.intro .facts span::before { content: \"\u2726\"; color: var(--brass); margin-right: 8px; font-size: 0.75em; }\n\n/* question */\n.qhead { display: flex; flex-direction: column; gap: 10px; }\n.progress { display: flex; align-items: center; gap: 14px; }\n.dots { display: flex; gap: 6px; }\n.dots i { width: 22px; height: 3px; border-radius: 2px; background: rgba(247,245,242,.18); }\n.dots i.on { background: var(--brass); }\n.opts { display: grid; gap: 14px; }\n.opts.cards { grid-template-columns: repeat(4, minmax(0, 1fr)); }\n.opts.text { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n.opts.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }\n.opts.symbols { grid-template-columns: repeat(5, minmax(0, 1fr)); max-width: 640px; }\n.opt {\n  position: relative;\n  display: flex; flex-direction: column; gap: 6px;\n  text-align: left; cursor: pointer;\n  background: var(--night-2);\n  border: 1px solid rgba(176,141,87,.35);\n  border-radius: 4px;\n  padding: 18px 18px 16px;\n  transition: transform .18s ease, border-color .18s ease, background .18s ease;\n}\n.opt:hover { transform: translateY(-2px); border-color: var(--brass); background: var(--night-3); }\n.opt.picked { border-color: var(--brass-hi); background: var(--night-3); }\n.opt .label { font-family: var(--display); font-size: 1.2rem; line-height: 1.2; }\n.opt .note { color: var(--paper-dim); font-size: 0.9rem; }\n.opts.cards .opt {\n  aspect-ratio: 3 / 4.4; max-width: 100%;\n  align-items: center; justify-content: flex-end; text-align: center;\n  padding: 16px 12px 18px;\n}\n.opts.cards .opt::after {\n  content: \"\"; position: absolute; inset: 6px;\n  border: 1px solid rgba(176,141,87,.25); border-radius: 2px; pointer-events: none;\n}\n.opts.cards .opt svg { width: 56%; max-width: 92px; color: var(--brass); margin: auto 0 10px; }\n.opts.symbols .opt {\n  aspect-ratio: 1; align-items: center; justify-content: center; text-align: center;\n  border-radius: 50%; padding: 10px; gap: 2px;\n}\n.opts.symbols .opt svg { width: 52%; color: var(--brass); }\n.opts.symbols .opt .label { font-family: var(--smallcaps); font-size: 0.78rem; letter-spacing: .1em; color: var(--paper-dim); }\n.qfoot { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }\n\n/* choosing */\n.choosing { align-items: center; justify-content: center; text-align: center; }\n.cardback {\n  width: 132px; aspect-ratio: 2 / 3; border-radius: 6px;\n  background:\n    repeating-linear-gradient(45deg, rgba(176,141,87,.14) 0 1px, transparent 1px 9px),\n    repeating-linear-gradient(-45deg, rgba(176,141,87,.14) 0 1px, transparent 1px 9px),\n    var(--night-2);\n  border: 1px solid var(--brass);\n  display: grid; place-items: center; color: var(--brass-hi);\n  box-shadow: 0 18px 40px rgba(0,0,0,.35);\n  animation: turn 1.2s ease-in-out both;\n}\n.cardback svg { width: 54%; }\n@keyframes turn {\n  0% { transform: perspective(600px) rotateY(0deg) translateY(6px); }\n  60% { transform: perspective(600px) rotateY(160deg) translateY(-4px); }\n  100% { transform: perspective(600px) rotateY(180deg) translateY(0); }\n}\n\n/* result */\n.result { gap: 28px; }\n.pick { display: grid; grid-template-columns: minmax(0, 220px) minmax(0, 1fr); gap: clamp(20px, 4vw, 40px); align-items: start; }\n.cover {\n  width: 100%; max-width: 220px; aspect-ratio: 2 / 3;\n  border-radius: 3px; overflow: hidden;\n  box-shadow: 0 22px 44px rgba(0,0,0,.4), 0 0 0 1px rgba(176,141,87,.35);\n  background: var(--night-2);\n}\n.cover img { width: 100%; height: 100%; object-fit: cover; display: block; }\n.made {\n  width: 100%; height: 100%; padding: 16px 14px;\n  display: flex; flex-direction: column; justify-content: space-between; text-align: center;\n  color: var(--paper);\n  outline: 1px solid rgba(210,178,126,.55); outline-offset: -8px;\n  box-shadow: inset 0 0 0 11px rgba(0,0,0,.12);\n}\n.made .mt { font-family: var(--display); font-size: 1.15rem; line-height: 1.15; margin-top: 18px; overflow-wrap: anywhere; }\n.made .ma { font-family: var(--smallcaps); font-size: .74rem; letter-spacing: .1em; color: var(--brass-hi); margin-bottom: 12px; }\n.made .mo { color: var(--brass-hi); font-size: .8rem; }\n.details { display: flex; flex-direction: column; gap: 14px; min-width: 0; }\n.details h2 { font-size: clamp(1.7rem, 4vw, 2.4rem); }\n.byline { color: var(--paper-dim); font-size: 1rem; }\n.fortune {\n  font-family: var(--display); font-style: italic;\n  font-size: clamp(1.2rem, 2.6vw, 1.5rem); line-height: 1.35;\n  color: var(--paper);\n  border-left: 2px solid var(--brass); padding-left: 16px;\n  max-width: 30em;\n}\n.chips { display: flex; flex-wrap: wrap; gap: 8px; }\n.chip {\n  font-size: .8rem; padding: 3px 10px; border-radius: 999px;\n  border: 1px solid rgba(247,245,242,.25); color: var(--paper-dim);\n}\n.chip.sign { border-color: rgba(176,141,87,.6); color: var(--brass-hi); }\n.actions { display: flex; flex-wrap: wrap; gap: 10px 12px; align-items: center; margin-top: 4px; }\n.more { display: flex; flex-direction: column; gap: 12px; border-top: 1px solid rgba(176,141,87,.3); padding-top: 22px; }\n.more-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }\n.mini {\n  display: grid; grid-template-columns: 54px minmax(0, 1fr); gap: 14px; align-items: center;\n  text-decoration: none; color: inherit;\n  padding: 10px; border-radius: 4px; border: 1px solid transparent;\n  transition: border-color .15s ease, background .15s ease;\n}\n.mini:hover { border-color: rgba(176,141,87,.5); background: var(--night-2); }\n.mini .cover { max-width: 54px; box-shadow: 0 6px 14px rgba(0,0,0,.35), 0 0 0 1px rgba(176,141,87,.3); }\n.mini .made { padding: 4px; outline-offset: -3px; box-shadow: none; }\n.mini .made .mt { font-size: .5rem; margin-top: 4px; }\n.mini .made .ma, .mini .made .mo { display: none; }\n.mini .t { font-family: var(--display); font-size: 1.05rem; line-height: 1.2; }\n.mini .a { color: var(--paper-dim); font-size: .85rem; }\n.mini .o { color: var(--paper-dim); font-size: .85rem; font-style: italic; margin-top: 2px; }\n.msg { align-items: flex-start; justify-content: center; }\n.fade { animation: fade .35s ease both; }\n@keyframes fade { from { opacity: .001; transform: translateY(6px); } to { opacity: 1; transform: none; } }\n\n@media (max-width: 760px) {\n  .opts.cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n  .opts.cards .opt { aspect-ratio: 3 / 3.4; }\n}\n@media (max-width: 560px) {\n  .ibo { font-size: 16px; border-radius: 0; }\n  .opts.text, .opts.three { grid-template-columns: minmax(0, 1fr); }\n  .opts.symbols { gap: 8px; }\n  .opts.symbols .opt .label { font-size: .62rem; letter-spacing: .06em; }\n  .pick { grid-template-columns: minmax(0, 1fr); }\n  .pick .cover { max-width: 170px; }\n  .more-list { grid-template-columns: minmax(0, 1fr); }\n  .stage { min-height: 0; }\n}\n@media (prefers-reduced-motion: reduce) {\n  .cardback, .fade { animation: none; }\n  .opt { transition: none; }\n  .opt:hover { transform: none; }\n}\n";
  var CONFIG = Object.assign({
    sheetCsvUrl: '',                       // the "Publish to web" CSV link of the Books tab
    storeBase: 'https://www.interbooks.com.au',
    mount: '#ib-oracle'
  }, window.IB_ORACLE_CONFIG || {});

  var CATS = ['Occult & Esoteric', 'Spirituality & Mysticism', 'Religion & Traditions', 'Eastern Philosophy',
    'Psychology & Consciousness', 'Healing & Nature', 'Myth & Culture', 'Literature & Other', 'Conspiracy & Mystery'];
  var CAT_COLOURS = {
    'Occult & Esoteric': '#1D1B3A', 'Spirituality & Mysticism': '#4A3220', 'Religion & Traditions': '#22344A',
    'Eastern Philosophy': '#1E2B2D', 'Psychology & Consciousness': '#38213F', 'Healing & Nature': '#1F3A2C',
    'Myth & Culture': '#4A1F26', 'Literature & Other': '#2B2724', 'Conspiracy & Mystery': '#33302A'
  };
  var LEVELS = ['First steps', 'Some way down', 'Deep end'];
  var STYLES = ['Practice', 'Theory', 'Stories', 'Dip-in'];

  var ICONS = {
    sigil: '<circle cx="32" cy="32" r="27"/><circle cx="32" cy="32" r="21"/><path d="M32 7l5.5 19.5L57 32l-19.5 5.5L32 57l-5.5-19.5L7 32l19.5-5.5z"/><circle cx="32" cy="32" r="3"/>',
    door: '<path d="M17 57V27a15 15 0 0 1 30 0v30"/><path d="M21 57V28a11 11 0 0 1 22 0v29"/><path d="M11 57h42"/><circle cx="37" cy="40" r="2.2"/><path d="M37 42.2v4"/><circle cx="47.5" cy="11.5" r="3.5"/><path d="M45 14l-8 8M39.5 19.5l2 2M41.8 17.2l2 2"/>',
    temple: '<path d="M8 24L32 11l24 13"/><path d="M11 24h42M11 28h42"/><path d="M16 28v23M24 28v23M40 28v23M48 28v23"/><path d="M8 51h48M6 56h52"/><path d="M30 42h4v9h-4z"/><path d="M32 33.5c-2.2 2.4-2.2 5 0 6.5 2.2-1.5 2.2-4.1 0-6.5z"/>',
    forest: '<circle cx="32" cy="22" r="6"/><path d="M6 46h52"/><path d="M28 46l-7 12M36 46l7 12M30 52h4"/><path d="M8 44l7-20 7 20z"/><path d="M15 44v2"/><path d="M42 44l7-20 7 20z"/><path d="M49 44v2"/><path d="M19 44l4-11 4 11"/>',
    stair: '<path d="M32 6v52"/><path d="M32 54h16M32 48h13M32 42h9M21 36h11M17 30h15M21 24h11M32 18h9M32 12h13"/><path d="M48 54c4-2 4-8-3-6M21 36c-6 0-8-6-4-6M41 18c6 0 8-6 4-6"/><path d="M8 8v50M56 8v50"/><path d="M8 20h5M8 28h5M51 20h5M51 28h5M8 40h5M51 40h5"/>',
    moon: '<path d="M41 10a22 22 0 1 0 13 32 17 17 0 1 1-13-32z"/><circle cx="20" cy="18" r="1.2"/><circle cx="14" cy="30" r="1"/>',
    serpent: '<path d="M18 56c14 0 22-5 22-12s-18-8-18-17 9-14 20-14"/><path d="M42 13c3-1 6 0 7 2-1 2-4 3-7 2"/><circle cx="45" cy="14.5" r=".9"/><path d="M49 15l4 1"/>',
    eye: '<path d="M6 32c7-11 16-17 26-17s19 6 26 17c-7 11-16 17-26 17S13 43 6 32z"/><circle cx="32" cy="32" r="8"/><circle cx="32" cy="32" r="2.5"/>',
    lotus: '<path d="M32 16c7 8 7 19 0 28-7-9-7-20 0-28z"/><path d="M32 44c-9-1-18-8-20-19 9 0 16 7 20 19z"/><path d="M32 44c9-1 18-8 20-19-9 0-16 7-20 19z"/><path d="M32 44c-7 2-15 1-22-4M32 44c7 2 15 1 22-4"/><path d="M14 52h36"/>',
    tree: '<path d="M32 56V30"/><path d="M32 40l-9-7M32 35l8-7"/><path d="M32 30c-14 0-19-9-14-16 2-6 10-9 14-6 4-3 12 0 14 6 5 7 0 16-14 16z"/><path d="M32 56c-4 0-9 1-12 3M32 56c4 0 9 1 12 3M32 56v3"/>'
  };
  function svg(name) {
    return '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>';
  }

  var QUESTIONS = [
    { id: 'door', title: 'Choose a door', kind: 'cards', options: [
      { id: 'key', label: 'A locked door with an old key', icon: 'door', w: { 'Occult & Esoteric': 3, 'Conspiracy & Mystery': 1 } },
      { id: 'temple', label: 'A candlelit temple', icon: 'temple', w: { 'Religion & Traditions': 2, 'Spirituality & Mysticism': 2 } },
      { id: 'forest', label: 'A forest path at dusk', icon: 'forest', w: { 'Healing & Nature': 3, 'Spirituality & Mysticism': 1 } },
      { id: 'stair', label: 'A spiral library staircase', icon: 'stair', w: { 'Literature & Other': 2, 'Myth & Culture': 2, 'Psychology & Consciousness': 1 } }
    ] },
    { id: 'seek', title: 'What are you seeking?', kind: 'text', options: [
      { id: 'hidden', label: 'Hidden knowledge', note: 'What they never taught you', w: { 'Occult & Esoteric': 2, 'Conspiracy & Mystery': 2, 'Religion & Traditions': 1 } },
      { id: 'still', label: 'Stillness', note: 'A quieter mind', w: { 'Eastern Philosophy': 3, 'Spirituality & Mysticism': 2 } },
      { id: 'mind', label: 'To understand your own mind', note: 'Why you are the way you are', w: { 'Psychology & Consciousness': 3, 'Spirituality & Mysticism': 1 } },
      { id: 'stories', label: 'The old stories', note: 'Myths, legends and the people who told them', w: { 'Myth & Culture': 3, 'Literature & Other': 2, 'Religion & Traditions': 1 } }
    ] },
    { id: 'style', title: 'How do you like to learn?', kind: 'text', options: [
      { id: 'Practice', label: 'Hands-on practice', note: 'Exercises, methods, cards to draw' },
      { id: 'Theory', label: 'Deep theory', note: 'Ideas you can argue with' },
      { id: 'Stories', label: 'Through stories', note: 'Lives, journeys, first-hand accounts' },
      { id: 'Dip-in', label: 'Something to dip into', note: 'A page at a time, in any order' }
    ] },
    { id: 'level', title: 'How deep are you willing to go?', kind: 'three', options: [
      { id: 'First steps', label: 'First steps', note: 'No background needed' },
      { id: 'Some way down', label: 'Some way down the path', note: 'You have a few of these on the shelf already' },
      { id: 'Deep end', label: 'The deep end', note: 'Demanding, specialist, strange' }
    ] },
    { id: 'symbol', title: 'Pick a symbol', kind: 'symbols', options: [
      { id: 'Moon', label: 'Moon', icon: 'moon', w: { 'Occult & Esoteric': 1, 'Healing & Nature': 1 } },
      { id: 'Serpent', label: 'Serpent', icon: 'serpent', w: { 'Eastern Philosophy': 1, 'Occult & Esoteric': 0.5 } },
      { id: 'Eye', label: 'Eye', icon: 'eye', w: { 'Psychology & Consciousness': 1, 'Conspiracy & Mystery': 1 } },
      { id: 'Lotus', label: 'Lotus', icon: 'lotus', w: { 'Eastern Philosophy': 1, 'Spirituality & Mysticism': 1 } },
      { id: 'Tree', label: 'Tree', icon: 'tree', w: { 'Healing & Nature': 1, 'Myth & Culture': 1, 'Religion & Traditions': 0.5 } }
    ] }
  ];
  var SIGNS = {
    Moon: 'Under the Moon', Serpent: 'Under the Serpent', Eye: 'Under the Eye', Lotus: 'Under the Lotus', Tree: 'Under the Tree'
  };

  /* ---------- data ---------- */
  function parseCSV(text) {
    var rows = [], row = [], f = '', q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; }
        else f += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(f); f = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(f); rows.push(row); row = []; f = '';
      } else f += c;
    }
    if (f !== '' || row.length) { row.push(f); rows.push(row); }
    return rows;
  }
  var HEADERS = { sku: 'sku', title: 'title', author: 'author', category: 'cat', 'category 2': 'cat2', level: 'level',
    style: 'style', 'oracle line': 'oracle', status: 'status', 'product url': 'url', 'image url': 'img' };
  function rowsToBooks(rows) {
    var head = (rows.shift() || []).map(function (h) { return HEADERS[String(h).trim().toLowerCase()] || null; });
    return rows.map(function (r) {
      var b = {};
      head.forEach(function (k, i) { if (k) b[k] = String(r[i] == null ? '' : r[i]).trim(); });
      return b;
    });
  }
  function clean(list) {
    return list.filter(function (b) {
      return b && b.title && CATS.indexOf(b.cat) > -1 && String(b.status || '').toLowerCase() === 'available';
    }).map(function (b) {
      return {
        sku: b.sku || '', title: b.title, author: b.author || '', cat: b.cat,
        cat2: CATS.indexOf(b.cat2) > -1 ? b.cat2 : '',
        level: LEVELS.indexOf(b.level) > -1 ? b.level : 'Some way down',
        style: STYLES.indexOf(b.style) > -1 ? b.style : 'Theory',
        oracle: b.oracle || '', url: /^https?:\/\//.test(b.url || '') ? b.url : '',
        img: /^https?:\/\//.test(b.img || '') ? b.img : ''
      };
    });
  }
  function loadBooks() {
    var embedded = window.IB_ORACLE_BOOKS;
    var fallback = function () {
      if (embedded && embedded.length) return clean(embedded);
      throw new Error('no data');
    };
    if (!CONFIG.sheetCsvUrl) return Promise.resolve().then(fallback);
    var url = CONFIG.sheetCsvUrl + (CONFIG.sheetCsvUrl.indexOf('?') > -1 ? '&' : '?') + 't=' + Math.floor(Date.now() / 60000);
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    }).then(function (t) {
      var books = clean(rowsToBooks(parseCSV(t)));
      if (!books.length) throw new Error('empty');
      return books;
    }).catch(fallback);
  }

  /* ---------- matching ---------- */
  function norm(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
  function categoryScores(ans) {
    var cs = {};
    CATS.forEach(function (c) { cs[c] = 0; });
    [0, 1, 4].forEach(function (qi) {
      var opt = QUESTIONS[qi].options.filter(function (o) { return o.id === ans[qi]; })[0];
      if (opt) Object.keys(opt.w).forEach(function (k) { cs[k] += opt.w[k]; });
    });
    return cs;
  }
  function choose(books, ans, rng) {
    rng = rng || Math.random;
    if (!books.length) return null;
    var cs = categoryScores(ans), style = ans[2], li = LEVELS.indexOf(ans[3]);
    var scored = books.map(function (b) {
      var s = Math.max(cs[b.cat] || 0, b.cat2 ? cs[b.cat2] || 0 : 0);
      if (b.style === style) s += 3;
      var d = Math.abs(LEVELS.indexOf(b.level) - li);
      s += d === 0 ? 3 : d === 1 ? 1 : 0;
      return { b: b, s: s + rng() * 1.5 };
    }).sort(function (x, y) { return y.s - x.s; });
    var out = [], seen = {};
    for (var i = 0; i < scored.length && out.length < 3; i++) {
      var key = norm(scored[i].b.title);
      if (seen[key]) continue;
      seen[key] = 1; out.push(scored[i].b);
    }
    return { main: out[0], more: out.slice(1) };
  }

  /* ---------- rendering ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function bookUrl(b) { return b.url || (CONFIG.storeBase + '/search?q=' + encodeURIComponent(b.title)); }
  function cover(b) {
    // a drawn cover in the category colour; shown when there's no photo or the photo fails to load
    var made = '<div class="made"' + (b.img ? ' hidden' : '') + ' style="background:' + (CAT_COLOURS[b.cat] || '#2B2724') + '">' +
      '<div class="mt">' + esc(b.title.split(/[:(–]/)[0]) + '</div><div class="mo">✦</div><div class="ma">' + esc(b.author || 'Inter Books') + '</div></div>';
    var img = b.img ? '<img src="' + esc(b.img) + '" alt="Cover of ' + esc(b.title) + '">' : '';
    return '<div class="cover">' + img + made + '</div>';
  }

  function Oracle(host) {
    var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var books = null, ans = [], step = -1, last = null;
    root.innerHTML = '<style>' + CSS + '</style><div class="ibo" role="region" aria-label="Book oracle"><div class="stage" aria-live="polite"></div></div>';
    var stage = root.querySelector('.stage');

    function show(html, cls) {
      stage.className = 'stage fade ' + (cls || '');
      stage.innerHTML = html;
      Array.prototype.forEach.call(stage.querySelectorAll('.cover img'), function (img) {
        var swap = function () { var m = img.parentNode.querySelector('.made'); if (m) m.hidden = false; img.remove(); };
        if (img.complete && img.naturalWidth === 0) swap(); else img.addEventListener('error', swap);
      });
      var f = stage.querySelector('[data-focus]');
      if (f && step >= 0) f.focus({ preventScroll: true });
    }
    function intro() {
      step = -1; ans = [];
      show('<svg class="sigil" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true">' + ICONS.sigil + '</svg>' +
        '<p class="eyebrow">Inter Books</p><h2>Ask the oracle</h2>' +
        '<p class="lede">Five questions. One book from our shelves, chosen for you, with two more the oracle drew beside it.</p>' +
        '<div class="facts"><span>About a minute</span><span>Every book is in stock</span></div>' +
        '<button class="btn" data-act="start">Begin</button>', 'intro');
    }
    function question(i) {
      step = i;
      var q = QUESTIONS[i];
      var dots = QUESTIONS.map(function (_, k) { return '<i class="' + (k <= i ? 'on' : '') + '"></i>'; }).join('');
      var opts = q.options.map(function (o) {
        var inner = q.kind === 'cards' ? svg(o.icon) + '<span class="label">' + esc(o.label) + '</span>'
          : q.kind === 'symbols' ? svg(o.icon) + '<span class="label">' + esc(o.label) + '</span>'
          : '<span class="label">' + esc(o.label) + '</span><span class="note">' + esc(o.note) + '</span>';
        return '<button class="opt' + (ans[i] === o.id ? ' picked' : '') + '" data-opt="' + esc(o.id) + '" aria-label="' + esc(o.label) + '">' + inner + '</button>';
      }).join('');
      show('<div class="qhead"><div class="progress"><div class="dots" aria-hidden="true">' + dots + '</div>' +
        '<p class="eyebrow">Question ' + (i + 1) + ' of ' + QUESTIONS.length + '</p></div>' +
        '<h2 tabindex="-1" data-focus>' + esc(q.title) + '</h2></div>' +
        '<div class="opts ' + q.kind + '">' + opts + '</div>' +
        '<div class="qfoot"><button class="link" data-act="back">' + (i === 0 ? 'Start again' : 'Back') + '</button></div>', 'question');
    }
    function choosing() {
      step = 5;
      show('<div class="cardback">' + svg('sigil') + '</div><p class="eyebrow">The oracle is choosing</p>', 'choosing');
      var started = Date.now();
      (books ? Promise.resolve(books) : loadBooks().then(function (b) { books = b; return b; }))
        .then(function (b) {
          last = choose(b, ans);
          setTimeout(result, Math.max(0, (reduce ? 250 : 1250) - (Date.now() - started)));
        })
        .catch(function () {
          show('<p class="eyebrow">The oracle is resting</p><h2>We couldn’t reach the shelves just now</h2>' +
            '<p class="lede">Try again in a moment, or browse the whole shop.</p>' +
            '<div class="actions"><button class="btn" data-act="retry">Try again</button><a class="btn ghost" href="' + esc(CONFIG.storeBase + '/store') + '">Browse the shop</a></div>', 'msg');
        });
    }
    function result() {
      step = 6;
      var b = last.main, sign = ans[4];
      var pin = b.img ? '<a class="btn ghost" target="_blank" rel="noopener" href="https://www.pinterest.com/pin/create/button/?url=' +
        encodeURIComponent(bookUrl(b)) + '&media=' + encodeURIComponent(b.img) + '&description=' +
        encodeURIComponent('The Inter Books oracle chose this for me: ' + b.title + (b.author ? ' by ' + b.author : '')) + '">Pin it</a>' : '';
      var more = last.more.map(function (m) {
        return '<a class="mini" href="' + esc(bookUrl(m)) + '">' + cover(m) + '<div><div class="t">' + esc(m.title) + '</div>' +
          (m.author ? '<div class="a">' + esc(m.author) + '</div>' : '') + '<div class="o">' + esc(m.oracle) + '</div></div></a>';
      }).join('');
      show('<p class="eyebrow">The oracle has chosen</p>' +
        '<div class="pick" data-sku="' + esc(b.sku) + '">' + cover(b) +
        '<div class="details"><div class="chips"><span class="chip sign">' + esc(SIGNS[sign] || '') + '</span><span class="chip">' + esc(b.cat) + '</span><span class="chip">' + esc(b.level) + '</span></div>' +
        '<h2 tabindex="-1" data-focus>' + esc(b.title) + '</h2>' + (b.author ? '<p class="byline">' + esc(b.author) + '</p>' : '') +
        (b.oracle ? '<p class="fortune">' + esc(b.oracle) + '</p>' : '') +
        '<div class="actions"><a class="btn" href="' + esc(bookUrl(b)) + '">See this book</a>' + pin +
        '<button class="link" data-act="again">Ask again</button></div></div></div>' +
        (more ? '<div class="more"><p class="eyebrow">Also drawn for you</p><div class="more-list">' + more + '</div></div>' : ''), 'result');
    }

    stage.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-opt],[data-act]') : null;
      if (!t) return;
      var act = t.getAttribute('data-act');
      if (act === 'start') return question(0);
      if (act === 'again') return intro();
      if (act === 'retry') return choosing();
      if (act === 'back') return step <= 0 ? intro() : question(step - 1);
      var id = t.getAttribute('data-opt');
      if (id != null && step >= 0 && step < 5) {
        ans[step] = id;
        t.classList.add('picked');
        var next = step + 1;
        setTimeout(function () { next < QUESTIONS.length ? question(next) : choosing(); }, reduce ? 0 : 180);
      }
    });

    loadBooks().then(function (b) { books = b; }).catch(function () {});
    intro();
  }

  function fonts() {
    if (document.querySelector('link[data-ib-oracle-fonts]')) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet'; l.setAttribute('data-ib-oracle-fonts', '');
    l.href = 'https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@400;500;700&family=IM+Fell+English:ital@0;1&family=IM+Fell+English+SC&display=swap';
    document.head.appendChild(l);
  }
  function boot() {
    var host = document.querySelector(CONFIG.mount);
    if (!host || host.__ibOracle) return;
    host.__ibOracle = true;
    fonts();
    Oracle(host);
  }
  // exposed for testing and for checking the book list from the browser console
  window.IBOracle = { choose: choose, loadBooks: loadBooks, parseCSV: parseCSV, rowsToBooks: rowsToBooks, clean: clean, QUESTIONS: QUESTIONS };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
