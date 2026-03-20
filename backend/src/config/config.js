import dotenv from 'dotenv';
dotenv.config();

export const PORT              = process.env.PORT              || 5000;
export const MONGODB_URI       = process.env.MONGODB_URI       || 'mongodb://localhost:27017/kaamsetu';
export const JWT_SECRET        = process.env.JWT_SECRET        || 'kaamsetu_secret';
export const JWT_EXPIRES_IN    = process.env.JWT_EXPIRES_IN    || '7d';
export const NODE_ENV          = process.env.NODE_ENV          || 'development';
export const FRONTEND_URL      = process.env.FRONTEND_URL      || 'http://localhost:5173';
export const BACKEND_URL       = process.env.BACKEND_URL       || 'http://localhost:5000';
export const GOOGLE_CLIENT_ID  = process.env.GOOGLE_CLIENT_ID  || '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
export const EMAIL_USER        = process.env.EMAIL_USER        || '';
export const EMAIL_PASS        = process.env.EMAIL_PASS        || '';
export const ADMIN_EMAIL       = process.env.ADMIN_EMAIL       || 'admin@kaamsetu.in';
export const ADMIN_PASSWORD    = process.env.ADMIN_PASSWORD    || 'Admin@123';
