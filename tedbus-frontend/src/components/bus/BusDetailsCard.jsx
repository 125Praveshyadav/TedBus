import {
  FaWifi,
  FaChargingStation,
  FaSnowflake,
  FaStar,
} from "react-icons/fa";

const BusDetailsCard = ({ bus }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <div className="flex flex-col lg:flex-row justify-between">

        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            {bus.name}
          </h2>

          <p className="text-gray-500 mt-2">
            {bus.type}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <FaStar className="text-yellow-400" />

            <span className="font-semibold">
              {bus.rating}
            </span>
          </div>
        </div>

        <div className="mt-4 lg:mt-0 text-right">
          <p className="text-4xl font-bold text-red-600">
            ₹{bus.price}
          </p>

          <p className="text-green-600 mt-1">
            {bus.seats} Seats Available
          </p>
        </div>

      </div>

      <hr className="my-6" />

      <div className="grid md:grid-cols-3 gap-6">

        <div>
          <p className="text-gray-500 text-sm">
            Departure
          </p>

          <h3 className="text-xl font-bold">
            {bus.departure}
          </h3>

          <p>{bus.from}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">
            Duration
          </p>

          <h3 className="text-xl font-bold">
            {bus.duration}
          </h3>
        </div>

        <div>
          <p className="text-gray-500 text-sm">
            Arrival
          </p>

          <h3 className="text-xl font-bold">
            {bus.arrival}
          </h3>

          <p>{bus.to}</p>
        </div>

      </div>

      <hr className="my-6" />

      <h3 className="font-semibold text-lg mb-4">
        Amenities
      </h3>

      <div className="flex flex-wrap gap-4">

        <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg">
          <FaWifi />
          WiFi
        </div>

        <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg">
          <FaChargingStation />
          Charging Point
        </div>

        <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg">
          <FaSnowflake />
          AC
        </div>

      </div>

    </div>
  );
};

export default BusDetailsCard;