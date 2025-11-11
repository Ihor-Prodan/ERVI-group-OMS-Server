import puppeteer from "puppeteer";

let browser;

const getBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
  return browser;
};

export const generateOrderPdfBuffer = async (order) => {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setContent(
      `
      <html>
        <head>
          <meta charset="UTF-8" />
            <style>
              body {
                font-family: 'Segoe UI', Arial, sans-serif;
                font-size: 14px;
                color: #222;
                margin: 0;
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 100%;
              }

              .header-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #000;
                padding-bottom: 6px;
                margin-bottom: 10px;
              }

              .logo svg {
                width: 120px;
                height: auto;
              }

              .doc-info {
                text-align: right;
                font-size: 12px;
                line-height: 1.3;
              }

              h2 {
                font-size: 14px;
                text-transform: uppercase;
                text-align: center;
                margin: 10px 0 8px 0;
                letter-spacing: 0.5px;
                color: #333;
              }

              .doc-header {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 10px;
                page-break-inside: avoid;
              }

              .doc-header th,
              .doc-header td {
                border: 1px solid #000;
                padding: 4px 6px;
                line-height: 1.2;
                 text-align: center;
              }

              .doc-header th {
                background: #f2f2f2;
                font-weight: 600;
              }

              .section {
                margin-bottom: 10px;
                margin-top: 30px;
                page-break-inside: avoid;
              }

              .section h3 {
                font-size: 11px;
                text-transform: uppercase;
                border-bottom: 1px solid #000;
                padding-bottom: 2px;
                margin-bottom: 3px;
                color: #333;
              }

              .info-table {
                width: 100%;
                border-collapse: collapse;
              }

              .info-table td {
                padding: 2px 4px;
                line-height: 1.2;
              }

              .products {
                width: 100%;
                border-collapse: collapse;
                margin-top: 5px;
                font-size: 14px;
                table-layout: fixed;
              }

              .products th,
              .products td {
                border: 1px solid #000;
                padding: 3px 4px;
                line-height: 1;
                text-align: center;
                vertical-align: top;
                box-sizing: border-box;
              }

              .note {
                background: #f9f9f9;
                border-left: 3px solid #000;
                padding: 6px 8px;
                font-size: 10px;
                margin: 8px 0;
                line-height: 1.3;
              }

              .services {
                margin-top: 5px;
                font-style: italic;
                font-size: 11px;
              }

              .signature {
                margin-top: 10px;
                margin-bottom: 30px;
                margin-right: 50px;
                text-align: right;
                font-size: 10px;
                page-break-inside: avoid;
              }

              .section-container {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 30px;
              }

              .footer-container {
                display: flex;
                flex-direction: column;
                gap: 15px;
              }

              .footer {
                font-size: 9px;
                display: flex;
                align-items: center;
                border-top: 1px solid #000;
                padding: 6px 10px;
                background: white;
              }

              .footer-rectangle {
                width: 8px;
                height: 30px;
                background: #585756;
                border-radius: 2px;
                margin-right: 8px;
              }

              a {
                color: #0074d9;
                text-decoration: none;
              }

              a:hover {
                text-decoration: underline;
              }
            </style>
        </head>

        <body>
          <div style="height: 100%;">
            <div class="header-top">
                  <div class="logo">
                    <svg
                      version="1.0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="150"
                      height="80"
                      viewBox="0 0 466.000000 114.000000"
                      preserveAspectRatio="xMidYMid meet"
                      >
                      <g
                        transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)"
                        fill="#000000"
                        stroke="none"
                      >
                        <path
                          d="M0 570 l0 -570 410 0 410 0 0 38 c0 20 -3 67 -7 105 l-6 67 -298 0
                      -299 0 0 115 0 115 70 0 70 0 0 105 0 105 -70 0 -70 0 0 140 0 140 300 0 300
                      0 0 105 0 105 -405 0 -405 0 0 -570z"
                        />
                        <path
                          d="M1366 1106 c-4 -20 -6 -88 -5 -151 l1 -115 129 0 129 0 0 49 0 50 45
                      6 c24 4 95 5 157 3 179 -6 238 -47 238 -165 0 -106 -55 -152 -196 -161 l-84
                      -5 0 -83 c0 -60 4 -84 13 -85 103 -5 180 -18 199 -35 37 -33 58 -97 68 -211 6
                      -59 15 -129 21 -155 l11 -48 124 0 c68 0 124 2 124 3 0 2 -9 39 -20 82 -11 43
                      -20 104 -20 135 0 156 -44 257 -134 302 l-29 15 39 28 c108 79 134 129 134
                      257 0 139 -76 249 -200 290 -60 20 -90 22 -401 26 l-336 4 -7 -36z"
                        />
                        <path
                          d="M2843 1128 c2 -7 85 -264 183 -570 l179 -558 140 0 141 0 187 562
                      c103 310 187 567 187 571 0 4 -57 6 -127 5 l-127 -3 -85 -265 c-48 -146 -103
                      -320 -125 -388 -21 -67 -43 -122 -47 -122 -5 0 -9 5 -9 11 0 6 -55 181 -122
                      390 l-123 379 -128 0 c-99 0 -128 -3 -124 -12z"
                      />
                      <path
                        d="M4405 688 c-3 -249 -5 -505 -3 -568 l3 -115 128 -3 127 -3 0 571 0
                      570 -124 0 -124 0 -7 -452z"
                      />
                      <path
                        d="M469 636 c-64 -21 -81 -115 -30 -167 25 -24 38 -29 78 -29 67 0 93
                      20 93 71 l0 39 -45 0 c-33 0 -45 -4 -45 -15 0 -9 9 -15 25 -15 30 0 34 -25 6
                      -40 -69 -36 -131 42 -85 108 18 26 69 30 95 6 25 -23 55 -6 36 20 -18 24 -86
                      36 -128 22z"
                      />
                      <path
                        d="M1058 640 c-58 -11 -86 -59 -74 -125 9 -47 47 -75 103 -75 36 0 50 6
                      75 30 28 28 30 35 26 81 -3 28 -12 57 -20 65 -19 19 -75 32 -110 24z m76 -52
                      c34 -48 6 -118 -46 -118 -29 0 -42 9 -57 37 -26 51 0 103 54 103 24 0 39 -7
                      49 -22z"
                      />
                      <path
                        d="M710 540 c0 -93 1 -100 20 -100 17 0 20 7 20 39 0 22 4 43 10 46 15
                      9 45 -11 71 -49 18 -27 31 -36 53 -36 l28 0 -36 44 -36 44 25 16 c30 20 33 56
                      7 79 -14 13 -38 17 -90 17 l-72 0 0 -100z m127 59 c22 -22 2 -39 -43 -39 -40
                      0 -44 2 -44 25 0 22 4 25 38 25 21 0 43 -5 49 -11z"
                      />
                      <path
                        d="M1282 559 c4 -96 22 -119 92 -119 67 0 86 27 86 123 0 75 -1 77 -25
                      77 -25 0 -25 -1 -25 -80 0 -77 -1 -80 -26 -86 -43 -11 -57 14 -55 95 2 71 2
                      71 -25 71 l-26 0 4 -81z"
                      />
                      <path
                        d="M1560 540 c0 -93 1 -100 20 -100 17 0 20 7 20 40 l0 40 45 0 c52 0
                      85 25 85 64 0 38 -35 56 -107 56 l-63 0 0 -100z m120 55 c19 -22 -5 -45 -46
                      -45 -31 0 -34 3 -34 30 0 27 3 30 34 30 18 0 39 -7 46 -15z"
                      />
                      <path
                        d="M1388 252 c-16 -3 -18 -17 -18 -128 l0 -124 125 0 126 0 -3 128 -3
                      127 -105 0 c-58 1 -113 -1 -122 -3z"
                      />
                      </g>
                    </svg>
                  </div>
                  <div class="doc-info">
                    <div>
                      <strong>Dátum dodania:</strong> ${new Date(
                        order.date
                      ).toLocaleDateString("sk-SK")}
                    </div>
                      <div><strong>Číslo zásielky:</strong> ${
                        order.deliveryNumber
                      }</div>
                      <div><strong>Číslo DL:</strong> ${
                        order.contractNumber
                      }</div>
                  </div>
                </div>

                <h2>Dodací list</h2>

                <table class="doc-header">
                  <tr>
                  <th>Termín dodania</th>
                  <th>Trasa</th>
                  <th>Hmotnosť</th>
                  </tr>
                  <tr>
                  <td>
                    ${
                      order.statusDates?.sent
                        ? new Date(order.statusDates.sent).toLocaleString(
                            "sk-SK",
                            {
                              timeZone: "Europe/Bratislava",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "-"
                    }
                  </td>
                  <td>${order.route || "SK"}</td>
                  <td>${order.weight || 0} kg</td>
                  </tr>
                </table>

                <div class="section-container">
                  <div class="section">
                    <h3>Objednávateľ</h3>
                    <table class="info-table">
                      <tr>
                        <td><strong>${order.company}</strong></td>
                      </tr>
                      <tr>
                        <td>${order.street || "-"}</td>
                      </tr>
                      <tr>
                        <td>${order.psc || "-"} ${order.city}</td>
                      </tr>
                      <tr>
                        <td>${order.country || "-"}</td>
                      </tr>
                      <tr>
                        <td>Email: ${order.email}</td>
                      </tr>
                      <tr>
                        <td>Tel: ${order.phone}</td>
                      </tr>
                    </table>
                  </div>

                  <div class="section">
                    <h3>Príjemca</h3>
                    <table class="info-table">
                      <tr>
                        <td><strong>${order.fullname || "-"}</strong></td>
                      </tr>
                      <tr>
                        <td>${order.receiverStreet || "-"}</td>
                      </tr>
                      <tr>
                        <td>${order.receiverPsc || "-"} ${
        order.receiverCity || "-"
      }</td>
                      </tr>
                      <tr>
                        <td>${order.receiverCountry || "-"}</td>
                      </tr>
                      <tr>
                        <td>Tel: ${order.receiverPhone || "-"}</td>
                      </tr>
                      <tr>
                        <td>Email: ${order.receiverEmail || "-"}</td>
                      </tr>
                    </table>
                  </div>
                </div>

                ${
                  order.deliveryNote
                    ? `
                <div class="note"><strong>Poznámka:</strong> ${order.deliveryNote}</div>
                `
                    : ""
                }

                <div class="section">
                  <h3>Produkty</h3>
                  <table class="products">
                    <thead>
                      <tr>
                        <th style="width: 10%">Množstvo</th>
                        <th style="width: 10%">Jedn.</th>
                        <th>Popis</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${order.products
                        .map(
                          (p) => `
                      <tr>
                        <td>${p.quantity || 1}</td>
                        <td>${p.unit || "ks"}</td>
                        <td>${typeof p === "string" ? p : p.name}</td>
                      </tr>
                    `
                        )
                        .join("")}
                    </tbody>
                  </table>

                   ${
                     order.services?.length
                       ? `
                  <div class="services"><strong>Služby:</strong> ${order.services.join(
                    ", "
                  )}</div>
                  `
                       : ""
                   }
                </div>
              </div>
          </div>

          <div class="footer-container">
            <div class="signature">
              ____________________________<br />
              <strong style="margin-right: 50px">Preberajúci</strong>
            </div>

            <div class="footer">
              <div class="footer-rectangle"></div>
              <div>
                <strong>ERVI Group s.r.o.</strong> &nbsp; Doležalova 3424/15C, 821 04 Bratislava
                &nbsp;|&nbsp; <br />Tel. +421 911 640 665 &nbsp;|&nbsp; info@ervi-group.com &nbsp;|&nbsp;
                <a href="http://www.ervi-group.com">www.ervi-group.com</a><br />
                IČO: 56829175 &nbsp;|&nbsp; IČ DPH: SK2122463442 &nbsp;|&nbsp; OR MS Bratislava, oddiel
                s.r.o., vložka č. 186048/B
              </div>
          </div>
        </body>
      </html>
    `,
      { waitUntil: "networkidle0" }
    );

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "15px", bottom: "10px", left: "15px", right: "15px" },
    });

    return pdfBuffer;
  } finally {
    await page.close();
  }
};

process.on("SIGTERM", async () => {
  if (browser) {
    await browser.close();
    console.log("🧹 Puppeteer browser closed on shutdown");
  }
  process.exit(0);
});

