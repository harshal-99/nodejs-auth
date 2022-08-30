import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator"

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	passwordHash: {
		type: String,
		required: true,
	},
	isDeleted: {
		type: Boolean,
		defaultValue: false
	}
})

userSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.passwordHash
	}
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model("User", userSchema)

export default User
