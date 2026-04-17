const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let tickets = 50;
let bookings = [];

// GET available tickets
app.get("/tickets", (req, res) => {
  res.json({ tickets });
});

// BOOK ticket
app.post("/book", (req, res) => {
  const { name, email, place, count } = req.body;

  // validation
  if (!name || !email || !place || !count) {
    return res.json({ success: false, message: "Fill all fields" });
  }

  if (count <= 0) {
    return res.json({ success: false, message: "Invalid ticket count" });
  }

  if (count > tickets) {
    return res.json({ success: false, message: "Not enough tickets" });
  }

  const newBooking = {
    id: Date.now(),
    name,
    email,
    place,
    count,
    total: count * 100,
  };

  bookings.push(newBooking);
  tickets -= count;

  res.json({
    success: true,
    message: "Ticket booked successfully",
    booking: newBooking,
    remaining: tickets,
  });
});

// GET bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// START server
app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});