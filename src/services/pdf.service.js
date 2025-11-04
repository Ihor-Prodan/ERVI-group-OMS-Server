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
          <style>
              body {
              font-family: Arial, sans-serif;
              color: #000;
              font-size: 12px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              height: 95%;
              box-sizing: border-box;
            }

            h2 {
              margin: 0;
            }

            .header {
              text-align: center;
            }

            .section {
              margin-bottom: 10px;
            }
            .section-top {
              margin-bottom: 10px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }

            .section-info {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              height: auto;
            }

            .info-table {
              display: flex;
              flex-direction: row;
              width: 100%;
            }

            .info-table-right {
              display: flex;
              flex-direction: row;
              width: 100%;
              justify-content: flex-end;
              max-height: 45px;
              padding-right: 45px;
            }

            .section-info-2 {
              display: flex;
              flex-direction: column;
              width: 100%;

            }

            .label {
              width: 160px;
              font-weight: bold;
            }

            table.doc-header {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 10px;
              max-height: 50px;
            }

            .doc-header-without-border {
              border: none;
              margin-bottom: 10px;
              max-height: 50px;
              width: 100%;
              text-align: center;
            }

            table.doc-header th,
            table.doc-header td {
              border: 1px solid #000;
              padding: 5px;
              font-size: 12px;
            }

            table.doc-header th.label {
              background-color: #f0f0f0;
              text-align: left;
              font-weight: bold;
            }

            table.doc-header td.info {
              background-color: #fff;
              text-align: left;
            }

            table.products {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              margin-bottom: 5px;
            }

            table.products th,
            table.products td {
              border: 1px solid #000;
              padding: 5px;
              font-size: 12px;
            }

            table.products th {
              background-color: #f0f0f0;
              text-align: left;
            }

            .footer {
              font-size: 12px;
              line-height: 1.4;
              display: flex;
              gap: 5px;
            }

            .footer-rectangle {
              width: 15px;
              height: 48px;
              background-color: #585756;
              border-radius: 4px;
            }

            .small {
              font-size: 11px;
            }

            .section-small {
              margin-top: 20px;
              width: 100%;
              text-align: right;
            }

            .section-title {
              font-weight: bold;
              margin-top: 5px;
              margin-bottom: 3px;
              font-size: 13px;
            }

            .right {
              text-align: right;
            }

          </style>
        </head>
        <body>
          <div>
            <div class="header">
              <?xml version="1.0" standalone="no"?>
              <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
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

            <div class="section-top">
              <h2>Dodací list</h2>
              <div class="section-info">
                <table class="info-table">
                  <tr>
                    <td>${order.fullname || "-"}</td>
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
                    <td>${order.receiverPhone || "-"}</td>
                  </tr>
                </table>

                  <table class="doc-header-without-border">
                    <tr>
                      <th class="label">Číslo DL</th>
                      <th class="label">Termín dodania</th>
                    </tr>
                    <tr>
                      <td class="info">${order.contractNumber}</td>
                      <td class="info">${
                        order.statusDates?.sent
                          ? new Date(order.statusDates.sent).toLocaleString(
                              "sk-SK",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "-"
                      }</td>
                    </tr>
                  </table>
                </div>
              </div>

              <table class="info-table-right">
                  <tr>
                    <td class="label">Trasa</td>
                    <td>${order.route || "SK"}</td>
                  </tr>
                  <tr>
                    <td class="label">Hmotnosť</td>
                    <td>${order.weight} kg</td>
                  </tr>
              </table>

              <div class="section-top">
                <h2>Objednávateľ</h2>
                <div class="section-info">
                  <table class="info-table">
                    <tr>
                      <td>${order.company}</td>
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
                  </table>

                  <div class="section-info-2">
                    
                    <table class="doc-header-without-border">
                      <tr>
                        <th class="label">V riešeni</th>
                        <th class="label">tel. kontakt</th>
                      </tr>
                      <tr>
                        <td class="info">${order.email}</td>
                        <td class="info">${order.phone}</td>
                      </tr>
                  </table>
                </div>
              </div>
            </div>

            <div class="section">
            ${order.deliveryNote ? `
              <div>
                <strong>Poznamka:</strong> ${order.deliveryNote || "-"}
              </div>
            ` : ""}
              <table class="products">
                <tr>
                  <th style="width: 15%">Množstvo</th>
                  <th style="width: 15%">Jedn.</th>
                  <th>Popis</th>
                </tr>
                ${order.products
                  .map(
                    (p) => `
                <tr>
                  <td>1</td>
                  <td>ks</td>
                  <td>${p}</td>
                </tr>
                `
                  )
                  .join("")}
              </table>
              <div class="section small">
              ${order.services?.length ? `
                <div>
                  <strong>Služby:</strong> ${
                    order.services?.length ? order.services.join(", ") : "-"
                  } 
                </div>`: ''
                }
                
              </div>
            </div>
          </div>
          
          <div>
            <div class="section-small" style="margin-bottom: 50px;">
              <div style="margin-right: 50px;">____________________________</div>
              <div class="section-title" style="margin-right: 110px">Preberajúci</div>
            </div>

            <div class="footer">
              <div class="footer-rectangle"></div>
              <div>
              <strong>ERVI Group s.r.o.</strong>
                Doležalova 3424/15C, 821 04 Bratislava<br /> Tel. +421 911 640 665 | info@ervi-group.com |
                <a href="http://www.ervi-group.com">http://www.ervi-group.com</a><br />
                IČO: 56829175 | IČ DPH: SK2122463442 Spoločnosť zapísaná: OR MS Bratislava, oddiel s.r.o., vložka č. 186048/B
              </div>
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
      margin: { top: "15px", bottom: "5px", left: "15px", right: "15px" },
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
