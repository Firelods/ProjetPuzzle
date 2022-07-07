
/*
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
// app.stage.addChild(sprite2);


*/
function reverseCoords(coord1, signX, signY, X, Y,width) {
    let coord=[];
    
    if(coord1=="hori"){
        coord=[
            {cx1:0,  cy1:0,  cx2:35,cy2:15, ex:37, ey:5},   
            {cx1:37, cy1:5,  cx2:40,cy2:0,  ex:38, ey:-5},  
            {cx1:38, cy1:-5, cx2:20,cy2:-20,ex:50, ey:-20}, 
            {cx1:50, cy1:-20,cx2:80,cy2:-20,ex:62, ey:-5},  
            {cx1:62, cy1:-5, cx2:60,cy2:0,  ex:63, ey:5},   
            {cx1:63, cy1:5,  cx2:65,cy2:15, ex:100,ey:0},   
        ];
        // console.log(coord);
    }
    else if(coord1=="vert"){
        coord=[
            {cx1:0,  cy1:0,  cx2:15,cy2:35, ex:5,  ey:37},   // left shoulder
            {cx1:5,  cy1:37, cx2:0, cy2:40, ex:-5, ey:38},  // left neck
            {cx1:-5, cy1:38, cx2:-20,cy2:20,ex:-20, ey:50}, // left head
            {cx1:-20,cy1:50, cx2:-20,cy2:80,ex:-5,  ey:62}, // right head
            {cx1:-5, cy1:62, cx2:0, cy2:60, ex:5,  ey:63},  // right neck
            {cx1:5,  cy1:63, cx2:15,cy2:65,ex:0,   ey:100}, // right shoulder
            ];
        }
    
    
    
    var oldCoord = [];
    for (var i = 0; i < coord.length; i++) {
        oldCoord.push(coord[i]);
    }
    for (var i = 0; i < oldCoord.length; i++) {
        oldCoord[i].cx1 = (oldCoord[i].cx1 * width/100) * signX + X;
        oldCoord[i].cy1 = (oldCoord[i].cy1 * width/100) * signY + Y;
        oldCoord[i].cx2 = (oldCoord[i].cx2 * width/100) * signX + X;
        oldCoord[i].cy2 = (oldCoord[i].cy2 * width/100) * signY + Y;
        oldCoord[i].ex = (oldCoord[i].ex* width/100 )* signX + X;
        oldCoord[i].ey = (oldCoord[i].ey* width/100) * signY + Y;
    }
    return oldCoord;
}
PIXI.GRAPHICS_CURVES.minSegments = 50;

/*
for (var i = 0; i < curvyCoordsHori.length; i++) {
    var b=curvyCoordsHori[i];
    graphics.bezierCurveTo(b.cx1,b.cy1,b.cx2,b.cy2,b.ex,b.ey);
}*/

// graphics.endFill();
/*
for (var i = 0; i < curvyCoordsVert.length; i++) {
    var b=curvyCoordsVert[i];
    graphics.bezierCurveTo(b.cx1,b.cy1,b.cx2,b.cy2,b.ex,b.ey);
}*/



// graphics.moveTo(250,50);
// sprite2.mask=graphics;

function drawPuzzlePiece(matrixPiece, x, y, beginFill,width) {
    //! matrixPiece = [top,right,bottom,left]

    let graphics = new PIXI.Graphics();
    // app.stage.addChild(graphics);
    graphics.lineStyle(4, 0xffffff);
    graphics.beginFill(beginFill);
    graphics.moveTo(x, y);
    if (matrixPiece[0] == 0) {
        graphics.lineTo(x + width, y + 0);
    }
    else {
        var coordTop = reverseCoords("hori", 1, 1, x, y,width);
        for (var i = 0; i < coordTop.length; i++) {
            var b = coordTop[i];
            graphics.bezierCurveTo(b.cx1, b.cy1, b.cx2, b.cy2, b.ex, b.ey);
        }
    }
    if (matrixPiece[1] == 0) {
        graphics.lineTo(x + width, y + width);
    }
    else {
        var coordRight = reverseCoords("vert", 1, 1, x + width, y,width);
        for (var i = 0; i < coordRight.length; i++) {
            var b = coordRight[i];
            graphics.bezierCurveTo(b.cx1, b.cy1, b.cx2, b.cy2, b.ex, b.ey);
        }
        // reverseCoords(curvyCoordsVert,Math.ceil(Math.random() * 1) * (Math.round(Math.random()) ? 1 : -1),1,0,0);
    }
    if (matrixPiece[2] == 0) {
        graphics.lineTo(x + 0, y + width);
    }
    else {
        // graphics.lineStyle(2, 0xddddd);
        var coordBottom = reverseCoords("hori", 1, 1, x, y+width ,width);
        for (var i = coordBottom.length - 1; i >= 0; i--) {
            var b = coordBottom[i];
            graphics.bezierCurveTo(b.ex, b.ey, b.cx2, b.cy2, b.cx1, b.cy1);
        }
    }
    if (matrixPiece[3] == 0) {
        graphics.lineTo(x + 0, y + 0);
    }
    else {
        var coordLeft = reverseCoords("vert", 1, 1, x, y,width);
        for (var i = coordLeft.length - 1; i >= 0; i--) {
            var b = coordLeft[i];
            graphics.bezierCurveTo(b.ex, b.ey, b.cx2, b.cy2, b.cx1, b.cy1);
        }
    }
    graphics.endFill();
    return graphics;
}
//! matrixPiece = [top,right,bottom,left]

var colors = [0xf8fc03, 0xDB3C23, 0x0303fc, 0xf8fc03]
var anyPieces = [[0, 1, 1, 0], [1, 0, 0, 1], [0, 1, 1, 0]];
for (var i = 1; i <= anyPieces.length; i++) {
    var piece = anyPieces[i - 1];
    // app.stage.addChild(drawPuzzlePiece(piece,i*100,i*100,colors[i],50));
}
// app.stage.addChild(drawPuzzlePiece([1,1, 1, 1],200,100,0xffffff,100));
drawPuzzlePiece([1,1,0,0],100,200,0xffffff,50);
// drawPuzzlePiece([1, 0, 0, 1], 300, 300, 0xf8fc03);
// drawPuzzlePiece([1, 0, 0, 1], 400, 400, 0xf8fc03);

/*
app.stage.scale.x = 1;
app.stage.scale.y = 1;
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
// sprite2.mask=mask;*/