import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-verifyemail',
  templateUrl: 'verifyemail.html',
})
export class VerifyemailPage {
  emailSent:string;
  constructor(public navCtrl: NavController, 
    public authProvider:AuthProvider,
    public navParams: NavParams) {
  }

  resendVerification(){
    this.authProvider.getLoggedInUser().onAuthStateChanged(ok => {
      if(ok){
        let user = this.authProvider.getCurrentUser();
        user.sendEmailVerification().then(eres => {
          this.emailSent = 'Sent ✓';
          setTimeout(() => {
            this.emailSent = null;
          }, 3000);
        }).catch(error => {
        });
      }
    });
  }

  ionViewDidLoad() {
  }

}
