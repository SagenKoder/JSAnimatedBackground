$(function() {

	var canvas = document.getElementById('background-canvas');

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
			if((this.x < 0 && this.dx < 0) || (this.y < 0 && this.dy < 0)) {
				return true;
			}
			if((this.x > canvas.width && this.dx > 0) || (this.y > canvas.height && this.dy > 0)) {
				return true;
			}
			return false;
		}
		
		distanceTo(other) {
			return Math.sqrt((other.x - this.x)*(other.x - this.x) + (other.y - this.y)*(other.y - this.y));
		}
	}
	
	var dots = [];

	function update() {
		
		canvas.width  = window.innerWidth;
		canvas.height = window.innerHeight;
		
		// always have 100 dots
		if(dots.length < 100) {
			dots.push(new Dot(canvas.width, canvas.height));
		}
		
		// update position of dots and check for death
		for(var i = 0; i < dots.length; i++) {
			var dot = dots[i];
			dot.update();
			
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
			
			for(var j = 0; j < dots.length; j++) {
				var dot2 = dots[j];
				var dist = dot.distanceTo(dot2);
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

	window.requestAnimationFrame(update);

});
