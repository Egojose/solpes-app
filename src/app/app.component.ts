import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { SPServicio } from './servicios/sp-servicio';
import { Usuario } from './dominio/usuario';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'solpes-app';
  usuario: Usuario;
  nombreUsuario: string;

  constructor(private servicio: SPServicio) {
  }

  abrirCerrarMenu(){
    $(document).ready(function () {
      $("#menu-toggle").click(function (e) {
        let textoMenu  = e.target.innerText;
        let nuevoTextoMenu = "";
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        if (textoMenu == "Ocultar menú"){
           nuevoTextoMenu = "Mostrar menú";
           e.target.innerText = nuevoTextoMenu;
        }else{
           nuevoTextoMenu = "Ocultar menú";
           e.target.innerText = nuevoTextoMenu;
        }
      });
    });
  }

  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        this.usuario = new Usuario(Response.Title, Response.email,Response.Id);
        this.nombreUsuario = this.usuario.nombre;
        sessionStorage.setItem('usuario',JSON.stringify(this.usuario));
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
