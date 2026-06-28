import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as orderCtrl from "../controllers/order.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { verifyCsrf } from "../utils/csrf.js";

const trackingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});

const router = Router();

router.post("/", orderCtrl.createOrder);
router.get("/timeslots", orderCtrl.fetchTimeslots);
router.get("/:id", trackingLimiter, orderCtrl.getOrder);

router.get("/", requireAuth, orderCtrl.getOrders);
router.put("/:id/status", requireAuth, verifyCsrf, orderCtrl.changeStatus);
router.delete("/:id", requireAuth, verifyCsrf, orderCtrl.deleteOrder);
router.get("/:id/doc", requireAuth, orderCtrl.generateDoc);

export default router;
