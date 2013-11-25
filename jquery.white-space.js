(function($, win, doc) {
  "use strict";
  var cssTokenizer = /([^;{}\/]+)\s*\{\s*([^\/}]+)\s*}/g;
  var isWhiteSpaceCssBlock = /white-space\s*:\s*none\s*;?/;
  var cssSelector = /(.+)\s*{/;
  var empty = /\s+/;
  var stylesheets = doc.styleSheets;  // is a StyleSheetList which can not be converted to an array (in FF)
  var compose = function() { // continuation passing style - runs all supplied functions unless there is an rejection, then it stops.
    function next(){
      var args = getArguments.call(arguments);
      var currentFn = this.shift();
      if(!currentFn) return;  // done
      currentFn(continuation, args[0]);
    }
    var continuation = bind(next, getArguments.call(arguments));
    return continuation;
  }

  $(stylesheets).each(function(i, el) {
    console.log(i);
  });
}(jQuery, window, document));