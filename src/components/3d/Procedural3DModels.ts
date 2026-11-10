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

// Helper: Generates realistic sunburst acoustic guitar finish
export function createSunburstTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(256, 256, 15, 256, 256, 250);
  grad.addColorStop(0, '#fef08a'); // Warm golden center
  grad.addColorStop(0.3, '#f59e0b'); // Amber
  grad.addColorStop(0.6, '#b45309'); // Warm mahogany
  grad.addColorStop(0.85, '#451a03'); // Burnt sienna
  grad.addColorStop(1.0, '#1c0a02'); // Deep espresso rim
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle organic wood grain streaks
  for (let y = 0; y < 512; y += 4) {
    ctx.fillStyle = 'rgba(28, 10, 2, 0.04)';
    ctx.fillRect(0, y, 512, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
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

export function createThemedCardboardTexture(settings: BoxThemeSettings): { map: THREE.CanvasTexture; bump: THREE.CanvasTexture } {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = settings.baseColor;
  ctx.fillRect(0, 0, 1024, 1024);

  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 20;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain * 0.9));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain * 0.8));
  }
  ctx.putImageData(imgData, 0, 0);

  for (let x = 0; x < 1024; x += 16) {
    ctx.fillStyle = settings.ribColor;
    ctx.fillRect(x, 0, 5, 1024);
    ctx.fillStyle = settings.paperNoiseLight;
    ctx.fillRect(x + 5, 0, 4, 1024);
  }

  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const len = Math.random() * 6 + 2;
    ctx.strokeStyle = Math.random() > 0.4 ? settings.paperNoiseDark : settings.paperNoiseLight;
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

export function createThemedFrontMaterial(settings: BoxThemeSettings, bumpMap: THREE.CanvasTexture): THREE.MeshStandardMaterial {
  const frontCanvas = document.createElement('canvas');
  frontCanvas.width = 1024;
  frontCanvas.height = 1024;
  const fCtx = frontCanvas.getContext('2d')!;

  fCtx.fillStyle = settings.baseColor;
  fCtx.fillRect(0, 0, 1024, 1024);

  const fImg = fCtx.getImageData(0, 0, 1024, 1024);
  for (let i = 0; i < fImg.data.length; i += 4) {
    const g = (Math.random() - 0.5) * 18;
    fImg.data[i] = Math.max(0, Math.min(255, fImg.data[i] + g));
    fImg.data[i + 1] = Math.max(0, Math.min(255, fImg.data[i + 1] + g * 0.9));
    fImg.data[i + 2] = Math.max(0, Math.min(255, fImg.data[i + 2] + g * 0.8));
  }
  fCtx.putImageData(fImg, 0, 0);

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

  boxGroup.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.name === 'CardboardFrontWall') {
        const oldMat = child.material;
        child.material = createThemedFrontMaterial(settings, newKraftBump);
        if (oldMat instanceof THREE.Material) oldMat.dispose();
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
          child.material.map = newKraftMap;
          child.material.bumpMap = newKraftBump;
          child.material.needsUpdate = true;
        }
      }
    }
  });
}

// ---------------------------------------------------------------------------------
// 2. 3D Over-Ear Studio Headphones (Detailed Solid Construction)
// ---------------------------------------------------------------------------------
export function createSolid3DHeadphones(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Headphones';

  const leatherTex = createPebbledLeatherTexture();
  const metalTex = createBrushedMetalTexture();

  const blackMat = new THREE.MeshStandardMaterial({
    color: 0x181a1d,
    roughness: 0.35,
    metalness: 0.45,
  });

  const cushionMat = new THREE.MeshStandardMaterial({
    map: leatherTex,
    color: 0x14161a,
    roughness: 0.85,
    metalness: 0.05,
  });

  const metalMat = new THREE.MeshStandardMaterial({
    map: metalTex,
    color: 0x9b7ebd,
    roughness: 0.25,
    metalness: 0.85,
  });

  // Solid spring-steel arch
  const arch = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.045, 16, 40, Math.PI), blackMat);
  arch.rotation.z = Math.PI;
  group.add(arch);

  // Soft stitched cushion pad
  const pad = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.06, 12, 28, Math.PI * 0.65), cushionMat);
  pad.rotation.z = Math.PI * 1.175;
  group.add(pad);

  // Left & Right Solid Ear Cups with Beveled Shells
  [-0.5, 0.5].forEach((x, idx) => {
    const cupGroup = new THREE.Group();
    cupGroup.position.set(x, -0.06, 0);

    // Aluminum gimbal fork
    const fork = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.08), metalMat);
    cupGroup.add(fork);

    // Chamfered outer cup shell
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.25, 0.13, 32), blackMat);
    cup.rotation.z = Math.PI / 2;
    cup.position.x = idx === 0 ? -0.04 : 0.04;
    cupGroup.add(cup);

    // Emerald anodized metallic trim ring
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.015, 12, 32), metalMat);
    ring.rotation.y = Math.PI / 2;
    ring.position.x = idx === 0 ? -0.09 : 0.09;
    cupGroup.add(ring);

    // Deep Memory-Foam Leather Cushion
    const cushion = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.07, 16, 28), cushionMat);
    cushion.rotation.y = Math.PI / 2;
    cushion.position.x = idx === 0 ? 0.03 : -0.03;
    cupGroup.add(cushion);

    group.add(cupGroup);
  });

  return group;
}

// ---------------------------------------------------------------------------------
// 3. 3D Laptop (Chiseled Aluminum Unibody with Crisp Screen)
// ---------------------------------------------------------------------------------
export function createSolid3DLaptop(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Laptop';

  const metalTex = createBrushedMetalTexture();

  const bodyMat = new THREE.MeshStandardMaterial({
    map: metalTex,
    color: 0x9ca3af,
    roughness: 0.25,
    metalness: 0.8,
  });

  const kbMat = new THREE.MeshStandardMaterial({
    color: 0x15181c,
    roughness: 0.65,
    metalness: 0.15,
  });

  // Wallpaper screen canvas
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 512;
  screenCanvas.height = 320;
  const sCtx = screenCanvas.getContext('2d')!;
  const grad = sCtx.createLinearGradient(0, 0, 512, 320);
  grad.addColorStop(0, '#2563eb');
  grad.addColorStop(0.5, '#7c3aed');
  grad.addColorStop(1, '#db2777');
  sCtx.fillStyle = grad;
  sCtx.fillRect(0, 0, 512, 320);

  // Mountains silhouette
  sCtx.fillStyle = '#0f172a';
  sCtx.beginPath();
  sCtx.moveTo(0, 320);
  sCtx.lineTo(130, 175);
  sCtx.lineTo(250, 255);
  sCtx.lineTo(390, 145);
  sCtx.lineTo(512, 320);
  sCtx.fill();

  // Vibrant warm sun
  sCtx.fillStyle = '#fbbf24';
  sCtx.beginPath();
  sCtx.arc(390, 105, 32, 0, Math.PI * 2);
  sCtx.fill();

  const screenTex = new THREE.CanvasTexture(screenCanvas);
  screenTex.colorSpace = THREE.SRGBColorSpace;
  const screenMat = new THREE.MeshStandardMaterial({
    map: screenTex,
    emissive: 0x1e293b,
    emissiveIntensity: 0.45,
    roughness: 0.15,
  });

  // Solid aluminum unibody base
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.04, 0.64), bodyMat);
  group.add(base);

  // Recessed keyboard well
  const kb = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.008, 0.31), kbMat);
  kb.position.set(0, 0.022, -0.08);
  const tp = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.008, 0.18), bodyMat);
  tp.position.set(0, 0.022, 0.18);
  group.add(kb, tp);

  // Display Lid (angled back 115 deg)
  const lidGroup = new THREE.Group();
  lidGroup.position.set(0, 0.02, -0.32);
  const lid = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.61, 0.025), bodyMat);
  lid.position.set(0, 0.305, 0);
  lidGroup.add(lid);

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.54), screenMat);
  screen.position.set(0, 0.305, 0.015);
  lidGroup.add(screen);

  lidGroup.rotation.x = -0.42;
  group.add(lidGroup);

  return group;
}

// ---------------------------------------------------------------------------------
// 4. 3D PlayStation 5 Console (Architectural Curves & Glowing Core)
// ---------------------------------------------------------------------------------
export function createSolid3DPS5(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'PS5';

  const whiteMat = new THREE.MeshStandardMaterial({
    color: 0xf3f4f6,
    roughness: 0.3,
    metalness: 0.05,
  });

  const blackMat = new THREE.MeshStandardMaterial({
    color: 0x111317,
    roughness: 0.12,
    metalness: 0.65,
  });

  const ledMat = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    emissive: 0x00c8ff,
    emissiveIntensity: 1.8,
    roughness: 0.1,
  });

  // Solid dark center chassis
  const core = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.92, 0.54), blackMat);
  group.add(core);

  // Curved sculpted side panels
  [-0.12, 0.12].forEach((x, idx) => {
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.98, 0.58), whiteMat);
    plate.position.set(x, 0.02, 0);
    plate.rotation.z = idx === 0 ? -0.06 : 0.06;
    group.add(plate);
  });

  // Blue LED indicator slit
  const led = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.82, 0.015), ledMat);
  led.position.set(0.08, 0.05, 0.27);
  group.add(led);

  return group;
}

// ---------------------------------------------------------------------------------
// 5. 3D Mechanical RGB Keyboard (Full Individual Keycap Geometry)
// ---------------------------------------------------------------------------------
export function createSolid3DKeyboard(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Keyboard';

  const caseMat = new THREE.MeshStandardMaterial({
    color: 0x181e26,
    roughness: 0.38,
    metalness: 0.35,
  });

  const keyMat = new THREE.MeshStandardMaterial({
    color: 0xf3eee3,
    roughness: 0.45,
    metalness: 0.05,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    roughness: 0.3,
    metalness: 0.1,
  });

  // Heavy beveled case
  const baseCase = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.065, 0.35), caseMat);
  group.add(baseCase);

  const rows = 4;
  const cols = 10;
  const keyW = 0.068;
  const keyD = 0.062;
  const keyH = 0.038;
  const gap = 0.012;
  const keyGeo = new THREE.BoxGeometry(keyW, keyH, keyD);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isAccent = (r === 0 && c === 0) || (r === 3 && c === 4);
      const kMesh = new THREE.Mesh(keyGeo, isAccent ? accentMat : keyMat);
      kMesh.position.set(
        (c - (cols - 1) / 2) * (keyW + gap),
        0.048,
        (r - (rows - 1) / 2) * (keyD + gap)
      );
      group.add(kMesh);
    }
  }

  return group;
}

// ---------------------------------------------------------------------------------
// 6. 3D Acoustic Sunburst Guitar (Solid Resonant Chamber with Real Sunburst Grain)
// ---------------------------------------------------------------------------------
export function createSolid3DGuitar(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Guitar';

  const sunburstTex = createSunburstTexture();

  // Top Sunburst Soundboard
  const soundboardMat = new THREE.MeshStandardMaterial({
    map: sunburstTex,
    roughness: 0.22,
    metalness: 0.04,
  });

  // Mahogany Sides & Back (rich acoustic tone wood)
  const bodyRimMat = new THREE.MeshStandardMaterial({
    color: 0x2e1105,
    roughness: 0.35,
    metalness: 0.05,
  });

  const darkRosewood = new THREE.MeshStandardMaterial({
    color: 0x1c0c04,
    roughness: 0.55,
  });

  const neckMat = new THREE.MeshStandardMaterial({
    color: 0xd99b5f,
    roughness: 0.38,
  });

  const silverMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.95,
    roughness: 0.12,
  });

  const bronzeMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.92,
    roughness: 0.15,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.85,
    roughness: 0.2,
  });

  const pearlMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.25,
    metalness: 0.1,
  });

  // 1. Lower bout (wide chamber): Front soundboard + Rim + Mahogany Back plate
  const lowerBout = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.145, 32), bodyRimMat);
  lowerBout.rotation.x = Math.PI / 2;
  lowerBout.position.y = -0.3;
  const lowerCapFront = new THREE.Mesh(new THREE.CircleGeometry(0.358, 32), soundboardMat);
  lowerCapFront.position.set(0, -0.3, 0.073);
  const lowerCapBack = new THREE.Mesh(new THREE.CircleGeometry(0.358, 32), bodyRimMat);
  lowerCapBack.rotation.y = Math.PI;
  lowerCapBack.position.set(0, -0.3, -0.073);
  group.add(lowerBout, lowerCapFront, lowerCapBack);

  // 2. Upper bout (narrower chest): Front soundboard + Rim + Mahogany Back plate
  const upperBout = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.145, 32), bodyRimMat);
  upperBout.rotation.x = Math.PI / 2;
  upperBout.position.y = 0.14;
  const upperCapFront = new THREE.Mesh(new THREE.CircleGeometry(0.268, 32), soundboardMat);
  upperCapFront.position.set(0, 0.14, 0.073);
  const upperCapBack = new THREE.Mesh(new THREE.CircleGeometry(0.268, 32), bodyRimMat);
  upperCapBack.rotation.y = Math.PI;
  upperCapBack.position.set(0, 0.14, -0.073);
  group.add(upperBout, upperCapFront, upperCapBack);

  // 3. Waist block connecting bouts
  const waist = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.28, 0.144), bodyRimMat);
  waist.position.y = -0.06;
  const waistCapFront = new THREE.Mesh(new THREE.PlaneGeometry(0.458, 0.28), soundboardMat);
  waistCapFront.position.set(0, -0.06, 0.073);
  const waistCapBack = new THREE.Mesh(new THREE.PlaneGeometry(0.458, 0.28), bodyRimMat);
  waistCapBack.rotation.y = Math.PI;
  waistCapBack.position.set(0, -0.06, -0.073);
  group.add(waist, waistCapFront, waistCapBack);

  // 4. Soundhole with Cavity Interior & Rosette Ring Inlays
  const cavity = new THREE.Mesh(new THREE.CircleGeometry(0.102, 32), darkRosewood);
  cavity.position.set(0, 0.04, 0.0735);
  const innerRing = new THREE.Mesh(new THREE.RingGeometry(0.104, 0.114, 32), darkRosewood);
  innerRing.position.set(0, 0.04, 0.074);
  const rosetteRing = new THREE.Mesh(new THREE.RingGeometry(0.116, 0.136, 32), goldMat);
  rosetteRing.position.set(0, 0.04, 0.0743);
  const outerRing = new THREE.Mesh(new THREE.RingGeometry(0.138, 0.146, 32), pearlMat);
  outerRing.position.set(0, 0.04, 0.0746);
  group.add(cavity, innerRing, rosetteRing, outerRing);

  // 5. Tortoiseshell Pickguard
  const pickguard = new THREE.Mesh(
    new THREE.CircleGeometry(0.125, 20, Math.PI * 0.12, Math.PI * 0.75),
    new THREE.MeshStandardMaterial({ color: 0x1f0b03, roughness: 0.18 })
  );
  pickguard.position.set(0.08, -0.035, 0.0748);
  group.add(pickguard);

  // 6. Rosewood Acoustic Bridge with Bone Saddle & 6 Bridge Pins
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.048, 0.022), darkRosewood);
  bridge.position.set(0, -0.32, 0.084);
  const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.165, 0.008, 0.012), pearlMat);
  saddle.position.set(0, -0.312, 0.096);
  group.add(bridge, saddle);

  for (let p = 0; p < 6; p++) {
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.003, 0.008, 8), pearlMat);
    pin.position.set(-0.05 + p * 0.02, -0.334, 0.095);
    group.add(pin);
  }

  // 7. Solid Mahogany Neck (joins body at y = 0.18, extends to y = 1.04)
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.076, 0.86, 0.048), neckMat);
  neck.position.set(0, 0.61, 0.048);
  
  // 8. Raised Rosewood Fretboard (Sits on top of neck and extends onto soundboard towards soundhole)
  const fretboard = new THREE.Mesh(new THREE.BoxGeometry(0.082, 0.88, 0.014), darkRosewood);
  fretboard.position.set(0, 0.58, 0.080);
  group.add(neck, fretboard);

  // 9. 14 Precision Nickel-Silver Fret Wires (properly raised at z = 0.089)
  for (let f = 1; f <= 14; f++) {
    const fretY = 0.20 + f * 0.056;
    const fretWire = new THREE.Mesh(new THREE.BoxGeometry(0.080, 0.003, 0.003), silverMat);
    fretWire.position.set(0, fretY, 0.089);
    group.add(fretWire);
  }

  // 10. Pearlescent Position Inlays (Frets 3, 5, 7, 9, 12)
  [3, 5, 7, 9].forEach((fretNum) => {
    const dotY = 0.20 + (fretNum - 0.5) * 0.056;
    const dot = new THREE.Mesh(new THREE.CircleGeometry(0.006, 12), pearlMat);
    dot.position.set(0, dotY, 0.0895);
    group.add(dot);
  });
  // Double dot at 12th fret
  [-0.018, 0.018].forEach((xOff) => {
    const dot12 = new THREE.Mesh(new THREE.CircleGeometry(0.005, 12), pearlMat);
    dot12.position.set(xOff, 0.20 + 11.5 * 0.056, 0.0895);
    group.add(dot12);
  });

  // 11. Bone Nut at top of fretboard
  const nut = new THREE.Mesh(new THREE.BoxGeometry(0.084, 0.012, 0.014), pearlMat);
  nut.position.set(0, 1.035, 0.088);
  group.add(nut);

  // 12. Headstock with classic rear tilt & 6 Chrome Tuning Pegs
  const headstockGroup = new THREE.Group();
  headstockGroup.position.set(0, 1.04, 0.048);
  headstockGroup.rotation.x = -0.15; // Realistic 12° headstock angle
  const headstockMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.24, 0.042), bodyRimMat);
  headstockMesh.position.set(0, 0.12, 0);
  headstockGroup.add(headstockMesh);

  // 6 Tuning Pegs with solid shafts and butterfly knobs
  [-0.068, 0.068].forEach((x) => {
    for (let p = 0; p < 3; p++) {
      const pegPost = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.038, 12), silverMat);
      pegPost.rotation.z = Math.PI / 2;
      pegPost.position.set(x, 0.04 + p * 0.07, 0);
      const pegKnob = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.032, 0.022), silverMat);
      pegKnob.position.set(x > 0 ? x + 0.024 : x - 0.024, 0.04 + p * 0.07, 0);
      headstockGroup.add(pegPost, pegKnob);
    }
  });
  group.add(headstockGroup);

  // 13. 6 Full Metallic Strings (spanning continuously from bridge saddle at y=-0.312 up to bone nut at y=1.035)
  // Total span length = 1.35. Positioned hovering above fretboard (z = 0.095) with metallic gleam
  const stringGauges = [0.0028, 0.0024, 0.0020, 0.0017, 0.0014, 0.0012];
  for (let s = 0; s < 6; s++) {
    const stringX = -0.025 + s * 0.01;
    const stringMat = s < 3 ? bronzeMat : silverMat;
    const stringGeo = new THREE.CylinderGeometry(stringGauges[s], stringGauges[s], 1.35, 6);
    const stringMesh = new THREE.Mesh(stringGeo, stringMat);
    stringMesh.position.set(stringX, 0.362, 0.095);
    group.add(stringMesh);
  }

  return group;
}

// ---------------------------------------------------------------------------------
// 7. 3D White Streetwear Sneaker (Sculpted Thick Outsole & Tread Grooves)
// ---------------------------------------------------------------------------------
export function createSolid3DSneaker(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Sneaker';

  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
  const soleMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.45 });
  const darkTreadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
  const accentMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
  const silverEyelet = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.8, roughness: 0.2 });

  // Heavy Chunky Outsole
  const sole = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.1, 0.86), soleMat);
  group.add(sole);

  // Bottom Tread Lugs (3D grip ridges)
  for (let t = -3; t <= 3; t++) {
    const lug = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.02, 0.05), darkTreadMat);
    lug.position.set(0, -0.055, t * 0.11);
    group.add(lug);
  }

  // Foot Upper
  const upper = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.18, 0.7), whiteMat);
  upper.position.set(0, 0.12, -0.04);
  group.add(upper);

  // Toe Cap with smooth taper
  const toe = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.18, 0.12, 20), whiteMat);
  toe.position.set(0, 0.08, 0.24);
  group.add(toe);

  // Padded Ankle Collar
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.18, 20), whiteMat);
  collar.position.set(0, 0.22, -0.18);
  // Heel Pull-Tab
  const heelTab = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.02), accentMat);
  heelTab.position.set(0, 0.26, -0.32);
  group.add(collar, heelTab);

  // Tongue and 4 criss-cross lace bridges with metallic eyelets
  const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.2, 0.35), whiteMat);
  tongue.position.set(0, 0.18, 0.04);
  tongue.rotation.x = -0.35;
  group.add(tongue);

  for (let l = 0; l < 4; l++) {
    const zPos = 0.14 - l * 0.06;
    const yPos = 0.16 + l * 0.04;

    // Left and right eyelets
    [-0.1, 0.1].forEach((ex) => {
      const eyelet = new THREE.Mesh(new THREE.TorusGeometry(0.012, 0.004, 6, 12), silverEyelet);
      eyelet.rotation.x = Math.PI / 2;
      eyelet.position.set(ex, yPos, zPos);
      group.add(eyelet);
    });

    // Lace bridge
    const lace = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.19, 8), accentMat);
    lace.rotation.z = Math.PI / 2;
    lace.position.set(0, yPos, zPos);
    group.add(lace);
  }

  // 3D Tied Lace Knot & Bow on top
  const knot = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), accentMat);
  knot.position.set(0, 0.32, -0.06);
  const bowLeft = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.008, 6, 12), accentMat);
  bowLeft.position.set(-0.025, 0.33, -0.06);
  bowLeft.rotation.y = 0.5;
  const bowRight = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.008, 6, 12), accentMat);
  bowRight.position.set(0.025, 0.33, -0.06);
  bowRight.rotation.y = -0.5;
  group.add(knot, bowLeft, bowRight);

  // Vibrant Emerald Wave Swoosh
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.37, 0.045, 0.44), accentMat);
  stripe.position.set(0, 0.14, -0.05);
  stripe.rotation.x = 0.25;
  group.add(stripe);

  return group;
}

// ---------------------------------------------------------------------------------
// 8. 3D Stack of Hardcover Books
// ---------------------------------------------------------------------------------
export function createSolid3DBooks(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Books';

  const bookColors = [0x15803d, 0x1d4ed8, 0xea580c];
  const pagesMat = new THREE.MeshStandardMaterial({ color: 0xfbf8f1, roughness: 0.75 });

  bookColors.forEach((col, idx) => {
    const bookGroup = new THREE.Group();
    bookGroup.position.y = idx * 0.12;
    bookGroup.rotation.y = (idx - 1) * 0.16;

    const coverMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.42 });
    const cover = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.09, 0.76), coverMat);
    const pages = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.07, 0.72), pagesMat);
    pages.position.set(0.02, 0, 0);

    bookGroup.add(cover, pages);
    group.add(bookGroup);
  });

  return group;
}

// ---------------------------------------------------------------------------------
// 9. 3D Pro DSLR Camera (Detailed Magnesium Alloy Body & Multi-Coated Optics)
// ---------------------------------------------------------------------------------
export function createSolid3DCamera(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Camera';

  const leatherTex = createPebbledLeatherTexture();
  const metalTex = createBrushedMetalTexture();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x1a1e22,
    roughness: 0.42,
    metalness: 0.4,
  });

  const gripMat = new THREE.MeshStandardMaterial({
    map: leatherTex,
    color: 0x14161a,
    roughness: 0.88,
    metalness: 0.05,
  });

  const rubberRingMat = new THREE.MeshStandardMaterial({
    color: 0x1e2024,
    roughness: 0.75,
  });

  const metalMat = new THREE.MeshStandardMaterial({
    map: metalTex,
    color: 0xd1d5db,
    metalness: 0.9,
    roughness: 0.18,
  });

  const redMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    metalness: 0.4,
    roughness: 0.25,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x071526,
    metalness: 0.95,
    roughness: 0.05,
  });

  const lcdMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    emissive: 0x1e293b,
    emissiveIntensity: 0.35,
    roughness: 0.1,
  });

  // Solid Camera Body & Sculpted Ergonomic Grip
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.45, 0.26), bodyMat);
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.44, 0.18), gripMat);
  grip.position.set(0.26, -0.01, 0.08);

  // Pentaprism Viewfinder Hump & Flash Hotshoe
  const vf = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.13, 0.22), bodyMat);
  vf.position.set(-0.06, 0.26, 0);
  const hotShoe = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.018, 0.08), metalMat);
  hotShoe.position.set(-0.06, 0.33, 0);
  const eyecup = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.01, 8, 16), rubberRingMat);
  eyecup.position.set(-0.06, 0.26, -0.132);
  group.add(body, grip, vf, hotShoe, eyecup);

  // Rear 3-inch LCD Display Screen
  const rearScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.3), lcdMat);
  rearScreen.rotation.y = Math.PI;
  rearScreen.position.set(-0.06, -0.02, -0.132);
  group.add(rearScreen);

  // Top Controls: Mode Dial, Shutter with Power Lever, Video Rec Button
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.045, 20), metalMat);
  dial.position.set(-0.24, 0.24, 0);
  const shutterBase = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.035, 16), metalMat);
  shutterBase.position.set(0.24, 0.24, 0.06);
  const shutterBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.015, 16), redMat);
  shutterBtn.position.set(0.24, 0.26, 0.06);
  group.add(dial, shutterBase, shutterBtn);

  // Stepped Pro Zoom Lens Barrel
  // Base lens mount
  const mountRing = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.04, 32), metalMat);
  mountRing.rotation.x = Math.PI / 2;
  mountRing.position.set(-0.06, 0, 0.14);
  // Main barrel
  const lensBase = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.12, 32), bodyMat);
  lensBase.rotation.x = Math.PI / 2;
  lensBase.position.set(-0.06, 0, 0.20);
  // Knurled Rubber Zoom Ring
  const zoomRing = new THREE.Mesh(new THREE.CylinderGeometry(0.215, 0.215, 0.07, 32), rubberRingMat);
  zoomRing.rotation.x = Math.PI / 2;
  zoomRing.position.set(-0.06, 0, 0.24);
  // Red Luxury Accent Ring (L-series hallmark)
  const redRing = new THREE.Mesh(new THREE.TorusGeometry(0.208, 0.009, 8, 32), redMat);
  redRing.position.set(-0.06, 0, 0.29);
  // Front Filter Thread Barrel
  const frontBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.205, 0.04, 32), metalMat);
  frontBarrel.rotation.x = Math.PI / 2;
  frontBarrel.position.set(-0.06, 0, 0.31);
  // Multi-coated Optical Front Glass Element (curved lens look)
  const frontGlass = new THREE.Mesh(new THREE.CircleGeometry(0.19, 32), glassMat);
  frontGlass.position.set(-0.06, 0, 0.331);
  group.add(mountRing, lensBase, zoomRing, redRing, frontBarrel, frontGlass);

  return group;
}

// ---------------------------------------------------------------------------------
// 10. 3D Handheld Nintendo Switch Console
// ---------------------------------------------------------------------------------
export function createSolid3DConsole(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Console';

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1f2429, roughness: 0.35 });
  const screenMat = new THREE.MeshStandardMaterial({ color: 0x0f141a, roughness: 0.15 });
  const cyanJoyMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3 });
  const redJoyMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 });
  const stickMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });

  const tablet = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.38, 0.05), bodyMat);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.33), screenMat);
  screen.position.z = 0.026;
  group.add(tablet, screen);

  // Cyan Joy-Con
  const leftJoy = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.38, 0.06), cyanJoyMat);
  leftJoy.position.set(-0.415, 0, 0);
  const leftStick = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 16), stickMat);
  leftStick.rotation.x = Math.PI / 2;
  leftStick.position.set(-0.415, 0.08, 0.04);
  group.add(leftJoy, leftStick);

  // Red Joy-Con
  const rightJoy = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.38, 0.06), redJoyMat);
  rightJoy.position.set(0.415, 0, 0);
  const rightStick = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 16), stickMat);
  rightStick.rotation.x = Math.PI / 2;
  rightStick.position.set(0.415, -0.06, 0.04);
  group.add(rightJoy, rightStick);

  return group;
}

// ---------------------------------------------------------------------------------
// 11. 3D Wireless Gamepad Controller
// ---------------------------------------------------------------------------------
export function createSolid3DGamepad(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Gamepad';

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1f2429, roughness: 0.35 });
  const buttonMat = new THREE.MeshStandardMaterial({ color: 0x4b5563, roughness: 0.5 });
  const stickMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 });

  const center = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.18, 0.26), bodyMat);
  group.add(center);

  [-0.23, 0.23].forEach((x, idx) => {
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.34, 16), bodyMat);
    grip.position.set(x, -0.08, 0.08);
    grip.rotation.z = idx === 0 ? -0.45 : 0.45;
    group.add(grip);
  });

  [-0.1, 0.1].forEach((x) => {
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.05, 16), stickMat);
    stick.position.set(x, 0.11, 0.05);
    group.add(stick);
  });

  const dpad = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.1), buttonMat);
  dpad.position.set(-0.13, 0.1, -0.04);
  group.add(dpad);

  return group;
}

// ---------------------------------------------------------------------------------
// 12. 3D Smartwatch
// ---------------------------------------------------------------------------------
export function createSolid3DSmartwatch(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Smartwatch';

  const caseMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.2, metalness: 0.8 });
  const strapMat = new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.8 });
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x059669,
    emissiveIntensity: 0.8,
  });

  const cMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.3, 0.06), caseMat);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.012, 12, 24), ringMat);
  ring.position.z = 0.032;
  const strapTop = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.2, 0.03), strapMat);
  strapTop.position.set(0, 0.23, 0);
  const strapBot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.2, 0.03), strapMat);
  strapBot.position.set(0, -0.23, 0);

  group.add(cMesh, ring, strapTop, strapBot);
  return group;
}

// ---------------------------------------------------------------------------------
// 13. 3D Ceramic Potted Succulent Plant
// ---------------------------------------------------------------------------------
export function createSolid3DPlant(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Plant';

  const potMat = new THREE.MeshStandardMaterial({ color: 0xf9fafb, roughness: 0.3 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.5 });

  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.13, 0.26, 20), potMat);
  group.add(pot);

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), leafMat);
    leaf.scale.set(0.6, 1.4, 0.3);
    leaf.position.set(Math.cos(angle) * 0.1, 0.15, Math.sin(angle) * 0.1);
    leaf.rotation.y = angle;
    leaf.rotation.x = 0.4;
    group.add(leaf);
  }

  return group;
}

// ---------------------------------------------------------------------------------
// 14. 3D AirPods Case
// ---------------------------------------------------------------------------------
export function createSolid3DAirPods(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'AirPods';

  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.12, metalness: 0.05 });
  const ledMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x10b981,
    emissiveIntensity: 1.0,
  });

  const caseBase = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.28, 0.12), whiteMat);
  const led = new THREE.Mesh(new THREE.CircleGeometry(0.012, 12), ledMat);
  led.position.set(0, 0.02, 0.062);

  group.add(caseBase, led);
  return group;
}

// ---------------------------------------------------------------------------------
// 15. 3D Thermal Flask
// ---------------------------------------------------------------------------------
export function createSolid3DFlask(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Flask';

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.38, metalness: 0.55 });
  const capMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.6 });

  const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.52, 24), bodyMat);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.08, 24), capMat);
  cap.position.y = 0.29;
  const loop = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.015, 8, 16, Math.PI), capMat);
  loop.position.y = 0.36;

  group.add(bottle, cap, loop);
  return group;
}

// ---------------------------------------------------------------------------------
// 16. 3D Quadcopter Camera Drone
// ---------------------------------------------------------------------------------
export function createSolid3DDrone(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Drone';

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.6 });
  const armMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3, metalness: 0.7 });
  const bladeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
  const cameraMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.2 });
  const ledMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 1.2 });

  // Central streamlined body
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.1, 0.36), bodyMat);
  group.add(body);

  // 4 X-arms with rotor motors
  const armAngles = [Math.PI / 4, 3 * Math.PI / 4, 5 * Math.PI / 4, 7 * Math.PI / 4];
  const armRadius = 0.38;

  armAngles.forEach((angle) => {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, armRadius, 8), armMat);
    arm.rotation.z = Math.PI / 2;
    arm.rotation.y = angle;
    arm.position.set((Math.cos(angle) * armRadius) / 2, 0, (Math.sin(angle) * armRadius) / 2);
    group.add(arm);

    // Motor pod
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 12), bodyMat);
    const mx = Math.cos(angle) * armRadius;
    const mz = Math.sin(angle) * armRadius;
    motor.position.set(mx, 0.02, mz);
    group.add(motor);

    // Rotor prop blade
    const prop = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.008, 0.03), bladeMat);
    prop.position.set(mx, 0.06, mz);
    group.add(prop);

    // Navigation LED
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), ledMat);
    led.position.set(mx, -0.02, mz);
    group.add(led);
  });

  // Gimbal 4K camera sphere under belly
  const cam = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), cameraMat);
  cam.position.set(0, -0.07, 0.1);
  group.add(cam);

  return group;
}

// ---------------------------------------------------------------------------------
// 17. 3D Cordless Power Drill
// ---------------------------------------------------------------------------------
export function createSolid3DDrill(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'PowerDrill';

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.35, metalness: 0.2 });
  const rubberMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.25 });

  // Main motor housing (horizontal)
  const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.34, 16), bodyMat);
  motor.rotation.z = Math.PI / 2;
  group.add(motor);

  // Chuck & Drill Bit
  const chuck = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.08, 0.12, 16), metalMat);
  chuck.rotation.z = Math.PI / 2;
  chuck.position.x = 0.23;
  group.add(chuck);

  const bit = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.015, 0.18, 8), metalMat);
  bit.rotation.z = Math.PI / 2;
  bit.position.x = 0.38;
  group.add(bit);

  // Ergonomic Grip Handle
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.32, 16), rubberMat);
  handle.rotation.z = -0.15;
  handle.position.set(-0.02, -0.2, 0);
  group.add(handle);

  // Battery Base Pack
  const battery = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.14), rubberMat);
  battery.position.set(-0.04, -0.38, 0);
  group.add(battery);

  // Red Trigger
  const triggerMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
  const trigger = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.06, 0.03), triggerMat);
  trigger.position.set(0.06, -0.12, 0);
  group.add(trigger);

  return group;
}

// ---------------------------------------------------------------------------------
// 18. 3D Studio Condenser Microphone
// ---------------------------------------------------------------------------------
export function createSolid3DMicrophone(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Microphone';

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.3, metalness: 0.8 });
  const goldGrilleMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.25 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.15 });

  // Lower cylindrical body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.28, 24), bodyMat);
  group.add(body);

  // Gold Mesh Capsule (upper)
  const capsule = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.22, 24), goldGrilleMat);
  capsule.position.y = 0.24;
  group.add(capsule);

  // Dome cap
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), goldGrilleMat);
  dome.position.y = 0.35;
  group.add(dome);

  // Metal shockmount ring
  const mountRing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.015, 12, 24), chromeMat);
  mountRing.position.y = 0.05;
  group.add(mountRing);

  return group;
}

// ---------------------------------------------------------------------------------
// 19. 3D Camping Enamel Mug
// ---------------------------------------------------------------------------------
export function createSolid3DCoffeeMug(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'CampingMug';

  const enamelMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.15, metalness: 0.1 });
  const rimMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.25, metalness: 0.6 });

  // Mug cup body
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.095, 0.24, 24), enamelMat);
  group.add(cup);

  // Blue enamel rim line
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.008, 8, 24), rimMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.12;
  group.add(rim);

  // Handle
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.015, 8, 16, Math.PI), enamelMat);
  handle.rotation.z = -Math.PI / 2;
  handle.position.set(0.13, 0, 0);
  group.add(handle);

  return group;
}

// ---------------------------------------------------------------------------------
// 20. 3D Outdoor Compact Binoculars
// ---------------------------------------------------------------------------------
export function createSolid3DBinoculars(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Binoculars';

  const rubberMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.7 });
  const lensMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9, roughness: 0.1 });
  const dialMat = new THREE.MeshStandardMaterial({ color: 0x71717a, metalness: 0.8, roughness: 0.3 });

  // Left & Right Barrels
  [-0.09, 0.09].forEach((x) => {
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.08, 0.34, 20), rubberMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.x = x;
    group.add(barrel);

    // Objective lens (front)
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.072, 20), lensMat);
    lens.position.set(x, 0, 0.172);
    group.add(lens);

    // Eyepiece ring (rear)
    const eyeRing = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 8, 16), rubberMat);
    eyeRing.position.set(x, 0, -0.17);
    group.add(eyeRing);
  });

  // Center hinge bridge & focus wheel
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.14), rubberMat);
  const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 16), dialMat);
  wheel.position.set(0, 0.03, -0.04);
  group.add(bridge, wheel);

  return group;
}

// ---------------------------------------------------------------------------------
// 21. 3D Virtual Reality Headset (VR Visor & Straps)
// ---------------------------------------------------------------------------------
export function createSolid3DHeadsetVR(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'VRHeadset';

  const visorMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.1 });
  const faceMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.85 });
  const lensMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 });
  const strapMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });

  // Main Visor curved housing
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.18, 0.22), visorMat);
  group.add(visor);

  // Black front glass display plate
  const frontPlate = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.16, 0.02), faceMat);
  frontPlate.position.set(0, 0, 0.112);
  group.add(frontPlate);

  // Optical sensor camera dots
  [-0.14, 0.14].forEach((x) => {
    [-0.05, 0.05].forEach((y) => {
      const cam = new THREE.Mesh(new THREE.CircleGeometry(0.012, 12), lensMat);
      cam.position.set(x, y, 0.124);
      group.add(cam);
    });
  });

  // Foam facial cushion interface
  const foam = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.16, 0.06), faceMat);
  foam.position.set(0, 0, -0.13);
  group.add(foam);

  // Head straps extending back
  const sideStrapL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.05, 0.26), strapMat);
  sideStrapL.position.set(-0.17, 0, -0.22);
  const sideStrapR = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.05, 0.26), strapMat);
  sideStrapR.position.set(0.17, 0, -0.22);
  const topStrap = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.015, 0.24), strapMat);
  topStrap.position.set(0, 0.09, -0.2);
  group.add(sideStrapL, sideStrapR, topStrap);

  return group;
}

// ---------------------------------------------------------------------------------
// 22. 3D Street Cruiser Skateboard
// ---------------------------------------------------------------------------------
export function createSolid3DSkateboard(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Skateboard';

  const woodMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });
  const gripMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.95 });
  const truckMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.4 });

  // Wooden deck plate
  const deck = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.025, 0.68), woodMat);
  group.add(deck);

  // Black grip tape top
  const grip = new THREE.Mesh(new THREE.PlaneGeometry(0.19, 0.67), gripMat);
  grip.rotation.x = -Math.PI / 2;
  grip.position.y = 0.014;
  group.add(grip);

  // Kicktails (nose & tail upward angle)
  [-0.34, 0.34].forEach((z, i) => {
    const kick = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.022, 0.12), woodMat);
    kick.position.set(0, 0.025, z);
    kick.rotation.x = i === 0 ? -0.25 : 0.25;
    group.add(kick);
  });

  // Trucks and 4 Wheels
  [-0.18, 0.18].forEach((z) => {
    const truck = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.03, 0.04), truckMat);
    truck.position.set(0, -0.03, z);
    group.add(truck);

    [-0.11, 0.11].forEach((x) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.045, 16), wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, -0.045, z);
      group.add(wheel);
    });
  });

  return group;
}

// ---------------------------------------------------------------------------------
// 23. 3D Vintage LED Camping Lantern
// ---------------------------------------------------------------------------------
export function createSolid3DLantern(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'CampingLantern';

  const metalMat = new THREE.MeshStandardMaterial({ color: 0x1e3a2f, roughness: 0.4, metalness: 0.6 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, roughness: 0.1 });
  const filamentMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 1.5 });
  const handleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 });

  // Base tier
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.12, 24), metalMat);
  base.position.y = -0.18;
  group.add(base);

  // Clear glass cylinder mantle
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.24, 24), glassMat);
  group.add(glass);

  // Glowing warm LED filament rod
  const filament = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.18, 12), filamentMat);
  group.add(filament);

  // Top metal canopy cap
  const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.08, 24), metalMat);
  topCap.position.y = 0.16;
  const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.08, 16), metalMat);
  chimney.position.y = 0.22;
  group.add(topCap, chimney);

  // Wire bail handle
  const bail = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.012, 8, 24, Math.PI), handleMat);
  bail.position.y = 0.22;
  group.add(bail);

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
