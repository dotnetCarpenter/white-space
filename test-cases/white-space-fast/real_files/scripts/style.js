/**
 * style does what CSS is supposed to do.
 * @version  13.5.4
 */
(function style(win, doc){
  var stop = null;
  function iterator(fn) {
    for (var i = 0, len = this.length; i < len; ++i) {
      if(!this[i] && this[i] !== 0 || (this[i] instanceof Array && !this[i].length) ) continue;
      if( fn.call(this, this[i], i) === stop ) return;
    }
  }

  var css = {
    equalHeight: function(selector) {
      var nodeList = doc.querySelectorAll(selector),
        maxHeight = 0,
        css = '';
      if(!nodeList.length > 0) return;  // nothing found
      iterator.call(nodeList, function(node) {
        maxHeight = Math.max(node.clientHeight, maxHeight);
      });
      // Here we add 1px to the height because,
      // for some reason when setting inline css, the actual height is 1px less
      css = 'height:' + (maxHeight + 1) + 'px';
      iterator.call(nodeList, function(node) {
        node.setAttribute('style', css);
      });
    }
  }
  var toggleHorizontalGrid = false;
  var debug = {
    toggleHorizontalGrid: function(config) {
      config = config || {};
      var numberOfLines = config.lines || 30,
          space = config.space || 30,
          htmlTemp = [
            '<div style="width:100%;background-color:#000;position:absolute;height:1px;',
            'top:', , 'px;"></div>'],
          html = [],
          on = false,
          fragment = doc.createElement('div');
      while(numberOfLines >= 0) {
        htmlTemp[2] = space * numberOfLines;
        html.push(htmlTemp.join(''));
        numberOfLines--;
      }      
      if(console && console.log) console.log('Space set to ' + space + 'px');
      return function() {
        if(on) {
          doc.body.removeChild(fragment);
          on = false;
        } else {
          fragment.innerHTML = html.join('');
          doc.body.appendChild(fragment);
          on = true;
        }
        //doc.body.innerHTML = html.join('');
      }
    }
  }
  //window.debug = debug;
  //NOT NESCESSARY ANYMORE
  //css.equalHeight('footer .special-one-third');
  var lines = debug.toggleHorizontalGrid({
      lines: Math.ceil(doc.body.clientHeight / 30)  // race condition with white-space.js
    , space: 30
  });

  if(doc.addEventListener) {  // IE8 doesn't support addEventListener
    doc.addEventListener('keydown', function(e){
      if( e.keyCode === 76 && e.shiftKey === true) // delete key
        lines();
    });
  }

}(window, document))
