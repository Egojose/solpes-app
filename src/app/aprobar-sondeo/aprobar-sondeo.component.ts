import { Component, OnInit, ViewChild } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { CondicionContractual } from '../dominio/condicionContractual';
import { CondicionesTecnicasBienes } from '../aprobar-sondeo/condicionesTecnicasBienes';
import { FormGroup } from '@angular/forms';
import { CondicionTecnicaServicios } from '../aprobar-sondeo/condicionesTecnicasServicios';
import { Router } from '@angular/router';
import { ItemAddResult } from 'sp-pnp-js';
import { Usuario } from '../dominio/usuario';
import { responsableProceso } from '../dominio/responsableProceso';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { Solicitud } from '../dominio/solicitud';

@Component({
  selector: 'app-aprobar-sondeo',
  templateUrl: './aprobar-sondeo.component.html',
  styleUrls: ['./aprobar-sondeo.component.css']
})
export class AprobarSondeoComponent implements OnInit {
  @ViewChild('customTooltip') tooltip: any;
  @ViewChild('customTooltip1') tooltip1: any;
  @ViewChild('customTooltip2') tooltip2: any;
  ObjSolicitud: any;
  condicionesContractuales: CondicionContractual[] = [];
  fechaDeseada: Date;
  solicitante: string;
  tipoSolicitud: string;
  panelOpenState = false;
  codigoAriba: string;
  numeroOrdenEstadistico: string;
  ordenadorGasto: string;
  empresa: string;
  pais: string;
  categoria: string;
  subCategoria: string;
  comprador: string;
  justificacion: string;
  alcance: string;
  ObjCondicionesContractuales: any;
  IdSolicitud: any;
  ObjCondicionesTecnicas: CondicionesTecnicasBienes[] = [];
  ObjCondicionesTecnicasServicios: CondicionTecnicaServicios[] = [];
  AgregarElementoForm: FormGroup;
  RDBOrdenadorGastos: any;
  numeroSolpSap: string;
  ComentarioRegistrarSap: string;
  JustificacionSondeo: string;
  numeroSolpCm: string;
  submitted = false;
  IdSolicitudParms: any;
  RDBsondeo: any;
  ComentarioSondeo: string;
  justificacionSondeo: string;
  historial: string;
  contratoMarco: string;
  comentarioSondeo: string;
  usuario: Usuario;
  loading: boolean;
  paisId: any;
  ObResProceso: responsableProceso[] = [];
  CompradorId: any;
  existeCondicionesTecnicasBienes: boolean;
  existeCondicionesTecnicasServicios: boolean;
  ResponsableProceso: number;
  estadoSolicitud: string;
  solicitudRecuperada: Solicitud;
  usuarioActual: Usuario;
  perfilacion: boolean;

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
        this.mostrarAdvertencia("La solicitud no se encuentra en el estado correcto para aprobar sondeo");
        this.router.navigate(['/mis-solicitudes']);
      }
    }
  }

  verificarEstado(): boolean {
    if(this.solicitudRecuperada.estado == 'Por aprobar sondeo'){
      return true;
    }else{
      return false;
    }
  }

  verificarResponsable(): boolean{
    if(this.solicitudRecuperada.responsable.ID == this.usuarioActual.id){
      return true;
    }else{
      return false;
    }
  }

  GuardarRevSondeo() {
    this.spinner.show();
    let fecha = new Date();
    let dia = ("0" + fecha.getDate()).slice(-2);
    let mes = ("0" + (fecha.getMonth() + 1)).slice(-2);
    let año = fecha.getFullYear();
    let fechaFormateada = dia + "/" + mes + "/" + año;

    let ObjSondeo;
    if (this.RDBsondeo === undefined) {
      this.mostrarAdvertencia('Debe seleccionar una acción');
      this.spinner.hide();
    }

    if (this.comentarioSondeo == null || this.comentarioSondeo == undefined) {
      this.comentarioSondeo = "Comentarios: ";
    }
    if (this.ComentarioSondeo == null || this.ComentarioSondeo == undefined) {
      this.ComentarioSondeo = "Sin comentario.";
    }

    if (this.RDBsondeo !== undefined) {
      if (this.RDBsondeo === 1 && this.ComentarioSondeo === undefined) {
        return this.ValidarComentarios();
      }
      else if (this.RDBsondeo === 1) {
        this.ResponsableProceso = this.CompradorId;
        this.estadoSolicitud = 'Por sondear';
        ObjSondeo = {
          ResponsableId: this.ResponsableProceso,
          Estado: this.estadoSolicitud,
          ResultadoSondeo: "Sondeo adicional",
          Resondear: true,
          ComentarioSondeo: this.comentarioSondeo + '\n' + fechaFormateada + ' ' + this.usuario.nombre + ':' + ' ' + this.ComentarioSondeo,
          FechaRevisarSondeo: fecha
        }
      this.limpiarAdjuntosSolicitud();
      }
      else if (this.RDBsondeo === 2 && this.justificacionSondeo === undefined) {
        this.numeroSolpCm = '';
        return this.validarJustificacion();
      }
      else if (this.RDBsondeo === 2) {
        if (this.ObjCondicionesTecnicas.length > 0) {
          this.ResponsableProceso = this.ObResProceso[0].porverificarMaterial;
          this.estadoSolicitud = 'Por verificar material';
          ObjSondeo = {
            TipoSolicitud: "Solp",
            ResponsableId: this.ResponsableProceso,
            Estado: this.estadoSolicitud,
            ResultadoSondeo: "Convertir en SOLP",
            Justificacion: this.justificacionSondeo,
            FechaRevisarSondeo: fecha
          }
        } else if (this.ObjCondicionesTecnicas.length === 0 && this.ObjCondicionesTecnicasServicios.length > 0) {
          this.ResponsableProceso = this.ObResProceso[0].porRegistrarSolp;
          this.estadoSolicitud = 'Por registrar solp sap';
          ObjSondeo = {
            TipoSolicitud: "Solp",
            ResponsableId: this.ResponsableProceso,
            Estado: this.estadoSolicitud,
            ResultadoSondeo: "Convertir en SOLP",
            Justificacion: this.justificacionSondeo,
            FechaRevisarSondeo: fecha
          }
        }
      }
      else if (this.RDBsondeo === 3) {
        this.estadoSolicitud = 'Solicitud descartada';
        ObjSondeo = {
          ResponsableId: null,
          Estado: this.estadoSolicitud,
          ResultadoSondeo: "Descartar",
          FechaRevisarSondeo: fecha
        }
      }
      if (this.RDBsondeo === 4 && this.justificacionSondeo === undefined) {
        return this.validarJustificacion();
      }
      else if (this.RDBsondeo === 4) {
        if (this.ObjCondicionesTecnicas.length > 0) {
          this.ResponsableProceso = this.ObResProceso[0].porverificarMaterial;
          this.estadoSolicitud = 'Por verificar material';
          this.numeroSolpCm = this.numeroSolpCm.valueOf();
          ObjSondeo = {
            TipoSolicitud: "Orden a CM",
            ResponsableId: this.ResponsableProceso,
            Estado: this.estadoSolicitud,
            ResultadoSondeo: "Convertir en CM",
            Justificacion: this.justificacionSondeo,
            CM: this.numeroSolpCm,
            FechaRevisarSondeo: fecha
          }
        } else if (this.ObjCondicionesTecnicas.length === 0 && this.ObjCondicionesTecnicasServicios.length > 0) {
          this.ResponsableProceso = this.ObResProceso[0].porRegistrarSolp;
          this.estadoSolicitud = 'Por registrar solp sap';
          this.numeroSolpCm = this.numeroSolpCm.valueOf();
          ObjSondeo = {
            TipoSolicitud: "Orden a CM",
            ResponsableId: this.ResponsableProceso,
            Estado: this.estadoSolicitud,
            ResultadoSondeo: "Convertir en CM",
            Justificacion: this.justificacionSondeo,
            CM: this.numeroSolpCm,
            FechaRevisarSondeo: fecha
          }
        }
      }

      this.servicio.guardarRegSondeo(this.IdSolicitud, ObjSondeo).then(
        (resultado: ItemAddResult) => {
          let notificacion = {
            IdSolicitud: this.IdSolicitud.toString(),
            ResponsableId: this.ResponsableProceso,
            Estado: this.estadoSolicitud
          };

          this.servicio.agregarNotificacion(notificacion).then(
            (item: ItemAddResult) => {
              this.MostrarExitoso("La acción se ha guardado con éxito");
              this.spinner.hide();
              setTimeout(() => {
                this.salir();
              }, 1000);
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
  }
  limpiarAdjuntosSolicitud() {
    
    if(this.existeCondicionesTecnicasBienes){

      this.ObjCondicionesTecnicas.forEach(
        objCt =>{
          if(objCt.adjunto !== null)
          {                            
            this.servicio.borrarAdjuntoCondicionesTecnicasBienes(objCt.adjunto.id, objCt.adjunto.filename).then(
              (respuesta) => {
                console.log('Se ha borrado el adjunto del sondeo Bienes');
              }, err => {
                console.log('Error al borrar el adjunto de bienes: ' + err);
              }
            )
          }
        }
      );      
    }
    if(this.existeCondicionesTecnicasServicios){
      this.ObjCondicionesTecnicasServicios.forEach(
        objCt =>{
        if(objCt.adjunto !== null)
        { 
          this.servicio.borrarAdjuntoCondicionesTecnicasServicios(objCt.id, objCt.adjunto).then(
            (respuesta) => {
              console.log('Se ha borrado el adjunto del sondeo Servicios');
            }, err => {
              console.log('Error al borrar el adjunto de servicios: ' + err);
            }
          )
        }  
      });
    }
  
  }

  private validarJustificacion() {
    this.tooltip1.show();
    setTimeout(() => {
      this.tooltip1.hide();
    }, 3000);
    this.spinner.hide();
    return false;
  }

  private ValidarComentarios() {
    this.tooltip.show();
    setTimeout(() => {
      this.tooltip.hide();
    }, 3000);
    this.spinner.hide();
    return false;
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

  salir() {
    this.router.navigate(["/mis-pendientes"]);
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

  ObtenerSolicitudBienesServicios() {
    this.servicio.ObtenerSolicitudBienesServicios(this.IdSolicitudParms).subscribe(
      solicitud => {
        this.tipoSolicitud = solicitud.TipoSolicitud;
        this.contratoMarco = solicitud.CM;
        this.codigoAriba = solicitud.CodigoAriba;
        this.numeroOrdenEstadistico = solicitud.NumeroOrdenEstadistica;
        this.IdSolicitud = solicitud.Id;
        this.historial = solicitud.ComentarioSondeo;
        this.fechaDeseada = solicitud.FechaDeseadaEntrega;
        this.solicitante = solicitud.Solicitante;
        this.ordenadorGasto = solicitud.OrdenadorGastos.Title;
        this.empresa = solicitud.Empresa.Title;
        this.pais = solicitud.Pais.Title;
        this.paisId = solicitud.Pais.Id;
        this.categoria = solicitud.Categoria;
        this.subCategoria = solicitud.Subcategoria;
        this.comprador = solicitud.Comprador.Title;
        this.CompradorId = solicitud.Comprador.ID;
        this.alcance = solicitud.Alcance;        
        this.comentarioSondeo = (solicitud.ComentarioSondeo != undefined) ? solicitud.ComentarioSondeo : '';
        this.justificacion = solicitud.Justificacion;

        if (solicitud.CondicionesContractuales != null) {
          this.condicionesContractuales = JSON.parse(solicitud.CondicionesContractuales).condiciones;
        }

        this.servicio.ObtenerCondicionesTecnicasBienes(this.IdSolicitud).subscribe(
          RespuestaCondiciones => {
            if (RespuestaCondiciones.length > 0) {
              this.existeCondicionesTecnicasBienes = true;
              this.ObjCondicionesTecnicas = CondicionesTecnicasBienes.fromJsonList(RespuestaCondiciones);
            }
            this.spinner.hide();
          }
        )
        this.servicio.ObtenerCondicionesTecnicasServicios(this.IdSolicitud).subscribe(
          RespuestaCondicionesServicios => {
            if (RespuestaCondicionesServicios.length > 0) {
              this.existeCondicionesTecnicasServicios = true;
              this.ObjCondicionesTecnicasServicios = CondicionTecnicaServicios.fromJsonList(RespuestaCondicionesServicios);
            }
            this.spinner.hide();
          }
        )
        this.servicio.obtenerResponsableProcesos(this.paisId).subscribe(
          (RespuestaProcesos) => {
            this.ObResProceso = responsableProceso.fromJsonList(RespuestaProcesos);
            this.spinner.hide();
          }
        )
      }
    );
  }
}