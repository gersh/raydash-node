var raydash=new require('../../lib/raydash').getRaydash("t1","ZjZiY2IzYTgtYTBjZC00YWEyLWE1MzYtNDhmN2VlNmM1NjQw");
var faye=require('faye');
var express=require('express');
var app = express.createServer();

app.use(express.static(__dirname + "/public"));
app.helpers(raydash.helpers());
app.set('view', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req,res) {
	raydash.getToken(function(token) {
		res.render('chat',{'token':token, "pageTitle":'Stranger chat'});
	}, {"customGroup":"stranger"});
});
app.get('/next/:token', function(req,res) {
	raydash.changeStreamRandNext(req.param('token'),{"customGroup":"stranger"},function(res){
		
	});
	res.write("Success");
	res.end();
});
var bayeux = new Faye.NodeAdapter({
	mount: '/faye',
	timeout: 45
});


bayeux.attach(app);

app.listen(3000);