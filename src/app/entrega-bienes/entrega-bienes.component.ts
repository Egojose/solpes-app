import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { CondicionContractual } from '../dominio/condicionContractual';
import { CondicionesTecnicasBienes } from '../entrega-bienes/condicionTecnicaBienes';
import { RecepcionBienes } from '../entrega-bienes/recepcionBienes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ItemAddResult } from 'sp-pnp-js';
import { ActivatedRoute, Router } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-entrega-bienes',
  templateUrl: './entrega-bienes.component.html',
  styleUrls: ['./entrega-bienes.component.css']
})
export class EntregaBienesComponent implements OnInit {
  @ViewChild('customTooltip') tooltip: any;

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
  alcance: string;
  ObjCondicionesContractuales: any;
  IdSolicitud: any;
  ObjCondicionesTecnicas: CondicionesTecnicasBienes[] = [];
  ObjItemsDescripcion: CondicionesTecnicasBienes[] = [];
  ObjRecepcionBienes: RecepcionBienes[] = [];
  objRecepcionAgregar: RecepcionBienes;
  AgregarElementoForm: FormGroup;
  submitted = false;
  ErrorCantidad: boolean;
  activarTool: boolean;
  pop: any;
  modalRef: BsModalRef;
  cantidadCTB: number;
  content: string;
  IdSolicitudParms: any;
  cantidadRecibidaCTB: number;
  ComentariosBienes: string;
  EstadoSolicitud: boolean;
  showBtnConfirmar: boolean;
  ItemsAgregadosReciente: number;
  autor: any;
  loading: boolean;
  constructor(private servicio: SPServicio, private formBuilder: FormBuilder, private modalService: BsModalService, private activarRoute: ActivatedRoute, private router: Router) {
    this.ErrorCantidad = false;
    this.activarTool = true;
    this.EstadoSolicitud = true;
    this.showBtnConfirmar = false;
    this.ItemsAgregadosReciente = 0;

    // this.activarRoute.params.subscribe((parametro) => {
    //   this.IdSolicitudParms = parametro.idSolicitud;
    // });
  }


  ngOnInit() {
    this.loading = true;
    this.AgregarElementoForm = this.formBuilder.group({
      Descripcion: ['', Validators.required],
      Cantidad: ['', Validators.required],
      Valor: ['', Validators.required],
      UltimaEntrega: ['', Validators.required],
      Comentario: ['']
    });
    this.IdSolicitudParms = localStorage.getItem("IdSolicitud");
    this.servicio.ObtenerSolicitudBienesServicios(this.IdSolicitudParms).subscribe(
      solicitud => {
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
        let CantidadConfirmada = 0;
        let TotalCantidadVerificar = 0;
        this.servicio.ObtenerCondicionesTecnicasBienes(this.IdSolicitud).subscribe(
          RespuestaCondiciones => {
            this.ObjCondicionesTecnicas = CondicionesTecnicasBienes.fromJsonList(RespuestaCondiciones);
            this.ObjCondicionesTecnicas.forEach(element => {
              if (element.totalCantidad > 0 && element.UltimaEntregaCTB === false) {
                this.ObjItemsDescripcion.push(element);
              }
              TotalCantidadVerificar = TotalCantidadVerificar + element.cantidad;
              if (element.UltimaEntregaCTB === true) {
                CantidadCT++;
              }
            });
            this.servicio.ObtenerRecepcionesBienes(this.IdSolicitud).subscribe(
              (respuesta) => {
                this.ObjRecepcionBienes = RecepcionBienes.fromJsonList(respuesta);
                this.ObjRecepcionBienes.forEach(element => {
                  let RptUltimaEntrega = this.ObjCondicionesTecnicas.find(x => x.IdBienes === element.Idbienes).UltimaEntregaCTB;
                  element.ultimaEntregaCTB = RptUltimaEntrega;
                  if (element.estadoRB === "No confirmado") {
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
        )

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
    let cantidad = this.AgregarElementoForm.controls['Cantidad'].value;
    let valor = this.AgregarElementoForm.controls['Valor'].value;
    let ultimaEntrega = this.AgregarElementoForm.controls['UltimaEntrega'].value;
    let comentario = this.AgregarElementoForm.controls['Comentario'].value;
    let ultimaEntregabool: boolean;
    if (ultimaEntrega == "Sí") {
      ultimaEntregabool = true;
    }
    else {
      ultimaEntregabool = false;
    }

    let IdBienes = this.ObjCondicionesTecnicas.findIndex(x => x.IdBienes === Objdescripcion.IdBienes);
    this.cantidadCTB = this.ObjCondicionesTecnicas[IdBienes].totalCantidad;
    this.cantidadRecibidaCTB = this.ObjCondicionesTecnicas[IdBienes].cantidadRecibida;
    if (this.cantidadCTB >= cantidad) {
      let totalCantidad = this.cantidadCTB - cantidad;

      this.ObjCondicionesTecnicas[IdBienes]["totalCantidad"] = totalCantidad;
      this.ObjCondicionesTecnicas[IdBienes]["cantidadRecibida"] = parseFloat(cantidad);

      if (totalCantidad === 0) {
        ultimaEntregabool = true;
        this.ObjCondicionesTecnicas[IdBienes]["UltimaEntregaCTB"] = true;
        if (IdBienes > -1) {
          this.ObjItemsDescripcion.splice(IdBienes, 1);
        }
      }
      else {
        if (ultimaEntrega == "Sí") {
          if (IdBienes > -1) {
            this.ObjCondicionesTecnicas[IdBienes]["UltimaEntregaCTB"] = true;
            this.ObjItemsDescripcion.splice(IdBienes, 1);
          }
        }
      }
      this.tooltip.hide();
      this.ErrorCantidad = false;
    }
    else {
      this.content = 'Cantidad disponible ' + this.cantidadCTB;
      this.activarTool = true;
      this.tooltip.show();
      setTimeout(() => {
        this.tooltip.hide();
      }, 3000);

      return;
    }
    this.objRecepcionAgregar = new RecepcionBienes(Objdescripcion.IdBienes, Objdescripcion.descripcion, cantidad, valor, ultimaEntregabool, comentario);

    this.servicio.GuardarBienesRecibidos(this.objRecepcionAgregar, this.IdSolicitud).then(
      (Respuesta: ItemAddResult) => {
        this.ItemsAgregadosReciente++;
        this.objRecepcionAgregar["IdRecepcionBienes"] = Respuesta.data.Id;
        //this.objRecepcionAgregar["eliminar"]=true;    
        this.objRecepcionAgregar["estadoRB"] = "No confirmado";
        this.objRecepcionAgregar["fechaRecepcion"] = new Date();
        this.ObjRecepcionBienes.push(this.objRecepcionAgregar);
        // this.ObjRecepcionBienes.sort();
        this.AgregarElementoForm.reset({
          'Descripcion': '',
          'Cantidad': '',
          'Valor': '',
          'UltimaEntrega': '',
          'Comentario': ''
        });
        this.submitted = false;
        let cantidadRecibida;
        if (this.cantidadRecibidaCTB === 0) {
          cantidadRecibida = parseFloat(cantidad);
        }
        else {
          cantidadRecibida = parseFloat(cantidad) + this.cantidadRecibidaCTB;
        }
        let objActualizacionCTB = {
          CantidadRecibida: cantidadRecibida,
          UltimaEntrega: ultimaEntregabool
        }
        this.servicio.actualizarCondicionesTecnicasBienesEntregaBienes(Objdescripcion.IdBienes, objActualizacionCTB).then(
          (resultado) => {

          }).catch(
            (error) => {
              console.log(error);
            }
          );
      }, err => {
        alert("Error al realizar la recepción");
      }
    );
  }

  UltimaEntrega(ObjCTB) {

    let IdBienes = this.ObjCondicionesTecnicas.findIndex(x => x.IdBienes === ObjCTB.IdBienes);
    if (this.ObjCondicionesTecnicas[IdBienes].cantidadRecibida > 0) {
      let FilterRecepcionBines = this.ObjRecepcionBienes.filter(x => x.Idbienes === ObjCTB.IdBienes);
      let RecepcionBieesID = 0;

      FilterRecepcionBines.forEach(element => {
        if (element.IdRecepcionBienes > RecepcionBieesID) {
          RecepcionBieesID = element.IdRecepcionBienes;
        }
      });

      let objActualizacionCTB = {
        UltimaEntrega: true
      }
      this.servicio.actualizarBienesRecibidos(RecepcionBieesID).then(
        (resultado) => {
          this.servicio.actualizarCondicionesTecnicasBienesEntregaBienes(ObjCTB.IdBienes, objActualizacionCTB).then(
            (resultado) => {
              this.ObjCondicionesTecnicas[IdBienes]["UltimaEntregaCTB"] = true;
              let indexBienes = this.ObjRecepcionBienes.findIndex(x => x.Idbienes === ObjCTB.IdBienes);
              this.ObjRecepcionBienes[indexBienes]["ultimaEntrega"] = true;
              this.ObjItemsDescripcion.splice(indexBienes, 1);
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
      this.ObjCondicionesTecnicas[IdBienes]["UltimaEntregaCTB"] = true;
      let objActualizacionCTB = {
        CantidadRecibida: 0,
        UltimaEntrega: true
      }
      this.servicio.actualizarCondicionesTecnicasBienesEntregaBienes(ObjCTB.IdBienes, objActualizacionCTB).then(
        (resultado) => {
          this.objRecepcionAgregar = new RecepcionBienes(ObjCTB.IdBienes, ObjCTB.descripcion, 0, "0", true, "");
          this.servicio.GuardarBienesRecibidos(this.objRecepcionAgregar, this.IdSolicitud).then(
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
    let IdBienes = this.ObjCondicionesTecnicas.findIndex(x => x.IdBienes === ObjRecepcionEliminar.Idbienes);
    let TotalBienes = this.ObjCondicionesTecnicas[IdBienes]["totalCantidad"];
    let cantidadRecibida = this.ObjCondicionesTecnicas[IdBienes]["cantidadRecibida"];

    this.servicio.eliminarBienesRecibidos(ObjRecepcionEliminar.IdRecepcionBienes).then(
      (resultado) => {
        this.ItemsAgregadosReciente--;
        this.ObjCondicionesTecnicas[IdBienes]["totalCantidad"] = TotalBienes + parseFloat(ObjRecepcionEliminar.cantidad);
        this.ObjCondicionesTecnicas[IdBienes]["cantidadRecibida"] = cantidadRecibida - parseFloat(ObjRecepcionEliminar.cantidad);
        let indesBienes = this.ObjRecepcionBienes.findIndex(x => x.IdRecepcionBienes === ObjRecepcionEliminar.IdRecepcionBienes);
        this.ObjRecepcionBienes.splice(indesBienes, 1);

        let objActualizacionCTB;
        if (ObjRecepcionEliminar.ultimaEntrega === true) {
          objActualizacionCTB = {
            CantidadRecibida: cantidadRecibida - parseFloat(ObjRecepcionEliminar.cantidad),
            UltimaEntrega: false
          }
        }
        else {
          objActualizacionCTB = {
            CantidadRecibida: cantidadRecibida - parseFloat(ObjRecepcionEliminar.cantidad),
            UltimaEntrega: false
          }
        }

        this.servicio.actualizarCondicionesTecnicasBienes(ObjRecepcionEliminar.Idbienes, objActualizacionCTB).then(
          (resultado) => {
            this.ObjItemsDescripcion.push(this.ObjCondicionesTecnicas[IdBienes]);
            this.ObjCondicionesTecnicas[IdBienes]["UltimaEntregaCTB"] = false;
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
    );
  }

  Confirmar() {
    let numeroItems = 0;
    let CantidadCT = 0;

    this.ObjRecepcionBienes.forEach(element => {

      if (element.estadoRB === "No confirmado") {
        element.estadoRB = "Confirmado";
        this.servicio.ConfirmarEntregaBienes(element.IdRecepcionBienes).then(
          (resultado) => {
            numeroItems++;
            if (numeroItems === this.ItemsAgregadosReciente) {
              this.servicio.ObtenerCondicionesTecnicasBienes(this.IdSolicitud).subscribe(
                (respuesta) => {
                  this.ObjCondicionesTecnicas = CondicionesTecnicasBienes.fromJsonList(respuesta);
                  let contadorCTTrue = 0;
                  this.ObjCondicionesTecnicas.forEach(element => {
                    if (element.UltimaEntregaCTB == true) {
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