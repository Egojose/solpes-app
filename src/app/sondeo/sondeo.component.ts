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
  ObjCondicionesTecnicas: CondicionesTecnicasBienes[] = [];
  ObjCondicionesTecnicasServicios: CondicionTecnicaServicios[] = [];
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
    this.servicio.ObtenerSolicitudBienesServicios(1).subscribe(
      solicitud => {
        this.IdSolicitud = solicitud.Id;
        this.fechaDeseada = solicitud.FechaDeseadaEntrega;
        this.solicitante = solicitud.Solicitante;
        this.ordenadorGasto = solicitud.OrdenadorGastos.Title;
        this.empresa = solicitud.Empresa.Title;
        this.pais = solicitud.Pais.Title;
        this.categoria = solicitud.Categoria;
        this.subCategoria = solicitud.Categoria;
        this.comprador = solicitud.Comprador;
        this.alcance = solicitud.Alcance;
        this.justificacion = solicitud.Justificacion;
        this.comentarioSondeo = solicitud.ComentarioSondeo;
        if (solicitud.CondicionesContractuales != null) {
          this.condicionesContractuales = JSON.parse(solicitud.CondicionesContractuales).condiciones;
        }
        this.servicio.ObtenerCondicionesTecnicasBienes(this.IdSolicitud).subscribe(
          RespuestaCondiciones => {
            this.ObjCondicionesTecnicas = CondicionesTecnicasBienes.fromJsonList(RespuestaCondiciones);
            this.loading = false;
          }
        )
        this.servicio.ObtenerCondicionesTecnicasServicios(this.IdSolicitud).subscribe(
          RespuestaCondicionesServicios => {
            this.ObjCondicionesTecnicasServicios = CondicionTecnicaServicios.fromJsonList(RespuestaCondicionesServicios);
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

    for (let i = 0; i < this.ObjCondicionesTecnicas.length; i++) {

      if (this.EsCampoVacio(this.ObjCondicionesTecnicas[i].cantidad)) {
        this.mostrarAdvertencia("Hay alguna cantidad sin llenar en condiciones de bienes");
        this.loading = false;
        break;
      }

      if (this.EsCampoVacio(this.ObjCondicionesTecnicas[i].valorEstimado)) {
        this.mostrarAdvertencia("Hay algún precio sin llenar en condiciones de bienes");
        this.loading = false;
        break;
      }

      if (this.EsCampoVacio(this.ObjCondicionesTecnicas[i].codigo)) {
        this.mostrarAdvertencia("Hay algún código sin llenar en condiciones de bienes");
        this.loading = false;
        break;
      }

      objSondeo = {
        CodigoSondeo: this.ObjCondicionesTecnicas[i].codigo,
        CantidadSondeo: this.ObjCondicionesTecnicas[i].cantidad,
        PrecioSondeo: this.ObjCondicionesTecnicas[i].valorEstimado,
        Comentarios: this.ObjCondicionesTecnicas[i].comentario
      }

      this.servicio.guardarSondeoBienes(this.ObjCondicionesTecnicas[i].IdBienes, objSondeo).then(
        (resultado: ItemAddResult) => {
          if (this.ObjCondicionesTecnicas[i].archivoAdjunto != null) {
            let nombreArchivo = "sondeoBienes-" + this.generarllaveSoporte() + "-" + this.ObjCondicionesTecnicas[i].archivoAdjunto.name;
            this.servicio.agregarAdjuntoCondicionesTecnicasBienes(this.ObjCondicionesTecnicas[i].IdBienes, nombreArchivo, this.ObjCondicionesTecnicas[i].archivoAdjunto).then(
              (respuesta) => {
                contador++
                if (contador === this.ObjCondicionesTecnicas.length) {
                  this.MostrarExitoso("El sondeo de bienes se ha guardado correctamente");
                  this.loading = false;
                }
              }, err => {
                this.mostrarError('Error adjuntando el archivo en las condiciones técnicas de bienes');
                this.GuardarSondeoServicios();
              }
            )
          } else {
            contador++
            if (contador === this.ObjCondicionesTecnicas.length) {
              this.MostrarExitoso("El sondeo de bienes se ha guardado correctamente");
              this.GuardarSondeoServicios();
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
    for (let i = 0; i < this.ObjCondicionesTecnicasServicios.length; i++) {
      if (this.EsCampoVacio(this.ObjCondicionesTecnicasServicios[i].cantidad)) {
        this.mostrarAdvertencia("Hay alguna cantidad sin llenar en condiciones de servicios");
        this.loading = false;
        break;
      }

      if (this.EsCampoVacio(this.ObjCondicionesTecnicasServicios[i].valorEstimado)) {
        this.mostrarAdvertencia("Hay algún precio sin llenar en condiciones de servicios");
        this.loading = false;
        break;
      }

      if (this.EsCampoVacio(this.ObjCondicionesTecnicasServicios[i].codigo)) {
        this.mostrarAdvertencia("Hay algún código sin llenar en condiciones de servicios");
        this.loading = false;
        break;
      }

      objSondeo = {
        CodigoSondeo: this.ObjCondicionesTecnicasServicios[i].codigo,
        CantidadSondeo: this.ObjCondicionesTecnicasServicios[i].cantidad,
        PrecioSondeo: this.ObjCondicionesTecnicasServicios[i].valorEstimado,
        Comentario: this.ObjCondicionesTecnicasServicios[i].comentarios
      }

      this.servicio.guardarSondeoServicios(this.ObjCondicionesTecnicasServicios[i].id, objSondeo).then(
        (resultado: ItemAddResult) => {
          if (this.ObjCondicionesTecnicasServicios[i].archivoAdjunto != null) {
            let nombreArchivo = "sondeoServicios-" + this.generarllaveSoporte() + "-" + this.ObjCondicionesTecnicasServicios[i].archivoAdjunto.name;
            this.servicio.agregarAdjuntoCondicionesTecnicasServicios(this.ObjCondicionesTecnicasServicios[i].id, nombreArchivo, this.ObjCondicionesTecnicasServicios[i].archivoAdjunto).then(
              (respuesta) => {
                contador++
                if (contador === this.ObjCondicionesTecnicasServicios.length) {
                  this.MostrarExitoso("El sondeo de servicios se ha guardado correctamente");
                  this.loading = false;
                }
              }, err => {
                this.mostrarError('Error adjuntando el archivo en las condiciones técnicas de servicios');
                this.loading = false;
              }
            )
          } else {
            contador++
            if (contador === this.ObjCondicionesTecnicasServicios.length) {
              this.MostrarExitoso("El sondeo de servicios se ha guardado correctamente");
              this.loading = false;
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
    this.GuardarSondeoBienes();
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
    this.router.navigate(["/mis-solicitudes"]);
  }

  generarllaveSoporte(): string {
    var fecha = new Date();
    var valorprimitivo = fecha.valueOf().toString();
    return valorprimitivo;
  }
}
