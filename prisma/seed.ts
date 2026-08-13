import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin12345";
  const name = process.env.SEED_ADMIN_NAME ?? "Admin";

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "SUPER_ADMIN" },
    create: { email, name, passwordHash, role: "SUPER_ADMIN" },
  });

  console.log(`Seeded admin user: ${user.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
