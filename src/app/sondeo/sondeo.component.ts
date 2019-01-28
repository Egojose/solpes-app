import { Component, OnInit } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { CondicionContractual } from '../dominio/condicionContractual';
import { CondicionesTecnicasBienes } from '../sondeo/condicionesTecnicasBienes';
import { FormControl } from '@angular/forms';
import { CondicionTecnicaServicios } from '../sondeo/condicionesTecnicasServicios';
import { ItemAddResult } from 'sp-pnp-js';
import { Usuario } from '../dominio/usuario';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
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
  solicitante: string;
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
  ObjCondicionesTecnicasBienesLectura: CondicionesTecnicasBienes[] = [];
  ObjCondicionesTecnicasBienesGuardar: CondicionesTecnicasBienes[] = [];
  ObjCondicionesTecnicasServiciosLectura: CondicionTecnicaServicios[] = [];
  ObjCondicionesTecnicasServiciosGuardar: CondicionTecnicaServicios[] = [];
  RDBOrdenadorGastos: any;
  numeroSolpSap: string;
  ComentarioRegistrarSap: string;
  submitted = false;
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
  constructor(private servicio: SPServicio, public toastr: ToastrManager, private router: Router) {
    this.IdSolicitudParms = sessionStorage.getItem("IdSolicitud");
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    this.ObtenerUsuarioActual();
  }

  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        this.usuario = new Usuario(Response.Title, Response.email, Response.Id);
        this.ObtenerSolicitudBienesServicios();
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
        this.loading = false;
      }
    )
  }

  ObtenerSolicitudBienesServicios() {
    this.servicio.ObtenerSolicitudBienesServicios(this.IdSolicitudParms).subscribe(
      solicitud => {
        this.IdSolicitud = solicitud.Id;
        this.tipoSolicitud = solicitud.TipoSolicitud;
        this.codigoAriba = solicitud.CodigoAriba;
        this.numeroOrdenEstadistica = solicitud.NumeroOrdenEstadistica;
        this.fechaDeseada = solicitud.FechaDeseadaEntrega;
        this.solicitante = solicitud.Solicitante;
        this.ordenadorGasto = solicitud.OrdenadorGastos.Title;
        this.empresa = solicitud.Empresa.Title;
        this.pais = solicitud.Pais.Title;
        this.PaisId = solicitud.Pais.Id
        this.categoria = solicitud.Categoria;
        this.subCategoria = solicitud.Categoria;
        this.comprador = solicitud.Comprador.Title;
        this.alcance = solicitud.Alcance;
        this.justificacion = solicitud.Justificacion;
        this.comentarioSondeo = solicitud.ComentarioSondeo;
        this.autorId = solicitud.AuthorId;
        if (solicitud.CondicionesContractuales != null) {
          this.condicionesContractuales = JSON.parse(solicitud.CondicionesContractuales).condiciones;
        }
      
        this.servicio.ObtenerCondicionesTecnicasBienes(this.IdSolicitud).subscribe(
          RespuestaCondiciones => {
            this.ObjCondicionesTecnicasBienesLectura = CondicionesTecnicasBienes.fromJsonList(RespuestaCondiciones);
            this.ObjCondicionesTecnicasBienesGuardar = CondicionesTecnicasBienes.fromJsonList(RespuestaCondiciones);

            this.loading = false;
          }
        )

        this.servicio.ObtenerCondicionesTecnicasServicios(this.IdSolicitud).subscribe(
          RespuestaCondicionesServicios => {
            this.ObjCondicionesTecnicasServiciosLectura = CondicionTecnicaServicios.fromJsonList(RespuestaCondicionesServicios);
            this.ObjCondicionesTecnicasServiciosGuardar = CondicionTecnicaServicios.fromJsonList(RespuestaCondicionesServicios);
            this.loading = false;
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
    this.loading = true;
    let objSondeo;
    let contador = 0;
    for (let i = 0; i < this.ObjCondicionesTecnicasBienesGuardar.length; i++) {
      if (this.EsCampoVacio(this.ObjCondicionesTecnicasBienesGuardar[i].cantidad)) {
        this.mostrarAdvertencia("Hay alguna cantidad sin llenar en condiciones de bienes");
        this.loading = false;
        break;
      }
      if (this.EsCampoVacio(this.ObjCondicionesTecnicasBienesGuardar[i].valorEstimado)) {
        this.mostrarAdvertencia("Hay algún precio sin llenar en condiciones de bienes");
        this.loading = false;
        break;
      }
      if (this.EsCampoVacio(this.ObjCondicionesTecnicasBienesGuardar[i].codigo)) {
        this.mostrarAdvertencia("Hay algún código sin llenar en condiciones de bienes");
        this.loading = false;
        break;
      }
      objSondeo = {
        CodigoSondeo: this.ObjCondicionesTecnicasBienesGuardar[i].codigo,
        CantidadSondeo: this.ObjCondicionesTecnicasBienesGuardar[i].cantidad,
        PrecioSondeo: this.ObjCondicionesTecnicasBienesGuardar[i].valorEstimado,
        ComentarioSondeo: this.ObjCondicionesTecnicasBienesGuardar[i].ComentarioSondeo
      }
      this.servicio.guardarSondeoBienes(this.ObjCondicionesTecnicasBienesGuardar[i].IdBienes, objSondeo).then(
        (resultado: ItemAddResult) => {
          if(this.ObjCondicionesTecnicasBienesGuardar[i].archivoAdjunto === null || this.ObjCondicionesTecnicasBienesGuardar[i].archivoAdjunto === "" || this.ObjCondicionesTecnicasBienesGuardar[i].archivoAdjunto === undefined) {
            this.mostrarAdvertencia("Debe adjuntar el archivo del sondeo para cada bien");
          }
          if (this.ObjCondicionesTecnicasBienesGuardar[i].archivoAdjunto != null || this.ObjCondicionesTecnicasBienesGuardar[i].archivoAdjunto != "" ) {
            let nombreArchivo = "sondeoBienes-" + this.generarllaveSoporte() + "_" + this.ObjCondicionesTecnicasBienesGuardar[i].archivoAdjunto.name;
            this.servicio.agregarAdjuntoCondicionesTecnicasBienes(this.ObjCondicionesTecnicasBienesGuardar[i].IdBienes, nombreArchivo, this.ObjCondicionesTecnicasBienesGuardar[i].archivoAdjunto).then(
              (respuesta) => {
                contador++
                if (contador === this.ObjCondicionesTecnicasBienesGuardar.length) {
                  this.MostrarExitoso("El sondeo de bienes se ha guardado correctamente");
                  if(this.ObjCondicionesTecnicasServiciosGuardar.length > 0){
                    this.GuardarSondeoServicios();
                  }else{
                    this.guardarComentarioEstado();
                  }
                }
              }, err => {
                this.mostrarError('Error adjuntando el archivo en las condiciones técnicas de bienes');
                this.loading = false;
              }
            )
          } else {
            contador++
            if (contador === this.ObjCondicionesTecnicasBienesGuardar.length) {
              this.MostrarExitoso("El sondeo de bienes se ha guardado correctamente");
              if(this.ObjCondicionesTecnicasServiciosGuardar.length > 0){
                this.GuardarSondeoServicios();
              }else{
                this.guardarComentarioEstado();
              }
            }
          }
        }
      ).catch(
        (error) => {
          console.log(error);
          this.loading = false;
        }
      )
    }
  }

  GuardarSondeoServicios() {
    let objSondeo;
    let contador = 0;
    for (let i = 0; i < this.ObjCondicionesTecnicasServiciosGuardar.length; i++) {
      if (this.EsCampoVacio(this.ObjCondicionesTecnicasServiciosGuardar[i].cantidad)) {
        this.mostrarAdvertencia("Hay alguna cantidad sin llenar en condiciones de servicios");
        this.loading = false;
        break;
      }
      if (this.EsCampoVacio(this.ObjCondicionesTecnicasServiciosGuardar[i].valorEstimado)) {
        this.mostrarAdvertencia("Hay algún precio sin llenar en condiciones de servicios");
        this.loading = false;
        break;
      }
      if (this.EsCampoVacio(this.ObjCondicionesTecnicasServiciosGuardar[i].codigo)) {
        this.mostrarAdvertencia("Hay algún código sin llenar en condiciones de servicios");
        this.loading = false;
        break;
      }
      objSondeo = {
        CodigoSondeo: this.ObjCondicionesTecnicasServiciosGuardar[i].codigo,
        CantidadSondeo: this.ObjCondicionesTecnicasServiciosGuardar[i].cantidad,
        PrecioSondeo: this.ObjCondicionesTecnicasServiciosGuardar[i].valorEstimado,
        ComentarioSondeo: this.ObjCondicionesTecnicasServiciosGuardar[i].ComentarioSondeo
      }
      this.servicio.guardarSondeoServicios(this.ObjCondicionesTecnicasServiciosGuardar[i].id, objSondeo).then(
        (resultado: ItemAddResult) => {
          if(this.ObjCondicionesTecnicasServiciosGuardar[i].archivoAdjunto === null || this.ObjCondicionesTecnicasServiciosGuardar[i].archivoAdjunto === "" || this.ObjCondicionesTecnicasServiciosGuardar[i].archivoAdjunto === undefined) {
            this.mostrarAdvertencia("Debe adjuntar el archivo del sondeo para cada servicio");
          }
          if (this.ObjCondicionesTecnicasServiciosGuardar[i].archivoAdjunto != null || this.ObjCondicionesTecnicasServiciosGuardar[i].archivoAdjunto != "") {
            let nombreArchivo = "sondeoServicios-" + this.generarllaveSoporte() + "_" + this.ObjCondicionesTecnicasServiciosGuardar[i].archivoAdjunto.name;
            this.servicio.agregarAdjuntoCondicionesTecnicasServicios(this.ObjCondicionesTecnicasServiciosGuardar[i].id, nombreArchivo, this.ObjCondicionesTecnicasServiciosGuardar[i].archivoAdjunto).then(
              (respuesta) => {
                contador++
                if (contador === this.ObjCondicionesTecnicasServiciosGuardar.length) {
                  this.MostrarExitoso("El sondeo de servicios se ha guardado correctamente");
                  this.guardarComentarioEstado();
                }
              }, err => {
                this.mostrarError('Error adjuntando el archivo en las condiciones técnicas de servicios');
                this.loading = false;
              }
            )
          } else {
            contador++
            if (contador === this.ObjCondicionesTecnicasServiciosGuardar.length) {
              this.MostrarExitoso("El sondeo de servicios se ha guardado correctamente");
              this.guardarComentarioEstado();
            }
          }
        }
      ).catch(
        (error) => {
          console.log(error);
          this.loading = false;
        }
      )
    }
  }

  guardarComentarioEstado(){
    let ObjSondeo;
    let fecha =  new Date();
    let dia = ("0" + fecha.getDate()).slice(-2);
    let mes = ("0" + (fecha.getMonth() + 1)).slice(-2);
    let año = fecha.getFullYear();
    let fechaFormateada = dia + "/" + mes + "/" + año;
    if (this.ComentarioSolicitante != undefined) {
      if(this.comentarioSondeo === null) {
        this.comentarioSondeo = "Comentarios:"
      }
      ObjSondeo = {
        ResponsableId: this.autorId,
        Estado: "Por aprobar sondeo",
        ComentarioSondeo: this.comentarioSondeo + '\n' + fechaFormateada + ' ' + this.usuario.nombre + ':' + ' ' + this.ComentarioSolicitante
      }
    }
    else{
      ObjSondeo = {
        ResponsableId: this.autorId,
        Estado: "Por aprobar sondeo"
      }
    }

    this.servicio.guardarRegSondeo(this.IdSolicitud,ObjSondeo).then(
      (respuesta)=>{
        this.loading = false;
        sessionStorage.removeItem("IdSolicitud");
        this.salir();
      }
    ).catch(
      (error)=>{
        console.log(error);
        this.loading = false;
      }
    )
  }

  adjuntarArchivoCTB(event, item) {
    let archivoAdjunto = event.target.files[0];
    if (archivoAdjunto != null) {
      item.archivoAdjunto = archivoAdjunto;
    } else {
      item.archivoAdjunto = null;
    }
  }

  adjuntarArchivoCTS(event, item) {
    let archivoAdjunto = event.target.files[0];
    if (archivoAdjunto != null) {
      item.archivoAdjunto = archivoAdjunto;
    } else {
      item.archivoAdjunto = null;
    }
  }

  guardarEnviar(){
    if(this.ObjCondicionesTecnicasBienesGuardar.length > 0){
      this.GuardarSondeoBienes();
    }else if(this.ObjCondicionesTecnicasServiciosGuardar.length > 0){
      this.GuardarSondeoServicios();
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
