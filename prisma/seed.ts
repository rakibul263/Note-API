import bcrypt from "bcrypt";
import prisma from "../src/config/prisma";

async function main() {
  const password = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@shuvo.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@shuvo.com",
      password,
      role: "ADMIN",
    },
  });

  console.log("Admin user seeded: admin@shuvo.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });