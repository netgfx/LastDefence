import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { CoreState, useGlobalStore } from '../state/globalState'
import { GameOverModal } from './GameOverModal'

const HUDElement = ({ position, children }) => {
  const { camera } = useThree()
  const hudRef = useRef<any | null>(null)

  const calculatePosition = () => {
    if (!hudRef.current) return [0, 0]
    const { left, right, top, bottom, width, height } = hudRef.current?.getBoundingClientRect()

    const pos = new THREE.Vector3((position[0] * width) / 2, (position[1] * height) / 2, 0)

    pos.project(camera)

    return [(pos.x * width) / 2 + width / 2 - left, -(pos.y * height) / 2 + height / 2 - top]
  }

  return (
    <Html ref={hudRef} calculatePosition={calculatePosition}>
      <div style={{ position: 'absolute', left: 0, top: 0, cursor: 'pointer', width: '100vw', height: '100vh' }}>{children}</div>
    </Html>
  )
}

const reloadPage = () => {
  window.location.reload()
}

export const HUDArea = () => {
  const currentScore = useGlobalStore((state: CoreState) => state.currentScore)
  const gameOver = useGlobalStore((state: CoreState) => state.gameOver)
  //
  const [openModal, setOpenModal] = useState<boolean>(false)

  useEffect(() => {
    setOpenModal(gameOver)
  }, [gameOver])

  return (
    <>
      <HUDElement position={[-1, 1, 0]}>
        {/* Top-left HUD element */}
        <div
          onClick={reloadPage}
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'ivory',
            width: '100px',
            height: '50px',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            border: '#101010',
            borderRadius: '4px'
          }}>
          <span style={{ fontSize: '24px' }}>Menu</span>
        </div>
      </HUDElement>

      <HUDElement position={[-1, 1, 0]}>
        {/* Top-right HUD element */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '20px',
            backgroundColor: 'transparent',
            width: 'auto',
            height: '50px',
            borderRadius: '4px',
            boxShadow: '0 0px 12px rgba(255, 255, 255, 0.8), 0 0px 12px rgba(255, 255, 255, 0.8)'
          }}>
          <div
            style={{
              width: 'auto',
              paddingLeft: '10px',
              paddingRight: '10px',
              minWidth: '120px',
              height: '50px',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              border: 'ivory',
              backgroundColor: '#101010',
              borderRadius: '4px',
              color: 'ivory',
              boxSizing: 'border-box'
            }}>
            <div
              style={{
                fontSize: '32px',
                whiteSpace: 'nowrap',

                boxSizing: 'border-box'
              }}>{`Score: ${currentScore}`}</div>
          </div>
        </div>
      </HUDElement>

      <HUDElement position={[0, 0, 0]}>
        <div style={{ position: 'absolute', width: '500px', height: '250px', top: '20vh', left: '50%', transform: 'translateX(-50%)' }}>
          {openModal && <GameOverModal setModal={setOpenModal} />}
        </div>
      </HUDElement>
    </>
  )
}
