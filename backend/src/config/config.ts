import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://alimiyan1112:Aylanesa7@cluster0.yu4ra.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log(process.env.CLIENT_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};


export default connectDB


