/**
 * Polyfill for the proposed white-space:none; CSS property
 * http://lists.w3.org/Archives/Public/www-style/2013Apr/subject.html#msg472
 * @version 1.1.0
 */
;(function whiteSpace(doc, win) {
	"use strict";
	var cssTokenizer = /([^;{}\/]+)\s*\{\s*([^\/}]+)\s*}/g;
	var isWhiteSpaceCssBlock = /white-space\s*:\s*none\s*;?/;
	var cssSelector = /(.+)\s*{/;
	var empty = /\s+/;
	var stylesheets = doc.styleSheets;	// is a StyleSheetList which can not be converted to an array (in FF)
	var stop = null;
	var optimist = function() {	// continuation passing style - runs all supplied functions unless there is an rejection, then it stops.
		function next(){
			var args = getArguments.call(arguments);
			var currentFn = this.shift();
			if(!currentFn) return;	// done
			currentFn(continuation, args[0]);
		}
		var continuation = bind(next, getArguments.call(arguments));
		return continuation;
	}

	// start program
	iterator.call(stylesheets, function(sheet) {
		optimist(
			ajax,
			parseCss,
			domReady,
			removeWhiteSpace
		)(sheet.href);
	});
	// end program

	function addEvent(element, event, listener) {
		if(element.addEventListener) {
			element.addEventListener(event, listener, false);
		} else if(element.attachEvent) {
			element.attachEvent('on' + event, listener);
		}
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
			get.open('GET', url);	// apparently IE8 accepts an array here but we better not expect that for other browsers
			get.send();
		} catch (e) {}
	}
	function parseCss(cb, css) {
		//console.log("css", css);
		var tokens = css.match(cssTokenizer) || [];
		console.dir(tokens);
		var matches = [];
		iterator.call(tokens, function(cssblock) {
			if( isWhiteSpaceCssBlock.test(cssblock) ) {
				console.log("cssblock", cssblock);
				matches.push(cssblock.match(cssSelector)[1]);
			}
		});
		if(matches.length)
			cb(matches);
	}
	function domReady(cb, selectors) {
    if (doc.readyState == 'complete') {
      cb(selectors);
    } else {
      addEvent(doc, 'readystatechange', function() { domReady(cb, selectors); });
    }
	}
	function removeWhiteSpace(cb, selectors) {
		//console.dir(arguments);
		var outerEmpty = /^\s+|\s+$/g;
		iterator.call(selectors, function(selector) {
			//console.log("selector", selector);
			var elements = doc.querySelectorAll(selector);
			if(elements.length > 0) {
				//console.log(elements);
				iterator.call(elements, function(el) {
					var content = el.outerHTML,
					adjacent = el.nextSibling;
					if( outerEmpty.test(content) ) {
						// trim the content - this works for IE8
						el.outerHTML = content.replace(outerEmpty, '');
					}
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
		cb();
}
})(document, window);