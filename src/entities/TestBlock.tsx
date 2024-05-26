import { useBVH } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { useRef } from 'react'
import { CoreState, useGlobalStore } from '../state/globalState'
import * as THREE from 'three'

export function TestBlock() {
  const meshRef = useRef<any | null>(null)
  //
  const side1ModelRef = useGlobalStore((state: CoreState) => state.sideModel1Ref)

  useFrame(() => {
    // Check for collision between the mesh and the model
    const meshBoundingBox = new THREE.Box3().setFromObject(meshRef.current)
    const modelBoundingBox = new THREE.Box3().setFromObject(side1ModelRef)

    if (meshBoundingBox.intersectsBox(modelBoundingBox)) {
      // Perform any desired actions when collision occurs
    }
  })

  return (
    <mesh ref={meshRef} position={[-10, -3, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshToonMaterial color={'hotPink'} />
    </mesh>
  )
}
