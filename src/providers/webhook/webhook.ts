import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class WebhookProvider {

  discordUrl = 'DISCORD_WEBHOOK_URL';

  constructor(public http: HttpClient) {
  }

  postErrorToDiscord(content){
    //logging to discord
    return this.http.post(this.discordUrl,content);
  }

}
