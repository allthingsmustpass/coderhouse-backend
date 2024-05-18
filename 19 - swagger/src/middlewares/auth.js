// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.redirect("/login");
  }
};

export default authMiddleware;
