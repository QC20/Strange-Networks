// For the #WCCChallenge, theme: "mapping".
// I took some inspiration this week from a few different network mapping diagrams found online.
// In this sketch, the path connecting two nodes is a blend of their respective colors.
// Colors taken from Aaron Reuland's super useful palette generator: https://openprocessing.org/sketch/2176841

let nodes = [];
let colors = ["#0a0d02BB", "#922301BB", "#f76e0BB9", "#ead8b8BB", "#c0df80BB", "#a59b3cBB", "#86601aBB", "#013f61BB", "#07606aBB", "#0f7b9cBB", "#366a1cBB", "#eb7300BB", "#142027BB", "#47020eBB", "#884114BB", "#686963BB", "#66aecBB9", "#8ab2c0BB", "#2f3b3eBB", "#dd841f", "#0f202e", "#862534", "#116887", "#304fad", "#451c06", "#743212", "#9c400a", "#f97e01", "#929e78", "#13b2bc", "#0c8194", "#0c8194"]
let mode = 0;
let i = 0;
let moving = true;
let rseed;
let zoom = 1;
let tzoom = 1;
let freq = 1;

function setup() {
	console.log('setup running');
	let dim = min(windowHeight, windowWidth);
	createCanvas(dim * 0.9, dim * 0.9);
	rseed = random(1000);
	for (let j = 0; j < colors.length; j++) {
		let ang = map(j, 0, colors.length, 0, TAU) - HALF_PI;
		nodes.push(new Node(j % 2, j, ang));
	}
	i = colors.length;
}

function draw() {
	randomSeed(rseed);
	background(255);
	translate(width / 2, height / 2);
	zoom = lerp(zoom, tzoom, 0.1);
	push();
	scale(zoom);
	for (let n of nodes) {
		n.show();
		n.connect();
		n.arrange();
	}
	pop();
	fill(0, 80);
	noStroke();
	textAlign(LEFT, BOTTOM);
	textSize(height / 40);
	text(mode, -width / 2, height / 2);
	textAlign(RIGHT, BOTTOM);
	textSize(height / 40);
	text(freq-1, width / 2, height / 2);
}

function mousePressed() {
	mode = (mode + 1) % 5;
	if(mode==0) freq++;
	if(freq==7) freq=1;
	rseed = random(1000);
	frameCount = 0;
	// resetNodes(); // Enable to respawn nodes with every mode change!
}

function keyPressed() {
	if (keyCode != 32) return;
	moving = !moving;
	for (let n of nodes) {
		if (!moving) n.counter = HALF_PI;
		else n.counter = map(n.i, 0, colors.length - 1, 0, TAU)-HALF_PI;
	}
}

function resetNodes() {
	nodes = [];
	i = 0;
}

function mouseWheel(event) {
	tzoom += event.delta / 1000;
	tzoom = constrain(tzoom, 1, 2);
}