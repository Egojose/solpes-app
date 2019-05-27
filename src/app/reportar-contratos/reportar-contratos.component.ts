import { Component, OnInit, TemplateRef } from '@angular/core';
import { ExcelService } from '../servicios/excel.service';
import { SPServicio } from '../servicios/sp-servicio';
import { ReporteContratos } from '../dominio/reporteContratos';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';


@Component({
  selector: 'app-reportar-contratos',
  templateUrl: './reportar-contratos.component.html',
  styleUrls: ['./reportar-contratos.component.css']
})
export class ReportarContratosComponent implements OnInit {
  bsValue = new Date();
  minDate: Date;
  maxDate: Date;
  rangoFecha: Date[];
  solicitudesReportes: ReporteContratos[] = [];
  modalRef: BsModalRef;

  constructor(private servicioExcel: ExcelService, private servicio: SPServicio, public toastr: ToastrManager,private modalService: BsModalService) { 
    this.minDate = new Date("01/01/2019");
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.maxDate.setDate(this.maxDate.getDate());
    this.rangoFecha = [this.bsValue, this.maxDate];
  }

 

  ngOnInit() {
  }

  generarReporte(template: TemplateRef<any>){

    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    
  }

  MostrarExitoso(mensaje: string) {
    this.toastr.successToastr(mensaje, 'Confirmación!');
  }

  mostrarError(mensaje: string) {
    this.toastr.errorToastr(mensaje, 'Oops!');
  }

  mostrarAdvertencia(mensaje: string) {
    this.toastr.warningToastr(mensaje, 'Reporte');
  }

  mostrarInformacion(mensaje: string) {
    this.toastr.infoToastr(mensaje, 'Información importante');
  }

  mostrarPersonalizado(mensaje: string) {
    this.toastr.customToastr(mensaje, null, { enableHTML: true });
  }

  ObtenerFormatoFecha(date) {
    var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
    
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
    } 

    
  confirmarDescarga(){

    let fechaIni = this.ObtenerFormatoFecha(this.rangoFecha[0]);
    let fechaFin = this.ObtenerFormatoFecha(this.rangoFecha[1]);

    // if(fechaIni.length === 0 || fechaFin.length === 0) {
    //   this.mostrarAdvertencia("Debe seleccionar las fechas en las que desea ver el reporte");
    // }

    this.servicio.ObtenerReporteContratos(fechaIni, fechaFin).subscribe(
      (respuesta) => {
        console.log(respuesta)
        this.solicitudesReportes = ReporteContratos.fromJsonList(respuesta);
        if(this.solicitudesReportes.length > 0){
          this.servicioExcel.exportAsExcelFile(this.solicitudesReportes, 'Reporte de contratos');
          this.modalRef.hide();
        }else{
          this.mostrarAdvertencia("No hay reporte que mostrar para estas fechas");
          this.modalRef.hide();
        }
      });
  }

  declinarDescarga(){
    this.modalRef.hide();
  }

}


