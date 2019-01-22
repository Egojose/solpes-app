import { Component, OnInit, ViewChild } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { Router, ActivatedRoute } from '@angular/router';
import { CondicionContractual } from '../dominio/condicionContractual';
import { CondicionesTecnicasServicios } from '../entrega-servicios/condicionTecnicaServicio';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RecepcionServicios } from '../entrega-servicios/recepcionServicios';
import { ItemAddResult } from 'sp-pnp-js';

@Component({
  selector: 'app-entrega-servicios',
  templateUrl: './entrega-servicios.component.html',
  styleUrls: ['./entrega-servicios.component.css']
})
export class EntregaServiciosComponent implements OnInit {
  @ViewChild('customTooltip') tooltip: any;
  IdSolicitudParms: any;
  ObjSolicitud: any;
  condicionesContractuales: CondicionContractual[] = [];
  fechaDeseada: Date;
  solicitante: string;
  ordenadorGasto: string;
  empresa: string;
  pais: string;
  categoria: string;
  subCategoria: string;
  comprador: string;
  justificacion: string;
  IdSolicitud: any;
  alcance: any;
  ObjCondicionesTecnicas: CondicionesTecnicasServicios[] = [];
  ObjItemsDescripcion: CondicionesTecnicasServicios[] = [];
  AgregarElementoForm: FormGroup;
  submitted = false;
  ObjRecepcionServicios: RecepcionServicios[] = [];
  objRecepcionAgregar: RecepcionServicios;
  ItemsAgregadosReciente: number;
  showBtnConfirmar: boolean;
  ObjMeses: string[];
  cantidadCTS: number;
  cantidadRecibidaCTS: number;
  ErrorCantidad: boolean;
  content: string;
  activarTool: boolean;
  autor: any;
  loading: boolean;

  constructor(private servicio: SPServicio, private activarRoute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) {
    this.ItemsAgregadosReciente = 0;
    this.showBtnConfirmar = false;
    this.ErrorCantidad = false;
  }

  ngOnInit() {
    this.loading = true;
    this.AgregarElementoForm = this.formBuilder.group({
      Descripcion: ['', Validators.required],
      Valor: ['', Validators.required],
      Cantidad: ['', Validators.required],
      Mes: ['', Validators.required],
      Ubicacion: ['', Validators.required],
      UltimaEntrega: ['', Validators.required],
      Comentario: ['']
    });

    this.ObjMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    this.IdSolicitudParms = sessionStorage.getItem("IdSolicitud");
    this.servicio.ObtenerSolicitudBienesServicios(this.IdSolicitudParms).subscribe(
      (solicitud) => {
        this.IdSolicitud = solicitud.Id;
        this.fechaDeseada = solicitud.FechaDeseadaEntrega;
        this.solicitante = solicitud.Solicitante;
        this.autor = solicitud.AuthorId;
        this.ordenadorGasto = solicitud.OrdenadorGastos.Title;
        this.empresa = solicitud.Empresa.Title;
        this.pais = solicitud.Pais.Title;
        this.categoria = solicitud.Categoria;
        this.subCategoria = solicitud.Categoria;
        this.comprador = solicitud.Comprador;
        this.alcance = solicitud.Alcance;
        this.justificacion = solicitud.Justificacion;
        this.condicionesContractuales = JSON.parse(solicitud.CondicionesContractuales).condiciones;
        let CantidadCT = 0;
        let TotalCantidadVerificar = 0;
        this.servicio.ObtenerCondicionesTecnicasServicios(this.IdSolicitud).subscribe(
          (RespuestaCTServicios) => {
            this.ObjCondicionesTecnicas = CondicionesTecnicasServicios.fromJsonList(RespuestaCTServicios);

            this.ObjCondicionesTecnicas.forEach(element => {
              if (element.totalCantidad > 0 && element.ultimaEntregaCTS === false) {
                this.ObjItemsDescripcion.push(element);
              }
              TotalCantidadVerificar = TotalCantidadVerificar + element.cantidad;
              if (element.ultimaEntregaCTS === true) {
                CantidadCT++;
              }
            });
            this.servicio.ObtenerRecepcionesServicios(this.IdSolicitud).subscribe(
              (respuestaServicios) => {
                this.ObjRecepcionServicios = RecepcionServicios.fromJsonList(respuestaServicios);
                this.ObjRecepcionServicios.forEach(element => {
                  let RptUltimaEntrega = this.ObjCondicionesTecnicas.find(x => x.IdServicio === element.idServicio).ultimaEntregaCTS;
                  element.ultimaEntregaCTS = RptUltimaEntrega;
                  if (element.estadoRS === "No confirmado") {
                    this.ItemsAgregadosReciente++;
                  }
                });
                if (CantidadCT === this.ObjCondicionesTecnicas.length && this.ItemsAgregadosReciente === 0) {
                  this.showBtnConfirmar = true;
                }
                this.loading = false;
              }
            );

          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  get f() { return this.AgregarElementoForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.AgregarElementoForm.invalid) {
      return;
    }

    let Objdescripcion = this.AgregarElementoForm.controls['Descripcion'].value;
    let valor = this.AgregarElementoForm.controls['Valor'].value;
    let cantidad = this.AgregarElementoForm.controls['Cantidad'].value;
    let mes = this.AgregarElementoForm.controls['Mes'].value;
    let ubicacion = this.AgregarElementoForm.controls['Ubicacion'].value;
    let ultimaEntrega = this.AgregarElementoForm.controls['UltimaEntrega'].value;
    let comentario = this.AgregarElementoForm.controls['Comentario'].value;

    let ultimaEntregabool: boolean;
    if (ultimaEntrega == "Sí") {
      ultimaEntregabool = true;
    }
    else {
      ultimaEntregabool = false;
    }
    let IdServicio = this.ObjCondicionesTecnicas.findIndex(x => x.IdServicio === Objdescripcion.IdServicio);
    this.cantidadCTS = this.ObjCondicionesTecnicas[IdServicio].totalCantidad;
    this.cantidadRecibidaCTS = this.ObjCondicionesTecnicas[IdServicio].cantidadRecibida;

    if (this.cantidadCTS >= cantidad) {
      let totalCantidad = this.cantidadCTS - cantidad;
      this.ObjCondicionesTecnicas[IdServicio]["totalCantidad"] = totalCantidad;
      this.ObjCondicionesTecnicas[IdServicio]["cantidadRecibida"] = parseFloat(cantidad);

      if (totalCantidad === 0) {
        ultimaEntregabool = true;
        this.ObjCondicionesTecnicas[IdServicio]["ultimaEntregaCTS"] = true;
        if (IdServicio > -1) {
          this.ObjItemsDescripcion.splice(IdServicio, 1);
        }
      }
      else {
        if (ultimaEntrega == "Sí") {
          if (IdServicio > -1) {
            this.ObjCondicionesTecnicas[IdServicio]["ultimaEntregaCTS"] = true;
            this.ObjItemsDescripcion.splice(IdServicio, 1);
          }
        }
      }
      this.tooltip.hide();
      this.ErrorCantidad = false;
    }
    else {
      this.content = 'Cantidad disponible ' + this.cantidadCTS;
      this.activarTool = true;
      this.tooltip.show();
      setTimeout(() => {
        this.tooltip.hide();
      }, 3000);

      return;
    }

    this.objRecepcionAgregar = new RecepcionServicios(Objdescripcion.IdServicio, Objdescripcion.descripcion, cantidad, valor, ultimaEntregabool, comentario, ubicacion, mes);
    this.servicio.GuardarServiciosRecibidos(this.objRecepcionAgregar, this.IdSolicitud).then(
      (Respuesta: ItemAddResult) => {
        this.ItemsAgregadosReciente++;
        this.objRecepcionAgregar["IdRecepcionServicios"] = 1;
        this.objRecepcionAgregar["estadoRS"] = "No confirmado";
        this.objRecepcionAgregar["fechaRecepcion"] = new Date();
        this.ObjRecepcionServicios.push(this.objRecepcionAgregar);
        this.AgregarElementoForm.reset({
          'Descripcion': '',
          'Valor': '',
          'Cantidad': '',
          'Mes': '',
          'Ubicacion': '',
          'UltimaEntrega': '',
          'Comentario': ''
        });
        this.submitted = false;
        let cantidadRecibida;
        if (this.cantidadRecibidaCTS === 0) {
          cantidadRecibida = parseFloat(cantidad);
        }
        else {
          cantidadRecibida = parseFloat(cantidad) + this.cantidadRecibidaCTS;
        }
        let objActualizacionCTS = {
          CantidadRecibida: cantidadRecibida,
          UltimaEntrega: ultimaEntregabool
        }
        this.servicio.actualizarCondicionesTecnicasServiciosEntregaServicios(Objdescripcion.IdServicio, objActualizacionCTS).then(
          (resultado) => {

          }).catch(
            (error) => {
              console.log(error);
            }
          );
      }, (error) => {
        console.log(error);
      });

  }

  UltimaEntrega(ObjCTS) {

    let IdServicios = this.ObjCondicionesTecnicas.findIndex(x => x.IdServicio === ObjCTS.IdServicio);
    if (this.ObjCondicionesTecnicas[IdServicios].cantidadRecibida > 0) {
      let FilterRecepcionBines = this.ObjRecepcionServicios.filter(x => x.idServicio === ObjCTS.IdServicio);
      let RecepcionServiciosID = 0;

      FilterRecepcionBines.forEach(element => {
        if (element.IdRecepcionServicios > RecepcionServiciosID) {
          RecepcionServiciosID = element.IdRecepcionServicios;
        }
      });

      let objActualizacionCTS = {
        UltimaEntrega: true
      }
      this.servicio.actualizarServiciosRecibidos(RecepcionServiciosID).then(
        (resultado) => {
          this.servicio.actualizarCondicionesTecnicasServiciosEntregaServicios(ObjCTS.IdServicio, objActualizacionCTS).then(
            (resultado) => {
              this.ObjCondicionesTecnicas[IdServicios]["ultimaEntregaCTS"] = true;
              let indexServicio = this.ObjRecepcionServicios.findIndex(x => x.idServicio === ObjCTS.IdServicio);
              this.ObjRecepcionServicios[indexServicio]["ultimaEntrega"] = true;
              this.ObjItemsDescripcion.splice(indexServicio, 1);
            }).catch(
              (error) => {
                console.log(error);
              }
            );
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      )
    }
    else {
      this.ObjCondicionesTecnicas[IdServicios]["ultimaEntregaCTS"] = true;
      let objActualizacionCTS = {
        CantidadRecibida: 0,
        UltimaEntrega: true
      }
      this.servicio.actualizarCondicionesTecnicasServiciosEntregaServicios(ObjCTS.IdServicio, objActualizacionCTS).then(
        (resultado) => {
          this.objRecepcionAgregar = new RecepcionServicios(ObjCTS.IdServicio, ObjCTS.descripcion, 0, "0", true, "", "", "");
          this.servicio.GuardarServiciosRecibidos(this.objRecepcionAgregar, this.IdSolicitud).then(
            (resultadoBienes) => {

            }
          )
        }).catch(
          (error) => {
            console.log(error);
          }
        );
    }

  }

  Eliminar(ObjRecepcionEliminar) {
    let IdServicio = this.ObjCondicionesTecnicas.findIndex(x => x.IdServicio === ObjRecepcionEliminar.idServicio);
    let TotalServicios = this.ObjCondicionesTecnicas[IdServicio]["totalCantidad"];
    let cantidadRecibida = this.ObjCondicionesTecnicas[IdServicio]["cantidadRecibida"];

    this.servicio.eliminarServiciosRecibidos(ObjRecepcionEliminar.IdRecepcionServicios).then(
      (resultado) => {
        this.ItemsAgregadosReciente--;
        this.ObjCondicionesTecnicas[IdServicio]["totalCantidad"] = TotalServicios + parseFloat(ObjRecepcionEliminar.cantidad);
        this.ObjCondicionesTecnicas[IdServicio]["cantidadRecibida"] = cantidadRecibida - parseFloat(ObjRecepcionEliminar.cantidad);
        let indexServicio = this.ObjRecepcionServicios.findIndex(x => x.IdRecepcionServicios === ObjRecepcionEliminar.IdRecepcionServicios);
        this.ObjRecepcionServicios.splice(indexServicio, 1);

        let objActualizacionCTS;
        if (ObjRecepcionEliminar.ultimaEntrega === true) {
          objActualizacionCTS = {
            CantidadRecibida: cantidadRecibida - parseFloat(ObjRecepcionEliminar.cantidad),
            UltimaEntrega: false
          }
        }
        else {
          objActualizacionCTS = {
            CantidadRecibida: cantidadRecibida - parseFloat(ObjRecepcionEliminar.cantidad),
            UltimaEntrega: false
          }
        }
        this.servicio.actualizarCondicionesTecnicasServicios(ObjRecepcionEliminar.idServicio, objActualizacionCTS).then(
          (resultado) => {
            this.ObjItemsDescripcion.push(this.ObjCondicionesTecnicas[IdServicio]);
            this.ObjCondicionesTecnicas[IdServicio]["ultimaEntregaCTS"] = false;
          }).catch(
            (error) => {
              console.log(error);
            }
          );
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    )
  }

  Confirmar() {
    let numeroItems = 0;
    let CantidadCT = 0;

    this.ObjRecepcionServicios.forEach(element => {

      if (element.estadoRS === "No confirmado") {
        element.estadoRS = "Confirmado";
        this.servicio.ConfirmarEntregaServicios(element.IdRecepcionServicios).then(
          (resultado) => {
            numeroItems++;
            if (numeroItems === this.ItemsAgregadosReciente) {
              this.servicio.ObtenerCondicionesTecnicasServicios(this.IdSolicitud).subscribe(
                (respuesta) => {
                  let contadorCTTrue = 0;
                  this.ObjCondicionesTecnicas = CondicionesTecnicasServicios.fromJsonList(respuesta);
                  this.ObjCondicionesTecnicas.forEach(element => {
                    if (element.ultimaEntregaCTS == true) {
                      contadorCTTrue++;
                    }
                  });
                  if (contadorCTTrue === this.ObjCondicionesTecnicas.length) {
                    this.servicio.cambioEstadoRecepcionBienesServicios(this.IdSolicitud, "Finalizado", this.autor).then(
                      (respuesta) => {
                        this.router.navigate(['/mis-solicitudes']);
                      }
                    ).catch(
                      (error) => {
                        console.log(error);
                      })
                  }
                },
                (error) => {
                  console.log(error);
                }
              )
            }
          }
        ).catch(
          (error) => {
            console.log(error);
          }
        )
      }

    });

    if (numeroItems == 0) {
      this.router.navigate(['/mis-solicitudes']);
    }
  }

  Salir() {
    this.router.navigate(['/mis-solicitudes']);
  }

}
