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

	Fixture.prototype.setupFixture = function storeFixture() {
		var fixture = $("#custom-fixture" );
		if ( fixture ) {
			fixtureHtml = fixture.html();
		}
		alert("setupFixture:"+fixtureHtml)
	}

	Fixture.prototype.replaceFixture = function replaceFixture(replaceHtml) {
		if(replaceHtml != undefined && replaceHtml != null){
			$.ajax(
				{
					async : false,
					type : 'GET',
					url : replaceHtml,
					dataType : 'html',
					success  : function(data){
						alert("replaceFixture:"+data)
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
			alert("teardownFixture:"+fixtureHtml)
			fixture.html(fixtureHtml);
		}
	}
	return new Fixture();
}());

// 1 テストのグルーピング
module("UIテストサンプル", {
  // 2 セットアップ
  beforeEach:function () {
	  // Loggerのwrite処理を起きかえ
	  minokuba_utils.logger.write = function(message){
		  $('#log-message-ol').append('<li>'+message+'</li>');
	  };

	  // #custom-fixtureのストア処理
	  Fixture.setupFixture();

  },
  afterEach:function() {
	  // #custom-fixtureのリストア処理
	  Fixture.teardownFixture();

	  // Logger出力エリアは、必要ならクリアできる
	  $('#log-message-ol').empty();
  }
});



// 3 テストケース定義
test("UIテストサンプル", function () {
	  minokuba_utils.logger.log("test1");

	Fixture.replaceFixture('./html/html-test01.html');
	ok(true);
});

//3 テストケース定義
test("UIテストサンプル2", function () {
	  minokuba_utils.logger.log("test2");
	ok(true);
});
