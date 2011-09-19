var fs=require('fs');
var settings = JSON.parse(fs.readFileSync(__dirname + '/../test_settings.json','utf8'));
var raydash = require('../lib/raydash').getRaydash(settings.userid.toString(),settings.secret.toString());
raydash.testMode("localhost",8080);
exports.test_createToken = function(test) {
	test.expect(1);
	raydash.getToken(function(token){
		test.equal(token.length,36,"Says token is" + token);
		test.done();
	});
};
exports.test_changeStream = function(test) {
	test.expect(4);
	raydash.getToken(function(token){
		var tk1=token;
		test.equal(token.length,36);
		raydash.getToken(function(token2){
			var tk2=token2;
			test.equal(token.length,36);
			raydash.changeStream(tk1,tk2,function(){
				raydash.getTokenInfo(function(ti){
					console.log("Token:"+JSON.stringify(ti)+'\n');
					test.equal(ti.usages.length,1);
					if(ti.usages[0]!=undefined) {
						test.equal(ti.usages[0].connectedTo,tk2);
					}
					test.done();
				},tk1);
				});
		})
	})
};
exports.test_setCallback = function(test) {
	test.expect(2);
	raydash.setCallbackUrl('http://localhost:3000',function() {
		raydash.getUserInfo(function(cb){
			test.equal('http://localhost:3000',cb.callbackurl);
			raydash.setCallbackUrl('http://localhost:3000/callback',function(){
				raydash.getUserInfo(function(cb2){
					test.equal('http://localhost:3000/callback',cb2.callbackurl);
					console.log("Callback url is:" + cb2.callbackurl)
					test.done();
				});
			});
		});
	});
}