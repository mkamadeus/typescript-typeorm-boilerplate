import { Router } from "express";
import { getConnection } from "typeorm";
import * as jwt from "jsonwebtoken";
import bcyrpt from "bcryptjs";
import User from "../../entities/User";

const router = Router();

type LoginData = {
  email: string;
  password: string;
};

router.post("/", async (req, res) => {
  const { email, password }: LoginData = req.body;
  try {
    if (!email || !password) {
      throw new Error("Invalid body");
    }

    const user = await getConnection(process.env.NODE_ENV!).manager.findOne(
      User,
      {
        where: { email },
      }
    );

    if (!user) {
      throw new Error("User is not registered");
    }

    if (!bcyrpt.compareSync(password, user.password)) {
      throw new Error("Incorrect password");
    }

    const refreshToken = jwt.sign(
      { email },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "60s",
      }
    );
    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "60s",
    });

    await getConnection(process.env.NODE_ENV!)
      .createQueryBuilder()
      .update(User)
      .set({ refreshToken })
      .where("id = :id", { id: user.id })
      .execute();
    // .update(User, { id: user.id }, { refreshToken })
    // .then(async (updatedUser) => {
    //   await manager.save(updatedUser);
    // });

    return res.json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.log(`\u001b[93m`, err, `\u001b[0m`);
    return res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
