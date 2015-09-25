"use strict";

/**
 * qUnit Fixtureの代替を実現するクラス その２ ajaxで外部HTMLを読み込めるようにした。。 <div
 * id='<#qunit-fixture'>を使用した場合、対象のdivはブラウザに表示されずわかりづらい。
 * そのため、上記以外のdivを設け、対象のdivのテスト毎初期化処理を行う。
 */
var Fixture = (function(){
	var fixtureHtml;

	var Fixture = function(){
	}

	Fixture.prototype.setupFixture = function storeFixture(replaceHtml) {
		var fixture = $("#custom-fixture" );
		if ( fixture ) {
			fixtureHtml = fixture.html();
		}

		if(replaceHtml != undefined && replaceHtml != null){
			$.ajax(
				{
					type : 'GET',
					url : replaceHtml,
					dataType : 'html',
					success  : function(data){
						$("#custom-fixture").html(data);
					},
					error : function(xhr, textStatus, errorThrown){
						alert(textStatus);
						alert(errorThrown);
					}
				}
			);
		}

	}

	Fixture.prototype.teardownFixture = function restoreFixture(){
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
	  // #custom-fixtureのストア処理
	  Fixture.setupFixture();

	  // Loggerのwrite処理を起きかえ
	  minokuba_utils.logger.write = function(message){
		  $('#log-message-ol').append('<li>'+message+'</li>');
	  };
  },
  teardown : function() {
	  // #custom-fixtureのリストア処理
	  Fixture.teardownFixture();

	  // Logger出力エリアは、必要ならクリアできる
	  $('#log-message-ol').empty();
  }
});

// 3 テストケース定義
test("UIテストサンプル", function () {
	Fixture.setupFixture('./html/html-test01.html');
    alert();
});

