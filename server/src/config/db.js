// src/config/db.js – MongoDB connection using Mongoose
import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }
  try {
    await mongoose.connect(mongoURI);
    console.log(' MongoDB connected');
  } catch (error) {
    console.error(' MongoDb connection error:', error);
    throw error;
  }
};
