import { Component, OnInit, ViewChild } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { CondicionContractual } from '../dominio/condicionContractual';
import { CondicionesTecnicasBienes } from '../registrar-solp-sap/condicionesTecnicasBienes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CondicionTecnicaServicios } from '../registrar-solp-sap/condicionesTecnicasServicios';
import { ItemAddResult } from 'sp-pnp-js';
import { ActivatedRoute, Router } from '@angular/router';
import { timeout } from 'q';

@Component({
  selector: 'app-registrar-solp-sap',
  templateUrl: './registrar-solp-sap.component.html',
  styleUrls: ['./registrar-solp-sap.component.css']
})
export class RegistrarSolpSapComponent implements OnInit {
  @ViewChild('customTooltip') tooltip: any;
  @ViewChild('customTooltip1') tooltip1: any;
  ObjSolicitud: any;
  condicionesContractuales: CondicionContractual[] = [];
  fechaDeseada: Date;
  solicitante: string;
  ordenadorGasto: string;
  empresa: string;
  pais: string;
  categoria: string;
  subCategoria: string;
  comprador: string;
  justificacion: string;
  alcance: string;
  ObjCondicionesContractuales: any;
  IdSolicitud: any;
  ObjCondicionesTecnicas: CondicionesTecnicasBienes[] = [];
  ObjCondicionesTecnicasServicios: CondicionTecnicaServicios[] = [];
  AgregarElementoForm: FormGroup;
  RDBOrdenadorGastos: any;
  numeroSolpSap: string;
  ComentarioRegistrarSap: string;
  submitted = false;
  IdSolicitudParms: any;
  loading: boolean;
 

 constructor(private servicio: SPServicio, private formBuilder: FormBuilder, private activarRoute: ActivatedRoute, private router: Router) {
  this.IdSolicitudParms = sessionStorage.getItem("IdSolicitud");
    this.loading = false;
 }


  GuardarSolSAP() {
    let ObjSolpSap;

    if (this.RDBOrdenadorGastos === undefined) {
      alert("debe seleccionar un ordenador de gastos")
    }
    if (this.RDBOrdenadorGastos !== undefined) {
      if (this.RDBOrdenadorGastos === 1 && this.numeroSolpSap === undefined) {
        this.tooltip.show();
        setTimeout(() => {
          this.tooltip.hide();
        }, 3000);

        return false;
      }
      else if (this.RDBOrdenadorGastos === 1) {
        ObjSolpSap = {
          EstadoRegistrarSAP: "Aprobado",
          NumSolSAP: this.numeroSolpSap
        }
      }
      else if (this.RDBOrdenadorGastos === 2 && this.ComentarioRegistrarSap === undefined) {
        this.tooltip1.show();
        setTimeout(() => {
          this.tooltip1.hide();
        }, 3000);
        // alert('Debe especificar el motivo en comentarios');
        return false;
      }
      else if (this.RDBOrdenadorGastos === 2) {
        ObjSolpSap = {
          EstadoRegistrarSAP: "Rechazado",
          ComentarioRegistrarSAP: this.ComentarioRegistrarSap
        }
      }
      else if (this.RDBOrdenadorGastos === 3) {
        ObjSolpSap = {
          EstadoRegistrarSAP: "No tiene presupuesto disponible",
          ComentarioRegistrarSAP: this.ComentarioRegistrarSap
        }
      }
        this.servicio.guardarSOLPSAP(this.IdSolicitud, ObjSolpSap).then(
        (resultado: ItemAddResult) => {
          alert('se registro la SOLPE')
          this.salir();
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      )
    }
  }

  
  salir() {
    this.router.navigate(["/mis-pendientes"]);
  }


  ngOnInit() {
    this.servicio.ObtenerSolicitudBienesServicios(this.IdSolicitudParms).subscribe(
      solicitud => {
        this.IdSolicitud = solicitud.Id;
        this.fechaDeseada = solicitud.FechaDeseadaEntrega;
        this.solicitante = solicitud.Solicitante;
        this.ordenadorGasto = solicitud.OrdenadorGastos.Title;
        this.empresa = solicitud.Empresa.Title;
        this.pais = solicitud.Pais.Title;
        this.categoria = solicitud.Categoria;
        this.subCategoria = solicitud.Categoria;
        this.comprador = solicitud.Comprador;
        this.alcance = solicitud.Alcance;
        this.justificacion = solicitud.Justificacion;
        this.condicionesContractuales = JSON.parse(solicitud.CondicionesContractuales).condiciones;
        this.servicio.ObtenerCondicionesTecnicasBienes(this.IdSolicitud).subscribe(
          RespuestaCondiciones => {
            this.ObjCondicionesTecnicas = CondicionesTecnicasBienes.fromJsonList(RespuestaCondiciones);
            console.log(this.ObjCondicionesTecnicas);
          }
        )
        this.servicio.ObtenerCondicionesTecnicasServicios(this.IdSolicitud).subscribe(
          RespuestaCondicionesServicios => {

            this.ObjCondicionesTecnicasServicios = CondicionTecnicaServicios.fromJsonList(RespuestaCondicionesServicios);
            console.log(this.ObjCondicionesTecnicasServicios);
          }
        )
      }
    );
  }
}