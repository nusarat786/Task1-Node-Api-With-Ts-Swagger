import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  adminId: string;
  name: string;
}

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    res.status(401).json({ error: true, message: "Unauthorized: Missing authorization header" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: true, message: "Unauthorized: Missing token" });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "") as JwtPayload;
    req.user = payload; 
    next();
  } catch (err) {
    //console.error("Token verification error:", err);
    res.status(401).json({ error: true, message: "Unauthorized: Invalid token" });
  }
};

export default authMiddleware;
