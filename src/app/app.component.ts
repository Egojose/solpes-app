import { Component, OnInit, Compiler } from '@angular/core';
import * as $ from 'jquery';
import { SPServicio } from './servicios/sp-servicio';
import { Usuario } from './dominio/usuario';
import { Grupo } from './dominio/grupo';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  usuario: Usuario;
  nombreUsuario: string;
  grupos: Grupo[] = [];
  PermisosEdicionContratos: boolean;
  PermisosRegistroEntradasBienes: boolean;
  PermisosRegistroEntradasServicios: boolean;
  PermisosConsultaGeneral: boolean;
  PermisosReporteSolicitud: boolean;
  PermisosReporteContratos: boolean;
  PermisosVerificarFirmarContratos: boolean;
  PermisosSoporte: boolean;
  linkEdicionContratos: string;
  nombreGrupoConsultaGeneral: string;

  constructor(private servicio: SPServicio, private compilador: Compiler) {
    this.compilador.clearCache();
    this.PermisosEdicionContratos = false;
    this.PermisosRegistroEntradasBienes = false;
    this.PermisosRegistroEntradasServicios = false;
    this.PermisosConsultaGeneral = false;
    this.PermisosReporteSolicitud = false;
    this.PermisosReporteContratos = false;
    this.PermisosSoporte = false;
    this.PermisosVerificarFirmarContratos = true;
    this.linkEdicionContratos = environment.urlWeb + environment.linkVistaEdicionContratos;
  }

  abrirCerrarMenu() {
    $(document).ready(function () {
      $("#menu-toggle").click(function (e) {
        let textoMenu = e.target.innerText;
        let nuevoTextoMenu = "";
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        if (textoMenu == "Ocultar menú") {
          nuevoTextoMenu = "Mostrar menú";
          e.target.innerText = nuevoTextoMenu;
        } else {
          nuevoTextoMenu = "Ocultar menú";
          e.target.innerText = nuevoTextoMenu;
        }
      });
    });
  }

  public ngOnInit() {
    this.abrirCerrarMenu();
    this.ObtenerUsuarioActual();
  }

  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (respuesta) => {
        this.usuario = new Usuario(respuesta.Title, respuesta.email, respuesta.Id);
        this.nombreUsuario = this.usuario.nombre;
        sessionStorage.setItem('usuario', JSON.stringify(this.usuario));
        this.servicio.ObtenerGruposUsuario(this.usuario.id).subscribe(
          (respuesta) => {
            this.grupos = Grupo.fromJsonList(respuesta);
            console.log(this.grupos);
            this.obtenerParametrosConfiguracion();
          }, err => {
            console.log('Error obteniendo grupos de usuario: ' + err);
          }
        )
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
      }
    )
  }

  obtenerParametrosConfiguracion() {
    this.servicio.obtenerParametrosConfiguracion().subscribe(
      (respuesta) => {
        this.nombreGrupoConsultaGeneral = respuesta[0].GrupoConsultaGeneral;
        this.VerificarPermisosMenu();
      }, err => {
        console.log('Error obteniendo parametros de configuración: ' + err);
      }
    )
  }

  VerificarPermisosMenu(): any {

    const grupoEdicionContratos = "Solpes-Edicion-Contratos";
    const grupoRegistroEntradasBienes = "Solpes-Registro-Entradas-Bienes";
    const grupoRegistroEntradasServicios = "Solpes-Registro-Entradas-Servicios";
    const grupoReporteSolicitudes = "Integrantes de la JAM";
    const grupoReporteContratos = "Solpes-Reporte-Contratos"
    const grupoSoporte = "Solpes-Soporte"
    const grupoVerificarFirmarContratos = 'Solpes-Verificar-Firmar-Contratos'
    let grupoConsultaGeneral = this.nombreGrupoConsultaGeneral;

    let existeGrupoEdicionContratos = this.grupos.find(x => x.title == grupoEdicionContratos);
    if (existeGrupoEdicionContratos != null) {
      this.PermisosEdicionContratos = true;
    }

    let existeGrupoReporteContratos = this.grupos.find(x => x.title == grupoReporteContratos);
    if (existeGrupoReporteContratos != null) {
      this.PermisosReporteContratos = true;
    }

    let existeGrupoRegistroEntradasBienes = this.grupos.find(x => x.title == grupoRegistroEntradasBienes);
    if (existeGrupoRegistroEntradasBienes != null) {
      this.PermisosRegistroEntradasBienes = true;
    }

    let existeGrupoRegistroEntradasServicios = this.grupos.find(x => x.title == grupoRegistroEntradasServicios);
    if (existeGrupoRegistroEntradasServicios != null) {
      this.PermisosRegistroEntradasServicios = true;
    }

    let existeGrupoConsultaGeneral = this.grupos.find(x => x.title == grupoConsultaGeneral);
    if (existeGrupoConsultaGeneral != null) {
      this.PermisosConsultaGeneral = true;
    }

    let existeGrupoReporteSolicitudes = this.grupos.find(x => x.title == grupoReporteSolicitudes);
    if (existeGrupoReporteSolicitudes != null) {
      this.PermisosReporteSolicitud = true;
    }

    let existeGrupoSoporte = this.grupos.find(x => x.title == grupoSoporte);
    if(existeGrupoSoporte != null) {
      this.PermisosSoporte = true;
    }

    let existeGrupoVerificarFirmarContrato = this.grupos.find(x => x.title == grupoVerificarFirmarContratos);
    if(existeGrupoVerificarFirmarContrato !== null && existeGrupoVerificarFirmarContrato !== undefined) {
      this.PermisosVerificarFirmarContratos = true;
    }
  }

  
}
