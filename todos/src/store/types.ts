export const DEFAULT_STATE: State = {
  autoLaunch: false,
  tasks: [],
  isTodoWindowPinned: false,
}

export interface Task {
  id: string
  text: string
  createdAt: string
  updatedAt: string
  completedAt: string | null
  context: string | null
}

export interface State {
  autoLaunch: boolean
  tasks: Task[]
  isTodoWindowPinned: boolean
}
