// 수능 실전 문제(exam.js, elec_exam.js) 검증: node check_exam.js
// (Node가 없으면 index.html과 같은 순서로 데이터 파일을 불러온 다음에 이 파일을 브라우저에서 불러와도 같은 검사를 한다.)
(() => {
const isNode = typeof window === 'undefined';
const log = isNode ? console.log : s => document.body.insertAdjacentText('beforeend', s + '\n');
let data;
if (isNode) {
  const fs = require('fs'), vm = require('vm'), path = require('path');
  const ctx = vm.createContext({});
  for (const f of ['figures.js', 'content.js', 'exam.js', 'elec_figures.js', 'elec_content.js', 'elec_exam.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, f), 'utf8'), ctx, { filename: f });
  data = vm.runInContext('({ CHAPTERS, EXAM })', ctx);
} else data = { CHAPTERS, EXAM };
const { CHAPTERS: chapters, EXAM: exam } = data;

const errors = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const strip = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const letters = o => (o.match(/[ㄱㄴㄷㄹ]/g) || []).sort().join('');
const seen = new Map();

const ids = chapters.map(c => c.id);
for (const k of Object.keys(exam)) if (!ids.includes(k)) err(k, 'content.js에 없는 단원');

for (const id of ids) {
  const list = exam[id];
  if (!Array.isArray(list)) { err(id, '문항 없음'); continue; }
  if (list.length !== 10) err(id, `문항 수 ${list.length}개 (10개여야 함)`);
  list.forEach((q, n) => {
    const w = `${id} ${n + 1}번`;
    if (!q.q || !q.e) err(w, '발문 또는 해설 없음');
    if (!Array.isArray(q.o) || q.o.length !== 5) err(w, '선택지가 5개가 아님');
    if (!Number.isInteger(q.a) || q.a < 0 || q.a >= q.o.length) err(w, `정답 인덱스 ${q.a} 유효하지 않음`);
    if (new Set(q.o.map(strip)).size !== q.o.length) err(w, '선택지 중복');
    const key = strip(q.q + (q.d || '') + (q.b || []).map(s => s[0]).join());
    if (seen.has(key)) err(w, `${seen.get(key)}와 문항 중복`); else seen.set(key, w);
    if (q.b) {
      // <보기>형: 옳은 보기 집합이 정답 선택지와 같고, 다른 선택지와는 달라야 정답이 하나만 성립
      if (q.b.length < 3 || q.b.some(s => typeof s[0] !== 'string' || typeof s[1] !== 'boolean' || !s[2])) err(w, '<보기> 형식 오류');
      const truth = q.b.map((s, i) => s[1] ? 'ㄱㄴㄷㄹ'[i] : '').join('');
      const sets = q.o.map(letters);
      if (sets.some(s => !s)) err(w, '<보기>형 선택지에 기호 없음');
      if (sets[q.a] !== truth) err(w, `정답 ${q.o[q.a]} ≠ 옳은 보기 ${truth.split('').join(', ') || '없음'}`);
      if (sets.filter(s => s === truth).length !== 1) err(w, '옳은 보기 조합과 같은 선택지가 하나가 아님');
      if (q.x) err(w, '<보기>형인데 x가 있음');
    } else if (!Array.isArray(q.x) || q.x.length !== q.o.length || q.x.some(s => !s)) err(w, '선택지별 해설(x)이 5개가 아님');
  });
  log(`${id.padEnd(7)} ${list.length}문항  정답 분포 ${list.map(q => q.a + 1).join(' ')}`);
}

if (errors.length) { log(`\n실패 ${errors.length}건`); errors.forEach(e => log(' - ' + e)); if (isNode) process.exitCode = 1; return; }
log(`\n통과: ${ids.length}개 단원, 총 ${ids.reduce((s, id) => s + exam[id].length, 0)}문항`);
})();
