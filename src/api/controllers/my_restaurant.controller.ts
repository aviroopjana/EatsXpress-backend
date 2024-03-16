import Restaurant from "../../models/restaurant.model";

export const createRestaurant = async (req, res, next) => {
    try {
        const { restaurantName, location, estimatedDeliveryTime, cuisines, menu } = req.body;
        const ownerId = req.user.id;

        const restaurant = new Restaurant({
            restaurantName,
            location,
            owner: ownerId,
            estimatedDeliveryTime,
            cuisines,
            menu
        })

        await restaurant.save();

        return res.status(201).json({
            message: 'Restaurant has been created successfully!',
            restaurant: restaurant
        });
    } catch (error) {
        next(error);
    }
}