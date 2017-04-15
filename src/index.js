const template = require('art-template');
const acorn = require('acorn');
const escodegen = require('escodegen');
const estraverse = require('estraverse');
const loaderUtils = require('loader-utils');

const loader = function (source) {
    
    let render;
    this.cacheable && this.cacheable();
    const options = loaderUtils.getOptions(this);
    const config = Object.assign({
        imports: 'art-template/lib/imports',
        bail: true,
        cache: null,
        filename: this.resourcePath
    }, options);

    if (typeof config.imports !== 'string') {
        throw Error(`art-template-loader: "options.imports" is a file path. Example:\n` +
            `options: { imports: require.resolve("art-template/lib/imports") }\n`);
    }

    const imports = 'var $imports = require(' +
        loaderUtils.stringifyRequest(this, '!' + config.imports) +
        ');';

    config.imports = require(config.imports);

    try {
        render = template.compile(source, config).toString();
    } catch (error) {
        delete error.stack;
        error = JSON.stringify(error, null, 4);
        this.emitError(`${error}`);
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
                            "arguments": [node.arguments[0]]
                        }
                    }
                };

                requireNode.right.arguments = node.arguments[1] || [{
                    "type": "Identifier",
                    "name": "$data"
                }];


                return requireNode;
            }
        }
    });

    render = escodegen.generate(ast);

    return `${imports};\nmodule.exports = ${render};`;
};

module.exports = loader;