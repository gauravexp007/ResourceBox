import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import {
  createSolid3DCardboardBox,
  applyThemeToSolid3DCardboardBox,
  createSolid3DHeadphones,
  createSolid3DLaptop,
  createSolid3DPS5,
  createSolid3DKeyboard,
  createSolid3DGuitar,
  createSolid3DSneaker,
  createSolid3DBooks,
  createSolid3DCamera,
  createSolid3DConsole,
  createSolid3DGamepad,
  createSolid3DSmartwatch,
  createSolid3DPlant,
  createSolid3DAirPods,
  createSolid3DFlask,
  createSolid3DDrone,
  createSolid3DDrill,
  createSolid3DMicrophone,
  createSolid3DCoffeeMug,
  createSolid3DBinoculars,
  createSolid3DHeadsetVR,
  createSolid3DSkateboard,
  createSolid3DLantern,
  createFadedGridFloor,
} from './3d/Procedural3DModels';
import { useTheme } from '../context/ThemeContext';

interface CommunityFloatingBoxProps {
  itemsCount?: number;
  onOpenUpload?: () => void;
  onNavigateToRent?: () => void;
}

export const CommunityFloatingBox: React.FC<CommunityFloatingBoxProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentTheme } = useTheme();

  // 3D scene elements
  const stageGroupRef = useRef<THREE.Group | null>(null);
  const boxGroupRef = useRef<THREE.Group | null>(null);
  const floatingItemsRef = useRef<
    Array<{
      group: THREE.Group;
      name: string;
      basePos: THREE.Vector3;
      baseRot: THREE.Euler;
      speed: number;
      amplitude: number;
      phase: number;
      rotSpeed: THREE.Vector3;
      collisionRadius: number;
    }>
  >([]);

  // 360 Spin Controller
  const spinState = useRef({
    isSpinning: false,
    startRotY: 0,
    targetRotY: 0,
    startTime: 0,
    duration: 1800,
  });

  // Mouse Parallax & Dragging
  const mouseState = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartRotY: 0,
  });

  // Trigger 360-degree rotation on the 3D box
  const trigger360Rotation = useCallback(() => {
    if (spinState.current.isSpinning) return;

    const currentY = stageGroupRef.current ? stageGroupRef.current.rotation.y : 0;
    spinState.current = {
      isSpinning: true,
      startRotY: currentY,
      targetRotY: currentY + Math.PI * 2,
      startTime: performance.now(),
      duration: 1800,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera: Balanced 3D perspective to comfortably frame the box, items, and ground grid
    const width = container.clientWidth || 540;
    const height = container.clientHeight || 580;
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 9.8);
    camera.lookAt(0, 0.8, 0);

    // 3. WebGL Renderer with Shadows & Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0); // 100% transparent clear background for seamless overlay
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    // 4. Lighting Rig
    // Subtle balanced hemisphere ambient light for realistic natural fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe2e8f0, 0.55);
    scene.add(hemiLight);

    // Key Light for crisp highlights and softly blurred cast shadows
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
    keyLight.position.set(5.5, 10.5, 6.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0003;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.camera.left = -5.5;
    keyLight.shadow.camera.right = 5.5;
    keyLight.shadow.camera.top = 5.5;
    keyLight.shadow.camera.bottom = -5.5;
    keyLight.shadow.radius = 4; // Soft penumbra shadow diffusion
    scene.add(keyLight);

    // Dynamic ambient point light source positioned directly above the floating items cluster (no expensive 6-face cube shadow pass)
    const dynamicAmbientLight = new THREE.PointLight(0xffffff, 0.9, 16, 1.2);
    dynamicAmbientLight.position.set(0, 3.8, 1.2);
    dynamicAmbientLight.castShadow = false;
    scene.add(dynamicAmbientLight);

    // Clean neutral rim light for silhouette separation
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(-6, 5, -5);
    scene.add(rimLight);

    // Front fill
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(0, -2, 5);
    scene.add(fillLight);

    // 5. Stage Group (holds the cardboard box, items, and grid)
    const stageGroup = new THREE.Group();
    stageGroup.position.set(0, -0.3, 0);
    scene.add(stageGroup);
    stageGroupRef.current = stageGroup;

    // 6. Ground Grid Space at the base of the box (with seamless radial fade and soft penumbra shadow plane)
    const gridFloor = createFadedGridFloor(24.0, 48);
    gridFloor.position.y = -1.61; // Exactly beneath the cardboard box bottom plate (-0.75 - 1.7/2 = -1.6)
    stageGroup.add(gridFloor);

    // 7. Solid 3D Cardboard Box positioned at the base (themed dynamically)
    const cardboardBox = createSolid3DCardboardBox(currentTheme);
    cardboardBox.position.set(0, -0.75, 0);
    stageGroup.add(cardboardBox);
    boxGroupRef.current = cardboardBox;

    // 8. Non-Overlapping Procedural 3D Floating Items
    // Carefully calibrated 3D coordinates & bounding radii so NO items collide or overlap with each other or the box
    // Box bounds: X: [-1.2, 1.2], Y: [-1.6, 0.1], Z: [-1.15, 1.15]
    // All floating items reside above Y: 0.35 with generous physical clearances
    const itemsConfig: Array<{
      builder: () => THREE.Group;
      name: string;
      pos: [number, number, number];
      rot: [number, number, number];
      scale: number;
      speed: number;
      amp: number;
      phase: number;
      rotSpeed: [number, number, number];
      collisionRadius: number;
    }> = [
      // Top Apex Items (Y: 2.2 .. 2.8) - High hovering canopy
      {
        builder: createSolid3DDrone,
        name: 'Drone',
        pos: [0.15, 2.75, 0.1],
        rot: [0.1, 0.45, -0.05],
        scale: 1.05,
        speed: 1.2,
        amp: 0.11,
        phase: 0.8,
        rotSpeed: [0.09, 0.22, 0.05],
        collisionRadius: 0.52,
      },
      {
        builder: createSolid3DGuitar,
        name: 'Guitar',
        pos: [-0.65, 2.45, -0.4],
        rot: [0.12, 0.35, -0.18],
        scale: 0.95,
        speed: 1.1,
        amp: 0.1,
        phase: 0.2,
        rotSpeed: [0.08, 0.15, 0.04],
        collisionRadius: 0.48,
      },
      {
        builder: createSolid3DPS5,
        name: 'PS5',
        pos: [0.85, 2.45, -0.35],
        rot: [0.06, -0.25, 0.1],
        scale: 0.98,
        speed: 1.05,
        amp: 0.09,
        phase: 1.4,
        rotSpeed: [0.06, -0.12, 0.04],
        collisionRadius: 0.42,
      },
      {
        builder: createSolid3DMicrophone,
        name: 'Microphone',
        pos: [-1.35, 2.3, -0.2],
        rot: [0.18, 0.4, -0.15],
        scale: 1.08,
        speed: 1.15,
        amp: 0.1,
        phase: 3.1,
        rotSpeed: [0.1, 0.18, 0.06],
        collisionRadius: 0.42,
      },
      {
        builder: createSolid3DHeadsetVR,
        name: 'VRHeadset',
        pos: [0.0, 2.15, -0.65],
        rot: [0.12, -0.18, 0.08],
        scale: 1.12,
        speed: 1.1,
        amp: 0.09,
        phase: 2.3,
        rotSpeed: [0.08, -0.14, 0.06],
        collisionRadius: 0.45,
      },

      // Upper Flank Items (Y: 1.7 .. 2.1)
      {
        builder: createSolid3DCamera,
        name: 'Camera',
        pos: [-1.85, 1.85, 0.1],
        rot: [0.12, 0.45, -0.12],
        scale: 1.15,
        speed: 1.25,
        amp: 0.1,
        phase: 0.7,
        rotSpeed: [0.1, 0.18, 0.06],
        collisionRadius: 0.45,
      },
      {
        builder: createSolid3DHeadphones,
        name: 'Headphones',
        pos: [1.85, 1.85, 0.15],
        rot: [0.18, -0.38, 0.12],
        scale: 1.12,
        speed: 1.2,
        amp: 0.11,
        phase: 2.0,
        rotSpeed: [0.15, -0.2, 0.08],
        collisionRadius: 0.46,
      },
      {
        builder: createSolid3DDrill,
        name: 'PowerDrill',
        pos: [1.35, 2.15, -0.25],
        rot: [-0.15, -0.35, 0.2],
        scale: 1.05,
        speed: 1.2,
        amp: 0.09,
        phase: 1.7,
        rotSpeed: [0.12, -0.16, 0.07],
        collisionRadius: 0.44,
      },

      // Mid-Level Outer Items (Y: 1.1 .. 1.55)
      {
        builder: createSolid3DLaptop,
        name: 'Laptop',
        pos: [-2.05, 1.2, 0.4],
        rot: [-0.22, 0.5, -0.15],
        scale: 1.02,
        speed: 1.15,
        amp: 0.09,
        phase: 2.6,
        rotSpeed: [0.08, 0.15, 0.05],
        collisionRadius: 0.52,
      },
      {
        builder: createSolid3DKeyboard,
        name: 'Keyboard',
        pos: [2.05, 1.2, 0.4],
        rot: [0.28, -0.55, 0.22],
        scale: 1.05,
        speed: 1.2,
        amp: 0.1,
        phase: 3.2,
        rotSpeed: [0.12, -0.22, 0.1],
        collisionRadius: 0.5,
      },
      {
        builder: createSolid3DSkateboard,
        name: 'Skateboard',
        pos: [1.55, 1.35, -0.55],
        rot: [0.2, -0.4, 0.25],
        scale: 1.05,
        speed: 1.1,
        amp: 0.08,
        phase: 4.0,
        rotSpeed: [0.07, -0.12, 0.05],
        collisionRadius: 0.48,
      },
      {
        builder: createSolid3DLantern,
        name: 'CampingLantern',
        pos: [-1.55, 1.35, -0.55],
        rot: [-0.1, 0.35, -0.1],
        scale: 1.08,
        speed: 1.18,
        amp: 0.08,
        phase: 1.2,
        rotSpeed: [0.09, 0.14, 0.04],
        collisionRadius: 0.42,
      },
      {
        builder: createSolid3DBinoculars,
        name: 'Binoculars',
        pos: [0.75, 1.45, 0.75],
        rot: [-0.15, -0.28, 0.1],
        scale: 1.12,
        speed: 1.28,
        amp: 0.08,
        phase: 3.6,
        rotSpeed: [0.12, 0.16, 0.07],
        collisionRadius: 0.38,
      },
      {
        builder: createSolid3DSmartwatch,
        name: 'Smartwatch',
        pos: [-0.75, 1.45, 0.75],
        rot: [0.15, 0.25, -0.08],
        scale: 1.25,
        speed: 1.35,
        amp: 0.08,
        phase: 1.8,
        rotSpeed: [0.18, 0.22, 0.08],
        collisionRadius: 0.32,
      },

      // Mid-Lower Tier & Outskirts (Y: 0.55 .. 0.85)
      {
        builder: createSolid3DBooks,
        name: 'Books',
        pos: [-1.95, 0.52, 0.85],
        rot: [0.08, 0.45, -0.1],
        scale: 1.08,
        speed: 1.05,
        amp: 0.08,
        phase: 4.5,
        rotSpeed: [0.06, 0.12, 0.04],
        collisionRadius: 0.42,
      },
      {
        builder: createSolid3DConsole,
        name: 'Console',
        pos: [1.95, 0.52, 0.85],
        rot: [-0.12, -0.38, 0.16],
        scale: 1.1,
        speed: 1.3,
        amp: 0.09,
        phase: 3.9,
        rotSpeed: [0.1, 0.15, 0.08],
        collisionRadius: 0.45,
      },

      // Center Bouquet - Hovering directly above the open box rim
      {
        builder: createSolid3DSneaker,
        name: 'Sneaker',
        pos: [0.0, 0.85, 1.05],
        rot: [-0.2, -0.28, 0.12],
        scale: 1.12,
        speed: 1.25,
        amp: 0.08,
        phase: 5.0,
        rotSpeed: [0.14, -0.18, 0.08],
        collisionRadius: 0.44,
      },
      {
        builder: createSolid3DGamepad,
        name: 'Gamepad',
        pos: [0.85, 0.78, 0.95],
        rot: [0.24, -0.32, 0.15],
        scale: 1.15,
        speed: 1.3,
        amp: 0.09,
        phase: 0.5,
        rotSpeed: [0.15, 0.22, 0.1],
        collisionRadius: 0.38,
      },
      {
        builder: createSolid3DPlant,
        name: 'Plant',
        pos: [-0.95, 0.78, 0.95],
        rot: [0.08, 0.32, -0.08],
        scale: 1.15,
        speed: 1.1,
        amp: 0.07,
        phase: 2.9,
        rotSpeed: [0.08, 0.12, 0.04],
        collisionRadius: 0.35,
      },
      {
        builder: createSolid3DCoffeeMug,
        name: 'CampingMug',
        pos: [0.0, 0.62, 0.55],
        rot: [0.1, -0.2, 0.05],
        scale: 1.18,
        speed: 1.22,
        amp: 0.07,
        phase: 1.9,
        rotSpeed: [0.08, 0.14, 0.05],
        collisionRadius: 0.3,
      },
      {
        builder: createSolid3DAirPods,
        name: 'AirPods',
        pos: [-0.52, 0.55, 1.35],
        rot: [0.2, 0.25, -0.08],
        scale: 1.3,
        speed: 1.45,
        amp: 0.07,
        phase: 1.0,
        rotSpeed: [0.18, 0.25, 0.08],
        collisionRadius: 0.26,
      },
      {
        builder: createSolid3DFlask,
        name: 'Flask',
        pos: [0.52, 0.55, 1.35],
        rot: [-0.12, -0.28, 0.12],
        scale: 1.12,
        speed: 1.2,
        amp: 0.08,
        phase: 4.2,
        rotSpeed: [0.12, -0.16, 0.08],
        collisionRadius: 0.28,
      },
    ];

    floatingItemsRef.current = [];

    itemsConfig.forEach((item) => {
      const group = item.builder();
      group.name = item.name;
      group.scale.setScalar(item.scale);
      group.position.set(...item.pos);
      group.rotation.set(...item.rot);

      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.userData = { itemName: item.name };
        }
      });

      stageGroup.add(group);

      floatingItemsRef.current.push({
        group,
        name: item.name,
        basePos: new THREE.Vector3(...item.pos),
        baseRot: new THREE.Euler(...item.rot),
        speed: item.speed,
        amplitude: item.amp,
        phase: item.phase,
        rotSpeed: new THREE.Vector3(...item.rotSpeed),
        collisionRadius: item.collisionRadius,
      });
    });

    // 9. Ambient Sparkle Particles around the box
    const particleCount = 35;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 6;
      pPositions[i * 3 + 1] = Math.random() * 4 - 0.5;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      pSpeeds[i] = 0.4 + Math.random() * 0.6;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.045,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    stageGroup.add(particles);

    // 10. Pointer Move for Subtle Parallax & Drag Orbit (No item hover details tooltip)
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseState.current.targetX = (x / rect.width) * 2 - 1;
      mouseState.current.targetY = -(y / rect.height) * 2 + 1;

      // Drag to orbit
      if (mouseState.current.isDragging && !spinState.current.isSpinning) {
        const deltaX = e.clientX - mouseState.current.dragStartX;
        stageGroup.rotation.y = mouseState.current.dragStartRotY + deltaX * 0.01;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      mouseState.current.isDragging = true;
      mouseState.current.dragStartX = e.clientX;
      mouseState.current.dragStartRotY = stageGroup.rotation.y;
    };

    const handlePointerUp = () => {
      mouseState.current.isDragging = false;
    };

    const handlePointerLeave = () => {
      mouseState.current.isDragging = false;
      mouseState.current.targetX = 0;
      mouseState.current.targetY = 0;
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('pointerleave', handlePointerLeave);

    // 11. Physics and Animation Loop
    let animId: number;
    const timer = new THREE.Timer();
    const _centrifugalDir = new THREE.Vector3();
    const _pushDir = new THREE.Vector3();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      timer.update();
      const elapsed = timer.getElapsed();

      // Mouse parallax lerp
      mouseState.current.currentX += (mouseState.current.targetX - mouseState.current.currentX) * 0.05;
      mouseState.current.currentY += (mouseState.current.targetY - mouseState.current.currentY) * 0.05;

      // Handle 360-degree rotation animation
      if (spinState.current.isSpinning) {
        const now = performance.now();
        const progress = Math.min(1, (now - spinState.current.startTime) / spinState.current.duration);

        // Cubic ease-in-out curve
        const ease = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        stageGroup.rotation.y =
          spinState.current.startRotY +
          (spinState.current.targetRotY - spinState.current.startRotY) * ease;

        // Gentle vertical lift during spin
        stageGroup.position.y = -0.3 + Math.sin(progress * Math.PI) * 0.32;

        if (progress >= 1) {
          spinState.current.isSpinning = false;
        }
      } else if (!mouseState.current.isDragging) {
        // Natural parallax drift
        const targetRotY = mouseState.current.currentX * 0.32;
        const targetRotX = -mouseState.current.currentY * 0.18;

        stageGroup.rotation.y += (targetRotY - stageGroup.rotation.y) * 0.05;
        stageGroup.rotation.x += (targetRotX - stageGroup.rotation.x) * 0.05;
        stageGroup.position.y += (-0.3 - stageGroup.position.y) * 0.05;
      }

      // Dynamically animate the ambient light position and soft intensity in sync with floating items
      if (dynamicAmbientLight) {
        dynamicAmbientLight.position.x = Math.sin(elapsed * 0.6) * 0.8 + mouseState.current.currentX * 0.5;
        dynamicAmbientLight.position.z = 1.2 + Math.cos(elapsed * 0.5) * 0.6;
        dynamicAmbientLight.position.y = 3.8 + Math.sin(elapsed * 0.8) * 0.2;
        dynamicAmbientLight.intensity = 1.25 + Math.sin(elapsed * 1.2) * 0.15;
      }

      // Cardboard box subtle weighted idle breathing
      if (boxGroupRef.current) {
        boxGroupRef.current.position.y = -0.75 + Math.sin(elapsed * 1.4) * 0.02;
      }

      // Smooth floating animation of all items with non-overlapping bounds
      const isSpinning = spinState.current.isSpinning;
      const items = floatingItemsRef.current;

      items.forEach((item) => {
        // Controlled wave oscillation within bounded amplitude
        const floatY = Math.sin(elapsed * item.speed + item.phase) * item.amplitude;
        const driftX = Math.cos(elapsed * 0.7 + item.phase) * 0.025;
        const driftZ = Math.sin(elapsed * 0.6 + item.phase) * 0.025;

        // Centrifugal lift during 360 spin
        let dirX = 0;
        let dirY = 0;
        let dirZ = 0;
        if (isSpinning) {
          _centrifugalDir.copy(item.basePos).normalize().multiplyScalar(0.28);
          dirX = _centrifugalDir.x;
          dirY = _centrifugalDir.y;
          dirZ = _centrifugalDir.z;
        }

        const targetY = item.basePos.y + floatY + dirY;
        const targetX = item.basePos.x + driftX + dirX;
        const targetZ = item.basePos.z + driftZ + dirZ;

        item.group.position.x += (targetX - item.group.position.x) * 0.1;
        item.group.position.y += (targetY - item.group.position.y) * 0.1;
        item.group.position.z += (targetZ - item.group.position.z) * 0.1;

        // Soft angular oscillation
        item.group.rotation.x = item.baseRot.x + Math.sin(elapsed * item.rotSpeed.x + item.phase) * 0.09;
        item.group.rotation.y = item.baseRot.y + Math.cos(elapsed * item.rotSpeed.y + item.phase) * 0.09;
        item.group.rotation.z = item.baseRot.z + Math.sin(elapsed * item.rotSpeed.z + item.phase) * 0.09;
      });

      // Pairwise soft collision avoidance (enforces solid boundary clearances so no items overlap)
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const itemA = items[i];
          const itemB = items[j];

          const posA = itemA.group.position;
          const posB = itemB.group.position;
          const dist = posA.distanceTo(posB);
          const minDist = itemA.collisionRadius + itemB.collisionRadius;

          if (dist < minDist && dist > 0.001) {
            const overlap = (minDist - dist) * 0.5;
            _pushDir.subVectors(posA, posB).normalize();

            // Smoothly push boundaries apart
            posA.addScaledVector(_pushDir, overlap * 0.2);
            posB.addScaledVector(_pushDir, -overlap * 0.2);
          }
        }
      }

      // Sparkle particle drift
      const positions = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += pSpeeds[i] * 0.005;
        if (positions[i * 3 + 1] > 3.5) {
          positions[i * 3 + 1] = -0.5;
        }
      }
      pGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 12. Resize handling
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // 13. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('pointerleave', handlePointerLeave);
      resizeObserver.disconnect();

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  // Dynamically transform 3D box color and textures live whenever theme changes
  useEffect(() => {
    if (boxGroupRef.current) {
      applyThemeToSolid3DCardboardBox(boxGroupRef.current, currentTheme);
    }
  }, [currentTheme]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-xl mx-auto py-2 select-none">
      {/* Main Interactive 3D Stage Container */}
      <div
        ref={containerRef}
        onClick={trigger360Rotation}
        className="relative w-full aspect-square max-h-[500px] sm:max-h-[560px] rounded-3xl overflow-visible flex items-center justify-center group"
        role="button"
        tabIndex={0}
        aria-label="Interactive 3D Community Box. Click to rotate 360 degrees."
      >
        {/* Three.js Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain pointer-events-auto block focus:outline-none"
        />
      </div>

    </div>
  );
};
