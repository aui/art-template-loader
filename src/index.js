const template = require('art-template');
const runtime = require.resolve('./runtime');
const loaderUtils = require('loader-utils');

const loader = function (source) {

    this.cacheable && this.cacheable();
    const options = loaderUtils.getOptions(this);
    const config = Object.assign({}, template.defaults, {
        bail: true,
        cache: null,
        filename: this.resourcePath
    }, options);

    const imports = 'var $imports = require(' +
        loaderUtils.stringifyRequest(this, '!' + runtime) +
        ');';

    try {
        const render = template.compile(source, config);
        return `${imports};\nmodule.exports = ${render};`;
    } catch (error) {
        delete error.stack;
        error = JSON.stringify(error, null, 4);
        this.emitError(`${error}`);
    }

};

module.exports = loader;