import { Component, OnInit } from '@angular/core';
import { Usuario } from '../dominio/usuario';
import { Router } from '@angular/router';
import { SPServicio } from '../servicios/sp-servicio';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailProperties, ItemAddResult } from 'sp-pnp-js';
import { CrmServicioService } from '../servicios/crm-servicio.service';

@Component({
  selector: 'app-gestion-contrato',
  templateUrl: './gestion-contrato.component.html',
  styleUrls: ['./gestion-contrato.component.css']
})
export class GestionContratoComponent implements OnInit {

  contrato: any;
  tipoContrato: string;
  NroSolpSap: string;
  tipoEjecucion: string;
  reqNroOrdenInicio: string;
  reqEvaluacion: any;
  estrategia: string;
  fechaInicioContrato: any
  cantidadProveedores: string;
  cumpleIndicador: any;
  causalIncumplimiento: string;
  ObjetoContrato: string;
  contratoObra: any;
  moneda: string;
  porcentajeIva: string;
  valorContractual: string;
  lineaBase: string;
  ahorroGenerado: string;
  descripCalculoAhorro: string;
  vigencia: string;
  requiereSst: any;
  reqPoliza: any;
  razonSocial: string;
  emailProveedor: string;
  solicitante: string;
  comprador: string;
  observaciones: string;
  aribaSourcing: string;
  causalExcepAriba: string;
  puntajeActual: string;
  idContrato: any;
  bienes: any[] = [];
  servicios: any[] = [];
  idSolicitud: any;
  gestionContrato: FormGroup;
  mostrarCampo: boolean = false;
  mostrarCampoPoliza: boolean = false;
  mostrarFechaPoliza: boolean = false;
  Novalidar: boolean = false;
  idsBienes: any[] = [];
  idsServicios: any[] = [];
  dataTotalIds: any[] = [];
  enviarCrm: boolean;
  token: Object;
  cambiarEstado: boolean;
  solicitantePersona: any;
  
  constructor(public servicio: SPServicio, public router: Router, public spinner: NgxSpinnerService, public toastr: ToastrManager, private fb: FormBuilder, private servicioCrm: CrmServicioService) { }

 async ngOnInit() {
   this.gestionContrato = this.fb.group({
     numeroContrato: ['', Validators.required],
     enviadoFirmas: ['NO'],
     fechaEnvioFirmas: [''],
     poliza: [''],
     fechaPoliza: ['']
    })
    await this.cargarContrato();
    this.ObtenerToken();
  };

 async cargarContrato() {
    this.contrato = await JSON.parse(sessionStorage.getItem('contrato'));
    console.log(this.contrato);
    await this.asignarDatosContrato();
  };

 async asignarDatosContrato() {
    this.tipoContrato = this.contrato.TipoContrato;
    this.NroSolpSap = this.contrato.NumSolpSAP;
    this.tipoEjecucion = this.contrato.TipoEjecucion;
    this.reqNroOrdenInicio = this.contrato.RequiereNumOrdenInicio;
    this.reqEvaluacion = this.contrato.RequiereEvaluacion;
    this.estrategia = this.contrato.EstrategiaAplicada;
    this.cantidadProveedores = this.contrato.CantidadProveedores;
    this.contrato.CumpleIndicadorAtencion === true ? this.cumpleIndicador = 'Sí' : this.cumpleIndicador = 'NO'
    this.causalIncumplimiento = this.contrato.CausalIncumplimiento;
    this.ObjetoContrato = this.contrato.ObjContrato;
    this.contrato.ContratoObra === true ? this.contratoObra = 'Sí' : this.contratoObra = 'No';
    this.moneda = this.contrato.MonedaContrato;
    this.porcentajeIva = this.contrato.IvaContrato;
    this.valorContractual = this.contrato.ValorContractual;
    this.lineaBase = this.contrato.LineaBaseContrato;
    this.ahorroGenerado = this.contrato.AhorroGenerado;
    this.descripCalculoAhorro = this.contrato.DescripcionCalculoAhorroGenerado;
    this.vigencia = this.contrato.VigenciaContrato;
    this.contrato.RequiereSST === true ? this.requiereSst = 'Sí' : this.requiereSst = 'No';
    this.contrato.RequierePoliza === true ? this.reqPoliza = 'Sí' : this.reqPoliza = 'No';
    this.contrato.RequierePoliza === true ? this.mostrarCampoPoliza = true : this.mostrarCampoPoliza = false;
    this.razonSocial = this.contrato.NombreProveedor;
    this.emailProveedor = this.contrato.EmailProveedor;
    this.solicitante = this.contrato.Solicitante;
    this.comprador = this.contrato.Comprador;
    this.observaciones = this.contrato.ObservacionesAdicionales;
    this.aribaSourcing = this.contrato.AribaSourcing;
    this.causalExcepAriba = this.contrato.CausalExcepcion;
    this.puntajeActual = this.contrato.PuntajeActualEvaluacionProveedor;
    this.idContrato = this.contrato.Id;
    this.idSolicitud = this.contrato.SolicitudId;
    this.gestionContrato.controls['numeroContrato'].setValue(this.contrato.CM);
    let envioFirmas;
    let poliza;
    let fechaFirmas;
    let fechaPoliza;
    let fechaEnvioFirmasFormato
    this.contrato.EnviadoFirmas === true ? envioFirmas = 'SÍ' : envioFirmas = 'NO';
    this.contrato.EnviadoFirmas === true ? this.mostrarCampo = true : this.mostrarCampo = false;
    this.contrato.RecepcionPoliza === true ? poliza = 'SÍ' : poliza = 'NO';
    this.contrato.RecepcionPoliza === true ? this.mostrarFechaPoliza = true : this.mostrarFechaPoliza = false;
    this.contrato.FechaEnviadoFirmas !== null ? fechaFirmas = this.formatearFecha(this.contrato.FechaEnviadoFirmas) : fechaFirmas = '';
    this.contrato.FechaRecepcionPoliza !== null ? fechaPoliza = this.formatearFecha(this.contrato.FechaRecepcionPoliza) : fechaPoliza = '';
    this.gestionContrato.controls['enviadoFirmas'].setValue(envioFirmas);
    this.gestionContrato.controls['fechaEnvioFirmas'].setValue(fechaFirmas);
    this.gestionContrato.controls['poliza'].setValue(poliza);
    this.gestionContrato.controls['fechaPoliza'].setValue(fechaPoliza);
    this.consultarBienesXcontrato();
    this.consultarServiciosXcontrato();
    this.consultarSolicitud();
  };

  ObtenerToken() {
    this.servicioCrm.obtenerToken().then(
      (res)=>{        
        this.token = res;
      }
    ).catch(
      (error)=>{
        let objToken = {          
          estado: "false"
        }
        let objTokenString = JSON.stringify(objToken);
        localStorage.setItem("id_token",objTokenString);        
      }
    )
  };

  consultarSolicitud() {
    this.servicio.ConsultarSolicitante(this.idSolicitud).then(
      (respuesta) => {
        this.solicitantePersona = respuesta;
      }
    );
  };

  formatearFecha(fecha) {
    fecha.split('T')
    let fecha2 = new Date(fecha)
    return fecha2
  };

  consultarBienesXcontrato() {
    this.servicio.ConsultarBienesXcontrato(this.idContrato).then(
      (respuesta) => {
        this.bienes = respuesta;
        if(this.bienes.length > 0) {
          this.enviarCrm = true;
        }
        console.log(this.bienes);
      }
    );
  };

  consultarServiciosXcontrato() {
    this.servicio.ConsultarServiciosXcontrato(this.idContrato).then(
      (respuesta) => {
        this.servicios = respuesta;
        if(this.servicios.length > 0) {
          this.enviarCrm = true;
        }
        console.log(this.servicios);
      }
    );
  };

  validarBienesCrm() {
    let numCostoInversion;
    let numCostoInversionString;
    if(this.bienes.length > 0) {
      numCostoInversion = this.bienes.map((x) => {
        return x.numeroCostoInversion
      });
      numCostoInversionString = numCostoInversion.toString();
      this.idsBienes = numCostoInversionString.split(',');
      console.log(this.idsBienes);
    }
    else {
      this.idsBienes = [];
    };
  };

  validarServiciosCrm() {
    let numCostoInversion;
    let numCostoInversionString;
    if(this.servicios.length > 0) {
      numCostoInversion = this.servicios.map((x) => {
        return x.numeroCostoInversion
      });
      numCostoInversionString = numCostoInversion.toString();
      this.idsServicios = numCostoInversionString.split(',');
      console.log(this.idsServicios);
    }
    else {
      this.idsServicios = [];
    };
  };

  mostrarCampoFechaEnvio($event) {
    if($event.target.value === 'SÍ') {
      this.mostrarCampo = true;
    }
    else {
      this.mostrarCampo = false;
      this.gestionContrato.controls['fechaEnvioFirmas'].setValue('');
    };
  };

  mostrarCampoFechaPoliza($event) {
    if($event.target.value === 'SÍ') {
      this.mostrarFechaPoliza = true;
    }
    else {
      this.mostrarFechaPoliza = false;
      this.gestionContrato.controls['fechaPoliza'].setValue('');
    };
  };

  validarNumeroContrato() {
    let max = this.gestionContrato.get('numeroContrato').value;
    let restrict;
    console.log(max);
    if (max.length > 10) {
      restrict = max.slice(0, 10)
      this.gestionContrato.controls['numeroContrato'].setValue(restrict);
      this.mostrarAdvertencia('El numero de contrato sólo admite hasta 10 dígitos');
      return false;
    };
  };

  consultarContratosSinVerificar() {
    this.servicio.ConsultarContratosNoVerificados(this.idSolicitud).then(
      (respuesta) => {
        console.log(respuesta);
        if(respuesta.length === 0) {
          this.cambiarEstado = true;
          let notificacion = {
            IdSolicitud: this.idSolicitud.toString(),
            ResponsableId: this.solicitantePersona.Id,
            Estado: 'Por recepcionar'
          }
          let obj = {
            Estado: 'Por recepcionar',
            ResponsableId: this.solicitantePersona.Id
          }
          this.servicio.ActualizarEstadoSolicitud(this.idSolicitud, obj);
          this.MostrarExitoso('Se cambió el estado de la solicitud a Por recepcionar');
          this.agregarNotificacion(notificacion);
        }
      }
    );
  };

  validarDatosGuardadoParcial() {
    if(this.gestionContrato.get('numeroContrato').value === '' || this.gestionContrato.get('numeroContrato').value === null || this.gestionContrato.get('numeroContrato').value === undefined) {
      return false;
    };
  };

  cancelar() {
    this.router.navigate(['/Verificar-firmar-contrato']);
  };

  guardadoParcial() {
    this.spinner.show();
    this.validarDatosGuardadoParcial();
    if (this.validarDatosGuardadoParcial() !== false) {
      let numeroContrato = this.gestionContrato.get('numeroContrato').value;
      let enviadoFirmas;
      this.gestionContrato.get('enviadoFirmas').value === 'SÍ' ? enviadoFirmas = true : enviadoFirmas = false;
      let fechaEnvioFirmas; 
      this.gestionContrato.get('fechaEnvioFirmas').value !== '' ? fechaEnvioFirmas = this.gestionContrato.get('fechaEnvioFirmas').value : fechaEnvioFirmas = null;
      let poliza;
      this.gestionContrato.get('poliza').value === 'SÍ' ? poliza = true : poliza = false;
      let fechaPoliza; 
      this.gestionContrato.get('fechaPoliza').value !== '' ? fechaPoliza = this.gestionContrato.get('fechaPoliza').value : fechaPoliza = null;
      let obj = {
        CM: numeroContrato,
        EnviadoFirmas: enviadoFirmas,
        FechaEnviadoFirmas: fechaEnvioFirmas,
        RecepcionPoliza: poliza,
        FechaRecepcionPoliza: fechaPoliza
      }
      this.servicio.ActualizarContrato(this.idContrato, obj).then(
        (respuesta) => {
          this.MostrarExitoso('La información se guardó correctamente');
          this.router.navigate(['/Verificar-firmar-contrato']);
          this.spinner.hide();
        }
      ).catch(
        (err)=> {
          console.error(err);
          this.mostrarError('No se pudo guardar la información');
          this.spinner.hide();
        }
      );
    }
    else {
      this.mostrarAdvertencia('El campo Número de contrato/Orden de compra es requerido para el guardado parcial');
      this.spinner.hide();
    };
  };

 async validarDatosVerificarYfirmar() {
    if(this.gestionContrato.get('numeroContrato').value === '') {
      this.mostrarAdvertencia('El campo Número de contrato/Orden de compra es requerido')
      this.Novalidar = true;
      return false;
    }
    else if(this.gestionContrato.get('enviadoFirmas').value === '' || this.gestionContrato.get('enviadoFirmas').value === null || this.gestionContrato.get('enviadoFirmas').value === 'NO') {
      this.mostrarAdvertencia('el campo Enviado a firmas es requerido');
      this.Novalidar = true;
      return false;
    }
    else if(this.gestionContrato.get('enviadoFirmas').value === 'SÍ' && (this.gestionContrato.get('fechaEnvioFirmas').value === '' || this.gestionContrato.get('fechaEnvioFirmas').value === null)) {
      this.mostrarAdvertencia('El campo Fecha de envío a firmas es requerido si ya se envió a firmas');
      this.Novalidar = true;
      return false;
    }
    else if(this.contrato.RequierePoliza === true && (this.gestionContrato.get('poliza').value === '' || this.gestionContrato.get('poliza').value === null || this.gestionContrato.get('poliza').value === 'NO')) {
      this.mostrarAdvertencia('El campo Póliza recibida es requerido si el contrato requiere póliza')
      this.Novalidar = true;
      return false;
    }
    else if(this.gestionContrato.get('poliza').value === 'SÍ' && (this.gestionContrato.controls['fechaPoliza'].value === '' || this.gestionContrato.controls['fechaPoliza'].value === null)) {
      this.mostrarAdvertencia('El campo Fecha de recepción de la póliza es requerido si la póliza ya se recibió');
      this.Novalidar = true;
      return false;
    }
    else {
      this.Novalidar = false;
    }
  };

  async validarSiEnviarCrm() {
    let a = await this.validarBienesCrm();
    let b = await this.validarServiciosCrm();
    if(this.enviarCrm === true) {
      let totalIds = this.idsBienes.concat(this.idsServicios);
      this.dataTotalIds = totalIds.sort().filter((x, y)=> {
        return totalIds.indexOf(x) === y;
      })
    };  
  };

  verificarYfirmar() {
    this.validarDatosVerificarYfirmar();
    this.validarSiEnviarCrm();
    if (this.Novalidar) {
      this.mostrarAdvertencia('Por favor dilegencie los campos que son requeridos')
    }
    else {
      let fechaInicio = this.contrato.FechaDeCreacion;
      let fechaInicioString = this.formatDate(fechaInicio);
      let VigenciaContrato = this.contrato.VigenciaContrato;
      let nombreProveedor = this.contrato.NombreProveedor
      let objetocontrato = this.contrato.ObjContrato
      let numeroContrato = this.gestionContrato.get('numeroContrato').value;
      let enviadoFirmas;
      this.gestionContrato.get('enviadoFirmas').value === 'SÍ' ? enviadoFirmas = true : enviadoFirmas = false;
      let fechaEnvioFirmas;
      this.gestionContrato.get('fechaEnvioFirmas').value !== '' ? fechaEnvioFirmas = this.gestionContrato.get('fechaEnvioFirmas').value : fechaEnvioFirmas = null;
      let poliza;
      this.gestionContrato.get('poliza').value === 'SÍ' ? poliza = true : poliza = false;
      let fechaPoliza;
      this.gestionContrato.get('fechaPoliza').value !== '' ? fechaPoliza = this.gestionContrato.get('fechaPoliza').value : fechaPoliza = null;
      let obj = {
        CM: numeroContrato,
        EnviadoFirmas: enviadoFirmas,
        FechaEnviadoFirmas: fechaEnvioFirmas,
        RecepcionPoliza: poliza,
        FechaRecepcionPoliza: fechaPoliza,
        Verificado: true
      }
      console.log(obj);
      this.servicio.ActualizarContrato(this.idContrato, obj).then(
        (respuesta: ItemAddResult) => {
          this.consultarContratosSinVerificar();
          if (this.enviarCrm === true) {
            let objCrm = {
              "numerocontratoproveedor": numeroContrato,
              "numerosolp": `${this.idSolicitud}`,
              "fechainiciocontrato": fechaInicioString,
              "duracioncontrato": parseInt(VigenciaContrato),
              "nombreproveedor": nombreProveedor,
              "objetocontrato": objetocontrato,
              "idservicios": this.dataTotalIds
            }
            this.enviarServicioContratos(objCrm).then(
              (respuesta) => {
                if (respuesta.StatusCode === 200) {
                  this.MostrarExitoso('Se envió a crm');
                }
                else {
                  let obj = {
                    NroContrato: numeroContrato,
                    NroSolp: `${this.idSolicitud}`,
                    FechaInicio: fechaInicioString,
                    Duracion: VigenciaContrato,
                    NombreProveedor: nombreProveedor,
                    ObjetoContrato: objetocontrato,
                    IdServicios: this.dataTotalIds.toString(),
                    EsContrato: true,
                    Exitoso: false
                  }
                  this.GuardarErrorSolicitudCrm(obj)
                  this.mostrarError('No se pudo enviar. StatusCode !== 200');
                }
              }
            ).catch(
              (err) => {
                console.error(err);
                this.mostrarError('No se pudo enviar a crm');
              }
            );
          };
          this.MostrarExitoso('La información se guardó correctamente');
          setTimeout(() => {
            this.router.navigate(['/Verificar-firmar-contrato']);
          }, 3000);
          this.router.navigate(['/Verificar-firmar-contrato']);
          this.spinner.hide();
        }
      ).catch(
        (err) => {
          console.error(err);
          this.mostrarError('No se pudo guardar la información');
          this.spinner.hide();
        }
      );
    };
  };

  async enviarServicioContratos(obj): Promise<any> {
    let respuesta;
    let objToken = {
      TipoConsulta: "crm",
      suscriptionKey: "c3d10e5bd16e48d3bd936bb9460bddef",
      token: this.token,
      estado: "true"
    }
    let objTokenString = JSON.stringify(objToken);
    localStorage.setItem("id_token", objTokenString);
    await this.servicioCrm.ActualizarContratos(obj).then(
      (res) => {
        respuesta = res;
      }
    ).catch(
      (error) => {
        respuesta = error.error;
      }
    );
    return respuesta;
  };

  async GuardarErrorSolicitudCrm(ObjSolicitudCrm): Promise<any> {
    let respuesta;
    await this.servicio.GuardarSolicitudCrm(ObjSolicitudCrm).then(
      (res) => {
        respuesta = true;
      }
    ).catch(
      (error) => {
        respuesta = false;
      }
    );
    return respuesta;
  };

  async agregarNotificacion(notificacion): Promise<any>{
    let respuesta;
    await this.servicio.agregarNotificacion(notificacion).then(
      (res)=>{
        respuesta = true;
      }
    ).catch(
      (error)=>{
        respuesta = false;
        console.log(error);
        this.mostrarError('Error agregando la notificación');
        this.spinner.hide();
      }
    );
    return respuesta;
  };

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [month, day, year].join('/');
  };

  MostrarExitoso(mensaje: string) {
    this.toastr.successToastr(mensaje, 'Confirmación!');
  };

  mostrarError(mensaje: string) {
    this.toastr.errorToastr(mensaje, 'Oops!');
  };

  mostrarAdvertencia(mensaje: string) {
    this.toastr.warningToastr(mensaje, 'Validación');
  };

};
