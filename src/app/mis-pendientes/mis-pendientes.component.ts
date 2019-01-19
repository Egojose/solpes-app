import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../dominio/usuario';
import { Solicitud } from '../dominio/solicitud';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { SPServicio } from '../servicios/sp-servicio';

@Component({
  selector: 'app-mis-pendientes',
  templateUrl: './mis-pendientes.component.html',
  styleUrls: ['./mis-pendientes.component.css']
})
export class MisPendientesComponent implements OnInit {

  usuarioActual : Usuario;
  misSolicitudes: Solicitud[] = [];
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor( private servicio: SPServicio, private router: Router) { }

  ngOnInit() {
    this.ObtenerUsuarioActual();
  }

  displayedColumns: string[] = ['Pais','Tiposolicitud', 'fechaCreacion', 'fechaEntregaDeseada','Estado', 'Acciones']; 
 
  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        this.usuarioActual  = new Usuario(Response.Title, Response.email,Response.Id);
        this.ObtenerMisSolicitudes();
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
      }
    )
  }

  ObtenerMisSolicitudes() {
    let idUsuario = this.usuarioActual.id;
    this.servicio.ObtenerMisPendientes(idUsuario).subscribe(
      (respuesta) => {
        this.misSolicitudes = Solicitud.fromJsonList(respuesta);
        this.dataSource = new MatTableDataSource(this.misSolicitudes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, error => {
        console.log('Error obteniendo mis solicitudes: ' + error);
      }
    )
  }

  VerSolicitud(id){
    sessionStorage.setItem("IdSolicitud", id);
    this.router.navigate(['/ver-solicitud-tab']);
  }

  PorSondear(id){
    sessionStorage.setItem("IdSolicitud", id);
    this.router.navigate(['/sondeo']);
  }

  AprobarSondeo(id){
    sessionStorage.setItem("IdSolicitud", id);
    this.router.navigate(['/aprobar-sondeo']);
  }

  VerificarMaterial(id){
    sessionStorage.setItem("IdSolicitud", id);
    this.router.navigate(['/verificar-material']);
  }

  RegistrarSOLPSAP(id){
    sessionStorage.setItem("IdSolicitud", id);
    this.router.navigate(['/registrar-solp-sap']);
  }

  RegistrarContratos(id){
    sessionStorage.setItem("IdSolicitud", id);
    this.router.navigate(['/contratos']);
  }

  RegistrarEntregas(id){
    sessionStorage.setItem("IdSolicitud", id);
    this.router.navigate(['/ver-solicitud-tab']);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
