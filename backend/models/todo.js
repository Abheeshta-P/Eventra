import mongoose from "mongoose";
import { status } from "../constants/index.js";

const todoSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  status: { 
    type: String, 
    default: 'pending', 
    enum: status
  }
});

const Todo = mongoose.model('Todo',todoSchema)
export default Todo;