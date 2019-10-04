import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { responsableProceso } from '../dominio/responsableProceso';
import { MatPaginator, MatTableDataSource, MatCheckboxModule} from '@angular/material';
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
import { CausalExcepcion } from '../dominio/causalExcepcion';
import { Compardor } from '../dominio/compardor';

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
  listaCompradores: Compardor[] = [];
  ObResProceso: responsableProceso[];
  NombreSolicitante: string;
  displayedColumns: string[] = ["seleccionar","codigo", "descripcion", "modelo", "fabricante", "cantidad", "valorEstimado", "moneda", "adjunto"];
  displayedColumnsTS: string[] = ["seleccionar","codigo", "descripcion", "cantidad", "valorEstimado", "moneda", "adjunto"];
  ObjCondicionesTecnicas: resultadoCondicionesTB[] = [];
  dataSource;
  dataSourceTS;
  panelOpenState = false;
  panelOpenState1 = false;
  panelOpenState2 = false;
  ObjResponsableProceso: any[];
  ObjCondicionesTecnicasServicios: resultadoCondicionesTS[] = [];
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
  adjunto: any; 
  BienesSeleccionados: any[]=[];
  ServiciosSeleccionados: any[]=[];
  CantidadBienesServicios: number = 0;
  CantidadBienesServiciosConContrato: number = 0;
  todosBienes: any;
  todosServicios: boolean;
  causalExcepcion: CausalExcepcion[] = [];
  causa: any;
  ariba: any;
  causalexeption: any;
  valorAriba: boolean = false;
  mostrarPuntaje: boolean = false;
 
  constructor(private servicio: SPServicio, private modalServicio: BsModalService, private router: Router, public toastr: ToastrManager, private formBuilder: FormBuilder, private spinner: NgxSpinnerService) {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
    this.solicitudRecuperada = JSON.parse(sessionStorage.getItem('solicitud'));
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
  
    obtenerCausas() { this.servicio.obtenerCausalExcepcion().subscribe(
      (respuesta) => {
        this.causalExcepcion = CausalExcepcion.fromJsonList(respuesta);
      }
    );
      }     

  verificarEstado(): boolean {
    if (this.solicitudRecuperada.estado == 'Por registrar contratos') {
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

  comfirmasalir(template: TemplateRef<any>) {
    this.modalRef = this.modalServicio.show(template, { class: 'modal-lg' });
  }

  declinarModal() {
    this.modalRef.hide();
  }

  leerAribaValue() {
    if(this.ContratosForm.controls.ariba.value === 'N/A') {
      this.valorAriba = true;
    }
    else {
      this.valorAriba = false;
      this.ContratosForm.controls.causa.value === ""
    }
  }

  Puntaje() {
    if(this.ContratosForm.controls['puntaje'].value === 'Agregar un puntaje') {
      this.mostrarPuntaje = true;
    }
    else {
      this.mostrarPuntaje = false;
    }
  }

  ngOnInit() {
    this.spinner.show();
    this.obtenerCausas();
    this.obtenerCompradores();
    this.ContratosForm = this.formBuilder.group({
      TipoContrato: ['', Validators.required],
      SolpSapRfp: [''],
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
      // Acreedor: ['', Validators.required],
      // DigitoVerificacion: ['', Validators.required],
      NombreRazonSocial: ['', Validators.required],
      EmailProveedor: ['', [Validators.required, Validators.email]],
      Solicitante: [, Validators.required],
      Comprador: ['', Validators.required],
      ObervacionesAdicionales: ['', Validators.required],
      ariba: [''],
      causa: [''],
      evaluacion: ['', Validators.required],
      puntaje: ['', Validators.required],
      valorPuntaje: ['']
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
              this.CantidadBienesServicios = this.CantidadBienesServicios + this.ObjCondicionesTecnicas.length;             
              let cantidad = this.ObjCondicionesTecnicas.filter(x=> x.idContrato ==="" || x.idContrato === null).length;
              this.CantidadBienesServiciosConContrato = this.CantidadBienesServiciosConContrato + cantidad;              
              this.dataSource = new MatTableDataSource(this.ObjCondicionesTecnicas);
              this.dataSource.paginator = this.paginator;
              this.servicio.ObtenerCondicionesTecnicasServicios(this.IdSolicitud).subscribe(RespuestaCondicionesServicios => {
                this.ObjCondicionesTecnicasServicios = resultadoCondicionesTS.fromJsonList(RespuestaCondicionesServicios);
                if (this.ObjCondicionesTecnicasServicios.length > 0) {
                  this.existeCondicionesTecnicasServicios = true;
                  this.CTS = true;
                }
                this.CantidadBienesServicios = this.CantidadBienesServicios + this.ObjCondicionesTecnicasServicios.length; 
                let cantidad = this.ObjCondicionesTecnicasServicios.filter(x=> x.idContrato ==="" || x.idContrato === null).length;
                this.CantidadBienesServiciosConContrato = this.CantidadBienesServiciosConContrato + cantidad;
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

  obtenerCompradores() {
    this.servicio.obtenerCompradores().subscribe(
      (respuesta) => {
        console.log(respuesta);
        this.listaCompradores = Compardor.fromJsonList(respuesta)
        console.log(this.listaCompradores);
      }
    ) 
  }

  validarPuntaje() {
    if(this.ContratosForm.controls['valorPuntaje'].value > 100) {
      this.mostrarAdvertencia('El puntaje debe estar entre 0 y 100');
      return false;
    }
  }

  validarIva() {
    if(this.ContratosForm.controls['IvaContrato'].value > 100) {
      this.mostrarAdvertencia('El porcentaje del IVA debe ser máximo de 100');
      return false;
    }
  }

  validarNumeroContrato() {
    let max = this.ContratosForm.get('ContratoOC').value;
    let restrict;
    console.log(max);
    if(max.length > 10) {
     restrict =  max.slice(0, 10)
      this.ContratosForm.controls['ContratoOC'].setValue(restrict);
      this.mostrarAdvertencia('El numero de contrato sólo admite hasta 10 dígitos');
      return false;
    }
  }

  adjuntarArchivo(event) {
    let archivoAdjunto = event.target.files[0];
    if (archivoAdjunto != null) {
      this.adjunto = archivoAdjunto;
    } else {
      this.adjunto = null;
    }
  }

  get f() { return this.ContratosForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.ContratosForm.invalid) {
      let cantidad = this.BienesSeleccionados.length + this.ServiciosSeleccionados.length;
      if (cantidad === 0) {
        this.mostrarAdvertencia("Por favor seleccione uno o varios bienes y/o servicios");
        return false;
      }
      return;
    }
    let cantidad = this.BienesSeleccionados.length + this.ServiciosSeleccionados.length;
    if (cantidad === 0) {
      this.mostrarAdvertencia("Por favor seleccione uno o varios bienes y/o servicios");
      return false;
    }

    this.validarPuntaje();
    this.validarIva();
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
    // let Acreedor = this.ContratosForm.controls["Acreedor"].value;
    // let DigitoVerificacion = this.ContratosForm.controls["DigitoVerificacion"].value;
    let NombreRazonSocial = this.ContratosForm.controls["NombreRazonSocial"].value;
    let EmailProveedor = this.ContratosForm.controls["EmailProveedor"].value;
    let Solicitante = this.ContratosForm.controls["Solicitante"].value;
    let Comprador = this.ContratosForm.controls["Comprador"].value;
    let ObervacionesAdicionales = this.ContratosForm.controls["ObervacionesAdicionales"].value;
    let ObjContrato;
    let bpoPais = this.ObResProceso[0].gestionContratos;
    let causa = this.ContratosForm.controls["causa"].value;
    let ariba = this.ContratosForm.controls["ariba"].value;
    let evaluacion = this.ContratosForm.controls['evaluacion'].value;
    let puntaje;
    let valorPuntaje = this.ContratosForm.controls['valorPuntaje'].value;
    ariba === 'N/A'? causa = causa : causa = "";
    if(ariba === "" || ariba === null) {
      this.mostrarAdvertencia('El campo AribaSourcing es requerido');
      this.spinner.hide();
      return false;
    }

    if(Comprador === "") {
      this.mostrarAdvertencia('Debe seleccionar un comprador');
      this.spinner.hide();
      return false;
    }

    if(ariba === 'N/A' && (causa === "" || causa === null)){
      this.mostrarAdvertencia('Debe seleccionar una causa de excepción')
      this.spinner.hide();
      return false;
    }

    if(this.ContratosForm.controls['puntaje'].value === "Agregar un puntaje") {
      let puntajeString = parseFloat(valorPuntaje)
      puntaje = `${puntajeString}`
    }
    else {
      puntaje = this.ContratosForm.controls['puntaje'].value;
    }

    if(this.ContratosForm.controls['puntaje'].value === 'Agregar un puntaje' && this.ContratosForm.controls['valorPuntaje'].value === "") {
      this.mostrarAdvertencia('Debe agregar un puntaje antes de guardar el contrato');
      this.spinner.hide();
      return false;
    }

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
        // Acreedor: Acreedor,
        // DigitoVerificacion: DigitoVerificacion,
        NombreProveedor: NombreRazonSocial,
        EmailProveedor: EmailProveedor,
        Solicitante: Solicitante,
        Comprador: Comprador,
        ObservacionesAdicionales: ObervacionesAdicionales,
        SolicitudId: this.idSolicitudParameter,
        FechaDeCreacion: fechaContrato,
        AribaSourcing: ariba,
        CausalExcepcion: causa,
        RequiereEvaluacion: evaluacion,
        PuntajeActualEvaluacionProveedor: puntaje

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
        // Acreedor: Acreedor,
        // DigitoVerificacion: DigitoVerificacion,
        NombreProveedor: NombreRazonSocial,
        EmailProveedor: EmailProveedor,
        Solicitante: Solicitante,
        Comprador: Comprador,
        ObservacionesAdicionales: ObervacionesAdicionales,
        SolicitudId: this.idSolicitudParameter,
        FechaDeCreacion: fechaContrato,
        AribaSourcing: ariba,
        CausalExcepcion: causa,
        RequiereEvaluacion: evaluacion,
        PuntajeActualEvaluacionProveedor: puntaje
      }
    }
    if (this.adjunto) {
      if (this.adjunto.size > 0) {
        this.servicio.GuardarContrato(ObjContrato).then(
          (item: ItemAddResult) => {
            this.Guardado = true;
            let idContrato = item.data.Id;
            if (this.BienesSeleccionados.length > 0) {
              this.ActualizarBienes(idContrato.toString());
            }  
            if (this.ServiciosSeleccionados.length > 0) {
              this.ActualizarServicios(idContrato.toString());
            }
            let cantidadBienes = this.ObjCondicionesTecnicas.filter(x=> x.idContrato === "" || x.idContrato === null).length;
            let cantidadServicios = this.ObjCondicionesTecnicasServicios.filter(x=> x.idContrato === "" || x.idContrato === null).length;
            if (cantidadBienes === 0 && cantidadServicios === 0) {
                this.servicio.cambioEstadoSolicitud(this.IdSolicitud, "Formalizar firmas contrato", bpoPais).then(
                  (resultado) => {
                    this.servicio.actualizarFechaContratos(this.IdSolicitud, ContratoOC).then(
                      () => {
                        let idContrato = item.data.Id;
                        let nombreArchivo = "AdjuntoContrato-" + this.generarllaveSoporte() + "_" + this.adjunto.name;
                        this.servicio.agregarAdjuntoContratos(idContrato, nombreArchivo, this.adjunto).then(respuesta => {
                          let notificacion = {
                            IdSolicitud: this.IdSolicitud.toString(),
                            ResponsableId: bpoPais,
                            Estado: 'Formalizar firmas contrato'
                          }
                          this.servicio.agregarNotificacion(notificacion).then(
                            (item: ItemAddResult) => {
                              this.MostrarExitoso(`Se adjuntó el archivo ${this.adjunto.name}`)
                              setTimeout(() => {
                                this.MostrarExitoso("El contrato se ha guardado correctamente");
                              this.spinner.hide();
                              }, 2000);
                              setTimeout(() => {
                                this.router.navigate(["/mis-pendientes"]);
                              }, 2000);
                            }, err => {
                              this.mostrarError('Error agregando la notificación');
                              this.spinner.hide();
                            }
                          )
                        })
                      },
                      (error) => {
                        console.error(error);
                      }
                    )
                  }
                ).catch(
                  (error) => {
                    console.log(error);
                    this.spinner.hide();
                  }
                );
            }else{
              this.servicio.actualizarFechaContratos(this.IdSolicitud, ContratoOC).then(
                () => {
                  let idContrato = item.data.Id;
                  let nombreArchivo = "AdjuntoContrato-" + this.generarllaveSoporte() + "_" + this.adjunto.name;
                  this.servicio.agregarAdjuntoContratos(idContrato, nombreArchivo, this.adjunto).then(respuesta => {
                    let notificacion = {
                      IdSolicitud: this.IdSolicitud.toString(),
                      ResponsableId: bpoPais,
                      Estado: 'Formalizar firmas contrato'
                    }
                    this.servicio.agregarNotificacion(notificacion).then(
                      (item: ItemAddResult) => {
                        this.MostrarExitoso(`Se adjuntó el archivo ${this.adjunto.name}`)
                        setTimeout(() => {
                          this.MostrarExitoso("El contrato se ha guardado correctamente");
                        this.spinner.hide();
                        }, 2000);
                        setTimeout(() => {
                          this.router.navigate(["/mis-pendientes"]);
                        }, 2000);
                      }, err => {
                        this.mostrarError('Error agregando la notificación');
                        this.spinner.hide();
                      }
                    )
                  })
                },
                (error) => {
                  console.error(error);
                }
              )
            }         
            
          }
        ).catch(
          (error) => {
            console.log(error);
            this.spinner.hide();
          });
      }
      else {
        this.mostrarError('Oops! Ha habido un problema con el archivo adjunto. Por favor vuelva a adjuntarlo');
        this.spinner.hide();
      }
    }
    else {
      this.servicio.GuardarContrato(ObjContrato).then(
        (item: ItemAddResult) => {
          this.Guardado = true;
          let idContrato = item.data.Id;
            if (this.BienesSeleccionados.length > 0) {
              this.ActualizarBienes(idContrato.toString());
            }  
            if (this.ServiciosSeleccionados.length > 0) {
              this.ActualizarServicios(idContrato.toString());
            }
            let cantidadBienes = this.ObjCondicionesTecnicas.filter(x=> x.idContrato === "" || x.idContrato === null).length;
            let cantidadServicios = this.ObjCondicionesTecnicasServicios.filter(x=> x.idContrato === "" || x.idContrato === null).length;
            if (cantidadBienes === 0 && cantidadServicios === 0) {
                this.servicio.cambioEstadoSolicitud(this.IdSolicitud, "Formalizar firmas contrato", bpoPais).then(
                    (resultado) => {
                      this.servicio.actualizarFechaContratos(this.IdSolicitud, ContratoOC).then(
                        () => {
                          let notificacion = {
                            IdSolicitud: this.IdSolicitud.toString(),
                            ResponsableId: bpoPais,
                            Estado: 'Formalizar firmas contrato'
                          }
                          this.servicio.agregarNotificacion(notificacion).then(
                            (item: ItemAddResult) => {
                              this.MostrarExitoso("El contrato se ha guardado correctamente sin archivos adjuntos");
                              this.spinner.hide();
                              setTimeout(() => {
                                this.router.navigate(["/mis-pendientes"]);
                              }, 1000);
                            }, err => {
                              this.mostrarError('Error agregando la notificación');
                              this.spinner.hide();
                            }
                          )
                        },
                        (error) => {
                          console.error(error);
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
            else{
              this.servicio.actualizarFechaContratos(this.IdSolicitud, ContratoOC).then(
                () => {
                  let notificacion = {
                    IdSolicitud: this.IdSolicitud.toString(),
                    ResponsableId: bpoPais,
                    Estado: 'Formalizar firmas contrato'
                  }
                  this.servicio.agregarNotificacion(notificacion).then(
                    (item: ItemAddResult) => {
                      this.MostrarExitoso("El contrato se ha guardado correctamente sin archivos adjuntos");
                      this.spinner.hide();
                      setTimeout(() => {
                        this.router.navigate(["/mis-pendientes"]);
                      }, 1000);
                    }, err => {
                      this.mostrarError('Error agregando la notificación');
                      this.spinner.hide();
                    }
                  )
                },
                (error) => {
                  console.error(error);
                }
              )
            }
          
        }
      ).catch(
        (error) => {
          console.log(error);
          this.spinner.hide();
        });
    }
  }
  ActualizarBienes(idContrato){
    this.BienesSeleccionados.forEach(
      (elemento,index)=>{
        let indexBienes=this.ObjCondicionesTecnicas.findIndex(x=> x.IdBienes === parseInt(elemento));
        this.ObjCondicionesTecnicas[indexBienes].idContrato= idContrato;
        this.servicio.guardarIdContratoBienes(elemento,idContrato).then(
          (resultado)=>{ }
        ).catch(
          (error)=>{
            this.mostrarError("ha ocurrido un error al guardar");
          }
        );        
      }
    )
  }
  ActualizarServicios(idContrato){
     this.ServiciosSeleccionados.forEach(
       (elemento,index)=>{
         let indexBienes=this.ObjCondicionesTecnicasServicios.findIndex(x=> x.IdBienes === parseInt(elemento));
         this.ObjCondicionesTecnicasServicios[indexBienes].idContrato= idContrato;
         this.servicio.guardarIdContratoServicios(elemento,idContrato).then(
           (result)=>{ }
         ).catch(
             (error)=>{
               this.mostrarError("ha ocurrido un error al guardar");
             }
           );               
       }
     )
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

  generarllaveSoporte(): string {
    var fecha = new Date();
    var valorprimitivo = fecha.valueOf().toString();
    return valorprimitivo;
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

  seleccionarBienes(evento){
    let idElemento = parseInt(evento.source.value);
    if (evento.checked === true) {
      let index = this.ObjCondicionesTecnicas.findIndex(k=> k.IdBienes === idElemento);
      this.ObjCondicionesTecnicas[index]["idContrato"] = "0";
      this.BienesSeleccionados.push(idElemento);
    }
    else{
      let indexCT = this.ObjCondicionesTecnicas.findIndex(k=> k.IdBienes ===idElemento);
      this.ObjCondicionesTecnicas[indexCT]["idContrato"] = null;
      let index =this.BienesSeleccionados.findIndex(x=> x === idElemento);
      this.BienesSeleccionados.splice(index, 1);
      this.todosBienes = false;
    }    
  }

  seleccionarTodosBienes(evento){
    if (evento.checked === true) {
      this.ObjCondicionesTecnicas.filter(
        (x)=>{
          if (x.idContrato === null) {
            let pp = this.BienesSeleccionados.findIndex(j=> j === x.IdBienes);
            if (pp === -1) {
              this.BienesSeleccionados.push(x.IdBienes);
              let index = this.ObjCondicionesTecnicas.findIndex(k=> k.IdBienes === x.IdBienes);
              this.ObjCondicionesTecnicas[index]["idContrato"] = "0";
            }          
          }        
      });
    }
    else{
      this.BienesSeleccionados.forEach(
        (x)=>{
          let indexCT = this.ObjCondicionesTecnicas.findIndex(k=> k.IdBienes === x);
          this.ObjCondicionesTecnicas[indexCT]["idContrato"] = null;          
        });
        this.BienesSeleccionados =[];
    }    
  }

  seleccionarServicios(evento){  
    let idElemento = parseInt(evento.source.value);  
    if (evento.checked === true) {
        let index = this.ObjCondicionesTecnicasServicios.findIndex(k=> k.IdBienes === idElemento);
        this.ObjCondicionesTecnicasServicios[index]["idContrato"] = "0";
        this.ServiciosSeleccionados.push(idElemento);
    }
    else{  
      let indexCTS = this.ObjCondicionesTecnicasServicios.findIndex(k=> k.IdBienes === idElemento);
      this.ObjCondicionesTecnicasServicios[indexCTS]["idContrato"] = null;    
      let index =this.ServiciosSeleccionados.findIndex(x=> x === idElemento);
      this.ServiciosSeleccionados.splice(index, 1);
      this.todosServicios = false;
    }    
  }

  seleccionarTodosServicios(evento){
    if (evento.checked === true) {
      this.ObjCondicionesTecnicasServicios.filter(
        (x)=>{
          if (x.idContrato === null) {
            let pp = this.ServiciosSeleccionados.findIndex(j=> j === x.IdBienes);
            if (pp === -1) {
              this.ServiciosSeleccionados.push(x.IdBienes);
              let index = this.ObjCondicionesTecnicasServicios.findIndex(k=> k.IdBienes === x.IdBienes);
              this.ObjCondicionesTecnicasServicios[index]["idContrato"] = "0";
            }          
          }        
      });
    }
    else{
      this.ServiciosSeleccionados.forEach(
        (x)=>{
          let indexCTS = this.ObjCondicionesTecnicasServicios.findIndex(k=> k.IdBienes === x);
          this.ObjCondicionesTecnicasServicios[indexCTS]["idContrato"] = null;          
        });
        this.ServiciosSeleccionados =[];
    }    
  }

}
