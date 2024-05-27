import React, { useEffect, useState } from 'react'
import { CoreState, useGlobalStore } from '../state/globalState'
import { TbInfoHexagon } from 'react-icons/tb'
import { Modal } from './Modal'
import AudioManager from '../helpers/AudioManagerWeb'

export function Menu() {
  const [maxScore, setMaxScore] = useState(0)
  // global store
  const setCurrentView = useGlobalStore((state: CoreState) => state.setCurrentView)
  const currentScore = useGlobalStore((state: CoreState) => state.maxScore)
  const currentHardScore = useGlobalStore((state: CoreState) => state.currentHardScore)
  const hasSeenInfo = useGlobalStore((state: CoreState) => state.hasSeenInfo)
  //
  const mode = useGlobalStore((state: CoreState) => state.mode)
  const setGameOver = useGlobalStore((state: CoreState) => state.setGameOver)
  //
  const [openModal, setOpenModal] = useState<boolean>(!hasSeenInfo)
  //
  useEffect(() => {
    if (currentScore) {
      setMaxScore(currentScore)
    } else {
      setMaxScore(0)
    }
  }, [currentScore])

  const onPlay = () => {
    setCurrentView('GAMEPLAY')
    setGameOver(false)
  }

  useEffect(() => {
    if (!openModal) {
      // means they interacted so we can start the TRACKS
      AudioManager.getInstance().playTrack('bg', true)
    }
  }, [openModal])

  return (
    <>
      <div className="bg">
        <div className="menu">
          <div className="menu-title">Last Defense</div>

          {currentHardScore <= 0 && (
            <div className="menu-score">
              <span>{`Max Score: ${maxScore}`}</span>
            </div>
          )}
          {currentHardScore > 0 && (
            <div className="menu-score">
              <span>{`Max Score Hard: ${currentHardScore}`}</span>
            </div>
          )}
          <div className="menu-btn" onClick={onPlay}>
            <span>Play normal</span>
          </div>

          <div className={`menu-btn ${mode === 'NORMAL' ? 'disabled' : ''}`} onClick={onPlay}>
            <span>Play hard</span>
            <div className="tooltip" style={{ position: 'absolute', right: '-40px' }}>
              <TbInfoHexagon
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                className="no-hover"
                title="Hard mode is unlocked at 500 score. Coming soon!"
                color="ivory"
                size={24}
              />
            </div>
          </div>
        </div>
        {openModal && <Modal setModal={setOpenModal} />}
      </div>
      <footer>Made by: Netgfx</footer>
    </>
  )
}
