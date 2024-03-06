import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  addressLine1: {
    type: String,
  },
  city: {
    type: String,
  },
  pincode: {
    type: String
  },
  accountType: {
    type: String,
    required: true
  }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;