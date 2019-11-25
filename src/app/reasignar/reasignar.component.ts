import { Component, OnInit, Input } from '@angular/core';
import { Select2Data } from 'ng-select2-component';
import { MatDialogRef } from '@angular/material';
import { SPServicio } from '../servicios/sp-servicio';
import { Usuario } from '../dominio/usuario';
import { Solicitud } from '../dominio/solicitud';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ItemAddResult } from 'sp-pnp-js';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Compardor } from '../dominio/compardor';
import { Subcategoria } from '../dominio/subcategoria';
import { Pais } from '../dominio/pais';
import { Categoria } from '../dominio/categoria';

@Component({
  selector: 'app-reasignar',
  templateUrl: './reasignar.component.html',
  styleUrls: ['./reasignar.component.css']
})
export class ReasignarComponent implements OnInit {

  // @Input() Prueba;


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
  listaCompradores: Compardor [] = [];
  ReasignarSondeoFormulario: FormGroup;
  Recategorizacion: boolean;
  ReasignarSubmitted: boolean = false;
  subcategorias: Subcategoria[] = [];
  subcategoriaSeleccionada: Subcategoria;
  paises: Pais[] = [];
  categorias: Categoria[] = [];

  constructor(
    private servicio: SPServicio, 
    public dialogRef: MatDialogRef<ReasignarComponent>, 
    public toastr: ToastrManager,
    private router: Router, 
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder) {
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
    this.obtenerPaises();
    // this.obtenerProfile();
  }

  asignarConsecutivo() {
    this.consecutivoSolicitud = this.solicitudRecuperada.consecutivo.toString();
    this.mostrarCampoSondeo();
    this.mostrarCampoJefe();    
  }

  registrarControles() {
    this.ReasignarSondeoFormulario = this.formBuilder.group({      
      ReasignarA: ['', Validators.required],
      CausaReasignacion: ['', Validators.required],
      Pais: [''],
      Categoria: [''],
      SubCategoria: [''],
      ReasignarJefeA: ['']
    });
    // this.ReasignarControl = new FormControl('', [Validators.required]);
  }

  get f2() { return this.ReasignarSondeoFormulario.controls; }

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
    let id = this.ReasignarSondeoFormulario.controls['ReasignarA'].value;
    // let id = $event.target.value
    this.ObtenerUsuarioPorId(id)
  }

  changeSolicitanteComprador(event: any): void {
    // let id = event.item.compradorId;
    let id = this.ReasignarSondeoFormulario.controls['ReasignarA'].value;
    this.reasignarModelo = id;
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

  ReasignarSondeoSubmit(){
    this.ReasignarSubmitted = true;
    if (this.ReasignarSondeoFormulario.invalid) {
      this.mostrarInformacion("Por favor diligencie todos los campos");
      return;
    }
    this.actualizarResponsableyComprador();
  }

  SeleccionCausa(item) {
    let causa = item.target.value;
    if (causa === "Recategorización") {
      this.Recategorizacion = true;
      this.ReasignarSondeoFormulario.controls['Categoria'].setValidators([Validators.required])
      this.ReasignarSondeoFormulario.controls['SubCategoria'].setValidators([Validators.required])
    }
    else {
      this.Recategorizacion = false;
      this.ReasignarSondeoFormulario.controls['Categoria'].clearValidators();
      this.ReasignarSondeoFormulario.controls['Categoria'].updateValueAndValidity();
      this.ReasignarSondeoFormulario.controls['SubCategoria'].setValidators([]);
      this.ReasignarSondeoFormulario.controls['SubCategoria'].updateValueAndValidity();
    }
  }

  obtenerPaises() {
    this.servicio.ObtenerPaises().subscribe(
      (respuesta) => {
        this.paises = Pais.fromJsonList(respuesta);
        this.obtenerCategorias();
      }, err => {
        this.mostrarError('Error obteniendo paises');
        this.spinner.hide();
        console.log('Error obteniendo paises: ' + err);
      }
    )
  }

  obtenerCategorias() {
    this.servicio.ObtenerCategorias().subscribe(
      (respuesta) => {
        this.categorias = Categoria.fromJsonList(respuesta);        
      }, err => {
        this.mostrarError('Error obteniendo categorías');
        this.spinner.hide();
        console.log('Error obteniendo categorías: ' + err);
      }
    )
  }

  filtrarSubcategorias() {
    this.spinner.show();
    let categoria = this.ReasignarSondeoFormulario.controls["Categoria"].value;
    let pais = this.ReasignarSondeoFormulario.controls["Pais"].value;
    
    if (categoria != '' && pais != '') {
      this.servicio.ObtenerSubcategorias(categoria.id, pais.id).subscribe(
        (respuesta) => {
          if (respuesta.length > 0) {
            this.subcategorias = Subcategoria.fromJsonList(respuesta);
          } else {
            this.subcategorias = [];
            this.ReasignarSondeoFormulario.controls["SubCategoria"].setValue("");
          }
          this.spinner.hide();
        }, err => {
          this.mostrarError('Error obteniendo subcategorias');
          this.spinner.hide();
          console.log('Error obteniendo subcategorias: ' + err);
        }
      )
    } else {
      this.spinner.hide();
    }
  }

  actualizarResponsableyComprador(): any {
    this.spinner.show();
    if (this.jefeSeleccionado === "") {
      this.mostrarAdvertencia('Debe seleccionar un ordenador de gastos');
      this.spinner.hide();
      return false;
    }
    this.reasignarModelo = this.ReasignarSondeoFormulario.controls['ReasignarA'].value;
    let categoria = this.ReasignarSondeoFormulario.controls["Categoria"].value;
    let SubCategoria = this.ReasignarSondeoFormulario.controls["SubCategoria"].value;
    let pais = this.ReasignarSondeoFormulario.controls["Pais"].value;
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
        PaisId: pais.id,
        Categoria: categoria.nombre,
        Subcategoria: SubCategoria.nombre
      }
    }

    else if (this.solicitudRecuperada.estado === "Por aprobar sondeo") {

      responsableResignarRevisarSondeo = this.nombreUsuario;
      fechaReasignadoRevisarSondeo = new Date();
      objetoActualizar = {
        ResponsableId: this.reasignarModelo,
        // CompradorId: this.reasignarModelo,
        ResponsableReasignarRevisarSonde: responsableResignarRevisarSondeo,
        FechaReasignadoRevisarSondeo: fechaReasignadoRevisarSondeo,
        SolicitanteOriginal: solicitanteOriginal,
        Solicitante: this.nuevoSolicitante,
        SolicitantePersonaId: this.nuevoSolicitanteId.toString(),
        OrdenadorGastosId: this.jefeSeleccionado.toString(),
        ReasignadoRevisarSondeo: 'true',
        PaisId: pais.id,
        Categoria: categoria.nombre,
        Subcategoria: SubCategoria.nombre
      }
    }

    else if (this.solicitudRecuperada.estado === "Por registrar contratos" || this.solicitudRecuperada.estado === "Suspendida") {
      responsableReasingarContratos = this.nombreUsuario;
      fechaReasignadoContratos = new Date();
      objetoActualizar = {
        ResponsableId: this.reasignarModelo,
        CompradorId: this.reasignarModelo,
        ResponsableReasignarContratos: responsableReasingarContratos,
        FechaReasignadoContratos: fechaReasignadoContratos,
        PaisId: pais.id,
        Categoria: categoria.nombre,
        Subcategoria: SubCategoria.nombre
      }
    }
    
    this.servicio.actualizarResponsableCompradorSolicitud(this.solicitudRecuperada.id, objetoActualizar).then(
      (item: ItemAddResult) => {
        this.dialogRef.close();
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
