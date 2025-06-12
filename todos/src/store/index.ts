import { nanoid } from 'nanoid'
import { create, StoreApi } from 'zustand'
import { persist } from 'zustand/middleware'
import { fileStore } from './backend'
import { DEFAULT_STATE, Project, State, Task } from './types'

export * from './types'

export const store = create<State>()(
  persist((set, get, store: StoreApi<State>) => DEFAULT_STATE, {
    name: 'store',
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

// Helper functions for ranks
const getNextRank = (tasks: Task[]): number => {
  if (tasks.length === 0) {
    return 1000
  }
  const maxRank = Math.max(...tasks.map((t) => t.anytimeRank))
  return maxRank + 1000
}

// Todo actions
export const addTodo = (
  args: Pick<Task, 'projectId' | 'when'> & { text: string }
): Task => {
  const currentTodos = store.getState().tasks
  const todo: Task = {
    id: nanoid(),
    text: args.text.trim(),
    context: null,
    completedAt: null,
    when: args.when,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    deletedAt: null,
    projectId: args.projectId || null,
    cancelledAt: null,
    loggedAt: null,
    anytimeRank: getNextRank(currentTodos),
    todayRank: null,
  }

  store.setState({ tasks: [todo, ...currentTodos] })
  return todo
}

export const toggleTodo = (
  id: string,
  completed: boolean
): Task | undefined => {
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
  const updatedTodos = currentTodos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, deletedAt: new Date().toISOString() }
    }
    return todo
  })

  store.setState({ tasks: updatedTodos })
  return todoToDelete
}

export const editTodo = (
  id: string,
  text: string,
  projectId?: string
): Task | undefined => {
  const currentTodos = store.getState().tasks
  const updatedTodos = currentTodos.map((todo) => {
    if (todo.id === id) {
      return {
        ...todo,
        text: text.trim(),
        updatedAt: new Date().toISOString(),
        projectId: projectId || null,
      }
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

// Project actions
export const addProject = (title: string, description: string): Project => {
  const project: Project = {
    id: nanoid(),
    title: title.trim(),
    description: description.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const currentProjects = store.getState().projects
  store.setState({ projects: [project, ...currentProjects] })
  return project
}

export const editProject = (
  id: string,
  title: string,
  description: string
): Project | undefined => {
  const currentProjects = store.getState().projects
  const updatedProjects = currentProjects.map((project) => {
    if (project.id === id) {
      return {
        ...project,
        title: title.trim(),
        description: description.trim(),
        updatedAt: new Date().toISOString(),
      }
    }
    return project
  })

  store.setState({ projects: updatedProjects })
  return updatedProjects.find((p) => p.id === id)
}

export const deleteProject = (id: string): Project | undefined => {
  const currentProjects = store.getState().projects
  const projectToDelete = currentProjects.find((p) => p.id === id)
  const updatedProjects = currentProjects.filter((project) => project.id !== id)

  // Remove project association from tasks
  const currentTasks = store.getState().tasks
  const updatedTasks = currentTasks.map((task) => {
    if (task.projectId === id) {
      return { ...task, projectId: null }
    }
    return task
  })

  store.setState({
    projects: updatedProjects,
    tasks: updatedTasks,
  })
  return projectToDelete
}

export const getProjects = (): Project[] => {
  return store.getState().projects
}

export const assignTaskToProject = (
  taskId: string,
  projectId: string | null
): Task | undefined => {
  const currentTasks = store.getState().tasks
  const updatedTasks = currentTasks.map((task) => {
    if (task.id === taskId) {
      return {
        ...task,
        projectId,
        updatedAt: new Date().toISOString(),
      }
    }
    return task
  })

  store.setState({ tasks: updatedTasks })
  return updatedTasks.find((t) => t.id === taskId)
}

export const reorderTasks = (
  startIndex: number,
  endIndex: number,
  isToday: boolean = false
) => {
  const currentTodos = store.getState().tasks
  const sortedTodos = [...currentTodos].sort((a, b) => {
    if (isToday) {
      if (a.todayRank === null && b.todayRank === null) return 0
      if (a.todayRank === null) return 1
      if (b.todayRank === null) return -1
      return a.todayRank - b.todayRank
    }
    return a.anytimeRank - b.anytimeRank
  })

  const [movedTodo] = sortedTodos.splice(startIndex, 1)
  sortedTodos.splice(endIndex, 0, movedTodo)

  // Recalculate ranks
  const updatedTodos = sortedTodos.map((todo, index) => {
    const newRank = (index + 1) * 1000
    if (isToday) {
      return {
        ...todo,
        todayRank: todo.todayRank !== null ? newRank : null,
      }
    }
    return {
      ...todo,
      anytimeRank: newRank,
    }
  })

  store.setState({ tasks: updatedTodos })
}
