import { Task } from '../../../../../src/store/types'
import { useTodoState } from '../../../../shared/lib/useTodoState'
import { DraggableList } from '../../../../shared/ui/DraggableList'
import { withBoundary } from '../../../../shared/ui/withBoundary'
import { FocusedGroupedList } from './FocusedGroupedList'
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
    const { toggleTodoCompletion, deleteTodo, reorderTodos, undo, editTodo } =
      useTodoState()

    // Sort tasks by anytimeRank
    const sortedTasks = [...tasks].sort((a, b) => {
      if (isToday) {
        return (a.todayRank || 0) - (b.todayRank || 0)
      }
      return (a.anytimeRank ?? 0) - (b.anytimeRank ?? 0)
    })

    const toggleTasks = async (ids: string[], completed?: boolean) => {
      const anyItemIsCompleted = ids.some(
        (id) => tasks.find((t) => t.id === id)?.completedAt
      )
      const targetCompleted = completed ?? !anyItemIsCompleted

      for (const id of ids) {
        await toggleTodoCompletion(id, targetCompleted)
      }
    }

    const changeTasksWhen = (ids: string[], when: Task['when']) => {
      for (const id of ids) {
        const task = tasks.find((t) => t.id === id)!
        if (task) {
          editTodo(id, { when: task.when === when ? null : when })
        }
      }
    }

    const deleteTasks = async (ids: string[]) => {
      for (const id of ids) {
        await deleteTodo(id, restoreOnDelete)
      }
    }

    const handleReorder = (startIndex: number, endIndex: number) => {
      console.log('TaskList handleReorder:', {
        startIndex,
        endIndex,
        isToday,
        tasks: sortedTasks.map((t, i) => ({
          index: i,
          id: t.id,
          text: t.text,
          anytimeRank: t.anytimeRank,
          todayRank: t.todayRank,
        })),
      })
      reorderTodos(
        sortedTasks.map((t) => t.id),
        startIndex,
        endIndex,
        isToday
      )
    }

    return (
      <FocusedGroupedList
        onAddTodo={onAddTodo}
        itemIds={sortedTasks.map((task) => task.id)}
        onUndo={undo}
        toggleTasks={toggleTasks}
        changeTasksWhen={changeTasksWhen}
        deleteTasks={deleteTasks}
      >
        {({ onOpenTodo, onFocus, onCloseTodo, selection, openTodoId }) => (
          <DraggableList
            items={sortedTasks}
            getItemId={(task) => task.id}
            onReorder={handleReorder}
            renderItem={({ item: task, dragHandleProps }) => (
              <TaskItem
                task={task}
                onToggle={(id) => toggleTasks([id])}
                onFocus={() => onFocus(task.id)}
                dragHandleProps={dragHandleProps}
                isFocused={selection.includes(task.id)}
                isOpen={task.id === openTodoId}
                onOpen={() => onOpenTodo(task.id)}
                onClose={onCloseTodo}
                showStarIfToday={showStarIfToday}
                visibleDate={visibleItemDate}
              />
            )}
          />
        )}
      </FocusedGroupedList>
    )
  }
)
