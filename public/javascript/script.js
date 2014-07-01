(function(){
var canvas = document.getElementById("myCanvas"),
        context = canvas.getContext("2d"),
        myData = document.getElementById("myData"),
        myOutput = document.getElementById("myOutput"),
        myPlay = document.getElementById("myPlay"),
        myClear = document.getElementById("myClear"),
        myBack = document.getElementById("myBack"),
        myBackNum = document.getElementById("myBackNum"),
        emptyTimeout,
        playList = "";

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

    var isDown = false;
    var imgD;
    var pos = { x: 0, y: 0 };

    
    function resetCanvas() {

        if (!imgD) {
            imgD = context.getImageData(0, 0, canvas.width, canvas.height);
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.putImageData(imgD, 0, 0);

    }
    
    resetCanvas();


    var isdown = false;
    var startPoint = {},
        toPoint = {};

    var replay = "";


    var rect = canvas.getBoundingClientRect(); //

    canvas.onmousedown = mouseDown;
    canvas.onmousemove = mouseMove;
    canvas.onmouseup = mouseUp;

    context.lineWidth = 0.5;
    context.strokeStyle = "rgb(255,0,0)";

    function mouseDown(e) {
        isdown = true;
        setPoint(e, startPoint);
    }

    function setPoint(e, point) { // 纠正位置
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


    myPlay.onclick = play;
    myClear.onclick = clear;
    myBack.onclick = back;

    function clear() {
        resetCanvas();
        replay = "";
        myData.value = "";
    }

    function back() {
        var num = myBackNum.value;
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

    function output() {
        myData.value = replay;
    }

    function play() {
        playList = replay.split("|");
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
})();
