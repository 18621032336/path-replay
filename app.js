var http = require('http');
var connect = require('connect');
var fs = require('fs');
var bodyParser = require('body-parser');
var saveManager = require('./saveManager');

var app = connect();

var index = fs.readFileSync("index.html");

app.use("/public", connect.static(__dirname+'/public',{maxAge:60*60*1000,hidden:false}));
app.use(bodyParser.urlencoded());

// img path
//app.use("/save", connect.multipart({ uploadDir: '/public/img' }));
app.use("/save", function(req, res) {
	//console.log(req.body);
	
	res.end(saveManager.save(req.body));
	// write file data
	// res.end(index);
});
app.use("/dir", function(req, res) {
	res.end(saveManager.getDir());
});
app.use("/play", function(req, res) { // get data
	res.end(saveManager.getData(req.body.index));
});

// all "/" use index.html
app.use("/", function(req,res){
	res.end(index);
});



http.createServer(app).listen(18080);