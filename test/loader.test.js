require("should");

var loader = require("../");
loader.__returnString = true;

describe("loader", function() {
	it("should convert to requires", function() {
		loader.call({}, 'Text <img src="image.png"><img src="~bootstrap-img"> Text').should.be.eql(
			'Text <img src="\x02\x02./image.png\x03\x03"><img src="\x02\x02bootstrap-img\x03\x03"> Text'
		);
	});
	it("should accept htmlAttrs from query", function() {
		loader.call({
			query: "?htmlAttrs=script:src"
		}, 'Text <script src="script.js"><img src="image.png">').should.be.eql(
			'Text <script src="\x02\x02./script.js\x03\x03"><img src="image.png">'
		);
	});
	it("should accept htmlAttrs from query (space separated)", function() {
		loader.call({
			query: "?htmlAttrs=script:src img:src"
		}, 'Text <script src="script.js"><img src="image.png">').should.be.eql(
			'Text <script src="\x02\x02./script.js\x03\x03"><img src="\x02\x02./image.png\x03\x03">'
		);
	});
	it("should accept htmlAttrs from query (multiple)", function() {
		loader.call({
			query: "?htmlAttrs[]=script:src&htmlAttrs[]=img:src"
		}, 'Text <script src="script.js"><img src="image.png">').should.be.eql(
			'Text <script src="\x02\x02./script.js\x03\x03"><img src="\x02\x02./image.png\x03\x03">'
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
			'Text <img src="\x02\x02/test/image.png\x03\x03">'
		);
	});
	it("should ignore hash fragments in URLs", function() {
		loader.call({}, '<img src="icons.svg#hash">').should.be.eql(
			'<img src="\x02\x02./icons.svg\x03\x03#hash">'
		);
	});
});
