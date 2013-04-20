``white-space: none;`` polyfill
===============================

## Polyfill for the proposed white-space:none; CSS property

This is a proof of concept and is only tested to work in current browsers (as of April 2013).
The implementation works by removing empty nodes in the DOM, that are siblings to a node with ``white-space: none;``. The child nodes doesn't inherite ``white-space: none;``.
Furthermore, this polyfill only parse external CSS. So it won't even look at CSS in the header or inline.
Another issue, might be that the DOM is not ready before the script tries to remove empty nodes.

So far there is two test cases:
+ [unordered-list.html](http://dotnetcarpenter.github.io/white-space/unordered-list.html)
+ [images-as-list.html](http://dotnetcarpenter.github.io/white-space/images-as-list.html)
+ [trebuchet-overflow.html](http://dotnetcarpenter.github.io/white-space/trebuchet-overflow.html)

## Tested in
+ IE10 on Win8
+ FF20, Saf6, Chr26, Op12 on OSX10.7

### Discussion
+ http://lists.w3.org/Archives/Public/www-style/2013Mar/subject.html#msg756
+ http://lists.w3.org/Archives/Public/www-style/2013Apr/subject.html#msg472

### History
Version 0.1.0 - proof of concept
