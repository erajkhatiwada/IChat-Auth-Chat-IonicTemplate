import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//firebase imports and other
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

//pages
import { ChatPage } from '../pages/chat/chat';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { AuthProvider } from '../providers/auth/auth';
import { ProfilePage } from '../pages/profile/profile';
import { VerifyemailPage } from '../pages/verifyemail/verifyemail';
//for global error handling and logging
import { WebhookProvider } from '../providers/webhook/webhook';
import { GlobalErrorHanlder } from './app.globalerrorhandling';



const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_KEY",
  databaseURL: "YOUR_KEY",
  projectId: "YOUR_KEY",
  storageBucket: "YOUR_KEY",
  messagingSenderId: "YOUR_KEY",
  appId: "YOUR_KEY",
  measurementId: "YOUR_KEY"
};

const environment = {
  production: false
};
const errorHandlerClass = environment.production? GlobalErrorHanlder:IonicErrorHandler;

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ChatPage,
    LoginPage,
    SignupPage,
    ProfilePage,
    VerifyemailPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig ),
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ChatPage,
    LoginPage,
    SignupPage,
    ProfilePage,
    VerifyemailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: errorHandlerClass},
    FirebaseProvider,
    AngularFireAuth,
    AuthProvider,
    WebhookProvider,
  ]
})
export class AppModule {}
