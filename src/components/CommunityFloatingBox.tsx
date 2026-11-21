import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ArrowLeft, Rotate3d } from 'lucide-react';
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

const ITEM_DISPLAY_LABELS: Record<string, string> = {
  Drone: 'Camera Drone',
  Guitar: 'Acoustic Sunburst Guitar',
  PS5: 'PlayStation 5 Console',
  Microphone: 'Studio Condenser Mic',
  VRHeadset: 'VR Mixed Reality Headset',
  Camera: 'Pro DSLR Camera',
  Headphones: 'White Studio Headphones',
  PowerDrill: 'Cordless Power Drill',
  Laptop: 'Aluminum Pro Laptop',
  Keyboard: 'Custom Mechanical Keyboard',
  Skateboard: 'Street Cruiser Skateboard',
  CampingLantern: 'Vintage Camping Lantern',
  Binoculars: 'Compact Outdoor Binoculars',
  Smartwatch: 'Titanium Smartwatch',
  Books: 'Hardcover Design Books',
  Console: 'Handheld Switch Console',
  Sneaker: 'Streetwear Sneaker',
  Gamepad: 'Wireless Pro Gamepad',
  Plant: 'Ceramic Potted Succulent',
  CampingMug: 'Cobalt Enamel Camp Mug',
  AirPods: 'Wireless Earbuds Case',
  Flask: 'Thermal Insulated Flask',
};

export const CommunityFloatingBox: React.FC<CommunityFloatingBoxProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentTheme } = useTheme();

  const [selectedItemName, setSelectedItemName] = useState<string | null>(null);
  const [hoveredItemName, setHoveredItemName] = useState<string | null>(null);
  const [isDraggingInspectUi, setIsDraggingInspectUi] = useState(false);

  // 3D scene elements
  const stageGroupRef = useRef<THREE.Group | null>(null);
  const boxGroupRef = useRef<THREE.Group | null>(null);
  const gridFloorRef = useRef<THREE.Group | null>(null);
  const appliedThemeIdRef = useRef<string | null>(null);
  const selectedNameRef = useRef<string | null>(null);
  const hoveredNameRef = useRef<string | null>(null);

  const floatingItemsRef = useRef<
    Array<{
      group: THREE.Group;
      name: string;
      basePos: THREE.Vector3;
      baseRot: THREE.Euler;
      baseScale: number;
      inspectScale: number;
      boxCenter: THREE.Vector3;
      speed: number;
      amplitude: number;
      phase: number;
      rotSpeed: THREE.Vector3;
      collisionRadius: number;
      edgeMaterials: THREE.LineBasicMaterial[];
    }>
  >([]);

  // 360 Spin Controller (normal view box spin)
  const spinState = useRef({
    isSpinning: false,
    startRotY: 0,
    targetRotY: 0,
    startTime: 0,
    duration: 1800,
  });

  // Inspection 360 Drag Rotation Controller
  const inspectState = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    targetQuat: new THREE.Quaternion(),
  });

  // Mouse Parallax & Dragging
  const mouseState = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    isDragging: false,
    downX: 0,
    downY: 0,
    downTime: 0,
    dragStartX: 0,
    dragStartRotY: 0,
  });

  // Trigger 360-degree rotation on the 3D box (when clicking empty space / box in normal view)
  const trigger360Rotation = useCallback(() => {
    if (spinState.current.isSpinning || selectedNameRef.current !== null) return;

    const currentY = stageGroupRef.current ? stageGroupRef.current.rotation.y : 0;
    spinState.current = {
      isSpinning: true,
      startRotY: currentY,
      targetRotY: currentY + Math.PI * 2,
      startTime: performance.now(),
      duration: 1800,
    };
  }, []);

  const handleExitInspect = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    selectedNameRef.current = null;
    inspectState.current.isDragging = false;
    setIsDraggingInspectUi(false);
    setSelectedItemName(null);
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
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0); // 100% transparent clear background for seamless overlay
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

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
    gridFloorRef.current = gridFloor;

    // 7. Solid 3D Cardboard Box positioned at the base (themed dynamically)
    const cardboardBox = createSolid3DCardboardBox(currentTheme);
    cardboardBox.position.set(0, -0.75, 0);
    stageGroup.add(cardboardBox);
    boxGroupRef.current = cardboardBox;
    appliedThemeIdRef.current = currentTheme.id;

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
      // Top Apex Items (Y: 2.15 .. 2.95) - High hovering canopy (zero collision overlap)
      {
        builder: createSolid3DDrone,
        name: 'Drone',
        pos: [0.22, 2.95, 0.25],
        rot: [0.1, 0.45, -0.05],
        scale: 1.02,
        speed: 1.15,
        amp: 0.09,
        phase: 0.8,
        rotSpeed: [0.08, 0.18, 0.04],
        collisionRadius: 0.48,
      },
      {
        builder: createSolid3DGuitar,
        name: 'Guitar',
        pos: [-0.82, 2.50, -0.22],
        rot: [0.06, 0.24, -0.20],
        scale: 0.96,
        speed: 1.05,
        amp: 0.08,
        phase: 0.2,
        rotSpeed: [0.04, 0.10, 0.03],
        collisionRadius: 0.48,
      },
      {
        builder: createSolid3DPS5,
        name: 'PS5',
        pos: [1.18, 2.75, -0.52],
        rot: [0.06, -0.25, 0.08],
        scale: 0.98,
        speed: 1.05,
        amp: 0.08,
        phase: 1.4,
        rotSpeed: [0.06, -0.12, 0.04],
        collisionRadius: 0.40,
      },
      {
        builder: createSolid3DMicrophone,
        name: 'Microphone',
        pos: [-1.80, 2.55, -0.05],
        rot: [0.16, 0.4, -0.12],
        scale: 1.06,
        speed: 1.15,
        amp: 0.08,
        phase: 3.1,
        rotSpeed: [0.09, 0.16, 0.05],
        collisionRadius: 0.38,
      },
      {
        builder: createSolid3DHeadsetVR,
        name: 'VRHeadset',
        pos: [0.12, 2.22, -0.82],
        rot: [0.22, -0.48, 0.06],
        scale: 1.15,
        speed: 1.1,
        amp: 0.08,
        phase: 2.3,
        rotSpeed: [0.08, -0.14, 0.05],
        collisionRadius: 0.42,
      },

      // Upper Flank Items (Y: 1.72 .. 1.98)
      {
        builder: createSolid3DCamera,
        name: 'Camera',
        pos: [-1.95, 1.72, 0.15],
        rot: [0.12, 0.45, -0.12],
        scale: 1.12,
        speed: 1.2,
        amp: 0.08,
        phase: 0.7,
        rotSpeed: [0.09, 0.16, 0.05],
        collisionRadius: 0.40,
      },
      {
        builder: createSolid3DHeadphones,
        name: 'Headphones',
        pos: [2.10, 2.02, 0.32],
        rot: [0.05, -0.34, 0.0],
        scale: 1.16,
        speed: 1.12,
        amp: 0.08,
        phase: 2.0,
        rotSpeed: [0.04, -0.10, 0.015],
        collisionRadius: 0.44,
      },
      {
        builder: createSolid3DDrill,
        name: 'PowerDrill',
        pos: [0.95, 1.82, -0.30],
        rot: [-0.15, -0.35, 0.18],
        scale: 1.02,
        speed: 1.18,
        amp: 0.08,
        phase: 1.7,
        rotSpeed: [0.1, -0.14, 0.06],
        collisionRadius: 0.40,
      },

      // Mid-Level Outer Items (Y: 1.05 .. 1.52)
      {
        builder: createSolid3DLaptop,
        name: 'Laptop',
        pos: [-2.18, 1.05, 0.92],
        rot: [-0.22, 0.5, -0.15],
        scale: 1.0,
        speed: 1.15,
        amp: 0.08,
        phase: 2.6,
        rotSpeed: [0.08, 0.15, 0.05],
        collisionRadius: 0.46,
      },
      {
        builder: createSolid3DKeyboard,
        name: 'Keyboard',
        pos: [2.15, 1.14, 0.78],
        rot: [0.28, -0.55, 0.2],
        scale: 1.04,
        speed: 1.18,
        amp: 0.08,
        phase: 3.2,
        rotSpeed: [0.1, -0.2, 0.08],
        collisionRadius: 0.45,
      },
      {
        builder: createSolid3DSkateboard,
        name: 'Skateboard',
        pos: [1.58, 1.25, -0.82],
        rot: [0.2, -0.4, 0.25],
        scale: 1.02,
        speed: 1.1,
        amp: 0.07,
        phase: 4.0,
        rotSpeed: [0.07, -0.12, 0.05],
        collisionRadius: 0.44,
      },
      {
        builder: createSolid3DLantern,
        name: 'CampingLantern',
        pos: [-1.58, 1.38, -0.78],
        rot: [-0.1, 0.35, -0.1],
        scale: 1.06,
        speed: 1.15,
        amp: 0.07,
        phase: 1.2,
        rotSpeed: [0.08, 0.14, 0.04],
        collisionRadius: 0.40,
      },
      {
        builder: createSolid3DBinoculars,
        name: 'Binoculars',
        pos: [-0.12, 1.62, 0.72],
        rot: [0.18, -0.32, 0.08],
        scale: 1.14,
        speed: 1.25,
        amp: 0.07,
        phase: 3.6,
        rotSpeed: [0.1, 0.14, 0.06],
        collisionRadius: 0.36,
      },
      {
        builder: createSolid3DSmartwatch,
        name: 'Smartwatch',
        pos: [-0.86, 1.52, 0.92],
        rot: [0.15, 0.25, -0.08],
        scale: 1.2,
        speed: 1.3,
        amp: 0.07,
        phase: 1.8,
        rotSpeed: [0.15, 0.18, 0.07],
        collisionRadius: 0.32,
      },

      // Mid-Lower Tier & Outskirts (Y: 0.20 .. 0.42)
      {
        builder: createSolid3DBooks,
        name: 'Books',
        pos: [-1.98, 0.22, 0.40],
        rot: [0.08, 0.45, -0.1],
        scale: 1.06,
        speed: 1.05,
        amp: 0.07,
        phase: 4.5,
        rotSpeed: [0.06, 0.12, 0.04],
        collisionRadius: 0.38,
      },
      {
        builder: createSolid3DConsole,
        name: 'Console',
        pos: [1.98, 0.20, 0.36],
        rot: [-0.12, -0.38, 0.16],
        scale: 1.08,
        speed: 1.25,
        amp: 0.07,
        phase: 3.9,
        rotSpeed: [0.09, 0.14, 0.06],
        collisionRadius: 0.40,
      },

      // Center Bouquet - Hovering directly above the open box rim
      {
        builder: createSolid3DSneaker,
        name: 'Sneaker',
        pos: [-0.04, 0.90, 1.15],
        rot: [-0.14, 0.65, 0.08],
        scale: 1.1,
        speed: 1.22,
        amp: 0.07,
        phase: 5.0,
        rotSpeed: [0.12, -0.16, 0.07],
        collisionRadius: 0.40,
      },
      {
        builder: createSolid3DGamepad,
        name: 'Gamepad',
        pos: [0.98, 0.74, 1.18],
        rot: [0.24, -0.32, 0.15],
        scale: 1.12,
        speed: 1.25,
        amp: 0.07,
        phase: 0.5,
        rotSpeed: [0.12, 0.18, 0.08],
        collisionRadius: 0.35,
      },
      {
        builder: createSolid3DPlant,
        name: 'Plant',
        pos: [-1.08, 0.76, 1.08],
        rot: [0.34, 0.32, -0.08],
        scale: 1.12,
        speed: 1.1,
        amp: 0.07,
        phase: 2.9,
        rotSpeed: [0.08, 0.12, 0.04],
        collisionRadius: 0.34,
      },
      {
        builder: createSolid3DCoffeeMug,
        name: 'CampingMug',
        pos: [0.55, 1.24, 0.78],
        rot: [0.38, -0.35, 0.08],
        scale: 1.18,
        speed: 1.2,
        amp: 0.06,
        phase: 1.9,
        rotSpeed: [0.08, 0.14, 0.05],
        collisionRadius: 0.28,
      },
      {
        builder: createSolid3DAirPods,
        name: 'AirPods',
        pos: [-0.54, 0.66, 1.55],
        rot: [0.22, 0.32, -0.08],
        scale: 1.26,
        speed: 1.35,
        amp: 0.06,
        phase: 1.0,
        rotSpeed: [0.15, 0.22, 0.07],
        collisionRadius: 0.26,
      },
      {
        builder: createSolid3DFlask,
        name: 'Flask',
        pos: [0.54, 0.42, 1.62],
        rot: [-0.12, -0.28, 0.12],
        scale: 1.1,
        speed: 1.18,
        amp: 0.06,
        phase: 4.2,
        rotSpeed: [0.1, -0.14, 0.07],
        collisionRadius: 0.27,
      },
    ];

    const _measureBox = new THREE.Box3();
    const _measureSize = new THREE.Vector3();
    const _measureCenter = new THREE.Vector3();

    itemsConfig.forEach((item) => {
      const group = item.builder();
      group.name = item.name;
      group.userData = { itemName: item.name };

      // Measure unscaled model bounding box for crisp, proportional 3D zoom framing
      _measureBox.setFromObject(group);
      _measureBox.getSize(_measureSize);
      _measureBox.getCenter(_measureCenter);
      const maxDim = Math.max(0.24, _measureSize.x, _measureSize.y, _measureSize.z);
      const inspectScale = Math.min(3.4, Math.max(0.76, 1.30 / maxDim));

      group.scale.setScalar(item.scale);
      group.position.set(...item.pos);
      group.rotation.set(...item.rot);

      const edgeMaterials: THREE.LineBasicMaterial[] = [];

      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.userData = { itemName: item.name };

          // Subtle architectural silhouette boundary lines on primary solid parts
          const mat = Array.isArray(child.material) ? child.material[0] : child.material;
          const isTransparentGlass = Boolean(mat && (mat.transparent === true || mat.depthWrite === false));
          if (!isTransparentGlass && child.geometry) {
            if (!child.geometry.boundingSphere) child.geometry.computeBoundingSphere();
            const bsRadius = child.geometry.boundingSphere?.radius ?? 0;
            if (bsRadius > 0.032) {
              const edgesGeo = new THREE.EdgesGeometry(child.geometry, 36);
              if (edgesGeo.attributes.position && edgesGeo.attributes.position.count > 0) {
                const edgeMat = new THREE.LineBasicMaterial({
                  color: 0x0f172a,
                  transparent: true,
                  opacity: 0.20,
                  depthWrite: false,
                });
                const edgeLines = new THREE.LineSegments(edgesGeo, edgeMat);
                edgeLines.userData = { isBoundaryLine: true };
                child.add(edgeLines);
                edgeMaterials.push(edgeMat);
              } else {
                edgesGeo.dispose();
              }
            }
          }
        }
      });

      stageGroup.add(group);

      floatingItemsRef.current.push({
        group,
        name: item.name,
        basePos: new THREE.Vector3(...item.pos),
        baseRot: new THREE.Euler(...item.rot),
        baseScale: item.scale,
        inspectScale,
        boxCenter: _measureCenter.clone(),
        speed: item.speed,
        amplitude: item.amp,
        phase: item.phase,
        rotSpeed: new THREE.Vector3(...item.rotSpeed),
        collisionRadius: item.collisionRadius,
        edgeMaterials,
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

    // 10. Raycasting, Click-to-Zoom & 360 Mouse Drag Inspection Controls
    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2();
    let lastHoverCheck = 0;

    const pickFloatingItem = (clientX: number, clientY: number): string | null => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return null;
      pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNDC, camera);

      const groups = floatingItemsRef.current.map((item) => item.group);
      const hits = raycaster.intersectObjects(groups, true);
      for (const hit of hits) {
        if (hit.object instanceof THREE.Mesh) {
          let curr: THREE.Object3D | null = hit.object;
          while (curr) {
            if (typeof curr.userData?.itemName === 'string') {
              return curr.userData.itemName;
            }
            curr = curr.parent;
          }
        }
      }
      return null;
    };

    const enterInspectMode = (itemName: string) => {
      const targetItem = floatingItemsRef.current.find((i) => i.name === itemName);
      if (!targetItem) return;
      spinState.current.isSpinning = false;
      selectedNameRef.current = itemName;
      hoveredNameRef.current = null;
      setHoveredItemName(null);
      inspectState.current.isDragging = false;
      inspectState.current.targetQuat.copy(targetItem.group.quaternion);
      setSelectedItemName(itemName);
    };

    const _axisY = new THREE.Vector3(0, 1, 0);
    const _axisX = new THREE.Vector3(1, 0, 0);
    const _qYaw = new THREE.Quaternion();
    const _qPitch = new THREE.Quaternion();

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseState.current.targetX = (x / rect.width) * 2 - 1;
      mouseState.current.targetY = -(y / rect.height) * 2 + 1;

      if (selectedNameRef.current !== null) {
        // Click-and-hold 360 drag rotation of the zoomed 3D item
        if (inspectState.current.isDragging) {
          const dx = e.clientX - inspectState.current.lastX;
          const dy = e.clientY - inspectState.current.lastY;
          inspectState.current.lastX = e.clientX;
          inspectState.current.lastY = e.clientY;

          _qYaw.setFromAxisAngle(_axisY, dx * 0.011);
          _qPitch.setFromAxisAngle(_axisX, dy * 0.011);
          inspectState.current.targetQuat.premultiply(_qYaw).premultiply(_qPitch).normalize();
        }
        return;
      }

      // Drag to orbit entire box in normal view
      if (mouseState.current.isDragging && !spinState.current.isSpinning) {
        const deltaX = e.clientX - mouseState.current.dragStartX;
        stageGroup.rotation.y = mouseState.current.dragStartRotY + deltaX * 0.01;
        return;
      }

      // Throttled hover raycast (~30fps) to highlight hovered item boundary
      const now = performance.now();
      if (now - lastHoverCheck > 32) {
        lastHoverCheck = now;
        const hitName = pickFloatingItem(e.clientX, e.clientY);
        if (hitName !== hoveredNameRef.current) {
          hoveredNameRef.current = hitName;
          setHoveredItemName(hitName);
        }
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest('button')) return;

      if (selectedNameRef.current !== null) {
        inspectState.current.isDragging = true;
        inspectState.current.lastX = e.clientX;
        inspectState.current.lastY = e.clientY;
        setIsDraggingInspectUi(true);
        try {
          container.setPointerCapture(e.pointerId);
        } catch {
          // Pointer capture unsupported in synthetic events
        }
        return;
      }

      mouseState.current.isDragging = true;
      mouseState.current.downX = e.clientX;
      mouseState.current.downY = e.clientY;
      mouseState.current.downTime = performance.now();
      mouseState.current.dragStartX = e.clientX;
      mouseState.current.dragStartRotY = stageGroup.rotation.y;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (selectedNameRef.current !== null) {
        inspectState.current.isDragging = false;
        setIsDraggingInspectUi(false);
        try {
          if (container.hasPointerCapture(e.pointerId)) {
            container.releasePointerCapture(e.pointerId);
          }
        } catch {
          // Ignore
        }
        return;
      }

      const wasDragging = mouseState.current.isDragging;
      mouseState.current.isDragging = false;

      if (wasDragging) {
        const moveDist = Math.hypot(e.clientX - mouseState.current.downX, e.clientY - mouseState.current.downY);
        const duration = performance.now() - mouseState.current.downTime;
        if (moveDist < 6 && duration < 400) {
          const hitName = pickFloatingItem(e.clientX, e.clientY);
          if (hitName) {
            enterInspectMode(hitName);
          } else {
            trigger360Rotation();
          }
        }
      }
    };

    const handlePointerLeave = () => {
      mouseState.current.isDragging = false;
      mouseState.current.targetX = 0;
      mouseState.current.targetY = 0;
      if (hoveredNameRef.current !== null) {
        hoveredNameRef.current = null;
        setHoveredItemName(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedNameRef.current !== null) {
        handleExitInspect();
      }
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('keydown', handleKeyDown);
    container.addEventListener('pointerleave', handlePointerLeave);

    // 11. Physics and Animation Loop (auto-pauses when scrolled off-screen or tab hidden)
    let animId: number;
    let isContainerVisible = true;
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        isContainerVisible = entries.some((entry) => entry.isIntersecting);
      },
      { threshold: 0.01 }
    );
    visibilityObserver.observe(container);

    const timer = new THREE.Timer();
    const _centrifugalDir = new THREE.Vector3();
    const _pushDir = new THREE.Vector3();
    const _normalCamPos = new THREE.Vector3(0, 2.2, 9.8);
    const _normalLookAt = new THREE.Vector3(0, 0.8, 0);
    const _inspectCamPos = new THREE.Vector3(0, 1.12, 3.35);
    const _inspectLookAt = new THREE.Vector3(0, 1.05, 0);
    const _currentLookAt = new THREE.Vector3(0, 0.8, 0);
    const _targetEuler = new THREE.Euler();
    const _targetQuat = new THREE.Quaternion();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isContainerVisible || document.hidden) return;

      timer.update();
      const dt = Math.min(timer.getDelta(), 0.05);
      const elapsed = timer.getElapsed();
      const activeSelectedName = selectedNameRef.current;
      const isInspecting = activeSelectedName !== null;

      // Mouse parallax lerp
      mouseState.current.currentX += (mouseState.current.targetX - mouseState.current.currentX) * 0.05;
      mouseState.current.currentY += (mouseState.current.targetY - mouseState.current.currentY) * 0.05;

      // Smooth 3D Camera Dolly-Zoom Transition
      const camTargetPos = isInspecting ? _inspectCamPos : _normalCamPos;
      const lookTarget = isInspecting ? _inspectLookAt : _normalLookAt;
      const camLambda = isInspecting ? 8.0 : 7.2;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, camTargetPos.x, camLambda, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, camTargetPos.y, camLambda, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, camTargetPos.z, camLambda, dt);
      _currentLookAt.x = THREE.MathUtils.damp(_currentLookAt.x, lookTarget.x, camLambda, dt);
      _currentLookAt.y = THREE.MathUtils.damp(_currentLookAt.y, lookTarget.y, camLambda, dt);
      _currentLookAt.z = THREE.MathUtils.damp(_currentLookAt.z, lookTarget.z, camLambda, dt);
      camera.lookAt(_currentLookAt);

      // Handle stage orientation (reset cleanly for centered zoom view vs parallax/spin in normal view)
      if (isInspecting) {
        stageGroup.rotation.x = THREE.MathUtils.damp(stageGroup.rotation.x, 0, 8.5, dt);
        stageGroup.rotation.y = THREE.MathUtils.damp(stageGroup.rotation.y, 0, 8.5, dt);
        stageGroup.position.y = THREE.MathUtils.damp(stageGroup.position.y, -0.3, 8.5, dt);
      } else if (spinState.current.isSpinning) {
        const now = performance.now();
        const progress = Math.min(1, (now - spinState.current.startTime) / spinState.current.duration);

        const ease = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        stageGroup.rotation.y =
          spinState.current.startRotY +
          (spinState.current.targetRotY - spinState.current.startRotY) * ease;

        stageGroup.position.y = -0.3 + Math.sin(progress * Math.PI) * 0.32;

        if (progress >= 1) {
          spinState.current.isSpinning = false;
        }
      } else if (!mouseState.current.isDragging) {
        const targetRotY = mouseState.current.currentX * 0.32;
        const targetRotX = -mouseState.current.currentY * 0.18;

        stageGroup.rotation.y += (targetRotY - stageGroup.rotation.y) * 0.05;
        stageGroup.rotation.x += (targetRotX - stageGroup.rotation.x) * 0.05;
        stageGroup.position.y += (-0.3 - stageGroup.position.y) * 0.05;
      }

      // Dynamically animate ambient spotlight (steady studio lighting when zoomed in)
      if (dynamicAmbientLight) {
        if (isInspecting) {
          dynamicAmbientLight.position.x = THREE.MathUtils.damp(dynamicAmbientLight.position.x, 0.8, 6.0, dt);
          dynamicAmbientLight.position.y = THREE.MathUtils.damp(dynamicAmbientLight.position.y, 2.8, 6.0, dt);
          dynamicAmbientLight.position.z = THREE.MathUtils.damp(dynamicAmbientLight.position.z, 2.2, 6.0, dt);
          dynamicAmbientLight.intensity = THREE.MathUtils.damp(dynamicAmbientLight.intensity, 1.5, 6.0, dt);
        } else {
          dynamicAmbientLight.position.x = Math.sin(elapsed * 0.6) * 0.8 + mouseState.current.currentX * 0.5;
          dynamicAmbientLight.position.z = 1.2 + Math.cos(elapsed * 0.5) * 0.6;
          dynamicAmbientLight.position.y = 3.8 + Math.sin(elapsed * 0.8) * 0.2;
          dynamicAmbientLight.intensity = 1.25 + Math.sin(elapsed * 1.2) * 0.15;
        }
      }

      // Cardboard box & grid floor smoothly drop out of frame while inspecting an item
      if (boxGroupRef.current) {
        const targetBoxY = isInspecting ? -2.45 : -0.75 + Math.sin(elapsed * 1.4) * 0.02;
        const targetBoxScale = isInspecting ? 0.55 : 1.0;
        boxGroupRef.current.position.y = THREE.MathUtils.damp(boxGroupRef.current.position.y, targetBoxY, 7.0, dt);
        const curBoxScale = THREE.MathUtils.damp(boxGroupRef.current.scale.x, targetBoxScale, 7.0, dt);
        boxGroupRef.current.scale.setScalar(curBoxScale);
      }
      if (gridFloorRef.current) {
        const targetGridY = isInspecting ? -3.1 : -1.61;
        gridFloorRef.current.position.y = THREE.MathUtils.damp(gridFloorRef.current.position.y, targetGridY, 7.0, dt);
      }
      pMat.opacity = THREE.MathUtils.damp(pMat.opacity, isInspecting ? 0.08 : 0.4, 7.0, dt);

      // Smooth floating / zoom animation for all items
      const isSpinning = spinState.current.isSpinning;
      const items = floatingItemsRef.current;
      const activeHover = hoveredNameRef.current;

      items.forEach((item) => {
        const isThisInspected = isInspecting && item.name === activeSelectedName;
        const isReceded = isInspecting && item.name !== activeSelectedName;

        let targetX = item.basePos.x;
        let targetY = item.basePos.y;
        let targetZ = item.basePos.z;
        let targetScale = item.baseScale;
        let targetEdgeOpacity = 0.20;

        if (isThisInspected) {
          targetX = 0;
          targetY = 1.35 - item.boxCenter.y * item.inspectScale * 0.68 + Math.sin(elapsed * 1.3) * 0.018;
          targetZ = 0;
          targetScale = item.inspectScale;
          targetEdgeOpacity = 0.24;

          item.group.quaternion.slerp(inspectState.current.targetQuat, 1 - Math.exp(-13 * dt));
        } else if (isReceded) {
          targetX = item.basePos.x * 1.45;
          targetY = item.basePos.y + 0.35;
          targetZ = item.basePos.z - 0.8;
          targetScale = 0.001;
          targetEdgeOpacity = 0.0;
        } else {
          const floatY = Math.sin(elapsed * item.speed + item.phase) * item.amplitude;
          const driftX = Math.cos(elapsed * 0.7 + item.phase) * 0.025;
          const driftZ = Math.sin(elapsed * 0.6 + item.phase) * 0.025;

          let dirX = 0;
          let dirY = 0;
          let dirZ = 0;
          if (isSpinning) {
            _centrifugalDir.copy(item.basePos).normalize().multiplyScalar(0.28);
            dirX = _centrifugalDir.x;
            dirY = _centrifugalDir.y;
            dirZ = _centrifugalDir.z;
          }

          targetX = item.basePos.x + driftX + dirX;
          targetY = item.basePos.y + floatY + dirY;
          targetZ = item.basePos.z + driftZ + dirZ;

          const isHovered = activeHover === item.name;
          targetScale = item.baseScale * (isHovered ? 1.07 : 1.0);
          targetEdgeOpacity = isHovered ? 0.52 : 0.20;

          _targetEuler.set(
            item.baseRot.x + Math.sin(elapsed * item.rotSpeed.x + item.phase) * 0.09,
            item.baseRot.y + Math.cos(elapsed * item.rotSpeed.y + item.phase) * 0.09,
            item.baseRot.z + Math.sin(elapsed * item.rotSpeed.z + item.phase) * 0.09
          );
          _targetQuat.setFromEuler(_targetEuler);
          item.group.quaternion.slerp(_targetQuat, 1 - Math.exp(-8 * dt));
        }

        const posLambda = isThisInspected || isReceded ? 9.5 : 7.0;
        item.group.position.x = THREE.MathUtils.damp(item.group.position.x, targetX, posLambda, dt);
        item.group.position.y = THREE.MathUtils.damp(item.group.position.y, targetY, posLambda, dt);
        item.group.position.z = THREE.MathUtils.damp(item.group.position.z, targetZ, posLambda, dt);

        const scaleLambda = isReceded ? 12.5 : isThisInspected ? 9.5 : 8.0;
        const nextScale = THREE.MathUtils.damp(item.group.scale.x, targetScale, scaleLambda, dt);
        item.group.scale.setScalar(nextScale);
        item.group.visible = nextScale > 0.015;

        if (item.edgeMaterials.length > 0) {
          const nextEdgeOp = THREE.MathUtils.damp(item.edgeMaterials[0].opacity, targetEdgeOpacity, 10.0, dt);
          for (let eIdx = 0; eIdx < item.edgeMaterials.length; eIdx++) {
            item.edgeMaterials[eIdx].opacity = nextEdgeOp;
          }
        }
      });

      // Pairwise soft collision avoidance in normal resting mode
      if (!isInspecting) {
        for (let i = 0; i < items.length; i++) {
          const itemA = items[i];
          if (itemA.group.scale.x < itemA.baseScale * 0.85) continue;
          for (let j = i + 1; j < items.length; j++) {
            const itemB = items[j];
            if (itemB.group.scale.x < itemB.baseScale * 0.85) continue;

            const posA = itemA.group.position;
            const posB = itemB.group.position;
            const dist = posA.distanceTo(posB);
            const minDist = itemA.collisionRadius + itemB.collisionRadius;

            if (dist < minDist && dist > 0.001) {
              const overlap = (minDist - dist) * 0.5;
              _pushDir.subVectors(posA, posB).normalize();
              posA.addScaledVector(_pushDir, overlap * 0.2);
              posB.addScaledVector(_pushDir, -overlap * 0.2);
            }
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

    // 12. Resize handling (deferred via rAF + updateStyle=false to prevent ResizeObserver layout loops)
    let resizeRafId: number | null = null;
    let lastObservedW = Math.round(width);
    let lastObservedH = Math.round(height);
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (!entry) return;
      const w = Math.round(entry.contentRect.width);
      const h = Math.round(entry.contentRect.height);
      if (w <= 0 || h <= 0 || (w === lastObservedW && h === lastObservedH)) return;
      if (resizeRafId !== null) cancelAnimationFrame(resizeRafId);
      resizeRafId = requestAnimationFrame(() => {
        resizeRafId = null;
        lastObservedW = w;
        lastObservedH = h;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      });
    });
    resizeObserver.observe(container);

    // 13. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      if (resizeRafId !== null) cancelAnimationFrame(resizeRafId);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('pointerleave', handlePointerLeave);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.LineSegments) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      envRT.dispose();
      renderer.dispose();
    };
  }, [trigger360Rotation, handleExitInspect]);

  // Dynamically transform 3D box color and textures live whenever theme changes
  useEffect(() => {
    if (boxGroupRef.current && appliedThemeIdRef.current !== currentTheme.id) {
      appliedThemeIdRef.current = currentTheme.id;
      applyThemeToSolid3DCardboardBox(boxGroupRef.current, currentTheme);
    }
  }, [currentTheme]);

  const cursorClass = selectedItemName
    ? isDraggingInspectUi
      ? 'cursor-grabbing'
      : 'cursor-grab'
    : hoveredItemName
      ? 'cursor-pointer'
      : 'cursor-default';

  const displayTitle = selectedItemName
    ? ITEM_DISPLAY_LABELS[selectedItemName] ?? selectedItemName
    : hoveredItemName
      ? ITEM_DISPLAY_LABELS[hoveredItemName] ?? hoveredItemName
      : null;

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-xl mx-auto py-2 select-none">
      {/* Main Interactive 3D Stage Container */}
      <div
        ref={containerRef}
        className={`relative w-full aspect-square max-h-[500px] sm:max-h-[560px] rounded-3xl overflow-visible flex items-center justify-center group touch-none ${cursorClass}`}
        aria-label={
          selectedItemName
            ? `Inspecting 3D ${displayTitle}. Click and drag to rotate 360 degrees.`
            : 'Interactive 3D Community Box. Click any floating item to inspect in 3D.'
        }
      >
        {/* Corner Back Arrow Button (shown in Zoom Inspect View) */}
        {selectedItemName && (
          <button
            type="button"
            onClick={handleExitInspect}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Back to full 3D box view"
            className="absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold text-slate-900 shadow-lg border border-slate-200 transition-transform duration-150 hover:scale-105 hover:bg-white active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 stroke-[2.25]" />
            <span>Back</span>
          </button>
        )}

        {/* Bottom Center Label & Drag Cue */}
        {selectedItemName && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 flex items-center gap-2 rounded-xl bg-slate-900/90 px-3.5 py-2 text-xs font-medium text-white shadow-lg border border-white/15 whitespace-nowrap">
            <Rotate3d className="h-3.5 w-3.5 text-sky-300 shrink-0" />
            <span className="font-semibold">{displayTitle}</span>
            <span className="text-slate-300">· Drag to rotate</span>
          </div>
        )}

        {/* Three.js Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain pointer-events-auto block focus:outline-none"
        />
      </div>
    </div>
  );
};
