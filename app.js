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

// 모든 문제에 고유 번호 붙이기
const QBYID = {};
Object.keys(QUIZ).forEach(ch => QUIZ[ch].forEach((q, i) => { q.id = ch + '-' + i; q.ch = ch; QBYID[q.id] = q; }));
const FIGQ = { villus: () => FIG.villus(true), heart: () => FIG.heart(true), nephronQ: () => FIG.nephron(-1, true) };

const app = $('#app');
const setAccent = c => {
  document.documentElement.style.setProperty('--c', c ? c.color : '#e4791f');
  document.documentElement.style.setProperty('--c-soft', c ? c.soft : '#fff1e2');
};
const wrongIds = () => store.get('wrong', []).filter(id => QBYID[id]);
const setBar = (title, back) => {
  $('#top').innerHTML = `<div class="bar">${back ? `<a class="back" href="${back}" aria-label="뒤로">←</a>` : ''}<strong>${title}</strong></div>`;
};
const setTabs = cur => {
  const n = wrongIds().length;
  const tabs = [['#/', '🏠', '공부', 'home'], ['#/cards', '🃏', '암기 카드', 'cards'], ['#/mock', '📝', '모의고사', 'mock'], ['#/wrong', '❗', '오답 노트', 'wrong']];
  $('#tabs').innerHTML = tabs.map(t => `<a href="${t[0]}" class="${t[3] === cur ? 'on' : ''}"><span>${t[1]}</span>${t[2]}${t[3] === 'wrong' && n ? `<em class="num" style="font-style:normal">${n}</em>` : ''}</a>`).join('');
};
const focusMode = on => document.body.classList.toggle('focus', on);

/* ---------- 홈 ---------- */
function home() {
  setAccent(); setBar('몸속 여행 과학'); setTabs('home'); focusMode(false);
  const read = store.get('read', {}), best = store.get('best', {});
  app.innerHTML = `
  <section class="hero">
    <small>Ⅵ. 동물과 에너지</small>
    <h1>밥 한 숟가락의 <em>몸속 여행</em></h1>
    <p>그림으로 이해하고, 카드로 외우고, 문제로 확인해요.</p>
    <div class="journey"><span>🍚 소화</span><i>→</i><span>🫀 순환</span><i>→</i><span>🫁 호흡</span><i>→</i><span>💧 배설</span></div>
  </section>
  ${CHAPTERS.map(c => {
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
  if (!c) return home();
  setAccent(c); setBar(`${c.emo} ${c.title}`, '#/'); setTabs('home'); focusMode(false);
  const read = store.get('read', {});
  const hide = store.get('hide', false);
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
};

/* ---------- 퀴즈 ---------- */
let Q = null;
function pickList(mode, ch) {
  if (mode === 'wrong') return shuffle(wrongIds().map(id => QBYID[id]));
  if (mode === 'mock') {
    const plan = { digest: 8, circ: 5, resp: 4, excr: 4, all: 1 };
    return shuffle(Object.keys(plan).flatMap(k => shuffle(QUIZ[k]).slice(0, plan[k])));
  }
  const pool = shuffle(QUIZ[ch]);
  return mode === 'all' ? pool : pool.slice(0, 10);
}
function startQuiz(mode, ch, list) {
  const c = ch ? chById(ch) : null;
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
    body = (q.fig ? FIGQ[q.fig]() : '') + `<div style="margin-top:10px">${Q.opts.map((oi, n) => `<button class="opt" data-act="mc" data-oi="${oi}"><span class="no">${n + 1}</span><span>${q.o[oi]}</span></button>`).join('')}</div>`;
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
  if (Q.mode === 'mock') store.set('mockBest', Math.max(pct, store.get('mockBest', 0)));
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
  setAccent(); setBar('암기 카드'); setTabs('cards'); focusMode(false);
  app.innerHTML = `<div class="ch-title"><h1>암기 카드</h1><p>카드를 눌러 답을 확인하고, 외운 카드만 넘겨요. 모르는 카드는 뒤로 돌아와 다시 나와요.</p></div>
  <div class="pick">
    ${CHAPTERS.map(c => `<a class="btn" href="#/f/${c.id}"><span>${c.emo} ${c.title}</span><small>${c.cards.length}장</small></a>`).join('')}
  </div>`;
}
function startFlash(id) {
  const c = chById(id);
  if (!c) return cardsHome();
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
  setAccent(); setBar('단원 모의고사'); setTabs('mock'); focusMode(false);
  const b = store.get('mockBest', null);
  const total = Object.values(QUIZ).reduce((s, a) => s + a.length, 0);
  app.innerHTML = `<div class="ch-title"><h1>단원 모의고사</h1><p>전체 ${total}문제 중 22문제를 단원별로 골고루 뽑아요. 풀 때마다 문제가 달라져요.</p></div>
    ${b !== null ? `<p style="font-weight:700">내 최고 점수: ${b}점</p>` : ''}
    <div class="cta"><a class="btn main" href="#/q/mock">시작하기</a></div>`;
}
function wrongHome() {
  setAccent(); setBar('오답 노트'); setTabs('wrong'); focusMode(false);
  const ids = wrongIds();
  app.innerHTML = ids.length ? `<div class="ch-title"><h1>오답 노트</h1><p>틀린 문제가 모여 있어요. 다시 풀어서 맞히면 사라져요.</p></div>
    <div class="cta"><a class="btn main" href="#/q/wrong">${ids.length}문제 다시 풀기</a></div>
    <div class="wlist">${ids.map(id => wrongRow(QBYID[id])).join('')}</div>`
    : `<div class="empty"><span>🌟</span><p>아직 틀린 문제가 없어요.<br>문제를 풀면 틀린 것이 여기에 모여요.</p></div>`;
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
  if (a === 'c') chapter(b);
  else if (a === 'f') startFlash(b);
  else if (a === 'q' && b === 'mock') startQuiz('mock', null);
  else if (a === 'q' && b === 'wrong') {
    if (wrongIds().length) startQuiz('wrong', null);
    else { location.hash = '#/wrong'; return; }
  }
  else if (a === 'q' && chById(b) && QUIZ[b]) startQuiz(c === 'all' ? 'all' : '10', b);
  else if (a === 'cards') cardsHome();
  else if (a === 'mock') mockHome();
  else if (a === 'wrong') wrongHome();
  else home();
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
route();
