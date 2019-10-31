import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class CrmServicioService {
  private readonly urlApi = 'http://itxcrmwebapidllo.azurewebsites.net/api/crm/solp/registrarsolp';
  private readonly urlLogin = "https://login.microsoftonline.com/c980e410-0b5c-48bc-bd1a-8b91cabc84bc/oauth2/token";
  
  constructor(private http: HttpClient) {
    
   }

  obtenerToken(){
    const formData = new FormData();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', '43eb0956-9ff2-447d-9914-67c6be0e156d');
    formData.append('client_secret', 'kGQKKdeJjfgx7YFgnMQC8iGokUnDJCUYwkjqdULMVTQ=');
    formData.append('resource', 'https://isaempresas.onmicrosoft.com/1ccf92d1-cae8-4da6-9a89-cd9090736466')
    return this.http.post(this.urlLogin, formData).toPromise();
  }

  ActualizarEmpleado(ObjEmpleado, access){
    // let headers: HttpHeaders = new HttpHeaders();
    // headers.append('Authorization', 'Bearer ' + access);
    // headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json; odata=verbose',
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + access
      })
    };
    // let headers = {      
    //   Authorization: 'Bearer ' + access
    // }
    // headers = headers.set('Authorization', 'Bearer ' + access);
    
    return this.http.put<any>(this.urlApi,ObjEmpleado, httpOptions).toPromise();
  }
}
