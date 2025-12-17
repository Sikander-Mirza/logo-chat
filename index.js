// server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

app.use(
  cors({
    origin: "https://logo-wall-street.vercel.app",
  })
);
app.use(express.json());

// Routes
app.use("/chat", chatRoutes);
app.use("/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.send("✅ Backend deployed and running!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Chat/Stripe server running on port", PORT);
});