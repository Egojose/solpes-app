import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { responsableProceso } from '../dominio/responsableProceso';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { CondicionesTecnicasBienes } from '../verificar-material/condicionTecnicaBienes';
import { CondicionTecnicaServicios } from '../verificar-material/condicionTecnicaServicios';
import { resultadoCondicionesTB } from '../dominio/resultadoCondicionesTB';
import { resultadoCondicionesTS } from '../dominio/resultadoCondicionesTS';
import { CondicionContractual } from '../dominio/condicionContractual';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemAddResult } from 'sp-pnp-js';
import { Solicitud } from '../dominio/solicitud';
import { Usuario } from '../dominio/usuario';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.css']
})
export class ContratosComponent implements OnInit {
  @ViewChild('customTooltip') tooltip: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ContratosForm: FormGroup;
  submitted = false;
  content: string;
  contratoMarco: string;
  selectedValue: string;
  selectedOption: any;
  ObjUsuarios: [];
  ObjSolicitud: any;
  Pais: any;
  Guardado: boolean
  IdSolicitud: any;
  autor: any;
  loading: boolean;
  idSolicitudParameter: number;
  CompraBienes: any;
  CompraServicios: any;
  paisId: any;
  ObResProceso: responsableProceso[];
  NombreSolicitante: string;
  displayedColumns: string[] = ["codigo", "descripcion", "modelo", "fabricante", "cantidad", "valorEstimado", "moneda", "adjunto"];
  displayedColumnsTS: string[] = ["codigo", "descripcion", "cantidad", "valorEstimado", "moneda", "adjunto"];
  ObjCondicionesTecnicas: CondicionesTecnicasBienes[] = [];
  dataSource;
  dataSourceTS;
  panelOpenState = false;
  panelOpenState1 = false;
  panelOpenState2 = false;
  ObjResponsableProceso: any[];
  ObjCondicionesTecnicasServicios: CondicionTecnicaServicios[] = [];
  CTS: boolean;
  CTB: boolean;
  fechaDeseada: any;
  modalRef: BsModalRef;
  tipoSolicitud: any;
  solicitante: any;
  ordenadorGasto: any;
  empresa: any;
  codAriba: any;
  categoria: any;
  subCategoria: any;
  comprador: any;
  alcance: any;
  justificacion: any;
  ComentarioSondeo: any;
  condicionesContractuales: CondicionContractual[] = [];
  OrdenEstadistica: any;
  numOrdenEstadistica: any;
  NumSolSAP: any;
  solicitudRecuperada: Solicitud;
  usuarioActual: Usuario;
  perfilacion: boolean;
  fueSondeo: boolean;
  existeCondicionesTecnicasBienes: boolean;
  existeCondicionesTecnicasServicios: boolean;

  constructor(private servicio: SPServicio, private modalServicio: BsModalService, private router: Router, public toastr: ToastrManager, private formBuilder: FormBuilder, private spinner: NgxSpinnerService) {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
    this.solicitudRecuperada = JSON.parse(sessionStorage.getItem('solicitud'));
    console.log(this.solicitudRecuperada);
    this.perfilacionEstado();  
    this.idSolicitudParameter = this.solicitudRecuperada.id;
    this.existeCondicionesTecnicasBienes = false;
    this.existeCondicionesTecnicasServicios = false;
    this.Guardado = false;
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
          this.fueSondeo = this.solicitudRecuperada.FueSondeo;
        }
        else {
          this.mostrarAdvertencia("Usted no está autorizado para esta acción: No es el responsable");
          this.router.navigate(['/mis-solicitudes']);
        }
      }
      else {
        this.mostrarAdvertencia("La solicitud no se encuentra en el estado correcto para registrar contratos");
        this.router.navigate(['/mis-solicitudes']);
      }
    }
  }

  verificarEstado(): boolean {
    if(this.solicitudRecuperada.estado == 'Por registrar contratos'){
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

  comfirmasalir(template: TemplateRef<any>) {
    this.modalRef = this.modalServicio.show(template, { class: 'modal-lg' });
  }

  declinarModal() {
    this.modalRef.hide();
  }

  ngOnInit() {
    this.spinner.show();
    this.ContratosForm = this.formBuilder.group({
      TipoContrato: ['', Validators.required],
      SolpSapRfp: ['', Validators.required],
      ContratoOC: ['', Validators.required],
      OrdenInicio: ['', Validators.required],
      ObjetoContrato: ['', Validators.required],
      ContratoObraConexo: [false],
      MonedaContrato: ['', Validators.required],
      IvaContrato: ['', Validators.required],
      ValorContractual: ['', Validators.required],
      LineaBaseContrato: ['', Validators.required],
      AhorroGenerado: ['', Validators.required],
      DescripcionCalculo: ['', Validators.required],
      VigenciaContrato: [''],
      RequiereSST: ['', Validators.required],
      RequierePoliza: ['', Validators.required],
      Acreedor: [''],
      DigitoVerificacion: [''],
      NombreRazonSocial: ['', Validators.required],
      EmailProveedor: ['', [Validators.required, Validators.email]],
      Solicitante: [, Validators.required],
      Comprador: ['', Validators.required],
      ObervacionesAdicionales: ['', Validators.required]
    });

    this.servicio.ObtenerTodosLosUsuarios().subscribe(
      (Usuarios) => {
        this.ObjUsuarios = Usuarios;
        this.servicio.ObtenerSolicitudBienesServicios(this.idSolicitudParameter).subscribe(
          (respuesta) => {
            this.ObjSolicitud = respuesta;
            this.IdSolicitud = this.ObjSolicitud.Id;
            this.fechaDeseada = this.ObjSolicitud.FechaDeseadaEntrega;
            this.tipoSolicitud = this.ObjSolicitud.TipoSolicitud;
            this.contratoMarco = this.ObjSolicitud.CM;
            this.solicitante = this.ObjSolicitud.Solicitante;
            this.ordenadorGasto = this.ObjSolicitud.OrdenadorGastos.Title;
            this.empresa = this.ObjSolicitud.Empresa.Title;
            this.codAriba = this.ObjSolicitud.CodigoAriba;
            this.Pais = this.ObjSolicitud.Pais.Title;
            this.paisId = this.ObjSolicitud.Pais.Id;
            this.categoria = this.ObjSolicitud.Categoria;
            this.subCategoria = this.ObjSolicitud.Subcategoria;
            this.comprador = this.ObjSolicitud.Comprador.Title;
            this.alcance = this.ObjSolicitud.Alcance;
            this.justificacion = this.ObjSolicitud.Justificacion;
            this.ComentarioSondeo = this.ObjSolicitud.ComentarioSondeo;
            this.autor = this.ObjSolicitud.AuthorId;
            this.NumSolSAP = this.ObjSolicitud.NumSolSAP;
            this.NombreSolicitante = this.ObjSolicitud.Author.Title;
            this.ContratosForm.controls["Solicitante"].setValue(this.NombreSolicitante);
            this.CompraBienes = this.ObjSolicitud.CompraBienes;
            this.CompraServicios = this.ObjSolicitud.CompraServicios;
            this.OrdenEstadistica = this.ObjSolicitud.OrdenEstadistica;
            this.numOrdenEstadistica = this.ObjSolicitud.NumeroOrdenEstadistica;

            if (this.ObjSolicitud.CondicionesContractuales != null) {
              this.condicionesContractuales = JSON.parse(this.ObjSolicitud.CondicionesContractuales).condiciones;
            }

            this.servicio.obtenerResponsableProcesos(this.paisId).subscribe(
              (RespuestaProcesos) => {
                this.ObResProceso = responsableProceso.fromJsonList(RespuestaProcesos);
                this.spinner.hide();
              }
            )

            this.servicio.ObtenerCondicionesTecnicasBienes(this.IdSolicitud).subscribe(RespuestaCondiciones => {
              this.ObjCondicionesTecnicas = resultadoCondicionesTB.fromJsonList(RespuestaCondiciones);
              if (this.ObjCondicionesTecnicas.length > 0) {
                this.existeCondicionesTecnicasBienes = true;
                this.CTB = true;
              }
              this.dataSource = new MatTableDataSource(this.ObjCondicionesTecnicas);
              this.dataSource.paginator = this.paginator;
              this.servicio.ObtenerCondicionesTecnicasServicios(this.IdSolicitud).subscribe(RespuestaCondicionesServicios => {
                this.ObjCondicionesTecnicasServicios = resultadoCondicionesTS.fromJsonList(RespuestaCondicionesServicios);
                if (this.ObjCondicionesTecnicasServicios.length > 0) {
                  this.existeCondicionesTecnicasServicios = true;
                  this.CTS = true;
                }
                this.dataSourceTS = new MatTableDataSource(this.ObjCondicionesTecnicasServicios);
                this.dataSourceTS.paginator = this.paginator;
                this.spinner.hide();
              });
            });
          }
        )
      }
    )
  }

  get f() { return this.ContratosForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.ContratosForm.invalid) {
      return;
    }
    this.spinner.show();
    let fechaContrato = new Date();
    let TipoContrato = this.ContratosForm.controls["TipoContrato"].value;
    let SolpSapRfp = this.ContratosForm.controls["SolpSapRfp"].value;
    let ContratoOC = this.ContratosForm.controls["ContratoOC"].value;
    let OrdenInicio = this.ContratosForm.controls["OrdenInicio"].value;
    let ObjetoContrato = this.ContratosForm.controls["ObjetoContrato"].value;
    let ContratoObraConexo = this.ContratosForm.controls["ContratoObraConexo"].value;
    let MonedaContrato = this.ContratosForm.controls["MonedaContrato"].value;
    let IvaContrato = this.ContratosForm.controls["IvaContrato"].value.toString();
    let ValorContractual = this.ContratosForm.controls["ValorContractual"].value.toString();
    let LineaBaseContrato = this.ContratosForm.controls["LineaBaseContrato"].value.toString();
    let AhorroGenerado = this.ContratosForm.controls["AhorroGenerado"].value.toString();
    let DescripcionCalculo = this.ContratosForm.controls["DescripcionCalculo"].value;
    let VigenciaContrato = this.ContratosForm.controls["VigenciaContrato"].value;
    let RequiereSST = this.ContratosForm.controls["RequiereSST"].value;
    let RequierePoliza = this.ContratosForm.controls["RequierePoliza"].value;
    let Acreedor = this.ContratosForm.controls["Acreedor"].value;
    let DigitoVerificacion = this.ContratosForm.controls["DigitoVerificacion"].value;
    let NombreRazonSocial = this.ContratosForm.controls["NombreRazonSocial"].value;
    let EmailProveedor = this.ContratosForm.controls["EmailProveedor"].value;
    let Solicitante = this.ContratosForm.controls["Solicitante"].value;
    let Comprador = this.ContratosForm.controls["Comprador"].value;
    let ObervacionesAdicionales = this.ContratosForm.controls["ObervacionesAdicionales"].value;
    let ObjContrato;

    if (this.Pais === "Colombia") {
      ObjContrato = {
        TipoContrato: TipoContrato,
        NumSolpSAP: SolpSapRfp,
        CM: ContratoOC,
        RequiereNumOrdenInicio: OrdenInicio,
        ObjContrato: ObjetoContrato,
        ContratoObra: ContratoObraConexo,
        MonedaContrato: MonedaContrato,
        IvaContrato: IvaContrato,
        ValorContractual: ValorContractual,
        LineaBaseContrato: LineaBaseContrato,
        AhorroGenerado: AhorroGenerado,
        DescripcionCalculoAhorroGenerado: DescripcionCalculo,
        VigenciaContrato: VigenciaContrato,
        RequiereSST: RequiereSST,
        RequierePoliza: RequierePoliza,
        Acreedor: Acreedor,
        DigitoVerificacion: DigitoVerificacion,
        NombreProveedor: NombreRazonSocial,
        EmailProveedor: EmailProveedor,
        Solicitante: Solicitante,
        Comprador: Comprador,
        ObservacionesAdicionales: ObervacionesAdicionales,
        SolicitudId: this.idSolicitudParameter
      }
    } else {
      ObjContrato = {
        TipoContrato: TipoContrato,
        NumSolpSAP: SolpSapRfp,
        CM: ContratoOC,
        RequiereNumOrdenInicio: OrdenInicio,
        ObjContrato: ObjetoContrato,
        ContratoObra: ContratoObraConexo,
        MonedaContrato: MonedaContrato,
        IvaContrato: IvaContrato,
        ValorContractual: ValorContractual,
        LineaBaseContrato: LineaBaseContrato,
        AhorroGenerado: AhorroGenerado,
        DescripcionCalculoAhorroGenerado: DescripcionCalculo,
        RequiereSST: RequiereSST,
        RequierePoliza: RequierePoliza,
        Acreedor: Acreedor,
        DigitoVerificacion: DigitoVerificacion,
        NombreProveedor: NombreRazonSocial,
        EmailProveedor: EmailProveedor,
        Solicitante: Solicitante,
        Comprador: Comprador,
        ObservacionesAdicionales: ObervacionesAdicionales,
        SolicitudId: this.idSolicitudParameter
      }
    }

    this.servicio.GuardarContrato(ObjContrato).then(
      (resultado) => {
        this.Guardado = true;
        this.servicio.cambioEstadoSolicitud(this.IdSolicitud, "Por recepcionar", this.autor).then(
          (resultado) => {
            let notificacion = {
              IdSolicitud: this.IdSolicitud.toString(),
              ResponsableId: this.autor,
              Estado: 'Por recepcionar',
              
            };
            this.servicio.agregarNotificacion(notificacion).then(
              (item: ItemAddResult) => {
                this.MostrarExitoso("El contrato se ha guardado correctamente");
                this.spinner.hide();
                setTimeout(() => {
                  this.router.navigate(["/mis-pendientes"]);
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
        );
      }
    ).catch(
      (error) => {
        console.log(error);
        this.spinner.hide();
      });
  }

  ValidarIva() {
    let Moneda = this.ContratosForm.controls["MonedaContrato"].value;
    const IvaContrato = this.ContratosForm.get('IvaContrato');
   
    IvaContrato.setValidators([Validators.required]);
    
    IvaContrato.updateValueAndValidity();
  }

  salir() {
    this.modalRef.hide();
    this.router.navigate(["/mis-pendientes"]);
  }
  onSelect(event: any): void {
    this.selectedOption = event.item;
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

  ValidarUsuario() {
    let comprador = this.ContratosForm.controls["Comprador"].value;
    if (comprador.length > 0) {
      if (this.selectedOption === undefined) {
        this.tooltip.show();
        setTimeout(() => {
          this.tooltip.hide();
        }, 3000);
      } else {
        this.tooltip.hide();
      }
    }
  }

  Salir() {
    this.router.navigate(['/mis-solicitudes']);
  }

}
