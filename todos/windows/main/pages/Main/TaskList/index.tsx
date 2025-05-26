import { useState } from 'react'
import { Task } from '../../../../../src/store/types'
import { useTodoState } from '../../../../shared/lib/useTodoState'
import { DraggableList } from '../../../../shared/ui/DraggableList'
import { withBoundary } from '../../../../shared/ui/withBoundary'
import { FocusableTodoList } from './FocusableTodoList'
import { TaskItem } from './TaskItem'

interface Props {
  tasks: Task[]
  isToday?: boolean
  onAddTodo: () => void
  showStarIfToday?: boolean
}

export const TaskList = withBoundary(
  ({ tasks, isToday = false, onAddTodo, showStarIfToday = false }: Props) => {
    const {
      addTodo,
      toggleTodo: toggleTodoBackend,
      deleteTodo,
      editTodo,
      reorderTodos,
      undo,
    } = useTodoState()

    const [recentToggledTodos, setRecentToggledTodos] = useState<string[]>([])

    // Sort tasks by rank
    const sortedTasks = [...tasks].sort((a, b) => {
      if (isToday) {
        return a.todayRank - b.todayRank
      }
      return (a.rank ?? 0) - (b.rank ?? 0)
    })

    const filteredTasks = sortedTasks.filter(
      (task) => !task.completedAt || recentToggledTodos.includes(task.id)
    )

    async function toggleTodo(id: string) {
      await toggleTodoBackend(id)
      setRecentToggledTodos([id, ...recentToggledTodos])
    }

    const handleReorder = (startIndex: number, endIndex: number) => {
      console.log('TaskList handleReorder:', {
        startIndex,
        endIndex,
        isToday,
        tasks: filteredTasks.map((t, i) => ({
          index: i,
          id: t.id,
          text: t.text,
          rank: t.rank,
          todayRank: t.todayRank,
        })),
      })
      reorderTodos(
        filteredTasks.map((t) => t.id),
        startIndex,
        endIndex,
        isToday
      )
    }

    return (
      <FocusableTodoList
        onAddTodo={onAddTodo}
        todoIds={filteredTasks.map((task) => task.id)}
        onDelete={deleteTodo}
        onUndo={undo}
      >
        {({ onOpenTodo, onFocus, onCloseTodo, focusedTodoId, openTodoId }) => (
          <DraggableList
            items={filteredTasks}
            getItemId={(task) => task.id}
            onReorder={handleReorder}
            renderItem={({ item: task, dragHandleProps }) => (
              <TaskItem
                task={task}
                onToggle={toggleTodo}
                onFocus={() => onFocus(task.id)}
                onDelete={deleteTodo}
                onEdit={(id, newText) => {
                  editTodo(id, newText)
                  onCloseTodo()
                }}
                dragHandleProps={dragHandleProps}
                isFocused={task.id === focusedTodoId}
                isOpen={task.id === openTodoId}
                onOpen={() => onOpenTodo(task.id)}
                onClose={onCloseTodo}
                showStarIfToday={showStarIfToday}
              />
            )}
          />
        )}
      </FocusableTodoList>
    )
  }
)
