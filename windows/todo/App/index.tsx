import { TodoInput } from './TodoInput'
import { TodoItem } from './TodoItem'
import { useTodoState } from './useTodoState'

export default function App() {
  const {
    todos,
    newTodo,
    setNewTodo,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
  } = useTodoState()

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      addTodo(newTodo)
      setNewTodo('')
    }
  }

  return (
    <div className="flex flex-col h-screen p-4 bg-white">
      <header className="flex items-center justify-between mb-2">
        <h2 className="text-md font-semibold">Todos</h2>
      </header>
      <TodoInput
        value={newTodo}
        onChange={setNewTodo}
        onEnter={handleAddTodo}
      />
      <div className="flex flex-col gap-2 overflow-auto">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
          />
        ))}
      </div>
    </div>
  )
}
