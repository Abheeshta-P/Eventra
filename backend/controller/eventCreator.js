import serviceProvider from '../models/serviceProvider.js';

export async function handleGetCategoryServices(req, res) {
  const { serviceCategory } = req.params;
  
  try {
    const services = await serviceProvider.find({ category: serviceCategory }).select(
      'category name cost email phone location'
    );
    if (services.length === 0) {
      return res.status(404).json({ message: 'No services found in this category' });
    }
    else 
    return res.status(200).json(services);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function handleGetServiceDetails(req,res){
    try {
      const { id } = req.params;
  
      const service = await serviceProvider.findById(id).select('-password'); 
  
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
  
      res.json({
        name: service.name,
        details: service.details,
        email: service.email,
        phone: service.phone,
        category: service.category,
        location: service.location,
        estimatedCost: service.cost,
        galleryImages: service.gallery,
      });
    } catch (error) {
      console.error('Error fetching service details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
}

export async function handleGetServicesDetailsBatch(req,res){
 try {
   const emails = req.body;  
   if (!Array.isArray(emails)) {
     return res.status(400).json({ error: "Invalid request format" });
   }
   const services = await serviceProvider.find({ email: { $in: emails } })||[];
   res.json(services);
 } catch (error) {
  console.error('Error fetching service details:', error);
  res.status(500).json({ message: 'Internal server error' });
 }
}