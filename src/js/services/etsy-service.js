'use strict';

var $ = require('jquery');

function EtsyService (spec) {
  if (!spec.apiKey) {
    throw new Error('An API key is required!');
  }
  
  this.apiKey = spec.apiKey;
  this.baseUrl = 'https://openapi.etsy.com/' + (spec.apiVersion || 'v2');
}

EtsyService.prototype = {
  // Fetch data from the specified URL, if the response from Etsy is an error,
  // we reject the promise, otherwise we resolve the promise.
  fetchUrl: function (url) {
    var promise = $.Deferred();

    var req = $.getJSON(url).done(function (data) {
      if (!data.ok) {
        // Keep our rejection in line with the standard jQuery
        // rejection, passing req as first argument, status as second
        // and error object as the third
        promise.reject(req, 'Unknown error', data);
      } else {
        promise.resolve(data);
      }
    });

    return promise;
  },
  
  // Gets listings from Etsy
  listings: function (args) {
    var args = args || {};
        var url = this.baseUrl + '/listings/active.js?includes=MainImage&keywords=' + encodeURIComponent(args.keywords) + '&api_key=' + this.apiKey + '&callback=?';

    //keyword=' + encodeURIComponent(args.keywords) + '
    return this.fetchUrl(url);
  }
};

module.exports = EtsyService;
