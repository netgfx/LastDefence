import { useEffect, useRef, useState } from 'react'
import { deg2rad } from '../utils/utils'
import { Knight } from './Knight'
import { UnitsSide } from './UnitsSide'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import React from 'react'
import { CACHE_BUST } from '../helpers/constants'

export function Player() {
  const unitRef = useRef<any | null>(null)
  const unitSideRef = useRef<any | null>(null)
  const unitSideRef2 = useRef<any | null>(null)
  const { materials, nodes, animations, scene } = useGLTF(`/models/Knight.glb?id=${CACHE_BUST}`) as GLTFResult
  const [finalNodes, setFinalNodes] = useState<any | null>(null)

  useEffect(() => {
    console.log('NODES: ', nodes, nodes.root, scene)
    if (nodes && scene) {
      setFinalNodes(nodes)
    }
  }, [nodes, scene])

  console.log(nodes)
  return (
    <>
      {scene && finalNodes && (
        <Knight
          materials={materials}
          animations={animations}
          scene={scene}
          objectRef={unitRef}
          rotation={[deg2rad(120), deg2rad(180), deg2rad(0)]}
          scale={1.5}
        />
      )}
      {scene && finalNodes && (
        <UnitsSide
          materials={materials}
          animations={animations}
          scene={scene}
          nodes={finalNodes}
          objectRef={unitSideRef}
          objectRef2={unitSideRef2}
          rotation={[deg2rad(120), deg2rad(180), deg2rad(0)]}
          scale={1.5}
        />
      )}
    </>
  )
}

useGLTF.preload('/models/Knight.glb')
