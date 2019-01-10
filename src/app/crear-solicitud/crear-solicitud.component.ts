import { Component, OnInit } from '@angular/core';
import { TipoSolicitud } from '../dominio/tipoSolicitud';
import { setTheme } from 'ngx-bootstrap/utils';
import { SPServicio } from '../servicios/sp-servicio';
import { Usuario } from '../dominio/usuario';
import { Empresa } from '../dominio/empresa';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Select2Data } from 'ng-select2-component';
import { Pais } from '../dominio/pais';
import { Categoria } from '../dominio/categoria';
import { Subcategoria } from '../dominio/subcategoria';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/public_api';
import { CondicionContractual } from '../dominio/condicionContractual';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Bienes } from '../dominio/bienes';

@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.css']
})
export class CrearSolicitudComponent implements OnInit {
  colorTheme = 'theme-blue';
  bsConfig: Partial<BsDatepickerConfig>;
  solpFormulario: FormGroup;
  submitted = false;
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

  constructor(private formBuilder: FormBuilder, private servicio: SPServicio, public toastr: ToastrManager) {
    setTheme('bs4');
    this.mostrarContratoMarco = false;
    this.loading = false;
  }

  showSuccess() {
    this.toastr.successToastr('This is success toast.', 'Success!');
  }

  showError() {
    this.toastr.errorToastr('This is error toast.', 'Oops!');
  }

  showWarning(mensaje: string) {
    this.toastr.warningToastr(mensaje, 'Validación');
  }

  showInfo() {
    this.toastr.infoToastr('This is info toast.', 'Info');
  }

  showCustom() {
    this.toastr.customToastr('Custom Toast', null, { enableHTML: true });
  }

  showToast(position: any = 'top-left') {
    this.toastr.infoToastr('This is a toast.', 'Toast', { position: position });
  }

  ngOnInit() {
    this.loading = true;
    this.aplicarTemaCalendario();
    this.RecuperarUsuario();
    this.RegistrarFormulario();
    this.obtenerTiposSolicitud();
  }

  aplicarTemaCalendario() {
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  RegistrarFormulario() {
    this.solpFormulario = this.formBuilder.group({
      //Generales
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
      justificacion: [''],
      //Primera fila de condiciones técnicas bienes
      codigoBienes0: [''],
      descripcionBienes0: [''],
      modeloBienes0: [''],
      fabricanteBienes0: [''],
      claseSiaBienes0: [''],
      cantidadBienes0: [''],
      valorEstimadoBienes0: [''],
      adjuntoBienes0: [''],
      comentariosBienes0: ['']
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
        this.loading = false;
      }, err => {
        console.log('Error obteniendo categorías: ' + err);
      }
    )
  }

  filtrarSubcategorias(categoriaId) {
    this.loading = true;
    this.limpiarCondicionesContractuales();
    this.servicio.ObtenerSubcategorias(categoriaId).subscribe(
      (respuesta) => {
        this.subcategorias = Subcategoria.fromJsonList(respuesta);
        this.loading = false;
      }, err => {
        console.log('Error obteniendo subcategorias: ' + err);
      }
    )
  }

  cargarCondicionesContractuales(subcategoriaId) {
    this.loading = true;
    this.limpiarCondicionesContractuales();
    this.subcategoriaSeleccionada = this.subcategorias.find(s => s.id == subcategoriaId);
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

  agregarBienes() {
    let indice = this.contadorBienes + 1;
    let campoCodigo = "codigoBienes" + indice.toString();
    let campoDescripcion = "descripcionBienes" + indice.toString();
    let campoModelo = "modeloBienes" + indice.toString();
    let campoFabricante = "fabricanteBienes" + indice.toString();
    let campoClaseSia = "claseSiaBienes" + indice.toString();
    let campoCantidad = "cantidadBienes" + indice.toString();
    let campoValorEstimado = "valorEstimadoBienes" + indice.toString();
    let campoAdjunto = "adjuntoBienes" + indice.toString();
    let campoComentarios = "comentariosBienes" + indice.toString();
    this.solpFormulario.addControl(campoCodigo, new FormControl());
    this.solpFormulario.addControl(campoDescripcion, new FormControl());
    this.solpFormulario.addControl(campoModelo, new FormControl());
    this.solpFormulario.addControl(campoFabricante, new FormControl());
    this.solpFormulario.addControl(campoClaseSia, new FormControl());
    this.solpFormulario.addControl(campoCantidad, new FormControl());
    this.solpFormulario.addControl(campoValorEstimado, new FormControl());
    this.solpFormulario.addControl(campoAdjunto, new FormControl());
    this.solpFormulario.addControl(campoComentarios, new FormControl());
    this.bienes.push(new Bienes(indice, campoCodigo, campoDescripcion, campoModelo, campoFabricante, campoClaseSia, campoCantidad, campoValorEstimado, campoAdjunto, campoComentarios));

    this.contadorBienes++;
  }

  borrarBienes(bien) {
    this.bienes = this.bienes.filter(item => item !== bien);
    this.solpFormulario.removeControl(bien.campoCodigo);
    this.solpFormulario.removeControl(bien.campoDescripcion);
    this.solpFormulario.removeControl(bien.campoModelo);
    this.solpFormulario.removeControl(bien.campoFabricante);
    this.solpFormulario.removeControl(bien.campoClaseSia);
    this.solpFormulario.removeControl(bien.campoCantidad);
    this.solpFormulario.removeControl(bien.campoValorEstimado);
    this.solpFormulario.removeControl(bien.campoAdjunto);
    this.solpFormulario.removeControl(bien.campoComentarios);
  }

  guardarSolicitud() {
    let respuesta;
    let tipoSolicitud = this.solpFormulario.controls["tipoSolicitud"].value;
    let cm = this.solpFormulario.controls["cm"].value;
    let empresa = this.solpFormulario.controls["empresa"].value;
    let ordenadorGastos = this.solpFormulario.controls["ordenadorGastos"].value;
    let pais = this.solpFormulario.controls["pais"].value;
    let categoria = this.solpFormulario.controls["categoria"].value;
    let subcategoria = this.solpFormulario.controls["subcategoria"].value;
    let comprador = this.solpFormulario.controls["comprador"].value;
    let fechaEntregaDeseada = this.solpFormulario.controls["fechaEntregaDeseada"].value;
    let alcance = this.solpFormulario.controls["alcance"].value;
    let justificacion = this.solpFormulario.controls["justificacion"].value;

    if (this.EsCampoVacio(tipoSolicitud)) {
      this.showWarning("El campo Tipo de solicitud es requerido");
      return false;
    }

    if (this.EsCampoVacio(empresa)) {
      this.showWarning("El campo Empresa es requerido");
      return false;
    }

    if (this.EsCampoVacio(ordenadorGastos)) {
      this.showWarning("El campo Ordenador de gastos es requerido");
      return false;
    }

    if (this.EsCampoVacio(pais)) {
      this.showWarning("El campo País es requerido");
      return false;
    }

    if (this.EsCampoVacio(categoria)) {
      this.showWarning("El campo Categoría es requerido");
      return false;
    }

    if (this.EsCampoVacio(subcategoria)) {
      this.showWarning("El campo Subcategoría es requerido");
      return false;
    }

    if (this.EsCampoVacio(comprador)) {
      this.showWarning("El campo Comprador es requerido");
      return false;
    }

    if (this.EsCampoVacio(fechaEntregaDeseada)) {
      this.showWarning("El campo Fecha entrega deseada es requerido");
      return false;
    }

    if (this.EsCampoVacio(alcance)) {
      this.showWarning("El campo Alcance es requerido");
      return false;
    }

    if (tipoSolicitud == 'Solp' || tipoSolicitud == 'CM') {
      if (this.EsCampoVacio(justificacion)) {
        this.showWarning("El campo Justificación es requerido");
        return false;
      }
    }

    respuesta = this.ValidarCondicionesContractuales();

    if(respuesta == false){
      return respuesta;
    }

    respuesta = this.ValidarCondicionesTecnicasBienes(pais);
    
    if(respuesta == false){
      return respuesta;
    }

    respuesta = this.ValidarCondicionesTecnicasServicios();
    
    if(respuesta == false){
      return respuesta;
    }

    if(respuesta == true){
      console.log("Puede guardar");
    }
    
  }

  private ValidarCondicionesTecnicasServicios() : boolean {
    return true;
  }

  private ValidarCondicionesTecnicasBienes(pais) : boolean {
    let respuesta = true;
    //Se debe validar la primera fila de bienes
    this.bienes.forEach(element => {
      let codigoBienes = this.solpFormulario.controls[element.campoCodigo].value;
      let descripcion = this.solpFormulario.controls[element.campoDescripcion].value;
      let modelo = this.solpFormulario.controls[element.campoModelo].value;
      let fabricante = this.solpFormulario.controls[element.campoFabricante].value;
      let cantidad = this.solpFormulario.controls[element.campoCantidad].value;
      let adjunto = this.solpFormulario.controls[element.campoAdjunto].value;

      console.log(pais);
      if (pais == "Brasil") {
        if (this.EsCampoVacio(codigoBienes)) {
          this.showWarning("Hay algún código vacío en las Condiciones técnicas de bienes");
          respuesta = false;
        }
      }

      console.log(descripcion);
      if (this.EsCampoVacio(descripcion)) {
        this.showWarning("Hay alguna descripción vacía en las Condiciones técnicas de bienes");
        respuesta = false;
      }

      if (this.EsCampoVacio(modelo)) {
        this.showWarning("Hay algún modelo vacío en las Condiciones técnicas de bienes");
        respuesta = false;
      }

      if (this.EsCampoVacio(fabricante)) {
        this.showWarning("Hay alguna fabricante vacío en las Condiciones técnicas de bienes");
        respuesta = false;
      }

      if (this.EsCampoVacio(cantidad)) {
        this.showWarning("Hay alguna cantidad vacía en las Condiciones técnicas de bienes");
        respuesta = false;
      }

      if (this.EsCampoVacio(adjunto)) {
        this.showWarning("Faltan adjuntos en las Condiciones técnicas de bienes");
        respuesta = false;
      }
    });

    return respuesta;

  }

  private ValidarCondicionesContractuales() : boolean {
    let respuesta = true;
    this.condicionesContractuales.forEach(element => {
      let condicionContractual = this.solpFormulario.controls["condicionContractual" + element.id].value;
      if (this.EsCampoVacio(condicionContractual)) {
        this.showWarning("Hay condiciones contractuales sin llenar: " + element.nombre);
        respuesta = false;
      }
    });

    return respuesta;
  }

  EsCampoVacio(valorCampo: string) {
    if (valorCampo === "" || valorCampo == 'Seleccione' || valorCampo == null) {
      return true;
    }
    return false
  }

}
