class Puzzle{
    constructor(DIFFICULTE){
        this.imgPuzzle=document.getElementById("i");
        this.widthImg=this.imgPuzzle.naturalWidth;
        this.heightImg=this.imgPuzzle.naturalHeight;
        this.DIFFICULTE=DIFFICULTE;
        this.nbLignes=Math.floor(this.heightImg/this.DIFFICULTE);
        this.nbColonnes=Math.floor(this.widthImg/this.DIFFICULTE);
        this.grille = new Array(this.nbLignes);
        this.DIFFICULTE = DIFFICULTE;
    }
    decoupagePuzzle(){
        var id=0;
        for (var i=0; i<this.nbLignes; i++){
            this.grille[i]=new Array(this.nbColonnes);
            for (var j=0; j<this.nbColonnes; j++){
                var div=document.createElement("div");
                div.className="puzzlePiece";
                div.draggable=true; 
                div.style.border="1px solid black";
                div.style.width=this.DIFFICULTE+"px";
                div.style.height=this.DIFFICULTE+"px";
                div.style.left=j*this.DIFFICULTE+"px";
                div.style.top=i*this.DIFFICULTE+"px";
                div.style.backgroundImage="url('"+this.imgPuzzle.src+"')";
                div.style.backgroundPosition=(-j*this.DIFFICULTE)+"px "+(-i*this.DIFFICULTE)+"px";
                div.style.backgroundSize=this.widthImg+"px "+this.heightImg+"px";
                var added=document.getElementById("puzzle")
                added.appendChild(div);
                this.grille[i][j]=[div,new Piece(id,i,j,this.DIFFICULTE)];
                id++;
            }
        }
        console.log(this.grille);
    }
    genererEmplacement(){
        var emplacement=new Array(this.nbLignes);
        for (var i=0; i<this.nbLignes; i++){
            emplacement[i]=new Array(this.nbColonnes);
            for (var j=0; j<this.nbColonnes; j++){
                emplacement[i][j]=this.grille[i][j][1];
                var div=this.grille[i][j][0].cloneNode(true);
                div.className="puzzleEmplacement";
                div.style.backgroundImage="";
                div.style.backgroundPosition="";
                div.style.backgroundSize="";
                document.getElementById("puzzleSolver").appendChild(div);
            }
        }
        
    }
}




class Piece{
    constructor(id,x,y,width){
        this.id=id;
        this.x=x;
        this.y=y;
        this.width=width;
    }
}

function randomize(){
    var pieces=document.getElementsByClassName("puzzlePiece");
    var listPos=new Array();
    for (var i=0; i<pieces.length; i++){
        listPos.push([pieces[i].style.top,pieces[i].style.left]);
    }
    for (var i=0; i<pieces.length; i++){
        var random=Math.floor(Math.random()*listPos.length);
        pieces[i].style.top=listPos[random][0];
        pieces[i].style.left=listPos[random][1];
        listPos.splice(random,1);
    }
    console.log(listPos);
}

function testPouvoirPoser(){
    
}