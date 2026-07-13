const dotenv = require('dotenv');
dotenv.config();

const { User } = require("./models");
const { sequelize } = require("./config/db");


const seedUsers = async () => {
  try {
    await sequelize.sync();

    const count = await User.count();
    if (count > 0) {
      console.log("Users already exist, skipping seed.");
      process.exit(0);
    }

    await User.bulkCreate([
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
        phone: "1234567890",
      },
      {
        name: "John Customer",
        email: "customer@example.com",
        password: "customer123",
        role: "customer",
        phone: "1234567891",
      },
      {
        name: "Jane Provider",
        email: "provider@example.com",
        password: "provider123",
        role: "provider",
        phone: "1234567892",
        businessName: "Jane's Services",
        serviceCategory: "Cleaning",
        yearsOfExperience: "5",
      },
    ]);

    console.log("Test users seeded successfully!");
    console.log("  Admin:    admin@example.com / admin123");
    console.log("  Customer: customer@example.com / customer123");
    console.log("  Provider: provider@example.com / provider123");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedUsers();
