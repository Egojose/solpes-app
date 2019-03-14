import { Component, OnInit, Compiler } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { CondicionContractual } from '../dominio/condicionContractual';
import { CondicionesTecnicasBienes } from '../sondeo/condicionesTecnicasBienes';
import { FormControl } from '@angular/forms';
import { CondicionTecnicaServicios } from '../sondeo/condicionesTecnicasServicios';
import { ItemAddResult } from 'sp-pnp-js';
import { Usuario } from '../dominio/usuario';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Solicitud } from '../dominio/solicitud';

@Component({
  selector: 'app-sondeo',
  templateUrl: './sondeo.component.html',
  styleUrls: ['./sondeo.component.css']
})
export class SondeoComponent implements OnInit {
  name = new FormControl('');
  ObjSolicitud: any;
  condicionesContractuales: CondicionContractual[] = [];
  fechaDeseada: Date;
  tipoSolicitud: string;
  contratoMarco: string;
  solicitante: string;
  ordenadorGasto: string;
  panelOpenState1: boolean;
  panelOpenState3: boolean;
  panelOpenState2: boolean;
  empresa: string;
  pais: string;
  categoria: string;
  subCategoria: string;
  comprador: string;
  justificacion: string;
  alcance: string;
  ObjCondicionesContractuales: any;
  IdSolicitud: any;
  ObjCondicionesTecnicasBienesLectura: CondicionesTecnicasBienes[] = [];
  ObjCondicionesTecnicasBienesGuardar: CondicionesTecnicasBienes[] = [];
  ObjCondicionesTecnicasServiciosLectura: CondicionTecnicaServicios[] = [];
  ObjCondicionesTecnicasServiciosGuardar: CondicionTecnicaServicios[] = [];
  RDBOrdenadorGastos: any;
  numeroSolpSap: string;
  ComentarioRegistrarSap: string;
  submitted = false;
  solicitudRecuperada: Solicitud;
  IdSolicitudParms: any;
  ComentarioSondeo: string;
  comentarioSondeo: any;
  historial: string;
  usuario: Usuario;
  loading: boolean;
  ComentarioSolicitante: string;
  PaisId: any;
  autorId: any;
  codigoAriba: string;
  numeroOrdenEstadistica: string;
  existeCondicionesTecnicasBienes: boolean;
  existeCondicionesTecnicasServicios: boolean;
  OrdenEstadistica: boolean;
  perfilacion: boolean;
  usuarioActual: Usuario;

  constructor(private servicio: SPServicio, public toastr: ToastrManager, private router: Router, private spinner: NgxSpinnerService) {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
    this.solicitudRecuperada = JSON.parse(sessionStorage.getItem('solicitud'));
    this.perfilacionEstado();
    this.IdSolicitudParms = this.solicitudRecuperada.id;
    this.existeCondicionesTecnicasBienes = false;
    this.existeCondicionesTecnicasServicios = false;
  }

  private perfilacionEstado() {
    if (this.solicitudRecuperada == null) {
      this.mostrarAdvertencia("No se puede realizar esta acción");
      this.router.navigate(['/mis-solicitudes']);
    }
    else {
      this.perfilacion = this.verificarEstado();
      if (this.perfilacion) {
        this.perfilacion = this.verificarResponsable();
        if (this.perfilacion) {
          console.log("perfilación correcta");
        }
        else {
          this.mostrarAdvertencia("Usted no está autorizado para esta acción: No es el responsable");
          this.router.navigate(['/mis-solicitudes']);
        }
      }
      else {
        this.mostrarAdvertencia("La solicitud no se encuentra en el estado correcto para su sondeo");
        this.router.navigate(['/mis-solicitudes']);
      }
    }
  }

  verificarEstado(): boolean {
    if (this.solicitudRecuperada.estado == 'Por sondear') {
      return true;
    } else {
      return false;
    }
  }

  verificarResponsable(): boolean {
    if (this.solicitudRecuperada.responsable.ID == this.usuarioActual.id) {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit() {
    this.spinner.show();
    this.ObtenerUsuarioActual();
  }

  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        this.usuario = new Usuario(Response.Title, Response.email, Response.Id);
        this.ObtenerSolicitudBienesServicios();
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
        this.spinner.hide();
      }
    )
  }

  ObtenerSolicitudBienesServicios() {
    this.servicio.ObtenerSolicitudBienesServicios(this.IdSolicitudParms).subscribe(
      solicitud => {
        this.IdSolicitud = solicitud.Id;
        this.tipoSolicitud = solicitud.TipoSolicitud;
        this.contratoMarco = solicitud.CM;
        this.codigoAriba = solicitud.CodigoAriba;
        this.fechaDeseada = solicitud.FechaDeseadaEntrega;
        this.solicitante = solicitud.Solicitante;
        this.ordenadorGasto = solicitud.OrdenadorGastos.Title;
        this.empresa = solicitud.Empresa.Title;
        this.pais = solicitud.Pais.Title;
        this.PaisId = solicitud.Pais.Id
        this.categoria = solicitud.Categoria;
        this.subCategoria = solicitud.Subcategoria;
        this.comprador = solicitud.Comprador.Title;
        this.alcance = solicitud.Alcance;
        this.justificacion = solicitud.Justificacion;
        this.comentarioSondeo = solicitud.ComentarioSondeo;
        this.autorId = solicitud.AuthorId;
        this.OrdenEstadistica = solicitud.OrdenEstadistica;
        this.numeroOrdenEstadistica = solicitud.NumeroOrdenEstadistica;
        if (solicitud.CondicionesContractuales != null) {
          this.condicionesContractuales = JSON.parse(solicitud.CondicionesContractuales).condiciones;
        }

        this.servicio.ObtenerCondicionesTecnicasBienes(this.IdSolicitud).subscribe(
          RespuestaCondiciones => {
            if (RespuestaCondiciones.length > 0) {
              this.existeCondicionesTecnicasBienes = true;
              this.ObjCondicionesTecnicasBienesLectura = CondicionesTecnicasBienes.fromJsonList(RespuestaCondiciones);
              this.ObjCondicionesTecnicasBienesGuardar = CondicionesTecnicasBienes.fromJsonList(RespuestaCondiciones);
            }
            this.spinner.hide();
          }
        )

        this.servicio.ObtenerCondicionesTecnicasServicios(this.IdSolicitud).subscribe(
          RespuestaCondicionesServicios => {
            if (RespuestaCondicionesServicios.length > 0) {
              this.existeCondicionesTecnicasServicios = true;
              this.ObjCondicionesTecnicasServiciosLectura = CondicionTecnicaServicios.fromJsonList(RespuestaCondicionesServicios);
              this.ObjCondicionesTecnicasServiciosGuardar = CondicionTecnicaServicios.fromJsonList(RespuestaCondicionesServicios);
            }

            this.spinner.hide();
          }
        )
      }
    );
  }

  EsCampoVacio(valorCampo) {
    if (valorCampo === "" || valorCampo == 'Seleccione' || valorCampo == null || valorCampo === undefined) {
      return true;
    }
    return false;
  }

  GuardarSondeoBienes() {
    let objSondeo;
    let contador = 0;

    for (let i = 0; i < this.ObjCondicionesTecnicasBienesGuardar.length; i++) {

      objSondeo = {
        CodigoSondeo: this.ObjCondicionesTecnicasBienesGuardar[i].codigo,
        CantidadSondeo: this.ObjCondicionesTecnicasBienesGuardar[i].cantidad,
        PrecioSondeo: this.ObjCondicionesTecnicasBienesGuardar[i].valorEstimado.toString(),
        MonedaSondeo: this.ObjCondicionesTecnicasBienesGuardar[i].tipoMonedaSondeo,
        ComentarioSondeo: this.ObjCondicionesTecnicasBienesGuardar[i].ComentarioSondeo
      }

      this.servicio.guardarSondeoBienes(this.ObjCondicionesTecnicasBienesGuardar[i].IdBienes, objSondeo).then(
        (resultado: ItemAddResult) => {
          if (this.ObjCondicionesTecnicasBienesGuardar[i].adjunto != null) {
            let nombreArchivo = "sondeoBienes-" + this.generarllaveSoporte() + "_" + this.ObjCondicionesTecnicasBienesGuardar[i].adjunto.name;
            this.servicio.agregarAdjuntoCondicionesTecnicasBienes(this.ObjCondicionesTecnicasBienesGuardar[i].IdBienes, nombreArchivo, this.ObjCondicionesTecnicasBienesGuardar[i].adjunto).then(
              (respuesta) => {
                contador++;
                if (contador === this.ObjCondicionesTecnicasBienesGuardar.length) {
                  this.MostrarExitoso("El sondeo de bienes se ha guardado correctamente");
                  if (this.ObjCondicionesTecnicasServiciosGuardar.length > 0) {
                    this.GuardarSondeoServicios();
                  } else {
                    this.guardarComentarioEstado();
                  }
                }
              }, err => {
                this.mostrarError('Error adjuntando el archivo en las condiciones técnicas de bienes');
                this.spinner.hide();
              }
            )
          }
          else {
            this.MostrarExitoso("El sondeo de bienes se ha guardado correctamente");
            if (this.ObjCondicionesTecnicasServiciosGuardar.length > 0) {
              this.GuardarSondeoServicios();
            } else {
              this.guardarComentarioEstado();
            }
          }
        }
      ).catch(
        (error) => {
          console.log(error);
          this.spinner.hide();
        }
      )
    }
  }

  validarCamposBienesYServicios(): boolean {
    let respuesta = true;
    if (this.ObjCondicionesTecnicasBienesGuardar.length > 0 && this.ObjCondicionesTecnicasServiciosGuardar.length > 0) {

      for (let i = 0; i < this.ObjCondicionesTecnicasBienesGuardar.length; i++) {

        if (this.EsCampoVacio(this.ObjCondicionesTecnicasBienesGuardar[i].cantidad)) {
          this.mostrarAdvertencia("Hay alguna cantidad sin llenar en condiciones de bienes");
          this.spinner.hide();
          respuesta = false;
          return respuesta;

        }

        if (this.EsCampoVacio(this.ObjCondicionesTecnicasBienesGuardar[i].valorEstimado)) {
          this.mostrarAdvertencia("Hay algún precio sin llenar en condiciones de bienes");
          this.spinner.hide();
          respuesta = false;
          return respuesta;

        }

        if (this.EsCampoVacio(this.ObjCondicionesTecnicasBienesGuardar[i].codigo)) {
          this.mostrarAdvertencia("Hay algún código sin llenar en condiciones de bienes");
          this.spinner.hide();
          respuesta = false;
          return respuesta;

        }
      }

      for (let i = 0; i < this.ObjCondicionesTecnicasServiciosGuardar.length; i++) {

        if (this.EsCampoVacio(this.ObjCondicionesTecnicasServiciosGuardar[i].cantidad)) {
          this.mostrarAdvertencia("Hay alguna cantidad sin llenar en condiciones de servicios");
          this.spinner.hide();
          respuesta = false;
          return respuesta;
        }

        if (this.EsCampoVacio(this.ObjCondicionesTecnicasServiciosGuardar[i].valorEstimado)) {
          this.mostrarAdvertencia("Hay algún precio sin llenar en condiciones de servicios");
          this.spinner.hide();
          respuesta = false;
          return respuesta;
        }

        if (this.EsCampoVacio(this.ObjCondicionesTecnicasServiciosGuardar[i].codigo)) {
          this.mostrarAdvertencia("Hay algún código sin llenar en condiciones de servicios");
          this.spinner.hide();
          respuesta = false;
          return respuesta;
        }
      }

    } else if (this.ObjCondicionesTecnicasBienesGuardar.length > 0) {

      for (let i = 0; i < this.ObjCondicionesTecnicasBienesGuardar.length; i++) {

        if (this.EsCampoVacio(this.ObjCondicionesTecnicasBienesGuardar[i].cantidad)) {
          this.mostrarAdvertencia("Hay alguna cantidad sin llenar en condiciones de bienes");
          this.spinner.hide();
          respuesta = false;
          return respuesta;
        }

        if (this.EsCampoVacio(this.ObjCondicionesTecnicasBienesGuardar[i].valorEstimado)) {
          this.mostrarAdvertencia("Hay algún precio sin llenar en condiciones de bienes");
          this.spinner.hide();
          respuesta = false;
          return respuesta;
        }

        if (this.EsCampoVacio(this.ObjCondicionesTecnicasBienesGuardar[i].codigo)) {
          this.mostrarAdvertencia("Hay algún código sin llenar en condiciones de bienes");
          this.spinner.hide();
          respuesta = false;
          return respuesta;
        }
      }

    } else {

      for (let i = 0; i < this.ObjCondicionesTecnicasServiciosGuardar.length; i++) {

        if (this.EsCampoVacio(this.ObjCondicionesTecnicasServiciosGuardar[i].cantidad)) {
          this.mostrarAdvertencia("Hay alguna cantidad sin llenar en condiciones de servicios");
          this.spinner.hide();
          respuesta = false;
          return respuesta;
        }

        if (this.EsCampoVacio(this.ObjCondicionesTecnicasServiciosGuardar[i].valorEstimado)) {
          this.mostrarAdvertencia("Hay algún precio sin llenar en condiciones de servicios");
          this.spinner.hide();
          respuesta = false;
          return respuesta;
        }

        if (this.EsCampoVacio(this.ObjCondicionesTecnicasServiciosGuardar[i].codigo)) {
          this.mostrarAdvertencia("Hay algún código sin llenar en condiciones de servicios");
          this.spinner.hide();
          respuesta = false;
          return respuesta;
        }
      }
    }

    return respuesta;
  }

  GuardarSondeoServicios() {
    let objSondeo;
    let contador = 0;
    for (let i = 0; i < this.ObjCondicionesTecnicasServiciosGuardar.length; i++) {

      objSondeo = {
        CodigoSondeo: this.ObjCondicionesTecnicasServiciosGuardar[i].codigo,
        CantidadSondeo: this.ObjCondicionesTecnicasServiciosGuardar[i].cantidad,
        PrecioSondeo: this.ObjCondicionesTecnicasServiciosGuardar[i].valorEstimado.toString(),
        MonedaSondeo: this.ObjCondicionesTecnicasServiciosGuardar[i].tipoMonedaSondeo,
        ComentarioSondeo: this.ObjCondicionesTecnicasServiciosGuardar[i].ComentarioSondeo
      }

      this.servicio.guardarSondeoServicios(this.ObjCondicionesTecnicasServiciosGuardar[i].id, objSondeo).then(
        (resultado: ItemAddResult) => {
          if (this.ObjCondicionesTecnicasServiciosGuardar[i].adjunto != null) {
            let nombreArchivo = "sondeoServicios-" + this.generarllaveSoporte() + "_" + this.ObjCondicionesTecnicasServiciosGuardar[i].adjunto.name;
            this.servicio.agregarAdjuntoCondicionesTecnicasServicios(this.ObjCondicionesTecnicasServiciosGuardar[i].id, nombreArchivo, this.ObjCondicionesTecnicasServiciosGuardar[i].adjunto).then(
              (respuesta) => {
                contador++
                if (contador === this.ObjCondicionesTecnicasServiciosGuardar.length) {
                  this.MostrarExitoso("El sondeo de servicios se ha guardado correctamente");
                  this.guardarComentarioEstado();
                }
              }, err => {
                this.mostrarError('Error adjuntando el archivo en las condiciones técnicas de servicios');
                this.spinner.hide();
              }
            )
          }
          else{
            this.MostrarExitoso("El sondeo de servicios se ha guardado correctamente");
            this.guardarComentarioEstado();
          }
        }
      ).catch(
        (error) => {
          console.log(error);
          this.spinner.hide();
        }
      )
    }
  }

  guardarComentarioEstado() {
    let ObjSondeo;
    let fecha = new Date();
    let dia = ("0" + fecha.getDate()).slice(-2);
    let mes = ("0" + (fecha.getMonth() + 1)).slice(-2);
    let año = fecha.getFullYear();
    let fechaFormateada = dia + "/" + mes + "/" + año;
    let estado = "Por aprobar sondeo";
    let fechaSondeo = new Date();

    if (this.comentarioSondeo == null || this.comentarioSondeo == undefined) {
      this.comentarioSondeo = "Comentarios: ";
    }
    if (this.ComentarioSolicitante == null || this.ComentarioSolicitante == undefined) {
      this.ComentarioSolicitante = "Sin comentario.";
    }

    ObjSondeo = {
      ResponsableId: this.autorId,
      Estado: estado,
      ComentarioSondeo: this.comentarioSondeo + '\n' + fechaFormateada + ' ' + this.usuario.nombre + ':' + ' ' + this.ComentarioSolicitante,
      FechaSondeo: fechaSondeo
    }

    this.servicio.guardarRegSondeo(this.IdSolicitud, ObjSondeo).then(
      (respuesta) => {

        let notificacion = {
          IdSolicitud: this.IdSolicitud.toString(),
          ResponsableId: this.autorId,
          Estado: estado,
        };

        this.servicio.agregarNotificacion(notificacion).then(
          (item: ItemAddResult) => {
            this.spinner.hide();
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

  adjuntarArchivoCTB(event, item) {
    let archivoAdjunto = event.target.files[0];
    if (archivoAdjunto != null) {
      item.adjunto = archivoAdjunto;
    } else {
      item.adjunto = null;
    }

  }

  adjuntarArchivoCTS(event, item) {
    let archivoAdjunto = event.target.files[0];
    if (archivoAdjunto != null) {
      item.adjunto = archivoAdjunto;
    } else {
      item.adjunto = null;
    }
  }

  guardarEnviar() {
    this.spinner.show();
    let respuesta = this.validarCamposBienesYServicios();
    if (!respuesta) {
      return false;
    }
    else {
      if (this.ObjCondicionesTecnicasBienesGuardar.length > 0) {
        this.GuardarSondeoBienes();
      } else if (this.ObjCondicionesTecnicasServiciosGuardar.length > 0) {
        this.GuardarSondeoServicios();
      }
    }

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

  salir() {
    this.router.navigate(["/mis-pendientes"]);
  }

  generarllaveSoporte(): string {
    var fecha = new Date();
    var valorprimitivo = fecha.valueOf().toString();
    return valorprimitivo;
  }
}
