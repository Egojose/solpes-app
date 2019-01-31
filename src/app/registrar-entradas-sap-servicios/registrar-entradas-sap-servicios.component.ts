import { Component, OnInit } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { FormControl, FormGroup } from '@angular/forms';
import { ItemAddResult } from 'sp-pnp-js';
import { RecepcionServicios } from '../registrar-entradas-sap-servicios/RecepcionServicios';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Contratos } from '../recepcion-sap/contratos';
import { NgxSpinnerService } from 'ngx-spinner';

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
  objContratos: Contratos[] = [];
  IdRecepcionServicios: number;
  IdUsuario: any;

  constructor(private servicio: SPServicio, public toastr: ToastrManager, private spinner: NgxSpinnerService) {
    this.spinner.hide();
  }

  ngOnInit() {
    this.spinner.show();
    this.servicio.ObtenerUsuarioActual().subscribe(
      (respuesta) => {
        this.IdUsuario = respuesta.Id;
        this.servicio.ObtenerRecepcionesServicios(this.IdUsuario).subscribe(
          (respuesta) => {
            this.ObjRecepcionServicios = RecepcionServicios.fromJsonList(respuesta);
            this.spinner.hide();
          }, err => {
            this.mostrarError('Error obteniendo las entradas de las recepciones de servicios');
            this.spinner.hide();
            console.log('Error obteniendo las entradas de las recepciones de servicios: ' + err);
          }
        );
      }, err => {
        this.mostrarError('Error obteniendo el usuario actual');
        this.spinner.hide();
        console.log('Error obteniendo el usuario actual: ' + err);
      }
    )
  }

  Guardar(item) {
    this.spinner.show();
    this.IdRecepcionServicios = item.IdRecepcionServicios;
    let objRegistrar;
    objRegistrar = {
      NumeroRecepcion: item.NumeroRecepcion,
      recibidoSap: true,
    }
    if (item.NumeroRecepcion == null) {
      this.mostrarAdvertencia('Debe suministrar el número de recepción');
      this.spinner.hide();
      return false;
    }
    else {
      let index = this.ObjRecepcionServicios.findIndex(x => x.IdRecepcionServicios === item.IdRecepcionServicios);
      this.servicio.registrarRecepcionServicios(this.IdRecepcionServicios, objRegistrar).then(
        (resultado: ItemAddResult) => {
          this.MostrarExitoso('Recibido');
          this.ObjRecepcionServicios.splice(index, 1);
          this.spinner.hide();
        }
      ).catch(
        (error) => {
          console.log(error);
          this.spinner.hide();
        }
      )
    }
  }

  MostrarExitoso(mensaje: string) {
    this.toastr.successToastr(mensaje, 'Confirmación!');
  }

  mostrarAdvertencia(mensaje: string) {
    this.toastr.warningToastr(mensaje, 'Validación');
  }

  mostrarError(mensaje: string) {
    this.toastr.errorToastr(mensaje, 'Oops!');
  }
}

