const render = require('./index.art'); 
const data = {
    parent: '<style>#example{}</style>\n'
};
const html = render(data);
console.log(html);

module.exports = render;