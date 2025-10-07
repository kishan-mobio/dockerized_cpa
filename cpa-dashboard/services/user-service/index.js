import dotenv from "dotenv";
import { startServer } from "./app/server.js";

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 8000;

console.log(`Environment PORT: ${process.env.PORT}`);
console.log(`Using PORT: ${PORT}`);

startServer(PORT);
