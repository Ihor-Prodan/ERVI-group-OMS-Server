import { prisma } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import { sendOrderEmail } from "../config/mail.js";
import { AppError } from "../utils/appErrors.js";
// import { generateOrderPdfBuffer } from "../services/pdf.service.js";

export const createOrder = async (payload) => {
  const requiredFields = [
    "company",
    "fullname",
    "receiverStreet",
    "receiverPsc",
    "receiverCity",
    "receiverCountry",
    "receiverPhone",
    "receiverEmail",
    "products",
  ];

  const missingFields = requiredFields.filter((field) => {
    if (field === "products")
      return !payload.products || payload.products.length === 0;
    return !payload[field] || payload[field].toString().trim() === "";
  });

  if (missingFields.length > 0) {
    throw new AppError(
      `Chýbajú tieto povinné polia: ${missingFields.join(", ")}`,
      400
    );
  }

  const now = new Date();

  const generateOrderNumber = async () => {
    const lastOrder = await prisma.order.findFirst({
      orderBy: { deliveryNumber: "desc" },
    });

    const nextNumber = lastOrder
      ? parseInt(lastOrder.deliveryNumber, 10) + 1
      : 1;
    return nextNumber.toString().padStart(5, "0");
  };

  const COMPANY_OPTIONS = [
    { value: "1", label: "Miele s.r.o. (SK)" },
    { value: "5", label: "Miele spol. s.r.o. (CZ)" },
    { value: "2", label: "em-shop.sk" },
    { value: "3", label: "P & P Stanek s.r.o." },
    { value: "6", label: "Ine..." },
  ];

  const COUNTRY_OPTIONS = [
    { label: "Slovenská republika", value: "SK" },
    { label: "Česká republika", value: "CZ" },
  ];

  const company = COMPANY_OPTIONS.find((c) => c.value === payload.company);
  const country = COUNTRY_OPTIONS.find((c) => c.value === payload.country);
  const receiverCountry = COUNTRY_OPTIONS.find(
    (c) => c.value === payload.receiverCountry
  );

  const pickupDate =
    payload.pickupType === "asap"
      ? null
      : payload.pickupDate
      ? new Date(payload.pickupDate)
      : null;

  const createdOrder = await prisma.order.create({
    data: {
      id: uuidv4(),
      date: now,
      deliveryNumber: await generateOrderNumber(),
      status: "accepted",
      statusDates: {
        sent: null,
        accepted: now,
        cancelled: null,
        delivered: null,
        paid: null,
      },
      company: company?.label || "Ine...",
      street: payload.street || "",
      psc: payload.psc || "",
      city: payload.city || "",
      country: country.label || "-",
      email: payload.email || "",
      phone: payload.phone || "",
      pickupType: payload.pickupType || "",
      pickupDate: pickupDate,
      services: payload.services || [],
      gdpr: payload.gdpr || false,
      deliveryNote: payload.deliveryNote || "",
      contractNumber: payload.contractNumber || "",
      products: payload.products || [],
      weight: payload.weight || "0",
      from: payload.from || "",
      fullname: payload.fullname || "",
      receiverStreet: payload.receiverStreet || "",
      receiverPsc: payload.receiverPsc || "",
      receiverCity: payload.receiverCity || "",
      receiverCountry: receiverCountry.label || "-",
      receiverPhone: payload.receiverPhone || "",
      receiverEmail: payload.receiverEmail || "",
      to: payload.to || "",
      route: payload.receiverCountry || "-",
    },
  });

  console.log("✅ New order created:", createdOrder.id);

  const order = await prisma.order.findUnique({
    where: { id: createdOrder.id },
  });

  try {
    const formattedNow = now.toLocaleString("sk-SK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Bratislava",
    });

    await sendOrderEmail({
      to: process.env.USER_EMAIL,
      subject: `Nová objednávka - číslo ${order.deliveryNumber}`,
      text: `
        Dobrý deň,

        Bola prijatá nová objednávka číslo #${order.deliveryNumber}
        Prosím, skontrolujte jej detaily v systéme a pripravte ju na spracovanie.
        Zákazník: ${order.company || "Neznámy"}
        Dátum vytvorenia: ${formattedNow}
        Podrobnosti nájdete po prihlásení do administrácie:
        https://www.ervi-group.com/#/admin/accepted

        S pozdravom,
        Váš systém objednávok ERVI Group
      `.trim(),
    });

    await sendOrderEmail({
      to: order.email,
      subject: `Vaša objednávka bola úspešne prijatá - číslo #${order.deliveryNumber}`,
      text: `
        Dobrý deň,

        Vaša objednávka číslo DL ${order.contractNumber} bola úspešne prijatá dňa ${formattedNow}.
        Čoskoro vás budeme informovať o ďalšom stave objednávky.
        Sledovanie objednávky:
        https://www.ervi-group.com/#/tracking?number=${order.contractNumber}
        Tu môžete kedykoľvek skontrolovať aktuálny stav vašej objednávky pri pomoci čísla DL ${order.contractNumber}.
        (Ak máte viacero čísel DL, zadajte všetky čísla.)

        S pozdravom,
        ERVI Group
      `.trim(),
    });
  } catch (err) {
    console.error("Chyba pri odosielaní emailu o novej objednávke:", err);
  }

  return order;
};

export const getAllOrders = async () => {
  return await prisma.order.findMany({ orderBy: { date: "desc" } });
};

export const findOrderByTrackingNumber = async (input) => {
  const number = input.trim();

  return await prisma.order.findFirst({
    where: {
      contractNumber: {
        equals: number,
        mode: "insensitive",
      },
    },
  });
};

// export const findOrderByTrackingNumber = async (trackN) => {
//   console.log("Searching for order with tracking number:", trackN);

//   return await prisma.order.findFirst({ where: { deliveryNumber: trackN } });
// };

export const findOrderById = async (id) => {
  return await prisma.order.findUnique({ where: { id } });
};

export const updateOrderStatus = async (id, status, date = null) => {
  const updateTime = date ? new Date(date) : new Date();

  const existingOrder = await prisma.order.findUnique({ where: { id } });

  if (!existingOrder) return null;

  const prevStatusDates =
    typeof existingOrder.statusDates === "object" &&
    existingOrder.statusDates !== null
      ? existingOrder.statusDates
      : {};

  const updated = await prisma.order.update({
    where: { id },
    data: {
      status,
      statusDates: {
        ...prevStatusDates,
        [status]: updateTime,
      },
    },
  });

  console.log(`✅ Order ${id} status updated to ${status}`);

  try {
    if (status === "delivered") {
      const freshOrder = await prisma.order.findUnique({ where: { id } });
      const deliveredDateRaw = freshOrder.statusDates.delivered;

      const emailDeliveredDate = deliveredDateRaw
        ? new Date(deliveredDateRaw).toLocaleString("sk-SK", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Europe/Bratislava",
          })
        : "-";

      // let pdfBuffer = await generateOrderPdfBuffer(freshOrder);
      // let base64Pdf = Buffer.from(pdfBuffer).toString("base64");

      // console.log("Generated PDF buffer for order:", freshOrder.id);
      // console.log("PDF generation successful", pdfBuffer.length);

      await sendOrderEmail({
        to: freshOrder.receiverEmail,
        subject: `Vaša objednávka ${freshOrder.deliveryNumber} bola doručená`,
        text: `
          Dobrý deň,

          Vaša objednávka s číslom ${freshOrder.deliveryNumber} a číslom DL ${freshOrder.contractNumber} bola úspešne doručená dňa ${emailDeliveredDate}.

          S pozdravom,
          ERVI Group
        `.trim(),
        // attachments: [
        //   {
        //     filename: `objednavka-${freshOrder.deliveryNumber}.pdf`,
        //     content: base64Pdf,
        //   },
        // ],
      });

      await sendOrderEmail({
        to: freshOrder.email,
        subject: `Vaša objednávka ${freshOrder.deliveryNumber} bola doručená`,
        text: `
          Dobrý deň,

          Vaša objednávka s číslom ${freshOrder.deliveryNumber} a číslom DL ${freshOrder.contractNumber} bola úspešne doručená dňa ${emailDeliveredDate}.

          S pozdravom,
          ERVI Group
        `.trim(),
        // attachments: [
        //   {
        //     filename: `objednavka-${freshOrder.deliveryNumber}.pdf`,
        //     content: base64Pdf,
        //   },
        // ],
      });

      // pdfBuffer = null;
      // base64Pdf = null;
    }
  } catch (err) {
    console.error("Chyba pri odosielaní e-mailu:", err);
  }

  return updated;
};

export const deleteOrderById = async (id) => {
  console.log(`Deleting order with ID: ${id}`);

  return await prisma.order.delete({ where: { id } });
};

export const getAvailableTimeslots = async (companyId, date) => {
  if (!companyId || !date) {
    throw new Error("Spoločnosť a dátum sú povinné");
  }

  const COMPANY_OPTIONS = [
    { value: "1", label: "Miele s.r.o. (SK)" },
    { value: "5", label: "Miele spol. s.r.o. (CZ)" },
    { value: "2", label: "em-shop.sk" },
    { value: "3", label: "P & P Stanek s.r.o." },
    { value: "6", label: "Ine..." },
  ];

  const TIME_SLOTS = [
    { from: 9, to: 11 },
    { from: 11, to: 13 },
    { from: 13, to: 15 },
    { from: 15, to: 17 },
  ];

  const companyLabel = COMPANY_OPTIONS.find((c) => c.value === companyId)?.label;
  if (!companyLabel) {
    throw new Error("Neznáma spoločnosť");
  }

  const dayStart = new Date(date);
  if (isNaN(dayStart.getTime())) {
    throw new Error("Neplatný dátum");
  }
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const ACTIVE_STATUSES = ["accepted", "paid", "sent"];

  const existingOrders = await prisma.order.findMany({
    where: {
      company: companyLabel,
      status: { in: ACTIVE_STATUSES },
      pickupDate: {
        gte: dayStart,
        lt: dayEnd,
      },
    },
  });

  const takenSlots = existingOrders
    .map((order) => {
      const hour = new Date(order.pickupDate).getHours();
      return TIME_SLOTS.find((slot) => hour >= slot.from && hour < slot.to);
    })
    .filter(Boolean);

  return TIME_SLOTS.filter(
    (slot) =>
      !takenSlots.some(
        (taken) => taken.from === slot.from && taken.to === slot.to
      )
  );
};
