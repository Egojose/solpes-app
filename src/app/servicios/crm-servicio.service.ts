import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { promise } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class CrmServicioService {
  private readonly urlApi = 'https://localhost:44325';
  constructor(private http: HttpClient) { }

  ActualizarEmpleado(ObjEmpleado){
    return this.http.put(this.urlApi+'/api/Empleados/4',ObjEmpleado).toPromise();
  }
}
