const template = require('art-template');
const loaderUtils = require('loader-utils');

const loader = function (source) {

    let render;
    const loader = this;

    loader.cacheable && loader.cacheable();

    const options = loaderUtils.getOptions(loader);
    options.filename = loader.resourcePath;


    if (loader.debug) {
        options.compileDebug = true;
    }


    if (loader.minimize) {
        options.minimize = true;
    }


    try {
        render = template.precompile(source, options);
    } catch (error) {
        delete error.stack;
        error = JSON.stringify(error, null, 4);

        loader.emitError(`art-template-loader: ${error}`);

        return `console.error('Template Error: ' + ${error});\nmodule.exports = function(){return '{Template Error}'};`;
    }

    return render;
};

module.exports = loader;