const express = require("express");
const cors = require("cors");
const path = require("path");
const apiRoutes = require("./src/routes/api");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes API REST
app.use("/api", apiRoutes);

// Fichiers statiques du Frontend Web
app.use(express.static(path.join(__dirname, "public")));

// Fallback SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`=============================================================`);
    console.log(`🎓 LycéeConnect — ERP de Gestion de Lycée (Togo / Francophone)`);
    console.log(`🚀 Serveur démarré sur http://${HOST}:${PORT}`);
    console.log(`=============================================================`);
  });
}

module.exports = app;
