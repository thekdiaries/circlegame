let switchToNewScene = null;

function runGame() {
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	var pressedKeys = {
		right: false,
		left: false,
		up: false,
		down: false
	};
	var pushedThisFrame = [];

	var getKeyFromEvent = function(e) {
		if (e.key == "Right" || e.key == "ArrowRight") {
			return 'right';
		} else if (e.key == "Left" || e.key == "ArrowLeft") {
			return 'left';
		} else if (e.key == "Up" || e.key == "ArrowUp") {
			return 'up';
		} else if (e.key == "Down" || e.key == "ArrowDown") {
			return 'down';
		} else if (e.key == "p") {
			return 'p';
		}
		return 'unknown';
	};

	var keyDownHandler = function(e) {
		var key = getKeyFromEvent(e);
		pressedKeys[key] = true;
		pushedThisFrame.push(key);
	};

	var keyUpHandler = function(e) {
		var key = getKeyFromEvent(e);
		pressedKeys[key] = false;
	};
	
	var graphics = {
		drawCircle: function(x, y, radius, hex) {
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI*2);
			ctx.fillStyle = hex;
			ctx.fill();
			ctx.closePath();
		},
		 
		drawRectangle: function(left, top, width, height, hex, alpha) {
			if (alpha !== undefined) {
				ctx.globalAlpha = alpha;
			}
			ctx.beginPath();
			ctx.rect(left, top, width, height);
			ctx.fillStyle = hex;
			ctx.fill();
			ctx.closePath();
			ctx.globalAlpha = 1.0;
		},
	};
	
	let currentScene = new GameplayScene(1, canvas.width/2, canvas.height/2, canvas.width, canvas.height);

	switchToNewScene = function(newScene) {
		currentScene = newScene;
	};
	
	var runFrame = function() {
	   
		currentScene.handleUserInput(pressedKeys, pushedThisFrame);
	   
		// out with the old, in with the new.
		pushedThisFrame = [];
	   
		currentScene.updateModel();
	   
		// every potential screen will probably want to start with a blank background.
		graphics.drawRectangle(0, 0, canvas.width, canvas.height, "#282720");
		
		currentScene.drawToScreen(graphics);
	};

	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	setInterval(runFrame, 10);
}