import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Usuario } from '../dominio/usuario';
import { Solicitud } from '../dominio/solicitud';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { SPServicio } from '../servicios/sp-servicio';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';

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
  modalRef: BsModalRef;
  idSolicitud: number;
  loading: boolean;
  empty: boolean;

  
  constructor( private servicio: SPServicio, private router: Router, private modalServicio: BsModalService, public toastr: ToastrManager) {
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.misSolicitudes;
    this.loading = false;
   }

  ngOnInit() {
    this.loading = true;
    this.ObtenerUsuarioActual();
  }

  displayedColumns: string[] = ['Consecutivo','Tiposolicitud', 'Alcance', 'fechaEntregaDeseada','Estado', 'Acciones']; 
 
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
    this.servicio.ObtenerMisPendientes(idUsuario).subscribe(
      (respuesta) => {
        this.misSolicitudes = Solicitud.fromJsonList(respuesta);
        if(this.misSolicitudes.length > 0){
          this.empty = false;
          this.dataSource = new MatTableDataSource(this.misSolicitudes);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else{
          this.empty = true;
        }
        this.loading = false;
      }, error => {
        console.log('Error obteniendo mis solicitudes: ' + error);
        this.loading = false;
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

  descartarSolicitud(IdSolicitud: number, template: TemplateRef<any>){
    this.idSolicitud = IdSolicitud;
    this.modalRef = this.modalServicio.show(template, { class: 'modal-lg' });
  }

  EditarSolicitud(IdSolicitud){
    sessionStorage.setItem("IdSolicitud",IdSolicitud);
    this.router.navigate(['/editar-solicitud']);
  }

  confirmarDescartar() {
    this.loading = true;
    this.servicio.borrarSolicitud(this.idSolicitud).then(
      (respuesta) => {
        this.modalRef.hide();
        this.MostrarExitoso("La solicitud se ha borrado correctamente");
        this.ObtenerMisSolicitudes();
      }, err => {
        console.log('Error al borrar la solicitud: ' + err);
        this.loading = false;
      }
    )
  }

  declinarDescartar() {
    this.modalRef.hide();
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
