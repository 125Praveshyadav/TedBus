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
      const doc = new PDFDocument({
        size: "A4",
        margin: 0,
      });

      const chunks = [];

      // Collect PDF data into buffer
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      // ---------- Colors ----------
      const RED = "#dc2626";
      const DARK = "#0f172a";
      const TEXT = "#1e293b";
      const MUTED = "#64748b";
      const LIGHT = "#f8fafc";
      const BORDER = "#e2e8f0";

      const bus = booking.bus || {};
      const seats = getSeats(booking);

      // ---------- Header ----------
      doc.rect(0, 0, 595, 110).fill(RED);

      doc
        .fillColor("#ffffff")
        .font("Helvetica-Bold")
        .fontSize(28)
        .text("TedBus", 50, 35);

      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor("#fee2e2")
        .text("Book. Ride. Relax.", 50, 70);

      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#ffffff")
        .text("E-TICKET", 460, 40, { align: "right", width: 90 });

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#fee2e2")
        .text(`PNR: ${booking.pnr || "N/A"}`, 460, 60, {
          align: "right",
          width: 90,
        });

      // ---------- Status ----------
      doc
        .rect(0, 110, 595, 35)
        .fill(DARK)
        .fillColor("#ffffff")
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(
          `Booking: ${booking.bookingStatus || "Pending"}   |   Payment: ${
            booking.paymentStatus || "Pending"
          }`,
          50,
          122,
          { width: 495, align: "center" }
        );

      // ---------- Route Card ----------
      const startY = 170;

      doc
        .roundedRect(40, startY, 515, 110, 12)
        .lineWidth(1)
        .strokeColor(BORDER)
        .stroke();

      doc
        .fillColor(MUTED)
        .font("Helvetica-Bold")
        .fontSize(8)
        .text("FROM", 60, startY + 18);

      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(20)
        .text(bus.source || "Source", 60, startY + 32);

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(MUTED)
        .text(bus.departureTime || "--", 60, startY + 58);

      doc
        .moveTo(265, startY + 60)
        .lineTo(330, startY + 60)
        .lineWidth(1.5)
        .strokeColor(RED)
        .stroke();

      doc
        .fillColor(RED)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(bus.duration || "Journey", 265, startY + 38, {
          width: 70,
          align: "center",
        });

      doc
        .fillColor(MUTED)
        .font("Helvetica-Bold")
        .fontSize(8)
        .text("TO", 380, startY + 18);

      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(20)
        .text(bus.destination || "Destination", 380, startY + 32);

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(MUTED)
        .text(bus.arrivalTime || "--", 380, startY + 58);

      doc
        .moveTo(40, startY + 80)
        .lineTo(555, startY + 80)
        .strokeColor(BORDER)
        .stroke();

      doc
        .fillColor(MUTED)
        .font("Helvetica-Bold")
        .fontSize(8)
        .text("JOURNEY DATE", 60, startY + 92);

      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(
          formatDate(booking.journeyDate || bus.journeyDate),
          60,
          startY + 102
        );

      doc
        .fillColor(MUTED)
        .font("Helvetica-Bold")
        .fontSize(8)
        .text("BUS", 380, startY + 92);

      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(bus.busName || "TedBus Partner", 380, startY + 102);

      // ---------- Section helper ----------
      const sectionTitle = (title, y) => {
        doc
          .fillColor(DARK)
          .font("Helvetica-Bold")
          .fontSize(12)
          .text(title, 40, y);

        doc
          .moveTo(40, y + 18)
          .lineTo(80, y + 18)
          .lineWidth(2)
          .strokeColor(RED)
          .stroke();
      };

      // ---------- Bus Details ----------
      const busY = startY + 130;
      sectionTitle("Bus Details", busY);

      doc.roundedRect(40, busY + 28, 515, 60, 10).fillColor(LIGHT).fill();

      doc
        .fillColor(MUTED)
        .font("Helvetica-Bold")
        .fontSize(8)
        .text("BUS TYPE", 60, busY + 40);

      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(bus.busType || "Standard", 60, busY + 53);

      doc
        .fillColor(MUTED)
        .font("Helvetica-Bold")
        .fontSize(8)
        .text("BUS NUMBER", 230, busY + 40);

      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(bus.busNumber || "N/A", 230, busY + 53);

      doc
        .fillColor(MUTED)
        .font("Helvetica-Bold")
        .fontSize(8)
        .text("OPERATOR", 400, busY + 40);

      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(bus.operator || "TedBus", 400, busY + 53);

      // ---------- Seats ----------
      const seatY = busY + 110;
      sectionTitle("Seats & Boarding", seatY);

      doc.roundedRect(40, seatY + 28, 515, 60, 10).fillColor(LIGHT).fill();

      doc
        .fillColor(MUTED)
        .font("Helvetica-Bold")
        .fontSize(8)
        .text("SEATS", 60, seatY + 40);

      doc
        .fillColor(RED)
        .font("Helvetica-Bold")
        .fontSize(12)
        .text(seats.join(", ") || "N/A", 60, seatY + 53);

      doc
        .fillColor(MUTED)
        .font("Helvetica-Bold")
        .fontSize(8)
        .text("BOARDING", 230, seatY + 40);

      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(booking.boardingPoint || "N/A", 230, seatY + 53);

      doc
        .fillColor(MUTED)
        .font("Helvetica-Bold")
        .fontSize(8)
        .text("DROPPING", 400, seatY + 40);

      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(booking.droppingPoint || "N/A", 400, seatY + 53);

      // ---------- Passengers ----------
      const passY = seatY + 110;
      sectionTitle("Passenger Details", passY);

      let cursorY = passY + 32;
      const passengers = Array.isArray(booking.passengerDetails)
        ? booking.passengerDetails
        : [];

      passengers.forEach((passenger, index) => {
        doc.roundedRect(40, cursorY, 515, 40, 8).fillColor(LIGHT).fill();

        doc
          .fillColor(RED)
          .font("Helvetica-Bold")
          .fontSize(10)
          .text(`${index + 1}`, 55, cursorY + 14);

        doc
          .fillColor(TEXT)
          .font("Helvetica-Bold")
          .fontSize(11)
          .text(passenger.name || "Passenger", 80, cursorY + 8);

        doc
          .fillColor(MUTED)
          .font("Helvetica")
          .fontSize(9)
          .text(
            `Age: ${passenger.age || "N/A"} • ${passenger.gender || "N/A"}`,
            80,
            cursorY + 22
          );

        doc
          .fillColor(RED)
          .font("Helvetica-Bold")
          .fontSize(11)
          .text(`Seat ${passenger.seatNumber || "N/A"}`, 460, cursorY + 14);

        cursorY += 48;
      });

      // ---------- Fare ----------
      const fareY = cursorY + 10;
      sectionTitle("Payment Summary", fareY);

      doc.roundedRect(40, fareY + 28, 515, 70, 10).fillColor(LIGHT).fill();

      doc
        .fillColor(MUTED)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text("Total Paid", 60, fareY + 45);

      doc
        .fillColor(RED)
        .font("Helvetica-Bold")
        .fontSize(22)
        .text(formatCurrency(booking.totalAmount), 60, fareY + 60);

      doc
        .fillColor(MUTED)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text("Payment ID", 380, fareY + 45);

      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(
          booking.razorpayPaymentId || booking.paymentId || "N/A",
          380,
          fareY + 60,
          { width: 170 }
        );

      // ---------- QR ----------
      const qrPayload = JSON.stringify({
        pnr: booking.pnr,
        bookingId: booking._id,
        seats,
      });

      let qrImage = null;
      try {
        qrImage = await QRCode.toDataURL(qrPayload, {
          margin: 0,
          width: 120,
        });
      } catch {
        qrImage = null;
      }

      const qrY = fareY + 115;

      doc.roundedRect(40, qrY, 515, 90, 10).fillColor("#fff7ed").fill();

      if (qrImage) {
        doc.image(qrImage, 60, qrY + 10, { width: 70, height: 70 });
      }

      doc
        .fillColor(DARK)
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("Scan at boarding point", 150, qrY + 18);

      doc
        .fillColor(MUTED)
        .font("Helvetica")
        .fontSize(9)
        .text(
          "Show this ticket and a valid ID proof during boarding.",
          150,
          qrY + 38,
          { width: 380 }
        );

      doc
        .fillColor(MUTED)
        .font("Helvetica-Bold")
        .fontSize(8)
        .text(`PNR: ${booking.pnr || "N/A"}`, 150, qrY + 65);

      // ---------- Footer ----------
      const footerY = qrY + 115;

      doc
        .moveTo(40, footerY)
        .lineTo(555, footerY)
        .lineWidth(0.5)
        .strokeColor(BORDER)
        .stroke();

      doc
        .fillColor(MUTED)
        .font("Helvetica")
        .fontSize(9)
        .text(
          "Thank you for choosing TedBus. Have a safe and pleasant journey.",
          40,
          footerY + 12,
          { width: 515, align: "center" }
        );

      doc
        .fillColor(MUTED)
        .font("Helvetica")
        .fontSize(8)
        .text(
          "support@tedbus.com  •  www.tedbus.com  •  Available 24x7",
          40,
          footerY + 28,
          { width: 515, align: "center" }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateTicketBuffer;