require("dotenv").config();
const mongoose = require("mongoose");

async function test() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ SUCCESS: MongoDB Connected");
    process.exit(0);
  } catch (err) {
    console.error("❌ FULL ERROR:");
    console.error(err);
    process.exit(1);
  }
}

test();