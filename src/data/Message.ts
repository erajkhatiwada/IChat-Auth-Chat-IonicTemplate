import { IMessage } from "./IMessage";

export class ChatMessage implements IMessage{
    constructor(public username: string, public message: string, public timestamp:number, public key?: any){
    }
}