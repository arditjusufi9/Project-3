// middleware/isAdmin.js
const isAdmin = (req, res, next) => {
    // Assuming you have the user's role attached to the request object after authentication
    const { role } = req.user;
  
    if (role === 'ADMIN') {
      next(); // User is an admin, proceed to the next middleware or route handler
    } else {
      return res.status(403).json({ error: 'Unauthorized' }); // User is not an admin, send a forbidden error
    }
  };
  
  module.exports = isAdmin;
  