import { nanoid } from 'nanoid'
import { useRef, useState } from 'react'
import { Task } from '../../../src/store'
import { useBackendState } from '../../shared/ipc'

// Helper functions for ranks
const getNextRank = (tasks: Task[]): number => {
  if (tasks.length === 0) {
    return 1000
  }
  const maxRank = Math.max(...tasks.map((t) => t.rank ?? 0))
  return maxRank + 1000
}

const getNextTodayRank = (tasks: Task[]): number => {
  const todayTasks = tasks.filter((t) => t.todayRank !== null)
  if (todayTasks.length === 0) {
    return 1000
  }
  const maxRank = Math.max(...todayTasks.map((t) => t.todayRank!))
  return maxRank + 1000
}

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

  async function addTodo(task: Partial<Task>) {
    await saveState({
      tasks: [
        {
          id: nanoid(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          text: '',
          deletedAt: null,
          completedAt: null,
          context: null,
          projectId: null,
          rank: getNextRank(tasks),
          when: 'today',
          todayRank: 0,
          ...task,
        },
        ...tasks,
      ],
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
    const updatedTodos = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, deletedAt: new Date().toISOString() }
      }
      return task
    })

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

  async function reorderTodos(
    visibleTaskIds: string[],
    startIndex: number,
    endIndex: number,
    isToday: boolean = false
  ) {
    // Get the tasks in their current visible order
    const visibleTasks = visibleTaskIds.map(
      (id) => tasks.find((t) => t.id === id)!
    )

    // Perform the reorder on the visible tasks
    const [movedTask] = visibleTasks.splice(startIndex, 1)
    visibleTasks.splice(endIndex, 0, movedTask)

    // Calculate new ranks for visible tasks
    const newRanks = new Map<string, number>()
    visibleTasks.forEach((task, index) => {
      newRanks.set(task.id, (index + 1) * 1000)
    })

    // Update all tasks, preserving ranks for non-visible tasks
    const updatedTodos = tasks.map((task) => {
      const newRank = newRanks.get(task.id)
      if (newRank === undefined) return task

      if (isToday) {
        return {
          ...task,
          todayRank: task.todayRank !== null ? newRank : null,
        }
      } else {
        return {
          ...task,
          rank: newRank,
        }
      }
    })

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
