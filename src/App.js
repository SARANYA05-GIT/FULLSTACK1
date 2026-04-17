import { useEffect, useState } from "react";

function App() {
  const [tickets, setTickets] = useState(0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    place: "",
    count: 1
  });

  const [message, setMessage] = useState("");
  const [bookingList, setBookingList] = useState([]);

  // Load tickets
  useEffect(() => {
    fetch("http://localhost:5000/tickets")
      .then(res => res.json())
      .then(data => setTickets(data.tickets))
      .catch(err => console.log(err));
  }, []);

  // Handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Book ticket
  const handleBooking = async () => {
    const res = await fetch("http://localhost:5000/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        count: Number(form.count)
      })
    });

    const data = await res.json();

    if (data.success) {
      setTickets(data.remaining);
      setMessage(`✅ Booking successful! Total: ₹${data.booking.total}`);

      setForm({
        name: "",
        email: "",
        place: "",
        count: 1
      });
    } else {
      setMessage(`❌ ${data.message}`);
    }
  };

  // Load bookings
  const loadBookings = () => {
    fetch("http://localhost:5000/bookings")
      .then(res => res.json())
      .then(data => setBookingList(data))
      .catch(err => console.log(err));
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎟 Event Booking System</h1>

        <div style={styles.ticketBox}>
          Available Tickets:{" "}
          <span style={styles.highlight}>{tickets}</span>
        </div>

        <div style={styles.form}>
          <input
            style={styles.input}
            name="name"
            placeholder="Enter Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="place"
            placeholder="Enter Place"
            value={form.place}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="count"
            type="number"
            min="1"
            value={form.count}
            onChange={handleChange}
          />

          <button style={styles.button} onClick={handleBooking}>
            🎫 Book Ticket
          </button>

          <p style={styles.message}>{message}</p>
        </div>

        <hr style={{ margin: "20px 0" }} />

        <button style={styles.viewBtn} onClick={loadBookings}>
          View Bookings
        </button>

        <div style={styles.list}>
          {bookingList.map((b) => (
            <div key={b.id} style={styles.listItem}>
              <b>{b.name}</b> | {b.place} | {b.count} tickets | ₹{b.total}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

// 🎨 STYLES
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    fontFamily: "Arial"
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "15px",
    width: "420px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    textAlign: "center"
  },

  title: {
    marginBottom: "10px",
    color: "#2a5298"
  },

  ticketBox: {
    marginBottom: "20px",
    fontSize: "18px"
  },

  highlight: {
    color: "green",
    fontWeight: "bold"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none"
  },

  button: {
    padding: "10px",
    background: "#2a5298",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  viewBtn: {
    padding: "8px",
    background: "#444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  message: {
    marginTop: "10px",
    fontWeight: "bold"
  },

  list: {
    marginTop: "15px",
    textAlign: "left"
  },

  listItem: {
    background: "#f5f5f5",
    padding: "8px",
    margin: "5px 0",
    borderRadius: "6px"
  }
};