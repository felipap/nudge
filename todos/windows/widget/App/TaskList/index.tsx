import { useState } from 'react'
import { useTodoState } from '../../../shared/lib/useTodoState'
import { DraggableList } from '../../../shared/ui/DraggableList'
import { FocusableTodoList } from './FocusableTodoList'
import { TaskItem } from './TaskItem'

export function TaskList() {
  const {
    tasksRef,
    addTodo,
    toggleTodoCompletion,
    deleteTodo,
    editTodo,
    reorderTodos,
    tasks,
    undo,
  } = useTodoState()

  const [recentToggledTodos, setRecentToggledTodos] = useState<string[]>([])
  const filteredTasks = tasks.filter(
    (task) =>
      !task.deletedAt &&
      (!task.completedAt || recentToggledTodos.includes(task.id))
  )

  async function toggleTodo(id: string) {
    const task = tasksRef.current.find((task) => task.id === id)
    if (!task) {
      return
    }
    await toggleTodoCompletion(id, task.completedAt === null)
    setRecentToggledTodos([id, ...recentToggledTodos])
  }

  // Sort tasks by anytimeRank
  const sortedTasks = [...tasks].sort((a, b) => {
    return a.anytimeRank - b.anytimeRank
  })

  const handleReorder = (startIndex: number, endIndex: number) => {
    reorderTodos(
      sortedTasks.map((t) => t.id),
      startIndex,
      endIndex
    )
  }

  return (
    <FocusableTodoList
      onAddTodo={() => addTodo({ text: '' })}
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
              dragHandleProps={dragHandleProps}
              isFocused={task.id === focusedTodoId}
              isOpen={task.id === openTodoId}
              onOpen={() => onOpenTodo(task.id)}
              onClose={onCloseTodo}
            />
          )}
        />
      )}
    </FocusableTodoList>
  )
}
