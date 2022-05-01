const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const params = {
  cols: 37,
  rows: 37,
  scaleMin: 1,
  scaleMax: 30,
  freq: 0.001,
  amp: 0.3,
  frame: 0,
  animate: true,
  lineCap: 'butt',
  colour1: "#f05",
  colour2: "rgb(0, 255, 214)",
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);


//defining all the parameters for this canvas  
    const cols = params.cols;
    const rows = params.rows;
    const numCells = cols * rows
    
    // creating the margins 
    const gridw = width * 0.8;
    const gridh = height * 0.8;
    
    //creating the cells 
    const cellw = gridw / cols;
    const cellh = gridh / rows;
    
    //defining the margins
    const margx = (width - gridw) * 0.5;
    const margy = (height - gridh) * 0.5; 

//having defined all the parameters, it is now
//time to do something to each cell within the canvas
  for (let i = 0; i < numCells; i++){
    const col = i % cols; //this operation finds the column postion btw 1 to 3
    const row = Math.floor(i / cols); //this operation finds the tow position btw 1 to 4

    const x = col * cellw; //positions the cells on the x coordinate
    const y = row * cellh; //positions the cells on the y coordinate
    const w = cellw * 0.8; //controls the positioning of the cells 
    const h = cellh * 0.8; //controls the positioning of the cells 

    const f = params.animate ? frame : params.frame;

    //const n = random.noise2D(x + frame * 10, y + frame * 10, frequency=params.freq);
    const n = random.noise3D(x, y, f * 10, params.freq);
    
    const angle = n * Math.PI * params.amp;
    const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax)

    const fill = context.createLinearGradient(0, 0, n, n);
    fill.addColorStop(0, params.colour1);
    fill.addColorStop(1, params.colour2);

//draws the objects within in each cell
    context.save();
    context.translate(x, y);
    context.translate(margx, margy);
    context.translate(cellw*0.5, cellh*0.5);
    context.rotate(angle)

    context.strokeStyle = fill
    context.lineWidth = scale;
    context.lineCap = params.lineCap;

    context.beginPath();
    context.moveTo(w * -0.5, 0);
    context.lineTo(h * 0.5, 0);
    context.stroke();

    context.restore();
  }    
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;
  
  folder = pane.addFolder({title: 'Grid '}); 
  folder.addInput(params, 'lineCap', {options: {butt: 'butt', round: 'round', square: 'sqaure'}});
  folder.addInput(params, 'cols', {min: 2, max:50, step: 1});
  folder.addInput(params, 'rows', {min: 2, max:50, step: 1});
  folder.addInput(params, 'scaleMin', {min: 1, max:100});
  folder.addInput(params, 'scaleMax', {min: 1, max:100});

  folder = pane.addFolder({title: 'Noise'});
  folder.addInput(params, 'freq', {min: -0.01, max: 0.01});
  folder.addInput(params, 'amp', {min: 0, max: 1});
  folder.addInput(params, 'animate');
  folder.addInput(params, 'frame', {min:0, max: 999});
  folder.addInput(params, 'colour1');
  folder.addInput(params, 'colour2');
};

createPane();
canvasSketch(sketch, settings);
