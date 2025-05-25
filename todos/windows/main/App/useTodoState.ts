import { useEffect, useState } from 'react'
import { type Todo } from '../../../src/types'

export function useTodoState() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    async function load() {
      const state = await window.electronAPI.getState()
      setTodos(state.todos)
    }
    load()
  }, [])

  const addTodo = (text: string) => {
    const todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    }

    window.electronAPI.setPartialState({
      todos: [todo, ...todos],
    })

    setTodos([todo, ...todos])
  }

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed }
      }
      return todo
    })

    window.electronAPI.setPartialState({
      todos: updatedTodos,
    })

    setTodos(updatedTodos)
  }

  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id)

    window.electronAPI.setPartialState({
      todos: updatedTodos,
    })

    setTodos(updatedTodos)
  }

  const editTodo = (id: string, newText: string) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, text: newText.trim() }
      }
      return todo
    })

    window.electronAPI.setPartialState({
      todos: updatedTodos,
    })

    setTodos(updatedTodos)
  }

  const reorderTodos = (startIndex: number, endIndex: number) => {
    const updatedTodos = Array.from(todos)
    const [removed] = updatedTodos.splice(startIndex, 1)
    updatedTodos.splice(endIndex, 0, removed)

    window.electronAPI.setPartialState({
      todos: updatedTodos,
    })

    setTodos(updatedTodos)
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
