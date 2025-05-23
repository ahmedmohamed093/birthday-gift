party.settings.debug = false;
const sfx = new Audio("./Assets/sfx/confetti_sfx.mp3");

document.body.addEventListener("click", (event) => {
  event.preventDefault();
  party.confetti(event);

  sfx.volume = 0.25;
  sfx.currentTime = 0;
  sfx.play();
});
let balloons = [];
let balloonImages = [];

function preload() {
  balloonImages.push(loadImage("./Assets/balloon_sprites/Red_Balloon.png"));
  balloonImages.push(loadImage("./Assets/balloon_sprites/Green_Balloon.png"));
  balloonImages.push(loadImage("./Assets/balloon_sprites/Blue_Balloon.png"));
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  for (let i = 0; i < 100; i++) {
    balloons.push(new Balloon(random(width), random(height), random(80, 120)));
  }
}

function draw() {
  clear();
  for (let balloon of balloons) {
    balloon.update();
    balloon.display();
  }
}

class Balloon {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, random([-1, -0.5, 0.5, 1]));
    this.r = r;
    this.rotation = 0;
    this.rotationSpeed = 0;
    this.img = random(balloonImages);
  }

  update() {
    let mouse = createVector(mouseX, mouseY);
    let d = p5.Vector.dist(mouse, this.pos);

    if (d < this.r + 50) {
      let flee = p5.Vector.sub(this.pos, mouse);
      flee.setMag(0.5);
      this.vel.add(flee);
    }

    // --- other balloons ---
    for (let other of balloons) {
      if (other !== this) {
        let dist = p5.Vector.dist(this.pos, other.pos);
        let minDist = this.r / 2 + other.r / 2;

        if (dist < minDist && dist > 0) {
          let push = p5.Vector.sub(this.pos, other.pos);
          push.setMag((minDist - dist) * 0.05);
          this.vel.add(push);
        }
      }
    }

    this.vel.mult(0.97);
    this.vel.y -= 0.01;
    this.pos.add(this.vel);

    // -- wall bounce --
    if (this.pos.x < this.r || this.pos.x > width - this.r) {
      this.vel.x *= -0.8;
    }
    if (this.pos.y < this.r || this.pos.y > height - this.r) {
      this.vel.y *= -0.8;
    }

    this.pos.x = constrain(this.pos.x, this.r, width - this.r);
    this.pos.y = constrain(this.pos.y, this.r, height - this.r);

    // --- rotation ---
    let velocityAngle = this.vel.heading();
    let upAngle = -PI / 2;

    let angleDiff = velocityAngle - upAngle;
    while (angleDiff > PI) angleDiff -= TWO_PI;
    while (angleDiff < -PI) angleDiff += TWO_PI;

    const maxTilt = radians(15);
    angleDiff = constrain(angleDiff, -maxTilt, maxTilt);

    this.rotation = lerpAngle(this.rotation, angleDiff, 0.1);
    this.rotation = lerp(this.rotation, 0, 0.02);
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotation);
    imageMode(CENTER);

    const aspect = this.img.height / this.img.width;
    const desiredWidth = this.r;
    const desiredHeight = this.r * aspect;

    image(this.img, 0, 0, desiredWidth, desiredHeight);
    pop();
  }
}

function lerpAngle(a, b, t) {
  let diff = b - a;
  while (diff > PI) diff -= TWO_PI;
  while (diff < -PI) diff += TWO_PI;
  return a + diff * t;
}
function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}
