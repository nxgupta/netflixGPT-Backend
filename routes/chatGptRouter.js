const { chatWithGpt } = require("../controllers/chatWithGpt");

let route = require("express").Router();
route.post("/chatWithGpt", chatWithGpt);
module.exports = route;
