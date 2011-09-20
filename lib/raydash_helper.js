// Helper class for adding raydash elements to page
exports.helper=function(server,port) {
	this.RAYDASH_HTTP_SERVER=server;
	this.RAYDASH_HTTP_PORT=port;
	// Return the path of the ClientBox swf object URL
	this.getClientBoxSwf = function() {
	    return ("http://" + this.RAYDASH_HTTP_SERVER + ":" + this.RAYDASH_HTTP_PORT + "/api/2/clientbox/1");
	};
	// Return the path of the RecordBox object
	this.getRecordBoxSwf = function() {
	    return ("http://" + this.RAYDASH_HTTP_SERVER + ":" + this.RAYDASH_HTTP_PORT + "/api/2/recordbox/2");
	};
	return ({
		'raydash_header' : function() {
    		return ("<script type=\"text/javascript\" src=\"http://"+ RAYDASH_HTTP_SERVER + ":" + RAYDASH_HTTP_PORT + "/api/2/swfobject/1\"></script>");
		},
		// Get the stream box's HTML
		'raydash_videorecord' : function(token, id, options) {
			if(options==undefined) {
				options={};
			}
			if(options.width == undefined) {
				options.width="640";
			}
			if(options.height == undefined) {
				options.height="480";
			}
			if(options.videoOff == undefined) {
				options.videoOff="0";
			}
			if(options.hideCamera == undefined) {
				options.hideCamera="0";
			}
		    return ("<script type=\"text/javascript\">"
					+ "function setSize(width,height,id) {if(id==undefined){id=\"#{id}\";  }document.getElementById(id).width=width;document.getElementById(id).height=height;}\n"
		 			+ "swfobject.embedSWF(\"" + getRecordBoxSwf() + "\", \"" + id + "\"," + options.width + "," + options.height + ",\"9.0.0\",\"http://api.raydash.com:8080/api/2/expressinstall/1\",{autostart:1,hideControls:1,token:\"" + token + "\",hideCamera:\"" + options.hideCamera + "\"" + ",videoOff:\""+ options.videoOff +"\",microphoneOff:\""+options.microphoneOff+"\"},{allowscriptaccess:'always'})</script>" + "<div id=\"" + id + "\">" + "<a href=\"http://get.adobe.com/flashplayer/\">Please install Adobe Flash</a></div>");
		},
		// Get the record box's HTML
		'raydash_videostream' : function(token, id, options) {
			if(options==undefined) {
				options={};
			}
			if(options.width == undefined) {
				options.width="640";
			}
			if(options.height == undefined) {
				options.height="480";
			}
			if(options.videoOff == undefined) {
				options.videoOff="0";
			}
			if(options.microphoneOff == undefined) {
				options.microphoneOff="0";
			}

		    return ("<script type=\"text/javascript\">" + "swfobject.embedSWF(\"" + getClientBoxSwf() + "\", \"" + id + "\"," + options.width + "," + options.height + ",\"9.0.0\",\"http://api.raydash.com:8080/api/2/expressinstall/1\",{autostart:1,token:\"" + token + "\",videoOff:\"" + options.videoOff + "\",microphoneOff:\"" + options.microphoneOff + "\"},{allowscriptaccess:'always'})</script>" + "<div id=\"" + id + "\">" + "<a href=\"http://get.adobe.com/flashplayer/\">Please install Adobe Flash</a></div>");
		}});
};
