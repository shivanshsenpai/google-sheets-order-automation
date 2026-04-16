function updateTrackingDetails() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // ===== SHEETS =====
  const targetSheet = ss.getSheetByName("Incentive_report"); // Sales sheet
  const sourceSheet = ss.getSheetByName("MainData");         // Main data sheet
  const courierSheet = ss.getSheetByName("CourierCodes");    // Courier codes

  const targetData = targetSheet.getDataRange().getValues();
  const sourceData = sourceSheet.getDataRange().getValues();
  const courierData = courierSheet.getDataRange().getValues();

  // ===== COURIER MAP =====
  const courierMap = new Map();
  for (let i = 1; i < courierData.length; i++) {
    const name = String(courierData[i][0]).toLowerCase().trim();
    const code = courierData[i][1];
    if (name && code) courierMap.set(name, code);
  }

  // ===== MAIN MAP =====
  const map = new Map();
  for (let i = 1; i < sourceData.length; i++) {
    const trackingCode = sourceData[i][26]; // AA
    if (trackingCode) {
      map.set(String(trackingCode).trim(), sourceData[i]);
    }
  }

  // ===== PROCESS =====
  for (let i = 1; i < targetData.length; i++) {

    const code = targetData[i][9]; // Tracking Code (J)
    if (!code) continue;

    const cleanCode = String(code).trim();
    const match = map.get(cleanCode);

    if (match) {

      const status = match[27] || "";
      const courierNameRaw = match[25];
      const country = match[23] || "";

      let trackingLink = "https://t.17track.net/en#nums=" + cleanCode;

      // ===== COURIER FC =====
      if (courierNameRaw) {
        const courierName = String(courierNameRaw).toLowerCase().trim();
        const fcCode = courierMap.get(courierName);
        if (fcCode) trackingLink += "&fc=" + fcCode;
      }

      targetData[i][10] = trackingLink; // K
      targetData[i][11] = status;       // L

      // ===== DELIVERY TIME =====
      let deliveryText = "";

      if (!country) {
        deliveryText = "Delivery timeline will be shared soon";
      } else if (String(country).toLowerCase().includes("india")) {
        deliveryText = "Usual delivery time is 3–5 days";
      } else {
        deliveryText = "Usual delivery time is 15–20 days (international shipping)";
      }

      // ===== COMMON =====
      const mobile = targetData[i][4];
      const name = targetData[i][2] || "Sir";
      const paymentMethod = targetData[i][3];

      if (mobile) {

        const cleanMobile = "91" + String(mobile).replace(/\D/g, '');

        // 🚚 TRANSIT MESSAGE
        const msg =
`Hello ${name} 👋,

Your order is in transit 🚚  

📦 ${deliveryText}  

Tracking Code: ${cleanCode}  
Track here: ${trackingLink}  

Please pick up the courier call 📞 so delivery happens smoothly 😊  

Thanks 🙏`;

        const url =
          "https://web.whatsapp.com/send?phone=" + cleanMobile +
          "&text=" + encodeURIComponent(msg);

        targetData[i][13] = `=HYPERLINK("${url}","Send Message")`;

        // 💰 COD
        if (
          String(paymentMethod).toUpperCase() === "COD" &&
          String(status).toLowerCase().includes("deliver")
        ) {

          const codMsg =
`Hello ${name} 😊,

Your order has been delivered 🎉  
Kindly confirm COD payment 💰  

Thank you 🙏`;

          const codUrl =
            "https://web.whatsapp.com/send?phone=" + cleanMobile +
            "&text=" + encodeURIComponent(codMsg);

          targetData[i][14] = `=HYPERLINK("${codUrl}","Send COD Msg")`;

        } else {
          targetData[i][14] = "";
        }

        // 🔁 RTO
        if (String(status).toLowerCase().includes("return")) {

          const rtoMsg =
`Hello ${name},

Your return has been completed 🔁  
Let us know if you need help 😊`;

          const rtoUrl =
            "https://web.whatsapp.com/send?phone=" + cleanMobile +
            "&text=" + encodeURIComponent(rtoMsg);

          targetData[i][15] = `=HYPERLINK("${rtoUrl}","Send RTO Msg")`;

        } else {
          targetData[i][15] = "";
        }

        // ⭐ FEEDBACK
        if (String(status).toLowerCase().includes("deliver")) {

          const feedbackMsg =
`Hi ${name} 😊,

We hope you had a great experience with us ✨  

⭐ Google Review  
https://g.page/r/CYDC5_X5wVDMEAE/review  

🛍️ IndiaMART  
https://IndiaMART.in/j2lZzgpW  

📞 08043878940  

Thanks 🙏  
- Team 55Carat`;

          const feedbackUrl =
            "https://web.whatsapp.com/send?phone=" + cleanMobile +
            "&text=" + encodeURIComponent(feedbackMsg);

          targetData[i][17] = `=HYPERLINK("${feedbackUrl}","Send Feedback")`;

        } else {
          targetData[i][17] = "";
        }
      }
    }

    // 📞 DEFAULT CALL STATUS
    if (!targetData[i][18]) {
      targetData[i][18] = "Pending";
    }
  }

  targetSheet.getRange(1, 1, targetData.length, targetData[0].length)
    .setValues(targetData);

  Logger.log("✅ SYSTEM UPDATED");
}


// 🔒 LOCK SYSTEM
function onEdit(e) {

  if (!e || !e.range) return;

  const sheet = e.source.getActiveSheet();
  const row = e.range.getRow();
  const col = e.range.getColumn();

  if (row < 2) return;

  const CALL_COL = 19;
  const MSG_COL = 13;

  const cell = sheet.getRange(row, col);
  const newValue = String(e.value || "").trim();
  const props = PropertiesService.getDocumentProperties();

  // 🔒 CALL LOCK
  if (col === CALL_COL) {
    const key = "call_" + row;

    if (props.getProperty(key) === "Completed" && newValue !== "Completed") {
      cell.setValue("Completed");
      SpreadsheetApp.getUi().alert("Locked: Already Completed");
      return;
    }

    if (newValue === "Completed") {
      props.setProperty(key, "Completed");
    }
  }

  // 🔒 MESSAGE LOCK
  if (col === MSG_COL) {
    const key = "msg_" + row;

    if (props.getProperty(key) === "Sent" && newValue !== "Sent") {
      cell.setValue("Sent");
      SpreadsheetApp.getUi().alert("Locked: Already Sent");
      return;
    }

    if (newValue === "Sent") {
      props.setProperty(key, "Sent");
    }
  }
}
