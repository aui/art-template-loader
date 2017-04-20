const render = require('./index.art');
const data = {
    title: 'My Page'
};
const html = render(data);
console.log(html);

module.exports = render;