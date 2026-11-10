import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, ZoomIn, ZoomOut, Play, Pause, Move3D } from 'lucide-react';
import { Item } from '../types';
import {
  createSolid3DCamera,
  createSolid3DGuitar,
  createSolid3DHeadphones,
  createSolid3DLaptop,
  createSolid3DPS5,
  createSolid3DKeyboard,
  createSolid3DSneaker,
  createSolid3DBooks,
  createSolid3DGamepad,
  createSolid3DSmartwatch,
  createSolid3DPlant,
  createSolid3DAirPods,
  createSolid3DFlask,
  createSolid3DCardboardBox,
} from './3d/Procedural3DModels';

interface InteractiveProduct3DViewerProps {
  item: Item;
  className?: string;
}

export const InteractiveProduct3DViewer: React.FC<InteractiveProduct3DViewerProps> = ({
  item,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const autoRotateRef = useRef(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const zoomLevelRef = useRef(1);

  // Interaction tracking
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    zoomLevelRef.current = zoomLevel;
    if (cameraRef.current) {
      cameraRef.current.position.z = 4.2 / zoomLevel;
    }
  }, [zoomLevel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(0, 0.5, 4.2 / zoomLevelRef.current);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x86efac, 1.4);
    fillLight.position.set(-5, 2, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xa7f3d0, 1.8);
    rimLight.position.set(0, -4, 4);
    scene.add(rimLight);

    // 5. Select & Mount 3D Model matching Item
    const text = `${item.title} ${item.category} ${item.description || ''}`.toLowerCase();
    let model: THREE.Group;

    if (text.includes('guitar') || text.includes('acoustic') || text.includes('string')) {
      model = createSolid3DGuitar();
    } else if (text.includes('camera') || text.includes('lens') || text.includes('dslr') || text.includes('photo')) {
      model = createSolid3DCamera();
    } else if (text.includes('headphone') || text.includes('audio') || text.includes('music')) {
      model = createSolid3DHeadphones();
    } else if (text.includes('laptop') || text.includes('macbook') || text.includes('computer')) {
      model = createSolid3DLaptop();
    } else if (text.includes('ps5') || text.includes('playstation') || text.includes('console')) {
      model = createSolid3DPS5();
    } else if (text.includes('keyboard') || text.includes('piano') || text.includes('typing')) {
      model = createSolid3DKeyboard();
    } else if (text.includes('gamepad') || text.includes('controller') || text.includes('gaming')) {
      model = createSolid3DGamepad();
    } else if (text.includes('watch') || text.includes('smartwatch')) {
      model = createSolid3DSmartwatch();
    } else if (text.includes('plant') || text.includes('garden')) {
      model = createSolid3DPlant();
    } else if (text.includes('airpod') || text.includes('earbud')) {
      model = createSolid3DAirPods();
    } else if (text.includes('flask') || text.includes('bottle') || text.includes('camping')) {
      model = createSolid3DFlask();
    } else if (text.includes('sneaker') || text.includes('shoe')) {
      model = createSolid3DSneaker();
    } else if (text.includes('book') || text.includes('read')) {
      model = createSolid3DBooks();
    } else {
      model = createSolid3DCardboardBox();
    }

    // Centering and scaling
    const rootGroup = new THREE.Group();
    rootGroup.add(model);
    scene.add(rootGroup);
    modelGroupRef.current = rootGroup;

    // Gentle floor shadow ring
    const shadowGeo = new THREE.RingGeometry(0.1, 1.4, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x143524,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = Math.PI / 2;
    shadow.position.y = -1.25;
    scene.add(shadow);

    // Initial angles
    rootGroup.rotation.x = 0.2;
    rootGroup.rotation.y = -0.4;

    // Animation Loop
    let reqId: number;
    let clock = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      clock += 0.016;

      if (autoRotateRef.current && !isDraggingRef.current) {
        rootGroup.rotation.y += 0.008;
        rootGroup.position.y = Math.sin(clock * 1.5) * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight, false);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(reqId);
      resizeObserver.disconnect();
      shadowGeo.dispose();
      shadowMat.dispose();
      renderer.dispose();
    };
  }, [item]);

  // Mouse drag handlers for full 360° rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !modelGroupRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    modelGroupRef.current.rotation.y += deltaX * 0.01;
    modelGroupRef.current.rotation.x += deltaY * 0.01;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch drag handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!e.touches[0]) return;
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !modelGroupRef.current || !e.touches[0]) return;
    const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
    const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

    modelGroupRef.current.rotation.y += deltaX * 0.012;
    modelGroupRef.current.rotation.x += deltaY * 0.012;

    previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoomLevel((prev) => Math.min(2.0, Math.max(0.6, prev + zoomDelta)));
  };

  const resetView = () => {
    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.x = 0.2;
      modelGroupRef.current.rotation.y = -0.4;
      modelGroupRef.current.rotation.z = 0;
      modelGroupRef.current.position.y = 0;
    }
    setZoomLevel(1);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      className={`relative w-full aspect-[16/10] bg-gradient-to-br from-[#122B1E] via-[#0B2016] to-[#06150E] rounded-2xl overflow-hidden select-none border border-[#3B1E54]/40 shadow-inner group cursor-grab active:cursor-grabbing ${className}`}
    >
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#34D399]/15 blur-3xl pointer-events-none" />

      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Top Overlay Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-semibold shadow-xs pointer-events-none">
        <Move3D className="w-4 h-4 text-[#86EFAC]" />
        <span>Interactive 3D Model</span>
        <span className="text-[10px] text-[#A7F3D0] bg-white/10 px-2 py-0.5 rounded-full">Drag to rotate 360°</span>
      </div>

      {/* Bottom Floating Controls */}
      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 p-1.5 bg-black/70 backdrop-blur-md rounded-xl border border-white/15 text-white shadow-md">
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            autoRotate ? 'bg-[#3B1E54] text-white' : 'hover:bg-white/15 text-[#A7F3D0]'
          }`}
          title={autoRotate ? 'Pause 3D auto-spin' : 'Resume 3D auto-spin'}
        >
          {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.2))}
          className="p-2 rounded-lg hover:bg-white/15 text-[#A7F3D0] transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
          className="p-2 rounded-lg hover:bg-white/15 text-[#A7F3D0] transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={resetView}
          className="p-2 rounded-lg hover:bg-white/15 text-[#A7F3D0] transition-colors cursor-pointer"
          title="Reset 3D View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
