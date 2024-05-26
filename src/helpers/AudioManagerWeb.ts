import { TrackConfig } from '../core/types/types'

class AudioManager {
  private static instance: AudioManager
  private audioContext: AudioContext
  private audioMap: Map<string, { buffer: AudioBuffer; volume: number }>
  private backgroundTrackSource?: AudioBufferSourceNode

  private constructor(tracks: TrackConfig[] = []) {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    this.audioMap = new Map<string, { buffer: AudioBuffer; volume: number }>()
  }

  public static getInstance(): AudioManager {
    return AudioManager.instance
  }

  private async loadTrack(trackConfig: TrackConfig): Promise<void> {
    const response = await fetch(trackConfig.url, {
      headers: {
        Accept: 'audio/mpeg'
      }
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch track: ${trackConfig.url}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
    this.audioMap.set(trackConfig.trackName, { buffer: audioBuffer, volume: trackConfig.volume })
  }

  private async loadTracks(tracks: TrackConfig[]): Promise<void> {
    for (const track of tracks) {
      await this.loadTrack(track)
    }
  }

  public static async init(tracks: TrackConfig[]) {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager(tracks)

      if (tracks.length > 0) {
        await AudioManager.instance.loadTracks(tracks)
      }
    }
  }

  public playTrack(trackName: string, loop: boolean = false): void {
    const trackData = this.audioMap.get(trackName)

    if (trackData) {
      if (loop && this.backgroundTrackSource) {
        console.warn(`Background track ${trackName} is already playing.`)
        return
      }

      const trackSource = this.audioContext.createBufferSource()
      trackSource.buffer = trackData.buffer
      trackSource.loop = loop

      const gainNode = this.audioContext.createGain()
      gainNode.gain.value = trackData.volume

      trackSource.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      trackSource.start(0)

      if (loop) {
        this.backgroundTrackSource = trackSource
      }

      trackSource.onended = () => {
        if (loop) {
          this.backgroundTrackSource = undefined
        }
        trackSource.disconnect()
        gainNode.disconnect()
      }
    } else {
      console.error(`Track ${trackName} not found.`)
    }
  }

  public stopLoop(): void {
    if (this.backgroundTrackSource) {
      this.backgroundTrackSource.stop()
      this.backgroundTrackSource.disconnect()
      this.backgroundTrackSource = undefined
    }
  }
}

export default AudioManager
