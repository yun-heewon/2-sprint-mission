import { Router } from "express";
import { Server as SocketIOServer } from "socket.io";
import { NotificationRepository } from "../repositories/notification";
import prisma from "../lib/prisma";
import { NotificationService } from "../services/notification";
import { NotificationController } from "../controllers/notificationController";
import passport from "../lib/passport/index";

const NotificationRouter = (io: SocketIOServer): Router => {
  const router = Router();

  const notificationRepository = new NotificationRepository(prisma);
  const notificationService = new NotificationService(
    io,
    notificationRepository
  );
  const notificationController = new NotificationController(
    notificationService
  );

  router.get(
    "/",
    passport.authenticate("access-token", { session: false }),
    notificationController.getNotifications
  );

  router.get(
    "/unread-noti-count",
    passport.authenticate("access-token", { session: false }),
    notificationController.getUnreadCount
  );

  router.patch(
    "/:notificationId",
    passport.authenticate("access-token", { session: false }),
    notificationController.markAsRead
  );
  return router;
};

export default NotificationRouter;
