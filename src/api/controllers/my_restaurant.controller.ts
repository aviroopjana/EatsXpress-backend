import Restaurant from "../../models/restaurant.model";
import User from "../../models/user.model";

export const createRestaurant = async (req, res, next) => {
    try {
        const { restaurantName, location, estimatedDeliveryTime,imageUrl, deliveryPrice, cuisines, menu } = req.body;
        const ownerId = req.user.id;

        const restaurant = new Restaurant({
            restaurantName,
            location,
            owner: ownerId,
            estimatedDeliveryTime,
            imageUrl,
            deliveryPrice,
            cuisines,
            menu
        })

        await restaurant.save();

        await User.findByIdAndUpdate(ownerId, { restaurantId: restaurant._id });

        return res.status(201).json({
            message: 'Restaurant has been created successfully!',
            restaurant: restaurant
        });
    } catch (error) {
        next(error);
    }
}