var newArray = [];
let radiusLines;
let size1 = [];
let totalArr;
let lineIndex = 0;
let lastNum;
var item;
var data;
let mainFont;

//refresh page every minute
setTimeout(function(){
  window.location.reload();
}, 1 * 60 * 500);

function preload() {
  loadJSON(
    "https://environment.data.gov.uk/flood-monitoring/id/stations/E72139/readings.json?_sorted&today",
    gotData
  );

  mainFont = loadFont('assets/MerriweatherSans-VariableFont_wght.ttf')
  rising = loadImage('assets/rising.png');
  falling = loadImage('assets/falling.png');
  low = loadImage('assets/low.png');
  high = loadImage('assets/high.png');

}

function gotData(data) {
  
  lineIndex = 0;

  item = data.items.length;
  console.log('items: ' + item)

  console.log("Newest = " + data.items[0].value);
  console.log("First = " + data.items[item - 1].value);
  
  lastNum = data.items[0].value;

  console.log("Length of the data array = " + data.items.length);

  //reverse array - newest data is last in the array instead of first
  newArray = [];
  for (i = item - 1; i >= 0; i--) {
    newArray.push(data.items[i].value);
  }

  totalArr = newArray.length; 

  for (let i = 0; i < totalArr; i++) {
    size1[i] = floor(map(newArray[i], -4, 5, 50, 700)); 
  }

  console.log("The array: " + newArray);

}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  textFont(mainFont)
  textSize(24)
  bgColor();
  
  clock();
  
  clockInfo();
  
  frameRate(5);
}

function draw() {
  
  tide();
  
}

function clock(){
  
  push()
    translate(width/2, height/2);
    noStroke();
  
    //dots for the clock
    for(let i=1; i <= 4; i++){
        push();
        
        rotate(radians(90*i));
        noFill();

        fill('#4BEE41');//#4BEE41
        circle(0,-500,8);
      
        pop();
    }
 
  pop()

  push()
  noStroke()
  let h = hour();
  let m = minute();
  //right corner info
  text('Last updated: ' + (h-1)+ " : " + m, width - 270, height - 70);
  text('Last measure: ' + lastNum + 'm', width-270, height - 30);
  pop()

}


function tide(){
  
   if (lineIndex >= totalArr-1) {
    noLoop(); // Stop the drawing when all lines have been drawn
  }

  let ang = 360 / 96;
  let diagramX = width / 2;
  let diagramY = height / 2;
  let startAngle = -90; // Set the starting angle to -90 degrees
  let radius = 0;

  //drawing the lines 
  let pointx = (size1[lineIndex] + radius) * cos(radians(ang * lineIndex + startAngle)) + diagramX;
  let pointy = (size1[lineIndex] + radius) * sin(radians(ang * lineIndex + startAngle)) + diagramY;
  let cirx = radius * cos(radians(ang * lineIndex + startAngle)) + diagramX;
  let ciry = radius * sin(radians(ang * lineIndex + startAngle)) + diagramY;
  
  stroke('#FBD040')
  strokeWeight(2)
  line(cirx, ciry, pointx, pointy);

  let d = dist(cirx, ciry, pointx, pointy);
  
  //console.log("distance = " + d);
  //console.log("i = " + lineIndex + ", value = " + size1[lineIndex]);
  //console.log("X = " + pointx);
  //console.log("Y = " + pointy);

  lineIndex++; // Move to the next line
  
}

function bgColor(){
  
  //tide info 
push()
  if(newArray[newArray.length-1] > 0){
     background('#7495B1');
     fill('#51A87B')
     rect(width/9, 15, 200,100)
     textSize(34)
     fill('#FBD040')
     text('HIGH TIDE', width/8, 55)
  }
   else{
      background('#51A87B')
      noStroke()
      fill('#7495B1')
      rect(width/9, 15, 200,100)
      textSize(34)
      fill('#FBD040')
      text('LOW TIDE', width/8, 55)
      
 }
  //7495B1, 
 
  if(newArray[newArray.length-1] > newArray[newArray.length-2]){
    text('RISING', width/7.5, 105)
    //image(rising, 120, 50, 300, 300)
  }

  else{ 
    noStroke()
    //circle(width/7, 200, 350)
    //image(falling, 120, 50, 300, 300)
    fill('#FBD040')
    textSize(34)
    text('FALLING', width/7.5, 105)
  } 
  pop()
}

function clockInfo(){

  push()
  noStroke()
  //clock text
  text('MIDNIGHT', (width/2) - 55, 25)
  
  text('MIDDAY', (width/2) - 45, height - 15)
  
  text('6PM', (width/5), (height/2)+10)
  
  text('6AM', ((width/5)*4)-45, (height/2)+10)
  
  text('Water temperature: ' + '11°C', 50, height - 50)
  pop()
  
  push()

  noStroke();
  fill('#F17046') //51A87B, F17046
  circle(width/2, height/2, 150) //circle in the middle
  pop()
}
