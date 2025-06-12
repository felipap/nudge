import { AnimatePresence, motion } from 'framer-motion'
import { useTodoState } from '../../../shared/lib/useTodoState'
import { DraggableList } from '../../../shared/ui/DraggableList'
import { FocusableTodoList } from './FocusableTodoList'
import { TaskItem } from './TaskItem'

export function TaskList() {
  const { addTodo, deleteTodo, reorderTodos, tasks, undo } = useTodoState()

  const handleReorder = (startIndex: number, endIndex: number) => {
    reorderTodos(
      sortedTasks.map((t) => t.id),
      startIndex,
      endIndex
    )
  }

  const filteredTasks = tasks.filter(
    (task) => !task.deletedAt && task.when === 'today' && !task.loggedAt
    // (!task.completedAt || recentToggledTodos.includes(task.id))
  )

  // Sort tasks by anytimeRank
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    return a.anytimeRank - b.anytimeRank
  })

  return (
    <FocusableTodoList
      onAddTodo={() => addTodo({ text: '' })}
      todoIds={sortedTasks.map((task) => task.id)}
      onDelete={deleteTodo}
      onUndo={undo}
    >
      {({
        onOpenTodo,
        focus,
        blur,
        onCloseTodo,
        focusedTodoId,
        openTodoId,
      }) => (
        <DraggableList
          items={sortedTasks}
          getItemId={(task) => task.id}
          onReorder={(startIndex, endIndex) => {
            blur()
            handleReorder(startIndex, endIndex)
          }}
          renderItem={({ item: task, dragHandleProps }) => (
            <AnimatePresence key={task.id}>
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 1 }}
              >
                <TaskItem
                  task={task}
                  blur={() => blur(task.id)}
                  focus={() => focus(task.id)}
                  dragHandleProps={dragHandleProps}
                  isFocused={task.id === focusedTodoId}
                  isOpen={task.id === openTodoId}
                  onOpen={() => onOpenTodo(task.id)}
                  onClose={onCloseTodo}
                />
              </motion.div>
            </AnimatePresence>
          )}
        />
      )}
    </FocusableTodoList>
  )
}
