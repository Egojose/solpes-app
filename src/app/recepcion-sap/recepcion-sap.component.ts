import { Component, OnInit, ViewChild } from '@angular/core';
import { RecepcionBienes } from '../recepcion-sap/RecepcionBienes'
import { SPServicio } from '../servicios/sp-servicio';
import { FormControl, FormGroup } from '@angular/forms';
import { ItemAddResult } from 'sp-pnp-js';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Contratos } from '../recepcion-sap/contratos';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Usuario } from '../dominio/usuario';
import { Grupo } from '../dominio/grupo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recepcion-sap',
  templateUrl: './recepcion-sap.component.html',
  styleUrls: ['./recepcion-sap.component.css']
})

export class RecepcionSapComponent implements OnInit {
  numRecepcion = new FormControl('');
  IdSolicitudParms: any;
  responsable: any;
  cantidad: any;
  valor: string;
  comentarios: string;
  ObjRecepcionBienes: any[] = [];
  objContratos: Contratos[] = [];
  IdSolicitud: number;
  recepcionBienes: FormGroup;
  IdRecepcionBienes: number;
  IdUsuario: any;
  fulldatos: any;
  numRecepcionValor: string;

  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  empty: boolean;
  PermisosRegistroEntradasBienes: boolean;
  usuarioActual: Usuario;
  grupos: Grupo[] = [];

  displayedColumns: string[] = ['numeroPedido', 'autor', 'descripcion','cantidad', 'valor', 'comentario', 'adjuntoEntregaBienes', 'NumeroRecepcion', 'Acciones'];

  constructor(private servicio: SPServicio, private router: Router, public toastr: ToastrManager, private spinner: NgxSpinnerService) {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
    this.PermisosRegistroEntradasBienes = false;
  }

  ngOnInit() {
    this.spinner.show();
    this.servicio.ObtenerGruposUsuario(this.usuarioActual.id).subscribe(
      (respuesta) => {
        this.grupos = Grupo.fromJsonList(respuesta);
        this.VerificarPermisosMenu();
        if(this.PermisosRegistroEntradasBienes){
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
    const grupoRegistroEntradasBienes = "Solpes-Registro-Entradas-Bienes";
    let existeGrupoRegistroEntradasBienes = this.grupos.find(x => x.title == grupoRegistroEntradasBienes);
    if (existeGrupoRegistroEntradasBienes != null) {
      this.PermisosRegistroEntradasBienes = true;
    }
  }

  private ObtenerRecepciones() {
    this.servicio.ObtenerUsuarioActual().subscribe((respuesta) => {
      this.IdUsuario = respuesta.Id;
      this.servicio.ObtenerRecepcionesBienes(this.IdUsuario).subscribe((respuesta) => {
        this.ObjRecepcionBienes = RecepcionBienes.fromJsonList(respuesta);
        if (this.ObjRecepcionBienes.length > 0) {
          this.empty = false;
          this.dataSource = new MatTableDataSource(this.ObjRecepcionBienes);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else {
          this.empty = true;
        }
        this.spinner.hide();
      }, err => {
        this.mostrarError('Error obteniendo las entradas de las recepciones de bienes');
        this.spinner.hide();
        console.log('Error obteniendo las entradas de las recepciones de bienes: ' + err);
      });
    }, err => {
      this.mostrarError('Error obteniendo el usuario actual');
      this.spinner.hide();
      console.log('Error obteniendo el usuario actual: ' + err);
    });
  }

  Guardar(item) {
    this.spinner.show();
    this.IdRecepcionBienes = item.IdRecepcionBienes;
    let objRegistrar;
    objRegistrar = {
      NumeroRecepcion: item.NumeroRecepcion,
      recibidoSap: true
    }
    if (item.NumeroRecepcion == null || item.NumeroRecepcion == '') {
      this.mostrarAdvertencia('Debe suministrar el número de recepción');
      this.spinner.hide();
      return false;
    }
    else {
      let index = this.ObjRecepcionBienes.findIndex(x => x.IdRecepcionBienes === item.IdRecepcionBienes);
      this.servicio.registrarRecepcionBienes(this.IdRecepcionBienes, objRegistrar).then(
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
