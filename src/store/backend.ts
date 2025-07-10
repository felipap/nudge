import 'dotenv/config'

import { app } from 'electron'
import Store from 'electron-store'
import { debug } from '../lib/logger'
import { DEFAULT_STATE, State } from './types'

// Change the app name so that, in dev, data is stored in ~/Library/Application
// Support/NudgeDev. The original appName comes from package.json, and I
// couldn't find another way to make it dynamic other than setting it here. (Not
// even by setting it in main.ts, which would've been better.)
app.setName(`Nudge${app.isPackaged ? '' : 'Dev'}`)

// Print the folder of storage:
debug('app.getPath("userData")', app.getPath('userData'))

// You'll find this in the root project folder as data-backup.json
// Will be stored in ~/Library/Application Support/Nudge/data.json
export const fileStore = new Store<State>({
  name: 'data',
  defaults: DEFAULT_STATE,
  clearInvalidConfig: true,
  watch: true,
}) as any
