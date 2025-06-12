import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import { z } from 'zod'
import {
  addProject,
  addTodo,
  deleteTodo,
  editProject,
  editTodo,
  getProjects,
  getTodos,
  Project,
  Task,
  toggleTodo,
} from '../store'
import { tryCatchCallback } from './utils'

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
      projectId: z
        .string()
        .describe('The ID of the project to add the todo to')
        .optional(),
      when: z
        .enum(['today', 'tonight', 'anytime', 'someday'])
        .describe('The when the todo is due')
        .optional(),
    },
    tryCatchCallback(
      async ({
        text,
        projectId,
        when,
      }: {
        text: string
        projectId?: string
        when?: string
      }) => {
        const todo = addTodo({
          text,
          projectId,
          when:
            when === 'anytime'
              ? null
              : ((when || null) as 'today' | 'tonight' | 'someday' | null),
        })

        return {
          content: [
            {
              type: 'text',
              text: `Added: ${todo.text} (${todo.id})\n${JSON.stringify(todo)}`,
            },
          ],
        }
      }
    )
  )

  server.tool(
    'pi-toggle-completed',
    'Toggle the completion status of a todo',
    {
      id: z.string().describe('The ID of the todo to toggle'),
      completed: z.boolean().describe('The new completion status'),
    },
    tryCatchCallback(
      async ({ id, completed }: { id: string; completed: boolean }) => {
        const todo = toggleTodo(id, completed)

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
  )

  server.tool(
    'pi-delete-todo',
    'Delete a todo item',
    {
      id: z.string().describe('The ID of the todo to delete'),
    },
    tryCatchCallback(async ({ id }: { id: string }) => {
      const todo = deleteTodo(id)

      return {
        content: [
          {
            type: 'text',
            text: `Deleted: ${todo?.text} (${todo?.id})`,
          },
        ],
      }
    })
  )

  server.tool(
    'pi-edit-todo',
    'Edit the text of a todo item',
    {
      id: z.string(),
      text: z.string().describe('The new text for the todo'),
      projectId: z
        .string()
        .describe('The ID of the project to add the todo to')
        .optional(),
    },
    tryCatchCallback(
      async ({
        id,
        text,
        projectId,
      }: {
        id: string
        text: string
        projectId?: string
      }) => {
        const todo = editTodo(id, text, projectId)

        return {
          content: [
            {
              type: 'text',
              text: `Updated: ${todo?.text} (${todo?.id})`,
            },
          ],
        }
      }
    )
  )

  server.tool(
    'pi-list-todos',
    'List all todos',
    {
      showCompleted: z
        .boolean()
        .optional()
        .describe('If true, also show completed todos'),
    },
    tryCatchCallback(async ({ showCompleted }: { showCompleted?: boolean }) => {
      let todos = getTodos()

      if (!showCompleted) {
        todos = todos.filter((todo) => !todo.completedAt)
      }

      if (todos.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: '[]',
            },
          ],
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: jsonToXml(
              todos.map((todo) => ({
                todo: formatTask(todo),
              })),
              'list'
            ),
          },
        ],
      }
    })
  )

  // PROJECTS
  //
  //
  //
  //
  //

  server.tool(
    'pi-list-projects',
    'List all projects',
    {},
    tryCatchCallback(async () => {
      const projects = getProjects()

      if (projects.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: '[]',
            },
          ],
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: jsonToXml(
              projects.map((project) => ({
                project: formatProject(project),
              })),
              'list'
            ),
          },
        ],
      }
    })
  )

  server.tool(
    'pi-edit-project',
    'Edit the title or description of a project',
    {
      id: z.string().describe('The ID of the project to edit'),
      title: z.string().describe('The new title for the project'),
      description: z
        .string()
        .optional()
        .describe('The new description for the project'),
    },
    tryCatchCallback(
      async ({
        id,
        title,
        description,
      }: {
        id: string
        title: string
        description?: string
      }) => {
        // Fetch the existing project to get the current description if a new one isn't provided
        const projects = getProjects()
        const existingProject = projects.find((p) => p.id === id)

        if (!existingProject) {
          return {
            content: [
              {
                type: 'text',
                text: `Project with ID "${id}" not found.`,
              },
            ],
          }
        }

        const newDescription =
          description === undefined
            ? existingProject.description
            : description === ''
            ? null
            : description

        const project = editProject(id, title, newDescription)

        if (!project) {
          return {
            content: [
              {
                type: 'text',
                text: `Project not found: ${id}.`,
              },
            ],
          }
        }

        return {
          content: [
            {
              type: 'text',
              text: `Updated: ${project.title} (${project.id})`,
            },
          ],
        }
      }
    )
  )

  server.tool(
    'pi-create-project',
    'Create a new project',
    {
      title: z.string().describe('The title for the new project'),
      description: z
        .string()
        .optional()
        .describe('The description for the new project'),
    },
    tryCatchCallback(
      async ({
        title,
        description,
      }: {
        title: string
        description?: string
      }) => {
        const project = addProject(title, description || '') // Pass empty string if description is undefined

        return {
          content: [
            {
              type: 'text',
              text: `Created: ${project.title} (${project.id})`,
            },
          ],
        }
      }
    )
  )

  return server
}

function formatTask(task: Task) {
  return {
    id: task.id,
    content: task.text,
    status: task.deletedAt ? 'deleted' : task.completedAt ? 'done' : 'pending',
    createdAt: task.createdAt,
  }
}

function formatProject(project: Project) {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
  }
}

// Helper function to convert JSON to XML
function jsonToXml(json: any, rootElementName: string = 'root'): string {
  let xml = ''
  if (Array.isArray(json)) {
    json.forEach((item) => {
      xml += jsonToXml(item, rootElementName)
    })
    return xml
  }

  xml += `<${rootElementName}>`

  if (typeof json === 'object' && json !== null) {
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        if (typeof json[key] === 'object' && json[key] !== null) {
          xml += jsonToXml(json[key], key)
        } else {
          xml += `<${key}>${json[key]}</${key}>`
        }
      }
    }
  } else {
    xml += json
  }

  xml += `</${rootElementName}>`
  return xml
}
