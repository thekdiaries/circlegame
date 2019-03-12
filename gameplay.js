
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
	};

	var sprites = [player];
 	
	let typeCounter = function(string) {
		let counter = 0;
		for (let sprite of sprites) {
			if (sprite.type === string && sprite.isDead === false){
				counter += 1;
			}
		}
		return counter;
	};
	
	
	let getRandomNum = function(max) {
		return Math.floor(Math.random() * max);
	};
   
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
			x: getRandomNum(screenWidth),
			y: getRandomNum(screenHeight),
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
		};
		sprites.push(dot);
	}
	
	let createChaser = function(x, y) {
		let colors = ["#ceccc0", "#99a552", "#c3a022", "#24576c", "#a48897", "#3fb994", "#a6542b", "#494d42", "#ecd1d6"];
		
		let shouldChase = false;
		if (levelNum == 2) {
			if (getRandomNum(2) === 1) {
				shouldChase = true;
			}
		} else if (levelNum == 3) {
			shouldChase = true;
		}
		
		var chaser = {
			x: x,
			y: y,
			color: colors[getRandomNum(colors.length)],
			speed: 0.35 + Math.random() * 0.3,
			destinationX: getRandomNum(screenWidth),
			destinationY: getRandomNum(screenHeight),
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
						chaser.destinationX = getRandomNum(screenWidth);
						chaser.destinationY = getRandomNum(screenHeight);
					}
				}
				
				if (isChaserNearPoint(chaser, player.x, player.y)) {
					switchToNewScene(createGameplayScene(levelNum, screenWidth/2, screenHeight/2, screenWidth, screenHeight));
				}
				if (chaser.isDead) {
					for (let i = 0; i < 5; i++) {
						sprites.push(createDebris(chaser.x, chaser.y));
					}
				}
			},
		};
		return chaser;
	};
	
	let createDebris = function(x, y) {
			let debris = {
			x: x,
			y: y,
			destinationX: getRandomNum(screenWidth),
			destinationY: getRandomNum(screenHeight),
			speed: 0.2,
			radius: 10,
			drawMe: function(g) {
						g.drawCircle(debris.x, debris.y, debris.radius, "#e2d9a2") 
				},
			updateMe: function() {
					debris.radius = debris.radius - 0.1;
					if (debris.radius <= 0) { debris.isDead = true;}
					if (debris.x < debris.destinationX) {
							debris.x += debris.speed;
					} else if (debris.x > debris.destinationX) {
							debris.x -= debris.speed;
					}
					   
					if (debris.y < debris.destinationY) {
							debris.y += debris.speed;
					} else if (debris.y > debris.destinationY) {
							debris.y -= debris.speed;
					}
				},
			type: "debris",
			isDead: false,
		};
	return debris;
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
			sprites.forEach(function(sprite) {
				sprite.updateMe();
			})
			sprites = sprites.filter(function(sprite) { return !sprite.isDead });
		},
        drawToScreen: function(g) {
            sprites.forEach (function(sprite){
				sprite.drawMe(g);
			})
        }
    }
    return gameplayScene;
};