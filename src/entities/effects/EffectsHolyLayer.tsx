import { useSpriteLoader } from '@react-three/drei'
import React from 'react'
import { InstancedEffectHolyMesh } from './InstanceEffectHolyMesh'

export function EffectsHolyLayer() {
  const { spriteObj } = useSpriteLoader(
    '/block_holy.png',
    '/block_holy.json',

    null,
    null
  )

  return (
    <>
      <InstancedEffectHolyMesh texture={spriteObj?.spriteTexture} textureData={spriteObj?.spriteData} />
    </>
  )
}
