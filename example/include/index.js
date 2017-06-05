const render = require('./index.art');
const data = {
    title: 'My Page'
};
const html = render(data);
console.log(html);

if (typeof document === 'object') {
    document.body.innerHTML = html;
}

module.exports = render;