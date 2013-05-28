``white-space: none;`` polyfill
===============================

## Polyfill for the proposed white-space:none; CSS property

Original written as a proof-of-concept, I've found `white-space: none;` really useful and it's now ready for development usage. You're probably better off using HTML comments, minification or similar in production but for development, it's pretty *tight*.

`white-space: none;` is a highly requested feature of the CSS Text Module but is, as time of writing, only recognized as [an issue in CSS Text Module Level 3](http://www.w3.org/TR/css3-text/#pre-line).

You can find a list of sites and people discussing issues with not having `white-space: none;` on the [wiki](https://github.com/dotnetCarpenter/white-space/wiki).

## Usage
```css
  .foo {
    display: inline-block;
    white-space: none;
  }
```

## Issues

`white-space: none;` comes with a few known limitations, you need to cater for.

1. Don't use `white-space: none;` inside @media queries - unless you want to apply `white-space: none;` to the selector regardless of your media query.
2. Only use `white-space: none;` in external style sheets - the script won't look anywhere else.
3. If your external style sheet is on a different domain, make sure you use [CORS](http://www.w3.org/TR/cors/).

Let me know, in the [issue tracker](https://github.com/dotnetCarpenter/white-space/issues), if you stumble upon anything weird.

## Implementation
The implementation works by removing empty nodes in the DOM, that are siblings to a node with ``white-space: none;``. The child nodes doesn't inherit ``white-space: none;``.
Furthermore, this polyfill only parse external CSS. So it won't even look at CSS in the header or inline.

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
+ IE10, IE9, IE8 on Win8
+ FF21, Saf6, Chr27, Op12 on OSX10.7 (Lion)

**NOTE:** IE7 support requires that `querySelectorAll` is replaced with something similar.

## Discussion
+ http://lists.w3.org/Archives/Public/www-style/2013Mar/subject.html#msg756
+ http://lists.w3.org/Archives/Public/www-style/2013Apr/subject.html#msg497

### Changelog
+ 0.4.0 - build system and bower support
+ 0.3.1 - fix event listeners overwriting each other
+ 0.3.0 - DOMready feature, improved CSS tokenizer, better IE8 handling and a new use-case (real.html)
+ 0.2.2 - exclude @charset declaration kind of rules and fixed broken selector when `;` was missing at the end of the `white-space:none;` declaration (e.i. when minified).
+ 0.2.1 - excluding comments when looking for `white-space: none;`
+ 0.2.0 - added support for IE8
+ 0.1.2 - fix bug when no `white-space:none` was found in CSS
+ 0.1.1 - switch to monadish implementation
+ 0.1.0 - proof of concept


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/dotnetCarpenter/white-space/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

