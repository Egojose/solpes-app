import { Component, OnInit } from '@angular/core';
import { ExcelService } from "../servicios/excel.service";

@Component({
  selector: 'app-reportar-solicitud',
  templateUrl: './reportar-solicitud.component.html',
  styleUrls: ['./reportar-solicitud.component.css']
})
export class ReportarSolicitudComponent implements OnInit {

  constructor(private servicioExcel: ExcelService) { }

  ngOnInit() {
  }

}

