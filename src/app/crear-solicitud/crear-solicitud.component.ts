import { Component, OnInit, TemplateRef } from '@angular/core';
import { TipoSolicitud } from '../dominio/tipoSolicitud';
import { setTheme } from 'ngx-bootstrap/utils';
import { SPServicio } from '../servicios/sp-servicio';
import { Usuario } from '../dominio/usuario';
import { Empresa } from '../dominio/empresa';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Select2Data } from 'ng-select2-component';
import { Pais } from '../dominio/pais';
import { Categoria } from '../dominio/categoria';
import { Subcategoria } from '../dominio/subcategoria';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/public_api';
import { CondicionContractual } from '../dominio/condicionContractual';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Bienes } from '../dominio/bienes';
import { Servicios } from '../dominio/servicios';
import { Router } from '@angular/router';
import { Solicitud } from '../dominio/solicitud';
import { ItemAddResult } from 'sp-pnp-js';
import { CondicionTecnicaBienes } from '../dominio/condicionTecnicaBienes';
import { CondicionTecnicaServicios } from '../dominio/condicionTecnicaServicios';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
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
  contadorBienes = 0;
  private bienes: Bienes[] = [];
  contadorServicios = 0;
  private servicios: Servicios[] = [];
  cadenaJsonCondicionesContractuales: string;
  solicitudGuardar: Solicitud;
  condicionesTB : CondicionTecnicaBienes [] = [];
  condicionTBGuardar: CondicionTecnicaBienes;
  emptyCTB: boolean;
  condicionTSGuardar: CondicionTecnicaServicios;
  emptyCTS: boolean;
  modalRef: BsModalRef;
  diasEntregaDeseada: number;
  dataSource;
  columnsToDisplay = ['codigo', 'descripcion'];
  expandedElement: CondicionTecnicaBienes | null;
  constructor(private formBuilder: FormBuilder, private servicio: SPServicio, private modalServicio: BsModalService, public toastr: ToastrManager, private router: Router) {
    setTheme('bs4');
    this.mostrarContratoMarco = false;
    this.loading = false;
    this.emptyCTB = true;
    this.emptyCTS = true;
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.condicionesTB;
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
      adjuntoCTS: ['', Validators.required],
      comentariosCTS: ['']
    });
  }

  RegistrarFormularioCTB() {
    this.ctbFormulario = this.formBuilder.group({
      codigoCTB: [''],
      descripcionCTB: ['', Validators.required],
      modeloCTB: ['', Validators.required],
      fabricanteCTB: ['', Validators.required],
      claseSiaCTB: [''],
      cantidadCTB: ['', Validators.required],
      valorEstimadoCTB: [''],
      tipoMonedaCTB: [''],
      adjuntoCTB: ['', Validators.required],
      comentariosCTB: ['']
    });
  }

  ValidarTipoMonedaObligatoriaSiHayValorEstimadoCTS() {
    const tipoMonedaControl = this.ctsFormulario.get('tipoMonedaCTS');
    this.ctsFormulario.get('valorEstimadoCTS').valueChanges.subscribe(
      (valor: string) => {
        if (valor != '') {
          tipoMonedaControl.setValidators([Validators.required]);
        }
        else {
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
          tipoMonedaControl.setValidators([Validators.required]);
        }
        else {
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
        console.log(this.diasEntregaDeseada);
        this.minDate = new Date();
        this.minDate.setDate(this.minDate.getDate() + this.diasEntregaDeseada);
        this.loading = false;
      }, err => {
        console.log('Error obteniendo categorías: ' + err);
      }
    )
  }

  filtrarSubcategorias() {
    this.loading = true;
    let categoria = this.solpFormulario.controls["categoria"].value;
    let pais = this.solpFormulario.controls["pais"].value;
    this.limpiarCondicionesContractuales();
    if(categoria != '' && pais != ''){
      this.servicio.ObtenerSubcategorias(categoria.id, pais.id).subscribe(
        (respuesta) => {
          console.log(respuesta);
          this.subcategorias = Subcategoria.fromJsonList(respuesta);
          console.log(this.subcategorias);
          this.loading = false;
        }, err => {
          console.log('Error obteniendo subcategorias: ' + err);
        }
      )
    }else{
      this.loading = false;
    }
  }

  cargarCondicionesContractuales() {
    this.loading = true;
    let Subcategoria = this.solpFormulario.controls["subcategoria"].value;
    this.limpiarCondicionesContractuales();
    this.subcategoriaSeleccionada = this.subcategorias.find(s => s.id == Subcategoria.id);
    this.subcategoriaSeleccionada.condicionesContractuales.forEach(element => {
      this.condicionesContractuales.push(new CondicionContractual(element.Title, element.ID));
    });
    this.registrarControlesCondicionesContractuales();
    this.cargarComprador(this.subcategoriaSeleccionada);
    this.loading = false;
  }

  cargarComprador(subcategoriaSeleccionada: Subcategoria): any {
    this.solpFormulario.controls["comprador"].setValue(subcategoriaSeleccionada.comprador);
  }

  limpiarCondicionesContractuales(): any {
    this.condicionesContractuales = [];
  }

  registrarControlesCondicionesContractuales(): any {
    this.condicionesContractuales.forEach(condicionContractual => {
      this.solpFormulario.addControl('condicionContractual' + condicionContractual.id, new FormControl());
    });
  }

  guardarSolicitud() {
    let respuesta;
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

    if (this.EsCampoVacio(tipoSolicitud)) {
      this.mostrarAdvertencia("El campo Tipo de solicitud es requerido");
      return false;
    }

    if (this.EsCampoVacio(empresa)) {
      this.mostrarAdvertencia("El campo Empresa es requerido");
      return false;
    }

    if (this.EsCampoVacio(ordenadorGastos)) {
      this.mostrarAdvertencia("El campo Ordenador de gastos es requerido");
      return false;
    }

    if (this.EsCampoVacio(pais)) {
      this.mostrarAdvertencia("El campo País es requerido");
      return false;
    }

    if (this.EsCampoVacio(categoria)) {
      this.mostrarAdvertencia("El campo Categoría es requerido");
      return false;
    }

    if (this.EsCampoVacio(subcategoria)) {
      this.mostrarAdvertencia("El campo Subcategoría es requerido");
      return false;
    }

    if (this.EsCampoVacio(comprador)) {
      this.mostrarAdvertencia("El campo Comprador es requerido");
      return false;
    }

    if (this.EsCampoVacio(fechaEntregaDeseada)) {
      this.mostrarAdvertencia("El campo Fecha entrega deseada es requerido");
      return false;
    }

    if (this.EsCampoVacio(alcance)) {
      this.mostrarAdvertencia("El campo Alcance es requerido");
      return false;
    }

    if (tipoSolicitud == 'Solp' || tipoSolicitud == 'CM') {
      if (this.EsCampoVacio(justificacion)) {
        this.mostrarAdvertencia("El campo Justificación es requerido");
        return false;
      }
    }

    respuesta = this.ValidarCondicionesContractuales();
    if (respuesta == false) {
      return respuesta;
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
        this.construirJsonCondicionesContractuales());

      this.servicio.agregarSolicitud(this.solicitudGuardar).then(
        (item: ItemAddResult) => {
          this.MostrarExitoso("La solicitud se ha guardado correctamente");
          this.router.navigate(['/mis-solicitudes']);
        }, err => {
          this.mostrarError('Error en la creación de la solicitud');
        }
      )
    }
  }

  construirJsonCondicionesContractuales(): string {
    this.cadenaJsonCondicionesContractuales = '';
    this.cadenaJsonCondicionesContractuales += ('{ "condiciones":[');
    this.condicionesContractuales.forEach(condicionContractual => {
      this.cadenaJsonCondicionesContractuales += ('{"campo": "' + condicionContractual.nombre + '", "descripcion": "' + this.solpFormulario.controls['condicionContractual' + condicionContractual.id].value + '"},');
    });
    this.cadenaJsonCondicionesContractuales = this.cadenaJsonCondicionesContractuales.substring(0, this.cadenaJsonCondicionesContractuales.length - 1);
    this.cadenaJsonCondicionesContractuales += (']}')
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
    this.modalRef = this.modalServicio.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  abrirModalCTS(template: TemplateRef<any>) {
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

    let codigo = this.ctbFormulario.controls["codigoCTB"].value;
    let descripcion = this.ctbFormulario.controls["descripcionCTB"].value;
    let modelo = this.ctbFormulario.controls["modeloCTB"].value;
    let fabricante = this.ctbFormulario.controls["fabricanteCTB"].value;
    let claseSia = this.ctbFormulario.controls["claseSiaCTB"].value;
    let cantidad = this.ctbFormulario.controls["cantidadCTB"].value;
    let valorEstimado = this.ctbFormulario.controls["valorEstimadoCTB"].value;
    let tipoMoneda = this.ctbFormulario.controls["tipoMonedaCTB"].value;
    let adjunto = this.ctbFormulario.controls["adjuntoCTB"].value;
    let comentarios = this.ctbFormulario.controls["comentariosCTB"].value;
    this.condicionesTB.push(new CondicionTecnicaBienes("Condición Técnicas Bienes" + new Date().toDateString(), null, codigo, descripcion, modelo, fabricante, claseSia, cantidad, valorEstimado, tipoMoneda, comentarios));
    
    this.CargarTablaCTB();
    this.limpiarControlesCTB();
    this.mostrarInformacion("Condición técnica de bienes agregada correctamente");
    this.modalRef.hide();    
  }

  private CargarTablaCTB() {
    this.dataSource.data = this.condicionesTB;
    this.emptyCTB = false;
  }

  limpiarControlesCTB(): any {
    this.ctbFormulario.reset();
  }

  ctsOnSubmit() {
    this.ctsSubmitted = true;
    if (this.ctsFormulario.invalid) {
      return;
    }

    let codigo = this.ctsFormulario.controls["codigoCTS"].value;
    let descripcion = this.ctsFormulario.controls["descripcionCTS"].value;
    let cantidad = this.ctsFormulario.controls["cantidadCTS"].value;
    let valorEstimado = this.ctsFormulario.controls["valorEstimadoCTS"].value;
    let tipoMoneda = this.ctsFormulario.controls["tipoMonedaCTS"].value;
    let adjunto = this.ctsFormulario.controls["adjuntoCTS"].value;
    let comentarios = this.ctsFormulario.controls["comentariosCTS"].value;

    alert('SUCCESS!! :-)');
  }
}
