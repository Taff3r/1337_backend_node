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
        let responseJson = {
            data : data,
            totalLength : data.length
        };
        res.status(200).json(responseJson);
    });

    app.get('/api/coworker/:id', (req, res) => {
        const id = validateIntegerParameter(req.params.id);
        if (id >= 1) { 
            if (id > data.length) { // Not found
                res.status(404);
                return;
            } else {
                res.status(200).json(data[id - 1]);
            }
            return;
        }
        res.status(400);
    });
    
})();

// Validate that a parameter is a positive integer
// @param parameter that should be validated.
// @returns the parsed parameter as an integer, or 0 if the parameter couldn't be parsed as an integer
const validateIntegerParameter = (parameter) => {
    const id = parseInt(parameter);
    return (isNaN(id) || id < 1) ? 0 : id;
};


