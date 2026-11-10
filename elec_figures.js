// Ⅶ. 전기와 자기 단원 그림. figures.js의 FIG에 덧붙인다.
(() => {
const RD = '#d6392f', BL = '#2b62c4', GR = '#1e9a6a';
const MINUS = '−';
const col = s => s.includes('+') ? RD : s.includes(MINUS) ? BL : '#333';
// 작은 전하 동그라미. s: '+', '−', 'o'(전자가 빠져나간 빈자리)
const chg = (x, y, s, r = 7) => s === 'o'
  ? `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#999" stroke-dasharray="2 2"/>`
  : s ? `<circle cx="${x}" cy="${y}" r="${r}" fill="${s === '+' ? '#fde3e0' : '#e1eafd'}" stroke="${col(s)}" stroke-width="1.5"/><text x="${x}" y="${y + 4}" text-anchor="middle" style="font-size:11px;fill:${col(s)}">${s}</text>` : '';
// 저항 기호(가로 40px). 뒤에 흰 사각형을 깔아 도선을 가린다.
const res = (x, y) => `<rect x="${x}" y="${y - 9}" width="40" height="18" fill="#fff"/><path d="M${x} ${y}l5 -8l10 16l10 -16l10 16l5 -8" fill="none" stroke="#333" stroke-width="2.2" stroke-linejoin="round"/>`;
// 전지 기호. 긴 선이 (+)극(오른쪽)
const cell = (x, y) => `<rect x="${x - 12}" y="${y - 14}" width="24" height="28" fill="#fff"/><path d="M${x - 6} ${y - 9}V${y + 9}" stroke="#333" stroke-width="5"/><path d="M${x + 7} ${y - 17}V${y + 17}" stroke="#333" stroke-width="2.2"/>`;
const meter = (x, y, t) => `<circle cx="${x}" cy="${y}" r="13" fill="#fff" stroke="#333" stroke-width="2"/><text x="${x}" y="${y + 5}" text-anchor="middle">${t}</text>`;
// 막대자석. dir: 'SN'이면 왼쪽 S, 오른쪽 N
const bar = (x, y, w, h, dir) => {
  const [l, r] = dir.split('');
  const c = p => p === 'N' ? RD : BL;
  return `<rect x="${x}" y="${y}" width="${w / 2}" height="${h}" fill="${c(l)}"/><rect x="${x + w / 2}" y="${y}" width="${w / 2}" height="${h}" fill="${c(r)}"/>
    <text class="w" x="${x + w / 4}" y="${y + h / 2 + 5}" text-anchor="middle">${l}</text><text class="w" x="${x + w * 3 / 4}" y="${y + h / 2 + 5}" text-anchor="middle">${r}</text>`;
};
// 왼쪽을 가리키는 작은 화살촉
const headL = (x, y, c) => `<path d="M${x + 5} ${y - 5}L${x - 5} ${y}L${x + 5} ${y + 5}Z" fill="${c}"/>`;
const headR = (x, y, c) => `<path d="M${x - 5} ${y - 5}L${x + 5} ${y}L${x - 5} ${y + 5}Z" fill="${c}"/>`;
const axis = (x0, y0, w, h, yl, xl) => `<path d="M${x0} ${y0 - h}V${y0}H${x0 + w}" fill="none" stroke="#333" stroke-width="1.6" marker-end="url(#ak)"/><path d="M${x0} ${y0 - h + 2}V${y0 - h - 6}" stroke="#333" stroke-width="1.6" marker-end="url(#ak)"/>
  <text class="s" x="${x0 + 4}" y="${y0 - h - 2}">${yl}</text><text class="s" x="${x0 + w}" y="${y0 + 16}" text-anchor="end">${xl}</text><text class="s" x="${x0 - 10}" y="${y0 + 14}">O</text>`;

Object.assign(FIG, {
  // 털가죽과 플라스틱 빨대의 마찰
  rub() {
    const straw = [[['+', MINUS, '+', MINUS, ''], [MINUS, '+', MINUS, '+', '']], [['+', MINUS, '+', MINUS, ''], [MINUS, '+', MINUS, '+', '']], [['+', MINUS, '+', MINUS, MINUS], [MINUS, '+', MINUS, '+', MINUS]]];
    const fur = [[['+', MINUS, '+', MINUS], [MINUS, '+', MINUS, '+']], [['+', MINUS, '+', MINUS], [MINUS, '+', MINUS, '+']], [['+', MINUS, '+', 'o'], ['o', '+', MINUS, '+']]];
    const cap = [['마찰 전', '둘 다 전기를 띠지 않음'], ['마찰할 때', '털가죽 → 빨대로 전자 이동'], ['마찰 후', '빨대 (−), 털가죽 (+)']];
    const panel = (k) => {
      const x = 6 + k * 118;
      let s = `<rect x="${x + 4}" y="12" width="104" height="34" rx="8" fill="#f6d3da" stroke="#c98a96"/>
        <rect x="${x + 14}" y="66" width="84" height="64" rx="8" fill="#c9a074" stroke="#8d6a43"/>`;
      straw[k].forEach((row, j) => row.forEach((c, i) => { s += chg(x + 19 + i * 18.5, 21 + j * 16, c, 6.5); }));
      fur[k].forEach((row, j) => row.forEach((c, i) => { s += chg(x + 29 + i * 18, 84 + j * 28, c); }));
      if (k === 1) s += `<path d="M${x + 112} 100Q${x + 124} 72 ${x + 108} 44" fill="none" stroke="${BL}" stroke-width="2.2" marker-end="url(#ab)"/>`;
      s += `<text x="${x + 56}" y="152" text-anchor="middle">${cap[k][0]}</text><text class="s" x="${x + 56}" y="168" text-anchor="middle">${cap[k][1]}</text>`;
      return s;
    };
    return `<svg class="fig" viewBox="0 0 360 178" role="img" aria-label="털가죽과 플라스틱 빨대를 마찰할 때 전자의 이동">
      ${panel(0)}${panel(1)}${panel(2)}
      <text class="s" x="8" y="62">빨대↑ 털가죽↓</text>
    </svg>`;
  },

  // 정전기 유도. sign: 가까이 가져간 대전체의 전하 '+' 또는 '−'
  induce(sign) {
    const plus = sign === '+';
    const nuc = (plus ? [160, 195, 230, 265, 300] : [130, 165, 200, 235, 270]).map(x => chg(x, 75, '+', 9)).join('');
    const ex = [[122, 52], [122, 75], [122, 98], [140, 58], [140, 92]].map(([x, y]) => chg(plus ? x : 430 - x, y, MINUS, 6)).join('');
    const rodS = [20, 40, 60].map(x => `<text x="${x}" y="66" text-anchor="middle" style="fill:${plus ? RD : BL}">${plus ? '+' : MINUS}</text>`).join('');
    return `<svg class="fig" viewBox="0 0 340 152" role="img" aria-label="${sign} 대전체를 금속 막대에 가까이 할 때 정전기 유도">
      <rect x="6" y="50" width="70" height="22" rx="8" fill="#eee" stroke="#999"/>${rodS}
      <text class="s" x="41" y="92" text-anchor="middle">(${sign})대전체</text>
      <rect x="110" y="40" width="210" height="70" rx="10" fill="#ecebf0" stroke="#777" stroke-width="2"/>
      ${nuc}${ex}
      <text x="130" y="32" text-anchor="middle" style="fill:${plus ? BL : RD}">${plus ? '(−)' : '(+)'}</text>
      <text x="300" y="32" text-anchor="middle" style="fill:${plus ? RD : BL}">${plus ? '(+)' : '(−)'}</text>
      <text class="s" x="215" y="32" text-anchor="middle">금속(도체)</text>
      <path d="M${plus ? '262 126H172' : '172 126H262'}" stroke="${BL}" stroke-width="2.2" marker-end="url(#ab)"/>
      <text class="s b" x="215" y="145" text-anchor="middle">${plus ? '인력 → 전자가 끌려온다' : '척력 → 전자가 밀려난다'}</text>
    </svg>`;
  },

  // 검전기. rod: '+', '−', '0'(대전 안 된 물체), ''(없음) / plate, leaf: 전하 글자 / open: 0 오므림, 1 벌어짐, 2 더 벌어짐
  scope(o = {}) {
    const { rod = '', plate = '', leaf = '', open = 0, hand = false, lab = false } = o;
    const a = [3, 20, 34][open] * Math.PI / 180, L = 46;
    const dx = L * Math.sin(a), ly = 132 + L * Math.cos(a);
    const t = (x, y, s) => s ? `<text x="${x}" y="${y}" text-anchor="middle" style="fill:${col(s)};font-size:15px">${s}</text>` : '';
    let rodS = '';
    if (rod) {
      const c = rod === '0' ? '#999' : col(rod);
      rodS = `<path d="M146 30L196 2" stroke="${rod === '0' ? '#ddd' : '#eee'}" stroke-width="14" stroke-linecap="round"/><path d="M146 30L196 2" stroke="${c}" stroke-width="1.2" fill="none" opacity=".5"/>
        ${rod === '0' ? '' : `${t(162, 25, rod)}${t(180, 15, rod)}`}
        <text class="s" x="206" y="40" text-anchor="end" style="fill:${c}">${rod === '0' ? '대전 안 된 물체' : `(${rod})대전체`}</text>`;
    }
    return `<svg class="fig" viewBox="0 -10 210 222" role="img" aria-label="검전기">
      <path d="M86 84C44 100 38 196 72 204H128C162 196 156 100 114 84Z" fill="#eef6fb" stroke="#9bb3c4" stroke-width="2"/>
      <rect x="84" y="68" width="32" height="18" rx="3" fill="#3b82c4"/>
      <rect x="97" y="44" width="6" height="88" fill="#666"/>
      <rect x="60" y="38" width="80" height="8" rx="3" fill="#555"/>
      <path d="M100 132L${100 - dx} ${ly}M100 132L${100 + dx} ${ly}" stroke="#c79a1e" stroke-width="4" stroke-linecap="round"/>
      ${t(100, 30, plate)}
      ${leaf ? `${t(100 - dx / 2 - 13, (132 + ly) / 2 + 5, leaf)}${t(100 + dx / 2 + 13, (132 + ly) / 2 + 5, leaf)}` : ''}
      ${rodS}
      ${hand ? `<path d="M2 50L58 42" stroke="#f0c09a" stroke-width="13" stroke-linecap="round"/><text class="s" x="4" y="72">손가락</text>` : ''}
      ${lab ? `<text class="s" x="146" y="48">금속판</text><text class="s" x="120" y="112">금속 막대</text><text class="s" x="140" y="186">금속박</text><path d="M138 182L118 166" stroke="#555"/>` : ''}
    </svg>`;
  },

  // 전자의 이동 방향과 전류의 방향
  flow() {
    return `<svg class="fig" viewBox="0 0 340 212" role="img" aria-label="전자의 이동 방향과 전류의 방향">
      <path d="M163 170H60V40H280V170H177" fill="none" stroke="#444" stroke-width="3"/>
      ${cell(170, 170)}
      <circle cx="170" cy="40" r="14" fill="#ffe58a" stroke="#b08a00" stroke-width="2"/><path d="M162 34l16 12M178 34l-16 12" stroke="#b08a00" stroke-width="1.5"/>
      <text class="s" x="150" y="204" text-anchor="end">(−)극</text><text class="s" x="190" y="204">(+)극</text>
      <path d="M296 150V62" stroke="${RD}" stroke-width="2.5" marker-end="url(#ar)"/><path d="M250 22H96" stroke="${RD}" stroke-width="2.5" marker-end="url(#ar)"/><path d="M44 62V150" stroke="${RD}" stroke-width="2.5" marker-end="url(#ar)"/>
      <path d="M76 150V62" stroke="${BL}" stroke-width="2.5" marker-end="url(#ab)"/><path d="M96 58H250" stroke="${BL}" stroke-width="2.5" marker-end="url(#ab)"/><path d="M264 62V150" stroke="${BL}" stroke-width="2.5" marker-end="url(#ab)"/>
      <text x="170" y="100" text-anchor="middle" class="r">전류: (+)극 → 도선 → (−)극</text>
      <text x="170" y="124" text-anchor="middle" class="b">전자: (−)극 → 도선 → (+)극</text>
      <text class="s" x="170" y="146" text-anchor="middle">전류와 전자는 반대 방향!</text>
    </svg>`;
  },

  // 물의 흐름으로 보는 전기 회로
  water() {
    return `<svg class="fig" viewBox="0 0 340 214" role="img" aria-label="물의 흐름과 전기 회로 비유">
      <rect x="20" y="56" width="80" height="56" fill="#9fd3f0" stroke="#5a8fb0" stroke-width="2"/>
      <rect x="236" y="150" width="84" height="40" fill="#9fd3f0" stroke="#5a8fb0" stroke-width="2"/>
      <path d="M100 100H196V128" fill="none" stroke="#7aa9c9" stroke-width="8"/>
      <path d="M100 100H190" stroke="${BL}" stroke-width="1.8" marker-end="url(#ab)"/>
      <circle cx="138" cy="100" r="8" fill="#fff" stroke="#333" stroke-width="2"/><path d="M132 94l12 12" stroke="#333" stroke-width="2"/>
      <circle cx="214" cy="140" r="17" fill="#e3c08f" stroke="#8d6a43" stroke-width="2"/><path d="M214 123V157M197 140H231M202 128l24 24M226 128l-24 24" stroke="#8d6a43" stroke-width="1.5"/>
      <path d="M320 166H330V22H60V56" fill="none" stroke="#7aa9c9" stroke-width="8"/>
      <circle cx="200" cy="22" r="15" fill="#d9d4c3" stroke="#555" stroke-width="2"/><text x="200" y="27" text-anchor="middle">P</text>
      <path d="M60 64V146" stroke="#555" stroke-dasharray="4 3"/><path d="M14 150H236" stroke="#999" stroke-dasharray="4 3"/>
      <text class="s" x="200" y="52" text-anchor="middle">펌프 = 전지</text>
      <text class="s" x="138" y="122" text-anchor="middle">밸브 = 스위치</text>
      <text class="s" x="214" y="174" text-anchor="end">물레방아 = 전구</text>
      <text class="s" x="290" y="38" text-anchor="end">수도관 = 전선</text>
      <text class="s b" x="150" y="90" text-anchor="middle">물의 흐름 = 전류</text>
      <text class="s r" x="66" y="134">높이 차</text><text class="s r" x="66" y="146">= 전압</text>
      <text class="s" x="170" y="208" text-anchor="middle">물의 높이 차(수압)가 클수록 물이 세게 흐르듯, 전압이 클수록 전류가 세다</text>
    </svg>`;
  },

  // 도선의 길이·단면적과 저항
  wire() {
    const cyl = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="#d9a46b" stroke="#8d6a43" stroke-width="1.5"/><ellipse cx="${x + h / 4}" cy="${y + h / 2}" rx="${h / 4}" ry="${h / 2}" fill="#b07a42"/>`;
    return `<svg class="fig" viewBox="0 0 340 196" role="img" aria-label="도선의 길이와 단면적에 따른 저항">
      ${cyl(20, 30, 70, 24)}<text class="s" x="55" y="22" text-anchor="middle">길이 l</text><text x="55" y="74" text-anchor="middle">10 Ω</text>
      <path d="M104 42H156" stroke="#333" stroke-width="2" marker-end="url(#ak)"/><text class="s" x="130" y="34" text-anchor="middle">길이 2배</text>
      ${cyl(170, 30, 140, 24)}<text class="s" x="240" y="22" text-anchor="middle">길이 2l</text><text x="240" y="74" text-anchor="middle" class="r">20 Ω (2배)</text>
      ${cyl(20, 118, 70, 24)}<text class="s" x="55" y="110" text-anchor="middle">단면적 S</text><text x="55" y="162" text-anchor="middle">10 Ω</text>
      <path d="M104 130H156" stroke="#333" stroke-width="2" marker-end="url(#ak)"/><text class="s" x="130" y="122" text-anchor="middle">단면적 2배</text>
      ${cyl(180, 108, 70, 44)}<text class="s" x="215" y="102" text-anchor="middle">단면적 2S</text><text x="215" y="172" text-anchor="middle" class="b">5 Ω (1/2배)</text>
      <text class="s" x="170" y="192" text-anchor="middle">저항은 길이에 비례, 단면적에 반비례</text>
    </svg>`;
  },

  // 옴의 법칙 그래프: 전압-전류 그래프(기울기 = 저항)
  ohmVI() {
    return `<svg class="fig" viewBox="0 0 220 200" role="img" aria-label="전압-전류 그래프">
      ${axis(36, 170, 170, 150, '전압(V)', '전류(A)')}
      <path d="M36 80H120V170M36 110H120" fill="none" stroke="#777" stroke-dasharray="4 3"/>
      <text class="s" x="28" y="84" text-anchor="end">3</text><text class="s" x="28" y="114" text-anchor="end">2</text>
      <path d="M36 170L176 20" stroke="${RD}" stroke-width="2.5"/><path d="M36 170L176 70" stroke="${GR}" stroke-width="2.5"/>
      <text x="182" y="26" class="r">A</text><text x="182" y="74" style="fill:${GR}">B</text>
    </svg>`;
  },
  // 전류-전압 그래프(기울기 = 1/저항)
  ohmIV() {
    return `<svg class="fig" viewBox="0 0 220 200" role="img" aria-label="전류-전압 그래프">
      ${axis(36, 170, 170, 150, '전류(A)', '전압(V)')}
      <path d="M36 80H120V170M36 110H120" fill="none" stroke="#777" stroke-dasharray="4 3"/>
      <text class="s" x="28" y="84" text-anchor="end">3</text><text class="s" x="28" y="114" text-anchor="end">2</text>
      <path d="M36 170L176 20" stroke="${BL}" stroke-width="2.5"/><path d="M36 170L176 70" stroke="#d9822b" stroke-width="2.5"/>
      <text x="182" y="26" class="b">C</text><text x="182" y="74" style="fill:#b56a12">D</text>
    </svg>`;
  },
  // 전압이 일정할 때 전류-저항 그래프(반비례)
  ohmInv() {
    const pts = [];
    for (let r = 0.8; r <= 3.21; r += 0.1) pts.push(`${(36 + 50 * r).toFixed(1)},${(170 - 30 * 4 / r).toFixed(1)}`);
    return `<svg class="fig" viewBox="0 0 220 200" role="img" aria-label="전류-저항 그래프">
      ${axis(36, 170, 170, 150, '전류(A)', '저항(Ω)')}
      <path d="M36 50H86V170M36 110H136V170" fill="none" stroke="#777" stroke-dasharray="4 3"/>
      <text class="s" x="28" y="54" text-anchor="end">4</text><text class="s" x="28" y="114" text-anchor="end">2</text>
      <text class="s" x="86" y="184" text-anchor="middle">1</text><text class="s" x="136" y="184" text-anchor="middle">2</text>
      <polyline points="${pts.join(' ')}" fill="none" stroke="#a14a8b" stroke-width="2.5"/>
      <text class="s" x="200" y="40" text-anchor="end">전압 일정</text>
    </svg>`;
  },

  // 저항의 직렬·병렬 연결 회로. kind: 'series' | 'parallel'
  circuit(kind) {
    if (kind === 'parallel') {
      return `<svg class="fig" viewBox="0 0 340 212" role="img" aria-label="저항의 병렬연결 회로">
        <path d="M163 178H50V75H90M250 75H290V178H177M90 40V110H250V40ZM90 40H250" fill="none" stroke="#444" stroke-width="2.5"/>
        ${res(150, 40)}${res(150, 110)}${cell(170, 178)}${meter(290, 130, 'A')}
        <text x="170" y="26" text-anchor="middle">R₁</text><text class="s r" x="170" y="64" text-anchor="middle">I₁ = V / R₁</text>
        <text x="170" y="96" text-anchor="middle">R₂</text><text class="s r" x="170" y="134" text-anchor="middle">I₂ = V / R₂</text>
        <text class="s" x="170" y="206" text-anchor="middle">V = V₁ = V₂ · I = I₁ + I₂</text>
        <text class="s" x="312" y="110">I</text>
      </svg>`;
    }
    return `<svg class="fig" viewBox="0 0 340 212" role="img" aria-label="저항의 직렬연결 회로">
      <path d="M163 170H60V60H280V170H177" fill="none" stroke="#444" stroke-width="2.5"/>
      ${res(95, 60)}${res(205, 60)}${cell(170, 170)}${meter(280, 115, 'A')}
      <text x="115" y="44" text-anchor="middle">R₁</text><text x="225" y="44" text-anchor="middle">R₂</text>
      <path d="M95 22H135M205 22H245" stroke="#777"/><text class="s b" x="115" y="17" text-anchor="middle">V₁ = I·R₁</text><text class="s b" x="225" y="17" text-anchor="middle">V₂ = I·R₂</text>
      <text class="s r" x="170" y="88" text-anchor="middle">전류 I는 어디서나 같다</text>
      <text class="s" x="170" y="204" text-anchor="middle">V = V₁ + V₂ · I = I₁ = I₂</text>
    </svg>`;
  },

  // 직렬과 병렬이 섞인 회로. r: [R₁, 위 가지, 아래 가지] 저항값, v: 전원 전압
  mixed(r = [2, 6, 3], v = 12) {
    return `<svg class="fig" viewBox="0 0 340 200" role="img" aria-label="직렬과 병렬이 섞인 회로">
      <path d="M163 170H40V65H170M170 35V95H290V35ZM170 35H290M290 65H310V170H177" fill="none" stroke="#444" stroke-width="2.5"/>
      ${res(80, 65)}${res(210, 35)}${res(210, 95)}${cell(170, 170)}
      <text x="100" y="50" text-anchor="middle">R₁ = ${r[0]} Ω</text>
      <text x="230" y="22" text-anchor="middle">R₂ = ${r[1]} Ω</text><text x="230" y="122" text-anchor="middle">R₃ = ${r[2]} Ω</text>
      <text x="170" y="196" text-anchor="middle">전원 전압 ${v} V</text>
    </svg>`;
  },

  // 막대자석 주위의 자기력선
  // q: 문제용(답이 되는 설명 글을 숨긴다)
  magField(q) {
    let s = '';
    for (let k = 1; k <= 3; k++) {
      const up = 108 - 26.25 * k, dn = 132 + 26.25 * k;
      s += `<path d="M215 108C${215 + 40 * k} ${108 - 35 * k} ${125 - 40 * k} ${108 - 35 * k} 125 108M215 132C${215 + 40 * k} ${132 + 35 * k} ${125 - 40 * k} ${132 + 35 * k} 125 132" fill="none" stroke="${GR}" stroke-width="1.6"/>`;
      s += headL(170, up, GR) + headL(170, dn, GR);
    }
    return `<svg class="fig" viewBox="0 0 340 240" role="img" aria-label="막대자석 주위의 자기력선">
      ${s}
      <path d="M222 120H322" stroke="${GR}" stroke-width="1.6" marker-end="url(#ag)"/><path d="M18 120H118" stroke="${GR}" stroke-width="1.6" marker-end="url(#ag)"/>
      ${bar(120, 108, 100, 24, 'SN')}
      <path d="M134 120H206" stroke="#fff" stroke-width="1.5" marker-end="url(#ak)" opacity=".8"/>
      ${q ? '' : `<text class="s" x="18" y="22">자기력선: N극에서 나와 S극으로</text>
      <text class="s" x="332" y="58" text-anchor="end">극 근처</text><text class="s" x="332" y="74" text-anchor="end">= 촘촘 = 세다</text>
      <text class="s" x="170" y="236" text-anchor="middle">자석 내부에서는 S극 → N극</text>`}
    </svg>`;
  },

  // 두 자석 사이의 자기력선(척력·인력)
  poles() {
    const row = (y, l, r, kind) => {
      let s = bar(20, y + 26, 90, 24, l) + bar(230, y + 26, 90, 24, r);
      if (kind === 'attract') {
        s += [30, 38, 46].map(d => `<path d="M112 ${y + d}H228" stroke="${GR}" stroke-width="1.4"/>`).join('') +
          `<path d="M112 ${y + 30}C150 ${y + 6} 190 ${y + 6} 228 ${y + 30}M112 ${y + 46}C150 ${y + 70} 190 ${y + 70} 228 ${y + 46}" fill="none" stroke="${GR}" stroke-width="1.4"/>` +
          headR(170, y + 38, GR) + headR(170, y + 13, GR) + headR(170, y + 63, GR) +
          `<text x="170" y="${y + 96}" text-anchor="middle" class="r">인력: 다른 극끼리 서로 당긴다</text>`;
      } else {
        const out = l[1] === 'N';
        s += [-1, 1].map(sg => `<path d="M112 ${y + 38 + 6 * sg}C150 ${y + 38 + 6 * sg} 158 ${y + 38 + 30 * sg} 162 ${y + 38 + 40 * sg}M228 ${y + 38 + 6 * sg}C190 ${y + 38 + 6 * sg} 182 ${y + 38 + 30 * sg} 178 ${y + 38 + 40 * sg}" fill="none" stroke="${GR}" stroke-width="1.4"/>`).join('') +
          (out ? headR(138, y + 32, GR) + headL(202, y + 32, GR) : headL(138, y + 32, GR) + headR(202, y + 32, GR)) +
          `<text x="170" y="${y + 96}" text-anchor="middle" class="b">척력: 같은 극끼리 서로 밀어낸다</text>`;
      }
      return s;
    };
    return `<svg class="fig" viewBox="0 0 340 318" role="img" aria-label="두 자석 사이의 자기력선">
      ${row(0, 'SN', 'NS', 'repel')}${row(106, 'NS', 'SN', 'repel')}${row(212, 'SN', 'SN', 'attract')}
    </svg>`;
  },

  // 지구는 커다란 자석
  // q: 문제용(자석의 극과 설명 글을 숨긴다)
  earth(q) {
    return `<svg class="fig" viewBox="0 0 220 210" role="img" aria-label="지구 자기장" style="max-width:260px">
      <circle cx="110" cy="105" r="80" fill="#e6f2ff" stroke="#5a8fb0" stroke-width="2"/>
      ${q ? `<rect x="98" y="55" width="24" height="100" fill="#999"/><text class="w" x="110" y="85" text-anchor="middle">?</text><text class="w" x="110" y="135" text-anchor="middle">?</text>`
    : `<rect x="98" y="55" width="24" height="50" fill="${BL}"/><rect x="98" y="105" width="24" height="50" fill="${RD}"/>
      <text class="w" x="110" y="85" text-anchor="middle">S</text><text class="w" x="110" y="135" text-anchor="middle">N</text>`}
      <path d="M122 150C200 170 200 40 124 58" fill="none" stroke="${GR}" stroke-width="1.6" marker-end="url(#ag)"/><path d="M98 150C20 170 20 40 96 58" fill="none" stroke="${GR}" stroke-width="1.6" marker-end="url(#ag)"/>
      <text x="110" y="18" text-anchor="middle">북극</text><text x="110" y="204" text-anchor="middle">남극</text>
      ${q ? '' : `<text class="s r" x="214" y="40" text-anchor="end">나침반 N극이</text><text class="s r" x="214" y="54" text-anchor="end">북쪽을 가리킴</text>`}
    </svg>`;
  },

  // 전류가 흐르는 코일(전자석). rev: 전류 방향을 반대로, q: 문제용(극·자기장·설명 글을 숨기고 전류만 보여 준다)
  coil(rev, q) {
    let s = '';
    for (let k = 0; k < 7; k++) {
      const x = 104 + 22 * k;
      s += `<ellipse cx="${x}" cy="95" rx="9" ry="34" fill="none" stroke="#e0b98c" stroke-width="2" stroke-dasharray="3 3"/>`;
      s += `<path d="M${rev ? x - 5 : x + 5} ${rev ? 127 : 63}L${rev ? x + 5 : x - 5} ${rev ? 63 : 127}" stroke="#c47a2c" stroke-width="3.2" marker-end="url(#ar)"/>`;
    }
    const n = rev ? 'left' : 'right';
    const L = rev ? 'N' : 'S', R = rev ? 'S' : 'N';
    const inner = rev ? 'M250 95H92' : 'M92 95H250';
    if (q) {
      return `<svg class="fig" viewBox="0 48 340 122" role="img" aria-label="전류가 흐르는 코일">
        <path d="M92 95H250" stroke="#c9c9c9" stroke-width="1.5" stroke-dasharray="4 4"/>
        ${s}
        <text x="58" y="101" text-anchor="middle">(왼쪽)</text><text x="290" y="101" text-anchor="middle">(오른쪽)</text>
        <text class="s r" x="170" y="160" text-anchor="middle">빨간 화살표 = 앞쪽 도선의 전류 방향</text>
      </svg>`;
    }
    return `<svg class="fig" viewBox="0 0 340 214" role="img" aria-label="코일 주위의 자기장">
      <path d="${inner}" stroke="${BL}" stroke-width="2.2" marker-end="url(#ab)"/>
      <path d="${rev ? 'M250 82H92M250 108H92' : 'M92 82H250M92 108H250'}" stroke="${BL}" stroke-width="1.2" opacity=".6"/>
      ${s}
      <path d="M${rev ? 92 : 254} 60C${rev ? 40 : 300} 10 ${rev ? 300 : 40} 10 ${rev ? 254 : 92} 60" fill="none" stroke="${GR}" stroke-width="1.6" marker-end="url(#ag)"/>
      <path d="M${rev ? 92 : 254} 130C${rev ? 40 : 300} 180 ${rev ? 300 : 40} 180 ${rev ? 254 : 92} 130" fill="none" stroke="${GR}" stroke-width="1.6" marker-end="url(#ag)"/>
      <text x="76" y="101" text-anchor="middle" style="font-size:20px;fill:${L === 'N' ? RD : BL}">${L}</text>
      <text x="268" y="101" text-anchor="middle" style="font-size:20px;fill:${R === 'N' ? RD : BL}">${R}</text>
      <text class="s r" x="170" y="160" text-anchor="middle">빨간 화살표 = 앞쪽 도선의 전류 방향</text>
      <text class="s" x="170" y="184" text-anchor="middle">오른손 네 손가락을 전류 방향으로 감아쥐면</text>
      <text class="s" x="170" y="200" text-anchor="middle">엄지가 가리키는 쪽(${n === 'right' ? '오른쪽' : '왼쪽'})이 N극</text>
    </svg>`;
  },

  // 전동기의 원리(코일을 옆에서 본 단면)
  motor() {
    return `<svg class="fig" viewBox="0 0 340 214" role="img" aria-label="전동기의 원리">
      <rect x="8" y="36" width="60" height="118" rx="4" fill="${RD}"/><text class="w" x="38" y="102" text-anchor="middle" style="font-size:22px">N</text>
      <rect x="272" y="36" width="60" height="118" rx="4" fill="${BL}"/><text class="w" x="302" y="102" text-anchor="middle" style="font-size:22px">S</text>
      ${[56, 95, 134].map(y => `<path d="M74 ${y}H266" stroke="#999" stroke-dasharray="5 4" marker-end="url(#ak)"/>`).join('')}
      <text class="s" x="170" y="30" text-anchor="middle">자기장: N극 → S극</text>
      <path d="M118 95H222" stroke="#c47a2c" stroke-width="4"/>
      <circle cx="112" cy="95" r="12" fill="#fff" stroke="#333" stroke-width="2"/><path d="M104 87l16 16M120 87l-16 16" stroke="#333" stroke-width="2"/>
      <circle cx="228" cy="95" r="12" fill="#fff" stroke="#333" stroke-width="2"/><circle cx="228" cy="95" r="3.5" fill="#333"/>
      <path d="M112 110V150" stroke="${GR}" stroke-width="3" marker-end="url(#ag)"/><text class="s" x="118" y="148" style="fill:${GR}">힘</text>
      <path d="M228 80V40" stroke="${GR}" stroke-width="3" marker-end="url(#ag)"/><text class="s" x="234" y="48" style="fill:${GR}">힘</text>
      <path d="M140 150A62 62 0 0 0 200 150" fill="none" stroke="#a14a8b" stroke-width="2" marker-end="url(#ak)"/>
      <text class="s" x="170" y="172" text-anchor="middle" style="fill:#a14a8b">회전</text>
      <text class="s" x="8" y="190">⊗ 전류가 종이 안으로 들어감</text><text class="s" x="8" y="206">⊙ 전류가 종이 밖으로 나옴</text>
      <text class="s" x="332" y="206" text-anchor="end">양쪽 힘이 반대 → 코일 회전</text>
    </svg>`;
  },
});
})();
