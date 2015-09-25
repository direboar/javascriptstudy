"use strict";

//1 テストのグルーピング
module("DOM", {
	// 2 セットアップ
	beforeEach:function () {
		// Loggerのwrite処理を起きかえ
		testutils.logger.write = function(message){
			$('#log-message-ol').append('<li>'+message+'</li>');
		};

		// #custom-fixtureのストア処理
		testutils.htmlfixture.setupFixture();
		testutils.htmlfixture.replaceFixture('./html/html-testdom.html');

	},
	afterEach:function() {
		// #custom-fixtureのリストア処理
		testutils.htmlfixture.teardownFixture();

		// Logger出力エリアは、必要ならクリアできる
//		$('#log-message-ol').empty();
	}
});

//3 テストケース定義
test("ノードの選択", function () {
	//全検索にするとqUnitのボタンも含まれるので、テスト用div以下を検索。全検索時はdocumentオブジェクトに対して呼べば良い。
	var customFixture = document.getElementById('custom-fixture');

	//1.idによる検索  これはdocumentにしか定義されていないみたい…
//	var node = customFixture.getElementById('text-id');
	var node = document.getElementById('text-id');
	ok(node);
	equal(node.value,"text-value");

	//2.タグ名による検索
	var nodeList = customFixture.getElementsByTagName('button');
	ok(nodeList);
	equal(nodeList.length,2);
	equal(nodeList[0].textContent,"ボタン1");
	equal(nodeList[1].textContent,"ボタン2");

	//NodeListは可変リスト（ライブ・オブジェクト）なので、通常は配列に変換して操作する方が効率が良い。
	//Array#sliceを使用すると、配列もどきオブジェクトを配列に変換できる。
	var nodeArray = Array.prototype.slice.call(nodeList);
	equal(nodeArray.length,2);
	equal(nodeArray[0].textContent,"ボタン1");
	equal(nodeArray[1].textContent,"ボタン2");

	//3.名前による検索 これはdocumentにしか定義されていないみたい…。NodeListが帰ってくるので複数件検索。
//	nodeList = customFixture.getElementsByName('text-name');
	nodeList = document.getElementsByName('text-name');
	ok(nodeList);
	equal(nodeList.length,1);
	equal(nodeList[0].value,"text-value");

	testutils.logger.dump(nodeList[0]);

	//4.親子関係の検索。
	//childNodes系のAPI　…　空白文字列などのノードも含んだ検索が行われる。普段使わないので割愛

	//children系のAPI …空白ノードやコメントノードが除外されるので、普通こちらを使う。
	var children = customFixture.children;
	//testutils.logger.log(children);	//HTMLCollectionが帰ってくるので、配列に置換してトラバースする
	var childrenArray = Array.prototype.slice.call(children);
	equal(childrenArray.length,4);
	equal(childrenArray[0].id,'checkbox-id');
	equal(childrenArray[1].id,'text-id');
	equal(childrenArray[2].id,'button-id');
	equal(childrenArray[3].id,'button-id2');

    //XPath 難しいので1例のみ。
	//div[@id="custom-fixture"]/button[1]
	nodeList = document.evaluate(
		'//div[@id="custom-fixture"]/', //xpath idがcustom-fixtureのdivタグ。
		document,                              //起点
		null,							       //名前空間。普通入らない
		XPathResult.ORDERD_NODE_SNAPSHOT_TYPE, //オプジョン。普通は「スナップショット（非可変リスト）、ソート済」のオプションで良いと思われ
		null								　 //XPathResultを再利用する場合、XPathResultを指定。普通使わない。
	);

	ok(nodeList);
	equal(nodeList.length,1);
	equal(nodeList[0].id,'custom-fixture');

});

