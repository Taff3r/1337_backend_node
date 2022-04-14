"use strict";

class Ninja {
    constructor(id, name, city, country, text, imagePortraitUrl, imageFullUrl) {
        this.id = id;
        this.name = name;
        this.city = city;
        this.country = country;
        this.text = text;
        this.imagePortraitUrl = imagePortraitUrl;
        this.imageFullUrl = imageFullUrl;
    }
}

module.exports = Ninja;
