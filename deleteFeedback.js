import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const deleteFeedbacks = await prisma.feedback.deleteMany({});
  console.log(`${deleteFeedbacks.count} feedback entries deleted`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });