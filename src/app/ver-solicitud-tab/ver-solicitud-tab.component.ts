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
import { Solicitud } from '../dominio/solicitud';

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
  RutaArchivo: string;
  tipoSolicitud: string;
  numOrdenEstadistica: string;
  solicitante: string;
  comentarioregistroactivos: string;
  ordenadorGasto: string;
  OrdenEstadistica: boolean;
  empresa: string;
  loading: boolean;
  pais: string;
  categoria: string;
  subCategoria: string;
  comprador: string;
  codAriba: string;
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
  solicitudRecuperada: Solicitud;

  constructor(private servicio: SPServicio, private formBuilder: FormBuilder, private router: Router) { 
    this.loading = false;
    this.solicitudRecuperada = JSON.parse(sessionStorage.getItem('solicitud'));
    this.IdSolicitud = this.solicitudRecuperada.id;
  }

  ngOnInit() {
    this.loading = true;
    if(this.solicitudRecuperada.tipoSolicitud != null){
      if(this.solicitudRecuperada.tipoSolicitud != "Sondeo"){
        this.deshabilitarTabsSondeo();
      }else{
        this.habilitarTabsSondeo();
      }
    }

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
        this.subCategoria = solicitud.Subcategoria;
        this.comprador = solicitud.Comprador.Title;
        this.codAriba = solicitud.CodigoAriba;
        this.alcance = solicitud.Alcance;
        this.resultadosondeo = solicitud.ResultadoSondeo;
        this.comentariorevisionsondeo = solicitud.ComentarioRevisionSondeo;
        this.justificacion = solicitud.Justificacion;
        this.OrdenEstadistica = solicitud.OrdenEstadistica;
        this.comentariosolicitudsondeo = solicitud.ComentarioSondeo;
        this.comentarioregistroactivos = solicitud.ComentarioRegistroActivos;
        this.comentarioverificarmaterial = solicitud.ComentarioVerificarMaterial;
        this.numOrdenEstadistica = solicitud.NumeroOrdenEstadistica;
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
          }
        );
        this.servicio.ObtenerContratos(this.IdSolicitud).subscribe(
          RespuestaCondiciones => {
            this.ObjContratos = Contratos.fromJsonList(RespuestaCondiciones);
          }
        );
        this.servicio.ObtenerCondicionesTecnicasServicios(this.IdSolicitud).subscribe(
          RespuestaCondicionesServicios => {

            this.ObjCondicionesTecnicasServicios = CondicionTecnicaServicios.fromJsonList(RespuestaCondicionesServicios);
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

  habilitarTabsSondeo(){
    this.staticTabs.tabs[1].disabled = false;
    this.staticTabs.tabs[2].disabled = false;
}

  deshabilitarTabsSondeo(){
      this.staticTabs.tabs[1].disabled = true;
      this.staticTabs.tabs[2].disabled = true;
  }

  anterior(tabId: number) {
    if(tabId == 3 && this.solicitudRecuperada.tipoSolicitud != null && this.solicitudRecuperada.tipoSolicitud != "Sondeo"){
      tabId = tabId - 3;
      this.staticTabs.tabs[tabId].active = true;
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }else{
      tabId = tabId - 1;
      this.staticTabs.tabs[tabId].active = true;
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
  }

  siguiente(tabId: number){
    if(tabId == 0 && this.solicitudRecuperada.tipoSolicitud != null && this.solicitudRecuperada.tipoSolicitud != "Sondeo"){
      tabId = tabId + 3;
      this.staticTabs.tabs[tabId].active = true;
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }else{
      tabId = tabId + 1;
      this.staticTabs.tabs[tabId].active = true;
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
  }

  redireccionarContratos() {
    sessionStorage.setItem('Idsolicitud', this.IdSolicitud);
    this.router.navigate(["/contratos"])
  }

}
