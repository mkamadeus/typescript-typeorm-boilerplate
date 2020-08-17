import { Router } from "express";
import auth from "./auth";
import path from "path";

const router = Router();

router.use("/auth", auth);
router.use("/docs", (req, res) => {
  return res.sendFile(path.join(__dirname, "../../docs/index.html"));
});

export default router;
