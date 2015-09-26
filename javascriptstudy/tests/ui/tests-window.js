"use strict";

//1 テストのグルーピング
module("Windowオブジェクト", {
	// 2 セットアップ
	beforeEach:function () {
		// Loggerのwrite処理を起きかえ
		testutils.logger.write = function(message){
			$('#log-message-ol').append('<li>'+message+'</li>');
		};

		// Logger出力エリアは、必要ならクリアできる
		$('#log-message-ol').empty();

		frames[0].src = "./html/html-iframe-content01.html";

		// #custom-fixtureのストア処理
		testutils.htmlfixture.setupFixture();

	},
	afterEach:function() {
		// #custom-fixtureのリストア処理
		testutils.htmlfixture.teardownFixture();


	}
});

//3 テストケース定義
test("window.navigator", function () {
	//userAgentの取得。
	ok(true,window.navigator.userAgent);
});

test("window.location,window.history,window.frames", function () {
	//本来はwindow.locationで試したいが、qUnitのテストファイル自体がリロードされたりするとテストが実施できないので、
	//iframeに対して実施する。

	window.frames[0].document.getElementById('txt1').value = 'hoge';
	equal('hoge',window.frames[0].document.getElementById('txt1').value);

//reroad
	window.frames[0].location.reload(false); //キャッシュ有効 trueを指定するとキャッシュを強制的に破棄。
	//非同期テスト。startが呼び出されるまでテストの実行を停止する。
	stop();
	setTimeout(function(assertion){
		equal('aaaaa',window.frames[0].document.getElementById('txt1').value);
		//非同期テストが完了したので、同期処理側に完了を通知する。
		start();
	},100);

//url指定してページ遷移
//	window.location.href = "./html/html-iframe-content02.html";
//  ifameに対しては実行できない。

//履歴を戻る
//	window.history.back();

//location.hrefと同じ
//	window.assign("http;//www,yahoo.co.jp");
//	window.history.back();
//	equal('初期値',$('#txt1').val());
//履歴が残らない
//	window.replace("http;//www,yahoo.co.jp");

	equal(window.frames.length,1); //window.framesで定義されたframe,iframeがとれる。frames自体はwindowオブジェクト。
	equal(frames[0].self,frames[0]);//selfは自分自身のwindowを返す。frames[0].self = frames[0].
	equal(window,frames[0].parent);//親ウィンドウを返す。
	equal(window,frames[0].top);   //フレームが入れ子時のTopウィンドウを返す。

});
