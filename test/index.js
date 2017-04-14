var render = require('./res/index.art');
var html = render({
    user: {
        name: 'aui',
        tags: ['art', 'template', 'nodejs']
    }
});
console.log(html);