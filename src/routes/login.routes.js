"use strict";

const express = require("express");
const controller = require("../controllers/auth.controller");
const router = express.Router();

/**
 * @swagger
 *  /login:
 *      post:
 *          summary: Authenticates a user by signing a JWT.
 *          description: Authenticates a user by signing a JWT with a provided a username. The JWT is valid for two hours after signing.
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                              - username
 *                          properties:
 *                              username:
 *                                  type: string
 *                                  description: the name of the user to be authenticated.
 *          responses:
 *              "200":
 *                  description: The authentication was successful, signed JWT returned in response.
 *                  content:
 *                      text/plain:
 *                          schema:
 *                              type: string
 *                          example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoic3RyaW5nIn0sImV4cCI6MTY1MDQ2NzMwMCwiaWF0IjoxNjUwNDYwMTAwfQ.Zd2FUcKrgIH2Vgvw_5MMMOWTMlJ2pF5dSwcWzdoaJZ0
 *              "400":
 *                  description: The username was mising from the request body.
 */
router.post("/", controller.authenticate);

module.exports = router;
