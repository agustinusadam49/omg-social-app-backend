const jwt = require("jsonwebtoken");

// Fungsi ini digunakan pada api login dan register user
function generateToken(userPayload) {
  const token = jwt.sign(userPayload, process.env.SECRET);
  return token;
}

// Fungsi ini digunakan pada middlewares authentication
function verifyToken(userToken) {
  return userToken ? jwt.verify(userToken, process.env.SECRET) : undefined;
}

module.exports = {
  generateToken,
  verifyToken,
};
