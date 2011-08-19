// Helper class for adding raydash elements to page
exports.helper=function() {
	// Return the path of the ClientBox swf object URL
	this.getClientBoxSwf = function() {
	    return ("http://api.raydash.com:8080/api/2/clientbox/1");
	};
	// Return the path of the RecordBox object
	this.getRecordBoxSwf = function() {
	    return ("http://api.raydash.com:8080/api/2/recordbox/2");
	};
	return ({
		'raydash_header' : function() {
    		return ("<script type=\"text/javascript\" src=\"http://api.raydash.com:8080/api/2/swfobject/1\"></script>");
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
		 			+ "swfobject.embedSWF(\"" + getRecordBoxSwf() + "\", \"" + id + "\"," + options.width + "," + options.height + ",\"9.0.0\",\"http://www.adobe.com/products/flashplayer/download\",{autostart:1,hideControls:1,token:\"" + token + "\",hideCamera:\"" + options.hideCamera + "\"" + ",videoOff:\""+ options.videoOff +"\",microphoneOff:\""+options.microphoneOff+"\"},{allowscriptaccess:'always'})</script>" + "<div id=\"" + id + "\">" + "Video stream not available</div>");
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

		    return ("<script type=\"text/javascript\">" + "swfobject.embedSWF(\"" + getClientBoxSwf() + "\", \"" + id + "\"," + options.width + "," + options.height + ",\"9.0.0\",\"http://www.adobe.com/products/flashplayer/download\",{autostart:1,token:\"" + token + "\",videoOff:\"" + options.videoOff + "\",microphoneOff:\"" + options.microphoneOff + "\"},{allowscriptaccess:'always'})</script>" + "<div id=\"" + id + "\">" + "Video stream not available</div>");
		}});
};