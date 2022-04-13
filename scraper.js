'use strict';

const puppeteer = require('puppeteer');
const Ninja = require('./ninja.js');
const NinjaBuilder = require('./ninjaBuilder.js');

class tretton37Scraper {
   
    // Get the link to the ninja,
    // then visit the link to gather the information
    // return the info as a new Ninja object
    //html/body/section[2]/div/article/div/div[1]/div/h1/a/
    ///html/body/section[2]/div/article/div/div[1]/div/h1/a/text() 
    async parseNinja(ninjaDivElementPromise, id) {

        // From the div in the list of all ninjas we can extract the following:
        // * The name of the Ninja
        // * Their portrait image url
        // * Their location
        // * An URL to where we can find more info
        let ninjaBuilder = new NinjaBuilder();
        ninjaBuilder.setId(id);
        const ninjaDivElement = await ninjaDivElementPromise;

        const anchorXPath = "div/h1/a";
        const nameWithLocation = await this.getTextContentFromXPath(ninjaDivElement, anchorXPath);

        const ninjaLink = await this.getValueFromPropertyAndXPath(ninjaDivElement, "href", anchorXPath);

        const ninjaPortraitUrl = await this.getValueFromPropertyAndXPath(ninjaDivElement, "src", "a/img");
        ninjaBuilder.setPortraitUrl(ninjaPortraitUrl);

        const locationXPath = "div/h1/a/span";
        const location = (await this.getTextContentFromXPath(ninjaDivElement, locationXPath)).split(" ");
        
        const country = location[0];
        const city = location[1];

        ninjaBuilder.setCity(city).setCountry(country).setName(nameWithLocation.split(country)[0]);
        
        const ninjaPage = await this.browser.newPage();
        await ninjaPage.setDefaultNavigationTimeout(0); // NOTE: This assumes that the page will load eventually.

        // Intercept requests for images
        // No need to traverse the DOM as the images are requested from another domain
        // However this solution assumes that the domain that hosts the images,
        // and <domain>/wallofleet/<name>* for the full image, which might not be true in the future
        await ninjaPage.setRequestInterception(true);
        ninjaPage.on('request', request => {
            if(request.resourceType() === 'image') {
                const url = request.url();
                request.abort();
                if (url.includes("/wallofleet/")) {
                    ninjaBuilder.setFullImageUrl(url);
                } 
                return;
            }
            request.continue();
        });

        // Move on to the "get to know me link"
        // Here we can find the following information:
        // * "about me" Text
        await ninjaPage.goto(ninjaLink); 

        const textXPath = "/html/body/section[2]/div/article/div[2]";
        const textContent = await this.getTextContentFromXPath(ninjaPage, textXPath);

        ninjaBuilder.setText(textContent); 
        return ninjaBuilder.build();
    }

    async getTextContentFromXPath(element, XPath) {
        const [inner] = await element.$x(XPath);
        return await inner.evaluate(el => el.textContent);
    }

    async getValueFromPropertyAndXPath(page, property, XPath) {
        const [element] = await page.$x(XPath);
        const prop = await element.getProperty(property);
        return await prop.jsonValue();
    }

    async scrape() {
        // Constant strings literals related to the website being scraped
        const meetUrl = 'http://tretton37.com/meet';
        const allNinjaSelector 
            = "body > section.site-section.with-shadow.has-buttons > div > article > div > div > div";
        const ninjaDivSelector 
            = id => `body > section.site-section.with-shadow.has-buttons > div > article > div > div:nth-child(${id})`;

        this.browser = await puppeteer.launch({});
        let page = await this.browser.newPage();    
        await page.goto(meetUrl); 

        const numNinjas = await page.$$eval(allNinjaSelector, (divs) => divs.length); // Get number of ninjas

        // Load all into an array of promises, 
        // instead of waiting for each of them to resolve before queuing next one.
        let ninjaPromiseArr = []; 
        for (let i = 1; i <= numNinjas; ++i) {
            ninjaPromiseArr.push(this.parseNinja(page.$(ninjaDivSelector(i)), i - 1));
        }
        
        const finalNinjas = await Promise.all(ninjaPromiseArr);
    
        await this.browser.close();
        return finalNinjas;
    }
};

module.exports = tretton37Scraper;
