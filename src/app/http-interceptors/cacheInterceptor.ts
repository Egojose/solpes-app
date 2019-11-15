import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders, HttpEvent } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  
  constructor(private http: HttpClient){

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const jwt = localStorage.getItem('id_token');
    if (jwt !== "false") {
      req = req.clone({
        setHeaders:{
          Authorization : `Bearer ${jwt}`,
          'Ocp-Apim-Subscription-Key': 'c3d10e5bd16e48d3bd936bb9460bddef'
        }
      });
      
    }
    
    
    return next.handle(req);
  }
  // intercept(req: HttpRequest<any>, next: HttpHandler) {
  //   const httpRequest = req.clone({
  //     headers: new HttpHeaders({
  //       'Cache-Control': 'no-cache',
  //       'Pragma': 'no-cache',
  //       'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
  //     })
  //   });

  //   return next.handle(httpRequest);
  // }
}