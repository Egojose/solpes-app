import { Component, OnInit, ViewChild } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { CondicionContractual } from '../dominio/condicionContractual';
import { CondicionesTecnicasBienes } from '../aprobar-sondeo/condicionesTecnicasBienes';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CondicionTecnicaServicios } from '../aprobar-sondeo/condicionesTecnicasServicios';
import { Router } from '@angular/router';
import { ItemAddResult } from 'sp-pnp-js';
import { Usuario } from '../dominio/usuario';
import { responsableProceso } from '../dominio/responsableProceso';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { Solicitud } from '../dominio/solicitud';
import { ModalDirective } from 'ngx-bootstrap';
import { CrmServicioService } from '../servicios/crm-servicio.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Select2Data } from 'ng-select2-component';


@Component({
  selector: 'app-aprobar-sondeo',
  templateUrl: './aprobar-sondeo.component.html',
  styleUrls: ['./aprobar-sondeo.component.css']
})
export class AprobarSondeoComponent implements OnInit {
  @ViewChild('customTooltip') tooltip: any;
  @ViewChild('customTooltip1') tooltip1: any;
  @ViewChild('customTooltip2') tooltip2: any;
  @ViewChild('autoShownModal') autoShownModal: ModalDirective;
  
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
  ctsFormulario: FormGroup;
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
  isModalShown = false;
  mostrarFiltroServicios: boolean;
  idClient: any;
  idServiceOrder: any;
  idService: any;
  disabledIdServicioServicios: boolean;
  dataSourceDatosServicios = new MatTableDataSource();
  @ViewChild(MatPaginator) paginatorCrm: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  datosServicios;
  OrdenEstadistica = new FormControl('');
  numeroOrden = new FormControl('');
  clientServicios = new FormControl('');
  ordenServServicios = new FormControl('');
  idServServicios = new FormControl('');
  nombreIdServServicios = new FormControl('');
  filterValuesServicios = {
    Cliente: '',
    OS: '',
    IdServicio: '',
    Nombre_Servicio: ''
  };
  displayedColumnsServicios: string[] = ["seleccionar","cliente", "OS", "idServicio", "nombreIdServicio"];
  mostrarTableServicios: boolean;
  dataSeleccionadosServicios = [];
  dataIdOrdenSeleccionadosServicios = [];
  selectAllServicios: boolean;
  datosFiltradosServicios: any = [];
  ReadOnlyIdServicio: boolean;
  TipoSondeo: string;
  ctsSubmitted: boolean = false;
  usuarios: Usuario[] = [];
  dataUsuarios: Select2Data = [
    { value: 'Seleccione', label: 'Seleccione' }
  ];
  ObjOrdenadorGasto: any;
  valorUsuarioPorDefecto: any;
  emptyManager: boolean;
  idBienServicio: any;
  datosContablesBienesVacios: any = [];
  datosContablesServiciosVacios: any  = [];
  nuevoOrdenadorGastos: any;
  emptyNumeroOrdenEstadistica: boolean = false;
  valorOrdenEstadisica: any;
  disableBtnDatoContables: boolean = true;
  ocultarBotonDatosContables: boolean = true;

  constructor( 
    private formBuilder: FormBuilder,
    private servicio: SPServicio, 
    public toastr: ToastrManager, 
    private router: Router, 
    private spinner: NgxSpinnerService,
    private servicioCrm: CrmServicioService) {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
    this.solicitudRecuperada = JSON.parse(sessionStorage.getItem('solicitud'));
    this.perfilacionEstado();    
    this.IdSolicitudParms = this.solicitudRecuperada.id;
    this.existeCondicionesTecnicasBienes = false;
    this.existeCondicionesTecnicasServicios = false;
    this.mostrarFiltroServicios = false;
    this.disabledIdServicioServicios = false;
    this.dataSourceDatosServicios = new MatTableDataSource();
    this.selectAllServicios = false;
    this.emptyManager = true;
  }

  async validarOrdenEstadistica() {
    if(this.OrdenEstadistica.value === '') {
      this.mostrarAdvertencia('Debe seleccionar orden estadística')
      this.spinner.hide();
      return false;
    }
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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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

 async GuardarRevSondeo() {
    this.spinner.show();
    let fecha = new Date();
    let dia = ("0" + fecha.getDate()).slice(-2);
    let mes = ("0" + (fecha.getMonth() + 1)).slice(-2);
    let año = fecha.getFullYear();
    let fechaFormateada = dia + "/" + mes + "/" + año;
    console.log(this.OrdenEstadistica);
    console.log(this.valorOrdenEstadisica);
    await this.validarDatosContables();
    await this.validarOrdenEstadistica();
    await this.consultarDatosContables();

    let ObjSondeo;
    if (this.RDBsondeo === undefined) {
      this.mostrarAdvertencia('Debe seleccionar una acción');
      this.spinner.hide();
    }

    if(this.OrdenEstadistica.value === 'SI' && this.numeroOrden.value === '') {
      this.mostrarAdvertencia('Por favor digite el numero de orden estadística');
      this.spinner.hide();
      return false;
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
            FechaRevisarSondeo: fecha,
            OrdenadorGastosId: parseInt(this.nuevoOrdenadorGastos),
            OrdenEstadistica: this.valorOrdenEstadisica,
            NumeroOrdenEstadistica: this.numeroOrden.value
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
            FechaRevisarSondeo: fecha,
            OrdenadorGastosId: parseInt(this.nuevoOrdenadorGastos),
            OrdenEstadistica: this.valorOrdenEstadisica,
            NumeroOrdenEstadistica: this.numeroOrden.value
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
            FechaRevisarSondeo: fecha,
            OrdenadorGastosId: parseInt(this.nuevoOrdenadorGastos),
            OrdenEstadistica: this.valorOrdenEstadisica,
            NumeroOrdenEstadistica: this.numeroOrden.value
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
            FechaRevisarSondeo: fecha,
            OrdenadorGastosId: parseInt(this.nuevoOrdenadorGastos),
            OrdenEstadistica: this.valorOrdenEstadisica,
            NumeroOrdenEstadistica: this.numeroOrden.value
          }
        }
      }

      if((this.RDBsondeo === 2 || this.RDBsondeo === 4) && (this.datosContablesBienesVacios.length > 0 || this.datosContablesServiciosVacios.length > 0)) {
        this.mostrarAdvertencia('Existen bienes o servicios sin datos contables. Por favor verifique');
        this.spinner.hide();
        return false;
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
    this.RegistrarFormularioCTS();
    this.obtenerUsuariosSitio();
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

  obtenerUsuariosSitio() {
    this.servicio.ObtenerTodosLosUsuarios().subscribe(
      (respuesta) => {
        this.usuarios = Usuario.fromJsonList(respuesta);
        this.DataSourceUsuariosSelect2();
      }, err => {
        this.mostrarError('Error obteniendo usuarios');
        this.spinner.hide();
        console.log('Error obteniendo usuarios: ' + err);
      }
    )
  }

  private DataSourceUsuariosSelect2() {
    this.usuarios.forEach(usuario => {
      this.dataUsuarios.push({ value: usuario.id.toString(), label: usuario.nombre });
    });
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
        this.ObjOrdenadorGasto = solicitud.OrdenadorGastos;
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
        this.ObjOrdenadorGasto.Id !== undefined ? this.valorUsuarioPorDefecto = this.ObjOrdenadorGasto.Id.toString() : this.valorUsuarioPorDefecto = "";

        if (solicitud.CondicionesContractuales != null) {
          this.condicionesContractuales = JSON.parse(solicitud.CondicionesContractuales.replace(/(\r\n|\n|\r|\t)/gm, "")).condiciones;
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

  RegistrarFormularioCTS() {
    this.ctsFormulario = this.formBuilder.group({      
      clienteServicios: [''],
      ordenServicios: [''],
      idServicio: [''],
      centroCostos: [''],
      numCicoCTS:[''],
      numCuentaCTS:[''],
      nombreIdServicio: [''],
    });
  }

  seleccionarOrdenadorGastos(event) {
    this.nuevoOrdenadorGastos = event;
    if (event != "Seleccione") {
      this.emptyManager = false;
    } else {
      this.emptyManager = true;
    }
  }

  showFilterServicios ($event) {
    this.dataSourceDatosServicios = undefined;
    if ($event.target.value === "ID de Servicios") {
      this.ReadOnlyIdServicio = true;
      this.mostrarFiltroServicios = true;
      this.idClient !== null ? this.ctsFormulario.controls['clienteServicios'].setValue(this.idClient) : this.ctsFormulario.controls['clienteServicios'].setValue('');
      this.idServiceOrder !== null ? this.ctsFormulario.controls['ordenServicios'].setValue(this.idServiceOrder) : this.ctsFormulario.controls['ordenServicios'].setValue('');
      this.idService !== null ? this.ctsFormulario.controls['idServicio'].setValue(this.idService) : this.ctsFormulario.controls['idServicio'].setValue('');
      this.idService !== null ? this.disabledIdServicioServicios = false : this.disabledIdServicioServicios = true;
    }
    else {  
      this.ctsFormulario.controls['numCicoCTS'].setValue("");
      this.ctsFormulario.controls['numCuentaCTS'].setValue('');
      this.ReadOnlyIdServicio = false;  
      this.mostrarFiltroServicios = false;
    }
  }

  async consultarDatosContables() {
    let ordenEstadistica = this.OrdenEstadistica.value;
    let bienes = await this.servicio.obtenerCtBienes(this.IdSolicitud);
    let servicios = await this.servicio.obtenerCtServicios(this.IdSolicitud);
    let datosContablesBienes = bienes.filter(x => {
      return  x.costoInversion !== '' || x.numeroCostoInversion !== '' || x.numeroCuenta !== ''
    })
    let datosContablesServicios = servicios.filter(x => {
      return x.costoInversion !== '' || x.numeroCostoInversion !== '' || x.numeroCuenta !== ''
    })
    let objDatosContablesBienes: any;
    let objDatosContablesServicios: any;
    if(ordenEstadistica === 'SI' && datosContablesBienes.length > 0) {
      for(let i = 0; i < datosContablesBienes.length; i++) {
        let idBienes = datosContablesBienes[i].Id
        objDatosContablesBienes = {
          costoInversion: '',
          numeroCostoInversion: '',
          numeroCuenta: '',
          tieneIdServicio: false,
          IdOrdenServicio: ''
        }
        console.log(objDatosContablesBienes);
       await this.servicio.actualiazarDatosContablesBienes(idBienes, objDatosContablesBienes).then(
        (result) => {
          this.mostrarInformacion('Se eliminaron los datos contables');
        }
       ), err => {
         this.mostrarAdvertencia('No se eliminaron los datos contables' + err)
       };
      }
      // this.servicio.actualiazarDatoContablesBienes(bienes.id ,objDatosContablesBienes)
    }
    if(ordenEstadistica === 'SI' && datosContablesServicios.length > 0) {
      for(let i = 0; i < datosContablesServicios.length; i++) {
        let idServicios = datosContablesServicios[i].Id
        objDatosContablesServicios = {
          costoInversion: '',
          numeroCostoInversion: '',
          numeroCuenta: '',
          tieneIdServicio: false,
          IdOrdenServicio: ''
        }
       
       await this.servicio.actualizarDatosContablesServicios(idServicios, objDatosContablesServicios).then(
        (result) => {
          this.mostrarInformacion('Se eliminaron los datos contables');
        }
       ), err => {
         this.mostrarAdvertencia('No se eliminaron los datos contables' + err)
       };
      }
    }
  }

  validarLengthBusquedaServicios() {
    let clienteServicios = this.ctsFormulario.get('clienteServicios').value;
    let ordenServicios = this.ctsFormulario.get('ordenServicios').value;
    let idServicio = this.ctsFormulario.get('idServicio').value;
    let nombreIdServicio = this.ctsFormulario.get('nombreIdServicio').value;
    clienteServicios = clienteServicios === undefined? "":clienteServicios;
    ordenServicios = ordenServicios === undefined? "":ordenServicios;
    idServicio = idServicio === undefined? "":idServicio;
    nombreIdServicio = nombreIdServicio === undefined? "":nombreIdServicio;

    if(clienteServicios === '' && ordenServicios === '' && idServicio === '' && nombreIdServicio === '') {
      this.mostrarAdvertencia('Los campos están vacíos. No hay nada que consultar');
      return false;
    }
    if((clienteServicios !== '' && clienteServicios !== undefined) && clienteServicios.length < 4) {
      this.mostrarAdvertencia('Se requieren al menos 4 caracteres si va a utilizar el campo "Cliente"');
      return false;
    }
    if((idServicio !== '' && idServicio !== undefined) && idServicio.length < 3) {
      this.mostrarAdvertencia('Se requieren al menos 3 caracteres si va a utilizar el campo "Id de servicios"')
      return false;
    }
    if((nombreIdServicio !== '' && nombreIdServicio !== undefined) && nombreIdServicio.length < 4) {
      this.mostrarAdvertencia('Se requieren al menos 4 caracteres si va a utilizar el campo "Nombre Id de servicio"')
      return false;
    }
    this.consultarDatosServicios();
  }

  consultarDatosServicios() {
    let clienteServicios = this.ctsFormulario.get('clienteServicios').value;
    let ordenServicios = this.ctsFormulario.get('ordenServicios').value;
    let idServicio = this.ctsFormulario.get('idServicio').value;
    let nombreIdServicio = this.ctsFormulario.get('nombreIdServicio').value;
    clienteServicios = clienteServicios === undefined? "":clienteServicios;
    ordenServicios = ordenServicios === undefined? "":ordenServicios;
    idServicio = idServicio === undefined? "":idServicio;
    nombreIdServicio = nombreIdServicio === undefined? "":nombreIdServicio;
    let parametros = {
      "idservicio": idServicio,
      "cliente": clienteServicios,
      "nombreservicio": ordenServicios,
      "os": ordenServicios,
    }
    let objToken = {
      TipoConsulta: "Bodega",
      suscriptionKey: "03f4673dd6b04790be91da8e57fddb52",
      estado: "true"
    }
    let objTokenString = JSON.stringify(objToken);
    localStorage.setItem("id_token",objTokenString);
    this.spinner.show();
    this.servicioCrm.consultarDatosBodega(parametros).then(
      (respuesta) => {
        console.log(respuesta);
        this.mostrarTableServicios = true;
        this.datosServicios = respuesta;
        
        if (this.datosServicios.length === 0) {
          this.mostrarAdvertencia('Los criterios de búsqueda no coinciden con los datos almacenados en la bodega');
          return false;
        }
        this.spinner.hide();
        this.dataSourceDatosServicios = new MatTableDataSource(respuesta);
        this.dataSourceDatosServicios.filterPredicate = this.createFilterServicios();
        this.leerFiltrosServicios();
      }
    )
  }

  createFilterServicios(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      data.Cliente.toLowerCase().indexOf(searchTerms.Cliente.toLowerCase()) !== -1
      && data.OS.toString().toLowerCase().indexOf(searchTerms.OS.toLowerCase()) !== -1
      && data.IdServicio.toLowerCase().indexOf(searchTerms.IdServicio.toLowerCase()) !== -1
      && data.Nombre_Servicio.toLowerCase().indexOf(searchTerms.Nombre_Servicio.toLowerCase()) !== -1;
    
      return data.Cliente.toLowerCase().indexOf(searchTerms.Cliente.toLowerCase()) !== -1
        && data.OS.toString().toLowerCase().indexOf(searchTerms.OS.toLowerCase()) !== -1
        && data.IdServicio.toLowerCase().indexOf(searchTerms.IdServicio.toLowerCase()) !== -1
        && data.Nombre_Servicio.toLowerCase().indexOf(searchTerms.Nombre_Servicio.toLowerCase()) !== -1;
    }
    return filterFunction;
  }

  leerFiltrosServicios() {
    this.clientServicios.valueChanges
      .subscribe(
        (cliente) => {
          this.filterValuesServicios.Cliente = cliente;
          this.dataSourceDatosServicios.filter = JSON.stringify(this.filterValuesServicios);
        }
      )
    this.ordenServServicios.valueChanges
      .subscribe(
        (orden) => {
          this.filterValuesServicios.OS = orden;
          this.dataSourceDatosServicios.filter = JSON.stringify(this.filterValuesServicios);
        }
      )
    this.idServServicios.valueChanges
      .subscribe(
        (id) => {
          this.filterValuesServicios.IdServicio = id;
          this.dataSourceDatosServicios.filter = JSON.stringify(this.filterValuesServicios);
        }
      )
    this.nombreIdServServicios.valueChanges
      .subscribe(
        (nombre) => {
          this.filterValuesServicios.Nombre_Servicio = nombre;
          this.dataSourceDatosServicios.filter = JSON.stringify(this.filterValuesServicios);
        }
      )
  }

  seleccionadoServicios($event, element) {
    let idServicioSeleccionado = $event.source.value
    if ($event.checked === true) {
      this.dataSeleccionadosServicios.push(idServicioSeleccionado);
      this.dataIdOrdenSeleccionadosServicios.push(element.Orden_SAP);
    }
    else {
      let index = this.dataSeleccionadosServicios.findIndex(x => x === idServicioSeleccionado);
      let el = this.dataIdOrdenSeleccionadosServicios.findIndex(x => x === element.Orden_SAP)
      this.dataSeleccionadosServicios.splice(index, 1);
      this.dataIdOrdenSeleccionadosServicios.splice(el, 1);
      if(index === -1) {
        this.selectAllServicios = false;
      }
    }
    this.ctsFormulario.controls['numCicoCTS'].setValue(this.dataSeleccionadosServicios.toString());
  }

  seleccionarTodosServicios($event) {
    $event.checked === true ? this.selectAllServicios = true : this.selectAllServicios = false;
    let cliente = this.clientServicios.value;
    let orden = this.ordenServServicios.value;
    let idServicios = this.idServServicios.value;
    let nombreServicios = this.nombreIdServServicios.value;
    if (this.selectAllServicios === true && (cliente === '' && orden === '' && idServicios === '' && nombreServicios === '')) {
      this.dataSeleccionadosServicios = this.datosServicios.map(x => {
        return x.IdServicio
      })
      this.dataIdOrdenSeleccionadosServicios = this.datosServicios.map(x => {
        return x.Orden_SAP
      })
    }
    else if(this.selectAllServicios === true && (cliente !== '' || orden !== '' || idServicios !== '' || nombreServicios !== '')) {
     this.datosFiltradosServicios = this.dataSourceDatosServicios
      this.dataSeleccionadosServicios = this.datosFiltradosServicios.filteredData.map(x => {
        return x.IdServicio
      })
      this.dataIdOrdenSeleccionadosServicios = this.datosFiltradosServicios.filteredData.map(x => {
        return x.Orden_SAP
      })
    }
    else {
      this.dataSeleccionadosServicios = [];
      this.dataIdOrdenSeleccionadosServicios = [];
    }
    this.ctsFormulario.controls['numCicoCTS'].setValue(this.dataSeleccionadosServicios.toString());
  }

  mostrarNumeroOrdenEstadistica(valorOrdenEstadistica) {
    if (valorOrdenEstadistica == "SI") {
      this.emptyNumeroOrdenEstadistica = true;
      this.valorOrdenEstadisica = true;
      this.disableBtnDatoContables = true;
      this.ctsFormulario.controls['centroCostos'].setValue('');
      this.ctsFormulario.controls['numCicoCTS'].setValue('');
      this.ctsFormulario.controls['numCuentaCTS'].setValue('');
    } else {
      this.ocultarBotonDatosContables = false;
      this.valorOrdenEstadisica = false;
      this.emptyNumeroOrdenEstadistica = false;
      this.disableBtnDatoContables = false;
    }
  }

  async VerDatosContables(item, tipo) {
    console.log(item);
    let datosBienes;
    let datosServicios;
    let bienes = await this.servicio.obtenerCtBienes(this.IdSolicitud);
    console.log(bienes);
    let servicios = await this.servicio.obtenerCtServicios(this.IdSolicitud);
    if(bienes.length > 0 && tipo === 'Bien') {
     datosBienes = bienes.filter(x => {
        return x.Id === item.IdBienes
      });
      this.ReadOnlyIdServicio = item.costoInversion === "ID de Servicios" ? true : false;
      this.ctsFormulario.controls['centroCostos'].setValue(datosBienes[0].costoInversion);
      this.ctsFormulario.controls['numCicoCTS'].setValue(datosBienes[0].numeroCostoInversion);
      this.ctsFormulario.controls['numCuentaCTS'].setValue(datosBienes[0].numeroCuenta);
    }
    else if (servicios.length > 0 && tipo === 'Servicio') {
      datosServicios = servicios.filter(x => {
        return x.Id === item.id;
      });
      this.ReadOnlyIdServicio = item.costoInversion === "ID de Servicios" ? true : false;
      this.ctsFormulario.controls['centroCostos'].setValue(datosServicios[0].costoInversion);
      this.ctsFormulario.controls['numCicoCTS'].setValue(datosServicios[0].numeroCostoInversion);
      this.ctsFormulario.controls['numCuentaCTS'].setValue(datosServicios[0].numeroCuenta);
    }
    // console.log(datosBienes);
    // this.ReadOnlyIdServicio = item.costoInversion === "ID de Servicios" ? true : false;
    // this.ctsFormulario.controls['centroCostos'].setValue(item.costoInversion);
    // this.ctsFormulario.controls['numCicoCTS'].setValue(item.numeroCostoInversion);
    // this.ctsFormulario.controls['numCuentaCTS'].setValue(item.numeroCuenta);
    if (tipo === "Bien") {
      this.TipoSondeo = "Bien";
      this.idBienServicio = item.IdBienes;
    } else if (tipo === "Servicio") {
      this.TipoSondeo = "Servicio";
      this.idBienServicio = item.id;
    }
    this.isModalShown = true;
  } 
  
 async refrescarDatosContables() {
    let a = await this.servicio.obtenerCtBienes(this.IdSolicitud);
    let b = await this.servicio.obtenerCtServicios(this.IdSolicitud);
  }

  async validarDatosContables() {
    let bienes = await this.servicio.obtenerCtBienes(this.IdSolicitud);
    let servicios = await this.servicio.obtenerCtServicios(this.IdSolicitud);
    if(bienes.length > 0 && this.valorOrdenEstadisica === false) {
     this.datosContablesBienesVacios = bienes.filter(x => {
        return x.costoInversion === null || x.numeroCostoInversion === null || x.numeroCuenta === null
      });
    }
    else {
      this.datosContablesBienesVacios = [];
    }
    if(servicios.length > 0 && this.valorOrdenEstadisica === false) {
     this.datosContablesServiciosVacios = servicios.filter(x => {
        return x.costoInversion === null || x.numeroCostoInversion === null || x.numeroCuenta === null
      })
    }
    else {
      this.datosContablesServiciosVacios = [];
    }
  }
 
  hideModal(): void {
    this.autoShownModal.hide();
    this.mostrarFiltroServicios = false;
    this.dataSourceDatosServicios = undefined;
    this.ReadOnlyIdServicio = false;
  }
 
  onHidden(): void {
    this.isModalShown = false;
    this.mostrarFiltroServicios = false;
    this.dataSourceDatosServicios = undefined;
    this.ReadOnlyIdServicio = false;
  }

  terminarSeleccionServicios() {
    this.mostrarTableServicios = false;
  }

  get f2() { return this.ctsFormulario.controls; }

  ctsOnSubmit(){
    this.ctsSubmitted = true;
    this.mostrarFiltroServicios = false;
    if (this.ctsFormulario.invalid) {
      return;
    }
    this.spinner.show();
    let centroCosto = this.ctsFormulario.controls['centroCostos'].value;
    let NumeroCentroCosto = this.ctsFormulario.controls['numCicoCTS'].value;
    let NumeroCuenta = this.ctsFormulario.controls['numCuentaCTS'].value;
    // let OrdenadorGasto = this.ctsFormulario.controls['ordenadorGastos'].value;
  
    let obj = {
      costoInversion: centroCosto,
      numeroCostoInversion: NumeroCentroCosto,
      numeroCuenta: NumeroCuenta,
      IdOrdenServicio: this.dataIdOrdenSeleccionadosServicios.toString(),
    }

    if (this.TipoSondeo === "Bien") {
      this.modificarDatosContBienes(obj);
    } else {
      this.modificarDatosContServicio(obj);
    }
  }

  modificarDatosContBienes(obj){
    this.servicio.modificarDatosContablesBienes(obj, this.idBienServicio).then(
      (respuesta)=>{
        this.MostrarExitoso("Los datos contables se actualizaron con éxito");
        this.spinner.hide();
        this.hideModal();
        //  this.modificarOG(OrdenadorGasto);
      }
    ).catch(
      (error)=>{
          console.log(error);
          this.mostrarError("Error al guardar los datos contables");
          this.spinner.hide();
          this.hideModal();
      }
    )
  }

  modificarDatosContServicio(obj){
    this.servicio.modificarDatosContablesServicio(obj, this.idBienServicio).then(
      (respuesta)=>{
        this.MostrarExitoso("Los datos contables se actualizaron con éxito");
        this.spinner.hide();
        this.hideModal();
        //  this.modificarOG(OrdenadorGasto);
      }
    ).catch(
      (error)=>{
          console.log(error);
          this.mostrarError("Error al guardar los datos contables");
          this.spinner.hide();
          this.hideModal();
      }
    )
  }

  

  mostrarInformacion(mensaje: string) {
    this.toastr.infoToastr(mensaje, 'Información importante');
  }

  // modificarOG(OrdenadorGasto: any) {
  //   OrdenadorGasto = parseInt(OrdenadorGasto);
  //   let obj = {
  //     OrdenadorGastosId: OrdenadorGasto
  //   }
  //   this.servicio.modificarOrdenadorGastos(obj, this.IdSolicitud).then(
  //     (respuesta)=>{
  //        this.MostrarExitoso("El ordenador de gasto se guardo correctamente");
  //        this.spinner.hide();
  //        this.hideModal();
  //     }
  //   ).catch(
  //     (error)=>{
  //         console.log(error);
  //         this.mostrarError("Error al guardar el ordenador de gastos");
  //         this.spinner.hide();
  //     }
  //   )
  // }
}