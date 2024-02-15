let wid = window.innerWidth;
let hei = window.innerHeight;
let avesAngleRange = [3, 10];
let inqAngleRange = [4, 8];
let minLength = 1;
let maxLength = 5;
let maxLengthVariance = 0.8;
let forwardPercentage = 0.96;
let maxBackstep = 45;
let previousDirectionPercentage = 0.9;
let maxDistance = 0.32 * ((wid + hei) / 2);
let maxPullValue = 0.4 * ((minLength + maxLength) / 2);

let aves, inq;

function setup() {
	frameRate(60);
	createCanvas(wid, hei);
	angleMode(DEGREES);
	aves = {
		x: wid - (wid * 0.09375),
		y: hei / 2,
		velocity: createVector(-20, 0),
		color: color(150, 100, 200),
		direction: random([-1, 1])
	}

	inq = {
		x: (wid * 0.09375),
		y: hei / 2,
		trail: [],
		velocity: createVector(20, 0),
		color: color(255, 100, 200)
	}
	strokeWeight(2);
}

function draw() {
	drawAves();
	drawInq();
	stayWithinBounds();
}

function drawAves() {
	if (random() > previousDirectionPercentage) {
		aves.direction *= -1;
	}
	aves.velocity.setMag(Math.max(Math.min(aves.velocity.mag() + random(-maxLengthVariance, maxLengthVariance), maxLength), minLength));
	aves.velocity.setHeading(aves.velocity.heading() + (aves.direction * random(avesAngleRange[0], avesAngleRange[1])));
	stroke(aves.color);
	line(aves.x, aves.y, aves.x + aves.velocity.x + towardsInq().x, aves.y + aves.velocity.y + towardsInq().y);
	aves.x += aves.velocity.x + towardsInq().x;
	aves.y += aves.velocity.y + towardsInq().y;
}

function drawInq() {
	if (random() > forwardPercentage) {
		let stepsBack = Math.floor(random(1, maxBackstep));
		let coords;
		for (let i = 0; i < stepsBack; i++) {
			coords = inq.trail.pop();
			if (inq.trail.length === 0) break;
		}
		if (coords) {
			inq.x = coords.x;
			inq.y = coords.y;
			inq.velocity = createVector(coords.velocityX, coords.velocityY);
		}
	}
	inq.velocity.setMag(Math.max(Math.min(inq.velocity.mag() + random(-maxLengthVariance, maxLengthVariance), maxLength), minLength));
	inq.velocity.setHeading(inq.velocity.heading() + (random([-1, 1]) * random(inqAngleRange[0], inqAngleRange[1])));
	stroke(inq.color);
	line(inq.x, inq.y, inq.x + inq.velocity.x + towardsAves().x, inq.y + inq.velocity.y + towardsAves().y);
	inq.x += inq.velocity.x + towardsAves().x;
	inq.y += inq.velocity.y + towardsAves().y;
	inq.trail.push({ x: inq.x, y: inq.y, velocityX: inq.velocity.x, velocityY: inq.velocity.y });
	//console.log(inq.trail.length);
}

function stayWithinBounds() {
	if (aves.x > wid || aves.x < 0) {
		aves.velocity.x *= -1;
	}
	if (aves.y > hei || aves.y < 0) {
		aves.velocity.y *= -1;
	}
	aves.x = Math.max(Math.min(aves.x, wid), 0);
	aves.y = Math.max(Math.min(aves.y, hei), 0);
	if (inq.x > wid || inq.x < 0) {
		inq.velocity.x *= -1;
	}
	if (inq.y > hei || inq.y < 0) {
		inq.velocity.y *= -1;
	}
	inq.x = Math.max(Math.min(inq.x, wid), 0);
	inq.y = Math.max(Math.min(inq.y, hei), 0);
}

function towardsInq() {
	let vectorTowards = createVector(inq.x - aves.x, inq.y - aves.y);
	let modifier = vectorTowards.limit(maxDistance).div(maxDistance).mult(maxPullValue);
	return modifier;
}

function towardsAves() {
	let vectorTowards = createVector(aves.x - inq.x, aves.y - inq.y);
	let modifier = vectorTowards.limit(maxDistance).div(maxDistance).mult(maxPullValue);
	return modifier;
}
