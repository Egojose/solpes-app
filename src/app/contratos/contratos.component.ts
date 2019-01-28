import { Component, OnInit, ViewChild } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { responsableProceso } from '../dominio/responsableProceso';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { CondicionesTecnicasBienes } from '../verificar-material/condicionTecnicaBienes';
import { verificarMaterialCT } from '../verificar-material/verificarMaterialCT';
import { CondicionTecnicaServicios } from '../verificar-material/condicionTecnicaServicios';
import { resultadoCondicionesTB } from '../dominio/resultadoCondicionesTB';
import { resultadoCondicionesTS } from '../dominio/resultadoCondicionesTS';
import { CondicionContractual } from '../dominio/condicionContractual';


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
  selectedValue: string;
  selectedOption: any;
  ObjUsuarios:[];
  ObjSolicitud: any;
  Pais: any;
  Guardado: boolean
  IdSolicitud: any;
  autor: any;
  loading:boolean;
  idSolicitudParameter: string;
  CompraBienes: any;
  CompraServicios: any;
  paisId: any;
  ObResProceso: responsableProceso[];
  NombreSolicitante: string;
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
    "adjunto"
  ];
  ObjCondicionesTecnicas: CondicionesTecnicasBienes[] = [];
  ObjCTVerificar: any[];
  dataSource;
  title: 'Contratos';
  dataSourceTS;
  panelOpenState = false;
  panelOpenState1 = false;
  panelOpenState2 = false;
  ObjResponsableProceso: any[];
  ObjCondicionesTecnicasServicios: CondicionTecnicaServicios[] = [];
  CTS: boolean;
  CTB: boolean;
  fechaDeseada: any;
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

  constructor(private servicio: SPServicio, private router: Router, public toastr: ToastrManager,private formBuilder: FormBuilder) {
    this.idSolicitudParameter = sessionStorage.getItem("IdSolicitud");
    this.Guardado=false;
   }
   
  ngOnInit() {
    this.loading = true;
    this.ContratosForm = this.formBuilder.group({
      TipoContrato: ['', Validators.required],
      SolpSapRfp: ['', Validators.required],
      ContratoOC: ['', Validators.required],
      OrdenInicio: ['', Validators.required],
      ObjetoContrato: ['', Validators.required],
      // FechaFirmaContrato: [''],
      ContratoObraConexo: ['', Validators.required],
      // FechaEntregaCSCBPO: [''],
      // FechaEnvioProvedor: [''],
      // FechaDevolucionProvedor: [''],
      MonedaContrato: ['', Validators.required],
      // TrmSap: [''],
      IvaContrato: [''],
      ValorContractual: ['', Validators.required],
      // ValorSinIVA: [''],
      // ValorFinalIVA: [''],
      // Referencia: [''],
      LineaBaseContrato: ['', Validators.required],
      AhorroGenerado: ['', Validators.required],
      DescripcionCalculo: ['', Validators.required],
      VigenciaContrato: ['', Validators.required],
      RequiereSST: ['', Validators.required],
      RequierePoliza: ['', Validators.required],
      // FechaEntrgaPoliza: [''],
      // FechaRealEntrgaPoliza: [''],
      // FechaEstadoPoliza: [''],
      // CondicionPoliza: [''],
      Acreedor: ['', Validators.required],
      DigitoVerificacion: ['', Validators.required],
      NombreRazonSocial: ['', Validators.required],
      EmailProveedor: ['', [Validators.required, Validators.email]],
      Solicitante: [, Validators.required],
      Comprador: ['', Validators.required],
      ObervacionesAdicionales: ['', Validators.required]
    });

    this.servicio.ObtenerTodosLosUsuarios().subscribe(
      (Usuarios)=>{
        this.ObjUsuarios = Usuarios;  
        this.servicio.ObtenerSolicitudBienesServicios(this.idSolicitudParameter).subscribe(
          (respuesta)=>{
              this.ObjSolicitud = respuesta;
              this.IdSolicitud = this.ObjSolicitud.Id;
              this.fechaDeseada = this.ObjSolicitud.FechaDeseadaEntrega;
              this.tipoSolicitud = this.ObjSolicitud.TipoSolicitud;
              this.solicitante = this.ObjSolicitud.Solicitante;
              this.ordenadorGasto = this.ObjSolicitud.OrdenadorGastos.Title;
              this.empresa = this.ObjSolicitud.Empresa.Title;
              this.codAriba = this.ObjSolicitud.CodigoAriba;
              this.Pais=this.ObjSolicitud.Pais.Title;
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
              if(this.ObjSolicitud.CondicionesContractuales != null){
                this.condicionesContractuales = JSON.parse(this.ObjSolicitud.CondicionesContractuales).condiciones;
              }
              this.servicio.obtenerResponsableProcesos(this.paisId).subscribe(
                (RespuestaProcesos)=>{
                  
                    this.ObResProceso = responsableProceso.fromJsonList(RespuestaProcesos);              
                }
              )
              this.servicio
          .ObtenerCondicionesTecnicasBienes(this.IdSolicitud)
          .subscribe(RespuestaCondiciones => {                   
            this.ObjCTVerificar = resultadoCondicionesTB.fromJsonList(RespuestaCondiciones);
            if (this.ObjCTVerificar.length>0) {
              this.CTB = true;
            }
            this.dataSource = new MatTableDataSource(this.ObjCTVerificar);
            this.dataSource.paginator = this.paginator;   
            this.servicio
          .ObtenerCondicionesTecnicasServicios(this.IdSolicitud)
          .subscribe(RespuestaCondicionesServicios => {           
            this.ObjCondicionesTecnicasServicios = resultadoCondicionesTS.fromJsonList(RespuestaCondicionesServicios);
            if (this.ObjCondicionesTecnicasServicios.length>0) {
              this.CTS = true;
            }
            this.dataSourceTS = new MatTableDataSource(this.ObjCondicionesTecnicasServicios);
            this.dataSourceTS.paginator = this.paginator;
            this.loading = false;
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
    
    let TipoContrato = this.ContratosForm.controls["TipoContrato"].value;
    let SolpSapRfp = this.ContratosForm.controls["SolpSapRfp"].value;
    let ContratoOC = this.ContratosForm.controls["ContratoOC"].value;
    let OrdenInicio = this.ContratosForm.controls["OrdenInicio"].value; 
    let ObjetoContrato = this.ContratosForm.controls["ObjetoContrato"].value;
    // let FechaFirmaContrato = this.ContratosForm.controls["FechaFirmaContrato"].value;
    let ContratoObraConexo = this.ContratosForm.controls["ContratoObraConexo"].value;
    // let FechaEntregaCSCBPO = this.ContratosForm.controls["FechaEntregaCSCBPO"].value;
    // let FechaEnvioProvedor = this.ContratosForm.controls["FechaEnvioProvedor"].value;
    // let FechaDevolucionProvedor = this.ContratosForm.controls["FechaDevolucionProvedor"].value;
    let MonedaContrato = this.ContratosForm.controls["MonedaContrato"].value;
    // let TrmSap = this.ContratosForm.controls["TrmSap"].value;
    let IvaContrato = this.ContratosForm.controls["IvaContrato"].value;
    let ValorContractual = this.ContratosForm.controls["ValorContractual"].value;
    // let ValorSinIVA = this.ContratosForm.controls["ValorSinIVA"].value;
    // let ValorFinalIVA = this.ContratosForm.controls["ValorFinalIVA"].value;
    // let Referencia = this.ContratosForm.controls["Referencia"].value;
    let LineaBaseContrato = this.ContratosForm.controls["LineaBaseContrato"].value;
    let AhorroGenerado = this.ContratosForm.controls["AhorroGenerado"].value;
    let DescripcionCalculo = this.ContratosForm.controls["DescripcionCalculo"].value;
    let VigenciaContrato = this.ContratosForm.controls["VigenciaContrato"].value;
    let RequiereSST = this.ContratosForm.controls["RequiereSST"].value;
    let RequierePoliza = this.ContratosForm.controls["RequierePoliza"].value;
    // let FechaEntrgaPoliza = this.ContratosForm.controls["FechaEntrgaPoliza"].value;
    //let FechaRealEntrgaPoliza = this.ContratosForm.controls["FechaRealEntrgaPoliza"].value;
    // let FechaEstadoPoliza = this.ContratosForm.controls["FechaEstadoPoliza"].value;
    // let CondicionPoliza = this.ContratosForm.controls["CondicionPoliza"].value;
    let Acreedor = this.ContratosForm.controls["Acreedor"].value;
    let DigitoVerificacion = this.ContratosForm.controls["DigitoVerificacion"].value;
    let NombreRazonSocial = this.ContratosForm.controls["NombreRazonSocial"].value;
    let EmailProveedor = this.ContratosForm.controls["EmailProveedor"].value;
    let Solicitante = this.ContratosForm.controls["Solicitante"].value;
    let Comprador = this.ContratosForm.controls["Comprador"].value;
    let ObervacionesAdicionales = this.ContratosForm.controls["ObervacionesAdicionales"].value; 

    let ObjContrato;
    if (this.Pais==="Colombia") {
      ObjContrato = {
        TipoContrato: TipoContrato,
        NumSolpSAP: SolpSapRfp,
        CM: ContratoOC,
        RequiereNumOrdenInicio: OrdenInicio,
        ObjContrato: ObjetoContrato,
        // FechaFirmaContrato: new Date(FechaFirmaContrato),
        ContratoObra: ContratoObraConexo,
        // FechaEntregaCSC: new Date(FechaEntregaCSCBPO),
        // FechaEnvioProveedor: new Date(FechaEnvioProvedor),
        // FechaDevolucionProveedor: new Date(FechaDevolucionProvedor),
        MonedaContrato: MonedaContrato,
        // TMRSAP: TrmSap,
        IvaContrato: IvaContrato,
        ValorContractual: ValorContractual,
        // ValorFinalSinIva: ValorSinIVA,
        // ValorFinal: ValorFinalIVA,
        // Referencia: Referencia,
        LineaBaseContrato: LineaBaseContrato,
        AhorroGenerado: AhorroGenerado,
        DescripcionCalculoAhorroGenerado: DescripcionCalculo,
        VigenciaContrato: VigenciaContrato,
        RequiereSST: RequiereSST,
        RequierePoliza: RequierePoliza,
        // FechaEntregaPoliza: new Date(FechaEntrgaPoliza),
        // FechaEntregaRealPoliza: new Date(FechaRealEntrgaPoliza),
        // FechaEstadoPoliza: new Date(FechaEstadoPoliza),
        // CondicionPoliza: CondicionPoliza,
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
    else{
      ObjContrato = {
        TipoContrato: TipoContrato,
        NumSolpSAP: SolpSapRfp,
        CM: ContratoOC,
        RequiereNumOrdenInicio: OrdenInicio,
        ObjContrato: ObjetoContrato,
        // FechaFirmaContrato: new Date(FechaFirmaContrato),
        ContratoObra: ContratoObraConexo,
        // FechaEntregaCSC: new Date(FechaEntregaCSCBPO),
        // FechaEnvioProveedor: new Date(FechaEnvioProvedor),
        // FechaDevolucionProveedor: new Date(FechaDevolucionProvedor),
        MonedaContrato: MonedaContrato,
        // TMRSAP: TrmSap,
        IvaContrato: IvaContrato,
        ValorContractual: ValorContractual,
        // ValorFinalSinIva: ValorSinIVA,
        // ValorFinal: ValorFinalIVA,
        LineaBaseContrato: LineaBaseContrato,
        AhorroGenerado: AhorroGenerado,
        DescripcionCalculoAhorroGenerado: DescripcionCalculo,
        RequiereSST: RequiereSST,
        RequierePoliza: RequierePoliza,
        // FechaEntregaPoliza: new Date(FechaEntrgaPoliza),
        // FechaEntregaRealPoliza: new Date(FechaRealEntrgaPoliza),
        // FechaEstadoPoliza: new Date(FechaEstadoPoliza),
        // CondicionPoliza: CondicionPoliza,
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
      (resultado)=>{
        this.Guardado=true;
        let ResponsableServicios=null;
        let ResponsablesBienes=null;
        if (this.CompraServicios) {
            ResponsableServicios=this.autor;
        }
        if (this.CompraBienes) {
          ResponsableServicios=this.ObResProceso[0].porConfirmarEntregaBienes;

        }
        this.servicio.cambioEstadoSolicitud(this.IdSolicitud,"Por recepcionar",this.autor).then(
          (resultado)=>{             
              this.MostrarExitoso("El contrato se ha guardado correctamente");
              setTimeout(() => {
                this.salir();
              }, 1000);
          }
        ).catch(
          (error)=>{
            console.log(error); 
          }
        );
      }      
      ).catch(
      (error)=>{

    });
    
  }

  ValidarIva(){
    let Moneda = this.ContratosForm.controls["MonedaContrato"].value;
    const IvaContrato = this.ContratosForm.get('IvaContrato');
      if (Moneda!="USD") {
        IvaContrato.clearValidators();
      }
      else{
        IvaContrato.setValidators([Validators.required]);
      }
      IvaContrato.updateValueAndValidity();
     
  }

  salir() {
    this.router.navigate(["/mis-pendientes"]);
  }
 
  onSelect(event: any): void {
    console.log("Sfs");
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

  ValidarUsuario(){
    
    let comprador = this.ContratosForm.controls["Comprador"].value;
    if (comprador.length > 0) {
      if (this.selectedOption===undefined) {      
        this.tooltip.show();
        setTimeout(()=>{   
          this.tooltip.hide();
         }, 3000);
      }
      else {
        this.tooltip.hide();
      }
    }    
  } 

  Salir(){
    this.router.navigate(['/mis-solicitudes']);
  }

}
