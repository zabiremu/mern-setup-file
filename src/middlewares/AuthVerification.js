const { DecodeToken } = require("../utility/TokenHelper");

module.exports = (req, res, next) => {
  token = req.cookies["Token"];

  let decoded = DecodeToken(token);

  if (decoded === null) {
    return res.status(401).json({
      status: 401,
      message: "Invalid Token",
    });
  }
  req.headers.email = decoded.email; // Attach email to request headers
  next();
};
