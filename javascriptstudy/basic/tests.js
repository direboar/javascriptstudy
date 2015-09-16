
// 1 テストのグルーピング
module("データ型", {
  // 2 セットアップ
  setup: function () {
  }
});

// 3 テストケース定義
test("基本型", function () {
	//数値型
	var number = 123;
	
	//Boolean
	var bool = true;
	bool = false;
	
	//文字列型
	//両端は、クォーテーションでもダブルクォーテーションでもよい
	var str = 'aaa';
	var str2 = "aaa";
	equal(str,str2);
	
	//''で囲った場合は、"は文字として使える。""で囲った場合、文字中の"は\でエスケープする。
	str = 'aa"a';
	str2 = 'aa"a';
	equal(str,str2);

    //undefined型
　　　 var var3 = undefined;
	ok(var3  == undefined);
	ok(var3  != 'undefined'); //undefinedは文字列では指定しない。
	
	var var4;
	ok(var4  == undefined); //変数宣言のみした場合は、undefinedが入っている
	ok(null  == undefined); //javascriptでは、nullとundefinedは等価である。

});

test("参照型（配列）", function () {
	//配列
	var array1 = ['111','222','333'];
	equal('111',array1[0]);
	equal('222',array1[1]);
	equal('333',array1[2]);
	
	//配列長を超えるとundefined
	equal(undefined,array1[3]);
	
	//配列長の確認
    equal(3,array1.length);

 　　　//forループで配列を回す
    var out = "";
    for(var i=0;i<array1.length;i++){
        out += array1[i];
    }
    equal('111222333',out);
    
 　　　//for - in ループで回す
    out = "";
    for(var i in array1){
    	//out += i ///tmpは、配列の値ではなくポインタが入る。
    	out += array1[i];
    }
    equal('111222333',out);

 　　　//配列にも型はない。
    var array2 = ['111',true,333];
    equal('111',array2[0]);
    equal(true,array2[1]);
    equal(333,array2[2]);

 　　　//配列の入れ子はできるが、多次元配列ではない
    var nestArray = ['111',222,[333,'444'],[555,666,777]];
    equal('444',nestArray[2][1]);
    
    //配列が参照型であることを確認
    var refered = [111,222,333];
    var referer = refered;
    //配列の最後を削除
    refered.pop();
    //参照元も、参照先も同じく、配列の最後の要素が削除されている。
    equal('111,222',refered.toString());    
    equal('111,222',referer.toString());    
    
});

//オブジェクトリテラルはもっと色々あるので、基本のみ。
test("参照型（オブジェクトリテラル）", function () {
	//オブジェクトリテラルを定義
	var obj1 = {
		attr1 : 111,
		attr2 : '222',
		attr3 : false
	};

    //equal('',obj1) toStringすると、上記と同じオブジェクトリテラルの文字列と評価される。
    
    //属性へのアクセス
    equal(111,obj1.attr1);
    equal('222',obj1.attr2);
    equal(false,obj1.attr3);
    
    //オブジェクトは連想配列なので、連想配列っぽいアクセスも可能
    equal(111,obj1['attr1']);

    //念のため、オブジェクトが参照型であることを確認
    var referee = obj1;
    obj1.attr1 = 'hoge';
    
    equal('hoge',referee.attr1);
	
});

//関数リテラルはもっと色々あるので、基本のみ。
test("参照型（関数リテラル）", function () {
	//通常の関数定義
	function func(val){
		return 'return '+ val + ';';
	}
	equal('return hoge;',func('hoge'));

    //関数リテラルを使用すると、関数を変数に格納できる	
	var funcs = function(val){
		return 'funcedit ' + val  + ';';
	}
	
	//関数自体を、他の関数に引き渡し、コールバックできる。
	var nestfunc = function(val,func){
		var retVal = "";
		for(var i = 0;i<3;i++){
			//コールバック関数を３回呼び、その戻り値を連結して返却。
			retVal += func(val);
		}
		return retVal;
	}
	
	equal('funcedit hoge;funcedit hoge;funcedit hoge;',nestfunc('hoge',funcs));
});

//TODO 
// 1 テストのグルーピング
module("演算子", {
  // 2 セットアップ
  setup: function () {
  }
});

test("xxx", function () {
});

//演算子（特に注意するもののみ抜粋）
//例外処理

