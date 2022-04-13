'use strict';
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const tretton37Scraper = require('./scraper.js');

const app = express();

app.use(cors({ origin : 'https://backend-assignment.1337co.de' }));

const filePath = './data.json';

(async () => {
    let data;
    if (!fs.existsSync(filePath)) {
        console.debug("Missing data, starting scraper.");
        const scraper = new tretton37Scraper();
        const data = await scraper.scrape();
        console.debug("Scraping complete, Saving data to %s.", filePath);
        fs.writeFileSync(filePath, JSON.stringify(data));
    } else {
        data = require(filePath);
        console.debug("Loaded %d ninjas from %s", data.length, filePath);
    }

    // Start server and scrape the data using the 1337Scraper
    var server = app.listen(1337, () => {
        const serverInfo = server.address();
        let host = serverInfo.address;
        let port = serverInfo.port;

        console.log("Starting the server on %s:%s", host, port);

    });

    app.get('/', (req, res) => {
        res.send("Hello there!");
    });

    app.get('/api/coworkers', (req, res) => {
        let responseData;
        const reqLower = req.query.start;
        const reqUpper = req.query.end;
     
        console.log("Got request");
        // Check if both params are present
        if (reqUpper && reqLower) {

            const upper = validateIntegerParameter(reqUpper);
            const lower = validateIntegerParameter(reqLower);
            
            if (upper < lower) {
                console.log("bad request");
                res.status(400).send();
                return;
            }
            if (lower <= data.length && lower >= 0) {
                if (lower <= upper) {
                    responseData = data.slice(lower, upper);
                } else if (data.length <= upper) {
                    responseData = data.slice(lower, data.length - 1);
                } else { // Bad format, lower > upper
                    res.status(400).send();
                    return;
                }
            } else {
                // Bad request
                res.status(400).send();
                return;
            }
        } else if ((reqLower && !reqUpper) || (!reqLower && reqUpper)){  
            // If one param is missing, return error code, since bad request.
            res.status(400).send();
            return;
        } else {
            // No parameters, send all the data
            responseData = data;
        }

        let responseJson = {
            data : responseData,
            totalLength : data.length
        };

        res.status(200).json(responseJson);
    });

    app.get('/api/coworker/:id', (req, res) => {
        const id = validateIntegerParameter(req.params.id);
        if (id >= 1) { 
            if (id > data.length) { // Not found
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
    return (isNaN(id) || id < 0) ? -1 : id;
};


