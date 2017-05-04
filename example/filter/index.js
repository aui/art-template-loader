require('./template-filter');
const render = require('./index.art');
const data = {
    time: 1493791254254
};
const html = render(data);
console.log(html);

module.exports = render;