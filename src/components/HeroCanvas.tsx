"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { ScreenQuad, useFBO } from "@react-three/drei";
import { site } from "@/lib/site";

const PAPER = "#f4f2ec";
const INK = "#111110";
const ACCENT = "#2621eb";

/** Resolution of the fluid velocity simulation (square texture). */
const FLUID_SIZE = 192;

/* ------------------------------------------------------------------ */
/* Shaders                                                              */
/* ------------------------------------------------------------------ */

const fullscreenVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * Fluid velocity field: every frame the field advects itself (velocity
 * carries velocity, which is what makes trails curl and flow like a
 * liquid), dissipates a little, and receives a soft gaussian splat of
 * the cursor's velocity. The result relaxes slowly and organically
 * instead of snapping back.
 */
const fluidFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uPrev;
  uniform vec2 uMouse;     // cursor position in uv space
  uniform vec2 uVelocity;  // smoothed cursor velocity, uv/frame
  uniform float uAspect;
  uniform float uDissipation;

  varying vec2 vUv;

  void main() {
    // Self-advection: look back along the local flow.
    vec2 vel = texture2D(uPrev, vUv).xy;
    vel = texture2D(uPrev, vUv - vel * 0.75).xy * uDissipation;

    // Inject the cursor's motion as a soft splat.
    vec2 d = vUv - uMouse;
    d.x *= uAspect;
    vel += uVelocity * exp(-dot(d, d) * 170.0);

    gl_FragColor = vec4(vel, 0.0, 1.0);
  }
`;

/**
 * Composite pass: displace the rendered hero along the fluid velocity
 * and split the RGB channels along the same direction — the reference
 * "digital glass prism" fringe, driven by the fluid rather than raw
 * cursor speed.
 */
const compositeFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uScene;
  uniform sampler2D uFlow;
  uniform float uStrength;

  varying vec2 vUv;

  void main() {
    vec2 vel = texture2D(uFlow, vUv).xy;

    // Soft-limit so violent swipes stay elegant.
    float m = length(vel);
    if (m > 0.05) vel *= 0.05 / m;

    vec2 uv = vUv - vel * uStrength;
    vec2 offset = vel * uStrength * 0.35;

    float r = texture2D(uScene, uv - offset).r;
    float g = texture2D(uScene, uv).g;
    float b = texture2D(uScene, uv + offset).b;

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

/* ------------------------------------------------------------------ */
/* Canvas-drawn text textures.                                          */
/* All type in the WebGL scene is rasterized from the already-loaded    */
/* webfont into textures — no SDF text engine, so it runs on any GPU.   */
/* ------------------------------------------------------------------ */

function drawWhenFontReady(draw: () => void) {
  draw();
  let cancelled = false;
  document.fonts
    .load('700 100px "Familjen Grotesk"')
    .then(() => {
      if (!cancelled) draw();
    })
    .catch(() => {});
  return () => {
    cancelled = true;
  };
}

/** Editorial flare: accent-colored characters, keyed by line → index. */
const ACCENT_GLYPHS: Record<number, number[]> = {
  1: [5], // the O in PARCIOAGA — ultramarine, echoes the ● motif
};

/** Two-line hero name, rasterized at high resolution, per-glyph styled. */
function useNameTexture() {
  const gl = useThree((state) => state.gl);
  const [result, setResult] = useState<{
    texture: THREE.CanvasTexture;
    aspect: number; // height / width
    padX: number; //   horizontal padding as a fraction of texture width
  } | null>(null);

  useEffect(() => {
    const fontSize = 480;
    // No added tracking: the hero sets at the family's native metrics.
    const tracking = 0;
    const lineHeight = fontSize * 0.9;
    const pad = 32;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lines = [site.firstName, site.lastName];
    const font = `700 ${fontSize}px "Familjen Grotesk", sans-serif`;

    // Whole lines are laid out by the browser so the family's native
    // kerning pairs stay intact; tracking rides on top via letterSpacing.
    const setType = () => {
      ctx.font = font;
      ctx.letterSpacing = `${tracking}px`;
      ctx.textBaseline = "top";
    };

    setType();
    canvas.width =
      Math.ceil(Math.max(...lines.map((l) => ctx.measureText(l).width))) +
      pad * 2;

    // Measure the real glyph extent of the bottom line rather than
    // approximating from the font size — rounded glyphs (O, G, A)
    // overshoot the baseline and were getting clipped.
    setType();
    const bottomLineDescent = Math.ceil(
      ctx.measureText(lines[lines.length - 1]).actualBoundingBoxDescent
    );
    canvas.height = Math.ceil(lineHeight * (lines.length - 1) + bottomLineDescent) + pad * 2;

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = gl.capabilities.getMaxAnisotropy();
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setType();

      lines.forEach((line, lineIndex) => {
        const y = pad + lineIndex * lineHeight;
        ctx.fillStyle = INK;
        ctx.fillText(line, pad, y);

        // Accent glyphs: repaint the full (correctly kerned) line in the
        // accent color, clipped to just that character's advance span.
        for (const charIndex of ACCENT_GLYPHS[lineIndex] ?? []) {
          const before = ctx.measureText(line.slice(0, charIndex)).width;
          const upTo = ctx.measureText(line.slice(0, charIndex + 1)).width;
          ctx.save();
          ctx.beginPath();
          ctx.rect(
            pad + before,
            y - fontSize * 0.2,
            upTo - before,
            fontSize * 1.5
          );
          ctx.clip();
          ctx.fillStyle = ACCENT;
          ctx.fillText(line, pad, y);
          ctx.restore();
        }
      });

      tex.needsUpdate = true;
    };

    const cancel = drawWhenFontReady(draw);
    setResult({
      texture: tex,
      aspect: canvas.height / canvas.width,
      padX: pad / canvas.width,
    });

    return () => {
      cancel();
      tex.dispose();
    };
  }, [gl]);

  return result;
}

/** Seamless repeating "PRODUCT ● CREATIVE ● HUMAN" band for the drum. */
function useBandTexture() {
  const gl = useThree((state) => state.gl);
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    // Canvas aspect ≈ drum circumference : drum height, so glyphs keep
    // their true proportions once wrapped around the cylinder.
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.anisotropy = gl.capabilities.getMaxAnisotropy();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.textBaseline = "middle";
      const fontSize = 190;
      ctx.font = `700 ${fontSize}px "Familjen Grotesk", sans-serif`;

      // Ink words separated by accent circles, scaled to exactly fill
      // the width so the band tiles seamlessly around the drum.
      const words = ["PRODUCT", "CREATIVE", "HUMAN"];
      const gap = fontSize * 0.42;
      const dotR = fontSize * 0.13;

      const total =
        words.reduce((sum, word) => sum + ctx.measureText(word).width, 0) +
        words.length * (gap * 2 + dotR * 2);
      const scale = canvas.width / total;

      ctx.save();
      ctx.scale(scale, scale);
      let x = 0;
      const mid = canvas.height / 2 / scale;
      for (const word of words) {
        ctx.fillStyle = INK;
        ctx.fillText(word, x, mid);
        x += ctx.measureText(word).width + gap;

        ctx.fillStyle = ACCENT;
        ctx.beginPath();
        ctx.arc(x + dotR, mid, dotR, 0, Math.PI * 2);
        ctx.fill();
        x += dotR * 2 + gap;
      }
      ctx.restore();

      tex.needsUpdate = true;
    };

    const cancel = drawWhenFontReady(draw);
    setTexture(tex);

    return () => {
      cancel();
      tex.dispose();
    };
  }, [gl]);

  return texture;
}

/* ------------------------------------------------------------------ */
/* The spinning text drum                                               */
/* ------------------------------------------------------------------ */

function TextDrum({
  position,
  radius,
}: {
  position: [number, number, number];
  radius: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useBandTexture();

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.rotation.y -= delta * 0.45;
    mesh.position.y = Math.sin(state.clock.elapsedTime * 0.6) * radius * 0.12;
  });

  if (!texture) return null;

  // Two nested faces: a faint inner (back) pass gives the ring its
  // hollow depth, a full-strength outer (front) pass keeps it legible.
  return (
    <group position={position} rotation={[0.14, 0, -0.1]}>
      <mesh ref={meshRef}>
        <cylinderGeometry args={[radius, radius, radius * 2.4, 96, 1, true]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.16}
          side={THREE.BackSide}
          depthWrite={false}
          toneMapped={false}
        />
        <mesh>
          <cylinderGeometry args={[radius, radius, radius * 2.4, 96, 1, true]} />
          <meshBasicMaterial
            map={texture}
            transparent
            side={THREE.FrontSide}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Hero name plane                                                      */
/* ------------------------------------------------------------------ */

function NamePlane({
  width,
  anchorLeftX,
  centerY,
  centered,
}: {
  width: number;
  anchorLeftX: number;
  centerY: number;
  centered: boolean;
}) {
  const name = useNameTexture();
  if (!name) return null;

  const height = width * name.aspect;
  // Shift left by the texture's internal padding so the first glyph's
  // advance box, not the padded bitmap, sits on the anchor line.
  const x = centered ? 0 : anchorLeftX + width / 2 - name.padX * width;

  return (
    <mesh position={[x, centerY, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={name.texture}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Hero contents rendered into the FBO                                  */
/* ------------------------------------------------------------------ */

function HeroContent() {
  const viewport = useThree((state) => state.viewport);
  const size = useThree((state) => state.size);
  const pointer = useThree((state) => state.pointer);
  const groupRef = useRef<THREE.Group>(null);

  const w = viewport.width;
  const h = viewport.height;
  const isNarrow = w / h < 1.05;

  // Match the DOM overlays' fixed pixel margin (px-5 / md:px-10) so the
  // name's left edge lines up with the editorial text below it.
  const marginPx = size.width >= 768 ? 40 : 20;
  const marginWorld = marginPx * (w / size.width);

  // Gentle parallax of the whole composition against the cursor.
  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, pointer.x * 0.04, 0.06);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -pointer.y * 0.025, 0.06);
  });

  const nameWidth = isNarrow ? w * 0.92 : w * 0.72;
  const nameX = -w / 2 + marginWorld;
  const nameY = isNarrow ? h * 0.14 : h * 0.03;
  const drumRadius = isNarrow ? w * 0.17 : w * 0.085;
  const drumPosition: [number, number, number] = isNarrow
    ? [0, -h * 0.22, 0.2]
    : [w * 0.35, -h * 0.03, 0.2];

  return (
    <group ref={groupRef}>
      <NamePlane
        width={nameWidth}
        anchorLeftX={nameX}
        centerY={nameY}
        centered={isNarrow}
      />
      <TextDrum position={drumPosition} radius={drumRadius} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Scene orchestration: fluid sim + FBO render + composite pass         */
/* ------------------------------------------------------------------ */

function makeFullscreenTriangle(material: THREE.ShaderMaterial) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3)
  );
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  return mesh;
}

function LiquidScene() {
  const size = useThree((state) => state.size);
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);

  const fboScene = useMemo(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(PAPER);
    return scene;
  }, []);

  const sceneTarget = useFBO({ samples: 4 });

  // Ping-pong velocity field targets for the fluid simulation.
  const fluidA = useFBO(FLUID_SIZE, FLUID_SIZE, { depthBuffer: false });
  const fluidB = useFBO(FLUID_SIZE, FLUID_SIZE, { depthBuffer: false });
  const fluidTargets = useRef({ read: fluidA, write: fluidB });

  const fluidMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: fullscreenVertexShader,
        fragmentShader: fluidFragmentShader,
        uniforms: {
          uPrev: { value: null },
          uMouse: { value: new THREE.Vector2(-10, -10) },
          uVelocity: { value: new THREE.Vector2(0, 0) },
          uAspect: { value: 1 },
          uDissipation: { value: 0.965 },
        },
        depthTest: false,
        depthWrite: false,
      }),
    []
  );

  const compositeMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: fullscreenVertexShader,
        fragmentShader: compositeFragmentShader,
        uniforms: {
          uScene: { value: null },
          uFlow: { value: null },
          uStrength: { value: 0.62 },
        },
        depthTest: false,
        depthWrite: false,
      }),
    []
  );

  const fluidScene = useMemo(() => {
    const scene = new THREE.Scene();
    scene.add(makeFullscreenTriangle(fluidMaterial));
    return scene;
  }, [fluidMaterial]);

  useEffect(
    () => () => {
      fluidMaterial.dispose();
      compositeMaterial.dispose();
      fluidScene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      });
    },
    [fluidMaterial, compositeMaterial, fluidScene]
  );

  // Mouse tracking in canvas UV space, with velocity.
  const mouse = useRef({
    current: new THREE.Vector2(-10, -10),
    target: new THREE.Vector2(-10, -10),
    last: new THREE.Vector2(-10, -10),
    velocity: new THREE.Vector2(0, 0),
    initialized: false,
  });

  useEffect(() => {
    const el = gl.domElement;
    const onPointerMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      const m = mouse.current;
      m.target.set(x, y);
      if (!m.initialized) {
        m.current.copy(m.target);
        m.last.copy(m.target);
        m.initialized = true;
      }
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [gl]);

  useFrame((state, delta) => {
    const m = mouse.current;

    // Viscous pursuit of the real cursor: slow on purpose, so the splat
    // source itself already moves like it is dragging through liquid.
    m.current.lerp(m.target, Math.min(1, delta * 7));

    const frameVel = m.velocity;
    frameVel.set(m.current.x - m.last.x, m.current.y - m.last.y);
    m.last.copy(m.current);

    // Gentle splat: capped low so even violent swipes stay understated.
    frameVel.multiplyScalar(0.9);
    const speed = frameVel.length();
    if (speed > 0.012) frameVel.multiplyScalar(0.012 / speed);

    // 1. Advance the fluid simulation (ping-pong).
    const { read, write } = fluidTargets.current;
    fluidMaterial.uniforms.uPrev.value = read.texture;
    fluidMaterial.uniforms.uMouse.value.copy(m.current);
    fluidMaterial.uniforms.uVelocity.value.copy(frameVel);
    fluidMaterial.uniforms.uAspect.value = size.width / size.height;

    state.gl.setRenderTarget(write);
    state.gl.render(fluidScene, camera);

    fluidTargets.current = { read: write, write: read };

    // 2. Render the hero into its own buffer.
    state.gl.setRenderTarget(sceneTarget);
    state.gl.render(fboScene, camera);
    state.gl.setRenderTarget(null);

    // 3. Composite: displace + RGB-split the hero along the fluid.
    compositeMaterial.uniforms.uScene.value = sceneTarget.texture;
    compositeMaterial.uniforms.uFlow.value = fluidTargets.current.read.texture;
  });

  return (
    <>
      {createPortal(<HeroContent />, fboScene)}
      <ScreenQuad>
        <primitive object={compositeMaterial} attach="material" />
      </ScreenQuad>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Public component                                                     */
/* ------------------------------------------------------------------ */

export default function HeroCanvas({ active = true }: { active?: boolean }) {
  const [ready, setReady] = useState(false);

  return (
    <div
      className="h-full w-full transition-opacity duration-1000"
      style={{ opacity: ready ? 1 : 0 }}
    >
      <Canvas
        dpr={[1, 2]}
        linear
        flat
        camera={{ position: [0, 0, 5], fov: 50 }}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={() => setReady(true)}
      >
        <LiquidScene />
      </Canvas>
    </div>
  );
}
