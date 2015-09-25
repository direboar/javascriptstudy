"use strict";

//1 テストのグルーピング
module("UIテストサンプル", {
	// 2 セットアップ
	beforeEach:function () {
		// Loggerのwrite処理を起きかえ
		testutils.logger.write = function(message){
			$('#log-message-ol').append('<li>'+message+'</li>');
		};

		// #custom-fixtureのストア処理
		testutils.htmlfixture.setupFixture();

	},
	afterEach:function() {
		// #custom-fixtureのリストア処理
		testutils.htmlfixture.teardownFixture();

		// Logger出力エリアは、必要ならクリアできる
		$('#log-message-ol').empty();
	}
});

//3 テストケース定義
test("UIテストサンプル", function () {
	testutils.logger.log("test1");

	testutils.htmlfixture.replaceFixture('./html/html-fixture-example.html');
	ok(true);
});

//3 テストケース定義
test("UIテストサンプル2", function () {
	testutils.logger.log("test2");
	ok(true);
});
