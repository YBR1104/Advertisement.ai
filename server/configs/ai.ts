import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv"
dotenv.config();
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_CLOUD_API_KEY,
})
console.log("API KEY:", process.env.GOOGLE_CLOUD_API_KEY);
export default ai;