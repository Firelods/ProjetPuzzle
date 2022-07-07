
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

let WIDTH=1300;
let HEIGHT=900;
let DIFFICULTE=200;

var nbLignes = Math.floor(WIDTH/DIFFICULTE);
var nbColonnes = Math.floor(HEIGHT/DIFFICULTE);
// TODO Finir le projet
let sprite=PIXI.Sprite.from("1.png");
console.log(sprite.getGlobalPosition());
var puzzle=new Puzzle();
var id=0;
const container = new PIXI.Container();
container.x=WIDTH;
container.y=800;
app.stage.addChild(container);
// var nbLignes = 2 
var baseTexture=new PIXI.BaseTexture.from("1.png");
var texture=new PIXI.Texture(baseTexture);
var sprite2=new PIXI.Sprite(texture);

for (var i=0; i<nbColonnes; i++){
    for (var j=0; j<nbLignes; j++){
      app.stage.addChild(sprite2);
      var sidePiece=[];
      if(j==0){
        console.log(id);
        if(i==0){
          sidePiece=[0,1,1,0];
        }
        else if(i==nbColonnes-1){
          sidePiece=[1,1,0,0];
        }
        else{
          sidePiece=[1,1,1,0];
          
        }
      }
      else if(j==nbLignes-1){
        if(i==0){
          sidePiece=[0,0,1,1];
        }
        else if(i==nbColonnes-1){
          sidePiece=[1,0,0,1];
          console.log("test",id);
        }
        else{
          sidePiece=[1,0,1,1];
        }
      }
      else{
        if(i==0){
          sidePiece=[0,1,1,1];
        }
        else if(i==nbColonnes-1){
          sidePiece=[1,1,0,1];
        }
        else{
          sidePiece=[1,1,1,1];
        }
      }
      console.log(sidePiece);
      var graphics=drawPuzzlePiece(sidePiece,j*DIFFICULTE,i*DIFFICULTE,0xffffff,200);
      graphics.x=j*DIFFICULTE-200;
      graphics.y=i*DIFFICULTE;
      console.log(graphics);
      sprite2.mask=graphics;
      app.stage.addChild(graphics);
      sprite2.texture.frame.x=j*DIFFICULTE;
      sprite2.texture.frame.y=i*DIFFICULTE;
    }
  }
  
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
    if(lastPos) {
      
      app.stage.x += (e.offsetX-lastPos.x);
      app.stage.y += (e.offsetY-lastPos.y);  
      lastPos = {x:e.offsetX,y:e.offsetY};
    }
    
  });

