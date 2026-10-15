import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Torus, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function FloatingCareerOrb() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t / 4) * 0.3;
      meshRef.current.rotation.y = t * 0.25;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.15 + 0.4;
      ring1Ref.current.rotation.y = t * 0.35;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -t * 0.2 + 0.8;
      ring2Ref.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Core Sphere */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere ref={meshRef} args={[1.2, 64, 64]}>
          <MeshDistortMaterial
            color="#2563EB"
            roughness={0.15}
            metalness={0.2}
            distort={0.25}
            speed={1.5}
          />
        </Sphere>
      </Float>

      {/* Primary Orbital Torus Ring */}
      <Torus ref={ring1Ref} args={[2.0, 0.04, 32, 100]}>
        <meshStandardMaterial
          color="#4F46E5"
          roughness={0.3}
          metalness={0.6}
        />
      </Torus>

      {/* Secondary Orbital Torus Ring */}
      <Torus ref={ring2Ref} args={[2.5, 0.025, 32, 100]}>
        <meshStandardMaterial
          color="#0EA5E9"
          roughness={0.2}
          metalness={0.5}
        />
      </Torus>

      {/* Floating Satellites (Milestones & Competencies) */}
      <Float speed={3} rotationIntensity={1} floatIntensity={1.5}>
        <Sphere position={[2.2, 0.8, -0.5]} args={[0.18, 32, 32]}>
          <meshStandardMaterial color="#10B981" roughness={0.2} metalness={0.5} />
        </Sphere>
      </Float>

      <Float speed={2.5} rotationIntensity={1} floatIntensity={1.2}>
        <Sphere position={[-2.0, -1.0, 0.8]} args={[0.22, 32, 32]}>
          <meshStandardMaterial color="#6366F1" roughness={0.2} metalness={0.6} />
        </Sphere>
      </Float>
    </group>
  );
}

export const Hero3DScene: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  if (!hasWebGL || prefersReducedMotion) {
    // Elegant fallback SVG visualization for environments without WebGL or with reduced motion
    return (
      <div className="w-full h-full min-h-[380px] flex items-center justify-center relative">
        <div className="w-72 h-72 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-50 border-2 border-blue-200/60 shadow-xl flex items-center justify-center relative">
          <div className="w-48 h-48 rounded-full bg-white border border-blue-300 shadow-inner flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-blue-500/30">
              AI
            </div>
          </div>
          <div className="absolute top-4 right-6 w-8 h-8 rounded-full bg-emerald-500 shadow-md"></div>
          <div className="absolute bottom-6 left-4 w-10 h-10 rounded-full bg-indigo-600 shadow-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] lg:h-[480px] relative pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#93C5FD" />
        <pointLight position={[0, 0, 2]} intensity={0.8} color="#60A5FA" />
        <FloatingCareerOrb />
      </Canvas>
    </div>
  );
};
