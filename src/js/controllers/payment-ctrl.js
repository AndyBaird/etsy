'use strict';

  // var $ = require('../../../node_modules/jquery/dist/jquery.js');
  var router = require('../router');
  var settings = require('../settings');
  var _ = require('../../../node_modules/underscore/underscore.js');
  var parsley = require('../../../node_modules/parsleyjs/dist/parsley.js');
  var view = require('../utils/view');

    $(".header-payment").click(function (){
     $(".payment-container").fadeIn(); 
    });
  
      $(".btn-complete").click(function (){
       if($("payment-container").parsley().isValid()) {
       //if no parsley error then...
       $(".payment-container").fadeOut(); 
       }
      });  
  
  
  router.route('payment', function () {
    parsley();
 function parsley() {
  	$('.payment-form').parsley();
  }
   

  
});

