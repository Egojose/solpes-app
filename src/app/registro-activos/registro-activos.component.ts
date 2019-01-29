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
  displayedColumns: string[] = ["codigo", "descripcion", "modelo", "fabricante", "cantidad", "precioSondeo", "moneda", "adjunto"];
  IdSolicitudParms: string;
  RutaArchivo: string;
  paisId: any;
  ArchivoAdjunto: any;
  constructor(public toastr: ToastrManager, private servicio: SPServicio, private modalServicio: BsModalService, private router: Router, private spinner: NgxSpinnerService) {
    this.spinner.hide();
    this.IdSolicitudParms = sessionStorage.getItem("IdSolicitud");
    this.ArchivoAdjunto = null;
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
    let coment;
    let comentarios = this.ComentarioRegistroActivos;
    let ResponsableProcesoId = this.ObjResponsableProceso[0].porRegistrarSolp;
    if (this.ArchivoAdjunto === null) {
      this.mostrarAdvertencia("Por favor ingrese el documento de registro de activos");
      this.spinner.hide();
      return false;
    } else {
      coment = {
        Estado: "Por registrar solp sap",
        ResponsableId: ResponsableProcesoId,
        ComentarioRegistroActivos: comentarios
      };
      this.servicio.guardarComentario(this.IdSolicitud, coment).then((resultado: ItemAddResult) => {
        let nombreArchivo = "RegistroActivo-" + this.generarllaveSoporte() + "_" + this.ArchivoAdjunto.name;
        this.servicio.agregarAdjuntoActivos(this.IdSolicitud, nombreArchivo, this.ArchivoAdjunto).then(respuesta => {
          this.MostrarExitoso("Archivo guardado correctamente");
          this.router.navigate(["/mis-pendientes"]);
          this.spinner.hide();
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
        });
        this.servicio.ObtenerCondicionesTecnicasBienes(this.IdSolicitud).subscribe(RespuestaCondiciones => {
          this.ObjCondicionesTecnicas = CondicionesTecnicasBienes.fromJsonList(RespuestaCondiciones);
          this.dataSource = new MatTableDataSource(this.ObjCondicionesTecnicas);
          this.dataSource.paginator = this.paginator;
        });
      });
    });
    this.spinner.hide();
  }

  salir() {
    this.modalRef.hide();
    this.router.navigate(["/mis-solicitudes"]);
  }
}
