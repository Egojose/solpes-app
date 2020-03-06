import { Component, OnInit, ViewChild, TemplateRef, forwardRef } from '@angular/core';
import { Usuario } from '../dominio/usuario';
import { Solicitud } from '../dominio/solicitud';
import { EdSolicitud } from '../dominio/EdSolicitud';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { SPServicio } from '../servicios/sp-servicio';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { responsableProceso } from '../dominio/responsableProceso';
import { ReasignarComponent } from '../reasignar/reasignar.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MotivoSuspension } from '../dominio/motivoSuspension';
import { ItemAddResult } from 'sp-pnp-js';
import { element } from '@angular/core/src/render3';
import { FormGroup, FormBuilder, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EmailProperties } from 'sp-pnp-js';


@Component({
  selector: 'app-mis-pendientes',
  templateUrl: './mis-pendientes.component.html',
  styleUrls: ['./mis-pendientes.component.css'],
})
export class MisPendientesComponent implements OnInit {

  usuarioActual: Usuario;
  misSolicitudes: EdSolicitud[] = [];
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  modalRef: BsModalRef;
  idSolicitud: number;
  loading: boolean;
  empty: boolean;
  ObjResponsableProceso: any;
  IdPais: any;
  motivoSuspension: MotivoSuspension[] = [];
  fechaSuspension: any;
  fechaReactivacion: any;
  suspenderForm: FormGroup;
  motivoSuspender: any;
  nombreSuspension: any;
  fechaSuspensionSondeo: any;
  comprador: any;
  solicitante: any;
  comentarioSuspension: string;
  idSolicitudDescartar: any;
  responsableId: any;
  fechaAcordada: any;
  emailSolicitante: any;

  constructor(private servicio: SPServicio, private router: Router, private modalServicio: BsModalService, public toastr: ToastrManager, public dialog: MatDialog, private spinner: NgxSpinnerService, private formBuilder: FormBuilder) {
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.misSolicitudes;
    this.motivoSuspender = ''
  }

  ngOnInit() {
    this.spinner.show();
    console.log(this.misSolicitudes);
    this.destruirSessionesSolicitudes();
    this.ObtenerUsuarioActual();
  }


  destruirSessionesSolicitudes(): any {
    sessionStorage.removeItem("IdSolicitud");
    sessionStorage.removeItem("solicitud");
  }

  displayedColumns: string[] = ['Consecutivo', 'Pais', 'Tiposolicitud', 'Alcance', 'fechaEntregaDeseada', 'Estado', 'Acciones'];

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
        this.misSolicitudes = EdSolicitud.fromJsonList(respuesta);
        console.log(this.misSolicitudes);
        if (this.misSolicitudes.length > 0) {
          this.empty = false;
          this.dataSource = new MatTableDataSource(this.misSolicitudes);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.obtenerMotivoSuspension();
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
  obtenerMotivoSuspension() {
   this.servicio.obtenerMotivoSuspension().subscribe(
     (respuesta) => {
       this.motivoSuspension = MotivoSuspension.fromJsonList(respuesta);
     }
   );
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

  RegistrarContratos(solicitud) {
    sessionStorage.setItem("solicitud", JSON.stringify(solicitud));
    this.router.navigate(['/contratos']);
  }

  RegistrarEntregasBienes(solicitud) {
    sessionStorage.setItem("solicitud", JSON.stringify(solicitud));
    this.router.navigate(['/entrega-bienes']);
  }

  RegistrarEntregasServicios(solicitud) {
    sessionStorage.setItem("solicitud", JSON.stringify(solicitud));
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
      height: '490px',
      width: '600px',
    });
  }

  suspender(template: TemplateRef<any>, element) {
    this.idSolicitud = element.id;
    this.solicitante = element.solicitantePersona;
    this.modalRef = this.modalServicio.show(template, { class: 'modal-md' });
  }

  acordarFecha(template: TemplateRef<any>, element) {
    console.log(element);
    this.idSolicitud = element.id;
    this.emailSolicitante = element.solicitantePersona.EMail;
    console.log(this.emailSolicitante);
    this.solicitante = element.solicitantePersona;
    this.modalRef = this.modalServicio.show(template, { class: 'modal-md' });
  }

  confirmarAcordarFecha() {
    let fecha = new Date(this.fechaAcordada);
    let dia = fecha.getDate();
    let mes = fecha.getMonth();
    if(mes < 10) {
      mes = parseInt(`0${mes}`);
    }
    let anio = fecha.getFullYear();
    let fechaString = `${dia}/${mes}/${anio}`
    console.log(fechaString);
    this.spinner.show()
    if(this.fechaAcordada === null || this.fechaAcordada === '' || this.fechaAcordada === undefined) {
      this.mostrarAdvertencia('Debe seleccionar una fecha');
      this.spinner.hide();
      return false;
    }
    else {
      let cuerpo =  '<p>Cordial saludo</p>' +
      '<br>' +
      '<p>El usuario <strong>' + this.usuarioActual.nombre + '</strong> ha acordado una nueva fecha para gestionar la solicitud <strong>' + this.idSolicitud + '</strong>.' +
      '<p>La fecha ha quedo para el <strong>' + fechaString + '</strong> (dd/MM/AAAA).' +
      '<p>En caso de requerir más información  por favor ponerse en contacto con el usuario.'
       
     
      const emailProps: EmailProperties = {
        To: [this.emailSolicitante],
        Subject: "Se ha acordado una nueva fecha para gestionar su solicitud",
        Body: cuerpo,
      };
      let obj = {
        FechaAcordada: this.fechaAcordada,
        OcultarBtnFechaAcordada: true
      }
      console.log(obj);
      this.servicio.agregarFechaAcordada(this.idSolicitud, obj).then(
        (res) => {
          this.servicio.EnviarNotificacion(emailProps);
          this.MostrarExitoso('La fecha se agregó correctamente');
          this.modalRef.hide();
          this.spinner.hide();
          this.router.navigate(["/mis-solicitudes"]);
        }
      ).catch(
        (err)=> {
          this.mostrarError('No se pudo agregar la fecha a la solicitud. Por favor intente de nuevo más tarde');
          this.modalRef.hide();
          this.spinner.hide();
          console.error(err);
        }
      )
    }
  }

  confirmarSuspension() {
    if(this.nombreSuspension === 'Seleccione' || this.nombreSuspension === "" || this.nombreSuspension === null || this.nombreSuspension === undefined) {
      this.mostrarAdvertencia('Debe seleccionar un motivo de suspensión')
      return false
    }
    else {
    let ObjSus;
    let objHistorial;
    let estado = 'Suspendida'
    let motivo = this.nombreSuspension;
    
    this.fechaSuspension = new Date()
    
    ObjSus = {
      Estado: estado,
      FechaSuspension: this.fechaSuspension,
      MotivoDeSuspension: motivo,
      Suspendida: true,
      ResponsableId: this.solicitante.ID
    }

    objHistorial = {
      Title: 'Suspensión',
      ResponsableSuspension: this.usuarioActual.nombre, 
      FechaSuspension: new Date(),
      SolicitudId: this.idSolicitud.toString(),
      MotivoSuspension: motivo
    }
    let notificacion = {
      IdSolicitud: this.idSolicitud.toString(),
      ResponsableId: this.solicitante.ID,
      Estado: estado
    };
    this.servicio.guardarHistorial(objHistorial).then(
      (item: ItemAddResult) => {
        this.mostrarInformacion('Se guardó un registro de la suspensión');
      }
    ).catch(err=> {
      this.mostrarError('No se pudo guardar un registro de la suspensión' + err);
    })
    this.servicio.suspenderSolicitud(this.idSolicitud, ObjSus).then(
      (item: ItemAddResult) => {
        this.servicio.agregarNotificacion(notificacion).then(
          (item: ItemAddResult) => {
            this.MostrarExitoso("La solicitud se ha suspendido correctamente");
            this.modalRef.hide();
            this.spinner.hide();
            this.router.navigate(['/mis-solicitudes']);
          }, err => {
            this.mostrarError('Error agregando la notificación');
            this.spinner.hide();
          }
        )
      }, err => {
        this.mostrarError('Error suspendiendo la solicitud');
        this.spinner.hide();
      }
    ).catch(
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    )
    }
  }

  confirmarSuspenderSondeo() {
    let ObjSus;
    let estado = 'Suspendida sondeo'
    this.fechaSuspensionSondeo = new Date();
    ObjSus = {
      Estado: estado,
      FechaSuspensionSondeo: this.fechaSuspensionSondeo,
      SuspendidaSondeo: true,
      ResponsableId: this.solicitante.ID
    }
    let notificacion = {
      IdSolicitud: this.idSolicitud.toString(),
      ResponsableId: this.solicitante.ID,
      Estado: estado
    };
    this.servicio.suspenderSolicitud(this.idSolicitud, ObjSus).then(
      (item: ItemAddResult) => {
        this.servicio.agregarNotificacion(notificacion).then(
          (item: ItemAddResult) => {
            this.MostrarExitoso("La solicitud se ha suspendido correctamente");
            this.modalRef.hide();
            this.spinner.hide();
            this.router.navigate(['/mis-solicitudes']);
          }, err => {
            this.mostrarError('Error agregando la notificación');
            this.spinner.hide();
          }
        ).catch(
          (error) => {
            console.log(error);
            this.spinner.hide();
          }
        )
      }, err => {
        this.mostrarError('Error suspendiendo la solicitud');
        this.spinner.hide();
      }
    ).catch(
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    )
    }


  reactivar(template: TemplateRef<any>, element) {
    console.log(element);
    this.idSolicitud = element.id;
    this.comprador = element.comprador;
    this.modalRef = this.modalServicio.show(template, { class: 'modal-md' });
  }

  confirmarReactivar() {
    let objReac;
    let objHistorial;
    let estado = "Negociar contrato";
    let fechaReactivacion = new Date();
    
    objReac = {
      Reactivada: true,
      FechaReactivacion: fechaReactivacion,
      Estado: estado,
      ComentarioReactivar: this.comentarioSuspension,
      ResponsableId: this.comprador.ID
    }
    objHistorial = {
      Title: 'Suspensión - Reactivada',
      ResponsableReactivacion: this.usuarioActual.nombre, 
      FechaReactivacion: new Date(),
      Comentarios: this.comentarioSuspension
    }
    let notificacion = {
      IdSolicitud: this.idSolicitud.toString(),
      ResponsableId: this.comprador.ID,
      Estado: estado
    };
    this.servicio.obtenerReactivarHistorial(this.idSolicitud.toString()).subscribe(
      (respuesta) => {
        console.log(respuesta);
        let idHistorial =  respuesta[0].ID;

          this.servicio.reactivarHistorial(objHistorial, idHistorial).then(
            (respuesta) => {
              console.log(respuesta);
              this.mostrarInformacion('Se guardó un registro de la reactivación');
            }
          )
      }
    )

    
    this.servicio.reactivarSolicitud(this.idSolicitud, objReac).then(
      (item: ItemAddResult) => {
        this.servicio.agregarNotificacion(notificacion).then(
          (item: ItemAddResult) => {
            this.MostrarExitoso("La solicitud se ha reactivado correctamente");
            this.modalRef.hide();
            this.spinner.hide();
            this.router.navigate(['/mis-solicitudes']);
          }, err => {
            this.mostrarError('Error agregando la notificación');
            this.spinner.hide();
          }
        ).catch(
          (error) => {
            console.log(error);
            this.spinner.hide();
          }
        )
      }
    ).catch(
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    )
  }

  confirmarReactivarSondeo () {
    let objReac;
    let estado = "Por sondear";
    let fechaReactivacion = new Date();
    objReac = {
      ReactivadaSondeo: true,
      FechaReactivacionSondeo: fechaReactivacion,
      Estado: estado,
      ResponsableId: this.comprador.ID
    }
    let notificacion = {
      IdSolicitud: this.idSolicitud.toString(),
      ResponsableId: this.comprador.ID,
      Estado: estado
    };
    this.servicio.reactivarSolicitud(this.idSolicitud, objReac).then(
      (respuesta) => {
        this.servicio.agregarNotificacion(notificacion).then(
          (item: ItemAddResult) => {
            this.MostrarExitoso("La solicitud se ha reactivado correctamente");
            this.modalRef.hide();
            this.spinner.hide();
            this.router.navigate(['/mis-solicitudes']);
          }, err => {
            this.mostrarError('Error agregando la notificación');
            this.spinner.hide();
          }
        ).catch(
          (error) => {
            console.log(error);
            this.spinner.hide();
          }
        )
      }
    ).catch(
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    )
  }

  confirmarDescarte(template: TemplateRef<any>, element) {
    this.idSolicitudDescartar = element.id;
    this.responsableId = element.responsable.ID;
    this.modalRef = this.modalServicio.show(template, { class: 'modal-sm' });
  }

  declinar() {
    this.modalRef.hide();
  }

  aceptarDescarte() {
    console.log(this.idSolicitud);
    let ObjCont;
    let estado = 'Solicitud descartada'
    ObjCont = {
      ResponsableId: null,
      Estado: estado,
    }

    this.servicio.descartarSolicitud(this.idSolicitudDescartar, ObjCont).then(
      (respuesta) => {

        let notificacion = {
          IdSolicitud: this.idSolicitudDescartar.toString(),
          ResponsableId: this.responsableId,
          Estado: estado,
        };

        this.servicio.agregarNotificacion(notificacion).then(
          (item: ItemAddResult) => {
            this.MostrarExitoso("La solicitud se ha descartado con éxito");
            this.modalRef.hide();
            this.salir();
            sessionStorage.removeItem("IdSolicitud");
          }, err => {
            this.mostrarError('Error agregando la notificación');
            this.spinner.hide();
          }
        )
      }
    ).catch(
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    )
  }

  salir() {
    this.router.navigate(["/mis-solicitudes"]);
  }
}
