import { ServerNotification } from '@modelcontextprotocol/sdk/types'
import { ServerRequest } from '@modelcontextprotocol/sdk/types'

import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp'
import { ZodRawShape } from 'zod'
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol'

export const tryCatchCallback = <Args extends ZodRawShape | undefined>(
  handler: ToolCallback<Args>
) => {
  return async (
    args: Args,
    extra?: RequestHandlerExtra<ServerRequest, ServerNotification>
  ) => {
    try {
      console.log('[mcp] calling handler', args, extra)
      return await handler(args, extra)
    } catch (error) {
      console.error('[mcp] error', error)

      const errorMessage =
        error instanceof Error ? error.message : String(error)

      return {
        content: [
          {
            type: 'text' as const,
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      }
    }
  }
}
