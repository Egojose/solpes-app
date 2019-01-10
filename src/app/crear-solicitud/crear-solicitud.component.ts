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
import { Servicios } from '../dominio/servicios';
import { Router } from '@angular/router';
import { Solicitud } from '../dominio/solicitud';
import { ItemAddResult } from 'sp-pnp-js';

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
  contadorServicios = 0;
  private servicios: Servicios[] = [];
  solicitudGuardar: Solicitud;

  constructor(private formBuilder: FormBuilder, private servicio: SPServicio, public toastr: ToastrManager, private router: Router) {
    setTheme('bs4');
    this.mostrarContratoMarco = false;
    this.loading = false;
  }

  MostrarExitoso() {
    this.toastr.successToastr('This is success toast.', 'Success!');
  }

  mostrarError() {
    this.toastr.errorToastr('This is error toast.', 'Oops!');
  }

  mostrarAdvertencia(mensaje: string) {
    this.toastr.warningToastr(mensaje, 'Validación');
  }

  mostrarInformacion() {
    this.toastr.infoToastr('This is info toast.', 'Info');
  }

  mostrarPersonalizado() {
    this.toastr.customToastr('Custom Toast', null, { enableHTML: true });
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
      comentariosBienes0: [''],
      //Primera fila de condiciones técnicas servicios
      codigoServicios0: [''],
      descripcionServicios0: [''],
      cantidadServicios0: [''],
      valorEstimadoServicios0: [''],
      adjuntoServicios0: [''],
      comentariosServicios0: ['']
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

  filtrarSubcategorias() {
    this.loading = true;
    let categoria = this.solpFormulario.controls["categoria"].value;
    this.limpiarCondicionesContractuales();
    this.servicio.ObtenerSubcategorias(categoria.id).subscribe(
      (respuesta) => {
        this.subcategorias = Subcategoria.fromJsonList(respuesta);
        this.loading = false;
      }, err => {
        console.log('Error obteniendo subcategorias: ' + err);
      }
    )
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

  agregarServicios() {
    let indice = this.contadorServicios + 1;
    let campoCodigo = "codigoServicios" + indice.toString();
    let campoDescripcion = "descripcionServicios" + indice.toString();
    let campoCantidad = "cantidadServicios" + indice.toString();
    let campoValorEstimado = "valorEstimadoServicios" + indice.toString();
    let campoAdjunto = "adjuntoServicios" + indice.toString();
    let campoComentarios = "comentariosServicios" + indice.toString();
    this.solpFormulario.addControl(campoCodigo, new FormControl());
    this.solpFormulario.addControl(campoDescripcion, new FormControl());
    this.solpFormulario.addControl(campoCantidad, new FormControl());
    this.solpFormulario.addControl(campoValorEstimado, new FormControl());
    this.solpFormulario.addControl(campoAdjunto, new FormControl());
    this.solpFormulario.addControl(campoComentarios, new FormControl());
    this.servicios.push(new Servicios(indice, campoCodigo, campoDescripcion, campoCantidad, campoValorEstimado, campoAdjunto, campoComentarios));
    this.contadorServicios++;
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

  borrarServicios(servicio) {
    this.servicios = this.servicios.filter(item => item !== servicio);
    this.solpFormulario.removeControl(servicio.campoCodigo);
    this.solpFormulario.removeControl(servicio.campoDescripcion);
    this.solpFormulario.removeControl(servicio.campoCantidad);
    this.solpFormulario.removeControl(servicio.campoValorEstimado);
    this.solpFormulario.removeControl(servicio.campoAdjunto);
    this.solpFormulario.removeControl(servicio.campoComentarios);
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

    respuesta = this.ValidarCondicionesTecnicasBienes(pais);

    if (respuesta == false) {
      return respuesta;
    }

    respuesta = this.ValidarCondicionesTecnicasServicios(pais);

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
        pais,
        categoria.nombre,
        subcategoria.nombre,
        comprador,
        fechaEntregaDeseada,
        alcance,
        justificacion, 
        this.construirJsonCondicionesContractuales());

        this.servicio.agregarSolicitud(this.solicitudGuardar).then(
          (iar: ItemAddResult) => {
            this.router.navigate(['/mis-solicitudes']);
          }, err => {
            alert('Error en la creación de la solicitud!!');
          }
        )
    }

    console.log(this.solicitudGuardar);
  }

  construirJsonCondicionesContractuales(): string {

    let cadenaJson;
    cadenaJson.concat('{ "condiciones":[');

    this.condicionesContractuales.forEach(element => {
      
      cadenaJson.concat('{"campo": "Campo 1", "descripcion": "Descripcion 1"},');

    });

    cadenaJson.concat(']}')

    return cadenaJson;
  }

  private ValidarCondicionesTecnicasServicios(pais): boolean {
    let respuesta = true;
    //Se debe validar la primera fila de servicios
    let codigoServicios = this.solpFormulario.controls['codigoServicios0'].value;
    let descripcion = this.solpFormulario.controls['descripcionServicios0'].value;
    let cantidad = this.solpFormulario.controls['cantidadServicios0'].value;

    if (pais == "Brasil") {
      if (this.EsCampoVacio(codigoServicios)) {
        this.mostrarAdvertencia("Hay algún código vacío en las Condiciones técnicas de servicios");
        respuesta = false;
      }
    }

    if (this.EsCampoVacio(descripcion)) {
      this.mostrarAdvertencia("Hay alguna descripción vacía en las Condiciones técnicas de servicios");
      respuesta = false;
    }

    if (this.EsCampoVacio(cantidad)) {
      this.mostrarAdvertencia("Hay alguna cantidad vacía en las Condiciones técnicas de servicios");
      respuesta = false;
    }

    this.servicios.forEach(element => {
      let codigoServicios = this.solpFormulario.controls[element.campoCodigo].value;
      let descripcion = this.solpFormulario.controls[element.campoDescripcion].value;
      let cantidad = this.solpFormulario.controls[element.campoCantidad].value;

      if (pais == "Brasil") {
        if (this.EsCampoVacio(codigoServicios)) {
          this.mostrarAdvertencia("Hay algún código vacío en las Condiciones técnicas de servicios");
          respuesta = false;
        }
      }

      if (this.EsCampoVacio(descripcion)) {
        this.mostrarAdvertencia("Hay alguna descripción vacía en las Condiciones técnicas de servicios");
        respuesta = false;
      }

      if (this.EsCampoVacio(cantidad)) {
        this.mostrarAdvertencia("Hay alguna cantidad vacía en las Condiciones técnicas de servicios");
        respuesta = false;
      }

    });

    return respuesta;
  }

  private ValidarCondicionesTecnicasBienes(pais): boolean {
    let respuesta = true;
    //Se debe validar la primera fila de bienes
    let codigoBienes = this.solpFormulario.controls['codigoBienes0'].value;
    let descripcion = this.solpFormulario.controls['descripcionBienes0'].value;
    let modelo = this.solpFormulario.controls['modeloBienes0'].value;
    let fabricante = this.solpFormulario.controls['fabricanteBienes0'].value;
    let cantidad = this.solpFormulario.controls['cantidadBienes0'].value;
    let adjunto = this.solpFormulario.controls['adjuntoBienes0'].value;

    if (pais == "Brasil") {
      if (this.EsCampoVacio(codigoBienes)) {
        this.mostrarAdvertencia("Hay algún código vacío en las Condiciones técnicas de bienes");
        respuesta = false;
      }
    }

    if (this.EsCampoVacio(descripcion)) {
      this.mostrarAdvertencia("Hay alguna descripción vacía en las Condiciones técnicas de bienes");
      respuesta = false;
    }

    if (this.EsCampoVacio(modelo)) {
      this.mostrarAdvertencia("Hay algún modelo vacío en las Condiciones técnicas de bienes");
      respuesta = false;
    }

    if (this.EsCampoVacio(fabricante)) {
      this.mostrarAdvertencia("Hay alguna fabricante vacío en las Condiciones técnicas de bienes");
      respuesta = false;
    }

    if (this.EsCampoVacio(cantidad)) {
      this.mostrarAdvertencia("Hay alguna cantidad vacía en las Condiciones técnicas de bienes");
      respuesta = false;
    }

    if (this.EsCampoVacio(adjunto)) {
      this.mostrarAdvertencia("Faltan adjuntos en las Condiciones técnicas de bienes");
      respuesta = false;
    }

    this.bienes.forEach(element => {
      let codigoBienes = this.solpFormulario.controls[element.campoCodigo].value;
      let descripcion = this.solpFormulario.controls[element.campoDescripcion].value;
      let modelo = this.solpFormulario.controls[element.campoModelo].value;
      let fabricante = this.solpFormulario.controls[element.campoFabricante].value;
      let cantidad = this.solpFormulario.controls[element.campoCantidad].value;
      let adjunto = this.solpFormulario.controls[element.campoAdjunto].value;

      if (pais == "Brasil") {
        if (this.EsCampoVacio(codigoBienes)) {
          this.mostrarAdvertencia("Hay algún código vacío en las Condiciones técnicas de bienes");
          respuesta = false;
        }
      }

      if (this.EsCampoVacio(descripcion)) {
        this.mostrarAdvertencia("Hay alguna descripción vacía en las Condiciones técnicas de bienes");
        respuesta = false;
      }

      if (this.EsCampoVacio(modelo)) {
        this.mostrarAdvertencia("Hay algún modelo vacío en las Condiciones técnicas de bienes");
        respuesta = false;
      }

      if (this.EsCampoVacio(fabricante)) {
        this.mostrarAdvertencia("Hay alguna fabricante vacío en las Condiciones técnicas de bienes");
        respuesta = false;
      }

      if (this.EsCampoVacio(cantidad)) {
        this.mostrarAdvertencia("Hay alguna cantidad vacía en las Condiciones técnicas de bienes");
        respuesta = false;
      }

      if (this.EsCampoVacio(adjunto)) {
        this.mostrarAdvertencia("Faltan adjuntos en las Condiciones técnicas de bienes");
        respuesta = false;
      }
    });

    return respuesta;
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
    return false
  }

  salir() {
    this.router.navigate(["/mis-solicitudes"]);
  }

}
