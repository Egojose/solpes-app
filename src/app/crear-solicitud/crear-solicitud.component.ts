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
import { BsModalRef, BsModalService, TimepickerModule } from 'ngx-bootstrap';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { MatTableDataSource } from '@angular/material';
import { environment } from 'src/environments/environment';
import { responsableProceso } from '../dominio/responsableProceso';
import { NgxSpinnerService } from 'ngx-spinner';
import * as $ from 'jquery';
import { Grupo } from '../dominio/grupo';
import * as XLSX from 'xlsx';
import readXlsxFile from 'read-excel-file';
import { CondicionesTecnicasBienes } from '../entrega-bienes/condicionTecnicaBienes';
import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';
import { CondicionesTecnicasServicios } from '../entrega-servicios/condicionTecnicaServicio';


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
  cargaExcel: boolean;

  constructor(private formBuilder: FormBuilder, private servicio: SPServicio, private modalServicio: BsModalService, public toastr: ToastrManager, private router: Router, private spinner: NgxSpinnerService) {
    setTheme('bs4');
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
    this.cargaExcel = false;
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

  ngOnInit() {
    this.spinner.show();
    this.aplicarTemaCalendario();
    this.RecuperarUsuario();
    this.RegistrarFormularioSolp();
    this.RegistrarFormularioCTB();
    this.RegistrarFormularioCTS();
    this.ValidarTipoMonedaObligatoriaSiHayValorEstimadoCTB();
    this.ValidarTipoMonedaObligatoriaSiHayValorEstimadoCTS();
    // this.AsignarRequeridosDatosContables();
    this.obtenerTiposSolicitud();
    
  }

  changeListener($event): void {
    this.leerArchivo($event.target);
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

  procesarArchivo(file) {

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
            let obj = this.ValidarVaciosCTB(row, i);
            if (obj != "") {
              this.ObjCTB.push(obj);
            }
          }
          if (this.cantidadErrorFile === 0) {
            let contador = 0;
            this.ObjCTB.forEach(element => {
              this.servicio.agregarCondicionesTecnicasBienesExcel(element).then(
                (item: ItemAddResult) => {
                  console.log(element.Codigo);
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
    if(file[1][0] !== 'Código de material' || file[1][1] !== 'Descripción del elemento a comprar' || file[1][2] !== 'Modelo' || file[1][3] !== 'Fabricante' || file[1][4] !== 'Cantidad' || file[1][5] !== 'Valor estimado' || file[1][6] !== 'Tipo de moneda' || file[1][7] !== 'Centro de costos/ Orden de inversión' || file[1][8] !== 'Número de centro de costos/ Orden de inversión' || file[1][9] !== 'Número de cuenta' || file[1][10] !== 'Comentarios') {
      this.mostrarError('La plantilla ha sido modificada. Por favor vuelva a descargarla');
      this.spinner.hide();
      this.cantidadErrorFile = 0;
      return false;
    }
  }

  limpiarArrayErrorFile() {
   this.modalRef.hide()
  }

  ValidarVaciosCTB(row, i) {
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
      if((costoInversion !== "" || costoInversion !== null) && (costoInversion !== 'Centro de costos' && costoInversion !== 'Orden de inversión')) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({error: "El valor del campo Centro de costos/ Orden de inversión no coincide con los permitidos en la columna H fila " + (i + 1) + " Por favor revise o descargue la plantilla estándar"})
      }
      if (costoInversion === "" || costoInversion === null || costoInversion === undefined) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo Centro de costos/ Orden de inversión en la columna H fila " + (i + 1) })
      }
      if (numeroCostoInversion === "" || numeroCostoInversion === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo número de centro de costos/ Orden de inversión en la columna I fila " + (i + 1) })
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
          numeroCostoInversion: numeroCostoInversion.toString(),
          numeroCuenta: numeroCuentaString,
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
    else if (valorcompraOrdenEstadistica === "NO" && tipoSolicitud !== 'Sondeo' &&  (codigo !== "" || codigo !== null)) {

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
        this.ArrayErrorFile.push({error: "El campo Tipo moneda es obligatorio cuando hay valor estimado en la columna G fila " + (i +1) })
      }
      if((tipoMoneda !== null && tipoMoneda !== "") && (tipoMoneda !== 'ARS' && tipoMoneda !== 'BRL' && tipoMoneda !== 'CLP' && tipoMoneda !== 'COP' && tipoMoneda !== 'EUR' && tipoMoneda !== 'PEN' && tipoMoneda !== 'UF' && tipoMoneda !== 'USD')){
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({error: "El tipo de moneda no coincide con los valores permitidos. Por favor revise el campo en la columna G fila " + (i + 1) + " O descargue la plantilla estándar"})
      }
      if((costoInversion !== "" || costoInversion !== null) && (costoInversion !== 'Centro de costos' && costoInversion !== 'Orden de inversión')) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({error: "El valor del campo Centro de costos/ Orden de inversión no coincide con los permitidos en la columna H fila " + (i + 1) + " Por favor revise o descargue la plantilla estándar"})
      }
      if (costoInversion === "" || costoInversion === null || costoInversion === undefined) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo Centro de costos/ Orden de inversión en la columna H fila " + (i + 1) })
      }
      if (numeroCostoInversion === "" || numeroCostoInversion === null) {
        this.cantidadErrorFile++;
        this.ArrayErrorFile.push({ error: "El campo número de centro de costos/ Orden de inversión en la columna I fila " + (i + 1) })
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
          numeroCostoInversion: numeroCostoInversion.toString(),
          numeroCuenta: numeroCuentaString,
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
    }
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

  procesarArchivoServicios(file) {

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
            let obj = this.ValidarVaciosCTS(row, i);
            if (obj != "") {
              this.ObjCTS.push(obj);
            }
          }
          if (this.cantidadErrorFileCTS === 0) {
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
    if (file[1][0] !== 'Código de material' || file[1][1] !== 'Descripción del elemento a comprar' || file[1][2] !== 'Cantidad' || file[1][3] !== 'Valor estimado' || file[1][4] !== 'Tipo de moneda' || file[1][5] !== 'Centro de costos/ Orden de inversión' || file[1][6] !== 'Número centro de costos/ Orden de inversión' || file[1][7] !== 'Número de cuenta' || file[1][8] !== 'Comentarios') {
      this.mostrarError('La plantilla ha sido modificada. Por favor vuelva a descargarla');
      this.spinner.hide();
      this.cantidadErrorFileCTS = 0;
      return false;
    }
  }

limpiarArrayErrorFileCTS() {
  this.modalRef.hide()
}

ValidarVaciosCTS(row: any, i: number): any {
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

 
  if(valorcompraOrdenEstadistica === "NO" && tipoSolicitud !== 'Sondeo' && (codigo === "" || codigo === null)) {
    
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
      if((costoInversion !== "" || costoInversion !== null) && (costoInversion !== 'Centro de costos' && costoInversion !== 'Orden de inversión')) {
        this.cantidadErrorFileCTS++;
        this.ArrayErrorFileCTS.push({error: "El valor del campo Centro de costos/ Orden de inversión no coincide con los permitidos en la columna F fila " + (i + 1) + " Por favor revise o descargue la plantilla estándar"})
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

  
        let Obj ={
          Title: "Condición Técnicas Servicios" + new Date().toDateString(),
          SolicitudId: this.idSolicitudGuardada,
          Codigo: "",
          CodigoSondeo:"",
          Descripcion: descripcion.toString(),
          Cantidad: cantidad,
          CantidadSondeo: cantidad,
          ValorEstimado: valorEstimadoString,
          PrecioSondeo: valorEstimadoString,
          TipoMoneda: tipoMoneda,
          MonedaSondeo: tipoMoneda,
          Comentario: comentarios,
          costoInversion: costoInversion.toString(),
          numeroCostoInversion: numeroCostoInversion.toString(),
          numeroCuenta: numeroCuentaStringCTS,
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
        if((costoInversion !== "" || costoInversion !== null) && (costoInversion !== 'Centro de costos' && costoInversion !== 'Orden de inversión')) {
          this.cantidadErrorFileCTS++;
          this.ArrayErrorFileCTS.push({error: "El valor del campo Centro de costos/ Orden de inversión no coincide con los permitidos en la columna F fila " + (i + 1) + " Por favor revise o descargue la plantilla estándar"})
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
            costoInversion: costoInversion.toString(),
            numeroCostoInversion: numeroCostoInversion.toString(),
            numeroCuenta: numeroCuentaStringCTS,
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
  }

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
      numCuentaCTS: ['']
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
      numCuentaCTB: ['']
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

  ValidacionesTipoSolicitud(tipoSolicitud) {
    console.log(tipoSolicitud);
    this.mostrarCM(tipoSolicitud);
    this.deshabilitarJustificacion(tipoSolicitud);
    if(tipoSolicitud.nombre !== 'Sondeo') {
      this.mostrarDivDatosContables();
      this.AsignarRequeridosDatosContables();
    }
    else {
      this.removerRequeridosDatosContables();
      this.esconderDatosContables();
      this.limpiarDatosContables();
    }
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

  enviarSolicitud() {
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
                null,
                this.compraBienes,
                this.compraServicios,
                this.fueSondeo,
                FechaDeCreacion);

              this.servicio.actualizarSolicitud(this.idSolicitudGuardada, this.solicitudGuardar).then(
                (item: ItemAddResult) => {
                  // this.servicio.actualizarConsecutivo(consecutivoNuevo).then(
                  //   (item: ItemAddResult) => {
                      let notificacion = {
                        IdSolicitud: this.idSolicitudGuardada.toString(),
                        ResponsableId: responsable,
                        Estado: estado
                      };
                      this.servicio.agregarNotificacion(notificacion).then(
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

  ValidarCompraOrdenEstadistica(): boolean {
    let respuesta = true;
    let valorOrdenEstadistica = this.solpFormulario.controls["compraOrdenEstadistica"].value;
    let valorNumeroOrdenEstadistica = this.solpFormulario.controls["numeroOrdenEstadistica"].value;
    if (valorOrdenEstadistica == "NO") {
      respuesta = true;
    } else {
      if (this.EsCampoVacio(valorNumeroOrdenEstadistica)) {
        respuesta = false;
        this.mostrarAdvertencia("El campo Número de orden estadística es requerido");
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

  private validarCondicionesTSdatosContables(): boolean {
    let respuesta = true;
    let tipoSolicitud = this.solpFormulario.get('tipoSolicitud').value;
    if (this.cargaExcel === false) {
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
    else if (this.cargaExcel) {
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
    this.condicionTB = new CondicionTecnicaBienes(null, '', null, '', '', '', '', null, null, '', null, '', '');
    let solicitudTipo = this.solpFormulario.controls["tipoSolicitud"].value
    let paisValidar = this.solpFormulario.controls["pais"].value.nombre
    if(solicitudTipo === "" || solicitudTipo === null || solicitudTipo === undefined || paisValidar === "" || paisValidar === null || paisValidar === undefined) {
      this.mostrarAdvertencia('Debe selccionar el tipo de solicitud y el país antes de agregar bienes')
      return false;
    }
    else {
    this.mostrarAdjuntoCTB = false;
    this.limpiarControlesCTB();
    this.tituloModalCTB = "Agregar bien";
    this.textoBotonGuardarCTB = "Guardar";
    this.modalRef = this.modalServicio.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
    }
  }

  abrirModalCTS(template: TemplateRef<any>) {
    this.condicionTS = new CondicionTecnicaServicios(null, '', null, '', '', null, null, '', null, '', '');
    let solicitudTipo = this.solpFormulario.controls["tipoSolicitud"].value
    let paisValidar = this.solpFormulario.controls["pais"].value.nombre
    if(solicitudTipo === "" || solicitudTipo === null || solicitudTipo === undefined || paisValidar === "" || paisValidar === null || paisValidar === undefined) {
      this.mostrarAdvertencia('Debe selccionar el tipo de solicitud y el país antes de agregar servicios')
      return false;
    }
    else {
    this.mostrarAdjuntoCTS = false;
    this.limpiarControlesCTS();
    this.tituloModalCTS = "Agregar servicio";
    this.textoBotonGuardarCTS = "Guardar";
    this.modalRef = this.modalServicio.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
    }
  }

  abrirModalArchivoCsvBienes(template: TemplateRef<any>) {
    let solicitudTipo = this.solpFormulario.controls["tipoSolicitud"].value
    let paisValidar = this.solpFormulario.controls["pais"].value.nombre
    if(solicitudTipo === "" || solicitudTipo === null || solicitudTipo === undefined || paisValidar === "" || paisValidar === null || paisValidar === undefined) {
      this.mostrarAdvertencia('Debe selccionar el tipo de solicitud y el país antes de agregar servicios')
      return false;
    }
    else {
      this.modalRef = this.modalServicio.show(
        template,
        Object.assign({}, {class: 'gray modal-lg'})
      );
      this.cargaExcel = true;
    }
  }

  abrirModalArchivoCsvServicios(template: TemplateRef<any>) {
    let solicitudTipo = this.solpFormulario.controls["tipoSolicitud"].value
    let paisValidar = this.solpFormulario.controls["pais"].value.nombre
    if(solicitudTipo === "" || solicitudTipo === null || solicitudTipo === undefined || paisValidar === "" || paisValidar === null || paisValidar === undefined) {
      this.mostrarAdvertencia('Debe selccionar el tipo de solicitud y el país antes de agregar servicios')
      return false;
    }
    else{
      this.modalRef = this.modalServicio.show(
        template,
        Object.assign({}, {class: 'gray modal-lg'})
      )
    }
  }

  ctbOnSubmit() {
    this.ctbSubmitted = true;
    if (this.ctbFormulario.invalid) {
      return;
    }
    
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
    let costoInversion = this.ctbFormulario.controls["cecoCTB"].value;
    let numeroCostoInversion = this.ctbFormulario.controls["numCicoCTB"].value;
    let numeroCuenta = this.ctbFormulario.controls["numCuentaCTB"].value;
    let adjunto = null;

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
            this.modalRef.hide();
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
        this.condicionTB = new CondicionTecnicaBienes(this.indiceCTBActualizar, "Condición Técnicas Bienes" + new Date().toDateString(), this.idSolicitudGuardada, codigo, descripcion, modelo, fabricante, cantidad, valorEstimado.toString(), comentarios, null, '', tipoMoneda,null, costoInversion, numeroCostoInversion, numeroCuenta);
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
            this.CargarTablaCTB();
            this.limpiarControlesCTB();
            this.mostrarInformacion("Condición técnica de bienes actualizada correctamente");
            this.modalRef.hide();
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
                  this.CargarTablaCTB();
                  this.limpiarControlesCTB();
                  this.mostrarInformacion("Condición técnica de bienes actualizada correctamente");
                  this.modalRef.hide();
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
                      this.CargarTablaCTB();
                      this.limpiarControlesCTB();
                      this.mostrarInformacion("Condición técnica de bienes actualizada correctamente");
                      this.modalRef.hide();
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
    if (this.ctsFormulario.invalid) {
      return;
    }

    this.spinner.show();
    let solicitudTipo = this.solpFormulario.controls["tipoSolicitud"].value
    let paisValidar = this.solpFormulario.controls["pais"].value.nombre
    let codigo = this.ctsFormulario.controls["codigoCTS"].value;
    let descripcion = this.ctsFormulario.controls["descripcionCTS"].value;
    let cantidad = this.ctsFormulario.controls["cantidadCTS"].value;
    let valorEstimado = this.ctsFormulario.controls["valorEstimadoCTS"].value;
    let tipoMoneda = this.ctsFormulario.controls["tipoMonedaCTS"].value;
    let comentarios = this.ctsFormulario.controls["comentariosCTS"].value;
    let costoInversion = this.ctsFormulario.controls["cecoCTS"].value;
    let numeroCostoInversion = this.ctsFormulario.controls["numCicoCTS"].value;
    let numeroCuenta = this.ctsFormulario.controls["numCuentaCTS"].value;
    let adjunto = null;

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
        this.condicionTS = new CondicionTecnicaServicios(this.indiceCTS, "Condición Técnicas Servicios" + new Date().toDateString(), this.idSolicitudGuardada, codigo, descripcion, cantidad, valorEstimado.toString(), comentarios, null, '', tipoMoneda,null, costoInversion, numeroCostoInversion, numeroCuenta);
        this.servicio.agregarCondicionesTecnicasServicios(this.condicionTS).then(
          (item: ItemAddResult) => {
            this.condicionTS.id = item.data.Id;
            this.condicionesTS.push(this.condicionTS);
            this.indiceCTS++;
            this.CargarTablaCTS();
            this.limpiarControlesCTS();
            this.mostrarInformacion("Condición técnica de servicios agregada correctamente");
            this.modalRef.hide();
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
                this.modalRef.hide();
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
        this.condicionTS = new CondicionTecnicaServicios(this.indiceCTSActualizar, "Condición Técnicas Servicios" + new Date().toDateString(), this.idSolicitudGuardada, codigo, descripcion, cantidad, valorEstimado.toString(), comentarios, null, '', tipoMoneda, null, costoInversion, numeroCostoInversion, numeroCuenta);
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
            this.CargarTablaCTS();
            this.limpiarControlesCTS();
            this.mostrarInformacion("Condición técnica de servicios actualizada correctamente");
            this.modalRef.hide();
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
                      this.CargarTablaCTS();
                      this.limpiarControlesCTS();
                      this.mostrarInformacion("Condición técnica de servicios actualizada correctamente");
                      this.modalRef.hide();
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
                  this.CargarTablaCTS();
                  this.limpiarControlesCTS();
                  this.mostrarInformacion("Condición técnica de servicios actualizada correctamente");
                  this.modalRef.hide();
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

  
  editarBienes(element, template: TemplateRef<any>) {
    this.indiceCTBActualizar = element.indice;
    this.idCondicionTBGuardada = element.id;
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
  }

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
  }

  esconderDatosContables(): any {
    this.mostrarDatosContables = true;
    this.removerRequeridosDatosContables();
    this.limpiarDatosContables();
  }



}