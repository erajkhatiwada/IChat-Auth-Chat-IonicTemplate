import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ToastController } from 'ionic-angular';
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

  initLen = -20;
  previousMessageLength:any;
  firstTime = true;
  isMessageLoading:boolean = true;
  errorMessage:string;
  
  constructor(public navCtrl: NavController,
    public authProvider:AuthProvider,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public firebaseProvider: FirebaseProvider) {}

  async ionViewDidLoad() {
    await this.getUserUsingAuthState();
    this.firebaseProvider.getChatMessages()
      .pipe(map(item => item
        .map(newItem => new ChatMessage(newItem["username"], newItem["message"], newItem["timestamp"], newItem["key"]))))
      .subscribe( async res => {
        /**
         * Simple Implementation
         * Uncomment to use just this
         */

        // this.messages = await res;
        // setTimeout(() => {
        //   this.scrollToBottom();
        // }, 300);

        /**
         * Get new message alert and other features use code below
         */
        this.isMessageLoading = false;
        if (res.length > this.previousMessageLength && this.previousMessageLength != undefined) {  
          if (this.isNotAtTheBottom()) {
            if (!this.isCurrentUserLastMessage(res)) {
              let username = this.getEmailOfLastUser(res);
              this.newMessageAlert(username);
            } else {
              setTimeout(() => {
                this.scrollToBottom();
              }, 0);
            }
          } else {
            setTimeout(() => {
              this.scrollToBottom();
            }, 0);
          }
        }

        this.previousMessageLength = res.length;
        //to add message instead of removing one message everytime
        if (!this.firstTime) {
          this.initLen = this.initLen - 1;
        }
        let slicedChat = await res.slice(this.initLen);
        this.messages = slicedChat;

        if (this.firstTime) {
          setTimeout(() => {
            this.scrollToBottom();
          }, 100);
        }
        this.firstTime = false;
      },(error)=> {
        this.isMessageLoading = false;
        this.errorMessage = 'Error loading chat!';
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

  isNotAtTheBottom(): boolean{
    let full = this.content.getScrollElement().scrollHeight;
    let less = this.content.getScrollElement().scrollTop+ this.content.getScrollElement().offsetHeight;
    if(full - less > 20){
      return true;
    }
    return false;
  }

  newMessageAlert(username){
    let  toast = this.toastCtrl.create({
        message : 'New message from '+username,
        position: 'bottom',
        duration: 2500
      }); 
    toast.present();
  }

  isCurrentUserLastMessage(arr:any[]){
    return (arr[arr.length-1].username.trim() == this.loggedUserDetails.email.trim());
  }

  getEmailOfLastUser(arr){
    let email = arr[arr.length-1]["username"];
    return email;
  }

  loadPreviousMessage(refresher) {
    setTimeout(() => {
      this.initLen = this.initLen - 15;
      this.firebaseProvider.getChatMessages()
         .pipe(map(item => item
          .map(newItem => new ChatMessage(newItem["username"], newItem["message"], newItem["timestamp"], newItem["key"]))))
        .subscribe(async res => {
          //update: we are just showing without concat
          this.messages = await res.slice(this.initLen);
          refresher.complete();
        });
    }, 2000);
  }


}
