import { Component, OnInit } from '@angular/core';
declare function startGame():void;
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  elem: any;
  
  myScriptElement:HTMLScriptElement | undefined;
  constructor() { 
    this.elem =document.createElement('div'); 
    this.elem.id="parentPuzzle";
    document.body.appendChild(this.elem);
    
    
    console.log(document.getElementById("parentPuzzle"));
    
    // this.myScriptElement = document.createElement('script');
    // this.myScriptElement.src = './assets/main.js';
    // document.body.appendChild(this.myScriptElement);
    startGame();
  }
    
  ngOnInit(): void {
    
  }
  ngOnDestroy(): void { 
    document.body.removeChild(this.elem);
  }
  
}
