import { Component, OnInit } from '@angular/core';
import { RecepcionBienes } from '../recepcion-sap/RecepcionBienes'
import { SPServicio } from '../servicios/sp-servicio';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ItemAddResult } from 'sp-pnp-js';
import { RecepcionServicios } from '../recepcion-sap/RecepcionServicios';

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
  ObjRecepcionBienes: RecepcionBienes[]=[];
  IdSolicitud: number;
  ObjRecepcionServicios: any;
  recepcionBienes: FormGroup;
  IdRecepcionBienes: any;
 
constructor(private servicio: SPServicio, private formBuilder: FormBuilder, private activarRoute: ActivatedRoute) {
  
 }

  Guardar(item) {
    this.IdRecepcionBienes = item.IdRecepcionBienes;
    let objRegistrar;
    objRegistrar = {
      NumeroRecepcion: this.numRecepcion.value,
      recibidoSap: true
    }

    if (this.numRecepcion.value === "" || this.numRecepcion.value === null || this.numRecepcion.value === undefined) {
      alert('Debe suministrar el numero de recpción')
    }
    let index = this.ObjRecepcionBienes.findIndex(x=> x.IdRecepcionBienes === item.IdRecepcionBienes);
    this.servicio.registrarRecepcionBienes(this.IdRecepcionBienes, objRegistrar).then(
      (resultado: ItemAddResult) => {
        alert('Recibido')
        this.IdRecepcionBienes.splice(index, 1);
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    )
  }
  ngOnInit() {
    this.IdSolicitudParms = localStorage.getItem('IdSolicitud')
    this.servicio.ObtenerRecepcionesBienes(1).subscribe(
      (respuesta) => {
        this.ObjRecepcionBienes = RecepcionBienes.fromJsonList(respuesta);
        console.log(this.ObjRecepcionBienes)
      }
    );
  }  
}
