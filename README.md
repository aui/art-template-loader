# art-template-loader

[![NPM Version](https://img.shields.io/npm/v/art-template-loader.svg)](https://npmjs.org/package/art-template-loader)
[![Node.js Version](https://img.shields.io/node/v/art-template-loader.svg)](http://nodejs.org/download/)

[art-template](https://github.com/aui/art-template) loader for webpack

## Install

```shell
npm install art-template
npm install art-template-loader --save-dev
```

## Usage

By default every local `<img src="image.png">` is required (`require('./image.png')`). You may need to specify loaders for images in your configuration (recommended `file-loader` or `url-loader`).

You can specify which attribute combination should be processed by this loader via the query parameter `htmlResourceRules`. (Default: `htmlResourceRules=[/\bsrc="([^"]*)"/]`)

To completely disable tag-attribute processing (for instance, if you're handling image loading on the client side) you can pass in `htmlResourceRules=false`.

## Examples

```js
module.exports = {
    // ...
    module: {
        rules: [{
            test: /\.jpg$/,
            loader: "file-loader"
        }, {
            test: /\.png$/,
            loader: "url-loader?mimetype=image/png"
        }, {
            test: /\.art$/,
            loader: "art-template-loader",
            options: {
                // art-template options (if necessary)
                imports: require.resolve("./template-runtime")
            }
        }]
    },
    // ...
}
```

```html
<% include('./header.art') %>

<% if (user) { %>
  <h2><%= user.name %></h2>
  <p><img src="./octocat.png" alt="octocat"></p>
<% } %>

<% include('./footer.art') %>
```

[More](https://github.com/aui/art-template-loader/tree/master/example)

## 'Root-relative' URLs

For urls that start with a `/`, the default behavior is to not translate them.
If a `htmlResourceRoot` query parameter is set, however, it will be prepended to the url
and then translated.

With the same configuration as above:

``` html
<!-- file.art -->
<img src="/image.jpg">
```

```js
require("html-loader!./file.art");

// => '<img  src="/image.jpg">'
```

```js
require("html-loader?htmlResourceRoot=.!./file.art");

// => '<img  src="http://cdn.example.com/49eba9f/a992ca.jpg">'
```

## Debug

Support `SourceMap`:

```shell
webpack --debug
```

![debug](https://cloud.githubusercontent.com/assets/1791748/25306107/55b2afba-27b9-11e7-903b-4700ac47a4d3.png)

## Options

You can pass [art-template options](https://github.com/aui/art-template)
using standard webpack [loader options](https://webpack.js.org/configuration/module/#useentry).
