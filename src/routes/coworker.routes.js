"use strict";

const express = require("express");
const controller = require("../controllers/coworker.controller");

const router = express.Router();
/**
 *  @swagger
 *  /coworker/{id}:
 *      get:
 *          summary: Gets a coworker by their ID.
 *          description: Gets a coworker by their ID.
 *          security:
 *          - jwt: []
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: integer
 *                  required: true
 *                  description: The numeric id of the coworker to get, a positive integer.
 *          responses:
 *              "200":
 *                  description: The coworker was found and returned.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                      description: The ID of the coworker.
 *                                      example: 1
 *                                  name:
 *                                      type: string
 *                                      description: The name of the coworker.
 *                                      example: Simon Tenggren
 *                                  city:
 *                                      type: string
 *                                      description: The city the coworker works in.
 *                                      example: Lund
 *                                  country:
 *                                      type: string
 *                                      description: The country code for the country the coworker operates in.
 *                                  text:
 *                                      type: string
 *                                      description: Some text describing the coworker.
 *                                      example: Thanks for letting me have an interview!
 *                                  imagePortraitUrl:
 *                                      type: string
 *                                      description: An URL pointing towards an image displaying a portrait of the coworker.
 *                                      example: https://simontenggren.netlify.app/Images/me.jpg
 *                                  imageFullUrl:
 *                                      type: string
 *                                      description: An URL pointing towards an image displaying a full image of the coworker.
 *                                      example: https://www.instagram.com/p/BzAqOkEILsi/?utm_source=ig_web_copy_link 
 *              "401":
 *                  description: Unauthroized.
 *              "404":
 *                  description: The coworked with the provided id doesn't exist.
 *              "400":
 *                  description: The id is missing or not a positive integer.
 */
router.get("/:id", controller.getCoworker);

module.exports = router;
