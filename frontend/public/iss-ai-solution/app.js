/* ════════════════════════════════════════
   ISS AI Integration — Template & Runtime
   ════════════════════════════════════════ */

var LANG = 'zh';
var DATA = {};
var currentLayer = 1;

// ── Language ────────────────────────────
function getLang() { return location.hash === '#en' ? 'en' : 'zh'; }

function setLang(lang) {
  LANG = lang;
  DATA = lang === 'en' ? DATA_EN : DATA_ZH;
  location.hash = lang;
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = DATA.meta.title;
  render();
}

function updateToggle() {
  document.getElementById('btn-zh').classList.toggle('active', LANG === 'zh');
  document.getElementById('btn-en').classList.toggle('active', LANG === 'en');
}

// ── Helpers ─────────────────────────────
function renderTags(tags) {
  if (!tags || !tags.length) return '';
  return tags.map(function(t) {
    return '<span class="tag ' + t.cls + '">' + t.text + '</span> ';
  }).join('');
}

function renderCard(c) {
  var style = c.style || '';
  var extra = c.extraStyle ? ' style="' + c.extraStyle + '"' : '';
  return '<div class="card ' + style + '"' + extra + '>' +
    '<div class="ct">' + renderTags(c.tags) + c.title + '</div>' +
    '<div class="cb">' + c.body + '</div></div>';
}

function renderXcard(c, dotCls) {
  return '<div class="xcard" onclick="xToggle(this)">' +
    '<div class="xcard-head"><div class="xdot ' + dotCls + '"></div>' +
    '<div class="xname">' + c.name + '</div></div>' +
    '<div class="xone">' + c.one + '</div>' +
    '<div class="xdetail">' + c.detail + '</div></div>';
}

function renderPanel(panel, idx) {
  var dot = 'd' + idx;
  var vis = idx === 1 ? ' visible' : '';
  var html = '<div class="layer-panel' + vis + '" id="panel-' + idx + '">';
  html += '<div class="panel-label">' + panel.label + '</div>';
  panel.cards.forEach(function(c) { html += renderXcard(c, dot); });
  html += '</div>';
  return html;
}

// ── SVG ─────────────────────────────────
function renderSvgTexts() {
  var ff = LANG === 'zh'
    ? 'PingFang SC,Microsoft YaHei,sans-serif'
    : 'Arial,sans-serif';
  return DATA.svgTexts.map(function(p) {
    var a = p.anchor ? ' text-anchor="' + p.anchor + '"' : '';
    var w = p.weight ? ' font-weight="' + p.weight + '"' : '';
    return '<text x="' + p.x + '" y="' + p.y + '"' + a +
      ' font-size="' + p.size + '"' + w +
      ' fill="' + p.fill + '" font-family="' + ff + '">' + p.text + '</text>';
  }).join('\n  ');
}

function renderSvg() {
  return '<svg id="arch-svg" width="100%" viewBox="0 0 680 618" xmlns="http://www.w3.org/2000/svg" style="display:block">' +
  '<defs>' +
    '<marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">' +
      '<path d="M2 1L8 5L2 9" fill="none" stroke="#999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</marker>' +
  '</defs>' +

  // Layer 0: red
  '<rect x="28" y="8" width="644" height="84" rx="9" fill="#FCEBEB" stroke="#E24B4A" stroke-width="0.75"/>' +
  '<rect x="36" y="30" width="148" height="54" rx="6" fill="#F7C1C1" stroke="#E24B4A" stroke-width="0.5"/>' +
  '<rect x="192" y="30" width="148" height="54" rx="6" fill="#F7C1C1" stroke="#E24B4A" stroke-width="0.5"/>' +
  '<rect x="348" y="30" width="148" height="54" rx="6" fill="#F7C1C1" stroke="#E24B4A" stroke-width="0.5"/>' +
  '<rect x="504" y="30" width="160" height="54" rx="6" fill="#F7C1C1" stroke="#E24B4A" stroke-width="0.5"/>' +
  '<rect class="layer-hit" id="hit-0" x="28" y="8" width="644" height="84" rx="9" onclick="showLayer(0)"/>' +

  '<line x1="350" y1="92" x2="350" y2="108" stroke="#999" stroke-width="1" marker-end="url(#ar)"/>' +

  // Layer 1: purple
  '<rect x="28" y="110" width="644" height="130" rx="9" fill="#EEEDFE" stroke="#7F77DD" stroke-width="0.75"/>' +
  '<rect x="36" y="132" width="308" height="100" rx="7" fill="#CECBF6" stroke="#534AB7" stroke-width="0.5"/>' +
  '<rect x="44" y="152" width="140" height="30" rx="5" fill="#EEEDFE" stroke="#7F77DD" stroke-width="0.5"/>' +
  '<rect x="192" y="152" width="144" height="30" rx="5" fill="#EEEDFE" stroke="#7F77DD" stroke-width="0.5"/>' +
  '<rect x="44" y="188" width="140" height="30" rx="5" fill="#EEEDFE" stroke="#7F77DD" stroke-width="0.5"/>' +
  '<rect x="192" y="188" width="144" height="30" rx="5" fill="#EEEDFE" stroke="#7F77DD" stroke-width="0.5"/>' +
  '<rect x="352" y="132" width="312" height="100" rx="7" fill="#CECBF6" stroke="#534AB7" stroke-width="0.5"/>' +
  '<rect x="360" y="152" width="144" height="30" rx="5" fill="#EEEDFE" stroke="#7F77DD" stroke-width="0.5"/>' +
  '<rect x="512" y="152" width="144" height="30" rx="5" fill="#EEEDFE" stroke="#7F77DD" stroke-width="0.5"/>' +
  '<rect x="360" y="188" width="144" height="30" rx="5" fill="#EEEDFE" stroke="#7F77DD" stroke-width="0.5"/>' +
  '<rect x="512" y="188" width="144" height="30" rx="5" fill="#EEEDFE" stroke="#7F77DD" stroke-width="0.5"/>' +
  '<rect class="layer-hit" id="hit-1" x="28" y="110" width="644" height="130" rx="9" onclick="showLayer(1)"/>' +

  '<line x1="350" y1="240" x2="350" y2="256" stroke="#999" stroke-width="1" marker-end="url(#ar)"/>' +

  // Layer 2: blue
  '<rect x="28" y="258" width="644" height="130" rx="9" fill="#E6F1FB" stroke="#378ADD" stroke-width="0.75"/>' +
  '<rect x="36" y="280" width="116" height="52" rx="6" fill="#B5D4F4" stroke="#185FA5" stroke-width="0.5"/>' +
  '<rect x="160" y="280" width="116" height="52" rx="6" fill="#B5D4F4" stroke="#185FA5" stroke-width="0.5"/>' +
  '<rect x="284" y="280" width="116" height="52" rx="6" fill="#B5D4F4" stroke="#185FA5" stroke-width="0.5"/>' +
  '<rect x="408" y="280" width="116" height="52" rx="6" fill="#B5D4F4" stroke="#185FA5" stroke-width="0.5"/>' +
  '<rect x="532" y="280" width="132" height="52" rx="6" fill="#B5D4F4" stroke="#185FA5" stroke-width="0.5"/>' +
  '<rect x="36" y="340" width="628" height="38" rx="6" fill="#B5D4F4" stroke="#185FA5" stroke-width="0.5"/>' +
  '<rect class="layer-hit" id="hit-2" x="28" y="258" width="644" height="130" rx="9" onclick="showLayer(2)"/>' +

  '<line x1="350" y1="388" x2="350" y2="404" stroke="#999" stroke-width="1" marker-end="url(#ar)"/>' +

  // Layer 3: teal
  '<rect x="28" y="406" width="644" height="90" rx="9" fill="#E1F5EE" stroke="#1D9E75" stroke-width="0.75"/>' +
  '<rect x="36" y="428" width="150" height="60" rx="6" fill="#9FE1CB" stroke="#0F6E56" stroke-width="0.5"/>' +
  '<rect x="194" y="428" width="150" height="60" rx="6" fill="#9FE1CB" stroke="#0F6E56" stroke-width="0.5"/>' +
  '<rect x="352" y="428" width="150" height="60" rx="6" fill="#9FE1CB" stroke="#0F6E56" stroke-width="0.5"/>' +
  '<rect x="510" y="428" width="154" height="60" rx="6" fill="#9FE1CB" stroke="#0F6E56" stroke-width="0.5"/>' +
  '<rect class="layer-hit" id="hit-3" x="28" y="406" width="644" height="90" rx="9" onclick="showLayer(3)"/>' +

  '<line x1="350" y1="496" x2="350" y2="512" stroke="#999" stroke-width="1" marker-end="url(#ar)"/>' +

  // Layer 4: green
  '<rect x="28" y="514" width="644" height="84" rx="9" fill="#EAF3DE" stroke="#639922" stroke-width="0.75"/>' +
  '<rect x="36" y="536" width="150" height="54" rx="6" fill="#C0DD97" stroke="#3B6D11" stroke-width="0.5"/>' +
  '<rect x="194" y="536" width="150" height="54" rx="6" fill="#C0DD97" stroke="#3B6D11" stroke-width="0.5"/>' +
  '<rect x="352" y="536" width="150" height="54" rx="6" fill="#C0DD97" stroke="#3B6D11" stroke-width="0.5"/>' +
  '<rect x="510" y="536" width="154" height="54" rx="6" fill="#C0DD97" stroke="#3B6D11" stroke-width="0.5"/>' +
  '<path d="M28 563 L13 563 L13 184 L28 184" fill="none" stroke="#639922" stroke-width="1" stroke-dasharray="4 3" marker-end="url(#ar)"/>' +
  '<rect class="layer-hit" id="hit-4" x="28" y="514" width="644" height="84" rx="9" onclick="showLayer(4)"/>' +

  // All text from data
  renderSvgTexts() +

  '</svg>';
}

// ── Page Renderers ──────────────────────
function renderPageHeader(h) {
  return '<div class="ph"><div>' +
    '<div class="pt">' + h.title + '</div>' +
    '<div class="ps">' + h.subtitle + '</div>' +
    '</div><div class="pm">' + DATA.meta.date +
    '<br><span class="pb">' + h.page + '</span></div></div>';
}

function renderPage1() {
  var d = DATA.p1;
  var html = '<div class="page">';
  html += renderPageHeader(d.header);

  // Current State
  html += '<div class="sec"><div class="sl">' + d.currentState.label + '</div>';
  html += '<div class="st">' + d.currentState.title + '</div>';
  html += '<p class="bt">' + d.currentState.body + '</p>';
  html += '<div class="g2" style="margin-top:8px">';
  d.currentState.cards.forEach(function(c) { html += renderCard(c); });
  html += '</div></div>';

  html += '<hr>';

  // Vision
  html += '<div class="sec"><div class="sl">' + d.vision.label + '</div>';
  html += '<div class="st">' + d.vision.title + '</div>';
  html += '<p class="bt">' + d.vision.body + '</p>';
  html += '<div class="g2" style="margin-top:8px">';
  d.vision.scenes.forEach(function(s) {
    html += '<div class="scene"><div class="sq">' + s.title + '</div>';
    html += '<div class="si">' + s.query + '</div>';
    html += '<div class="sa">' + s.answer + '</div></div>';
  });
  html += '</div></div>';

  html += '<hr>';

  // Why Now
  html += '<div class="sec"><div class="sl">' + d.whyNow.label + '</div>';
  html += '<div class="g2">';
  d.whyNow.cards.forEach(function(c) { html += renderCard(c); });
  html += '</div></div>';

  html += '<div class="pf"><span>' + DATA.meta.footer + '</span><span>' + DATA.meta.date + '</span></div>';
  html += '</div>';
  return html;
}

function renderPage2() {
  var html = '<div class="page">';
  html += renderPageHeader({
    title: DATA.p1.header.title.replace(/AI.*$/, 'AI').length > 0
      ? (LANG === 'zh' ? '技术架构' : 'Technical Architecture')
      : '',
    subtitle: LANG === 'zh'
      ? '点击任意层查看该层组件的详细说明'
      : 'Click any layer to view detailed component descriptions',
    page: LANG === 'zh' ? '第 2 页 / 共 3 页' : 'Page 2 of 3',
  });

  html += '<div class="sec">';
  html += '<div class="sl">' + (LANG === 'zh'
    ? '系统五层架构 — 点击层查看组件说明'
    : '5-LAYER ARCHITECTURE — CLICK A LAYER TO SEE COMPONENT DETAILS') + '</div>';

  html += '<div class="arch-wrap">';
  html += renderSvg();

  html += '<div class="hint-click">' + DATA.hint + '</div>';
  html += '<div class="print-note">' + DATA.printNote + '</div>';

  // Tabs
  html += '<div class="layer-tabs" id="layer-tabs">';
  DATA.tabs.forEach(function(t, i) {
    var active = i === 1 ? ' active' : '';
    html += '<div class="ltab ltab-' + i + active + '" id="tab-' + i + '" onclick="showLayer(' + i + ')">' + t + '</div>';
  });
  html += '</div>';

  // Panels
  DATA.panels.forEach(function(p, i) { html += renderPanel(p, i); });

  html += '</div></div>';

  html += '<div class="pf"><span>' + DATA.meta.footer + '</span><span>' + DATA.meta.date + '</span></div>';
  html += '</div>';
  return html;
}

function renderPage3() {
  var d = DATA.p3;
  var html = '<div class="page">';
  html += renderPageHeader(d.header);

  // Roadmap
  html += '<div class="sec"><div class="sl">' + d.roadmap.label + '</div>';
  html += '<div class="g4">';
  d.roadmap.phases.forEach(function(p) {
    html += '<div class="ph-box ' + p.cls + '">';
    html += '<div class="pn">' + p.num + '</div>';
    html += '<div class="pname">' + p.name + '</div>';
    html += '<div class="ptime">' + p.time + '</div>';
    html += '<div class="pitems">' + p.items + '</div>';
    html += '<div class="pout">' + p.out + '</div></div>';
  });
  html += '</div></div>';

  html += '<hr>';

  // Metrics
  html += '<div class="sec"><div class="sl">' + d.metrics.label + '</div>';
  html += '<div class="mets">';
  d.metrics.items.forEach(function(m) {
    html += '<div class="met"><div class="mn">' + m.val + '</div>';
    html += '<div class="ml">' + m.label;
    if (m.note) html += '<br><span style="font-size:6.5pt;color:#bbb">' + m.note + '</span>';
    html += '</div></div>';
  });
  html += '</div>';
  html += '<p class="bt" style="margin-top:8px;font-size:8pt;color:#999">' + d.metrics.note + '</p>';
  html += '</div>';

  html += '<hr>';

  // Team
  html += '<div class="sec"><div class="sl">' + d.team.label + '</div>';
  html += '<table class="rt"><tr>';
  html += '<th style="width:115px">' + d.team.headers[0] + '</th>';
  html += '<th>' + d.team.headers[1] + '</th>';
  html += '<th style="width:110px">' + d.team.headers[2] + '</th></tr>';
  d.team.rows.forEach(function(r) {
    html += '<tr><td class="rw"><span class="tag ' + r.tag.cls + '">' + r.tag.text + '</span>';
    if (r.role) html += '<br>' + r.role;
    html += '</td><td>' + r.resp + '</td>';
    html += '<td class="rtime">' + r.commit + '</td></tr>';
  });
  html += '</table></div>';

  html += '<hr>';

  // Risks
  html += '<div class="sec"><div class="sl">' + d.risks.label + '</div>';
  html += '<table class="rt"><tr>';
  html += '<th style="width:145px">' + d.risks.headers[0] + '</th>';
  html += '<th>' + d.risks.headers[1] + '</th>';
  html += '<th style="width:90px">' + d.risks.headers[2] + '</th></tr>';
  d.risks.rows.forEach(function(r) {
    html += '<tr><td class="rw">' + r.risk + '</td>';
    html += '<td>' + r.mitig + '</td>';
    html += '<td class="rtime">' + r.phase + '</td></tr>';
  });
  html += '</table></div>';

  html += '<hr>';

  // Bets
  html += '<div class="sec"><div class="sl">' + d.bets.label + '</div>';
  d.bets.items.forEach(function(b, i) {
    html += '<div class="bet"><div class="bn">' + (i + 1) + '</div><div>';
    html += '<div class="btt">' + b.title + '</div>';
    html += '<div class="bbd">' + b.body + '</div>';
    html += '</div></div>';
  });
  html += '</div>';

  html += '<div class="pf"><span>' + DATA.meta.footer + '</span><span>' + DATA.meta.date + '</span></div>';
  html += '</div>';
  return html;
}

// ── Main Render ─────────────────────────
function render() {
  document.getElementById('root').innerHTML =
    renderPage1() + renderPage2() + renderPage3();
  updateToggle();
  // Restore layer state
  showLayer(currentLayer);
}

// ── Interactive ─────────────────────────
function showLayer(n) {
  for (var i = 0; i < 5; i++) {
    var p = document.getElementById('panel-' + i);
    var t = document.getElementById('tab-' + i);
    var h = document.getElementById('hit-' + i);
    if (p) p.classList.remove('visible');
    if (t) t.classList.remove('active');
    if (h) h.classList.remove('active');
  }
  var panel = document.getElementById('panel-' + n);
  var tab = document.getElementById('tab-' + n);
  var hit = document.getElementById('hit-' + n);
  if (panel) panel.classList.add('visible');
  if (tab) tab.classList.add('active');
  if (hit) hit.classList.add('active');
  currentLayer = n;
  if (panel) {
    setTimeout(function() {
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }
}

function xToggle(card) {
  var d = card.querySelector('.xdetail');
  d.classList.toggle('open');
}

// ── Init ────────────────────────────────
window.addEventListener('hashchange', function() {
  LANG = getLang();
  DATA = LANG === 'en' ? DATA_EN : DATA_ZH;
  render();
});

document.addEventListener('DOMContentLoaded', function() {
  LANG = getLang();
  DATA = LANG === 'en' ? DATA_EN : DATA_ZH;
  document.documentElement.lang = LANG === 'zh' ? 'zh-CN' : 'en';
  document.title = DATA.meta.title;
  render();
});
