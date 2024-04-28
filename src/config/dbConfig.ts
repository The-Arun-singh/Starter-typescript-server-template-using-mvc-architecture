import mongoose from 'mongoose';

export default function connectDB() {
  try {
    mongoose.connect(
      (process.env.MONGODB_URI as string) || `mongodb://localhost:27017`
    );
  } catch (error) {
    throw new Error();
  }
}
