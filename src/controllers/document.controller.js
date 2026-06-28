import path from "path";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "../config/r2.js";
import * as documentService from "../services/document.service.js";

export const getDocuments = async (req, res) => {
  try {
    const docs = await documentService.getAllDocuments();
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const ext = path.extname(req.file.originalname);
    const key = `documents/${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;

    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ContentDisposition: "inline",
      })
    );

    res.json({
      fileUrl: `${R2_PUBLIC_URL}/${key}`,
      fileName: req.file.originalname,
      fileSize: `${(req.file.size / 1024).toFixed(1)} KB`,
      fileType: req.file.mimetype,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload file" });
  }
};

export const createDocument = async (req, res) => {
  try {
    const doc = await documentService.createDocument(req.body);
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create document" });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await documentService.deleteDocument(id);

    if (doc.fileUrl?.startsWith(R2_PUBLIC_URL)) {
      const key = doc.fileUrl.replace(`${R2_PUBLIC_URL}/`, "");
      await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key })).catch(() => {});
    }

    res.json({ message: "Document deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete document" });
  }
};

export const togglePaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPaid } = req.body;
    const updated = await documentService.setDocumentPaid(id, isPaid);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update document" });
  }
};
