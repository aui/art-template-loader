# art-template-loader

[art-template](https://github.com/aui/art-template) loader for webpack

## Install

```
npm install art-template-loader@0.3.0-beta1 --save-dev
```

## Usage

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.art$/,
        loader: "art-template-loader",
        options: {
          // art-template options (if necessary)
          imports: require.resolve('./test/template-imports'),
          compressor: source => {
              return source
                  // remove newline / carriage return
                  .replace(/\n/g, "")

                  // remove whitespace (space and tabs) before tags
                  .replace(/[\t ]+\</g, "<")

                  // remove whitespace between tags
                  .replace(/\>[\t ]+\</g, "><")

                  // remove whitespace after tags
                  .replace(/\>[\t ]+$/g, ">")
                  
                  // remove comments
                  .replace(/<!--[\w\W]*?-->/g, "");
          }
        }
      },
    ],
  },
  // ...
}
```

## Options

You can pass [art-template options](https://github.com/aui/art-template)
using standard webpack [loader options](https://webpack.js.org/configuration/module/#useentry).
