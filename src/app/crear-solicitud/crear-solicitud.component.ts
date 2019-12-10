import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TipoSolicitud } from '../dominio/tipoSolicitud';
import { setTheme } from 'ngx-bootstrap/utils';
import { SPServicio } from '../servicios/sp-servicio';
import { Usuario } from '../dominio/usuario';
import { Empresa } from '../dominio/empresa';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Select2Data } from 'ng-select2-component';
import { Pais } from '../dominio/pais';
import { Categoria } from '../dominio/categoria';
import { Subcategoria } from '../dominio/subcategoria';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/public_api';
import { CondicionContractual } from '../dominio/condicionContractual';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { Solicitud } from '../dominio/solicitud';
import { ItemAddResult } from 'sp-pnp-js';
import { CondicionTecnicaBienes } from '../dominio/condicionTecnicaBienes';
import { CondicionTecnicaServicios } from '../dominio/condicionTecnicaServicios';
import { BsModalRef, BsModalService, TimepickerModule, ModalDirective } from 'ngx-bootstrap';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { MatTableDataSource } from '@angular/material';
import { environment } from 'src/environments/environment';
import { responsableProceso } from '../dominio/responsableProceso';
import { NgxSpinnerService } from 'ngx-spinner';
import * as $ from 'jquery';
import { Grupo } from '../dominio/grupo';
import * as XLSX from 'xlsx';
import readXlsxFile from 'read-excel-file';
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http"
import { CondicionesTecnicasBienes } from '../entrega-bienes/condicionTecnicaBienes';
import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';
import { CondicionesTecnicasServicios } from '../entrega-servicios/condicionTecnicaServicio';
import { forEach } from '@angular/router/src/utils/collection';
import { CrmServicioService } from '../servicios/crm-servicio.service';
import { Observable } from 'rxjs';
import { ResponsableSoporte } from '../dominio/responsableSoporte';
import { EmailProperties } from 'sp-pnp-js';


@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CrearSolicitudComponent implements OnInit {
  @ViewChild('autoShownModalCTB') autoShownModalCTB: ModalDirective;
  isModalCTBShown = false;
  @ViewChild('autoShownModalCTS') autoShownModalCTS: ModalDirective;
  isModalShownCTS = false;
  colorTheme = 'theme-blue';
  bsConfig: Partial<BsDatepickerConfig>;
  minDate: Date;
  solpFormulario: FormGroup;
  ctbFormulario: FormGroup;
  ctbSubmitted = false;
  ctsFormulario: FormGroup;
  ctsSubmitted = false;
  tiposSolicitud: TipoSolicitud[] = [];
  empresas: Empresa[] = [];
  mostrarContratoMarco: boolean;
  usuarioActual: Usuario;
  usuarios: Usuario[] = [];
  nombreUsuario: string;
  paises: Pais[] = [];
  categorias: Categoria[] = [];
  subcategorias: Subcategoria[] = [];
  subcategoriaSeleccionada: Subcategoria;
  condicionesContractuales: CondicionContractual[] = [];
  loading: boolean;
  valorUsuarioPorDefecto: string = "Seleccione";
  dataUsuarios: Select2Data = [
    { value: 'Seleccione', label: 'Seleccione' }
  ];
  correoManager: string;
  emptyManager: boolean;
  contadorBienes = 0;
  contadorServicios = 0;
  cadenaJsonCondicionesContractuales: string;
  solicitudGuardar: Solicitud;
  idSolicitudGuardada: number;
  tituloModalCTB: string;
  indiceCTB: number;
  indiceCTBActualizar: number;
  condicionesTB: CondicionTecnicaBienes[] = [];
  condicionTB: CondicionTecnicaBienes;
  idCondicionTBGuardada: number;
  emptyCTB: boolean;
  mostrarAdjuntoCTB: boolean;
  rutaAdjuntoCTB: string;
  nombreAdjuntoCTB: string;

  tituloModalCTS: string;
  indiceCTS: number;
  indiceCTSActualizar: number;
  condicionesTS: CondicionTecnicaServicios[] = [];
  condicionTS: CondicionTecnicaServicios;
  idCondicionTSGuardada: number;
  emptyCTS: boolean;
  rutaAdjuntoCTS: string;
  nombreAdjuntoCTS: string;
  mostrarAdjuntoCTS: boolean;
  usuario: Usuario;
  textoBotonGuardarCTB: string;
  textoBotonGuardarCTS: String;
  modalRef: BsModalRef;
  diasEntregaDeseada: number;
  dataSourceCTB;
  columnsToDisplayCTB = ['codigo', 'descripcion', 'Acciones'];
  expandedElementCTB: CondicionTecnicaBienes | null;
  dataSourceCTS;
  columnsToDisplayCTS = ['codigo', 'descripcion', 'Acciones'];
  expandedElementCTS: CondicionTecnicaServicios | null;
  emptyasteriscoCTB: boolean;
  emptyasteriscoCTs: boolean;
  compraBienes: boolean;
  compraServicios: boolean;
  compraOrdenEstadistica: boolean;
  consecutivoActual: number;
  compradorId: number;
  codigoAriba: string;
  responsableProcesoEstado: responsableProceso[] = [];
  emptyNumeroOrdenEstadistica: boolean;
  fueSondeo: boolean;
  PermisosCreacion: boolean;
  grupos: Grupo[] = [];
  jsonCondicionesContractuales: string;
  valorcompra: boolean;
  mostrarDatosContables: boolean;
  FechaDeCreacion: any;
  fileString: any;
  arrayBuffer:any;
  cantidadErrorFile: number =0;
  ArrayErrorFile: any=[];
  ObjCTB = [];
  cantidadErrorFileCTS: number =0;
  ArrayErrorFileCTS: any=[];
  ObjCTS = [];
  mostrarFiltroBienes: boolean;
  mostrarFiltroServicios: boolean;
  ordenBienes: string;
  IdServicioBienes: string;
  nombreIdServicioBienes: string;
  datos: any=[];
  datosServicios: any =[];
  datosFiltradosBienes: any = [];
  datosFiltradosServicios: any = [];
  selectAll: boolean;
  disableIdServicio: boolean;
  disabledIdServicioServicios: boolean;
  mostrarTable: boolean;
  dataSourceDatos = new MatTableDataSource();
  dataSourceDatosServicios = new MatTableDataSource();
  dataSeleccionados = [];
  dataIdOrdenSeleccionados = [];
  dataIdOrdenSeleccionadosServicios = [];
  dataIdOrdenTotales = [];
  dataSeleccionadosServicios = [];
  arrayPrueba: any = [];
  dataIdServiciosBienes: any = [];
  dataIdeServiciosServicios: any = [];
  dataTotalIds: any = [];
  dataTieneIdServiciosBienes = [];
  dataTieneIdServiciosServicios = [];
  enviarCrm: boolean;
  displayedColumns: string[] = ["seleccionar","cliente", "OS", "idServicio", "nombreIdServicio"];
  displayedColumnsServicios: string[] = ["seleccionar","cliente", "OS", "idServicio", "nombreIdServicio"];
  cargaExcel: boolean;  //se debe habilitar para eliminar dato contables obligatorios en sondeo
  cargaExcelServicios: boolean;
  noMostrarOrdenEstadistica: boolean;

  clientBienes = new FormControl('');
  ordenServBienes = new FormControl('');
  idServBienes = new FormControl('');
  nombreIdServBienes = new FormControl('');
  filterValues = {
    Cliente: '',
    OS: '',
    IdServicio: '',
    Nombre_Servicio: ''
  };

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

  idClient: any;
  idServiceOrder: any;
  idService: any;
  tieneParams: boolean;
  enableCheckDatosContablesBienes: boolean;
  enableCheckDatosContablesServicios: boolean;
  setDatosContablesBienes: boolean;
  setDatosContablesServicios: boolean;
  cargaDesdeExcel: boolean;
  cargaDesdeExcelServicios: any;
  mostrarTableServicios: boolean;
  selectAllServicios: boolean;
  token: any;
  responsableSoporte: ResponsableSoporte[] = [];
  soporte: any;
  
  
  
  constructor(private formBuilder: FormBuilder, private servicio: SPServicio, private modalServicio: BsModalService, public toastr: ToastrManager, private router: Router, private spinner: NgxSpinnerService, private route: ActivatedRoute, private servicioCrm: CrmServicioService) {
    setTheme('bs4');
    // localStorage.setItem('id_token', '03f4673dd6b04790be91da8e57fddb52')
    this.PermisosCreacion = false;
    this.mostrarContratoMarco = false;
    this.spinner.hide();
    this.emptyCTB = true;
    this.emptyCTS = true;
    this.emptyManager = true;
    this.emptyasteriscoCTB = false;
    this.emptyasteriscoCTs = false;
    this.mostrarAdjuntoCTB = false;
    this.mostrarAdjuntoCTS = false;
    this.dataSourceCTB = new MatTableDataSource();
    this.dataSourceCTS = new MatTableDataSource();
    this.dataSourceCTB.data = this.condicionesTB;
    this.dataSourceCTS.data = this.condicionesTS;
    this.textoBotonGuardarCTB = "Guardar";
    this.textoBotonGuardarCTS = "Guardar";
    this.indiceCTB = 1;
    this.indiceCTS = 1;
    this.correoManager = "";
    this.compraBienes = false;
    this.compraServicios = false;
    this.compraOrdenEstadistica = false;
    this.emptyNumeroOrdenEstadistica = false;
    this.fueSondeo = false;
    this.valorcompra = false;
    this.mostrarDatosContables = false;
    this.mostrarFiltroBienes = false;
    this.mostrarFiltroServicios = false;
    this.selectAll = false;
    this.selectAllServicios = false;
    this.disableIdServicio = false;
    this.disabledIdServicioServicios = false;
    this.enableCheckDatosContablesBienes = false;
    this.enableCheckDatosContablesServicios = false
    this.setDatosContablesBienes = false;
    this.setDatosContablesServicios = false;
    this.enviarCrm = false;
    this.cargaDesdeExcel = false;    
    this.cargaExcel = false; //se debe habilitar para datos contables no obligatorios
    this.cargaExcelServicios = false;
    this.noMostrarOrdenEstadistica = false;
    
  }

  ngOnInit() {
    this.spinner.show();
    this.ObtenerUsuarioActual();
    this.aplicarTemaCalendario();
    // this.RecuperarUsuario();
    this.RegistrarFormularioSolp();
    this.RegistrarFormularioCTB();
    this.RegistrarFormularioCTS();
    this.ValidarTipoMonedaObligatoriaSiHayValorEstimadoCTB();
    this.ValidarTipoMonedaObligatoriaSiHayValorEstimadoCTS();
    //se reactivia AsignarRequeridosDatosContables para pedir datos siempre.
    //se debe mutear cuando los requeridos no sean obligatorios en sondeo.
    // this.AsignarRequeridosDatosContables();
    this.obtenerTiposSolicitud();
    this.obtenerQueryParams();
    this.ObtenerToken();
    this.obtenerResponsableSoporte();
  }

  ObtenerToken(){
    let token;
    this.servicioCrm.obtenerToken().then(
      (res)=>{        
        this.token = res["access_token"];
        // localStorage.setItem("id_token",token)
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
  }

  obtenerQueryParams() {
    // this.tieneParams = (this.route.snapshot.queryParamMap.has('idCliente') || this.route.snapshot.queryParamMap.has('idOrdenServicio') || this.route.snapshot.queryParamMap.has('idServicio'));
    this.idClient = this.route.snapshot.queryParamMap.get('idCliente');
    this.idServiceOrder = this.route.snapshot.queryParamMap.get('idOrdenServicio');
    this.idService = this.route.snapshot.queryParamMap.get('idServicio');
    this.verificarQueryParams();
  }

  verificarQueryParams() {
    // this.mostrarInformacion('Usted seleccionó el id de cliente: '+ this.idClient + ', el id de orden de servicio: '+ this.idServiceOrder+ ' , y el id de servicio: ' + this.idService);
    // alert('Usted seleccionó el id de cliente: '+ this.idClient + ', el id de orden de servicio: '+ this.idServiceOrder+ ' , y id de servicio: ' + this.idService)
    if(this.route.snapshot.queryParamMap.has('idCliente') || this.route.snapshot.queryParamMap.has('idOrdenServicio') || this.route.snapshot.queryParamMap.has('idServicio')) {
      this.tieneParams = true
    }
    else {
      this.tieneParams = false;
    }
  }

  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (respuesta) => {
        this.usuario = new Usuario(respuesta.Title, respuesta.email, respuesta.Id);
        this.nombreUsuario = this.usuario.nombre;
        sessionStorage.setItem('usuario', JSON.stringify(this.usuario));
        this.RecuperarUsuario();
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
      }
    )
  }

  obtenerResponsableSoporte() {
    this.servicio.obtenerResponsableSoporte().then(
      (respuesta) => {
        this.soporte = respuesta[0].ResponsableSoporte.EMail
        console.log(this.soporte);
      }
    )
  }

  showFilterBienes ($event) {
    if ($event.target.value === "ID de Servicios") {
      this.mostrarFiltroBienes = true;
      this.ctbFormulario.controls['numCicoCTB'].disable();
      this.idClient !== null ? this.ctbFormulario.controls['clienteBienes'].setValue(this.idClient) : this.ctbFormulario.controls['clienteBienes'].setValue('');
      this.idServiceOrder !== null ? this.ctbFormulario.controls['ordenBienes'].setValue(this.idServiceOrder) : this.ctbFormulario.controls['ordenBienes'].setValue('');
      this.idService !== null ? this.ctbFormulario.controls['IdServicioBienes'].setValue(this.idService) : this.ctbFormulario.controls['IdServicioBienes'].setValue('');
      this.idService !== null ? this.disableIdServicio = true : this.disableIdServicio = false
    }
    else {
      this.mostrarFiltroBienes = false;
      this.ctbFormulario.controls['numCicoCTB'].enable();
      this.ctbFormulario.controls['numCicoCTB'].setValue('');
    }
  }

  showFilterServicios ($event) {
    if ($event.target.value === "ID de Servicios") {
      this.mostrarFiltroServicios = true;
      this.ctsFormulario.controls['numCicoCTS'].disable();
      this.idClient !== null ? this.ctsFormulario.controls['clienteServicios'].setValue(this.idClient) : this.ctsFormulario.controls['clienteServicios'].setValue('');
      this.idServiceOrder !== null ? this.ctsFormulario.controls['ordenServicios'].setValue(this.idServiceOrder) : this.ctsFormulario.controls['ordenServicios'].setValue('');
      this.idService !== null ? this.ctsFormulario.controls['idServicio'].setValue(this.idService) : this.ctsFormulario.controls['idServicio'].setValue('');
      this.idService !== null ? this.disabledIdServicioServicios = false : this.disabledIdServicioServicios = true;
    }
    else {
      this.mostrarFiltroServicios = false;
      this.ctsFormulario.controls['numCicoCTS'].enable();
      this.ctsFormulario.controls['numCicoCTS'].setValue('');
    }
  }

  cargarFilterBienes() {
    if(this.solpFormulario.controls['tipoSolicitud'].value === 'ID de Servicios') {
      this.mostrarFiltroBienes = true;
    }
    else {
      this.mostrarFiltroBienes = false;
    }
  }

  cargarFilterServicios() {
    if(this.solpFormulario.controls['tipoSolicitud'].value === 'ID de Servicios') {
      this.mostrarFiltroServicios = true;
    }
    else {
      this.mostrarFiltroServicios = false;
    }
  }

  consultaDatos() {
    this.spinner.show();
    let parametros = {
      "idservicio": this.ctbFormulario.get('IdServicioBienes').value,
      "cliente": this.ctbFormulario.get('clienteBienes').value,
      "nombreservicio": this.ctbFormulario.get('nombreIdServicioBienes').value,
      "os": this.ctbFormulario.get('ordenBienes').value,
    }
    let objToken = {
      TipoConsulta: "Bodega",
      suscriptionKey: "03f4673dd6b04790be91da8e57fddb52",
      estado: "true"
    }
    let objTokenString = JSON.stringify(objToken);
    localStorage.setItem("id_token",objTokenString);
    this.servicioCrm.consultarDatosBodega(parametros).then(
      (respuesta) => {
        console.log(respuesta);
        this.mostrarTable = true;
        this.datos = respuesta;
        if (this.datos.length === 0) {
          this.dataSourceDatos.data = [];
          this.mostrarAdvertencia('Los criterios de búsqueda no coinciden con los datos almacenados en la bodega');
          this.spinner.hide();
          return false;
        }
        this.spinner.hide();
        this.dataSourceDatos.data = this.datos;
        this.dataSourceDatos.filterPredicate = this.createFilter();
        this.leerFiltros();
      }
    ).catch(
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    )
  }

  consultarDatosServicios() {
    this.spinner.show();
    let parametros = {
      "idservicio": this.ctsFormulario.get('idServicio').value,
      "cliente": this.ctsFormulario.get('clienteServicios').value,
      "nombreservicio": this.ctsFormulario.get('nombreIdServicio').value,
      "os": this.ctsFormulario.get('ordenServicios').value,
    }
    let objToken = {
      TipoConsulta: "Bodega",
      suscriptionKey: "03f4673dd6b04790be91da8e57fddb52",
      estado: "true"
    }
    let objTokenString = JSON.stringify(objToken);
    localStorage.setItem("id_token",objTokenString);
    this.servicioCrm.consultarDatosBodega(parametros).then(
      (respuesta) => {
        console.log(respuesta);
        this.mostrarTableServicios = true;
        this.datosServicios = respuesta;
        if (this.datosServicios.length === 0) {
          this.dataSourceDatosServicios.data = [];
          this.mostrarAdvertencia('Los criterios de búsqueda no coinciden con los datos almacenados en la bodega');
          this.spinner.hide();
          return false;
        }
        this.spinner.hide();
        this.dataSourceDatosServicios.data = this.datosServicios;
        this.dataSourceDatosServicios.filterPredicate = this.createFilterServicios();
        this.leerFiltrosServicios();
      }
    ).catch(
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    )
  }
  
  createFilter(): (data: any, filter: string) => boolean {
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

  seleccionarTodos($event) {
    $event.checked === true ? this.selectAll = true : this.selectAll = false;
    let cliente = this.clientBienes.value
    let idServ = this.idServBienes.value;
    let nombreServ = this.nombreIdServBienes.value;
    let os = this.ordenServBienes .value;
    if(this.selectAll === true && (cliente === '' && idServ === '' && nombreServ === '' && os === '' )) {
      this.dataSeleccionados = this.datos.map(x => {
        return x.IdServicio
      })
      this.dataIdOrdenSeleccionados = this.datos.map(x => {
        return x.IdServicio
        // return x.Orden_SAP
      })
    }
    else if (this.selectAll === true && (cliente !== '' || idServ !== '' || nombreServ !== '' || os !== '')) {
      this.datosFiltradosBienes = this.dataSourceDatos;
      this.dataSeleccionados = this.datosFiltradosBienes.filteredData.map(x => {
       return x.IdServicio
      })
      this.dataIdOrdenSeleccionados = this.datosFiltradosBienes.filteredData.map(x => {
        return x.IdServicio
        // return x.Orden_SAP
      })
      console.log(this.dataIdOrdenSeleccionados);
    }
    else {
      this.dataSeleccionados = [];
      this.dataIdOrdenSeleccionados = [];
    }
    this.ctbFormulario.controls['numCicoCTB'].setValue(this.dataSeleccionados.toString());
  }

  seleccionado($event, element) {
    let idServicioSeleccionado = $event.source.value
    console.log($event);
    console.log(element);
    if ($event.checked === true) {
      this.dataSeleccionados.push(idServicioSeleccionado);
      // this.dataIdOrdenSeleccionados.push(element.Orden_SAP);
      this.dataIdOrdenSeleccionados.push(element.IdServicio);
      console.log(this.dataIdOrdenSeleccionados);
    }
    else {
      let index = this.dataSeleccionados.findIndex(x => x === idServicioSeleccionado);
      let el = this.dataIdOrdenSeleccionados.findIndex(x => x === element.IdServicio)
      // let el = this.dataIdOrdenSeleccionados.findIndex(x => x === element.Orden_SAP)
      this.dataSeleccionados.splice(index, 1);
      this.dataIdOrdenSeleccionados.splice(el, 1);
      if(index === -1 ) {
        this.selectAll = false;
      }
    }
    this.ctbFormulario.controls['numCicoCTB'].setValue(this.dataSeleccionados.toString());
  }

  terminarSeleccion() {
    this.mostrarTable = false;
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
        return x.IdServicio
        // return x.Orden_SAP
      })
    }
    else if(this.selectAllServicios === true && (cliente !== '' || orden !== '' || idServicios !== '' || nombreServicios !== '')) {
     this.datosFiltradosServicios = this.dataSourceDatosServicios
      this.dataSeleccionadosServicios = this.datosFiltradosServicios.filteredData.map(x => {
        return x.IdServicio
      })
      this.dataIdOrdenSeleccionadosServicios = this.datosFiltradosServicios.filteredData.map(x => {
        return x.IdServicio
        // return x.Orden_SAP
      })
    }
    else {
      this.dataSeleccionadosServicios = [];
      this.dataIdOrdenSeleccionadosServicios = [];
    }
    this.ctsFormulario.controls['numCicoCTS'].setValue(this.dataSeleccionadosServicios.toString());
  }


  seleccionadoServicios($event, element) {
    let idServicioSeleccionado = $event.source.value
    if ($event.checked === true) {
      this.dataSeleccionadosServicios.push(idServicioSeleccionado);
      this.dataIdOrdenSeleccionadosServicios.push(element.IdServicio);
      // this.dataIdOrdenSeleccionadosServicios.push(element.Orden_SAP);
    }
    else {
      let index = this.dataSeleccionadosServicios.findIndex(x => x === idServicioSeleccionado);
      let el = this.dataIdOrdenSeleccionadosServicios.findIndex(x => x === element.IdServicio)
      // let el = this.dataIdOrdenSeleccionadosServicios.findIndex(x => x === element.Orden_SAP)
      this.dataSeleccionadosServicios.splice(index, 1);
      this.dataIdOrdenSeleccionadosServicios.splice(el, 1);
      if(index === -1) {
        this.selectAllServicios = false;
      }
    }
    this.ctsFormulario.controls['numCicoCTS'].setValue(this.dataSeleccionadosServicios.toString());
  }

  terminarSeleccionServicios() {
    this.mostrarTableServicios = false;
  }

  reservarDatosContablesBienes() {
    this.cargaDesdeExcel = false;
    this.limpiarFiltrosBienes();
    this.servicio.ObtenerCondicionesTecnicasBienes(this.idSolicitudGuardada).subscribe(
      (respuesta) => {
        if(respuesta.length > 0) {
          this.enableCheckDatosContablesBienes = true;
        }
        if(this.setDatosContablesBienes) {
          this.ctbFormulario.controls['cecoCTB'].setValue(respuesta[respuesta.length -1].costoInversion);
          this.ctbFormulario.controls['numCicoCTB'].setValue(respuesta[respuesta.length -1].numeroCostoInversion);
          this.ctbFormulario.controls['numCuentaCTB'].setValue(respuesta[respuesta.length -1].numeroCuenta);
          this.ctbFormulario.get('cecoCTB').value === 'ID de Servicios' ? this.ctbFormulario.controls['cecoCTB'].disable() : this.ctbFormulario.controls['cecoCTB'].enable();
        }
        else {
          this.ctbFormulario.controls['cecoCTB'].setValue('');
          this.ctbFormulario.controls['numCicoCTB'].setValue('');
          this.ctbFormulario.controls['numCuentaCTB'].setValue('');
          this.ctbFormulario.controls['cecoCTB'].enable();
        }
      }
    )
  }

  reservarDatosContablesServicios() {
    this.cargaDesdeExcel = false;
    this.limpiarFiltrosServicios();
    this.servicio.ObtenerCondicionesTecnicasServicios(this.idSolicitudGuardada).subscribe(
      (respuesta) => {
        if(respuesta.length > 0) {
          this.enableCheckDatosContablesServicios = true;
        }
        if(this.setDatosContablesServicios) {
          this.ctsFormulario.controls['cecoCTS'].setValue(respuesta[respuesta.length -1].costoInversion);
          this.ctsFormulario.controls['numCicoCTS'].setValue(respuesta[respuesta.length -1].numeroCostoInversion);
          this.ctsFormulario.controls['numCuentaCTS'].setValue(respuesta[respuesta.length -1].numeroCuenta);
          this.ctsFormulario.get('cecoCTS').value === 'ID de Servicios' ? this.ctsFormulario.controls['cecoCTS'].disable() : this.ctsFormulario.controls['cecoCTS'].enable();
        }
        else {
          this.ctsFormulario.controls['cecoCTS'].setValue('');
          this.ctsFormulario.controls['numCicoCTS'].setValue('');
          this.ctsFormulario.controls['numCuentaCTS'].setValue('');
          this.ctsFormulario.controls['cecoCTS'].enable();
        }
      }
    )
  }

  usarDatosContablesBienes($event) {
    $event.checked ? this.setDatosContablesBienes = true : this.setDatosContablesBienes = false;
    if(this.cargaDesdeExcel) {
      this.reservarDatosContablesBienesExcel();
    }
    else {
      this.reservarDatosContablesBienes();
    }
  }

  usarDatosContablesServicios($event) {
    $event.checked ? this.setDatosContablesServicios = true : this.setDatosContablesServicios = false;
    if(this.cargaDesdeExcelServicios) {
      this.reservarDatosContablesServiciosExcel();
    }
    else {
      this.reservarDatosContablesServicios();
    }
  }

  reservarDatosContablesBienesExcel() {
    this.servicio.ObtenerCondicionesTecnicasBienes(this.idSolicitudGuardada).subscribe(
      (respuesta) => {
        let id: any = this.idCondicionTBGuardada;
        let indexId: any = (parseInt(id) - 1);
        let indexArray;

        if(respuesta.length > 0 ) {
          let mapArray = respuesta.map(x => {
            return x.Id
          })
          indexArray = mapArray.findIndex(x => x === indexId)
          indexArray === -1 ? this.enableCheckDatosContablesBienes = false : this.enableCheckDatosContablesBienes = true;
        }
  
        if(this.setDatosContablesBienes && indexArray !== -1) {
          this.ctbFormulario.controls['cecoCTB'].setValue(respuesta[indexArray].costoInversion);
          this.ctbFormulario.controls['numCicoCTB'].setValue(respuesta[indexArray].numeroCostoInversion);
          this.ctbFormulario.controls['numCuentaCTB'].setValue(respuesta[indexArray].numeroCuenta);
        }
        else {
          this.ctbFormulario.controls['cecoCTB'].setValue(respuesta[indexArray + 1].costoInversion);
          this.ctbFormulario.controls['numCicoCTB'].setValue(respuesta[indexArray + 1].numeroCostoInversion);
          this.ctbFormulario.controls['numCuentaCTB'].setValue(respuesta[indexArray + 1].numeroCuenta);
        }
      }
    )
  }

  reservarDatosContablesServiciosExcel() {
    this.servicio.ObtenerCondicionesTecnicasServicios(this.idSolicitudGuardada).subscribe(
      (respuesta) => {
        let id: any = this.idCondicionTSGuardada;
        let indexId: any = (parseInt(id) - 1);
        let indexArray;

        if(respuesta.length > 0) {
          let mapArray = respuesta.map(x => {
            return x.Id
          })
          indexArray = mapArray.findIndex(x => x === indexId);
          indexArray !== -1 ? this.enableCheckDatosContablesServicios = true : this.enableCheckDatosContablesServicios = false;
        }

        if(this.setDatosContablesServicios && indexArray !== -1) {
          this.ctsFormulario.controls['cecoCTS'].setValue(respuesta[indexArray].costoInversion);
          this.ctsFormulario.controls['numCicoCTS'].setValue(respuesta[indexArray].numeroCostoInversion);
          this.ctsFormulario.controls['numCuentaCTS'].setValue(respuesta[indexArray].numeroCuenta);
        }
        else {
          this.ctsFormulario.controls['cecoCTS'].setValue(respuesta[indexArray + 1].costoInversion);
          this.ctsFormulario.controls['numCicoCTS'].setValue(respuesta[indexArray + 1].numeroCostoInversion);
          this.ctsFormulario.controls['numCuentaCTS'].setValue(respuesta[indexArray + 1].numeroCuenta);
        }
      }
    )
  }

  limpiarFiltrosBienes() {
    this.clientBienes.setValue('');
    this.ordenServBienes.setValue('');
    this.idServBienes.setValue('');
    this.nombreIdServBienes.setValue(''); 
    this.dataIdOrdenSeleccionados = [];
    this.dataSeleccionados = []; 
    this.selectAll = false
  }

  limpiarFiltrosServicios() {
    this.clientServicios.setValue('');
    this.ordenServServicios.setValue('');
    this.idServServicios.setValue('');
    this.nombreIdServServicios.setValue('');
    this.dataIdOrdenSeleccionadosServicios = [];
    this.dataSeleccionadosServicios = [];
    this.selectAllServicios = false
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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

  leerFiltros() {
    this.clientBienes.valueChanges
      .subscribe(
        (cliente) => {
          this.filterValues.Cliente = cliente;
          this.dataSourceDatos.filter = JSON.stringify(this.filterValues);
        }
      )

    this.ordenServBienes.valueChanges
      .subscribe(
        (ordenServicio) => {
          this.filterValues.OS = ordenServicio;
          this.dataSourceDatos.filter = JSON.stringify(this.filterValues);
        }
      )

    this.idServBienes.valueChanges
      .subscribe(
        id => {
          this.filterValues.IdServicio = id;
          this.dataSourceDatos.filter = JSON.stringify(this.filterValues);
        }
      )

    this.nombreIdServBienes.valueChanges
      .subscribe(
        nombre => {
          this.filterValues.Nombre_Servicio = nombre;
          this.dataSourceDatos.filter = JSON.stringify(this.filterValues);
        }
      )
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

  changeListener($event): void {
    this.leerArchivo($event.target);
  }

  validarLengthBusqueda() {
    let cliente = this.ctbFormulario.get('clienteBienes').value;
    let ordenBienes = this.ctbFormulario.get('ordenBienes').value;
    let IdServicioBienes = this.ctbFormulario.get('IdServicioBienes').value;
    let nombreIdServicioBienes = this.ctbFormulario.get('nombreIdServicioBienes').value;
   
    if(cliente === '' && ordenBienes === '' && IdServicioBienes === '' && nombreIdServicioBienes === '') {
      this.mostrarAdvertencia('Los campos están vacíos. No hay nada que consultar');
      return false;
    }
    if(cliente !== '' && cliente.length < 4) {
      this.mostrarAdvertencia('Se requieren al menos 4 caracteres si va a utilizar el campo "Cliente"');
      return false;
    }
    if(IdServicioBienes !== '' && IdServicioBienes.length < 3) {
      this.mostrarAdvertencia('Se requieren al menos 3 caracteres si va a utilizar el campo "Id de servicios"')
      return false;
    }
    if(nombreIdServicioBienes !== '' && nombreIdServicioBienes.length < 4) {
      this.mostrarAdvertencia('Se requieren al menos 4 caracteres si va a utilizar el campo "Nombre Id de servicio"')
      return false;
    }
    this.consultaDatos();
  }

 async consultarDatosContables() {
    let ordenEstadistica = this.solpFormulario.controls['compraOrdenEstadistica'].value;
    let bienes = await this.servicio.obtenerCtBienes(this.idSolicitudGuardada);
    let servicios = await this.servicio.obtenerCtServicios(this.idSolicitudGuardada);
    let datosContablesBienes = bienes.filter(x => {
      return  x.costoInversion !== '' || x.numeroCostoInversion !== '' || x.numeroCuenta !== ''
    })
    let datosContablesServicios = servicios.filter(x => {
      return x.costoInversion !== '' || x.numeroCostoInversion !== '' || x.numeroCuenta !== ''
    })
    let objDatosContablesBienes: any;
    let objDatosContablesServicios: any;
    if((ordenEstadistica === 'SI' || this.solpFormulario.controls['tipoSolicitud'].value === 'Sondeo') && datosContablesBienes.length > 0) {
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
    if((ordenEstadistica === 'SI' || this.solpFormulario.controls['tipoSolicitud'].value === 'Sondeo') && datosContablesServicios.length > 0) {
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
    if(clienteServicios === '' && ordenServicios === '' && idServicio === '' && nombreIdServicio === '') {
      this.mostrarAdvertencia('Los campos están vacíos. No hay nada que consultar');
      return false;
    }
    if(clienteServicios !== '' && clienteServicios.length < 4) {
      this.mostrarAdvertencia('Se requieren al menos 4 caracteres si va a utilizar el campo "Cliente"');
      return false;
    }
    if(idServicio !== '' && idServicio.length < 3) {
      this.mostrarAdvertencia('Se requieren al menos 3 caracteres si va a utilizar el campo "Id de servicios"')
      return false;
    }
    if(nombreIdServicio !== '' && nombreIdServicio.length < 4) {
      this.mostrarAdvertencia('Se requieren al menos 4 caracteres si va a utilizar el campo "Nombre Id de servicio"')
      return false;
    }
    this.consultarDatosServicios()
  }

  leerArchivo(inputValue: any): void {
    this.spinner.show();
    let file: File = inputValue.files[0];
    let ObjExtension=file.name.split(".");
    let extension = ObjExtension[ObjExtension.length-1];
    if (extension === "xlsx" || extension === "xls") {      
      readXlsxFile(file).then((rows) => {
        this.cantidadErrorFile=0;
        this.ArrayErrorFile=[];
        this.procesarArchivo(rows);
      }) 
    }
    else {
      this.spinner.hide();
      this.mostrarAdvertencia("la extensión del archivo no es la correcta");
    }       
  }

  async procesarArchivo(file) {

    if (file.length === 0) {
      this.mostrarError('El archivo se encuentra vacio');
      this.spinner.hide();
      return false;
    }
    else {
      if (file[0][0] === "Bienes") {
        if (file.length > 2) {
          this.ObjCTB = [];
          for (let i = 2; i < file.length; i++) {
            let row = file[i];
            let codigo = row[0];
            let filas = i;
            this.validarCodigosBrasilCTB(codigo, i);
            let obj = await this.ValidarVaciosCTB(row, i);
            if (obj != "") {
              this.ObjCTB.push(obj);
            }
          }
          if (this.cantidadErrorFile === 0) {
            this.cargaDesdeExcel = true;
            let contador = 0;
            this.ObjCTB.forEach(element => {
              this.servicio.agregarCondicionesTecnicasBienesExcel(element).then(
                (item: ItemAddResult) => {
                  // console.log(element.Codigo);
                  contador++;
                  if (this.ObjCTB.length === contador) {
                    this.servicio.ObtenerCondicionesTecnicasBienesExcel(this.idSolicitudGuardada).subscribe(
                      (res) => {
                        this.condicionesTB = CondicionTecnicaBienes.fromJsonList(res);
                        this.dataSourceCTB.data = this.condicionesTB;
                        this.emptyCTB = false;
                        this.modalRef.hide();
                        this.spinner.hide();
                      },
                      (error) => {

                      }
                    )
                  }
                }, err => {
                  this.mostrarError('Error en la creación de la condición técnica de bienes');
                  this.spinner.hide();
                }
              )
            });
          }
          else {
            this.spinner.hide();
          }
        }
        else {
          this.spinner.hide();
          this.mostrarError('No se encontraron registros para subir');
          return false;
        }
      }
      else {
        this.spinner.hide();
        this.mostrarError('El archivo no es el correcto, por favor verifiquelo o descargue la plantilla estándar');
        return false;
      }
    }
    if(file[1][0] !== 'Código de material' || file[1][1] !== 'Descripción del elemento a comprar' || file[1][2] !== 'Modelo' || file[1][3] !== 'Fabricante' || file[1][4] !== 'Cantidad' || file[1][5] !== 'Valor estimado' || file[1][6] !== 'Tipo de moneda' || file[1][7] !== 'Centro de costos/ Orden de inversión/ ID de Servicios' || file[1][8] !== 'Número de centro de costos/ Orden de inversión/ ID de Servicios' || file[1][9] !== 'Número de cuenta' || file[1][10] !== 'Comentarios') {
      this.mostrarError('La plantilla ha sido modificada. Por favor vuelva a descargarla');
      this.spinner.hide();
      this.cantidadErrorFile = 0;
      return false;
    }
  }

  limpiarArrayErrorFile() {
   this.modalRef.hide()
  }

  async ValidarVaciosCTB(row, i) {
    let valorcompraOrdenEstadistica = this.solpFormulario.controls["compraOrdenEstadistica"].value;
    let tipoSolicitud = this.solpFormulario.controls['tipoSolicitud'].value;
    let codigo = row[0];
    let descripcion = row[1];
    let modelo = row[2];
    let fabricante = row[3];
    let cantidad = row[4];
    let valorEstimado = row[5];
    let tipoMoneda = row[6];
    let costoInversion = row[7];
    let numeroCostoInversion = row[8];
    let numeroCuenta = row[9];
    let comentarios = row[10];
    let valorEstimadoStringBienes;
    let cantidadStringBienes;
    let numeroCuentaString;
    let testeadoBienes = true;
    let cantidadTesteadoBienes = true;
    let numeroCuentaTesteadoBienes = true;
    let idServicio;
    let IdOrdenServicio = [];
    let tieneIdServicio: boolean = false;
    if(numeroCostoInversion !== '' && numeroCostoInversion !== null && numeroCostoInversion !== undefined) {
      idServicio = numeroCostoInversion;
    }
    else {
      idServicio = '';
    }
    let params = {
      'idservicio': idServicio.toString().replace('.', ',')
    }
    if (valorEstimado !== "" && valorEstimado !== null) {
      valorEstimadoStringBienes = `${valorEstimado}`;
      let regexletras = /^[0-9.]*$/gm;
      testeadoBienes = regexletras.test(valorEstimadoStringBienes);
    }

    if (cantidad !== "" && cantidad !== null) {
      cantidadStringBienes = `${cantidad}`;
      let cantidadLetrasBienes = /^[0-9]*$/gm;
      cantidadTesteadoBienes = cantidadLetrasBienes.test(cantidadStringBienes);
    }
    

    if(numeroCuenta !== "" && numeroCuenta !== null) {
      numeroCuentaString = `${numeroCuenta}`;
      let numeroCuentaLetrasBienes = /^[0-9]*$/gm;
      numeroCuentaTesteadoBienes = numeroCuentaLetrasBienes.test(numeroCuentaString);
    }

                                          // Eliminar cuando datos contables no obligatorios 
    // if (valorcompraOrdenEstadistica === "NO" && (codigo === "" || codigo === null)) {

    //   if (descripcion === "" || descripcion === null) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo Descripción del elemento en la columna B fila " + (i + 1) });
    //   }
    //   if (modelo === "" || modelo === null) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo Modelo en la columna C fila " + (i + 1) })
    //   }
    //   if (fabricante === "" || fabricante === null) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo fabricante en la columna D fila " + (i + 1) })
    //   }
    //   if (cantidad === "" || cantidad === null) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo cantidad en la columna E fila " + (i + 1) })
    //   }
    //   if (cantidadTesteadoBienes === false) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo cantidad sólo admite números en la columna E fila " + (i + 1) })
    //   }
    //   if (testeadoBienes === false) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo valor estimado sólo admite números en la columna F fila " + (i + 1) })
    //   }
    //   if((valorEstimado !== "" && valorEstimado !== null) && (tipoMoneda === "" || tipoMoneda === null )) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({error: "El campo Tipo moneda es obligatorio cuando hay valor estimado en la columna G fila" + (i + 1) })
    //   }
    //   if((tipoMoneda !== null && tipoMoneda !== "") && (tipoMoneda !== 'ARS' && tipoMoneda !== 'BRL' && tipoMoneda !== 'CLP' && tipoMoneda !== 'COP' && tipoMoneda !== 'EUR' && tipoMoneda !== 'PEN' && tipoMoneda !== 'UF' && tipoMoneda !== 'USD')){
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({error: "El tipo de moneda no coincide con los valores permitidos. Por favor revise el campo en la columna G fila " + (i + 1) + " O descargue la plantilla estándar"})
    //   }
    //   if((costoInversion !== "" || costoInversion !== null) && (costoInversion !== 'Centro de costos' && costoInversion !== 'Orden de inversión' && costoInversion !== 'ID de Servicios')) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({error: "El valor del campo Centro de costos/ Orden de inversión no coincide con los permitidos en la columna H fila " + (i + 1) + " Por favor revise o descargue la plantilla estándar"})
    //   }
    //   if(costoInversion === 'ID de Servicios') {
    //     let respuestaServicioExcel = await this.servicioCrm.validarIdServiciosExcel(params);
    //     let idServicio = []
    //     let estado = respuestaServicioExcel.filter(x => {
    //       return x.Estado === 'No Existe';
    //     });
    //     if(estado.length > 0) {
    //       let cantidadIds = estado.map(x => {
    //         return x.IdServicio
    //       })
    //       idServicio.push(cantidadIds);
    //       this.cantidadErrorFile++;
    //       this.ArrayErrorFile.push({error: `El (los) id(s) de servicio ${idServicio.toString().replace(',', ', ')} no existe(n), por favor verifique la columna I fila ` + (i + 1)});
    //     }
    //     // else if(estado.length === 0) {
    //     //   this.ctbFormulario.controls['numCicoCTB'].disable();
    //     //   let idServicios = [];
    //     //   let datos = await this.servicioCrm.consultarDatosBodega(params);
    //     //   let ids = datos.map(x => {
    //     //     return x.Orden_SAP;
    //     //   });
    //     //   idServicios.push(ids);
    //     //   IdOrdenServicio !== undefined ? IdOrdenServicio = idServicios : IdOrdenServicio = [];
    //     //   tieneIdServicio = true;
    //     // }
    //   }
    //   if (costoInversion === "" || costoInversion === null || costoInversion === undefined) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo Centro de costos/ Orden de inversión en la columna H fila " + (i + 1) })
    //   }
    //   if (numeroCostoInversion === "" || numeroCostoInversion === null) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo número de centro de costos/ Orden de inversión en la columna I fila " + (i + 1) })
    //   }
    //   if(numeroCuentaTesteadoBienes === false) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({error: "El campo Número de cuenta sólo admite números en la columna J fila " + (i + 1)} )
    //   }
    //   if (numeroCuenta === "" || numeroCuenta === null) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo Número de cuenta en la columna J fila " + (i + 1) })
    //   }
    //   if (this.cantidadErrorFile === 0) {
    //     // valorEstimado=valorEstimado.toString().replace(/[;\\/:*?\"<>.|&']/g, "");
    //     let Obj = {
    //       Title: "Condición Técnicas Bienes " + new Date().toDateString(),
    //       SolicitudId: this.idSolicitudGuardada,
    //       Codigo: "",
    //       CodigoSondeo: "",
    //       Descripcion: descripcion.toString(),
    //       Modelo: modelo.toString(),
    //       Fabricante: fabricante.toString(),
    //       Cantidad: cantidad,
    //       CantidadSondeo: cantidad,
    //       ValorEstimado: valorEstimadoStringBienes,
    //       PrecioSondeo: valorEstimadoStringBienes,
    //       Comentarios: comentarios,
    //       TipoMoneda: tipoMoneda,
    //       MonedaSondeo: tipoMoneda,
    //       costoInversion: costoInversion.toString(),
    //       numeroCostoInversion: numeroCostoInversion.toString().replace('.', ','),
    //       numeroCuenta: numeroCuentaString,
    //       IdOrdenServicio: IdOrdenServicio.toString(),
    //       tieneIdServicio: tieneIdServicio,
    //       Orden: parseInt(i, 10)
    //     }
    //     return Obj;
    //   }
    //   else {
    //     setTimeout(() => {
    //       this.limpiarArrayErrorFile()
    //     },15000);
    //     return "";
    //   }
    // }
    // else if (valorcompraOrdenEstadistica === "NO" && (codigo !== "" || codigo !== null)) {

    //   if (descripcion === "" || descripcion === null) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo Descripción del elemento en la columna B fila " + (i + 1) });
    //   }
    //   if (modelo === "" || modelo === null) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo Modelo en la columna C fila " + (i + 1) })
    //   }
    //   if (fabricante === "" || fabricante === null) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo fabricante en la columna D fila " + (i + 1) })
    //   }
    //   if (cantidad === "" || cantidad === null) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo cantidad en la columna E fila " + (i + 1) })
    //   }
    //   if (cantidadTesteadoBienes === false) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo cantidad sólo admite números en la columna E fila " + (i + 1) })
    //   }
    //   if (testeadoBienes === false) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo valor estimado sólo admite números en la columna F fila " + (i + 1) })
    //   }
    //   if((valorEstimado !== "" && valorEstimado !== null) && (tipoMoneda === "" || tipoMoneda === null )) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({error: "El campo Tipo moneda es obligatorio cuando hay valor estimado en la columna G fila " + (i +1) })
    //   }
    //   if((tipoMoneda !== null && tipoMoneda !== "") && (tipoMoneda !== 'ARS' && tipoMoneda !== 'BRL' && tipoMoneda !== 'CLP' && tipoMoneda !== 'COP' && tipoMoneda !== 'EUR' && tipoMoneda !== 'PEN' && tipoMoneda !== 'UF' && tipoMoneda !== 'USD')){
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({error: "El tipo de moneda no coincide con los valores permitidos. Por favor revise el campo en la columna G fila " + (i + 1) + " O descargue la plantilla estándar"})
    //   }
    //   if((costoInversion !== "" || costoInversion !== null) && (costoInversion !== 'Centro de costos' && costoInversion !== 'Orden de inversión' && costoInversion !== 'ID de Servicios')) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({error: "El valor del campo Centro de costos/ Orden de inversión no coincide con los permitidos en la columna H fila " + (i + 1) + " Por favor revise o descargue la plantilla estándar"})
    //   }
    //   if(costoInversion === 'ID de Servicios') {
    //     let respuestaServicioExcel = await this.servicioCrm.validarIdServiciosExcel(params);
    //     let idServicio = []
    //     let estado = respuestaServicioExcel.filter(x => {
    //       return x.Estado === 'No Existe';
    //     });
    //     if(estado.length > 0) {
    //       let cantidadIds = estado.map(x => {
    //         return x.IdServicio
    //       })
    //       idServicio.push(cantidadIds);
    //       this.cantidadErrorFile++;
    //       this.ArrayErrorFile.push({error: `El (los) id(s) de servicio ${idServicio.toString().replace(',', ', ')} no existe(n), por favor verifique la columna I fila ` + (i + 1)});
    //     }
    //     // else if(estado.length === 0) {
    //     //   this.ctbFormulario.controls['numCicoCTB'].disable();
    //     //   let idServicios = [];
    //     //   let datos = await this.servicioCrm.consultarDatosBodega(params);
    //     //   console.log(datos);
    //     //   let ids = datos.map(x => {
    //     //     return x.Orden_SAP;
    //     //   });
    //     //   idServicios.push(ids);
    //     //   IdOrdenServicio !== undefined ? IdOrdenServicio = idServicios : IdOrdenServicio = [];
    //     //   tieneIdServicio = true;
    //     // }
    //   }
    //   if (costoInversion === "" || costoInversion === null || costoInversion === undefined) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo Centro de costos/ Orden de inversión en la columna H fila " + (i + 1) })
    //   }
    //   if (numeroCostoInversion === "" || numeroCostoInversion === null) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo número de centro de costos/ Orden de inversión en la columna I fila " + (i + 1) })
    //   }
    //   if(numeroCuentaTesteadoBienes === false) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({error: "El campo Número de cuenta sólo admite números en la columna J fila " + (i + 1)} )
    //   }
    //   if (numeroCuenta === "" || numeroCuenta === null) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo Número de cuenta en la columna J fila " + (i + 1) })
    //   }

    //   if (this.cantidadErrorFile === 0) {

    //     if(costoInversion === 'ID de Servicios') {
    //       this.ctbFormulario.controls['numCicoCTB'].disable();
    //       let idServicios = [];
    //       let datos = await this.servicioCrm.consultarDatosBodega(params);
    //       console.log(datos);
    //       let ids = datos.map(x => {
    //         return x.Orden_SAP;
    //       });
    //       idServicios.push(ids);
    //       IdOrdenServicio !== undefined ? IdOrdenServicio = idServicios : IdOrdenServicio = [];
    //       tieneIdServicio = true;
    //     }
    //     else {
    //       this.ctbFormulario.controls['numCicoCTB'].enable();
    //     }
    //     // valorEstimado=valorEstimado.toString().replace(/[;\\/:*?\"<>.|&']/g, "");
    //     let Obj = {
    //       Title: "Condición Técnicas Bienes " + new Date().toDateString(),
    //       SolicitudId: this.idSolicitudGuardada,
    //       Codigo: codigo.toString(),
    //       CodigoSondeo: codigo.toString(),
    //       Descripcion: descripcion.toString(),
    //       Modelo: modelo.toString(),
    //       Fabricante: fabricante.toString(),
    //       Cantidad: cantidad,
    //       CantidadSondeo: cantidad,
    //       ValorEstimado: valorEstimadoStringBienes,
    //       PrecioSondeo: valorEstimadoStringBienes,
    //       Comentarios: comentarios,
    //       TipoMoneda: tipoMoneda,
    //       MonedaSondeo: tipoMoneda,
    //       costoInversion: costoInversion.toString(),
    //       numeroCostoInversion: numeroCostoInversion.toString().replace('.', ','),
    //       numeroCuenta: numeroCuentaString,
    //       IdOrdenServicio: IdOrdenServicio.toString(),
    //       tieneIdServicio: tieneIdServicio,
    //       Orden: parseInt(i, 10)
    //     }
    //     return Obj;
    //   }
    //   else {
    //     setTimeout(() => {
    //       this.limpiarArrayErrorFile()
    //     }, 15000);
    //     return false;
    //   }
    // }
    // else if (valorcompraOrdenEstadistica === "SI" && (codigo === "" || codigo === null)) {

    //   if (descripcion === "" || descripcion === null) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo Descripción del elemento en la columna B fila " + (i + 1) });
    //   }
    //   if (modelo === "" || modelo === null) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo Modelo en la columna C fila " + (i + 1) })
    //   }
    //   if (fabricante === "" || fabricante === null) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo fabricante en la columna D fila " + (i + 1) })
    //   }
    //   if (cantidad === "" || cantidad === null) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo cantidad en la columna E fila " + (i + 1) })
    //   }
    //   if (cantidadTesteadoBienes === false) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo cantidad sólo admite números en la columna E fila " + (i + 1) })
    //   }
    //   if (testeadoBienes === false) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo valor estimado sólo admite números en la columna D fila " + (i + 1) })
    //   }
    //   if((valorEstimado !== "" && valorEstimado !== null) && (tipoMoneda === "" || tipoMoneda === null )) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({error: "El campo Tipo moneda es obligatorio cuando hay valor estimado en la columna G fila " + (i +1) })
    //   }
    //   if((tipoMoneda !== null && tipoMoneda !== "") && (tipoMoneda !== 'ARS' && tipoMoneda !== 'BRL' && tipoMoneda !== 'CLP' && tipoMoneda !== 'COP' && tipoMoneda !== 'EUR' && tipoMoneda !== 'PEN' && tipoMoneda !== 'UF' && tipoMoneda !== 'USD')){
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({error: "El tipo de moneda no coincide con los valores permitidos. Por favor revise el campo en la columna G fila " + (i + 1) + " O descargue la plantilla estándar"})
    //   }

    //   if (this.cantidadErrorFile === 0) {
    //     // valorEstimado=valorEstimado.toString().replace(/[;\\/:*?\"<>.|&']/g, "");
    //     let Obj = {
    //       Title: "Condición Técnicas Bienes " + new Date().toDateString(),
    //       SolicitudId: this.idSolicitudGuardada,
    //       Codigo: "",
    //       CodigoSondeo: "",
    //       Descripcion: descripcion.toString(),
    //       Modelo: modelo.toString(),
    //       Fabricante: fabricante.toString(),
    //       Cantidad: cantidad,
    //       CantidadSondeo: cantidad,
    //       ValorEstimado: valorEstimadoStringBienes,
    //       PrecioSondeo: valorEstimadoStringBienes,
    //       Comentarios: comentarios,
    //       TipoMoneda: tipoMoneda,
    //       MonedaSondeo: tipoMoneda,
    //       costoInversion: "",
    //       numeroCostoInversion: "",
    //       numeroCuenta: "",
    //       Orden: parseInt(i, 10)
    //     }
    //     return Obj;
    //   }
    //   else {
    //     setTimeout(() => {
    //       this.limpiarArrayErrorFile()
    //     }, 15000);
    //     return "";
    //   }
    // }
    // else {

    //   if (descripcion === "" || descripcion === null) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo Descripción del elemento en la columna B fila " + (i + 1) });
    //   }
    //   if (modelo === "" || modelo === null) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo Modelo en la columna C fila " + (i + 1) })
    //   }
    //   if (fabricante === "" || fabricante === null) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo fabricante en la columna D fila " + (i + 1) })
    //   }
    //   if (cantidad === "" || cantidad === null) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo cantidad en la columna E fila " + (i + 1) })
    //   }
    //   if (cantidadTesteadoBienes === false) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo cantidad sólo admite números en la columna E fila " + (i + 1) })
    //   }
    //   if (testeadoBienes === false) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({ error: "El campo valor estimado sólo admite números en la columna D fila " + (i + 1) })
    //   }
    //   if((valorEstimado !== "" && valorEstimado !== null) && (tipoMoneda === "" || tipoMoneda === null )) {
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({error: "El campo Tipo moneda es obligatorio cuando hay valor estimado en la columna G fila " + (i +1) })
    //   }
    //   if((tipoMoneda !== null && tipoMoneda !== "") && (tipoMoneda !== 'ARS' && tipoMoneda !== 'BRL' && tipoMoneda !== 'CLP' && tipoMoneda !== 'COP' && tipoMoneda !== 'EUR' && tipoMoneda !== 'PEN' && tipoMoneda !== 'UF' && tipoMoneda !== 'USD')){
    //     this.cantidadErrorFile++;
    //     this.ArrayErrorFile.push({error: "El tipo de moneda no coincide con los valores permitidos. Por favor revise el campo en la columna G fila " + (i + 1) + " O descargue la plantilla estándar"})
    //   }

    //   if (this.cantidadErrorFile === 0) {
    //     // valorEstimado=valorEstimado.toString().replace(/[;\\/:*?\"<>.|&']/g, "");
    //     let Obj = {
    //       Title: "Condición Técnicas Bienes " + new Date().toDateString(),
    //       SolicitudId: this.idSolicitudGuardada,
    //       Codigo: codigo.toString(),
    //       CodigoSondeo: codigo.toString(),
    //       Descripcion: descripcion.toString(),
    //       Modelo: modelo.toString(),
    //       Fabricante: fabricante.toString(),
    //       Cantidad: cantidad,
    //       CantidadSondeo: cantidad,
    //       ValorEstimado: valorEstimadoStringBienes,
    //       PrecioSondeo: valorEstimadoStringBienes,
    //       Comentarios: comentarios,
    //       TipoMoneda: tipoMoneda,
    //       MonedaSondeo: tipoMoneda,
    //       costoInversion: "",
    //       numeroCostoInversion: "",
    //       numeroCuenta: "",
    //       Orden: parseInt(i, 10)
    //     }
    //     return Obj;
    //   }
    //   else {
    //     setTimeout(() => {
    //       this.limpiarArrayErrorFile()
    //     }, 15000);
    //     return "";
    //   }
    // }                                       // Hasta aquí



    
                        //Hablitar cuando datas contables no obligatorios
    if (valorcompraOrdenEstadistica === "NO" && tipoSolicitud !== 'Sondeo' && (codigo === "" || codigo === null)) {

      if (descripcion === "" || descripcion === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo Descripción del elemento en la columna B fila " + (i + 1) });
      }
      if (modelo === "" || modelo === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo Modelo en la columna C fila " + (i + 1) })
      }
      if (fabricante === "" || fabricante === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo fabricante en la columna D fila " + (i + 1) })
      }
      if (cantidad === "" || cantidad === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo cantidad en la columna E fila " + (i + 1) })
      }
      if (cantidadTesteadoBienes === false) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo cantidad sólo admite números en la columna E fila " + (i + 1) })
      }
      if (testeadoBienes === false) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo valor estimado sólo admite números en la columna F fila " + (i + 1) })
      }
      if((valorEstimado !== "" && valorEstimado !== null) && (tipoMoneda === "" || tipoMoneda === null )) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({error: "El campo Tipo moneda es obligatorio cuando hay valor estimado en la columna G fila" + (i + 1) })
      }
      if((tipoMoneda !== null && tipoMoneda !== "") && (tipoMoneda !== 'ARS' && tipoMoneda !== 'BRL' && tipoMoneda !== 'CLP' && tipoMoneda !== 'COP' && tipoMoneda !== 'EUR' && tipoMoneda !== 'PEN' && tipoMoneda !== 'UF' && tipoMoneda !== 'USD')){
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({error: "El tipo de moneda no coincide con los valores permitidos. Por favor revise el campo en la columna G fila " + (i + 1) + " O descargue la plantilla estándar"})
      }
      if((costoInversion !== "" || costoInversion !== null) && (costoInversion !== 'Centro de costos' && costoInversion !== 'Orden de inversión' && costoInversion !== 'ID de Servicios')) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({error: "El valor del campo Centro de costos/ Orden de inversión/ ID de Servicios no coincide con los permitidos en la columna H fila " + (i + 1) + " Por favor revise o descargue la plantilla estándar"})
      }
    if((costoInversion === 'ID de Servicios') && (numeroCostoInversion !== "" && numeroCostoInversion !== null)) {
      let respuestaServicioExcel = await this.servicioCrm.validarIdServiciosExcel(params);
      let idServicio = []
      let estado = respuestaServicioExcel.filter(x => {
        return x.Estado === 'No Existe';
      });
      if(estado.length > 0) {
        let cantidadIds = estado.map(x => {
          return x.IdServicio
        })
        idServicio.push(cantidadIds);
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({error: `El (los) id(s) de servicio ${idServicio.toString().replace(',', ', ')} no existe(n), por favor verifique la columna I fila ` + (i + 1)});
      }
      // else if(estado.length === 0) {
      //   this.ctbFormulario.controls['numCicoCTB'].disable();
      //   let idServicios = [];
      //   let datos = await this.servicioCrm.consultarDatosBodega(params);
      //   console.log(datos);
      //   let ids = datos.map(x => {
      //     return x.Orden_SAP;
      //   });
      //   idServicios.push(ids);
      //   IdOrdenServicio !== undefined ? IdOrdenServicio = idServicios : IdOrdenServicio = [];
      //   tieneIdServicio = true;
      // }
    }
      if (costoInversion === "" || costoInversion === null || costoInversion === undefined) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo Centro de costos/ Orden de inversión/ ID de Servicios en la columna H fila " + (i + 1) })
      }
      if (numeroCostoInversion === "" || numeroCostoInversion === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo número de centro de costos/ Orden de inversión/ ID de Servicios en la columna I fila " + (i + 1) })
      }
      if(numeroCuentaTesteadoBienes === false) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({error: "El campo Número de cuenta sólo admite números en la columna J fila " + (i + 1)} )
      }
      if (numeroCuenta === "" || numeroCuenta === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo Número de cuenta en la columna J fila " + (i + 1) })
      }
      if (this.cantidadErrorFile === 0) {
        if(costoInversion === 'ID de Servicios') {
                // this.ctbFormulario.controls['numCicoCTB'].disable();
                let idServicios = [];
                let datos = await this.servicioCrm.consultarDatosBodega(params);
                console.log(datos);
                let ids = datos.map(x => {
                  return x.Orden_SAP;
                });
                idServicios.push(ids);
                IdOrdenServicio !== undefined ? IdOrdenServicio = idServicios : IdOrdenServicio = [];
                tieneIdServicio = true;
              }
              // else {
              //   this.ctbFormulario.controls['numCicoCTB'].enable();
              // }
        // valorEstimado=valorEstimado.toString().replace(/[;\\/:*?\"<>.|&']/g, "");
        let Obj = {
          Title: "Condición Técnicas Bienes " + new Date().toDateString(),
          SolicitudId: this.idSolicitudGuardada,
          Codigo: "",
          CodigoSondeo: "",
          Descripcion: descripcion.toString(),
          Modelo: modelo.toString(),
          Fabricante: fabricante.toString(),
          Cantidad: cantidad,
          CantidadSondeo: cantidad,
          ValorEstimado: valorEstimadoStringBienes,
          PrecioSondeo: valorEstimadoStringBienes,
          Comentarios: comentarios,
          TipoMoneda: tipoMoneda,
          MonedaSondeo: tipoMoneda,
           costoInversion: costoInversion.toString(),
          numeroCostoInversion: numeroCostoInversion.toString().replace('.', ','),
          numeroCuenta: numeroCuentaString,
          IdOrdenServicio: IdOrdenServicio.toString(),
          tieneIdServicio: tieneIdServicio,
          Orden: parseInt(i, 10)
        }
        return Obj;
      }
      else {
        setTimeout(() => {
          this.limpiarArrayErrorFile()
        },15000);
        return "";
      }
    }
    else if (valorcompraOrdenEstadistica === "NO" && tipoSolicitud !== 'Sondeo' && (codigo !== "" || codigo !== null)) {

      if (descripcion === "" || descripcion === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo Descripción del elemento en la columna B fila " + (i + 1) });
      }
      if (modelo === "" || modelo === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo Modelo en la columna C fila " + (i + 1) })
      }
      if (fabricante === "" || fabricante === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo fabricante en la columna D fila " + (i + 1) })
      }
      if (cantidad === "" || cantidad === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo cantidad en la columna E fila " + (i + 1) })
      }
      if (cantidadTesteadoBienes === false) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo cantidad sólo admite números en la columna E fila " + (i + 1) })
      }
      if (testeadoBienes === false) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo valor estimado sólo admite números en la columna F fila " + (i + 1) })
      }
      if ((valorEstimado !== "" && valorEstimado !== null) && (tipoMoneda === "" || tipoMoneda === null)) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo Tipo moneda es obligatorio cuando hay valor estimado en la columna G fila " + (i + 1) })
      }
      if ((tipoMoneda !== null && tipoMoneda !== "") && (tipoMoneda !== 'ARS' && tipoMoneda !== 'BRL' && tipoMoneda !== 'CLP' && tipoMoneda !== 'COP' && tipoMoneda !== 'EUR' && tipoMoneda !== 'PEN' && tipoMoneda !== 'UF' && tipoMoneda !== 'USD')) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El tipo de moneda no coincide con los valores permitidos. Por favor revise el campo en la columna G fila " + (i + 1) + " O descargue la plantilla estándar" })
      }
      if ((costoInversion !== "" || costoInversion !== null) && (costoInversion !== 'Centro de costos' && costoInversion !== 'Orden de inversión' && costoInversion !== 'ID de Servicios')) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El valor del campo Centro de costos/ Orden de inversión/ ID de Servicios no coincide con los permitidos en la columna H fila " + (i + 1) + " Por favor revise o descargue la plantilla estándar" })
      }
      if ((costoInversion === 'ID de Servicios') && (numeroCostoInversion !== "" && numeroCostoInversion !== null)) {
        let respuestaServicioExcel = await this.servicioCrm.validarIdServiciosExcel(params);
        let idServicio = []
        let estado = respuestaServicioExcel.filter(x => {
          return x.Estado === 'No Existe';
        });
        if (estado.length > 0) {
          let cantidadIds = estado.map(x => {
            return x.IdServicio
          })
          idServicio.push(cantidadIds);
          this.cantidadErrorFile++;
          this.ArrayErrorFile.push({ error: `El (los) id(s) de servicio ${idServicio.toString().replace(',', ', ')} no existe(n), por favor verifique la columna I fila ` + (i + 1) });
        }
        // else if(estado.length === 0) {
        //   this.ctbFormulario.controls['numCicoCTB'].disable();
        //   let idServicios = [];
        //   let datos = await this.servicioCrm.consultarDatosBodega(params);
        //   console.log(datos);
        //   let ids = datos.map(x => {
        //     return x.Orden_SAP;
        //   });
        //   idServicios.push(ids);
        //   IdOrdenServicio !== undefined ? IdOrdenServicio = idServicios : IdOrdenServicio = [];
        //   tieneIdServicio = true;
        // }
      }
      if (costoInversion === "" || costoInversion === null || costoInversion === undefined) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo Centro de costos/ Orden de inversión/ ID de Servicios en la columna H fila " + (i + 1) })
      }
      if (numeroCostoInversion === "" || numeroCostoInversion === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo número de centro de costos/ Orden de inversión/ ID de Servicios en la columna I fila " + (i + 1) })
      }
      if (numeroCuentaTesteadoBienes === false) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo Número de cuenta sólo admite números en la columna J fila " + (i + 1) })
      }
      if (numeroCuenta === "" || numeroCuenta === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo Número de cuenta en la columna J fila " + (i + 1) })
      }

      if (this.cantidadErrorFile === 0) {
        if (costoInversion === 'ID de Servicios') {
          // this.ctbFormulario.controls['numCicoCTB'].disable();
          let idServicios = [];
          let datos = await this.servicioCrm.consultarDatosBodega(params);
          console.log(datos);
          let ids = datos.map(x => {
            return x.Orden_SAP;
          });
          idServicios.push(ids);
          IdOrdenServicio !== undefined ? IdOrdenServicio = idServicios : IdOrdenServicio = [];
          tieneIdServicio = true;
        }
        // else {
        //   this.ctbFormulario.controls['numCicoCTB'].enable();
        // }
        // valorEstimado=valorEstimado.toString().replace(/[;\\/:*?\"<>.|&']/g, "");
        let Obj = {
          Title: "Condición Técnicas Bienes " + new Date().toDateString(),
          SolicitudId: this.idSolicitudGuardada,
          Codigo: codigo.toString(),
          CodigoSondeo: codigo.toString(),
          Descripcion: descripcion.toString(),
          Modelo: modelo.toString(),
          Fabricante: fabricante.toString(),
          Cantidad: cantidad,
          CantidadSondeo: cantidad,
          ValorEstimado: valorEstimadoStringBienes,
          PrecioSondeo: valorEstimadoStringBienes,
          Comentarios: comentarios,
          TipoMoneda: tipoMoneda,
          MonedaSondeo: tipoMoneda,
          costoInversion: costoInversion.toString(),
          numeroCostoInversion: numeroCostoInversion.toString().replace('.', ','),
          numeroCuenta: numeroCuentaString,
          IdOrdenServicio: IdOrdenServicio.toString(),
          tieneIdServicio: tieneIdServicio,
          Orden: parseInt(i, 10)
        }
        return Obj;
      }
      else {
        setTimeout(() => {
          this.limpiarArrayErrorFile()
        }, 15000);
        return "";
      }
    }
    else if (valorcompraOrdenEstadistica === 'NO' && tipoSolicitud === 'Sondeo' && (codigo !== "" && codigo !== null)) {
      if (descripcion === "" || descripcion === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo Descripción del elemento en la columna B fila " + (i + 1) });
      }
      if (modelo === "" || modelo === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo Modelo en la columna C fila " + (i + 1) })
      }
      if (fabricante === "" || fabricante === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo fabricante en la columna D fila " + (i + 1) })
      }
      if (cantidad === "" || cantidad === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo cantidad en la columna E fila " + (i + 1) })
      }
      if (cantidadTesteadoBienes === false) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo cantidad sólo admite números en la columna E fila " + (i + 1) })
      }
      if (testeadoBienes === false) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo valor estimado sólo admite números en la columna D fila " + (i + 1) })
      }
      if((valorEstimado !== "" && valorEstimado !== null) && (tipoMoneda === "" || tipoMoneda === null )) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({error: "El campo Tipo moneda es obligatorio cuando hay valor estimado en la columna G fila " + (i +1) })
      }
      if((tipoMoneda !== null && tipoMoneda !== "") && (tipoMoneda !== 'ARS' && tipoMoneda !== 'BRL' && tipoMoneda !== 'CLP' && tipoMoneda !== 'COP' && tipoMoneda !== 'EUR' && tipoMoneda !== 'PEN' && tipoMoneda !== 'UF' && tipoMoneda !== 'USD')){
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({error: "El tipo de moneda no coincide con los valores permitidos. Por favor revise el campo en la columna G fila " + (i + 1) + " O descargue la plantilla estándar"})
      }

      if (this.cantidadErrorFile === 0) {
        // valorEstimado=valorEstimado.toString().replace(/[;\\/:*?\"<>.|&']/g, "");
        let Obj = {
          Title: "Condición Técnicas Bienes " + new Date().toDateString(),
          SolicitudId: this.idSolicitudGuardada,
          Codigo: codigo.toString(),
          CodigoSondeo: codigo.toString(),
          Descripcion: descripcion.toString(),
          Modelo: modelo.toString(),
          Fabricante: fabricante.toString(),
          Cantidad: cantidad,
          CantidadSondeo: cantidad,
          ValorEstimado: valorEstimadoStringBienes,
          PrecioSondeo: valorEstimadoStringBienes,
          Comentarios: comentarios,
          TipoMoneda: tipoMoneda,
          MonedaSondeo: tipoMoneda,
          costoInversion: "",
          numeroCostoInversion: "",
          numeroCuenta: "",
          Orden: parseInt(i, 10)
        }
        return Obj;
      }
      else {
        setTimeout(() => {
          this.limpiarArrayErrorFile()
        }, 15000);
        return "";
      } 
    }

    else if (valorcompraOrdenEstadistica === 'NO' && tipoSolicitud === 'Sondeo' && (codigo === "" || codigo === null)) {
      if (descripcion === "" || descripcion === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo Descripción del elemento en la columna B fila " + (i + 1) });
      }
      if (modelo === "" || modelo === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo Modelo en la columna C fila " + (i + 1) })
      }
      if (fabricante === "" || fabricante === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo fabricante en la columna D fila " + (i + 1) })
      }
      if (cantidad === "" || cantidad === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo cantidad en la columna E fila " + (i + 1) })
      }
      if (cantidadTesteadoBienes === false) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo cantidad sólo admite números en la columna E fila " + (i + 1) })
      }
      if (testeadoBienes === false) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo valor estimado sólo admite números en la columna D fila " + (i + 1) })
      }
      if((valorEstimado !== "" && valorEstimado !== null) && (tipoMoneda === "" || tipoMoneda === null )) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({error: "El campo Tipo moneda es obligatorio cuando hay valor estimado en la columna G fila " + (i +1) })
      }
      if((tipoMoneda !== null && tipoMoneda !== "") && (tipoMoneda !== 'ARS' && tipoMoneda !== 'BRL' && tipoMoneda !== 'CLP' && tipoMoneda !== 'COP' && tipoMoneda !== 'EUR' && tipoMoneda !== 'PEN' && tipoMoneda !== 'UF' && tipoMoneda !== 'USD')){
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({error: "El tipo de moneda no coincide con los valores permitidos. Por favor revise el campo en la columna G fila " + (i + 1) + " O descargue la plantilla estándar"})
      }

      if (this.cantidadErrorFile === 0) {
        // valorEstimado=valorEstimado.toString().replace(/[;\\/:*?\"<>.|&']/g, "");
        let Obj = {
          Title: "Condición Técnicas Bienes " + new Date().toDateString(),
          SolicitudId: this.idSolicitudGuardada,
          Codigo: "",
          CodigoSondeo: "",
          Descripcion: descripcion.toString(),
          Modelo: modelo.toString(),
          Fabricante: fabricante.toString(),
          Cantidad: cantidad,
          CantidadSondeo: cantidad,
          ValorEstimado: valorEstimadoStringBienes,
          PrecioSondeo: valorEstimadoStringBienes,
          Comentarios: comentarios,
          TipoMoneda: tipoMoneda,
          MonedaSondeo: tipoMoneda,
          costoInversion: "",
          numeroCostoInversion: "",
          numeroCuenta: "",
          Orden: parseInt(i, 10)
        }
        return Obj;
      }
      else {
        setTimeout(() => {
          this.limpiarArrayErrorFile()
        }, 15000);
        return "";
      } 
    }
    else if (valorcompraOrdenEstadistica === "SI" && (codigo === "" || codigo === null)) {

      if (descripcion === "" || descripcion === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo Descripción del elemento en la columna B fila " + (i + 1) });
      }
      if (modelo === "" || modelo === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo Modelo en la columna C fila " + (i + 1) })
      }
      if (fabricante === "" || fabricante === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo fabricante en la columna D fila " + (i + 1) })
      }
      if (cantidad === "" || cantidad === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo cantidad en la columna E fila " + (i + 1) })
      }
      if (cantidadTesteadoBienes === false) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo cantidad sólo admite números en la columna E fila " + (i + 1) })
      }
      if (testeadoBienes === false) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo valor estimado sólo admite números en la columna D fila " + (i + 1) })
      }
      if((valorEstimado !== "" && valorEstimado !== null) && (tipoMoneda === "" || tipoMoneda === null )) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({error: "El campo Tipo moneda es obligatorio cuando hay valor estimado en la columna G fila " + (i +1) })
      }
      if((tipoMoneda !== null && tipoMoneda !== "") && (tipoMoneda !== 'ARS' && tipoMoneda !== 'BRL' && tipoMoneda !== 'CLP' && tipoMoneda !== 'COP' && tipoMoneda !== 'EUR' && tipoMoneda !== 'PEN' && tipoMoneda !== 'UF' && tipoMoneda !== 'USD')){
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({error: "El tipo de moneda no coincide con los valores permitidos. Por favor revise el campo en la columna G fila " + (i + 1) + " O descargue la plantilla estándar"})
      }

      if (this.cantidadErrorFile === 0) {
        // valorEstimado=valorEstimado.toString().replace(/[;\\/:*?\"<>.|&']/g, "");
        let Obj = {
          Title: "Condición Técnicas Bienes " + new Date().toDateString(),
          SolicitudId: this.idSolicitudGuardada,
          Codigo: "",
          CodigoSondeo: "",
          Descripcion: descripcion.toString(),
          Modelo: modelo.toString(),
          Fabricante: fabricante.toString(),
          Cantidad: cantidad,
          CantidadSondeo: cantidad,
          ValorEstimado: valorEstimadoStringBienes,
          PrecioSondeo: valorEstimadoStringBienes,
          Comentarios: comentarios,
          TipoMoneda: tipoMoneda,
          MonedaSondeo: tipoMoneda,
          costoInversion: "",
          numeroCostoInversion: "",
          numeroCuenta: "",
          Orden: parseInt(i, 10)
        }
        return Obj;
      }
      else {
        setTimeout(() => {
          this.limpiarArrayErrorFile()
        }, 15000);
        return "";
      }
    }
    else {

      if (descripcion === "" || descripcion === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo Descripción del elemento en la columna B fila " + (i + 1) });
      }
      if (modelo === "" || modelo === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo Modelo en la columna C fila " + (i + 1) })
      }
      if (fabricante === "" || fabricante === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo fabricante en la columna D fila " + (i + 1) })
      }
      if (cantidad === "" || cantidad === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo cantidad en la columna E fila " + (i + 1) })
      }
      if (cantidadTesteadoBienes === false) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo cantidad sólo admite números en la columna E fila " + (i + 1) })
      }
      if (testeadoBienes === false) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo valor estimado sólo admite números en la columna D fila " + (i + 1) })
      }
      if((valorEstimado !== "" && valorEstimado !== null) && (tipoMoneda === "" || tipoMoneda === null )) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({error: "El campo Tipo moneda es obligatorio cuando hay valor estimado en la columna G fila " + (i +1) })
      }
      if((tipoMoneda !== null && tipoMoneda !== "") && (tipoMoneda !== 'ARS' && tipoMoneda !== 'BRL' && tipoMoneda !== 'CLP' && tipoMoneda !== 'COP' && tipoMoneda !== 'EUR' && tipoMoneda !== 'PEN' && tipoMoneda !== 'UF' && tipoMoneda !== 'USD')){
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({error: "El tipo de moneda no coincide con los valores permitidos. Por favor revise el campo en la columna G fila " + (i + 1) + " O descargue la plantilla estándar"})
      }

      if (this.cantidadErrorFile === 0) {
        // valorEstimado=valorEstimado.toString().replace(/[;\\/:*?\"<>.|&']/g, "");
        let Obj = {
          Title: "Condición Técnicas Bienes " + new Date().toDateString(),
          SolicitudId: this.idSolicitudGuardada,
          Codigo: codigo.toString(),
          CodigoSondeo: codigo.toString(),
          Descripcion: descripcion.toString(),
          Modelo: modelo.toString(),
          Fabricante: fabricante.toString(),
          Cantidad: cantidad,
          CantidadSondeo: cantidad,
          ValorEstimado: valorEstimadoStringBienes,
          PrecioSondeo: valorEstimadoStringBienes,
          Comentarios: comentarios,
          TipoMoneda: tipoMoneda,
          MonedaSondeo: tipoMoneda,
          costoInversion: "",
          numeroCostoInversion: "",
          numeroCuenta: "",
          Orden: parseInt(i, 10)
        }
        return Obj;
      }
      else {
        setTimeout(() => {
          this.limpiarArrayErrorFile()
        }, 15000);
        return "";
      }
    }              // Hasta aquí
  } 

  changeListenerServicios($event): void {
    this.leerArchivoServicios($event.target);
    // this.limpiarArrayErrorFileCTS();
  }

leerArchivoServicios(inputValue: any): void {
    this.spinner.show();
    let file: File = inputValue.files[0];
    let ObjExtension=file.name.split(".");
    let extension = ObjExtension[ObjExtension.length-1];
    if (extension === "xlsx" || extension === "xls") {      
      readXlsxFile(file).then((rows) => {
        this.cantidadErrorFileCTS=0;
        this.ArrayErrorFileCTS=[];
        this.procesarArchivoServicios(rows);
      }) 
    }
    else {
      this.spinner.hide();
      this.mostrarAdvertencia("la extensión del archivo no es la correcta");
    }
}

  async procesarArchivoServicios(file) {

    if (file.length === 0) {
      this.mostrarError('El archivo se encuentra vacio');
      this.spinner.hide();
      return false;
    }
    else {
      if (file[0][0] === "Servicios") {
        if (file.length > 2) {
          this.ObjCTS = [];
          for (let i = 2; i < file.length; i++) {
            let row = file[i];
            let codigo = row[0];
            let filas = i;
            this.validarCodigosBrasilCTS(codigo, i);
            let obj = await this.ValidarVaciosCTS(row, i);
            if (obj != "") {
              this.ObjCTS.push(obj);
            }
          }
          if (this.cantidadErrorFileCTS === 0) {
            this.cargaDesdeExcelServicios = true;
            let contador = 0;
            this.ObjCTS.forEach(element => {
              this.servicio.agregarCondicionesTecnicasServiciosExcel(element).then(
                (item: ItemAddResult) => {
                  contador++;
                  if (this.ObjCTS.length === contador) {
                    this.servicio.ObtenerCondicionesTecnicasServiciosExcel(this.idSolicitudGuardada).subscribe(
                      (res) => {
                        this.condicionesTS = CondicionTecnicaServicios.fromJsonList(res);
                        this.dataSourceCTS.data = this.condicionesTS;
                        this.emptyCTS = false;
                        this.modalRef.hide();
                        this.spinner.hide();
                      },
                      (error) => {

                      }
                    )
                  }
                }, err => {
                  this.mostrarError('Error en la creación de la condición técnica de servicios');
                  this.spinner.hide();
                }
              )
            });
          }
          else {
            this.spinner.hide();
          }
        }
        else {
          this.spinner.hide();
          this.mostrarError('No se encontraron registros para subir');
          return false;
        }
      }
      else {
        this.spinner.hide();
        this.mostrarError('El archivo no es el correcto, por favor verifiquelo o descargue la plantilla estándar');
        return false;
      }
    }
    if (file[1][0] !== 'Código de material' || file[1][1] !== 'Descripción del elemento a comprar' || file[1][2] !== 'Cantidad' || file[1][3] !== 'Valor estimado' || file[1][4] !== 'Tipo de moneda' || file[1][5] !== 'Centro de costos/ Orden de inversión/ ID de Servicios' || file[1][6] !== 'Número centro de costos/ Orden de inversión/ ID de Servicios' || file[1][7] !== 'Número de cuenta' || file[1][8] !== 'Comentarios') {
      this.mostrarError('La plantilla ha sido modificada. Por favor vuelva a descargarla');
      this.spinner.hide();
      this.cantidadErrorFileCTS = 0;
      return false;
    }
  }

limpiarArrayErrorFileCTS() {
  this.modalRef.hide()
}

async ValidarVaciosCTS(row: any, i: number) {
  let valorcompraOrdenEstadistica = this.solpFormulario.controls["compraOrdenEstadistica"].value;
  let tipoSolicitud = this.solpFormulario.controls['tipoSolicitud'].value;
  let codigo = row[0];
  let descripcion = row[1];
  let cantidad = row[2];
  let valorEstimado = row[3];
  let tipoMoneda = row[4];    
  let costoInversion = row[5];
  let numeroCostoInversion = row[6];
  let numeroCuenta = row[7];
  let comentarios = row[8];
  let valorEstimadoString;
  let cantidadString;
  let numeroCuentaStringCTS;
  let testeado = true;
  let cantidadTesteadoServicios = true;
  let numeroCuentaTesteadoServicios = true;
  let idServicio;
  let IdOrdenServicio = [];
  let tieneIdServicio: boolean = false;
  if(numeroCostoInversion !== '' && numeroCostoInversion !== null && numeroCostoInversion !== undefined) {
    idServicio = numeroCostoInversion;
  }
  else {
    idServicio = '';
  }
  let params = {
    'idservicio': idServicio.toString().replace('.', ',')
  }
  
  if(valorEstimado !== "" && valorEstimado !== null){
    let regularExp = /[.,]/g
    // valorEstimado.replace(regularExp, "");
    valorEstimadoString = `${valorEstimado}`
    valorEstimadoString.replace(regularExp, "")
    let regexletras = /^[0-9.]*$/gm;
    testeado = regexletras.test(valorEstimadoString);
  }
 

  if(cantidad !== "" && cantidad !== null){
    cantidadString = `${cantidad}`
    let cantidadLetras = /^[0-9]*$/gm;
    cantidadTesteadoServicios = cantidadLetras.test(cantidadString);
  } 
  

  if(numeroCuenta !== "" && numeroCuenta !== null) {
    numeroCuentaStringCTS = `${numeroCuenta}`
    let numeroCuentaLetrasCTS = /^[0-9]*$/gm;
    numeroCuentaTesteadoServicios = numeroCuentaLetrasCTS.test(numeroCuentaStringCTS);
  
  }

                  // Eliminar cuando datos contables no obligatorios
//   if(valorcompraOrdenEstadistica === "NO" && (codigo === "" || codigo === null)) {
    
//     if (descripcion === "" || descripcion === null) {
//       this.cantidadErrorFileCTS++;
//       this.ArrayErrorFileCTS.push({error:"El campo Descripción del elemento en la columna B fila "+ (i+1)});
//     }
//     if(cantidad === "" || cantidad === null){
//       this.cantidadErrorFileCTS++;
//       this.ArrayErrorFileCTS.push({error:"El campo Cantidad en la columna C fila "+ (i+1)})
//     }
//     if(cantidadTesteadoServicios === false){
//       this.cantidadErrorFileCTS++;
//       this.ArrayErrorFileCTS.push({error:"El campo Cantidad sólo admite números en la columna C fila "+ (i+1)})
//     }
//     if(testeado === false){
//       this.cantidadErrorFileCTS++;
//       this.ArrayErrorFileCTS.push({error:"El campo valor estimado sólo admite números en la columna D fila "+ (i+1)})
//     }
//     if((valorEstimado !== "" && valorEstimado !== null) && (tipoMoneda === "" || tipoMoneda === null )) {
//       this.cantidadErrorFileCTS++;
//       this.ArrayErrorFileCTS.push({error: "El campo Tipo moneda es obligatorio cuando hay valor estimado en la columna E fila " + (i +1) })
//     }
//     if((tipoMoneda !== null && tipoMoneda !== "") && (tipoMoneda !== 'ARS' && tipoMoneda !== 'BRL' && tipoMoneda !== 'CLP' && tipoMoneda !== 'COP' && tipoMoneda !== 'EUR' && tipoMoneda !== 'PEN' && tipoMoneda !== 'UF' && tipoMoneda !== 'USD')){
//       this.cantidadErrorFileCTS++;
//       this.ArrayErrorFileCTS.push({error: "El tipo de moneda no coincide con los valores permitidos. Por favor revise el campo en la columna E fila " + (i + 1) + " O descargue la plantilla estándar"})
//     }
//     if((costoInversion !== "" || costoInversion !== null) && (costoInversion !== 'Centro de costos' && costoInversion !== 'Orden de inversión' && costoInversion !== 'ID de Servicios')) {
//       this.cantidadErrorFileCTS++;
//       this.ArrayErrorFileCTS.push({error: "El valor del campo Centro de costos/ Orden de inversión no coincide con los permitidos en la columna F fila " + (i + 1) + " Por favor revise o descargue la plantilla estándar"})
//     }
//     if(costoInversion === 'ID de Servicios') {
//       let respuestaServicioExcel = await this.servicioCrm.validarIdServiciosExcel(params);
//       let idServicio = []
//       let estado = respuestaServicioExcel.filter(x => {
//         return x.Estado === 'No Existe';
//       });
//       if(estado.length > 0) {
//         let cantidadIds = estado.map(x => {
//           return x.IdServicio
//         })
//         idServicio.push(cantidadIds);
//         this.cantidadErrorFileCTS++;
//         this.ArrayErrorFileCTS.push({error: `El (los) id(s) de servicio ${idServicio.toString().replace(',', ', ')} no existe(n), por favor verifique la columna G fila ` + (i + 1)});
//       }
//       else if(estado.length === 0) {
//         this.ctsFormulario.controls['numCicoCTS'].disable();
//         let idServicios = [];
//         let datos = await this.servicioCrm.consultarDatosBodega(params);
//         let ids = datos.map(x => {
//           return x.Orden_SAP;
//         });
//         idServicios.push(ids);
//         IdOrdenServicio !== undefined ? IdOrdenServicio = idServicios : IdOrdenServicio = [];
//         tieneIdServicio = true;
//       }
//     }
//     if(costoInversion === "" || costoInversion === null){
//       this.cantidadErrorFileCTS++;
//       this.ArrayErrorFileCTS.push({error:"El campo Centro de costos/ Orden de inversión en la columna F fila "+ (i+1)})
//     }
//     if(numeroCostoInversion === "" || numeroCostoInversion === null){
//       this.cantidadErrorFileCTS++;
//       this.ArrayErrorFileCTS.push({error:"El campo Número centro de costos/ Orden de inversión en la columna G fila "+ (i+1)})
//     }
//     if(numeroCuentaTesteadoServicios === false) {
//       this.cantidadErrorFileCTS++;
//       this.ArrayErrorFileCTS.push({error: "El campo Número de cuenta sólo admite números en la columna H fila " + (i + 1)})
//     }
//     if(numeroCuenta === "" || numeroCuenta === null){
//       this.cantidadErrorFileCTS++;
//       this.ArrayErrorFileCTS.push({error:"El campo Número de cuenta en la columna H fila "+ (i+1)})
//     }
//     if(this.cantidadErrorFileCTS === 0){


//       let Obj ={
//         Title: "Condición Técnicas Servicios" + new Date().toDateString(),
//         SolicitudId: this.idSolicitudGuardada,
//         Codigo: "",
//         CodigoSondeo:"",
//         Descripcion: descripcion.toString(),
//         Cantidad: cantidad,
//         CantidadSondeo: cantidad,
//         ValorEstimado: valorEstimadoString,
//         PrecioSondeo: valorEstimadoString,
//         TipoMoneda: tipoMoneda,
//         MonedaSondeo: tipoMoneda,
//         Comentario: comentarios,
//         costoInversion: costoInversion.toString(),
//         numeroCostoInversion: numeroCostoInversion.toString().replace('.', ','),
//         numeroCuenta: numeroCuentaStringCTS,
//         IdOrdenServicio: IdOrdenServicio.toString(),
//         tieneIdServicio: tieneIdServicio,
//         Orden: i
//       }
//         return Obj;         
//     } 
//     else{
//       setTimeout(() => {
//         this.limpiarArrayErrorFileCTS()
//       }, 15000);
//       return "";
//     } 
  
// }
//   else if(valorcompraOrdenEstadistica === "NO" && (codigo !== "" || codigo !== null)) {
    
//       if (descripcion === "" || descripcion === null) {
//         this.cantidadErrorFileCTS++;
//         this.ArrayErrorFileCTS.push({error:"El campo Descripción del elemento en la columna B fila "+ (i+1)});
//       }
//       if(cantidad === "" || cantidad === null){
//         this.cantidadErrorFileCTS++;
//         this.ArrayErrorFileCTS.push({error:"El campo Cantidad en la columna C fila "+ (i+1)})
//       }
//       if(cantidadTesteadoServicios === false){
//         this.cantidadErrorFileCTS++;
//         this.ArrayErrorFileCTS.push({error:"El campo Cantidad sólo admite números en la columna C fila "+ (i+1)})
//       }
//       if(testeado === false){
//         this.cantidadErrorFileCTS++;
//         this.ArrayErrorFileCTS.push({error:"El campo valor estimado sólo admite números en la columna D fila "+ (i+1)})
//       }
//       if((valorEstimado !== "" && valorEstimado !== null) && (tipoMoneda === "" || tipoMoneda === null )) {
//         this.cantidadErrorFileCTS++;
//         this.ArrayErrorFileCTS.push({error: "El campo Tipo moneda es obligatorio cuando hay valor estimado en la columna E fila" + (i +1) })
//       }
//       if((tipoMoneda !== null && tipoMoneda !== "") && (tipoMoneda !== 'ARS' && tipoMoneda !== 'BRL' && tipoMoneda !== 'CLP' && tipoMoneda !== 'COP' && tipoMoneda !== 'EUR' && tipoMoneda !== 'PEN' && tipoMoneda !== 'UF' && tipoMoneda !== 'USD')){
//         this.cantidadErrorFileCTS++;
//         this.ArrayErrorFileCTS.push({error: "El tipo de moneda no coincide con los valores permitidos. Por favor revise el campo en la columna E fila " + (i + 1) + " O descargue la plantilla estándar"})
//       }
//       if((costoInversion !== "" || costoInversion !== null) && (costoInversion !== 'Centro de costos' && costoInversion !== 'Orden de inversión' && costoInversion !== 'ID de Servicios')) {
//         this.cantidadErrorFileCTS++;
//         this.ArrayErrorFileCTS.push({error: "El valor del campo Centro de costos/ Orden de inversión no coincide con los permitidos en la columna F fila " + (i + 1) + " Por favor revise o descargue la plantilla estándar"})
//       }
//       if(costoInversion === 'ID de Servicios') {
//         let respuestaServicioExcel = await this.servicioCrm.validarIdServiciosExcel(params);
//         let idServicio = []
//         let estado = respuestaServicioExcel.filter(x => {
//           return x.Estado === 'No Existe';
//         });
//         if(estado.length > 0) {
//           let cantidadIds = estado.map(x => {
//             return x.IdServicio
//           })
//           idServicio.push(cantidadIds);
//           this.cantidadErrorFileCTS++;
//           this.ArrayErrorFileCTS.push({error: `El (los) id(s) de servicio ${idServicio.toString().replace(',', ', ')} no existe(n), por favor verifique la columna G fila ` + (i + 1)});
//         }
//         else if(estado.length === 0) {
//           this.ctsFormulario.controls['numCicoCTS'].disable();
//           let idServicios = [];
//           let datos = await this.servicioCrm.consultarDatosBodega(params);
//           let ids = datos.map(x => {
//             return x.Orden_SAP;
//           });
//           idServicios.push(ids);
//           IdOrdenServicio !== undefined ? IdOrdenServicio = idServicios : IdOrdenServicio = [];
//           tieneIdServicio = true;
//         }
//       }
//       if(costoInversion === "" || costoInversion === null){
//         this.cantidadErrorFileCTS++;
//         this.ArrayErrorFileCTS.push({error:"El campo Centro de costos/ Orden de inversión en la columna F fila "+ (i+1)})
//       }
//       if(numeroCostoInversion === "" || numeroCostoInversion === null){
//         this.cantidadErrorFileCTS++;
//         this.ArrayErrorFileCTS.push({error:"El campo Número centro de costos/ Orden de inversión en la columna G fila "+ (i+1)})
//       }
//       if(numeroCuentaTesteadoServicios === false) {
//         this.cantidadErrorFileCTS++;
//         this.ArrayErrorFileCTS.push({error: "El campo Número de cuenta sólo admite números en la columna H fila " + (i + 1)})
//       }
//       if(numeroCuenta === "" || numeroCuenta === null){
//         this.cantidadErrorFileCTS++;
//         this.ArrayErrorFileCTS.push({error:"El campo Número de cuenta en la columna H fila "+ (i+1)})
//       }
//       if(this.cantidadErrorFileCTS === 0){
//         // valorEstimado=valorEstimado.toString().replace(/[;\\/:*?\"<>.|&']/g, "");
  
//         let Obj ={
//           Title: "Condición Técnicas Servicios" + new Date().toDateString(),
//           SolicitudId: this.idSolicitudGuardada,
//           Codigo: codigo.toString(),
//           CodigoSondeo: codigo.toString(),
//           Descripcion: descripcion.toString(),
//           Cantidad: cantidad,
//           CantidadSondeo: cantidad,
//           ValorEstimado: valorEstimadoString,
//           PrecioSondeo: valorEstimadoString,
//           TipoMoneda: tipoMoneda,
//           MonedaSondeo: tipoMoneda,
//           Comentario: comentarios,
//           costoInversion: costoInversion.toString(),
//           numeroCostoInversion: numeroCostoInversion.toString().replace('.', ','),
//           numeroCuenta: numeroCuentaStringCTS,
//           IdOrdenServicio: IdOrdenServicio.toString(),
//           tieneIdServicio: tieneIdServicio,
//           Orden: i
//         }
//           return Obj;         
//       } 
//       else{
//         setTimeout(() => {
//           this.limpiarArrayErrorFileCTS()
//         }, 15000);
//         return "";
//       }
    
//   }

// else if(valorcompraOrdenEstadistica === "SI" && (codigo === "" || codigo === null)) {
 
//     if (descripcion === "" || descripcion === null) {
//       this.cantidadErrorFileCTS++;
//       this.ArrayErrorFileCTS.push({error:"El campo Descripción del elemento en la columna B fila "+ (i+1)});
//     }
//     if(cantidad === "" || cantidad === null){
//       this.cantidadErrorFileCTS++;
//       this.ArrayErrorFileCTS.push({error:"El campo Cantidad en la columna C fila "+ (i+1)})
//     }
//     if(cantidadTesteadoServicios === false){
//       this.cantidadErrorFileCTS++;
//       this.ArrayErrorFileCTS.push({error:"El campo Cantidad sólo admite números en la columna C fila "+ (i+1)})
//     }
//     if(testeado === false){
//       this.cantidadErrorFileCTS++;
//       this.ArrayErrorFileCTS.push({error:"El campo valor estimado sólo admite números en la columna D fila "+ (i+1)})
//     }
//     if((valorEstimado !== "" && valorEstimado !== null) && (tipoMoneda === "" || tipoMoneda === null )) {
//       this.cantidadErrorFileCTS++;
//       this.ArrayErrorFileCTS.push({error: "El campo Tipo moneda es obligatorio cuando hay valor estimado en la columna E fila " + (i +1) })
//     }
//     if((tipoMoneda !== null && tipoMoneda !== "") && (tipoMoneda !== 'ARS' && tipoMoneda !== 'BRL' && tipoMoneda !== 'CLP' && tipoMoneda !== 'COP' && tipoMoneda !== 'EUR' && tipoMoneda !== 'PEN' && tipoMoneda !== 'UF' && tipoMoneda !== 'USD')){
//       this.cantidadErrorFileCTS++;
//       this.ArrayErrorFileCTS.push({error: "El tipo de moneda no coincide con los valores permitidos. Por favor revise el campo en la columna E fila " + (i + 1) + " O descargue la plantilla estándar"})
//     }
   
//     if(this.cantidadErrorFileCTS === 0){
//       // valorEstimado=valorEstimado.toString().replace(/[;\\/:*?\"<>.|&']/g, "");

//       let Obj ={
//         Title: "Condición Técnicas Servicios" + new Date().toDateString(),
//         SolicitudId: this.idSolicitudGuardada,
//         Codigo: "",
//         CodigoSondeo: "",
//         Descripcion: descripcion.toString(),
//         Cantidad: cantidad,
//         CantidadSondeo: cantidad,
//         ValorEstimado: valorEstimadoString,
//         PrecioSondeo: valorEstimadoString,
//         TipoMoneda: tipoMoneda,
//         MonedaSondeo: tipoMoneda,
//         Comentario: comentarios,
//         costoInversion: "",
//         numeroCostoInversion: "",
//         numeroCuenta: "",
//         Orden: i
//       }
//         return Obj;         
//     } 
//     else{
//       setTimeout(() => {
//         this.limpiarArrayErrorFileCTS()
//       }, 15000);
//       return "";
//     }
  
// }
//   else {
//   if (descripcion === "" || descripcion === null) {
//     this.cantidadErrorFileCTS++;
//     this.ArrayErrorFileCTS.push({error:"El campo Descripción del elemento en la columna B fila "+ (i+1)});
//   }
//   if(cantidad === "" || cantidad === null){
//     this.cantidadErrorFileCTS++;
//     this.ArrayErrorFileCTS.push({error:"El campo Cantidad en la columna C fila "+ (i+1)})
//   }
//   if(cantidadTesteadoServicios === false){
//     this.cantidadErrorFileCTS++;
//     this.ArrayErrorFileCTS.push({error:"El campo Cantidad sólo admite números en la columna C fila "+ (i+1)})
//   }
//   if(testeado === false){
//     this.cantidadErrorFileCTS++;
//     this.ArrayErrorFileCTS.push({error:"El campo valor estimado sólo admite números en la columna D fila "+ (i+1)})
//   }
//   if((valorEstimado !== "" && valorEstimado !== null) && (tipoMoneda === "" || tipoMoneda === null )) {
//     this.cantidadErrorFileCTS++;
//     this.ArrayErrorFileCTS.push({error: "El campo Tipo moneda es obligatorio cuando hay valor estimado en la columna E fila " + (i +1) })
//   }
//   if((tipoMoneda !== null && tipoMoneda !== "") && (tipoMoneda !== 'ARS' && tipoMoneda !== 'BRL'&& tipoMoneda !== 'CLP' && tipoMoneda !== 'COP' && tipoMoneda !== 'EUR' && tipoMoneda !== 'PEN' && tipoMoneda !== 'UF' && tipoMoneda !== 'USD')){
//     this.cantidadErrorFileCTS++;
//     this.ArrayErrorFileCTS.push({error: "El tipo de moneda no coincide con los valores permitidos. Por favor revise el campo en la columna E fila " + (i + 1) + " O descargue la plantilla estándar"})
//   }
 
//   if(this.cantidadErrorFileCTS === 0){
//     // valorEstimado=valorEstimado.toString().replace(/[;\\/:*?\"<>.|&']/g, "");

//     let Obj ={
//       Title: "Condición Técnicas Servicios" + new Date().toDateString(),
//       SolicitudId: this.idSolicitudGuardada,
//       Codigo: codigo.toString(),
//       CodigoSondeo: codigo.toString(),
//       Descripcion: descripcion.toString(),
//       Cantidad: cantidad,
//       CantidadSondeo: cantidad,
//       ValorEstimado: valorEstimadoString,
//       PrecioSondeo: valorEstimadoString,
//       TipoMoneda: tipoMoneda,
//       MonedaSondeo: tipoMoneda,
//       Comentario: comentarios,
//       costoInversion: "",
//       numeroCostoInversion: "",
//       numeroCuenta: "",
//       Orden: i
//     }
//       return Obj;         
//   } 
//   else{
//     setTimeout(() => {
//       this.limpiarArrayErrorFileCTS()
//     }, 15000);
//     return "";
//   }                                 // Hasta aquí
// }





                      //Habilitar cuando datos contables no obligatorios
  if (valorcompraOrdenEstadistica === "NO" && tipoSolicitud !== 'Sondeo' && (codigo === "" || codigo === null)) {

    if (descripcion === "" || descripcion === null) {
      this.cantidadErrorFileCTS++;
      this.ArrayErrorFileCTS.push({ error: "El campo Descripción del elemento en la columna B fila " + (i + 1) });
    }
    if (cantidad === "" || cantidad === null) {
      this.cantidadErrorFileCTS++;
      this.ArrayErrorFileCTS.push({ error: "El campo Cantidad en la columna C fila " + (i + 1) })
    }
    if (cantidadTesteadoServicios === false) {
      this.cantidadErrorFileCTS++;
      this.ArrayErrorFileCTS.push({ error: "El campo Cantidad sólo admite números en la columna C fila " + (i + 1) })
    }
    if (testeado === false) {
      this.cantidadErrorFileCTS++;
      this.ArrayErrorFileCTS.push({ error: "El campo valor estimado sólo admite números en la columna D fila " + (i + 1) })
    }
    if ((valorEstimado !== "" && valorEstimado !== null) && (tipoMoneda === "" || tipoMoneda === null)) {
      this.cantidadErrorFileCTS++;
      this.ArrayErrorFileCTS.push({ error: "El campo Tipo moneda es obligatorio cuando hay valor estimado en la columna E fila " + (i + 1) })
    }
    if ((tipoMoneda !== null && tipoMoneda !== "") && (tipoMoneda !== 'ARS' && tipoMoneda !== 'BRL' && tipoMoneda !== 'CLP' && tipoMoneda !== 'COP' && tipoMoneda !== 'EUR' && tipoMoneda !== 'PEN' && tipoMoneda !== 'UF' && tipoMoneda !== 'USD')) {
      this.cantidadErrorFileCTS++;
      this.ArrayErrorFileCTS.push({ error: "El tipo de moneda no coincide con los valores permitidos. Por favor revise el campo en la columna E fila " + (i + 1) + " O descargue la plantilla estándar" })
    }
    if ((costoInversion !== "" || costoInversion !== null) && (costoInversion !== 'Centro de costos' && costoInversion !== 'Orden de inversión' && costoInversion !== 'ID de Servicios')) {
      this.cantidadErrorFileCTS++;
      this.ArrayErrorFileCTS.push({ error: "El valor del campo Centro de costos/ Orden de inversión no coincide con los permitidos en la columna F fila " + (i + 1) + " Por favor revise o descargue la plantilla estándar" })
    }
    if ((costoInversion === 'ID de Servicios') && (numeroCostoInversion !== "" && numeroCostoInversion !== null)) {
      let respuestaServicioExcel = await this.servicioCrm.validarIdServiciosExcel(params);
      let idServicio = []
      let estado = respuestaServicioExcel.filter(x => {
        return x.Estado === 'No Existe';
      });
      if (estado.length > 0) {
        let cantidadIds = estado.map(x => {
          return x.IdServicio
        })
        idServicio.push(cantidadIds);
        this.cantidadErrorFileCTS++;
        this.ArrayErrorFileCTS.push({ error: `El (los) id(s) de servicio ${idServicio.toString().replace(',', ', ')} no existe(n), por favor verifique la columna G fila ` + (i + 1) });
      }
      // else if(estado.length === 0) {
      //   this.ctsFormulario.controls['numCicoCTS'].disable();
      //   let idServicios = [];
      //   let datos = await this.servicioCrm.consultarDatosBodega(params);
      //   let ids = datos.map(x => {
      //     return x.Orden_SAP;
      //   });
      //   idServicios.push(ids);
      //   IdOrdenServicio !== undefined ? IdOrdenServicio = idServicios : IdOrdenServicio = [];
      //   tieneIdServicio = true;
      // }
    }
    if (costoInversion === "" || costoInversion === null) {
      this.cantidadErrorFileCTS++;
      this.ArrayErrorFileCTS.push({ error: "El campo Centro de costos/ Orden de inversión en la columna F fila " + (i + 1) })
    }
    if (numeroCostoInversion === "" || numeroCostoInversion === null) {
      this.cantidadErrorFileCTS++;
      this.ArrayErrorFileCTS.push({ error: "El campo Número centro de costos/ Orden de inversión en la columna G fila " + (i + 1) })
    }
    if (numeroCuentaTesteadoServicios === false) {
      this.cantidadErrorFileCTS++;
      this.ArrayErrorFileCTS.push({ error: "El campo Número de cuenta sólo admite números en la columna H fila " + (i + 1) })
    }
    if (numeroCuenta === "" || numeroCuenta === null) {
      this.cantidadErrorFileCTS++;
      this.ArrayErrorFileCTS.push({ error: "El campo Número de cuenta en la columna H fila " + (i + 1) })
    }
    if (this.cantidadErrorFileCTS === 0) {
      if (costoInversion === 'ID de Servicios') {
        // this.ctsFormulario.controls['numCicoCTS'].disable();
        let idServicios = [];
        let datos = await this.servicioCrm.consultarDatosBodega(params);
        console.log(datos);
        let ids = datos.map(x => {
          return x.Orden_SAP;
        });
        idServicios.push(ids);
        IdOrdenServicio !== undefined ? IdOrdenServicio = idServicios : IdOrdenServicio = [];
        tieneIdServicio = true;
      }
      // else {
      //   this.ctsFormulario.controls['numCicoCTS'].enable();
      // }


      let Obj = {
        Title: "Condición Técnicas Servicios" + new Date().toDateString(),
        SolicitudId: this.idSolicitudGuardada,
        Codigo: "",
        CodigoSondeo: "",
        Descripcion: descripcion.toString(),
        Cantidad: cantidad,
        CantidadSondeo: cantidad,
        ValorEstimado: valorEstimadoString,
        PrecioSondeo: valorEstimadoString,
        TipoMoneda: tipoMoneda,
        MonedaSondeo: tipoMoneda,
        Comentario: comentarios,
        costoInversion: costoInversion.toString(),
        numeroCostoInversion: numeroCostoInversion.toString().replace('.', ','),
        numeroCuenta: numeroCuentaStringCTS,
        IdOrdenServicio: IdOrdenServicio.toString(),
        tieneIdServicio: tieneIdServicio,
        Orden: i
      }
      return Obj;
    }
    else {
      setTimeout(() => {
        this.limpiarArrayErrorFileCTS()
      }, 15000);
      return "";
    }

  }
    else if(valorcompraOrdenEstadistica === "NO" && tipoSolicitud !== 'Sondeo' && (codigo !== "" || codigo !== null)) {
      
        if (descripcion === "" || descripcion === null) {
          this.cantidadErrorFileCTS++;
          this.ArrayErrorFileCTS.push({error:"El campo Descripción del elemento en la columna B fila "+ (i+1)});
        }
        if(cantidad === "" || cantidad === null){
          this.cantidadErrorFileCTS++;
          this.ArrayErrorFileCTS.push({error:"El campo Cantidad en la columna C fila "+ (i+1)})
        }
        if(cantidadTesteadoServicios === false){
          this.cantidadErrorFileCTS++;
          this.ArrayErrorFileCTS.push({error:"El campo Cantidad sólo admite números en la columna C fila "+ (i+1)})
        }
        if(testeado === false){
          this.cantidadErrorFileCTS++;
          this.ArrayErrorFileCTS.push({error:"El campo valor estimado sólo admite números en la columna D fila "+ (i+1)})
        }
        if((valorEstimado !== "" && valorEstimado !== null) && (tipoMoneda === "" || tipoMoneda === null )) {
          this.cantidadErrorFileCTS++;
          this.ArrayErrorFileCTS.push({error: "El campo Tipo moneda es obligatorio cuando hay valor estimado en la columna E fila" + (i +1) })
        }
        if((tipoMoneda !== null && tipoMoneda !== "") && (tipoMoneda !== 'ARS' && tipoMoneda !== 'BRL' && tipoMoneda !== 'CLP' && tipoMoneda !== 'COP' && tipoMoneda !== 'EUR' && tipoMoneda !== 'PEN' && tipoMoneda !== 'UF' && tipoMoneda !== 'USD')){
          this.cantidadErrorFileCTS++;
          this.ArrayErrorFileCTS.push({error: "El tipo de moneda no coincide con los valores permitidos. Por favor revise el campo en la columna E fila " + (i + 1) + " O descargue la plantilla estándar"})
        }
        if((costoInversion !== "" || costoInversion !== null) && (costoInversion !== 'Centro de costos' && costoInversion !== 'Orden de inversión' && costoInversion !== 'ID de Servicios')) {
          this.cantidadErrorFileCTS++;
          this.ArrayErrorFileCTS.push({error: "El valor del campo Centro de costos/ Orden de inversión no coincide con los permitidos en la columna F fila " + (i + 1) + " Por favor revise o descargue la plantilla estándar"})
        }
        if(costoInversion === 'ID de Servicios') {
          let respuestaServicioExcel = await this.servicioCrm.validarIdServiciosExcel(params);
          let idServicio = []
          let estado = respuestaServicioExcel.filter(x => {
            return x.Estado === 'No Existe';
          });
          if(estado.length > 0) {
            let cantidadIds = estado.map(x => {
              return x.IdServicio
            })
            idServicio.push(cantidadIds);
            this.cantidadErrorFileCTS++;
            this.ArrayErrorFileCTS.push({error: `El (los) id(s) de servicio ${idServicio.toString().replace(',', ', ')} no existe(n), por favor verifique la columna G fila ` + (i + 1)});
          }
          // else if(estado.length === 0) {
          //   this.ctsFormulario.controls['numCicoCTS'].disable();
          //   let idServicios = [];
          //   let datos = await this.servicioCrm.consultarDatosBodega(params);
          //   let ids = datos.map(x => {
          //     return x.Orden_SAP;
          //   });
          //   idServicios.push(ids);
          //   IdOrdenServicio !== undefined ? IdOrdenServicio = idServicios : IdOrdenServicio = [];
          //   tieneIdServicio = true;
          // }
        }
        if(costoInversion === "" || costoInversion === null){
          this.cantidadErrorFileCTS++;
          this.ArrayErrorFileCTS.push({error:"El campo Centro de costos/ Orden de inversión en la columna F fila "+ (i+1)})
        }
        if(numeroCostoInversion === "" || numeroCostoInversion === null){
          this.cantidadErrorFileCTS++;
          this.ArrayErrorFileCTS.push({error:"El campo Número centro de costos/ Orden de inversión en la columna G fila "+ (i+1)})
        }
        if(numeroCuentaTesteadoServicios === false) {
          this.cantidadErrorFileCTS++;
          this.ArrayErrorFileCTS.push({error: "El campo Número de cuenta sólo admite números en la columna H fila " + (i + 1)})
        }
        if(numeroCuenta === "" || numeroCuenta === null){
          this.cantidadErrorFileCTS++;
          this.ArrayErrorFileCTS.push({error:"El campo Número de cuenta en la columna H fila "+ (i+1)})
        }
        if(this.cantidadErrorFileCTS === 0){

          if (costoInversion === 'ID de Servicios') {
            // this.ctsFormulario.controls['numCicoCTS'].disable();
            let idServicios = [];
            let datos = await this.servicioCrm.consultarDatosBodega(params);
            console.log(datos);
            let ids = datos.map(x => {
              return x.Orden_SAP;
            });
            idServicios.push(ids);
            IdOrdenServicio !== undefined ? IdOrdenServicio = idServicios : IdOrdenServicio = [];
            tieneIdServicio = true;
          }
          // else {
          //   this.ctsFormulario.controls['numCicoCTS'].enable();
          // }
          // valorEstimado=valorEstimado.toString().replace(/[;\\/:*?\"<>.|&']/g, "");
    
          let Obj = {
            Title: "Condición Técnicas Servicios" + new Date().toDateString(),
            SolicitudId: this.idSolicitudGuardada,
            Codigo: codigo.toString(),
            CodigoSondeo: codigo.toString(),
            Descripcion: descripcion.toString(),
            Cantidad: cantidad,
            CantidadSondeo: cantidad,
            ValorEstimado: valorEstimadoString,
            PrecioSondeo: valorEstimadoString,
            TipoMoneda: tipoMoneda,
            MonedaSondeo: tipoMoneda,
            Comentario: comentarios,
            costoInversion: costoInversion.toString(),
            numeroCostoInversion: numeroCostoInversion.toString().replace('.', ','),
            numeroCuenta: numeroCuentaStringCTS,
            IdOrdenServicio: IdOrdenServicio.toString(),
            tieneIdServicio: tieneIdServicio,
            Orden: i
          }
            return Obj;         
        } 
        else{
          setTimeout(() => {
            this.limpiarArrayErrorFileCTS()
          }, 15000);
          return "";
        }
      
    }

    else if (valorcompraOrdenEstadistica === 'NO' && tipoSolicitud === 'Sondeo' && (codigo === "" || codigo === null)) {
        if (descripcion === "" || descripcion === null) {
        this.cantidadErrorFileCTS++;
        this.ArrayErrorFileCTS.push({error:"El campo Descripción del elemento en la columna B fila "+ (i+1)});
      }
      if(cantidad === "" || cantidad === null){
        this.cantidadErrorFileCTS++;
        this.ArrayErrorFileCTS.push({error:"El campo Cantidad en la columna C fila "+ (i+1)})
      }
      if(cantidadTesteadoServicios === false){
        this.cantidadErrorFileCTS++;
        this.ArrayErrorFileCTS.push({error:"El campo Cantidad sólo admite números en la columna C fila "+ (i+1)})
      }
      if(testeado === false){
        this.cantidadErrorFileCTS++;
        this.ArrayErrorFileCTS.push({error:"El campo valor estimado sólo admite números en la columna D fila "+ (i+1)})
      }
      if((valorEstimado !== "" && valorEstimado !== null) && (tipoMoneda === "" || tipoMoneda === null )) {
        this.cantidadErrorFileCTS++;
        this.ArrayErrorFileCTS.push({error: "El campo Tipo moneda es obligatorio cuando hay valor estimado en la columna E fila " + (i +1) })
      }
      if((tipoMoneda !== null && tipoMoneda !== "") && (tipoMoneda !== 'ARS' && tipoMoneda !== 'BRL' && tipoMoneda !== 'CLP' && tipoMoneda !== 'COP' && tipoMoneda !== 'EUR' && tipoMoneda !== 'PEN' && tipoMoneda !== 'UF' && tipoMoneda !== 'USD')){
        this.cantidadErrorFileCTS++;
        this.ArrayErrorFileCTS.push({error: "El tipo de moneda no coincide con los valores permitidos. Por favor revise el campo en la columna E fila " + (i + 1) + " O descargue la plantilla estándar"})
      }
     
      if(this.cantidadErrorFileCTS === 0){
        // valorEstimado=valorEstimado.toString().replace(/[;\\/:*?\"<>.|&']/g, "");
  
        let Obj ={
          Title: "Condición Técnicas Servicios" + new Date().toDateString(),
          SolicitudId: this.idSolicitudGuardada,
          Codigo: "",
          CodigoSondeo: "",
          Descripcion: descripcion.toString(),
          Cantidad: cantidad,
          CantidadSondeo: cantidad,
          ValorEstimado: valorEstimadoString,
          PrecioSondeo: valorEstimadoString,
          TipoMoneda: tipoMoneda,
          MonedaSondeo: tipoMoneda,
          Comentario: comentarios,
          costoInversion: "",
          numeroCostoInversion: "",
          numeroCuenta: "",
          Orden: i
        }
          return Obj;         
      } 
      else{
        setTimeout(() => {
          this.limpiarArrayErrorFileCTS()
        }, 15000);
        return "";
      }
    }

    else if (valorcompraOrdenEstadistica === 'NO' && tipoSolicitud === 'Sondeo' && (codigo !== "" || codigo !== null)) {
      if (descripcion === "" || descripcion === null) {
        this.cantidadErrorFileCTS++;
        this.ArrayErrorFileCTS.push({error:"El campo Descripción del elemento en la columna B fila "+ (i+1)});
      }
      if(cantidad === "" || cantidad === null){
        this.cantidadErrorFileCTS++;
        this.ArrayErrorFileCTS.push({error:"El campo Cantidad en la columna C fila "+ (i+1)})
      }
      if(cantidadTesteadoServicios === false){
        this.cantidadErrorFileCTS++;
        this.ArrayErrorFileCTS.push({error:"El campo Cantidad sólo admite números en la columna C fila "+ (i+1)})
      }
      if(testeado === false){
        this.cantidadErrorFileCTS++;
        this.ArrayErrorFileCTS.push({error:"El campo valor estimado sólo admite números en la columna D fila "+ (i+1)})
      }
      if((valorEstimado !== "" && valorEstimado !== null) && (tipoMoneda === "" || tipoMoneda === null )) {
        this.cantidadErrorFileCTS++;
        this.ArrayErrorFileCTS.push({error: "El campo Tipo moneda es obligatorio cuando hay valor estimado en la columna E fila " + (i +1) })
      }
      if((tipoMoneda !== null && tipoMoneda !== "") && (tipoMoneda !== 'ARS' && tipoMoneda !== 'BRL'&& tipoMoneda !== 'CLP' && tipoMoneda !== 'COP' && tipoMoneda !== 'EUR' && tipoMoneda !== 'PEN' && tipoMoneda !== 'UF' && tipoMoneda !== 'USD')){
        this.cantidadErrorFileCTS++;
        this.ArrayErrorFileCTS.push({error: "El tipo de moneda no coincide con los valores permitidos. Por favor revise el campo en la columna E fila " + (i + 1) + " O descargue la plantilla estándar"})
      }
     
      if(this.cantidadErrorFileCTS === 0){
        // valorEstimado=valorEstimado.toString().replace(/[;\\/:*?\"<>.|&']/g, "");
  
        let Obj ={
          Title: "Condición Técnicas Servicios" + new Date().toDateString(),
          SolicitudId: this.idSolicitudGuardada,
          Codigo: codigo.toString(),
          CodigoSondeo: codigo.toString(),
          Descripcion: descripcion.toString(),
          Cantidad: cantidad,
          CantidadSondeo: cantidad,
          ValorEstimado: valorEstimadoString,
          PrecioSondeo: valorEstimadoString,
          TipoMoneda: tipoMoneda,
          MonedaSondeo: tipoMoneda,
          Comentario: comentarios,
          costoInversion: "",
          numeroCostoInversion: "",
          numeroCuenta: "",
          Orden: i
        }
          return Obj;         
      } 
      else{
        setTimeout(() => {
          this.limpiarArrayErrorFileCTS()
        }, 15000);
        return "";
      }
    }
  
  else if(valorcompraOrdenEstadistica === "SI" && (codigo === "" || codigo === null)) {
   
      if (descripcion === "" || descripcion === null) {
        this.cantidadErrorFileCTS++;
        this.ArrayErrorFileCTS.push({error:"El campo Descripción del elemento en la columna B fila "+ (i+1)});
      }
      if(cantidad === "" || cantidad === null){
        this.cantidadErrorFileCTS++;
        this.ArrayErrorFileCTS.push({error:"El campo Cantidad en la columna C fila "+ (i+1)})
      }
      if(cantidadTesteadoServicios === false){
        this.cantidadErrorFileCTS++;
        this.ArrayErrorFileCTS.push({error:"El campo Cantidad sólo admite números en la columna C fila "+ (i+1)})
      }
      if(testeado === false){
        this.cantidadErrorFileCTS++;
        this.ArrayErrorFileCTS.push({error:"El campo valor estimado sólo admite números en la columna D fila "+ (i+1)})
      }
      if((valorEstimado !== "" && valorEstimado !== null) && (tipoMoneda === "" || tipoMoneda === null )) {
        this.cantidadErrorFileCTS++;
        this.ArrayErrorFileCTS.push({error: "El campo Tipo moneda es obligatorio cuando hay valor estimado en la columna E fila " + (i +1) })
      }
      if((tipoMoneda !== null && tipoMoneda !== "") && (tipoMoneda !== 'ARS' && tipoMoneda !== 'BRL' && tipoMoneda !== 'CLP' && tipoMoneda !== 'COP' && tipoMoneda !== 'EUR' && tipoMoneda !== 'PEN' && tipoMoneda !== 'UF' && tipoMoneda !== 'USD')){
        this.cantidadErrorFileCTS++;
        this.ArrayErrorFileCTS.push({error: "El tipo de moneda no coincide con los valores permitidos. Por favor revise el campo en la columna E fila " + (i + 1) + " O descargue la plantilla estándar"})
      }
     
      if(this.cantidadErrorFileCTS === 0){
        // valorEstimado=valorEstimado.toString().replace(/[;\\/:*?\"<>.|&']/g, "");
  
        let Obj ={
          Title: "Condición Técnicas Servicios" + new Date().toDateString(),
          SolicitudId: this.idSolicitudGuardada,
          Codigo: "",
          CodigoSondeo: "",
          Descripcion: descripcion.toString(),
          Cantidad: cantidad,
          CantidadSondeo: cantidad,
          ValorEstimado: valorEstimadoString,
          PrecioSondeo: valorEstimadoString,
          TipoMoneda: tipoMoneda,
          MonedaSondeo: tipoMoneda,
          Comentario: comentarios,
          costoInversion: "",
          numeroCostoInversion: "",
          numeroCuenta: "",
          Orden: i
        }
          return Obj;         
      } 
      else{
        setTimeout(() => {
          this.limpiarArrayErrorFileCTS()
        }, 15000);
        return "";
      }
    
  }
    else {
    if (descripcion === "" || descripcion === null) {
      this.cantidadErrorFileCTS++;
      this.ArrayErrorFileCTS.push({error:"El campo Descripción del elemento en la columna B fila "+ (i+1)});
    }
    if(cantidad === "" || cantidad === null){
      this.cantidadErrorFileCTS++;
      this.ArrayErrorFileCTS.push({error:"El campo Cantidad en la columna C fila "+ (i+1)})
    }
    if(cantidadTesteadoServicios === false){
      this.cantidadErrorFileCTS++;
      this.ArrayErrorFileCTS.push({error:"El campo Cantidad sólo admite números en la columna C fila "+ (i+1)})
    }
    if(testeado === false){
      this.cantidadErrorFileCTS++;
      this.ArrayErrorFileCTS.push({error:"El campo valor estimado sólo admite números en la columna D fila "+ (i+1)})
    }
    if((valorEstimado !== "" && valorEstimado !== null) && (tipoMoneda === "" || tipoMoneda === null )) {
      this.cantidadErrorFileCTS++;
      this.ArrayErrorFileCTS.push({error: "El campo Tipo moneda es obligatorio cuando hay valor estimado en la columna E fila " + (i +1) })
    }
    if((tipoMoneda !== null && tipoMoneda !== "") && (tipoMoneda !== 'ARS' && tipoMoneda !== 'BRL'&& tipoMoneda !== 'CLP' && tipoMoneda !== 'COP' && tipoMoneda !== 'EUR' && tipoMoneda !== 'PEN' && tipoMoneda !== 'UF' && tipoMoneda !== 'USD')){
      this.cantidadErrorFileCTS++;
      this.ArrayErrorFileCTS.push({error: "El tipo de moneda no coincide con los valores permitidos. Por favor revise el campo en la columna E fila " + (i + 1) + " O descargue la plantilla estándar"})
    }
   
    if(this.cantidadErrorFileCTS === 0){
      // valorEstimado=valorEstimado.toString().replace(/[;\\/:*?\"<>.|&']/g, "");

      let Obj ={
        Title: "Condición Técnicas Servicios" + new Date().toDateString(),
        SolicitudId: this.idSolicitudGuardada,
        Codigo: codigo.toString(),
        CodigoSondeo: codigo.toString(),
        Descripcion: descripcion.toString(),
        Cantidad: cantidad,
        CantidadSondeo: cantidad,
        ValorEstimado: valorEstimadoString,
        PrecioSondeo: valorEstimadoString,
        TipoMoneda: tipoMoneda,
        MonedaSondeo: tipoMoneda,
        Comentario: comentarios,
        costoInversion: "",
        numeroCostoInversion: "",
        numeroCuenta: "",
        Orden: i
      }
        return Obj;         
    } 
    else{
      setTimeout(() => {
        this.limpiarArrayErrorFileCTS()
      }, 15000);
      return "";
    }
  }                                         // Hasta aquí

}

 

validarCodigosBrasilCTB(codigoValidar, i) {  
  let solicitudTipo = this.solpFormulario.controls["tipoSolicitud"].value
  let paisValidar = this.solpFormulario.controls["pais"].value.nombre
  //let codigoValidar =  this.ctbFormulario.controls["codigoCTB"].value
  if ((solicitudTipo === "Solp" || solicitudTipo === "Orden a CM" || solicitudTipo === 'Cláusula adicional') && paisValidar === "Brasil") {
      if(codigoValidar === "" || codigoValidar === null || codigoValidar === undefined) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({error:"El código es obligatorio para Brasil, por favor valide el código de material en la columna A fila "+ (i+1)});
        // this.mostrarError('El código es obligatorio para Brasil, por favor valide el código de material en la columna A de la fila '+ (i+1));
        // return false;
      }
  }
}

validarCodigosBrasilCTS(codigoValidar, i) {  
  let solicitudTipo = this.solpFormulario.controls["tipoSolicitud"].value
  let paisValidar = this.solpFormulario.controls["pais"].value.nombre
  //let codigoValidar =  this.ctbFormulario.controls["codigoCTB"].value
  if ((solicitudTipo === "Solp" || solicitudTipo === "Orden a CM" || solicitudTipo === 'Cláusula adicional') && paisValidar === "Brasil") {
      if(codigoValidar === "" || codigoValidar === null || codigoValidar === undefined) {
        this.cantidadErrorFileCTS++;
        this.ArrayErrorFileCTS.push({error:"El código es obligatorio para Brasil, por favor valide el código de material en la columna A fila "+ (i+1)});
        // this.mostrarError('El código es obligatorio para Brasil, por favor valide el código de material en la columna A de la fila '+ (i+1));
        // return false;
      }
  }
}

deshabilitarCampo() {
  if(this.ctbFormulario.controls['cecoCTB'].value === 'ID de Servicios') {
    this.ctbFormulario.controls['numCicoCTB'].disable();
  }
  else {
    this.ctbFormulario.controls['numCicoCTB'].enable();
  }
}

deshabilitarCampoServicios() {
  if(this.ctsFormulario.controls['cecoCTS'].value === 'ID de Servicios') {
    this.ctsFormulario.controls['numCicoCTS'].disable();
  }
  else {
    this.solpFormulario.controls['numCicoCTS'].enable();
  }
}


  AsignarRequeridosDatosContables(): any {
    // let tipoSolicitud = this.solpFormulario.get('tipoSolicitud').value;
    this.ctbFormulario.controls["cecoCTB"].setValidators(Validators.required);
    this.ctbFormulario.controls["numCicoCTB"].setValidators(Validators.required);
    this.ctbFormulario.controls["numCuentaCTB"].setValidators(Validators.required);
    this.ctbFormulario.controls["cecoCTB"].setValue('');
    this.ctbFormulario.controls["numCicoCTB"].setValue('');
    this.ctbFormulario.controls["numCuentaCTB"].setValue('');
    this.ctsFormulario.controls["cecoCTS"].setValidators(Validators.required);
    this.ctsFormulario.controls["numCicoCTS"].setValidators(Validators.required);
    this.ctsFormulario.controls["numCuentaCTS"].setValidators(Validators.required);
    this.ctsFormulario.controls["cecoCTS"].setValue('');
    this.ctsFormulario.controls["numCicoCTS"].setValue('');
    this.ctsFormulario.controls["numCuentaCTS"].setValue('');
  }

  removerRequeridosDatosContables(){
    this.ctbFormulario.controls["cecoCTB"].clearValidators();
    this.ctbFormulario.controls["numCicoCTB"].clearValidators();
    this.ctbFormulario.controls["numCuentaCTB"].clearValidators();
    this.ctsFormulario.controls["cecoCTS"].clearValidators();
    this.ctsFormulario.controls["numCicoCTS"].clearValidators();
    this.ctsFormulario.controls["numCuentaCTS"].clearValidators();
  }

  limpiarDatosContables() {
    this.ctbFormulario.controls["cecoCTB"].setValue('');
    this.ctbFormulario.controls["numCicoCTB"].setValue('');
    this.ctbFormulario.controls["numCuentaCTB"].setValue('');
    this.ctsFormulario.controls["cecoCTS"].setValue('');
    this.ctsFormulario.controls["numCicoCTS"].setValue('');
    this.ctsFormulario.controls["numCuentaCTS"].setValue('');
    this.solpFormulario.controls['compraOrdenEstadistica'].setValue('');
  }

  aplicarTemaCalendario() {
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme, dateInputFormat: 'DD/MM/YYYY' });
  }

  RegistrarFormularioCTS() {
    this.ctsFormulario = this.formBuilder.group({
      codigoCTS: [''],
      descripcionCTS: ['', Validators.required],
      cantidadCTS: ['', Validators.required],
      valorEstimadoCTS: [''],
      tipoMonedaCTS: [''],
      adjuntoCTS: [''],
      comentariosCTS: [''],
      cecoCTS: [''],
      numCicoCTS: [''],
      numCuentaCTS: [''],
      clienteServicios: [''],
      ordenServicios: [''],
      idServicio: [''],
      nombreIdServicio: ['']
    });
  }

  RegistrarFormularioCTB() {
    this.ctbFormulario = this.formBuilder.group({
      codigoCTB: [''],
      descripcionCTB: ['', Validators.required],
      modeloCTB: ['', Validators.required],
      fabricanteCTB: ['', Validators.required],
      cantidadCTB: ['', Validators.required],
      valorEstimadoCTB: [''],
      tipoMonedaCTB: [''],
      adjuntoCTB: [''],
      comentariosCTB: [''],
      cecoCTB: [''],
      numCicoCTB: [''],
      numCuentaCTB: [''],
      clienteBienes: [''],
      ordenBienes: [''],
      IdServicioBienes: [''],
      nombreIdServicioBienes: [''],
      clientBienes: [''],
      ordenServBienes: [''],
      idServBienes: [''],
      nombreIdServBienes: ['']   
    });
  }

  seleccionarOrdenadorGastos(event) {
    if (event != "Seleccione") {
      this.emptyManager = false;
    } else {
      this.emptyManager = true;
    }
  }

  ValidarTipoMonedaObligatoriaSiHayValorEstimadoCTS() {
    const tipoMonedaControl = this.ctsFormulario.get('tipoMonedaCTS');
    this.ctsFormulario.get('valorEstimadoCTS').valueChanges.subscribe(
      (valor: string) => {
        if (valor != '' && valor != "0") {
          this.emptyasteriscoCTs = true;
          tipoMonedaControl.setValidators([Validators.required]);
        }
        else {
          this.emptyasteriscoCTs = false;
          tipoMonedaControl.clearValidators();
        }
        tipoMonedaControl.updateValueAndValidity();
      });
  }

  ValidarTipoMonedaObligatoriaSiHayValorEstimadoCTB() {
    const tipoMonedaControl = this.ctbFormulario.get('tipoMonedaCTB');
    this.ctbFormulario.get('valorEstimadoCTB').valueChanges.subscribe(
      (valor: string) => {
        if (valor != '' && valor != "0") {
          this.emptyasteriscoCTB = true;
          tipoMonedaControl.setValidators([Validators.required]);
        }
        else {
          this.emptyasteriscoCTB = false;
          tipoMonedaControl.clearValidators();
        }
        tipoMonedaControl.updateValueAndValidity();
      });
  }

  get f() { return this.ctbFormulario.controls; }

  get f2() { return this.ctsFormulario.controls; }

  RegistrarFormularioSolp() {
    this.solpFormulario = this.formBuilder.group({
      tipoSolicitud: [''],
      cm: [''],
      solicitante: [''],
      // empresa: [''],
      ordenadorGastos: [''],
      pais: [''],
      categoria: [''],
      subcategoria: [''],
      comprador: [''],
      codigoAriba: [''],
      fechaEntregaDeseada: [''],
      alcance: [''],
      justificacion: [''],
      compraOrdenEstadistica: ['NO'],
      numeroOrdenEstadistica: ['']
    });

  }

  RecuperarUsuario() {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
    this.nombreUsuario = this.usuarioActual.nombre;
  }

  obtenerTiposSolicitud() {
    this.servicio.ObtenerTiposSolicitud().subscribe(
      (respuesta) => {
        this.tiposSolicitud = TipoSolicitud.fromJsonList(respuesta);
        this.obtenerEmpresas();
      }, err => {
        this.mostrarError('Error obteniendo tipos de solicitud');
        this.spinner.hide();
        console.log('Error obteniendo tipos de solicitud: ' + err);
      }
    )
  }

  // ValidacionesTipoSolicitud(tipoSolicitud) {
  //   this.mostrarCM(tipoSolicitud);
  //   this.deshabilitarJustificacion(tipoSolicitud);
  // }

                                //Habilitar cuando datos contables no obligatorios
  ValidacionesTipoSolicitud(tipoSolicitud) {
    console.log(tipoSolicitud);
    this.mostrarCM(tipoSolicitud);
    this.deshabilitarJustificacion(tipoSolicitud);
    if(tipoSolicitud.nombre !== 'Sondeo') {
      this.noMostrarOrdenEstadistica = false;
      console.log(this.solpFormulario.controls['compraOrdenEstadistica'].value)
      // this.solpFormulario.controls['compraOrdenEstadistica'].setValue('NO');
      this.mostrarDivDatosContables();
      this.AsignarRequeridosDatosContables();
    }
    else {
      this.noMostrarOrdenEstadistica = true;
      this.removerRequeridosDatosContables();
      this.esconderDatosContables();
      this.limpiarDatosContables();
    }
  }                              // Hasta aquí

  deshabilitarJustificacion(tipoSolicitud: any): any {
    if (tipoSolicitud.nombre === "Sondeo") {
      this.solpFormulario.controls["justificacion"].disable();
    } else {
      this.solpFormulario.controls["justificacion"].enable();
    }
  }

  mostrarCM(tipoSolicitud: any): any {
    if (tipoSolicitud.tieneCm) {
      this.mostrarContratoMarco = true;
    } else {
      this.mostrarContratoMarco = false;
      this.LimpiarContratoMarco();
    }
  }

  LimpiarContratoMarco(): any {
    this.solpFormulario.controls["cm"].setValue("");
  }

  obtenerEmpresas() {
    this.servicio.ObtenerEmpresas().subscribe(
      (respuesta) => {
        this.empresas = Empresa.fromJsonList(respuesta);
        this.obtenerUsuariosSitio();
      }, err => {
        this.mostrarError('Error obteniendo empresas');
        this.spinner.hide();
        console.log('Error obteniendo empresas: ' + err);
      }
    )
  }

  obtenerUsuariosSitio() {
    this.servicio.ObtenerTodosLosUsuarios().subscribe(
      (respuesta) => {
        this.usuarios = Usuario.fromJsonList(respuesta);
        this.DataSourceUsuariosSelect2();
        this.obtenerPaises();
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

  obtenerPaises() {
    this.servicio.ObtenerPaises().subscribe(
      (respuesta) => {
        this.paises = Pais.fromJsonList(respuesta);
        this.obtenerCategorias();
      }, err => {
        this.mostrarError('Error obteniendo paises');
        this.spinner.hide();
        console.log('Error obteniendo paises: ' + err);
      }
    )
  }

  obtenerCategorias() {
    this.servicio.ObtenerCategorias().subscribe(
      (respuesta) => {
        this.categorias = Categoria.fromJsonList(respuesta);
        this.obtenerParametrosConfiguracion();
      }, err => {
        this.mostrarError('Error obteniendo categorías');
        this.spinner.hide();
        console.log('Error obteniendo categorías: ' + err);
      }
    )
  }

  obtenerParametrosConfiguracion() {
    this.servicio.obtenerParametrosConfiguracion().subscribe(
      (respuesta) => {
        this.diasEntregaDeseada = respuesta[0].ParametroDiasEntregaDeseada;
        this.minDate = new Date();
        this.minDate.setDate(this.minDate.getDate() + this.diasEntregaDeseada);
        this.obtenerProfile();
      }, err => {
        this.mostrarError('Error obteniendo parametros de configuración');
        this.spinner.hide();
        console.log('Error obteniendo parametros de configuración: ' + err);
      }
    )
  }

  obtenerProfile() {
    this.servicio.obtenerdatosProfile().subscribe(
      (respuesta) => {
        if (respuesta.ExtendedManagers.results.length > 0) {
          let posicionManager = respuesta.ExtendedManagers.results.length - 1;
          this.correoManager = respuesta.ExtendedManagers.results[posicionManager];
          this.correoManager = this.correoManager.split('|')[2];
        }
        if (this.correoManager != "") {
          this.cargarJefePorDefecto();
        } else {
          this.agregarSolicitudInicial();
        }
      }, err => {
        this.mostrarError('Error obteniendo profile');
        this.spinner.hide();
        console.log('Error obteniendo profile: ' + err);
      }
    )
  }

  cargarJefePorDefecto(): any {
    this.servicio.ObtenerUsuarioPorEmail(this.correoManager).subscribe(
      (respuesta) => {
        this.emptyManager = false;
        this.valorUsuarioPorDefecto = respuesta.Id.toString();
        this.agregarSolicitudInicial();
      }, err => {
        this.mostrarError('Error obteniendo jefe inmediato');
        this.spinner.hide();
        console.log('Error obteniendo jefe inmediato: ' + err);
      }
    )
  }

  agregarSolicitudInicial(): any {
    this.solicitudGuardar = new Solicitud('Solicitud Solpes: ' + new Date(), '', '', this.usuarioActual.nombre, null, null, null, '', '', null, '', null, '', '', '', 'Inicial', this.usuarioActual.id, false, false, null, this.usuarioActual.id, '');
    this.servicio.agregarSolicitud(this.solicitudGuardar).then(
      (item: ItemAddResult) => {
        this.idSolicitudGuardada = item.data.Id;
        this.spinner.hide();
        this.cambiarNombresColumnas();
      }, err => {
        this.mostrarError('Error en la creación de la solicitud en estado inicial');
        this.spinner.hide();
        console.log('Error en la creación de la solicitud en estado inicial: ' + err);
      }
    )
  }

  cambiarNombresColumnas(): any {
    $(document).ready(function () {
        $(".columnaBienes")[0].innerText = "Código";
        $(".columnaBienes")[1].innerText = "Descripción";
        $(".columnaServicios")[0].innerText = "Código";
        $(".columnaServicios")[1].innerText = "Descripción";
    });
  }

  filtrarSubcategorias() {
    this.spinner.show();
    let categoria = this.solpFormulario.controls["categoria"].value;
    let pais = this.solpFormulario.controls["pais"].value;
    this.limpiarCondicionesContractuales();
    if (categoria != '' && pais != '') {
      this.servicio.ObtenerSubcategorias(categoria.id, pais.id).subscribe(
        (respuesta) => {
          if (respuesta.length > 0) {
            this.subcategorias = Subcategoria.fromJsonList(respuesta);
          } else {
            this.subcategorias = [];
            this.solpFormulario.controls["subcategoria"].setValue("");
          }
          this.spinner.hide();
        }, err => {
          this.mostrarError('Error obteniendo subcategorias');
          this.spinner.hide();
          console.log('Error obteniendo subcategorias: ' + err);
        }
      )
    } else {
      this.spinner.hide();
    }
  }

  cargarCondicionesContractuales() {
    this.spinner.show();
    let Subcategoria = this.solpFormulario.controls["subcategoria"].value;
    if (Subcategoria) {
      this.limpiarCondicionesContractuales();
      this.subcategoriaSeleccionada = this.subcategorias.find(s => s.id == Subcategoria.id);
      this.subcategoriaSeleccionada.condicionesContractuales.forEach(element => {
        this.condicionesContractuales.push(new CondicionContractual(element.Title, element.ID));
      });
      this.registrarControlesCondicionesContractuales();
      this.cargarDatosSubcategoria(this.subcategoriaSeleccionada);
      this.spinner.hide();
    } else {
      this.solpFormulario.controls["comprador"].setValue('');
      this.solpFormulario.controls['codigoAriba'].setValue('');
      this.spinner.hide();
    }
  }

  cargarDatosSubcategoria(subcategoriaSeleccionada: Subcategoria): any {
    let nombreComprador = (subcategoriaSeleccionada.comprador != null) ? subcategoriaSeleccionada.comprador.Title : '';
    this.compradorId = (subcategoriaSeleccionada.comprador != null) ? subcategoriaSeleccionada.comprador.Id : null;
    this.codigoAriba = (subcategoriaSeleccionada.codigoAriba != null) ? subcategoriaSeleccionada.codigoAriba : '';
    this.solpFormulario.controls["comprador"].setValue(nombreComprador);
    this.solpFormulario.controls['codigoAriba'].setValue(this.codigoAriba);
  }

  limpiarCondicionesContractuales(): any {
    this.condicionesContractuales = [];
  }

  registrarControlesCondicionesContractuales(): any {
    this.condicionesContractuales.forEach(condicionContractual => {
      this.solpFormulario.addControl('condicionContractual' + condicionContractual.id, new FormControl());
    });
  }

  async enviarSolicitud() {
    this.spinner.show();
    let respuesta;
    let estado;
    let responsable;
    let tipoSolicitud = this.solpFormulario.controls["tipoSolicitud"].value;
    let cm = this.solpFormulario.controls["cm"].value;
    let empresa = 1;
    let ordenadorGastos = this.solpFormulario.controls["ordenadorGastos"].value;
    let valorPais = this.solpFormulario.controls["pais"].value;
    let pais = valorPais.nombre;
    let categoria = this.solpFormulario.controls["categoria"].value;
    let subcategoria = this.solpFormulario.controls["subcategoria"].value;
    let comprador = this.solpFormulario.controls["comprador"].value;
    let codigoAriba = this.solpFormulario.controls["codigoAriba"].value;
    let fechaEntregaDeseada = this.solpFormulario.controls["fechaEntregaDeseada"].value;
    let alcance = this.solpFormulario.controls["alcance"].value;
    let justificacion = this.solpFormulario.controls["justificacion"].value;
    let valorcompraOrdenEstadistica = this.solpFormulario.controls["compraOrdenEstadistica"].value;
    let valornumeroOrdenEstadistica = this.solpFormulario.controls["numeroOrdenEstadistica"].value;
    let FechaDeCreacion = new Date();
    let solicitantePersona = this.usuarioActual.id;

    let datosContables = await this.consultarDatosContables()

    if (this.EsCampoVacio(tipoSolicitud)) {
      this.mostrarAdvertencia("El campo Tipo de solicitud es requerido");
      this.spinner.hide();
      return false;
    }

    // if (this.EsCampoVacio(empresa)) {
    //   this.mostrarAdvertencia("El campo Empresa es requerido");
    //   this.spinner.hide();
    //   return false;
    // }

    if (this.EsCampoVacio(ordenadorGastos)) {
      this.mostrarAdvertencia("El campo Ordenador de gastos es requerido");
      this.spinner.hide();
      return false;
    }

    if (this.EsCampoVacio(pais)) {
      this.mostrarAdvertencia("El campo País es requerido");
      this.spinner.hide();
      return false;
    }

    if (this.EsCampoVacio(categoria)) {
      this.mostrarAdvertencia("El campo Categoría es requerido");
      this.spinner.hide();
      return false;
    }

    if (this.EsCampoVacio(subcategoria)) {
      this.mostrarAdvertencia("El campo Subcategoría es requerido");
      this.spinner.hide();
      return false;
    }

    if (this.EsCampoVacio(comprador)) {
      this.mostrarAdvertencia("El campo Comprador es requerido");
      this.spinner.hide();
      return false;
    }

    if (this.EsCampoVacio(fechaEntregaDeseada)) {
      this.mostrarAdvertencia("El campo Fecha entrega deseada es requerido");
      this.spinner.hide();
      return false;
    }

    if (this.EsCampoVacio(alcance)) {
      this.mostrarAdvertencia("El campo Alcance es requerido");
      this.spinner.hide();
      return false;
    }

    if (tipoSolicitud == 'Solp' || tipoSolicitud == 'Orden a CM' || tipoSolicitud == 'Cláusula adicional') {
      if (this.EsCampoVacio(justificacion)) {
        this.mostrarAdvertencia("El campo Justificación es requerido");
        this.spinner.hide();
        return false;
      }
    }

    respuesta = this.ValidarCondicionesContractuales();
    if (respuesta == false) {
      this.spinner.hide();
      return respuesta;
    }

    respuesta = this.ValidarCompraOrdenEstadistica();
    if (respuesta == false) {
      this.spinner.hide();
      return respuesta;
    }

    respuesta = this.ValidarExistenciaCondicionesTecnicas();
    if (respuesta == false) {
      this.spinner.hide();
      return respuesta;
    }

    // if (this.condicionesTB.length > 0) {
    //   this.compraBienes = true;
    // }

    if (this.condicionesTB.length > 0) {
      this.compraBienes = true;
      respuesta = this.validarCondicionesTBdatosContables();
      if (respuesta == false) {
        this.spinner.hide();
        return respuesta;
      }
  
    }

    // if (this.condicionesTS.length > 0) {
    //   this.compraServicios = true;
    // }

    if (this.condicionesTS.length > 0) {
      this.compraServicios = true;
      respuesta = this.validarCondicionesTSdatosContables();
      if (respuesta == false) {
        this.spinner.hide();
        return respuesta;
      }
    }

    if (valorcompraOrdenEstadistica == "SI") {
      this.compraOrdenEstadistica = true;
    }

    let a = await this.validarSiEnviarCrm()

    this.servicio.obtenerResponsableProcesos(valorPais.id).subscribe(
      (respuestaResponsable) => {
        this.responsableProcesoEstado = responsableProceso.fromJsonList(respuestaResponsable);
        if (tipoSolicitud == 'Sondeo') {
          justificacion = '';
          this.fueSondeo = true;
          estado = 'Por sondear';
          responsable = subcategoria.comprador.ID;
        } else {
          if (this.compraBienes) {
            estado = 'Por verificar material';
            responsable = this.responsableProcesoEstado[0].porverificarMaterial;
          } else {
            estado = 'Por registrar solp sap';
            responsable = this.responsableProcesoEstado[0].porRegistrarSolp;
          }
        }

        // this.servicio.obtenerParametrosConfiguracion().subscribe(
        //   (respuestaConfiguracion) => {
            this.consecutivoActual = this.idSolicitudGuardada;            
            if (respuesta == true) {
              this.solicitudGuardar = new Solicitud(
                'Solicitud: ' + this.idSolicitudGuardada,
                tipoSolicitud,
                cm,
                this.usuarioActual.nombre,
                empresa,
                ordenadorGastos,
                valorPais.id,
                categoria.nombre,
                subcategoria.nombre,
                subcategoria.comprador.ID,
                codigoAriba,
                fechaEntregaDeseada,
                alcance,
                justificacion,
                this.construirJsonCondicionesContractuales(),
                estado,
                responsable,
                this.compraBienes,
                this.compraServicios,
                this.consecutivoActual,
                this.usuarioActual.id,
                null,
                this.compraOrdenEstadistica, 
                valornumeroOrdenEstadistica,
                solicitantePersona,
                null,
                this.compraBienes,
                this.compraServicios,
                this.fueSondeo,
                FechaDeCreacion);
              this.servicio.actualizarSolicitud(this.idSolicitudGuardada, this.solicitudGuardar).then(
                async (item: ItemAddResult) => {
                  if(this.enviarCrm === true && this.solpFormulario.controls['tipoSolicitud'].value !== 'Sondeo') {
                    let respuesta;
                    let objToken = {
                      TipoConsulta: "crm",
                      suscriptionKey: "c3d10e5bd16e48d3bd936bb9460bddef",
                      token: this.token,
                      estado: "true"
                    }
                    let objTokenString = JSON.stringify(objToken);
                    localStorage.setItem("id_token",objTokenString);
                    let objCrm = {
                      "numerosolp": `${this.idSolicitudGuardada}`,
                      "linksolp": `https://isaempresas.sharepoint.com/sites/INTERNEXA/Solpes_test/SiteAssets/gestion-solpes/index.aspx/ver-solicitud-tab?idSolicitud=${this.idSolicitudGuardada}`,
                      // "linksolp": "https://isaempresas.sharepoint.com/sites/INTERNEXA/Solpes/SiteAssets/gestion-solpes/index.aspx/consulta-general",
                      "idservicios": this.dataTotalIds
                    }
                    let obj = {
                      Title: `Solicitud ${this.idSolicitudGuardada}`,
                      NroSolp: `${this.idSolicitudGuardada}`,
                      EnlaceSolp: `https://isaempresas.sharepoint.com/sites/INTERNEXA/Solpes_test/SiteAssets/gestion-solpes/index.aspx/ver-solicitud-tab?idSolicitud=${this.idSolicitudGuardada}`, 
                      // EnlaceSolp: 'https://isaempresas.sharepoint.com/sites/INTERNEXA/Solpes/SiteAssets/gestion-solpes/index.aspx/consulta-general',
                      IdServicios: this.dataTotalIds.toString()
                    }
                    respuesta = await this.enviarServicioSolicitud(objCrm);
                    if (respuesta.statusCode === 200) {
                      this.MostrarExitoso(respuesta["MensajeExito"]);
                    }
                    else {
                     this.servicio.enviarFallidosListaCrm(obj).then(
                       (item: ItemAddResult) => {
                         console.log('Entre a fallidos');
                          let cuerpo = '<p>Cordial Saludo</p>' +
                          '<br>' +
                          '<p>La orden <strong>' + this.idSolicitudGuardada + '</strong> requiere de su intervención para enviar los datos al CRM</p>' +
                          '<br>' +
                          '<p>Puede consultarla en <a href="https://enovelsoluciones.sharepoint.com/sites/jam/solpes/SiteAssets/gestion-solpes-2/index.aspx/gestion-errores" target="_blank>este enlace</a></p>'
                          const emailProps: EmailProperties = {
                            To: [this.soporte],
                            Subject: "Notificación de soporte",
                            Body: cuerpo
                          }
                           this.servicio.EnviarNotificacion(emailProps).then(
                            (res) => {
                              this.mostrarInformacion('Se enviaron los datos para manejo más tarde')    
                            }
                          ), error => {
                            console.log(error);
                          }
                        }
                      ), error => {
                        this.mostrarError('No se pudo almacenar la solicitud en la lista Solicitudes CRM')
                      }
                      // let repsuestaGuardarError = await this.GuardarErrorSolicitudCrm(obj);
                      // this.mostrarError('No se pudo enviar a crm. Se guardaron los datos en la lista de gestión de errores');
                    }
                  }
                  // this.servicio.actualizarConsecutivo(consecutivoNuevo).then(
                  //   (item: ItemAddResult) => {
                      let notificacion = {
                        IdSolicitud: this.idSolicitudGuardada.toString(),
                        ResponsableId: responsable,
                        Estado: estado
                      };
                      await this.servicio.agregarNotificacion(notificacion).then(
                        (item: ItemAddResult) => {
                          this.MostrarExitoso("La solicitud se ha guardado y enviado correctamente");
                          this.spinner.hide();
                          this.router.navigate(['/mis-solicitudes']);
                        }, err => {
                          this.mostrarError('Error agregando la notificación');
                          this.spinner.hide();
                        }
                      )
                    // }, err => {
                    //   this.mostrarError('Error en la actualización del consecutivo');
                    //   this.spinner.hide();
                    // }
                  // )
                }, err => {
                  this.mostrarError('Error en el envío de la solicitud');
                  this.spinner.hide();
                }
              )
            }
        //   }, err => {
        //     this.mostrarError('Error en obtener parámetros de configuración');
        //     this.spinner.hide();
        //   }
        // )// aqui
      }, err => {
        this.mostrarError('Error obteniendo responsable procesos: ' + err);
        this.spinner.hide();
      }
    )
  }
  

  async enviarServicioSolicitud(obj): Promise<any>{
    let respuesta;
    await this.servicioCrm.ActualizarSolicitud(obj).then(
      (res)=>{
        respuesta = res;
      },
      (error)=> {
        respuesta = error.error
      }
    )   
    return respuesta;
  }

  async GuardarErrorSolicitudCrm(ObjSolicitudCrm): Promise<any>{
    let respuesta;
    await this.servicio.GuardarSolicitudCrm(ObjSolicitudCrm).then(
      (res)=>{
        respuesta = true;
        this.mostrarInformacion('Se guardó la solicitud para que pueda ser enviada a CRM más tarde');
      }
    ).catch(
      (error)=>{
        respuesta = false;
      }
    );

    return respuesta;
  }

  ValidarCompraOrdenEstadistica(): boolean {
    let respuesta = true;
    let solicitud = this.solpFormulario.controls['tipoSolicitud'].value;
    let valorOrdenEstadistica = this.solpFormulario.controls["compraOrdenEstadistica"].value;
    let valorNumeroOrdenEstadistica = this.solpFormulario.controls["numeroOrdenEstadistica"].value;
    if(valorOrdenEstadistica === '' && solicitud !== 'Sondeo') {
      this.mostrarAdvertencia('Por favor seleccione Orden estadística')
      respuesta = false; 
    }
    if(solicitud === 'Sondeo' && valorOrdenEstadistica === 'NO') {
      respuesta = true;
    }
    else if(valorOrdenEstadistica === 'NO') {
      respuesta = true;
    }
    else if(valorOrdenEstadistica === 'SI' && solicitud !== 'Sondeo') {
      if(this.EsCampoVacio(valorNumeroOrdenEstadistica)) {
        this.mostrarAdvertencia("El campo Número de orden estadística es requerido");
        respuesta = false;
      }
    }
    return respuesta;
  }

  ValidarExistenciaCondicionesTecnicas(): boolean {
    let respuesta = true;
    if (this.condicionesTB.length == 0 && this.condicionesTS.length == 0) {
      this.mostrarAdvertencia("Debe existir condiciones técnicas de bienes o condiciones técnicas de servicios");
      respuesta = false;
    }
    return respuesta;
  }

  construirJsonCondicionesContractuales(): string {
    this.cadenaJsonCondicionesContractuales = '';
    if (this.condicionesContractuales.length > 0) {
      this.cadenaJsonCondicionesContractuales += ('{ "condiciones":[');
      this.condicionesContractuales.forEach(condicionContractual => {
        let textoCajon = this.solpFormulario.controls['condicionContractual' + condicionContractual.id].value;
        if (textoCajon != null) {
          var json = textoCajon.replace(/["]/g, "\"");
           json = json.replace(/[{]/g, "[");
           json = json.replace(/[}]/g, "]");
           json = json.replace(/[\t]/g, "\t");
           json = json.replace(/[\n]/g, "\n");
           this.jsonCondicionesContractuales = json 
          // this.jsonCondicionesContractuales = json.replace(/(\r\n|\n|\r|\t)/gm," ");
          this.cadenaJsonCondicionesContractuales += ('{"campo": "' + condicionContractual.nombre + '", "descripcion": "' + this.jsonCondicionesContractuales + '"},');
        }
      });
      this.cadenaJsonCondicionesContractuales = this.cadenaJsonCondicionesContractuales.substring(0, this.cadenaJsonCondicionesContractuales.length - 1);
      this.cadenaJsonCondicionesContractuales += (']}')
    }
    return this.cadenaJsonCondicionesContractuales;
  }

  private ValidarCondicionesContractuales(): boolean {
    let respuesta = true;
    this.condicionesContractuales.forEach(element => {
      let condicionContractual = this.solpFormulario.controls["condicionContractual" + element.id].value;
      if (this.EsCampoVacio(condicionContractual)) {
        this.mostrarAdvertencia("Hay condiciones contractuales sin llenar: " + element.nombre);
        respuesta = false;
      }
    });

    return respuesta;
  }


  // habilitar cuando datos contables no obligatorios en sondeo

  private validarCondicionesTSdatosContables(): boolean {
    let respuesta = true;
    let tipoSolicitud = this.solpFormulario.get('tipoSolicitud').value;
    if (this.cargaExcelServicios === false) {
      let indexCostoInversion = this.condicionesTS.map(e => { return e.costoInversion }).indexOf('');
      // let indexCostoInversion =this.condicionesTS.map(function(e) { return e.costoInversion; }).indexOf(null);
      let indexNumeroCostoInversion = this.condicionesTS.map(e => { return e.numeroCostoInversion; }).indexOf('');
      let indexNumeroCuenta = this.condicionesTS.map(e => { return e.numeroCuenta; }).indexOf('');
      let valorOrdenEstadistica = this.solpFormulario.controls["compraOrdenEstadistica"].value;

      if ((tipoSolicitud === 'Solp' || tipoSolicitud === 'Orden a CM' || tipoSolicitud === 'Cláusual adicional') && valorOrdenEstadistica == "NO" && (indexCostoInversion > -1 || indexNumeroCostoInversion > -1 || indexNumeroCuenta > -1)) {
        this.mostrarAdvertencia("Hay datos contables sin llenar en condiciones técnicas de servicios");
        respuesta = false;
      }
    }
    else if (this.cargaExcelServicios) {
      let indexCostoInversion = this.condicionesTS.map(e => { return e.costoInversion }).indexOf(null);
      // let indexCostoInversion =this.condicionesTS.map(function(e) { return e.costoInversion; }).indexOf(null);
      let indexNumeroCostoInversion = this.condicionesTS.map(e => { return e.numeroCostoInversion; }).indexOf(null);
      let indexNumeroCuenta = this.condicionesTS.map(e => { return e.numeroCuenta; }).indexOf(null);
      let valorOrdenEstadistica = this.solpFormulario.controls["compraOrdenEstadistica"].value;

      if ((tipoSolicitud === 'Solp' || tipoSolicitud === 'Orden a CM' || tipoSolicitud === 'Cláusual adicional') && valorOrdenEstadistica == "NO" && (indexCostoInversion > -1 || indexNumeroCostoInversion > -1 || indexNumeroCuenta > -1)) {
        this.mostrarAdvertencia("Hay datos contables sin llenar en condiciones técnicas de servicios");
        respuesta = false;
      }
    } 
    return respuesta;
   }

  //hasta aquí



//eliminar cuando datos contables no obligatorios en sondeo
  // private validarCondicionesTSdatosContables(): boolean {
  //   let respuesta = true;
  //   // let costoInversion = this.ctsFormulario.controls["cecoCTS"].value;
  //   // let numeroCostoInversion = this.ctsFormulario.controls["numCicoCTS"].value;
  //   // let numeroCuenta = this.ctsFormulario.controls["numCuentaCTS"].value;
  //   let indexCostoInversion =this.condicionesTS.map(function(e) { return e.costoInversion; }).indexOf(null);
  //   let indexNumeroCostoInversion =this.condicionesTS.map(function(e) { return e.numeroCostoInversion; }).indexOf(null);
  //   let indexNumeroCuenta =this.condicionesTS.map(function(e) { return e.numeroCuenta; }).indexOf(null);
  //   let valorOrdenEstadistica = this.solpFormulario.controls["compraOrdenEstadistica"].value;
  //   // if(valorOrdenEstadistica == "NO" && (costoInversion === "" || costoInversion === null) && (numeroCostoInversion === "" || numeroCostoInversion === null) && (numeroCuenta === "" || numeroCuenta === null)) {
  //   //    this.mostrarAdvertencia("Hay datos contables sin llenar en condiciones técnicas de servicios");
  //   //    respuesta = false;
  //   // }
  //   if (valorOrdenEstadistica == "NO" && indexCostoInversion > -1 && indexNumeroCostoInversion > -1 && indexNumeroCuenta > -1){
  //    this.mostrarAdvertencia("Hay datos contables sin llenar en condiciones técnicas de servicios");
  //    respuesta = false;
  //   }
  //   return respuesta;
  //  }                                  // hasta aquí

                                    //Habilitar cuando datos contables no obligatorios
   private validarCondicionesTBdatosContables(): boolean {
   
    let respuesta = true;
    let tipoSolicitud = this.solpFormulario.get('tipoSolicitud').value;
     if (this.cargaExcel === false) {
       let indexCostoInversion = this.condicionesTB.map(e => { return e.costoInversion; }).indexOf('');
       let indexNumeroCostoInversion = this.condicionesTB.map(e => { return e.numeroCostoInversion; }).indexOf('');
       let indexNumeroCuenta = this.condicionesTB.map(e => { return e.numeroCuenta; }).indexOf('');
       let valorOrdenEstadistica = this.solpFormulario.controls["compraOrdenEstadistica"].value;
       // if(valorOrdenEstadistica == "NO" && (costoInversion === null || costoInversion === "") && (numeroCostoInversion === null || numeroCostoInversion === "") && (numeroCuenta === "" || numeroCuenta === null)){
       //   this.mostrarAdvertencia("Hay datos contables sin llenar en condiciones técnicas de bienes");
       //  respuesta = false;
       // }

       if ((tipoSolicitud === 'Solp' || tipoSolicitud === 'Orden a CM' || tipoSolicitud === 'Cláusula adicional') && valorOrdenEstadistica == "NO" && (indexCostoInversion > -1 || indexNumeroCostoInversion > -1 || indexNumeroCuenta > -1)) {
         this.mostrarAdvertencia("Hay datos contables sin llenar en condiciones técnicas de bienes");
         respuesta = false;
       }
     }
     else if (this.cargaExcel) {
      let indexCostoInversion = this.condicionesTB.map(e => { return e.costoInversion; }).indexOf(null);
      let indexNumeroCostoInversion = this.condicionesTB.map(e => { return e.numeroCostoInversion; }).indexOf(null);
      let indexNumeroCuenta = this.condicionesTB.map(e => { return e.numeroCuenta; }).indexOf(null);
      let valorOrdenEstadistica = this.solpFormulario.controls["compraOrdenEstadistica"].value;
      // if(valorOrdenEstadistica == "NO" && (costoInversion === null || costoInversion === "") && (numeroCostoInversion === null || numeroCostoInversion === "") && (numeroCuenta === "" || numeroCuenta === null)){
      //   this.mostrarAdvertencia("Hay datos contables sin llenar en condiciones técnicas de bienes");
      //  respuesta = false;
      // }

      if ((tipoSolicitud === 'Solp' || tipoSolicitud === 'Orden a CM' || tipoSolicitud === 'Cláusula adicional') && valorOrdenEstadistica == "NO" && (indexCostoInversion > -1 || indexNumeroCostoInversion > -1 || indexNumeroCuenta > -1)) {
        this.mostrarAdvertencia("Hay datos contables sin llenar en condiciones técnicas de bienes");
        respuesta = false;
      }
     }
    // let costoInversion = this.ctbFormulario.controls["cecoCTB"].value;
    // let numeroCostoInversion = this.ctbFormulario.controls["numCicoCTB"].value;
    // let numeroCuenta = this.ctbFormulario.controls["numCuentaCTB"].value;
    
     return respuesta; 
   }
                                 //hasta aquí


  //eliminar cuando datos contables no obligatorios
  // private validarCondicionesTBdatosContables(): boolean {
   
  //   let respuesta = true;
  //   // let costoInversion = this.ctbFormulario.controls["cecoCTB"].value;
  //   // let numeroCostoInversion = this.ctbFormulario.controls["numCicoCTB"].value;
  //   // let numeroCuenta = this.ctbFormulario.controls["numCuentaCTB"].value;
  //   let indexCostoInversion =this.condicionesTB.map(function(e) { return e.costoInversion; }).indexOf(null);
  //   let indexNumeroCostoInversion =this.condicionesTB.map(function(e) { return e.numeroCostoInversion; }).indexOf(null);
  //   let indexNumeroCuenta =this.condicionesTB.map(function(e) { return e.numeroCuenta; }).indexOf(null);
  //   let valorOrdenEstadistica = this.solpFormulario.controls["compraOrdenEstadistica"].value;
  //   // if(valorOrdenEstadistica == "NO" && (costoInversion === null || costoInversion === "") && (numeroCostoInversion === null || numeroCostoInversion === "") && (numeroCuenta === "" || numeroCuenta === null)){
  //   //   this.mostrarAdvertencia("Hay datos contables sin llenar en condiciones técnicas de bienes");
  //   //  respuesta = false;
  //   // }
  //   if (valorOrdenEstadistica == "NO" && indexCostoInversion > -1 && indexNumeroCostoInversion > -1 && indexNumeroCuenta > -1){
  //    this.mostrarAdvertencia("Hay datos contables sin llenar en condiciones técnicas de bienes");
  //    respuesta = false;
  //   }
  //   return respuesta; 
  //  } // Hasta aquí

  EsCampoVacio(valorCampo: string) {
    if (valorCampo === "" || valorCampo == 'Seleccione' || valorCampo == null) {
      return true;
    }
    return false;
  }

  salir() {
    this.router.navigate(["/mis-solicitudes"]);
  }

  // abrirModalCTB(template: TemplateRef<any>) {
  //   this.setDatosContablesBienes = false;
  //   this.selectAll = false;
  //   this.dataIdOrdenSeleccionados = [];
  //   this.condicionTB = new CondicionTecnicaBienes(null, '', null, '', '', '', '', null, null, '', null, '', '');
  //   let solicitudTipo = this.solpFormulario.controls["tipoSolicitud"].value
  //   let paisValidar = this.solpFormulario.controls["pais"].value.nombre
  //   let ordenEstadistica = this.solpFormulario.controls['compraOrdenEstadistica'].value;
  //   this.mostrarFiltroBienes = false;
  //   this.mostrarTable = false;
  //   if(solicitudTipo !== '' && solicitudTipo !== 'Sondeo' && ordenEstadistica === '') {
  //     this.mostrarAdvertencia('Debe seleccionar la orden estadística');
  //     return false;
  //   }
  //   if(solicitudTipo === "" || solicitudTipo === null || solicitudTipo === undefined || paisValidar === "" || paisValidar === null || paisValidar === undefined) {
  //     this.mostrarAdvertencia('Debe selccionar el tipo de solicitud y el país antes de agregar bienes')
  //     return false;
  //   }
  //   else {
  //   this.mostrarAdjuntoCTB = false;
  //   this.limpiarControlesCTB();
  //   this.tituloModalCTB = "Agregar bien";
  //   this.textoBotonGuardarCTB = "Guardar";
  //   this.modalRef = this.modalServicio.show(
  //     template,
  //     Object.assign({}, { class: 'gray modal-lg' })
  //   );
  //   }
  // }

  abrirModalCTB() {
    this.setDatosContablesBienes = false;
    this.selectAll = false;
    this.dataIdOrdenSeleccionados = [];
    this.condicionTB = new CondicionTecnicaBienes(null, '', null, '', '', '', '', null, null, '', null, '', '');
    let solicitudTipo = this.solpFormulario.controls["tipoSolicitud"].value
    let paisValidar = this.solpFormulario.controls["pais"].value.nombre
    let ordenEstadistica = this.solpFormulario.controls['compraOrdenEstadistica'].value;
    this.mostrarFiltroBienes = false;
    this.mostrarTable = false;
    if(solicitudTipo !== '' && solicitudTipo !== 'Sondeo' && ordenEstadistica === '') {
      this.mostrarAdvertencia('Debe seleccionar la orden estadística');
      return false;
    }
    if(solicitudTipo === "" || solicitudTipo === null || solicitudTipo === undefined || paisValidar === "" || paisValidar === null || paisValidar === undefined) {
      this.mostrarAdvertencia('Debe selccionar el tipo de solicitud y el país antes de agregar bienes')
      return false;
    }
    else {
    this.mostrarAdjuntoCTB = false;
    this.limpiarControlesCTB();
    this.tituloModalCTB = "Agregar bien";
    this.textoBotonGuardarCTB = "Guardar";
    this.isModalCTBShown = true;
    // this.modalRef = this.modalServicio.show(
    //   template,
    //   Object.assign({}, { class: 'gray modal-lg' })
    // );
    }
  }

  hideModalCTB(): void {
    this.autoShownModalCTB.hide();
  }
 
  onHiddenCTB(): void {
    this.isModalCTBShown = false;
  }

  abrirModalCTS() {
    this.setDatosContablesServicios = false;
    this.selectAllServicios = false;
    this.dataIdOrdenSeleccionadosServicios = [];
    this.condicionTS = new CondicionTecnicaServicios(null, '', null, '', '', null, null, '', null, '', '');
    let solicitudTipo = this.solpFormulario.controls["tipoSolicitud"].value
    let paisValidar = this.solpFormulario.controls["pais"].value.nombre;
    let ordenEstadistica = this.solpFormulario.controls['compraOrdenEstadistica'].value;
    if(solicitudTipo !== '' && solicitudTipo !== 'Sondeo' && ordenEstadistica === '') {
      this.mostrarAdvertencia('Debe seleccionar la orden estadística');
      return false;
    }
    if(solicitudTipo === "" || solicitudTipo === null || solicitudTipo === undefined || paisValidar === "" || paisValidar === null || paisValidar === undefined) {
      this.mostrarAdvertencia('Debe selccionar el tipo de solicitud y el país antes de agregar servicios')
      return false;
    }
    else {
    this.mostrarAdjuntoCTS = false;
    this.limpiarControlesCTS();
    this.tituloModalCTS = "Agregar servicio";
    this.textoBotonGuardarCTS = "Guardar";
    this.isModalShownCTS = true;
    // this.modalRef = this.modalServicio.show(
    //   template,
    //   Object.assign({}, { class: 'gray modal-lg' })
    // );
    }
  }

  hideModalCTS(): void {
    this.autoShownModalCTS.hide();
  }
 
  onHiddenCTS(): void {
    this.isModalShownCTS = false;
  }

  // abrirModalCTS(template: TemplateRef<any>) {
  //   this.setDatosContablesServicios = false;
  //   this.selectAllServicios = false;
  //   this.dataIdOrdenSeleccionadosServicios = [];
  //   this.condicionTS = new CondicionTecnicaServicios(null, '', null, '', '', null, null, '', null, '', '');
  //   let solicitudTipo = this.solpFormulario.controls["tipoSolicitud"].value
  //   let paisValidar = this.solpFormulario.controls["pais"].value.nombre;
  //   let ordenEstadistica = this.solpFormulario.controls['compraOrdenEstadistica'].value;
  //   if(solicitudTipo !== '' && solicitudTipo !== 'Sondeo' && ordenEstadistica === '') {
  //     this.mostrarAdvertencia('Debe seleccionar la orden estadística');
  //     return false;
  //   }
  //   if(solicitudTipo === "" || solicitudTipo === null || solicitudTipo === undefined || paisValidar === "" || paisValidar === null || paisValidar === undefined) {
  //     this.mostrarAdvertencia('Debe selccionar el tipo de solicitud y el país antes de agregar servicios')
  //     return false;
  //   }
  //   else {
  //   this.mostrarAdjuntoCTS = false;
  //   this.limpiarControlesCTS();
  //   this.tituloModalCTS = "Agregar servicio";
  //   this.textoBotonGuardarCTS = "Guardar";
  //   this.modalRef = this.modalServicio.show(
  //     template,
  //     Object.assign({}, { class: 'gray modal-lg' })
  //   );
  //   }
  // }

  
                          //Habilitar cuando datos contables no obligatorios

  abrirModalArchivoCsvBienes(template: TemplateRef<any>) {
    let solicitudTipo = this.solpFormulario.controls["tipoSolicitud"].value
    let paisValidar = this.solpFormulario.controls["pais"].value.nombre
    let ordenEstadistica = this.solpFormulario.controls['compraOrdenEstadistica'].value;
    if(solicitudTipo !== '' && solicitudTipo !== 'Sondeo' && ordenEstadistica === '') {
      this.mostrarAdvertencia('Debe seleccionar la orden estadística');
      return false;
    }
    if(solicitudTipo === "" || solicitudTipo === null || solicitudTipo === undefined || paisValidar === "" || paisValidar === null || paisValidar === undefined) {
      this.mostrarAdvertencia('Debe selccionar el tipo de solicitud y el país antes de agregar bienes')
      return false;
    }
    else {
      this.modalRef = this.modalServicio.show(
        template,
        Object.assign({}, {class: 'gray modal-lg'})
      );
      this.cargaExcel = true;
    }
  }                                        // hasta aquí


                    //Eliminar cuando datos contables no obligatorios
  //  abrirModalArchivoCsvBienes(template: TemplateRef<any>) {
  //   let solicitudTipo = this.solpFormulario.controls["tipoSolicitud"].value
  //   let paisValidar = this.solpFormulario.controls["pais"].value.nombre
  //   if(solicitudTipo === "" || solicitudTipo === null || solicitudTipo === undefined || paisValidar === "" || paisValidar === null || paisValidar === undefined) {
  //     this.mostrarAdvertencia('Debe selccionar el tipo de solicitud y el país antes de agregar servicios')
  //     return false;
  //   }
  //   else {
  //     this.modalRef = this.modalServicio.show(
  //       template,
  //       Object.assign({}, {class: 'gray modal-lg'})
  //     )
  //   }
  // }                                 // Hasta aquí

  
                                  //Habilitar cuando datos contables no obligatorios
  abrirModalArchivoCsvServicios(template: TemplateRef<any>) {
    let solicitudTipo = this.solpFormulario.controls["tipoSolicitud"].value
    let paisValidar = this.solpFormulario.controls["pais"].value.nombre
    let ordenEstadistica = this.solpFormulario.controls['compraOrdenEstadistica'].value;
    if(solicitudTipo !== '' && solicitudTipo !== 'Sondeo' && ordenEstadistica === '') {
      this.mostrarAdvertencia('Debe seleccionar la orden estadística');
      return false;
    }
    if(solicitudTipo === "" || solicitudTipo === null || solicitudTipo === undefined || paisValidar === "" || paisValidar === null || paisValidar === undefined) {
      this.mostrarAdvertencia('Debe selccionar el tipo de solicitud y el país antes de agregar servicios')
      return false;
    }
    else{
      this.modalRef = this.modalServicio.show(
        template,
        Object.assign({}, {class: 'gray modal-lg'})
      )
      this.cargaExcelServicios = true;
    }
  }                                          // Hasta aquí

//------------------------------Eliminar cuando datos contables no obligatorios---------------------
  // abrirModalArchivoCsvServicios(template: TemplateRef<any>) {
  //   let solicitudTipo = this.solpFormulario.controls["tipoSolicitud"].value
  //   let paisValidar = this.solpFormulario.controls["pais"].value.nombre
  //   if(solicitudTipo === "" || solicitudTipo === null || solicitudTipo === undefined || paisValidar === "" || paisValidar === null || paisValidar === undefined) {
  //     this.mostrarAdvertencia('Debe selccionar el tipo de solicitud y el país antes de agregar servicios')
  //     return false;
  //   }
  //   else{
  //     this.modalRef = this.modalServicio.show(
  //       template,
  //       Object.assign({}, {class: 'gray modal-lg'})
  //     )
  //   }
  // }
 // --------------------------------------Hasta aquí-----------------------------------------------


  ctbOnSubmit() {
    this.ctbSubmitted = true;
    this.mostrarFiltroBienes = false;
    
    if (this.ctbFormulario.invalid) {
      return;
    }


    //-------------------Eliminar cuando datos contables no obligatorios (revisar nuevos datos)-----------------
    // this.spinner.show();
    // let solicitudTipo = this.solpFormulario.controls["tipoSolicitud"].value
    // let paisValidar = this.solpFormulario.controls["pais"].value.nombre
    // let codigo = this.ctbFormulario.controls["codigoCTB"].value;
    // let descripcion = this.ctbFormulario.controls["descripcionCTB"].value;
    // let modelo = this.ctbFormulario.controls["modeloCTB"].value;
    // let fabricante = this.ctbFormulario.controls["fabricanteCTB"].value;
    // let cantidad = this.ctbFormulario.controls["cantidadCTB"].value;
    // let valorEstimado = this.ctbFormulario.controls["valorEstimadoCTB"].value;
    // let tipoMoneda = this.ctbFormulario.controls["tipoMonedaCTB"].value;
    // let comentarios = this.ctbFormulario.controls["comentariosCTB"].value;
    // let costoInversion = this.ctbFormulario.controls["cecoCTB"].value;
    // let numeroCostoInversion = this.ctbFormulario.controls["numCicoCTB"].value;
    // let numeroCuenta = this.ctbFormulario.controls["numCuentaCTB"].value;
    // let adjunto = null;
    // let idOrdenServicio;
    // let tieneIdServicio;
    // if(costoInversion === 'ID de Servicios') {
    //   tieneIdServicio = true;
    //   idOrdenServicio = this.dataIdOrdenSeleccionados.toString();
    // }
    // else {
    //   tieneIdServicio = false;
    //   idOrdenServicio = [];
    // }
    //---------------------------------------------Hasta aquí---------------------------------------

    //--------------------------Habilitar cuando datos contables no obligatorios------------------
    this.spinner.show();
    let solicitudTipo = this.solpFormulario.controls["tipoSolicitud"].value
    let paisValidar = this.solpFormulario.controls["pais"].value.nombre
    let codigo = this.ctbFormulario.controls["codigoCTB"].value;
    let descripcion = this.ctbFormulario.controls["descripcionCTB"].value;
    let modelo = this.ctbFormulario.controls["modeloCTB"].value;
    let fabricante = this.ctbFormulario.controls["fabricanteCTB"].value;
    let cantidad = this.ctbFormulario.controls["cantidadCTB"].value;
    let valorEstimado = this.ctbFormulario.controls["valorEstimadoCTB"].value;
    let tipoMoneda = this.ctbFormulario.controls["tipoMonedaCTB"].value;
    let comentarios = this.ctbFormulario.controls["comentariosCTB"].value;
    let costoInversion; 
    solicitudTipo !== 'Sondeo' ? costoInversion = this.ctbFormulario.controls["cecoCTB"].value : costoInversion = ""
    let numeroCostoInversion;
    solicitudTipo !== 'Sondeo' ? numeroCostoInversion = this.ctbFormulario.controls["numCicoCTB"].value : numeroCostoInversion = ""
    let numeroCuenta;
    solicitudTipo !== 'Sondeo' ? numeroCuenta = this.ctbFormulario.controls["numCuentaCTB"].value : numeroCuenta = ""
    let adjunto = null;
    let tieneIdServicio;
    let idOrdenServicio;
    // costoInversion === 'ID de Servicios' ? tieneIdServicio = true : tieneIdServicio = false;
    if(costoInversion === 'ID de Servicios') {
        tieneIdServicio = true;
        idOrdenServicio = this.dataIdOrdenSeleccionados.toString();
      }
      else {
        tieneIdServicio = false;
        idOrdenServicio = '';
      }
    //-----------------------------------------Hasta aquí--------------------------------------------------


    if((solicitudTipo === 'Solp' || solicitudTipo === 'Orden a CM' || solicitudTipo === 'Cláusula adicional') && paisValidar === 'Brasil' && (codigo === "" || codigo === null || codigo === undefined)) {
      this.mostrarError('El código de bienes es obligatorio para Brasil')
      this.spinner.hide();
      return false;
    }

    if (this.condicionTB == null) {
      this.condicionTB = new CondicionTecnicaBienes(null, '', null, '', '', '', '', null, null, '', null, '', '');
    }      
    if(this.condicionTB.archivoAdjunto != null)
    {
      adjunto = this.condicionTB.archivoAdjunto.name;          
    }   
    if (this.textoBotonGuardarCTB == "Guardar") {
      
      this.condicionTB.indice = this.indiceCTB;
      this.condicionTB.titulo = "Condición Técnicas Bienes " + new Date().toDateString();
      this.condicionTB.idSolicitud = this.idSolicitudGuardada;

      this.condicionTB.codigo = codigo;
      this.condicionTB.descripcion = descripcion;
      this.condicionTB.modelo = modelo;
      this.condicionTB.fabricante = fabricante;
      this.condicionTB.cantidad = cantidad;

      this.condicionTB.valorEstimado = valorEstimado.toString();
      this.condicionTB.tipoMoneda = tipoMoneda;
      this.condicionTB.comentarios = comentarios;
      this.condicionTB.costoInversion = costoInversion;
      this.condicionTB.numeroCostoInversion = numeroCostoInversion;
      this.condicionTB.numeroCuenta = numeroCuenta;
      this.condicionTB.tieneIdServicio = tieneIdServicio;
      this.condicionTB.idOrdenServicio = idOrdenServicio
      if (adjunto != null) {
        let nombreArchivo = "solp-" + this.generarllaveSoporte() + "-" + this.condicionTB.archivoAdjunto.name;
        this.servicio.agregarCondicionesTecnicasBienes(this.condicionTB).then(
          (item: ItemAddResult) => {
            this.condicionTB.id = item.data.Id;
            this.servicio.agregarAdjuntoCondicionesTecnicasBienes(this.condicionTB.id, nombreArchivo, this.condicionTB.archivoAdjunto).then(
              (respuesta) => {
                this.condicionTB.rutaAdjunto = environment.urlRaiz + respuesta.data.ServerRelativeUrl;
                this.condicionesTB.push(this.condicionTB);
                this.indiceCTB++;
                this.CargarTablaCTB();
                this.limpiarControlesCTB();
                this.mostrarInformacion("Condición técnica de bienes agregada correctamente");
                this.autoShownModalCTB.hide();
                // this.modalRef.hide();
                this.condicionTB = null;
                this.spinner.hide();
                this.ctbSubmitted = false;
                this.condicionTB = new CondicionTecnicaBienes(null, '', null, '', '', '', '', null, null, '', null, '', '');
              }, err => {
                this.mostrarError('Error adjuntando el archivo en las condiciones técnicas de bienes');
                this.spinner.hide();
              }
            )
          }, err => {
            this.mostrarError('Error en la creación de la condición técnica de bienes');
            this.spinner.hide();
          }
        )
      } else {
        this.servicio.agregarCondicionesTecnicasBienes(this.condicionTB).then(
          (item: ItemAddResult) => {
            this.condicionTB.id = item.data.Id;
            this.condicionesTB.push(this.condicionTB);
            this.indiceCTB++;
            this.CargarTablaCTB();
            this.limpiarControlesCTB();
            this.mostrarInformacion("Condición técnica de bienes agregada correctamente");
            this.autoShownModalCTB.hide();
            // this.modalRef.hide();
            this.condicionTB = null;
            this.spinner.hide();
            this.ctbSubmitted = false;

            this.condicionTB = new CondicionTecnicaBienes(null, '', null, '', '', '', '', null, null, '', null, '', '');
          }, err => {
            this.mostrarError('Error en la creación de la condición técnica de bienes');
            this.spinner.hide();
           
          }
        )
      }
    }

    if (this.textoBotonGuardarCTB == "Actualizar") {
      // this.validarCodigosBrasil();
      if (adjunto == null) {
        this.condicionTB = new CondicionTecnicaBienes(this.indiceCTBActualizar, "Condición Técnicas Bienes" + new Date().toDateString(), this.idSolicitudGuardada, codigo, descripcion, modelo, fabricante, cantidad, valorEstimado.toString(), comentarios, null, '', tipoMoneda,null, costoInversion, numeroCostoInversion, numeroCuenta, null, tieneIdServicio, idOrdenServicio);
        this.condicionTB.id = this.idCondicionTBGuardada;
        this.servicio.actualizarCondicionesTecnicasBienes(this.condicionTB.id, this.condicionTB).then(
          (item: ItemAddResult) => {
            let objIndex = this.condicionesTB.findIndex((obj => obj.indice == this.condicionTB.indice));
            this.condicionesTB[objIndex].indice = this.condicionTB.indice;
            this.condicionesTB[objIndex].codigo = this.condicionTB.codigo;
            this.condicionesTB[objIndex].descripcion = this.condicionTB.descripcion;
            this.condicionesTB[objIndex].modelo = this.condicionTB.modelo;
            this.condicionesTB[objIndex].fabricante = this.condicionTB.fabricante;
            this.condicionesTB[objIndex].cantidad = this.condicionTB.cantidad;
            this.condicionesTB[objIndex].valorEstimado = this.condicionTB.valorEstimado;
            this.condicionesTB[objIndex].tipoMoneda = this.condicionTB.tipoMoneda;
            this.condicionesTB[objIndex].comentarios = this.condicionTB.comentarios;
            this.condicionesTB[objIndex].costoInversion = this.condicionTB.costoInversion;
            this.condicionesTB[objIndex].numeroCostoInversion = this.condicionTB.numeroCostoInversion;
            this.condicionesTB[objIndex].numeroCuenta = this.condicionTB.numeroCuenta;
            this.condicionesTB[objIndex].id = this.condicionTB.id;
            this.condicionesTB[objIndex].tieneIdServicio = this.condicionTB.tieneIdServicio;
            // this.condicionesTB[objIndex].idOrdenServicio = idOrdenServicio;
            this.condicionesTB[objIndex].idOrdenServicio = this.condicionTB.idOrdenServicio;
            this.CargarTablaCTB();
            this.limpiarControlesCTB();
            this.mostrarInformacion("Condición técnica de bienes actualizada correctamente");
            this.autoShownModalCTB.hide();
            // this.modalRef.hide();
            this.spinner.hide();
            this.ctbSubmitted = false;
            this.condicionTB = new CondicionTecnicaBienes(null, '', null, '', '', '', '', null, null, '', null, '', '');
          }, err => {
            this.mostrarError('Error en la actualización de la condición técnica de bienes');
            this.spinner.hide();
          }
        )
      } 
      else {
        this.condicionTB.id = this.idCondicionTBGuardada;
        this.condicionTB.indice = this.indiceCTBActualizar;
        this.condicionTB.titulo = "Condición Técnicas Bienes" + new Date().toDateString();
        this.condicionTB.idSolicitud = this.idSolicitudGuardada;
        this.condicionTB.codigo = codigo;
        this.condicionTB.descripcion = descripcion;
        this.condicionTB.modelo = modelo;
        this.condicionTB.fabricante = fabricante;
        this.condicionTB.cantidad = cantidad;
        this.condicionTB.valorEstimado = valorEstimado.toString();
        this.condicionTB.comentarios = comentarios;
        this.condicionTB.costoInversion = costoInversion;
        this.condicionTB.numeroCostoInversion = numeroCostoInversion;
        this.condicionTB.numeroCuenta = numeroCuenta;
        this.condicionTB.tipoMoneda = tipoMoneda;
        this.condicionTB.tieneIdServicio = tieneIdServicio;
        this.condicionTB.idOrdenServicio = idOrdenServicio;
        let nombreArchivo = "solp-" + this.generarllaveSoporte() + "-" + this.condicionTB.archivoAdjunto.name;

        let nombreArchivoBorrar = null;
        if(this.rutaAdjuntoCTB != "")
        {
          nombreArchivoBorrar = this.rutaAdjuntoCTB.split('/');
        }
          
        if (this.rutaAdjuntoCTB == '') {
          this.servicio.actualizarCondicionesTecnicasBienes(this.condicionTB.id, this.condicionTB).then(
            (item: ItemAddResult) => {
              this.servicio.agregarAdjuntoCondicionesTecnicasBienes(this.condicionTB.id, nombreArchivo, this.condicionTB.archivoAdjunto).then(
                (respuesta) => {
                  this.nombreAdjuntoCTB = this.condicionTB.archivoAdjunto.name;
                  let objIndex = this.condicionesTB.findIndex((obj => obj.indice == this.condicionTB.indice));
                  this.condicionesTB[objIndex].indice = this.condicionTB.indice;
                  this.condicionesTB[objIndex].codigo = this.condicionTB.codigo;
                  this.condicionesTB[objIndex].descripcion = this.condicionTB.descripcion;
                  this.condicionesTB[objIndex].modelo = this.condicionTB.modelo;
                  this.condicionesTB[objIndex].fabricante = this.condicionTB.fabricante;
                  this.condicionesTB[objIndex].cantidad = this.condicionTB.cantidad;
                  this.condicionesTB[objIndex].valorEstimado = this.condicionTB.valorEstimado;
                  this.condicionesTB[objIndex].tipoMoneda = this.condicionTB.tipoMoneda;
                  this.condicionesTB[objIndex].comentarios = this.condicionTB.comentarios;
                  this.condicionesTB[objIndex].costoInversion = this.condicionTB.costoInversion;
                  this.condicionesTB[objIndex].numeroCostoInversion = this.condicionTB.numeroCostoInversion;
                  this.condicionesTB[objIndex].numeroCuenta = this.condicionTB.numeroCuenta;
                  this.condicionesTB[objIndex].archivoAdjunto = this.condicionTB.archivoAdjunto;
                  this.condicionesTB[objIndex].rutaAdjunto = environment.urlRaiz + respuesta.data.ServerRelativeUrl;
                  this.condicionesTB[objIndex].id = this.condicionTB.id;
                  this.condicionesTB[objIndex].tieneIdServicio = this.condicionTB.tieneIdServicio;
                  this.condicionesTB[objIndex].idOrdenServicio = this.condicionTB.idOrdenServicio;
                  this.CargarTablaCTB();
                  this.limpiarControlesCTB();
                  this.mostrarInformacion("Condición técnica de bienes actualizada correctamente");
                  this.autoShownModalCTB.hide();
                  // this.modalRef.hide();
                  this.spinner.hide();
                  this.ctbSubmitted = false;
                  this.condicionTB = new CondicionTecnicaBienes(null, '', null, '', '', '', '', null, null, '', null, '', '');
                }, err => {
                  this.mostrarError('Error adjuntando el archivo en las condiciones técnicas de bienes');
                  this.spinner.hide();
                }
              )
            }, err => {
              this.mostrarError('Error en la actualización de la condición técnica de bienes');
              this.spinner.hide();
            }
          )
        } 
        else {
          this.servicio.actualizarCondicionesTecnicasBienes(this.condicionTB.id, this.condicionTB).then(
            (item: ItemAddResult) => {
              this.servicio.borrarAdjuntoCondicionesTecnicasBienes(this.condicionTB.id, nombreArchivoBorrar[nombreArchivoBorrar.length - 1]).then(
                (respuesta) => {
                  this.servicio.agregarAdjuntoCondicionesTecnicasBienes(this.condicionTB.id, nombreArchivo, this.condicionTB.archivoAdjunto).then(
                    (respuesta) => {
                      this.nombreAdjuntoCTB = this.condicionTB.archivoAdjunto.name;
                      let objIndex = this.condicionesTB.findIndex((obj => obj.indice == this.condicionTB.indice));
                      this.condicionesTB[objIndex].indice = this.condicionTB.indice;
                      this.condicionesTB[objIndex].codigo = this.condicionTB.codigo;
                      this.condicionesTB[objIndex].descripcion = this.condicionTB.descripcion;
                      this.condicionesTB[objIndex].modelo = this.condicionTB.modelo;
                      this.condicionesTB[objIndex].fabricante = this.condicionTB.fabricante;
                      this.condicionesTB[objIndex].cantidad = this.condicionTB.cantidad;
                      this.condicionesTB[objIndex].valorEstimado = this.condicionTB.valorEstimado;
                      this.condicionesTB[objIndex].tipoMoneda = this.condicionTB.tipoMoneda;
                      this.condicionesTB[objIndex].comentarios = this.condicionTB.comentarios;
                      this.condicionesTB[objIndex].costoInversion = this.condicionTB.costoInversion;
                      this.condicionesTB[objIndex].numeroCostoInversion = this.condicionTB.numeroCostoInversion;
                      this.condicionesTB[objIndex].numeroCuenta = this.condicionTB.numeroCuenta;
                      this.condicionesTB[objIndex].archivoAdjunto = this.condicionTB.archivoAdjunto;
                      this.condicionesTB[objIndex].rutaAdjunto = environment.urlRaiz + respuesta.data.ServerRelativeUrl;
                      this.condicionesTB[objIndex].id = this.condicionTB.id;
                      this.condicionesTB[objIndex].tieneIdServicio = this.condicionTB.tieneIdServicio;
                      this.condicionesTB[objIndex].idOrdenServicio = this.condicionTB.idOrdenServicio;
                      this.CargarTablaCTB();
                      this.limpiarControlesCTB();
                      this.mostrarInformacion("Condición técnica de bienes actualizada correctamente");
                      this.autoShownModalCTB.hide();
                      // this.modalRef.hide();
                      this.spinner.hide();
                      this.ctbSubmitted = false;
                      this.condicionTB = new CondicionTecnicaBienes(null, '', null, '', '', '', '', null, null, '', null, '', '');
                    }, err => {
                      this.mostrarError('Error adjuntando el archivo en las condiciones técnicas de bienes');
                      this.spinner.hide();
                    }
                  )
                }, err => {
                  this.mostrarError('Error borrando el archivo en las condiciones técnicas de bienes');
                  this.spinner.hide();
                }
              )
            }, err => {
              this.mostrarError('Error en la actualización de la condición técnica de bienes');
              this.spinner.hide();
            }
          )
        }
      }
    }
  }

  private CargarTablaCTB() {
    this.dataSourceCTB.data = this.condicionesTB;
    this.emptyCTB = false;
  }

  async validarSiEnviarCrmBienes() {
    let respuestaBienes = await this.servicio.obtenerCtBienes(this.idSolicitudGuardada);
    let numCostoInversion;
    let numCostoInversionString;
    console.log(respuestaBienes);
    this.dataTieneIdServiciosBienes = respuestaBienes.filter(x => {
      return x.tieneIdServicio === true;
    })
    if(this.dataTieneIdServiciosBienes.length > 0) {
      numCostoInversion = this.dataTieneIdServiciosBienes.map(x => {
        return x.numeroCostoInversion
      })
      numCostoInversionString = numCostoInversion.toString();
      this.dataIdServiciosBienes = numCostoInversionString.split(',');
    }
    else {
      this.dataIdServiciosBienes = [];
    }
    console.log(this.dataIdServiciosBienes);
   
  }

  async validarSiEnviarCrmServicios() {
    let respuestaServicios = await this.servicio.obtenerCtServicios(this.idSolicitudGuardada);
    let numCostoInversion;
    let numCostoInversionString;
    console.log(respuestaServicios);
    this.dataTieneIdServiciosServicios = respuestaServicios.filter(x => {
      return x.tieneIdServicio === true;
    })
    if(this.dataTieneIdServiciosServicios.length > 0) {
      numCostoInversion = this.dataTieneIdServiciosServicios.map(x => {
        return x.numeroCostoInversion;
      });
      numCostoInversionString = numCostoInversion.toString();
      this.dataIdeServiciosServicios = numCostoInversionString.split(',');
    }
    else {
      this.dataIdeServiciosServicios = [];
    }
  }

  async validarSiEnviarCrm() {
    let a = await this.validarSiEnviarCrmBienes();
    let b = await this.validarSiEnviarCrmServicios();
    if(this.dataIdServiciosBienes.length > 0 || this.dataIdeServiciosServicios.length > 0) {
      this.enviarCrm = true;
      let totalIds = this.dataIdServiciosBienes.concat(this.dataIdeServiciosServicios);
      this.dataTotalIds = totalIds.sort().filter((x, y)=> {
        return totalIds.indexOf(x) === y;
      })
    }  
  }

  limpiarControlesCTB(): any {
    this.ctbFormulario.controls["codigoCTB"].setValue('');
    this.ctbFormulario.controls["descripcionCTB"].setValue('');
    this.ctbFormulario.controls["valorEstimadoCTB"].setValue('');
    this.ctbFormulario.controls["modeloCTB"].setValue('');
    this.ctbFormulario.controls["fabricanteCTB"].setValue('');
    this.ctbFormulario.controls["cantidadCTB"].setValue('');
    this.ctbFormulario.controls["valorEstimadoCTB"].setValue(0);
    this.ctbFormulario.controls["tipoMonedaCTB"].setValue('');
    this.ctbFormulario.controls["adjuntoCTB"].setValue(null);
    this.ctbFormulario.controls["comentariosCTB"].setValue('');
    this.ctbFormulario.controls["cecoCTB"].setValue('');
    this.ctbFormulario.controls["numCicoCTB"].setValue('');
    this.ctbFormulario.controls["numCuentaCTB"].setValue('');
  }

  subirAdjuntoCTB(files: FileList) {
    this.condicionTB = new CondicionTecnicaBienes(null, '', null, '', '', '', '', null, null, '', files.item(0), '', '');
  }

  subirAdjuntoCTS(files: FileList) {
    this.condicionTS = new CondicionTecnicaServicios(null, '', null, '', '', null, null, '', files.item(0), '', '');
  }

  ctsOnSubmit() {
    this.ctsSubmitted = true;
    this.mostrarFiltroServicios = false;
    if (this.ctsFormulario.invalid) {
      return;
    }


    //----------------------------------Eliminar cuando datos contables no obligatorios---------------
    // this.spinner.show();
    // let solicitudTipo = this.solpFormulario.controls["tipoSolicitud"].value
    // let paisValidar = this.solpFormulario.controls["pais"].value.nombre
    // let codigo = this.ctsFormulario.controls["codigoCTS"].value;
    // let descripcion = this.ctsFormulario.controls["descripcionCTS"].value;
    // let cantidad = this.ctsFormulario.controls["cantidadCTS"].value;
    // let valorEstimado = this.ctsFormulario.controls["valorEstimadoCTS"].value;
    // let tipoMoneda = this.ctsFormulario.controls["tipoMonedaCTS"].value;
    // let comentarios = this.ctsFormulario.controls["comentariosCTS"].value;
    // let costoInversion = this.ctsFormulario.controls["cecoCTS"].value;
    // let numeroCostoInversion = this.ctsFormulario.controls["numCicoCTS"].value;
    // let numeroCuenta = this.ctsFormulario.controls["numCuentaCTS"].value;
    // let adjunto = null;
    // let idOrdenServicio 
    // let tieneIdServicio;
    // if(costoInversion === 'ID de Servicios') {
    //   tieneIdServicio = true;
    //   idOrdenServicio = this.dataIdOrdenSeleccionadosServicios.toString();
    // }
    // else {
    //   tieneIdServicio = false;
    //   idOrdenServicio = '';
    // }
    //-------------------------------------------------Hasta aquí--------------------------------------


    //----------------------------------Habilitar cuando datos contables no obligatorios-------------------------
    this.spinner.show();
    let solicitudTipo = this.solpFormulario.controls["tipoSolicitud"].value
    let paisValidar = this.solpFormulario.controls["pais"].value.nombre
    let codigo = this.ctsFormulario.controls["codigoCTS"].value;
    let descripcion = this.ctsFormulario.controls["descripcionCTS"].value;
    let cantidad = this.ctsFormulario.controls["cantidadCTS"].value;
    let valorEstimado = this.ctsFormulario.controls["valorEstimadoCTS"].value;
    let tipoMoneda = this.ctsFormulario.controls["tipoMonedaCTS"].value;
    let comentarios = this.ctsFormulario.controls["comentariosCTS"].value;
    let costoInversion;
    solicitudTipo !== 'Sondeo' ? costoInversion = this.ctsFormulario.controls["cecoCTS"].value : costoInversion = "";
    let numeroCostoInversion;
    solicitudTipo !== 'Sondeo' ? numeroCostoInversion = this.ctsFormulario.controls["numCicoCTS"].value : numeroCostoInversion = "";
    let numeroCuenta;
    solicitudTipo !== 'Sondeo' ? numeroCuenta = this.ctsFormulario.controls["numCuentaCTS"].value : numeroCuenta = "";
    let adjunto = null;
    let tieneIdServicio;
    let idOrdenServicio
    costoInversion === 'ID de Servicios' ? tieneIdServicio = true : tieneIdServicio = false;
    if(costoInversion === 'ID de Servicios') {
      tieneIdServicio = true;
      idOrdenServicio = this.dataIdOrdenSeleccionadosServicios.toString();
    }
    else {
      tieneIdServicio = false;
      idOrdenServicio = '';
    }
    //----------------------------------------------Hasta aquí--------------------------------------------------------

    if((solicitudTipo === 'Solp' || solicitudTipo === 'Orden a CM' || solicitudTipo === 'Cláusula adicional') && paisValidar === 'Brasil' && (codigo === "" || codigo === null || codigo === undefined)) {
      this.mostrarError('El código de servicios es obligatorio para Brasil')
      this.spinner.hide();
      return false;
    }

    if(this.condicionTS == null)
    {
      this.condicionTS = new CondicionTecnicaServicios(null, '', null, '', '', null, null, '', null, '', '')
    }
      if(this.condicionTS.archivoAdjunto != null)
      {
        adjunto = this.condicionTS.archivoAdjunto.name;
      }
    

    if (this.textoBotonGuardarCTS == "Guardar") {
      if (adjunto == null) {
        this.condicionTS = new CondicionTecnicaServicios(this.indiceCTS, "Condición Técnicas Servicios" + new Date().toDateString(), this.idSolicitudGuardada, codigo, descripcion, cantidad, valorEstimado.toString(), comentarios, null, '', tipoMoneda,null, costoInversion, numeroCostoInversion, numeroCuenta, null, tieneIdServicio, idOrdenServicio);
        this.servicio.agregarCondicionesTecnicasServicios(this.condicionTS).then(
          (item: ItemAddResult) => {
            this.condicionTS.id = item.data.Id;
            this.condicionesTS.push(this.condicionTS);
            this.indiceCTS++;
            this.CargarTablaCTS();
            this.limpiarControlesCTS();
            this.mostrarInformacion("Condición técnica de servicios agregada correctamente");
            this.autoShownModalCTS.hide();
            // this.modalRef.hide();
            this.spinner.hide();
            this.ctsSubmitted = false;
            this.condicionTS = new CondicionTecnicaServicios(null, '', null, '', '', null, null, '', null, '', '')
          }, err => {
            this.mostrarError('Error en la creación de la condición técnica de bienes');
            this.spinner.hide();
          }
        )
      } else {
        this.condicionTS.indice = this.indiceCTS;
        this.condicionTS.titulo = "Condición Técnicas Servicios" + new Date().toDateString();
        this.condicionTS.idSolicitud = this.idSolicitudGuardada;
        this.condicionTS.codigo = codigo;
        this.condicionTS.descripcion = descripcion;
        this.condicionTS.cantidad = cantidad;
        this.condicionTS.valorEstimado = valorEstimado.toString();
        this.condicionTS.comentarios = comentarios;
        this.condicionTS.costoInversion = costoInversion;
        this.condicionTS.numeroCostoInversion = numeroCostoInversion;
        this.condicionTS.numeroCuenta = numeroCuenta;
        this.condicionTS.tipoMoneda = tipoMoneda;
        this.condicionTS.tieneIdServicio = tieneIdServicio;
        this.condicionTS.idOrdenServicio = idOrdenServicio;
        let nombreArchivo = "solp-" + this.generarllaveSoporte() + "-" + this.condicionTS.archivoAdjunto.name;
        this.servicio.agregarCondicionesTecnicasServicios(this.condicionTS).then(
          (item: ItemAddResult) => {
            this.condicionTS.id = item.data.Id;
            this.servicio.agregarAdjuntoCondicionesTecnicasServicios(this.condicionTS.id, nombreArchivo, this.condicionTS.archivoAdjunto).then(
              (respuesta) => {
                this.condicionTS.rutaAdjunto = environment.urlRaiz + respuesta.data.ServerRelativeUrl;
                this.condicionesTS.push(this.condicionTS);
                this.indiceCTS++;
                this.CargarTablaCTS();
                this.limpiarControlesCTS();
                this.mostrarInformacion("Condición técnica de servicios agregada correctamente");
                this.autoShownModalCTS.hide();
                // this.modalRef.hide();
                this.spinner.hide();
                this.ctsSubmitted = false;
                this.condicionTS = new CondicionTecnicaServicios(null, '', null, '', '', null, null, '', null, '', '')
              }, err => {
                this.mostrarError('Error adjuntando el archivo en las condiciones técnicas de servicios');
                this.spinner.hide();
              }
            )
          }, err => {
            this.mostrarError('Error en la creación de la condición técnica de servicios');
            this.spinner.hide();
          }
        )
      }
    }

    if (this.textoBotonGuardarCTS == "Actualizar") {
      
      if (adjunto == null) {
        this.condicionTS = new CondicionTecnicaServicios(this.indiceCTSActualizar, "Condición Técnicas Servicios" + new Date().toDateString(), this.idSolicitudGuardada, codigo, descripcion, cantidad, valorEstimado.toString(), comentarios, null, '', tipoMoneda, null, costoInversion, numeroCostoInversion, numeroCuenta, null, tieneIdServicio, idOrdenServicio);
        this.condicionTS.id = this.idCondicionTSGuardada;
        this.servicio.actualizarCondicionesTecnicasServicios(this.condicionTS.id, this.condicionTS).then(
          (item: ItemAddResult) => {
            let objIndex = this.condicionesTS.findIndex((obj => obj.indice == this.condicionTS.indice));
            this.condicionesTS[objIndex].indice = this.condicionTS.indice;
            this.condicionesTS[objIndex].codigo = this.condicionTS.codigo;
            this.condicionesTS[objIndex].descripcion = this.condicionTS.descripcion;
            this.condicionesTS[objIndex].cantidad = this.condicionTS.cantidad;
            this.condicionesTS[objIndex].valorEstimado = this.condicionTS.valorEstimado;
            this.condicionesTS[objIndex].tipoMoneda = this.condicionTS.tipoMoneda;
            this.condicionesTS[objIndex].comentarios = this.condicionTS.comentarios;
            this.condicionesTS[objIndex].costoInversion = this.condicionTS.costoInversion;
            this.condicionesTS[objIndex].numeroCostoInversion = this.condicionTS.numeroCostoInversion;
            this.condicionesTS[objIndex].numeroCuenta = this.condicionTS.numeroCuenta;
            this.condicionesTS[objIndex].id = this.condicionTS.id;
            this.condicionesTS[objIndex].tieneIdServicio = this.condicionTS.tieneIdServicio;
            this.condicionesTS[objIndex].idOrdenServicio = this.condicionTS.idOrdenServicio;
            this.CargarTablaCTS();
            this.limpiarControlesCTS();
            this.mostrarInformacion("Condición técnica de servicios actualizada correctamente");
            this.autoShownModalCTS.hide();
            // this.modalRef.hide();
            this.spinner.hide();
            this.ctsSubmitted = false;
            this.condicionTS = new CondicionTecnicaServicios(null, '', null, '', '', null, null, '', null, '', '')
          }, err => {
            this.mostrarError('Error en la actualización de la condición técnica de servicios');
            this.spinner.hide();
          }
        )
      } else {
        this.condicionTS.id = this.idCondicionTSGuardada;
        this.condicionTS.indice = this.indiceCTSActualizar;
        this.condicionTS.titulo = "Condición Técnicas Servicios" + new Date().toDateString();
        this.condicionTS.idSolicitud = this.idSolicitudGuardada;
        this.condicionTS.codigo = codigo;
        this.condicionTS.descripcion = descripcion;
        this.condicionTS.cantidad = cantidad;
        this.condicionTS.valorEstimado = valorEstimado.toString();
        this.condicionTS.comentarios = comentarios;
        this.condicionTS.costoInversion = costoInversion;
        this.condicionTS.numeroCostoInversion = numeroCostoInversion;
        this.condicionTS.numeroCuenta = numeroCuenta;
        this.condicionTS.tipoMoneda = tipoMoneda;
        this.condicionTS.tieneIdServicio = tieneIdServicio;
        this.condicionTS.idOrdenServicio = idOrdenServicio;
        let nombreArchivo = "solp-" + this.generarllaveSoporte() + "-" + this.condicionTS.archivoAdjunto.name;
        if (this.rutaAdjuntoCTS != '') {
          let nombreArchivoBorrar = this.rutaAdjuntoCTS.split('/');
          this.servicio.actualizarCondicionesTecnicasServicios(this.condicionTS.id, this.condicionTS).then(
            (item: ItemAddResult) => {
              this.servicio.borraAdjuntoCondicionesTecnicasServicios(this.condicionTS.id, nombreArchivoBorrar[nombreArchivoBorrar.length - 1]).then(
                (respuesta) => {
                  this.servicio.agregarAdjuntoCondicionesTecnicasServicios(this.condicionTS.id, nombreArchivo, this.condicionTS.archivoAdjunto).then(
                    (respuesta) => {
                      this.nombreAdjuntoCTS = this.condicionTS.archivoAdjunto.name;
                      let objIndex = this.condicionesTS.findIndex((obj => obj.indice == this.condicionTS.indice));
                      this.condicionesTS[objIndex].indice = this.condicionTS.indice;
                      this.condicionesTS[objIndex].codigo = this.condicionTS.codigo;
                      this.condicionesTS[objIndex].descripcion = this.condicionTS.descripcion;
                      this.condicionesTS[objIndex].cantidad = this.condicionTS.cantidad;
                      this.condicionesTS[objIndex].valorEstimado = this.condicionTS.valorEstimado;
                      this.condicionesTS[objIndex].tipoMoneda = this.condicionTS.tipoMoneda;
                      this.condicionesTS[objIndex].comentarios = this.condicionTS.comentarios;
                      this.condicionesTS[objIndex].costoInversion = this.condicionTS.costoInversion;
                      this.condicionesTS[objIndex].numeroCostoInversion = this.condicionTS.numeroCostoInversion;
                      this.condicionesTS[objIndex].numeroCuenta = this.condicionTS.numeroCuenta;
                      this.condicionesTS[objIndex].archivoAdjunto = this.condicionTS.archivoAdjunto;
                      this.condicionesTS[objIndex].rutaAdjunto = environment.urlRaiz + respuesta.data.ServerRelativeUrl;
                      this.condicionesTS[objIndex].id = this.condicionTS.id;
                      this.condicionesTS[objIndex].tieneIdServicio = this.condicionTS.tieneIdServicio;
                      this.condicionesTS[objIndex].idOrdenServicio = this.condicionTS.idOrdenServicio;
                      this.CargarTablaCTS();
                      this.limpiarControlesCTS();
                      this.mostrarInformacion("Condición técnica de servicios actualizada correctamente");
                      this.autoShownModalCTS.hide();
                      // this.modalRef.hide();
                      this.spinner.hide();
                      this.ctsSubmitted = false;
                      this.condicionTS = new CondicionTecnicaServicios(null, '', null, '', '', null, null, '', null, '', '')
                    }, err => {
                      this.mostrarError('Error adjuntando el archivo en las condiciones técnicas de servicios');
                      this.spinner.hide();
                    }
                  )
                }, err => {
                  this.mostrarError('Error borrando el archivo en las condiciones técnicas de servicios');
                  this.spinner.hide();
                }
              )
            }, err => {
              this.mostrarError('Error en la actualización de la condición técnica de servicios');
              this.spinner.hide();
            }
          )
        } else {
          this.servicio.actualizarCondicionesTecnicasServicios(this.condicionTS.id, this.condicionTS).then(
            (item: ItemAddResult) => {
              this.servicio.agregarAdjuntoCondicionesTecnicasServicios(this.condicionTS.id, nombreArchivo, this.condicionTS.archivoAdjunto).then(
                (respuesta) => {
                  this.nombreAdjuntoCTS = this.condicionTS.archivoAdjunto.name;
                  let objIndex = this.condicionesTS.findIndex((obj => obj.indice == this.condicionTS.indice));
                  this.condicionesTS[objIndex].indice = this.condicionTS.indice;
                  this.condicionesTS[objIndex].codigo = this.condicionTS.codigo;
                  this.condicionesTS[objIndex].descripcion = this.condicionTS.descripcion;
                  this.condicionesTS[objIndex].cantidad = this.condicionTS.cantidad;
                  this.condicionesTS[objIndex].valorEstimado = this.condicionTS.valorEstimado;
                  this.condicionesTS[objIndex].tipoMoneda = this.condicionTS.tipoMoneda;
                  this.condicionesTS[objIndex].comentarios = this.condicionTS.comentarios;
                  this.condicionesTS[objIndex].costoInversion = this.condicionTS.costoInversion;
                  this.condicionesTS[objIndex].numeroCostoInversion = this.condicionTS.numeroCostoInversion;
                  this.condicionesTS[objIndex].numeroCuenta = this.condicionTS.numeroCuenta;
                  this.condicionesTS[objIndex].archivoAdjunto = this.condicionTS.archivoAdjunto;
                  this.condicionesTS[objIndex].rutaAdjunto = environment.urlRaiz + respuesta.data.ServerRelativeUrl;
                  this.condicionesTS[objIndex].id = this.condicionTS.id;
                  this.condicionesTS[objIndex].tieneIdServicio = this.condicionTS.tieneIdServicio;
                  this.condicionesTS[objIndex].idOrdenServicio = this.condicionTS.idOrdenServicio;
                  this.CargarTablaCTS();
                  this.limpiarControlesCTS();
                  this.mostrarInformacion("Condición técnica de servicios actualizada correctamente");
                  this.autoShownModalCTS.hide();
                  // this.modalRef.hide();
                  this.spinner.hide();
                  this.ctsSubmitted = false;
                  this.condicionTS = new CondicionTecnicaServicios(null, '', null, '', '', null, null, '', null, '', '')
                }, err => {
                  this.mostrarError('Error adjuntando el archivo en las condiciones técnicas de servicios');
                  this.spinner.hide();
                }
              )
            }, err => {
              this.mostrarError('Error en la actualización de la condición técnica de servicios');
              this.spinner.hide();
            }
          )
        }
      }
    }
  }

  CargarTablaCTS() {
    this.dataSourceCTS.data = this.condicionesTS;
    this.emptyCTS = false;
  }

  limpiarControlesCTS(): any {
    this.ctsFormulario.controls["codigoCTS"].setValue('');
    this.ctsFormulario.controls["descripcionCTS"].setValue('');
    this.ctsFormulario.controls["cantidadCTS"].setValue('');
    this.ctsFormulario.controls["valorEstimadoCTS"].setValue(0);
    this.ctsFormulario.controls["tipoMonedaCTS"].setValue('');
    this.ctsFormulario.controls["adjuntoCTS"].setValue(null);
    this.ctsFormulario.controls["comentariosCTS"].setValue('');
    this.ctsFormulario.controls["cecoCTS"].setValue('');
    this.ctsFormulario.controls["numCicoCTS"].setValue('');
    this.ctsFormulario.controls["numCuentaCTS"].setValue('');
  }

  
  editarBienes(element) {
    this.indiceCTBActualizar = element.indice;
    this.idCondicionTBGuardada = element.id;
    this.setDatosContablesBienes = false;
    if(this.ctbFormulario.controls['cecoCTB'].value === 'ID de Servicios') {
      this.mostrarFiltroBienes = true;
    }
    else {
      this.mostrarFiltroBienes = false;
    }
    if (element.archivoAdjunto != null) {
      this.mostrarAdjuntoCTB = true;
      if(element.rutaAdjunto.toString() == "[object Object]")
      {
        if(element.rutaAdjunto.results.length > 0)
        {
          this.rutaAdjuntoCTB = element.rutaAdjunto.results[0].ServerRelativeUrl; //element.rutaAdjunto
          this.nombreAdjuntoCTB  = element.rutaAdjunto.results[0].FileName; //element.archivoAdjunto.name;
        }
        else
        {
          this.rutaAdjuntoCTB = ""; //element.rutaAdjunto
          this.nombreAdjuntoCTB  = ""; //element.archivoAdjunto.name;
        }
      }
      else
      {
        this.rutaAdjuntoCTB = element.rutaAdjunto;
        this.nombreAdjuntoCTB =  element.archivoAdjunto.name;
      }
    } else {
      this.mostrarAdjuntoCTB = false;
      this.rutaAdjuntoCTB = '';
      this.nombreAdjuntoCTB = '';
    }

    this.ctbFormulario.controls["codigoCTB"].setValue(element.codigo);
    this.ctbFormulario.controls["descripcionCTB"].setValue(element.descripcion);
    this.ctbFormulario.controls["modeloCTB"].setValue(element.modelo);
    this.ctbFormulario.controls["fabricanteCTB"].setValue(element.fabricante);
    this.ctbFormulario.controls["cantidadCTB"].setValue(element.cantidad);
    this.ctbFormulario.controls["valorEstimadoCTB"].setValue(element.valorEstimado);
    this.ctbFormulario.controls["tipoMonedaCTB"].setValue(element.tipoMoneda);
    this.ctbFormulario.controls["adjuntoCTB"].setValue(null);
    this.ctbFormulario.controls["comentariosCTB"].setValue(element.comentarios);
    this.ctbFormulario.controls["cecoCTB"].setValue(element.costoInversion);
    this.ctbFormulario.controls["numCicoCTB"].setValue(element.numeroCostoInversion);
    this.ctbFormulario.controls["numCuentaCTB"].setValue(element.numeroCuenta);
    this.tituloModalCTB = "Actualizar bien";
    this.textoBotonGuardarCTB = "Actualizar";
    this.isModalCTBShown = true;
    // this.modalRef = this.modalServicio.show(
    //   template,
    //   Object.assign({}, { class: 'gray modal-lg' })
    // );
  }

  editarServicios(element) {
    this.indiceCTSActualizar = element.indice;
    this.idCondicionTSGuardada = element.id;
    console.log(this.ctsFormulario.controls['cecoCTS'].value);
    if(this.ctsFormulario.controls['cecoCTS'].value === 'ID de Servicios') {
      this.mostrarFiltroServicios = true;
    }
    else {
      this.mostrarFiltroServicios = false;
    }
    if (element.archivoAdjunto != null) {
      this.mostrarAdjuntoCTS = true;
      if(element.rutaAdjunto.toString() == "[object Object]") {
        if(element.rutaAdjunto.results.length > 0) {
          this.rutaAdjuntoCTS = element.rutaAdjunto.results[0].ServerRelativeUrl;
          this.nombreAdjuntoCTS = element.rutaAdjunto.results[0].FileName;
        } else {
          this.rutaAdjuntoCTS = "";
          this.nombreAdjuntoCTS = "";
        }
      } else {
      this.rutaAdjuntoCTS = element.rutaAdjunto;
      this.nombreAdjuntoCTS = element.archivoAdjunto.name;
      }
    } else {
      this.mostrarAdjuntoCTS = false;
      this.rutaAdjuntoCTS = '';
      this.nombreAdjuntoCTS = '';
    }
    this.ctsFormulario.controls["codigoCTS"].setValue(element.codigo);
    this.ctsFormulario.controls["descripcionCTS"].setValue(element.descripcion);
    this.ctsFormulario.controls["cantidadCTS"].setValue(element.cantidad);
    this.ctsFormulario.controls["valorEstimadoCTS"].setValue(element.valorEstimado);
    this.ctsFormulario.controls["tipoMonedaCTS"].setValue(element.tipoMoneda);
    this.ctsFormulario.controls["adjuntoCTS"].setValue(null);
    this.ctsFormulario.controls["comentariosCTS"].setValue(element.comentarios);
    this.ctsFormulario.controls["cecoCTS"].setValue(element.costoInversion);
    this.ctsFormulario.controls["numCicoCTS"].setValue(element.numeroCostoInversion);
    this.ctsFormulario.controls["numCuentaCTS"].setValue(element.numeroCuenta);
    this.tituloModalCTS = "Actualizar servicio";
    this.textoBotonGuardarCTS = "Actualizar";
    this.isModalShownCTS = true;
    // this.modalRef = this.modalServicio.show(
    //   template,
    //   Object.assign({}, { class: 'gray modal-lg' })
    // );
  }

  borrarBienes(element) {
    this.servicio.borrarCondicionTecnicaBienes(element.id).then(
      (respuesta) => {
        this.condicionesTB = this.condicionesTB.filter(obj => obj.indice !== element.indice);
        this.dataSourceCTB.data = this.condicionesTB;
        if (this.dataSourceCTB.data.length == 0) {
          this.emptyCTB = true;
        }
      }, err => {
        console.log('Error al borrar una condición técnica de bienes: ' + err);
      }
    )
  }

  borrarServicios(element) {
    this.servicio.borrarCondicionTecnicaServicios(element.id).then(
      (respuesta) => {
        this.condicionesTS = this.condicionesTS.filter(obj => obj.indice !== element.indice);
        this.dataSourceCTS.data = this.condicionesTS;
        if (this.dataSourceCTS.data.length == 0) {
          this.emptyCTS = true;
        }
      }, err => {
        console.log('Error al borrar una condición técnica de bienes: ' + err);
      }
    )
  }

  descartarSolicitud(template: TemplateRef<any>) {
    this.modalRef = this.modalServicio.show(template, { class: 'modal-lg' });
  }

  guardarParcialSolicitud() {
    this.spinner.show();
    let tipoSolicitud = this.solpFormulario.controls["tipoSolicitud"].value;
    let cm = this.solpFormulario.controls["cm"].value;
    let empresa = 1;
    let ordenadorGastos = this.solpFormulario.controls["ordenadorGastos"].value;
    let valorPais = this.solpFormulario.controls["pais"].value;
    let categoria = this.solpFormulario.controls["categoria"].value;
    let subcategoria = this.solpFormulario.controls["subcategoria"].value;
    let comprador = this.solpFormulario.controls["comprador"].value;
    let codigoAriba = this.solpFormulario.controls["codigoAriba"].value;
    let fechaEntregaDeseada = this.solpFormulario.controls["fechaEntregaDeseada"].value;
    let alcance = this.solpFormulario.controls["alcance"].value;
    let justificacion = this.solpFormulario.controls["justificacion"].value;
    let valorcompraOrdenEstadistica = this.solpFormulario.controls["compraOrdenEstadistica"].value;
    let valornumeroOrdenEstadistica = this.solpFormulario.controls["numeroOrdenEstadistica"].value;
    let estado = "Borrador";

    if (this.condicionesTB.length > 0) {
      this.compraBienes = true;
    }
    if (this.condicionesTS.length > 0) {
      this.compraServicios = true;
    }
    if (valorcompraOrdenEstadistica == "SI") {
      this.compraOrdenEstadistica = true;
    }

    this.solicitudGuardar = new Solicitud(
      'Solicitud Solpes: ' + new Date(),
      (tipoSolicitud != '') ? tipoSolicitud : '',
      (cm != '') ? cm : '',
      this.usuarioActual.nombre,
      empresa,
      (ordenadorGastos != 'Seleccione') ? ordenadorGastos : null,
      (valorPais != '') ? valorPais.id : null,
      (categoria != null) ? categoria.nombre : '',
      (subcategoria != '') ? subcategoria.nombre : '',
      (subcategoria != '') ? subcategoria.comprador.ID : null,
      (codigoAriba != '') ? codigoAriba : '',
      (fechaEntregaDeseada != '') ? fechaEntregaDeseada : null,
      (alcance != '') ? alcance : '',
      (justificacion != '') ? justificacion : '',
      this.construirJsonCondicionesContractuales(),
      estado,
      this.usuarioActual.id,
      this.compraBienes,
      this.compraServicios,
      null,
      this.usuarioActual.id,
      null,
      this.compraOrdenEstadistica,
      valornumeroOrdenEstadistica);

    this.servicio.actualizarSolicitud(this.idSolicitudGuardada, this.solicitudGuardar).then(
      (item: ItemAddResult) => {
        this.MostrarExitoso("La solicitud ha tenido un guardado parcial correcto");
        this.spinner.hide();
      }, err => {
        this.mostrarError('Error en guardado parcial de la solicitud');
        this.spinner.hide();
      }
    )
  }

  confirmarDescartar() {
    this.servicio.borrarSolicitud(this.idSolicitudGuardada).then(
      (respuesta) => {
        this.modalRef.hide();
        this.MostrarExitoso("La solicitud se ha borrado correctamente");
        this.router.navigate(['/mis-solicitudes']);
      }, err => {
        console.log('Error al borrar la solicitud: ' + err);
      }
    )
  }

  declinarDescartar() {
    this.modalRef.hide();
  }

  generarllaveSoporte(): string {
    var fecha = new Date();
    var valorprimitivo = fecha.valueOf().toString();
    return valorprimitivo;
  }

                    //Habilitar cuando datos contables no obligatorios

  mostrarNumeroOrdenEstadistica(valorOrdenEstadistica) {
    if (valorOrdenEstadistica == "SI") {
      this.emptyNumeroOrdenEstadistica = true;
      this.esconderDatosContables();
    } else {
      if (this.solpFormulario.get('tipoSolicitud').value !== 'Sondeo') {
        this.mostrarDivDatosContables();
      }
      this.emptyNumeroOrdenEstadistica = false;
      this.solpFormulario.controls["numeroOrdenEstadistica"].setValue("");
      
    }
  }                          //Hasta aquí

  //Eliminar cuando datos contables no obligatorios
  // mostrarNumeroOrdenEstadistica(valorOrdenEstadistica) {
  //   if (valorOrdenEstadistica == "SI") {
  //     this.emptyNumeroOrdenEstadistica = true;
  //     this.esconderDatosContables();
  //   } else {
  //     this.mostrarDivDatosContables();
  //     this.emptyNumeroOrdenEstadistica = false;
  //     this.solpFormulario.controls["numeroOrdenEstadistica"].setValue("");
      
  //   }
  // }                             // Hasta aquí

 // Habilitar cuando datos contables no obligatorios
  mostrarDivDatosContables(): any {
    let tipoSolicitud = this.solpFormulario.get('tipoSolicitud').value;
    console.log(tipoSolicitud);
    this.mostrarDatosContables = false;
    if (tipoSolicitud !== 'Sondeo') {
      this.AsignarRequeridosDatosContables();
    }
    else {
      this.removerRequeridosDatosContables();
      this.limpiarDatosContables();
    }
  }                      //Hasta aquí

  
                        //Eliminar cuando datos contables no obligatorios
  // mostrarDivDatosContables(): any {
  //   this.mostrarDatosContables = false;
  //   // this.AsignarRequeridosDatosContables();
  // }                                     // Hasta aquí


  esconderDatosContables(): any {
    this.mostrarDatosContables = true;
    this.removerRequeridosDatosContables();
    //this.limpiarDatosContables(); Habilitar cuando datos contables no obligatorios
  }



}