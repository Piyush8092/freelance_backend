const jwt = require('jsonwebtoken');
 const userModel = require('../Model/userModel');
const authGuard = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No Token' });
    }

    // ✅ Decode token
    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY || 'me333enneffiimsqoqomcngfehdj3idss'
    );

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Unauthorized - Invalid Token' });
    }

    // ✅ Find user
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized - User Not Found' });
    }

    // ✅ Attach user to request
    req.user = user;

    // ✅ Move to next middleware
    next();
  } catch (e) {
    console.error('AuthGuard Error:', e.message);
    return res.status(401).json({ message: 'Unauthorized - Token Error' });
  }
};

module.exports = authGuard;
