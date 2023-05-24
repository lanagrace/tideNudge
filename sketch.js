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
}, 1 * 60 * 1000);

function preload() {
  loadJSON(
    "https://environment.data.gov.uk/flood-monitoring/id/stations/E72139/readings.json?_sorted&today",
    gotData
  );

  mainFont = loadFont('assets/MerriweatherSans-VariableFont_wght.ttf')
  //console.log('preload')
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
  .textSize(16)
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
  text('Last updated: ' + (h-1)+ " : " + m, width - 150, height - 50);
  text('Last measure: ' + lastNum + 'm', width-150, height - 30);
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

  if(newArray[newArray.length-1] > 0){
     background('#7495B1');
     text('HIGH', width/10, 500)
  }
   else{
   background('#51A87B')
   text('LOW', width/10, 500)
 }
  //7495B1, 

  if(newArray[newArray.length-1] > newArray[newArray.length-2]){
    text('RISING', width/10, 100)
  }

  else{ 
    //circle(width/7, 200, 300)
    text('FALLING', width/8, 200)
  } 
  
}

function clockInfo(){

  push()
  noStroke()
  //clock text
  text('MIDNIGHT', (width/2) - 35, 25)
  
  text('MIDDAY', (width/2) - 30, height - 15)
  
  text('6AM', (width/5)+20, (height/2)+5)
  
  text('6PM', ((width/5)*4)-45, (height/2)+5)
  
  text('Water temp: ' + '11', 50, height - 50)
  pop()
  
  push()

  noStroke();
  fill('#F17046') //51A87B, F17046
  circle(width/2, height/2, 150) //circle in the middle
  pop()
}
