function Dot(screenWidth, screenHeight, player, levelNum, sprites){
	this.x = getRandomNum(screenWidth);
	this.y = getRandomNum(screenHeight);
	"#b2817d",
	this.color = "#8E546C";
	this.drawMe = function(g){
		g.drawCircle(this.x, this.y, 5, this.color);
	};
	this.isDead = false;
	this.type = "dot";
	this.updateMe = function() {
		if (this.y > player.y - 10 && this.y < player.y + 10 && this.x > player.x - 10 && this.x < player.x + 10) {
			this.isDead = true;
			if (typeCounter("dot", sprites) === 0) {
				for (let chaser of sprites.filter(function(sprites) { return sprites.type === "chaser"; })) {
					chaser.isDead = true;
				}
				for (let obstacle of sprites.filter(function(sprites) { return sprites.type === "obstacle"; })) {
					obstacle.isDead = true;
				}
				if (levelNum == 6) {
					sceneChangeCountdown = -1;
				} else {
				sceneChangeCountdown = 500;
				}
			} else if (this.isDead && levelNum !== 4 && levelNum !== 6) {
				sprites.push(new Chaser(0, 0, screenWidth, screenHeight, levelNum, player, sprites));
			} else if (levelNum == 4) {
				if (typeCounter("chaser", sprites) < 41) {
					if (this.isDead) {
						for (let i = 0; i < 41; i++) {
							sprites.push(new Chaser(0, 0, screenWidth, screenHeight, levelNum, player, sprites));
						}
					}
				}
			} else if (levelNum == 6) {
				if (this.isDead) {
					sprites.filter(function(sprites) { return sprites.type === "chaser"; })[1].isDead = true;
				}
			} 
				
		}
		 
	};
};