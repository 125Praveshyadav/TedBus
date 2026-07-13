const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const User = require("../models/User");
const { notifyUser } = require("./notificationDispatcher");

const sendJourneyReminders = async () => {
  try {
    console.log("⏰ Running journey reminder job...");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startOfTomorrow = new Date(tomorrow);
    startOfTomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      journeyDate: {
        $gte: startOfTomorrow,
        $lte: endOfTomorrow,
      },
      bookingStatus: "Confirmed",
      paymentStatus: "Paid",
    })
      .populate("bus", "busName departureTime")
      .populate("user", "name email");

    if (bookings.length === 0) {
      console.log("⏰ No journeys tomorrow. Skipping reminders.");
      return { sent: 0 };
    }

    console.log(`⏰ Found ${bookings.length} bookings for tomorrow`);

    let sentCount = 0;

    for (const booking of bookings) {
      try {
        if (!booking.user || !booking.bus) continue;

        await notifyUser({
          recipientId: booking.user._id,
          type: "journey_reminder",
          title: "Journey Tomorrow! ⏰",
          message: `Your bus ${booking.bus.busName || ""}  departs tomorrow${booking.bus.departureTime ? " at " + booking.bus.departureTime : ""}. PNR: ${booking.pnr}. Please reach the boarding point 15 minutes early!`,
          icon: "clock",
          actionUrl: "/my-bookings",
          referenceType: "Booking",
          referenceId: booking._id,
        });

        sentCount++;
      } catch (err) {
        console.error(`⏰ Reminder failed for booking ${booking.pnr}:`, err.message);
      }
    }

    console.log(`⏰ Journey reminders sent: ${sentCount}/${bookings.length}`);
    return { sent: sentCount, total: bookings.length };
  } catch (error) {
    console.error("⏰ Journey reminder job failed:", error.message);
    return { sent: 0, error: error.message };
  }
};

module.exports = { sendJourneyReminders };