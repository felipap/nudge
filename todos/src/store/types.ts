export interface Project {
  id: string
  title: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export const DEFAULT_STATE: State = {
  autoLaunch: false,
  tasks: [],
  projects: [],
  isWidgetPinned: false,
}

export interface Task {
  id: string
  text: string
  createdAt: string
  updatedAt: string
  completedAt: string | null
  highLeverage?: boolean
  cancelledAt: string | null
  context: string | null
  deletedAt: string | null
  when: 'today' | 'tonight' | 'someday' | null
  projectId: string | null
  // Time when the item was sent to logbook.
  loggedAt: string | null
  anytimeRank: number
  todayRank: number | null
  aiMetadata?: string
}

export interface State {
  autoLaunch: boolean
  tasks: Task[]
  projects: Project[]
  isWidgetPinned: boolean
}
