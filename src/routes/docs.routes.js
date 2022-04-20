"use strict";
const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const router = express.Router();

const docs = swaggerJsDoc({
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "1337 Backend Assignment API Docs",
            version: "0.1.0",
            description:
                "The documentation sub-assignment for the 1337-backend assignment",
        },
        contact: {
            name: "Simon Tenggren",
            url: "http://simontenggren.xyz",
            email: "simon.tenggren@gmail.com",
        },
        servers: [
            {
                url: "http://localhost:1337/api/",
            },
        ],
    },
    apis: ["./**/*.routes.js"],
});
console.log(docs);
const setup = swaggerUi.setup(docs, { explorer: true });
router.use("/docs", swaggerUi.serve, setup);

module.exports = router;
