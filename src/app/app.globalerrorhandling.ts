import { Injectable, ErrorHandler } from "@angular/core";
import { WebhookProvider } from "../providers/webhook/webhook";
import { AuthProvider } from "../providers/auth/auth";

export interface ParsedError {
    message: string;
    status?: number;
}

export interface LoggingInfo{
    content:string;
    username:string;
}

@Injectable()
export class GlobalErrorHanlder extends ErrorHandler{
    // replace your discord webhook url in webhook provider to log error 
    constructor(public sharedProvider:WebhookProvider, public authProvider:AuthProvider){
        super();
    }

    handleError(error: any): void {
        // unroll errors from promises
        if (error.rejection) {
          error = error.rejection;
        }
        //console.log(error.stack);
        let parsedError = this.parse(error);
        //to get date and time
        var datetime =  new Date().toLocaleString();

        let usr = this.authProvider.getCurrentUser();
        let user = usr?usr.email:'Not Logged In';
    
        let logginInfo: LoggingInfo = {
            content: "**ErrorMessage:** ` " + parsedError.message + "` \n" +
            "**StatusCode:** ` " + parsedError.status + "` \n" +
            "**Stack:** ` " + error.stack.toString() + "` \n" +
            "**TimeStamp:** `" + datetime + "`",
            username : user=='Not Logged In'?user+' @'+datetime:user
        }
       
        this.sharedProvider.postErrorToDiscord(logginInfo).subscribe(res => {
        },error => {console.log('Error establing service to logger')});
      }
    
      parse(error: any): ParsedError {
    
        // get best available error message
        let parsedError: ParsedError = {
            message: error.message ? error.message as string :  error.toString()
        };
     
        // include HTTP status code
        if (error.status != null) {
            parsedError.status = error.status;
        }
    
        return parsedError;
      }
}