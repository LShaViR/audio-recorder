import dotenv from "dotenv";

dotenv.config();

export const MAX_RETRIES = 5;
export const INITIAL_DELAY_MS = 1000;
export const BACKEND_URL = process.env.BACKEND_URL;
