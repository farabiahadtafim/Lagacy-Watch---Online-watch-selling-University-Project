module.exports = (req, res, next) => {
  const allowedRoles = ['admin', 'administrator', 'manager'];
  if (req.user && req.user.role && allowedRoles.includes(req.user.role.toLowerCase())) {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};
