var http=require('http');
var sys=require('sys');

exports.Raydash = function(userid,secret) {
    var RAYDASH_HTTP_SERVER="api.raydash.com";
    var RAYDASH_HTTP_PORT= 8080;
    this.userid=userid;
    this.secret=secret;

	
    var doRequest=function(request,cb) {
	http.get({host:RAYDASH_HTTP_SERVER,
		  port:RAYDASH_HTT_PORT,
		  path:request},
		 function(res) {
		     cb(res);
		 }).on('error',function(e) {
		     console.log("Raydash function call error: " + e.message);
		     cb(null);
		 });
    }	
	
    this.getToken = function(cb,pointTo="") {
	if(pointTo!="") {
	    pointTo="/" + pointTo;	
	}
	doRequest("/api/1/authtoken" + pointTo + "?userid=" + this.userid + "&secret=" + this.secret,function(res){
	    cb(res.body);
	});
    }
    
    this.changeStream = function(cb,streamToken,recordToken) {
	doRequest("/api/1/changeStream" + streamToken + "/" + recordToken + "?userid=" + this.userid + "&secret=" + this.secret, function(res) {
	    cb();
	});
    }
};
exports.Helper = function(options) {
	this.getRecordBox=function() {
		
	}
	this.getClientBox=function() {
	}
}
exports.getClientBoxSwf = function() {
	return(__dirname + "ClientBox.swf");
}
exports.getRecordBoxSwf = function() {
	return(__dirname + "RecordBox.swf");
}
