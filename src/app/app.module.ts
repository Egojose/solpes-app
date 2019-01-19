import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatRadioModule, MatFormFieldModule, MatAutocompleteModule, MatOptionModule, MatInputModule, MatTableModule, MatListModule, MatToolbarModule, MatPaginatorModule, MatExpansionModule } from '@angular/material';
import { Select2Module } from "ng-select2-component";
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ToastrModule } from 'ng6-toastr-notifications';

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
import { NumberDirective } from './directivas/numbers-only.directive';
import { BsModalService, ModalModule, ModalDirective, ModalBackdropComponent, TooltipModule, TypeaheadModule, TabsModule } from 'ngx-bootstrap';
import { RegistrarEntradasSapServiciosComponent } from './registrar-entradas-sap-servicios/registrar-entradas-sap-servicios.component';
import { MisPendientesComponent } from './mis-pendientes/mis-pendientes.component';
import { VerSolicitudTabComponent } from './ver-solicitud-tab/ver-solicitud-tab.component';

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
    RegistrarSolpSapComponent,
    NumberDirective,
    RegistrarEntradasSapServiciosComponent,
    MisPendientesComponent,
    VerSolicitudTabComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    Select2Module,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ModalModule,
    MatRadioModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatTableModule,
    MatListModule,
    MatOptionModule,
    MatInputModule,
    MatExpansionModule,
    TabsModule.forRoot(),
    MatToolbarModule,
    MatPaginatorModule,
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    ToastrModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    RouterModule.forRoot([
      {path:'',redirectTo:'/mis-solicitudes',pathMatch:'full'},
      {path:'aprobar-sondeo', component:AprobarSondeoComponent},
      {path:'consultar-solicitudes',component:ConsultarSolicitudesComponent},
      {path:'contratos', component:ContratosComponent},
      {path:'crear-solicitud', component:CrearSolicitudComponent},
      {path:'entrega-bienes', component:EntregaBienesComponent},
      {path:'entrega-servicios', component:EntregaServiciosComponent},
      {path:'mis-solicitudes', component:MisSolicitudesComponent},
      {path:'mis-pendientes', component:MisPendientesComponent},
      {path:'registrar-entradas-sap-bienes', component:RecepcionSapComponent},
      {path:'registrar-entradas-sap-servicios', component:RegistrarEntradasSapServiciosComponent},
      {path:'registrar-solp-sap', component:RegistrarSolpSapComponent},
      {path:'sondeo', component:SondeoComponent},
      {path:'verificar-material', component:VerificarMaterialComponent},
      { path: 'ver-solicitud-tab', component: VerSolicitudTabComponent }
    ])
  ],
  providers: [SPServicio, BsModalService, ModalBackdropComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
