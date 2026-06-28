import { Router } from "express";
import multer from "multer";
import * as documentCtrl from "../controllers/document.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { verifyCsrf } from "../utils/csrf.js";
import { AppError } from "../utils/appErrors.js";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new AppError("Unsupported file type", 400));
    }
    cb(null, true);
  },
});

const router = Router();

router.get("/", requireAuth, documentCtrl.getDocuments);
router.post("/upload", requireAuth, verifyCsrf, upload.single("file"), documentCtrl.uploadFile);
router.post("/", requireAuth, verifyCsrf, documentCtrl.createDocument);
router.delete("/:id", requireAuth, verifyCsrf, documentCtrl.deleteDocument);
router.patch("/:id/paid", requireAuth, verifyCsrf, documentCtrl.togglePaid);

export default router;
