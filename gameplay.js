let getRandomNum = function(max) {
	return Math.floor(Math.random() * max);
};

let typeCounter = function(string, sprites) {
	let counter = 0;
	for (let sprite of sprites) {
		if (sprite.type === string && sprite.isDead === false){
			counter += 1;
		}
	}
	return counter;
};


function GameplayScene(levelNum, startX, startY, screenWidth, screenHeight) {
	
	this.levelNum = levelNum;
	this.sceneChangeCountdown = -1;
	
	this.handleUserInput = function(pressedKeys, pressedThisFrame) {
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
	};

	this.updateModel = function() {
		this.sceneChangeCountdown -= 1;
		if (this.sceneChangeCountdown == 0) {
			switchToNewScene(new GameplayScene(levelNum + 1, player.x, player.y, screenWidth, screenHeight));
		}
		this.sprites.forEach(function(sprite) {
			sprite.updateMe();
		});
		this.sprites = this.sprites.filter(function(sprite) { return !sprite.isDead });
	};
	
    this.drawToScreen = function(g) {
		this.sprites.forEach (function(sprite){
			sprite.drawMe(g);
		})
	};
	
	this.sprites = [];
	
	let player = new Player(startX, startY);
	this.player = player;
	this.sprites.push(player);
	
	this.isNearPoint = function(chaser, x, y) {
	if (chaser.y > y - chaser.radius &&
		chaser.y < y + chaser.radius &&
		chaser.x > x - chaser.radius &&
		chaser.x < x + chaser.radius) {
		
		return true;
	}
	};

	this.distanceBetweenSprites = function(a, b) {
		let diffX = a.x - b.x;
		let diffY = a.y - b.y;
		return Math.sqrt(diffX * diffX + diffY * diffY);
	};

	this.doesCollide = function(a, b) {
		return distanceBetweenSprites(a, b) <= a.radius + b.radius;
	};
	
	let createObstacle = function() {
		let obstacle = {
			x: getRandomNum(screenWidth),
			y: getRandomNum(screenHeight),
			destinationX: player.x,
			destinationY: player.y,
			speed: 0.02,
			radius: 10,
			drawMe: function(g) {
				g.drawCircle(obstacle.x, obstacle.y, obstacle.radius, "#090803") 
			},
			updateMe: function() {
				obstacle.radius += 0.002;
				if (obstacle.x < obstacle.destinationX) {
					obstacle.x += obstacle.speed;
				} else if (obstacle.x > obstacle.destinationX) {
					obstacle.x -= obstacle.speed;
				}
				   
				if (obstacle.y < obstacle.destinationY) {
					obstacle.y += obstacle.speed;
				} else if (obstacle.y > obstacle.destinationY) {
					obstacle.y -= obstacle.speed;
				}
				if (doSpritesCollide(obstacle, player)) {
					switchToNewScene(new GameplayScene(levelNum, screenWidth/2, screenHeight/2, screenWidth, screenHeight));
				}
			},
			type: "obstacle",
			isDead: false,
		};
		return obstacle;
	};
 	
	for (let i = 0; i < 10; i++) {
		let dot = new Dot(screenWidth, screenHeight, this);
		this.sprites.push(dot);
		if (levelNum == 6) {
			this.sprites.push(new Chaser(0, 0, screenWidth, screenHeight, this));
		}
	}
}