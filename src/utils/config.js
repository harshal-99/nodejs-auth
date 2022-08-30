import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config()

export const PORT = process.env.PORT || 3000

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nodejs-auth'

export const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export const configureDB = async () => {
	await mongoose.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
}
