import { AudioLoader, PositionalAudio, AudioListener, Audio } from 'three'
import { ReactThreeFiber, useThree } from '@react-three/fiber'

type Track = {
  trackName: string
  url: string
  volume: number
}

type Tracks = Track[]

class AudioManager {
  private static instance: AudioManager
  private audioLoader: AudioLoader
  private audioListener: AudioListener
  private audioMap: Map<string, PositionalAudio<ReactThreeFiber.Object3DNode<typeof Audio, typeof Audio>>>

  private constructor(tracks: Tracks) {
    const { camera } = useThree() // Access the three.js camera
    this.audioLoader = new AudioLoader()
    this.audioListener = new AudioListener()
    this.audioMap = new Map()

    // Add audio listener to the camera
    camera.add(this.audioListener)

    // Load all tracks
    tracks.forEach((track) => {
      this.loadTrack(track)
    })
  }

  public static getInstance(): AudioManager {
    return AudioManager.instance
  }

  public static init(tracks: Tracks) {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager(tracks)
    }
  }

  private loadTrack(track: Track): void {
    this.audioLoader.load(track.url, (buffer: any) => {
      const sound = new Audio(this.audioListener)
      sound.setBuffer(buffer)
      sound.setVolume(track.volume)
      sound.setLoop(false)
      this.audioMap.set(track.trackName, sound)
    })
  }

  public playTrack(trackName: string): void {
    const sound = this.audioMap.get(trackName)

    if (sound) {
      sound.play()
    } else {
      console.error(`Track ${trackName} not found.`)
    }
  }

  public setVolume(trackName: string, volume: number): void {
    const sound = this.audioMap.get(trackName)
    if (sound) {
      sound.setVolume(volume)
    } else {
      console.error(`Track ${trackName} not found.`)
    }
  }
}

export default AudioManager
