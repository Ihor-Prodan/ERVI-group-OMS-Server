import { prisma } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import { sendOrderEmail } from "../config/mail.js";
import { generateOrderPdfBuffer } from "../services/pdf.service.js";

export const createOrder = async (payload) => {
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

  const getRouteFromCountry = (country) => {
    if (!country) return "SK";

    const map = {
      slovensko: "SK",
      slovakia: "SK",
      slovenskarepublika: "SK",
      cesko: "CZ",
      česko: "CZ",
      ceskarepublika: "CZ",
      czechia: "CZ",
      poland: "PL",
      austria: "AT",
      hungary: "HU",
      germany: "DE",
      ukraine: "UA",
    };

    const normalized = country.trim().toLowerCase();
    return map[normalized] || "SK";
  };

  const COMPANY_OPTIONS = [
    { value: "1", label: "Miele s.r.o. (SK)" },
    { value: "5", label: "Miele spol. s.r.o. (CZ)" },
    { value: "2", label: "em-shop.sk" },
    { value: "3", label: "P & P Stanek s.r.o." },
    { value: "6", label: "Ine..." },
  ];

  const company = COMPANY_OPTIONS.find((c) => c.value === payload.company);

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
      country: payload.country || "",
      email: payload.email || "",
      phone: payload.phone || "",
      pickupType: payload.pickupType || null,
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
      receiverCountry: payload.receiverCountry || "",
      receiverPhone: payload.receiverPhone || "",
      receiverEmail: payload.receiverEmail || "",
      to: payload.to || "",
      route: getRouteFromCountry(payload.receiverCountry),
    },
  });

  const order = await prisma.order.findUnique({
    where: { id: createdOrder.id },
  });

  try {
    await sendOrderEmail({
      to: process.env.USER_EMAIL,
      subject: `Nová objednávka - číslo ${order.deliveryNumber}`,
      text: `
        Dobrý deň,
        Bola prijatá nová objednávka číslo #${order.deliveryNumber}
        Prosím, skontrolujte jej detaily v systéme a pripravte ju na spracovanie.
        Zákazník: ${order.company || "Neznámy"}
        Dátum vytvorenia: ${now.toLocaleDateString("sk-SK")}
        Podrobnosti nájdete po prihlásení do administrácie:
        https://www.ervi-group.com/#/admin/new
        Váš systém objednávok ERVI Group
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

export const findOrderByTrackingNumber = async (trackN) => {
  return await prisma.order.findFirst({ where: { deliveryNumber: trackN } });
};

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

  let newEmail = "";

  if (existingOrder.company === "Miele spol. s.r.o. (CZ)") {
    newEmail = "obchod@miele.cz";
  } else if (existingOrder.company === "Miele s.r.o. (SK)") {
    newEmail = "obchod@miele.sk";
  } else {
    newEmail = existingOrder.email;
  }

  try {
    if (status === "sent") {
      await sendOrderEmail({
        to: newEmail,
        subject: `Vaša objednávka ${existingOrder.deliveryNumber} bude odoslaná`,
        text: `
            Dobrý deň,

            Vaša objednávka číslo ${existingOrder.deliveryNumber}
            bude odoslaná dňa ${updateTime.toLocaleDateString("sk-SK")}.
            Aktuálny stav objednávky môžete sledovať tu:
            https://www.ervi-group.com/#/tracking?number=${
              existingOrder.deliveryNumber
            } alebo na našej webovej stránke, zadaním čísla objednávky.
        `.trim(),
      });
    }

    if (status === "delivered") {
      const pdfBuffer = await generateOrderPdfBuffer(existingOrder);
      const base64Pdf = Buffer.from(pdfBuffer).toString("base64");

      await sendOrderEmail({
        to: existingOrder.receiverEmail,
        subject: `Vaša objednávka ${existingOrder.deliveryNumber} bola doručená`,
        text: `
          Dobrý deň,

          Vaša objednávka s číslom ${existingOrder.deliveryNumber}
          bola úspešne doručená dňa ${
            updateTime.toLocaleDateString("sk-SK") || "-"
          }.
          V prílohe nájdete dokument k objednávke vo formáte PDF.

        `.trim(),
        attachments: [
          {
            filename: `objednavka-${existingOrder.deliveryNumber}.pdf`,
            content: base64Pdf,
          },
        ],
      });

      await sendOrderEmail({
        to: newEmail,
        subject: `Vaša objednávka ${existingOrder.deliveryNumber} bola doručená`,
        text: `
          Dobrý deň,

          Vaša objednávka s číslom ${existingOrder.deliveryNumber}
          bola úspešne doručená dňa ${
            updateTime.toLocaleDateString("sk-SK") || "-"
          }.
          V prílohe nájdete dokument k objednávke vo formáte PDF.

        `.trim(),
        attachments: [
          {
            filename: `objednavka-${existingOrder.deliveryNumber}.pdf`,
            content: base64Pdf,
          },
        ],
      });
    }
  } catch (err) {
    console.error("Chyba pri odosielaní e-mailu:", err);
  }

  return updated;
};

export const deleteOrderById = async (id) => {
  return await prisma.order.delete({ where: { id } });
};
