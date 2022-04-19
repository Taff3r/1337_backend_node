"use strict";

const fs = require("fs");
const tretton37Scraper = require("../../util/scraping/scraper.js");

/**
 * Trys to load any data that might be stored in a file on disk when module is loaded,
 * if the file is not found scrapes it using the tretton37scraper
 * @returns the loaded or scraped data.
 */
const coworkerData = (async () => {
    const filePath = "./data.json";
    let coworkerData;
    if (!fs.existsSync(filePath)) {
        console.debug("No data found. Starting scraper.");
        const scraper = new tretton37Scraper();
        const coworkerData = await scraper.scrape();
        console.debug("Scraping complete. Saving data");
        fs.writeFileSync(filePath, JSON.stringify(coworkerData));
    } else {
        console.debug("loaded data from file");
        coworkerData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
    return coworkerData;
})();

module.exports.getCoworker = async (id) => {
    return (await coworkerData)[id - 1];
}

module.exports.getCoworkers = async () => {
    return await coworkerData;
};

module.exports.getNumberOfCoworkers = async () => {
    return (await coworkerData).length;
};

module.exports.getCoworkerSpan = async (from, to) => {
    return (await coworkerData).slice(from, to);
};



