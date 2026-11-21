// Leonida Night Ledger v7 — the Roadmap, Missables and Sources & Save views.
// Rendered from the same data files as the guide, so every number matches the audit strip.
// v7: the Missables view is a standalone chapter-window grid (watched trophies as rows,
// Ch1-Ch5/Post as columns, open windows marked, the closing cell of each window LAST in red)
// with the story-gates list underneath; the disputes register gains an "Our call" column.
'use strict';
function vEsc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function vCites(arr) { return ' <span class="cite">[' + (arr || []).map(n => { const s = META.sources.find(x => x.n === n); return 'S' + n + ' ' + (s ? s.name.split(' — ')[0] : ''); }).join('; ') + ']</span>'; }
function bars(counts) {
  const max = Math.max.apply(null, Object.values(counts).concat([1]));
  return Object.keys(counts).map(k => '<p style="margin:4px 0">' + vEsc(k) + ': <b>' + counts[k] + '</b></p><div class="bar"><div style="width:' + (counts[k] / max * 100) + '%"></div></div>').join('');
}
// Chapter windows for the grid, derived from the missable boxes, the timeline and the
// watch list in meta.json: each row lists, per chapter, whether the window is open,
// and the last chapter in which a closing window can still be caught (marked LAST).
const CHAPS = ['Ch1', 'Ch2', 'Ch3', 'Ch4', 'Ch5', 'Post'];
const MISSROWS = [
  { name: 'Positive Mental Attitude — balcony meditation', cells: ['LAST', 'open', 'open', 'open', 'open', 'open'], note: 'The Chapter 1 balcony spot closes at the end of Chapter 1; the other meditation spots stay open.' },
  { name: 'Positive Mental Attitude — remaining meditations', cells: ['open', 'open', 'open', 'open', 'open', 'LAST'], note: 'All 18 spots are needed for the trophy; finish the set before the run ends.' },
  { name: 'Kenton\u2019s questline (This Was No Boat Accident)', cells: ['open', 'open', 'open', 'open', 'open', 'open'], note: 'Pauses after Chapter 1 and returns in Chapters 2-3 — a pause, not a lock.' },
  { name: 'Stranger chains (Strangers & Freaks)', cells: ['shut', 'open', 'open', 'open', 'open', 'open'], note: 'Unlock from Chapter 2; one secondary report claims story windows, the fuller guide says all return post-story.' },
  { name: 'Timed hourglass side missions', cells: ['LAST', 'LAST', 'LAST', 'LAST', 'LAST', 'shut'], note: 'Each one expires shortly after it appears in its own chapter; no trophy needs them.' },
  { name: 'House magazines and Shirley\u2019s errands (Chapter 1)', cells: ['LAST', 'shut', 'shut', 'shut', 'shut', 'shut'], note: 'Chapter 1 house content closes with the chapter; collect it before moving on.' },
  { name: 'Duo-play partner trophies (Hot Together and friends)', cells: ['shut', 'open', 'open', 'open', 'open', 'open'], note: 'Duo play opens at Coffee Break in Chapter 2 and never closes again.' },
  { name: 'Everything else — free-roam trophies', cells: ['open', 'open', 'open', 'open', 'open', 'open'], note: 'Free roam continues after the final mission; nothing else closes in normal play.' }
];
window.renderViews = function () {
  // Roadmap — six stages, headline claims each cited.
  let h = '<div class="card"><h2>Roadmap to the platinum — six stages</h2>';
  h += '<h3>Headline claims, each cited</h3><table><tr><th>Claim</th><th>Value</th><th>Sources</th></tr>';
  for (const c of META.roadmapClaims) h += '<tr><td>' + vEsc(c.claim) + (c.note ? '<br><i>' + vEsc(c.note) + '</i>' : '') + '</td><td><b>' + vEsc(c.value) + '</b></td><td>' + vCites(c.c) + (c.cAlt ? ' dissent' + vCites(c.cAlt) : '') + '</td></tr>';
  h += '</table>';
  for (const s of META.stages) h += '<div class="box"><h3>' + vEsc(s.name) + ' — ' + vEsc(s.hours) + '</h3><p>' + vEsc(s.text) + vCites(s.c) + '</p></div>';
  h += '<h3>Missable watch rail</h3><ul>' + META.watchList.map(w => '<li><b>' + vEsc(w.name) + '</b> — ' + vEsc(w.why) + vCites(w.c) + '</li>').join('') + '</ul></div>';
  document.getElementById('view-roadmap').innerHTML = h;

  // Missables — standalone chapter-window grid plus story gates in chapter order.
  let m = '<div class="card"><h2>Missables — chapter-window grid</h2>';
  m += '<p>One trophy is <b>possibly missable</b>: <b>Positive Mental Attitude</b> — its Chapter 1 balcony meditation may close at the end of Chapter 1' + vCites([1, 13]) + '. Everything else stays open in post-story free roam' + vCites([1, 3]) + '. Read the grid by row: <b>open</b> means the window is open in that chapter, <b>LAST</b> (red) is the last chapter to catch a closing window, and a dash means the window has not opened or has closed.</p>';
  m += '<table class="mgrid"><tr><th>Watched trophy / window</th>' + CHAPS.map(c => '<th>' + c + '</th>').join('') + '<th>Note</th></tr>';
  for (const r of MISSROWS) m += '<tr><td class="rn">' + vEsc(r.name) + '</td>' + r.cells.map(c => c === 'LAST' ? '<td class="lastcell">LAST</td>' : c === 'open' ? '<td class="open">open</td>' : '<td class="shut">—</td>').join('') + '<td style="text-align:left">' + vEsc(r.note) + '</td></tr>';
  m += '</table>';
  m += '<h3>Story gates in chapter order</h3><table><tr><th>Window</th><th>What closes / opens</th><th>Locks at</th><th>Sources</th></tr>';
  for (const r of META.timeline) m += '<tr><td>' + vEsc(r.window) + '</td><td>' + vEsc(r.closes) + '</td><td>' + vEsc(r.locksAt) + '</td><td>' + vCites(r.c) + '</td></tr>';
  m += '</table><h3>Watch list</h3><ul>' + META.watchList.map(w => '<li><b>' + vEsc(w.name) + '</b> — ' + vEsc(w.why) + vCites(w.c) + '</li>').join('') + '</ul></div>';
  document.getElementById('view-missables').innerHTML = m;

  // Sources & Save — registry, disagreements register with an Our call column, progress bars.
  const byGrade = {}, byKind = {};
  for (const t of TROPHIES) if (state.earned[t.name]) { byGrade[t.grade] = (byGrade[t.grade] || 0) + 1; byKind[t.kind] = (byKind[t.kind] || 0) + 1; }
  let s = '<div class="card"><h2>Sources &amp; Save</h2>';
  s += '<h3>Saved state</h3><p>Stored in this browser under localStorage key <b>leonida-night-ledger-v7</b>: earned flags, YOUR COUNT counters and the spoiler-shield setting. Export file: <b>leonida-night-ledger-save.json</b>.' + (state.lastImport ? ' Last import: <b>' + vEsc(state.lastImport) + '</b>.' : ' No import yet this ledger.') + ' Spoiler shield is ' + (state.spoiler ? '<b>ON</b>' : '<b>OFF</b>') + '.</p>';
  s += '<pre>' + vEsc(JSON.stringify(state, null, 2)).slice(0, 900) + '</pre>';
  s += '<h3>Earned by grade</h3>' + bars(byGrade) + '<h3>Earned by kind</h3>' + bars(byKind);
  s += '<h3>Source registry — ' + META.sources.length + ' sources read ' + vEsc(META.readDate) + '</h3><p>Provenance, as printed on every view: pages = distinct URLs in this registry; possibly missable = trophies flagged missable in the data; at risk = entries on the missable watch list; unconfirmed = trophies at guide confidence C.</p><table><tr><th>#</th><th>Source</th><th>Scope</th><th>Independence</th><th>Used for</th></tr>';
  for (const src of META.sources) s += '<tr><td>S' + src.n + '</td><td>' + vEsc(src.name) + '<br><span class="cite">' + vEsc(src.url) + '</span></td><td>' + vEsc(src.scope) + '</td><td>' + vEsc(src.independence) + '</td><td>' + vEsc(src.usedFor) + '</td></tr>';
  s += '</table><h3>Disagreements register — ' + DISPUTES.length + ' disputes shown both ways</h3>';
  s += '<table><tr><th>Trophy — topic</th><th>Version A</th><th>Version B</th><th>Our call</th></tr>';
  for (const d of DISPUTES) s += '<tr><td><b>' + vEsc(d.trophy) + '</b> — ' + vEsc(d.topic) + '</td><td>' + vEsc(d.a) + vCites(d.aSrc) + '</td><td>' + vEsc(d.b) + vCites(d.bSrc) + '</td><td class="callcol"><b>' + vEsc(d.call) + '</b></td></tr>';
  s += '</table></div>';
  document.getElementById('view-sources').innerHTML = s;
};
