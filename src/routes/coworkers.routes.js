"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/coworkers.controller");

/**
 * @swagger
 *  /coworkers:
 *      get:
 *          summary: Get an amount of coworkers.
 *          description: Get all or a range of coworkers.
 *          security:
 *          - jwt: []
 *          parameters:
 *              - in: query
 *                name: start
 *                schema:
 *                type: integer
 *                description: The begining of the range of coworkers that is requested.
 *              - in: query
 *                name: end
 *                schema:
 *                type: integer
 *                description: The end of the range of coworkers that is requested.
 *          responses:
 *              "200":
 *                  description: Success. All or the range of coworkers is returned.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  data:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              id:
 *                                                  type: integer
 *                                                  description: The ID of the coworker.
 *                                                  example: 1
 *                                              name:
 *                                                  type: string
 *                                                  description: The name of the coworker.
 *                                                  example: Simon Tenggren
 *                                              city:
 *                                                  type: string
 *                                                  description: The city the coworker works in.
 *                                                  example: Lund
 *                                              country:
 *                                                  type: string
 *                                                  description: The country code for the country the coworker operates in.
 *                                              text:
 *                                                  type: string
 *                                                  description: Some text describing the coworker.
 *                                                  example: Thanks for letting me have an interview!
 *                                              imagePortraitUrl:
 *                                                  type: string
 *                                                  description: An URL pointing towards an image displaying a portrait of the coworker.
 *                                                  example: https://simontenggren.netlify.app/Images/me.jpg
 *                                              imageFullUrl:
 *                                                  type: string
 *                                                  description: An URL pointing towards an image displaying a full image of the coworker.
 *                                                  example: https://www.instagram.com/p/BzAqOkEILsi/?utm_source=ig_web_copy_link*
 *                                  totalLength:
 *                                      type: integer
 *                                      description: The total number of coworkers available.
 *                                      example: 123
 *
 *              "401":
 *                  description: Unauthorized.
 *              "404":
 *                  description: The lower range given by the start parameter is higher than the total amount of coworkers.
 *              "400":
 *                  description: One of the query parameters (begin or end) is missing, or the request is not formatted correctly.
 *
 */
router.get("/", controller.getCoworkers);

module.exports = router;
