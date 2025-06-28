// eslint-disable-next-line import/no-unresolved
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import express, { Request, Response } from 'express'
import { getServer } from './server'

// async function main() {
// 	const transport = new StdioServerTransport();
// 	await server.connect(transport);
// 	console.error('Weather MCP Server running on stdio');
// }

// main().catch((error) => {
// 	console.error('Fatal error in main():', error);
// 	process.exit(1);
// });

export function createMcpApp() {
  const app = express()
  app.use(express.json())

  app.post('/mcp', async (req: Request, res: Response) => {
    // In stateless mode, create a new instance of transport and server for each request
    // to ensure complete isolation. A single instance would cause request ID collisions
    // when multiple clients connect concurrently.

    try {
      const server = getServer()
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      })

      res.on('close', () => {
        console.log('Request closed')
        transport.close()
        server.close()
      })
      await server.connect(transport)
      await transport.handleRequest(req, res, req.body)
    } catch (error) {
      console.error('Error handling MCP request:', error)
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: 'Internal server error',
          },
          id: null,
        })
      }
    }
  })

  app.get('/mcp', async (req: Request, res: Response) => {
    console.log('Received GET MCP request')
    res.writeHead(405).end(
      JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Method not allowed.',
        },
        id: null,
      })
    )
  })

  app.delete('/mcp', async (req: Request, res: Response) => {
    console.log('Received DELETE MCP request')
    res.writeHead(405).end(
      JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Method not allowed.',
        },
        id: null,
      })
    )
  })

  return app
}
