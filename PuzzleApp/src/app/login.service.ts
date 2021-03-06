import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loggedIn: boolean = false;

  constructor() { }
  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin') {
      this.loggedIn = true;
      const item={
        value:username,
        expiry: new Date().getTime()+100000,
      }
      localStorage.setItem('user', JSON.stringify(item));
      return true;
    } else {
      return false;
    }
  }
  getUsername(): string|null {
    const itemString = localStorage.getItem('user');
    if (new Date().getTime() > (JSON.parse(itemString||'{}')).expiry) {
      localStorage.removeItem('user');
      return null;
    }
    return JSON.parse(localStorage.getItem('user')||'{}').value||'';
  }
}
