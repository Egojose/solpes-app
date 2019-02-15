import { Component, OnInit, ViewChild } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { Usuario } from '../dominio/usuario';
import { Solicitud } from '../dominio/solicitud';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-consulta-general',
  templateUrl: './consulta-general.component.html',
  styleUrls: ['./consulta-general.component.css']
})
export class ConsultaGeneralComponent implements OnInit {

  usuarioActual: Usuario;
  todasLasSolicitudes: Solicitud[] = [];
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loading: boolean;
  empty: boolean;

  constructor(private servicio: SPServicio, private router: Router, private spinner: NgxSpinnerService) {
  }

  displayedColumns: string[] = ['Consecutivo', 'Tiposolicitud', 'Alcance', 'fechaEntregaDeseada', 'Estado', 'Responsable', 'CreadoPor', 'VerSolicitud'];

  ngOnInit() {
    this.spinner.show();
    this.destruirSessionesSolicitudes();
    this.ObtenerUsuarioActual();
  }

  destruirSessionesSolicitudes(): any {
    sessionStorage.removeItem("solicitud");
  }

  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        this.usuarioActual = new Usuario(Response.Title, Response.email, Response.Id);
        this.ObtenerSolicitudes();
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
        this.spinner.hide();
      }
    )
  }

  ObtenerSolicitudes() {
    this.servicio.obtenerSolicitudes().subscribe(
      (respuesta) => {
        this.todasLasSolicitudes = Solicitud.fromJsonList(respuesta);
        if (this.todasLasSolicitudes.length > 0) {
          this.empty = false;
          this.dataSource = new MatTableDataSource(this.todasLasSolicitudes);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.empty = true;
        }
        this.spinner.hide();
      }, error => {
        console.log('Error obteniendo las solicitudes: ' + error);
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

}
