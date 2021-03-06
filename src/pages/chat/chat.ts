import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ToastController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { ChatMessage } from '../../data/Message';
import { map } from 'rxjs/operators';
import { AuthProvider } from '../../providers/auth/auth';
import { UserClass } from '../../data/User';
import { IUploadObj } from '../../data/IUploadObj';
import { StorageProvider } from '../../providers/storage/storage';


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
  
  //assign color to different user
  colorHashMap = {}; //for storing colors

  uploadProgress : any;
  isUploaded:boolean;
  uploadObject : IUploadObj = {
    url: '',
    messageType: ''
  };

  @ViewChild('uploadFile') fileUpload: ElementRef;
  
  constructor(public navCtrl: NavController,
    public authProvider:AuthProvider,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public firebaseProvider: FirebaseProvider,
    public storageProvider:StorageProvider) {}

  async ionViewDidLoad() {
    await this.getUserUsingAuthState();
    this.firebaseProvider.getChatMessages()
      .pipe(map(item => item
        .map(newItem => new ChatMessage(newItem["username"], 
        newItem["message"], 
        newItem["timestamp"], 
        newItem["key"],
        newItem["messageType"], 
        newItem["url"]))))
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
        this.colorGeneratorByEmail(slicedChat);
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
    if(this.fileUpload.nativeElement.value != '' && this.isUploaded){
      let userMessage: ChatMessage = {
        username: this.user,
        message: this.message != undefined ? this.message.trim() : '',
        timestamp: new Date().getTime(),
        messageType: this.uploadObject.messageType,
        url: this.uploadObject.url
      }

      this.firebaseProvider.pushMessages(userMessage).then(res => {
        this.setMessageSentSetting();
      },(error)=>{

      });
      
    }else{
      if (this.message != undefined) {
        if (this.message.trim() != '') {
          let userMessage = {
            username: this.user,
            message: this.message.trim(),
            timestamp: new Date().getTime(),
            messageType: "text",
            url: ''
          }
          this.firebaseProvider.pushMessages(userMessage).then(res => {
            this.setMessageSentSetting();
          },(error)=>{

          });
        }else{
          this.message = '';
        }
      }
    }
  }

  setMessageSentSetting(){
    this.message = '';
    this.isUploaded = false;
    this.fileUpload.nativeElement.value = '';
    this.uploadObject = {
      url: '',
      messageType: ''
    }
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
  }

  scrollToBottom() {
    if (this.content._scroll) {
      setTimeout(() => {
          this.content.scrollToBottom(0);
      });
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
          .map(newItem => new ChatMessage(newItem["username"], 
          newItem["message"], 
          newItem["timestamp"], 
          newItem["key"],
          newItem["messageType"], 
          newItem["url"]))))
        .subscribe(async res => {
          //update: we are just showing without concat
          this.messages = await res.slice(this.initLen);
          this.colorGeneratorByEmail(this.messages);
          refresher.complete();
        });
    }, 2000);
  }

  pickTextColorBasedOnBgColorSimple(bgColor, lightColor, darkColor) {
    var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    var uicolors = [r / 255, g / 255, b / 255];
    var c = uicolors.map((col) => {
      if (col <= 0.03928) {
        return col / 12.92;
      }
      return Math.pow((col + 0.055) / 1.055, 2.4);
    });
    var L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
    return (L > 0.179) ? darkColor : lightColor;
  }

  generateRandomHexColor(): string{
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  colorGeneratorByEmail(arr) {
    /**
     * Need to check if same color has been assigned or not.
     * If yes, find another color for the same user
     */
    for (let user of arr) {
      let temp = user["username"];
      if (this.colorHashMap[temp] == undefined) {
        this.colorHashMap[temp] = {
          color: this.generateRandomHexColor()
        };
        if (this.colorHashMap[temp].color != undefined) {
          this.colorHashMap[temp].textColor = this.pickTextColorBasedOnBgColorSimple(this.colorHashMap[temp].color, '#FFFFFF', '#000000');
        }
      }
    }
  }

  getHexColorByEmail(email){
    return this.colorHashMap[email].color?this.colorHashMap[email].color : '';
  }

  getHexFontByEmail(email){
    return this.colorHashMap[email].textColor? this.colorHashMap[email].textColor : 'black';
  }

  upload(event) {
      //uploadObject reset after error complete, send, etc.
      var newThis = this;
      var uploadTask = this.storageProvider.uploadFiles(event, this.loggedUserDetails.email);
      uploadTask.on('state_changed', (snapshot) => {
        let bytesTransferred = (snapshot["bytesTransferred"] / snapshot["totalBytes"]) * 100;
        newThis.uploadProgress = Math.round(bytesTransferred);
      }, (error) => {
        this.uploadProgress = undefined;
        this.fileUpload.nativeElement.value = ""; //to reset file upload selector
        this.uploadToast('error');
        this.isUploaded = false;
        this.uploadObject = {
          url: '',
          messageType: 'text'
        }
      }, () => {
        this.uploadProgress = undefined;
        this.uploadToast('success');
        this.isUploaded = true;
        this.uploadObject = {
          url: uploadTask.snapshot.downloadURL,
          messageType: this.getContentType(uploadTask.snapshot.metadata.contentType)
        }
        // console.log(uploadTask);
        // console.log(uploadTask.snapshot.downloadURL);
      });
  }

  uploadToast(type){
    let msg = type=='success'? 'File is ready to send ': 'Error uploading file';
    const toast = this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2500
    });
    toast.present();
  }

  removeFile(){
    this.uploadObject = {
      url: '',
      messageType: ''
    };
    this.fileUpload.nativeElement.value = ""; //to reset file upload selector
    this.isUploaded = false;
  }

  triggerFileUpload(){
    this.fileUpload.nativeElement.click();
  }

  getContentType(path:any){
    //to get image or video contentType after successful update
    return path?((path.split('/'))[0]):'';
  }


}
