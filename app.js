// 화면 전환, 위젯, 퀴즈, 암기 카드
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const memory = {};
const store = {
  get(k, d) {
    try { const v = localStorage.getItem('bodytrip_' + k); if (v !== null) return JSON.parse(v); } catch (e) {}
    return k in memory ? memory[k] : d;
  },
  set(k, v) {
    memory[k] = v;
    try { localStorage.setItem('bodytrip_' + k, JSON.stringify(v)); } catch (e) {}
  },
};
const shuffle = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
const strip = html => html.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '');
const chById = id => CHAPTERS.find(c => c.id === id);

// 대단원. 단원 데이터 파일의 CHAPTERS 항목은 unit으로 대단원을 가리킨다(없으면 bio).
const UNITS = [
  {
    id: 'bio', no: 'Ⅵ', title: '동물과 에너지', name: '몸속 여행 과학', emo: '🫀', color: '#e4791f', soft: '#fff1e2',
    hero: `<h1>밥 한 숟가락의 <em>몸속 여행</em></h1>
    <p>그림으로 이해하고, 카드로 외우고, 문제로 확인해요.</p>
    <div class="journey"><span>🍚 소화</span><i>→</i><span>🫀 순환</span><i>→</i><span>🫁 호흡</span><i>→</i><span>💧 배설</span></div>`,
    mock: { digest: 8, circ: 5, resp: 4, excr: 4, all: 1 }, mockKey: 'mockBest',
  },
  {
    id: 'elec', no: 'Ⅶ', title: '전기와 자기', name: '전기와 자기', emo: '⚡', color: '#2b62c4', soft: '#e7efff',
    hero: `<h1>문지르면 생기는 전기가 <em>모터를 돌리기까지</em></h1>
    <p>전하, 전류, 자기장을 그림으로 이해하고 계산 문제까지 확인해요.</p>
    <div class="journey"><span>⚡ 전기의 발생</span><i>→</i><span>🔋 회로와 에너지</span><i>→</i><span>🧲 전류의 자기 작용</span></div>`,
    mock: { charge: 7, circuit: 9, magnet: 5, esum: 1 }, mockKey: 'mockBest_elec',
  },
];
CHAPTERS.forEach(c => { if (!c.unit) c.unit = 'bio'; });
const unitById = id => UNITS.find(u => u.id === id);
const curUnit = () => unitById(store.get('unit', 'bio')) || UNITS[0];
const setUnit = id => { if (unitById(id)) store.set('unit', id); };
const unitChs = u => CHAPTERS.filter(c => c.unit === u.id);

// 모든 문제에 고유 번호 붙이기
const QBYID = {};
Object.keys(QUIZ).forEach(ch => QUIZ[ch].forEach((q, i) => { q.id = ch + '-' + i; q.ch = ch; q.unit = chById(ch).unit; QBYID[q.id] = q; }));
const FIGQ = { villus: () => FIG.villus(true), heart: () => FIG.heart(true), nephronQ: () => FIG.nephron(-1, true) };
const figQ = name => FIGQ[name] ? FIGQ[name]() : FIG[name](true);

const app = $('#app');
const setAccent = c => {
  c = c || curUnit();
  document.documentElement.style.setProperty('--c', c.color);
  document.documentElement.style.setProperty('--c-soft', c.soft);
};
const wrongIds = () => store.get('wrong', []).filter(id => QBYID[id] && QBYID[id].unit === curUnit().id);
const setBar = (title, back) => {
  $('#top').innerHTML = `<div class="bar">${back ? `<a class="back" href="${back}" aria-label="뒤로">←</a>` : ''}<strong>${title}</strong></div>`;
};
const setTabs = cur => {
  const n = wrongIds().length;
  const tabs = [[`#/u/${curUnit().id}`, '🏠', '공부', 'home'], ['#/cards', '🃏', '암기 카드', 'cards'], ['#/mock', '📝', '모의고사', 'mock'], ['#/wrong', '❗', '오답 노트', 'wrong']];
  $('#tabs').innerHTML = tabs.map(t => `<a href="${t[0]}" class="${t[3] === cur ? 'on' : ''}"><span>${t[1]}</span>${t[2]}${t[3] === 'wrong' && n ? `<em class="num" style="font-style:normal">${n}</em>` : ''}</a>`).join('');
};
const focusMode = on => document.body.classList.toggle('focus', on);

/* ---------- 첫 화면: 대단원 고르기 ---------- */
function unitHome() {
  setAccent(); setBar('중학 과학 공부방'); setTabs('home'); focusMode(false);
  const read = store.get('read', {});
  app.innerHTML = `
  <section class="hero">
    <small>중학교 과학</small>
    <h1>오늘은 <em>어떤 단원</em>을 공부할까요?</h1>
    <p>단원을 고르면 내용 공부, 문제 풀기, 수능 실전 문제, 암기 카드, 모의고사, 오답 노트를 쓸 수 있어요.</p>
  </section>
  ${UNITS.map(u => {
    const chs = unitChs(u), lessons = chs.reduce((s, c) => s + c.lessons.length, 0);
    const done = chs.reduce((s, c) => s + c.lessons.filter((_, i) => read[c.id + i]).length, 0);
    const nq = chs.reduce((s, c) => s + (QUIZ[c.id] || []).length, 0), nx = chs.reduce((s, c) => s + (EXAM[c.id] || []).length, 0);
    return `<a class="ch-card" href="#/u/${u.id}" style="--c:${u.color};--c-soft:${u.soft}">
      <div class="ch-head"><div class="ch-emo">${u.emo}</div><div><h2>${u.no}. ${u.title}</h2><p>${chs.map(c => c.title).join(' · ')}</p></div></div>
      <div class="meter"><b style="width:${Math.round(done / lessons * 100)}%"></b></div>
      <div class="ch-stat"><span>공부 ${done}/${lessons}</span><span>문제 ${nq}개 · 실전 ${nx}문항</span></div>
    </a>`;
  }).join('')}`;
}

/* ---------- 대단원 홈 ---------- */
function home(uid) {
  setUnit(uid);
  const u = curUnit();
  setAccent(); setBar(`${u.no}. ${u.title}`, '#/'); setTabs('home'); focusMode(false);
  const read = store.get('read', {}), best = store.get('best', {});
  app.innerHTML = `
  <section class="hero">
    <small>${u.no}. ${u.title}</small>
    ${u.hero}
  </section>
  ${unitChs(u).map(c => {
    const done = c.lessons.filter((_, i) => read[c.id + i]).length;
    const pct = Math.round(done / c.lessons.length * 100);
    const b = best[c.id];
    return `<a class="ch-card" href="#/c/${c.id}" style="--c:${c.color};--c-soft:${c.soft}">
      <div class="ch-head"><div class="ch-emo">${c.emo}</div><div><h2>${c.title}</h2><p>${c.sub}</p></div></div>
      <div class="meter"><b style="width:${pct}%"></b></div>
      <div class="ch-stat"><span>공부 ${done}/${c.lessons.length}</span><span>문제 ${QUIZ[c.id].length}개${b !== undefined ? ` · 최고 ${b}점` : ''}</span></div>
    </a>`;
  }).join('')}`;
}

/* ---------- 단원 공부 ---------- */
function chapter(id) {
  const c = chById(id);
  if (!c) return unitHome();
  setUnit(c.unit);
  setAccent(c); setBar(`${c.emo} ${c.title}`, `#/u/${c.unit}`); setTabs('home'); focusMode(false);
  const read = store.get('read', {});
  const hide = store.get('hide', false);
  const xb = store.get('examBest', {})[id];
  app.innerHTML = `
  <div class="ch-title"><h1>${c.title}</h1><p>${c.intro}</p></div>
  <button class="switch" data-act="hide" aria-pressed="${hide}"><span>🙈 핵심어 가리기 <small style="font-weight:600">(눌러서 하나씩 확인)</small></span><span class="tg"></span></button>
  <div class="jump">${c.lessons.map((l, i) => `<button data-act="jump" data-i="${i}" class="${read[id + i] ? 'done' : ''}">${i + 1}. ${l.t}</button>`).join('')}</div>
  <div id="lessons" class="${hide ? 'hide-on' : ''}">
  ${c.lessons.map((l, i) => `<section class="lesson" id="l${i}">
    <h2><span class="n">${i + 1}</span>${l.t}</h2>
    ${l.html}
    <button class="readbtn ${read[id + i] ? 'on' : ''}" data-act="read" data-key="${id + i}" data-i="${i}">${read[id + i] ? '✓ 공부 완료' : '다 읽었어요'}</button>
  </section>`).join('')}
  </div>
  <div class="cta">
    <a class="btn main" href="#/q/${id}/10">✏️ 문제 풀기 (${Math.min(10, QUIZ[id].length)}문제)</a>
    ${EXAM[id] ? `<a class="btn" href="#/x/${id}">🎯 수능 실전 문제 (${EXAM[id].length}문항)${xb !== undefined ? ` · 최고 ${xb}점` : ''}</a>` : ''}
    <div class="btn-row"><a class="btn" href="#/f/${id}">🃏 암기 카드</a><a class="btn" href="#/q/${id}/all">전체 ${QUIZ[id].length}문제</a></div>
  </div>`;
  initWidgets();
}

function initWidgets() {
  $$('[data-widget]', app).forEach(el => WIDGETS[el.dataset.widget](el, el.dataset.opt));
}

const WIDGETS = {
  tapmap(el, key) {
    const m = MAPS[key];
    const names = Object.keys(m.info);
    el.innerHTML = `<div class="tapwrap">${m.fig()}</div><div class="chips">${names.map(n => `<button data-o="${n}">${n}</button>`).join('')}</div><div class="info" aria-live="polite">${m.prompt}</div>`;
    const svg = $('svg', el), info = $('.info', el);
    const pick = n => {
      svg.classList.add('has-on');
      $$('.tap', svg).forEach(g => g.classList.toggle('on', g.dataset.o === n));
      $$('.chips button', el).forEach(b => b.classList.toggle('on', b.dataset.o === n));
      info.innerHTML = `<b class="t">${n}</b>${m.info[n]}`;
    };
    el.addEventListener('click', e => {
      const t = e.target.closest('[data-o]');
      if (t) pick(t.dataset.o);
    });
  },
  tubes(el) {
    const tubes = [
      { n: '녹말', r: '아이오딘 용액', color: '#2e3a8c', res: '청람색', start: '#f0efe8' },
      { n: '포도당', r: '베네딕트 용액 + 가열', color: '#d9822b', res: '황적색', start: '#8cc6ee' },
      { n: '단백질', r: '뷰렛 반응', color: '#6b3fa0', res: '보라색', start: '#f0efe8' },
      { n: '지방', r: '수단 Ⅲ 용액', color: '#d9342b', res: '선홍색', start: '#fbf2bf', fat: true },
    ];
    el.innerHTML = `<div class="grid2">${tubes.map((t, i) => `<div class="tube-card" data-i="${i}">
      <b class="t">${t.n}</b>${t.r}
      <svg viewBox="0 0 60 120" aria-hidden="true">
        <path class="liq" d="M16 ${t.fat ? 62 : 40}V96a14 14 0 0 0 28 0V${t.fat ? 62 : 40}Z" fill="${t.fat ? '#e6f2f8' : t.start}"/>
        ${t.fat ? `<rect class="liq top" x="16" y="34" width="28" height="28" fill="${t.start}"/>` : ''}
        <path d="M14 8V96a16 16 0 0 0 32 0V8" fill="none" stroke="#555" stroke-width="2.500"/>
      </svg>
      <div class="res">&nbsp;</div><button>시약 넣기</button></div>`).join('')}</div>`;
    el.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const card = b.closest('.tube-card'), t = tubes[+card.dataset.i];
      const on = card.classList.toggle('on');
      const liq = t.fat ? $('.liq.top', card) : $('.liq', card);
      liq.setAttribute('fill', on ? t.color : t.start);
      $('.res', card).innerHTML = on ? `<span style="color:${t.color}">${t.res}!</span>` : '&nbsp;';
      b.textContent = on ? '처음으로' : '시약 넣기';
    });
  },
  circ(el) {
    const S = {
      all: { txt: '<b>전체 보기</b> 피는 심장을 중심으로 온몸과 폐를 번갈아 돌아요. 파란색은 정맥혈, 빨간색은 동맥혈이에요.', steps: [] },
      sys: { txt: '<b>온몸 순환</b> 조직 세포에 산소와 영양소를 주고, 이산화 탄소와 노폐물을 받아요. <b>동맥혈 → 정맥혈</b>', steps: ['좌심실', '대동맥', '온몸의 모세 혈관', '대정맥', '우심방'] },
      pul: { txt: '<b>폐순환</b> 폐에서 이산화 탄소를 버리고 산소를 받아요. <b>정맥혈 → 동맥혈</b>', steps: ['우심실', '폐동맥', '폐의 모세 혈관', '폐정맥', '좌심방'] },
    };
    el.innerHTML = `<div class="seg"><button data-s="all" class="on">전체</button><button data-s="sys">온몸 순환</button><button data-s="pul">폐순환</button></div>
      ${FIG.circ()}<div class="info" style="margin-top:8px"></div><ol class="steps"></ol>`;
    const svg = $('svg', el);
    const show = s => {
      $$('.seg button', el).forEach(b => b.classList.toggle('on', b.dataset.s === s));
      $('.loop-sys', svg).style.opacity = s === 'pul' ? .12 : 1;
      $('.loop-pul', svg).style.opacity = s === 'sys' ? .12 : 1;
      $('.info', el).innerHTML = S[s].txt;
      $('.steps', el).innerHTML = S[s].steps.map(x => `<li>${x}</li>`).join('');
    };
    el.addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (b) show(b.dataset.s); });
    show('all');
  },
  breath(el) {
    const S = {
      in: ['갈비뼈 올라감, 가로막 내려감', '흉강 부피 커짐, 흉강 압력 낮아짐', '폐 부피 커짐, 폐 내부 압력 낮아짐', '공기가 몸 밖에서 폐 안으로 들어옴'],
      out: ['갈비뼈 내려감, 가로막 올라감', '흉강 부피 작아짐, 흉강 압력 높아짐', '폐 부피 작아짐, 폐 내부 압력 높아짐', '공기가 폐 안에서 몸 밖으로 나감'],
    };
    el.innerHTML = `<div class="seg"><button data-b="in" class="on">들숨 (들이쉬기)</button><button data-b="out">날숨 (내쉬기)</button></div>${FIG.breath()}<ol class="steps"></ol>`;
    const show = s => {
      $$('.seg button', el).forEach(b => b.classList.toggle('on', b.dataset.b === s));
      $('#breath', el).classList.toggle('in', s === 'in');
      $('.steps', el).innerHTML = S[s].map(x => `<li>${x}</li>`).join('');
    };
    el.addEventListener('click', e => { const b = e.target.closest('[data-b]'); if (b) show(b.dataset.b); });
    show('in');
  },
  nephron(el) {
    const S = [
      '<b>전체 보기</b> 위의 단계 버튼을 하나씩 눌러 보세요. 빨간 피가 네프론을 지나며 깨끗해져요.',
      '<b>① 여과</b> 혈압 차이로 <b>토리 → 보먼주머니</b>로 작은 물질이 빠져나와요. 물, 요소, 포도당, 아미노산, 무기염류는 통과! 혈구와 단백질은 커서 통과 못 해요.',
      '<b>② 재흡수</b> 세뇨관을 지나는 동안 필요한 물질이 <b>세뇨관 → 모세 혈관</b>으로 돌아가요. 포도당과 아미노산은 전부, 물과 무기염류는 대부분(90% 이상), 요소도 50% 정도 돌아가요.',
      '<b>③ 분비</b> 여과되지 않고 피에 남아 있던 노폐물이 <b>모세 혈관 → 세뇨관</b>으로 옮겨 가요. 남은 액체가 오줌이 되어 콩팥 깔때기로 가요.',
    ];
    const labels = ['전체', '① 여과', '② 재흡수', '③ 분비'];
    el.innerHTML = `<div class="seg">${labels.map((l, i) => `<button data-n="${i}">${l}</button>`).join('')}</div><div class="nf"></div><div class="info"></div>`;
    const show = n => {
      $$('.seg button', el).forEach(b => b.classList.toggle('on', +b.dataset.n === n));
      $('.nf', el).innerHTML = FIG.nephron(n);
      $('.info', el).innerHTML = S[n];
    };
    el.addEventListener('click', e => { const b = e.target.closest('[data-n]'); if (b) show(+b.dataset.n); });
    show(0);
  },
  // ---- Ⅶ. 전기와 자기 ----
  scope(el) {
    const M = '−';
    const S = [
      ['구조', { lab: true }, '<b>검전기</b> 금속판, 금속 막대, 금속박이 모두 금속(도체)이라 안에서 전자가 자유롭게 움직여요. 대전되지 않은 상태에서는 금속박이 오므라져 있어요.'],
      ['(+)대전체', { rod: '+', plate: '− − −', leaf: '+', open: 1 }, '<b>대전되지 않은 검전기 + (+)대전체</b> (+)대전체가 전자를 <b>끌어당겨(인력)</b> 금속판은 (−)전하, 전자가 적어진 금속박은 (+)전하로 대전돼요. 같은 전하끼리 밀어내서 금속박이 <b>벌어져요</b>.'],
      ['(−)대전체', { rod: M, plate: '+ + +', leaf: M, open: 1 }, '<b>대전되지 않은 검전기 + (−)대전체</b> (−)대전체가 전자를 <b>밀어내(척력)</b> 금속판은 (+)전하, 전자가 많아진 금속박은 (−)전하로 대전돼요. 금속박이 <b>벌어져요</b>.'],
      ['대전 안 된 물체', { rod: '0' }, '<b>대전되지 않은 물체</b>를 가까이 하면 전자가 움직이지 않아 금속박이 <b>벌어지지 않아요</b>. → 대전 여부를 알 수 있어요.'],
      ['(−)검전기+(−)', { rod: M, plate: '+', leaf: '− −', open: 2 }, '<b>(−)로 대전된 검전기 + (−)대전체 (같은 전하)</b> 전자가 금속박 쪽으로 더 밀려 내려가 금속박의 (−)가 더 많아져요. 금속박이 <b>더 벌어져요</b>.'],
      ['(−)검전기+(+)', { rod: '+', plate: '− − − −' }, '<b>(−)로 대전된 검전기 + (+)대전체 (다른 전하)</b> 금속박의 전자가 금속판 쪽으로 끌려 올라가 금속박의 (−)가 적어져요. 금속박이 <b>오므라들어요</b>.'],
    ];
    el.innerHTML = `<div class="chips">${S.map((s, i) => `<button data-s="${i}">${s[0]}</button>`).join('')}</div><div class="sc"></div><div class="info"></div>`;
    const show = i => {
      $$('.chips button', el).forEach(b => b.classList.toggle('on', +b.dataset.s === i));
      $('.sc', el).innerHTML = FIG.scope(S[i][1]);
      $('.info', el).innerHTML = S[i][2];
    };
    el.addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (b) show(+b.dataset.s); });
    show(0);
  },
  scopeStep(el) {
    const M = '−';
    const D = {
      m: [
        [{ rod: M, plate: '+ + +', leaf: M, open: 1 }, '<b>① 가까이 하기</b> (−)대전체가 전자를 밀어내 금속박이 (−)로 대전되어 벌어져요.'],
        [{ rod: M, plate: '+ + +', hand: true }, '<b>② 손가락 대기</b> 밀려난 전자가 손가락을 통해 몸으로 빠져나가요. 금속박이 오므라들어요.'],
        [{ plate: '+', leaf: '+', open: 1 }, '<b>③ 손가락 떼고 대전체 치우기</b> 전자가 부족한 검전기 전체가 <b>(+)전하</b>로 대전되어 금속박이 다시 벌어져요.'],
      ],
      p: [
        [{ rod: '+', plate: '− − −', leaf: '+', open: 1 }, '<b>① 가까이 하기</b> (+)대전체가 전자를 끌어당겨 금속박이 (+)로 대전되어 벌어져요.'],
        [{ rod: '+', plate: '− − −', hand: true }, '<b>② 손가락 대기</b> 손가락을 통해 몸에서 전자가 들어와 금속박을 채워요. 금속박이 오므라들어요.'],
        [{ plate: M, leaf: M, open: 1 }, '<b>③ 손가락 떼고 대전체 치우기</b> 전자가 남는 검전기 전체가 <b>(−)전하</b>로 대전되어 금속박이 벌어져요.'],
      ],
    };
    let sg = 'm', st = 0;
    el.innerHTML = `<div class="seg"><button data-g="m">(−)대전체로</button><button data-g="p">(+)대전체로</button></div>
      <div class="seg"><button data-t="0">① 접근</button><button data-t="1">② 손가락</button><button data-t="2">③ 치우기</button></div><div class="sc"></div><div class="info"></div>`;
    const show = () => {
      $$('[data-g]', el).forEach(b => b.classList.toggle('on', b.dataset.g === sg));
      $$('[data-t]', el).forEach(b => b.classList.toggle('on', +b.dataset.t === st));
      $('.sc', el).innerHTML = FIG.scope(D[sg][st][0]);
      $('.info', el).innerHTML = D[sg][st][1];
    };
    el.addEventListener('click', e => {
      const g = e.target.closest('[data-g]'), t = e.target.closest('[data-t]');
      if (g) { sg = g.dataset.g; st = 0; show(); }
      if (t) { st = +t.dataset.t; show(); }
    });
    show();
  },
  ohm(el) {
    el.innerHTML = `<div class="sliders"><label>전압 V = <b data-o="v"></b> V<input type="range" min="1" max="12" value="6" data-k="v" aria-label="전압"></label>
      <label>저항 R = <b data-o="r"></b> Ω<input type="range" min="1" max="12" value="3" data-k="r" aria-label="저항"></label></div><div class="info"></div>`;
    const upd = () => {
      const v = +$('[data-k="v"]', el).value, r = +$('[data-k="r"]', el).value, i = v / r;
      $('[data-o="v"]', el).textContent = v; $('[data-o="r"]', el).textContent = r;
      $('.info', el).innerHTML = `<b class="t">I = V ÷ R = ${v} ÷ ${r} = ${num(i)} A</b>
        <div class="meter" style="margin:6px 0"><b style="width:${Math.min(100, i / 12 * 100)}%"></b></div>
        = ${num(i * 1000)} mA · 소비 전력 P = V × I = ${num(v * i)} W`;
    };
    el.addEventListener('input', upd);
    upd();
  },
  combo(el) {
    let kind = 'series';
    el.innerHTML = `<div class="seg"><button data-c="series">직렬연결</button><button data-c="parallel">병렬연결</button></div>
      <div class="sliders"><label>전체 전압 V = <b data-o="v"></b> V<input type="range" min="1" max="12" value="12" data-k="v" aria-label="전압"></label>
      <label>R₁ = <b data-o="a"></b> Ω<input type="range" min="1" max="12" value="3" data-k="a" aria-label="저항 1"></label>
      <label>R₂ = <b data-o="b"></b> Ω<input type="range" min="1" max="12" value="6" data-k="b" aria-label="저항 2"></label></div>
      <div class="info"></div>`;
    const upd = () => {
      const g = k => +$(`[data-k="${k}"]`, el).value, v = g('v'), a = g('a'), b = g('b');
      ['v', 'a', 'b'].forEach(k => { $(`[data-o="${k}"]`, el).textContent = g(k); });
      $$('[data-c]', el).forEach(x => x.classList.toggle('on', x.dataset.c === kind));
      let rows;
      if (kind === 'series') {
        const R = a + b, I = v / R;
        rows = [['전체 저항', `R₁ + R₂ = ${a} + ${b} = ${num(R)} Ω`], ['전체 전류', `V ÷ R = ${v} ÷ ${num(R)} = ${num(I)} A`], ['I₁ = I₂', `${num(I)} A (모두 같다)`], ['V₁', `I × R₁ = ${num(I * a)} V`], ['V₂', `I × R₂ = ${num(I * b)} V`]];
      } else {
        const R = a * b / (a + b);
        rows = [['전체 저항', `${a}×${b} ÷ (${a}+${b}) = ${num(R)} Ω`], ['V₁ = V₂', `${v} V (모두 같다)`], ['I₁', `V ÷ R₁ = ${num(v / a)} A`], ['I₂', `V ÷ R₂ = ${num(v / b)} A`], ['전체 전류', `I₁ + I₂ = ${num(v / a + v / b)} A`]];
      }
      $('.info', el).innerHTML = `<table class="tb tiny">${rows.map(r => `<tr><th>${r[0]}</th><td class="l">${r[1]}</td></tr>`).join('')}</table>`;
    };
    el.addEventListener('input', upd);
    el.addEventListener('click', e => { const c = e.target.closest('[data-c]'); if (c) { kind = c.dataset.c; upd(); } });
    upd();
  },
  coil(el) {
    const T = ['전류 방향을 바꾸기 전: 엄지가 오른쪽을 가리키므로 <b>오른쪽이 N극</b>이에요.', '전류 방향을 반대로 하면 엄지도 반대로! 이제 <b>왼쪽이 N극</b>이에요.'];
    el.innerHTML = `<div class="seg"><button data-v="0">전류 방향 ①</button><button data-v="1">전류 방향 ② (반대)</button></div><div class="cw"></div><div class="info"></div>`;
    const show = v => {
      $$('[data-v]', el).forEach(b => b.classList.toggle('on', +b.dataset.v === v));
      $('.cw', el).innerHTML = FIG.coil(v === 1);
      $('.info', el).innerHTML = T[v];
    };
    el.addEventListener('click', e => { const b = e.target.closest('[data-v]'); if (b) show(+b.dataset.v); });
    show(0);
  },
};
const num = x => +x.toFixed(2);

/* ---------- 퀴즈 ---------- */
let Q = null;
function pickList(mode, ch) {
  if (mode === 'wrong') return shuffle(wrongIds().map(id => QBYID[id]));
  if (mode === 'mock') {
    const plan = curUnit().mock;
    return shuffle(Object.keys(plan).flatMap(k => shuffle(QUIZ[k]).slice(0, plan[k])));
  }
  const pool = shuffle(QUIZ[ch]);
  return mode === 'all' ? pool : pool.slice(0, 10);
}
function startQuiz(mode, ch, list) {
  const c = ch ? chById(ch) : null;
  if (c) setUnit(c.unit);
  setAccent(c);
  const title = mode === 'wrong' ? '오답 다시 풀기' : mode === 'mock' ? '단원 모의고사' : `${c.title} 문제`;
  const back = mode === 'wrong' ? '#/wrong' : mode === 'mock' ? '#/mock' : `#/c/${ch}`;
  Q = { mode, ch, title, back, list: list || pickList(mode, ch), retry: !!list, i: 0, score: 0, wrong: [] };
  setBar(title, back); focusMode(true);
  renderQ();
}
const norm = s => s.toLowerCase().replace(/[\s·,.\-()~]/g, '');
const TYPE = { mc: '객관식', fig: '그림 문제', ox: 'O / X', sa: '단답형', order: '순서 맞추기' };

function renderQ() {
  const q = Q.list[Q.i];
  if (!q) return renderResult();
  Q.answered = false;
  const pct = Q.i / Q.list.length * 100;
  let body = '';
  if (q.t === 'mc' || q.t === 'fig') {
    const idx = q.o.map((_, i) => i);
    Q.opts = q.keep ? idx : shuffle(idx);
    body = (q.fig ? figQ(q.fig) : '') + `<div style="margin-top:10px">${Q.opts.map((oi, n) => `<button class="opt" data-act="mc" data-oi="${oi}"><span class="no">${n + 1}</span><span>${q.o[oi]}</span></button>`).join('')}</div>`;
  } else if (q.t === 'ox') {
    body = `<div class="ox"><button class="opt" data-act="ox" data-v="1" aria-label="맞다" style="color:#16895c">O</button><button class="opt" data-act="ox" data-v="0" aria-label="틀리다" style="color:#cf3b30">X</button></div>`;
  } else if (q.t === 'sa') {
    body = `${q.hint ? `<p class="hint">힌트: ${q.hint}</p>` : ''}<form data-form="sa" autocomplete="off"><input class="sa" id="sa" placeholder="답을 입력하세요" aria-label="답 입력" enterkeyhint="done" autocorrect="off" autocapitalize="off"><button class="btn main" type="submit">확인</button></form>`;
  } else if (q.t === 'order') {
    let pool = shuffle(q.o);
    while (pool.join() === q.o.join()) pool = shuffle(q.o);
    Q.pool = pool; Q.picked = [];
    body = `<div id="ordbox"></div>`;
  }
  app.innerHTML = `
    <div class="qtop"><span>${Q.title}</span><span>${Q.i + 1} / ${Q.list.length}</span></div>
    <div class="qmeter"><b style="width:${pct}%"></b></div>
    <div class="qcard"><span class="qtype">${TYPE[q.t]}</span><p class="qtext">${q.q}</p>${body}<div id="after"></div></div>`;
  window.scrollTo(0, 0);
  if (q.t === 'order') renderOrder();
}
function renderOrder() {
  const box = $('#ordbox');
  const full = Q.picked.length === Q.list[Q.i].o.length;
  box.innerHTML = `
    <div class="ord-ans ${Q.picked.length ? '' : 'none'}">${Q.picked.map((w, n) => `<button class="tok" data-act="ord-back" data-n="${n}"><i>${n + 1}</i>${w}</button>`).join('')}</div>
    <div class="ord-pool">${Q.pool.map((w, n) => `<button class="tok" data-act="ord-pick" data-n="${n}">${w}</button>`).join('')}</div>
    <button class="btn main" data-act="ord-check" ${full ? '' : 'disabled'}>확인</button>`;
}
function answered(q, ok, shown, opts = {}) {
  Q.answered = true;
  if (ok) Q.score++; else Q.wrong.push(q);
  updateWrong(q, ok);
  const last = Q.i === Q.list.length - 1;
  $('#after').innerHTML = `
    <div class="fb ${ok ? 'good' : 'bad'}">
      <b class="h">${ok ? '정답이에요! 🎉' : '아쉬워요'}</b>
      ${ok ? '' : `<div>정답: <span class="ans">${shown}</span></div>`}
      <div>${q.e}</div>
      ${opts.self ? `<button class="linkbtn" data-act="self">제 답도 맞아요 (맞은 걸로 바꾸기)</button>` : ''}
    </div>
    <button class="btn main next" data-act="next">${last ? '결과 보기' : '다음 문제 →'}</button>`;
  $('.next').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
function updateWrong(q, ok) {
  const set = new Set(store.get('wrong', []));
  if (ok) set.delete(q.id); else set.add(q.id);
  store.set('wrong', [...set]);
}
function answerText(q) {
  if (q.t === 'mc' || q.t === 'fig') return q.o[q.a];
  if (q.t === 'ox') return q.a ? 'O' : 'X';
  if (q.t === 'sa') return q.a[0];
  return q.o.join(' → ');
}
const CHEER = p => p === 100 ? '완벽해요! 이 단원은 정복했어요 👑' : p >= 80 ? '아주 잘했어요! 틀린 것만 다시 보면 끝!' : p >= 60 ? '좋아요! 조금만 더 복습해 봐요.' : '괜찮아요. 설명을 다시 읽고 도전해 봐요!';
function renderResult() {
  const total = Q.list.length, pct = total ? Math.round(Q.score / total * 100) : 0;
  if (Q.ch && Q.mode !== 'wrong' && !Q.retry) {
    const best = store.get('best', {});
    if (best[Q.ch] === undefined || pct > best[Q.ch]) { best[Q.ch] = pct; store.set('best', best); }
  }
  if (Q.mode === 'mock') { const k = curUnit().mockKey; store.set(k, Math.max(pct, store.get(k, 0))); }
  const again = Q.mode === 'wrong' ? '#/q/wrong' : Q.mode === 'mock' ? null : `#/q/${Q.ch}/${Q.mode}`;
  app.innerHTML = `
    <div class="score"><div class="big">${pct}<small>점</small></div><p>${total}문제 중 ${Q.score}개 정답</p><p style="color:var(--sub)">${CHEER(pct)}</p></div>
    <div class="cta">
      ${Q.wrong.length ? `<button class="btn main" data-act="retry">틀린 ${Q.wrong.length}문제 다시 풀기</button>` : ''}
      ${again ? `<button class="btn" data-act="again">새로 섞어서 풀기</button>` : `<button class="btn" data-act="again">새 모의고사 풀기</button>`}
      <a class="btn" href="${Q.back}">돌아가기</a>
    </div>
    ${Q.wrong.length ? `<h2 style="font-size:18px;font-weight:800">틀린 문제 확인</h2><div class="wlist">${Q.wrong.map(wrongRow).join('')}</div>` : ''}`;
  window.scrollTo(0, 0);
  focusMode(false); setTabs('');
}
const wrongRow = q => `<div class="wrow"><div class="wq">${strip(q.q)}</div><div class="wa">정답: ${answerText(q)}</div><div class="we">${q.e}</div></div>`;

/* ---------- 암기 카드 ---------- */
let FC = null;
function cardsHome() {
  const u = curUnit();
  setAccent(); setBar(`암기 카드 · ${u.no}. ${u.title}`); setTabs('cards'); focusMode(false);
  app.innerHTML = `<div class="ch-title"><h1>암기 카드</h1><p>카드를 눌러 답을 확인하고, 외운 카드만 넘겨요. 모르는 카드는 뒤로 돌아와 다시 나와요.</p></div>
  <div class="pick">
    ${unitChs(u).map(c => `<a class="btn" href="#/f/${c.id}"><span>${c.emo} ${c.title}</span><small>${c.cards.length}장</small></a>`).join('')}
  </div>`;
}
function startFlash(id) {
  const c = chById(id);
  if (!c) return cardsHome();
  setUnit(c.unit);
  setAccent(c); setBar(`${c.emo} ${c.title} 암기 카드`, '#/cards'); focusMode(true);
  FC = { id, c, list: shuffle(c.cards), total: c.cards.length, known: 0, back: false };
  renderFlash();
}
function renderFlash() {
  if (!FC.list.length) {
    app.innerHTML = `<div class="empty"><span>🎉</span><p>${FC.total}장을 모두 외웠어요!</p></div>
    <div class="cta"><a class="btn main" href="#/q/${FC.id}/10">문제로 확인하기</a><button class="btn" data-act="flash-again">카드 다시 보기</button></div>`;
    return;
  }
  const [t, d] = FC.list[0];
  app.innerHTML = `
    <div class="qtop"><span>외운 카드 ${FC.known}/${FC.total}</span><span>남은 카드 ${FC.list.length}</span></div>
    <div class="qmeter"><b style="width:${FC.known / FC.total * 100}%"></b></div>
    <button class="flash ${FC.back ? 'back' : ''}" data-act="flip">
      ${FC.back ? `<span class="fd">${d}</span><small>${t}</small>` : `<span class="ft">${t}</span><small>눌러서 답 확인</small>`}
    </button>
    <div class="btn-row">
      <button class="btn" data-act="flash-later" ${FC.back ? '' : 'disabled'}>🤔 다시 볼래요</button>
      <button class="btn main" data-act="flash-know" ${FC.back ? '' : 'disabled'}>😀 외웠어요</button>
    </div>`;
}

/* ---------- 모의고사 / 오답 ---------- */
function mockHome() {
  const u = curUnit();
  setAccent(); setBar(`단원 모의고사 · ${u.no}. ${u.title}`); setTabs('mock'); focusMode(false);
  const b = store.get(u.mockKey, null);
  const total = unitChs(u).reduce((s, c) => s + QUIZ[c.id].length, 0);
  const n = Object.values(u.mock).reduce((s, v) => s + v, 0);
  app.innerHTML = `<div class="ch-title"><h1>${u.no}. ${u.title} 모의고사</h1><p>전체 ${total}문제 중 ${n}문제를 단원별로 골고루 뽑아요. 풀 때마다 문제가 달라져요.</p></div>
    ${b !== null ? `<p style="font-weight:700">내 최고 점수: ${b}점</p>` : ''}
    <div class="cta"><a class="btn main" href="#/q/mock">시작하기</a></div>`;
}
function wrongHome() {
  const u = curUnit();
  setAccent(); setBar(`오답 노트 · ${u.no}. ${u.title}`); setTabs('wrong'); focusMode(false);
  const ids = wrongIds();
  app.innerHTML = ids.length ? `<div class="ch-title"><h1>${u.no}. ${u.title} 오답 노트</h1><p>틀린 문제가 모여 있어요. 다시 풀어서 맞히면 사라져요.</p></div>
    <div class="cta"><a class="btn main" href="#/q/wrong">${ids.length}문제 다시 풀기</a></div>
    <div class="wlist">${ids.map(id => wrongRow(QBYID[id])).join('')}</div>`
    : `<div class="empty"><span>🌟</span><p>아직 틀린 문제가 없어요.<br>문제를 풀면 틀린 것이 여기에 모여요.</p></div>`;
}

/* ---------- 수능 실전 ---------- */
let X = null;
const NO = ['①', '②', '③', '④', '⑤'];
const GA = 'ㄱㄴㄷㄹ';
function startExam(id) {
  const c = chById(id);
  if (!c || !EXAM[id]) return unitHome();
  setUnit(c.unit);
  setAccent(c); setBar(`${c.emo} ${c.title} 수능 실전`, `#/c/${id}`); setTabs('home'); focusMode(true);
  X = { id, list: EXAM[id], pick: {}, done: false };
  renderExam();
}
// 선택지별 해설. <보기>형은 각 보기의 정오로 오답 이유를 만든다.
function examWhy(q) {
  if (!q.b) return q.o.map((_, i) => `<li${i === q.a ? ' class="ok"' : ''}><b>${NO[i]}</b> ${q.x[i]}</li>`).join('');
  const T = q.b.map((s, i) => s[1] ? GA[i] : '').filter(Boolean);
  const judge = q.b.map((s, i) => `<li${s[1] ? ' class="ok"' : ''}><b>${GA[i]}. ${s[1] ? '옳음' : '틀림'}</b> ${s[2]}</li>`).join('');
  const opts = q.o.map((o, i) => {
    if (i === q.a) return `<li class="ok"><b>${NO[i]} ${o}</b> 정답</li>`;
    const s = o.match(/[ㄱㄴㄷㄹ]/g), bad = s.filter(l => !T.includes(l)), miss = T.filter(l => !s.includes(l));
    return `<li><b>${NO[i]} ${o}</b> ${[bad.length && `${bad.join(', ')}은(는) 틀린 보기`, miss.length && `옳은 보기 ${miss.join(', ')}이(가) 빠짐`].filter(Boolean).join(', ')}</li>`;
  }).join('');
  return judge + opts;
}
function examQ(q, n) {
  const p = X.pick[n], ok = p === q.a;
  const cls = i => !X.done ? (p === i ? 'on' : '') : i === q.a ? 'good' : i === p ? 'bad' : '';
  return `<div class="qcard exq" id="x${n}">
    <p class="qtext"><span class="exno">${n + 1}.</span> ${q.q}</p>
    ${q.d || ''}
    ${q.b ? `<div class="bogi">${q.b.map((s, i) => `<p>${GA[i]}. ${s[0]}</p>`).join('')}</div>` : ''}
    ${q.o.map((o, i) => `<button class="opt ${cls(i)}" data-act="xpick" data-n="${n}" data-i="${i}" ${X.done ? 'disabled' : ''}><span class="no">${NO[i]}</span><span>${o}</span></button>`).join('')}
    ${X.done ? `<div class="fb ${ok ? 'good' : 'bad'}"><b class="h">${ok ? '정답' : p === undefined ? '풀지 않음' : '오답'} · 정답 ${NO[q.a]}</b><div>${q.e}</div><ul class="why">${examWhy(q)}</ul></div>` : ''}
  </div>`;
}
function renderExam() {
  const L = X.list, score = L.filter((q, i) => X.pick[i] === q.a).length, pct = Math.round(score / L.length * 100);
  const head = X.done
    ? `<div class="score"><div class="big">${pct}<small>점</small></div><p>${L.length}문항 중 ${score}문항 정답</p>
       <div class="exsum">${L.map((q, i) => `<button class="${X.pick[i] === q.a ? 'o' : 'x'}" data-act="xjump" data-n="${i}">${i + 1} ${X.pick[i] === q.a ? '○' : '✕'}</button>`).join('')}</div></div>
       <div class="cta"><button class="btn main" data-act="xretry">다시 풀기</button></div>`
    : `<div class="ch-title"><h1>수능 실전 문제</h1><p>자료 해석·개념 통합형 고난도 ${L.length}문항이에요. 모두 고른 뒤 채점하기를 누르세요.</p></div>`;
  app.innerHTML = `<div class="exam">${head}${L.map(examQ).join('')}
    <div class="cta">${X.done
      ? `<button class="btn main" data-act="xretry">다시 풀기</button><a class="btn" href="#/c/${X.id}">단원으로 돌아가기</a>`
      : `<button class="btn main" data-act="xgrade">채점하기 (<span id="xcnt">${Object.keys(X.pick).length}</span>/${L.length} 응답)</button>`}</div></div>`;
  window.scrollTo(0, 0);
}

/* ---------- 이벤트 ---------- */
document.addEventListener('click', e => {
  const k = e.target.closest('.hide-on .k');
  if (k) { k.classList.toggle('show'); }
  const t = e.target.closest('[data-act]');
  if (!t) return;
  const act = t.dataset.act;
  if (act === 'hide') {
    const on = t.getAttribute('aria-pressed') !== 'true';
    t.setAttribute('aria-pressed', on);
    store.set('hide', on);
    $('#lessons').classList.toggle('hide-on', on);
    $$('.k.show').forEach(x => x.classList.remove('show'));
  } else if (act === 'jump') {
    $('#l' + t.dataset.i).scrollIntoView({ behavior: 'smooth' });
  } else if (act === 'read') {
    const read = store.get('read', {});
    read[t.dataset.key] = !read[t.dataset.key];
    store.set('read', read);
    t.classList.toggle('on', read[t.dataset.key]);
    t.textContent = read[t.dataset.key] ? '✓ 공부 완료' : '다 읽었어요';
    $$('.jump button')[+t.dataset.i].classList.toggle('done', read[t.dataset.key]);
  } else if (act === 'mc' && !Q.answered) {
    const q = Q.list[Q.i], oi = +t.dataset.oi, ok = oi === q.a;
    $$('.opt').forEach(b => { b.disabled = true; if (+b.dataset.oi === q.a) b.classList.add('good'); });
    if (!ok) t.classList.add('bad');
    answered(q, ok, q.o[q.a]);
  } else if (act === 'ox' && !Q.answered) {
    const q = Q.list[Q.i], v = t.dataset.v === '1', ok = v === q.a;
    $$('.opt').forEach(b => { b.disabled = true; if ((b.dataset.v === '1') === q.a) b.classList.add('good'); });
    if (!ok) t.classList.add('bad');
    answered(q, ok, q.a ? 'O' : 'X');
  } else if (act === 'ord-pick') {
    Q.picked.push(Q.pool.splice(+t.dataset.n, 1)[0]); renderOrder();
  } else if (act === 'ord-back') {
    Q.pool.push(Q.picked.splice(+t.dataset.n, 1)[0]); renderOrder();
  } else if (act === 'ord-check' && !Q.answered) {
    const q = Q.list[Q.i], ok = Q.picked.join() === q.o.join();
    $$('#ordbox .tok, #ordbox .btn').forEach(b => { b.disabled = true; });
    answered(q, ok, q.o.join(' → '));
  } else if (act === 'self') {
    const q = Q.list[Q.i];
    Q.wrong = Q.wrong.filter(x => x !== q);
    Q.score++;
    updateWrong(q, true);
    t.closest('.fb').className = 'fb good';
    t.closest('.fb').innerHTML = `<b class="h">맞은 걸로 바꿨어요</b><div>${q.e}</div>`;
  } else if (act === 'next') {
    Q.i++; renderQ();
  } else if (act === 'retry') {
    const list = shuffle(Q.wrong);
    startQuiz(Q.mode, Q.ch, list);
  } else if (act === 'again') {
    startQuiz(Q.mode, Q.ch);
  } else if (act === 'flip') {
    FC.back = !FC.back; renderFlash();
  } else if (act === 'flash-later') {
    FC.list.push(FC.list.shift()); FC.back = false; renderFlash();
  } else if (act === 'flash-know') {
    FC.list.shift(); FC.known++; FC.back = false; renderFlash();
  } else if (act === 'flash-again') {
    startFlash(FC.id);
  } else if (act === 'xpick') {
    X.pick[t.dataset.n] = +t.dataset.i;
    $$(`[data-act="xpick"][data-n="${t.dataset.n}"]`).forEach(b => b.classList.toggle('on', b === t));
    $('#xcnt').textContent = Object.keys(X.pick).length;
  } else if (act === 'xgrade') {
    X.done = true;
    const pct = Math.round(X.list.filter((q, i) => X.pick[i] === q.a).length / X.list.length * 100);
    const best = store.get('examBest', {});
    if (best[X.id] === undefined || pct > best[X.id]) { best[X.id] = pct; store.set('examBest', best); }
    renderExam();
  } else if (act === 'xretry') {
    startExam(X.id);
  } else if (act === 'xjump') {
    $('#x' + t.dataset.n).scrollIntoView({ behavior: 'smooth' });
  }
});
document.addEventListener('submit', e => {
  const f = e.target.closest('[data-form="sa"]');
  if (!f) return;
  e.preventDefault();
  if (Q.answered) return;
  const inp = $('#sa'), val = inp.value.trim();
  if (!val) { inp.focus(); return; }
  const q = Q.list[Q.i], ok = q.a.some(a => norm(a) === norm(val));
  inp.disabled = true;
  $('button', f).style.display = 'none';
  inp.blur();
  answered(q, ok, q.a[0], { self: !ok });
});

/* ---------- 라우터 ---------- */
function route() {
  const parts = (location.hash.replace(/^#\/?/, '') || '').split('/').filter(Boolean);
  const [a, b, c] = parts;
  if (a === 'u' && unitById(b)) home(b);
  else if (a === 'c') chapter(b);
  else if (a === 'f') startFlash(b);
  else if (a === 'x') startExam(b);
  else if (a === 'q' && b === 'mock') startQuiz('mock', null);
  else if (a === 'q' && b === 'wrong') {
    if (wrongIds().length) startQuiz('wrong', null);
    else { location.hash = '#/wrong'; return; }
  }
  else if (a === 'q' && chById(b) && QUIZ[b]) startQuiz(c === 'all' ? 'all' : '10', b);
  else if (a === 'cards') cardsHome();
  else if (a === 'mock') mockHome();
  else if (a === 'wrong') wrongHome();
  else unitHome();
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
route();
