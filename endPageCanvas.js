var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerHeight;

//------------------Shape Classes------------

class Circle {
    constructor(x, y, radius, fillColor, context) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.fillColor = fillColor;
      this.context = context;
    }
  
    draw() {
      if (this.fillColor) {
        this.context.fillStyle = this.fillColor;
      }
      this.context.beginPath();
      this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      this.context.fill();
    }
  }

  class Ring {
    constructor(x, y, radius, thickness, fillColor, context) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.thickness = thickness;
        this.fillColor = fillColor;
        this.context = context;
      }

      draw()
      {
          var tempFill = this.context.fillStyle;
          new Circle(this.x, this.y, this.radius, this.fillColor, this.context).draw();
          new Circle(this.x, this.y, this.radius-this.thickness, tempFill, this.context).draw();
      }
  }



//----------------Drawing Shapes----------

retrieveData();
console.log(gameData.progressRecord);

var bark = new Ring(canvas.width/2, canvas.height/2, canvas.width/2, 5, "#6a3e2d",c);
var trunk = new Circle(canvas.width/2, canvas.height/2, canvas.width/2-10, "#c4ad8d", c);
var rings = [];

var record = gameData.progressRecord;

for(var i = 0; i<15; i++)
{
   // var percentage = record.fruitYield/(record.heighFruitYield-record.lowFruitYield);
    var opacity = 1; //eventually will be percentage
    var weight = 5; // this will be percentage*10/2
    rings[i] = new Ring(canvas.width/2, canvas.height/2, canvas.width/35 * (i+1), weight, "rgba(106,62,45," + opacity + ")", c);
}

bark.draw();
trunk.draw();
for(var i = 14; i>=0; i--)
{
    rings[i].draw();
}
