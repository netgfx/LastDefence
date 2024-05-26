import React from 'react'
import { MdOutlineClose } from 'react-icons/md'
import { CoreState, useGlobalStore } from '../state/globalState'

export function GameOverModal({ setModal }: { setModal: any }) {
  const setCurrentView = useGlobalStore((state: CoreState) => state.setCurrentView)
  const setCurrentCacheKey = useGlobalStore((state: CoreState) => state.setCurrentCachKey)
  const onClose = () => {
    setModal(false)
    // reset the canvas key in order to reset it
    setCurrentView('MENU')
    setCurrentCacheKey(Math.random() * 100000)
  }

  return (
    <>
      <div className="modal-bg"></div>
      <div className="gameover-modal modal" id="modal">
        <MdOutlineClose
          className="close-button"
          id="close-button"
          size={24}
          onClick={onClose}
          style={{ position: 'absolute', right: '10px', top: '5px', cursor: 'pointer', zIndex: 1 }}
        />
        <div className="modal-guts">
          <h1>GAME OVER</h1>

          <p style={{ lineHeight: '30px', fontSize: '22px' }}>You were overrun by undead! But not all is lost...</p>
          <div className="modal-btn" onClick={onClose}>
            Onward!
          </div>
        </div>
      </div>
    </>
  )
}
