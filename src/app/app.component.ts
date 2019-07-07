import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl,FormGroup,FormBuilder } from '@angular/forms';
import { AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider, AuthService, SocialLoginModule, LoginOpt  } from 'angularx-social-login';
import { FacebookResponse } from './facebook-response';
import { GoogleResponse } from './google-response';
import { TokenResponse } from './token-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shopsecurity';
  httpClient:HttpClient;
  signUpForm:FormGroup;
  signInForm:FormGroup;
  addressForm:FormGroup;
  email:string="";
  name:string="";
  mobileNumber:string="";
  password:string="";
  mobileOrEmail:string=""



   
 
  
  ngOnInit() {
  
  
 
  }

  constructor(private http: HttpClient,private authService: AuthService,private formBuilder :FormBuilder,private router:Router) 
  {
    this.httpClient=http;
    this.signUpForm=formBuilder.group({
      name: new FormControl(),
      mobileNumber:new FormControl(),
       email: new FormControl(),
       password: new FormControl()
    });
    this.httpClient=http;
    this.signInForm=formBuilder.group({
    
      mobileOrEmail: new FormControl(),
       password: new FormControl()
    });
  
    this.addressForm=formBuilder.group({
      houseNo: new FormControl(),
      areaDetails:new FormControl(),
      city: new FormControl(),
      pinCode: new FormControl(),
      landmark: new FormControl(),
      mobileNumber: new FormControl(),
      email: new FormControl()

    });

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
        if(tokenResponse.obj!=null  && tokenResponse.obj.csrfToken!=null )
        {
          if(tokenResponse.obj.userName!=null)
           alert("Welcome  "+tokenResponse.obj.userName)  
           localStorage.setItem("X-CSRF-TOKEN",tokenResponse.obj.csrfToken)
        }
     //alert("Signed Up SuccessFully  via FaceBook by"+userData.email)
      
      
 }); 

       }
       else if(socialPlatform == "google"){
        
        localStorage.setItem("JWT-TOKEN",userData.idToken)
        let googleResponse=new GoogleResponse(userData.idToken,userData.name,userData.email,socialPlatform);  
        this.httpClient.post<TokenResponse>("http://localhost:8080/socialSignUp?provider="+socialPlatform,
        googleResponse
        ).subscribe(
          tokenResponse  => {
            localStorage.setItem("PROVIDER",socialPlatform)
        if(tokenResponse.obj!=null  && tokenResponse.obj.csrfToken!=null )
        {
             if(tokenResponse.obj.userName!=null)
             alert("Welcome  "+tokenResponse.obj.userName)
           localStorage.setItem("X-CSRF-TOKEN",tokenResponse.obj.csrfToken)
        }
      //   alert("Signed Up SuccessFully via Google by "+userData.email)
          
          
     }); 



       }
        
      }
    );
  }
  

  onSubmit(signUpForm:any)
  {    
    alert("hiiiii signUP "+signUpForm.controls.name.value)
    this.name=signUpForm.controls.name.value;
    this.mobileNumber=signUpForm.controls.mobileNumber.value;
    this.email=signUpForm.controls.email.value;
    this.password=signUpForm.controls.password.value;
   
    this.httpClient.post<TokenResponse>("http://localhost:8080/signUp", {
      "name": this.name,
      "mobileNumber":this.mobileNumber,
      "email":  this.email,
      "password": this.password

    }
   
    ).subscribe(
      tokenResponse  => {
     
       if(tokenResponse.obj!=null && tokenResponse.obj.jwtToken!=null && tokenResponse.obj.csrfToken!=null )
           {
             if(tokenResponse.obj.userName!=null)
             alert("Welcome  "+tokenResponse.obj.userName)
              localStorage.setItem("JWT-TOKEN",tokenResponse.obj.jwtToken)
              localStorage.setItem("X-CSRF-TOKEN",tokenResponse.obj.csrfToken)
           }
     

      
      
 }); 

}
      

      onSubmitForSignIn(signInForm:any)
      {
        let baseUrl = 'http://localhost:8080/signIn'
        this.mobileOrEmail=signInForm.controls.mobileOrEmail.value;
        this.password=signInForm.controls.password.value;
      
      
        this.httpClient.post<TokenResponse>( baseUrl,
          {
            "mobileOrEmail":  this.mobileOrEmail,
            "password":this.password
      
          }
        ).subscribe(
          tokenResponse  => {
           
          if(tokenResponse.obj!=null && tokenResponse.obj.jwtToken!=null && tokenResponse.obj.csrfToken!=null )
           {
            if(tokenResponse.obj.userName!=null)
            alert("Welcome  "+tokenResponse.obj.userName)
              localStorage.setItem("JWT-TOKEN",tokenResponse.obj.jwtToken)
              localStorage.setItem("X-CSRF-TOKEN",tokenResponse.obj.csrfToken)
           }
          
          
     },
     error => {
       alert("Bhai error aa gayee")
     }); 
    
    }



    testToken()
    {
      let baseUrl = 'http://localhost:8080/test'
      
      this.httpClient.post<TokenResponse>( baseUrl,{}
        
      ).subscribe(
        tokenResponse  => {
         
       
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
    localStorage.setItem("X-CSRF-TOKEN",null)
    localStorage.setItem("PROVIDER",null)
    alert("Logged Out Successfully")
  }
  
  fetchCsrfToken()
  {
   
    let baseUrl = 'http://localhost:8080/postAuth'
      
      this.httpClient.post<TokenResponse>( baseUrl,{}
        
      ).subscribe(
        tokenResponse  => {
      
          localStorage.setItem("X-CSRF-TOKEN",tokenResponse.obj.csrfToken)
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

  addAddress(addressForm:any)
  {
   
    let houseNo= addressForm.controls.houseNo.value;
    let areaDetails=addressForm.controls.areaDetails.value;
    let city=addressForm.controls.city.value;
    let pinCode=addressForm.controls.pinCode.value;
    let landmark=addressForm.controls.landmark.value;
    let mobileNumber=addressForm.controls.mobileNumber.value;
    let email=addressForm.controls.email.value;
    let baseUrl = 'http://localhost:8080/addressDetails'
     
    this.httpClient.post<TokenResponse>( baseUrl,
      {
        "houseNo":  houseNo,
        "areaDetails":areaDetails,
        "city":city,
        "pinCode":pinCode,
        "landmark":landmark,
        "mobileNumber":mobileNumber,
        "email":email

  
      }
    ).subscribe(
      tokenResponse  => {
        alert(tokenResponse.message)
      
      
      
 },
 error => {
   alert("Bhai error aa gayee")
 }); 


  }

  

  
}
