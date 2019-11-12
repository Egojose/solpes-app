import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { headersToString } from 'selenium-webdriver/http';



@Injectable({
  providedIn: 'root'
})

export class CrmServicioService {
  private readonly urlApiSolicitudes = 'http://itxcrmwebapiprb.azurewebsites.net/api/crm/solp/registrarsolp';
  private readonly urlApiContratos = 'http://itxcrmwebapiprb.azurewebsites.net/api/crm/solp/registrarcontratoproveedor';
  private readonly urlLogin = "https://login.microsoftonline.com/c980e410-0b5c-48bc-bd1a-8b91cabc84bc/oauth2/token";
  
  constructor(private http: HttpClient) {
    
   }

  obtenerToken(){
    const formData = new FormData();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', '7d9d4669-0053-4859-98bd-3b76db1e78e9');
    formData.append('client_secret', 'dtR7rwbU2yVEIOmZedecXlU52IJw2gxh9PoDaH5baYo=');
    formData.append('resource', 'https://isaempresas.onmicrosoft.com/76c615d8-b58c-4bf0-8470-f90d6df94b9a')
    return this.http.post(this.urlLogin, formData).toPromise();
  }

  ActualizarSolicitud(ObjSolicitudes){    
    return this.http.put(this.urlApiSolicitudes,ObjSolicitudes).toPromise();
  }

  ActualizarContratos(ObjContratos){    
    return this.http.put(this.urlApiContratos,ObjContratos).toPromise();
  }

  consultarDatosBodega (parametros): Observable<any> {
    let token = '03f4673dd6b04790be91da8e57fddb52'
 
    const header = {
      'Accept': 'application/json; odata=verbose',
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Ocp-Apim-Subscription-Key':  token
    }
   return this.http.get('https://itxapimanagement.azure-api.net/SolpBodegaInternexa/api/Bodega?', {headers: header, params: parametros })
  }

  validarIdServiciosExcel(parametros): Observable<any> {
    let token = '03f4673dd6b04790be91da8e57fddb52'
 
    const header = {
      'Accept': 'application/json; odata=verbose',
      'Content-Type':  'application/json',
      'Ocp-Apim-Subscription-Key':  token
    }
    return this.http.get('https://itxapimanagement.azure-api.net/SolpBodegaInternexa/api/ValidarBodega?', {headers: header, params: parametros})
  }
}
