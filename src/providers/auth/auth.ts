import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';

@Injectable()
export class AuthProvider {
  constructor(public http: HttpClient, public firebaseAuth:AngularFireAuth) {
  }

  getLoggedInUser(){
    return this.firebaseAuth.auth;
  }

  getCurrentUser(){
    return this.firebaseAuth.auth.currentUser;
  }

  loginUsingEmailAndPassword(email:string,password:string){
    return this.firebaseAuth.auth.signInWithEmailAndPassword(email,password);
  }

  signUpUsingEmailAndPassword(email:string,password:string){
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(email,password);
  }

  logout(){
    return this.firebaseAuth.auth.signOut();
  }

  sendPasswordChangeEmail(email){
    return this.firebaseAuth.auth.sendPasswordResetEmail(email);
  }

}
