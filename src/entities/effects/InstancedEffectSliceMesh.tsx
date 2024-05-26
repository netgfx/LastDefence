import { useRef, useState, useEffect, useMemo } from 'react'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { InstancedUniformsMesh } from 'three-instanced-uniforms-mesh'
import * as THREE from 'three'
import _ from 'lodash'
import { EffectMaterial } from './EffectMaterial'
import { calculateAspectRatio, deg2rad } from '../../utils/utils'
import React from 'react'
import { CoreState, useGlobalStore } from '../../state/globalState'

extend({ InstancedUniformsMesh })

export const InstancedEffectsSliceMesh = ({ texture, textureData, type }: { texture: THREE.Texture; textureData: any; type: string }) => {
  // the general "discovered" tiles

  const [hexTexture, setHexTexture] = useState<THREE.Texture | null>(null)
  const meshRef = useRef<any | null>(null)
  // global store
  const slashFrameTime = useGlobalStore((state: CoreState) => state.slashFrameTime)
  const setSlashFrameTime = useGlobalStore((state: CoreState) => state.setSlashFrameTime)
  const instanceIndex = useRef<number>(0)
  const onEnd = () => {
    reset()
    paused.current = true
    setSlashFrameTime(-1)
  }

  const onUpdate = (currentFrame: number) => {}

  const reset = () => {
    currentFrameIndex.current = 0
    animateFrame(instanceIndex.current, false)
  }

  // animator props
  const currentFrameIndex = useRef(0)
  const loop = useRef<boolean>(false)
  const paused = useRef<boolean>(true)
  const isPlaying = useRef<boolean>(false)
  const timerOffset = React.useRef(window.performance.now())
  const fpsInterval = useRef<number>(1000 / 18)
  const aspectRatio = useRef<THREE.Vector3 | null>(null)
  ///////////////////////////////////////////
  const { viewport, size } = useThree()

  const animateFrame = (index: number, shouldUpdateScale: boolean, pos?: THREE.Vector3 | null) => {
    if (textureData) {
      const elementData = textureData?.frames[currentFrameIndex.current]
      const meta = textureData.meta
      meshRef.current.setUniformAt('frameX', index, elementData?.frame.x)
      meshRef.current.setUniformAt('frameY', index, elementData?.frame.y)
      meshRef.current.setUniformAt('frameWidth', index, elementData?.frame.w)
      meshRef.current.setUniformAt('frameHeight', index, elementData?.frame.h)
      meshRef.current.setUniformAt('textureWidth', index, meta?.size.w)
      meshRef.current.setUniformAt('textureHeight', index, meta?.size.h)
      //
      let offsetX = 0.0

      let mat4 = new THREE.Matrix4()
      //meshRef.current.getMatrixAt(index, mat4)

      if (shouldUpdateScale) {
        // Create a new matrix for the position
        const positionMatrix = new THREE.Matrix4()
        if (pos) {
          positionMatrix.setPosition(pos.x, pos.y, pos.z)
        } else {
          positionMatrix.setPosition(offsetX, 10.0, 0.0)
        }

        // Create a new matrix for the rotation
        const rotationMatrix = new THREE.Matrix4()
        const rotation = new THREE.Euler(0, 0, deg2rad(20), 'XYZ')
        rotationMatrix.makeRotationFromEuler(rotation)

        // Combine the position and rotation matrices using multiplication
        mat4.multiply(rotationMatrix)

        if (pos) {
          mat4.setPosition(pos.x, pos.y, pos.z)
        } else {
          mat4.setPosition(offsetX, 10.0, 0.0)
        }

        // Scale the matrix
        mat4.scale(aspectRatio.current)

        ///////
        meshRef.current.setMatrixAt(index, mat4)
      }

      meshRef.current.needsUpdate = true
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  }

  const updatePosition = () => {
    const verticalPosition = -viewport.height / 2 + (220 / size.height) * viewport.height
    let offsetX = 0.0

    animateFrame(instanceIndex.current, true, new THREE.Vector3(offsetX, verticalPosition, 0))
  }

  useEffect(() => {
    updatePosition()
  }, [viewport, size, hexTexture])

  useEffect(() => {
    const finalTime = slashFrameTime
    if (finalTime >= 0 && finalTime <= 1.0) {
      currentFrameIndex.current = 0
      paused.current = false
    } else {
      //paused.current = true
      reset()
    }
  }, [slashFrameTime])

  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.NoColorSpace
      const elementData = textureData?.frames[currentFrameIndex.current]
      const resultAspectRatio = calculateAspectRatio(elementData?.frame.w, elementData?.frame.h)
      aspectRatio.current = new THREE.Vector3(resultAspectRatio[0] * 7, resultAspectRatio[1] * 7, resultAspectRatio[2] * 7)
      setHexTexture(texture)
    }
  }, [texture])

  useEffect(() => {
    if (meshRef.current && hexTexture && textureData) {
      // add the placement

      const elementData = textureData?.frames[currentFrameIndex.current]
      const resultAspectRatio = calculateAspectRatio(elementData?.frame.w, elementData?.frame.h)
      aspectRatio.current = new THREE.Vector3(resultAspectRatio[0] * 7, resultAspectRatio[1] * 7, resultAspectRatio[2] * 7)

      animateFrame(instanceIndex.current, true)
      //
      //meshRef.current.setUniformAt("tex_index", index, -1)
    }
  }, [hexTexture, textureData])

  useFrame(() => {
    if (meshRef.current && textureData && hexTexture && aspectRatio.current) {
      const totalFrames = textureData.frames.length
      // TODO ANIMATE THE SPRITESHEET!
      if (paused.current === false) {
        isPlaying.current = true
        // show next frame

        const nextFrame = currentFrameIndex.current + 1
        //finalTime >= 0 ? Math.round(finalTime * totalFrames) : 0 //currentFrameIndex.current + 1
        const now = window.performance.now()
        const diff = now - timerOffset.current

        if (nextFrame < totalFrames) {
          if (diff <= fpsInterval.current) return
          timerOffset.current = now - (diff % fpsInterval.current)

          animateFrame(instanceIndex.current, false)
          currentFrameIndex.current = nextFrame
        } else {
          if (loop.current === false) {
            onEnd()
          } else {
            reset()
          }
        }
      } else {
        isPlaying.current = false
      }
    } else {
      //console.log('no texture data')
    }
  })

  // handle scaling
  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), [])

  return (
    <>
      {/* {hexTexture && (
        <mesh geometry={geometry} position={[0, 2, 0]}>
          <meshStandardMaterial map={hexTexture} transparent={true} />
        </mesh>
      )} */}

      <instancedUniformsMesh ref={meshRef} args={[geometry, null, 1]}>
        {/* awesome working texture */}
        <EffectMaterial attach="material" map={hexTexture} textureData={null} />
        {/* <meshStandardMaterial attach="material" color="#f2f2f2" /> */}
      </instancedUniformsMesh>
    </>
  )
}
