import { app } from 'electron'
import path from 'path'

export function getImagePath(name: string) {
  const base = app.isPackaged
    ? path.join(process.resourcesPath, 'images')
    : path.join(__dirname, '../../images')
  return path.join(base, name)
}

export function getIsOutsideApplicationsFolder(): boolean {
  if (process.platform !== 'darwin') {
    // Only relevant on macOS
    return false
  }

  if (!app.isPackaged) {
    return true
  }

  const appPath = app.getPath('exe')
  const normalizedPath = path.resolve(appPath)

  // This is leaky but it's an easy way to accept both /Applications and
  // ~/Applications.
  return !normalizedPath.includes('/Applications/')
}

type Falsy = false | 0 | '' | null | undefined
export const isTruthy = <T>(x: T | Falsy): x is T => !!x

// export function getUniqueComputerId() {
//   return
// }

export function ellipsis(text: string, maxLength = 200) {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}
