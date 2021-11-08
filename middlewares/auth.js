const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // const token = req.cookies.auth;
  const token = req.cookies.auth || req.query.auth || req.headers["x-access-token"];
  console.log(token)
  //* check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.api_secret_key, (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.json({
          message: err,
          path: "/login",
        });
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.json({
      path: "/login",
    });
  }
};
