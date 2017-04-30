require("should");

var loader = require("../");
loader.__returnString = true;


describe("loader", function() {
	it("should convert to requires", function() {
		loader.call({}, 'Text <img src="image.png"><img src="~bootstrap-img"> Text').should.be.eql(
			'Text <img src="{{art-template-loader}}require("./image.png"){{/art-template-loader}}"><img src="{{art-template-loader}}require("bootstrap-img"){{/art-template-loader}}"> Text'
		);
	});
	it("should accept htmlAttrs from query", function() {
		loader.call({
			query: "?htmlAttrs=script:src"
		}, 'Text <script src="script.js"><img src="image.png">').should.be.eql(
			'Text <script src="{{art-template-loader}}require("./script.js"){{/art-template-loader}}"><img src="image.png">'
		);
	});
	it("should accept htmlAttrs from query (space separated)", function() {
		loader.call({
			query: "?htmlAttrs=script:src img:src"
		}, 'Text <script src="script.js"><img src="image.png">').should.be.eql(
			'Text <script src="{{art-template-loader}}require("./script.js"){{/art-template-loader}}"><img src="{{art-template-loader}}require("./image.png"){{/art-template-loader}}">'
		);
	});
	it("should accept htmlAttrs from query (multiple)", function() {
		loader.call({
			query: "?htmlAttrs[]=script:src&htmlAttrs[]=img:src"
		}, 'Text <script src="script.js"><img src="image.png">').should.be.eql(
			'Text <script src="{{art-template-loader}}require("./script.js"){{/art-template-loader}}"><img src="{{art-template-loader}}require("./image.png"){{/art-template-loader}}">'
		);
	});
	it("should not make bad things with templates", function() {
		loader.call({}, '<h3>#{number} {customer}</h3>\n<p>   {title}   </p>').should.be.eql(
			'<h3>#{number} {customer}</h3>\n<p>   {title}   </p>'
		);
	});
	it("should not translate root-relative urls (without htmlResourceRoot query)", function() {
		loader.call({}, 'Text <img src="/image.png">').should.be.eql(
			'Text <img src="/image.png">'
		);
	});
	it("should accept htmlResourceRoot from query", function() {
		loader.call({
			query: "?htmlResourceRoot=/test"
		}, 'Text <img src="/image.png">').should.be.eql(
			'Text <img src="{{art-template-loader}}require("/test/image.png"){{/art-template-loader}}">'
		);
	});
	it("should ignore hash fragments in URLs", function() {
		loader.call({}, '<img src="icons.svg#hash">').should.be.eql(
			'<img src="{{art-template-loader}}require("./icons.svg"){{/art-template-loader}}#hash">'
		);
	});
});
