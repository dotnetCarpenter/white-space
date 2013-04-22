/**
 * Polyfill for the proposed white-space:none; CSS property
 * http://lists.w3.org/Archives/Public/www-style/2013Apr/subject.html#msg472
 * This is a proof of concept and is only tested to work in current browsers (as of April 2013)
 * @version  13.4.1 	year.month.minor-version
 * Might have an issue with the DOM not being ready before removing white space.
 */

;(function whiteSpace(doc, win) {
	"use strict";

	var cssTokenizer = /([^{]+)\s*\{\s*([^}]+)\s*}/g;
	var isWhiteSpaceCssBlock = /white-space\s*:\s*none\s*;/;
	var cssSelector = /(.+)\s*{/;
	var empty = /\s+/;
	var stylesheets = doc.styleSheets;
	var stop = null;
	var queue = function() {
		var args = getArguments.call(arguments);
		return (function() {
			var currentFn = args.shift();
			this.length = args.length;
			currentFn.apply(currentFn, getArguments.call(arguments));
		}).apply(args);
	}
	queue(getStyleSheet, ajax, parseCss, removeWhiteSpace);

	//iterator.call(stylesheets, getStyleSheet);
	function getArguments() {
		return Array.prototype.splice.call(this, 0, this.length);
	}

	function iterator(fn) {
		for (var i = 0, len = this.length; i < len; ++i) {
			if( fn.call(this, this[i], i) === stop ) return;
		}
	}
	function getStyleSheet(sheet) {
		//console.dir(sheet);
		ajax(sheet.href, parseCss, removeWhiteSpace);
	}
	function ajax(url, callback) {
		var args = [].splice.call(arguments, 2, arguments.length);
		var get = new win.XMLHttpRequest();
		get.open('GET', url);
		get.onreadystatechange = function() {
			if ( this.readyState !== 4 || this.status !== 200 && this.status !== 304 && this.status !== 0 ){
				return;
			}
			callback.apply(callback, [this.responseText].concat(args));
		}
		get.send();
	}
	function parseCss(css, callback) {
		//console.log(css);
		var tokens = css.match(cssTokenizer);
		var matches = [];
		iterator.call(tokens, function(cssblock) {
			if( isWhiteSpaceCssBlock.test(cssblock) ) {
				//console.log(cssblock);
				matches.push(cssblock.match(cssSelector)[1]);
			}
		});
		callback.apply(callback, matches);
	}
	function removeWhiteSpace() {
		//console.dir(arguments);
		iterator.call(arguments, function(selector) {
			var elements = doc.querySelectorAll(selector);
			//console.log(selector,elements);
			if(elements)
				iterator.call(elements, function(el,i){
					var adjacent = el.nextSibling;
					/*if(i === 1)
						console.dir(el);
					console.dir(adjacent);*/
					if( adjacent && adjacent.nodeType === 3 && empty.test(adjacent.nodeValue) ) {
						adjacent.parentNode.removeChild(adjacent);
					}			
				});
		});
	}
})(document, window);