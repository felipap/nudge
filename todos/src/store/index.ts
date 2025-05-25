import { create, StoreApi } from 'zustand'
import { persist } from 'zustand/middleware'
import { fileStore } from './backend'
import { DEFAULT_STATE, State, Todo } from './types'
import { nanoid } from 'nanoid'

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
export const addTodo = (text: string): Todo => {
  const todo: Todo = {
    id: nanoid(),
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

export const getState = () => store.getState()
