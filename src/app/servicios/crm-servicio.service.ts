import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
    return this.http.put(this.urlApi,ObjEmpleado).toPromise();
  }

  consultarDatosBodega (parametros): Observable<any> {
    let token = '03f4673dd6b04790be91da8e57fddb52'
  //   let parametros = {
  //     Request parameters
  //     "idservicio": "16330",
  //     "cliente": "ENERGIA",
  //     "nombreservicio": "{string}",
  //     "os": "{string}",
  // };
   
    const header = {
      'Accept': 'application/json; odata=verbose',
      'Content-Type':  'application/json',
      'Ocp-Apim-Subscription-Key':  token
    }

   
   return this.http.get('https://itxapimanagement.azure-api.net/SolpBodegaInternexa/api/Bodega?', {headers: header, params: parametros })
  }
}
