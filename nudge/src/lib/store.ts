import Store from 'electron-store'
import { create, StoreApi } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Capture, Mood, State, Todo } from '../types'
import { screenCaptureService } from './ScreenCaptureService'

const DEFAULT_STATE: State = {
  openAiKey: null,
  lastCapture: null,
  nextCaptureAt: null,
  savedCaptures: [],
  goals: `I need help staying focused on work instead of Youtube or other distractions.`,
  goalLastUpdatedAt: null,
  autoLaunch: false,
  captureFrequency: 1,
  isGoalWindowPinned: false,
  isTodoWindowPinned: false,
}

const electronStore = new Store<State>({
  defaults: DEFAULT_STATE,
}) as any

export const store = create<State>()(
  persist((set, get, store: StoreApi<State>) => DEFAULT_STATE, {
    name: 'nudge-store',
    storage: {
      getItem: (name) => {
        const value = electronStore.get(name)
        return value
      },
      setItem: (name, value) => {
        electronStore.set(name, value)
      },
      removeItem: (name) => {
        electronStore.delete(name)
      },
    },
  })
)

// Todo actions
export const addTodo = (text: string): Todo => {
  const todo: Todo = {
    id: crypto.randomUUID(),
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  }

  const currentTodos = store.getState().todos
  store.setState({ todos: [todo, ...currentTodos] })
  return todo
}

export const toggleTodo = (id: string): Todo | undefined => {
  const currentTodos = store.getState().todos
  const updatedTodos = currentTodos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed }
    }
    return todo
  })

  store.setState({ todos: updatedTodos })
  return updatedTodos.find((t) => t.id === id)
}

export const deleteTodo = (id: string): Todo | undefined => {
  const currentTodos = store.getState().todos
  const todoToDelete = currentTodos.find((t) => t.id === id)
  const updatedTodos = currentTodos.filter((todo) => todo.id !== id)

  store.setState({ todos: updatedTodos })
  return todoToDelete
}

export const editTodo = (id: string, text: string): Todo | undefined => {
  const currentTodos = store.getState().todos
  const updatedTodos = currentTodos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, text: text.trim() }
    }
    return todo
  })

  store.setState({ todos: updatedTodos })
  return updatedTodos.find((t) => t.id === id)
}

export const getTodos = (): Todo[] => {
  return store.getState().todos
}

// Export store actions
export const updateLastCapture = (
  summary: string,
  isFollowingGoals: boolean
) => {
  store.setState({
    lastCapture: {
      summary,
      at: new Date().toISOString(),
      isPositive: !isFollowingGoals,
    },
  })
}

// Export selectors

export const clearLastCapture = () => {
  store.setState({ lastCapture: null })
}

export const setOpenAiKey = (key: string | null) => {
  store.setState({ openAiKey: key })
}

//

export const getSavedCaptures = () => store.getState().savedCaptures

export const addSavedCapture = (capture: Capture) => {
  let nextValue = [...store.getState().savedCaptures, capture]
  if (nextValue.length > 10) {
    // Get the last 10
    nextValue = nextValue.slice(nextValue.length - 10)
  }

  store.setState({
    savedCaptures: nextValue,
  })
}

// console.log('state is', store.getState())

// store.setState({
//   goals: 'I want to relax tonight and not work anymore.',
//   nextCaptureAt: null,
// })

export const getOpenAiKey = () => store.getState().openAiKey

export const getState = () => store.getState()

export const getGoals = () => store.getState().goals

export const getLastCaptureAt = () => store.getState().lastCapture?.at

export const getNextCaptureAt = () => store.getState().nextCaptureAt

export const setNextCaptureAt = (at: string | null) => {
  store.setState({ nextCaptureAt: at })
}

export function onOpenAiKeyChange(callback: (key: string | null) => void) {
  return store.subscribe((state) => {
    callback(state.openAiKey)
  })
}

export function onMoodChange(callback: (mood: Mood) => void) {
  return store.subscribe((state) => {
    callback(getMood())
  })
}

export function getMood() {
  const state = store.getState()
  if (screenCaptureService.isCapturing) {
    return 'thinking'
  }
  if (!state.openAiKey) {
    return 'waiting'
  }
  if (!state.lastCapture) {
    return 'thinking'
  }
  return state.lastCapture.isPositive ? 'happy' : 'angry'
}
