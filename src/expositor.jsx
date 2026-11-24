// Ilustração do expositor de luz técnica (1 m x 2 m). Desenho ilustrativo, não é projeto técnico.
// Cabine: x 70–370, y 60–660 (300 x 600 = proporção 1:2).

const Cone = ({ x, y, w, h, id }) => (
  <polygon points={`${x - 7},${y} ${x + 7},${y} ${x + w / 2},${y + h} ${x - w / 2},${y + h}`} fill={`url(#${id})`} />
);

const Label = ({ y, ly = y, t, s }) => (
  <g className="ex-lab">
    <path d={`M374 ${y} H392 L404 ${ly} H418`} />
    <circle cx="374" cy={y} r="3" />
    <text x="426" y={ly - 2}>{t}</text>
    {s && <text x="426" y={ly + 19} className="ex-sub">{s}</text>}
  </g>
);

export function Expositor() {
  const tones = [
    ['#ffad4f', '2700K', 'c27'],
    ['#ffd08f', '3000K', 'c30'],
    ['#fff4e2', '4000K', 'c40'],
  ];
  return (
    <svg className="ex" viewBox="0 0 640 720" role="img" aria-labelledby="ex-t ex-d">
      <title id="ex-t">Expositor de luz técnica Luzcor, ilustrativo, 1 metro de largura por 2 de altura</title>
      <desc id="ex-d">Móvel com trilho e spots, embutidos em 2700K, 3000K e 4000K, perfis de LED, fitas de LED em tons e cores e contorno de luz.</desc>
      <defs>
        <filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" /></filter>
        <filter id="gl2" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="7" /></filter>
        <linearGradient id="spot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe2b0" stopOpacity=".75" /><stop offset="1" stopColor="#ffe2b0" stopOpacity="0" /></linearGradient>
        {tones.map(([c, , id]) => (
          <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c} stopOpacity=".85" /><stop offset="1" stopColor={c} stopOpacity="0" /></linearGradient>
        ))}
        <linearGradient id="rgb" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ff3d6e" /><stop offset=".33" stopColor="#ffb23d" /><stop offset=".66" stopColor="#3dd6ff" /><stop offset="1" stopColor="#9b5cff" />
        </linearGradient>
        <linearGradient id="wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#1d0d08" /><stop offset=".5" stopColor="#24110b" /><stop offset="1" stopColor="#1a0b07" /></linearGradient>
      </defs>

      {/* medidas */}
      <g className="ex-dim">
        <path d="M70 690 H370 M70 682 V698 M370 682 V698" />
        <text x="220" y="712">1 m</text>
        <path d="M40 60 V660 M32 60 H48 M32 660 H48" />
        <text x="30" y="365" transform="rotate(-90 30 365)">2 m</text>
      </g>

      {/* móvel */}
      <rect x="70" y="60" width="300" height="600" rx="6" fill="#120705" stroke="#3a1d13" strokeWidth="3" />
      <rect x="84" y="74" width="272" height="572" rx="3" fill="url(#wood)" />

      {/* contorno de luz */}
      <g className="ex-on ex-d6">
        <rect x="84" y="74" width="272" height="572" rx="3" fill="none" stroke="#ffcf8a" strokeWidth="5" filter="url(#gl)" opacity=".7" />
        <rect x="84" y="74" width="272" height="572" rx="3" fill="none" stroke="#ffe8c4" strokeWidth="1.2" />
      </g>

      {/* 1. trilho com spots */}
      <rect x="104" y="92" width="232" height="7" rx="2" fill="#0a0403" stroke="#5a3a2a" />
      <g className="ex-on ex-d1">
        {[150, 220, 290].map((x) => <Cone key={x} x={x} y={122} w={78} h={118} id="spot" />)}
      </g>
      {[150, 220, 290].map((x) => (
        <g key={x}>
          <rect x={x - 2} y="99" width="4" height="9" fill="#5a3a2a" />
          <rect x={x - 8} y="106" width="16" height="18" rx="3" fill="#0d0605" stroke="#6b4a37" />
        </g>
      ))}
      {/* objetos na prateleira */}
      <path d="M137 240 q-6 -22 6 -34 h14 q12 12 6 34 z" fill="#3a2016" />
      <rect x="207" y="214" width="26" height="26" rx="3" fill="#2e1a12" />
      <path d="M280 240 l10 -32 l10 32 z" fill="#3a2016" />
      <rect x="92" y="240" width="256" height="6" fill="#2c140c" />

      {/* 2. embutidos em 3 temperaturas */}
      <rect x="92" y="262" width="256" height="10" fill="#0d0605" />
      <g className="ex-on ex-d2">
        {tones.map(([, , id], i) => <Cone key={id} x={135 + i * 85} y={272} w={70} h={112} id={id} />)}
      </g>
      {tones.map(([c, k], i) => (
        <g key={k}>
          <ellipse cx={135 + i * 85} cy="272" rx="10" ry="3" fill={c} />
          <text x={135 + i * 85} y="400" className="ex-k">{k}</text>
        </g>
      ))}
      <rect x="92" y="410" width="256" height="6" fill="#2c140c" />

      {/* 3. perfis de LED */}
      <g className="ex-on ex-d3">
        <rect x="108" y="440" width="224" height="5" rx="2" fill="#ffe1b0" filter="url(#gl2)" />
        <rect x="108" y="441" width="224" height="3" rx="1.5" fill="#fff3dd" />
        <rect x="128" y="478" width="184" height="5" rx="2" fill="#fff4e8" filter="url(#gl2)" />
        <rect x="128" y="479" width="184" height="3" rx="1.5" fill="#ffffff" />
        <path d="M150 498 V512 M290 498 V512" stroke="#6b4a37" />
        <rect x="140" y="512" width="160" height="7" rx="3" fill="#1a0b07" stroke="#6b4a37" />
        <rect x="146" y="518" width="148" height="4" rx="2" fill="#ffd08f" filter="url(#gl2)" />
        <rect x="146" y="518" width="148" height="2" rx="1" fill="#ffe6c2" />
      </g>
      <rect x="92" y="540" width="256" height="6" fill="#2c140c" />

      {/* 4. fitas de LED: tons e cores */}
      <g className="ex-on ex-d4">
        {[['#ffad4f', 566], ['#fff4e2', 584], ['#cfe6ff', 602]].map(([c, y]) => (
          <g key={y}>
            <rect x="108" y={y} width="224" height="4" rx="2" fill={c} filter="url(#gl)" />
            <rect x="108" y={y + 1} width="224" height="2" rx="1" fill={c} />
          </g>
        ))}
        <rect x="108" y="620" width="224" height="4" rx="2" fill="url(#rgb)" filter="url(#gl)" />
        <rect x="108" y="621" width="224" height="2" rx="1" fill="url(#rgb)" />
      </g>

      <text x="220" y="652" className="ex-brand">LUZCOR</text>

      <Label y={110} t="Trilho e spots" s="luz de destaque" />
      <Label y={300} t="Embutidos" s="luz quente, neutra e fria" />
      <Label y={470} t="Perfis de LED" s="embutido, sobrepor e pendente" />
      <Label y={594} t="Fitas de LED" s="tons de branco e cores" />
      <Label y={74} ly={40} t="Contorno de luz" />
    </svg>
  );
}
