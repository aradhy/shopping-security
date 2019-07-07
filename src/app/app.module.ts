import { BrowserModule } from '@angular/platform-browser';
import { NgModule, OnInit } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider, AuthService, SocialLoginModule, LoginOpt  } from 'angularx-social-login';
import { TokenInterceptor } from './token-interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './user/user.component';

const googleLoginOptions: LoginOpt = {
  scope: 'profile email'
};
let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("517977997834-kevh4fjm6um2roe04umom1h7mki74rtv.apps.googleusercontent.com")
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("2190645354387980")
  }
]);


export function provideConfig() {
  return config;
}




@NgModule({
  declarations: [
    AppComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    SocialLoginModule,
    HttpClientModule,FormsModule,ReactiveFormsModule,AppRoutingModule
  ],
  providers: [{
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },SocialLoginModule,{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
    
  ],


 
  bootstrap: [AppComponent]
})



export class AppModule 
{
  


}

