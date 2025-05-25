export const USER_TZ = 'America/Los_Angeles' // FIXME

export type IPCResponse<T> = {
  data: T
  error: string | null
}
