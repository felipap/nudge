import { app } from 'electron'
import path from 'path'

export function getImagePath(name: string) {
  const base = app.isPackaged
    ? path.join(process.resourcesPath, 'images')
    : path.join(__dirname, '../../images')
  return path.join(base, name)
}

type Falsy = false | 0 | '' | null | undefined
export const isTruthy = <T>(x: T | Falsy): x is T => !!x
