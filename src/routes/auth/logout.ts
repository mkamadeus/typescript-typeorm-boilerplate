import { Router } from "express";
import { getConnection } from "typeorm";
import User from "../../entities/User";

const router = Router();

router.delete("/", async (req, res) => {
  await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ refreshToken: null })
    .execute()
    .then((_response) => {
      res.json({ success: true, message: "User logged out" });
    })
    .catch((err) => {
      res.status(404).json({ success: false, message: err.message });
    });
});

export default router;
