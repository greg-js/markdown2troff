# markdown2troff

`markdown` goes in
`troff` comes out

In case you didn't know, `troff` is the format used for linux `man` pages.

## How?

Just regular expressions.

See [remark-man](https://github.com/wooorm/remark-man) for a **much** more involved approach which is guaranteed great results every time (but at the cost of a rather large dependency). This on the other hand is a tiny and lightning-quick alternative. However, there may be quirks here and there as it is not even nearly as smart as `remark-man`.

## Why?

I wrote this for my [arch-wiki-man](https://github.com/greg-js/arch-wiki-man) project to replace my dependency on `remark-man`. Not because I don't like `remark-man` (it's fantastic and super duper smart!), but because it was just too much code for me to add as a dependency.

## But...

I wrote this with a very specific use case in mind so your mileage may vary with this code. Feel free to fork, bug report, pull request or complain!

## Want!

```
npm install markdown2troff
```

Then, in your project:

```
var md2troff = require('markdown2troff');
var sweetTroff = md2troff(disgustingMarkdown);
```

## Boring

Licensed under the GPLv3
