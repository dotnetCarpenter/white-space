/**
 * Polyfill for the proposed white-space:none; CSS property
 * http://lists.w3.org/Archives/Public/www-style/2013Apr/subject.html#msg472
 *
 * This edition supports "DOMContentLoaded" instead of "complete" event. This mean that it's
 * faster than the ordinary white-space.js but you **MUST** place the white-space script *after*
 * your style sheets.
 * @version 2014.2.1 (v1.2.3)
 */
;(function whiteSpace(doc, win) {
  "use strict";
  var cssTokenizer = /([^;{}\/]+)\s*\{\s*([^\/}]+)\s*}/g;
  var isWhiteSpaceCssBlock = /white-space\s*:\s*none\s*;?/;
  var cssSelector = /(.+)\s*{/;
  var empty = /\s+/;
  var stylesheets = doc.styleSheets;  // is a StyleSheetList which can not be converted to an array (in FF)
  var stop = null;
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

  // start program
  iterator.call(stylesheets, function(sheet) { // the composition is called for each external stylesheet
    if(!sheet.href) // skip style sections as they are not retrievable with ajax
      return;
    compose(
      ajax,
      parseCss,
      once(domReady),
      removeWhiteSpace,
      done/*,
      timer()*/
    )(sheet.href);
  });
  // end program

  // function timer() {    
  //   var perf = win.performance.now();
  //   return function(cb) {
  //     console.log(win.performance.now() - perf);
  //     // call the next function with all the arguments minus the call-back
  //     var args = Array.prototype.splice.call(arguments, 1);
  //     cb.apply(undefined, args );
  //   }
  // }

  function once(fn) {
    var ran;
    return function(cb, arg) {
      if(ran) {
        return;
      }
      ran = true;
      fn(cb, arg);
    }
  }

  function addEvent(element, type, listener) {
    element.addEventListener(type, listener, false);
    return { el:element, t:type, l:listener };
  }
  function removeEvent(e) {
    e.el.removeEventListener(e.type, l, false);
  }
  
  function bind(fn, obj){
    if(fn.bind) return fn.bind(obj);
    else return function() {
      return fn.apply(obj, arguments);
    }
  }

  function getArguments() {
    return Array.prototype.splice.call(this, 0, this.length);
  }
  /**
   * Iterate over anything that has a length.
   * If a value we are iterating over is falsy but not 0 or an empty array, the iteration skip that value.
   * @param  {Function} fn Callback function to call on each assigned value in the list.
   * @return {Void}      Nothing
   */
  function iterator(fn) {
    for (var i = 0, len = this.length; i < len; ++i) {
      //SLOWif(!this[i] && this[i] !== 0 || (this[i] instanceof Array && !this[i].length) ) continue;
      if( fn.call(this, this[i], i) === stop ) return;
    }
  }
  function ajax(cb, url) {
    var get = new win.XMLHttpRequest();
    get.onreadystatechange = function() {
      if ( this.readyState !== 4 || this.status !== 200 && this.status !== 304){
        return;
      }
      if(this.responseText)
        cb(this.responseText);
    }
    try {
      get.open('GET', url); // apparently IE8 accepts an array here but we better not expect that, for other browsers
      get.send();
    } catch (e) {}
  }
  function parseCss(cb, css) {
    //console.log("css", css);
    var tokens = css.match(cssTokenizer) || [];
    //console.dir(tokens);
    var matches = [];
    iterator.call(tokens, function(cssblock) {
      if( isWhiteSpaceCssBlock.test(cssblock) ) {
        //console.log("cssblock", cssblock);
        matches.push(cssblock.match(cssSelector)[1]);
      }
    });
    //console.log("Found " + matches.length + " css selectors with white-space:none");
    if(matches.length)
      cb(matches);
  }
  // INFO: http://www.whatwg.org/specs/web-apps/current-work/multipage/the-end.html#the-end
  function domReady(cb, selectors) {
    var events = [];
    // console.log(selectors);
    // doc.readyState == 'interactive' prematurely in IE9
    // note to others: tilde makes -1 zero aka falsy
    var notIE9 = !(~navigator.appName.indexOf("Internet Explorer") &&
                 ~navigator.appVersion.indexOf("MSIE 9"));
    // console.log("notIE9" + notIE9)
    if (doc.readyState == 'complete' || (notIE9 && doc.readyState == 'interactive') || doc.readyState == 'loaded') { // loaded - fix android 2.3
      // console.log(doc.readyState);
      iterator.call(events, function(e) {
        removeEvent(e);
      });
      cb(selectors);
    } else {
      events.push(addEvent(doc, 'DOMContentLoaded', function() { cb(selectors); } )); // fix for android 2.3
      events.push(addEvent(doc, 'readystatechange', function() { domReady(cb, selectors); }));
    }
  }
  function removeWhiteSpace(cb, selectors) {
    //console.dir(arguments);
    var elements;
    iterator.call(selectors, function(selector) {
      //console.log("selector", selector);
      elements = doc.querySelectorAll(selector);
      if(elements.length > 0) {
        //console.log(elements);
        iterator.call(elements, function(el) {
          var content = el.outerHTML,
          adjacent = el.nextSibling;
          // remove empty text node next to out element
          // works in all other browsers than IE8
          if( adjacent
            && adjacent.nodeType === 3
            && empty.test(adjacent.nodeValue)
          ) {
            adjacent.parentNode.removeChild(adjacent);
          }
        });
      }
    });
    cb(elements);
  }
  function done(cb, elements) {
    var evDone;
    if(document.implementation.hasFeature("Events", "4.0"))
      evDone = new Event("WhiteSpaceDone");
    else if(doc.createEvent/*doc.implementation.hasFeature("Events", "3.0")*/) { // IE9+ et al. -- see bug #8
      evDone = doc.createEvent("CustomEvent");
      evDone.initCustomEvent("WhiteSpaceDone", true, true, undefined);
      // Probably better to use a generic event:
      //http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-Event
      // Guide:
      //http://www.howtocreate.co.uk/tutorials/javascript/domevents
    }
    if(elements && elements.length) {
      elements[0].parentNode.dispatchEvent(evDone);
    } else {
      doc.documentElement.dispatchEvent(evDone);
    }
    cb();
  }
})(document, window);
