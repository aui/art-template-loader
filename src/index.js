const template = require('art-template/lib/template-node');
const precompile = require('art-template/lib/precompile');
const loaderUtils = require('loader-utils');
const attrParse = require('./attributes-parser');
const url = require('url');
const randomIdent = () => {
	return 'xxxHTMLLINKxxx' + Math.random() + Math.random() + 'xxx';
}

const openTag = `\x02\x02`;
const closeTag = `\x03\x03`;
template.defaults.rules.unshift({
	test: new RegExp(openTag + '(.*?)' + closeTag),
	use: (match, code) => {
		return {
			output: 'raw',
			code: `require(${JSON.stringify(code)})`
		}
	}
});

const loader = function(source) {

	this.cacheable && this.cacheable();

	let result;
	let attributes = ['img:src'];
    // htmlAttrs, htmlResourceRoot
	let options = loaderUtils.getOptions(this) || {};
	const callback = this.callback;

	if(options.debug === undefined) {
		options.debug = this.debug;
	}

	if(options.minimize === undefined) {
		options.minimize = this.minimize;
	}

	if(options.htmlAttrs !== undefined) {
		if(typeof options.htmlAttrs === `string`) {
			attributes = options.htmlAttrs.split(` `);
		} else if(Array.isArray(options.htmlAttrs)) {
			attributes = options.htmlAttrs;
		} else if(options.htmlAttrs === false) {
			attributes = [];
		} else {
			throw new Error(`Invalid value to options parameter htmlAttrs`);
		}
	}

	options = template.defaults.$extend(options);
	const htmlResourceRoot = options.htmlResourceRoot;
	const links = attrParse(source, function(tag, attr) {
		return attributes.indexOf(tag + ":" + attr) >= 0;
	});

	links.reverse();

	const data = {};
	source = [source];
	links.forEach(function(link) {
		if(!loaderUtils.isUrlRequest(link.value, htmlResourceRoot)) {
			return
		};

		let ident;
		const uri = url.parse(link.value);

		if(uri.hash !== null && uri.hash !== undefined) {
			uri.hash = null;
			link.value = uri.format();
			link.length = link.value.length;
		}

		do {
			ident = randomIdent();
		} while (data[ident]);

		data[ident] = link.value;
		const x = source.pop();
		source.push(x.substr(link.start + link.length));
		source.push(ident);
		source.push(x.substr(0, link.start));
	});
	source.reverse();
	source = source.join(``);
	source = source.replace(/xxxHTMLLINKxxx[0-9\.]+xxx/g, match => {
		if(!data[match]) {
			return match
		};
		return openTag + loaderUtils.urlToRequest(data[match], htmlResourceRoot) + closeTag;
	});

	// use mocha
	if(loader.__returnString) {
		return source;
	}

	options.source = source;
	options.filename = this.resourcePath;
	options.sourceMap = this.sourceMap;
	options.sourceRoot = process.cwd();
	options.ignore = options.ignore || [];
	options.ignore.push(`require`);

	try {
		result = precompile(options);
	} catch(error) {
		delete error.stack; // 这样才能打印 art-template 调试信息
		callback(error);
		return;
	}

	const code = result.toString();
	const sourceMap = result.sourceMap;
	const ast = result.ast;

	if(sourceMap && (!sourceMap.sourcesContent || !sourceMap.sourcesContent.length)) {
		sourceMap.sourcesContent = [source];
	}

	callback(null, code, sourceMap, ast);
};

module.exports = loader;
