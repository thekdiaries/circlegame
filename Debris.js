 function Debris(x, y, screenWidth, screenHeight) {
	this.x = x;
	this.y = y;
	this.destinationX = getRandomNum(screenWidth);
	this.destinationY = getRandomNum(screenHeight);
	this.speed = 0.5;
	this.radius = 10;
	this.drawMe = function(g) {
				g.drawCircle(this.x, this.y, this.radius, "#061822") 
		};
	this.updateMe = function() {
			this.radius = this.radius - 0.5;
			if (this.radius <= 0) { this.isDead = true;}
			if (this.x < this.destinationX) {
					this.x += this.speed;
			} else if (this.x > this.destinationX) {
					this.x -= this.speed;
			}
			   
			if (this.y < this.destinationY) {
					this.y += this.speed;
			} else if (this.y > this.destinationY) {
					this.y -= this.speed;
			}
		};
	this.type = "debris";
	this.isDead = false;
}