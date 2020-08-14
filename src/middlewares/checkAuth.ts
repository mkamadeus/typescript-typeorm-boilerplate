import { RequestHandler } from "express";
import * as jwt from "jsonwebtoken";
import { getConnection } from "typeorm";
import User from "../entities/User";

export const authenticateToken: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
