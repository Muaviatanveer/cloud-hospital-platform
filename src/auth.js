// Role-based access control for the cloud-based hospital platform
const express = require('express');
const router = express.Router();

// Dummy middleware to check user role
function checkRole(role) {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).send({ message: 'Access denied' });
    }
  };
}

// Protected route for admin users
router.get('/admin-dashboard', checkRole('admin'), (req, res) => {
  res.send({ message: 'Admin dashboard' });
});

module.exports = router;