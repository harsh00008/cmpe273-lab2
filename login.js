
/**
 * Login Class
 */
function Login() {
	// sessionId -> user map
	this.sessionMap = {
		99999 : { name: 'Foo', email: 'foo@bar.com' }
	};
}
/**
 * Say Hello {name} to the user
 */
Login.prototype.hello = function(sessionId) {
	return 'Hello ' + this.sessionMap[sessionId].name + '\n';
};

/**
 * Check whether the given session id is valid (is in sessionMap) or not.
 */
Login.prototype.isLoggedIn = function(sessionId) {
	return sessionId in this.sessionMap;
};

Login.prototype.refreshSession = function(sessionId){
	var newSessionId = new Date().getTime();
	var _name = this.sessionMap[sessionId].name;
	var _email = this.sessionMap[sessionId].email;	
	this.sessionMap[newSessionId] = { name: _name, email: _email };
	delete this.sessionMap[sessionId];
	console.log('Refreshed:: Session ID refreshed: ' + newSessionId + ' for login::' + _email);    
}

/**
 * Create a new session id for the given user.
 */
Login.prototype.login = function(_name, _email) {
   /*
	* Generate unique session id and set it into sessionMap like foo@bar.com
	*/
	var sessionId = new Date().getTime();
	this.sessionMap[sessionId] = { name: _name, email: _email };	
	console.log('Welcome:: New session id is ' + sessionId + ' for login::' + _email);	
	return sessionId;
};

/**
 * Logout from the server
 */ 
Login.prototype.logout = function(sessionId) {
	delete this.sessionMap[sessionId];
	console.log('Logout::' + sessionId);
};

// Export the Login class
module.exports = new Login();
