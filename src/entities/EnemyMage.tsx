/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useEffect, useRef, useState } from 'react'
import { useGLTF, useAnimations, useFBO } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useFrame, useThree } from '@react-three/fiber'
import EventEmitterFn from '../utils/EventEmitter'
import { gsap } from 'gsap'
import { CACHE_BUST } from '../helpers/constants'
import { CoreState } from '../state/globalState'
import { useGlobalStore } from '../state/globalState'

type GLTFResult = GLTF & {
  nodes: {
    Skeleton_Mage_ArmLeft: THREE.SkinnedMesh
    Skeleton_Mage_ArmRight: THREE.SkinnedMesh
    Skeleton_Mage_Body: THREE.SkinnedMesh
    Skeleton_Mage_Eyes: THREE.SkinnedMesh
    Skeleton_Mage_Jaw: THREE.SkinnedMesh
    Skeleton_Mage_LegLeft: THREE.SkinnedMesh
    Skeleton_Mage_LegRight: THREE.SkinnedMesh
    Skeleton_Mage_Skull: THREE.SkinnedMesh
    Skeleton_Mage_Hat: THREE.Mesh
    root: THREE.Bone
  }
  materials: {
    skeleton: THREE.MeshStandardMaterial
    Glow: THREE.MeshStandardMaterial
  }
}

type ActionName =
  | '1H_Melee_Attack_Chop'
  | '1H_Melee_Attack_Jump_Chop'
  | '1H_Melee_Attack_Slice_Diagonal'
  | '1H_Melee_Attack_Slice_Horizontal'
  | '1H_Melee_Attack_Stab'
  | '1H_Ranged_Aiming'
  | '1H_Ranged_Reload'
  | '1H_Ranged_Shoot'
  | '1H_Ranged_Shooting'
  | '2H_Melee_Attack_Chop'
  | '2H_Melee_Attack_Slice'
  | '2H_Melee_Attack_Spin'
  | '2H_Melee_Attack_Spinning'
  | '2H_Melee_Attack_Stab'
  | '2H_Melee_Idle'
  | '2H_Ranged_Aiming'
  | '2H_Ranged_Reload'
  | '2H_Ranged_Shoot'
  | '2H_Ranged_Shooting'
  | 'Block'
  | 'Block_Attack'
  | 'Block_Hit'
  | 'Blocking'
  | 'Cheer'
  | 'Death_A'
  | 'Death_A_Pose'
  | 'Death_B'
  | 'Death_B_Pose'
  | 'Death_C_Pose'
  | 'Death_C_Skeletons'
  | 'Death_C_Skeletons_Resurrect'
  | 'Dodge_Backward'
  | 'Dodge_Forward'
  | 'Dodge_Left'
  | 'Dodge_Right'
  | 'Dualwield_Melee_Attack_Chop'
  | 'Dualwield_Melee_Attack_Slice'
  | 'Dualwield_Melee_Attack_Stab'
  | 'Hit_A'
  | 'Hit_B'
  | 'Idle'
  | 'Idle_B'
  | 'Idle_Combat'
  | 'Interact'
  | 'Jump_Full_Long'
  | 'Jump_Full_Short'
  | 'Jump_Idle'
  | 'Jump_Land'
  | 'Jump_Start'
  | 'Lie_Down'
  | 'Lie_Idle'
  | 'Lie_Pose'
  | 'Lie_StandUp'
  | 'PickUp'
  | 'Running_A'
  | 'Running_B'
  | 'Running_C'
  | 'Running_Strafe_Left'
  | 'Running_Strafe_Right'
  | 'Sit_Chair_Down'
  | 'Sit_Chair_Idle'
  | 'Sit_Chair_Pose'
  | 'Sit_Chair_StandUp'
  | 'Sit_Floor_Down'
  | 'Sit_Floor_Idle'
  | 'Sit_Floor_Pose'
  | 'Sit_Floor_StandUp'
  | 'Skeleton_Inactive_Standing_Pose'
  | 'Skeletons_Awaken_Floor'
  | 'Skeletons_Awaken_Floor_Long'
  | 'Skeletons_Awaken_Standing'
  | 'Skeletons_Inactive_Floor_Pose'
  | 'Spawn_Air'
  | 'Spawn_Ground'
  | 'Spawn_Ground_Skeletons'
  | 'Spellcast_Long'
  | 'Spellcast_Raise'
  | 'Spellcast_Shoot'
  | 'Spellcast_Summon'
  | 'Spellcasting'
  | 'T-Pose'
  | 'Taunt'
  | 'Taunt_Longer'
  | 'Throw'
  | 'Unarmed_Idle'
  | 'Unarmed_Melee_Attack_Kick'
  | 'Unarmed_Melee_Attack_Punch_A'
  | 'Unarmed_Melee_Attack_Punch_B'
  | 'Unarmed_Pose'
  | 'Use_Item'
  | 'Walking_A'
  | 'Walking_B'
  | 'Walking_Backwards'
  | 'Walking_C'
  | 'Walking_D_Skeletons'
type GLTFActions = Record<ActionName, THREE.AnimationAction>

export function EnemyMage(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const currentCacheKey = useGlobalStore((state: CoreState) => state.currentCacheKey)
  const { nodes, materials, animations } = useGLTF(`/models/Skeleton_Mage.glb?id=${currentCacheKey ?? CACHE_BUST}`) as GLTFResult
  const { viewport, size } = useThree()
  const { actions, mixer } = useAnimations<GLTFActions>(animations, group)
  const [currentAction, setCurrentAction] = useState<any | null>(-1)
  const currentAnimRef = useRef<any | null>(null)
  const currentActionRef = useRef<any | null>(null)
  const updatePosition = () => {
    const verticalPosition = viewport.height / 2 - (130 / size.height) * viewport.height

    group.current.position.set(0, verticalPosition, 0)

    initAction()
  }

  const changeAnimation = (message: any) => {
    setCurrentAction('SPELL')
    currentActionRef.current = 'SPELL'
    playAnimation()
  }

  useEffect(() => {
    console.log('NODES: ', nodes, nodes.root)
  }, [nodes])

  useEffect(() => {
    EventEmitterFn.on('WAVE_GENERATED', changeAnimation)
    return () => {
      EventEmitterFn.off('WAVE_GENERATED', changeAnimation)
    }
  }, [])

  useEffect(() => {
    updatePosition()
  }, [viewport, size, nodes])

  const initAction = () => {
    if (actions) {
      mixer.stopAllAction()
      const animationKey = 'Skeletons_Awaken_Floor'
      actions[animationKey].timeScale = 1
      actions[animationKey].reset()
      actions[animationKey].loop = THREE.LoopOnce
      actions[animationKey].clampWhenFinished = true
      actions[animationKey].play()
      setTimeout(() => {
        setCurrentAction(null)
      }, 2000)
    }
  }

  useEffect(() => {
    playAnimation()
  }, [currentAction, actions])

  useFrame(() => {
    if (actions['Spellcast_Shoot'].isRunning() === false && currentActionRef.current === null) {
      //playAnimation()
    }
  })

  const playAnimation = () => {
    mixer.stopAllAction()
    console.log(currentActionRef.current)
    if (currentActionRef.current === null) {
      const animationKey = 'Idle'
      actions[animationKey].timeScale = 1
      actions[animationKey].reset()
      actions[animationKey].loop = THREE.LoopRepeat
      actions[animationKey].clampWhenFinished = true
      actions[animationKey].play()
      currentAnimRef.current = actions[animationKey]
      gsap.delayedCall(0.1, () => {
        currentActionRef.current = null
      })
      // move forward a bit
    } else if (currentActionRef.current === 'SPELL') {
      const animationKey = 'Spellcast_Shoot'
      actions[animationKey].timeScale = 1
      actions[animationKey].reset()
      actions[animationKey].loop = THREE.LoopOnce
      actions[animationKey].clampWhenFinished = true
      actions[animationKey].play()
      currentAnimRef.current = actions[animationKey]
      gsap.delayedCall(0.1, () => {
        currentActionRef.current = null
      })

      //setPlaySlash(false)
      //group.current.position.y -= 1.5
    }
  }

  return (
    <>
      {nodes && nodes.root && (
        <group ref={group} {...props} dispose={null}>
          <group name="Scene">
            <group name="Rig">
              <skinnedMesh
                name="Skeleton_Mage_ArmLeft"
                geometry={nodes.Skeleton_Mage_ArmLeft.geometry}
                material={materials.skeleton}
                skeleton={nodes.Skeleton_Mage_ArmLeft.skeleton}
              />
              <skinnedMesh
                name="Skeleton_Mage_ArmRight"
                geometry={nodes.Skeleton_Mage_ArmRight.geometry}
                material={materials.skeleton}
                skeleton={nodes.Skeleton_Mage_ArmRight.skeleton}
              />
              <skinnedMesh
                name="Skeleton_Mage_Body"
                geometry={nodes.Skeleton_Mage_Body.geometry}
                material={materials.skeleton}
                skeleton={nodes.Skeleton_Mage_Body.skeleton}
              />
              <skinnedMesh
                name="Skeleton_Mage_Eyes"
                geometry={nodes.Skeleton_Mage_Eyes.geometry}
                material={materials.Glow}
                skeleton={nodes.Skeleton_Mage_Eyes.skeleton}
              />
              <skinnedMesh
                name="Skeleton_Mage_Jaw"
                geometry={nodes.Skeleton_Mage_Jaw.geometry}
                material={materials.skeleton}
                skeleton={nodes.Skeleton_Mage_Jaw.skeleton}
              />
              <skinnedMesh
                name="Skeleton_Mage_LegLeft"
                geometry={nodes.Skeleton_Mage_LegLeft.geometry}
                material={materials.skeleton}
                skeleton={nodes.Skeleton_Mage_LegLeft.skeleton}
              />
              <skinnedMesh
                name="Skeleton_Mage_LegRight"
                geometry={nodes.Skeleton_Mage_LegRight.geometry}
                material={materials.skeleton}
                skeleton={nodes.Skeleton_Mage_LegRight.skeleton}
              />
              <skinnedMesh
                name="Skeleton_Mage_Skull"
                geometry={nodes.Skeleton_Mage_Skull.geometry}
                material={materials.skeleton}
                skeleton={nodes.Skeleton_Mage_Skull.skeleton}
              />
              {nodes.root && <primitive object={nodes.root} dispose={null} />}
            </group>
          </group>
        </group>
      )}
    </>
  )
}

useGLTF.preload('/models/Skeleton_Mage.glb')
