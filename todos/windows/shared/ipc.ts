import { useEffect, useState } from 'react'
import { Project, State } from '../../src/store'

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

export function useProjects() {
  const { state } = useBackendState()
  async function editProject(id: string, data: Partial<Project>) {
    await setPartialState({
      projects: state?.projects?.map((p) =>
        p.id === id ? { ...p, ...data } : p
      ),
    })
  }

  return { projects: state?.projects ?? [], editProject }
}

export function useTasks() {
  const { state } = useBackendState()
  return { tasks: state?.tasks ?? [] }
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
