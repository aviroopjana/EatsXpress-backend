import mongoose, { Schema, Document } from "mongoose";

interface IMenuItem {
  _id: Schema.Types.ObjectId;
  name: string;
  description?: string;
  price: number;
}

interface IRestaurant extends Document {
  restaurantName: string;
  location: string;
  owner: String;
  estimatedDeliveryTime: Number;
  deliveryPrice: Number;
  imageUrl: string;
  cuisines: [];
  menu: IMenuItem[];
}

const menuItemSchema: Schema<IMenuItem> = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const restaurantSchema: Schema<IRestaurant> = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      ref: "User",
      required: true,
    },
    estimatedDeliveryTime: {
      type: Number,
      required: true,
    },
    deliveryPrice: {
      type: Number,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    cuisines: [
      {
        type: String,
        required: true,
      },
    ],
    menu: [menuItemSchema],
  },
  { timestamps: true }
);

const Restaurant = mongoose.model<IRestaurant>("Restaurant", restaurantSchema);

export default Restaurant;
