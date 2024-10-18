"use client"
import { useState } from 'react'
import {useDispatch} from 'react-redux'
import { addTodo } from '@/store/features/todoSlice';

function AddTodo() {
  const [input,setInput] = useState('');
  const dispatch = useDispatch();

  const addTodoHandler = (e)=>{
    e.preventDefault();
    if(input!=''&&input!=' ')
    dispatch(addTodo({text : input}));
    setInput("");
  }

  return (
    <form onSubmit={addTodoHandler} className="mb-3 w-full flex gap-3">
      <input
        type="text"
        className="border rounded p-2 flex-grow focus:outline-[#03089a] shadow-sm w-36 sm:w-48 h-12"
        placeholder="Enter a Todo"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-[#03089a] text-white rounded-md shadow-sm hover:bg-[#02087c] transition-all">
        Add Todo
      </button>
    </form>
  )
}

export default AddTodo