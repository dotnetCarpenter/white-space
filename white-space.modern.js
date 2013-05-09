/**
 * Polyfill for the proposed white-space:none; CSS property
 * http://lists.w3.org/Archives/Public/www-style/2013Apr/subject.html#msg472
 * This is a proof of concept and is only tested to work in current browsers (as of April 2013)
 * @version  13.5.2 	year.month.minor-version
 * Might have an issue with the DOM not being ready before removing white space.
 */
;(function whiteSpace(doc, win) {
	"use strict";

	var cssTokenizer = /([^{]+)\s*\{\s*([^}]+)\s*}/g;
	var isWhiteSpaceCssBlock = /white-space\s*:\s*none\s*;/;
	var cssSelector = /(.+)\s*{/;
	var empty = /\s+/;
	var stylesheets = doc.styleSheets;	// is a StyleSheetList which can not be converted to an array (in FF)
	var stop = null;
	var optimist = function() {	// optimistic monad - runs all supplied functions unless there is an rejection, then it stops.
		function next(){
			var args = getArguments.call(arguments);
			var currentFn = this.shift();
			if(!currentFn) return;	// done
			currentFn.apply(this, [continuation].concat(args));
		}
		var continuation = next.bind(getArguments.call(arguments));
		return continuation;
	}

	iterator.call(stylesheets, function(sheet) {
		optimist(
			ajax,
			parseCss,
			removeWhiteSpace
		)(sheet.href);
	});
	
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
			if(!this[i] && this[i] !== 0 || (this[i] instanceof Array && !this[i].length) ) continue;
			if( fn.call(this, this[i], i) === stop ) return;
		}
	}
	function ajax(cb, url) {
		var get = new win.XMLHttpRequest();
		get.open('GET', url);
		get.onreadystatechange = function() {
			if ( this.readyState !== 4 || this.status !== 200 && this.status !== 304){
				return;
			}
			if(this.responseText)
				cb(this.responseText);
		}
		try {
			get.send();
		} catch (e) {}
	}
	function parseCss(cb, css) {
		//console.log(css);
		var tokens = css.match(cssTokenizer);
		var matches = [];
		iterator.call(tokens, function(cssblock) {
			if( isWhiteSpaceCssBlock.test(cssblock) ) {
				//console.log(cssblock);
				matches.push(cssblock.match(cssSelector)[1]);
			}
		});
		if(matches.length)
			cb(matches);
	}
	function removeWhiteSpace(cb) {
		//console.dir(arguments);
		iterator.call(getArguments.call(arguments).splice(1), function(selector) {
			//console.log(selector);
			var elements = doc.querySelectorAll(selector);
			if(elements.length > 0)
				iterator.call(elements, function(el){
					var adjacent = el.nextSibling;
					if( adjacent && adjacent.nodeType === 3 && empty.test(adjacent.nodeValue) ) {
						adjacent.parentNode.removeChild(adjacent);
					}			
				});
		});
		cb();
	}
})(document, window);