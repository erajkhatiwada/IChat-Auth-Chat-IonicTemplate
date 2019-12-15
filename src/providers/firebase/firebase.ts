import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database'

@Injectable()
export class FirebaseProvider {

  url = 'appdata/IChat';
  constructor(public http: HttpClient, 
    public firebaseDatabase:AngularFireDatabase) {
  }

  getChatMessages(){
    return this.firebaseDatabase.list(this.url).valueChanges();
  }

  pushMessages(message){
    let myRef = this.firebaseDatabase.database.ref(this.url).push();
    let key = myRef.key;
    message.key = key; //to make every message unique
    return this.firebaseDatabase.database.ref(this.url).push(message,(error)=>{});
  }
}
