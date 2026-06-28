import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const PassengerInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state;

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
  });

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold text-red-500">
          No Booking Data Found
        </h2>
      </div>
    );
  }

  const { busId, seats, amount } = bookingData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate("/payment", {
      state: {
        busId,
        seats,
        amount,
        passenger: formData,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="max-w-6xl mx-auto px-4">

        <h1 className="text-3xl font-bold mb-8">
          Passenger Information 
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="block mb-2 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">

                <div>
                  <label className="block mb-2 font-medium">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">
                      Select Gender
                    </option>
                    <option value="Male">
                      Male
                    </option>
                    <option value="Female">
                      Female
                    </option>
                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-semibold transition"
              >
                Continue To Payment
              </button>
            </form>

          </div>

          {/* Booking Summary */}
          <div className="bg-white rounded-2xl shadow-md p-6 h-fit sticky top-24">

            <h2 className="text-2xl font-bold mb-6">
              Booking Summary
            </h2>

            <div className="space-y-4">

              <div>
                <p className="text-gray-500">
                  Bus ID
                </p>
                <p className="font-semibold">
                  {busId}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Selected Seats
                </p>
                <p className="font-semibold">
                  {seats.join(", ")}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Total Seats
                </p>
                <p className="font-semibold">
                  {seats.length}
                </p>
              </div>

              <hr />

              <div>
                <p className="text-gray-500">
                  Total Amount
                </p>

                <h3 className="text-3xl font-bold text-red-600">
                  ₹{amount}
                </h3>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default PassengerInfo;