"use client"
import {createSlice,nanoid} from '@reduxjs/toolkit'

const loadInitialState = () => {
  if (typeof window === 'undefined') {
    return { todos: [] };
  }

  try {
    const getTodos = JSON.parse(localStorage.getItem('todos'));
    if (getTodos && getTodos !== null) {
      return getTodos;
    } else {
      return { todos: [] };
    }
  } catch (err) {
    console.error("Error loading todos from localStorage:", err);
    return { todos: [] };
  }
};



const saveToLocalStorage = (state) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('todos', serializedState);
  } catch (err) {
    console.error("Could not save state to localStorage:", err);
  }
};


const removeFromLocalStorage = () =>{
  if (typeof window !== 'undefined') {
    localStorage.removeItem('todos');
  }
}

const initialState = loadInitialState();


export const todoSlice = createSlice({
  name : "todo",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const todo = {
        id: nanoid(),  
        text: action.payload.text,
        completed: false,
      };
      state.todos.push(todo); 
      saveToLocalStorage(state);
    },

    deleteTodo: (state, action) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload.id);
      saveToLocalStorage(state);
    },

    updateTodo: (state, action) => {
      state.todos = state.todos.map(todo => (todo.id===action.payload.id)?{...todo,text:action.payload.text}:todo);
      saveToLocalStorage(state);
    },

    toggleTodo: (state, action) => {
      state.todos = state.todos.map(todo => (todo.id===action.payload.id)?{...todo,completed:!todo.completed}:todo);
      saveToLocalStorage(state);
    },
    resetTodo: (state) => {
      state.todos = []
      saveToLocalStorage(state);
      removeFromLocalStorage();
    },
    setInitialTodos: (state, action) => {
      state.todos = action.payload;
      saveToLocalStorage(state);
    },
  },
})

export const {addTodo,deleteTodo,updateTodo,toggleTodo,resetTodo,setInitialTodos} = todoSlice.actions;

export default todoSlice.reducer;
