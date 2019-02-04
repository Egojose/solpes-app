import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Usuario } from '../dominio/usuario';
import { Solicitud } from '../dominio/solicitud';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { SPServicio } from '../servicios/sp-servicio';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { responsableProceso } from '../dominio/responsableProceso';
import { ReasignarComponent } from '../reasignar/reasignar.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-mis-pendientes',
  templateUrl: './mis-pendientes.component.html',
  styleUrls: ['./mis-pendientes.component.css']
})
export class MisPendientesComponent implements OnInit {

  usuarioActual: Usuario;
  misSolicitudes: Solicitud[] = [];
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  modalRef: BsModalRef;
  idSolicitud: number;
  loading: boolean;
  empty: boolean;
  ObjResponsableProceso: any;
  IdPais: any;

  constructor(private servicio: SPServicio, private router: Router, private modalServicio: BsModalService, public toastr: ToastrManager, public dialog: MatDialog, private spinner: NgxSpinnerService) {
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.misSolicitudes;
    this.spinner.hide();
  }

  ngOnInit() {
    this.spinner.show();
    this.destruirSessionesSolicitudes();
    this.ObtenerUsuarioActual();
  }

  destruirSessionesSolicitudes(): any {
    sessionStorage.removeItem("IdSolicitud");
    sessionStorage.removeItem("solicitud");
  }

  displayedColumns: string[] = ['Consecutivo', 'Tiposolicitud', 'Alcance', 'fechaEntregaDeseada', 'Estado', 'Acciones'];

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
    this.servicio.ObtenerMisPendientes(idUsuario).subscribe(
      (respuesta) => {
        this.misSolicitudes = Solicitud.fromJsonList(respuesta);
        if (this.misSolicitudes.length > 0) {
          this.empty = false;
          this.dataSource = new MatTableDataSource(this.misSolicitudes);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else {
          this.empty = true;
        }
        this.spinner.hide();
      }, error => {
        console.log('Error obteniendo mis solicitudes: ' + error);
        this.spinner.hide();
      }
    )
  }

  ObtenerResponsableProceso(PaisId, IdSolicitud) {
    this.servicio
      .obtenerResponsableProcesos(PaisId)
      .subscribe(RespuestaResponsableProceso => {
        this.ObjResponsableProceso = responsableProceso.fromJsonList(RespuestaResponsableProceso);
        let Responsable = this.ObjResponsableProceso[0].porRegistrarSolp;
        this.servicio.cambioEstadoSolicitud(IdSolicitud, "Por registrar solp sap", Responsable).then(
          (respuesta) => {
            this.MostrarExitoso("Registro enviado con éxito");
            this.modalRef.hide();
            window.location.reload();
          }
        ).catch(
          (error) => {
            console.log(error);
            this.mostrarError("Error al enviar el registro");
            this.modalRef.hide();
          }
        );
      });
  }

  VerSolicitud(id) {
    sessionStorage.setItem("IdSolicitud", id);
    this.router.navigate(['/ver-solicitud-tab']);
  }

  PorSondear(solicitud) {
    sessionStorage.setItem("solicitud", JSON.stringify(solicitud));
    this.router.navigate(['/sondeo']);
  }

  AprobarSondeo(solicitud) {
    sessionStorage.setItem("solicitud", JSON.stringify(solicitud));
    this.router.navigate(['/aprobar-sondeo']);
  }

  VerificarMaterial(solicitud) {
    sessionStorage.setItem("solicitud", JSON.stringify(solicitud));
    this.router.navigate(['/verificar-material']);
  }

  RegistrarSOLPSAP(solicitud) {
    sessionStorage.setItem("solicitud", JSON.stringify(solicitud));
    this.router.navigate(['/registrar-solp-sap']);
  }

  RegistrarContratos(id) {
    sessionStorage.setItem("IdSolicitud", id);
    this.router.navigate(['/contratos']);
  }

  RegistrarEntregasBienes(id) {
    sessionStorage.setItem("IdSolicitud", id);
    this.router.navigate(['/entrega-bienes']);
  }

  RegistrarEntregasServicios(id) {
    sessionStorage.setItem("IdSolicitud", id);
    this.router.navigate(['/entrega-servicios']);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  descartarSolicitud(IdSolicitud: number, template: TemplateRef<any>) {
    this.idSolicitud = IdSolicitud;
    this.modalRef = this.modalServicio.show(template, { class: 'modal-lg' });
  }

  Descartar(element, template: TemplateRef<any>) {
    this.idSolicitud = element.id;
    this.IdPais = element.pais.ID;
    this.modalRef = this.modalServicio.show(template);
  }

  ConPresupuesto(element, template: TemplateRef<any>) {
    this.idSolicitud = element.id;
    this.IdPais = element.pais.ID;
    this.modalRef = this.modalServicio.show(template);
  }

  confirmarDescartarPresupuesto() {
    this.servicio.cambioEstadoSolicitud(this.idSolicitud, "Solicitud descartada", null).then(
      (respuesta) => {
        this.MostrarExitoso("Solicitud descartada con éxito");
        this.modalRef.hide();
        window.location.reload();
      }
    ).catch(
      (error) => {
        this.mostrarError("Error al descartar la solicitud");
        this.modalRef.hide();
      }
    );
  }

  confirmarPresupuesto() {
    this.ObtenerResponsableProceso(this.IdPais, this.idSolicitud)
  }

  VerDetalle(id) {
    sessionStorage.setItem("IdSolicitud", id);
    this.router.navigate(['/ver-solicitud-tab']);
  }

  EditarSolicitud(solicitud) {
    sessionStorage.setItem('solicitud', JSON.stringify(solicitud));
    this.router.navigate(['/editar-solicitud']);
  }

  confirmarDescartar() {
    this.spinner.show();
    this.servicio.borrarSolicitud(this.idSolicitud).then(
      (respuesta) => {
        this.modalRef.hide();
        this.MostrarExitoso("La solicitud se ha borrado correctamente");
        this.ObtenerMisSolicitudes();
      }, err => {
        console.log('Error al borrar la solicitud: ' + err);
        this.spinner.hide();
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

  RegistrarActivos(solicitud) {
    sessionStorage.setItem('solicitud', JSON.stringify(solicitud));
    this.router.navigate(['/registro-activos']);
  }

  reasignar(solicitud) {
    sessionStorage.setItem('solicitud', JSON.stringify(solicitud));
    window.scroll(0, 0);
    this.dialog.open(ReasignarComponent, {
      height: '360px',
      width: '600px',
    });
  }

}
