import { Component, OnInit } from '@angular/core';
import { RecepcionBienes } from '../registrar-entradas-sap-servicios/RecepcionBienes'
import { SPServicio } from '../servicios/sp-servicio';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ItemAddResult } from 'sp-pnp-js';
import { RecepcionServicios } from '../registrar-entradas-sap-servicios/RecepcionServicios';
import { ToastrManager } from 'ng6-toastr-notifications';
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
  IdSolicitud: number;
  ObjRecepcionServicios: RecepcionServicios[] = [];
  recepcionServicios: FormGroup;
  IdRecepcionServicios: number;
  IdUsuario: any;

  constructor(private servicio: SPServicio, private formBuilder: FormBuilder,public toastr: ToastrManager, private activarRoute: ActivatedRoute) {
   
  }

  Guardar(item) {
    this.IdRecepcionServicios = item.IdRecepcionServicios;
    let objRegistrar;
    objRegistrar = {
      NumeroRecepcion: this.numRecepcion.value,
      recibidoSap: true,
    }
    if (this.numRecepcion.value === "" || this.numRecepcion.value === null || this.numRecepcion.value === undefined) {
      this.mostrarAdvertencia('Debe suministrar el número de recepción')
    }
    else {
      let index = this.ObjRecepcionServicios.findIndex(x=> x.IdRecepcionServicios === item.IdRecepcionServicios);
      this.servicio.registrarRecepcionServicios(this.IdRecepcionServicios, objRegistrar).then(
        (resultado: ItemAddResult) => {
          this.MostrarExitoso('Recibido');
          this.ObjRecepcionServicios.splice(index, 1);
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
    this.servicio.ObtenerUsuarioActual().subscribe(
      (respuesta) => {
        this.IdUsuario = respuesta.Id;
        this.servicio.ObtenerRecepcionesServicios(this.IdUsuario).subscribe(
          (respuesta) => {
            this.ObjRecepcionServicios = RecepcionServicios.fromJsonList(respuesta);
            console.log(this.ObjRecepcionServicios)
          }
        );
      }
    )
  }

  MostrarExitoso(mensaje: string) {
    this.toastr.successToastr(mensaje, 'Confirmación!');
  }

  mostrarAdvertencia(mensaje: string) {
    this.toastr.warningToastr(mensaje, 'Validación');
  }
}

