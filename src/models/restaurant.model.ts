import mongoose, { Schema, Document } from "mongoose";

interface IMenuItem {
  _id: string;
  productId: string;
  name: string;
  description?: string;
  price: number;
}

interface IRestaurant extends Document {
  restaurantName: string;
  location: string;
  owner: string;
  estimatedDeliveryTime: Number;
  deliveryPrice: Number;
  imageUrl: string;
  cuisines: string[];
  menu: IMenuItem[];
}

const menuItemSchema: Schema<IMenuItem> = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    productId: {
      type: String,
      required: true,
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
