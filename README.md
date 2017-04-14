# art-template-loader
art-template loader for webpack

## Install

```
npm install art-template-loader --save-dev
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
