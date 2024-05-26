import { useEffect, useRef, useState } from 'react'
import { deg2rad } from '../utils/utils'
import { Knight } from './Knight'
import { UnitsSide } from './UnitsSide'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import React from 'react'
import { CACHE_BUST } from '../helpers/constants'
import { CoreState, useGlobalStore } from '../state/globalState'

export function Player() {
  const unitRef = useRef<any | null>(null)
  const unitSideRef = useRef<any | null>(null)
  const unitSideRef2 = useRef<any | null>(null)
  const currentCacheKey = useGlobalStore((state: CoreState) => state.currentCacheKey)
  const { materials, nodes, animations, scene } = useGLTF(`/models/Knight.glb?id=${currentCacheKey ?? CACHE_BUST}`) as GLTFResult
  const [finalNodes, setFinalNodes] = useState<any | null>(null)

  useEffect(() => {
    if (nodes && scene) {
      setFinalNodes(nodes)
    }
  }, [nodes, scene])

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
