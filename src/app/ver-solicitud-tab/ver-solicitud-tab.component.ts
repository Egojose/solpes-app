import { Component, OnInit, ViewChild } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { CondicionContractual } from '../dominio/condicionContractual';
import { CondicionesTecnicasBienes } from '../verificar-material/condicionTecnicaBienes';
import { RecepcionBienes } from '../ver-solicitud-tab/recepcionBienes';
import { RecepcionServicios } from '../ver-solicitud-tab/recepcionServicios';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CondicionTecnicaServicios } from '../verificar-material/condicionTecnicaServicios';
import { Contratos } from '../dominio/contrato';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-solicitud-tab',
  templateUrl: './ver-solicitud-tab.component.html',
  styleUrls: ['./ver-solicitud-tab.component.css']
})

export class VerSolicitudTabComponent implements OnInit {
  @ViewChild('staticTabs') staticTabs: any;
  panelOpenState = false;
  ObjSolicitud: any;
  condicionesContractuales: CondicionContractual[] = [];
  fechaDeseada: Date;
  tipoSolicitud: string;
  solicitante: string;
  ordenadorGasto: string;
  empresa: string;
  loading: boolean;
  pais: string;
  categoria: string;
  subCategoria: string;
  comprador: string;
  justificacion: string;
  comentariosolicitudsondeo: string;
  comentarioverificarmaterial: string;
  alcance: string;
  resultadosondeo: string;
  comentariorevisionsondeo: string;
  estadoRegistrarSAP: string;
  numSolSAP: number;
  comentarioRegistrarSAP: string;
  tieneContrato: Boolean;
  ObjCondicionesContractuales: any;
  IdSolicitud: any;
  ObjCondicionesTecnicas: CondicionesTecnicasBienes[] = [];
  ObjCondicionesTecnicasServicios: CondicionTecnicaServicios[] = [];
  ObjRecepcionBienes: RecepcionBienes[] = [];
  ObjRecepcionServicios: RecepcionServicios[] = [];
  ObjContratos: Contratos[] = [];
  AgregarElementoForm: FormGroup;
  submitted = false;
  constructor(private servicio: SPServicio, private formBuilder: FormBuilder, private router: Router) { 
    this.loading = false;

  }

  recuperarIdSolicitud(){
    this.IdSolicitud = sessionStorage.getItem("IdSolicitud");
  }

  ngOnInit() {
    this.loading = true;
    this.recuperarIdSolicitud();
    this.servicio.ObtenerSolicitudBienesServicios(this.IdSolicitud).subscribe(
      solicitud => {
        this.IdSolicitud = solicitud.Id;
        this.fechaDeseada = solicitud.FechaDeseadaEntrega;
        this.tipoSolicitud = solicitud.TipoSolicitud;
        this.solicitante = solicitud.Solicitante;
        this.ordenadorGasto = solicitud.OrdenadorGastos.Title;
        this.empresa = solicitud.Empresa.Title;
        this.pais = solicitud.Pais.Title;
        this.categoria = solicitud.Categoria;
        this.subCategoria = solicitud.Categoria;
        this.comprador = solicitud.Comprador;
        this.alcance = solicitud.Alcance;
        this.resultadosondeo = solicitud.ResultadoSondeo;
        this.comentariorevisionsondeo = solicitud.ComentarioRevisionSondeo;
        this.justificacion = solicitud.Justificacion;
        this.comentariosolicitudsondeo = solicitud.ComentarioSondeo;
        this.comentarioverificarmaterial = solicitud.ComentarioVerificarMaterial;
        this.estadoRegistrarSAP = solicitud.EstadoRegistrarSAP;
        this.numSolSAP = solicitud.NumSolSAP;
        this.comentarioRegistrarSAP = solicitud.ComentarioRegistrarSAP;
        this.tieneContrato = solicitud.TieneContrato;

        if(solicitud.CondicionesContractuales != null){
          this.condicionesContractuales = JSON.parse(solicitud.CondicionesContractuales).condiciones;
        }
        
        this.servicio.ObtenerCondicionesTecnicasBienes(this.IdSolicitud).subscribe(
          RespuestaCondiciones => {
            this.ObjCondicionesTecnicas = CondicionesTecnicasBienes.fromJsonList(RespuestaCondiciones);
            console.log(this.ObjCondicionesTecnicas);
          }
        );
        this.servicio.ObtenerContratos(this.IdSolicitud).subscribe(
          RespuestaCondiciones => {
            this.ObjContratos = Contratos.fromJsonList(RespuestaCondiciones);
            console.log(this.ObjContratos);
          }
        );
        this.servicio.ObtenerCondicionesTecnicasServicios(this.IdSolicitud).subscribe(
          RespuestaCondicionesServicios => {

            this.ObjCondicionesTecnicasServicios = CondicionTecnicaServicios.fromJsonList(RespuestaCondicionesServicios);
            console.log(this.ObjCondicionesTecnicasServicios);
          }
        );
        this.servicio.ObtenerRecepcionesBienes(this.IdSolicitud).subscribe(
          (respuesta) => {
            this.ObjRecepcionBienes = RecepcionBienes.fromJsonList(respuesta);
          }
        );
        this.servicio.ObtenerRecepcionesServicios(this.IdSolicitud).subscribe(
          (respuesta) => {
            this.ObjRecepcionServicios = RecepcionServicios.fromJsonList(respuesta);
          }
        );
        this.loading = false;
      }
    );
  }

  selectTab(tabId: number) {
    this.staticTabs.tabs[tabId].active = true;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  redireccionarContratos() {
    sessionStorage.setItem('Idsolicitud', this.IdSolicitud);
    this.router.navigate(["/contratos"])
  }

}
