import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface InteractiveCubeLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showBadge?: boolean;
}

export const InteractiveCubeLogo: React.FC<InteractiveCubeLogoProps> = ({
  size = 'md',
  className = '',
  showBadge = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Pixel dimensions for canvas container
  const dim = size === 'sm' ? 36 : size === 'lg' ? 56 : 44;

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup with isometric 3D perspective
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(3.2, 2.7, 3.6);
    camera.lookAt(0, 0, 0);

    // 3. Renderer with antialiasing and transparent background
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(dim, dim, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Studio Lighting Rig for 3D realism
    const ambientLight = new THREE.AmbientLight(0xd4bee4, 1.4);
    scene.add(ambientLight);

    // Key Light (top-front-right)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(5, 6, 4.5);
    scene.add(keyLight);

    // Fill Light (left-back) - vibrant lavender purple
    const fillLight = new THREE.DirectionalLight(0x9b7ebd, 2.0);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);

    // Rim/Accent Light - soft lilac glow
    const rimLight = new THREE.PointLight(0xd4bee4, 2.2, 10);
    rimLight.position.set(0, 3, 2);
    scene.add(rimLight);

    // 5. Main 3D Cube Group
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    // Royal Purple & Lilac PBR Materials for distinct 3D faces (#3B1E54, #9B7EBD, #D4BEE4)
    const materials = [
      new THREE.MeshStandardMaterial({
        color: 0x9b7ebd, // Right (px) - medium purple
        roughness: 0.12,
        metalness: 0.15,
        emissive: 0x5c3882,
        emissiveIntensity: 0.28,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x8264a6, // Left (nx) - deep lavender
        roughness: 0.15,
        metalness: 0.1,
        emissive: 0x4a276e,
        emissiveIntensity: 0.22,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xd4bee4, // Top (py) - glowing soft lilac
        roughness: 0.08,
        metalness: 0.05,
        emissive: 0x9b7ebd,
        emissiveIntensity: 0.35,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x3b1e54, // Bottom (ny) - shaded deep royal purple
        roughness: 0.25,
        metalness: 0.15,
        emissive: 0x241038,
        emissiveIntensity: 0.2,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x9b7ebd, // Front (pz) - vibrant lavender purple
        roughness: 0.12,
        metalness: 0.12,
        emissive: 0x6e4b96,
        emissiveIntensity: 0.3,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x7e5da2, // Back (nz) - rich violet
        roughness: 0.18,
        metalness: 0.1,
        emissive: 0x4a276e,
        emissiveIntensity: 0.2,
      }),
    ];

    const boxGeo = new THREE.BoxGeometry(1.24, 1.24, 1.24);
    const cubeMesh = new THREE.Mesh(boxGeo, materials);
    cubeGroup.add(cubeMesh);

    // Crisp luminous wireframe edges to accentuate 3D geometry
    const edgesGeo = new THREE.EdgesGeometry(boxGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
      transparent: true,
      opacity: 0.9,
    });
    const edgesLine = new THREE.LineSegments(edgesGeo, edgesMat);
    cubeGroup.add(edgesLine);

    // Inner glowing core geometry for extra high-tech 3D depth
    const innerGeo = new THREE.OctahedronGeometry(0.5, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xd4bee4,
      wireframe: true,
      emissive: 0x9b7ebd,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.6,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    cubeGroup.add(innerCore);

    // Outer "creation / assembly" wireframe cube that expands on hover
    const ghostGeo = new THREE.BoxGeometry(1.48, 1.48, 1.48);
    const ghostEdges = new THREE.EdgesGeometry(ghostGeo);
    const ghostMat = new THREE.LineBasicMaterial({
      color: 0xd4bee4,
      transparent: true,
      opacity: 0.18,
    });
    const ghostMesh = new THREE.LineSegments(ghostEdges, ghostMat);
    cubeGroup.add(ghostMesh);

    // Base isometric starting angles
    cubeGroup.rotation.x = 0.38;
    cubeGroup.rotation.y = -0.72;

    let reqId: number;
    let currentScale = 1;
    let clockTime = 0;
    let hoverTransition = 0; // Smooth 0.0 (idle) to 1.0 (hovered) transition factor

    // Render loop with idle ambient 3D floating and smooth subtle fading hover interaction
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      clockTime += 0.016;

      // Smooth subtle lerp factor for hover transition (smooth ~500ms fade)
      const targetHover = isHoveredRef.current ? 1.0 : 0.0;
      hoverTransition += (targetHover - hoverTransition) * 0.075;

      // 1. Smoothly fade emissive lighting on 3D cube faces
      const currentEmissive = THREE.MathUtils.lerp(0.24, 0.42, hoverTransition);
      materials.forEach((m) => {
        m.emissiveIntensity = currentEmissive;
      });

      // 2. Smooth subtle scale lift (subtle 1.05 max for graceful breathing)
      const targetScale = THREE.MathUtils.lerp(1.0, 1.05, hoverTransition);
      currentScale += (targetScale - currentScale) * 0.08;

      // 3. Smoothly fade outer wireframe glow
      ghostMat.opacity = THREE.MathUtils.lerp(0.12, 0.45, hoverTransition);

      // Continuous angular velocities based on smooth hover transition
      const speedY = THREE.MathUtils.lerp(0.012, 0.038, hoverTransition);
      const speedX = THREE.MathUtils.lerp(
        Math.sin(clockTime * 1.6) * 0.004,
        0.016 + mouseRef.current.y * 0.015,
        hoverTransition
      );
      const speedZ = THREE.MathUtils.lerp(
        Math.cos(clockTime * 1.3) * 0.002,
        0.008 + mouseRef.current.x * 0.010,
        hoverTransition
      );

      // Accumulate rotations continuously from the exact current position — never snaps or restarts
      cubeGroup.rotation.y += speedY;
      cubeGroup.rotation.x += speedX;
      cubeGroup.rotation.z += speedZ;

      // Continuous smooth floating bob and interactive mouse shift
      const targetPosX = mouseRef.current.x * 0.14 * hoverTransition;
      const targetPosY = Math.sin(clockTime * 2.0) * 0.05 - mouseRef.current.y * 0.12 * hoverTransition;
      cubeGroup.position.x += (targetPosX - cubeGroup.position.x) * 0.08;
      cubeGroup.position.y += (targetPosY - cubeGroup.position.y) * 0.08;

      // Auxiliary wireframes also rotate continuously without jump
      ghostMesh.rotation.y += THREE.MathUtils.lerp(0.006, -0.025, hoverTransition);
      ghostMesh.rotation.x += THREE.MathUtils.lerp(0.003, 0.012, hoverTransition);
      innerCore.rotation.y += THREE.MathUtils.lerp(0.012, 0.035, hoverTransition);
      innerCore.rotation.x += THREE.MathUtils.lerp(0.006, 0.018, hoverTransition);

      cubeGroup.scale.set(currentScale, currentScale, currentScale);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      boxGeo.dispose();
      edgesGeo.dispose();
      innerGeo.dispose();
      ghostGeo.dispose();
      ghostEdges.dispose();
      materials.forEach((m) => m.dispose());
      edgesMat.dispose();
      innerMat.dispose();
      ghostMat.dispose();
      renderer.dispose();
    };
  }, [dim]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseRef.current = { x, y };
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsHovered(true);
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.touches[0].clientY - rect.top) / rect.height) * 2 - 1;
    mouseRef.current = { x, y };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.touches[0].clientY - rect.top) / rect.height) * 2 - 1;
    mouseRef.current = { x, y };
  };

  const handleTouchEnd = () => {
    // Keep hover effect for a brief moment on mobile touch before releasing
    setTimeout(() => {
      setIsHovered(false);
      mouseRef.current = { x: 0, y: 0 };
    }, 600);
  };

  const containerClasses =
    size === 'sm'
      ? 'w-10 h-10 rounded-xl'
      : size === 'lg'
      ? 'w-14 h-14 rounded-2xl'
      : 'w-12 h-12 rounded-xl';

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseRef.current = { x: 0, y: 0 };
      }}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative ${containerClasses} bg-gradient-to-br from-[#3B1E54] via-[#2A143D] to-[#1C0D2A] border ${
        isHovered ? 'border-[#9B7EBD]/85' : 'border-[#9B7EBD]/40'
      } flex items-center justify-center select-none cursor-pointer overflow-hidden group shrink-0 ${className}`}
      style={{
        transition: 'transform 650ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 650ms cubic-bezier(0.16, 1, 0.3, 1), border-color 500ms ease-out',
        boxShadow: isHovered
          ? '0 0 24px rgba(155, 126, 189, 0.55), 0 0 45px rgba(212, 190, 228, 0.35), 0 4px 14px rgba(59, 30, 84, 0.5)'
          : '0 0 10px rgba(155, 126, 189, 0.25), 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
        transform: isHovered ? 'translateY(-1.5px) scale(1.035)' : 'translateY(0) scale(1)',
      }}
      title="3D ResourceBox Cube - live rotating 3D emblem! Hover to spin & glow."
    >
      {/* Background ambient radial neon aura with smooth subtle breathing fade */}
      <div
        className={`absolute inset-0 bg-radial from-[#D4BEE4]/45 via-[#9B7EBD]/25 to-transparent pointer-events-none transition-all duration-700 ease-out ${
          isHovered ? 'opacity-100 scale-125 animate-logo-halo' : 'opacity-25 scale-95'
        }`}
      />

      {/* Hardware-accelerated True 3D WebGL Canvas with smooth subtle fade glow */}
      <canvas
        ref={canvasRef}
        width={dim}
        height={dim}
        className={`relative z-10 pointer-events-none block will-change-transform transition-all duration-700 ease-out ${
          isHovered ? 'filter drop-shadow-[0_0_8px_rgba(212,190,228,0.55)]' : ''
        }`}
        style={{ width: `${dim}px`, height: `${dim}px` }}
      />

      {/* 3D badge reflection gloss with smooth fade */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/20 pointer-events-none rounded-[inherit] transition-opacity duration-700 ease-out ${
          isHovered ? 'opacity-85' : 'opacity-35'
        }`}
      />
    </div>
  );
};
