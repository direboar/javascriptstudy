"use strict";

/**
 * qUnit Fixtureの代替を実現するクラス。
 * <div id='#qunit-fixture'>を使用した場合、対象のdivはブラウザに表示されずわかりづらい。
 * そのため、上記以外のdivを設け、対象のdivのテスト毎初期化処理を行う。
 */
var Fixture = (function(){
	var fixtureHtml;

	var Fixture = function(){
	}

	Fixture.prototype.storeFixture = function storeFixture() {
		var fixture = $("#custom-fixture" );
		if ( fixture ) {
			fixtureHtml = fixture.html();
		}
	}

	Fixture.prototype.restoreFixture = function restoreFixture(){
		var fixture = $("#custom-fixture" );
		if ( fixture ) {
			fixture.html(fixtureHtml);
		}
	}
	return new Fixture();
}());

// 1 テストのグルーピング
module("UIテストサンプル", {
  // 2 セットアップ
  setup: function () {
	  //#custom-fixtureのストア処理
	  Fixture.storeFixture();

	  //Loggerのwrite処理を起きかえ
	  minokuba_utils.logger.write = function(message){
		  $('#log-message-ol').append('<li>'+message+'</li>');
	  };
  },
  teardown : function() {
	  //#custom-fixtureのリストア処理
	  Fixture.restoreFixture();

	  //Logger出力エリアは、必要ならクリアできる
	  $('#log-message-ol').empty();
  }
});

// 3 テストケース定義
test("UIテストサンプル", function () {
	  $('#btn1').bind('click',function(){
		minokuba_utils.logger.log("xxxx");
	  });
	$('#btn1').click();

	//クリックイベントが確かに呼ばれたことを確認する。
	var messages = $('#log-message-ol>*');
	equal(messages[0].innerText,"xxxx")

	$('#txt1').val('Hello,World');
	equal($('#txt1').val(),'Hello,World');

});

test("UIテストサンプル(#custom-fixtureの挙動確認)", function () {
	$('#btn1').click();

	//イベントオブジェクトがクリアされているので、クリックしても反映されない。
	var messages = $('#log-message-ol>*');
	equal(0,messages.length);

	//HTMLの値が、JavaScriptで操作される前に戻されている。
	equal($('#txt1').val(),'初期値');

});
