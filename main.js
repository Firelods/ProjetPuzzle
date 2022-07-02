
const app = new PIXI.Application({
	autoResize: true,
  resolution: devicePixelRatio 
});
document.getElementById("parentPuzzle").appendChild(app.view);

// Lets create a red square, this isn't 
// necessary only to show something that can be position
// to the bottom-right corner

// Add it to the stage
// app.stage.addChild(rect);

// Listen for window resize events
window.addEventListener('resize', resize);

// Resize function window
function resize() {
    let parent= document.getElementById("parentPuzzle");
	// Resize the renderer
	app.renderer.resize(parent.clientWidth,parent.clientHeight);
  
  // You can use the 'screen' property as the renderer visible
  // area, this is more useful than view.width/height because
  // it handles resolution
  // rect.position.set(app.screen.width, app.screen.height);
}

resize();

class Puzzle{
  constructor(){
    this.listPieces=[new Piece(24)];
  }
}

class Piece{
  constructor(id,x,y,width,sprite){
      this.id=id;
      this.x=x;
      this.y=y;
      this.originalX=x;
      this.originalY=y;
      this.width=width;
      this.sprite=sprite;
  }
}

let WIDTH=1200;
let HEIGHT=900;
let DIFFICULTE=200;

var nbLignes = Math.floor(WIDTH/DIFFICULTE);
var nbColonnes = Math.floor(HEIGHT/DIFFICULTE);
//TODO : Les event des sprites sont effectifs que sur le dernier 
/**
 * TODO : Setup les event grace a l'objet puzzle + pieces
  
 */
let sprite=PIXI.Sprite.from("1.png");
console.log(sprite.getGlobalPosition());
var puzzle=new Puzzle();
var id=0;
for (var i=0; i<nbColonnes; i++){
    for (var j=0; j<nbLignes; j++){
      console.log(i+" "+j);
      var baseTexture=new PIXI.BaseTexture.from("1.png");
      var texture=new PIXI.Texture(baseTexture,new PIXI.Rectangle(j*DIFFICULTE,i*DIFFICULTE,DIFFICULTE,DIFFICULTE));
      var sprite2=new PIXI.Sprite(texture);
      sprite2.x=j*DIFFICULTE;
      sprite2.y=i*DIFFICULTE;
      sprite2.interactive = true;
      puzzle.listPieces.push(new Piece(id,j*DIFFICULTE,i*DIFFICULTE,DIFFICULTE,sprite2));
      app.stage.addChild(sprite2);
      sprite2.on('pointerdown',onDragStart);
      // sprite2.on('pointerup',onDragEnd);
      sprite2.on('pointerup',event=>{
        onDragEnd.call(sprite2);
        console.log(event);
        puzzle.listPieces[id].x=sprite2.x;
        puzzle.listPieces[id].y=sprite2.y;
        console.log(puzzle.listPieces[id]);
      })
      sprite2.on('pointerupoutside',onDragEnd);
      sprite2.on('pointermove',onDragMove);
      console.log(sprite2.getGlobalPosition());
      const rect = new PIXI.Graphics()
        .lineStyle(5,0xff0000)
        .drawRect(j*DIFFICULTE,i*DIFFICULTE, DIFFICULTE, DIFFICULTE);
      app.stage.addChild(rect);
      id++;
    }
  }
console.log(puzzle.listPieces);
function onDragStart(event){
  this.data = event.data;
  
  this.alpha = 0.5;
  this.dragging = true;
}
function onDragEnd(){
  this.alpha = 1;
  this.dragging = false;
  console.log(this.data);
  if(this.data!=null){
    var newPosition = this.data.getLocalPosition(this.parent);
    this.x = Math.floor(newPosition.x/DIFFICULTE)*DIFFICULTE;
    this.y = Math.floor(newPosition.y/DIFFICULTE)*DIFFICULTE;
  }

  
  // set the interaction data to null
  this.data = null;
}

function onDragMove(){
  if (this.dragging){
    var newPosition = this.data.getLocalPosition(this.parent);
    
    this.x = newPosition.x-100;
    this.y = newPosition.y-100;
  }
}


/*
var rectSprite=PIXI.Sprite.from('sample.png');
rectSprite.x=app.screen.width-rectSprite.width-400;
rectSprite.y=app.screen.height-rectSprite.height-200;
console.log(rectSprite.getGlobalPosition());
app.stage.addChild(rectSprite);
rectSprite.interactive=true;
rectSprite.buttonMode=true;
rectSprite.on('pointerdown',onClick);
*/
function onClick(){
testWin();
console.log("test");
}
function testWin(){
  for (var i=0; i<puzzle.listPieces.length; i++){
    if (puzzle.listPieces[i].x!=puzzle.listPieces[i].originalX || puzzle.listPieces[i].y!=puzzle.listPieces[i].originalY){
      return false;
    }
  }
  return window.alert("Gagné");
}

// var texture=new PIXI.Texture(baseTexture,new PIXI.Rectangle(0,0,DIFFICULTE,DIFFICULTE));
// var sprite2=new PIXI.Sprite.from(texture);
// app.stage.addChild(sprite2);
console.log(sprite2.width);