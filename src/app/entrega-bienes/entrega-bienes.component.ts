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
import { responsableProceso } from '../dominio/responsableProceso';
import { ToastrManager } from 'ng6-toastr-notifications';

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
  FaltaServicios: any;
  CompraBienes: any;
  CompraServicios: any;
  paisId: any;
  ObResProceso: any[];
  ResponsableBienes: any;
  ResponsableServicios: any;
  NumSolp: any;
  ArchivoAdjunto: any;
  OrdenEstadistica: any;
  constructor(private servicio: SPServicio, private formBuilder: FormBuilder, private modalService: BsModalService, private activarRoute: ActivatedRoute, private router: Router,public toastr: ToastrManager,) {
    this.ErrorCantidad = false;
    this.activarTool = true;
    this.EstadoSolicitud = true;
    this.showBtnConfirmar = false;
    this.ItemsAgregadosReciente = 0;
    this.ArchivoAdjunto = null;

    // this.activarRoute.params.subscribe((parametro) => {
    //   this.IdSolicitudParms = parametro.idSolicitud;
    // });
  }


  ngOnInit() {
    this.loading = true;
    this.AgregarElementoForm = this.formBuilder.group({
      Descripcion: ['', Validators.required],
      Cantidad: ['', Validators.required],
      Valor: [''],
      UltimaEntrega: ['', Validators.required],
      Comentario: ['']
    });
    
    this.IdSolicitudParms = sessionStorage.getItem("IdSolicitud");
    this.servicio.ObtenerSolicitudBienesServicios(this.IdSolicitudParms).subscribe(
      solicitud => {
        this.IdSolicitud = solicitud.Id;
        this.fechaDeseada = solicitud.FechaDeseadaEntrega;
        this.solicitante = solicitud.Solicitante;
        this.autor = solicitud.AuthorId;
        this.ordenadorGasto = solicitud.OrdenadorGastos.Title;
        this.empresa = solicitud.Empresa.Title;
        this.pais = solicitud.Pais.Title;
        this.paisId = solicitud.Pais.Id;
        this.categoria = solicitud.Categoria;
        this.subCategoria = solicitud.Categoria;
        this.comprador = solicitud.Comprador.Title;
        this.alcance = solicitud.Alcance;
        this.justificacion = solicitud.Justificacion;
        this.FaltaServicios = solicitud.FaltaRecepcionServicios;
        this.CompraServicios = solicitud.CompraServicios;
        this.NumSolp = solicitud.NumSolSAP;
        this.OrdenEstadistica = solicitud.OrdenEstadistica;
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
            this.servicio.ObtenerRecepcionesBienesEntregaBienes(this.IdSolicitud).subscribe(
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
                this.servicio.obtenerResponsableProcesos(this.paisId).subscribe(
                  (RespuestaProcesos)=>{
                    this.ObResProceso = responsableProceso.fromJsonList(RespuestaProcesos);  
                    this.ResponsableBienes = this.ObResProceso[0].porRegistrarSapBienes;                    
                    this.loading = false;
                  },
                  (error)=>{

                  }
                )
                
              }
            );
          }
        )

      }
    );
  }

  get f() { return this.AgregarElementoForm.controls; }

  ValidacionCero(){
    let cantidad = this.AgregarElementoForm.controls['Cantidad'].value;
    
    if (cantidad === "0") {
      this.AgregarElementoForm.controls['UltimaEntrega'].setValue("Sí");
    }
  }

  adjuntarArchivoBienes(event){
    let archivoAdjunto = event.target.files[0];
    if (archivoAdjunto != null) {
      this.ArchivoAdjunto = archivoAdjunto;
    } else {
      this.ArchivoAdjunto = null;
    }
  }

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

    if (this.ArchivoAdjunto===null && this.OrdenEstadistica===true && cantidad !=="0") {
      this.mostrarAdvertencia("Por favor ingrese el documento de registro de activos");
      return false;
    }

    let IdBienes = this.ObjCondicionesTecnicas.findIndex(x => x.IdBienes === Objdescripcion.IdBienes);
    this.cantidadCTB = this.ObjCondicionesTecnicas[IdBienes].totalCantidad;
    this.cantidadRecibidaCTB = this.ObjCondicionesTecnicas[IdBienes].cantidadRecibida;
    if (this.cantidadCTB >= cantidad) {
      let totalCantidad = this.cantidadCTB - cantidad;

      this.ObjCondicionesTecnicas[IdBienes]["totalCantidad"] = totalCantidad;
      this.ObjCondicionesTecnicas[IdBienes]["cantidadRecibida"] = parseFloat(cantidad);

      if (totalCantidad === 0 || cantidad==="0") {
        ultimaEntregabool = true;
        this.ObjCondicionesTecnicas[IdBienes]["UltimaEntregaCTB"] = true;
        if (IdBienes > -1) {
          let indexDesc = this.ObjItemsDescripcion.findIndex(x => x.IdBienes === Objdescripcion.IdBienes)
          this.ObjItemsDescripcion.splice(indexDesc, 1);
        }
      }
      else {
        if (ultimaEntrega == "Sí") {
          if (IdBienes > -1) {
            this.ObjCondicionesTecnicas[IdBienes]["UltimaEntregaCTB"] = true;
            let indexDesc = this.ObjItemsDescripcion.findIndex(x => x.IdBienes === Objdescripcion.IdBienes)
            this.ObjItemsDescripcion.splice(indexDesc, 1);
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
    this.loading=true;
    this.objRecepcionAgregar = new RecepcionBienes(Objdescripcion.IdBienes, Objdescripcion.descripcion, cantidad, valor, ultimaEntregabool, comentario);

    this.servicio.GuardarBienesRecibidos(this.objRecepcionAgregar, this.IdSolicitud,this.ResponsableBienes).then(
      (Respuesta: ItemAddResult) => {
        let IdRecepcionBienes = Respuesta.data.Id;
        if (ultimaEntregabool===false) {
          let nombreArchivo = "EntregaBienes-" + this.generarllaveSoporte() + "_" + this.ArchivoAdjunto.name;
          this.servicio.agregarAdjuntoActivosBienes(IdRecepcionBienes,nombreArchivo,this.ArchivoAdjunto).then(
            (Respuesta)=>{
              (<HTMLInputElement>document.getElementById("Adjunto")).value = null; 
              this.servicio.ObtenerRecepcionesBienesEntregaBienes(this.IdSolicitud).subscribe(
                (respuesta) => {
                  this.ItemsAgregadosReciente = 0;
                  this.ObjRecepcionBienes = RecepcionBienes.fromJsonList(respuesta);
                  this.ObjRecepcionBienes.forEach(element => {
                    let RptUltimaEntrega = this.ObjCondicionesTecnicas.find(x => x.IdBienes === element.Idbienes).UltimaEntregaCTB;
                    element.ultimaEntregaCTB = RptUltimaEntrega;
                    if (element.estadoRB === "No confirmado") {
                      this.ItemsAgregadosReciente++;
                    }
                  });  
                }
              );
            }
          ).catch(
            (error)=>{
              this.mostrarError("Error al guardar el archivo");
            }
          );
        }        

        this.ItemsAgregadosReciente++;
        this.objRecepcionAgregar["IdRecepcionBienes"] = IdRecepcionBienes;
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
            this.loading=false;
          }).catch(
            (error) => {
              console.log(error);
              this.loading=false;
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
      this.loading=true;
      this.servicio.actualizarBienesRecibidos(RecepcionBieesID).then(
        (resultado) => {
          this.servicio.actualizarCondicionesTecnicasBienesEntregaBienes(ObjCTB.IdBienes, objActualizacionCTB).then(
            (resultado) => {
              this.ObjCondicionesTecnicas[IdBienes]["UltimaEntregaCTB"] = true;
              let indexBienes = this.ObjRecepcionBienes.findIndex(x => x.Idbienes === ObjCTB.IdBienes);
              this.ObjRecepcionBienes[indexBienes]["ultimaEntrega"] = true;
              this.ObjItemsDescripcion.splice(indexBienes, 1);
              this.loading=false;
            }).catch(
              (error) => {
                console.log(error);
                this.loading=false;
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
      this.loading=true;
      this.servicio.actualizarCondicionesTecnicasBienesEntregaBienes(ObjCTB.IdBienes, objActualizacionCTB).then(
        (resultado) => {
          this.objRecepcionAgregar = new RecepcionBienes(ObjCTB.IdBienes, ObjCTB.descripcion, 0, "0", true, "");
          this.servicio.GuardarBienesRecibidos(this.objRecepcionAgregar, this.IdSolicitud,null).then(
            (resultadoBienes: ItemAddResult) => {
              this.ItemsAgregadosReciente++;
              this.objRecepcionAgregar["IdRecepcionBienes"] = resultadoBienes.data.Id;
              //this.objRecepcionAgregar["eliminar"]=true;    
              this.objRecepcionAgregar["estadoRB"] = "No confirmado";
              this.objRecepcionAgregar["fechaRecepcion"] = new Date();
              this.ObjRecepcionBienes.push(this.objRecepcionAgregar);
              let indexBienes = this.ObjRecepcionBienes.findIndex(x => x.Idbienes === ObjCTB.IdBienes);              
              this.ObjItemsDescripcion.splice(indexBienes, 1);
              this.loading=false;
            }
          )
        }).catch(
          (error) => {
            console.log(error);
            this.loading=false;
          }
        );
    }

  }

  Eliminar(ObjRecepcionEliminar) {
    let IdBienes = this.ObjCondicionesTecnicas.findIndex(x => x.IdBienes === ObjRecepcionEliminar.Idbienes);
    let TotalBienes = this.ObjCondicionesTecnicas[IdBienes]["totalCantidad"];
    let cantidadRecibida = this.ObjCondicionesTecnicas[IdBienes]["cantidadRecibida"];
    this.loading=true;
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

        this.servicio.actualizarCondicionesTecnicasBienesEntregaBienes(ObjRecepcionEliminar.Idbienes, objActualizacionCTB).then(
          (resultado) => {
            this.ObjItemsDescripcion.push(this.ObjCondicionesTecnicas[IdBienes]);
            this.ObjCondicionesTecnicas[IdBienes]["UltimaEntregaCTB"] = false;
            this.loading=false;
          }).catch(
            (error) => {
              console.log(error);
              this.loading=false;
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
    let Confirmado = false;

    this.ObjRecepcionBienes.forEach(element => {
      
      if (element.estadoRB === "No confirmado") {
        element.estadoRB = "Confirmado";
        Confirmado = true;
        this.loading=true;
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
                  if (contadorCTTrue === this.ObjCondicionesTecnicas.length ) {
                    if (this.CompraServicios === true) {
                      let objCT;
                      //pregunta si el campo faltarecepcionservicios de la lista de solicitudes esta en si para cambiar el estado 
                      // de la solicitud a recibido si se cumple que los bienes y los servicios se recibieron.
                      if (this.FaltaServicios === false) {
                        objCT={
                          Estado: "Recibido",
                          FaltaRecepcionBienes: false,
                          ResponsableId: this.autor
                        }
                      }
                      else{
                        objCT={                          
                          FaltaRecepcionBienes: false,
                          ResponsableId: this.autor
                        }
                      }
                      this.servicio.cambioEstadoRecepcionBienesServicios(this.IdSolicitud, objCT).then(
                        (respuesta) => {
                          this.router.navigate(['/mis-solicitudes']);                        
                        }
                      ).catch(
                        (error) => {
                          console.log(error);
                          this.loading=false;
                        })
                    }
                    else{
                     let objCT={
                        Estado: "Recibido",
                        FaltaRecepcionBienes: false,
                        ResponsableId: this.autor
                      }
                      this.servicio.cambioEstadoRecepcionBienesServicios(this.IdSolicitud, objCT).then(
                        (respuesta) => {
                          this.router.navigate(['/mis-solicitudes']);                        
                        }
                      ).catch(
                        (error) => {
                          console.log(error);
                          this.loading=false;
                        })
                    }
                    
                  }
                  else{
                    this.router.navigate(['/mis-solicitudes']);                    
                  }
                },
                (error) => {
                  this.loading=false;
                }
              )

            }
          }
        ).catch(
          (error) => {
            console.log(error);
            this.loading=false;
          }
        )
      }      

    });

    if (numeroItems == 0 && Confirmado===false) {
      this.router.navigate(['/mis-solicitudes']);
    }
  }

  Salir() {
    this.router.navigate(['/mis-solicitudes']);
  }

  generarllaveSoporte(): string {
    var fecha = new Date();
    var valorprimitivo = fecha.valueOf().toString();
    return valorprimitivo;
  }

  mostrarAdvertencia(mensaje: string) {
    this.toastr.warningToastr(mensaje, "Validación");
  }

  mostrarError(mensaje: string) {
    this.toastr.errorToastr(mensaje, "Oops!");
  }

}