import { useState } from 'react'
import { useBackendState } from '../../shared/ipc'

export function useTodoState() {
  const { state } = useBackendState()
  const [newTodo, setNewTodo] = useState('')

  const todos = state?.todos ?? []

  async function addTodo(text: string) {
    const todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    }

    await window.electronAPI.setPartialState({
      todos: [todo, ...todos],
    })
  }

  async function toggleTodo(id: string) {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed }
      }
      return todo
    })

    await window.electronAPI.setPartialState({
      todos: updatedTodos,
    })
  }

  async function deleteTodo(id: string) {
    const updatedTodos = todos.filter((todo) => todo.id !== id)

    await window.electronAPI.setPartialState({
      todos: updatedTodos,
    })
  }

  async function editTodo(id: string, newText: string) {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, text: newText.trim() }
      }
      return todo
    })

    await window.electronAPI.setPartialState({
      todos: updatedTodos,
    })
  }

  async function reorderTodos(startIndex: number, endIndex: number) {
    const updatedTodos = Array.from(todos)
    const [removed] = updatedTodos.splice(startIndex, 1)
    updatedTodos.splice(endIndex, 0, removed)

    await window.electronAPI.setPartialState({
      todos: updatedTodos,
    })
  }

  return {
    todos,
    newTodo,
    setNewTodo,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    reorderTodos,
  }
}
