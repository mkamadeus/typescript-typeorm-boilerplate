import { Router } from "express";
import { authenticateToken } from "../../middlewares/checkAuth";

const router = Router();

router.get("/", authenticateToken, (req, res) => {
  console.log(req.user);
  return res.json({
    success: true,
    message: "User is logged in",
    user: req.user,
  });
});

export default router;
