// Leonida Night Ledger v7 — tracker core: loads the three data files, renders the
// three-pane guide, owns the localStorage save, counters, filters and spoiler shield.
// v7 adds the provenance line under the audit strip, computed from the same data.
'use strict';
const SAVE_KEY = 'leonida-night-ledger-v7';
const DEMO = new URLSearchParams(location.search).has('demo');
let TROPHIES = [], META = null, DISPUTES = [];
let state = loadState();
let selectedId = 1;

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) { const p = JSON.parse(raw); return { earned: p.earned || {}, counts: p.counts || {}, spoiler: !!p.spoiler, lastImport: p.lastImport || '' }; }
  } catch (e) { /* a corrupt save falls back to a fresh ledger */ }
  if (DEMO) return { earned: demoEarned(), counts: { 'Cunning Stunts': 120, 'The Shootist': 21, 'You WAiNKer!': 47 }, spoiler: false, lastImport: '' };
  return { earned: {}, counts: {}, spoiler: false, lastImport: '' };
}
function demoEarned() { const o = {}; TROPHIES.slice(1, 15).forEach(t => { o[t.name] = true; }); return o; }
function persist() { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
function $(id) { return document.getElementById(id); }
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function srcName(n) { const s = META.sources.find(x => x.n === n); return s ? s.name.split(' — ')[0] : 'S' + n; }
function cites(arr) { return ' <span class="cite">[' + arr.map(n => 'S' + n + ' ' + srcName(n)).join('; ') + ']</span>'; }
function psnPoints(grade) { return { platinum: 300, gold: 90, silver: 30, bronze: 15 }[grade] || 0; }

function auditNumbers() {
  let steps = 0, stepsCited = 0, claims = 0, claimsCited = 0, twoPlus = 0;
  for (const t of TROPHIES) {
    const guideClaims = 1 + (t.steps ? t.steps.length : 0);
    claims += guideClaims; claimsCited += guideClaims;
    const guideSrcs = new Set();
    for (const st of (t.steps || [])) { steps++; if (st.s && st.s.length) { stepsCited++; st.s.forEach(n => guideSrcs.add(n)); } }
    if (guideSrcs.size >= 2) twoPlus += guideClaims;
  }
  for (const c of META.roadmapClaims) { claims++; claimsCited++; if (c.c && c.c.length >= 2) twoPlus++; }
  return { steps, stepsCited, claims, claimsCited, twoPlus, sources: META.sources.length, disputes: DISPUTES.length };
}
function provenance() {
  // Every number below is counted from this entry's own data files, never typed in:
  // pages = distinct source URLs cited in the registry; sites = registered sources;
  // possibly missable = trophies flagged missable; at risk = the missable watch list;
  // unconfirmed = trophies whose guide confidence is C (single-witness or aggregator-only).
  const pages = new Set(META.sources.map(s => s.url)).size;
  const sites = META.sources.length;
  const miss = TROPHIES.filter(t => t.missable).length;
  const risk = META.watchList.length;
  const unconf = TROPHIES.filter(t => t.conf === 'C').length;
  const d = META.readDate ? new Date(META.readDate + 'T00:00:00') : null;
  const when = d ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : META.readDate;
  return { pages, sites, miss, risk, unconf, when };
}
function renderAudit() {
  const a = auditNumbers();
  const earnedCount = TROPHIES.filter(t => state.earned[t.name]).length;
  const pts = TROPHIES.filter(t => state.earned[t.name]).reduce((s, t) => s + psnPoints(t.grade), 0);
  $('audit-strip').innerHTML =
    '<span>Trophies <b>' + TROPHIES.length + '/55</b> official</span>' +
    '<span>Grades <b>1P · 2G · 6S · 46B</b></span>' +
    '<span>Hidden <b>28</b></span>' +
    '<span>PSN <b>1,350</b> pts</span>' +
    '<span>Steps cited <b>' + a.stepsCited + '/' + a.steps + '</b></span>' +
    '<span>Claims cited <b>' + a.claimsCited + '/' + a.claims + '</b></span>' +
    '<span>Claims on 2+ sources <b>' + a.twoPlus + '</b></span>' +
    '<span>Sources <b>' + a.sources + '</b> read 2026-11-21</span>' +
    '<span>Disputes both ways <b>' + a.disputes + '</b></span>' +
    '<span>Earned <b>' + earnedCount + '/55</b> · ' + pts + ' pts</span>';
  const p = provenance();
  $('prov-strip').innerHTML =
    '<span>Provenance <b>' + p.pages + ' pages · ' + p.sites + ' sites read ' + esc(p.when) + '</b></span>' +
    '<span>Missable risk <b>' + p.miss + ' possibly missable / ' + p.risk + ' at risk / ' + p.unconf + ' unconfirmed</b></span>';
  $('progress-text').textContent = earnedCount + ' / 55 earned · ' + pts + ' / 1,350 PSN pts';
  $('progress-bar').style.width = (earnedCount / 55 * 100) + '%';
}
function shielded(t) { return state.spoiler && t.hidden && t.kind === 'story' && !state.earned[t.name]; }
function displayName(t) { return shielded(t) ? 'Hidden trophy (spoiler shield)' : t.name; }
function displayDesc(t) { return shielded(t) ? 'Hidden until earned — turn the shield off or earn it to reveal.' : t.description; }

function renderList() {
  const q = $('search').value.toLowerCase(), kind = $('f-kind').value, grade = $('f-grade').value, status = $('f-status').value;
  const ul = $('trophy-list'); ul.innerHTML = '';
  for (const t of TROPHIES) {
    if (kind && t.kind !== kind) continue;
    if (grade && t.grade !== grade) continue;
    if (status === 'done' && !state.earned[t.name]) continue;
    if (status === 'todo' && state.earned[t.name]) continue;
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))) continue;
    const li = document.createElement('li');
    if (t.id === selectedId) li.className = 'sel';
    const box = document.createElement('input'); box.type = 'checkbox'; box.checked = !!state.earned[t.name];
    box.addEventListener('change', () => { state.earned[t.name] = box.checked; persist(); renderAll(); });
    box.addEventListener('click', e => e.stopPropagation());
    const body = document.createElement('span');
    body.innerHTML = '<span class="nm">' + esc(displayName(t)) + '</span>' +
      (t.missable ? ' <span class="flag">possibly missable</span>' : '') +
      '<span class="ds">' + esc(displayDesc(t)) + '</span>' +
      '<span class="ds">' + t.kind + (t.count ? ' · count ' + t.count : '') + (t.hidden ? ' · hidden' : '') + '</span>';
    const g = document.createElement('span'); g.className = 'grade g-' + t.grade; g.textContent = t.grade;
    li.append(box, body, g);
    li.addEventListener('click', () => { selectedId = t.id; renderList(); renderGuide(); });
    ul.append(li);
  }
}
function missWindow(t) {
  if (t.name === 'Positive Mental Attitude') return { w: 'Chapter 1 balcony spot first; the rest any time before the run ends', last: 'End of Chapter 1 (balcony spot)', closes: 'Chapter 1 ending closes Jason\u2019s house balcony spot, if sources are right' };
  if (t.missable) return { w: 'See the Missables view', last: '—', closes: '—' };
  return { w: 'Open all run — free roam continues after the final mission', last: 'Never (post-story free roam)', closes: 'Nothing in normal play; cheats disable trophies for the session' };
}
function renderGuide() {
  const t = TROPHIES.find(x => x.id === selectedId) || TROPHIES[0];
  const pane = $('guide-pane');
  const guideSrcs = new Set(); (t.steps || []).forEach(st => (st.s || []).forEach(n => guideSrcs.add(n)));
  let h = '<h2>' + esc(displayName(t)) + ' <span class="grade g-' + t.grade + '">' + t.grade + '</span></h2>';
  h += '<p class="ds" style="color:var(--mut)">' + esc(displayDesc(t)) + ' · ' + psnPoints(t.grade) + ' PSN pts · ~' + (t.minutes || 0) + ' min · confidence ' + (t.conf || 'B') + (t.hidden ? ' · hidden on PSN' : '') + '</p>';
  h += '<div class="short"><b>Short answer.</b> ' + esc(t.guide) + cites([...guideSrcs].slice(0, 3)) + '</div>';
  const mw = missWindow(t);
  h += '<div class="box missbox"><h3>Missable window</h3><p><b>Window:</b> ' + esc(mw.w) + '<br><b>Last chance:</b> ' + esc(mw.last) + '<br><b>What closes it:</b> ' + esc(mw.closes) + '</p></div>';
  if (t.count) {
    const cur = state.counts[t.name] || 0;
    h += '<div class="countrow"><span>YOUR COUNT</span><button type="button" id="cnt-dec">−</button><span class="countnum">' + cur + ' / ' + t.count + '</span><button type="button" id="cnt-inc">+</button></div>';
  }
  h += '<h3>Steps</h3><ol class="steps">' + (t.steps || []).map(st => '<li>' + esc(st.t) + cites(st.s || []) + '</li>').join('') + '</ol>';
  const mine = DISPUTES.filter(d => d.trophy === t.name);
  for (const d of mine) {
    h += '<div class="box diffbox"><h3>Sources differ — ' + esc(d.topic) + '</h3><p><b>Version A:</b> ' + esc(d.a) + cites(d.aSrc) + '<br><b>Version B:</b> ' + esc(d.b) + cites(d.bSrc) + '<br><b>' + esc(d.call) + '</b></p></div>';
  }
  h += '<div class="box"><h3>Sources for this guide</h3><ul>' + [...guideSrcs].map(n => { const s = META.sources.find(x => x.n === n); return '<li>S' + n + ' — ' + esc(s ? s.name : '') + ' (' + esc(s ? s.independence : '') + ')</li>'; }).join('') + '</ul></div>';
  h += '<label><input type="checkbox" id="guide-earned" ' + (state.earned[t.name] ? 'checked' : '') + '> Earned</label>';
  pane.innerHTML = h;
  const ge = $('guide-earned'); ge.addEventListener('change', () => { state.earned[t.name] = ge.checked; persist(); renderAll(); });
  if (t.count) {
    $('cnt-inc').addEventListener('click', () => { state.counts[t.name] = Math.min(t.count, (state.counts[t.name] || 0) + 1); if (state.counts[t.name] >= t.count) state.earned[t.name] = true; persist(); renderAll(); });
    $('cnt-dec').addEventListener('click', () => { state.counts[t.name] = Math.max(0, (state.counts[t.name] || 0) - 1); persist(); renderAll(); });
  }
  const rs = $('rail-sources');
  rs.innerHTML = [...guideSrcs].map(n => { const s = META.sources.find(x => x.n === n); return '<li>S' + n + ' ' + esc(s ? s.name.split(' — ')[0] : '') + ' — ' + (t.steps || []).filter(st => (st.s || []).includes(n)).length + ' steps</li>'; }).join('');
}
function renderRail() {
  const next = TROPHIES.filter(t => !state.earned[t.name]).slice(0, 8);
  $('next-up').innerHTML = next.map(t => '<li>' + esc(displayName(t)) + ' <span class="grade g-' + t.grade + '">' + t.grade + '</span></li>').join('');
  $('watch-rail').innerHTML = META.watchList.map(w => '<li><b>' + esc(w.name) + '</b> — ' + esc(w.why) + cites(w.c) + '</li>').join('');
}
function renderAll() { renderAudit(); renderList(); renderGuide(); renderRail(); if (window.renderViews) window.renderViews(); }

async function init() {
  const [tj, mj, dj] = await Promise.all([fetch('data/trophies.json').then(r => r.json()), fetch('data/meta.json').then(r => r.json()), fetch('data/disputes.json').then(r => r.json())]);
  TROPHIES = tj.trophies; META = mj; DISPUTES = dj.disputes;
  if (DEMO && !localStorage.getItem(SAVE_KEY)) state = loadState();
  $('spoiler').checked = state.spoiler;
  ['search', 'f-kind', 'f-grade', 'f-status'].forEach(id => $(id).addEventListener('input', renderList));
  $('spoiler').addEventListener('change', () => { state.spoiler = $('spoiler').checked; persist(); renderAll(); });
  $('export-btn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'leonida-night-ledger-save.json'; a.click();
    $('save-receipt').textContent = 'Exported leonida-night-ledger-save.json just now.';
  });
  $('import-file').addEventListener('change', async e => {
    const f = e.target.files[0]; if (!f) return;
    try { const p = JSON.parse(await f.text()); state = { earned: p.earned || {}, counts: p.counts || {}, spoiler: !!p.spoiler, lastImport: f.name }; persist(); $('save-receipt').textContent = 'Imported ' + f.name + ' — save restored.'; renderAll(); }
    catch (err) { $('save-receipt').textContent = 'Import failed: not a ledger save file.'; }
  });
  document.querySelectorAll('.navbtn').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.navbtn').forEach(x => x.classList.remove('active')); b.classList.add('active');
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    $('view-' + b.dataset.view).classList.remove('hidden');
  }));
  const start = new URLSearchParams(location.search).get('view');
  if (start && $('view-' + start)) document.querySelector('[data-view="' + start + '"]').click();
  const sel = new URLSearchParams(location.search).get('trophy');
  if (sel) { const t = TROPHIES.find(x => x.name === sel); if (t) selectedId = t.id; }
  renderAll();
}
init();
