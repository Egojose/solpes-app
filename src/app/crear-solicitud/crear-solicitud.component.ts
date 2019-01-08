import { Component, OnInit } from '@angular/core';
import { TipoSolicitud } from '../dominio/tipoSolicitud';
import { setTheme } from 'ngx-bootstrap/utils';
import { SPServicio } from '../servicios/sp-servicio';
import { Usuario } from '../dominio/usuario';
import { Empresa } from '../dominio/empresa';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Select2Data } from 'ng-select2-component';
import { Pais } from '../dominio/pais';
import { Categoria } from '../dominio/categoria';
import { Subcategoria } from '../dominio/subcategoria';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/public_api';
import { CondicionContractual } from '../dominio/condicionContractual';

@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.css']
})
export class CrearSolicitudComponent implements OnInit {
  colorTheme = 'theme-blue';
  bsConfig: Partial<BsDatepickerConfig>;
  solpFormulario: FormGroup;
  tiposSolicitud: TipoSolicitud[] = [];
  empresas: Empresa[] = [];
  mostrarContratoMarco: boolean;
  usuarioActual: Usuario;
  usuarios: Usuario[] = [];
  nombreUsuario: string;
  paises: Pais[] = [];
  categorias: Categoria[] = [];
  subcategorias: Subcategoria[] = [];
  condicionesContractuales: CondicionContractual[] = [];
  loading: boolean;
  valorUsuarioPorDefecto: string = "Seleccione";
  dataUsuarios: Select2Data = [
    { value: 'Seleccione', label: 'Seleccione' }
  ];

  constructor(private formBuilder: FormBuilder, private servicio: SPServicio) {
    setTheme('bs4');
    this.mostrarContratoMarco = false;
    this.loading = false;
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
      tipoSolicitud: ['', Validators.required],
      cm: [''],
      solicitante: [''],
      empresa: ['', Validators.required],
      ordenadorGastos: ['', Validators.required],
      pais: ['', Validators.required],
      categoria: ['', Validators.required],
      subcategoria: ['', Validators.required],
      comprador: ['', Validators.required],
      fechaEntregaDeseada: ['', Validators.required],
      alcance: ['', Validators.required],
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
        this.obtenerCondicionesContractuales();
      }, err => {
        console.log('Error obteniendo categorías: ' + err);
      }
    )
  }

  obtenerCondicionesContractuales() {
    this.servicio.ObtenerCondicionesContractuales().subscribe(
      (respuesta) => {
        this.condicionesContractuales = CondicionContractual.fromJsonList(respuesta);
        this.registrarControlesCondicionesContractuales();
        this.loading = false;
      }, err => {
        console.log('Error obteniendo categorías: ' + err);
      }
    )
  }

  registrarControlesCondicionesContractuales(): any {
    this.condicionesContractuales.forEach(condicionContractual => {
      this.solpFormulario.addControl('condicionContractual-' + condicionContractual.id, new FormControl());
    });
  }

  filtrarSubcategorias(categoriaId) {
    this.loading = true;
    this.servicio.ObtenerSubcategorias(categoriaId).subscribe(
      (respuesta) => {
        this.subcategorias = Subcategoria.fromJsonList(respuesta);
        this.loading = false;
      }, err => {
        console.log('Error obteniendo subcategorias: ' + err);
      }
    )
  }
}
