"use client"
import { useState } from 'react'
import {useDispatch} from 'react-redux'
import { addTodo } from '@/store/features/todoSlice';

function AddTodo({ setHasChanges, isDisabled }) {
  const [input,setInput] = useState('');
  const dispatch = useDispatch();

  if (isDisabled) {
    return (
      <div className="mb-3 w-full p-2.5 bg-zinc-200/50 border border-zinc-300 rounded-lg text-xs text-zinc-500 text-center font-medium cursor-not-allowed select-none">
        Event completed. Checklist is locked in read-only mode.
      </div>
    );
  }

  const addTodoHandler = (e)=>{
    e.preventDefault();
    if(input!=''&&input!=' ')
    {
      dispatch(addTodo({text : input}));
      setHasChanges(true);
    }
    setInput("");
  }

  return (
    <form onSubmit={addTodoHandler} className="mb-3 w-full flex gap-3 items-center min-w-0">
      <input
        type="text"
        className="border rounded p-2 flex-1 min-w-0 focus:outline-[#03089a] shadow-sm h-12 text-zinc-900"
        placeholder="Enter a Todo"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-3 bg-[#03089a] text-white rounded-md shadow-sm hover:bg-[#02087c] transition-all shrink-0 whitespace-nowrap cursor-pointer">
        Add Todo
      </button>
    </form>
  )
}

export default AddTodo