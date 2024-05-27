import React, { useState, useEffect, useRef } from 'react'
import Enemy from './EnemyObject'
import { useFrame } from '@react-three/fiber'
import { CoreState, useGlobalStore } from '../state/globalState'
import EventEmitterFn from '../utils/EventEmitter'
import { useSpriteLoader } from '@react-three/drei'
import _ from 'lodash'

export const EnemyManager = ({ init }: { init: boolean }) => {
  const [activeEnemies, setActiveEnemies] = useState<any[]>([])
  // global state
  const enemyPool = useGlobalStore((state: any) => state.enemyPool)
  const setEnemyPool = useGlobalStore((state: any) => state.setEnemyPool)
  const mode = useGlobalStore((state: CoreState) => state.mode)
  const gameOver = useGlobalStore((state: CoreState) => state.gameOver)
  const firstWave = useRef<boolean>(true)
  //
  //const enemyPool = useRef<any[]>([])
  const timerOffset = 100
  const timerRef = useRef(3000)
  const minTimer = 500
  const currentTime = React.useRef(window.performance.now())
  //
  const { spriteObj } = useSpriteLoader(
    'https://gwcjylrsyylsuacdrnov.supabase.co/storage/v1/object/public/models/LastDefence/skullball.png',
    'https://gwcjylrsyylsuacdrnov.supabase.co/storage/v1/object/public/models/LastDefence/skullball.json',
    null,
    null
  )

  const { spriteObj: fireball } = useSpriteLoader(
    'https://gwcjylrsyylsuacdrnov.supabase.co/storage/v1/object/public/models/LastDefence/fireball.png',
    'https://gwcjylrsyylsuacdrnov.supabase.co/storage/v1/object/public/models/LastDefence/fireball.json',
    null,
    null
  )

  useEffect(() => {
    if (spriteObj) {
      const activeEnemies = []
      let _enemyPool: any[] = []
      for (let i = 0; i < 30; i++) {
        const enemyRef = React.createRef()

        const newEnemy = <Enemy key={i} ref={enemyRef} spriteObj={spriteObj} enemyType="skull" />
        _enemyPool.push({ ref: enemyRef, isActive: false, key: i, enemy: newEnemy })
        activeEnemies.push(newEnemy)

        if (mode === 'HARD') {
          const newEnemy2 = <Enemy key={i} ref={enemyRef} spriteObj={fireball} enemyType="fireball" />
          _enemyPool.push({ ref: enemyRef, isActive: false, key: i + 48, enemy: newEnemy2 })
          activeEnemies.push(newEnemy2)
        }
      }

      // shuffle if hard mode
      _enemyPool = _.shuffle(_enemyPool)
      setEnemyPool(_enemyPool)
      setActiveEnemies(activeEnemies)
    }
  }, [spriteObj])

  // useEffect(() => {
  //   // Initialize the enemy pool

  //   const interval = setInterval(() => {
  //     generateWave()
  //     adjustWaveInterval()
  //   }, waveInterval)

  //   return () => clearInterval(interval)
  // }, [waveInterval])

  const generateWave = () => {
    const availableEnemy = enemyPool.find((enemy: any) => enemy.ref.current?.isActive === false)

    if (availableEnemy) {
      // 0 = left, 1 = middle, 2 = right
      //console.log(availableEnemy.ref, availableEnemy.ref.current)
      //   const newEnemy = (
      //     <Enemy key={availableEnemy.key} enemyRef={availableEnemy.ref} row={row} speed={enemySpeed} onFinish={handleEnemyFinish} />
      //   )
      if (firstWave.current === true) {
        availableEnemy.ref.current.setIsFirst(true)
        firstWave.current = false
      } else {
        availableEnemy.ref.current.setIsFirst(false)
      }
      availableEnemy.ref.current?.setActive(true)
    } else {
      const enemyRef: any = React.createRef()
      const newEnemy = <Enemy key={enemyPool.current.length} ref={enemyRef} type="skull" />
      enemyPool.current.push({ ref: enemyRef, key: enemyPool.current.length, enemy: newEnemy })
      enemyRef.current?.setActive(true)
      setActiveEnemies((prevEnemies) => [...prevEnemies, newEnemy])
    }

    EventEmitterFn.emit('WAVE_GENERATED', { message: true, availableEnemy })
  }

  useEffect(() => {
    if (init) {
      generateWave()
      currentTime.current = window.performance.now()
    }
  }, [init])

  // const adjustWaveInterval = () => {
  //   // Adjust wave interval based on your desired pattern
  //   const newInterval = Math.max(timerRef.current - timerOffset, minTimer) // Random interval between 1000 and 3000 ms

  //   setWaveInterval(newInterval)

  //   console.log(newInterval)
  //   timerRef.current = newInterval
  // }

  useFrame((delta) => {
    if (init === true && gameOver === false) {
      const now = window.performance.now()
      const diff = now - currentTime.current

      if (diff <= timerRef.current) return
      currentTime.current = now - (diff % timerRef.current)
      timerRef.current = Math.max(timerRef.current - timerOffset, minTimer)

      generateWave()
    }
  })

  return <>{activeEnemies}</>
}
