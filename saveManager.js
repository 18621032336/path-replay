var fs = require('fs');

exports.save = function(data){
	var dir = getDir().split("|");
	var dirStr;
	
	dir.push(data.name);
	
	dirStr = dir.join("|");
	
	setDir(dirStr);
	
	saveData(dir.length - 1, data.data);
	return dirStr;
};

exports.getDir = getDir;
exports.getData = getData;
function getDir(){
	return fs.readFileSync("pathdata/Dir").toString();
}

// write directory
function setDir(dirStr){
	fs.writeFileSync("pathdata/Dir", dirStr);
}

// write data
function saveData(index, data){
	fs.writeFile("pathdata/D" + index, data);
}

var cache = [];

function getData(index) {
	if (cache[index]) {
		return cache[index];
	} else {
		cache[index] = fs.readFileSync("pathdata/D" + index);
		return cache[index];
	}
}