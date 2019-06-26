import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl,FormGroup,FormBuilder } from '@angular/forms';
import { AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider, AuthService, SocialLoginModule, LoginOpt  } from 'angularx-social-login';
import { FacebookResponse } from './facebook-response';
import { GoogleResponse } from './google-response';
import { TokenResponse } from './token-response';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'shopsecurity';
  httpClient:HttpClient;
  signUpForm:FormGroup;
  signInForm:FormGroup;
  email:String="";
  name:String="";
  password:string="";
  

  constructor(private http: HttpClient,private authService: AuthService,private formBuilder :FormBuilder) 
  {
    this.httpClient=http;
    this.signUpForm=formBuilder.group({
      name: new FormControl(),
       email: new FormControl(),
       password: new FormControl()
    });
    this.httpClient=http;
    this.signInForm=formBuilder.group({
      name: new FormControl(),
       email: new FormControl(),
       password: new FormControl()
    });
  
  }
  
  ngOnInit(): void {
   
  } 


  public socialLogin(socialPlatform : string) {
    let socialPlatformProvider;
    if(socialPlatform == "facebook"){
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    }else if(socialPlatform == "google"){
      
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    } 
    
    this.authService.signIn(socialPlatformProvider).then(
      (userData) => {
       if(socialPlatform == "facebook")
       {
        let facebookresponse=new FacebookResponse(userData.authToken,userData.name,userData.email,socialPlatform);
        localStorage.setItem("JWT-TOKEN",userData.authToken)
   this.httpClient.post<TokenResponse>("http://localhost:8080/socialSignUp?provider="+socialPlatform,
    facebookresponse
    ).subscribe(
      tokenResponse  => {
        localStorage.setItem("PROVIDER",socialPlatform)
       
     alert("Signed Up SuccessFully  via FaceBook by"+userData.email)
      
      
 }); 

       }
       else if(socialPlatform == "google"){
         alert(userData.idToken)
        localStorage.setItem("JWT-TOKEN",userData.idToken)
        let googleResponse=new GoogleResponse(userData.idToken,userData.name,userData.email,socialPlatform);  
        this.httpClient.post<TokenResponse>("http://localhost:8080/socialSignUp?provider="+socialPlatform,
        googleResponse
        ).subscribe(
          tokenResponse  => {
            localStorage.setItem("PROVIDER",socialPlatform)
         alert("Signed Up SuccessFully via Google by "+userData.email)
          
          
     }); 



       }
        
      }
    );
  }
  

  onSubmit(signUpForm:any)
  {    
    this.name=signUpForm.controls.name.value;
    this.email=signUpForm.controls.email.value;
    this.password=signUpForm.controls.password.value;
   
    this.httpClient.post<TokenResponse>("http://localhost:8080/signUp", {
      "username": this.name,
      "email":  this.email,
      "password": this.password

    }
   
    ).subscribe(
      tokenResponse  => {
       alert(tokenResponse.obj)
        if(tokenResponse.obj!=null)
       localStorage.setItem("JWT-TOKEN",tokenResponse.obj)
       alert(tokenResponse.message)
  //   alert("Logged In SuccessFully by "+this.name)
      
      
 }); 

}
      

      onSubmitForSignIn(signInForm:any)
      {
        let baseUrl = 'http://localhost:8080/signIn'
        this.email=signInForm.controls.email.value;
        this.password=signInForm.controls.password.value;
       // this.csrfToken=signUpForm.controls._csrf.value;
       alert(this.email)
        this.httpClient.post<TokenResponse>( baseUrl,
          {
            "email":  this.email,
            "password":this.password
      
          }
        ).subscribe(
          tokenResponse  => {
            alert(tokenResponse.message)
            localStorage.setItem("JWT-TOKEN",tokenResponse.obj)
          
          
     }); 
    
    }



    testToken()
    {
      let baseUrl = 'http://localhost:8080/test'
      
      this.httpClient.get<TokenResponse>( baseUrl,
        
      ).subscribe(
        tokenResponse  => {
          alert("Response arrived")
          alert(tokenResponse)
          if(tokenResponse.code==201)
          {
        
             alert(tokenResponse.message)
        
          }
          else{
            alert("Token Failed")
          }
        
        
   },
   error => {
     alert("Bhai error aa gayee")
   }); 
  
  }


  logOut()
  {
    localStorage.setItem("JWT-TOKEN",null)
    alert("Logged Out Successfully")
  }
  
   
  
}
