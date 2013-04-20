;(function whiteSpace(doc, win) {
	"use strict";
	// behold we're about to do slow stuff
	if(!doc.querySelectorAll) {
		var script = doc.createElement("script");
		script.src = "zest.js";
		script.onload = function(){ whiteSpace(doc, win); }
		doc.getElementsByTagName('head')[0].appendChild(script);
		script = null;
		return;
	}
	// and we're fast again
	var query = function(selector) {
		var q = doc.querySelectorAll || zest;
		return function function() { return q(selector); }
	};
	var cssTokenizer = /([^{]+)\s*\{\s*([^}]+)\s*}/g;
	var isWhiteSpaceCssBlock = /white-space\s*:\s*none\s*;/;
	var cssSelector = /(.+)\s*{/;
	var stylesheets = doc.styleSheets;
	var stop = null;
	var xhr = (function() {
		var ie = ['Msxml2.DOMDocument.6.0', 'Msxml2.DOMDocument.3.0'];
		var request;
		if(win.XMLHttpRequest) {
			request =  win.XMLHttpRequest;
		} else {
			iterator.call(ie, function(item) {
				try {
					request = win.ActiveXObject(item);
					return stop;
				}
				catch(e) {}
			});
		}
		return function() { return new request; }
	})();
	
	//console.dir(new xhr());
	iterator.call(stylesheets, getStyleSheet);


	function removeWhiteSpace() {
		//console.dir(arguments);
		iterator.call(arguments, function(selector) {
			var elements = query(selector);
			//console.log(selector,elements);
			if(elements)
				iterator.call(elements, function(el,i){
					var adjacent = el.nextSibling;
					if(i === 1)
						console.dir(el);
					console.dir(adjacent);
					if( adjacent && adjacent.nodeType === 3 && /\s+/.test(adjacent.nodeValue) ) {
						adjacent.parentNode.removeChild(adjacent);
					}			
				});
		});
	}
	function parseCss(css, callback) {
		console.log(css);
		var tokens = css.match(cssTokenizer);
		var matches = [];
		iterator.call(tokens, function(cssblock) {
			if( isWhiteSpaceCssBlock.test(cssblock) ) {
				console.log(cssblock);
				matches.push(cssblock.match(cssSelector)[1]);
			}
		});
		callback.apply(callback, matches);
	}
	function getStyleSheet(sheet) {
		//console.dir(sheet);
		ajax(sheet.href, parseCss, removeWhiteSpace);
	}
	function iterator(fn) {
		for (var i = 0, len = this.length; i < len; ++i) {
			if( fn.call(this, this[i], i) === stop ) return;
		}
	}
	function ajax(url, callback) {
		var args = [].splice.call(arguments, 2, arguments.length);
		var get = xhr();
		get.open('GET', url);
		get.onreadystatechange = function() {
			if ( this.readyState !== 4 || this.status !== 200 && this.status !== 304 && this.status !== 0 ){
				return;
			}
			callback.apply(callback, [this.responseText].concat(args));
		}
		get.send();
	}
})(document, window);