const imports = require('art-template/lib/template-imports');

imports.$include = function(){
    return '{{include}}';
};

module.exports = imports;