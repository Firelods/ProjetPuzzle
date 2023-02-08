console.log("etat du jeu : ");
class Puzzle {
  constructor() {
    this.listPieces = [new Piece(23)];
  }
}

class Piece {
  constructor(id, x, y, width, sprite, topSide, rightSide, bottomSide, leftSide) {
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
    // console.log(sprite);
  }

}


class Game {
  constructor(app) {
    this.app = new PIXI.Application({
      autoResize: true,
      resolution: devicePixelRatio,
      backgroundColor: 0x000000
    });
    console.log(this.app);
    this.DIFFICULTE = 200;

    this.initView();
    this.initPuzzle();
  }

  initView() {

    document.getElementById("parentPuzzle").appendChild(this.app.view);
    // call resize with app as context on resize event
    window.addEventListener('resize', this.resize.bind(this));
    this.resize(this.app);

  }
  resize(app) {
    let parent = document.getElementById("parentPuzzle");
    console.log(this);
    this.app.renderer.resize(parent.clientWidth, parent.clientHeight);
  }
  initPuzzle() {
    let WIDTH = 1400;
    let HEIGHT = 900;

    var nbLignes = Math.floor(WIDTH / this.DIFFICULTE);
    var nbColonnes = Math.floor(HEIGHT / this.DIFFICULTE);
    var puzzle = new Puzzle();

    const container = new PIXI.Container();

    this.app.stage.addChild(container);
    let id = 0;
    var baseTexture = PIXI.BaseTexture.from("1.png");
    for (var i = 0; i < nbColonnes; i++) {
      for (var j = 0; j < nbLignes - 1; j++) {
        var sidePiece = this.getSidePiece(i, j, nbColonnes, nbLignes);
        if (j < nbLignes - 1) {
          var texture = new PIXI.Texture(baseTexture, new PIXI.Rectangle((j * (this.DIFFICULTE)) - 60, (i * (this.DIFFICULTE)) - 60, this.DIFFICULTE + 60, this.DIFFICULTE + 60));
        } else {
          var texture = new PIXI.Texture(baseTexture, new PIXI.Rectangle((j * (this.DIFFICULTE)), (i * (this.DIFFICULTE)) - 60, this.DIFFICULTE / 2, this.DIFFICULTE + 60));
        }
        var sprite2 = new PIXI.Sprite(texture);
        container.addChild(sprite2);
        var graphics = drawPuzzlePiece(sidePiece, 0, 0, 0xffffff, this.DIFFICULTE);
        graphics.zIndex = 10;
        graphics.x = 40;
        graphics.y = 40;
        puzzle.listPieces.push(new Piece(id, j * this.DIFFICULTE, i * this.DIFFICULTE, 200, sprite2, sidePiece[0], sidePiece[1], sidePiece[2], sidePiece[3]));
        sprite2.zIndex = 2;
        sprite2.mask = graphics;
        sprite2.addChild(graphics);
        sprite2.interactive = true;
        sprite2.buttonMode = true;
        sprite2.x = j * this.DIFFICULTE;
        sprite2.y = i * this.DIFFICULTE;
        id++;
      }
    }
    var containerPuzzle = new PIXI.Container();
    var rect = new PIXI.Graphics();
    rect.lineStyle(10, 0xFF0000);
    rect.drawRect(40, 40, WIDTH, HEIGHT - 100);
    rect.endFill();
    containerPuzzle.addChild(rect);
    rect.zIndex = -1;
    containerPuzzle.zIndex = -1;
    containerPuzzle.x = WIDTH;
    containerPuzzle.y = HEIGHT + 100;
    this.app.stage.addChild(containerPuzzle);
    for (var i = 1; i < puzzle.listPieces.length; i++) {
      var randomX = Math.floor(Math.random() * WIDTH / this.DIFFICULTE) * this.DIFFICULTE;
      var randomY = Math.floor(Math.random() * HEIGHT / this.DIFFICULTE) * this.DIFFICULTE;
      puzzle.listPieces[i].sprite.x = randomX;
      puzzle.listPieces[i].sprite.y = randomY;
    }
    for (var i = 1; i < puzzle.listPieces.length; i++) {
      // console.log(puzzle.listPieces[i].sprite);
      let id = i;
      // call onDragStart giving the app as context
      puzzle.listPieces[id].sprite.on('pointerdown', this.onDragStart.bind(event, this.app, puzzle.listPieces[id].sprite, this.DIFFICULTE));

      puzzle.listPieces[id].sprite.on('pointerup', () => {
        this.onDragEnd.call(puzzle.listPieces[id].sprite);
        puzzle.listPieces[id].x = puzzle.listPieces[id].sprite.x - WIDTH;
        puzzle.listPieces[id].y = puzzle.listPieces[id].sprite.y - HEIGHT - 100;
        this.emitMovePiece(puzzle.listPieces[id]);
      });
      // puzzle.listPieces[id].sprite.on('pointerupoutside', onDragEnd);
      puzzle.listPieces[id].sprite.on('pointermove', this.onDragMove);
    }
  }
  // var rectSprite = PIXI.Sprite.from('https://i.ibb.co/2g2FpQr/sample.png');
  // rectSprite.x = app.screen.width - rectSprite.width + 200;
  // rectSprite.y = app.screen.height - rectSprite.height - 600;
  // console.log(rectSprite.getGlobalPosition());
  // app.stage.addChild(rectSprite);
  // rectSprite.interactive = true;
  // rectSprite.buttonMode = true;
  // rectSprite.on('pointerdown', onClick);
  // app.stage.scale.x = 0.5;
  // app.stage.scale.y = 0.5;

  randomize() {
    for (var i = 1; i < puzzle.listPieces.length; i++) {
      var randomX = Math.floor(Math.random() * WIDTH / this.DIFFICULTE) * this.DIFFICULTE;
      var randomY = Math.floor(Math.random() * HEIGHT / this.DIFFICULTE) * this.DIFFICULTE;
      puzzle.listPieces[i].sprite.x = randomX;
      puzzle.listPieces[i].sprite.y = randomY;
    }
  }
  // randomize();
  zoom(s, x, y) {

    s = s > 0 ? 2 : 0.5;
    var worldPos = {
      x: (x - this.app.stage.x) / this.app.stage.scale.x,
      y: (y - this.app.stage.y) / this.app.stage.scale.y
    };
    var newScale = {
      x: this.app.stage.scale.x * s,
      y: this.app.stage.scale.y * s
    };

    var newScreenPos = {
      x: (worldPos.x) * newScale.x + this.app.stage.x,
      y: (worldPos.y) * newScale.y + this.app.stage.y
    };

    this.app.stage.x -= (newScreenPos.x - x);
    this.app.stage.y -= (newScreenPos.y - y);
    this.app.stage.scale.x = newScale.x;
    this.app.stage.scale.y = newScale.y;
  };




  emitMovePiece(piece) {
    console.log(piece);
    socket.emit('movePiece', {
      id: piece.id,
      x: piece.x,
      y: piece.y
    });
  }

  onDragStart(app, sprite, DIFFICULTE, event) {
    //! Ici, on met dans le sprite les données de l'event, pour pouvoir les récupérer dans onDragEnd et utiliser l'app dans onDragMove
    sprite.event = event;
    sprite.data = event.data;
    sprite.alpha = 0.9;
    sprite.dragging = true;
    sprite.app = app;
    sprite.DIFFICULTE = DIFFICULTE;
  }

  onDragEnd(sprite, event) {
    console.log(this.alpha);
    this.alpha = 1;
    this.dragging = false;
    this.zIndex = 1;
    if (this.data != null) {
      this.x = (Math.floor((this.x - 10) / this.DIFFICULTE) + 1) * this.DIFFICULTE;
      this.y = (Math.floor((this.y - 10) / this.DIFFICULTE) + 1) * this.DIFFICULTE;
    }
    this.data = null;

  }

  onDragMove() {
    if (this.dragging) {
      var x = this.event.data.global.x - this.event.target.width / (2 / this.app.stage.scale.x); //! On fait attention à la taille de l'image, qui est divisée par le scale de l'app
      var y = this.event.data.global.y - this.event.target.height / (2 / this.app.stage.scale.y);
      var point = new PIXI.Point(x, y);
      this.position = this.parent.toLocal(point);

      this.zIndex = 10000;
      this.parent.children.sort((a, b) => a.zIndex - b.zIndex); //! On trie les enfants du parent pour que le sprite soit au dessus des autres
    }
  }


  getSidePiece(i, j, nbColonnes, nbLignes) {
    var sidePiece = [];
    if (j == 0) {
      if (i == 0) {
        sidePiece = [0, 1, 1, 0];
      } else if (i == nbColonnes - 1) {
        sidePiece = [1, 1, 0, 0];
      } else {
        sidePiece = [1, 1, 1, 0];
      }
    } else if (j == nbLignes - 1 - 1) {
      if (i == 0) {
        sidePiece = [0, 0, 1, 1];
      } else if (i == nbColonnes - 1) {
        sidePiece = [1, 0, 0, 1];
      } else {
        sidePiece = [1, 0, 1, 1];
      }
    } else {
      if (i == 0) {
        sidePiece = [0, 1, 1, 1];
      } else if (i == nbColonnes - 1) {
        sidePiece = [1, 1, 0, 1];
      } else {
        sidePiece = [1, 1, 1, 1];
      }
    }
    return sidePiece;
  }









  // function onClick() {
  //   testWin();
  //   console.log("test");
  // }



  reverseCoords(coord1, signX, signY, X, Y, width) {
    let coord = [];

    if (coord1 == "hori") {
      coord = [{
        cx1: 0,
        cy1: 0,
        cx2: 35,
        cy2: 15,
        ex: 37,
        ey: 5
      },
      {
        cx1: 37,
        cy1: 5,
        cx2: 40,
        cy2: 0,
        ex: 38,
        ey: -5
      },
      {
        cx1: 38,
        cy1: -5,
        cx2: 20,
        cy2: -20,
        ex: 50,
        ey: -20
      },
      {
        cx1: 50,
        cy1: -20,
        cx2: 80,
        cy2: -20,
        ex: 62,
        ey: -5
      },
      {
        cx1: 62,
        cy1: -5,
        cx2: 60,
        cy2: 0,
        ex: 63,
        ey: 5
      },
      {
        cx1: 63,
        cy1: 5,
        cx2: 65,
        cy2: 15,
        ex: 100,
        ey: 0
      },
      ];
      // console.log(coord);
    } else if (coord1 == "vert") {
      coord = [{
        cx1: 0,
        cy1: 0,
        cx2: 15,
        cy2: 35,
        ex: 5,
        ey: 37
      }, // left shoulder
      {
        cx1: 5,
        cy1: 37,
        cx2: 0,
        cy2: 40,
        ex: -5,
        ey: 38
      }, // left neck
      {
        cx1: -5,
        cy1: 38,
        cx2: -20,
        cy2: 20,
        ex: -20,
        ey: 50
      }, // left head
      {
        cx1: -20,
        cy1: 50,
        cx2: -20,
        cy2: 80,
        ex: -5,
        ey: 62
      }, // right head
      {
        cx1: -5,
        cy1: 62,
        cx2: 0,
        cy2: 60,
        ex: 5,
        ey: 63
      }, // right neck
      {
        cx1: 5,
        cy1: 63,
        cx2: 15,
        cy2: 65,
        ex: 0,
        ey: 100
      }, // right shoulder
      ];
    }



    var oldCoord = [];
    for (var i = 0; i < coord.length; i++) {
      oldCoord.push(coord[i]);
    }
    for (var i = 0; i < oldCoord.length; i++) {
      oldCoord[i].cx1 = (oldCoord[i].cx1 * width / 100) * signX + X;
      oldCoord[i].cy1 = (oldCoord[i].cy1 * width / 100) * signY + Y;
      oldCoord[i].cx2 = (oldCoord[i].cx2 * width / 100) * signX + X;
      oldCoord[i].cy2 = (oldCoord[i].cy2 * width / 100) * signY + Y;
      oldCoord[i].ex = (oldCoord[i].ex * width / 100) * signX + X;
      oldCoord[i].ey = (oldCoord[i].ey * width / 100) * signY + Y;
    }
    return oldCoord;
  }
  // PIXI.GRAPHICS_CURVES.minSegments = 50;

  drawPuzzlePiece(matrixPiece, x, y, beginFill, width) {
    //! matrixPiece = [top,right,bottom,left]

    let graphics = new PIXI.Graphics();
    // app.stage.addChild(graphics);
    graphics.lineStyle(4, 0xffffff);
    graphics.beginFill(beginFill);
    graphics.moveTo(x, y);
    if (matrixPiece[0] == 0) {
      graphics.lineTo(x + width, y + 0);
    } else {
      var coordTop = reverseCoords("hori", 1, 1, x, y, width);
      for (var i = 0; i < coordTop.length; i++) {
        var b = coordTop[i];
        graphics.bezierCurveTo(b.cx1, b.cy1, b.cx2, b.cy2, b.ex, b.ey);
      }
    }
    if (matrixPiece[1] == 0) {
      graphics.lineTo(x + width, y + width);
    } else {
      var coordRight = reverseCoords("vert", 1, 1, x + width, y, width);
      for (var i = 0; i < coordRight.length; i++) {
        var b = coordRight[i];
        graphics.bezierCurveTo(b.cx1, b.cy1, b.cx2, b.cy2, b.ex, b.ey);
      }
      // reverseCoords(curvyCoordsVert,Math.ceil(Math.random() * 1) * (Math.round(Math.random()) ? 1 : -1),1,0,0);
    }
    if (matrixPiece[2] == 0) {
      graphics.lineTo(x + 0, y + width);
    } else {
      // graphics.lineStyle(2, 0xddddd);
      var coordBottom = reverseCoords("hori", 1, 1, x, y + width, width);
      for (var i = coordBottom.length - 1; i >= 0; i--) {
        var b = coordBottom[i];
        graphics.bezierCurveTo(b.ex, b.ey, b.cx2, b.cy2, b.cx1, b.cy1);
      }
    }
    if (matrixPiece[3] == 0) {
      graphics.lineTo(x + 0, y + 0);
    } else {
      var coordLeft = reverseCoords("vert", 1, 1, x, y, width);
      for (var i = coordLeft.length - 1; i >= 0; i--) {
        var b = coordLeft[i];
        graphics.bezierCurveTo(b.ex, b.ey, b.cx2, b.cy2, b.cx1, b.cy1);
      }
    }
    graphics.endFill();
    return graphics;
  }
  //! matrixPiece = [top,right,bottom,left]

}



var game = new Game();
var lastPos = null;

$(document.getElementsByTagName("canvas")[0])
  .mousewheel(function (e) {
    console.log(e.deltaY);
    game.zoom(e.deltaY, e.offsetX, e.offsetY)
  }).mousedown(function (e) {
    game.app.renderer.backgroundColor = getColor();
    console.log(e.button);
    if (e.button == 1) {
      lastPos = {
        x: e.offsetX,
        y: e.offsetY
      };
    }
  }).mouseup(function (e) {
    if (e.button == 1) {
      console.log("test");
      lastPos = null;
    }
  }).mousemove(function (e) {

    if (e.button == 0) {
      if (lastPos) {
        game.app.stage.x += (e.offsetX - lastPos.x);
        game.app.stage.y += (e.offsetY - lastPos.y);
        lastPos = {
          x: e.offsetX,
          y: e.offsetY
        };
      }
    }
  });