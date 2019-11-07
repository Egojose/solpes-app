import { Component, OnInit, ViewChild } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { CrmServicioService } from '../servicios/crm-servicio.service';


@Component({
  selector: 'app-gestion-errores',
  templateUrl: './gestion-errores.component.html',
  styleUrls: ['./gestion-errores.component.css']
})
export class GestionErroresComponent implements OnInit {

  emptyContratos: boolean;
  emptySolicitudes: boolean;
  panelOpenState = false;
  dataSourceContratos;
  dataSourceSolicitudes;
  @ViewChild(MatPaginator) paginatorContratos: MatPaginator;
  @ViewChild(MatSort) sortContratos: MatSort;
  @ViewChild(MatPaginator) paginatorSolicitudes: MatPaginator;
  @ViewChild(MatSort) sortSolicitudes: MatSort;
  ObjContratos: any[];
  ObjSolicitudes: any[];

  constructor(
    private servicio: SPServicio, 
    private router: Router, 
    private spinner: NgxSpinnerService, 
    public toastr: ToastrManager,
    public servicioCrm: CrmServicioService) { 
      this.ObtenerToken();
    }

  displayedColumns: string[] = ['numerosolp', 'idservicios', 'NombreProceso', 'Acciones'];
  displayedColumnsContratos: string[] = ['numerosolp', 'numeroContrato', 'nombreProveedor', 'Acciones'];

  ngOnInit() {
    this.ConsultarSolicitudesCrm();
  }

  ConsultarSolicitudesCrm() {
    this.ObjContratos = [];
    this.ObjSolicitudes = [];
    this.servicio.ObtenerSolicitudesCrm().then(
      (res)=>{
        if (res.length > 0) {
          this.ObjContratos = res.filter(x => x.EsContrato === true);
          this.ObjSolicitudes = res.filter(x => x.EsContrato === false);

          if (this.ObjContratos.length > 0) {
            this.emptyContratos = false;
            this.dataSourceContratos = new MatTableDataSource(this.ObjContratos);
            this.dataSourceContratos.paginator = this.paginatorContratos;
            this.dataSourceContratos.sort = this.sortContratos;
          } 
          else{
            this.emptyContratos = false;
          }
          
          if (this.ObjSolicitudes.length > 0) {
            this.emptySolicitudes = false;
            this.dataSourceSolicitudes = new MatTableDataSource(this.ObjSolicitudes);
            this.dataSourceSolicitudes.paginator = this.paginatorSolicitudes;
            this.dataSourceSolicitudes.sort = this.sortSolicitudes;
          }
          else{
            this.emptySolicitudes = true;
          }
        }        
      }
    ).catch(
      (error)=>{        
        console.log(error);
            this.spinner.hide();
            this.mostrarError("Se ha producido un error consultando las solicitudes y/o los contratos no cargados");
      }
    )
  }

  async CargarSolicitudCrm(element){
  let intentos = 0;
    let respuesta;
    let resCambioExitoso;
    let access;
    let idServicios = element.IdServicios.split(",");
    // let obj = {
    //   "numerosolp": element.NroSolp,
    //   "linksolp": element.EnlaceSolp,
    //   "idservicios": idServicios      
    // } 

    let obj = {
      "numerosolp": "9",
      "linksolp": "Este es el link de solp",
      "idservicios": ["665","656"]      
    }

    for (let index = 0; index < 3; index++) { 
      respuesta = await this.enviarServicioSolicitud(obj);
      if (respuesta.StatusCode === 200) {
        this.MostrarExitoso(respuesta["MensajeExito"]);
        break;
      }
    }
    // respuesta = {
    //   StatusCode: 200
    // }

    let RespuestaCrmSP;

    if (respuesta["StatusCode"] === 400) {
      if (respuesta["CodigoError"].toString() === "-104") {
        RespuestaCrmSP = await this.ModificarGestionErroresSolicitudes(element.Id);
        if (RespuestaCrmSP === false) {
          this.mostrarError("Codigo error: "+respuesta["CodigoError"] + " - " + respuesta["MensajeError"])
        }
        else {
          this.ActualizarTablaSolicitudes(element.Id);
        }
      }
      else {
        this.mostrarError("Codigo error: "+respuesta["CodigoError"] + " - " + respuesta["MensajeError"])
      }
    } 

    if (respuesta["StatusCode"] === 200) {
      RespuestaCrmSP = await this.ModificarGestionErroresSolicitudes(element.Id);
      if (RespuestaCrmSP === false) {
        this.mostrarError("Error al modificar las solicitudes crm");
      }
      else{        
        this.ActualizarTablaSolicitudes(element.Id);
        this.MostrarExitoso("Registro actualizado con éxito");
      }
    } 
  }

  async CargarTodosSolicitudes(){
    let ObjSolicitudes = this.ObjSolicitudes.filter(x=> x.Exitoso !== true);
    for (let index = 0; index < ObjSolicitudes.length; index++) {
      let respuesta;
      let RespuestaCrmSP;
      const element = ObjSolicitudes[index];
      let idServicios = element.IdServicios.split(",");
      let obj = {
        "numerosolp": element.NroSolp,
        "linksolp": element.EnlaceSolp,
        "idservicios": idServicios      
      }
      respuesta = await this.enviarServicioSolicitud(obj);
      if (respuesta.StatusCode === 200) {
        RespuestaCrmSP = await this.ModificarGestionErroresSolicitudes(element.Id);
        if (RespuestaCrmSP === true) {
          this.ActualizarTablaSolicitudes(element.Id);
          this.MostrarExitoso(respuesta["MensajeExito"]); 
        }     
      }
      else {
        this.mostrarError("Error al cargar la Solp con número "+element.NroSolp+" Codigo error: "+respuesta["CodigoError"] + " - " + respuesta["MensajeError"])
      }      
    }
  }

  ActualizarTablaSolicitudes(Id){
    let index = this.ObjSolicitudes.findIndex(x=> x.Id === Id)
    this.ObjSolicitudes[index].Exitoso = true;
    this.dataSourceSolicitudes = new MatTableDataSource(this.ObjSolicitudes);
    this.dataSourceSolicitudes.paginator = this.paginatorSolicitudes;
    this.dataSourceSolicitudes.sort = this.sortSolicitudes;
    let CantidadNoExitosos = this.ObjSolicitudes.filter(x=> x.Exitoso !== true).length;
    if (CantidadNoExitosos === 0) {
      this.emptySolicitudes = true;
    }
  }

  async ModificarGestionErroresSolicitudes(Id: any): Promise<any> {
    let respuesta;
    await this.servicio.CambiarEstadoSolicitudesCrm(Id).then(
      (res)=>{
        respuesta = true;
      }
    ).catch(
      (error)=>{
        console.log(error);
        respuesta = true;
      }
    )
    return respuesta;
  }

  async CargarCrmContratos(element){    
    let respuesta; 
    let idServicios = element.IdServicios !== null? element.IdServicios.split(","): [];
    
   let obj = {
      "numerocontratoproveedor": element.NroContrato,      
      "numerosolp": element.NroSolp,      
      "fechainiciocontrato": element.FechaInicio,      
      "duracioncontrato": element.Duracion,      
      "nombreproveedor": element.NombreProveedor,      
      "objetocontrato": element.ObjetoContrato,      
      "idservicios": idServicios      
    }

    for (let index = 0; index < 3; index++) { 
      respuesta = await this.enviarServicioContratos(obj);
      if (respuesta.StatusCode === 200) {
        this.MostrarExitoso(respuesta["MensajeExito"]);
        break;
      }
    }
    // respuesta = {
    //   StatusCode: 200
    // }

    let RespuestaCrmSP;

    if (respuesta["StatusCode"] === 400) {
      if (respuesta["CodigoError"].toString() === "-104") {
        RespuestaCrmSP = await this.ModificarGestionErroresSolicitudes(element.Id);
        if (RespuestaCrmSP === false) {
          this.mostrarError("Codigo error: "+respuesta["CodigoError"] + " - " + respuesta["MensajeError"])
        }
        else {
          this.ActualizarTablaContratos(element.Id);
        }
      }
      else {
        this.mostrarError("Codigo error: "+respuesta["CodigoError"] + " - " + respuesta["MensajeError"])
      }
    } 

    if (respuesta["StatusCode"] === 200) {
      RespuestaCrmSP = await this.ModificarGestionErroresSolicitudes(element.Id);
      if (RespuestaCrmSP === false) {
        this.mostrarError("Error al modificar los contratos crm");
      }
      else{        
        this.ActualizarTablaContratos(element.Id);
        this.MostrarExitoso("Registro actualizado con éxito");
      }
    } 
  }

  ActualizarTablaContratos(Id){
    let index = this.ObjContratos.findIndex(x=> x.Id === Id)
    this.ObjContratos[index].Exitoso = true;
    this.dataSourceContratos = new MatTableDataSource(this.ObjContratos);
    this.dataSourceContratos.paginator = this.paginatorContratos;
    this.dataSourceContratos.sort = this.sortContratos;
    let CantidadNoExitosos = this.ObjContratos.filter(x=> x.Exitoso !== true).length;
    if (CantidadNoExitosos === 0) {
      this.emptyContratos = true;
    }
  }
  

  ObtenerToken(){
    let token;
    this.servicioCrm.obtenerToken().then(
      (res)=>{        
        token = res["access_token"];
        localStorage.setItem("id_token",token)
      }
    ).catch(
      (error)=>{
        localStorage.setItem("id_token","false")
      }
    )
  }

  async enviarServicioSolicitud(obj): Promise<any>{
    let respuesta;
    await this.servicioCrm.ActualizarSolicitud(obj).then(
      (res)=>{
        respuesta = res;
      }
    ).catch(
      (error)=>{
         respuesta = error.error;
      }
    )        
    return respuesta;
  }

  async enviarServicioContratos(obj): Promise<any>{
    let respuesta;
    await this.servicioCrm.ActualizarContratos(obj).then(
      (res)=>{
        respuesta = res;
      }
    ).catch(
      (error)=>{
         respuesta = error.error;
      }
    )        
    return respuesta;
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

}
