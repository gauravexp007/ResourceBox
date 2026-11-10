import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  createSolid3DHeadphones,
  createSolid3DLaptop,
  createSolid3DCamera,
  createSolid3DAirPods,
  createSolid3DGuitar,
  createSolid3DKeyboard,
  createSolid3DSneaker,
  createSolid3DPlant,
  createSolid3DGamepad,
  createSolid3DSmartwatch,
  createSolid3DFlask,
  createSolid3DBooks,
} from './Procedural3DModels';
import { Sparkles, Eye, EyeOff } from 'lucide-react';

interface FloatingObjectDescriptor {
  id: string;
  name: string;
  createModel: () => THREE.Group;
  // World space base coordinates
  baseX: number;
  baseY: number;
  baseZ: number;
  scale: number;
  // Parallax & motion factors
  scrollFactor: number;
  bobSpeed: number;
  bobAmp: number;
  swayAmp: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  initialRotX: number;
  initialRotY: number;
  initialRotZ: number;
  phase: number;
  // For infinite vertical wrapping across long pages
  wrapRange: number;
  group?: THREE.Group;
}

export const ScrollParallax3DBackground: React.FC = () => {
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    // Respect user's system accessibility setting for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setMotionEnabled(false);
    }
  }, []);

  useEffect(() => {
    const bgCanvas = bgCanvasRef.current;
    const fgCanvas = fgCanvasRef.current;
    if (!bgCanvas || !fgCanvas) return;

    let isDisposed = false;
    let animationFrameId: number;

    // Detect WebGL capability safely
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) return;
    } catch {
      return;
    }

    // -------------------------------------------------------------
    // SCENE, CAMERA & RENDERER SETUP (BACKGROUND & FOREGROUND)
    // -------------------------------------------------------------
    const getViewportAspect = () => window.innerWidth / Math.max(window.innerHeight, 1);

    // 1. Background Renderer & Scene (behind cards & text at z-0)
    const bgScene = new THREE.Scene();
    const bgCamera = new THREE.PerspectiveCamera(45, getViewportAspect(), 0.1, 100);
    bgCamera.position.set(0, 0, 10);

    const bgRenderer = new THREE.WebGLRenderer({
      canvas: bgCanvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    bgRenderer.setSize(window.innerWidth, window.innerHeight);
    bgRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    bgRenderer.toneMappingExposure = 1.05;

    // 2. Foreground Renderer & Scene (subtle accent floaters at z-20)
    const fgScene = new THREE.Scene();
    const fgCamera = new THREE.PerspectiveCamera(45, getViewportAspect(), 0.1, 50);
    fgCamera.position.set(0, 0, 10);

    const fgRenderer = new THREE.WebGLRenderer({
      canvas: fgCanvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    fgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    fgRenderer.setSize(window.innerWidth, window.innerHeight);
    fgRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    fgRenderer.toneMappingExposure = 1.0;

    // -------------------------------------------------------------
    // LIGHTING RIG
    // -------------------------------------------------------------
    const setupLighting = (targetScene: THREE.Scene, isForeground = false) => {
      // Soft balanced ambient
      const ambientLight = new THREE.AmbientLight(0xffffff, isForeground ? 0.9 : 0.85);
      targetScene.add(ambientLight);

      // Warm primary directional key light
      const keyLight = new THREE.DirectionalLight(0xfff8ee, isForeground ? 1.4 : 1.3);
      keyLight.position.set(6, 8, 7);
      targetScene.add(keyLight);

      // Community Forest/Mint bounce fill light
      const fillLight = new THREE.DirectionalLight(0xd1fae5, isForeground ? 0.8 : 0.7);
      fillLight.position.set(-7, -4, 4);
      targetScene.add(fillLight);

      // Delicate top rim light for crisp specular edges
      const rimLight = new THREE.DirectionalLight(0xe0e7ff, 0.5);
      rimLight.position.set(0, 6, -5);
      targetScene.add(rimLight);
    };

    setupLighting(bgScene, false);
    setupLighting(fgScene, true);

    // -------------------------------------------------------------
    // OBJECT LAYOUTS: DEEP/MID PLANES & SUBTLE FOREGROUND ACCENTS
    // -------------------------------------------------------------
    // Width factor to adjust positions for mobile vs desktop
    const isMobile = window.innerWidth < 768;
    const spreadX = isMobile ? 0.65 : 1.0;

    // Background floating objects (sitting at z: -2.5 to -11)
    // Distributed vertically to create a rich journey as user scrolls
    const bgDescriptors: FloatingObjectDescriptor[] = [
      // Section 1: Hero top area
      {
        id: 'bg-headphones',
        name: 'Headphones',
        createModel: createSolid3DHeadphones,
        baseX: -3.8 * spreadX,
        baseY: 2.2,
        baseZ: -3.0,
        scale: 0.9,
        scrollFactor: 0.0035,
        bobSpeed: 1.1,
        bobAmp: 0.18,
        swayAmp: 0.12,
        rotSpeedX: 0.25,
        rotSpeedY: 0.35,
        rotSpeedZ: 0.15,
        initialRotX: 0.2,
        initialRotY: 0.6,
        initialRotZ: 0.1,
        phase: 0.2,
        wrapRange: 16,
      },
      {
        id: 'bg-laptop',
        name: 'Laptop',
        createModel: createSolid3DLaptop,
        baseX: 3.9 * spreadX,
        baseY: 1.6,
        baseZ: -4.5,
        scale: 0.75,
        scrollFactor: 0.0028,
        bobSpeed: 0.95,
        bobAmp: 0.15,
        swayAmp: 0.1,
        rotSpeedX: 0.18,
        rotSpeedY: -0.28,
        rotSpeedZ: 0.12,
        initialRotX: 0.3,
        initialRotY: -0.8,
        initialRotZ: -0.15,
        phase: 1.4,
        wrapRange: 16,
      },
      {
        id: 'bg-keyboard',
        name: 'Mechanical Keyboard',
        createModel: createSolid3DKeyboard,
        baseX: -4.2 * spreadX,
        baseY: -1.2,
        baseZ: -5.5,
        scale: 0.8,
        scrollFactor: 0.0025,
        bobSpeed: 0.8,
        bobAmp: 0.16,
        swayAmp: 0.09,
        rotSpeedX: 0.15,
        rotSpeedY: 0.22,
        rotSpeedZ: 0.1,
        initialRotX: 0.1,
        initialRotY: 0.5,
        initialRotZ: 0.05,
        phase: 2.8,
        wrapRange: 16,
      },
      {
        id: 'bg-camera',
        name: 'Camera',
        createModel: createSolid3DCamera,
        baseX: 4.1 * spreadX,
        baseY: -2.0,
        baseZ: -3.8,
        scale: 0.75,
        scrollFactor: 0.0032,
        bobSpeed: 1.25,
        bobAmp: 0.2,
        swayAmp: 0.14,
        rotSpeedX: 0.22,
        rotSpeedY: 0.4,
        rotSpeedZ: -0.18,
        initialRotX: -0.2,
        initialRotY: 0.4,
        initialRotZ: 0.2,
        phase: 3.5,
        wrapRange: 16,
      },
      // Section 2: Catalog & Filter middle area
      {
        id: 'bg-guitar',
        name: 'Acoustic Guitar',
        createModel: createSolid3DGuitar,
        baseX: -3.9 * spreadX,
        baseY: -5.0,
        baseZ: -4.0,
        scale: 0.85,
        scrollFactor: 0.003,
        bobSpeed: 0.85,
        bobAmp: 0.16,
        swayAmp: 0.1,
        rotSpeedX: 0.2,
        rotSpeedY: -0.25,
        rotSpeedZ: 0.3,
        initialRotX: 0.4,
        initialRotY: 0.7,
        initialRotZ: 0.6,
        phase: 4.2,
        wrapRange: 16,
      },
      {
        id: 'bg-plant',
        name: 'Desk Succulent Plant',
        createModel: createSolid3DPlant,
        baseX: 3.8 * spreadX,
        baseY: -5.5,
        baseZ: -3.2,
        scale: 0.85,
        scrollFactor: 0.0034,
        bobSpeed: 1.05,
        bobAmp: 0.18,
        swayAmp: 0.12,
        rotSpeedX: 0.15,
        rotSpeedY: 0.3,
        rotSpeedZ: -0.12,
        initialRotX: 0.1,
        initialRotY: -0.4,
        initialRotZ: 0.1,
        phase: 5.1,
        wrapRange: 16,
      },
      {
        id: 'bg-sneaker',
        name: 'Streetwear Sneaker',
        createModel: createSolid3DSneaker,
        baseX: -4.0 * spreadX,
        baseY: -8.2,
        baseZ: -3.5,
        scale: 0.85,
        scrollFactor: 0.0033,
        bobSpeed: 1.15,
        bobAmp: 0.17,
        swayAmp: 0.11,
        rotSpeedX: -0.25,
        rotSpeedY: 0.35,
        rotSpeedZ: 0.2,
        initialRotX: 0.35,
        initialRotY: 0.2,
        initialRotZ: -0.3,
        phase: 1.9,
        wrapRange: 16,
      },
      {
        id: 'bg-gamepad',
        name: 'Gaming Controller',
        createModel: createSolid3DGamepad,
        baseX: 4.0 * spreadX,
        baseY: -8.8,
        baseZ: -4.2,
        scale: 0.8,
        scrollFactor: 0.0029,
        bobSpeed: 1.3,
        bobAmp: 0.2,
        swayAmp: 0.13,
        rotSpeedX: 0.28,
        rotSpeedY: -0.32,
        rotSpeedZ: 0.18,
        initialRotX: -0.2,
        initialRotY: 0.5,
        initialRotZ: 0.15,
        phase: 0.7,
        wrapRange: 16,
      },
      // Section 3: Deep lower area
      {
        id: 'bg-smartwatch',
        name: 'Smartwatch',
        createModel: createSolid3DSmartwatch,
        baseX: -3.7 * spreadX,
        baseY: -12.0,
        baseZ: -3.0,
        scale: 0.9,
        scrollFactor: 0.0036,
        bobSpeed: 1.2,
        bobAmp: 0.15,
        swayAmp: 0.1,
        rotSpeedX: 0.3,
        rotSpeedY: 0.45,
        rotSpeedZ: 0.15,
        initialRotX: 0.3,
        initialRotY: -0.6,
        initialRotZ: 0.2,
        phase: 2.3,
        wrapRange: 16,
      },
      {
        id: 'bg-flask',
        name: 'Thermal Flask',
        createModel: createSolid3DFlask,
        baseX: 3.9 * spreadX,
        baseY: -12.4,
        baseZ: -3.6,
        scale: 0.85,
        scrollFactor: 0.0031,
        bobSpeed: 0.9,
        bobAmp: 0.18,
        swayAmp: 0.08,
        rotSpeedX: 0.2,
        rotSpeedY: -0.28,
        rotSpeedZ: -0.25,
        initialRotX: 0.4,
        initialRotY: 0.3,
        initialRotZ: 0.35,
        phase: 3.9,
        wrapRange: 16,
      },
      {
        id: 'bg-books',
        name: 'Design Books Stack',
        createModel: createSolid3DBooks,
        baseX: 0.0,
        baseY: -14.2,
        baseZ: -6.0,
        scale: 0.7,
        scrollFactor: 0.0022,
        bobSpeed: 0.7,
        bobAmp: 0.12,
        swayAmp: 0.07,
        rotSpeedX: 0.12,
        rotSpeedY: 0.2,
        rotSpeedZ: 0.08,
        initialRotX: 0.2,
        initialRotY: 0.4,
        initialRotZ: 0.0,
        phase: 4.8,
        wrapRange: 16,
      },
    ];

    // Foreground floating accents (z: +1.2 to +2.4)
    // Sits in front of section backgrounds, but strictly hugging outer screen margins/gutters
    // with subtle scale and soft lighting so they never obstruct text or click targets
    const fgDescriptors: FloatingObjectDescriptor[] = [
      {
        id: 'fg-airpods',
        name: 'AirPods Earbuds',
        createModel: createSolid3DAirPods,
        baseX: 4.5 * spreadX,
        baseY: 2.8,
        baseZ: 1.5,
        scale: 0.65,
        scrollFactor: 0.0055,
        bobSpeed: 1.4,
        bobAmp: 0.22,
        swayAmp: 0.14,
        rotSpeedX: 0.35,
        rotSpeedY: 0.48,
        rotSpeedZ: 0.25,
        initialRotX: 0.3,
        initialRotY: -0.5,
        initialRotZ: 0.2,
        phase: 0.5,
        wrapRange: 16,
      },
      {
        id: 'fg-headphones-accent',
        name: 'Mini Headphones',
        createModel: createSolid3DHeadphones,
        baseX: -4.6 * spreadX,
        baseY: -3.5,
        baseZ: 1.8,
        scale: 0.55,
        scrollFactor: 0.0058,
        bobSpeed: 1.3,
        bobAmp: 0.24,
        swayAmp: 0.16,
        rotSpeedX: -0.3,
        rotSpeedY: 0.42,
        rotSpeedZ: 0.22,
        initialRotX: 0.4,
        initialRotY: 0.8,
        initialRotZ: -0.2,
        phase: 2.1,
        wrapRange: 16,
      },
      {
        id: 'fg-camera-accent',
        name: 'Accent Camera',
        createModel: createSolid3DCamera,
        baseX: 4.7 * spreadX,
        baseY: -10.0,
        baseZ: 1.6,
        scale: 0.52,
        scrollFactor: 0.0052,
        bobSpeed: 1.25,
        bobAmp: 0.2,
        swayAmp: 0.15,
        rotSpeedX: 0.28,
        rotSpeedY: -0.38,
        rotSpeedZ: 0.18,
        initialRotX: -0.25,
        initialRotY: 0.35,
        initialRotZ: 0.15,
        phase: 3.7,
        wrapRange: 16,
      },
    ];

    // Instantiate and add to respective scenes
    const allMeshes: THREE.Object3D[] = [];

    const instantiateDescriptors = (descriptors: FloatingObjectDescriptor[], scene: THREE.Scene) => {
      descriptors.forEach((d) => {
        try {
          const model = d.createModel();
          model.position.set(d.baseX, d.baseY, d.baseZ);
          model.rotation.set(d.initialRotX, d.initialRotY, d.initialRotZ);
          model.scale.set(d.scale, d.scale, d.scale);
          scene.add(model);
          d.group = model;
          allMeshes.push(model);
        } catch (err) {
          console.warn(`Error generating 3D model ${d.name}:`, err);
        }
      });
    };

    instantiateDescriptors(bgDescriptors, bgScene);
    instantiateDescriptors(fgDescriptors, fgScene);

    // -------------------------------------------------------------
    // SCROLL & INTERACTIVE POINTER LISTENER
    // -------------------------------------------------------------
    let targetScrollY = window.scrollY;
    let smoothScrollY = window.scrollY;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let smoothVelocity = 0;

    let targetMouseX = 0;
    let targetMouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;

    const onScroll = () => {
      targetScrollY = window.scrollY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      targetMouseX = (clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });

    // Window Resize Handler
    const onResize = () => {
      const width = window.innerWidth;
      const height = Math.max(window.innerHeight, 1);
      const aspect = width / height;

      bgCamera.aspect = aspect;
      bgCamera.updateProjectionMatrix();
      bgRenderer.setSize(width, height);

      fgCamera.aspect = aspect;
      fgCamera.updateProjectionMatrix();
      fgRenderer.setSize(width, height);

      // Adjust peripheral spread for narrow screens
      const newSpread = width < 768 ? 0.65 : 1.0;
      bgDescriptors.forEach((d) => {
        if (d.group) {
          d.group.position.x = d.baseX * (newSpread / spreadX);
        }
      });
      fgDescriptors.forEach((d) => {
        if (d.group) {
          d.group.position.x = d.baseX * (newSpread / spreadX);
        }
      });
    };

    window.addEventListener('resize', onResize);

    // -------------------------------------------------------------
    // ANIMATION & PHYSICS LOOP
    // -------------------------------------------------------------
    const clock = new THREE.Clock();

    const animate = () => {
      if (isDisposed) return;
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Scroll damping & inertia
      const scrollDiff = targetScrollY - smoothScrollY;
      smoothScrollY += scrollDiff * 0.085;

      scrollVelocity = (targetScrollY - lastScrollY) / Math.max(delta, 0.016);
      lastScrollY = targetScrollY;
      smoothVelocity += (scrollVelocity - smoothVelocity) * 0.1;

      // Mouse tilt damping
      smoothMouseX += (targetMouseX - smoothMouseX) * 0.05;
      smoothMouseY += (targetMouseY - smoothMouseY) * 0.05;

      // Subtle camera parallax tilt
      bgCamera.position.x = smoothMouseX * 0.45;
      bgCamera.position.y = -smoothMouseY * 0.35;
      bgCamera.lookAt(0, 0, 0);

      fgCamera.position.x = smoothMouseX * 0.65;
      fgCamera.position.y = -smoothMouseY * 0.5;
      fgCamera.lookAt(0, 0, 0);

      // Update all floating objects
      const updateObjects = (descriptors: FloatingObjectDescriptor[]) => {
        descriptors.forEach((d) => {
          if (!d.group) return;

          // Parallax vertical movement
          // Objects follow user's scroll direction and speed with depth-based parallax
          const parallaxOffset = smoothScrollY * d.scrollFactor;

          // Wrap-around modulo math so items loop continuously across long pages
          const span = d.wrapRange;
          const halfSpan = span / 2;
          let calculatedY = d.baseY + parallaxOffset;
          // Continuous looping window centered around viewport
          calculatedY = ((((calculatedY + halfSpan) % span) + span) % span) - halfSpan;

          // Harmonic floating oscillation
          const bob = Math.sin(elapsedTime * d.bobSpeed + d.phase) * d.bobAmp;
          const sway = Math.cos(elapsedTime * (d.bobSpeed * 0.7) + d.phase) * d.swayAmp;

          d.group.position.y = calculatedY + bob;
          d.group.position.x = d.baseX + sway;

          // Scroll momentum reaction: scrolling fast pitches objects slightly in scroll direction
          const velocityPitch = Math.max(-0.4, Math.min(0.4, smoothVelocity * 0.00035));

          // Continuous multi-axis rotation
          d.group.rotation.x =
            d.initialRotX +
            Math.sin(elapsedTime * d.rotSpeedX + d.phase) * 0.35 +
            velocityPitch;
          d.group.rotation.y = d.initialRotY + elapsedTime * d.rotSpeedY;
          d.group.rotation.z =
            d.initialRotZ + Math.cos(elapsedTime * d.rotSpeedZ + d.phase) * 0.25;
        });
      };

      updateObjects(bgDescriptors);
      updateObjects(fgDescriptors);

      // Render both layers
      bgRenderer.render(bgScene, bgCamera);
      fgRenderer.render(fgScene, fgCamera);
    };

    animate();

    // -------------------------------------------------------------
    // CLEANUP & RESOURCE DISPOSAL
    // -------------------------------------------------------------
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('resize', onResize);

      // Recursively dispose geometries, materials, and textures
      const disposeObject = (obj: THREE.Object3D) => {
        if ((obj as THREE.Mesh).geometry) {
          (obj as THREE.Mesh).geometry.dispose();
        }
        if ((obj as THREE.Mesh).material) {
          const mat = (obj as THREE.Mesh).material;
          if (Array.isArray(mat)) {
            mat.forEach((m) => m.dispose());
          } else {
            mat.dispose();
          }
        }
        while (obj.children && obj.children.length > 0) {
          disposeObject(obj.children[0]);
          obj.remove(obj.children[0]);
        }
      };

      allMeshes.forEach((mesh) => disposeObject(mesh));
      bgRenderer.dispose();
      fgRenderer.dispose();
    };
  }, []);

  return (
    <>
      {/* BACKGROUND LAYER CANVAS: Sits behind all cards, bars, and text (z-0) */}
      <canvas
        ref={bgCanvasRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          width: '100vw',
          height: '100vh',
          opacity: motionEnabled ? 0.95 : 0.4,
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* FOREGROUND LAYER CANVAS: Sits in front of section backgrounds (z-20) 
          Strategically positioned at outer viewport margins with subtle opacity 
          so it creates immersive 3D depth without obstructing content or readability */}
      <canvas
        ref={fgCanvasRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          width: '100vw',
          height: '100vh',
          opacity: motionEnabled ? 0.85 : 0.3,
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* SUBTLE FLOATING 3D ENVIRONMENT BADGE / CONTROLLER (BOTTOM-LEFT) */}
      <div className="fixed bottom-5 left-5 z-40 hidden sm:flex items-center gap-2">
        <button
          onClick={() => setMotionEnabled((prev) => !prev)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all shadow-sm border ${
            motionEnabled
              ? 'bg-white/80 hover:bg-white text-[#2D6A4F] border-[#2D6A4F]/20'
              : 'bg-stone-100/80 hover:bg-stone-100 text-stone-600 border-stone-200'
          }`}
          title={motionEnabled ? 'Pause floating 3D accessories' : 'Resume floating 3D accessories'}
        >
          <Sparkles className={`w-3.5 h-3.5 ${motionEnabled ? 'text-[#2D6A4F] animate-pulse' : 'text-stone-400'}`} />
          <span>3D Floating Depth</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        </button>
      </div>
    </>
  );
};
