import { GLTF } from 'three-stdlib'
import * as THREE from 'three'

export type TrackConfig = {
  trackName: string
  url: string
  volume: number
}

export type VIEWS = 'MENU' | 'GAMEPLAY' | 'END'
export type ACTIONS = 'KNIGHT' | 'MAGE' | null
export type GAME_MODE = 'NORMAL' | 'HARD'

export type GLTFResult = GLTF & {
  nodes: {
    Knight_ArmLeft: THREE.SkinnedMesh
    Knight_ArmRight: THREE.SkinnedMesh
    Knight_Body: THREE.SkinnedMesh
    Knight_Head: THREE.SkinnedMesh
    Knight_LegLeft: THREE.SkinnedMesh
    Knight_LegRight: THREE.SkinnedMesh
    ['1H_Sword_Offhand']: THREE.Mesh
    Badge_Shield: THREE.Mesh
    Rectangle_Shield: THREE.Mesh
    Round_Shield: THREE.Mesh
    Spike_Shield: THREE.Mesh
    ['1H_Sword']: THREE.Mesh
    ['2H_Sword']: THREE.Mesh
    Knight_Helmet: THREE.Mesh
    Knight_Cape: THREE.Mesh
    root: THREE.Bone
  }
  materials: {
    knight_texture: THREE.MeshStandardMaterial
  }
}

export type ActionName =
  | '1H_Melee_Attack_Chop'
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
  | 'Spellcast_Long'
  | 'Spellcast_Raise'
  | 'Spellcast_Shoot'
  | 'Spellcasting'
  | 'T-Pose'
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
export type GLTFActions = Record<ActionName, THREE.AnimationAction>
