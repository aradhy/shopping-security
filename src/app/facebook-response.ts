export class FacebookResponse {

status:string;
    constructor (private authToken:string,private name:string,private email:string,private socialProvider:string)
   {

   }
}
