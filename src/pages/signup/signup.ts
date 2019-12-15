import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { SignupClass } from '../../data/Signup';
import { LoginPage } from '../login/login';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  userData:SignupClass = {
    firstname:'',
    lastname:'',
    email : '',
    password: ''
  };
  signupform: FormGroup;
  message:any;
  isError:boolean;
  loading:boolean = false;

  constructor(public navCtrl: NavController, 
    public authProvider:AuthProvider,
    public toastCtrl:ToastController,
    public navParams: NavParams) {

      let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
      this.signupform = new FormGroup({
        firstname: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2), Validators.maxLength(50)]),
        password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
        lastname: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2), Validators.maxLength(50)]),
        email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
      });
  }

  ionViewDidLoad() {

  }

  async signup() {
    this.loading = true;
    this.authProvider.signUpUsingEmailAndPassword(this.userData.email, this.userData.password).then(async user => {
      let update = user.updateProfile({
        displayName: this.userData.firstname + ' ' + this.userData.lastname,
        photoURL: 'https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1'
      }).then(result => {
      }).catch(error => {
      });

      let email = user.sendEmailVerification().then(eres => {
      }).catch(error => {
      });

      await update;
      await email;
      let logout = this.authProvider.logout().then(res => {
      });

      await logout;
      this.isError = false;
      this.loading = false;
      this.userCreatedToast();

    }, (error) => {
      this.loading = false;
      this.isError = true;
      if(error.message === 'The email address is already in use by another account.'){
        this.message = 'The email address is already in use by another account.';
      }else{
        this.message = 'Something went wrong! Please try again later! ';
      }

      setTimeout(() => {
        this.message = undefined;  
      }, 4000);
      
    });
  }

  userCreatedToast(){
    let toast = this.toastCtrl.create({
      message: 'You have successfully registered',
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      this.navCtrl.push(LoginPage);
    });
  
    toast.present();
  }

}
