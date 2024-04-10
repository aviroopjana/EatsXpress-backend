import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import Restaurant from "../../models/restaurant.model";
import dotenv from "dotenv";

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

export const createCheckoutSession = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const checkoutSessionRequest: checkoutSessionRequest = req.body;

      const lineitems = await createLineItems(checkoutSessionRequest);

      const representativeRestaurantId = checkoutSessionRequest.cartItems[0].restaurantId;
      const representativeRestaurant = await Restaurant.findById(representativeRestaurantId);

      if(!representativeRestaurant) {
          throw new Error("Representative restaurant not found");
      }

      const session = await createSession(lineitems, "TEST_ORDER_ID", representativeRestaurant.deliveryPrice, representativeRestaurant._id.toString());

      if (!session.url) {
          return res.status(500).json({ message: "Error creating stripe session" });
      }

      res.json({ url: session.url});

    } catch (error) {
        next(error);
    }
}

const createLineItems = async (checkoutSessionRequest: checkoutSessionRequest) => {

    const lineItems = [];

  for (const cartItem of checkoutSessionRequest.cartItems) {
    const restaurant = await Restaurant.findById(cartItem.restaurantId);
    if (!restaurant) {
      throw new Error(`Restaurant not found: ${cartItem.restaurantId}`);
    }

    const menuItem = restaurant.menu.find(
      (item) => item._id.toString() === cartItem.menuItemId.toString()
    );


        if(!menuItem) {
            throw new Error (`Menu item not found : ${cartItem.menuItemId}`);
        }

        const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
            price_data: {
                currency: "inr",
                unit_amount: menuItem.price * 100,
                product_data: {
                    name: menuItem.name,
                },
            },
            quantity : parseInt(cartItem.quantity),
        };

        lineItems.push(line_item);
  }

    return lineItems;
}

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

  