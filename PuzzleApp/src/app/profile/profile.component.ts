import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(public loginService: LoginService) { }

  ngOnInit(): void {
  }
  getNbPuzzles(): number {
    return 1; //TODO Nombre depuis la mongodb
    }

}
