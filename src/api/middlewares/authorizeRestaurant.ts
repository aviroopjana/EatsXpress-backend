import { Response, NextFunction } from "express";
import Restaurant from "../../models/restaurant.model";

export const authorizeRestaurantCreation = async (req, res: Response, next: NextFunction) => {
    try {
        const user = req.user; // Access user object attached by verifyToken middleware

        // Check if the user account type is business
        if (req.user.accountType !== 'business') {
            return res.status(403).json({
                message: "Only business accounts are allowed to create restaurants"
            });
        }

        // Check if the user has already created a restaurant
        const restaurant = await Restaurant.findOne({ owner: user.id });
        if (restaurant) {
            return res.status(400).json({
                message: "User has already created a restaurant"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
