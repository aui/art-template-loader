const precompile = require('art-template/lib/precompile');
const loaderUtils = require('loader-utils');

const loader = function (source) {

    this.cacheable && this.cacheable();

    let result;
    const options = loaderUtils.getOptions(this);
    const callback = this.callback;

    options.source = source;
    options.filename = this.resourcePath;
    options.sourceMap = this.sourceMap;
    options.sourceRoot = process.cwd();


    if (options.debug === undefined) {
        options.debug = this.debug;
    }


    if (options.minimize === undefined) {
        options.minimize = this.minimize;
    }


    try {
        result = precompile(options);
    } catch (error) {
        callback(new Error(JSON.stringify(error, null, 4)), `module.exports=function(){}`);
        return;
    }


    const code = result.toString();
    const sourceMap = result.sourceMap;
    const ast = result.ast;

    if (sourceMap && (!sourceMap.sourcesContent || !sourceMap.sourcesContent.length)) {
        sourceMap.sourcesContent = [source];
    }

    callback(null, code, sourceMap, ast);
};

module.exports = loader;