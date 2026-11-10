import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface AuthModal3DSceneProps {
  mode: 'signin' | 'signup';
}

export const AuthModal3DScene: React.FC<AuthModal3DSceneProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 580;

    // 1. Scene & Camera (Isometric perspective matching Awsmd / Izmahsa 3D design)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06140d, 0.05);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(2.8, 2.2, 4.4);
    camera.lookAt(0, 0.1, 0);

    // 2. High-performance WebGL Renderer with Antialiasing
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // 3. Studio Clay/Glossy Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xdcfce7, 1.4);
    scene.add(ambientLight);

    // Key Light: Crisp warm studio light
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    // Fill Light: Soft mint/emerald illumination
    const fillLight = new THREE.DirectionalLight(0x86efac, 2.0);
    fillLight.position.set(-5, -2, -3);
    scene.add(fillLight);

    // Accent Light: Violet/Lilac glow (homage to Awsmd's signature palette)
    const accentLight = new THREE.DirectionalLight(0xa78bfa, 2.2);
    accentLight.position.set(-2, 4, 3);
    scene.add(accentLight);

    // Point Glow Light inside the scene
    const corePointLight = new THREE.PointLight(0x34d399, 3.0, 6);
    corePointLight.position.set(0, 0.8, 0);
    scene.add(corePointLight);

    // 4. Main 3D Composition Group
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    // --- MATERIALS (Smooth clay, frosted glass & subtle metallic sheen) ---
    // Deep emerald box body
    const boxBodyMat = new THREE.MeshStandardMaterial({
      color: 0x1a4329,
      roughness: 0.22,
      metalness: 0.12,
      emissive: 0x0c2416,
      emissiveIntensity: 0.4,
    });

    // Mint flap material
    const flapMat = new THREE.MeshStandardMaterial({
      color: 0x9b7ebd,
      roughness: 0.18,
      metalness: 0.15,
      emissive: 0x164833,
      emissiveIntensity: 0.35,
    });

    // Lilac/Purple clay material (Awsmd signature element)
    const lilacMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      roughness: 0.2,
      metalness: 0.2,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.35,
    });

    // Warm Gold/Amber metallic clay material
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.15,
      metalness: 0.65,
      emissive: 0xb45309,
      emissiveIntensity: 0.3,
    });

    // Glowing Mint Core Material
    const glowingCoreMat = new THREE.MeshStandardMaterial({
      color: 0xdcfce7,
      roughness: 0.08,
      metalness: 0.05,
      emissive: 0x34d399,
      emissiveIntensity: 0.7,
    });

    // Soft Matte Peach/White Material
    const peachMat = new THREE.MeshStandardMaterial({
      color: 0xfde68a,
      roughness: 0.25,
      metalness: 0.1,
    });

    // --- 3D PEDESTAL / BASE PLATFORM (Smooth isometric floor) ---
    const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.7, 0.12, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x0f2d1e,
      roughness: 0.35,
      metalness: 0.2,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.95;
    stageGroup.add(pedestal);

    // Glowing rim ring on pedestal
    const pedestalRingGeo = new THREE.TorusGeometry(1.68, 0.025, 16, 64);
    const pedestalRingMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.65,
    });
    const pedestalRing = new THREE.Mesh(pedestalRingGeo, pedestalRingMat);
    pedestalRing.rotation.x = Math.PI / 2;
    pedestalRing.position.y = -0.9;
    stageGroup.add(pedestalRing);

    // --- CENTRAL FLOATING 3D BOX (ResourceBox) ---
    const boxGroup = new THREE.Group();
    stageGroup.add(boxGroup);

    // Main Box Cuboid
    const boxBodyGeo = new THREE.BoxGeometry(1.3, 1.05, 1.3);
    const boxBody = new THREE.Mesh(boxBodyGeo, boxBodyMat);
    boxGroup.add(boxBody);

    // Box Edge Wireframes
    const boxEdgesGeo = new THREE.EdgesGeometry(boxBodyGeo);
    const boxEdgesMat = new THREE.LineBasicMaterial({
      color: 0xa7f3d0,
      transparent: true,
      opacity: 0.75,
      linewidth: 2,
    });
    const boxEdges = new THREE.LineSegments(boxEdgesGeo, boxEdgesMat);
    boxGroup.add(boxEdges);

    // 4 Open Flaps (Angled outward like a package awaiting exchange)
    const flapWidth = 1.26;
    const flapDepth = 0.44;
    const flapGeo = new THREE.BoxGeometry(flapWidth, 0.045, flapDepth);

    // Front Flap
    const flapFront = new THREE.Mesh(flapGeo, flapMat);
    flapFront.position.set(0, 0.52, 0.65 + flapDepth * 0.4);
    flapFront.rotation.x = Math.PI * 0.26;
    boxGroup.add(flapFront);

    // Back Flap
    const flapBack = new THREE.Mesh(flapGeo, flapMat);
    flapBack.position.set(0, 0.52, -(0.65 + flapDepth * 0.4));
    flapBack.rotation.x = -Math.PI * 0.26;
    boxGroup.add(flapBack);

    // Left/Right Side Flaps
    const sideFlapGeo = new THREE.BoxGeometry(flapDepth, 0.045, flapWidth);
    const flapLeft = new THREE.Mesh(sideFlapGeo, flapMat);
    flapLeft.position.set(-(0.65 + flapDepth * 0.4), 0.52, 0);
    flapLeft.rotation.z = Math.PI * 0.26;
    boxGroup.add(flapLeft);

    const flapRight = new THREE.Mesh(sideFlapGeo, flapMat);
    flapRight.position.set(0.65 + flapDepth * 0.4, 0.52, 0);
    flapRight.rotation.z = -Math.PI * 0.26;
    boxGroup.add(flapRight);

    // Inner Glowing Resource Core (Octahedron crystal)
    const coreCrystalGeo = new THREE.OctahedronGeometry(0.36, 0);
    const coreCrystal = new THREE.Mesh(coreCrystalGeo, glowingCoreMat);
    coreCrystal.position.set(0, 0.55, 0);
    boxGroup.add(coreCrystal);

    // --- FLOATING 3D COMPANION SHAPES (Awsmd / Izmahsa Clay & Motion Elements) ---
    // 1. Lilac Glossy Sphere
    const lilacSphereGeo = new THREE.SphereGeometry(0.24, 32, 32);
    const lilacSphere = new THREE.Mesh(lilacSphereGeo, lilacMat);
    stageGroup.add(lilacSphere);

    // 2. Gold Metallic Octahedron Token
    const goldStarGeo = new THREE.OctahedronGeometry(0.22, 0);
    const goldStar = new THREE.Mesh(goldStarGeo, goldMat);
    stageGroup.add(goldStar);

    // 3. Floating Torus / Donut Ring
    const torusGeo = new THREE.TorusGeometry(0.3, 0.065, 20, 36);
    const torus = new THREE.Mesh(torusGeo, lilacMat);
    stageGroup.add(torus);

    // 4. Soft Peach Pill Capsule
    const pillGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.38, 24);
    const pill = new THREE.Mesh(pillGeo, peachMat);
    stageGroup.add(pill);

    // 5. Small Mint Floating Cube
    const miniCubeGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
    const miniCube = new THREE.Mesh(miniCubeGeo, glowingCoreMat);
    stageGroup.add(miniCube);

    // 6. Ambient Stardust Particles
    const particleCount = 36;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 5.0;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 4.5 + 0.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x86efac,
      size: 0.05,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleField = new THREE.Points(particleGeo, particleMat);
    scene.add(particleField);

    // Animation Loop Variables
    let reqId: number;
    let clock = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      clock += 0.016;

      // Mouse Parallax Lerping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      // Gentle interactive tilt on the entire stage
      stageGroup.rotation.y = THREE.MathUtils.lerp(stageGroup.rotation.y, mouseRef.current.x * 0.35, 0.06);
      stageGroup.rotation.x = THREE.MathUtils.lerp(stageGroup.rotation.x, -mouseRef.current.y * 0.25, 0.06);

      // Central Box Levitation & Slow Ambient Rotation
      boxGroup.position.y = Math.sin(clock * 1.5) * 0.08 + 0.1;
      boxGroup.rotation.y = Math.sin(clock * 0.6) * 0.15;

      // Crystal Core spinning & breathing glow
      coreCrystal.rotation.y += 0.025;
      coreCrystal.rotation.x += 0.012;
      coreCrystal.position.y = 0.55 + Math.sin(clock * 2.8) * 0.05;
      corePointLight.intensity = 2.8 + Math.sin(clock * 3.0) * 0.8;

      // 1. Lilac Sphere Motion (Orbiting right-front)
      lilacSphere.position.x = 1.35 + Math.sin(clock * 1.1) * 0.15;
      lilacSphere.position.y = 0.45 + Math.cos(clock * 1.6) * 0.18;
      lilacSphere.position.z = 0.7 + Math.sin(clock * 1.4) * 0.12;

      // 2. Gold Star Motion (Orbiting left-back)
      goldStar.position.x = -1.3 + Math.cos(clock * 1.3) * 0.16;
      goldStar.position.y = 0.75 + Math.sin(clock * 1.8) * 0.18;
      goldStar.position.z = -0.4 + Math.sin(clock * 1.2) * 0.15;
      goldStar.rotation.y += 0.03;
      goldStar.rotation.x += 0.02;

      // 3. Torus Ring Motion (Tilted spinning halo floating above right flap)
      torus.position.x = 0.95 + Math.cos(clock * 0.9) * 0.14;
      torus.position.y = 1.1 + Math.sin(clock * 1.3) * 0.15;
      torus.position.z = -0.3 + Math.sin(clock * 1.1) * 0.1;
      torus.rotation.x = clock * 1.2;
      torus.rotation.y = clock * 0.8;

      // 4. Peach Pill Capsule Motion (Floating left-front)
      pill.position.x = -1.15 + Math.sin(clock * 1.4) * 0.12;
      pill.position.y = -0.15 + Math.cos(clock * 1.7) * 0.14;
      pill.position.z = 0.85 + Math.sin(clock * 1.0) * 0.12;
      pill.rotation.z = Math.PI / 4 + Math.sin(clock * 1.5) * 0.2;
      pill.rotation.y = clock * 0.9;

      // 5. Mini Mint Cube Motion (Floating top-center)
      miniCube.position.x = Math.sin(clock * 1.6) * 0.2;
      miniCube.position.y = 1.45 + Math.sin(clock * 2.1) * 0.12;
      miniCube.position.z = Math.cos(clock * 1.6) * 0.2;
      miniCube.rotation.y += 0.025;
      miniCube.rotation.x += 0.015;

      // Stardust particle rotation
      particleField.rotation.y = clock * 0.025;

      renderer.render(scene, camera);
    };

    animate();

    // Responsive Canvas Resizing
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
      pedestalGeo.dispose();
      pedestalRingGeo.dispose();
      boxBodyGeo.dispose();
      boxEdgesGeo.dispose();
      flapGeo.dispose();
      sideFlapGeo.dispose();
      coreCrystalGeo.dispose();
      lilacSphereGeo.dispose();
      goldStarGeo.dispose();
      torusGeo.dispose();
      pillGeo.dispose();
      miniCubeGeo.dispose();
      particleGeo.dispose();
      boxBodyMat.dispose();
      flapMat.dispose();
      lilacMat.dispose();
      goldMat.dispose();
      glowingCoreMat.dispose();
      peachMat.dispose();
      pedestalMat.dispose();
      pedestalRingMat.dispose();
      boxEdgesMat.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseRef.current.targetX = x;
    mouseRef.current.targetY = y;
  };

  const handleMouseLeave = () => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[260px] md:min-h-[580px] bg-gradient-to-br from-[#06150e] via-[#0b2418] to-[#040e09] flex items-center justify-center overflow-hidden select-none border-b md:border-b-0 md:border-r border-[#1B422D]/60"
    >
      {/* Signature Atmospheric Backdrop Glowing Orbs */}
      <div className="absolute top-10 -left-10 w-72 h-72 rounded-full bg-[#8B5CF6]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-10 w-72 h-72 rounded-full bg-[#10B981]/18 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#34D399]/10 blur-3xl pointer-events-none" />

      {/* Subtle Geometric Wire Grid Accent */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#34D399 1px, transparent 1px), linear-gradient(90deg, #34D399 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* Interactive 3D WebGL Canvas */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-grab active:cursor-grabbing"
          title="3D Animated Login Scene"
        />
      </div>
    </div>
  );
};
