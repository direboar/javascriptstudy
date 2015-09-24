"use strict";

//1 テストのグルーピング
module("関数", {
	// 2 セットアップ
	setup : function() {
	}
});

test("関数オブジェクト", function() {

	var func = function() {
		return true;
	};

	// 1.関数はオブジェクト（ただしtypeofするとfunctionになる模様…）
	equal(typeof func, 'function');

	// 2.関数のコンストラクタはFunction
	ok(func instanceof Function);
	ok(func.constructor == Function);
	ok(true, func.constructor);

	// 3.Function.prototypeにプロトタイプ継承をしている。
	Function.prototype.debug = function(message) {
		// alert(message);
	}

	func = function() {
		// debug('debug message');
		// //Function.proptotypeを拡張したとしても、関数ブロックで使えるわけではない（当たり前）
		// this.debug('debug message');//funcはコンストラクタ生成してないので、thisはグローバルオブジェクト。
		return true;
	}

	func.debug(''); // Function.proptotypeのメソッドは、普通に呼べる。
	func();

});

test("関数呼び出しパターン１：メソッド呼び出し（パブリック…メソッド）", function() {
	// コンストラクタ呼び出しと区別するため、コンストラクタ定義しないオブジェクト生成をする

	var obj = {
		attr : "attr",
		func : function() {
			// メソッド呼出時のthisは、メソッドが定義されているオブジェクトを指す
			return this.attr;
		}
	};

	equal("attr", obj.func());

});

test("関数呼び出しパターン２：関数呼び出し", function() {

	attr = "grb";
	var ff = function() {
		// thisはグローバル・オブジェクトを指す
		return this.attr;
	}
	equal("grb", ff());

	//
	var obj = {
		attr : "attr",
		func : function() {
			// メソッド呼出しから呼び出される内部関数に、thisは引き継がれず、グローバルオブジェクトを指してしまう。
			var helper = function() {
				return this.attr;
			}
			return helper();
			// return this.attr;
		},

		func2 : function() {
			return '[' + this.func() + ']'; // こちらだと期待通り動作する。
		}

	};

	equal("[grb]", obj.func2());
	// equal("[attr]", obj.func2());

});

test("関数呼び出しパターン３：コンストラクタ呼び出し", function() {

	// コンストラクタ呼出し（newキーワード）とは？

	// 1.呼び出し時に、暗黙的にオブジェクトが生成され、thlsに設定される。
	//   生成されるオブジェクトは、new呼び出しされた関数オブジェクトのプロトタイプへの暗黙的リンクが__proto__に設定される。
	// 2.コンストラクタ内では、thisはコンストラクタで生成されたオブジェクトを指す。
	// 3.コンストラクタで生成されたオブジェクトのconstructorプロパティは、newキーワードで呼びだされた関数オブジェクトとなる。
	// 　よってnewキーワードで呼びだされた関数オブジェクトのプロトタイプが継承される。
	// 4.コンストラクタ呼び出しされた関数が戻り値を返さなかった場合、暗黙的にthisが返却される。

	var MyConstructor = function(attr) {
		// thisは、new呼び出し時に生成されたインスタンス。
		this.attr = attr;

		// コンストラクタの戻り値でインスタンスを返却することも可能。
		// その場合は、newキーワードで生成されたインスタンス = this は返却されない。
		// わかりづらいのでやめたほうがいいね…
		// return {
		// getAttr : MyConstructor.prototype.getAttr
		// }
	}
	MyConstructor.prototype.getAttr = function() {
		return this.attr;
	}

	var instance = new MyConstructor('hoge');
	equal('hoge', instance.getAttr());

	// もしnewキーワードを付け忘れて、「コンストラクタ呼出しが前提の関数」をよびだすと？
	var v = MyConstructor('aaaaaa');
	equal(undefined, v); // インスタンスは生成されない。
	equal('aaaaaa', attr); // thisキーワードはグローバルオブジェクトなので、グローバルオブジェクトの意図しない更新がされる可能性あり。

});

test("関数呼び出しパターン４：apply/call呼び出し", function() {
	var MyConstructor = function(x, y) {
		this.x = x;
		this.y = y;
	}
	MyConstructor.prototype.sum = function(z, p) {
		return this.x + this.y + z + p;
	}

	var instance = new MyConstructor(3, 7);
	equal(13, instance.sum(1, 2));

	// メソッドオブジェクトのapplyメソッドを呼び出すと、メソッド呼出時のthisを指定できる。
	var obj = {
		x : 100,
		y : 200
	};

	equal(303, MyConstructor.prototype.sum.apply(obj, [ 1, 2 ]));
    // equal("",Function.prototype.apply);

	//callはapplyと同じだが、引数を配列にする必要が無い。
	equal(303, MyConstructor.prototype.sum.call(obj,  1, 2 ));
});

test("関数呼び出し：番外 bind",function(){

	function hoge(){
		return this.x;
	}

	x = 1;//Globalオブジェクトに設定
	equal(1,hoge());

	//オブジェクトにバインドする。
	//メソッド呼出し時、バインドされたオブジェクトがthisに設定される。
	//なお、元のFunctionオブジェクトは変更されず、バインド済みのFunctionが戻り値として返却される。
	var obj = {x:100};
	equal(100,obj.x);
	var hogeBinded = hoge.bind(obj);

	equal(1,hoge());
	equal(100,hogeBinded());

	delete Window.x;

});

test("arguments引数", function() {
	// javaで言う可変長引数を実現できる。
	// 実際は、関数に対して常に暗黙的に渡される引数で、functionに定義した引数定義とは無関係に、
	// 全ての関数引数を配列もどきとして取得できる。（Array型ではないので、sort等のArray型関数を使用できいないらしい）
	var sum = function(x,y){
		var retVal = 0;
		for ( var i in arguments) {
			retVal += arguments[i];
		}
		return retVal;
	}

	equal(3,sum(1,2));
	equal(6,sum(1,2,3));

});

test("プロトタイプへの関数追加イディオム", function() {

	// 関数追加する際、既に追加されていたら追加しない。グローバル領域に変更が及ぶためのガード。
	if(Object.prototype.debug == undefined){
		Object.prototype.debug = function(message){
// alert(message);
		}
	}

	var Constructors = function(){
	};

	var obj = new Constructors();
	ok(true,obj.debug('aaa'));

});

test("スコープ①", function() {
	// JavaScriptはブロックスコープがなく、グローバルスコープ、関数スコープしかない。
    // 関数スコープは、同一関数で共用される。また、関数内関数から、関数内関数を定義した関数にある関数スコープにアクセスできる。

	var grob = 1;
	var funcscope = '1';
	var nestfuncscope = '1';
	equal(1,grob);
	equal(1,funcscope);
	equal(1,nestfuncscope);

    var f1 = function() {
    	var funcscope = '2';
    	equal(1,grob);
    	equal(2,funcscope);
    	equal(1,nestfuncscope);

    	var nestfunc = function(){
    		var nestfuncscope = '3';
        	equal(1,grob);
        	equal(2,funcscope);
        	equal(3,nestfuncscope);
    	}

    	equal(1,grob);
    	equal(2,funcscope);
    	equal(1,nestfuncscope);

	}

	equal(1,grob);
	equal(1,funcscope);
	equal(1,nestfuncscope);

});

test("スコープ②", function() {
	// ブロックスコープがないことの証明
	var i = 1;
	for(var j=0;j<5;j++){
		var i = j;
		equal(i,j);
	}

	// ブロックスコープがないので、ブロックを抜けてもi=1には戻らない。
	equal(4,i);
});

test("クロージャ",function(){

	var createClosure = function(){
		var attr = 1;

		return {
			//関数increment,decrement,getAttrは「クロージャ」。

			//http://qiita.com/mochizukikotaro/items/7403835a0dbb00ea71ae
			//この関数の中の関数（ネストされた関数）「『inner』はクロージャです。」
			increment : function(){
				attr ++;
			},
			decrement : function(){
				attr --;
			},
			getAttr : function(){
				return attr;
			}
		}
	};

	var val = createClosure(); //返却した
	val.increment();
	equal(2,val.getAttr());
	val.decrement();
	equal(1,val.getAttr());
//	equal(1,val.attr); みれない。

	//参考
	//the good partsでは、クロージャを使用して、
	//今回例に上げたような特定のプロパティを非公開にし、特定のオペレーションを公開するようなパターンを
	//「モジュール」とよんでいる。なるほど。(p.47)

});

test("初期値イディオム",function(){

	var calc = function(x,y){
		x = x || 1;
		y = y || 1;
		return x * y;
	}

	equal(1,calc());
	equal(5,calc(5));
	equal(10,calc(5,2));

});

//TODO カリー化。後で読もう…
//http://qiita.com/KDKTN/items/6a27c0e8efa66b1f7799