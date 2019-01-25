import { Component, OnInit, ViewChild } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { Usuario } from '../dominio/usuario';
import { Solicitud } from '../dominio/solicitud';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-solicitudes',
  templateUrl: './mis-solicitudes.component.html',
  styleUrls: ['./mis-solicitudes.component.css']
})

export class MisSolicitudesComponent implements OnInit {
  usuarioActual : Usuario;
  misSolicitudes: Solicitud[] = [];
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loading: boolean;
  empty: boolean;
  
  constructor( private servicio: SPServicio, private router: Router) { 
    this.loading = false;
  }


  displayedColumns: string[] = ['Consecutivo','Tiposolicitud', 'Alcance', 'fechaEntregaDeseada','Estado', 'Responsable', 'VerSolicitud']; 

  ngOnInit() {
    this.loading = true;
    this.ObtenerUsuarioActual();
  }

  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        this.usuarioActual  = new Usuario(Response.Title, Response.email,Response.Id);
        this.ObtenerMisSolicitudes();
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
        this.loading = false;
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
        this.loading = false;
      }, error => {
        console.log('Error obteniendo mis solicitudes: ' + error);
        this.loading = false;
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

}