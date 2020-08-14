import { Router } from "express";
import { getConnection } from "typeorm";
import User from "../../entities/User";
import bcrypt from "bcryptjs";

const router = Router();

type RegistrationData = {
  name: string;
  email: string;
  password: string;
};

router.post("/", async (req, res) => {
  const { name, email, password }: RegistrationData = req.body;
  try {
    if (!name || !email || !password) {
      throw new Error("Invalid body");
    }

    const isUserAvailable = await getConnection()
      .manager.findOne(User, { where: { email } })
      .then((response) => {
        return response ? false : true;
      });

    if (!isUserAvailable) {
      throw new Error("Email already registered");
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);

    const user = getConnection().manager.create(User, {
      name,
      email,
      password: hashedPassword,
    });
    await getConnection().manager.save(user);

    return res.json({
      success: true,
      message: "User successfully registered",
      userData: { name, email },
    });
  } catch (err) {
    console.log(`\u001b[93m`, err, `\u001b[0m`);
    return res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
