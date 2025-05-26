import { nanoid } from 'nanoid'
import { useState, useRef } from 'react'
import { useBackendState } from '../../shared/ipc'
import { Task } from '../../../src/store'

export function useTodoState() {
  const { state } = useBackendState()
  const [newTodo, setNewTodo] = useState('')
  const previousStates = useRef<{ tasks: Task[] }[]>([])

  const tasks = state?.tasks ?? []

  const saveState = async (newState: { tasks: Task[] }) => {
    previousStates.current.push({ tasks })
    // Keep only last 10 states to prevent memory bloat
    if (previousStates.current.length > 10) {
      previousStates.current.shift()
    }
    await window.electronAPI.setPartialState(newState)
  }

  async function undo() {
    const previousState = previousStates.current.pop()
    if (previousState) {
      await window.electronAPI.setPartialState(previousState)
    }
  }

  async function addTodo(text: string) {
    const task: Task = {
      id: nanoid(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
      context: null,
    }

    await saveState({
      tasks: [task, ...tasks],
    })
  }

  async function toggleTodo(id: string) {
    const updatedTodos = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          completedAt: task.completedAt ? null : new Date().toISOString(),
        }
      }
      return task
    })

    await saveState({
      tasks: updatedTodos,
    })
  }

  async function deleteTodo(id: string) {
    const updatedTodos = tasks.filter((task) => task.id !== id)

    await saveState({
      tasks: updatedTodos,
    })
  }

  async function editTodo(id: string, newText: string) {
    const updatedTodos = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          text: newText.trim(),
          updatedAt: new Date().toISOString(),
        }
      }
      return task
    })

    await saveState({
      tasks: updatedTodos,
    })
  }

  async function reorderTodos(startIndex: number, endIndex: number) {
    const updatedTodos = Array.from(tasks)
    const [removed] = updatedTodos.splice(startIndex, 1)
    updatedTodos.splice(endIndex, 0, removed)

    await saveState({
      tasks: updatedTodos,
    })
  }

  return {
    tasks,
    newTodo,
    setNewTodo,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    reorderTodos,
    undo,
  }
}
