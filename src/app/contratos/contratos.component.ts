import { Component, OnInit, ViewChild } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.css']
})
export class ContratosComponent implements OnInit {
  @ViewChild('customTooltip') tooltip: any;
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
  constructor(private servicio: SPServicio, private router: Router, private formBuilder: FormBuilder) {
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
      FechaFirmaContrato: [''],
      ContratoObraConexo: ['', Validators.required],
      FechaEntregaCSCBPO: [''],
      FechaEnvioProvedor: [''],
      FechaDevolucionProvedor: [''],
      MonedaContrato: ['', Validators.required],
      TrmSap: [''],
      IvaContrato: ['', Validators.required],
      ValorContractual: ['', Validators.required],
      ValorSinIVA: [''],
      ValorFinalIVA: [''],
      Referencia: [''],
      LineaBaseContrato: ['', Validators.required],
      AhorroGenerado: ['', Validators.required],
      DescripcionCalculo: ['', Validators.required],
      VigenciaContrato: ['', Validators.required],
      RequiereSST: ['', Validators.required],
      RequierePoliza: ['', Validators.required],
      FechaEntrgaPoliza: [''],
      FechaRealEntrgaPoliza: [''],
      FechaEstadoPoliza: [''],
      CondicionPoliza: [''],
      Acreedor: ['', Validators.required],
      DigitoVerificacion: ['', Validators.required],
      NombreRazonSocial: ['', Validators.required],
      EmailProveedor: ['', [Validators.required, Validators.email]],
      Solicitante: ['', Validators.required],
      Comprador: ['', Validators.required],
      ObervacionesAdicionales: ['', Validators.required]
    });

    this.servicio.ObtenerTodosLosUsuarios().subscribe(
      (Usuarios)=>{
        this.ObjUsuarios = Usuarios;  
        this.servicio.ObtenerSolicitudBienesServicios(this.idSolicitudParameter).subscribe(
          (respuesta)=>{
            this.ObjSolicitud = respuesta;
            this.Pais=this.ObjSolicitud.Pais.Title;
            this.IdSolicitud = this.ObjSolicitud.Id;
            this.autor = this.ObjSolicitud.AuthorId;
            this.loading=false;
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
    let FechaFirmaContrato = this.ContratosForm.controls["FechaFirmaContrato"].value;
    let ContratoObraConexo = this.ContratosForm.controls["ContratoObraConexo"].value;
    let FechaEntregaCSCBPO = this.ContratosForm.controls["FechaEntregaCSCBPO"].value;
    let FechaEnvioProvedor = this.ContratosForm.controls["FechaEnvioProvedor"].value;
    let FechaDevolucionProvedor = this.ContratosForm.controls["FechaDevolucionProvedor"].value;
    let MonedaContrato = this.ContratosForm.controls["MonedaContrato"].value;
    let TrmSap = this.ContratosForm.controls["TrmSap"].value;
    let IvaContrato = this.ContratosForm.controls["IvaContrato"].value;
    let ValorContractual = this.ContratosForm.controls["ValorContractual"].value;
    let ValorSinIVA = this.ContratosForm.controls["ValorSinIVA"].value;
    let ValorFinalIVA = this.ContratosForm.controls["ValorFinalIVA"].value;
    let Referencia = this.ContratosForm.controls["Referencia"].value;
    let LineaBaseContrato = this.ContratosForm.controls["LineaBaseContrato"].value;
    let AhorroGenerado = this.ContratosForm.controls["AhorroGenerado"].value;
    let DescripcionCalculo = this.ContratosForm.controls["DescripcionCalculo"].value;
    let VigenciaContrato = this.ContratosForm.controls["VigenciaContrato"].value;
    let RequiereSST = this.ContratosForm.controls["RequiereSST"].value;
    let RequierePoliza = this.ContratosForm.controls["RequierePoliza"].value;
    let FechaEntrgaPoliza = this.ContratosForm.controls["FechaEntrgaPoliza"].value;
    let FechaRealEntrgaPoliza = this.ContratosForm.controls["FechaRealEntrgaPoliza"].value;
    let FechaEstadoPoliza = this.ContratosForm.controls["FechaEstadoPoliza"].value;
    let CondicionPoliza = this.ContratosForm.controls["CondicionPoliza"].value;
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
        FechaFirmaContrato: new Date(FechaFirmaContrato),
        ContratoObra: ContratoObraConexo,
        FechaEntregaCSC: new Date(FechaEntregaCSCBPO),
        FechaEnvioProveedor: new Date(FechaEnvioProvedor),
        FechaDevolucionProveedor: new Date(FechaDevolucionProvedor),
        MonedaContrato: MonedaContrato,
        TMRSAP: TrmSap,
        IvaContrato: IvaContrato,
        ValorContractual: ValorContractual,
        ValorFinalSinIva: ValorSinIVA,
        ValorFinal: ValorFinalIVA,
        Referencia: Referencia,
        LineaBaseContrato: LineaBaseContrato,
        AhorroGenerado: AhorroGenerado,
        DescripcionCalculoAhorroGenerado: DescripcionCalculo,
        VigenciaContrato: VigenciaContrato,
        RequiereSST: RequiereSST,
        RequierePoliza: RequierePoliza,
        FechaEntregaPoliza: new Date(FechaEntrgaPoliza),
        FechaEntregaRealPoliza: new Date(FechaRealEntrgaPoliza),
        FechaEstadoPoliza: new Date(FechaEstadoPoliza),
        CondicionPoliza: CondicionPoliza,
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
        FechaFirmaContrato: new Date(FechaFirmaContrato),
        ContratoObra: ContratoObraConexo,
        FechaEntregaCSC: new Date(FechaEntregaCSCBPO),
        FechaEnvioProveedor: new Date(FechaEnvioProvedor),
        FechaDevolucionProveedor: new Date(FechaDevolucionProvedor),
        MonedaContrato: MonedaContrato,
        TMRSAP: TrmSap,
        IvaContrato: IvaContrato,
        ValorContractual: ValorContractual,
        ValorFinalSinIva: ValorSinIVA,
        ValorFinal: ValorFinalIVA,
        LineaBaseContrato: LineaBaseContrato,
        AhorroGenerado: AhorroGenerado,
        DescripcionCalculoAhorroGenerado: DescripcionCalculo,
        RequiereSST: RequiereSST,
        RequierePoliza: RequierePoliza,
        FechaEntregaPoliza: new Date(FechaEntrgaPoliza),
        FechaEntregaRealPoliza: new Date(FechaRealEntrgaPoliza),
        FechaEstadoPoliza: new Date(FechaEstadoPoliza),
        CondicionPoliza: CondicionPoliza,
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
        this.servicio.cambioEstadoSolicitud(this.IdSolicitud,"PorRegistrarEntregas",this.autor).then(
          (resultado)=>{
              
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
 
  onSelect(event: any): void {
    console.log("Sfs");
    this.selectedOption = event.item;
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
