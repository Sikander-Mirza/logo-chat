import "dotenv/config";
import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

const allowedOrigins = [
  "https://logo-wall-street.vercel.app",
  "http://localhost:5173", // dev
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow tools or same-origin with no origin header
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn("Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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