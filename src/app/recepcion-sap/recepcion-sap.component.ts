import { Component, OnInit } from '@angular/core';
import { RecepcionBienes } from '../recepcion-sap/RecepcionBienes'
import { SPServicio } from '../servicios/sp-servicio';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ItemAddResult } from 'sp-pnp-js';
import { RecepcionServicios } from '../recepcion-sap/RecepcionServicios';
import { ToastrManager } from 'ng6-toastr-notifications';
import { forEach } from '@angular/router/src/utils/collection';
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
  
 
constructor(private servicio: SPServicio, private formBuilder: FormBuilder, public toastr: ToastrManager, private activarRoute: ActivatedRoute) {
  
 }

  Guardar(item) {
    this.IdRecepcionBienes = item.IdRecepcionBienes;
    let objRegistrar;
    objRegistrar = {
      NumeroRecepcion: this.numRecepcion.value,
      recibidoSap: true
    }
    if (this.numRecepcion.value === "" || this.numRecepcion.value === null || this.numRecepcion.value === undefined) {
      this.mostrarAdvertencia('Debe suministrar el número de recepción')
    }
    else{
    let index = this.ObjRecepcionBienes.findIndex(x=> x.IdRecepcionBienes === item.IdRecepcionBienes);
    this.servicio.registrarRecepcionBienes(this.IdRecepcionBienes, objRegistrar).then(
      (resultado: ItemAddResult) => {
       this.MostrarExitoso('Recibido');
        this.ObjRecepcionBienes.splice(index, 1);
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    )
  }
}
  ngOnInit() {

    this.servicio.ObtenerUsuarioActual().subscribe(
      (respuesta) => {
        this.IdUsuario = respuesta.Id;
        this.servicio.ObtenerRecepcionesBienes(this.IdUsuario).subscribe(
          (respuesta) => {
            this.ObjRecepcionBienes = RecepcionBienes.fromJsonList(respuesta);
            this.servicio.ObtenerContratos(this.IdUsuario).subscribe(
              (respuesta) => {
                this.objContratos = Contratos.fromJsonList(respuesta);
                // let fulldatos = this.ObjRecepcionBienes.concat(this.objContratos)
                // console.log(fulldatos);
                // for(let i = 0; i < this.objContratos.length; i++ ) {
                //   this.ObjRecepcionBienes.push(this.objContratos[i]);
                // }
                
                this.ObjRecepcionBienes.push.apply(this.ObjRecepcionBienes, this.objContratos);
                console.log(this.ObjRecepcionBienes);
              }  
            );
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
