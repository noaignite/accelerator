declare module '@maeertin/medialoaded' {
  export interface MLEntry {
    images: HTMLImageElement[]
    videos: HTMLVideoElement[]
    posters: HTMLImageElement[]
    hasBroken: boolean
    total: number
  }

  export type MLCallback = (entry: MLEntry) => void

  export type MLTarget = HTMLDivElement | HTMLDivElement[] | string

  function mediaLoaded(target: MLTarget, callback: MLCallback): void

  export default mediaLoaded
}
