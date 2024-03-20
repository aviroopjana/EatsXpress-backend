import User from "../../models/user.model";

export const updateUser = async(req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return res.status(500).json({
            message: "You're not allowed to update this user"
        });
    }

    if (req.body.username) {
        if (req.body.username.length <7 || req.body.username.length>20) {
            return res.status(502).json({
                message: 'Username length must be between 7 and 20 characters'
            });
        }
        if (req.body.username.includes(' ')) {
            return res.status(503).json({
                message: "Username can't contain empty spaces"
            });
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return res.status(504).json({
                message: "Username must be in lower case"
            });
        }
        if (!req.body.username.match(/^[a-zA-Z0-9_]+$/)) {
            return res.status(505).json({
                message: "Username can only contain letters, numbers, and underscores"
            });
        }
    }

    try {
        const updateUser: any = await User.findByIdAndUpdate(req.params.userId,{
            $set: {
                username: req.body.username,
                name: req.body.name,
                email: req.body.email,
                accountType: req.body.accountType,
                profilePicture: req.body.profilePicture,
                phone: req.body.phone,
                address: req.body.address,
                city: req.body.city,
                pincode: req.body.pincode
            }
        }, {new: true});
        const {password, ...rest} = updateUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}

export const signout = (req, res, next) => {
    try {
        res
        .clearCookie("access_token")
        .status(200)
        .json({ message: "User signed out successfully" });
    } catch (err) {
        next(err);
    }
}