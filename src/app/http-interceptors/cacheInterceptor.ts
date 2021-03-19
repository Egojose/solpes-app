import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders, HttpEvent } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  constructor(private http: HttpClient) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // const jwt = localStorage.getItem('id_token');
    let objTokenString = localStorage.getItem('id_token');
    let objToken = JSON.parse(objTokenString);
    if (objToken !== false) {
    if (objToken.estado !== "false") {
      if (objToken.TipoConsulta === "crm") {
        req = req.clone({
          setHeaders: {
            // 'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${objToken.token}`,
            'Ocp-Apim-Subscription-Key': objToken.suscriptionKey
          }
        }); 
      }
      else if (objToken.TipoConsulta === "Bodega") {
        req = req.clone({
          setHeaders:{
            'Ocp-Apim-Subscription-Key': objToken.suscriptionKey
          }
        }); 
      }
      else if(objToken.tipoConsulta === 'ServiceNow') {
        req = req.clone({
          setHeaders: {
            'Content-type': 'application/json',
            'Ocp-Apim-Subscription-key': 'f48651be182744ffa60edcea7a4f9d41',
            'Authorization': 'Basic ' + btoa('integraciones:Colombia2019')
          }
        })
      }
      else if(objToken.tipoConsulta === 'SAP') {
        req = req.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('cominternexa:InterServ$Q21')
          }
        })
      }
           
    }
    else {
       req = req.clone({
          headers: new HttpHeaders({
            'Ocp-Apim-Subscription-Key': 'f48651be182744ffa60edcea7a4f9d41',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
          })
        });
    }
  }    
    
    return next.handle(req);
  }
}