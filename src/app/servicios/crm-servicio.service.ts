import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { headersToString } from 'selenium-webdriver/http';



@Injectable({
  providedIn: 'root'
})

export class CrmServicioService {
  private readonly urlApiSolicitudes = 'https://itxapimanagement.azure-api.net/CrmPrbintegracion/api/crm/solp/registrarsolp';//c3d10e5bd16e48d3bd936bb9460bddef 
  private readonly urlApiContratos = 'https://itxapimanagement.azure-api.net/CrmPrbintegracion/api/crm/solp/registrarcontratoproveedor';//c3d10e5bd16e48d3bd936bb9460bddef 
  private readonly urlLogin = "/c980e410-0b5c-48bc-bd1a-8b91cabc84bc/oauth2/token";
  
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

  ActualizarSolicitud(ObjSolicitudes): Promise<any>{  
    let token = 'cf312e4c52b24af1bcd4842fe6aca279'
 
    // const header = {
    //   'Accept': 'application/json; odata=verbose',
    //   'Content-Type': 'application/json',
    //   'Ocp-Apim-Subscription-Key':  token
    // }
    // return this.http.put('https://itxapimanagement.azure-api.net/CrmPrbintegracion/api/crm/solp/registrarsolp',ObjSolicitudes);
    return this.http.put(this.urlApiSolicitudes,ObjSolicitudes).toPromise();
  }

  ActualizarContratos(ObjContratos){    
    return this.http.put(this.urlApiContratos,ObjContratos).toPromise();
  }

 async consultarDatosBodega (parametros): Promise<any> {
    let token = '03f4673dd6b04790be91da8e57fddb52'
 
    const header = {
      'Accept': 'application/json; odata=verbose',
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key':  token
    }
   return await this.http.get('https://itxapimanagement.azure-api.net/SolpBodegaInternexa/api/Bodega?', {headers: header, params: parametros }).toPromise();
  }

  public async validarIdServiciosExcel(parametros): Promise<any> {
    let token = '03f4673dd6b04790be91da8e57fddb52'
    let objToken = {
      TipoConsulta: "Bodega",
      suscriptionKey: "03f4673dd6b04790be91da8e57fddb52",
      estado: "true"
    }
    let objTokenString = JSON.stringify(objToken);
    localStorage.setItem("id_token",objTokenString);
 
    const header = {
      'Accept': 'application/json; odata=verbose',
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key':  token
    }
    return await this.http.get('https://itxapimanagement.azure-api.net/SolpBodegaInternexa/api/ValidarBodega?', {headers: header, params: parametros}).toPromise();
  }
}
