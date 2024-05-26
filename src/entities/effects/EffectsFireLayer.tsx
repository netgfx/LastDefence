import { useSpriteLoader } from '@react-three/drei'
import React from 'react'
import { InstancedEffectsFireMesh } from './InstaceEffectFireMesh'

export function EffectsFireLayer() {
  const { spriteObj } = useSpriteLoader('/slice_fire.png', '/slice_fire.json', null, null)

  return (
    <>
      <InstancedEffectsFireMesh texture={spriteObj?.spriteTexture} textureData={spriteObj?.spriteData} />
    </>
  )
}
