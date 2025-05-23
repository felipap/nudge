import { TodoInput } from './TodoInput'
import { TodoItem } from './TodoItem'
import { useTodoState } from './useTodoState'
import { PlusIcon } from './PlusIcon'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'
import { useState } from 'react'

export default function App() {
  const {
    todos,
    newTodo,
    setNewTodo,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    reorderTodos,
  } = useTodoState()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      addTodo(newTodo)
      setNewTodo('')
      setIsModalOpen(false)
    }
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    reorderTodos(result.source.index, result.destination.index)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white relative p-3">
      <header className="flex items-center justify-between p-2">
        <h2 className="text-[17px] font-semibold">Todos</h2>
      </header>
      <main className="h-full overflow-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <div
                className="flex flex-col gap-2 overflow-scroll h-full"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {todos.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <TodoItem
                          todo={todo}
                          onToggle={toggleTodo}
                          onDelete={deleteTodo}
                          onEdit={editTodo}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-3 right-3">
        <AddTodoButton onClick={() => addTodo('')} />
      </div>
    </div>
  )
}

function AddTodoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center"
    >
      <PlusIcon className="w-5 h-5" />
    </button>
  )
}
