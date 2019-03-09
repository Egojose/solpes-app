import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatRadioModule, MatFormFieldModule, MatAutocompleteModule, MatOptionModule, MatInputModule, MatTableModule, MatListModule, MatToolbarModule, MatPaginatorModule, MatExpansionModule, MatDialogModule, MatSelectModule } from '@angular/material';
import { Select2Module } from "ng-select2-component";
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ToastrModule } from 'ng6-toastr-notifications';
import { NgxCurrencyModule } from "ngx-currency";
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CacheInterceptor } from './http-interceptors/cacheInterceptor';

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
import { RegistrarSolpSapComponent } from './registrar-solp-sap/registrar-solp-sap.component';
import { SPServicio } from './servicios/sp-servicio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumberDirective } from './directivas/numbers-only.directive';
import { BsModalService, ModalModule, ModalBackdropComponent, TooltipModule, TypeaheadModule, TabsModule, AccordionModule, AlertModule } from 'ngx-bootstrap';
import { RegistrarEntradasSapServiciosComponent } from './registrar-entradas-sap-servicios/registrar-entradas-sap-servicios.component';
import { MisPendientesComponent } from './mis-pendientes/mis-pendientes.component';
import { VerSolicitudTabComponent } from './ver-solicitud-tab/ver-solicitud-tab.component';
import { EditarSolicitudComponent } from './editar-solicitud/editar-solicitud.component';
import { RegistroActivosComponent } from './registro-activos/registro-activos.component';
import { ReasignarComponent } from './reasignar/reasignar.component';
import { VistaContratosComponent } from './vista-contratos/vista-contratos.component';
import { ConsultaGeneralComponent } from './consulta-general/consulta-general.component';
import { ReportarContratosComponent } from './reportar-contratos/reportar-contratos.component';
import { ReportarSolicitudComponent } from './reportar-solicitud/reportar-solicitud.component';
import { ExcelService } from './servicios/excel.service';

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
    RegistrarSolpSapComponent,
    NumberDirective,
    RegistrarEntradasSapServiciosComponent,
    MisPendientesComponent,
    VerSolicitudTabComponent,
    EditarSolicitudComponent,
    RegistroActivosComponent,
    ReasignarComponent,
    VistaContratosComponent,
    ConsultaGeneralComponent,
    ReportarContratosComponent,
    ReportarSolicitudComponent
  ],
  entryComponents: [ReasignarComponent],
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
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatDialogModule,
    MatExpansionModule,
    AlertModule.forRoot(),
    NgxCurrencyModule,
    AccordionModule.forRoot(),
    TabsModule.forRoot(),
    MatToolbarModule,
    MatPaginatorModule,
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    ToastrModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    NgxSpinnerModule,
    RouterModule.forRoot([
      {path:'',redirectTo:'/mis-solicitudes',pathMatch:'full'},
      {path:'aprobar-sondeo', component:AprobarSondeoComponent},
      {path:'contratos', component:ContratosComponent},
      {path:'reasignar', component:ReasignarComponent},
      {path:'crear-solicitud', component:CrearSolicitudComponent},
      {path:'editar-solicitud', component:EditarSolicitudComponent},
      {path:'entrega-bienes', component:EntregaBienesComponent},
      {path:'entrega-servicios', component:EntregaServiciosComponent},
      {path:'mis-solicitudes', component:MisSolicitudesComponent},
      {path:'mis-pendientes', component:MisPendientesComponent},
      {path:'registrar-entradas-sap-bienes', component:RecepcionSapComponent},
      {path:'registrar-entradas-sap-servicios', component:RegistrarEntradasSapServiciosComponent},
      {path:'registrar-solp-sap', component:RegistrarSolpSapComponent},
      {path:'sondeo', component:SondeoComponent},
      {path:'verificar-material', component:VerificarMaterialComponent},
      {path:'ver-solicitud-tab', component: VerSolicitudTabComponent },
      {path:'registro-activos', component:RegistroActivosComponent},
      {path:'vista-contratos', component:VistaContratosComponent},
      {path:'consulta-general', component:ConsultaGeneralComponent},
      {path:'reportar-contratos', component:ReportarContratosComponent},
      {path:'reportar-solicitud', component:ReportarSolicitudComponent}
    ])
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }, SPServicio, BsModalService, ModalBackdropComponent, ExcelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
