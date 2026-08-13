const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Notification = sequelize.define(
  "Notification",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    title: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    type: {
      type: DataTypes.ENUM(
        "booking",
        "payment",
        "review",
        "system",
        "promotion",
      ),
      defaultValue: "system",
    },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    relatedId: { type: DataTypes.INTEGER },
    relatedModel: { type: DataTypes.STRING },
  },
  { timestamps: true },
);

module.exports = Notification;
