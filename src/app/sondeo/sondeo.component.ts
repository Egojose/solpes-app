import { Component, OnInit } from '@angular/core';
import { SPServicio } from '../servicios/sp-servicio';
import { CondicionContractual } from '../dominio/condicionContractual';
import { CondicionesTecnicasBienes } from '../sondeo/condicionesTecnicasBienes';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CondicionTecnicaServicios } from '../sondeo/condicionesTecnicasServicios';
import { ItemAddResult } from 'sp-pnp-js';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from '../dominio/usuario';

@Component({
  selector: 'app-sondeo',
  templateUrl: './sondeo.component.html',
  styleUrls: ['./sondeo.component.css']
})
export class SondeoComponent implements OnInit {

  name = new FormControl('');
  ObjSolicitud: any;
  condicionesContractuales: CondicionContractual[] = [];
  fechaDeseada: Date;
  solicitante: string;
  ordenadorGasto: string;
  empresa: string;
  pais: string;
  categoria: string;
  subCategoria: string;
  comprador: string;
  justificacion: string;
  alcance: string;
  ObjCondicionesContractuales: any;
  IdSolicitud: any;
  ObjCondicionesTecnicas: CondicionesTecnicasBienes[] = [];
  ObjCondicionesTecnicasServicios: CondicionTecnicaServicios[] = [];
  AgregarElementoForm: FormGroup;
  RDBOrdenadorGastos: any;
  numeroSolpSap: string;
  ComentarioRegistrarSap: string;
  submitted = false;
  IdSolicitudParms: any;
  ComentarioSondeo: string;
  comentarioSondeo: any;
  historial: string;
  usuario: Usuario;
  sondeo: FormGroup;
  contadorControlesCTB: number;

  constructor(private servicio: SPServicio, private formBuilder: FormBuilder, private activarRoute: ActivatedRoute) {
    this.IdSolicitudParms = sessionStorage.getItem("IdSolicitud");
    this.contadorControlesCTB = 0;
  }

  RegistrarFormulario() {
    this.sondeo = this.formBuilder.group({
      comentarioGeneral: ['']
    });
  }

  GuardarSondeoBienes() {
    debugger;
    let objSondeo;
    let contador = 0;
    let comentarioGeneral = this.sondeo.controls["comentarioGeneral"].value;
    for (let i = 0; i < this.contadorControlesCTB; i++) {
      let cantidad = parseInt(this.sondeo.controls["cantidad" + i].value);
      let precio = this.sondeo.controls["precio" + i].value;
      let codigo = (this.sondeo.controls["codigo" + i].value).toString();
      let comentario = this.sondeo.controls["comentario" + i].value;

      objSondeo = {
        CodigoSondeo: codigo,
        CantidadSondeo: cantidad,
        PrecioSondeo: precio,
        Comentarios: comentario
      }

      this.servicio.guardarSondeoBienes(this.IdSolicitud, objSondeo).then(
        (resultado: ItemAddResult) => {
          contador++
          if (contador === this.contadorControlesCTB) {
            alert('se guardó el sondeo');
          }
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      )
    }
  }

  ngOnInit() {
    console.log(this.IdSolicitudParms);
    this.RegistrarFormulario();
    this.ObtenerUsuarioActual();
  }

  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        this.usuario = new Usuario(Response.Title, Response.email, Response.Id);
        this.ObtenerSolicitudBienesServicios();
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
      }
    )
  }

  ObtenerSolicitudBienesServicios() {
    this.servicio.ObtenerSolicitudBienesServicios(1).subscribe(
      solicitud => {
        this.IdSolicitud = solicitud.Id;
        this.fechaDeseada = solicitud.FechaDeseadaEntrega;
        this.solicitante = solicitud.Solicitante;
        this.ordenadorGasto = solicitud.OrdenadorGastos.Title;
        this.empresa = solicitud.Empresa.Title;
        this.pais = solicitud.Pais.Title;
        this.categoria = solicitud.Categoria;
        this.subCategoria = solicitud.Categoria;
        this.comprador = solicitud.Comprador;
        this.alcance = solicitud.Alcance;
        this.justificacion = solicitud.Justificacion;
        this.comentarioSondeo = solicitud.ComentarioSondeo;
        this.condicionesContractuales = JSON.parse(solicitud.CondicionesContractuales).condiciones;
        this.servicio.ObtenerCondicionesTecnicasBienes(this.IdSolicitud).subscribe(
          RespuestaCondiciones => {
            this.ObjCondicionesTecnicas = CondicionesTecnicasBienes.fromJsonList(RespuestaCondiciones);
            this.ObjCondicionesTecnicas.forEach(element => {
              this.sondeo.addControl("cantidad" + this.contadorControlesCTB, new FormControl());
              this.sondeo.controls["cantidad" + this.contadorControlesCTB].setValue(element.cantidad);
              this.sondeo.addControl("precio" + this.contadorControlesCTB, new FormControl());
              this.sondeo.controls["precio" + this.contadorControlesCTB].setValue(element.cantidad);
              this.sondeo.addControl("codigo" + this.contadorControlesCTB, new FormControl());
              this.sondeo.controls["codigo" + this.contadorControlesCTB].setValue(element.cantidad);
              this.sondeo.addControl("comentario" + this.contadorControlesCTB, new FormControl());
              this.sondeo.controls["comentario" + this.contadorControlesCTB].setValue(element.cantidad);
              this.contadorControlesCTB++;
            });
          }
        )
        this.servicio.ObtenerCondicionesTecnicasServicios(this.IdSolicitud).subscribe(
          RespuestaCondicionesServicios => {
            this.ObjCondicionesTecnicasServicios = CondicionTecnicaServicios.fromJsonList(RespuestaCondicionesServicios);
            this.ObjCondicionesTecnicasServicios.forEach(element => {
              this.sondeo.addControl("cantidadServicio" + this.contadorControlesCTB, new FormControl());
              this.sondeo.controls["cantidadServicio" + this.contadorControlesCTB].setValue(element.cantidad);
              this.sondeo.addControl("precioServicio" + this.contadorControlesCTB, new FormControl());
              this.sondeo.controls["precioServicio" + this.contadorControlesCTB].setValue(element.cantidad);
              this.sondeo.addControl("codigoServicio" + this.contadorControlesCTB, new FormControl());
              this.sondeo.controls["codigoServicio" + this.contadorControlesCTB].setValue(element.cantidad);
              this.sondeo.addControl("comentarioServicio" + this.contadorControlesCTB, new FormControl());
              this.sondeo.controls["comentarioServicio" + this.contadorControlesCTB].setValue(element.cantidad);
              this.contadorControlesCTB++;
            })

          }
        )
      }
    );
  }
}
