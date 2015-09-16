//基本型・配列・オブジェクトリテラル・関数リテラル
//演算子・例外

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

