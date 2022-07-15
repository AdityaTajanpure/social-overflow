const express = require("express");
const connectToDB = require("./config/db");

const app = express();

app.use(express.json({ extended: false }));

//Connect to database
connectToDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

app.get("/", (_, res) => {
  res.send(`Server is started`);
});

// Defining Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));
