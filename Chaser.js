function Chaser(x, y, screenWidth, screenHeight, scene) {
	let colors = ["#ceccc0", "#99a552", "#c3a022", "#24576c", "#a48897", "#3fb994", "#a6542b", "#494d42", "#ecd1d6", "#0078AD", "#548955", "#FC9F28", "#8B5E41", "#006F8A", "#438D1C", "#1C5580"];
	let levelNum = scene.levelNum;
	let player = scene.player;
	
	let shouldChase = false;
	if (levelNum == 2 || levelNum == 6) {
		if (getRandomNum(2) === 1) {
			shouldChase = true;
		}
	} else if (levelNum == 3) {
		shouldChase = true;
	}

	this.x = x;
	this.y = y;
	this.color = colors[getRandomNum(colors.length)];
	this.speed = 0.35 + Math.random() * 0.3;
	this.radius = 10;
	this.destinationX = getRandomNum(screenWidth);
	this.destinationY = getRandomNum(screenHeight);
	this.chasePlayerInstead = shouldChase;
	this.isDead = false;
	this.type = "chaser";
};

Chaser.prototype.updateMe = function(scene) {
	let player = scene.player;
		if (levelNum == 5) {
			this.radius += 0.005;
		}
		if (levelNum == 6) {
			this.radius += 0.02;
		}
		if (levelNum == 3 || levelNum == 5) {
			this.chasePlayerInstead = true;
		}
		let actualDestinationX = this.destinationX;
		let actualDestinationY = this.destinationY;
		if (this.chasePlayerInstead) {
			actualDestinationX = player.x;
			actualDestinationY = player.y;
		}
	   
		if (this.x < actualDestinationX) {
			this.x += this.speed;
		} else if (this.x > actualDestinationX) {
			this.x -= this.speed;
		}
	   
		if (this.y < actualDestinationY) {
			this.y += this.speed;
		} else if (this.y > actualDestinationY) {
			this.y -= this.speed;
		}
  
		if (scene.isNearPoint(this, actualDestinationX, actualDestinationY)) {
			if (!this.chasePlayerInstead) {
				this.destinationX = getRandomNum(screenWidth);
				this.destinationY = getRandomNum(screenHeight);
			}
		}
		
		if (scene.doesCollide(this, player)) {
			switchToNewScene(new GameplayScene(levelNum, screenWidth/2, screenHeight/2, screenWidth, screenHeight));
		}
		if (this.isDead) {
			for (let i = 0; i < 5; i++) {
				scene.sprites.push(new Debris(this.x, this.y, screenWidth, screenHeight));
			}
		}
	};

Chaser.prototype = Object.create(Chaser.prototype);

Chaser.prototype.drawMe = function(g) {
		g.drawCircle(this.x, this.y, this.radius, this.color);
	};