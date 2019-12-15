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
        .map(newItem => new ChatMessage(newItem["username"], newItem["message"], newItem["timestamp"], newItem["key"]))))
      .subscribe( async res => {
        this.messages = await res;
        setTimeout(() => {
          this.scrollToBottom();
        }, 300);
      });
  }

  sendMessage() {
    if (this.message != undefined) {
      if (this.message.trim() != '') {
        let userMessage = {
          username: this.user,
          message: this.message.trim(),
          timestamp: new Date().getTime()
        }
        this.firebaseProvider.pushMessages(userMessage).then(res => {
          this.message = '';
          this.scrollToBottom();
        });
      }else{
        this.message = '';
      }
    }
  }

  scrollToBottom() {
    if (this.content != null) {
      if (this.content.isScrolling == false) {
        setTimeout(() => {
          this.content.scrollToBottom();
        });
      }
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

  isInToday(inputDate) {
    var today = new Date().setHours(0, 0, 0, 0);
    var thatDay = new Date(inputDate).setHours(0, 0, 0, 0);
    if (today === thatDay) {
      return true;
    }
    return false;
  }

  trackByFn(item) {
    return item.key; // unique id corresponding to the item
  }

}
