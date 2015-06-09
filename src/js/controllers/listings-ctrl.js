'use strict';

var $ = require('../../../node_modules/jquery/dist/jquery.js');
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
  var etsy = new EtsyService({ apiKey: settings.etsyApiKey });
    etsy.listings()
    .done(function (data) {
      showListings();  
      console.log(data);
     
      //show data as HTML
      function showListings(){
        view.render('listings', { listings: data.results.map(viewModel) });
      };
      
      //Bind events
      $('.formSearch').on('submit', function (e) {
        e.preventDefault();
        
        var searchTerm = $('.search').val();
        
        etsy.listings ({keywords: searchTerm})
        .done(showListings)
        .fail(showError);
        });
    
          function showError (req, status, err) {
          console.error(err || status);
          alert('error');
          };
     });
});