import {
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router'
import { Main } from './App/Main'
import App from './App'

// Define route params and search params types
export interface ProjectParams {
  projectId: string
}

// Create routes
const rootRoute = createRootRoute({
  component: App,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Main page="anytime" />,
})

const todayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/today',
  component: () => <Main page="today" />,
})

const anytimeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/anytime',
  component: () => <Main page="anytime" />,
})

const somedayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/someday',
  component: () => <Main page="someday" />,
})

const completedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/completed',
  component: () => <Main page="completed" />,
})

const trashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trash',
  component: () => <Main page="trash" />,
})

const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/project/$projectId',
  component: ({ params }) => (
    <Main page="project" projectId={params.projectId} />
  ),
})

// Create and export the router
const routeTree = rootRoute.addChildren([
  indexRoute,
  todayRoute,
  anytimeRoute,
  somedayRoute,
  completedRoute,
  trashRoute,
  projectRoute,
])

export const router = createRouter({ routeTree })

// Type the router for better TypeScript support
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
