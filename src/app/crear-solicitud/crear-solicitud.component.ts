import { Component, OnInit, TemplateRef } from '@angular/core';
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
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { MatTableDataSource } from '@angular/material';
import { environment } from 'src/environments/environment';
import { responsableProceso } from '../dominio/responsableProceso';

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
  consecutivoActual: number;
  compradorId: number;
  codigoAriba: string;
  responsableProcesoEstado: responsableProceso[] = [];

  constructor(private formBuilder: FormBuilder, private servicio: SPServicio, private modalServicio: BsModalService, public toastr: ToastrManager, private router: Router) {
    setTheme('bs4');
    this.mostrarContratoMarco = false;
    this.loading = false;
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
    this.loading = true;
    this.aplicarTemaCalendario();
    this.RecuperarUsuario();
    this.RegistrarFormularioSolp();
    this.RegistrarFormularioCTB();
    this.RegistrarFormularioCTS();
    this.ValidarTipoMonedaObligatoriaSiHayValorEstimadoCTB();
    this.ValidarTipoMonedaObligatoriaSiHayValorEstimadoCTS();
    this.obtenerTiposSolicitud();
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
      comentariosCTS: ['']
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
      comentariosCTB: ['']
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
        if (valor != '') {
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
        if (valor != '') {
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
      empresa: [''],
      ordenadorGastos: [''],
      pais: [''],
      categoria: [''],
      subcategoria: [''],
      comprador: [''],
      codigoAriba: [''],
      fechaEntregaDeseada: [''],
      alcance: [''],
      justificacion: ['']
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
        console.log('Error obteniendo tipos de solicitud: ' + err);
      }
    )
  }

  ValidacionesTipoSolicitud(tipoSolicitud) {
    this.mostrarCM(tipoSolicitud);
    this.deshabilitarJustificacion(tipoSolicitud);
  }

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
        console.log('Error obteniendo categorías: ' + err);
      }
    )
  }

  obtenerParametrosConfiguracion() {
    this.servicio.obtenerParametrosConfiguracion().subscribe(
      (respuesta) => {
        this.diasEntregaDeseada = respuesta[0].ParametroDiasEntregaDeseada;
        this.consecutivoActual = respuesta[0].ConsecutivoSolicitudes;
        this.minDate = new Date();
        this.minDate.setDate(this.minDate.getDate() + this.diasEntregaDeseada);
        this.obtenerProfile();
      }, err => {
        console.log('Error obteniendo categorías: ' + err);
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
        console.log('Error obteniendo jefe inmediato: ' + err);
      }
    )
  }

  agregarSolicitudInicial(): any {
    this.solicitudGuardar = new Solicitud('Solicitud Solpes: ' + new Date(), '', '', this.usuarioActual.nombre, null, null, null, '', '', '', null, '', '', '', 'Borrador', this.usuarioActual.id, false, false, null, this.usuarioActual.id);
    this.servicio.agregarSolicitud(this.solicitudGuardar).then(
      (item: ItemAddResult) => {
        this.idSolicitudGuardada = item.data.Id;
        this.loading = false;
      }, err => {
        this.mostrarError('Error en la creación de la solicitud');
      }
    )
  }

  filtrarSubcategorias() {
    this.loading = true;
    let categoria = this.solpFormulario.controls["categoria"].value;
    let pais = this.solpFormulario.controls["pais"].value;
    this.limpiarCondicionesContractuales();
    if (categoria != '' && pais != '') {
      this.servicio.ObtenerSubcategorias(categoria.id, pais.id).subscribe(
        (respuesta) => {
          this.subcategorias = Subcategoria.fromJsonList(respuesta);
          this.loading = false;
        }, err => {
          console.log('Error obteniendo subcategorias: ' + err);
        }
      )
    } else {
      this.loading = false;
    }
  }

  cargarCondicionesContractuales() {
    this.loading = true;
    let Subcategoria = this.solpFormulario.controls["subcategoria"].value;
    if(Subcategoria){
      this.limpiarCondicionesContractuales();
      this.subcategoriaSeleccionada = this.subcategorias.find(s => s.id == Subcategoria.id);
      this.subcategoriaSeleccionada.condicionesContractuales.forEach(element => {
        this.condicionesContractuales.push(new CondicionContractual(element.Title, element.ID));
      });
      this.registrarControlesCondicionesContractuales();
      this.cargarDatosSubcategoria(this.subcategoriaSeleccionada);
      this.loading = false;
    }else{
      this.solpFormulario.controls["comprador"].setValue('');
      this.solpFormulario.controls['codigoAriba'].setValue('');
      this.loading = false;
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

  enviarSolicitud() {
    this.loading = true;
    let respuesta;
    let estado;
    let responsable;
    let tipoSolicitud = this.solpFormulario.controls["tipoSolicitud"].value;
    let cm = this.solpFormulario.controls["cm"].value;
    let empresa = this.solpFormulario.controls["empresa"].value;
    let ordenadorGastos = this.solpFormulario.controls["ordenadorGastos"].value;
    let valorPais = this.solpFormulario.controls["pais"].value;
    let pais = valorPais.nombre;
    let categoria = this.solpFormulario.controls["categoria"].value;
    let subcategoria = this.solpFormulario.controls["subcategoria"].value;
    let comprador = this.solpFormulario.controls["comprador"].value;
    let fechaEntregaDeseada = this.solpFormulario.controls["fechaEntregaDeseada"].value;
    let alcance = this.solpFormulario.controls["alcance"].value;
    let justificacion = this.solpFormulario.controls["justificacion"].value;
    let consecutivoNuevo = this.consecutivoActual + 1;

    if (this.EsCampoVacio(tipoSolicitud)) {
      this.mostrarAdvertencia("El campo Tipo de solicitud es requerido");
      this.loading = false;
      return false;
    }

    if (this.EsCampoVacio(empresa)) {
      this.mostrarAdvertencia("El campo Empresa es requerido");
      this.loading = false;
      return false;
    }

    if (this.EsCampoVacio(ordenadorGastos)) {
      this.mostrarAdvertencia("El campo Ordenador de gastos es requerido");
      this.loading = false;
      return false;
    }

    if (this.EsCampoVacio(pais)) {
      this.mostrarAdvertencia("El campo País es requerido");
      this.loading = false;
      return false;
    }

    if (this.EsCampoVacio(categoria)) {
      this.mostrarAdvertencia("El campo Categoría es requerido");
      this.loading = false;
      return false;
    }

    if (this.EsCampoVacio(subcategoria)) {
      this.mostrarAdvertencia("El campo Subcategoría es requerido");
      this.loading = false;
      return false;
    }

    if (this.EsCampoVacio(comprador)) {
      this.mostrarAdvertencia("El campo Comprador es requerido");
      this.loading = false;
      return false;
    }

    if (this.EsCampoVacio(fechaEntregaDeseada)) {
      this.mostrarAdvertencia("El campo Fecha entrega deseada es requerido");
      this.loading = false;
      return false;
    }

    if (this.EsCampoVacio(alcance)) {
      this.mostrarAdvertencia("El campo Alcance es requerido");
      this.loading = false;
      return false;
    }

    if (tipoSolicitud == 'Solp' || tipoSolicitud == 'CM') {
      if (this.EsCampoVacio(justificacion)) {
        this.mostrarAdvertencia("El campo Justificación es requerido");
        this.loading = false;
        return false;
      }
    }

    respuesta = this.ValidarCondicionesContractuales();
    if (respuesta == false) {
      this.loading = false;
      return respuesta;
    }

    respuesta = this.ValidarExistenciaCondicionesTecnicas();
    if (respuesta == false) {
      this.loading = false;
      return respuesta;
    }

    if (this.condicionesTB.length > 0) {
      this.compraBienes = true;
    }
    if (this.condicionesTS.length > 0) {
      this.compraServicios = true;
    }

    this.servicio.obtenerResponsableProcesos(valorPais.id).subscribe(
      (respuestaResponsable) => {
        this.responsableProcesoEstado = responsableProceso.fromJsonList(respuestaResponsable);
        if (tipoSolicitud == 'Sondeo') {
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

        if (respuesta == true) {
          this.solicitudGuardar = new Solicitud(
            'Solicitud Solpes: ' + new Date(),
            tipoSolicitud,
            cm,
            this.usuarioActual.nombre,
            empresa,
            ordenadorGastos,
            valorPais.id,
            categoria.nombre,
            subcategoria.nombre,
            comprador,
            fechaEntregaDeseada,
            alcance,
            justificacion,
            this.construirJsonCondicionesContractuales(),
            estado,
            responsable,
            this.compraBienes,
            this.compraServicios,
            consecutivoNuevo);

          this.servicio.actualizarSolicitud(this.idSolicitudGuardada, this.solicitudGuardar).then(
            (item: ItemAddResult) => {
              this.servicio.actualizarConsecutivo(consecutivoNuevo).then(
                (item: ItemAddResult) => {

                  let notificacion = {
                    IdSolicitud: this.idSolicitudGuardada.toString(),
                    ResponsableId: responsable,
                    Estado: estado
                  };

                  this.servicio.agregarNotificacion(notificacion).then(
                    (item: ItemAddResult) => {
                      this.loading = false;
                      this.MostrarExitoso("La solicitud se ha guardado correctamente");
                      this.router.navigate(['/mis-solicitudes']);
                    }, err => {
                      this.mostrarError('Error agregando la notificación');
                      this.loading = false;
                    }
                  )
                }, err => {
                  this.mostrarError('Error en la actualización del consecutivo');
                  this.loading = false;
                }
              )
            }, err => {
              this.mostrarError('Error en el envío de la solicitud');
              this.loading = false;
            }
          )
        }
      }, err => {
        this.mostrarError('Error obteniendo responsable procesos: ' + err);
        this.loading = false;
      }
    )
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
        this.cadenaJsonCondicionesContractuales += ('{"campo": "' + condicionContractual.nombre + '", "descripcion": "' + this.solpFormulario.controls['condicionContractual' + condicionContractual.id].value + '"},');
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

  EsCampoVacio(valorCampo: string) {
    if (valorCampo === "" || valorCampo == 'Seleccione' || valorCampo == null) {
      return true;
    }
    return false;
  }

  salir() {
    this.router.navigate(["/mis-solicitudes"]);
  }

  abrirModalCTB(template: TemplateRef<any>) {
    this.mostrarAdjuntoCTB = false;
    this.limpiarControlesCTB();
    this.tituloModalCTB = "Agregar condición técnica de bienes";
    this.textoBotonGuardarCTB = "Guardar";
    this.modalRef = this.modalServicio.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  abrirModalCTS(template: TemplateRef<any>) {
    this.mostrarAdjuntoCTS = false;
    this.limpiarControlesCTS();
    this.tituloModalCTS = "Agregar condición técnica de servicios";
    this.textoBotonGuardarCTS = "Guardar";
    this.modalRef = this.modalServicio.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  ctbOnSubmit() {
    this.ctbSubmitted = true;
    if (this.ctbFormulario.invalid) {
      return;
    }

    this.loading = true;
    if (this.textoBotonGuardarCTB == "Guardar") {
      let codigo = this.ctbFormulario.controls["codigoCTB"].value;
      let descripcion = this.ctbFormulario.controls["descripcionCTB"].value;
      let modelo = this.ctbFormulario.controls["modeloCTB"].value;
      let fabricante = this.ctbFormulario.controls["fabricanteCTB"].value;
      let cantidad = this.ctbFormulario.controls["cantidadCTB"].value;
      let valorEstimado = this.ctbFormulario.controls["valorEstimadoCTB"].value;
      let tipoMoneda = this.ctbFormulario.controls["tipoMonedaCTB"].value;
      let adjunto = this.ctbFormulario.controls["adjuntoCTB"].value;
      let comentarios = this.ctbFormulario.controls["comentariosCTB"].value;
      if (this.condicionTB == null) {
        this.condicionTB = new CondicionTecnicaBienes(null, '', null, '', '', '', '', null, null, '', null, '', '');
      }
      this.condicionTB.indice = this.indiceCTB;
      this.condicionTB.titulo = "Condición Técnicas Bienes " + new Date().toDateString();
      this.condicionTB.idSolicitud = this.idSolicitudGuardada;
      this.condicionTB.codigo = codigo;
      this.condicionTB.descripcion = descripcion;
      this.condicionTB.modelo = modelo;
      this.condicionTB.fabricante = fabricante;
      this.condicionTB.cantidad = cantidad;
      this.condicionTB.valorEstimado = valorEstimado;
      this.condicionTB.comentarios = comentarios;
      this.condicionTB.tipoMoneda = tipoMoneda;
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
                this.modalRef.hide();
                this.condicionTB = null;
                this.loading = false; 
              }, err => {
                this.mostrarError('Error adjuntando el archivo en las condiciones técnicas de bienes');
                this.loading = false;
              }
            )
          }, err => {
            this.mostrarError('Error en la creación de la condición técnica de bienes');
            this.loading = false;
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
            this.modalRef.hide();
            this.condicionTB = null;
            this.loading = false;
          }, err => {
            this.mostrarError('Error en la creación de la condición técnica de bienes');
            this.loading = false;
          }
        )
      }
    }

    if (this.textoBotonGuardarCTB == "Actualizar") {
      let codigo = this.ctbFormulario.controls["codigoCTB"].value;
      let descripcion = this.ctbFormulario.controls["descripcionCTB"].value;
      let modelo = this.ctbFormulario.controls["modeloCTB"].value;
      let fabricante = this.ctbFormulario.controls["fabricanteCTB"].value;
      let cantidad = this.ctbFormulario.controls["cantidadCTB"].value;
      let valorEstimado = this.ctbFormulario.controls["valorEstimadoCTB"].value;
      let tipoMoneda = this.ctbFormulario.controls["tipoMonedaCTB"].value;
      let adjunto = this.ctbFormulario.controls["adjuntoCTB"].value;
      let comentarios = this.ctbFormulario.controls["comentariosCTB"].value;
      if (adjunto == null) {
        this.condicionTB = new CondicionTecnicaBienes(this.indiceCTBActualizar, "Condición Técnicas Bienes" + new Date().toDateString(), this.idSolicitudGuardada, codigo, descripcion, modelo, fabricante, cantidad, valorEstimado, comentarios, null, '', tipoMoneda);
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
            this.condicionesTB[objIndex].id = this.condicionTB.id;
            this.CargarTablaCTB();
            this.limpiarControlesCTB();
            this.mostrarInformacion("Condición técnica de bienes actualizada correctamente");
            this.modalRef.hide();
            this.loading = false;
          }, err => {
            this.mostrarError('Error en la actualización de la condición técnica de bienes');
            this.loading = false;
          }
        )
      } else {
        this.condicionTB.id = this.idCondicionTBGuardada;
        this.condicionTB.indice = this.indiceCTBActualizar;
        this.condicionTB.titulo = "Condición Técnicas Bienes" + new Date().toDateString();
        this.condicionTB.idSolicitud = this.idSolicitudGuardada;
        this.condicionTB.codigo = codigo;
        this.condicionTB.descripcion = descripcion;
        this.condicionTB.modelo = modelo;
        this.condicionTB.fabricante = fabricante;
        this.condicionTB.cantidad = cantidad;
        this.condicionTB.valorEstimado = valorEstimado;
        this.condicionTB.comentarios = comentarios;
        this.condicionTB.tipoMoneda = tipoMoneda;
        let nombreArchivo = "solp-" + this.generarllaveSoporte() + "-" + this.condicionTB.archivoAdjunto.name;
        let nombreArchivoBorrar = this.rutaAdjuntoCTB.split('/');
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
                  this.condicionesTB[objIndex].archivoAdjunto = this.condicionTB.archivoAdjunto;
                  this.condicionesTB[objIndex].rutaAdjunto = environment.urlRaiz + respuesta.data.ServerRelativeUrl;
                  this.condicionesTB[objIndex].id = this.condicionTB.id;
                  this.CargarTablaCTB();
                  this.limpiarControlesCTB();
                  this.mostrarInformacion("Condición técnica de bienes actualizada correctamente");
                  this.modalRef.hide();
                  this.loading = false;
                }, err => {
                  this.mostrarError('Error adjuntando el archivo en las condiciones técnicas de bienes');
                  this.loading = false;
                }
              )
            }, err => {
              this.mostrarError('Error en la actualización de la condición técnica de bienes');
              this.loading = false;
            }
          )
        } else {
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
                      this.condicionesTB[objIndex].archivoAdjunto = this.condicionTB.archivoAdjunto;
                      this.condicionesTB[objIndex].rutaAdjunto = environment.urlRaiz + respuesta.data.ServerRelativeUrl;
                      this.condicionesTB[objIndex].id = this.condicionTB.id;
                      this.CargarTablaCTB();
                      this.limpiarControlesCTB();
                      this.mostrarInformacion("Condición técnica de bienes actualizada correctamente");
                      this.modalRef.hide();
                      this.loading = false;
                    }, err => {
                      this.mostrarError('Error adjuntando el archivo en las condiciones técnicas de bienes');
                      this.loading = false;
                    }
                  )
                }, err => {
                  this.mostrarError('Error borrando el archivo en las condiciones técnicas de bienes');
                  this.loading = false;
                }
              )
            }, err => {
              this.mostrarError('Error en la actualización de la condición técnica de bienes');
              this.loading = false;
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

  limpiarControlesCTB(): any {
    this.ctbFormulario.controls["codigoCTB"].setValue('');
    this.ctbFormulario.controls["descripcionCTB"].setValue('');
    this.ctbFormulario.controls["valorEstimadoCTB"].setValue('');
    this.ctbFormulario.controls["modeloCTB"].setValue('');
    this.ctbFormulario.controls["fabricanteCTB"].setValue('');
    this.ctbFormulario.controls["cantidadCTB"].setValue('');
    this.ctbFormulario.controls["valorEstimadoCTB"].setValue('');
    this.ctbFormulario.controls["tipoMonedaCTB"].setValue('');
    this.ctbFormulario.controls["adjuntoCTB"].setValue(null);
    this.ctbFormulario.controls["comentariosCTB"].setValue('');
  }

  subirAdjuntoCTB(event) {
    this.condicionTB = new CondicionTecnicaBienes(null, '', null, '', '', '', '', null, null, '', event.target.files[0], '', '');
  }

  ctsOnSubmit() {
    this.ctsSubmitted = true;
    if (this.ctsFormulario.invalid) {
      return;
    }

    this.loading = true;
    if (this.textoBotonGuardarCTS == "Guardar") {
      let codigo = this.ctsFormulario.controls["codigoCTS"].value;
      let descripcion = this.ctsFormulario.controls["descripcionCTS"].value;
      let cantidad = this.ctsFormulario.controls["cantidadCTS"].value;
      let valorEstimado = this.ctsFormulario.controls["valorEstimadoCTS"].value;
      let tipoMoneda = this.ctsFormulario.controls["tipoMonedaCTS"].value;
      let adjunto = this.ctsFormulario.controls["adjuntoCTS"].value;
      let comentarios = this.ctsFormulario.controls["comentariosCTS"].value;
      if (adjunto == null) {
        this.condicionTS = new CondicionTecnicaServicios(this.indiceCTS, "Condición Técnicas Servicios" + new Date().toDateString(), this.idSolicitudGuardada, codigo, descripcion, cantidad, valorEstimado, comentarios, null, '', tipoMoneda);
        this.servicio.agregarCondicionesTecnicasServicios(this.condicionTS).then(
          (item: ItemAddResult) => {
            this.condicionTS.id = item.data.Id;
            this.condicionesTS.push(this.condicionTS);
            this.indiceCTS++;
            this.CargarTablaCTS();
            this.limpiarControlesCTS();
            this.mostrarInformacion("Condición técnica de servicios agregada correctamente");
            this.modalRef.hide();
            this.loading = false;
          }, err => {
            this.mostrarError('Error en la creación de la condición técnica de bienes');
            this.loading = false;
          }
        )
      } else {
        this.condicionTS.indice = this.indiceCTS;
        this.condicionTS.titulo = "Condición Técnicas Servicios" + new Date().toDateString();
        this.condicionTS.idSolicitud = this.idSolicitudGuardada;
        this.condicionTS.codigo = codigo;
        this.condicionTS.descripcion = descripcion;
        this.condicionTS.cantidad = cantidad;
        this.condicionTS.valorEstimado = valorEstimado;
        this.condicionTS.comentarios = comentarios;
        this.condicionTS.tipoMoneda = tipoMoneda;
        let nombreArchivo = "solp-" + this.generarllaveSoporte() + "-" + this.condicionTS.archivoAdjunto.name;
        this.servicio.agregarCondicionesTecnicasServicios(this.condicionTS).then(
          (item: ItemAddResult) => {
            this.condicionTS.id = item.data.Id;
            this.servicio.agregarAdjuntoCondicionesTecnicasServicios(this.condicionTS.id, nombreArchivo, this.condicionTS.archivoAdjunto).then(
              (respuesta) => {
                console.log(respuesta);
                this.condicionTS.rutaAdjunto = environment.urlRaiz + respuesta.data.ServerRelativeUrl;
                this.condicionesTS.push(this.condicionTS);
                this.indiceCTS++;
                this.CargarTablaCTS();
                this.limpiarControlesCTS();
                this.mostrarInformacion("Condición técnica de servicios agregada correctamente");
                this.modalRef.hide();
                this.loading = false;
              }, err => {
                this.mostrarError('Error adjuntando el archivo en las condiciones técnicas de servicios');
                this.loading = false;
              }
            )
          }, err => {
            this.mostrarError('Error en la creación de la condición técnica de servicios');
            this.loading = false;
          }
        )
      }
    }

    if (this.textoBotonGuardarCTS == "Actualizar") {
      let codigo = this.ctsFormulario.controls["codigoCTS"].value;
      let descripcion = this.ctsFormulario.controls["descripcionCTS"].value;
      let cantidad = this.ctsFormulario.controls["cantidadCTS"].value;
      let valorEstimado = this.ctsFormulario.controls["valorEstimadoCTS"].value;
      let tipoMoneda = this.ctsFormulario.controls["tipoMonedaCTS"].value;
      let adjunto = this.ctsFormulario.controls["adjuntoCTS"].value;
      let comentarios = this.ctsFormulario.controls["comentariosCTS"].value;
      if (adjunto == null) {
        this.condicionTS = new CondicionTecnicaServicios(this.indiceCTSActualizar, "Condición Técnicas Servicios" + new Date().toDateString(), this.idSolicitudGuardada, codigo, descripcion, cantidad, valorEstimado, comentarios, null, '', tipoMoneda);
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
            this.condicionesTS[objIndex].id = this.condicionTS.id;
            this.CargarTablaCTS();
            this.limpiarControlesCTS();
            this.mostrarInformacion("Condición técnica de servicios actualizada correctamente");
            this.modalRef.hide();
            this.loading = false;
          }, err => {
            this.mostrarError('Error en la actualización de la condición técnica de servicios');
            this.loading = false;
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
        this.condicionTS.valorEstimado = valorEstimado;
        this.condicionTS.comentarios = comentarios;
        this.condicionTS.tipoMoneda = tipoMoneda;
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
                      this.condicionesTS[objIndex].archivoAdjunto = this.condicionTS.archivoAdjunto;
                      this.condicionesTS[objIndex].rutaAdjunto = environment.urlRaiz + respuesta.data.ServerRelativeUrl;
                      this.condicionesTS[objIndex].id = this.condicionTS.id;
                      this.CargarTablaCTS();
                      this.limpiarControlesCTS();
                      this.mostrarInformacion("Condición técnica de servicios actualizada correctamente");
                      this.modalRef.hide();
                      this.loading = false;
                    }, err => {
                      this.mostrarError('Error adjuntando el archivo en las condiciones técnicas de servicios');
                      this.loading = false;
                    }
                  )
                }, err => {
                  this.mostrarError('Error borrando el archivo en las condiciones técnicas de servicios');
                  this.loading = false;
                }
              )
            }, err => {
              this.mostrarError('Error en la actualización de la condición técnica de servicios');
              this.loading = false;
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
                  this.condicionesTS[objIndex].archivoAdjunto = this.condicionTS.archivoAdjunto;
                  this.condicionesTS[objIndex].rutaAdjunto = environment.urlRaiz + respuesta.data.ServerRelativeUrl;
                  this.condicionesTS[objIndex].id = this.condicionTS.id;
                  this.CargarTablaCTS();
                  this.limpiarControlesCTS();
                  this.mostrarInformacion("Condición técnica de servicios actualizada correctamente");
                  this.modalRef.hide();
                  this.loading = false;
                }, err => {
                  this.mostrarError('Error adjuntando el archivo en las condiciones técnicas de servicios');
                  this.loading = false;
                }
              )
            }, err => {
              this.mostrarError('Error en la actualización de la condición técnica de servicios');
              this.loading = false;
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
    this.ctsFormulario.controls["valorEstimadoCTS"].setValue('');
    this.ctsFormulario.controls["tipoMonedaCTS"].setValue('');
    this.ctsFormulario.controls["adjuntoCTS"].setValue(null);
    this.ctsFormulario.controls["comentariosCTS"].setValue('');
  }

  subirAdjuntoCTS(event) {
    this.condicionTS = new CondicionTecnicaServicios(null, '', null, '', '', null, null, '', event.target.files[0], '', '');
  }

  editarBienes(element, template: TemplateRef<any>) {
    this.indiceCTBActualizar = element.indice;
    this.idCondicionTBGuardada = element.id;
    if (element.archivoAdjunto != null) {
      this.mostrarAdjuntoCTB = true;
      this.rutaAdjuntoCTB = element.rutaAdjunto;
      this.nombreAdjuntoCTB = element.archivoAdjunto.name;
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
    this.tituloModalCTB = "Actualizar condición técnica de bienes";
    this.textoBotonGuardarCTB = "Actualizar";
    this.modalRef = this.modalServicio.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  editarServicios(element, template: TemplateRef<any>) {
    this.indiceCTSActualizar = element.indice;
    this.idCondicionTSGuardada = element.id;
    if (element.archivoAdjunto != null) {
      this.mostrarAdjuntoCTS = true;
      this.rutaAdjuntoCTS = element.rutaAdjunto;
      this.nombreAdjuntoCTS = element.archivoAdjunto.name;
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
    this.tituloModalCTS = "Actualizar condición técnica de servicios";
    this.textoBotonGuardarCTS = "Actualizar";
    this.modalRef = this.modalServicio.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
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
    this.loading = true;
    let tipoSolicitud = this.solpFormulario.controls["tipoSolicitud"].value;
    let cm = this.solpFormulario.controls["cm"].value;
    let empresa = this.solpFormulario.controls["empresa"].value;
    let ordenadorGastos = this.solpFormulario.controls["ordenadorGastos"].value;
    let valorPais = this.solpFormulario.controls["pais"].value;
    let pais = valorPais.nombre;
    let categoria = this.solpFormulario.controls["categoria"].value;
    let subcategoria = this.solpFormulario.controls["subcategoria"].value;
    let comprador = this.solpFormulario.controls["comprador"].value;
    let fechaEntregaDeseada = this.solpFormulario.controls["fechaEntregaDeseada"].value;
    let alcance = this.solpFormulario.controls["alcance"].value;
    let justificacion = this.solpFormulario.controls["justificacion"].value;
    let estado = "Borrador";

    if (this.condicionesTB.length > 0) {
      this.compraBienes = true;
    }
    if (this.condicionesTS.length > 0) {
      this.compraServicios = true;
    }

    this.solicitudGuardar = new Solicitud(
      'Solicitud Solpes: ' + new Date(),
      (tipoSolicitud != '') ? tipoSolicitud : '',
      (cm != '') ? cm : '',
      this.usuarioActual.nombre,
      (empresa != '') ? empresa : null,
      (ordenadorGastos != 'Seleccione') ? ordenadorGastos : null,
      (valorPais != '') ? valorPais.id : null,
      (categoria != null) ? categoria.nombre : '',
      (subcategoria != '') ? subcategoria.nombre : '',
      (comprador != '') ? comprador : '',
      (fechaEntregaDeseada != '') ? fechaEntregaDeseada : null,
      (alcance != '') ? alcance : '',
      (justificacion != '') ? justificacion : '',
      this.construirJsonCondicionesContractuales(),
      estado,
      this.usuarioActual.id,
      this.compraBienes,
      this.compraServicios);
    this.servicio.actualizarSolicitud(this.idSolicitudGuardada, this.solicitudGuardar).then(
      (item: ItemAddResult) => {
        this.MostrarExitoso("La solicitud ha tenido un guardado parcial correcto");
        this.loading = false;
      }, err => {
        this.mostrarError('Error en guardado parcial de la solicitud');
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
}