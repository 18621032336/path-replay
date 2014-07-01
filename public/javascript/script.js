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
	var	dirDiv = $(".right");

	var isDown = false;
	var	imgD; // grid backup
	var	pos = {
			x : 0,
			y : 0
		};
	var	isdown = false;
	var	startPoint = {};
	var	toPoint = {};
	var	emptyTimeout = 0;
	var	playList = [];
	var replay = "";
	var cache = [];

	drawGrid(context, "", "#c3c3c3", 10);
	function drawGrid(context, style, color, step) {
		context.strokeStyle = color;
		//context.lineWidth = 0.5;
		var width = canvas.width,
		height = canvas.height;
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

	}

	function resetCanvas() {

		if (!imgD) {
			imgD = context.getImageData(0, 0, canvas.width, canvas.height);
		}

		context.clearRect(0, 0, canvas.width, canvas.height);
		context.putImageData(imgD, 0, 0);
	}

	resetCanvas();

	

	canvas.onmousedown = mouseDown;
	canvas.onmousemove = mouseMove;
	canvas.onmouseup = mouseUp;
	
	pathPlay.onclick = play;
	pathClear.onclick = clear;
	pathBack.onclick = back;
	pathSubmit.onclick = submit;

	context.lineWidth = 0.5;
	context.strokeStyle = "rgb(255,0,0)";

	function mouseDown(e) {
		isdown = true;
		setPoint(e, startPoint);
	}

	function setPoint(e, point) { // 纠正位置
		var rect = canvas.getBoundingClientRect(); //
		point.x = e.clientX - rect.left;
		point.y = e.clientY - rect.top;
	}

	function mouseMove(e) {
		if (isdown) {

			setPoint(e, toPoint);
			context.beginPath();
			context.moveTo(startPoint.x, startPoint.y);
			context.lineTo(toPoint.x, toPoint.y);
			context.stroke();

			//replay.push([startPoint.x,startPoint.y,toPoint.x,toPoint.y]);
			replay += "|" + [startPoint.x, startPoint.y, toPoint.x, toPoint.y].join(",");
			clearTimeout(emptyTimeout);
			setPoint(e, startPoint);

		}

	}

	function mouseUp() {
		isdown = false;
		empty();
	}



	function clear() {
		resetCanvas();
		replay = "";
		pathData.value = "";
	}

	function back() {
		var num = pathBackNum.value;
		if (isNaN(num)) {
			alert("这里写数字才能撤销哦！！！");

			alert("罚你点两万次确认框");

			alert("还有19999次");
			alert("还有19998次");

			alert("→_→");
			return;
		}
		clearTimeout(emptyTimeout);
		replay = replay.replace(/\|+$/, "");
		console.log(replay);
		var replayA = replay.split("|");
		replayA.splice(replayA.length - num);

		replay = replayA.join("|");
		resetCanvas();
		backPlay(replayA);
	}

	function backPlay(replayA) {
		console.log(replayA.length);
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

	function play(data) {
		
		playList = (data || replay).split("|");
		resetCanvas();
		playing();
	}

	function playing() {
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

			setTimeout(playing, 10);
		}

	}

	function empty() {
		//console.log("empty");
		if (replay.length > 0) {
			replay += "|";
		}
		if (replay.substr(replay.length - 31, 30) == "||||||||||||||||||||||||||||||") { // 停顿不能太久
			return;
		}
		emptyTimeout = setTimeout(empty, 50);
	}
	empty();
	
	function submit() {
		var name = pathName.value;
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
		console.log(data);
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
			play(cache[index]);
			return;
		}
		$.post("/play", {index:index}, function playCallback(data) {
			//replay = data;
			cache[index] = data;
			play(data);
		});
	}
	
	
	

	$.post("/dir", function(data){
		showDir(data);
	});
})();
