import { prisma } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const getAllDocuments = async () =>
  prisma.document.findMany({ orderBy: { createdAt: "desc" } });

export const createDocument = async (data) => {
  return prisma.document.create({
    data: {
      id: uuidv4(),
      name: data.name,
      fileUrl: data.fileUrl,
      fileName: data.fileName,
      fileSize: data.fileSize ?? null,
      fileType: data.fileType ?? null,
      sumWithDph: Number(data.sumWithDph),
      sumWithoutDph: Number(data.sumWithoutDph),
      dphRate: data.dphRate !== undefined ? Number(data.dphRate) : 20,
      date: new Date(data.date),
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      isPaid: data.isPaid ?? false,
      note: data.note ?? null,
    },
  });
};

export const deleteDocument = async (id) => {
  return prisma.document.delete({ where: { id } });
};

export const setDocumentPaid = async (id, isPaid) => {
  return prisma.document.update({ where: { id }, data: { isPaid } });
};
