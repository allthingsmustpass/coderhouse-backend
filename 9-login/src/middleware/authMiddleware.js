const authMiddleware  = (req, res, next) => {
    console.log("Session:", req.session);
    if (req.session?.user) {
      return next();
    }
    return res.redirect("/login");
  };
  
  module.exports = authMiddleware;