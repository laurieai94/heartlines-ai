
import { Canvas } from '@react-three/fiber';
import { Float, Sphere, Environment } from '@react-three/drei';
import { useRef } from 'react';
import { Mesh } from 'three';

const FloatingSphere = ({ position, scale, color }: { position: [number, number, number], scale: number, color: string }) => {
  const meshRef = useRef<Mesh>(null);

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} position={position} scale={scale}>
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.6}
          roughness={0}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0}
          transmission={0.9}
          thickness={0.5}
        />
      </Sphere>
    </Float>
  );
};

const Glassmorphism3D = () => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <Environment preset="sunset" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* Various floating spheres */}
        <FloatingSphere position={[-3, 2, 0]} scale={0.8} color="#ff69b4" />
        <FloatingSphere position={[3, -1, -2]} scale={1.2} color="#ff1493" />
        <FloatingSphere position={[-2, -2, 1]} scale={0.6} color="#ff69b4" />
        <FloatingSphere position={[2, 3, -1]} scale={0.9} color="#ff1493" />
        <FloatingSphere position={[0, 0, -3]} scale={1.5} color="#ff69b4" />
        <FloatingSphere position={[-4, 0, 2]} scale={0.7} color="#ff1493" />
        <FloatingSphere position={[4, 1, 1]} scale={1.1} color="#ff69b4" />
        <FloatingSphere position={[0, -3, 0]} scale={0.8} color="#ff1493" />
      </Canvas>
    </div>
  );
};

export default Glassmorphism3D;
