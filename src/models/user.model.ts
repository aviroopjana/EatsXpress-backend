import mongoose, { Schema, Document } from "mongoose";

// Define types
type AccountType = 'personal' | 'family' | 'business';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  name: string;
  profilePicture: string;
  phone: string;
  address?: string;
  city?: string;
  pincode?: string;
  accountType: AccountType;
  restaurantId?: Schema.Types.ObjectId;
}

// Define schema
const userSchema: Schema<IUser> = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9_]+$/,
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
  phone: {
    type: String,
    required: true,
    unique: true
  },
  address: {
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
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    default: null
  }
}, { timestamps: true });

// Define and export the model
const User = mongoose.model<IUser>('User', userSchema);

export default User;
