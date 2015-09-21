//基本型・配列・オブジェクトリテラル・関数リテラル
//演算子・例外

//このテストJSは勘違いしてて、本来qUnitは期待値を後に書くらしい。

// 1 テストのグルーピング
module("データ型", {
  // 2 セットアップ
  setup: function () {
  }
});

// 3 テストケース定義
test("基本型", function () {
    // 数値型
    var number = 123;

    // Boolean
    var bool = true;
    bool = false;

    // 文字列型
    // 両端は、クォーテーションでもダブルクォーテーションでもよい
    var str = 'aaa';
    var str2 = "aaa";
    equal(str,str2);

    // ''で囲った場合は、"は文字として使える。""で囲った場合、文字中の"は\でエスケープする。
    str = 'aa"a';
    str2 = 'aa"a';
    equal(str,str2);

    // undefined型
　　　 var var3 = undefined;
    ok(var3  == undefined);
    ok(var3  != 'undefined'); // undefinedは文字列では指定しない。

    var var4;
    ok(var4  == undefined); // 変数宣言のみした場合は、undefinedが入っている
    ok(null  == undefined); // javascriptでは、nullとundefinedは等価である。

});

test("参照型（配列）", function () {
    // 配列
    var array1 = ['111','222','333'];
    equal('111',array1[0]);
    equal('222',array1[1]);
    equal('333',array1[2]);

    // 配列長を超えるとundefined
    equal(undefined,array1[3]);

    // 配列長の確認
    equal(3,array1.length);

 　　　// forループで配列を回す
    var out = "";
    for(var i=0;i<array1.length;i++){
        out += array1[i];
    }
    equal('111222333',out);

 　　　// for - in ループで回す
    out = "";
    for(var i in array1){
        // out += i ///tmpは、配列の値ではなくポインタが入る。
        out += array1[i];
    }
    equal('111222333',out);

 　　　// 配列にも型はない。
    var array2 = ['111',true,333];
    equal('111',array2[0]);
    equal(true,array2[1]);
    equal(333,array2[2]);

 　　　// 配列の入れ子はできるが、多次元配列ではない
    var nestArray = ['111',222,[333,'444'],[555,666,777]];
    equal('444',nestArray[2][1]);

    // 配列が参照型であることを確認
    var refered = [111,222,333];
    var referer = refered;
    // 配列の最後を削除
    refered.pop();
    // 参照元も、参照先も同じく、配列の最後の要素が削除されている。
    equal('111,222',refered.toString());
    equal('111,222',referer.toString());

});

// オブジェクトリテラルはもっと色々あるので、基本のみ。
test("参照型（オブジェクトリテラル）", function () {
    // オブジェクトリテラルを定義
    var obj1 = {
        attr1 : 111,
        attr2 : '222',
        attr3 : false
    };

    // equal('',obj1) toStringすると、上記と同じオブジェクトリテラルの文字列と評価される。

    // 属性へのアクセス
    equal(111,obj1.attr1);
    equal('222',obj1.attr2);
    equal(false,obj1.attr3);

    // オブジェクトは連想配列なので、連想配列っぽいアクセスも可能
    equal(111,obj1['attr1']);

    // 念のため、オブジェクトが参照型であることを確認
    var referee = obj1;
    obj1.attr1 = 'hoge';

    equal('hoge',referee.attr1);

});

// 関数リテラルはもっと色々あるので、基本のみ。
test("参照型（関数リテラル）", function () {
    // 通常の関数定義
    function func(val){
        return 'return '+ val + ';';
    }
    equal('return hoge;',func('hoge'));

    // 関数リテラルを使用すると、関数を変数に格納できる
    var funcs = function(val){
        return 'funcedit ' + val  + ';';
    }

    // 関数自体を、他の関数に引き渡し、コールバックできる。
    var nestfunc = function(val,func){
        var retVal = "";
        for(var i = 0;i<3;i++){
            // コールバック関数を３回呼び、その戻り値を連結して返却。
            retVal += func(val);
        }
        return retVal;
    }

    equal('funcedit hoge;funcedit hoge;funcedit hoge;',nestfunc('hoge',funcs));
});

// 1 テストのグルーピング
module("演算子", {
  // 2 セットアップ
  setup: function () {
  }
});

test("小数点演算", function () {
    // javascriptは数値演算を２進数で実施するので、小数の演算には向いていない。
    // 演算する場合は整数に戻して計算する。

    // 以下は桁あふれする
    // equal(0.6,0.2*3)
    var result = 0.2 * 10 * 3 / 10;
    equal(0.6,result);

});

test("比較演算", function () {
    // ==の場合は、型が違う場合は基本数値型に変換して比較。オブジェクト型の場合基本型？に変換して比較
    ok('111'==111,"数値型と文字列型：文字列型を数値に変換して比較");
    ok(1==true,"数値型と論理型：論理型を数値に変換して比較");
    // ok(1=='ture'); "true"は文字列なので数値変換されない？

    // ===の場合は型の一致を比較する。
    ok(1===1)
    // ok(1==='1')
    // !==の場合は、型が異なるか、値が異なる場合true
    // ok(1!==1)
    ok(1!==2)
    ok(1!=='1')

    // 配列やオブジェクトなど参照型は、参照の一致を比較。
    var obj1 = {attr : 'val'};
    var obj2 = {attr : 'val'};
    ok(obj1 == obj1)
    ok(obj1 != obj2)
});

test("delete(オブジェクトのプロパティや配列要素を削除する)", function () {
    var obj = {
        attr1 : '111',
        attr2 : '222'
    }

    equal('111',obj.attr1);
    equal('222',obj.attr2);

    // オブジェクトのプロパティを削除する。
    delete obj.attr1;

    equal(undefined ,obj.attr1);
    equal('222',obj.attr2);

    // 配列も同様
    var array = [1,2,3]
    equal(1,array[0]);
    equal(2,array[1]);
    equal(3,array[2]);

    // 配列のindex=1の要素を削除
    delete array[1];
    equal(1,array[0]);
    equal(undefined,array[1]);
    equal(3,array[2]);
    // 配列の大きさは変わらないので、使いづらい。
    equal(3,array.length)

});

test("instanceof(オブジェクトが指定されたクラスのインスタンスかを判定),typeof", function () {
    // クラス定義

    // コンストラクタ定義
    var Person = function(name,age){
        // thisはインスタンスの参照を表す（と、一旦理解。）
        this.name = name;
        this.age = age;
    };

    // メソッド定義（プロトタイプのプロパティに定義。インスタンス生成すると、インスタンス→proptotyeと参照される。
    Person.prototype.getName = function(){
        return this.name;
    }
    Person.prototype.getDescription = function(){
        return '私の名前は' + this.name + 'です。年齢は' + this.age + 'です';
    }

    // インスタンスを生成
    var person1 = new Person("みのくば",41);
    equal("みのくば",person1.getName());
    equal("私の名前はみのくばです。年齢は41です",person1.getDescription());

    // instanceofで型を判定
    ok(person1 instanceof Person);
    ok(!("" instanceof Person)); // 文字列型 vs Persion
    ok(!({} instanceof Person)); // オブジェクト型 vs Person
    ok({} instanceof Object); // オブジェクト型 vs Person

    // 継承。継承は以下のサイ本＋コンストラクタ差替を一旦採用。本質的な学習はまた後で…。
    // https://gist.github.com/yoshimuraYuu/3301790
    // http://uhyohyo.net/javascript/9_3.html
    // http://uhyohyo.net/javascript/11_7.html
    // コンストラクタ
    var SpetialPerson = function(name,age){
        // 継承元のクラスのコンストラクタを呼ぶ。
        // applyメソッドは、指定した関数に対するthisを指定することができる機能。
        // この場合、コンストラクタ関数Personを,this = SpetialPersionのthisにすり替えて呼び出す。
        Person.apply(this,arguments);
    };
    SpetialPerson.prototype = Object.create(Person.prototype);
    SpetialPerson.prototype.constructor = SpetialPerson;

    var spetialPerson = new SpetialPerson("x",1);
    equal("x",spetialPerson.getName());

    // 継承側で、prototype.constructorをオーバーライドしているから？
    // 継承は、本質的にはプロトタイプ継承しかなく、後はいかに擬似的に継承しているように見せているか、ぽい。
    ok(spetialPerson instanceof SpetialPerson);

    // typeofはinstanceofとことなり、クラス（コンストラクタ）の識別までしてくれない。
    equal("string",typeof "aa");
    equal("number",typeof 123);
    equal("boolean",typeof true);
    equal("object",typeof {});
    equal("object",typeof spetialPerson);

});


// 例外処理
// 1 テストのグルーピング
module("例外処理", {
  // 2 セットアップ
  setup: function () {
  }
});

test("void", function () {
    throwError = function(){
        throw new Error("errorMessage");
    }

    try{
        throwError();
        ok(false,"到達しない")
    }catch (e) {
        ok(e instanceof Error);
        ok("errorMessage",e.message)
        //Errorの属性（IE依存？）
        //https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error
//        equal("",e.stack)
    }

    //任意の型がスローできる
    throwString = function(){
        throw "xxxx";
    }
    try{
        throwString();
        ok(false,"到達しない")
    }catch (e) {
        ok("string",typeof e);
        ok("xxxx",e)
    }

});

//文字列型
//1 テストのグルーピング
module("文字列型", {
// 2 セットアップ
setup: function () {
}
});

test("Stringの代表的なメソッド", function () {

	var string = "12345678901234567890";

	equal(4,string.indexOf('5'));
	equal(14,string.lastIndexOf('5')); //lastIndexOfは、後方の文字列を検索するが、戻り値は前方から何件目かを返す

	equal(6,string.charAt(5));
	//slice,substringはどちらも基本的に同じだが、substringは大小関係を気を利かせて逆転してしまう。
	//the good partsには「substringを使うべき理由はない」と記載あり。なので忘れよう。
	equal('6789',string.substring(5,9));
	equal('2345',string.substring(5,1)); //

	//sliceはそういういらんことはしない。
	equal('6789',string.slice(5,9));
	equal('',string.slice(5,1));
	equal('6789',string.slice(5,-11)); //マイナスをつけると、後方からの文字数を表現する。(5～9）
	equal('23456789012345678',string.slice(-19,-2));//(2～18）

	//split
	var splitted = "a,b,c,d,e".split(',');
	var out = "";
	for ( var elem in splitted) {
		out += splitted[elem];
	}
	equal(5,splitted.length);
	equal('abcde',out);

	//大文字小文字
	equal('aBcDe'.toUpperCase(),'ABCDE');
	equal('aBcDe'.toLowerCase(),'abcde');

	//anchor 使わんな・・・あとlinkとかsup,supとかある　the good partsには、メソッドについての言及すらない。
	equal("<A NAME=\"bbb\">aaa</A>","aaa".anchor('bbb'));

});

test("Numberの代表的なメソッド", function () {
	var num = 123;

	equal('123',num.toString());
	equal(12,12.45.toFixed(0)); //小数点以下０桁有効、１桁目で四捨五入
	equal(12.5,12.45.toFixed(1)); //小数点以下１桁有効、２桁目で四捨五入

	//指定桁数に変換。ただし桁数は、整数部分も含む。小数桁は四捨五入される。。。使えねぇ　
//	equal(0,12.45.toPrecision(0))
	equal(12,12.45.toPrecision(2))
	equal(12.5,12.45.toPrecision(3))
	equal(12.4,12.44.toPrecision(3))
	equal(12.45,12.45.toPrecision(4))
	equal(12.450,12.45.toPrecision(5))

	//おまけ、Mathオブジェクト。Javaっぽくスタティックっぽいメソッドのみ。その他は、おいおい調べればいいでしょう。
	equal(1,Math.min(1,2,3,4));
	equal(4,Math.max(1,2,3,4));

});


test("Arrayの代表的なメソッド", function (){
	//配列の結合
	var concated = [1,2,3].concat([4,5,6]);
	equal(concated.toString(),"1,2,3,4,5,6");

	//配列を文字列化
	equal('1#2#3#4#5#6',concated.join('#'));

	//配列を抽出
	equal('3,4',concated.slice(2,4)); //2～4-1まで切り抜き。指定しない場合はarray.lengthがtoに指定されるので、こういう仕様っぽい。。

	//配列の一部を置き換え。よく使うらしい。そうだろう…。
	var spliced = concated.splice(1,3,'@','#','\'');//start+1～指定した数分の配列値を置き換える。わかりづらい。。。
	equal('2,3,4',spliced); //戻り値は、置き換えられた配列値
	equal('1,@,#,\',5,6',concated); //配列の参照側が操作される。

	//配列末尾を除去
	var array = [1,2,3,4,5,6];
	equal(array.pop(),6);
	equal(array.toString(),"1,2,3,4,5");

	//配列先頭を除去
	equal(array.shift(),1);
	equal(array.toString(),"2,3,4,5");

	//配列末尾に値を設定
	array.push(7);
	equal(array.toString(),"2,3,4,5,7");

	//配列先頭に値を設定
	array.unshift(9);
	equal(array.toString(),"9,2,3,4,5,7");

	//逆順ソート
	equal([1,2,3].reverse(),"3,2,1");
	//ソート
	equal([3,2,1].sort(),"1,2,3");
	array = ['111','22','3'];

	//x,yを比較し、xの方が小さい場合はマイナス、yの方が小さい場合はプラスを返却。
	//数値の場合は、return x - yとするイメージ。以下は、文字列長が短い順にソートする場合。
	array.sort(function(x,y){
		return x.length - y.length;
	});
	equal(array,"3,22,111");

});

test("Dateの代表的なメソッド", function (){
	//システム日時
    var currentDate = new Date();
    ok(true,currentDate);

    var date = new Date('2015/1/3');
    ok('Sat Jan 3 00:00:00 UTC+0900 2015',date);

    //TODO 寝かしておこう。

});

test("RegExpの代表的なメソッド",function(){

	//regexpオブジェクトをコンストラクタで生成しない方法　…perlライクにかける。
	// /正規表現/オプション。　
	var regexp = /(\w+)/g;
	var str = "aaaa bbb cde fg1";

	//matchは正規表現に一致した文字を返却する。
	var matched = str.match(regexp);
	equal(4,matched.length);
	equal(matched[0],'aaaa');
	equal(matched[1],'bbb');
	equal(matched[2],'cde');
	equal(matched[3],'fg1');

	//execは、マッチするたびにそのマッチ文字列・サブマッチ文字列を返却。
	//どこまでマッチしたかはregexpが覚えており、もう一回呼ぶと次のマッチが実行される。マッチしないとnull。
	var result = regexp.exec(str);
	equal(result,'aaaa,aaaa');
	result = regexp.exec(str);
	equal(result,'bbb,bbb');
	result = regexp.exec(str);
	equal(result,'cde,cde');
	result = regexp.exec(str);
	equal(result,'fg1,fg1');
	result = regexp.exec(str);
	equal(result,null);

	//testは、マッチするかどうかをbooleanで返却。
	ok(!regexp.test('&&&'));
	ok(regexp.test('aaa bb ccc'));

	//正規表現による分解
	regexp = /[,@*]/g;
	var splitted = 'abc,de@*g'.split(regexp);
	equal(4,splitted.length);
	equal(splitted[0],'abc');
	equal(splitted[1],'de');
	equal(splitted[2],'');
	equal(splitted[3],'g');

	//正規表現による置換
	var str = 'abc,de@*g';
	var replaced = str.replace(regexp,'/'); //stringは参照型ではないので、変更された文字列が返却される。
	equal(str,'abc,de@*g'); //置換前　。
	equal(replaced,'abc/de//g');

});

//ES6からはイテレータがあるがES5前提では使えないので、使わずに…。

test("オブジェクト",function(){

	//リフレクション good partsの記載と違うな。。。
	var obj = {
		foo : "foo",
		age : 25,
		hello : function(){
			return "hello";
		}
	};

	ok(true,obj.constructor)

	for ( var i in obj) {
		ok(true,obj[i]);
	}

    ok(true,obj.prototype);
	for ( var j in obj.prototype) {
		ok(true,obj.prototype[j]);
	}
});
