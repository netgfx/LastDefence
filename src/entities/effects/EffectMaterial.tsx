import { useFrame, useThree } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

export function EffectMaterial({
  map,
  textureData,
  rows,
  columns
}: {
  map: THREE.Texture | null
  textureData: any
  rows?: number
  columns?: number
}) {
  const matRef = useRef<THREE.ShaderMaterial | null>(null)
  const vertexShader = `
  uniform float index;
  uniform float totalTextures;
  uniform vec3 blendColor;
  uniform float losLevel;
  uniform float alphaValue;
  varying highp vec2 vUv;
  varying vec3 vNormal;
  uniform vec2 iResolution;
  uniform float iTime;

  void main() {
   
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    
  }
`

  const fragmentShader = `
  uniform sampler2D textureAtlas;
  varying highp vec2 vUv;
  varying vec3 vNormal;
  
  uniform float frameX;
  uniform float frameY;
  uniform float frameWidth;
  uniform float frameHeight;
  uniform float textureWidth;
  uniform float textureHeight;
  uniform float alphaValue;
  //
  uniform vec2 iResolution;
  uniform float iTime;
  #ifdef GL_ES
  precision mediump float;
  #endif

    bool isBlack(vec3 color) {
      return length(color) < 0.001; // Adjust the threshold as needed
    }

  // calculate with coordinates
  void calculateWithCoordinates(bool isVisited) {
    highp vec2 uv = vUv;
    //
    float _frameX = round(frameX);
    float _frameY = round(frameY);
    float _frameWidth = round(frameWidth);
    float _frameHeight = round(frameHeight);
    float _textureWidth = round(textureWidth);
    float _textureHeight = round(textureHeight);
    
    // Calculate the normalized coordinates of the frame within the texture atlas
    vec2 frameCoord = vec2(_frameX / _textureWidth, _frameY / _textureHeight);
    vec2 frameSize = vec2(_frameWidth / _textureWidth, _frameHeight / _textureHeight);
    
    // Map the UV coordinates to the specific frame
    uv = uv * frameSize + frameCoord;

    // Flip the y-coordinate
    uv.y = frameCoord.y + frameSize.y - (uv.y - frameCoord.y);
    
    // Sample the texture
    vec4 color = texture2D(textureAtlas, uv);
    
   
    float finalAlpha =  color.a;
    gl_FragColor = color;
    
  }

 

  void main() {

       calculateWithCoordinates(false);
       
    }
    
`

  const { viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      textureAtlas: {
        value: map
      },

      frameX: { value: 0 },
      frameY: { value: 0 },
      frameWidth: { value: 0 },
      frameHeight: { value: 0 },
      textureWidth: { value: 1 },
      textureHeight: { value: 1 },
      iResolution: { value: [viewport.width, viewport.height] },
      iTime: { value: 0 },
      alphaValue: { value: 0.0 }
    }),
    []
  )

  useEffect(() => {
    if (map && textureData !== undefined && matRef.current) {
      map.minFilter = THREE.LinearFilter
      map.magFilter = THREE.LinearFilter
      map.wrapS = THREE.ClampToEdgeWrapping
      map.wrapT = THREE.ClampToEdgeWrapping
      map.flipY = false
      map.needsUpdate = true

      matRef.current.uniforms.textureAtlas.value = map

      //
      //console.log('texture data: ', textureData)
      matRef.current.uniforms.frameX.value = textureData?.x ?? 0
      matRef.current.uniforms.frameY.value = textureData?.y ?? 0
      matRef.current.uniforms.frameWidth.value = textureData?.w ?? 0
      matRef.current.uniforms.frameHeight.value = textureData?.h ?? 0
      matRef.current.uniforms.textureWidth.value = textureData?.textureWidth ?? 0
      matRef.current.uniforms.textureHeight.value = textureData?.textureHeight ?? 0
      //
      //

      matRef.current.needsUpdate = true
    }
  }, [map, textureData, rows, columns])

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.iTime.value = clock.getElapsedTime()
      matRef.current.uniforms.iResolution.value = [viewport.width, viewport.height]
      matRef.current.needsUpdate = true
      //matRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <shaderMaterial
      ref={matRef}
      transparent={true}
      uniforms={uniforms}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      toneMapped={false}
    />
  )
}
