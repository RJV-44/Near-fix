const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  toggleUserStatus,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", protect, authorize("admin"), getUsers);
router.get("/:id", protect, authorize("admin"), getUserById);
router.put("/:id", protect, authorize("admin"), updateUser);
router.put("/:id/toggle-status", protect, authorize("admin"), toggleUserStatus);

module.exports = router;
