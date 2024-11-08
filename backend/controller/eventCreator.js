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