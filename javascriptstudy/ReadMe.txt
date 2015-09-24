qUnitを使用した、JavaScript自習用のプロジェクトです。

・ライブラリ　・・・　qUnitを使用。

ディレクトリ構成
jacascriptstudy
  lib      ・・・ qUnitの共有するスクリプト、cssを格納。
  template ・・・ qUnitのテストケースを作成するために必要な、jsファイルおよびhtmlファイル。

*****
方針

◯クラス定義
プロトタイプベースで、通常通り定義するのが良いかと思う。

var Klass = function(attr){
  this.attr = attr;
}
Klass.prototype.getAttr = function(){
  return this.attr;
}

◯継承
Node.js の util.inheritsのパターンを採用するのが良い。モダンらしい。

var Sub = function(attr,subattr){
  //①親クラスのコンストラクタ関数をよぶ
  Klass(this,attr);
  //②サブクラスのプロパティを定義する
  this.subattr = subattr;
}

//③プロトタイプを生成する。ただしコンストラクタはSubに差し替える。
//以下は抜粋。詳細はtests-objects.jsのinheritsを参照。
Sub.prototype = Object.create(Klass.prototype, {
	constructor : {
		value : Sub,
		enumerable : false,
		writable : true,
		configurable : true
	}
});

◯カプセル化
基本的にカプセル化はしない。ただし属性やメソッドにアクセス権限を与えたい場合は、
コンストラクタを非公開にして、ファクトリメソッド内でクロージャを使うのがいいかなぁ…。

function KlassFactory = function(){

  //ベースクラス
  var Klass = function(attr){
    this.attr = attr;
  }
  Klass.prototype.getAttr = function(){
    return this.attr;
  }

  //サブクラス
  var Sub = function(attr,subattr){
    Klass(this,attr);
    this.subattr = subattr;
  }

  Sub.prototype = Object.create(Klass.prototype, {
	constructor : {
	  value : Sub,
	  enumerable : false,
	  writable : true,
	  configurable : true
	}
  });

  return {
    createKlass(attr){
      var klass = new Klass(attr);
      return {getAttr : klass.getAttr};
    },createSub(attr){
      var sub = new Sub(attr);
      return {getAttr : klass.getAttr};
    }
  }

}




