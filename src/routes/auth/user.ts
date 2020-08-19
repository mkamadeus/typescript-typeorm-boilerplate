import { Router } from "express";
import { getConnection } from "typeorm";
import User from "../../entities/User";

const router = Router();

router.get("/", async (req, res) => {
  await getConnection(process.env.NODE_ENV!)
    .manager.find(User)
    .then((data) => {
      return res.json({
        success: true,
        message: "User fetching successful",
        data: data.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
        })),
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({ success: false, message: err.message });
    });
});

export default router;
