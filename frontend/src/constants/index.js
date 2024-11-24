export const imageSources = {
  wedding: '/eventType/wedding.jpg',
  party: '/eventType/party.jpg',
  entertainment: '/eventType/concert.jpg'
};
export const features = [
  { title: 'Event Creation', description: 'Create a events with all services needed for that event.', icon: '📅' },
  { title: 'Location-Based Search', description: 'Find venues near your specified location.', icon: '📍' },
  { title: 'Event To-Dos & Attendees List', description: 'Organize your tasks and attendees.', icon: '📝' },
  { title: 'Digital Invitations', description: 'Create custom invitations with Canva templates.', icon: '✉️' },
  { title: 'Notifications', description: 'Send details about event via email.', icon: '🔔' },
  { title: 'Service Provider Listings', description: 'List your service like caterers, decorators, and more.', icon: '🏢' },
];

export const canvaLink = {
  wedding : 'https://www.canva.com/search?q=wedding',
  party : 'https://www.canva.com/search?q=party%20posters',
  entertainment : 'https://www.canva.com/search?q=entertainment%20posters'
}

export const eventCategories = {
  wedding: [
    'Catering', 
    'Decorating', 
    'Photography', 
    'Venue', 
    'Music', 
    'Emcee', 
    'Makeup', 
    'Cakeshop', 
    'Purohit'
  ],
  party: [
    'Catering', 
    'Decorating', 
    'Photography', 
    'Venue', 
    'Music', 
    'Emcee', 
    'Cakeshop'
  ],
  entertainment: [
    'Catering', 
    'Decorating', 
    'Photography', 
    'Venue', 
    'Music', 
    'Emcee'
  ]
};


export const eventCategoryImageSources = {
  'Cakeshop' : '/serviceCategory/cakeshop.jpg',
  'Decorating' : '/serviceCategory/decor.jpg',
  'Photography': '/serviceCategory/photography.jpeg', 
  'Venue' : '/serviceCategory/venue.jpg', 
  'Music' : '/serviceCategory/music.JPG', 
  'Emcee' : '/serviceCategory/emcee.jpg', 
  'Makeup' : '/serviceCategory/makeup.jpg', 
  'Catering' : '/serviceCategory/cater.jpg', 
  'Purohit' : '/serviceCategory/purohit.webp'
}

export const serviceCategories = ['Catering', 'Decorating', 'Photography', 'Venue', 'Music', 'Emcee', 'Makeup', 'Cakeshop','Purohit'];