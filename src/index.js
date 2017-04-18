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
        imports: 'art-template/lib/template-imports',
        bail: true,
        cache: null,
        filename: loader.resourcePath
    }, options);

    if (typeof config.imports !== 'string') {
        throw Error(`art-template-loader: "options.imports" is a file path. Example:\n` +
            `options: { imports: require.resolve("art-template/lib/template-imports") }\n`);
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
    let extendNode = null;
    const functions = [`include`, `extend`, `$$layout`, `$include`];

    ast = estraverse.replace(ast, {
        enter: function (node) {
            if (node.type === 'VariableDeclarator' &&
                functions.includes(node.id.name)) {

                this.remove();

            } else if (node.type === 'CallExpression' &&
                node.callee.type === 'Identifier' &&
                functions.includes(node.callee.name)) {

                switch (node.callee.name) {

                    case `extend`:

                        extendNode = node.arguments[0];

                        return {
                            "type": "AssignmentExpression",
                            "operator": "=",
                            "left": {
                                "type": "Identifier",
                                "name": "$$extend"
                            },
                            "right": extendNode
                        };

                    case `$$layout`:
                        return {
                            "type": "CallExpression",
                            "callee": {
                                "type": "CallExpression",
                                "callee": {
                                    "type": "Identifier",
                                    "name": "require"
                                },
                                "arguments": [extendNode]
                            },
                            "arguments": [{
                                    "type": "Identifier",
                                    "name": "$data"
                                },
                                {
                                    "type": "Identifier",
                                    "name": "$$block"
                                }
                            ]
                        };

                    case `include`:

                        const filenameNode = node.arguments[0];
                        const dataNode = node.arguments[1] || {
                            "type": "Identifier",
                            "name": "$data"
                        };

                        if (config.root && filenameNode.type === 'Literal' && /^[^\.]/.test(filenameNode.value)) {
                            const context = loader.context || (loader.options && loader.options.context);
                            filenameNode.value = path.resolve(config.root, filenameNode.value);
                            filenameNode.value = './' + path.relative(context, filenameNode.value);

                            delete filenameNode.raw;
                        }

                        const requireNode = {
                            "type": "AssignmentExpression",
                            "operator": "+=",
                            "left": {
                                "type": "Identifier",
                                "name": "$$out"
                            },
                            "right": {
                                "type": "CallExpression",
                                "callee": {
                                    "type": "CallExpression",
                                    "callee": {
                                        "type": "Identifier",
                                        "name": "require"
                                    },
                                    "arguments": [filenameNode]
                                },
                                "arguments": [dataNode]
                            }
                        };


                        return requireNode;
                }


            }
        }
    });

    render = escodegen.generate(ast);

    return `${imports};\nmodule.exports = ${render};`;
};

module.exports = loader;