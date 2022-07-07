
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
    this.listPieces=[new Piece(23)];
  }
}

class Piece{
  constructor(id,x,y,width,sprite,topSide,rightSide,bottomSide,leftSide){
      this.id=id;
      this.x=-1;
      this.y=-1;
      this.originalX=x;
      this.originalY=y;
      this.width=width;
      this.sprite=sprite;
      this.leftSide=leftSide;
      this.rightSide=rightSide;
      this.topSide=topSide;
      this.bottomSide=bottomSide;
  }
}

let WIDTH=1300;
let HEIGHT=900;
let DIFFICULTE=100;

var nbLignes = Math.floor(WIDTH/DIFFICULTE);
var nbColonnes = Math.floor(HEIGHT/DIFFICULTE);
// TODO Finir le projet
let sprite=PIXI.Sprite.from("1.png");
console.log(sprite.getGlobalPosition());
var puzzle=new Puzzle();
var id=0;

const container = new PIXI.Container();

app.stage.addChild(container);
// var nbLignes = 2
// var nbColonnes = 2
var baseTexture=new PIXI.BaseTexture.from("1.png");
console.log(nbColonnes);
console.log(nbLignes);
for (var i=0; i<nbColonnes; i++){
    for (var j=0; j<nbLignes-1; j++){
      console.log(i,j);
      var sidePiece = getSidePiece(i,j,nbColonnes,nbLignes);
      if(j<nbLignes-1){
        var texture = new PIXI.Texture(baseTexture, new PIXI.Rectangle((j * (DIFFICULTE))-60, (i * (DIFFICULTE))-60, DIFFICULTE+60, DIFFICULTE+60));
      }
      else{
        console.log("test");
        var texture = new PIXI.Texture(baseTexture, new PIXI.Rectangle((j * (DIFFICULTE)), (i * (DIFFICULTE))-60, DIFFICULTE/2, DIFFICULTE+60));
      }
      var sprite2 = new PIXI.Sprite(texture);
      container.addChild(sprite2);
      
      var graphics = drawPuzzlePiece(sidePiece, 0, 0, 0xffffff, DIFFICULTE);
      graphics.zIndex=10;
      graphics.x = 40;
      graphics.y = 40;
      sprite2.on('pointerdown',onDragStart);
      sprite2.on('pointerup',onDragEnd);
      sprite2.on('pointerupoutside',onDragEnd);
      sprite2.on('pointermove',onDragMove);
      puzzle.listPieces.push(new Piece(id,j,i,200,sprite2,sidePiece[0],sidePiece[1],sidePiece[2],sidePiece[3]));
      // console.log(sprite2);
      sprite2.zIndex =2;
      sprite2.mask = graphics;
      sprite2.addChild(graphics);
      sprite2.interactive = true;

      sprite2.x = j * DIFFICULTE;
      sprite2.y = i * DIFFICULTE;
      id++;
    }
  }

var containerPuzzle = new PIXI.Container();
var rect=new PIXI.Graphics();
rect.lineStyle(2, 0xFF0000);
rect.drawRect(WIDTH+50,HEIGHT+50,WIDTH,HEIGHT);
rect.endFill();
containerPuzzle.addChild(rect);
rect.zIndex = -1;
containerPuzzle.zIndex = -1;
app.stage.addChild(containerPuzzle);



  function randomize(){
    for (var i=1; i<puzzle.listPieces.length; i++){
      var randomX=Math.floor(Math.random()*WIDTH/DIFFICULTE)*DIFFICULTE;
      var randomY=Math.floor(Math.random()*HEIGHT/DIFFICULTE)*DIFFICULTE;
      puzzle.listPieces[i].sprite.x=randomX;
      puzzle.listPieces[i].sprite.y=randomY;
    }
  }
  randomize();
function zoom(s,x,y){

  s = s > 0 ? 2 : 0.5;
  var worldPos = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y};
  var newScale = {x: app.stage.scale.x * s, y: app.stage.scale.y * s};
  
  var newScreenPos = {x: (worldPos.x ) * newScale.x + app.stage.x, y: (worldPos.y) * newScale.y + app.stage.y};

  app.stage.x -= (newScreenPos.x-x) ;
  app.stage.y -= (newScreenPos.y-y) ;
  app.stage.scale.x = newScale.x;
  app.stage.scale.y = newScale.y;
};


var lastPos = null
$(document.getElementsByTagName("canvas")[0])
  .mousewheel(function(e){
  zoom(e.deltaY, e.offsetX, e.offsetY)
}).mousedown(function(e) {
  lastPos = {x:e.offsetX,y:e.offsetY};
}).mouseup(function(event) {
  lastPos = null;
}).mousemove(function(e){
  
  /*if(lastPos) {
    
    app.stage.x += (e.offsetX-lastPos.x);
    app.stage.y += (e.offsetY-lastPos.y);  
    lastPos = {x:e.offsetX,y:e.offsetY};
  }
  */
});

function onDragStart(event){
  this.data = event.data;
  
  this.alpha = 0.9;
  this.dragging = true;
}
function onDragEnd(){
  this.alpha = 1;
  this.dragging = false;
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


function getSidePiece(i,j,nbColonnes,nbLignes){
  var sidePiece = [];
  if (j == 0) {
    if (i == 0) {
      sidePiece = [0, 1, 1, 0];
    }
    else if (i == nbColonnes - 1) {
      sidePiece = [1, 1, 0, 0];
    }
    else {
      sidePiece = [1, 1, 1, 0];

    }
  }
  else if (j == nbLignes-1 - 1) {
    if (i == 0) {
      sidePiece = [0, 0, 1, 1];
    }
    else if (i == nbColonnes - 1) {
      sidePiece = [1, 0, 0, 1];
    }
    else {
      sidePiece = [1, 0, 1, 1];
    }
  }
  else {
    if (i == 0) {
      sidePiece = [0, 1, 1, 1];
    }
    else if (i == nbColonnes - 1) {
      sidePiece = [1, 1, 0, 1];
    }
    else {
      sidePiece = [1, 1, 1, 1];
    }
  }
  return sidePiece;
}



/*
  console.log(puzzle.listPieces[1].x);




for (var i=1; i<puzzle.listPieces.length; i++){
  // console.log(puzzle.listPieces[i].sprite);
  let id=i;
  puzzle.listPieces[id].sprite.on('pointerdown',onDragStart);
  puzzle.listPieces[id].sprite.on('pointerup',()=>{
    onDragEnd.call(puzzle.listPieces[id].sprite);
    // console.log(event);
    //FIXME Propreté
    // console.log(puzzle.listPieces[id]);
    // console.log(id);
    // console.log(puzzle.listPieces[id].x);
    console.log(puzzle.listPieces[id].sprite.getGlobalPosition().x);
    puzzle.listPieces[id].x=puzzle.listPieces[id].sprite.getGlobalPosition().x*2;
    puzzle.listPieces[id].y=puzzle.listPieces[id].sprite.getGlobalPosition().y*2;
    console.log("Déplacé");
    console.log(puzzle.listPieces[id]);
  });
  puzzle.listPieces[id].sprite.on('pointerupoutside',onDragEnd);
  puzzle.listPieces[id].sprite.on('pointermove',onDragMove);
  // console.log(i);
} 
// randomize();







*/
// var rectSprite=PIXI.Sprite.from('sample.png');
// rectSprite.x=app.screen.width-rectSprite.width-400;
// rectSprite.y=app.screen.height-rectSprite.height-200;
// console.log(rectSprite.getGlobalPosition());
// app.stage.addChild(rectSprite);
// rectSprite.interactive=true;
// rectSprite.buttonMode=true;
// rectSprite.on('pointerdown',onClick);

function onClick(){
  testWin();
  console.log("test");
}

function testWin(){
  var pieceOK=0;
  for (var i=1; i<puzzle.listPieces.length; i++){
    if (puzzle.listPieces[i].x==puzzle.listPieces[i].originalX && puzzle.listPieces[i].y==puzzle.listPieces[i].originalY){
      pieceOK++;
      console.log(puzzle.listPieces[i]);
    }
  }
  console.log("pieceOK = " + pieceOK);
  if (pieceOK==puzzle.listPieces.length-1){
    console.log("Gagné");
  }
}

// var texture=new PIXI.Texture(baseTexture,new PIXI.Rectangle(0,0,DIFFICULTE,DIFFICULTE));
// var sprite2=new PIXI.Sprite.from(texture);
// app.stage.addChild(sprite2);
// console.log(sprite2.width);

app.stage.scale.x=1;
app.stage.scale.y=1;