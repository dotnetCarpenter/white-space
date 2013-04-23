/**
 * Polyfill for the proposed white-space:none; CSS property
 * http://lists.w3.org/Archives/Public/www-style/2013Apr/subject.html#msg472
 * This is a proof of concept and is only tested to work in current browsers (as of April 2013)
 * @version  13.4.1 	year.month.minor-version
 * Might have an issue with the DOM not being ready before removing white space.
 */
var startTime = performance.now();
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
			currentFn.apply(currentFn, [promise].concat(args));
		}
		var args = getArguments.call(arguments);
		var promise = { resolve: next.bind(args), reject: function(){} };
		return next.bind(args);
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
	function iterator(fn) {
		for (var i = 0, len = this.length; i < len; ++i) {
			if( fn.call(this, this[i], i) === stop ) return;
		}
	}
	function getStyleSheet(promise, sheet) {
		promise.resolve(sheet.href);
	}
	function ajax(promise, url) {
		var get = new win.XMLHttpRequest();
		get.open('GET', url);
		get.onreadystatechange = function() {
			if ( this.readyState !== 4 || this.status !== 200 && this.status !== 304){
				return;
			}
			this.responseText ? promise.resolve(this.responseText) : promise.reject();
		}
		try {
			get.send();
		} catch (e) { promise.reject(); }
	}
	function parseCss(promise, css) {
		//console.log(css);
		var tokens = css.match(cssTokenizer);
		var matches = [];
		iterator.call(tokens, function(cssblock) {
			if( isWhiteSpaceCssBlock.test(cssblock) ) {
				//console.log(cssblock);
				matches.push(cssblock.match(cssSelector)[1]);
			}
		});
		promise.resolve(matches);
	}
	function removeWhiteSpace(promise) {
		//console.dir(arguments);
		iterator.call(getArguments.call(arguments).splice(1), function(selector) {
			var elements = doc.querySelectorAll(selector);
			if(elements)
				iterator.call(elements, function(el){
					var adjacent = el.nextSibling;
					if( adjacent && adjacent.nodeType === 3 && empty.test(adjacent.nodeValue) ) {
						adjacent.parentNode.removeChild(adjacent);
					}			
				});
		});
		console.log("Time:", performance.now()-startTime);
	}
})(document, window);