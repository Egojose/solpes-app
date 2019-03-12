import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ToastrManager } from "ng6-toastr-notifications";
import { Router } from "@angular/router";
import { SPServicio } from "../servicios/sp-servicio";
import { ItemAddResult } from "sp-pnp-js";
import { CondicionesTecnicasBienes } from '../verificar-material/condicionTecnicaBienes';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { responsableProceso } from '../dominio/responsableProceso';
import { NgxSpinnerService } from 'ngx-spinner';
import { Solicitud } from '../dominio/solicitud';
import { Usuario } from '../dominio/usuario';

@Component({
  selector: "app-registro-activos",
  templateUrl: "./registro-activos.component.html",
  styleUrls: ["./registro-activos.component.css"]
})
export class RegistroActivosComponent implements OnInit {
  @ViewChild('customTooltip') tooltip: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  titleActivos = "Registro de activos";
  panelOpenState = false;
  ObjCTVerificar: any[];
  ObjUsuarios: [];
  ComentarioRegistroActivos: string;
  ComentarioVerificar: string;
  ObjResponsableProceso: responsableProceso[] = [];
  ObjCondicionesTecnicas: CondicionesTecnicasBienes[] = [];
  dataSource;
  modalRef: BsModalRef;
  numOrdenEstadistica: string;
  loading: boolean;
  IdSolicitud: any;
  displayedColumns: string[] = ["codigo", "descripcion", "modelo", "fabricante", "cantidad", "precioSondeo", "moneda"];
  IdSolicitudParms: number;
  RutaArchivo: string;
  paisId: any;
  ArchivoAdjunto: any;
  ResponsableProceso: number;
  estadoSolicitud: string;
  solicitudRecuperada: Solicitud;
  usuarioActual: Usuario;
  perfilacion: boolean;

  constructor(public toastr: ToastrManager, private servicio: SPServicio, private modalServicio: BsModalService, private router: Router, private spinner: NgxSpinnerService) {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
    this.solicitudRecuperada = JSON.parse(sessionStorage.getItem('solicitud'));
    this.perfilacionEstado();
    this.IdSolicitudParms = this.solicitudRecuperada.id;
    this.ArchivoAdjunto = null;
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
        this.mostrarAdvertencia("La solicitud no se encuentra en el estado correcto para registro de activos");
        this.router.navigate(['/mis-solicitudes']);
      }
    }
  }

  verificarEstado(): boolean {
    if (this.solicitudRecuperada.estado == 'Por registrar activos') {
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

  adjuntarArchivoVM(event) {
    let archivoAdjunto = event.target.files[0];
    if (archivoAdjunto != null) {
      this.ArchivoAdjunto = archivoAdjunto;
    } else {
      this.ArchivoAdjunto = null;
    }
  }

  comfirmasalir(template: TemplateRef<any>) {
    this.modalRef = this.modalServicio.show(template, { class: "modal-lg" });
  }

  declinarModal() {
    this.modalRef.hide();
  }

  GuardarActivos() {
    this.spinner.show();
    let fechaActivos = new Date();
    let coment;
    let comentarios = this.ComentarioRegistroActivos;
    this.ResponsableProceso = this.ObjResponsableProceso[0].porRegistrarSolp;
    this.estadoSolicitud = 'Por registrar solp sap';
    if (this.ArchivoAdjunto === null) {
      this.mostrarAdvertencia("Por favor ingrese el documento de registro de activos");
      this.spinner.hide();
      return false;
    } else {
      coment = {
        Estado: this.estadoSolicitud,
        ResponsableId: this.ResponsableProceso,
        ComentarioRegistroActivos: comentarios
      };
      this.servicio.guardarComentario(this.IdSolicitud, coment).then((resultado: ItemAddResult) => {
        let nombreArchivo = "RegistroActivo-" + this.generarllaveSoporte() + "_" + this.ArchivoAdjunto.name;
        this.servicio.agregarAdjuntoActivos(this.IdSolicitud, nombreArchivo, this.ArchivoAdjunto).then(respuesta => {
          let notificacion = {
            IdSolicitud: this.IdSolicitud.toString(),
            ResponsableId: this.ResponsableProceso,
            Estado: this.estadoSolicitud,
            FechaRegistrarActivo: fechaActivos
          };
          this.servicio.agregarNotificacion(notificacion).then(
            (item: ItemAddResult) => {
              this.MostrarExitoso("Archivo guardado correctamente");
              this.router.navigate(["/mis-pendientes"]);
              this.spinner.hide();
            }, err => {
              this.mostrarError('Error agregando la notificación');
              this.spinner.hide();
            }
          )
        })
          .catch(error => {
            this.mostrarError("Error al guardar el archivo");
            this.spinner.hide();
          });
      })
        .catch(error => {
          console.log(error);
          this.spinner.hide();
        });
    }
  }

  generarllaveSoporte(): string {
    var fecha = new Date();
    var valorprimitivo = fecha.valueOf().toString();
    return valorprimitivo;
  }

  MostrarExitoso(mensaje: string) {
    this.toastr.successToastr(mensaje, "Confirmación!");
  }

  mostrarError(mensaje: string) {
    this.toastr.errorToastr(mensaje, "Oops!");
  }

  mostrarAdvertencia(mensaje: string) {
    this.toastr.warningToastr(mensaje, "Validación");
  }

  mostrarInformacion(mensaje: string) {
    this.toastr.infoToastr(mensaje, "Información importante");
  }

  ngOnInit() {
    this.spinner.show();
    this.servicio.ObtenerTodosLosUsuarios().subscribe(Usuarios => {
      this.ObjUsuarios = Usuarios;
      this.servicio.ObtenerSolicitudBienesServicios(this.IdSolicitudParms).subscribe(respuesta => {
        this.IdSolicitud = respuesta.Id;
        this.paisId = respuesta.Pais.Id;
        this.numOrdenEstadistica = respuesta.NumeroOrdenEstadistica;
        this.ComentarioVerificar = respuesta.ComentarioVerificarMaterial;
        if (respuesta.Attachments === true) {
          let ObjArchivos = respuesta.AttachmentFiles.results;
          ObjArchivos.forEach(element => {
            let objSplit = element.FileName.split("-");
            if (objSplit.length > 0) {
              let TipoArchivo = objSplit[0];
              if (TipoArchivo === "ActivoVM") {
                this.RutaArchivo = element.ServerRelativeUrl;
              }
            }
          });
        }
        this.servicio.obtenerResponsableProcesos(this.paisId).subscribe(RespuestaResponsableProceso => {
          this.ObjResponsableProceso = responsableProceso.fromJsonList(RespuestaResponsableProceso);
          this.spinner.hide();
        });
        this.servicio.ObtenerCondicionesTecnicasBienes(this.IdSolicitud).subscribe(RespuestaCondiciones => {
          this.ObjCondicionesTecnicas = CondicionesTecnicasBienes.fromJsonList(RespuestaCondiciones);
          this.dataSource = new MatTableDataSource(this.ObjCondicionesTecnicas);
          this.dataSource.paginator = this.paginator;
          this.spinner.hide();
        });
      });
    });
  }

  salir() {
    this.modalRef.hide();
    this.router.navigate(["/mis-pendientes"]);
  }
}
