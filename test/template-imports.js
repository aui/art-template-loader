const imports = require('art-template/lib/imports');

imports.$include = function(){
    return '{{include}}';
};

module.exports = imports;