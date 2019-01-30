import { Component, OnInit } from '@angular/core';
import { RecepcionBienes } from '../recepcion-sap/RecepcionBienes'
import { SPServicio } from '../servicios/sp-servicio';
import { FormControl, FormGroup } from '@angular/forms';
import { ItemAddResult } from 'sp-pnp-js';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Contratos } from '../recepcion-sap/contratos';
 
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
  ObjRecepcionBienes: any[]=[];
  objContratos: Contratos []=[];
  IdSolicitud: number;
  recepcionBienes: FormGroup;
  IdRecepcionBienes: number;
  IdUsuario: any;
  fulldatos: any;
  
constructor(private servicio: SPServicio, public toastr: ToastrManager) {}

ngOnInit() {
  this.servicio.ObtenerUsuarioActual().subscribe(
    (respuesta) => {
      this.IdUsuario = respuesta.Id;
      this.servicio.ObtenerRecepcionesBienes(this.IdUsuario).subscribe(
        (respuesta) => {
          this.ObjRecepcionBienes = RecepcionBienes.fromJsonList(respuesta);
        }
      );
    }
  )
}  

  Guardar(item) {
    console.log(this.numRecepcion.value);
    item.NumeroRecepcion = this.numRecepcion.value;
    this.IdRecepcionBienes = item.IdRecepcionBienes;
    let objRegistrar;
    objRegistrar = {
      NumeroRecepcion: item.NumeroRecepcion,
      recibidoSap: true
    }
    if (this.numRecepcion.value == null) {
      this.mostrarAdvertencia('Debe suministrar el número de recepción');
      return false;
    }
    else{
    let index = this.ObjRecepcionBienes.findIndex(x=> x.IdRecepcionBienes === item.IdRecepcionBienes);
    this.servicio.registrarRecepcionBienes(this.IdRecepcionBienes, objRegistrar).then(
      (resultado: ItemAddResult) => {
       this.MostrarExitoso('Recibido');
        this.ObjRecepcionBienes.splice(index, 1);
        this.numRecepcion.setValue(null);
      }
    ).catch(
      (error) => {
        console.log(error);
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
}
