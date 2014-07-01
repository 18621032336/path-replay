var http = require('http');
var connect = require('connect');
var fs = require('fs');

var app = connect();

var index = fs.readFileSync("index.html");
app.use("/public", connect.static(__dirname+'/public',{maxAge:60*60*1000,hidden:false}));

// img path
//app.use("/save", connect.multipart({ uploadDir: '/public/img' }));
app.use("/save", function(req,res){
	
	// write file data

	res.end(index);
});

// all "/" use index.html
app.use("/", function(req,res){
	res.end(index);
});

http.createServer(app).listen(18080);