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