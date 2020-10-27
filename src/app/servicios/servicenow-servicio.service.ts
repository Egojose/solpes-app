import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServicenowServicioService {
  private readonly urlServiceNow = 'https://internexatest.service-now.com/api/now/table/cmdb_hardware_product_model'

  constructor(private http: HttpClient) { }

  ConsultarDatos(parametros) {
    const header = {
      "web.services" : "web.services",
      "Authorization" : "Basic d2ViLnNlcnZpY2VzOndlYi5zZXJ2aWNlcw=="
    }
    return this.http.get(this.urlServiceNow, {headers: header, params: parametros})
  }
}
