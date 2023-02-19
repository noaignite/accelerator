type Response<T> =
  | ({
      token: string | null
    } & Partial<T>)
  | {
      token: string | null
      errors: Record<string, string>
    }

export default Response
