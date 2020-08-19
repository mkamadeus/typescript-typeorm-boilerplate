import { Router } from "express";
import auth from "./auth";
import path from "path";

const router = Router();

router.use("/auth", auth);

export default router;
