import { Router } from "express";
import * as orderCtrl from "../controllers/order.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", orderCtrl.createOrder);
router.get("/timeslots", orderCtrl.fetchTimeslots);
router.get("/:id", orderCtrl.getOrder);

router.get("/", requireAuth, orderCtrl.getOrders);
router.put("/:id/status", requireAuth, orderCtrl.changeStatus);
router.delete("/:id", requireAuth, orderCtrl.deleteOrder);
router.get("/:id/doc", requireAuth, orderCtrl.generateDoc);

export default router;
