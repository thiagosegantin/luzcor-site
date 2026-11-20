// Luzcor — cena 3D em WebGL2 puro (sem bibliotecas).
// Um cabo grosso, de capa translúcida e três fios de cobre trançados, leva a energia
// por uma sequência de ambientes. A câmera acompanha a rolagem: chega perto do cabo e
// se afasta para revelar cada luminária, que acende quando a energia chega.
import storeImg from '../assets-fonte/destino.jpg';

/* ---------------- matemática ---------------- */
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const norm = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const lerp = (a, b, t) => a + (b - a) * t;
const lerp3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const smooth = (t) => t * t * (3 - 2 * t);
const UP = [0, 1, 0];

function perspective(fovy, aspect, near, far) {
  const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
}
function lookAt(e, t) {
  const z = norm(sub(e, t)), x = norm(cross(UP, z)), y = cross(z, x);
  return new Float32Array([x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, e), -dot(y, e), -dot(z, e), 1]);
}
function mat4mul(a, b) {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
    let s = 0;
    for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
    o[c * 4 + r] = s;
  }
  return o;
}
function cr(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return [0, 1, 2].map((i) => 0.5 * (2 * p1[i] + (-p0[i] + p2[i]) * t + (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t2 + (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t3));
}

/* ---------------- shaders ---------------- */
const LIGHTS = `
uniform vec3 uCam; uniform vec3 uLP[8]; uniform vec3 uLC[8]; uniform int uNL;
uniform vec3 uFog; uniform float uFogD;
uniform float uLampI[16]; uniform vec3 uLampC[16];
uniform float uE; uniform float uT; uniform float uLen;
float fogf(vec3 w){ float d=length(uCam-w)*uFogD; return 1.-exp(-d*d); }
`;
const VS_SOLID = `#version 300 es
layout(location=0) in vec3 aPos; layout(location=1) in vec3 aNor; layout(location=2) in vec3 aCol;
layout(location=3) in vec4 aMat; layout(location=4) in float aS;
uniform mat4 uVP;
out vec3 vW; out vec3 vN; out vec3 vC; out vec4 vM; out float vS;
void main(){ vW=aPos; vN=aNor; vC=aCol; vM=aMat; vS=aS; gl_Position=uVP*vec4(aPos,1.); }`;

const FS_SOLID = `#version 300 es
precision highp float;
in vec3 vW; in vec3 vN; in vec3 vC; in vec4 vM; in float vS;
${LIGHTS}
uniform float uCable;
out vec4 o;
void main(){
  vec3 N=normalize(vN); vec3 V=normalize(uCam-vW);
  if(dot(N,V)<0.) N=-N;
  vec3 base=vC;
  vec3 col=base*(vec3(.30,.14,.10)+vec3(.16,.10,.08)*(N.y*.5+.5));
  for(int i=0;i<8;i++){
    if(i>=uNL) break;
    vec3 L=uLP[i]-vW; float d=length(L); L/=d;
    float att=1./(1.+.28*d*d);
    float df=max(dot(N,L),0.);
    vec3 H=normalize(L+V);
    float sp=pow(max(dot(N,H),0.),vM.y*100.+2.)*vM.x;
    col+=uLC[i]*att*(base*df+sp);
  }
  int li=int(vM.w+.5);
  vec3 em=vM.z*uLampC[li]*uLampI[li]*2.4;
  if(uCable>.5){
    float on=step(vS,uE);
    float flow=pow(fract(vS*uLen*.8-uT*1.4),10.);
    float head=exp(-max(uE-vS,0.)*uLen*1.2);
    em+=on*vec3(1.,.66,.22)*(.35+1.6*flow+3.*head);
    col*=1.-on*.3;
  }
  col+=em;
  float f=fogf(vW)*(1.-clamp(length(em),0.,1.)*.7);
  o=vec4(mix(col,uFog,f),1.);
}`;

const FS_GLASS = `#version 300 es
precision highp float;
in vec3 vW; in vec3 vN; in vec3 vC; in vec4 vM; in float vS;
${LIGHTS}
out vec4 o;
void main(){
  vec3 N=normalize(vN); vec3 V=normalize(uCam-vW);
  float nv=abs(dot(N,V)); float fr=pow(1.-nv,2.4);
  float on=step(vS,uE);
  float rib=smoothstep(.86,1.,fract(vS*uLen/.11));
  vec3 c=mix(vec3(.62,.38,.28),vec3(1.,.78,.42),on*.75);
  vec3 sp=vec3(0.);
  for(int i=0;i<8;i++){
    if(i>=uNL) break;
    vec3 L=uLP[i]-vW; float d=length(L); L/=d;
    vec3 H=normalize(L+V);
    sp+=uLC[i]/(1.+.25*d*d)*pow(max(abs(dot(N,H)),0.),90.)*1.4;
  }
  float head=exp(-max(uE-vS,0.)*uLen*1.2)*on;
  vec3 col=c*(.18+fr*1.1)+sp+on*vec3(1.,.66,.28)*(.18+.9*head)*(1.-nv*.6)+rib*.06;
  float a=clamp(.07+.62*fr+.07*rib+on*.05+head*.25+length(sp)*.4,0.,1.);
  float f=fogf(vW);
  o=vec4(mix(col,uFog,f),a*(1.-f*.8));
}`;

const FS_BEAM = `#version 300 es
precision highp float;
in vec3 vW; in vec3 vN; in vec3 vC; in vec4 vM; in float vS;
${LIGHTS}
out vec4 o;
void main(){
  vec3 V=normalize(uCam-vW);
  float nv=abs(dot(normalize(vN),V));
  int li=int(vM.w+.5);
  float h=1.-vS;
  float a=uLampI[li]*pow(nv,1.6)*h*h*.22*vM.z;
  a*=1.-fogf(vW);
  o=vec4(uLampC[li]*a,a);
}`;

const VS_SPRITE = `#version 300 es
layout(location=0) in vec3 aPos; layout(location=1) in vec2 aCorner; layout(location=2) in vec3 aCol; layout(location=3) in float aSize;
uniform mat4 uV; uniform mat4 uP;
out vec2 vUV; out vec3 vC; out vec3 vW;
void main(){ vec4 c=uV*vec4(aPos,1.); c.xy+=aCorner*aSize; vUV=aCorner; vC=aCol; vW=aPos; gl_Position=uP*c; }`;
const FS_SPRITE = `#version 300 es
precision highp float;
in vec2 vUV; in vec3 vC; in vec3 vW;
uniform vec3 uCam; uniform float uFogD;
out vec4 o;
void main(){
  float d=dot(vUV,vUV);
  if(d>1.) discard;
  float g=exp(-d*7.)*1.2+exp(-d*2.2)*.35;
  g*=1.-d;
  float fd=length(uCam-vW)*uFogD; g*=exp(-fd*fd*.6);
  o=vec4(vC*g,g);
}`;

const VS_TEX = `#version 300 es
layout(location=0) in vec3 aPos; layout(location=1) in vec2 aUV;
uniform mat4 uVP; out vec2 vUV; out vec3 vW;
void main(){ vUV=aUV; vW=aPos; gl_Position=uVP*vec4(aPos,1.); }`;
const FS_TEX = `#version 300 es
precision highp float;
in vec2 vUV; in vec3 vW;
uniform sampler2D uTex; uniform float uBright; uniform float uSat; uniform vec3 uCam; uniform vec3 uFog; uniform float uFogD;
uniform vec2 uGlowAt; uniform float uGlow;
out vec4 o;
void main(){
  vec4 t=texture(uTex,vUV);
  vec3 c=t.rgb;
  float l=dot(c,vec3(.299,.587,.114));
  c=mix(vec3(l),c,uSat)*uBright;
  float g=exp(-pow(length((vUV-uGlowAt)*vec2(2.,1.)),2.)*14.)*uGlow;
  c+=vec3(1.,.82,.5)*g;
  float d=length(uCam-vW)*uFogD; float f=1.-exp(-d*d);
  o=vec4(mix(c,uFog,f*.85),t.a);
}`;

function compile(gl, vs, fs) {
  const mk = (type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const p = gl.createProgram();
  gl.attachShader(p, mk(gl.VERTEX_SHADER, vs)); gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const u = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const info = gl.getActiveUniform(p, i);
    const name = info.name.replace(/\[0\]$/, '');
    u[name] = gl.getUniformLocation(p, info.name);
  }
  return { p, u };
}

/* ---------------- geometria ---------------- */
class Batch {
  constructor() { this.pos = []; this.nor = []; this.col = []; this.mat = []; this.s = []; this.idx = []; }
  get n() { return this.pos.length / 3; }
  v(p, nn, c, m, s = 0) { this.pos.push(...p); this.nor.push(...nn); this.col.push(...c); this.mat.push(...m); this.s.push(s); }
}
// m = [especular, brilho/100, peso emissivo, índice da luminária]
const MAT = {
  brass: { c: [0.78, 0.55, 0.28], m: [0.9, 0.6, 0, 15] },
  bronze: { c: [0.42, 0.26, 0.15], m: [0.7, 0.4, 0, 15] },
  black: { c: [0.08, 0.06, 0.06], m: [0.5, 0.5, 0, 15] },
  ivory: { c: [0.86, 0.80, 0.70], m: [0.3, 0.2, 0, 15] },
  copper: { c: [0.80, 0.42, 0.22], m: [1.0, 0.7, 0, 15] },
  wall: { c: [0.42, 0.20, 0.15], m: [0.05, 0.1, 0, 15] },
  floor: { c: [0.30, 0.11, 0.08], m: [0.35, 0.25, 0, 15] },
};
const bulb = (li) => ({ c: [1, 0.95, 0.85], m: [0.2, 0.3, 1, li] });

function lathe(b, prof, seg, center, mat, opts = {}) {
  const { s = 0, rot } = opts;
  const base = b.n;
  for (let i = 0; i < prof.length; i++) {
    const [r, y] = prof[i];
    const pr = prof[Math.max(0, i - 1)], nx = prof[Math.min(prof.length - 1, i + 1)];
    const dr = nx[0] - pr[0], dy = nx[1] - pr[1];
    for (let j = 0; j <= seg; j++) {
      const a = (j / seg) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
      let p = [r * ca, y, r * sa];
      let nn = norm([dy * ca, -dr, dy * sa]);
      if (rot) { p = rot(p); nn = rot(nn, true); }
      b.v(add(center, p), nn, mat.c, mat.m, typeof s === 'function' ? s(i, prof.length) : s);
    }
  }
  for (let i = 0; i < prof.length - 1; i++)
    for (let j = 0; j < seg; j++) {
      const a = base + i * (seg + 1) + j, c = a + seg + 1;
      b.idx.push(a, c, a + 1, a + 1, c, c + 1);
    }
}
const cyl = (b, top, h, r, mat, seg = 12, rot) => lathe(b, [[0, 0], [r, 0], [r, -h], [0, -h]], seg, top, mat, { rot });
const sphere = (b, c, r, mat, seg = 14) => {
  const prof = [];
  for (let i = 0; i <= seg; i++) { const a = (i / seg) * Math.PI; prof.push([Math.sin(a) * r, Math.cos(a) * r]); }
  lathe(b, prof, seg, c, mat);
};
function torus(b, c, R, r, mat, seg = 40, rs = 8) {
  const base = b.n;
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    const cc = [Math.cos(a) * R, 0, Math.sin(a) * R];
    for (let j = 0; j <= rs; j++) {
      const t = (j / rs) * Math.PI * 2;
      const nn = [Math.cos(a) * Math.cos(t), Math.sin(t), Math.sin(a) * Math.cos(t)];
      b.v(add(c, add(cc, mul(nn, r))), nn, mat.c, mat.m);
    }
  }
  for (let i = 0; i < seg; i++) for (let j = 0; j < rs; j++) {
    const a = base + i * (rs + 1) + j, d = a + rs + 1;
    b.idx.push(a, d, a + 1, a + 1, d, d + 1);
  }
}
function box(b, c, sz, mat) {
  const [hx, hy, hz] = mul(sz, 0.5);
  const F = [
    [[1, 0, 0], [[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]]],
    [[-1, 0, 0], [[-1, -1, 1], [-1, 1, 1], [-1, 1, -1], [-1, -1, -1]]],
    [[0, 1, 0], [[-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1]]],
    [[0, -1, 0], [[-1, -1, 1], [-1, -1, -1], [1, -1, -1], [1, -1, 1]]],
    [[0, 0, 1], [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]],
    [[0, 0, -1], [[1, -1, -1], [-1, -1, -1], [-1, 1, -1], [1, 1, -1]]],
  ];
  for (const [nn, cs] of F) {
    const base = b.n;
    for (const [x, y, z] of cs) b.v(add(c, [x * hx, y * hy, z * hz]), nn, mat.c, mat.m);
    b.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
}
// segmento de cilindro entre dois pontos
function rod(b, a, c, r, mat, seg = 8) {
  const d = sub(c, a), h = len(d), y = norm(d);
  const x = norm(Math.abs(y[1]) > 0.9 ? cross(y, [1, 0, 0]) : cross(y, UP)), z = cross(x, y);
  const rot = (p) => add(add(mul(x, p[0]), mul(y, -p[1])), mul(z, p[2]));
  lathe(b, [[r, 0], [r, -h]], seg, a, mat, { rot: (p, isN) => (isN ? norm(rot(p)) : rot(p)) });
}
// cone de luz (feixe) do ponto a até o disco em c
function beam(b, a, c, r0, r1, li, strength = 1) {
  const d = sub(c, a), h = len(d), y = norm(d);
  const x = norm(Math.abs(y[1]) > 0.9 ? cross(y, [1, 0, 0]) : cross(y, UP)), z = cross(x, y);
  const rot = (p, isN) => { const q = add(add(mul(x, p[0]), mul(y, -p[1])), mul(z, p[2])); return isN ? norm(q) : q; };
  const prof = []; const N = 8;
  for (let i = 0; i <= N; i++) prof.push([lerp(r0, r1, i / N), -h * (i / N)]);
  lathe(b, prof, 28, a, { c: [1, 1, 1], m: [0, 0, strength, li] }, { rot, s: (i, n) => i / (n - 1) });
}

/* ---------------- texturas desenhadas ---------------- */
function planTexture() {
  const c = document.createElement('canvas'); c.width = 1040; c.height = 560;
  const x = c.getContext('2d');
  x.strokeStyle = 'rgba(246,236,220,.75)'; x.lineWidth = 3; x.lineCap = 'round';
  const S = 2;
  x.beginPath();
  x.rect(20 * S, 20 * S, 480 * S, 240 * S);
  x.moveTo(280 * S, 20 * S); x.lineTo(280 * S, 200 * S); x.moveTo(20 * S, 200 * S); x.lineTo(230 * S, 200 * S);
  x.moveTo(280 * S, 200 * S); x.lineTo(280 * S, 260 * S); x.moveTo(380 * S, 20 * S); x.lineTo(380 * S, 120 * S); x.lineTo(500 * S, 120 * S);
  x.rect(60 * S, 100 * S, 140 * S, 40 * S); x.moveTo(320 * S, 210 * S); x.lineTo(490 * S, 210 * S);
  x.stroke();
  x.beginPath(); x.arc(260 * S, 200 * S, 30 * S, Math.PI, Math.PI * 1.5); x.stroke();
  x.fillStyle = 'rgba(246,236,220,.55)'; x.font = 'italic 34px Cardo, Georgia, serif';
  x.fillText('sala', 40 * S, 250 * S); x.fillText('cozinha', 300 * S, 50 * S); x.fillText('jantar', 398 * S, 110 * S); x.fillText('varanda', 300 * S, 252 * S);
  return c;
}
const PLAN_PTS = [[70, 70], [150, 70], [230, 70], [70, 150], [150, 150], [230, 150], [330, 60], [330, 110], [330, 160], [420, 80], [470, 80], [445, 160], [300, 230], [380, 230], [460, 230]];

function mapTexture(cities, pt) {
  const W = 560, H = 520, S = 2;
  const c = document.createElement('canvas'); c.width = W * S; c.height = H * S;
  const x = c.getContext('2d');
  const tb = pt(cities[0]);
  x.strokeStyle = 'rgba(253,194,12,.75)'; x.lineWidth = 2.4;
  cities.slice(2).forEach((ci) => {
    const [px, py] = pt(ci);
    const mx = (tb[0] + px) / 2 + (py - tb[1]) * 0.12, my = (tb[1] + py) / 2 - (px - tb[0]) * 0.12;
    x.beginPath(); x.moveTo(tb[0] * S, tb[1] * S); x.quadraticCurveTo(mx * S, my * S, px * S, py * S); x.stroke();
  });
  cities.forEach((ci) => {
    const [px, py] = pt(ci);
    const key = ci.main || ci.big;
    x.fillStyle = key ? '#ffe39a' : 'rgba(246,236,220,.85)';
    x.beginPath(); x.arc(px * S, py * S, key ? 9 : 6, 0, 7); x.fill();
    x.font = (key ? '44px' : 'italic 34px') + ' Cardo, Georgia, serif';
    const left = px > W - 150;
    x.textAlign = left ? 'right' : 'left';
    x.fillText(ci.n, (px + (left ? -14 : 14)) * S, (py + 7) * S);
  });
  return c;
}

/* ---------------- cena ---------------- */
export function startScene(canvas, opts) {
  const gl = canvas.getContext('webgl2', { antialias: true, alpha: false, powerPreference: 'high-performance' });
  if (!gl) throw new Error('webgl2');
  const progSolid = compile(gl, VS_SOLID, FS_SOLID);
  const progGlass = compile(gl, VS_SOLID, FS_GLASS);
  const progBeam = compile(gl, VS_SOLID, FS_BEAM);
  const progSprite = compile(gl, VS_SPRITE, FS_SPRITE);
  const progTex = compile(gl, VS_TEX, FS_TEX);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const FOG = [0.235, 0.075, 0.045];
  const GROUND = -1.2;
  const { cities, cityPt } = opts;

  let meshes = {}, curve = null, stations = [], lamps = [], lights = [], keys = [], planDots = [], mapDots = [], bulbsF = [];
  let texPlan, texMap, texStore, storeReady = false;
  let vw = 1, vh = 1, aspect = 1, fov = 0.87, mobile = false;

  function upload(b) {
    const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
    const buf = (data, loc, size) => {
      const bb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bb);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    buf(b.pos, 0, 3); buf(b.nor, 1, 3); buf(b.col, 2, 3); buf(b.mat, 3, 4); buf(b.s, 4, 1);
    const ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(b.idx), gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    return { vao, count: b.idx.length };
  }
  function quadTex(corners) {
    // corners: [p00, p10, p11, p01] com uv (0,0) (1,0) (1,1) (0,1)
    const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
    const P = new Float32Array(corners.flat()), UV = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
    let bb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bb); gl.bufferData(gl.ARRAY_BUFFER, P, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    bb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bb); gl.bufferData(gl.ARRAY_BUFFER, UV, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
    const ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    return { vao, count: 6 };
  }
  function texFrom(src) {
    const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const ext = gl.getExtension('EXT_texture_filter_anisotropic');
    if (ext) gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 8);
    return t;
  }

  /* --- layout fixo do mundo --- */
  const STORE = { c: [0, 0.75, -93], w: 7.6 };
  STORE.h = STORE.w * 887 / 1774;
  const signPt = [STORE.c[0] - STORE.w / 2 + 0.6778 * STORE.w, STORE.c[1] + STORE.h / 2 - 0.1708 * STORE.h, STORE.c[2] + 0.04];
  const MAP = { c: [0, GROUND + 0.012, -80], w: 5.4 };
  MAP.d = MAP.w * 520 / 560;
  const mapWorld = (px, py) => [MAP.c[0] - MAP.w / 2 + (px / 560) * MAP.w, MAP.c[1] + 0.03, MAP.c[2] - MAP.d / 2 + (py / 520) * MAP.d];
  const PLAN = { c: [0, GROUND + 0.012, -64], w: 5.2 };
  PLAN.d = PLAN.w * 280 / 520;
  const planWorld = (px, py) => [PLAN.c[0] - PLAN.w / 2 + (px / 520) * PLAN.w, PLAN.c[1], PLAN.c[2] - PLAN.d / 2 + (py / 280) * PLAN.d];

  function heroCam() { return { pos: [0, 1.5, 4.4], tgt: [0, 1.2, -4] }; }

  function build(symbolNDC) {
    // ponto de partida: atrás do símbolo da logo
    const hc = heroCam();
    const f = norm(sub(hc.tgt, hc.pos)), r = norm(cross(f, UP)), u = cross(r, f);
    const th = Math.tan(fov / 2);
    const dir = norm(add(f, add(mul(r, symbolNDC[0] * th * aspect), mul(u, symbolNDC[1] * th))));
    const P0 = add(hc.pos, mul(dir, mobile ? 4.6 : 3.4));

    const tb = cityPt(cities[0]), pg = cityPt(cities[1]);
    const TB = add(mapWorld(tb[0], tb[1]), [0, 0.06, 0]);
    const PG = add(mapWorld(pg[0], pg[1]), [0, 0.06, 0]);

    stations = [
      { type: 'hero', p: P0 },
      { type: 'close', p: [0.4, 0.95, -6] },
      { type: 'lustre', p: [-0.9, 2.0, -13] },
      { type: 'pendente', p: [0.9, 1.75, -20] },
      { type: 'arandela', p: [-0.6, 1.35, -27] },
      { type: 'trilho', p: [0.9, 1.85, -34] },
      { type: 'perfil', p: [-0.5, 1.95, -41] },
      { type: 'lanterna', p: [0.9, GROUND + 0.08, -48] },
      { type: 'atelie', p: [0, 1.15, -56] },
      { type: 'planta', p: [0, GROUND + 0.35, -64] },
      { type: 'close', p: [-0.4, 0.9, -71] },
      { type: 'mapa', p: TB },
      { type: 'loja', p: signPt },
    ];
    // pontos de controle do cabo
    const cp = [];
    const swoop = (a, b, i) => {
      const m = lerp3(a, b, 0.5);
      const sx = i % 2 ? 1.7 : -1.7, sy = i % 3 === 0 ? -0.5 : 0.75;
      return add(m, [sx, sy, 0]);
    };
    stations.forEach((st, i) => {
      if (i > 0 && !['atelie', 'planta', 'loja'].includes(st.type)) cp.push({ p: swoop(stations[i - 1].p, st.p, i) });
      if (st.type === 'hero') { cp.push({ p: st.p, st: i }); cp.push({ p: add(st.p, [0.15, -0.35, -1.6]) }); return; }
      if (st.type === 'atelie') { cp.push({ p: [-1.2, 0.4, -52.5] }); cp.push({ p: [-3.0, 1.2, -56.1] }); cp.push({ p: [-1.5, 1.15, -56.05] }); cp.push({ p: st.p, st: i }); cp.push({ p: [1.5, 1.15, -55.95] }); cp.push({ p: [3.0, 1.2, -55.9] }); return; }
      if (st.type === 'planta') { cp.push({ p: [1.6, 0.2, -60.5] }); cp.push({ p: [-2.4, GROUND + 0.35, -64.2] }); cp.push({ p: st.p, st: i }); cp.push({ p: [2.4, GROUND + 0.35, -63.8] }); return; }
      if (st.type === 'lanterna') { cp.push({ p: add(st.p, [-0.9, 0, 0.9]) }); cp.push({ p: st.p, st: i }); cp.push({ p: add(st.p, [0.5, 0, -0.9]) }); return; }
      if (st.type === 'mapa') { cp.push({ p: add(TB, [0, 0.4, 0.8]) }); cp.push({ p: TB, st: i }); cp.push({ p: lerp3(TB, PG, 0.5) }); cp.push({ p: PG, pg: true }); cp.push({ p: add(PG, [0.6, 1.4, -1.6]) }); cp.push({ p: [1.6, 2.8, -86] }); return; }
      if (st.type === 'loja') { cp.push({ p: add(signPt, [0.6, 0.5, 1.6]) }); cp.push({ p: st.p, st: i }); return; }
      cp.push({ p: st.p, st: i });
    });
    // amostragem densa do Catmull-Rom
    const pts = [], stIdx = {};
    let pgIdx = 0;
    for (let i = 0; i < cp.length - 1; i++) {
      const p0 = cp[Math.max(0, i - 1)].p, p1 = cp[i].p, p2 = cp[i + 1].p, p3 = cp[Math.min(cp.length - 1, i + 2)].p;
      const steps = Math.max(8, Math.ceil(len(sub(p2, p1)) / 0.035));
      if (cp[i].st != null) stIdx[cp[i].st] = pts.length;
      if (cp[i].pg) pgIdx = pts.length;
      for (let k = 0; k < steps; k++) pts.push(cr(p0, p1, p2, p3, k / steps));
    }
    pts.push(cp[cp.length - 1].p);
    if (cp[cp.length - 1].st != null) stIdx[cp[cp.length - 1].st] = pts.length - 1;
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + len(sub(pts[i], pts[i - 1])));
    const L = cum[cum.length - 1];
    // quadros de transporte paralelo
    const T = [], N = [], B = [];
    for (let i = 0; i < pts.length; i++) T.push(norm(sub(pts[Math.min(pts.length - 1, i + 1)], pts[Math.max(0, i - 1)])));
    let n0 = norm(cross(T[0], UP)); if (len(n0) < 0.1) n0 = [1, 0, 0];
    N.push(n0); B.push(norm(cross(T[0], n0)));
    for (let i = 1; i < pts.length; i++) {
      let n = sub(N[i - 1], mul(T[i], dot(N[i - 1], T[i])));
      n = norm(n); N.push(n); B.push(norm(cross(T[i], n)));
    }
    curve = { pts, cum, L, T, N, B };
    stations.forEach((st, i) => { st.idx = stIdx[i] ?? 0; st.s = cum[st.idx] / L; });
    const at = (s) => {
      const d = clamp(s, 0, 1) * L;
      let lo = 0, hi = cum.length - 1;
      while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < d) lo = m + 1; else hi = m; }
      return lo;
    };
    curve.at = at;

    /* --- malhas --- */
    const strands = new Batch(), sheath = new Batch(), solid = new Batch(), beams = new Batch();
    const RS = 0.078, RW = 0.017, RO = 0.032, TW = 9;
    const tube = (b, offset, radius, seg, mat) => {
      const base = b.n;
      for (let i = 0; i < pts.length; i++) {
        const c = offset ? add(pts[i], offset(i)) : pts[i];
        for (let j = 0; j <= seg; j++) {
          const a = (j / seg) * Math.PI * 2;
          const nn = add(mul(N[i], Math.cos(a)), mul(B[i], Math.sin(a)));
          b.v(add(c, mul(nn, radius)), nn, mat.c, mat.m, cum[i] / L);
        }
      }
      for (let i = 0; i < pts.length - 1; i++) for (let j = 0; j < seg; j++) {
        const a = base + i * (seg + 1) + j, d = a + seg + 1;
        b.idx.push(a, d, a + 1, a + 1, d, d + 1);
      }
    };
    for (let k = 0; k < 3; k++) {
      const ph = (k / 3) * Math.PI * 2;
      tube(strands, (i) => { const th = cum[i] * TW + ph; return add(mul(N[i], Math.cos(th) * RO), mul(B[i], Math.sin(th) * RO)); }, RW, 7, MAT.copper);
    }
    tube(sheath, null, RS, 26, { c: [1, 1, 1], m: [0, 0, 0, 15] });
    // ponta final no letreiro
    rod(solid, sub(signPt, mul(T[pts.length - 1], 0.08)), add(signPt, [0, 0, 0.01]), RS * 1.4, MAT.brass, 20);

    // piso
    {
      const base = solid.n;
      for (const [x, z] of [[-30, 12], [30, 12], [30, -110], [-30, -110]]) solid.v([x, GROUND, z], [0, 1, 0], MAT.floor.c, MAT.floor.m);
      solid.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
    }

    lamps = []; lights = []; bulbsF = [];
    const lamp = (stIndex, col, lightPos, glow) => {
      const li = lamps.length;
      lamps.push({ st: stIndex, col, I: 0, on: false, t: 0, glow: glow || [], light: lightPos });
      return li;
    };
    const warm = [1, 0.74, 0.45];

    stations.forEach((st, si) => {
      const P = st.p;
      if (st.type === 'lustre') {
        const li = lamp(si, warm, add(P, [0, -1.0, 0]));
        const c = add(P, [0, -0.62, 0]);
        rod(solid, P, c, 0.008, MAT.black);
        cyl(solid, c, 0.55, 0.02, MAT.brass);
        torus(solid, add(P, [0, -1.02, 0]), 0.6, 0.018, MAT.brass);
        torus(solid, add(P, [0, -1.18, 0]), 0.34, 0.014, MAT.brass);
        sphere(solid, add(P, [0, -1.24, 0]), 0.045, MAT.brass);
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * Math.PI * 2;
          const rp = add(P, [Math.cos(a) * 0.6, -1.02, Math.sin(a) * 0.6]);
          rod(solid, add(P, [0, -0.95, 0]), rp, 0.008, MAT.brass, 6);
          cyl(solid, add(rp, [0, 0.11, 0]), 0.11, 0.016, MAT.ivory, 10);
          sphere(solid, add(rp, [0, 0.15, 0]), 0.032, bulb(li), 10);
          lamps[li].glow.push([add(rp, [0, 0.15, 0]), 0.32]);
          const rq = add(P, [Math.cos(a + 0.4) * 0.34, -1.18, Math.sin(a + 0.4) * 0.34]);
          rod(solid, rq, add(rq, [0, -0.16, 0]), 0.006, MAT.ivory, 5);
        }
        beam(beams, add(P, [0, -1.0, 0]), [P[0], GROUND, P[2]], 0.5, 2.2, li, 0.8);
      }
      if (st.type === 'pendente') {
        const li = lamp(si, warm, add(P, [0, -1.1, 0]));
        const top = add(P, [0, -0.62, 0]);
        rod(solid, P, top, 0.008, MAT.black);
        cyl(solid, top, 0.06, 0.03, MAT.brass);
        const dome = [[0.03, 0], [0.07, -0.03], [0.15, -0.12], [0.26, -0.3], [0.34, -0.44], [0.36, -0.46]];
        lathe(solid, dome, 36, add(top, [0, -0.05, 0]), MAT.brass);
        lathe(solid, dome.map(([r, y]) => [r * 0.96, y - 0.004]), 36, add(top, [0, -0.05, 0]), { c: [1, 0.9, 0.7], m: [0.2, 0.2, 0.35, li] });
        const bp = add(top, [0, -0.42, 0]);
        sphere(solid, bp, 0.065, bulb(li), 16);
        lamps[li].glow.push([bp, 0.9]);
        lamps[li].light = add(bp, [0, -0.15, 0]);
        beam(beams, add(top, [0, -0.5, 0]), [P[0], GROUND, P[2]], 0.34, 1.6, li, 1.2);
      }
      if (st.type === 'arandela') {
        const li = lamp(si, warm, add(P, [0, -0.85, 0.3]));
        const wz = P[2] - 0.12;
        box(solid, [P[0], 0.4, wz - 0.06], [3.4, 3.4, 0.1], MAT.wall);
        const sc = [P[0], 0.45, wz + 0.11];
        rod(solid, [P[0], P[1], wz + 0.02], [P[0], 0.68, wz + 0.02], 0.008, MAT.black);
        box(solid, [P[0], 0.45, wz + 0.015], [0.08, 0.34, 0.03], MAT.brass);
        lathe(solid, [[0.1, 0.18], [0.1, -0.18]], 28, sc, MAT.brass);
        sphere(solid, add(sc, [0, 0.16, 0]), 0.05, bulb(li), 12);
        sphere(solid, add(sc, [0, -0.16, 0]), 0.05, bulb(li), 12);
        lamps[li].glow.push([add(sc, [0, 0.2, 0]), 0.5], [add(sc, [0, -0.2, 0]), 0.5]);
        lamps[li].light = add(sc, [0, 0, 0.35]);
        beam(beams, add(sc, [0, 0.18, 0]), add(sc, [0, 1.7, -0.02]), 0.1, 0.7, li, 1.3);
        beam(beams, add(sc, [0, -0.18, 0]), add(sc, [0, -1.6, 0.05]), 0.1, 0.75, li, 1.3);
      }
      if (st.type === 'trilho') {
        const li = lamp(si, warm, add(P, [0, -0.9, 0.4]));
        const ty = P[1] - 0.55;
        rod(solid, P, [P[0], ty, P[2]], 0.008, MAT.black);
        box(solid, [P[0], ty - 0.03, P[2]], [1.5, 0.06, 0.07], MAT.black);
        [-0.5, 0, 0.5].forEach((dx, k) => {
          const a = [P[0] + dx, ty - 0.07, P[2]];
          const g = [P[0] + dx * 2.2 + (k - 1) * 0.3, GROUND, P[2] + 0.9];
          const dir = norm(sub(g, a));
          const tip = add(a, mul(dir, 0.2));
          rod(solid, a, tip, 0.05, MAT.black, 14);
          sphere(solid, add(tip, mul(dir, -0.005)), 0.036, bulb(li), 10);
          lamps[li].glow.push([tip, 0.35]);
          beam(beams, tip, g, 0.05, 0.55, li, 1.6);
        });
      }
      if (st.type === 'perfil') {
        const li = lamp(si, warm, add(P, [0, -0.9, 0]));
        const by = P[1] - 0.7;
        rod(solid, P, [P[0] - 0.75, by, P[2]], 0.005, MAT.black, 5);
        rod(solid, P, [P[0] + 0.75, by, P[2]], 0.005, MAT.black, 5);
        box(solid, [P[0], by, P[2]], [1.8, 0.05, 0.08], MAT.black);
        box(solid, [P[0], by - 0.03, P[2]], [1.74, 0.012, 0.05], bulb(li));
        for (let k = -3; k <= 3; k++) lamps[li].glow.push([[P[0] + k * 0.27, by - 0.035, P[2]], 0.35]);
        for (let k = -1; k <= 1; k++) beam(beams, [P[0] + k * 0.58, by - 0.04, P[2]], [P[0] + k * 1.0, GROUND, P[2]], 0.25, 1.1, li, 0.9);
        beam(beams, [P[0], by + 0.03, P[2]], [P[0], by + 1.2, P[2]], 0.6, 1.5, li, 0.35);
      }
      if (st.type === 'lanterna') {
        const li = lamp(si, warm, add(P, [0.6, 0.6, 0.6]));
        const base = [P[0] + 0.5, GROUND, P[2] - 0.2];
        cyl(solid, add(base, [0, 0.12, 0]), 0.12, 0.09, MAT.black, 16);
        rod(solid, base, add(base, [0, 1.25, 0]), 0.035, MAT.black, 12);
        const lc = add(base, [0, 1.45, 0]);
        box(solid, add(lc, [0, -0.2, 0]), [0.26, 0.03, 0.26], MAT.black);
        [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, c]) => rod(solid, add(lc, [a * 0.12, -0.19, c * 0.12]), add(lc, [a * 0.12, 0.17, c * 0.12]), 0.01, MAT.black, 5));
        lathe(solid, [[0, 0.36], [0.2, 0.17], [0.19, 0.16]], 4, lc, MAT.black);
        sphere(solid, lc, 0.075, bulb(li), 14);
        lamps[li].glow.push([lc, 1.1]);
        lamps[li].light = lc;
        rod(solid, P, base, 0.02, MAT.black, 8);
      }
      if (st.type === 'atelie') {
        // peça sob medida: um perfil de LED de 5 metros, inteiro, que acende de ponta a ponta
        const by = P[1] - 0.75, x0 = P[0] - 2.5, SEG = 5;
        box(solid, [P[0], by, P[2]], [5.04, 0.055, 0.085], MAT.black);
        for (const dx of [-2.2, 0, 2.2]) {
          const i = curve.at(st.s + dx / L);
          rod(solid, pts[i], [P[0] + dx, by + 0.03, P[2]], 0.005, MAT.black, 5);
        }
        for (let k = 0; k < SEG; k++) {
          const cx = x0 + 0.5 + k;
          const li = lamp(si, [1, 0.8, 0.52], [cx, by - 0.5, P[2] + 0.3]);
          // acende em sequência, da esquerda para a direita
          lamps[li].s = st.s - 0.004 + k * 0.0018;
          box(solid, [cx, by - 0.032, P[2]], [0.99, 0.014, 0.06], bulb(li));
          for (let q = 0; q < 4; q++) lamps[li].glow.push([[cx - 0.375 + q * 0.25, by - 0.04, P[2]], 0.34]);
          beam(beams, [cx, by - 0.04, P[2]], [cx, GROUND, P[2] + 0.2], 0.42, 1.0, li, 0.85);
        }
      }
      if (st.type === 'planta') {
        const li = lamp(si, warm, add(PLAN.c, [0, 0.9, 0]));
        planDots = PLAN_PTS.map(([x, y], k) => ({ p: add(planWorld(x, y), [0, 0.03, 0]), k }));
        lamps[li].plan = true;
      }
      if (st.type === 'mapa') {
        const li = lamp(si, [1, 0.8, 0.4], add(TB, [0, 0.6, 0]));
        mapDots = cities.map((ci, k) => { const q = cityPt(ci); return { p: add(mapWorld(q[0], q[1]), [0, 0.02, 0]), k, key: ci.main || ci.big }; });
        lamps[li].map = true;
        // Ponta Grossa acende quando a energia passa por ela
        const lp = lamp(si, [1, 0.8, 0.4], add(PG, [0, 0.6, 0]));
        lamps[lp].s = cum[pgIdx] / L; lamps[lp].glow.push([PG, 0.8]);
        lamps[li].glow.push([TB, 0.8]);
      }
      if (st.type === 'loja') {
        const li = lamp(si, [1, 0.82, 0.55], add(STORE.c, [0, 0.4, 2.2]));
        lamps[li].store = true;
        lamps[li].glow.push([signPt, 0.9]);
        // moldura discreta
        box(solid, [STORE.c[0], STORE.c[1], STORE.c[2] - 0.08], [STORE.w + 0.16, STORE.h + 0.16, 0.1], MAT.black);
      }
    });
    lamps.forEach((l) => { if (l.s == null) l.s = stations[l.st].s; });

    for (const k of Object.keys(meshes)) if (meshes[k].vao) gl.deleteVertexArray(meshes[k].vao);
    meshes = { strands: upload(strands), sheath: upload(sheath), solid: upload(solid), beams: upload(beams) };
    meshes.store = quadTex([
      [STORE.c[0] - STORE.w / 2, STORE.c[1] + STORE.h / 2, STORE.c[2]], [STORE.c[0] + STORE.w / 2, STORE.c[1] + STORE.h / 2, STORE.c[2]],
      [STORE.c[0] + STORE.w / 2, STORE.c[1] - STORE.h / 2, STORE.c[2]], [STORE.c[0] - STORE.w / 2, STORE.c[1] - STORE.h / 2, STORE.c[2]],
    ]);
    const flat = (C, w, d) => quadTex([[C[0] - w / 2, C[1], C[2] - d / 2], [C[0] + w / 2, C[1], C[2] - d / 2], [C[0] + w / 2, C[1], C[2] + d / 2], [C[0] - w / 2, C[1], C[2] + d / 2]]);
    meshes.plan = flat(PLAN.c, PLAN.w, PLAN.d);
    meshes.map = flat(MAP.c, MAP.w, MAP.d);

    /* --- câmeras-chave: estação, mergulho no cabo, estação... --- */
    keys = [];
    const frame = (st) => {
      const P = st.p;
      switch (st.type) {
        case 'hero': return heroCam();
        case 'lustre': { const L0 = add(P, [0, -0.9, 0]); return { pos: add(L0, [1.3, 0.55, 4.1]), tgt: L0, sh: 1 }; }
        case 'pendente': { const L0 = add(P, [0, -0.95, 0]); return { pos: add(L0, [-1.2, 0.35, 3.6]), tgt: L0, sh: 1 }; }
        case 'arandela': { const L0 = [P[0], 0.4, P[2]]; return { pos: add(L0, [1.6, 0.25, 3.9]), tgt: L0, sh: 1 }; }
        case 'trilho': { const L0 = add(P, [0, -1.2, 0.4]); return { pos: add(L0, [-1.4, 0.7, 4.2]), tgt: L0, sh: 1 }; }
        case 'perfil': { const L0 = add(P, [0, -1.0, 0]); return { pos: add(L0, [1.4, 0.4, 4.2]), tgt: L0, sh: 1 }; }
        case 'lanterna': { const L0 = add(P, [0.4, 0.9, -0.2]); return { pos: add(L0, [-1.6, 0.6, 3.7]), tgt: L0, sh: 1 }; }
        case 'atelie': { const L0 = add(P, [0, -0.75, 0]); return { pos: add(L0, [0.4, 0.55, 5.4]), tgt: L0, sh: 0.55 }; }
        case 'planta': return { pos: [0.6, 3.1, -59.2], tgt: add(PLAN.c, [0, 0, -0.2]), sh: 1.0 };
        case 'mapa': return { pos: [0.6, 3.8, -74.4], tgt: add(MAP.c, [0, 0, -0.3]), sh: 1.0 };
        case 'loja': return { pos: [0.3, 0.9, -84.6], tgt: add(STORE.c, [0, 0.05, 0]), sh: 0.75, store: true };
        default: { // close: rente ao cabo, olhando para onde ele vai
          const i = st.idx, C = pts[i], t = T[i];
          const side = norm(cross(t, UP));
          return { pos: add(add(add(C, mul(side, -0.95)), [0, 0.3, 0]), mul(t, -0.3)), tgt: add(add(C, mul(t, 1.6)), mul(side, -0.15)), sh: 0.55 };
        }
      }
    };
    const dive = (sa, sb, k) => {
      const i = curve.at(lerp(sa, sb, 0.5)), C = pts[i], t = T[i];
      const side = norm(cross(t, UP)), sgn = k % 2 ? 1 : -1;
      return { pos: add(add(add(C, mul(side, 0.6 * sgn)), [0, 0.16, 0]), mul(t, -0.4)), tgt: add(C, mul(t, 1.2)), sh: 0.7, dive: true };
    };
    stations.forEach((st, k) => {
      keys.push(frame(st));
      if (k < stations.length - 1) keys.push(dive(st.s, stations[k + 1].s, k));
    });
  }

  /* --- texturas --- */
  texPlan = texFrom(planTexture());
  texMap = texFrom(mapTexture(cities, cityPt));
  const img = new Image();
  img.onload = () => { texStore = texFrom(img); storeReady = true; };
  img.src = storeImg;
  // redesenha textas com a fonte da marca quando ela carregar
  if (document.fonts) document.fonts.ready.then(() => { texPlan = texFrom(planTexture()); texMap = texFrom(mapTexture(cities, cityPt)); });

  /* --- sprites (brilhos, energia, poeira) --- */
  const MAXS = 900;
  const sp = { pos: new Float32Array(MAXS * 4 * 3), cor: new Float32Array(MAXS * 4 * 2), col: new Float32Array(MAXS * 4 * 3), size: new Float32Array(MAXS * 4) };
  const spVao = gl.createVertexArray(); gl.bindVertexArray(spVao);
  const spBuf = {};
  [['pos', 0, 3], ['cor', 1, 2], ['col', 2, 3], ['size', 3, 1]].forEach(([k, loc, n]) => {
    spBuf[k] = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, spBuf[k]);
    gl.bufferData(gl.ARRAY_BUFFER, sp[k].byteLength, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, n, gl.FLOAT, false, 0, 0);
  });
  const spIdx = new Uint16Array(MAXS * 6);
  for (let i = 0; i < MAXS; i++) spIdx.set([i * 4, i * 4 + 1, i * 4 + 2, i * 4, i * 4 + 2, i * 4 + 3], i * 6);
  const ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, spIdx, gl.STATIC_DRAW);
  gl.bindVertexArray(null);
  let nS = 0;
  const CORN = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const pushS = (p, size, c) => {
    if (nS >= MAXS) return;
    for (let k = 0; k < 4; k++) {
      const o = nS * 4 + k;
      sp.pos.set(p, o * 3); sp.cor.set(CORN[k], o * 2); sp.col.set(c, o * 3); sp.size[o] = size;
    }
    nS++;
  };
  const motes = Array.from({ length: reduce ? 0 : 260 }, () => ({ o: [Math.random() * 10 - 5, Math.random() * 5 - 2, Math.random() * 10 - 5], v: [(Math.random() - 0.5) * 0.05, Math.random() * 0.04 + 0.01, (Math.random() - 0.5) * 0.05], ph: Math.random() * 6 }));
  const flow = Array.from({ length: reduce ? 0 : 140 }, () => ({ d: Math.random() * 8, sp: 0.8 + Math.random() * 1.8, r: Math.random() * 0.04, a: Math.random() * 6.28 }));

  /* --- estado dirigido pela rolagem --- */
  let anchors = [], uS = 0, eCur = 0, cam = null;
  const ease = (t) => t - (0.86 * Math.sin(2 * Math.PI * t)) / (2 * Math.PI);

  function layout() {
    vw = window.innerWidth; vh = window.innerHeight; aspect = vw / vh; mobile = vw <= 760;
    fov = (aspect < 1 ? 64 : 48) * Math.PI / 180;
    // limita os pixels renderizados para manter a fluidez em telas grandes
    const dpr = Math.min(mobile ? 1.5 : 1.75, window.devicePixelRatio || 1, Math.sqrt(2.6e6 / (vw * vh)));
    canvas.width = Math.round(vw * dpr); canvas.height = Math.round(vh * dpr);
    // posição do símbolo da logo na tela (no topo da página)
    const logo = document.querySelector('.hero-logo img');
    let ndc = [0.06, 0.55];
    if (logo) {
      const r = logo.getBoundingClientRect(); const sy = window.scrollY;
      const x = r.left + r.width * 0.743, y = r.top + sy + r.height * 0.86;
      ndc = [(x / vw) * 2 - 1, 1 - (y / vh) * 2];
    }
    build(ndc);
    const els = [...document.querySelectorAll('[data-st]')].sort((a, b) => +a.dataset.st - +b.dataset.st);
    anchors = els.map((el) => {
      const r = el.getBoundingClientRect();
      const top = r.top + window.scrollY;
      const k = +el.dataset.st;
      // no celular o painel de texto fica embaixo: a estação é quando o painel encosta no rodapé da tela
      const y = mobile ? top + r.height - vh * 0.94 : r.height > vh * 0.8 ? top - vh * 0.13 : top + r.height / 2 - vh * 0.5;
      return { el, k, y: k === 0 ? 0 : Math.max(0, y) };
    });
    for (let i = 1; i < anchors.length; i++) anchors[i].y = Math.max(anchors[i].y, anchors[i - 1].y + 10);
  }

  function scrollU() {
    const y = window.scrollY;
    if (!anchors.length) return 0;
    if (y <= anchors[0].y) return 0;
    for (let i = 0; i < anchors.length - 1; i++) {
      if (y < anchors[i + 1].y) {
        const t = (y - anchors[i].y) / (anchors[i + 1].y - anchors[i].y);
        return anchors[i].k + ease(clamp(t, 0, 1)) * (anchors[i + 1].k - anchors[i].k);
      }
    }
    return anchors[anchors.length - 1].k;
  }

  function camAt(u) {
    const q = clamp(u * 2, 0, keys.length - 1);
    const i = Math.floor(q), t = smooth(q - i);
    const k0 = keys[Math.max(0, i - 1)], k1 = keys[i], k2 = keys[Math.min(keys.length - 1, i + 1)], k3 = keys[Math.min(keys.length - 1, i + 2)];
    const pos = cr(k0.pos, k1.pos, k2.pos, k3.pos, t);
    const tgt = cr(k0.tgt, k1.tgt, k2.tgt, k3.tgt, t);
    const sh = lerp(k1.sh || 0, k2.sh || 0, t);
    const store = (k1.store && t < 0.5) || (k2.store && t >= 0.5);
    return { pos, tgt, sh, store };
  }

  function sAtU(u) {
    const k = clamp(Math.floor(u), 0, stations.length - 1), t = u - k;
    const a = stations[k].s, b = stations[Math.min(stations.length - 1, k + 1)].s;
    return lerp(a, b, clamp(t, 0, 1));
  }

  let t0 = performance.now(), last = t0, raf, hidden = false;
  const io = new IntersectionObserver((e) => { hidden = !e[0].isIntersecting; }); io.observe(canvas);

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const time = (now - t0) / 1000;
    if (hidden || !curve) return;
    const uT = scrollU();
    uS += (uT - uS) * (reduce ? 1 : 1 - Math.pow(0.0025, dt));
    if (Math.abs(uT - uS) < 1e-4) uS = uT;
    // energia: nasce devagar e segue um pouco à frente da câmera
    const born = reduce ? 1 : smooth(clamp((time - 0.3) / 2.6, 0, 1));
    const eT = Math.min(1, sAtU(uS + 0.42)) * born + (1 - born) * 0;
    const gap = Math.abs(eT - eCur);
    eCur += (eT - eCur) * (1 - Math.pow(gap > 0.04 ? 0.0005 : 0.02, dt));
    if (uS >= stations.length - 1.08) eCur = Math.max(eCur, lerp(eCur, 1, 1 - Math.pow(0.05, dt)));

    // luminárias acendem (com uma tremida ao ligar)
    for (const l of lamps) {
      const on = eCur >= l.s - 0.0025;
      if (on && !l.on) { l.on = true; l.t = time; }
      if (!on && l.on) { l.on = false; }
      const target = l.on ? 1 : 0;
      l.I += (target - l.I) * (1 - Math.pow(l.on ? 0.03 : 0.0005, dt));
      let fl = 1;
      if (l.on && !reduce) {
        const a = time - l.t;
        if (a < 0.7) fl = 0.35 + 0.65 * (Math.sin(a * 60) > -0.2 ? 1 : 0.15);
        else fl = 0.97 + 0.03 * Math.sin(time * 9 + l.s * 40);
      }
      l.F = l.I * fl;
    }
    // texto ligado à estação acende junto
    for (const a of anchors) {
      const st = stations[a.k];
      const lit = st && eCur >= st.s - 0.0025;
      if (lit !== a.lit) { a.lit = lit; a.el.toggleAttribute('data-lit', lit); }
    }

    cam = camAt(uS);
    // enquadramento: no desktop o objeto vai para a direita (texto à esquerda); no celular, para cima
    const fwd = norm(sub(cam.tgt, cam.pos)), right = norm(cross(fwd, UP)), up = cross(right, fwd);
    const dist = len(sub(cam.tgt, cam.pos));
    let tgt = cam.tgt;
    if (mobile) tgt = sub(tgt, mul(up, cam.sh * dist * 0.28));
    else tgt = sub(tgt, mul(right, cam.sh * dist * 0.24));
    if (cam.store && mobile) tgt = add(tgt, mul(right, (signPt[0] - STORE.c[0]) * 0.75));
    // leve respiração da câmera
    const br = reduce ? [0, 0, 0] : [Math.sin(time * 0.31) * 0.03, Math.sin(time * 0.43) * 0.025, 0];
    const eye = add(cam.pos, br);
    const V = lookAt(eye, tgt), Pm = perspective(fov, aspect, 0.03, 140), VP = mat4mul(Pm, V);

    // luzes: cabeça da energia + luminárias acesas mais próximas
    const iE = curve.at(eCur), head = curve.pts[iE];
    const cand = lamps.filter((l) => l.F > 0.02).map((l) => ({ p: l.light, c: mul(l.col, l.F * (l.store ? 2.2 : 2.6)), d: len(sub(l.light, eye)) })).sort((a, b) => a.d - b.d).slice(0, 7);
    const pulse = 1 + 0.15 * Math.sin(time * 3);
    const LP = [head, ...cand.map((c) => c.p)], LC = [[1.0 * pulse, 0.62 * pulse, 0.25 * pulse], ...cand.map((c) => c.c)];
    const lpA = new Float32Array(24), lcA = new Float32Array(24);
    LP.forEach((p, i) => lpA.set(p, i * 3)); LC.forEach((c, i) => lcA.set(c, i * 3));
    const lampI = new Float32Array(16), lampC = new Float32Array(48);
    lamps.forEach((l, i) => { if (i < 15) { lampI[i] = l.F; lampC.set(l.col, i * 3); } });

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(FOG[0], FOG[1], FOG[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); gl.depthMask(true); gl.disable(gl.BLEND); gl.disable(gl.CULL_FACE);
    const fogD = mobile ? 0.085 : 0.075;
    const common = (pr) => {
      gl.useProgram(pr.p);
      const u = pr.u;
      if (u.uVP) gl.uniformMatrix4fv(u.uVP, false, VP);
      if (u.uCam) gl.uniform3fv(u.uCam, eye);
      if (u.uLP) gl.uniform3fv(u.uLP, lpA);
      if (u.uLC) gl.uniform3fv(u.uLC, lcA);
      if (u.uNL) gl.uniform1i(u.uNL, LP.length);
      if (u.uFog) gl.uniform3fv(u.uFog, FOG);
      if (u.uFogD) gl.uniform1f(u.uFogD, fogD);
      if (u.uLampI) gl.uniform1fv(u.uLampI, lampI);
      if (u.uLampC) gl.uniform3fv(u.uLampC, lampC);
      if (u.uE) gl.uniform1f(u.uE, eCur);
      if (u.uT) gl.uniform1f(u.uT, time);
      if (u.uLen) gl.uniform1f(u.uLen, curve.L);
    };
    const draw = (m) => { gl.bindVertexArray(m.vao); gl.drawElements(gl.TRIANGLES, m.count, gl.UNSIGNED_INT, 0); };

    common(progSolid);
    gl.uniform1f(progSolid.u.uCable, 0); draw(meshes.solid);
    gl.uniform1f(progSolid.u.uCable, 1); draw(meshes.strands);

    // planos com textura (planta, mapa, fachada)
    const storeL = lamps.find((l) => l.store);
    common(progTex);
    gl.activeTexture(gl.TEXTURE0); gl.uniform1i(progTex.u.uTex, 0);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false);
    const planL = lamps.find((l) => l.plan), mapL = lamps.find((l) => l.map);
    const drawQ = (m, tex, bright, sat, glowAt = [0, 0], glow = 0) => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1f(progTex.u.uBright, bright); gl.uniform1f(progTex.u.uSat, sat);
      gl.uniform2fv(progTex.u.uGlowAt, glowAt); gl.uniform1f(progTex.u.uGlow, glow);
      gl.bindVertexArray(m.vao); gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };
    drawQ(meshes.plan, texPlan, 0.35 + 0.9 * (planL ? planL.I : 0), 1);
    drawQ(meshes.map, texMap, 0.35 + 0.9 * (mapL ? mapL.I : 0), 1);
    gl.depthMask(true); gl.disable(gl.BLEND);
    if (storeReady) {
      const sI = storeL ? storeL.F : 0;
      drawQ(meshes.store, texStore, 0.48 + 0.92 * sI, 0.45 + 0.75 * sI, [0.6778, 0.1708], sI * 0.55);
    }

    // capa translúcida do cabo
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false);
    gl.enable(gl.CULL_FACE); gl.cullFace(gl.FRONT);
    common(progGlass); draw(meshes.sheath);
    gl.cullFace(gl.BACK); draw(meshes.sheath);
    gl.disable(gl.CULL_FACE);

    // feixes de luz
    gl.blendFunc(gl.ONE, gl.ONE);
    common(progBeam); draw(meshes.beams);

    // sprites
    nS = 0;
    const hd = clamp(len(sub(head, eye)) / 2.2, 0.25, 1);
    pushS(head, 0.55 * pulse * hd, [1, 0.72, 0.32]);
    pushS(head, 0.12 * hd, [1, 0.95, 0.8]);
    if (uS < 0.6) pushS(curve.pts[0], 0.18 + 0.1 * born, [0.8, 0.55, 0.25]);
    for (const l of lamps) if (l.F > 0.02) for (const [p, s] of l.glow) pushS(p, s * (0.6 + 0.4 * l.F), mul(l.col, l.F * 0.9));
    if (planL && planL.I > 0.02) for (const d of planDots) {
      const a = clamp((planL.I * 3.2 - d.k * 0.14), 0, 1);
      if (a > 0) { pushS(d.p, 0.32 * a, [1 * a, 0.8 * a, 0.45 * a]); pushS(d.p, 0.06, [a, a * 0.95, a * 0.85]); }
    }
    if (mapL && mapL.I > 0.02) for (const d of mapDots) {
      const a = clamp((mapL.I * 3 - d.k * 0.2), 0, 1);
      if (a > 0) pushS(d.p, (d.key ? 0.3 : 0.16) * a, [a, 0.78 * a, 0.35 * a]);
    }
    // energia correndo por dentro do cabo
    const dE = eCur * curve.L;
    for (const f of flow) {
      const dd = dE - 8 + ((f.d + time * f.sp) % 8);
      if (dd < 0) continue;
      const i = curve.at(dd / curve.L), p = curve.pts[i];
      const off = add(mul(curve.N[i], Math.cos(f.a + time) * f.r), mul(curve.B[i], Math.sin(f.a + time) * f.r));
      pushS(add(p, off), 0.03, [1, 0.8, 0.45]);
    }
    // poeira suspensa iluminada
    for (const m of motes) {
      const o = m.o;
      o[0] += m.v[0] * dt; o[1] += m.v[1] * dt; o[2] += m.v[2] * dt;
      const p = [eye[0] + ((o[0] % 10) + 15) % 10 - 5, eye[1] + ((o[1] % 5) + 7.5) % 5 - 2.5, eye[2] - 1 - (((o[2] % 10) + 10) % 10)];
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(time * 0.7 + m.ph));
      pushS(p, 0.012, [0.5 * tw, 0.36 * tw, 0.22 * tw]);
    }
    gl.useProgram(progSprite.p);
    gl.uniformMatrix4fv(progSprite.u.uV, false, V); gl.uniformMatrix4fv(progSprite.u.uP, false, Pm);
    gl.uniform3fv(progSprite.u.uCam, eye); gl.uniform1f(progSprite.u.uFogD, fogD);
    gl.bindVertexArray(spVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, spBuf.pos); gl.bufferSubData(gl.ARRAY_BUFFER, 0, sp.pos.subarray(0, nS * 12));
    gl.bindBuffer(gl.ARRAY_BUFFER, spBuf.cor); gl.bufferSubData(gl.ARRAY_BUFFER, 0, sp.cor.subarray(0, nS * 8));
    gl.bindBuffer(gl.ARRAY_BUFFER, spBuf.col); gl.bufferSubData(gl.ARRAY_BUFFER, 0, sp.col.subarray(0, nS * 12));
    gl.bindBuffer(gl.ARRAY_BUFFER, spBuf.size); gl.bufferSubData(gl.ARRAY_BUFFER, 0, sp.size.subarray(0, nS * 4));
    gl.drawElements(gl.TRIANGLES, nS * 6, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
    gl.depthMask(true); gl.disable(gl.BLEND);
  }

  let rt;
  const relayout = () => { clearTimeout(rt); rt = setTimeout(layout, 150); };
  layout();
  const ro = new ResizeObserver(relayout); ro.observe(document.body);
  window.addEventListener('resize', relayout);
  if (document.fonts) document.fonts.ready.then(relayout);
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener('resize', relayout); };
}

export { storeImg };
