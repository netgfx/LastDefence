import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import { gsap } from 'gsap'

const positions: ('left' | 'middle' | 'right')[] = ['left', 'middle', 'right']
const speeds: ('slow' | 'medium' | 'fast')[] = ['slow', 'medium', 'fast']

export class Enemy {
  position: 'left' | 'middle' | 'right'
  speed: 'slow' | 'medium' | 'fast'
  mesh: Mesh

  constructor() {
    this.position = positions[Math.floor(Math.random() * positions.length)]
    this.speed = speeds[Math.floor(Math.random() * speeds.length)]
    this.mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial({ color: 0x00ff00 }))
    this.mesh.position.y = -10 // Start off screen
  }

  resetEnemy() {
    // Randomly select a position and speed
    this.position = positions[Math.floor(Math.random() * positions.length)]
    this.speed = speeds[Math.floor(Math.random() * speeds.length)]
  }
}

const useEnemy = () => {
  const enemiesRef = useRef<Enemy[]>([])
  const [start, setStart] = useState<boolean>(false)
  // Create initial pool of enemies
  for (let i = 0; i < 10; i++) {
    const enemy = new Enemy()
    enemiesRef.current.push(enemy)
  }

  // TODO: Use useContext
  const animateEnemy = (enemy: Enemy) => {
    gsap.to(enemy.mesh.position, {
      y: window.innerHeight,
      duration: 2, // Adjust speed here
      onComplete: () => recycleEnemy(enemy)
    })
  }

  const recycleEnemy = (enemy: Enemy) => {
    enemy.mesh.position.y = -10
    enemy.resetEnemy()
    animateEnemy(enemy)
  }

  const getEnemy = () => {
    const availableEnemy = enemiesRef.current.find((enemy) => enemy.mesh.position.y < 0)
    if (availableEnemy) {
      return availableEnemy
    } else {
      // If no enemy is available, create a new one
      const enemy = new Enemy()
      enemiesRef.current.push(enemy)
      return enemy
    }
  }

  const spawnEnemies = () => {
    const enemy = getEnemy()
    animateEnemy(enemy)
  }

  // Animate enemies each frame
  //   useFrame(() => {
  //     enemiesRef.current.forEach((enemy) => {
  //       if (enemy.mesh.position.y < 0) {
  //         animateEnemy(enemy)
  //       }
  //     })
  //   })

  useEffect(() => {
    let intervalId: any
    if (start) {
      intervalId = setInterval(spawnEnemies, 1000 + Math.random() * 2000)
    } else {
      clearInterval(intervalId)
    }

    return () => clearInterval(intervalId)
  }, [start])

  return { getEnemy, setStart }
}

export default useEnemy
