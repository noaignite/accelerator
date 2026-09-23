import { ReadableStream, TransformStream, WritableStream } from 'node:stream/web'

Object.assign(globalThis, { ReadableStream, TransformStream, WritableStream })
