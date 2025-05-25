export const DEFAULT_STATE: State = {
  autoLaunch: false,
  todos: [],
  isTodoWindowPinned: false,
}

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

export interface State {
  autoLaunch: boolean
  todos: Todo[]
  isTodoWindowPinned: boolean
}
