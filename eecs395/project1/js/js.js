/*
Global Variables
*/
// input
var file = [];

// canvas setup
var canvas = document.getElementById("myCanvas");
var canvasWidth = 1005; var canvasHeight = 1005;
var ctx = canvas.getContext("2d");
var canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
var pressed = false;

var data;

// colors
var brushColor =  {r: 0, g: 0, b: 0, a: 0};     // global variable for color to be used
var red =         {r: 255, g: 0, b: 0, a:255};  // red color
var green =       {r: 0, g:255, b: 0, a:255};
var blue =        {r: 0, g:0, b: 255, a:255};
var black =       {r: 0, g:0, b: 0, a:255};
var clear =       {r: 0, g: 0, b: 0, a: 0};

/*
reload the page
*/
function reload(){
  location.reload();
}

/*
load test data functions
*/
function load1(){
  var test1 = "P\n(150,300)\n(450,300)\n(570,525)\n(653,780)\n(495,845)\n(350,740)\n(100,345)";
  document.getElementById("inputArea").value = test1;
}
function load2(){
  var test2 = "U\nP1\n(150,300)\n(450,300)\n(570,525)\n(653,780)\n(495,845)\n(350,790)\n(100,345)\nP2\n(285,420)\n(500,225)\n(831,543)\n(625,695)\n(444,710)\n(285,555)";
  document.getElementById("inputArea").value = test2;
}
function load3(){
  var test3 = "S\n(150,455)\n(225,700)\n(300,393)\n(350,110)\n(432,234)\n(527,129)\n(680,799)\n(734,569)\n(844,459)\n(927,665)\n(999,459)";
  document.getElementById("inputArea").value = test3;  
}

function draw(){
  if (pressed){location.reload();}      // reload if already drawn before
  pressed = true;


  //file input
  file = [];
  data = document.getElementById("inputArea").value;
  file = data.split("\n");
  for (var i = 0; i < file.length; i++){      // find points and split into int pairs
    if (file[i][0] == "("){
      file[i] = file[i].replace(/[^\d,]/g, '').split(",");  // remove non-numeric, split
      for (var j = 0; j < file[i].length; j++){           // cast to int
        file[i][j] = parseInt(file[i][j]);
      }
    }
  }



  var maxWidth = 0; var maxHeight = 0;
  for (var i = 0; i < file.length; i++){
    if (typeof(file[i]) == "object"){
      if (file[i][0] > maxWidth) {
        maxWidth = file[i][0];
      }
      if (file[i][1] > maxHeight) {
        maxHeight = file[i][1];
      }
    }
  }

  //canvas
  canvasWidth = maxWidth + 5;   // plus padding
  //canvas.style.width = "300px"; //String(maxWidth);
  canvasHeight = maxHeight + 5; // plus padding
  //canvas.style.height = String(maxHeight);

  canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

  // run main
  main();
}

// That's how you define the value of a pixel //
function drawPixel (x, y) {
  var index = (x + y * canvasWidth) * 4;

  canvasData.data[index + 0] = brushColor.r;
  canvasData.data[index + 1] = brushColor.g;
  canvasData.data[index + 2] = brushColor.b;
  canvasData.data[index + 3] = brushColor.a;
}

/*
Clear a pixel back to default color
*/
function clearPixel(x, y){
  var storeBrushColor = brushColor;
  brushColor = clear;
  drawPixel(x, y);
  brushColor = storeBrushColor;
}

/* Check if a pixel is empty
  returns true if empty
*/
function getIfEmptyPixel(x, y){
  var index = (x + y * canvasWidth) * 4;
  var sum =
  canvasData.data[index + 0] +
  canvasData.data[index + 1] +
  canvasData.data[index + 2] +
  canvasData.data[index + 3];
  if (sum == 0){
    return true;
  }
  return false;
}

/*
see if pixel is a certain color
*/
function getIfPixelIsColor(x, y, color){
  var index = (x + y * canvasWidth) * 4;
  if (
      (canvasData.data[index + 0] == color.r) &&
      (canvasData.data[index + 1] == color.g) &&
      (canvasData.data[index + 2] == color.b) &&
      (canvasData.data[index + 3] == color.a)
    ){
    return true;
  }

  return false;
}

// That's how you update the canvas, so that your //
// modification are taken in consideration //
function updateCanvas() {
  ctx.putImageData(canvasData, 0, 0);
}

function main(){
  if (file[0] == "P"){
    drawP();
  }
  else if (file[0] == "U"){
    drawU();
  }
  else if (file[0] == "S"){
    drawS();
  }
  updateCanvas();
}

/*
Draw polygon for file with "P" header
*/
function drawP(){
  // draw polygon
  drawPolygon(file, blue);
  
  // scanFill
  brushColor = green;
  scanFill(red);
}

/*
Draw polygon for file with "U" header
*/
function drawU(){
  var P1Start; var P2Start;       // separate polygons
  for (var i = 0; i < file.length; i++){
    if (file[i] == "P1"){P1Start = i;}
    if (file[i] == "P2"){P2Start = i;}
  }
  var p1 = file.slice(P1Start + 1, P2Start - 1);
  var p2 = file.slice(P2Start + 1, file.length);

  drawPolygon(p1, blue);
  drawPolygon(p2, green);
  scanFillIntersect(red);
}

/*
Draw convex hull for file with "S" header
*/
function drawS(){
  file = file.slice(1, file.length);
  var hull = convexHull(file);
  drawPolygon(hull, green);
}

/*
draw a polygon
*/
function drawPolygon(file, color){
  var tempBrushColor = brushColor;
  brushColor = color;
  var lastrun = 0; var firstrun = 9999;
  for (var i = 0; i < file.length - 1; i++){
    if ((typeof(file[i]) == "object") && (typeof(file[i+1]) == "object")){
      drawLine(file[i], file[i+1]);
      if (i+1 > lastrun){lastrun = i+1;}
      if (i < firstrun){firstrun = i;}
    }
  }
  drawLine(file[lastrun], file[firstrun]);
  brushColor = tempBrushColor;
}

/*
Draw a line by comparing to midpoint
*/
function drawLine(p1, p2){
  var pstart; var pend;
  if (p1[0] <= p2[0]){
    pstart = p1; pend = p2;
  }
  else {
    pstart = p2; pend = p1;
  }
  var x = pstart[0]; var xx = pend[0];
  var y = pstart[1]; var yy = pend[1];
  var m = (yy - y)/(xx - x);
  var b = y - (m*x);
  var yreal = y;
  var ymid = x*m + b + 0.5;

  // abs <= 1, first two cases by x domain
  if (Math.abs(m) <= 1){
    // upwards slope
    if ((m > 0) && (m != "Infinity")){
      for (var i = x; i < xx; i++){
      //above mid
        if (yreal >= ymid){
          drawPixel(i, ymid + 0.5);
          ymid++;
          yreal += m;
        }
      //below mid
        else if (yreal < ymid){
          drawPixel(i, ymid - 0.5);
          yreal += m;
        }
      }
    }
    // downwards slope
    else if ((m < 0) && (m != "-Infinity")){
      for (var i = x; i <= xx; i++){
      //above mid
        if (yreal >= ymid){
          drawPixel(i, ymid + 0.5);
          yreal += m;
        }
      //below mid
        else if (yreal < ymid){
          drawPixel(i, ymid - 0.5);
          ymid--;
          yreal += m;
        }
      }
    }
  }

  // abs > 1, next two cases by y domain
  if (Math.abs(m) > 1){
    var pystart; var pyend;
    if (p1[1] <= p2[1]){
      pystart = p1; pyend = p2;
    }
    else {
      pystart = p2; pyend = p1;
    }
    var xn = pystart[0]; var xxn = pyend[0];
    var yn = pystart[1]; var yyn = pyend[1];
    var mn = (xxn - xn)/(yyn - yn);
    var bn = xn - (mn*yn);
    var xreal = xn;
    var xmid = yn*mn + bn + 0.5;

    // upwards slope
    if ((mn > 0) && (mn != "Infinity")){
      for (var i = yn; i < yyn; i++){
      //above mid
        if (xreal >= xmid){
          drawPixel(xmid + 0.5, i);
          xmid++;
          xreal += mn;
        }
      //below mid
        else if (xreal < xmid){
          drawPixel(xmid - 0.5, i);
          xreal += mn;
        }
      }
    }
    // downwards slope
    else if ((mn < 0) && (mn != "-Infinity")){
      for (var i = yn; i <= yyn; i++){
      //above mid
        if (xreal >= xmid){
          drawPixel(xmid + 0.5, i);
          xreal += mn;
        }
      //below mid
        else if (xreal < xmid){
          drawPixel(xmid - 0.5, i);
          xmid--;
          xreal += mn;
        }
      }
    }
  }


  //horizontal
  if (m == 0){
    for (var i = x; i <= xx; i++){
      drawPixel(i, y);
    }
  }

  //vertical
  else if ((m == "Infinity") || (m == "-Infinity")){
    var ystart = Math.min(y, yy);
    var yend = Math.max(y, yy);
    for (var i = ystart; i <= yend; i++){
      drawPixel(x, i);
    }
  }

  //same point
  else if (!m){
    drawPixel(x, y);
  }
}

/*
Horizontal ray casting to color interior points of a polygon
*/
function scanFill(color){
  var tempBrushColor = brushColor;
  brushColor = color;
  for (var j = 0; j < canvasHeight; j++){
    var collisions = 0;
    var firstCollision;
    var lastCollision;
    for (var i = 0; i < canvasWidth; i++){
      if ((!getIfEmptyPixel(i, j)) && (collisions == 0)){ // first collision
        collisions++;
        firstCollision = i;     // set first collision
        lastCollision = i;
      }
      else if (!getIfEmptyPixel(i, j)){          // collision
        if (i - firstCollision > 3){        // exclude collisions from same edge
          collisions++;
          lastCollision = i;         
          continue;                       // too many collisions, exit
        }
      }
      else if (collisions == 1){         // no collision and inside, draw
        drawPixel(i, j);
      }
      if ((collisions == 1) && (i >= canvasWidth - 1)){ // if drawing at end, go back
        brushColor = clear;
        for (var k = canvasWidth -1; k >= lastCollision +1; k--){
          if (getIfPixelIsColor(k, j, color)){
            drawPixel(k, j);
          }
        }
        brushColor = color;
        continue;
      }
      
      
    }
  }
  brushColor = tempBrushColor;
}

/*
Horizontal ray casting to color interior points of intersecting polygons
*/
function scanFillIntersect(color){
  var tempBrushColor = brushColor;
  brushColor = color;
  for (var j = 0; j < canvasHeight; j++){
    var collisions = 0;
    var firstCollision;
    var secondCollision;
    var lastCollision;
    for (var i = 0; i < canvasWidth; i++){
      if ((!getIfEmptyPixel(i, j)) && (collisions == 0)){ // first collision
        collisions++;
        firstCollision = i;
        lastCollision = i;
      }
      else if ((!getIfEmptyPixel(i, j)) && (collisions == 1)){ // second collision
        if (i - firstCollision > 3){      // exclude collisions from same edge
          collisions++;
          secondCollision = i;     // set second collision
          lastCollision = i;          
        }
      }
      else if (!getIfEmptyPixel(i, j)){          // collision
        if (i - secondCollision > 3){        // exclude collisions from same edge
          collisions++;
          lastCollision = i;         
          continue;                       // too many collisions, exit
        }
      }
      else if (collisions == 2){         // no collision and inside, draw
        drawPixel(i, j);
      }
      if ((collisions == 2) && (i >= canvasWidth - 1)){ // if drawing at end, go back
        brushColor = clear;
        for (var k = canvasWidth -1; k >= lastCollision +1; k--){
          if (getIfPixelIsColor(k, j, color)){
            drawPixel(k, j);
          }
        }
        brushColor = color;
        continue;
      }
      
      
    }
  }
  brushColor = tempBrushColor;
}

/*
Find convex hull of an array of combining upper and lower
*/
function convexHull(points) {
  var forwards = points;
  var backwards = [];
  for (var i = points.length - 1; i >= 0; i--){
    backwards.push(points[i]);
  }

  hull1 = getHullHalf(forwards);
  hull2 = getHullHalf(backwards);

  return hull1.concat(hull2);
}

/*
Find half of the convex hull by walking
*/
function getHullHalf(points){
  var hull = [];  // lower hull
  for (var i = 0; i < points.length; i++) {
    while ((hull.length >= 2) && valid(hull[hull.length - 2], hull[hull.length - 1], points[i]) <= 0) {
      hull.pop(); // pop if does not make a counter clockwise turn
    }
    hull.push(points[i]);  // always push next point
  }

  hull.pop();
  return hull;
}

/*
Calculate if next element is legal for convexHull
*/
function valid(lastt, last, n) {
   return (last[0] - lastt[0]) * (n[1] - lastt[1]) - (last[1] - lastt[1]) * (n[0] - lastt[0])
}

