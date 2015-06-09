(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var router = require('../router');

router.route('listings/:id', function (id) {
  // TODO: Show the listing details page, load listing by id from Etsy, etc...
});
},{"../router":4}],2:[function(require,module,exports){
'use strict';

var router = require('../router');
var settings = require('../settings');
var EtsyService = require('../services/etsy-service');
var view = require('../utils/view');

// Convert the Etsy data model into a form that is more easy for our templates
function viewModel(listing) {
  return {
    id: listing.listing_id,
    imgUrl: listing.MainImage.url_170x135,
    description: listing.description,
    price: listing.price,
    tags: listing.tags,
    breadCrumb: listing.taxonomy_path,
    title: listing.title,
    externalUrl: listing.url,
    userId: listing.user_id 
  };
}

router.route('', 'listings', function () {
  // TODO: Show the listings page, load listings from Etsy, etc...
  new EtsyService({ apiKey: settings.etsyApiKey })
    .listings()
    .done(function (data) {
      console.log(data);
      view.render('listings', { listings: data.results.map(viewModel) });
    })
    .fail(function (req, status, err) {
      console.error(err || status);
    });
});
},{"../router":4,"../services/etsy-service":5,"../settings":6,"../utils/view":8}],3:[function(require,module,exports){
'use strict';

var router = require('./router');


// Require all controllers (which register their own routes)
({"controllers":({"listing-ctrl":require("./controllers/listing-ctrl.js"),"listings-ctrl":require("./controllers/listings-ctrl.js")})});

// Start the router
router.init();
},{"./controllers/listing-ctrl.js":1,"./controllers/listings-ctrl.js":2,"./router":4}],4:[function(require,module,exports){
'use strict';

var SortedRouter = require('./utils/sorted-router');

module.exports = new SortedRouter();
},{"./utils/sorted-router":7}],5:[function(require,module,exports){
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
  listings: function () {
    var url = this.baseUrl + '/listings/active.js?includes=MainImage&api_key=' + this.apiKey + '&callback=?';
    return this.fetchUrl(url);
  }
};

module.exports = EtsyService;

},{"jquery":"jquery"}],6:[function(require,module,exports){
'use strict';

module.exports = { 
  etsyApiKey: 'ei1ylxodk7a7gd5w823kdtjn' 
};
},{}],7:[function(require,module,exports){
'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

// A wrapper around Backbone router that understands specificity
function SortedRouter(router) {
  this.router = router || new Backbone.Router();
  this.routes = {};
}
 
SortedRouter.prototype = {
  // Takes 1 or more urls and a callback function and adds them as routes
  route: function () {
    var len = arguments.length - 1,
        callback = arguments[arguments.length - 1];
 
    for (var i = 0; i < len; ++i) {
      this.routes[arguments[i]] = callback;
    }
  },
 
  init: function () {
    // A magic number to force a route to be lowest specificity
    // Number.MIN_VALUE didn't work...
    var lowestRoute = -1000000,
        me = this;
 
    // Register all routes, sorted by specificity
    _.chain(_.pairs(this.routes))
      .sortBy(function (route) {
        var url = route[0];
 
        if (url.indexOf('*') >= 0) {
          return lowestRoute;
        } else {
          return -url.split(':').length;
        }
      })
      .each(function (route) {
        me.router.route(route[0], route[1]);
      });
 
    // Start the backbone routing subsystem
    Backbone.history.start();
  }
};

module.exports = SortedRouter;
},{"backbone":"backbone","underscore":"underscore"}],8:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var _ = require('underscore');

var views = require('views');

module.exports = {
  render: function (templateKey, model) {
    $('.main-content').html(this.hydrate(templateKey, model)); 
  },
  
  hydrate: function (templateKey, model) {
    var viewFn = _.template(views[templateKey], { variable: 'm' });
    return viewFn(model);
  }
};
},{"jquery":"jquery","underscore":"underscore","views":"views"}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29udHJvbGxlcnMvbGlzdGluZy1jdHJsLmpzIiwic3JjL2pzL2NvbnRyb2xsZXJzL2xpc3RpbmdzLWN0cmwuanMiLCJzcmMvanMvaW5pdC5qcyIsInNyYy9qcy9yb3V0ZXIuanMiLCJzcmMvanMvc2VydmljZXMvZXRzeS1zZXJ2aWNlLmpzIiwic3JjL2pzL3NldHRpbmdzLmpzIiwic3JjL2pzL3V0aWxzL3NvcnRlZC1yb3V0ZXIuanMiLCJzcmMvanMvdXRpbHMvdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciByb3V0ZXIgPSByZXF1aXJlKCcuLi9yb3V0ZXInKTtcblxucm91dGVyLnJvdXRlKCdsaXN0aW5ncy86aWQnLCBmdW5jdGlvbiAoaWQpIHtcbiAgLy8gVE9ETzogU2hvdyB0aGUgbGlzdGluZyBkZXRhaWxzIHBhZ2UsIGxvYWQgbGlzdGluZyBieSBpZCBmcm9tIEV0c3ksIGV0Yy4uLlxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcm91dGVyID0gcmVxdWlyZSgnLi4vcm91dGVyJyk7XG52YXIgc2V0dGluZ3MgPSByZXF1aXJlKCcuLi9zZXR0aW5ncycpO1xudmFyIEV0c3lTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2VydmljZXMvZXRzeS1zZXJ2aWNlJyk7XG52YXIgdmlldyA9IHJlcXVpcmUoJy4uL3V0aWxzL3ZpZXcnKTtcblxuLy8gQ29udmVydCB0aGUgRXRzeSBkYXRhIG1vZGVsIGludG8gYSBmb3JtIHRoYXQgaXMgbW9yZSBlYXN5IGZvciBvdXIgdGVtcGxhdGVzXG5mdW5jdGlvbiB2aWV3TW9kZWwobGlzdGluZykge1xuICByZXR1cm4ge1xuICAgIGlkOiBsaXN0aW5nLmxpc3RpbmdfaWQsXG4gICAgaW1nVXJsOiBsaXN0aW5nLk1haW5JbWFnZS51cmxfMTcweDEzNSxcbiAgICBkZXNjcmlwdGlvbjogbGlzdGluZy5kZXNjcmlwdGlvbixcbiAgICBwcmljZTogbGlzdGluZy5wcmljZSxcbiAgICB0YWdzOiBsaXN0aW5nLnRhZ3MsXG4gICAgYnJlYWRDcnVtYjogbGlzdGluZy50YXhvbm9teV9wYXRoLFxuICAgIHRpdGxlOiBsaXN0aW5nLnRpdGxlLFxuICAgIGV4dGVybmFsVXJsOiBsaXN0aW5nLnVybCxcbiAgICB1c2VySWQ6IGxpc3RpbmcudXNlcl9pZCBcbiAgfTtcbn1cblxucm91dGVyLnJvdXRlKCcnLCAnbGlzdGluZ3MnLCBmdW5jdGlvbiAoKSB7XG4gIC8vIFRPRE86IFNob3cgdGhlIGxpc3RpbmdzIHBhZ2UsIGxvYWQgbGlzdGluZ3MgZnJvbSBFdHN5LCBldGMuLi5cbiAgbmV3IEV0c3lTZXJ2aWNlKHsgYXBpS2V5OiBzZXR0aW5ncy5ldHN5QXBpS2V5IH0pXG4gICAgLmxpc3RpbmdzKClcbiAgICAuZG9uZShmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICB2aWV3LnJlbmRlcignbGlzdGluZ3MnLCB7IGxpc3RpbmdzOiBkYXRhLnJlc3VsdHMubWFwKHZpZXdNb2RlbCkgfSk7XG4gICAgfSlcbiAgICAuZmFpbChmdW5jdGlvbiAocmVxLCBzdGF0dXMsIGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIgfHwgc3RhdHVzKTtcbiAgICB9KTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJvdXRlciA9IHJlcXVpcmUoJy4vcm91dGVyJyk7XG5cblxuLy8gUmVxdWlyZSBhbGwgY29udHJvbGxlcnMgKHdoaWNoIHJlZ2lzdGVyIHRoZWlyIG93biByb3V0ZXMpXG4oe1wiY29udHJvbGxlcnNcIjooe1wibGlzdGluZy1jdHJsXCI6cmVxdWlyZShcIi4vY29udHJvbGxlcnMvbGlzdGluZy1jdHJsLmpzXCIpLFwibGlzdGluZ3MtY3RybFwiOnJlcXVpcmUoXCIuL2NvbnRyb2xsZXJzL2xpc3RpbmdzLWN0cmwuanNcIil9KX0pO1xuXG4vLyBTdGFydCB0aGUgcm91dGVyXG5yb3V0ZXIuaW5pdCgpOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIFNvcnRlZFJvdXRlciA9IHJlcXVpcmUoJy4vdXRpbHMvc29ydGVkLXJvdXRlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBTb3J0ZWRSb3V0ZXIoKTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbmZ1bmN0aW9uIEV0c3lTZXJ2aWNlIChzcGVjKSB7XG4gIGlmICghc3BlYy5hcGlLZXkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0FuIEFQSSBrZXkgaXMgcmVxdWlyZWQhJyk7XG4gIH1cbiAgXG4gIHRoaXMuYXBpS2V5ID0gc3BlYy5hcGlLZXk7XG4gIHRoaXMuYmFzZVVybCA9ICdodHRwczovL29wZW5hcGkuZXRzeS5jb20vJyArIChzcGVjLmFwaVZlcnNpb24gfHwgJ3YyJyk7XG59XG5cbkV0c3lTZXJ2aWNlLnByb3RvdHlwZSA9IHtcbiAgLy8gRmV0Y2ggZGF0YSBmcm9tIHRoZSBzcGVjaWZpZWQgVVJMLCBpZiB0aGUgcmVzcG9uc2UgZnJvbSBFdHN5IGlzIGFuIGVycm9yLFxuICAvLyB3ZSByZWplY3QgdGhlIHByb21pc2UsIG90aGVyd2lzZSB3ZSByZXNvbHZlIHRoZSBwcm9taXNlLlxuICBmZXRjaFVybDogZnVuY3Rpb24gKHVybCkge1xuICAgIHZhciBwcm9taXNlID0gJC5EZWZlcnJlZCgpO1xuXG4gICAgdmFyIHJlcSA9ICQuZ2V0SlNPTih1cmwpLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIGlmICghZGF0YS5vaykge1xuICAgICAgICAvLyBLZWVwIG91ciByZWplY3Rpb24gaW4gbGluZSB3aXRoIHRoZSBzdGFuZGFyZCBqUXVlcnlcbiAgICAgICAgLy8gcmVqZWN0aW9uLCBwYXNzaW5nIHJlcSBhcyBmaXJzdCBhcmd1bWVudCwgc3RhdHVzIGFzIHNlY29uZFxuICAgICAgICAvLyBhbmQgZXJyb3Igb2JqZWN0IGFzIHRoZSB0aGlyZFxuICAgICAgICBwcm9taXNlLnJlamVjdChyZXEsICdVbmtub3duIGVycm9yJywgZGF0YSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcm9taXNlLnJlc29sdmUoZGF0YSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfSxcbiAgXG4gIC8vIEdldHMgbGlzdGluZ3MgZnJvbSBFdHN5XG4gIGxpc3RpbmdzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHVybCA9IHRoaXMuYmFzZVVybCArICcvbGlzdGluZ3MvYWN0aXZlLmpzP2luY2x1ZGVzPU1haW5JbWFnZSZhcGlfa2V5PScgKyB0aGlzLmFwaUtleSArICcmY2FsbGJhY2s9Pyc7XG4gICAgcmV0dXJuIHRoaXMuZmV0Y2hVcmwodXJsKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdHN5U2VydmljZTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7IFxuICBldHN5QXBpS2V5OiAnZWkxeWx4b2RrN2E3Z2Q1dzgyM2tkdGpuJyBcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5cbi8vIEEgd3JhcHBlciBhcm91bmQgQmFja2JvbmUgcm91dGVyIHRoYXQgdW5kZXJzdGFuZHMgc3BlY2lmaWNpdHlcbmZ1bmN0aW9uIFNvcnRlZFJvdXRlcihyb3V0ZXIpIHtcbiAgdGhpcy5yb3V0ZXIgPSByb3V0ZXIgfHwgbmV3IEJhY2tib25lLlJvdXRlcigpO1xuICB0aGlzLnJvdXRlcyA9IHt9O1xufVxuIFxuU29ydGVkUm91dGVyLnByb3RvdHlwZSA9IHtcbiAgLy8gVGFrZXMgMSBvciBtb3JlIHVybHMgYW5kIGEgY2FsbGJhY2sgZnVuY3Rpb24gYW5kIGFkZHMgdGhlbSBhcyByb3V0ZXNcbiAgcm91dGU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDEsXG4gICAgICAgIGNhbGxiYWNrID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXTtcbiBcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICB0aGlzLnJvdXRlc1thcmd1bWVudHNbaV1dID0gY2FsbGJhY2s7XG4gICAgfVxuICB9LFxuIFxuICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gQSBtYWdpYyBudW1iZXIgdG8gZm9yY2UgYSByb3V0ZSB0byBiZSBsb3dlc3Qgc3BlY2lmaWNpdHlcbiAgICAvLyBOdW1iZXIuTUlOX1ZBTFVFIGRpZG4ndCB3b3JrLi4uXG4gICAgdmFyIGxvd2VzdFJvdXRlID0gLTEwMDAwMDAsXG4gICAgICAgIG1lID0gdGhpcztcbiBcbiAgICAvLyBSZWdpc3RlciBhbGwgcm91dGVzLCBzb3J0ZWQgYnkgc3BlY2lmaWNpdHlcbiAgICBfLmNoYWluKF8ucGFpcnModGhpcy5yb3V0ZXMpKVxuICAgICAgLnNvcnRCeShmdW5jdGlvbiAocm91dGUpIHtcbiAgICAgICAgdmFyIHVybCA9IHJvdXRlWzBdO1xuIFxuICAgICAgICBpZiAodXJsLmluZGV4T2YoJyonKSA+PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIGxvd2VzdFJvdXRlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAtdXJsLnNwbGl0KCc6JykubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmVhY2goZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICAgIG1lLnJvdXRlci5yb3V0ZShyb3V0ZVswXSwgcm91dGVbMV0pO1xuICAgICAgfSk7XG4gXG4gICAgLy8gU3RhcnQgdGhlIGJhY2tib25lIHJvdXRpbmcgc3Vic3lzdGVtXG4gICAgQmFja2JvbmUuaGlzdG9yeS5zdGFydCgpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNvcnRlZFJvdXRlcjsiLCIndXNlIHN0cmljdCc7XG5cbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcblxudmFyIHZpZXdzID0gcmVxdWlyZSgndmlld3MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJlbmRlcjogZnVuY3Rpb24gKHRlbXBsYXRlS2V5LCBtb2RlbCkge1xuICAgICQoJy5tYWluLWNvbnRlbnQnKS5odG1sKHRoaXMuaHlkcmF0ZSh0ZW1wbGF0ZUtleSwgbW9kZWwpKTsgXG4gIH0sXG4gIFxuICBoeWRyYXRlOiBmdW5jdGlvbiAodGVtcGxhdGVLZXksIG1vZGVsKSB7XG4gICAgdmFyIHZpZXdGbiA9IF8udGVtcGxhdGUodmlld3NbdGVtcGxhdGVLZXldLCB7IHZhcmlhYmxlOiAnbScgfSk7XG4gICAgcmV0dXJuIHZpZXdGbihtb2RlbCk7XG4gIH1cbn07Il19
