import { Task } from '../../../../../src/store/types'
import { useTodoState } from '../../../../shared/lib/useTodoState'
import { DraggableList } from '../../../../shared/ui/DraggableList'
import { withBoundary } from '../../../../shared/ui/withBoundary'
import { FocusableTodoList } from './FocusableTodoList'
import { TaskItem } from './TaskItem'

interface Props {
  tasks: Task[]
  isToday?: boolean
  onAddTodo?: () => void
  showStarIfToday?: boolean
  restoreOnDelete?: boolean
  visibleItemDate?: boolean
}

export const TaskList = withBoundary(
  ({
    tasks,
    isToday = false,
    onAddTodo,
    showStarIfToday = false,
    restoreOnDelete = false,
    visibleItemDate = false,
  }: Props) => {
    const { toggleTodoCompletion, deleteTodo, reorderTodos, undo } =
      useTodoState()

    // Sort tasks by anytimeRank
    const sortedTasks = [...tasks].sort((a, b) => {
      if (isToday) {
        return (a.todayRank || 0) - (b.todayRank || 0)
      }
      return (a.anytimeRank ?? 0) - (b.anytimeRank ?? 0)
    })

    const filteredTasks = sortedTasks.filter(
      (task) => task // !task.completedAt || recentToggledTodos.includes(task.id)
    )

    async function toggleTodo(id: string) {
      const task = tasks.find((t) => t.id === id)
      if (!task) {
        return
      }
      await toggleTodoCompletion(id, !task.completedAt)
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
          anytimeRank: t.anytimeRank,
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
        restoreOnDelete={restoreOnDelete}
      >
        {({ onOpenTodo, onFocus, onCloseTodo, focusedTodoIds, openTodoId }) => (
          <DraggableList
            items={filteredTasks}
            getItemId={(task) => task.id}
            onReorder={handleReorder}
            renderItem={({ item: task, dragHandleProps }) => (
              <TaskItem
                task={task}
                onToggle={toggleTodo}
                onFocus={() => onFocus(task.id)}
                dragHandleProps={dragHandleProps}
                isFocused={focusedTodoIds.includes(task.id)}
                isOpen={task.id === openTodoId}
                onOpen={() => onOpenTodo(task.id)}
                onClose={onCloseTodo}
                showStarIfToday={showStarIfToday}
                visibleDate={visibleItemDate}
              />
            )}
          />
        )}
      </FocusableTodoList>
    )
  }
)
