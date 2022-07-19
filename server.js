const express = require("express");
const connectToDB = require("./config/db");
const path = require("path");
const app = express();

app.use(express.json({ extended: false }));

//Connect to database
connectToDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// app.get("/", (_, res) => {
//   res.send(`Server is started`);
// });

// Defining Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));

//Serve static assets in production
if (process.env.NODE_ENV === "production") {
  //Set a static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
