// 引数なし例外
//var ArgumentNullException = function () { };

var MyException = function(message){
    this.message = message;
};

function throwError(){
	throw new Error('error');
}

function throwException(){
	throw new MyException('error');
}

// 1 テストのグルーピング
module("FizzBuzzの正常テスト", {
  // 2 セットアップ
  setup: function () {
  }
});

// 3 テストケース定義
test("数字を返す", function () {
  // 4 検証
  try{
  	throwError();
  	ng();
  }catch(e){
  	ok(e instanceof Error,"型チェック");
    ok(e.message == "error","message");
  }
});

test("数字を返す", function () {
  // 4 検証
  try{
  	throwException();
  	ng();
  }catch(e){
    alert(e.message)
  	ok(e instanceof MyException,"型チェック");
  	ok(e.message == "error","message");
  }
});
