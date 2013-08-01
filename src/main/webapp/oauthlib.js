var oauthlib = {};

oauthlib.store = function(key, value) {
	console.log(key + " : " + JSON.stringify(value));
	localStorage.setItem(key, JSON.stringify(value));
};

oauthlib.retrieve = function(key) {
	var retrievedObject = localStorage.getItem(key);
	console.log(retrievedObject);
	return JSON.parse(retrievedObject);
};

oauthlib.retrieveToken = function(id) {
	return oauthlib.retrieve(id+"-token");
};

oauthlib.storeToken = function(id, token) {
	return oauthlib.store(id+"-token", token);
};

oauthlib.retrieveState = function(id) {
	return oauthlib.retrieve(id+"-state");
};

oauthlib.saveState = function(id, state) {
	oauthlib.store(id+"-state", state);
};


oauthlib.parseUrlFragment = function() {
	var params = {}, 
	queryString = location.hash.substring(1),
	regex = /([^&=]+)=([^&]*)/g, 
	m;

	while (m = regex.exec(queryString)) {
		params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	}

	return params;
};

oauthlib.buildOauthRequest = function(config) {
	var url = config['url'] + '?';
	var params = config['params'];
	for (var k in params){
	    if(params.hasOwnProperty(k)) {
	    	url += k + '=' + encodeURIComponent(params[k]) + '&';
	    }
	}
	return url;
};

oauthlib.init = function(config) {
	var id = config['id'];
	
	var params = oauthlib.parseUrlFragment();
	var token = params["access_token"];
	
	console.log("Token: "+token);
	
	if(token == undefined) {
		token = oauthlib.retrieveToken(id);
		
		if(token == undefined) {
			console.log("Request new token!");
			var oauthReqUrl = oauthlib.buildOauthRequest(config);
			
			var state = {
					'originalLocation' : window.location.hash
			};
			
			console.log(state);
			oauthlib.saveState(id, state);
			
			window.location = oauthReqUrl;
		}
	}
	else {
		console.log("Storing token!");
		oauthlib.storeToken(id, token);
		
		var state = oauthlib.retrieveState(id);
		
		console.log(state);
		window.location.hash = state["originalLocation"];
	}
};

oauthlib.request = function(id, url) {
	
};