'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  // normalizedName ==> Accept  Content-Type
  console.log(headers);
  utils.forEach(headers, function processHeader(value, name) {
    console.log(headers[name]);
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
    console.log(headers);
  });
};
