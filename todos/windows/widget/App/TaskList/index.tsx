import { useState } from 'react'
import { Task } from '../../../../src/store/types'
import { useTodoState } from '../../../shared/lib/useTodoState'
import { DraggableList } from '../../../shared/ui/DraggableList'
import { FocusableTodoList } from './FocusableTodoList'
import { TaskItem } from './TaskItem'

interface Props {
  tasks: Task[]
}

export function TaskList({ tasks }: Props) {
  const {
    addTodo,
    toggleTodo: toggleTodoBackend,
    deleteTodo,
    editTodo,
    reorderTodos,
    undo,
  } = useTodoState()

  const [recentToggledTodos, setRecentToggledTodos] = useState<string[]>([])
  const filteredTasks = tasks.filter(
    (task) => !task.completedAt || recentToggledTodos.includes(task.id)
  )

  async function toggleTodo(id: string) {
    await toggleTodoBackend(id)
    setRecentToggledTodos([id, ...recentToggledTodos])
  }

  return (
    <FocusableTodoList
      onAddTodo={() => addTodo('')}
      todoIds={filteredTasks.map((task) => task.id)}
      onDelete={deleteTodo}
      onUndo={undo}
    >
      {({ onOpenTodo, onFocus, onCloseTodo, focusedTodoId, openTodoId }) => (
        <DraggableList
          items={filteredTasks}
          getItemId={(task) => task.id}
          onReorder={reorderTodos}
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
            />
          )}
        />
      )}
    </FocusableTodoList>
  )
}
