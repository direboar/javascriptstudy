"use strict";

// 1 テストのグルーピング
module("イベント", {
	// 2 セットアップ
	beforeEach:function () {
		testutils.logger.level = 2;
		// Loggerのwrite処理を起きかえ
		testutils.logger.write = function(message){
			$('#log-message-ol').append('<li>'+message+'</li>');
		};
		// Logger出力エリアは、必要ならクリアできる
		$('#log-message-ol').empty();

		// #custom-fixtureのストア処理
		testutils.htmlfixture.setupFixture();
		testutils.htmlfixture.replaceFixture('./html/html-testevent.html');


	},
	afterEach:function() {
		// #custom-fixtureのリストア処理
		testutils.htmlfixture.teardownFixture();

	}
});

//TODO テストフィクスチャとして一体で纏めておきたい。loggerに入れたい。
function getLog(index){
	var li1 = $('#log-message-ol').children()[index];
	var log = $(li1).text();
	return log;
}
function clearLog(){
	$('#log-message-ol').empty();
}

// 3 テストケース定義
test("イベントハンドラ", function () {

	//イベントハンドラ　HTMLに定義したonclickはイベントハンドラ。
	var button1 = document.getElementById('button-id1');
	button1.click();
	equal(getLog(0),'button1 clicked()');
	clearLog();

	//イベントハンドラは、設定した要素のonclick属性などに保持される。リストではないため、単一設定のみ。
	var handler = button1.onclick;
	handler();
	equal(getLog(0),'button1 clicked()');
	clearLog();

	//イベントハンドラとして、onclick属性に直接関数オブジェクトを設定可能。
	button1.onclick = function(e){
		testutils.logger.log('hacked!',2);
		//イベントを受け取れる・
//		testutils.logger.dump(e,2);
		//4.altKey=false,button=0,buttons=0,clientX=68,clientY=182,ctrlKey=false,fromElement=null,layerX=68,layerY=182,metaKey=false,offsetX=59,offsetY=-790,pageX=68,pageY=182,relatedTarget=null,screenX=474,screenY=341,shiftKey=false,toElement=null,which=1,x=68,y=182,getModifierState= function getModifierState() { [native code] } ,initMouseEvent= function initMouseEvent() { [native code] } ,detail=2,view=[object Window],initUIEvent= function initUIEvent() { [native code] } ,bubbles=true,cancelBubble=false,cancelable=true,currentTarget=[object HTMLButtonElement],defaultPrevented=false,eventPhase=2,isTrusted=true,srcElement=[object HTMLButtonElement],target=[object HTMLButtonElement],timeStamp=1443248251795,type=click,initEvent= function initEvent() { [native code] } ,preventDefault= function preventDefault() { [native code] } ,stopImmediatePropagation= function stopImmediatePropagation() { [native code] } ,stopPropagation= function stopPropagation() { [native code] } ,AT_TARGET=2,BUBBLING_PHASE=3,CAPTURING_PHASE=1,
	}
	button1.click();
	equal(getLog(0),'hacked!');
	clearLog();
	//ハンドラを戻しておく
	button1.onclick = handler;

//	//イベントリスナ
//	//イベントリスナは複数設定できる。
	var listener1 = function() {
		testutils.logger.log('listener1',2);
	};
	var listener2 = function() {
		testutils.logger.log('listener2',2);
	};
	button1.addEventListener('click',listener1);
	button1.addEventListener('click',listener2);
	button1.click();

	//デフォルトのaddEventListnerを使った場合はバブリングフェーズに設定されるので、イベントハンドラの後に実行される。
	//またリスナはDOM Level3では設定順に実行されるらしい（DOM Level2では規定なし）。
	equal(getLog(0),'button1 clicked()');
	equal(getLog(1),'listener1');
	equal(getLog(2),'listener2');
	clearLog();

	//addEventListenerしたリスナは取得できないので、フレームワーク内でキャッシュしておく必要があるらしい…。ここでは変数におぼえておき削除。
	button1.removeEventListener('click',listener1);
	button1.removeEventListener('click',listener2);

	//thisについて
	var listener3 = function(){
		testutils.logger.log(this,2);
	}
	button1.onclick=null;
	button1.addEventListener('click',listener3);
	button1.click();
	//thisはイベントリスナが設定された対象（リスナーターゲット）を指す。
	//よって、イベントリスナでthisを明示したい場合は、基本的にはbindをしておくべき、ということになる。
	equal(getLog(0),'[object HTMLButtonElement]');
	button1.removeEventListener('click',listener3);
	clearLog();

	//イベントバブリング、イベントキャプチャリング
    //http://uhyohyo.net/javascript/3_3.html
	//イベント発生は「キャプチャリングフェーズ」「ターゲットフェーズ」「バブリングフェーズ」の3段階。
	//「キャプチャリングフェーズ」　…例えばボタンクリック時、ボタンが定義された親要素のほうから、ボタンにたどるまで、ツリーの上から下にイベントリスナの呼出しが発生
	//「ターゲットフェーズ」…イベントハンドラの呼出しが発生。これは対象のオブジェクトのみ。
	//「バブリングフェーズ」…例えばボタンクリック時、ボタンの要素から親要素に向かってイベントが逆順に発火する。
	//通常は、バブリングフェーズのみ考えておけば良い。
	//ターゲットには、イベントリスナを設定したオブジェクトが、currentTargetには各フェーズでイベントが発生したオブジェクトが設定される。
	//なおイベントの種類によっては、どちらかのフェーズでしか発生しないものもあるため、要注意。
    var html_captureing_listener = function(e) {
		testutils.logger.log('html_captureing_listener target=' + e.target + ",currentTarget="+e.currentTarget,2);
	}
    var body_captureing_listener = function(e) {
		testutils.logger.log('body_captureing_listener target='+ e.target + ",currentTarget="+e.currentTarget,2);
	}
    var div_captureing_listener = function(e) {
		testutils.logger.log('div_captureing_listener target='+ e.target + ",currentTarget="+e.currentTarget,2);
	}
    var button_captureing_listener = function(e) {
		testutils.logger.log('button_captureing_listener target='+ e.target + ",currentTarget="+e.currentTarget,2);
	}
    var html_bubbling_listener = function(e) {
		testutils.logger.log('html_bubbling_listener target='+ e.target + ",currentTarget="+e.currentTarget,2);
	}
    var body_bubbling_listener = function(e) {
		testutils.logger.log('body_bubbling_listener target='+ e.target + ",currentTarget="+e.currentTarget,2);
	}
    var div_bubbling_listener = function(e) {
		testutils.logger.log('div_bubbling_listener target='+ e.target + ",currentTarget="+e.currentTarget,2);
	}
    var button_bubbling_listener = function(e) {
		testutils.logger.log('button_bubbling_listener target='+ e.target + ",currentTarget="+e.currentTarget,2);
	}

	var html = document.getElementsByTagName('html')[0];
	var body = document.getElementsByTagName('body')[0];
	var div = document.getElementById('custom-fixture');
	button1 = document.getElementById('button-id1');

	html.addEventListener('click',html_captureing_listener,true);
	body.addEventListener('click',body_captureing_listener,true);
	div.addEventListener('click',div_captureing_listener,true);
	button1.addEventListener('click',button_captureing_listener,true);
	html.addEventListener('click',html_bubbling_listener);
	body.addEventListener('click',body_bubbling_listener);
	div.addEventListener('click',div_bubbling_listener);
	button1.addEventListener('click',button_bubbling_listener);
	button1.click();

	equal(getLog(0),'html_captureing_listener target=[object HTMLButtonElement],currentTarget=[object HTMLHtmlElement]');
	equal(getLog(1),'body_captureing_listener target=[object HTMLButtonElement],currentTarget=[object HTMLBodyElement]');
	equal(getLog(2),'div_captureing_listener target=[object HTMLButtonElement],currentTarget=[object HTMLDivElement]');
	equal(getLog(3),'button_captureing_listener target=[object HTMLButtonElement],currentTarget=[object HTMLButtonElement]');
	equal(getLog(4),'button_bubbling_listener target=[object HTMLButtonElement],currentTarget=[object HTMLButtonElement]');
	equal(getLog(5),'div_bubbling_listener target=[object HTMLButtonElement],currentTarget=[object HTMLDivElement]');
	equal(getLog(6),'body_bubbling_listener target=[object HTMLButtonElement],currentTarget=[object HTMLBodyElement]');
	equal(getLog(7),'html_bubbling_listener target=[object HTMLButtonElement],currentTarget=[object HTMLHtmlElement]');

	//イベント抑止(prevendDefault,return false;)
	//preventDefault …標準処理が取り消される。
	html.removeEventListener('click',html_captureing_listener,true);
	body.removeEventListener('click',body_captureing_listener,true);
	div.removeEventListener('click',div_captureing_listener,true);
	button1.removeEventListener('click',button_captureing_listener,true);
	html.removeEventListener('click',html_bubbling_listener);
	body.removeEventListener('click',body_bubbling_listener);
	div.removeEventListener('click',div_bubbling_listener);
	button1.removeEventListener('click',button_bubbling_listener);
	clearLog();

	var ankor = document.getElementById('ankor');
	var ankorListener = function(e){
		testutils.logger.log('cancel ankor',2);
		e.preventDefault();
//		return false; // return falseでイベントキャンセルできるのは、イベントハンドラの場合のみ。リスナのキャンセルには使えない。
	}
	ankor.addEventListener('click',ankorListener);
	ankor.click(); //キャンセルが失敗したら画面遷移するため、テストが失敗する（というか、Yahooに飛んで行く）

	equal(getLog(0),'cancel ankor');
	clearLog();

	//stopPropagation,stopPropagationImmediately …イベント伝搬を停止する
	//省略。。

});

