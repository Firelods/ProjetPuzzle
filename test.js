const app = new PIXI.Application({
    autoResize: true,
    resolution: devicePixelRatio
});
document.getElementById("parentPuzzle").appendChild(app.view);
window.addEventListener('resize', resize);

// Resize function window
function resize() {
    let parent = document.getElementById("parentPuzzle");
    // Resize the renderer
    app.renderer.resize(parent.clientWidth, parent.clientHeight);

    // You can use the 'screen' property as the renderer visible
    // area, this is more useful than view.width/height because
    // it handles resolution
    // rect.position.set(app.screen.width, app.screen.height);
}

resize();

let DIFFICULTE = 120;

class Piece {
    constructor(id, x, y, width, sprite, leftSide, rightSide, topSide, bottomSide) {
        this.id = id;
        this.x = -1;
        this.y = -1;
        this.originalX = x;
        this.originalY = y;
        this.width = width;
        this.sprite = sprite;
        this.leftSide = leftSide;
        this.rightSide = rightSide;
        this.topSide = topSide;
        this.bottomSide = bottomSide;
    }
}

var baseTexture = new PIXI.BaseTexture.from("1.png");
// console.log(i+" "+j);
var texture = new PIXI.Texture(baseTexture, new PIXI.Rectangle(10, 10, DIFFICULTE, DIFFICULTE));
var sprite2 = new PIXI.Sprite(texture);
sprite2.x = 50;
sprite2.y = 50;
sprite2.interactive = true;
var piece = new Piece(1, 10, 10, DIFFICULTE, sprite2, 0, 0, 0, -1);
app.stage.addChild(sprite2);

var colors=['red','green','blue','gold','purple','cyan'];
var curvyCoordsHori=([
    {cx1:0,  cy1:0,  cx2:35,cy2:15, ex:37, ey:5},   
    {cx1:37, cy1:5,  cx2:40,cy2:0,  ex:38, ey:-5},  
    {cx1:38, cy1:-5, cx2:20,cy2:-20,ex:50, ey:-20}, 
    {cx1:50, cy1:-20,cx2:80,cy2:-20,ex:62, ey:-5},  
    {cx1:62, cy1:-5, cx2:60,cy2:0,  ex:63, ey:5},   
    {cx1:63, cy1:5,  cx2:65,cy2:15, ex:100,ey:0},   
  ]);



    var curvyCoordsVert=([
    {cx1:0,  cy1:0,  cx2:15,cy2:35, ex:5,  ey:37},   // left shoulder
    {cx1:5,  cy1:37, cx2:0, cy2:40, ex:-5, ey:38},  // left neck
    {cx1:-5, cy1:38, cx2:-20,cy2:20,ex:-20, ey:50}, // left head
    {cx1:-20,cy1:50, cx2:-20,cy2:80,ex:-5,  ey:62}, // right head
    {cx1:-5, cy1:62, cx2:0, cy2:60, ex:5,  ey:63},  // right neck
    {cx1:5,  cy1:63, cx2:15,cy2:65,ex:0,   ey:100}, // right shoulder
    ]);

function reverseCoords(coord,signX,signY,X,Y){
    for (var i=0; i<coord.length;i++){
        coord[i].cx1=coord[i].cx1*signX+X;
        coord[i].cy1=coord[i].cy1*signY+Y;
        coord[i].cx2=coord[i].cx2*signX+X;
        coord[i].cy2=coord[i].cy2*signY+Y;
        coord[i].ex=coord[i].ex*signX+X;
        coord[i].ey=coord[i].ey*signY+Y;
    }
}
PIXI.GRAPHICS_CURVES.minSegments = 50;
var graphics = new PIXI.Graphics();
graphics.lineStyle(2,0xDB3C23);
graphics.beginFill(0x000000);
graphics.moveTo(50,50);
// app.stage.addChild(graphics);
graphics.lineTo(150,50);
reverseCoords(curvyCoordsVert,1,1,100,0);
graphics.moveTo(150,50);
for (var i = 0; i < curvyCoordsVert.length; i++) {
    var b=curvyCoordsVert[i];
    graphics.bezierCurveTo(50+b.cx1,50+b.cy1,50+b.cx2,50+b.cy2,50+b.ex,50+b.ey);
}

/*
for (var i = 0; i < curvyCoordsHori.length; i++) {
    var b=curvyCoordsHori[i];
    graphics.bezierCurveTo(50+b.cx1,50+b.cy1,50+b.cx2,50+b.cy2,50+b.ex,50+b.ey);
}*/

// graphics.endFill();
/*
for (var i = 0; i < curvyCoordsVert.length; i++) {
    var b=curvyCoordsVert[i];
    graphics.bezierCurveTo(50+b.cx1,50+b.cy1,50+b.cx2,50+b.cy2,50+b.ex,50+b.ey);
}*/


reverseCoords(curvyCoordsHori,1,1,0,100);
// graphics.moveTo(50,150);
for (var i = curvyCoordsHori.length-1; i >=0 ; i--) {
    var b=curvyCoordsHori[i];
    graphics.bezierCurveTo(50+b.ex,50+b.ey,50+b.cx2,50+b.cy2,50+b.cx1,50+b.cy1);
}

graphics.lineTo(50,50);
graphics.endFill();
// graphics.moveTo(250,50);
sprite2.mask=graphics;

app.stage.scale.x=1;
app.stage.scale.y=1;
var parasiteFix = new PIXI.Filter(null, `
varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void)
{
    vec4 color = texture2D(uSampler, vTextureCoord);
    if (color.a >= 0.5 && color.a < 1.0) {
        color *= 1.0 / color.a;
    }
    gl_FragColor = color;
}
`);

app.stage.filters = [parasiteFix];
// mask.bezierCurveTo(p1, p2, p3);
// sprite2.mask=mask;