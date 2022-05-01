const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const sketch = ({ context, width, height }) => {
  create = [];

  const num = 2;
  const radius = width * 0.3;
  
  for (let i = 0; i < num; i++){
    const slice = math.degToRad(360 / num);
    const angle = slice * i;

    const cx = width * 0.5;
    const cy = height * 0.5;
    const w = width * 0.01;
    const h = height * 0.1;
    let x, y;

    x = cx + radius * Math.sin(angle);
    y = cy + radius * Math.cos(angle);
    
    create.push(new Create(cx, cy, x, y, angle, w, h, radius, slice));
  };
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

      
    create.forEach(circle =>{
      circle.update();
      circle.draw(context);
      circle.bounce(width, height)
    });   
  };
};

canvasSketch(sketch, settings);

class Block{
  constructor(cx, cy, x, y, angle, w, h, radius, slice){
    this.cx = cx;
    this.cy = cy;
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.w = w;
    this.h = h;
    this.radius = radius;
    this.slice = slice;
  };
};

class Create{
  constructor(cx, cy, x, y, angle, w, h, radius, slice){
    this.pos = new Block(cx, cy, x, y, angle, w, h, radius, slice);
    this.vel = new Block(Math.sin(this.pos.angle), Math.cos(this.pos.angle));
  };

  draw(context){
    context.fillStyle = 'black';
    
    context.save();
    context.translate(this.pos.x, this.pos.y);
    context.rotate(-this.pos.angle)
    context.scale(random.range(0.1, 2), random.range(0.2, 0.5));

    context.beginPath();
    context.rect(-this.pos.w * 0.5, -this.pos.h * 0.5, this.pos.w, this.pos.h);
    context.fill()
    context.restore();

    context.save();
    context.translate(this.pos.cx, this.pos.cy);
    context.rotate(-this.pos.angle);

    context.lineWidth = random.range(5, 20);

    context.beginPath();
    context.arc(0, 0, this.pos.radius, this.pos.slice * random.range(1, 40), this.pos.slice * random.range(1, 40));
    context.stroke();
    context.restore();

  };

  update() {
    this.pos.x += this.vel.cx;
    this.pos.y += this.vel.cy;
    this.pos.cx += this.vel.cx;
    this.pos.cy += this.vel.cy;
  };

  bounce(width, height){
    if (this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1;
    if (this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
    if (this.pos.cx <= 0 || this.pos.cx >= width) this.vel.cx *= -1;
    if (this.pos.cy <= 0 || this.pos.cy >= height) this.vel.cy *= -1;
  }
};