import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SPServicio } from '../servicios/sp-servicio';
import { BsModalService, setTheme, BsDatepickerConfig, BsModalRef } from 'ngx-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Usuario } from '../dominio/usuario';
import { TipoSolicitud } from '../dominio/tipoSolicitud';
import { Empresa } from '../dominio/empresa';
import { Select2Data } from 'ng-select2-component';
import { Pais } from '../dominio/pais';
import { Categoria } from '../dominio/categoria';
import { CondicionContractual } from '../dominio/condicionContractual';
import { Subcategoria } from '../dominio/subcategoria';
import { Solicitud } from '../dominio/solicitud';

@Component({
  selector: 'app-editar-solicitud',
  templateUrl: './editar-solicitud.component.html',
  styleUrls: ['./editar-solicitud.component.css']
})
export class EditarSolicitudComponent implements OnInit {
  IdSolicitud;
  colorTheme = 'theme-blue';
  bsConfig: Partial<BsDatepickerConfig>;
  minDate: Date;
  solpFormulario: FormGroup;
  nombreUsuario: string;
  usuarioActual: Usuario;
  ctbFormulario: FormGroup;
  ctbSubmitted = false;
  ctsFormulario: FormGroup;
  ctsSubmitted = false;
  tiposSolicitud: TipoSolicitud[] = [];
  empresas: Empresa[] = [];
  usuarios: Usuario[] = [];
  subcategorias: Subcategoria[] = [];
  subcategoria: Subcategoria;
  condicionesContractuales: CondicionContractual[] = [];
  dataUsuarios: Select2Data = [
    { value: 'Seleccione', label: 'Seleccione' }
  ];
  paises: Pais[] = [];
  categorias: Categoria[] = [];
  categoria: Categoria;
  diasEntregaDeseada: number;
  consecutivoActual: number;
  correoManager: string;
  emptyManager: boolean;
  valorUsuarioPorDefecto: string = "Seleccione";
  modalRef: BsModalRef;
  emptyasteriscoCTB: boolean;
  emptyasteriscoCTs: boolean;
  mostrarContratoMarco: boolean;
  loading: boolean;
  mostrarAdjuntoCTB: boolean;
  tituloModalCTB: string;
  textoBotonGuardarCTB: string;
  mostrarAdjuntoCTS: boolean;
  tituloModalCTS: string;
  textoBotonGuardarCTS: String;
  solicitudRecuperada: Solicitud;
  subcategoriaSeleccionada: Subcategoria;
  compradorId: number;
  codigoAriba: string;
  indexCondicionesContractuales: number;

  constructor(private formBuilder: FormBuilder, private servicio: SPServicio, private modalServicio: BsModalService, public toastr: ToastrManager, private router: Router) {
    this.solicitudRecuperada = JSON.parse(sessionStorage.getItem('solicitud'));
    setTheme('bs4');
    this.indexCondicionesContractuales = 0;
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
    console.log(this.solicitudRecuperada);
    this.aplicarTemaCalendario();
    this.RecuperarUsuario();
    this.RegistrarFormularioSolp();
    this.RegistrarFormularioCTB();
    this.RegistrarFormularioCTS();
    this.obtenerTiposSolicitud();
  }

  aplicarTemaCalendario() {
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme, dateInputFormat: 'DD/MM/YYYY' });
  }

  RecuperarUsuario() {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
  }

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

  get f() { return this.ctbFormulario.controls; }

  get f2() { return this.ctsFormulario.controls; }

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
        this.cargarSolicitud();
      }, err => {
        console.log('Error obteniendo categorías: ' + err);
      }
    )
  }

  cargarSolicitud(): any {
    this.solpFormulario.controls["tipoSolicitud"].setValue(this.solicitudRecuperada.tipoSolicitud);
    this.solpFormulario.controls["solicitante"].setValue(this.solicitudRecuperada.solicitante);
    this.solpFormulario.controls["empresa"].setValue(this.solicitudRecuperada.empresa.ID);
    this.valorUsuarioPorDefecto = this.solicitudRecuperada.ordenadorGastos.ID.toString();
    this.solpFormulario.controls["pais"].setValue(this.solicitudRecuperada.pais.ID);
    this.categoria = this.categorias.filter(x => x.nombre === this.solicitudRecuperada.categoria)[0];
    this.solpFormulario.controls["categoria"].setValue(this.categoria.id);
    this.cargarSubcategorias();
    //Subcategoría


  }

  cargarSubcategorias() {
    let categoria = this.solpFormulario.controls["categoria"].value;
    let pais = this.solpFormulario.controls["pais"].value;
    this.servicio.ObtenerSubcategorias(categoria, pais).subscribe(
      (respuesta) => {
        this.subcategorias = Subcategoria.fromJsonList(respuesta);
        this.subcategoria = this.subcategorias.filter(x => x.nombre == this.solicitudRecuperada.subcategoria)[0];
        this.solpFormulario.controls["subcategoria"].setValue(this.subcategoria.id);
        if(this.solicitudRecuperada.condicionesContractuales != '' && this.solicitudRecuperada.condicionesContractuales != '{ "condiciones":]}'){
          let jsonCondicionesContractuales = JSON.parse(this.solicitudRecuperada.condicionesContractuales);
          jsonCondicionesContractuales.condiciones.forEach(element => {
              this.condicionesContractuales.push(new CondicionContractual(element.campo, this.indexCondicionesContractuales, element.descripcion));
              this.indexCondicionesContractuales++;
          });
          this.registrarControlesCondicionesContractualesCargados();
        }
        this.solpFormulario.controls["comprador"].setValue(this.solicitudRecuperada.comprador.Title);
        this.solpFormulario.controls["fechaEntregaDeseada"].setValue(new Date(this.solicitudRecuperada.fechaEntregaDeseada));
        this.solpFormulario.controls["codigoAriba"].setValue(this.solicitudRecuperada.codigoAriba);
        this.solpFormulario.controls["alcance"].setValue(this.solicitudRecuperada.alcance);
        this.solpFormulario.controls["justificacion"].setValue(this.solicitudRecuperada.justificacion);
      }, err => {
        console.log('Error obteniendo subcategorias: ' + err);
      }
    )

  }

  seleccionarOrdenadorGastos(event) {
    if (event != "Seleccione") {
      this.emptyManager = false;
    } else {
      this.emptyManager = true;
    }
  }

  ValidacionesTipoSolicitud(tipoSolicitud) {
    this.mostrarCM(tipoSolicitud);
    this.deshabilitarJustificacion(tipoSolicitud);
  }

  mostrarCM(tipoSolicitud: any): any {
    if (tipoSolicitud.tieneCm) {
      this.mostrarContratoMarco = true;
    } else {
      this.mostrarContratoMarco = false;
      this.LimpiarContratoMarco();
    }
  }

  deshabilitarJustificacion(tipoSolicitud: any): any {
    if (tipoSolicitud.nombre === "Sondeo") {
      this.solpFormulario.controls["justificacion"].disable();
    } else {
      this.solpFormulario.controls["justificacion"].enable();
    }
  }

  LimpiarContratoMarco(): any {
    this.solpFormulario.controls["cm"].setValue("");
  }

  filtrarSubcategorias() {
    this.loading = true;
    let categoria = this.solpFormulario.controls["categoria"].value;
    let pais = this.solpFormulario.controls["pais"].value;
    this.limpiarCondicionesContractuales();
    if (categoria != '' && pais != '') {
      this.servicio.ObtenerSubcategorias(categoria, pais).subscribe(
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
    if (Subcategoria != '') {
      this.limpiarCondicionesContractuales();
      this.subcategoriaSeleccionada = this.subcategorias.find(s => s.id == Subcategoria);
      this.subcategoriaSeleccionada.condicionesContractuales.forEach(element => {
        this.condicionesContractuales.push(new CondicionContractual(element.Title, element.ID));
      });
      this.registrarControlesCondicionesContractuales();
      this.cargarDatosSubcategoria(this.subcategoriaSeleccionada);
      this.loading = false;
    } else {
      this.solpFormulario.controls["comprador"].setValue('');
      this.solpFormulario.controls['codigoAriba'].setValue('');
      this.loading = false;
    }
  }

  registrarControlesCondicionesContractuales(): any {
    this.condicionesContractuales.forEach(condicionContractual => {
      this.solpFormulario.addControl('condicionContractual' + condicionContractual.id, new FormControl());
    });
  }

  registrarControlesCondicionesContractualesCargados(){
    console.log(this.condicionesContractuales);
    this.condicionesContractuales.forEach(condicionContractual => {
      this.solpFormulario.addControl('condicionContractual' + condicionContractual.id, new FormControl());
      this.solpFormulario.controls['condicionContractual' + condicionContractual.id].setValue(condicionContractual.valor);
    });
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


  limpiarControlesCTS(): any {
    this.ctsFormulario.controls["codigoCTS"].setValue('');
    this.ctsFormulario.controls["descripcionCTS"].setValue('');
    this.ctsFormulario.controls["cantidadCTS"].setValue('');
    this.ctsFormulario.controls["valorEstimadoCTS"].setValue('');
    this.ctsFormulario.controls["tipoMonedaCTS"].setValue('');
    this.ctsFormulario.controls["adjuntoCTS"].setValue(null);
    this.ctsFormulario.controls["comentariosCTS"].setValue('');
  }

  descartarSolicitud(template: TemplateRef<any>) {
    this.modalRef = this.modalServicio.show(template, { class: 'modal-lg' });
  }

  confirmarDescartar() {
    this.servicio.borrarSolicitud(this.IdSolicitud).then(
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

  salir() {
    this.router.navigate(["/mis-solicitudes"]);
  }
}
