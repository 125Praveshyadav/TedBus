import { useLocation, Link } from "react-router-dom";
import { FaCheckCircle, FaDownload, FaTicketAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

 
    const bookingData = location.state;
    
  const { busId, seats, amount } = bookingData;
    const passengerData =
  Object.values(bookingData?.passenger?.passengers || {})[0];
   console.log("Booking Data:", bookingData);
console.log("Passenger Data:", passengerData);

  if (!bookingData) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-2xl font-bold text-red-500">
          No Booking Found
        </h2>
      </div>
    );
  }


  const bookingId =
    "TED" +
    Math.floor(Math.random() * 1000000);

  // const downloadTicket = () => {
  //   alert(
  //     "PDF Download Feature will be connected with backend later."
  //   );
  // };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">

      <div className="max-w-4xl mx-auto">

        {/* Success Message */}
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

          <FaCheckCircle
            className="mx-auto text-green-500"
            size={80}
          />

          <h1 className="text-4xl font-bold mt-4">
            Booking Confirmed 🎉
          </h1>

          <p className="text-gray-500 mt-3">
            Your bus ticket has been booked successfully.
          </p>

          <div className="mt-6 inline-block bg-green-100 text-green-700 px-5 py-2 rounded-full font-semibold">
            Booking ID: {bookingId}
          </div>

        </div>

        {/* Ticket */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

          <div className="flex items-center gap-3 mb-6">
            <FaTicketAlt
              className="text-red-600"
              size={28}
            />
            <h2 className="text-2xl font-bold">
              Ticket Details
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="text-gray-500">
                Passenger Name
              </p>

              <p className="font-semibold text-lg">
                 {passengerData?.name}
              </p>
            </div>

            <div>
              <p className="text-gray-500">
                Phone Number
              </p>

              <p className="font-semibold text-lg">
                  {passengerData?.phone}
              </p>
            </div>

            <div>
              <p className="text-gray-500">
                Email
              </p>

              <p className="font-semibold text-lg">
                 {passengerData?.email}
              </p>
            </div>

            <div>
              <p className="text-gray-500">
                Bus ID
              </p>

              <p className="font-semibold text-lg">
                {busId}
              </p>
            </div>

            <div>
              <p className="text-gray-500">
                Selected Seats
              </p>

              <p className="font-semibold text-lg">
                {seats.join(", ")}
              </p>
            </div>

            <div>
              <p className="text-gray-500">
                Total Amount
              </p>

              <p className="font-bold text-2xl text-red-600">
                ₹{amount}
              </p>
            </div>

          </div>

        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-8">

          {/* <button
            onClick={downloadTicket}
            className="flex-1 flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-semibold transition"
          >
            <FaDownload />
            Download Ticket
          </button> */}
          <button onClick={() => navigate("/ticket", { state: bookingData })}
  className="bg-red-600 text-white px-6 py-3 rounded-lg"
>
  View Ticket
</button>

          <Link
            to="/booking-history"
            className="flex-1 flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-semibold transition"
          >
            My Bookings
          </Link>

        </div>

      </div>

    </div>
  );
};

export default BookingSuccess;