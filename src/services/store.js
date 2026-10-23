const fs = require("fs");
const path = require("path");
const { getInitialData } = require("../../data/seedData");

const DB_PATH = path.join(__dirname, "../../data/db.json");

function loadStore() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial = getInitialData();
      saveStore(initial);
      return initial;
    }
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    const initial = getInitialData();
    return initial;
  }
}

function saveStore(data) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  return data;
}

function resetStore() {
  const initial = getInitialData();
  saveStore(initial);
  return initial;
}

module.exports = {
  loadStore,
  saveStore,
  resetStore
};
