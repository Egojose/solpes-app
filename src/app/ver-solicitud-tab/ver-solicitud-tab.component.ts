import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { CondicionContractual } from '../dominio/condicionContractual';
import { CondicionesTecnicasBienes } from '../verificar-material/condicionTecnicaBienes';
import { RecepcionBienes } from '../ver-solicitud-tab/recepcionBienes';
import { RecepcionServicios } from '../ver-solicitud-tab/recepcionServicios';
import { FormGroup } from '@angular/forms';
import { CondicionTecnicaServicios } from '../verificar-material/condicionTecnicaServicios';
import { Contratos } from '../dominio/contrato';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Solicitud } from '../dominio/solicitud';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { resultadoCondicionesTS } from '../dominio/resultadoCondicionesTS';
import { resultadoCondicionesTB } from '../dominio/resultadoCondicionesTB';

@Component({
  selector: 'app-ver-solicitud-tab',
  templateUrl: './ver-solicitud-tab.component.html',
  styleUrls: ['./ver-solicitud-tab.component.css']
})

export class VerSolicitudTabComponent implements OnInit {
  @ViewChild('staticTabs') staticTabs: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  panelOpenState = false;
  ObjSolicitud: any;
  condicionesContractuales: CondicionContractual[] = [];
  fechaDeseada: Date;
  fechaEnvio: Date;
  fechaRegistroSolpSap: Date; 
  direccion:string
  dataSource;
  DSBienesxContrato;
  DSServiciosxContrato;
  contratoMarco: string;
  moneda: string;
  RutaArchivo: string;
  RegistroActivoArchivo: string;
  tipoSolicitud: string;
  numOrdenEstadistica: string;
  existenServicios: boolean;
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
  existenBienes: boolean;
  estadoRegistrarSAP: string;
  ArchivoAdjunto: boolean;
  ArchivoAdjuntoActivos: boolean;
  numSolSAP: number;
  consecutivo: number;
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
  fueSondeo: boolean;
  contratoId: any;
  displayedColumnsV: string[] = ["codigo", "descripcion", "modelo", "fabricante", "cantidad", "existenciasverificar", "numreservaverificar", "cantidadreservaverificar"];
  displayedColumnsService: string[] = ["codigo", "descripcion", "cantidad", "valorEstimado", "moneda"];
  displayedColumnsBienes: string[] = ["codigo", "descripcion", "modelo", "fabricante", "cantidad", "valorEstimado", "moneda"];
  displayedColumns: string[] = [
    "codigo",
    "descripcion",
    "modelo",
    "fabricante",
    "cantidad",
    "valorEstimado",
    "moneda"
  ];
  modalRef: BsModalRef;
  numeroContrato: any;
  ObjCondicionesTS: resultadoCondicionesTS[] = [];
  ObjCondicionesTB: resultadoCondicionesTB[] = [];
  CTS: boolean;
  CTB: boolean;

  constructor(private servicio: SPServicio, private router: Router, private spinner: NgxSpinnerService, public toastr: ToastrManager, private modalService: BsModalService,) {
    this.solicitudRecuperada = JSON.parse(sessionStorage.getItem('solicitud'));
    if (this.solicitudRecuperada == null) {
      this.mostrarAdvertencia("No se puede realizar esta acción");
      this.router.navigate(['/mis-solicitudes']);
    }
    this.IdSolicitud = this.solicitudRecuperada.id;
    this.existenBienes = false;
    this.existenServicios = false;
    this.ArchivoAdjunto = false;
    this.ArchivoAdjuntoActivos = false;
  }

  mostrarAdvertencia(mensaje: string) {
    this.toastr.warningToastr(mensaje, 'Validación');
  }

  ngOnInit() {
    this.spinner.show();
    console.log(this.solicitudRecuperada.estado);
    this.ValidacionTabsPorEstado();
    this.servicio.ObtenerSolicitudBienesServicios(this.IdSolicitud).subscribe(
      solicitud => {
        this.fechaDeseada = solicitud.FechaDeseadaEntrega;
        this.fechaEnvio = solicitud.FechaDeCreacion;
        this.fechaRegistroSolpSap = solicitud.FechaRegistrarSolpsap
        this.direccion = solicitud.OrdenadorGastos.Department;
        this.moneda = solicitud.TipoMoneda;
        this.tipoSolicitud = solicitud.TipoSolicitud;
        this.solicitante = solicitud.Solicitante;
        this.ordenadorGasto = solicitud.OrdenadorGastos.Title;
        this.contratoMarco = solicitud.CM;
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
        this.consecutivo = solicitud.Consecutivo;
        this.comentarioRegistrarSAP = solicitud.ComentarioRegistrarSAP;
        if (solicitud.Attachments === true) {
          let ObjArchivos = solicitud.AttachmentFiles.results;
          ObjArchivos.forEach(element => {
            let objSplit = element.FileName.split("-");
            if (objSplit.length > 0) {
              let TipoArchivo = objSplit[0];
              if (TipoArchivo === "ActivoVM") {
                this.RutaArchivo = element.ServerRelativeUrl;
                this.ArchivoAdjunto = true;
              }
              if (TipoArchivo === "RegistroActivo") {
                this.RegistroActivoArchivo = element.ServerRelativeUrl;
                this.ArchivoAdjuntoActivos = true;
              }
            }
          });
        }
        if (solicitud.CondicionesContractuales != null) {
          
          this.condicionesContractuales = JSON.parse(solicitud.CondicionesContractuales.replace(/(\r\n|\n|\r|\t)/gm, "")).condiciones;
        }
        this.servicio.ObtenerCondicionesTecnicasBienes(this.IdSolicitud).subscribe(
          RespuestaCondiciones => {
            if (RespuestaCondiciones.length > 0) {
              this.existenBienes = true;
              this.ObjCondicionesTecnicas = CondicionesTecnicasBienes.fromJsonList(RespuestaCondiciones);
              this.dataSource = new MatTableDataSource(this.ObjCondicionesTecnicas);
              this.dataSource.paginator = this.paginator;
            }
            this.spinner.hide();
          }
        );
        this.servicio.ObtenerContratos(this.IdSolicitud).subscribe(
          RespuestaContratos => {
            if(RespuestaContratos.length > 0 ){
            this.ObjContratos = Contratos.fromJsonList(RespuestaContratos);
            this.tieneContrato = true;
          }
            this.spinner.hide();
          }
        );
        this.servicio.ObtenerCondicionesTecnicasServicios(this.IdSolicitud).subscribe(
          RespuestaCondicionesServicios => {
            if (RespuestaCondicionesServicios.length > 0) {
              this.existenServicios = true;
              this.ObjCondicionesTecnicasServicios = CondicionTecnicaServicios.fromJsonList(RespuestaCondicionesServicios);
            }
            this.spinner.hide();
          }
        );
        this.servicio.ObtenerRecepcionesBienesEntregaBienes(this.IdSolicitud).subscribe(
          (respuesta) => {
            this.ObjRecepcionBienes = RecepcionBienes.fromJsonList(respuesta);
            this.spinner.hide();
          }
        );
        this.servicio.ObtenerRecepcionesServicioEntregaServicio(this.IdSolicitud).subscribe(
          (respuesta) => {
            this.ObjRecepcionServicios = RecepcionServicios.fromJsonList(respuesta);
            this.spinner.hide();
          }
        );
        this.spinner.hide();
      }
    );
  }

  abrirBienesServicios(template: TemplateRef<any>, idContrato){

    this.spinner.show();
    this.contratoId = idContrato;
    this.numeroContrato = this.ObjContratos.filter(x => x.IdContratos == this.contratoId)[0].numeroContrato
    this.DSServiciosxContrato = "";
    this.DSBienesxContrato = "";
    this.CTB = false; 
    this.CTS = false;
    this.servicio.ObtenerCondicionesTecnicasBienesxContrato(this.contratoId.toString()).subscribe(
      RespuestaCondiciones => {
        if (RespuestaCondiciones.length > 0) {            
          this.CTB = true;        
          let ObjCondicionesTB = resultadoCondicionesTB.fromJsonList(RespuestaCondiciones);
          this.DSBienesxContrato = new MatTableDataSource(ObjCondicionesTB);
          this.DSBienesxContrato.paginator = this.paginator;
        }
        this.servicio.ObtenerCondicionesTecnicasServiciosxContrato(this.contratoId.toString()).subscribe(
          RespuestaCondicionesServicios => {
            if (RespuestaCondicionesServicios.length > 0) {  
              this.CTS = true;
              let ObjCondicionesTS= resultadoCondicionesTS.fromJsonList(RespuestaCondicionesServicios);
              this.DSServiciosxContrato = new MatTableDataSource(ObjCondicionesTS);
              this.DSServiciosxContrato.paginator = this.paginator;
            }
            this.spinner.hide();
            this.modalRef = this.modalService.show(template, { class: 'gray modal-lg' });            
          }
        );        
      }
    );
      
  }

  ValidacionTabsPorEstado(): any {
    this.DeshabilitarTodosLosTabs();
    switch (this.solicitudRecuperada.estado) {
      case 'Borrador': {
        this.HabilitarTabInformacionSolicitud();
        break;
      }
      case 'Por sondear': {
        this.HabilitarTabSondeo();
        break;
      }
      case 'Por aprobar sondeo': {
        this.HabilitarTabAprobarSondeo();
        break;
      }
      case 'Por verificar material': {
        this.HabilitarTabVerificarMaterial();
        break;
      }
      case 'Por registrar activos': {
        this.HabilitarTabRegistroActivos();
        break;
      }
      case 'Por registrar solp sap': {
        this.HabilitarTabRegistrarSolpSAP();
        break;
      }
      case 'Por registrar contratos': {
        this.HabilitarTabContratos();
        break;
      }
      case 'Suspendida': {
        this.HabilitarTabContratos();
        break;
      }
      case 'Formalizar firmas contrato': {
        this.HabilitarTabEntregas();
        break;
      }
      case 'Por recepcionar': {
        this.HabilitarTabEntregas();
      }
      case 'Recibido': {
        this.HabilitarTodosLosTabs();
        this.ValidacionSondeo();      }
    }
  }

  private DeshabilitarTodosLosTabs() {
    for (let i = 0; i < 8; i++) {
      this.staticTabs.tabs[i].disabled = true;
    }
  }
  private HabilitarTodosLosTabs() {
    for (let i = 0; i < 8; i++) {
      this.staticTabs.tabs[i].disabled = false;
    }
  }

  private HabilitarTabInformacionSolicitud() {
    this.staticTabs.tabs[0].disabled = false;
  }

  private HabilitarTabSondeo() {
    this.HabilitarTabInformacionSolicitud();
    this.staticTabs.tabs[1].disabled = false;
  }

  private HabilitarTabAprobarSondeo() {
    this.HabilitarTabSondeo();
    this.staticTabs.tabs[2].disabled = false;
  }

  private HabilitarTabVerificarMaterial() {
    this.HabilitarTabInformacionSolicitud();
    this.ValidacionSondeo();
    this.staticTabs.tabs[3].disabled = false;
  }

  private HabilitarTabRegistroActivos() {
    this.HabilitarTabVerificarMaterial();
    this.staticTabs.tabs[4].disabled = false;
  }

  private HabilitarTabRegistrarSolpSAP() {
    this.HabilitarTabRegistroActivos();
    this.staticTabs.tabs[5].disabled = false;
  }

  private HabilitarTabContratos() {
    this.HabilitarTabRegistrarSolpSAP();
    this.staticTabs.tabs[6].disabled = false;
  }

  private HabilitarTabEntregas() {
    this.HabilitarTabContratos();
    this.staticTabs.tabs[7].disabled = false;
  }

  private ValidacionSondeo() {
    if (this.solicitudRecuperada.FueSondeo != null) {
      if (this.solicitudRecuperada.FueSondeo) {
        this.habilitarTabsSondeo();
      }
      else {
        this.deshabilitarTabsSondeo();
      }
    }
  }

  habilitarTabsSondeo() {
    this.staticTabs.tabs[1].disabled = false;
    this.staticTabs.tabs[2].disabled = false;
  }

  deshabilitarTabsSondeo() {
    this.staticTabs.tabs[1].disabled = true;
    this.staticTabs.tabs[2].disabled = true;
  }

  anterior(tabId: number) {
    if (tabId == 3 && this.solicitudRecuperada.tipoSolicitud != null && this.solicitudRecuperada.tipoSolicitud != "Sondeo") {
      tabId = tabId - 3;
      this.staticTabs.tabs[tabId].active = true;
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    } else {
      tabId = tabId - 1;
      this.staticTabs.tabs[tabId].active = true;
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
  }

  siguiente(tabId: number) {
    if (tabId == 0 && this.solicitudRecuperada.tipoSolicitud != null && this.solicitudRecuperada.tipoSolicitud != "Sondeo" && this.solicitudRecuperada.FueSondeo == false) {
      tabId = tabId + 3;
      this.staticTabs.tabs[tabId].active = true;
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    } else {
      tabId = tabId + 1;
      this.staticTabs.tabs[tabId].active = true;
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
  }
}
