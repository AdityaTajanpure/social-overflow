const mongoose = require("mongoose");
const config = require("config");

const connectToMongo = async () => {
  let dbUri = config.get("mongoURI");
  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectToMongo;
