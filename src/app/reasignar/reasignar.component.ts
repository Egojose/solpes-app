import { Component, OnInit } from '@angular/core';
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
import { Compardor } from '../dominio/compardor';

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
  usuario: Usuario;
  nombreUsuario: string;
  emptyManager: boolean;
  correoManager: string;
  mostrarJefe: boolean;
  jefeDirectoNombre: string;
  jefeDirectoId: number;
  jefeDirectoEmail: any;
  loginName: string;
  nuevoSolicitante: string;
  nuevoSolicitanteId: number;
  emailNuevoSolicitante: string;
  jefeSeleccionado: string;
  mostrarEnSondeo: boolean;
  listaCompradores: Compardor [] = []

  constructor(private servicio: SPServicio, public dialogRef: MatDialogRef<ReasignarComponent>, public toastr: ToastrManager,private router: Router, private spinner: NgxSpinnerService) {
    this.solicitudRecuperada = JSON.parse(sessionStorage.getItem('solicitud'));
    this.correoManager = "";
    this.emptyManager = false;
    this.mostrarJefe = false;
    this.mostrarEnSondeo = false;
    if(this.solicitudRecuperada == null){
      this.mostrarAdvertencia("No se puede realizar esta acción");
      this.router.navigate(['/mis-solicitudes']);
    }
  }

  ngOnInit() {
    this.asignarConsecutivo();
    this.registrarControles();
    this.obtenerUsuariosSitio();
    // this.obtenerProfile();
    this.mostrarCampoJefe();
    this.mostrarCampoSondeo();
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
        this.ObtenerUsuarioActual();
        
        this.obtenerCompradores();
      }, err => {
        console.log('Error obteniendo usuarios: ' + err);
      }
    )
  }

  mostrarCampoSondeo() {
    if(this.solicitudRecuperada.estado === 'Por sondear' || this.solicitudRecuperada.estado === 'Por aprobar sondeo') {
      this.mostrarEnSondeo = true;
      console.log(this.mostrarEnSondeo);
    }
  }

  mostrarCampoJefe() {
    if(this.solicitudRecuperada.estado === "Por aprobar sondeo") {
      this.mostrarJefe = true;
    }
  }

  private DataSourceUsuariosSelect2() {
    console.log(this.usuarios);
    this.usuarios.forEach(usuario => {
      this.dataUsuarios.push({ value: usuario.id.toString(), label: usuario.nombre });
    });
  }

  obtenerCompradores() {
    this.servicio.obtenerCompradores().subscribe(
      (respuesta) => {
        this.listaCompradores = Compardor.fromJsonList(respuesta)
      }
    ) 
  }

  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (respuesta) => {
        this.usuario = new Usuario(respuesta.Title, respuesta.email, respuesta.Id);
        this.nombreUsuario = this.usuario.nombre;
        console.log(this.nombreUsuario);
        sessionStorage.setItem('usuario', JSON.stringify(this.usuario));
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
      }
    )
  }

  // obtenerProfile() {
  //   this.servicio.obtenerdatosProfile().subscribe(
  //     (respuesta) => {
  //       if (respuesta.ExtendedManagers.results.length > 0) {
  //         let posicionManager = respuesta.ExtendedManagers.results.length - 1;
  //         this.correoManager = respuesta.ExtendedManagers.results[posicionManager];
  //         this.correoManager = this.correoManager.split('|')[2];
  //       }
  //       if (this.correoManager != "") {
  //         // this.cargarJefePorDefecto();
  //       }
  //       else {
  //         alert('no tiene jefe');
  //       } 
  //       // else {
  //       //   this.agregarSolicitudInicial();
  //       // }
  //     }, err => {
  //       this.mostrarError('Error obteniendo profile');
  //       this.spinner.hide();
  //       console.log('Error obteniendo profile: ' + err);
  //     }
  //   )
  // }

  // cargarJefePorDefecto(): any {
  //   this.servicio.ObtenerUsuarioPorEmail(this.correoManager).subscribe(
  //     (respuesta) => {
  //       this.emptyManager = false;
  //       this.valorUsuarioPorDefecto = respuesta.Id.toString();
  //     }, err => {
  //       this.mostrarError('Error obteniendo jefe inmediato');
  //       this.spinner.hide();
  //       console.log('Error obteniendo jefe inmediato: ' + err);
  //     }
  //   )
  // }

  changeSolicitante($event) {
    this.spinner.show();
    let id = $event.target.value
    this.ObtenerUsuarioPorId(id)
  }

  changeJefe($event) {
    this.jefeSeleccionado = $event.target.value;
    console.log(this.jefeSeleccionado);
    if (this.jefeSeleccionado !== "") {
      this.emptyManager = false;
    }
  }

  ObtenerUsuarioPorId(id: number) {
    this.servicio.ObtenerUsuarioPorId(id).subscribe(
      (respuesta) => {
        console.log(respuesta);
        this.nuevoSolicitante = respuesta.Title;
        this.emailNuevoSolicitante = respuesta.Email;
        this.nuevoSolicitanteId = respuesta.Id;
        this.loginName = respuesta.LoginName;
        this.obtenerPropiedades(this.loginName);
      }, err => {
        this.mostrarError('Error obteniendo jefe inmediato');
        console.log('Error obteniendo jefe inmediato: ' + err);
      }
    )
  }

  obtenerPropiedades(loginName: string) {
    this.servicio.obtenerPropiedadesPerfil(loginName).subscribe(
      (respuestaProfile) => {
        console.log(respuestaProfile);
        let posicionManager = respuestaProfile.ExtendedManagers.results.length - 1;
        if (posicionManager > -1) {
          this.jefeDirectoEmail = respuestaProfile.ExtendedManagers.results[posicionManager];
          this.jefeDirectoEmail = this.jefeDirectoEmail.split('|')[2];
          this.obtenerJefeInmediato();
        }
        else {
          this.valorUsuarioPorDefecto = '';
          this.emptyManager = true;
          this.spinner.hide();
        }
      });
  }

  obtenerJefeInmediato() {
    this.emptyManager = false;
    this.servicio.ObtenerUsuarioPorEmail(this.jefeDirectoEmail).subscribe(
      (respuesta) => {
        console.log(respuesta);
        this.jefeSeleccionado = respuesta.Id.toString();
        this.jefeDirectoNombre = respuesta.Title;
        this.jefeDirectoId = respuesta.Id;
        console.log(this.jefeDirectoNombre);
        this.spinner.hide();
      }
    )
  }

  seleccionarOrdenadorGastos(event) {
    if (event != "Seleccione") {
      this.emptyManager = false;
    } else {
      this.emptyManager = true;
    }
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
    if (this.jefeSeleccionado === "") {
      this.mostrarAdvertencia('Debe seleccionar un ordenador de gastos');
      this.spinner.hide();
      return false;
    }
    let responsableReasignarSondeo;
    let responsableResignarRevisarSondeo;
    let fechaReasignadoRevisarSondeo;
    let fechaReasignadoSondeo;
    let responsableReasingarContratos;
    let fechaReasignadoContratos;
    let objetoActualizar;
    let solicitanteOriginal = this.solicitudRecuperada.solicitante;

    if (this.solicitudRecuperada.estado === "Por sondear") {
      responsableReasignarSondeo = this.nombreUsuario;
      fechaReasignadoSondeo = new Date();
      objetoActualizar = {
        ResponsableId: this.reasignarModelo,
        CompradorId: this.reasignarModelo,
        ResponsableReasignarSondeo: responsableReasignarSondeo,
        FechaReasignadoSondeo: fechaReasignadoSondeo,
      }
    }

    else if (this.solicitudRecuperada.estado === "Por aprobar sondeo") {
      responsableResignarRevisarSondeo = this.nombreUsuario;
      fechaReasignadoRevisarSondeo = new Date();
      objetoActualizar = {
        ResponsableId: this.reasignarModelo,
        CompradorId: this.reasignarModelo,
        ResponsableReasignarRevisarSonde: responsableResignarRevisarSondeo,
        FechaReasignadoRevisarSondeo: fechaReasignadoRevisarSondeo,
        SolicitanteOriginal: solicitanteOriginal,
        Solicitante: this.nuevoSolicitante,
        OrdenadorGastosId: this.jefeSeleccionado.toString()
      }
    }

    else if (this.solicitudRecuperada.estado === "Por registrar contratos" || this.solicitudRecuperada.estado === "Suspendida") {
      responsableReasingarContratos = this.nombreUsuario;
      fechaReasignadoContratos = new Date();
      objetoActualizar = {
        ResponsableId: this.reasignarModelo,
        CompradorId: this.reasignarModelo,
        ResponsableReasignarContratos: responsableReasingarContratos,
        FechaReasignadoContratos: fechaReasignadoContratos
      }
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
