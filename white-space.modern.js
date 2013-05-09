/**
 * Polyfill for the proposed white-space:none; CSS property
 * http://lists.w3.org/Archives/Public/www-style/2013Apr/subject.html#msg472
 * This is a proof of concept and is only tested to work in current browsers (as of April 2013)
<<<<<<< HEAD
 * @version  13.4.2 	year.month.minor-version
 * Might have an issue with the DOM not being ready before removing white space.
 */

=======
 * @version  13.5.1 	year.month.minor-version
 * Might have an issue with the DOM not being ready before removing white space.
 */
>>>>>>> b7a84812e7b73b374126cda973de61f1d54fcabf
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
<<<<<<< HEAD
			currentFn.apply(this, [promise].concat(args));
		}
		var promise = next.bind(getArguments.call(arguments));
		return promise
=======
			currentFn.apply(this, [continuation].concat(args));
		}
		var continuation = next.bind(getArguments.call(arguments));
		return continuation;
>>>>>>> b7a84812e7b73b374126cda973de61f1d54fcabf
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
<<<<<<< HEAD
	function ajax(promise, url) {
=======
	function ajax(cb, url) {
>>>>>>> b7a84812e7b73b374126cda973de61f1d54fcabf
		var get = new win.XMLHttpRequest();
		get.open('GET', url);
		get.onreadystatechange = function() {
			if ( this.readyState !== 4 || this.status !== 200 && this.status !== 304){
				return;
			}
			if(this.responseText)
<<<<<<< HEAD
				promise(this.responseText);
=======
				cb(this.responseText);
>>>>>>> b7a84812e7b73b374126cda973de61f1d54fcabf
		}
		try {
			get.send();
		} catch (e) {}
	}
<<<<<<< HEAD
	function parseCss(promise, css) {
=======
	function parseCss(cb, css) {
>>>>>>> b7a84812e7b73b374126cda973de61f1d54fcabf
		//console.log(css);
		var tokens = css.match(cssTokenizer);
		var matches = [];
		iterator.call(tokens, function(cssblock) {
			if( isWhiteSpaceCssBlock.test(cssblock) ) {
				//console.log(cssblock);
				matches.push(cssblock.match(cssSelector)[1]);
			}
		});
<<<<<<< HEAD
		promise(matches);
	}
	function removeWhiteSpace() {
		//console.dir(arguments);
		iterator.call(getArguments.call(arguments).splice(1), function(selector) {
			var elements = doc.querySelectorAll(selector);
			if(elements)
				iterator.call(elements, function(el,i){
=======
		if(matches.length > 0)
			cb(matches);
	}
	function removeWhiteSpace(cb) {
		//console.dir(arguments);
		iterator.call(getArguments.call(arguments).splice(1), function(selector) {
			//console.log(selector);
			var elements = doc.querySelectorAll(selector);
			if(elements.length > 0)
				iterator.call(elements, function(el){
>>>>>>> b7a84812e7b73b374126cda973de61f1d54fcabf
					var adjacent = el.nextSibling;
					if( adjacent && adjacent.nodeType === 3 && empty.test(adjacent.nodeValue) ) {
						adjacent.parentNode.removeChild(adjacent);
					}			
				});
		});
<<<<<<< HEAD
=======
		cb();
>>>>>>> b7a84812e7b73b374126cda973de61f1d54fcabf
	}
})(document, window);