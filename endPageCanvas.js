var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

//canvas size is modified in css file
canvas.height = window.innerHeight;
canvas.width = window.innerHeight;

//settings for label text
c.font = "16px 'Inter', sans-serif"; 
c.textAlign = 'center';

//------------------Shape Classes------------

//used to draw rings in tree and the overall trunk
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


  // draws rings of tree
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

  //makes and draws labels on rings
  class Label{
    constructor(y, level, fillColor, context)
    {
      this.y = y;
      this.level = level; 
      this.fillColor = fillColor;
      this.context = context;
    }

    draw()
    { 
      var tempFill = this.context.fillStyle;
      this.context.fillStyle = this.fillColor;
      c.fillText("Level " + this.level, canvas.width/2, this.y);
      this.context.fillStyle = tempFill;
    }
  }



//----------------Drawing Shapes----------

retrieveData();
console.log(gameData.progressRecord);

//creates all objects in drawing
var bark = new Ring(canvas.width/2, canvas.height/2, canvas.width/2, 5, "#6a3e2d",c);
var trunk = new Circle(canvas.width/2, canvas.height/2, canvas.width/2-10, "#c4ad8d", c);
var rings = [];
var labels = [];

var record = gameData.progressRecord;

for(var i = 0; i<record.length; i++)
{ 
    var percentage = (record[i].fruitYield-record[i].lowFruitYield)/(record[i].highFruitYield-record[i].lowFruitYield);
    var opacity = percentage;
    var weight = percentage*10;
    rings[i] = new Ring(canvas.width/2, canvas.height/2, canvas.width/35 * (i+1), weight, "rgba(106,62,45," + opacity + ")", c);
    labels[i] = new Label(canvas.height/2- rings[i].radius + rings[i].thickness - 7, i+1, 'black', c);
}


//draws all objects in drawing
bark.draw();
trunk.draw();
for(var i = record.length-1; i>=0; i--)
{
    rings[i].draw();
    labels[i].draw();
}




