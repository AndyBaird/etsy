'use strict';

  // var $ = require('../../../node_modules/jquery/dist/jquery.js');
  var router = require('../router');
  var settings = require('../settings');
  var _ = require('../../../node_modules/underscore/underscore.js');
  var parsley = require('../../../node_modules/parsleyjs/dist/parsley.js');
  var view = require('../utils/view');
  
  
  router.route('payment', function () {
    modal();
  function modal() {
  	$('.payment-form').parsley();
    var el = document.querySelector(".payment-container");
  	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
    
  }


  
});

