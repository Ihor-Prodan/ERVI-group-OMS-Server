import * as orderService from "../services/order.service.js";
import { generateOrderPdfBuffer } from "../services/pdf.service.js";
import { getAvailableTimeslots } from "../services/order.service.js";

export const createOrder = async (req, res) => {
  try {
    const payload = req.body;

    const order = await orderService.createOrder(payload);

    res.status(201).json({
      message: `Objednávka bola úspešne vytvorená. Na vašu e-mailovú adresu ${payload.email} bolo odoslané potvrdenie.`,
      order,
    });
  } catch (err) {
    console.error("Failed to create order:", err);
    res.status(500).json({ message: err.message || "Nepodarilo sa vytvoriť objednávku" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();

    res.json(orders);
  } catch (err) {
    console.error(err);

    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.findOrderByTrackingNumber(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const responseData = {
      id: order.id,
      deliveryNumber: order.contractNumber,
      fullname: order.fullname,
      company: order.company,
      from: order.from,
      to: order.to,
      statusDates: order.statusDates,
    };

    res.json(responseData);
  } catch (err) {
    console.error("❌ Error in getOrder:", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, date } = req.body;

    const updated = await orderService.updateOrderStatus(id, status, date);
    if (!updated) return res.status(404).json({ message: "Order not found" });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await orderService.deleteOrderById(id);
    res.json({ message: "Objednávka bola úspešne vymazaná" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete order" });
  }
};

export const generateDoc = async (req, res) => {
  const { id } = req.params;

  const order = await orderService.findOrderById(id);
  console.log("Generating document for order:", order.deliveryNumber);

  if (!order) return res.status(404).json({ message: "Order not found" });

  try {
    const pdfBuffer = await generateOrderPdfBuffer(order);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=order-${order.contractNumber}.pdf`
    );

    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate document" });
  }
};

export const fetchTimeslots = async (req, res) => {
  try {
    const { company, date } = req.query;

    console.log("Fetching timeslots for company:", company, "on date:", date);

    if (!company || !date) {
      return res.status(400).json({ message: "Spoločnosť a dátum sú povinné" });
    }

    const availableSlots = await getAvailableTimeslots(company, date);

    res.json({ availableSlots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Nepodarilo sa načítať dostupné časové pásma" });
  }
};

