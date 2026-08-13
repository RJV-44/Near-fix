const { Notification, User } = require("../models");

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
      limit: 50,
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.count({
      where: { userId: req.user.id, isRead: false },
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    await notification.update({ isRead: true });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id, isRead: false } },
    );
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, relatedId, relatedModel } = req.body;
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      relatedId,
      relatedModel,
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Name, email, and message are required" });
    }

    const admin = await User.findOne({ where: { role: "admin" } });
    const notification = await Notification.create({
      userId: admin ? admin.id : null,
      title: `Contact: ${subject || "General enquiry"}`,
      message: `From: ${name} (${email})\n\n${message}`,
      type: "system",
    });

    res.status(201).json({
      message: "Message sent successfully",
      notification,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createNotification,
  createContactMessage,
};
