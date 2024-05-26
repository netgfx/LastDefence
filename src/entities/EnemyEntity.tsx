import { useEffect, useRef } from 'react'
import { deg2rad } from '../utils/utils'
import { Knight } from './Knight'
import { UnitsSide } from './UnitsSide'
import * as THREE from 'three'
import React from 'react'
import { EnemyMage } from './EnemyMage'

export function EnemyEntity() {
  const unitRef = useRef<any | null>(null)
  const unitSideRef = useRef<any | null>(null)
  const unitSideRef2 = useRef<any | null>(null)
  return (
    <>
      <EnemyMage position={[0, 12, 0]} rotation={[deg2rad(45), deg2rad(0), deg2rad(0)]} scale={1.5} />
    </>
  )
}
