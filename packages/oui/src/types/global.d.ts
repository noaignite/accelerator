import { IOptions as IOAOptions } from 'intersection-observer-admin'

declare module 'intersection-observer-admin' {
  // Why doesn't this work???

  // export interface IOptions {
  //   root?: HTMLElement
  //   rootMargin?: string
  //   threshold?: number | number[]
  //   [key: string]: any
  // }

  interface IOptions extends Omit<IOAOptions, 'threshold'> {
    threshold?: number | number[]
  }
}
