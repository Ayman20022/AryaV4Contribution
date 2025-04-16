export interface User {
    firstName: string,
    lastName: string,
    username:string,
    networking: number,
    networked: number,
    avatarUrl: string
  }

export interface MyUser{
    id:string;
    firstName:string;
    lastName:string;
    username:string;
    email:string;
    bio:string;
    avatarUrl:string;
    preferences:string[];
    birthDate:string;
    balance:number;
    createdAt:string

}