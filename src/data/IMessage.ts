export interface IMessage{
    username:string;
    message:string;
    timestamp:number;
    key?:any;
    messageType?:string;
    url?:string;
}