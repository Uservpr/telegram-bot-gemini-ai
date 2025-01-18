const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

// Load environment variables
const BOT_API = process.env.BOT_API;
const API_KEY = process.env.API_KEY;

// Initialize Telegram bot
const bot = new TelegramBot(BOT_API, { polling: true });
const genAI = new GoogleGenerativeAI(API_KEY);

// Create Express app
const app = express();
const PORT = 3000;

// Main function
const main = async () => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Telegram bot commands
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Selamat datang! Tanyakan sesuatu, dan saya akan mencoba menjawab.");
  });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const userMessage = msg.text;

    try {
      const result = await model.generateContent([userMessage]);
      const response = result.response.text();
      bot.sendMessage(chatId, response);
    } catch (error) {
      bot.sendMessage(chatId, "Maaf, terjadi kesalahan saat memproses permintaan Anda.");
      console.error("Error:", error.message);
    }
  });

  // Express route
  app.get("/", (req, res) => {
    res.send("Hello World");
  });

  // Start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

main();