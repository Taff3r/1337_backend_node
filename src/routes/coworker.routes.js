"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/coworker.controller");

router.get("/:id", controller.getCoworker);

module.exports = router;
