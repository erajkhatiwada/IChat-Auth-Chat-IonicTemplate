import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database'

@Injectable()
export class FirebaseProvider {

  url = 'appdata/SRDChat';
  constructor(public http: HttpClient, 
    public firebaseDatabase:AngularFireDatabase) {
  }

  getChatMessages(){
    return this.firebaseDatabase.list(this.url).valueChanges();
  }

  pushMessages(chatRoom){
    return this.firebaseDatabase.database.ref(this.url).push(chatRoom,(error)=>{});
  }
}
