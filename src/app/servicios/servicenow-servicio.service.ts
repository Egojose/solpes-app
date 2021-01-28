import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultadoServiceNow } from '../dominio/resultadoServiceNow';


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
    // const bodyPeticion = JSON.stringify(parametros);
    var bodyPeticion = JSON.stringify({"fabricante":"","material":"","nummaterial":"","namematerial":"","codLatam":"6100008290","codBrasil":""});

    const opcionesPeticion = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-key': 'f48651be182744ffa60edcea7a4f9d41',
      'Authorization': 'Basic ' + btoa('integraciones:Colombia2019')
      }),
      body: bodyPeticion,
    };
    
    return this.http.post(this.urlServiceNow, opcionesPeticion,  ).toPromise();
  }

  ConsultarCantidad(parametros): Promise<any> {
    return this.http.post(this.urlCantidad, parametros, this.httpOptions).toPromise()
  }

  sendPostRequestMateriales(data: any): Observable<any> {
    let httpHeaders= new HttpHeaders({
      'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-key': 'f48651be182744ffa60edcea7a4f9d41',
      'Authorization': 'Basic ' + btoa('integraciones:Colombia2019')
    }); 
    // httpHeaders.append('Content-Type', 'application/json'); 
    // httpHeaders.append("Authorization", "Basic " + btoa("integraciones:Colombia2019")); 
    // httpHeaders.append('Ocp-Apim-Subscription-key', 'f48651be182744ffa60edcea7a4f9d41')
    const httpOptions = { headers: httpHeaders };

    var bodyPeticion = data;
    
    return this.http.post<any>(this.urlServiceNow, bodyPeticion, httpOptions);
    }

}
