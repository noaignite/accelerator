export type SuccessResponse<T> = T & {
  token?: string | null
}

export type ErrorResponse = {
  token?: string | null
  errors: Errors
}

export type Errors = Record<string, string>

export type Response<T> = SuccessResponse<T> | ErrorResponse