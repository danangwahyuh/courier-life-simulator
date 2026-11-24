import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
import type { ReactNode } from 'react'

type GameSceneProps = {
  playerPosition: [number, number]
  isRiding: boolean
}

function Building({ position, color, size }: { position: [number, number, number]; color: string; size: [number, number, number] }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  )
}

function RoadMarkings() {
  const marks: ReactNode[] = []
  for (let i = -8; i <= 8; i += 2) {
    marks.push(
      <mesh key={i} position={[0, 0.012, i]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.12, 0.9]} />
        <meshBasicMaterial color="#f4d77a" />
      </mesh>,
    )
  }
  return <>{marks}</>
}

function Courier({ position, isRiding }: GameSceneProps) {
  return (
    <group position={[position[0], 0, position[1]]}>
      {isRiding ? (
        <group>
          <mesh position={[0, 0.52, 0]} castShadow>
            <boxGeometry args={[0.42, 0.32, 1.15]} />
            <meshStandardMaterial color="#e2a12d" metalness={0.25} roughness={0.55} />
          </mesh>
          {[-0.48, 0.48].map((z) => (
            <mesh key={z} position={[0, 0.28, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.25, 0.25, 0.12, 20]} />
              <meshStandardMaterial color="#20252a" />
            </mesh>
          ))}
          <mesh position={[0, 1.05, -0.08]} castShadow>
            <capsuleGeometry args={[0.2, 0.38, 4, 8]} />
            <meshStandardMaterial color="#197c70" />
          </mesh>
          <mesh position={[0, 1.36, -0.08]}>
            <sphereGeometry args={[0.17, 16, 16]} />
            <meshStandardMaterial color="#c98d62" />
          </mesh>
        </group>
      ) : (
        <group>
          <mesh position={[0, 0.72, 0]} castShadow>
            <capsuleGeometry args={[0.24, 0.55, 4, 8]} />
            <meshStandardMaterial color="#197c70" />
          </mesh>
          <mesh position={[0, 1.3, 0]} castShadow>
            <sphereGeometry args={[0.2, 20, 20]} />
            <meshStandardMaterial color="#c98d62" />
          </mesh>
          <mesh position={[0, 1.53, -0.015]}>
            <sphereGeometry args={[0.205, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#26343c" />
          </mesh>
        </group>
      )}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.38, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.18} />
      </mesh>
    </group>
  )
}

function World({ playerPosition, isRiding }: GameSceneProps) {
  return (
    <>
      <color attach="background" args={['#b9d7d2']} />
      <fog attach="fog" args={['#b9d7d2', 18, 42]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[8, 14, 6]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#78916c" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[5, 60]} />
        <meshStandardMaterial color="#41494a" roughness={1} />
      </mesh>
      <RoadMarkings />
      <Building position={[-5.8, 1.5, -5]} color="#d8c5a2" size={[5, 3, 8]} />
      <Building position={[-5.8, 3.2, -5]} color="#8d5540" size={[5.2, 0.35, 8.2]} />
      <Building position={[6.8, 1.2, -8]} color="#d6d0b9" size={[6, 2.4, 5]} />
      <Building position={[7, 0.8, 5]} color="#b9a27b" size={[4, 1.6, 5]} />
      <Building position={[-7, 0.8, 8]} color="#b6c6ae" size={[4, 1.6, 5]} />
      <group position={[2.2, 0, -5.8]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial color="#d99b36" />
        </mesh>
        <mesh position={[0, 0.72, 0]}>
          <boxGeometry args={[0.52, 0.08, 0.52]} />
          <meshStandardMaterial color="#f0c56c" />
        </mesh>
      </group>
      <Courier playerPosition={playerPosition} isRiding={isRiding} />
      <ContactShadows position={[0, -0.015, 0]} opacity={0.28} scale={18} blur={2.5} far={8} />
      <Environment preset="city" />
    </>
  )
}

export default function GameScene(props: GameSceneProps) {
  return (
    <div className="scene">
      <Canvas shadows camera={{ position: [10, 11, 13], fov: 42 }}>
        <World {...props} />
      </Canvas>
    </div>
  )
}
