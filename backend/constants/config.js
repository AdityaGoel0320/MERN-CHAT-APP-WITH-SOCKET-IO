import "dotenv/config";
import { frontendUrl } from "../backendConstant.js";

const corsOptions = {
  origin: frontendUrl,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};


const chatAppToken_TOKEN = "chatAppToken-token";

export { corsOptions, chatAppToken_TOKEN };
