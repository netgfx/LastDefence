import { CameraControls, Grid, Loader, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
//import { useSpriteLoader } from './useSpriteLoader'
import gsap from 'gsap'
import { EffectsFireLayer } from './entities/effects/EffectsFireLayer'
import { EffectsHolyLayer } from './entities/effects/EffectsHolyLayer'
import { EffectsSliceLayer } from './entities/effects/EffectsSliceLayer'
import { EnemyEntity } from './entities/EnemyEntity'
import { EnemyManager } from './entities/EnemyManager'
import { Player } from './entities/Player'
import { RaycastingLayer } from './scenes/RayCastingLayer'
import { CoreState, useGlobalStore } from './state/globalState'
import { HUDArea } from './UI/Hud'
import { Menu } from './UI/Menu'
import { BG } from './UI/BG'
import AudioManager from './helpers/AudioManagerWeb'
import { TRACKS } from './helpers/constants'

function Lights() {
  const ambientCtl = {
    visible: false,
    intensity: {
      value: 100.0,
      min: 0,
      max: 1.0,
      step: 0.1
    }
  }

  const directionalCtl = {
    visible: false,
    position: {
      x: 3.3,
      y: 10.0,
      z: 0
    },
    intensity: 300,
    castShadow: true
  }

  const pointCtl = {
    visible: true,
    position: {
      x: 5,
      y: 10,
      z: 0
    },
    intensity: 1000,
    castShadow: true
  }

  const spotCtl = {
    visible: false,

    position: {
      x: 0,
      y: 40,
      z: 0
    },
    intensity: 1000,
    castShadow: true
  }

  const pointLightRef = useRef()
  const spotLightRef = useRef()
  const directionalRef = useRef()

  return (
    <>
      <ambientLight visible={ambientCtl.visible} intensity={ambientCtl.intensity} />
      <directionalLight
        visible={directionalCtl.visible}
        position={[directionalCtl.position.x, directionalCtl.position.y, directionalCtl.position.z]}
        castShadow={directionalCtl.castShadow}
      />
      <pointLight
        ref={pointLightRef}
        intensity={pointCtl.intensity}
        visible={pointCtl.visible}
        position={[pointCtl.position.x, pointCtl.position.y, pointCtl.position.z]}
        castShadow={pointCtl.castShadow}
      />
      {/*<spotLight
        ref={spotLightRef}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={spotCtl.visible}
        position={[spotCtl.position.x, spotCtl.position.y, spotCtl.position.z]}
        castShadow={spotCtl.castShadow}
      /> */}

      {/* {directionalRef.current && <directionalLightHelper args={[directionalRef.current, 2]} />}
      {pointLightRef.current && <pointLightHelper args={[pointLightRef.current, 2]} />}
      {spotLightRef.current && <spotLightHelper args={[spotLightRef.current, 2]} />}
      {pointLightRef.current && <cameraHelper args={[pointLightRef.current?.shadow.camera]} />} */}
    </>
  )
}

const Rig = () => {
  const cameraControls = useRef<any | null>(null)
  const setCameraInitFinished = useGlobalStore((state: CoreState) => state.setInitFinished)

  //

  const initCamera = async () => {
    cameraControls.current.distance = 100
    cameraControls.current.mouseButtons.left = 0
    cameraControls.current.mouseButtons.right = 0
    cameraControls.current.mouseButtons.middle = 0
    cameraControls.current.mouseButtons.wheel = 0
    await cameraControls.current.zoom(30, true)

    setCameraInitFinished(true)
  }

  useEffect(() => {
    if (cameraControls.current) {
      initCamera()
      // cameraControls.current.maxZoom = 2
      // cameraControls.current.minZoom = 1
      // cameraControls.current.maxDistance = 22
      // cameraControls.current.minDistance = 5
      // cameraControls.current.moveTo(12, 5, 0)
    }
  }, [])

  return (
    <CameraControls
      makeDefault
      ref={cameraControls}
      azimuthAngle={THREE.MathUtils.degToRad(0)}
      polarAngle={THREE.MathUtils.degToRad(90)}
      //camera={new THREE.OrthographicCamera(-10, 10, 20, -20, 1, 1000)}
      dollyToCursor={false}
    />
  )
}

const ShakeCamera = ({ setShake }: { setShake: any }) => {
  const cameraRef = useRef<any | null>(null)
  //const {camera} = useThree()

  const shakeCamera = () => {
    const shakeIntensity = 0.5 // Adjust the shake intensity
    const duration = 0.05 // Adjust the duration

    if (cameraRef.current) {
      gsap
        .timeline()
        .to(cameraRef.current.position, { x: `+=${shakeIntensity}`, y: `+=${shakeIntensity}`, z: `+=${shakeIntensity}`, duration })
        .to(cameraRef.current.position, {
          x: `-=${shakeIntensity * 2}`,
          y: `-=${shakeIntensity * 2}`,
          z: `-=${shakeIntensity * 2}`,
          duration
        })
        .to(cameraRef.current.position, {
          x: `+=${shakeIntensity}`,
          y: `+=${shakeIntensity}`,
          z: `+=${shakeIntensity}`,
          duration,
          onComplete: () => {
            setShake(false)
          }
        })
    }
  }

  useFrame(({ camera }) => {
    // Store the reference to the camera
    cameraRef.current = camera
    // Example: Trigger shakeCamera on every frame (for demonstration purposes)
    // REMOVE in real use case, and call shakeCamera only on specific events instead
    // shakeCamera();
  })

  useEffect(() => {
    shakeCamera()
  }, [])

  return null
}

export function Gameplay() {
  const initFinished = useGlobalStore((state: any) => state.initFinished)
  const [size, setSize] = useState({ width: '0vw', height: '0vh' })
  const [shake, setShake] = useState<boolean>(true)
  const [initManager, setInitManager] = useState<boolean>(false)
  const mode = useGlobalStore((state: CoreState) => state.mode)
  const gameOver = useGlobalStore((state: CoreState) => state.gameOver)
  const setMaxScore = useGlobalStore((state: CoreState) => state.setCurrentMaxScore)
  //

  // Function to change size
  const changeSize = () => {
    setSize({ width: '100vw', height: '100vh' })
  }

  useEffect(() => {
    setSize({ width: '99vw', height: '99vh' })
  }, [])

  useEffect(() => {
    let timeOut1: any = null
    let timeOut2: any = null
    if (initFinished) {
      timeOut1 = setTimeout(() => changeSize(), 2000)
      timeOut2 = setTimeout(() => {
        setInitManager(true)
        AudioManager.getInstance().stopLoop()
        AudioManager.getInstance().playTrack('main_bg', true)
      }, 4500)
    }
    AudioManager.getInstance().playTrack('creepyBell')

    return () => {
      if (timeOut1) window.clearTimeout(timeOut1)
      if (timeOut2) window.clearTimeout(timeOut2)
    }
  }, [initFinished])

  useEffect(() => {
    if (gameOver) {
      AudioManager.getInstance().playTrack('loss')
      setMaxScore()
      // TODO: Show loss modal
    }
  }, [gameOver])

  return (
    <div style={size}>
      <Canvas
        orthographic={true}
        camera={{
          position: [0, 0, 0],
          fov: 55,
          far: 1000,
          near: 0.1
        }}>
        {/* <Perf /> */}

        <Suspense fallback={null}>
          <Rig />
          <ambientLight />
          <Lights />
          <EnemyManager init={initManager} />
          <Player />
          <EnemyEntity />
          {mode === 'HARD' && <EffectsHolyLayer />}
          <EffectsFireLayer />
          <EffectsSliceLayer type="CENTER" />
          <BG />
          <RaycastingLayer />
          <HUDArea />
          {shake && <ShakeCamera setShake={setShake} />}
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  )
}

// export function Debug() {
//   return (
//     <Canvas
//       camera={{
//         position: [10, 15, -10],
//         fov: 45,
//         far: 1000,
//         near: 0.1
//       }}>
//       <Suspense fallback={null}>
//         <OrbitControls
//           target={[2.5, 0.5, 0.5]}
//           enablePan={true}
//           maxDistance={30.0}
//           minDistance={1.0}
//           enableRotate={true}
//           enableZoom={true}
//           //enableDamping={true}
//           dampingFactor={0.1}
//           rotateSpeed={0.5}
//         />
//         <ambientLight />
//         <pointLight position={[10, 10, 10]} />

//         {/* <SlashEffect /> */}
//       </Suspense>
//     </Canvas>
//   )
// }

const AudioComponent = () => {
  const [audioReady, setAudioReady] = useState<boolean>(false)

  useEffect(() => {
    const audio = AudioManager.init(TRACKS)
    audio.then(() => {
      setAudioReady(true)
    })
  }, [])

  useEffect(() => {
    if (audioReady) {
      AudioManager.getInstance().playTrack('bg', true)
    }
  }, [audioReady])

  return null
}

export function App() {
  const currentView = useGlobalStore((state: any) => state.currentView)
  // global state score reset
  const resetScore = useGlobalStore((state: CoreState) => state.resetCurrentScore)

  useEffect(() => {
    if (currentView !== 'MENU') {
      resetScore()
    }
  }, [currentView])
  return (
    <>
      <AudioComponent />
      <div style={{ fontFamily: "'UnifrakturCook',cursive", visibility: 'hidden', opacity: 0, position: 'fixed' }}>&nbsp;</div>
      {currentView === 'MENU' ? <Menu /> : <Gameplay />}
    </>
  )
}
