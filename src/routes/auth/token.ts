import { Router } from "express";
import * as jwt from "jsonwebtoken";
import { getConnection } from "typeorm";
import User from "../../entities/User";

const router = Router();

type TokenResult = {
  email: string;
  iat: number;
};

router.post("/", async (req, res) => {
  const { refreshToken }: { refreshToken: string } = req.body;
  try {
    if (!refreshToken) {
      throw new Error("Invalid body");
    }

    const user = await getConnection(process.env.NODE_ENV!).manager.findOne(
      User,
      {
        where: { refreshToken },
      }
    );

    if (!user) {
      res.sendStatus(403);
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err, user) => {
      if (err) return res.sendStatus(403);
      console.log(user);
      const accessToken = jwt.sign(
        { email: (user as TokenResult).email },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "60s" }
      );
      res.json({
        success: true,
        message: "Access token generated",
        accessToken,
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
