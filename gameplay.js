
var createGameplayScene = function(levelNum, startX, startY, screenWidth, screenHeight) {
	let player = {
		x: startX,
		y: startY,
		drawMe: function(g) {
			g.drawCircle(player.x, player.y, 10, "#ab3a33");
		},
		isDead: false,
		updateMe: function() {},
		type: "player",
	}

	var sprites = [player];
 	
	let typeCounter = function(string) {
		let counter = 0;
		for (let sprite of sprites) {
			if (sprite.type === string && sprite.isDead === false){
				counter += 1;
			}
		}
		return counter;
	}
	
	
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

	for (let i = 0; i < 10; i++) {
		let dot = {
			x: getRandomCoord(screenWidth),
			y: getRandomCoord(screenHeight),
			color: "#b2817d",
			drawMe: function(g){
				g.drawCircle(dot.x, dot.y, 5, dot.color);
			},
			isDead: false,
			type: "dot",
			updateMe: function() {
				if (dot.y > player.y - 10 && dot.y < player.y + 10 && dot.x > player.x - 10 && dot.x < player.x + 10) {
					dot.isDead = true;
					if (typeCounter("dot") === 0) {
						for (let chaser of sprites.filter(function(sprites) { return sprites.type === "chaser"; })) {
							chaser.isDead = true;
						}
						if (levelNum == 4) {
							sceneChangeCountdown = -1;
						} else {
						sceneChangeCountdown = 500;
						}
					} else if (dot.isDead && levelNum !== 4) {
						sprites.push(createChaser(0, 0));
					} else if (levelNum == 4) {
						if (typeCounter("chaser") < 41) {
							if (dot.isDead) {
								for (let i = 0; i < 41; i++) {
									sprites.push(createChaser(0, 0));
								}
							}
						}
					}
				}
				 
			},
		}
		sprites.push(dot);
	}
	   
	let createChaser = function(x, y) {
		colors = ["#ceccc0", "#99a552", "#c3a022", "#24576c", "#a48897", "#3fb994", "#a6542b", "#494d42", "#ecd1d6"];
		
		let shouldChase = false;
		if (levelNum == 2) {
			if (getRandomCoord(2) === 1) {
				shouldChase = true;
			}
		} else if (levelNum == 3) {
			shouldChase = true;
		}
		
		var chaser = {
			x: x,
			y: y,
			color: colors[getRandomCoord(colors.length)],
			speed: 0.35 + Math.random() * 0.3,
			destinationX: getRandomCoord(screenWidth),
			destinationY: getRandomCoord(screenHeight),
			chasePlayerInstead: shouldChase,
			drawMe: function(g) {
				g.drawCircle(chaser.x, chaser.y, 10, chaser.color);
			},
			isDead: false,
			type: "chaser",
			updateMe: function() {
				if (levelNum == 3) {
					chaser.chasePlayerInstead = true;
				}
				let actualDestinationX = chaser.destinationX;
				let actualDestinationY = chaser.destinationY;
				if (chaser.chasePlayerInstead) {
					actualDestinationX = player.x;
					actualDestinationY = player.y;
				}
			   
				if (chaser.x < actualDestinationX) {
					chaser.x += chaser.speed;
				} else if (chaser.x > actualDestinationX) {
					chaser.x -= chaser.speed;
				}
			   
				if (chaser.y < actualDestinationY) {
					chaser.y += chaser.speed;
				} else if (chaser.y > actualDestinationY) {
					chaser.y -= chaser.speed;
				}
		  
				if (isChaserNearPoint(chaser, actualDestinationX, actualDestinationY)) {
					if (!chaser.chasePlayerInstead) {
						chaser.destinationX = getRandomCoord(screenWidth);
						chaser.destinationY = getRandomCoord(screenHeight);
					}
				}
				
				if (isChaserNearPoint(chaser, player.x, player.y)) {
					switchToNewScene(createGameplayScene(levelNum, screenWidth/2, screenHeight/2, screenWidth, screenHeight));
				}	
			},
		};
		return chaser;
	}
   
	var gameplayScene = {
		handleUserInput: function(pressedKeys, pressedThisFrame) {
			if (pressedKeys.right && player.x < screenWidth) {
				player.x += 1;
			} else if (pressedKeys.left && player.x > 0) {
				player.x -= 1;
			}
		   
			if (pressedKeys.up && player.y > 0) {
				player.y -= 1;
			} else if (pressedKeys.down && player.y < screenHeight) {
				player.y += 1;
			}
		   
			for (let key of pressedThisFrame) {
				if (key == 'p') {
					switchToNewScene(createPauseScene(gameplayScene, screenWidth, screenHeight));
				}
			}
		},
	   
		updateModel: function() {
			sceneChangeCountdown -= 1;
			if (sceneChangeCountdown == 0) {
				switchToNewScene(createGameplayScene(levelNum + 1, player.x, player.y, screenWidth, screenHeight));
			}
			for (let sprite of sprites) {
				sprite.updateMe();
			}
			for (let i = 0; i < sprites.length; ++i) {
				if (sprites[i].isDead) {
					sprites.splice(i, 1);
					i -= 1;
				}
			}
		},
        drawToScreen: function(g) {
            for (let sprite of sprites) {
			sprite.drawMe(g);
			}
        }
    }
    return gameplayScene;
};