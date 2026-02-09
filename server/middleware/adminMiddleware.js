const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "unauthorized",
    });
  }

  const isAdmin = req.user.isAdmin === true || req.user.role === "admin";
  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: "forbidden",
    });
  }

  next();
};

export default adminMiddleware;

