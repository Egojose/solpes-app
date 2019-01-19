import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { SPServicio } from "../servicios/sp-servicio";
import { CondicionContractual } from "../dominio/condicionContractual";
import { CondicionesTecnicasBienes } from "../verificar-material/condicionTecnicaBienes";
import { responsableProceso } from '../dominio/responsableProceso';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from "@angular/router";
import { ToastrManager } from "ng6-toastr-notifications";
import { ItemAddResult } from "sp-pnp-js";
import { CondicionTecnicaServicios } from "../verificar-material/condicionTecnicaServicios";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { verificarMaterialCT } from "./verificarMaterialCT";
import { MatTableDataSource, MatPaginator} from '@angular/material';

@Component({
  selector: "app-verificar-material",
  templateUrl: "./verificar-material.component.html",
  styleUrls: ["./verificar-material.component.css"]
})
export class VerificarMaterialComponent implements OnInit {
  @ViewChild('cantidad') cantidad: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  panelOpenState = false;
  titleVerificar = "VERIFICAR MATERIAL";
  ObjSolicitud: any;
  condicionesContractuales: CondicionContractual[] = [];
  fechaDeseada: Date;
  tipoSolicitud: string;
  solicitante: string;
  verificarMaterialFormulario: FormGroup;
  verificarSubmitted = false;
  emptyVerificar: boolean;
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
  loading: boolean;
  ComentarioSondeo: string;
  ComentarioVerificarMaterial: string;
  ObjCondicionesTecnicas: CondicionesTecnicasBienes[] = [];
  ObjCondicionesTecnicasServicios: CondicionTecnicaServicios[] = [];
  ObjCTVerificar: verificarMaterialCT[] = [];
  AgregarElementoForm: FormGroup;
  ObjResponsableProceso: responsableProceso[] = [];
  submitted = false;
  dataSource;
  labelPosition = "after";
  displayedColumns: string[] = [
    "codigo",
    "descripcion",
    "modelo",
    "fabricante",
    "cantidad",
    "existenciasverificar",
    "numreservaverificar",
    "cantidadreservaverificar",
    "Accion"
  ];
  modalRef: BsModalRef;
  IdVerficar: any;
  paisId: any;
  IdResponsable: any;
  constructor(
    private servicio: SPServicio,
    private formBuilder: FormBuilder,
    private modalServicio: BsModalService,
    public toastr: ToastrManager,
    private router: Router
  ) {
    this.loading = false;
    this.emptyVerificar = true;
  }
   
  GuardarComentario() {
    let coment;
    let ResponsableProcesoId = this.ObjResponsableProceso[0].porRegistrarSolp; 
    if (this.ComentarioVerificarMaterial === undefined || this.ComentarioVerificarMaterial === null) {
      this.mostrarError("Ingrese un comentario!");
    } else {
      let comentarios = this.ComentarioVerificarMaterial;

      coment = {
        Estado: 'Por registrar entregas',
        ResponsableId: ResponsableProcesoId,
        ComentarioVerificarMaterial: comentarios
      }

      let cantidad = this.ObjCTVerificar.filter(x => x.MaterialVerificado === true).length;
      let cantidadMateriales = this.ObjCTVerificar.length;
      if (cantidad === cantidadMateriales) {
        this.servicio.guardarComentario(this.IdSolicitud, coment)
          .then((resultado: ItemAddResult) => {
        this.MostrarExitoso("Materiales verificados correctamente");
          })
          .catch(error => {
            console.log(error);
          });
      }else{
        this.mostrarError("Faltan materiales por verificar");
        }
      }
  }

  MostrarExitoso(mensaje: string) {
    this.toastr.successToastr(mensaje, "Confirmación!");
  }

  mostrarError(mensaje: string) {
    this.toastr.errorToastr(mensaje, "Oops!");
  }

  mostrarAdvertencia(mensaje: string) {
    this.toastr.warningToastr(mensaje, "Validación");
  }

  mostrarInformacion(mensaje: string) {
    this.toastr.infoToastr(mensaje, "Información importante");
  }

  ngOnInit() {
    this.loading = true;
 
    this.RegistrarFormularioVerificar();
    this.ValidarNumReservaSiHayExistencias();

    this.servicio
      .ObtenerSolicitudBienesServicios(this.IdSolicitudParms)
      .subscribe(solicitud => {
        this.IdSolicitud = solicitud.Id;
        this.fechaDeseada = solicitud.FechaDeseadaEntrega;
        this.tipoSolicitud = solicitud.TipoSolicitud;
        this.solicitante = solicitud.Solicitante;
        this.ordenadorGasto = solicitud.OrdenadorGastos.Title;
        this.empresa = solicitud.Empresa.Title;
        this.pais = solicitud.Pais.Title;
        this.paisId = solicitud.Pais.Id;
        this.categoria = solicitud.Categoria;
        this.subCategoria = solicitud.Categoria;
        this.comprador = solicitud.Comprador;
        this.alcance = solicitud.Alcance;
        this.justificacion = solicitud.Justificacion;
        this.ComentarioSondeo = solicitud.ComentarioSondeo;
        this.condicionesContractuales = JSON.parse(
          solicitud.CondicionesContractuales
        ).condiciones;
        this.servicio
          .ObtenerCondicionesTecnicasBienes(this.IdSolicitud)
          .subscribe(RespuestaCondiciones => {
            this.ObjCondicionesTecnicas = CondicionesTecnicasBienes.fromJsonList(
              RespuestaCondiciones
            );
            this.ObjCTVerificar = verificarMaterialCT.fromJsonList(
              RespuestaCondiciones
            );
            this.dataSource = new MatTableDataSource(this.ObjCTVerificar);
            this.dataSource.paginator = this.paginator;
            this.servicio
            .obtenerResponsableProcesos(this.paisId) 
            .subscribe(RespuestaResponsableProceso => {
              this.ObjResponsableProceso = responsableProceso.fromJsonList(
                RespuestaResponsableProceso
              );
            });
          });
        this.servicio
          .ObtenerCondicionesTecnicasServicios(this.IdSolicitud)
          .subscribe(RespuestaCondicionesServicios => {
            this.ObjCondicionesTecnicasServicios = CondicionTecnicaServicios.fromJsonList(
              RespuestaCondicionesServicios
            );
            console.log(this.ObjCondicionesTecnicasServicios);
            this.loading = false;
          });
      });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  salir() {
    this.router.navigate(["/mis-solicitudes"]);
  }

  IdSolicitudParms(IdSolicitudParms: any): any {
    throw new Error("Method not implemented.");
  }

  RegistrarFormularioVerificar() {
    this.verificarMaterialFormulario = new FormGroup({
      codigoVerificar: new FormControl("", Validators.required),
      descripcionVerificar: new FormControl("", Validators.required),
      modeloVerificar: new FormControl("", Validators.required),
      fabricanteVerificar: new FormControl("", Validators.required),
      cantidadVerificar: new FormControl("0", Validators.required),
      existenciasVerificar: new FormControl("0"),
      numReservaVerificar: new FormControl(""),
      cantidadReservaVerificar: new FormControl("0"),
    });
    console.log('Fomulario creado');
  }

  ValidarNumReservaSiHayExistencias() {
    const numReservaVerificar = this.verificarMaterialFormulario.get('numReservaVerificar');
    this.verificarMaterialFormulario.get('existenciasVerificar').valueChanges.subscribe(
      (valor: string) => {
        if (valor != ''|| valor != undefined || valor != null ) {
          numReservaVerificar.setValidators([Validators.required]);
        }
        else {
          numReservaVerificar.clearValidators();
        }
        numReservaVerificar.updateValueAndValidity();
      });

  }

  abrirModalVerificarMaterial(template: TemplateRef<any>, element) {
    console.log(element);
    this.verificarSubmitted = false;
    this.IdVerficar = element.id;
    this.verificarMaterialFormulario.controls["codigoVerificar"].setValue(
      element.codigo
    );
    this.verificarMaterialFormulario.controls["descripcionVerificar"].setValue(
      element.descripcion
    );
    this.verificarMaterialFormulario.controls["modeloVerificar"].setValue(
      element.modelo
    );
    this.verificarMaterialFormulario.controls["fabricanteVerificar"].setValue(
      element.fabricante
    );
    this.verificarMaterialFormulario.controls["cantidadVerificar"].setValue(
      element.cantidad
    );
    this.modalRef = this.modalServicio.show(
      template,
      Object.assign({}, { class: "gray modal-lg" })
    );
    this.verificarMaterialFormulario.get('existenciasVerificar').setValidators([ValidarMayorExistencias(element.cantidad)]);
  }

  VerificarOnSubmit() {
    this.verificarSubmitted = true;
    if (this.verificarMaterialFormulario.invalid) {
      return;
    }
    let objGuardarVerificar;
    let codigoVerificar = this.verificarMaterialFormulario.controls[
      "codigoVerificar"
    ].value;
    let descripcionVerificar = this.verificarMaterialFormulario.controls[
      "descripcionVerificar"
    ].value;
    let modeloVerificar = this.verificarMaterialFormulario.controls[
      "modeloVerificar"
    ].value;
    let fabricanteVerificar = this.verificarMaterialFormulario.controls[
      "fabricanteVerificar"
    ].value;
    let cantidadverificar = this.verificarMaterialFormulario.controls[
      "cantidadVerificar"
    ].value;
    let existenciasverificar = this.verificarMaterialFormulario.controls[
      "existenciasVerificar"
    ].value;
    let numreservaverificar = this.verificarMaterialFormulario.controls[
      "numReservaVerificar"
    ].value;
    let cantidadreservaverificar = this.verificarMaterialFormulario.controls[
      "cantidadReservaVerificar"
    ].value;

    let index = this.ObjCTVerificar.findIndex(x => x.id === this.IdVerficar);
    this.ObjCTVerificar[index].codigo = codigoVerificar;
    this.ObjCTVerificar[index].descripcion = descripcionVerificar;
    this.ObjCTVerificar[index].cantidadverificar = cantidadverificar;
    this.ObjCTVerificar[index].existenciasverificar = existenciasverificar;
    this.ObjCTVerificar[index].numreservaverificar = numreservaverificar;
    this.ObjCTVerificar[index].cantidadreservaverificar = cantidadreservaverificar;
    this.ObjCTVerificar[index].MaterialVerificado = true;

    objGuardarVerificar = {
      CodigoVerificar: codigoVerificar,
      DescripcionVerificar: descripcionVerificar,
      ModeloVerificar: modeloVerificar,
      FabricanteVerificar: fabricanteVerificar,
      CantidadVerificar: cantidadverificar,
      ExistenciasVerificar: existenciasverificar,
      NumReservaVerificar: numreservaverificar,
      CantidadReservaVerificar: cantidadreservaverificar,
      MaterialVerificado: true
    }

    this.servicio.guardarVerificarMaterial(this.IdVerficar, objGuardarVerificar)
      .then((resultado: ItemAddResult) => {
        this.mostrarInformacion("Material guardado en la lista  correctamente");
      })
      .catch(error => {
        console.log(error);
      });

    this.dataSource = this.ObjCTVerificar;
    this.CargarTablaVerificar();
    this.limpiarControlesVerificar();
    this.mostrarInformacion("Material verificado correctamente");
    this.modalRef.hide();
  }

  RestaCantidadReserva() {
    let Existencia: number = this.verificarMaterialFormulario.controls[
      "existenciasVerificar"
    ].value;
    let Cantidad: number = this.verificarMaterialFormulario.controls[
      "cantidadVerificar"
    ].value;

    if (Existencia > Cantidad) {
      this.verificarMaterialFormulario.controls[
        "cantidadReservaVerificar"
      ].setValue(0);
    } else {
      let operacion: number = Cantidad - Existencia;
      this.verificarMaterialFormulario.controls[
        "cantidadReservaVerificar"
      ].setValue(operacion);
    }
  }

  private CargarTablaVerificar() {
    this.dataSource.data = this.ObjCondicionesTecnicas;
    this.emptyVerificar = false;
  }

  limpiarControlesVerificar(): any {
    this.verificarMaterialFormulario.reset();
  }

  get f() {
    return this.verificarMaterialFormulario.controls;
  }
}


export function ValidarMayorExistencias(valor): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return control.value < valor ? null : {
      cantidadMenor: {
        valid: false
      }
    }
  };
}