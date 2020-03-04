import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Usuario } from '../dominio/usuario';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { SPServicio } from '../servicios/sp-servicio';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { EmailProperties } from 'sp-pnp-js';

@Component({
  selector: 'app-verificar-firmar-contrato',
  templateUrl: './verificar-firmar-contrato.component.html',
  styleUrls: ['./verificar-firmar-contrato.component.css']
})
export class VerificarFirmarContratoComponent implements OnInit {

  constructor(private servicio: SPServicio, private router: Router,public toastr: ToastrManager, public dialog: MatDialog, private spinner: NgxSpinnerService, private formBuilder: FormBuilder) { }

  usuarioActual: Usuario;
  displayedColumns: string[] = ['Consecutivo', 'NroSolpSap', 'ObjetoContrato', 'TipoContrato', 'Acciones'];
  dataSource;


  ngOnInit() {
    this.obtenerContratosNoFormalizados()
  }


  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        this.usuarioActual = new Usuario(Response.Title, Response.email, Response.Id);
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
        this.spinner.hide();
      }
    )
  }

  obtenerContratosNoFormalizados() {
    this.servicio.ObtenerContratosNoVerificados().then(
      (respuesta) => {
        console.log(respuesta);
        this.dataSource = new MatTableDataSource(respuesta);
      }
    )
  }

  VerContrato(contrato) {
    sessionStorage.setItem('contrato', JSON.stringify(contrato));
    console.log(contrato);
    // this.router.navigate(['/ver-solicitud-tab']);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
