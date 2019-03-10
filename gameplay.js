
var createGameplayScene = function(levelNum, startX, startY, screenWidth, screenHeight) {

	let getRandomCoord = function(max) {
		return Math.floor(Math.random() * max);
	}
   
	let sceneChangeCountdown = -1;
	
	let isChaserNearPoint = function(chaser, x, y) {
		if (chaser.y > y - 10 &&
			chaser.y < y + 10 &&
			chaser.x > x - 10 &&
			chaser.x < x + 10) {
				return true;
		}
	};

	let stationaryDots = [];
	for (let i = 0; i < 10; i++) {
		let dot = {
			x: getRandomCoord(screenWidth),
			y: getRandomCoord(screenHeight),
			color: "#b2817d",
		};
		stationaryDots.push(dot);
	}
	
	let x = startX;
	let y = startY;
	let isDeleted = false;
	let chasers = [];
   
	let createChaser = function() {
		colors = ["#ceccc0", "#99a552", "#c3a022", "#24576c", "#a48897", "#3fb994", "#a6542b", "#494d42", "#ecd1d6"];
		
		let shouldChase = false;
		if (levelNum == 2) {
			if (getRandomCoord(2) === 1) {
				shouldChase = true;
			}
		} else if (levelNum == 3) {
			shouldChase = true;
		}
		
		return {
			x: 0,
			y: 0,
			color: colors[getRandomCoord(colors.length)],
			speed: 0.35 + Math.random() * 0.3,
			destinationX: getRandomCoord(screenWidth),
			destinationY: getRandomCoord(screenHeight),
			chasePlayerInstead: shouldChase
		};
	}
   
	var gameplayScene = {
		handleUserInput: function(pressedKeys, pressedThisFrame) {
			if (pressedKeys.right && x < screenWidth) {
				x += 1;
			} else if (pressedKeys.left && x > 0) {
				x -= 1;
			}
		   
			if (pressedKeys.up && y > 0) {
				y -= 1;
			} else if (pressedKeys.down && y < screenHeight) {
				y += 1;
			}
		   
			for (let key of pressedThisFrame) {
				if (key == 'p') {
					switchToNewScene(createPauseScene(gameplayScene, screenWidth, screenHeight));
				}
			}
		},
	   
		updateModel: function() {
			for (key in stationaryDots) {
				if (stationaryDots[key].y > y - 10 && stationaryDots[key].y < y + 10 && stationaryDots[key].x > x - 10 && stationaryDots[key].x < x + 10) {
					var isDeleted = true;
					delete stationaryDots.splice(key, 1);
					if (stationaryDots.length === 0) {
						isDeleted = false;
						chasers = [];
						if (levelNum == 3) {
							sceneChangeCountdown = -1;
						} else {
						sceneChangeCountdown = 500;
						}
					}
				}
			}
			sceneChangeCountdown -= 1;
			if (sceneChangeCountdown == 0) {
				switchToNewScene(createGameplayScene(levelNum + 1, x, y, screenWidth, screenHeight));
			}
		   
		   
			if (isDeleted) {
				chasers.push(createChaser());
				var isDeleted = false;
			}
			for (var j = 0; j < chasers.length; ++j) {
				if (levelNum == 3) {
					chasers[j].chasePlayerInstead = true;
				}
				let actualDestinationX = chasers[j].destinationX;
				let actualDestinationY = chasers[j].destinationY;
				if (chasers[j].chasePlayerInstead) {
					actualDestinationX = x;
					actualDestinationY = y;
				}
			   
				if (chasers[j].x < actualDestinationX) {
					chasers[j].x += chasers[j].speed;
				} else if (chasers[j].x > actualDestinationX) {
					chasers[j].x -= chasers[j].speed;
				}
			   
				if (chasers[j].y < actualDestinationY) {
					chasers[j].y += chasers[j].speed;
				} else if (chasers[j].y > actualDestinationY) {
					chasers[j].y -= chasers[j].speed;
				}
		  
				if (isChaserNearPoint(chasers[j], actualDestinationX, actualDestinationY)) {
					if (!chasers[j].chasePlayerInstead) {
						chasers[j].destinationX = getRandomCoord(screenWidth);
						chasers[j].destinationY = getRandomCoord(screenHeight);
					}
				}
				
				if (isChaserNearPoint(chasers[j], x, y)) {
					switchToNewScene(createGameplayScene(levelNum, screenWidth/2, screenHeight/2, screenWidth, screenHeight));
				}	
			}
		},
		drawToScreen: function(g) {
			g.drawCircle(x, y, 10, "#ab3a33");
		   
			for (key in stationaryDots) {
				g.drawCircle(stationaryDots[key].x, stationaryDots[key].y, 5, stationaryDots[key].color);
			}
		   
			for (var j = 0; j < chasers.length; ++j) {
				g.drawCircle(chasers[j].x, chasers[j].y, 10, chasers[j].color);
			}
		}
	};
	return gameplayScene;
};
