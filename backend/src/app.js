require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "CasaLivraison API running " });
});

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Unable to connect to the database:", err.message);
  }
})();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
