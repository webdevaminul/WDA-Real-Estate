import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.headers["authorization"]?.split(" ")[1];

  // If the token is not provided, return an error message
  if (!token) return res.status(401).json({ message: "Unauthorized, token required" });

  // Verify the token using the JWT secret
  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token expired or invalid" });

    // If the token is valid, attach the user information to the request
    req.user = user;
    next();
  });
};
