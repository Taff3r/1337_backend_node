"use strict";
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const tretton37Scraper = require("./scraper.js");

const app = express();

app.use(cors({ origin: "https://backend-assignment.1337co.de" }));

const filePath = "./data.json";

const loadData = async () => {
    let coworkerData;
    if (!fs.existsSync(filePath)) {
        console.debug("No data found. Starting scraper.");
        const scraper = new tretton37Scraper();
        const coworkerData = await scraper.scrape();
        console.debug("Scraping complete. Saving data");
        fs.writeFileSync(filePath, JSON.stringify(coworkerData));
    } else {
        coworkerData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
    return coworkerData;
};

(async () => {
    const data = await loadData();

    // Start server and scrape the data using the 1337Scraper
    var server = app.listen(1337, () => {
        const serverInfo = server.address();
        const host = serverInfo.address;
        const port = serverInfo.port;
        console.log("Starting the server on %s:%s", host, port);
    });

    app.get("/", (req, res) => {
        res.send("Hello there!");
    });

    /**
     * Validates the pagiation parameters, if they are present
     * @param lower, the queried lower bound
     * @param upper, the queried upper bound
     * @return a HTTP Status code
     */
    const validatePagiation = (lower, upper) => {
        /* Upper can never be less than lower */
        if (upper < lower) {
            return [400, lower, upper];
        }

        /* One part missing? */
        if ((upper && !lower) || (!upper && lower)) {
            return [400, lower, upper];
        }

        /* Lower out of bound? */
        if (lower > data.length || lower < 0) {
            return [404, lower, upper];
        }

        return [200, lower, upper];
    };

    app.get("/api/coworkers", (req, res) => {
        let responseData;

        // Check if both params are present
        if (req.query.start && req.query.end) {
            const [status, lower, upper] = validatePagiation(
                req.query.start,
                req.query.end
            );

            if (status !== 200) {
                res.status(status).send();
            }

            let upperBound = data.length < upper ? data.length : upper;

            responseData = data.slice(lower, upperBound);
        } else {
            responseData = data;
        }

        const responseJson = {
            data: responseData,
            totalLength: data.length,
        };
        console.log(responseJson);
        res.status(200).json(responseJson);
    });

    app.get("/api/coworker/:id", (req, res) => {
        const id = validateIntegerParameter(req.params.id);
        if (id >= 1) {
            if (id > data.length) {
                // Not found
                res.status(404).send();
                return;
            } else {
                res.status(200).json(data[id - 1]);
            }
            return;
        }
        res.status(400);
    });
})();

// Validate that a parameter is a positive integer (0 included)
// @param parameter that should be validated.
// @returns the parsed parameter as an integer, or -1 if the parameter couldn't be parsed as a positive integer
const validateIntegerParameter = (parameter) => {
    const id = parseInt(parameter);
    return isNaN(id) || id < 0 ? -1 : id;
};
