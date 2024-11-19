"use client";
import React, { useState, useRef, useEffect } from "react";
import { GalleryCard, DashboardLayout, Loading } from "@/components";
import { MdEdit, MdSave, MdAdd } from "react-icons/md";
import serviceProviderService from "@/utils/serviceProvider";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

function GalleryOfService() {
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]); 
  const [newImages, setNewImages] = useState([]); 
  const [deletedImages, setDeletedImages] = useState([]); 
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { userData } = useSelector(state => state.auth);
  const email = userData?.email;

  const MAX_IMAGES = 8;

  const toggleEditMode = async () => {
    if (isEditing) {
      try {
        const formData = new FormData();
        newImages.forEach((file) => formData.append("newImages", file));
        formData.append("deletedImages", JSON.stringify(deletedImages));
        console.log(formData)

        setLoading(true);

        const response = await serviceProviderService.updateServiceGalleryImages(formData,email);

        if (response.status === 403 || response.status === 401) {
          router.push('/login'); 
          return;
        }

        if (response) {
          setGalleryImages(response.gallery); 
          router.refresh();
          setNewImages([]);
          setDeletedImages([]);
          Swal.fire('success','Service details updated !', 'success');
        } else {
          console.error("Failed to update gallery");
          setError("Failed to save changes. Please try again.");
        }
      } catch (error) {
        console.error("Error saving gallery changes:", error);
        Swal.fire('Error', 'Service details update failed.', 'error');
        setError("An error occurred while saving changes.");
      } finally {
        setLoading(false);
      }
    }
    setIsEditing((prev) => !prev);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (galleryImages?.length + newImages?.length + files?.length > MAX_IMAGES) {
      alert(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      fileInputRef.current.value = "";
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
    fileInputRef.current.value = "";
  };

  const handleDeleteImage = (imgSrc) => {
    const newImagesIndex = newImages?.findIndex((file) => URL.createObjectURL(file) === imgSrc);
    if (newImagesIndex !== -1) {
      setNewImages((prev) => prev.filter((_, index) => index !== newImagesIndex));
    } else {
      setDeletedImages((prev) => [...prev, imgSrc]);
    }

    setGalleryImages((prev) => prev.filter((src) => src !== imgSrc));
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await serviceProviderService.getGalleryImages();
        if (response.status === 403 || response.status === 401) {
          router.push("/login");
          return;
        }
        if (response) {
          setGalleryImages(response.gallery);
        } else {
          setError(response.error);
        }
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        setError("Failed to load gallery images. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (error) {
    return (
      <DashboardLayout>
        <div className="w-full flex justify-center items-center h-full">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (loading)
    return (
      <div className="w-full flex justify-center items-center h-full">
        <Loading />
      </div>
    );

  return (
    <DashboardLayout>
      <div>
        <div className="absolute w-7 h-7 bg-zinc-600 text-white flex justify-center items-center rounded-full top-2 right-2">
          <button onClick={toggleEditMode}>
            {isEditing ? <MdSave className="w-4 h-4" /> : <MdEdit className="w-4 h-4" />}
          </button>
        </div>

        {galleryImages?.length === 0 && newImages?.length === 0 ? (
          <div className="w-full h-full flex justify-center items-center flex-col">
            <p className="text-sm md:text-base text-zinc-700">
              No images yet. Tap the edit button to add gallery images.
            </p>
            {isEditing && (
              <div className="w-full h-48 flex items-center justify-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center p-2 bg-zinc-600 text-white rounded-full shadow hover:bg-zinc-700 transition"
                >
                  <MdAdd className="w-12 h-12" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="-mt-2 -mb-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 p-4">
            {galleryImages?.map((imgSrc) => (
              <GalleryCard
                imgSrc={imgSrc}
                key={imgSrc}
                isEditing={isEditing}
                onDelete={() => handleDeleteImage(imgSrc)}
              />
            ))}
            {newImages?.map((file, index) => (
              <GalleryCard
                imgSrc={URL.createObjectURL(file)}
                key={`new-${index}`}
                isEditing={isEditing}
                onDelete={() => handleDeleteImage(URL.createObjectURL(file))}
              />
            ))}
            {isEditing && galleryImages?.length + newImages?.length < MAX_IMAGES && (
              <div className="w-full h-48 flex items-center justify-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center p-2 bg-zinc-600 text-white rounded-full shadow hover:bg-zinc-700 transition"
                >
                  <MdAdd className="w-12 h-12" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default GalleryOfService;
