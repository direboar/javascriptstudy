/**自作のログ出力ユーティリティ。*/

//**名前空間**//
var minokuba_utils;
if(!minokuba_utils){
	minokuba_utils = {};
}

/**
  * minukuba_utils.logger
  *
  * minukuba_utils.logger.setLevel(2);
  * minukuba_utils.logger.log("message");
  * minukuba_utils.logger.log("message",1)
  * minukuba_utils.logger.log("message",2)
  * minukuba_utils.logger.log("message",3)
  *
  * 出力先拡張例
  * minukuba_utils.logger.write = function(message){
  *     $('#log-message-ol').append('<li>'+message+'</li>');
  * }
  *
  **/
(function (minukuba_utils) {
	var Logger = function(){
		this.level = 1;
	};

	Logger.prototype.setLevel = function(level) {
		this.level = level || 1;
	}

	Logger.prototype.log = function(message,level) {
		level = level || 1;
		if(this.level >= level){
			this.write(message);
		}
	}

	Logger.prototype.write = function(message){
		console.log(message);
	}

	minukuba_utils.logger = new Logger();

}(minokuba_utils));
