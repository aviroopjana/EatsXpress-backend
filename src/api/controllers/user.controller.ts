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