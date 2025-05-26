import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import App from './pages/index'

// Import pages
import AnytimePage from './pages/anytime/screen'
import LogbookPage from './pages/logbook/screen'
import ProjectPage from './pages/project/[projectId]/screen'
import SomedayPage from './pages/someday/screen'
import TodayPage from './pages/today/screen'
import TrashPage from './pages/trash/screen'

// Create routes
const rootRoute = createRootRoute({
  component: App,
  beforeLoad: ({ location }) => {
    if (location.pathname === '/') {
      throw router.navigate({ to: '/anytime' })
    }
  },
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

const logbookRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/logbook',
  component: LogbookPage,
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
  todayRoute,
  anytimeRoute,
  trashRoute,
  projectRoute,
  logbookRoute,
  somedayRoute,
])

export const router = createRouter({ routeTree })

// Type the router for better TypeScript support
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
