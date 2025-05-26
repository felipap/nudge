import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import { z } from 'zod'
import { addTodo, deleteTodo, editTodo, getTodos, toggleTodo } from '../store'

// Add timezone plugin
dayjs.extend(timezone)

// Create server instance
export function getServer() {
  const server = new McpServer({
    name: 'todo',
    version: '1.0.0',
    capabilities: {
      resources: {},
      tools: {},
    },
  })

  server.tool(
    'pi-add-todo',
    'Add a new todo item to the list',
    {
      text: z.string().describe('The text content of the todo'),
    },
    async ({ text }: { text: string }) => {
      const todo = addTodo(text)

      return {
        content: [
          {
            type: 'text',
            text: `Added todo: ${todo.text}`,
          },
        ],
      }
    }
  )

  server.tool(
    'pi-toggle-todo',
    'Toggle the completion status of a todo',
    {
      id: z.string().describe('The ID of the todo to toggle'),
    },
    async ({ id }: { id: string }) => {
      const todo = toggleTodo(id)

      return {
        content: [
          {
            type: 'text',
            text: `Toggled todo "${todo?.text}" to ${
              todo?.completedAt ? 'completed' : 'incomplete'
            }`,
          },
        ],
      }
    }
  )

  server.tool(
    'pi-delete-todo',
    'Delete a todo item',
    {
      id: z.string().describe('The ID of the todo to delete'),
    },
    async ({ id }: { id: string }) => {
      const todo = deleteTodo(id)

      return {
        content: [
          {
            type: 'text',
            text: `Deleted todo: ${todo?.text}`,
          },
        ],
      }
    }
  )

  server.tool(
    'pi-edit-todo',
    'Edit the text of a todo item',
    {
      id: z.string().describe('The ID of the todo to edit'),
      text: z.string().describe('The new text for the todo'),
    },
    async ({ id, text }: { id: string; text: string }) => {
      const todo = editTodo(id, text)

      return {
        content: [
          {
            type: 'text',
            text: `Updated todo to: ${todo?.text}`,
          },
        ],
      }
    }
  )

  server.tool(
    'pi-list-todos',
    'List all todos',
    {
      showIncomplete: z
        .boolean()
        .optional()
        .describe('If true, only show incomplete todos'),
    },
    async ({ showIncomplete }: { showIncomplete?: boolean }) => {
      let todos = getTodos()

      if (!showIncomplete) {
        todos = todos.filter((todo) => !todo.completedAt)
      }

      if (todos.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No todos found',
            },
          ],
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: `
<list>${todos
              .map(
                (todo) => `
<todo>
<id>${todo.id}</id>
<status>${
                  todo.deletedAt
                    ? 'deleted'
                    : todo.completedAt
                    ? 'done'
                    : 'pending'
                }</status>
<description>${todo.text}</description>
<createdAt>${todo.createdAt}</createdAt>
</todo>`
              )
              .join('\n')}
</list>`.trim(),
          },
        ],
      }
    }
  )

  return server
}
