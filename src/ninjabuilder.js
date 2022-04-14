"use strict";
// const Ninja = require('./ninja.js');

function asObject(
    id,
    name,
    city,
    country,
    text,
    imagePortraitUrl,
    imageFullUrl
) {
    const obj = {
        id: id,
        name: name,
        city: city,
        country: country,
        text: text,
        imagePortraitUrl: imagePortraitUrl,
        imageFullUrl: imageFullUrl,
    };
    return obj;
}

class NinjaBuilder {
    setId(id) {
        this.id = id;
        return this;
    }

    setName(name) {
        this.name = name;
        return this;
    }

    setCity(city) {
        this.city = city;
        return this;
    }

    setCountry(country) {
        this.country = country;
        return this;
    }

    setText(text) {
        this.text = text;
        return this;
    }

    setPortraitUrl(url) {
        this.imagePortraitUrl = url;
        return this;
    }

    setFullImageUrl(url) {
        this.imageFullUrl = url;
        return this;
    }

    build() {
        let canBuild =
            this.id &&
            this.name &&
            this.city &&
            this.country &&
            this.text &&
            this.imagePortraitUrl &&
            this.imageFullUrl;
        if (canBuild) {
            return asObject(
                this.id,
                this.name,
                this.city,
                this.country,
                this.text,
                this.imagePortraitUrl,
                this.imageFullUrl
            );
        }
        throw new Exception("missing field, cannot build Ninja");
    }
}

module.exports = NinjaBuilder;
