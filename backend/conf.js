import { config } from 'dotenv';
config(); 

//process.env.VARIABLE_NAME
export const companyEmail = String(process.env.EMAIL);
export const pass = String(process.env.PASS);