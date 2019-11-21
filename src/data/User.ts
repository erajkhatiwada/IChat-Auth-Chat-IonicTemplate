import { IUser } from "./IUser";

export class UserClass implements IUser{
    displayName?:string;
    photoURL?: string;
    email: string;
}