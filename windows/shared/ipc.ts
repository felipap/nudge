import { State } from '../../src/types'

export async function getState() {
  return await window.electronAPI.getState()
}

export async function setPartialState(state: Partial<State>) {
  return await window.electronAPI.setPartialState(state)
}

export async function setAutoLaunch(enable: boolean) {
  return await window.electronAPI.setAutoLaunch(enable)
}

export function close() {
  window.electronAPI.close()
}

export function minimize() {
  window.electronAPI.minimize()
}

export function zoom() {
  window.electronAPI.zoom()
}
