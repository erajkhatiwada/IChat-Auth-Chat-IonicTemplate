import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { ChatMessage } from '../../data/Message';
import { map } from 'rxjs/operators';
import { AuthProvider } from '../../providers/auth/auth';
import { UserClass } from '../../data/User';


@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild(Content) content: Content;
  user:any;
  message:any;
  messages: ChatMessage[];
  loggedUser:any;
  loggedUserDetails:UserClass;
  
  constructor(public navCtrl: NavController,
    public authProvider:AuthProvider,
    public navParams: NavParams,
    public firebaseProvider: FirebaseProvider) {}

  async ionViewDidLoad() {
    await this.getUserUsingAuthState();
    this.firebaseProvider.getChatMessages()
      .pipe(map(item => item
        .map(newItem => new ChatMessage(newItem["username"], newItem["message"], newItem["timestamp"]))))
      .subscribe( async res => {
        this.messages = await res;
        setTimeout(() => {
          this.scrollToBottom();
        }, 300);
      });
  }

  sendMessage(){
    if(this.message === ''){
    }else{
      let user = {
        username: this.user,
        message: this.message,
        timestamp: new Date().getTime()
      }
      this.firebaseProvider.pushMessages(user).then(res => {
        this.message = '';
        this.scrollToBottom();
      });
    }
  }

  scrollToBottom(){
    if(this.content.isScrolling == false){
      this.content.scrollToBottom();
    }
  }

  async getUserUsingAuthState(){
    this.authProvider.getLoggedInUser().onAuthStateChanged(res => {
        this.loggedUser = this.authProvider.getCurrentUser();
        if(this.loggedUser){
          this.user = this.loggedUser.email;
          this.loggedUserDetails = {
            email : this.loggedUser.email,
            displayName : this.loggedUser.displayName,
            photoURL: this.loggedUser.photoURL
          }
        }
    });
  }
}
