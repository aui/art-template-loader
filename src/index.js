const template = require('art-template');
const path = require('path');
const acorn = require('acorn');
const escodegen = require('escodegen');
const estraverse = require('estraverse');
const loaderUtils = require('loader-utils');

const loader = function (source) {

    let render;
    const loader = this;
    loader.cacheable && loader.cacheable();
    const options = loaderUtils.getOptions(loader);
    const config = Object.assign({
        imports: 'art-template/lib/imports',
        bail: true,
        cache: null,
        filename: loader.resourcePath
    }, options);

    if (typeof config.imports !== 'string') {
        throw Error(`art-template-loader: "options.imports" is a file path. Example:\n` +
            `options: { imports: require.resolve("art-template/lib/imports") }\n`);
    }

    const imports = 'var $imports = require(' +
        loaderUtils.stringifyRequest(loader, '!' + config.imports) +
        ');';

    config.imports = require(config.imports);

    try {
        render = template.compile(source, config).toString();
    } catch (error) {
        delete error.stack;
        error = JSON.stringify(error, null, 4);
        loader.emitError(`${error}`);
        return;
    }

    let ast = acorn.parse(`(${render})`);

    ast = estraverse.replace(ast, {
        enter: function (node) {
            if (node.type === 'VariableDeclarator' &&
                node.id.type === 'Identifier' &&
                node.id.name === 'include' &&
                node.init.type === 'FunctionExpression') {

                this.remove();

            } else if (node.type === 'CallExpression' &&
                node.callee.type === 'Identifier' &&
                node.callee.name === 'include') {

                const filename = node.arguments[0];
                const data = node.arguments[1] || {
                    "type": "Identifier",
                    "name": "$data"
                };

                if (config.root && filename.type === 'Literal' && /^[^\.]/.test(filename.value)) {
                    const context = loader.context || (loader.options && loader.options.context);
                    filename.value = path.resolve(config.root, filename.value);
                    filename.value = './' + path.relative(context, filename.value);

                    delete filename.raw;
                }

                const requireNode = {
                    "type": "AssignmentExpression",
                    "operator": "+=",
                    "left": {
                        "type": "Identifier",
                        "name": "$out"
                    },
                    "right": {
                        "type": "CallExpression",
                        "callee": {
                            "type": "CallExpression",
                            "callee": {
                                "type": "Identifier",
                                "name": "require"
                            },
                            "arguments": [filename]
                        },
                        "arguments": [data]
                    }
                };


                return requireNode;
            }
        }
    });

    render = escodegen.generate(ast);

    return `${imports};\nmodule.exports = ${render};`;
};

module.exports = loader;