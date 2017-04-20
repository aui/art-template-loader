const assert = require('assert');

module.exports = {

    'include': {
        'render': () => {
            const render = require('../example/dist/include');
            const data = {
                title: 'My Page'
            };
            const result = render(data);
            assert.equal(true, result.indexOf('<h1>My Page</h1>') > -1);
            assert.equal(true, result.indexOf('</footer>') > -1);
        }
    },

    'layout': {
        'render': ()=>{
            const render = require('../example/dist/layout');
            const data = {
                title: 'My Page'
            };
            const result = render(data)
            assert.equal(true, result.indexOf('<title>My Page</title>') > -1);
            assert.equal(true, result.indexOf('</head>') > -1);
            assert.equal(false, /<\/html>.+/.test(result));
        }
    }

};