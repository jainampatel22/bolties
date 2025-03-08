// import type { json, NextFunction, Request,Response } from "express";
// import jwt from "jsonwebtoken"

// export function authMiddleware(req:Request,res:Response,next:NextFunction){
// const authHeader = req.headers.authorization

// const token = authHeader && authHeader.split(" ")[1]
// if(!token){
//      res.status(401).json({message:"unAuthorized"})
//      return
//     }
//     console.log("JWT_PUBLIC_KEY")
//     const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY, { algorithms: ["RS256"] }) as { sub?: string };

// if(!decoded){
//      res.status(401).json({message:"unAuthorized"})
//      return;
// }
// const userId = (decoded as any).sub
// if(!userId){
//      res.status(401).json({message:"unAuthorized"})
// return;
// }
// req.userId =userId
// next()
// }

import  type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import type { AuthenticatedRequest } from "./auth-types";
const client = jwksClient({
  jwksUri: "https://decent-ferret-38.clerk.accounts.dev/.well-known/jwks.json", // Replace this
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if(!token){
          res.status(401).json({message:"unAuthorized"})
          return
         }
  jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token", error: err.message });
    }
    if(!decoded){
          res.status(401).json({message:"unAuthorized"})
          return;
     }
    const userId = (decoded as any).sub
    if(!userId){
         res.status(401).json({message:"unAuthorized"})
    return;
    }
    req.userId = userId;
    next();
  });
}
