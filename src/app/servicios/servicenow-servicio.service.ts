import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServicenowServicioService {
  private readonly urlServiceNow = 'https://itxapimanagement.azure-api.net/ServiceNowPrbListaMateriales/api/ints6/webservice_sherpoint_materiales' //'https://internexatest.service-now.com/api/ints6/webservice_sherpoint_materiales'
  private readonly urlCantidad = 'https://itxapimanagement.azure-api.net/ServiceNowPrbStockMateriales/api/ints6/webservice_sherpoint_activos' //'https://internexatest.service-now.com/api/ints6/webservice_sherpoint_activos'

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders ({
      'Content-type': 'application/json',
      'Ocp-Apim-Subscription-key': 'f48651be182744ffa60edcea7a4f9d41',
      'Authorization': 'Basic ' + btoa('integraciones:Colombia2019')
    })
  }

 
  

  ConsultarDatosServiceNow(parametros): Promise<any> {
    return this.http.post(this.urlServiceNow, parametros, this.httpOptions).toPromise()
  }

  ConsultarCantidad(parametros): Promise<any> {
    return this.http.post(this.urlCantidad, parametros, this.httpOptions).toPromise()
  }

}
