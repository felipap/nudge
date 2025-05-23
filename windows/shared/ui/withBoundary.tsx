export function withBoundary(Comp: any) {
  return Comp
}

// import { ComponentType } from 'react'
// import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'

// interface ErrorFallbackProps {
//   error: Error
//   resetErrorBoundary: () => void
// }

// function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
//   return (
//     <div role="alert" className="flex flex-col gap-2 p-3">
//       <p className="card-title">Something went wrong</p>
//       <p className="body">{error.message}</p>
//       <div>
//         <button
//           className="border rounded-md bg-two px-2 py-1"
//           onClick={resetErrorBoundary}
//         >
//           Try again
//         </button>
//       </div>
//     </div>
//   )
// }

// export function withBoundary<T>(
//   Comp: ComponentType<T>,
//   fallback = ErrorFallback
// ): ComponentType<T> {
//   const result = (props: any) => (
//     <ReactErrorBoundary
//       FallbackComponent={fallback}
//       onReset={() => {
//         // reset the state of your app so the error doesn't happen again
//       }}
//     >
//       <Comp {...props} />
//     </ReactErrorBoundary>
//   )
//   result.displayName = `withBoundary-${Comp.displayName}`
//   return result
// }
