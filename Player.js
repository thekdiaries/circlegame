function Player(startX, startY) {
	this.x = startX;
	this.y = startY;
	this.radius = 10;
	this.drawMe = function(g) {
		g.drawCircle(this.x, this.y, this.radius, "#A41D23");
	};
	this.isDead = false;
	this.updateMe = function() {};
	this.type = "player";
};