import { useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import React from 'react'
import { deg2rad } from '../utils/utils'

export function BG() {
  const texture = useTexture('/tiles.jpg')

  const { viewport } = useThree()

  return (
    <group>
      <mesh rotation={[deg2rad(0), 0, 0]} position={[0, 0, -0.9]} scale={1.25}>
        <planeGeometry args={[viewport.width, viewport.width]} />
        <meshBasicMaterial color={'#1e1e1e'} toneMapped={false} opacity={0.25} transparent />
      </mesh>
      <mesh rotation={[deg2rad(0), 0, 0]} position={[0, 0, -1]} scale={1.25}>
        <planeGeometry args={[viewport.width, viewport.width]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  )
}
