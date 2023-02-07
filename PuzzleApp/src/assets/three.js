$(function () {
  boxRollovers();
});

function boxRollovers() {
  $selector = $(".containerIMG");
  XAngle = 0;
  YAngle = 0;
  Z = 25;

  $selector.on("mousemove", function (e) {
    var $this = $(this);
    var XRel = e.pageX - $this.offset().left;
    var YRel = e.pageY - $this.offset().top;
    var width = $this.width();

    YAngle = -(0.5 - (XRel / width)) * 30;
    XAngle = (0.5 - (YRel / width)) * 30;
    updateView($this.children("#piecePuzzle"));
  });

  $selector.on("mouseleave", function () {
    console.log("test");
    oLayer = $(this).children("#piecePuzzle");
    oLayer.css({ "transform": "perspective(525px) translateZ(0) rotateX(0deg) rotateY(0deg)" });
    oLayer.find("strong").css({ "transform": "perspective(525px) translateZ(0) rotateX(0deg) rotateY(0deg)", });
  });
  $selector.on("mouseenter", function () {
    console.log("test");
    oLayer = $(this).children("#piecePuzzle");
    oLayer.css({ "transform": "perspective(525px) translateZ(0) rotateX(0deg) rotateY(0deg)" });
    oLayer.find("strong").css({ "transform": "perspective(525px) translateZ(0) rotateX(0deg) rotateY(0deg)" });
  });
}

function updateView(oLayer) {
  oLayer.css({ "transform": "perspective(525px) translateZ(" + Z + "px) rotateX(" + XAngle + "deg) rotateY(" + YAngle + "deg)" });
  oLayer.find("strong").css({ "transform": "perspective(525px) translateZ(" + Z + "px) rotateX(" + (XAngle / 0.66) + "deg) rotateY(" + (YAngle / 0.66) + "deg)" });
}
