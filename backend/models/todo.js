import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  status: { 
    type: String, 
    default: 'pending', 
    enum: ['pending', 'completed'] 
  }
});

const Todo = mongoose.model('Todo',todoSchema)
export default Todo;