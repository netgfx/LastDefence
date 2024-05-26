import React from 'react'
import { MdOutlineClose } from 'react-icons/md'

export function Modal({ setModal }: { setModal: any }) {
  const onClose = () => {
    setModal(false)
  }

  return (
    <div className="modal" id="modal">
      <MdOutlineClose
        className="close-button"
        id="close-button"
        size={24}
        onClick={onClose}
        style={{ position: 'absolute', right: '10px', top: '5px', cursor: 'pointer', zIndex: 1 }}
      />
      <div className="modal-guts">
        <h1>How to play</h1>

        <p style={{ lineHeight: '30px', fontSize: '22px' }}>
          Click / Tap and hold for the middle knight to attack the incoming projectiles, release for the side Knights to attack. If a
          projectile goes through it is game over. Enjoy!
        </p>
        <div className="modal-btn" onClick={onClose}>
          Got it!
        </div>
      </div>
    </div>
  )
}
