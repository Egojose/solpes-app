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

  confirmarDescarga(){
    this.servicio.ObtenerReporteContratos(this.rangoFecha[0], this.rangoFecha[1]).subscribe(
      (respuesta) => {
        console.log(respuesta)
        this.solicitudesReportes = ReporteContratos.fromJsonList(respuesta);
        if(this.solicitudesReportes.length > 0){
          this.servicioExcel.exportAsExcelFile(this.solicitudesReportes, `Reporte de solicitudes ${this.rangoFecha}`);
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


