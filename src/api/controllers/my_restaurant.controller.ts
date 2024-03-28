import Restaurant from "../../models/restaurant.model";
import User from "../../models/user.model";

export const createRestaurant = async (req, res, next) => {
  const user = req.user;
  const restaurant = await Restaurant.findOne({ owner: user.id });
  if (restaurant) {
    return res.status(400).json({
      message: "User has already created a restaurant",
    });
  }

  try {
    const {
      restaurantName,
      location,
      estimatedDeliveryTime,
      imageUrl,
      deliveryPrice,
      cuisines,
      menu,
    } = req.body;
    const ownerId = req.user.id;

    const restaurant = new Restaurant({
      restaurantName,
      location,
      owner: ownerId,
      estimatedDeliveryTime,
      imageUrl,
      deliveryPrice,
      cuisines,
      menu,
    });

    await restaurant.save();

    await User.findByIdAndUpdate(ownerId, { restaurantId: restaurant._id });

    return res.status(201).json({
      message: "Restaurant has been created successfully!",
      restaurant: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRestaurant = async (req, res, next) => {
  const userId = req.user.id;
  const { restaurantId } = req.params;

  if (!restaurantId) {
    return res.status(400).json({ message: "Restaurant ID is required" });
  }

  let restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  console.log(restaurant.owner,userId);

  if (restaurant.owner !== userId) {
    return res
      .status(403)
      .json({ message: "You're not allowed to update this restaurant" });
  }

  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      {
        $set: {
          restaurantName: req.body.restaurantName,
          location: req.body.location,
          estimatedDeliveryTime: req.body.estimatedDeliveryTime,
          imageUrl: req.body.imageUrl,
          deliveryPrice: req.body.deliveryPrice,
          cuisines: req.body.cuisines,
          menu: req.body.menu,
        },
      },
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(500).json({ message: "Failed to update restaurant" });
    }

    res
      .status(200)
      .json({
        message: "Restaurant updated successfully",
        restaurant: updatedRestaurant,
      });
  } catch (error) {
    next(error);
  }
};

export const getRestaurant = async(req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  
  if(!user.restaurantId) {
    return res.status(400).json({ message: 'User does not have a restaurant'});
  }
  try {
    const restaurant = await Restaurant.findOne({
      owner: user.id
    })

    if(!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found'});
    }

    res.json(restaurant);
  } catch (error) {
    next(error)
  }
}