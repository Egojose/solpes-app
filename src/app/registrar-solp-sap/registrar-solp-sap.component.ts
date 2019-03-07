import { Component, OnInit, ViewChild } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { CondicionContractual } from '../dominio/condicionContractual';
import { CondicionesTecnicasBienes } from '../registrar-solp-sap/condicionesTecnicasBienes';
import { FormGroup } from '@angular/forms';
import { CondicionTecnicaServicios } from '../registrar-solp-sap/condicionesTecnicasServicios';
import { ItemAddResult } from 'sp-pnp-js';
import { Router } from '@angular/router';
import { responsableProceso } from '../dominio/responsableProceso';
import { ToastrManager } from 'ng6-toastr-notifications';
import { resultadoCondicionesTB } from '../dominio/resultadoCondicionesTB';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { Solicitud } from '../dominio/solicitud';
import { Usuario } from '../dominio/usuario';
@Component({
  selector: 'app-registrar-solp-sap',
  templateUrl: './registrar-solp-sap.component.html',
  styleUrls: ['./registrar-solp-sap.component.css']
})
export class RegistrarSolpSapComponent implements OnInit {
  @ViewChild('customTooltip') tooltip: any;
  @ViewChild('customTooltip1') tooltip1: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  tipoSolicitud: string;
  codigoAriba: string;
  contratoMarco: string;
  numOrdenEstadistica: string;
  compradorNombre: string;
  panelOpenState1 = false;
  panelOpenState2 = false;
  ObjSolicitud: any;
  condicionesContractuales: CondicionContractual[] = [];
  fechaDeseada: Date;
  solicitante: string;
  ordenadorGasto: string;
  empresa: string;
  pais: string;
  categoria: string;
  subCategoria: string;
  comprador: number;
  justificacion: string;
  alcance: string;
  OrdenEstadistica: boolean;
  ObjCondicionesContractuales: any;
  IdSolicitud: any;
  panelOpenState = false;
  ObjCondicionesTecnicasBienesLectura: CondicionesTecnicasBienes[] = [];
  ObjResultadosondeo: CondicionesTecnicasBienes[] = [];
  ObjCondicionesTecnicas: CondicionesTecnicasBienes[] = [];
  ObjCondicionesTecnicasServiciosLectura: CondicionTecnicaServicios[] = [];
  ObjCondicionesTecnicasServicios: CondicionTecnicaServicios[] = [];
  AgregarElementoForm: FormGroup;
  RDBOrdenadorGastos: any;
  numeroSolpSap: string;
  ComentarioRegistrarSap: string;
  submitted = false;
  IdSolicitudParms: any;
  loading: boolean;
  paisId: any;
  ObResProceso: responsableProceso[] = [];
  Autor: any;
  dataSource;
  dataSourceTS;
  CTS: boolean;
  CTB: boolean;
  displayedColumns: string[] = ["codigo", "descripcion", "modelo", "fabricante", "cantidad", "valorEstimado", "moneda"];
  displayedColumnsTS: string[] = ["codigo", "descripcion", "cantidad", "valorEstimado", "moneda"];

  RutaArchivo: string;
  existenBienes: boolean;
  existenServicios: boolean;
  ResponsableProceso: number;
  estadoSolicitud: string;
  FueSondeo: boolean;
  solicitudRecuperada: Solicitud;
  usuarioActual: Usuario;
  perfilacion: boolean;

  constructor(private servicio: SPServicio, public toastr: ToastrManager, private router: Router, private spinner: NgxSpinnerService) {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
    this.solicitudRecuperada = JSON.parse(sessionStorage.getItem('solicitud'));
    this.perfilacionEstado();
    this.IdSolicitudParms = this.solicitudRecuperada.id;
    this.spinner.hide();
    this.existenBienes = false;
    this.existenServicios = false;
    this.spinner.hide();
  }

  private perfilacionEstado() {
    if (this.solicitudRecuperada == null) {
      this.mostrarAdvertencia("No se puede realizar esta acción");
      this.router.navigate(['/mis-solicitudes']);
    }
    else {
      this.perfilacion = this.verificarEstado();
      if (this.perfilacion) {
        this.perfilacion = this.verificarResponsable();
        if (this.perfilacion) {
          console.log("perfilación correcta");
        }
        else {
          this.mostrarAdvertencia("Usted no está autorizado para esta acción: No es el responsable");
          this.router.navigate(['/mis-solicitudes']);
        }
      }
      else {
        this.mostrarAdvertencia("La solicitud no se encuentra en el estado correcto para registrar solp SAP");
        this.router.navigate(['/mis-solicitudes']);
      }
    }
  }

  verificarEstado(): boolean {
    if (this.solicitudRecuperada.estado == 'Por registrar solp sap') {
      return true;
    } else {
      return false;
    }
  }

  verificarResponsable(): boolean {
    if (this.solicitudRecuperada.responsable.ID == this.usuarioActual.id) {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit() {
    this.spinner.show();
    this.servicio.ObtenerSolicitudBienesServicios(this.IdSolicitudParms).subscribe(
      solicitud => {
        this.tipoSolicitud = solicitud.TipoSolicitud;
        this.contratoMarco = solicitud.CM;
        this.codigoAriba = solicitud.CodigoAriba;
        this.numOrdenEstadistica = solicitud.NumeroOrdenEstadistica;
        this.IdSolicitud = solicitud.Id;
        this.OrdenEstadistica = solicitud.OrdenEstadistica;
        this.fechaDeseada = solicitud.FechaDeseadaEntrega;
        this.solicitante = solicitud.Solicitante;
        this.ordenadorGasto = solicitud.OrdenadorGastos.Title;
        this.empresa = solicitud.Empresa.Title;
        this.pais = solicitud.Pais.Title;
        this.paisId = solicitud.Pais.Id;
        this.categoria = solicitud.Categoria;
        this.subCategoria = solicitud.Subcategoria;
        this.compradorNombre = solicitud.Comprador.Title;
        this.comprador = solicitud.Comprador.ID;
        this.alcance = solicitud.Alcance;
        this.justificacion = solicitud.Justificacion;
        this.Autor = solicitud.AuthorId;
        this.FueSondeo = solicitud.FueSondeo;
        if (solicitud.Attachments === true) {
          let ObjArchivos = solicitud.AttachmentFiles.results;
          ObjArchivos.forEach(element => {
            let objSplit = element.FileName.split("-");
            if (objSplit.length > 0) {
              let TipoArchivo = objSplit[0]
              if (TipoArchivo === "RegistroActivo") {
                this.RutaArchivo = element.ServerRelativeUrl;
              }
            }
          });
        }

        if (solicitud.CondicionesContractuales != null) {
          // this.condicionesContractuales = JSON.parse(solicitud.CondicionesContractuales).condiciones;
          this.condicionesContractuales = JSON.parse(solicitud.CondicionesContractuales.replace(/(\r\n|\n|\r|\t)/gm, "")).condiciones;
        }

        this.servicio.ObtenerCondicionesTecnicasBienes(this.IdSolicitud).subscribe(
          RespuestaCondiciones => {
            if (RespuestaCondiciones.length > 0) {
              this.CTB = true;
              this.existenBienes = true;
              this.ObjCondicionesTecnicasBienesLectura = CondicionesTecnicasBienes.fromJsonList(RespuestaCondiciones);
              this.ObjCondicionesTecnicas = CondicionesTecnicasBienes.fromJsonList(RespuestaCondiciones);
              this.ObjResultadosondeo = CondicionesTecnicasBienes.fromJsonList(RespuestaCondiciones);
              this.dataSource = new MatTableDataSource(this.ObjCondicionesTecnicas);
              this.dataSource.paginator = this.paginator;
            }
            this.spinner.hide();
          }
        )

        this.servicio.ObtenerCondicionesTecnicasServicios(this.IdSolicitud).subscribe(
          RespuestaCondicionesServicios => {
            if (RespuestaCondicionesServicios.length > 0) {
              this.existenServicios = true;
              this.ObjCondicionesTecnicasServiciosLectura = CondicionTecnicaServicios.fromJsonList(RespuestaCondicionesServicios);
              this.ObjCondicionesTecnicasServicios = CondicionTecnicaServicios.fromJsonList(RespuestaCondicionesServicios);
              this.dataSourceTS = new MatTableDataSource(this.ObjCondicionesTecnicasServicios);
              this.dataSourceTS.paginator = this.paginator;
            }
            this.spinner.hide();
          }
        )

        this.servicio.obtenerResponsableProcesos(this.paisId).subscribe(
          (RespuestaProcesos) => {
            this.ObResProceso = responsableProceso.fromJsonList(RespuestaProcesos);
            this.spinner.hide();
          }
        )
      }
    );
  }

  GuardarSolSAP() {
    this.spinner.show();
    let ObjSolpSap;
    if (this.RDBOrdenadorGastos === undefined) {
      this.mostrarAdvertencia("Debe seleccionar una acción en ordenador de gastos");
      this.spinner.hide();
      return false;
    }
    if (this.RDBOrdenadorGastos !== undefined) {
      if (this.RDBOrdenadorGastos === 1 && (this.numeroSolpSap === undefined || this.numeroSolpSap == '')) {
        this.MostrarValidacionNumeroSAP();
        return false;
      }
      else if (this.RDBOrdenadorGastos === 1) {
        this.ResponsableProceso = this.comprador;
        this.estadoSolicitud = 'Por registrar contratos';
        ObjSolpSap = {
          ResponsableId: this.ResponsableProceso,
          Estado: this.estadoSolicitud,
          EstadoRegistrarSAP: "Aprobado",
          NumSolSAP: this.numeroSolpSap,
          ComentarioRegistrarSAP: this.ComentarioRegistrarSap
        }
      }
      else if (this.RDBOrdenadorGastos === 2 && this.ComentarioRegistrarSap === undefined) {
        return this.MostrarValidacionComentarios();
      }
      else if (this.RDBOrdenadorGastos === 2) {
        this.ResponsableProceso = null;
        this.estadoSolicitud = 'Rechazado';
        ObjSolpSap = {
          ResponsableId: this.ResponsableProceso,
          Estado: this.estadoSolicitud,
          EstadoRegistrarSAP: "Rechazado",
          ComentarioRegistrarSAP: this.ComentarioRegistrarSap
        }
      }
      else if (this.RDBOrdenadorGastos === 3 && this.ComentarioRegistrarSap === undefined) {
        return this.MostrarValidacionComentarios();
      }
      else if (this.RDBOrdenadorGastos === 3) {
        this.ResponsableProceso = this.Autor;
        this.estadoSolicitud = 'Sin presupuesto';
        ObjSolpSap = {
          ResponsableId: this.ResponsableProceso,
          Estado: this.estadoSolicitud,
          EstadoRegistrarSAP: "No tiene presupuesto disponible",
          ComentarioRegistrarSAP: this.ComentarioRegistrarSap
        }
      }
      this.servicio.guardarSOLPSAP(this.IdSolicitud, ObjSolpSap).then(
        (resultado: ItemAddResult) => {
          let notificacion = {
            IdSolicitud: this.IdSolicitud.toString(),
            ResponsableId: this.ResponsableProceso,
            Estado: this.estadoSolicitud
          };
          this.servicio.agregarNotificacion(notificacion).then(
            (item: ItemAddResult) => {
              this.MostrarExitoso("Se registró la SOLP con éxito");
              this.spinner.hide();
              setTimeout(() => {
                this.salir();
              }, 1000);
            }, err => {
              this.mostrarError('Error agregando la notificación');
              this.spinner.hide();
            }
          )
        }
      ).catch(
        (error) => {
          this.mostrarError("Error al registrar la SOLP");
          console.log(error);
          this.spinner.hide();
        }
      )
    }
  }

  private MostrarValidacionComentarios() {
    this.tooltip1.show();
    setTimeout(() => {
      this.tooltip1.hide();
    }, 3000);
    this.spinner.hide();
    return false;
  }

  private MostrarValidacionNumeroSAP() {
    this.tooltip.show();
    setTimeout(() => {
      this.tooltip.hide();
    }, 3000);
    this.spinner.hide();
  }

  salir() {
    this.router.navigate(["/mis-pendientes"]);
  }

  MostrarExitoso(mensaje: string) {
    this.toastr.successToastr(mensaje, 'Confirmación!');
  }

  mostrarError(mensaje: string) {
    this.toastr.errorToastr(mensaje, 'Oops!');
  }

  mostrarAdvertencia(mensaje: string) {
    this.toastr.warningToastr(mensaje, 'Validación');
  }

  mostrarInformacion(mensaje: string) {
    this.toastr.infoToastr(mensaje, 'Información importante');
  }

  mostrarPersonalizado(mensaje: string) {
    this.toastr.customToastr(mensaje, null, { enableHTML: true });
  }


}