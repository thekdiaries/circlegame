function Dot(screenWidth, screenHeight, scene){
	this.x = getRandomNum(screenWidth);
	this.y = getRandomNum(screenHeight);
	this.color = "#8E546C";
	this.isDead = false;
	this.type = "dot";
};

Dot.prototype.updateMe = function(scene, screenWidth, screenHeight) {
	let player = scene.player;
	let levelNum = scene.levelNum;
	let sceneChangeCountdown = scene.sceneChangeCountdown;
	if (this.y > player.y - 10 && this.y < player.y + 10 && this.x > player.x - 10 && this.x < player.x + 10) {
		this.isDead = true;
		if (typeCounter("dot", scene.sprites) === 0) {
			for (let chaser of scene.sprites.filter(function(sprites) { return sprites.type === "chaser"; })) {
				chaser.isDead = true;
			}
			for (let obstacle of scene.sprites.filter(function(sprites) { return sprites.type === "obstacle"; })) {
				obstacle.isDead = true;
			}
			if (levelNum == 6) {
				sceneChangeCountdown = -1;
			} else {
				sceneChangeCountdown = 500;
			}
		} else if (this.isDead && levelNum !== 4 && levelNum !== 6) {
			scene.sprites.push(new Chaser(0, 0, screenWidth, screenHeight, scene));
		} else if (levelNum == 4) {
			if (typeCounter("chaser", scene.sprites) < 41) {
				if (this.isDead) {
					for (let i = 0; i < 41; i++) {
						scene.sprites.push(new Chaser(0, 0, screenWidth, screenHeight, scene));
					}
				}
			}
		} else if (levelNum == 6) {
			if (this.isDead) {
				scene.sprites.filter(function(sprite) { return sprite.type === "chaser"; })[0].isDead = true;
			}
		} 
	}
};

Dot.prototype.drawMe = function(g) {
	g.drawCircle(this.x, this.y, 5, this.color);
};