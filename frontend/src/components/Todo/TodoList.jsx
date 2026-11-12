import React from 'react'
import AddTodo from './AddTodo'
import Todos from './Todos'

function TodoList({setHasChanges, isDisabled}) {
  return (
    <div className={`p-4 w-full max-w-3xl min-w-0 text-xs sm:text-sm md:text-base ${
      isDisabled ? 'opacity-95' : ''
    }`}>
      <AddTodo setHasChanges={setHasChanges} isDisabled={isDisabled} />
      <Todos setHasChanges={setHasChanges} isDisabled={isDisabled} />
    </div>
  )
}

export default TodoList