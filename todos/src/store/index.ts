import { nanoid } from 'nanoid'
import { create, StoreApi } from 'zustand'
import { persist } from 'zustand/middleware'
import { fileStore } from './backend'
import { DEFAULT_STATE, State, Task } from './types'

export * from './types'

export const store = create<State>()(
  persist((set, get, store: StoreApi<State>) => DEFAULT_STATE, {
    name: 'nudge-store',
    storage: {
      getItem: (name) => {
        const value = fileStore.get(name)
        return value
      },
      setItem: (name, value) => {
        fileStore.set(name, value)
      },
      removeItem: (name) => {
        fileStore.delete(name)
      },
    },
  })
)

// Todo actions
export const addTodo = (text: string): Task => {
  const todo: Task = {
    id: nanoid(),
    text: text.trim(),
    context: null,
    completedAt: null,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }

  const currentTodos = store.getState().tasks
  store.setState({ tasks: [todo, ...currentTodos] })
  return todo
}

export const toggleTodo = (id: string): Task | undefined => {
  const currentTodos = store.getState().tasks
  const updatedTodos = currentTodos.map((todo) => {
    if (todo.id === id) {
      const completedAt = todo.completedAt ? null : new Date().toISOString()
      return { ...todo, completedAt }
    }
    return todo
  })

  store.setState({ tasks: updatedTodos })
  return updatedTodos.find((t) => t.id === id)
}

export const deleteTodo = (id: string): Task | undefined => {
  const currentTodos = store.getState().tasks
  const todoToDelete = currentTodos.find((t) => t.id === id)
  const updatedTodos = currentTodos.filter((todo) => todo.id !== id)

  store.setState({ tasks: updatedTodos })
  return todoToDelete
}

export const editTodo = (id: string, text: string): Task | undefined => {
  const currentTodos = store.getState().tasks
  const updatedTodos = currentTodos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, text: text.trim(), updatedAt: new Date().toISOString() }
    }
    return todo
  })

  store.setState({ tasks: updatedTodos })
  return updatedTodos.find((t) => t.id === id)
}

export const getTodos = (): Task[] => {
  return store.getState().tasks
}

export const getState = () => store.getState()
