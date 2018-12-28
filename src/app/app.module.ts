import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatRadioModule, MatRadioGroup, MatFormFieldModule, MatAutocompleteModule, MatOptionModule, MatInputModule } from '@angular/material';

import { AppComponent } from './app.component';
import { CrearSolicitudComponent } from './crear-solicitud/crear-solicitud.component';
import { SondeoComponent } from './sondeo/sondeo.component';
import { AprobarSondeoComponent } from './aprobar-sondeo/aprobar-sondeo.component';
import { VerificarMaterialComponent } from './verificar-material/verificar-material.component';
import { ContratosComponent } from './contratos/contratos.component';
import { EntregaBienesComponent } from './entrega-bienes/entrega-bienes.component';
import { EntregaServiciosComponent } from './entrega-servicios/entrega-servicios.component';
import { RecepcionSapComponent } from './recepcion-sap/recepcion-sap.component';
import { MisSolicitudesComponent } from './mis-solicitudes/mis-solicitudes.component';
import { ConsultarSolicitudesComponent } from './consultar-solicitudes/consultar-solicitudes.component';
import { RegistrarSolpSapComponent } from './registrar-solp-sap/registrar-solp-sap.component';
import { SPServicio } from './servicios/sp-servicio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    CrearSolicitudComponent,
    SondeoComponent,
    AprobarSondeoComponent,
    VerificarMaterialComponent,
    ContratosComponent,
    EntregaBienesComponent,
    EntregaServiciosComponent,
    RecepcionSapComponent,
    MisSolicitudesComponent,
    ConsultarSolicitudesComponent,
    RegistrarSolpSapComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatRadioModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatInputModule,
    RouterModule.forRoot([
      {path:'',redirectTo:'/mis-solicitudes',pathMatch:'full'},
      {path:'aprobar-sondeo', component:AprobarSondeoComponent},
      {path:'consultar-solicitudes',component:ConsultarSolicitudesComponent},
      {path:'contratos', component:ContratosComponent},
      {path:'crear-solicitud', component:CrearSolicitudComponent},
      {path:'entrega-bienes', component:EntregaBienesComponent},
      {path:'entrega-servicios', component:EntregaServiciosComponent},
      {path:'mis-solicitudes', component:MisSolicitudesComponent},
      {path:'recepcion-sap', component:RecepcionSapComponent},
      {path:'registrar-solp-sap', component:RegistrarSolpSapComponent},
      {path:'sondeo', component:SondeoComponent},
      {path:'verificar-material', component:VerificarMaterialComponent}
    ])
  ],
  providers: [SPServicio],
  bootstrap: [AppComponent]
})
export class AppModule { }
