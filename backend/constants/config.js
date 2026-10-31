import "dotenv/config";

const corsOptions = {
  origin: (process.env.CLIENT_URL || "http://localhost:5173,http://localhost:5174,http://localhost:5175").split(",").map((origin) => origin.trim()).filter(Boolean),
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};


const CHATTU_TOKEN = "chattu-token";

export { corsOptions, CHATTU_TOKEN };
