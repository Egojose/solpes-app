import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders, HttpEvent } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  constructor(private http: HttpClient) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const jwt = localStorage.getItem('ObjToken');
    let objToken = JSON.parse(jwt);
    if (jwt !== null) {      
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${objToken.id_token}`,
            'Ocp-Apim-Subscription-Key': objToken.SuscriptionKey
          }
        });
      return next.handle(req);
    }
    else {
      const httpRequest = req.clone({
        headers: new HttpHeaders({
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT',
          'Ocp-Apim-Subscription-Key': '03f4673dd6b04790be91da8e57fddb52'
        })
      });
      return next.handle(httpRequest);
    }
  }
}