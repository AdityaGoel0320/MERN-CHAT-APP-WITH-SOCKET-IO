import "dotenv/config";
import { frontendUrl } from "../backendConstant.js";

const corsOptions = {
  origin: frontendUrl,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};


const CHATTU_TOKEN = "chattu-token";

export { corsOptions, CHATTU_TOKEN };
