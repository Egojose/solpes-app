import { Component, OnInit, Compiler } from '@angular/core';
import { Select2Data } from 'ng-select2-component';
import { MatDialogRef } from '@angular/material';
import { SPServicio } from '../servicios/sp-servicio';
import { Usuario } from '../dominio/usuario';
import { Solicitud } from '../dominio/solicitud';
import { FormControl, Validators } from '@angular/forms';
import { ItemAddResult } from 'sp-pnp-js';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reasignar',
  templateUrl: './reasignar.component.html',
  styleUrls: ['./reasignar.component.css']
})
export class ReasignarComponent implements OnInit {
  loading: boolean;
  solicitudRecuperada: Solicitud;
  consecutivoSolicitud: string;
  reasignarModelo: string;
  usuarios: Usuario[] = [];
  valorUsuarioPorDefecto: string = "";
  dataUsuarios: Select2Data = [
    { value: '', label: 'Seleccione' }
  ];
  ReasignarControl: FormControl;

  constructor(private servicio: SPServicio, public dialogRef: MatDialogRef<ReasignarComponent>, public toastr: ToastrManager,private router: Router, private spinner: NgxSpinnerService, private compilador: Compiler) {
    this.compilador.clearCache();
    this.solicitudRecuperada = JSON.parse(sessionStorage.getItem('solicitud'));
    if(this.solicitudRecuperada == null){
      this.mostrarAdvertencia("No se puede realizar esta acción");
      this.router.navigate(['/mis-solicitudes']);
    }
  }

  ngOnInit() {
    this.asignarConsecutivo();
    this.registrarControles();
    this.obtenerUsuariosSitio();
  }

  asignarConsecutivo() {
    this.consecutivoSolicitud = this.solicitudRecuperada.consecutivo.toString();
  }

  registrarControles() {
    this.ReasignarControl = new FormControl('', [
      Validators.required
    ]);
  }

  obtenerUsuariosSitio() {
    this.servicio.ObtenerTodosLosUsuarios().subscribe(
      (respuesta) => {
        this.usuarios = Usuario.fromJsonList(respuesta);
        this.DataSourceUsuariosSelect2();
      }, err => {
        console.log('Error obteniendo usuarios: ' + err);
      }
    )
  }

  private DataSourceUsuariosSelect2() {
    this.usuarios.forEach(usuario => {
      this.dataUsuarios.push({ value: usuario.id.toString(), label: usuario.nombre });
    });
  }

  salir() {
    this.dialogRef.close();
  }

  reasignar() {
    this.ReasignarControl.markAsTouched();
    if (this.ReasignarControl.status == "INVALID") {
      return;
    }

    this.actualizarResponsableyComprador();

  }

  actualizarResponsableyComprador(): any {
    this.spinner.show();
    let objetoActualizar = {
      ResponsableId: this.reasignarModelo,
      CompradorId: this.reasignarModelo
    }
    this.servicio.actualizarResponsableCompradorSolicitud(this.solicitudRecuperada.id, objetoActualizar).then(
      (item: ItemAddResult) => {
        let notificacion = {
          IdSolicitud: this.solicitudRecuperada.id.toString(),
          ResponsableId: this.reasignarModelo,
          Estado: this.solicitudRecuperada.estado
        };
        this.servicio.agregarNotificacion(notificacion).then(
          (item: ItemAddResult) => {
            this.MostrarExitoso("La solicitud se ha reasignado correctamente");
            this.redireccionar();
            this.spinner.hide();
          }, err => {
            this.mostrarError('Error agregando la notificación');
            this.spinner.hide();
          }
        )
      }, err => {
        this.mostrarError('Error en guardado parcial de la solicitud');
        this.spinner.hide();
      }
    )
  }

  redireccionar(){
    this.loading = false;
    setTimeout(() => {    
      location.reload();
    }, 2000);
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

  mostrarInformacion(mensaje: string) {
    this.toastr.infoToastr(mensaje, 'Información importante');
  }

  mostrarPersonalizado(mensaje: string) {
    this.toastr.customToastr(mensaje, null, { enableHTML: true });
  }

}
