"use client"
import { useState } from 'react'
import {useDispatch} from 'react-redux'
import { addTodo } from '@/store/features/todoSlice';

function AddTodo({ setHasChanges }) {
  const [input,setInput] = useState('');
  const dispatch = useDispatch();

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
    <form onSubmit={addTodoHandler} className="mb-3 w-full flex gap-3 items-center">
      <input
        type="text"
        className="border rounded p-2 flex-grow focus:outline-[#03089a] shadow-sm w-36 sm:w-48 h-12"
        placeholder="Enter a Todo"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="px-2 py-3 bg-[#03089a] text-white rounded-md shadow-sm hover:bg-[#02087c] transition-all">
        Add Todo
      </button>
    </form>
  )
}

export default AddTodo