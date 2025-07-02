export {}

// import {
//   ServerNotification,
//   ServerRequest,
//   // eslint-disable-next-line import/no-unresolved
// } from '@modelcontextprotocol/sdk/types'
// // eslint-disable-next-line import/no-unresolved
// import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp'
// // eslint-disable-next-line import/no-unresolved
// import { ZodRawShape } from 'zod'
// // eslint-disable-next-line import/no-unresolved
// import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol'

// export const tryCatchCallback = <Args extends ZodRawShape | undefined>(
//   handler: ToolCallback<Args>
// ) => {
//   return async (
//     args: Args,
//     extra?: RequestHandlerExtra<ServerRequest, ServerNotification>
//   ) => {
//     try {
//       console.log('[mcp] calling handler', args, extra)
//       // TODO figure out this. i'm tired.
//       // @ts-ignore
//       return await handler(args, extra)
//     } catch (error) {
//       console.error('[mcp] error', error)

//       const errorMessage =
//         error instanceof Error ? error.message : String(error)

//       return {
//         content: [
//           {
//             type: 'text' as const,
//             text: `Error: ${errorMessage}`,
//           },
//         ],
//         isError: true,
//       }
//     }
//   }
// }
