const loaderUtils = require('loader-utils');
const template = require('art-template');
const precompile = require('art-template/lib/precompile');

// Proprietary options: htmlResourceRoot, htmlResourceRules

const loader = function (source) {

	let result;
	let options = loaderUtils.getOptions(this) || {};
	let htmlResourceRules = [/\bsrc="([^"]*)"/];
	const htmlResourceRoot = options.htmlResourceRoot;
	const callback = this.callback;
	const use = (match, url) => {
		let code;
		const output = 'raw';

		if (loaderUtils.isUrlRequest(url, htmlResourceRoot)) {
			const urlRequest = loaderUtils.urlToRequest(url, htmlResourceRoot);
			const attr = match.split(url);
			const codes = [attr[0], urlRequest, attr[1]].map(JSON.stringify);
			code = codes[0] + `+require(${codes[1]})+` + codes[2];
		} else {
			code = JSON.stringify(match);
		}

		return {
			output,
			code
		};
	};


	if (this.cacheable) {
		this.cacheable();
	}

	if (options.debug === undefined) {
		options.debug = this.debug;
	}

	if (options.minimize === undefined) {
		options.minimize = this.minimize;
	}

	if (options.htmlResourceRules !== undefined) {
		if (Array.isArray(options.htmlResourceRules)) {
			htmlResourceRules = options.htmlResourceRules;
		} else if (options.htmlResourceRules === false) {
			htmlResourceRules = [];
		} else {
			throw new Error(`Invalid value to options parameter htmlResourceRules`);
		}
	}

	if (options.rules === undefined) {
		options.rules = [];
	}

	if (options.ignore === undefined) {
		options.ignore = [];
	}

	options.rules.push(...template.defaults.rules);
	htmlResourceRules.forEach(test => {
		options.rules.push({
			test,
			use
		});
	});

	options.source = source;
	options.filename = this.resourcePath;
	options.sourceMap = this.sourceMap;
	options.sourceRoot = process.cwd();
	options.ignore.push(`require`);

	try {
		result = precompile(options);
	} catch (error) {
		delete error.stack; // 这样才能打印 art-template 调试信息
		callback(error);
		return;
	}

	const code = result.toString();
	const sourceMap = result.sourceMap;
	const ast = result.ast;

	if (sourceMap && (!sourceMap.sourcesContent || !sourceMap.sourcesContent.length)) {
		sourceMap.sourcesContent = [source];
	}

	callback(null, code, sourceMap, ast);
};



module.exports = loader;