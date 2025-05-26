import {
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router'
import App from './pages/index'

// Import pages
import AnytimePage from './pages/anytime/screen'
import TodayPage from './pages/today/screen'
import TrashPage from './pages/trash/screen'
import ProjectPage from './pages/project/[projectId]/screen'
import CompletedPage from './pages/completed/screen'
import SomedayPage from './pages/someday/screen'

// Create routes
const rootRoute = createRootRoute({
  component: App,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AnytimePage,
})

const todayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/today',
  component: TodayPage,
})

const trashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trash',
  component: TrashPage,
})

const completedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/completed',
  component: CompletedPage,
})

const anytimeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/anytime',
  component: AnytimePage,
})

const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/project/$projectId',
  component: ProjectPage,
})

const somedayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/someday',
  component: SomedayPage,
})

// Create and export the router
const routeTree = rootRoute.addChildren([
  indexRoute,
  todayRoute,
  anytimeRoute,
  trashRoute,
  projectRoute,
  completedRoute,
  somedayRoute,
])

export const router = createRouter({ routeTree })

// Type the router for better TypeScript support
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
