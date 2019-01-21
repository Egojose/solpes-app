import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { CondicionContractual } from '../dominio/condicionContractual';
import { CondicionesTecnicasBienes } from '../aprobar-sondeo/condicionesTecnicasBienes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CondicionTecnicaServicios } from '../aprobar-sondeo/condicionesTecnicasServicios';
import { ActivatedRoute } from '@angular/router';
import { ItemAddResult } from 'sp-pnp-js';
import { Usuario } from '../dominio/usuario';


@Component({
  selector: 'app-aprobar-sondeo',
  templateUrl: './aprobar-sondeo.component.html',
  styleUrls: ['./aprobar-sondeo.component.css']
})
export class AprobarSondeoComponent implements OnInit {
  @ViewChild('customTooltip') tooltip: any;
  @ViewChild('customTooltip1') tooltip1: any;
  @ViewChild('customTooltip2') tooltip2: any;
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
  JustificacionSondeo: string;
  numeroSolpCm: string;
  submitted = false;
  IdSolicitudParms: any;
  RDBsondeo: any;
  ComentarioSondeo: string;
  justificacionSondeo: string;
  historial: string;
  comentarioSondeo: string;
  usuario: Usuario;
  loading: boolean;
 
  constructor(private servicio: SPServicio, private formBuilder: FormBuilder, private activarRoute: ActivatedRoute) {
    this.IdSolicitudParms = sessionStorage.getItem("IdSolicitud");
    this.loading = false;
   }


   GuardarRevSondeo() {
    let fecha =  new Date();
    let dia = ("0" + fecha.getDate()).slice(-2);
    let mes = ("0" + (fecha.getMonth() + 1)).slice(-2);
    let año = fecha.getFullYear();
    let fechaFormateada = dia + "/" + mes + "/" + año;
    
    let ObjSondeo;
    if (this.RDBsondeo === undefined) {
      alert("debe seleccionar un ordenador de gastos")
    }
    if (this.RDBsondeo !== undefined) {
      if (this.RDBsondeo === 1 && this.ComentarioSondeo === undefined) {
        this.tooltip.show();
        setTimeout(() => {
          this.tooltip.hide();
        }, 3000);

        return false;
      }
      else if (this.RDBsondeo === 1) {
        ObjSondeo = {
          Estado: "Por aprobar sondeo",
          ResultadoSondeo: "Sondeo adicional",
          ComentarioSondeo: this.comentarioSondeo + '\n' + fechaFormateada + ' ' + this.usuario.nombre + ':' + ' ' + this.ComentarioSondeo
        }
      }
      else if (this.RDBsondeo === 2 && this.justificacionSondeo === undefined) {
        this.tooltip1.show();
        setTimeout(() => {
          this.tooltip1.hide();
        }, 3000);

        return false;
      }
      
      else if (this.RDBsondeo === 2) {
        ObjSondeo = {
          // Estado: "Por verificar material"
          ResultadoSondeo: "Convertir en SOLP",
          Justificacion: this.justificacionSondeo
        }
      }
      else if (this.RDBsondeo === 3) {
        ObjSondeo = {
          ResultadoSondeo: "Descartar",
        }
      }
      if(this.RDBsondeo === 4 && this.justificacionSondeo === undefined) {
        this.tooltip1.show();
        setTimeout(() => {
          this.tooltip1.hide();
        }, 3000);

        return false;
      }
      else if (this.RDBsondeo === 4) {
        ObjSondeo = {
          // Estado:
          ResultadoSondeo: "Convertir en CM",
          Justificacion: this.justificacionSondeo
        }
      }
        this.servicio.guardarRegSondeo(this.IdSolicitud, ObjSondeo).then(
        (resultado: ItemAddResult) => {
          alert('se guardó el sondeo')
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      )
    }
  }

  ngOnInit() {
    this.ObtenerUsuarioActual();
  }

  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        this.usuario = new Usuario(Response.Title, Response.email,Response.Id);
        this.ObtenerSolicitudBienesServicios();
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
      }
    )
  }

  ObtenerSolicitudBienesServicios(){
    this.servicio.ObtenerSolicitudBienesServicios(this.IdSolicitudParms).subscribe(
      solicitud => {
        this.IdSolicitud = solicitud.Id;
        this.historial = solicitud.ComentarioSondeo;
        this.fechaDeseada = solicitud.FechaDeseadaEntrega;
        this.solicitante = solicitud.Solicitante;
        this.ordenadorGasto = solicitud.OrdenadorGastos.Title;
        this.empresa = solicitud.Empresa.Title;
        this.pais = solicitud.Pais.Title;
        this.categoria = solicitud.Categoria;
        this.subCategoria = solicitud.Categoria;
        this.comprador = solicitud.Comprador;
        this.alcance = solicitud.Alcance;
        this.comentarioSondeo = solicitud.ComentarioSondeo;
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