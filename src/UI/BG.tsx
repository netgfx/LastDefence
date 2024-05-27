import { useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import React from 'react'
import { useMemo } from 'react'
import { deg2rad } from '../utils/utils'
import * as THREE from 'three'

export function BG() {
  const texture = useTexture('/tiles.jpg')

  const { viewport } = useThree()

  const textureRepeat = useMemo(() => {
    console.log(viewport.width, viewport.height)
    const repeatedTexture = texture.clone()
    // Calculate the viewport and texture aspect ratios
    const viewportAspectRatio = viewport.width / viewport.height
    const textureAspectRatio = texture.image.width / texture.image.height

    let xRepeat = 1
    let yRepeat = 1

    // Adjust the repeat values based on aspect ratio comparison
    if (viewportAspectRatio > textureAspectRatio) {
      xRepeat = viewportAspectRatio / textureAspectRatio
    } else {
      yRepeat = textureAspectRatio / viewportAspectRatio
    }

    repeatedTexture.wrapS = THREE.RepeatWrapping
    repeatedTexture.wrapT = THREE.RepeatWrapping
    repeatedTexture.repeat.set(xRepeat, yRepeat)
    repeatedTexture.needsUpdate = true // Ensure the texture properties are updated

    return repeatedTexture
  }, [texture, viewport])

  return (
    <group>
      <mesh rotation={[deg2rad(0), 0, 0]} position={[0, 0, -0.9]} scale={1.25}>
        <planeGeometry args={[viewport.width, viewport.width]} />
        <meshBasicMaterial color={'#1e1e1e'} toneMapped={false} opacity={0.25} transparent />
      </mesh>
      <mesh rotation={[deg2rad(0), 0, 0]} position={[0, 0, -1]}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={textureRepeat} toneMapped={false} />
      </mesh>
    </group>
  )
}
