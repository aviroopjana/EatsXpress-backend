import { Response, NextFunction } from "express";

export const authorizeRestaurant = async (req, res: Response, next: NextFunction) => {
    try {
        // Check if the user account type is business
        if (req.user.accountType !== 'business') {
            return res.status(403).json({
                message: "Only business accounts are allowed to create, update and view their restaurants"
            });
        }

        // Check if the user has already created a restaurant
        
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
