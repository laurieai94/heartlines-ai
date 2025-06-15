
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Text3D, Center } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

const AnimatedBrain = () => {
  const brainRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (brainRef.current) {
      brainRef.current.rotation.y += 0.01;
      brainRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.005;
    }
  });

  // Create particles for neural network effect
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }

  return (
    <>
      {/* Floating particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#ffffff"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Main brain sphere */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere ref={brainRef} args={[1.2, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#ff69b4"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={0.9}
          />
        </Sphere>
      </Float>

      {/* Neural connections */}
      {Array.from({ length: 8 }, (_, i) => (
        <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.3}>
          <Sphere
            args={[0.1, 16, 16]}
            position={[
              Math.cos((i * Math.PI * 2) / 8) * 2,
              Math.sin((i * Math.PI * 2) / 8) * 2,
              Math.sin(i) * 0.5
            ]}
          >
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={0.7}
              emissive="#ff1493"
              emissiveIntensity={0.2}
            />
          </Sphere>
        </Float>
      ))}

      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff69b4" />
    </>
  );
};

const AnimatedBrain3D = () => {
  return (
    <div className="w-full h-96 relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        className="bg-transparent"
      >
        <AnimatedBrain />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Overlay text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <h3 className="text-2xl font-bold text-white mb-4 text-center z-10">
          AI That Knows You
        </h3>
        <p className="text-white/90 text-lg text-center max-w-md z-10">
          Personalized insights based on your unique relationship profile
        </p>
      </div>
    </div>
  );
};

export default AnimatedBrain3D;
