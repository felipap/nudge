import { nanoid } from 'nanoid'
import { useEffect, useRef, useState } from 'react'
import { Task } from '../../../src/store'
import { useBackendState } from '../../shared/ipc'

// Helper functions for ranks
const getNextRank = (tasks: Task[]): number => {
  if (tasks.length === 0) {
    return 1000
  }
  const maxRank = Math.max(...tasks.map((t) => t.anytimeRank ?? 0))
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

  const [taskCounter, setTaskCounter] = useState(0)

  const tasksRef = useRef<Task[]>([])
  useEffect(() => {
    setTaskCounter((c) => c + 1)
    tasksRef.current = state?.tasks ?? []
  }, [state?.tasks])

  const saveState = async (newState: { tasks: Task[] }) => {
    previousStates.current.push({ tasks: tasksRef.current })
    // Keep only last 2 states to prevent memory bloat
    if (previousStates.current.length > 2) {
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
          cancelledAt: null,
          loggedAt: null,
          context: null,
          projectId: null,
          anytimeRank: getNextRank(tasksRef.current),
          when: null,
          todayRank: 0,
          ...task,
        },
        ...tasksRef.current,
      ],
    })
  }

  async function toggleTodoCompletion(id: string, value: boolean) {
    const updatedTodos = tasksRef.current.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          loggedAt: task.loggedAt && !value ? null : task.loggedAt,
          completedAt: value
            ? task.completedAt || new Date().toISOString()
            : null,
        }
      }
      return task
    })

    await saveState({
      tasks: updatedTodos,
    })
  }

  async function deleteTodo(id: string, restore: boolean = false) {
    const updatedTodos = tasksRef.current.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          deletedAt: restore ? null : new Date().toISOString(),
        }
      }
      return task
    })

    await saveState({
      tasks: updatedTodos,
    })
  }

  async function editTodo(id: string, data: Partial<Task>) {
    const updatedTodos = tasksRef.current.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          ...data,
          updatedAt: new Date().toISOString(),
        }
      }
      return task
    })

    await saveState({
      tasks: updatedTodos,
    })
  }

  async function clearTrash() {
    const updatedTodos = tasksRef.current.filter((task) => !task.deletedAt)

    await saveState({
      tasks: updatedTodos,
    })
  }

  async function logAllCompleted() {
    const updatedTodos = tasksRef.current.map((task) => {
      if ((task.completedAt || task.cancelledAt) && !task.loggedAt) {
        return { ...task, loggedAt: new Date().toISOString() }
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
      (id) => tasksRef.current.find((t) => t.id === id)!
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
    const updatedTodos = tasksRef.current.map((task) => {
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
          anytimeRank: newRank,
        }
      }
    })

    await saveState({
      tasks: updatedTodos,
    })
  }

  return {
    tasks: tasksRef.current,
    newTodo,
    setNewTodo,
    addTodo,
    toggleTodoCompletion,
    deleteTodo,
    tasksRef,
    editTodo,
    logAllCompleted,
    reorderTodos,
    undo,
    clearTrash,
  }
}
