const dotenv = require("dotenv");
dotenv.config();

const { User } = require("./models");
const { sequelize } = require("./config/db");

const seedUsers = async () => {
  try {
    await sequelize.sync();

    const adminEmail = String(process.env.ADMIN_EMAIL || "admin@example.com")
      .trim()
      .toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    if (adminPassword.length < 8) {
      throw new Error("ADMIN_PASSWORD must be at least 8 characters long");
    }

    const defaults = [
      {
        name: "Admin User",
        email: adminEmail,
        password: adminPassword,
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
    ];

    const created = [];
    for (const item of defaults) {
      const existing = await User.findOne({ where: { email: item.email } });
      if (!existing) {
        await User.create(item);
        created.push(item.email);
      } else if (item.role === "admin") {
        await existing.update({
          ...item,
          isActive: true,
        });
        created.push(item.email);
      }
    }

    if (created.length === 0) {
      console.log("Default users already exist; no seed changes needed.");
    } else {
      console.log("Admin account configured and missing demo users seeded:", created.join(", "));
    }

    console.log(`  Admin email: ${adminEmail}`);
    console.log("  Admin password: configured (not displayed)");
    console.log("  Customer: customer@example.com / customer123");
    console.log("  Provider: provider@example.com / provider123");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
}

seedUsers();