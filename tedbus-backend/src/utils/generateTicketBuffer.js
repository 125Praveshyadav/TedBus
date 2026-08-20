const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

const formatCurrency = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

const formatDate = (date) => {
  if (!date) return "N/A";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    weekday: "short",
  });
};

const getSeats = (booking) => {
  if (Array.isArray(booking.seatNumbers) && booking.seatNumbers.length > 0) {
    return booking.seatNumbers;
  }
  if (Array.isArray(booking.passengerDetails)) {
    return booking.passengerDetails
      .map((p) => p.seatNumber || p.seatNo)
      .filter(Boolean);
  }
  return [];
};

/**
 * Generate PDF ticket as Buffer
 * Returns a Promise<Buffer>
 */
const generateTicketBuffer = (booking) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 0 });
      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      // ---------- Palette (premium: deep maroon + warm gold + slate) ----------
      const MAROON = "#7a1f2b";
      const MAROON_DARK = "#4d1119";
      const GOLD = "#c8973a";
      const INK = "#1c2230";
      const TEXT = "#33394a";
      const MUTED = "#8a8f9c";
      const HAIRLINE = "#e7e3da";
      const PAPER = "#fffdf9";
      const PANEL = "#faf7f0";

      const PAGE_W = 595;
      const M = 48; // outer margin
      const CARD_W = PAGE_W - M * 2;
      const bus = booking.bus || {};
      const seats = getSeats(booking);

      // Full page background — soft warm paper, not stark white
      doc.rect(0, 0, 595, 842).fill(PAPER);

      // ================= HEADER =================
      doc.rect(0, 0, 595, 96).fill(MAROON_DARK);
      doc.rect(0, 94, 595, 2).fill(GOLD);

      doc
        .fillColor("#ffffff")
        .font("Helvetica-Bold")
        .fontSize(23)
        .text("TedBus", M, 30);

      doc
        .font("Helvetica")
        .fontSize(9.5)
        .fillColor("#d9b98a")
        .text("Book. Ride. Relax.", M, 58);

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(GOLD)
        .text("E-TICKET", 0, 30, { align: "right", width: PAGE_W - M });

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#c9c2b4")
        .text(`PNR  ${booking.pnr || "N/A"}`, 0, 46, {
          align: "right",
          width: PAGE_W - M,
        });

      const statusLine = `${booking.bookingStatus || "Pending"}  ·  Payment ${
        booking.paymentStatus || "Pending"
      }`;
      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor("#c9c2b4")
        .text(statusLine, 0, 62, { align: "right", width: PAGE_W - M });

      // ================= ROUTE CARD =================
      let y = 132;
      const routeCardH = 108;
      doc
        .roundedRect(M, y, CARD_W, routeCardH, 10)
        .lineWidth(1)
        .strokeColor(HAIRLINE)
        .fillAndStroke(PANEL, HAIRLINE);

      doc
        .fillColor(MUTED)
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .text("FROM", M + 22, y + 20, { characterSpacing: 0.6 });

      doc
        .fillColor(INK)
        .font("Helvetica-Bold")
        .fontSize(18)
        .text(bus.source || "Source", M + 22, y + 32, { width: 180 });

      doc
        .font("Helvetica")
        .fontSize(9.5)
        .fillColor(MUTED)
        .text(bus.departureTime || "--", M + 22, y + 58);

      // route connector
      const connX1 = M + 215;
      const connX2 = M + CARD_W - 215;
      doc.circle(connX1, y + 40, 2).fill(GOLD);
      doc
        .moveTo(connX1 + 6, y + 40)
        .lineTo(connX2 - 6, y + 40)
        .dash(2, { space: 3 })
        .lineWidth(1)
        .strokeColor(GOLD)
        .stroke()
        .undash();
      doc.circle(connX2, y + 40, 2).fill(GOLD);

      doc
        .fillColor(MAROON)
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .text(bus.duration || "Journey", connX1, y + 24, {
          width: connX2 - connX1,
          align: "center",
        });

      doc
        .fillColor(MUTED)
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .text("TO", M + CARD_W - 202, y + 20, { width: 180, align: "right" });

      doc
        .fillColor(INK)
        .font("Helvetica-Bold")
        .fontSize(18)
        .text(bus.destination || "Destination", M + CARD_W - 202, y + 32, {
          width: 180,
          align: "right",
        });

      doc
        .font("Helvetica")
        .fontSize(9.5)
        .fillColor(MUTED)
        .text(bus.arrivalTime || "--", M + CARD_W - 202, y + 58, {
          width: 180,
          align: "right",
        });

      doc
        .moveTo(M + 22, y + 78)
        .lineTo(M + CARD_W - 22, y + 78)
        .lineWidth(0.5)
        .strokeColor(HAIRLINE)
        .stroke();

      const halfW = (CARD_W - 44) / 2;
      doc
        .fillColor(MUTED)
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .text("JOURNEY DATE", M + 22, y + 86);
      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(9.5)
        .text(formatDate(booking.journeyDate || bus.journeyDate), M + 22, y + 98, {
          width: halfW,
          align: "left",
        });
      doc
        .fillColor(MUTED)
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .text("BUS", M + 22 + halfW, y + 86, { width: halfW, align: "right" });
      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(9.5)
        .text(bus.busName || "TedBus Partner", M + 22 + halfW, y + 98, {
          width: halfW,
          align: "right",
        });

      // ================= SECTION HELPER =================
      const sectionTitle = (title, sy) => {
        doc
          .fillColor(INK)
          .font("Helvetica-Bold")
          .fontSize(11)
          .text(title.toUpperCase(), M, sy, { characterSpacing: 0.4 });
        doc.moveTo(M, sy + 15).lineTo(M + 26, sy + 15).lineWidth(1.5).strokeColor(GOLD).stroke();
      };

      // ================= BUS + SEATS (combined, compact) =================
      y += routeCardH + 26;
      sectionTitle("Bus & Seat Details", y);
      y += 24;

      const busPanelH = 82;
      doc.roundedRect(M, y, CARD_W, busPanelH, 8).lineWidth(1).strokeColor(HAIRLINE).fillAndStroke(PANEL, HAIRLINE);

      const col = CARD_W / 3;
      const miniField = (label, value, idx, valueColor) => {
        const cx = M + idx * col + 20;
        doc.fillColor(MUTED).font("Helvetica-Bold").fontSize(7.5).text(label, cx, y + 14);
        doc
          .fillColor(valueColor || TEXT)
          .font("Helvetica-Bold")
          .fontSize(10.5)
          .text(value, cx, y + 27, { width: col - 30 });
      };
      miniField("BUS TYPE", bus.busType || "Standard", 0);
      miniField("BUS NUMBER", bus.busNumber || "N/A", 1);
      miniField("OPERATOR", bus.operator || "TedBus", 2);

      doc.moveTo(M + 16, y + 48).lineTo(M + CARD_W - 16, y + 48).lineWidth(0.5).strokeColor(HAIRLINE).stroke();

      const seatText = seats.length ? seats.join(" · ") : "N/A";
      doc.fillColor(MUTED).font("Helvetica-Bold").fontSize(7.5).text("SEATS", M + 20, y + 58);
      doc.fillColor(MAROON).font("Helvetica-Bold").fontSize(10.5).text(seatText, M + 66, y + 57, { width: col - 20 });

      doc.fillColor(MUTED).font("Helvetica-Bold").fontSize(7.5).text("BOARDING", M + col + 20, y + 58);
      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(booking.boardingPoint || "N/A", M + col + 78, y + 57, { width: col - 90 });

      doc.fillColor(MUTED).font("Helvetica-Bold").fontSize(7.5).text("DROPPING", M + col * 2 + 20, y + 58);
      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(booking.droppingPoint || "N/A", M + col * 2 + 78, y + 57, { width: col - 95 });

      // ================= PASSENGERS =================
      y += busPanelH + 26;
      sectionTitle("Passenger Details", y);
      y += 24;

      const passengers = Array.isArray(booking.passengerDetails) ? booking.passengerDetails : [];
      const rowH = 32;

      passengers.forEach((passenger, index) => {
        if (index % 2 === 0) {
          doc.rect(M, y, CARD_W, rowH).fill(PANEL);
        }
        doc
          .fillColor(GOLD)
          .font("Helvetica-Bold")
          .fontSize(9)
          .text(`${index + 1}`, M + 20, y + 11);

        doc
          .fillColor(INK)
          .font("Helvetica-Bold")
          .fontSize(10)
          .text(passenger.name || "Passenger", M + 44, y + 7, { width: 220 });

        doc
          .fillColor(MUTED)
          .font("Helvetica")
          .fontSize(8.5)
          .text(`${passenger.age || "N/A"} yrs  ·  ${passenger.gender || "N/A"}`, M + 44, y + 18);

        doc
          .fillColor(MAROON)
          .font("Helvetica-Bold")
          .fontSize(10)
          .text(`Seat ${passenger.seatNumber || "N/A"}`, M + CARD_W - 140, y + 11, {
            width: 120,
            align: "right",
          });

        y += rowH;
      });

      // ================= PAYMENT SUMMARY =================
      y += 20;
      sectionTitle("Payment Summary", y);
      y += 24;

      doc.roundedRect(M, y, CARD_W, 58, 8).lineWidth(1).strokeColor(HAIRLINE).fillAndStroke(PANEL, HAIRLINE);

      doc.fillColor(MUTED).font("Helvetica-Bold").fontSize(8).text("TOTAL PAID", M + 22, y + 16);
      doc
        .fillColor(MAROON)
        .font("Helvetica-Bold")
        .fontSize(19)
        .text(formatCurrency(booking.totalAmount), M + 22, y + 28);

      doc.fillColor(MUTED).font("Helvetica-Bold").fontSize(8).text("PAYMENT ID", M + 300, y + 16, {
        width: 220,
        align: "right",
      });
      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(9.5)
        .text(booking.razorpayPaymentId || booking.paymentId || "N/A", M + 300, y + 30, {
          width: 220,
          align: "right",
        });

      // ================= TICKET STUB (perforated) =================
      y += 58 + 24;
      const stubH = 108;

      // perforation notches + dashed tear line
      doc.circle(M, y, 8).fill(PAPER);
      doc.circle(M + CARD_W, y, 8).fill(PAPER);
      doc
        .moveTo(M + 14, y)
        .lineTo(M + CARD_W - 14, y)
        .dash(3, { space: 3 })
        .lineWidth(1)
        .strokeColor(HAIRLINE)
        .stroke()
        .undash();

      doc
        .roundedRect(M, y + 10, CARD_W, stubH, 10)
        .lineWidth(1)
        .strokeColor(HAIRLINE)
        .fillAndStroke(MAROON, HAIRLINE);

      const qrPayload = JSON.stringify({
        pnr: booking.pnr,
        bookingId: booking._id,
        seats,
      });

      let qrImage = null;
      try {
        qrImage = await QRCode.toDataURL(qrPayload, {
          margin: 0,
          width: 200,
          color: { dark: "#4d1119", light: "#fffdf9" },
        });
      } catch {
        qrImage = null;
      }

      const stubY = y + 10;
      doc.roundedRect(M + 16, stubY + 16, 76, 76, 6).fill(PAPER);
      if (qrImage) {
        doc.image(qrImage, M + 22, stubY + 22, { width: 64, height: 64 });
      }

      doc
        .fillColor("#f4e3c1")
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("Scan at boarding point", M + 112, stubY + 22);

      doc
        .fillColor("#e3c9b0")
        .font("Helvetica")
        .fontSize(8.5)
        .text("Show this ticket and a valid photo ID to the conductor before boarding.", M + 112, stubY + 40, {
          width: CARD_W - 240,
        });

      doc
        .fillColor(GOLD)
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .text(`PNR  ${booking.pnr || "N/A"}`, M + 112, stubY + 66);

      doc
        .fillColor("#e3c9b0")
        .font("Helvetica")
        .fontSize(8)
        .text(seats.length ? `Seats ${seats.join(", ")}` : "", M + 112, stubY + 80);

      // vertical dashed divider inside stub, before the right block
      doc
        .moveTo(M + CARD_W - 130, stubY + 16)
        .lineTo(M + CARD_W - 130, stubY + stubH - 16)
        .dash(2, { space: 3 })
        .lineWidth(0.75)
        .strokeColor("#a8586a")
        .stroke()
        .undash();

      doc
        .fillColor("#e3c9b0")
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .text("JOURNEY", M + CARD_W - 108, stubY + 22, { width: 92 });
      doc
        .fillColor("#ffffff")
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(formatDate(booking.journeyDate || bus.journeyDate), M + CARD_W - 108, stubY + 33, { width: 92 });

      doc
        .fillColor("#e3c9b0")
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .text("DEPARTS", M + CARD_W - 108, stubY + 56, { width: 92 });
      doc
        .fillColor("#ffffff")
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(bus.departureTime || "--", M + CARD_W - 108, stubY + 67, { width: 92 });

      // ================= FOOTER =================
      const footerY = y + 10 + stubH + 24;
      doc
        .moveTo(M, footerY)
        .lineTo(M + CARD_W, footerY)
        .lineWidth(0.5)
        .strokeColor(HAIRLINE)
        .stroke();

      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text("Thank you for choosing TedBus", M, footerY + 14, { width: CARD_W, align: "center" });

      doc
        .fillColor(MUTED)
        .font("Helvetica")
        .fontSize(8)
        .text("support@tedbus.com  ·  www.tedbus.com  ·  Available 24x7", M, footerY + 28, {
          width: CARD_W,
          align: "center",
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateTicketBuffer;