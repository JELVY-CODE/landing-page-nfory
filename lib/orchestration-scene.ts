import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { getMoonState } from "@/lib/moon";
import { LINKS, NODES, STAGES, type NodeId } from "@/lib/orchestration";
import { visibleOne } from "@/lib/dom";

const COLORS = {
  indigo: 0x6366f1,
  violet: 0x8b5cf6,
  lilac: 0xa78bfa,
  context: 0x818cf8,
  pipe: 0xc3c4cd,
};

const SIZE = 2.4;
const PIPE_Y = 0.12;
const EDGE_MS = 1150;
const MAX_DPR = 2;
const TUBE_SEGMENTS = 180;
const TUBE_RADIAL = 18;

type Block = {
  group: THREE.Group;
  materials: THREE.MeshPhysicalMaterial[];
  edges: THREE.LineBasicMaterial;
  leds: THREE.MeshBasicMaterial[];
  label: HTMLDivElement;
  anchor: HTMLDivElement;
  anchorPoint: THREE.Vector3;
  ring: THREE.Mesh<THREE.TorusGeometry, THREE.MeshBasicMaterial>;
  top: number;
  activation: number;
  hover: number;
  target: number;
  baseY: number;
  phase: number;
};

type Pipe = {
  curve: THREE.CurvePath<THREE.Vector3>;
  lit: THREE.Mesh<THREE.TubeGeometry, THREE.MeshBasicMaterial>;
  packets: THREE.Mesh[];
};

export type OrchestrationScene = {
  run: (onStage: (index: number) => void) => Promise<void>;
  zoom: (factor: number) => void;
  dispose: () => void;
};

const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

function elbowCurve(from: THREE.Vector3, corner: THREE.Vector3, to: THREE.Vector3, radius = 0.7) {
  const path = new THREE.CurvePath<THREE.Vector3>();
  const inDir = corner.clone().sub(from);
  const outDir = to.clone().sub(corner);
  const r = Math.min(radius, inDir.length() / 2, outDir.length() / 2);
  if (r < 0.01) {
    path.add(new THREE.LineCurve3(from, to));
    return path;
  }
  const a = corner.clone().sub(inDir.normalize().multiplyScalar(r));
  const b = corner.clone().add(outDir.normalize().multiplyScalar(r));
  if (from.distanceTo(a) > 0.001) path.add(new THREE.LineCurve3(from, a));
  path.add(new THREE.QuadraticBezierCurve3(a, corner, b));
  if (b.distanceTo(to) > 0.001) path.add(new THREE.LineCurve3(b, to));
  return path;
}

type SceneCopy = { labels: Record<NodeId, string>; details: Record<NodeId, string> };

const REST_DIRECTION = new THREE.Vector3(1, 0.88, 1).normalize();
const FIT_MARGIN = 0.92;
const HOME_TARGET = new THREE.Vector3(0, 0.8, 0);
const MIN_DISTANCE = 14;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

const MOON_DEPTH_PX = 1400;

const FLOW_SHADER = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uTime;
    uniform float uRepeat;
    uniform float uIntensity;
    varying vec2 vUv;
    void main() {
      float s = fract(vUv.x * uRepeat - uTime * 0.9);
      float dash = smoothstep(0.0, 0.12, s) * (1.0 - smoothstep(0.12, 0.55, s));
      float light = 0.25 + dash * uIntensity;
      gl_FragColor = vec4(uColor * light, 0.18 + dash * 0.7);
    }
  `,
};

const GRID_SHADER = {
  vertexShader: `
    varying vec2 vPos;
    void main() {
      vPos = position.xy;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uTime;
    varying vec2 vPos;
    float gridLine(vec2 p, float size) {
      vec2 g = abs(fract(p / size - 0.5) - 0.5) / fwidth(p / size);
      return 1.0 - min(min(g.x, g.y), 1.0);
    }
    void main() {
      float r = length(vPos);
      float fade = smoothstep(13.0, 3.0, r);
      float minor = gridLine(vPos, 1.0) * 0.1;
      float major = gridLine(vPos, 4.0) * 0.32;
      float pulse = 0.5 + 0.5 * sin(r * 0.9 - uTime * 1.2);
      float alpha = max(minor, major) * fade * (0.55 + 0.45 * pulse);
      gl_FragColor = vec4(uColor, alpha);
    }
  `,
};

export function createOrchestrationScene(container: HTMLElement, copy: SceneCopy): OrchestrationScene {
  const width = () => Math.max(1, container.clientWidth);
  const height = () => Math.max(1, container.clientHeight);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
  renderer.setSize(width(), height());
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.classList.add("block", "h-full", "w-full", "outline-none");
  container.appendChild(renderer.domElement);

  const labelLayer = document.createElement("div");
  labelLayer.className = "pointer-events-none absolute inset-0 overflow-hidden";
  container.appendChild(labelLayer);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(32, width() / height(), 0.1, 100);
  const fitPoints = NODES.flatMap((node) =>
    [-1, 1].flatMap((sx) =>
      [-1, 1].flatMap((sz) =>
        [0, node.h + 1.4].map((y) => new THREE.Vector3(node.cx + (sx * SIZE) / 2, y, node.cy + (sz * SIZE) / 2)),
      ),
    ),
  );
  const probe = new THREE.PerspectiveCamera();
  const probePoint = new THREE.Vector3();

  const fitDistance = (direction: THREE.Vector3 = REST_DIRECTION) => {
    probe.copy(camera);
    probe.aspect = width() / height();
    probe.updateProjectionMatrix();
    const fits = (distance: number) => {
      probe.position.copy(HOME_TARGET).addScaledVector(direction, distance);
      probe.lookAt(HOME_TARGET);
      probe.updateMatrixWorld();
      for (const point of fitPoints) {
        probePoint.copy(point).project(probe);
        if (Math.abs(probePoint.x) > FIT_MARGIN || Math.abs(probePoint.y) > FIT_MARGIN) return false;
      }
      return true;
    };
    let low = 6;
    let high = 90;
    for (let i = 0; i < 18; i++) {
      const mid = (low + high) / 2;
      if (fits(mid)) high = mid;
      else low = mid;
    }
    return high;
  };

  let restDistance = fitDistance();
  const viewDirection = new THREE.Vector3();
  const restPosition = () => HOME_TARGET.clone().addScaledVector(REST_DIRECTION, restDistance);
  camera.position.copy(restPosition());

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(HOME_TARGET);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.minPolarAngle = 0.45;
  controls.maxPolarAngle = 2.15;
  controls.update();

  scene.add(new THREE.HemisphereLight(0x8b8ff8, 0x0a0a12, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(-10, 16, -8);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -12;
  key.shadow.camera.right = 12;
  key.shadow.camera.top = 12;
  key.shadow.camera.bottom = -12;
  key.shadow.radius = 6;
  key.shadow.bias = -0.0005;
  scene.add(key);
  const rim = new THREE.DirectionalLight(COLORS.violet, 1.4);
  rim.position.set(14, 5, -8);
  scene.add(rim);
  const under = new THREE.DirectionalLight(COLORS.indigo, 0.9);
  under.position.set(2, -10, 4);
  scene.add(under);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(13, 64),
    new THREE.MeshPhysicalMaterial({
      color: 0x1c1c30,
      roughness: 0.45,
      metalness: 0.15,
      clearcoat: 0.35,
      clearcoatRoughness: 0.5,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const gridUniforms = { uColor: { value: new THREE.Color(COLORS.lilac) }, uTime: { value: 0 } };
  const grid = new THREE.Mesh(
    new THREE.PlaneGeometry(28, 28),
    new THREE.ShaderMaterial({ ...GRID_SHADER, uniforms: gridUniforms, transparent: true, depthWrite: false, side: THREE.DoubleSide }),
  );
  grid.rotation.x = -Math.PI / 2;
  grid.position.y = 0.006;
  scene.add(grid);

  const moonDirection = new THREE.Vector3();
  let moonState = getMoonState();
  const moonTimer = window.setInterval(() => (moonState = getMoonState()), 30_000);

  const aimAtMoon = () => {
    const moonElement = visibleOne("[data-moon]");
    const box = renderer.domElement.getBoundingClientRect();
    const moonBox = moonElement?.getBoundingClientRect();
    const moonX = moonBox ? moonBox.left + moonBox.width / 2 : moonState.x * window.innerWidth;
    const moonY = moonBox ? moonBox.top + moonBox.height / 2 : moonState.y * window.innerHeight;
    moonDirection
      .set(moonX - (box.left + box.width / 2), (box.top + box.height / 2) - moonY, -MOON_DEPTH_PX)
      .normalize()
      .applyQuaternion(camera.quaternion);
    key.position.copy(controls.target).addScaledVector(moonDirection, 24);
    key.intensity = 0.6 + moonState.illumination * 0.9;
  };

  const blocks = new Map<NodeId, Block>();
  const hitTargets: THREE.Mesh[] = [];
  const ripples: { mesh: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>; start: number }[] = [];
  const rippleGeometry = new THREE.RingGeometry(1.7, 1.85, 64);

  for (const [index, node] of NODES.entries()) {
    const group = new THREE.Group();
    group.position.set(node.cx, 0, node.cy);
    const levels = node.stack ?? 1;
    const levelHeight = node.h / levels;
    const gap = levels > 1 ? 0.14 : 0;
    const materials: THREE.MeshPhysicalMaterial[] = [];
    const leds: THREE.MeshBasicMaterial[] = [];
    const edges = new THREE.LineBasicMaterial({ color: COLORS.lilac, transparent: true, opacity: 0.35 });

    for (let level = 0; level < levels; level++) {
      const h = levelHeight - (levels > 1 ? gap : 0);
      const geometry = new RoundedBoxGeometry(SIZE, h, SIZE, 8, 0.16);
      const material = new THREE.MeshPhysicalMaterial({
        color: level === levels - 1 ? 0x7c80f7 : COLORS.indigo,
        roughness: 0.32,
        metalness: 0.15,
        clearcoat: 0.35,
        clearcoatRoughness: 0.45,
        emissive: new THREE.Color(COLORS.violet),
        emissiveIntensity: 0,
      });
      materials.push(material);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = level * levelHeight + h / 2 + (level > 0 ? gap / 2 : 0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData.nodeId = node.id;
      hitTargets.push(mesh);
      group.add(mesh);

      const outline = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(SIZE + 0.02, h + 0.02, SIZE + 0.02)), edges);
      outline.position.copy(mesh.position);
      group.add(outline);

      for (const offset of [-0.55, -0.15]) {
        const led = new THREE.MeshBasicMaterial({ color: 0x2a2760, toneMapped: false });
        leds.push(led);
        const dot = new THREE.Mesh(new THREE.CircleGeometry(0.075, 16), led);
        dot.position.set(SIZE / 2 + 0.011, mesh.position.y, offset);
        dot.rotation.y = Math.PI / 2;
        group.add(dot);
      }
    }

    const anchor = document.createElement("div");
    anchor.className = "absolute top-0 left-0 flex flex-col items-center";
    anchor.dataset.label = "";
    const label = document.createElement("div");
    label.className =
      "group/label pointer-events-auto cursor-pointer rounded-lg border border-white/12 bg-[#0c0c11] px-2.5 py-1 text-center text-zinc-100 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.85)] transition-[color,border-color,box-shadow] duration-300 ease-out data-[open=true]:border-violet-400/60";
    const title = document.createElement("p");
    title.textContent = copy.labels[node.id];
    title.className = "font-sans text-[12px] leading-4 font-semibold tracking-wide whitespace-nowrap uppercase";
    const detail = document.createElement("p");
    detail.className =
      "hidden w-60 pt-1.5 pb-1 text-left font-sans text-[13px] leading-relaxed font-normal tracking-normal whitespace-normal text-zinc-200 normal-case group-data-[open=true]/label:block";
    detail.textContent = copy.details[node.id];
    label.append(title, detail);
    const leader = document.createElement("span");
    leader.className = "h-4 w-px bg-gradient-to-b from-white/30 to-white/0";
    anchor.append(label, leader);
    labelLayer.append(anchor);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.95, 0.025, 12, 160),
      new THREE.MeshBasicMaterial({ color: COLORS.lilac, toneMapped: false, transparent: true, opacity: 0 }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = node.h + 0.25;
    group.add(ring);

    scene.add(group);
    blocks.set(node.id, { group, materials, edges, leds, label, anchor, anchorPoint: new THREE.Vector3(0, node.h + 0.1, 0), ring, top: node.h, activation: 0, hover: 0, target: 0, baseY: 0, phase: index * 1.3 });
  }

  const center = (id: NodeId) => {
    const node = NODES.find((item) => item.id === id)!;
    return new THREE.Vector3(node.cx, PIPE_Y, node.cy);
  };

  const pipes = new Map<string, Pipe>();
  const flowUniforms: { uTime: { value: number } }[] = [];
  const packetGeometry = new THREE.CapsuleGeometry(0.045, 0.24, 8, 16);
  const shellMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xd9dbf5,
    roughness: 0.12,
    metalness: 0.1,
    clearcoat: 1,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
  });
  const metalMaterial = new THREE.MeshStandardMaterial({ color: COLORS.pipe, roughness: 0.3, metalness: 0.85 });
  const flangeGeometry = new THREE.TorusGeometry(0.15, 0.04, 16, 48);
  const jointGeometry = new THREE.SphereGeometry(0.15, 32, 32);

  for (const link of LINKS) {
    const a = center(link.from);
    const b = center(link.to);
    const corner = link.pipe ? new THREE.Vector3(b.x, PIPE_Y, a.z) : new THREE.Vector3(a.x, PIPE_Y, b.z);
    const curve = elbowCurve(a, corner, b);

    if (link.pipe) {
      const shell = new THREE.Mesh(new THREE.TubeGeometry(curve, TUBE_SEGMENTS, 0.12, TUBE_RADIAL), shellMaterial);
      shell.renderOrder = 2;
      scene.add(shell);

      const uniforms = {
        uColor: { value: new THREE.Color(COLORS.lilac) },
        uTime: { value: 0 },
        uRepeat: { value: curve.getLength() / 1.4 },
        uIntensity: { value: 1.6 },
      };
      flowUniforms.push(uniforms);
      const core = new THREE.Mesh(
        new THREE.TubeGeometry(curve, TUBE_SEGMENTS, 0.04, 12),
        new THREE.ShaderMaterial({ ...FLOW_SHADER, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
      );
      scene.add(core);

      for (const [end, toward] of [
        [a, curve.getPointAt(0.02)],
        [b, curve.getPointAt(0.98)],
      ] as const) {
        const direction = toward.clone().sub(end).setY(0).normalize();
        const flange = new THREE.Mesh(flangeGeometry, metalMaterial);
        flange.position.copy(end).addScaledVector(direction, SIZE / 2 + 0.06);
        flange.lookAt(flange.position.clone().add(direction));
        flange.castShadow = true;
        scene.add(flange);
      }
      const joint = new THREE.Mesh(jointGeometry, metalMaterial);
      joint.position.copy(corner);
      joint.castShadow = true;
      scene.add(joint);
    }

    const lit = new THREE.Mesh(
      new THREE.TubeGeometry(curve, TUBE_SEGMENTS, 0.085, TUBE_RADIAL),
      new THREE.MeshBasicMaterial({ color: link.pipe ? COLORS.lilac : COLORS.context, toneMapped: false, transparent: true, opacity: 0.95 }),
    );
    lit.geometry.setDrawRange(0, 0);
    lit.renderOrder = 3;
    scene.add(lit);

    const packets: THREE.Mesh[] = [];
    if (link.pipe) {
      for (let i = 0; i < 2; i++) {
        const packet = new THREE.Mesh(packetGeometry, new THREE.MeshBasicMaterial({ color: COLORS.lilac, toneMapped: false, transparent: true, opacity: 0.55 }));
        packet.userData.offset = i / 2;
        scene.add(packet);
        packets.push(packet);
      }
    }
    pipes.set(`${link.from}-${link.to}`, { curve, lit, packets });
  }

  const pulse = new THREE.Group();
  const pulseHead = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), new THREE.MeshBasicMaterial({ color: 0xf5f3ff, toneMapped: false }));
  pulse.add(pulseHead);
  const pulseLight = new THREE.PointLight(COLORS.violet, 3.5, 3, 2);
  pulse.add(pulseLight);
  pulse.visible = false;
  scene.add(pulse);
  const trail = Array.from({ length: 5 }, (_, i) => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.16 - i * 0.025, 20, 20),
      new THREE.MeshBasicMaterial({ color: COLORS.lilac, toneMapped: false, transparent: true, opacity: 0.7 - i * 0.12 }),
    );
    mesh.visible = false;
    scene.add(mesh);
    return mesh;
  });

  const flash = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xede9fe, toneMapped: false, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  flash.visible = false;
  scene.add(flash);
  let flashStart = -Infinity;
  const UP = new THREE.Vector3(0, 1, 0);
  const tangent = new THREE.Vector3();

  const composer = new EffectComposer(
    renderer,
    new THREE.WebGLRenderTarget(width() * renderer.getPixelRatio(), height() * renderer.getPixelRatio(), {
      type: THREE.HalfFloatType,
      samples: 4,
    }),
  );
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(width(), height()), 0.5, 0.45, 0.88);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const setActive = (id: NodeId, active: boolean) => {
    const block = blocks.get(id);
    if (!block) return;
    block.target = active ? 1 : 0;
    block.label.classList.toggle("text-white", active);
    block.label.classList.toggle("border-violet-400/60", active);
    block.label.classList.toggle("shadow-[0_0_18px_-2px_rgb(139_92_246/0.8)]", active);
    if (active) {
      const ripple = new THREE.Mesh(rippleGeometry, new THREE.MeshBasicMaterial({ color: COLORS.violet, transparent: true, opacity: 0.8, toneMapped: false, side: THREE.DoubleSide }));
      ripple.rotation.x = -Math.PI / 2;
      ripple.position.set(block.group.position.x, 0.02, block.group.position.z);
      scene.add(ripple);
      ripples.push({ mesh: ripple, start: performance.now() });
    }
  };

  let firing: { pipe: Pipe; start: number; resolve: () => void } | null = null;
  let running = false;
  let disposed = false;

  const fire = (edgeId: string) =>
    new Promise<void>((resolve) => {
      const pipe = pipes.get(edgeId);
      if (!pipe || disposed) return resolve();
      pipe.lit.geometry.setDrawRange(0, 0);
      firing = { pipe, start: performance.now(), resolve };
    });

  const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

  const run: OrchestrationScene["run"] = async (onStage) => {
    if (running) return;
    running = true;
    for (const id of blocks.keys()) setActive(id, false);
    for (const pipe of pipes.values()) pipe.lit.geometry.setDrawRange(0, 0);
    for (const [index, stage] of STAGES.entries()) {
      if (disposed) return;
      onStage(index);
      stage.nodes.forEach((id) => setActive(id, true));
      await wait(420);
      for (const edgeId of stage.next) await fire(edgeId);
    }
    await wait(250);
    running = false;
  };

  let lastFrame = 0;
  let elapsed = 0;
  const temp = new THREE.Vector3();
  let frameId: number | null = null;
  let visible = false;

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hovered: NodeId | null = null;
  let pinned: NodeId | null = null;
  let pressed: { x: number; y: number } | null = null;
  let zoomDistance = restDistance;
  let userZoomed = false;

  const zoom = (factor: number) => {
    userZoomed = true;
    zoomDistance = THREE.MathUtils.clamp(zoomDistance * factor, Math.min(MIN_DISTANCE, restDistance), restDistance);
  };

  const onWheel = (event: WheelEvent) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    zoom(Math.exp(event.deltaY * 0.0015));
  };

  const pick = (event: PointerEvent): NodeId | null => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    return (raycaster.intersectObjects(hitTargets, false)[0]?.object.userData.nodeId as NodeId | undefined) ?? null;
  };

  const syncLabels = () => {
    for (const [id, block] of blocks) block.label.dataset.open = String(pinned ? pinned === id : hovered === id);
    renderer.domElement.style.cursor = hovered ? "pointer" : "";
  };

  const setHovered = (id: NodeId | null) => {
    if (id === hovered) return;
    hovered = id;
    syncLabels();
  };

  const togglePin = (id: NodeId | null) => {
    pinned = id && pinned !== id ? id : null;
    syncLabels();
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === "mouse" && !pressed) setHovered(pick(event));
  };
  const onPointerDown = (event: PointerEvent) => {
    pressed = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: PointerEvent) => {
    const start = pressed;
    pressed = null;
    if (!start || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6) return;
    togglePin(pick(event));
  };
  const onPointerLeave = () => setHovered(null);
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && pinned) togglePin(null);
  };
  window.addEventListener("keydown", onKeyDown);

  for (const [id, block] of blocks) {
    block.label.addEventListener("click", () => togglePin(id));
    block.label.addEventListener("pointerenter", () => setHovered(id));
    block.label.addEventListener("pointerleave", () => setHovered(null));
  }

  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("pointerup", onPointerUp);
  renderer.domElement.addEventListener("pointerleave", onPointerLeave);
  renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

  const projected = new THREE.Vector3();
  const placeLabels = () => {
    const w = width();
    const h = height();
    const layerBox = labelLayer.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    for (const [id, block] of blocks) {
      projected.copy(block.anchorPoint).applyMatrix4(block.group.matrixWorld).project(camera);
      const hidden = projected.z > 1;
      block.anchor.style.visibility = hidden ? "hidden" : "visible";
      if (hidden) continue;
      const boxWidth = block.anchor.offsetWidth;
      const boxHeight = block.anchor.offsetHeight;
      const x = THREE.MathUtils.clamp(((projected.x + 1) / 2) * w - boxWidth / 2, 6, Math.max(6, w - boxWidth - 6));
      const y = THREE.MathUtils.clamp(((1 - projected.y) / 2) * h - boxHeight, 6, Math.max(6, h - boxHeight - 6));
      const snapX = Math.round((layerBox.left + x) * dpr) / dpr - layerBox.left;
      const snapY = Math.round((layerBox.top + y) * dpr) / dpr - layerBox.top;
      block.anchor.style.transform = `translate(${snapX}px, ${snapY}px)`;
      block.anchor.style.zIndex = String((pinned ?? hovered) === id ? 1000 : Math.round((1 - projected.z) * 900));
    }
  };
  const frame = () => {
    frameId = requestAnimationFrame(frame);
    const now = performance.now();
    const delta = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 1 / 60;
    lastFrame = now;
    elapsed += delta;
    const time = elapsed;
    const ease = 1 - Math.exp(-delta * 6);

    gridUniforms.uTime.value = time;
    aimAtMoon();

    for (const [id, block] of blocks) {
      block.activation += (block.target - block.activation) * ease;
      block.hover += ((hovered === id || pinned === id ? 1 : 0) - block.hover) * (1 - Math.exp(-delta * 10));
      block.group.position.y = block.activation * 0.18 + block.hover * 0.12;
      for (const material of block.materials) material.emissiveIntensity = block.activation * 0.85 + block.hover * 0.25;
      block.edges.opacity = 0.35 + Math.max(block.activation, block.hover) * 0.6;
      block.ring.material.opacity = block.activation * 0.85;
      block.ring.rotation.z = time * 0.8 + block.phase;
      block.ring.scale.setScalar(1 + Math.sin(time * 2 + block.phase) * 0.03);
      for (const [i, led] of block.leds.entries()) {
        const blink = 0.5 + 0.5 * Math.sin(time * 6 + i * 1.7 + block.phase);
        led.color.setHex(block.activation > 0.5 ? (blink > 0.3 ? 0xf5f3ff : COLORS.lilac) : 0x2a2760);
      }
    }

    for (const uniforms of flowUniforms) uniforms.uTime.value = time;

    for (const pipe of pipes.values()) {
      for (const packet of pipe.packets) {
        const t = (time * 0.16 + (packet.userData.offset as number)) % 1;
        pipe.curve.getPointAt(t, temp);
        packet.position.copy(temp);
        packet.quaternion.setFromUnitVectors(UP, pipe.curve.getTangentAt(t, tangent));
        (packet.material as THREE.MeshBasicMaterial).opacity = (running ? 0.2 : 0.85) * Math.sin(t * Math.PI);
      }
    }

    if (firing) {
      const raw = Math.min(1, (now - firing.start) / EDGE_MS);
      const t = easeInOut(raw);
      const { curve, lit } = firing.pipe;
      const indexCount = lit.geometry.index?.count ?? 0;
      lit.geometry.setDrawRange(0, Math.floor((indexCount * t) / (TUBE_RADIAL * 6)) * TUBE_RADIAL * 6);
      curve.getPointAt(t, temp);
      pulse.visible = true;
      pulse.position.copy(temp);
      pulseHead.scale.setScalar(1 + Math.sin(time * 18) * 0.12);
      trail.forEach((mesh, i) => {
        const back = Math.max(0, t - (i + 1) * 0.035);
        curve.getPointAt(back, mesh.position);
        mesh.visible = back > 0;
      });
      if (raw >= 1) {
        lit.geometry.setDrawRange(0, indexCount);
        pulse.visible = false;
        trail.forEach((mesh) => (mesh.visible = false));
        flash.position.copy(curve.getPointAt(1, temp));
        flashStart = now;
        const done = firing.resolve;
        firing = null;
        done();
      }
    }

    const flashProgress = (now - flashStart) / 450;
    flash.visible = flashProgress < 1;
    if (flash.visible) {
      flash.scale.setScalar(0.4 + easeOutCubic(flashProgress) * 1.2);
      flash.material.opacity = 0.55 * (1 - flashProgress);
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i];
      const progress = (now - ripple.start) / 1200;
      ripple.mesh.scale.setScalar(1 + progress * 1.6);
      ripple.mesh.material.opacity = Math.max(0, 0.8 * (1 - progress));
      if (progress >= 1) {
        scene.remove(ripple.mesh);
        ripple.mesh.material.dispose();
        ripples.splice(i, 1);
      }
    }

    {
      viewDirection.copy(camera.position).sub(controls.target).normalize();
      const fit = fitDistance(viewDirection);
      zoomDistance = userZoomed ? Math.min(zoomDistance, fit) : fit;
      restDistance = fit;
      const offset = temp.copy(camera.position).sub(controls.target);
      const distance = offset.length();
      offset.setLength(distance + (zoomDistance - distance) * (1 - Math.exp(-delta * 8)));
      camera.position.copy(controls.target).add(offset);
      controls.update(delta);
    }
    composer.render(delta);
    placeLabels();
  };

  const start = () => {
    if (frameId !== null || !visible || document.hidden || disposed) return;
    lastFrame = 0;
    frameId = requestAnimationFrame(frame);
  };
  const stop = () => {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
  };

  const resize = () => {
    const w = width();
    const h = height();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    restDistance = fitDistance();
    zoomDistance = userZoomed ? Math.min(zoomDistance, restDistance) : restDistance;
    renderer.setSize(w, h);
    composer.setPixelRatio(renderer.getPixelRatio());
    composer.setSize(w, h);
    bloom.resolution.set(w, h);
    if (frameId === null) {
      composer.render(0);
      placeLabels();
    }
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });
  intersection.observe(container);
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVisibility);

  composer.render(0);
  placeLabels();

  const dispose = () => {
    disposed = true;
    stop();
    firing?.resolve();
    window.clearInterval(moonTimer);
    window.removeEventListener("keydown", onKeyDown);
    resizeObserver.disconnect();
    intersection.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    renderer.domElement.removeEventListener("pointermove", onPointerMove);
    renderer.domElement.removeEventListener("pointerdown", onPointerDown);
    renderer.domElement.removeEventListener("pointerup", onPointerUp);
    renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
    renderer.domElement.removeEventListener("wheel", onWheel);
    controls.dispose();
    scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      mesh.geometry?.dispose();
      const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(material)) material.forEach((item) => item.dispose());
      else material?.dispose();
    });
    composer.dispose();
    renderer.dispose();
    renderer.domElement.remove();
    labelLayer.remove();
  };

  return { run, zoom, dispose };
}
