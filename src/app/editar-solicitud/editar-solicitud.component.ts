import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editar-solicitud',
  templateUrl: './editar-solicitud.component.html',
  styleUrls: ['./editar-solicitud.component.css']
})
export class EditarSolicitudComponent implements OnInit {
  IdSolicitud;

  constructor() {
    this.IdSolicitud = sessionStorage.getItem("IdSolicitud");
   }

  ngOnInit() {
    console.log(this.IdSolicitud);
  }

}
