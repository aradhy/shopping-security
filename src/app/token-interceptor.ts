import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  

     constructor(private httpClient:HttpClient)
     {

     }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
 
if(( request.url.match('http://localhost:8080/signUp') || request.url.match('http://localhost:8080/signIn')))
    {
    request = request.clone({
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),withCredentials: true
    });
  }
  else if(( request.url.match('http://localhost:8080/socialSignUp') || request.url.match('http://localhost:8080/socialSignIn')))
  {
    request = request.clone({
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization':localStorage.getItem('JWT-TOKEN'),
        
      }),withCredentials: true,params: request.params.set('provider', localStorage.getItem("PROVIDER"))
    });
  }
  else{
   
    request = request.clone({
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization':localStorage.getItem('JWT-TOKEN'),
        'X-CSRF-TOKEN':localStorage.getItem('X-CSRF-TOKEN')
        
      }),withCredentials: true,params: request.params.set('provider', localStorage.getItem("PROVIDER"))
    });



  }
    console.log('Intercepted HTTP call', request);

   
    // pass on the modified request object
    return next.handle(request);


    
  }
}