import { Component, OnInit, ViewChild } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { Usuario } from '../dominio/usuario';
import { Solicitud } from '../dominio/solicitud';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemAddResult } from 'sp-pnp-js';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-mis-solicitudes',
  templateUrl: './mis-solicitudes.component.html',
  styleUrls: ['./mis-solicitudes.component.css']
})

export class MisSolicitudesComponent implements OnInit {
  usuarioActual : Usuario;
  misSolicitudes: Solicitud[] = [];
  solicitud: Solicitud;
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loading: boolean;
  empty: boolean;
  
  constructor( private servicio: SPServicio, private router: Router, private spinner: NgxSpinnerService,  public toastr: ToastrManager) { 
  }

  displayedColumns: string[] = ['Consecutivo','Tiposolicitud', 'Alcance', 'fechaEntregaDeseada','Estado', 'Responsable', 'VerSolicitud', 'duplicarSolicitud']; 

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
        this.usuarioActual  = new Usuario(Response.Title, Response.email,Response.Id);
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
        }else{
          this.empty = true;
        }
        this.spinner.hide();
      }, error => {
        console.log('Error obteniendo mis solicitudes: ' + error);
        this.spinner.hide();
      }
    )
  }

  VerSolicitud(solicitud){
    sessionStorage.setItem('solicitud', JSON.stringify(solicitud));
    this.router.navigate(['/ver-solicitud-tab']);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  duplicarSolicitud(solicitud){
    console.log("duplicar la solicitud");
    console.log(solicitud);
    this.agregarSolicitud(solicitud);
  }

  agregarSolicitud(solicitud): any {
    this.spinner.show();
    this.solicitud = new Solicitud(
      'Solicitud Solpes: ' + new Date(), '', 
      solicitud.cm, 
      solicitud.solicitante, 
      1,  
      solicitud.ordenadorGastos.ID, 
      solicitud.pais.ID, 
      solicitud.categoria, 
      solicitud.subcategoria, 
      solicitud.comprador.ID, 
      solicitud.codigoAriba, 
      solicitud.fechaEntregaDeseada,
      solicitud.alcance, 
      solicitud.justificacion, 
      solicitud.condicionesContractuales, 
      'Borrador', solicitud.responsable.ID, 
      solicitud.compraBienes, 
      solicitud.compraServicios,
      null, this.usuarioActual.id, 
      solicitud.nombreResponsable, 
      solicitud.compraOrdenEstadistica, 
      solicitud.numeroOrdenEstadistica,
      null, solicitud.FaltaRecepcionBienes, 
      solicitud.FaltaRecepcionServicios, 
      solicitud.FueSondeo);

    this.servicio.agregarSolicitud(this.solicitud).then(
      (item: ItemAddResult) => {
        console.log("SE DUPLICA LA SOLICITUD");
        let idSolicitudGuardada = item.data.Id;
        this.MostrarExitoso("La solicitud se ha duplicado correctamente");
        this.spinner.hide();
      }, err => {
        this.mostrarError('Error en la creación de la solicitud en estado inicial');
        this.spinner.hide();
        console.log('Error en la creación de la solicitud en estado inicial: ' + err);
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