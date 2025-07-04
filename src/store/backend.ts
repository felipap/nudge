import 'dotenv/config'

import Store from 'electron-store'
import { DEFAULT_STATE, State } from './types'

// You'll find this in the root project folder as data-backup.json
// Will be stored in ~/Library/Application Support/Nudge/data.json
export const fileStore = new Store<State>({
  name: 'data',
  defaults: DEFAULT_STATE,
  cwd: process.env.USE_LOCAL_DATA ? process.cwd() : undefined, // Use local data.json
  clearInvalidConfig: true,
  watch: true,
}) as any

// export const store = create<State>()(
//   persist((set, get, store: StoreApi<State>) => DEFAULT_STATE, {
//     name: 'nudge-store',
//     storage: {
//       getItem: (name) => {
//         const value = electronStore.get(name)
//         return value
//       },
//       setItem: (name, value) => {
//         electronStore.set(name, value)
//       },
//       removeItem: (name) => {
//         electronStore.delete(name)
//       },
//     },
//   })
// )
