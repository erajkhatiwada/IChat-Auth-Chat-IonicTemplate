import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController, ToastController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginClass } from '../../data/Login';
import { ProfilePage } from '../profile/profile';
import { VerifyemailPage } from '../verifyemail/verifyemail';
import { SignupPage } from '../signup/signup';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user:LoginClass = {
    email : '',
    password : ''
  };
  currentUser:any;
  passwordChangeMessage:any;
  loading:boolean = false;
  
  constructor(public navCtrl: NavController, 
    public authProvider:AuthProvider,
    public alertCtrl:AlertController,
    public popoverCtrl:PopoverController,
    public toastCtrl:ToastController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  login(){
    this.loading = true;
    this.authProvider.loginUsingEmailAndPassword(this.user.email,this.user.password).then(user => { 
      this.loading = false;
      if(!user.emailVerified){
        this.createPopover();
      }else{
        this.navCtrl.setRoot(ProfilePage);
      }
      },(error) => {
        this.loading = false;
        this.createToastForError(error);
      });
  }

  createToastForError(error){
    let message;
    if(error.code == 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-email'){
      message = 'Incorrect email or password.';
    }else{
      message = 'Something went wrong! Please try again later.';
    }

    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
    });
  
    toast.present();
  }

  createPopover(){
    let popover = this.popoverCtrl.create(VerifyemailPage);
    popover.present();

    popover.onWillDismiss(ok => {
      this.checkIfVerified();
    });
  }

  checkIfVerified(){
    this.authProvider.getLoggedInUser().onAuthStateChanged(ok => {
      if(ok){
        let user = this.authProvider.getCurrentUser();
        if(user){
          if(user.emailVerified === true){
            this.navCtrl.setRoot(ProfilePage);
          }
        }
      }
    });
  }

  async forgetYourPassword(){
    const prompt = this.alertCtrl.create({
      title: 'Forget your password? ',
      message: "Please enter your email below: ",
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'email',
          placeholder: 'Email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Send Email',
          handler: data => {
            if(data.email != ""){
              this.authProvider.sendPasswordChangeEmail(data.email).then( async result => {
                this.passwordChangeMessage = 'Password Reset Email Sent';
                await this.passwordChangeMessage;

                setTimeout(() => {
                  this.passwordChangeMessage = null;
                }, 5000);
              },(e)=> {
                if(e.message == 'There is no user record corresponding to this identifier. The user may have been deleted.'){
                  this.passwordChangeMessage = 'There is no user corresponding to this email!';
                }else if(e.message == 'The email address is badly formatted.'){
                  this.passwordChangeMessage = 'Please enter a valid email!';
                }else{
                  this.passwordChangeMessage = 'Sorry, cannot send password reset email!';
                }
                setTimeout(() => {
                  this.passwordChangeMessage = null;
                }, 5000);
              });
            }
          }
        }
      ]
    });
    prompt.present();
  }

  goToSignUp(){
    this.navCtrl.push(SignupPage);
  }
  
}
