import { Component, OnInit } from '@angular/core';
import { RecepcionBienes } from '../registrar-entradas-sap-servicios/RecepcionBienes'
import { SPServicio } from '../servicios/sp-servicio';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ItemAddResult } from 'sp-pnp-js';
import { RecepcionServicios } from '../registrar-entradas-sap-servicios/RecepcionServicios';

@Component({
  selector: 'app-registrar-entradas-sap-servicios',
  templateUrl: './registrar-entradas-sap-servicios.component.html',
  styleUrls: ['./registrar-entradas-sap-servicios.component.css']
})
export class RegistrarEntradasSapServiciosComponent implements OnInit {
  numRecepcion = new FormControl('');
  IdSolicitudParms: any;
  responsable: any;
  cantidad: any;
  valor: string;
  comentarios: string;
  ObjRecepcionBienes: RecepcionBienes[] = [];
  IdSolicitud: number;
  ObjRecepcionServicios: any;
  recepcionBienes: FormGroup;
  IdRecepcionServicios: number;

  constructor(private servicio: SPServicio, private formBuilder: FormBuilder, private activarRoute: ActivatedRoute) {
   
  }

  Guardar(item) {
    this.IdRecepcionServicios = item.IdRecepcionServicios;
    let objRegistrar;
    objRegistrar = {
      NumeroRecepcion: this.numRecepcion.value,
      recibidoSap: true,
      Estado: 'Terminado'
    }
    if (this.numRecepcion.value === "" || this.numRecepcion.value === null || this.numRecepcion.value === undefined) {
      alert('Debe suministrar el numero de recpción')
    }
    else {
      let index = this.ObjRecepcionServicios.findIndex(x=> x.IdRecepcionServicios === item.IdRecepcionServicios);
      this.servicio.registrarRecepcion(this.IdRecepcionServicios, objRegistrar).then(
        (resultado: ItemAddResult) => {
          this.ObjRecepcionServicios.splice(index, 1);
          alert('Recibido')
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      )
    }
  }
  ngOnInit() {
    this.IdSolicitudParms = localStorage.getItem('IdSolicitud')
    this.servicio.ObtenerRecepcionesServicios(1).subscribe(
      (respuesta) => {
        this.ObjRecepcionServicios = RecepcionServicios.fromJsonList(respuesta);
        console.log(this.ObjRecepcionServicios)
      }
    );
  }
}
