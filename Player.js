function Player(startX, startY) {
	this.x = startX;
	this.y = startY;
	this.radius = 10;
	this.isDead = false;
	this.type = "player";
};

Player.prototype.updateMe = function(scene) {};

Player.prototype.drawMe = function(g) {
	g.drawCircle(this.x, this.y, this.radius, "#A41D23");
};
