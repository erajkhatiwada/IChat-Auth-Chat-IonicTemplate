import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class StorageProvider {

  constructor(public http: HttpClient) {
  }

  uploadFiles(event,email){
    let push = firebase.database().ref('appdata/IChat').push();
    let key = push.key;
    return firebase.storage().ref(email+'/ChatStorage/'+key).put(event.target.files[0]);
  }  

}
