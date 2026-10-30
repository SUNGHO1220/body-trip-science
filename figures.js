// 직접 그린 SVG 그림 모음. 눌러 볼 수 있는 부분은 class="tap" data-o="이름" 으로 표시한다.
const FIG = {
  digest() {
    const T = '#e8735c', T2 = '#c9553f', G = '#3f9a6e';
    return `<svg class="fig" viewBox="0 0 340 425" role="img" aria-label="사람의 소화 기관 그림">
    <g fill="#fbe6d8">
      <ellipse cx="170" cy="50" rx="38" ry="42"/>
      <rect x="152" y="86" width="36" height="26"/>
      <path d="M92 132Q92 108 130 106H210Q248 108 248 132L238 420H102Z"/>
    </g>
    <g class="tap" data-o="침샘">
      <ellipse cx="147" cy="78" rx="9" ry="6" fill="${G}"/>
      <path d="M138 78H66" stroke="#555" fill="none"/><text x="24" y="83">침샘</text>
    </g>
    <g class="tap" data-o="입">
      <path d="M150 58Q170 74 190 58Q170 52 150 58Z" fill="${T2}"/>
      <path d="M190 62H272" stroke="#555" fill="none"/><text x="276" y="67">입</text>
    </g>
    <g class="tap" data-o="식도">
      <path d="M170 70V128Q170 148 186 157" stroke="${T}" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M174 118H272" stroke="#555" fill="none"/><text x="276" y="123">식도</text>
    </g>
    <g class="tap" data-o="소장">
      <path d="M170 212Q150 225 150 262H192Q202 262 202 272T192 282H150Q140 282 140 292T150 302H192Q202 302 202 312T192 322H150Q140 322 140 332T150 342H128" stroke="#ef9a7f" stroke-width="9" fill="none" stroke-linejoin="round"/>
      <path d="M196 302H272" stroke="#555" fill="none"/><text x="276" y="307">소장</text>
    </g>
    <g class="tap" data-o="대장">
      <path d="M122 345V264Q122 248 138 248H204Q220 248 220 264V338Q220 356 200 360L178 368V392" stroke="${T2}" stroke-width="13" fill="none" stroke-linejoin="round"/>
      <path d="M116 300H68" stroke="#555" fill="none"/><text x="24" y="305">대장</text>
    </g>
    <g class="tap" data-o="위">
      <path d="M182 152C205 140 234 152 232 180C230 208 200 222 174 214C164 208 172 198 182 196C196 192 198 176 184 168C178 164 176 156 182 152Z" fill="${T}"/>
      <path d="M230 175H272" stroke="#555" fill="none"/><text x="276" y="180">위</text>
    </g>
    <g class="tap" data-o="간">
      <path d="M100 150C120 138 164 140 172 156C170 178 140 196 112 194C100 192 94 170 100 150Z" fill="${G}"/>
      <path d="M102 168H62" stroke="#555" fill="none"/><text x="38" y="173">간</text>
    </g>
    <g class="tap" data-o="쓸개">
      <ellipse cx="146" cy="203" rx="9" ry="13" fill="#9ccb46"/>
      <path d="M138 210H68" stroke="#555" fill="none"/><text x="24" y="215">쓸개</text>
    </g>
    <g class="tap" data-o="이자">
      <path d="M152 222Q190 212 224 222Q228 232 214 235Q185 231 158 239Q147 233 152 222Z" fill="#59b58a"/>
      <path d="M224 229H272" stroke="#555" fill="none"/><text x="276" y="234">이자</text>
    </g>
    <g class="tap" data-o="항문">
      <circle cx="178" cy="398" r="6" fill="${T2}"/>
      <path d="M184 398H272" stroke="#555" fill="none"/><text x="276" y="403">항문</text>
    </g>
    </svg>`;
  },

  cellophane() {
    const beaker = (x, name, fill, ok) => `
      <path d="M${x} 30V150Q${x} 162 ${x + 12} 162H${x + 118}Q${x + 130} 162 ${x + 130} 150V30" fill="none" stroke="#444" stroke-width="2.5"/>
      <path d="M${x + 2} 58V150Q${x + 2} 160 ${x + 12} 160H${x + 118}Q${x + 128} 160 ${x + 128} 150V58Z" fill="#dff1fb"/>
      <path d="M${x + 65} 42L${x + 51} 28H${x + 79}Z" fill="none" stroke="#555" stroke-width="2"/>
      <circle cx="${x + 65}" cy="86" r="${ok ? 32 : 32}" fill="${fill}" stroke="#777" stroke-width="2" stroke-dasharray="5 3"/>
      <text x="${x + 65}" y="91" text-anchor="middle">${name}</text>
      <path d="M${x + 65} 119V144" stroke="${ok ? '#1e9a6a' : '#d6392f'}" stroke-width="2.5" marker-end="url(#${ok ? 'ag' : 'ar'})"/>
      ${ok ? `<circle cx="${x + 92}" cy="146" r="4" fill="#d9822b"/><circle cx="${x + 36}" cy="142" r="4" fill="#d9822b"/><circle cx="${x + 103}" cy="124" r="4" fill="#d9822b"/>`
           : `<path d="M${x + 57} 124L${x + 73} 140M${x + 73} 124L${x + 57} 140" stroke="#d6392f" stroke-width="3"/>`}`;
    return `<svg class="fig" viewBox="0 0 340 225" role="img" aria-label="셀로판 주머니 실험">
      ${beaker(14, '녹말', '#efeaff', false)}${beaker(196, '포도당', '#fff0dc', true)}
      <text x="79" y="182" text-anchor="middle" class="s">비커 물에 아이오딘 반응 X</text>
      <text x="79" y="200" text-anchor="middle" class="r">녹말은 못 나감</text>
      <text x="261" y="182" text-anchor="middle" class="s">비커 물에 베네딕트 반응 O</text>
      <text x="261" y="200" text-anchor="middle" style="fill:#16895c">포도당은 나감</text>
      <text x="170" y="22" text-anchor="middle" class="s">점선 = 셀로판 주머니(세포막 역할)</text>
    </svg>`;
  },

  villus(q) {
    const A = q ? 'A' : '모세 혈관', B = q ? 'B' : '암죽관';
    return `<svg class="fig" viewBox="0 0 340 262" role="img" aria-label="융털 단면 그림">
      <path d="M92 250V70C92 22 188 22 188 70V250Z" fill="#f4b9a7" stroke="#b8664e" stroke-width="2.5"/>
      <path d="M128 250V82C128 62 152 62 152 82V250Z" fill="#ffe16b" stroke="#c9a51c" stroke-width="1.5"/>
      <path d="M112 250V80C112 40 168 40 168 80V250" fill="none" stroke="url(#vb)" stroke-width="6"/>
      <linearGradient id="vb" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#2b62c4"/><stop offset="1" stop-color="#d6392f"/></linearGradient>
      <path d="M112 110Q130 122 150 110T168 110M112 165Q130 177 150 165T168 165" fill="none" stroke="#a14a8b" stroke-width="2.5"/>
      <path d="M260 92H174" stroke="#333" stroke-width="1.5" marker-end="url(#ak)"/>
      <text x="266" y="97" ${q ? 'style="font-size:20px"' : ''}>${A}</text>
      <path d="M260 208H150" stroke="#333" stroke-width="1.5" marker-end="url(#ak)"/>
      <text x="266" y="213" ${q ? 'style="font-size:20px"' : ''}>${B}</text>
      ${q ? '' : `<text x="14" y="86" class="s">영양소가</text><text x="14" y="102" class="s">융털 안으로</text>
      <path d="M50 112L90 124" stroke="#e4791f" stroke-width="2.5" marker-end="url(#ao)"/>
      <text x="262" y="117" class="s b">수용성 양분</text><text x="262" y="233" class="s" style="fill:#99780a">지용성 양분</text>`}
    </svg>`;
  },

  heart(q) {
    const L = q ? { ra: 'A', rv: 'B', la: 'C', lv: 'D' } : { ra: '우심방', rv: '우심실', la: '좌심방', lv: '좌심실' };
    const big = q ? 'style="font-size:21px;fill:#fff"' : '';
    return `<svg class="fig" viewBox="0 0 340 290" role="img" aria-label="심장의 네 개 방과 연결된 혈관">
      <rect x="88" y="88" width="164" height="190" rx="28" fill="#eca99c" stroke="#a9544a" stroke-width="2"/>
      <g class="tap" data-o="대정맥">
        <path d="M14 127H94" stroke="#2b62c4" stroke-width="11" fill="none" marker-end="url(#AB)"/>
        <text x="12" y="112">${q ? '' : '대정맥'}</text>
        ${q ? '' : '<text x="12" y="150" class="s">온몸에서</text>'}
      </g>
      <g class="tap" data-o="폐정맥">
        <path d="M326 127H250" stroke="#d6392f" stroke-width="11" fill="none" marker-end="url(#AR)"/>
        <text x="272" y="112">${q ? '' : '폐정맥'}</text>
        ${q ? '' : '<text x="272" y="150" class="s">폐에서</text>'}
      </g>
      <g class="tap" data-o="우심방"><rect x="98" y="98" width="52" height="60" rx="10" fill="#2b62c4"/><text x="124" y="133" text-anchor="middle" class="w" ${big}>${L.ra}</text></g>
      <g class="tap" data-o="좌심방"><rect x="194" y="98" width="48" height="60" rx="10" fill="#d6392f"/><text x="218" y="133" text-anchor="middle" class="w" ${big}>${L.la}</text></g>
      <g class="tap" data-o="우심실"><rect x="98" y="180" width="70" height="86" rx="12" fill="#2b62c4"/><text x="131" y="228" text-anchor="middle" class="w" ${big}>${L.rv}</text></g>
      <g class="tap" data-o="좌심실"><rect x="180" y="192" width="54" height="66" rx="10" fill="#d6392f"/><text x="207" y="230" text-anchor="middle" class="w" ${big}>${L.lv}</text></g>
      <g class="tap" data-o="폐동맥">
        <path d="M160 186V70Q160 48 138 48H112" stroke="#2b62c4" stroke-width="11" fill="none" marker-end="url(#AB)"/>
        <text x="30" y="40">${q ? '' : '폐동맥'}</text>${q ? '' : '<text x="30" y="58" class="s">폐로</text>'}
      </g>
      <g class="tap" data-o="대동맥">
        <path d="M184 198V70Q184 48 206 48H232" stroke="#d6392f" stroke-width="11" fill="none" marker-end="url(#AR)"/>
        <text x="256" y="40">${q ? '' : '대동맥'}</text>${q ? '' : '<text x="256" y="58" class="s">온몸으로</text>'}
      </g>
      <g class="tap" data-o="판막" fill="#fff" stroke="#23262d" stroke-width="1.5">
        <path d="M112 158L124 176L136 158Z"/><path d="M206 158L218 176L230 158Z"/>
        <path d="M153 172L160 162L167 172Z"/><path d="M177 172L184 162L191 172Z"/>
      </g>
    </svg>`;
  },

  vessels() {
    const a = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="#d6392f"/><circle cx="50" cy="50" r="20" fill="#ffd9d4"/></svg>`;
    const c = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="11" fill="#a14a8b"/><circle cx="50" cy="50" r="8" fill="#f6dff0"/></svg>`;
    const v = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="#2b62c4"/><circle cx="50" cy="50" r="34" fill="#dbe7ff"/><path d="M18 40Q44 50 50 72Q56 50 82 40" fill="none" stroke="#2b62c4" stroke-width="5"/></svg>`;
    return `<div class="grid3">
      <div class="mini cent">${a}<b class="t">동맥</b>벽이 두껍고 탄력 강함</div>
      <div class="mini cent">${c}<b class="t">모세 혈관</b>벽이 아주 얇음</div>
      <div class="mini cent">${v}<b class="t">정맥</b>벽이 얇고 판막 있음</div>
    </div>`;
  },

  blood() {
    return `<svg class="fig" viewBox="0 0 340 190" role="img" aria-label="원심 분리한 혈액">
      <path d="M58 16V150A16 16 0 0 1 26 150V16Z" fill="#b5322a" stroke="#444" stroke-width="2"/>
      <text x="42" y="186" text-anchor="middle" class="s">그냥 혈액</text>
      <path d="M72 94H118" stroke="#333" stroke-width="2.5" marker-end="url(#ak)"/>
      <text x="95" y="84" text-anchor="middle" class="s">원심 분리</text>
      <path d="M166 16V150A16 16 0 0 1 134 150V16Z" fill="#fff" stroke="#444" stroke-width="2"/>
      <path d="M164.500 28V90H135.500V28Z" fill="#f7d765"/>
      <path d="M164.500 90V150A14.500 14.500 0 0 1 135.500 150V90Z" fill="#a8261f"/>
      <path d="M174 30V86" stroke="#555"/><path d="M174 94V164" stroke="#555"/>
      <text x="186" y="50" style="font-size:15px">혈장 55%</text>
      <text x="186" y="70" class="s">연한 노란색 액체, 가벼움</text>
      <text x="186" y="86" class="s">양분·노폐물 운반</text>
      <text x="186" y="130" style="font-size:15px">혈구 45%</text>
      <text x="186" y="150" class="s">적혈구·백혈구·혈소판</text>
      <text x="186" y="166" class="s">무거워서 아래로 가라앉음</text>
    </svg>`;
  },
  rbc() { return `<svg viewBox="0 0 100 70"><ellipse cx="50" cy="35" rx="40" ry="28" fill="#d6392f"/><ellipse cx="50" cy="35" rx="17" ry="11" fill="#95201a"/></svg>`; },
  wbc() { return `<svg viewBox="0 0 100 70"><path d="M50 4C70 2 92 18 88 36C92 54 70 68 50 66C28 68 10 52 12 36C8 18 30 2 50 4Z" fill="#f2eff7" stroke="#8a84a8" stroke-width="2"/><path d="M36 26Q50 14 60 26Q72 34 62 46Q50 54 40 46Q28 36 36 26Z" fill="#6b3fa0"/></svg>`; },
  plt() { return `<svg viewBox="0 0 100 70"><path d="M26 28l7-6 7 7-5 8-8-2z" fill="#d9a321"/><path d="M60 16l8-3 5 8-6 6-7-4z" fill="#d9a321"/><path d="M50 46l8-3 6 6-5 8-8-2z" fill="#d9a321"/></svg>`; },

  circ() {
    const pulA = 'M170 190V120H110V60H140';
    const pulV = 'M200 60H230V120H200V148';
    const sysA = 'M212 208H272V330H200';
    const sysV = 'M140 330H56V168H128';
    const dot = (p, col, dur, begin) => `<circle r="5" fill="${col}" stroke="#fff" class="moving"><animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="${p}"/></circle>`;
    return `<svg class="fig" id="circfig" viewBox="0 0 340 370" role="img" aria-label="온몸 순환과 폐순환 경로">
      <g class="loop-pul">
        <path d="${pulA}" stroke="#2b62c4" stroke-width="6" fill="none" marker-end="url(#ab)"/>
        <path d="${pulV}" stroke="#d6392f" stroke-width="6" fill="none" marker-end="url(#ar)"/>
        <rect x="140" y="38" width="60" height="44" rx="8" fill="url(#gpul)"/>
        <linearGradient id="gpul"><stop offset="0" stop-color="#2b62c4"/><stop offset="1" stop-color="#d6392f"/></linearGradient>
        <text x="170" y="29" text-anchor="middle">폐의 모세 혈관</text>
        <text x="170" y="65" text-anchor="middle" class="w">폐</text>
        <text x="62" y="93" class="b">폐동맥</text>
        <text x="62" y="109" class="s b">정맥혈!</text>
        <text x="238" y="93" class="r">폐정맥</text>
        <text x="238" y="109" class="s r">동맥혈!</text>
        ${dot(pulA, '#2b62c4', 3, 0)}${dot(pulV, '#d6392f', 3, 0)}
      </g>
      <g class="loop-sys">
        <path d="${sysA}" stroke="#d6392f" stroke-width="6" fill="none" marker-end="url(#ar)"/>
        <path d="${sysV}" stroke="#2b62c4" stroke-width="6" fill="none" marker-end="url(#ab)"/>
        <rect x="140" y="308" width="60" height="44" rx="8" fill="url(#gsys)"/>
        <linearGradient id="gsys"><stop offset="0" stop-color="#2b62c4"/><stop offset="1" stop-color="#d6392f"/></linearGradient>
        <text x="170" y="334" text-anchor="middle" class="w">온몸</text>
        <text x="170" y="366" text-anchor="middle">온몸의 모세 혈관</text>
        <text x="4" y="250" class="b">대정맥</text>
        <text x="282" y="274" class="r">대동맥</text>
        ${dot(sysA, '#d6392f', 3.6, 0)}${dot(sysV, '#2b62c4', 3.6, 0)}
      </g>
      <g>
        <rect x="128" y="148" width="36" height="38" rx="6" fill="#2b62c4"/><rect x="176" y="148" width="36" height="38" rx="6" fill="#d6392f"/>
        <rect x="128" y="190" width="36" height="38" rx="6" fill="#2b62c4"/><rect x="176" y="190" width="36" height="38" rx="6" fill="#d6392f"/>
        <text x="146" y="171" text-anchor="middle" class="s w">우심방</text><text x="194" y="171" text-anchor="middle" class="s w">좌심방</text>
        <text x="146" y="213" text-anchor="middle" class="s w">우심실</text><text x="194" y="213" text-anchor="middle" class="s w">좌심실</text>
      </g>
    </svg>`;
  },

  resp() {
    return `<svg class="fig" viewBox="0 0 340 300" role="img" aria-label="호흡 기관 그림">
      <g fill="#fbe6d8"><ellipse cx="170" cy="46" rx="36" ry="40"/><rect x="152" y="80" width="36" height="28"/><path d="M78 130Q80 104 130 102H210Q260 104 262 130L252 296H88Z"/></g>
      <g class="tap" data-o="코"><path d="M170 36Q190 40 200 55L170 56Z" fill="#df8f78"/><path d="M196 46H276" stroke="#555"/><text x="280" y="51">코</text></g>
      <g class="tap" data-o="기관"><path d="M170 56V148" stroke="#b86e5c" stroke-width="12"/><path d="M178 100H276" stroke="#555"/><text x="280" y="105">기관</text></g>
      <g class="tap" data-o="폐">
        <path d="M152 128C110 118 94 186 96 240C110 252 148 246 158 236Z" fill="#f09a8c"/>
        <path d="M188 128C230 118 246 186 244 240C230 252 192 246 182 236Z" fill="#f09a8c"/>
        <path d="M100 190H64" stroke="#555"/><text x="42" y="195">폐</text>
      </g>
      <g class="tap" data-o="기관지">
        <path d="M170 146L136 172M136 172L120 204M136 172L140 216M170 146L204 172M204 172L220 204M204 172L200 216" stroke="#b86e5c" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M216 180H276" stroke="#555"/><text x="280" y="185">기관지</text>
      </g>
      <g class="tap" data-o="폐포">
        <g fill="#c8574a"><circle cx="118" cy="214" r="5"/><circle cx="128" cy="222" r="5"/><circle cx="112" cy="225" r="5"/><circle cx="222" cy="214" r="5"/><circle cx="212" cy="222" r="5"/><circle cx="228" cy="225" r="5"/></g>
        <path d="M228 228H276" stroke="#555"/><text x="280" y="233">폐포</text>
      </g>
      <g class="tap" data-o="갈비뼈" stroke="#a8a08a" stroke-width="3.500" fill="none">
        <path d="M92 150Q170 122 248 150M88 180Q100 170 112 166M252 180Q240 170 228 166"/>
        <path d="M88 210Q95 204 100 202M252 210Q245 204 240 202"/>
        <path d="M94 150H64" stroke="#555" stroke-width="1"/><text x="18" y="155" stroke="none">갈비뼈</text>
      </g>
      <g class="tap" data-o="가로막">
        <path d="M90 268Q170 226 250 268" stroke="#8b5a2b" stroke-width="7" fill="none"/>
        <path d="M250 266H276" stroke="#555"/><text x="280" y="271">가로막</text>
      </g>
    </svg>`;
  },

  alveolus() {
    return `<svg class="fig" viewBox="0 0 340 170" role="img" aria-label="폐포와 모세 혈관의 기체 교환">
      <circle cx="104" cy="85" r="68" fill="#fbdcd3" stroke="#c8574a" stroke-width="3"/>
      <text x="104" y="60" text-anchor="middle">폐포</text><text x="104" y="77" text-anchor="middle" class="s">(공기 주머니)</text>
      <rect x="178" y="10" width="24" height="150" rx="6" fill="url(#ga)"/>
      <linearGradient id="ga" x1="0" x2="0" y1="1" y2="0"><stop offset="0" stop-color="#2b62c4"/><stop offset="1" stop-color="#d6392f"/></linearGradient>
      <text x="212" y="54">모세 혈관</text>
      <text x="212" y="72" class="s">피가 아래→위로 흐르며</text>
      <text x="212" y="88" class="s b">정맥혈 → </text><text x="266" y="88" class="s r">동맥혈</text>
      <path d="M176 104H112" stroke="#2b62c4" stroke-width="2.500" marker-end="url(#ab)"/>
      <text x="116" y="97" class="s b">CO₂ 나옴</text>
      <path d="M112 136H176" stroke="#d6392f" stroke-width="2.500" marker-end="url(#ar)"/>
      <text x="116" y="129" class="s r">O₂ 들어감</text>
    </svg>`;
  },

  breath() {
    return `<svg class="fig in" id="breath" viewBox="0 0 300 250" role="img" aria-label="들숨과 날숨 때 흉강 변화">
      <g class="ribs" fill="none" stroke="#a8a08a" stroke-width="4">
        <path d="M150 50C86 56 52 120 48 204M150 50C214 56 248 120 252 204"/>
        <path d="M74 112Q150 88 226 112M60 150Q150 122 240 150" opacity=".65"/>
      </g>
      <path d="M150 8V62" stroke="#b86e5c" stroke-width="11"/>
      <g class="lung" fill="#f09a8c">
        <path d="M142 66C102 62 74 120 76 182C96 192 128 188 142 178Z"/>
        <path d="M158 66C198 62 226 120 224 182C204 192 172 188 158 178Z"/>
      </g>
      <path class="dia" d="M48 205Q150 150 252 205" fill="none" stroke="#8b5a2b" stroke-width="7"/>
      <g class="air-in"><path d="M172 4V38" stroke="#2b62c4" stroke-width="3" marker-end="url(#ab)"/><text x="180" y="24" class="b">공기 들어옴</text></g>
      <g class="air-out"><path d="M172 38V4" stroke="#d6392f" stroke-width="3" marker-end="url(#ar)"/><text x="180" y="24" class="r">공기 나감</text></g>
      <text x="4" y="86" class="s">갈비뼈</text><text x="108" y="245" class="s">가로막(갈색 선)</text>
    </svg>`;
  },

  exchange() {
    const box = (x, c, t, s) => `<rect x="${x}" y="50" width="88" height="82" rx="12" fill="${c}"/><text x="${x + 44}" y="86" text-anchor="middle">${t}</text><text x="${x + 44}" y="104" text-anchor="middle" class="s">${s}</text>`;
    return `<svg class="fig" viewBox="0 0 340 196" role="img" aria-label="폐, 혈액, 조직 세포 사이의 기체 교환">
      ${box(2, '#fbdcd3', '폐포', 'O₂ 많음')}${box(126, '#f3e2f6', '혈액', '중간 다리')}${box(250, '#e4efd8', '조직 세포', 'CO₂ 많음')}
      <path d="M92 76H124" stroke="#d6392f" stroke-width="3" marker-end="url(#ar)"/><path d="M216 76H248" stroke="#d6392f" stroke-width="3" marker-end="url(#ar)"/>
      <path d="M124 108H92" stroke="#2b62c4" stroke-width="3" marker-end="url(#ab)"/><path d="M248 108H216" stroke="#2b62c4" stroke-width="3" marker-end="url(#ab)"/>
      <text x="108" y="68" text-anchor="middle" class="s r">O₂</text><text x="232" y="68" text-anchor="middle" class="s r">O₂</text>
      <text x="108" y="124" text-anchor="middle" class="s b">CO₂</text><text x="232" y="124" text-anchor="middle" class="s b">CO₂</text>
      <path d="M46 40V26H170V40" stroke="#555" fill="none"/><text x="108" y="18" text-anchor="middle">외호흡</text>
      <path d="M170 40V26H294V40" stroke="#555" fill="none" stroke-dasharray="4 3"/><text x="232" y="18" text-anchor="middle">내호흡</text>
      <text x="108" y="156" text-anchor="middle" class="s">정맥혈 → 동맥혈</text>
      <text x="232" y="156" text-anchor="middle" class="s">동맥혈 → 정맥혈</text>
      <text x="170" y="186" text-anchor="middle" class="s">기체는 항상 많은 곳 → 적은 곳으로 저절로 이동(확산)</text>
    </svg>`;
  },

  excrete() {
    return `<svg class="fig" viewBox="0 0 340 300" role="img" aria-label="사람의 배설 기관 그림">
      <path d="M78 14H262L276 180Q280 240 216 268L208 296H132L124 268Q60 240 64 180Z" fill="#fbe6d8"/>
      <path d="M162 8V190" stroke="#2b62c4" stroke-width="7"/><path d="M178 8V190" stroke="#d6392f" stroke-width="7"/>
      <g class="tap" data-o="콩팥">
        <path d="M112 62C86 62 78 92 84 118C90 142 114 146 124 126C116 112 116 92 128 80C128 68 122 62 112 62Z" fill="#a8483e"/>
        <path d="M228 62C254 62 262 92 256 118C250 142 226 146 216 126C224 112 224 92 212 80C212 68 218 62 228 62Z" fill="#a8483e"/>
        <path d="M84 96H52" stroke="#555"/><text x="14" y="101">콩팥</text>
      </g>
      <g stroke-width="3" fill="none">
        <path d="M127 100H159" stroke="#d6392f"/><path d="M127 110H159" stroke="#2b62c4"/>
        <path d="M213 100H181" stroke="#d6392f"/><path d="M213 110H181" stroke="#2b62c4"/>
      </g>
      <g class="tap" data-o="오줌관">
        <path d="M124 122C134 160 150 180 158 210M216 122C206 160 190 180 182 210" stroke="#d9a321" stroke-width="5" fill="none"/>
        <path d="M204 150H284" stroke="#555"/><text x="288" y="155">오줌관</text>
      </g>
      <g class="tap" data-o="방광">
        <path d="M144 214C144 202 196 202 196 214C204 240 186 252 170 252C154 252 136 240 144 214Z" fill="#efc04a"/>
        <path d="M196 228H284" stroke="#555"/><text x="288" y="233">방광</text>
      </g>
      <g class="tap" data-o="요도">
        <path d="M170 252V294" stroke="#d9a321" stroke-width="6"/>
        <path d="M172 276H284" stroke="#555"/><text x="288" y="281">요도</text>
      </g>
      <text x="170" y="32" text-anchor="end" class="s b"></text>
    </svg>`;
  },

  nephron(step, q) {
    const on = n => q ? 0 : step === 0 || step === n ? 1 : .15;
    const L = q ? { a: '(가)', b: '(나)', c: '(다)' } : { a: '토리', b: '보먼주머니', c: '세뇨관' };
    return `<svg class="fig" viewBox="0 0 340 220" role="img" aria-label="네프론에서 오줌이 만들어지는 과정">
      <linearGradient id="nb"><stop offset="0" stop-color="#d6392f"/><stop offset=".55" stop-color="#a14a8b"/><stop offset="1" stop-color="#2b62c4"/></linearGradient>
      <path d="M92 58C92 112 158 112 158 58" fill="none" stroke="#ecc84d" stroke-width="10"/>
      <path d="M125 100V146H330" fill="none" stroke="#ffe16b" stroke-width="20"/>
      <path d="M92 58C92 112 158 112 158 58" fill="none" stroke="#c9a51c" stroke-width="1.500" opacity=".7"/>
      <path d="M4 42H98Q112 42 112 56Q122 72 134 56Q138 42 152 42H180V104H300V52H336" fill="none" stroke="url(#nb)" stroke-width="10" stroke-linejoin="round"/>
      <circle cx="125" cy="62" r="17" fill="#d6392f" opacity=".9"/><path d="M112 62q6 -14 13 0t13 0M114 70q6 -8 11 0t11 0" stroke="#fff" stroke-width="2" fill="none"/>
      <g opacity="${on(1)}"><path d="M125 82V126" stroke="#e4791f" stroke-width="4" marker-end="url(#ao)"/><rect x="134" y="110" width="44" height="22" rx="6" fill="#ffc98f"/><text x="156" y="126" text-anchor="middle">① 여과</text></g>
      <g opacity="${on(2)}"><path d="M205 138V112" stroke="#1e9a6a" stroke-width="4" marker-end="url(#ag)"/><rect x="148" y="166" width="68" height="22" rx="6" fill="#bdeed8"/><text x="182" y="182" text-anchor="middle">② 재흡수</text><path d="M205 165V158" stroke="#1e9a6a"/></g>
      <g opacity="${on(3)}"><path d="M250 112V138" stroke="#7a3fb5" stroke-width="4" marker-end="url(#ar)"/><rect x="222" y="166" width="58" height="22" rx="6" fill="#ddc9f3"/><text x="251" y="182" text-anchor="middle">③ 분비</text><path d="M250 165V158" stroke="#7a3fb5"/></g>
      <text x="4" y="30">${q ? '' : '콩팥 동맥'}</text><text x="286" y="30">${q ? '' : '콩팥 정맥'}</text>
      <text x="48" y="74" ${q ? 'style="font-size:17px"' : ''}>${L.a}</text><path d="M74 69H106" stroke="#333"/>
      <text x="10" y="126" ${q ? 'style="font-size:17px"' : ''}>${L.b}</text><path d="M${q ? 42 : 78} 121L98 96" stroke="#333"/>
      <text x="${q ? 40 : 56}" y="168" ${q ? 'style="font-size:17px"' : ''}>${L.c}</text><path d="M${q ? 74 : 98} 164L128 152" stroke="#333"/>
      <text x="336" y="128" text-anchor="end" class="s">콩팥 깔때기로 →</text>
      ${q ? '' : '<text x="170" y="210" text-anchor="middle" class="s">노란 관 = 오줌이 될 액체 / 빨강→파랑 관 = 모세 혈관</text>'}
    </svg>`;
  },
};
