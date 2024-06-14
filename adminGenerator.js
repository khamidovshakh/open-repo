const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const axios = require("axios");
const models = require("./models");

// ENV
require("dotenv").config();

// Only for local usage
const devEndpoint = process.env.DEV_ENDPOINT;
const endpoint = devEndpoint;

mongoose.connect("mongodb://localhost:27017/crm", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function generateData() {
  // first of all create admin account
  const url = endpoint + "/sign/register/admins";
  let obj = {
    phone: "998915367667",
    password: "password",
    lcid: "6664a2c9ad81d6352496869d",
    name: "Shakh Khamidov",
    birthday: "24.01.2001",
    sex: "male",
    role: "manager",
  };
  const response = await axios.post(url, obj);
}

// Запуск генерации данных
generateData()
  .then(() => mongoose.disconnect())
  .catch((error) => {
    console.error("Error generating data:", error);
    mongoose.disconnect();
  });
