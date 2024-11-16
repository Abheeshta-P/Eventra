import mongoose from "mongoose";
import { status } from "../constants/index.js";

const todoSchema = new mongoose.Schema({
  id : { type: String, required: false },
  text: { type: String, required: false },
  completed: { 
    type: Boolean, 
    default: false, 
    enum: status
  }
});

const Todo = mongoose.model('Todo',todoSchema)
export default Todo;