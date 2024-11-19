import serviceProvider from '../models/serviceProvider.js';
import cloudinary from '../utils/cloudinary.js';

export async function handleServiceDetailsUpdate(req, res) {
  const { id } = req.user; 
  const { details } = req.body; 

  try {
    const serviceDetails = await serviceProvider.findByIdAndUpdate(
      id, 
      { details }, 
      { new: true } 
    ).select('details'); 

    if (!serviceDetails) {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    return res.status(200).json(serviceDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function handleGetGalleryImages(req,res){
  try {
    const { id } = req.user; 

    const provider = await serviceProvider.findById(id);

    if (!provider) {
      return res.status(404).send({ error: 'Service provider not found' });
    }

    res.send({ gallery: provider.gallery });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
}

export async function handleUpdateGalleryImages(req,res){

  function getPublicId(imageUrl) {
    const parts = imageUrl.split("/");
    const versionIndex = parts.findIndex(part => part.startsWith("v")); // Find the "v{number}" part
    const folderAndFile = parts.slice(versionIndex + 1).join("/"); // Get everything after the version
    return folderAndFile.split(".")[0]; // Remove the file extension
  }

  try {
    const { deletedImages } = req.body;
    const { id } = req.user;

    const provider = await serviceProvider.findById(id);
    if (!provider) {
      return res.status(404).json({ error: "Service provider not found" });
    }

    if (deletedImages) {
      const imagesToDelete = JSON.parse(deletedImages);
      for (const image of imagesToDelete) {
        const publicId = getPublicId(image); 
        console.log(publicId)
        const result = await cloudinary.uploader.destroy(publicId, {invalidate : true});
        if (result.result !== "ok") {
          console.error(`Failed to delete image with public_id: ${publicId}`);
        } else {
          console.log(`Image with public_id: ${publicId} deleted successfully.`);
        }
      }

      provider.gallery = provider.gallery.filter((img) => !imagesToDelete.includes(img));
    }

    if (req.files) {
      const newImagePaths = req.files.map((file) => file.path); 
      provider.gallery = [...provider.gallery, ...newImagePaths];
    }

    await provider.save();

    res.status(200).json({ message: "Gallery updated successfully", gallery: provider.gallery });
  } catch (error) {
    console.error("Error updating gallery:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
