import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { UserClass } from '../../data/User';
import { ChatPage } from '../chat/chat';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user = {
    username : ''
  };
  loggedUser:any;
  loggedUserDetails:UserClass;
  constructor(public navCtrl: NavController, 
    public authProvider:AuthProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.getUserUsingAuthState();
  }

  getUserUsingAuthState(){
    this.authProvider.getLoggedInUser().onAuthStateChanged(res => {
        this.loggedUser = this.authProvider.getCurrentUser();
        if(this.loggedUser){
          this.loggedUserDetails = {
            email : this.loggedUser.email,
            displayName : this.loggedUser.displayName,
            photoURL: this.loggedUser.photoURL
          }
        }
    });
  }

  logout(){
    this.authProvider.logout().then(res => {
      this.loggedUserDetails = null;
      this.navCtrl.setRoot(HomePage);
    });
  }

  chat(){
    this.navCtrl.push(ChatPage,{
      user: this.user["username"]
    });
  }

  goToChatPage(){
    this.navCtrl.push(ChatPage);
  }

}
