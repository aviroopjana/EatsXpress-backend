import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import Restaurant from "../../models/restaurant.model";
import dotenv from "dotenv";
import Order from "../../models/order.model";

dotenv.config();

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);

const FRONTEND_URL = process.env.FRONTEND_URL as string;

type CartItem = {
  menuItemId: string;
  name: string;
  quantity: string;
  restaurantId: string;
};

type checkoutSessionRequest = {
  cartItems: CartItem[];
  deliveryDetails: {
    email: string;
    name: string;
    phone: string;
    addressLine1: string;
    pincode: string;
    city: string;
  };
};

const stripeWebhookHandler = async (req: Request, res: Response) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = STRIPE.webhooks.constructEvent(
      req.body,
      sig as string,
      STRIPE_ENDPOINT_SECRET
    );
  } catch (error: any) {
    console.log(error);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const order = await Order.findById(event.data.object.metadata?.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.totalAmount = event.data.object.amount_total;
    order.status = "paid";

    await order.save();
  }

  res.status(200).send();
};

export const createCheckoutSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const checkoutSessionRequest: checkoutSessionRequest = req.body;

    const lineitems = await createLineItems(checkoutSessionRequest);

    const representativeRestaurantId =
      checkoutSessionRequest.cartItems[0].restaurantId;
    const representativeRestaurant = await Restaurant.findById(
      representativeRestaurantId
    );

    if (!representativeRestaurant) {
      throw new Error("Representative restaurant not found");
    }

    const newOrder = new Order({
      restaurant: representativeRestaurant,
      user: req.body.userId,
      status: "placed",
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      createdAt: new Date(),
    });

    const session = await createSession(
      lineitems,
      newOrder._id.toString(),
      representativeRestaurant.deliveryPrice,
      representativeRestaurant._id.toString()
    );

    if (!session.url) {
      return res.status(500).json({ message: "Error creating stripe session" });
    }

    await newOrder.save();

    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
};

const createLineItems = async (
  checkoutSessionRequest: checkoutSessionRequest
) => {
  const lineItems = [];

  for (const cartItem of checkoutSessionRequest.cartItems) {
    const restaurant = await Restaurant.findById(cartItem.restaurantId);

    if (!restaurant) {
      throw new Error(`Restaurant not found: ${cartItem.restaurantId}`);
    }

    const menuItem = restaurant.menu.find(
      (item) => item._id.toString() === cartItem.menuItemId.toString()
    );

    if (!menuItem) {
      throw new Error(`Menu item not found : ${cartItem.menuItemId}`);
    }

    const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "inr",
        unit_amount: menuItem.price * 100,
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: parseInt(cartItem.quantity),
    };

    lineItems.push(line_item);
  }

  return lineItems;
};

const createSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string,
  deliveryPrice: number,
  restaurantId: string
) => {
  const sessionData = await STRIPE.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: {
            amount: deliveryPrice * 100,
            currency: "inr",
          },
        },
      },
    ],
    mode: "payment",
    metadata: {
      orderId,
      restaurantId,
    },
    success_url: `${FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${FRONTEND_URL}/cartDetail/${restaurantId}?cancelled=true`,
  });

  return sessionData;
};
