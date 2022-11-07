import mongoose from 'mongoose';

/**
 * @returns {Promise<void>} - Returns a promise that resolves when the connection is established
 */
export default async function init(): Promise<void> {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(
      process.env.MONGO_URI ?? 'mongodb://localhost:27017'
    );
  } catch (err) {
    console.error('Failed to connect to MongoDB');
    console.error(err instanceof Error && err);
    throw err;
  }
}
