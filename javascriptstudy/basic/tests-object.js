"use strict";

//文字列型
//1 テストのグルーピング
module("オブジェクト", {
	// 2 セットアップ
	setup : function() {
	}
});

test("オブジェクト", function() {
	// オブジェクトリテラル復習
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

	// コンストラクタ。
	var MyClass = function(attr) {
		this.attr = attr;
	};
	// プロトタイプはコンストラクタに対して設定する。
	MyClass.prototype = obj;
	var myInstance = new MyClass("zzz");

	equal("foo", myInstance.foo);
	equal(25, myInstance.age);
	equal("hello", myInstance.hello());
	equal("zzz", myInstance.attr);

	// equal(true,myInstance.prototype); undefined. プロトタイプはあくまでコンストラクタ。

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

//当面、こちらを採用する。しよう。（継承２も仕組みは一緒。）
//本質的に以下の対応をする。
//１）子クラスのコンストラクタで親クラスのコンストラクタのapplyを呼び初期化する、
//２）子クラスのプロトタイプに、親クラスのインスタンスをObject#createで生成して設定する（コンストラクタを呼ばなくて生成可能なため）
//３）子クラスのプロトタイプのコンストラクタを、子クラスで上書きする。
//この設計では、親クラスのプロトタイプに_superでアクセスできる点、コンストラクタがenumarateされない点が異なるのみ。
test("継承", function() {
	// 色いろあるようだが、Node.js の util.inheritsのパターン。
	// http://qiita.com/LightSpeedC/items/d307d809ecf2710bd957
	var Base = function(name) {
		this.name = name;
	};

	Base.prototype.getName = function() {
		return this.name;
	};

	Base.prototype.sayHello = function() {
		return 'こんにちは' + this.name + 'です';
	};

	var base = new Base("11");
	equal('11', base.getName());
	equal('こんにちは11です', base.sayHello());

	function inherits(ctor, superCtor) {
		ctor.super_ = superCtor;

		//Object.create()の仕様：
		//指定したプロトタイプオブジェクトおよびプロパティを持つ、新たなオブジェクトを生成します。
        //第一引数：プロトタイプオブジェクト
		//第二引数：propertiesObject（生成するオブジェクトのプロパティ。プロパティ記述子を合わせて指定する。
		//https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/create
		ctor.prototype = Object.create(superCtor.prototype, {
			constructor : {
				value : ctor,
				enumerable : false,
				writable : true,
				configurable : true
			}
		});

		// 追加 継承用に追加したが、面倒・・
		ctor.prototype._super = superCtor.prototype;
	}

	var Ext = function(name, sex) {
		// Base関数を呼ぶだけなので、プロトタイプは設定されない。
		Base.apply(this, arguments);
		this.sex = sex;
	}
	inherits(Ext, Base);

	Ext.prototype.getSex = function() {
		return this.sex;
	}
	Ext.prototype.sayHello = function() {
		// スーパーメソッドの呼出し 面倒。。。
		return this._super.sayHello.apply(this) + "(性別:" + this.getSex() + ")";
	};

	var ext = new Ext("ほげ", "男");

	equal('こんにちはほげです(性別:男)', ext.sayHello());
	equal('男', ext.getSex());

});

test("継承2", function() {
	//https://gist.github.com/kshibata101/6000132
	//underscore.js
	var Base = function(name) {
		this.name = name;
	};
	Base.prototype.getName = function() {
		return this.name;
	};
	Base.prototype.sayHello = function() {
		return 'こんにちは' + this.name + 'です';
	};

	var base = new Base("11");
	equal('11', base.getName());
	equal('こんにちは11です', base.sayHello());

	var Ext = function(name, sex) {
		// Base関数を呼ぶだけなので、プロトタイプは設定されない。
		Base.apply(this, arguments);
		this.sex = sex;
	}

	//自作。プロトタイプチェーンをたどり、親プロトタイプを取得する。（superを明示的に呼び出す）
	var getSuper = function(that){
		var originalPrototype = Object.getPrototypeOf(that);
		while(true){
			that = Object.getPrototypeOf(that);
			if(that == null){
				return null;
			}else{
				if(that === originalPrototype){
					continue;
				}else{
					return that;
				}
			}
		}
		return null;
	}

//	Ext.prototype = new Base();
	Ext.prototype = Object.create(Base.prototype); //Object#createを使用すると、コンストラクタが呼び出されない。
	Ext.prototype.constructor = Ext;

	Ext.prototype.getSex = function() {
		return this.sex;
	}

	Ext.prototype.sayHello = function() {
		var super_ = getSuper(this);
		return super_.sayHello.apply(this) + "(性別:" + this.getSex() + ")";
	};

	var ext = new Ext("ほげ", "男");
//
	equal('こんにちはほげです(性別:男)', ext.sayHello());
	equal('男', ext.getSex());

});

test("staticメソッド風", function() {
	//Javaのstaticメソッドっぽいものの実現方式。
	//なんということはない.
	//1.JavaScriptにはクラスの概念がなく、new呼び出しした際の関数オブジェクトをクラスに見立てているだけ
	//2.JavaScriptでは関数もオブジェクト
	//3.なので、コンストラクタ呼出しが前提となる関数オブジェクトのプロパティとして、関数を設定してあげれば良いだけの話。

	var Person = function(name){
		this.name = name;
	}
	//インスタンスメソッド（というか、プロトタイプのメソッド。）
	Person.prototype.getName = function(){
		return this.name;
	}

	//factory methodをスタティック風に定義。
	Person.create = function(name){
		name = "[[" + name + "]]";
		return new Person(name);
	}

    var person = Person.create("eiji");
    equal("[[eiji]]",person.getName());
});

test("シングルトン",function(){
    //わざわざシングルトンパターンにしなくて、リテラル使えばええやん！ by ガラケー本
	//インスタンス数も問題にならないのでクロージャ使ってみた。
	var Singleton = function(){
		var name = "NAME";
		var count = 0;
		var countup = function() {
			count++;
		};
		var getCount = function() {
			return count;
		};

		return {
			countup : countup,
			getCount : getCount
		};
	}();

	Singleton.countup();
	Singleton.countup();
	Singleton.countup();

	equal(3,Singleton.getCount());
//	equal(3,Singleton.name); 非公開。

});

test("オブジェクトのプロパティ確認",function(){
	var Base = function(name){
		this.name = name;
	}
	Base.prototype.getName = function(){
		return this.name;
	}

	equal(new Base("1").getName(),"1");

	var Sub = function(name,age){
		Base.apply(this,arguments);
		this.age =age;
	}
	Sub.prototype = Object.create(Base.prototype);
	Sub.prototype.constructor = Sub;

	Sub.prototype.getAge = function(){
		return this.age;
	}

	var sub = new Sub("aaa", 1);
//	for ( var propName in sub) {
//		ok(sub.hasOwnProperty(propName),propName);
//	}

	//nameプロパティは、Base関数実行時に、thisのプロパティとして定義されているので、プロパティは存在する。
	//(この辺、あくまでクラスっぽく見せてるだけっていうことの理解が求められる。）
	ok(sub.hasOwnProperty('age'),'age');
	ok(sub.hasOwnProperty('name'),'name');
	//プロパティのみ判定されるので、プロトタイプは参照されない。
	ok(!sub.hasOwnProperty('getAge'),'getAge');
	ok(!sub.hasOwnProperty('getName'),'getName');
	//プロトタイプを確認。
	ok(Object.getPrototypeOf(sub).hasOwnProperty('getAge'),'getAge');
	ok(!Object.getPrototypeOf(sub).hasOwnProperty('getName'),'getName');

//	ok(sub.hasOwnProperty('age'),'age');
//	ok(sub.hasOwnProperty('age'),'age');

});

test("プロトタイプオブジェクトの理解",function(){
	//1.プロトタイプオブジェクトは、関数の属性として保持される。
	//2.関数をコンストラクタ呼び出しして生成されたオブジェクトには、「コンストラクタ関数の」プロトタイプオブジェクトに対する「リンク」ができる。
	//  (オブジェクトに、コンストラクタ関数のプロトタイプオブジェクトがコピーされるわけではない）
	//3.オブジェクト生成後に、関数に定義されたプロトタイプオブジェクトを変更した場合、確信リンクを持つ全てのオブジェクトの挙動が変更される。

	//「クラス」定義
	var BaseClass = function(){};
	BaseClass.prototype.exec = function() {
		return "111";
	}

	//「オブジェクト」生成
	var obj = new BaseClass();
	// 1.objにプロトタイプオブジェクトがあるわけではない()
	equal(obj.prototype,undefined);
	// 2.objは、BaseClass.prototypeに対するリンクを持つ
	equal(BaseClass.prototype,Object.getPrototypeOf(obj));

	equal("111",obj.exec());

	// 3.プロトタイプを変更した場合、生成済みのオブジェクトに影響が与えられる。
	BaseClass.prototype.sayHello = function() {
		return "hello!";
	}
	BaseClass.prototype.exec = function() {
		return "exec!";
	}
	equal('hello!',obj.sayHello());
	equal('exec!',obj.exec());

	//なお、コンストラクタ関数自体がリンクを持つプロトタイプオブジェクトは、Functionクラスのプロトタイプオブジェクト。
	//関数定義自体、「Function」クラスの「インスタンス」相当であると考えれば納得いく。
	equal(Object.getPrototypeOf(BaseClass),Function.prototype);


});
