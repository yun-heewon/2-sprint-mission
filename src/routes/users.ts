import express, { Router } from "express";
const router = express.Router();
import passport from "../lib/passport/index";
import upload from "../lib/upload";
import { refreshTokens } from "../lib/token";
import { validateDto } from "../lib/validator";
import { CreateUserDto, PatchUserDto } from "../dtos/users.dto";
import { UserService } from "../services/userService";
import { UserController } from "../controllers/userController";
import { UserRepository } from "../repositories/userReporitory";
import prisma from "../lib/prisma";

const UserRouter = (): Router => {
  const router = Router();

  const userReporitory = new UserRepository(prisma);
  const userService = new UserService(userReporitory);
  const userController = new UserController(userService);

  router.get(
    "/me",
    passport.authenticate("access-token", { session: false }),
    userController.getUser
  );
  router.post(
    "/register",
    upload.single("image"),
    validateDto(CreateUserDto),
    userController.register
  );
  router.post(
    "/login",
    passport.authenticate("local", { session: false }),
    userController.login
  );
  router.post(
    "/refresh",
    passport.authenticate("refresh-token", { session: false }),
    refreshTokens
  );
  router.patch(
    "/me",
    passport.authenticate("access-token", { session: false }),
    validateDto(PatchUserDto),
    userController.patchUser
  );
  router.delete(
    "/:id",
    passport.authenticate("access-token", { session: false }),
    userController.deleteUser
  );
  router.post("/logout", userController.logout);

  return router;
};

export default UserRouter;
