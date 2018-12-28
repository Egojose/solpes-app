import { Component, OnInit } from '@angular/core';
import { TipoSolicitud } from '../dominio/tipoSolicitud';
import { SPServicio } from '../servicios/sp-servicio';
import { Usuario } from '../dominio/usuario';
import { Empresa } from '../dominio/empresa';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.css']
})
export class CrearSolicitudComponent implements OnInit {

  solpFormulario: FormGroup;
  tiposSolicitud: TipoSolicitud[] = [];
  empresas: Empresa[] = [];
  mostrarContratoMarco: boolean;
  usuarioActual: Usuario;
  usuarios: Usuario[] = [];
  nombreUsuario: string;

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  constructor(private formBuilder: FormBuilder, private servicio: SPServicio) 
  { 
    this.mostrarContratoMarco = false;
  }

  ngOnInit() {
    this.Autocompletado();
    this.RecuperarUsuario();
    this.RegistrarFormulario();
    this.obtenerTiposSolicitud();
  }

  Autocompletado(){
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  RegistrarFormulario() {
    this.solpFormulario = this.formBuilder.group({
      tipoSolicitud: ['', Validators.required],
      cm: [''],
      empresa: ['', Validators.required],
      myControl:['', Validators.required]
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
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
        this.obtenerUsuariosSitio();
      }, err => {
        console.log('Error obteniendo empresas: ' + err);
      }
    )
  }

  obtenerUsuariosSitio(){
    this.servicio.ObtenerTodosLosUsuarios().subscribe(
      (respuesta) => {
        this.usuarios = Usuario.fromJsonList(respuesta);
        this.options = this.usuarios.map(u => u.nombre);
      }, err => {
        console.log('Error obteniendo usuarios: ' + err);
      }
    )
  }



}
