import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
import {
  Physics,
  RigidBody,
  CapsuleCollider,
  CuboidCollider,
  type RapierRigidBody,
} from '@react-three/rapier'
import { useRef } from 'react'
import * as THREE from 'three'

type Controls = { forward: boolean; backward: boolean; left: boolean; right: boolean }
type GameSceneProps = {
  controls: Controls
  isRiding: boolean
  onCanMountChange: (canMount: boolean) => void
}

function Building({ position, color, size }: { position: [number, number, number]; color: string; size: [number, number, number] }) {
  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      <CuboidCollider args={[size[0] / 2, size[1] / 2, size[2] / 2]} />
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </RigidBody>
  )
}

function RoadMarkings() {
  return (
    <>
      {Array.from({ length: 9 }, (_, index) => {
        const z = -8 + index * 2
        return (
          <mesh key={z} position={[0, 0.012, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.12, 0.9]} />
            <meshBasicMaterial color="#f4d77a" />
          </mesh>
        )
      })}
    </>
  )
}

function Motorcycle() {
  return (
    <group>
      <mesh position={[0, 0.48, 0]} castShadow>
        <boxGeometry args={[0.42, 0.32, 1.25]} />
        <meshStandardMaterial color="#e2a12d" metalness={0.25} roughness={0.55} />
      </mesh>
      {[-0.48, 0.48].map((z) => (
        <group key={z} position={[0, 0.28, z]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.14, 24]} />
            <meshStandardMaterial color="#20252a" roughness={0.95} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} scale={[0.55, 1.02, 0.55]}>
            <cylinderGeometry args={[0.25, 0.25, 0.15, 20]} />
            <meshStandardMaterial color="#9ba5a0" metalness={0.7} roughness={0.35} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.78, -0.42]} castShadow>
        <boxGeometry args={[0.34, 0.12, 0.38]} />
        <meshStandardMaterial color="#242b2d" />
      </mesh>
      <mesh position={[0, 0.7, 0.52]} castShadow>
        <boxGeometry args={[0.38, 0.12, 0.16]} />
        <meshStandardMaterial color="#f5e4b5" emissive="#8c5b18" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0, 1.02, -0.08]} castShadow>
        <capsuleGeometry args={[0.19, 0.38, 4, 8]} />
        <meshStandardMaterial color="#197c70" />
      </mesh>
      <mesh position={[0, 1.34, -0.1]} castShadow>
        <sphereGeometry args={[0.17, 18, 18]} />
        <meshStandardMaterial color="#c98d62" />
      </mesh>
      <mesh position={[0, 1.55, -0.1]}>
        <sphereGeometry args={[0.18, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#26343c" />
      </mesh>
    </group>
  )
}

function WalkingCourier() {
  return (
    <group>
      <mesh position={[0, 0.02, 0]} castShadow>
        <capsuleGeometry args={[0.24, 0.62, 4, 8]} />
        <meshStandardMaterial color="#197c70" />
      </mesh>
      <mesh position={[0, 0.68, 0]} castShadow>
        <sphereGeometry args={[0.2, 20, 20]} />
        <meshStandardMaterial color="#c98d62" />
      </mesh>
      <mesh position={[0, 0.9, -0.015]}>
        <sphereGeometry args={[0.205, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#26343c" />
      </mesh>
    </group>
  )
}

function PlayerAndMotorcycle({ controls, isRiding, onCanMountChange }: GameSceneProps) {
  const playerBody = useRef<RapierRigidBody>(null)
  const bikeBody = useRef<RapierRigidBody>(null)
  const playerYaw = useRef(0)
  const bikeYaw = useRef(0)
  const previousRiding = useRef(isRiding)
  const canMountRef = useRef(false)
  const cameraTarget = useRef(new THREE.Vector3())

  useFrame(({ camera }, delta) => {
    const player = playerBody.current
    const bike = bikeBody.current
    if (!player || !bike) return

    const playerPosition = player.translation()
    const bikePosition = bike.translation()

    if (isRiding !== previousRiding.current) {
      if (!isRiding) {
        player.setTranslation({ x: bikePosition.x + 1.35, y: 0.95, z: bikePosition.z }, true)
        player.setLinvel({ x: 0, y: 0, z: 0 }, true)
        playerYaw.current = bikeYaw.current
      }
      previousRiding.current = isRiding
    }

    const distance = Math.hypot(playerPosition.x - bikePosition.x, playerPosition.z - bikePosition.z)
    const canMount = !isRiding && distance < 2.25
    if (canMount !== canMountRef.current) {
      canMountRef.current = canMount
      onCanMountChange(canMount)
    }

    const turn = Number(controls.left) - Number(controls.right)
    const throttle = Number(controls.forward) - Number(controls.backward)

    if (isRiding) {
      bikeYaw.current += turn * 1.9 * delta * (Math.abs(throttle) > 0.05 ? 1 : 0.35)
      const forward = new THREE.Vector3(Math.sin(bikeYaw.current), 0, -Math.cos(bikeYaw.current))
      const velocity = forward.multiplyScalar(throttle * 8.5)
      const currentVelocity = bike.linvel()
      bike.setLinvel({ x: velocity.x, y: currentVelocity.y, z: velocity.z }, true)
      bike.setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), bikeYaw.current), true)
    } else {
      playerYaw.current += turn * 2.4 * delta
      const forward = new THREE.Vector3(Math.sin(playerYaw.current), 0, -Math.cos(playerYaw.current))
      const side = new THREE.Vector3(Math.cos(playerYaw.current), 0, Math.sin(playerYaw.current))
      const velocity = forward.multiplyScalar(throttle * 3)
      velocity.add(side.multiplyScalar(turn * 1.6))
      const currentVelocity = player.linvel()
      player.setLinvel({ x: velocity.x, y: currentVelocity.y, z: velocity.z }, true)
      player.setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), playerYaw.current), true)
    }

    const activePosition = isRiding ? bike.translation() : player.translation()
    const activeYaw = isRiding ? bikeYaw.current : playerYaw.current
    cameraTarget.current.set(activePosition.x, activePosition.y + (isRiding ? 1.05 : 0.65), activePosition.z)
    const followDistance = isRiding ? 8.5 : 7
    const desiredCamera = new THREE.Vector3(
      activePosition.x + Math.sin(activeYaw) * followDistance,
      activePosition.y + (isRiding ? 5.2 : 4.7),
      activePosition.z + Math.cos(activeYaw) * followDistance,
    )
    camera.position.lerp(desiredCamera, 1 - Math.exp(-4.5 * delta))
    camera.lookAt(cameraTarget.current)
  })

  return (
    <>
      <RigidBody
        ref={playerBody}
        type={isRiding ? 'fixed' : 'dynamic'}
        position={[0, 0.95, 4]}
        colliders={false}
        enabledRotations={[false, false, false]}
        linearDamping={3.5}
        friction={1}
        ccd
      >
        <CapsuleCollider args={[0.48, 0.28]} />
        <group visible={!isRiding} position={[0, -0.2, 0]}>
          <WalkingCourier />
        </group>
      </RigidBody>

      <RigidBody
        ref={bikeBody}
        type={isRiding ? 'dynamic' : 'fixed'}
        position={[1, 0, 3]}
        colliders={false}
        enabledRotations={[false, false, false]}
        linearDamping={0.8}
        friction={1.2}
        ccd
      >
        <CuboidCollider args={[0.34, 0.18, 0.72]} position={[0, 0.5, 0]} />
        <Motorcycle />
      </RigidBody>
    </>
  )
}

function World(props: GameSceneProps) {
  return (
    <>
      <color attach="background" args={['#b9d7d2']} />
      <fog attach="fog" args={['#b9d7d2', 22, 52]} />
      <ambientLight intensity={1.35} />
      <directionalLight position={[8, 14, 6]} intensity={2.1} castShadow shadow-mapSize={[1024, 1024]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#78916c" />
      </mesh>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[30, 0.1, 30]} position={[0, -0.12, 0]} />
      </RigidBody>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
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
      <PlayerAndMotorcycle {...props} />
      <ContactShadows position={[0, -0.015, 0]} opacity={0.28} scale={18} blur={2.5} far={8} />
      <Environment preset="city" />
    </>
  )
}

export default function GameScene(props: GameSceneProps) {
  return (
    <div className="scene">
      <Canvas shadows camera={{ position: [0, 6, 12], fov: 48 }}>
        <Physics gravity={[0, -9.81, 0]}>
          <World {...props} />
        </Physics>
      </Canvas>
    </div>
  )
}
