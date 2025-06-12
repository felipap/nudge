import { useEffect, useState } from 'react'
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

export function closeWindow() {
  window.electronAPI.closeWindow()
}

export function setWindowHeight(height: number) {
  window.electronAPI.setWindowHeight(height)
}

export function minimizeWindow() {
  window.electronAPI.minimizeWindow()
}

export function zoomWindow() {
  window.electronAPI.zoomWindow()
}

export function useBackendState() {
  const [state, setState] = useState<State | null>(null)

  useEffect(() => {
    async function load() {
      const state = await window.electronAPI.getState()
      setState(state)
    }
    load()

    // Subscribe to state changes
    const unsubscribe = window.electronAPI.onStateChange((newState) => {
      setState(newState)
    })

    // Cleanup subscription on unmount
    return () => {
      unsubscribe()
    }
  }, [])

  return {
    state,
  }
}
