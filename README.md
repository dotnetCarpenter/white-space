``white-space: none;`` polyfill
===============================

## Polyfill for the proposed white-space:none; CSS property

`white-space: none;` is a highly requested feature of the CSS Text Module but is, as time of writing, only recognized as [an issue in CSS Text Module Level 3](http://www.w3.org/TR/css3-text/#pre-line).

Original written as a proof-of-concept, I've found `white-space: none;` really useful and it's now ready for development usage. You're probably better off using HTML comments, HTML minification or similar in production but for development, it's pretty *tight*.

You can find a list of sites and people discussing issues with not having `white-space: none;` on the [wiki](https://github.com/dotnetCarpenter/white-space/wiki).

### UPDATE 2013-10-05 ###
Since version 1.1.0 a `white-space-fast.js` is supplied. It comes with another caveat (see [Issues below](./#issues)), but should be fast enough to be used in production. Which means you don't don't have to fix your white space issues.
`white-space-fast.min.js` should be placed inside your body tag to prevent it from running too soon on IE, on initial load with empty cache.
I encourage you to experiement with the exact placement of `white-space-fast.min.js`, as slowly loading js files (jQuery ect.) will impact the perceived performance of this ``white-space: none;`` implementation. Feedback is welcome in the [issue tracker](https://github.com/dotnetCarpenter/white-space/issues). 

*`white-space-fast.js` doesn't support IE8.*

## Usage
**CSS**
```css
  .foo {
    display: inline-block;
    white-space: none;
  }
```
**bower**
```shell
bower install css-white-space-none
```
```html
<!-- insert where ever you want -->
<script src="bower_components/css-white-space-none/white-space.min.js"></script>
```
OR
```html
<!-- insert inside your body tag - since version 1.1.0 -->
<script src="bower_components/css-white-space-none/white-space-fast.min.js"></script>
```

## Size
+ `white-space.min.js` - 1.37 KB
+ `white-space-fast.min.js` - 1.33 KB

## Issues

`white-space: none;` comes with a few known limitations, you need to cater for.

1. Don't use `white-space: none;` inside @media queries - unless you want to apply `white-space: none;` to the selector regardless of your media query.
2. Only use `white-space: none;` in external style sheets - the script won't look anywhere else.
3. If your external style sheet is on a different domain, make sure you use [CORS](http://www.w3.org/TR/cors/).

Let me know, in the [issue tracker](https://github.com/dotnetCarpenter/white-space/issues), if you stumble upon anything weird.

## Implementation
The implementation works by removing empty nodes in the DOM, that are siblings to a node with ``white-space: none;``. The child nodes doesn't inherit ``white-space: none;``.
Furthermore, this polyfill only parse external CSS. So it won't even look at CSS in the header or inline.
`white-space-fast.js` calls the removal of empty DOM nodes on `document.readyState == 'interactive'` as oppose to `white-space.js`, which remove empty DOM nodes on `document.readyState == 'complete'`.

## Tests

I decided to include a realistic use-case, which really isn't a test-case but included as such, because
it's useful to test `white-space: none;` in a realistic environment.
So far there is one use case, three test cases and one test case that include all three:

+ [unordered-list.html](http://dotnetcarpenter.github.io/white-space/test-cases/unordered-list.html)*
+ [images-as-list.html](http://dotnetcarpenter.github.io/white-space/test-cases/images-as-list.html)*
+ [trebuchet-overflow.html](http://dotnetcarpenter.github.io/white-space/test-cases/trebuchet-overflow.html)
+ [all.html](http://dotnetcarpenter.github.io/white-space/test-cases/all.html)
+ [real.html](http://dotnetcarpenter.github.io/white-space/test-cases/real.html)

\* Click the "Run white-space:none; script" button at the top

## Tested in
+ IE10, IE9, IE8 on Win7
+ IE10, IE9, IE8 on Win8
+ FF21, Saf6, Chr27, Op12 on OSX10.7 (Lion)

**NOTE:** IE7 support requires that `querySelectorAll` is replaced with something similar.

## Discussion
+ http://lists.w3.org/Archives/Public/www-style/2013Mar/subject.html#msg756
+ http://lists.w3.org/Archives/Public/www-style/2013Apr/subject.html#msg497

### Changelog
+ 1.1.0 - New white-space-fast.js implementation
+ 1.0.1 - handle css without selectors
+ 1.0.0 - first public release
+ 0.4.0 - build system and bower support - faulty release, as bower support didn't work
+ 0.3.1 - fix event listeners overwriting each other
+ 0.3.0 - DOMready feature, improved CSS tokenizer, better IE8 handling and a new use-case (real.html)
+ 0.2.2 - exclude @charset declaration kind of rules and fixed broken selector when `;` was missing at the end of the `white-space:none;` declaration (e.i. when minified).
+ 0.2.1 - excluding comments when looking for `white-space: none;`
+ 0.2.0 - added support for IE8
+ 0.1.2 - fix bug when no `white-space:none` was found in CSS
+ 0.1.1 - switch to monadish implementation
+ 0.1.0 - proof of concept


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/dotnetCarpenter/white-space/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

