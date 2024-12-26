const authMiddleware = (req, res, next) => {
    
    res.locals.isAuthenticated = !!req.user; 
    next();
  };
  
  module.exports = authMiddleware;
  