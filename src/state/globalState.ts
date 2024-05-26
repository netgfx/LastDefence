import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import _ from 'lodash'
import { VIEWS, ACTIONS, GAME_MODE } from '../core/types/types'
import { CACHE_BUST } from '../helpers/constants'

export interface CoreState {
  currentView: VIEWS
  currentAction: ACTIONS
  initFinished: boolean
  currentScore: number
  slashFrameTime: number
  slashSidesFrameTime: number
  sideModel1Ref: any
  enemyPool: any[]
  gameOver: boolean
  mode: GAME_MODE
  currentHardScore: number
  maxScore: number
  currentCacheKey: number
  hasSeenInfo: boolean
  setHasSeenInfo: (value: boolean) => void
  setCurrentCachKey: (value: number) => void
  resetCurrentScore: () => void
  setCurrentMaxScore: () => void
  setCurrentHardScore: (value: number) => void
  setGameMode: (value: GAME_MODE) => void
  setGameOver: (value: any) => void
  addEnemyToPool: (value: any) => void
  setEnemyPool: (value: any[]) => void
  setSideModel1Ref: (value: any) => void
  setSlashSidesFrameTime: (value: number) => void
  setSlashFrameTime: (value: number) => void
  increaseCurrentScore: () => void
  setInitFinished: (value: boolean) => void
  setCurrentAction: (value: ACTIONS) => void
  setCurrentView: (value: VIEWS) => void
}

export const useGlobalStore = create<CoreState>()(
  persist(
    (set, get) => ({
      currentView: 'MENU',
      currentAction: null,
      initFinished: false,
      currentScore: 0,
      slashFrameTime: -1,
      slashSidesFrameTime: -1,
      sideModel1Ref: null,
      enemyPool: [],
      gameOver: false,
      mode: 'NORMAL',
      currentHardScore: 0,
      maxScore: 0,
      currentCacheKey: CACHE_BUST,
      hasSeenInfo: false,
      setHasSeenInfo: (value: boolean) => set({ hasSeenInfo: value }),
      setCurrentCachKey: (value: number) => set({ currentCacheKey: value }),
      resetCurrentScore: () => set({ currentScore: 0 }),
      setCurrentMaxScore: () =>
        set((state: CoreState) => {
          if (state.currentScore > state.maxScore) {
            return { maxScore: state.currentScore }
          } else {
            return { maxScore: state.maxScore }
          }
        }),
      setCurrentHardScore: (value: number) => set({ currentHardScore: value }),
      setGameMode: (value: GAME_MODE) => set({ mode: value }),
      setGameOver: (value: boolean) => set({ gameOver: value }),
      addEnemyToPool: (value: any) => (state: CoreState) => {
        let _pool = [...state.enemyPool]
        _pool.push(value)
        _pool = _.uniq(_pool)
        set({ enemyPool: _pool })
      },
      setEnemyPool: (value: any[]) => set({ enemyPool: value }),
      setSideModel1Ref: (value: any) => set({ sideModel1Ref: value }),
      setSlashSidesFrameTime: (value: number) => set({ slashSidesFrameTime: value }),
      setSlashFrameTime: (value: number) => set({ slashFrameTime: value }),
      increaseCurrentScore: () =>
        set((state: CoreState) => {
          let finalScore = state.currentScore
          finalScore += 10

          return { currentScore: finalScore }
        }),
      setInitFinished: (value: boolean) => set({ initFinished: value }),
      setCurrentAction: (value: ACTIONS) => set({ currentAction: value }),
      setCurrentView: (value: VIEWS) => set({ currentView: value })
    }),
    {
      name: 'last-defence-game', // name of item in the storage (must be unique)
      onRehydrateStorage: (state) => {
        //state.setInitFinished(false)
        state.initFinished = false
      },
      partialize: (state) => ({ currentScore: state.currentScore, maxScore: state.maxScore, hasSeenInfo: state.hasSeenInfo })
    }
  )
)
