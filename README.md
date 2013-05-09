``white-space: none;`` polyfill
===============================

## Polyfill for the proposed white-space:none; CSS property

This is a proof of concept and is only tested to work in current browsers (as of April 2013).

The implementation works by removing empty nodes in the DOM, that are siblings to a node with ``white-space: none;``. The child nodes doesn't inherite ``white-space: none;``.
Furthermore, this polyfill only parse external CSS. So it won't even look at CSS in the header or inline.
Another issue, might be that the DOM is not ready before the script tries to remove empty nodes.

You can find a list of sites and people discussing issues with not having `white-space: none;` on the [wiki](https://github.com/dotnetCarpenter/white-space/wiki).

So far there is three test cases and one test case that include all three:
+ [unordered-list.html](http://dotnetcarpenter.github.io/white-space/unordered-list.html)*
+ [images-as-list.html](http://dotnetcarpenter.github.io/white-space/images-as-list.html)*
+ [trebuchet-overflow.html](http://dotnetcarpenter.github.io/white-space/trebuchet-overflow.html)
+ [all.html](http://dotnetcarpenter.github.io/white-space/all.html)

\* Click the "Run white-space:none; script" button at the top

## Tested in
+ IE10, IE9 on Win8
+ FF20, Saf6, Chr26, Op12 on OSX10.7

###
+ http://lists.w3.org/Archives/Public/www-style/2013Mar/subject.html#msg756
+ http://lists.w3.org/Archives/Public/www-style/2013Apr/subject.html#msg497

### Changelog
=======
+ 0.1.2 - fix bug when no white-space:none was found in CSS
+ 0.1.1 - switch to monad implementation
+ 0.1.0 - proof of concept


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/dotnetCarpenter/white-space/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

