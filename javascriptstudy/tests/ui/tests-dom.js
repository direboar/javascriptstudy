"use strict";

// 1 テストのグルーピング
module("DOM", {
	// 2 セットアップ
	beforeEach:function () {
		// Loggerのwrite処理を起きかえ
		testutils.logger.write = function(message){
			$('#log-message-ol').append('<li>'+message+'</li>');
		};
		// Logger出力エリアは、必要ならクリアできる
		$('#log-message-ol').empty();

		// #custom-fixtureのストア処理
		testutils.htmlfixture.setupFixture();
		testutils.htmlfixture.replaceFixture('./html/html-testdom.html');


	},
	afterEach:function() {
		// #custom-fixtureのリストア処理
		testutils.htmlfixture.teardownFixture();

	}
});

// 3 テストケース定義
test("ノードの選択", function () {
	// 全検索にするとqUnitのボタンも含まれるので、テスト用div以下を検索。全検索時はdocumentオブジェクトに対して呼べば良い。
	var customFixture = document.getElementById('custom-fixture');

	// 1.idによる検索 これはdocumentにしか定義されていないみたい…
// var node = customFixture.getElementById('text-id');
	var node = document.getElementById('text-id');
	ok(node);
	equal(node.value,"text-value");

	// 2.タグ名による検索
	var nodeList = customFixture.getElementsByTagName('button');
	ok(nodeList);
	equal(nodeList.length,2);
	equal(nodeList[0].textContent,"ボタン1");
	equal(nodeList[1].textContent,"ボタン2");

	// NodeListは可変リスト（ライブ・オブジェクト）なので、通常は配列に変換して操作する方が効率が良い。
	// Array#sliceを使用すると、配列もどきオブジェクトを配列に変換できる。
	var nodeArray = Array.prototype.slice.call(nodeList);
	equal(nodeArray.length,2);
	equal(nodeArray[0].textContent,"ボタン1");
	equal(nodeArray[1].textContent,"ボタン2");

	// 3.名前による検索 これはdocumentにしか定義されていないみたい…。NodeListが帰ってくるので複数件検索。
// nodeList = customFixture.getElementsByName('text-name');
	nodeList = document.getElementsByName('text-name');
	ok(nodeList);
	equal(nodeList.length,1);
	equal(nodeList[0].value,"text-value");
// testutils.logger.dump(nodeList[0]);

	// 4.親子関係の検索。
	// childNodes系のAPI … 空白文字列などのノードも含んだ検索が行われる。普段使わないので割愛

	// children系のAPI …空白ノードやコメントノードが除外されるので、普通こちらを使う。
	var children = customFixture.children;
	// testutils.logger.log(children); //HTMLCollectionが帰ってくるので、配列に置換してトラバースする
	var childrenArray = Array.prototype.slice.call(children);
	equal(childrenArray.length,4);
	equal(childrenArray[0].id,'checkbox-id');
	equal(childrenArray[1].id,'text-id');
	equal(childrenArray[2].id,'button-id');
	equal(childrenArray[3].id,'button-id2');

    // XPath 難しいので1例のみ。
	// div[@id="custom-fixture"]/button[1]
	// eclipse付属のブラウザ、IDでは実行不能。
	try{
	nodeList = document.evaluate(
		'//div[@id="custom-fixture"]', // xpath idがcustom-fixtureのdivタグ。
		document,                              // 起点
		null,							       // 名前空間。普通入らない
		XPathResult.ORDERD_NODE_SNAPSHOT_TYPE, // オプジョン。普通は「スナップショット（非可変リスト）、ソート済」のオプションで良いと思われ
		null								　 // XPathResultを再利用する場合、XPathResultを指定。普通使わない。
	);

	ok(nodeList);
	equal(nodeList.length,1);
	equal(nodeList[0].id,'custom-fixture');
	}catch (e) {
		ok(false,e);
		// TODO: handle exception
	}

	// Selector API
	// CSSのIDを指定して検索できる。
	var nodeList = customFixture.querySelectorAll('#checkbox-id');
//	testutils.logger.log(nodeList);
	equal(nodeList.length,1);
	equal(nodeList[0].id,'checkbox-id');

});

test("ノードの追加・編集・削除", function () {
	//ノードの追加。
	var input = document.createElement('input');
	input.name = 'append-text-name';
	input.type = 'text';
	input.id = 'append-text-id';
	input.value = 'あああ'; //何故innerHTMLでとれない・・・？

	var customFixture = document.getElementById('custom-fixture');
	customFixture.appendChild(input);

	var html = customFixture.innerHTML;
	var pattern = /<input name="append-text-name" id="append-text-id" type="text">/;
	ok(pattern.test(html),html);

	//ノードの削除
	customFixture.removeChild(input);

	//insertbeforeなどを使うと、指定したElementの前に追加できる。
	var checkbox = document.getElementById('checkbox-id');
	testutils.logger.log(checkbox);
	customFixture.insertBefore(input,checkbox);
	html = customFixture.innerHTML;
	pattern = /<input name="append-text-name" id="append-text-id" type="text"><input name="checkbox-name" id="checkbox-id" type="checkbox">/;
	ok(pattern.test(html),html);

	//ノードの変更は、そのまま編集するか、replaceChild。
	input.name = 'alterd-text-name';
	html = customFixture.innerHTML;
	pattern = /<input name="alterd-text-name" id="append-text-id" type="text"><input name="checkbox-name" id="checkbox-id" type="checkbox">/;
	ok(pattern.test(html),html);

	var hidden = document.createElement('input');
	hidden.name = 'append-hidden-name';
	hidden.type = 'hidden';
	hidden.id = 'append-hidden-id';
	hidden.value = 'あああ';
	customFixture.replaceChild(hidden,input);
	html = customFixture.innerHTML;
	pattern = /<input name="append-hidden-name" id="append-hidden-id" type="hidden" value="あああ"><input name="checkbox-name" id="checkbox-id" type="checkbox">/;
	ok(pattern.test(html),html);

	//innerHTML
	//子ノードを全部削除
	var children = customFixture.children;
	var childrenArray = Array.prototype.slice.call(children);
	for ( var idx in childrenArray) {
		customFixture.removeChild(childrenArray[idx]);
	}

	//innerHTMLの設定確認
	customFixture.innerHTML = '<input type="text" id="id" name="name" value="ZZZ"/>'
	var input2 = document.getElementById('id');
	equal(input2.type,'text');
	equal(input2.name,'name');
	equal(input2.value,'ZZZ');
	equal(input2.tagName,'INPUT');

	//textContent
	customFixture.innerHTML = '';
	customFixture.textContent = '<input type="text" id="id" name="name" value="ZZZ"/>';
	input2 = document.getElementById('id');
	ok(!input2);
	html = customFixture.innerHTML;
	pattern = /&lt;input type="text" id="id" name="name" value="ZZZ"\/&gt;/; //タグではなく、値として設定されるためHTMLエスケープされている。
	ok(pattern.test(html),html);

	//documentFragmentを使って、複数ノードの更新を1回で行う。
	customFixture.innerHTML = '';
	var fragment =document.createDocumentFragment();
	for ( var int = 0; int < 10; int++) {
		fragment.appendChild(document.createElement('input'));
	}
	customFixture.appendChild(fragment);
	html = customFixture.innerHTML;
	pattern = /<input><input><input><input><input><input><input><input><input><input>/;
	ok(pattern.test(html),html);

});
