import type { KeyOfAny } from '@noaignite/utils'

export type SuccessResponse<T> = T & {
  token?: string | null
}

export type ErrorResponse = {
  token?: string | null
  errors: Errors
}

export type Errors = Record<KeyOfAny, unknown>

type Response<T> = SuccessResponse<T> | ErrorResponse

export default Response
