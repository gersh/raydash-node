var http = require('http');
var sys = require('sys');
var querystring = require('querystring');
var urlParse = require('url').parse;
var raydashHelper = require('./raydash_helper').helper;

// Class for calling the raydash API
// @param userid The userid for authentication
// @param secret The secret for authentication
// @constructor
function Raydash(userid, secret) {
    this.RAYDASH_HTTP_SERVER = "api.raydash.com";
    this.RAYDASH_HTTP_PORT = 8080;
    this.userid = userid;
    this.secret = secret;

    // Internal function for doing the actual HTTP requests	
    this.doGetRequest = function(path,params, cb) {
        http.get({
            host: this.RAYDASH_HTTP_SERVER,
            port: this.RAYDASH_HTTP_PORT,
            path: path + "?" + querystring.stringify(params)
        },
        function(res) {
			res.setEncoding('ascii');
			res.on('data',function(data) {
				if(cb != undefined) {
					cb(data);
				}
			});
        }).on('error',
        function(e) {
            console.log("Raydash function call error: " + e.message);
            cb(null);
        });
    };
    this.doPostRequest = function(path, request, cb) {
        var req=http.request({
            host: this.RAYDASH_HTTP_SERVER,
            port: this.RAYDASH_HTTP_PORT,
            path: path,
            method: 'POST'
        },function(res) {
			res.setEncoding('ascii');
			res.on('data',function(data) {
				cb(data);
			});
		});
		
		req.on('error',function(error) {
			console.log('Raydash post error' + error.message);
			cb(null);
		});
		req.write(querystring.stringify(request));
		req.end();
    };
}
// Put into test mode, and use a custom server instead of the standard server
// @param server The test server to use
// @param port The test port to use
Raydash.prototype.testMode= function(server, port) {
	this.RAYDASH_HTTP_SERVER=server;
	this.RAYDASH_HTTP_PORT=port;
}
// Retrieve a token
// @param cb function callback(token)
// @param options:
// 			pointTo: The stream where the token is supposed to point. By default, it points to dummyblack an all black screen
//   		customGroup: A group to categorize tokens	
Raydash.prototype.getToken = function(cb, options) {
	if(options==undefined) {
		options={};
	}
	path="/api/2/authtoken";
	params={userid:this.userid,secret:this.secret};
	if(options.customGroup!=undefined) {
		params.customGroup=options.customGroup;
	}
	if(options.pointTo!=undefined) {
		params.streamName=options.pointTo;
	}
    this.doPostRequest(path,params,
    function(res) {
        cb(res);
    });
};
// Retrieve a token for playing a remote stream
// @param url The remote stream to play
// @param cb Callback function to return the token we will play
Raydash.prototype.getRestreamToken = function(url,cb) {
	path="/api/2/restreamtoken";
	params={userid:this.userid,secret:this.secret,url:url};
	
	this.doPostRequest(path,params,function(res) {
		cb(res);	
	});
};

// Retrieve information about a token
// @param cb Function to callback with information about the token
// @param token The token we are getting info about
Raydash.prototype.getTokenInfo = function(cb,token) {
	this.doGetRequest("/api/2/authtoken/" + token,{userid:this.userid,secret:this.secret}, function(body){
		try {
			var jResp = JSON.parse(body.toString());
			cb(jResp);
		}catch(e){
			cb(e);
		}
	});
}
// Start playing a remote stream
// @param contentUrl The url of the stream we want to paly
// @param cb The callback where we will return the token for this stream
Raydash.prototype.getContentToken=function(contentUrl,cb) {
	this.doPostRequest("/api/2/contenttoken",{userid:this.userid,secret:this.secret,contentUrl:contentUrl},function(res){
		cb(res);
	});
};

// Change to a random next stream with varios parameters supplies in params
// @param cb Called upon success
// @param streamToken The token we are going to point, and possibly be pointed to from the stream
// @param params a JSON-hash array of parameters: customGroup -- The custom group we are doing a next with, active --- Does the other stream have to be active?, twoWay --- Should the other token be pointed at us, newCustomGroup -- If specified, we will change the stream we point to this customGroup
Raydash.prototype.changeStreamRandNext = function(streamToken, params, cb) {
	options={userid:this.userid,secret:this.secret};
	if(params!=undefined ) {
		if(params.customGroup!=undefined) {
			options.customGroup=params.customGroup;
		}
		if(params.active!=undefined) {
			options.active=params.active;
		}
		if(params.twoWay!=undefined) {
			options.twoWay=params.twoWay;
		}
		if(params.newCustomGroup!=undefined) {
			options.newCustomGroup=params.newCustomGroup
		}
	}
    path = "/api/2/authtoken/" + streamToken + "/randnext";
    this.doGetRequest(path,options, function(res) {
		if(cb!=undefined) {
			cb(res);
		}
	});
};
// Change to the next stream in a customGroup of streams
// @param streamToken The token we are going to point, and possibly be pointed to from the stream
// @param params a JSON-hash array of parameters: customGroup -- The custom group we are doing a next with, active --- Does the other stream have to be active?, twoWay --- Should the other token be pointed at us, newCustomGroup -- If specified, we will change the stream we point to this customGroup
// @param cb Called upon success

Raydash.prototype.changeStreamNext = function(streamToken, params, cb) {
	options={userid:this.userid,secret:this.secret};
	if(params!=undefined ) {
		if(params.customGroup!=undefined) {
			options.customGroup=params.customGroup;
		}
		if(params.active!=undefined) {
			options.active=params.active;
		}
		if(params.twoWay!=undefined) {
			options.twoWay=params.twoWay;
		}
		if(params.newCustomGroup!=undefined) {
			options.newCustomGroup=params.newCustomGroup
		}
	}
    path = "/api/2/authtoken/" + streamToken + "/next";
    this.doGetRequest(path,options,function(res) {
		if(cb!=undefined) {
			cb(res);
		}
	});
};
// Change the stream, that a token points to
// @param streamToken The token we are pointing
// @param recordToken The token we are pointing the streamToken to
// @param cb Called upon success

Raydash.prototype.changeStream = function(streamToken, recordToken, cb) {
    this.doPostRequest("/api/2/authtoken/" + streamToken,{'streamName':recordToken.toString(),'userid': this.userid, 'secret' : this.secret},
    function(res) {
		if(cb!=undefined) {
        	cb(res);
		}
    });
};
Raydash.prototype.changeCustomGroup = function(token, newCustomGroup, cb) {
	this.doPostRequest("/api/2/authtoken/" + token,{userid:this.userid,secret:this.secret,customGroup:newCustomGroup},
	function(res) {
		if(cb!=undefined) {
			cb(res);
		}
	});
}
// Set the callback URL for receiving events about Raydash's status
Raydash.prototype.setCallbackUrl = function(url,cb) {
	this.doPostRequest("/api/2/user/" + this.userid, {userid:this.userid,secret:this.secret, callbackurl:url},function(res) {
		if(cb!=undefined) {
			cb(res);
		}
	});
}
// Get user info
Raydash.prototype.getUserInfo=function(cb) {
	this.doGetRequest("/api/2/user/" + this.userid,{userid:this.userid,secret:this.secret},function(j){
		cb(JSON.parse(j));
	});
}
// Returns helpers for use in expressjs
Raydash.prototype.helpers = function() {
	return raydashHelper(this.RAYDASH_HTTP_SERVER,this.RAYDASH_HTTP_PORT);
};
// Middleware callback intercepts callback calls, and send them to the appropiate callback
// @param cb Callback function for when we get callback requests
Raydash.prototype.callback=function(cb) {
	var callback_url='/raydash_callback'
	return function(req,res,next) {
		var url=urlParse(req.url)
			, path=decodeURIComponent(url.pathname) ;
		if(path==callback_url) {
			cb(req.parms);
		}
		else {
			next();
		}
	}
// Gets a router to route tokens based on Raydash connections
Raydash.prototype.getFayRouter= function() {
	var self=this;
	return({
		incoming: function(message,callback) {
			if(message.channel.indexOf("/token/")==0) {
				var token=message.channel.substr(7);
				// TODO: send it out to this token
			}
		}
	});
}
};
exports.getRaydash=function(id, secret) {
	return new Raydash(id,secret);
};


