const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);

// Сканируем папку routes и подключаем все файлы, кроме index.js
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const route = require(path.join(__dirname, file));
    router.use(`/${path.basename(file, ".js")}`, route);
  });

module.exports = router;
