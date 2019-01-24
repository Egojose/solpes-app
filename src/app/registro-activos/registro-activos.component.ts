import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrManager } from "ng6-toastr-notifications";
import { Router } from "@angular/router";
import { resultadoCondicionesTB } from '../dominio/resultadoCondicionesTB';
import { SPServicio } from "../servicios/sp-servicio";
import { ItemAddResult } from "sp-pnp-js";
import { CondicionesTecnicasBienes } from '../verificar-material/condicionTecnicaBienes';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { responsableProceso } from '../dominio/responsableProceso';

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
  idSolicitudParameter: string;
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
  constructor(
    public toastr: ToastrManager,
    private servicio: SPServicio,
    private router: Router
  ) {
    this.loading = false;
  }
  GuardarActivos() {
    let coment;
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
     /* this.servicio.guardarRegistroActivos(this.IdSolicitud, coment)
        .then((resultado: ItemAddResult) => {
          this.MostrarExitoso("Registro de activos realizado correctamente");
          this.router.navigate(["/mis-pendientes"]);
        })
        .catch(error => {
          console.log(error);
        });*/
    }
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
        this.servicio.ObtenerSolicitudBienesServicios(this.idSolicitudParameter).subscribe(
          (respuesta) => {
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
