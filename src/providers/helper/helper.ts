import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserClass } from '../../data/User';

@Injectable()
export class HelperProvider {

  constructor(public http: HttpClient) {
    
  }

  isCurrentUserLastMessage(arr:any[],loggedUserDetails:UserClass){
    return (arr[arr.length-1].username.trim() == loggedUserDetails.email.trim());
  }

  getLastName(name:string):string{
    let temp = name.split(' ');
    return temp[temp.length-1];
  }

  getEmailOfLastUser(arr,displayType){
    let email = arr[arr.length-1][displayType.toString()]!=undefined?arr[arr.length-1][displayType.toString()]: '';
    return email;
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

  getContentType(path:any){
    //to get image or video contentType after successful update
    return path?((path.split('/'))[0]):'';
  }

}
