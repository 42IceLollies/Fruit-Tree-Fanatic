// gets context for drawing on canvas 
var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var root = document.querySelector(':root');

// canvas size is modified in css file but this sets initial size
if (window.innerHeight < window.innerWidth) {
  canvas.height = window.innerHeight;
  canvas.width = window.innerHeight;
} else {
  canvas.height = window.innerWidth;
  canvas.width = window.innerWidth;
  console.log((window.innerHeight - window.innerWidth) / 2);
  root.style.setProperty('--margin-top', (window.innerHeight - window.innerWidth) / 2 + 'px');
  console.log(root.style);
  console.log(canvas.style);
}



// settings for label text
c.font = "16px 'Inter', sans-serif"; 
c.textAlign = 'center';

//------------------Shape Classes------------

//Class for creating circle objects to be drawn in rings and trunk
class Circle {
    constructor(x, y, radius, fillColor, context) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.fillColor = fillColor;
      this.context = context;
    }
  
    //method draws given circle elements
    draw() {
      if (this.fillColor) {
        this.context.fillStyle = this.fillColor;
      }
      this.context.beginPath();
      this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      this.context.fill();
    }
  }


  // creates objects for individual rings of the tree
  class Ring {
    constructor(x, y, radius, thickness, fillColor, context) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.thickness = thickness;
        this.fillColor = fillColor;
        this.context = context;
      }

      //method to draw rings
      draw()
      {
          var tempFill = this.context.fillStyle;
          new Circle(this.x, this.y, this.radius, this.fillColor, this.context).draw();
          new Circle(this.x, this.y, this.radius-this.thickness, tempFill, this.context).draw();
      }
  }




//----------------Drawing Shapes----------
//gets data back from local storage to calculate game acheivments
retrieveData();
console.log(gameData.progressRecord);

// creates all objects used in drawing
var bark = new Ring(canvas.width/2, canvas.height/2, canvas.width/2, 5, "#6a3e2d",c);
var trunk = new Circle(canvas.width/2, canvas.height/2, canvas.width/2-10, "#c4ad8d", c);
var rings = [];

var record = gameData.progressRecord;

for(var i = 0; i < record.length; i++)
{ 
    var percentage = (record[i].fruitYield-record[i].lowFruitYield)/(record[i].highFruitYield-record[i].lowFruitYield);
    var opacity = percentage;
    var weight = percentage*10;
    rings[i] = new Ring(canvas.width/2, canvas.height/2, canvas.width/25 * (i+1), weight, "rgba(106,62,45," + opacity + ")", c);
    document.documentElement.style.setProperty('--label-margin', canvas.width/50 + "px");
    // console.log(document.documentElement.style.getPropertyValue('--label-margin'));
}


// draws all objects in drawing
bark.draw();
trunk.draw();
for(var i = record.length-1; i>=0; i--)
{
    rings[i].draw();
}


// ------------credits------------

function rollCredits() {
  const creditDivs = Array.from(document.querySelectorAll('.creditDiv'));
  const btnDiv = document.getElementById('btnDiv');
  let count = 0;

  creditDivs.forEach(credit => {
    credit.style.top = '100%';
  });
  btnDiv.style.top = '100%';

  // starts the first div up quickly
  setTimeout(() => {
    creditDivs[count].style.top = '-50%';
    count++;
  }, 50);

  const creditIntId = setInterval(() => {
    if (count > creditDivs.length - 1) {
      clearInterval(creditIntId);
      btnDiv.style.top = '45%';
      return;
    }
    creditDivs[count].style.top = '-50%';
    count++;
  }, 3000);
}

rollCredits();