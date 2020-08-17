import { Router } from "express";
import register from "./register";
import user from "./user";
import login from "./login";
import status from "./status";
import token from "./token";

const router = Router();

router.use("/register", register);
router.use("/user", user);
router.use("/login", login);
router.use("/token", token);
router.use("/status", status);

export default router;
