import { AnimatePresence, motion } from 'framer-motion'
import { Task } from '../../../../src/store/types'
import { useTodoState } from '../../../shared/lib/useTodoState'
import { DraggableList } from '../../../shared/ui/DraggableList'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { SelectableGroupList } from './SelectableGroupList'
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
      console.log('ids', ids)
      for (const id of ids) {
        await deleteTodo(id, restoreOnDelete)
      }
    }

    const toggleHighLeverage = (ids: string[]) => {
      for (const id of ids) {
        editTodo(id, {
          highLeverage: !tasks.find((t) => t.id === id)?.highLeverage,
        })
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
      <SelectableGroupList
        onAddTodo={onAddTodo}
        itemIds={sortedTasks.map((task) => task.id)}
        onUndo={undo}
        toggleTasks={toggleTasks}
        changeTasksWhen={changeTasksWhen}
        deleteTasks={deleteTasks}
        toggleHighLeverage={toggleHighLeverage}
      >
        {({ onOpenTodo, onFocus, closeTodo, selection, openTodoId }) => (
          <DraggableList
            items={sortedTasks}
            getItemId={(task) => task.id}
            onReorder={handleReorder}
            renderItem={({ item: task, dragHandleProps }) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TaskItem
                  task={task}
                  onToggle={(id) => toggleTasks([id])}
                  onFocus={() => onFocus(task.id)}
                  dragHandleProps={dragHandleProps}
                  isFocused={selection.includes(task.id)}
                  isOpen={task.id === openTodoId}
                  onOpen={() => onOpenTodo(task.id)}
                  close={closeTodo}
                  showStarIfToday={showStarIfToday}
                  visibleDate={visibleItemDate}
                />
              </motion.div>
            )}
          />
        )}
      </SelectableGroupList>
    )
  }
)
