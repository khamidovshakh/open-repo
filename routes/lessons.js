const express = require("express");
const router = express.Router();
const Lessons = require("../models/lessons.js");

router.post("/", async (req, res) => {
  try {
    const arr = req.body;

    if (!Array.isArray(arr) || arr.some((text) => typeof text !== "string")) {
      return res.status(400).json({
        error: "Invalid input. Expected an array of strings.",
        message: "Invalid input. Expected an array of strings.",
      });
    }

    // Создаем документы в модели Lessons
    const lessons = await Lessons.insertMany(
      arr.map((text) => ({ title: text }))
    );

    // Отправляем массив созданных элементов обратно
    res.status(200).json(lessons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, message: "Bug processing the request" });
  }
});

module.exports = router;
