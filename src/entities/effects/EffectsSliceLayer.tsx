import { useSpriteLoader } from '@react-three/drei'
import React from 'react'
import { InstancedEffectsSliceMesh } from './InstancedEffectSliceMesh'

export function EffectsSliceLayer({ type }: { type: string }) {
  const { spriteObj } = useSpriteLoader(
    '/slice_sword.png',

    '/slice_sword.json',

    null,
    null
  )

  return (
    <>
      <InstancedEffectsSliceMesh texture={spriteObj?.spriteTexture} textureData={spriteObj?.spriteData} type={type} />
    </>
  )
}
