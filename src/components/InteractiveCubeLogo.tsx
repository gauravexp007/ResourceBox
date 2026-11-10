import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

interface InteractiveCubeLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showBadge?: boolean;
}

export const InteractiveCubeLogo: React.FC<InteractiveCubeLogoProps> = ({
  size = 'md',
  className = '',
}) => {
  const { currentTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });

  // References for live theme updates without restarting animation
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const innerMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const ghostMatRef = useRef<THREE.LineBasicMaterial | null>(null);
  const lightsRef = useRef<{
    ambient: THREE.AmbientLight;
    fill: THREE.DirectionalLight;
    rim: THREE.PointLight;
  } | null>(null);

  // Pixel dimensions for canvas container
  const dim = size === 'sm' ? 36 : size === 'lg' ? 56 : 44;

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // Live updater: updates 3D colors when theme switches in settings
  useEffect(() => {
    if (materialsRef.current.length === 6) {
      const primaryCol = new THREE.Color(currentTheme.primary);
      const deepCol = new THREE.Color(currentTheme.deep);
      const accentCol = new THREE.Color(currentTheme.accent);

      // Right (px)
      materialsRef.current[0].color.copy(primaryCol);
      materialsRef.current[0].emissive.copy(primaryCol).multiplyScalar(0.45);

      // Left (nx)
      materialsRef.current[1].color.copy(deepCol).lerp(primaryCol, 0.35);
      materialsRef.current[1].emissive.copy(deepCol).multiplyScalar(0.4);

      // Top (py)
      materialsRef.current[2].color.copy(accentCol);
      materialsRef.current[2].emissive.copy(primaryCol).multiplyScalar(0.55);

      // Bottom (ny)
      materialsRef.current[3].color.copy(deepCol);
      materialsRef.current[3].emissive.copy(deepCol).multiplyScalar(0.25);

      // Front (pz)
      materialsRef.current[4].color.copy(primaryCol);
      materialsRef.current[4].emissive.copy(primaryCol).multiplyScalar(0.5);

      // Back (nz)
      materialsRef.current[5].color.copy(primaryCol).lerp(deepCol, 0.45);
      materialsRef.current[5].emissive.copy(deepCol).multiplyScalar(0.35);

      materialsRef.current.forEach((m) => {
        m.needsUpdate = true;
      });
    }

    if (innerMatRef.current) {
      innerMatRef.current.color.set(currentTheme.accent);
      innerMatRef.current.emissive.set(currentTheme.primary);
      innerMatRef.current.needsUpdate = true;
    }

    if (ghostMatRef.current) {
      ghostMatRef.current.color.set(currentTheme.accent);
      ghostMatRef.current.needsUpdate = true;
    }

    if (lightsRef.current) {
      lightsRef.current.ambient.color.set(currentTheme.accent);
      lightsRef.current.fill.color.set(currentTheme.primary);
      lightsRef.current.rim.color.set(currentTheme.accent);
    }
  }, [currentTheme]);

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

    // 4. Studio Lighting Rig tailored to active theme
    const ambientLight = new THREE.AmbientLight(new THREE.Color(currentTheme.accent), 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(5, 6, 4.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(new THREE.Color(currentTheme.primary), 2.0);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(new THREE.Color(currentTheme.accent), 2.2, 10);
    rimLight.position.set(0, 3, 2);
    scene.add(rimLight);

    lightsRef.current = { ambient: ambientLight, fill: fillLight, rim: rimLight };

    // 5. Main 3D Cube Group
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    const primaryCol = new THREE.Color(currentTheme.primary);
    const deepCol = new THREE.Color(currentTheme.deep);
    const accentCol = new THREE.Color(currentTheme.accent);

    const materials = [
      new THREE.MeshStandardMaterial({
        color: primaryCol.clone(), // Right (px)
        roughness: 0.12,
        metalness: 0.15,
        emissive: primaryCol.clone().multiplyScalar(0.45),
        emissiveIntensity: 0.28,
      }),
      new THREE.MeshStandardMaterial({
        color: deepCol.clone().lerp(primaryCol, 0.35), // Left (nx)
        roughness: 0.15,
        metalness: 0.1,
        emissive: deepCol.clone().multiplyScalar(0.4),
        emissiveIntensity: 0.22,
      }),
      new THREE.MeshStandardMaterial({
        color: accentCol.clone(), // Top (py)
        roughness: 0.08,
        metalness: 0.05,
        emissive: primaryCol.clone().multiplyScalar(0.55),
        emissiveIntensity: 0.35,
      }),
      new THREE.MeshStandardMaterial({
        color: deepCol.clone(), // Bottom (ny)
        roughness: 0.25,
        metalness: 0.15,
        emissive: deepCol.clone().multiplyScalar(0.25),
        emissiveIntensity: 0.2,
      }),
      new THREE.MeshStandardMaterial({
        color: primaryCol.clone(), // Front (pz)
        roughness: 0.12,
        metalness: 0.12,
        emissive: primaryCol.clone().multiplyScalar(0.5),
        emissiveIntensity: 0.3,
      }),
      new THREE.MeshStandardMaterial({
        color: primaryCol.clone().lerp(deepCol, 0.45), // Back (nz)
        roughness: 0.18,
        metalness: 0.1,
        emissive: deepCol.clone().multiplyScalar(0.35),
        emissiveIntensity: 0.2,
      }),
    ];

    materialsRef.current = materials;

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
      color: new THREE.Color(currentTheme.accent),
      wireframe: true,
      emissive: new THREE.Color(currentTheme.primary),
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.6,
    });
    innerMatRef.current = innerMat;
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    cubeGroup.add(innerCore);

    // Outer "creation / assembly" wireframe cube that expands on hover
    const ghostGeo = new THREE.BoxGeometry(1.48, 1.48, 1.48);
    const ghostEdges = new THREE.EdgesGeometry(ghostGeo);
    const ghostMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(currentTheme.accent),
      transparent: true,
      opacity: 0.18,
    });
    ghostMatRef.current = ghostMat;
    const ghostMesh = new THREE.LineSegments(ghostEdges, ghostMat);
    cubeGroup.add(ghostMesh);

    // Base isometric starting angles
    cubeGroup.rotation.x = 0.38;
    cubeGroup.rotation.y = -0.72;

    let reqId: number;
    let currentScale = 1;
    let clockTime = 0;
    let hoverTransition = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      clockTime += 0.016;

      const targetHover = isHoveredRef.current ? 1.0 : 0.0;
      hoverTransition += (targetHover - hoverTransition) * 0.075;

      const currentEmissive = THREE.MathUtils.lerp(0.24, 0.42, hoverTransition);
      materials.forEach((m) => {
        m.emissiveIntensity = currentEmissive;
      });

      const targetScale = THREE.MathUtils.lerp(1.0, 1.05, hoverTransition);
      currentScale += (targetScale - currentScale) * 0.08;

      ghostMat.opacity = THREE.MathUtils.lerp(0.12, 0.45, hoverTransition);

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

      cubeGroup.rotation.y += speedY;
      cubeGroup.rotation.x += speedX;
      cubeGroup.rotation.z += speedZ;

      const targetPosX = mouseRef.current.x * 0.14 * hoverTransition;
      const targetPosY = Math.sin(clockTime * 2.0) * 0.05 - mouseRef.current.y * 0.12 * hoverTransition;
      cubeGroup.position.x += (targetPosX - cubeGroup.position.x) * 0.08;
      cubeGroup.position.y += (targetPosY - cubeGroup.position.y) * 0.08;

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
      className={`relative ${containerClasses} flex items-center justify-center select-none cursor-pointer overflow-hidden group shrink-0 ${className}`}
      style={{
        background: `linear-gradient(135deg, ${currentTheme.deep} 0%, color-mix(in srgb, ${currentTheme.deep} 82%, black) 100%)`,
        borderColor: isHovered
          ? currentTheme.primary
          : `color-mix(in srgb, ${currentTheme.primary} 45%, transparent)`,
        borderWidth: '1px',
        borderStyle: 'solid',
        transition:
          'transform 650ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 650ms cubic-bezier(0.16, 1, 0.3, 1), border-color 500ms ease-out, background 500ms ease-out',
        boxShadow: isHovered
          ? `0 0 24px ${currentTheme.glowStrong}, 0 0 45px ${currentTheme.glow}, 0 4px 14px rgba(0, 0, 0, 0.45)`
          : `0 0 10px ${currentTheme.glow}, 0 2px 8px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)`,
        transform: isHovered ? 'translateY(-1.5px) scale(1.035)' : 'translateY(0) scale(1)',
      }}
      title="3D ResourceBox Cube - live rotating 3D emblem! Hover to spin & glow."
    >
      {/* Background ambient radial neon aura with smooth subtle breathing fade */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-700 ease-out ${
          isHovered ? 'opacity-100 scale-125 animate-logo-halo' : 'opacity-25 scale-95'
        }`}
        style={{
          background: `radial-gradient(circle, color-mix(in srgb, ${currentTheme.accent} 50%, transparent) 0%, color-mix(in srgb, ${currentTheme.primary} 30%, transparent) 45%, transparent 70%)`,
        }}
      />

      {/* Hardware-accelerated True 3D WebGL Canvas with smooth subtle fade glow */}
      <canvas
        ref={canvasRef}
        width={dim}
        height={dim}
        className="relative z-10 pointer-events-none block will-change-transform transition-all duration-700 ease-out"
        style={{
          width: `${dim}px`,
          height: `${dim}px`,
          filter: isHovered ? `drop-shadow(0 0 8px ${currentTheme.accent})` : 'none',
        }}
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
