/*
 * STRANGE NETWORKS - Node Class Definition
 * 
 * Defines the behavior and properties of individual network nodes:
 * - Position tracking with target-based lerping for smooth animation
 * - Type assignment (0 or 1) for bipartite graph construction
 * - Color assignment from palette with transparency (alpha channel)
 * - Angular positioning using trigonometric placement
 * - Five distinct layout modes with different spatial arrangements
 * 
 * Mathematical Concepts:
 * - Angular distribution: ang = map(index, 0, total, 0, TAU) - HALF_PI
 * - Parametric positioning: tpos.x = cos(ang) * radius, tpos.y = sin(ang) * radius
 * - Counter-based orbit: Uses incremented counter in cos/sin for circular motion
 * - Linear interpolation: Smooth motion using lerp(target, 0.1) each frame
 * - Catmull-Rom phantom points: Control points calculated per-mode for curve tension
 * 
 * Made by Jonas Kjeldmand Jensen - March 2026
 */

class Node {
	constructor(type, i, ang) {
		this.pos = createVector(0, 0);
		this.tpos = createVector(cos(ang) * height / 2.2, sin(ang) * height / 2.2);
		this.type = type;
		this.i = i;
		this.col = color(colors[i]);
		this.ang = ang;
		this.counter = map(i, 0, colors.length - 1, 0, TAU);
	}
	show() {
		this.pos.lerp(this.tpos, 0.1);
		push();
		translate(this.pos);
		noStroke();
		fill(this.col)
		ellipse(0, 0, height / 72);
		pop();
	}
	arrange() {
		if (nodes.length==32 && moving) this.counter += 0.02;
		switch (mode) {
			case 0:
				this.tpos.x = cos(this.ang) * (height / 2.5) + (height / 30) * cos(freq*this.counter);
				this.tpos.y = sin(this.ang) * (height / 2.5) + (height / 30) * sin(freq*this.counter);
				break;
			case 1:
				this.tpos.x = cos(this.ang) * (height / 2.5 - height / 5 * this.type) + height / 30 * cos(freq*this.counter);
				this.tpos.y = sin(this.ang) * (height / 2.5 - height / 5 * this.type) + height / 30 * sin(freq*this.counter);
				break;
			case 2:
				this.tpos.x = (-0.35 * width + this.type * 0.7 * width) + (-1+2*this.type)*(height / 24) * cos(freq*this.counter);
				this.tpos.y = map(this.i, 0, colors.length - 1, -0.35 * height, 0.35 * height) - (this.type * height / 32) + (height / 36) * sin(freq*this.counter);
				break;
			case 3:
				this.tpos.x = map(this.i, 0, colors.length, -0.4 * width, 0.4 * width) + (height / 20) * cos(freq*this.counter);
				this.tpos.y = map(this.i, 0, colors.length, -0.4 * height, 0.4 * height) + (height / 20) * sin(freq*this.counter);
				break;
			case 4:
				this.tpos.x = random(-0.35 * width, 0.35 * width) + (height / 12) * cos(freq*this.counter);
				this.tpos.y = random(-0.35 * height, 0.35 * height) + (height / 12) * sin(freq*this.counter);
				break;
		}
	}
	connect() {
		strokeWeight(0.5);
		noFill();
		if (this.type == 1) return;
		for (let other of nodes) {
			stroke(lerpColor(this.col, other.col, 0.5));
			if (this.type == other.type) continue;
			switch (mode) {
				case 0:
					curve(cos(this.ang) * 1.5 * width, sin(this.ang) * 1.5 * width, this.pos.x, this.pos.y, other.pos.x, other.pos.y, cos(other.ang) * 1.5 * width, sin(other.ang) * 1.5 * width);
					break;
				case 1:
					curve(cos(this.ang) * 2 * width, sin(this.ang) * 2 * width, this.pos.x, this.pos.y, other.pos.x, other.pos.y, -cos(other.ang) * 2 * width, -sin(other.ang) * 2 * width);
					break;
				case 2:
					curve(this.pos.x - 2 * width, this.pos.y - 5 * (this.pos.y - other.pos.y), this.pos.x, this.pos.y, other.pos.x, other.pos.y, other.pos.x + 2 * width, other.pos.y + 5 * (this.pos.y - other.pos.y));
					break;
				case 3:
					curve(this.pos.x - 3 * (this.pos.x - other.pos.x), this.pos.y + 5 * (this.pos.y - other.pos.y), this.pos.x, this.pos.y, other.pos.x, other.pos.y, other.pos.x + 3 * (this.pos.x - other.pos.x), other.pos.y - 5 * (this.pos.y - other.pos.y));
					break;
				case 4:
					curve(this.pos.x - 2 * (this.pos.x - other.pos.x), this.pos.y + 5 * (this.pos.y - other.pos.y), this.pos.x, this.pos.y, other.pos.x, other.pos.y, other.pos.x + 2 * (this.pos.x - other.pos.x), other.pos.y - 5 * (this.pos.y - other.pos.y));
					break;
			}
		}
	}
}