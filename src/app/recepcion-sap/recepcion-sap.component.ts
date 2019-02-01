import { Component, OnInit } from '@angular/core';
import { RecepcionBienes } from '../recepcion-sap/RecepcionBienes'
import { SPServicio } from '../servicios/sp-servicio';
import { FormControl, FormGroup } from '@angular/forms';
import { ItemAddResult } from 'sp-pnp-js';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Contratos } from '../recepcion-sap/contratos';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-recepcion-sap',
  templateUrl: './recepcion-sap.component.html',
  styleUrls: ['./recepcion-sap.component.css']
})

export class RecepcionSapComponent implements OnInit {
  numRecepcion = new FormControl('');
  IdSolicitudParms: any;
  responsable: any;
  cantidad: any;
  valor: string;
  comentarios: string;
  ObjRecepcionBienes: any[] = [];
  objContratos: Contratos[] = [];
  IdSolicitud: number;
  recepcionBienes: FormGroup;
  IdRecepcionBienes: number;
  IdUsuario: any;
  fulldatos: any;
  numRecepcionValor: string;

  constructor(private servicio: SPServicio, public toastr: ToastrManager, private spinner: NgxSpinnerService) {
    this.spinner.hide();
  }

  ngOnInit() {
    this.spinner.show();
    this.servicio.ObtenerUsuarioActual().subscribe(
      (respuesta) => {
        this.IdUsuario = respuesta.Id;
        this.servicio.ObtenerRecepcionesBienes(this.IdUsuario).subscribe(
          (respuesta) => {
            this.ObjRecepcionBienes = RecepcionBienes.fromJsonList(respuesta);
            console.log();
            this.spinner.hide();
          }, err => {
            this.mostrarError('Error obteniendo las entradas de las recepciones de bienes');
            this.spinner.hide();
            console.log('Error obteniendo las entradas de las recepciones de bienes: ' + err);
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
    this.IdRecepcionBienes = item.IdRecepcionBienes;
    let objRegistrar;
    objRegistrar = {
      NumeroRecepcion: item.NumeroRecepcion,
      recibidoSap: true
    }
    if (item.NumeroRecepcion == null) {
      this.mostrarAdvertencia('Debe suministrar el número de recepción');
      this.spinner.hide();
      return false;
    }
    else {
      let index = this.ObjRecepcionBienes.findIndex(x => x.IdRecepcionBienes === item.IdRecepcionBienes);
      this.servicio.registrarRecepcionBienes(this.IdRecepcionBienes, objRegistrar).then(
        (resultado: ItemAddResult) => {
          this.MostrarExitoso('Recibido');
          this.ObjRecepcionBienes.splice(index, 1);
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
