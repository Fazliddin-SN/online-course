export const authorizeRole = (...role) => {
  return (req, res, next) => {
    const { user } = req;
    console.log("user", user);
    console.log("user role", user.role);

    // `req.user` should be populated by `verifyToken`
    if (!user || !role.includes(user.role)) {
      return res.status(403).json({
        message:
          "Forbidden: Insufficient permissions. To execute this, you should be admin or coach",
      });
    }
    next(); // User has an allowed role, proceed
  };
};
