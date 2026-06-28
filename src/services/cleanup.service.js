import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const deleteDeliveredOldOrders = async () => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  // Fetch only orders that have a delivered date
  const candidates = await prisma.order.findMany({
    where: {
      statusDates: { not: undefined },
    },
    select: { id: true, statusDates: true, deliveryNumber: true },
  });

  const toDelete = candidates.filter((order) => {
    const dates = order.statusDates;
    if (!dates || typeof dates !== "object") return false;
    const delivered = dates.delivered;
    if (!delivered) return false; // not yet delivered — skip
    return new Date(delivered) < threeMonthsAgo;
  });

  if (toDelete.length === 0) {
    console.log("[cleanup] No orders to delete.");
    return;
  }

  const ids = toDelete.map((o) => o.id);
  const nums = toDelete.map((o) => o.deliveryNumber).join(", ");

  await prisma.order.deleteMany({ where: { id: { in: ids } } });

  console.log(`[cleanup] Deleted ${ids.length} order(s) delivered before ${threeMonthsAgo.toLocaleDateString("sk-SK")}: ${nums}`);
};
