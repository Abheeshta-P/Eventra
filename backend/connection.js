import mongoose from "mongoose";

// connect the mongoo
export async function connectMongoDB(url){
  return mongoose.connect(url)
  .catch(err=>console.log(err));
}
