"use client"
import React, { useState,useRef,useEffect } from 'react'
import { useSelector } from 'react-redux'
import { MdEdit, MdSave } from 'react-icons/md'; 

function DetailsOfService() {
  const {userData}= useSelector(state => state.auth);
  const [isEditing,setisEditing] = useState(false);
  const [details,setDetails] = useState(userData?.details);
  const textareaRef = useRef(null);
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; 
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; 
    }
  };
  const editDetails = ()=>{
    if(isEditing){
      // call db
      // after that update the redux as well
      console.log("called db")
    }
    setisEditing(prev=>!prev)
  }
  useEffect(() => {
    if (isEditing) {
      adjustHeight(); 
    }
  }, [details, isEditing]);
  return (
    <div>
      {/* Edit button */}
      <div className='absolute w-7 h-7 bg-zinc-600 text-white flex justify-center items-center rounded-full top-2 right-1'>
        <button onClick={editDetails}> {isEditing?<MdSave className='w-4 h-4'/>:<MdEdit className='w-4 h-4'/>}</button>
      </div>
      {/* content */}
      {isEditing ? (
        <textarea
        ref={textareaRef}
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        minLength={'20'}
        maxLength={'1000'}
        className='overflow-y-hidden rounded-lg bg-transparent text-black outline-none duration-200 border border-gray-200 w-full text-sm md:text-base resize-none'
      />
      ) : (
        <div className='text-zinc-950 whitespace-pre-wrap text-sm md:text-base '>
          {details}
        </div>
      )}
    </div>
  )
}

export default DetailsOfService