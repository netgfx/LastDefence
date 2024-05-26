import { useThree } from '@react-three/fiber'
import React, { useRef, useState } from 'react'
// @ts-ignore
import * as THREE from 'three'
import _ from 'lodash'
import { useGlobalStore } from '../state/globalState'

export function RaycastingLayer() {
  const planeMeshRef = useRef<any | null>(null)
  const setCurrentAction = useGlobalStore((state: any) => state.setCurrentAction)

  //
  const onPointerDown = () => {
    setCurrentAction('KNIGHT')
  }

  const onPointerUp = () => {
    setCurrentAction('MAGE')
  }

  return (
    <>
      {/* RAYCASTING MESH, SINGLE PLANE, because reasons... */}
      <mesh
        ref={planeMeshRef}
        position={[0, 0, 0]}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        frustumCulled={false}
        renderOrder={1}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color={new THREE.Color(1.0, 0.5, 0.5)} opacity={0.0} transparent side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}
