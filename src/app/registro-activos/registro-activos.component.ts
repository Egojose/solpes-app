import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrManager } from "ng6-toastr-notifications";
import { Router } from "@angular/router";
import { resultadoCondicionesTB } from '../dominio/resultadoCondicionesTB';
import { SPServicio } from "../servicios/sp-servicio";
import { ItemAddResult } from "sp-pnp-js";
import { CondicionesTecnicasBienes } from '../verificar-material/condicionTecnicaBienes';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { responsableProceso } from '../dominio/responsableProceso';
import { Solicitud } from '../dominio/solicitud';

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
  ObjResponsableProceso: responsableProceso[] = [];
  ObjCondicionesTecnicas: CondicionesTecnicasBienes[] = [];
  dataSource;
  loading: boolean;
  IdSolicitud: any;
  displayedColumns: string[] = [
    "codigo",
    "descripcion",
    "modelo",
    "fabricante",
    "cantidad",
    "valorEstimado",
    "moneda",
    "adjunto"
  ];
  IdSolicitudParms: string;
  RutaArchivo: string;
  paisId: any;
  ArchivoAdjunto: any;
  constructor(
    public toastr: ToastrManager,
    private servicio: SPServicio,
    private router: Router
  ) {
    this.loading = false;
    this.IdSolicitudParms = sessionStorage.getItem("IdSolicitud");
  }

  adjuntarArchivoVM(event) {
    let archivoAdjunto = event.target.files[0];
    if (archivoAdjunto != null) {
      this.ArchivoAdjunto = archivoAdjunto;
    } else {
      this.ArchivoAdjunto = null;
    }
  }

  GuardarActivos() {
    let coment;
<<<<<<< HEAD
    if (this.ComentarioRegistroActivos === undefined || this.ComentarioRegistroActivos === null) {
      this.mostrarError("Ingrese un comentario!");
    } else {
      let comentarios = this.ComentarioRegistroActivos;
      let ResponsableProcesoId = this.ObjResponsableProceso[0].porRegistrarSolp;
      coment = {
        Estado: 'Por registrar solp sap',
        ResponsableId: ResponsableProcesoId,
        ComentarioVerificarMaterial: comentarios
      }
=======
    let comentarios = this.ComentarioRegistroActivos;
    let ResponsableProcesoId = this.ObjResponsableProceso[0].porRegistrarSolp;
    coment = {
      Estado: 'Por registrar solp sap',
      ResponsableId: ResponsableProcesoId,
      ComentarioRegistroActivos: comentarios
>>>>>>> master
    }
    this.servicio.guardarComentario(this.IdSolicitud, coment)
      .then((resultado: ItemAddResult) => {        
        let nombreArchivo = "RegistroActivo-" + this.generarllaveSoporte() + "_" + this.ArchivoAdjunto.name;
        this.servicio.agregarAdjuntoActivos(this.IdSolicitud, nombreArchivo, this.ArchivoAdjunto).then(
          (respuesta) => {
            this.MostrarExitoso("Archivo guardado correctamente");
            this.router.navigate(["/mis-pendientes"]);
          }
        ).catch(
          (error) => {
            this.mostrarError("Error al guardar el archivo");
          }
        );
      })
      .catch(error => {
        console.log(error);
      });
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
    this.loading = true;
    this.servicio.ObtenerTodosLosUsuarios().subscribe(
      (Usuarios) => {
        this.ObjUsuarios = Usuarios;
        this.servicio.ObtenerSolicitudBienesServicios(this.IdSolicitudParms).subscribe(
          (respuesta) => {
            this.IdSolicitud = respuesta.Id;
            this.paisId = respuesta.Pais.Id;
            if (respuesta.Attachments === true) {
              let ObjArchivos = respuesta.AttachmentFiles.results;

              ObjArchivos.forEach(element => {
                let objSplit = element.FileName.split("-");
                if (objSplit.length > 0) {
                  let TipoArchivo = objSplit[0]
                  if (TipoArchivo === "ActivoVM") {
                    this.RutaArchivo = element.ServerRelativeUrl;
                  }
                }
              });
            }
            this.servicio
              .obtenerResponsableProcesos(this.paisId)
              .subscribe(RespuestaResponsableProceso => {
                this.ObjResponsableProceso = responsableProceso.fromJsonList(
                  RespuestaResponsableProceso
                );
              });
            this.servicio
              .ObtenerCondicionesTecnicasBienes(this.IdSolicitud)
              .subscribe(RespuestaCondiciones => {
                this.ObjCTVerificar = resultadoCondicionesTB.fromJsonList(RespuestaCondiciones);
                this.dataSource = new MatTableDataSource(this.ObjCTVerificar);
                this.dataSource.paginator = this.paginator;
              });
          });
      });
    this.loading = false;
  }

  salir() {
    this.router.navigate(["/mis-solicitudes"]);
  }
}
