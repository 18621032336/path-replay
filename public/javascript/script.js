(function(win){
	win.pathR = pathR;
	
	function pathR(canvas) {
		var obj = new pathR.fn.init(canvas);
		
		return obj;
	}
	
	pathR.fn = pathR.prototype;
	
	//pathR.fn.prototype = pathR.fn;
	pathR.fn.init = function(canvas) {
		var that = this;
		this.isDown = false;
		this.imgD; // grid backup
		this.pos = {
				x : 0,
				y : 0
			};
		this.isdown = false;
		this.startPoint = {};
		this.toPoint = {};
		this.emptyTimeout = 0;
		this.playList = [];
		this.replay = "";
		this.context = canvas.getContext("2d");
		
		this.context.lineWidth = 0.5;
		this.context.strokeStyle = "rgb(255,0,0)";
		
		this.canvas = canvas;
		
		canvas.onmousedown = function(e) {
			mouseDown.call(that, e);
		};
		
		canvas.onmousemove = function(e) {
			mouseMove.call(that, e);
		};
		
		canvas.onmouseup = function(e) {
			mouseUp.call(that, e);
		};
		
		
	};
	pathR.fn.init.prototype = pathR.prototype;
	

	
	pathR.fn.drawGrid = function (style, color, step) {
		var context = this.context;
		var canvas = this.canvas;
		context.save();
		context.strokeStyle = color;
		//context.lineWidth = 0.5;
		var width = canvas.width;
		var height = canvas.height;
		var i = 0.5 + step;
		for (; i <= width; i += step) {
			context.beginPath();
			context.moveTo(i, 0);
			context.lineTo(i, height);
			context.stroke();
		}

		for (i = 0.5 + step; i <= height; i += step) {
			context.beginPath();
			context.moveTo(0, i);
			context.lineTo(width, i);
			context.stroke();
		}
		context.restore();
		
		// backup
		this.resetCanvas();
	}
	
	// reset to grid
	pathR.fn.resetCanvas = function() {
		var context = this.context;
		var canvas = this.canvas;
		var imgD = this.imgD;
		
		if (!imgD) {
			imgD = context.getImageData(0, 0, canvas.width,
				canvas.height);
			this.imgD = imgD;
		}

		context.clearRect(0, 0, canvas.width, canvas.height);
		context.putImageData(imgD, 0, 0);
	}

	


	function mouseDown(e) {
		this.isdown = true;
		setPoint(e, this.canvas, this.startPoint);
	}

	function setPoint(e, canvas, point) { // 纠正位置
		
		var rect = canvas.getBoundingClientRect(); //
		point.x = e.clientX - rect.left;
		point.y = e.clientY - rect.top;
	}

	function mouseMove(e) {
		var context = this.context;
		if (this.isdown) {

			setPoint(e, this.canvas, this.toPoint);
			context.beginPath();
			context.moveTo(this.startPoint.x, this.startPoint.y);
			context.lineTo(this.toPoint.x, this.toPoint.y);
			context.stroke();

			//replay.push([startPoint.x,startPoint.y,toPoint.x,toPoint.y]);
			this.replay += "|" + [this.startPoint.x, this.startPoint.y, 
				this.toPoint.x, this.toPoint.y].join(",");
			clearTimeout(this.emptyTimeout);
			setPoint(e, this.canvas, this.startPoint);

		}

	}

	function mouseUp() {
		this.isdown = false;
		this.empty();
	}


	pathR.fn.clear = function () {
	
		this.playList = [];
		this.replay = "";
		this.resetCanvas();
	}
	
	pathR.fn.back = function(num) {
	
		if (isNaN(num)) {
			alert("just number!");
			return;
		}
		clearTimeout(this.emptyTimeout);
		this.replay = this.replay.replace(/\|+$/, "");
		var replayA = this.replay.split("|");
		replayA.splice(replayA.length - num);

		this.replay = replayA.join("|");
		this.resetCanvas();
		backPlay.call(this, replayA);
	}

	function backPlay(replayA) {
		var context = this.context;
		for (var i = 0; i < replayA.length; i++) {
			var data = replayA[i];

			if (data) {
				var points = data.split(",");
				context.beginPath();
				context.moveTo(points[0], points[1]);
				context.lineTo(points[2], points[3]);
				context.stroke();
				context.closePath();
			}

		}
	}

	pathR.fn.play = function(data) {
		
		if (data) {
			this.playList = data.split("|");
		} else {
			this.playList = this.replay.split("|");
		}
		
		this.resetCanvas();
		
		//console.log(playList);
		playing.call(this);
	};

	function playing() {
		var playList = this.playList;
		var context = this.context;
		var that = this;
		if (playList.length > 0) {

			var data = playList.shift();
			if (data) {
				var points = data.split(",");
				context.beginPath();
				context.moveTo(points[0], points[1]);
				context.lineTo(points[2], points[3]);
				context.stroke();

				context.closePath();
			}

			setTimeout(function(){
				playing.call(that);
			}, 10);
		}

	}

	pathR.fn.empty = function empty() {
		//console.log("empty");
		var that = this;
		if (this.replay.length > 0) {
			this.replay += "|";
		}
		if (this.replay.substr(this.replay.length - 31, 30) == "||||||||||||||||||||||||||||||") { // 停顿不能太久
			return;
		}
		this.emptyTimeout = setTimeout(function(){
			that.empty();
		}, 50);
	}
})(this);



(function () {
	var form = $("form")[0];
	var	canvas = document.getElementById("pathCanvas");
	var	context = canvas.getContext("2d");
		
	var	pathPlay = form.pathPlay;
	var	pathClear = form.pathClear;
	var	pathBack = form.pathBack;
	var	pathSubmit = form.psubmit;
	var	pathName = form.pname;
	var	pathBackNum = form.pathBackNum;
	var image = form.image;
	var	dirDiv = $(".right");
	
	var cache = [];
	
	var pathObj = new pathR(canvas);
	


	pathObj.drawGrid("", "#cccccc", 10);
	pathObj.empty();
	
	$(pathPlay).click(function() {
		pathObj.play();
	});
	
	$(pathClear).click(function() {
		pathObj.clear();
	});
	
	$(pathBack).click(function() {
		pathObj.back(pathBackNum.value);
	});
	
	$(pathSubmit).click(submit);

	
	function submit() {
		var name = pathName.value;
		var replay = pathObj.replay;
		
		if (name.replace(/\s/g, "") === "" ) {
			alert("input the name, please!");
			return;
		}
		
		if (replay.length < 100 ) {
			alert("please draw first, and submit!");
			return;
		}
		
		
		$.post("/save", {data:replay,name:encodeURIComponent(name)}, saveCallback);
	}
	
	function saveCallback(data) {
		//
		showDir(data);
	}
	
	function showDir(dir) {
		var dirList = dir.split("|");
		dirDiv.empty();
		for (var i = 0; i < dirList.length; i++) {
			dirDiv.append("<a href='#' index='" + i + "'>" +
				decodeURIComponent(dirList[i]) + "</a> | ");
		}
		dirDiv.find("a").click(aClick);
		//dirDiv.append();
		
	}

	
	function aClick(p1) {
	
		var current = $(p1.currentTarget);
		playByIndex(current.attr("index"));
	}
	
	function playByIndex(index) {
		if (cache[index]) {
			// has cache return;
			pathObj.play(cache[index]);
			return;
		}
		$.post("/play", {index:index}, function playCallback(data) {
			//replay = data;
			cache[index] = data;
			pathObj.play(data);
		});
	}
	
	
	

 	$.post("/dir", function(data){
		showDir(data);
		playByIndex(0); // default play
		
	});

	$(image).click(function(){
		open(pathObj.canvas.toDataURL());
	});


})();
