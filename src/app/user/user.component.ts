import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TokenResponse } from '../token-response';
import { GoogleResponse } from '../google-response';
import { FacebookResponse } from '../facebook-response';
import { GoogleLoginProvider, FacebookLoginProvider, AuthService } from 'angularx-social-login';
declare var onClickSubmit:any;
declare var onClick:any;
@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})


export class UserComponent implements OnInit {
  signUpForm:FormGroup;
  signInForm:FormGroup;
  paramVal:string;
  @Output() customerNameEmitter = new EventEmitter<string>();
  constructor(private router:Router,private activatedRoute:ActivatedRoute,formBuilder:FormBuilder,private httpClient: HttpClient,private authService: AuthService) 
  {  
    this.signUpForm=formBuilder.group({
      name: new FormControl(),
      mobile:new FormControl(),
       email: new FormControl(),
       password: new FormControl()
    });
   
    this.signInForm=formBuilder.group({
    
      mobileOrEmail: new FormControl(),
       password: new FormControl()
    });
  
    
  }


  ngOnInit() {
  
    
    this.activatedRoute.params.subscribe(params => {
      this.paramVal = params.id; 
    
    });
 
   onClickSubmit(this.paramVal);
  }

  changeForm(paramVal)
  {
    this.paramVal=paramVal
    onClick(this.paramVal);
  }
  close()
  {
    document.getElementById('id01').style.display='none';
    this.router.navigateByUrl('/');
  }


  onSignUp(signUpForm:any)
  {    
    alert(signUpForm)
   let name=signUpForm.controls.name.value;
    let mobileNumber=signUpForm.controls.mobile.value;
    let email=signUpForm.controls.email.value;
    let password=signUpForm.controls.password.value;
    signUpForm.reset();
    this.httpClient.post<TokenResponse>("http://localhost:8080/signUp", {
      "name": name,
      "mobileNumber":mobileNumber,
      "email":  email,
      "password": password

    }
   
    ).subscribe(
      tokenResponse  => {
     
       if(tokenResponse.obj!=null && tokenResponse.obj.jwtToken!=null && tokenResponse.obj.csrfToken!=null )
           {
             if(tokenResponse.obj.userName!=null)
             {
             alert("Welcome  "+tokenResponse.obj.userName)
             this.customerNameEmitter.emit(tokenResponse.obj.userName)
             localStorage.setItem("customerName",tokenResponse.obj.userName)
              localStorage.setItem("JWT-TOKEN",tokenResponse.obj.jwtToken)
              localStorage.setItem("X-CSRF-TOKEN",tokenResponse.obj.csrfToken)
              this.router.navigateByUrl("/");

             }
           }
     else{
       alert(tokenResponse.message)
     }

   
      
 }); 

}
      

      onSignIn(signInForm:any)
      {
        let baseUrl = 'http://localhost:8080/signIn'
        let mobileOrEmail=signInForm.controls.mobileOrEmail.value;
        let password=signInForm.controls.password.value;
        signInForm.controls.password.reset()
       
      
        this.httpClient.post<TokenResponse>( baseUrl,
          {
            "mobileOrEmail":  mobileOrEmail,
            "password":password
      
          }
        ).subscribe(
          tokenResponse  => {
           
          if(tokenResponse.obj!=null && tokenResponse.obj.jwtToken!=null && tokenResponse.obj.csrfToken!=null )
           {
            if(tokenResponse.obj.userName!=null)
            {
              this.customerNameEmitter.emit(tokenResponse.obj.userName)
              localStorage.setItem("customerName",tokenResponse.obj.userName)
            alert("Welcome  "+tokenResponse.obj.userName)
            }
              localStorage.setItem("JWT-TOKEN",tokenResponse.obj.jwtToken)
              localStorage.setItem("X-CSRF-TOKEN",tokenResponse.obj.csrfToken)

            
           }else{
            alert(tokenResponse.message)
          }
          
          this.router.navigateByUrl('/');
     },
     error => {
       alert("Bhai error aa gayee")
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
            {
             alert("Welcome  "+tokenResponse.obj.userName)  

             this.customerNameEmitter.emit(tokenResponse.obj.userName)
             localStorage.setItem("customerName",tokenResponse.obj.userName)
            }
             localStorage.setItem("X-CSRF-TOKEN",tokenResponse.obj.csrfToken)
             this.router.navigateByUrl("/");
            
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
               {
               alert("Welcome  "+tokenResponse.obj.userName) 
               this.customerNameEmitter.emit(tokenResponse.obj.userName)
               localStorage.setItem("customerName",tokenResponse.obj.userName)
               }
             localStorage.setItem("X-CSRF-TOKEN",tokenResponse.obj.csrfToken)
             this.router.navigateByUrl("/");
          }
        //   alert("Signed Up SuccessFully via Google by "+userData.email)
            
            
       }); 
  
  
  
         }
          
        }
      );
    }



  



}



