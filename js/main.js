$(function() {

	var canvas = document.createElement('canvas');
	canvas.id = "background-canvas";
	$(canvas).css("position", "fixed");
	$(canvas).css("top", "0");
	$(canvas).css("left", "0");
	$(canvas).css("width", "100vw");
	$(canvas).css("height", "100vh");
	$(canvas).css("z-index", "-1");
	
	document.body.appendChild(canvas);

	var mouseX = 0;
	var mouseY = 0;
	
	window.addEventListener('mousemove', function (evt) {
		var rect = canvas.getBoundingClientRect();
		mouseX = evt.clientX - rect.left;
		mouseY = evt.clientY - rect.top;
	});

	class Dot {
		constructor(width, height) {
			var r = Math.random();
			if(r > 0.75) { // left wall
				this.x = -30;
				this.y = Math.random() * height;
				this.dx = 1;
				this.dy = Math.random() * 4 - 2;
			} else if(r > 0.5) { // right wall
				this.x = width + 30;
				this.y = Math.random() * height;
				this.dx = -1;
				this.dy = Math.random() * 4 - 2;
			} else if(r > 0.25) { // top wall
				this.x = Math.random() * width;
				this.y = -30;
				this.dx = Math.random() * 4 - 2;
				this.dy = 1;
			} else { // bottom wall				
				this.x = Math.random() * width;
				this.y = height + 30;
				this.dx = Math.random() * 4 - 2;
				this.dy = -1;
			}
		}
		
		update() {
			this.x += this.dx;
			this.y += this.dy;
		}
		
		isDead() {
			if((this.x < -30 && this.dx < 0) || (this.y < -30 && this.dy < 0)) {
				return true;
			}
			if((this.x > canvas.width + 30 && this.dx > 0) || (this.y > canvas.height + 30 && this.dy > 0)) {
				return true;
			}
			return false;
		}
		
		distanceToOther(other) {
			return Math.sqrt((other.x - this.x)*(other.x - this.x) + (other.y - this.y)*(other.y - this.y));
		}
		
		distanceToPoint(x, y) {
			return Math.sqrt((x - this.x)*(x - this.x) + (y - this.y)*(y - this.y));
		}
		
		setSpeed(speed) {
			var len = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
				
			this.dx = (this.dx / len) * speed;
			this.dy = (this.dy / len) * speed;
		}
	}
	
	var dots = [];

	function update() {
		
		canvas.width  = window.innerWidth;
		canvas.height = window.innerHeight;
		
		// always have 100 dots
		if(dots.length < 100) {
			var dot = new Dot(canvas.width, canvas.height)
			dot.setSpeed(Math.random() * 2 + 0.5); // Between 0.5 and 2.5
			dots.push(dot);
		}
		
		// update position of dots and check for death
		for(var i = 0; i < dots.length; i++) {
			var dot = dots[i];
			dot.update();
			
			// avoid mouse
 			var dist = dot.distanceToPoint(mouseX, mouseY);
			if(dist < 200) {
				var dirX = dot.x - mouseX;
				var dirY = dot.y - mouseY;
				
				var len = Math.sqrt(dirX * dirX + dirY * dirY);
				
				dirX = (dirX / len) * (200 - dist);
				dirY = (dirY / len) * (200 - dist);
				
				dot.x += dirX;
				dot.y += dirY;
			}
			
			// remove dead dots
			if(dot.isDead()) {
				dots.splice( dots.indexOf(dot), 1 );
			}
		}
		
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = "#4682B4";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		ctx.fillStyle = "white";
		ctx.strokeStyle = "white"; 
		
		for(var i = 0; i < dots.length; i++) {
			var dot = dots[i];
			ctx.beginPath();
			ctx.arc(dot.x, dot.y, 2, 0, 2 * Math.PI);
			ctx.fill(); 
			
			// draw lines
			for(var j = 0; j < dots.length; j++) {
				var dot2 = dots[j];
				var dist = dot.distanceToOther(dot2);
				if(dist < 200) {
					ctx.lineWidth = (200 - dist) / 150;
					ctx.beginPath();
					ctx.moveTo(dot.x, dot.y);
					ctx.lineTo(dot2.x, dot2.y);
					ctx.stroke();
				}
			}
		}
		
		window.requestAnimationFrame(update);
	}
	
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
	for(var i = 0; i < 100; i++) {
		var dot = new Dot(canvas.width, canvas.height);
		dot.x = Math.random() * canvas.width;
		dot.y = Math.random() * canvas.height;
		dot.setSpeed(Math.random() * 2 + 0.5);
		dots.push(dot);
	}

	window.requestAnimationFrame(update);

});
