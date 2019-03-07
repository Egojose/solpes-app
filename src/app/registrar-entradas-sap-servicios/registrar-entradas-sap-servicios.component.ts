import { Component, OnInit, ViewChild } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { FormControl, FormGroup } from '@angular/forms';
import { ItemAddResult } from 'sp-pnp-js';
import { RecepcionServicios } from '../registrar-entradas-sap-servicios/RecepcionServicios';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Contratos } from '../recepcion-sap/contratos';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Usuario } from '../dominio/usuario';
import { Grupo } from '../dominio/grupo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-entradas-sap-servicios',
  templateUrl: './registrar-entradas-sap-servicios.component.html',
  styleUrls: ['./registrar-entradas-sap-servicios.component.css']
})

export class RegistrarEntradasSapServiciosComponent implements OnInit {
  numRecepcion = new FormControl('');
  IdSolicitudParms: any;
  responsable: any;
  cantidad: any;
  valor: string;
  comentarios: string;
  IdSolicitud: number;
  ObjRecepcionServicios: RecepcionServicios[] = [];
  recepcionServicios: FormGroup;
  objContratos: Contratos[] = [];
  IdRecepcionServicios: number;
  IdUsuario: any;
  PermisosRegistroEntradasServicios: boolean;
  usuarioActual: Usuario;
  grupos: Grupo[] = [];

  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  empty: boolean;

  displayedColumns: string[] = ['numeroPedido', 'autor', 'descripcion', 'cantidad', 'mes', 'valor', 'comentario', 'NumeroRecepcion', 'Acciones'];

  constructor(private servicio: SPServicio, private router: Router, public toastr: ToastrManager, private spinner: NgxSpinnerService) {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
    this.PermisosRegistroEntradasServicios = false;


  }

  ngOnInit() {
    this.spinner.show();
    this.servicio.ObtenerGruposUsuario(this.usuarioActual.id).subscribe(
      (respuesta) => {
        this.grupos = Grupo.fromJsonList(respuesta);
        this.VerificarPermisosMenu();
        if(this.PermisosRegistroEntradasServicios){
          this.ObtenerRecepciones();
        }else{
          this.mostrarAdvertencia("No se puede realizar esta acción");
          this.spinner.hide();
          this.router.navigate(['/mis-solicitudes']);
        }
      }, err => {
        console.log('Error obteniendo grupos de usuario: ' + err);
        this.spinner.hide();
      }
    )
  }

  VerificarPermisosMenu(): any {
    const grupoRegistroEntradasServicios = "Solpes-Registro-Entradas-Servicios";
    let existeGrupoRegistroEntradasServicios = this.grupos.find(x => x.title == grupoRegistroEntradasServicios);
    if (existeGrupoRegistroEntradasServicios != null) {
      this.PermisosRegistroEntradasServicios = true;
    }
  }

  private ObtenerRecepciones() {
    this.servicio.ObtenerUsuarioActual().subscribe((respuesta) => {
      this.IdUsuario = respuesta.Id;
      this.servicio.ObtenerRecepcionesServicios(this.IdUsuario).subscribe((respuesta) => {
        this.ObjRecepcionServicios = RecepcionServicios.fromJsonList(respuesta);
        if (this.ObjRecepcionServicios.length > 0) {
          this.empty = false;
          this.dataSource = new MatTableDataSource(this.ObjRecepcionServicios);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else {
          this.empty = true;
        }
        this.spinner.hide();
      }, err => {
        this.mostrarError('Error obteniendo las entradas de las recepciones de servicios');
        this.spinner.hide();
        console.log('Error obteniendo las entradas de las recepciones de servicios: ' + err);
      });
    }, err => {
      this.mostrarError('Error obteniendo el usuario actual');
      this.spinner.hide();
      console.log('Error obteniendo el usuario actual: ' + err);
    });
  }

  Guardar(item) {
    this.spinner.show();
    this.IdRecepcionServicios = item.IdRecepcionServicios;
    let objRegistrar;
    objRegistrar = {
      NumeroRecepcion: item.NumeroRecepcion,
      recibidoSap: true,
    }
    if (item.NumeroRecepcion == null || item.NumeroRecepcion == '') {
      this.mostrarAdvertencia('Debe suministrar el número de recepción');
      this.spinner.hide();
      return false;
    }
    else {
      let index = this.ObjRecepcionServicios.findIndex(x => x.IdRecepcionServicios === item.IdRecepcionServicios);
      this.servicio.registrarRecepcionServicios(this.IdRecepcionServicios, objRegistrar).then(
        (resultado: ItemAddResult) => {
          this.MostrarExitoso('Recibido');
          this.ObtenerRecepciones();
          this.spinner.hide();
        }
      ).catch(
        (error) => {
          console.log(error);
          this.spinner.hide();
        }
      )
    }
  }

  MostrarExitoso(mensaje: string) {
    this.toastr.successToastr(mensaje, 'Confirmación!');
  }

  mostrarAdvertencia(mensaje: string) {
    this.toastr.warningToastr(mensaje, 'Validación');
  }

  mostrarError(mensaje: string) {
    this.toastr.errorToastr(mensaje, 'Oops!');
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

