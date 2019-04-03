import { Component, OnInit, ViewChild } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { Usuario } from '../dominio/usuario';
import { Solicitud } from '../dominio/solicitud';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemAddResult } from 'sp-pnp-js';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CondicionTecnicaServicios } from '../dominio/condicionTecnicaServicios';
import { CondicionTecnicaBienes } from '../dominio/condicionTecnicaBienes';

@Component({
  selector: 'app-mis-solicitudes',
  templateUrl: './mis-solicitudes.component.html',
  styleUrls: ['./mis-solicitudes.component.css']
})

export class MisSolicitudesComponent implements OnInit {
  usuarioActual: Usuario;
  misSolicitudes: Solicitud[] = [];
  solicitud: Solicitud;
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loading: boolean;
  empty: boolean;
  consecutivoActual: number;
  condicionesTB: CondicionTecnicaBienes[] = [];
  condicionTB: CondicionTecnicaBienes;
  condicionesTS: CondicionTecnicaServicios[] = [];
  condicionTS: CondicionTecnicaServicios;

  constructor(private servicio: SPServicio, private router: Router, private spinner: NgxSpinnerService, public toastr: ToastrManager) {
  }

  displayedColumns: string[] = ['Consecutivo', 'Tiposolicitud', 'Alcance', 'fechaEntregaDeseada', 'Estado', 'Responsable', 'VerSolicitud', 'duplicarSolicitud', 'descartarSolicitud'];

  ngOnInit() {
    this.spinner.show();
    this.destruirSessionesSolicitudes();
    this.ObtenerUsuarioActual();
  }

  destruirSessionesSolicitudes(): any {
    sessionStorage.removeItem("IdSolicitud");
    sessionStorage.removeItem("solicitud");
  }

  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        this.usuarioActual = new Usuario(Response.Title, Response.email, Response.Id);
        this.ObtenerMisSolicitudes();
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
        this.spinner.hide();
      }
    )
  }

  ObtenerMisSolicitudes() {
    let idUsuario = this.usuarioActual.id;
    this.servicio.obtenerMisSolicitudes(idUsuario).subscribe(
      (respuesta) => {
        this.misSolicitudes = Solicitud.fromJsonList(respuesta);
        if (this.misSolicitudes.length > 0) {
          this.empty = false;
          this.dataSource = new MatTableDataSource(this.misSolicitudes);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.empty = true;
        }
        this.spinner.hide();
      }, error => {
        console.log('Error obteniendo mis solicitudes: ' + error);
        this.spinner.hide();
      }
    )
  }

  VerSolicitud(solicitud) {
    sessionStorage.setItem('solicitud', JSON.stringify(solicitud));
    this.router.navigate(['/ver-solicitud-tab']);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  duplicarSolicitud(solicitud) {
    this.agregarSolicitud(solicitud);
  }

  agregarSolicitud(solicitudDuplicar): any {
    this.spinner.show();
    this.solicitud = new Solicitud(
      'Solicitud Solpes: ' + new Date(),
      solicitudDuplicar.tipoSolicitud,
      solicitudDuplicar.cm,
      solicitudDuplicar.solicitante,
      1,
      solicitudDuplicar.ordenadorGastos.ID,
      solicitudDuplicar.pais.ID,
      solicitudDuplicar.categoria,
      solicitudDuplicar.subcategoria,
      solicitudDuplicar.comprador.ID,
      solicitudDuplicar.codigoAriba,
      solicitudDuplicar.fechaEntregaDeseada,
      solicitudDuplicar.alcance,
      solicitudDuplicar.justificacion,
      solicitudDuplicar.condicionesContractuales,
      'Borrador',
      this.usuarioActual.id,
      solicitudDuplicar.compraBienes,
      solicitudDuplicar.compraServicios,
      null,
      this.usuarioActual.id,
      solicitudDuplicar.nombreResponsable,
      solicitudDuplicar.compraOrdenEstadistica,
      solicitudDuplicar.numeroOrdenEstadistica,
      null,
      solicitudDuplicar.FaltaRecepcionBienes,
      solicitudDuplicar.FaltaRecepcionServicios,
      solicitudDuplicar.FueSondeo);

    this.servicio.agregarSolicitud(this.solicitud).then(
      (item: ItemAddResult) => {
        let idSolicitudGuardada = item.data.Id;
        this.agregarCondicionesTecnicasBienes(solicitudDuplicar.id, idSolicitudGuardada);
      }, err => {
        this.mostrarError('Error en la duplicación de la solicitud');
        this.spinner.hide();
        console.log('Error en la duplicación de la solicitud: ' + err);
      }
    )
  }

  agregarCondicionesTecnicasBienes(idSolicitudObtener: number, idSolicitudGuardar: number): any {
    let contadorBienes = 0;
    this.servicio.ObtenerCondicionesTecnicasBienes(idSolicitudObtener).subscribe(
      (respuesta) => {
        this.condicionesTB = CondicionTecnicaBienes.fromJsonList(respuesta);
        if (this.condicionesTB.length > 0) {
          this.condicionesTB.forEach(element => {
            this.condicionTB = new CondicionTecnicaBienes(element.indice, element.titulo, idSolicitudGuardar, element.codigo, element.descripcion, element.modelo, element.fabricante, element.cantidad, element.valorEstimado, element.comentarios, null, '', element.tipoMoneda, null ,element.costoInversion,
            element.numeroCostoInversion, element.numeroCuenta);
            this.servicio.agregarCondicionesTecnicasBienes(this.condicionTB).then(
              (item: ItemAddResult) => {
                contadorBienes++;
                if (contadorBienes === this.condicionesTB.length) {
                  this.agregarCondicionesTecnicasServicios(idSolicitudObtener,idSolicitudGuardar);
                }
              }, err => {
                this.mostrarError('Error en la creación de la condición técnica de bienes');
                this.spinner.hide();
              }
            )
          });
        } else {
          this.agregarCondicionesTecnicasServicios(idSolicitudObtener, idSolicitudGuardar);
        }
      }, err => {
        this.mostrarError('Error obteniendo condiciones técnicas de bienes');
        this.spinner.hide();
        console.log('Error obteniendo condiciones técnicas de bienes: ' + err);
      }
    )
  }

  agregarCondicionesTecnicasServicios(idSolicitudObtener: number, idSolicitudGuardar: number): any {
    let contadorServicios = 0;
    this.servicio.ObtenerCondicionesTecnicasServicios(idSolicitudObtener).subscribe(
      (respuesta) => {
        this.condicionesTS = CondicionTecnicaServicios.fromJsonList(respuesta);
        if (this.condicionesTS.length > 0) {
          this.condicionesTS.forEach(element => {
            this.condicionTS = new CondicionTecnicaServicios(element.indice, element.titulo, idSolicitudGuardar, element.codigo, element.descripcion, element.cantidad, element.valorEstimado, element.comentarios, null, '', element.tipoMoneda, null, element.costoInversion, element.numeroCostoInversion, element.numeroCuenta);
            this.servicio.agregarCondicionesTecnicasServicios(this.condicionTS).then(
              (item: ItemAddResult) => {
                contadorServicios++;
                if (contadorServicios === this.condicionesTS.length) {
                  this.MostrarExitoso("La solicitud se duplicó correctamente");
                  this.spinner.hide();
                }
              }, err => {
                this.mostrarError('Error en la creación de la condición técnica de servicios');
                this.spinner.hide();
              }
            )
          });
        } else {
          this.MostrarExitoso("La solicitud se duplicó correctamente");
          this.spinner.hide();
        }
      }, err => {
        this.mostrarError('Error obteniendo condiciones técnicas de servicios');
        this.spinner.hide();
        console.log('Error obteniendo condiciones técnicas de servicios: ' + err);
      }
    )
  }

  mostrarError(mensaje: string) {
    this.toastr.errorToastr(mensaje, 'Oops!');
  }

  MostrarExitoso(mensaje: string) {
    this.toastr.successToastr(mensaje, 'Confirmación!');
  }

}