import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { SPServicio } from './servicios/sp-servicio';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'solpes-app';
  nombreUsuario: string;

  constructor(private servicio: SPServicio) {}

  abrirCerrarMenu() {
    $(document).ready(function () {
      $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
      });
    });
  }

  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        this.nombreUsuario = Response.Title;
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
      }
    )
  }

  public ngOnInit() {
    this.abrirCerrarMenu();
    this.ObtenerUsuarioActual();
  }
}
