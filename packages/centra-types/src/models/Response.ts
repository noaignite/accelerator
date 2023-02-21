export type SuccessResponse<T> = T & {
  token: string | null
}

export type ErrorResponse = {
  token: string | null
  errors: Errors
}

export type Errors = Record<string, string>

type Response<T> = SuccessResponse<T> | ErrorResponse

export default Response
