import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SapService {

  urlApiActivos = 'https://webdispsap.isa.com.co:50000/RESTAdapter/ActivosFijos/Creacion'
  urlApiSolpSap = 'https://webdispsap.isa.com.co:50000/RESTAdapter/Solped/Creacion'

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Basic ' + btoa('cominternexa:InterServ$01')
    })
  };
  // header = {
  //   "usuario" : "cominternexa",
  //   "Authorization" : "Basic d2ViLnNlcnZpY2VzOndlYi5zZXJ2aWNlcw==",
  //   //Clave: InterServ$01
  // }

  registarActivos(body): Promise<any> {
    return this.http.post(this.urlApiActivos, body, this.httpOptions).toPromise();
  }

  registrarSolpSap(body): Promise<any> {
    return this.http.post(this.urlApiSolpSap, body, this.httpOptions).toPromise();
  }
}
