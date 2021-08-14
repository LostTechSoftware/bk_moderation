// @collapse
const express = require("express");

const Health = require("../../controllers/Health");

const router = express.Router();

router.get("/", Health);

module.exports = (app) => app.use(router);
