import jwt from "jsonwebtoken";

export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "authentication token required:" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "invalid token", err });
    }

    req.body.userId = decoded.user;
    next();
  });
}
