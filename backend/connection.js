import mongoose from "mongoose";

// connect the mongoo
export async function connectMongoDB(url){
  return mongoose.connect(url).then(()=>console.log("Connected mongo"))
    .catch(err=>console.log(err));
}
