const express = require("express");
const app = express();
const port = 2500;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/submit", (req, res) => {
  const userInput = req.body.userInput;
  main(userInput);
  res.redirect("/");
});

function main(input) {
  console.log("Received input:", input);
  // Do something with the input
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
