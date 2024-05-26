import { TrackConfig } from '../core/types/types'

export const TRACKS: TrackConfig[] = [
  {
    trackName: 'creepyBell',
    url: '/sounds/creepybell.mp3',
    volume: 0.2
  },
  {
    trackName: 'fireball',
    url: '/sounds/Fireball.mp3',
    volume: 0.1
  },
  {
    trackName: 'bg',
    url: '/sounds/bg_ambient.mp3',
    volume: 0.025
  },
  {
    trackName: 'slash',
    url: '/sounds/slash_fireball.mp3',
    volume: 0.08
  },
  {
    trackName: 'main_bg',
    url: '/sounds/DarkAmbientBackgroundMenu.mp3',
    volume: 0.025
  },
  { trackName: 'loss', url: '/sounds/lose.mp3', volume: 0.35 }
]

export const CACHE_BUST = Math.random() * 100000
