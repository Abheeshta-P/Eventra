import serviceProvider from '../models/serviceProvider.js';

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
