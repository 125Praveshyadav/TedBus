const verifyUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Please login to continue",
    });
  }

  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Account is not verified ! Only verified users can perform this action",
    });
  }

  next();
};

module.exports = verifyUser;