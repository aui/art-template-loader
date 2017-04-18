const assert = require('assert');

module.exports = {

    'include': {
        'render': () => {
            const render = require('../example/dist/include');
            const data = {
                parent: '<style>#example{}</style>\n'
            };
            const result = render(data);
            assert.equal(true, result.indexOf('<title>My Page</title>') > -1);
            assert.equal(true, result.indexOf('<style>#example{}</style>') > -1);
        }
    },

    'layout': {
        'render': ()=>{
            const render = require('../example/dist/layout');
            const data = {
                parent: '<style>#example{}</style>\n'
            };
            const result = render(data);
            assert.equal(true, result.indexOf('<title>My Page</title>') > -1);
            assert.equal(true, result.indexOf('<style>#example{}</style>') > -1);
        }
    }

};