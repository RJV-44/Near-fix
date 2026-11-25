const express = require("express");
const router = express.Router();
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createNotification,
} = require("../controllers/notificationController");
const { createContactMessage } = require("../controllers/contactMessageController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", protect, getNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.post("/contact", createContactMessage);
router.post("/", protect, authorize("admin"), createNotification);
router.put("/:id/read", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);

module.exports = router;
