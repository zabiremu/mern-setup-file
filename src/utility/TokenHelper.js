const jwt = require("jsonwebtoken");

exports.EncodeToken = (email) => {
  let key = process.env.JWT_KEY;
  let expire = process.env.JWT_EXPIRE_TIME;
  let payload = { email };
  return jwt.sign(payload, key, { expiresIn: expire });
};

exports.DecodeToken = (token) => {
  try {
    const key = process.env.JWT_KEY;
    const decoded = jwt.verify(token, key);

    if (decoded && decoded.email) {
      return decoded; // Return the decoded data
    } else {
      return null; // If the token doesn't contain email, return null
    }
  } catch (err) {
    console.error("Token verification error:", err);
    return null; // Return null if the token is invalid or verification fails
  }
};
