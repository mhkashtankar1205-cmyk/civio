const mongoose = require("mongoose");
const path = require("path");

const runMigration = async () => {
  try {
    const uri = "mongodb://civio:project_civio1234@ac-78g4vqv-shard-00-00.kzt8cmb.mongodb.net:27017,ac-78g4vqv-shard-00-01.kzt8cmb.mongodb.net:27017,ac-78g4vqv-shard-00-02.kzt8cmb.mongodb.net:27017/civio?ssl=true&replicaSet=atlas-135z3j-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
    console.log("Connecting to:", uri);
    await mongoose.connect(uri);
    console.log("Connected successfully");

    const User = require("./models/User");

    // Update all users who do not have the 'role' field
    const result = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: "citizen" } }
    );

    console.log(`Migration completed. Updated ${result.modifiedCount || result.nModified || 0} users.`);
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

runMigration();
