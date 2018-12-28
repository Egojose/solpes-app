import { Component, OnInit } from '@angular/core';
import { TipoSolicitud } from '../dominio/tipoSolicitud';
import { SPServicio } from '../servicios/sp-servicio';
import { Usuario } from '../dominio/usuario';
import { Empresa } from '../dominio/empresa';

@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.css']
})
export class CrearSolicitudComponent implements OnInit {

  tiposSolicitud: TipoSolicitud[] = [];
  empresas: Empresa[] = [];
  mostrarContratoMarco: boolean;
  usuarioActual: Usuario;
  nombreUsuario: string;

  constructor(private servicio: SPServicio) 
  { 
    this.mostrarContratoMarco = false;
  }

  ngOnInit() {
    this.RecuperarUsuario();
    this.obtenerTiposSolicitud();
  }

  RecuperarUsuario() {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
    this.nombreUsuario = this.usuarioActual.nombre;
  }

  obtenerTiposSolicitud(){
    this.servicio.ObtenerTiposSolicitud().subscribe(
      (respuesta) => {
        this.tiposSolicitud = TipoSolicitud.fromJsonList(respuesta);
        this.obtenerEmpresas();
      }, err => {
        console.log('Error obteniendo tipos de solicitud: ' + err);
      }
    )
  }

  mostrarCM(tipoSolicitud){
    if(tipoSolicitud.tieneCm){
      this.mostrarContratoMarco = true;
    }else{
      this.mostrarContratoMarco = false;
    }
  }

  obtenerEmpresas(){
    this.servicio.ObtenerEmpresas().subscribe(
      (respuesta) => {
        this.empresas = Empresa.fromJsonList(respuesta);
        console.log(this.empresas);
      }, err => {
        console.log('Error obteniendo empresas: ' + err);
      }
    )
  }



}
