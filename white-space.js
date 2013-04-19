;(function whiteSpace(doc, win) {
	"use strict";
	// behold we're about to do slow stuff
	if(!doc.querySelectorAll) doc.write('<script src="https://raw.github.com/chjj/zest/master/lib/zest.js"><\/script>');
	var query = doc.querySelectorAll || zest;
	// and we're fast again
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
		console.dir(arguments);
		iterator.call(arguments, function(selector) {
			var elements = query(selector+'');
			console.dir(elements);
			/*iterator.call([].splice.call(elements, 0, elements.length), function(el,i){
				console.log(el, i);
			});*/
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