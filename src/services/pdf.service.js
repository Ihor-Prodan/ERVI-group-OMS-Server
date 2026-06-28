import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = path.join(__dirname, "../fonts");

const FONT = {
  regular: path.join(FONTS_DIR, "DejaVuSans.ttf"),
  bold: path.join(FONTS_DIR, "DejaVuSans-Bold.ttf"),
  italic: path.join(FONTS_DIR, "DejaVuSans-Oblique.ttf"),
};

const LOGO_PATHS = [
  "M0 570 l0 -570 410 0 410 0 0 38 c0 20 -3 67 -7 105 l-6 67 -298 0 -299 0 0 115 0 115 70 0 70 0 0 105 0 105 -70 0 -70 0 0 140 0 140 300 0 300 0 0 105 0 105 -405 0 -405 0 0 -570z",
  "M1366 1106 c-4 -20 -6 -88 -5 -151 l1 -115 129 0 129 0 0 49 0 50 45 6 c24 4 95 5 157 3 179 -6 238 -47 238 -165 0 -106 -55 -152 -196 -161 l-84 -5 0 -83 c0 -60 4 -84 13 -85 103 -5 180 -18 199 -35 37 -33 58 -97 68 -211 6 -59 15 -129 21 -155 l11 -48 124 0 c68 0 124 2 124 3 0 2 -9 39 -20 82 -11 43 -20 104 -20 135 0 156 -44 257 -134 302 l-29 15 39 28 c108 79 134 129 134 257 0 139 -76 249 -200 290 -60 20 -90 22 -401 26 l-336 4 -7 -36z",
  "M2843 1128 c2 -7 85 -264 183 -570 l179 -558 140 0 141 0 187 562 c103 310 187 567 187 571 0 4 -57 6 -127 5 l-127 -3 -85 -265 c-48 -146 -103 -320 -125 -388 -21 -67 -43 -122 -47 -122 -5 0 -9 5 -9 11 0 6 -55 181 -122 390 l-123 379 -128 0 c-99 0 -128 -3 -124 -12z",
  "M4405 688 c-3 -249 -5 -505 -3 -568 l3 -115 128 -3 127 -3 0 571 0 570 -124 0 -124 0 -7 -452z",
  "M469 636 c-64 -21 -81 -115 -30 -167 25 -24 38 -29 78 -29 67 0 93 20 93 71 l0 39 -45 0 c-33 0 -45 -4 -45 -15 0 -9 9 -15 25 -15 30 0 34 -25 6 -40 -69 -36 -131 42 -85 108 18 26 69 30 95 6 25 -23 55 -6 36 20 -18 24 -86 36 -128 22z",
  "M1058 640 c-58 -11 -86 -59 -74 -125 9 -47 47 -75 103 -75 36 0 50 6 75 30 28 28 30 35 26 81 -3 28 -12 57 -20 65 -19 19 -75 32 -110 24z m76 -52 c34 -48 6 -118 -46 -118 -29 0 -42 9 -57 37 -26 51 0 103 54 103 24 0 39 -7 49 -22z",
  "M710 540 c0 -93 1 -100 20 -100 17 0 20 7 20 39 0 22 4 43 10 46 15 9 45 -11 71 -49 18 -27 31 -36 53 -36 l28 0 -36 44 -36 44 25 16 c30 20 33 56 7 79 -14 13 -38 17 -90 17 l-72 0 0 -100z m127 59 c22 -22 2 -39 -43 -39 -40 0 -44 2 -44 25 0 22 4 25 38 25 21 0 43 -5 49 -11z",
  "M1282 559 c4 -96 22 -119 92 -119 67 0 86 27 86 123 0 75 -1 77 -25 77 -25 0 -25 -1 -25 -80 0 -77 -1 -80 -26 -86 -43 -11 -57 14 -55 95 2 71 2 71 -25 71 l-26 0 4 -81z",
  "M1560 540 c0 -93 1 -100 20 -100 17 0 20 7 20 40 l0 40 45 0 c52 0 85 25 85 64 0 38 -35 56 -107 56 l-63 0 0 -100z m120 55 c19 -22 -5 -45 -46 -45 -31 0 -34 3 -34 30 0 27 3 30 34 30 18 0 39 -7 46 -15z",
  "M1388 252 c-16 -3 -18 -17 -18 -128 l0 -124 125 0 126 0 -3 128 -3 127 -105 0 c-58 1 -113 -1 -122 -3z",
];

export const generateOrderPdfBuffer = (order) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 0, autoFirstPage: true });

    doc.registerFont("Regular", FONT.regular);
    doc.registerFont("Bold", FONT.bold);
    doc.registerFont("Italic", FONT.italic);

    const chunks = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const M = 15;
    const PW = doc.page.width;
    const PH = doc.page.height;
    const W = PW - M * 2;

    // ─── LOGO ────────────────────────────────────────────────────────────────
    const LOGO_W = 110, LOGO_H = 25;
    const LOGO_X = M, LOGO_Y = M;

    doc.save();
    doc.transform(
      0.1 * LOGO_W / 466, 0,
      0, -0.1 * LOGO_H / 114,
      LOGO_X, LOGO_Y + LOGO_H
    );
    LOGO_PATHS.forEach((p) => doc.path(p).fill("#000000"));
    doc.restore();

    // PO box (CZ only)
    if (order.company === "Miele spol. s.r.o. (CZ)") {
      doc.rect(LOGO_X, LOGO_Y + LOGO_H + 4, 70, 16).lineWidth(1.5).stroke("#000");
      doc.font("Bold").fontSize(7).fillColor("#000")
        .text("PO: 4522621163", LOGO_X + 1, LOGO_Y + LOGO_H + 8, { width: 68, align: "center" });
    }

    // ─── DOC INFO (top right) ────────────────────────────────────────────────
    const INFO_W = 175;
    const INFO_X = M + W - INFO_W;
    let infoY = LOGO_Y + 4;

    const infoLine = (label, value) => {
      const labelW = doc.font("Regular").fontSize(9).widthOfString(label);
      const valueW = INFO_W - labelW;
      doc.font("Regular").fontSize(9).fillColor("#000")
        .text(label, INFO_X, infoY, { width: INFO_W, lineBreak: false });
      doc.font("Bold").fontSize(9)
        .text(String(value ?? "-"), INFO_X + labelW, infoY, { width: Math.max(valueW, 1), lineBreak: false });
      infoY += 13;
    };

    infoLine("Dátum dodania: ", new Date(order.date).toLocaleDateString("sk-SK"));
    infoLine("Číslo zásielky: ", order.deliveryNumber);
    infoLine("Číslo DL: ", order.contractNumber);

    // ─── HEADER DIVIDER ─────────────────────────────────────────────────────
    // infoY is now 19+13+13+13=58; divider must clear the last info line
    const HEADER_BOTTOM = Math.max(
      LOGO_Y + LOGO_H + (order.company === "Miele spol. s.r.o. (CZ)" ? 24 : 6),
      infoY + 4
    );
    doc.moveTo(M, HEADER_BOTTOM).lineTo(M + W, HEADER_BOTTOM).lineWidth(0.5).stroke("#000");

    // ─── TITLE ──────────────────────────────────────────────────────────────
    let y = HEADER_BOTTOM + 7;
    doc.font("Bold").fontSize(13).fillColor("#333")
      .text("DODACÍ LIST", M, y, { width: W, align: "center", lineBreak: false });
    y += 20;

    // ─── TABLE: termín / trasa / hmotnosť ───────────────────────────────────
    const COL_W = W / 3;
    const ROW_H = 18;

    const sentDate = order.statusDates?.sent
      ? new Date(order.statusDates.sent).toLocaleString("sk-SK", {
          timeZone: "Europe/Bratislava",
          day: "2-digit", month: "2-digit", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        })
      : "-";

    const t1Headers = ["Termín dodania", "Trasa", "Hmotnosť"];
    const t1Values = [sentDate, order.route || "SK", `${order.weight || 0} kg`];

    t1Headers.forEach((h, i) => {
      doc.rect(M + i * COL_W, y, COL_W, ROW_H).fillAndStroke("#f2f2f2", "#000");
      doc.font("Bold").fontSize(9).fillColor("#000")
        .text(h, M + i * COL_W + 2, y + 5, { width: COL_W - 4, align: "center", lineBreak: false });
    });
    t1Values.forEach((v, i) => {
      doc.rect(M + i * COL_W, y + ROW_H, COL_W, ROW_H).lineWidth(0.5).stroke("#000");
      doc.font("Regular").fontSize(9).fillColor("#000")
        .text(v, M + i * COL_W + 2, y + ROW_H + 5, { width: COL_W - 4, align: "center", lineBreak: false });
    });
    y += ROW_H * 2 + 18;

    // ─── ADDRESS SECTIONS ────────────────────────────────────────────────────
    const HALF_W = (W - 16) / 2;

    const drawAddress = (title, lines, x, startY) => {
      let ay = startY;
      doc.font("Bold").fontSize(8).fillColor("#333")
        .text(title, x, ay, { width: HALF_W, lineBreak: false });
      ay += 11;
      doc.moveTo(x, ay).lineTo(x + HALF_W, ay).lineWidth(0.5).stroke("#000");
      ay += 4;
      lines.forEach((line, idx) => {
        doc.font(idx === 0 ? "Bold" : "Regular").fontSize(9).fillColor("#000")
          .text(line, x, ay, { width: HALF_W, lineBreak: false });
        ay += 12;
      });
      return ay;
    };

    const leftBottom = drawAddress("OBJEDNÁVATEĽ", [
      order.company,
      order.street || "-",
      `${order.psc || "-"} ${order.city}`,
      order.country || "-",
      `Email: ${order.email}`,
      `Tel: ${order.phone}`,
    ], M, y);

    const rightBottom = drawAddress("PRÍJEMCA", [
      order.fullname || "-",
      order.receiverStreet || "-",
      `${order.receiverPsc || "-"} ${order.receiverCity || "-"}`,
      order.receiverCountry || "-",
      `Email: ${order.receiverEmail || "-"}`,
      `Tel: ${order.receiverPhone || "-"}`,
    ], M + HALF_W + 16, y);

    y = Math.max(leftBottom, rightBottom) + 10;

    // ─── NOTE ────────────────────────────────────────────────────────────────
    if (order.deliveryNote) {
      const noteH = 22;
      doc.rect(M, y, W, noteH).fillAndStroke("#f9f9f9", "#f9f9f9");
      doc.moveTo(M, y).lineTo(M, y + noteH).lineWidth(2.5).stroke("#000");
      doc.lineWidth(0.5);
      doc.font("Regular").fontSize(9).fillColor("#000")
        .text(`Poznámka: ${order.deliveryNote}`, M + 8, y + 7, { width: W - 12, lineBreak: false });
      y += noteH + 10;
    }

    // ─── HELPERS ─────────────────────────────────────────────────────────────
    const FOOTER_H = 52;
    const SIG_H = 40;
    const MAX_Y = PH - FOOTER_H - SIG_H; // content must stay above this

    const drawFooter = () => {
      const FY = PH - FOOTER_H;
      doc.moveTo(M, FY).lineTo(M + W, FY).lineWidth(0.5).stroke("#000");
      doc.rect(M, FY + 8, 7, 30).fill("#585756");
      const FX = M + 18;
      doc.font("Bold").fontSize(7).fillColor("#000")
        .text("ERVI Group s.r.o.", FX, FY + 10, { lineBreak: false });
      const ervW = doc.font("Bold").fontSize(7).widthOfString("ERVI Group s.r.o.");
      doc.font("Regular").fontSize(7)
        .text(
          "  Trnavská cesta 18263/112A, 821 01 Bratislava  |  Tel. +421 911 640 665  |  info@ervi-group.com  |  www.ervi-group.com",
          FX + ervW,
          FY + 10, { lineBreak: false }
        );
      doc.font("Regular").fontSize(7)
        .text(
          "IČO: 56829175  |  IČ DPH: SK2122463442  |  OR MS Bratislava, oddiel s.r.o., vložka č. 186048/B",
          FX, FY + 24, { width: W - 18, lineBreak: false }
        );
    };

    const drawSignature = () => {
      const SIG_Y = PH - FOOTER_H - SIG_H;
      const SIG_BLOCK_W = 200;
      const SIG_X = M + W - SIG_BLOCK_W;
      doc.font("Regular").fontSize(9).fillColor("#000")
        .text("____________________________", SIG_X, SIG_Y, { width: SIG_BLOCK_W, align: "center", lineBreak: false });
      doc.font("Bold").fontSize(9)
        .text("Preberajúci", SIG_X, SIG_Y + 14, { width: SIG_BLOCK_W, align: "center", lineBreak: false });
    };

    const C_WIDTHS = [W * 0.1, W * 0.1, W * 0.8];
    const C_XS = [M, M + C_WIDTHS[0], M + C_WIDTHS[0] + C_WIDTHS[1]];
    const P_HDR_H = 16;
    const RH = 14;

    const drawProductsHeader = () => {
      doc.font("Bold").fontSize(8).fillColor("#333")
        .text("PRODUKTY", M, y, { lineBreak: false });
      y += 11;
      doc.moveTo(M, y).lineTo(M + W, y).lineWidth(0.5).stroke("#000");
      y += 4;
      ["Množstvo", "Jedn.", "Popis"].forEach((h, i) => {
        doc.rect(C_XS[i], y, C_WIDTHS[i], P_HDR_H).fillAndStroke("#f2f2f2", "#000");
        doc.font("Bold").fontSize(8).fillColor("#000")
          .text(h, C_XS[i] + 2, y + 4, { width: C_WIDTHS[i] - 4, align: "center", lineBreak: false });
      });
      y += P_HDR_H;
    };

    // ─── PRODUCTS ────────────────────────────────────────────────────────────
    // If there isn't room for the header + at least one row, start fresh page
    const PRODUCTS_HDR_H = 11 + 4 + P_HDR_H;
    if (y + PRODUCTS_HDR_H + RH > MAX_Y) {
      doc.addPage({ size: "A4", margin: 0 });
      y = M;
    }
    drawProductsHeader();

    order.products.forEach((p) => {
      // new page if row won't fit
      if (y + RH > MAX_Y) {
        drawFooter();
        doc.addPage({ size: "A4", margin: 0 });
        y = M;
        drawProductsHeader();
      }

      const name = typeof p === "string" ? p : p.name;
      const qty  = typeof p === "string" ? "1" : String(p.quantity || 1);
      const unit = typeof p === "string" ? "ks" : (p.unit || "ks");

      [qty, unit, name].forEach((v, i) => {
        doc.rect(C_XS[i], y, C_WIDTHS[i], RH).lineWidth(0.5).stroke("#000");
        doc.font("Regular").fontSize(8).fillColor("#000")
          .text(v, C_XS[i] + 2, y + 3, {
            width: C_WIDTHS[i] - 4,
            align: i < 2 ? "center" : "left",
            lineBreak: false,
          });
      });
      y += RH;
    });

    if (order.services?.length) {
      y += 5;
      doc.font("Italic").fontSize(9).fillColor("#333")
        .text(`Služby: ${order.services.join(", ")}`, M, y, { width: W, lineBreak: false });
    }

    // ─── SIGNATURE + FOOTER (last page) ─────────────────────────────────────
    drawSignature();
    drawFooter();

    doc.end();
  });
};
