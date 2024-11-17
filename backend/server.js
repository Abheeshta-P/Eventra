import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { mongoDB } from './conf.js';
import { connectMongoDB } from './connection.js';
import authRouter from './routes/auth.js'
import eventCreatorRouter from './routes/eventCreator.js'
import serviceProviderRouter from './routes/serviceProvider.js'
import handleContactUs from './controller/contact-us.js'
import { verifyToken } from './middleware/index.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
  credentials: true, 
}));

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

connectMongoDB(mongoDB);

// ROUTES :
// contact route
app.post('/api/contact-us', handleContactUs);
// auth routes
app.use('/api/auth',authRouter)
// event creator
app.use('/api/eventCreator',verifyToken,eventCreatorRouter)
// service provider
app.use('/api/serviceProvider',verifyToken,serviceProviderRouter)


app.listen(5000, () => {
  console.log(`Server is running on port 5000 http://localhost:${5000}`);
});
 