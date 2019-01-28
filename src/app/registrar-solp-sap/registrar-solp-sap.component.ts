import { Component, OnInit, ViewChild } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { CondicionContractual } from '../dominio/condicionContractual';
import { CondicionesTecnicasBienes } from '../registrar-solp-sap/condicionesTecnicasBienes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CondicionTecnicaServicios } from '../registrar-solp-sap/condicionesTecnicasServicios';
import { ItemAddResult } from 'sp-pnp-js';
import { ActivatedRoute, Router } from '@angular/router';
import { timeout } from 'q';
import { responsableProceso } from '../dominio/responsableProceso';
import { ToastrManager } from 'ng6-toastr-notifications';
import { resultadoCondicionesTB } from '../dominio/resultadoCondicionesTB';
import { resultadoCondicionesTS } from '../dominio/resultadoCondicionesTS';
  import { from } from 'rxjs';
import { MatPaginator, MatTableDataSource } from '@angular/material';
@Component({
  selector: 'app-registrar-solp-sap',
  templateUrl: './registrar-solp-sap.component.html',
  styleUrls: ['./registrar-solp-sap.component.css']
})
export class RegistrarSolpSapComponent implements OnInit {
  @ViewChild('customTooltip') tooltip: any;
  @ViewChild('customTooltip1') tooltip1: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  tipoSolicitud: string;
  codigoAriba: string;
  numOrdenEstadistica: string;
  compradorNombre: string;
  panelOpenState1 = false;
  panelOpenState2 = false;
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
  OrdenEstadistica: boolean;
  ObjCondicionesContractuales: any;
  IdSolicitud: any;
  panelOpenState = false;
  ObjCondicionesTecnicasBienesLectura: CondicionesTecnicasBienes[] = [];
  ObjResultadosondeo: CondicionesTecnicasBienes[] = [];
  ObjCondicionesTecnicas: CondicionesTecnicasBienes[] = [];
  ObjCondicionesTecnicasServiciosLectura: CondicionTecnicaServicios[] = [];
  ObjCondicionesTecnicasServicios: CondicionTecnicaServicios[] = [];
  AgregarElementoForm: FormGroup;
  RDBOrdenadorGastos: any;
  numeroSolpSap: string;
  ComentarioRegistrarSap: string;
  submitted = false;
  IdSolicitudParms: any;
  loading: boolean;
  paisId: any;
  ObResProceso: responsableProceso[]=[];
  Autor: any;
  ObjCTVerificar: any[];
  dataSource;
  dataSourceTS;
  CTS: boolean;
  CTB: boolean;
  displayedColumns: string[] = [
    "codigo",
    "descripcion",
    "modelo",
    "fabricante",    
    "cantidad",
    "valorEstimado",
    "moneda",
    "adjunto"
  ]; 
  displayedColumnsTS: string[] = [
    "codigo",
    "descripcion",        
    "cantidad",
    "valorEstimado",
    "moneda",
    "comentarioSondeo",
    "adjunto",
  ];
  RutaArchivo: string;

 constructor(private servicio: SPServicio, private formBuilder: FormBuilder, public toastr: ToastrManager,private activarRoute: ActivatedRoute, private router: Router) {
  this.IdSolicitudParms = sessionStorage.getItem("IdSolicitud");
    this.loading = false;
 }


  GuardarSolSAP() {
    let ObjSolpSap;

    if (this.RDBOrdenadorGastos === undefined) {
      this.mostrarAdvertencia("Debe seleccionar una acción en ordenador de gastos");
    }
    if (this.RDBOrdenadorGastos !== undefined) {
      if (this.RDBOrdenadorGastos === 1 && this.numeroSolpSap === undefined) {
        this.tooltip.show();
        setTimeout(() => {
          this.tooltip.hide();
        }, 3000);

        return false;
      }
      else if (this.RDBOrdenadorGastos === 1) {
       
        ObjSolpSap = {
          ResponsableId: this.comprador,
          Estado: "Por registrar contratos",
          EstadoRegistrarSAP: "Aprobado",
          NumSolSAP: this.numeroSolpSap
        }
      }
      else if (this.RDBOrdenadorGastos === 2 && this.ComentarioRegistrarSap === undefined) {
        this.tooltip1.show();
        setTimeout(() => {
          this.tooltip1.hide();
        }, 3000);
        // alert('Debe especificar el motivo en comentarios');
        return false;
      }
      else if (this.RDBOrdenadorGastos === 2) {
        ObjSolpSap = {
          ResponsableId: -1,
          Estado: "Finalizado",
          EstadoRegistrarSAP: "Rechazado",
          ComentarioRegistrarSAP: this.ComentarioRegistrarSap
        }
      }
      else if(this.RDBOrdenadorGastos === 3 && this.ComentarioRegistrarSap === undefined) {
        this.mostrarAdvertencia("Por favor ingrese un comentario");
        // alert('Debe especificar el motivo en comentarios');
        return false;
      }
      else if (this.RDBOrdenadorGastos === 3) {
        ObjSolpSap = {
          ResponsableId: this.Autor,
          Estado: "Sin presupuesto",
          EstadoRegistrarSAP: "No tiene presupuesto disponible",
          ComentarioRegistrarSAP: this.ComentarioRegistrarSap
        }
     
      }
        this.servicio.guardarSOLPSAP(this.IdSolicitud, ObjSolpSap).then(
        (resultado: ItemAddResult) => {
          this.MostrarExitoso("Se registro la SOLP con éxito");
          setTimeout(() => {
            this.salir();
          }, 1000);
          
        }
      ).catch(
        (error) => {
          this.mostrarError("Error al registrar la SOLP");
          console.log(error);
        }
      )
    }
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

  mostrarInformacion(mensaje: string) {
    this.toastr.infoToastr(mensaje, 'Información importante');
  }

  mostrarPersonalizado(mensaje: string) {
    this.toastr.customToastr(mensaje, null, { enableHTML: true });
  }


  ngOnInit() {
    this.servicio.ObtenerSolicitudBienesServicios(this.IdSolicitudParms).subscribe(
      solicitud => {
        this.tipoSolicitud = solicitud.TipoSolicitud;
        this.codigoAriba = solicitud.CodigoAriba;
        this.numOrdenEstadistica = solicitud.NumeroOrdenEstadistica;
        this.IdSolicitud = solicitud.Id;
        this.OrdenEstadistica = solicitud.OrdenEstadistica;
        this.fechaDeseada = solicitud.FechaDeseadaEntrega;
        this.solicitante = solicitud.Solicitante;
        this.ordenadorGasto = solicitud.OrdenadorGastos.Title;
        this.empresa = solicitud.Empresa.Title;
        this.pais = solicitud.Pais.Title;
        this.paisId = solicitud.Pais.Id;
        this.categoria = solicitud.Categoria;
        this.subCategoria = solicitud.Categoria;
        this.compradorNombre = solicitud.Comprador.Title;
        this.comprador = solicitud.Comprador.ID;
        this.alcance = solicitud.Alcance;
        this.justificacion = solicitud.Justificacion;
        this.Autor = solicitud.AuthorId;
        if (solicitud.Attachments === true) {
          let ObjArchivos = solicitud.AttachmentFiles.results;
          ObjArchivos.forEach(element => {
            let objSplit = element.FileName.split("-");
            if (objSplit.length > 0) {
              let TipoArchivo = objSplit[0]
              if (TipoArchivo === "RegistroActivo") {
                this.RutaArchivo = element.ServerRelativeUrl;
              }
            }
          });
        }
        this.condicionesContractuales = JSON.parse(solicitud.CondicionesContractuales).condiciones;
        this.servicio.ObtenerCondicionesTecnicasBienes(this.IdSolicitud).subscribe(
          RespuestaCondiciones => {
            
            this.ObjCondicionesTecnicasBienesLectura = CondicionesTecnicasBienes.fromJsonList(RespuestaCondiciones);
            this.ObjCondicionesTecnicas = CondicionesTecnicasBienes.fromJsonList(RespuestaCondiciones);
            this.ObjResultadosondeo = CondicionesTecnicasBienes.fromJsonList(RespuestaCondiciones);
            this.ObjCTVerificar = resultadoCondicionesTB.fromJsonList(RespuestaCondiciones);
            if (this.ObjCTVerificar.length>0) {
              this.CTB = true;
            }
            this.dataSource = new MatTableDataSource(this.ObjCondicionesTecnicas);
            this.dataSource.paginator = this.paginator;
            console.log(this.ObjCondicionesTecnicas);
          }
        )
        this.servicio.ObtenerCondicionesTecnicasServicios(this.IdSolicitud).subscribe(
          RespuestaCondicionesServicios => {
            this.ObjCondicionesTecnicasServiciosLectura = CondicionTecnicaServicios.fromJsonList(RespuestaCondicionesServicios);
            this.ObjCondicionesTecnicasServicios = CondicionTecnicaServicios.fromJsonList(RespuestaCondicionesServicios);
            // if (this.ObjCondicionesTecnicasServicios.length>0) {
            //   this.CTS = true;
            // }
            this.dataSourceTS = new MatTableDataSource(this.ObjCondicionesTecnicasServicios);
            this.dataSourceTS.paginator = this.paginator;
            this.loading = false;

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