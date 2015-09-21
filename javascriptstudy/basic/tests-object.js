//文字列型
//1 テストのグルーピング
module("オブジェクト", {
	// 2 セットアップ
	setup : function() {
	}
});

test("オブジェクト", function() {
	//オブジェクトリテラル復習
	var obj = {
		foo : "foo",
		age : 25,
		hello : function() {
			return "hello";
		}
	};

	equal("foo", obj.foo);
	equal(25, obj.age);
	equal("hello", obj.hello());

	//コンストラクタ。
	var MyClass = function(attr){
    	this.attr = attr;
	};
	//プロトタイプはコンストラクタに対して設定する。
	MyClass.prototype = obj;
	var myInstance = new MyClass("zzz");

	equal("foo", myInstance.foo);
	equal(25, myInstance.age);
	equal("hello", myInstance.hello());
	equal("zzz", myInstance.attr);

//	equal(true,myInstance.prototype); undefined. プロトタイプはあくまでコンストラクタ。

});

test("リフレクション", function() {

	// リフレクション good partsの記載と違うな。。。
	var obj = {
		foo : "foo",
		age : 25,
		hello : function() {
			return "hello";
		}
	};

	// ok(true,obj.constructor)

	obj.prototype = {
		foo : 'FOO',
		goodby : function() {
			return "goodby";
		}
	}

	// obj.constructor = Object;

	for ( var i in obj) {
		ok(true, i);
		ok(true, obj[i]);
	}

});