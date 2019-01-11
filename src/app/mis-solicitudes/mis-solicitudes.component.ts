import { Component, OnInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { Usuario } from '../dominio/usuario';
import { Solicitud } from '../dominio/solicitud';

@Component({
  selector: 'app-mis-solicitudes',
  templateUrl: './mis-solicitudes.component.html',
  styleUrls: ['./mis-solicitudes.component.css']
})
export class MisSolicitudesComponent implements OnInit {
  usuarioActual : Usuario;
  misSolicitudes: Solicitud[] = [];

  constructor( private servicio: SPServicio) { }

  ngOnInit() {
    this.ObtenerUsuarioActual();
  }

  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        this.usuarioActual  = new Usuario(Response.Title, Response.email,Response.Id);
        this.ObtenerMisSolicitudes();
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
      }
    )
  }

  ObtenerMisSolicitudes() {
    let idUsuario = this.usuarioActual.id;
    console.log(idUsuario);
    this.servicio.obtenerMisSolicitudes(idUsuario).subscribe(
      (respuesta) => {
        console.log(respuesta);
        this.misSolicitudes = Solicitud.fromJsonList(respuesta);
        console.log(this.misSolicitudes); 
      }, error => {
        console.log('Error obteniendo mis solicitudes: ' + error);
      }
    )
  }
}
