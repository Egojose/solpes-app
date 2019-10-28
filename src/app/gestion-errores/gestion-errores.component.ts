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

  constructor(
    private servicio: SPServicio, 
    private router: Router, 
    private spinner: NgxSpinnerService, 
    public toastr: ToastrManager,
    public servicioCrm: CrmServicioService) { }

  displayedColumns: string[] = ['numerosolp', 'idservicios', 'NombreProceso', 'Acciones'];
  displayedColumnsContratos: string[] = ['numerosolp', 'numeroContrato', 'nombreProveedor', 'Acciones'];

  ngOnInit() {
    this.ConsultarSolicitudesCrm();
  }

  ConsultarSolicitudesCrm() {
    let ObjContratos = [];
    let ObjSolicitudes = [];
    this.servicio.ObtenerSolicitudesCrm().then(
      (res)=>{
        if (res.length > 0) {
          ObjContratos = res.filter(x => x.EsContrato === true);
          ObjSolicitudes = res.filter(x => x.EsContrato === false);

          if (ObjContratos.length > 0) {
            this.emptyContratos = false;
            this.dataSourceContratos = new MatTableDataSource(ObjContratos);
            this.dataSourceContratos.paginator = this.paginatorContratos;
            this.dataSourceContratos.sort = this.sortContratos;
          } 
          else{
            this.emptyContratos = false;
          }
          
          if (ObjSolicitudes.length > 0) {
            this.emptySolicitudes = false;
            this.dataSourceSolicitudes = new MatTableDataSource(ObjSolicitudes);
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

  async CargarCrmSolicitudes(element): Promise<any>{
    let intentos = 0;
    let respuesta;
    for (let index = 0; index < 3; index++) {
      respuesta = false;
      let obj = {
        "id": "1",
        "Nombre": "Norma",
        "Email": "Norma@gmail.com",
        "Telefono": "986"
      }

      respuesta = await this.enviarServicio(obj);
      if (respuesta === true) {
        break;
      }
    }

    console.log("Prueba");
  }

  CargarCrmContratos(element){
    
  }

  async enviarServicio(obj): Promise<any>{
    let respuesta;

    await this.servicioCrm.ActualizarEmpleado(obj).then(
      (res)=>{
        respuesta = true;
      }
    ).catch(
      (error)=>{
         respuesta = false;
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
