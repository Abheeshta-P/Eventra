"use client"
import React, { useState,useRef,useEffect } from 'react'
import { useSelector } from 'react-redux'
import { MdEdit, MdSave } from 'react-icons/md'; 
import serviceProviderService from '@/utils/serviceProvider';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components';
import Swal from 'sweetalert2';

function DetailsOfService() {
  const {userData}= useSelector(state => state.auth);
  const [isEditing,setisEditing] = useState(false);
  const [details,setDetails] = useState(userData?.details);
  const textareaRef = useRef(null);
  const router = useRouter();
  const [error, setError] = useState(null);
  const [changes, setChanges] = useState(false);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; 
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; 
    }
  };

  const editDetails = ()=>{
    if(isEditing && changes && userData?.details!==details){
      ;( async () => {
        try {
          const response = await serviceProviderService.updateServiceDetails(JSON.stringify({ details }));
          if (response.status === 403 || response.status === 401) {
            router.push('/login'); 
            return;
          }
          if (response) {
            setDetails(details);
            Swal.fire('success','Service details updated !', 'success');
          }    
          else {
            setError("service details not updated.");
          }  
        } catch (error) {
          console.log("edit details :: details of Service :: frontend :: error", error);
          Swal.fire('Error', 'Service details update failed.', 'error');
          setError("Failed to update service details. Please try again later.");
        }
      })()
    }
    setisEditing(prev=>!prev)
  }

  useEffect(() => {
    if (isEditing) {
      adjustHeight(); 
    }
  }, [details, isEditing]);

  if (error) {
    return (
      <>
        <div className="flex justify-center items-center h-full">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      </>
    );
  }

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
        onChange={(e) => {
          setChanges(true);
          setDetails(e.target.value);
        }}
        minLength={'20'}
        maxLength={'1000'}
        className='overflow-y-hidden rounded-lg bg-transparent text-black outline-none duration-200 border border-gray-200 w-full text-sm md:text-base resize-none min-h-48'
      />
      ) : (
        <div className='text-zinc-950 whitespace-pre-wrap text-sm md:text-base min-h-48'>
          {details}
        </div>
      )}
    </div>
  )
}

export default DetailsOfService