var connect = require('connect');
var login = require('./login');

var app = connect();

app.use(connect.json()); // Parse JSON request body into `request.body`
app.use(connect.urlencoded()); // Parse form in request body into `request.body`
app.use(connect.cookieParser()); // Parse cookies in the request headers into `request.cookies`
app.use(connect.query()); // Parse query string into `request.query`

app.use('/', main);

function main(request, response, next) {
	switch (request.method) {
		case 'GET': get(request, response); break;
		case 'POST': post(request, response); break;
		case 'DELETE': del(request, response); break;
		case 'PUT': put(request, response); break;
	}
};

function get(request, response) {
	var cookies = request.cookies;
	if ('session_id' in cookies) {
		var sid = cookies['session_id'];
		if ( login.isLoggedIn(sid) ) {
			response.setHeader('Set-Cookie', 'session_id=' + sid);
			response.end(login.hello(sid));	
		} else {
			response.end("Invalid session_id! Please login again\n");
		}
	} else {
		response.end("Please login via HTTP POST\n");
	}
};

function post(request, response) {
	var name = request.body.name;
    var email = request.body.email;
    var newSessionId = login.login(name, email);
    response.setHeader('Set-Cookie', 'session_id=' + newSessionId);
	response.end(login.hello(newSessionId));
};

function del(request, response) {
	console.log("DELETE:: Logout from the server");
 	var sessionId = request.cookies.session_id;
 	if(login.isLoggedIn(sessionId)){
 		login.logout(sessionId);
  		response.end('Logged out from the server\n');	
 	}else{
 		response.end('Looks like you are already logged out or you did not pass the correct session.\n');	
 	}
    
};

function put(request, response) {
	console.log("PUT:: Attempting to re-generate.....");
	var sessionId = request.cookies.session_id;
	if( login.isLoggedIn(sessionId) ){
		var newSessionId = login.refreshSession(sessionId);
		response.setHeader('Set-Cookie', 'session_id=' + newSessionId);
		response.end('Successfully refreshed the session!\n');
		console.log("Session refreshed");
	}else{
		response.end('Either not logged in or Invalid session id!\n');
		console.log("Session failed to refresh");
	}
};

app.listen(8000);

console.log("Node.JS server running at 8000...");
 