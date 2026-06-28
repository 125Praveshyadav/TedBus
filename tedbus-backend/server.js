const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.join(__dirname, "config.env"),
});

const app = require("./app");
const connectDB = require("./src/config/db");
 
connectDB();
console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);
// console.log(process.env.MONGO_URI);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});