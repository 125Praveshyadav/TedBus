import {useState} from "react-router-dom"
const useBooking = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  return {
    selectedSeats,
    setSelectedSeats,
  };
};
export default useBooking;