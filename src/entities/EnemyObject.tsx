import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import _ from 'lodash'
import { useGSAP } from '@gsap/react'
import { SpriteAnimator } from '@react-three/drei'
import AudioManager from '../helpers/AudioManagerWeb'
import { CoreState, useGlobalStore } from '../state/globalState'

const Enemy = forwardRef((props: any, ref) => {
  const enemyRef = useRef<any | null>(null)
  const { enemyType } = props
  const [isFirst, setIsFirst] = useState<boolean>(false)
  const [isActive, setIsActive] = useState<boolean>(false)
  //global store
  const mode = useGlobalStore((state: CoreState) => state.mode)
  const [enemyTypeObj, setEnemyTypeObj] = useState<string>(enemyType)
  const { contextSafe } = useGSAP({ scope: enemyRef })
  const animationRef = useRef<any | null>(null)
  const DROP_RATE = mode === 'NORMAL' ? 1.2 : 1.65
  const MIN_LIMIT = mode === 'NORMAL' ? 850 : 600
  const MAX_LIMIT = mode === 'NORMAL' ? 1050 : 950

  const getEnemyRef = () => {
    return enemyRef.current
  }

  const destroy = () => {
    animationRef.current?.pause()
    animationRef.current?.kill()
    animationRef.current = null
    setIsFirst(false)
    setIsActive(false)
  }

  const getType = () => {
    return enemyType || enemyTypeObj
  }

  useImperativeHandle(
    ref,
    () => ({
      isActive: isActive,
      setActive: setIsActive,
      getEnemyRef: getEnemyRef,
      destroy: destroy,
      setIsFirst: setIsFirst,
      getType: getType
    }),
    [enemyType, enemyType, getEnemyRef, destroy, setIsActive, isActive, setIsFirst]
  )

  useEffect(() => {
    setEnemyTypeObj(enemyType)
  }, [enemyType])

  useGSAP(() => {
    if (isActive) {
      const startPosition = getStartPosition()
      // reset position

      enemyRef.current.position.y = 18
      enemyRef.current.position.x = startPosition.x
      enemyRef.current.visible = true
      //adjustEnemySpeed()
      animateEnemy()
    } else {
      enemyRef.current.visible = false
    }
  }, [isActive])

  // useFrame(() => {
  //   // Update enemy position in the render loop
  //   if (isActive === false) {
  //     enemyRef.current.visible = false
  //   } else {
  //     enemyRef.current.visible = true
  //   }
  // })

  const recycleEnemy = () => {
    // Remove the enemy from the active enemies and mark it as inactive in the pool
    //setActiveEnemies((prevEnemies) => prevEnemies.filter((enemy) => enemy.key !== enemyRef.current.key))
    setIsActive(false)
  }

  const handleEnemyFinish = () => {
    // Recycle the enemy by moving it off-screen
    enemyRef.current.position.y = 18.0
    recycleEnemy()
  }

  function getRandomRow() {
    const rows = [-1, 0, 1, 2]
    return _.sample(rows)
  }

  const getStartPosition = () => {
    if (isFirst) {
      return { x: 0 }
    }

    const row = getRandomRow() //Math.floor(Math.random() * 3)
    switch (row) {
      case 0: // Left row
        return { x: -10 }
      case -1: // Middle row for equal chance
        return { x: 0 }
      case 1: // Middle row
        return { x: 0 }
      case 2: // Right row
        return { x: 10 }
      default:
        return { x: 0 }
    }
  }

  const playSound = () => {
    AudioManager.getInstance().playTrack('fireball')
  }

  const animateEnemy = contextSafe(() => {
    const velocity = gsap.utils.random(0.92, 0.69, true)
    const duration = velocity() // Duration based on initial velocity and window height

    // Define a custom ease function to simulate gravity
    //const customEase = gsap.parseEase(`M0,0 C0.25,${-velocity / 4000},0.5,${-velocity / 2000},0.75,${-velocity / 1000},1,0`)
    // Create a custom cubic bezier ease
    const customEase = gsap.parseEase(`M0,0 C0.42,0,0.58,1,1,1`)
    //const styleOffset = Math.round(Math.random() * 10)
    playSound()
    animationRef.current = gsap.to(enemyRef.current.position, {
      y: -15.5,
      ease: customEase, //styleOffset >= 5 ? 'power1.out' : 'power2.out',
      duration: duration * DROP_RATE, ///styleOffset >= 5 ? Math.round(4 / enemySpeed) : Math.round(6 / enemySpeed), // Adjust duration based on speed
      delay: 0.05, // Add 50ms delay
      onComplete: handleEnemyFinish
    })
  })

  return (
    <SpriteAnimator
      ref={enemyRef}
      position={[0.0, 18.0, 0.0]}
      autoPlay={true}
      loop={true}
      scale={2}
      spriteDataset={props.spriteObj}
      alphaTest={0.01}
      asSprite={false}
    />

    // <mesh ref={enemyRef} position={[0, 18, 0]}>
    //   <boxGeometry args={[1, 1, 1]} />
    //   <meshStandardMaterial color="red" />
    // </mesh>
  )
})

export default Enemy
