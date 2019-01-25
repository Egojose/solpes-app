import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { CondicionContractual } from '../dominio/condicionContractual';
import { CondicionesTecnicasBienes } from '../aprobar-sondeo/condicionesTecnicasBienes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CondicionTecnicaServicios } from '../aprobar-sondeo/condicionesTecnicasServicios';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemAddResult } from 'sp-pnp-js';
import { Usuario } from '../dominio/usuario';
import { responsableProceso } from '../dominio/responsableProceso';
import { ToastrManager } from 'ng6-toastr-notifications';


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
  comentarioSondeo: string;
  usuario: Usuario;
  loading: boolean;
  paisId: any;
  ObResProceso: responsableProceso[]=[];
  CompradorId: any;

  constructor(private servicio: SPServicio, private formBuilder: FormBuilder, public toastr: ToastrManager,private activarRoute: ActivatedRoute, private router: Router) {
    this.IdSolicitudParms = sessionStorage.getItem("IdSolicitud");
    this.loading = false;
  }


  GuardarRevSondeo() {
    let fecha = new Date();
    let dia = ("0" + fecha.getDate()).slice(-2);
    let mes = ("0" + (fecha.getMonth() + 1)).slice(-2);
    let año = fecha.getFullYear();
    let fechaFormateada = dia + "/" + mes + "/" + año;

    let ObjSondeo;
    if (this.RDBsondeo === undefined) {
      this.mostrarAdvertencia('Debe seleccionar una acción')
    }
    if (this.RDBsondeo !== undefined) {
      if (this.RDBsondeo === 1 && this.ComentarioSondeo === undefined) {
        this.tooltip.show();
        setTimeout(() => {
          this.tooltip.hide();
        }, 3000);

        return false;
      }
      else if (this.RDBsondeo === 1) {
        //Comprador
        ObjSondeo = {
          ResponsableId: this.CompradorId,
          Estado: "Por sondear",
          ResultadoSondeo: "Sondeo adicional",
          Resondear: true,
          ComentarioSondeo: this.comentarioSondeo + '\n' + fechaFormateada + ' ' + this.usuario.nombre + ':' + ' ' + this.ComentarioSondeo
        }
      }
      else if (this.RDBsondeo === 2 && this.justificacionSondeo === undefined) {
        this.tooltip1.show();

        setTimeout(() => {
          this.tooltip1.hide();
        }, 3000);

        return false;
      }
      else if (this.RDBsondeo === 2) {

        if (this.ObjCondicionesTecnicas.length > 0) {
          let Responsable = this.ObResProceso[0].porverificarMaterial;
          ObjSondeo = {
            TipoSolicitud: "Solp",
            ResponsableId: Responsable,
            Estado: "Por verificar material",
            ResultadoSondeo: "Convertir en SOLP",
            Justificacion: this.justificacionSondeo
          }
        }else if (this.ObjCondicionesTecnicas.length === 0 && this.ObjCondicionesTecnicasServicios.length > 0) {
          let Responsable = this.ObResProceso[0].porRegistrarSolp;
          ObjSondeo = {
            TipoSolicitud: "Solp",
            ResponsableId: Responsable,
            Estado: "Por registrar solp sap",
            ResultadoSondeo: "Convertir en SOLP",
            Justificacion: this.justificacionSondeo
          }
        }        
      }
      else if (this.RDBsondeo === 3) {
        ObjSondeo = {
          ResponsableId: -1,
          ResultadoSondeo: "Descartar",
        }
      }
      if (this.RDBsondeo === 4 && this.justificacionSondeo === undefined) {
        this.tooltip1.show();
        setTimeout(() => {
          this.tooltip1.hide();
        }, 3000);

        return false;
      }
      else if (this.RDBsondeo === 4) {
        if (this.ObjCondicionesTecnicas.length > 0) {
          let Responsable = this.ObResProceso[0].porverificarMaterial;
          ObjSondeo = {
            TipoSolicitud: "CM",
            ResponsableId: Responsable,
            Estado: "Por verificar material",
            ResultadoSondeo: "Convertir en CM",
            Justificacion: this.justificacionSondeo
          }
        }else if (this.ObjCondicionesTecnicas.length === 0 && this.ObjCondicionesTecnicasServicios.length > 0) {
          let Responsable = this.ObResProceso[0].porRegistrarSolp;
          ObjSondeo = {
            TipoSolicitud: "CM",
            ResponsableId: Responsable,
            Estado: "Por registrar solp sap",
            ResultadoSondeo: "Convertir en CM",
            Justificacion: this.justificacionSondeo
          }
        } 
      }
      this.servicio.guardarRegSondeo(this.IdSolicitud, ObjSondeo).then(
        (resultado: ItemAddResult) => {
          this.MostrarExitoso("La acción se ha guardado con éxito");
          sessionStorage.removeItem("IdSolicitud");
          setTimeout(() => {
            this.salir();
          }, 1000);         
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      )
    }
  }

  ngOnInit() {
    this.ObtenerUsuarioActual();
  }

  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        this.usuario = new Usuario(Response.Title, Response.email, Response.Id);
        this.ObtenerSolicitudBienesServicios();
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
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
        this.subCategoria = solicitud.Categoria;
        this.comprador = solicitud.Comprador.Title;
        this.CompradorId = solicitud.Comprador.ID;
        this.alcance = solicitud.Alcance;
        this.comentarioSondeo = solicitud.ComentarioSondeo;
        this.justificacion = solicitud.Justificacion;

        if(solicitud.CondicionesContractuales != null){
          this.condicionesContractuales = JSON.parse(solicitud.CondicionesContractuales).condiciones;
        }

        this.servicio.ObtenerCondicionesTecnicasBienes(this.IdSolicitud).subscribe(
          RespuestaCondiciones => {
            this.ObjCondicionesTecnicas = CondicionesTecnicasBienes.fromJsonList(RespuestaCondiciones);
            console.log(this.ObjCondicionesTecnicas);
          }
        )
        this.servicio.ObtenerCondicionesTecnicasServicios(this.IdSolicitud).subscribe(
          RespuestaCondicionesServicios => {
            this.ObjCondicionesTecnicasServicios = CondicionTecnicaServicios.fromJsonList(RespuestaCondicionesServicios);
            console.log(this.ObjCondicionesTecnicasServicios);
          }
        )
        this.servicio.obtenerResponsableProcesos(this.paisId).subscribe(
          (RespuestaProcesos)=>{
              this.ObResProceso = responsableProceso.fromJsonList(RespuestaProcesos);              
          }
        )
      }
    );
  }
}