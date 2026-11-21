import * as THREE from 'three';

// ---------------------------------------------------------------------------------
// Procedural High-Res Canvas Texture Generators
// ---------------------------------------------------------------------------------

// Helper: Generates realistic corrugated kraft cardboard texture
export function createCardboardTexture(): { map: THREE.CanvasTexture; bump: THREE.CanvasTexture } {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base kraft paper tone
  ctx.fillStyle = '#c58e5a';
  ctx.fillRect(0, 0, 1024, 1024);

  // Perlin-style noise simulation for fibrous paper pulp
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 22;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain * 0.85));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain * 0.7));
  }
  ctx.putImageData(imgData, 0, 0);

  // Subtle vertical corrugated ribbed stripes (subtle ridge shadows)
  for (let x = 0; x < 1024; x += 16) {
    ctx.fillStyle = 'rgba(70, 38, 16, 0.05)';
    ctx.fillRect(x, 0, 5, 1024);
    ctx.fillStyle = 'rgba(255, 240, 220, 0.04)';
    ctx.fillRect(x + 5, 0, 4, 1024);
  }

  // Organic cardboard pulp specks
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const len = Math.random() * 6 + 2;
    ctx.strokeStyle = Math.random() > 0.4 ? 'rgba(60, 32, 12, 0.25)' : 'rgba(240, 230, 210, 0.3)';
    ctx.lineWidth = Math.random() * 1.5 + 0.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + len, y + (Math.random() - 0.5) * 3);
    ctx.stroke();
  }

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;

  // Bump map for realistic tactile relief
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 512;
  bumpCanvas.height = 512;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 512, 512);

  for (let x = 0; x < 512; x += 8) {
    bCtx.fillStyle = '#686868';
    bCtx.fillRect(x, 0, 3, 512);
    bCtx.fillStyle = '#949494';
    bCtx.fillRect(x + 3, 0, 3, 512);
  }

  const bump = new THREE.CanvasTexture(bumpCanvas);
  bump.wrapS = THREE.RepeatWrapping;
  bump.wrapT = THREE.RepeatWrapping;

  return { map, bump };
}

// Helper: Generates realistic brushed metal texture (for laptop, camera rings, headphones)
export function createBrushedMetalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#cfd3d8';
  ctx.fillRect(0, 0, 512, 512);

  for (let y = 0; y < 512; y += 2) {
    const shade = (Math.random() - 0.5) * 30;
    ctx.fillStyle = `rgba(${190 + shade}, ${195 + shade}, ${205 + shade}, 0.25)`;
    ctx.fillRect(0, y, 512, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Helper: Generates fine leather / grip pebbled texture (for headphones cushion, camera grip, gamepad)
export function createPebbledLeatherTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1c1e22';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random() * 1.8 + 0.8;
    ctx.fillStyle = Math.random() > 0.5 ? '#111215' : '#2b2e35';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// Helper: Generates realistic sunburst acoustic guitar finish with spruce wood grain
export function createSunburstTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm radial sunburst centered around soundhole & bridge zone
  const grad = ctx.createRadialGradient(256, 268, 22, 256, 256, 252);
  grad.addColorStop(0, '#fde68a'); // Warm golden honey spruce center
  grad.addColorStop(0.28, '#f59e0b'); // Amber burst
  grad.addColorStop(0.56, '#b45309'); // Rich sienna mahogany
  grad.addColorStop(0.82, '#451a03'); // Deep burnt umber
  grad.addColorStop(1.0, '#160701'); // Classic espresso edge burst
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle vertical Sitka spruce wood grain & medullary rays
  for (let x = 0; x < 512; x += 3) {
    const alpha = x % 9 === 0 ? 0.055 : 0.025;
    ctx.fillStyle = `rgba(28, 10, 2, ${alpha})`;
    ctx.fillRect(x, 0, 1.5, 512);
  }
  for (let y = 0; y < 512; y += 6) {
    ctx.fillStyle = 'rgba(255, 232, 185, 0.02)';
    ctx.fillRect(0, y, 512, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Helper: Generates soft matte-white perforated leather texture for white studio headphones
export function createWhiteLeatherTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#f3f5f8';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 1600; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const r = Math.random() * 1.1 + 0.5;
    ctx.fillStyle = Math.random() > 0.5 ? '#e4e9f0' : '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// ---------------------------------------------------------------------------------
// Shared Geometry & Cached Procedural Texture Helpers (Zero Redundant Canvas Gen)
// ---------------------------------------------------------------------------------

function makeRoundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const hw = w / 2;
  const hh = h / 2;
  const cr = Math.min(r, hw, hh);
  const s = new THREE.Shape();
  s.moveTo(-hw + cr, -hh);
  s.lineTo(hw - cr, -hh);
  s.quadraticCurveTo(hw, -hh, hw, -hh + cr);
  s.lineTo(hw, hh - cr);
  s.quadraticCurveTo(hw, hh, hw - cr, hh);
  s.lineTo(-hw + cr, hh);
  s.quadraticCurveTo(-hw, hh, -hw, hh - cr);
  s.lineTo(-hw, -hh + cr);
  s.quadraticCurveTo(-hw, -hh, -hw + cr, -hh);
  return s;
}

function normalizeExtrudeUVs(geo: THREE.BufferGeometry): void {
  geo.computeBoundingBox();
  if (!geo.boundingBox) return;
  const { min, max } = geo.boundingBox;
  const spanX = Math.max(0.001, max.x - min.x);
  const spanZ = Math.max(0.001, max.z - min.z);
  const posAttr = geo.attributes.position;
  const uvAttr = geo.attributes.uv;
  if (!uvAttr) return;
  for (let i = 0; i < posAttr.count; i++) {
    uvAttr.setXY(i, (posAttr.getX(i) - min.x) / spanX, (posAttr.getZ(i) - min.z) / spanZ);
  }
  uvAttr.needsUpdate = true;
}

let _cachedMetalTex: THREE.CanvasTexture | null = null;
function getCachedBrushedMetal(): THREE.CanvasTexture {
  if (!_cachedMetalTex) _cachedMetalTex = createBrushedMetalTexture();
  return _cachedMetalTex;
}

let _cachedLeatherTex: THREE.CanvasTexture | null = null;
function getCachedPebbledLeather(): THREE.CanvasTexture {
  if (!_cachedLeatherTex) _cachedLeatherTex = createPebbledLeatherTexture();
  return _cachedLeatherTex;
}

let _cachedWhiteLeatherTex: THREE.CanvasTexture | null = null;
function getCachedWhiteLeather(): THREE.CanvasTexture {
  if (!_cachedWhiteLeatherTex) _cachedWhiteLeatherTex = createWhiteLeatherTexture();
  return _cachedWhiteLeatherTex;
}

let _cachedCarbonTex: THREE.CanvasTexture | null = null;
function getCachedCarbonWeave(): THREE.CanvasTexture {
  if (_cachedCarbonTex) return _cachedCarbonTex;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#18202c';
  ctx.fillRect(0, 0, 128, 128);
  for (let y = 0; y < 128; y += 8) {
    for (let x = 0; x < 128; x += 8) {
      ctx.fillStyle = ((x + y) / 8) % 2 === 0 ? '#243042' : '#10161f';
      ctx.fillRect(x, y, 7, 4);
      ctx.fillStyle = '#2d3b52';
      ctx.fillRect(x + 2, y + 4, 4, 4);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  _cachedCarbonTex = tex;
  return tex;
}

let _cachedGoldMeshTex: THREE.CanvasTexture | null = null;
function getCachedGoldMesh(): THREE.CanvasTexture {
  if (_cachedGoldMeshTex) return _cachedGoldMeshTex;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#78580e';
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 3;
  for (let i = -256; i < 512; i += 14) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 256, 256);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(i + 256, 0);
    ctx.lineTo(i, 256);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);
  _cachedGoldMeshTex = tex;
  return tex;
}

let _cachedEnamelTex: THREE.CanvasTexture | null = null;
function getCachedEnamelSpeckle(): THREE.CanvasTexture {
  if (_cachedEnamelTex) return _cachedEnamelTex;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 420; i++) {
    ctx.fillStyle = i % 4 === 0 ? '#93c5fd' : '#f8fafc';
    ctx.beginPath();
    ctx.arc(Math.random() * 256, Math.random() * 256, Math.random() * 1.6 + 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  _cachedEnamelTex = tex;
  return tex;
}

let _cachedPageEdgesTex: THREE.CanvasTexture | null = null;
function getCachedPageEdges(): THREE.CanvasTexture {
  if (_cachedPageEdgesTex) return _cachedPageEdgesTex;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#fbf7ec';
  ctx.fillRect(0, 0, 256, 128);
  for (let y = 0; y < 128; y += 3) {
    ctx.fillStyle = y % 6 === 0 ? 'rgba(160, 140, 105, 0.28)' : 'rgba(255, 255, 255, 0.35)';
    ctx.fillRect(0, y, 256, 1.5);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  _cachedPageEdgesTex = tex;
  return tex;
}

let _cachedSkateBottomTex: THREE.CanvasTexture | null = null;
function getCachedSkateBottom(): THREE.CanvasTexture {
  if (_cachedSkateBottomTex) return _cachedSkateBottomTex;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#d99b52';
  ctx.fillRect(0, 0, 256, 512);
  // Subtle wood veneer lines
  for (let x = 0; x < 256; x += 6) {
    ctx.fillStyle = 'rgba(110, 58, 12, 0.08)';
    ctx.fillRect(x, 0, 2, 512);
  }
  // Bold Retro Cruiser Stripe Graphic
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 145, 256, 220);
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(0, 165, 256, 48);
  ctx.fillStyle = '#f97316';
  ctx.fillRect(0, 225, 256, 48);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(0, 285, 256, 42);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  _cachedSkateBottomTex = tex;
  return tex;
}

let _cachedLaptopScreenTex: THREE.CanvasTexture | null = null;
function getCachedLaptopScreen(): THREE.CanvasTexture {
  if (_cachedLaptopScreenTex) return _cachedLaptopScreenTex;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 512, 320);
  grad.addColorStop(0, '#1d4ed8');
  grad.addColorStop(0.5, '#6d28d9');
  grad.addColorStop(1, '#be185d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 320);

  // Layered Alpine Ridge Silhouettes
  ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
  ctx.beginPath();
  ctx.moveTo(0, 320);
  ctx.lineTo(110, 155);
  ctx.lineTo(235, 225);
  ctx.lineTo(360, 125);
  ctx.lineTo(512, 235);
  ctx.lineTo(512, 320);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(0, 320);
  ctx.lineTo(155, 195);
  ctx.lineTo(280, 255);
  ctx.lineTo(415, 165);
  ctx.lineTo(512, 320);
  ctx.fill();

  // Warm Sunset Orb
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(388, 92, 28, 0, Math.PI * 2);
  ctx.fill();

  // Top translucent menu bar & floating Dock
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.fillRect(0, 0, 512, 18);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.beginPath();
  ctx.roundRect(140, 286, 232, 24, 8);
  ctx.fill();
  const dockColors = ['#38bdf8', '#34d399', '#fbbf24', '#f472b6', '#a78bfa', '#f87171'];
  dockColors.forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.roundRect(156 + i * 34, 290, 18, 16, 4);
    ctx.fill();
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  _cachedLaptopScreenTex = tex;
  return tex;
}

let _cachedSwitchScreenTex: THREE.CanvasTexture | null = null;
function getCachedSwitchScreen(): THREE.CanvasTexture {
  if (_cachedSwitchScreenTex) return _cachedSwitchScreenTex;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 288;
  const ctx = canvas.getContext('2d')!;
  const sky = ctx.createLinearGradient(0, 0, 0, 288);
  sky.addColorStop(0, '#0284c7');
  sky.addColorStop(0.65, '#38bdf8');
  sky.addColorStop(1, '#bae6fd');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 512, 288);

  // Arcade Racing / Adventure Horizon & Track
  ctx.fillStyle = '#15803d';
  ctx.fillRect(0, 175, 512, 113);
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.moveTo(215, 175);
  ctx.lineTo(297, 175);
  ctx.lineTo(430, 288);
  ctx.lineTo(82, 288);
  ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(253, 185, 6, 90);

  // HUD Cards
  ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
  ctx.beginPath();
  ctx.roundRect(18, 16, 130, 32, 8);
  ctx.fill();
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(28, 28, 102, 8);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  _cachedSwitchScreenTex = tex;
  return tex;
}

let _cachedWatchFaceTex: THREE.CanvasTexture | null = null;
function getCachedSmartwatchFace(): THREE.CanvasTexture {
  if (_cachedWatchFaceTex) return _cachedWatchFaceTex;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, 256, 320);

  // Concentric OLED Activity Rings
  const rings: Array<[number, string, number]> = [
    [54, '#f43f5e', 1.6],
    [40, '#22c55e', 1.35],
    [26, '#06b6d4', 1.85],
  ];
  rings.forEach(([r, col, sweep]) => {
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(128, 182, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = col;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(128, 182, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * sweep);
    ctx.stroke();
  });

  // Crisp Digital Time Header
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 54px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('10:09', 128, 86);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('72 BPM  •  98%', 128, 282);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  _cachedWatchFaceTex = tex;
  return tex;
}

let _cachedDSLRScreenTex: THREE.CanvasTexture | null = null;
function getCachedDSLRRearScreen(): THREE.CanvasTexture {
  if (_cachedDSLRScreenTex) return _cachedDSLRScreenTex;
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 220;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 320, 220);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(0.6, '#1e3a5f');
  grad.addColorStop(1, '#334155');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 320, 220);

  // Rule-of-thirds viewfinder grid
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = 1;
  [106, 213].forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 185);
    ctx.stroke();
  });
  [65, 130].forEach((y) => {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(320, y);
    ctx.stroke();
  });

  // Emerald AF center lock bracket
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 3;
  ctx.strokeRect(128, 72, 64, 46);

  // Bottom exposure bar
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(0, 186, 320, 34);
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('1/250   f/2.8   ISO 400', 18, 208);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  _cachedDSLRScreenTex = tex;
  return tex;
}

// ---------------------------------------------------------------------------------
// 1. Theme Settings & Solid 3D Open Cardboard Box with Live Dynamic Color Swapping
// ---------------------------------------------------------------------------------

export interface BoxThemeSettings {
  baseColor: string;
  paperNoiseLight: string;
  paperNoiseDark: string;
  ribColor: string;
  frameStroke: string;
  textInk: string;
  textEdge: string;
  tagInk: string;
  innerFloorColor: number;
}

export function getBoxThemeSettings(themeId?: string, themeObj?: any): BoxThemeSettings {
  const id = themeId || themeObj?.id || 'royal-lavender';

  switch (id) {
    case 'royal-lavender':
      return {
        baseColor: '#bfa3d1', // Rich lavender-tinted kraft
        paperNoiseLight: 'rgba(245, 235, 255, 0.28)',
        paperNoiseDark: 'rgba(59, 30, 84, 0.16)',
        ribColor: 'rgba(59, 30, 84, 0.08)',
        frameStroke: '#2d1342',
        textInk: '#1f0930',
        textEdge: '#0f0219',
        tagInk: '#3b1e54',
        innerFloorColor: 0x2b113d,
      };
    case 'cyber-neon':
      return {
        baseColor: '#173b2a', // High-tech dark emerald carbon kraft
        paperNoiseLight: 'rgba(52, 211, 153, 0.22)',
        paperNoiseDark: 'rgba(5, 40, 25, 0.45)',
        ribColor: 'rgba(5, 150, 105, 0.15)',
        frameStroke: '#10B981',
        textInk: '#34D399',
        textEdge: '#064E3B',
        tagInk: '#6EE7B7',
        innerFloorColor: 0x071b12,
      };
    case 'emerald-oasis':
      return {
        baseColor: '#3d6952', // Deep botanical sage/forest kraft
        paperNoiseLight: 'rgba(128, 237, 153, 0.22)',
        paperNoiseDark: 'rgba(19, 46, 32, 0.35)',
        ribColor: 'rgba(19, 46, 32, 0.12)',
        frameStroke: '#112b1d',
        textInk: '#0b1d13',
        textEdge: '#050d08',
        tagInk: '#1a402c',
        innerFloorColor: 0x11281b,
      };
    case 'ocean-cobalt':
      return {
        baseColor: '#2b5275', // Deep nautical cobalt kraft
        paperNoiseLight: 'rgba(125, 211, 252, 0.22)',
        paperNoiseDark: 'rgba(10, 25, 47, 0.35)',
        ribColor: 'rgba(10, 25, 47, 0.12)',
        frameStroke: '#07162b',
        textInk: '#040d1a',
        textEdge: '#02070f',
        tagInk: '#0c274d',
        innerFloorColor: 0x071424,
      };
    case 'sunset-amber':
      return {
        baseColor: '#b85423', // Warm terracotta burnt-sienna artisan kraft
        paperNoiseLight: 'rgba(253, 186, 116, 0.25)',
        paperNoiseDark: 'rgba(56, 18, 8, 0.3)',
        ribColor: 'rgba(56, 18, 8, 0.1)',
        frameStroke: '#2e0e06',
        textInk: '#1e0803',
        textEdge: '#0e0301',
        tagInk: '#3d1408',
        innerFloorColor: 0x2e0e06,
      };
    case 'rose-quartz':
      return {
        baseColor: '#a1486c', // Editorial boutique velvet wine rose kraft
        paperNoiseLight: 'rgba(244, 114, 182, 0.22)',
        paperNoiseDark: 'rgba(53, 8, 25, 0.32)',
        ribColor: 'rgba(53, 8, 25, 0.1)',
        frameStroke: '#290613',
        textInk: '#1c030c',
        textEdge: '#0d0105',
        tagInk: '#3b0a1c',
        innerFloorColor: 0x290513,
      };
    case 'obsidian-gold':
      return {
        baseColor: '#242427', // Luxury matte carbon black kraft
        paperNoiseLight: 'rgba(253, 224, 71, 0.18)',
        paperNoiseDark: 'rgba(0, 0, 0, 0.55)',
        ribColor: 'rgba(202, 138, 4, 0.12)',
        frameStroke: '#EAB308',
        textInk: '#FDE047',
        textEdge: '#854D0E',
        tagInk: '#FACC15',
        innerFloorColor: 0x121214,
      };
    case 'nordic-slate':
      return {
        baseColor: '#434d6e', // Scandinavian indigo-charcoal kraft
        paperNoiseLight: 'rgba(165, 180, 252, 0.2)',
        paperNoiseDark: 'rgba(15, 23, 42, 0.35)',
        ribColor: 'rgba(15, 23, 42, 0.1)',
        frameStroke: '#0b1121',
        textInk: '#070a14',
        textEdge: '#03050a',
        tagInk: '#131e38',
        innerFloorColor: 0x0c1221,
      };
    case 'crimson-ruby':
      return {
        baseColor: '#8a2734', // Deep garnet ruby flame kraft
        paperNoiseLight: 'rgba(248, 113, 113, 0.22)',
        paperNoiseDark: 'rgba(43, 10, 17, 0.35)',
        ribColor: 'rgba(43, 10, 17, 0.12)',
        frameStroke: '#21070c',
        textInk: '#140307',
        textEdge: '#080103',
        tagInk: '#2e0a11',
        innerFloorColor: 0x21070c,
      };
    case 'electric-amethyst':
      return {
        baseColor: '#4d2d6e', // Vibrant cyberpunk electric purple kraft
        paperNoiseLight: 'rgba(196, 181, 253, 0.22)',
        paperNoiseDark: 'rgba(21, 10, 33, 0.4)',
        ribColor: 'rgba(21, 10, 33, 0.14)',
        frameStroke: '#A78BFA',
        textInk: '#C4B5FD',
        textEdge: '#4C1D95',
        tagInk: '#DDD6FE',
        innerFloorColor: 0x150921,
      };
    default:
      return {
        baseColor: '#c58e5a',
        paperNoiseLight: 'rgba(240, 230, 210, 0.3)',
        paperNoiseDark: 'rgba(60, 32, 12, 0.25)',
        ribColor: 'rgba(70, 38, 16, 0.05)',
        frameStroke: '#220b04',
        textInk: '#160803',
        textEdge: '#0e0401',
        tagInk: '#2d0f05',
        innerFloorColor: 0x6e4020,
      };
  }
}

let sharedBumpTex: THREE.CanvasTexture | null = null;
let sharedGrainCanvas: HTMLCanvasElement | null = null;
const themedKraftCanvasCache = new Map<string, HTMLCanvasElement>();
const themedFrontCanvasCache = new Map<string, HTMLCanvasElement>();

function getBoxCacheKey(settings: BoxThemeSettings): string {
  return `${settings.baseColor}|${settings.frameStroke}|${settings.textInk}|${settings.tagInk}`;
}

function getSharedCardboardBump(): THREE.CanvasTexture {
  if (sharedBumpTex) return sharedBumpTex;
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 256;
  bumpCanvas.height = 256;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 256, 256);

  for (let x = 0; x < 256; x += 4) {
    bCtx.fillStyle = '#686868';
    bCtx.fillRect(x, 0, 2, 256);
    bCtx.fillStyle = '#949494';
    bCtx.fillRect(x + 2, 0, 2, 256);
  }

  sharedBumpTex = new THREE.CanvasTexture(bumpCanvas);
  sharedBumpTex.wrapS = THREE.RepeatWrapping;
  sharedBumpTex.wrapT = THREE.RepeatWrapping;
  return sharedBumpTex;
}

function getSharedGrainOverlay(): HTMLCanvasElement {
  if (sharedGrainCanvas) return sharedGrainCanvas;
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const gCtx = c.getContext('2d')!;
  const img = gCtx.createImageData(128, 128);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const light = Math.random() > 0.5;
    d[i] = light ? 255 : 0;
    d[i + 1] = light ? 252 : 0;
    d[i + 2] = light ? 245 : 0;
    d[i + 3] = Math.floor(Math.random() * 14);
  }
  gCtx.putImageData(img, 0, 0);
  sharedGrainCanvas = c;
  return c;
}

function stampGrainPattern(ctx: CanvasRenderingContext2D, size: number) {
  const pattern = ctx.createPattern(getSharedGrainOverlay(), 'repeat');
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, size, size);
  }
}

export function createThemedCardboardTexture(settings: BoxThemeSettings): { map: THREE.CanvasTexture; bump: THREE.CanvasTexture } {
  const cacheKey = getBoxCacheKey(settings);
  let canvas = themedKraftCanvasCache.get(cacheKey);

  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = settings.baseColor;
    ctx.fillRect(0, 0, 512, 512);
    stampGrainPattern(ctx, 512);

    for (let x = 0; x < 512; x += 8) {
      ctx.fillStyle = settings.ribColor;
      ctx.fillRect(x, 0, 3, 512);
      ctx.fillStyle = settings.paperNoiseLight;
      ctx.fillRect(x + 3, 0, 2, 512);
    }

    for (let i = 0; i < 160; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const len = Math.random() * 4 + 1.5;
      ctx.strokeStyle = Math.random() > 0.4 ? settings.paperNoiseDark : settings.paperNoiseLight;
      ctx.lineWidth = Math.random() * 1 + 0.4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len, y + (Math.random() - 0.5) * 2);
      ctx.stroke();
    }

    themedKraftCanvasCache.set(cacheKey, canvas);
  }

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;

  return { map, bump: getSharedCardboardBump() };
}

export function createThemedFrontMaterial(settings: BoxThemeSettings, bumpMap: THREE.CanvasTexture): THREE.MeshStandardMaterial {
  const cacheKey = getBoxCacheKey(settings);
  let frontCanvas = themedFrontCanvasCache.get(cacheKey);

  if (!frontCanvas) {
    frontCanvas = document.createElement('canvas');
    frontCanvas.width = 512;
    frontCanvas.height = 512;
    const fCtx = frontCanvas.getContext('2d')!;
    fCtx.save();
    fCtx.scale(0.5, 0.5);

    fCtx.fillStyle = settings.baseColor;
    fCtx.fillRect(0, 0, 1024, 1024);
    stampGrainPattern(fCtx, 1024);

    for (let y = 0; y < 1024; y += 24) {
      fCtx.fillStyle = settings.ribColor;
      fCtx.fillRect(0, y, 1024, 4);
    }

    fCtx.fillStyle = settings.frameStroke;
    fCtx.font = 'bold 54px sans-serif';
    fCtx.fillText('📷', 120, 160);
    fCtx.fillText('✦', 870, 160);

  function drawClearBoxTypography(
    ctx: CanvasRenderingContext2D,
    text: string,
    cx: number,
    cy: number,
    fontSize: number,
    letterSpacing: number = 4
  ) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `900 ${fontSize}px "Plus Jakarta Sans", "Inter", "Arial Black", "Montserrat", sans-serif`;

    ctx.fillStyle = settings.textInk;
    ctx.letterSpacing = `${letterSpacing}px`;
    ctx.fillText(text, cx, cy);

    ctx.strokeStyle = settings.textEdge;
    ctx.lineWidth = 1.5;
    ctx.strokeText(text, cx, cy);

    ctx.restore();
  }

  // Stamped Frame Box
  fCtx.strokeStyle = settings.frameStroke;
  fCtx.lineWidth = 8;
  fCtx.strokeRect(95, 330, 834, 580);

  fCtx.save();
  fCtx.strokeStyle = settings.frameStroke;
  fCtx.globalAlpha = 0.45;
  fCtx.lineWidth = 2.5;
  fCtx.strokeRect(108, 343, 808, 554);
  fCtx.restore();

  const corners = [
    [108, 343, 40, 40],
    [916, 343, -40, 40],
    [108, 897, 40, -40],
    [916, 897, -40, -40],
  ];
  fCtx.fillStyle = settings.frameStroke;
  for (const [x, y, w, h] of corners) {
    fCtx.fillRect(x, y, w, 6);
    fCtx.fillRect(x, y, 6, h);
  }

  fCtx.save();
  fCtx.textAlign = 'center';
  fCtx.fillStyle = settings.tagInk;
  fCtx.font = '800 32px "Plus Jakarta Sans", monospace';
  fCtx.fillText('★ COMMUNITY GEAR & EQUIPMENT ★', 512, 400);
  fCtx.restore();

  drawClearBoxTypography(fCtx, 'RESOURCE', 512, 530, 142, 6);

  fCtx.strokeStyle = settings.tagInk;
  fCtx.lineWidth = 3;
  fCtx.beginPath();
  fCtx.moveTo(220, 625);
  fCtx.lineTo(440, 625);
  fCtx.moveTo(584, 625);
  fCtx.lineTo(804, 625);
  fCtx.stroke();

  fCtx.save();
  fCtx.textAlign = 'center';
  fCtx.textBaseline = 'middle';
  fCtx.fillStyle = settings.tagInk;
  fCtx.font = 'bold 36px sans-serif';
  fCtx.fillText('✦ 📦 ✦', 512, 624);
  fCtx.restore();

  drawClearBoxTypography(fCtx, 'BOX', 512, 725, 156, 12);

  fCtx.save();
  fCtx.textAlign = 'center';
  fCtx.fillStyle = settings.tagInk;
  fCtx.font = '800 32px "Plus Jakarta Sans", sans-serif';
  fCtx.fillText('SHARE  •  RENT  •  EXCHANGE', 512, 825);
  fCtx.restore();

    fCtx.save();
    fCtx.font = 'bold 36px sans-serif';
    fCtx.fillStyle = settings.tagInk;
    fCtx.fillText('✓ VERIFIED', 210, 872);
    fCtx.fillText('LOCAL GEAR ✓', 814, 872);
    fCtx.restore();
    fCtx.restore();

    themedFrontCanvasCache.set(cacheKey, frontCanvas);
  }

  const frontTex = new THREE.CanvasTexture(frontCanvas);
  frontTex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshStandardMaterial({
    map: frontTex,
    bumpMap: bumpMap,
    bumpScale: 0.015,
    roughness: 0.88,
    metalness: 0.02,
  });
}

export function createSolid3DCardboardBox(theme?: any): THREE.Group {
  const boxGroup = new THREE.Group();
  boxGroup.name = 'CardboardBox';

  const settings = getBoxThemeSettings(theme?.id, theme);
  const { map: kraftMap, bump: kraftBump } = createThemedCardboardTexture(settings);

  // Outer kraft material: tactile matte cardboard
  const kraftMat = new THREE.MeshStandardMaterial({
    map: kraftMap,
    bumpMap: kraftBump,
    bumpScale: 0.015,
    roughness: 0.88,
    metalness: 0.02,
  });

  // Inner corrugated paper with theme deep tint
  const innerMat = new THREE.MeshStandardMaterial({
    color: settings.innerFloorColor,
    bumpMap: kraftBump,
    bumpScale: 0.02,
    roughness: 0.94,
    metalness: 0.01,
  });

  // Flap material
  const flapMat = new THREE.MeshStandardMaterial({
    map: kraftMap,
    bumpMap: kraftBump,
    bumpScale: 0.015,
    roughness: 0.86,
    metalness: 0.02,
  });

  const width = 2.4;
  const height = 1.7;
  const depth = 2.3;
  const wallThickness = 0.08;

  // Bottom plate
  const bottom = new THREE.Mesh(new THREE.BoxGeometry(width, wallThickness, depth), kraftMat);
  bottom.name = 'CardboardBottom';
  bottom.position.y = -height / 2;
  bottom.receiveShadow = true;
  boxGroup.add(bottom);

  // Inner bottom liner
  const innerBottom = new THREE.Mesh(
    new THREE.PlaneGeometry(width - wallThickness * 2, depth - wallThickness * 2),
    innerMat
  );
  innerBottom.name = 'CardboardInnerBottom';
  innerBottom.rotation.x = -Math.PI / 2;
  innerBottom.position.y = -height / 2 + wallThickness + 0.005;
  innerBottom.receiveShadow = true;
  boxGroup.add(innerBottom);

  // Back wall
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(width, height, wallThickness), kraftMat);
  backWall.name = 'CardboardBackWall';
  backWall.position.set(0, 0, -depth / 2 + wallThickness / 2);
  backWall.castShadow = true;
  backWall.receiveShadow = true;
  boxGroup.add(backWall);

  // Left wall
  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallThickness, height, depth - wallThickness * 2),
    kraftMat
  );
  leftWall.name = 'CardboardLeftWall';
  leftWall.position.set(-width / 2 + wallThickness / 2, 0, 0);
  leftWall.castShadow = true;
  leftWall.receiveShadow = true;
  boxGroup.add(leftWall);

  // Right wall
  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallThickness, height, depth - wallThickness * 2),
    kraftMat
  );
  rightWall.name = 'CardboardRightWall';
  rightWall.position.set(width / 2 - wallThickness / 2, 0, 0);
  rightWall.castShadow = true;
  rightWall.receiveShadow = true;
  boxGroup.add(rightWall);

  // Front wall with crisp "RESOURCE BOX" Themed Canvas
  const frontMat = createThemedFrontMaterial(settings, kraftBump);
  const frontWall = new THREE.Mesh(new THREE.BoxGeometry(width, height, wallThickness), frontMat);
  frontWall.name = 'CardboardFrontWall';
  frontWall.position.set(0, 0, depth / 2 - wallThickness / 2);
  frontWall.castShadow = true;
  frontWall.receiveShadow = true;
  boxGroup.add(frontWall);

  // 4 Open Flaps
  const flapLenZ = 0.32;
  const flapLenX = 0.34;

  // Front Flap
  const frontFlapGroup = new THREE.Group();
  frontFlapGroup.position.set(0, height / 2, depth / 2);
  const frontFlap = new THREE.Mesh(new THREE.BoxGeometry(width, wallThickness, flapLenZ), flapMat);
  frontFlap.name = 'CardboardFlapFront';
  frontFlap.position.set(0, 0, flapLenZ / 2);
  frontFlap.castShadow = true;
  frontFlapGroup.rotation.x = 1.54;
  frontFlapGroup.add(frontFlap);
  boxGroup.add(frontFlapGroup);

  // Back Flap
  const backFlapGroup = new THREE.Group();
  backFlapGroup.position.set(0, height / 2, -depth / 2);
  const backFlap = new THREE.Mesh(new THREE.BoxGeometry(width, wallThickness, flapLenZ), flapMat);
  backFlap.name = 'CardboardFlapBack';
  backFlap.position.set(0, 0, -flapLenZ / 2);
  backFlap.castShadow = true;
  backFlapGroup.rotation.x = -1.25;
  backFlapGroup.add(backFlap);
  boxGroup.add(backFlapGroup);

  // Left Flap
  const leftFlapGroup = new THREE.Group();
  leftFlapGroup.position.set(-width / 2, height / 2, 0);
  const leftFlap = new THREE.Mesh(new THREE.BoxGeometry(flapLenX, wallThickness, depth), flapMat);
  leftFlap.name = 'CardboardFlapLeft';
  leftFlap.position.set(-flapLenX / 2, 0, 0);
  leftFlap.castShadow = true;
  leftFlapGroup.rotation.z = 1.3;
  leftFlapGroup.add(leftFlap);
  boxGroup.add(leftFlapGroup);

  // Right Flap
  const rightFlapGroup = new THREE.Group();
  rightFlapGroup.position.set(width / 2, height / 2, 0);
  const rightFlap = new THREE.Mesh(new THREE.BoxGeometry(flapLenX, wallThickness, depth), flapMat);
  rightFlap.name = 'CardboardFlapRight';
  rightFlap.position.set(flapLenX / 2, 0, 0);
  rightFlap.castShadow = true;
  rightFlapGroup.rotation.z = -1.3;
  rightFlapGroup.add(rightFlap);
  boxGroup.add(rightFlapGroup);

  // Contact shadow
  const contactCanvas = document.createElement('canvas');
  contactCanvas.width = 512;
  contactCanvas.height = 512;
  const cCtx = contactCanvas.getContext('2d')!;
  const grad = cCtx.createRadialGradient(256, 256, 30, 256, 256, 240);
  grad.addColorStop(0, 'rgba(18, 28, 20, 0.65)');
  grad.addColorStop(0.25, 'rgba(18, 28, 20, 0.45)');
  grad.addColorStop(0.55, 'rgba(18, 28, 20, 0.20)');
  grad.addColorStop(0.8, 'rgba(18, 28, 20, 0.06)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  cCtx.fillStyle = grad;
  cCtx.fillRect(0, 0, 512, 512);

  const contactTex = new THREE.CanvasTexture(contactCanvas);
  const contactMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4.6, 4.6),
    new THREE.MeshBasicMaterial({ map: contactTex, transparent: true, depthWrite: false })
  );
  contactMesh.rotation.x = -Math.PI / 2;
  contactMesh.position.y = -height / 2 - 0.005;
  boxGroup.add(contactMesh);

  return boxGroup;
}

// Live Updater: Applies new theme colors to existing 3D box in place without rebuilding scene
export function applyThemeToSolid3DCardboardBox(boxGroup: THREE.Group, theme?: any) {
  const settings = getBoxThemeSettings(theme?.id, theme);
  const { map: newKraftMap, bump: newKraftBump } = createThemedCardboardTexture(settings);
  let oldKraftMap: THREE.Texture | null = null;

  boxGroup.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.name === 'CardboardFrontWall') {
        const oldMat = child.material;
        child.material = createThemedFrontMaterial(settings, newKraftBump);
        if (oldMat instanceof THREE.MeshStandardMaterial) {
          oldMat.map?.dispose();
          oldMat.dispose();
        } else if (oldMat instanceof THREE.Material) {
          oldMat.dispose();
        }
      } else if (child.name === 'CardboardInnerBottom') {
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.color.setHex(settings.innerFloorColor);
          child.material.needsUpdate = true;
        }
      } else if (
        child.name === 'CardboardBottom' ||
        child.name === 'CardboardBackWall' ||
        child.name === 'CardboardLeftWall' ||
        child.name === 'CardboardRightWall' ||
        child.name.startsWith('CardboardFlap')
      ) {
        if (child.material instanceof THREE.MeshStandardMaterial) {
          if (child.material.map && child.material.map !== newKraftMap) {
            oldKraftMap = child.material.map;
          }
          child.material.map = newKraftMap;
          child.material.bumpMap = newKraftBump;
          child.material.needsUpdate = true;
        }
      }
    }
  });

  if (oldKraftMap) {
    (oldKraftMap as THREE.Texture).dispose();
  }
}

// ---------------------------------------------------------------------------------
// 2. 3D White Studio Over-Ear Headphones (Upright Vertical Sculpted Architecture)
// ---------------------------------------------------------------------------------
export function createSolid3DHeadphones(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Headphones';

  const whiteLeatherTex = createWhiteLeatherTexture();
  const metalTex = createBrushedMetalTexture();

  // Pearl ceramic-white matte outer acoustic shell
  const whiteShellMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.26,
    metalness: 0.04,
    clearcoat: 0.35,
    clearcoatRoughness: 0.22,
  });

  // Soft pearl-mist memory foam cushion leather (contrasts cleanly with pure white shell & background)
  const cushionMat = new THREE.MeshStandardMaterial({
    map: whiteLeatherTex,
    color: 0xdbe2ea,
    roughness: 0.82,
    metalness: 0.02,
  });

  // Brushed titanium-silver anodized aluminum hardware (slider rods, yokes, hinge rings, accent trim)
  const aluminumMat = new THREE.MeshStandardMaterial({
    map: metalTex,
    color: 0x94a3b8,
    roughness: 0.24,
    metalness: 0.88,
  });

  // Recessed acoustic mesh inside earcups for crisp inner depth
  const driverMeshMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.92,
    metalness: 0.06,
  });

  const driverCoreMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.6,
    metalness: 0.25,
  });

  // 1. Contoured Ergonomic Headband Arch (broader crown tapering into vertical stems)
  const archCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.36, 0.22, 0),
    new THREE.Vector3(-0.34, 0.42, 0),
    new THREE.Vector3(-0.18, 0.54, 0),
    new THREE.Vector3(0, 0.57, 0),
    new THREE.Vector3(0.18, 0.54, 0),
    new THREE.Vector3(0.34, 0.42, 0),
    new THREE.Vector3(0.36, 0.22, 0),
  ]);
  const archGeo = new THREE.TubeGeometry(archCurve, 44, 0.036, 16, false);
  archGeo.scale(1, 1, 1.45); // Flatten slightly for realistic wide headband silhouette
  const archMesh = new THREE.Mesh(archGeo, whiteShellMat);
  group.add(archMesh);

  // 2. Plush Suspended Under-Crown Memory Foam Pad + End Caps
  const padCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.26, 0.44, 0),
    new THREE.Vector3(-0.14, 0.515, 0),
    new THREE.Vector3(0, 0.535, 0),
    new THREE.Vector3(0.14, 0.515, 0),
    new THREE.Vector3(0.26, 0.44, 0),
  ]);
  const padGeo = new THREE.TubeGeometry(padCurve, 32, 0.03, 14, false);
  padGeo.scale(1, 0.85, 1.35);
  const padMesh = new THREE.Mesh(padGeo, cushionMat);
  group.add(padMesh);

  [-0.26, 0.26].forEach((capX) => {
    const padCap = new THREE.Mesh(new THREE.SphereGeometry(0.034, 14, 14), aluminumMat);
    padCap.scale.set(1, 0.85, 1.3);
    padCap.position.set(capX, 0.44, 0);
    group.add(padCap);
  });

  // Helper: Stadium / Oval Earcup Silhouette (authentic modern over-ear proportions)
  const cupW = 0.28;
  const cupH = 0.41;
  const cupR = cupW / 2;
  const cupHalfStraight = (cupH - cupW) / 2;

  const createOvalShape = (inset: number = 0) => {
    const r = Math.max(0.02, cupR - inset);
    const s = new THREE.Shape();
    s.absarc(0, cupHalfStraight, r, 0, Math.PI, false);
    s.lineTo(-r, -cupHalfStraight);
    s.absarc(0, -cupHalfStraight, r, Math.PI, Math.PI * 2, false);
    s.lineTo(r, cupHalfStraight);
    return s;
  };

  const outerCupGeo = new THREE.ExtrudeGeometry(createOvalShape(0), {
    depth: 0.056,
    bevelEnabled: true,
    bevelThickness: 0.022,
    bevelSize: 0.02,
    bevelSegments: 4,
    curveSegments: 24,
  });
  outerCupGeo.center();

  const innerBaffleGeo = new THREE.ShapeGeometry(createOvalShape(0.022), 20);
  const innerDriverRingGeo = new THREE.RingGeometry(0.038, 0.058, 24);

  // Plush Oval Ear Cushion Curve
  const cushionPoints: THREE.Vector3[] = [];
  const segs = 36;
  for (let i = 0; i < segs; i++) {
    const t = (i / segs) * Math.PI * 2;
    const rx = (cupR - 0.015) * Math.cos(t);
    const ry = (cupH / 2 - 0.015) * Math.sin(t);
    cushionPoints.push(new THREE.Vector3(0, ry, rx));
  }
  const cushionLoop = new THREE.CatmullRomCurve3(cushionPoints, true);
  const ovalCushionGeo = new THREE.TubeGeometry(cushionLoop, 44, 0.044, 16, true);

  // 3. Left & Right Slider Mechanisms, Articulated C-Yokes, & Vertical Oval Earcups
  [-1, 1].forEach((side) => {
    // Headband collar trim at slider entry
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.04, 0.045, 20), aluminumMat);
    collar.scale.set(1, 1, 1.35);
    collar.position.set(side * 0.36, 0.21, 0);
    group.add(collar);

    // Telescoping brushed aluminum extension rod
    const sliderStem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.22, 16), aluminumMat);
    sliderStem.position.set(side * 0.36, 0.1, 0);
    group.add(sliderStem);

    // Swivel hinge barrel
    const hingeJoint = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.048, 16), aluminumMat);
    hingeJoint.rotation.x = Math.PI / 2;
    hingeJoint.position.set(side * 0.36, 0.0, 0);
    group.add(hingeJoint);

    // Sculpted aluminum C-yoke wrapping smoothly behind the cup to dual pivot pins
    const yokeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.36, 0.0, 0),
      new THREE.Vector3(side * 0.425, -0.04, -0.055),
      new THREE.Vector3(side * 0.435, -0.15, -0.095),
      new THREE.Vector3(side * 0.42, -0.18, 0),
    ]);
    const yokeGeo = new THREE.TubeGeometry(yokeCurve, 20, 0.013, 10, false);
    group.add(new THREE.Mesh(yokeGeo, aluminumMat));

    // Earcup assembly (gently canted inward toward center like natural upright fit)
    const cupGroup = new THREE.Group();
    cupGroup.position.set(side * 0.335, -0.18, 0);
    cupGroup.rotation.z = side * -0.07;

    // Main matte-white oval acoustic housing (oriented along YZ plane facing inward)
    const shell = new THREE.Mesh(outerCupGeo, whiteShellMat);
    shell.rotation.y = Math.PI / 2;
    shell.position.x = side * 0.028;
    cupGroup.add(shell);

    // Brushed silver perimeter trim ring on outer shell back
    const trimCurvePoints = cushionPoints.map(
      (p) => new THREE.Vector3(side * 0.068, p.y * 0.86, p.z * 0.86)
    );
    const trimLoop = new THREE.CatmullRomCurve3(trimCurvePoints, true);
    const trimRing = new THREE.Mesh(new THREE.TubeGeometry(trimLoop, 36, 0.008, 10, true), aluminumMat);
    cupGroup.add(trimRing);

    // Acoustic ANC mic accent slit on outer shell face
    const micPill = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.045, 0.014), aluminumMat);
    micPill.position.set(side * 0.076, 0.09, -0.04);
    cupGroup.add(micPill);

    // Tactile silver volume crown + button on right cup
    if (side === 1) {
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.016, 16), aluminumMat);
      crown.rotation.z = Math.PI / 2;
      crown.position.set(0.068, 0.145, 0.035);
      const ancBtn = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.034, 0.016), aluminumMat);
      ancBtn.position.set(0.056, -0.12, -0.095);
      cupGroup.add(crown, ancBtn);
    }

    // Recessed acoustic inner cloth & subtle driver baffle (non-coplanar offsets)
    const baffle = new THREE.Mesh(innerBaffleGeo, driverMeshMat);
    baffle.rotation.y = side === -1 ? Math.PI / 2 : -Math.PI / 2;
    baffle.position.x = side * -0.022;
    cupGroup.add(baffle);

    const driverRing = new THREE.Mesh(innerDriverRingGeo, driverCoreMat);
    driverRing.rotation.y = side === -1 ? Math.PI / 2 : -Math.PI / 2;
    driverRing.position.x = side * -0.025;
    cupGroup.add(driverRing);

    // Plush white memory-foam oval ear cushion
    const cushion = new THREE.Mesh(ovalCushionGeo, cushionMat);
    cushion.position.x = side * -0.048;
    cupGroup.add(cushion);

    group.add(cupGroup);
  });

  return group;
}

// ---------------------------------------------------------------------------------
// 3. 3D Laptop (Chiseled CNC Aluminum Unibody, Individual Keycaps & macOS Screen)
// ---------------------------------------------------------------------------------
export function createSolid3DLaptop(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Laptop';

  const metalTex = getCachedBrushedMetal();
  const screenTex = getCachedLaptopScreen();

  const bodyMat = new THREE.MeshPhysicalMaterial({
    map: metalTex,
    color: 0xa8b0bc,
    roughness: 0.24,
    metalness: 0.86,
    clearcoat: 0.2,
  });
  const wellMat = new THREE.MeshStandardMaterial({
    color: 0x0f1217,
    roughness: 0.72,
    metalness: 0.1,
  });
  const keyMat = new THREE.MeshStandardMaterial({
    color: 0x16191f,
    roughness: 0.48,
    metalness: 0.08,
  });
  const screenBezelMat = new THREE.MeshPhysicalMaterial({
    color: 0x090b10,
    roughness: 0.08,
    clearcoat: 1.0,
  });
  const screenMat = new THREE.MeshStandardMaterial({
    map: screenTex,
    emissiveMap: screenTex,
    emissive: 0xffffff,
    emissiveIntensity: 0.45,
    roughness: 0.14,
  });
  const hingeMat = new THREE.MeshStandardMaterial({
    color: 0x111317,
    roughness: 0.35,
    metalness: 0.5,
  });
  const logoMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.96,
    roughness: 0.08,
  });

  // Rounded Chamfered Aluminum Unibody Base
  const baseGeo = new THREE.ExtrudeGeometry(makeRoundedRectShape(0.90, 0.62, 0.028), {
    depth: 0.026,
    bevelEnabled: true,
    bevelThickness: 0.007,
    bevelSize: 0.007,
    bevelSegments: 3,
    curveSegments: 16,
  });
  baseGeo.rotateX(Math.PI / 2);
  baseGeo.translate(0, 0.013, 0);
  group.add(new THREE.Mesh(baseGeo, bodyMat));

  // Front thumb-opening notch & Force-Touch Glass Trackpad
  const thumbNotch = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.012, 0.02), hingeMat);
  thumbNotch.position.set(0, 0.013, 0.312);
  const trackpad = new THREE.Mesh(
    new THREE.ExtrudeGeometry(makeRoundedRectShape(0.32, 0.185, 0.015), { depth: 0.004, bevelEnabled: false }),
    new THREE.MeshStandardMaterial({ color: 0x8b94a3, roughness: 0.22, metalness: 0.72 })
  );
  trackpad.rotation.x = Math.PI / 2;
  trackpad.position.set(0, 0.0215, 0.175);
  group.add(thumbNotch, trackpad);

  // Recessed Keyboard Deck + Individual Chiclet Keycaps
  const kbWell = new THREE.Mesh(
    new THREE.ExtrudeGeometry(makeRoundedRectShape(0.76, 0.295, 0.014), { depth: 0.004, bevelEnabled: false }),
    wellMat
  );
  kbWell.rotation.x = Math.PI / 2;
  kbWell.position.set(0, 0.021, -0.095);
  group.add(kbWell);

  const keyGeo = new THREE.BoxGeometry(0.044, 0.009, 0.042);
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 13; c++) {
      if (r === 4 && c >= 4 && c <= 8) continue;
      const key = new THREE.Mesh(keyGeo, keyMat);
      key.position.set(-0.33 + c * 0.055, 0.0245, -0.205 + r * 0.054);
      group.add(key);
    }
  }
  const spaceKey = new THREE.Mesh(new THREE.BoxGeometry(0.265, 0.009, 0.042), keyMat);
  spaceKey.position.set(0, 0.0245, -0.205 + 4 * 0.054);
  group.add(spaceKey);

  // Clutch Hinge Barrel + Angled Display Lid (115°)
  const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.58, 16), hingeMat);
  hinge.rotation.z = Math.PI / 2;
  hinge.position.set(0, 0.022, -0.305);
  group.add(hinge);

  const lidGroup = new THREE.Group();
  lidGroup.position.set(0, 0.022, -0.305);

  const lidGeo = new THREE.ExtrudeGeometry(makeRoundedRectShape(0.90, 0.60, 0.026), {
    depth: 0.014,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.004,
    bevelSegments: 3,
    curveSegments: 16,
  });
  lidGeo.translate(0, 0.30, -0.007);
  lidGroup.add(new THREE.Mesh(lidGeo, bodyMat));

  // Glossy Black Display Bezel, Crisp Screen & Webcam Notch
  const bezelGeo = new THREE.ExtrudeGeometry(makeRoundedRectShape(0.875, 0.575, 0.018), {
    depth: 0.003,
    bevelEnabled: false,
  });
  bezelGeo.translate(0, 0.30, 0.010);
  lidGroup.add(new THREE.Mesh(bezelGeo, screenBezelMat));

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.83, 0.525), screenMat);
  screen.position.set(0, 0.298, 0.0145);
  const camDot = new THREE.Mesh(
    new THREE.CircleGeometry(0.006, 10),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1 })
  );
  camDot.position.set(0, 0.575, 0.0145);

  // Polished Mirror Emblem on Aluminum Lid Back
  const backEmblem = new THREE.Mesh(new THREE.CircleGeometry(0.044, 24), logoMat);
  backEmblem.rotation.y = Math.PI;
  backEmblem.position.set(0, 0.31, -0.012);
  lidGroup.add(screen, camDot, backEmblem);

  lidGroup.rotation.x = -0.42;
  group.add(lidGroup);

  return group;
}

// ---------------------------------------------------------------------------------
// 4. 3D PlayStation 5 Console (Sweeping Architectural Collar Fins & Cyan Light Blades)
// ---------------------------------------------------------------------------------
export function createSolid3DPS5(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'PS5';

  const whiteMat = new THREE.MeshPhysicalMaterial({
    color: 0xf4f6f9,
    roughness: 0.24,
    metalness: 0.04,
    clearcoat: 0.35,
  });
  const blackCoreMat = new THREE.MeshPhysicalMaterial({
    color: 0x0b0e13,
    roughness: 0.08,
    metalness: 0.35,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
  });
  const matteBaseMat = new THREE.MeshStandardMaterial({
    color: 0x181c22,
    roughness: 0.65,
    metalness: 0.2,
  });
  const ledMat = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    emissive: 0x00b4ff,
    emissiveIntensity: 2.0,
    roughness: 0.1,
  });

  // Round Matte Pedestal Base
  const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.23, 0.032, 32), matteBaseMat);
  standBase.position.y = -0.46;
  group.add(standBase);

  // Sculpted Curved Glossy Center Core (arched spine top & tapered nose)
  const coreShape = new THREE.Shape();
  coreShape.moveTo(-0.23, -0.44);
  coreShape.lineTo(0.22, -0.44);
  coreShape.bezierCurveTo(0.24, -0.1, 0.25, 0.24, 0.21, 0.42);
  coreShape.bezierCurveTo(0.11, 0.47, -0.10, 0.46, -0.22, 0.41);
  coreShape.bezierCurveTo(-0.24, 0.12, -0.24, -0.18, -0.23, -0.44);

  const coreGeo = new THREE.ExtrudeGeometry(coreShape, {
    depth: 0.13,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.012,
    bevelSegments: 3,
    curveSegments: 24,
  });
  coreGeo.rotateY(Math.PI / 2);
  coreGeo.translate(-0.065, 0, 0);
  group.add(new THREE.Mesh(coreGeo, blackCoreMat));

  // Twin Architectural Sculpted White Side Fins (flared V-collar profile)
  const finShape = new THREE.Shape();
  finShape.moveTo(-0.25, -0.45);
  finShape.lineTo(0.24, -0.45);
  finShape.bezierCurveTo(0.27, -0.1, 0.28, 0.28, 0.26, 0.48);
  finShape.bezierCurveTo(0.14, 0.46, -0.12, 0.45, -0.25, 0.47);
  finShape.bezierCurveTo(-0.26, 0.14, -0.26, -0.18, -0.25, -0.45);

  const finGeo = new THREE.ExtrudeGeometry(finShape, {
    depth: 0.022,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 3,
    curveSegments: 24,
  });
  finGeo.rotateY(Math.PI / 2);

  [-1, 1].forEach((side) => {
    const fin = new THREE.Mesh(finGeo, whiteMat);
    fin.position.set(side * 0.088, 0.015, 0);
    fin.rotation.z = side * -0.055;
    group.add(fin);

    // Subtle Electric Cyan Light Blade inside Collar Intake Channel
    const ledCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.072, 0.425, 0.225),
      new THREE.Vector3(side * 0.072, 0.18, 0.248),
      new THREE.Vector3(side * 0.072, -0.15, 0.24),
      new THREE.Vector3(side * 0.072, -0.36, 0.228),
    ]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(ledCurve, 18, 0.007, 8, false), ledMat));
  });

  // Front USB-C / USB-A Port Detail & Micro Power/Eject Buttons
  const portA = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.028, 0.008), matteBaseMat);
  portA.position.set(0, -0.24, 0.246);
  const pwrBtn = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.045, 0.008), whiteMat);
  pwrBtn.position.set(0, -0.34, 0.244);
  group.add(portA, pwrBtn);

  return group;
}

// ---------------------------------------------------------------------------------
// 5. 3D Custom CNC Mechanical Keyboard (Tapered Keycaps, Brass Knob & Underglow)
// ---------------------------------------------------------------------------------
export function createSolid3DKeyboard(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Keyboard';

  const metalTex = getCachedBrushedMetal();

  const caseMat = new THREE.MeshStandardMaterial({
    map: metalTex,
    color: 0x1e2530,
    roughness: 0.34,
    metalness: 0.72,
  });
  const plateMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.55,
    metalness: 0.4,
  });
  const creamKeyMat = new THREE.MeshStandardMaterial({
    color: 0xf4efe6,
    roughness: 0.44,
    metalness: 0.03,
  });
  const modKeyMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.46,
    metalness: 0.06,
  });
  const accentMat = new THREE.MeshPhysicalMaterial({
    color: 0x10b981,
    roughness: 0.28,
    clearcoat: 0.35,
  });
  const brassKnobMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.92,
    roughness: 0.18,
  });
  const glowMat = new THREE.MeshStandardMaterial({
    color: 0x34d399,
    emissive: 0x10b981,
    emissiveIntensity: 1.15,
  });

  // CNC Chamfered Aluminum Base Chassis
  const caseGeo = new THREE.ExtrudeGeometry(makeRoundedRectShape(0.86, 0.33, 0.018), {
    depth: 0.048,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 3,
    curveSegments: 14,
  });
  caseGeo.rotateX(Math.PI / 2);
  caseGeo.translate(0, 0.024, 0);
  group.add(new THREE.Mesh(caseGeo, caseMat));

  // Brass Underside Weight & Recessed Dark Switch Plate
  const brassWeight = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.01, 0.12), brassKnobMat);
  brassWeight.position.set(0, -0.032, 0);
  const switchPlate = new THREE.Mesh(new THREE.BoxGeometry(0.81, 0.006, 0.285), plateMat);
  switchPlate.position.set(0, 0.031, 0);
  const rgbRim = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.004, 0.295), glowMat);
  rgbRim.position.set(0, 0.029, 0);
  group.add(brassWeight, rgbRim, switchPlate);

  // Tapered 4-Sided Sculpted PBT Keycap Geometry
  const keyGeo = new THREE.CylinderGeometry(0.026, 0.034, 0.028, 4);
  keyGeo.rotateY(Math.PI / 4);

  const rows = 4;
  const cols = 11;
  const stepX = 0.072;
  const stepZ = 0.068;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Leave top-right corner slot for rotary encoder knob
      if (r === 0 && c === cols - 1) continue;
      // Leave center bottom slots for wide spacebar
      if (r === 3 && c >= 3 && c <= 6) continue;

      const isAccent = (r === 0 && c === 0) || (r === 2 && c === cols - 1);
      const isModifier = c === 0 || c === cols - 1 || r === 3;
      const mat = isAccent ? accentMat : isModifier ? modKeyMat : creamKeyMat;

      const kMesh = new THREE.Mesh(keyGeo, mat);
      kMesh.position.set(
        (c - (cols - 1) / 2) * stepX,
        0.048,
        (r - (rows - 1) / 2) * stepZ
      );
      group.add(kMesh);
    }
  }

  // Sculpted Wide Spacebar
  const spaceBar = new THREE.Mesh(keyGeo, creamKeyMat);
  spaceBar.scale.set(5.1, 1.0, 1.0);
  spaceBar.position.set(-0.036, 0.048, (3 - (rows - 1) / 2) * stepZ);
  group.add(spaceBar);

  // Knurled Brass Rotary Volume Knob (top-right corner)
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.027, 0.034, 20), brassKnobMat);
  knob.position.set(
    (cols - 1 - (cols - 1) / 2) * stepX,
    0.052,
    (0 - (rows - 1) / 2) * stepZ
  );
  group.add(knob);

  return group;
}

// ---------------------------------------------------------------------------------
// 6. 3D Acoustic Sunburst Guitar (Unified Figure-8 Extruded Luthier Body, Zero Z-Fighting)
// ---------------------------------------------------------------------------------
export function createSolid3DGuitar(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Guitar';

  const sunburstTex = createSunburstTexture();

  // Gloss Nitrocellulose Lacquer Sunburst Soundboard
  const soundboardMat = new THREE.MeshPhysicalMaterial({
    map: sunburstTex,
    roughness: 0.2,
    metalness: 0.03,
    clearcoat: 0.5,
    clearcoatRoughness: 0.15,
  });

  // Rich Satin Mahogany Sides, Back & Neck Heel
  const bodyRimMat = new THREE.MeshStandardMaterial({
    color: 0x3b1708,
    roughness: 0.34,
    metalness: 0.05,
  });

  // Cream/Ivory Luthier Purfling & Binding
  const bindingMat = new THREE.MeshStandardMaterial({
    color: 0xf4ead5,
    roughness: 0.3,
    metalness: 0.04,
  });

  const darkRosewood = new THREE.MeshStandardMaterial({
    color: 0x1e0d05,
    roughness: 0.52,
  });

  const deepCavityMat = new THREE.MeshStandardMaterial({
    color: 0x090402,
    roughness: 0.92,
  });

  const neckMat = new THREE.MeshStandardMaterial({
    color: 0xc8844b,
    roughness: 0.36,
  });

  const silverMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.94,
    roughness: 0.14,
  });

  const bronzeMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.9,
    roughness: 0.16,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.85,
    roughness: 0.2,
  });

  const pearlMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.22,
    metalness: 0.08,
  });

  const tortoiseMat = new THREE.MeshPhysicalMaterial({
    color: 0x451205,
    roughness: 0.16,
    metalness: 0.05,
    clearcoat: 0.6,
  });

  // Helper: Smooth continuous Figure-8 Dreadnought/Auditorium Body Contour
  const makeGuitarBodyShape = (s: number) => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.66 * s);
    // Right lower bout -> waist -> upper bout -> neck crown
    shape.bezierCurveTo(0.24 * s, -0.66 * s, 0.38 * s, -0.52 * s, 0.375 * s, -0.31 * s);
    shape.bezierCurveTo(0.37 * s, -0.15 * s, 0.215 * s, -0.09 * s, 0.215 * s, -0.01 * s);
    shape.bezierCurveTo(0.215 * s, 0.08 * s, 0.29 * s, 0.12 * s, 0.285 * s, 0.21 * s);
    shape.bezierCurveTo(0.28 * s, 0.31 * s, 0.16 * s, 0.36 * s, 0, 0.36 * s);
    // Left upper bout -> waist -> lower bout -> bottom center
    shape.bezierCurveTo(-0.16 * s, 0.36 * s, -0.28 * s, 0.31 * s, -0.285 * s, 0.21 * s);
    shape.bezierCurveTo(-0.29 * s, 0.12 * s, -0.215 * s, 0.08 * s, -0.215 * s, -0.01 * s);
    shape.bezierCurveTo(-0.215 * s, -0.09 * s, -0.37 * s, -0.15 * s, -0.375 * s, -0.31 * s);
    shape.bezierCurveTo(-0.38 * s, -0.52 * s, -0.24 * s, -0.66 * s, 0, -0.66 * s);
    return shape;
  };

  // 1. Unified Mahogany Body + Beveled Sides & Back (spans z = -0.072 to +0.072)
  const mahoganyGeo = new THREE.ExtrudeGeometry(makeGuitarBodyShape(1.0), {
    depth: 0.132,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.006,
    bevelSegments: 3,
    curveSegments: 40,
  });
  mahoganyGeo.translate(0, 0, -0.066);
  group.add(new THREE.Mesh(mahoganyGeo, bodyRimMat));

  // Subtle back center mahogany stripe for clean rear 360° view
  const backStrip = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.94, 0.004), bindingMat);
  backStrip.position.set(0, -0.15, -0.073);
  group.add(backStrip);

  // 2. Ivory Binding Rim Layer (cleanly proud at z = +0.079, strictly non-coplanar)
  const bindingGeo = new THREE.ExtrudeGeometry(makeGuitarBodyShape(0.985), {
    depth: 0.007,
    bevelEnabled: true,
    bevelThickness: 0.002,
    bevelSize: 0.002,
    bevelSegments: 2,
    curveSegments: 40,
  });
  bindingGeo.translate(0, 0, 0.070);
  group.add(new THREE.Mesh(bindingGeo, bindingMat));

  // 3. Unified Sunburst Spruce Soundboard (front surface at z = +0.0845, normalized UVs)
  const soundboardGeo = new THREE.ExtrudeGeometry(makeGuitarBodyShape(0.956), {
    depth: 0.007,
    bevelEnabled: true,
    bevelThickness: 0.0015,
    bevelSize: 0.0015,
    bevelSegments: 2,
    curveSegments: 40,
  });
  soundboardGeo.translate(0, 0, 0.076);
  soundboardGeo.computeBoundingBox();
  if (soundboardGeo.boundingBox) {
    const { min, max } = soundboardGeo.boundingBox;
    const spanX = Math.max(0.001, max.x - min.x);
    const spanY = Math.max(0.001, max.y - min.y);
    const posAttr = soundboardGeo.attributes.position;
    const uvAttr = soundboardGeo.attributes.uv;
    for (let i = 0; i < posAttr.count; i++) {
      uvAttr.setXY(i, (posAttr.getX(i) - min.x) / spanX, (posAttr.getY(i) - min.y) / spanY);
    }
    uvAttr.needsUpdate = true;
  }
  group.add(new THREE.Mesh(soundboardGeo, soundboardMat));

  // 4. Soundhole Cavity & Stepped Rosette Inlays (strict Z spacing >= 0.0008)
  const cavity = new THREE.Mesh(new THREE.CircleGeometry(0.098, 36), deepCavityMat);
  cavity.position.set(0, 0.045, 0.0858);
  const innerRing = new THREE.Mesh(new THREE.RingGeometry(0.098, 0.108, 36), darkRosewood);
  innerRing.position.set(0, 0.045, 0.0865);
  const rosetteRing = new THREE.Mesh(new THREE.RingGeometry(0.110, 0.128, 36), goldMat);
  rosetteRing.position.set(0, 0.045, 0.0872);
  const outerRing = new THREE.Mesh(new THREE.RingGeometry(0.130, 0.138, 36), bindingMat);
  outerRing.position.set(0, 0.045, 0.0879);
  group.add(cavity, innerRing, rosetteRing, outerRing);

  // 5. Sculpted Teardrop Tortoiseshell Pickguard (cleanly right of soundhole)
  const pgShape = new THREE.Shape();
  pgShape.moveTo(0.08, 0.14);
  pgShape.bezierCurveTo(0.14, 0.11, 0.16, 0.01, 0.135, -0.05);
  pgShape.bezierCurveTo(0.11, -0.10, 0.21, -0.14, 0.23, -0.20);
  pgShape.bezierCurveTo(0.24, -0.25, 0.18, -0.27, 0.12, -0.22);
  pgShape.bezierCurveTo(0.06, -0.16, 0.02, -0.07, 0.08, 0.14);
  const pgGeo = new THREE.ExtrudeGeometry(pgShape, {
    depth: 0.0025,
    bevelEnabled: false,
    curveSegments: 20,
  });
  pgGeo.translate(0, 0, 0.0855);
  group.add(new THREE.Mesh(pgGeo, tortoiseMat));

  // 6. Sculpted Rosewood Acoustic Bridge with Compensated Bone Saddle & 6 Bridge Pins
  const bridgeShape = new THREE.Shape();
  bridgeShape.moveTo(-0.125, -0.018);
  bridgeShape.lineTo(-0.08, -0.026);
  bridgeShape.lineTo(0.08, -0.026);
  bridgeShape.lineTo(0.125, -0.018);
  bridgeShape.lineTo(0.12, 0.022);
  bridgeShape.lineTo(-0.12, 0.022);
  bridgeShape.closePath();
  const bridgeGeo = new THREE.ExtrudeGeometry(bridgeShape, {
    depth: 0.016,
    bevelEnabled: true,
    bevelThickness: 0.002,
    bevelSize: 0.002,
    bevelSegments: 2,
  });
  const bridge = new THREE.Mesh(bridgeGeo, darkRosewood);
  bridge.position.set(0, -0.34, 0.084);
  const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.155, 0.007, 0.012), pearlMat);
  saddle.position.set(0, -0.33, 0.104);
  saddle.rotation.z = -0.03;
  group.add(bridge, saddle);

  for (let p = 0; p < 6; p++) {
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.0042, 0.0032, 0.009, 10), pearlMat);
    pin.rotation.x = Math.PI / 2;
    pin.position.set(-0.048 + p * 0.0192, -0.352, 0.103);
    group.add(pin);
  }

  // 7. Tapered Mahogany Neck & Neck Heel (sits cleanly behind soundboard plane z = 0.084)
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.045, 0.84, 12), neckMat);
  neck.scale.set(1.0, 1.0, 0.58);
  neck.position.set(0, 0.65, 0.056);

  const neckHeel = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.032, 0.11, 16), neckMat);
  neckHeel.position.set(0, 0.30, 0.03);
  group.add(neck, neckHeel);

  // 8. Bound Rosewood Fretboard (starts cleanly above rosette at y = 0.195, sits at z = 0.084..0.098)
  const fretboard = new THREE.Mesh(new THREE.BoxGeometry(0.084, 0.87, 0.014), darkRosewood);
  fretboard.position.set(0, 0.63, 0.091);
  group.add(fretboard);

  // Ivory fretboard side binding rails
  [-0.043, 0.043].forEach((bx) => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.87, 0.013), bindingMat);
    rail.position.set(bx, 0.63, 0.091);
    group.add(rail);
  });

  // 9. 15 Precision Nickel-Silver Fret Wires (raised cleanly above fretboard z = 0.0995)
  for (let f = 1; f <= 15; f++) {
    const fretY = 0.21 + f * 0.055;
    const fretWire = new THREE.Mesh(new THREE.BoxGeometry(0.082, 0.0032, 0.003), silverMat);
    fretWire.position.set(0, fretY, 0.0995);
    group.add(fretWire);
  }

  // 10. Pearlescent Position Inlays (Frets 3, 5, 7, 9, 12, 15)
  [3, 5, 7, 9, 15].forEach((fretNum) => {
    const dotY = 0.21 + (fretNum - 0.5) * 0.055;
    const dot = new THREE.Mesh(new THREE.CircleGeometry(0.0058, 12), pearlMat);
    dot.position.set(0, dotY, 0.099);
    group.add(dot);
  });
  [-0.018, 0.018].forEach((xOff) => {
    const dot12 = new THREE.Mesh(new THREE.CircleGeometry(0.005, 12), pearlMat);
    dot12.position.set(xOff, 0.21 + 11.5 * 0.055, 0.099);
    group.add(dot12);
  });

  // 11. Sculpted Bone Nut at top of fretboard
  const nut = new THREE.Mesh(new THREE.BoxGeometry(0.086, 0.012, 0.016), pearlMat);
  nut.position.set(0, 1.068, 0.095);
  group.add(nut);

  // 12. Contoured Acoustic Headstock (12° rear tilt) & 6 Chrome Tuning Pegs
  const headstockGroup = new THREE.Group();
  headstockGroup.position.set(0, 1.068, 0.072);
  headstockGroup.rotation.x = -0.18;

  const hsShape = new THREE.Shape();
  hsShape.moveTo(-0.042, 0);
  hsShape.lineTo(-0.062, 0.19);
  hsShape.quadraticCurveTo(-0.062, 0.23, -0.025, 0.235);
  hsShape.quadraticCurveTo(0, 0.22, 0.025, 0.235);
  hsShape.quadraticCurveTo(0.062, 0.23, 0.062, 0.19);
  hsShape.lineTo(0.042, 0);
  hsShape.closePath();

  const hsGeo = new THREE.ExtrudeGeometry(hsShape, {
    depth: 0.032,
    bevelEnabled: true,
    bevelThickness: 0.003,
    bevelSize: 0.003,
    bevelSegments: 2,
  });
  hsGeo.translate(0, 0, -0.016);
  headstockGroup.add(new THREE.Mesh(hsGeo, bodyRimMat));

  const hsFaceplate = new THREE.Mesh(
    new THREE.ExtrudeGeometry(hsShape, { depth: 0.003, bevelEnabled: false }),
    darkRosewood
  );
  hsFaceplate.position.set(0, 0, 0.019);
  headstockGroup.add(hsFaceplate);

  // Subtle gold headstock crest inlay
  const logoInlay = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.012, 0.002), goldMat);
  logoInlay.position.set(0, 0.19, 0.023);
  headstockGroup.add(logoInlay);

  // 6 Tuning Posts & Butterfly Knobs (3+3)
  [-1, 1].forEach((side) => {
    for (let p = 0; p < 3; p++) {
      const py = 0.055 + p * 0.058;
      const postX = side * 0.034;
      const pegPost = new THREE.Mesh(new THREE.CylinderGeometry(0.0055, 0.0055, 0.036, 12), silverMat);
      pegPost.rotation.x = Math.PI / 2;
      pegPost.position.set(postX, py, 0.022);

      const tunerShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.048, 10), silverMat);
      tunerShaft.rotation.z = Math.PI / 2;
      tunerShaft.position.set(side * 0.068, py, 0);

      const tunerKnob = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.028, 0.018), pearlMat);
      tunerKnob.position.set(side * 0.094, py, 0);

      headstockGroup.add(pegPost, tunerShaft, tunerKnob);
    }
  });
  group.add(headstockGroup);

  // 13. 6 Full Metallic Strings (bridge saddle -> nut -> angled onto headstock posts)
  const stringGauges = [0.0026, 0.0022, 0.0019, 0.0016, 0.0013, 0.0011];
  for (let s = 0; s < 6; s++) {
    const bridgeX = -0.048 + s * 0.0192;
    const nutX = -0.03 + s * 0.012;
    const stringMat = s < 3 ? bronzeMat : silverMat;

    const mainSpanCurve = new THREE.LineCurve3(
      new THREE.Vector3(bridgeX, -0.33, 0.109),
      new THREE.Vector3(nutX, 1.068, 0.105)
    );
    const stringGeo = new THREE.TubeGeometry(mainSpanCurve, 4, stringGauges[s], 6, false);
    group.add(new THREE.Mesh(stringGeo, stringMat));

    // Upper string segment onto corresponding tuning peg post
    const isLeft = s < 3;
    const pegIdx = isLeft ? s : 5 - s;
    const pegPostLocalY = 0.055 + pegIdx * 0.058;
    const pegWorldPos = new THREE.Vector3(isLeft ? -0.034 : 0.034, pegPostLocalY, 0.028)
      .applyEuler(new THREE.Euler(-0.18, 0, 0))
      .add(new THREE.Vector3(0, 1.068, 0.072));
    const headSpanCurve = new THREE.LineCurve3(
      new THREE.Vector3(nutX, 1.068, 0.105),
      pegWorldPos
    );
    group.add(new THREE.Mesh(new THREE.TubeGeometry(headSpanCurve, 2, stringGauges[s], 6, false), stringMat));
  }

  return group;
}

// ---------------------------------------------------------------------------------
// 7. 3D White Streetwear Sneaker (Contoured Cupsole, Collar, Eyelets & Tube Laces)
// ---------------------------------------------------------------------------------
export function createSolid3DSneaker(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Sneaker';

  const whiteLeatherTex = getCachedWhiteLeather();

  const leatherMat = new THREE.MeshPhysicalMaterial({
    map: whiteLeatherTex,
    color: 0xffffff,
    roughness: 0.34,
    metalness: 0.02,
    clearcoat: 0.18,
  });
  const soleMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.55,
    metalness: 0.02,
  });
  const treadMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.8,
  });
  const linerMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.85,
  });
  const accentMat = new THREE.MeshPhysicalMaterial({
    color: 0x10b981,
    roughness: 0.28,
    clearcoat: 0.35,
  });
  const silverMat = new THREE.MeshStandardMaterial({
    color: 0xd1d5db,
    metalness: 0.88,
    roughness: 0.18,
  });

  // Sculpted Plan-View Shoe Footprint Shape (Z = heel(-0.42) to toe(+0.42))
  const soleShape = new THREE.Shape();
  soleShape.moveTo(0, -0.41);
  soleShape.bezierCurveTo(0.13, -0.41, 0.165, -0.30, 0.155, -0.15);
  soleShape.bezierCurveTo(0.145, -0.02, 0.14, 0.06, 0.165, 0.18);
  soleShape.bezierCurveTo(0.18, 0.31, 0.125, 0.42, 0, 0.42);
  soleShape.bezierCurveTo(-0.125, 0.42, -0.18, 0.31, -0.165, 0.18);
  soleShape.bezierCurveTo(-0.14, 0.06, -0.145, -0.02, -0.155, -0.15);
  soleShape.bezierCurveTo(-0.165, -0.30, -0.13, -0.41, 0, -0.41);

  // Heavy Beveled Cupsole Midsole + Dark Outsole Rubber & Waffle Lugs
  const midsoleGeo = new THREE.ExtrudeGeometry(soleShape, {
    depth: 0.075,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.01,
    bevelSegments: 3,
    curveSegments: 28,
  });
  midsoleGeo.rotateX(Math.PI / 2);
  midsoleGeo.translate(0, 0.032, 0);
  group.add(new THREE.Mesh(midsoleGeo, soleMat));

  const outsoleGeo = new THREE.ExtrudeGeometry(soleShape, {
    depth: 0.018,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.005,
    bevelSegments: 2,
    curveSegments: 24,
  });
  outsoleGeo.rotateX(Math.PI / 2);
  outsoleGeo.translate(0, -0.044, 0);
  group.add(new THREE.Mesh(outsoleGeo, treadMat));

  for (let t = -3; t <= 3; t++) {
    const lug = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.012, 0.035), treadMat);
    lug.position.set(0, -0.064, t * 0.10);
    group.add(lug);
  }

  // Contoured Leather Vamp / Toe Box Shell
  const vampGeo = new THREE.ExtrudeGeometry(soleShape, {
    depth: 0.088,
    bevelEnabled: true,
    bevelThickness: 0.024,
    bevelSize: 0.012,
    bevelSegments: 4,
    curveSegments: 28,
  });
  vampGeo.rotateX(Math.PI / 2);
  vampGeo.scale(0.92, 1.0, 0.94);
  vampGeo.translate(0, 0.125, -0.01);
  group.add(new THREE.Mesh(vampGeo, leatherMat));

  // Tapered Upper Quarter & Heel Counter + Padded Ankle Collar Opening
  const quarterPts = [
    new THREE.Vector2(0.118, 0.0),
    new THREE.Vector2(0.155, 0.02),
    new THREE.Vector2(0.162, 0.12),
    new THREE.Vector2(0.145, 0.21),
    new THREE.Vector2(0.115, 0.22),
    new THREE.Vector2(0.105, 0.11),
  ];
  const collarGeo = new THREE.LatheGeometry(quarterPts, 24);
  collarGeo.scale(0.95, 1.0, 1.32);
  const collar = new THREE.Mesh(collarGeo, leatherMat);
  collar.position.set(0, 0.045, -0.175);
  group.add(collar);

  // Inner Padded Charcoal Sockliner & Insole Bed
  const liner = new THREE.Mesh(new THREE.CylinderGeometry(0.102, 0.098, 0.16, 20), linerMat);
  liner.scale.set(0.92, 1.0, 1.24);
  liner.position.set(0, 0.165, -0.175);
  group.add(liner);

  // Emerald Heel Overlay & Pull Tab
  const heelOverlay = new THREE.Mesh(
    new THREE.CylinderGeometry(0.148, 0.156, 0.085, 18, 1, false, Math.PI * 0.65, Math.PI * 0.7),
    accentMat
  );
  heelOverlay.position.set(0, 0.205, -0.235);
  const pullTab = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.075, 0.016), accentMat);
  pullTab.position.set(0, 0.272, -0.355);
  pullTab.rotation.x = -0.28;
  group.add(heelOverlay, pullTab);

  // Raised Vamp Tongue
  const tongueGeo = new THREE.ExtrudeGeometry(makeRoundedRectShape(0.145, 0.26, 0.045), {
    depth: 0.024,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.006,
    bevelSegments: 3,
  });
  const tongue = new THREE.Mesh(tongueGeo, leatherMat);
  tongue.position.set(0, 0.195, 0.045);
  tongue.rotation.x = -0.92;
  group.add(tongue);

  // Emerald Tongue Tag
  const tongueTag = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.038, 0.008), accentMat);
  tongueTag.position.set(0, 0.265, -0.032);
  tongueTag.rotation.x = 0.65;
  group.add(tongueTag);

  // 5 Pairs of Silver Eyelets + Criss-Cross TubeGeometry Emerald Laces
  for (let l = 0; l < 5; l++) {
    const t = l / 4;
    const zPos = 0.17 - t * 0.21;
    const yPos = 0.135 + t * 0.125;

    [-0.088, 0.088].forEach((ex) => {
      const eyelet = new THREE.Mesh(new THREE.TorusGeometry(0.011, 0.0038, 8, 14), silverMat);
      eyelet.rotation.x = Math.PI / 2 - 0.55;
      eyelet.position.set(ex, yPos, zPos);
      group.add(eyelet);
    });

    if (l < 4) {
      const nextZ = 0.17 - ((l + 1) / 4) * 0.21;
      const nextY = 0.135 + ((l + 1) / 4) * 0.125;
      const crossA = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.085, yPos + 0.005, zPos),
        new THREE.Vector3(0, (yPos + nextY) * 0.5 + 0.016, (zPos + nextZ) * 0.5),
        new THREE.Vector3(0.085, nextY + 0.005, nextZ),
      ]);
      const crossB = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.085, yPos + 0.005, zPos),
        new THREE.Vector3(0, (yPos + nextY) * 0.5 + 0.019, (zPos + nextZ) * 0.5),
        new THREE.Vector3(-0.085, nextY + 0.005, nextZ),
      ]);
      group.add(
        new THREE.Mesh(new THREE.TubeGeometry(crossA, 10, 0.0065, 8, false), accentMat),
        new THREE.Mesh(new THREE.TubeGeometry(crossB, 10, 0.0065, 8, false), accentMat)
      );
    }
  }

  // Tied Lace Bow Loops on Top Collar
  const knot = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 10), accentMat);
  knot.position.set(0, 0.285, -0.055);
  [-1, 1].forEach((side) => {
    const loopCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.285, -0.055),
      new THREE.Vector3(side * 0.06, 0.315, -0.045),
      new THREE.Vector3(side * 0.075, 0.295, -0.085),
      new THREE.Vector3(0, 0.285, -0.055),
    ]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(loopCurve, 16, 0.006, 8, false), accentMat));
  });
  group.add(knot);

  // Sculpted Side Emerald Swoosh Badges (Left & Right Flanks)
  const swooshShape = new THREE.Shape();
  swooshShape.moveTo(-0.20, 0.055);
  swooshShape.bezierCurveTo(-0.08, -0.02, 0.06, -0.03, 0.22, 0.06);
  swooshShape.bezierCurveTo(0.07, 0.005, -0.06, 0.015, -0.18, 0.08);
  swooshShape.closePath();
  const swooshGeo = new THREE.ExtrudeGeometry(swooshShape, {
    depth: 0.008,
    bevelEnabled: true,
    bevelThickness: 0.002,
    bevelSize: 0.002,
    bevelSegments: 2,
    curveSegments: 16,
  });
  [-1, 1].forEach((side) => {
    const swoosh = new THREE.Mesh(swooshGeo, accentMat);
    swoosh.rotation.y = side * (Math.PI / 2);
    swoosh.position.set(side * 0.156, 0.088, -0.03);
    group.add(swoosh);
  });

  return group;
}

// ---------------------------------------------------------------------------------
// 8. 3D Stack of Hardcover Books (Rounded Spines, Foil Bands, Layered Pages & Ribbon)
// ---------------------------------------------------------------------------------
export function createSolid3DBooks(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Books';

  const pagesTex = getCachedPageEdges();

  const pagesMat = new THREE.MeshStandardMaterial({
    map: pagesTex,
    color: 0xfdfaf2,
    roughness: 0.8,
  });
  const foilMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.88,
    roughness: 0.2,
  });
  const ribbonMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    roughness: 0.55,
  });

  const bookConfigs = [
    { color: 0x15803d, w: 0.56, d: 0.76, h: 0.095, rotY: -0.14, posX: 0, posZ: 0 },
    { color: 0x1d4ed8, w: 0.52, d: 0.72, h: 0.09, rotY: 0.08, posX: 0.02, posZ: -0.01 },
    { color: 0xd97706, w: 0.48, d: 0.68, h: 0.085, rotY: 0.24, posX: -0.01, posZ: 0.01 },
  ];

  let yCursor = -0.10;
  bookConfigs.forEach((cfg, idx) => {
    const bookGroup = new THREE.Group();
    bookGroup.position.set(cfg.posX, yCursor + cfg.h * 0.5, cfg.posZ);
    bookGroup.rotation.y = cfg.rotY;
    yCursor += cfg.h;

    const coverMat = new THREE.MeshStandardMaterial({
      color: cfg.color,
      roughness: 0.52,
      metalness: 0.04,
    });

    // Top & Bottom Rigid Overhanging Hardcover Boards
    const boardGeo = new THREE.ExtrudeGeometry(makeRoundedRectShape(cfg.w, cfg.d, 0.012), {
      depth: 0.011,
      bevelEnabled: true,
      bevelThickness: 0.002,
      bevelSize: 0.002,
      bevelSegments: 2,
    });
    boardGeo.rotateX(Math.PI / 2);

    const topBoard = new THREE.Mesh(boardGeo, coverMat);
    topBoard.position.y = cfg.h * 0.5 - 0.004;
    const botBoard = new THREE.Mesh(boardGeo, coverMat);
    botBoard.position.y = -cfg.h * 0.5 + 0.012;
    group.add(bookGroup);

    // Curved Left Spine Ridge (Cylinder half-arc running along Z)
    const spineGeo = new THREE.CylinderGeometry(
      cfg.h * 0.52,
      cfg.h * 0.52,
      cfg.d,
      16,
      1,
      false,
      Math.PI,
      Math.PI
    );
    spineGeo.rotateX(Math.PI / 2);
    const spine = new THREE.Mesh(spineGeo, coverMat);
    spine.position.set(-cfg.w * 0.5 + 0.008, 0, 0);

    // Recessed Ivory Page Block (slightly inset from top/bottom boards & spine)
    const pages = new THREE.Mesh(
      new THREE.BoxGeometry(cfg.w - 0.042, cfg.h - 0.022, cfg.d - 0.026),
      pagesMat
    );
    pages.position.set(0.012, 0, 0);

    // Gold Foil Spine Stamped Ribs & Title Plaque
    [-0.22, 0.22].forEach((fz) => {
      const band = new THREE.Mesh(
        new THREE.CylinderGeometry(cfg.h * 0.535, cfg.h * 0.535, 0.014, 16, 1, false, Math.PI, Math.PI),
        foilMat
      );
      band.rotation.x = Math.PI / 2;
      band.position.set(-cfg.w * 0.5 + 0.008, 0, fz);
      bookGroup.add(band);
    });
    const titlePlate = new THREE.Mesh(
      new THREE.CylinderGeometry(cfg.h * 0.534, cfg.h * 0.534, 0.14, 16, 1, false, Math.PI * 1.15, Math.PI * 0.7),
      foilMat
    );
    titlePlate.rotation.x = Math.PI / 2;
    titlePlate.position.set(-cfg.w * 0.5 + 0.008, 0, -0.02);

    // Gold cover emblem on the topmost book
    if (idx === bookConfigs.length - 1) {
      const emblem = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.004, 0.22), foilMat);
      emblem.position.set(0.02, cfg.h * 0.5 + 0.001, 0);
      bookGroup.add(emblem);

      // Crimson Satin Ribbon Bookmark draping out from page edge
      const ribbonCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.08, 0.0, 0.12),
        new THREE.Vector3(0.24, -0.005, 0.34),
        new THREE.Vector3(0.27, -0.045, 0.41),
        new THREE.Vector3(0.29, -0.095, 0.45),
      ]);
      const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 14, 0.008, 6, false);
      ribbonGeo.scale(1.8, 0.35, 1.0);
      bookGroup.add(new THREE.Mesh(ribbonGeo, ribbonMat));
    }

    bookGroup.add(topBoard, botBoard, spine, pages, titlePlate);
  });

  return group;
}

// ---------------------------------------------------------------------------------
// 9. 3D Pro DSLR Camera (Sculpted Alloy Chassis, Curved Grip & AR Telephoto Optics)
// ---------------------------------------------------------------------------------
export function createSolid3DCamera(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Camera';

  const leatherTex = getCachedPebbledLeather();
  const metalTex = getCachedBrushedMetal();
  const rearScreenTex = getCachedDSLRRearScreen();

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x1c2026,
    roughness: 0.42,
    metalness: 0.45,
    clearcoat: 0.18,
  });
  const gripMat = new THREE.MeshStandardMaterial({
    map: leatherTex,
    color: 0x131519,
    roughness: 0.88,
    metalness: 0.05,
  });
  const rubberRingMat = new THREE.MeshStandardMaterial({
    color: 0x181a1f,
    roughness: 0.78,
  });
  const metalMat = new THREE.MeshStandardMaterial({
    map: metalTex,
    color: 0xd1d5db,
    metalness: 0.92,
    roughness: 0.16,
  });
  const redMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    metalness: 0.35,
    roughness: 0.25,
  });
  const opticalDarkMat = new THREE.MeshStandardMaterial({
    color: 0x05080f,
    roughness: 0.9,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0c4a6e,
    metalness: 0.28,
    roughness: 0.04,
    clearcoat: 1.0,
    iridescence: 0.9,
    iridescenceIOR: 1.45,
  });
  const lcdMat = new THREE.MeshStandardMaterial({
    map: rearScreenTex,
    emissiveMap: rearScreenTex,
    emissive: 0xffffff,
    emissiveIntensity: 0.45,
    roughness: 0.12,
  });

  // Rounded Magnesium Alloy Camera Chassis (ExtrudeGeometry)
  const bodyGeo = new THREE.ExtrudeGeometry(makeRoundedRectShape(0.66, 0.43, 0.045), {
    depth: 0.22,
    bevelEnabled: true,
    bevelThickness: 0.018,
    bevelSize: 0.015,
    bevelSegments: 4,
    curveSegments: 16,
  });
  bodyGeo.translate(0, 0, -0.11);
  group.add(new THREE.Mesh(bodyGeo, bodyMat));

  // Ergonomic Curved Right-Hand Leather Grip Bulge
  const gripShape = new THREE.Shape();
  gripShape.moveTo(-0.04, -0.09);
  gripShape.bezierCurveTo(0.08, -0.09, 0.11, 0.02, 0.085, 0.095);
  gripShape.bezierCurveTo(0.06, 0.15, -0.04, 0.14, -0.055, 0.06);
  gripShape.closePath();
  const gripGeo = new THREE.ExtrudeGeometry(gripShape, {
    depth: 0.39,
    bevelEnabled: true,
    bevelThickness: 0.016,
    bevelSize: 0.014,
    bevelSegments: 4,
    curveSegments: 16,
  });
  gripGeo.rotateX(Math.PI / 2);
  const grip = new THREE.Mesh(gripGeo, gripMat);
  grip.position.set(0.24, 0.19, 0.09);
  group.add(grip);

  // Sloped Pentaprism Viewfinder Housing + Flash Hotshoe Rails + Eyecup
  const vfShape = new THREE.Shape();
  vfShape.moveTo(-0.135, 0);
  vfShape.lineTo(-0.085, 0.115);
  vfShape.lineTo(0.085, 0.115);
  vfShape.lineTo(0.135, 0);
  vfShape.closePath();
  const vfGeo = new THREE.ExtrudeGeometry(vfShape, {
    depth: 0.21,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.01,
    bevelSegments: 3,
  });
  vfGeo.translate(0, 0, -0.105);
  const vf = new THREE.Mesh(vfGeo, bodyMat);
  vf.position.set(-0.05, 0.21, -0.01);

  const hotShoeBase = new THREE.Mesh(new THREE.BoxGeometry(0.088, 0.014, 0.088), metalMat);
  hotShoeBase.position.set(-0.05, 0.34, -0.01);
  const eyecup = new THREE.Mesh(new THREE.TorusGeometry(0.044, 0.014, 10, 20), rubberRingMat);
  eyecup.position.set(-0.05, 0.255, -0.135);
  group.add(vf, hotShoeBase, eyecup);

  // Rear 3-inch LiveView LCD Display with Camera HUD Telemetry
  const lcdBezel = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.30, 0.014), opticalDarkMat);
  lcdBezel.position.set(-0.06, -0.02, -0.128);
  const rearScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.39, 0.27), lcdMat);
  rearScreen.rotation.y = Math.PI;
  rearScreen.position.set(-0.06, -0.02, -0.137);
  group.add(lcdBezel, rearScreen);

  // Top Command Dials & Angled Shutter Button
  const modeDial = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.065, 0.045, 22), bodyMat);
  modeDial.position.set(-0.24, 0.245, -0.01);
  const dialRing = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.064, 0.012, 22), metalMat);
  dialRing.position.set(-0.24, 0.228, -0.01);
  const shutterCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.052, 0.032, 18), metalMat);
  shutterCollar.position.set(0.24, 0.225, 0.085);
  shutterCollar.rotation.x = 0.22;
  const shutterBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.030, 0.030, 0.022, 18), redMat);
  shutterBtn.position.set(0.24, 0.242, 0.09);
  shutterBtn.rotation.x = 0.22;
  group.add(modeDial, dialRing, shutterCollar, shutterBtn);

  // Stepped Pro 24-70mm Telephoto Lens Assembly
  const lensX = -0.05;
  const mountRing = new THREE.Mesh(new THREE.CylinderGeometry(0.215, 0.222, 0.035, 32), metalMat);
  mountRing.rotation.x = Math.PI / 2;
  mountRing.position.set(lensX, -0.01, 0.138);

  const lensChassis = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.212, 0.12, 32), bodyMat);
  lensChassis.rotation.x = Math.PI / 2;
  lensChassis.position.set(lensX, -0.01, 0.21);

  // Ribbed Zoom & Focus Rubber Rings
  const zoomRing = new THREE.Mesh(new THREE.CylinderGeometry(0.212, 0.212, 0.075, 28), rubberRingMat);
  zoomRing.rotation.x = Math.PI / 2;
  zoomRing.position.set(lensX, -0.01, 0.215);
  for (let r = 0; r < 18; r++) {
    const a = (r / 18) * Math.PI * 2;
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.01, 0.068), bodyMat);
    rib.position.set(lensX + Math.cos(a) * 0.212, -0.01 + Math.sin(a) * 0.212, 0.215);
    rib.rotation.z = a;
    group.add(rib);
  }

  // Iconic Anodized Red Luxury Accent Ring + Focus Ring + Hood Collar
  const redRing = new THREE.Mesh(new THREE.TorusGeometry(0.206, 0.008, 10, 32), redMat);
  redRing.position.set(lensX, -0.01, 0.275);
  const frontBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.202, 0.206, 0.06, 32), bodyMat);
  frontBarrel.rotation.x = Math.PI / 2;
  frontBarrel.position.set(lensX, -0.01, 0.305);
  const filterLip = new THREE.Mesh(new THREE.TorusGeometry(0.196, 0.012, 10, 32), metalMat);
  filterLip.position.set(lensX, -0.01, 0.335);

  // Recessed Dark Baffle Cavity + Convex Multi-Coated Sapphire Glass Front Element
  const baffle = new THREE.Mesh(new THREE.CircleGeometry(0.184, 32), opticalDarkMat);
  baffle.position.set(lensX, -0.01, 0.312);
  const innerApertureRing = new THREE.Mesh(new THREE.RingGeometry(0.095, 0.135, 24), metalMat);
  innerApertureRing.position.set(lensX, -0.01, 0.316);
  const frontGlass = new THREE.Mesh(
    new THREE.SphereGeometry(0.184, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.32),
    glassMat
  );
  frontGlass.rotation.x = Math.PI / 2;
  frontGlass.position.set(lensX, -0.01, 0.225);

  group.add(
    mountRing,
    lensChassis,
    zoomRing,
    redRing,
    frontBarrel,
    filterLip,
    baffle,
    innerApertureRing,
    frontGlass
  );

  return group;
}

// ---------------------------------------------------------------------------------
// 10. 3D Handheld Nintendo Switch OLED (Rounded Joy-Cons, Game Screen & Triggers)
// ---------------------------------------------------------------------------------
export function createSolid3DConsole(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Console';

  const screenTex = getCachedSwitchScreen();

  const tabletMat = new THREE.MeshPhysicalMaterial({
    color: 0x181c22,
    roughness: 0.32,
    metalness: 0.25,
    clearcoat: 0.2,
  });
  const glassBezelMat = new THREE.MeshPhysicalMaterial({
    color: 0x090b0f,
    roughness: 0.06,
    clearcoat: 1.0,
  });
  const screenMat = new THREE.MeshStandardMaterial({
    map: screenTex,
    emissiveMap: screenTex,
    emissive: 0xffffff,
    emissiveIntensity: 0.55,
    roughness: 0.12,
  });
  const cyanJoyMat = new THREE.MeshPhysicalMaterial({
    color: 0x06b6d4,
    roughness: 0.32,
    clearcoat: 0.25,
  });
  const redJoyMat = new THREE.MeshPhysicalMaterial({
    color: 0xf43f5e,
    roughness: 0.32,
    clearcoat: 0.25,
  });
  const btnMat = new THREE.MeshStandardMaterial({
    color: 0x111317,
    roughness: 0.5,
  });

  // Main Rounded OLED Tablet Body
  const tabletGeo = new THREE.ExtrudeGeometry(makeRoundedRectShape(0.64, 0.365, 0.022), {
    depth: 0.044,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.005,
    bevelSegments: 3,
  });
  tabletGeo.translate(0, 0, -0.022);
  group.add(new THREE.Mesh(tabletGeo, tabletMat));

  // Dark Glass Screen Frame & Crisp Game UI Plane
  const bezelGeo = new THREE.ExtrudeGeometry(makeRoundedRectShape(0.60, 0.335, 0.015), {
    depth: 0.004,
    bevelEnabled: false,
  });
  bezelGeo.translate(0, 0, 0.025);
  group.add(new THREE.Mesh(bezelGeo, glassBezelMat));

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.545, 0.295), screenMat);
  screen.position.z = 0.0305;
  group.add(screen);

  // Top cooling vents & volume buttons
  const vents = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.012, 0.016), btnMat);
  vents.position.set(0.06, 0.188, 0);
  const volBtn = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.014, 0.012), btnMat);
  volBtn.position.set(-0.18, 0.189, 0);
  group.add(vents, volBtn);

  // Helper: Rounded Single-End Joy-Con Silhouette (flush inner rail, curved outer edge)
  const makeJoyConGeo = (isRight: boolean) => {
    const s = new THREE.Shape();
    const dir = isRight ? 1 : -1;
    s.moveTo(0, -0.182);
    s.lineTo(dir * 0.085, -0.182);
    s.bezierCurveTo(dir * 0.165, -0.182, dir * 0.175, -0.11, dir * 0.175, 0);
    s.bezierCurveTo(dir * 0.175, 0.11, dir * 0.165, 0.182, dir * 0.085, 0.182);
    s.lineTo(0, 0.182);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.044,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.008,
      bevelSegments: 4,
      curveSegments: 18,
    });
    g.translate(0, 0, -0.022);
    return g;
  };

  // Concave Joy-Con Thumbstick Geometry
  const stickPts = [
    new THREE.Vector2(0.0, 0.022),
    new THREE.Vector2(0.028, 0.026),
    new THREE.Vector2(0.036, 0.025),
    new THREE.Vector2(0.036, 0.016),
    new THREE.Vector2(0.013, 0.012),
    new THREE.Vector2(0.013, 0.0),
    new THREE.Vector2(0.0, 0.0),
  ];
  const stickGeo = new THREE.LatheGeometry(stickPts, 18);
  stickGeo.rotateX(Math.PI / 2);

  // Left Cyan Joy-Con
  const leftJoy = new THREE.Mesh(makeJoyConGeo(false), cyanJoyMat);
  leftJoy.position.x = -0.328;
  const leftStick = new THREE.Mesh(stickGeo, btnMat);
  leftStick.position.set(-0.415, 0.072, 0.032);
  const leftTrigger = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.024, 0.038), btnMat);
  leftTrigger.position.set(-0.41, 0.186, -0.008);
  group.add(leftJoy, leftStick, leftTrigger);

  // Left 4 D-Pad Buttons + Capture Square Button
  [
    [-0.415, -0.02],
    [-0.415, -0.09],
    [-0.45, -0.055],
    [-0.38, -0.055],
  ].forEach(([bx, by]) => {
    const dBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.012, 12), btnMat);
    dBtn.rotation.x = Math.PI / 2;
    dBtn.position.set(bx, by, 0.032);
    group.add(dBtn);
  });
  const capBtn = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.024, 0.01), btnMat);
  capBtn.position.set(-0.375, -0.128, 0.032);
  group.add(capBtn);

  // Right Coral-Red Joy-Con
  const rightJoy = new THREE.Mesh(makeJoyConGeo(true), redJoyMat);
  rightJoy.position.x = 0.328;
  const rightStick = new THREE.Mesh(stickGeo, btnMat);
  rightStick.position.set(0.415, -0.052, 0.032);
  const rightTrigger = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.024, 0.038), btnMat);
  rightTrigger.position.set(0.41, 0.186, -0.008);
  group.add(rightJoy, rightStick, rightTrigger);

  // Right ABXY Tactile Buttons + Home Ring Button
  [
    [0.415, 0.105],
    [0.415, 0.035],
    [0.45, 0.07],
    [0.38, 0.07],
  ].forEach(([bx, by]) => {
    const abBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.012, 12), btnMat);
    abBtn.rotation.x = Math.PI / 2;
    abBtn.position.set(bx, by, 0.032);
    group.add(abBtn);
  });
  const homeBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.01, 14), btnMat);
  homeBtn.rotation.x = Math.PI / 2;
  homeBtn.position.set(0.375, -0.128, 0.032);
  group.add(homeBtn);

  return group;
}

// ---------------------------------------------------------------------------------
// 11. 3D Wireless Pro Gamepad (Sculpted Dual-Grip Shell, Concave Sticks & ABXY)
// ---------------------------------------------------------------------------------
export function createSolid3DGamepad(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Gamepad';

  const leatherTex = getCachedPebbledLeather();
  const metalTex = getCachedBrushedMetal();

  const shellMat = new THREE.MeshPhysicalMaterial({
    color: 0x1e242c,
    roughness: 0.34,
    metalness: 0.18,
    clearcoat: 0.35,
  });
  const gripMat = new THREE.MeshStandardMaterial({
    map: leatherTex,
    color: 0x14171c,
    roughness: 0.85,
  });
  const trimMat = new THREE.MeshStandardMaterial({
    map: metalTex,
    color: 0x64748b,
    metalness: 0.78,
    roughness: 0.25,
  });
  const stickMat = new THREE.MeshStandardMaterial({
    color: 0x0f1115,
    roughness: 0.65,
  });
  const glowMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0ea5e9,
    emissiveIntensity: 1.35,
  });

  // Ergonomic Contoured Center Faceplate (ExtrudeGeometry)
  const padShape = new THREE.Shape();
  padShape.moveTo(-0.22, 0.09);
  padShape.bezierCurveTo(-0.12, 0.135, 0.12, 0.135, 0.22, 0.09);
  padShape.bezierCurveTo(0.28, 0.05, 0.27, -0.08, 0.18, -0.10);
  padShape.bezierCurveTo(0.09, -0.06, -0.09, -0.06, -0.18, -0.10);
  padShape.bezierCurveTo(-0.27, -0.08, -0.28, 0.05, -0.22, 0.09);

  const bodyGeo = new THREE.ExtrudeGeometry(padShape, {
    depth: 0.085,
    bevelEnabled: true,
    bevelThickness: 0.022,
    bevelSize: 0.018,
    bevelSegments: 4,
    curveSegments: 24,
  });
  bodyGeo.rotateX(-Math.PI / 2);
  bodyGeo.translate(0, -0.042, 0);
  group.add(new THREE.Mesh(bodyGeo, shellMat));

  // Tapered Contoured Palm Grips (Left & Right)
  const gripPts = [
    new THREE.Vector2(0.0, -0.14),
    new THREE.Vector2(0.044, -0.135),
    new THREE.Vector2(0.068, -0.06),
    new THREE.Vector2(0.072, 0.04),
    new THREE.Vector2(0.058, 0.10),
    new THREE.Vector2(0.0, 0.10),
  ];
  const gripGeo = new THREE.LatheGeometry(gripPts, 20);
  [-1, 1].forEach((side) => {
    const gMesh = new THREE.Mesh(gripGeo, gripMat);
    gMesh.position.set(side * 0.22, -0.045, 0.06);
    gMesh.rotation.z = side * 0.42;
    gMesh.rotation.x = 0.48;
    group.add(gMesh);
  });

  // Central Touchpad / Lightbar & Home Button
  const touchpad = new THREE.Mesh(
    new THREE.ExtrudeGeometry(makeRoundedRectShape(0.14, 0.075, 0.015), {
      depth: 0.012,
      bevelEnabled: true,
      bevelThickness: 0.003,
      bevelSize: 0.003,
      bevelSegments: 2,
    }),
    trimMat
  );
  touchpad.rotation.x = -Math.PI / 2;
  touchpad.position.set(0, 0.062, -0.035);
  const homeBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.012, 16), glowMat);
  homeBtn.position.set(0, 0.066, 0.032);
  const lightBar = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.008, 0.008), glowMat);
  lightBar.position.set(0, 0.069, -0.078);
  group.add(touchpad, homeBtn, lightBar);

  // Dual Concave Analog Thumbsticks (Lathe cup head + stem)
  const capPts = [
    new THREE.Vector2(0.0, 0.034),
    new THREE.Vector2(0.034, 0.038),
    new THREE.Vector2(0.044, 0.038),
    new THREE.Vector2(0.044, 0.025),
    new THREE.Vector2(0.016, 0.018),
    new THREE.Vector2(0.016, 0.0),
    new THREE.Vector2(0.0, 0.0),
  ];
  const stickGeo = new THREE.LatheGeometry(capPts, 20);
  [
    [-0.105, 0.038],
    [0.105, 0.038],
  ].forEach(([sx, sz]) => {
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.044, 0.005, 8, 20), trimMat);
    collar.rotation.x = Math.PI / 2;
    collar.position.set(sx, 0.066, sz);
    const stick = new THREE.Mesh(stickGeo, stickMat);
    stick.position.set(sx, 0.065, sz);
    group.add(collar, stick);
  });

  // Sculpted Cross D-Pad
  const dpadH = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.018, 0.03), trimMat);
  dpadH.position.set(-0.155, 0.071, -0.03);
  const dpadV = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.018, 0.095), trimMat);
  dpadV.position.set(-0.155, 0.071, -0.03);
  group.add(dpadH, dpadV);

  // 4 Glossy Colored ABXY Face Buttons
  const abxy: Array<[number, number, number]> = [
    [0.155, 0.005, 0x22c55e],
    [0.192, -0.03, 0xef4444],
    [0.118, -0.03, 0x3b82f6],
    [0.155, -0.065, 0xf59e0b],
  ];
  abxy.forEach(([bx, bz, col]) => {
    const btn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.017, 0.017, 0.018, 16),
      new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.18, clearcoat: 0.8 })
    );
    btn.position.set(bx, 0.071, bz);
    group.add(btn);
  });

  // L1/R1 Bumpers & L2/R2 Analog Triggers
  [-0.145, 0.145].forEach((tx) => {
    const bumper = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.022, 0.028), trimMat);
    bumper.position.set(tx, 0.028, -0.118);
    const trigger = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.035, 0.042), gripMat);
    trigger.position.set(tx, -0.008, -0.125);
    trigger.rotation.x = 0.35;
    group.add(bumper, trigger);
  });

  return group;
}

// ---------------------------------------------------------------------------------
// 12. 3D Smartwatch (Titanium Squircle Case, Sapphire Dome, OLED Rings & Sport Band)
// ---------------------------------------------------------------------------------
export function createSolid3DSmartwatch(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Smartwatch';

  const metalTex = getCachedBrushedMetal();
  const faceTex = getCachedSmartwatchFace();

  const titaniumMat = new THREE.MeshStandardMaterial({
    map: metalTex,
    color: 0x334155,
    roughness: 0.24,
    metalness: 0.88,
  });
  const bezelMat = new THREE.MeshStandardMaterial({
    color: 0x090b10,
    roughness: 0.15,
    metalness: 0.3,
  });
  const faceMat = new THREE.MeshStandardMaterial({
    map: faceTex,
    emissiveMap: faceTex,
    emissive: 0xffffff,
    emissiveIntensity: 0.65,
    roughness: 0.15,
  });
  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.16,
    roughness: 0.03,
    clearcoat: 1.0,
    depthWrite: false,
  });
  const strapMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.72,
    metalness: 0.05,
  });
  const crownAccentMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.3,
    metalness: 0.4,
  });

  // Beveled Titanium Squircle Watch Case
  const caseGeo = new THREE.ExtrudeGeometry(makeRoundedRectShape(0.22, 0.27, 0.052), {
    depth: 0.048,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 4,
    curveSegments: 16,
  });
  caseGeo.translate(0, 0, -0.024);
  group.add(new THREE.Mesh(caseGeo, titaniumMat));

  // Rear optical heart-rate ceramic sensor dome
  const sensorBack = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.072, 0.014, 24), bezelMat);
  sensorBack.rotation.x = Math.PI / 2;
  sensorBack.position.z = -0.038;
  group.add(sensorBack);

  // Dark Bezel Glass Frame + Crisp OLED Activity-Rings Screen + Sapphire Top Overlay
  const screenGeo = new THREE.ExtrudeGeometry(makeRoundedRectShape(0.196, 0.244, 0.042), {
    depth: 0.004,
    bevelEnabled: false,
    curveSegments: 14,
  });
  screenGeo.translate(0, 0, 0.034);
  group.add(new THREE.Mesh(screenGeo, bezelMat));

  const displayPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.175, 0.218), faceMat);
  displayPlane.position.z = 0.0395;
  group.add(displayPlane);

  const crystalOverlay = new THREE.Mesh(
    new THREE.ExtrudeGeometry(makeRoundedRectShape(0.194, 0.242, 0.042), {
      depth: 0.005,
      bevelEnabled: true,
      bevelThickness: 0.004,
      bevelSize: 0.003,
      bevelSegments: 3,
    }),
    crystalMat
  );
  crystalOverlay.position.z = 0.039;
  crystalOverlay.renderOrder = 2;
  group.add(crystalOverlay);

  // Tactile Digital Crown & Red Ring + Action Side Button
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.028, 16), titaniumMat);
  crown.rotation.z = Math.PI / 2;
  crown.position.set(0.128, 0.045, 0.002);
  const crownRing = new THREE.Mesh(new THREE.CylinderGeometry(0.023, 0.023, 0.006, 16), crownAccentMat);
  crownRing.rotation.z = Math.PI / 2;
  crownRing.position.set(0.136, 0.045, 0.002);
  const sideBtn = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.055, 0.018), titaniumMat);
  sideBtn.position.set(0.124, -0.045, 0.002);
  group.add(crown, crownRing, sideBtn);

  // Curved Fluoroelastomer Sport Straps (wrapping cleanly behind the watch)
  [-1, 1].forEach((dir) => {
    const strapCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, dir * 0.135, 0.004),
      new THREE.Vector3(0, dir * 0.21, -0.015),
      new THREE.Vector3(0, dir * 0.255, -0.075),
      new THREE.Vector3(0, dir * 0.245, -0.155),
    ]);
    const tubeGeo = new THREE.TubeGeometry(strapCurve, 16, 0.016, 8, false);
    tubeGeo.scale(4.6, 1.0, 0.85);
    group.add(new THREE.Mesh(tubeGeo, strapMat));
  });

  // Stainless steel tuck pin on lower strap
  const pinClasp = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.014, 12), titaniumMat);
  pinClasp.rotation.x = Math.PI / 2;
  pinClasp.position.set(0, -0.242, -0.145);
  group.add(pinClasp);

  return group;
}

// ---------------------------------------------------------------------------------
// 13. 3D Ceramic Potted Succulent Plant (Lathe Fluted Planter & Fibonacci Rosette)
// ---------------------------------------------------------------------------------
export function createSolid3DPlant(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Plant';

  const potMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    roughness: 0.24,
    metalness: 0.04,
    clearcoat: 0.6,
  });
  const rimBandMat = new THREE.MeshStandardMaterial({
    color: 0xd6d3d1,
    roughness: 0.55,
  });
  const soilMat = new THREE.MeshStandardMaterial({
    color: 0x291d14,
    roughness: 0.95,
  });

  // Tapered Modern Ceramic Planter Vessel (LatheGeometry)
  const potPts = [
    new THREE.Vector2(0.0, -0.14),
    new THREE.Vector2(0.115, -0.14),
    new THREE.Vector2(0.125, -0.125),
    new THREE.Vector2(0.185, 0.09),
    new THREE.Vector2(0.196, 0.105),
    new THREE.Vector2(0.196, 0.125),
    new THREE.Vector2(0.172, 0.125),
    new THREE.Vector2(0.168, 0.085),
    new THREE.Vector2(0.0, 0.085),
  ];
  group.add(new THREE.Mesh(new THREE.LatheGeometry(potPts, 28), potMat));

  // Uncoated terracotta/stone base ring & potting soil disc
  const footRing = new THREE.Mesh(new THREE.CylinderGeometry(0.122, 0.116, 0.022, 24), rimBandMat);
  footRing.position.y = -0.132;
  const soil = new THREE.Mesh(new THREE.CircleGeometry(0.17, 24), soilMat);
  soil.rotation.x = -Math.PI / 2;
  soil.position.y = 0.09;
  group.add(footRing, soil);

  // Sculpted Fleshy Echeveria Succulent Leaf Profile (teardrop ExtrudeGeometry)
  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0);
  leafShape.bezierCurveTo(0.042, 0.025, 0.048, 0.085, 0, 0.125);
  leafShape.bezierCurveTo(-0.048, 0.085, -0.042, 0.025, 0, 0);
  const leafGeo = new THREE.ExtrudeGeometry(leafShape, {
    depth: 0.016,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.006,
    bevelSegments: 3,
    curveSegments: 14,
  });
  leafGeo.translate(0, 0, -0.008);

  const leafColors = [0x059669, 0x10b981, 0x34d399, 0x6ee7b7];
  const leafMats = leafColors.map(
    (c) =>
      new THREE.MeshPhysicalMaterial({
        color: c,
        roughness: 0.42,
        clearcoat: 0.25,
        clearcoatRoughness: 0.4,
      })
  );

  // 24-Petal Golden-Angle Fibonacci Spiral Rosette
  const goldenAngle = 2.3999632;
  const totalLeaves = 24;
  for (let i = 0; i < totalLeaves; i++) {
    const t = i / (totalLeaves - 1); // 0 = center bud, 1 = outer rosette
    const angle = i * goldenAngle;
    const radius = 0.012 + t * 0.075;
    const scale = 0.42 + t * 0.65;
    const tiltOut = 0.22 + t * 0.98;
    const matIdx = Math.min(leafMats.length - 1, Math.floor((1 - t) * leafMats.length));

    const petalPivot = new THREE.Group();
    petalPivot.position.set(Math.cos(angle) * radius, 0.095 + (1 - t) * 0.035, Math.sin(angle) * radius);
    petalPivot.rotation.y = -angle + Math.PI / 2;

    const leaf = new THREE.Mesh(leafGeo, leafMats[matIdx]);
    leaf.scale.set(scale, scale, scale);
    leaf.rotation.x = tiltOut;
    petalPivot.add(leaf);
    group.add(petalPivot);
  }

  return group;
}

// ---------------------------------------------------------------------------------
// 14. 3D AirPods Pro Case (Pebbled Rounded Charging Case, Hinge & LED)
// ---------------------------------------------------------------------------------
export function createSolid3DAirPods(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'AirPods';

  const metalTex = getCachedBrushedMetal();

  const ceramicWhiteMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    roughness: 0.08,
    metalness: 0.03,
    clearcoat: 0.95,
    clearcoatRoughness: 0.05,
  });
  const seamMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.38,
    metalness: 0.45,
  });
  const aluminumMat = new THREE.MeshStandardMaterial({
    map: metalTex,
    color: 0x94a3b8,
    metalness: 0.92,
    roughness: 0.18,
  });
  const ledMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x10b981,
    emissiveIntensity: 1.5,
  });

  // Organic Smooth Pebbled Case Body (heavy multi-segment bevels)
  const caseShape = makeRoundedRectShape(0.24, 0.20, 0.068);
  const bodyGeo = new THREE.ExtrudeGeometry(caseShape, {
    depth: 0.065,
    bevelEnabled: true,
    bevelThickness: 0.032,
    bevelSize: 0.022,
    bevelSegments: 6,
    curveSegments: 24,
  });
  bodyGeo.translate(0, 0, -0.0325);
  group.add(new THREE.Mesh(bodyGeo, ceramicWhiteMat));

  // Crisp Horizontal Lid Seam Line wrapping just proud of body
  const seamShape = makeRoundedRectShape(0.285, 0.006, 0.002);
  const seamGeo = new THREE.ExtrudeGeometry(seamShape, {
    depth: 0.130,
    bevelEnabled: false,
  });
  seamGeo.translate(0, 0.042, -0.065);
  group.add(new THREE.Mesh(seamGeo, seamMat));

  // Brushed Aluminum Rear Hinge Plate + Pairing Button
  const hinge = new THREE.Mesh(
    new THREE.ExtrudeGeometry(makeRoundedRectShape(0.145, 0.032, 0.012), {
      depth: 0.01,
      bevelEnabled: true,
      bevelThickness: 0.002,
      bevelSize: 0.002,
      bevelSegments: 2,
    }),
    aluminumMat
  );
  hinge.position.set(0, 0.042, -0.066);
  const pairBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.006, 16), seamMat);
  pairBtn.rotation.x = Math.PI / 2;
  pairBtn.position.set(0, -0.02, -0.065);
  group.add(hinge, pairBtn);

  // Front Emerald Charging Status LED & Bottom Metallic USB-C Port
  const led = new THREE.Mesh(new THREE.CircleGeometry(0.009, 14), ledMat);
  led.position.set(0, 0.01, 0.0665);
  const portRing = new THREE.Mesh(
    new THREE.ExtrudeGeometry(makeRoundedRectShape(0.048, 0.018, 0.008), {
      depth: 0.006,
      bevelEnabled: false,
    }),
    aluminumMat
  );
  portRing.rotation.x = Math.PI / 2;
  portRing.position.set(0, -0.131, -0.003);
  const portCore = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.005, 0.008), new THREE.MeshStandardMaterial({ color: 0x09090b }));
  portCore.position.set(0, -0.133, 0);
  group.add(led, portRing, portCore);

  return group;
}

// ---------------------------------------------------------------------------------
// 15. 3D Thermal Insulated Flask (Seamless Lathe Powder-Coat Body & Articulated Loop)
// ---------------------------------------------------------------------------------
export function createSolid3DFlask(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Flask';

  const metalTex = getCachedBrushedMetal();

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x1f2937,
    roughness: 0.44,
    metalness: 0.35,
    clearcoat: 0.25,
    clearcoatRoughness: 0.45,
  });
  const steelMat = new THREE.MeshStandardMaterial({
    map: metalTex,
    color: 0xd1d5db,
    metalness: 0.92,
    roughness: 0.16,
  });
  const capMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.62,
    metalness: 0.1,
  });

  // Seamless Hydro-Flask Lathe Bottle Profile
  const flaskPts = [
    new THREE.Vector2(0.0, -0.265),
    new THREE.Vector2(0.095, -0.265),
    new THREE.Vector2(0.112, -0.245),
    new THREE.Vector2(0.114, 0.12),
    new THREE.Vector2(0.098, 0.185),
    new THREE.Vector2(0.078, 0.215),
    new THREE.Vector2(0.078, 0.245),
    new THREE.Vector2(0.0, 0.245),
  ];
  group.add(new THREE.Mesh(new THREE.LatheGeometry(flaskPts, 32), bodyMat));

  // Brushed Stainless Steel Base Boot Rim & Neck Collar
  const baseRing = new THREE.Mesh(new THREE.CylinderGeometry(0.1125, 0.106, 0.022, 28), steelMat);
  baseRing.position.y = -0.248;
  const neckCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.080, 0.080, 0.026, 28), steelMat);
  neckCollar.position.y = 0.228;
  group.add(baseRing, neckCollar);

  // Knurled Wide-Mouth Insulated Cap + Hinge Ears + Carry Bail Loop
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.088, 0.068, 24), capMat);
  cap.position.y = 0.275;
  const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.088, 0.012, 24), capMat);
  capTop.position.y = 0.314;
  group.add(cap, capTop);

  [-0.086, 0.086].forEach((ex) => {
    const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.018, 12), steelMat);
    ear.rotation.z = Math.PI / 2;
    ear.position.set(ex, 0.295, 0);
    group.add(ear);
  });

  const loopCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.088, 0.295, 0),
    new THREE.Vector3(-0.092, 0.365, 0),
    new THREE.Vector3(-0.045, 0.405, 0),
    new THREE.Vector3(0, 0.412, 0),
    new THREE.Vector3(0.045, 0.405, 0),
    new THREE.Vector3(0.092, 0.365, 0),
    new THREE.Vector3(0.088, 0.295, 0),
  ]);
  group.add(new THREE.Mesh(new THREE.TubeGeometry(loopCurve, 24, 0.012, 10, false), capMat));

  return group;
}

// ---------------------------------------------------------------------------------
// 16. 3D Quadcopter Camera Drone (Sculpted Aero Chassis, Prop Airfoils & 3-Axis Gimbal)
// ---------------------------------------------------------------------------------
export function createSolid3DDrone(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Drone';

  const carbonTex = getCachedCarbonWeave();
  const metalTex = getCachedBrushedMetal();

  const shellMat = new THREE.MeshPhysicalMaterial({
    map: carbonTex,
    color: 0x263142,
    roughness: 0.36,
    metalness: 0.45,
    clearcoat: 0.35,
    clearcoatRoughness: 0.2,
  });
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.55,
    metalness: 0.35,
  });
  const aluminumMat = new THREE.MeshStandardMaterial({
    map: metalTex,
    color: 0xcbd5e1,
    metalness: 0.9,
    roughness: 0.18,
  });
  const copperMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.88,
    roughness: 0.24,
  });
  const bladeMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.28,
    metalness: 0.2,
  });
  const tipMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.3,
  });
  const frontLedMat = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    emissive: 0x22c55e,
    emissiveIntensity: 1.4,
  });
  const rearLedMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xef4444,
    emissiveIntensity: 1.2,
  });
  const lensGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0284c7,
    metalness: 0.3,
    roughness: 0.05,
    clearcoat: 1.0,
    iridescence: 0.8,
  });

  // Sculpted aerodynamic fuselage silhouette
  const hullShape = new THREE.Shape();
  hullShape.moveTo(0, 0.24);
  hullShape.bezierCurveTo(0.11, 0.24, 0.16, 0.13, 0.145, 0.0);
  hullShape.bezierCurveTo(0.135, -0.14, 0.10, -0.23, 0, -0.24);
  hullShape.bezierCurveTo(-0.10, -0.23, -0.135, -0.14, -0.145, 0.0);
  hullShape.bezierCurveTo(-0.16, 0.13, -0.11, 0.24, 0, 0.24);

  const hullGeo = new THREE.ExtrudeGeometry(hullShape, {
    depth: 0.068,
    bevelEnabled: true,
    bevelThickness: 0.018,
    bevelSize: 0.016,
    bevelSegments: 4,
    curveSegments: 24,
  });
  hullGeo.rotateX(Math.PI / 2);
  hullGeo.translate(0, 0.034, 0);
  normalizeExtrudeUVs(hullGeo);
  group.add(new THREE.Mesh(hullGeo, shellMat));

  // Top battery pack saddle & 4-bar LED charge meter
  const battery = new THREE.Mesh(
    new THREE.ExtrudeGeometry(makeRoundedRectShape(0.14, 0.22, 0.03), {
      depth: 0.022,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.006,
      bevelSegments: 2,
    }),
    chassisMat
  );
  battery.rotation.x = Math.PI / 2;
  battery.position.set(0, 0.064, -0.02);
  group.add(battery);

  for (let b = 0; b < 4; b++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.004, 0.008), frontLedMat);
    bar.position.set(-0.027 + b * 0.018, 0.072, -0.02);
    group.add(bar);
  }

  // Front recessed cooling grille / obstacle avoidance dual sensors
  const sensorBar = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.026, 0.02), chassisMat);
  sensorBar.position.set(0, 0.008, 0.232);
  group.add(sensorBar);
  [-0.042, 0.042].forEach((sx) => {
    const eye = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.012, 12), lensGlassMat);
    eye.rotation.x = Math.PI / 2;
    eye.position.set(sx, 0.008, 0.242);
    group.add(eye);
  });

  // 4 Swept Carbon Arms + Motor Bells + Airfoil Twin-Blade Props + Landing Skids
  const armAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
  const armRadius = 0.39;

  // Prop blade airfoil shape
  const propShape = new THREE.Shape();
  propShape.moveTo(0, 0.012);
  propShape.bezierCurveTo(0.06, 0.02, 0.125, 0.014, 0.135, 0.0);
  propShape.bezierCurveTo(0.125, -0.012, 0.05, -0.008, 0, -0.012);
  propShape.bezierCurveTo(-0.05, -0.008, -0.125, -0.012, -0.135, 0.0);
  propShape.bezierCurveTo(-0.125, 0.014, -0.06, 0.02, 0, 0.012);
  const propGeo = new THREE.ExtrudeGeometry(propShape, {
    depth: 0.004,
    bevelEnabled: false,
    curveSegments: 16,
  });
  propGeo.rotateX(Math.PI / 2);

  armAngles.forEach((angle, idx) => {
    const dirX = Math.cos(angle);
    const dirZ = Math.sin(angle);
    const mx = dirX * armRadius;
    const mz = dirZ * armRadius;

    // Tapered arm boom
    const armCurve = new THREE.LineCurve3(
      new THREE.Vector3(dirX * 0.12, 0.005, dirZ * 0.12),
      new THREE.Vector3(mx, 0.025, mz)
    );
    const armGeo = new THREE.TubeGeometry(armCurve, 4, 0.016, 10, false);
    const armMesh = new THREE.Mesh(armGeo, shellMat);
    group.add(armMesh);

    // Shoulder collar
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.028, 12), chassisMat);
    collar.position.set(dirX * 0.135, 0.005, dirZ * 0.135);
    collar.rotation.z = Math.PI / 2;
    collar.rotation.y = -angle;
    group.add(collar);

    // Motor pod housing + copper stator core + aluminum motor bell
    const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.032, 0.034, 16), chassisMat);
    pod.position.set(mx, 0.024, mz);
    const stator = new THREE.Mesh(new THREE.CylinderGeometry(0.030, 0.030, 0.012, 16), copperMat);
    stator.position.set(mx, 0.042, mz);
    const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.036, 0.02, 18), aluminumMat);
    bell.position.set(mx, 0.054, mz);
    const spinner = new THREE.Mesh(new THREE.ConeGeometry(0.013, 0.018, 14), aluminumMat);
    spinner.position.set(mx, 0.073, mz);
    group.add(pod, stator, bell, spinner);

    // Sculpted airfoil propeller with orange safety tips
    const prop = new THREE.Mesh(propGeo, bladeMat);
    prop.position.set(mx, 0.068, mz);
    prop.rotation.y = angle + (idx % 2 === 0 ? 0.55 : -0.4);
    prop.rotation.z = idx % 2 === 0 ? 0.06 : -0.06;
    group.add(prop);

    [-0.122, 0.122].forEach((tx) => {
      const tip = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.005, 0.016), tipMat);
      tip.position.set(tx, -0.001, 0);
      prop.add(tip);
    });

    // Under-motor landing leg & navigation LED (front green / rear red)
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.007, 0.075, 10), chassisMat);
    leg.position.set(mx, -0.028, mz);
    const isFront = mz > 0;
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.013, 10, 10), isFront ? frontLedMat : rearLedMat);
    led.position.set(mx, -0.065, mz);
    group.add(leg, led);
  });

  // 3-Axis U-Gimbal & 4K Wide-Angle Camera under forward nose
  const damperPlate = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.012, 0.08), chassisMat);
  damperPlate.position.set(0, -0.036, 0.12);
  const gimbalArm = new THREE.Mesh(new THREE.TorusGeometry(0.044, 0.008, 8, 16, Math.PI), aluminumMat);
  gimbalArm.rotation.z = Math.PI;
  gimbalArm.rotation.y = Math.PI / 2;
  gimbalArm.position.set(0, -0.065, 0.12);

  const camCube = new THREE.Mesh(
    new THREE.ExtrudeGeometry(makeRoundedRectShape(0.074, 0.056, 0.012), {
      depth: 0.06,
      bevelEnabled: true,
      bevelThickness: 0.004,
      bevelSize: 0.004,
      bevelSegments: 2,
    }),
    chassisMat
  );
  camCube.position.set(0, -0.074, 0.095);
  const camRing = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.016, 18), copperMat);
  camRing.rotation.x = Math.PI / 2;
  camRing.position.set(0, -0.074, 0.16);
  const camGlass = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), lensGlassMat);
  camGlass.rotation.x = Math.PI / 2;
  camGlass.position.set(0, -0.074, 0.164);
  group.add(damperPlate, gimbalArm, camCube, camRing, camGlass);

  return group;
}

// ---------------------------------------------------------------------------------
// 17. 3D Cordless Brushless Power Drill (Over-Molded Ergonomic Body & Helical Bit)
// ---------------------------------------------------------------------------------
export function createSolid3DDrill(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'PowerDrill';

  const metalTex = getCachedBrushedMetal();
  const leatherTex = getCachedPebbledLeather();

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0xea580c,
    roughness: 0.32,
    metalness: 0.1,
    clearcoat: 0.35,
  });
  const rubberMat = new THREE.MeshStandardMaterial({
    map: leatherTex,
    color: 0x18181b,
    roughness: 0.88,
    metalness: 0.05,
  });
  const steelMat = new THREE.MeshStandardMaterial({
    map: metalTex,
    color: 0xd1d5db,
    metalness: 0.92,
    roughness: 0.16,
  });
  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.85,
    roughness: 0.3,
  });
  const triggerMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.35,
  });
  const workLightMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xfde047,
    emissiveIntensity: 1.2,
  });

  // Sculpted Lathe Motor Housing (rear cooling cap -> contoured brushless barrel -> nose gearcase)
  const housingPts = [
    new THREE.Vector2(0.0, -0.18),
    new THREE.Vector2(0.068, -0.175),
    new THREE.Vector2(0.088, -0.14),
    new THREE.Vector2(0.094, -0.04),
    new THREE.Vector2(0.086, 0.08),
    new THREE.Vector2(0.078, 0.14),
    new THREE.Vector2(0.0, 0.14),
  ];
  const housingGeo = new THREE.LatheGeometry(housingPts, 28);
  housingGeo.rotateZ(-Math.PI / 2);
  group.add(new THREE.Mesh(housingGeo, bodyMat));

  // Rubber over-mold side ribs & rear cooling louvers
  for (let v = 0; v < 4; v++) {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(0.091, 0.007, 8, 24), rubberMat);
    rib.rotation.y = Math.PI / 2;
    rib.position.x = -0.13 + v * 0.025;
    group.add(rib);
  }
  const rearRubberCap = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.082, 0.03, 20), rubberMat);
  rearRubberCap.rotation.z = Math.PI / 2;
  rearRubberCap.position.x = -0.165;
  group.add(rearRubberCap);

  // Top 2-speed gearbox selector slider
  const speedSlider = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.018, 0.042), triggerMat);
  speedSlider.position.set(0.01, 0.095, 0);
  group.add(speedSlider);

  // Stepped Torque Clutch Collar + Knurled Grip Ring + 3-Jaw Keyless Steel Chuck
  const clutchRing = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.078, 0.055, 16), rubberMat);
  clutchRing.rotation.z = Math.PI / 2;
  clutchRing.position.x = 0.165;
  const collarBand = new THREE.Mesh(new THREE.CylinderGeometry(0.073, 0.073, 0.012, 24), steelMat);
  collarBand.rotation.z = Math.PI / 2;
  collarBand.position.x = 0.195;
  const chuckSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.07, 0.085, 20), darkMetalMat);
  chuckSleeve.rotation.z = Math.PI / 2;
  chuckSleeve.position.x = 0.242;
  const chuckNose = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.055, 0.028, 18), steelMat);
  chuckNose.rotation.z = Math.PI / 2;
  chuckNose.position.x = 0.296;
  group.add(clutchRing, collarBand, chuckSleeve, chuckNose);

  // 3 Inner Steel Chuck Jaws
  for (let j = 0; j < 3; j++) {
    const a = (j / 3) * Math.PI * 2;
    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.012, 0.012), steelMat);
    jaw.position.set(0.305, Math.cos(a) * 0.016, Math.sin(a) * 0.016);
    group.add(jaw);
  }

  // Twist Drill Bit (shaft + helical flute TubeGeometry + tapered point)
  const bitShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.17, 12), steelMat);
  bitShaft.rotation.z = Math.PI / 2;
  bitShaft.position.x = 0.39;
  const bitTip = new THREE.Mesh(new THREE.ConeGeometry(0.011, 0.024, 12), steelMat);
  bitTip.rotation.z = -Math.PI / 2;
  bitTip.position.x = 0.486;

  const flutePts: THREE.Vector3[] = [];
  for (let i = 0; i <= 28; i++) {
    const t = i / 28;
    const angle = t * Math.PI * 7;
    flutePts.push(new THREE.Vector3(0.32 + t * 0.145, Math.cos(angle) * 0.0115, Math.sin(angle) * 0.0115));
  }
  const fluteGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(flutePts), 36, 0.004, 6, false);
  group.add(bitShaft, bitTip, new THREE.Mesh(fluteGeo, darkMetalMat));

  // Ergonomic Angled Pistol-Grip Handle (ExtrudeGeometry curved silhouette)
  const handleShape = new THREE.Shape();
  handleShape.moveTo(-0.048, 0.0);
  handleShape.lineTo(0.048, 0.0);
  handleShape.bezierCurveTo(0.045, -0.09, 0.032, -0.17, 0.038, -0.27);
  handleShape.lineTo(-0.056, -0.27);
  handleShape.bezierCurveTo(-0.068, -0.17, -0.058, -0.08, -0.048, 0.0);

  const handleGeo = new THREE.ExtrudeGeometry(handleShape, {
    depth: 0.068,
    bevelEnabled: true,
    bevelThickness: 0.018,
    bevelSize: 0.016,
    bevelSegments: 4,
    curveSegments: 16,
  });
  handleGeo.translate(0, 0, -0.034);
  const handleMesh = new THREE.Mesh(handleGeo, rubberMat);
  handleMesh.position.set(-0.01, -0.06, 0);
  handleMesh.rotation.z = -0.16;
  group.add(handleMesh);

  // Orange spine accent along back of handle
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.23, 0.054), bodyMat);
  spine.position.set(-0.055, -0.19, 0);
  spine.rotation.z = -0.16;
  group.add(spine);

  // Sculpted Variable-Speed Trigger & Reverse Selector
  const trigger = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.064, 0.034), triggerMat);
  trigger.position.set(0.052, -0.11, 0);
  trigger.rotation.z = 0.15;
  const revSwitch = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.016, 0.088), triggerMat);
  revSwitch.position.set(0.035, -0.075, 0);
  group.add(trigger, revSwitch);

  // Slide-On 20V Li-Ion Battery Pack + Latch Tabs + Work LED
  const batteryShape = makeRoundedRectShape(0.22, 0.135, 0.025);
  const batteryGeo = new THREE.ExtrudeGeometry(batteryShape, {
    depth: 0.085,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 3,
  });
  batteryGeo.rotateX(Math.PI / 2);
  const battery = new THREE.Mesh(batteryGeo, rubberMat);
  battery.position.set(-0.055, -0.325, 0);

  const batteryPlate = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.02, 0.125), bodyMat);
  batteryPlate.position.set(-0.055, -0.38, 0);

  const workLed = new THREE.Mesh(new THREE.CircleGeometry(0.014, 12), workLightMat);
  workLed.rotation.x = -Math.PI / 4;
  workLed.rotation.y = Math.PI / 2;
  workLed.position.set(0.046, -0.32, 0);
  group.add(battery, batteryPlate, workLed);

  return group;
}

// ---------------------------------------------------------------------------------
// 18. 3D Studio Condenser Microphone (Woven Gold Capsule & Spider Shockmount)
// ---------------------------------------------------------------------------------
export function createSolid3DMicrophone(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Microphone';

  const goldMeshTex = getCachedGoldMesh();
  const metalTex = getCachedBrushedMetal();

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x111827,
    roughness: 0.28,
    metalness: 0.78,
    clearcoat: 0.3,
  });
  const goldMeshMat = new THREE.MeshStandardMaterial({
    map: goldMeshTex,
    bumpMap: goldMeshTex,
    bumpScale: 0.012,
    color: 0xeab308,
    metalness: 0.88,
    roughness: 0.24,
  });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.92,
    roughness: 0.18,
  });
  const chromeMat = new THREE.MeshStandardMaterial({
    map: metalTex,
    color: 0xe2e8f0,
    metalness: 0.94,
    roughness: 0.14,
  });
  const elasticMat = new THREE.MeshStandardMaterial({
    color: 0x09090b,
    roughness: 0.82,
  });

  // Tapered Lathe Body Chassis (from bottom XLR housing up to collar)
  const bodyPts = [
    new THREE.Vector2(0.0, -0.16),
    new THREE.Vector2(0.052, -0.155),
    new THREE.Vector2(0.068, -0.10),
    new THREE.Vector2(0.076, 0.02),
    new THREE.Vector2(0.078, 0.13),
    new THREE.Vector2(0.0, 0.13),
  ];
  const bodyGeo = new THREE.LatheGeometry(bodyPts, 28);
  group.add(new THREE.Mesh(bodyGeo, bodyMat));

  // Bottom 3-pin Brass XLR Connector & Recessed Ring
  const xlrCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.044, 0.018, 20), chromeMat);
  xlrCollar.position.y = -0.162;
  group.add(xlrCollar);
  for (let p = 0; p < 3; p++) {
    const a = (p / 3) * Math.PI * 2;
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.024, 8), brassMat);
    pin.position.set(Math.cos(a) * 0.018, -0.166, Math.sin(a) * 0.018);
    group.add(pin);
  }

  // Front Bass Roll-Off / Pad Switch & Gold Emblem Badge
  const badge = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.016, 0.01), brassMat);
  badge.position.set(0, 0.06, 0.076);
  const switchBezel = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.028, 0.008), chromeMat);
  switchBezel.position.set(0, -0.01, 0.075);
  group.add(badge, switchBezel);

  // Satin Gold Separator Ring beneath Capsule
  const neckRing = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.022, 28), brassMat);
  neckRing.position.y = 0.138;
  group.add(neckRing);

  // Dual-Layer Woven Gold Mesh Headbasket + Dome + Protective Chrome Grille Rails
  const capsuleCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.076, 0.078, 0.20, 28, 1, false), goldMeshMat);
  capsuleCyl.position.y = 0.248;
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.076, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2),
    goldMeshMat
  );
  dome.position.y = 0.348;
  group.add(capsuleCyl, dome);

  // Protective Side Frame Arch wrapping the Gold Capsule
  const archCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.08, 0.145, 0),
    new THREE.Vector3(-0.08, 0.345, 0),
    new THREE.Vector3(-0.048, 0.415, 0),
    new THREE.Vector3(0, 0.43, 0),
    new THREE.Vector3(0.048, 0.415, 0),
    new THREE.Vector3(0.08, 0.345, 0),
    new THREE.Vector3(0.08, 0.145, 0),
  ]);
  const archMesh = new THREE.Mesh(new THREE.TubeGeometry(archCurve, 32, 0.007, 10, false), chromeMat);
  group.add(archMesh);

  // Suspended Spider Shockmount Cradle
  const outerRingUpper = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.011, 10, 32), chromeMat);
  outerRingUpper.rotation.x = Math.PI / 2;
  outerRingUpper.position.y = 0.08;
  const outerRingLower = new THREE.Mesh(new THREE.TorusGeometry(0.128, 0.01, 10, 32), chromeMat);
  outerRingLower.rotation.x = Math.PI / 2;
  outerRingLower.position.y = -0.05;
  group.add(outerRingUpper, outerRingLower);

  // 4 Vertical Struts + Elastic Suspension Cords
  for (let s = 0; s < 4; s++) {
    const a = (s / 4) * Math.PI * 2 + Math.PI / 4;
    const ox = Math.cos(a) * 0.132;
    const oz = Math.sin(a) * 0.132;
    const ix = Math.cos(a) * 0.078;
    const iz = Math.sin(a) * 0.078;

    const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.135, 8), bodyMat);
    strut.position.set(ox, 0.015, oz);
    group.add(strut);

    const bandCurve = new THREE.LineCurve3(
      new THREE.Vector3(ox, 0.075, oz),
      new THREE.Vector3(ix, 0.015, iz)
    );
    const bandCurve2 = new THREE.LineCurve3(
      new THREE.Vector3(ix, 0.015, iz),
      new THREE.Vector3(ox, -0.045, oz)
    );
    group.add(
      new THREE.Mesh(new THREE.TubeGeometry(bandCurve, 2, 0.004, 6, false), elasticMat),
      new THREE.Mesh(new THREE.TubeGeometry(bandCurve2, 2, 0.004, 6, false), elasticMat)
    );
  }

  // Stand swivel mount & thumb-screw on back of shockmount
  const swivelArm = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.045, 0.055), bodyMat);
  swivelArm.position.set(0, -0.05, -0.155);
  const thumbKnob = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.025, 14), chromeMat);
  thumbKnob.rotation.z = Math.PI / 2;
  thumbKnob.position.set(0.024, -0.05, -0.175);
  group.add(swivelArm, thumbKnob);

  return group;
}

// ---------------------------------------------------------------------------------
// 19. 3D Camping Enamel Mug (Hollow Lathe Vessel, Rolled Cobalt Rim & Espresso)
// ---------------------------------------------------------------------------------
export function createSolid3DCoffeeMug(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'CampingMug';

  const speckleTex = getCachedEnamelSpeckle();

  const metalTex = getCachedBrushedMetal();

  const enamelMat = new THREE.MeshPhysicalMaterial({
    map: speckleTex,
    color: 0xffffff,
    roughness: 0.18,
    metalness: 0.08,
    clearcoat: 0.85,
    clearcoatRoughness: 0.1,
  });
  const innerWhiteMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    roughness: 0.14,
    clearcoat: 0.85,
  });
  const rimMat = new THREE.MeshStandardMaterial({
    map: metalTex,
    color: 0xe2e8f0,
    roughness: 0.18,
    metalness: 0.92,
  });
  const coffeeMat = new THREE.MeshPhysicalMaterial({
    color: 0x261207,
    roughness: 0.08,
    metalness: 0.02,
    clearcoat: 1.0,
  });
  const cremaMat = new THREE.MeshStandardMaterial({
    color: 0xc2854b,
    roughness: 0.65,
  });

  // Hollow Lathe Outer Cobalt Enamel Vessel
  const mugPts = [
    new THREE.Vector2(0.0, -0.12),
    new THREE.Vector2(0.088, -0.12),
    new THREE.Vector2(0.102, -0.108),
    new THREE.Vector2(0.104, 0.098),
    new THREE.Vector2(0.114, 0.114),
    new THREE.Vector2(0.114, 0.124),
    new THREE.Vector2(0.101, 0.124),
    new THREE.Vector2(0.094, 0.102),
  ];
  const cupGeo = new THREE.LatheGeometry(mugPts, 32);
  group.add(new THREE.Mesh(cupGeo, enamelMat));

  // Crisp Porcelain White Inner Enamel Wall
  const innerPts = [
    new THREE.Vector2(0.099, 0.114),
    new THREE.Vector2(0.092, 0.098),
    new THREE.Vector2(0.090, -0.098),
    new THREE.Vector2(0.0, -0.098),
  ];
  group.add(new THREE.Mesh(new THREE.LatheGeometry(innerPts, 32), innerWhiteMat));

  // Rolled Brushed-Steel Enamel Lip Collar
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.109, 0.011, 12, 32), rimMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.119;
  group.add(rim);

  // Dark Freshly Brewed Coffee Surface + Subtle Crema Ring inside cup
  const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.093, 28), coffeeMat);
  coffee.rotation.x = -Math.PI / 2;
  coffee.position.y = 0.078;
  const crema = new THREE.Mesh(new THREE.RingGeometry(0.072, 0.092, 28), cremaMat);
  crema.rotation.x = -Math.PI / 2;
  crema.position.y = 0.0805;
  group.add(coffee, crema);

  // Smooth Curved D-Handle via TubeGeometry
  const handleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.10, 0.078, 0),
    new THREE.Vector3(0.165, 0.078, 0),
    new THREE.Vector3(0.192, 0.0, 0),
    new THREE.Vector3(0.165, -0.078, 0),
    new THREE.Vector3(0.096, -0.078, 0),
  ]);
  const handleGeo = new THREE.TubeGeometry(handleCurve, 24, 0.014, 12, false);
  group.add(new THREE.Mesh(handleGeo, enamelMat));

  return group;
}

// ---------------------------------------------------------------------------------
// 20. 3D Outdoor Compact Binoculars (Armor Barrels, Bridge Hinge & AR Convex Optics)
// ---------------------------------------------------------------------------------
export function createSolid3DBinoculars(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Binoculars';

  const leatherTex = getCachedPebbledLeather();
  const metalTex = getCachedBrushedMetal();

  const armorMat = new THREE.MeshStandardMaterial({
    map: leatherTex,
    color: 0x27272a,
    roughness: 0.82,
    metalness: 0.08,
  });
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x3f3f46,
    roughness: 0.45,
    metalness: 0.5,
  });
  const titaniumMat = new THREE.MeshStandardMaterial({
    map: metalTex,
    color: 0x94a3b8,
    metalness: 0.9,
    roughness: 0.2,
  });
  const tealAccentMat = new THREE.MeshStandardMaterial({
    color: 0x0d9488,
    metalness: 0.65,
    roughness: 0.25,
  });
  const arLensMat = new THREE.MeshPhysicalMaterial({
    color: 0x0ea5e9,
    metalness: 0.32,
    roughness: 0.04,
    clearcoat: 1.0,
    iridescence: 0.9,
    iridescenceIOR: 1.45,
  });
  const darkBaffleMat = new THREE.MeshStandardMaterial({
    color: 0x05070a,
    roughness: 0.9,
  });

  // Tapered Lathe Barrel Profile
  const barrelPts = [
    new THREE.Vector2(0.046, -0.175),
    new THREE.Vector2(0.056, -0.155),
    new THREE.Vector2(0.062, -0.08),
    new THREE.Vector2(0.074, 0.02),
    new THREE.Vector2(0.082, 0.145),
    new THREE.Vector2(0.078, 0.175),
    new THREE.Vector2(0.068, 0.175),
    new THREE.Vector2(0.068, 0.155),
    new THREE.Vector2(0.0, 0.155),
  ];
  const barrelGeo = new THREE.LatheGeometry(barrelPts, 24);
  barrelGeo.rotateX(Math.PI / 2);

  [-0.095, 0.095].forEach((x, idx) => {
    const barrelGroup = new THREE.Group();
    barrelGroup.position.x = x;

    barrelGroup.add(new THREE.Mesh(barrelGeo, armorMat));

    // Metallic objective accent ring near front hood
    const accentRing = new THREE.Mesh(new THREE.CylinderGeometry(0.081, 0.081, 0.014, 24), tealAccentMat);
    accentRing.rotation.x = Math.PI / 2;
    accentRing.position.z = 0.152;
    barrelGroup.add(accentRing);

    // Dark recessed optical chamber & curved convex AR sapphire objective glass
    const baffle = new THREE.Mesh(new THREE.CircleGeometry(0.068, 24), darkBaffleMat);
    baffle.position.z = 0.157;
    const objLens = new THREE.Mesh(
      new THREE.SphereGeometry(0.068, 24, 14, 0, Math.PI * 2, 0, Math.PI * 0.36),
      arLensMat
    );
    objLens.rotation.x = Math.PI / 2;
    objLens.position.z = 0.132;
    barrelGroup.add(baffle, objLens);

    // Twist-up rubber eyecup + brass diopter ring on right eyepiece
    const eyecup = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.048, 0.045, 20, 1, true), chassisMat);
    eyecup.rotation.x = Math.PI / 2;
    eyecup.position.z = -0.188;
    const eyeGlass = new THREE.Mesh(new THREE.CircleGeometry(0.036, 18), arLensMat);
    eyeGlass.rotation.y = Math.PI;
    eyeGlass.position.z = -0.174;
    barrelGroup.add(eyecup, eyeGlass);

    if (idx === 1) {
      const diopter = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.015, 20), titaniumMat);
      diopter.rotation.x = Math.PI / 2;
      diopter.position.z = -0.155;
      barrelGroup.add(diopter);
    }

    group.add(barrelGroup);
  });

  // Twin Articulated Center Hinge Bridges & Knurled Focus Wheel
  [-0.07, 0.06].forEach((bz) => {
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.036, 0.046), chassisMat);
    bridge.position.set(0, 0.005, bz);
    group.add(bridge);
  });

  const hingeShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.19, 16), titaniumMat);
  hingeShaft.rotation.x = Math.PI / 2;
  hingeShaft.position.set(0, 0.01, -0.01);
  const focusWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.052, 16), chassisMat);
  focusWheel.rotation.x = Math.PI / 2;
  focusWheel.position.set(0, 0.026, -0.005);
  const focusCap = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.058, 16), tealAccentMat);
  focusCap.rotation.x = Math.PI / 2;
  focusCap.position.set(0, 0.026, -0.005);
  group.add(hingeShaft, focusWheel, focusCap);

  return group;
}

// ---------------------------------------------------------------------------------
// 21. 3D Virtual Reality Headset (Contoured Visor, Tracking Cameras & Elite Strap)
// ---------------------------------------------------------------------------------
export function createSolid3DHeadsetVR(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'VRHeadset';

  const pearlMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.26,
    metalness: 0.72,
  });
  const visorGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x070b14,
    roughness: 0.05,
    metalness: 0.3,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
  });
  const cushionMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.9,
  });
  const strapMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.72,
  });
  const camRingMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.9,
    roughness: 0.2,
  });
  const camLensMat = new THREE.MeshPhysicalMaterial({
    color: 0x0284c7,
    metalness: 0.4,
    roughness: 0.05,
    clearcoat: 1.0,
  });

  // Curved Crescent Visor Shell (top-down profile extruded vertically)
  const visorProfile = new THREE.Shape();
  visorProfile.moveTo(-0.185, -0.06);
  visorProfile.bezierCurveTo(-0.14, 0.085, -0.06, 0.125, 0, 0.125);
  visorProfile.bezierCurveTo(0.06, 0.125, 0.14, 0.085, 0.185, -0.06);
  visorProfile.bezierCurveTo(0.14, -0.095, 0.06, -0.035, 0, -0.035);
  visorProfile.bezierCurveTo(-0.06, -0.035, -0.14, -0.095, -0.185, -0.06);

  const shellGeo = new THREE.ExtrudeGeometry(visorProfile, {
    depth: 0.145,
    bevelEnabled: true,
    bevelThickness: 0.018,
    bevelSize: 0.014,
    bevelSegments: 4,
    curveSegments: 24,
  });
  shellGeo.rotateX(-Math.PI / 2);
  shellGeo.translate(0, -0.072, 0.02);
  group.add(new THREE.Mesh(shellGeo, pearlMat));

  // Glossy Curved Front Glass Display Shield
  const shieldProfile = new THREE.Shape();
  shieldProfile.moveTo(-0.168, 0.015);
  shieldProfile.bezierCurveTo(-0.12, 0.10, -0.05, 0.132, 0, 0.132);
  shieldProfile.bezierCurveTo(0.05, 0.132, 0.12, 0.10, 0.168, 0.015);
  shieldProfile.bezierCurveTo(0.11, 0.082, 0.045, 0.112, 0, 0.112);
  shieldProfile.bezierCurveTo(-0.045, 0.112, -0.11, 0.082, -0.168, 0.015);

  const shieldGeo = new THREE.ExtrudeGeometry(shieldProfile, {
    depth: 0.125,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.006,
    bevelSegments: 3,
    curveSegments: 24,
  });
  shieldGeo.rotateX(-Math.PI / 2);
  shieldGeo.translate(0, -0.062, 0.024);
  group.add(new THREE.Mesh(shieldGeo, visorGlassMat));

  // 4 SLAM Optical Tracking Cameras with Metallic Rings
  [
    [-0.125, 0.042, 0.108, -0.45],
    [0.125, 0.042, 0.108, 0.45],
    [-0.125, -0.042, 0.108, -0.45],
    [0.125, -0.042, 0.108, 0.45],
  ].forEach(([cx, cy, cz, ry]) => {
    const bezel = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.01, 14), camRingMat);
    bezel.rotation.x = Math.PI / 2;
    bezel.rotation.z = -ry;
    bezel.position.set(cx, cy, cz);
    const optic = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 10), camLensMat);
    optic.position.set(cx + Math.sin(ry) * 0.004, cy, cz + 0.004);
    group.add(bezel, optic);
  });

  // Soft Contoured Facial Cushion & Dual Inner Fresnel Lenses
  const gasketGeo = new THREE.ExtrudeGeometry(visorProfile, {
    depth: 0.115,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.01,
    bevelSegments: 3,
    curveSegments: 20,
  });
  gasketGeo.rotateX(-Math.PI / 2);
  gasketGeo.scale(0.92, 0.9, 0.72);
  gasketGeo.translate(0, -0.052, -0.022);
  group.add(new THREE.Mesh(gasketGeo, cushionMat));

  [-0.062, 0.062].forEach((lx) => {
    const innerLens = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.012, 20), camLensMat);
    innerLens.rotation.x = Math.PI / 2;
    innerLens.position.set(lx, 0, -0.028);
    group.add(innerLens);
  });

  // Rigid Elite Headstrap Ring + Top Strap + Rear Tension Ratchet Dial
  const strapCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.188, 0.0, -0.03),
    new THREE.Vector3(-0.195, 0.0, -0.17),
    new THREE.Vector3(-0.12, -0.01, -0.28),
    new THREE.Vector3(0, -0.015, -0.31),
    new THREE.Vector3(0.12, -0.01, -0.28),
    new THREE.Vector3(0.195, 0.0, -0.17),
    new THREE.Vector3(0.188, 0.0, -0.03),
  ]);
  const strapGeo = new THREE.TubeGeometry(strapCurve, 32, 0.018, 10, false);
  strapGeo.scale(1, 1.35, 1);
  group.add(new THREE.Mesh(strapGeo, pearlMat));

  const topStrapCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.088, 0.01),
    new THREE.Vector3(0, 0.125, -0.14),
    new THREE.Vector3(0, 0.01, -0.305),
  ]);
  group.add(new THREE.Mesh(new THREE.TubeGeometry(topStrapCurve, 18, 0.012, 8, false), strapMat));

  const rearPad = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.072, 0.035), cushionMat);
  rearPad.position.set(0, -0.015, -0.295);
  const dialKnob = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.022, 16), camRingMat);
  dialKnob.rotation.x = Math.PI / 2;
  dialKnob.position.set(0, -0.015, -0.322);
  group.add(rearPad, dialKnob);

  return group;
}

// ---------------------------------------------------------------------------------
// 22. 3D Street Cruiser Skateboard (Curved Kicktail Deck, RKP Trucks & Urethane Wheels)
// ---------------------------------------------------------------------------------
export function createSolid3DSkateboard(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Skateboard';

  const graphicTex = getCachedSkateBottom();
  const metalTex = getCachedBrushedMetal();

  const gripMat = new THREE.MeshStandardMaterial({
    color: 0x141619,
    roughness: 0.96,
    metalness: 0.02,
  });
  const mapleBottomMat = new THREE.MeshPhysicalMaterial({
    map: graphicTex,
    roughness: 0.32,
    metalness: 0.05,
    clearcoat: 0.45,
  });
  const plyEdgeMat = new THREE.MeshStandardMaterial({
    color: 0xd99b52,
    roughness: 0.55,
  });
  const truckMat = new THREE.MeshStandardMaterial({
    map: metalTex,
    color: 0xcbd5e1,
    metalness: 0.92,
    roughness: 0.16,
  });
  const bushingMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.4,
  });
  const wheelMat = new THREE.MeshPhysicalMaterial({
    color: 0x06b6d4,
    roughness: 0.34,
    clearcoat: 0.35,
  });

  // Build Parametric Curved 7-Ply Skateboard Deck (nose/tail kicktails + subtle concave)
  const buildCurvedSurface = (yOffset: number, flipNormal: boolean) => {
    const segsZ = 28;
    const segsX = 8;
    const halfL = 0.41;
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let iz = 0; iz <= segsZ; iz++) {
      const tz = iz / segsZ; // 0..1
      const nz = tz * 2 - 1; // -1..1
      const z = nz * halfL;
      // Rounded nose/tail width taper
      const absZ = Math.abs(nz);
      const tipFactor = absZ > 0.62 ? Math.sqrt(Math.max(0.0, 1 - Math.pow((absZ - 0.62) / 0.38, 2))) : 1.0;
      const halfW = 0.108 * Math.max(0.06, tipFactor);
      // Upward kicktail bend beyond |z| > 0.24
      const kick = Math.max(0, Math.abs(z) - 0.24);
      const kickY = kick * kick * 1.45;

      for (let ix = 0; ix <= segsX; ix++) {
        const tx = ix / segsX; // 0..1
        const nx = tx * 2 - 1; // -1..1
        const x = nx * halfW;
        // Subtle ergonomic lateral concave in standing platform
        const concaveY = nx * nx * 0.007 * (1 - absZ * 0.6);
        positions.push(x, yOffset + kickY + concaveY, z);
        uvs.push(tx, tz);
      }
    }

    const row = segsX + 1;
    for (let iz = 0; iz < segsZ; iz++) {
      for (let ix = 0; ix < segsX; ix++) {
        const a = iz * row + ix;
        const b = a + 1;
        const c = (iz + 1) * row + ix;
        const d = c + 1;
        if (flipNormal) {
          indices.push(a, b, c, b, d, c);
        } else {
          indices.push(a, c, b, b, c, d);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  };

  // Top grip sheet, bottom maple graphic sheet, and mid laminated ply rim
  const topGeo = buildCurvedSurface(0.008, false);
  const botGeo = buildCurvedSurface(-0.008, true);
  const midGeo = buildCurvedSurface(0.0, false);
  midGeo.scale(1.01, 1.0, 1.005);

  group.add(
    new THREE.Mesh(topGeo, gripMat),
    new THREE.Mesh(botGeo, mapleBottomMat),
    new THREE.Mesh(midGeo, plyEdgeMat)
  );

  // Reverse-Kingpin Trucks + Bushings + Rounded Urethane Cruiser Wheels
  [-0.20, 0.20].forEach((z) => {
    const baseplate = new THREE.Mesh(new THREE.BoxGeometry(0.072, 0.01, 0.095), truckMat);
    baseplate.position.set(0, -0.013, z);

    const hanger = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.015, 0.195, 12), truckMat);
    hanger.rotation.z = Math.PI / 2;
    hanger.position.set(0, -0.044, z);

    const kingpin = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.042, 10), truckMat);
    kingpin.position.set(0, -0.028, z);
    kingpin.rotation.x = z > 0 ? -0.35 : 0.35;

    const bushing = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.016, 12), bushingMat);
    bushing.position.set(0, -0.032, z);
    bushing.rotation.x = z > 0 ? -0.35 : 0.35;

    group.add(baseplate, hanger, kingpin, bushing);

    // Chamfered Lathe Wheels + Steel Bearing Shields
    const wheelPts = [
      new THREE.Vector2(0.014, -0.024),
      new THREE.Vector2(0.036, -0.024),
      new THREE.Vector2(0.044, -0.016),
      new THREE.Vector2(0.044, 0.016),
      new THREE.Vector2(0.036, 0.024),
      new THREE.Vector2(0.014, 0.024),
      new THREE.Vector2(0.014, -0.024),
    ];
    const wheelGeo = new THREE.LatheGeometry(wheelPts, 20);
    wheelGeo.rotateZ(Math.PI / 2);

    [-0.112, 0.112].forEach((wx) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.position.set(wx, -0.044, z);
      const bearing = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.052, 12), truckMat);
      bearing.rotation.z = Math.PI / 2;
      bearing.position.set(wx, -0.044, z);
      group.add(wheel, bearing);
    });
  });

  return group;
}

// ---------------------------------------------------------------------------------
// 23. 3D Vintage LED Camping Lantern (Lathe Fuel Base, Brass Knob & Edison Filament)
// ---------------------------------------------------------------------------------
export function createSolid3DLantern(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'CampingLantern';

  const metalTex = getCachedBrushedMetal();

  const enamelGreenMat = new THREE.MeshPhysicalMaterial({
    color: 0x1b4332,
    roughness: 0.28,
    metalness: 0.42,
    clearcoat: 0.55,
  });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.9,
    roughness: 0.2,
  });
  const chromeMat = new THREE.MeshStandardMaterial({
    map: metalTex,
    color: 0xcbd5e1,
    metalness: 0.92,
    roughness: 0.16,
  });
  const filamentMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 2.0,
    roughness: 0.15,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xfffbeb,
    transparent: true,
    opacity: 0.30,
    roughness: 0.05,
    metalness: 0.05,
    clearcoat: 1.0,
    depthWrite: false,
  });

  // Stepped Lathe Fuel Tank Base
  const basePts = [
    new THREE.Vector2(0.0, -0.24),
    new THREE.Vector2(0.145, -0.24),
    new THREE.Vector2(0.15, -0.22),
    new THREE.Vector2(0.14, -0.15),
    new THREE.Vector2(0.125, -0.115),
    new THREE.Vector2(0.112, -0.105),
    new THREE.Vector2(0.0, -0.105),
  ];
  const baseMesh = new THREE.Mesh(new THREE.LatheGeometry(basePts, 28), enamelGreenMat);
  group.add(baseMesh);

  // Brass Dimmer Knob & Valve Collar on Front of Tank
  const knobStem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.025, 10), brassMat);
  knobStem.rotation.x = Math.PI / 2;
  knobStem.position.set(0, -0.175, 0.145);
  const knobDial = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.014, 16), brassMat);
  knobDial.rotation.x = Math.PI / 2;
  knobDial.position.set(0, -0.175, 0.16);
  group.add(knobStem, knobDial);

  // Inner Reflector Disc & Brass Socket
  const reflector = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.105, 0.012, 24), chromeMat);
  reflector.position.y = -0.102;
  const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.028, 0.042, 16), brassMat);
  socket.position.y = -0.075;
  group.add(reflector, socket);

  // Helical Warm Edison LED Filament inside Glass Mantle
  const helixPts: THREE.Vector3[] = [];
  for (let i = 0; i <= 32; i++) {
    const t = i / 32;
    const angle = t * Math.PI * 6;
    helixPts.push(new THREE.Vector3(Math.cos(angle) * 0.022, -0.04 + t * 0.125, Math.sin(angle) * 0.022));
  }
  const filament = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(helixPts), 36, 0.0055, 8, false),
    filamentMat
  );
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.007, 0.135, 8), chromeMat);
  stem.position.y = 0.02;
  group.add(filament, stem);

  // Bulbous Storm-Lantern Clear Glass Globe (depthWrite: false + renderOrder: 2)
  const globePts = [
    new THREE.Vector2(0.098, -0.10),
    new THREE.Vector2(0.118, -0.02),
    new THREE.Vector2(0.118, 0.05),
    new THREE.Vector2(0.096, 0.135),
  ];
  const glassGlobe = new THREE.Mesh(new THREE.LatheGeometry(globePts, 28), glassMat);
  glassGlobe.renderOrder = 2;
  group.add(glassGlobe);

  // 4 Curved Protective Wire Guard Bars around the Glass
  for (let w = 0; w < 4; w++) {
    const a = (w / 4) * Math.PI * 2 + Math.PI / 4;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const guardCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(c * 0.125, -0.11, s * 0.125),
      new THREE.Vector3(c * 0.134, 0.015, s * 0.134),
      new THREE.Vector3(c * 0.115, 0.14, s * 0.115),
    ]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(guardCurve, 14, 0.0055, 8, false), chromeMat));
  }

  // Stepped Ventilated Top Hood & Chimney Cap (LatheGeometry)
  const capPts = [
    new THREE.Vector2(0.10, 0.132),
    new THREE.Vector2(0.145, 0.155),
    new THREE.Vector2(0.135, 0.175),
    new THREE.Vector2(0.072, 0.195),
    new THREE.Vector2(0.076, 0.235),
    new THREE.Vector2(0.092, 0.245),
    new THREE.Vector2(0.085, 0.26),
    new THREE.Vector2(0.0, 0.268),
  ];
  group.add(new THREE.Mesh(new THREE.LatheGeometry(capPts, 28), enamelGreenMat));

  // Brass chimney vent band
  const ventBand = new THREE.Mesh(new THREE.CylinderGeometry(0.074, 0.074, 0.022, 16), brassMat);
  ventBand.position.y = 0.215;
  group.add(ventBand);

  // Articulated Wire Bail Carry Handle
  const bailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.09, 0.235, 0),
    new THREE.Vector3(-0.14, 0.31, 0),
    new THREE.Vector3(-0.075, 0.375, 0),
    new THREE.Vector3(0, 0.39, 0),
    new THREE.Vector3(0.075, 0.375, 0),
    new THREE.Vector3(0.14, 0.31, 0),
    new THREE.Vector3(0.09, 0.235, 0),
  ]);
  group.add(new THREE.Mesh(new THREE.TubeGeometry(bailCurve, 28, 0.007, 8, false), chromeMat));

  return group;
}

// ---------------------------------------------------------------------------------
// 24. Faded Grid Floor Plane (100% transparent overlay with clean, subtle neutral slate lines)
// ---------------------------------------------------------------------------------
export function createFadedGridFloor(size: number = 24.0, divisions: number = 48): THREE.Group {
  const floorGroup = new THREE.Group();
  floorGroup.name = 'FadedGridFloorGroup';

  const geometry = new THREE.PlaneGeometry(size, size, 1, 1);
  geometry.rotateX(-Math.PI / 2);

  // Pure Transparent Neutral Grid Shader Material:
  // Zero colored background tint, zero glow halos, zero green or purple spill.
  const gridMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uGridColor: { value: new THREE.Color(0x94a3b8) }, // Neutral crisp slate line
      uLineColor: { value: new THREE.Color(0xcbd5e1) }, // Subtle silver accent
      uSize: { value: size },
      uCellSize: { value: size / divisions },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      varying vec3 vWorldPosition;
      uniform vec3 uGridColor;
      uniform vec3 uLineColor;
      uniform float uSize;
      uniform float uCellSize;

      float getGridLine(vec2 coord) {
        vec2 dcoord = fwidth(coord);
        vec2 grid = abs(fract(coord - 0.5) - 0.5) / max(dcoord, vec2(0.0001));
        float line = min(grid.x, grid.y);
        return clamp(1.0 - line, 0.0, 1.0);
      }

      void main() {
        vec2 coord = vWorldPosition.xz / uCellSize;
        float line = getGridLine(coord);

        // Major cross axes every 4 cells
        vec2 majorCoord = vWorldPosition.xz / (uCellSize * 4.0);
        float majorLine = getGridLine(majorCoord);

        // Clean neutral composition
        vec3 col = mix(uGridColor, uLineColor, majorLine * 0.6);

        // Continuous smooth radial distance from center (under the box)
        float dist = length(vec2(vWorldPosition.x * 0.9, vWorldPosition.z * 1.1));
        float maxRadius = 5.2;

        float normalizedDist = clamp(dist / maxRadius, 0.0, 1.0);
        float fade = 0.5 * (1.0 + cos(normalizedDist * 3.14159265));
        float smoothDecay = pow(fade, 1.6);

        // Coordinate intersection nodes for delicate depth
        vec2 nodeDist = abs(fract(coord - 0.5) - 0.5);
        float nodeDot = step(max(nodeDist.x, nodeDist.y), 0.075);

        // Clean, subtle opacity strictly without background fill
        float totalAlpha = ((line * 0.32 + majorLine * 0.22) + nodeDot * 0.12) * smoothDecay;

        if (totalAlpha < 0.001) discard;

        gl_FragColor = vec4(col, totalAlpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const gridMesh = new THREE.Mesh(geometry, gridMaterial);
  gridMesh.name = 'FadedGridFloorMesh';
  floorGroup.add(gridMesh);

  return floorGroup;
}
